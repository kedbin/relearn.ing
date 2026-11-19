---
title: "Two Sites, Two Directions: A van camp for the portfolio, a reading index for the notebook"
date: "2026-11-19"
description: "In July, the résumé was a button beneath a name and the deploy story was a result in the journal archive. By November, you could pick up the résumé from a van clipboard or call up entry 027 from the keyboard. Two rebuilds, traced through the same two tasks."
repoUrl: "https://github.com/kedbin/relearn.ing"
demoUrl: "https://binasoy.kim/"
techStack: ["Vite", "React Three Fiber", "Astro", "TypeScript"]
---

## Where the motion went

In July, an animated diagram sat beside the name on [binasoy.kim](https://github.com/kedbin/binasoy.kim/blob/b0eabb3/src/index.html). A [typing terminal](https://github.com/kedbin/relearn.ing/commit/a750196) opened relearn.ing. Neither animation was where you went to get the résumé or read an entry.

November changed that relationship in opposite ways. On the portfolio, a clipboard inside a minivan became a way to get a real document. On the notebook, the terminal gave way to links into the archive. These are still two independent sites. The [route board](#route-board) puts them in one write-up so you can follow what happened to each task.

## The portfolio: give the clipboard a job

The July portfolio put the PDF in the header and under the name. You didn’t need to read the work history or scroll to Contact to find it. A version of that route survives on the [plain reader](https://binasoy.kim/?reader): the résumé sits among the profile links, in the HTML itself.

The van adds a route the old page couldn’t offer. Choose **Hop in the van**, then visit Résumé at the camp. The clipboard opens a panel with a download link. The laptop opens a different part of the portfolio, a desktop called KimOS; it isn’t a required stop on the way to the clipboard.

The other button on the welcome card, **Take the scenic route**, keeps the reader and adds an illustrated road trip. On a wide screen the scenery follows the scroll; on a phone it becomes a still banner. The résumé link is still under the name. Plain reading is **not** a third button on that card: without JavaScript the reader is already there, and an ordinary visit with reduced motion or without WebGL also goes to the reader.

That distinction matters more than the number of clicks. A visitor who wants the camp can explore it. Opening the PDF doesn’t require rendering the camp at all.

## The notebook: give an entry two addresses

relearn.ing already ran on Astro. In the [July version](https://github.com/kedbin/relearn.ing/blob/a750196/src/pages/index.astro), the home page mounted React islands for its hero, recent entries and projects. To look up a particular piece, you could go to Journal and search its titles, summaries and body text. Searching for *deploy* worked, but you still had to recognise the right result: “The Binary Asymptote: Why Your Deploy Pipeline Has a Weight Problem.”

The November redesign kept the entry and its URL. What changed was how you could name it. On the home page, **The eight-second deploy** is a hand-picked link with a line about moving audio files to R2. That’s a way in even if you’ve never heard the original title. If you already know the number, open site search, type **27** and select the first result. Both routes land on [entry 027](/journal/entry-027/).

The distinction shows up in the implementation. The home pick is an ordinary link. The [search palette](https://github.com/kedbin/relearn.ing/blob/c725579/src/components/site/palette/search.ts) gives an exact entry number priority over fuzzy results; its script and index load on demand. The redesign [removed React](https://github.com/kedbin/relearn.ing/commit/46556b9), not interactivity. Search needs JavaScript. The home pick doesn’t.

## What the routes show

The portfolio offers **two invitations, not three**. The plain reader is the reason one of those invitations can stay light. And “fewer clicks” would miss the notebook’s useful change. A reader can recognise a story by its subject or recall it by number. One site makes room for a detour; the other gives an existing page another way to be found.

**Source note.** July on the board refers to the two 18 July revisions. The portfolio’s [public van-camp snapshot](https://github.com/kedbin/binasoy.kim/tree/0c3371d) is from **10 November** and predates the choice card; the November routes describe the [live portfolio](https://binasoy.kim/), not that snapshot. The notebook comparison uses its [November revamp](https://github.com/kedbin/relearn.ing/commit/3a4068d). The diagrams reconstruct supported paths, not recorded visits or performance measurements.

For the original builds, see [binasoy.kim: Portfolio and résumé](/projects/binasoy-kim/) and [relearn.ing: This notebook, its search and its audio](/projects/relearn-ing/).
