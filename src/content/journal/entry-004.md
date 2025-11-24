---
title: "Refactoring the Monolith: A Claude Code Case Study"
date: "2025-11-23"
summary: "How I used Claude Code to refactor a legacy Node.js monolith into serverless functions in 3 hours—a task that previously took me 2 days."
status: "Published"
category: "Engineering / AI Augmentation"
highlights:
  - "Velocity Delta: 3 hours with AI vs. 16 hours manual estimate (5.3x speedup)"
  - "The Stack: Claude Code (CLI) + VS Code + AWS CDK"
  - "Error Rate: 2 logical bugs found by AI that human review missed"
  - "The Lesson: AI isn't just for writing code; it's for architectural reasoning"
---

## The Monolith Problem

I have a legacy Node.js application that handles user notifications. It's a classic "ball of mud"—express routes mixed with business logic, direct database calls, and zero unit tests.

**The Goal:** Refactor a specific module (`email-sender.js`) into a standalone AWS Lambda function using the AWS CDK (Cloud Development Kit).

**The Old Way (Manual):**
1.  Read the code to understand dependencies (1 hour).
2.  Set up a new CDK project (30 mins).
3.  Copy-paste logic, fix imports, install dependencies (2 hours).
4.  Write the Infrastructure-as-Code (IaC) to deploy it (2 hours).
5.  Debug permissions (IAM roles) because I always forget one (2 hours).
6.  **Total Time:** ~7-8 hours (best case).

## The New Way: AI-Augmented Refactoring

This weekend, I tried a different approach. I used **Claude Code**, a CLI tool that runs directly in my terminal and has context of my entire file system.

### Step 1: The Context Injection

Instead of pasting snippets into a web browser, I ran this in my terminal:

```bash
claude "Analyze src/legacy/email-sender.js. Map out all external dependencies and environment variables it uses. Don't write code yet, just give me the dependency graph."
```

**Result:** In 30 seconds, it identified that this "simple" file actually depended on a global `logger` object and a `db-config.json` that I would have missed.

### Step 2: The Refactor Prompt

```bash
claude "Create a new directory /functions/email-service. Refactor the logic from email-sender.js into a clean, dependency-free Lambda handler in TypeScript. Use Zod for input validation. Mock the database call for now."
```

**The Output:**
It didn't just copy the code. It:
1.  Converted CommonJS (`require`) to ES Modules (`import`).
2.  Added a Zod schema to validate the event payload (something the original code lacked).
3.  Wrapped the logic in a `try/catch` block with proper structured logging.

### Step 3: The Infrastructure (The Real Magic)

This is where I usually get stuck—writing the CDK code.

```bash
claude "Now write the AWS CDK construct to deploy this lambda. Include the necessary IAM permissions to send SES emails. Use NodejsFunction construct."
```

It generated a file `lib/email-service-stack.ts`.
Crucially, it added:
```typescript
emailLambda.addToRolePolicy(new iam.PolicyStatement({
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'], // It noted I should restrict this in prod
}));
```

It remembered the IAM permissions I usually forget.

## The Diff: Human vs. AI

| Metric | Manual Estimate | AI Actual |
| :--- | :--- | :--- |
| **Time to Draft** | 4 hours | 15 mins |
| **Time to Debug** | 3 hours | 45 mins |
| **Logic Errors** | Unknown | 0 (caught by Zod) |
| **IAM Errors** | 1 (predicted) | 0 |

## The "Gotcha" Moment

It wasn't perfect. Claude assumed I was using CDK v2 (correct), but tried to import a deprecated library for the Lambda construct.

**My Role:** I wasn't the *typist*; I was the *reviewer*. I saw the red squiggly line in VS Code, told Claude "That import is deprecated in CDK v2.100," and it corrected itself immediately.

## Conclusion

This wasn't "automated" coding. It was **augmented** engineering.
*   **The AI** handled the boilerplate, the syntax conversion, and the IAM policy memory.
*   **I** handled the architectural constraint (Lambda vs Fargate) and the code review.

If you are a cloud engineer and you aren't using CLI-based AI tools that can read your file system, you are voluntarily coding with one hand tied behind your back.
