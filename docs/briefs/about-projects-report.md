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
- New: `public/about/kim.webp` (NewProfilePicture.jpeg resized to 900w webp, 84KB), `public/about/van-lake.webp` (van-06), `public/about/van-desk.webp` (van-04, copied but **unused**, so you can delete it if you don't want it)

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
