exports.up = function(knex) {
  return knex.schema
    // Users table
    .createTable('users', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.string('username', 50).unique().notNullable()
      table.string('email', 100).unique()
      table.string('phone_number', 20)
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('password_hash').notNullable()
      table.date('date_of_birth')
      table.string('gender', 10)
      table.string('role', 20).defaultTo('student')
      table.string('preferred_language', 5).defaultTo('en')
      table.string('location', 100)
      table.string('camp_name', 100)
      table.boolean('is_active').defaultTo(true)
      table.timestamps(true, true)
      table.timestamp('last_sync_at')
      table.string('sync_token', 100)
    })
    
    // Courses table
    .createTable('courses', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.string('title', 200).notNullable()
      table.text('description')
      table.string('category', 50)
      table.string('difficulty_level', 20)
      table.integer('estimated_duration')
      table.string('thumbnail_url', 500)
      table.boolean('is_offline_available').defaultTo(true)
      table.uuid('created_by').references('id').inTable('users')
      table.boolean('is_published').defaultTo(false)
      table.timestamps(true, true)
      table.string('sync_token', 100)
    })
    
    // Lessons table
    .createTable('lessons', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.uuid('course_id').references('id').inTable('courses').onDelete('CASCADE')
      table.string('title', 200).notNullable()
      table.text('description')
      table.string('content_type', 20)
      table.json('content_data')
      table.integer('order_index').notNullable()
      table.integer('duration')
      table.boolean('is_mandatory').defaultTo(true)
      table.json('prerequisites')
      table.timestamps(true, true)
      table.string('sync_token', 100)
    })
    
    // User Progress table
    .createTable('user_progress', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('lesson_id').references('id').inTable('lessons').onDelete('CASCADE')
      table.uuid('course_id').references('id').inTable('courses').onDelete('CASCADE')
      table.string('status', 20).defaultTo('not_started')
      table.integer('progress_percentage').defaultTo(0)
      table.integer('time_spent').defaultTo(0)
      table.timestamp('last_accessed_at')
      table.timestamp('completed_at')
      table.timestamps(true, true)
      table.string('sync_token', 100)
      table.unique(['user_id', 'lesson_id'])
    })
    
    // Assessments table
    .createTable('assessments', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.uuid('lesson_id').references('id').inTable('lessons').onDelete('CASCADE')
      table.string('title', 200).notNullable()
      table.text('description')
      table.json('questions').notNullable()
      table.integer('passing_score').defaultTo(70)
      table.integer('max_attempts').defaultTo(3)
      table.integer('time_limit')
      table.timestamps(true, true)
      table.string('sync_token', 100)
    })
    
    // Assessment Attempts table
    .createTable('assessment_attempts', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('assessment_id').references('id').inTable('assessments').onDelete('CASCADE')
      table.json('answers').notNullable()
      table.integer('score')
      table.boolean('passed')
      table.integer('time_taken')
      table.integer('attempt_number')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.string('sync_token', 100)
    })
    
    // Badges table
    .createTable('badges', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.string('name', 100).notNullable()
      table.text('description')
      table.string('icon_url', 500)
      table.json('criteria')
      table.integer('points').defaultTo(0)
      table.string('rarity', 20).defaultTo('common')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.string('sync_token', 100)
    })
    
    // User Badges table
    .createTable('user_badges', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('badge_id').references('id').inTable('badges').onDelete('CASCADE')
      table.timestamp('earned_at').defaultTo(knex.fn.now())
      table.string('sync_token', 100)
      table.unique(['user_id', 'badge_id'])
    })
    
    // Content Translations table
    .createTable('content_translations', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.string('content_type', 20)
      table.uuid('content_id').notNullable()
      table.string('language_code', 5).notNullable()
      table.string('field_name', 50).notNullable()
      table.text('translated_text').notNullable()
      table.timestamps(true, true)
      table.string('sync_token', 100)
      table.unique(['content_type', 'content_id', 'language_code', 'field_name'])
    })
    
    // Sync Logs table
    .createTable('sync_logs', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))'))
      table.uuid('user_id').references('id').inTable('users')
      table.string('table_name', 50)
      table.uuid('record_id')
      table.string('operation', 10)
      table.string('sync_status', 20).defaultTo('pending')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('synced_at')
      table.text('error_message')
    })
    
    // Create indexes
    .then(() => {
      return Promise.all([
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)'),
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_users_location ON users(location)'),
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category)'),
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published)'),
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON lessons(course_id, order_index)'),
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id)'),
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status)'),
        knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(sync_status)')
      ])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('sync_logs')
    .dropTableIfExists('content_translations')
    .dropTableIfExists('user_badges')
    .dropTableIfExists('badges')
    .dropTableIfExists('assessment_attempts')
    .dropTableIfExists('assessments')
    .dropTableIfExists('user_progress')
    .dropTableIfExists('lessons')
    .dropTableIfExists('courses')
    .dropTableIfExists('users')
}
