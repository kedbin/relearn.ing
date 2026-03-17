# Fan-Out Protocol: Video Script & Technical Reference

> Production reference for the "Social Fan-Out Protocol" explainer video.
> This document contains the verified script, technical specs, and B-roll notes.

---

## Video Metadata

| Field | Value |
|-------|-------|
| **Working Title** | "I Automated My Social Media with Google Cloud Workflows" |
| **Alt Title** | "System Design: The Fan-Out Protocol (Serverless Architecture)" |
| **Target Length** | 5 minutes |
| **Tone** | Technical but conversational, senior engineer perspective |

### Thumbnail Concept
- Split screen: frustrated (left) vs. clean architecture diagram (right)
- Text overlay: "One Push = Everywhere"
- Show 429 error or messy terminal on left side

---

## Technical Specifications (Verified)

### Architecture Flow
```
Local (Markdown) 
    -> git push 
    -> GitHub Actions (OIDC auth via WIF)
    -> Pub/Sub (social-publish-events)
    -> Eventarc trigger
    -> Cloud Workflow (parallel branches)
    -> Cloud Functions (LinkedIn + Threads)
    -> Secret Manager (runtime credential fetch)
```

### Authentication
- **Method**: Workload Identity Federation (WIF)
- **Token Type**: Short-lived OAuth 2.0 access token
- **Token Lifetime**: 1 hour (default)
- **Key Storage**: None - keyless authentication

### Retry Configuration
| Platform | Max Retries | Initial Delay | Max Delay | Multiplier |
|----------|-------------|---------------|-----------|------------|
| LinkedIn | 3 | 2s | 60s | 2x |
| Threads | 5 | 3s | 120s | 2x |

**Retry Conditions**: HTTP 429 (rate limit) or 5xx (server errors) only

### Secrets (in Secret Manager)
- `linkedin-access-token`
- `linkedin-urn`
- `threads-access-token`
- `threads-user-id`

### Infrastructure
- **Deployment**: Shell scripts (`deploy.sh`) + gcloud CLI
- **Region**: us-central1

---

## Script

### Phase 1: The Setup (0:00 - 0:45)

**Visual**: Face-cam center frame, good lighting. Cut to B-roll of typing in VS Code, switching tabs between LinkedIn/Threads/Twitter.

**Audio**:

> I hate writing the same thing twice.
>
> We build these elaborate CI/CD pipelines for our code—automated tests, deployments, the whole deal. But when it comes to our actual ideas? Our notes? We're still copy-pasting like it's 2005.
>
> I write everything in Markdown. But getting it out there means: reformat for LinkedIn, trim it down for Threads because of character limits, manually hit publish three times. It kills the flow.
>
> So I stopped doing it manually. I applied a classic cloud architecture concept—the fan-out pattern—to build a serverless system where I push once, and it shows up everywhere. Let me show you how it works.

---

### Phase 2: The Architecture (0:45 - 1:30)

**Visual**: Screen share of D2 architecture diagram. Use mouse highlighter to trace: GitHub Actions -> WIF -> Pub/Sub -> Eventarc -> Workflows -> parallel branches.

**Audio**:

> Here's the architecture. Starts at GitHub Actions.
>
> Now, most guides will tell you to create a Service Account key—that JSON file—and dump it in your GitHub Secrets. Don't do that. Google literally tells you not to. It's a pain to rotate and it's a security liability sitting in your repo.
>
> Instead, I'm using Workload Identity Federation. Here's what happens: GitHub generates a short-lived OIDC token, exchanges it with Google Cloud, gets a temporary access token back—no persistent keys anywhere. This is how you do keyless auth properly.
>
> Once authenticated, the message goes to Pub/Sub. Now, I could have triggered Cloud Functions directly from Pub/Sub. But I routed through Eventarc into Google Cloud Workflows instead. Why add that layer? Two reasons: observability and resilience.

---

### Phase 3: The Orchestration (1:30 - 2:45)

**Visual**: GCP Console > Workflows. Open source tab, show YAML. Highlight the `parallel` block. Pop up text overlays: "Parallel Execution" and "Auto-Retry".

**Audio**:

> This is where it gets interesting.
>
> In distributed systems, stuff fails. LinkedIn's API might throw a 500 while Threads is working fine. With a simple Pub/Sub trigger, one failure can mess up everything.
>
> But look at this Workflow. I've got a `parallel` block—Branch A handles LinkedIn, Branch B handles Threads. They run completely independently.
>
> And check out this retry policy. If LinkedIn rate-limits me or throws a server error, the Workflow retries just that branch—exponential backoff, up to three attempts. Meanwhile, the Threads post goes out on time. The whole pipeline doesn't crash because one API had a bad day.
>
> You don't get that kind of granular control with basic Pub/Sub triggers.

---

### Phase 4: The Security (2:45 - 3:30)

**Visual**: GCP Console > Secret Manager (blur actual values). Cut to VS Code showing Python Cloud Function code, highlight the `get_secret()` call.

**Audio**:

> Quick note on secrets.
>
> The API tokens for LinkedIn and Threads never leave Google Cloud. They're not in the Pub/Sub message. They're not in GitHub. They live in Secret Manager.
>
> The Cloud Function pulls them at runtime—right before it needs them. So even if someone intercepts the Pub/Sub message, all they see is my blog post text. Not my credentials.
>
> It's basic security hygiene, but a lot of people skip it.

---

### Phase 5: The Demo (3:30 - 4:30)

**Visual**: Split screen. Left: Terminal. Right: GCP Console > Workflow Executions.

**Action sequence**:
1. Type: `git commit -m "New Post" && git push`
2. Hit Enter
3. Wait ~10-15 seconds (test timing beforehand)
4. Refresh Workflow executions on right
5. Click new execution to show graph view
6. Watch parallel branches turn green
7. Final cut: Show LinkedIn and Threads tabs with the actual posts

**Audio**:

> Let's run it live.
>
> I'm pushing a new journal entry... GitHub Actions picks it up, authenticates through Federation, publishes to Pub/Sub.
>
> Over in Google Cloud—watch the Workflow trigger. There's the parallel step... both branches running... and they're green.
>
> Let me pull up LinkedIn... there it is, formatted. And Threads... posted at the same time.
>
> One push. Everywhere.

---

### Phase 6: Outro (4:30 - 5:00)

**Visual**: Face-cam, relaxed posture.

**Audio**:

> The code for all of this—the deployment scripts, the Workflow YAML, the Python functions—is open source on my site, relearn.ing.
>
> If you want to build something similar, or just see how Workload Identity Federation works in practice, go check it out.
>
> Thanks for watching.

---

## Production Checklist

### Before Recording
- [ ] Zoom to 150% on all screen recordings (readable on mobile)
- [ ] Dark mode enabled: VS Code, Terminal, GCP Console
- [ ] Hide/blur GCP account email (top-right corner)
- [ ] Test demo end-to-end, note actual timing
- [ ] Prepare a test journal entry for the live demo

### Screen Recording Notes
- Move mouse deliberately, don't wiggle
- Point cursor at what you're discussing
- Pause on important code sections

### B-Roll Needed
- [ ] Typing in VS Code (Markdown file)
- [ ] Tab-switching between social platforms (frustrated)
- [ ] GCP Workflow graph visualization
- [ ] Secret Manager list view (blurred)
- [ ] Terminal with git push command

---

## Fact-Check Notes

### Verified Claims
- Workload Identity Federation implementation
- Parallel workflow execution
- Retry policies with exponential backoff
- Secret Manager for credential storage
- LinkedIn + Threads integration

### Claims to Avoid
- Don't say "Pure Zero Trust" (say "Zero Trust principles" instead)
- Don't mention Terraform (uses shell scripts)
- Don't mention schema validation (not implemented)
- Don't mention Dead Letter Queue (not implemented)
- Don't mention Firestore idempotency (not implemented)

---

## Resources

- **Architecture Diagram**: `diagram/exports/web/relearn-architecture.svg`
- **Workflow YAML**: `workflow.yaml`
- **GitHub Action**: `.github/workflows/social-publish.yml`
- **Cloud Functions**: `main.py`
- **Deployment Script**: `deploy.sh`

---

*Last updated: January 2025*
*Status: Ready for recording*
