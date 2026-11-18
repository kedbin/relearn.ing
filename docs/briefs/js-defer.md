# Brief: js-defer (subagent of lead-v4)

Repo `C:\Users\kedbi\Learn\relearn.ing`, branch `revamp`. Read `docs/briefs/review-astra-report.md` ("Cost" bullet + top action 5) for context.

## Goal
Cut per-page JS. Baseline (uncompressed `dist/_astro` sizes of JS loaded after load+idle, measured by
`node C:/Users/kedbi/Learn/relearn-shots/jsweight.mjs http://127.0.0.1:<port> C:/Users/kedbi/Learn/relearn.ing/dist`):
Home 246.9, Journal 241.3, № 066 252.2, № 030 257.0, Projects 237.1, project detail 241.9, About 237.1 kB.
`client.*.js` (react-dom) alone is 186.6 kB, CommandPalette 25.6 kB. React is only used by `CommandPalette.tsx` and `AudioPlayer.tsx`.

## Do
1. **Search palette → vanilla TS, loaded on intent.** Replace `src/components/site/CommandPalette.tsx` with a tiny always-loaded
   trigger script (keydown ⌘K / Ctrl+K / "/" when not typing, and clicks on any `[data-open-palette]`, honouring `data-query`)
   that `import()`s the real palette module only on first intent (and may prefetch it on `pointerenter`/`focus` of a trigger).
   The first keyboard invocation must open the palette and focus the input (no lost keystroke). Fuse.js should only be fetched by
   the lazy module. Keep the current behaviour and markup/visuals: combobox/listbox ARIA, arrow keys, Enter navigates via
   `astro:transitions/client` navigate, Esc closes and restores focus, focus trap, number lookup ("42", "№ 42"), "Recent entries"/"Jump to"
   sections, closes on `astro:before-swap`, `/search.json` fetched on first open. Must survive Astro client-side navigation
   (bind global listeners once). Respect reduced motion. Make the palette dialog visually quiet; same tokens as now.
2. **AudioPlayer → `.astro` + vanilla script** with identical UI/keyboard behaviour (play/pause, seek range with 5s/30s keys,
   Home/End, speed cycle, error state). Server-render the markup so it shows without JS (with JS off, a native `<audio controls>`
   fallback is fine via `<noscript>` or progressive enhancement). Used in `src/pages/journal/[...slug].astro` and
   `src/pages/projects/[...slug].astro`: change only the import + usage lines there.
3. Remove React: `@astrojs/react` integration in `astro.config.mjs`, and react deps from package.json only if nothing else
   needs them (vitest config uses `@vitejs/plugin-react`; keep tests passing, adjust config if needed). Move any pure helpers
   you need into `.ts` files and add vitest tests for the palette's pure logic (ranking/number lookup) if you extract it.

## Owned files
`src/components/site/CommandPalette.tsx` (delete/replace), new `src/components/site/palette/*`, `src/components/AudioPlayer.tsx`
(delete/replace with `src/components/article/AudioPlayer.astro` or similar), `astro.config.mjs`, `package.json`, `package-lock.json`,
`vitest.config.*`, `src/test/*`, and in `src/layouts/Layout.astro` ONLY the `<CommandPalette client:idle />` line and its import.
In the two `[...slug].astro` pages ONLY the AudioPlayer import/usage lines.

## Do not touch
Everything else, in particular `Header.astro`, `global.css`, `index.astro`, Hero, journal pages, About, content files. The lead
is editing those concurrently. If you need a change there, put it in your report.

## Verify
- `npx tsc --noEmit`, `npx vitest run`, `npx astro build` all pass.
- Serve `dist` on port **4372** (`npx astro preview --host 127.0.0.1 --port 4372`), run the jsweight script above (`ROUTES` env optional),
  report before/after numbers per route and zero console errors.
- Playwright check (see `C:/Users/kedbi/Learn/relearn-shots/e2e.mjs` for style): on /about/ cold load press Ctrl+K immediately → palette
  opens with focus in input; type "sisyphus", Enter → lands on /journal/entry-030/. Click header Search button works. Audio player on
  /journal/entry-030/ plays/pauses and seeks via keyboard. Both themes look right.
- Commit in small logical commits on `revamp` (don't push). Never `git add -A` blindly: the lead commits concurrently; add only your files.

## Report
Write `docs/briefs/js-defer-report.md` (what changed, numbers, checks), then call report_to_coordinator.
