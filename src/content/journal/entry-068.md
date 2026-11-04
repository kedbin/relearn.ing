---
title: "FDE Day 4: Guard the Path Your Data Actually Takes"
date: "2026-11-04"
summary: "A fast empty schedule and an unscanned document connector have the same architectural flaw: the rule missed the real path. Day Four connects evaluator correctness to explicit access and content controls in enterprise retrieval."
status: "Published"
draft: false
category: "AI Engineering / Agent Platforms"
highlights:
  - "Check hard validity constraints before rewarding speed. An empty schedule must not win because it is cheap to compute."
  - "Source ACLs, sensitive-data controls, and prompt/response screening serve different purposes and belong on explicit data paths."
  - "Measure time to useful answer text, not just the first spinner or status token. A latency target is not permission to bypass controls."
youtube_url: "https://www.youtube.com/watch?v=w-Zv1EhJfe4"
youtube_video_id: "w-Zv1EhJfe4"
publish_social: false
linkedin: ""
threads: ""
youtube_title: "FDE Workshop Day 4: From Search to Secure Integration"
youtube_description: |
  FDE Workshop Day 4: From search to secure integration
  
  Why both evolutionary code search and enterprise RAG depend on enforcing the real boundary
  
  Full notes and code: https://relearn.ing/journal/entry-068/
  
  Chapters
  00:00 The empty schedule and the unscanned lane
  00:54 Hard validity gates before speed in AlphaEvolve
  01:36 Guard the actual connector data path
  02:33 Perceived answer latency and the FDE checklist
  
  This is my educational synthesis of the workshop, not official Google guidance. Scenarios, prices, latency targets, and code are illustrative, not customer incidents, production implementations, or measured benchmarks. Product behavior is scoped to the workshop configuration; verify current documentation before deployment.
  
  Narration generated with Breeze TTS 2 (BreezeBlue) using my own recorded voice. Used under the BreezeBlue Research and Non-Commercial License v1.1. This is a non-monetized educational demonstration.
  Breeze TTS 2 is licensed under the BreezeBlue Research and Non-Commercial License Agreement. Copyright (c) 2026 RESONIA, INC. All Rights Reserved.
youtube_tags:
  - "AI engineering"
  - "AI agents"
  - "Google Cloud"
  - "FDE workshop"
youtube_privacy_status: "unlisted"
---

A shift scheduler finishes in 0.2 milliseconds. Excellent—until we notice it scheduled nobody.

An enterprise assistant has a safety filter. Excellent—until sensitive documents arrive through a connector lane the filter never inspects.

The retailer and the timing are illustrative examples from my Day Four walkthrough, not a production incident or measured AlphaEvolve result. I put the two stories together because they expose the same mistake: **we wrote a rule, then failed to put it where success actually happens**.

## Check that the answer exists before rewarding its speed

Evolutionary code search explores candidate programs using an evaluator. The evaluator defines what survives. If I reward latency without checking correctness, a candidate that does no useful work can look brilliant.

[AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) makes evaluator design central to that search loop. For my scheduling example, I would keep the evaluator outside the editable candidate and reject invalid schedules before scoring speed.

```python
# Evaluator pseudocode; not an AlphaEvolve SDK.
def fitness(candidate, problem):
    schedule, latency_ms = run_in_bounded_sandbox(candidate, problem)
    if not covers_required_shifts(schedule, problem.required_shifts):
        return float("-inf")
    if violates_labor_rules(schedule, problem):
        return float("-inf")
    return -latency_ms
```

The minus sign converts a minimization objective into a score where larger is better. It is not the interesting part.

The interesting part is defining “valid” against the original problem. Checking `all(shift.is_valid for shift in schedule)` would still accept an empty list: `all([])` is true. Compare against the **required shifts**, not just whatever output the candidate chose to return.

Timeouts, malformed outputs, missing assignments, and evaluator exceptions need explicit failure handling too. Keep candidate code unable to modify the evaluator, and validate improvements on cases not used to guide the search.

The product is not “a model that writes clever code.” It is a search process whose score still means what I intended.

## Now draw the connector lane

Enterprise retrieval has a different surface but the same placement problem.

Draw the path: user request, connector authorization, source retrieval, content processing, model context, generated answer. Then attach each control to the step it actually governs.

Three checks are easy to blur together:

- **Source ACLs:** is this user allowed to retrieve this document?
- **Sensitive-data policy:** may this content enter this application's context, and should it be blocked or redacted?
- **Prompt/response screening:** does the inspected text trigger the configured safety policy?

Passing one does not imply passing the others.

In the configuration described by my workshop notes, Model Armor prompt/response screening did **not** automatically scan inbound federated connector data. The notes describe a separate Sensitive Data Protection content policy for supported federated connectors.

That is a scoped workshop observation, not a timeless claim about every connector or current product release. Before deployment, verify the supported paths, limits, and enforcement behavior for the actual configuration in current product documentation.

## Put checks before context assembly

The custom-integration pattern I want to remember is:

```text
verified user identity
  → source-enforced document permissions
  → connector-path content policy
  → permitted, filtered chunks
  → model context
  → output policy
```

This is an architectural diagram, not a claim that arbitrary OAuth tokens or a fictional `scan()` call implement a managed connector's policy. Use the connector's supported identity flow and policy attachments.

If authorization cannot be established, do not silently fall back to a broadly privileged service account. If a required content-policy check fails, handle that failure explicitly rather than sending unchecked content onward.

And redaction is not authorization. Nor does removing personal information prove a retrieved document is free of malicious instructions. Those are separate risks.

## Fast enough for the human, without skipping the guard

The first spinner is not the first useful answer. I want to measure time to answer text as well as total completion time, with access and required content checks still on the critical path.

The walkthrough's 1.5-second budget is illustrative, not a measured result or a Google SLA. Whether checks run per document or per streamed chunk depends on the supported policy interface; do not invent streaming guarantees.

If the target is missed, investigate retrieval, policy, and generation latency. Do not “optimize” by removing the boundary that made the answer safe to show.

## The question connecting all three days

[Day Two](/journal/entry-066/) asks who can authorize the action. [Day Three](/journal/entry-067/) asks who can define success. Day Four asks whether the rule covers the path that is actually running.

My release question is the same in each case:

**What can this agent make look successful without actually succeeding?**

Then put the check outside its control, at the point where the shortcut would otherwise work.

## Watch the walkthrough

Watch the **[3:21 walkthrough on YouTube](https://www.youtube.com/watch?v=w-Zv1EhJfe4)**. The video is unlisted but available through this link.

<div class="not-prose aspect-video w-full my-8">
  <iframe class="h-full w-full rounded-xl border border-border" src="https://www.youtube-nocookie.com/embed/w-Zv1EhJfe4" title="FDE Workshop Day 4 walkthrough" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

*Source scope: my workshop notes on evolutionary search, enterprise retrieval, connector security coverage, and answer latency. These examples are my teaching synthesis, not official Google guidance.*

*Voiceover: generated with Breeze TTS 2 (BreezeBlue) using my own recorded voice, under the BreezeBlue Research and Non-Commercial License v1.1. This site is non-monetized.*
