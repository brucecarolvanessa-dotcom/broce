import { useCallback, useEffect, useState } from 'react';
import { CheatSheetView } from './components/CheatSheetView';
import { CurriculumMap } from './components/CurriculumMap';
import { Header } from './components/Header';
import { LessonWorkbench } from './components/LessonWorkbench';
import { PlaygroundView } from './components/PlaygroundView';
import { ALL_LESSONS } from './data/curriculum';
import { ensurePyodideReady, subscribeEngineStatus } from './services/pyodideRunner';
import type { AppView, EngineStatus } from './types/python';

const STORAGE_KEY = 'pycraft_learning_state_v1';

interface PersistedState {
  activeLessonId: string;
  completedLessons: string[];
  savedCodeByLesson: Record<string, string>;
}

function loadPersistedState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        activeLessonId: parsed.activeLessonId || ALL_LESSONS[0].id,
        completedLessons: Array.isArray(parsed.completedLessons)
          ? parsed.completedLessons
          : [],
        savedCodeByLesson:
          parsed.savedCodeByLesson && typeof parsed.savedCodeByLesson === 'object'
            ? parsed.savedCodeByLesson
            : {},
      };
    }
  } catch {
    // Ignore storage read errors
  }
  return {
    activeLessonId: ALL_LESSONS[0].id,
    completedLessons: [],
    savedCodeByLesson: {},
  };
}

export default function App() {
  const [initial] = useState<PersistedState>(() => loadPersistedState());
  const [activeView, setActiveView] = useState<AppView>('learn');
  const [activeLessonId, setActiveLessonId] = useState<string>(initial.activeLessonId);
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    initial.completedLessons
  );
  const [savedCodeByLesson, setSavedCodeByLesson] = useState<Record<string, string>>(
    initial.savedCodeByLesson
  );
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('idle');
  const [playgroundInitialCode, setPlaygroundInitialCode] = useState<string | null>(null);
  const [playgroundInitialStdin, setPlaygroundInitialStdin] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeEngineStatus(setEngineStatus);
    // Warm up Pyodide in the background without blocking UI interactivity
    ensurePyodideReady().catch(() => {
      // Errors are surfaced cleanly when user attempts to run code
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      const payload: PersistedState = {
        activeLessonId,
        completedLessons,
        savedCodeByLesson,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write errors
    }
  }, [activeLessonId, completedLessons, savedCodeByLesson]);

  const handleMarkCompleted = useCallback((lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    );
  }, []);

  const handleSaveCode = useCallback((lessonId: string, code: string) => {
    setSavedCodeByLesson((prev) => ({ ...prev, [lessonId]: code }));
  }, []);

  const handleSelectLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveView('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResetProgress = useCallback(() => {
    setCompletedLessons([]);
    setSavedCodeByLesson({});
    setActiveLessonId(ALL_LESSONS[0].id);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const handleLoadInPlayground = useCallback((code: string) => {
    setPlaygroundInitialCode(code);
    setPlaygroundInitialStdin('');
    setActiveView('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleConsumePlaygroundInitial = useCallback(() => {
    setPlaygroundInitialCode(null);
    setPlaygroundInitialStdin(null);
  }, []);

  const currentLesson =
    ALL_LESSONS.find((l) => l.id === activeLessonId) || ALL_LESSONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeView={activeView}
        onNavigate={setActiveView}
        completedCount={completedLessons.length}
        totalLessons={ALL_LESSONS.length}
        currentLessonLabel={`第 ${currentLesson.number} 課`}
        onResumeLesson={() => setActiveView('learn')}
      />

      <main className="flex-1">
        {activeView === 'learn' && (
          <LessonWorkbench
            activeLessonId={activeLessonId}
            onSelectLesson={handleSelectLesson}
            completedLessons={completedLessons}
            onMarkCompleted={handleMarkCompleted}
            savedCodeByLesson={savedCodeByLesson}
            onSaveCode={handleSaveCode}
            engineStatus={engineStatus}
          />
        )}

        {activeView === 'map' && (
          <CurriculumMap
            completedLessons={completedLessons}
            activeLessonId={activeLessonId}
            onSelectLesson={handleSelectLesson}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeView === 'playground' && (
          <PlaygroundView
            initialCode={playgroundInitialCode}
            initialStdin={playgroundInitialStdin}
            onConsumeInitial={handleConsumePlaygroundInitial}
            engineStatus={engineStatus}
          />
        )}

        {activeView === 'cheatsheet' && (
          <CheatSheetView onLoadInPlayground={handleLoadInPlayground} />
        )}
      </main>
    </div>
  );
}
