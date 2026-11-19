---
title: "Kindle Explainer: A notebook page the viewer can watch"
date: "2026-11-19"
description: "I set out to turn a first-generation Kindle Scribe into a drawing tablet for my PC. What I needed was simpler: a page I could draw on and a browser window I could record."
techStack: ["Kindle Scribe", "Grimoire 2.1.0", "Live View", "OBS (planned)"]
---

## The brief

When I explain something technical, I want to draw an arrow at the moment I say what it means: something between a polished slide and a bare screen recording. I had a first-generation Kindle Scribe from 2022, and it already felt like the right place to draw. My starting assumption was that the PC needed to own the drawing.

That assumption sent me looking for pen events. It also made the project more complicated than the explanation I wanted to make.

## The detour: the pen data was there

The stock notebook kept drawing local ink while a short, read-only test listened separately. In that run I observed 34 pen contacts with coordinates, pressure and tilt, and the ink still appeared normally. That established that the data could be observed alongside the native notebook, not that I had a usable drawing tablet.

I got a prototype using tldraw to compile. I never validated it as a working Kindle-to-PC bridge. Compiling moved the experiment forward, but it didn’t tell me I could sit down and explain something without thinking about the plumbing.

## What worked: mirror the page, not the pen

What worked was [Grimoire 2.1.0](https://github.com/ganten1998/grimoire-scribe/releases/tag/v2.1.0), an open-source notebook app for the Scribe. My device was on firmware 5.20.1.0.2 and had been jailbroken with Véra. That’s a prerequisite of my setup, not the technique this write-up is about; the [Kindle Modding documentation](https://kindlemodding.org/jailbreaking/) is the place to check model and firmware compatibility.

Grimoire’s Live View (under **Library → Share**) serves the current page to a browser on the same Wi-Fi once you enter its pairing code. If you record, keep both the address and the code out of the shot.

The browser shows the page Grimoire is showing. It isn’t a second editor and it doesn’t get editable strokes. That distinction is what makes the setup useful: the Kindle stays a notebook, and OBS can capture the browser window.

## Tested limits

What I verified on my own device:

- Grimoire opened and the pen made local ink.
- Pinch-to-zoom worked on the page.
- The drawing appeared in Live View in a browser on my Windows PC.

What I haven’t done yet: recorded the finished video, measured the delay between the pen and the mirror, or validated the tldraw bridge. The studio scene and the figures on this page are original illustrations, not screenshots or recordings from my Kindle.

## Put the reference under the ink

I liked the mix of illustrations and screenshots in Hugging Face’s [*Pi Durable EXPLAINED*](https://www.youtube.com/watch?v=ti3vVYwzW4A). It gave me a direction for my own explainers: show the relevant piece of a system, then draw on it rather than ask the viewer to connect the picture to the narration in their head.

The [Grimoire 2.1.0 docs](https://github.com/ganten1998/grimoire-scribe/blob/v2.1.0/README.md) describe a way to do that. A JPG or PNG in `grimoire/photos/` can be picked under **Paper → Photos…** and becomes the page background. Ink goes on top; the image isn’t a movable object. I’d export a tight code crop or a diagram with some room around the key detail, then circle one line or trace one path as I talk. The diagram in the studio scene illustrates that idea; it isn’t an import I tested.

## Frame it for the viewer

A portrait notebook and a 16:9 recording are different shapes. In [the framing study below](#kindle-framing), both compositions use the same page at the same aspect ratio. One gives it the frame; the other puts the spare space to work by adding context beside it.

In OBS I’d start by cropping out the black margins around the browser capture, then scaling proportionally. If the full page makes the ink too small, I’d crop to the section I’m explaining, or try turning the Kindle to landscape. Stretching to fill the frame would make the sketch bigger at the cost of making it wrong.

The proposed recording setup has two scenes: **Desk** for introducing the idea and **Board** for drawing it. The cut should happen when the viewer needs the page, not just because there’s a second scene. A tighter Board shot can do more for legibility than a more elaborate pen bridge.

## What I took from it

The useful question was never “Can I make the Kindle behave like a Wacom?” It was “Can someone see where the arrow goes when I explain why it matters?” For that, a notebook and a mirror are enough to start.
