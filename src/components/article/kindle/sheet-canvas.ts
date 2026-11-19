/**
 * Canvas painters for the two screens in the studio scene. They draw the same page as
 * KindleSheet.astro (160 × 216 units) so the WebGL scene, the SVG poster and the static
 * frames show one consistent illustration.
 */
import type { ScenePalette } from './scene-palette';
import { INK, MARK, sample, type InkPoint } from './ink-paths';

export const SHEET_W = 160;
export const SHEET_H = 216;
const INK_POINTS = sample(INK);
const MARK_POINTS = sample(MARK);

export interface SheetState { ink: number; mark: number; paper: number; zoom: number }

function stroke(ctx: CanvasRenderingContext2D, points: InkPoint[], t: number) {
  if (t <= 0) return;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (i > 0 && p.at > t && !p.lift) {
      const a = points[i - 1];
      const k = (t - a.at) / ((p.at - a.at) || 1);
      ctx.lineTo(a.x + (p.x - a.x) * k, a.y + (p.y - a.y) * k);
      break;
    }
    if (i > 0 && p.lift && p.at > t) break;
    if (i === 0 || p.lift) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

/** Paint one page into the current transform (160 × 216 space). */
export function paintSheet(palette: ScenePalette, ctx: CanvasRenderingContext2D, s: SheetState) {
  ctx.save();
  ctx.fillStyle = palette['bg'];
  ctx.fillRect(0, 0, SHEET_W, SHEET_H);
  const cx = SHEET_W * .65, cy = SHEET_H * .63;
  ctx.translate(cx, cy);
  ctx.scale(s.zoom, s.zoom);
  ctx.translate(-cx, -cy);

  ctx.strokeStyle = palette['surface-2'];
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let y = 24; y < SHEET_H; y += 24) { ctx.moveTo(0, y); ctx.lineTo(SHEET_W, y); }
  ctx.moveTo(18, 0); ctx.lineTo(18, SHEET_H);
  ctx.stroke();

  if (s.paper > 0) {
    ctx.globalAlpha = s.paper;
    ctx.fillStyle = palette['bg'];
    ctx.fillRect(0, 0, SHEET_W, SHEET_H);
    ctx.strokeStyle = palette['metal'];
    ctx.beginPath(); ctx.moveTo(17, 30); ctx.lineTo(143, 30); ctx.moveTo(17, 188); ctx.lineTo(143, 188); ctx.stroke();
    ctx.fillStyle = palette['text'];
    ctx.font = '8px ui-monospace, monospace';
    ctx.fillText('JOB HANDOFF', 17, 23);
    ctx.font = '6.8px ui-monospace, monospace';
    ctx.fillText('DIAGRAM / SAMPLE', 17, 201);
    ctx.fillStyle = palette['surface'];
    ctx.strokeStyle = palette['muted'];
    for (const [x, y] of [[17, 47], [67, 134]]) {
      ctx.beginPath(); ctx.roundRect(x, y, 77, 37, 2); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = palette['text'];
    ctx.font = '12px ui-monospace, monospace';
    ctx.fillText('Queue', 24, 65);
    ctx.fillText('Worker', 74, 152);
    ctx.strokeStyle = palette['muted'];
    ctx.beginPath();
    ctx.moveTo(24, 73); ctx.lineTo(54, 73); ctx.moveTo(24, 77); ctx.lineTo(42, 77);
    ctx.moveTo(74, 160); ctx.lineTo(104, 160); ctx.moveTo(74, 164); ctx.lineTo(92, 164);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.strokeStyle = palette['accent'];
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  stroke(ctx, INK_POINTS, s.ink);
  stroke(ctx, MARK_POINTS, s.mark);
  ctx.restore();
}

/** The e-ink panel: just the page. */
export function paintScribe(palette: ScenePalette, canvas: HTMLCanvasElement, s: SheetState) {
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(canvas.width / SHEET_W, 0, 0, canvas.height / SHEET_H, 0, 0);
  paintSheet(palette, ctx, s);
}

/** The laptop: a browser window showing the mirrored page, letterboxed like Live View. */
export function paintBrowser(palette: ScenePalette, canvas: HTMLCanvasElement, s: SheetState) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width, h = canvas.height;
  const bar = Math.round(h * .07);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = palette['chassis'];
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = palette['surface-2'];
  ctx.fillRect(0, 0, w, bar);
  ctx.fillStyle = palette['muted'];
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(bar * .55 + i * bar * .42, bar / 2, bar * .11, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = palette['surface'];
  ctx.beginPath(); ctx.roundRect(w * .3, bar * .22, w * .4, bar * .56, bar * .28); ctx.fill();
  ctx.fillStyle = palette['muted'];
  ctx.font = `600 ${Math.round(bar * .36)}px ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Live View', w / 2, bar / 2 + 1);
  const pad = h * .035;
  const ph = h - bar - pad * 2;
  const pw = ph * SHEET_W / SHEET_H;
  ctx.save();
  ctx.translate((w - pw) / 2, bar + pad);
  ctx.scale(pw / SHEET_W, ph / SHEET_H);
  ctx.beginPath(); ctx.rect(0, 0, SHEET_W, SHEET_H); ctx.clip();
  paintSheet(palette, ctx, s);
  ctx.restore();
}

/** Soft contact shadow (blurred rounded rectangle), drawn once. */
export function paintShadow(palette: ScenePalette, canvas: HTMLCanvasElement, inset: number, radius: number, blur: number) {
  const ctx = canvas.getContext('2d')!;
  const { width: w, height: h } = canvas;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = palette['scrim'];
  ctx.shadowColor = palette['scrim'];
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = w * 4; // draw the shape off canvas so only its blur lands
  ctx.beginPath();
  ctx.roundRect(inset - w * 4, inset, w - inset * 2, h - inset * 2, radius);
  ctx.fill();
}

/** Keyboard well: a quiet grid of keys. */
export function paintKeys(palette: ScenePalette, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const { width: w, height: h } = canvas;
  ctx.fillStyle = palette['metal'];
  ctx.fillRect(0, 0, w, h);
  const rows = 6, cols = 14, gap = w * .006;
  const kh = (h - gap * (rows + 1)) / rows;
  const kw = (w - gap * (cols + 1)) / cols;
  ctx.fillStyle = palette['chassis'];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 5 && c > 3 && c < 9) continue;
      ctx.beginPath(); ctx.roundRect(gap + c * (kw + gap), gap + r * (kh + gap), kw, kh, kw * .12); ctx.fill();
    }
  }
  ctx.beginPath(); ctx.roundRect(gap + 4 * (kw + gap), gap + 5 * (kh + gap), kw * 5 + gap * 4, kh, kw * .12); ctx.fill();
}
