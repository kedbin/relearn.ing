import { describe, it, expect } from 'vitest';
import {
  DAY, dayTs, clamp, fracToTime, timeToFrac, barPx, nearestIndex, indicesInRange,
  monthBounds, formatReadout, formatRange, formatWords, summarize,
} from '../math';

describe('x <-> time mapping', () => {
  const start = dayTs('2026-01-01');
  const end = dayTs('2026-12-31');
  it('round-trips', () => {
    for (const f of [0, 0.123, 0.5, 0.999, 1]) expect(timeToFrac(fracToTime(f, start, end), start, end)).toBeCloseTo(f, 10);
  });
  it('maps endpoints', () => {
    expect(fracToTime(0, start, end)).toBe(start);
    expect(fracToTime(1, start, end)).toBe(end);
    expect(timeToFrac(dayTs('2026-07-02'), start, end)).toBeCloseTo(0.5, 2);
  });
  it('barPx adds the same-day shift', () => {
    expect(barPx(0.5, 10, 1000)).toBe(510);
  });
  it('clamp', () => {
    expect(clamp(-1, 0, 5)).toBe(0); expect(clamp(9, 0, 5)).toBe(5); expect(clamp(3, 0, 5)).toBe(3);
  });
});

describe('nearestIndex', () => {
  it('returns -1 for no bars', () => expect(nearestIndex([], 4)).toBe(-1));
  it('finds the closest bar, ties go earlier', () => {
    const px = [10, 20, 40];
    expect(nearestIndex(px, -50)).toBe(0);
    expect(nearestIndex(px, 14)).toBe(0);
    expect(nearestIndex(px, 15)).toBe(0);
    expect(nearestIndex(px, 16)).toBe(1);
    expect(nearestIndex(px, 31)).toBe(2);
    expect(nearestIndex(px, 999)).toBe(2);
  });
  it('handles 68 entries clustered on a few days (spread by 5px)', () => {
    const days = [100, 100, 100, 300, 300, 600];
    const px: number[] = [];
    const seen = new Map<number, number>();
    for (let i = 0; i < 68; i++) {
      const d = days[i % days.length];
      const k = seen.get(d) ?? 0; seen.set(d, k + 1);
      px.push(d + k * 5);
    }
    // every bar is reachable: aiming exactly at its pixel yields itself
    px.forEach((x, i) => expect(px[nearestIndex(px, x)]).toBe(px[i]));
    expect(new Set(px).size).toBe(68);
    px.forEach((x, i) => expect(nearestIndex(px, x)).toBe(i));
  });
});

describe('indicesInRange', () => {
  const px = [10, 20, 30, 40];
  it('is inclusive and order-agnostic', () => {
    expect(indicesInRange(px, 20, 30)).toEqual([1, 2]);
    expect(indicesInRange(px, 30, 20)).toEqual([1, 2]);
    expect(indicesInRange(px, 21, 29)).toEqual([]);
    expect(indicesInRange(px, 0, 100)).toEqual([0, 1, 2, 3]);
  });
});

describe('monthBounds', () => {
  it('returns UTC month start and next month start', () => {
    const [a, b] = monthBounds(dayTs('2026-02-14'));
    expect(new Date(a).toISOString()).toBe('2026-02-01T00:00:00.000Z');
    expect(new Date(b).toISOString()).toBe('2026-03-01T00:00:00.000Z');
    const [c, d] = monthBounds(dayTs('2025-12-31'));
    expect(new Date(c).toISOString()).toBe('2025-12-01T00:00:00.000Z');
    expect(new Date(d).toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });
});

describe('formatting', () => {
  it('readout', () => expect(formatReadout(dayTs('2026-03-14'))).toBe('MAR 14, 2026'));
  it('range', () => {
    expect(formatRange(dayTs('2026-01-03'), dayTs('2026-02-20'))).toBe('Jan 3 – Feb 20, 2026');
    expect(formatRange(dayTs('2026-02-20'), dayTs('2026-01-03'))).toBe('Jan 3 – Feb 20, 2026');
    expect(formatRange(dayTs('2025-12-28'), dayTs('2026-01-03'))).toBe('Dec 28, 2025 – Jan 3, 2026');
    expect(formatRange(dayTs('2026-01-03'), dayTs('2026-01-03') + 3 * 3600_000)).toBe('Jan 3, 2026');
  });
  it('words', () => {
    expect(formatWords(840)).toBe('840');
    expect(formatWords(4230)).toBe('4.2k');
    expect(formatWords(31_400)).toBe('31k');
  });
  it('summary', () => {
    const picks = [{ t: dayTs('2026-01-03'), words: 20_000 }, { t: dayTs('2026-02-20'), words: 11_000 }];
    expect(summarize(picks, 0, 1)).toBe('2 entries · Jan 3 – Feb 20, 2026 · 31k words');
    expect(summarize([picks[0]], 0, 1)).toBe('1 entry · Jan 3, 2026 · 20k words');
    expect(summarize([], dayTs('2026-06-01'), dayTs('2026-06-01') + 9 * DAY)).toBe('No entries · Jun 1 – Jun 10, 2026');
  });
});
