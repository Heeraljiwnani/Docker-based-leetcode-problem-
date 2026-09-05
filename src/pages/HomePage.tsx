import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useProblems } from '../hooks/useProblems';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import { Difficulty } from '../types/problem';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'solved' | 'todo'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('All Topics');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: problems = [], isLoading: isLoadingProblems } = useProblems();
  const { data: progress } = useProgress();
  const { data: streak } = useStreak();

  const safeProblems = Array.isArray(problems) ? problems : [];

  // Filter problems
  const filteredProblems = useMemo(() => {
    return safeProblems.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.includes(searchQuery);
      const matchesDiff =
        selectedDifficulty === 'all' ||
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'solved' && p.solved) ||
        (selectedStatus === 'todo' && !p.solved);
      const matchesTag =
        selectedTag === 'All Topics' ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())));

      return matchesSearch && matchesDiff && matchesStatus && matchesTag;
    });
  }, [safeProblems, searchQuery, selectedDifficulty, selectedStatus, selectedTag]);

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(start, start + itemsPerPage);
  }, [filteredProblems, currentPage]);

  const handlePickRandom = () => {
    if (filteredProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredProblems.length);
      const randomProblem = filteredProblems[randomIndex];
      navigate(`/problems/${randomProblem.id}`);
    }
  };

  const topicTags = [
    'All Topics',
    'Arrays',
    'Two Pointers',
    'Dynamic Programming',
    'Binary Search',
    'Trees',
    'Graphs',
    'Backtracking',
    'Strings',
    'Math',
  ];

  const easySolved = progress?.easySolved ?? 180;
  const mediumSolved = progress?.mediumSolved ?? 132;
  const hardSolved = progress?.hardSolved ?? 30;
  const solvedCount = progress?.solvedCount ?? 342;
  const totalCount = progress?.totalCount ?? 1280;
  const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans antialiased selection:bg-primary/30 selection:text-primary">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full pt-14 bg-surface min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col w-full">
          <div className="w-full px-gutter-lg py-gutter-lg max-w-7xl mx-auto flex flex-col gap-gutter-lg">

            {/* Daily Challenge Banner */}
            <div className="w-full bg-surface-container-low rounded-xl p-gutter-lg flex flex-col justify-between shadow-md relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col gap-gutter-sm relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-gutter-sm">
                    <span className="inline-flex items-center gap-1.5 px-gutter-sm py-0.5 rounded-full bg-surface-container-highest text-primary font-code-sm text-code-sm uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Daily Mission
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-code-sm text-code-sm text-outline">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    <span>Ends in: <span className="text-on-surface font-medium">08:42:19</span></span>
                  </div>
                </div>

                <div className="mt-gutter-xs">
                  <div className="flex items-baseline gap-gutter-sm">
                    <span className="font-code-lg text-code-lg text-outline">#300</span>
                    <h2
                      onClick={() => navigate('/problems/1')}
                      className="font-headline-lg text-headline-lg text-on-surface tracking-tight hover:text-primary transition-colors cursor-pointer"
                    >
                      Longest Increasing Subsequence
                    </h2>
                  </div>
                  <div className="flex items-center gap-gutter-sm mt-1">
                    <span className="px-2 py-0.5 rounded-full font-code-sm text-code-sm font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                      MEDIUM
                    </span>
                    <span className="text-on-surface-variant font-code-sm text-code-sm">Dynamic Programming</span>
                    <span className="text-outline text-code-sm">•</span>
                    <span className="text-on-surface-variant font-code-sm text-code-sm">Binary Search</span>
                    <span className="text-outline text-code-sm">•</span>
                    <span className="text-on-surface-variant font-code-sm text-code-sm">Acceptance: 54.3%</span>
                  </div>
                </div>
              </div>

              <div className="mt-gutter-lg pt-gutter-md flex items-center justify-between relative z-10 border-t border-outline-variant/30">
                <div className="flex items-center gap-gutter-md font-code-sm text-code-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-400">check_circle</span>
                    <span>4,892 Completed Today</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/problems/1')}
                  className="inline-flex items-center gap-2 px-gutter-lg py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-colors shadow-sm focus:outline-none cursor-pointer"
                >
                  <span>Solve Daily</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Filter & Control Section */}
            <div className="flex flex-col gap-gutter-sm bg-surface-container-low p-gutter-md rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-gutter-md">
                {/* Search Input */}
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search problems by title, number, or keyword..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:bg-surface-container-high transition-colors"
                  />
                  <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 font-code-sm text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-outline">
                    ⌘K
                  </kbd>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center flex-wrap gap-gutter-xs">
                  {/* Difficulty Filter */}
                  <div className="relative">
                    <select
                      id="diff-filter"
                      value={selectedDifficulty}
                      onChange={(e) => {
                        setSelectedDifficulty(e.target.value as Difficulty | 'all');
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-surface-container-lowest text-on-surface font-code-sm text-code-sm px-gutter-md py-2 pr-8 rounded-lg cursor-pointer focus:outline-none hover:bg-surface-container-high transition-colors"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">unfold_more</span>
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      id="status-filter"
                      value={selectedStatus}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value as 'all' | 'solved' | 'todo');
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-surface-container-lowest text-on-surface font-code-sm text-code-sm px-gutter-md py-2 pr-8 rounded-lg cursor-pointer focus:outline-none hover:bg-surface-container-high transition-colors"
                    >
                      <option value="all">Status: All</option>
                      <option value="solved">Solved</option>
                      <option value="todo">Todo</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">unfold_more</span>
                  </div>

                  {/* Pick Random */}
                  <button
                    id="btn-shuffle"
                    type="button"
                    onClick={handlePickRandom}
                    title="Launch random unsolved challenge"
                    className="inline-flex items-center gap-1.5 px-gutter-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">casino</span>
                    <span>Pick One</span>
                  </button>
                </div>
              </div>

              {/* Topic Tags */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-gutter-xs pb-1 scrollbar-none">
                {topicTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-full font-code-sm text-code-sm font-medium whitespace-nowrap transition-colors ${
                      selectedTag === tag
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Problems Catalog Table */}
            <div className="bg-surface-container-low rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm text-on-surface">
                  <thead className="bg-surface-container-lowest font-code-sm text-code-sm text-outline uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-gutter-md w-12 text-center" scope="col">Status</th>
                      <th className="py-3 px-gutter-md w-16" scope="col">#</th>
                      <th className="py-3 px-gutter-md min-w-[280px]" scope="col">Title</th>
                      <th className="py-3 px-gutter-md w-32 text-right" scope="col">Acceptance</th>
                      <th className="py-3 px-gutter-md w-28 text-center" scope="col">Difficulty</th>
                      <th className="py-3 px-gutter-md w-16 text-center" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody id="problem-rows-container">
                    {isLoadingProblems ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-on-surface-variant font-code-sm text-code-sm">
                          Loading problem directory...
                        </td>
                      </tr>
                    ) : paginatedProblems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-on-surface-variant font-code-sm text-code-sm">
                          No problems match your filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedProblems.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => navigate(`/problems/${p.id}`)}
                          className="problem-row hover:bg-surface-container transition-colors group cursor-pointer"
                          data-difficulty={p.difficulty.toLowerCase()}
                          data-status={p.solved ? 'solved' : 'todo'}
                        >
                          {/* Status Icon */}
                          <td className="py-3 px-gutter-md text-center">
                            {p.solved ? (
                              <span className="material-symbols-outlined text-tertiary text-[18px]" title="Solved">check_circle</span>
                            ) : (
                              <span className="material-symbols-outlined text-outline text-[18px]" title="Not solved">circle</span>
                            )}
                          </td>

                          {/* ID */}
                          <td className="py-3 px-gutter-md font-code-sm text-code-sm text-outline">
                            {p.id}
                          </td>

                          {/* Title */}
                          <td className="py-3 px-gutter-md">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-on-surface group-hover:text-primary transition-colors">
                                {p.title}
                              </span>
                            </div>
                          </td>

                          {/* Acceptance */}
                          <td className="py-3 px-gutter-md font-code-sm text-code-sm text-right text-on-surface-variant">
                            {p.acceptanceRate ? `${p.acceptanceRate}%` : '50.0%'}
                          </td>

                          {/* Difficulty */}
                          <td className="py-3 px-gutter-md text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-code-sm text-code-sm font-semibold ${
                                p.difficulty === 'Easy'
                                  ? 'bg-tertiary/10 text-tertiary'
                                  : p.difficulty === 'Medium'
                                  ? 'bg-secondary/10 text-secondary'
                                  : 'bg-error/10 text-error'
                              }`}
                            >
                              {p.difficulty.toUpperCase()}
                            </span>
                          </td>

                          {/* Code Icon */}
                          <td className="py-3 px-gutter-md text-center">
                            <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors text-[18px]">code</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {!isLoadingProblems && filteredProblems.length > 0 && (
                <div className="px-gutter-md py-3 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-3 font-code-sm text-code-sm text-on-surface-variant border-t border-outline-variant/30">
                  <div>
                    Showing <strong className="text-on-surface">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                    <strong className="text-on-surface">{Math.min(currentPage * itemsPerPage, filteredProblems.length)}</strong> of{' '}
                    <strong className="text-on-surface">{filteredProblems.length}</strong> items
                    {' '}• Rows: 10
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface disabled:opacity-40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1 rounded font-code-sm text-code-sm transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-on-primary font-bold'
                            : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {totalPages > 5 && (
                      <>
                        <span className="text-outline px-1">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-2.5 py-1 rounded font-code-sm text-code-sm border border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors ${
                            currentPage === totalPages ? 'bg-primary text-on-primary font-bold' : ''
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface disabled:opacity-40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant py-3 px-gutter-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-code-sm text-code-sm text-outline">
          <div className="flex items-center gap-2">
            <span>CodeArena Workstation</span>
            <span>•</span>
            <span>Runtime: Linux x86_64</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-on-surface cursor-pointer transition-colors">Docs</span>
            <span className="hover:text-on-surface cursor-pointer transition-colors">API</span>
            <span className="hover:text-on-surface cursor-pointer transition-colors">Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
