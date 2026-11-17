import { useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { ALL_LESSONS, CURRICULUM } from '../data/curriculum';

interface CurriculumMapProps {
  completedLessons: string[];
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  onResetProgress: () => void;
}

type LessonFilter = 'all' | 'todo' | 'done';

export function CurriculumMap({
  completedLessons,
  activeLessonId,
  onSelectLesson,
  onResetProgress,
}: CurriculumMapProps) {
  const [filter, setFilter] = useState<LessonFilter>('all');
  const [confirmReset, setConfirmReset] = useState(false);

  const totalCount = ALL_LESSONS.length;
  const doneCount = completedLessons.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Overview Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-medium text-slate-500 tabular-nums">
            共 8 個章節 · {totalCount} 堂互動實作課 · 瀏覽器內建 Python 3.12 執行環境
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Python 系統化學習地圖
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            從第一行 print() 到資料結構、函式設計與實戰購物車專題。每一課皆附有即時執行、單步變數追蹤與自動任務驗證。
          </p>
        </div>

        <div className="w-full md:w-72 space-y-2 rounded-xl border border-slate-200 bg-white p-4 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">整體完成進度</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {doneCount} / {totalCount} 課 ({pct}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-sky-700 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Filter Bar & Reset Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部課程
          </button>
          <button
            type="button"
            onClick={() => setFilter('todo')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'todo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            尚未完成
          </button>
          <button
            type="button"
            onClick={() => setFilter('done')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'done'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            已完成
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              重設學習進度
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs">
              <span className="text-red-900 font-medium">確定清除所有進度與已寫程式碼？</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="font-semibold text-red-700 hover:text-red-900 cursor-pointer"
              >
                確定重設
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-8">
        {CURRICULUM.map((chapter) => {
          const visibleLessons = chapter.lessons.filter((l) => {
            const done = completedLessons.includes(l.id);
            if (filter === 'done') return done;
            if (filter === 'todo') return !done;
            return true;
          });

          if (visibleLessons.length === 0) return null;

          const chapterDoneCount = chapter.lessons.filter((l) =>
            completedLessons.includes(l.id)
          ).length;

          return (
            <section key={chapter.id} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    {chapter.number}. {chapter.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{chapter.subtitle}</p>
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {chapterDoneCount} / {chapter.lessons.length} 完成
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleLessons.map((lesson) => {
                  const isDone = completedLessons.includes(lesson.id);
                  const isCurrent = lesson.id === activeLessonId;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => onSelectLesson(lesson.id)}
                      className={`group flex flex-col justify-between rounded-xl border p-5 text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-sky-600 bg-sky-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 tabular-nums">
                          <span>
                            第 {lesson.number} 課 · {lesson.difficulty} · {lesson.durationMinutes} 分鐘
                          </span>
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              已完成
                            </span>
                          ) : isCurrent ? (
                            <span className="font-semibold text-sky-700">目前課程</span>
                          ) : null}
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-sky-800">
                          {lesson.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                          {lesson.summary}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-sky-700">
                        <span>{isDone ? '再次複習' : '進入課程'}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
