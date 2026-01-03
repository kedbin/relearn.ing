---
title: "Relearning Flow: The Open-Source Content Pipeline"
date: "2026-01-03"
description: "A public repository of scrubbed OpenCode skills and agents that power the relearn.ing content creation pipeline. From idea to published audio in one conversation."
repoUrl: "https://github.com/kedbin/relearning-flow"
demoUrl: "https://youtube.com/shorts/iHz7Bp5lUJs"
techStack: ["OpenCode", "Chatterbox TTS", "Markdown", "Python"]
audioUrl: "/audio/relearning-flow.mp3"
---

## The Objective

Open-source the **cognitive infrastructure** behind relearn.ing's content pipeline. Every journal entry on this site flows through a chain of AI skills and agents—from raw idea to researched draft to voice-cloned audio. This repository exposes that machinery for anyone to fork, modify, and deploy.

The goal: demonstrate that sophisticated content automation is **accessible**. Not a SaaS product. Not a black box. Just markdown files teaching an AI how to think.

## The Philosophy: Externalizing the Editorial Brain

Traditional content creation:
1. Research the topic
2. Write the draft
3. Edit for tone and accuracy
4. Record audio (or hire someone)
5. Deploy and publish
6. Repeat from scratch next time

With the relearning flow:
1. Describe your idea
2. AI researches, drafts, and fact-checks
3. Review and approve
4. Audio generates automatically
5. Deploys with one command
6. The pipeline remembers everything

Each skill is a **compiled editorial decision**. The voice guidelines, the structure requirements, the citation standards—all encoded once, executed infinitely. This is **cognitive leverage through automation**.

## Implementation: The Skill Chain

The pipeline operates as a directed graph of specialized tools:

### Stage 1: Content Creation (relearning-content skill)

The orchestrator. When triggered, it:
- Syncs the repository
- Delegates research and drafting to the google-search agent
- Reviews output against relearn.ing voice standards
- Iterates until the draft matches the site's engineering philosophy
- Saves the finalized entry

The key insight: **the main agent is a reviewer, not a writer**. Delegation creates specialization.

### Stage 2: Script Condensation (create-script skill)

Raw journal entries are too verbose for audio. This skill:
- Condenses content by approximately 50%
- Adds paralinguistic tags ([chuckle], [sigh], [pause])
- Preserves meaning while optimizing for speech rhythm
- Outputs a .txt file ready for TTS

This is **format translation**—same information, different medium.

### Stage 3: Voice Generation (voiceover skill)

The final transformation. Uses Chatterbox TTS to:
- Generate voice-cloned audio from the script
- Deploy the MP3 to the content server
- Push changes to git
- Notify when complete

Fire and forget. The human's job ends at approval.

## Engineering Decisions

**Why OpenCode as the Orchestrator?** The friction in content publishing isn't writing—it's everything around it. File naming conventions, frontmatter schemas, repository syncing, audio encoding, deployment commands. OpenCode eliminates this by holding the entire workflow in context. One conversation takes you from idea to published article with audio. No context-switching between tools.

**Why Encode Workflow as Skills?** Every manual step is a chance to drop the thread. "Wait, what's the entry number?" "Did I run the TTS script?" "Which branch am I on?" Skills **externalize working memory**. The AI tracks state so you don't have to. The cognitive load of publishing drops to near zero.

**Why Chain Skills Instead of One Monolith?** Each skill does one thing well. Content creation doesn't know about audio. Audio generation doesn't know about research. This separation means you can **swap components**—use a different TTS engine, change your content structure, add a new deployment target—without rewriting the whole pipeline.

**Why Fire-and-Forget for Audio?** Voice generation takes minutes. Blocking the conversation while it runs wastes human attention. The voiceover skill launches in background, handles deployment, pushes to git, and notifies on completion. You're free to start the next task immediately. **Async by default.**

## What is Included

### Skills

- **relearning-content**: The journal entry creator with full workflow documentation
- **create-script**: LLM condensation with paralinguistic markup
- **voiceover**: Chatterbox TTS generation and deployment automation

### Agents

- **google-search**: Research subagent for fact-checking and citation gathering

### Documentation

- **ARCHITECTURE.md**: Visual workflow diagrams showing how the pieces connect

## The Meta-Lesson

This repository is itself a relearn.ing artifact—a demonstration that **the best systems are the ones you can give away**.

The skills encode hundreds of hours of iteration: which prompts work, which structures stick, which workflows scale. Keeping that locked up creates no additional value. Releasing it creates leverage for everyone who builds on top.

**Stop hoarding process. Start distributing infrastructure.**
