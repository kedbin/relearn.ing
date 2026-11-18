# ix-record report: the homepage instrument

## What I built
"The record" is now an instrument you can play. It is server-rendered first: all 68 bars are still real `<a>` links, and the silence annotation, latest marker, legend and month axis are kept. A vanilla TS layer then adds the following.

1. **Playhead.** A 1px accent line tracks the pointer 1:1, updated with rAF using transform only. It carries a mono date chip (`MAR 14, 2026`) that clamps at the plot edges and has a tick joining it to the line. The nearest entry is computed from pointer x, so the hit area is continuous, and that bar is emphasised (`scaleX`; the other bars dim). A reserved status line under the axis shows `№ 039 · title · topic · 4 min` without layout shift. This replaces the old tooltip.
2. **Brush.** Press and drag to select a window. It draws an `accent/8` fill, hairline edges and handles that you can drag (`ew-resize`, 21px hit area). Dragging inside an existing selection moves the window. A live results panel opens with a 0fr→1fr grid-row animation, plus a fade and translate. The list area has a fixed height of 15.5rem, so dragging never shifts the page. The headline reads like `32 entries · Dec 13, 2025 – Feb 2, 2026 · 37k words`, and the rows show №, title, topic dot + topic (≥md) and minutes. Rows are only rebuilt when the set of entries changes. A double-click selects the whole month. Esc (from anywhere on the page) clears, as do a click outside and the Clear button. A single click on a bar opens it after a 230ms double-click window, with instant playhead feedback in the meantime. Ctrl/⌘-click opens a new tab.
3. **Keyboard.** The plot has `tabindex=0` and `role=group` with a descriptive label, and the bars get `tabindex=-1` (roving), so the chart is one tab stop instead of 68. ←/→ move by entry, Home/End jump to the ends, Shift+←/→ extends the selection from an anchor, Enter opens the entry and Esc clears. An `aria-live=polite` region announces either `№ 042, title. Mar 5, 2026, topic, 4 minutes. 12 of 68.` or the selection summary. Keyboard scrubbing picks up from wherever the mouse left the playhead.
4. **Touch.** The plot has `touch-action: pan-y`. A tap shows the playhead on the nearest entry, and a second tap on the same entry opens it. A horizontal swipe scrubs. A vertical swipe scrolls the page normally. Long-press for 300ms (with a tiny vibrate if available) and drag to brush; `touchmove` is only `preventDefault`ed once a brush is active.
5. **Handwriting the -ing.** An inline script runs before first paint and checks `sessionStorage['rl-ink']` and reduced motion, then adds `.ink-write`. A soft-edged mask sweeps left to right over 900ms, starting at 2.25s, after the bars finish growing. An accent overlay copy with a slight `text-shadow` bleed writes in first and then fades over 700ms to the existing graphite gradient ("drying"). With reduced motion there is no animation at all.

The page works without JS (verified): 68 bar links, the panel collapsed to 0 height, and the playhead and selection invisible.
Weight: about **3.8 KB gzipped** for the script including the math. There are no dependencies.
View transitions: listeners are bound with an `AbortController`, aborted on `astro:before-swap` and re-bound on `astro:page-load`, with a `data-bound` guard. I tested going home → journal → back and the instrument still works.

## Files
- `src/components/home/Hero.astro`: slimmed down. It renders `<Record/>` and adds the ink markup, CSS and inline script.
- `src/components/home/record/Record.astro` (new): chart markup, styles and the instrument script.
- `src/components/home/record/math.ts` (new): x↔time, `nearestIndex`, `indicesInRange`, `monthBounds`, formatters, `summarize`.
- `src/components/home/record/__tests__/math.test.ts` (new): 13 tests, including 68 entries clustered on the same days.

## Verification
- `npx tsc --noEmit`: clean. `npx vitest run`: 10 files, 71 tests passing.
- Screenshots in `C:/Users/kedbi/Learn/relearn-shots/ix-record/`: `playhead-*`, `brush-*`, `keyboard-*` (light and dark at 1440), `tap-*` (light and dark at 390), `ink-mid-*` and `ink-done-dark-390`. The interaction driver is `drive.mjs` and the view-transition/no-JS check is `vt.mjs`, both in the same folder.
- Dev server on port 4341, left running.

## Suggestions / open items
- **Journal date filter:** once `/journal/` supports `?from=YYYY-MM-DD&to=YYYY-MM-DD`, add an "Open in journal →" link to the panel header next to Clear. The `selA`/`selB` times are already there, so it would take about 3 lines. I have not rendered it.
- The Astro dev toolbar sits on top of the plot's bottom in dev screenshots. That only happens in dev.
- On touch there's no visible hint that long-press brushes, apart from the status line text "hold, then drag to select a window". This is intentional to keep it quiet.
- There are no shared-file changes.
