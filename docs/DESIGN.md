# relearn.ing — Design Direction (v4 "Lab Notebook")

Owner of direction: coordinator. Every page and component should follow this file.
If something here is wrong for your page, ask; don't invent a new style.

## The idea
relearn.ing is a **public lab notebook**: numbered entries, real experiments, honest metrics.
The site should feel like a well-edited research publication (think Stripe Press, Works in
Progress, Linear's changelog). It should not look like a generic dark dev blog made of
rounded cards.

**Three words:** editorial, precise, warm.

### What we are removing
- Card soup. Content should not sit in rounded, bordered, shadowed boxes. Use whitespace,
  hairline rules and type hierarchy instead.
- Playfair, Caveat and Inter. Fake handwriting, tape and noise overlays.
- Cyan/purple pill tags. Empty terminal heroes. Decorative animation that carries no
  information.
- React islands for static content. Static content goes in `.astro`. React is only for real
  interactivity (search palette, filters, audio player).

## Type
| Role | Family | Tailwind | Notes |
|---|---|---|---|
| Display | Instrument Serif (400, italic) | `font-display` | Headlines only, ≥ 28px. Tight leading (1.0–1.1) and `tracking-tight`. Use *italic* for one emphasised word, never whole lines. |
| Reading | Newsreader Variable | `font-serif` | Long-form article body, 19–21px, leading 1.65, about 66ch measure. |
| UI | Geist Variable | `font-sans` | Navigation, buttons, summaries, lists. |
| Meta | Geist Mono Variable | `font-mono` | Entry numbers, dates, counts, labels. Uppercase labels are 11px with 0.08em tracking. |

Utility classes in `global.css`: `.h-display`, `.label`, `.num` (tabular mono numerals),
`.dek` (summary/standfirst), `.prose-lab` (article body).

## Colour: "Ink & Graphite"
This is an engineer's notebook: cool drafting paper, graphite text, and ultramarine fountain-pen ink.
Dark mode is blue-black slate with periwinkle ink. We deliberately avoid warm cream and terracotta
(they read as generic "AI brand").
Tokens are RGB triplets in CSS variables, so `bg-accent/10` works.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` / `surface` / `surface2` | #F4F5F2 / … | #0D0F14 / … | Page and subtle fills. Use them sparingly. |
| `line` | graphite @ 13% | mist @ 11% | Hairlines. Most structure comes from these. |
| `text` / `muted` / `faint` | #11141C … | #E4E8F0 … | Text hierarchy. |
| `accent` | ultramarine #2B3FD6 | periwinkle #8A9BFF | Links on hover, active state, №, focus, *one* focal point per screen. |
| `accent-2` | pen-red #D63A5C | #FF7A96 | Very rare: a correction mark or a "failure" annotation. |
| `eng` / `life` / `work` | teal / plum / ochre | brighter versions | Domain dots and chart bars only. |

## Signature motifs
1. **The entry number.** Every journal entry has `№ 068` (`.num`, accent `№`). Lists show the
   number in a left column, like a table of contents.
2. **Ruled index rows.** Lists of entries and projects are full-width rows separated by
   `border-line` hairlines, in the columns `№ | title + dek | domain | date | read time`.
   On hover, a `surface` background fades in, the title shifts to the accent, and an arrow
   slides 4px. Each row is a single `<a>`.
3. **Lab labels.** Section labels are 11px mono uppercase with a small accent square:
   `<span class="label"><i class="sq"></i>Latest</span>`.
4. **Honest metrics.** We show real numbers taken from the content (entries, words,
   audio-narrated count, days since the first entry) in mono, laid out like an instrument
   readout.
5. **Generous rhythm.** Sections use `py-20 md:py-28`. The container is
   `max-w-[1200px] px-5 md:px-8` (`.wrap`). Reading pages use `.wrap-narrow`, which is
   about 720px.

## Motion
- Use the Astro view transitions that already exist. Entry titles may use `transition:name`
  to morph from the list into the article header.
- Elements can do a subtle reveal on load (`.reveal`: opacity plus 8px translate, 500ms,
  ease-out-quint), staggered with `style="--d: 1"`.
- Hover transitions run 150–250ms. No parallax, floating blobs or typing effects.
- Always respect `prefers-reduced-motion`. `global.css` already does.

## Accessibility and UX bars
- Use semantic landmarks. There is a skip link. Focus rings are visible
  (`focus-visible:outline-accent`).
- Contrast is AA in both themes. The minimum tap target is 40px.
- Every page should render with JS disabled (search and filters may degrade).
- Lighthouse targets: performance ≥ 95 and accessibility 100.

## Shared code (coordinator-owned; ask before changing)
- `src/styles/global.css`, `tailwind.config.mjs`: tokens and utilities
- `src/layouts/Layout.astro`, `src/components/site/Header.astro`, `src/components/site/Footer.astro`
- `src/lib/content.ts`: entry helpers (`getEntries`, `entryNo`, `domainOf`, `readingTime`, `formatDate`, `relatedEntries`, `siteStats`)
