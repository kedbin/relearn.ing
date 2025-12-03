# Relearn.ing Automation Protocol (Gemini.md)

This document serves as the standard operating procedure for AI agents (and humans) to autonomously manage content and features for [Relearn.ing](https://relearn.ing).

## 1. Content Ingestion Protocol (Adding Journals)

**Trigger:** User provides a raw text or Markdown draft (e.g., "turn this into a blog post").

### Algorithm:
1.  **Read Context:**
    *   Target Directory: `src/content/journal/`
    *   Schema Definition: `src/content/config.ts`

2.  **Generate Slug:**
    *   Find the next available entry number (e.g., if `entry-004.md` exists, create `entry-005.md`).

3.  **Construct Frontmatter:**
    *   **Strict Type Checking:** Ensure all fields from `src/content/config.ts` are present.
    *   **Date:** Use the **creation date** of the content (or the user-specified date), NOT necessarily the current system date.
    *   **Category:** Must match `Relearn Life / [Topic]` or `Relearn Engineering / [Topic]`.
    *   **Highlights:** Extract 3 specific metrics, models, or actionable takeaways.

    ```markdown
    ---
    title: "Title Here"
    date: "YYYY-MM-DD"
    summary: "Two-sentence engineering hook."
    status: "Published"
    category: "Relearn Life / Subcategory"
    highlights:
      - "Metric: X improves Y by Z%."
      - "Model: The theoretical framework."
      - "Action: The specific protocol."
    ---
    ```

4.  **Quality Assurance (Refinement):**
    *   **Concrete Examples:** Ensure every abstract concept (e.g., "Signal Audit") has a concrete, real-world example (e.g., "Rewriting a resume").
    *   **Tone Check:** Avoid overly pretentious or purely theoretical language. Ground the engineering metaphors in tangible reality.
    *   **Actionability:** The solution must be something the reader can *do*, not just think about.

5.  **Format Body:**
    *   Promote major sections to `##` (H2).
    *   Promote subsections to `###` (H3).
    *   Ensure no LaTeX is used (replace with Unicode/HTML entities).
    *   Verify code blocks have language tags (e.g., ```typescript).

6.  **Verification:**
    *   Run `npm run build` to validate the content schema.
    *   If the build fails, parse the error (usually a Zod validation error) and correct the frontmatter.

## 2. Deployment Protocol

**Trigger:** Content is verified and ready to publish.

### Algorithm:
1.  **Commit:**
    *   Message format: `feat(content): add journal entry-XXX - [Short Title]`
    *   *Example:* `feat(content): add journal entry-005 - The Rotting State`

2.  **Push:**
    *   Push to `main`.
    *   The GitHub Action (`.github/workflows/ci.yml`) will automatically build and deploy to `gh-pages`.

## 3. Analytics & Tracking

*   **PostHog Integration:** All pages, including individual journal entries, are automatically tracked via PostHog.
*   **Implementation:** PostHog is initialized in `src/layouts/Layout.astro` and captures pageviews on every route.
*   **Configuration:**
    *   Environment variables: `PUBLIC_POSTHOG_API_KEY` and `PUBLIC_POSTHOG_HOST` (see `.env.example`).
    *   The tracking captures all page visits, including individual journal entry pages (e.g., `/journal/entry-001`).
    *   No additional configuration needed for new journal entries - tracking is automatic.
*   **How it works:**
    *   PostHog is initialized on page load with the API key from environment variables.
    *   The `astro:page-load` event listener captures every pageview, including client-side navigation.
    *   Each journal entry page automatically inherits this tracking via `Layout.astro`.

## 4. System Maintenance

*   **Config:** `astro.config.mjs` controls the site build.
*   **Styles:** `src/styles/global.css` (Tailwind).
*   **Components:** `src/components/` (React/Astro).

## Current State
*   **Last Entry:** `src/content/journal/entry-007.md` ("Biological Big O").
*   **Raw Drafts:** None.
*   **Next Entry Number:** `entry-008.md`.

## Protocol for New Content
1.  **Ingest Raw Draft:**
    *   Read the raw markdown file provided by the user (e.g., `eighthjournal.md`).
    *   Determine the next entry number (e.g., `entry-008.md`).