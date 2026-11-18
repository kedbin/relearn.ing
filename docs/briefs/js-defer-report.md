# js-defer report

Branch `revamp`, 3 commits (not pushed):
- `c725579` search: vanilla palette loaded on intent (trigger + lazy module, Fuse only in lazy chunk)
- `d716ccf` audio: server-rendered AudioPlayer.astro with vanilla enhancement + noscript fallback
- `46556b9` build: drop React (integration, deps, vitest plugin)

## What changed
- **Palette** (`src/components/site/palette/`)
  - `PaletteTrigger.astro`: always loaded, 2.5 kB. It binds the ⌘K / Ctrl+K (toggle), `/` (only when you're not typing in a field) and `[data-open-palette]` click listeners once (they survive Astro client-side navigation), and honours `data-query`. On `pointerover`/`focusin` of a trigger it prefetches the module. While the module loads it **buffers printable keys and Backspace**, so you can type straight after Ctrl+K without losing keystrokes, and Esc cancels the pending open. It also defines the `palette-in` keyframes.
  - `palette.ts`: the lazy chunk (24.8 kB including Fuse). It keeps the same markup, tokens and copy: combobox/listbox ARIA with `aria-activedescendant`, arrow keys, Enter → `navigate()` (RSS uses a full load), Esc closes and restores focus, Tab trap, mouse hover sets the active item, the "Recent entries" / "Jump to" sections, the "Loading the notebook…" and empty states, and the entry count. `/search.json` is fetched on first open and cached. It closes on `astro:before-swap`, and the DOM is rebuilt if the body swap detached it.
  - Visually quieter: plain 75% `bg` scrim with no backdrop blur, a smaller and softer shadow, `rounded-lg` instead of `rounded-xl`, and a 160–180 ms fade with a 4 px rise instead of 8 px. Animation is off under `motion-reduce` (the global reduced-motion rule applies too).
  - `search.ts`: pure ranking (`parseEntryNumber`, `rankItems`, `hrefOf`, `PAGES`), with 18 vitest tests in `__tests__/search.test.ts`. Number lookup accepts `42`, `042`, `#42`, `№ 42`, `№42`, `no. 42`.
- **AudioPlayer** → `src/components/article/AudioPlayer.astro`. The same markup is server-rendered and a vanilla script enhances it on `astro:page-load`. Behaviour is unchanged: play/pause with a loading spinner, the seek range (±5 s on arrow keys, ±30 s on PgUp/PgDn, Home/End), the speed cycle, "Audio unavailable" on error, and it pauses on navigation. With JS off, the `<noscript>` native `<audio controls>` shows and the inert custom UI is hidden.
  - **Gotcha:** if `<audio src>` is in the server HTML, Chromium rejects the media after a ClientRouter navigation (`MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check`, because the element was parsed by DOMParser). So the URL lives in `data-src` and the script assigns `audio.src`.
  - In both `[...slug].astro` pages only the import and usage lines changed.
- **React removed:** the `@astrojs/react` integration, plus `react`, `react-dom`, `@types/react*`, `@vitejs/plugin-react` and `@testing-library/react` from package.json and the lockfile. `vitest.config.ts` no longer uses the react plugin, and `src/test/setup.ts` keeps only jest-dom.

## Numbers (uncompressed `dist/_astro` kB after load + idle, jsweight.mjs on :4372)
| Route | Before | After |
|---|---:|---:|
| Home | 246.9 | **28.0** |
| Journal | 241.3 | **22.4** |
| № 066 | 252.2 | **33.3** |
| № 030 | 257.0 | **33.3** |
| Projects | 237.1 | **18.1** |
| project detail (relearn-ing) | 241.9 | **18.1** |
| About | 237.1 | **18.1** |

`console errors`: none on every route. The palette chunk (24.8 kB) only loads on intent. № 066 also loads YouTube's own player JS (not counted, not ours).

## Checks
- `npx tsc --noEmit` ✓, `npx vitest run` ✓ (10 files, 72 tests), `npx astro build` ✓ (78 pages).
- Playwright `C:/Users/kedbi/Learn/relearn-shots/js-defer/e2e-defer.mjs`, all passing, with zero console errors:
  - Cold `/about/`: no palette or Fuse JS requested before intent. Ctrl+K immediately followed by typing "sisyphus" with no wait gives focus in the combobox, value `"sisyphus"` intact, and first hit № 030. Enter → `/journal/entry-030/` and the palette closes.
  - After client-side navigation: clicking the header Search button opens the palette, both sections show, and there are 10 items. "42" gives № 042 first and "№ 66" gives № 066 first. Tab stays in the input. Esc closes and focus returns to the Search button. `/` opens and Ctrl+K toggles closed.
  - Audio on № 030: play sets aria-pressed true and time advances. → then PgUp moves +35 s (valuetext "0:36 of 5:13"). Home → 0, speed → 1.25× (and so does `playbackRate`), pause works.
  - With JS disabled, the noscript native player shows and the custom UI is hidden.
  - Screenshots in `relearn-shots/js-defer/`: `palette-light2.png`, `palette-dark.png`, `audio-light.png`, `audio-dark.png`, `audio-nojs.png`. Both themes look right. (`palette-light.png` was captured mid-fade, so ignore it.)

## Notes for the lead
- `tsconfig.json` still has `"jsx": "react-jsx", "jsxImportSource": "react"`. It's harmless (no JSX remains; `JournalFilter.tsx` has none), but you could drop both lines or rename that file to `.ts`. I didn't touch it because it's outside my ownership.
- `@testing-library/jest-dom` and `jsdom` are kept for the existing test setup.
- Your staged deletions in `src/components/interactive/*` and the unstaged changes to `Header.astro`/`global.css` were left alone; all my commits used explicit pathspecs.
