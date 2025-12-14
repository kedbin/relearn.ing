---
title: "Memoization: The Architecture of Cognitive Caching"
date: "2025-12-13"
summary: "Most human exhaustion comes from re-computing solved problems. By treating your life as a system that supports memoization, you can shift from O(n) effort to O(1) retrieval."
status: "Published"
category: "Relearn Life / Cognitive Engineering"
highlights:
  - "Key Takeaway 1: The Metric (20% Energy Drain)"
  - "Key Takeaway 2: The Model (Epistemic Action)"
  - "Key Takeaway 3: The Protocol (Write-Through Caching)"
---

I recently conducted an audit of my own daily logs and discovered a critical failure in my system architecture. I was acting like a poorly optimized script running inside an infinite loop. I found myself solving the same problems, looking up the same flight numbers, and traversing the same decision trees day after day. In software engineering, we call this redundant computation. In life, we call it "stress."

The solution isn't to think faster. It is to think less by applying a fundamental computer science principle: Memoization.

Memoization is an optimization technique used to speed up programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again. By treating my daily existence as a function that supports caching, I moved my life from linear time complexity—O(n)—where effort scales with tasks, to constant time complexity—O(1)—where retrieval is instant.

## The Fallacy: The Brain as a Hard Drive

Culture tells us to "keep it in mind." We treat our biological brains as reliable storage devices, assuming that if something is important, we will remember it. This is a legacy error.

The data on biological hardware is clear. In 1956, cognitive psychologist George Miller published The Magical Number Seven, Plus or Minus Two, establishing the severe capacity limits of human working memory [1]. We are not designed for storage; we are designed for processing.

Furthermore, this processing is expensive. Raichle and Gusnard (2002) established that while the brain represents only ~2% of total body mass, it consumes roughly 20% of the body's energy [2]. Every time you "re-compute" a decision—searching your email for a tax document, re-deciding what to eat, or locating a password—you incur a metabolic tax. You are burning glucose on computations you have already performed.

Relying on "volatile memory" (your brain) for persistent data is a violation of basic system design. When you sleep, the cache is flushed. If you solve a problem once, the solution must be written to a persistent database.

## The Model: Epistemic Action

To fix this, I adopted the model of Extended Cognition. Philosophers Clark and Chalmers (1998) proposed that the mind is not bounded by the skull but extends into the environment (notebooks, smartphones, files) [3]. When you offload a computation to a tool, that tool becomes a functional part of your cognitive process.

This aligns with the concept of Memoization, coined by Donald Michie in 1968 [4]. In a memoized system, the cost of the first computation is high (you have to do the work), but the cost of every subsequent request approaches zero.

Kirsh and Maglio (1994) provided the behavioral framework for this in their study on Epistemic Action [5]. They observed Tetris players and found that expert players physically rotated blocks to save mental processing power. They didn't just "think" about the move; they modified the environment to make the computation easier.

### The Engineering Principle:

*   **Pragmatic Action:** Doing work to achieve a goal (e.g., searching for the file).
*   **Epistemic Action:** Doing work to make future cognitive processing easier (e.g., renaming the file so it is searchable).

Most people optimize for the current moment (Pragmatic Action). They leave the file in Downloads because it is faster now. This is a "Greedy Algorithm" that fails globally. You must optimize for the lifetime of the data.

## The Data: The Cost of Re-Finding

The cost of failing to memoize is quantified in the field of Personal Information Management (PIM).

*   **The Re-Finding Penalty:** Research by Jones et al. (2007) in *Keeping Found Things Found* indicates that users who employ specific "keeping" methods (like filing or tagging) have a success rate of over 95% in re-finding information, compared to significantly lower rates for those relying on memory or ad-hoc searching [6].
*   **The Orienteering Cost:** Teevan et al. (2004) discovered that people rarely "teleport" to information (jump straight to the answer). Instead, they engage in "orienteering"—taking small, incremental steps to navigate toward the data [7].

In my own audit, I tracked my "Cache Misses"—instances where I had to search for data I already owned.

*   Monday: Searched for "WIFI password" (3 minutes).
*   Tuesday: Searched for "gym routine" (2 minutes).
*   Wednesday: Searched for "flight confirmation" (5 minutes).

That is 10 minutes of latency introduced into high-priority workflows. Over a year, this amortizes to hours of lost throughput and, more importantly, fragmented attention.

## The Protocol: Write-Through Caching

To implement Memoization, I utilize a Write-Through Cache protocol. In this architecture, data is written to the database (storage) at the same time it is processed.

### Phase 1: The Audit (Cache Miss Analysis)

Identify your redundant computations.

*   **Log Misses:** For 3 days, carry a physical notebook.
*   **Trigger:** Every time you search for a file, look up a code, or ask "What did I decide?", write it down.
*   **Result:** This list is your "function signature." These are the specific inputs that require memoization.

### Phase 2: The Architecture (The Single Source of Truth)

You need a low-latency database. Do not use a fragmented stack (e.g., sticky notes + email + Slack).

*   **The Tool:** I use a flat-file Markdown database (Obsidian or Notion), ensuring O(1) searchability.
*   **The Global Constants:** Create a specific file named `_CONSTANTS`.
    *   `PASSPORT_NUM`
    *   `WIFI_PASS`
    *   `GATE_CODE`
*   **The Rule:** If a piece of data is needed more than once, it is assigned a variable name and entered here.

### Phase 3: The Algorithm (Implementation Intentions)

To enforce this, I use Implementation Intentions, a concept from Gollwitzer (1999) [8]. This creates an automatic "if-then" branch in your behavior.

*   **IF** I solve a problem (e.g., find the right flight), **THEN** I immediately "serialize" it to the database.
*   **Constraint:** I do not close the browser tab until the data is in the `_CONSTANTS` file.

## Conclusion

You are treating your brain like a scratching post when it should be a sculptor's chisel. Every time you re-compute a solved problem, you steal energy from the unsolved ones—your creative work, your relationships, your future.

Stop calculating. Start retrieving.

## References

[1] Miller, G. A. (1956). "The magical number seven, plus or minus two: Some limits on our capacity for processing information." Psychological Review, 63(2), 81–97.

[2] Raichle, M. E., & Gusnard, D. A. (2002). "Appraising the brain's energy budget." Proceedings of the National Academy of Sciences, 99(16), 10237–10239.

[3] Clark, A., & Chalmers, D. (1998). "The Extended Mind." Analysis, 58(1), 7-19.

[4] Michie, D. (1968). "'Memo' Functions and Machine Learning." Nature, 218, 19–22.

[5] Kirsh, D., & Maglio, P. (1994). "On Distinguishing Epistemic from Pragmatic Action." Cognitive Science, 18(4), 513-549.

[6] Jones, W., et al. (2007). Keeping Found Things Found: The Study and Practice of Personal Information Management. Morgan Kaufmann.

[7] Teevan, J., et al. (2004). "The perfect search engine is not enough: A study of orienteering behavior in directed search." Proceedings of the SIGCHI Conference on Human Factors in Computing Systems, 415-422.

[8] Gollwitzer, P. M. (1999). "Implementation intentions: Strong effects of simple plans." American Psychologist, 54(7), 493–503.
