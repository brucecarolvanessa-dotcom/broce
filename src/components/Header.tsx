import type { AppView } from '../types/python';

interface HeaderProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  completedCount: number;
  totalLessons: number;
  currentLessonLabel: string;
  onResumeLesson: () => void;
}

export function Header({
  activeView,
  onNavigate,
  completedCount,
  totalLessons,
  currentLessonLabel,
  onResumeLesson,
}: HeaderProps) {
  const navItems: { id: AppView; label: string }[] = [
    { id: 'learn', label: '課程工作坊' },
    { id: 'map', label: '課程地圖' },
    { id: 'playground', label: '自由實驗室' },
    { id: 'cheatsheet', label: '語法速查' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('learn')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
        >
          PyCraft Python
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="flex items-center gap-5 sm:gap-7 overflow-x-auto" aria-label="主導覽">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded ${
                  isActive
                    ? 'text-sky-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-600"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="hidden sm:flex items-center shrink-0">
          <button
            type="button"
            onClick={onResumeLesson}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 tabular-nums"
          >
            {activeView === 'learn'
              ? `進度 ${completedCount}/${totalLessons}`
              : `繼續 ${currentLessonLabel}`}
          </button>
        </div>
      </div>
    </header>
  );
}
