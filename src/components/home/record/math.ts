/**
 * Pure math for "the record" instrument: x ↔ time mapping, nearest-entry
 * lookup, range filtering and the compact readout/summary strings.
 * No DOM here, so it can be unit-tested.
 */

export const DAY = 86_400_000;

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** "2026-03-14" -> ms at 12:00 UTC (same convention as the server render). */
export const dayTs = (d: string) => new Date(d + 'T12:00:00Z').getTime();

/** Fraction of the plot (0..1) -> timestamp. */
export const fracToTime = (f: number, start: number, end: number) => start + f * (end - start);

/** Timestamp -> fraction of the plot (0..1, unclamped). */
export const timeToFrac = (t: number, start: number, end: number) => (t - start) / (end - start);

/** Pixel position of a bar: its time fraction across the plot plus the same-day spread offset. */
export const barPx = (frac: number, shift: number, width: number) => frac * width + shift;

/**
 * Index of the bar nearest to pixel `x`. Bars are chronological but not
 * strictly monotone in pixels (same-day entries are spread by a few px), so
 * this is a linear scan; ties resolve to the earlier entry. -1 if empty.
 */
export function nearestIndex(pxs: readonly number[], x: number): number {
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i < pxs.length; i++) {
    const d = Math.abs(pxs[i] - x);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

/** Indices of bars whose pixel position falls inside [a, b] (either order). */
export function indicesInRange(pxs: readonly number[], a: number, b: number): number[] {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const out: number[] = [];
  for (let i = 0; i < pxs.length; i++) if (pxs[i] >= lo && pxs[i] <= hi) out.push(i);
  return out;
}

/** [first ms of month, first ms of next month) in UTC for timestamp `t`. */
export function monthBounds(t: number): [number, number] {
  const d = new Date(t);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  return [Date.UTC(y, m, 1), Date.UTC(y, m + 1, 1)];
}

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Playhead readout: "MAR 14, 2026" (UTC). */
export function formatReadout(t: number): string {
  const d = new Date(t);
  return `${MON[d.getUTCMonth()].toUpperCase()} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "Mar 14, 2026" (UTC). */
export function formatDay(t: number): string {
  const d = new Date(t);
  return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "Jan 3 – Feb 20, 2026", "Dec 28, 2025 – Jan 3, 2026", or a single day. */
export function formatRange(a: number, b: number): string {
  const da = new Date(Math.min(a, b));
  const db = new Date(Math.max(a, b));
  const same = (x: Date, y: Date) => x.getUTCFullYear() === y.getUTCFullYear() && x.getUTCMonth() === y.getUTCMonth() && x.getUTCDate() === y.getUTCDate();
  if (same(da, db)) return formatDay(da.getTime());
  const left = da.getUTCFullYear() === db.getUTCFullYear()
    ? `${MON[da.getUTCMonth()]} ${da.getUTCDate()}`
    : formatDay(da.getTime());
  return `${left} – ${formatDay(db.getTime())}`;
}

/** 840 -> "840", 4230 -> "4.2k", 31_400 -> "31k". */
export function formatWords(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(Math.round(n / 100) / 10).toString()}k`;
  return `${Math.round(n / 1000)}k`;
}

export interface Pick { t: number; words: number }

/**
 * Results-panel headline. With entries: "12 entries · Jan 3 – Feb 20, 2026 · 31k words"
 * (range = first..last entry). Empty: "No entries · <window> · the notebook was quiet".
 */
export function summarize(picks: readonly Pick[], windowA: number, windowB: number): string {
  if (!picks.length) return `No entries · ${formatRange(windowA, windowB)} · the notebook was quiet`;
  let lo = Infinity, hi = -Infinity, w = 0;
  for (const p of picks) { if (p.t < lo) lo = p.t; if (p.t > hi) hi = p.t; w += p.words; }
  const n = picks.length;
  return `${n} ${n === 1 ? 'entry' : 'entries'} · ${formatRange(lo, hi)} · ${formatWords(w)} words`;
}
