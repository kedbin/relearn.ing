/** Pure helpers for the journal article page. Kept framework-free so they are unit-testable. */

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

/** Headings worth listing in a table of contents (h2 + h3), skipping trailing reference/notes sections' children. */
export function tocHeadings(headings: Heading[]): Heading[] {
  return headings.filter((h) => h.depth === 2 || h.depth === 3).map((h) => ({ ...h, text: h.text.trim() }));
}

/** Only show a TOC when the article has enough structure to warrant one. */
export function shouldShowToc(headings: Heading[], minH2 = 3): boolean {
  return headings.filter((h) => h.depth === 2).length >= minH2;
}

/** True if the markdown body already embeds or links the given YouTube video as an iframe. */
export function bodyEmbedsVideo(body: string | undefined, videoId: string | undefined): boolean {
  if (!body || !videoId) return false;
  const re = new RegExp(`<iframe[^>]+(?:youtube(?:-nocookie)?\\.com/embed/)${videoId.replace(/[^\w-]/g, '')}`, 'i');
  return re.test(body);
}

/** Seconds -> "m:ss" (or "h:mm:ss"). Non-finite / negative values render as "0:00". */
export function formatClock(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/** Seconds -> whole minutes for "Listen · 14 min" (min 1). */
export function minutesLabel(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '';
  return `${Math.max(1, Math.round(sec / 60))} min`;
}

export const SPEEDS = [1, 1.25, 1.5, 2] as const;

/** Cycle to the next playback rate, wrapping around. Unknown rates reset to 1×. */
export function nextSpeed(current: number): number {
  const i = SPEEDS.indexOf(current as (typeof SPEEDS)[number]);
  return i === -1 ? SPEEDS[0] : SPEEDS[(i + 1) % SPEEDS.length];
}

/** 1.25 -> "1.25×", 1 -> "1×" */
export function speedLabel(rate: number): string {
  return `${rate}×`;
}
