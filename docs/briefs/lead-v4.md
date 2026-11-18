# Brief: lead-v4: you now lead the relearn.ing revamp (port 4371)

The owner wants you to **take over and lead**. You own the creative and technical direction from here, and you
decide how to implement everything below. You may spawn your own subagents with herdr if you want parallelism
(see "Spawning" below), but you are accountable for the result and for final quality.

## Owner's taste (non-negotiable)
Simple, cool, crafted and modern. No cheese, no cute puns, no "sob story", nothing that "screams Claude" (no warm
cream or terracotta). Quiet confidence. Recent verbatim feedback: "this is rubbish", "too cheesy", "keep it
simple, and cool", "NO SOB STORY".

## Read first
1. `docs/briefs/review-astra-report.md`: the independent review. **The owner said "fix all"**, so implement every
   must-fix, every cut-list item and all top-5 actions, and act on the general direction where it's concrete.
2. `docs/DESIGN.md` (palette "Ink & Graphite", type, motifs). Update it to reflect your decisions.
3. `docs/briefs/*`: the history (what each agent built). Code map:
   - `src/styles/global.css`, `tailwind.config.mjs`: tokens and utilities
   - `src/layouts/Layout.astro`, `src/components/site/*` (Header, Footer, CommandPalette, EntryRow)
   - `src/lib/content.ts`: content helpers
   - Home: `src/pages/index.astro`, `src/components/home/Hero.astro`, `src/components/home/record/*`
   - Journal: `src/pages/journal/index.astro`, `src/components/journal/*`
   - Article: `src/pages/journal/[...slug].astro`, `src/components/article/*` (including `pen/*`)
   - About: `src/pages/about.astro`, `src/data/about.ts`. Projects: `src/pages/projects/*`, `src/components/projects/*`
   - `src/components/interactive/*` (Loop: currently unused; ThemeInk: wired into the header)

## Decisions already made by the coordinator (owner can overrule)
- **ThemeInk:** the reviewer suggested removing the ink-wipe theme animation. You decide, but lean toward the reviewer
  (an instant switch) unless you can make it feel truly quiet. Remove the Loop component files if they stay unused.
- **"Start here":** pick the three entries yourself by actually reading `src/content/journal/*`: one build, one
  failed assumption, one changed habit, each with one honest sentence on why. No invented claims.
- **Newsletter:** there is no email backend. Implement the "return channel" as a quiet end-of-series block
  pointing to RSS plus Threads/LinkedIn. Design it so an email form can drop in later. Don't fake a signup form.
- **Project copy:** for `src/content/projects/relearn-ing.md`, add a short dated update note at the top saying the site was
  redesigned in Nov 2026, keep the original text as a dated build note, and replace the abstract subtitle with what it does.
  You may make similar title/subtitle-only clarity edits to other project files, but keep the body text.

## Constraints
- Branch `revamp`. **Commit in small logical commits** as you go (you are allowed to commit now). Don't push and
  don't merge into main.
- Progressive enhancement, keyboard parity, `prefers-reduced-motion`, and both themes at 1440 and 390 on every page you touch.
- After the JS deferral work, measure the per-page JS before and after (use `dist/_astro` sizes, or real transfer
  sizes) and report the numbers.
- Final gate: `npx tsc --noEmit`, `npx vitest run`, `npx astro build`, and no console errors on the 7 routes.
- **Preview server:** the owner reviews over Tailscale at `http://book-b9l1tbs9fa.tortoise-temperature.ts.net:4321/`,
  served by `npx astro preview --host 0.0.0.0 --port 4321` from `dist/`. Use your own dev port (4371) while
  working. When you finish (or at good checkpoints), rebuild and restart that preview so the owner sees the
  result: kill whatever listens on 4321, then run `nohup npx astro preview --host 0.0.0.0 --port 4321 > /tmp/preview-ts.log 2>&1 &`.
- Screenshots: `MSYS_NO_PATHCONV=1 node C:/Users/kedbi/Learn/relearn-shots/shot.mjs <base> <outDir> /path/ ...`
  (env `SCHEME`, `W`, `WAIT`). Playwright is resolvable from `C:/Users/kedbi/Learn/relearn-shots/`, and
  `C:/Users/kedbi/Learn/relearn-shots/e2e.mjs` is an example interaction script.

## Spawning (optional)
`herdr pane split --pane <your pane> --direction down --cwd 'C:\Users\kedbi\Learn\relearn.ing'`, then
`herdr agent start <name> --kind pi --pane <newpane> -- --coordinator <your pane> --model claude-code/claude-opus-5-5 --thinking medium`,
then `herdr agent prompt <name> "<instruction>"`. Find your own pane id with `echo $HERDR_PANE_ID`. Give each one a brief file with
owned files, do-not-touch files and verification steps, and never let two agents edit the same file. Don't poll them.
They report back to you. Close their panes when done.

## Report
Write `docs/briefs/lead-v4-report.md`. Include what changed and why (mapped to each review item), before/after JS
numbers, screenshot paths, anything you deliberately did not do and why, and recommended next steps. Then call
report_to_coordinator.
