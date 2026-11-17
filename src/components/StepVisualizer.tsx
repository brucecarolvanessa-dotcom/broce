import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { TraceStep } from '../types/python';

interface StepVisualizerProps {
  steps: TraceStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  truncated?: boolean;
}

export function StepVisualizer({
  steps,
  currentStepIndex,
  onStepChange,
  truncated = false,
}: StepVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      onStepChange(currentStepIndex + 1);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, onStepChange]);

  useEffect(() => {
    setIsPlaying(false);
  }, [steps]);

  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm font-medium text-slate-700">尚未記錄到執行步驟</p>
        <p className="mt-1 text-xs text-slate-500">
          點擊「單步追蹤」按鈕後，可在此逐步觀察每一行程式碼執行後的變數記憶體與串列狀態。
        </p>
      </div>
    );
  }

  const step = steps[Math.min(currentStepIndex, steps.length - 1)];

  return (
    <div className="space-y-4">
      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onStepChange(0);
            }}
            disabled={currentStepIndex === 0}
            aria-label="回到第一步"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onStepChange(Math.max(0, currentStepIndex - 1));
            }}
            disabled={currentStepIndex === 0}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
          >
            <ChevronLeft className="h-4 w-4" />
            上一步
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentStepIndex >= steps.length - 1) {
                onStepChange(0);
                setIsPlaying(true);
              } else {
                setIsPlaying((prev) => !prev);
              }
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-sky-700 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-sky-800 cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isPlaying ? '暫停' : '播放'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onStepChange(Math.min(steps.length - 1, currentStepIndex + 1));
            }}
            disabled={currentStepIndex >= steps.length - 1}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
          >
            下一步
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 tabular-nums">
          <span>
            步驟 <strong className="text-slate-900">{currentStepIndex + 1}</strong> / {steps.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            剛執行第 <strong className="text-sky-700">{step.line}</strong> 行
          </span>
          <span aria-hidden="true">·</span>
          <span>作用域：{step.scope}</span>
        </div>
      </div>

      {/* Step Scrubber */}
      {steps.length > 1 && (
        <div className="px-1">
          <label className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>拖曳時間軸檢視執行歷程</span>
            <span className="tabular-nums">第 {step.line} 行</span>
          </label>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              onStepChange(Number(e.target.value));
            }}
            className="w-full accent-sky-700 cursor-pointer"
          />
        </div>
      )}

      {truncated && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          已達單步追蹤上限（350 步），僅顯示前 350 步的執行快照。
        </p>
      )}

      {step.returnValue !== undefined && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs text-emerald-900 font-mono">
          函式 {step.scope} 回傳值：{step.returnValue}
        </div>
      )}

      {/* Variable Memory Table + Structured Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-800">變數記憶體狀態</h4>
            <span className="text-xs text-slate-500 tabular-nums">
              {step.variables.length} 個區域變數
            </span>
          </div>
          {step.variables.length === 0 ? (
            <div className="px-4 py-6 text-xs text-slate-500 text-center">
              此步驟尚無使用者變數
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {step.variables.map((v) => (
                <div
                  key={v.name}
                  className={`px-4 py-2.5 text-xs ${
                    v.changed ? 'bg-sky-50/70' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <code className="font-mono font-semibold text-slate-900">
                        {v.name}
                      </code>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-500">{v.typeName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {v.changed && (
                        <span className="text-[11px] font-medium text-sky-700">
                          已更新
                        </span>
                      )}
                      <code className="font-mono text-slate-800 max-w-[260px] truncate">
                        {v.valueRepr}
                      </code>
                    </div>
                  </div>

                  {/* Visual Container Representation for list / tuple / set */}
                  {(v.kind === 'list' || v.kind === 'tuple' || v.kind === 'set') &&
                    v.items &&
                    v.items.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {v.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono"
                          >
                            {v.kind !== 'set' && (
                              <span className="text-[10px] text-slate-400 tabular-nums">
                                [{idx}]
                              </span>
                            )}
                            <span className="text-[11px] text-slate-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Visual Key-Value Table for dict */}
                  {v.kind === 'dict' && v.entries && v.entries.length > 0 && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {v.entries.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px]"
                        >
                          <span className="text-slate-500 truncate">{entry.key}</span>
                          <span className="text-slate-900 font-medium ml-2 truncate">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step-synced stdout */}
        <div className="lg:col-span-5 rounded-lg border border-slate-200 bg-slate-950 text-slate-100 overflow-hidden flex flex-col">
          <div className="border-b border-slate-800 bg-slate-900 px-4 py-2.5 flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-200">截至本步驟之輸出</h4>
            <span className="text-xs text-slate-400 font-mono">stdout</span>
          </div>
          <pre className="p-4 font-mono text-xs leading-relaxed text-slate-100 whitespace-pre-wrap flex-1 min-h-[120px] overflow-auto">
            {step.stdout ? step.stdout : '（尚未產生輸出）'}
          </pre>
        </div>
      </div>
    </div>
  );
}
