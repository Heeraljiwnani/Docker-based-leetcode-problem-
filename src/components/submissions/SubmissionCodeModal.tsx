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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs" style={{ backgroundColor: 'rgba(132, 204, 22, 0.15)', color: '#84cc16', border: '1px solid rgba(132, 204, 22, 0.3)' }}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.85)' }}>
      <div className="w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5" style={{ backgroundColor: '#111', borderBottom: '1px solid #2e2e2e' }}>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Doppio One', sans-serif" }}>
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors hover:bg-surface-container"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Runtime / Memory Metrics Bar */}
        <div className="flex items-center gap-6 px-5 py-2.5 text-xs font-mono" style={{ backgroundColor: '#111', borderBottom: '1px solid #2e2e2e' }}>
          <div>
            <span className="text-slate-500">Runtime: </span>
            <span className="font-semibold" style={{ color: '#84cc16' }}>42 ms</span> (Beats 84.2%)
          </div>
          <div>
            <span className="text-slate-500">Memory: </span>
            <span className="font-semibold text-white">16.4 MB</span> (Beats 72.1%)
          </div>
        </div>

        {/* Read-only Code View */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto font-mono text-sm relative" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-300 hover:text-white text-xs transition-colors"
              style={{ backgroundColor: '#252525', border: '1px solid #333' }}
            >
              {copied ? <Check className="h-3.5 w-3.5" style={{ color: '#84cc16' }} /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="text-slate-200 leading-relaxed overflow-x-auto pt-2">
            <code>{code}</code>
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#111', borderTop: '1px solid #2e2e2e' }}>
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
            className="font-semibold flex items-center gap-2 shadow-md"
            style={{ backgroundColor: '#84cc16', color: '#0a0a0a' }}
          >
            <Play className="h-4 w-4 fill-[#0a0a0a]" />
            <span>Open in Code Editor</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCodeModal;
