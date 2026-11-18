import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import type { EntryLite } from '../../lib/content';

type Item =
  | { kind: 'entry'; e: EntryLite }
  | { kind: 'page'; title: string; href: string; hint: string };

const PAGES: Item[] = [
  { kind: 'page', title: 'Journal — all entries', href: '/journal/', hint: 'Page' },
  { kind: 'page', title: 'Projects', href: '/projects/', hint: 'Page' },
  { kind: 'page', title: 'About Kim', href: '/about/', hint: 'Page' },
  { kind: 'page', title: 'RSS feed', href: '/rss.xml', hint: 'Feed' },
];

const DOT: Record<string, string> = { Engineering: 'bg-eng', Life: 'bg-life', Work: 'bg-work' };

function go(href: string) {
  // Use Astro's router when available for a smooth transition.
  import('astro:transitions/client')
    .then((m) => m.navigate(href))
    .catch(() => (window.location.href = href));
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [data, setData] = useState<EntryLite[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Global open triggers: ⌘K / Ctrl+K / "/" and any [data-open-palette] element.
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((ev.key === 'k' || ev.key === 'K') && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        setOpen((o) => !o);
      } else if (ev.key === '/' && !typing) {
        ev.preventDefault();
        setOpen(true);
      }
    };
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement)?.closest?.('[data-open-palette]');
      if (el) {
        ev.preventDefault();
        const preset = (el as HTMLElement).dataset.query;
        if (preset) setQ(preset);
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
    if (!data) {
      fetch('/search.json')
        .then((r) => r.json())
        .then(setData)
        .catch(() => setData([]));
    }
    return () => {
      document.documentElement.style.overflow = '';
      lastFocus.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener('astro:before-swap', close);
    return () => document.removeEventListener('astro:before-swap', close);
  }, []);

  const fuse = useMemo(
    () =>
      data
        ? new Fuse(data, {
            keys: [
              { name: 'title', weight: 3 },
              { name: 'summary', weight: 1.5 },
              { name: 'topic', weight: 1 },
              { name: 'no', weight: 2 },
            ],
            threshold: 0.38,
            ignoreLocation: true,
            minMatchCharLength: 2,
          })
        : null,
    [data],
  );

  const items: Item[] = useMemo(() => {
    const query = q.trim();
    if (!data) return [];
    if (!query) {
      return [...data.slice(0, 6).map((e) => ({ kind: 'entry' as const, e })), ...PAGES];
    }
    const num = query.replace(/^(#|№|no\.?\s*)/i, '');
    const exact = /^\d{1,3}$/.test(num) ? data.filter((e) => parseInt(e.no, 10) === parseInt(num, 10)) : [];
    const hits = fuse ? fuse.search(query, { limit: 12 }).map((r) => r.item) : [];
    const merged = [...exact, ...hits.filter((h) => !exact.includes(h))];
    const pages = PAGES.filter((p) => p.kind === 'page' && p.title.toLowerCase().includes(query.toLowerCase()));
    return [...merged.map((e) => ({ kind: 'entry' as const, e })), ...pages];
  }, [q, data, fuse]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const hrefOf = (it: Item) => (it.kind === 'entry' ? `/journal/${it.e.id}/` : it.href);

  const onInputKey = (ev: React.KeyboardEvent) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (ev.key === 'Enter' && items[active]) {
      ev.preventDefault();
      setOpen(false);
      go(hrefOf(items[active]));
    } else if (ev.key === 'Escape') {
      setOpen(false);
    } else if (ev.key === 'Tab') {
      ev.preventDefault(); // simple focus trap: keep focus in the input
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]" role="presentation">
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm animate-[reveal_200ms_ease-out_both]" onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search relearn.ing"
        className="relative w-full max-w-[640px] overflow-hidden rounded-xl border bg-bg shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)] animate-[reveal_260ms_cubic-bezier(0.22,1,0.36,1)_both]"
      >
        <div className="flex items-center gap-3 border-b px-4">
          <svg className="h-4 w-4 shrink-0 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="4.75" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search entries, topics, or a number like 42…"
            className="h-14 w-full bg-transparent text-[15px] text-text placeholder:text-faint focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={items[active] ? `pi-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[56vh] overflow-y-auto p-2">
          {!data && <li className="px-3 py-8 text-center text-sm text-muted">Loading the notebook…</li>}
          {data && items.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-muted">
              Nothing logged about “{q}” yet.
            </li>
          )}
          {data && !q.trim() && <li className="label px-3 pb-1 pt-2">Recent entries</li>}
          {items.map((it, i) => {
            const isActive = i === active;
            const showPagesLabel = !q.trim() && it.kind === 'page' && items[i - 1]?.kind === 'entry';
            return (
              <li key={hrefOf(it)} role="none">
                {showPagesLabel && <div className="label px-3 pb-1 pt-4">Jump to</div>}
                <a
                  id={`pi-${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={isActive}
                  href={hrefOf(it)}
                  onMouseMove={() => setActive(i)}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 rounded-lg px-3 py-2.5 ${isActive ? 'bg-surface' : ''}`}
                >
                  {it.kind === 'entry' ? (
                    <>
                      <span className="num w-9 shrink-0 text-xs text-faint">{it.e.no}</span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[15px] ${isActive ? 'text-accent' : 'text-text'}`}>{it.e.title}</span>
                        <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                          <span className={`dot ${DOT[it.e.domain]}`} />
                          {it.e.topic} · {it.e.minutes} min
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="num w-9 shrink-0 text-xs text-faint">→</span>
                      <span className={`flex-1 text-[15px] ${isActive ? 'text-accent' : 'text-text'}`}>{it.title}</span>
                      <span className="label">{it.hint}</span>
                    </>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t px-4 py-2.5 text-[11px] text-faint">
          <span className="flex items-center gap-1.5"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="kbd">↵</kbd> open</span>
          <span className="ml-auto font-mono">{data ? `${data.length} entries` : ''}</span>
        </div>
      </div>
    </div>
  );
}
