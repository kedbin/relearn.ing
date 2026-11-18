# ix-loop report: relearning loop + ink theme switch

## Built

### 1. The relearning loop (About → "How this notebook runs")
The "Four rules" grid is replaced by **The loop**: a hairline, technical-drawing style SVG dial (Friction → Hypothesis → Experiment → Log), with the stage panel next to it.
- **Dial**: 1px ring, a 5° tick scale (longer ticks every 15°, cleared around each node), dashed construction cross-hairs, an inner dotted circle, clockwise flow chevrons and a centre readout (`STAGE 03 OF 04`). Nodes sit on the diagonals and have mono labels (`01 FRICTION` …). The active node gets an accent registration ring.
- **Ink dot**: the dot travels the arc with an rAF ease-in-out, **always clockwise** (Log → Friction closes the loop; clicking "back" goes all the way round). It leaves a tail of 8 stacked translucent dash segments (stroke-dashoffset on `pathLength=360` circles) that is densest at the dot, then the tail fades out ("the ink dries") once the dot lands.
- **Panel**: stage number, the name in `.h-display`, a one-line definition, a real journal example (live № and title from the collection, a curated one-line note, and a link), plus the matching notebook rule. **All four rules' text is kept**: each stage carries one rule.
- **Curated examples** (`loop-data.ts`, from reading the entries):
  - Friction → № 059 *The Merge Conflict Tax* (PRs open 3–4 days)
  - Hypothesis → № 034 *The Bet: An 11-Month Protocol*
  - Experiment → № 027 *The Binary Asymptote* (deploys went from 5 min to 8 s via R2)
  - Log → № 063 *My LinkedIn Slides Were Trash…* (eleven versions)

  If an entry isn't visible in a build (`getEntries()`), its example is left out rather than linked dead. Note that 063 is `status: Draft`, but not `draft: true`, so it is visible.
- **Behaviour**: auto-advances every 5s **only while ≥35% in view** (IntersectionObserver), with a hairline progress meter. It pauses on mouse hover and while focus is inside the loop. A Pause/Play button (`aria-pressed`) is included. Clicking or using the keyboard on a stage pauses auto-advance (the reader took control).
- **A11y**: the labels become `role=tab` in a `role=tablist`, and the panels become `role=tabpanel` (`aria-selected`, `aria-controls`, roving tabindex, inactive panels `inert`). ←/→/↑/↓/Home/End work. The SVG is `aria-hidden`. Tap targets are ≥40px.
- **Reduced motion**: no auto-advance (the control row shows `Manual · ← →`), the dot jumps, no tail, and panels switch instantly.
- **No JS**: an ordered list of all four stages with their examples and rules. The dial labels are anchor links to each stage. An inline pre-paint script adds `.loop-live`, and panels stack in one grid cell, so there's **no layout shift**. The control row reserves its space when hidden.
- **Mobile**: a container query stacks the dial (max 340px, centred) above a full-width panel. From 600px of container width it's two columns with a sticky dial.
- **View transitions**: binds on `astro:page-load` with a `data-bound` guard. Observers and rAF are torn down on `astro:before-swap`.
- **Weight**: `loop-client.ts` is ~2.0 KB gzipped.

### 2. Ink theme switch (`ThemeInk.ts`)
A View Transition reveals the new theme through an **irregular ink-blot `clip-path: polygon()`** (48 vertices, low-frequency sine harmonics, a seeded PRNG so each toggle is slightly different). The blot grows from the toggle's centre over 3 keyframes. It starts wobbly (±30%) and relaxes towards a circle (±5%) as it spreads, oversized so even the dents clear the far corner. It runs for 560ms with `cubic-bezier(0.22,1,0.36,1)`.
- While switching (`html.ink-switch`), it disables per-element `view-transition-name`s and CSS transitions, so only the root snapshot animates and the default crossfade is killed.
- Persists `localStorage.theme = 'dark' | 'light'` exactly like the header did, so the pre-paint script still works.
- Fallbacks: no `startViewTransition`, `prefers-reduced-motion`, or a toggle mid-animation all switch instantly.
- It uses a capture-phase `click` listener on `document` and `stopImmediatePropagation()`, so the header's own handler never runs. Keyboard works because Enter/Space on the button fire `click`. It's idempotent via a window flag. ~1.3 KB gzipped.

#### Wiring (coordinator, Header.astro `<script>`)
```ts
import { init as initThemeInk } from '../interactive/ThemeInk';
initThemeInk();            // idempotent; can also be called inside initHeader()
```
The existing header click handler can stay; it's suppressed. You can also delete it.

## Files
- New: `src/components/interactive/Loop.astro`, `loop-client.ts`, `loop-data.ts`, `loop-geometry.ts`, `ink-geometry.ts`, `ThemeInk.ts`, `__tests__/loop-geometry.test.ts` (17 tests: arc/dash/path geometry, forward steps, trail caps, easing, blot cover radius, determinism, vertex count, final-frame coverage, data sanity)
- Edited: `src/pages/about.astro`, principles section only (heading is now "The *loop*", plus a one-line dek). I removed the now-unused `principles` import; `principles` is still used by `Loop.astro`.

## Verification
- `npx tsc --noEmit`: clean. `npx vitest run`: 9 files, 58 tests pass.
- I checked these with Playwright: tabs are selected via click and arrows, focus moves, `aria-pressed` toggles, there's no auto-advance out of view, it advances after 5s in view, reduced motion gives no advance and an instant jump, there are no console errors, and the theme toggles exactly once per click/Enter and persists `localStorage.theme`.
- Screenshots: `C:/Users/kedbi/Learn/relearn-shots/ix-loop/`
  - `loop-{0,mid,2,3}-{dark,light}-{1440,390}.png` (initial, mid-travel tail, landed, after keyboard)
  - `trail.png` (tail mid-travel), `nojs-light-1440.png`, `ink-1440-{0,1}.png` (blot mid-spread and done)

## Notes / open issues
- Gotcha I fixed: `vector-effect: non-scaling-stroke` makes Chromium measure dashes in screen px and ignore `pathLength`, so the trail circles opt out of it.
- The ink switch can't be seen until the coordinator wires `init()` into the header. I tested it by injecting the module on the dev server.
- There are no shared-file changes needed.
