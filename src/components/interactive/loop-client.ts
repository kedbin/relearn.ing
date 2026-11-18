/**
 * Client behaviour for Loop.astro. Turns the server-rendered stage list into a
 * tab set and drives the ink dot round the ring.
 */
import {
  easeInOutCubic,
  forwardSteps,
  mod,
  pointOnCircle,
  stageAngle,
  travelDuration,
  trailLengths,
  arcDash,
} from './loop-geometry';

const DWELL = 5000;
const TRAIL_DEG = 70;
const cleanups: Array<() => void> = [];

export function initLoop(): void {
  document.querySelectorAll<HTMLElement>('[data-loop]').forEach((root) => {
    if (root.dataset.bound) return;
    root.dataset.bound = '1';
    cleanups.push(bind(root));
  });
}

// Tear down observers and timers when Astro swaps the page out.
document.addEventListener('astro:before-swap', () => {
  while (cleanups.length) cleanups.pop()!();
});

function bind(root: HTMLElement): () => void {
  root.classList.add('loop-live');
  const n = Number(root.dataset.n) || 4;
  const R = Number(root.dataset.r);
  const C = Number(root.dataset.c);
  const START = Number(root.dataset.start);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const tabs = [...root.querySelectorAll<HTMLAnchorElement>('[data-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const nodes = [...root.querySelectorAll<SVGGElement>('[data-node]')];
  const dot = root.querySelector<SVGGElement>('[data-dot]')!;
  const trailGroup = root.querySelector<SVGGElement>('[data-trail]')!;
  const trail = [...trailGroup.querySelectorAll<SVGCircleElement>('circle')];
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  const tablist = root.querySelector<HTMLElement>('[data-tablist]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-toggle]')!;
  const toggleText = root.querySelector<HTMLElement>('[data-toggle-text]')!;
  const meter = root.querySelector<HTMLElement>('[data-progress]')!;
  const mode = root.querySelector<HTMLElement>('[data-mode]')!;

  // ── ARIA: list → tabs ──
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((t, i) => {
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', panels[i].id);
    t.dataset.href = t.getAttribute('href') || '';
    t.removeAttribute('href'); // a tab, not a jump link
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', t.id);
  });

  let active = 0;
  let angle = stageAngle(0, n, START); // unbounded; grows as the dot laps the ring
  let raf = 0;
  let inView = false;
  let hovering = false;
  let focused = false;
  let userPaused = false;
  let elapsed = 0;
  let lastTick = 0;
  let tickRaf = 0;

  const isManual = () => reduce.matches;

  function placeDot(a: number) {
    const p = pointOnCircle(C, C, R, a);
    dot.setAttribute('transform', `translate(${p.x} ${p.y})`);
  }

  function drawTrail(head: number, travelled: number) {
    const lens = trailLengths(travelled, TRAIL_DEG, trail.length);
    trail.forEach((c, i) => {
      const d = arcDash(head - lens[i], head);
      c.setAttribute('stroke-dasharray', d.dasharray);
      c.setAttribute('stroke-dashoffset', d.dashoffset);
    });
  }

  function setActiveUi(i: number) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, k) => {
      const on = k === i;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', String(!on));
      p.inert = !on;
    });
    nodes.forEach((g, k) => g.classList.toggle('is-active', k === i));
    if (readout) readout.textContent = String(i + 1).padStart(2, '0');
  }

  function travelTo(i: number) {
    const steps = forwardSteps(active, i, n);
    active = i;
    setActiveUi(i);
    if (steps === 0) return;

    const from = angle;
    const to = from + (360 / n) * steps;
    cancelAnimationFrame(raf);
    trailGroup.style.transition = 'none';
    trailGroup.style.opacity = '1';

    if (reduce.matches) {
      angle = to;
      placeDot(angle);
      drawTrail(angle, 0);
      return;
    }

    const dur = travelDuration(steps);
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      angle = from + (to - from) * easeInOutCubic(t);
      placeDot(angle);
      drawTrail(angle, angle - from);
      if (t < 1) raf = requestAnimationFrame(frame);
      else {
        // Let the ink dry: the tail fades out once the dot has landed.
        trailGroup.style.transition = 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)';
        trailGroup.style.opacity = '0';
      }
    };
    raf = requestAnimationFrame(frame);
  }

  function select(i: number, focus = false) {
    travelTo(mod(i, n));
    elapsed = 0;
    if (focus) tabs[active].focus();
  }

  // ── auto-advance (only in view, not hovered/focused/paused) ──
  const running = () => inView && !hovering && !focused && !userPaused && !isManual();

  function tick(now: number) {
    if (running()) {
      elapsed += Math.min(100, now - lastTick);
      if (elapsed >= DWELL) select(active + 1);
    }
    lastTick = now;
    meter.style.transform = `scaleX(${Math.min(1, elapsed / DWELL)})`;
    tickRaf = requestAnimationFrame(tick);
  }

  function syncLoop() {
    cancelAnimationFrame(tickRaf);
    if (inView && !isManual()) {
      lastTick = performance.now();
      tickRaf = requestAnimationFrame(tick);
    }
  }

  function syncMode() {
    const manual = isManual();
    root.classList.toggle('is-manual', manual);
    mode.textContent = manual ? 'Manual · ← →' : userPaused ? 'Paused' : 'Auto · 5s';
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggleText.textContent = userPaused ? 'Play' : 'Pause';
    syncLoop();
  }

  function pauseByUser() {
    if (userPaused) return;
    userPaused = true;
    elapsed = 0;
    meter.style.transform = 'scaleX(0)';
    syncMode();
  }

  // ── events ──
  const onTabClick = (e: MouseEvent) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-tab]');
    if (!t) return;
    e.preventDefault();
    pauseByUser(); // the reader took the wheel
    select(Number(t.dataset.tab));
  };

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number | 'home' | 'end'> = {
      ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: 'home', End: 'end',
    };
    const k = keys[e.key];
    if (k === undefined) return;
    e.preventDefault();
    pauseByUser();
    const target = k === 'home' ? 0 : k === 'end' ? n - 1 : active + k;
    select(target, true);
  };

  const onToggle = () => {
    userPaused = !userPaused;
    elapsed = 0;
    syncMode();
  };

  const onEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') hovering = true; };
  const onLeave = () => { hovering = false; };
  const onFocusIn = () => { focused = true; };
  const onFocusOut = (e: FocusEvent) => {
    if (!root.contains(e.relatedTarget as Node | null)) focused = false;
  };

  tablist.addEventListener('click', onTabClick);
  tablist.addEventListener('keydown', onKey);
  toggle.addEventListener('click', onToggle);
  root.addEventListener('pointerenter', onEnter);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);
  reduce.addEventListener('change', syncMode);

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      syncLoop();
    },
    { threshold: 0.35 },
  );
  io.observe(root);

  // Deep link: /about/#loop-experiment opens that stage.
  const fromHash = panels.findIndex((p) => `#${p.id}` === location.hash);
  if (fromHash > 0) {
    angle = stageAngle(fromHash, n, START);
    active = fromHash;
    placeDot(angle);
  }
  setActiveUi(active);
  drawTrail(angle, 0);
  syncMode();

  return () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(tickRaf);
    io.disconnect();
    reduce.removeEventListener('change', syncMode);
  };
}
