import { useEffect, useState } from 'react';
import {
  Activity,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  HelpCircle,
  Menu,
  Play,
  RotateCcw,
  Terminal,
  X,
  XCircle,
} from 'lucide-react';
import { ALL_LESSONS, CURRICULUM } from '../data/curriculum';
import { runPythonCode, verifyLessonTask } from '../services/pyodideRunner';
import type {
  EngineStatus,
  ExecutionResult,
  Lesson,
  VerificationResult,
} from '../types/python';
import { ConsoleOutput } from './ConsoleOutput';
import { PythonEditor } from './PythonEditor';
import { StepVisualizer } from './StepVisualizer';

interface LessonWorkbenchProps {
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  completedLessons: string[];
  onMarkCompleted: (lessonId: string) => void;
  savedCodeByLesson: Record<string, string>;
  onSaveCode: (lessonId: string, code: string) => void;
  engineStatus: EngineStatus;
}

type OutputTab = 'console' | 'trace' | 'verify';

export function LessonWorkbench({
  activeLessonId,
  onSelectLesson,
  completedLessons,
  onMarkCompleted,
  savedCodeByLesson,
  onSaveCode,
  engineStatus,
}: LessonWorkbenchProps) {
  const lessonIndex = Math.max(
    0,
    ALL_LESSONS.findIndex((l) => l.id === activeLessonId)
  );
  const lesson: Lesson = ALL_LESSONS[lessonIndex] || ALL_LESSONS[0];
  const chapter = CURRICULUM.find((c) => c.id === lesson.chapterId) || CURRICULUM[0];

  const [code, setCode] = useState<string>(
    savedCodeByLesson[lesson.id] ?? lesson.starterCode
  );
  const [stdinText, setStdinText] = useState<string>(lesson.defaultStdin ?? '');
  const [showStdin, setShowStdin] = useState<boolean>(Boolean(lesson.defaultStdin));
  const [outputTab, setOutputTab] = useState<OutputTab>('console');
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Sync state when switching lessons
  useEffect(() => {
    setCode(savedCodeByLesson[lesson.id] ?? lesson.starterCode);
    setStdinText(lesson.defaultStdin ?? '');
    setShowStdin(Boolean(lesson.defaultStdin));
    setExecResult(null);
    setVerifyResult(null);
    setStepIndex(0);
    setShowHint(false);
    setShowSolution(false);
    setOutputTab('console');
  }, [lesson.id]);

  const handleCodeChange = (next: string) => {
    setCode(next);
    onSaveCode(lesson.id, next);
  };

  const handleRun = async (withTrace = false) => {
    setIsRunning(true);
    setOutputTab(withTrace ? 'trace' : 'console');
    try {
      const res = await runPythonCode(code, stdinText, withTrace);
      setExecResult(res);
      if (withTrace) {
        setStepIndex(0);
      }
    } catch (err) {
      setExecResult({
        success: false,
        stdout: '',
        stderr: '',
        durationMs: 0,
        error: {
          type: 'RuntimeInitError',
          message: err instanceof Error ? err.message : '無法初始化 Python 執行環境',
          friendlyHint: '請確認網路連線正常，並再試一次。',
          rawTraceback: '',
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleVerify = async () => {
    setIsRunning(true);
    setOutputTab('verify');
    try {
      const res = await verifyLessonTask(code, lesson.verificationCode, stdinText);
      setVerifyResult(res);
      setExecResult({
        success: !res.error,
        stdout: res.stdout,
        stderr: '',
        durationMs: 0,
        error: res.error,
      });
      if (res.passed) {
        onMarkCompleted(lesson.id);
      }
    } catch (err) {
      setVerifyResult({
        passed: false,
        results: [],
        stdout: '',
        error: {
          type: 'RuntimeInitError',
          message: err instanceof Error ? err.message : '驗證執行失敗',
          friendlyHint: '請稍後再試一次。',
          rawTraceback: '',
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    handleCodeChange(lesson.starterCode);
    setStdinText(lesson.defaultStdin ?? '');
    setExecResult(null);
    setVerifyResult(null);
    setStepIndex(0);
  };

  const handleApplyExample = (exampleCode: string, idx: number) => {
    handleCodeChange(exampleCode);
    setCopiedIndex(idx);
    window.setTimeout(() => setCopiedIndex(null), 1500);
  };

  const activeTraceLine =
    outputTab === 'trace' &&
    execResult?.traceSteps &&
    execResult.traceSteps.length > 0
      ? execResult.traceSteps[Math.min(stepIndex, execResult.traceSteps.length - 1)]?.line ?? null
      : null;

  const errorLine = execResult?.error?.line ?? null;
  const isCompleted = completedLessons.includes(lesson.id);
  const prevLesson = lessonIndex > 0 ? ALL_LESSONS[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < ALL_LESSONS.length - 1 ? ALL_LESSONS[lessonIndex + 1] : null;

  const sidebarContent = (
    <div className="space-y-5 py-2">
      {CURRICULUM.map((ch) => (
        <div key={ch.id} className="space-y-1">
          <div className="px-3 text-xs font-semibold text-slate-500">
            {ch.number}. {ch.title}
          </div>
          <ul className="space-y-0.5">
            {ch.lessons.map((item) => {
              const active = item.id === lesson.id;
              const done = completedLessons.includes(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLesson(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[13px] transition-colors cursor-pointer ${
                      active
                        ? 'bg-sky-50 font-semibold text-sky-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate tabular-nums">
                      {item.number}. {item.title}
                    </span>
                    {done && (
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                        aria-label="已完成"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile / Tablet Curriculum Drawer Toggle */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-xs cursor-pointer"
        >
          <Menu className="h-4 w-4" />
          課程章節目錄（{lesson.number} / {ALL_LESSONS.length}）
        </button>
        <span className="text-xs text-slate-500 tabular-nums">
          已完成 {completedLessons.length} 課
        </span>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-display text-sm font-bold text-slate-900">
                課程章節目錄
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="關閉目錄"
                className="rounded p-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Chapter Navigation Rail (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <div className="mb-3 flex items-center justify-between px-3">
            <span className="text-xs font-semibold text-slate-900">課程目錄</span>
            <span className="text-xs text-slate-500 tabular-nums">
              {completedLessons.length}/{ALL_LESSONS.length}
            </span>
          </div>
          {sidebarContent}
        </aside>

        {/* Center-Left Lesson Guide & Task Specification */}
        <section className="lg:col-span-4 xl:col-span-4 space-y-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="space-y-2">
            {/* Unboxed metadata line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
              <span>第 {chapter.number} 章：{chapter.title}</span>
              <span aria-hidden="true">·</span>
              <span>{lesson.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>約 {lesson.durationMinutes} 分鐘</span>
              {isCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    已完成
                  </span>
                </>
              )}
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 text-balance">
              {lesson.number}. {lesson.title}
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">{lesson.summary}</p>
          </div>

          {/* Concept Sections separated by whitespace and hairline dividers */}
          <div className="space-y-6 border-t border-slate-200 pt-5">
            {lesson.concepts.map((concept, idx) => (
              <div key={idx} className="space-y-2.5">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-sky-700 shrink-0" />
                  <span>{concept.title}</span>
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {concept.summary}
                </p>
                <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-1.5">
                    <span className="text-[11px] font-mono text-slate-400">範例程式</span>
                    <button
                      type="button"
                      onClick={() => handleApplyExample(concept.codeExample, idx)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-300 hover:text-sky-200 transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="h-3 w-3" />
                          已載入右側編輯器
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          載入編輯器試跑
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 font-mono text-xs leading-relaxed text-slate-100 overflow-x-auto">
                    {concept.codeExample}
                  </pre>
                </div>
                {concept.tip && (
                  <p className="rounded-md bg-slate-100 px-3 py-2 text-xs leading-relaxed text-slate-700">
                    <strong className="font-semibold text-slate-900">小提醒：</strong>
                    {concept.tip}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Practice Task */}
          <div className="space-y-3 border-t border-slate-200 pt-5">
            <h2 className="text-base font-semibold text-slate-900">
              動手任務：{lesson.taskTitle}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {lesson.taskDescription}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {lesson.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                {showHint ? '隱藏提示' : '查看提示'}
              </button>
              <button
                type="button"
                onClick={() => setShowSolution((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {showSolution ? '隱藏解答' : '查看參考解答'}
              </button>
            </div>

            {showHint && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
                <strong className="font-semibold">解題提示：</strong>
                {lesson.hint}
              </div>
            )}

            {showSolution && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">參考解答</span>
                  <button
                    type="button"
                    onClick={() => handleCodeChange(lesson.solutionCode)}
                    className="text-xs font-medium text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    套用至編輯器
                  </button>
                </div>
                <pre className="rounded bg-slate-950 p-3 font-mono text-xs text-slate-100 overflow-x-auto">
                  {lesson.solutionCode}
                </pre>
              </div>
            )}
          </div>

          {/* Lesson Navigation Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <button
              type="button"
              disabled={!prevLesson}
              onClick={() => prevLesson && onSelectLesson(prevLesson.id)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
            >
              <ChevronLeft className="h-4 w-4" />
              上一課
            </button>
            <button
              type="button"
              disabled={!nextLesson}
              onClick={() => nextLesson && onSelectLesson(nextLesson.id)}
              className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
            >
              下一課
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Right Interactive Coding & Visualization Stage */}
        <section className="lg:col-span-5 xl:col-span-6 space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleRun(false)}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-800 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5" />
                執行程式
              </button>
              <button
                type="button"
                onClick={() => handleRun(true)}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <Activity className="h-3.5 w-3.5 text-sky-700" />
                單步追蹤
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                檢查任務
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {engineStatus === 'loading'
                  ? '載入 Python 環境中...'
                  : engineStatus === 'error'
                  ? '引擎載入失敗'
                  : engineStatus === 'ready'
                  ? 'Python 3.12 就緒'
                  : '點擊執行自動啟動環境'}
              </span>
              <button
                type="button"
                onClick={handleResetCode}
                title="重設為初始範本"
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                重設
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <PythonEditor
            value={code}
            onChange={handleCodeChange}
            onRun={() => handleRun(false)}
            activeLine={activeTraceLine}
            errorLine={errorLine}
            heightClass="h-80"
          />

          {/* Optional Stdin Input Box */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setShowStdin((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <span>標準輸入區 (stdin — 若程式有使用 input() 請在此填寫每行輸入)</span>
              <span className="text-sky-700">{showStdin ? '收合' : '展開'}</span>
            </button>
            {showStdin && (
              <div className="border-t border-slate-200 p-3">
                <textarea
                  value={stdinText}
                  onChange={(e) => setStdinText(e.target.value)}
                  rows={2}
                  placeholder="每行代表一次 input() 的輸入內容，例如：&#10;8&#10;5"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* Segmented Output Stage */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => setOutputTab('console')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  outputTab === 'console'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                執行輸出
              </button>
              <button
                type="button"
                onClick={() => setOutputTab('trace')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  outputTab === 'trace'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                單步變數追蹤
                {execResult?.traceSteps && execResult.traceSteps.length > 0 && (
                  <span className="text-slate-400 tabular-nums">
                    ({execResult.traceSteps.length})
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setOutputTab('verify')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  outputTab === 'verify'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                任務檢查結果
              </button>
            </div>

            {outputTab === 'console' && (
              <ConsoleOutput result={execResult} isRunning={isRunning} />
            )}

            {outputTab === 'trace' && (
              <StepVisualizer
                steps={execResult?.traceSteps ?? []}
                currentStepIndex={stepIndex}
                onStepChange={setStepIndex}
                truncated={execResult?.traceTruncated}
              />
            )}

            {outputTab === 'verify' && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                {isRunning ? (
                  <p className="text-xs font-mono text-slate-600">正在驗證任務條件...</p>
                ) : !verifyResult ? (
                  <p className="text-xs text-slate-500">
                    完成程式碼後點擊「檢查任務」，系統會自動測試你的輸出與變數結果是否符合本課要求。
                  </p>
                ) : (
                  <>
                    <div
                      className={`flex items-center justify-between rounded-md px-3.5 py-2.5 text-xs font-semibold ${
                        verifyResult.passed
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-50 text-amber-950 border border-amber-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {verifyResult.passed ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            恭喜通過本課所有測試條件！已自動記錄學習進度
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-amber-600" />
                            尚有測試未通過，請依據下方檢查項目調整程式碼
                          </>
                        )}
                      </span>
                      {verifyResult.passed && nextLesson && (
                        <button
                          type="button"
                          onClick={() => onSelectLesson(nextLesson.id)}
                          className="rounded bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800 cursor-pointer whitespace-nowrap"
                        >
                          前往下一課
                        </button>
                      )}
                    </div>

                    {verifyResult.error && (
                      <ConsoleOutput
                        result={{
                          success: false,
                          stdout: verifyResult.stdout,
                          stderr: '',
                          durationMs: 0,
                          error: verifyResult.error,
                        }}
                        isRunning={false}
                      />
                    )}

                    {verifyResult.results.length > 0 && (
                      <ul className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
                        {verifyResult.results.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 px-3.5 py-2.5 text-xs bg-white"
                          >
                            {item.passed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-0.5">
                              <div
                                className={`font-medium ${
                                  item.passed ? 'text-slate-800' : 'text-red-900'
                                }`}
                              >
                                {item.label}
                              </div>
                              {item.detail && (
                                <div className="text-slate-500">{item.detail}</div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
