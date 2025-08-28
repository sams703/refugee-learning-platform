const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const { getDatabase } = require('../database/init')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  })
}

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Invalid role')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const {
      username,
      email,
      phone_number,
      password,
      first_name,
      last_name,
      date_of_birth,
      gender,
      role = 'student',
      preferred_language = 'en',
      location,
      camp_name
    } = req.body

    const db = getDatabase()

    // Check if user exists
    const existingUser = await db('users')
      .where({ username })
      .orWhere('email', email)
      .first()

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this username or email already exists'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Create user
    const userId = uuidv4()
    const user = await db('users').insert({
      id: userId,
      username,
      email,
      phone_number,
      first_name,
      last_name,
      password_hash,
      date_of_birth,
      gender,
      role,
      preferred_language,
      location,
      camp_name,
      sync_token: uuidv4()
    }).returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'preferred_language', 'location', 'camp_name'])

    const token = generateToken(userId)

    res.status(201).json({
      success: true,
      token,
      user: user[0] || {
        id: userId,
        username,
        email,
        first_name,
        last_name,
        role,
        preferred_language,
        location,
        camp_name
      }
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { username, password } = req.body

    const db = getDatabase()

    // Check for user
    const user = await db('users')
      .where({ username })
      .orWhere({ email: username })
      .first()

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is inactive'
      })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Update last sync time
    await db('users')
      .where({ id: user.id })
      .update({
        last_sync_at: new Date(),
        updated_at: new Date()
      })

    const token = generateToken(user.id)

    // Remove password hash from response
    const { password_hash, ...userResponse } = user

    res.json({
      success: true,
      token,
      user: userResponse
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const { password_hash, sync_token, ...userResponse } = req.user

    res.json({
      success: true,
      user: userResponse
    })
  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('email').optional().isEmail().withMessage('Please include a valid email'),
  body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().notEmpty().withMessage('Last name cannot be empty')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const {
      email,
      phone_number,
      first_name,
      last_name,
      date_of_birth,
      gender,
      preferred_language,
      location,
      camp_name
    } = req.body

    const db = getDatabase()

    // Check if email is being changed and if it already exists
    if (email && email !== req.user.email) {
      const existingUser = await db('users').where({ email }).first()
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        })
      }
    }

    const updateData = {}
    if (email !== undefined) updateData.email = email
    if (phone_number !== undefined) updateData.phone_number = phone_number
    if (first_name !== undefined) updateData.first_name = first_name
    if (last_name !== undefined) updateData.last_name = last_name
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth
    if (gender !== undefined) updateData.gender = gender
    if (preferred_language !== undefined) updateData.preferred_language = preferred_language
    if (location !== undefined) updateData.location = location
    if (camp_name !== undefined) updateData.camp_name = camp_name
    
    updateData.updated_at = new Date()
    updateData.sync_token = uuidv4()

    await db('users')
      .where({ id: req.user.id })
      .update(updateData)

    const updatedUser = await db('users')
      .where({ id: req.user.id })
      .select(['id', 'username', 'email', 'phone_number', 'first_name', 'last_name', 'date_of_birth', 'gender', 'role', 'preferred_language', 'location', 'camp_name', 'is_active', 'created_at', 'updated_at'])
      .first()

    res.json({
      success: true,
      user: updatedUser
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
