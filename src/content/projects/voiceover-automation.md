---
title: "Voiceover Automation: Voice Cloning as a Developer Tool"
date: "2025-12-24"
description: "A skill-based pipeline for transforming written content into high-fidelity voice narration. Built on Chatterbox TTS and designed for frictionless audio production."
repoUrl: "https://github.com/kedbin/chatterbox-skills"
techStack: ["Python", "OpenCode", "Chatterbox TTS", "uv"]
---

## The Objective

Build a **voice cloning pipeline** that transforms written content into narrated audio with minimal friction. The goal: reduce the distance between "I wrote something" and "I have a voiceover of it" to a single command.

This extends the [OpenCode Skills](/projects/opencode-skills) philosophy—teaching an AI to operate domain-specific tools so I don't have to context-switch between writing and audio production.

## The Philosophy: Voice as an Interface Layer

Written content has reach. Spoken content has presence.

The friction of traditional voiceover work:
1. Write the script
2. Open audio software
3. Configure microphone settings
4. Record takes (multiple)
5. Edit, clean, export
6. Match output format to project needs

With this pipeline:
1. Point at the content
2. Done

The AI handles script adaptation, TTS execution, and file management. I focus on the ideas.

## Implementation: The Skill Architecture

Two skills handle the complete workflow:

### Create Script

The **narrative compiler**. Takes raw content (URLs, text files, notes) and transforms it into voiceover-ready scripts.

Key design decisions:
- **Acronym preservation**: Keeps "AI" as "AI" instead of expanding to "Artificial Intelligence"—TTS handles abbreviations better than spelled-out versions
- **Conversational adaptation**: Restructures written prose into natural speech patterns
- **Paralinguistic awareness**: Identifies moments for `[laugh]`, `[chuckle]`, or pauses based on content tone

### Voiceover

The **execution layer**. Interfaces directly with Chatterbox TTS to generate audio.

```bash
uv run voiceover_script.py --text script.txt --voice clone.wav --output narration.wav
```

Design principles:
- **Portable execution**: Uses `uv run` for dependency isolation—no manual venv activation
- **Chunked processing**: Long scripts are segmented for consistent quality
- **Naming conventions**: Output files match source slugs (`entry-009.txt` → `entry-009.wav`)

## Engineering Decisions

**Why Chatterbox TTS?** Open-source, runs locally, supports voice cloning from a single reference sample. Most importantly: it handles paralinguistic tags (`[laugh]`, `[sigh]`) natively. This enables expressive narration without post-processing.

**Why Skills over Direct Execution?** Raw TTS invocation requires remembering CLI arguments, managing file paths, handling chunking for long texts. Skills **pre-compile** this workflow knowledge. The AI doesn't waste context on "how to call the TTS model"—it focuses on what the user actually wants narrated.

**Why uv over pip/venv?** Speed and isolation. `uv run` creates ephemeral environments on demand without polluting the global Python installation. The skill becomes portable across machines without setup scripts.

**Why Acronym Preservation?** TTS models pronounce "AI" naturally as a word. Expanding to "Artificial Intelligence" sounds robotic and wastes audio time. This is prompt engineering applied to speech synthesis—optimizing for the output medium.

## The Meta-Lesson

The best automation is invisible. When this pipeline works correctly, there's no awareness of TTS models, audio codecs, or script formatting. There's just: content → voice.

This is the cognitive architecture goal: **make the tools disappear so only the work remains**.
