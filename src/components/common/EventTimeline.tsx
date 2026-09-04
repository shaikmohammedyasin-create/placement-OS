import React from 'react';
import { getCategoryTheme, getPriorityTheme } from './designTokens';
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';

export interface TimelineItem {
  id: string;
  title: string;
  category: string;
  time?: string;
  duration?: number;
  dateStr?: string;
  relativeHeading?: string; // 'TODAY', 'TOMORROW', 'SEP 18'
  isCompleted?: boolean;
  priority?: string;
  notes?: string;
  type?: string;
}

interface EventTimelineProps {
  items: TimelineItem[];
  onToggleComplete?: (id: string) => void;
  onItemClick?: (item: TimelineItem) => void;
  emptyMessage?: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  items,
  onToggleComplete,
  onItemClick,
  emptyMessage = "No upcoming events scheduled."
}) => {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  // Group by relativeHeading or dateStr
  const groups: { [heading: string]: TimelineItem[] } = {};
  items.forEach(item => {
    const heading = item.relativeHeading || item.dateStr || 'UPCOMING';
    if (!groups[heading]) groups[heading] = [];
    groups[heading].push(item);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([heading, groupItems]) => (
        <div key={heading} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {heading}
            </span>
            <div className="h-[1px] flex-1 bg-gray-200 dark:bg-[#25252D]" />
          </div>

          <div className="relative pl-4 space-y-3 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-[#25252D]">
            {groupItems.map(item => {
              const theme = getCategoryTheme(item.category);
              const priorityTheme = getPriorityTheme(item.priority);

              return (
                <div
                  key={item.id}
                  className="relative flex items-start gap-3 group cursor-pointer"
                  onClick={() => onItemClick && onItemClick(item)}
                >
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[21px] top-1.5 flex items-center justify-center">
                    <span
                      className={`w-3 h-3 rounded-full border-2 border-[#151519] dark:border-[#0B0B0F] ${theme.dotBg} shadow-sm group-hover:scale-125 transition-transform`}
                    />
                  </div>

                  {/* Card Container */}
                  <div className={`flex-1 p-3 rounded-xl bg-white dark:bg-[#151519] hover:bg-gray-50 dark:hover:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] transition-all shadow-sm flex items-center justify-between gap-3 border-l-3 ${theme.borderLeft}`}>
                    <div className="flex items-start gap-2.5 min-w-0">
                      {onToggleComplete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(item.id);
                          }}
                          className="mt-0.5 text-gray-400 hover:text-[#34C759] transition-colors shrink-0 cursor-pointer"
                        >
                          {item.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CategoryBadge category={item.category} size="sm" />
                          {item.priority === 'CRITICAL' && (
                            <span className="text-[9px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-1.5 py-0.5 rounded">
                              CRITICAL
                            </span>
                          )}
                        </div>

                        <div className={`text-xs font-semibold text-gray-900 dark:text-gray-100 mt-1 truncate ${item.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                          {item.title}
                        </div>

                        {item.notes && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Time & Duration */}
                    <div className="text-right shrink-0">
                      {item.time && (
                        <div className="text-[11px] font-mono font-semibold text-gray-800 dark:text-gray-200">
                          {item.time}
                        </div>
                      )}
                      {item.duration && (
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{item.duration}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
