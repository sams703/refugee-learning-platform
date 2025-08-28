const express = require('express')
const { getDatabase } = require('../database/init')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/assessments/lesson/:lessonId
// @desc    Get assessment for lesson
// @access  Private
router.get('/lesson/:lessonId', protect, async (req, res, next) => {
  try {
    const db = getDatabase()
    const assessment = await db('assessments')
      .where({ lesson_id: req.params.lessonId })
      .first()

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }

    res.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
