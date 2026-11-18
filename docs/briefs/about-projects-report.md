# about-projects report

## Built
**/about** (`src/pages/about.astro`), all static `.astro`, no islands:
1. **Intro.** `.h-display` "Hi, I'm Kim. I automate things, including, lately, *myself*." Three paragraphs: Accenture AI automation, the medtech-to-cloud career change, and the engineer's paradox behind relearn.ing. Résumé button plus binasoy.kim, GitHub and LinkedIn links. A slightly rounded (3px) portrait with a mono `Fig. 1 · Kim Binasoy / Toronto · 2026` caption and a small ruled "field notes" list under it (desktop only).
2. **Readout.** The 5× / 90% / 70% stats in a 3-column ruled instrument row (`dl`, with the value shown before the label).
3. **Now.** Ruled dl rows (Day job / Training / Studying / This site), mono "Updated Nov 2026".
4. **Experience.** A ruled timeline with a mono date gutter (`Present` in accent), role · company in `.h-title`, a mono note line and accent-dash bullets. It ends with the FEU BS Medical Technology row.
5. **Fig. 2 · Off the clock.** The van/lake raft photo with Kim and Wingwing and a serif italic caption.
6. **Certifications ("Paper trail").** 7 featured certs in a 2-column ruled grid (issuer label, name, issued / valid-to, ↗). The other 7 are behind a native `<details>` "Show all 14" as compact ruled rows. Works without JS.
7. **Toolbox.** Ruled dl rows (group label | items separated by `·`, done with CSS `::after`, not pills).
8. **Four rules.** Build in public / Honest metrics / Ship v0.1 habits / Failures get logged, taken from README.md.
9. **Contact.** "Say *hello*." with buttons for mailto hello@binasoy.kim, LinkedIn and Threads.

The old Newsletter island and the fake "System Status" metrics were dropped.

**/projects/**: `.h-display` "Things I built *to learn*." with a dek and a small honest-metrics dl (since, open source x/y, narrated). Each project is a large ruled `.index-row`: year/month gutter, name in display type (the newest one is larger as the lead), subtitle, description, mono `·` stack line plus "◉ Narrated", and Repo ↗ / Demo video ↗ / Live ↗ on the right (shown inline on mobile). The whole row is clickable through a stretched-link `::after`. The external links sit above it with `z-10`, so there are no nested anchors.

**/projects/[slug]/**: wrap-narrow reading layout. Mono breadcrumb `Projects / Name`, display title (`transition:name` matches the index row), subtitle, description as the standfirst, a ruled meta dl (Shipped, Stack, Links), `AudioPlayer` (`client:visible`), "N min read", the body in `.prose-lab`, then 3 "Other projects" ruled rows.

## Files
- `src/pages/about.astro` (rewritten)
- `src/pages/projects/index.astro`, `src/pages/projects/[...slug].astro` (rewritten)
- New: `src/data/about.ts` (typed profile, facts, now, stats, experience, certs, skills, principles, vanPhoto, plus the `monthKey` / `partitionCerts` helpers)
- New: `src/data/__tests__/about.test.ts`
- New: `src/components/about/{Section,Timeline,CertList,Toolbox}.astro`
- New: `src/components/projects/ProjectRow.astro`, `projectMeta.ts` (`splitTitle`, `demoLabel`), `__tests__/projectMeta.test.ts`
- New: `public/about/kim.webp` (NewProfilePicture.jpeg resized to 900w webp, 84KB), `public/about/van-lake.webp` (van-06), ~~`public/about/van-desk.webp`~~ (deleted in round 2)

## Verification
- `npx tsc --noEmit`: clean
- `npx vitest run`: 14 files / 59 tests passed, plus 5 new tests in `src/data/__tests__` (all pass)
- Screenshots: `C:/Users/kedbi/Learn/relearn-shots/about-projects/{dark,light,mobile}/` (full PNGs plus `.partN.jpg` slices; `mobile/m-*.jpg` montages; `light/certs-open.png` shows the expanded details)
- Note: in the full-page screenshots the two photos show as empty boxes in some captures. That's screenshot timing. I checked with Playwright that both images load (`naturalWidth` 900 / 1400).

## Open issues / notes for coordinator
- `src/components/ProjectList.tsx`, `ProjectCard.tsx`, `ui/NotebookCard`, `ui/HandwrittenNote`, `ui/MetricRow`, `ui/Tag` and `home/Newsletter` are no longer used by my pages. They're left in place for you to clean up (ProjectCard tests still pass).
- The FDE "Training" Now item doesn't link to the entries because entries 064–068 are `draft: true`. Add `href: '/journal/entry-065/'` in `src/data/about.ts` once they're published.
- Featured certs are 7 (odd), so the last grid row has a single cell. That's intentional, not a bug.
- No shared-file changes needed. Optional: `.sr-only` is Tailwind's built-in, so nothing was added.

## Round 2

All 12 items from `about-projects-r2.md` are done.

**About**
1. **Mobile portrait.** A compact 224×280 figure (4:5, caption "Fig. 1 · Toronto · 2026") sits right after the H1 below `lg`. The desktop sidebar figure is unchanged and now `hidden lg:block`. The field-notes dl only appears inside the desktop figure.
2. **Lead paragraph.** Paragraph 1 is now `font-serif`, 1.3rem (1.4rem at md), `text-text/90`. Paragraphs 2–3 stay in sans at 17/18px. All three are trimmed by about 15–25%.
3. **Readout.** Numerals are `font-display` at 3.75rem / 4.5rem (md) with `leading-none`. The value comes first (order-1) and the label second, so all three line up on top. Labels are mono 11px uppercase.
4. **Dead space.** The readout's bottom rule is gone and the Now section uses `mt-0` (through a new `class` prop on `about/Section.astro`). The section rule now doubles as the readout's bottom edge.
5. **Double rules.** The first row in the right column has no top border and no top padding in Now, Experience (Timeline), Certs, Toolbox and Rules. For Rules that applies to the first two cells at `sm` and up.
6. **Certs.** These are now a single-column ruled list (issuer | name + "valid to" | issued | ↗). On mobile it reads issuer + date on the first line and the name below. The "Show all 14" disclosure uses the same columns.
7. **Delight.** The FEU row now shows `WHERE IT STARTED · pipettes → pipelines` (faint, not uppercase), through a new optional `aside` field on `ExperienceItem`.

**Projects index**

8. **Links.** These now sit on one line under the stack line (`Repo ↗ · Demo video ↗`), left-aligned with the content. The → arrow is pinned to the title line in a narrow 2rem column.
9. **"◉ Narrated" removed** from the rows.
10. **Scale.** Only the lead row uses 3rem / 4.5rem. The other rows use `font-display` at 2.1rem (mobile) and 2.5rem (md), with smaller subtitles.
11. **"Open source 6/6"** is computed (`repoUrl` count) and is true: all 6 projects have a repo.

**Project detail**

12. The meta dl is now Shipped | Read | Stack | Links. The standalone "N min read" line is gone. AudioPlayer is unchanged.

**Other changes:** I deleted `public/about/van-desk.webp`.

**Checks:** `tsc` is clean and `vitest` passes (16 files, 73 tests).

**Screenshots:** `C:/Users/kedbi/Learn/relearn-shots/about-projects/r2/` (dark and light at 1440 and 390, plus `m1.jpg` and `m2.jpg` mobile montages).

**Files touched in round 2:**
- `src/pages/about.astro`
- `src/components/about/{Section,Timeline,CertList,Toolbox}.astro`
- `src/data/about.ts`
- `src/components/projects/ProjectRow.astro`
- `src/pages/projects/[...slug].astro`
