import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, XCircle, Clock, AlertTriangle, Play, Copy, Check } from 'lucide-react';
import { RecentSubmissionItem } from '../../types/profile';
import { Button } from '../ui/button';

interface SubmissionCodeModalProps {
  submission: RecentSubmissionItem | null;
  onClose: () => void;
}

export const SubmissionCodeModal: React.FC<SubmissionCodeModalProps> = ({
  submission,
  onClose,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!submission) return null;

  // Mock code snippet corresponding to the problem & language
  const getMockCode = (title: string, lang: string) => {
    if (lang.includes('Python')) {
      return `class Solution:
    def ${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}(self, nums: List[int], target: int) -> List[int]:
        hash_map = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in hash_map:
                return [hash_map[diff], i]
            hash_map[num] = i
        return []`;
    } else if (lang.includes('C++')) {
      return `#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (mp.count(comp)) return {mp[comp], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};`;
    } else {
      return `function solve(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
    }
  };

  const code = getMockCode(submission.problemTitle, submission.language);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-xs">
            <CheckCircle2 className="h-4 w-4" />
            Accepted
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold text-xs">
            <XCircle className="h-4 w-4" />
            Wrong Answer
          </span>
        );
      case 'Time Limit Exceeded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold text-xs">
            <Clock className="h-4 w-4" />
            Time Limit Exceeded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold text-xs">
            <AlertTriangle className="h-4 w-4" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{submission.problemTitle}</span>
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
              <span>{submission.language}</span>
              <span>•</span>
              <span>Submitted {submission.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(submission.status)}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Runtime / Memory Metrics Bar */}
        <div className="flex items-center gap-6 px-5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 text-xs font-mono">
          <div>
            <span className="text-slate-500">Runtime: </span>
            <span className="text-emerald-400 font-semibold">42 ms</span> (Beats 84.2%)
          </div>
          <div>
            <span className="text-slate-500">Memory: </span>
            <span className="text-indigo-400 font-semibold">16.4 MB</span> (Beats 72.1%)
          </div>
        </div>

        {/* Read-only Code View */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto bg-slate-950 font-mono text-sm relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="text-slate-200 leading-relaxed overflow-x-auto pt-2">
            <code>{code}</code>
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Close
          </Button>

          <Button
            onClick={() => {
              onClose();
              navigate(`/problems/${submission.problemId}`);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            <span>Open in Code Editor</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCodeModal;
