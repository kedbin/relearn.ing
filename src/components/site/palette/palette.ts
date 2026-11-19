/**
 * Search palette (lazy). Imported by PaletteTrigger only on first intent, so this module,
 * Fuse.js and /search.json stay off the critical path. Vanilla DOM, no framework.
 */
import Fuse from 'fuse.js';
import { navigate } from 'astro:transitions/client';
import type { EntryLite } from '../../../lib/content';
import { hrefOf, rankItems, type PaletteItem } from './search';

const DOT: Record<string, string> = { Engineering: 'bg-eng', Life: 'bg-life', Work: 'bg-work' };
const SEARCH_ICON =
  '<svg class="h-4 w-4 shrink-0 text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.75"/><path d="m10.5 10.5 3 3" stroke-linecap="round"/></svg>';

let data: EntryLite[] | null = null;
let loading: Promise<void> | null = null;
let fuse: Fuse<EntryLite> | null = null;

let root: HTMLDivElement | null = null;
let input: HTMLInputElement;
let list: HTMLUListElement;
let count: HTMLSpanElement;
let items: PaletteItem[] = [];
let active = 0;
let open = false;
let lastFocus: HTMLElement | null = null;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function loadData(): Promise<void> {
  loading ??= fetch('/search.json')
    .then((r) => r.json() as Promise<EntryLite[]>)
    .catch(() => [] as EntryLite[])
    .then((d) => {
      data = d;
      fuse = new Fuse(d, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'summary', weight: 1.5 },
          { name: 'topic', weight: 1 },
          { name: 'no', weight: 2 },
        ],
        threshold: 0.38,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      if (open) update();
    });
  return loading;
}

function build() {
  const r = el('div', 'fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]');
  r.setAttribute('role', 'presentation');
  r.setAttribute('data-palette', '');

  const scrim = el('div', 'absolute inset-0 bg-bg/75 animate-[palette-in_160ms_ease-out_both] motion-reduce:animate-none');
  scrim.addEventListener('click', () => close());

  const dialog = el(
    'div',
    'relative w-full max-w-[600px] overflow-hidden rounded-lg border bg-bg shadow-[0_24px_60px_-28px_rgb(var(--scrim)/0.35)] animate-[palette-in_180ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none',
  );
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Search relearn.ing');

  const bar = el('div', 'flex items-center gap-3 border-b px-4');
  bar.innerHTML = SEARCH_ICON;
  input = el('input', 'h-14 w-full bg-transparent text-[15px] text-text placeholder:text-faint focus:outline-none');
  Object.assign(input, { placeholder: 'Search entries, topics, or a number like 42…', autocomplete: 'off', spellcheck: false });
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-expanded', 'true');
  input.setAttribute('aria-controls', 'palette-list');
  input.setAttribute('aria-autocomplete', 'list');
  input.addEventListener('input', () => {
    active = 0;
    update();
  });
  input.addEventListener('keydown', onKey);
  bar.append(input, el('kbd', 'kbd', 'esc'));

  list = el('ul', 'max-h-[56vh] overflow-y-auto p-2');
  list.id = 'palette-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Results');
  list.addEventListener('mousemove', (ev) => {
    const a = (ev.target as HTMLElement).closest<HTMLElement>('[data-i]');
    if (a && Number(a.dataset.i) !== active) setActive(Number(a.dataset.i), false);
  });
  list.addEventListener('click', (ev) => {
    const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>('a[data-i]');
    if (!a || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
    ev.preventDefault();
    choose(Number(a.dataset.i));
  });

  const foot = el('div', 'flex items-center gap-4 border-t px-4 py-2.5 text-[11px] text-faint');
  foot.innerHTML =
    '<span class="flex items-center gap-1.5"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate</span><span class="flex items-center gap-1.5"><kbd class="kbd">↵</kbd> open</span>';
  count = el('span', 'ml-auto font-mono');
  foot.append(count);

  dialog.append(bar, list, foot);
  r.append(scrim, dialog);
  return r;
}

function renderItem(it: PaletteItem, i: number): HTMLLIElement {
  const li = el('li');
  li.setAttribute('role', 'none');
  const a = el('a', 'flex items-center gap-4 rounded-md px-3 py-2.5');
  a.id = `pi-${i}`;
  a.dataset.i = String(i);
  a.href = hrefOf(it);
  a.setAttribute('role', 'option');
  a.tabIndex = -1;
  if (it.kind === 'entry') {
    const body = el('span', 'min-w-0 flex-1');
    const meta = el('span', 'mt-0.5 flex items-center gap-2 text-xs text-muted');
    meta.append(el('span', `dot ${DOT[it.e.domain] ?? ''}`), `${it.e.topic} · ${it.e.minutes} min`);
    body.append(el('span', 'row-t block truncate text-[15px] text-text', it.e.title), meta);
    a.append(el('span', 'num w-9 shrink-0 text-xs text-faint', it.e.no), body);
  } else {
    a.append(
      el('span', 'num w-9 shrink-0 text-xs text-faint', '→'),
      el('span', 'row-t flex-1 text-[15px] text-text', it.title),
      el('span', 'label', it.hint),
    );
  }
  li.append(a);
  return li;
}

function update() {
  const q = input.value;
  const query = q.trim();
  list.replaceChildren();
  count.textContent = data ? `${data.length} entries` : '';
  if (!data) {
    items = [];
    list.append(el('li', 'px-3 py-8 text-center text-sm text-muted', 'Loading the notebook…'));
    input.removeAttribute('aria-activedescendant');
    return;
  }
  items = rankItems(q, data, (s) => (fuse ? fuse.search(s, { limit: 12 }).map((r) => r.item) : []));
  if (!items.length) {
    list.append(el('li', 'px-3 py-10 text-center text-sm text-muted', `Nothing logged about “${q}” yet.`));
  }
  const label = (t: string, pt: string) => {
    const li = el('li', `label px-3 pb-1 ${pt}`, t);
    li.setAttribute('role', 'presentation');
    return li;
  };
  if (!query) list.append(label('Recent entries', 'pt-2'));
  items.forEach((it, i) => {
    if (!query && it.kind === 'page' && items[i - 1]?.kind === 'entry') list.append(label('Jump to', 'pt-4'));
    list.append(renderItem(it, i));
  });
  active = Math.min(active, Math.max(0, items.length - 1));
  setActive(active, true);
}

function setActive(i: number, scroll: boolean) {
  active = i;
  list.querySelectorAll<HTMLElement>('a[data-i]').forEach((a) => {
    const on = Number(a.dataset.i) === i;
    a.setAttribute('aria-selected', String(on));
    a.classList.toggle('bg-surface', on);
    const t = a.querySelector('.row-t');
    t?.classList.toggle('text-accent', on);
    t?.classList.toggle('text-text', !on);
    if (on && scroll) a.scrollIntoView({ block: 'nearest' });
  });
  if (items[i]) input.setAttribute('aria-activedescendant', `pi-${i}`);
  else input.removeAttribute('aria-activedescendant');
}

function choose(i: number) {
  const it = items[i];
  if (!it) return;
  const href = hrefOf(it);
  close(false);
  if (href.endsWith('.xml')) window.location.href = href;
  else navigate(href).catch(() => (window.location.href = href));
}

function onKey(ev: KeyboardEvent) {
  if (ev.key === 'ArrowDown') {
    ev.preventDefault();
    if (items.length) setActive(Math.min(items.length - 1, active + 1), true);
  } else if (ev.key === 'ArrowUp') {
    ev.preventDefault();
    if (items.length) setActive(Math.max(0, active - 1), true);
  } else if (ev.key === 'Enter' && items[active]) {
    ev.preventDefault();
    choose(active);
  } else if (ev.key === 'Escape') {
    ev.preventDefault();
    close();
  } else if (ev.key === 'Tab') {
    ev.preventDefault(); // focus trap: the input is the only tab stop
  }
}

export function isOpen() {
  return open;
}

export function openPalette(query?: string) {
  if (!root || !root.isConnected) {
    // Body is swapped on client-side navigation; rebuild when detached.
    root = build();
  }
  if (query !== undefined) input.value = query;
  if (!open) {
    lastFocus = document.activeElement as HTMLElement | null;
    document.body.append(root);
    document.documentElement.style.overflow = 'hidden';
    open = true;
  }
  active = 0;
  update();
  input.focus();
  const end = input.value.length;
  input.setSelectionRange(end, end);
  if (!data) void loadData();
}

export function close(restoreFocus = true) {
  if (!open) return;
  open = false;
  root?.remove();
  document.documentElement.style.overflow = '';
  if (restoreFocus && lastFocus?.isConnected) lastFocus.focus?.();
  lastFocus = null;
}

export function togglePalette() {
  if (open) close();
  else openPalette();
}

document.addEventListener('astro:before-swap', () => close(false));
