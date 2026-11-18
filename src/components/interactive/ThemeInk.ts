/**
 * Ink theme switch. When the theme toggles, the new theme spreads out from the
 * toggle button like a drop of ink in water: a View Transition whose new
 * snapshot is revealed through a growing, slightly irregular blot.
 *
 * Wiring (coordinator): in Header.astro's <script>, add
 *   import { init as initThemeInk } from '../interactive/ThemeInk';
 *   initThemeInk();
 * It's idempotent, so calling it again on `astro:page-load` is harmless.
 *
 * It intercepts clicks on #theme-toggle in the capture phase (on `document`, so
 * it runs before any listener on the button itself) and calls
 * stopImmediatePropagation, which replaces the header's own handler. The
 * persisted value is identical (`localStorage.theme` = 'dark' | 'light'), so the
 * pre-paint script in Layout.astro keeps working.
 *
 * Fallbacks: no View Transitions API or prefers-reduced-motion → instant switch.
 */
import { blotKeyframes } from './ink-geometry';

const DURATION = 560;
const EASE_OUT_QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const STYLE_ID = 'theme-ink-style';
const FLAG = '__themeInkBound';

type VT = { ready: Promise<void>; finished: Promise<void> };
type DocVT = Document & { startViewTransition?: (cb: () => void) => VT };

let seed = 7;
let busy = false;

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  // Only while switching: one root snapshot (no per-element names from Astro's
  // page transitions), no default crossfade, and no colour transitions fighting the reveal.
  s.textContent = `
html.ink-switch *, html.ink-switch *::before, html.ink-switch *::after { view-transition-name: none !important; transition: none !important; }
html.ink-switch::view-transition-old(root), html.ink-switch::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html.ink-switch::view-transition-group(root) { animation: none; }
`;
  document.head.appendChild(s);
}

export function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {
    /* storage blocked: the switch still works for this page */
  }
}

export function toggleTheme(origin?: { x: number; y: number }): void {
  const root = document.documentElement;
  const dark = !root.classList.contains('dark');
  const d = document as DocVT;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!d.startViewTransition || reduce || busy) {
    applyTheme(dark);
    return;
  }

  ensureStyle();
  const w = innerWidth;
  const h = innerHeight;
  const x = origin?.x ?? w - 40;
  const y = origin?.y ?? 32;
  const frames = blotKeyframes(x, y, w, h, (seed = (seed * 31 + 11) % 9973));

  busy = true;
  root.classList.add('ink-switch');
  let vt: VT;
  try {
    vt = d.startViewTransition(() => applyTheme(dark));
  } catch {
    root.classList.remove('ink-switch');
    busy = false;
    applyTheme(dark);
    return;
  }

  vt.ready
    .then(() => {
      root.animate(
        frames.map((f) => ({ clipPath: f.clipPath, offset: f.offset })),
        { duration: DURATION, easing: EASE_OUT_QUINT, pseudoElement: '::view-transition-new(root)', fill: 'both' },
      );
    })
    .catch(() => {});

  vt.finished.finally(() => {
    root.classList.remove('ink-switch');
    busy = false;
  });
}

function onClickCapture(e: MouseEvent) {
  const btn = (e.target as Element | null)?.closest?.('#theme-toggle');
  if (!btn) return;
  e.stopImmediatePropagation();
  e.preventDefault();
  const r = btn.getBoundingClientRect();
  toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
}

/** Bind once per document. Safe to call on every `astro:page-load`. */
export function init(): void {
  const w = window as unknown as Record<string, boolean>;
  if (w[FLAG]) return;
  w[FLAG] = true;
  document.addEventListener('click', onClickCapture, true);
}
