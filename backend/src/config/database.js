const path = require('path')
require('dotenv').config()

const config = {
  development: {
    client: process.env.DB_TYPE || 'sqlite3',
    connection: {
      filename: path.join(__dirname, '../../data/development.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    }
  },
  
  production: {
    client: process.env.DB_TYPE || 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    }
  }
}

module.exports = config[process.env.NODE_ENV || 'development']
