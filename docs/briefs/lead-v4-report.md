# lead-v4 report: the review, fixed

Branch `revamp` has 13 small commits on top of `d0e2254`. Nothing was pushed or merged. One subagent, **js-defer**, did the
React removal; its report is in `docs/briefs/js-defer-report.md`. The preview on :4321 was rebuilt from this tree.

## Must-fix
| # | Review item | What changed |
|---|---|---|
| 1 | Faint text failed AA (2.93 light / 3.53 dark) | The `--faint` token is now `100 106 118` in light (4.96:1 on bg, 4.57:1 on surface) and `132 140 156` in dark (5.67:1 on bg, 5.25:1 on surface). Fixing it at the token fixes every caption, dateline and meta label at once. About's captions and labels moved up to `muted`. Decorative rules are unchanged. |
| 2 | No mobile nav without JS | The mobile menu is now a native `<details>`/`<summary>` disclosure. JS only adds Esc to close, click-outside to close, and close on navigation. Checked with JS disabled at 390 on /about/: the menu opens and goes to /projects/ (`relearn-shots/lead-v4/about-nojs-menu.png`). |
| 3 | relearn.ing project page describes the old site in the present tense | A dated **Update, November 2026** note now sits at the top. The original text is kept word for word under "Build note, December 2025". The styling and roadmap headings are dated "(Dec 2025)". The subtitle changed from "The Cognitive Architecture Platform" to "This notebook, its search and its audio". The description now says what the site does, and the stack no longer lists React. |

## Cut list
1. **Dictionary hero → headword + one sentence + one named entry.** The IPA, the three definitions, the "Note the -ing" line and the delayed ink reveal are all gone. Directly under the headword is the plainly authored sentence plus "№ 068 · Latest" with its title. The first 390 px screen now shows that entry title.
2. **The census appears once.** I removed the journal's words/narrated line and its mini chart above the filters. The filtered result count stays. The home hero census and the "days of silence… logged honestly" flourish are gone too; the chart gap now reads "181 days without an entry".
3. **Mobile series nav** collapses to "FDE Workshop · Day 2 of 4 · View series" (a disclosure); the full list shows from md up. After the text there is a direct link to the next day (`SeriesNext.astro`). On series entries, related entries are dropped so the next day is the one primary path.
4. **The topic inventory is replaced by five curated Trails**: FDE Workshop, running agents in parallel, agent memory, the publishing pipeline, work and career (`src/data/curation.ts`). Granular topics still match in the filter and search.
5. **Removed:** the ink-wipe theme switch (now instant, with transitions paused for one frame), About's "Fig. 1" and its WHAT row, and the projects census ("Since / Open source 6/6 / Narrated"). I also deleted `ThemeInk.ts`, `ink-geometry.ts` and the unused Loop component with its data, tests and `principles`.

## Top-5 actions
1. Contrast and no-JS nav: done, and verified on the rendered site.
2. The home page is now headword, one sentence, one named entry, the curated starts, then the record. Mid-page projects were cut to three, and the "Earlier in the notebook", series and latest-takeaways blocks are gone. The record is the site's one graphic, and its bars no longer animate or pulse.
3. Project note dated and subtitle rewritten. I also made title-only clarity edits to four other projects ("Portfolio and résumé", "Teaching a coding agent my CLI tools", "Idea to published entry in one conversation", "Entries narrated in my cloned voice"). Body text is untouched.
4. "Start here" and compact series nav are shipped, and the archive chart is removed. The three picks, chosen from reading the entries:
   - **A build: № 027.** "Moving 135 MB of audio out of the repo and onto Cloudflare R2 took deploys from about five minutes to eight seconds."
   - **A wrong assumption: № 055.** "I spent days designing a Power Apps workflow before learning the real pain was thirty minutes of spreadsheet formatting."
   - **A changed habit: № 035.** "Swapping 'until it feels done' for stopping rules decided in advance, for study, sleep and training."
5. JS deferral (js-defer): React is gone. Search is a 2.5 kB trigger that loads the 24.8 kB palette, including Fuse, on first intent and buffers the keys you type while it loads. The audio player is server-rendered and enhanced with vanilla JS, with a `<noscript>` native player as the fallback.

## Return channel
`src/components/site/ReturnChannel.astro` is a quiet ruled block: "Get the next set of notes." with links to RSS, Threads and LinkedIn. It sits at the bottom of Home and at the end of a completed series (№ 068: "That's the whole series."). It has a default slot, so an email form can replace the link row later without changing the layout. There is no fake signup.

## JS per route
Uncompressed `dist/_astro` sizes of the scripts loaded after load + idle, measured with `relearn-shots/jsweight.mjs`:

| Route | Before | After |
|---|---:|---:|
| / | 246.9 | **27.9** |
| /journal/ | 241.3 | **18.1** |
| № 066 | 252.2 | **33.3** |
| № 030 | 257.0 | **33.3** |
| /projects/ | 237.1 | **18.1** |
| /projects/relearn-ing/ | 241.9 | **18.1** |
| /about/ | 237.1 | **18.1** |

There were zero console errors on all seven routes. № 066 also loads YouTube's own player JS, which isn't counted.

## Verification
- `npx tsc --noEmit` ✓, `npx vitest run` ✓ (69 tests), `npx astro build` ✓ (78 pages).
- `relearn-shots/lead-v4/checks.mjs` passes everything:
  - No-JS menu opens and navigates.
  - The JS menu closes on Esc.
  - The series summary reads "Day 2 of 4".
  - The next-day link points to № 067.
  - The end-of-series block shows on № 068.
  - The theme persists across reload.
  - Ctrl+K → "sisyphus" → Enter lands on № 030 from a cold /about/.
- Screenshots of all 7 routes × {light, dark} × {1440, 390} are in `C:/Users/kedbi/Learn/relearn-shots/lead-v4/`; palette and audio shots are in `relearn-shots/js-defer/`.

## Deliberately not done
- **No email form.** There is no backend. The slot is ready for one.
- **The record's playhead and brush are kept as they were.** The review said to keep them with secondary billing, so the record now sits below the curated starts rather than leading the page.
- **The About headline ("relearn.ing is a public lab notebook.") is unchanged.** It was reviewed as meeting the brief.
- **Entry titles and bodies are untouched.** Many titles still use the "The X: Why Y" pattern, but rewriting content was out of scope.

## Recommended next steps
1. Add an email digest provider (for example Buttondown) and drop its form into the `ReturnChannel` slot at series ends only.
2. Rewrite older titles toward problem + outcome, and start with the entries used as trails and starts.
3. Run a Lighthouse pass on a real phone over Tailscale, now that JS is about 18–33 kB.
4. Review the trail curation as new series appear. A second multi-day series would also get `SeriesNav`/`SeriesNext` if the series data is generalised beyond FDE.
