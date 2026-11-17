import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { CHEAT_SHEET_ITEMS } from '../data/reference';

interface CheatSheetViewProps {
  onLoadInPlayground: (code: string) => void;
}

export function CheatSheetView({ onLoadInPlayground }: CheatSheetViewProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');

  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(CHEAT_SHEET_ITEMS.map((item) => item.category)))],
    []
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHEAT_SHEET_ITEMS.filter((item) => {
      const matchCat = category === '全部' || item.category === category;
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.syntax.toLowerCase().includes(q) ||
        item.exampleCode.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-500">
            常用核心語法 · 一鍵載入實驗室實測
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Python 語法速查表
          </h1>
          <p className="text-sm text-slate-600">
            快速查閱字串、串列、字典、迴圈與例外處理的標準寫法，點擊卡片右下角即可直接送入實驗室執行。
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋語法，例如 split、dict..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-sky-600"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/70 p-1 w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              category === cat
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          找不到符合「{query}」的語法項目，請嘗試其他關鍵字。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>{item.category}</span>
                  <code className="font-mono text-sky-700">{item.syntax}</code>
                </div>
                <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                <p className="text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
                <pre className="rounded-lg bg-slate-950 p-3.5 font-mono text-xs leading-relaxed text-slate-100 overflow-x-auto">
                  {item.exampleCode}
                </pre>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => onLoadInPlayground(item.exampleCode)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer whitespace-nowrap"
                >
                  載入自由實驗室
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
