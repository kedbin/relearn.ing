---
title: "The Bet: An 11-Month Protocol for Becoming AI-Proof"
date: "2026-01-23"
summary: "A sprint-based execution plan for an early-mid level engineer betting on GCP, Rust, and cloud-native AI infrastructure - optimized for working professionals with existing cloud experience."
status: "Published"
category: "Relearn Life / Career Engineering"
highlights:
  - "The GCP + Rust Bet: Differentiate by combining cloud platform expertise with systems programming - a rare combination in the job market (2025)"
  - "Leverage Transfer: Azure IAM/secrets experience translates directly to GCP - this is not a cold start, it is a warm migration"
  - "Sustainable Pacing: 3-week sprints at 10-12 hrs/week - aggressive enough to make progress, sustainable enough to avoid burnout"
audioUrl: "https://audio.relearn.ing/entry-034.mp3"
publish_social: false
---

> **Revision Note (2026-01-23):** This entry has been revised to reflect a more optimized path given my actual context: 1 year of Azure cloud engineering experience at Accenture, intermediate Python skills, and a full-time job constraint. Rev 2 leverages existing cloud experience and focuses on GCP + Rust differentiation rather than a cold-start systems programming path. The original plan (Rev 1) is preserved at the bottom for reference.

---

# Rev 2: The Optimized Protocol (GCP + Rust Differentiation)

This is still a bet. But it is now an *informed* bet.

The original plan assumed a blank slate. It ignored a critical asset: I already have one year of Azure cloud engineering experience. Secrets management. IAM provisioning. Enterprise-scale identity systems. That is not nothing. That is a foundation.

The revised bet: instead of abandoning cloud for pure systems programming, I am combining cloud platform expertise (GCP) with systems programming differentiation (Rust). This positions me in the intersection of two valuable skill sets - a structural hole that few engineers occupy.

## The Fallacy: The Cold Start Trap

Rev 1 made a classic mistake: it optimized for the *ideal* path without accounting for *existing assets*. This is like selling your house to buy a new one in a different city, when you could renovate and build equity where you already live.

I have Azure experience. That translates to GCP. The mental models are the same:
- Identity and Access Management
- Secrets and credential management
- Networking and security boundaries
- Infrastructure as Code patterns

The revised approach: *translate* rather than *restart*.

## The Model: Leverage + Differentiation

### The Stack Bet (Revised)

**Primary Platform: Google Cloud Platform**

GCP is the bet for several reasons:
- Vertex AI is the most ML-native managed platform
- GKE is best-in-class Kubernetes
- Google is pushing hard on AI infrastructure
- Less crowded than AWS, more enterprise-ready than Azure for ML

**Differentiation Layer: Rust**

But here is where I diverge from the typical cloud engineer. Every Rust project I build will be *cloud-infrastructure focused*:
- Not toy projects. Cloud tooling.
- Not academic exercises. Production-grade services.
- Not tutorials. Shipped artifacts.

The combination is rare: few Rust developers understand cloud infrastructure. Fewer cloud engineers know Rust. I am betting on the intersection.

**The CUDA/C++ Question: Deferred**

The original plan front-loaded CUDA and C++. For my context, this is premature optimization. CUDA becomes relevant when:
- I am targeting FAANG AI infra roles specifically
- A job posting explicitly requires it
- I want to contribute to inference engines (vLLM, TensorRT)

Until then, GCP + Rust is sufficient differentiation.

### The Skill Ladder (Revised)

- **Level 1:** GCP fundamentals + translate Azure knowledge. The warm start.
- **Level 2:** Kubernetes (GKE) + containerized deployments. The infrastructure layer.
- **Level 3:** Rust fundamentals + cloud-focused projects. The differentiation layer.
- **Level 4:** Vertex AI + ML serving. The AI infrastructure layer.
- **Level 5:** Rust + ML serving integration. The unique combination.
- **Level 6:** Open source contribution + capstone. The proof of work.

## The Constraint: Full-Time Work

The original plan implied unlimited time. Reality: I work at Accenture. That means 45-50 hour weeks of consulting work. The revised protocol assumes:

- **10-12 hours per week** for learning
- 1.5 hours on weekday mornings (5 days) = 7.5 hours
- 4 hours on weekends = 4 hours
- **Total: approximately 11 hours per week**

Three-week sprints instead of two-week sprints. This gives approximately 33 hours per sprint - enough for meaningful progress without burnout.

## The Protocol: 11-Month Sprint Plan (Revised)

Fifteen three-week sprints, organized into four phases. Each sprint ends with a shipped artifact. The artifacts are smaller than Rev 1, but they are *consistently shipped*.

### Phase 1: GCP Foundation and Cloud Translation (Months 1-3)

The goal: translate Azure experience to GCP. This is not learning from scratch. This is migration.

**Sprint 1 (Weeks 1-3): GCP Fundamentals and IAM**

- Set up GCP project with proper organization structure
- Translate Azure AD knowledge to Cloud Identity and IAM
- Implement service accounts, workload identity, least-privilege patterns
- Deliverable: GCP project with production-grade IAM configuration
- Stretch: Begin Cloud Digital Leader certification prep

**Sprint 2 (Weeks 4-6): GCP Networking and Security**

- Translate Azure VNet knowledge to GCP VPC
- Implement Cloud Armor, Secret Manager (direct parallel to Key Vault)
- Set up private connectivity patterns
- Deliverable: Secure GCP networking foundation with documented architecture

**Sprint 3 (Weeks 7-9): GKE Fundamentals**

- Deploy GKE cluster with proper node pool configuration
- Implement Workload Identity for pod-level IAM
- Deploy a Python FastAPI application with proper health checks
- Deliverable: Production-ready GKE cluster with sample application

**Sprint 4 (Weeks 10-12): Infrastructure as Code**

- Terraform modules for GKE, IAM, networking
- Implement GitOps workflow with Cloud Build
- Document module patterns for reusability
- Deliverable: Terraform repository managing entire GCP infrastructure

**Checkpoint:** By end of Month 3, I should have a production-grade GCP environment managed entirely through Terraform. My Azure knowledge should feel fully translated.

### Phase 2: Rust Foundation (Months 4-6)

The goal: become Rust-proficient while building *cloud-relevant* tools, not toy projects.

**Sprint 5 (Weeks 13-15): Rust Fundamentals**

- Complete Rustlings (100+ exercises)
- Read The Rust Book chapters 1-12
- Build a small CLI tool that solves a real problem
- Deliverable: Rustlings completion + CLI tool on GitHub

**Sprint 6 (Weeks 16-18): Rust for Cloud**

- Learn async Rust (tokio runtime)
- Build a CLI that interacts with GCP APIs
- Implement: list compute instances, manage secrets, deploy Cloud Run services
- Deliverable: `gcp-cli-rs` - a Rust CLI for GCP operations

**Sprint 7 (Weeks 19-21): Rust Web Services**

- Learn Axum web framework
- Build a REST API server in Rust
- Implement proper error handling, logging, health checks
- Deliverable: Rust API server deployed on Cloud Run

**Sprint 8 (Weeks 22-24): Rust and Containers**

- Optimize Docker images for Rust (multi-stage builds)
- Benchmark Rust service vs Python equivalent
- Document memory footprint, cold start time, request latency
- Deliverable: Benchmarked Rust service with comparison analysis

**Checkpoint:** By end of Month 6, I should be confident with Rust ownership and borrowing. I should have 3-4 cloud-relevant Rust projects on GitHub.

### Phase 3: GCP AI Infrastructure and Rust Integration (Months 7-9)

The goal: combine GCP AI services with Rust infrastructure skills.

**Sprint 9 (Weeks 25-27): Vertex AI Fundamentals**

- Complete Vertex AI training pathway
- Train and deploy a model using Vertex AI Pipelines
- Understand model registry, endpoints, monitoring
- Deliverable: End-to-end ML pipeline on Vertex AI

**Sprint 10 (Weeks 28-30): Model Serving on GKE**

- Deploy HuggingFace model on GKE with GPU node pool
- Implement proper resource requests and limits
- Set up horizontal pod autoscaling based on GPU utilization
- Deliverable: GPU-accelerated model serving on GKE

**Sprint 11 (Weeks 31-33): Rust Inference Gateway**

- Build a Rust-based API gateway for model endpoints
- Implement: authentication, rate limiting, request batching
- Add observability with OpenTelemetry
- Deliverable: `inference-gateway-rs` - Rust proxy for ML endpoints

**Sprint 12 (Weeks 34-36): LLM Infrastructure**

- Deploy open-source LLM (Llama, Mistral) on GKE
- Implement Rust request queue for handling burst traffic
- Add caching layer for common prompts
- Deliverable: Production-like LLM serving stack

**Checkpoint:** By end of Month 9, I should be able to deploy and operate AI workloads on GCP. The Rust inference gateway should be a unique portfolio piece.

### Phase 4: Capstone and Open Source (Months 10-11)

The goal: ship proof of work that cannot be faked.

**Sprint 13 (Weeks 37-39): Open Source Research and Contribution**

- Identify target projects: google-cloud-rust, kube-rs, axum, tonic
- Study codebase, find good first issues
- Make meaningful contribution (not just typo fixes)
- Deliverable: Merged PR to established Rust cloud project

**Sprint 14 (Weeks 40-42): Capstone Build**

- Build complete system: Rust API gateway, GKE, Vertex AI, monitoring
- Implement end-to-end observability
- Deploy with real domain and TLS
- Deliverable: Live system handling real traffic

**Sprint 15 (Weeks 43-45): Documentation and Polish**

- Write comprehensive technical architecture document
- Create architecture diagrams
- Write post-mortem covering failures and learnings
- Deliverable: Published technical deep-dive on relearn.ing

**Checkpoint:** By end of Month 11, I should have:
- Merged PR to respected open source project
- Live capstone system with real users
- Technical documentation of the journey
- Public proof of work that AI cannot generate

## The Metrics: Honest Signals (Revised)

Each sprint, I will track:

- **Shipped Artifacts:** Did I produce something public?
- **Cloud Spend:** Am I actually using GCP, not just reading about it?
- **Rust Lines of Code:** Am I writing Rust, not just reading tutorials?
- **GitHub Contributions:** Is my profile showing consistent activity?
- **Documentation:** Did I write about what I learned?

The key revision: *consistency over intensity*. 33 hours of focused work every three weeks beats 50 hours of unsustainable cramming.

## The Anti-Patterns to Avoid (Revised)

**Do Not:**
- Ignore existing cloud experience
- Build projects unrelated to career goals
- Optimize for learning at the expense of shipping
- Compare progress to people without full-time jobs
- Sacrifice sleep for study (counterproductive)

**Do:**
- Translate existing knowledge rather than relearn
- Build every project with cloud infrastructure in mind
- Ship incomplete things and iterate
- Respect the constraint of full-time work
- Protect recovery time

## The Translation Table: Azure to GCP

For reference, here is how my Azure experience maps to GCP:

- **Azure AD** translates to Cloud Identity and IAM
- **Key Vault** translates to Secret Manager
- **AKS** translates to GKE
- **Azure DevOps** translates to Cloud Build
- **Azure ML** translates to Vertex AI
- **Application Gateway** translates to Cloud Load Balancing
- **Azure Monitor** translates to Cloud Monitoring and Cloud Logging

This is not a new language. It is a dialect of one I already speak.

## The Revised Meta-Bet

I am betting that the combination of:
- Cloud platform expertise (GCP)
- Systems programming differentiation (Rust)
- Shipped proof of work (public projects)

...will be more valuable than either pure cloud engineering or pure systems programming alone.

The original plan was aggressive but impractical. This revision is ambitious but sustainable. The goal is not to burn out in month three. The goal is to arrive at month eleven with a transformed skill set and a portfolio that proves it.

This is still a bet. But now it is a bet I can actually execute.

---

# Rev 1: Original Protocol (Preserved for Reference)

> **Note:** The following is the original plan drafted before accounting for existing Azure experience and full-time work constraints. It is preserved here for reference and comparison.

---

This is not a plan. This is a bet.

I am betting eleven months of my life on the hypothesis that systems programming, GPU infrastructure, and deep technical competence will remain valuable in a world where AI can generate CRUD applications in seconds. This is not a hedge. This is a concentrated position.

In my previous entry, I established the principle: **Signal Value = f(Time, Difficulty, 1 - AI_Automation_Possible)**. Now I am applying that formula to my own career. The question is not "what should I learn?" The question is: "What skills require such high friction to acquire that they cannot be synthesized by a language model?"

The answer: the skills that hurt.

## The Fallacy: The Waterfall Trap

Most career development advice follows a waterfall model. Study for six months. Build a portfolio. Then apply. This is a failure mode.

The problem with waterfall is feedback latency. You invest months into a direction without validating whether it works. By the time you discover your portfolio is outdated or your skills are commoditized, you have already burned your runway.

Software engineering abandoned waterfall decades ago for a reason: the cost of late feedback is catastrophic. Yet we continue to apply waterfall thinking to our careers. We "plan" and "prepare" and "get ready" instead of shipping and iterating.

I am adopting an Agile approach to my own development. Two-week sprints. Shipped artifacts at the end of each sprint. Retrospectives to adjust course. The goal is not perfection. The goal is validated learning through painful iteration.

## The Model: Iterative Skill Acquisition

### The Stack Bet

Based on extensive research into AI infrastructure engineering, compiler development, and systems programming career trajectories, I am betting on the following stack:

**Primary Language: Rust**

The borrow checker is not a bug. It is a filter. Rust enforces understanding of memory models, ownership, and lifetimes at compile time. This means two things: first, you cannot fake Rust competence the way you can fake JavaScript competence with AI-generated code. Second, learning Rust makes you better at all systems programming, including C++ [1].

A senior C++ engineer with 20 years of experience rewrote her payment processing service in Rust. The result: zero memory-related production incidents (down from three per quarter), 15% better performance, and new engineers contributing meaningful changes within two weeks instead of two months. Her quote: "I'm tired of spending 40% of my debugging time on problems the compiler should catch. Rust doesn't let me be sloppy at 3 AM" [2].

**Secondary Language: C++**

C++ remains essential because the AI infrastructure stack is built on it. CUDA is fundamentally C/C++. LLVM, the compiler infrastructure underlying everything from Rust to Swift, is C++. PyTorch and TensorFlow internals are C++. The ability to bridge Rust and C++ puts you in the "structural hole" between safety-first advocates and performance-first legacy systems. That bridge position correlates with 42% higher promotion rates [3].

**Tertiary: CUDA and GPU Programming**

AI cannot replace the person who understands how to optimize GPU memory hierarchies, because AI runs on GPU memory hierarchies. This is a recursive dependency. The people who build and optimize inference infrastructure are, by definition, upstream of the AI that might replace them.

NVIDIA's AI Infrastructure certification path (NCA-AIIO and beyond) provides a costly signal that separates serious practitioners from tutorial completers [4].

### The Skill Ladder

The AI Infrastructure Engineering roadmap follows six levels [4]:

- **Level 1:** Python + Bash + Go or Rust. The systems language separates you from ML engineers who only know Python.
- **Level 2:** ML basics (PyTorch internals, not just API calls). Understand what you are serving.
- **Level 3:** Kubernetes + CUDA + Distributed Training. This is where the friction becomes real.
- **Level 4:** Terraform, Security, Policy as Code. DevSecOps for AI.
- **Level 5:** Real projects with multi-GPU deployments, RAG systems, production inference. Shipped complexity.
- **Level 6:** Open source contribution and community presence. The bridge position.

The key insight: "ML Engineers build the model. AI Infra Engineers build the system that trains, serves, and monitors it at scale" [4]. The latter is harder because it requires understanding systems at multiple layers simultaneously.

## The Protocol: 11-Month Sprint Plan

I am dividing the next 11 months into 22 two-week sprints, organized into five phases. Each sprint ends with a shipped artifact. No exceptions. The artifact can be small, but it must be public and it must be painful to produce.

### Phase 1: Foundation (Sprints 1-4 / Months 1-2)

**Sprint 1-2: Rust Fundamentals**

- Complete Rustlings (100+ exercises)
- Build a CLI tool in Rust that solves a real problem I have
- Ship to crates.io or GitHub with documentation
- Deliverable: Working CLI tool with tests

**Sprint 3-4: Rust Deepening**

- Read "Rust in Action" or "Programming Rust"
- Implement a non-trivial data structure (B-tree, skip list, or LSM tree)
- Write a blog post about what broke and how I fixed it
- Deliverable: Data structure implementation with benchmarks

**Checkpoint:** By end of Month 2, I should be able to read and modify non-trivial Rust codebases. The borrow checker should feel like a collaborator, not an adversary.

### Phase 2: Systems (Sprints 5-8 / Months 3-4)

**Sprint 5-6: C++ Bridge**

- Work through "Effective Modern C++" (Meyers)
- Build a small project that interfaces Rust and C++ via FFI
- Understand the pain points of interop
- Deliverable: Rust/C++ interop project with documentation

**Sprint 7-8: Memory and Concurrency**

- Implement a lock-free data structure
- Study memory models (acquire/release semantics, happens-before)
- Write about the debugging process
- Deliverable: Lock-free structure with correctness tests

**Checkpoint:** By end of Month 4, I should understand why memory safety is hard and why Rust's approach is valuable. I should be able to articulate the tradeoffs to engineers from both camps.

### Phase 3: GPU and Infrastructure (Sprints 9-14 / Months 5-7)

**Sprint 9-10: CUDA Fundamentals**

- Complete NVIDIA DLI fundamentals course
- Write custom CUDA kernels for basic operations (matrix multiply, reduction)
- Profile and optimize with nvprof/Nsight
- Deliverable: Optimized CUDA kernels with benchmarks

**Sprint 11-12: Rust + GPU**

- Explore Rust GPU bindings (cudarc, rust-cuda)
- Build a simple inference server component in Rust that calls CUDA
- Document the FFI boundary challenges
- Deliverable: Rust-CUDA integration project

**Sprint 13-14: Kubernetes and ML Serving**

- Deploy a model on Kubernetes with GPU scheduling
- Set up monitoring (Prometheus, Grafana for GPU utilization)
- Implement auto-scaling based on load
- Deliverable: Production-like ML serving stack with observability

**Checkpoint:** By end of Month 7, I should be able to deploy and monitor GPU workloads in production. This is Level 3-4 on the AI Infra ladder.

### Phase 4: Distributed Systems (Sprints 15-18 / Months 8-9)

**Sprint 15-16: Consensus Implementation**

- Implement Raft consensus protocol in Rust
- Use it to build a distributed key-value store
- Write about the failure modes encountered
- Deliverable: Raft implementation with tests

**Sprint 17-18: Distributed Training**

- Set up multi-GPU training with PyTorch DDP
- Understand NCCL, gradient synchronization, pipeline parallelism
- Benchmark different parallelism strategies
- Deliverable: Distributed training benchmark suite

**Checkpoint:** By end of Month 9, I should understand why distributed systems are hard at a visceral level. I should have war stories about debugging network partitions and race conditions.

### Phase 5: Integration and Contribution (Sprints 19-22 / Months 10-11)

**Sprint 19-20: Open Source Contribution**

- Identify a high-quality open source project (LLVM, ScyllaDB, Turso, or similar)
- Make a meaningful contribution (not just typo fixes)
- Engage with the community, learn their standards
- Deliverable: Merged PR to an established project

**Sprint 21-22: Capstone Project**

- Build a complete AI inference system: Rust backend, GPU optimization, distributed deployment
- Deploy publicly with real traffic
- Write a comprehensive technical post-mortem
- Deliverable: Shipped system with users

**Checkpoint:** By end of Month 11, I should have proof of work that is impossible to fake. A live system with bugs and patch notes. A contribution to a respected open source project. Public documentation of my failures.

## The Metrics: Honest Signals

Each sprint, I will track:

- **Shipped Artifacts:** Did I produce something public and painful?
- **Debugging Hours:** How much time did I spend fighting real problems? (More is better initially)
- **Borrow Checker Fights:** Am I still struggling, or is it becoming intuitive?
- **Community Engagement:** Am I connecting with practitioners in both Rust and C++ worlds?
- **Failure Documentation:** Did I write about what went wrong?

These metrics are chosen because they are hard to fake. I cannot inflate "debugging hours" with busywork. I cannot pretend a project shipped if it did not. The metrics themselves are costly signals.

## The Anti-Patterns to Avoid

Based on research into why side projects no longer differentiate candidates [5]:

**Do Not:**

- Build another to-do app or weather app
- Complete tutorials without building something original
- Collect certificates from video courses
- Optimize for GitHub green squares over shipped complexity
- Wait until something is "ready" before making it public

**Do:**

- Build things that hurt to build
- Document the struggle, not just the result
- Ship incomplete things and iterate publicly
- Choose friction over comfort at every decision point

## The Network Protocol

Learning in isolation is a local maximum. I will actively bridge:

- **Rust community** and **C++ practitioners**: Translate between safety-first and performance-first worldviews
- **ML researchers** and **infrastructure engineers**: Connect the model builders with the system runners
- **Open source maintainers** and **industry engineers**: Route knowledge between communities

Every month, I will introduce at least one person from Cluster A to someone from Cluster B. This increases my betweenness centrality in the professional graph.

## The Meta-Bet

I am betting that the skills which are hardest to acquire are the skills which will remain valuable the longest. This is not guaranteed. AI capabilities are expanding faster than anyone predicted. It is possible that in 11 months, GPU programming will be fully automated and this entire plan will be obsolete.

But I am not optimizing for certainty. I am optimizing for expected value under uncertainty. And the expected value calculation favors skills that are:

- Upstream of AI (compilers, infrastructure, hardware interfaces)
- Require embodied understanding (debugging distributed systems, optimizing memory layouts)
- Produce honest signals (shipped systems with real users and real bugs)

If I am wrong, I will have learned Rust, C++, CUDA, Kubernetes, and distributed systems. These skills are not worthless in any plausible future. The downside is bounded.

If I am right, I will be one of the few early-mid level engineers who made the bet when it was still possible to differentiate. The upside is asymmetric.

This is not a plan. This is a bet. And I am all in.

## Appendix: The Beginner Track

This section is for those starting from zero systems programming experience—coming from Python, JavaScript, or other high-level languages. This is not a disadvantage. Research shows that senior engineers sometimes struggle more with Rust than juniors because they keep trying to write C++ patterns that the borrow checker rejects [6]. A blank slate is a feature, not a bug.

### What Will Feel Familiar

If you know Python or JavaScript, several Rust concepts will map naturally:

- Rust's syntax borrows from many languages (pattern matching, iterators, closures)
- Cargo (Rust's package manager) works like npm but with better dependency resolution
- Error handling with `Result<T, E>` is similar to try/catch but forces explicit handling
- Strong typing will feel stricter but not entirely foreign

### What Will Be New (and Painful)

The following table maps Python/JS mental models to Rust reality:

- **Ownership:** In Python, everything is a reference you pass around freely. In Rust, every value has exactly one owner. When ownership moves, the original variable becomes invalid.
- **Borrowing:** In JavaScript, you just pass objects. In Rust, you must explicitly borrow with `&` for read access or `&mut` for write access.
- **Lifetimes:** Python's garbage collector handles memory automatically. In Rust, you prove to the compiler how long references remain valid.
- **No null:** Python has `None`, JavaScript has `null` and `undefined`. Rust has `Option<T>`, and you must handle the empty case explicitly.
- **No exceptions:** Python uses try/except, JavaScript uses try/catch. Rust uses `Result<T, E>`, and you must handle errors explicitly.

### The Emotional Arc

Expect this progression:

- **Week 1-2:** "This is cool, Cargo is nice, the syntax is readable."
- **Week 3-4:** "Why will this not compile? The borrow checker hates me." (The Wall)
- **Week 5-6:** "Oh... I think I understand ownership now."
- **Week 7-8:** "Wait, the compiler is actually protecting me from real bugs."
- **Month 3+:** "I cannot believe I used to write code without these guarantees."

The "Week 3-4 Wall" is where most beginners quit. That wall is the signal. Pushing through it is what separates you from the AI-generated code crowd. The struggle is the proof of work.

### Revised Phase 1: True Beginner Track

**Sprint 1 (Weeks 1-2): Rust Fundamentals Part A**

Week 1 focuses on basics:

- Install Rust via rustup
- Read Chapters 1-6 of The Rust Book (the official, free resource)
- Complete the first 30 Rustlings exercises
- Deliverable: Screenshot of 30 completed exercises pushed to a learning repository

Week 2 tackles ownership (the hard part):

- Read Chapters 7-10 of The Rust Book (ownership, borrowing, lifetimes)
- Complete Rustlings exercises on ownership and borrowing
- Deliverable: Write a blog post or README explaining ownership in your own words

**Sprint 2 (Weeks 3-4): Rust Fundamentals Part B**

Week 3 finishes the exercises:

- Complete remaining Rustlings exercises (approximately 70 more)
- Start reading Rust by Example for practical patterns
- Deliverable: 100 percent Rustlings completion

Week 4 builds the first real project:

- Build a small CLI tool (file renamer, markdown converter, or anything useful to you)
- Use the clap crate for argument parsing
- Deliverable: Working CLI on GitHub with a README

### When to Add C++

The original plan introduces C++ in Phase 2 (Months 3-4). For beginners, I am adjusting the timeline:

- **Months 1-4:** Rust only. Get comfortable with ownership, borrowing, and the Rust ecosystem.
- **Months 5-6:** Start C++ basics when you encounter CUDA. The NVIDIA ecosystem requires C/C++.
- **Month 7+:** Rust/C++ interop as needed for specific projects.

By Month 5, your Rust mental model will make C++ easier to understand. You will see why certain C++ patterns are dangerous because Rust already taught you what memory safety means.

### Resources

- The Rust Book: https://doc.rust-lang.org/book/
- Rustlings: https://github.com/rust-lang/rustlings
- Rust by Example: https://doc.rust-lang.org/rust-by-example/
- Exercism Rust Track: https://exercism.org/tracks/rust

## References

[1] JetBrains. (2025). "Rust VS C++ Comparison for 2026." *The RustRover Blog*.

[2] Bhavyansh. (2025). "Why Senior Engineers Are Learning Rust in 2025." *Medium*.

[3] Burt, R. S. (2004). "Structural Holes and Good Ideas." *American Journal of Sociology*, 110(2), 349-399.

[4] Sadhwani, V. (2025). "AI Infra Engineer Learning Roadmap." *tech5ense*.

[5] Ng, A. (2025). "Your Side Project Won't Save You Anymore." *Medium*.

[6] corrode Rust Consulting. (2025). "Flattening Rust's Learning Curve."
