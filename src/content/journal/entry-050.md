---
title: "The Switchboard: Why Tmux Became the Local Control Plane"
date: "2026-04-02"
summary: "Worktrees solved the first multi-agent problem: isolated filesystems. The next problems showed up one layer lower. Recursive spawn limits, PTY collisions, and long-running validation loops pushed orchestration out of the harness and into tmux, where sessions became durable execution lanes and the terminal became the local switchboard."
status: "Published"
category: "Relearn Engineering / AI Engineering"
highlights:
  - "Lower Control Plane: Worktrees isolate code state, but tmux isolates execution lanes and gives the orchestrator a durable way to route, inspect, and recover long-running agent sessions (tmux, 2026)."
  - "Harness Ceilings: Multi-agent coding breaks not just on repository state, but on subagent spawn limits, context drag, and restricted tool ownership inside vendor harnesses (Anthropic, 2025; Osmani, 2026)."
  - "Callback-First Coordination: For TUI-heavy coding tools, the safer pattern is explicit worker callbacks back to the main lane, with pane capture used for logs and verification rather than as the primary coordination channel (tmux, 2026)."
  - "Throughput Still Needs Judgment: More lanes increase speed, but the real leverage still comes from routing, review, and killing bad paths early rather than trusting raw generation alone (Osmani, 2026; Anthropic, 2025)."
audioUrl: "https://audio.relearn.ing/entry-050.mp3"
linkedin_video_urn: "urn:li:digitalmediaAsset:D4E05AQFHbLu59G3H2g"
publish_social: true
linkedin: |
  Most people stop at worktrees.

  But once you run multiple coding agents, the next failure is not Git.
  It is terminal ownership and orchestration.

  The pattern I keep seeing now is:

  -> worktrees isolate code state
  -> tmux isolates execution lanes
  -> each worker reports back to the main lane with short status updates
  -> `capture-pane` is used for logs, not as the primary source of truth for TUI tools
  -> reviewer lanes and quality gates stop speed from becoming noise

  This matters because tools like OpenCode and Gemini CLI are useful inside a bounded session, but they do not give you dependable nested subagents as a local control-plane primitive.

  So engineers push orchestration one layer lower.

  One main lane.
  One writer lane.
  One review lane.
  Workers callback `READY`, `BLOCKED`, and `DONE`.

  If worktrees give agents separate rooms, tmux gives you the switchboard.

  This is where AI coding starts to feel less like one chat and more like operating a small factory.

  Full write-up on relearn.ing:

  https://relearn.ing/journal/entry-050/
threads: |
  Worktrees solve the code-state problem.
  tmux solves the control-plane problem.

  Once you run multiple agents, the next bottleneck is lower:
  one harness, one PTY, too many execution loops.

  Better pattern:
  one main lane
  one writer lane
  one review lane
  worker callbacks back to main
  pane capture only for logs

  If worktrees give agents separate rooms, tmux gives you the switchboard.

  relearn.ing/journal/entry-050/
---

The terminal jammed at the worst possible moment. One agent was halfway through a refactor. Another needed a clean build. A hotfix had just landed. The model was not the problem. The repository was not even the problem anymore. Worktrees had already fixed that. The failure showed up one layer lower: one interactive harness, one PTY, and too many execution loops fighting over the same pipe.

That is the part of agentic engineering I think matters now. Worktrees solved the filesystem boundary. They gave each worker its own room. But once teams started trying to run real parallel workflows, the next bottleneck was not Git state. It was execution control. Sessions needed to stay alive. Terminals needed to stop colliding. Orchestrators needed a way to dispatch, inspect, retry, and kill work without waiting for the vendor harness to grow a real scheduler.

This is where `tmux` stopped being a power-user trick and became infrastructure.

### After the Worktree Comes the Harness

Entry 049 was about why worktrees matter. I still believe that argument. The expensive part of branch hopping in AI workflows is not checkout time. It is context destruction. Anthropic's work on context engineering makes the reason clear: model performance depends on preserving a clean, stable working set [2]. When you mutate the filesystem underneath a long-running agent, you are not just moving files. You are invalidating its local model of the task.

Worktrees fixed that by giving each agent an isolated directory with shared history [1]. But they did not solve the next class of problems. They did not tell you how to run five agents without terminal collisions. They did not tell you how to keep a long-running build alive when you close the laptop lid. They did not give an external orchestrator a durable way to inject work, inspect output, or route retries.

That is why the second half of the stack matters so much.

### The Harness Becomes the Bottleneck

This is the part most demos glide over. Vendor harnesses are good at one supervised loop with a main agent and a small number of bounded helpers. They are not operating systems.

Three problems show up fast.

First, there is the **context trap**. Long multi-phase chains accumulate logs, plans, detours, and local assumptions until the context window stops being a brief and starts being a landfill. The issue is not that the model suddenly becomes stupid. The issue is that the chain gets noisier as it gets longer.

Second, there are **subagent limits**. Harness designers impose those intentionally, and for good reason. Recursive fan-out is expensive, dangerous, and easy to lose control of. But the tradeoff is real: the moment you want one agent to behave like a project manager spawning a team, you often hit a product boundary instead of a technical one.

In practice, this is where local coding harnesses such as OpenCode and Gemini CLI show their ceiling. They are useful inside a bounded session, but they do not give you nested subagents as a dependable local primitive for building a real hierarchy of workers. That is one reason the tmux pattern has been adopted so aggressively: instead of waiting for the harness to become a recursive scheduler, engineers spin up separate top-level lanes and route work across them externally.

Third, there is the **PTY problem**. One interactive terminal is still one interactive terminal. If an agent owns stdin and stdout while another process wants to ask a question, stream logs, or wait for confirmation, the shell does not become collaborative. It becomes contested. Prompts overlap. Buffers jam. Long-running validation floods the only screen that both the human and the agent are trying to use.

That is the deeper pattern. Worktrees solved state isolation. The harness still owns execution in a way that does not scale cleanly to a swarm.

### `tmux` as the Switchboard

`tmux` matters because it drops the control plane down a layer [4]. Instead of asking the LLM app to become a scheduler, you let the operating system handle lanes, lifecycles, and terminal ownership.

Each pane becomes a separately addressable execution lane with its own PTY, scrollback, and lifecycle. The agent no longer depends on a visible window sitting on the developer's screen. It can run detached, survive terminal closures, and be inspected later without tearing down the process itself.

That sounds like a tooling detail. It is actually an architectural inversion.

Once an external orchestrator can target individual panes, inject work, and read back results, the terminal stops being a display surface and starts behaving like an IPC bridge. `send-keys` pushes work into a specific lane. `capture-pane` can read logs or visible state back out. But that is only half the pattern.

For TUI-heavy coding tools, blind pane scraping is a weak primary coordination method. The pane is optimized for interaction, not for machine-readable status. In practice, the more reliable pattern is callback-first: each spawned worker sends short updates back to the main lane via terminal text injection such as `send-text` or equivalent terminal IPC. Instead of forcing the supervisor to infer meaning from a busy screen, the worker reports `READY`, `BLOCKED`, or `DONE` directly and includes the useful summary in the callback itself.

A shell script, daemon, or supervisor can then route tasks across many top-level sessions without needing the harness itself to support recursive orchestration internally.

This is why the terminal multiplexer has become the practical local control plane. It is deterministic where the model is probabilistic. It is durable where the chat session is fragile. And it does not care whether the pane is running a developer agent, a reviewer, a test loop, or a bisect lane. It only cares about isolating execution cleanly.

### The Review Loop Gets Cleaner

Once you have separate execution lanes, a different pattern becomes possible.

One pane writes code. Another runs tests. Another captures logs. Another acts as a reviewer. Failures no longer have to flood the writer's context directly. The orchestrator can capture failing output when needed, but the cleaner coordination path is to have workers proactively callback concise status summaries into the main lane. That keeps the coding lane focused and prevents every compiler scream from becoming permanent cognitive residue.

This is also what makes recursive validation loops practical. You can keep the executor and the evaluator separated. The writing lane stays narrow. The checking lanes do the noisy work. The human supervises joins and escalation points rather than babysitting every shell process manually.

That separation is easy to underestimate. It is one thing to ask an agent to write code. It is another to give the system a durable, replayable, inspectable place to keep doing work while other lanes continue in parallel.

### Warm Slots Make It Operational

This stack still fails if every new lane requires ten minutes of setup. In large monorepos, the actual bottleneck is usually not `git worktree add`. It is environment hydration. New directories are cheap. Rebuilding the world is not.

That is why serious systems evolve toward warm slots: pre-provisioned worktrees, dependencies already installed, ports routed deterministically, and clean states ready to be recycled. `tmux` gives those slots a durable runtime. Worktrees give them isolated code state. Together they let orchestration feel operational instead of ceremonial.

The maturity curve looks roughly like this:

- first isolate the code
- then isolate the execution lane
- then pre-warm the expensive environment

Most teams stop after step one and think they have solved parallelism. They have not. They have only solved the first boundary.

### A Setup You Can Try This Week

The good news is that you do not need a 30-agent factory to benefit from this. A simple setup already solves a real problem.

If your current workflow looks like this:

- one terminal
- one coding agent
- one long-running task that blocks everything else

then the problem tmux solves is straightforward: it gives you durable, separately addressable lanes so your writer, tester, and reviewer do not all fight over the same session.

A minimal version looks like this:

1. Keep one main worktree for the task you care about most.
2. Add one secondary worktree for an agent lane.
3. Start one tmux session with named windows like `human`, `writer`, and `review`.
4. Run the coding agent in `writer`.
5. Run builds, tests, or logs in `review`.
6. Keep `human` clean for supervision, hotfixes, and routing.
7. Have `writer` and `review` callback short status lines to `human` instead of relying only on pane scraping.

The core commands are simple:

```bash
git worktree add ../agent-slot -b entry-050-agent
tmux new -s control
tmux rename-window -t control:0 human
tmux new-window -t control -n writer
tmux new-window -t control -n review
tmux send-keys -t control:writer "opencode" C-m
tmux send-keys -t control:review "npm test" C-m
tmux capture-pane -pt control:review
```

For TUI coding tools, treat pane capture as secondary. The stronger pattern is explicit callbacks back to the supervisor lane, for example:

```text
WRITER READY prompt loaded
WRITER BLOCKED waiting on failing test output
REVIEW DONE tests passing on slot-2
```

You do not need to automate everything on day one. The benefit shows up immediately:

- the coding lane stays focused instead of drowning in test logs
- long-running tasks survive even if you detach from the terminal
- reviews and validations can run in parallel instead of serially
- you stop destroying one active thread of work just to inspect another

That is the practical threshold. Once you feel the difference with three lanes, the larger control-plane patterns start making intuitive sense.

### From Chat Assistant to Local Factory

Once you see the full pattern, the job description changes. You are no longer pairing with one brilliant assistant in one chat thread. You are operating a local factory.

One lane explores. One lane builds. One lane reviews. One lane watches. One lane validates. The human's leverage moves upward: routing, contracts, quality gates, and deciding which paths get to survive.

That is why tmux matters so much in this moment. It is not glamorous. It is not model magic. It is the mundane piece of systems plumbing that gives the rest of the workflow somewhere to stand.

Addy Osmani's orchestration framing points at the same thing from the software side [3]. The scarce resource is no longer generation. It is coordination and verification. The terminal multiplexer is valuable because it gives coordination a durable home.

If worktrees give agents separate rooms, tmux gives you the switchboard.


When the harness becomes the bottleneck, the winning move is not a bigger prompt. It is a lower control plane.

### References

[1] Git. (2026). "git-worktree Documentation." https://git-scm.com/docs/git-worktree

[2] Anthropic. (2025). "Effective context engineering for AI agents." https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

[3] Osmani, A. (2026). "The Code Agent Orchestra - what makes multi-agent coding work." https://addyosmani.com/blog/code-agent-orchestra/

[4] tmux. (2026). "tmux Manual Page." https://man7.org/linux/man-pages/man1/tmux.1.html
