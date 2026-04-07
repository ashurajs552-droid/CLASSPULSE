-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    face_embedding VECTOR(512), -- Requires pgvector extension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK (status IN ('present', 'absent', 'late')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: engagement_data
CREATE TABLE IF NOT EXISTS engagement_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    attention_score FLOAT CHECK (attention_score >= 0 AND attention_score <= 1),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: phone_detection
CREATE TABLE IF NOT EXISTS phone_detection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    detected BOOLEAN DEFAULT TRUE
);

-- Table: reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Note: Storage buckets should be created via Supabase Dashboard or CLI
-- Bucket: classroom_videos
