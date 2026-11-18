import { describe, it, expect } from 'vitest';
import {
  mod, stageAngle, pointOnCircle, forwardSteps, arcLength, arcDash, arcPath,
  travelDuration, easeInOutCubic, cycleProgress, trailLengths, LOOP_START,
} from '../loop-geometry';
import { coverRadius, blotProfile, blotPolygon, blotKeyframes, rng } from '../ink-geometry';
import { loopStages } from '../loop-data';

describe('loop geometry', () => {
  it('mod is always positive', () => {
    expect(mod(-1, 4)).toBe(3);
    expect(mod(5, 4)).toBe(1);
    expect(mod(-450, 360)).toBe(270);
  });

  it('spaces stages evenly clockwise from the start angle', () => {
    expect([0, 1, 2, 3].map((i) => stageAngle(i, 4))).toEqual([-90, 0, 90, 180]);
    expect([0, 1, 2, 3].map((i) => stageAngle(i, 4, LOOP_START))).toEqual([-135, -45, 45, 135]);
  });

  it('places points on the circle (SVG y-down)', () => {
    expect(pointOnCircle(200, 200, 100, -90)).toEqual({ x: 200, y: 100 });
    expect(pointOnCircle(200, 200, 100, 0)).toEqual({ x: 300, y: 200 });
    expect(pointOnCircle(200, 200, 100, 90)).toEqual({ x: 200, y: 300 });
    const p = pointOnCircle(0, 0, 10, 45);
    expect(Math.hypot(p.x, p.y)).toBeCloseTo(10, 2);
  });

  it('only travels forward round the loop', () => {
    expect(forwardSteps(0, 1, 4)).toBe(1);
    expect(forwardSteps(3, 0, 4)).toBe(1); // Log → Friction closes the loop
    expect(forwardSteps(1, 0, 4)).toBe(3); // going "back" means going all the way round
    expect(forwardSteps(2, 2, 4)).toBe(0);
  });

  it('computes arc length', () => {
    expect(arcLength(10, 180)).toBeCloseTo(Math.PI * 10);
    expect(arcLength(10, -90)).toBeCloseTo(Math.PI * 5);
  });

  it('builds dash patterns that start at the arc start (pathLength 360)', () => {
    expect(arcDash(0, 90)).toEqual({ dasharray: '90 270', dashoffset: '0' });
    expect(arcDash(-135, -45)).toEqual({ dasharray: '90 270', dashoffset: '-225' });
    expect(arcDash(10, 10)).toEqual({ dasharray: '0 360', dashoffset: '-10' });
    expect(arcDash(0, 500).dasharray).toBe('360 0'); // clamps to a full ring
    expect(arcDash(5, 0).dasharray).toBe('0 360'); // never negative
  });

  it('draws arc paths with the right flags', () => {
    expect(arcPath(0, 0, 10, 0, 90)).toBe('M 10 0 A 10 10 0 0 1 0 10');
    expect(arcPath(0, 0, 10, 0, 270)).toContain(' 0 1 1 ');
    expect(arcPath(0, 0, 10, 0, 0)).toBe('');
    expect(arcPath(0, 0, 10, 0, 360).match(/A /g)).toHaveLength(2);
  });

  it('scales travel time sub-linearly and caps it', () => {
    expect(travelDuration(0)).toBe(0);
    expect(travelDuration(1)).toBeLessThan(travelDuration(2));
    expect(travelDuration(3)).toBeLessThanOrEqual(1400);
    expect(travelDuration(3) / travelDuration(1)).toBeLessThan(3);
  });

  it('eases from 0 to 1 symmetrically', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
    expect(easeInOutCubic(-1)).toBe(0);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1);
  });

  it('reports progress round the current cycle', () => {
    expect(cycleProgress(-90)).toBe(0);
    expect(cycleProgress(270)).toBe(0);
    expect(cycleProgress(0)).toBe(90);
  });

  it('caps trail segments by distance travelled', () => {
    expect(trailLengths(100, 80, 4)).toEqual([20, 40, 60, 80]);
    expect(trailLengths(30, 80, 4)).toEqual([20, 30, 30, 30]);
    expect(trailLengths(-5, 80, 2)).toEqual([0, 0]);
  });
});

describe('ink blot geometry', () => {
  it('covers the farthest corner', () => {
    expect(coverRadius(0, 0, 300, 400)).toBe(500);
    expect(coverRadius(150, 200, 300, 400)).toBe(250);
    expect(coverRadius(290, 10, 300, 400)).toBeCloseTo(Math.hypot(290, 390));
  });

  it('is deterministic per seed', () => {
    const a = rng(42), b = rng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(blotProfile(12, 0.2, 1)).toEqual(blotProfile(12, 0.2, 1));
    expect(blotProfile(12, 0.2, 1)).not.toEqual(blotProfile(12, 0.2, 2));
  });

  it('keeps the wobble within its amplitude', () => {
    const p = blotProfile(64, 0.25, 9);
    expect(Math.min(...p)).toBeGreaterThanOrEqual(0.75);
    expect(Math.max(...p)).toBeLessThanOrEqual(1.25);
  });

  it('emits polygons with a stable vertex count so keyframes interpolate', () => {
    const frames = blotKeyframes(100, 50, 1440, 900, 3, 32);
    expect(frames.map((f) => f.offset)).toEqual([0, 0.45, 1]);
    for (const f of frames) expect(f.clipPath.split(',')).toHaveLength(32);
    expect(blotPolygon(0, 0, 10, [1, 1, 1, 1])).toBe('polygon(10.0px 0.0px, 0.0px 10.0px, -10.0px 0.0px, -0.0px -10.0px)');
  });

  it('ends large enough to clear the viewport even at the dents', () => {
    const [x, y, w, h] = [1400, 32, 1440, 900];
    const last = blotKeyframes(x, y, w, h, 5, 48).at(-1)!;
    const pts = last.clipPath.slice(8, -1).split(', ').map((s) => s.split(' ').map(parseFloat));
    const minR = Math.min(...pts.map(([px, py]) => Math.hypot(px - x, py - y)));
    expect(minR).toBeGreaterThanOrEqual(coverRadius(x, y, w, h));
  });
});

describe('loop data', () => {
  it('has four stages in loop order, each with a distinct example and rule', () => {
    expect(loopStages.map((s) => s.key)).toEqual(['friction', 'hypothesis', 'experiment', 'log']);
    expect(new Set(loopStages.map((s) => s.example.id)).size).toBe(4);
    expect(loopStages.map((s) => s.rule).sort()).toEqual([0, 1, 2, 3]);
    for (const s of loopStages) expect(s.example.id).toMatch(/^entry-\d{3}$/);
  });
});
