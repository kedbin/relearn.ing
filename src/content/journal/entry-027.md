---
title: "The Binary Asymptote: Why Your Deploy Pipeline Has a Weight Problem"
date: "2026-01-14"
summary: "135MB of audio files turned every deploy into a 5-minute penalty. Moving to Cloudflare R2 dropped it to 8 seconds - a 97% reduction that compounds with every future commit."
status: "Published"
category: "Relearn Engineering / Infrastructure"
highlights:
  - "Data Gravity: Binary files in Git create mass that slows every CI/CD cycle - each new asset makes the next deploy heavier [1]"
  - "Zero-Egress Economics: R2's pricing model ($0 bandwidth) makes CDN hosting cheaper than the CI minutes wasted on repo bloat [2]"
  - "O(n) to O(1): Decoupling assets from code turns linear deploy scaling into constant-time operations"
audioUrl: "https://audio.relearn.ing/entry-027.mp3"
publish_social: true
linkedin: |
  Every deploy was a 5-minute tax.
  
  Not because of complex logic or heavy dependencies - because of 135MB of MP3 files sitting in our Git repo.
  
  The "working" setup was silently stealing developer time on every single commit.
  
  Here's the migration math:
  
  BEFORE (GitHub Pages):
  - Deploy time: 3-5 minutes
  - Every commit re-uploads 135MB
  - Git history bloating exponentially
  
  AFTER (Cloudflare R2):
  - Deploy time: 8 seconds
  - Migration: 31 files uploaded in 4.3 seconds
  - Cost: $0/month (free tier covers 10GB)
  
  The meta-lesson: The most dangerous technical debt is the kind that "works."
  
  It doesn't fail with an error message. It fails by slowly stealing minutes from your day, compounding with every commit.
  
  Full breakdown of the Data Gravity problem and the protocol to fix it: https://relearn.ing/journal/entry-027
  
  #DevOps #Infrastructure #CloudArchitecture #TechnicalDebt
threads: |
  your deploy pipeline has a weight problem and you don't even know it
  
  we were uploading 135MB of audio on EVERY commit
  
  5 minute deploys for a one-line CSS fix
  
  moved to cloudflare R2:
  → 31 files migrated in 4.3 seconds
  → deploys now take 8 seconds
  → cost: $0/month (free tier)
  
  the most dangerous tech debt is the kind that "works"
  
  it doesn't break with an error - it breaks by stealing minutes from your day, every day
  
  stop storing state. start referencing it.
---

There is a specific kind of pain reserved for the engineer who waits five minutes to deploy a one-line CSS fix.

For the past month, every update to this site - whether a major feature or a typo correction - triggered a penalty. The build process would hang, the progress bar crawling as GitHub Actions struggled to checkout, process, and upload the artifacts.

The culprit was not complex logic or heavy dependencies. It was 135MB of MP3 files sitting in the repository, re-uploaded on every single commit.

We had fallen into a common trap: treating the repository as a universal container for everything related to the project. By co-locating audio assets with source code, we had inadvertently coupled deployment velocity to file size.

Here is how we broke that coupling, migrated to Cloudflare R2, and dropped deploy times from 5 minutes to 8 seconds.

## The Fallacy: The Repository Monolith

The default assumption for many developers is that the repo is the source of truth for everything.

If a file is part of the user experience, we reason, it belongs in version control. This works beautifully for text - code, config, documentation - where Git excels at delta compression. A 100-line change to a 10,000-line file costs negligible storage.

But binary files break this model. Git cannot diff them efficiently. Every modification stores a fresh copy of the entire blob. No deltas. No compression benefits.

We were operating under the Monolith Fallacy: the belief that keeping assets co-located with code simplifies architecture. In reality, it introduces a hidden tax. Every git clone, every git fetch, and every CI/CD checkout must pay the bandwidth cost of every binary file ever committed.

The tax compounds. Silently. Until your one-line fix takes five minutes to ship.

## The Model: Data Gravity

In 2010, engineer Dave McCrory coined the term Data Gravity [1]. The core concept:

Data, as it accumulates, builds mass. As it builds mass, it begins to have gravity. Services and applications are attracted to this data.

Our 135MB of audio files had generated significant gravity:

- CI/CD Gravity: The build pipeline downloaded, hashed, and re-uploaded these files on every deploy
- History Gravity: The .git folder grew with each commit, slowing local operations
- Cognitive Gravity: We stopped questioning the slow deploys because they had always been slow

We were solving a storage problem with a version control tool. The architecture needed to shift from stateful deployment (uploading the world every time) to reference architecture (uploading pointers to the world).

## The Tradeoffs

Before migrating, we evaluated four approaches:

Raw GitHub URLs: Point directly to files in the repo. Quick to implement, but GitHub raw URLs are rate-limited and lack CDN edge caching. Not designed for production asset serving.

GitHub Releases: Upload binaries as release assets. Better CDN treatment than raw URLs, but clunky workflow for frequent updates. Medium effort, medium reward.

Git LFS: Large File Storage tracks binaries separately. Solves repo size but often not deploy time - the build server still pulls LFS objects. Treating the symptom, not the cause.

Cloudflare R2: S3-compatible object storage with zero egress fees [2]. Global CDN, proper caching headers, predictable costs at any scale. The correct abstraction.

We chose R2 because it addressed the root cause: binary assets do not belong in version control pipelines.

## The Data

The migration numbers reveal the inefficiency we had normalized:

Before - GitHub Pages Monolith:
- Repository size: 200MB and growing
- Deploy time: 3-5 minutes
- Bandwidth waste: 135MB uploaded on every commit
- Hidden cost: Developer time, CI minutes, cognitive load

After - Cloudflare R2 Decoupling:
- Repository size: less than 5MB (code only)
- Deploy time: 8 seconds
- Migration speed: 31 files (135MB) uploaded to R2 in 4.3 seconds
- Monthly cost: $0 (free tier covers 10GB storage, 10M downloads)

The economics are striking. R2 charges nothing for bandwidth, and the free tier covers 10GB of storage [2]. Our 135MB sits comfortably within that. Even past the free tier, storage costs $0.015 per GB-month. Compare this to the CI minutes burned re-uploading the same unchanged files hundreds of times.

## The Protocol

If your deploys are slow due to static assets, here is the decoupling protocol:

Phase 1 - The Audit: Identify the heavy files in your repository. Run git verify-pack to surface the largest blobs. If you see MP3s, MP4s, or high-res images dominating the list, you have a gravity problem.

Phase 2 - The Migration: Set up object storage (R2, S3, or equivalent). Upload assets once. Configure a custom domain for clean URLs. Our 135MB transferred in 4.3 seconds.

Phase 3 - The Reference Update: Replace file imports with URL references. Change audioUrl: "https://audio.relearn.ing/entry-027.mp3" to audioUrl: "https://audio.relearn.ing/entry-027.mp3". The assets now live outside the deploy pipeline.

Phase 4 - The Purge: Remove binaries from Git tracking. Add them to .gitignore. For full cleanup, use git filter-repo to rewrite history - but coordinate with your team first.

Phase 5 - The Automation Update: Modify any scripts that generate or deploy assets to upload directly to the CDN instead of committing to the repo. Our voiceover automation now uploads to R2, updates the frontmatter reference, and pushes only the markdown change.

## The Scale Implications

At our current scale - 31 audio files - the inefficiency was annoying but survivable.

At scale, it becomes catastrophic:

- 100 audio files: 400MB re-uploaded per deploy
- 1000 commits per year: 400GB of redundant bandwidth annually
- Team of 5 developers: 2000GB of wasted transfer
- Git history: Exponential growth, clone times measured in minutes

The compound cost of technical debt is not linear. Each new binary file makes every future deploy heavier. The gravity increases with mass.

By decoupling early, we converted an O(n) problem into an O(1) constant. Deploy time is now independent of asset count.

## The Meta-Lesson

The most dangerous technical debt is the kind that works.

Our GitHub Pages setup worked. The audio played. The site loaded. But it was fragile in a way that did not announce itself. It did not fail with an error message. It failed by slowly stealing minutes from our day, every day.

By recognizing the physics of our infrastructure - that data has gravity - we designed a system that respects it. We stopped trying to push the mountain to the user and started sending them coordinates instead.

Stop storing state. Start referencing it.

---

References

[1] McCrory, D. (2010). Data Gravity in the Clouds. Data Gravitas.

[2] Cloudflare. (2022). R2 Object Storage: Zero Egress Fees. Cloudflare Documentation.

[3] Chacon, S. and Straub, B. (2014). Pro Git: Git Internals - Packfiles. Apress.
