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
    <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid #2e2e2e' }}>
      {/* Recent AC Tab */}
      <button
        onClick={() => onTabChange('Recent AC')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'Recent AC'
            ? 'text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
        }`}
        style={activeTab === 'Recent AC' ? { backgroundColor: '#84cc16', color: '#0a0a0a' } : {}}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>Recent AC</span>
        <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: '#252525', color: '#a0a0a0' }}>
          {acCount}
        </span>
      </button>

      {/* All Submissions Tab */}
      <button
        onClick={() => onTabChange('All Submissions')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'All Submissions'
            ? 'text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
        }`}
        style={activeTab === 'All Submissions' ? { backgroundColor: '#84cc16', color: '#0a0a0a' } : {}}
      >
        <History className="h-4 w-4" />
        <span>All Submissions</span>
        <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: '#252525', color: '#a0a0a0' }}>
          {totalCount}
        </span>
      </button>
    </div>
  );
};

export default SubmissionTabs;
