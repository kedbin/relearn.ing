import { describe, expect, it } from 'vitest';
import type { EntryLite } from '../../../../lib/content';
import { PAGES, RECENT_COUNT, hrefOf, parseEntryNumber, rankItems } from '../search';

const entry = (no: string, title: string): EntryLite => ({
  id: `entry-${no}`,
  no,
  title,
  summary: '',
  date: '2025-01-01',
  domain: 'Engineering',
  topic: 'Testing',
  minutes: 3,
  audio: false,
  video: false,
});

const data = Array.from({ length: 10 }, (_, i) => entry(String(10 - i).padStart(3, '0'), `Title ${10 - i}`));

describe('parseEntryNumber', () => {
  it.each([
    ['42', 42],
    ['042', 42],
    [' 7 ', 7],
    ['#42', 42],
    ['№ 42', 42],
    ['№42', 42],
    ['no. 42', 42],
    ['No 3', 3],
  ])('%s -> %s', (q, n) => expect(parseEntryNumber(q)).toBe(n));

  it.each(['', 'sisyphus', '1234', '4a', 'no.'])('%s -> null', (q) => expect(parseEntryNumber(q)).toBeNull());
});

describe('rankItems', () => {
  it('empty query lists recent entries then pages', () => {
    const items = rankItems('  ', data);
    expect(items).toHaveLength(RECENT_COUNT + PAGES.length);
    expect(items.slice(0, RECENT_COUNT).every((i) => i.kind === 'entry')).toBe(true);
    expect(items.slice(RECENT_COUNT)).toEqual(PAGES);
  });

  it('puts an exact number match first and dedupes fuzzy hits', () => {
    const three = data.find((e) => e.no === '003')!;
    const other = data[0];
    const items = rankItems('№ 3', data, () => [other, three]);
    expect(items.map((i) => (i.kind === 'entry' ? i.e.no : i.title))).toEqual(['003', other.no]);
  });

  it('includes pages whose title contains the query', () => {
    const items = rankItems('proj', data);
    expect(items).toEqual([PAGES[1]]);
  });

  it('returns nothing for an unmatched query', () => {
    expect(rankItems('zzzz', data, () => [])).toEqual([]);
  });

  it('hrefOf maps entries to journal urls', () => {
    expect(hrefOf({ kind: 'entry', e: data[0] })).toBe('/journal/entry-010/');
    expect(hrefOf(PAGES[3])).toBe('/rss.xml');
  });
});
