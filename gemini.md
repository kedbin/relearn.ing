# Relearn.ing Automation Protocol (Gemini.md)

This document serves as the standard operating procedure for AI agents (and humans) to autonomously manage content and features for [Relearn.ing](https://relearn.ing).

## 1. Content Ingestion Protocol (Adding Journals)

**Trigger:** User provides a raw text or Markdown draft (e.g., "turn this into a blog post").

### Algorithm:
1.  **Read Context:**
    *   Target Directory: `src/content/journal/`
    *   Schema Definition: `src/content/config.ts`
    *   Style Guide: `DEPLOYMENT_GUIDE.md` (Section 3)

2.  **Generate Slug:**
    *   Find the next available entry number (e.g., if `entry-004.md` exists, create `entry-005.md`).

3.  **Construct Frontmatter:**
    *   **Strict Type Checking:** Ensure all fields from `src/content/config.ts` are present.
    *   **Date:** Use the current date (`YYYY-MM-DD`) unless the text specifies a historic event date.
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

4.  **Format Body:**
    *   Promote major sections to `##` (H2).
    *   Promote subsections to `###` (H3).
    *   Ensure no LaTeX is used (replace with Unicode/HTML entities).
    *   Verify code blocks have language tags (e.g., ```typescript).

5.  **Verification:**
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

## 3. System Maintenance

*   **Config:** `astro.config.mjs` controls the site build.
*   **Styles:** `src/styles/global.css` (Tailwind).
*   **Components:** `src/components/` (React/Astro).

## 4. Current State (Memory)
*   **Last Entry:** `entry-006.md`
*   **Theme:** Engineering/Systems Thinking applied to Life.