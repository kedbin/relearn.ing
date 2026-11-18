/**
 * Pure geometry for the ink theme switch: an irregular "ink blot" polygon that
 * grows from a point until it covers the viewport.
 */

/** Smallest radius from (x, y) that covers a w×h viewport, i.e. distance to the farthest corner. */
export function coverRadius(x: number, y: number, w: number, h: number): number {
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

/** Deterministic PRNG (mulberry32) so a blot's shape is stable for a given seed. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Per-vertex radius multipliers for a blot with `n` vertices. Built from a few
 * low-frequency sine harmonics so the edge wobbles gently (ink, not a starburst).
 * Values lie in [1 - amp, 1 + amp].
 */
export function blotProfile(n: number, amp: number, seed: number): number[] {
  const r = rng(seed);
  const harmonics = [2, 3, 5].map((k, i) => ({ k, phase: r() * Math.PI * 2, w: [0.5, 0.32, 0.18][i] }));
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const v = harmonics.reduce((s, h) => s + h.w * Math.sin(h.k * t + h.phase), 0);
    return 1 + amp * v;
  });
}

/**
 * CSS `polygon()` for a blot centred on (x, y) with base radius `radius`.
 * Every keyframe must use the same vertex count so the browser can interpolate.
 */
export function blotPolygon(x: number, y: number, radius: number, profile: number[]): string {
  const n = profile.length;
  const pts = profile.map((m, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = radius * m;
    return `${(x + r * Math.cos(a)).toFixed(1)}px ${(y + r * Math.sin(a)).toFixed(1)}px`;
  });
  return `polygon(${pts.join(', ')})`;
}

export interface BlotFrame {
  clipPath: string;
  offset: number;
}

/**
 * Keyframes for the spreading blot. It starts as a pinpoint with a strong wobble
 * and relaxes towards a circle as it spreads, the way a drop settles in water.
 * The last frame is oversized by the wobble so even the "dents" clear the corners.
 */
export function blotKeyframes(x: number, y: number, w: number, h: number, seed: number, n = 48): BlotFrame[] {
  const R = coverRadius(x, y, w, h);
  const stops = [
    { offset: 0, r: 0, amp: 0.3 },
    { offset: 0.45, r: R * 0.55, amp: 0.16 },
    { offset: 1, r: R * 1.2, amp: 0.05 },
  ];
  return stops.map((s, i) => ({
    offset: s.offset,
    clipPath: blotPolygon(x, y, s.r, blotProfile(n, s.amp, seed + i)),
  }));
}
