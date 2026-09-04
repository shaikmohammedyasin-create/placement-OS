import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  FolderGit2
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { MASTER_38_NODES } from '../../data/roadmapData';
import { TestType, InterviewRound, DifficultyLevel, ApplicationStatus, ProjectTier } from '../../types';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
}

export const AddEntityModal: React.FC<AddEntityModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'study'
}) => {
  const { addEvent, addTest, addInterview, addExam, addApplication, addProject } = usePlacement();
  const [activeType, setActiveType] = useState<string>(defaultType);

  // Common date default
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Study Session State
  const [studyTitle, setStudyTitle] = useState('');
  const [studyCategory, setStudyCategory] = useState('DSA');
  const [studyDuration, setStudyDuration] = useState('60');
  const [studyDate, setStudyDate] = useState(todayStr);
  const [studyTime, setStudyTime] = useState('17:00');
  const [studyNodeId, setStudyNodeId] = useState('');
  const [studyNotes, setStudyNotes] = useState('');

  // 2. Test State
  const [testName, setTestName] = useState('');
  const [testCompany, setTestCompany] = useState('');
  const [testType, setTestType] = useState<TestType>('Aptitude');
  const [testDate, setTestDate] = useState(todayStr);
  const [testTime, setTestTime] = useState('10:00');
  const [testDuration, setTestDuration] = useState('60');
  const [testDifficulty, setTestDifficulty] = useState<DifficultyLevel>('MED');
  const [testLink, setTestLink] = useState('');
  const [testTopics, setTestTopics] = useState('');
  const [testNotes, setTestNotes] = useState('');

  // 3. Interview State
  const [interviewCompany, setInterviewCompany] = useState('');
  const [interviewRole, setInterviewRole] = useState('Software Engineer');
  const [interviewRound, setInterviewRound] = useState<InterviewRound>('Technical');
  const [interviewDate, setInterviewDate] = useState(todayStr);
  const [interviewTime, setInterviewTime] = useState('14:00');
  const [interviewDuration, setInterviewDuration] = useState('45');
  const [interviewMode, setInterviewMode] = useState<'Virtual' | 'In-Person' | 'Telephonic'>('Virtual');
  const [interviewLink, setInterviewLink] = useState('');
  const [interviewInterviewer, setInterviewInterviewer] = useState('');
  const [interviewTopics, setInterviewTopics] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  // 4. Exam State
  const [examName, setExamName] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState(todayStr);
  const [examTime, setExamTime] = useState('09:30');
  const [examDuration, setExamDuration] = useState('180');
  const [examLocation, setExamLocation] = useState('College Examination Hall');
  const [examSyllabus, setExamSyllabus] = useState('');

  // 5. Application State
  const [appCompany, setAppCompany] = useState('');
  const [appRole, setAppRole] = useState('Software Engineer');
  const [appDeadline, setAppDeadline] = useState('');
  const [appStatus, setAppStatus] = useState<ApplicationStatus>('applied');
  const [appJobLink, setAppJobLink] = useState('');
  const [appPackageLPA, setAppPackageLPA] = useState('23.3');
  const [appReferral, setAppReferral] = useState('');
  const [appNotes, setAppNotes] = useState('');

  // 6. Project State
  const [projTitle, setProjTitle] = useState('');
  const [projTier, setProjTier] = useState<ProjectTier>('tier3');
  const [projTech, setProjTech] = useState('Java, Spring Boot, PostgreSQL, JWT');
  const [projStatus, setProjStatus] = useState<'Planning' | 'In Progress' | 'Completed' | 'Deployed'>('In Progress');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projFeatures, setProjFeatures] = useState('');

  if (!isOpen) return null;

  const entityOptions = [
    { id: 'study', label: 'Study Session', icon: BookOpen },
    { id: 'test', label: 'Placement Test', icon: Award },
    { id: 'interview', label: 'Interview', icon: Users },
    { id: 'exam', label: 'College Exam', icon: GraduationCap },
    { id: 'application', label: 'Job Application', icon: Briefcase },
    { id: 'project', label: 'Project', icon: FolderGit2 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'study') {
      if (!studyTitle.trim()) return;
      addEvent({
        title: studyTitle,
        eventType: 'study',
        date: studyDate,
        startTime: studyTime,
        durationMinutes: parseInt(studyDuration) || 60,
        category: studyCategory,
        status: 'scheduled',
        roadmapNodeId: studyNodeId || undefined,
        notes: studyNotes
      });
    } else if (activeType === 'test') {
      if (!testName.trim()) return;
      addTest({
        testName,
        company: testCompany,
        testType,
        date: testDate,
        startTime: testTime,
        durationMinutes: parseInt(testDuration) || 60,
        difficulty: testDifficulty,
        locationOrUrl: testLink,
        topics: testTopics.split(',').map(s => s.trim()).filter(Boolean),
        status: 'Scheduled',
        notes: testNotes
      });
    } else if (activeType === 'interview') {
      if (!interviewCompany.trim()) return;
      addInterview({
        company: interviewCompany,
        role: interviewRole,
        round: interviewRound,
        date: interviewDate,
        time: interviewTime,
        durationMinutes: parseInt(interviewDuration) || 45,
        mode: interviewMode,
        link: interviewLink,
        interviewer: interviewInterviewer,
        topics: interviewTopics.split(',').map(s => s.trim()).filter(Boolean),
        preparationStatus: 'In Progress',
        status: 'Scheduled',
        notes: interviewNotes
      });
    } else if (activeType === 'exam') {
      if (!examName.trim()) return;
      addExam({
        examName,
        subject: examSubject,
        date: examDate,
        time: examTime,
        durationMinutes: parseInt(examDuration) || 180,
        location: examLocation,
        syllabus: examSyllabus,
        preparationStatus: 'In Progress'
      });
    } else if (activeType === 'application') {
      if (!appCompany.trim()) return;
      addApplication({
        company: appCompany,
        role: appRole,
        applicationDate: todayStr,
        deadline: appDeadline || undefined,
        status: appStatus,
        jobLink: appJobLink,
        packageLPA: parseFloat(appPackageLPA) || 23.3,
        referral: appReferral,
        notes: appNotes
      });
    } else if (activeType === 'project') {
      if (!projTitle.trim()) return;
      const tierLabels: Record<ProjectTier, string> = {
        tier1: 'Tier 1 (Beginner Console)',
        tier2: 'Tier 2 (Intermediate REST)',
        tier3: 'Tier 3 (Strong Resume ₹15L+)',
        tier4: 'Tier 4 (Scalable Engine ₹23.3L+)'
      };
      const resumeRules: Record<ProjectTier, any> = {
        tier1: 'Do Not Put',
        tier2: 'Early Versions Only',
        tier3: 'Primary Campus Project',
        tier4: 'Production Star Project'
      };
      addProject({
        title: projTitle,
        tier: projTier,
        tierLabel: tierLabels[projTier],
        technologies: projTech.split(',').map(s => s.trim()).filter(Boolean),
        status: projStatus,
        githubUrl: projGithub,
        liveUrl: projLive,
        features: projFeatures.split('\n').map(s => s.trim()).filter(Boolean),
        resumeStatus: resumeRules[projTier]
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 transition-opacity" onClick={onClose}>
      <div
        className="w-full sm:max-w-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] shadow-2xl rounded-t-2xl sm:rounded-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden relative pb-[max(12px,env(safe-area-inset-bottom))]"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-[#282830] bg-gray-50/50 dark:bg-[#1D1D22]/50 shrink-0">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#5856D6] dark:text-[#7A79E0] uppercase tracking-wider mb-0.5">
              NEW ENTRY
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Log Placement Activity
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-gray-200 dark:border-[#282830] text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Entity Selector Pills */}
        <div className="px-4 sm:px-6 py-2.5 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-[#282830] bg-white dark:bg-[#151519] shrink-0">
          {entityOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = activeType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveType(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border min-h-[40px] ${
                  isSelected
                    ? 'bg-[#5856D6] text-white border-transparent shadow-sm'
                    : 'bg-gray-50 dark:bg-[#1D1D22] border-gray-200 dark:border-[#282830] text-gray-600 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* 1. STUDY SESSION */}
          {activeType === 'study' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java Control Flow & Pattern Loops"
                  value={studyTitle}
                  onChange={e => setStudyTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={studyCategory}
                    onChange={e => setStudyCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  >
                    <option value="Java">Java Syntax & OOP</option>
                    <option value="DSA">DSA (Arrays, Two-Pointers, DP)</option>
                    <option value="Aptitude">Quantitative Aptitude</option>
                    <option value="Backend">Backend / Spring Boot</option>
                    <option value="SQL">SQL & DBMS</option>
                    <option value="CS Core">OS & Networks</option>
                    <option value="Interview">Interview Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={studyDuration}
                    onChange={e => setStudyDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={studyDate}
                    onChange={e => setStudyDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={studyTime}
                    onChange={e => setStudyTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Roadmap Node (Optional)
                </label>
                <select
                  value={studyNodeId}
                  onChange={e => setStudyNodeId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                >
                  <option value="">-- No specific node --</option>
                  {MASTER_38_NODES.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.id}. {node.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Notes / Problems Solved</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Solved 3 pattern problems; O(N^2) space complexity"
                  value={studyNotes}
                  onChange={e => setStudyNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6]"
                />
              </div>
            </div>
          )}

          {/* 2. PLACEMENT TEST */}
          {activeType === 'test' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Test Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Infosys Aptitude Assessment"
                    value={testName}
                    onChange={e => setTestName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Infosys / TCS / Zoho"
                    value={testCompany}
                    onChange={e => setTestCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={testType}
                    onChange={e => setTestType(e.target.value as TestType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  >
                    <option value="Aptitude">Aptitude</option>
                    <option value="Coding">Coding</option>
                    <option value="Technical MCQ">Technical MCQ</option>
                    <option value="Company OA">Company OA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={testDifficulty}
                    onChange={e => setTestDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MED">Med</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Duration (m)</label>
                  <input
                    type="number"
                    value={testDuration}
                    onChange={e => setTestDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={e => setTestDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={testTime}
                    onChange={e => setTestTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Topics</label>
                <input
                  type="text"
                  placeholder="e.g. Percentages, Ratios, Profit & Loss"
                  value={testTopics}
                  onChange={e => setTestTopics(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                />
              </div>
            </div>
          )}

          {/* 3. INTERVIEW */}
          {activeType === 'interview' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay / PhonePe / Google"
                    value={interviewCompany}
                    onChange={e => setInterviewCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer (Backend)"
                    value={interviewRole}
                    onChange={e => setInterviewRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Round</label>
                  <select
                    value={interviewRound}
                    onChange={e => setInterviewRound(e.target.value as InterviewRound)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Coding">Coding</option>
                    <option value="System Design">System Design</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="HR">HR</option>
                    <option value="Mock Interview">Mock</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={e => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Meeting Link / Google Meet</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={interviewLink}
                  onChange={e => setInterviewLink(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                />
              </div>
            </div>
          )}

          {/* 4. COLLEGE EXAM */}
          {activeType === 'exam' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Exam Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. End Semester Exam"
                    value={examName}
                    onChange={e => setExamName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. DBMS / Operating Systems"
                    value={examSubject}
                    onChange={e => setExamSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={e => setExamTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. JOB APPLICATION */}
          {activeType === 'application' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PhonePe"
                    value={appCompany}
                    onChange={e => setAppCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="Software Engineer"
                    value={appRole}
                    onChange={e => setAppRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={appStatus}
                    onChange={e => setAppStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  >
                    <option value="wishlist">Wishlist</option>
                    <option value="applied">Applied</option>
                    <option value="oa_scheduled">OA Scheduled</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Package (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={appPackageLPA}
                    onChange={e => setAppPackageLPA(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. PROJECT */}
          {activeType === 'project' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Task Distributed Engine"
                    value={projTitle}
                    onChange={e => setProjTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Tier</label>
                  <select
                    value={projTier}
                    onChange={e => setProjTier(e.target.value as ProjectTier)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6] min-h-[44px]"
                  >
                    <option value="tier1">Tier 1: Beginner</option>
                    <option value="tier2">Tier 2: REST API</option>
                    <option value="tier3">Tier 3: Resume Star (₹15L+)</option>
                    <option value="tier4">Tier 4: Production Engine (₹23.3L+)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-[#282830] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#282830] hover:bg-gray-100 dark:hover:bg-[#1D1D22] text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5856D6] hover:bg-[#4745B8] active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-sm min-h-[44px]"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
