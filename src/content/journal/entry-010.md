---
title: "Automating My Own Voice: The Voiceover Skill-set"
date: "2025-12-24"
description: "How I built a near-real-time voiceover pipeline using OpenCode skills and Chatterbox Turbo."
---

# Automating My Own Voice: The Voiceover Skill-set

In my last entry, I talked about [Engineering Your Priors](/journal/entry-009)—the idea that perception is an active simulation. Today, I'm putting that into practice by automating the way this journal is "perceived" as audio.

I’ve just released a new set of OpenCode skills that allow my AI agent to handle the entire voiceover pipeline autonomously. You can find the repository here: [chatterbox-skills](https://github.com/kedbin/chatterbox-skills).

### The Stack

The core of this system is **Chatterbox Turbo**, an open-source model from Resemble AI. It’s state-of-the-art for voice cloning and, more importantly, it supports paralinguistic tags. This means the agent can actually *simulate* human nuances like laughing `[laugh]` or chuckling `[chuckle]` directly in the narration.

### The Skill-set

I developed two custom tools for this workflow:

1.  **`create-script`**: This skill pulls the URL of a journal entry and transforms it into a voiceover-ready script. It handles the structure, ensures transitions are natural, and protects acronyms like "AI" from being expanded into mouthfuls.
2.  **`voiceover`**: This instructs the model to use the specific commands needed to generate audio. It handles environment setup (using `uv run`) and pipes the text into the model for near real-time generation.

### Why This Matters

This isn't just about making audio files. It's about **removing friction**. 

Notice how the agent handles its own troubleshooting. If it can't find a script or the virtual environment isn't ready, it doesn't stop and ask for help. It autonomously searches the directories, corrects the pathing, and proceeds. 

This is the power of the AI-augmented developer toolkit. The agent is no longer just a chatbot; it's a domain-specific power tool that understands the architecture of the project it's working on.

Stop watching reality. Start predicting it. [chuckle]

[View Project Details](/projects/voiceover-automation)
