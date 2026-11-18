# journal-index report

Rebuilt `/journal/` as a table of contents. The current 68 entries render server-side in UTC month groups using the shared `EntryRow`. The header shows the live content totals, with a ruled FDE Workshop callout and an alphabetical topic index below the entries. The sticky filter bar uses a small Astro script (no new React island) for domain, narrated/video, title/summary/topic search, and chronological sort. It hides empty groups, announces result counts, and brings the first result back into view when filtering from deep in the index. Oldest reverses both month and row order. `/` remains the global palette shortcut.

## Files

- `src/pages/journal/index.astro` — page, scoped styling, and DOM controller.
- `src/components/journal/JournalFilter.tsx` — pure URL-state and row-matching helpers; no React runtime.
- `src/components/journal/__tests__/JournalFilter.test.ts` — four tests for state, matching, and filter composition.

## Verification

- `npx tsc --noEmit` passed; `npx vitest run` passed (59 tests across 14 files).
- Playwright on dev port `4331`: verified newest/oldest order reversal, domain and media filters, uppercase search, query reload, empty and clear, topic links and Back/Forward, Astro transitions, sticky behavior with focus retained, global palette, and all 68 rows with JavaScript disabled.
- Captured and reviewed light/dark at 1440 and 390 px. Full-page images in `C:/Users/kedbi/Learn/relearn-shots/journal-index/`: `_journal_-light-1440.png`, `_journal_-dark-1440.png`, `_journal_-light-390.png`, `_journal_-dark-390.png`. The same directory contains `top_` and `topics_` crops and `empty-dark-390.png` (sticky bar and empty state).

## Notes / shared files

No shared source changes requested. With JavaScript disabled, query URLs degrade to the full index. Scoped CSS adjusts the shared row’s grid on mobile and uses the muted token for entry numbers and read-time text for better contrast. Astro dev regenerated `.astro/` metadata in the shared worktree; I did not edit or restore those files manually. No build or Lighthouse run.

## Round 2

- Added a 36px chart inspired by the homepage hero: one server-rendered 2px mark per entry on a date axis, domain colours, and square-root-scaled word counts from `wordCount()`. Filtering dims excluded marks to 15% opacity. The chart is decorative and does not add tab stops.
- Removed the redundant index row, search-palette hint, and gap between the series and the first month. The live result count now sits inside the sticky bar. The FDE line links to each published day.
- Gave month headings display type and per-month match counts. The desktop gutter and mobile band both stick underneath the measured filter bar. Updated the dek and softened row title weight and colour while retaining accent on hover.
- `npx tsc --noEmit` and `npx vitest run` passed (66 tests across 15 files), including two new chart tests. Playwright on port 4331 rechecked filtering, URL state, sort, no-JS fallback, and navigation. It also verified 68 non-link chart marks, opacity changes after filtering, series links, month counts, and the mobile sticky offset.
- Reviewed all four viewport/theme combinations. Images in `C:/Users/kedbi/Learn/relearn-shots/journal-index/round-2/`: `_journal_-light-1440.png`, `_journal_-dark-1440.png`, `_journal_-light-390.png`, `_journal_-dark-390.png`; same directory contains `top_` crops, `life-dark-390.png` (filtered chart), `sticky-dark-390.png`, and `empty-dark-390.png`.
- No shared source edits or requests.
