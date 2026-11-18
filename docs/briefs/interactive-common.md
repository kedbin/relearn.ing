# Interactive pass: common rules (round 3)

The site has a new palette, **"Ink & Graphite"**: ultramarine fountain-pen ink on cool paper, and periwinkle
on slate in dark mode. Read `docs/DESIGN.md`, especially the colour section, plus `docs/briefs/_common.md`. All the
rules there still apply: own files only, no git commits, no `npm install` without asking, verify both themes
at 1440 and 390, `npx tsc --noEmit`, `npx vitest run`.

## The bar for interactivity
Every interaction must **mean something** and grow out of the notebook / ink / instrument metaphor. Ask
"would a craftsperson put this here?" Delight comes from precision and responsiveness, not from
spectacle. Concretely:
- It must have no layout shift, run at 60fps, use `transform`/`opacity`-only animation, and use pointer events (mouse + touch + pen).
- **Keyboard parity** for every pointer interaction, with visible focus and ARIA labels.
- **`prefers-reduced-motion`**: the feature still works, but motion is replaced with instant state changes.
- **Progressive enhancement**: the page must be complete and correct with JS off. The interaction is an
  enhancement layered on top of server-rendered HTML.
- **Weight**: prefer vanilla TS in an Astro `<script>`. A React island is fine only if the state is
  genuinely complex. No new dependencies. Budget: no more than about 6 KB gzipped of JS per feature.
- Re-init safely on Astro view transitions (`astro:page-load`), and don't double-bind.
- Use the colour tokens only (`rgb(var(--accent))` etc.). No hard-coded hex.

Dev servers: use your own port (given in your brief). A production preview is running on 4321. Don't
touch it, and don't run `astro build`.
Report to `docs/briefs/<name>-report.md`, then call report_to_coordinator.
