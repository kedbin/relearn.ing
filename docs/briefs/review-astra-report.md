# Astra review · relearn.ing

## Verdict
Keep the numbered notebook, the blue ink and the ruled lists. Compared with `main`’s hero panel and separate hydrated previews, this feels like one publication, and it is recognisable in either theme without the logo. The dictionary headword is strong; three definitions, a pronunciation and an explanation of the suffix turn a good piece of lettering into a pitch. The next pass should shorten the distance to a good entry, not invent another interaction.

Reviewed the served production build at `localhost:4321`: all seven requested routes at 1440 and 390, light and dark (Chromium; 390 is a viewport check, not a physical touch-device test). Screenshot filenames below are relative to `C:/Users/kedbi/Learn/relearn-shots/review-astra/`.

## Scorecard

| Area | /5 | Evidence |
|---|---:|---|
| Identity | 4 | Cool paper is more distinctive than the dark slate; the little blue № and narrow display type work on an ordinary list row as well as on the masthead. |
| Simplicity | 3 | On mobile the home chart only begins near the bottom of the first screen; not one entry title precedes it. The archive offers a second timeline before the list. |
| Typography & layout | 4 | The narrow article measure, serif body and sans summaries are well differentiated. Project titles break handsomely on mobile; faint mono metadata is another matter. |
| Interactions | 4 | Brush → filtered archive is real navigation; search and persistent marks work. The theme wipe and delayed masthead writing compete for attention without helping a task. |
| Reading | 4 | № 030 has a quiet, compact audio strip; № 066 has a useful day-by-day sequence. On a phone the entire four-day index precedes the first paragraph, even when I arrived to read a specific day. |
| About | 4 | Yes, it meets the brief: a portrait, three short rows and a clear handoff to binasoy.kim. No origin story. “Fig. 1” for the only portrait and a WHAT row that restates Home are expendable. |
| Performance & accessibility | 3 | Keyboard skip focus is conspicuous; mobile widths held. A static About still requests 237 kB of JS; several small text roles fail AA contrast in both themes. |

## Must-fix

1. **Faint text fails normal-text contrast.** `/about/` and `/`: read the figure caption and hero dateline in light, then dark. The faint token over the page background measures **2.93:1 light, 3.53:1 dark**; the target for these small labels is 4.5:1. Raise contrast on semantic text, not on decorative rules. Evidence: `_about_-light-390.png`, `_-dark-390.png`.
2. **Mobile primary navigation has no fallback.** Disable JS, open `/about/` at 390, let it settle, click the header menu: nothing opens; the brand remains the only visible header link. Search can reasonably degrade; reaching Journal and Projects shouldn't require hydrating a menu. Use a native disclosure or expose the links without JS. Evidence: `about-nojs-menu.png`.
3. **The site’s own project page describes a different site in the present tense.** From `/projects/`, open relearn.ing, then read “Styling: The ‘Dark Mode’ Default” in light mode. It says the scheme is enforced slate-950/slate-200; the live page is cool paper and graphite. Preserve the original as a dated build note, with a short update above it; don't present the old roadmap as current. Evidence: `_projects_relearn-ing_-light-1440.png`.

## Interaction and cost checks

- **Record:** moving across the plot and dragging a window selected Dec 13–Mar 5, **35 entries / 41k words**. “Open in journal” carried both bounds, displayed 35 rows; clear restored 68. Keep the playhead as a date probe, but give it secondary billing: an unmarked reader is likelier to recognise an entry title than an interesting date range. Evidence: `e2e-brush.png`, `e2e-journal-range.png`.
- **Journal/search:** filtering for “sisyphus” produced one entry. From About, Ctrl-K → “sisyphus” → Enter navigated to № 030. Keep both: one narrows a list in place; the other jumps across the site. Don't give them equal-sized calls to action.
- **Pen:** selecting a paragraph in № 030 exposed Highlight; after highlighting and reloading, one mark remained in the prose. Useful precisely because an unmarked page doesn't look like an annotation app. Keep it contextual.
- **Theme:** one click flipped and persisted exactly once on About, Projects and № 066, including a return to About via client navigation. Keep the switch; an immediate colour change would communicate the same result.
- **Cost:** distinct external `.js` resources observed after a direct load + idle, summed using uncompressed `dist/_astro` file sizes (decimal kB; not transfer bytes or a Lighthouse result): Home **247**, Journal **241**, № 066 **252**, № 030 **257**, Projects **237**, project detail **242**, About **237**. Shared `client.9unXo8s5.js` alone is 187 kB; palette 26 kB; pen 15 kB; record 10 kB. Defer palette code/runtime until intent on pages without another island that needs it. Retest first keyboard invocation as well as bundle savings.
- **Focus:** first Tab on About exposes “Skip to content” with a solid 2px blue outline. No document-width overflow observed on the seven narrow routes. These are spot checks, not an accessibility certification.

## Cut list, greatest impact first

1. Replace the three dictionary definitions with one plainly authored sentence. Cut the IPA, the “Note the -ing” explanation and the delayed reveal of the suffix. Keep the finished headword; put a named entry link directly beneath it.
2. Stop repeating the census. Give the full record one home; remove the mini chart and word/audio totals above Journal filters. Keep the **filtered result count** because it answers a question the reader just asked.
3. Collapse article series navigation on mobile to “Day 2 of 4 · View series”; show next day after the text. Don't put four destinations between the dek and the article.
4. Collapse the journal topic inventory. “Systems”, “Systems Engineering”, “Systems Thinking” and “System Design” are not four useful doors to a first-time reader. Manually curate a few trails; keep granular tags searchable.
5. Remove the ink wipe, About’s figure number and the projects census (“Open source 6/6”). Give the space to names, dates and things a reader can open.

## General direction

- **Position it as Kim’s record of things tried, not a theory of human cognition.** Lead a project with the problem and one observable outcome. “One Push, Everywhere” tells me more about the fan-out project than “Cognitive Architecture Platform” tells me about this site. Keep portfolio and résumé off the notebook proper.
- **Give a newcomer a reading order that isn't chronological.** Replace “or begin at № 001” with three handpicked starts: one build, one failed assumption, one changed habit. Each needs one sentence saying why it made the cut, not another abstract category.
- **Make the series the unit of return.** FDE already has four connected entries: land at Day 1, show position during reading, link directly to the next day at the end. Prefer that to several equally weighted related entries.
- **Offer a return channel after value is delivered.** Keep RSS. Try a small email invitation at the end of a completed series: “Get the next set of field notes.” Send a short digest with an actual finding, not every entry or a weekly promise the visible gaps contradict. No modal.
- **Make quietness a constraint.** One accent, one major graphic, one primary destination per opening screen. Where extra space is available on desktop, leave it empty rather than adding a label. Spend the craft budget on the writing and on readable metadata.

## Top five next actions

1. **S** — Fix faint text contrast and the no-JS mobile nav; verify both on the rendered site.
2. **M** — Cut Home to headword, one sentence and one named starting entry before the record. Check the first 390px-wide screen, not just desktop.
3. **S** — Date/update the site’s own project note and replace its abstract subtitle with what the software does.
4. **M** — Ship a curated “start here” route and compact mobile series navigation; remove the redundant archive chart when doing so.
5. **M** — Defer the shared search payload and compare cold About JS before/after, with keyboard and menu regression checks.
