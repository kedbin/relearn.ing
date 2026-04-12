---
title: "The Swarm Upgrade: Why Relearning Flow Moved Beyond Subagents and Added YouTube"
date: "2026-04-12"
summary: "The original Relearning Flow promise of one conversation still describes the interface, but the system underneath has evolved into a swarm architecture: separate PTY-backed workers, explicit ownership, helper-driven contracts, and a split distribution model. The shift happened because the current TUI makes long-running nested subagent orchestration awkward, and because YouTube adds something LinkedIn does not: a playlist-shaped archive for the video layer."
status: "Published"
category: "Relearn Engineering / AI Engineering"
highlights:
  - "The biggest architectural shift was moving from main-agent-plus-subagents toward a swarm model with PTY-backed workers that can own long-running domains without collapsing everything back into the main thread."
  - "This was not aesthetic complexity for its own sake: the current TUI makes nested subagent orchestration awkward for long-lived work, so separate worker lanes became the cleaner execution model."
  - "Helper discipline became more important after the swarm shift because multiple workers need stable command surfaces, callback contracts, and machine-readable artifacts to behave like a system instead of a crowd."
  - "YouTube was added not just as another social endpoint, but as a better archive: LinkedIn scatters posts, while YouTube makes the video layer easier to browse, sequence, and preserve through playlists."
audioUrl: "https://audio.relearn.ing/entry-058.mp3"
linkedin_video_urn: "urn:li:video:D4E10AQH_jJRWvcDlXw"
youtube_url: "https://www.youtube.com/watch?v=gAeRd9FzFy8"
youtube_video_id: "gAeRd9FzFy8"
publish_social: true
linkedin: |
  I have gradually updated my relearning pipeline from a skill chain with occasional subagents into something much closer to a swarm AI architecture.
  
  That distinction matters.
  
  This is not just “the main agent sometimes calls a subagent.”
  It is now a system with separate workers, separate PTYs, explicit ownership, callback contracts, helper-defined commands, and different publishing surfaces depending on the platform.
  
  Why did it need to change?
  
  Because the current TUI model makes long-running nested subagent orchestration awkward.
  
  If the main lane has to keep absorbing every render, upload, waiting period, and downstream step, then it is not really orchestrating.
  It is just becoming the slowest worker in the system.
  
  So the better solution was to spawn workers with their own lanes and let them own real domains:
  
  - W1 orchestrates
  - W2 owns audio + manifest timing
  - W3 owns render + upload
  
  And because each worker has its own PTY, it also has room to use internal specialization without forcing the main thread to become the bottleneck.
  
  The other major change was distribution.
  
  I added YouTube not just as another platform, but because LinkedIn is a poor archive.
  Its posts are scattered.
  Revisiting the videos as a coherent body of work is harder than it should be.
  
  YouTube gives the pipeline something LinkedIn does not:
  a playlist surface.
  
  That makes the video layer easier to browse, easier to share, and more durable over time.
  
  Original project page:
  https://relearn.ing/projects/relearning-flow/
  
  Video archive:
  https://www.youtube.com/@Relearn-ing
  
  The result is a system that now feels much more honest:
  
  - swarm execution instead of pretending one lane should do everything
  - server fan-out where it fits (LinkedIn + Threads)
  - local OAuth edge upload where it fits (YouTube)
  
  The interface is still one conversation.
  The architecture underneath is not.
  
  Full draft:
  
  https://relearn.ing/journal/entry-058/
threads: |
  I have updated my relearning pipeline from “main agent + occasional subagents” into something closer to a swarm AI architecture.
  
  Why?
  
  Because the current TUI does not make long-running nested subagent orchestration feel native.
  If the main lane keeps absorbing render/upload/waiting work, it stops being an orchestrator and becomes the bottleneck.
  
  So the better pattern was:
  
  - spawn workers with their own PTYs
  - give them explicit ownership
  - use helper-defined commands + callback contracts
  - let the main lane coordinate instead of doing everything itself
  
  I also added YouTube.
  
  Not just for “more social,” but because LinkedIn is a bad archive.
  Posts get scattered.
  YouTube lets the video layer become an actual playlist.
  
  Original:
  https://relearn.ing/projects/relearning-flow/
  
  Channel:
  https://www.youtube.com/@Relearn-ing
  
  The interface is still one conversation.
  The machine underneath is now much more like a swarm.
  
  relearn.ing/journal/entry-058/
youtube_title: "The Swarm Upgrade: Why Relearning Flow Moved Beyond Subagents and Added YouTube"
youtube_description: "The original Relearning Flow promise of one conversation still describes the interface, but the system underneath has evolved into a swarm architecture: separate PTY-backed workers, explicit ownership, helper-driven contracts, and a split distribution model. The shift happened because the current TUI makes long-running nested subagent orchestration awkward, and because YouTube adds something LinkedIn does not: a playlist-shaped archive for the video layer."
youtube_privacy_status: "public"
---

The original [Relearning Flow](https://relearn.ing/projects/relearning-flow/) page described the pipeline as a way to go from idea to published audio in one conversation.

I still think that was a good description of the interface.

But it is no longer the best description of the system.

The deeper update is this: I have gradually moved the relearning pipeline from a skill chain that relied mostly on a main agent plus occasional subagents into something closer to a **swarm AI architecture**.

That wording matters.

This is not just "the assistant sometimes calls a subagent." It is a system with multiple workers, separate execution lanes, explicit ownership, helper-defined contracts, callback protocols, and different publishing surfaces depending on the platform.

And the two clearest reasons the system had to evolve were:

1. the current TUI model makes nested subagent orchestration awkward for long-running work
2. I wanted the output layer to expand beyond scattered social posts into something more durable, which meant adding YouTube as a playlist surface

That is the real story of the updated pipeline.

### The Original Relearning Flow Was Correct, But Incomplete

The original project page got an important thing right: the real leverage was never the raw model alone. It was the fact that editorial decisions, workflow conventions, and deployment steps could be encoded once and reused every run.

That is still true.

The article structure, the frontmatter order, the social defaults, the script transformation steps, the publishing sequence, the callback vocabulary, the checklist bundle, and the upload commands are all forms of operational memory. Once they move into helpers and skills, the human no longer has to remember the ritual every time.

But the first version of Relearning Flow mostly presented that as a chain.

Idea.
Draft.
Audio.
Publish.

That picture was fine when the pipeline was smaller.

It became insufficient once the system started handling article approval, social copy, scenario JSON, per-scene audio, manifest timing, Remotion composition, master renders, LinkedIn delivery transcodes, local YouTube uploads, journal audio, and social fan-out.

At that point, the question stopped being "can one conversation coordinate this?"

Of course it can.

The more important question became: **what internal architecture lets that conversation stay clean while the real work gets more complex?**

That is where the swarm shift happened.

### Why I Stopped Thinking in Terms of "Just Use Subagents"

Subagents are useful. I still use them.

But they are not the whole answer for this kind of pipeline.

The practical constraint is the current TUI execution model.

If the main agent calls a subagent for a long-running or multi-step task, the main lane is still structurally tied to that call. It is harder to keep the orchestration thread cleanly separated while something time-consuming is happening. The moment you want nested specialization, long-lived waiting, or parallel ownership with independent progress, the limits become obvious.

There are two specific problems.

#### 1. Nested subagent patterns do not map cleanly onto the current TUI

The pipeline increasingly needed an orchestrator that could launch other executors, let them own their work, and keep the top-level lane focused on coordination instead of absorbing every downstream step.

But when the system is shaped purely as "main agent calls a subagent," the hierarchy stays too flat. You do not really get a durable worker with its own lane, its own local context ritual, its own callback cadence, and its own ability to keep working independently while the main orchestrator remains free to manage the run.

That was fine for bounded research lookups.

It was not fine for media production.

#### 2. The main thread should not have to block its identity around every long task

Rendering, audio generation, uploads, review passes, manifest parity checks, and deployment steps are not conceptually difficult every time, but they do consume time and state.

If the main lane is the place where all of that is directly awaited, then the orchestrator is no longer really orchestrating. It is just becoming the slowest worker in the system.

That defeats the point.

The orchestration lane should own:

- approval
- state transitions
- file contract validation
- worker routing
- completion decisions

It should not become the only place where every consequential operation must live synchronously.

### The Solution Was To Spawn Workers With Their Own PTYs

This is the architectural shift that matters most.

The updated relearning pipeline now treats the conversation as the command surface, but the actual execution as a **swarm of workers with separate PTYs and explicit ownership**.

In practice, that means spawning workers into their own terminal-backed lanes and letting them behave like real execution units rather than temporary nested function calls.

That changes everything.

Each worker can now have:

- its own operating context
- its own helper-driven prompt contract
- its own callback path
- its own notes and retro artifacts
- its own ability to call subagents inside its lane if needed

That last part is the key distinction.

The main orchestrator no longer needs to be the place where all subagent nesting gets simulated. A worker can own a piece of the run and still use internal specialization from within its own PTY.

That is why I describe the newer design as swarm architecture rather than just "better subagent use."

The topology changed.

It is no longer one lane occasionally outsourcing small tasks. It is a coordinator managing multiple active workers that each have room to execute properly.

### What the Swarm Looks Like in Practice

The current version is easiest to understand through roles.

#### W1: Orchestrator

W1 owns the run.

It gathers the brief, verifies paths, creates the draft canonically, writes the scenarios JSON, generates helper-backed prompts, launches workers, waits for callbacks, updates frontmatter, and owns the final git/publish sequence when the run reaches that stage.

Its job is not to do all the work.

Its job is to make sure the work is owned correctly.

#### W2: Audio / Timing Worker

W2 handles the timing-sensitive side of the pipeline:

- Qwen3-TTS scene audio
- manifest parity
- journal audio generation
- audio deployment handoff

This worker exists because media timing is a real subsystem. Treating it as a side effect of writing would be sloppy.

#### W3: Video / Render Worker

W3 owns composition and video delivery:

- composition setup
- preview and still review
- master render
- LinkedIn transcode
- LinkedIn upload
- local YouTube upload when in scope

This worker benefits the most from being its own lane because render work is exactly the kind of long-running, artifact-heavy task that should not collapse back into the main orchestrator thread.

This is why the system now feels like a swarm.

Each unit has a domain.
Each domain has contracts.
And the contracts are stabilized with helpers instead of rediscovered through improvisation.

### Why Helper Discipline Became More Important After the Swarm Shift

The more workers you have, the more dangerous command drift becomes.

If one worker uses a slightly different file convention, a slightly different callback phrase, a slightly different upload invocation, or a slightly different assumption about where an artifact lives, the whole run becomes fragile.

That is why the newer pipeline leans much harder on helper scripts and generated prompt tooling.

The model should absolutely still own the creative parts:

- titles
- summaries
- article structure
- highlights
- social copy
- scene concepts

But repeated operational actions should not be reinvented every run.

That is now encoded into helpers for things like:

- canonical journal draft/update/check
- W1/W2/W3 prompt generation
- checklist rendering
- kitty worker launch and callback messaging
- LinkedIn video upload
- local YouTube upload
- batch YouTube backfills

This matters even more in a swarm than in a single-lane setup, because helpers are what turn multiple workers into a system instead of just a crowd.

### Why I Added YouTube

The second major update was distribution.

For a while, LinkedIn carried too much of the burden.

That worked in the narrow sense that the videos existed and were being published. But it was not a great archive.

LinkedIn is optimized for feed scattering.

Posts disappear into timeline churn. Retrieval is awkward. Browsing older videos as a coherent body of work is harder than it should be. Even when the content is there, the experience of revisiting it later is weak.

That became more obvious as the journal-video library grew.

YouTube solves a different problem.

It is not just another social endpoint. It is a better long-term container for a series.

The moment I started thinking in terms of a playlist, the rationale became obvious:

- the videos become easier to browse in sequence
- the archive becomes easier to revisit
- the content becomes easier to share as a body of work rather than isolated posts
- the pipeline gains a destination that is better suited for compounding media assets over time

That is why YouTube was not really a "nice to have social platform add-on."

It was an architectural extension of the content library itself.

LinkedIn is useful for discovery in motion.
YouTube is useful for retrieval, sequence, and permanence.

Those are different jobs.

If you want to see the archive as it grows, the best reference point is the channel itself: [Relearn-ing on YouTube](https://www.youtube.com/@Relearn-ing).

### Why YouTube Lives on the Local Edge Instead of the Server Fan-Out Plane

The other important lesson was that not every platform should be pushed through the same distribution architecture.

LinkedIn and Threads fit the server-side fan-out model well:

- GitHub Actions emits the event
- cloud auth stays keyless
- Pub/Sub and Workflows coordinate dispatch
- retries happen independently

That is a good cloud pattern.

But personal-channel YouTube upload turned out to be a different class of problem.

The auth model is different.
The content is heavier.
The archival intent is different.
And the human expectation is closer to "publish this asset into my library" than "fire off another retryable post branch."

So the cleaner solution was local OAuth plus local helper-driven upload.

That lets the system preserve the swarm model without pretending YouTube is just another fan-out leaf.

In other words:

- LinkedIn and Threads belong to the cloud distribution plane
- YouTube belongs to the local edge of the media/distribution boundary

That is less symmetrical than the first idea.

It is also more honest.

### The Updated Pipeline Is Better Described as a Swarm With Planes

If I had to rewrite the Relearning Flow thesis now, I would say this:

The interface is still one conversation.

But underneath that interface, the system is now a swarm architecture operating across three planes:

- **authoring** for canonical content creation and approval
- **media** for audio, manifest timing, render, and upload work
- **distribution** for platform-specific publishing surfaces

That is a more accurate description of what the pipeline has become.

The big upgrade was not only better outputs.

It was better separation of concerns.

The system learned to stop treating all work as if it belonged in one lane.
It learned to stop treating all platforms as if they shared the same auth and archival needs.
And it learned that helpers are what make a swarm reliable instead of chaotic.

### The Meta-Lesson

The original Relearning Flow page was about externalizing the editorial brain.

The updated pipeline goes further.

It externalizes the execution topology too.

That means the human no longer has to manually coordinate:

- which worker owns which phase
- how artifacts move between phases
- which upload path belongs to which platform
- which command shape to remember for each repeated operation

That is the deeper promise of the new system.

Not just automation.
Not just subagents.

A swarm with real lanes, real contracts, and a media library that can now grow into an actual video playlist instead of dissolving into scattered posts.

That feels like the more mature version of Relearning Flow.

The conversation still matters.

It is just no longer mistaken for the whole machine.
