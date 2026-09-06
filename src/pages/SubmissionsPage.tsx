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
    <div className="min-h-screen text-on-surface flex flex-col font-sans antialiased" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Top Persistent Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center gap-3 pt-6">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#84cc16' }}>
            <History className="h-5 w-5" style={{ color: '#0a0a0a' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Submission History</h1>
            <p className="text-xs text-on-surface-variant">
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
          <div className="rounded-xl overflow-hidden shadow-xl" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
            {isLoadingList ? (
              /* Loading Skeletons */
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center animate-pulse py-3 border-b" style={{ borderColor: '#2e2e2e' }}>
                    <div className="h-4 w-28 rounded" style={{ backgroundColor: '#252525' }} />
                    <div className="h-4 w-48 rounded" style={{ backgroundColor: '#252525' }} />
                    <div className="h-4 w-20 rounded" style={{ backgroundColor: '#252525' }} />
                  </div>
                ))}
              </div>
            ) : isErrorList ? (
              /* Error State */
              <div className="p-12 text-center space-y-3">
                <AlertCircle className="h-8 w-8 text-error mx-auto" />
                <h3 className="text-lg font-bold text-on-surface">Failed to load submission history</h3>
                <p className="text-sm text-on-surface-variant">An error occurred while fetching your submissions.</p>
                <button
                  onClick={refetchList}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  style={{ backgroundColor: '#84cc16', color: '#0a0a0a' }}
                >
                  <RefreshCw className="h-4 w-4" /> Retry
                </button>
              </div>
            ) : paginatedSubmissions.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center space-y-2">
                <History className="h-10 w-10 mx-auto" style={{ color: '#2e2e2e' }} />
                <h3 className="text-lg font-bold text-on-surface">No submissions yet</h3>
                <p className="text-sm text-on-surface-variant">
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
                    <tr className="text-xs font-bold text-white uppercase tracking-wider" style={{ borderBottom: '1px solid #2e2e2e', backgroundColor: '#111' }}>
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
              <div className="flex items-center justify-between px-4 py-3 text-xs text-on-surface-variant" style={{ borderTop: '1px solid #2e2e2e', backgroundColor: '#111' }}>
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, submissions.length)} to{' '}
                  {Math.min(currentPage * itemsPerPage, submissions.length)} of{' '}
                  {submissions.length} submissions
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-surface-container"
                    style={{ border: '1px solid #2e2e2e', backgroundColor: '#1c1c1c' }}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="font-mono px-2 text-on-surface">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-surface-container"
                    style={{ border: '1px solid #2e2e2e', backgroundColor: '#1c1c1c' }}
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
