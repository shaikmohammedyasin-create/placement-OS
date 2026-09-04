import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  MapPin,
  Calendar,
  Award,
  Users,
  Briefcase,
  Plus,
  ArrowRight,
  Bot,
  Sparkles
} from 'lucide-react';
import { MASTER_38_NODES, STRICT_51_LEARNING_ORDER } from '../../data/roadmapData';
import { usePlacement } from '../../context/PlacementContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extra?: any) => void;
  onOpenAddModal: (type?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAddModal
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { tests, interviews, exams, applications, projects } = usePlacement();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    // 1. Roadmap Nodes
    const matchedNodes = MASTER_38_NODES.filter(
      n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.keyTopics.some(t => t.toLowerCase().includes(q))
    ).map(n => ({
      type: 'roadmap' as const,
      id: n.id,
      title: `${n.id}. ${n.title}`,
      subtitle: `${n.category} • ${n.priority} Priority • ${n.estHours} hrs`,
      action: () => {
        onNavigate('roadmap', { selectedNodeId: n.id });
        onClose();
      }
    }));

    // 2. Tests
    const matchedTests = tests.filter(
      t => t.testName.toLowerCase().includes(q) || (t.company && t.company.toLowerCase().includes(q)) || t.topics.some(tp => tp.toLowerCase().includes(q))
    ).map(t => ({
      type: 'test' as const,
      id: t.id,
      title: `Test: ${t.testName}`,
      subtitle: `${t.testType} on ${t.date} • ${t.status}`,
      action: () => {
        onNavigate('tests');
        onClose();
      }
    }));

    // 3. Interviews
    const matchedInterviews = interviews.filter(
      i => i.company.toLowerCase().includes(q) || i.role.toLowerCase().includes(q) || i.round.toLowerCase().includes(q)
    ).map(i => ({
      type: 'interview' as const,
      id: i.id,
      title: `Interview: ${i.company} (${i.round})`,
      subtitle: `${i.role} on ${i.date} at ${i.time}`,
      action: () => {
        onNavigate('interviews');
        onClose();
      }
    }));

    // 4. Applications
    const matchedApps = applications.filter(
      a => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
    ).map(a => ({
      type: 'application' as const,
      id: a.id,
      title: `Job App: ${a.company}`,
      subtitle: `${a.role} • Status: ${a.status}`,
      action: () => {
        onNavigate('applications');
        onClose();
      }
    }));

    return [...matchedNodes, ...matchedTests, ...matchedInterviews, ...matchedApps].slice(0, 10);
  }, [query, tests, interviews, applications, onNavigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-[#151515] border border-[#222222] shadow-2xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-emerald-500/30 pointer-events-none"></div>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#222222] bg-[#0D0D0D]">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH ROADMAP NODES, TESTS, TOPICS..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs uppercase tracking-wider font-mono focus:outline-none placeholder:text-gray-600 text-[#F2F2F2]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-500 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#151515] text-emerald-400 border border-[#222222]">
            ESC
          </kbd>
        </div>

        {/* Quick Actions Shortcuts */}
        {!query && (
          <div className="p-4 bg-[#151515]">
            <div className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-500 mb-2.5">
              COMMAND SHORTCUTS
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  onClose();
                  onOpenAddModal('study');
                }}
                className="flex items-center gap-2 p-2.5 bg-[#0D0D0D] border border-[#222222] hover:border-emerald-500/50 text-gray-300 hover:text-emerald-400 text-left cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] uppercase tracking-wider">Log Study Drill</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddModal('test');
                }}
                className="flex items-center gap-2 p-2.5 bg-[#0D0D0D] border border-[#222222] hover:border-emerald-500/50 text-gray-300 hover:text-emerald-400 text-left cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] uppercase tracking-wider">Add Placement Test</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddModal('interview');
                }}
                className="flex items-center gap-2 p-2.5 bg-[#0D0D0D] border border-[#222222] hover:border-emerald-500/50 text-gray-300 hover:text-emerald-400 text-left cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] uppercase tracking-wider">Schedule Interview</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('ai');
                }}
                className="flex items-center gap-2 p-2.5 bg-[#0D0D0D] border border-[#222222] hover:border-emerald-500/50 text-gray-300 hover:text-emerald-400 text-left cursor-pointer transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] uppercase tracking-wider">Ask AI Mentor</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Results List */}
        {query && (
          <div className="max-h-80 overflow-y-auto p-3 bg-[#151515]">
            {results.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-gray-500 uppercase tracking-wider">
                NO MATCHES FOUND FOR &quot;{query}&quot;.
              </div>
            ) : (
              <div className="space-y-1.5">
                {results.map(res => (
                  <button
                    key={`${res.type}_${res.id}`}
                    onClick={res.action}
                    className="w-full flex items-center justify-between p-3 bg-[#0D0D0D] border border-[#222222] hover:border-emerald-500/50 text-left group transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 border border-[#222222] bg-[#151515] text-emerald-400">
                        {res.type === 'roadmap' && <MapPin className="w-3.5 h-3.5" />}
                        {res.type === 'test' && <Award className="w-3.5 h-3.5" />}
                        {res.type === 'interview' && <Users className="w-3.5 h-3.5" />}
                        {res.type === 'application' && <Briefcase className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-200 group-hover:text-emerald-400 transition-colors">
                          {res.title}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 mt-0.5">{res.subtitle}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
