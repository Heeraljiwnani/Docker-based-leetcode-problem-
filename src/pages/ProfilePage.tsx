import React from 'react';
import Navbar from '../components/layout/Navbar';
import LanguageStatsList from '../components/profile/LanguageStatsList';
import SubmissionHeatmap from '../components/profile/SubmissionHeatmap';
import RecentActivityList from '../components/profile/RecentActivityList';

import { useAuthStore } from '../store/useAuthStore';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import { useLanguageStats } from '../hooks/useLanguageStats';
import { useSubmissionStats } from '../hooks/useSubmissionStats';

import { CheckCircle2, Trophy, Flame, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: progress, isLoading: isLoadingProgress } = useProgress();
  const { data: streak } = useStreak();
  const {
    data: languageStats,
    isLoading: isLoadingLanguages,
    isError: isErrorLanguages,
    refetch: refetchLanguages,
  } = useLanguageStats();
  const {
    data: submissionStats,
    isLoading: isLoadingSubStats,
    isError: isErrorSubStats,
    refetch: refetchSubStats,
  } = useSubmissionStats();

  const userName = user?.name || user?.email?.split('@')[0] || 'CodeArena Coder';
  const userEmail = user?.email || 'coder@codearena.com';

  const easySolved = progress?.easySolved ?? 180;
  const easyTotal = progress?.easyTotal ?? 400;
  const mediumSolved = progress?.mediumSolved ?? 132;
  const mediumTotal = progress?.mediumTotal ?? 620;
  const hardSolved = progress?.hardSolved ?? 30;
  const hardTotal = progress?.hardTotal ?? 260;

  const solvedCount = progress?.solvedCount ?? (easySolved + mediumSolved + hardSolved);
  const totalCount = progress?.totalCount ?? (easyTotal + mediumTotal + hardTotal);
  const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Popular topic tags solved breakdown
  const popularTags = [
    { tag: 'Array', count: 28 },
    { tag: 'Dynamic Programming', count: 18 },
    { tag: 'Hash Table', count: 15 },
    { tag: 'String', count: 14 },
    { tag: 'Two Pointers', count: 10 },
  ];

  return (
    <div className="min-h-screen text-on-surface flex flex-col font-sans antialiased selection:bg-primary/30 selection:text-primary" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT SIDEBAR: User Info & Compact Stats */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* User Info Card */}
            <div className="rounded-xl p-6 text-center space-y-4 shadow-xl" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
              <div className="relative inline-block">
                <div className="h-20 w-20 rounded-full font-bold text-2xl flex items-center justify-center mx-auto shadow-lg border-2" style={{ backgroundColor: '#84cc16', color: '#0a0a0a', borderColor: '#a3e635' }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: '#84cc16', borderColor: '#0a0a0a' }}>
                  <CheckCircle2 className="h-3 w-3 text-black" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Doppio One', sans-serif" }}>{userName}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{userEmail}</p>
                <div className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(132, 204, 22, 0.15)', color: '#84cc16', border: '1px solid rgba(132, 204, 22, 0.3)' }}>
                  <Trophy className="h-3 w-3" />
                  CodeArena Competitor
                </div>
              </div>
            </div>

            {/* Progress Difficulty Breakdown */}
            <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
              <h3 className="text-sm font-semibold text-slate-200 pb-2" style={{ borderBottom: '1px solid #2e2e2e', fontFamily: "'Doppio One', sans-serif" }}>
                Problem Solving Progress
              </h3>

              {isLoadingProgress ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded" />
                  <div className="h-4 bg-slate-800 rounded" />
                  <div className="h-4 bg-slate-800 rounded" />
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {/* Easy */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="font-semibold" style={{ color: '#84cc16' }}>Easy</span>
                      <span className="font-mono text-slate-300">
                        {easySolved}/{easyTotal}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#111' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: '#84cc16',
                          width: `${Math.round((easySolved / easyTotal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-amber-400 font-semibold">Medium</span>
                      <span className="font-mono text-slate-300">
                        {mediumSolved}/{mediumTotal}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#111' }}>
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${Math.round((mediumSolved / mediumTotal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Hard */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-rose-400 font-semibold">Hard</span>
                      <span className="font-mono text-slate-300">
                        {hardSolved}/{hardTotal}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#111' }}>
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{
                          width: `${Math.round((hardSolved / hardTotal) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Breakdown */}
            <LanguageStatsList
              stats={languageStats}
              isLoading={isLoadingLanguages}
              isError={isErrorLanguages}
              onRetry={refetchLanguages}
            />

            {/* Most Solved by Tag */}
            <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
              <div className="flex items-center justify-between pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ borderBottom: '1px solid #2e2e2e', fontFamily: "'Doppio One', sans-serif" }}>
                <span>Most Solved by Tag</span>
                <Sparkles className="h-3.5 w-3.5" style={{ color: '#84cc16' }} />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {popularTags.map((item) => (
                  <span
                    key={item.tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-300"
                    style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}
                  >
                    <span>{item.tag}</span>
                    <strong className="font-mono text-[11px]" style={{ color: '#84cc16' }}>
                      x{item.count}
                    </strong>
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT: Overall Completion, Heatmap & Recent Activity */}
          <div className="flex-1 w-full space-y-6">
            {/* Overall Completion Telemetry Card */}
            <div className="rounded-xl p-6 space-y-5 shadow-xl" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-mono font-medium">
                    Overall Completion
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-bold text-white font-mono">
                      {solvedCount}
                    </span>
                    <span className="text-sm font-mono text-slate-500">
                      / {totalCount.toLocaleString()}
                    </span>
                    <span className="ml-2 text-sm font-mono font-semibold" style={{ color: '#84cc16' }}>
                      ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30" style={{ backgroundColor: '#111' }}>
                  <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {streak?.currentStreak ?? 7}d Active Streak
                  </span>
                </div>
              </div>

              {/* Metric Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                {/* Easy */}
                <div className="p-3 rounded-lg flex flex-col gap-1.5" style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold" style={{ color: '#84cc16' }}>Easy</span>
                    <span className="text-slate-200 font-mono">{easySolved}<span className="text-slate-500">/{easyTotal}</span></span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: '#84cc16', width: `${Math.round((easySolved / easyTotal) * 100)}%` }} />
                  </div>
                  <span className="text-slate-500 text-[11px] font-mono text-right">
                    {Math.round((easySolved / easyTotal) * 100)}%
                  </span>
                </div>

                {/* Medium */}
                <div className="p-3 rounded-lg flex flex-col gap-1.5" style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-400 font-semibold">Medium</span>
                    <span className="text-slate-200 font-mono">{mediumSolved}<span className="text-slate-500">/{mediumTotal}</span></span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.round((mediumSolved / mediumTotal) * 100)}%` }} />
                  </div>
                  <span className="text-slate-500 text-[11px] font-mono text-right">
                    {Math.round((mediumSolved / mediumTotal) * 100)}%
                  </span>
                </div>

                {/* Hard */}
                <div className="p-3 rounded-lg flex flex-col gap-1.5" style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-rose-400 font-semibold">Hard</span>
                    <span className="text-slate-200 font-mono">{hardSolved}<span className="text-slate-500">/{hardTotal}</span></span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.round((hardSolved / hardTotal) * 100)}%` }} />
                  </div>
                  <span className="text-slate-500 text-[11px] font-mono text-right">
                    {Math.round((hardSolved / hardTotal) * 100)}%
                  </span>
                </div>
              </div>

              {/* Multi-Segment Donut Ring & Rank */}
              <div className="flex items-center gap-4 pt-1" style={{ borderTop: '1px solid #2e2e2e' }}>
                <div className="relative w-12 h-12 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      style={{ color: '#84cc16' }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="14.06, 100"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-amber-500"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="10.31, 100"
                      strokeDashoffset="-14.06"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-rose-500"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="2.34, 100"
                      strokeDashoffset="-24.37"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white font-semibold">
                    {pct}%
                  </div>
                </div>

                <div className="flex flex-col text-xs font-mono">
                  <span className="text-white font-medium">Rank #14,291</span>
                  <span className="text-slate-400">Top 8.4% of algorithm architects</span>
                </div>
              </div>
            </div>

            {/* Heatmap Grid */}
            <SubmissionHeatmap
              stats={submissionStats}
              isLoading={isLoadingSubStats}
              isError={isErrorSubStats}
              onRetry={refetchSubStats}
            />

            {/* Activity Feed */}
            <RecentActivityList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
