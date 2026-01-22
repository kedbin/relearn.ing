---
title: "The Zombie Process: Reclaiming RAM from Unactionable Loops"
date: "2026-01-21"
summary: "Burnout is not a failure of effort, but a failure of garbage collection. By applying Google's SRE principles and GTD logic to human cognition, we can eliminate the 'zombie processes' that consume mental RAM without producing value."
status: "Published"
category: "Relearn Engineering / DevOps"
highlights:
  - "DORA metrics reveal high performers spend 22% less time on unplanned work and rework [1]."
  - "The Zeigarnik Effect acts as a memory leak, where incomplete tasks consume cognitive resources indefinitely [3]."
  - "Protocol: Implement a strict 'Actionability Predicate' to filter inputs before they enter the system."
audioUrl: "https://audio.relearn.ing/entry-031.mp3"
linkedin_image_urn: "urn:li:image:D4E10AQEyWQ4Zv6qLrA"
publish_social: true
linkedin: |
  Studying for Google's DevOps Engineer cert and kept seeing this principle: reduce burnout by removing unactionable items.

  Sounded familiar. Then I realized - it's the same logic as GTD, SRE alerting, and basically every productivity system that actually works.

  The research backs it up:

  → DORA found high performers spend 22% less time on unplanned work
  → Google SREs cap "toil" at 50% - anything more breaks the system
  → The Zeigarnik Effect shows unfinished tasks consume mental RAM even when you're not working on them

  The fix is a simple filter: Is it actionable? If no - trash it, file it, or freeze it. If yes - define the next physical action.

  A system that alerts on everything monitors nothing.

  Full write-up (with audio 🎧) on relearn.ing:

  https://relearn.ing/journal/entry-031/
threads: |
  studying for google's devops cert and the same principle keeps showing up: remove unactionable items to reduce burnout

  turns out it's the same logic behind GTD, SRE alerting, and every productivity system that works

  the brain treats unfinished tasks like zombie processes - consuming RAM without producing output

  a system that alerts on everything monitors nothing

  full write-up 🎧 → relearn.ing/journal/entry-031/
---

You are the on-call engineer for your own life, and the pager is screaming. It's 3:00 AM in your cortex, and an alert just fired: *"Remember to worry about that vague comment from the client."* You check the runbook. There is no fix. There is no command to run. You cannot resolve the ticket, but you cannot close it either. So you stare at the glowing red light, burning cortisol like jet fuel, accomplishing nothing. In distributed systems, we call this a non-actionable alert—a configuration error that leads to alert fatigue and missed SLOs. In the human operating system, we call it anxiety. Both result in the same outcome: system failure.

## The Fallacy

**The Hoarder's Log**

Legacy thinking suggests that maximum data equals maximum control. We operate under the assumption that we must track, monitor, and "keep in mind" every potential variable to be safe. We treat our brains like a Hadoop cluster—a massive storage lake where we dump every worry, idea, and "maybe someday" task, believing that retention is free.

This creates a signal-to-noise ratio approaching zero. When everything is flagged as "important," nothing is. We create a backlog of open loops that have no defined next action, yet we refuse to delete them. We believe that by worrying about the unactionable, we are somehow working on it. This is false. You are not processing data; you are merely thrashing.

## The Model

**The Actionability Predicate**

To fix this, we must merge two frameworks: **Google's Site Reliability Engineering (SRE)** and David Allen's **Getting Things Done (GTD)**.

In the *Site Reliability Engineering* handbook, Google defines the "Golden Signals" of monitoring. A crucial rule for paging (interrupting a human) is that the alert must be **actionable**. If a page fires and the engineer can do nothing to fix it, that page is classified as toil or noise. It is a bug in the monitoring system, not the infrastructure [2].

David Allen's GTD methodology is effectively SRE for the human brain [5]. Its core algorithm is a binary decision tree applied to every input: **Is it actionable?**

1.  **If `False`**: It must immediately move to **Trash** (delete), **Reference** (store for lookups, not action), or **Someday/Maybe** (cold storage). It leaves the active RAM.
2.  **If `True`**: It must have a defined "Next Action" (a specific command to run).

When we violate this logic—when we keep non-actionable items in our active view—we trigger the **Zeigarnik Effect**. Discovered by psychologist Bluma Zeigarnik, this phenomenon dictates that uncompleted tasks stay active in memory, consuming cognitive resources [3]. These are "zombie processes"—child processes that have completed execution but still have an entry in the process table. They do no work, but they consume a PID and prevent the system from idling.

## The Data

The cost of these zombie processes is quantifiable.

1.  **Throughput Drag:** According to the **2016 State of DevOps Report** by DORA (DevOps Research and Assessment), high-performing teams spend **22% less time** on unplanned work and rework than low performers [1]. They aggressively filter out noise to focus on new work (49% of their time vs. 38% for low performers).
2.  **Cognitive Load:** A 2023 study on Developer Experience (DevEx) highlights that **extraneous cognitive load** (noise) directly steals capacity from **germane cognitive load** (problem-solving) [4]. Every unactionable item you track is a context switch that degrades your IQ.
3.  **Toil Limits:** Google SREs enforce a **50% cap on toil** (manual, repetitive, tactical work) [2]. If toil exceeds this, they stop accepting new feature work to fix the system. Most humans operate at 90% toil, drowning in unactionable maintenance tasks.

## The Protocol

To stop the thrashing, you must configure your internal firewall to drop packets that don't match the Actionability Predicate.

### Phase 1: The Signal Audit
Run a `grep` on your current mental inputs (email, slack, worry list). For each item, ask: *If I had to solve this in the next 5 minutes, what is the exact physical action I would take?*
-   If the answer is "wait for X," "think about Y," or "worry," the item is **Unactionable**.
-   **Metric:** If >50% of your inputs are unactionable, your channel is broken. Mute it.

### Phase 2: The Reference Refactoring
Engineers don't memorize documentation; they index it. Move "Reference" items out of your "Inbox."
-   **Inbox:** Things that require a `write` operation (decisions/actions).
-   **Reference:** Things that are `read-only` (logs, receipts, articles).
-   **Implementation:** Never mix the two. An inbox containing read-only items is a broken queue.

### Phase 3: The Garbage Collection (GC)
Schedule a weekly "Garbage Collection" cycle (Weekly Review).
-   Review the "Pending" list.
-   Check for "stale handles"—tasks that were once important but are no longer relevant.
-   **Hard Delete:** If an item has been on the list for 3 cycles with no movement, it is not a priority. It is a memory leak. `kill -9` it.

### Phase 4: The Error Budget
Accept that you will drop some balls. This is your **Error Budget**.
-   Define what you are willing to ignore (e.g., "I will not respond to non-urgent Slack messages after 6 PM").
-   As long as you are within budget (no critical failures), ignore the alerts. This prevents alert fatigue from setting in.

A system that alerts on everything monitors nothing.

## References

[1] Forsgren, N., Humble, J., & Kim, G. (2016). *2016 State of DevOps Report*. DevOps Research and Assessment (DORA).

[2] Beyer, B., Jones, C., Petoff, J., & Murphy, N. R. (2016). *Site Reliability Engineering: How Google Runs Production Systems*. O'Reilly Media.

[3] Zeigarnik, B. (1927). "Das Behalten erledigter und unerledigter Handlungen". *Psychologische Forschung*, 9, 1-85.

[4] Greiler, M., et al. (2023). "DevEx: What Actually Drives Productivity". *ACM Queue*, 21(2).

[5] Allen, D. (2001). *Getting Things Done: The Art of Stress-Free Productivity*. Viking.
