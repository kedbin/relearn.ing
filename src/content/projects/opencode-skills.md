---
title: "OpenCode Skills: The AI-Augmented Developer Toolkit"
date: "2025-01-20"
description: "A modular skill system for OpenCode that extends AI capabilities through domain-specific tools. Built with Python and designed for cognitive leverage."
repoUrl: "https://github.com/kedbin/opencode-skills"
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

**Why CLI over SDK?** The CLI approach provides zero coupling with OpenCode internals. Skills work with any AI that can execute shell commands. Update skills without updating OpenCode. Test commands manually for debugging.

**Why Python?** Universal availability, minimal dependencies (only `requests`), and readable by AI—Python's clarity makes it easier for the AI to understand and modify.

**Why .env Files?** Environment-based configuration following the 12-factor app methodology. Credentials never touch source control. Easy rotation without code changes.

## Current Skills

### Trello Manager

Full CRUD operations for Trello boards, lists, cards, labels, and checklists. Use case: project management, meal planning, habit tracking—anything that benefits from kanban-style organization.

## The Meta-Lesson

Building this skill system surfaced a key insight: **the best AI tools are invisible**. When OpenCode seamlessly moves a Trello card or creates a checklist, there's no friction—just thought to action.

This is the cognitive architecture goal: **reduce the distance between intention and execution to zero**.
