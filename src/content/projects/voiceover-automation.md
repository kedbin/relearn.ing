---
title: "Voiceover Automation: Extending Reach Through Voice Cloning"
date: "2025-12-24"
description: "A skill-based pipeline for transforming written content into narrated audio. Built to make ideas more accessible."
repoUrl: "https://github.com/kedbin/chatterbox-skills"
techStack: ["Python", "OpenCode", "Chatterbox TTS"]
---

## The Objective

Make written content **listenable**. Journals, essays, technical notes—all locked behind the requirement to sit and read. Voice cloning removes that barrier.

This extends the [OpenCode Skills](/projects/opencode-skills) philosophy into a new medium: audio.

## Why Voice Cloning?

Written content has reach. Spoken content has **presence**.

But recording voiceovers is friction-heavy: microphone setup, multiple takes, editing, exporting. The overhead kills momentum. Voice cloning eliminates this entirely—the AI handles production while I focus on ideas.

The deeper reason: **accessibility**. Not everyone can read long-form content. Some prefer audio while commuting, cooking, or resting their eyes. Voice cloning turns every journal entry into a podcast episode without the production cost.

This is AI leverage applied to distribution—extending the reach of ideas beyond those who have time to read.

## Why Chatterbox?

Open-source, runs locally, clones from a single voice sample. No cloud dependencies, no API costs, no data leaving the machine.

Most importantly: it supports paralinguistic tags (`[laugh]`, `[chuckle]`, `[sigh]`). This enables expressive narration—not robotic text-to-speech, but something that sounds human.

## Current Use

Two OpenCode skills handle the workflow:

1. **Create Script** — Transforms raw content into voiceover-ready text. Preserves acronyms, adapts written prose for natural speech, and identifies moments for expression.

2. **Voiceover** — Executes the TTS pipeline. Points at a script, outputs a WAV file named to match the source.

The result: content to audio in one command.

## Future Directions

- **Multi-language narration** — Clone the voice, generate in other languages. Same presence, wider reach.
- **Embedded audio on entries** — Each journal entry gets a "listen" option. No external podcast platform needed.
- **Conversational formats** — Two-voice dialogues for explaining complex topics. AI-generated back-and-forth that makes dense material approachable.

## The Meta-Lesson

Voice cloning isn't about replacing human speech. It's about **scaling presence**. The ideas in these journals can now reach people who wouldn't otherwise encounter them—because now they can listen.
