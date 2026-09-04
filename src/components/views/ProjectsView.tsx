import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Check,
  Server,
  Star
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { ProjectTier, PlacementProject, DefensibilityChecklist } from '../../types';
import { StatusPill } from '../common/StatusPill';

interface ProjectsViewProps {
  onOpenAddModal: (type?: string) => void;
}

const DEFICIENCY_ITEMS: { key: keyof DefensibilityChecklist; label: string; desc: string }[] = [
  { key: 'canExplainIn5Min', label: '5-Minute Deep Walkthrough', desc: 'Can deliver a punchy 5-minute problem-to-solution overview without rambling' },
  { key: 'canExplainEveryTechChoice', label: 'Tech Choice Justifications', desc: 'Can defend why you chose Java/Spring/Postgres over Python/Node/MongoDB' },
  { key: 'canExplainArchitecture', label: 'Architecture & Data Flow', desc: 'Can draw the request lifecycle, controller-service-repo layers, and DB schema' },
  { key: 'canExplainTradeoffs', label: 'Trade-offs & Constraints', desc: 'Can explain why you picked relational over NoSQL, latency vs throughput tradeoffs' },
  { key: 'canExplainFailureHandling', label: 'Failure Handling & Retries', desc: 'Can explain circuit breakers, retry policies, transactions, rollback handling' },
  { key: 'canExplainDeployment', label: 'CI/CD & Deployment Strategy', desc: 'Can explain Docker containerization, cloud hosting, env variables, secrets' },
  { key: 'canExplainScaling', label: 'Horizontal Scaling & Caching', desc: 'Can explain Redis cache eviction, DB connection pooling, load balancing' }
];

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenAddModal }) => {
  const { projects, updateProject, deleteProject } = usePlacement();
  const [filterTier, setFilterTier] = useState<string>('all');
  const [expandedDefensibility, setExpandedDefensibility] = useState<Record<string, boolean>>({});

  const filteredProjects = filterTier === 'all'
    ? projects
    : projects.filter(p => p.tier === filterTier);

  const toggleDefensibilityExpand = (id: string) => {
    setExpandedDefensibility(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDefensibilityCheck = (proj: PlacementProject, key: keyof DefensibilityChecklist) => {
    const current = proj.defensibility || {
      canExplainIn5Min: false,
      canExplainEveryTechChoice: false,
      canExplainArchitecture: false,
      canExplainTradeoffs: false,
      canExplainFailureHandling: false,
      canExplainDeployment: false,
      canExplainScaling: false
    };
    const updatedDefensibility = { ...current, [key]: !current[key] };
    updateProject(proj.id, { defensibility: updatedDefensibility });
  };

  const getDefensibilityScore = (defensibility?: DefensibilityChecklist) => {
    if (!defensibility) return 0;
    return Object.values(defensibility).filter(Boolean).length;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#282830]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#14B8A6]">
              Project Proof & Architecture Audit
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Engineering Projects & Portfolio
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            4-Tier Placement Project Framework with 7-point Defensibility Audits for interview readiness.
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal('project')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#14B8A6] hover:bg-[#0EA5E9] active:scale-95 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Project</span>
        </button>
      </div>

      {/* 4-Tier Architecture Reference Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
          <div className="font-mono font-bold text-gray-400 uppercase text-[9px] tracking-wider">Tier 1</div>
          <div className="font-bold text-gray-900 dark:text-white mt-0.5">Console Utilities</div>
          <div className="text-[10px] text-[#FF3B30] font-semibold mt-1">✖ DO NOT PUT ON RESUME</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
          <div className="font-mono font-bold text-gray-400 uppercase text-[9px] tracking-wider">Tier 2</div>
          <div className="font-bold text-gray-900 dark:text-white mt-0.5">Academic Web CRUD</div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">Early Versions Only</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#151519] border-2 border-[#14B8A6] shadow-sm bg-[#14B8A6]/5">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[#14B8A6] uppercase text-[9px] tracking-wider">Tier 3 (Core Star)</span>
            <Star className="w-3.5 h-3.5 text-[#14B8A6] fill-current" />
          </div>
          <div className="font-bold text-gray-900 dark:text-white mt-0.5">Production Star API</div>
          <div className="text-[10px] text-[#34C759] font-semibold mt-1">✓ Primary Campus Star</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
          <div className="font-mono font-bold text-purple-400 uppercase text-[9px] tracking-wider">Tier 4 (Google L3)</div>
          <div className="font-bold text-gray-900 dark:text-white mt-0.5">Distributed System</div>
          <div className="text-[10px] text-[#AF52DE] font-semibold mt-1">★ ₹23.3 LPA+ Standout</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'tier1', 'tier2', 'tier3', 'tier4'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTier(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              filterTier === tab
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-[#151519] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#282830] hover:border-gray-400'
            }`}
          >
            {tab === 'all' ? 'All Projects' : tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
            <FolderGit2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              No projects in this tier
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add your Tier 3 backend API (e.g. LearnHub) or Tier 4 distributed system project (e.g. VBCUA).
            </p>
            <button
              onClick={() => onOpenAddModal('project')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#14B8A6] text-white text-xs font-semibold cursor-pointer"
            >
              Add Project Milestone
            </button>
          </div>
        ) : (
          filteredProjects.map(proj => {
            const defensibilityScore = getDefensibilityScore(proj.defensibility);
            const isExpanded = Boolean(expandedDefensibility[proj.id]);

            return (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] hover:border-[#14B8A6]/40 transition-all border-l-4 border-l-[#14B8A6] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#14B8A6]/15 text-[#14B8A6]">
                        {proj.tier.toUpperCase()}
                      </span>
                      {proj.isFlagship && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-500">
                          FLAGSHIP STAR
                        </span>
                      )}
                      <StatusPill status={proj.status} size="sm" />
                    </div>

                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="p-1 text-gray-400 hover:text-[#FF3B30] transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white wrap-anywhere">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 wrap-anywhere leading-relaxed">
                    {proj.notes || 'Full production backend architecture with database optimization.'}
                  </p>

                  {/* Tech Stack Pills */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-[#25252D] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#282830]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Resume Status Warning/Success */}
                  <div className="mt-3 text-[11px] font-medium flex items-center justify-between">
                    {proj.resumeStatus?.includes('Do Not') ? (
                      <span className="text-[#FF3B30] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {proj.resumeStatus}
                      </span>
                    ) : (
                      <span className="text-[#34C759] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {proj.resumeStatus}
                      </span>
                    )}

                    <div className="flex items-center gap-1 font-mono text-[11px] text-gray-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
                      <span>{defensibilityScore}/7 Defensibility</span>
                    </div>
                  </div>

                  {/* 7-Point Defensibility Checklist Accordion */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#25252D]">
                    <button
                      onClick={() => toggleDefensibilityExpand(proj.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[#14B8A6] transition-colors py-1 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
                        <span>7-Point Defensibility Audit</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 pl-1 pr-1 pb-1">
                        {DEFICIENCY_ITEMS.map(item => {
                          const isChecked = Boolean(proj.defensibility?.[item.key]);
                          return (
                            <div
                              key={item.key}
                              onClick={() => toggleDefensibilityCheck(proj, item.key)}
                              className={`flex items-start gap-2.5 p-2 rounded-lg text-xs cursor-pointer border transition-all ${
                                isChecked
                                  ? 'bg-[#14B8A6]/10 border-[#14B8A6]/30 text-gray-900 dark:text-white'
                                  : 'bg-gray-50 dark:bg-[#1D1D22] border-gray-200 dark:border-[#282830] text-gray-500 hover:border-gray-400'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                                  isChecked
                                    ? 'bg-[#14B8A6] border-[#14B8A6] text-white'
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#151519]'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-[11px] leading-tight">{item.label}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-[#25252D]">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#282830] hover:bg-gray-100 dark:hover:bg-[#25252D] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6] hover:bg-[#0EA5E9] text-white text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
