// Tech Placement Dependency Graph - Primary Source of Truth
// Read-only reference data extracted directly from official placement strategy specifications

import { RoadmapNode, StrictStep, PriorityLevel, DifficultyLevel } from '../types';

export const MASTER_38_NODES: RoadmapNode[] = [
  {
    id: "01",
    code: "CF1",
    title: "Computer & Coding Fundamentals",
    category: "Foundation",
    track: "CS Fundamentals",
    priority: "CRITICAL",
    difficulty: "LOW",
    estHours: 20,
    prerequisites: ["None"],
    unlocks: ["Java", "Problem Solving", "Linux"],
    doneCriteria: "Understands memory models (Heap vs Stack), compilation process, binary representation, and CLI execution.",
    description: "Foundational computer architecture, CPU registers, RAM allocation, command line interface, and understanding how code compiles and executes.",
    keyTopics: ["Compilation pipeline", "Stack vs Heap memory", "Binary & Hexadecimal", "CLI commands", "JVM basics"],
    roiScore: "High"
  },
  {
    id: "02",
    code: "A1",
    title: "Aptitude Foundation",
    category: "Aptitude",
    track: "Aptitude",
    priority: "CRITICAL",
    difficulty: "LOW",
    estHours: 30,
    prerequisites: ["None"],
    unlocks: ["Advanced Aptitude", "Campus OAs"],
    doneCriteria: "Solves basic percentage, ratio, and average problems in < 60 seconds without calculator.",
    description: "Universally utilized as the primary screening filter for 80% of Indian campus placements (TCS, Infosys, Wipro, Zoho). Math core required to clear initial OA rounds.",
    keyTopics: ["Percentages", "Profit & Loss", "Simple & Compound Interest", "Ratios & Proportions", "Mixtures & Alligations"],
    roiScore: "Extreme"
  },
  {
    id: "03",
    code: "P1",
    title: "Java Fundamentals",
    category: "Programming",
    track: "Programming",
    priority: "CRITICAL",
    difficulty: "LOW",
    estHours: 40,
    prerequisites: ["Computer & Coding Fundamentals"],
    unlocks: ["OOP", "Basic DSA", "Git"],
    doneCriteria: "Writes loops, arrays, and string manipulations without syntax errors in a plain text editor.",
    description: "Java is selected as the primary enterprise language in India, bridging the gap between rigorous DSA problem-solving and production-grade backend engineering.",
    keyTopics: ["Primitive Types", "Operators", "Control Flow (if/else, switch)", "1D & 2D Arrays", "Strings & StringBuilder (immutable strings)"],
    roiScore: "Extreme"
  },
  {
    id: "04",
    code: "PS1",
    title: "Problem Solving & Logic Building",
    category: "Logic Building",
    track: "DSA",
    priority: "HIGH",
    difficulty: "LOW",
    estHours: 25,
    prerequisites: ["Java Fundamentals"],
    unlocks: ["DSA Core", "Basic Algorithms"],
    doneCriteria: "Solves 20+ pattern printing, prime verification, array reversal, and frequency count problems independently.",
    description: "Bridging the gap between knowing syntax and developing algorithmic mental models. Prevents getting stuck in 'tutorial hell'.",
    keyTopics: ["Nested loop logic", "Number theory basics", "Array manipulations", "Frequency tables", "Edge case identification"],
    roiScore: "High"
  },
  {
    id: "05",
    code: "D1",
    title: "Data Structures & Algorithms (Core)",
    category: "Core CS",
    track: "DSA",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 60,
    prerequisites: ["Java Fundamentals", "Problem Solving"],
    unlocks: ["Advanced DSA", "Campus Technical Rounds"],
    doneCriteria: "Solves LeetCode Easy & Medium problems using Two Pointers, Sliding Window, and Prefix Sums independently.",
    description: "The primary evaluation pillar for technical rounds. Focuses on foundational array and string patterns, time & space Big O analysis.",
    keyTopics: ["Big O Notation", "Two Pointers (opposite & equi-directional)", "Sliding Window", "Prefix Sums", "Hashing Patterns"],
    roiScore: "Extreme"
  },
  {
    id: "06",
    code: "P2",
    title: "Object-Oriented Programming (OOP)",
    category: "Programming",
    track: "Programming",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 50,
    prerequisites: ["Java Fundamentals"],
    unlocks: ["Spring Boot", "Low-Level Design", "Collections Framework"],
    doneCriteria: "Implements interfaces, abstract classes, polymorphism, and utilizes Java Collections (HashMap, ArrayList, HashSet) effectively.",
    description: "Mastery of enterprise object modeling, memory encapsulation, inheritance chains, and the core Java Collections Framework.",
    keyTopics: ["Classes & Objects", "Constructors & 'this' keyword", "Encapsulation & Getters/Setters", "Inheritance & Polymorphism", "Java Collections (List, Map, Set, Queue)"],
    roiScore: "High"
  },
  {
    id: "07",
    code: "C1",
    title: "SQL Mastery",
    category: "Database",
    track: "Backend",
    priority: "CRITICAL",
    difficulty: "LOW",
    estHours: 35,
    prerequisites: ["None"],
    unlocks: ["DBMS", "Backend Integration"],
    doneCriteria: "Writes complex INNER/LEFT/RIGHT JOINs, subqueries, GROUP BY aggregations, and window functions (RANK, DENSE_RANK).",
    description: "Relational database querying tested in almost every OA and technical interview. Essential for backend microservices.",
    keyTopics: ["SELECT, WHERE, ORDER BY", "Aggregate Functions & GROUP BY", "JOINs (Inner, Left, Right, Full)", "Subqueries & CTEs", "Window Functions"],
    roiScore: "High"
  },
  {
    id: "08",
    code: "DB1",
    title: "Database Management Systems (DBMS)",
    category: "Core CS",
    track: "CS Fundamentals",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 40,
    prerequisites: ["SQL Mastery"],
    unlocks: ["Backend Security", "System Design"],
    doneCriteria: "Explains ACID properties, transaction isolation levels, normalization (1NF-BCNF), and B-Tree indexing without hesitation.",
    description: "Theoretical database foundations heavily tested in campus MCQs and senior engineer interview rounds.",
    keyTopics: ["Relational Model & Keys", "Normalization (1NF, 2NF, 3NF, BCNF)", "ACID Properties", "Concurrency Control & Isolation Levels", "B-Tree & Hash Indexing"],
    roiScore: "High"
  },
  {
    id: "09",
    code: "C2_OS",
    title: "Operating Systems (OS)",
    category: "Core CS",
    track: "CS Fundamentals",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 45,
    prerequisites: ["Computer & Coding Fundamentals"],
    unlocks: ["System Design", "Multithreading"],
    doneCriteria: "Explains thread concurrency, mutex vs semaphores, Banker's algorithm, CPU scheduling, and memory paging.",
    description: "Core computer science subject universally tested in tier-1 product company MCQs and technical deep dives.",
    keyTopics: ["Processes vs Threads", "CPU Scheduling (FCFS, Round Robin)", "Process Synchronization & Deadlocks", "Memory Management & Paging", "Virtual Memory & Thrashing"],
    roiScore: "High"
  },
  {
    id: "10",
    code: "C2_CN",
    title: "Computer Networks (CN)",
    category: "Core CS",
    track: "CS Fundamentals",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 40,
    prerequisites: ["Operating Systems"],
    unlocks: ["REST APIs", "System Design"],
    doneCriteria: "Explains 7-layer OSI model, TCP 3-way handshake, TCP vs UDP tradeoffs, DNS resolution, and HTTPS/TLS encryption.",
    description: "Networking mechanics powering all modern distributed systems and enterprise microservices.",
    keyTopics: ["OSI & TCP/IP Model", "IP Addressing & Subnetting", "Transport Layer (TCP vs UDP)", "TCP 3-Way Handshake & Teardown", "Application Layer (HTTP/HTTPS, DNS)"],
    roiScore: "High"
  },
  {
    id: "11",
    code: "SE1",
    title: "Software Engineering & SDLC",
    category: "Core CS",
    track: "CS Fundamentals",
    priority: "MEDIUM",
    difficulty: "LOW",
    estHours: 15,
    prerequisites: ["Computer Fundamentals"],
    unlocks: ["Git", "Projects"],
    doneCriteria: "Understands Agile, Scrum, CI/CD lifecycles, and software testing types (Unit, Integration, E2E).",
    description: "Standard industrial processes for developing, maintaining, and releasing enterprise software.",
    keyTopics: ["Agile & Scrum", "Testing Methodologies", "SDLC Phases", "Code Review Standards", "Design Documents"],
    roiScore: "Medium"
  },
  {
    id: "12",
    code: "G1_GIT",
    title: "Git Version Control",
    category: "Tools",
    track: "Tools",
    priority: "CRITICAL",
    difficulty: "LOW",
    estHours: 15,
    prerequisites: ["Java Fundamentals"],
    unlocks: ["GitHub", "Team Collaboration"],
    doneCriteria: "Executes git init, branching, commits, resolves merge conflicts, and performs interactive rebases cleanly.",
    description: "Indispensable modern version control tooling mandatory for every professional software developer.",
    keyTopics: ["git init, add, commit, status", "Branching & checkout", "Merge & Rebase strategies", "Resolving merge conflicts", "Git stash & reset"],
    roiScore: "High"
  },
  {
    id: "13",
    code: "G1_GH",
    title: "GitHub Workflow & Portfolio",
    category: "Tools",
    track: "Tools",
    priority: "HIGH",
    difficulty: "LOW",
    estHours: 15,
    prerequisites: ["Git Version Control"],
    unlocks: ["Resume", "Projects Showcase"],
    doneCriteria: "Maintains active GitHub profile with pinned repositories, professional READMEs, and Pull Request workflows.",
    description: "Proof of actual engineering capability reviewed by recruiters and hiring managers at product companies.",
    keyTopics: ["Remote Repositories (push, pull, fetch)", "Pull Requests & Code Reviews", "Markdown & Professional READMEs", "GitHub Actions preview", "Issue tracking"],
    roiScore: "High"
  },
  {
    id: "14",
    code: "LNX1",
    title: "Linux CLI Basics",
    category: "Tools",
    track: "Tools",
    priority: "HIGH",
    difficulty: "LOW",
    estHours: 15,
    prerequisites: ["Computer Fundamentals"],
    unlocks: ["Docker", "Cloud Deployment"],
    doneCriteria: "Navigates directories, handles file permissions (chmod), monitors processes (ps, top), and inspects logs (grep, tail).",
    description: "Standard terminal environment for servers, cloud containers, and enterprise development.",
    keyTopics: ["File system navigation (cd, ls, pwd)", "Text inspection (grep, awk, sed, tail)", "Process management (ps, kill, top)", "Permissions (chmod, chown)", "SSH connections"],
    roiScore: "High"
  },
  {
    id: "15",
    code: "BE1",
    title: "Backend Development Fundamentals",
    category: "Development",
    track: "Backend",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 35,
    prerequisites: ["Java OOP", "SQL Mastery"],
    unlocks: ["Spring Boot", "REST APIs"],
    doneCriteria: "Builds simple HTTP handlers, parses JSON requests, and understands client-server stateless request cycles.",
    description: "The gateway to scalable microservices. Focuses on REST architectural constraints and server communications.",
    keyTopics: ["HTTP Methods & Status Codes", "RESTful Architecture", "JSON serialization/deserialization", "Client-Server Model", "Statelessness"],
    roiScore: "Extreme"
  },
  {
    id: "16",
    code: "B1",
    title: "Java Spring Boot",
    category: "Development",
    track: "Backend",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 80,
    prerequisites: ["Java OOP & Collections", "SQL Mastery", "Backend Development"],
    unlocks: ["Production-Grade Projects", "Enterprise Placements"],
    doneCriteria: "Builds and deploys a production-grade REST API with Spring Data JPA, PostgreSQL, and Dependency Injection.",
    description: "The undisputed enterprise standard in Indian product companies and MNCs. Highest ROI backend stack.",
    keyTopics: ["IoC (Inversion of Control) & DI", "Spring Web (@RestController, @RequestMapping)", "Spring Data JPA & Hibernate ORM", "Global Exception Handling (@ControllerAdvice)", "Spring Boot Starters & Configuration"],
    roiScore: "Extreme"
  },
  {
    id: "17",
    code: "REST1",
    title: "REST APIs & Swagger",
    category: "Development",
    track: "Backend",
    priority: "HIGH",
    difficulty: "MED",
    estHours: 20,
    prerequisites: ["Java Spring Boot"],
    unlocks: ["Projects Tier 3", "API Testing"],
    doneCriteria: "Designs clean API endpoints with appropriate HTTP status codes, pagination, and OpenAPI / Swagger interactive UI.",
    description: "Industry-standard API specification and self-documenting endpoints expected in high-paying interviews.",
    keyTopics: ["REST conventions & URI design", "Pagination & Filtering", "Swagger / OpenAPI integration", "DTO pattern & Mapping", "Request validation (@Valid)"],
    roiScore: "High"
  },
  {
    id: "18",
    code: "DB_DEV",
    title: "Database Development & ORM",
    category: "Development",
    track: "Backend",
    priority: "HIGH",
    difficulty: "MED",
    estHours: 30,
    prerequisites: ["Spring Boot", "SQL Mastery"],
    unlocks: ["Production Projects", "System Caching"],
    doneCriteria: "Configures PostgreSQL connection pools, manages database migrations, and optimizes JPA query performance.",
    description: "Database persistence layer connecting backend code with production relational data stores.",
    keyTopics: ["Spring Data Repositories", "Derived & Native Queries", "Entity Relationships (@OneToMany, @ManyToMany)", "Lazy vs Eager fetching", "Connection Pooling (HikariCP)"],
    roiScore: "High"
  },
  {
    id: "19",
    code: "TEST1",
    title: "Testing (JUnit 5 & Mockito)",
    category: "Development",
    track: "Backend",
    priority: "HIGH",
    difficulty: "MED",
    estHours: 25,
    prerequisites: ["Spring Boot"],
    unlocks: ["Tier 3/4 Projects"],
    doneCriteria: "Writes unit tests for controllers and service layers achieving >70% test coverage using Mockito mocks.",
    description: "Distinguishes a professional software engineer from a tutorial follower. Highly valued by product company interviewers.",
    keyTopics: ["JUnit 5 assertions & lifecycle", "Mockito mocking (@Mock, @InjectMocks)", "Unit Testing Service logic", "Integration Testing with MockMvc", "Test-driven verification"],
    roiScore: "High"
  },
  {
    id: "20",
    code: "PROJ1",
    title: "Projects (Tier 1 & Tier 2)",
    category: "Projects",
    track: "Projects",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 50,
    prerequisites: ["Java OOP", "Spring Boot", "SQL Mastery"],
    unlocks: ["Tier 3 Project", "Early Resume"],
    doneCriteria: "Builds Console Library System (Tier 1 - practice only) and E-commerce REST API with JPA (Tier 2).",
    description: "Proof of practical coding capability. Tier 2 serves as early resume filler while preparing Tier 3/4.",
    keyTopics: ["Console OOP applications", "CRUD REST API endpoints", "PostgreSQL database storage", "Error responses", "Early resume inclusion"],
    roiScore: "High"
  },
  {
    id: "21",
    code: "CLD1",
    title: "Cloud & Deployment Basics",
    category: "DevOps",
    track: "DevOps",
    priority: "HIGH",
    difficulty: "MED",
    estHours: 25,
    prerequisites: ["Linux CLI Basics", "Spring Boot"],
    unlocks: ["Live Production URLs", "Tier 4 Project"],
    doneCriteria: "Deploys a containerized Spring Boot backend to AWS EC2 or Render with live public URL and managed database.",
    description: "Deploying projects demonstrates end-to-end software delivery capability that immediately catches recruiters' eyes.",
    keyTopics: ["AWS EC2 deployment basics", "PaaS deployment (Render/Railway)", "Cloud database setup (Supabase / AWS RDS)", "Environment variables in production", "Health check endpoints"],
    roiScore: "High"
  },
  {
    id: "22",
    code: "DCK1",
    title: "Docker Containerization",
    category: "DevOps",
    track: "DevOps",
    priority: "HIGH",
    difficulty: "MED",
    estHours: 20,
    prerequisites: ["Linux CLI Basics", "Spring Boot"],
    unlocks: ["Cloud Deployment", "Microservices"],
    doneCriteria: "Writes clean multi-stage Dockerfile for Spring Boot and runs multi-container setups using docker-compose.",
    description: "Standard industrial software packaging ensuring reproducible builds across development and production.",
    keyTopics: ["Dockerfile creation & layering", "Image building & tagging", "Container execution & port binding", "Docker Compose for App + DB", "Volume management"],
    roiScore: "High"
  },
  {
    id: "23",
    code: "CICD1",
    title: "CI/CD & GitHub Actions Basics",
    category: "DevOps",
    track: "DevOps",
    priority: "MEDIUM",
    difficulty: "MED",
    estHours: 15,
    prerequisites: ["GitHub Workflow", "Docker Containerization"],
    unlocks: ["Automated Deployment"],
    doneCriteria: "Sets up basic GitHub Actions workflow that runs test suite automatically on each pull request.",
    description: "Automated pipelines ensuring code quality and test compliance prior to merging code.",
    keyTopics: ["GitHub Actions workflows", "Automated build & test triggers", "Secrets management in GitHub", "Continuous integration feedback"],
    roiScore: "Medium"
  },
  {
    id: "24",
    code: "RES1",
    title: "ATS-Optimized Resume Crafting",
    category: "Career Prep",
    track: "Career",
    priority: "CRITICAL",
    difficulty: "LOW",
    estHours: 15,
    prerequisites: ["Git & GitHub Workflow", "Tier 2/3 Project"],
    unlocks: ["Placement Applications"],
    doneCriteria: "Constructs single-page ATS-compliant resume (Jake's Resume format) using quantifiable action-result bullet points.",
    description: "The gateway document. Resumes without clean formatting or impact metrics get filtered out before any human review.",
    keyTopics: ["Jake's Resume LaTeX / Markdown standard", "Quantifiable impact bullets (X accomplished by Y measuring Z)", "ATS keyword optimization", "Highlighting Java, Spring Boot, DSA, SQL", "Removing tutorial fluff"],
    roiScore: "Extreme"
  },
  {
    id: "25",
    code: "PORT1",
    title: "GitHub Portfolio Finalization",
    category: "Career Prep",
    track: "Career",
    priority: "HIGH",
    difficulty: "LOW",
    estHours: 15,
    prerequisites: ["GitHub Workflow", "Tier 3 Project"],
    unlocks: ["Applications"],
    doneCriteria: "Pins 2 top backend repositories with architectural diagrams, live API URLs, and Swagger documentation links.",
    description: "Visual evidence of coding standards and clean documentation for hiring managers who inspect code quality.",
    keyTopics: ["Repository pinning & descriptions", "Architecture diagrams in README", "Installation & Setup instructions", "API endpoint tables", "Live deployment badges"],
    roiScore: "High"
  },
  {
    id: "26",
    code: "COMM1",
    title: "Communication & Technical Articulation",
    category: "Soft Skills",
    track: "Soft Skills",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 25,
    prerequisites: ["None"],
    unlocks: ["Technical & HR Interviews"],
    doneCriteria: "Practices 'Thinking Aloud' while solving problems, explaining trade-offs clearly without filler words.",
    description: "Silent coding is an instant fail in top product interviews. Candidates must vocalize trade-offs and logic continuously.",
    keyTopics: ["'Thinking Aloud' method", "Vocalizing time/space complexity", "Explaining architecture trade-offs", "Professional English diction", "Handling interviewer hints"],
    roiScore: "Extreme"
  },
  {
    id: "27",
    code: "INT_CODE",
    title: "Coding Interview Preparation",
    category: "Interview Prep",
    track: "Interview",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 40,
    prerequisites: ["DSA Core", "Communication"],
    unlocks: ["Mock Interviews", "Technical Rounds"],
    doneCriteria: "Codes optimal LeetCode Medium problems in Google Docs without syntax highlighting or IDE autocomplete in under 25 minutes.",
    description: "The exact testing medium used by Google and top unicorns. Eliminates reliance on IDE crutches.",
    keyTopics: ["Plain text coding (Google Docs)", "Mental compilation & dry running", "Variable naming discipline", "Clarifying problem constraints", "Writing comprehensive test edge cases"],
    roiScore: "Extreme"
  },
  {
    id: "28",
    code: "INT_TECH",
    title: "Technical Interview Deep Dive",
    category: "Interview Prep",
    track: "Interview",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 35,
    prerequisites: ["Core CS (OS/DBMS/CN)", "Java Spring Boot"],
    unlocks: ["Mock Interviews"],
    doneCriteria: "Answers rapid-fire questions on OS concurrency, ACID properties, TCP handshakes, and Spring annotations without hesitation.",
    description: "Comprehensive technical evaluation round probing deep understanding of CS fundamentals and project architecture.",
    keyTopics: ["Java internals (JVM, Garbage Collection)", "Spring annotations & request lifecycle", "DBMS indexing & deadlock resolution", "OS paging & thread synchronization", "Networking protocols"],
    roiScore: "Extreme"
  },
  {
    id: "29",
    code: "I1",
    title: "HR & Behavioral Interview Prep (STAR-L)",
    category: "Interview Prep",
    track: "Interview",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 20,
    prerequisites: ["None"],
    unlocks: ["Final Offers", "Googleyness Assessment"],
    doneCriteria: "Prepares and memorizes 5 STAR-L formatted stories covering ambiguity, conflict, leadership, and major failure pivot.",
    description: "Behavioral rounds carry equal veto power at Google and top MNCs. Strong coding cannot compensate for behavioral red flags.",
    keyTopics: ["STAR-L Framework (Situation, Task, Action, Result, Learnings)", "Thriving in Ambiguity story", "Intellectual Humility & Feedback story", "Conflict Resolution story", "Failure & Pivot story"],
    roiScore: "Extreme"
  },
  {
    id: "30",
    code: "MOCK1",
    title: "Timed Mock Interviews",
    category: "Interview Prep",
    track: "Interview",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 30,
    prerequisites: ["Coding Interview Prep", "Behavioral Interview Prep"],
    unlocks: ["Real Placement Interviews"],
    doneCriteria: "Completes 15+ recorded peer or AI mock interviews with structured rubrics across DSA, System Design, and HR.",
    description: "Simulating high-stress interview conditions builds psychological resilience and vocal technical fluency.",
    keyTopics: ["Timed 45-min DSA simulations", "Live whiteboard/doc walkthroughs", "Behavioral cross-examination", "Performance rubric scoring", "Mistake log maintenance"],
    roiScore: "Extreme"
  },
  {
    id: "31",
    code: "APP1",
    title: "Placement Applications Strategy",
    category: "Placement",
    track: "Career",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 25,
    prerequisites: ["Resume", "Aptitude Foundation", "DSA Core"],
    unlocks: ["Real Interview Experience"],
    doneCriteria: "Applies to 50+ targeted company drives via campus portal, employee referrals, and off-campus career sites.",
    description: "Strategic pipeline management balancing early service company security offers with aggressive tier-1 unicorn applications.",
    keyTopics: ["Campus placement portal tracking", "Securing employee referrals via LinkedIn", "Off-campus hiring contests", "Application deadline management", "Managing OA test schedule"],
    roiScore: "High"
  },
  {
    id: "32",
    code: "EXP1",
    title: "Real Interview Experience & Iteration",
    category: "Placement",
    track: "Placement",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 30,
    prerequisites: ["Placement Applications"],
    unlocks: ["Advanced Optimization", "Final Offers"],
    doneCriteria: "Logs post-interview debriefs for every real round, tracking failed questions, mistakes, and corrective study action.",
    description: "Using initial placement rounds as aggressive feedback loops to eliminate blind spots and calibrate preparation.",
    keyTopics: ["Post-interview debrief logging", "Identifying recurring weak topics", "Analyzing OA failure causes", "Calibrating answer speed", "Refining compensation negotiation stance"],
    roiScore: "Extreme"
  },
  {
    id: "33",
    code: "D2",
    title: "Advanced DSA (Graphs & DP)",
    category: "Advanced",
    track: "DSA",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 120,
    prerequisites: ["DSA Core", "Java OOP & Collections"],
    unlocks: ["Google Interviews", "₹23.3L+ Target"],
    doneCriteria: "Solves LeetCode Medium & Hard graph problems (Topological Sort, Dijkstra, Union-Find) and DP (1D & 2D Knapsack).",
    description: "The core filter for ₹23.3 LPA+ unicorn packages and Google L3 interviews. Extreme bias toward Graphs, Trees, and Dynamic Programming.",
    keyTopics: ["Topological Sort & Kahn's Algorithm", "Dijkstra's Shortest Path & Prim's", "Disjoint Set Union (DSU) / Union-Find", "Dynamic Programming (Memoization & Tabulation)", "2D DP & Knapsack patterns", "Tries & Trie Traversals"],
    roiScore: "Extreme"
  },
  {
    id: "34",
    code: "S1",
    title: "Low-Level Design (LLD)",
    category: "Advanced",
    track: "System Design",
    priority: "CRITICAL",
    difficulty: "MED",
    estHours: 35,
    prerequisites: ["Java OOP & Collections"],
    unlocks: ["High-Level Design", "₹20L+ OAs"],
    doneCriteria: "Designs modular, extensible OOP systems (e.g. Parking Lot, Elevator System, Tic-Tac-Toe) using SOLID and GoF design patterns.",
    description: "Evaluated heavily in rounds for Razorpay, PhonePe, CRED, and Uber. Separates ₹10 LPA coders from ₹23.3 LPA software engineers.",
    keyTopics: ["SOLID Principles in Java", "Factory & Abstract Factory Pattern", "Singleton Pattern (Thread-safe)", "Observer Pattern & Event Listeners", "Strategy & Decorator Pattern", "Design a Parking Lot / Elevator"],
    roiScore: "Extreme"
  },
  {
    id: "35",
    code: "HLD1",
    title: "System Design (HLD Basics)",
    category: "Advanced",
    track: "System Design",
    priority: "HIGH",
    difficulty: "MED",
    estHours: 30,
    prerequisites: ["Core CS (OS/DBMS/CN)", "Backend Development"],
    unlocks: ["Google L3 Technical Rounds"],
    doneCriteria: "Diagrams architectural solutions for standard HLD problems (URL Shortener, Notification Service, Chat System) addressing scaling.",
    description: "Architectural awareness of distributed caching, load balancers, database sharding, and message queues.",
    keyTopics: ["Horizontal vs Vertical Scaling", "Load Balancing algorithms", "Distributed Caching (Redis vs Memcached)", "Database Replication & Sharding", "Design URL Shortener (Bit.ly)", "Design Chat System basics"],
    roiScore: "High"
  },
  {
    id: "36",
    code: "PROJ4",
    title: "Tier 4 Production Project (Scalable Engine)",
    category: "Advanced",
    track: "Projects",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 70,
    prerequisites: ["Spring Boot", "Docker", "Database Development", "System Design"],
    unlocks: ["₹23.3 LPA Interview Conversion"],
    doneCriteria: "Builds and deploys a Scalable Order Processing Engine with Redis caching, Kafka/RabbitMQ async messaging, and Docker.",
    description: "The centerpiece project proving the candidate is not just an academic student, but an enterprise-ready backend engineer.",
    keyTopics: ["Redis caching to reduce database load", "Asynchronous messaging (Kafka / RabbitMQ)", "Docker containerization & deployment", "JWT Authentication & Role-based security", "Stress testing & benchmark metrics"],
    roiScore: "Extreme"
  },
  {
    id: "37",
    code: "G_PREP",
    title: "Google-Level Technical & Googleyness Prep",
    category: "Advanced",
    track: "Interview",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 60,
    prerequisites: ["Advanced DSA", "STAR-L Behavioral", "Coding Interview Prep"],
    unlocks: ["Google L3 SWE Offer"],
    doneCriteria: "Uncovers disguised graph/DP patterns within complex business logic word problems in 45-min shared doc sessions.",
    description: "Specialized preparation tailored to Google's unique hiring matrix: optimal space-time proof, intellectual humility, handling ambiguity.",
    keyTopics: ["Disguised graph problem recognition", "45-min Google Doc coding drills", "Googleyness & Leadership matrix", "Evaluating engineering trade-offs", "Challenging the status quo with data"],
    roiScore: "Extreme"
  },
  {
    id: "38",
    code: "GOAL",
    title: "Target Achieved: ₹23.3 LPA / Google L3 Offer",
    category: "Goal",
    track: "Goal",
    priority: "CRITICAL",
    difficulty: "HIGH",
    estHours: 10,
    prerequisites: ["All Nodes 01-37"],
    unlocks: ["Career Launch"],
    doneCriteria: "Secured ₹23.3 LPA+ offer at top product unicorn, GCC, or Google L3 SWE.",
    description: "Ultimate milestone: Transition from complete beginner baseline to elite tier software engineering compensation.",
    keyTopics: ["Offer evaluation & negotiation", "Joining formalities", "Onboarding roadmap", "Continuous engineering growth"],
    roiScore: "Infinite"
  }
];

// The 12 Official Skill Dependency Nodes from Section 5 of PDF
export const SKILL_DEPENDENCY_TABLE = [
  {
    id: "A1",
    skill: "Quant Foundation",
    prerequisites: "None",
    unlocks: "Advanced Aptitude",
    priority: "CRITICAL",
    difficulty: "Low",
    estTime: "30 hrs",
    doneCriteria: "Solves basic percentage, ratio, and average problems in < 60 secs."
  },
  {
    id: "A2",
    skill: "Advanced Aptitude",
    prerequisites: "A1",
    unlocks: "Campus OAs",
    priority: "CRITICAL",
    difficulty: "Med",
    estTime: "40 hrs",
    doneCriteria: "Consistent 75%+ score in standard TCS/Infosys mock tests."
  },
  {
    id: "P1",
    skill: "Java Fundamentals",
    prerequisites: "None",
    unlocks: "OOP, Basic DSA",
    priority: "CRITICAL",
    difficulty: "Low",
    estTime: "40 hrs",
    doneCriteria: "Writes loops, arrays, and string manipulations without syntax errors."
  },
  {
    id: "P2",
    skill: "Java OOP & Collections",
    prerequisites: "P1",
    unlocks: "Projects, Core DSA",
    priority: "CRITICAL",
    difficulty: "Med",
    estTime: "50 hrs",
    doneCriteria: "Implements interfaces, polymorphism, and utilizes HashMaps effectively."
  },
  {
    id: "D1",
    skill: "Core DSA",
    prerequisites: "P1",
    unlocks: "Advanced DSA",
    priority: "CRITICAL",
    difficulty: "Med",
    estTime: "60 hrs",
    doneCriteria: "Solves LeetCode Easy problems using two pointers independently."
  },
  {
    id: "D2",
    skill: "Advanced DSA",
    prerequisites: "D1, P2",
    unlocks: "Google Interviews",
    priority: "CRITICAL",
    difficulty: "High",
    estTime: "120 hrs",
    doneCriteria: "Identifies and solves LeetCode Medium/Hard graph and DP problems."
  },
  {
    id: "C1",
    skill: "DBMS & SQL",
    prerequisites: "None",
    unlocks: "Backend Dev",
    priority: "CRITICAL",
    difficulty: "Low",
    estTime: "40 hrs",
    doneCriteria: "Writes complex JOINs and explains ACID properties and Normalization."
  },
  {
    id: "C2",
    skill: "Core CS (OS, Networks)",
    prerequisites: "P1",
    unlocks: "System Design",
    priority: "CRITICAL",
    difficulty: "Med",
    estTime: "50 hrs",
    doneCriteria: "Explains thread concurrency, memory paging, and TCP/IP handshakes."
  },
  {
    id: "B1",
    skill: "Java Spring Boot",
    prerequisites: "P2, C1",
    unlocks: "Real-world Projects",
    priority: "CRITICAL",
    difficulty: "High",
    estTime: "80 hrs",
    doneCriteria: "Builds and deploys a REST API with JWT authentication and PostgreSQL."
  },
  {
    id: "G1",
    skill: "Git & GitHub Workflow",
    prerequisites: "P1",
    unlocks: "Team Collaboration",
    priority: "CRITICAL",
    difficulty: "Low",
    estTime: "15 hrs",
    doneCriteria: "Resolves merge conflicts, rebases, and writes professional READMEs."
  },
  {
    id: "S1",
    skill: "Low-Level Design (LLD)",
    prerequisites: "P2",
    unlocks: "HLD, ₹20L+ OAs",
    priority: "CRITICAL",
    difficulty: "Med",
    estTime: "30 hrs",
    doneCriteria: "Designs modular OOP systems (e.g., Parking Lot) using design patterns."
  },
  {
    id: "I1",
    skill: "Behavioral/Googleyness",
    prerequisites: "None",
    unlocks: "Final Offer",
    priority: "CRITICAL",
    difficulty: "Med",
    estTime: "20 hrs",
    doneCriteria: "Delivers STAR-L formatted answers for leadership and ambiguity."
  }
];

// 51-Step Strict Learning Order from Section 6 of PDF
export const STRICT_51_LEARNING_ORDER: StrictStep[] = [
  { step: 1, title: "Basic Mathematics Operations → Aptitude Percentages", domain: "Aptitude", focusNote: "Memorize 1/2 to 1/15 fraction conversion tables." },
  { step: 2, title: "Java Syntax Foundation (Variables, Types, Operators)", domain: "Java", focusNote: "Understand primitive data types and memory sizing." },
  { step: 3, title: "Aptitude Ratios & Proportions ↔ Java Control Flow (If/Else, Loops)", domain: "Java", focusNote: "Combine basic ratio logic with loop branching." },
  { step: 4, title: "Java 1D and 2D Arrays", domain: "Java", focusNote: "Heap memory allocation and manual array traversal." },
  { step: 5, title: "Java Strings and StringBuilder", domain: "Java", focusNote: "String pool immutability; StringBuilder is critical for DSA optimization." },
  { step: 6, title: "Basic Problem Solving (Pattern printing, prime numbers, reversing arrays)", domain: "DSA", focusNote: "Build nested loop architecture without copy-pasting." },
  { step: 7, title: "Aptitude Averages → Profit and Loss", domain: "Aptitude", focusNote: "Percentage applications in cost price and selling price." },
  { step: 8, title: "Time and Space Complexity (Big O Notation) → Complexity Analysis", domain: "DSA", focusNote: "Calculate asymptotic bounds for loops and nested code." },
  { step: 9, title: "Java Object-Oriented Programming (Classes, Objects, Constructors)", domain: "Java", focusNote: "Master 'this' keyword, heap object initialization." },
  { step: 10, title: "Java OOP Mastery (Inheritance, Polymorphism, Encapsulation, Abstraction)", domain: "Java", focusNote: "Method overloading vs overriding; abstract classes vs interfaces." },
  { step: 11, title: "Git & GitHub Basics (Init, Add, Commit, Push)", domain: "Career", focusNote: "Set up local version control and push daily code." },
  { step: 12, title: "Java Collections Framework (ArrayList, HashMap, HashSet)", domain: "Java", focusNote: "Master HashMap and HashSet internals for O(1) lookups." },
  { step: 13, title: "DSA Phase 1: Two Pointers → Sliding Window", domain: "DSA", focusNote: "Opposite directional and equi-directional pointer techniques." },
  { step: 14, title: "SQL Basics (SELECT, WHERE, ORDER BY, GROUP BY)", domain: "Backend", focusNote: "Primary data filtering and aggregation queries." },
  { step: 15, title: "Aptitude Time and Work → Pipes and Cisterns", domain: "Aptitude", focusNote: "Inverse daily efficiency rate calculations." },
  { step: 16, title: "DSA Phase 2: Prefix Sums → Hashing algorithms", domain: "DSA", focusNote: "Subarray sum problems and O(N) frequency patterns." },
  { step: 17, title: "SQL Advanced (Inner/Left/Right JOINs, Subqueries, Aggregates)", domain: "Backend", focusNote: "Complex joins and grouped aggregations for interview rounds." },
  { step: 18, title: "DBMS Theory (Relational models, Keys, Normalization forms)", domain: "CS Core", focusNote: "1NF, 2NF, 3NF, BCNF decomposition rules." },
  { step: 19, title: "DSA Phase 3: Basic Sorting (Merge, Quick) → Binary Search on Arrays", domain: "DSA", focusNote: "Binary search on monotonic search spaces and answer bounds." },
  { step: 20, title: "Aptitude Time, Speed, and Distance → Trains → Boats", domain: "Aptitude", focusNote: "Relative speed concepts and downstream/upstream formulas." },
  { step: 21, title: "DSA Phase 4: Linked Lists (Traversal, Reversal, Fast/Slow pointers)", domain: "DSA", focusNote: "Floyd's Cycle detection and node pointer rewiring." },
  { step: 22, title: "DBMS Transactions (ACID properties, Isolation levels, Indexing)", domain: "CS Core", focusNote: "Dirty reads, phantom reads, and B-Tree indexing mechanisms." },
  { step: 23, title: "DSA Phase 5: Stacks → Queues", domain: "DSA", focusNote: "Monotonic stack patterns; queue BFS foundations." },
  { step: 24, title: "First Resume Draft (Documenting Java, SQL, and DSA progress)", domain: "Career", focusNote: "Single-page ATS standard format (Jake's Resume template)." },
  { step: 25, title: "Core CS OS Phase 1 (Processes vs. Threads, CPU Scheduling)", domain: "CS Core", focusNote: "Round Robin, FCFS, and context switching overhead." },
  { step: 26, title: "DSA Phase 6: Recursion (Base cases, Call stack memory)", domain: "DSA", focusNote: "Trusting the recursive leap; stack trace visualization." },
  { step: 27, title: "Aptitude Logical Reasoning (Syllogisms, Number Series)", domain: "Aptitude", focusNote: "Deductive reasoning tests commonly used in product OAs." },
  { step: 28, title: "Core CS OS Phase 2 (Synchronization, Deadlocks, Memory/Paging)", domain: "CS Core", focusNote: "Mutex vs Semaphore, Banker's algorithm, virtual memory paging." },
  { step: 29, title: "Backend Intro (HTTP protocols, REST architecture, JSON)", domain: "Backend", focusNote: "Stateless client-server communication and status codes." },
  { step: 30, title: "Java Spring Boot Foundation (IoC, Dependency Injection)", domain: "Backend", focusNote: "ApplicationContext and Bean lifecycle management." },
  { step: 31, title: "Spring Boot Web (Controllers, Routing)", domain: "Backend", focusNote: "@RestController, @GetMapping, @PostMapping, and JSON serialization." },
  { step: 32, title: "Database Integration (Spring Data JPA, PostgreSQL connection)", domain: "Backend", focusNote: "Hibernate ORM mapping and CRUD repositories." },
  { step: 33, title: "DSA Phase 7: Binary Trees (DFS/BFS traversals)", domain: "DSA", focusNote: "Inorder, Preorder, Postorder and Level-order traversals." },
  { step: 34, title: "DSA Phase 8: Binary Search Trees (BST)", domain: "DSA", focusNote: "BST validation, search, insertion, and LCA." },
  { step: 35, title: "Core CS Networks Phase 1 (OSI Model, TCP/IP Suite)", domain: "CS Core", focusNote: "Layer functions and encapsulation." },
  { step: 36, title: "Project 1: Beginner Backend API (e.g. Library Management System)", domain: "Projects", focusNote: "Tier 1 console/basic REST project for foundational practice." },
  { step: 37, title: "DSA Phase 9: Heaps / Priority Queues → Top K problems", domain: "DSA", focusNote: "Min-heap and Max-heap for k-th largest element problems." },
  { step: 38, title: "Core CS Networks Phase 2 (DNS, TCP vs UDP, HTTPS/TLS)", domain: "CS Core", focusNote: "TCP 3-way handshake, TLS handshake, and port bindings." },
  { step: 39, title: "DSA Phase 10: Graphs Foundation (Adjacency Lists, BFS, DFS)", domain: "DSA", focusNote: "Cycle detection in directed and undirected graphs." },
  { step: 40, title: "Advanced Backend (Exception Handling, Validation)", domain: "Backend", focusNote: "@ControllerAdvice, @ExceptionHandler, and Hibernate Validator." },
  { step: 41, title: "Project 1 Refinement (Swagger UI, Unit Testing JUnit/Mockito)", domain: "Projects", focusNote: "Documenting endpoints and mocking service layers." },
  { step: 42, title: "DSA Phase 11: Advanced Graphs (Topological Sort, Dijkstra, Union-Find)", domain: "DSA", focusNote: "Kahn's algorithm and shortest paths heavily tested by Google." },
  { step: 43, title: "Backend Security (Spring Security, JWT Authentication)", domain: "Backend", focusNote: "Filter chains, token validation, and password hashing." },
  { step: 44, title: "System Design LLD (SOLID Principles, Design Patterns)", domain: "System Design", focusNote: "Singleton, Factory, Observer patterns; Parking Lot design." },
  { step: 45, title: "Project 2: Strong Resume Project (Scalable E-Commerce Engine + Redis)", domain: "Projects", focusNote: "Tier 3/4 resume flagship demonstrating high throughput." },
  { step: 46, title: "DSA Phase 12: Dynamic Programming (Memoization → Tabulation)", domain: "DSA", focusNote: "1D DP, 2D grid DP, Knapsack patterns." },
  { step: 47, title: "Deployment Basics (Docker containerization, AWS EC2 / Render)", domain: "Career", focusNote: "Live public URL with managed PostgreSQL instance." },
  { step: 48, title: "System Design HLD Basics (Load Balancing, Caching, Sharding)", domain: "System Design", focusNote: "Vertical vs horizontal scaling and distributed cache architecture." },
  { step: 49, title: "Behavioral Prep Phase 1 (Formulating 5 STAR-L stories)", domain: "Interview", focusNote: "Documenting authentic stories with clear learnings." },
  { step: 50, title: "Interview Prep: Timed LeetCode Mediums on Google Docs without IDE", domain: "Interview", focusNote: "Plain text coding and continuous verbal communication." },
  { step: 51, title: "Googleyness Prep (Intellectual humility, Handling ambiguity)", domain: "Interview", focusNote: "Mastering Google's unique behavioral evaluation rubric." }
];

// Project Tiers from Section 12 of PDF
export const PROJECT_TIERS_DATA = [
  {
    tier: "Tier 1",
    title: "Beginner Project (Learning Focus)",
    example: "Console-based Library Management System",
    demonstrates: "Java OOP, Collections, File I/O or basic JDBC.",
    statusRule: "Do NOT put on final resume.",
    badge: "Foundation"
  },
  {
    tier: "Tier 2",
    title: "Intermediate Project (Resume Filler)",
    example: "E-commerce REST API",
    demonstrates: "Spring Boot, SQL/JPA, REST architectural constraints.",
    statusRule: "Add to early resume versions only.",
    badge: "Early Campus"
  },
  {
    tier: "Tier 3",
    title: "Strong Resume Project (₹15L+ Target)",
    example: "Distributed Task Management System",
    demonstrates: "JWT Authentication, PostgreSQL, Global Exception Handling, Swagger API documentation, thorough unit testing.",
    statusRule: "Primary project for campus placements.",
    badge: "₹15L+ Target"
  },
  {
    tier: "Tier 4",
    title: "Production-Quality Project (₹23.3L+ Target)",
    example: "Highly Scalable Order Processing Engine",
    demonstrates: "Redis caching to reduce DB load, asynchronous messaging (Kafka or RabbitMQ basics) for email notifications, Docker containerization.",
    statusRule: "Proves candidate is a junior engineer capable of entering an elite product environment.",
    badge: "₹23.3L+ / Google Tier"
  }
];

// Salary-Level Skill Matrix from Section 18 of PDF
export const SALARY_SKILL_MATRIX = [
  {
    band: "₹5 - 7 LPA",
    tier: "Service Companies (TCS, Infosys, Wipro)",
    skillLevel: "Basic / Foundational",
    dsa: "Arrays, Strings (Easy), Basic Sorting",
    csFundamentals: "Basic definitions, Simple SQL",
    projects: "Academic CRUD application",
    aptitude: "Exceptional (Key Filter - 80% eliminated here)"
  },
  {
    band: "₹8 - 12 LPA",
    tier: "Mid-Tier Product / Enterprise",
    skillLevel: "Intermediate",
    dsa: "HashMaps, Recursion, Linked Lists",
    csFundamentals: "Strong MCQs, SQL Joins",
    projects: "Full-stack / Basic REST API",
    aptitude: "Strong"
  },
  {
    band: "₹15 - 18 LPA",
    tier: "Growing Product Companies / GCCs",
    skillLevel: "Advanced",
    dsa: "Trees, Basic DP, Monotonic Stacks",
    csFundamentals: "OS Internals, ACID, Normalization",
    projects: "Deployed Backend API with DB",
    aptitude: "Above Average"
  },
  {
    band: "₹20 - 25 LPA",
    tier: "Premium Unicorns (Razorpay, PhonePe, CRED)",
    skillLevel: "Expert",
    dsa: "Graphs, Advanced DP, Heaps, Topological Sort",
    csFundamentals: "Indexing, Concurrency, Networking",
    projects: "Scalable Backend + Docker, LLD (Parking Lot)",
    aptitude: "OA Specific"
  },
  {
    band: "Google L3 (₹30 - 50L+)",
    tier: "Google / Top Tech Leaders",
    skillLevel: "Elite",
    dsa: "Graph Theory, DP, Tries, DSU, Disguised Problems",
    csFundamentals: "Deep OS/Memory knowledge, optimal complexity",
    projects: "Highly complex, impact-driven architecture",
    aptitude: "N/A (Rigorous OA coding)"
  }
];

// What NOT to Learn Yet (Section 19 of PDF)
export const WHAT_NOT_TO_LEARN_YET = [
  {
    topic: "Multiple Programming Languages (DEFER)",
    why: "Do not learn Python, C++, and JavaScript simultaneously. Stick exclusively to Java. Java bridges the gap between rigorous DSA problem-solving and production-grade backend engineering."
  },
  {
    topic: "Frontend Frameworks (LOW ROI)",
    why: "Do not learn React, Angular, or Vue unless explicitly targeting a pure frontend role. Basic HTML/CSS/JS is sufficient. Over-investing in frontend reduces time for advanced DSA and backend scalability, which are the actual gatekeepers for ₹20L+ packages."
  },
  {
    topic: "Advanced Cloud & DevOps (DEFER)",
    why: "Kubernetes, Terraform, and advanced AWS architectures (VPC, complex IAM). They represent massive time sinks for freshers. Containerizing with Docker and running on AWS EC2 or Render is completely sufficient."
  },
  {
    topic: "Machine Learning / AI (LOW ROI)",
    why: "Massive distractions that yield negligible ROI for general software engineering backend interviews. Freshers waste months training toys models while failing basic DSA and OS questions."
  },
  {
    topic: "Advanced Competitive Programming (LOW ROI)",
    why: "Segment Trees, Fenwick Trees, Heavy-Light Decomposition (unless explicitly targeting ICPC World Finals). Google and product companies evaluate standard graphs and DP, not obscure CP algorithms."
  }
];

// The Genesis Phase (Next 7 Days) from Section 28 of PDF
export const GENESIS_7_DAYS = [
  {
    day: 1,
    title: "Environment & First Execution",
    tasks: [
      "Setup a LeetCode account and a GitHub account.",
      "Install IntelliJ IDEA (Community Edition) and Java Development Kit (JDK 21+).",
      "Write, compile, and run a basic 'Hello World' Java program via command line (understand javac and java interaction)."
    ]
  },
  {
    day: 2,
    title: "Primitives & Math Logic",
    tasks: [
      "Study Java primitive data types, variable declarations, and basic operators.",
      "Study Aptitude: Percentages (Memorize fraction-to-percentage conversion tables: 1/2 to 1/15).",
      "Write Java code to solve 3 basic math logic problems (Even/Odd, Prime Number verification, Factorial)."
    ]
  },
  {
    day: 3,
    title: "Control Flow & Pattern Loops",
    tasks: [
      "Study Java Control Flow (if/else, switch, for loops, while loops).",
      "Study Aptitude: Profit and Loss basics (Formula application).",
      "Solve 5 pattern printing problems in Java to master nested loop architecture."
    ]
  },
  {
    day: 4,
    title: "1D Arrays & Simple Interest",
    tasks: [
      "Study 1D Arrays in Java (declaration, heap memory allocation, traversal).",
      "Study Aptitude: Simple Interest and Compound Interest.",
      "Solve: Find the Maximum Element in an Array, Reverse an Array (without built-in methods)."
    ]
  },
  {
    day: 5,
    title: "Strings Immutability & Ratios",
    tasks: [
      "Study Strings in Java (String pool mechanics, immutability, StringBuilder).",
      "Study Aptitude: Ratios and Proportions.",
      "Solve: Check if a String is a Palindrome, Count Vowels/Consonants in a String."
    ]
  },
  {
    day: 6,
    title: "Big O Analysis & Version Control",
    tasks: [
      "Study Big O Notation (Time and Space Complexity).",
      "Manually analyze the time and space complexity of code written on Days 2-5.",
      "Initialize a local Git repository, commit all code written this week, and push to GitHub."
    ]
  },
  {
    day: 7,
    title: "Review & Rest",
    tasks: [
      "Attempt a 30-minute quantitative aptitude mock test covering Percentages, Ratios, and P&L.",
      "Re-write any Java code that failed compilation during the week, from scratch, without consulting tutorials.",
      "Map out Week 2 (Focus: Java Object-Oriented Programming and the 'Two Pointers' DSA pattern)."
    ]
  }
];

// Risk Management from Section 26 of PDF
export const RISK_MANAGEMENT_DATA = [
  {
    risk: "Tutorial Hell",
    consequence: "Knowing theory but unable to code independently.",
    prevention: "Enforce a 1:3 ratio (1 hour watching, 3 hours coding).",
    recovery: "Abandon video courses; rely solely on official documentation and LeetCode."
  },
  {
    risk: "Ignoring Aptitude",
    consequence: "Failing the OA round; technical skills never get tested.",
    prevention: "Allocate 30 mins daily to quant speed drills.",
    recovery: "Pause DSA for 2 weeks to cram high-ROI aptitude topics."
  },
  {
    risk: "Memorizing DSA",
    consequence: "Failing when the interviewer modifies a constraint.",
    prevention: "Focus entirely on pattern recognition (e.g., 'This requires a monotonic stack because...').",
    recovery: "Maintain a 'Mistake Log' tracking why a solution failed, not just the code."
  },
  {
    risk: "Weak Projects",
    consequence: "Resume rejected by ATS; no interview calls.",
    prevention: "Build one Tier-4 project rather than five Tier-1 projects.",
    recovery: "Rebuild the project using a robust framework (Spring Boot) and add caching."
  },
  {
    risk: "Silent Coding",
    consequence: "Rejected by Google despite writing optimal code.",
    prevention: "Practice narrating out loud to an empty room or rubber duck.",
    recovery: "Schedule intensive mock interviews to build vocal technical fluency."
  }
];

// Challenge My Assumptions (Section 27 of PDF)
export const CHALLENGE_ASSUMPTIONS_DATA = [
  {
    assumption: "Aptitude → DSA → Java → SQL → Interview is the best sequence.",
    correction: "Highly inefficient. Learning Java syntax after DSA is impossible. These must be staggered and run in parallel. Aptitude should be a daily drip-feed, not a completed block."
  },
  {
    assumption: "I should completely finish one skill before touching another.",
    correction: "Sequential learning causes knowledge decay. By the time SQL is finished, Java will be forgotten. Spaced repetition and parallel learning are mandatory."
  },
  {
    assumption: "I need to master everything before applying for placements.",
    correction: "Placement readiness is a spectrum. Apply immediately for practice OAs once basic aptitude and arrays are covered. Real-world failure provides the fastest feedback loop."
  },
  {
    assumption: "I need many technologies (Full Stack, Cloud, Web3) to reach ₹23.3 LPA.",
    correction: "False. Top product companies hire for engineering depth and problem-solving, not framework breadth. Deep mastery of Java, Spring Boot, and Graph algorithms is infinitely more valuable."
  },
  {
    assumption: "Google preparation should come first because Google is my dream company.",
    correction: "Google hires sparsely and is highly competitive. Over-optimizing early might cause candidate to fail basic company OAs due to ignoring aptitude or SQL. Secure the baseline (₹10L+), then pivot to Google's graph/DP focus."
  },
  {
    assumption: "I am a beginner, therefore I need to spend months learning theory before solving problems.",
    correction: "Theory without application is a waste of time. Write flawed code on day two. Struggle with compilation errors early. Problem-solving is developed through friction, not passive reading."
  }
];

// Placement Readiness Scorecard Criteria from Section 23 of PDF
export const READINESS_SCORECARD_SPECS = {
  dsa: {
    title: "DSA Readiness",
    targetDone: "Can solve a randomized, unseen LeetCode Medium problem in under 25 minutes, entirely within a plain text editor, while narrating time/space complexity accurately.",
    milestones: ["50+ Easy solved", "120+ Medium solved", "30+ Hard solved (Graphs & DP)", "Timed 25-min plain text mock cleared"]
  },
  csCore: {
    title: "CS Core Readiness",
    targetDone: "Can explain ACID properties, Deadlocks, memory paging, and the TCP/IP 3-way handshake without hesitation.",
    milestones: ["OS concurrency & paging notes consolidated", "DBMS Normalization & Indexing mastered", "Computer Networks TCP/IP & DNS understood", "Flashcards reviewed"]
  },
  projects: {
    title: "Projects Readiness",
    targetDone: "Has one live, deployed backend API (Spring Boot + PostgreSQL + Redis) with documented GitHub repository and Swagger UI.",
    milestones: ["Tier 1 & 2 completed", "Tier 3 JWT & PostgreSQL API deployed", "Tier 4 Redis caching & Docker integrated", "Documented GitHub README & live link"]
  },
  behavioral: {
    title: "Behavioral Readiness",
    targetDone: "Has 5 STAR-L stories memorized and instantly adaptable to any leadership or conflict-resolution question.",
    milestones: ["Thriving in Ambiguity story", "Intellectual Humility & Feedback story", "Conflict Resolution story", "Failure & Pivot story", "Googleyness trade-offs story"]
  },
  aptitude: {
    title: "Aptitude Readiness",
    targetDone: "Consistently scores above 80% on timed TCS/Infosys standard mock assessments.",
    milestones: ["Percentages & Ratios in <60s", "Time & Work / Speed & Distance mastered", "Mock tests consistency >80%", "Speed drill streak"]
  }
};
