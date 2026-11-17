import type {
  EngineStatus,
  ExecutionResult,
  FormattedPythonError,
  TestCaseResult,
  TraceStep,
  TracedVariable,
  VerificationResult,
} from '../types/python';

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

const PYODIDE_VERSION = '0.27.2';
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodideInstance: PyodideInstance | null = null;
let loadingPromise: Promise<PyodideInstance> | null = null;
let currentStatus: EngineStatus = 'idle';
const statusListeners = new Set<(status: EngineStatus) => void>();

function notifyStatus(status: EngineStatus) {
  currentStatus = status;
  statusListeners.forEach((cb) => cb(status));
}

export function subscribeEngineStatus(cb: (status: EngineStatus) => void): () => void {
  statusListeners.add(cb);
  cb(currentStatus);
  return () => {
    statusListeners.delete(cb);
  };
}

function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-pyodide="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('無法載入 Python 執行引擎腳本')));
      return;
    }
    const script = document.createElement('script');
    script.src = `${PYODIDE_BASE_URL}pyodide.js`;
    script.async = true;
    script.dataset.pyodide = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('無法連線至 Pyodide CDN 載入 Python 環境'));
    document.head.appendChild(script);
  });
}

export async function ensurePyodideReady(): Promise<PyodideInstance> {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  notifyStatus('loading');
  loadingPromise = (async () => {
    try {
      await loadPyodideScript();
      if (!window.loadPyodide) {
        throw new Error('Pyodide 初始化函式不存在');
      }
      const py = await window.loadPyodide({ indexURL: PYODIDE_BASE_URL });
      pyodideInstance = py;
      notifyStatus('ready');
      return py;
    } catch (err) {
      notifyStatus('error');
      loadingPromise = null;
      throw err;
    }
  })();

  return loadingPromise;
}

function getFriendlyHint(errorType: string, message: string): string {
  switch (errorType) {
    case 'SyntaxError':
      return '語法有誤：請檢查括號 ()、引號 "" 是否成對，或 if / for / def 結尾是否漏掉冒號 : 。';
    case 'IndentationError':
      return '縮排錯誤：Python 依靠縮排（建議統一使用 4 個空白鍵）來區分程式區塊，請檢查對齊是否一致。';
    case 'NameError':
      return '找不到變數或函式名稱：請確認變數是否拼錯字，或尚未賦值就先使用。';
    case 'TypeError':
      return '資料型態不相容：例如嘗試將文字 (str) 與數字 (int) 直接相加，可使用 int() 或 str() 轉換型態。';
    case 'ValueError':
      return '數值格式不正確：例如 int("abc") 無法將非數字文字轉為整數，請檢查傳入的值。';
    case 'IndexError':
      return '索引超出範圍：串列 (list) 或字串的索引從 0 開始，最大索引為 len(items) - 1。';
    case 'KeyError':
      return '字典找不到指定的鍵 (key)：請先確認鍵名是否存在，或改用 dict.get(key) 安全讀取。';
    case 'ZeroDivisionError':
      return '除以零錯誤：數學運算中分母不能為 0，請先檢查除數條件。';
    case 'EOFError':
      return '缺少輸入資料：程式呼叫了 input()，但「輸入區 (stdin)」沒有足夠的輸入行，請在輸入區填入測試資料後再執行。';
    case 'AssertionError':
      return message || '結果尚未符合任務要求，請檢查輸出格式與計算邏輯。';
    default:
      return '程式執行時發生錯誤，請依據上方行號與提示檢查對應程式碼。';
  }
}

export function formatPythonError(rawTraceback: string): FormattedPythonError {
  const lines = rawTraceback.trim().split('\n');
  const lastLine = lines[lines.length - 1] || 'Error';
  const colonIdx = lastLine.indexOf(':');
  const type = colonIdx > 0 ? lastLine.slice(0, colonIdx).trim() : lastLine.trim();
  const message = colonIdx > 0 ? lastLine.slice(colonIdx + 1).trim() : '';

  let lineNum: number | undefined;
  const userCodeMatches = [...rawTraceback.matchAll(/File "<user_code>", line (\d+)/g)];
  if (userCodeMatches.length > 0) {
    lineNum = Number(userCodeMatches[userCodeMatches.length - 1][1]);
  }

  return {
    type,
    message,
    line: lineNum,
    friendlyHint: getFriendlyHint(type, message),
    rawTraceback,
  };
}

function buildRunnerPythonScript(withTrace: boolean): string {
  return `
import sys, io, json, builtins, traceback

_user_code = _pycraft_code
_stdin_lines = _pycraft_stdin.splitlines()
_stdin_index = 0

_stdout_buf = io.StringIO()
_stderr_buf = io.StringIO()
_orig_stdout = sys.stdout
_orig_stderr = sys.stderr
_orig_input = builtins.input

def _custom_input(prompt=""):
    global _stdin_index
    if prompt:
        _stdout_buf.write(str(prompt))
    if _stdin_index < len(_stdin_lines):
        val = _stdin_lines[_stdin_index]
        _stdin_index += 1
        _stdout_buf.write(val + "\\n")
        return val
    raise EOFError("輸入區 (stdin) 已無更多輸入資料")

_trace_steps = []
_trace_truncated = False
_MAX_STEPS = 350
_last_line_by_frame = {}

def _serialize_var(name, val):
    tname = type(val).__name__
    kind = "other"
    items = None
    entries = None
    try:
        r = repr(val)
    except Exception:
        r = f"<{tname}>"
    if len(r) > 120:
        r = r[:117] + "..."

    if isinstance(val, (int, float, bool, str)) or val is None:
        kind = "primitive"
    elif isinstance(val, list):
        kind = "list"
        items = [repr(x)[:40] for x in val[:16]]
    elif isinstance(val, tuple):
        kind = "tuple"
        items = [repr(x)[:40] for x in val[:16]]
    elif isinstance(val, set):
        kind = "set"
        items = [repr(x)[:40] for x in list(val)[:16]]
    elif isinstance(val, dict):
        kind = "dict"
        entries = [{"key": str(k)[:30], "value": repr(v)[:45]} for k, v in list(val.items())[:14]]

    return {
        "name": name,
        "typeName": tname,
        "valueRepr": r,
        "kind": kind,
        "items": items,
        "entries": entries,
    }

def _extract_locals(frame):
    res = []
    for k, v in frame.f_locals.items():
        if k.startswith("__"):
            continue
        if callable(v) and getattr(v, "__module__", None) != "__main__":
            continue
        if type(v).__name__ == "module":
            continue
        res.append(_serialize_var(k, v))
    return res

def _record_step(frame, line_no, ret_val=None):
    global _trace_truncated
    if len(_trace_steps) >= _MAX_STEPS:
        _trace_truncated = True
        return
    scope = frame.f_code.co_name
    if scope == "<module>":
        scope = "主程式"
    step = {
        "stepIndex": len(_trace_steps),
        "line": line_no,
        "scope": scope,
        "variables": _extract_locals(frame),
        "stdout": _stdout_buf.getvalue(),
    }
    if ret_val is not None and scope != "主程式":
        step["returnValue"] = repr(ret_val)[:80]
    _trace_steps.append(step)

def _trace_fn(frame, event, arg):
    if frame.f_code.co_filename != "<user_code>":
        return None
    if _trace_truncated:
        return None
    fid = id(frame)
    if event == "line":
        if fid in _last_line_by_frame:
            _record_step(frame, _last_line_by_frame[fid])
        _last_line_by_frame[fid] = frame.f_lineno
    elif event == "return":
        if fid in _last_line_by_frame:
            _record_step(frame, _last_line_by_frame[fid], arg)
            del _last_line_by_frame[fid]
    return _trace_fn

_result = {
    "success": True,
    "stdout": "",
    "stderr": "",
    "errorTraceback": "",
    "traceSteps": [],
    "traceTruncated": False,
}

sys.stdout = _stdout_buf
sys.stderr = _stderr_buf
builtins.input = _custom_input

_namespace = {"__name__": "__main__"}

try:
    _compiled = compile(_user_code, "<user_code>", "exec")
    if ${withTrace ? 'True' : 'False'}:
        sys.settrace(_trace_fn)
    exec(_compiled, _namespace)
except Exception:
    _result["success"] = False
    _result["errorTraceback"] = traceback.format_exc()
finally:
    sys.settrace(None)
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr
    builtins.input = _orig_input

_result["stdout"] = _stdout_buf.getvalue()
_result["stderr"] = _stderr_buf.getvalue()
_result["traceSteps"] = _trace_steps
_result["traceTruncated"] = _trace_truncated
json.dumps(_result, ensure_ascii=False)
`;
}

function annotateVariableChanges(steps: TraceStep[]): TraceStep[] {
  let prevMap = new Map<string, string>();
  return steps.map((step, idx) => {
    const nextMap = new Map<string, string>();
    const annotatedVars: TracedVariable[] = step.variables.map((v) => {
      nextMap.set(v.name, v.valueRepr);
      const changed = idx === 0 ? true : prevMap.get(v.name) !== v.valueRepr;
      return { ...v, changed };
    });
    prevMap = nextMap;
    return { ...step, variables: annotatedVars };
  });
}

export async function runPythonCode(
  code: string,
  stdinText = '',
  withTrace = false
): Promise<ExecutionResult> {
  const start = performance.now();
  const py = await ensurePyodideReady();

  py.globals.set('_pycraft_code', code);
  py.globals.set('_pycraft_stdin', stdinText);

  const rawJson = (await py.runPythonAsync(buildRunnerPythonScript(withTrace))) as string;
  const parsed = JSON.parse(rawJson) as {
    success: boolean;
    stdout: string;
    stderr: string;
    errorTraceback: string;
    traceSteps: TraceStep[];
    traceTruncated: boolean;
  };

  const durationMs = Math.round(performance.now() - start);
  const error = !parsed.success && parsed.errorTraceback
    ? formatPythonError(parsed.errorTraceback)
    : undefined;

  return {
    success: parsed.success,
    stdout: parsed.stdout,
    stderr: parsed.stderr,
    durationMs,
    error,
    traceSteps: withTrace ? annotateVariableChanges(parsed.traceSteps) : undefined,
    traceTruncated: parsed.traceTruncated,
  };
}

export async function verifyLessonTask(
  userCode: string,
  verificationCode: string,
  stdinText = ''
): Promise<VerificationResult> {
  const py = await ensurePyodideReady();

  py.globals.set('_pycraft_code', userCode);
  py.globals.set('_pycraft_verify_code', verificationCode);
  py.globals.set('_pycraft_stdin', stdinText);

  const verifyScript = `
import sys, io, json, builtins, traceback

_user_code = _pycraft_code
_verify_code = _pycraft_verify_code
_stdin_lines = _pycraft_stdin.splitlines()
_stdin_index = 0

_stdout_buf = io.StringIO()
_orig_stdout = sys.stdout
_orig_stderr = sys.stderr
_orig_input = builtins.input

def _custom_input(prompt=""):
    global _stdin_index
    if prompt:
        _stdout_buf.write(str(prompt))
    if _stdin_index < len(_stdin_lines):
        val = _stdin_lines[_stdin_index]
        _stdin_index += 1
        _stdout_buf.write(val + "\\n")
        return val
    raise EOFError("輸入區 (stdin) 已無更多輸入資料")

sys.stdout = _stdout_buf
sys.stderr = _stdout_buf
builtins.input = _custom_input

_namespace = {"__name__": "__main__"}
_results = []
_error_tb = ""

def _check(label, condition, detail=""):
    _results.append({
        "label": str(label),
        "passed": bool(condition),
        "detail": str(detail) if not condition and detail else ""
    })

try:
    _compiled = compile(_user_code, "<user_code>", "exec")
    exec(_compiled, _namespace)
    _output_text = _stdout_buf.getvalue()
    _verify_env = {
        "ns": _namespace,
        "output": _output_text,
        "output_lines": [line.strip() for line in _output_text.strip().splitlines() if line.strip()],
        "check": _check,
    }
    exec(compile(_verify_code, "<verify_code>", "exec"), _verify_env)
except Exception:
    _error_tb = traceback.format_exc()
finally:
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr
    builtins.input = _orig_input

json.dumps({
    "passed": (not _error_tb) and len(_results) > 0 and all(r["passed"] for r in _results),
    "results": _results,
    "stdout": _stdout_buf.getvalue(),
    "errorTraceback": _error_tb,
}, ensure_ascii=False)
`;

  const rawJson = (await py.runPythonAsync(verifyScript)) as string;
  const parsed = JSON.parse(rawJson) as {
    passed: boolean;
    results: TestCaseResult[];
    stdout: string;
    errorTraceback: string;
  };

  return {
    passed: parsed.passed,
    results: parsed.results,
    stdout: parsed.stdout,
    error: parsed.errorTraceback ? formatPythonError(parsed.errorTraceback) : undefined,
  };
}
