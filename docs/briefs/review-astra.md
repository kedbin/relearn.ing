# Brief: review-astra: independent design and UX review plus general direction (read-only)

You are an **independent senior reviewer** (product design, front-end craft and editorial UX) brought in by
the owner. You are **not** an implementer: **do not edit any files in the repo** except your own report.
Be candid. The owner has strong taste. His recent feedback was "this is rubbish", "too cheesy", "screams
Claude" and "NO SOB STORY". He wants something **simple, cool, crafted and modern**, not busy and not cute.

## Context
- Repo: `C:/Users/kedbi/Learn/relearn.ing` (branch `revamp`; compare against `main` for the old site). It is an Astro 5 static site,
  a public "lab notebook" of numbered journal entries by Kim Binasoy. His portfolio lives separately at binasoy.kim.
- Design intent: `docs/DESIGN.md`. History of decisions: `docs/briefs/*` (briefs and agent reports).
- A production build is served at **http://localhost:4321** (also on Tailscale). Review that, not a dev server.
- Screenshot helper: `MSYS_NO_PATHCONV=1 node C:/Users/kedbi/Learn/relearn-shots/shot.mjs http://localhost:4321 <outDir> /path/ ...`
  with env `SCHEME=light|dark` and `W=390|1440`. Put screenshots in `C:/Users/kedbi/Learn/relearn-shots/review-astra/`.
  Playwright is resolvable from `C:/Users/kedbi/Learn/relearn-shots/` if you want to script interactions (brush the
  homepage chart, select text in an article, toggle the theme, open ⌘K search).

## Review scope
Pages: `/`, `/journal/`, `/journal/entry-066/`, `/journal/entry-030/`, `/projects/`, `/projects/relearn-ing/`, `/about/`.
Check them in both themes, at desktop and mobile.

Assess and rate each **1–5** with evidence:
1. **First impression and identity.** Does it feel distinctive and crafted, or generic or AI-made? Is the palette ("Ink &
   Graphite") right? Is the hero's dictionary-entry concept strong or gimmicky?
2. **Simplicity.** What should be **removed**? List concrete elements that add noise. Be ruthless.
3. **Typography and layout.** Hierarchy, rhythm, measure, consistency across pages, and mobile.
4. **Interactions.** The record brush/playhead, reading pen, ink theme switch, ⌘K palette and journal filters. Which earn
   their place, which feel like gimmicks, and which have bugs or janky behaviour (test them)?
5. **Reading experience** on article pages.
6. **About page** (just rewritten to be minimal). Does it now meet the owner's feedback?
7. **Performance and accessibility smell test.** JS weight per page (check the `dist/_astro` sizes), focus states,
   contrast, and anything obviously broken.

## Deliverables (`docs/briefs/review-astra-report.md`)
1. **Verdict** in 3–5 sentences.
2. **Scorecard** (the 7 areas, scored 1–5, with a one-line justification each).
3. **Must-fix**: bugs and regressions, each with page, steps and the screenshot path.
4. **Cut list**: things to delete or simplify, ordered by impact.
5. **General direction**: where the site should go next (3–6 strategic recommendations: positioning, content
   structure, growth loops such as a newsletter, series and "start here" paths, and visual refinements). Make them concrete
   and opinionated.
6. **Top 5 next actions**, ranked, each sized S/M/L.

Then call report_to_coordinator with a short summary.
