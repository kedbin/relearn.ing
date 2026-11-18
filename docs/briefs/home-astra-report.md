# Homepage redesign

**Headline:** Automation in practice.

**Supporting line, default description and footer blurb:** Case studies in coding agents, deployment pipelines and the choices behind them.

**Feature:** “Latest entry” / “Read entry →”, framing the current entry number, date and original title.

**Start here**
- Deployment / The eight-second deploy — How moving audio to R2 cut deploys from five minutes to eight seconds.
- Automation / The Excel script that beat the agent — Why an HR team needed a formatting script instead of a new workflow.
- Decisions / Deciding when to stop — Setting a stopping rule before a study session or a workout.

**Lower section:** Projects

The two-line Instrument Serif headline identifies the subject rather than repeating the logo. The latest entry gets the facing column, with a graphite top rule and a single full-panel link. The same three curated selections sit directly below, with descriptions on desktop. After inspecting the first screenshots, I switched the mobile picks to numbered index rows with shorter editorial titles: all three now fit in the opening 390×844 view. The interactive record follows as the only chart, then projects and the existing follow block. No new client script or animation.

## Verification
- Inspected light and dark screenshots from the 4381 dev server at both widths, then repeated after refining the picks.
- Screenshots in `C:/Users/kedbi/Learn/relearn-shots/home-astra/`: `_-light-1440.png`, `_-dark-1440.png`, `_-light-390.png`, `_-dark-390.png`. `review.jpg` compares the four opening screens (mobile cropped to 844px).
- `npx tsc --noEmit`: passed.
- `npx vitest run`: 69 tests passed across 10 files.
- `npx astro build`: passed, 78 pages.
- Restarted the production preview on `0.0.0.0:4321`; HTTP 200 and the built homepage contains the new headline.
