# journal-index: round 2 (coordinator review)

Good, solid work: the functionality, URL state, no-JS behaviour and tests all hold up. The page now
has to match the new homepage hero (`src/components/home/Hero.astro`; open it at
http://localhost:4322/). That hero is the bar: editorial confidence and data used as design.
Right now `/journal/` reads as a well-built list, not something memorable.

## Fix
1. **Redundant chrome.** Delete the "■ ENTRY INDEX ……… 68 entries" row. The count already lives in the
   header readout and the live count belongs in the controls bar. Also delete the empty double-rule band
   between the series callout and the first month (around y 636–669 in your 1440 shot).
2. **The "Site search /" hint** in the filter field is confusing next to the in-page filter. Remove it.
   The header already advertises ⌘K.
3. **Month gutter = a typographic event.** The month label is currently the same tiny mono as everything else, which wastes a
   180px column. Make it `font-display` (about 1.9rem, `leading-none`) with the month in roman and the
   year beneath in mono 11px faint, plus the count (`3 entries`). Keep it sticky (`top` = header + controls height).
   On mobile, use a full-width sticky band with the month in display at about 1.5rem on the left and the count on the right.
4. **Mini record in the header.** Reuse the hero's idea at small scale. Under the readout line, add a
   one-line strip, about 36px tall and full width, with one 2px bar per entry on a real time axis (height = sqrt of
   the word count, colour = domain). **It must react to the filters**: bars for filtered-out entries fade to
   0.15 opacity. That makes filtering visible as data. Bars are not links here (`aria-hidden`); the
   list is the accessible path. Get word counts from `wordCount()` in `src/lib/content.ts`, pass them as
   `data-*`, and compute everything server-side.
5. **Series callout.** Make it richer but still compact: "Series · FDE Workshop" on the left and the 4 days inline
   on the right as `Day 1 · Day 2 · Day 3 · Day 4` links (mono, hover accent), not just "4 parts →".
6. **Title weight in dark mode.** The row titles look heavy and bright, so lists of 68 feel loud. In your
   page-scoped styles, set the row title to `font-weight: 450` and `color: rgb(var(--text) / 0.92)`. Keep hover = accent.
7. **Header.** "The notebook." is fine. Make the dek one notch more specific and in Kim's voice, for example
   "Every experiment, numbered. What I tried, what broke, and what I'd do differently." Keep it short.

Same rules as before (`_common.md`): own files only, port 4331, screenshots in both themes at 1440 and 390, tsc and vitest.
Update `docs/briefs/journal-index-report.md` with a "Round 2" section, then call report_to_coordinator.
