import React from 'react';
import { CheckCircle2, History } from 'lucide-react';

interface SubmissionTabsProps {
  activeTab: 'Recent AC' | 'All Submissions';
  onTabChange: (tab: 'Recent AC' | 'All Submissions') => void;
  acCount?: number;
  totalCount?: number;
}

export const SubmissionTabs: React.FC<SubmissionTabsProps> = ({
  activeTab,
  onTabChange,
  acCount = 6,
  totalCount = 8,
}) => {
  return (
    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
      {/* Recent AC Tab */}
      <button
        onClick={() => onTabChange('Recent AC')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'Recent AC'
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>Recent AC</span>
        <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
          {acCount}
        </span>
      </button>

      {/* All Submissions Tab */}
      <button
        onClick={() => onTabChange('All Submissions')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'All Submissions'
            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-600/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
        }`}
      >
        <History className="h-4 w-4" />
        <span>All Submissions</span>
        <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
          {totalCount}
        </span>
      </button>
    </div>
  );
};

export default SubmissionTabs;
