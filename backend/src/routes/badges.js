const express = require('express')
const { getDatabase } = require('../database/init')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/badges/user/:userId
// @desc    Get user badges
// @access  Private
router.get('/user/:userId', protect, async (req, res, next) => {
  try {
    const db = getDatabase()
    const badges = await db('user_badges')
      .where({ user_id: req.params.userId })
      .join('badges', 'user_badges.badge_id', 'badges.id')
      .select(['badges.*', 'user_badges.earned_at'])

    res.json({
      success: true,
      data: badges
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
