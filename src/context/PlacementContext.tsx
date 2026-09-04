import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  PlannerEvent,
  PlacementTest,
  PlacementInterview,
  CollegeExam,
  JobApplication,
  UserProject,
  ManifestationProfile,
  DailyCheckin,
  DailyFocusState,
  AIMessage,
  ReadinessDimension,
  ReadinessStatus
} from '../types';
import { MASTER_38_NODES, READINESS_SCORECARD_SPECS } from '../data/roadmapData';
import {
  dbFetchEvents,
  dbSaveEvent,
  dbDeleteEvent,
  dbFetchApplications,
  dbSaveApplication,
  dbDeleteApplication,
  dbFetchProjects,
  dbSaveProject,
  dbDeleteProject,
  dbSaveTestResult,
  dbSaveInterviewNotes,
  dbFetchUserSettings,
  dbSaveUserSettings
} from '../lib/supabase';

interface UserNodeProgress {
  [nodeId: string]: {
    completed: boolean;
    completedAt?: string;
    notes?: string;
  };
}

interface PlacementContextType {
  userName: string;
  setUserName: (name: string) => void;
  targetPackage: string;
  targetDream: string;
  targetYear: string;
  nodeProgress: UserNodeProgress;
  toggleNodeCompletion: (nodeId: string, notes?: string) => void;
  
  // Daily Focus
  dailyFocus: DailyFocusState;
  updateDailyFocus: (focus: Partial<DailyFocusState>) => void;
  
  // Events / Planner
  events: PlannerEvent[];
  addEvent: (event: Omit<PlannerEvent, 'id' | 'createdAt'>) => PlannerEvent;
  updateEvent: (id: string, updates: Partial<PlannerEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleEventCompleted: (id: string) => void;

  // Tests
  tests: PlacementTest[];
  addTest: (test: Omit<PlacementTest, 'id' | 'createdAt'>) => PlacementTest;
  updateTest: (id: string, updates: Partial<PlacementTest>) => void;
  deleteTest: (id: string) => void;

  // Interviews
  interviews: PlacementInterview[];
  addInterview: (interview: Omit<PlacementInterview, 'id' | 'createdAt'>) => PlacementInterview;
  updateInterview: (id: string, updates: Partial<PlacementInterview>) => void;
  deleteInterview: (id: string) => void;

  // Exams
  exams: CollegeExam[];
  addExam: (exam: Omit<CollegeExam, 'id' | 'createdAt'>) => CollegeExam;
  updateExam: (id: string, updates: Partial<CollegeExam>) => void;
  deleteExam: (id: string) => void;

  // Applications
  applications: JobApplication[];
  addApplication: (app: Omit<JobApplication, 'id' | 'createdAt'>) => JobApplication;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;

  // Projects
  projects: UserProject[];
  addProject: (proj: Omit<UserProject, 'id' | 'createdAt'>) => UserProject;
  updateProject: (id: string, updates: Partial<UserProject>) => void;
  deleteProject: (id: string) => void;

  // Manifestation
  manifestation: ManifestationProfile;
  updateManifestation: (updates: Partial<ManifestationProfile>) => void;
  dailyCheckins: DailyCheckin[];
  addDailyCheckin: (checkin: Omit<DailyCheckin, 'id'>) => void;

  // AI Chat
  aiMessages: AIMessage[];
  addAIMessage: (msg: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  clearAIChat: () => void;

  // Derived / Calculated Stats
  currentPhaseName: string;
  overallReadinessScore: number;
  readinessDimensions: ReadinessDimension[];
  studyHoursTotal: number;
  completedNodesCount: number;
  upcomingEventsCount: number;
  applicationsSummary: {
    total: number;
    applied: number;
    oa: number;
    interview: number;
    offer: number;
  };
}

const STORAGE_KEYS = {
  USER_NAME: 'pos_user_name',
  PROGRESS: 'pos_node_progress',
  DAILY_FOCUS: 'pos_daily_focus',
  EVENTS: 'pos_events',
  TESTS: 'pos_tests',
  INTERVIEWS: 'pos_interviews',
  EXAMS: 'pos_exams',
  APPLICATIONS: 'pos_applications',
  PROJECTS: 'pos_projects',
  MANIFESTATION: 'pos_manifestation',
  DAILY_CHECKINS: 'pos_daily_checkins',
  AI_MESSAGES: 'pos_ai_messages'
};

const defaultManifestation: ManifestationProfile = {
  targetPackage: "₹23.3 LPA+",
  targetRole: "Software Engineer",
  targetCompanies: "Google / Top Product Companies (Razorpay, PhonePe, CRED)",
  targetYear: "2027",
  visionStatement: "I am consistently evolving into an elite software engineer capable of architecting scalable backend distributed systems and solving complex algorithmic challenges under time pressure.",
  myWhy: "To achieve complete financial sovereignty, build high-impact distributed software at massive scale, and secure my family's future through uncompromising technical craftsmanship.",
  myPrinciples: [
    "No passive watching: 1 hour of study demands 3 hours of direct implementation.",
    "Master the primary core: Depth in Java, Spring Boot, and Graph algorithms over surface-level multi-language bloat.",
    "Think aloud: Never code in silence; every trade-off and data structure selection must be verbally justified.",
    "Discipline over inspiration: The schedule must be executed regardless of temporary mood."
  ],
  myNonNegotiables: [
    "Minimum 2 LeetCode Medium problems solved or deeply analyzed daily.",
    "30 minutes of quantitative aptitude speed drills every single day.",
    "Never go to sleep without logging what broke and why in the Mistake Log.",
    "No switching technologies or starting unrequested frontend frameworks until backend and DSA are secured."
  ],
  myDailyStandard: "Wake up with clarity. Attack the highest ROI task first. Write clean, compiling code with zero crutches."
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const defaultDailyFocus: DailyFocusState = {
  date: getTodayString(),
  primaryFocus: "Java Fundamentals & Control Flow",
  durationMinutes: 90,
  supporting: ["Aptitude: Percentages & Ratios", "DSA: Array Logic & Time Complexity"],
  completed: false
};

const PlacementContext = createContext<PlacementContextType | undefined>(undefined);

export const PlacementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Info
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Candidate';
  });

  // Target Information (Fixed read-only targets as per PDF)
  const targetPackage = "₹23.3 LPA+";
  const targetDream = "Google / Top Product Companies";
  const targetYear = "2027";

  // Roadmap Node Progress
  const [nodeProgress, setNodeProgress] = useState<UserNodeProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Daily Focus
  const [dailyFocus, setDailyFocusState] = useState<DailyFocusState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_FOCUS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === getTodayString()) return parsed;
      }
      return defaultDailyFocus;
    } catch {
      return defaultDailyFocus;
    }
  });

  // Planner Events
  const [events, setEvents] = useState<PlannerEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Placement Tests
  const [tests, setTests] = useState<PlacementTest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Interviews
  const [interviews, setInterviews] = useState<PlacementInterview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Exams
  const [exams, setExams] = useState<CollegeExam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Applications
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Projects
  const [projects, setProjects] = useState<UserProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Manifestation
  const [manifestation, setManifestation] = useState<ManifestationProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MANIFESTATION);
      return saved ? JSON.parse(saved) : defaultManifestation;
    } catch {
      return defaultManifestation;
    }
  });

  const [dailyCheckins, setDailyCheckins] = useState<DailyCheckin[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Chat Messages
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AI_MESSAGES);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'welcome',
          sender: 'assistant',
          content: "Welcome to **Placement OS**. I am your dedicated Placement Strategic Mentor.\n\nI have the complete **Tech Placement Dependency Graph** loaded—focusing strictly on bridging your baseline to **₹23.3 LPA** product unicorns and **Google L3 SWE**.\n\nHow can I direct your focus today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    } catch {
      return [];
    }
  });

  // Initial sync with Supabase PostgreSQL if configured
  useEffect(() => {
    async function initSupabase() {
      const [dbEvents, dbApps, dbProjs, dbSettings] = await Promise.all([
        dbFetchEvents(),
        dbFetchApplications(),
        dbFetchProjects(),
        dbFetchUserSettings()
      ]);
      if (dbEvents && dbEvents.length > 0) setEvents(dbEvents);
      if (dbApps && dbApps.length > 0) setApplications(dbApps);
      if (dbProjs && dbProjs.length > 0) setProjects(dbProjs);
      if (dbSettings) {
        if (dbSettings.user_name) setUserName(dbSettings.user_name);
        if (dbSettings.node_progress) setNodeProgress(dbSettings.node_progress);
        if (dbSettings.daily_focus) setDailyFocusState(dbSettings.daily_focus);
        if (dbSettings.manifestation) setManifestation(dbSettings.manifestation);
      }
    }
    initSupabase();
  }, []);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
    dbSaveUserSettings({ userName });
  }, [userName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(nodeProgress));
    dbSaveUserSettings({ nodeProgress });
  }, [nodeProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_FOCUS, JSON.stringify(dailyFocus));
    dbSaveUserSettings({ dailyFocus });
  }, [dailyFocus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANIFESTATION, JSON.stringify(manifestation));
    dbSaveUserSettings({ manifestation });
  }, [manifestation]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(dailyCheckins));
  }, [dailyCheckins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AI_MESSAGES, JSON.stringify(aiMessages));
  }, [aiMessages]);

  // Actions
  const toggleNodeCompletion = (nodeId: string, notes?: string) => {
    setNodeProgress(prev => {
      const current = prev[nodeId]?.completed || false;
      return {
        ...prev,
        [nodeId]: {
          completed: !current,
          completedAt: !current ? new Date().toISOString() : undefined,
          notes: notes !== undefined ? notes : prev[nodeId]?.notes
        }
      };
    });
  };

  const updateDailyFocus = (updates: Partial<DailyFocusState>) => {
    setDailyFocusState(prev => ({
      ...prev,
      ...updates,
      date: getTodayString()
    }));
  };

  // Events
  const addEvent = (eventData: Omit<PlannerEvent, 'id' | 'createdAt'>): PlannerEvent => {
    const newEvent: PlannerEvent = {
      ...eventData,
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
    dbSaveEvent(newEvent);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<PlannerEvent>) => {
    setEvents(prev => {
      const updated = prev.map(ev => ev.id === id ? { ...ev, ...updates } : ev);
      const target = updated.find(ev => ev.id === id);
      if (target) dbSaveEvent(target);
      return updated;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
    dbDeleteEvent(id);
  };

  const toggleEventCompleted = (id: string) => {
    setEvents(prev => {
      const updated = prev.map(ev => {
        if (ev.id === id) {
          return {
            ...ev,
            status: (ev.status === 'completed' ? 'scheduled' : 'completed') as any
          };
        }
        return ev;
      });
      const target = updated.find(ev => ev.id === id);
      if (target) dbSaveEvent(target);
      return updated;
    });
  };

  // Tests
  const addTest = (testData: Omit<PlacementTest, 'id' | 'createdAt'>): PlacementTest => {
    const newTest: PlacementTest = {
      ...testData,
      id: 'test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    setTests(prev => [newTest, ...prev]);
    
    // Mirror into unified events table
    const createdEv = addEvent({
      title: `${newTest.company ? newTest.company + ' ' : ''}${newTest.testName}`,
      eventType: newTest.testType === 'Aptitude' ? 'aptitude_test' : 'coding_test',
      date: newTest.date,
      startTime: newTest.startTime,
      durationMinutes: newTest.durationMinutes,
      category: 'Aptitude & Tests',
      status: newTest.status === 'Completed' ? 'completed' : 'scheduled',
      notes: newTest.notes,
      link: newTest.locationOrUrl
    });

    // Save test result breakdown to test_results table
    dbSaveTestResult({
      id: newTest.id,
      eventId: createdEv.id,
      testName: newTest.testName,
      company: newTest.company,
      testType: newTest.testType,
      score: newTest.score,
      maxScore: newTest.maxScore,
      percentage: newTest.percentage,
      questionsCount: newTest.questionsCount,
      correctCount: newTest.correctCount,
      incorrectCount: newTest.incorrectCount,
      skippedCount: newTest.skippedCount,
      weakTopics: newTest.weakTopics,
      testMistakesNotes: newTest.testMistakesNotes,
      createdAt: newTest.createdAt
    });

    return newTest;
  };

  const updateTest = (id: string, updates: Partial<PlacementTest>) => {
    setTests(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      const target = updated.find(t => t.id === id);
      if (target) {
        dbSaveTestResult({
          id: target.id,
          testName: target.testName,
          company: target.company,
          testType: target.testType,
          score: target.score,
          maxScore: target.maxScore,
          percentage: target.percentage,
          weakTopics: target.weakTopics,
          testMistakesNotes: target.testMistakesNotes
        });
      }
      return updated;
    });
  };

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  // Interviews
  const addInterview = (data: Omit<PlacementInterview, 'id' | 'createdAt'>): PlacementInterview => {
    const newInterview: PlacementInterview = {
      ...data,
      id: 'int_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    setInterviews(prev => [newInterview, ...prev]);

    // Mirror to unified events table
    const createdEv = addEvent({
      title: `${newInterview.company} - ${newInterview.role} (${newInterview.round})`,
      eventType: newInterview.round === 'HR' || newInterview.round === 'Behavioral' ? 'hr_interview' : 'technical_interview',
      date: newInterview.date,
      startTime: newInterview.time,
      durationMinutes: newInterview.durationMinutes,
      category: 'Interviews',
      status: newInterview.status === 'Completed' ? 'completed' : 'scheduled',
      notes: newInterview.notes,
      link: newInterview.link
    });

    // Save interview notes table record
    dbSaveInterviewNotes({
      id: newInterview.id,
      eventId: createdEv.id,
      company: newInterview.company,
      role: newInterview.role,
      round: newInterview.round,
      interviewer: newInterview.interviewer,
      questionsAsked: newInterview.feedback?.questionsAsked,
      whatWentWell: newInterview.feedback?.whatWentWell,
      whatWentBadly: newInterview.feedback?.whatWentBadly,
      topicsTested: newInterview.feedback?.topicsTested,
      mistakes: newInterview.feedback?.mistakes,
      lessons: newInterview.feedback?.lessons,
      nextAction: newInterview.feedback?.nextAction,
      verdict: newInterview.feedback?.verdict || 'Pending',
      createdAt: newInterview.createdAt
    });

    return newInterview;
  };

  const updateInterview = (id: string, updates: Partial<PlacementInterview>) => {
    setInterviews(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, ...updates } : i);
      const target = updated.find(i => i.id === id);
      if (target) {
        dbSaveInterviewNotes({
          id: target.id,
          company: target.company,
          role: target.role,
          round: target.round,
          interviewer: target.interviewer,
          questionsAsked: target.feedback?.questionsAsked,
          whatWentWell: target.feedback?.whatWentWell,
          whatWentBadly: target.feedback?.whatWentBadly,
          verdict: target.feedback?.verdict || 'Pending'
        });
      }
      return updated;
    });
  };

  const deleteInterview = (id: string) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
  };

  // Exams
  const addExam = (data: Omit<CollegeExam, 'id' | 'createdAt'>): CollegeExam => {
    const newExam: CollegeExam = {
      ...data,
      id: 'exam_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    setExams(prev => [newExam, ...prev]);

    // Mirror to unified events table
    addEvent({
      title: `Exam: ${newExam.examName} (${newExam.subject})`,
      eventType: 'college_exam',
      date: newExam.date,
      startTime: newExam.time,
      durationMinutes: newExam.durationMinutes,
      category: 'College Exams',
      status: 'scheduled',
      notes: newExam.syllabus
    });

    return newExam;
  };

  const updateExam = (id: string, updates: Partial<CollegeExam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // Applications
  const addApplication = (data: Omit<JobApplication, 'id' | 'createdAt'>): JobApplication => {
    const newApp: JobApplication = {
      ...data,
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    dbSaveApplication(newApp);

    // If deadline exists, add planner event into unified events table
    if (newApp.deadline) {
      addEvent({
        title: `Deadline: ${newApp.company} (${newApp.role})`,
        eventType: 'application_deadline',
        date: newApp.deadline,
        durationMinutes: 30,
        category: 'Applications',
        status: 'scheduled',
        link: newApp.jobLink
      });
    }

    return newApp;
  };

  const updateApplication = (id: string, updates: Partial<JobApplication>) => {
    setApplications(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...updates } : a);
      const target = updated.find(a => a.id === id);
      if (target) dbSaveApplication(target);
      return updated;
    });
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    dbDeleteApplication(id);
  };

  // Projects
  const addProject = (data: Omit<UserProject, 'id' | 'createdAt'>): UserProject => {
    const newProj: UserProject = {
      ...data,
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [newProj, ...prev]);
    dbSaveProject(newProj);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<UserProject>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      const target = updated.find(p => p.id === id);
      if (target) dbSaveProject(target);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    dbDeleteProject(id);
  };


  // Manifestation
  const updateManifestation = (updates: Partial<ManifestationProfile>) => {
    setManifestation(prev => ({ ...prev, ...updates }));
  };

  const addDailyCheckin = (data: Omit<DailyCheckin, 'id'>) => {
    const newCheckin: DailyCheckin = {
      ...data,
      id: 'chk_' + Date.now()
    };
    setDailyCheckins(prev => [newCheckin, ...prev]);
  };

  // AI Chat
  const addAIMessage = (msg: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMsg: AIMessage = {
      ...msg,
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages(prev => [...prev, newMsg]);
  };

  const clearAIChat = () => {
    setAiMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        content: "Chat reset. How can I help with your roadmap, upcoming exams, or interview prep?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Dynamic Derived States
  const completedNodesCount = useMemo(() => {
    return (Object.values(nodeProgress) as Array<{ completed: boolean }>).filter(p => p.completed).length;
  }, [nodeProgress]);

  const currentPhaseName = useMemo(() => {
    if (completedNodesCount < 6) {
      return "Phase 1: Java + Aptitude + Basic DSA Foundation";
    } else if (completedNodesCount < 14) {
      return "Phase 2: Core DSA (Trees, Lists) + SQL & DBMS + Git";
    } else if (completedNodesCount < 24) {
      return "Phase 3: Advanced DSA (Graphs, DP) + Spring Boot + OS/CN";
    } else if (completedNodesCount < 33) {
      return "Phase 4: Tier 3/4 Scalable Projects + LLD + ATS Resume";
    } else {
      return "Phase 5: Google L3 Focus + Google Docs Plaintext Mock Coding";
    }
  }, [completedNodesCount]);

  const studyHoursTotal = useMemo(() => {
    return events
      .filter(e => e.status === 'completed')
      .reduce((acc, curr) => acc + (curr.durationMinutes || 0) / 60, 0);
  }, [events]);

  const upcomingEventsCount = useMemo(() => {
    const today = getTodayString();
    return events.filter(e => e.status !== 'completed' && e.date >= today).length;
  }, [events]);

  const applicationsSummary = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(a => a.status === 'applied').length;
    const oa = applications.filter(a => a.status === 'oa_scheduled' || a.status === 'oa_completed').length;
    const interview = applications.filter(a => a.status === 'interview_scheduled' || a.status === 'interviewing').length;
    const offer = applications.filter(a => a.status === 'offer').length;
    return { total, applied, oa, interview, offer };
  }, [applications]);

  // Compute Empirical Placement Readiness Dimensions based strictly on PDF Section 23!
  const readinessDimensions: ReadinessDimension[] = useMemo(() => {
    // 1. DSA Readiness
    // Criteria: LeetCode problems, graph/DP mastery, plain text coding
    const dsaNodesCompleted = ['04', '05', '33'].filter(id => nodeProgress[id]?.completed).length;
    const dsaEventsCompleted = events.filter(e => (e.category.includes('DSA') || e.title.toLowerCase().includes('dsa') || e.title.toLowerCase().includes('leetcode')) && e.status === 'completed').length;
    const dsaPct = Math.min(100, Math.round((dsaNodesCompleted * 25) + (dsaEventsCompleted * 4)));
    const dsaStatus: ReadinessStatus = dsaPct >= 85 ? 'READY' : dsaPct > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

    // 2. CS Core Readiness
    // Criteria: Explain ACID, Deadlocks, TCP/IP handshake
    const csNodes = ['01', '08', '09', '10'].filter(id => nodeProgress[id]?.completed).length;
    const csPct = Math.min(100, Math.round((csNodes / 4) * 100));
    const csStatus: ReadinessStatus = csPct >= 80 ? 'READY' : csPct > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

    // 3. Projects Readiness
    // Criteria: Deployed Spring Boot + PostgreSQL + Redis
    const deployedProjects = projects.filter(p => p.status === 'Deployed' && (p.tier === 'tier3' || p.tier === 'tier4')).length;
    const projectNodes = ['16', '20', '36'].filter(id => nodeProgress[id]?.completed).length;
    const projPct = Math.min(100, Math.round((deployedProjects * 50) + (projectNodes * 20)));
    const projStatus: ReadinessStatus = projPct >= 80 ? 'READY' : projPct > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

    // 4. Behavioral Readiness
    // Criteria: 5 STAR-L stories documented
    const behavioralNodes = ['26', '29', '37'].filter(id => nodeProgress[id]?.completed).length;
    const mockBehavioralCount = interviews.filter(i => (i.round === 'Behavioral' || i.round === 'HR') && i.status === 'Completed').length;
    const behPct = Math.min(100, Math.round((behavioralNodes * 25) + (mockBehavioralCount * 25)));
    const behStatus: ReadinessStatus = behPct >= 80 ? 'READY' : behPct > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

    // 5. Aptitude Readiness
    // Criteria: Consistently >80% on timed TCS/Infosys mock assessments
    const completedAptitudeTests = tests.filter(t => t.testType === 'Aptitude' && t.status === 'Completed');
    const highScoringTests = completedAptitudeTests.filter(t => (t.percentage || 0) >= 80).length;
    const aptNode = nodeProgress['02']?.completed ? 30 : 0;
    const testScoreContribution = completedAptitudeTests.length > 0 
      ? Math.min(70, Math.round((highScoringTests / Math.max(1, completedAptitudeTests.length)) * 70))
      : 0;
    const aptPct = Math.min(100, aptNode + testScoreContribution);
    const aptStatus: ReadinessStatus = aptPct >= 80 ? 'READY' : aptPct > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

    return [
      {
        title: "DSA Readiness",
        percentage: dsaPct,
        status: dsaStatus,
        criteriaDescription: READINESS_SCORECARD_SPECS.dsa.targetDone,
        evidence: [
          `${dsaNodesCompleted}/3 Roadmap DSA modules conquered`,
          `${dsaEventsCompleted} problem-solving sessions executed`,
          dsaPct >= 85 ? "Meets plain text 25-min LeetCode Medium standard" : "Requires further timed Graph/DP plain text drills"
        ],
        nextMilestone: READINESS_SCORECARD_SPECS.dsa.milestones[Math.min(3, Math.floor(dsaPct / 25))]
      },
      {
        title: "CS Core Readiness",
        percentage: csPct,
        status: csStatus,
        criteriaDescription: READINESS_SCORECARD_SPECS.csCore.targetDone,
        evidence: [
          `${csNodes}/4 Core CS modules (OS, DBMS, CN, Fundamentals) verified`,
          csPct >= 80 ? "ACID, Deadlocks & TCP/IP handshake cleared" : "Consolidate thread concurrency & B-Tree indexing flashcards"
        ],
        nextMilestone: READINESS_SCORECARD_SPECS.csCore.milestones[Math.min(3, Math.floor(csPct / 25))]
      },
      {
        title: "Projects Readiness",
        percentage: projPct,
        status: projStatus,
        criteriaDescription: READINESS_SCORECARD_SPECS.projects.targetDone,
        evidence: [
          `${deployedProjects} Tier 3/4 production backend service(s) deployed`,
          `${projects.length} project repository(ies) registered`
        ],
        nextMilestone: READINESS_SCORECARD_SPECS.projects.milestones[Math.min(3, Math.floor(projPct / 25))]
      },
      {
        title: "Behavioral Readiness",
        percentage: behPct,
        status: behStatus,
        criteriaDescription: READINESS_SCORECARD_SPECS.behavioral.targetDone,
        evidence: [
          `${behavioralNodes}/3 Communication & Googleyness modules completed`,
          `${mockBehavioralCount} mock behavioral debrief(s) logged`
        ],
        nextMilestone: READINESS_SCORECARD_SPECS.behavioral.milestones[Math.min(4, Math.floor(behPct / 20))]
      },
      {
        title: "Aptitude Readiness",
        percentage: aptPct,
        status: aptStatus,
        criteriaDescription: READINESS_SCORECARD_SPECS.aptitude.targetDone,
        evidence: [
          `${completedAptitudeTests.length} aptitude assessments logged`,
          `${highScoringTests} test(s) achieved >80% accuracy`
        ],
        nextMilestone: READINESS_SCORECARD_SPECS.aptitude.milestones[Math.min(3, Math.floor(aptPct / 25))]
      }
    ];
  }, [nodeProgress, events, projects, interviews, tests]);

  const overallReadinessScore = useMemo(() => {
    if (readinessDimensions.length === 0) return 0;
    const sum = readinessDimensions.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / readinessDimensions.length);
  }, [readinessDimensions]);

  return (
    <PlacementContext.Provider
      value={{
        userName,
        setUserName,
        targetPackage,
        targetDream,
        targetYear,
        nodeProgress,
        toggleNodeCompletion,
        dailyFocus,
        updateDailyFocus,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventCompleted,
        tests,
        addTest,
        updateTest,
        deleteTest,
        interviews,
        addInterview,
        updateInterview,
        deleteInterview,
        exams,
        addExam,
        updateExam,
        deleteExam,
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        projects,
        addProject,
        updateProject,
        deleteProject,
        manifestation,
        updateManifestation,
        dailyCheckins,
        addDailyCheckin,
        aiMessages,
        addAIMessage,
        clearAIChat,
        currentPhaseName,
        overallReadinessScore,
        readinessDimensions,
        studyHoursTotal,
        completedNodesCount,
        upcomingEventsCount,
        applicationsSummary
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacement = (): PlacementContextType => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};
