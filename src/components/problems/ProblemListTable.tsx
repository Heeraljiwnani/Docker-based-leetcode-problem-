import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Circle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { Problem, Difficulty, UserProgress } from '../../types/problem';
import { DifficultyBadge } from './DifficultyBadge';
import { Input } from '../ui/input';

interface ProblemListTableProps {
  problems?: Problem[];
  progress?: UserProgress;
  selectedDifficulty: Difficulty | 'All';
  selectedTag: string | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const ProblemListTable: React.FC<ProblemListTableProps> = ({
  problems = [],
  progress,
  selectedDifficulty,
  selectedTag,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter problems by search query, difficulty, and selected tag
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      const matchesTag =
        !selectedTag || (problem.tags && problem.tags.includes(selectedTag));

      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedTag]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(start, start + itemsPerPage);
  }, [filteredProblems, currentPage, itemsPerPage]);

  const solvedCount = progress?.solvedCount ?? 0;
  const totalCount = progress?.totalCount ?? 3120;
  const solvedPercent = Math.round((solvedCount / totalCount) * 100);

  return (
    <div className="flex-1 space-y-4">
      {/* Top Header Row: Search & Solved Progress */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search problems by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
          />
        </div>

        {/* Solved Progress Bar Widget */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-lg shrink-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs gap-3">
              <span className="text-slate-400 font-medium">Solved</span>
              <span className="text-white font-mono font-bold">
                {solvedCount}/{totalCount}
              </span>
            </div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min(solvedPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl">
        {isLoading ? (
          /* Loading Skeletons */
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse py-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-slate-800" />
                  <div className="h-4 w-48 bg-slate-800 rounded" />
                </div>
                <div className="h-5 w-16 bg-slate-800 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
            <h3 className="text-lg font-semibold text-white">Failed to load problems</h3>
            <p className="text-sm text-slate-400">An error occurred while fetching the problem list.</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            )}
          </div>
        ) : paginatedProblems.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-3">
            <Code2 className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-200">No problems found</h3>
            <p className="text-sm text-slate-400">
              Try adjusting your search criteria or clearing filters.
            </p>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold text-white uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4 w-32">Difficulty</th>
                  <th className="py-3.5 px-4 w-32">Acceptance</th>
                  <th className="py-3.5 px-4 w-28 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {paginatedProblems.map((problem) => (
                  <tr
                    key={problem.id}
                    onClick={() => navigate(`/problems/${problem.id}`)}
                    className="group hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    {/* Status Icon */}
                    <td className="py-3.5 px-4 text-center">
                      {problem.solved ? (
                        <CheckCircle2 className="h-5 w-5 inline-block" style={{ color: '#4ade80' }} />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-600 inline-block group-hover:text-slate-400" />
                      )}
                    </td>

                    {/* Problem Title & Tags */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-100 group-hover:text-indigo-300 transition-colors" style={{ fontFamily: "'Lexend Deca', 'PT Sans', sans-serif" }}>
                        {problem.title}
                      </div>
                    </td>

                    {/* Difficulty Badge */}
                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>

                    {/* Acceptance Rate */}
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-white">
                      {problem.acceptanceRate !== undefined
                        ? `${problem.acceptanceRate}%`
                        : '—'}
                    </td>

                    {/* Solve Action */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all">
                        Solve
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination Controls */}
        {!isLoading && !isError && filteredProblems.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
            <span>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProblems.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of{' '}
              {filteredProblems.length} problems
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
  );
};

export default ProblemListTable;
