-- ============================================================================
-- Placement OS - Supabase PostgreSQL Schema Definition
-- Complete Career Operating System (10-table schema supporting Dual Sync)
-- ============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROADMAP NODES (Read-only reference data extracted from Master Graph)
CREATE TABLE IF NOT EXISTS roadmap_nodes (
    id VARCHAR(10) PRIMARY KEY, -- e.g. '01', '02', ..., '38'
    code VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    track VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    est_hours INTEGER NOT NULL DEFAULT 0,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    unlocks JSONB DEFAULT '[]'::jsonb,
    done_criteria TEXT,
    description TEXT,
    key_topics JSONB DEFAULT '[]'::jsonb,
    roi_score VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GENERAL EVENTS TABLE (ONE table for study sessions, aptitude/coding tests, interviews, mock interviews, exams, deadlines, milestones, etc.)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'study', 'aptitude_test', 'coding_test', 'technical_interview', 'hr_interview', 'mock_interview', 'college_exam', 'placement_exam', 'application_deadline', 'networking', 'project_milestone', 'other'
    date DATE NOT NULL,
    start_time VARCHAR(20), -- HH:mm
    end_time VARCHAR(20),
    duration_minutes INTEGER DEFAULT 60,
    company VARCHAR(255),
    role VARCHAR(255),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'missed', 'cancelled'
    priority VARCHAR(50),
    link TEXT,
    location TEXT,
    notes TEXT,
    roadmap_node_id VARCHAR(10) REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast date range queries in calendar/planner
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- 3. APPLICATIONS TABLE (Job application and internship pipeline)
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(100) PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    channel VARCHAR(100) DEFAULT 'Campus', -- 'Referral', 'Alumni', 'Targeted Off-campus', 'Internship', 'Campus', 'Cold application'
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline DATE,
    resume_version VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'applied', -- 'discovered', 'preparing', 'applied', 'oa', 'technical', 'interview', 'offer', 'rejected', 'withdrawn', 'closed'
    job_link TEXT,
    package_lpa NUMERIC(6, 2),
    referral VARCHAR(255),
    oa_date DATE,
    interview_date DATE,
    current_stage VARCHAR(100),
    next_action TEXT,
    follow_up_date DATE,
    is_internship BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company);

-- 4. PROJECTS TABLE (User project capital and defensibility audits)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL, -- 'tier1', 'tier2', 'tier3', 'tier4'
    tier_label VARCHAR(100),
    is_flagship BOOLEAN DEFAULT FALSE,
    technologies JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress', -- 'Planning', 'In Progress', 'Completed', 'Deployed'
    github_url TEXT,
    live_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    deployment VARCHAR(255),
    has_readme BOOLEAN DEFAULT TRUE,
    has_tests BOOLEAN DEFAULT FALSE,
    defensibility JSONB DEFAULT '{}'::jsonb,
    resume_status VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDY SESSIONS TABLE (Detailed topic log & study tracking linked to an event or standalone)
CREATE TABLE IF NOT EXISTS study_sessions (
    id VARCHAR(100) PRIMARY KEY,
    event_id VARCHAR(100) REFERENCES events(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    duration_minutes INTEGER DEFAULT 60,
    key_learnings TEXT,
    questions_solved INTEGER DEFAULT 0,
    roadmap_node_id VARCHAR(10) REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEST RESULTS TABLE (Post-test score breakdown & mistake analysis)
CREATE TABLE IF NOT EXISTS test_results (
    id VARCHAR(100) PRIMARY KEY,
    event_id VARCHAR(100) REFERENCES events(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    test_type VARCHAR(50) NOT NULL,
    score NUMERIC(6, 2),
    max_score NUMERIC(6, 2),
    percentage NUMERIC(5, 2),
    questions_count INTEGER,
    correct_count INTEGER,
    incorrect_count INTEGER,
    skipped_count INTEGER,
    weak_topics JSONB DEFAULT '[]'::jsonb,
    test_mistakes_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INTERVIEW NOTES TABLE (Interview debriefs, real experience, STAR-L stories)
CREATE TABLE IF NOT EXISTS interview_notes (
    id VARCHAR(100) PRIMARY KEY,
    event_id VARCHAR(100) REFERENCES events(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    round VARCHAR(50) NOT NULL,
    interviewer VARCHAR(255),
    questions_asked JSONB DEFAULT '[]'::jsonb,
    what_went_well TEXT,
    what_went_badly TEXT,
    topics_tested JSONB DEFAULT '[]'::jsonb,
    mistakes TEXT,
    lessons TEXT,
    next_action TEXT,
    verdict VARCHAR(50) DEFAULT 'Pending',
    mock_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NETWORK CONTACTS TABLE (Seniors, alumni, mentors, recruiters)
CREATE TABLE IF NOT EXISTS network_contacts (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    connection_type VARCHAR(100) NOT NULL, -- 'Senior', 'Alumni', 'Professor', 'Internship Colleague', 'Recruiter', 'Mentor', 'Peer'
    date_contacted DATE,
    last_contact DATE,
    next_action TEXT,
    follow_up_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Not contacted', -- 'Not contacted', 'Contacted', 'Replied', 'Conversation', 'Follow-up', 'Relationship'
    notes TEXT,
    linkedin_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FAILURE LOG TABLE (Feedback loop for failures in tests/interviews/drills)
CREATE TABLE IF NOT EXISTS failure_logs (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Aptitude', 'DSA', 'CS Fundamentals', 'Project Explanation', 'Communication', 'Behavioral', 'Application / Resume', 'Interview Pressure', 'Time Management'
    source_type VARCHAR(50) NOT NULL, -- 'interview', 'oa_test', 'mock', 'application', 'practice'
    source_id VARCHAR(100),
    company_or_context VARCHAR(255),
    root_cause TEXT NOT NULL,
    next_fix_action TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open', -- 'Open', 'Working', 'Resolved'
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    resolved_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. USER SETTINGS TABLE (Single user settings, manifestation profile, node progress, daily focus)
CREATE TABLE IF NOT EXISTS user_settings (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'default_user',
    user_name VARCHAR(255) DEFAULT 'Candidate',
    target_package VARCHAR(100) DEFAULT '₹10–20L+ (Barbell to ₹25L+)',
    target_dream VARCHAR(255) DEFAULT 'Google / Top Product Companies',
    target_year VARCHAR(20) DEFAULT '2027',
    manifestation JSONB DEFAULT '{}'::jsonb,
    node_progress JSONB DEFAULT '{}'::jsonb,
    daily_focus JSONB DEFAULT '{}'::jsonb,
    bingo_progress JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop existing policies to avoid duplicates, then recreate
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on roadmap_nodes') THEN
    DROP POLICY "Allow public select on roadmap_nodes" ON roadmap_nodes;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on events') THEN
    DROP POLICY "Allow public all on events" ON events;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on applications') THEN
    DROP POLICY "Allow public all on applications" ON applications;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on projects') THEN
    DROP POLICY "Allow public all on projects" ON projects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on study_sessions') THEN
    DROP POLICY "Allow public all on study_sessions" ON study_sessions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on test_results') THEN
    DROP POLICY "Allow public all on test_results" ON test_results;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on interview_notes') THEN
    DROP POLICY "Allow public all on interview_notes" ON interview_notes;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on network_contacts') THEN
    DROP POLICY "Allow public all on network_contacts" ON network_contacts;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on failure_logs') THEN
    DROP POLICY "Allow public all on failure_logs" ON failure_logs;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public all on user_settings') THEN
    DROP POLICY "Allow public all on user_settings" ON user_settings;
  END IF;
END $$;

-- Enable Row Level Security (RLS) and allow public read/write access for seamless client usage
ALTER TABLE roadmap_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE failure_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Permissive policies for standard anon access
CREATE POLICY "Allow public select on roadmap_nodes" ON roadmap_nodes FOR SELECT USING (true);
CREATE POLICY "Allow public all on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on applications" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on study_sessions" ON study_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on test_results" ON test_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on interview_notes" ON interview_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on network_contacts" ON network_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on failure_logs" ON failure_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on user_settings" ON user_settings FOR ALL USING (true) WITH CHECK (true);
