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
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <History className="h-4 w-4 text-indigo-400" />
          <span>Recent Activity</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('Recent AC')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'Recent AC'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recent AC
          </button>
          <button
            onClick={() => setActiveTab('All Submissions')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'All Submissions'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Submissions
          </button>
        </div>
      </div>

      {/* List Container */}
      {isLoading ? (
        <div className="space-y-3 py-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <div className="h-4 w-40 bg-slate-800 rounded" />
              <div className="h-4 w-20 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-8 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-xs text-slate-400">Failed to load recent activity</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
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
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="font-medium text-slate-100 group-hover:text-indigo-300 text-sm transition-colors">
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
      <div className="pt-2 border-t border-slate-800 text-right">
        <Link
          to="/submissions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all submissions
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default RecentActivityList;
