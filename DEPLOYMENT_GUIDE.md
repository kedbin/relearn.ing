# Relearn.ing: Engineer's Operating Manual

**Current Stack:** Astro v5, React, Tailwind CSS, GitHub Pages.
**URL:** https://relearn.ing

---

## 1. Core Philosophy (The "Why")
This is an **engineering log for both code and existence**.

### "v0.1.0-beta // Continuous Integration for the Self"
We treat personal growth as a DevOps pipeline, not a waterfall project.
*   **The Dual Mission:** "Debugging the Cloud. Refactoring Life." We apply the same rigorous systems thinking to GCP architectures as we do to biological habits.
*   **Eternal Beta:** We are not "v1.0" gurus. We are buggy, work-in-progress software. We ship "beta" habits, expecting failures (exceptions), patching them, and deploying the fix.
*   **Anti-Hype:** We do not celebrate tools; we celebrate *velocity* and *leverage*.
*   **Failure-First:** We document the 50 failed prompts, not just the one that worked.
*   **Grounded in Reality:** Arguments must be backed by economic models (e.g., Solow-Swan), cognitive science (e.g., Extended Mind), or hard metrics (e.g., "hours saved").

---

## 2. Architecture & Deployment
We migrated from a Client-Side React SPA to **Astro (Static Site Generator)**.
*   **Why?** Better SEO, performance, and significantly easier content management (Markdown files become pages automatically).
*   **Routing:** handled by Astro's file-system routing (`src/pages`).
*   **Styling:** Tailwind CSS + `@tailwindcss/typography` for markdown rendering.

### Interactive Components (Islands)
*   **Journal Search:** Implemented as a client-side React component (`JournalList.tsx`) hydrated with `client:load` to provide instant filtering without server roundtrips.

### The Deployment Pipeline
1.  **Trigger:** Push to `main`.
2.  **Action:** GitHub Action (`ci.yml`) installs dependencies, runs `npm run build`.
3.  **Build Output:** Astro generates static HTML/CSS/JS into the `dist/` folder.
4.  **Deploy:** The `dist/` folder is pushed to the `gh-pages` branch, which serves the live site.

**Critical Configuration Note:**
*   `astro.config.mjs` must have `site: 'https://relearn.ing'`.
*   **DO NOT** use a `base` path (like `/relearn.ing`) if using a custom domain at the root. This will break asset loading.

---

## 3. Content Protocol: Adding a Journal Entry

**Target Audience:** Engineers, Architects, and Systems Thinkers.

### Step 1: The Source File
Create a new Markdown file in:
`src/content/journal/`
*   Naming convention: `entry-XXX.md` (e.g., `entry-003.md`).

### Step 2: Frontmatter (Metadata)
You **must** include these fields. The `category` field MUST start with one of the two supported buckets.

**Supported Categories:**
1.  `Relearn Life / [Topic]` (e.g., Behavioral Economics, Health, Habits)
2.  `Relearn Engineering / [Topic]` (e.g., AI Augmentation, Cloud, DevOps)

```markdown
---
title: "The Title: A Systems Engineering Metaphor"
date: "YYYY-MM-DD"
summary: "A 2-sentence hook. What is the engineering principle applied to this problem?"
status: "Published"
category: "Relearn Engineering / AI Augmentation"
highlights:
  - "Key Takeaway 1: The Metric (e.g., 5.3x speedup)"
  - "Key Takeaway 2: The Model (e.g., 90-90 Rule)"
  - "Key Takeaway 3: The Application"
---
```

### Step 3: The Voice (Style Guide)
*   **Perspective:** **First Person ("I").** You are the engineer/author. Do not refer to "the notes," "the user," or "the author." Speak directly from your own experience and observations.
*   **Do not use:** "Unlock your potential," "Journey," "Magic," "Believe in yourself."
*   **Use:** "Optimize," "Leverage," "Constraint," "Latency," "Protocol," "Audit."
*   **Structure:**
    1.  **The Fallacy:** What does culture/legacy code say? (e.g., "Work harder" or "Monoliths are safe").
    2.  **The Model:** What does science/engineering say? (e.g., "Diminishing Returns" or "Microservices").
    3.  **The Data:** Proof from the author's life (metrics, logs, diffs).
    4.  **The Protocol:** A specific algorithm for the reader to execute.

### Technical Note: Special Symbols
*   **Do not use LaTeX:** The site does not currently support LaTeX rendering (e.g., `$\rightarrow$`).
*   **Use Unicode/HTML Entities:** For arrows or mathematical symbols, use standard Unicode characters (e.g., `→`) or HTML entities (e.g., `&rarr;`).

### Step 4: Verification & Build
Before pushing, you must verify the build locally.

1.  **Run Dev Server:** `npm run dev` (Access at http://localhost:3000).
2.  **Check the Entry:** Navigate to `/journal/entry-XXX` and verify formatting.
3.  **Production Build:** Run `npm run build`.
    *   *Success:* "✓ Completed in X.Xs."
    *   *Failure:* Read the error log. usually a missing Frontmatter field.

---

## 4. Future Development Instructions (For AI Agents)

> **Note:** For autonomous content ingestion and automation protocols, refer to `gemini.md`.

**If asked to refactor or add features:**
1.  **Respect the Astro Island Architecture:** Keep React components in `src/components`. Only hydrate them if necessary (`client:load` or `client:visible`). Default to static.
2.  **Tailwind First:** Do not create `.css` files. Use utility classes. Use `src/styles/global.css` only for base layer resets.
3.  **Type Safety:** All content collections are typed in `src/content/config.ts`. If you add a new data type (e.g., "Projects"), you must define its Zod schema there first.

**Regression & Layout Safety:**
*   **The Pre-Tag Blowout:** In `src/pages/journal/[...slug].astro`, the `<article>` tag MUST have `min-w-0`.
    *   *Reason:* Tailwind/CSS Grid cannot compute the width of a child `<pre>` block (code snippet) if the parent does not have a constrained width. Without `min-w-0`, long code lines will force the mobile view to horizontal scroll or break the layout.

**If asked to "Check why the site is broken":**
1.  Check `astro.config.mjs` for `base` path misconfigurations.
2.  Check the GitHub Actions logs for build failures.
3.  Verify that `dist/` is being generated correctly in the local environment.
