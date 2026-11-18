# Brief: home-astra: redesign the homepage hero and intro (port 4381)

You are designing and implementing the **homepage**. You own the copy, the layout and the visual decisions. Make it
genuinely good: this is the front door of the site.

## Owner feedback (verbatim, it is the spec)
> "the intro in the home page looks bad, 'A working notebook by Kim Binasoy' ??? WTF CRINGE … generate a proper
> homepage and make it not sound so corny, make it visually appealing as well, the relearning seems weird on PC."

Earlier feedback that still applies: "simple, and cool", "too cheesy", "NO SOB STORY", "screams Claude" (no warm
cream or terracotta). The owner rejects corny or self-referential copy, puns, dictionary gimmicks and
"by <name>" bylines. He wants it **visually striking but restrained**: modern, crafted and confident.

## What's wrong now
- **Copy:** "A working notebook by Kim Binasoy. What I built, which assumptions turned out wrong, and which habits I changed,
  one numbered entry at a time." This reads corny and self-describing. Replace it.
- **Desktop hero:** the giant `re·learn·ing` headword with accent syllable dots and a faded italic "ing" looks odd at
  1440 (it is huge and left-heavy, with an awkward gradient tail and a big empty right side). Rethink the hero composition entirely.
  You may drop the headword. The logo already says relearn.ing.

## Direction (you decide the details)
- Lead with **what a visitor gets**, in a short, sharp headline plus at most one supporting line. Write it like a
  confident product or publication, not a diary. Look at the entries in `src/content/journal/` (AI agents, automation,
  engineering systems, decision-making and habits, the FDE workshop series) to ground it in what the site
  actually contains. No invented claims or stats.
- Make the first screen (1440×900 and 390×844) feel designed: a clear focal point, a strong type scale, and the latest
  entry plus the "start here" picks reachable immediately. Consider an editorial composition such as a large headline plus a
  featured-entry panel, a typographic index, or a subtle data-driven visual from the real entries. The existing
  record chart (`src/components/home/record/Record.astro`) can be reused, restyled, moved or dropped.
- Keep the palette "Ink & Graphite" (`docs/DESIGN.md`, `src/styles/global.css` tokens) and the fonts: Instrument Serif for display,
  Newsreader, Geist and Geist Mono. Use one accent, sparingly.
- Keep the rest of the homepage coherent with your hero: the start-here picks, the record, the projects and the follow block.
  Restructure or trim it if that improves it.

## Own
- `src/pages/index.astro`, `src/components/home/**` (Hero, record/*), `src/data/curation.ts` (start-here copy; keep the
  three picks unless you have a strong reason), and new files under `src/components/home/`.
- Update the site description `<meta>` default in `src/layouts/Layout.astro` **only** if your new positioning line
  should replace it (it currently uses similar "working notebook" copy). Also check `src/components/site/Footer.astro`'s blurb
  for the same corny phrasing and fix it to match. Change only copy in those two files.
- Don't touch other pages.

## Constraints
- Branch `revamp` (it equals `main` right now). **Commit** your work in small commits. Don't push and don't merge.
- No React (it was removed). Vanilla TS in Astro `<script>`s only. Progressive enhancement, keyboard support,
  `prefers-reduced-motion`, AA contrast, and both themes.
- Keep JS small (the homepage is about 28 kB now; don't regress it meaningfully).
- Verify: `npx astro dev --port 4381`. Take screenshots with
  `MSYS_NO_PATHCONV=1 node C:/Users/kedbi/Learn/relearn-shots/shot.mjs http://localhost:4381 C:/Users/kedbi/Learn/relearn-shots/home-astra /`
  (env `SCHEME=light|dark`, `W=1440|390`; create the dir first), and **look at every screenshot**, iterating until it's
  great at both 1440 and 390 in both themes. Then run `npx tsc --noEmit`, `npx vitest run` and `npx astro build`.
- After building, restart the owner's Tailscale preview: kill whatever listens on port 4321, then run
  `nohup npx astro preview --host 0.0.0.0 --port 4321 > /tmp/preview-ts.log 2>&1 &`.

## Report
Write `docs/briefs/home-astra-report.md`: the new copy (verbatim), the layout rationale, screenshot paths and test results.
Then call report_to_coordinator.
