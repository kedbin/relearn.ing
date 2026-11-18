# Brief: about-projects (dev port 4333)

Read `docs/briefs/_common.md` first.

## Goal
Rebuild **About** as a real "about me" page for Kim, using his portfolio site binasoy.kim as the
source of truth. Also rebuild the **Projects** index and project detail pages in the new design language.

## Source material (read-only; do not edit anything in this folder)
- `C:/Users/kedbi/Learn/binasoy.kim/src/content/content.json` holds the profile (name, location Toronto,
  roles, tagline, summary, stats, links), the full `certs` list (featured flags, issuer, dates, credential
  URLs), the `skills` groups, the `experience` timeline (Accenture roles, and Relearning AI Labs founder),
  `projects` and `education` (BS Medical Technology, Far Eastern University; it is a career
  changer story worth telling briefly). Read the rest of that file too (`notebook` etc.) for personal
  colour (the van, Wingwing).
- Photos: `binasoy.kim/public/photos/van-0*.webp` and `binasoy.kim/NewProfilePicture.jpeg`. You may
  **copy** (not move) a profile photo and one or two van photos into `relearn.ing/public/about/`.
  Current relearn photo: `public/profile.jpg`.
- Keep the `/about` URL. Put the content in a typed data file so it is easy to update.

## Own these files
- `src/pages/about.astro` (rewrite)
- New: `src/data/about.ts` (profile, experience, certs, skills, curated from content.json)
- New: `src/components/about/*`
- `src/pages/projects/index.astro`, `src/pages/projects/[...slug].astro` (rewrite)
- New: `src/components/projects/*`
- New files in `public/about/`

## About page spec
Editorial and personal, not a résumé dump. Suggested structure (you may refine it):
1. **Intro.** A large `.h-display` line in Kim's voice (for example "Hi, I'm Kim. I automate things,
   including, lately, *myself*."), a portrait (an unrounded or slightly rounded photo with a mono caption like
   `Toronto · 2026`), and 2–3 short paragraphs: Accenture automation engineer, medtech to cloud career change,
   why relearn.ing exists (the engineer's paradox: he builds reliable systems for clients, but his own operating system was a mess).
   Add links to binasoy.kim, GitHub, LinkedIn and the résumé PDF (`https://binasoy.kim/Kim_Binasoy_Resume.pdf`).
2. **Now.** A small "Now" block: what he's working on (AI automation at Accenture, the FDE bootcamp,
   Georgia Tech analytics, this notebook). Add a mono "Updated Nov 2026".
3. **Readout.** The 3 stats from the profile (5×, 90%, 70%) as an instrument readout row (see the homepage hero
   aside for the pattern).
4. **Experience.** A ruled timeline: dates in a mono left gutter, role + company in `.h-title`,
   and 1–3 crisp bullets each. Include the career-start / education row at the end.
5. **Certifications.** Featured certs as a tidy ruled grid: issuer label, name, issued date, and a
   ↗ link to the credential. Put the non-featured ones behind a `<details>` "Show all N".
6. **Toolbox.** The skill groups as ruled definition-list rows (group label | comma-separated
   items). No pill clouds.
7. **Principles of the notebook.** 3–4 short statements about how relearn.ing is run (build in public,
   honest metrics, ship v0.1 habits, failures get logged). Get them from README.md in this repo.
8. **Contact** CTA: email `hello@binasoy.kim`, LinkedIn and Threads.
9. Optional personal touch: one van/lake photo with a caption about the camper van he and Wingwing built.
   Keep it tasteful.

## Projects spec
- **Index (`/projects/`).** Use `.h-display` with an italic word in the header. Each project is a large ruled row:
  year in the mono gutter, title (the part before `:`) in display/title type, the subtitle (the part after `:`),
  the description, the tech stack as a mono `·`-separated line, and repo/demo links on the right. You could
  feature the newest project or relearn.ing larger. No card grid.
- **Detail (`/projects/[slug]/`).** Match the article page's reading layout: breadcrumb
  `Projects / Name`, title, description as standfirst, a meta row (date, stack, Repo ↗, Live ↗), the
  `AudioPlayer` if there's `audioUrl` (import it from `src/components/AudioPlayer.tsx`; another
  agent is restyling it, so just use it), then the body in `<div class="prose-lab">`, then "Other
  projects" rows.

Report: `docs/briefs/about-projects-report.md`. Call report_to_coordinator when finished.
