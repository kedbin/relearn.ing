import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (className merge helper)', () => {
  it('joins conditional class values', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('dedupes conflicting tailwind classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles arrays and objects', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
  });
});
