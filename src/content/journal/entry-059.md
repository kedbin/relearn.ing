---
title: "The Merge Conflict Tax: What 4-Day Playwright Reviews Taught Me About CI/CD"
date: "2026-04-17"
summary: "I found myself spending more time resolving merge conflicts than writing Playwright tests. The deeper problem was not the framework, but a CI/CD flow where pull requests sat for days, shared page.ts files became contention points, and Azure DevOps policies amplified source drift instead of containing it."
status: "Published"
category: "Relearn Engineering / DevOps"
highlights:
  - "When Playwright pull requests sit in review for three to four days, automation starts aging against a moving UI, and Git becomes the place where that drift finally hurts."
  - "A shared monolithic `page.ts` file turns parallel frontend work into a merge conflict machine because unrelated test updates collide in the same hotspot."
  - "The more useful target is not 100% one-to-one conversion of manual frontend testing into Playwright, but 100% automation of the highest-value repeatable regression risk."
  - "The most practical first fix is usually not more tooling but less latency: one approver plus required CI on sprint integration branches, stricter governance reserved for `main`, and a repository structure that reduces overlap."
audioUrl: "https://audio.relearn.ing/entry-059.mp3"
linkedin_video_urn: "urn:li:video:D4E10AQF36NbALztwzg"
publish_social: true
linkedin: |
  I found myself managing far too many merge conflicts simply because our Playwright pull requests were staying open for 3 to 4 days.
  
  That was the real headache.
  
  We were pushing for more agility and also trying to translate more of our manual frontend testing into Playwright automation.
  
  But while those PRs sat in review:
  - the UI kept changing
  - shared `page.ts` files kept getting touched
  - locators drifted
  - approvals could reset after minor fixes
  - the branch aged until Git surfaced the pain
  
  The more I worked through that loop, the less this looked like a Playwright problem and the more it looked like a systems-design problem.
  
  A few takeaways I now believe much more strongly:
  
  - Playwright is strong, but 100% one-to-one conversion of manual testing into browser automation is usually the wrong target
  - the better goal is 100% automation of the highest-value repeatable regression risk
  - if PRs are sitting for days, branch policy and integration timing matter as much as test quality
  - on Azure DevOps, a practical experiment is often 1 approver + required CI on the sprint integration branch, while keeping `main` stricter
  - if everything funnels through one shared `page.ts`, merge pain becomes a predictable output of the repository structure
  
  My current view is that teams should fix latency and repository shape first:
  reduce PR aging, break up shared page objects, classify which tests really belong in Playwright, and only then scale automation more aggressively.
  
  Full draft:
  
  https://relearn.ing/journal/entry-059/
threads: |
  I kept running into the same loop:
  
  Playwright PR waits 3-4 days.
  UI changes underneath it.
  Shared `page.ts` gets touched.
  Branch drifts.
  Merge conflict.
  Rebase.
  Rerun.
  Approval churn.
  
  At some point I stopped seeing this as a Playwright problem.
  It looked more like a CI/CD design problem.
  
  My biggest takeaway:
  do not chase 100% one-to-one conversion of manual frontend testing into Playwright.
  
  Better goal:
  automate 100% of the highest-value repeatable regression risk.
  
  And if Azure DevOps review latency is causing drift, try fixing the timing first:
  - 1 approver + required CI on sprint branches
  - keep `main` stricter
  - break up the `page.ts` hotspot
  
  Full draft:
  https://relearn.ing/journal/entry-059/
---

I found myself managing far too many merge conflicts simply because our Playwright pull requests were staying open for three to four days.

That was the real pain.

We were pushing hard on agility. We wanted features moving faster, releases happening more often, and frontend automation growing fast enough to keep up with product change. The ambition behind it was reasonable. We wanted to translate more of our manual testing effort into Playwright so that release confidence would not depend entirely on repetitive human checks.

But while those pull requests sat in review, the application kept changing underneath us.

A selector would change. A modal would move. A shared page object would get updated by another feature. A frontend refactor would land in the same flow I had already automated. By the time my branch came back for merge, the Playwright code I wrote often still made sense from an intent perspective, but it no longer matched the live shape of the UI.

So the job stopped being about writing good automation.

It became about surviving drift.

One sprint made that pattern impossible to ignore. While one of my Playwright PRs was still waiting for approval, another frontend change landed in the same shared page object for a checkout flow. When I finally rebased, the conflict in `page.ts` was only the visible part of the problem; the DOM behind the modal had changed enough that the locator I wrote no longer mapped cleanly to the page. I spent longer untangling the merge, rerunning the suite, and going back through the approval cycle than I had spent writing the original test.

### The Week Git Started Feeling More Expensive Than Testing

There is a specific kind of fatigue that comes from spending more time resolving conflicts than authoring actual tests.

That was the pattern I kept walking into.

I would open a Playwright pull request, expect the normal approval cycle, and then wait. During that wait, more frontend work would land. Someone else would touch the same shared `page.ts` abstraction. A selector I depended on would shift. Azure DevOps would eventually show the branch as stale or conflicted. Then came the familiar sequence: pull the latest target branch, resolve conflicts locally, rerun the tests, push again, and potentially lose approvals in the process.

If that happened once, it was annoying.

If it happened repeatedly over the course of a sprint, it became a tax.

That was when it clicked for me that I was not dealing with isolated merge problems. I was dealing with a workflow that produced merge problems as a normal output.

The system kept generating the same pattern:

- automation PR waits for days
- the UI keeps moving while it waits
- the branch drifts
- Git surfaces the pain
- another push extends the approval cycle
- the same delay creates the next round of drift

At that point, the merge conflict is not the core issue. It is just the place where the deeper design problem becomes visible.

### Why the Shared `page.ts` File Became a Choke Point

One of the biggest amplifiers of this pain was the way we structured the Playwright layer.

Like many teams, we leaned heavily on shared page object files. At first, that feels clean. Centralize locators. Reuse interaction methods. Keep test specs readable. And to be fair, shared abstractions really can help when the team is small, the UI is stable, or the surface area is still narrow.

The failure mode starts when that same file becomes the default landing zone for unrelated UI work. Once the application grows and multiple engineers are changing adjacent areas at the same time, a single shared `page.ts` file stops feeling like clean abstraction and starts behaving like a traffic intersection.

Checkout changes land in the same file as navigation changes. Profile updates collide with table interactions. A modal update from one feature quietly overlaps with a selector update from another. None of those changes are logically identical, but the file structure forces them into the same merge surface.

That is what made the review delay so expensive.

If a PR stays open for three or four days in a codebase where many people modify the same automation file, drift is no longer an edge case. It is the expected behavior of the system.

### We Were Chasing Coverage, but the System Could Not Absorb It

Part of what made this difficult is that the overall goal sounded right.

We were trying to expand frontend automation coverage aggressively. In the background, there was a larger aspiration: move as much of our manual frontend testing as possible into Playwright. On paper, that looks like maturity. It sounds like the natural next step for a team trying to move faster without sacrificing confidence.

But the more I worked through the merge pain, the more I started questioning the target itself.

Not because Playwright is weak.

Playwright is strong.

The question is whether a goal like "translate 100% of manual frontend testing into Playwright" is actually the right engineering target.

I do not think it is.

### Is 100% Manual-to-Playwright Conversion Even Feasible?

I think this is where diminishing returns become very real.

Playwright is excellent for browser-level regression coverage. It is strong at critical user journeys, cross-browser validation, stable end-to-end flows, and release-blocking smoke paths. If you want confidence that a user can sign in, move through a core workflow, submit a critical form, or complete a business-sensitive journey, Playwright is exactly the kind of tool I would want in the stack.

But not every manual test case deserves to become a Playwright test.

Some checks are exploratory by nature. Some are better handled through API or integration testing. Some belong in component tests closer to the frontend logic. Some are so volatile that automating them at the browser layer too early creates more maintenance cost than business value.

That is why I no longer think the right goal is 100% one-to-one conversion.

The better target is this:

**automate 100% of the highest-value repeatable regression risk, not 100% of the manual test inventory by count.**

That sounds like a subtle distinction, but it changes the strategy completely.

I have started thinking about that decision on four axes:

- **stability** — will this UI still look roughly the same next sprint?
- **business impact** — does failure here block revenue, compliance, or a core workflow?
- **repetition frequency** — do we run this check every release, hotfix, or regression cycle?
- **maintenance cost** — is this likely to stay cheap enough to maintain at the browser layer?

If a scenario scores high on the first three and low on the fourth, it is a strong Playwright candidate. If it scores low on stability or high on maintenance cost, it probably belongs somewhere else: API tests, component tests, or manual exploration.

Instead of asking, "How do we convert every manual test into Playwright?" the question becomes, "Which user journeys are important enough, stable enough, and repeated enough that they should absolutely be protected at the browser layer?"

That framing makes much more sense to me.

### Where Playwright Fits Best

If I were classifying the work honestly, I would keep Playwright focused on the top layer of confidence.

That usually means:

- critical end-to-end user journeys
- release-blocking smoke paths
- browser-level integration checks
- permission or role-sensitive flows
- high-value regressions that are painful to miss in production

And I would not force Playwright to own everything.

Manual testing still matters for exploratory work, UX judgment, and rapidly changing areas. API and integration tests often carry business logic more efficiently. Component tests are usually a better home for many UI states than a full browser script. Pushing every possible check into Playwright is not a sign of maturity if the maintenance cost starts outrunning the confidence gained.

That is the diminishing-return boundary I think teams need to watch carefully.

### The Real Mismatch Was Timing

The frustrating part is that we were trying to do the right thing. We wanted agility, faster releases, and stronger automation, but the review system around the automation work was moving slower than the product itself.

Once I saw that clearly, the question changed. It was no longer just "how do we write more Playwright tests?" It became "how do we stop automation pull requests from aging in the queue while the UI keeps changing under them?"

### What Teams Can Actually Do in Azure DevOps

If someone reading this is dealing with the same problem, I do not think the first fix is to tell engineers to be more careful or to ask the team to rebase more often.

The first fix is to reduce how long automation pull requests spend aging in review.

For teams using Azure DevOps, one of the most practical experiments is to stop treating every branch the same.

If `main` is the final release-facing branch, keep it strict.

But for the active sprint integration branch, I think a much better model is:

- set the **minimum number of reviewers** to **1 instead of 2**
- keep **build validation** required for the Playwright pipeline
- use **auto-complete** once the single reviewer approves and CI passes, so the PR does not sit idle
- where policy allows, avoid the harshest **reset code reviewer votes when there are new changes** behavior for minor follow-up pushes on the sprint branch

That split matters because it lowers the amount of time automation spends aging against a changing UI while still keeping machine validation in place.

In practical terms, I would rather have:

- `dev/sprint-X`: 1 approver + clean CI
- `main`: 2 approvers + stricter governance

than force every Playwright update through the full release-grade review burden while the branch drifts out of relevance.

That is not lower quality.

It is better timing.

To be clear, I would not treat that as universal advice. If the codebase has a very high blast radius, the team is still building review discipline, or the organization is heavily regulated, then stricter approval policies may still make sense everywhere. But for a sprint integration branch in a team that trusts its CI, the lighter policy often maps much better to the speed of frontend change.

### The Practical Path I Would Take Going Forward

If I were redesigning this deliberately, I would take a staged approach.

#### 1. Reduce review latency on the integration branch

The immediate target is to stop the three-to-four-day wait from becoming normal.

I would start with branch-specific Azure DevOps policies on the sprint integration branch: minimum reviewers set to one, build validation required for the Playwright job, and auto-complete enabled so green PRs do not linger after approval.

#### 2. Keep stronger governance on `main`

If the organization needs two approvers or stricter controls for production-facing merges, keep that where the release risk is highest. Do not force every fast-moving automation update through the same bottleneck first.

#### 3. Break the `page.ts` monolith apart

Move from one giant shared page object into smaller component-oriented files such as:

- `header.component.ts`
- `sidebar.component.ts`
- `checkout-modal.component.ts`
- `product-table.component.ts`

The goal is to stop unrelated changes from colliding in the same place.

#### 4. Classify the manual test inventory

Not every manual test should become a Playwright test.

I would explicitly classify the existing manual suite into:

- Playwright candidate
- API or integration candidate
- component-test candidate
- manual or exploratory only

And I would classify them using the same four questions every time:

- How stable is the UI?
- How high is the business impact if this breaks?
- How often do we need to repeat this check?
- How expensive will this be to maintain in Playwright?

That is how you avoid chasing the wrong definition of 100% coverage.

#### 5. Automate by risk, not by count

The right question is not "how many manual tests did we convert?" It is "how much important regression risk did we remove from repetitive human effort?"

That is the metric that matters.

#### 6. Make CI fast enough to support the branch policy

If Playwright validation is too slow or too noisy, teams will still hesitate to merge quickly.

So the branch policy only works if the pipeline supports it:

- shared YAML templates
- stable runners
- browser caching
- artifact publication for failures
- parallelization where appropriate

Fast CI is not just a quality-of-life improvement here. It is what makes lower-latency integration safe.

### The Real Lesson

The biggest thing I had to relearn here is that merge conflicts are often not the real problem. They are the most visible symptom of a larger systems mismatch.

In my case, the mismatch was clear in hindsight:

- we wanted more agility
- we wanted stronger automation
- we wanted broader frontend coverage
- but we were letting automation work sit too long inside a shared, collision-prone repository structure

Git was not creating the pain.

Git was revealing it.

That changed how I think about frontend automation strategy.

If Playwright work keeps becoming a merge headache, I no longer assume the answer is simply to push harder on the people writing the tests. I assume I need to look upstream: review policy, integration timing, repository structure, and the actual definition of what deserves browser automation.

Because once engineers are spending more time resolving merge conflicts than writing useful Playwright coverage, the real bottleneck is no longer the framework.

It is the system around it. Fix that system, and merge conflicts go back to being what they should be: rare, resolvable, and forgettable.
