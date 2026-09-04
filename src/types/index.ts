// Placement OS — Career Operating System Type Definitions
// Primary Source of Truth: Career Blueprint & Strategy Blueprint (Sept 2026)

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DifficultyLevel = 'LOW' | 'MED' | 'HIGH';
export type ReadinessStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY';
export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export type CareerTargetPath = 'PATH_A_SAFETY' | 'PATH_B_STRONG' | 'PATH_C_AMBITIOUS';

export type Category =
  | 'Foundation'
  | 'Aptitude'
  | 'Programming'
  | 'DSA'
  | 'Core CS'
  | 'Database'
  | 'Tools'
  | 'Development'
  | 'Projects'
  | 'Proof of Work'
  | 'DevOps'
  | 'Career Prep'
  | 'Soft Skills'
  | 'Interview Prep'
  | 'Networking'
  | 'Applications'
  | 'Goal';

export type TrackType =
  | 'Technical'
  | 'Aptitude'
  | 'Proof of Work'
  | 'Career Execution'
  | 'Interview'
  | 'GATE Track';

// Master Roadmap Node
export interface RoadmapNode {
  id: string; // e.g. "01", "02", ... "38"
  code?: string;
  title: string;
  category: Category;
  track: TrackType;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  estHours: number;
  prerequisites: string[];
  unlocks: string[];
  doneCriteria: string;
  description: string;
  keyTopics: string[];
  roiScore?: string;
  targetPath?: 'A' | 'B' | 'C' | 'ALL';
}

// Career Bingo Card Priority System (P0 -> P5)
export type BingoPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export type BingoCategory = 'TECHNICAL' | 'PROOF_OF_WORK' | 'CAREER_EXECUTION' | 'INTERVIEW' | 'PROFESSIONAL' | 'STRATEGY';

export interface BingoItem {
  id: string;
  title: string;
  priority: BingoPriority;
  category: BingoCategory;
  whyItMatters: string;
  completionCriteria: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred';
  linkedView?: string;
  notes?: string;
  completedAt?: string;
}

// Unified General Events Table
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
  | 'networking'
  | 'project_milestone'
  | 'other';

export interface PlannerEvent {
  id: string;
  title: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;
  durationMinutes: number;
  company?: string;
  role?: string;
  location?: string;
  link?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'cancelled';
  priority?: PriorityLevel;
  category?: string;
  notes?: string;
  roadmapNodeId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Test Tracker
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
  date: string;
  startTime?: string;
  durationMinutes: number;
  locationOrUrl?: string;
  topics: string[];
  difficulty: DifficultyLevel;
  status: 'Scheduled' | 'Completed' | 'Missed';
  notes?: string;
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

// Interview OS & Debrief
export type InterviewRound =
  | 'HR'
  | 'Technical'
  | 'Coding'
  | 'DSA'
  | 'Project'
  | 'LLD'
  | 'Behavioral'
  | 'Managerial'
  | 'Final'
  | 'Mock Interview';

export interface PlacementInterview {
  id: string;
  company: string;
  role: string;
  round: InterviewRound;
  date: string;
  time: string;
  durationMinutes: number;
  mode: 'Virtual' | 'In-Person' | 'Telephonic';
  link?: string;
  interviewer?: string;
  topics: string[];
  preparationStatus: 'Not Started' | 'In Progress' | 'Well Prepared';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  feedback?: {
    questionsAsked?: string[];
    whatWentWell?: string;
    whatWentBadly?: string;
    topicsTested?: string[];
    mistakes?: string;
    lessons?: string;
    nextAction?: string;
    verdict?: 'Pending' | 'Passed' | 'Rejected';
    mockScore?: number; // 0-100
  };
  createdAt: string;
}

// College Exam Tracker
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

// Application Funnel (Pipeline: Discovered -> Applied -> OA -> Technical -> Interview -> Offer)
export type ApplicationStatus =
  | 'discovered'
  | 'preparing'
  | 'applied'
  | 'oa'
  | 'technical'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'closed';

export type ApplicationChannel =
  | 'Referral'
  | 'Alumni'
  | 'Targeted Off-campus'
  | 'Internship'
  | 'Campus'
  | 'Cold application';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  channel: ApplicationChannel;
  applicationDate: string;
  deadline?: string;
  resumeVersion?: string;
  status: ApplicationStatus;
  jobLink?: string;
  packageLPA?: number;
  referral?: string;
  oaDate?: string;
  interviewDate?: string;
  currentStage?: string;
  nextAction?: string;
  followUpDate?: string;
  isInternship?: boolean;
  notes?: string;
  createdAt: string;
}

// Project Capital & Defensibility Checklist
export type ProjectTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface DefensibilityChecklist {
  canExplainIn5Min: boolean;
  canExplainEveryTechChoice: boolean;
  canExplainArchitecture: boolean;
  canExplainTradeoffs: boolean;
  canExplainFailureHandling: boolean;
  canExplainDeployment: boolean;
  canExplainScaling: boolean;
}

export interface UserProject {
  id: string;
  title: string;
  tier: ProjectTier;
  tierLabel: string;
  isFlagship?: boolean;
  technologies: string[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'Deployed';
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
  deployment?: string;
  hasReadme?: boolean;
  hasTests?: boolean;
  defensibility: DefensibilityChecklist;
  resumeStatus: 'Do Not Put' | 'Early Versions Only' | 'Primary Campus Project' | 'Production Star Project';
  notes?: string;
  createdAt: string;
}

export type PlacementProject = UserProject;

// Network & Relationship System
export type ConnectionType = 'Senior' | 'Alumni' | 'Professor' | 'Internship Colleague' | 'Recruiter' | 'Mentor' | 'Peer';
export type ContactStatus = 'Not contacted' | 'Contacted' | 'Replied' | 'Conversation' | 'Follow-up' | 'Relationship';

export interface NetworkContact {
  id: string;
  name: string;
  company: string;
  role: string;
  connectionType: ConnectionType;
  dateContacted?: string;
  lastContact?: string;
  nextAction?: string;
  followUpDate?: string;
  status: ContactStatus;
  notes?: string;
  linkedInUrl?: string;
  email?: string;
  createdAt: string;
}

// Failure Log & Continuous Feedback Loop
export type FailureCategory =
  | 'Aptitude'
  | 'DSA'
  | 'CS Fundamentals'
  | 'Project Explanation'
  | 'Communication'
  | 'Behavioral'
  | 'Application / Resume'
  | 'Interview Pressure'
  | 'Time Management';

export interface FailureLog {
  id: string;
  title: string;
  category: FailureCategory;
  sourceType: 'interview' | 'oa_test' | 'mock' | 'application' | 'practice';
  sourceId?: string;
  companyOrContext?: string;
  rootCause: string;
  nextFixAction: string;
  status: 'Open' | 'Working' | 'Resolved';
  loggedDate: string;
  resolvedDate?: string;
  createdAt: string;
}

// Thinking-Aloud & Communication Practice Log
export interface ThinkingAloudSession {
  id: string;
  date: string;
  topic: string;
  skillType: 'Problem Explanation' | 'Approach Explanation' | 'Complexity Proof' | 'Edge Cases' | 'Project Explanation' | 'Behavioral Response';
  durationMinutes: number;
  selfScore: number; // 1-10
  notes?: string;
  createdAt: string;
}

// Readiness Gates System (Gates 1-5)
export type GateId = 'gate1' | 'gate2' | 'gate3' | 'gate4' | 'gate5';
export type GateStatus = 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED';

export interface ReadinessGateRequirement {
  id: string;
  label: string;
  targetMetric: string;
  currentMetric: string;
  isSatisfied: boolean;
  whyItMatters: string;
}

export interface ReadinessGate {
  id: GateId;
  gateNumber: number;
  name: string;
  targetTier: string;
  status: GateStatus;
  requirements: ReadinessGateRequirement[];
  unlocksDescription: string;
}

// Career Scoreboard Tracking
export interface CareerScoreboardMetrics {
  weekly: {
    dsaSolved: number;
    dsaTarget: number; // 10-15
    aptitudeMocks: number;
    aptitudeTarget: number; // 2
    applicationsSent: number;
    applicationsTarget: number; // 5-10
    careerTasksDone: number;
    careerTasksTarget: number; // 1+
  };
  monthly: {
    mocksCompleted: number;
    mocksTarget: number; // 1+
    projectMilestones: number;
    projectMilestonesTarget: number; // 1+
    resumeRevisions: number;
  };
  quarterly: {
    currentPathForecast: CareerTargetPath;
    barbellSafetyMet: boolean;
    strongTrackMet: boolean;
    ambitiousReady: boolean;
  };
}

// Career Profile / Resume & LinkedIn Readiness
export interface CareerProfile {
  resumeVersion: string;
  lastUpdated: string;
  targetRole: string;
  targetCompanyTier: string;
  atsSafe: boolean;
  onePage: boolean;
  hasImpactMetrics: boolean;
  hasDeployedLinks: boolean;
  projectsIncluded: string[];
  skillsListed: string[];
  linkedInUrl?: string;
  linkedInReadiness: {
    headlineDone: boolean;
    aboutDone: boolean;
    projectsLinked: boolean;
    githubLinked: boolean;
    resumeAligned: boolean;
    keywordsPresent: boolean;
    score: number; // 0-100
  };
  githubHealth: {
    pinnedProjects: boolean;
    realReadmes: boolean;
    deploymentsLinked: boolean;
    commitConsistency: boolean;
    noTutorialClones: boolean;
    score: number; // 0-100
  };
}

// Manifestation Profile
export interface ManifestationProfile {
  targetPackage: string; // "₹10–20L+ (Barbell to ₹25L+)"
  targetRole: string;
  targetCompanies: string;
  targetYear: string;
  primaryDsaLanguage: 'Java' | 'Python';
  selectedPath: CareerTargetPath;
  visionStatement: string;
  myWhy: string;
  whyThisMatters?: string;
  targetDream?: string;
  myPrinciples: string[];
  myNonNegotiables: string[];
  dailyNonNegotiables?: string[];
  myDailyStandard: string;
  onboardingCompleted: boolean;
}

export interface DailyCheckin {
  id: string;
  date: string;
  mainObjective: string;
  skillBuilding: string;
  mustComplete: string;
  distractionToAvoid: string;
  accomplished?: string;
  learned?: string;
  rating?: number;
}

export interface DailyFocusState {
  date: string;
  primaryFocus: string;
  durationMinutes: number;
  supporting: string[];
  completed: boolean;
  notes?: string;
  availableHours?: number;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'add_planner' | 'add_test' | 'navigate_roadmap' | 'add_interview' | 'add_application';
    payload?: any;
  };
}

export interface ReadinessDimension {
  title: string;
  percentage: number;
  status: ReadinessStatus;
  criteriaDescription: string;
  criteria?: string;
  weight?: number;
  evidence: string[];
  nextMilestone: string;
  formula?: string;
}
