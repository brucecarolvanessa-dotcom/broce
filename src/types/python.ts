export type AppView = 'learn' | 'map' | 'playground' | 'cheatsheet';

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface TracedVariable {
  name: string;
  typeName: string;
  valueRepr: string;
  kind: 'primitive' | 'list' | 'dict' | 'tuple' | 'set' | 'other';
  items?: string[];
  entries?: { key: string; value: string }[];
  changed?: boolean;
}

export interface TraceStep {
  stepIndex: number;
  line: number;
  scope: string;
  variables: TracedVariable[];
  stdout: string;
  returnValue?: string;
}

export interface FormattedPythonError {
  type: string;
  message: string;
  line?: number;
  friendlyHint: string;
  rawTraceback: string;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  error?: FormattedPythonError;
  traceSteps?: TraceStep[];
  traceTruncated?: boolean;
}

export interface TestCaseResult {
  label: string;
  passed: boolean;
  detail?: string;
}

export interface VerificationResult {
  passed: boolean;
  results: TestCaseResult[];
  stdout: string;
  error?: FormattedPythonError;
}

export interface LessonConceptBlock {
  title: string;
  summary: string;
  codeExample: string;
  tip?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  number: string;
  title: string;
  durationMinutes: number;
  difficulty: '入門' | '基礎' | '進階';
  summary: string;
  concepts: LessonConceptBlock[];
  taskTitle: string;
  taskDescription: string;
  requirements: string[];
  starterCode: string;
  solutionCode: string;
  hint: string;
  defaultStdin?: string;
  verificationCode: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export interface PlaygroundTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  stdin?: string;
}

export interface CheatSheetItem {
  id: string;
  category: string;
  title: string;
  description: string;
  syntax: string;
  exampleCode: string;
}
