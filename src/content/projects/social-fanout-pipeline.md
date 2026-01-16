---
title: "Social Fan-Out Pipeline: One Push, Everywhere"
date: "2026-01-16"
description: "A serverless event-driven architecture applying the fan-out pattern to distribute content from a single git push to LinkedIn and Threads simultaneously. Zero long-lived keys. Parallel execution with independent retry."
repoUrl: "https://github.com/kedbin/social-fanout-pipeline"
demoUrl: "https://youtu.be/Qz-S72zR6qk"
techStack: ["Google Cloud Workflows", "Pub/Sub", "Eventarc", "Cloud Functions", "Workload Identity Federation", "Python"]
audioUrl: "https://audio.relearn.ing/social-fanout-pipeline.mp3"
---

## The Objective

Eliminate the friction of manual social publishing. Every journal entry on this site gets distributed to LinkedIn and Threads automatically—formatted for each platform, posted simultaneously, with zero copy-paste.

The goal: apply the same engineering rigor we use for production code (CI/CD, automated pipelines, retry policies) to personal publishing. **State is messy. Architecture shouldn't be.**

## The Problem: Context-Switching Tax

Traditional publishing workflow:
1. Write content in Markdown
2. Copy to LinkedIn, reformat for professional tone
3. Copy to Threads, trim for character limits
4. Manually hit publish on each platform
5. Lose 15 minutes and your train of thought
6. Eventually stop sharing because friction wins

The fan-out approach:
1. Write content in Markdown
2. `git push`
3. Walk away

The system handles formatting, authentication, posting, and retry logic. **One push. Everywhere.**

## The Architecture: Event-Driven Fan-Out

![Social Fan-Out Architecture](https://raw.githubusercontent.com/kedbin/social-fanout-pipeline/main/docs/architecture-diagram.svg)

The pipeline implements the **fan-out pattern**—a single event triggers multiple independent downstream processes:

### Stage 1: Source (GitHub Actions)

A `git push` to the content directory triggers the pipeline. But here's the security detail most tutorials skip:

**Do not use Service Account JSON keys.** Google literally tells you not to. They're a pain to rotate and a liability sitting in your repo.

Instead, this system uses **Workload Identity Federation (WIF)**. GitHub generates a short-lived OIDC token, exchanges it with Google Cloud's Security Token Service, and receives a temporary access token. No persistent keys anywhere. This is keyless authentication done properly—aligned with Zero Trust principles.

### Stage 2: Ingestion (Pub/Sub)

The authenticated GitHub Action publishes a message to Pub/Sub. This decouples the source from the destination. GitHub doesn't need to know about LinkedIn or Threads. It just emits an event.

### Stage 3: Routing (Eventarc)

Eventarc catches the Pub/Sub message and routes it to Cloud Workflows. Why add this layer instead of triggering functions directly? **Observability.** Eventarc provides a managed layer with built-in logging, metrics, and dead-letter handling independent of the consumer.

### Stage 4: Orchestration (Cloud Workflows)

This is where the fan-out happens. The Workflow defines a `parallel` block:

```yaml
parallel:
  branches:
    - linkedin_branch:
        # Calls publish-linkedin function
        retry:
          max_retries: 3
          backoff:
            initial_delay: 2
            max_delay: 60
            multiplier: 2
    - threads_branch:
        # Calls publish-threads function
        retry:
          max_retries: 5
          backoff:
            initial_delay: 3
            max_delay: 120
            multiplier: 2
```

Branch A handles LinkedIn. Branch B handles Threads. They run **completely independently**.

If LinkedIn's API throws a 500, only the LinkedIn branch retries with exponential backoff. Threads posts on schedule. The whole pipeline doesn't crash because one API had a bad day.

You don't get that granular control with basic Pub/Sub triggers.

### Stage 5: Execution (Cloud Functions)

Two Python functions handle the platform-specific logic:

- **publish-linkedin**: Escapes reserved characters, appends audio links, posts via LinkedIn REST API
- **publish-threads**: Uses Meta's two-step container creation process (create container → publish)

Both functions retrieve API tokens from **Secret Manager at runtime**. The tokens never appear in the Pub/Sub message, never sit in environment variables, never touch GitHub. Even if someone intercepts the message payload, they only see blog post text—not credentials.

## Engineering Decisions

**Why Workflows over direct Pub/Sub triggers?** Granular retry control. With Pub/Sub triggers, a failure retries the entire function. With Workflows, you can retry specific branches with custom backoff policies while other branches continue.

**Why Eventarc in the middle?** Observability and resilience. Eventarc provides audit logging, dead-letter queues, and standardized event envelopes without coupling the pipeline to specific consumers.

**Why Secret Manager over environment variables?** Audit trail and rotation. You can see who accessed which secret and when. You can rotate credentials without redeploying functions.

**Why WIF over Service Account keys?** Zero Trust. No long-lived credentials to leak, rotate, or manage. The identity assertion happens at runtime, scoped to the specific GitHub repository and workflow.

## Retry Specifications

| Platform | Max Retries | Initial Delay | Max Delay | Backoff |
|----------|-------------|---------------|-----------|---------|
| LinkedIn | 3 | 2 seconds | 60 seconds | 2x exponential |
| Threads | 5 | 3 seconds | 120 seconds | 2x exponential |

Retries trigger only on:
- HTTP 429 (Rate Limited)
- HTTP 5xx (Server Errors)

Client errors (4xx) fail immediately—no point retrying a bad request.

## What's Included

### Infrastructure

- **workflow.yaml**: Cloud Workflows definition with parallel execution and retry logic
- **deploy.sh**: Complete deployment script using gcloud CLI
- **examples/github-action.yml**: Sample GitHub Actions workflow with WIF authentication

### Functions

- **publish-linkedin/**: LinkedIn REST API integration with character escaping
- **publish-threads/**: Meta Graph API integration with two-step publishing

### Documentation

- **ARCHITECTURE.md**: ASCII diagrams showing the complete flow
- **architecture-diagram.svg**: Visual system design

## Cost

Runs within Google Cloud free tier for personal use (~30 posts/month):
- Cloud Functions: 2M invocations/month free
- Pub/Sub: 10GB/month free
- Workflows: 5,000 steps/month free
- Secret Manager: 6 active secrets free

## The Meta-Lesson

This pipeline treats personal publishing with the same engineering discipline as production infrastructure. Not because personal notes deserve enterprise architecture, but because **friction is the enemy of sharing**.

Every minute spent reformatting is a minute not spent thinking. Every context switch is cognitive load that compounds. The fan-out pattern removes that friction entirely.

**Stop copying. Start pushing.**
