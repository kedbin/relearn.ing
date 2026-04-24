---
title: "My LinkedIn Slides Were Trash, So I Asked My AI to Self-Correct"
date: "2026-04-24"
summary: "Three days into generating LinkedIn carousels for relearn.ing, I realized the initial approach was naive. Python Pillow coordinate drawing, dense article paragraphs, landscape video frames passed off as slides — none of it worked. So I gave the agent permission to research best practices, rewrite the pipeline, and iterate through eleven versions until the output was genuinely good. This is that story."
status: "Draft"
category: "Relearn Engineering / AI Engineering"
highlights:
  - "The first LinkedIn slide generator used Python Pillow to draw text into bounding boxes. It produced truncation, overlap, and rigid layouts that no amount of prompt tweaking could fix."
  - "Switching from image-coordinate drawing to HTML/CSS rendered by headless Chrome was the single biggest quality leap. AI handles layout composition far better when it can express it in CSS instead of pixel math."
  - "Having the agent research LinkedIn carousel best practices via Google Search and then self-correct the pipeline was more effective than manually specifying design requirements."
  - "Eleven iterations produced a portrait 4:5 mobile-first editorial carousel that looks nothing like the naive landscape decks we started with."
  - "The meta-lesson: when you give an AI a clear evaluation surface and the freedom to redesign within guardrails, self-correction becomes the fastest path to quality."
  - "Closing CTA slides now use actual YouTube and audio URLs from frontmatter instead of generic top-level domains — real links drive real clicks."
audioUrl: "https://audio.relearn.ing/entry-063.mp3"
linkedin_document_urn: "urn:li:document:D4E10AQFjLwsXCUWwSA"
linkedin_document_title: "My LinkedIn Slides Were Trash, So I Asked My AI to Self-Correct · LinkedIn Slides"
youtube_url: "https://www.youtube.com/watch?v=OKgxpwoNaxQ"
youtube_video_id: "OKgxpwoNaxQ"
publish_social: true
linkedin: |
  Three days back, I pivoted to LinkedIn carousel posts for my relearn.ing journal.
  
  Looking back, my initial approach was naive.
  
  I used a Python script (Pillow) to draw text into bounding boxes on images. That opened a can of worms:
  - text truncation at random widths
  - manual coordinate math for every layout change
  - rigid templates that produced the same card twelve times in a row
  
  So I switched to HTML.
  
  The theory was simple: AI handles CSS layout far better than pixel-coordinate drawing. Headless Chrome renders the deck, screenshots the previews, and prints it to PDF.
  
  That fixed the truncation, but the design was still an issue. The slides looked like article pages pasted onto dark backgrounds.
  
  So I asked the agent to use the Google Search skill to distill LinkedIn carousel best practices from marketing and design sources, then self-correct the pipeline and integrate the findings.
  
  After 11 iterations, it produced a portrait 4:5 mobile-first editorial carousel that looks nothing like what we started with.
  
  Here's what changed across those iterations:
  
  Pivot 1: Python → HTML
  Bounding boxes became CSS. Layout composition moved from manual pixel math to semantic markup.
  
  Pivot 2: Landscape → Portrait
  Research showed mobile-first portrait 4:5 dominates LinkedIn engagement. Landscape slides felt like video frames, not carousels.
  
  Pivot 3: Article → Carousel
  Dense article paragraphs became one-idea-per-slide editorial cards with visual anchors, emoji badges, and story-arc structure.
  
  Pivot 4: Template → Creative Freedom
  Instead of rigid templates, I gave the agent character budgets, aesthetic guidelines, and layout archetypes — then let it compose within those guardrails.
  
  Pivot 5: Review Loop
  I launched a dedicated visual review worker that inspected PNG screenshots as the primary surface and returned structured blocker/critique findings. The generator fixed based on review output, not vibes.
  
  The meta-lesson:
  
  I didn't micromanage each slide.
  I gave the system a way to see its own output and a target to aim at.
  
  The constraint is the interface, not the implementation.
  
  Full writeup:
  https://relearn.ing/journal/entry-063/
threads: |
  My LinkedIn slides were trash, so I asked my AI to self-correct.
  
  3 pivots that made the difference:
  1. Python Pillow → HTML/CSS (AI handles layout composition better)
  2. Landscape 16:9 → Portrait 4:5 (research-backed, mobile-first)
  3. Rigid templates → Creative freedom with character budgets + review loop
  
  After 11 iterations, the output went from naive article screenshots to genuine editorial carousels.
  
  The key: I didn't specify every pixel. I built the evaluation loop and let the system correct itself.
  
  Full writeup: https://relearn.ing/journal/entry-063/
youtube_title: "How I Let My AI Agent Self-Correct Through 11 Iterations"
youtube_description: |
  Three days into generating LinkedIn carousels for relearn.ing, the slides were terrible. So I gave the agent permission to research best practices, rewrite the pipeline from Python to HTML, and iterate through eleven versions. This is the story of how self-correction beat manual specification — and what it means for building with AI.
  
  Full writeup: https://relearn.ing/journal/entry-063/
youtube_privacy_status: "public"
---

Three days ago, I pivoted to LinkedIn carousel posts for my relearn.ing journal entries.

Looking back, my initial approach was naive.

I wrote a Python script that used Pillow to draw text into bounding boxes on blank images. The idea was straightforward: extract key ideas from a journal entry, format them onto dark-background slides, export as PDF, upload to LinkedIn.

The reality was a can of worms.

Text truncated at unpredictable widths because the font-metrics calculation never matched the actual render. Different text lengths needed different bounding-box coordinates, which meant every layout change required manual pixel math. The template produced nearly identical cards twelve slides in a row because it had no concept of layout variety. And the dense article paragraphs pasted onto each slide made them feel like wall-of-text screenshots, not visual content.

**Full article at relearn.ing:** https://relearn.ing/journal/entry-063/
**Watch:** https://www.youtube.com/watch?v=placeholder
**Listen:** https://audio.relearn.ing/entry-063.mp3

That was version one.

### The Problem Was Not the Agent. It Was the Medium.

The first insight came fast: AI handles HTML and CSS layout composition far better than pixel-coordinate drawing.

When you ask a model to place text at `(x=120, y=340)` on a blank canvas, it is guessing at font metrics, wrapping behavior, and visual balance. When you ask it to write HTML with flexbox and semantic classes, it can express layout intent directly. The browser handles the rendering.

So I rewrote the slide generator as an HTML-first pipeline: the agent creates a visual HTML deck, headless Chrome screenshots the previews for review, and the same deck gets printed to PDF for LinkedIn upload.

That fixed the truncation problem immediately. CSS handles text wrapping, overflow, and responsive layout. The agent no longer needed to predict where text would land.

But the design was still an issue.

### When the Medium Is Right but the Design Is Wrong

The HTML slides did not truncate, but they still looked like article pages pasted onto dark backgrounds. Dense paragraphs. No visual hierarchy. No story arc. No sense that these were meant to be swiped through on a phone.

This is where I made the decision that changed everything.

Instead of manually specifying more design requirements — which is what I had been doing, and which was not working — I asked the agent to research LinkedIn carousel best practices on its own.

I pointed it at the Google Search skill and said: find out what makes a good LinkedIn carousel, distill the findings, self-correct the pipeline, and integrate the results.

The agent searched across marketing and design sources: Les Années Folles, PostNitro, Oktopost, ServiceNow. It extracted common patterns — portrait format, one idea per slide, strong cover hook, clear story arc, single dominant CTA — and codified them into a durable reference document.

Then it rewrote the slide generator to apply those principles.

That was the inflection point.

### Eleven Iterations

What followed was not a single magical fix. It was eleven iterations, each addressing a different failure mode the agent discovered by looking at its own output.

**v1–v3: Python to HTML, but still article-like.** The generator pulled paragraphs directly from the journal entry and tried to fit them onto slides. Result: dense, text-heavy cards that no one would swipe through.

**v4: Layout archetypes and CTA hierarchy.** The agent introduced distinct layout types — split, quote, flow, poster, CTA — and enforced a dominant final call-to-action instead of three equal raw URLs. This added visual variety but the content was still too wordy.

**v5–v7: Portrait pivot and editorial redesign.** Based on the research findings, the agent switched from landscape 16:9 to portrait 4:5 (1080×1350). It added emoji badges, decorative rhythm bars, and visual anchors. It shortened copy to one idea per slide. This was the first version that started to feel like a carousel instead of a document.

**v8–v10: Headless Chrome edge cases.** The rendering pipeline hit a bottom white-strip artifact in Chrome screenshots. The agent debugged this by adjusting the viewport height and adding a non-white default background while preserving correct PDF page dimensions. It also caught a bug where the inserted "Full article / Watch / Listen" links were being treated as article content and turned into a bogus slide.

**v11: Final polish.** Eight clean slides. Billboard cover with a strong hook. One idea per body slide. Alternating layouts. Visual anchors without emoji overload. Single dominant CTA pointing to the full article. PDF page count verified at 8. PNG previews clean across all slides.

That was the version I shipped.

### The Five Pivots

Looking at the full arc, five decisions mattered more than the rest.

**Pivot 1: Python to HTML.** Moving from Pillow coordinate drawing to CSS layout was the single biggest technical improvement. It eliminated truncation, unlocked layout variety, and let the agent express visual intent through markup instead of pixel math.

**Pivot 2: Landscape to portrait.** The research was clear: mobile-first portrait 4:5 dominates LinkedIn engagement. Landscape slides felt like video frames, not carousels. This was not my intuition — it was the agent's research finding.

**Pivot 3: Article to carousel.** Dense paragraphs became one-idea-per-slide editorial cards. The shift from "reproduce the article on slides" to "distill the article into a visual story" was the hardest conceptual pivot, and the agent only made it after researching how actual carousel creators structure their content.

**Pivot 4: Templates to creative freedom.** Instead of rigid templates with fixed slots, I gave the agent character budgets (title ≤ 52 chars, bullet ≤ 42 chars, max 3 bullets), aesthetic guidelines (dark editorial, teal accent, amber highlight), and layout archetypes. Then I let it compose within those guardrails. The output was more varied and more visually interesting than anything the rigid templates produced.

**Pivot 5: The review loop.** I launched a dedicated visual review worker that inspected PNG screenshots as the primary surface and returned structured findings: which slides were broken, which were bland, which had truncation or overlap. The generator fixed based on structured review output, not vibes. This was the feedback mechanism that made self-correction possible.

### Why Self-Correction Worked

I did not specify every pixel. I did not design each slide. I did not even write the slide copy.

What I did was build the evaluation loop.

The system could see its own output through PNG screenshots. It had a target to aim at through the carousel guidelines distilled from research. And it had the freedom to redesign within those constraints.

This is the same pattern that works in any feedback-driven system: clear evaluation surface, concrete success criteria, and room to explore within bounds.

The constraint is the interface, not the implementation.

That sentence showed up in the previous entry too — the one about software fundamentals and Matt Pocock's talk. It applies here as well. The slide quality jumped not because I told the agent exactly what to draw, but because I built the environment where the agent could not drift too far without the system catching it.

The carousel guidelines became the constraint. The review worker became the safety net. And the HTML medium gave the agent enough expressive power to actually fix what the review found.

### What This Means for Building with AI

The pattern generalizes beyond slide generation.

When you give an AI agent a task, the fastest path to quality is usually not tighter specification. It is:

1. A clear evaluation surface — what does "good" look like in a form the agent can inspect?
2. Concrete guardrails — what are the hard constraints the output must satisfy?
3. Freedom within those guardrails — let the agent compose, not fill slots.
4. A feedback loop — structured review of actual output, not speculation about what might go wrong.

This is what the relearn.ing pipeline has been teaching me across every entry. The pipeline works when agents have boundaries: explicit roles, clear artifacts, callback synchronization, and verification gates. It breaks when I try to micromanage the implementation instead of designing the constraints.

The LinkedIn slide journey from v1 to v11 was a compressed version of the same lesson.

I did not get better slides by specifying better slides.

I got better slides by building a system that could evaluate and correct its own output.

### What Got Distilled

The carousel guidelines, character budgets, HTML-first pipeline, portrait defaults, and review-gate checklist are now codified in the relearn.ing pipeline reference docs. Every future run will inherit these improvements without needing to re-learn them.

That is the compounding benefit of self-correction: the agent does not just fix the current output. It improves the system that produces all future output.

The eleven versions are in `/tmp`. The durable knowledge is in the reference docs. And the next entry's slides will start from v11 quality, not v1.

That is the real ROI of letting the agent self-correct.
