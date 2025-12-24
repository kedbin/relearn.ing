---
title: "Voiceover Automation: Narrative Engineering with Chatterbox"
date: "2025-12-24"
description: "A specialized OpenCode skill-set for transforming raw content into high-fidelity voice clones using Chatterbox Turbo."
repoUrl: "https://github.com/kedbin/chatterbox-skills"
techStack: ["Python", "OpenCode", "Chatterbox TTS", "Bayesian Mechanics"]
---

## The Objective

Extend the [OpenCode Skills](/projects/opencode-skills) framework to automate the production of audio content. This project transforms the "Probability of Reality" philosophy into a functional engineering workflow, allowing an AI agent to read, script, and narrate content in near real-time.

## The Workflow: Scripting to Synthesis

The system relies on two interconnected skills that manage the transition from raw data to processed audio.

### 1. Create Script
This skill acts as the **narrative compiler**. It fetches raw content (like a journal entry URL) and transforms it into a conversational script. 
- **Acronym Preservation**: Unlike standard LLM summaries, it maintains technical terms like "AI" to ensure natural TTS pronunciation.
- **Paralinguistic Injection**: It strategically places tags like `[chuckle]` or `[laugh]` based on the content's tone.

### 2. Voiceover
The execution layer that interfaces with **Chatterbox Turbo**. It handles:
- **Environment Management**: Utilizing `uv run` to ensure all dependencies (torch, scipy, etc.) are correctly loaded without manual venv activation.
- **Chunked Processing**: To maintain high fidelity and speed, longer scripts are broken into manageable chunks before being merged into the final WAV.

## Engineering the "Lens"

This project is a direct application of the Bayesian Mechanics described in [Entry 009](/journal/entry-009). By defining a "Strong Prior" through the `SEARCH_QUERY` variable in the script generation phase, the agent filters out the "noise" of raw web content and focuses on the "signal" needed for a compelling narration.

## Directory & Automation

The skills are stored in a modular structure within the `.opencode/skill/` directory, making them portable and easily integrable into any project. The automation handles its own troubleshooting—if a path is missing or an environment is not initialized, the agent autonomously re-scans the directory and corrects the execution path.

This reduces the distance between **Intention** (writing an article) and **Execution** (narrating it for the website) to near zero.
