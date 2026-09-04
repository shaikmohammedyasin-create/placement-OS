import React, { useState, useMemo } from 'react';
import {
  Award,
  Plus,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BarChart2,
  Target,
  Check
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { PlacementTest } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';
import { StatusPill } from '../common/StatusPill';
import { PriorityBadge } from '../common/PriorityBadge';
import { getCategoryTheme } from '../common/designTokens';

interface TestsViewProps {
  onOpenAddModal: (type?: string) => void;
}

export const TestsView: React.FC<TestsViewProps> = ({ onOpenAddModal }) => {
  const { tests, updateTest, deleteTest } = usePlacement();
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<PlacementTest | null>(null);

  const filteredTests = useMemo(() => {
    if (filterType === 'all') return tests;
    return tests.filter(t =>
      t.testType.toLowerCase().includes(filterType.toLowerCase()) ||
      t.status.toLowerCase() === filterType.toLowerCase()
    );
  }, [tests, filterType]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#282830]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF9F0A]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF9F0A]">
              Assessment & OA Tracker
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Assessments & Tests
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Log college placement aptitude rounds, company online assessments (OAs), and track mistake patterns.
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal('test')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF9F0A] hover:bg-[#E08A05] active:scale-95 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Assessment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'Scheduled', 'Completed', 'Aptitude', 'Coding', 'Company OA'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              filterType === tab
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-[#151519] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#282830] hover:border-gray-400'
            }`}
          >
            {tab === 'all' ? 'All Assessments' : tab}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
          <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            No assessments found
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Log your scheduled aptitude drills or coding tests to measure cutoff readiness.
          </p>
          <button
            onClick={() => onOpenAddModal('test')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FF9F0A] text-white text-xs font-semibold cursor-pointer"
          >
            Log New Assessment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map(test => {
            const theme = getCategoryTheme(test.testType);
            const isCompleted = test.status === 'Completed';

            return (
              <div
                key={test.id}
                className={`p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] hover:border-gray-400 dark:hover:border-gray-600 transition-all border-l-4 ${theme.borderLeft} shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={test.testType} size="sm" />
                      <StatusPill status={test.status} date={test.date} size="sm" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={test.difficulty} size="sm" />
                      <button
                        onClick={() => deleteTest(test.id)}
                        className="p-1 text-gray-400 hover:text-[#FF3B30] transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {test.company ? `${test.company}: ` : ''}{test.testName}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {test.date} {test.startTime ? `at ${test.startTime}` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {test.durationMinutes}m
                    </span>
                  </div>

                  {test.topics && test.topics.length > 0 && (
                    <div className="flex items-center gap-1 mt-2.5 flex-wrap">
                      {test.topics.map((top, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#25252D] text-gray-600 dark:text-gray-300">
                          {top}
                        </span>
                      ))}
                    </div>
                  )}

                  {test.score !== undefined && (
                    <div className="mt-3 p-2.5 rounded-lg bg-gray-50 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] flex items-center justify-between text-xs">
                      <span className="text-gray-500">Result Score:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {test.score} / {test.totalScore || 100} ({Math.round(((test.score || 0) / (test.totalScore || 100)) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#25252D] flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">
                    Cutoff: {test.cutoffRequirement || '70% to shortlist'}
                  </span>

                  {!isCompleted && (
                    <button
                      onClick={() => updateTest(test.id, { status: 'Completed', score: 85 })}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#25252D] dark:hover:bg-[#32323D] text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#34C759]" />
                      <span>Log Score</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
