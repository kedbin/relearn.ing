/**
 * The two pen strokes from KindleSheet.astro, as absolute segments in its 160 × 216 page space,
 * so the 3D studio draws exactly the marks the static illustrations show.
 */
type P = [number, number];
export type Segment =
  | { move: P }
  | { cubic: [P, P, P] }
  | { quad: [P, P] }
  | { line: P };

/** "M45 93C48 116 67 125 100 120q8-1 19-5m-10-6 11 6-5 10" */
export const INK: Segment[] = [
  { move: [45, 93] },
  { cubic: [[48, 116], [67, 125], [100, 120]] },
  { quad: [[108, 119], [119, 115]] },
  { move: [109, 109] },
  { line: [120, 115] },
  { line: [115, 125] },
];

/** The circle around “Worker”. */
export const MARK: Segment[] = [
  { move: [138, 133] },
  { cubic: [[137, 126], [113, 125], [97, 126]] },
  { cubic: [[76, 127], [61, 133], [59, 147]] },
  { cubic: [[56, 164], [78, 170], [100, 171]] },
  { cubic: [[122, 172], [148, 168], [151, 151]] },
  { cubic: [[153, 141], [146, 136], [132, 132]] },
];

export interface InkPoint { x: number; y: number; at: number; lift?: boolean }

/** Flatten segments to points with a normalised arc-length `at` (0–1). */
export function sample(path: Segment[], steps = 24): InkPoint[] {
  const raw: { x: number; y: number; lift?: boolean }[] = [];
  let pen: P = [0, 0];
  for (const seg of path) {
    if ('move' in seg) { pen = seg.move; raw.push({ x: pen[0], y: pen[1], lift: raw.length > 0 }); continue; }
    if ('line' in seg) { pen = seg.line; raw.push({ x: pen[0], y: pen[1] }); continue; }
    const from = pen;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, u = 1 - t;
      let x: number, y: number;
      if ('cubic' in seg) {
        const [a, b, c] = seg.cubic;
        x = u * u * u * from[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t * t * t * c[0];
        y = u * u * u * from[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t * t * t * c[1];
      } else {
        const [a, b] = seg.quad;
        x = u * u * from[0] + 2 * u * t * a[0] + t * t * b[0];
        y = u * u * from[1] + 2 * u * t * a[1] + t * t * b[1];
      }
      raw.push({ x, y });
    }
    pen = 'cubic' in seg ? seg.cubic[2] : seg.quad[1];
  }
  let length = 0;
  const lengths = raw.map((p, i) => {
    if (i > 0 && !p.lift) length += Math.hypot(p.x - raw[i - 1].x, p.y - raw[i - 1].y);
    return length;
  });
  return raw.map((p, i) => ({ ...p, at: length ? lengths[i] / length : 0 }));
}

/** Interpolated pen position at progress `t` (0–1). */
export function pointAt(points: InkPoint[], t: number): { x: number; y: number } {
  const target = Math.min(1, Math.max(0, t));
  for (let i = 1; i < points.length; i++) {
    const b = points[i];
    if (b.at >= target && !b.lift) {
      const a = points[i - 1];
      const span = b.at - a.at || 1;
      const k = (target - a.at) / span;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
  }
  const last = points[points.length - 1];
  return target <= 0 ? { x: points[0].x, y: points[0].y } : { x: last.x, y: last.y };
}
