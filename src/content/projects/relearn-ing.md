---
title: "relearn.ing: This notebook, its search and its audio"
date: "2025-12-16"
description: "A static Astro site that publishes numbered journal entries with search, narrated audio and an RSS feed. Built with Astro, TypeScript and Tailwind."
repoUrl: "https://github.com/kedbin/relearn.ing"
demoUrl: "https://relearn.ing"
techStack: ["Astro", "TypeScript", "Tailwind CSS"]
audioUrl: "https://audio.relearn.ing/relearn-ing.mp3"
---

> **Update, November 2026.** The site was redesigned: cool paper and graphite with a single blue accent, a ruled entry index, search that loads only when you open it, and no React on the page. Light and dark themes follow your system setting. Everything below is the original build note from December 2025, kept as written; its styling and roadmap sections describe that first version, not the current site. [Two Sites, Two Directions](/projects/two-sites-rebuilt/) covers the redesign.

## Build note, December 2025

### The Objective

I needed a system that was more than a blog. I needed a "Laboratory" — a space where the structure of the site itself reflected the engineering mindset I am trying to adopt. Standard CMS platforms felt too rigid; they were "passive cameras" recording text. I needed a generative model.

### The Stack Decision

I chose **Astro** for its "Islands Architecture." It perfectly mirrors the concept of modular cognitive function.

*   **Static by Default:** Just like Long Term Memory. Fast, efficient, and low-energy.
*   **Interactive Islands:** React components are hydrated only when needed (User Interaction). This mimics the brain's attention mechanism—spending glucose only on active problem solving.

### Implementation: The Journal Pipeline

The core feature is the Journal. I didn't want a simple Markdown renderer. I wanted a schema that forced me to think.

Using `zod` for content validation, I enforced a strict "Highlights" section in every entry:

```typescript
// src/content/config.ts
const journalCollection = defineCollection({
  schema: z.object({
    // ...
    highlights: z.array(z.string()).min(1), // Forced actionable takeaways
  }),
});
```

This acts as a "unit test" for my writing. If I can't extract 3 highlights, the build fails. The code rejects the thought as "noise."

### Styling (Dec 2025): The "Dark Mode" Default

I used Tailwind CSS to enforce a strict color palette (`slate-950` as base). This isn't just aesthetic; it's focus control. By reducing luminance, I reduce eye strain and increase the signal-to-noise ratio of the text (which uses high-contrast `slate-200`).

### Roadmap (as of Dec 2025)

*   **Obsidian Integration:** Automated syncing from my local Obsidian vault.
*   **Graph View:** A visual node graph of connected concepts (using D3.js).
