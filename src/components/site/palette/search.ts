/** Pure, framework-free ranking logic for the search palette (unit-tested). */
import type { EntryLite } from '../../../lib/content';

export type PaletteItem =
  | { kind: 'entry'; e: EntryLite }
  | { kind: 'page'; title: string; href: string; hint: string };

export const PAGES: PaletteItem[] = [
  { kind: 'page', title: 'Journal — all entries', href: '/journal/', hint: 'Page' },
  { kind: 'page', title: 'Projects', href: '/projects/', hint: 'Page' },
  { kind: 'page', title: 'About Kim', href: '/about/', hint: 'Page' },
  { kind: 'page', title: 'RSS feed', href: '/rss.xml', hint: 'Feed' },
];

export const RECENT_COUNT = 6;

/** "42", "#42", "№ 42", "no. 42" -> 42; anything else -> null. */
export function parseEntryNumber(query: string): number | null {
  const num = query.trim().replace(/^(#|№|no\.?)\s*/i, '');
  return /^\d{1,3}$/.test(num) ? parseInt(num, 10) : null;
}

export function hrefOf(it: PaletteItem): string {
  return it.kind === 'entry' ? `/journal/${it.e.id}/` : it.href;
}

/**
 * Items for a query: empty query -> recent entries + pages; otherwise exact number match first,
 * then fuzzy hits (deduped), then pages whose title contains the query.
 */
export function rankItems(
  query: string,
  data: EntryLite[],
  fuzzy: (q: string) => EntryLite[] = () => [],
): PaletteItem[] {
  const q = query.trim();
  if (!q) return [...data.slice(0, RECENT_COUNT).map((e) => ({ kind: 'entry' as const, e })), ...PAGES];
  const n = parseEntryNumber(q);
  const exact = n === null ? [] : data.filter((e) => parseInt(e.no, 10) === n);
  const hits = fuzzy(q).filter((h) => !exact.includes(h));
  const lower = q.toLowerCase();
  const pages = PAGES.filter((p) => p.kind === 'page' && p.title.toLowerCase().includes(lower));
  return [...[...exact, ...hits].map((e) => ({ kind: 'entry' as const, e })), ...pages];
}
