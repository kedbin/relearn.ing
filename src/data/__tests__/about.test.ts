import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { profile, principles } from '../about';

describe('about data', () => {
  it('points to binasoy.kim for the person', () => {
    expect(profile.portfolio.href).toBe('https://binasoy.kim');
  });
  it('uses https for every outbound link', () => {
    const links = [profile.portfolio, profile.source, ...profile.social];
    expect(links.every((l) => l.href.startsWith('https://'))).toBe(true);
    expect(profile.social.map((l) => l.label)).toEqual(['GitHub', 'LinkedIn', 'Threads']);
  });
  it('ships the portrait it references', () => {
    expect(existsSync(resolve(process.cwd(), 'public', profile.photo.src.replace(/^\//, '')))).toBe(true);
  });
  it('keeps the four rules the Loop component indexes into', () => {
    expect(principles).toHaveLength(4);
  });
});
