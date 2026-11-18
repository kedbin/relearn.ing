import { describe, expect, it } from 'vitest';
import { journalRecordPoints, matchesJournalFilters, readJournalFilters, writeJournalFilters } from '../JournalFilter';

describe('journal record', () => {
  it('spaces bars by elapsed time and separates entries on the same day', () => {
    const day = 86_400_000;
    const [first, next, twin, last] = journalRecordPoints([
      { date: 0, words: 16 },
      { date: day * 10, words: 4 },
      { date: day * 10, words: 1 },
      { date: day * 40, words: 0 },
    ]);
    expect(last.position - next.position).toBeCloseTo((next.position - first.position) * 3, 2);
    expect(twin.position).toBe(next.position);
    expect(twin.offset - next.offset).toBe(3);
    expect([first.height, next.height, twin.height, last.height]).toEqual([100, 50, 25, 3]);
  });

  it('handles an empty record', () => {
    expect(journalRecordPoints([])).toEqual([]);
  });
});

describe('journal filter query', () => {
  it('round-trips Unicode search and nondefault controls without losing unrelated parameters', () => {
    const params = new URLSearchParams('campaign=journal');
    const filters = { domain: 'life', query: '睡眠 & notes', audio: true, video: true, sort: 'oldest', from: '2026-01-03', to: '2026-02-20' } as const;
    writeJournalFilters(params, filters);
    expect(params.get('campaign')).toBe('journal');
    expect(readJournalFilters(new URLSearchParams(params.toString()))).toEqual(filters);
  });

  it('ignores invalid options and removes defaults and whitespace-only search from URLs', () => {
    const params = new URLSearchParams('d=unknown&q=+++&a=true&v=0&sort=ascending&from=yesterday&to=2026-13');
    const filters = readJournalFilters(params);
    expect(filters).toEqual({ domain: 'all', query: '   ', audio: false, video: false, sort: 'newest', from: '', to: '' });
    writeJournalFilters(params, filters);
    expect(params.toString()).toBe('');
  });
});

describe('journal row matching', () => {
  const row = { domain: 'life', audio: '1', video: '0', search: 'the art of rest\na note about sleep\nhealth' };
  const state = readJournalFilters(new URLSearchParams('d=life&a=1'));

  it('searches indexed title, summary and topic substrings', () => {
    for (const needle of ['art of rest', 'sleep', 'health', '']) {
      expect(matchesJournalFilters(row, state, needle)).toBe(true);
    }
    expect(matchesJournalFilters(row, state, 'engineering')).toBe(false);
  });

  it('intersects domain and media requirements', () => {
    expect(matchesJournalFilters(row, { ...state, video: true }, 'sleep')).toBe(false);
    expect(matchesJournalFilters(row, { ...state, domain: 'work' }, 'sleep')).toBe(false);
    expect(matchesJournalFilters({ ...row, audio: '0' }, state, 'sleep')).toBe(false);
  });

  it('limits rows to an inclusive date window', () => {
    const win = { ...state, from: '2026-01-03', to: '2026-02-20' };
    expect(matchesJournalFilters({ ...row, date: '2026-01-03' }, win, '')).toBe(true);
    expect(matchesJournalFilters({ ...row, date: '2026-02-20' }, win, '')).toBe(true);
    expect(matchesJournalFilters({ ...row, date: '2026-02-21' }, win, '')).toBe(false);
    expect(matchesJournalFilters({ ...row, date: '2026-01-02' }, { ...state, from: '2026-01-03', to: '' }, '')).toBe(false);
  });
});
