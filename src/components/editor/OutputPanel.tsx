import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Terminal } from 'lucide-react';
import { RunResult } from '../../hooks/useRunCode';
import { SubmitResult } from '../../hooks/useSubmitCode';

interface OutputPanelProps {
  runResult: RunResult | null;
  submitResult: SubmitResult | null;
  activeTab: 'testcase' | 'result';
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  runResult,
  submitResult,
  activeTab,
}) => {
  const getSubmitVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'Accepted':
        return (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-bold">
            <CheckCircle2 className="h-5 w-5" />
            <span>Accepted</span>
          </div>
        );
      case 'Wrong Answer':
        return (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg font-bold">
            <XCircle className="h-5 w-5" />
            <span>Wrong Answer</span>
          </div>
        );
      case 'Time Limit Exceeded':
        return (
          <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg font-bold">
            <Clock className="h-5 w-5" />
            <span>Time Limit Exceeded</span>
          </div>
        );
      case 'Compilation Error':
        return (
          <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg font-bold">
            <AlertTriangle className="h-5 w-5" />
            <span>Compilation Error</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg font-bold">
            <AlertTriangle className="h-5 w-5" />
            <span>Runtime Error</span>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-slate-950 p-4 border-t border-slate-800 text-xs font-mono overflow-y-auto space-y-4">
      {/* Submission Verdict View */}
      {submitResult ? (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            {getSubmitVerdictBadge(submitResult.verdict)}

            <div className="text-slate-400">
              Passed:{' '}
              <span className="text-white font-bold">
                {submitResult.passedTestCases}/{submitResult.totalTestCases}
              </span>{' '}
              testcases
            </div>
          </div>

          {submitResult.runtimeMs && (
            <div className="flex gap-6 text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500">Runtime: </span>
                <span className="text-emerald-400 font-bold">{submitResult.runtimeMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500">Memory: </span>
                <span className="text-indigo-400 font-bold">{submitResult.memoryMb} MB</span>
              </div>
            </div>
          )}

          {submitResult.stdout && (
            <div className="space-y-1">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Terminal className="h-3.5 w-3.5 text-slate-500" /> Standard Output:
              </span>
              <pre className="p-3 rounded bg-slate-900 text-slate-300 border border-slate-800 whitespace-pre-wrap">
                {submitResult.stdout}
              </pre>
            </div>
          )}

          {submitResult.stderr && (
            <div className="space-y-1">
              <span className="text-rose-400 font-bold">Error Stacktrace:</span>
              <pre className="p-3 rounded bg-rose-950/30 text-rose-300 border border-rose-800/40 whitespace-pre-wrap">
                {submitResult.stderr}
              </pre>
            </div>
          )}
        </div>
      ) : runResult ? (
        /* Sample Test Cases Run Results */
        <div className="space-y-3 animate-in fade-in-50">
          <div className="flex items-center gap-2">
            {runResult.passed ? (
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Sample Tests Passed
              </span>
            ) : (
              <span className="text-rose-400 font-bold text-sm flex items-center gap-1">
                <XCircle className="h-4 w-4" /> Sample Tests Failed
              </span>
            )}
          </div>

          <div className="space-y-3">
            {runResult.testResults.map((test, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2"
              >
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Case {idx + 1}</span>
                  <span
                    className={
                      test.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                    }
                  >
                    {test.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500">Input: </span>
                  <span className="text-slate-200">{test.input}</span>
                </div>

                <div>
                  <span className="text-slate-500">Expected: </span>
                  <span className="text-emerald-400">{test.expectedOutput}</span>
                </div>

                <div>
                  <span className="text-slate-500">Actual: </span>
                  <span className={test.passed ? 'text-emerald-400' : 'text-rose-400'}>
                    {test.actualOutput}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default Instructions */
        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
          <Terminal className="h-6 w-6 text-slate-600 mb-1" />
          <p>Click "Run" to test sample inputs, or "Submit" to submit against all test cases.</p>
        </div>
      )}
    </div>
  );
};

export default OutputPanel;
