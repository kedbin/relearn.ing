---
title: "The Excel Script That Beat My Agent Architecture"
date: "2026-04-07"
summary: "I spent days designing a Power Apps and Teams workflow for HR before learning their real weekly pain was thirty minutes of spreadsheet formatting, not the two-minute announcement. In 2026 AI engineering, that mistake scales into agentic over-design unless we validate the bottleneck before we architect the solution."
status: "Published"
linkedin_video_urn: "urn:li:video:D4E10AQHm9M6lyGkWLQ"
category: "Relearn Engineering / AI Engineering"
highlights:
  - "The visible workflow is not always the expensive workflow: in this case the real bottleneck was thirty minutes of Excel formatting, so the right fix was a deterministic script rather than broader announcement automation (personal experience, 2026)."
  - "Ash Maurya's customer-discovery advice still maps cleanly to AI engineering: measure what people actually did and where the pain actually lived before building the solution you want to build (Maurya, 2024a; Maurya, 2024b)."
  - "Anthropic and OpenAI both converge on the same 2026 design rule: start with the simplest workable system, use workflows for predictable tasks, and reserve agents for ambiguous, open-ended work (Anthropic, 2024; OpenAI, 2025)."
  - "Thoughtworks' agentwashing critique is useful inside engineering teams too: probabilistic systems can entrench bad processes, add cognitive load, and automate the wrong thing faster when discovery is weak (Thoughtworks, 2025)."
publish_social: false
linkedin: |
  I once spent days designing an automation for a task that only took 2 minutes.
  
  I had volunteered to help HR with a weekly workflow: upload the open roles and announce them to the company.
  
  In my head, the solution was already built:
  -> Power Apps
  -> Teams automation
  -> recurring workflow orchestration
  -> maybe later, an agentic layer on top
  
  Then I finally talked to HR.
  
  That is when I learned I had been solving the wrong problem.
  
  Posting the announcement took them about 2 minutes.
  Formatting the Excel sheet beforehand took them 30.
  
  I had optimized the visible step, not the painful step.
  
  The right solution was not a bigger workflow.
  It was a small Excel script.
  
  That mistake gave me one of the most useful lessons I carry into my AI workflow now:
  do not start with the most impressive architecture.
  Start with the real bottleneck.
  
  That changes how I build today:
  -> if the work is structured and repeatable, I want a script
  -> if the path is known, I want a workflow
  -> only when the ambiguity is real do I want an agent
  
  The question I trust now is not:
  “Can I build something more agentic for this?”
  
  It is:
  “Where is the actual friction, and what is the smallest thing that removes it?”
  
  That one HR conversation saved me from repeating the same mistake in AI with more expensive tools.
  
  Full draft:
  
  https://relearn.ing/journal/entry-055/
threads: |
  I volunteered to help HR automate a weekly workflow and instantly designed the wrong thing.
  
  I focused on the announcement.
  HR's real pain was the spreadsheet formatting before the announcement.
  
  Posting: 2 minutes.
  Formatting: 30 minutes.
  
  The right solution was not an agent.
  It was an Excel script.
  
  That feels like the most important 2026 AI lesson:
  start with the bottleneck,
  not the architecture.
  
  relearn.ing/journal/entry-055/
audioUrl: "https://audio.relearn.ing/entry-055.mp3"
---

I volunteered to help HR with a weekly recurring workflow: upload the open roles, then announce them to the company.

The moment I heard that description, I did what a lot of engineers do in 2026. I skipped straight to architecture.

In my head, the solution was already obvious. Power Apps could capture the upload. Teams could broadcast the announcement. A tidy automation layer could connect the whole thing. If I wanted to keep going, I could even imagine agentic extensions later: intake classification, content cleanup, routing, maybe some light review logic.

So I spent days looking at the implementation before I talked to HR.

When I finally showed up with the solution in hand, I found out I had optimized the wrong thing.

Posting the announcement took them about two minutes.

Formatting the Excel sheet beforehand took them thirty.

The real bottleneck was not the visible workflow I had fallen in love with. It was the unglamorous prep step sitting upstream. The right solution was not a broad Power Apps or Teams automation chain. It was a small Excel script.

That moment has stayed with me because it explains a huge amount of what is going wrong in AI engineering right now.

### This Was Not an Automation Failure. It Was a Discovery Failure.

The most important mistake I made was not choosing the wrong tool. It was choosing a solution before validating the actual pain.

That is an old software problem wearing new clothes. Requirements drift, assumptions decay, and early descriptions of work are often only surface descriptions of work. As Charles R. Martin put it, requirements volatility is the core problem of software engineering because the environment changes and the real need keeps moving under the team's feet [7]. In my HR example, the requirement had not even changed yet; I had simply inferred the wrong one.

The announcement step was visible, repeatable, and easy to imagine automating. The formatting step was mundane, local, and easy to ignore. But visible is not the same thing as expensive. The costly step was the one I had not asked enough questions about.

That is why this was a discovery failure before it was ever an engineering failure.

### Running Lean Still Hits Hard in the Agentic Era

Ash Maurya's core lesson still feels brutally current here: stay attached to the problem, not your first solution. His more recent discovery guidance makes the principle even sharper. Measure what customers did in the past, not what they say they might do in the future, and use interviews to uncover the real workflow, not just your favorite narrative about it [1][2].

If I had followed that discipline, I would have learned one crucial operational fact much earlier: HR was not losing time on distribution. They were losing time on data preparation.

Maurya also argues that quality of interviews matters more than ritualized quantity; sometimes ten to twenty good conversations beat a hundred shallow ones [1][2]. The broader point is not the exact number. It is that good discovery narrows the search space quickly. One grounded conversation with the person doing the work can save days of speculative architecture.

Marty Cagan adds an important nuance to this discussion. Product work is not about putting product people in the problem space and engineers in the solution space as if those were separate departments [3]. Strong teams discover the right solution together. I think that correction matters in AI too. This essay is not arguing for endless interviews with no implementation. It is arguing for sequencing: validate the actual pain first, then explore the best technical shape together.

### The 2026 Agentic Trap: Capability Creates Solution Gravity

The reason this mistake feels bigger in 2026 is that the tooling is so powerful now.

It is easier than ever to imagine sophisticated systems: orchestrators, worker agents, memory layers, tool gateways, observability, human approval loops, browser automation, and enterprise chat integration. Once those capabilities are sitting on the table, the engineer's imagination starts bending the problem around them.

Anthropic's guidance is one of the clearest antidotes I have read. Their advice is to start with the simplest solution possible and add complexity only when it demonstrably improves outcomes. They draw a clean distinction between **workflows**, where LLMs and tools follow predefined code paths, and **agents**, where the model dynamically directs its own process and tool use [4].

OpenAI lands in nearly the same place. Agents make sense for complex decision-making, difficult-to-maintain rules, and unstructured data. Otherwise, a deterministic solution may suffice [5].

That is the whole lesson from my HR story.

Nothing about that workflow demanded open-ended reasoning. The inputs were structured. The job repeated weekly. The transformation rules were knowable. The cost of being wrong was unnecessary friction, not unresolved ambiguity. This was script territory.

And that is exactly why it mattered.

The danger in the current AI cycle is not that teams lack the ability to build agentic systems. It is that teams can now justify agentic systems too easily.

### Agent Washing Does Not Only Happen in Vendor Decks

Thoughtworks' critique of "agentwashing" is valuable because it does not just attack marketing language. It names a real engineering failure mode: using probabilistic tools for deterministic problems, paving cow paths, creating useless agent loops, and adding cognitive load where simpler systems would work better [6].

Most people hear that warning and think about vendors relabeling old automation products as "agents." That definitely happens.

But teams can do a quieter version of the same thing to themselves.

We see a workflow.
We imagine the most technically interesting version of it.
We frame the problem in a way that makes the interesting architecture feel necessary.

Then we call that innovation.

That was my mistake with HR. I had turned a local spreadsheet pain into an orchestration story because orchestration was the part that matched my mental model of modern automation.

The real work, meanwhile, was still trapped in a spreadsheet.

### The Better Pattern: Deterministic by Default, Agentic on Purpose

I do not think the right lesson is "never use agents." That would be as naive as my first instinct in the opposite direction.

Agents are useful when the workflow genuinely contains ambiguity:

- open-ended research across changing sources,
- decisions that depend on messy unstructured inputs,
- exception-heavy processes that are painful to encode as brittle rules,
- or long-horizon tasks where the number of steps cannot be predicted in advance [4][5].

But most business operations are not like that all the way through.

Most have a boring core that benefits from boring reliability.

That is why the strongest 2026 pattern is usually hybrid: keep the outer workflow deterministic and auditable, then insert AI only where the work actually becomes fuzzy enough to justify probabilistic reasoning. If the entire system can be solved with a script, macro, API integration, or scheduler, do that first.

The pragmatic question is not whether AI can participate. It is where AI is actually required.

### The Rule I Took From This

That HR conversation changed the way I now evaluate automation ideas. Before I ask what architecture fits, I ask five simpler questions:

1. **Where is the actual time loss?**
2. **Which step is structured, and which step is genuinely ambiguous?**
3. **What does the person doing the work complain about, specifically?**
4. **What is the smallest deterministic fix that would materially reduce the pain?**
5. **Only after that: where would an agent improve the result enough to justify the cost and uncertainty?**

That ordering matters more now than ever.

Because in the current tooling climate, the fastest way to build the wrong thing is to start from what the platform can do instead of what the workflow actually needs.

### The Pragmatic Agent

The lesson from that HR workflow was not that Power Apps is bad, or Teams is bad, or agents are bad.

The lesson was that sophisticated automation is only useful after you have earned the right to automate.

In 2026, the pragmatic engineer still starts the same way good product builders always did: talk to the people doing the work, locate the thirty-minute drag, price the pain, and then choose the smallest system that removes it.

Sometimes that system will be an agent.
Sometimes it will be a workflow.
Sometimes it will be an Excel script.

If you skip that order, intelligence just becomes a more expensive way to solve the wrong problem.

### References

[1] Maurya, A. (2024, May 31). *Prospecting Recipes for Conducting Problem Discovery Interviews*. LEANFoundry. https://www.leanfoundry.com/articles/prospecting-recipes-for-conducting-problem-discovery-interviews

[2] Maurya, A. (2024, May 31). *3 Common Customer Interviewing Mistakes*. LEANFoundry. https://www.leanfoundry.com/articles/3-common-customer-interviewing-mistakes

[3] Cagan, M. (2020, September 4). *Discovery – Problem vs. Solution*. Silicon Valley Product Group. https://www.svpg.com/discovery-problem-vs-solution/

[4] Anthropic. (2024, December 19). *Building effective agents*. https://www.anthropic.com/research/building-effective-agents

[5] OpenAI. (2025). *A practical guide to building agents*. https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/

[6] Xiong, Z. (2025, July 17). *The dangers of AI "agentwashing"*. Thoughtworks. https://www.thoughtworks.com/en-us/insights/blog/generative-ai/Agentwashing-and-how-AI-agents-fail-us

[7] Martin, C. R. (2020, February 20). *Requirements volatility is the core problem of software engineering*. Stack Overflow Blog. https://stackoverflow.blog/2020/02/20/requirements-volatility-is-the-core-problem-of-software-engineering/
