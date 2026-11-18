# about-projects: round 2 (coordinator review)

Strong work. The voice, structure and binasoy.kim content are right, and "Paper trail", "What's on the
bench" and "From the lab bench to the build pipeline" are exactly the tone I want. What's left is polish.
Use the homepage hero (`src/components/home/Hero.astro`, http://localhost:4322/) as the bar.

## About
1. **Mobile portrait order.** At 390px the photo comes after about 900px of text. On mobile, put the
   portrait directly after the H1 as a compact figure (about a 4:5 crop, capped at roughly 280px tall, with the caption).
   Keep the desktop layout as is.
2. **Lead paragraph.** Set the first intro paragraph as a lead: `font-serif`, about 1.3rem, `text-text/90`.
   Paragraphs 2–3 stay in sans. Trim each by about 15%. It currently reads long.
3. **Readout alignment.** "5×" sits lower than "90%" and "70%". Align all three on a shared top or baseline
   so the labels line up. Consider `font-display` for the numerals at about 4.5rem (it matches the hero),
   keeping the mono labels.
4. **Dead space.** There's an oversized gap between Readout and Now (about 130px of nothing plus a rule). Tighten it.
5. **Double rules.** Several sections draw a section top rule *and* a top rule on the first row of
   the right column (Now, Experience, Certs, Toolbox, Rules), which reads as two lines stacked at
   slightly different heights. Keep one: drop the first-row top border in the right column, or drop the
   section rule.
6. **Certs grid.** The vertical divider stops before the orphaned 7th item (AWS), which looks broken.
   Either make it a single-column ruled list (issuer | name | issued | ↗) or make the grid lines
   consistent with `gap-px bg-line/10` cells so an orphan still looks intentional. The single-column list is
   preferred: it scans faster and matches the Toolbox rows.
7. **Optional delight.** Next to "BS Medical Technology · where it started", a tiny mono note:
   `pipettes → pipelines`. One line, faint.

## Projects index
8. **Links column.** "Repo ↗" and "Demo video ↗" are stacked with a big gap and float far from the
   content. Put them inline on one row (`Repo ↗ · Demo ↗`) aligned with the title's baseline, or
   move them under the stack line. Stop the arrow `→` from floating mid-row.
9. **Remove "◉ NARRATED" from every row.** All 6 have it, so it's noise. The header readout already says it.
10. **Scale.** Only the featured (first) row gets the huge display title. Other rows use `font-display`
    at about 2.4–2.6rem so the page has rhythm instead of six equal shouts.
11. Check that "Open source 6/6" is true (every project has a `repoUrl`). If not, compute it honestly.

## Project detail
12. The AudioPlayer is being restyled by the article agent, so leave it. Move the "4 MIN READ" line into the
    meta block (Shipped | Stack | Links | Read time) instead of floating on its own.

Same rules (`_common.md`): own files only, port 4333, verify in both themes at 1440 and 390, tsc and vitest.
Add a "Round 2" section to your report, delete the unused `public/about/van-desk.webp`, then call report_to_coordinator.
