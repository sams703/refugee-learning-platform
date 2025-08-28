# Database Schema Design

## Overview
This document outlines the database schema for the Digital Learning Platform, designed to support offline-first architecture with efficient synchronization.

## Core Tables

### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    role VARCHAR(20) DEFAULT 'student', -- student, teacher, admin
    preferred_language VARCHAR(5) DEFAULT 'en',
    location VARCHAR(100),
    camp_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sync_at TIMESTAMP,
    sync_token VARCHAR(100)
);
```

### Courses
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- basic-education, digital-skills, entrepreneurship
    difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
    estimated_duration INTEGER, -- in minutes
    thumbnail_url VARCHAR(500),
    is_offline_available BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100)
);
```

### Lessons
```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(20), -- video, text, interactive, quiz
    content_data JSONB, -- stores lesson content based on type
    order_index INTEGER NOT NULL,
    duration INTEGER, -- in minutes
    is_mandatory BOOLEAN DEFAULT true,
    prerequisites JSONB, -- array of lesson IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100)
);
```

### User Progress
```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    last_accessed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100),
    UNIQUE(user_id, lesson_id)
);
```

### Assessments (Quizzes)
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL, -- array of question objects
    passing_score INTEGER DEFAULT 70,
    max_attempts INTEGER DEFAULT 3,
    time_limit INTEGER, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100)
);
```

### User Assessment Attempts
```sql
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    answers JSONB NOT NULL, -- user's answers
    score INTEGER,
    passed BOOLEAN,
    time_taken INTEGER, -- in seconds
    attempt_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100)
);
```

### Gamification - Badges
```sql
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    criteria JSONB, -- conditions to earn the badge
    points INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100)
);
```

### User Badges
```sql
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100),
    UNIQUE(user_id, badge_id)
);
```

### Content Translations
```sql
CREATE TABLE content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(20), -- course, lesson, assessment
    content_id UUID NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    field_name VARCHAR(50) NOT NULL, -- title, description, content_data
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_token VARCHAR(100),
    UNIQUE(content_type, content_id, language_code, field_name)
);
```

### Offline Sync Management
```sql
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    table_name VARCHAR(50),
    record_id UUID,
    operation VARCHAR(10), -- INSERT, UPDATE, DELETE
    sync_status VARCHAR(20) DEFAULT 'pending', -- pending, synced, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP,
    error_message TEXT
);
```

## Indexes for Performance

```sql
-- User performance indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_last_sync ON users(last_sync_at);

-- Course and lesson indexes
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_lessons_course_order ON lessons(course_id, order_index);

-- Progress tracking indexes
CREATE INDEX idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);

-- Assessment indexes
CREATE INDEX idx_assessment_attempts_user ON assessment_attempts(user_id);
CREATE INDEX idx_assessment_attempts_score ON assessment_attempts(score);

-- Sync indexes
CREATE INDEX idx_sync_logs_status ON sync_logs(sync_status);
CREATE INDEX idx_sync_logs_created ON sync_logs(created_at);
```

## Offline-First Considerations

1. **Sync Tokens**: Each table includes a `sync_token` for conflict resolution
2. **UUID Primary Keys**: Ensures no conflicts when syncing offline-created records
3. **Timestamps**: Track creation, updates, and sync times
4. **JSONB Fields**: Flexible content storage for different lesson types
5. **Sync Logs**: Track all changes for proper synchronization

## Data Relationships

- Users can enroll in multiple courses
- Courses contain multiple lessons in order
- User progress is tracked per lesson and course
- Assessments are linked to specific lessons
- Badges are earned based on various criteria
- All content supports multiple languages through translations

This schema supports the offline-first architecture while maintaining data integrity and enabling efficient synchronization when connectivity is available.
