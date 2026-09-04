-- ============================================================================
-- Placement OS - Supabase PostgreSQL Schema Definition
-- Clean, simple, and easy to maintain 8-table database structure.
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
    event_type VARCHAR(50) NOT NULL, -- 'study', 'aptitude_test', 'coding_test', 'technical_interview', 'hr_interview', 'mock_interview', 'college_exam', 'placement_exam', 'application_deadline', 'project_milestone', 'other'
    date DATE NOT NULL,
    start_time VARCHAR(20), -- HH:mm
    duration_minutes INTEGER DEFAULT 60,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'missed'
    link TEXT,
    location TEXT,
    notes TEXT,
    roadmap_node_id VARCHAR(10) REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast date range queries in calendar/planner
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- 3. APPLICATIONS TABLE (Job application tracking)
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(100) PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'applied', -- 'wishlist', 'researching', 'applied', 'oa_scheduled', 'oa_completed', 'interview_scheduled', 'interviewing', 'rejected', 'offer', 'withdrawn'
    job_link TEXT,
    package_lpa NUMERIC(6, 2),
    referral VARCHAR(255),
    oa_date DATE,
    interview_date DATE,
    current_stage VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- 4. PROJECTS TABLE (User project portfolio)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL, -- 'tier1', 'tier2', 'tier3', 'tier4'
    tier_label VARCHAR(100),
    technologies JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress', -- 'Planning', 'In Progress', 'Completed', 'Deployed'
    github_url TEXT,
    live_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    deployment VARCHAR(255),
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. USER SETTINGS TABLE (Single user settings, manifestation profile, node progress, daily focus)
CREATE TABLE IF NOT EXISTS user_settings (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'default_user',
    user_name VARCHAR(255) DEFAULT 'Candidate',
    target_package VARCHAR(100) DEFAULT '₹23.3 LPA+',
    target_dream VARCHAR(255) DEFAULT 'Google / Top Product Companies',
    target_year VARCHAR(20) DEFAULT '2027',
    manifestation JSONB DEFAULT '{}'::jsonb,
    node_progress JSONB DEFAULT '{}'::jsonb,
    daily_focus JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and allow public read/write access for seamless client usage
ALTER TABLE roadmap_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Permissive policies for standard anon access
CREATE POLICY "Allow public select on roadmap_nodes" ON roadmap_nodes FOR SELECT USING (true);
CREATE POLICY "Allow public all on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on applications" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on study_sessions" ON study_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on test_results" ON test_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on interview_notes" ON interview_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on user_settings" ON user_settings FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED DATA: 38 Master Roadmap Nodes (Read-only Reference Data)
-- ============================================================================
INSERT INTO roadmap_nodes (id, code, title, category, track, priority, difficulty, est_hours, done_criteria, description, roi_score, key_topics)
VALUES
('01', 'CF1', 'Computer & Coding Fundamentals', 'Foundation', 'CS Fundamentals', 'CRITICAL', 'LOW', 20, 'Understands memory models (Heap vs Stack), compilation process, binary representation, and CLI execution.', 'Foundational computer architecture, CPU registers, RAM allocation, command line interface, and understanding how code compiles and executes.', 'High', '["Compilation pipeline", "Stack vs Heap memory", "Binary & Hexadecimal", "CLI commands", "JVM basics"]'),
('02', 'A1', 'Aptitude Foundation', 'Aptitude', 'Aptitude', 'CRITICAL', 'LOW', 30, 'Solves basic percentage, ratio, and average problems in < 60 seconds without calculator.', 'Universally utilized as the primary screening filter for 80% of Indian campus placements (TCS, Infosys, Wipro, Zoho). Math core required to clear initial OA rounds.', 'Extreme', '["Percentages", "Profit & Loss", "Simple & Compound Interest", "Ratios & Proportions", "Mixtures & Alligations"]'),
('03', 'P1', 'Java Fundamentals', 'Programming', 'Programming', 'CRITICAL', 'LOW', 40, 'Writes loops, arrays, and string manipulations without syntax errors in a plain text editor.', 'Java is selected as the primary enterprise language in India, bridging the gap between rigorous DSA problem-solving and production-grade backend engineering.', 'Extreme', '["Primitive Types", "Operators", "Control Flow (if/else, switch)", "1D & 2D Arrays", "Strings & StringBuilder (immutable strings)"]'),
('04', 'PS1', 'Problem Solving & Logic Building', 'Logic Building', 'DSA', 'HIGH', 'LOW', 25, 'Solves 20+ pattern printing, prime verification, array reversal, and frequency count problems independently.', 'Bridging the gap between knowing syntax and developing algorithmic mental models. Prevents getting stuck in tutorial hell.', 'High', '["Nested loop logic", "Number theory basics", "Array manipulations", "Frequency tables", "Edge case identification"]'),
('05', 'D1', 'Data Structures & Algorithms (Core)', 'Core CS', 'DSA', 'CRITICAL', 'MED', 60, 'Solves LeetCode Easy & Medium problems using Two Pointers, Sliding Window, and Prefix Sums independently.', 'The primary evaluation pillar for technical rounds. Focuses on foundational array and string patterns, time & space Big O analysis.', 'Extreme', '["Big O Notation", "Two Pointers (opposite & equi-directional)", "Sliding Window", "Prefix Sums", "Hashing Patterns"]'),
('06', 'P2', 'Object-Oriented Programming (OOP)', 'Programming', 'Programming', 'CRITICAL', 'MED', 50, 'Implements interfaces, abstract classes, polymorphism, and utilizes Java Collections (HashMap, ArrayList, HashSet) effectively.', 'Mastery of enterprise object modeling, memory encapsulation, inheritance chains, and the core Java Collections Framework.', 'Extreme', '["Classes & Objects", "Constructors & this keyword", "Encapsulation & Getters/Setters", "Inheritance & Polymorphism", "Java Collections (List, Map, Set, Queue)"]'),
('07', 'T1', 'Git & GitHub Fundamentals', 'Tools', 'Tools', 'HIGH', 'LOW', 15, 'Creates repositories, manages branches, resolves merge conflicts, and opens PRs via terminal.', 'Professional version control and collaboration skills non-negotiable for software engineering roles.', 'High', '["Git CLI", "Branching strategy", "Merge conflict resolution", "Pull Requests", "SSH keys & GitHub Actions"]'),
('08', 'CS1', 'Operating Systems (OS)', 'Core CS', 'CS Fundamentals', 'HIGH', 'MED', 40, 'Explains Process vs Thread, CPU scheduling, Virtual Memory, Paging, Deadlocks, and Mutexes.', 'Core CS fundamental subject tested rigorously in MNC technical interviews and Google L3 SWE rounds.', 'Extreme', '["Processes & Threads", "CPU Scheduling Algorithms", "Virtual Memory & Paging", "Deadlocks & Banker Algorithm", "Mutex, Semaphore, Concurrency"]'),
('09', 'DB1', 'Database Management Systems (DBMS)', 'Database', 'CS Fundamentals', 'HIGH', 'MED', 45, 'Writes complex SQL queries, explains Normalization (1NF to 3NF), and defines ACID properties.', 'Foundational data management subject. Critical for technical interviews and backend API design.', 'Extreme', '["Relational Model", "SQL (DDL, DML, JOINS, Aggregates)", "Normalization (1NF, 2NF, 3NF, BCNF)", "ACID Properties & Transactions", "Indexing & B-Trees"]'),
('10', 'CS2', 'Computer Networks (CN)', 'Core CS', 'CS Fundamentals', 'HIGH', 'MED', 40, 'Explains OSI & TCP/IP models, TCP 3-way handshake, DNS resolution, HTTP vs HTTPS, and IP addressing.', 'Essential for backend engineering, API design, and core CS screening rounds.', 'High', '["OSI & TCP/IP Layers", "TCP vs UDP", "TCP 3-Way Handshake & Connection Teardown", "DNS & IP Addressing", "HTTP/HTTPS & SSL/TLS"]'),
('11', 'A2', 'Advanced Aptitude & Logical Reasoning', 'Aptitude', 'Aptitude', 'HIGH', 'MED', 35, 'Solves Speed-Distance, Time-Work, Permutations, Probability, and Syllogisms in < 45 seconds.', 'Advanced quantitative and logical reasoning patterns for high-cutoff OAs (TCS Digital, Infosys HackWithInfy).', 'High', '["Time, Speed & Distance (Trains, Boats)", "Time & Work (Pipes & Cisterns)", "Permutations & Combinations", "Probability", "Syllogisms & Data Sufficiency"]'),
('12', 'D2', 'Data Structures & Algorithms (Intermediate)', 'Core CS', 'DSA', 'CRITICAL', 'MED', 70, 'Implements Linked Lists, Stacks, Queues, Binary Trees, and BST operations from scratch in Java.', 'Non-linear data structures forming 40% of all interview questions at mid-to-top tier product companies.', 'Extreme', '["Singly & Doubly Linked Lists", "Stacks & Monotonic Stack", "Queues & Deque", "Binary Tree Traversal (Pre, In, Post, Level)", "Binary Search Tree (BST) Operations"]'),
('13', 'DEV1', 'Java Spring Boot Core', 'Development', 'Backend', 'CRITICAL', 'HIGH', 60, 'Builds RESTful APIs with Dependency Injection, Spring Data JPA, and H2/PostgreSQL database.', 'Primary backend development framework for Java enterprise jobs in product & service MNCs.', 'Extreme', '["Inversion of Control (IoC) & DI", "Spring Boot Starters & Auto-configuration", "RESTful API Controllers", "Spring Data JPA & Hibernate", "Exception Handling & Validation"]'),
('14', 'D3', 'Recursion & Backtracking', 'Core CS', 'DSA', 'HIGH', 'HIGH', 40, 'Solves N-Queens, Sudoku Solver, Subset Generation, and Combination Sum using recursive tree building.', 'Algorithmic depth required for top product companies and advanced problem solving.', 'High', '["Recursive Stack Trace Analysis", "Subsets & Subsequences", "Permutations & Combinations", "N-Queens & Grid Search", "Pruning & State Space Search"]'),
('15', 'CS3', 'System Design Fundamentals (LLD)', 'Core CS', 'System Design', 'HIGH', 'MED', 35, 'Applies SOLID principles, Design Patterns (Singleton, Factory, Strategy, Observer) to OOP models.', 'Low-Level Design (LLD) is tested extensively in product company interviews (Tier 2/3 rounds).', 'High', '["SOLID Principles", "Singleton & Factory Patterns", "Strategy & Observer Patterns", "UML Class Diagrams", "Design Parking Lot / Elevator System"]'),
('16', 'P3', 'Tier 2 Intermediate Backend Project', 'Projects', 'Projects', 'HIGH', 'MED', 40, 'Deploys a complete REST API with JWT authentication, database persistence, and Swagger documentation.', 'Intermediate project establishing backend capability for resume verification.', 'High', '["REST API Architecture", "JWT Authentication", "PostgreSQL Integration", "Swagger / OpenAPI Documentation", "Postman Test Suite"]'),
('17', 'D4', 'Data Structures & Algorithms (Advanced: DP)', 'Core CS', 'DSA', 'CRITICAL', 'HIGH', 70, 'Solves 1D & 2D Dynamic Programming problems (Knapsack, LCS, LIS, Matrix Chain) independently.', 'Dynamic Programming is mandatory for top package OAs and interviews (Amazon, PhonePe, Razorpay).', 'Extreme', '["Memoization vs Tabulation", "1D DP (Fibonacci, House Robber)", "2D DP (Grid Paths, Knapsack)", "String DP (LCS, Edit Distance)", "Longest Increasing Subsequence (LIS)"]'),
('18', 'D5', 'Data Structures & Algorithms (Advanced: Graphs)', 'Core CS', 'DSA', 'CRITICAL', 'HIGH', 70, 'Implements BFS, DFS, Dijkstra algorithm, Topological Sort, and Disjoint Set Union (DSU) in Java.', 'Graph algorithms are the peak DSA requirement for Tier-1 product companies and Google L3 rounds.', 'Extreme', '["Adjacency List Representation", "BFS & DFS Traversals", "Cycle Detection (Directed & Undirected)", "Topological Sort (Kahn Algorithm)", "Dijkstra & Minimum Spanning Tree"]'),
('19', 'DE1', 'Docker & Containerization', 'DevOps', 'DevOps', 'MEDIUM', 'MED', 25, 'Writes Dockerfiles, builds container images, and manages multi-container apps with Docker Compose.', 'Essential DevOps tool for containerizing Spring Boot microservices and databases.', 'High', '["Containerization Concepts", "Dockerfile directives", "Image building & optimization", "Docker Compose for local environment", "Container Networking & Volumes"]'),
('20', 'P4', 'Tier 3 Scalable Microservices Project', 'Projects', 'Projects', 'CRITICAL', 'HIGH', 80, 'Architects and deploys a distributed microservices system with Redis Caching, Kafka, and Postgres.', 'Star project on resume demonstrating high-concurrency enterprise Java craftsmanship.', 'Extreme', '["Spring Cloud & Service Discovery", "Redis Caching Layer", "Apache Kafka Event Streaming", "PostgreSQL Sharding / Indexing", "API Gateway & Rate Limiting"]'),
('21', 'A3', 'Verbal Ability & Soft Skills', 'Aptitude', 'Soft Skills', 'HIGH', 'LOW', 20, 'Clears corporate verbal ability assessments (Reading Comprehension, Error Spotting, Para Jumbles).', 'Verbal proficiency and written communication required for MNC screening OAs.', 'High', '["Reading Comprehension", "Grammar & Error Spotting", "Para Jumbles & Sentence Completion", "Vocabulary & Synonyms", "Corporate Email Etiquette"]'),
('22', 'INT1', 'Resume Crafting & ATS Optimization', 'Career Prep', 'Career', 'CRITICAL', 'LOW', 15, 'Creates an ATS-compliant single-page plain text markdown/LaTeX resume scoring >85 on screening tools.', 'Gateway to getting interview calls; bad formatting eliminates 70% of applicants instantly.', 'Extreme', '["ATS Parser Rules", "Action Verbs & Impact Metrics", "Single-Page Layout Strategy", "Project Bullet Structure", "Tech Stack Tagging"]'),
('23', 'INT2', 'Technical Mock Interviews & Plain Text Coding', 'Interview Prep', 'Interview', 'CRITICAL', 'MED', 30, 'Executes 5+ mock coding interviews coding on Google Docs without IDE autocomplete while thinking aloud.', 'Google & top MNCs evaluate candidates on raw communication and coding without compiler assistance.', 'Extreme', '["Google Docs Coding Protocol", "Think Aloud Technique", "Edge Case Vocalization", "Time & Space Complexity Verbal Proof", "Clarifying Questions Strategy"]'),
('24', 'INT3', 'Behavioral & STAR-L Communication', 'Interview Prep', 'Interview', 'CRITICAL', 'LOW', 20, 'Documents 5 STAR-L stories covering Ambiguity, Humility, Leadership, Conflict, and Failure/Pivot.', 'Googleyness and behavioral fit carry equal weight to technical rounds in top product MNCs.', 'Extreme', '["STAR-L Framework", "Ambiguity Handling Story", "Technical Disagreement Story", "Failure & Retrospective Pivot Story", "Googleyness & Leadership Principles"]'),
('25', 'CS4', 'High-Level System Design (HLD)', 'Core CS', 'System Design', 'HIGH', 'HIGH', 40, 'Architects URL Shortener, Rate Limiter, and Notification System with load balancing & DB sharding.', 'Required for senior/SDE-1 product roles and high LPA technical evaluation.', 'High', '["Load Balancing & DNS Round-Robin", "Database Sharding & Replication", "Caching Strategies (Cache-Aside, Write-Through)", "Message Queues & Event-Driven Architecture", "CAP Theorem & Consistent Hashing"]'),
('26', 'DEV2', 'Spring Security & OAuth2', 'Development', 'Backend', 'HIGH', 'HIGH', 30, 'Implements role-based access control (RBAC), OAuth2 login, and Spring Security filter chains.', 'Enterprise security standard for backend microservices.', 'High', '["Spring Security Filter Chain", "JWT Token Signing & Verification", "OAuth2 & OpenID Connect", "Role-Based Authorization", "CORS & CSRF Protection"]'),
('27', 'DE2', 'Cloud Deployment & Basic CI/CD', 'DevOps', 'DevOps', 'MEDIUM', 'MED', 25, 'Sets up GitHub Actions pipeline deploying Spring Boot service to AWS EC2 or Render.', 'Automated build and continuous deployment baseline for production projects.', 'Medium', '["GitHub Actions CI/CD Workflows", "AWS EC2 Instance Setup", "Nginx Reverse Proxy", "SSL Certification with Certbot", "Environment Variables Security"]'),
('28', 'D6', 'Trie & Segment Tree Basics', 'Core CS', 'DSA', 'MEDIUM', 'HIGH', 25, 'Implements Trie for autocomplete and prefix search; understands Segment Tree range queries.', 'Specialized data structures for advanced OAs and competitive programming rounds.', 'Medium', '["Trie Node Structure & Insertion", "Prefix Search & Autocomplete", "Bit Manipulation Tricks", "Segment Tree Concept", "Disjoint Set Union (DSU) Advanced"]'),
('29', 'INT4', 'Company-Specific Assessment Drills', 'Placement', 'Placement', 'HIGH', 'MED', 30, 'Solves 10 previous year test papers for target company (TCS NQT, Infosys, Accenture, Amazon).', 'Targeted practice matching exact company question distribution and time constraints.', 'High', '["Company Test Pattern Analysis", "Previous Year Question Solving", "Speed & Accuracy Optimization", "Time-Boxing Drill", "Negative Marking Strategy"]'),
('30', 'P5', 'Tier 4 Star Production Project (Google/SDE Target)', 'Projects', 'Projects', 'CRITICAL', 'HIGH', 100, 'Deploys distributed real-time engine with WebSockets, Kafka, Redis Cluster, and PostgreSQL.', 'The flagship resume project positioning candidate for ₹23.3 LPA+ and Google L3 SWE consideration.', 'Extreme', '["High-Throughput Concurrent Engine", "WebSocket Real-Time Protocol", "Redis Cluster & Distributed Lock", "Kafka Event-Driven Pipeline", "Production Monitoring & Metrics"]'),
('31', 'CS5', 'Advanced DBMS & SQL Tuning', 'Database', 'CS Fundamentals', 'MEDIUM', 'HIGH', 30, 'Optimizes slow queries using EXPLAIN ANALYZE, indexes, B-Trees, and transaction isolation levels.', 'Advanced database engineering for backend roles.', 'Medium', '["EXPLAIN ANALYZE Query Profiling", "Covering Indexes & Composite Indexes", "B-Tree vs Hash Indexes", "Transaction Isolation Levels", "Database Deadlock Resolution"]'),
('32', 'CS6', 'Linux Systems & Shell Scripting', 'Tools', 'Tools', 'MEDIUM', 'MED', 20, 'Writes Bash scripts for log parsing, monitors system processes (top/htop), and manages permissions.', 'Operating system literacy essential for backend deployment and server management.', 'Medium', '["Linux Directory Layout", "Bash Scripting Basics", "grep, sed, awk text processing", "File Permissions & chmod", "Process Management (ps, kill, systemctl)"]'),
('33', 'D7', 'Advanced Dynamic Programming & Graph Patterns', 'Core CS', 'DSA', 'HIGH', 'HIGH', 50, 'Solves Bitmask DP, DP on Trees, Tarjan Algorithm, and Kosaraju Strong Connectivity.', 'Peak algorithmic mastery for top 1% technical coding rounds.', 'High', '["Bitmask DP", "DP on Trees", "Tarjan Bridges & Articulation Points", "Kosaraju Strongly Connected Components", "Eulerian Path & Circuit"]'),
('34', 'INT5', 'Google L3 SWE Plain Text Simulation', 'Placement', 'Placement', 'CRITICAL', 'HIGH', 40, 'Clears 3 simulated 45-minute Google L3 interviews on Google Docs with real-time constraint changes.', 'Ultimate readiness simulation verifying plain text coding under pressure.', 'Extreme', '["Google L3 Rubric Evaluation", "Follow-up Constraint Handling", "Code Cleanliness & Naming Standard", "Communication Under Stress", "Final Verdict Self-Audit"]'),
('35', 'DEV3', 'Redis & Caching Architectures', 'Development', 'Backend', 'HIGH', 'MED', 25, 'Implements Redis cache-aside, pub/sub, rate limiting, and session management in Java.', 'Essential high-performance caching for distributed backend systems.', 'High', '["Redis Data Structures (String, Hash, List, Set, ZSet)", "Cache Eviction Policies (LRU, LFU)", "Cache Stampede & Cache Penetration", "Rate Limiting with Redis", "Distributed Locking"]'),
('36', 'P6', 'Open Source Contribution', 'Projects', 'Projects', 'MEDIUM', 'HIGH', 30, 'Submits merged PRs to open-source Java/Spring libraries or developer tooling repos.', 'Standout proof of real-world collaboration and code quality on resume.', 'Medium', '["Forking & Upstream Tracking", "Navigating Large Codebases", "Issue Triage & Fixes", "Unit Test Writing", "PR Code Review Process"]'),
('37', 'INT7', 'Salary Negotiation & Offer Evaluation', 'Career Prep', 'Career', 'HIGH', 'LOW', 10, 'Evaluates base pay, ESOPs, joining bonus, and negotiates competing offers professionally.', 'Maximizes final compensation and career trajectory.', 'High', '["Comp Package Breakdown (Base, Bonus, Stocks)", "Competing Offer Leverage", "Negotiation Scripts", "Notice Period & Onboarding", "Career Growth Projection"]'),
('38', 'GOAL', 'Target Achieved: ₹23.3 LPA+ & Google L3 SWE', 'Goal', 'Goal', 'CRITICAL', 'LOW', 0, 'Secures offer letter for Software Engineer role at Google or top product unicorn.', 'The ultimate goal of Placement OS.', 'Extreme', '["Offer Letter Secured", "Google L3 SWE / Product Unicorn", "Financial Sovereignty Achieved", "Mastery of Engineering Craft"]')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    track = EXCLUDED.track,
    priority = EXCLUDED.priority,
    difficulty = EXCLUDED.difficulty,
    est_hours = EXCLUDED.est_hours,
    done_criteria = EXCLUDED.done_criteria,
    description = EXCLUDED.description,
    roi_score = EXCLUDED.roi_score,
    key_topics = EXCLUDED.key_topics;
