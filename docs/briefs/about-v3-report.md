# about-v3 report

## What I built
A rewrite of `/about`. It is one screen on desktop, typographic, and has no biography.
- **Headline:** "relearn.ing is a public lab *notebook*." It uses the same `h-display` treatment as the journal header ("The *notebook*."), with the accent full stop.
- **Three ruled spec rows** (mono key, serif value), in the same language as the homepage's dictionary definitions:
  - **What:** how I work, think and live, treated as a system and rebuilt one experiment at a time.
  - **Inside:** live count, "{N} numbered entries across engineering, life and work…" (from `siteStats`).
  - **How:** written by me, built with Astro, shipped on every commit, "{N} entries come with audio", plus "The source is open." linking to the repo.
- **binasoy.kim** is a large display-serif link with an accent ↗, under the label "Who writes it · work · résumé". GitHub, LinkedIn and Threads sit as small muted links below it.
- **Photo:** the previous `public/profile.jpg`, served as `public/about/kim-binasoy.webp`. It is a 640×798 crop with the white matte removed: 31 KB instead of the 1.5 MB PNG-named-.jpg. It shows as Fig. 1 in the right column on desktop. On mobile it sits small under the headline.
- **Loop dropped.** It read as a gimmick on a minimal page. The component files are untouched.
- Removed: the life story, the "by day / Accenture" lines, medtech, the van/Wingwing photo, the timeline, certs, toolbox, the 5×/90%/70% readout, the Now block and the Contact section.

## Files
- `src/pages/about.astro`: rewritten.
- `src/data/about.ts`: slimmed to `profile` (photo, binasoy.kim, socials, source). I **kept `principles`** because `src/components/interactive/Loop.astro` still imports it. Deleting it would break that component's types.
- `src/data/__tests__/about.test.ts`: rewritten (4 tests: binasoy.kim link, https links, the portrait file exists, 4 principles).
- Deleted `src/components/about/` (Section, Timeline, CertList, Toolbox), `public/about/kim.webp` and `public/about/van-lake.webp`.
- Added `public/about/kim-binasoy.webp`.
- `public/profile.jpg` is left in place, since nothing else in `src` references it. The coordinator can delete it if it isn't used elsewhere, such as an OG image.

## Verify
- Screenshots: `C:/Users/kedbi/Learn/relearn-shots/about-v3/_about_-{dark,light}-{1440,390}.png`. I looked at all of them. The floating pill in the shots is Astro's dev toolbar.
- `npx tsc --noEmit`: clean. `npx vitest run`: 10 files, 71 tests passed.

## Notes for the coordinator
- The dev server logs a vite dep-scan error from `src/components/home/record/Record.astro` (`Expected ";" but found "an"` in a script block, probably a comment outside `/* */`). That file isn't mine. Pages still render.
