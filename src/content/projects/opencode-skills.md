---
title: "OpenCode Skills: The AI-Augmented Developer Toolkit"
date: "2025-12-22"
description: "A modular skill system for OpenCode that extends AI capabilities through domain-specific tools. Built with Python and designed for cognitive leverage."
repoUrl: "https://github.com/kedbin/opencode-skills"
demoUrl: "https://youtu.be/jS_E62vAzuM"
techStack: ["Python", "OpenCode", "Trello API", "CLI"]
---

## The Objective

Build a **reusable skill framework** that transforms OpenCode from a general-purpose AI assistant into a domain-specific power tool. The goal: eliminate the cognitive overhead of context-switching between tools by teaching the AI to operate them directly.

This is the practical implementation of the "augmented intelligence" philosophy—not replacing human decision-making, but **removing friction** from execution.

## The Philosophy: Cognitive Leverage Through Abstraction

Traditional workflow:
1. Think about what to do
2. Remember the API/CLI syntax
3. Look up documentation
4. Execute the command
5. Parse the output
6. Decide next action

With skills:
1. Think about what to do
2. Tell the AI
3. Done

The skill system creates an **abstraction layer** between intention and execution. Each skill is a compressed bundle of domain knowledge that the AI can deploy on demand.

## Implementation: The Skill Architecture

The core innovation is the **SKILL.md** file—a markdown document with structured frontmatter that teaches OpenCode when and how to use a tool:

```markdown
---
name: trello-manager
description: Manage Trello boards, lists, and cards. Use this skill when the user wants to view, create, or update their Trello tasks.
---
```

The description field acts as the **trigger condition**. OpenCode reads this and knows exactly when to activate the skill.

### Output Optimization

All skill output is designed for **minimal context consumption**:

```
Board Name [abc123]
Another Board [def456]
```

IDs in brackets allow the AI to extract and reuse them without parsing complex JSON. This is deliberate design for **AI-friendly output**—reducing token overhead while maximizing actionable information.

## Engineering Decisions

**Why Skills over Direct API Calls?** LLMs can technically call APIs directly—they know the syntax. But raw API interaction burns context tokens on authentication boilerplate, error handling, and response parsing. Skills **pre-compile** this knowledge. The AI doesn't waste reasoning cycles on "how to authenticate with Trello"—it simply invokes the skill and focuses on the user's actual intent.

**Why Structured Output over JSON?** When an AI parses a 50-line JSON response, it consumes tokens understanding the structure before extracting the one field it needs. The `Name [id]` format is **token-efficient by design**—the AI instantly pattern-matches IDs without traversing nested objects. This is prompt engineering applied to output design.

**Why Trigger Descriptions?** The `description` field in SKILL.md isn't documentation—it's a **semantic router**. OpenCode pattern-matches user intent against skill descriptions to decide which tool to activate. Writing a good description is writing a classifier. Vague descriptions cause false activations; overly specific ones cause missed opportunities.

**Why CLI as the Interface?** Shell commands are the **universal language** of AI tool use. Every major AI coding assistant (OpenCode, Cursor, Copilot) can execute bash. By building skills as CLI tools, they work across any AI system without integration code. The skill becomes portable knowledge.

## Current Skills

### Trello Manager

Full CRUD operations for Trello boards, lists, cards, labels, and checklists. Use case: project management, meal planning, habit tracking—anything that benefits from kanban-style organization.

## The Meta-Lesson

Building this skill system surfaced a key insight: **the best AI tools are invisible**. When OpenCode seamlessly moves a Trello card or creates a checklist, there's no friction—just thought to action.

This is the cognitive architecture goal: **reduce the distance between intention and execution to zero**.
