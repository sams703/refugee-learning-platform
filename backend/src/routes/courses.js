const express = require('express')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const { getDatabase } = require('../database/init')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { category, difficulty_level, search, page = 1, limit = 20 } = req.query
    
    const db = getDatabase()
    let query = db('courses')
      .where({ is_published: true })
      .select([
        'id', 'title', 'description', 'category', 'difficulty_level',
        'estimated_duration', 'thumbnail_url', 'is_offline_available',
        'created_at'
      ])

    // Apply filters
    if (category) {
      query = query.where({ category })
    }
    
    if (difficulty_level) {
      query = query.where({ difficulty_level })
    }
    
    if (search) {
      query = query.where('title', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit)
    query = query.limit(parseInt(limit)).offset(offset)

    const courses = await query.orderBy('created_at', 'desc')
    
    // Get total count for pagination
    const totalQuery = db('courses').where({ is_published: true })
    if (category) totalQuery.where({ category })
    if (difficulty_level) totalQuery.where({ difficulty_level })
    if (search) {
      totalQuery.where('title', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`)
    }
    
    const total = await totalQuery.count('id as count').first()

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / parseInt(limit))
      }
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/courses/:id
// @desc    Get single course with lessons
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDatabase()
    
    const course = await db('courses')
      .where({ id: req.params.id, is_published: true })
      .first()

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      })
    }

    // Get lessons for this course
    const lessons = await db('lessons')
      .where({ course_id: course.id })
      .select(['id', 'title', 'description', 'content_type', 'order_index', 'duration', 'is_mandatory'])
      .orderBy('order_index', 'asc')

    res.json({
      success: true,
      data: {
        ...course,
        lessons
      }
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/courses
// @desc    Create new course
// @access  Private (Teacher/Admin)
router.post('/', protect, authorize('teacher', 'admin'), [
  body('title').notEmpty().withMessage('Course title is required'),
  body('description').notEmpty().withMessage('Course description is required'),
  body('category').isIn(['basic-education', 'digital-skills', 'entrepreneurship']).withMessage('Invalid category'),
  body('difficulty_level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level')
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
      title,
      description,
      category,
      difficulty_level,
      estimated_duration,
      thumbnail_url,
      is_offline_available = true
    } = req.body

    const db = getDatabase()
    
    const courseId = uuidv4()
    await db('courses').insert({
      id: courseId,
      title,
      description,
      category,
      difficulty_level,
      estimated_duration,
      thumbnail_url,
      is_offline_available,
      created_by: req.user.id,
      sync_token: uuidv4()
    })

    const course = await db('courses')
      .where({ id: courseId })
      .select(['id', 'title', 'description', 'category', 'difficulty_level', 'estimated_duration', 'thumbnail_url', 'is_offline_available', 'is_published', 'created_at'])
      .first()

    res.status(201).json({
      success: true,
      data: course
    })
  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/courses/:id/publish
// @desc    Publish/unpublish course
// @access  Private (Teacher/Admin)
router.put('/:id/publish', protect, authorize('teacher', 'admin'), async (req, res, next) => {
  try {
    const { is_published } = req.body
    const db = getDatabase()
    
    const course = await db('courses')
      .where({ id: req.params.id })
      .first()

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      })
    }

    // Check if user owns the course or is admin
    if (course.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this course'
      })
    }

    await db('courses')
      .where({ id: req.params.id })
      .update({
        is_published: Boolean(is_published),
        updated_at: new Date(),
        sync_token: uuidv4()
      })

    const updatedCourse = await db('courses')
      .where({ id: req.params.id })
      .select(['id', 'title', 'description', 'category', 'difficulty_level', 'estimated_duration', 'thumbnail_url', 'is_offline_available', 'is_published', 'updated_at'])
      .first()

    res.json({
      success: true,
      data: updatedCourse
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
