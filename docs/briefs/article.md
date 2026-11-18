# Brief: article (dev port 4332)

Read `docs/briefs/_common.md` first.

## Goal
The journal entry page is the most important page on the site, because readers spend minutes there.
Make it a **calm, beautiful reading experience** on par with Stripe Press, Craig Mod and Works in
Progress. Sample entries to test: `entry-066` (code, series, YouTube), `entry-030` (audio, long
essay), `entry-001` (tables and references), `entry-060` (long social frontmatter).

## Own these files
- `src/pages/journal/[...slug].astro` (rewrite)
- `src/components/AudioPlayer.tsx` (restyle/rewrite. Keep the default export and the `src`/`title` props, because project pages use it too)
- New: `src/components/article/*` (for example `Toc.astro`, `ReadingProgress.astro`, `SeriesNav.astro`, `EntryFooter.astro`, `Highlights.astro`)
- Tests for new pure logic in `src/components/article/__tests__/*`

## Spec
1. **Reading progress.** Add a 2px accent bar fixed at the very top (above the header), driven by scroll.
   Use CSS `animation-timeline: scroll()` with a JS fallback.
2. **Header (centred reading column, `.wrap-narrow` ~700px):**
   - Breadcrumb: `Journal / № 066` (mono, small) linking back.
   - A meta line: domain dot + topic · formatted date · N min read · "Narrated" if audio.
   - Title in `.h-display`, about 3rem mobile and 4.5rem desktop, with `transition:name={`title-${entry.id}`}`
     so it morphs from the list rows (EntryRow and the homepage already set it).
   - The summary as a standfirst: `font-serif`, about 1.35rem, `text-muted`, `text-wrap: pretty`.
   - The audio player goes directly under the standfirst, inline, slim and full-width in the column.
     Redesign `AudioPlayer.tsx` as a minimal row: a play/pause circle, "Listen · 14 min", a thin
     scrubbable progress line, elapsed/total in mono, and a 1×/1.25×/1.5×/2× speed button.
     Keyboard accessible. Remove the lucide-heavy look.
3. **Series nav** (FDE entries): a compact ruled list of the 4 days with the current one marked, placed
   between the header and the body. Use `visibleFdeSeries`.
4. **Key takeaways** (`highlights`): an elegant block before the body. Use a `.label` "Key
   takeaways" and a numbered list (`01`, `02` in mono accent) in sans 15–16px, separated by hairlines.
   Do not put it in a card box.
5. **Body.** Wrap `<Content />` in `<div class="prose-lab">`. The `.prose-lab` styles already exist in
   global.css. Check the code blocks (shiki dual themes are configured), tables, blockquotes,
   footnotes/references, iframes and images in both themes. If something in `.prose-lab` looks wrong, put
   page-scoped overrides in a `<style is:global>` block that targets `.prose-lab` inside your page,
   and list them in your report so the coordinator can promote them.
6. **Table of contents.** On xl screens, add a sticky TOC in the left or right margin, outside the reading column,
   built from `render(entry)`'s `headings` (depth 2–3). Scroll-spy highlights the active heading in
   accent. On smaller screens, use a collapsible "Contents" `<details>` above the body. Only show the TOC if there are 3
   or more h2s.
7. **YouTube.** If `youtube_video_id` exists and the body does not already embed it, show a
   "Watch the walkthrough" section after the body with a privacy-friendly lite embed (a thumbnail from
   `i.ytimg.com` plus a play button that swaps in a `youtube-nocookie.com` iframe on click).
8. **Entry footer:**
   - A "Discuss" line: links to Threads, LinkedIn and email (kim@... is not known, so use Threads and LinkedIn).
   - A share row: Copy link (with a "Copied" feedback state) and a native `navigator.share` when available.
   - Previous/next entries (older/newer) via `neighbours()`, as two big ruled halves with
     `№ 065 ← Older` / `Newer → № 067` and the titles in `.h-title`.
   - "Related entries": 3 `EntryRow`s from `relatedEntries()`.
9. Pass `type="article"` and `description={summary}` to Layout.
10. Keep the draft notice for `entry.data.draft`.

## Quality bar
Typography first. Generous whitespace. Nothing should compete with the text. Test long titles,
mobile at 390px and both themes. No horizontal scroll on mobile (watch code blocks and tables).

Report: `docs/briefs/article-report.md`. Call report_to_coordinator when finished.
