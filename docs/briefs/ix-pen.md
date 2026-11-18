# Brief: ix-pen: ink highlights and margin notes on articles (port 4342)

Read `docs/briefs/interactive-common.md` first.

## Own
- New: `src/components/article/pen/*` (scripts, small components, tests)
- `src/pages/journal/[...slug].astro`: **only** to mount your components and add `data-*` hooks. Keep the
  diff minimal and don't restyle the page.

## Goal
Readers should be able to **read with a pen**, so the notebook metaphor becomes literal.

1. **Selection pen.** Selecting text inside `.prose-lab` (at least 3 words) shows a tiny floating toolbar
   just above the selection: `Highlight · Copy quote · Share`. It should be a dark pill in light mode and a light pill in dark mode,
   with a small arrow and a 120ms scale+fade in.
   - **Highlight** wraps the range in `<mark class="ink">`, styled like a fountain-pen highlighter: an `accent/18`
     background with a slightly irregular edge (a background-image gradient or an SVG mask, kept subtle) and a
     left-to-right "stroke" animation on creation. Persist highlights in `localStorage` per entry id, so
     they survive reloads. Serialise as text-quote selectors (`{exact, prefix, suffix}`, as in the W3C Web Annotation
     model) so they survive minor edits. Clicking an existing mark shows `Remove`.
   - **Copy quote** copies `"<text>" — <title>, relearn.ing/journal/<id>/#:~:text=<encoded>` (use a
     text fragment URL) and shows "Copied" feedback.
   - **Share** uses `navigator.share` when available. Otherwise hide it.
2. **"Your marks" drawer.** If the entry has any highlights, show a small pill fixed bottom-right reading "✎ 3 marks".
   Clicking it opens a side drawer (focus-trapped, Esc closes) listing each highlight. Clicking an item scrolls to
   it and flashes the mark. Include a "Clear all" with confirmation. Also add "Export as Markdown", which copies the quotes as a
   blockquote list with the entry title and link.
3. **Reference previews.** Many entries cite sources inline as `[1]`, `[2]` and list them in a
   `## References` section (see entry-030 and entry-001). Hovering or focusing such a marker should show a
   popover with that reference's text (find the matching paragraph that starts with `[n]` under the
   References/Sources heading). On touch, tap toggles it. Only enhance markers whose reference you actually found.
   Also handle GFM footnotes (`sup a[data-footnote-ref]`).
4. Keyboard: after a selection is made with the keyboard (Shift+arrows), the toolbar appears and is reachable with Tab. Use `H` as a
   shortcut to highlight the current selection while the toolbar is visible.

No-JS: the article is unchanged. Must not break text selection, copy, links or the TOC scroll-spy. Unit-test
the quote-selector serialise/resolve logic, including a re-anchoring case after nearby text changes.

Report: `docs/briefs/ix-pen-report.md`. Call report_to_coordinator when finished.
