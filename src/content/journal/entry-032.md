---
title: "The Declarative Stack: When Video Becomes Code"
date: "2026-01-22"
summary: "The barrier to video creation was never creativity—it was the Compilation Gap between intent and pixels. AI agents collapse that gap, moving the bottleneck from technical dexterity to iterative taste."
status: "Published"
category: "Relearn Engineering / Creator Tools"
highlights:
  - "The Compilation Gap: The time between having an idea and rendering the final asset—historically measured in hours or days [1]."
  - "Declarative vs Imperative: Describing 'what you want' instead of 'how to make it' reduces iteration time by an order of magnitude."
  - "Skill Accumulation: Each prompt refinement becomes reusable knowledge that compounds across future projects."
audioUrl: "https://audio.relearn.ing/entry-032.mp3"
publish_social: true
linkedin: |
  I saw a LinkedIn post claiming Claude Code + Remotion was the "ChatGPT moment for video creation."
  
  One prompt. Full video. Minutes.
  
  I was skeptical. So I tested it.
  
  First attempt: functional but ugly. Tiny fonts. Clunky animations.
  
  But here's what's different—instead of dragging 50 layers in After Effects, I just said:
  
  → "Make fonts 32px, this needs to be mobile-first"
  → "Use spring animations, the cuts are jarring"  
  → "Scroll the diagram up instead of cutting between scenes"
  → "Final panel is too small, scale to 0.92"
  
  Six iterations. 10 minutes total. Done.
  
  As someone with zero After Effects experience, I would've given up before figuring out how to do this in a traditional editor.
  
  The barrier isn't gone—it just shifted. From technical dexterity to iterative taste.
  
  Attached is my v6 render—a 20-second explainer built entirely through conversation.
  
  The machines push pixels now. We push intent.
  
  Full write-up (with audio 🎧) on relearn.ing:
  
  https://relearn.ing/journal/entry-032/
threads: |
  tested the "claude code + remotion" hype everyone's posting about
  
  first attempt was garbage—tiny fonts, clunky animations
  
  but instead of manually fixing layers, I just said "make it bigger, use springs, scroll don't cut"
  
  six iterations. 10 minutes. professional result.
  
  as someone with zero after effects experience, I would've given up in a traditional editor
  
  we push intent now. machines push pixels.
  
  full write-up 🎧 → relearn.ing/journal/entry-032/
---

I saw a LinkedIn post from Shubham Saboo that felt like a signal flare from the future. He announced "Remotion Agent Skills for Claude Code," calling it the "ChatGPT moment for video creation."

His claim: *One prompt. 2 minutes. Full video. Done.*

As someone who has spent countless hours wrestling with keyframes in After Effects and timeline spaghetti in Premiere Pro, I was skeptical. But I already had Claude Code running. So I tested it immediately.

The result was not magic. It was something better—it was **engineering**.

My first attempt was a disaster. The video was technically a video, but the elements were microscopic on mobile, the animations were clunky, and the pacing felt wrong. But because the "source code" was natural language, I did not have to manually drag 50 layers around. I just typed: *"Make the fonts bigger. Use a spring animation. Scroll instead of cut."*

Six iterations. Thirty minutes. A professional, on-brand, 20-second animated explainer.

This experience illuminated a fundamental shift in how we build things: we are moving from **manipulating pixels** to **declaring intent**.

## The Fallacy

**The Pixel Pusher Myth**

We culturally assume that high-quality video production requires "craft"—defined as the manual dexterity to operate complex tools like After Effects, DaVinci Resolve, or Premiere Pro. We believe the barrier to entry is learning the software.

This creates what I call the **Compilation Gap**: the massive distance between having an idea in your head and rendering the final asset on your screen. If you cannot navigate the interface, your idea dies in the buffer.

This thinking treats video as sculpture—something you chip away at manually, frame by frame. But in the age of generative agents, video is not sculpture. It is software. And software abstracts.

## The Model

**The Declarative Rendering Loop**

The shift we are witnessing is the transition from imperative creation to declarative creation.

Imperative (the old way): "Create a rectangle at position (0,0). Move it to (100,100) over 2 seconds using a cubic-bezier curve. Change opacity to 50%."

Declarative (the new way): "Show a title card that slides in smoothly. Make it readable on mobile."

When you pair an agent like Claude Code with a framework like Remotion—which defines video as React components—you are operating at a higher level of abstraction. You are no longer the technician. You are the **Director of Engineering**.

This changes the feedback loop entirely. In traditional workflows, a "make it bigger" request requires selecting layers, resizing, adjusting anchor points, and fixing broken keyframes. In the declarative loop, it is a single sentence and a 50-second render.

The data supports this shift:

A 2024 study published in PNAS Nexus found that generative AI tools enhanced creative productivity by over 25 percent, specifically by reducing time spent on technical execution [1]. Research on human-AI co-creation shows the value comes not from the AI's first attempt, but from the **iterative feedback loop**—the AI provides raw material while the human provides taste [2]. McKinsey's 2025 analysis on film production notes that AI tools are "democratizing content creation," enabling solo creators to produce assets that previously required studio budgets [3].

The machines push pixels. We push intent.

## The Protocol

**From Prompt to Production**

Here is the workflow I used to bypass the Compilation Gap:

**Phase 1: Tool Installation**

Do not just open a chat. Equip your agent with domain knowledge:

```
npx skills add remotion-dev/skills
```

This installs the documentation and best practices for video creation—giving the agent "muscle memory" for the task.

**Phase 2: The Iteration Loop**

Do not expect perfection on attempt one. My process required six versions:

- **v1 (The Draft):** "Create a video explaining the Actionability Predicate diagram." Result: functional but microscopic fonts.
- **v2 (The Fix):** "Scale all text elements up. This needs to be mobile-first, 1080x1920."
- **v3 (The Feel):** "The cuts are jarring. Use spring animations for all transitions."
- **v4 (The Flow):** "Instead of separate sequences that reload, make it one continuous scene that scrolls using translateY."
- **v5 (The Proportion):** "The final reveal panel is too small at 0.72 scale. Make it 0.92."
- **v6 (The Brand):** "Apply the relearn.ing color palette from my website."

Total time from idea to final render: about 10 minutes. As someone with zero After Effects experience, I would have given up long before figuring out how to restructure compositions in a traditional editor.

**Phase 3: Skill Accumulation**

This is the most important step. Once you discover *how* to prompt effectively—"always use spring animations," "default font size 32px for mobile," "prefer continuous scroll over sequence cuts"—save it.

Update your personal skill file. Build a library of prompting patterns. You are not just creating a video. You are building a **video-building system** that compounds over time.

## What This Means

The accessibility implications are significant. Disabled creators who struggle with mouse-intensive interfaces can now direct through voice and text. Solo founders can produce professional explainers without hiring agencies. Non-designers can execute visual ideas that previously lived only in their imagination.

The barrier has not disappeared—it has shifted. From knowing keyboard shortcuts to knowing what you actually want. From technical dexterity to **iterative taste**.

For those clinging to the idea that value comes from operating complex GUIs, yes—we are cooked. But for those willing to become architects rather than technicians, the leverage is unprecedented.

The machine compiles. You direct.

## References

[1] Doshi, A. R., and Hauser, O. (2024). "Generative artificial intelligence, human creativity, and art." PNAS Nexus, 3(3).

[2] Oh, C., et al. (2023). "DeepThInk: Designing and probing human-AI co-creation in digital art therapy." International Journal of Human-Computer Studies.

[3] McKinsey and Company. (2025). "How AI could reinvent film and TV production." McKinsey Insights.
