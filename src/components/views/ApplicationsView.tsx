import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  ExternalLink,
  Trash2,
  Calendar,
  CheckCircle2,
  DollarSign,
  UserCheck,
  Building2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { ApplicationStatus, JobApplication } from '../../types';
import { StatusPill } from '../common/StatusPill';

interface ApplicationsViewProps {
  onOpenAddModal: (type?: string) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onOpenAddModal }) => {
  const { applications, updateApplication, deleteApplication } = usePlacement();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredApps = useMemo(() => {
    if (filterStatus === 'all') return applications;
    return applications.filter(a => a.status === filterStatus);
  }, [applications, filterStatus]);

  const metrics = useMemo(() => {
    const total = applications.length;
    const offers = applications.filter(a => a.status === 'offer').length;
    const active = applications.filter(a => ['applied', 'oa_scheduled', 'interview_scheduled', 'interviewing'].includes(a.status)).length;
    return { total, offers, active };
  }, [applications]);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'offer':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#34C759]/15 text-[#34C759]">OFFER RECEIVED</span>;
      case 'interview_scheduled':
      case 'interviewing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#AF52DE]/15 text-[#AF52DE]">INTERVIEWING</span>;
      case 'oa_scheduled':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF9F0A]/15 text-[#FF9F0A]">OA SCHEDULED</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF3B30]/15 text-[#FF3B30]">REJECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#007AFF]/15 text-[#007AFF]">APPLIED</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#282830]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#007AFF]">
              Pipeline Tracking
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Job Applications
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Track campus placement drives, off-campus referrals, and hiring contest submissions.
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal('application')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#007AFF] hover:bg-[#0066D6] active:scale-95 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Application</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] text-center shadow-sm">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Total Tracked</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{metrics.total}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] text-center shadow-sm">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Active Pipeline</div>
          <div className="text-xl font-bold text-[#007AFF] mt-0.5">{metrics.active}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] text-center shadow-sm">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Offers Secured</div>
          <div className="text-xl font-bold text-[#34C759] mt-0.5">{metrics.offers}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'applied', 'oa_scheduled', 'interview_scheduled', 'offer', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              filterStatus === tab
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-[#151519] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#282830] hover:border-gray-400'
            }`}
          >
            {tab === 'all' ? 'All Applications' : tab.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
            <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              No applications in this category
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add college placement portals or LinkedIn referrals to track stages.
            </p>
            <button
              onClick={() => onOpenAddModal('application')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#007AFF] text-white text-xs font-semibold cursor-pointer"
            >
              Add Job Application
            </button>
          </div>
        ) : (
          filteredApps.map(app => (
            <div
              key={app.id}
              className="p-4 rounded-xl bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] hover:border-[#007AFF]/40 transition-all border-l-4 border-l-[#007AFF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 wrap-anywhere">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {getStatusBadge(app.status)}
                  {app.packageLPA && (
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                      ₹{app.packageLPA} LPA
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-gray-400">
                    Applied: {app.applicationDate}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white wrap-anywhere">
                  {app.company} — {app.role}
                </h3>

                {app.notes && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 wrap-anywhere">
                    {app.notes}
                  </p>
                )}

                {app.referral && (
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-[#007AFF]" />
                    <span>Referral: {app.referral}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {app.jobLink && (
                  <a
                    href={app.jobLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-[#282830] text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    title="View Job Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="p-1.5 text-gray-400 hover:text-[#FF3B30] rounded-lg transition-colors cursor-pointer"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
