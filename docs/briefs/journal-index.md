# Brief: journal-index (dev port 4331)

Read `docs/briefs/_common.md` first.

## Goal
Rebuild `/journal/` into a fast, browsable **index of the notebook**: a table of contents that
68+ entries can live in comfortably, not a feed of cards.

## Own these files
- `src/pages/journal/index.astro` (rewrite)
- New: `src/components/journal/JournalFilter.tsx` (or a small inline `<script>`; your choice), plus any `src/components/journal/Index*.astro` you need
- Tests for any new pure logic: `src/components/journal/__tests__/*`

## Spec
1. **Header block.** Use `.label` "Journal", a large `.h-display` title (for example "The notebook", with an
   *italic* word), a one-sentence dek, and a small mono readout line: `68 entries · 87k words · 64 narrated`.
   Get the numbers from `siteStats`.
2. **Controls bar.** Sticky under the site header (`top-16`), with a `bg-bg/85` backdrop blur and a
   hairline bottom border when stuck. It holds:
   - Domain filters: All / Engineering / Life / Work. Each is a text button with its domain dot and a count, and the
     active one gets an accent underline. Do **not** use filled pills.
   - Optional toggles: "Narrated" (has audio) and "Has video".
   - A search field that filters the list in place (title, summary and topic). Show a hint `/` or ⌘K for
     the global palette. Note that `/` is already bound globally to open the palette, so give the in-page field
     a different affordance; don't bind `/`.
   - Sort: Newest / Oldest.
   - Persist the filter state in the URL query (`?d=life&q=agents`) so views can be shared, and
     read it on load.
3. **The index.** Group entries **by month** (a `November 2026` mono label in the left gutter, which
   can be sticky on desktop), and render each entry with the shared `EntryRow.astro`. All entries render
   server-side, so the page works without JS. The client script just shows and hides rows based on
   `data-*` attributes (pass them with EntryRow's `attrs` prop: `data-domain`, `data-audio`,
   `data-video`, `data-search` lowercased, `data-date`). This keeps the island tiny. Hide month groups
   that end up empty. Show a live result count and an empty state with a "Clear filters" link.
4. **Series callout.** If FDE series entries exist, add a compact ruled callout above the
   index ("Series · FDE Workshop · 4 parts →" linking to Day 1). Use `FDE_WORKSHOP_SERIES` from
   `src/lib/journal-visibility.ts`.
5. **Topics.** At the bottom, add a "Topics" cloud: every `topicOf(category)` with its count, as plain
   text links that set the search query (`?q=<topic>`). Keep it typographic and calm.
6. Sorting by Oldest flips the group order and the row order.

## Quality bar
It should feel like Linear's changelog crossed with a book's table of contents. Filtering should feel instant
(no layout jump: reserve space for the count). Make the keyboard flow logical. Use
`aria-pressed` on toggles and `aria-live="polite"` on the result count.

Report: `docs/briefs/journal-index-report.md`. Call report_to_coordinator when finished.
