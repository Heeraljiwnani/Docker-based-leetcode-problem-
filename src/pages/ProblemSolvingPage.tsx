import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useBoilerplate } from '../hooks/useBoilerplate';
import { useDraft } from '../hooks/useDraft';
import { useRunCode } from '../hooks/useRunCode';
import { useSubmitCode } from '../hooks/useSubmitCode';

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Timer,
  Play,
  Send,
  RotateCcw,
  Loader2,
  Check,
  Terminal,
  FileCode,
  Cpu,
  BadgeCheck,
} from 'lucide-react';

export const ProblemSolvingPage: React.FC = () => {
  const { id = '1' } = useParams<{ id: string }>();

  const [language, setLanguage] = useState<string>('ts');
  const [code, setCode] = useState<string>('');
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'editorial' | 'runs'>('description');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'results' | 'logs' | 'diag'>('results');
  const [activeTestCase, setActiveTestCase] = useState<number>(1);
  const [tcNums, setTcNums] = useState('[2, 7, 11, 15]');
  const [tcTarget, setTcTarget] = useState('9');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const { boilerplate } = useBoilerplate(id, language);
  const { draft, saveStatus, saveDraft } = useDraft(id, language);
  const { runCode, isRunning, result: runResult } = useRunCode();
  const { submitCode, isSubmitting, result: submitResult } = useSubmitCode();

  useEffect(() => {
    if (draft !== null) {
      setCode(draft);
    } else if (boilerplate) {
      setCode(boilerplate);
    } else {
      setCode(`// Complexity: O(n) Time | O(n) Memory Space
function twoSum(nums: number[], target: number): number[] {
    const numMap = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement)!, i];
        }
        numMap.set(nums[i], i);
    }

    return []; // No solution found matching invariants
}`);
    }
  }, [draft, boilerplate, language]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    saveDraft(val);
  };

  const handleReset = () => {
    if (boilerplate) {
      setCode(boilerplate);
      saveDraft(boilerplate);
    }
  };

  const handleRun = () => {
    setActiveConsoleTab('results');
    runCode(id, language, code);
  };

  const handleSubmit = () => {
    setActiveConsoleTab('results');
    submitCode(id, language, code);
  };

  const handleTestCaseSwitch = (caseId: number) => {
    setActiveTestCase(caseId);
    if (caseId === 1) {
      setTcNums('[2, 7, 11, 15]');
      setTcTarget('9');
    } else if (caseId === 2) {
      setTcNums('[3, 2, 4]');
      setTcTarget('6');
    } else {
      setTcNums('[3, 3]');
      setTcTarget('6');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-hidden select-none">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <main className="w-full pt-14 bg-slate-950 flex flex-col h-screen overflow-hidden">
        {/* Workspace Telemetry Bar */}
        <div className="h-10 w-full bg-slate-900 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 border-b border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-3">
            <Link
              to="/problems"
              className="flex items-center gap-1.5 text-white hover:text-cyan-400 transition-colors font-bold"
            >
              <ArrowLeft className="h-4 w-4 stroke-[3] text-cyan-400" />
              <span className="font-bold text-white font-sans text-sm">Problems</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-sans text-sm">
                Two Sum
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold uppercase">
                Easy
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-xs ml-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Solved</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>Avg: <strong className="text-white">52ms</strong></span>
              </div>
              <span>•</span>
              <div>
                <span>Acceptance: <strong className="text-white">52.4%</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleTimer}
                title={isTimerRunning ? 'Pause Stopwatch' : 'Start Stopwatch'}
                className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Timer className={`h-3.5 w-3.5 ${isTimerRunning ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="font-mono text-xs">{formatTimer(timerSeconds)}</span>
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                title="Reset Stopwatch to 00:00"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Split Panels */}
        <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden relative">
          {/* LEFT PANE: Description & Testcases */}
          <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col bg-slate-900 border-r border-slate-800 overflow-hidden h-full">
            {/* Tabs */}
            <div className="h-9 bg-slate-950 flex items-center px-2 justify-between flex-shrink-0 border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveLeftTab('description')}
                  className={`px-3 py-1.5 rounded-t flex items-center gap-1.5 font-medium transition-colors ${
                    activeLeftTab === 'description'
                      ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Description</span>
                </button>
              </div>
            </div>

            {/* Description Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    1. Two Sum
                  </h1>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      Array
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      Hash Table
                    </span>
                  </div>
                </div>

                <p>
                  Given an array of integers{' '}
                  <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs">
                    nums
                  </code>{' '}
                  and an integer{' '}
                  <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs">
                    target
                  </code>
                  , return <em>indices of the two numbers such that they add up to target</em>.
                </p>
                <p>
                  You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
                </p>
              </div>

              {/* Algorithmic Complexity Target Card */}
              <div className="p-4 rounded-xl bg-slate-950 flex flex-col gap-2 border border-slate-800 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider text-[11px]">
                    Complexity Target
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    Optimal: O(n) Time / O(n) Space
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-1">
                    <span className="text-slate-500">Brute-Force</span>
                    <span className="text-rose-400 font-semibold">O(n²) Time</span>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-rose-500 w-full" />
                    </div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-1">
                    <span className="text-slate-500">Sort + 2-Ptr</span>
                    <span className="text-purple-400 font-semibold">O(n log n)</span>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-purple-400 w-3/5" />
                    </div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-cyan-500/40 flex flex-col gap-1 shadow-sm">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      Hash Map <BadgeCheck className="h-3 w-3 text-emerald-400" />
                    </span>
                    <span className="text-emerald-400 font-semibold">O(n) Linear</span>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-emerald-400 w-1/4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="space-y-4 font-mono text-xs">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span>Examples</span>
                </h2>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-cyan-400 font-semibold">
                    <span>Example 1</span>
                    <span className="text-slate-500 text-[11px]">Base Case</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div><span className="text-slate-500">Input:</span> nums = [2,7,11,15], target = 9</div>
                    <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400 font-bold">[0,1]</span></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-cyan-400 font-semibold">
                    <span>Example 2</span>
                    <span className="text-slate-500 text-[11px]">Duplicates</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div><span className="text-slate-500">Input:</span> nums = [3,2,4], target = 6</div>
                    <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400 font-bold">[1,2]</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Case Inspector Dock */}
            <div className="bg-slate-950 flex flex-col flex-shrink-0 h-44 border-t border-slate-800 font-mono text-xs">
              <div className="h-8 bg-slate-900 flex items-center justify-between px-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <Play className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Testcases</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTestCaseSwitch(1)}
                    className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                      activeTestCase === 1
                        ? 'bg-slate-800 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Case 1</span>
                  </button>
                  <button
                    onClick={() => handleTestCaseSwitch(2)}
                    className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                      activeTestCase === 2
                        ? 'bg-slate-800 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Case 2</span>
                  </button>
                </div>
              </div>

              <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-500 uppercase">nums =</label>
                  <input
                    type="text"
                    value={tcNums}
                    onChange={(e) => setTcNums(e.target.value)}
                    className="w-full bg-slate-900 px-2.5 py-1 rounded text-white font-mono border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-500 uppercase">target =</label>
                  <input
                    type="text"
                    value={tcTarget}
                    onChange={(e) => setTcTarget(e.target.value)}
                    className="w-full bg-slate-900 px-2.5 py-1 rounded text-white font-mono border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Draggable Splitter Handle */}
          <div className="hidden lg:flex w-1 bg-slate-950 hover:bg-cyan-500 transition-colors cursor-col-resize items-center justify-center group z-30">
            <div className="w-0.5 h-8 rounded-full bg-slate-700 group-hover:bg-cyan-400" />
          </div>

          {/* RIGHT PANE: Code Editor & Execution */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden h-full">
            {/* Editor Toolbar */}
            <div className="h-9 bg-slate-900 flex items-center justify-between px-3 border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded cursor-pointer border border-outline-variant focus:outline-none font-code-sm text-code-sm"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="py3">Python3</option>
                  <option value="py">Python</option>
                  <option value="js">JavaScript</option>
                  <option value="ts">TypeScript</option>
                  <option value="cs">C#</option>
                  <option value="c">C</option>
                  <option value="go">Go</option>
                  <option value="kt">Kotlin</option>
                  <option value="swift">Swift</option>
                  <option value="rust">Rust</option>
                  <option value="rb">Ruby</option>
                  <option value="php">PHP</option>
                  <option value="dart">Dart</option>
                  <option value="scala">Scala</option>
                  <option value="ex">Elixir</option>
                  <option value="erl">Erlang</option>
                  <option value="rkt">Racket</option>
                </select>

                <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{saveStatus === 'saving' ? 'Saving...' : 'Saved 12s ago'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Reset code"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Breadcrumbs Path */}
            <div className="h-6 bg-slate-950 px-3 flex items-center gap-1 font-mono text-[11px] text-slate-500 border-b border-slate-800/60">
              <span className="text-slate-400">workspace</span>
              <span>›</span>
              <span className="text-slate-400">solutions</span>
              <span>›</span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <FileCode className="h-3 w-3 text-cyan-400" />
                two_sum.{language}
              </span>
            </div>

            {/* Code Content Area */}
            <div className="flex-1 p-3 bg-slate-950 relative overflow-hidden font-mono text-xs">
              <textarea
                value={code}
                onChange={handleCodeChange}
                spellCheck={false}
                className="w-full h-full bg-transparent text-slate-100 resize-none focus:outline-none leading-relaxed selection:bg-cyan-500/30 selection:text-cyan-300"
              />
            </div>

            {/* Console Output Drawer */}
            <div className="h-48 bg-slate-900 flex flex-col flex-shrink-0 border-t border-slate-800 font-mono text-xs">
              <div className="h-8 bg-slate-950 flex items-center justify-between px-3 border-b border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveConsoleTab('results')}
                    className={`px-3 py-1 font-medium flex items-center gap-1.5 rounded-t ${
                      activeConsoleTab === 'results'
                        ? 'bg-slate-900 text-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Test Results</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">Memory: 44.2 MB</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-semibold">Runtime: 48 ms</span>
                </div>
              </div>

              {/* Console Output View */}
              <div className="flex-1 p-3 overflow-y-auto">
                {submitResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {submitResult.verdict.toUpperCase()}
                      </span>
                      <span className="text-white font-semibold">
                        All {submitResult.passedTestCases}/{submitResult.totalTestCases} Testcases Passed
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Executed inside Isolated Linux Docker Container</p>
                  </div>
                ) : runResult ? (
                  <div className="space-y-1.5">
                    <span className="text-emerald-400 font-bold">Sample Tests Passed</span>
                    {runResult.testResults.map((r, i) => (
                      <div key={i} className="text-slate-300 text-xs">
                        Case {i + 1}: Input {r.input} → Expected {r.expectedOutput}, Actual {r.actualOutput}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 py-2">
                    Click "Run" to test sample inputs, or "Submit" to judge solution.
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="h-12 bg-slate-950 px-3 flex items-center justify-end flex-shrink-0 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
                  >
                    {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-white" />}
                    <span>Run</span>
                    <kbd className="hidden md:inline-block px-1 rounded bg-slate-900 text-[10px] text-slate-400 ml-1">
                      ⌘↵
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSolvingPage;
