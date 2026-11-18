import { describe, it, expect } from 'vitest';

import { entryNumber, entryNo, domainOf, topicOf, wordCount, readingTime, formatDate, relatedEntries, neighbours, siteStats } from '../content';

const mk = (id: string, date: string, category: string, body = 'word '.repeat(460), extra: Record<string, unknown> = {}) =>
  ({ id, body, data: { title: id, date, summary: '', highlights: [], status: '', category, ...extra } }) as any;

describe('content helpers', () => {
  it('parses entry numbers', () => {
    expect(entryNumber('entry-068')).toBe(68);
    expect(entryNo('entry-7')).toBe('007');
  });

  it('collapses categories into three domains', () => {
    expect(domainOf('Relearn Life / Systems')).toBe('Life');
    expect(domainOf('Relearn Learning / Cognitive Engineering')).toBe('Life');
    expect(domainOf('Relearn Work / Career Engineering')).toBe('Work');
    expect(domainOf('AI Engineering / Agent Platforms')).toBe('Engineering');
    expect(domainOf('Relearn Engineering / DevOps')).toBe('Engineering');
    expect(topicOf('Relearn Engineering / DevOps')).toBe('DevOps');
  });

  it('counts words without code blocks and estimates reading time', () => {
    expect(wordCount('one two\n```js\nconst x = 1\n```\nthree')).toBe(3);
    expect(readingTime('word '.repeat(460))).toBe(2);
    expect(readingTime('')).toBe(1);
  });

  it('formats dates in UTC', () => {
    expect(formatDate('2026-11-04')).toBe('Nov 4, 2026');
  });

  const all = [
    mk('entry-004', '2026-03-01', 'Relearn Life / Systems'),
    mk('entry-003', '2026-02-01', 'Relearn Engineering / DevOps', 'w', { audioUrl: 'x' }),
    mk('entry-002', '2026-01-01', 'Relearn Life / Systems'),
    mk('entry-001', '2025-12-01', 'Relearn Engineering / DevOps'),
  ];

  it('ranks related entries by topic first', () => {
    const rel = relatedEntries(all[0], all, 2);
    expect(rel[0].id).toBe('entry-002');
    expect(rel.map((e: any) => e.id)).not.toContain('entry-004');
  });

  it('finds chronological neighbours (list is newest-first)', () => {
    const { prev, next } = neighbours(all[1], all);
    expect(prev?.id).toBe('entry-002');
    expect(next?.id).toBe('entry-004');
  });

  it('computes honest site stats', () => {
    const s = siteStats(all);
    expect(s.entries).toBe(4);
    expect(s.narrated).toBe(1);
    expect(s.firstDate).toBe('2025-12-01');
  });
});
