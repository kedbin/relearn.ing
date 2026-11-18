# Brief: ix-record: the homepage instrument (port 4341)

Read `docs/briefs/interactive-common.md` first.

## Own
- `src/components/home/Hero.astro` (you may refactor it into `src/components/home/record/*`)
- New: `src/components/home/record/*` and tests in `src/components/home/record/__tests__/*`

## Goal
"The record" chart under the hero is currently a static seismograph with hover tooltips. Turn it into an
**instrument you can play**, like scrubbing a waveform in an audio editor.

1. **Playhead.** A 1px accent vertical line follows the pointer across the plot, with a small mono date
   readout riding on top of it (`MAR 14, 2026`). The nearest bar is emphasised. This replaces the
   jumpy per-bar hover: compute the nearest entry from the pointer x, so the hit area is effectively continuous.
2. **Brush selection.** Press and drag across the plot to select a time window. The selection is a soft
   `accent/8` fill with hairline edges and draggable handles. Below the chart, a **live results panel**
   ("12 entries · Jan 3 – Feb 20, 2026 · 31k words") lists the entries in the window as compact rows
   (№, title, topic dot, minutes). The panel should slide or height-animate in, then update instantly while dragging.
   Click outside or press Esc to clear. Double-click selects that bar's whole month.
   - Add an "Open in journal →" link that goes to `/journal/?from=YYYY-MM-DD&to=YYYY-MM-DD`. Only add it if the journal page
     supports those params. It doesn't today, so put the link in your report as a suggestion
     instead and don't render it.
3. **Keyboard.** The plot is focusable (`tabindex=0`, `role="group"` with a label). ←/→ move the playhead
   entry by entry, Shift+←/→ extends a selection, Enter opens the focused entry, and Esc clears. Announce the focused
   entry through an `aria-live="polite"` region.
4. **Touch.** On touch, tap shows the playhead on the nearest entry. Long-press-and-drag (about 300ms) brushes,
   so normal vertical page scroll is never hijacked. Use `touch-action: pan-y` on the plot.
5. **Handwriting the -ing.** On first load (once per session, using `sessionStorage`), the italic "ing" of the
   hero word should look like it's being **written in ink**. Use a left-to-right `clip-path`/mask reveal with a
   slight ink-bleed (the accent colour briefly, then settling to the gradient) over about 900ms, after the
   bars finish growing. Reduced motion: no animation.
6. Keep all existing behaviour: the bars are still real `<a>` links (no-JS path), the silence annotation, the
   latest marker and the legend.

Quality bar: it should feel like a pro tool (Ableton, Figma, Linear), crisp and immediate. No laggy
transitions on the playhead (it tracks the pointer 1:1 with rAF). Test with 68 entries clustered on the same days.
Unit-test the pure math (x↔time mapping, nearest-entry, range filtering).

Report: `docs/briefs/ix-record-report.md`. Call report_to_coordinator when finished.
