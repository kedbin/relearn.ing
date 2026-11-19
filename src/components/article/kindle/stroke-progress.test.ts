import { describe, expect, it } from 'vitest';
import { CHAPTERS, strokeProgress } from './stroke-progress';
import { INK, MARK, pointAt, sample } from './ink-paths';

describe('the illustrative Scribe sequence', () => {
  it('starts blank, with the stylus at rest', () => {
    expect(strokeProgress(0)).toMatchObject({ pen: 0, mirror: 0, paper: 0, mark: 0, markMirror: 0, zoom: 1, stylus: 0, focus: 0, push: 0, frame: 0 });
  });

  it('shows local ink before the mirror', () => {
    expect(strokeProgress(25)).toMatchObject({ pen: 1, mirror: 0, frame: 1 });
    expect(strokeProgress(31)).toMatchObject({ signal: 1 });
    expect(strokeProgress(31).mirror).toBeLessThan(.1);
    expect(strokeProgress(39).mirror).toBe(.5);
    expect(strokeProgress(50)).toMatchObject({ pen: 1, mirror: 1, paper: 0, frame: 2 });
  });

  it('lays down the reference before the markup, then zooms', () => {
    expect(strokeProgress(64)).toMatchObject({ paper: 1, mark: 0 });
    expect(strokeProgress(72)).toMatchObject({ mark: 1 });
    expect(strokeProgress(72).markMirror).toBeLessThan(1);
    expect(strokeProgress(75)).toMatchObject({ paper: 1, mark: 1, markMirror: 1, zoom: 1, frame: 3 });
    expect(strokeProgress(100)).toMatchObject({ paper: 1, mark: 1, zoom: 1.45, frame: 4 });
  });

  it('only puts the stylus on the page while it draws', () => {
    expect(strokeProgress(12).stylus).toBe(1);
    expect(strokeProgress(40).stylus).toBe(0);
    expect(strokeProgress(68)).toMatchObject({ stylus: 1, stylusOn: 'mark' });
    expect(strokeProgress(100).stylus).toBe(0);
  });

  it('maps every chapter to its own frame', () => {
    expect(CHAPTERS.map((at) => strokeProgress(at).frame)).toEqual([0, 1, 2, 3, 4]);
  });

  it('clamps invalid and out-of-range positions', () => {
    expect(strokeProgress(Infinity)).toEqual(strokeProgress(0));
    expect(strokeProgress(-5)).toEqual(strokeProgress(0));
    expect(strokeProgress(105)).toEqual(strokeProgress(100));
  });
});

describe('the ink paths', () => {
  it('sample the same strokes as the static sheet', () => {
    const ink = sample(INK);
    expect(ink.length).toBeGreaterThan(40);
    expect(pointAt(ink, 0)).toMatchObject({ x: 45, y: 93 });
    expect(pointAt(ink, 1)).toMatchObject({ x: 115, y: 125 });
    expect(pointAt(sample(MARK), 0)).toMatchObject({ x: 138, y: 133 });
  });

  it('separates the arrowhead from the shaft', () => {
    const ink = sample(INK);
    expect(ink.some((p) => p.lift)).toBe(true);
  });
});
