import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CodeEditor from '../components/editor/CodeEditor';
import { useBoilerplate } from '../hooks/useBoilerplate';
import { useDraft } from '../hooks/useDraft';
import { useRunCode } from '../hooks/useRunCode';
import { useSubmitCode } from '../hooks/useSubmitCode';
import { getProblemById, SEED_PROBLEMS } from '../data/problemsData';

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Timer,
  Play,
  Send,
  RotateCcw,
  Loader2,
  Terminal,
  FileCode,
  Cpu,
  BadgeCheck,
  GripVertical,
  GripHorizontal,
  Lightbulb,
} from 'lucide-react';

export const ProblemSolvingPage: React.FC = () => {
  const { id = '1' } = useParams<{ id: string }>();

  // Fetch current problem details dynamically
  const problem = getProblemById(id) || SEED_PROBLEMS[0];

  const [language, setLanguage] = useState<string>('cpp');
  const [code, setCode] = useState<string>('');
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'hints'>('description');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'results' | 'logs' | 'diag'>('results');
  const [activeTestCase, setActiveTestCase] = useState<number>(1);
  const [tcInput, setTcInput] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Update testcase input state when problem or active testcase changes
  useEffect(() => {
    if (problem.testcases && problem.testcases.length > 0) {
      const tc = problem.testcases[activeTestCase - 1] || problem.testcases[0];
      setTcInput(tc.input);
    } else {
      setTcInput(problem.examples || '');
    }
  }, [problem, activeTestCase]);

  // Resizable Panes State
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(45); // percentage width
  const [consoleHeight, setConsoleHeight] = useState<number>(220); // pixel height
  const [isDraggingVertical, setIsDraggingVertical] = useState<boolean>(false);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Drag listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingVertical && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidthPx = e.clientX - containerRect.left;
        const newWidthPct = (newWidthPx / containerRect.width) * 100;
        const clampedPct = Math.min(Math.max(newWidthPct, 20), 75);
        setLeftPanelWidth(clampedPct);
      }

      if (isDraggingHorizontal && rightPanelRef.current) {
        const rightRect = rightPanelRef.current.getBoundingClientRect();
        const newHeightPx = rightRect.bottom - e.clientY;
        const clampedHeight = Math.min(Math.max(newHeightPx, 80), 600);
        setConsoleHeight(clampedHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingVertical(false);
      setIsDraggingHorizontal(false);
    };

    if (isDraggingVertical || isDraggingHorizontal) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDraggingVertical ? 'col-resize' : 'row-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDraggingVertical, isDraggingHorizontal]);

  // Timer logic
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

  const { boilerplate } = useBoilerplate(problem.id, language);
  const { draft, draftLoaded, saveStatus, saveDraft } = useDraft(problem.id, language);
  const { runCode, isRunning, result: runResult } = useRunCode();
  const { submitCode, isSubmitting, result: submitResult } = useSubmitCode();

  // Set initial code: wait until draft fetch is complete AND boilerplate is ready
  useEffect(() => {
    if (!draftLoaded || !boilerplate) return; // not ready yet
    if (draft !== null && draft.trim() !== '') {
      setCode(draft);
    } else {
      setCode(boilerplate);
    }
  }, [draftLoaded, draft, boilerplate, language]);

  const handleReset = () => {
    if (boilerplate) {
      setCode(boilerplate);
      saveDraft(boilerplate);
    }
  };

  const handleRun = () => {
    setActiveConsoleTab('results');
    runCode(problem.id, language, code);
  };

  const handleSubmit = () => {
    setActiveConsoleTab('results');
    submitCode(problem.id, language, code);
  };

  return (
    <div className="min-h-screen text-on-surface flex flex-col font-sans antialiased overflow-hidden select-none" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <main className="w-full pt-14 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Workspace Telemetry Bar */}
        <div className="h-10 w-full flex items-center justify-between px-4 sm:px-6 flex-shrink-0 font-mono text-xs" style={{ backgroundColor: '#111', borderBottom: '1px solid #2e2e2e' }}>
          <div className="flex items-center gap-3">
            <Link
              to="/problems"
              className="flex items-center gap-1.5 transition-colors font-bold hover:opacity-80"
              style={{ color: '#84cc16' }}
            >
              <ArrowLeft className="h-4 w-4 stroke-[3]" style={{ color: '#84cc16' }} />
              <span className="font-bold text-white font-sans text-sm">Problems</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-sans text-sm" style={{ fontFamily: "'Doppio One', sans-serif" }}>
                {problem.title}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                style={
                  problem.difficulty === 'Easy'
                    ? { backgroundColor: 'rgba(132, 204, 22, 0.15)', color: '#84cc16', border: '1px solid rgba(132, 204, 22, 0.3)' }
                    : problem.difficulty === 'Medium'
                    ? { backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }
                    : { backgroundColor: 'rgba(248, 113, 113, 0.15)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)' }
                }
              >
                {problem.difficulty}
              </span>
              {problem.solved && (
                <span className="flex items-center gap-1 text-xs ml-1" style={{ color: '#84cc16' }}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Solved</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-slate-400" style={{ fontFamily: "'Roboto Condensed', 'Lexend Deca', sans-serif" }}>
              <div className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" style={{ color: '#84cc16' }} />
                <span>Avg: <strong className="text-white">48ms</strong></span>
              </div>
              <span>•</span>
              <div>
                <span>Acceptance: <strong className="text-white">{problem.acceptanceRate ?? 50}%</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleTimer}
                title={isTimerRunning ? 'Pause Stopwatch' : 'Start Stopwatch'}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'text-slate-300 hover:text-white'
                }`}
                style={!isTimerRunning ? { backgroundColor: '#252525', border: '1px solid #333' } : { border: '1px solid rgba(245, 158, 11, 0.3)' }}
              >
                <Timer className={`h-3.5 w-3.5 ${isTimerRunning ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="font-mono text-xs">{formatTimer(timerSeconds)}</span>
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                title="Reset Stopwatch to 00:00"
                className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                style={{ backgroundColor: '#252525', border: '1px solid #333' }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Split Panels */}
        <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden relative">
          {/* LEFT PANE: Description, Editorial, Hints & Testcases */}
          <div
            className="w-full lg:h-full flex flex-col overflow-hidden"
            style={{
              width: `${leftPanelWidth}%`,
              backgroundColor: '#1c1c1c',
              borderRight: '1px solid #2e2e2e',
            }}
          >
            {/* Tabs */}
            <div className="h-9 flex items-center px-2 justify-between flex-shrink-0 text-xs" style={{ backgroundColor: '#111', borderBottom: '1px solid #2e2e2e', fontFamily: "'Roboto Condensed', 'Lexend Deca', sans-serif" }}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveLeftTab('description')}
                  className="px-3 py-1.5 rounded-t flex items-center gap-1.5 font-medium transition-colors"
                  style={activeLeftTab === 'description' ? { backgroundColor: '#1c1c1c', borderTop: '2px solid #84cc16', color: '#84cc16' } : { color: '#a0a0a0' }}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Description</span>
                </button>


                {problem.hints && (
                  <button
                    onClick={() => setActiveLeftTab('hints')}
                    className="px-3 py-1.5 rounded-t flex items-center gap-1.5 font-medium transition-colors"
                    style={activeLeftTab === 'hints' ? { backgroundColor: '#1c1c1c', borderTop: '2px solid #84cc16', color: '#84cc16' } : { color: '#a0a0a0' }}
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Hints</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="font-exclude flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
              {activeLeftTab === 'description' && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Doppio One', sans-serif" }}>
                        {problem.title}
                      </h1>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        {problem.tags?.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded" style={{ backgroundColor: '#252525', color: '#84cc16', border: '1px solid #333' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-200 leading-relaxed font-sans text-base">
                      {problem.statement}
                    </p>

                    {problem.constraints && (
                      <div className="mt-3 p-3 rounded-lg font-mono text-xs" style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}>
                        <span className="text-slate-500 uppercase font-semibold text-[10px] block mb-1">Constraints</span>
                        <code style={{ color: '#84cc16' }}>{problem.constraints}</code>
                      </div>
                    )}
                  </div>

                  {/* Company Tags */}
                  {problem.companyTags && problem.companyTags.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-500 uppercase font-mono font-semibold">Companies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.companyTags.map((company) => (
                          <span key={company} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#252525', color: '#a0a0a0', border: '1px solid #333' }}>
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  {problem.examples && (
                    <div className="space-y-4 font-mono text-xs pt-2">
                      <h2 className="text-sm font-bold text-white flex items-center gap-2 font-sans" style={{ fontFamily: "'Doppio One', sans-serif" }}>
                        <Terminal className="h-4 w-4" style={{ color: '#84cc16' }} />
                        <span>Example</span>
                      </h2>

                      <div className="p-3.5 rounded-xl space-y-2" style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}>
                        <div className="text-slate-300 font-mono text-xs">
                          {problem.examples}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeLeftTab === 'hints' && (
                <div className="space-y-4 font-sans">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Doppio One', sans-serif" }}>
                    <Lightbulb className="h-4 w-4" style={{ color: '#fbbf24' }} />
                    <span>Problem Hint</span>
                  </h2>
                  <div className="p-4 rounded-xl space-y-3 leading-relaxed text-amber-300 text-sm" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                    <p>{problem.hints}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Test Case Inspector Dock */}
            <div className="flex flex-col flex-shrink-0 h-44 text-xs" style={{ backgroundColor: '#111', borderTop: '1px solid #2e2e2e', fontFamily: "'Roboto Condensed', 'Lexend Deca', sans-serif" }}>
              <div className="h-8 flex items-center justify-between px-3" style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #2e2e2e' }}>
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <Play className="h-3.5 w-3.5" style={{ color: '#84cc16' }} />
                  <span>Testcases</span>
                </div>
                <div className="flex items-center gap-1">
                  {(problem.testcases || []).map((tc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestCase(idx + 1)}
                      className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                        activeTestCase === idx + 1
                          ? 'font-bold'
                          : 'text-slate-400 hover:bg-surface-container'
                      }`}
                      style={activeTestCase === idx + 1 ? { backgroundColor: '#252525', color: '#84cc16' } : {}}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#84cc16' }} />
                      <span>Case {idx + 1} {tc.is_hidden ? '(Hidden)' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-500 uppercase">Input =</label>
                  <input
                    type="text"
                    value={tcInput}
                    onChange={(e) => setTcInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded text-white font-mono focus:outline-none"
                    style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VERTICAL DRAGGABLE SPLITTER HANDLE */}
          <div
            onMouseDown={() => setIsDraggingVertical(true)}
            className="hidden lg:flex w-2 transition-colors cursor-col-resize items-center justify-center group z-30 relative select-none"
            style={{ backgroundColor: isDraggingVertical ? '#84cc16' : '#111' }}
            title="Drag to resize left & right panels"
          >
            <div
              className="w-1 h-12 rounded-full transition-colors group-hover:bg-[#84cc16] flex items-center justify-center"
              style={{ backgroundColor: isDraggingVertical ? '#0a0a0a' : '#333' }}
            >
              <GripVertical className="h-3 w-3 text-slate-400 group-hover:text-black" />
            </div>
          </div>

          {/* RIGHT PANE: Code Editor & Execution */}
          <div
            ref={rightPanelRef}
            className="flex-1 flex flex-col overflow-hidden h-full"
            style={{
              width: `${100 - leftPanelWidth}%`,
              backgroundColor: '#0a0a0a',
            }}
          >
            {/* Editor Toolbar */}
            <div className="h-9 flex items-center justify-between px-3 font-mono text-xs flex-shrink-0" style={{ backgroundColor: '#111', borderBottom: '1px solid #2e2e2e' }}>
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-2.5 py-1 rounded cursor-pointer text-white focus:outline-none font-code-sm text-code-sm"
                  style={{ backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e' }}
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
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#84cc16' }} />
                  <span>{saveStatus === 'saving' ? 'Saving...' : 'Saved 12s ago'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                  title="Reset code"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Breadcrumbs Path */}
            <div className="h-6 px-3 flex items-center gap-1 font-mono text-[11px] text-slate-500 flex-shrink-0" style={{ backgroundColor: '#111', borderBottom: '1px solid #2e2e2e' }}>
              <span className="text-slate-400">workspace</span>
              <span>›</span>
              <span className="text-slate-400">solutions</span>
              <span>›</span>
              <span className="font-semibold flex items-center gap-1" style={{ color: '#84cc16' }}>
                <FileCode className="h-3 w-3" style={{ color: '#84cc16' }} />
                {problem.id}.{language}
              </span>
            </div>

            {/* Code Content Area — Integrated Monaco Editor Component */}
            <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
              <CodeEditor
                value={code}
                language={language}
                onChange={(val) => {
                  const v = val || '';
                  setCode(v);
                  saveDraft(v);
                }}
              />
            </div>

            {/* HORIZONTAL DRAGGABLE SPLITTER HANDLE */}
            <div
              onMouseDown={() => setIsDraggingHorizontal(true)}
              className="h-2 transition-colors cursor-row-resize items-center justify-center group z-30 relative select-none flex flex-shrink-0"
              style={{ backgroundColor: isDraggingHorizontal ? '#84cc16' : '#111', borderTop: '1px solid #2e2e2e' }}
              title="Drag to resize editor & test results height"
            >
              <div
                className="h-1 w-12 rounded-full transition-colors group-hover:bg-[#84cc16] flex items-center justify-center"
                style={{ backgroundColor: isDraggingHorizontal ? '#0a0a0a' : '#333' }}
              >
                <GripHorizontal className="h-3 w-3 text-slate-400 group-hover:text-black" />
              </div>
            </div>

            {/* Console Output Drawer */}
            <div
              className="font-exclude flex flex-col flex-shrink-0 font-mono text-xs overflow-hidden"
              style={{
                height: `${consoleHeight}px`,
                backgroundColor: '#1c1c1c',
              }}
            >
              <div className="h-8 flex items-center justify-between px-3 flex-shrink-0" style={{ backgroundColor: '#111', borderBottom: '1px solid #2e2e2e' }}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveConsoleTab('results')}
                    className={`px-3 py-1 font-medium flex items-center gap-1.5 rounded-t ${
                      activeConsoleTab === 'results'
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    style={activeConsoleTab === 'results' ? { color: '#84cc16' } : {}}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" style={{ color: '#84cc16' }} />
                    <span>Test Results</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400" style={{ fontFamily: "'Roboto Condensed', 'Lexend Deca', sans-serif" }}>
                  <span className="font-semibold" style={{ color: '#84cc16' }}>Memory: 44.2 MB</span>
                  <span>•</span>
                  <span className="font-semibold" style={{ color: '#84cc16' }}>Runtime: 48 ms</span>
                </div>
              </div>

              {/* Console Output View */}
              <div className="flex-1 p-3 overflow-y-auto">
                {submitResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded font-bold" style={{ backgroundColor: 'rgba(132, 204, 22, 0.15)', color: '#84cc16', border: '1px solid rgba(132, 204, 22, 0.3)' }}>
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
                    <span className="font-bold" style={{ color: '#84cc16' }}>Sample Tests Passed</span>
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
              <div className="h-12 px-3 flex items-center justify-end flex-shrink-0" style={{ backgroundColor: '#111', borderTop: '1px solid #2e2e2e' }}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                    className="px-3.5 py-1.5 rounded-lg text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: '#252525', border: '1px solid #333' }}
                  >
                    {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-white" />}
                    <span>Run</span>
                    <kbd className="hidden md:inline-block px-1 rounded text-[10px] text-slate-400 ml-1" style={{ backgroundColor: '#111' }}>
                      ⌘↵
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                    className="px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: '#84cc16', color: '#0a0a0a', boxShadow: '0 4px 20px rgba(132, 204, 22, 0.3)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#a3e635'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#84cc16'; }}
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
