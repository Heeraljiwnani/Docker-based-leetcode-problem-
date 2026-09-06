import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  History,
} from 'lucide-react';
import { useSubmissions } from '../../hooks/useSubmissions';

export const RecentActivityList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Recent AC' | 'All Submissions'>('Recent AC');

  const isAcceptedOnly = activeTab === 'Recent AC';
  const { data: submissions = [], isLoading, isError, refetch } = useSubmissions(isAcceptedOnly);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 font-semibold text-xs" style={{ color: '#84cc16' }}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Accepted
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-xs">
            <XCircle className="h-3.5 w-3.5" />
            Wrong Answer
          </span>
        );
      case 'Time Limit Exceeded':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
            <Clock className="h-3.5 w-3.5" />
            Time Limit Exceeded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-purple-400 font-semibold text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl p-4 sm:p-6 space-y-4" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3" style={{ borderBottom: '1px solid #2e2e2e' }}>
        <div className="flex items-center gap-2 text-base font-bold text-white" style={{ fontFamily: "'Doppio One', sans-serif" }}>
          <History className="h-4 w-4" style={{ color: '#84cc16' }} />
          <span>Recent Activity</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}>
          <button
            onClick={() => setActiveTab('Recent AC')}
            className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            style={
              activeTab === 'Recent AC'
                ? { backgroundColor: '#84cc16', color: '#0a0a0a' }
                : { color: '#a0a0a0' }
            }
          >
            Recent AC
          </button>
          <button
            onClick={() => setActiveTab('All Submissions')}
            className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            style={
              activeTab === 'All Submissions'
                ? { backgroundColor: '#84cc16', color: '#0a0a0a' }
                : { color: '#a0a0a0' }
            }
          >
            All Submissions
          </button>
        </div>
      </div>

      {/* List Container */}
      {isLoading ? (
        <div className="space-y-3 py-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#2e2e2e' }}>
              <div className="h-4 w-40 rounded" style={{ backgroundColor: '#252525' }} />
              <div className="h-4 w-20 rounded" style={{ backgroundColor: '#252525' }} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-8 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-xs text-slate-400">Failed to load recent activity</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: '#84cc16' }}
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-8 text-center text-slate-400 space-y-1">
          <p className="text-sm font-medium">No submissions yet</p>
          <p className="text-xs text-slate-500">Solve problems to start building your activity history.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/problems/${sub.problemId}`)}
              className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer group hover:bg-[#252525]"
            >
              <div className="space-y-1">
                <div className="font-medium text-slate-100 group-hover:text-[#84cc16] text-sm transition-colors">
                  {sub.problemTitle}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {getStatusBadge(sub.status)}
                  <span className="font-mono text-[11px] text-slate-500">• {sub.language}</span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                {sub.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Link */}
      <div className="pt-2 text-right" style={{ borderTop: '1px solid #2e2e2e' }}>
        <Link
          to="/submissions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline"
          style={{ color: '#84cc16' }}
        >
          View all submissions
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default RecentActivityList;
