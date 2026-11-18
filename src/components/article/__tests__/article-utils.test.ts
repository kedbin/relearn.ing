import { describe, it, expect } from 'vitest';
import {
  tocHeadings, shouldShowToc, bodyEmbedsVideo, formatClock, minutesLabel, nextSpeed, speedLabel,
} from '../article-utils';

const H = (depth: number, text = 'x') => ({ depth, slug: text.toLowerCase(), text });

describe('toc', () => {
  it('keeps only h2/h3', () => {
    const out = tocHeadings([H(1), H(2, 'A'), H(3, 'B'), H(4, 'C')]);
    expect(out.map((h) => h.text)).toEqual(['A', 'B']);
  });
  it('requires 3+ h2s', () => {
    expect(shouldShowToc([H(2), H(2), H(3), H(3)])).toBe(false);
    expect(shouldShowToc([H(2), H(2), H(2)])).toBe(true);
  });
});

describe('bodyEmbedsVideo', () => {
  it('detects nocookie and regular embeds', () => {
    expect(bodyEmbedsVideo('<iframe src="https://www.youtube-nocookie.com/embed/abc_123"></iframe>', 'abc_123')).toBe(true);
    expect(bodyEmbedsVideo('<iframe class="x" src="https://youtube.com/embed/abc"></iframe>', 'abc')).toBe(true);
  });
  it('ignores plain links and missing data', () => {
    expect(bodyEmbedsVideo('[watch](https://www.youtube.com/watch?v=abc)', 'abc')).toBe(false);
    expect(bodyEmbedsVideo(undefined, 'abc')).toBe(false);
    expect(bodyEmbedsVideo('<iframe src="youtube.com/embed/abc">', undefined)).toBe(false);
  });
});

describe('audio formatting', () => {
  it('formats clocks', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(65.9)).toBe('1:05');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(NaN)).toBe('0:00');
    expect(formatClock(Infinity)).toBe('0:00');
  });
  it('labels minutes', () => {
    expect(minutesLabel(840)).toBe('14 min');
    expect(minutesLabel(20)).toBe('1 min');
    expect(minutesLabel(NaN)).toBe('');
  });
  it('cycles speeds', () => {
    expect(nextSpeed(1)).toBe(1.25);
    expect(nextSpeed(1.5)).toBe(2);
    expect(nextSpeed(2)).toBe(1);
    expect(nextSpeed(3)).toBe(1);
    expect(speedLabel(1.25)).toBe('1.25×');
  });
});
