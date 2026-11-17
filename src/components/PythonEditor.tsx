import React, { useMemo, useRef } from 'react';

interface PythonEditorProps {
  value: string;
  onChange: (next: string) => void;
  onRun?: () => void;
  activeLine?: number | null;
  errorLine?: number | null;
  heightClass?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}

const KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
  'while', 'with', 'yield',
]);

const BUILTINS = new Set([
  'abs', 'all', 'any', 'bool', 'dict', 'enumerate', 'filter', 'float',
  'input', 'int', 'isinstance', 'len', 'list', 'map', 'max', 'min',
  'print', 'range', 'round', 'set', 'sorted', 'str', 'sum', 'tuple',
  'type', 'zip',
]);

interface Token {
  text: string;
  className: string;
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    // Comment
    if (ch === '#') {
      tokens.push({ text: line.slice(i), className: 'text-slate-500 italic' });
      break;
    }

    // String prefix + quote (f"...", r"...")
    if (
      (ch === 'f' || ch === 'F' || ch === 'r' || ch === 'R') &&
      (line[i + 1] === '"' || line[i + 1] === "'")
    ) {
      const quote = line[i + 1];
      let j = i + 2;
      while (j < line.length) {
        if (line[j] === '\\') {
          j += 2;
          continue;
        }
        if (line[j] === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ text: line.slice(i, j), className: 'text-emerald-300' });
      i = j;
      continue;
    }

    // String literal
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === '\\') {
          j += 2;
          continue;
        }
        if (line[j] === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ text: line.slice(i, j), className: 'text-emerald-300' });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(ch) && (i === 0 || !/[A-Za-z0-9_]/.test(line[i - 1]))) {
      let j = i + 1;
      while (j < line.length && /[0-9._]/.test(line[j])) j += 1;
      tokens.push({ text: line.slice(i, j), className: 'text-amber-300' });
      i = j;
      continue;
    }

    // Identifier / keyword / builtin
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j += 1;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, className: 'text-sky-400 font-medium' });
      } else if (BUILTINS.has(word)) {
        tokens.push({ text: word, className: 'text-cyan-300' });
      } else {
        tokens.push({ text: word, className: 'text-slate-100' });
      }
      i = j;
      continue;
    }

    // Operators / punctuation
    if (/[+\-*/%=<>!&|^~:]/.test(ch)) {
      tokens.push({ text: ch, className: 'text-sky-200' });
      i += 1;
      continue;
    }

    // Plain character / whitespace
    let j = i + 1;
    while (j < line.length && !/[#'"0-9A-Za-z_+\-*/%=<>!&|^~:]/.test(line[j])) {
      j += 1;
    }
    tokens.push({ text: line.slice(i, j), className: 'text-slate-200' });
    i = j;
  }

  return tokens;
}

export function PythonEditor({
  value,
  onChange,
  onRun,
  activeLine = null,
  errorLine = null,
  heightClass = 'h-72',
  readOnly = false,
  ariaLabel = 'Python 程式碼編輯器',
}: PythonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => value.split('\n'), [value]);
  const tokenizedLines = useMemo(() => lines.map(tokenizeLine), [lines]);

  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
      return;
    }

    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineSlice = value.slice(lineStart, start);
        const spacesToRemove = lineSlice.startsWith('    ')
          ? 4
          : lineSlice.match(/^ +/)?.[0].length ?? 0;
        if (spacesToRemove > 0) {
          const next = value.slice(0, lineStart) + value.slice(lineStart + spacesToRemove);
          onChange(next);
          requestAnimationFrame(() => {
            ta.selectionStart = Math.max(lineStart, start - spacesToRemove);
            ta.selectionEnd = Math.max(lineStart, end - spacesToRemove);
          });
        }
      } else {
        const next = value.slice(0, start) + '    ' + value.slice(end);
        onChange(next);
        requestAnimationFrame(() => {
          ta.selectionStart = start + 4;
          ta.selectionEnd = start + 4;
        });
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLineBeforeCursor = value.slice(lineStart, start);
      const indentMatch = currentLineBeforeCursor.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      const extraIndent = currentLineBeforeCursor.trimEnd().endsWith(':') ? '    ' : '';
      const insertion = '\n' + currentIndent + extraIndent;
      const next = value.slice(0, start) + insertion + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        const pos = start + insertion.length;
        ta.selectionStart = pos;
        ta.selectionEnd = pos;
      });
    }
  };

  return (
    <div className={`relative flex w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950 font-mono text-[13.5px] leading-[1.625] ${heightClass}`}>
      {/* Line number gutter */}
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden border-r border-slate-800/90 bg-slate-900/70 py-3.5 text-right text-slate-500 tabular-nums shrink-0"
      >
        {lines.map((_, idx) => {
          const lineNum = idx + 1;
          const isStep = activeLine === lineNum;
          const isErr = errorLine === lineNum;
          return (
            <div
              key={lineNum}
              className={`px-3 leading-[1.625] ${
                isErr
                  ? 'bg-red-500/20 text-red-300 font-semibold'
                  : isStep
                  ? 'bg-sky-500/25 text-sky-300 font-semibold'
                  : ''
              }`}
            >
              {lineNum}
            </div>
          );
        })}
      </div>

      {/* Synchronized Highlight + Textarea Layer */}
      <div className="relative flex-1 overflow-hidden">
        <pre
          ref={preRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-0 overflow-hidden py-3.5 px-4 font-mono text-[13.5px] leading-[1.625] whitespace-pre"
        >
          {tokenizedLines.map((tokens, idx) => {
            const lineNum = idx + 1;
            const isStep = activeLine === lineNum;
            const isErr = errorLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`-mx-4 px-4 ${
                  isErr
                    ? 'bg-red-500/15'
                    : isStep
                    ? 'bg-sky-500/15'
                    : ''
                }`}
              >
                {tokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  tokens.map((tok, tIdx) => (
                    <span key={tIdx} className={tok.className}>
                      {tok.text}
                    </span>
                  ))
                )}
              </div>
            );
          })}
        </pre>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label={ariaLabel}
          className="editor-scroll relative z-10 h-full w-full resize-none bg-transparent py-3.5 px-4 font-mono text-[13.5px] leading-[1.625] text-transparent caret-sky-400 outline-none whitespace-pre overflow-auto selection:bg-sky-500/30"
        />
      </div>
    </div>
  );
}
