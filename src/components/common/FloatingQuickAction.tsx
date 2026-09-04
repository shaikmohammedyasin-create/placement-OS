import React, { useState } from 'react';
import {
  Plus,
  X,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  FolderGit2
} from 'lucide-react';

interface FloatingQuickActionProps {
  onOpenAddModal: (type: string) => void;
}

export const FloatingQuickAction: React.FC<FloatingQuickActionProps> = ({ onOpenAddModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'study',
      label: 'Study Drill',
      desc: 'DSA / Java / CS Theory',
      icon: BookOpen,
      color: 'bg-[#5856D6] text-white',
      border: 'hover:border-[#5856D6]'
    },
    {
      id: 'test',
      label: 'Assessment / OA',
      desc: 'Aptitude / Coding Contest',
      icon: Award,
      color: 'bg-[#FF9F0A] text-white',
      border: 'hover:border-[#FF9F0A]'
    },
    {
      id: 'interview',
      label: 'Interview Round',
      desc: 'Technical / Mock / Debrief',
      icon: Users,
      color: 'bg-[#AF52DE] text-white',
      border: 'hover:border-[#AF52DE]'
    },
    {
      id: 'exam',
      label: 'College Exam',
      desc: 'Semester / Midterm',
      icon: GraduationCap,
      color: 'bg-[#FF3B30] text-white',
      border: 'hover:border-[#FF3B30]'
    },
    {
      id: 'application',
      label: 'Job Application',
      desc: 'Company Drive / Referral',
      icon: Briefcase,
      color: 'bg-[#007AFF] text-white',
      border: 'hover:border-[#007AFF]'
    },
    {
      id: 'project',
      label: 'Project Milestone',
      desc: 'System Architecture / Deploy',
      icon: FolderGit2,
      color: 'bg-[#14B8A6] text-white',
      border: 'hover:border-[#14B8A6]'
    }
  ];

  const handleSelect = (typeId: string) => {
    setIsOpen(false);
    onOpenAddModal(typeId);
  };

  return (
    <>
      {/* Backdrop overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Action Menu / Sheet */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-72 sm:w-80 bg-[#151519] dark:bg-[#151519] border border-[#282830] rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#282830] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Quick Log Action
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {actions.map(act => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => handleSelect(act.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#1D1D22] hover:bg-[#25252D] border border-transparent ${act.border} transition-all text-left cursor-pointer group`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color} shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">
                      {act.label}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {act.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-16 md:bottom-8 right-4 md:right-8 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#5856D6] hover:bg-[#4745B8] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all cursor-pointer border-2 border-white/20 hover:shadow-[#5856D6]/40 ${
          isOpen ? 'rotate-45 bg-gray-700 hover:bg-gray-600' : ''
        }`}
        title="Quick Add Action"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </>
  );
};
