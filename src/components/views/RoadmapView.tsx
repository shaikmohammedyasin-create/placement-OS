import React, { useState, useMemo } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Flame,
  ShieldCheck,
  BookOpen,
  Plus,
  X,
  Layers,
  ListOrdered,
  EyeOff,
  Table,
  Zap,
  HelpCircle,
  Compass,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  MASTER_38_NODES,
  SKILL_DEPENDENCY_TABLE,
  STRICT_51_LEARNING_ORDER,
  WHAT_NOT_TO_LEARN_YET,
  SALARY_SKILL_MATRIX,
  GENESIS_7_DAYS,
  RISK_MANAGEMENT_DATA,
  CHALLENGE_ASSUMPTIONS_DATA
} from '../../data/roadmapData';
import { usePlacement } from '../../context/PlacementContext';
import { RoadmapNode } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ProgressRing } from '../common/ProgressRing';
import { getCategoryTheme } from '../common/designTokens';

interface RoadmapViewProps {
  initialSelectedNodeId?: string;
  onOpenAddModal: (type?: string) => void;
}

interface StrategicSection {
  id: string;
  name: string;
  desc: string;
  nodeIds: string[];
  color: string;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  initialSelectedNodeId,
  onOpenAddModal
}) => {
  const { nodeProgress, toggleNodeCompletion, events, completedNodesCount } = usePlacement();
  const [activeTab, setActiveTab] = useState<'38nodes' | '51steps' | 'defer' | 'matrix' | 'genesis' | 'risks'>('38nodes');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(() => {
    if (initialSelectedNodeId) {
      return MASTER_38_NODES.find(n => n.id === initialSelectedNodeId) || MASTER_38_NODES[0];
    }
    return null;
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // 5 Strategic Sections mandated by Section 13 of UI prompt
  const strategicSections: StrategicSection[] = [
    {
      id: 'foundation',
      name: 'FOUNDATION',
      desc: 'Coding basics, Aptitude core, and Java syntax proficiency',
      nodeIds: ['01', '02', '03', '04'],
      color: '#FF9F0A'
    },
    {
      id: 'core',
      name: 'CORE ENGINEERING',
      desc: 'Data Structures, OOP, SQL, DBMS, Operating Systems, Networks, Git & Linux',
      nodeIds: ['05', '06', '07', '08', '09', '10', '11', '12', '13', '14'],
      color: '#007AFF'
    },
    {
      id: 'dev',
      name: 'DEVELOPMENT',
      desc: 'Production Backend, Spring Boot, REST APIs, Database architecture, and Cloud',
      nodeIds: ['15', '16', '17', '18', '19', '20', '21', '22', '23'],
      color: '#14B8A6'
    },
    {
      id: 'career',
      name: 'CAREER & PLACEMENT',
      desc: 'Resume engineering, GitHub proof, Mock interviews, and Campus OA tracking',
      nodeIds: ['24', '25', '26', '27', '28', '29', '30', '31', '32'],
      color: '#AF52DE'
    },
    {
      id: 'advanced',
      name: 'ADVANCED & GOOGLE TIER',
      desc: 'Graphs, Dynamic Programming, LLD, HLD, and ₹23.3 LPA+ bar clearance',
      nodeIds: ['33', '34', '35', '36', '37', '38'],
      color: '#5856D6'
    }
  ];

  // Helper to check if node prerequisites are satisfied
  const isNodeUnlocked = (node: RoadmapNode) => {
    if (!node.prerequisites || node.prerequisites.length === 0 || node.prerequisites[0] === 'None') {
      return true;
    }
    // Check if any prerequisite title matches a completed node
    for (const prereq of node.prerequisites) {
      const match = MASTER_38_NODES.find(n => n.title.toLowerCase() === prereq.toLowerCase());
      if (match && !nodeProgress[match.id]?.completed) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#282830]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5856D6]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5856D6]">
              Strategic Skill Dependency Graph
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Placement Roadmap (38 Master Nodes)
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Strict prerequisite-directed graph designed to clear ₹23.3 LPA+ product and campus interviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-gray-500">Completed</div>
            <div className="text-sm font-mono font-bold text-gray-900 dark:text-white">
              {completedNodesCount} / 38 Nodes
            </div>
          </div>
          <ProgressRing
            progress={Math.round((completedNodesCount / 38) * 100)}
            size={42}
            color="#5856D6"
          />
        </div>
      </div>

      {/* Navigation Sub-Tabs for Strategic Reference */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-[#282830] no-scrollbar">
        {[
          { id: '38nodes', label: '38 Strategic Nodes' },
          { id: '51steps', label: '51 Strict Steps' },
          { id: 'defer', label: 'What NOT to Learn Yet' },
          { id: 'matrix', label: 'Salary vs Skill Matrix' },
          { id: 'genesis', label: 'Day 1-7 Genesis Plan' },
          { id: 'risks', label: 'Anti-Failure Playbook' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#5856D6] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#151519]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      {activeTab === '38nodes' && (
        <div className="space-y-8">
          {/* Mobile-First Current Position & Next Unlocks Card (<1024px) */}
          <div className="lg:hidden p-4 rounded-2xl bg-gradient-to-br from-[#5856D6]/10 via-white to-gray-50 dark:from-[#5856D6]/15 dark:via-[#151519] dark:to-[#1D1D22] border border-[#5856D6]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5856D6]">
                CURRENT ROADMAP POSITION
              </span>
              <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                {completedNodesCount} / 38 Done
              </span>
            </div>

            {(() => {
              const current = MASTER_38_NODES.find(n => !nodeProgress[n.id]?.completed) || MASTER_38_NODES[0];
              return (
                <div className="p-3 rounded-xl bg-white dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#5856D6]/10 text-[#5856D6]">
                      NODE #{current.id}
                    </span>
                    <CategoryBadge category={current.category} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1.5">
                    {current.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {current.doneCriteria}
                  </p>
                  <button
                    onClick={() => setSelectedNode(current)}
                    className="mt-2.5 text-xs font-semibold text-[#5856D6] dark:text-[#7A79E0] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Node Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()}
          </div>

          {strategicSections.map(section => {
            const sectionNodes = MASTER_38_NODES.filter(n => section.nodeIds.includes(n.id));
            const completedInSection = sectionNodes.filter(n => nodeProgress[n.id]?.completed).length;

            return (
              <div key={section.id} className="space-y-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-[#282830]">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                      {section.name}
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">
                      ({completedInSection}/{sectionNodes.length} Done)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {section.desc}
                  </p>
                </div>

                {/* Section Node Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionNodes.map(node => {
                    const isDone = !!nodeProgress[node.id]?.completed;
                    const unlocked = isNodeUnlocked(node);
                    const theme = getCategoryTheme(node.category);

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer shadow-sm bg-white dark:bg-[#151519] border-l-4 ${theme.borderLeft} ${
                          isDone
                            ? 'border-gray-200 dark:border-[#282830] opacity-80 hover:opacity-100'
                            : unlocked
                            ? 'border-gray-200 dark:border-[#282830] hover:border-[#5856D6]/50 hover:shadow-md'
                            : 'border-gray-200/50 dark:border-[#282830]/50 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-[#25252D] text-gray-700 dark:text-gray-300">
                              {node.id}
                            </span>
                            <CategoryBadge category={node.category} size="sm" />
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                            ) : !unlocked ? (
                              <Lock className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#5856D6]" />
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#5856D6] dark:group-hover:text-[#7A79E0] transition-colors">
                          {node.title}
                        </h3>

                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {node.doneCriteria}
                        </p>

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 dark:border-[#25252D] text-[10px] text-gray-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {node.estHours}h est.
                          </span>
                          <PriorityBadge priority={node.priority} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 51 Strict Steps Tab */}
      {activeTab === '51steps' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300">
            <strong>Strict 51-Step Placement Sequence:</strong> Follow in exact chronological order. Do not jump ahead until previous step milestones are mastered.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STRICT_51_LEARNING_ORDER.map(step => (
              <div
                key={step.step}
                className="p-3.5 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-lg bg-[#5856D6]/10 text-[#5856D6] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {step.step}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {step.title}
                    </h4>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#25252D] text-gray-600 dark:text-gray-400">
                      {step.domain}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                    {step.focusNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Defer Tab (What NOT to learn) */}
      {activeTab === 'defer' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
            <strong>Time-Waster Elimination Guardrails:</strong> The most common failure mode is jumping into trendy tech stacks before mastering DSA and Core CS.
          </div>
          <div className="space-y-3">
            {WHAT_NOT_TO_LEARN_YET.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FF3B30] uppercase tracking-wider">
                    ⛔ Defer: {item.topic}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  {item.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary vs Skill Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SALARY_SKILL_MATRIX.map((tier, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-white dark:bg-[#151519] border ${
                  tier.tier.includes('Google') || tier.band.includes('23') || tier.band.includes('Google')
                    ? 'border-[#5856D6] shadow-md shadow-[#5856D6]/10'
                    : 'border-gray-200 dark:border-[#282830]'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5856D6]">
                  {tier.band}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {tier.tier}
                </h3>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  Standard: {tier.skillLevel}
                </div>

                <div className="mt-3.5 space-y-2 text-xs border-t border-gray-100 dark:border-[#25252D] pt-3">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-mono">DSA Requirement:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{tier.dsa}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-mono">CS Fundamentals:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{tier.csFundamentals}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-mono">Projects:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{tier.projects}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-mono">Aptitude Filter:</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">{tier.aptitude}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genesis Tab */}
      {activeTab === 'genesis' && (
        <div className="space-y-3">
          {GENESIS_7_DAYS.map(day => (
            <div
              key={day.day}
              className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#5856D6]/10 text-[#5856D6] font-mono font-bold text-sm flex items-center justify-center shrink-0">
                D{day.day}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  {day.title}
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                  {day.tasks.map((t, tidx) => (
                    <li key={tidx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Anti-Failure Risks Tab */}
      {activeTab === 'risks' && (
        <div className="space-y-3">
          {RISK_MANAGEMENT_DATA.map((risk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF3B30]">
                <AlertTriangle className="w-4 h-4" />
                <span>Risk: {risk.risk}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                <strong className="text-gray-900 dark:text-white">Consequence: </strong>
                {risk.consequence}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                <strong>Prevention: </strong>
                {risk.prevention}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                <strong>Recovery Protocol: </strong>
                {risk.recovery}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Node Detail Sheet Modal (Section 15: Tapping opens detail sheet) */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-200 dark:border-[#282830]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5856D6]/10 text-[#5856D6]">
                    NODE #{selectedNode.id}
                  </span>
                  <CategoryBadge category={selectedNode.category} size="sm" />
                  <PriorityBadge priority={selectedNode.priority} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">
                  Description & Context
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">
                  Exit / Done Criteria
                </span>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                  {selectedNode.doneCriteria}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Prerequisites</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                    {selectedNode.prerequisites.join(', ')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1D1D22] border border-gray-200 dark:border-[#282830]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Unlocks Next</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                    {selectedNode.unlocks.join(', ')}
                  </p>
                </div>
              </div>

              {selectedNode.keyTopics && selectedNode.keyTopics.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">
                    Key Topics to Master
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedNode.keyTopics.map((top, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-[#25252D] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#282830]"
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-[#282830]">
                <button
                  onClick={() => toggleNodeCompletion(selectedNode.id)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    nodeProgress[selectedNode.id]?.completed
                      ? 'bg-[#34C759] text-white hover:bg-[#2DB04D]'
                      : 'bg-white dark:bg-[#1D1D22] text-gray-800 dark:text-white border border-gray-300 dark:border-[#282830] hover:border-[#5856D6]'
                  }`}
                >
                  {nodeProgress[selectedNode.id]?.completed ? 'Completed ✓' : 'Mark as Mastered'}
                </button>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    onOpenAddModal('study');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#5856D6] hover:bg-[#4745B8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Log Study Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
