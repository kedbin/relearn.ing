import { describe, it, expect } from 'vitest';
import { splitTitle, demoLabel } from '../projectMeta';

describe('splitTitle', () => {
  it('splits on the first colon', () => {
    expect(splitTitle('relearn.ing: The Cognitive Architecture Platform')).toEqual({
      name: 'relearn.ing',
      subtitle: 'The Cognitive Architecture Platform',
    });
  });
  it('keeps later colons in the subtitle', () => {
    expect(splitTitle('A: b: c')).toEqual({ name: 'A', subtitle: 'b: c' });
  });
  it('handles titles without a colon', () => {
    expect(splitTitle('  Plain  ')).toEqual({ name: 'Plain', subtitle: '' });
  });
});

describe('demoLabel', () => {
  it('labels video hosts', () => {
    expect(demoLabel('https://youtu.be/abc')).toBe('Demo video');
    expect(demoLabel('https://youtube.com/shorts/x')).toBe('Demo video');
    expect(demoLabel('https://www.youtube.com/shorts/x')).toBe('Demo video');
  });
  it('labels sites as Live', () => {
    expect(demoLabel('https://relearn.ing')).toBe('Live');
  });
});
