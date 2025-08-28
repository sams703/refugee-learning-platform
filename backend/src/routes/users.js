const express = require('express')
const { getDatabase } = require('../database/init')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const db = getDatabase()
    const users = await db('users')
      .select(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'location', 'camp_name', 'is_active', 'created_at'])
      .orderBy('created_at', 'desc')

    res.json({
      success: true,
      data: users
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
