const express = require('express')
const { getDatabase } = require('../database/init')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/sync
// @desc    Sync offline data
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { data, last_sync } = req.body

    res.json({
      success: true,
      message: 'Sync functionality coming soon',
      data: {
        synced: true,
        last_sync: new Date()
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
