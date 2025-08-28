const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const { createServer } = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const config = require('./config/database')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const courseRoutes = require('./routes/courses')
const lessonRoutes = require('./routes/lessons')
const progressRoutes = require('./routes/progress')
const assessmentRoutes = require('./routes/assessments')
const badgeRoutes = require('./routes/badges')
const syncRoutes = require('./routes/sync')
const errorHandler = require('./middleware/errorHandler')
const { initializeDatabase } = require('./database/init')

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
})

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}))

// Body parsing and compression
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/assessments', assessmentRoutes)
app.use('/api/badges', badgeRoutes)
app.use('/api/sync', syncRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  socket.on('progress-update', (data) => {
    // Broadcast progress updates to teachers/admins
    socket.to('teachers').emit('student-progress', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Make io available to routes
app.set('io', io)

// Error handling middleware (must be last)
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist.`
  })
})

const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('Database initialized successfully')

    // Start server
    server.listen(PORT, () => {
      console.log(`
🚀 Digital Learning Platform API Server Started
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📚 Database: ${process.env.DB_TYPE || 'sqlite'}
⏰ Started at: ${new Date().toISOString()}
      `)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

if (require.main === module) {
  startServer()
}

module.exports = { app, server, io }
