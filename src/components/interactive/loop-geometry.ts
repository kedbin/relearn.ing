/**
 * Pure geometry for the relearning-loop ring.
 *
 * Conventions: angles are in degrees, measured clockwise from 3 o'clock (SVG's
 * y-down coordinates), so -90 is 12 o'clock. Stage 0 sits at the top and the
 * loop runs clockwise. Ring strokes use `pathLength="360"`, so dash lengths are
 * also in degrees.
 */

export interface Point {
  x: number;
  y: number;
}

/** Angle of the top of the ring, where stage 0 sits. */
export const START_ANGLE = -90;

/**
 * Where the loop drawing puts stage 0: top-left (−135°). With four stages this sets
 * the nodes on the diagonals, so each label opens towards its own corner of the dial.
 */
export const LOOP_START = -135;

/** Always-positive modulo. */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** Angle of stage `i` of `n`, evenly spaced clockwise from the top. */
export function stageAngle(i: number, n: number, start = START_ANGLE): number {
  return start + (360 / n) * i;
}

/** Point on a circle at `deg`. Rounded to 3 dp so SSR markup is stable. */
export function pointOnCircle(cx: number, cy: number, r: number, deg: number): Point {
  const a = (deg * Math.PI) / 180;
  const round = (v: number) => Math.round(v * 1000) / 1000 + 0; // +0 normalises -0
  return { x: round(cx + r * Math.cos(a)), y: round(cy + r * Math.sin(a)) };
}

/**
 * Stages between `from` and `to` when travelling forward around the loop.
 * The loop only runs one way, so going "back" to Friction means going all the way round.
 */
export function forwardSteps(from: number, to: number, n: number): number {
  return mod(to - from, n);
}

/** Length of an arc of `deg` degrees on a circle of radius `r`. */
export function arcLength(r: number, deg: number): number {
  return (Math.abs(deg) * Math.PI * r) / 180;
}

/**
 * Dash settings that draw the clockwise arc from angle `a` to angle `b` on a
 * circle with `pathLength="360"`. The SVG circle path starts at 3 o'clock (angle 0)
 * and runs clockwise, so a dash pattern shifted by `-a` starts exactly at `a`.
 * The pattern period is 360, so the arc wraps cleanly past 3 o'clock.
 */
export function arcDash(a: number, b: number): { dasharray: string; dashoffset: string } {
  const len = Math.max(0, Math.min(360, b - a));
  const r3 = (v: number) => String(Math.round(v * 1000) / 1000 + 0);
  return { dasharray: `${r3(len)} ${r3(360 - len)}`, dashoffset: r3(-mod(a, 360)) };
}

/** SVG path for the clockwise arc from `a0` to `a1` (degrees). */
export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const sweep = mod(a1 - a0, 360) || (a1 !== a0 ? 360 : 0);
  if (sweep === 0) return '';
  if (sweep >= 360) {
    // A full circle can't be one arc command; draw two halves.
    const p = pointOnCircle(cx, cy, r, a0);
    const q = pointOnCircle(cx, cy, r, a0 + 180);
    return `M ${p.x} ${p.y} A ${r} ${r} 0 1 1 ${q.x} ${q.y} A ${r} ${r} 0 1 1 ${p.x} ${p.y}`;
  }
  const p = pointOnCircle(cx, cy, r, a0);
  const q = pointOnCircle(cx, cy, r, a0 + sweep);
  const large = sweep > 180 ? 1 : 0;
  return `M ${p.x} ${p.y} A ${r} ${r} 0 ${large} 1 ${q.x} ${q.y}`;
}

/** Travel time for the ink dot: longer trips take a little longer, but not linearly. */
export function travelDuration(steps: number): number {
  if (steps <= 0) return 0;
  return Math.min(1400, 480 + 280 * steps);
}

export function easeInOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** How far round the current cycle the dot is, in degrees [0, 360). 0 means sitting on stage 0. */
export function cycleProgress(angle: number, start = START_ANGLE): number {
  return mod(angle - start, 360);
}

/**
 * Lengths of the stacked trail segments behind the dot. Stacking K translucent
 * segments of increasing length gives a tail that fades away from the dot.
 * Each is capped by how far the dot has travelled, so the tail never pokes
 * out behind the stage it left.
 */
export function trailLengths(travelled: number, trailDeg: number, k: number): number[] {
  const t = Math.max(0, travelled);
  return Array.from({ length: k }, (_, i) => Math.min(t, (trailDeg * (i + 1)) / k));
}
