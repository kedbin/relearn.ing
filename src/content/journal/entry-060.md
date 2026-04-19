---
title: "The LinkedIn Slides Pivot: Why Relearning Flow Split Reading From Watching"
date: "2026-04-18"
summary: "Relearning Flow used to push the video layer toward both LinkedIn and YouTube. The better architecture turned out to be platform-specific: YouTube keeps the motion layer, LinkedIn gets a purpose-built slide deck, and multimodal review with Qwen 3.6 Plus now sits inside W3 as a visual quality gate while GPT-5.4 stays focused on reasoning-heavy orchestration and workflow design."
status: "Published"
category: "Relearn Engineering / AI Engineering"
highlights:
  - "LinkedIn slides became the better fit because they let readers control pace, reread key frames, and absorb the argument without being forced through a video timeline."
  - "The pipeline now treats YouTube video and LinkedIn slides as different end products, not one asset awkwardly reused across two very different platforms."
  - "GPT-5.4 remained the reasoning-heavy agent for workflow design and system changes, while Qwen 3.6 Plus was delegated the multimodal job of inspecting slide artifacts visually."
  - "The visual review step is now iterative and belongs inside W3: generate slides, review them, fix clipping or safe-area defects, and only then upload to LinkedIn."
audioUrl: "https://audio.relearn.ing/entry-060.mp3"
linkedin_document_urn: "urn:li:document:D4E10AQEAyKKJI1MXnA"
linkedin_document_title: "The LinkedIn Slides Pivot: Why Relearning Flow Split Reading From Watching"
youtube_url: "https://www.youtube.com/watch?v=09MUcUwVp70"
youtube_video_id: "09MUcUwVp70"
publish_social: false
linkedin: |
  I had already solved what I thought was the hard part in the relearn.ing pipeline:
  draft → audio → video → publication.
  
  But then I looked at the LinkedIn output the way a reader would.
  
  That changed the problem.
  
  The videos were not bad.
  LinkedIn was just the wrong place to force the full video experience.
  
  So we pivoted:
  
  - YouTube keeps the video layer
  - LinkedIn gets a dedicated slide deck
  - relearn.ing stays the long-form source
  - audio stays in the pipeline, but on the surface where it fits best
  
  The real reason was digestibility.
  
  Slides let readers move at their own pace.
  They can skim, pause, reread, and dwell on the exact frame that matters.
  That fits LinkedIn better than asking them to keep up with a full video timeline.
  
  The other interesting shift was model delegation.
  
  We used a high-reasoning agent (GPT-5.4) to redesign the workflow, helpers, contracts, and publishing logic.
  
  But once the slide deck existed, we delegated visual review to `Qwen 3.6 Plus` because multimodality matters when the question becomes:
  
  does this actually look right?
  
  That led to a better pattern:
  
  - reasoning agent for architecture
  - multimodal agent for artifact review
  - iterative review gate before LinkedIn upload
  
  This now falls inside W3 in the post-approval pipeline:
  render video → generate slides → review visually → fix issues → upload.
  
  That was the real upgrade.
  Not just more outputs.
  Better specialization.
  
  Full draft:
  
  https://relearn.ing/journal/entry-060/
threads: |
  I kept feeling friction with LinkedIn video posts in the relearn.ing pipeline.
  
  The issue was not the video itself.
  It was the reading mode.
  
  On YouTube, video is native.
  On LinkedIn, slides are often a better fit because readers can move at their own pace.
  
  So we pivoted:
  
  - YouTube keeps the video
  - LinkedIn gets dedicated slides
  - audio + long-form still stay in the system
  
  The other big lesson:
  
  use the right model for the right layer.
  
  GPT-5.4 handled the reasoning-heavy architecture work.
  Qwen 3.6 Plus handled multimodal slide review.
  
  That let us add an iterative visual quality gate before LinkedIn upload.
  
  render video → generate slides → review visually → fix → upload
  
  That is where the new branch now lives in the pipeline.
  
  relearn.ing/journal/entry-060/
youtube_title: "The LinkedIn Slides Pivot: Why Relearning Flow Split Reading From Watching"
youtube_description: |
  Relearning Flow used to push the video layer toward both LinkedIn and YouTube. The better architecture turned out to be platform-specific: YouTube keeps the motion layer, LinkedIn gets a purpose-built slide deck, and multimodal review with Qwen 3.6 Plus now sits inside W3 as a visual quality gate while GPT-5.4 stays focused on reasoning-heavy orchestration and workflow design.
  
  Full draft:
  
  https://relearn.ing/journal/entry-060/
youtube_privacy_status: "public"
---

I had already solved what I thought was the hard part.

The relearn.ing pipeline could draft an entry, turn it into audio, render a video, and push the result toward publication with a growing amount of helper discipline. The system was no longer fragile in the old sense. It had contracts, checklists, worker boundaries, and a cleaner split between orchestration and execution. From the inside, it felt increasingly real.

But then I looked at the LinkedIn output the way a reader would.

That changed the problem.

The issue was not that the videos were bad. The issue was that **LinkedIn is not YouTube**, and I had been treating those surfaces as if the same media object should work equally well on both.

It does not.

On YouTube, video is the native container. A viewer expects to press play, settle in, and follow the pacing that the creator set. That is part of the bargain. The platform is optimized for playback, sequencing, playlists, and archival return. A video there has room to breathe.

On LinkedIn, the bargain is different.

The viewer is usually scanning, pausing, skipping, reading in fragments, and deciding within seconds whether a post deserves more attention. Even when the topic is serious, the mode is still more interrupted than immersive. That means a full video is often fighting the platform instead of flowing with it.

That was the moment the pivot became obvious.

If I wanted the relearn.ing journal to stay coherent across platforms, I should stop forcing LinkedIn to behave like a secondary video host and instead let each platform specialize in what it is actually good at.

So the new direction became:

- **YouTube keeps the video layer**
- **LinkedIn gets a dedicated slide deck**
- **the journal remains the canonical long-form source**
- **audio still belongs on relearn.ing**

That sounds simple when written as a bullet list.

Architecturally, it required a deeper relearning.

### The Real Problem Was Not Distribution Volume. It Was Reading Mode.

One of the easiest mistakes in content automation is to think in terms of output count instead of consumption behavior.

If a system can produce a video, it is tempting to ask where else that video can be posted. That framing sounds efficient. It sounds like reuse. It sounds like the kind of multiplier a pipeline should want.

But what I kept noticing was that the same asset was asking too much from the LinkedIn reader.

Video requires surrendering to a timeline.

Slides do not.

Slides let the reader:

- pause on the point that matters
- skim faster when the point is familiar
- dwell longer when the argument becomes interesting
- revisit one frame without dragging a scrubber around
- absorb the story at their own pace instead of mine

That matters more than it sounds.

The relearn.ing entries are not designed as generic motivational blurts. They are argument-shaped. They often contain a chain of reframes, tradeoffs, or architectural lessons that benefit from a reader controlling the pace. A slide deck preserves that rhythm much better on LinkedIn than a video does.

So this pivot was not about abandoning video.

It was about respecting reading mode.

### Why We Kept YouTube Video in the Pipeline

The answer was never "replace video everywhere."

The answer was "put the right medium on the right surface."

YouTube still matters because it gives the video layer something LinkedIn cannot: a natural archive. It supports channel memory. It supports playlists. It supports bingeable navigation. It supports the idea that these journal videos are part of a body of work rather than isolated social fragments.

That is why the pipeline now treats YouTube and LinkedIn differently on purpose.

The video is still rendered.

The audio is still generated.

The narration and editorial structure still matter.

But the final social packaging diverges:

- the **YouTube branch** keeps the motion-driven version
- the **LinkedIn branch** produces a purpose-built PDF slide deck

In other words, the pipeline stopped asking, "How do I post the same thing everywhere?" and started asking, **"How should the same idea change shape when the platform changes?"**

That is a much better question.

### Where This Falls in the Relearning Pipeline

This change does not happen at the draft stage.

It happens later, in the post-approval production lane.

By the time the system reaches this step, the article has already been drafted and approved. W1 has already orchestrated the run. W2 has already handled narration and timing concerns. The pivot lands in W3, where media packaging decisions become concrete.

That is where the new branch now lives:

1. render the YouTube video asset
2. generate a separate LinkedIn slide deck
3. review the slide deck visually
4. fix any clipping, safe-area, or pacing defects
5. upload the finalized PDF to LinkedIn as a document post

That ordering matters.

The slide deck is not an afterthought exported from the video. It is now a first-class deliverable inside the pipeline.

That is the real architectural move.

### Why This Became a Story About Multimodality

The pivot created a second realization.

Once the system started generating dedicated slides, the next problem was no longer just text or workflow correctness. It was visual quality.

And visual quality is exactly the kind of place where reasoning alone is not the whole answer.

This is where the newer `Qwen 3.6 Plus` model became strategically useful.

The top-level build lane is powered by a high-reasoning agent such as **GPT-5.4**. That remains valuable because the pipeline still needs architectural judgment:

- when to branch the media layer
- how to update workflow contracts
- how to keep the social fan-out backward-compatible
- how to encode new rules in helpers, skills, and checklists
- how to decide what belongs in W1, W2, and W3

That is reasoning-heavy work.

But once the system has a PDF deck in hand, there is a different question:

**Does this actually look right?**

That question is visual.

So instead of spending premium high-reasoning tokens on a job that benefits from direct visual inspection, the pipeline now has a cleaner pattern:

- let **GPT-5.4** own system design, implementation, contracts, and corrections
- delegate the slide review pass to **Qwen 3.6 Plus** because its multimodal path is better suited to inspecting the actual visual artifact

That is not only about cost.

It is about fit.

The right agent should inspect the right layer of reality.

In this case, that meant sending the generated slides into a model lane that could look at the rendered pages, not merely reason abstractly about what the generator probably produced.

### The Important Lesson: Review Had To Become Iterative

The first visual pass was useful.

It also was not enough.

That mattered.

The first review surfaced design-level issues: repetitive quote cards, a weak CTA, too little variety, and a cover slide that still felt like template output instead of editorial design. Those were real findings, and they led to better layouts.

But the second pass was where the more dangerous defects appeared.

That pass found the kinds of things that are easy to miss if the system congratulates itself too early:

- text sitting too close to panel borders
- footer content drifting into unsafe areas
- watermark placement that looked partially clipped
- padding asymmetries that would feel small in code but obvious in production

Those are not taste disagreements.

They are quality defects.

And that is why the review gate is now iterative.

The new rule is not "generate slides and do one nice review if time allows."

The new rule is closer to this:

1. generate the deck
2. run the multimodal visual review gate
3. fix blocker-level issues
4. re-render
5. review again if needed
6. only upload when the deck clears the gate

That is Kaizen applied to media output.

The point is not to admire the pipeline for being automated. The point is to keep tightening the loop until the output is actually worthy of the brand it carries.

### The Bigger Architectural Relearning

The content pivot and the model delegation pattern are really the same lesson viewed from two angles.

In both cases, the system improved when I stopped forcing one shape to do every job.

The same video should not dominate both YouTube and LinkedIn.

The same model should not dominate both system reasoning and artifact-level visual inspection.

The more mature pattern is specialization:

- long-form journal for the full argument
- audio for listening
- YouTube for motion and archive
- LinkedIn slides for paced reading
- GPT-5.4 for architectural reasoning
- Qwen 3.6 Plus for multimodal slide review

That is not fragmentation.

It is alignment.

The system became better the moment each layer was allowed to become more honest about what it was for.

### What Changed in Practice

The concrete implementation work behind this was broader than just changing a post type.

The pipeline now needed:

- new frontmatter fields for LinkedIn document metadata
- new helper scripts for LinkedIn document upload
- a purpose-built slide generator instead of video reuse
- a dedicated visual review helper and skill
- W3 checklist changes so review happens before upload
- workflow rules that treat clipping and safe-area problems as blockers, not optional polish

That is the part I find most interesting.

The feature did not become real when I had the idea.

It became real when the idea hardened into contracts.

That is what makes a pipeline trustworthy. Not that it can occasionally do something clever, but that once it learns a lesson, the lesson gets stored in the workflow so the system does not have to relearn it from scratch on the next run.

### Why This Matters for Relearn.ing

Relearn.ing has always been about more than output volume.

The deeper promise is that learning should change the system that learns.

That applies to people.

It also applies to pipelines.

If the pipeline discovers that LinkedIn is a better reading surface for slides than for video, then the workflow should change.

If the pipeline discovers that visual defects require multimodal review rather than abstract reasoning alone, then the workflow should change.

If the pipeline discovers that one review pass is insufficient for artifact quality, then the workflow should change.

That is what happened here.

The system did not just produce more media.

It learned how to distribute attention better.

And in this case, that may matter more than raw automation ever did.

Because the final goal is not to post everywhere.

The final goal is to help the reader meet the idea in the form that gives it the best chance to land.
