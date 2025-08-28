const express = require('express')
const { getDatabase } = require('../database/init')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/progress/user/:userId
// @desc    Get user progress
// @access  Private
router.get('/user/:userId', protect, async (req, res, next) => {
  try {
    const db = getDatabase()
    const progress = await db('user_progress')
      .where({ user_id: req.params.userId })
      .join('courses', 'user_progress.course_id', 'courses.id')
      .select(['user_progress.*', 'courses.title as course_title'])

    res.json({
      success: true,
      data: progress
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
