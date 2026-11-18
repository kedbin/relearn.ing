# ix-pen — Article reading pen

- Selecting three or more words opens the contextual pen: highlight, copy a text-fragment quote, or share through the system sheet when supported. Tab enters the toolbar; H inks the selection. Existing marks expose Remove.
- Ink is stored per entry as exact quote plus surrounding context. Multiple DOM fragments can belong to one mark without reparenting author elements. The modal “Your marks” drawer jumps to saved passages, exports Markdown to the clipboard, and confirms clearing.
- Numbered citations with matching References/Sources paragraphs and GFM footnotes have previews. GFM links keep their original mouse and keyboard navigation; their touch preview includes a jump link. Without JS the article and citations stay unchanged.
- Files: `src/components/article/pen/{ArticlePen.astro,pen.ts,dom.ts,references.ts,quote.ts,quote.test.ts}`; `src/pages/journal/[...slug].astro` only mounts the pen and marks the prose root. No shared-file changes requested.

## Verification

- Port 4342 only. `npx tsc --noEmit` passed; `npx vitest run` passed (41 tests including five new selector tests, one covering a duplicate quote after a nearby edit).
- Chromium, light and dark at both 1440 and 390 px. Checked keyboard selection, Tab/H, clipboard and Markdown export, touch taps, drawer focus wrapping, Escape, jump, persistence on reload, removal, clear confirmation, real mouse drag, Astro client navigation without duplicate bindings, no-JS, and a GFM fixture with touch preview/jump. The mobile selection itself was injected as a DOM Range, not via OS selection handles.
- Screenshots: `C:/Users/kedbi/Learn/relearn-shots/ix-pen/{selection,drawer,reference}-{light,dark}-{1440,390}.png`. Browser verification script is alongside them, outside the repo.
- Minified client modules measure ~5.7 KB gzip via esbuild (excluding the small Astro bootstrap).

## Limits

- Overlapping selections can be copied/shared but not inked until the overlapping mark is removed. Exact-text edits or tied duplicate matches leave the saved quote available for export but not jumpable.
- Native Share is capability-gated; the operating-system sheet and physical iOS text handles were not exercised.
- The pre-existing dirty `.astro/data-store.json` was left alone.
