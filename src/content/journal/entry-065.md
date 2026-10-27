---
title: "Day One of the FDE Workshop: Steel Padlocks, Flat-Pack Skills, and Five Waiters With One Pickle"
date: "2026-10-27"
summary: "Four days inside Google Cloud's Forward Deployed Engineer workshop for Gemini Enterprise, distilled into one rule: prompts are probabilistic, so policy enforcement has to be deterministic. Day One covered flat-pack Agent Skills, the /grill-me interrogation loop, black-box event sourcing, three code bouncers outside the model, MCP-versus-A2A direction, the stdio print() and text/plain traps, the $5,000 INPUT-REQUIRED pause, W3C traceparent AirTags, the JoinNode pickle trap, SPIFFE identities, and AlphaEvolve's evaluator-first loop. Narrated in two parts."
status: "Draft"
category: "AI Engineering / Agent Platforms"
highlights:
  - "The sentence that reorganised everything: prompts are probabilistic, so policy enforcement must be deterministic. A prompt is a polite wish; a hook is a padlock."
  - "Agent Skills are flat-pack furniture for agents: skill.md as the instruction sheet, scripts/ as the power tools, references/ as the manual, assets/ as the stencils. Ninety skills stuffed into a prompt costs ~180,000 tokens per turn; a registry index card costs ~300."
  - "/grill-me turns the model into a Staff QE before code exists. The grilling loop walks the frontier of unresolved decisions until your spec stops hiding lemons where you asked for bananas."
  - "Event sourcing is a black-box flight recorder, not a chalkboard. Append-only turns with periodic snapshots mean you can replay turn 1,000 to 1,005 instead of shrugging at a 2AM incident."
  - "Three code bouncers live outside the model: whole-app, per-agent, and pre_tool_call. You can unit-test the slap on the hand without ever invoking the LLM, which is the whole point."
  - "MCP is vertical (one agent reaching for a tool), A2A is horizontal (peer agents delegating). Two gotchas cost real hours: a single print() on stdio stdout breaks JSON-RPC framing, and 'text' instead of 'text/plain' bounces you at the enterprise door."
  - "Do not hold an HTTP socket open while a human thinks. Park the task at INPUT-REQUIRED, clip a W3C traceparent AirTag to the request, and resume when the boss clicks approve."
  - "Five parallel agents without a JoinNode barrier is a waiter who sprints to your table five times with a bun, then one pickle, then ketchup. And AlphaEvolve's real lesson is that the evaluator is the product."
  - "Narrated in two parts: Part 1 covers the policy rule, flat-pack skills, /grill-me, event sourcing and the three code bouncers; Part 2 covers MCP versus A2A, the protocol gotchas, human-in-the-loop pauses, distributed tracing, both labs, and AlphaEvolve."
audioUrl: "https://audio.relearn.ing/entry-065-part1.mp3"
youtube_url: "https://www.youtube.com/watch?v=ean_pqrlnA0"
youtube_video_id: "ean_pqrlnA0"
publish_social: false
linkedin: |
  I just finished a 4-day Google Cloud Gemini Enterprise FDE bootcamp, and my notes turned out to be mostly about failure modes rather than prompts.
  
  Which is the useful part. I'm not trying to demo an agent, I'm trying to get one through production review without it becoming a liability - and every session that actually stuck was about what stops it doing something dumb at 2AM.
  
  So I'm writing it up in public: half a reference for future me, half because someone else is probably stuck on the same day-one questions.
  
  Part 1 is up (4 minutes): policy over prompts, skills as files, /grill-me, event sourcing, and the three code bouncers that sit outside the model.
  https://www.youtube.com/watch?v=ean_pqrlnA0
  
  Part 2 drops tomorrow, and it has the one that actually bit people in the room: two protocol gotchas that cost an afternoon. One of them is a single print() statement.
  https://www.youtube.com/watch?v=2_t66Yi0C54
  
  Writeup: https://relearn.ing/journal/entry-065/
  
  #AIAgents #MCP #GeminiEnterprise
threads: |
  I spent four days in Google Cloud's FDE workshop for Gemini Enterprise. Day One's whole thesis fits in one line:
  
  "Prompts are probabilistic. Policy enforcement has to be deterministic."
  
  A prompt is a polite wish. A hook is a padlock.
  
  Best bits:
  - Agent Skills = flat-pack furniture (skill.md, scripts/, references/, assets/)
  - /grill-me interrogates you before it writes code
  - Event sourcing = black-box flight recorder, not a chalkboard
  - 3 code bouncers outside the model, all unit-testable
  - MCP points down, A2A points sideways
  - print() on stdio stdout breaks JSON-RPC; "text" should be "text/plain"
  - Park human approvals at INPUT-REQUIRED instead of holding a socket
  - No JoinNode = a waiter bringing you a bun, then a pickle, then ketchup
  
  Full writeup: https://relearn.ing/journal/entry-065/
youtube_title: "FDE Workshop Day 1: Prompts Are Probabilistic, Policy Is Not"
youtube_description: |
  Four days inside Google Cloud's Forward Deployed Engineer workshop for Gemini Enterprise, compressed into the one rule that mattered on Day One: prompts are probabilistic, so policy enforcement has to be deterministic.
  
  In this two-part video: flat-pack Agent Skills, the /grill-me interrogation loop, black-box event sourcing, three code bouncers outside the model, MCP versus A2A, the stdio print() and text/plain traps, the $5,000 INPUT-REQUIRED pause, W3C traceparent AirTags, the JoinNode pickle trap, SPIFFE identities in Auth Manager, and AlphaEvolve's evaluator-first loop.
  
  Part 1 covers padlocks, flat-pack skills, /grill-me, event sourcing, and the three bouncers.
  Part 2 covers MCP versus A2A, the two protocol gotchas, human-in-the-loop pauses, distributed tracing, and both labs.
  
  Full writeup with code and numbers: https://relearn.ing/journal/entry-065/
youtube_tags:
  - "AI engineering"
  - "Gemini Enterprise"
  - "Google Cloud"
  - "agent skills"
  - "MCP"
  - "A2A protocol"
  - "event sourcing"
  - "SPIFFE"
  - "AlphaEvolve"
  - "distributed tracing"
youtube_privacy_status: "unlisted"
---

I spent four days inside Google Cloud's Forward Deployed Engineer workshop for Gemini Enterprise. I walked in expecting four days of prompt tricks, the polite verbal gymnastics of asking a language model to please behave.

Day One had other plans. It spent the first ten minutes explaining, in the calm tone of someone who has been paged at 3AM, that everything I thought was "AI security" was mostly decoration.

Here is the sentence that reorganised my brain:

> Prompts are probabilistic; policy enforcement must be deterministic.

Read it once more, because it retroactively invalidates a lot of confident LinkedIn posts.

### The Sticky Note Security Model

The way most teams protect an agent today is typing `PLEASE DO NOT DELETE THE DATABASE` in all caps at the bottom of a system prompt, then feeling a small warm glow of safety.

That is not security. That is locking a stranger in a room full of bananas with a sticky note that says *please don't eat these*, and hoping the vibes hold.

If you have written Playwright tests, you already know the failure mode. It is the pull request where someone deletes `await expect(page.getByRole('button', { name: 'Checkout' })).toBeEnabled()` and replaces it with the comment `// looks fine in the video`. The test suite goes green. The vibes are immaculate. Production is on fire.

A prompt is a polite wish. A padlock is a `pre_tool_call` hook that refuses to let the model touch `roles/owner`, no matter how beautifully it roleplays being King of the Jungle.

That distinction runs through everything below. Day One is not really a workshop about prompting. It is a workshop about **deterministic seams** wrapped around a probabilistic engine.

### Agent Skills Are Flat-Pack Furniture for Agents

Module One opened with the most expensive mistake in the current agent playbook: stuffing ninety tools into one monolithic system prompt.

Do the arithmetic. Ninety skills at roughly two thousand tokens each is about **180,000 tokens** loaded on every single turn. That is not a context window, that is a mortgage. The model also gets measurably worse, because the middle of a giant prompt is where instructions go to be forgotten. Instruction drift is just context rot with better branding.

The fix is a folder.

| Part of the skill | What it is | IKEA equivalent |
| --- | --- | --- |
| `skill.md` | YAML frontmatter, trigger criteria, imperative steps | The instruction sheet on top of the box |
| `scripts/` | Pre-tested Python or Bash, `set -euo pipefail` | The power drill, already charged |
| `references/` | Schemas and docs loaded on demand | The manual for weird edge cases |
| `assets/` | Templates and golden fixtures | Fill-in-the-blank stencils |

An Agent Skill is a flat-pack kit for exactly one job. The agent reads the sheet, uses the drill instead of karate-chopping a server together from memory, checks the manual when the bolts do not line up, and prints the output on a stencil so it comes out the right shape every time.

The second half of the module was about **specificity versus fragility**, which is the part nobody tweets about:

- If a mistake is harmless (drafting a summary, doodling a banana), give the model declarative freedom.
- If one wrong CLI flag detonates production (Terraform rollouts, IAM changes), force a **Plan → Validate → Execute** loop with pre-flight and post-flight checklists and a bundled script.

Then the registry, which is where the economics get silly. Instead of 180,000 tokens of skill text, the base prompt carries two small tools: `search_skills(query)` and `load_skill(name)`, about **300 tokens** total. Agents discover skills at runtime, pull an immutable **SHA-256-pinned snapshot** like `v1.4.2@sha256:e3b0c4…`, cache it, and inject `<active_skill>` only when it is actually needed.

Two consequences worth internalising:

1. **Cost.** Roughly 98% of the base prompt is gone.
2. **Reproducibility.** When a nightly agent test fails, you know the exact digest of every skill that was loaded. No more *"did someone edit the prompt in prod at 2PM?"*

The mutable-versus-immutable split is straight out of Cloud Run: edit freely in a local container, deploy immutable revisions to staging and production, roll back instantly. And skills get tested with the same loop you would use for any regression suite: **write cases → grade with and without the skill → read the delta → iterate**.

A skill folder is basically a Page Object Model plus a fixture, for a brain.

### `/grill-me` and the Banana Test

The best slash command of the day is `/grill-me`, and it exists because humans write terrible requirements on napkins.

Ask a normal agent to "go get me a banana" and it will not ask a single question. It sprints off at full speed and returns with a raw green plantain, or possibly a lemon, and a cheerful summary explaining that it has completed the banana task.

`/grill-me` is the directive: *stop writing code right now and interview me*. The `grilling` loop is the resulting stateful interrogation. It tracks the **frontier of unresolved decision boundaries** and cross-examines the architecture until every edge case is settled: minimum and maximum replicas, state locking, IAM roles, failure modes, what happens at the boundary.

Visually it is a detective lamp in your face asking: hold on, what kind of banana do you actually want? Ripe, green, sweet, sour, sliced, mashed, or did you secretly mean a yellow lemon?

For QEs this is the shift-left dream. The question you normally ask in PR review — *"what happens if the user double-clicks Submit while offline with an expired JWT?"* — gets asked during planning, before a line of code or a line of Playwright exists. For developers, it converts "add autoscaling and make it fast" into something executable.

### Event Sourcing Is a Flight Recorder, Not a Chalkboard

Next was the turn anatomy: `Runner → App → Context → Event Stream (SSE)`, with `AutoFlow` marshalling `extracted_entities` and `conversation_summary` across agent handoffs.

Most applications store state the way you erase a chalkboard: overwrite the row, move on. When five hundred bananas vanish at 2AM, the evidence has already been wiped.

Event sourcing instead appends immutable events — `TurnStarted`, `ToolCallRequested`, `RevisionCreated` — to Firestore or PubSub, with periodic snapshots. Nothing is ever overwritten in place, so you can time-travel replay `0…N` and reproduce the exact state at turn 1,000 through 1,005.

If you have ever opened `npx playwright show-trace`, you already understand the value proposition. Event sourcing is the Trace Viewer for agents, except the trace is the product, not a debugging artefact.

Day One also laid out five composition patterns, and knowing which one you are in prevents most multi-agent bugs:

1. Collaborative transfer (agents handing off conversation state).
2. Agent-as-a-tool (a specialist invoked like any other function).
3. Graph workflows (DAGs with `JoinNode` barriers).
4. Dynamic workflows (runtime-decided routing).
5. Workflow templates (parameterised recipes).

### Three Code Bouncers, All Outside the Model's Brain

Hooks are the padlocks, and they come in three tiers. Notice that none of them live inside the prompt, which is precisely the point: no jailbreak, no clever persona, no "ignore previous instructions" can talk its way past a Python function that returns `blocked`.

| Tier | Examples | What it stops |
| --- | --- | --- |
| Whole-app | `AuthenticationMiddleware`, `TokenBudgetLimiter`, `DlpRedactionProcessor` | Badges at the front door, spend explosions, PII leaking out |
| Per-agent | `ContextCompactorPlugin`, `TransferPolicyPlugin` | Hallway escalation, runaway context growth |
| Tool seam | `pre_tool_call`, `RequireHumanApprovalHook`, `post_tool_call` truncation | The red button, destructive actions, 50KB tool dumps |

The eight-vector attack matrix maps cleanly onto them: prompt injection hits `pre_request_transform`; PII leakage hits `post_model_transform`; privilege escalation to `roles/owner` hits `pre_tool_call`; destructive actions hit a human-approval hook; denial of wallet hits `on_token_generate`; lateral movement between agents hits `agent_transfer` RBAC; context flooding hits `post_tool_call` truncation; audit evasion hits `on_turn_end`.

The underrated consequence: **you can test hooks without calling the model**. Fast, deterministic, no API spend, no flakes. The probabilistic part stays probabilistic; the enforcement part becomes a unit test.

### MCP Points Down, A2A Points Sideways

The loudest argument online is "MCP versus A2A", and the answer is embarrassingly simple once you decide which direction the arrow points.

- **MCP is vertical.** One agent reaches down with its own hands to grab a tool: query a database, read a resource, click a browser button.
- **A2A is horizontal.** One agent picks up a walkie-talkie and delegates a task to a peer agent on another team, in another framework, possibly in another cloud.

The two sides also overlap in a way that matters for testing. Playwright sits on both edges: `@playwright/mcp` gives an agent a vertical browser tool, while Playwright API tests validate the horizontal JSON-RPC and SSE task envelopes. Same tool, both axes.

Agents from Google ADK and LangGraph discover each other by trading **Agent Cards** at `/.well-known/agent-card.json`, which behave like Pokémon cards listing available skills. And like internet routers, they stamp each hop on a forwarding slip, so Agent A and Agent B cannot play hot potato with the same request until your cloud bill catches fire.

That BGP analogy is not decoration. Autonomous Systems advertise capabilities, paths get loop detection through an AS-path vector, and routing is policy-driven: Flash at ingress, Pro for synthesis, a quantised model for batch. Which introduces a testing problem worth naming: when you switch from a uniform Pro fleet to a tiered Flash/Gemma fleet, **behavioural divergence** is the regression. You catch it with schema evals that grade the same cases before and after the swap.

### Two Gotchas That Ate Real Hours in the Room

**Gotcha one: `print()` will corrupt your pipe.** When a local MCP tool talks over stdio, that wire carries JSON-RPC framing and nothing else. One leftover `print("debug")` on `stdout` is a cough straight into the data pipe, and the parser dies. Log to `stderr`. In Node, the same rule applies to `console.log()` inside an MCP stdio server.

**Gotcha two: `"text"` is not `"text/plain"`.** Upgrading from local A2A `0.3` to Gemini Enterprise `1.0` introduced strict RFC MIME handling on agent cards. Casual `"text"` in `defaultInputModes` gets you bounced at the door. Enterprise demands `"text/plain"`.

Both are contract-test shaped, so here is the shape:

```js
// CI gate before an agent card ever reaches Gemini Enterprise
const card = await request.get('/.well-known/agent-card.json').then(r => r.json());
expect(card.defaultInputModes).toContain('text/plain');
expect(card.defaultInputModes).not.toContain('text');
expect(card.provenance.skillDigests.every(d => /^sha256:[a-f0-9]{64}$/.test(d))).toBe(true);
```

Fifteen lines of assertions would have saved an afternoon of confused staring.

### The $5,000 Pause and the Glowing AirTag

Now the part that separates toy agents from production ones: a job that takes forty minutes, or a refund request for a crate of golden bananas that needs a human.

You cannot hold an HTTP connection open for an hour while a manager is at lunch. It times out, and so does your user's patience.

So every A2A task runs on a six-state scoreboard: `SUBMITTED → WORKING → INPUT-REQUIRED → COMPLETED / FAILED / CANCELLED`.

The moment the agent crosses the `$5,000` threshold, it flips the scoreboard to `INPUT-REQUIRED`, parks the task safely, and hangs up. No socket, no polling loop, no heavy breathing into the phone. When a human clicks approve, `tasks/provideInput` resumes the work.

Use SSE with `: ping` heartbeats for short UI turns. Use push (`HTTP 202 Accepted` plus a webhook or PubSub callback with OIDC) for long jobs and human approvals. And test the seam, because the seam is where the bugs live: trigger the high-risk action, assert the task pauses at `INPUT-REQUIRED`, approve in the UI, assert `WORKING → COMPLETED`.

Then the tracing trick that made the room sit up.

One user click fans out to five agents across three servers. Somebody drops the ball on hop four. Without a trace you are reading five unrelated log streams and inventing a narrative.

Clip one glowing GPS AirTag onto the request at the front door — a W3C header:

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

That single header rides from HTTP ingress into the coordinator, into the outbound A2A headers **and** `Task.metadata.traceparent`, into the remote agent, into the MCP `_meta.traceparent`, and out into Cloud Trace as one waterfall.

For Playwright people, this is the end of "which agent broke the test?" Generate a deterministic `traceparent` per test from `testInfo.testId`, inject it with `page.setExtraHTTPHeaders()`, and every failing UI test links directly to the exact multi-agent trace. Mirror the `traceId` inside `Task.metadata` too, otherwise traces die in the `INPUT-REQUIRED` gap between two HTTP requests.

### Lab 1: Five Waiters, One Pickle, One Ketchup Drizzle

The hands-on labs are where theory gets humiliated, and Lab 1 was the best example.

Five specialist agents fan out in parallel to hunt a bug across GitHub, Stack Exchange, BigQuery, internal manuals, and Salesforce. The coordinator is supposed to synthesise their findings.

The trap: wire five parallel agents into a normal node instead of a `JoinNode` barrier, and the lead agent does not wait. It fires synthesis five separate times as each branch trickles in.

The metaphor that stuck: a waiter who refuses to wait for the kitchen. He sprints to your table five times, delivering a bare bun, then one lonely pickle, then a squirt of ketchup, then a napkin, then finally — triumphantly — the burger, long after you stopped being hungry.

The fix is a barrier plus bookkeeping: put a `JoinNode` after the parallel `RemoteA2aAgent` branches, attach an `after_agent_callback` that copies each result into `state[*_findings]`, and synthesise exactly once.

Two more lab landmines worth stealing:

- **Embedding parity.** The BigQuery agent searched with 768-dimensional `text-embedding-004` vectors. Mix dimensions and cosine similarity becomes astrology.
- **Identity forwarding.** If `user_id` is not forwarded over A2A metadata, Vertex AI Memory Bank silently falls back to an ephemeral `A2A_USER_{context_id}` and forgets the user between sessions.

And the classic laptop-versus-cloud trap: the agent worked locally because it was quietly piggybacking on a personal login, then threw `403` in the cloud until the service account got its own IAM badge. Local success is not a deployment strategy.

### Lab 2: Trenchcoat Agents, SPIFFE Badges, and the `.env` Doormat

Lab 2 is the security lab, and it starts with a stranger in a trenchcoat holding a sign that says *"I'm the Security Agent, trust me bro."* That is a **self-attested card**, and it should never be enough.

The fix is two-tier discovery plus signatures. The public `/.well-known/agent-card.json` exposes basic metadata only; the full schema requires a Bearer token at `/agent/authenticatedExtendedCard`. Cards are signed with JWS (`RS256`) and verified against an **out-of-band enterprise JWKS trust anchor**, so an agent cannot simply vouch for itself. Cards carry `provenance.skillDigests` so you can tie a live agent back to the exact skill revisions it is running.

Then the part that deletes an entire class of incidents: killing the `.env` file.

Hardcoded `GITHUB_PERSONAL_ACCESS_TOKEN` and `SALESFORCE_CLIENT_SECRET` values leak to anyone who can read config, and rotating them means redeploying. Instead:

- Agent Runtime authenticates with a **SPIFFE principal**, something like `principal://agents.global.org-.../reasoningEngines/ID` plus a `header_provider`.
- Cloud Run uses its service account, with `AuthenticatedFunctionTool` handling 2LO OAuth.
- `.env` keeps only `*_AUTH_PROVIDER_URI` pointers. Tokens resolve at tool-call time via `GcpAuthProviderScheme`.

Rotate credentials in Auth Manager with zero agent redeploys. And, being a QE at heart, test the boundary matrix: missing `roles/agentidentity.user`, missing the `principal://` prefix, anonymous access trying to read the extended card.

### AlphaEvolve: The Evaluator Is the Product

Day One closed with DeepMind's AlphaEvolve, and this is the part that should make every test engineer sit up straight.

The loop is evolutionary: sample prompts, generate candidate code mutations with Gemini Flash for breadth and Pro for depth, score each candidate with an automated **Evaluator** pool, and keep the winners in a program database organised as islands or MAP-Elites. Only the non-convex bottleneck gets tagged `#EVOLVE-BLOCKS`; the harness stays fixed.

The reported wins are absurd: **0.7%** of Google's worldwide Borg compute recovered, Gemini kernels sped up **23%**, FlashAttention up **32.5%**, and Strassen's 1969 `4×4` matrix multiplication record beaten with **48** multiplications instead of 49.

None of that works without a fast, deterministic, uncheatable scoring function. Which means the headline is not "AI writes code now". The headline is:

> Evaluator design is the product.

In this era, QEs do not get replaced by coding agents. QEs write the fitness functions that steer coding agents. Practical notes from the module: negate minimisation metrics (`score = -latency`) so every objective is monotonically maximising, and never let the evolving code touch the harness that grades it.

### What Day One Actually Changed

Six things I am keeping, in the order I would defend them:

1. **Every tool-using agent gets hooks before it gets features.** `pre_tool_call` is not an optimisation, it is the difference between a demo and a deployable system.
2. **Skills over prompts.** Small `skill.md` files, real scripts, pinned digests. If a step is deterministic, do not ask the model to remember it.
3. **`/grill-me` before `/plan`.** Interrogate the requirement until the lemons are gone.
4. **Event sourcing for anything an auditor might ask about.** If you cannot replay turn 1,000, you do not have a system, you have a rumour.
5. **Trace from the first click.** One `traceparent`, injected per test, mirrored into task metadata.
6. **Write the evaluator first.** Whatever the agent is supposed to improve, define the uncheatable score before you let it mutate anything.

The awkward part is that none of this is really "AI engineering". It is distributed systems hygiene with a marketing layer: idempotency, barriers, identity, tracing, append-only logs, and fixtures. The model is the only new thing, and it is the least trustworthy component in the stack.

Which is exactly why you wrap it in padlocks.

### Numbers, All In One Place

| Metric | Value |
| --- | --- |
| Monolithic prompt (90 skills) | ~180,000 tokens per turn |
| Registry base prompt | ~300 tokens |
| Attack vectors mapped to hooks | 8 |
| A2A task states | 6 |
| HITL approval threshold in the lab | $5,000 |
| AlphaEvolve compute recovered | 0.7% of Google's Borg fleet |
| FlashAttention speedup | 32.5% |
| Strassen 4×4 record | 48 vs 49 multiplications |
| Part 1 / Part 2 runtime | 3:55 / 3:52 |

### Watch and Listen

- **Part 1 — Padlocks, flat-pack skills, `/grill-me`, event sourcing, three bouncers:** [watch](https://www.youtube.com/watch?v=ean_pqrlnA0) · [listen](https://audio.relearn.ing/entry-065-part1.mp3)
- **Part 2 — MCP versus A2A, the two gotchas, the $5,000 pause, tracing, both labs:** [watch](https://www.youtube.com/watch?v=2_t66Yi0C54) · [listen](https://audio.relearn.ing/entry-065-part2.mp3)

_The build pipeline behind the two videos — vector economics, TTS prosody, CTC alignment, cue pacing — gets its own entry._

**Full article at relearn.ing:** https://relearn.ing/journal/entry-065/
