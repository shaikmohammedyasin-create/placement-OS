import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Video,
  Bot,
  MessageSquare,
  FileText,
  AlertCircle,
  Play,
  Check
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { PlacementInterview } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';
import { StatusPill } from '../common/StatusPill';
import { ProgressBar } from '../common/ProgressBar';

interface InterviewsViewProps {
  onOpenAddModal: (type?: string) => void;
  onNavigate: (tab: string, extra?: any) => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  onOpenAddModal,
  onNavigate
}) => {
  const { interviews, updateInterview, deleteInterview } = usePlacement();
  const [filterRound, setFilterRound] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Scheduled upcoming interviews
  const upcomingInterviews = useMemo(() => {
    return interviews
      .filter(i => i.status === 'Scheduled' && i.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [interviews, todayStr]);

  const nextInterview = upcomingInterviews[0] || null;

  // Filtered list
  const filteredInterviews = useMemo(() => {
    if (filterRound === 'all') return interviews;
    return interviews.filter(i =>
      i.round.toLowerCase().includes(filterRound.toLowerCase()) ||
      i.status.toLowerCase() === filterRound.toLowerCase()
    );
  }, [interviews, filterRound]);

  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#282830]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#AF52DE]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#AF52DE]">
              Interview Command Center
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Interviews & Debriefs
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Track technical coding rounds, manager rounds, and post-round mistake debriefs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('ai', { initialQuery: "Start a 45-minute technical mock interview for Google L3 (Java, DSA, Complexity Analysis)." })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#AF52DE]/10 hover:bg-[#AF52DE]/20 text-[#AF52DE] border border-[#AF52DE]/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Launch AI Mock</span>
          </button>

          <button
            onClick={() => onOpenAddModal('interview')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#AF52DE] hover:bg-[#9B3ECD] active:scale-95 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Schedule Round</span>
          </button>
        </div>
      </div>

      {/* TOP HERO: NEXT UPCOMING INTERVIEW (Section 20) */}
      {nextInterview && (
        <div className="rounded-2xl bg-gradient-to-br from-white to-purple-50/20 dark:from-[#151519] dark:to-[#1D1D22] border-2 border-[#AF52DE]/30 dark:border-[#AF52DE]/40 p-6 shadow-md shadow-[#AF52DE]/5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#AF52DE] text-white">
                NEXT INTERVIEW
              </span>
              <span className="text-xs font-mono font-bold text-[#AF52DE]">
                {calculateDaysLeft(nextInterview.date) === 0 ? 'TODAY' : `In ${calculateDaysLeft(nextInterview.date)} days`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{nextInterview.date} at {nextInterview.time}</span>
              <span>({nextInterview.durationMinutes} min)</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {nextInterview.company} — {nextInterview.role}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#AF52DE]/15 text-[#AF52DE]">
                  {nextInterview.round} Round
                </span>
                <span className="text-xs text-gray-500">
                  Mode: {nextInterview.mode} {nextInterview.interviewer ? `• Interviewer: ${nextInterview.interviewer}` : ''}
                </span>
              </div>

              {/* Topic Preparation Bars */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { topic: 'Java OOP', pct: 80, color: '#5856D6' },
                  { topic: 'DSA Core', pct: 62, color: '#007AFF' },
                  { topic: 'SQL & DBMS', pct: 54, color: '#06B6D4' },
                  { topic: 'OS & Concurrency', pct: 41, color: '#FF9F0A' }
                ].map(bar => (
                  <div key={bar.topic} className="p-2.5 rounded-lg bg-white/70 dark:bg-[#25252D] border border-gray-200 dark:border-[#282830]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{bar.topic}</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{bar.pct}%</span>
                    </div>
                    <ProgressBar progress={bar.pct} color={bar.color} height="h-1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => onNavigate('ai', { initialQuery: `Run a high-intensity mock interview for ${nextInterview.company} ${nextInterview.round} round covering ${nextInterview.topics.join(', ')}.` })}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#AF52DE] hover:bg-[#9B3ECD] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm shadow-[#AF52DE]/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Practice Mock Now</span>
              </button>

              <button
                onClick={() => updateInterview(nextInterview.id, { status: 'Completed' })}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#25252D] border border-gray-200 dark:border-[#282830] hover:border-[#34C759] text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Mark Round Completed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'Scheduled', 'Completed', 'Technical', 'HR', 'Behavioral', 'Mock Interview'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterRound(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              filterRound === tab
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-[#151519] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#282830] hover:border-gray-400'
            }`}
          >
            {tab === 'all' ? 'All Interviews' : tab}
          </button>
        ))}
      </div>

      {/* Interviews List */}
      <div className="space-y-3">
        {filteredInterviews.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              No interviews found
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Schedule your upcoming company round or run an AI mock simulation.
            </p>
            <button
              onClick={() => onOpenAddModal('interview')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#AF52DE] text-white text-xs font-semibold cursor-pointer"
            >
              Schedule Interview Round
            </button>
          </div>
        ) : (
          filteredInterviews.map(interview => {
            const isCompleted = interview.status === 'Completed';

            return (
              <div
                key={interview.id}
                className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] hover:border-[#AF52DE]/40 transition-all border-l-4 border-l-[#AF52DE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#AF52DE]/15 text-[#AF52DE]">
                      {interview.round}
                    </span>
                    <StatusPill status={interview.status} date={interview.date} size="sm" />
                    <span className="text-[11px] font-mono text-gray-400">
                      {interview.date} at {interview.time}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {interview.company} • {interview.role}
                  </h3>

                  {interview.topics && interview.topics.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-400">Tested topics:</span>
                      {interview.topics.map((top, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#25252D] text-gray-600 dark:text-gray-400">
                          {top}
                        </span>
                      ))}
                    </div>
                  )}

                  {interview.feedback?.whatWentBadly && (
                    <p className="text-[11px] text-[#FF3B30] mt-2 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900/30">
                      <strong>Debrief Lesson: </strong> {interview.feedback.whatWentBadly}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!isCompleted && (
                    <button
                      onClick={() => updateInterview(interview.id, { status: 'Completed' })}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#282830] hover:border-[#34C759] text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteInterview(interview.id)}
                    className="p-1.5 text-gray-400 hover:text-[#FF3B30] rounded-lg transition-colors cursor-pointer"
                    title="Delete Interview"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
