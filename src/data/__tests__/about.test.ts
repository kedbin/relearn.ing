import { describe, it, expect } from 'vitest';
import { monthKey, partitionCerts, certs, type Cert } from '../about';

describe('monthKey', () => {
  it('orders month-year strings', () => {
    expect(monthKey('Feb 2026')).toBeGreaterThan(monthKey('Jan 2026'));
    expect(monthKey('Jan 2026')).toBeGreaterThan(monthKey('Dec 2025'));
  });
  it('accepts bare years and full month names', () => {
    expect(monthKey('2017')).toBe(2017 * 12);
    expect(monthKey('September 2026')).toBe(monthKey('Sep 2026'));
  });
  it('returns 0 for junk', () => {
    expect(monthKey('soon')).toBe(0);
  });
});

describe('partitionCerts', () => {
  const mk = (name: string, issued: string, featured: boolean): Cert => ({ issuer: 'X', name, issued, featured, url: '#' });
  it('splits by featured flag, newest first', () => {
    const { featured, rest } = partitionCerts([
      mk('a', 'Dec 2023', true), mk('b', 'Feb 2026', true), mk('c', 'Apr 2021', false), mk('d', 'Sep 2026', false),
    ]);
    expect(featured.map((c) => c.name)).toEqual(['b', 'a']);
    expect(rest.map((c) => c.name)).toEqual(['d', 'c']);
  });
  it('keeps every real cert', () => {
    const { featured, rest } = partitionCerts(certs);
    expect(featured.length + rest.length).toBe(certs.length);
    expect(certs.every((c) => monthKey(c.issued) > 0 && c.url.startsWith('https://'))).toBe(true);
  });
});
