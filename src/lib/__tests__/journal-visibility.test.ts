import { describe, expect, it } from 'vitest';
import { isJournalVisible, visibleFdeSeries } from '../journal-visibility';

describe('journal publication boundary', () => {
  it('keeps legacy entries visible, including old Draft status labels', () => {
    const legacy = { data: { status: 'Draft' } };
    expect(isJournalVisible({ data: {} })).toBe(true);
    expect(isJournalVisible({ data: { ...legacy.data, draft: undefined } })).toBe(true);
    expect(isJournalVisible({ data: { draft: false } })).toBe(true);
  });

  it('excludes explicit drafts unless preview was deliberately enabled', () => {
    expect(isJournalVisible({ data: { draft: true } })).toBe(false);
    expect(isJournalVisible({ data: { draft: true } }, true)).toBe(true);
  });

  it('never links excluded drafts and preserves workshop order', () => {
    expect(visibleFdeSeries(['entry-065', 'entry-064']).map(e => e.id)).toEqual(['entry-065']);
    expect(visibleFdeSeries(['entry-068', 'entry-066', 'entry-065', 'entry-067']).map(e => e.day))
      .toEqual([1, 2, 3, 4]);
  });
});
