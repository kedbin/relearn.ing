---
title: "The Fan-Out Protocol: Why Silent Systems Never Scale"
date: "2026-01-10"
summary: "A system that processes internally but never broadcasts externally is optimizing for invisibility. Growth requires a presentation layer and a feedback loop, not just a backend."
status: "Published"
category: "Relearn Engineering / Systems"
highlights:
  - "The Invisible Work Fallacy: Heads-down execution without visibility is a career antipattern; without a presentation layer, your throughput is invisible to the network [1]."
  - "Signal Theory: Publishing is not vanity; it is a credible signal that reduces information asymmetry between you and your audience [2]."
  - "Pub/Sub Decoupling: Fan-out architectures separate content creation from distribution, enabling async scaling without tight coupling to any single platform [3]."
audioUrl: "https://audio.relearn.ing/entry-023.mp3"
---

I recently wired up a connector to automatically publish my journal entries to LinkedIn and Threads via their APIs. The architecture is a fan-out pattern using Google Pub/Sub: when a journal is ready, a single publish event triggers multiple subscribers, each handling distribution to a different platform.

Building this forced me to confront a belief I held for years: that good work speaks for itself.

It does not.

## The Fallacy: The Invisible Backend

Early in my career, I believed that invisible, honest work was inherently virtuous. Head down, code compiling, no self-promotion. This felt honorable. It was also an antipattern.

The fallacy is treating your career like a closed system. You optimize internally: better code, deeper knowledge, longer hours. But you never expose an API. You have no presentation layer. The outside world cannot query your capabilities because you never published an endpoint.

This is the software equivalent of building a powerful database with no REST interface. The data exists. The processing is real. But without a way to access it, the system might as well not exist.

We see this pattern everywhere. The engineer who does excellent work but never gets promoted. The researcher with breakthrough insights buried in private notes. The founder with a working product but zero distribution. Internal throughput, zero external visibility.

The system is running at full capacity. The network just cannot see it.

## The Model: Fan-Out Architecture for Growth

To fix this, we need to think like distributed systems engineers. The solution is not to become a shameless self-promoter. It is to architect a proper fan-out system with three components: a message bus, quality filters, and feedback loops.

### The Message Bus (Pub/Sub)

Shawn Wang, in his influential essay "Learn in Public," argues that the fastest way to learn is to create exhaust from your learning process and share it publicly [1]. But he is describing more than a content strategy. He is describing a pub/sub architecture.

When you learn something, you publish a message to your personal topic. Subscribers (LinkedIn, Threads, your blog, Twitter) each receive the message and handle distribution in their own way. The key insight is decoupling: your job is to publish. Distribution is handled by the subscribers.

This is why I chose Google Pub/Sub for my journal system. When my voiceover generation completes (an async process that takes several minutes), a completion event triggers the publishing pipeline. The audio generation does not need to know about LinkedIn. LinkedIn does not need to wait for audio. Each component does one thing and communicates via messages.

### The Quality Filter (Signal vs Noise)

Publishing everything is spam. This is the second antipattern.

Michael Spence's signaling theory from economics explains why [2]. A signal only works if it is costly to fake. If everyone broadcasts everything, the signal degrades into noise. Your audience cannot distinguish substance from filler.

The solution is curation. Not every journal entry gets published. Only the ones that clear a quality threshold. This is the filter function in the pipeline: it evaluates each message and decides whether to fan out or drop.

In my system, I manually select which entries to publish. This is intentional friction. It forces me to ask: "Is this worth someone's attention?" If the answer is no, the message never hits the bus.

### The Feedback Loop (Open Systems)

The third component is why this matters at all. Publishing is not about vanity metrics. It is about opening your beliefs to feedback.

A closed system has no error correction. You think your ideas are good because nothing has challenged them. An open system routes outputs back as inputs. Someone replies, disagrees, adds context. Your mental model updates.

Cal Newport calls this the "career capital" feedback loop [3]. You produce visible work, the market responds, you learn what is valued, you adjust. Without the visibility, you are optimizing in the dark.

This is also why building in public works as a commitment device. When you announce what you are doing, you create social accountability. The publish event is not just distribution; it is a contract with your future self.

## The Data: Why Visibility Compounds

Research on career advancement consistently shows that performance alone does not predict success. Visibility does.

A study of professional service firms found that employees who made their work visible were promoted faster than equally skilled colleagues who worked in isolation [4]. The mechanism is simple: decision-makers cannot reward what they cannot see.

This is not about being loud. It is about having a presentation layer. Your backend can be excellent. But without an API that exposes your capabilities, no one can integrate with you.

The compounding effect is significant. Each published piece is a node in a growing network. It attracts feedback, connections, and opportunities. Over time, the network effects dwarf the individual outputs.

## The Protocol: Architecting Your Fan-Out System

To apply this, you need three things: a publishing habit, a quality filter, and feedback instrumentation.

### Phase 1: Build the Message Bus

Decide what you will publish and where. The content is your "message." The platforms are your "subscribers."

For me:
- Journal entries publish to LinkedIn (professional), Threads (casual), and my site (canonical)
- Each platform gets a tailored format (the subscriber transforms the message)
- Publication is triggered by a single event, not manual cross-posting

Action: Choose one type of work you do regularly. Define where it should be visible. Automate the distribution if possible.

### Phase 2: Implement the Quality Filter

Not everything deserves distribution. Define your threshold.

My heuristic: "Would someone I respect find this useful or interesting?" If the answer is uncertain, do not publish. The cost of noise is higher than the cost of silence.

Action: Before publishing, run the message through a filter function. What is the insight? What is the value to the reader? If you cannot articulate it in one sentence, the message is not ready.

### Phase 3: Instrument the Feedback Loop

Publishing without measuring is broadcasting into the void. You need to capture responses.

This does not mean obsessing over likes. It means paying attention to:
- What gets engagement vs silence?
- What generates replies and discussions?
- What do people misunderstand? (This reveals where your explanation is weak)

Action: After each publish cycle, review the feedback. Update your mental model of what resonates. Adjust your filter function accordingly.

## The Meta-Lesson

I spent years optimizing my backend while neglecting my presentation layer. The work was real. The growth was not.

The fan-out architecture fixed this. One publish event, multiple subscribers, async distribution, feedback collection. The system is open. The beliefs are exposed. The growth is measurable.

A closed system cannot scale. It can only iterate in isolation until it runs out of energy.

An open system grows by exposure. Every output becomes an input. Every publish event creates the possibility of feedback.

Architect for fan-out. Growth is a network effect, and networks require visible nodes.

---

## References

[1] Wang, S. (2018). "Learn in Public." swyx.io. The essay that popularized the concept of creating "learning exhaust" as a growth strategy.

[2] Spence, M. (1973). "Job Market Signaling." Quarterly Journal of Economics, 87(3), 355-374. The foundational paper on signaling theory in economics.

[3] Newport, C. (2012). "So Good They Can't Ignore You." Grand Central Publishing. Argues for building career capital through deliberate practice and visible output.

[4] Ibarra, H. (1999). "Provisional Selves: Experimenting with Image and Identity in Professional Adaptation." Administrative Science Quarterly, 44(4), 764-791. Research on visibility and identity in professional advancement.
