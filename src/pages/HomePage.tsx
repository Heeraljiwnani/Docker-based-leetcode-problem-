import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useProblems } from '../hooks/useProblems';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import { Difficulty } from '../types/problem';

const TOPIC_SECTIONS = [
  {
    id: 'Arrays',
    title: 'Arrays & Hashing',
    description: 'Array traversal, hash tables, and set lookup problems',
    icon: 'grid_view',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    match: (tags: string[]) => tags.some((t) => ['array', 'arrays', 'hashmap', 'hashset'].includes(t.toLowerCase())),
  },
  {
    id: 'Two Pointers',
    title: 'Two Pointers',
    description: 'In-place array manipulation and window pointers',
    icon: 'alt_route',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    match: (tags: string[]) => tags.some((t) => ['twopointers', 'two pointers', 'two-pointers'].includes(t.toLowerCase())),
  },
  {
    id: 'Dynamic Programming',
    title: 'Dynamic Programming',
    description: 'Memoization, tabulation, and optimal substructure problems',
    icon: 'auto_graph',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    match: (tags: string[]) => tags.some((t) => ['dp', 'dynamic programming', 'dynamicprogramming'].includes(t.toLowerCase())),
  },
  {
    id: 'Binary Search',
    title: 'Binary Search',
    description: 'Logarithmic search space partition problems',
    icon: 'search',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    match: (tags: string[]) => tags.some((t) => ['binarysearch', 'binary search'].includes(t.toLowerCase())),
  },
  {
    id: 'Strings',
    title: 'Strings & Stack',
    description: 'String parsing, matching, and stack sequence evaluation',
    icon: 'match_case',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    match: (tags: string[]) => tags.some((t) => ['string', 'strings', 'stack'].includes(t.toLowerCase())),
  },
  {
    id: 'Math',
    title: 'Math & Bit Manipulation',
    description: 'Mathematical induction, bitwise XOR, and digit arithmetic',
    icon: 'calculate',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    match: (tags: string[]) => tags.some((t) => ['math', 'bit manipulation', 'bitmanipulation'].includes(t.toLowerCase())),
  },
];

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

  // Filter problems by search & difficulty
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

      return matchesSearch && matchesDiff && matchesStatus;
    });
  }, [safeProblems, searchQuery, selectedDifficulty, selectedStatus]);

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
                    <span
                      className="inline-flex items-center gap-1.5 px-gutter-sm py-0.5 rounded-full font-code-sm text-code-sm font-bold uppercase tracking-wider"
                      style={{ backgroundColor: 'rgba(250, 204, 21, 0.15)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.3)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#facc15' }} />
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
                    <span className="px-2 py-0.5 rounded-full font-code-sm text-code-sm font-bold bg-secondary/10 text-secondary border border-secondary/20">
                      MEDIUM
                    </span>
                    <span className="text-on-surface-variant font-code-sm text-code-sm font-bold">Dynamic Programming</span>
                    <span className="text-outline text-code-sm font-bold">•</span>
                    <span className="text-on-surface-variant font-code-sm text-code-sm font-bold">Binary Search</span>
                    <span className="text-outline text-code-sm font-bold">•</span>
                    <span className="text-on-surface-variant font-code-sm text-code-sm font-bold">Acceptance: 54.3%</span>
                  </div>
                </div>
              </div>

              <div className="mt-gutter-lg pt-gutter-md flex items-center justify-between relative z-10 border-t border-outline-variant/30">
                <div className="flex items-center gap-gutter-md font-code-sm text-code-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#facc15' }}>check_circle</span>
                    <span className="font-bold">4,892 Completed Today</span>
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
                    className={`px-2.5 py-1 rounded-full font-code-sm text-code-sm font-bold whitespace-nowrap transition-colors ${
                      selectedTag === tag
                        ? 'text-on-primary'
                        : 'bg-surface-container-high text-white hover:bg-surface-bright'
                    }`}
                    style={selectedTag === tag ? { backgroundColor: '#84cc16', color: '#0a0a0a' } : {}}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Problems Catalog Table & Topic View */}
            <div className="flex flex-col gap-gutter-lg">
              {isLoadingProblems ? (
                <div className="bg-surface-container-low rounded-xl p-12 text-center text-on-surface-variant font-code-sm text-code-sm">
                  Loading problem directory...
                </div>
              ) : (() => {
                const displaySections = selectedTag === 'All Topics'
                  ? [
                      {
                        id: 'All Topics',
                        title: 'All Topics',
                        description: 'Comprehensive problem directory across all data structures and algorithmic patterns',
                        icon: 'apps',
                        badgeColor: 'bg-primary/10 text-primary border-primary/20',
                        items: filteredProblems,
                      },
                    ]
                  : TOPIC_SECTIONS.filter((sec) => {
                      const tagNorm = selectedTag.toLowerCase().replace(/s$/, '');
                      const secIdNorm = sec.id.toLowerCase().replace(/s$/, '');
                      const secTitleNorm = sec.title.toLowerCase().replace(/s$/, '');
                      return (
                        secIdNorm.includes(tagNorm) ||
                        tagNorm.includes(secIdNorm) ||
                        secTitleNorm.includes(tagNorm) ||
                        tagNorm.includes(secTitleNorm)
                      );
                    }).map((sec) => {
                      const items = filteredProblems.filter((p) => sec.match(p.tags || []));
                      return { ...sec, items };
                    }).filter((sec) => sec.items.length > 0);

                if (displaySections.length === 0) {
                  return (
                    <div className="bg-surface-container-low rounded-xl p-12 text-center text-on-surface-variant font-code-sm text-code-sm shadow-md">
                      No problems match your selected filter or search query.
                    </div>
                  );
                }

                return displaySections.map((sec) => {
                  const totalPages = Math.ceil(sec.items.length / itemsPerPage) || 1;
                  const displayItems = selectedTag === 'All Topics'
                    ? sec.items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    : sec.items;

                  return (
                    <div key={sec.id} className="bg-surface-container-low rounded-xl shadow-md overflow-hidden flex flex-col border border-outline-variant/30">
                      {/* Topic Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-gutter-md py-3.5 bg-surface-container-lowest border-b border-outline-variant/40 gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(132,204,22,0.15)', color: '#84cc16' }}>
                            <span className="material-symbols-outlined text-[18px]">{sec.icon}</span>
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                              {sec.title}
                            </h2>
                            <p className="text-xs text-on-surface-variant">{sec.description}</p>
                          </div>
                        </div>
                        <span className={`self-start sm:self-auto text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${sec.badgeColor}`}>
                          {sec.items.length} {sec.items.length === 1 ? 'Problem' : 'Problems'}
                        </span>
                      </div>

                      {/* Topic Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-body-sm text-body-sm text-on-surface">
                          <thead className="bg-surface-container-lowest/60 font-code-sm text-code-sm font-bold text-white uppercase tracking-wider border-b border-outline-variant/30">
                            <tr>
                              <th className="py-2.5 px-gutter-md w-12 text-center" scope="col">Status</th>
                              <th className="py-2.5 px-gutter-md w-16" scope="col">#</th>
                              <th className="py-2.5 px-gutter-md min-w-[260px]" scope="col">Title</th>
                              <th className="py-2.5 px-gutter-md w-32 text-right" scope="col">Acceptance</th>
                              <th className="py-2.5 px-gutter-md w-28 text-center" scope="col">Difficulty</th>
                              <th className="py-2.5 px-gutter-md w-16 text-center" scope="col"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/20">
                            {displayItems.map((p) => (
                              <tr
                                key={p.id}
                                onClick={() => navigate(`/problems/${p.id}`)}
                                className="hover:bg-surface-container transition-colors group cursor-pointer"
                              >
                                {/* Status Icon */}
                                <td className="py-2.5 px-gutter-md text-center">
                                  {p.solved ? (
                                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#4ade80' }} title="Solved">check_circle</span>
                                  ) : (
                                    <span className="material-symbols-outlined text-outline text-[18px]" title="Not solved">circle</span>
                                  )}
                                </td>

                                {/* ID */}
                                <td className="py-2.5 px-gutter-md font-code-sm text-code-sm text-outline font-bold">
                                  {p.id}
                                </td>

                                {/* Title */}
                                <td className="py-2.5 px-gutter-md">
                                  <span className="font-medium text-on-surface group-hover:text-primary transition-colors">
                                    {p.title}
                                  </span>
                                </td>

                                {/* Acceptance */}
                                <td className="py-2.5 px-gutter-md font-code-sm text-code-sm text-right text-on-surface-variant">
                                  {p.acceptanceRate ? `${p.acceptanceRate}%` : '50.0%'}
                                </td>

                                {/* Difficulty */}
                                <td className="py-2.5 px-gutter-md text-center">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full font-code-sm text-code-sm font-bold border ${
                                      p.difficulty === 'Easy'
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                        : p.difficulty === 'Medium'
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                        : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                    }`}
                                  >
                                    {p.difficulty.toUpperCase()}
                                  </span>
                                </td>

                                {/* Code Icon */}
                                <td className="py-2.5 px-gutter-md text-center">
                                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors text-[18px]">code</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer (10 items per page with Next/Prev Arrow navigation) */}
                      {selectedTag === 'All Topics' && totalPages > 1 && (
                        <div className="px-gutter-md py-3 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-3 font-code-sm text-code-sm text-on-surface-variant border-t border-outline-variant/30">
                          <div>
                            Showing <strong className="text-on-surface">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                            <strong className="text-on-surface">{Math.min(currentPage * itemsPerPage, sec.items.length)}</strong> of{' '}
                            <strong className="text-on-surface">{sec.items.length}</strong> problems
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Previous Arrow */}
                            <button
                              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                              disabled={currentPage === 1}
                              className="p-1.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Previous 10 Problems"
                              aria-label="Previous Page"
                            >
                              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-lg font-code-sm text-code-sm font-bold transition-colors cursor-pointer ${
                                  currentPage === page
                                    ? 'text-on-primary font-bold'
                                    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                                }`}
                                style={currentPage === page ? { backgroundColor: '#84cc16', color: '#0a0a0a' } : {}}
                              >
                                {page}
                              </button>
                            ))}

                            {/* Next Arrow */}
                            <button
                              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="p-1.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Next 10 Problems"
                              aria-label="Next Page"
                            >
                              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
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
