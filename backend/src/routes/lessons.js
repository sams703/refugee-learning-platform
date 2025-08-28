const express = require('express')
const { getDatabase } = require('../database/init')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/lessons/:id
// @desc    Get lesson content
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const db = getDatabase()
    const lesson = await db('lessons')
      .where({ id: req.params.id })
      .first()

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      })
    }

    res.json({
      success: true,
      data: lesson
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
