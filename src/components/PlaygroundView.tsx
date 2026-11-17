import { useEffect, useState } from 'react';
import { Activity, Play, RotateCcw, Terminal } from 'lucide-react';
import { PLAYGROUND_TEMPLATES } from '../data/reference';
import { runPythonCode } from '../services/pyodideRunner';
import type { EngineStatus, ExecutionResult } from '../types/python';
import { ConsoleOutput } from './ConsoleOutput';
import { PythonEditor } from './PythonEditor';
import { StepVisualizer } from './StepVisualizer';

interface PlaygroundViewProps {
  initialCode: string | null;
  initialStdin: string | null;
  onConsumeInitial: () => void;
  engineStatus: EngineStatus;
}

export function PlaygroundView({
  initialCode,
  initialStdin,
  onConsumeInitial,
  engineStatus,
}: PlaygroundViewProps) {
  const defaultTemplate = PLAYGROUND_TEMPLATES[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplate.id);
  const [code, setCode] = useState<string>(defaultTemplate.code);
  const [stdinText, setStdinText] = useState<string>(defaultTemplate.stdin ?? '');
  const [outputTab, setOutputTab] = useState<'console' | 'trace'>('console');
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (initialCode !== null) {
      setCode(initialCode);
      setStdinText(initialStdin ?? '');
      setSelectedTemplateId('custom');
      setExecResult(null);
      setStepIndex(0);
      onConsumeInitial();
    }
  }, [initialCode, initialStdin, onConsumeInitial]);

  const handleSelectTemplate = (templateId: string) => {
    const tpl = PLAYGROUND_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setSelectedTemplateId(tpl.id);
    setCode(tpl.code);
    setStdinText(tpl.stdin ?? '');
    setExecResult(null);
    setStepIndex(0);
  };

  const handleRun = async (withTrace = false) => {
    setIsRunning(true);
    setOutputTab(withTrace ? 'trace' : 'console');
    try {
      const res = await runPythonCode(code, stdinText, withTrace);
      setExecResult(res);
      if (withTrace) setStepIndex(0);
    } catch (err) {
      setExecResult({
        success: false,
        stdout: '',
        stderr: '',
        durationMs: 0,
        error: {
          type: 'RuntimeInitError',
          message: err instanceof Error ? err.message : '無法初始化 Python 執行環境',
          friendlyHint: '請確認網路連線正常後再試一次。',
          rawTraceback: '',
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const activeTraceLine =
    outputTab === 'trace' &&
    execResult?.traceSteps &&
    execResult.traceSteps.length > 0
      ? execResult.traceSteps[Math.min(stepIndex, execResult.traceSteps.length - 1)]?.line ?? null
      : null;

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-500">
            自由實作空間 · Python 3.12 · 支援單步記憶體追蹤
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Python 自由實驗室
          </h1>
          <p className="text-sm text-slate-600">
            挑選經典演算法範例或自由編寫 Python 程式，觀察即時輸出與每一步變數變化。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PLAYGROUND_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tpl.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedTemplateId === tpl.id
                  ? 'border-sky-600 bg-sky-50 text-sky-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code & Stdin */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRun(false)}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5" />
                執行程式
              </button>
              <button
                type="button"
                onClick={() => handleRun(true)}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <Activity className="h-3.5 w-3.5 text-sky-700" />
                單步追蹤
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                {engineStatus === 'loading'
                  ? '載入環境中...'
                  : engineStatus === 'ready'
                  ? 'Python 3.12 就緒'
                  : '等待執行'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCode('');
                  setStdinText('');
                  setExecResult(null);
                  setSelectedTemplateId('custom');
                }}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                清空
              </button>
            </div>
          </div>

          <PythonEditor
            value={code}
            onChange={setCode}
            onRun={() => handleRun(false)}
            activeLine={activeTraceLine}
            errorLine={execResult?.error?.line ?? null}
            heightClass="h-[400px]"
          />

          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              標準輸入區 (stdin)
            </label>
            <textarea
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              rows={2}
              placeholder="若程式呼叫 input()，每行代表一筆輸入資料"
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Right: Output & Trace Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
            <button
              type="button"
              onClick={() => setOutputTab('console')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
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
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                outputTab === 'trace'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              單步變數追蹤
            </button>
          </div>

          {outputTab === 'console' ? (
            <ConsoleOutput result={execResult} isRunning={isRunning} />
          ) : (
            <StepVisualizer
              steps={execResult?.traceSteps ?? []}
              currentStepIndex={stepIndex}
              onStepChange={setStepIndex}
              truncated={execResult?.traceTruncated}
            />
          )}
        </div>
      </div>
    </div>
  );
}
