import React, { useState, useMemo } from 'react';
import { Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { SubmissionStats } from '../../types/profile';

interface SubmissionHeatmapProps {
  stats?: SubmissionStats;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({
  stats,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const [selectedYear, setSelectedYear] = useState<'Current' | '2025'>('Current');

  // Build grid of 52 weeks (364 days) leading up to today
  const weeks = useMemo(() => {
    const result: { dateStr: string; count: number; dayOfWeek: number }[][] = [];
    const today = new Date();
    const dailyMap = stats?.dailyCounts || {};

    // Start 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 363);

    // Adjust to Sunday
    const day = startDate.getDay();
    startDate.setDate(startDate.getDate() - day);

    let currentWeek: { dateStr: string; count: number; dayOfWeek: number }[] = [];
    const iterDate = new Date(startDate);

    for (let i = 0; i < 52 * 7; i++) {
      const dateStr = iterDate.toISOString().split('T')[0];
      const count = dailyMap[dateStr] || 0;
      const dayOfWeek = iterDate.getDay();

      currentWeek.push({ dateStr, count, dayOfWeek });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }

      iterDate.setDate(iterDate.getDate() + 1);
    }

    return result;
  }, [stats?.dailyCounts]);

  // Group weeks into month blocks with gaps
  const monthBlocks = useMemo(() => {
    const blocks: { monthName: string; weeks: { dateStr: string; count: number; dayOfWeek: number }[][] }[] = [];

    weeks.forEach((week) => {
      // Use the middle/first day of the week to determine month
      const sampleDate = new Date(week[0].dateStr);
      const monthName = sampleDate.toLocaleString('en-US', { month: 'short' });

      let currentBlock = blocks[blocks.length - 1];
      if (!currentBlock || currentBlock.monthName !== monthName) {
        currentBlock = { monthName, weeks: [] };
        blocks.push(currentBlock);
      }
      currentBlock.weeks.push(week);
    });

    return blocks;
  }, [weeks]);

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-[#111] border-[#2e2e2e]';
    if (count === 1) return 'bg-[#1a3a1a] border-[#2d5a2d] text-[#84cc16]';
    if (count <= 3) return 'bg-[#365314] border-[#4d7c0f] text-[#d9f99d]';
    if (count <= 5) return 'bg-[#4d7c0f] border-[#65a30d] text-white';
    return 'bg-[#84cc16] border-[#a3e635] text-[#0a0a0a] shadow-sm';
  };

  return (
    <div className="rounded-xl p-4 sm:p-6 space-y-4" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
      {/* Header Stat Line */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid #2e2e2e' }}>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Doppio One', sans-serif" }}>
            <Calendar className="h-4 w-4" style={{ color: '#84cc16' }} />
            <span>
              <strong className="font-mono" style={{ color: '#84cc16' }}>
                {stats?.totalSubmissions ?? 0}
              </strong>{' '}
              submissions in the past one year
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total active days:{' '}
            <span className="text-slate-200 font-semibold">{stats?.activeDaysCount ?? 0}</span>
            {' • '}
            Max streak:{' '}
            <span className="text-amber-400 font-semibold">{stats?.maxStreak ?? 0} days</span>
          </p>
        </div>

        {/* Year Selector Dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value as 'Current' | '2025')}
          className="text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-mono cursor-pointer"
          style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}
        >
          <option value="Current">Current Year</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Heatmap Grid Section */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center space-x-2 animate-pulse">
          <div className="h-24 w-full rounded-lg" style={{ backgroundColor: '#111' }} />
        </div>
      ) : isError ? (
        <div className="py-8 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-xs text-slate-400">Failed to load submission heatmap</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs font-medium"
              style={{ color: '#84cc16' }}
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto pt-2 pb-1">
          <div className="inline-block min-w-full">
            <div className="flex gap-2">
              {/* Day Labels Column */}
              <div className="flex flex-col justify-between text-[10px] text-slate-500 font-mono pt-5 pb-0.5 pr-2 select-none">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Month Blocks Container with gaps between months */}
              <div className="flex gap-2.5">
                {monthBlocks.map((block, bIdx) => (
                  <div key={bIdx} className="flex flex-col gap-1.5">
                    {/* Month Label Header */}
                    <span className="text-[10px] text-slate-400 font-mono font-semibold h-3.5 leading-3.5 tracking-wide">
                      {block.monthName}
                    </span>
                    {/* Weeks Columns for this Month */}
                    <div className="flex gap-1">
                      {block.weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-1">
                          {week.map((day) => (
                            <div
                              key={day.dateStr}
                              title={`${day.count} submission${day.count === 1 ? '' : 's'} on ${day.dateStr}`}
                              className={`h-3 w-3 rounded-sm border transition-transform hover:scale-125 hover:z-10 cursor-pointer ${getCellColor(
                                day.count
                              )}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHeatmap;
