import React from 'react';
import { Zap, Trophy, Calendar as CalendarIcon, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { StreakData } from '../../types/problem';

interface StreakCalendarProps {
  streak?: StreakData;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  streak,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate calendar grid days for current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const activeDaySet = new Set(streak?.activeDays || []);

  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Calendar Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <CalendarIcon className="h-4 w-4 text-indigo-400" />
            <span>{monthNames[currentMonth]} {currentYear}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Daily Check-in</span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-8 space-y-3 animate-pulse">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="h-7 w-7 rounded-md bg-slate-800 mx-auto" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="py-6 text-center space-y-2">
            <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
            <p className="text-xs text-slate-400">Failed to load streak calendar</p>
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
          <div className="mt-4">
            {/* Day Header Row */}
            <div className="grid grid-cols-7 text-center mb-2">
              {dayHeaders.map((day, idx) => (
                <span key={idx} className="text-xs font-semibold text-slate-500">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-7 w-7" />
              ))}

              {/* Month Days */}
              {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateObj = new Date(currentYear, currentMonth, dayNum);
                const dateStr = dateObj.toISOString().split('T')[0];
                const isToday = dayNum === today.getDate();
                const isActive = activeDaySet.has(dateStr);

                return (
                  <div
                    key={dayNum}
                    title={
                      isActive
                        ? `${dateStr}: Problem solved!`
                        : isToday
                        ? 'Today'
                        : `${dateStr}`
                    }
                    className={`h-7 w-7 rounded-md mx-auto flex items-center justify-center text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm shadow-emerald-500/20'
                        : isToday
                        ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {isActive ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      dayNum
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Streak Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Streak */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current</span>
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">
              {streak?.currentStreak ?? 0}
            </span>
            <span className="text-xs text-amber-400 font-medium">days</span>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Longest</span>
            <Trophy className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">
              {streak?.longestStreak ?? 0}
            </span>
            <span className="text-xs text-indigo-400 font-medium">days</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StreakCalendar;
