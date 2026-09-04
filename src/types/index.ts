// Placement OS Type Definitions
// Primary Source of Truth: Tech Placement Dependency Graph & Strategy

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DifficultyLevel = 'LOW' | 'MED' | 'HIGH';
export type ReadinessStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY';
export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export type Category = 
  | 'Foundation'
  | 'Aptitude'
  | 'Programming'
  | 'Logic Building'
  | 'Core CS'
  | 'Database'
  | 'Tools'
  | 'Development'
  | 'Projects'
  | 'DevOps'
  | 'Career Prep'
  | 'Soft Skills'
  | 'Interview Prep'
  | 'Placement'
  | 'Advanced'
  | 'Goal';

export type TrackType = 
  | 'Aptitude'
  | 'Programming'
  | 'DSA'
  | 'CS Fundamentals'
  | 'Backend'
  | 'Projects'
  | 'Career'
  | 'Interview'
  | 'DevOps'
  | 'System Design'
  | 'Tools'
  | 'Soft Skills'
  | 'Placement'
  | 'Goal';

// Roadmap 38-Node Master Item
export interface RoadmapNode {
  id: string; // e.g. "01", "02", ... "38"
  code?: string; // e.g. "A1", "P1", "D1", etc.
  title: string;
  category: Category;
  track: TrackType;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  estHours: number;
  prerequisites: string[]; // Node IDs or names
  unlocks: string[];
  doneCriteria: string;
  description: string;
  keyTopics: string[];
  roiScore?: string; // high / extreme / med
}

// 51-Step Strict Learning Sequence
export interface StrictStep {
  step: number;
  title: string;
  domain: 'Aptitude' | 'Java' | 'DSA' | 'CS Core' | 'Backend' | 'Projects' | 'System Design' | 'Interview' | 'Career';
  nodeRefId?: string;
  focusNote: string;
}

// User Execution Planner Events
export type EventType =
  | 'study'
  | 'aptitude_test'
  | 'coding_test'
  | 'technical_interview'
  | 'hr_interview'
  | 'mock_interview'
  | 'college_exam'
  | 'placement_exam'
  | 'application_deadline'
  | 'company_assessment'
  | 'assignment'
  | 'project_milestone'
  | 'resume_deadline'
  | 'other';

export interface PlannerEvent {
  id: string;
  title: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  durationMinutes: number;
  category: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  link?: string;
  location?: string;
  notes?: string;
  roadmapNodeId?: string;
  createdAt: string;
}

// Placement Test Tracker
export type TestType = 
  | 'Aptitude'
  | 'Coding'
  | 'Technical MCQ'
  | 'CS Fundamentals'
  | 'Company OA'
  | 'Mock Assessment'
  | 'Other';

export interface PlacementTest {
  id: string;
  testName: string;
  company?: string;
  testType: TestType;
  date: string; // YYYY-MM-DD
  startTime?: string;
  durationMinutes: number;
  locationOrUrl?: string;
  topics: string[];
  difficulty: DifficultyLevel;
  status: 'Scheduled' | 'Completed' | 'Missed';
  notes?: string;
  reminderMinutesBefore?: number;
  // Post-test metrics
  score?: number;
  maxScore?: number;
  percentage?: number;
  questionsCount?: number;
  correctCount?: number;
  incorrectCount?: number;
  skippedCount?: number;
  weakTopics?: string[];
  testMistakesNotes?: string;
  createdAt: string;
}

// Placement Interview Tracker
export type InterviewRound =
  | 'HR'
  | 'Technical'
  | 'Coding'
  | 'DSA'
  | 'System Design'
  | 'Managerial'
  | 'Behavioral'
  | 'Final'
  | 'Mock Interview';

export interface PlacementInterview {
  id: string;
  company: string;
  role: string;
  round: InterviewRound;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  mode: 'Virtual' | 'In-Person' | 'Telephonic';
  link?: string;
  interviewer?: string;
  topics: string[];
  preparationStatus: 'Not Started' | 'In Progress' | 'Well Prepared';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  // Post-interview debrief (Real Interview Experience)
  feedback?: {
    questionsAsked?: string[];
    whatWentWell?: string;
    whatWentBadly?: string;
    topicsTested?: string[];
    mistakes?: string;
    lessons?: string;
    nextAction?: string;
    verdict?: 'Pending' | 'Passed' | 'Rejected';
  };
  createdAt: string;
}

// College / External Exams
export interface CollegeExam {
  id: string;
  examName: string;
  subject: string;
  date: string;
  time: string;
  durationMinutes: number;
  location?: string;
  syllabus?: string;
  preparationStatus: 'Not Started' | 'In Progress' | 'Prepared';
  notes?: string;
  createdAt: string;
}

// Placement Job Applications
export type ApplicationStatus =
  | 'wishlist'
  | 'researching'
  | 'applied'
  | 'oa_scheduled'
  | 'oa_completed'
  | 'interview_scheduled'
  | 'interviewing'
  | 'rejected'
  | 'offer'
  | 'withdrawn';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  applicationDate: string;
  deadline?: string;
  status: ApplicationStatus;
  jobLink?: string;
  packageLPA?: number;
  referral?: string;
  oaDate?: string;
  interviewDate?: string;
  currentStage?: string;
  notes?: string;
  createdAt: string;
}

// Project Tiers from PDF
export type ProjectTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface UserProject {
  id: string;
  title: string;
  tier: ProjectTier;
  tierLabel: string;
  technologies: string[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'Deployed';
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
  deployment?: string;
  resumeStatus: 'Do Not Put' | 'Early Versions Only' | 'Primary Campus Project' | 'Production Star Project';
  notes?: string;
  createdAt: string;
}

export type PlacementProject = UserProject;

// Manifestation & Vision
export interface ManifestationProfile {
  targetPackage: string; // "₹23.3 LPA+"
  targetRole: string; // "Software Engineer"
  targetCompanies: string; // "Google / Top Product Companies (Razorpay, PhonePe, CRED)"
  targetYear: string; // "2027"
  visionStatement: string;
  myWhy: string;
  whyThisMatters?: string;
  targetDream?: string;
  myPrinciples: string[];
  myNonNegotiables: string[];
  dailyNonNegotiables?: string[];
  myDailyStandard: string;
}

export interface DailyCheckin {
  id: string;
  date: string; // YYYY-MM-DD
  mainObjective: string;
  skillBuilding: string;
  mustComplete: string;
  distractionToAvoid: string;
  accomplished?: string;
  learned?: string;
  rating?: number; // 1-5
}

// Daily Focus
export interface DailyFocusState {
  date: string;
  primaryFocus: string;
  durationMinutes: number;
  supporting: string[];
  completed: boolean;
  notes?: string;
}

// AI Message & Chat
export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'add_planner' | 'add_test' | 'navigate_roadmap' | 'add_interview';
    payload?: any;
  };
}

// Readiness Score Details
export interface ReadinessDimension {
  title: string;
  percentage: number;
  status: ReadinessStatus;
  criteriaDescription: string;
  criteria?: string;
  weight?: number;
  evidence: string[];
  nextMilestone: string;
}
