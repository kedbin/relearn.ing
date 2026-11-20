---
title: "One Pi Session, Many Machines: Termux as My Control Center"
date: "2026-11-20"
summary: "Pi in Termux keeps the context and approvals. It hands scoped tasks to named agents on other machines, and they report back over Herdr Core. Verified on a Windows laptop; direct Linux VPS agents are next."
status: "Published"
category: "AI Engineering / Agent Platforms"
highlights:
  - "Hand a named agent a scoped task and a reply route instead of driving its shell from the phone."
  - "The agent works in its own checkout and reports a verdict, checks, blockers and a report path."
  - "Verified on a Windows laptop, including a small callback test. Linux VPS agents are proposed."
publish_social: false
linkedin: |
  One Pi Session, Many Machines: Termux as My Control Center
  
  Full article:
  
  https://relearn.ing/journal/entry-069/
threads: |
  One Pi Session, Many Machines: Termux as My Control Center
  
  relearn.ing/journal/entry-069/
draft: false
---

I used to open a separate SSH app, find the right machine, find the right checkout, and bring another agent up to speed. None of that was the work. It was the price of getting back to the work.

My first fix was to drive the other machine's shell from Pi on my phone. That got commands there, but it put the phone in charge of every step. The version I kept is different: Pi on the phone keeps the conversation and hands the job to an agent that lives where the code is.

## Who owns what

**Pi in Termux** owns the context and the approvals. It decides what should happen, writes the task, and is the one I talk to.

**[Herdr Core](https://herdr.dev/core/)** (\`hc\`) connects the machines. Each one runs a core, and the phone's core reaches the others over Tailscale SSH with host keys verified. It starts terminals, sends text into them, and reads their screens.

**A named agent on the target** does the work. On the laptop that's an interactive Pi session with its own checkout, its own tools and its own credentials. It gets a scoped task, runs everything locally, and reports back.

```text
Termux Pi — context and approvals
  ├─ ⇄ Windows laptop agent (verified)
  └─ ⇄ Linux VPS agent (proposed; direct, not via Windows)

Both routes: Herdr Core over Tailscale SSH
  Outbound: scoped task and reply route
  Inbound: verdict, checks, blockers, and report path
```

## One hand-off, start to finish

1. **Assign.** Pi in Termux launches a named agent on the target, or reuses one, and sends it a brief: the files it owns, the files it must not touch, the checks to run, where to write its report, and how to reply.
2. **Work locally.** The agent reads the brief and edits in its own checkout. It runs its tests and browser checks with the tools installed on that machine, then writes a report file.
3. **Report back.** The agent sends a short message to its parent: verdict, checks run, blockers, and the report path. It doesn't need to be told the address. It asks its own core for its terminal's \`parent\` field and sends to exactly that.

The report arrives as a new message in the Termux session. There is no \`hc receive\` command and nothing to poll. \`hc send\` types text into a terminal, so a reply is just the child agent typing into its parent.

## Why not drive the shell remotely

Remote-shell orchestration keeps every decision on the phone. Pi would have to know the laptop's paths and quirks, stream every command over the link, and rebuild context whenever the connection dropped. A long build would tie up the phone's session.

An agent on the target already has the checkout, the toolchain and a browser. Giving it a scoped task means only two short messages cross the link, the brief and the report. The phone can wait for the report without supervising each step.

One-shot SSH is still useful. When I want a Git status or to check whether a machine is awake, a single \`ssh\` command is quicker than starting an agent. It's a diagnostic, not the way work gets handed off.

## What actually worked

From Pi in Termux, Herdr Core reached the Windows laptop over Tailscale SSH. It launched a named Pi agent there, sent it text, and read its screen back. I didn't need a second checkout on the phone.

The reply route took one more test. A scratch agent on the laptop looked up its own parent from its core, sent a token to that address, and the token appeared in the Termux session. That's a small callback test on one laptop. It doesn't cover a Linux VPS, a laptop that sleeps mid-task, or recovery after a crash.

Previews are a separate path. The laptop's dev server reaches the phone's browser through its own HTTP tunnel over SSH. Herdr Core carries messages between agents, not web traffic.

## When the reply route is down

Networks drop and laptops sleep. Each brief therefore names a report file, and the agent writes it before it tries to reply. If \`hc send\` fails, the work is still on disk with its verdict, checks and limitations. Pi can read the file on the next pass, and the agent can include the send error in its final screen.

Name the target and the working directory in every brief. Report an unreachable machine instead of quietly running the job on the phone. A sleeping laptop is still a sleeping laptop.

## Next: one VPS agent, not a fleet

The Windows path is verified. Next I'll add one Linux VPS as a direct target, reached from Termux without going through the laptop. Then I'll start a named agent there, give it a small read-only task, and see whether its report comes back on the same route. I'd keep it to one VPS until I can see what actually needs to be shared.

The test isn't how many machines I can connect. It's whether I can change where a task runs without having to reconstruct what I was doing.
