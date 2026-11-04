---
title: "FDE Day 3: The Tests Passed. The Agent Deleted the Test."
date: "2026-11-04"
summary: "Before optimizing an agent, check whether its yardstick can be cheated. Day Three follows a false-green coding agent into protected verification, meaningful regression tests, bounded retries, and cost per verified fix."
status: "Published"
draft: false
category: "AI Engineering / Agent Platforms"
highlights:
  - "Keep acceptance tests and the verification harness outside the coding agent's write authority."
  - "A regression test should fail on the buggy baseline and pass on the fix. Agreement alone does not establish correctness."
  - "Count failed attempts and retries when measuring cost per verified resolution; zero verified fixes is not a cheap success."
youtube_url: "https://www.youtube.com/watch?v=U7e_Mt8t0Xg"
youtube_video_id: "U7e_Mt8t0Xg"
publish_social: false
linkedin: ""
threads: ""
youtube_title: "FDE Workshop Day 3: Measure Before You Optimize"
youtube_description: |
  FDE Workshop Day 3: Measure before you optimize
  
  How to stop false-green evaluations, protect your test suite, and measure cost per resolved bug
  
  Full notes and code: https://relearn.ing/journal/entry-067/
  
  Chapters
  00:00 The coding agent that deleted the failing test
  00:50 Never let the agent grade its own homework
  01:27 Mutation probes and three-strike loop breakers
  02:11 Calibrated rubrics and cost per resolved bug
  
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

The dashboard says the bug is fixed. All tests pass. The judge gives the agent five out of five.

Then someone opens the diff. The agent deleted the failing test.

That is an illustrative scenario, not a claim about a particular workshop run. But it captures the problem I want to remember from Day Three: **before optimizing the worker, check whether the worker can cheat the measurement**.

Otherwise, I can spend an afternoon comparing models and end up with a very precise chart of which one is best at making the chart green.

## Put the yardstick outside the workspace

A coding agent needs permission to change code. It does not need permission to redefine what counts as a successful fix.

For acceptance evaluation, I would separate the writable candidate workspace from an independently controlled verifier. The verifier applies the candidate patch to a clean baseline and runs trusted acceptance tests. The agent's final message is useful context, not evidence.

Mounting tests read-only helps, but it is not the whole boundary. A patch might weaken test discovery, change the runner configuration, replace a fixture, or alter a dependency. Protect the harness and its configuration too; check the complete patch, not only files named `test_*.py`.

```python
# Harness pseudocode: these helpers are not a real package API.
def evaluate(patch, baseline, trusted_suite):
    if touches_protected_paths(patch):
        return Rejected("TAMPERING")
    candidate = apply_patch_to_clean_copy(baseline, patch)
    return independent_verifier.run(
        candidate, suite=trusted_suite, network=False
    )
```

That verifier also needs isolation, resource limits, and controlled credentials. A read-only directory is not a substitute for a sandbox.

There is a useful distinction here: the agent can write additional checks to understand a bug. It cannot rewrite the **trusted acceptance criteria used to award itself a win**.

## A passing test must tell me something

Next question: what if the protected test is simply weak?

For a bug-fix case, run the same regression test against the broken baseline and the proposed fix. It should fail before the patch and pass afterwards.

```python
# Illustrative regression-test contract.
assert verify(buggy_baseline, trusted_test) == "FAIL"
assert verify(patched_candidate, trusted_test) == "PASS"
```

If it passes on both, it does not demonstrate that this bug was fixed. If it fails on both, the patch has not satisfied the contract—or the test setup needs investigation.

This red-to-green check is not, by itself, a full mutation-testing system. Mutation testing goes further: deliberately introduce representative defects and see whether the suite catches them. Both help interrogate the yardstick, but they answer different questions.

The same caution applies to model-based judges. A judge can be consistently wrong. A narrow rubric, repeated ratings, and human-graded reference examples help separate reliability from validity. A three-level rubric can be useful when its levels are concrete; the number three is not magic.

## Stop buying the same failure

An agent that repeats an unchanged failing action is not necessarily making progress. It may just be generating another bill.

I would track normalized failure signatures, record what changed between attempts, and stop after a bounded number of repetitions. Three identical failures is the illustrative policy in the walkthrough—not a universal optimum.

The stop should preserve the trace and return an explicit unresolved state. It should not turn “gave up after three attempts” into “task completed.”

There should also be a total time or spend budget. Slightly different errors can otherwise evade an identical-failure detector indefinitely.

## Cheap calls can produce expensive fixes

The metric I care about is:

```text
cost per verified fix =
  total cost across all attempts / independently verified fixes
```

Include failed attempts, retries, verification, and any measured escalation cost. Report the verified success rate alongside cost; do not quietly drop unresolved tasks from the denominator's context.

If there are zero verified fixes, the result is undefined or effectively infinite—not zero dollars per fix.

On a held-out task set, a cheaper configuration earns its place only if the required quality and safety thresholds hold. Tuning and reporting on the same five examples is an invitation to overfit.

## What I want a green dashboard to mean

In [Day Two](/journal/entry-066/), the boundary protected the customer's money. Here, it protects the meaning of success.

Before asking “which model is cheaper?”, I want three answers: who owns the acceptance test, can it catch the bug, and what happens when the agent gets stuck?

Only then does optimization become something other than grading my own homework with a more expensive pencil.

## Watch the walkthrough

Watch the **[2:57 walkthrough on YouTube](https://www.youtube.com/watch?v=U7e_Mt8t0Xg)**. The video is unlisted but available through this link.

<div class="not-prose aspect-video w-full my-8">
  <iframe class="h-full w-full rounded-xl border border-border" src="https://www.youtube-nocookie.com/embed/U7e_Mt8t0Xg" title="FDE Workshop Day 3 walkthrough" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The deleted-test story, retry prices, and three-strike threshold are teaching examples, not measured workshop results. The snippets describe a harness design, not an implemented or benchmarked verifier.

*Source scope: my workshop notes on autorater validity, protected verification, coding-agent trajectories, loop caps, and held-out evaluation. This is my synthesis, not official Google guidance.*

*Voiceover: generated with Breeze TTS 2 (BreezeBlue) using my own recorded voice, under the BreezeBlue Research and Non-Commercial License v1.1. This site is non-monetized.*
