import React, { useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import SubmissionHeatmap from '../components/profile/SubmissionHeatmap';
import SubmissionTabs from '../components/submissions/SubmissionTabs';
import SubmissionListItem from '../components/submissions/SubmissionListItem';
import SubmissionCodeModal from '../components/submissions/SubmissionCodeModal';

import { useSubmissionStats } from '../hooks/useSubmissionStats';
import { useSubmissions } from '../hooks/useSubmissions';
import { RecentSubmissionItem } from '../types/profile';
import { AlertCircle, RefreshCw, ChevronLeft, ChevronRight, History } from 'lucide-react';

export const SubmissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Recent AC' | 'All Submissions'>('Recent AC');
  const [selectedSubmission, setSelectedSubmission] = useState<RecentSubmissionItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const isAcceptedOnly = activeTab === 'Recent AC';

  // Fetch hooks
  const {
    data: subStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchStats,
  } = useSubmissionStats();

  const {
    data: submissions = [],
    isLoading: isLoadingList,
    isError: isErrorList,
    refetch: refetchList,
  } = useSubmissions(isAcceptedOnly);

  // Compute counts for tabs
  const acCount = useMemo(() => {
    return submissions.filter((s) => s.status === 'Accepted').length;
  }, [submissions]);

  // Pagination logic
  const totalPages = Math.ceil(submissions.length / itemsPerPage) || 1;
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return submissions.slice(start, start + itemsPerPage);
  }, [submissions, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Persistent Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Submission History</h1>
            <p className="text-xs text-slate-400">
              Track your daily problem solving streak, submission stats, and code execution history.
            </p>
          </div>
        </div>

        {/* SECTION 1: Submission Heatmap Header */}
        <SubmissionHeatmap
          stats={subStats}
          isLoading={isLoadingStats}
          isError={isErrorStats}
          onRetry={refetchStats}
        />

        {/* SECTION 2: Submissions Activity List */}
        <div className="space-y-4">
          {/* Tab Navigation */}
          <SubmissionTabs
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            acCount={acCount}
            totalCount={submissions.length}
          />

          {/* Table Container */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl">
            {isLoadingList ? (
              /* Loading Skeletons */
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center animate-pulse py-3 border-b border-slate-800/60">
                    <div className="h-4 w-28 bg-slate-800 rounded" />
                    <div className="h-4 w-48 bg-slate-800 rounded" />
                    <div className="h-4 w-20 bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : isErrorList ? (
              /* Error State */
              <div className="p-12 text-center space-y-3">
                <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
                <h3 className="text-lg font-semibold text-white">Failed to load submission history</h3>
                <p className="text-sm text-slate-400">An error occurred while fetching your submissions.</p>
                <button
                  onClick={refetchList}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
                >
                  <RefreshCw className="h-4 w-4" /> Retry
                </button>
              </div>
            ) : paginatedSubmissions.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center space-y-2">
                <History className="h-10 w-10 text-slate-600 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-200">No submissions yet</h3>
                <p className="text-sm text-slate-400">
                  {activeTab === 'Recent AC'
                    ? 'No accepted submissions found.'
                    : 'Submit your code on any problem to start building your history.'}
                </p>
              </div>
            ) : (
              /* Table View */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-44">Status</th>
                      <th className="py-3.5 px-4">Problem Title</th>
                      <th className="py-3.5 px-4 w-36">Language</th>
                      <th className="py-3.5 px-4 w-36">Submitted</th>
                      <th className="py-3.5 px-4 w-28 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {paginatedSubmissions.map((sub) => (
                      <SubmissionListItem
                        key={sub.id}
                        submission={sub}
                        onClick={() => setSelectedSubmission(sub)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoadingList && !isErrorList && submissions.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, submissions.length)} to{' '}
                  {Math.min(currentPage * itemsPerPage, submissions.length)} of{' '}
                  {submissions.length} submissions
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="font-mono px-2 text-slate-200">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Code Viewer Modal */}
      <SubmissionCodeModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
};

export default SubmissionsPage;
