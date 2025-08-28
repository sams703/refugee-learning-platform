const knex = require('knex')
const config = require('../config/database')
const fs = require('fs').promises
const path = require('path')

let db

async function initializeDatabase() {
  try {
    // Ensure data directory exists for SQLite
    if (config.client === 'sqlite3') {
      const dataDir = path.dirname(config.connection.filename)
      try {
        await fs.mkdir(dataDir, { recursive: true })
      } catch (error) {
        if (error.code !== 'EEXIST') throw error
      }
    }

    // Initialize Knex
    db = knex(config)
    
    // Run migrations
    await db.migrate.latest()
    console.log('Database migrations completed')

    // Run seeds in development
    if (process.env.NODE_ENV === 'development') {
      await db.seed.run()
      console.log('Database seeds completed')
    }

    return db
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

async function closeDatabase() {
  if (db) {
    await db.destroy()
    db = null
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
}
