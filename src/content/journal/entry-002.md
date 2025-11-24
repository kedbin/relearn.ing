---
title: "The Asymptote of Effort: Why I Stopped Optimizing My Docker Images"
date: "2025-11-21"
summary: "Analyzing the paralysis of engineering perfectionism through the lens of the 90-90 rule and Herbert Simon's bounded rationality."
status: "Published"
category: "Cloud Engineering / Systems Thinking"
highlights:
  - "The 90-90 Rule: The last 10% of optimization costs as much as the first 90%"
  - "Maximizers vs Satisficers: Why seeking the 'perfect' instance type leads to deployment paralysis"
  - "Opportunity Cost: The negative ROI of shaving 50ms off a build pipeline vs shipping features"
  - "Stop-Loss Protocol: Defining 'done' before opening the IDE"
---

## The Curve That Rules Your Infrastructure

We are culturally conditioned to believe that output is linear: *Work twice as hard, get twice the result.*

However, my recent logs correctly identify this as a fallacy. Whether I am refactoring a Terraform module, shaving milliseconds off a Lambda cold start, or browsing for the perfect wedding dress (yes, it applies there too), I am subject to the **Iron Law of Diminishing Returns**.

In economics, this is the point where the level of profits or benefits gained is less than the amount of money or energy invested. In engineering, it is the "Asymptote of Effort"—the moment when "better" becomes the enemy of "shipped."

To relearn productivity, we must stop trying to reach 100% efficiency and start recognizing the moment the curve flattens.

## 1. The Psychology of Choice: Maximizers vs. Satisficers

My recent search for the "perfect" AWS instance type for a side project consumed 4 hours of effort for a $0.50/month saving. This was a textbook example of **The Paradox of Choice**.

Nobel laureate Herbert Simon coined two terms to describe decision-makers:
*   **Maximizers:** Those who seek the absolute *best* option. They exhaust every possibility (comparing t3.micro vs t4g.small vs tens of others) to ensure no stone is unturned.
*   **Satisficers:** Those who set a threshold of acceptability and pick the first option that meets it.

Research by psychologist Barry Schwartz shows that while Maximizers might objectively make slightly "better" choices, they are consistently *less happy* than Satisficers. The energy cost of the search and the anxiety of "what if" destroys the utility of the result. As I noted: *"The effort to productivity ratio is better when picking from a smaller number of selections."*

**The Relearn.ing Take:** Artificial constraint is a feature, not a bug. Limiting your options (e.g., "Always use t4g.small for dev") is not laziness; it is cognitive defense.

## 2. The Engineering Reality: The 90-90 Rule

I also touched on the difficulty of moving a product from "good enough" to "perfect." In software engineering, this is humorously codified as **The 90-90 Rule** (attributed to Tom Cargill of Bell Labs):

> *"The first 90 percent of the code accounts for the first 90 percent of the development time. The remaining 10 percent of the code accounts for the other 90 percent of the development time."*

This creates a total of 180% of your time. When we aim for the perfect Docker multi-stage build or the cleanest possible abstraction, we are fighting for that final 10%. We fail to realize that the "cost" of that final 10% is equal to all the work we did previously.

## 3. The Neuro-Loop: Opportunity Cost of Attention

I mentioned the compulsive checking of a deployment pipeline status.
> *"There is diminished returns when checking every minute vs checking after a few hours."*

This is a failure to calculate **Opportunity Cost**. Every time you tab-switch to check GitHub Actions, you pay a "Switching Cost"—your brain has to disengage from deep work, refocus on the trivial update, and then attempt to re-engage.

The "return" on checking the first time is high (information). The return on checking the 10th time is zero, but the *cost* (interrupted focus) remains high. This is a negative return on investment.

---

## The Application: A Framework for "Good Enough"

Understanding the law is easy; obeying it is hard. Our brains are wired to seek completion. To combat this, we need a protocol to identify the **Point of Diminishing Returns (PODR)** and stop before we cross it.

Here is the **Relearn.ing "Stop-Loss" Protocol**:

### Phase 1: Define "Done" (The Acceptance Criteria)
In Agile software development, nothing gets built without a "Definition of Done." You must apply this to your personal tasks *before* you start.
*   **The Mistake:** "I need to optimize this Dockerfile." (Open-ended / Trap for Maximizers).
*   **The Fix:** "I need to get the image under 500MB. Once it hits 499MB, I stop."
*   **The Trigger:** The moment you hit the criteria, the refactor *must* end. Continued optimization is mathematically irrational.

### Phase 2: The Time-Box Strategy (The Constraint)
If you cannot trust your brain to stop, trust the clock.
*   **For Research:** Give yourself 30 minutes to research "best vector database." Pick the one that looks best at minute 29. The statistical likelihood of finding a significantly better option in hour #4 is lower than the value of your time lost.
*   **For Chores:** Using the "Visible Areas" insight from my notes, set a timer for 20 minutes to clean the living room. When the timer rings, you are done. You have captured the "Pareto" 80% of cleanliness.

### Phase 3: The "Sigh" Test (The Biological Signal)
Your body often knows you have hit diminishing returns before your brain does.
*   **The Signal:** That heavy sigh you let out when you re-read a PR comment for the 5th time. The glazing over of eyes when scrolling page 10 of search results.
*   **The Action:** This is a biological alert that your **Marginal Utility** has hit zero. You are now just burning glucose for comfort, not progress. **Ship it.**

## Conclusion

I asked myself: *"How then can we combat this in our daily life?"*

We combat it by redefining excellence. Excellence is not the pursuit of perfection in a vacuum. Excellence is the wise allocation of your limited life energy.

To embrace the **Law of Diminishing Returns** is to accept that the "hidden corner" of the infrastructure can stay messy, so that your mind can stay clear.
