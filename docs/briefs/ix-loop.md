# Brief: ix-loop: the relearning loop and the ink theme switch (port 4343)

Read `docs/briefs/interactive-common.md` first.

## Own
- New: `src/components/interactive/Loop.astro` (plus helpers in `src/components/interactive/*`)
- `src/pages/about.astro`: **only** to replace the "Four rules" section with your Loop component (keep the
  four rules' text available. It can live inside the loop stages, or stay below it as a compact list).
- New: `src/components/interactive/ThemeInk.ts`, a script the coordinator will wire into the header. **Do not
  edit `Header.astro`.** Export an `init()` that binds to the existing `#theme-toggle` button and *replaces*
  its click behaviour (call `stopImmediatePropagation` in a capture listener). Document how to wire it in your report.

## 1. The relearning loop (About page)
An interactive diagram of how the notebook works, as a cycle of four stages:
**Friction → Hypothesis → Experiment → Log → (back to Friction)**. It replaces the static "Four rules" grid.
- Visual: a precise, hairline SVG ring (think a technical drawing or engineering diagram, not a cartoon). The four
  stage nodes sit on the ring with mono labels. An accent "ink dot" travels along the path between
  stages, and its trail fades behind it (the stroke-dashoffset trick).
- Each stage, when active, shows a panel next to the ring: the stage name in `.h-display`, a one-line
  definition, and **a real example pulled from the journal** (a real entry № + title + link that fits the stage). Pick these
  examples by actually reading entries in `src/content/journal/` and hard-code a curated mapping in a typed data file. Good
  candidates: friction → an entry about a problem noticed; hypothesis → a protocol proposal; experiment → a
  build/test entry; log → a postmortem or "what broke" entry like "My LinkedIn Slides Were Trash…".
- Behaviour: it auto-advances every about 5s **only while in view** (IntersectionObserver) and pauses on hover or focus.
  The stages are buttons (keyboard/arrow navigable, `aria-pressed`/`tablist` semantics). Clicking a stage moves the
  dot there along the arc. Reduced motion: no auto-advance, and the dot jumps.
- Mobile: the ring scales down above the panel, and the panel is full width.
- No-JS: render all four stages as a readable ordered list with their examples (the SVG is decorative and aria-hidden).

## 2. Ink theme switch (site-wide)
When the theme toggles, the new theme should spread from the toggle button **like ink dropped in water**.
Use the View Transitions API with a `clip-path: circle()` animation from the button's centre, slightly
irregular (animate between 2–3 `polygon`/`circle` keyframes, or add an SVG turbulence mask, keeping it tasteful),
over about 550ms with an ease-out-quint curve. Fallback: an instant switch. Reduced motion: an instant switch. It must persist
`localStorage.theme` exactly like the current header script, so the pre-paint script keeps working.

Quality bar: technical-drawing precision, with hairlines, mono labels and exact geometry. It should feel like a
beautifully made instrument panel. Test light and dark. Unit-test the arc geometry helpers.

Report: `docs/briefs/ix-loop-report.md`. Call report_to_coordinator when finished.
