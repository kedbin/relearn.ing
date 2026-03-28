---
title: "The Control Plane: Why AI Engineers Are Switching to Agent Orchestration"
date: "2026-03-28"
summary: "Single-agent coding hits a context ceiling fast. The new leverage comes from orchestrating specialized agents through specs, isolation, and quality gates while keeping human judgment on architecture and verification."
status: "Published"
category: "Relearn Engineering / AI Engineering"
highlights:
  - "Conductor to Orchestrator: AI engineering is shifting from synchronous pairing with one model to coordinating multiple specialized agents with explicit handoffs (Osmani, 2026)."
  - "Verification Bottleneck: Code generation gets cheaper, but trust still depends on tests, review, and proof that the system still works (Osmani, 2026; Anthropic, 2025)."
  - "Context as Scarce Memory: Orchestration works because each agent operates inside a bounded scope instead of one overloaded context window (Anthropic, 2025; Yang et al., 2024)."
  - "Human-Curated Contracts: Minimal repo guidance and explicit specs outperform redundant auto-generated instructions for coding agents (Gloaguen et al., 2026)."
audioUrl: "https://audio.relearn.ing/entry-048.mp3"
linkedin_video_urn: "urn:li:digitalmediaAsset:D4E05AQHQdbUWUAH-Ow"
publish_social: false
linkedin: |
  AI engineering is quietly changing job descriptions.
  
  Addy Osmani, Director, Google Cloud AI, captures the shift well: once you run multiple agents, the job stops being "prompt one model" and starts becoming orchestration.
  
  The new loop looks more like operating a control plane:
  
  -> decompose work
  -> assign specialized agents
  -> isolate file ownership
  -> enforce quality gates
  -> verify outputs before integration
  
  The bottleneck is no longer generation. It is coordination, verification, and judgment.
  
  The engineer who wins won't be the fastest typist or even the cleverest prompter. It will be the one who can write a precise spec, route tasks through an agent system, and still know what not to ship.
  
  Full write-up on relearn.ing:
  
  https://relearn.ing/journal/entry-048/
threads: |
  AI coding is moving from "one smart assistant" to agent orchestration.
  
  That changes the bottleneck.
  
  Not generation.
  Verification.
  Coordination.
  Judgment.
  
  The engineer is becoming a control plane, not a code typist.
  
  relearn.ing/journal/entry-048/
---

A single coding agent feels magical right up until it doesn't. It writes the route, the migration, the tests, and half the UI in one pass. Then you discover that the contract drifted, the edge case vanished, and the tests only prove that the same agent can agree with itself. The failure is not intelligence. It is architecture. We are still asking one context window to behave like an engineering organization.

That operating model is starting to break. In Addy Osmani's latest framing, the engineer is moving from **conductor** to **orchestrator**: from guiding one agent in a tight synchronous loop to coordinating multiple specialized agents working asynchronously with explicit scopes and handoffs [1]. The important part is not the poetry of the metaphor. It is the systems implication. Once the codebase outgrows one context window, the only way to preserve throughput is to split the work across bounded contexts and add coordination primitives.

### The Single-Agent Ceiling

Single-agent coding runs into three hard limits: context overload, no specialization, and no coordination [1]. A generalist agent can draft everything, but it does not hold every invariant in active memory at once. Repository-scale work is hostile to that fantasy. Benchmarks like SWE-bench exist precisely because real software tasks require long-horizon reasoning across multiple files, dependencies, and tests [4].

This is why the jump to orchestration matters. It is not about adding more "AI" to the workflow. It is about changing the topology of the work.

One agent explores the data layer. Another handles the API contract. A third reviews tests. A fourth stays read-only and acts as a verifier. Each gets a smaller slice of the problem, a cleaner context window, and clearer ownership. Anthropic's work on context engineering makes the same point from a different angle: agent performance is strongly shaped by what context is included, excluded, and structured ahead of time [2]. More tokens are not a strategy. Better boundaries are.

### The Shift: From Pairing to Control Planes

The old interaction model was pair programming with an eager junior who typed at impossible speed. The new model looks more like running a distributed system.

- **Specs** become routing tables.
- **Task lists** become schedulers.
- **AGENTS.md** becomes the local control plane for conventions, gotchas, and invariants.
- **Quality gates** become circuit breakers that stop bad output before it propagates.

In that sense, the engineer's job is becoming less like writing functions and more like managing a production pipeline. Addy calls this the factory model: plan, spawn, monitor, verify, integrate, retro [8]. I think of it as moving from SSH-ing into one box to operating Kubernetes for cognition. You are not executing every process manually. You are defining the deployment, the isolation boundary, the health checks, and the rollback conditions.

### Why This Matters

Multi-agent systems matter because they multiply four things that single-agent workflows can only stretch: parallelism, specialization, isolation, and compound learning [1]. Parallelism is obvious: frontend, backend, and tests can proceed at the same time. Specialization matters because a focused agent working inside one subsystem tends to write cleaner code than a generalist thrashing across the entire tree [3]. Isolation matters because separate worktrees or bounded file scopes reduce merge collisions and failure blast radius. Compound learning matters because hard-won rules can be captured once and reused by every future run.

But the real reason this shift matters is economic. When code generation gets cheap, the scarce resource is no longer syntax. It is judgment. The constraint moves upward in the stack. The engineer is now paid to decide what work to decompose, what contract to enforce, what evidence counts as proof, and what should never be built in the first place.

### The New Bottleneck Is Verification

This is the part the hype usually skips. Agents can generate output faster than most teams can validate it. Addy states it plainly: the bottleneck is no longer generation, but verification [1][7]. That is exactly where orchestration either becomes engineering discipline or collapses into industrialized hallucination.

Verification is expensive because passing tests are not the same as trustworthy changes. An agent can write tests that confirm its own misunderstanding. A team of agents can amplify the problem by agreeing on the wrong abstraction at machine speed. Recent work on multi-agent failure modes points to the same pattern: systems fail less from lack of raw generation and more from bad decomposition, inter-agent misalignment, and weak evaluation [6].

So the winning stack is not "more autonomous agents." It is agents plus gates:

- plan approval before implementation
- one file, one owner
- task dependency tracking
- automatic lint, test, and review hooks
- human review at architecture boundaries

This is why the skill set changes. Prompting is not enough. Strong engineers now need to write specs that survive parallel execution.

### AGENTS.md as Operational Memory

The most underrated part of this transition is not the agent. It is the contract around the agent.

An `AGENTS.md` file, or any equivalent repo-scoped instruction layer, acts like operational memory for the system. It tells every agent what style to follow, which invariants are sacred, where the sharp edges live, and how to test safely. Done well, it compresses institutional knowledge into a machine-readable brief. Done badly, it becomes prompt exhaust.

That distinction matters. Research on repository-level context files suggests the winning version is not a bloated machine-generated manual, but a minimal human-curated document containing non-obvious guidance [5]. In infrastructure terms: a concise config file beats a log dump.

### Delegate the Tasks, Not the Judgment

The most important mental model in Addy's piece is also the simplest: delegate tasks, not judgment [1].

Let agents handle:

- boilerplate
- migrations
- test scaffolding
- refactors with clear pass/fail criteria
- exploration inside bounded file scopes

Keep for humans:

- architecture
- product tradeoffs
- rejecting unnecessary complexity
- deciding what not to build
- final verification with full system context

If you outsource judgment, the speed gain is fake. You are borrowing velocity against future comprehension debt [9]. The system looks fast right until you need to extend it and realize nobody in the loop still understands the whole machine.

### The Protocol

If I were switching an AI engineering workflow today, I would do it in phases.

**Phase 1: Decompose the work.** Stop giving one agent a monolithic feature brief. Break the work into modules with explicit inputs, outputs, and file ownership.

**Phase 2: Add a control plane.** Create a shared task list, dependency tracking, and repo instructions that define architecture, style, and tests.

**Phase 3: Install quality gates.** Require plan approval for risky tasks. Run tests and reviews on completion. Kill and reassign stuck agents instead of letting them loop.

**Phase 4: Preserve human context.** Review the joins: the contracts between systems, not just the diffs inside them.

This is the difference between having a fast assistant and having a reliable factory.

The switch to agent orchestration matters because it changes what engineering excellence looks like. The best AI engineers will not be the ones who can get one model to produce the longest diff. They will be the ones who can design a system of agents that stays legible under load.

The engineer is becoming the control plane.

### References

[1] Osmani, A. (2026). "The Code Agent Orchestra: what makes multi-agent coding work." https://addyosmani.com/blog/code-agent-orchestra/

[2] Anthropic. (2025). "Effective context engineering for AI agents." https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

[3] Yang, J., Jimenez, C. E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., & Press, O. (2024). "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering." arXiv:2405.15793.

[4] Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., & Narasimhan, K. (2024). "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" arXiv:2310.06770.

[5] Gloaguen, T., Mundler, N., Muller, M., Raychev, V., & Vechev, M. (2026). "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?" arXiv:2602.11988.

[6] Cemri, M., et al. (2025). "Why Do Multi-Agent LLM Systems Fail?" arXiv:2503.13657.

[7] Osmani, A. (2026). "AI writes code faster. Your job is still to prove it works." https://addyosmani.com/blog/code-review-ai/

[8] Osmani, A. (2026). "The Factory Model: How Coding Agents Changed Software Engineering." https://addyosmani.com/blog/factory-model/

[9] Osmani, A. (2026). "Comprehension Debt." https://addyosmani.com/blog/comprehension-debt/
