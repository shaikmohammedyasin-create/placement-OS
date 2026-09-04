import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  MapPin,
  Tag
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { PlannerEvent } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { getCategoryTheme } from '../common/designTokens';

interface PlannerViewProps {
  onOpenAddModal: (type?: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ onOpenAddModal }) => {
  const { events, toggleEventCompleted, deleteEvent } = usePlacement();
  const [viewMode, setViewMode] = useState<'today' | 'agenda' | 'week'>('agenda');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const [currentDateStr, setCurrentDateStr] = useState<string>(todayStr);

  // Filter Categories matching our semantic color mapping
  const filterCategories = [
    { id: 'all', label: 'All Events', color: '#5856D6' },
    { id: 'aptitude', label: 'Aptitude', color: '#FF9F0A' },
    { id: 'dsa', label: 'DSA & Code', color: '#007AFF' },
    { id: 'interview', label: 'Interviews', color: '#AF52DE' },
    { id: 'exam', label: 'College Exams', color: '#FF3B30' },
    { id: 'backend', label: 'Projects & Backend', color: '#14B8A6' },
  ];

  // Derived filtered events
  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (selectedCategory !== 'all') {
      result = result.filter(e =>
        e.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        e.eventType.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    return result.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
    });
  }, [events, selectedCategory]);

  // Today specific events
  const todayEvents = useMemo(() => {
    return filteredEvents.filter(e => e.date === todayStr);
  }, [filteredEvents, todayStr]);

  // Agenda events grouped by date
  const groupedAgenda = useMemo(() => {
    const groups: { [date: string]: PlannerEvent[] } = {};
    filteredEvents.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEvents]);

  // Hourly slots for Day view (08:00 to 22:00)
  const hourlySlots = useMemo(() => {
    const hours: string[] = [];
    for (let h = 8; h <= 22; h++) {
      hours.push(h < 10 ? `0${h}:00` : `${h}:00`);
    }
    return hours;
  }, []);

  const formatDateHeading = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (dateStr === todayStr) return 'Today, ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#282830]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5856D6]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5856D6]">
              Daily Execution Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Execution Planner
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Coordinate study drills, campus tests, coding OAs, and mock interviews with zero friction.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
            {(['agenda', 'today', 'week'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-white dark:bg-[#25252D] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenAddModal('study')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5856D6] hover:bg-[#4745B8] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Semantic Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterCategories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-sm'
                  : 'bg-white dark:bg-[#151519] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#282830] hover:border-gray-400'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Agenda View (Notion / Things 3 style) */}
      {viewMode === 'agenda' && (
        <div className="space-y-6">
          {groupedAgenda.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
              <CalendarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                No events found for this filter
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Schedule study sessions, mock interviews, or tests to build momentum.
              </p>
              <button
                onClick={() => onOpenAddModal('study')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#5856D6] text-white text-xs font-semibold cursor-pointer"
              >
                Schedule Study Session
              </button>
            </div>
          ) : (
            groupedAgenda.map(([date, dateEvents]) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {formatDateHeading(date)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {dateEvents.length} {dateEvents.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="space-y-2">
                  {dateEvents.map(event => {
                    const theme = getCategoryTheme(event.category);
                    const isDone = event.status === 'completed';

                    return (
                      <div
                        key={event.id}
                        className={`p-3.5 rounded-xl bg-white dark:bg-[#151519] hover:bg-gray-50 dark:hover:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] transition-all flex items-center justify-between gap-4 border-l-4 ${theme.borderLeft} shadow-sm`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleEventCompleted(event.id)}
                            className="text-gray-400 hover:text-[#34C759] transition-colors shrink-0 cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CategoryBadge category={event.category} size="sm" />
                              <span className="text-[10px] font-mono text-gray-400">
                                {event.startTime || 'Flexible Time'}
                              </span>
                              {event.durationMinutes && (
                                <span className="text-[10px] text-gray-400">
                                  ({event.durationMinutes}m)
                                </span>
                              )}
                            </div>
                            <div className={`text-xs font-semibold text-gray-900 dark:text-white mt-1 truncate ${isDone ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                              {event.title}
                            </div>
                            {event.notes && (
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                {event.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          className="text-gray-400 hover:text-[#FF3B30] p-1 transition-colors shrink-0 cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Today Hour-by-Hour Timeline (Apple Calendar Day View) */}
      {viewMode === 'today' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 mb-6">
            Today's Hourly Schedule • {formatDateHeading(todayStr)}
          </div>

          <div className="space-y-4">
            {hourlySlots.map(hour => {
              const hourNum = parseInt(hour.split(':')[0], 10);
              const eventsInHour = todayEvents.filter(e => {
                if (!e.startTime) return false;
                const eHour = parseInt(e.startTime.split(':')[0], 10);
                return eHour === hourNum;
              });

              return (
                <div key={hour} className="flex items-start gap-4 min-h-[44px]">
                  <div className="w-14 text-right text-xs font-mono text-gray-400 shrink-0 pt-0.5">
                    {hour}
                  </div>

                  <div className="flex-1 min-w-0 border-t border-gray-100 dark:border-[#25252D] pt-1">
                    {eventsInHour.length === 0 ? (
                      <div className="h-4" />
                    ) : (
                      eventsInHour.map(e => {
                        const theme = getCategoryTheme(e.category);
                        return (
                          <div
                            key={e.id}
                            className={`p-2.5 rounded-lg bg-gray-50 dark:bg-[#1D1D22] border-l-4 ${theme.borderLeft} mb-2 flex items-center justify-between`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <CategoryBadge category={e.category} size="sm" />
                                <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                  {e.title}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">
                              {e.startTime} ({e.durationMinutes}m)
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Week Summary View */}
      {viewMode === 'week' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 mb-4">
            Next 7 Days at a Glance
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map(offset => {
              const d = new Date();
              d.setDate(d.getDate() + offset);
              const dateStr = d.toISOString().split('T')[0];
              const dayEvents = filteredEvents.filter(e => e.date === dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={offset}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isToday
                      ? 'bg-[#5856D6]/10 border-[#5856D6]/40 text-[#5856D6]'
                      : 'bg-gray-50 dark:bg-[#1D1D22] border-gray-200 dark:border-[#282830]'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-gray-400">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                    {d.getDate()}
                  </div>
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map(e => (
                      <div
                        key={e.id}
                        className="text-[9px] truncate px-1.5 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: `${getCategoryTheme(e.category).color}20`,
                          color: getCategoryTheme(e.category).color
                        }}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[9px] text-gray-400">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
