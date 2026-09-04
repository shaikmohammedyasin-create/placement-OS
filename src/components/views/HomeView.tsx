import React, { useMemo } from 'react';
import {
  Target,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Plus,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Flame,
  ChevronRight,
  Bot,
  Play,
  Check
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { MASTER_38_NODES, CAREER_TARGET_PATHS, READINESS_GATES, CAREER_BINGO_ITEMS } from '../../data/roadmapData';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusPill } from '../common/StatusPill';
import { ProgressBar } from '../common/ProgressBar';
import { ProgressRing } from '../common/ProgressRing';
import { EventTimeline, TimelineItem } from '../common/EventTimeline';

interface HomeViewProps {
  onNavigate: (tab: string, extra?: any) => void;
  onOpenAddModal: (type?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAddModal }) => {
  const {
    userName,
    targetPackage,
    targetDream,
    targetYear,
    currentPhaseName,
    dailyFocus,
    updateDailyFocus,
    events,
    toggleEventCompleted,
    tests,
    interviews,
    exams,
    applications,
    nodeProgress,
    completedNodesCount,
    overallReadinessScore,
    readinessDimensions,
    manifestation
  } = usePlacement();

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper date calculations
  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRelativeLabel = (days: number, dateStr: string) => {
    if (days < 0) return `${Math.abs(days)}d ago`;
    if (days === 0) return 'TODAY';
    if (days === 1) return 'TOMORROW';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  // Structured Next Up Timeline Items
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // 1. Planner events for today and future
    events
      .filter(e => e.date >= todayStr)
      .forEach(e => {
        const days = calculateDaysLeft(e.date);
        items.push({
          id: e.id,
          title: e.title,
          category: e.category,
          time: e.startTime,
          duration: e.durationMinutes,
          dateStr: e.date,
          relativeHeading: getRelativeLabel(days, e.date),
          isCompleted: e.status === 'completed',
          priority: e.eventType.includes('exam') ? 'CRITICAL' : 'HIGH',
          notes: e.notes,
          type: 'event'
        });
      });

    // 2. Upcoming Tests
    tests
      .filter(t => t.status === 'Scheduled' && t.date >= todayStr)
      .forEach(t => {
        const days = calculateDaysLeft(t.date);
        items.push({
          id: t.id,
          title: `${t.company ? t.company + ' — ' : ''}${t.testName}`,
          category: t.testType === 'Aptitude' ? 'Aptitude' : 'DSA',
          time: t.startTime,
          duration: t.durationMinutes,
          dateStr: t.date,
          relativeHeading: getRelativeLabel(days, t.date),
          isCompleted: false,
          priority: 'CRITICAL',
          notes: t.topics.join(', '),
          type: 'test'
        });
      });

    // 3. Upcoming Interviews
    interviews
      .filter(i => i.status === 'Scheduled' && i.date >= todayStr)
      .forEach(i => {
        const days = calculateDaysLeft(i.date);
        items.push({
          id: i.id,
          title: `${i.company} (${i.role}) — ${i.round} Round`,
          category: 'Interview',
          time: i.time,
          duration: i.durationMinutes,
          dateStr: i.date,
          relativeHeading: getRelativeLabel(days, i.date),
          isCompleted: false,
          priority: 'CRITICAL',
          notes: i.topics.join(' • '),
          type: 'interview'
        });
      });

    // 4. Upcoming College Exams
    exams
      .filter(e => e.date >= todayStr)
      .forEach(e => {
        const days = calculateDaysLeft(e.date);
        items.push({
          id: e.id,
          title: `${e.examName} (${e.subject})`,
          category: 'Exam',
          time: e.time,
          duration: e.durationMinutes,
          dateStr: e.date,
          relativeHeading: getRelativeLabel(days, e.date),
          isCompleted: false,
          priority: 'CRITICAL',
          notes: e.syllabus,
          type: 'exam'
        });
      });

    // Sort chronologically
    return items
      .sort((a, b) => {
        const dateDiff = (a.dateStr || '').localeCompare(b.dateStr || '');
        if (dateDiff !== 0) return dateDiff;
        return (a.time || '00:00').localeCompare(b.time || '00:00');
      })
      .slice(0, 6);
  }, [events, tests, interviews, exams, todayStr]);

  // Current Active Roadmap Node
  const currentActiveNode = useMemo(() => {
    // First incomplete node in master list
    return MASTER_38_NODES.find(n => !nodeProgress[n.id]?.completed) || MASTER_38_NODES[0];
  }, [nodeProgress]);

  // Upcoming high-importance interview
  const nextInterview = useMemo(() => {
    return interviews.find(i => i.status === 'Scheduled' && i.date >= todayStr);
  }, [interviews, todayStr]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header with Target Path Selector & Mode */}
      <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Placement Command Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {currentPhaseName}
          </p>
        </div>
        <div className="flex items-center gap-2">
            {/* Target Path Selector */}
            <select className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] text-xs font-semibold cursor-pointer">
              {CAREER_TARGET_PATHS.map(path => (
                <option key={path.id} value={path.id}>{path.name}</option>
              ))}
            </select>
            {/* Mode Selector */}
            <select className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] text-xs font-semibold cursor-pointer">
              <option>Standard (4h)</option>
              <option>Sprint (2h)</option>
              <option>Full-Time (8h)</option>
              <option>Exam Mode</option>
            </select>
        </div>
      </section>

      {/* 2. Readiness Gates Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {READINESS_GATES.map(gate => (
          <div key={gate.id} className={`p-3 rounded-xl border ${gate.status === 'UNLOCKED' ? 'bg-green-50 dark:bg-green-950/20 border-green-500' : 'bg-gray-50 dark:bg-[#151519] border-gray-200 dark:border-[#282830]'}`}>
            <div className="text-[9px] font-bold uppercase text-gray-400">Gate {gate.gateNumber}</div>
            <div className="text-xs font-bold mt-1 text-gray-900 dark:text-white truncate">{gate.name}</div>
          </div>
        ))}
      </section>

      {/* 3. Bingo Progress & Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
          <h3 className="text-xs font-bold uppercase mb-3">Career Bingo (P0-P5)</h3>
          <ProgressBar progress={Math.round((CAREER_BINGO_ITEMS.filter(i => i.status === 'completed').length / CAREER_BINGO_ITEMS.length) * 100)} color="#AF52DE" />
        </div>
        <div className="flex gap-2">
           <button onClick={() => onOpenAddModal('study')} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-[#5856D6] text-white font-bold text-xs">
              <Plus className="w-4 h-4" /> Log Drill
           </button>
           <button onClick={() => onNavigate('ai')} className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-100 dark:bg-[#151519] text-gray-900 dark:text-white font-bold text-xs border border-gray-200 dark:border-[#282830]">
              <Bot className="w-4 h-4" /> Launch Mock
           </button>
        </div>
      </section>

      {/* 4. Timeline & Readiness (Keep existing) */}
      <section className="rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] p-6 shadow-sm">
        <EventTimeline
          items={timelineItems}
          onToggleComplete={toggleEventCompleted}
          onItemClick={(item) => onNavigate('planner')}
        />
      </section>
    </div>
  );
};
