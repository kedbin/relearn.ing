# article report

## Built
Rewrote the journal entry page as a centred 700px reading column.
- **Reading progress**: a 2px accent bar, fixed, z-60, above the sticky header. Uses `animation-timeline: scroll(root)` and falls back to a rAF scroll handler.
- **Header**: mono breadcrumb `Journal / № 066`, then a meta line (domain dot + topic · long date · N min read · Narrated), then the `.h-display` title with `transition:name="title-{id}"` at 2.75rem on mobile, 3.25rem at sm and 4.5rem at md+. Below it, a Newsreader standfirst in muted text and the inline audio player.
- **AudioPlayer.tsx**: rewritten with the same default export and `src`/`title` props. It is a ruled row with a play/pause circle, "Listen · 5 min" (taken from the metadata duration), a thin scrubbable line (hairline track, 2px accent fill, the knob shows on hover, focus or play), elapsed/total in mono, and a 1×/1.25×/1.5×/2× speed button. It uses a native `<audio preload="metadata">`, so the duration shows before the user plays. The seek bar is keyboard accessible: arrows move 5s, PgUp/PgDn move 30s, and Home/End jump to the ends. There is a visible focus ring. No lucide icons.
- **SeriesNav**: a ruled list of the 4 days for FDE entries, built with `visibleFdeSeries`. The current day shows "Day 2 … Reading" in accent and has `aria-current="page"`.
- **Highlights**: the "Key takeaways" label and a numbered list (`01` in mono accent), in 15/16px sans with hairlines.
- **Body**: `<div class="prose-lab"><Content /></div>`, ending with a `№ 066 · end` rule.
- **TOC**: shown only when there are 3 or more h2s. On xl it is a sticky rail in the left margin, using a 3-column grid that keeps the text centred. Scroll-spy colours the active link and its left border in accent. Below xl it becomes a `<details>` "Contents · N sections" block.
- **Lite YouTube**: appears when `youtube_video_id` is set and the body has no iframe for that ID. It shows an `i.ytimg.com` thumbnail with a play button. On click it swaps in a `youtube-nocookie.com` iframe with autoplay. Without JS it is a plain link to YouTube. Entries 066, 067 and 068 already embed their video in the body, so for them the section is correctly skipped.
- **EntryFooter**: a Discuss line (Threads and LinkedIn), Copy link with "Copied" feedback, and a native Share button that only appears when `navigator.share` exists. It also has two large Older/Newer halves with `№ 065 ← Older` / `Newer → № 067` and `.h-title` titles, plus "Related entries" (3 `EntryRow`s).
- The Layout gets `type="article"` and `description={summary}`. The draft notice is kept as an accent `.label` note.
- `getStaticPaths` now uses `getEntries()` and passes `all`, so each entry no longer calls `getCollection` again.

## Files
- `src/pages/journal/[...slug].astro` (rewritten)
- `src/components/AudioPlayer.tsx` (rewritten)
- New files: `src/components/article/{ReadingProgress,SeriesNav,Highlights,Toc,LiteYouTube,EntryFooter}.astro` and `src/components/article/article-utils.ts`
- New tests: `src/components/article/__tests__/article-utils.test.ts` (7 tests: TOC filter and threshold, embed detection, clock/minutes formatting, speed cycling)

## Verification
- `npx tsc --noEmit`: no errors in my files. `npx vitest run`: 16 files and 73 tests, all passing.
- Checked in a headless browser: play switches the label to "Pause narration", the speed button sets playbackRate to 1.25, clicking the lite YT thumbnail inserts the nocookie iframe, and the desktop code block bleeds 2rem evenly on both sides.
- No horizontal scroll at 390px: scrollWidth 375 on 066 and 001. 375 is less than the viewport width because of the scrollbar gutter.

## Screenshots (`C:/Users/kedbi/Learn/relearn-shots/article/`)
- Full page: `_journal_entry-066_-{dark,light}-1440.png`, `_journal_entry-066_-dark-390.png`, `_journal_entry-030_-dark-1440.png`
- Viewport slices: `s066-dark-1440-{0,1,2}.png` (header, series, TOC), `s030-dark-1440-0.png` (audio), `s066end-dark-1440-{0,1,2}.png` (end, footer, related), `m001-light-390-{0..3}.png` (mobile light), `m066-dark-390-*.png` (mobile code), `l065-table.png` (light table), `l066-code.png` (light code), `l060-light-1440-0.png` (long title), `d060-yt.png` (lite YouTube)
- Helper: `slice.mjs`, which takes viewport slices and logs scrollWidth.

## Page-scoped `.prose-lab` overrides (in `<style is:global>` under `[data-entry]`). I suggest promoting them:
1. `pre` on mobile (<768px) goes full-bleed: `margin-inline:-1.25rem; border-radius:0; border-inline:0`. Also `line-height:1.65; font-size:.8125rem`.
2. `:not(pre) > code { overflow-wrap:anywhere }`, and `.prose-lab { overflow-wrap:break-word }`.
3. Tables: tabular-nums, `th` nowrap with a stronger header rule, `td code` nowrap, and no border on the last row.
4. `blockquote em { font-style:normal }` (the blockquote is already italic) and tighter spacing between paragraphs.
5. `.not-prose` wrappers from markdown get 2em vertical margin. Iframes get `display:block` and a surface background, and images get `height:auto`.
6. References sections (`h2#references ~ p`, `h2#sources ~ p`) are styled as small muted sans citations.
7. GFM `.footnotes` get a muted sans block with a top rule.
8. `.prose-lab > :first-child { margin-top:0 }`.

## Open issues / notes
- In global.css, `.prose-lab pre` uses `margin: -2rem` at ≥900px. If someone adds `max-width:100%` to `pre`, the bleed becomes lopsided. My override sets `max-width:none`.
- The entry 066/067/068 markdown still has an `<iframe class="... rounded-xl border border-border">` inside `not-prose aspect-video`. It renders fine. Converting it to plain markdown and letting the lite embed handle it would save about 500KB of YouTube JS per page. That is a content change; I did not make it.
- The projects page AudioPlayer label now reads "Listen to the write-up · N min". The prop is unchanged.
- No shared-file changes are needed. If promoted, the reading-progress bar could move into a shared component later.
