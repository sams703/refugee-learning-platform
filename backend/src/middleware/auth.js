const jwt = require('jsonwebtoken')
const { getDatabase } = require('../database/init')

const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key')
      
      const db = getDatabase()
      const user = await db('users').where({ id: decoded.id }).first()

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'No user found with this token'
        })
      }

      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          error: 'User account is inactive'
        })
      }

      req.user = user
      next()
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      })
    }
  } catch (error) {
    next(error)
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      })
    }
    next()
  }
}

module.exports = { protect, authorize }
