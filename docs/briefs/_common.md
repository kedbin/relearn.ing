# Common rules for every revamp subagent

Repo: `C:/Users/kedbi/Learn/relearn.ing` (branch `revamp`). This is an Astro 5 + Tailwind 3 + React 19 site.

## Read first, all the way through
1. `docs/DESIGN.md`: the design direction. It is not optional; follow it exactly.
2. `src/styles/global.css` and `tailwind.config.mjs`: tokens and utilities (`.wrap`, `.h-display`, `.h-title`, `.label`, `.sq`, `.num`, `.dot-*`, `.link`, `.btn-solid`, `.btn-line`, `.index-row`, `.prose-lab`, `.reveal`, `.kbd`).
3. `src/lib/content.ts`: data helpers. Use these instead of rewriting them.
4. Reference implementations: `src/pages/index.astro` and `src/components/site/EntryRow.astro`. Match their tone, spacing and patterns.

## Hard rules
- Do not edit coordinator-owned files: `global.css`, `tailwind.config.mjs`, `Layout.astro`, `src/components/site/*` (Header, Footer, CommandPalette, EntryRow), `src/lib/content.ts`, `src/pages/index.astro`, `astro.config.mjs`, `package.json`. If you need a token, a utility or a helper added, use page-local markup or a `<style>` block, and mention it in your report.
- Only touch files listed as yours in your brief. Other agents are working in the same tree right now.
- Do not delete old components (`src/components/*.tsx`, `ui/*`, `home/*`) even if you stop using them. The coordinator cleans up afterwards.
- Do not run `git commit`, `git checkout`, `git stash` or `npm install`. If you need a new dependency, ask through `report_to_coordinator` with status `question`.
- Prefer `.astro` for static markup. Use React islands only for real interactivity, and hydrate them with `client:visible` or `client:idle` (`client:load` only if it is above the fold and essential).
- Do not use rounded, bordered card boxes for content lists. Use ruled rows and whitespace. Use the domain dot plus label instead of coloured pills. Use the accent sparingly.
- Both themes must look intentional: check light and dark. Check mobile at 390px.

## Verify
- Run a dev server on **your own port** (given in your brief): `npx astro dev --port <PORT>`. Do not run `astro build`, because concurrent builds collide in `dist/`.
- Screenshot script: `MSYS_NO_PATHCONV=1 node C:/Users/kedbi/Learn/relearn-shots/shot.mjs http://localhost:<PORT> <outDir> /path1/ /path2/`. Env `SCHEME=light|dark` (default dark) and `W=390|1440` (default 1440). `MSYS_NO_PATHCONV=1` is required in Git Bash. Put screenshots in `C:/Users/kedbi/Learn/relearn-shots/<your-name>/`, then look at them with the read tool and iterate until they look great, not just functional.
- Run `npx tsc --noEmit` and fix type errors in your own files.
- Run `npx vitest run`. If tests for components you replaced fail, leave them, list them in your report and the coordinator will handle them. Add tests for any new non-trivial pure logic.

## Report
Write `docs/briefs/<your-name>-report.md`. Cover what you built, the files you touched, screenshot paths, open issues, and anything you want changed in shared files. Then **call report_to_coordinator when finished** (status `done`, or `question`/`blocked`).
