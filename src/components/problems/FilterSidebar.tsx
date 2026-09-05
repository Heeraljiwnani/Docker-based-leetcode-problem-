import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Difficulty } from '../../types/problem';

interface FilterSidebarProps {
  selectedDifficulty: Difficulty | 'All';
  onSelectDifficulty: (difficulty: Difficulty | 'All') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  availableTags?: string[];
  countsByDifficulty?: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  selectedTag,
  onSelectTag,
  availableTags = [
    'Array',
    'String',
    'Hash Table',
    'Dynamic Programming',
    'Math',
    'Two Pointers',
    'Binary Search',
    'Tree',
    'Stack',
    'Linked List',
  ],
  countsByDifficulty = { all: 16, easy: 5, medium: 8, hard: 3 },
}) => {
  const difficulties: { label: string; value: Difficulty | 'All'; count: number; colorClass: string }[] = [
    { label: 'All', value: 'All', count: countsByDifficulty.all, colorClass: 'hover:bg-slate-800 text-slate-200' },
    { label: 'Easy', value: 'Easy', count: countsByDifficulty.easy, colorClass: 'hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { label: 'Medium', value: 'Medium', count: countsByDifficulty.medium, colorClass: 'hover:bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { label: 'Hard', value: 'Hard', count: countsByDifficulty.hard, colorClass: 'hover:bg-rose-500/10 text-rose-400 border-rose-500/20' },
  ];

  const handleReset = () => {
    onSelectDifficulty('All');
    onSelectTag(null);
  };

  const isFiltered = selectedDifficulty !== 'All' || selectedTag !== null;

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        {/* Filter Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Filter className="h-4 w-4 text-indigo-400" />
            <span>Filters</span>
          </div>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Difficulty Section */}
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Difficulty
          </h4>

          <div className="space-y-1">
            {difficulties.map((diff) => {
              const isSelected = selectedDifficulty === diff.value;
              return (
                <button
                  key={diff.value}
                  onClick={() => onSelectDifficulty(diff.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        diff.value === 'Easy'
                          ? 'bg-emerald-400'
                          : diff.value === 'Medium'
                          ? 'bg-amber-400'
                          : diff.value === 'Hard'
                          ? 'bg-rose-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                    <span>{diff.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {diff.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Tags Section */}
        {availableTags.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Topics & Tags
              </h4>
              <Sparkles className="h-3 w-3 text-slate-500" />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => onSelectTag(isSelected ? null : tag)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
