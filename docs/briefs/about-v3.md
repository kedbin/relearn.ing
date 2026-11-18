# Brief: about-v3: rewrite the About page, simple and cool (port 4351)

Read `docs/briefs/_common.md` and `docs/DESIGN.md` first. The palette is now "Ink & Graphite".

## Owner feedback (verbatim, it is the spec)
> "wow this is rubbish, make the picture the prev one, the about is too cheesy we dont need that much
> information. keep it simple, and cool. we dont need a sob story and we dont need to mention by day,
> just say the purpose of the site, with links to binasoy.kim, NO SOB STORY."

You own the creative decisions. The owner wants **you** to decide and handle this end to end.

## Hard requirements
- **Photo:** use the previous relearn photo, `public/profile.jpg`. Do not use `public/about/kim.webp`.
  Delete `public/about/kim.webp`, and `public/about/van-lake.webp` too if you no longer use it.
- **No life story.** No career-change narrative, no "I didn't start in tech", no medtech, no "by day I'm at
  Accenture", no engineer's paradox monologue, no van or Wingwing.
- **No résumé dump.** Remove the experience timeline, the certifications list, the toolbox/skills, the 5×/90%/70% readout,
  and the "Now" block. That is the portfolio's job, and **binasoy.kim** already does it.
- **Say the purpose of the site** in a few confident lines: what relearn.ing is, what you'll find here, and how it's
  run. Short and declarative. No cheese and no cutesy headline puns.
- **Prominent link to binasoy.kim** for "who I am / work / résumé", plus small GitHub, LinkedIn and Threads links.
- Keep it **very short**: roughly one screen on desktop. Simple, cool, confident, with lots of whitespace. Make it
  typographic, in the same language as the homepage hero (`src/components/home/Hero.astro`) and the journal header.
- You decide whether the relearning Loop (`src/components/interactive/Loop.astro`) stays. It can stay only if it
  fits a minimal page without feeling like a gimmick. Dropping it is fine. If you drop it, don't delete the
  component files. Just stop importing it.

## Own
- `src/pages/about.astro` (rewrite), `src/data/about.ts` (slim it down or delete it, and fix or delete
  `src/data/__tests__/about.test.ts` to match), `src/components/about/*` (delete what's unused), and `public/about/*`.
- Don't touch anything else. If `content.ts` helpers help (for example live entry counts), you may import them.

## Verify
`npx astro dev --port 4351`. Take screenshots in both themes at 1440 and 390 with
`MSYS_NO_PATHCONV=1 node C:/Users/kedbi/Learn/relearn-shots/shot.mjs http://localhost:4351 C:/Users/kedbi/Learn/relearn-shots/about-v3 /about/`
(create the dir first), and actually look at them. Then run `npx tsc --noEmit` and `npx vitest run`.
Do not run `astro build`: the coordinator's preview server on 4321 is using `dist/`.

Report to `docs/briefs/about-v3-report.md`, then call report_to_coordinator.
