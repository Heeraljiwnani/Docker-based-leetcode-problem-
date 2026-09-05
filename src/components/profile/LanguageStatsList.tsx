import React from 'react';
import { Code2, AlertCircle, RefreshCw } from 'lucide-react';
import { LanguageStat } from '../../types/profile';

interface LanguageStatsListProps {
  stats?: LanguageStat[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const LanguageStatsList: React.FC<LanguageStatsListProps> = ({
  stats = [],
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const maxCount = Math.max(...stats.map((s) => s.solvedCount), 1);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-slate-200">
        <Code2 className="h-4 w-4 text-indigo-400" />
        <span>Languages Used</span>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <div className="h-3.5 w-20 bg-slate-800 rounded" />
                <div className="h-3.5 w-12 bg-slate-800 rounded" />
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-4 text-center space-y-2">
          <AlertCircle className="h-5 w-5 text-rose-400 mx-auto" />
          <p className="text-xs text-slate-400">Failed to load language stats</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          )}
        </div>
      ) : stats.length === 0 ? (
        <p className="text-xs text-slate-500 py-3 text-center italic">
          No languages used yet
        </p>
      ) : (
        <div className="space-y-3 pt-1">
          {stats.map((item) => {
            const percentage = Math.round((item.solvedCount / maxCount) * 100);
            return (
              <div key={item.language} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.language}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{item.solvedCount}</strong> solved
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageStatsList;
