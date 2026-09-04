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
import { MASTER_38_NODES } from '../../data/roadmapData';
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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Command Center Top Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5856D6] dark:text-[#7A79E0]">
            <Target className="w-3.5 h-3.5" />
            <span>Placement Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Good morning, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Your placement mission • <span className="text-gray-700 dark:text-gray-300 font-medium">{currentPhaseName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('planner')}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] hover:border-[#5856D6]/40 text-xs font-medium text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
          >
            Today's Schedule
          </button>
          <button
            onClick={() => onNavigate('ai', { initialQuery: "What is my highest-ROI placement drill for today?" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#AF52DE]/10 hover:bg-[#AF52DE]/20 text-[#AF52DE] border border-[#AF52DE]/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Mentor</span>
          </button>
        </div>
      </section>

      {/* 2. PRIMARY HERO AREA: TODAY'S MISSION (Dominates the screen) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-[#151519] dark:to-[#1D1D22] border-2 border-[#5856D6]/30 dark:border-[#5856D6]/40 p-6 sm:p-8 shadow-lg shadow-[#5856D6]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5856D6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#5856D6] text-white shadow-sm">
                TODAY'S MISSION
              </span>
              <PriorityBadge priority="CRITICAL" size="sm" />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 text-[#5856D6]" />
              <span>{dailyFocus.durationMinutes || 75} minutes allocated</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {dailyFocus.primaryFocus || 'DSA — Two Pointers & Binary Search In-Place'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                <strong className="text-gray-900 dark:text-white font-semibold">Why this matters: </strong>
                Direct prerequisite for clearing campus online assessments (OAs) and upcoming technical rounds.
                Matches active roadmap node: <span className="text-[#5856D6] dark:text-[#7A79E0] font-medium">{currentActiveNode.title}</span>.
              </p>

              {dailyFocus.supporting && dailyFocus.supporting.length > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-[11px] text-gray-500 font-medium">Parallel drills:</span>
                  {dailyFocus.supporting.map((drill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-[#25252D] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#282830]">
                      {drill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 shrink-0">
              <button
                onClick={() => updateDailyFocus({ completed: !dailyFocus.completed })}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                  dailyFocus.completed
                    ? 'bg-[#34C759] text-white hover:bg-[#2DB04D]'
                    : 'bg-[#5856D6] text-white hover:bg-[#4745B8] active:scale-95 shadow-[#5856D6]/30'
                }`}
              >
                {dailyFocus.completed ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Completed for Today</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Session Now</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('roadmap', { selectedNodeId: currentActiveNode.id })}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#25252D] transition-colors cursor-pointer"
              >
                <span>View Node in Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEXT UP TIMELINE SECTION */}
      <section className="rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#282830] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF9F0A]/15 text-[#FF9F0A] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Next Up • Upcoming Timeline
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Scheduled aptitude tests, coding OAs, interviews, and semester exams
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('planner')}
            className="flex items-center gap-1 text-xs font-semibold text-[#5856D6] hover:text-[#4745B8] dark:text-[#7A79E0] transition-colors cursor-pointer"
          >
            <span>Full Agenda</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <EventTimeline
          items={timelineItems}
          onToggleComplete={toggleEventCompleted}
          onItemClick={(item) => {
            if (item.type === 'interview') onNavigate('interviews');
            else if (item.type === 'test') onNavigate('tests');
            else onNavigate('planner');
          }}
          emptyMessage="No immediate assessments or study events. Use '+' to add an assessment or practice drill."
        />
      </section>

      {/* 4. PLACEMENT READINESS SCORECARD (Section 19: Clear 5 dimensions, no clutter) */}
      <section className="rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#282830] mb-5">
          <div>
            <span className="text-[10px] font-bold font-mono text-[#5856D6] uppercase tracking-wider">
              PLACEMENT READINESS METRICS
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {overallReadinessScore}%
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Overall Preparedness Score
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('progress')}
            className="flex items-center gap-1 text-xs font-semibold text-[#5856D6] hover:text-[#4745B8] dark:text-[#7A79E0] transition-colors cursor-pointer"
          >
            <span>View Full Scorecard & Proofs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Dimensional Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {readinessDimensions.map(dim => {
            const getDimColor = (title: string) => {
              const t = title.toLowerCase();
              if (t.includes('dsa')) return '#007AFF'; // Blue
              if (t.includes('aptitude')) return '#FF9F0A'; // Orange
              if (t.includes('core') || t.includes('cs')) return '#06B6D4'; // Cyan
              if (t.includes('project')) return '#14B8A6'; // Teal
              if (t.includes('interview')) return '#AF52DE'; // Purple
              return '#5856D6';
            };

            const color = getDimColor(dim.title);

            return (
              <div
                key={dim.title}
                className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {dim.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                    {dim.percentage}%
                  </span>
                </div>
                <ProgressBar progress={dim.percentage} color={color} height="h-1.5" />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 truncate">
                  {dim.nextMilestone || 'Target next milestone'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ROADMAP POSITION & PROGRESS */}
      <section className="rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#282830] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5856D6]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Current Roadmap Position
            </h2>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-semibold text-[#5856D6] hover:text-[#4745B8] dark:text-[#7A79E0] flex items-center gap-1 cursor-pointer"
          >
            <span>Explore 38 Nodes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5856D6]/15 text-[#5856D6] flex items-center justify-center font-mono font-bold text-sm shrink-0">
              {currentActiveNode.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {currentActiveNode.title}
                </span>
                <CategoryBadge category={currentActiveNode.category} size="sm" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {currentActiveNode.doneCriteria}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase font-mono">Progress</div>
              <div className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                {completedNodesCount} of 38 Done
              </div>
            </div>
            <ProgressRing
              progress={Math.round((completedNodesCount / 38) * 100)}
              size={36}
              color="#5856D6"
            />
          </div>
        </div>
      </section>

      {/* 6. AI MENTOR INTELLIGENCE SNIPPET */}
      <section className="rounded-2xl bg-gradient-to-r from-[#AF52DE]/10 to-[#5856D6]/10 border border-[#AF52DE]/20 p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#AF52DE] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#AF52DE]/30">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF52DE]">
                Placement Intelligence Mentor
              </span>
              <button
                onClick={() => onNavigate('ai')}
                className="text-xs font-semibold text-[#AF52DE] hover:underline cursor-pointer"
              >
                Open Mentor Chat →
              </button>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
              "Your Aptitude readiness is currently 78%, which is on track. Focus your next 3 days heavily on
              <strong> Graph Traversals (DFS/BFS)</strong> and <strong>SQL Joins</strong> to prepare for tier-1 company cutoffs."
            </p>
          </div>
        </div>
      </section>

      {/* 7. MANIFESTATION & NORTH STAR (Section 22: Calm, at bottom) */}
      <section className="rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] p-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
              NORTH STAR TARGET
            </span>
            <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {targetPackage} • {targetDream || 'Software Engineer at Google / Top Product Companies'}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Target Year: {targetYear} • Standard: Plain text coding, no autocomplete, zero excuses.
            </p>
          </div>
          <button
            onClick={() => onNavigate('manifestation')}
            className="self-center sm:self-auto px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#282830] hover:bg-gray-100 dark:hover:bg-[#1D1D22] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            Review Vision & Principles
          </button>
        </div>
      </section>
    </div>
  );
};
