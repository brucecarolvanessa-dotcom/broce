import { AlertCircle, Terminal } from 'lucide-react';
import type { ExecutionResult } from '../types/python';

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export function ConsoleOutput({ result, isRunning }: ConsoleOutputProps) {
  if (isRunning) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-xs font-mono text-slate-300">
        正在執行 Python 程式...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-slate-400">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Terminal className="h-4 w-4 text-slate-500" />
          <span>點擊「執行程式」（或按 Ctrl / Cmd + Enter）查看輸出結果</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs">
          <span className="font-medium text-slate-300">終端機輸出 (stdout)</span>
          <span className="font-mono text-slate-400 tabular-nums">
            {result.success ? `執行完成 · ${result.durationMs} ms` : `執行失敗 · ${result.durationMs} ms`}
          </span>
        </div>
        <pre className="p-4 font-mono text-[13px] leading-relaxed text-slate-100 whitespace-pre-wrap min-h-[110px] max-h-64 overflow-auto">
          {result.stdout
            ? result.stdout
            : result.success
            ? '（程式執行成功，無文字輸出）'
            : '（執行中斷）'}
        </pre>
      </div>

      {result.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-950">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 font-semibold text-red-900">
                <span className="font-mono">{result.error.type}</span>
                {result.error.line && (
                  <span className="text-xs font-medium text-red-700 tabular-nums">
                    · 第 {result.error.line} 行
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-red-900">
                {result.error.friendlyHint}
              </p>
              {result.error.message && (
                <p className="font-mono text-xs text-red-800 bg-white/70 border border-red-200 rounded px-2.5 py-1.5">
                  {result.error.type}: {result.error.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
