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

  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-slate-900 border-slate-800/80';
    if (count === 1) return 'bg-emerald-950 border-emerald-800/60 text-emerald-400';
    if (count <= 3) return 'bg-emerald-800/80 border-emerald-600/60 text-emerald-200';
    if (count <= 5) return 'bg-emerald-600 border-emerald-500 text-white';
    return 'bg-emerald-400 border-emerald-300 text-slate-950 shadow-sm shadow-emerald-400/50';
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md space-y-4">
      {/* Header Stat Line */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <span>
              <strong className="text-emerald-400 font-mono">
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
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
        >
          <option value="Current">Current Year</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Heatmap Grid Section */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center space-x-2 animate-pulse">
          <div className="h-24 w-full bg-slate-800/60 rounded-lg" />
        </div>
      ) : isError ? (
        <div className="py-8 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-xs text-slate-400">Failed to load submission heatmap</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto pt-2 pb-1">
          <div className="inline-block min-w-full">
            {/* Months Label Header Row */}
            <div className="flex text-[10px] text-slate-500 font-mono mb-2 pl-6 space-x-8">
              {monthLabels.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            {/* Heatmap Matrix: 7 rows (Sun-Sat), 52 cols */}
            <div className="flex gap-1.5">
              {/* Day Labels Column */}
              <div className="flex flex-col justify-between text-[10px] text-slate-500 font-mono py-0.5 pr-1">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Grid Weeks */}
              <div className="flex gap-1 flex-1">
                {weeks.map((week, wIdx) => (
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

            {/* Legend Footer */}
            <div className="flex items-center justify-end gap-2 mt-4 text-[11px] text-slate-400 font-mono">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-sm border border-slate-800 bg-slate-900" />
                <div className="h-3 w-3 rounded-sm border border-emerald-800/60 bg-emerald-950" />
                <div className="h-3 w-3 rounded-sm border border-emerald-600/60 bg-emerald-800/80" />
                <div className="h-3 w-3 rounded-sm border border-emerald-500 bg-emerald-600" />
                <div className="h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-400" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHeatmap;
