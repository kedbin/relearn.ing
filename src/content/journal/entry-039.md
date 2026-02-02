---
title: "The Observability Doctrine: Why Hard Work Deprecates Silently"
date: "2026-02-02"
summary: "A Principal Engineer's retrospective on the 5 unlearnings required to break career stagnation, framed through the lens of system observability and signal detection theory."
status: "Published"
category: "Relearn Work / Career Engineering"
highlights:
  - "Visibility Heuristic: Performance without observability is career technical debt--if the system can't log it, it didn't happen (Bolino et al., 2016)."
  - "Multiplier Effect: At senior levels, network throughput beats individual throughput--Multipliers extract 2x capability from teams (Wiseman, 2010)."
  - "High Agency: Internal locus of control predicts breaking stagnation; prototype over permission, shadow to own (Judge & Bono, 2001)."
audioUrl: "https://audio.relearn.ing/entry-039.mp3"
publish_social: true
linkedin_video_urn: "urn:li:digitalmediaAsset:D4D05AQFWuY264NncPA"
linkedin: |
  I spent years believing hard work would speak for itself.
  
  It doesn't. In a distributed organization, a node that doesn't emit heartbeats is indistinguishable from a dead node.
  
  After 18 years at Amazon, a Principal Engineer shared the 5 things he had to UNLEARN to break career stagnation. The research backs him up:
  
  -> Invisible work is technical debt. Bolino et al. (2016) found visibility is a distinct variable from performance--and it correlates more heavily with outcomes.
  
  -> Being the "best" engineer is a bottleneck, not a router. Wiseman's research shows Multipliers get 2x capability from teams vs. Diminishers who hoard intelligence.
  
  -> Your manager isn't a peer; they're a client. LMX theory proves that relationship quality predicts promotion better than objective performance metrics.
  
  -> High Agency isn't arrogance--it's an internal locus of control. Prototype over permission. Shadow to own.
  
  Silent nodes are indistinguishable from failed ones.
  
  Full write-up (with audio) on relearn.ing:
  
  https://relearn.ing/journal/entry-039/
threads: |
  spent years thinking hard work speaks for itself
  
  it doesn't. in a distributed org, silent nodes are indistinguishable from failed ones.
  
  visibility isn't politics--it's observability. if you can't demo it, graph it, or put a dollar figure on it... it didn't happen.
  
  full write-up (or give it a listen) -> relearn.ing/journal/entry-039/
---

There is a specific type of career stagnation that hits senior engineers around the 7-year mark. You are shipping cleaner code than ever. Your architecture diagrams are works of art. You are the first in the repo and the last to leave.

And yet, you are passed over for promotion by someone who writes worse code but talks more.

This isn't a bug in the system; it is a bug in your model of the system. After 18 years at Amazon, a Principal Engineer shared the five "unlearnings" required to break through this plateau. The core realization? **Your career is a distributed system, and a node that doesn't emit heartbeats is indistinguishable from a dead node.**

## The Fallacy: The "Root Access" Myth

We grow up with the **Just-World Hypothesis**, a cognitive bias assuming that noble actions (hard work) automatically result in noble outcomes (recognition). In engineering terms, we believe the organization has "Root Access" to our output--that management can see every commit, every refactor, and every saved database cycle.

We assume: `Performance = Impact`.

The reality is that organizations are opaque, lossy networks. Information packets (your work) get dropped, corrupted, or routed to `/dev/null` unless they are explicitly headered and broadcasted.

## The Model: Signal Detection and LMX Theory

To debug this, we need to look at **Signal Detection Theory** and **Leader-Member Exchange (LMX) Theory**.

### 1. The Visibility Heuristic

Research by Bolino et al. (2016) in the *Annual Review of Organizational Psychology* distinguishes between **Job Performance** (what you do) and **Impression Management** (what is seen). They found that while performance matters, the *visibility* of that performance is a distinct variable that correlates heavily with career outcomes [1].

If you spend three weeks refactoring a legacy module to reduce latency by 50ms, but no one "felt" the latency before, you have done **Invisible Work**. In a distributed system, work without observability is not an asset; it is a hidden dependency.

### 2. The Multiplier Effect

As you rise, your individual throughput becomes less valuable than your network throughput. Liz Wiseman's research in *Multipliers* (2010) identifies two types of leaders: **Diminishers** (who hoard intelligence) and **Multipliers** (who amplify others). Wiseman found that Multipliers get 2x the capability from their teams compared to Diminishers [2]. The "Best Engineer" who critiques every PR into oblivion is a Diminisher; they are a bottleneck, not a router.

### 3. The Agency Variable

Finally, the psychological concept of **Locus of Control** is critical. A meta-analysis by Judge and Bono (2001) confirmed that individuals with an *Internal Locus of Control* (believing they control outcomes) show significantly higher job performance and satisfaction than those with an External Locus (waiting for permission) [3]. In tech, we call this **High Agency**.

## The Data

- **LMX Theory:** A meta-analysis by Dulebohn et al. (2012) showed that the quality of the relationship with your manager (Leader-Member Exchange) is a stronger predictor of promotion and salary progression than objective performance metrics alone [4].

- **The Self-Promotion Gap:** Studies consistently show that "meritocracy" is a noisy signal. Without active broadcasting, the signal-to-noise ratio of your work drops below the detection threshold of management.

## The Protocol: The Observability Pipeline

To patch your career operating system, you must implement the following protocol.

### Phase 1: Instrument Your Work (The Visibility Check)

Stop treating "doing the work" as the final step. It is merely the compile step.

1. **Pre-Commit Check:** Before accepting a task, query: "Is this solving a problem a stakeholder with power cares about?"

2. **The 'Tree Falls in Forest' Rule:** If you can't demo it, graph it, or put a dollar figure on it, don't prioritize it.

3. **Refactor with ROI:** If you must do invisible work (refactoring), bundle it with a visible feature. "I added the new payment gateway (Visible) and reduced tech debt in the checkout module (Invisible)."

### Phase 2: Align the API (Manager as Customer)

Your manager is not a peer; they are a client with a specific spec sheet.

1. **The Discovery Call:** Ask your manager, "What is the one metric *you* are being evaluated on this quarter?"

2. **API Alignment:** If they are measured on "Stability," stop pitching "New Features." If they are measured on "Velocity," stop pitching "Perfect Testing."

3. **Status Updates as Marketing:** Never make them poll your endpoint. Push updates proactively. "Here is what I shipped, here is the impact, here is the next blocker."

### Phase 3: Switch to Broadcast Mode (The Multiplier)

Stop optimizing your local runtime and start optimizing the cluster.

1. **The Unblocker:** Instead of taking the hardest ticket, ask, "What is blocking the junior engineers?" and remove it.

2. **The Documentarian:** Write the documentation that saves everyone 5 hours. That is scalable impact.

3. **The Sponsor:** Publicly praise others. Paradoxically, highlighting others' work makes you look like a leader, not a follower.

### Phase 4: High Agency Execution

Deprecate the "Waiting for Ticket" state.

1. **Shadow to Own:** Don't ask for a project; ask to shadow the problem, then propose the solution.

2. **Prototype over Permission:** Build the MVP over the weekend. It is harder to say no to a working prototype than a slide deck.

## The Meta-Lesson

In a distributed organization, silent nodes are indistinguishable from failed ones.

## References

[1] Bolino, M., Long, D., & Turnley, W. (2016). "Impression Management in Organizations: Critical Questions, Answers, and Future Directions." *Annual Review of Organizational Psychology and Organizational Behavior*.

[2] Wiseman, L. (2010). *Multipliers: How the Best Leaders Make Everyone Smarter*. Harper Business.

[3] Judge, T. A., & Bono, J. E. (2001). "Relationship of core self-evaluations traits--self-esteem, generalized self-efficacy, locus of control, and emotional stability--with job satisfaction and job performance: A meta-analysis." *Journal of Applied Psychology*.

[4] Dulebohn, J. H., et al. (2012). "A Meta-Analysis of Antecedents and Consequences of Leader-Member Exchange." *Journal of Management*.
