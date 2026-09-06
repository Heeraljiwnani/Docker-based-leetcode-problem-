import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Code2,
  ChevronRight,
} from 'lucide-react';
import { RecentSubmissionItem } from '../../types/profile';

interface SubmissionListItemProps {
  submission: RecentSubmissionItem;
  onClick: () => void;
}

export const SubmissionListItem: React.FC<SubmissionListItemProps> = ({
  submission,
  onClick,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Accepted
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold text-xs">
            <XCircle className="h-3.5 w-3.5" />
            Wrong Answer
          </span>
        );
      case 'Time Limit Exceeded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-xs">
            <Clock className="h-3.5 w-3.5" />
            Time Limit Exceeded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <tr
      onClick={onClick}
      className="group transition-colors cursor-pointer text-sm"
      style={{ borderBottom: '1px solid #2e2e2e' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#1e1e1e'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'; }}
    >
      {/* Status Badge */}
      <td className="py-3.5 px-4 w-44">
        {getStatusBadge(submission.status)}
      </td>

      {/* Problem Title */}
      <td className="py-3.5 px-4">
        <span className="font-semibold text-on-surface transition-colors group-hover:text-primary">
          {submission.problemTitle}
        </span>
      </td>

      {/* Language */}
      <td className="py-3.5 px-4 w-36">
        <span className="inline-flex items-center gap-1 font-mono text-xs text-on-surface-variant px-2 py-0.5 rounded" style={{ backgroundColor: '#252525', border: '1px solid #333' }}>
          <Code2 className="h-3 w-3 text-on-surface-variant" />
          {submission.language}
        </span>
      </td>

      {/* Submitted Timestamp */}
      <td className="py-3.5 px-4 w-36 font-mono text-xs text-on-surface-variant">
        {submission.timestamp}
      </td>

      {/* Code Viewer Action */}
      <td className="py-3.5 px-4 w-28 text-right">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-all">
          View Code
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </td>
    </tr>
  );
};

export default SubmissionListItem;
