---
title: "relearn.ing: The Cognitive Architecture Platform"
date: "2025-12-16"
description: "A digital garden built to track the re-engineering of human cognition. Built with Astro, React, and Tailwind."
repoUrl: "https://github.com/kedbin/relearn.ing"
demoUrl: "https://relearn.ing"
techStack: ["Astro", "React", "Tailwind CSS", "TypeScript"]
audioUrl: "https://audio.relearn.ing/relearn-ing.mp3"
---

## The Objective

I needed a system that was more than a blog. I needed a "Laboratory" — a space where the structure of the site itself reflected the engineering mindset I am trying to adopt. Standard CMS platforms felt too rigid; they were "passive cameras" recording text. I needed a generative model.

## The Stack Decision

I chose **Astro** for its "Islands Architecture." It perfectly mirrors the concept of modular cognitive function.

*   **Static by Default:** Just like Long Term Memory. Fast, efficient, and low-energy.
*   **Interactive Islands:** React components are hydrated only when needed (User Interaction). This mimics the brain's attention mechanism—spending glucose only on active problem solving.

## Implementation: The Journal Pipeline

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

## Styling: The "Dark Mode" Default

I used Tailwind CSS to enforce a strict color palette (`slate-950` as base). This isn't just aesthetic; it's focus control. By reducing luminance, I reduce eye strain and increase the signal-to-noise ratio of the text (which uses high-contrast `slate-200`).

## Future Roadmap

*   **Obsidian Integration:** Automated syncing from my local Obsidian vault.
*   **Graph View:** A visual node graph of connected concepts (using D3.js).
