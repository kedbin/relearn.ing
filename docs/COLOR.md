# Ink & Graphite: the relearn.ing palette

There is one palette with two faces. **Day** is cool drafting paper with graphite and ultramarine ink. **Night** is blue-black slate with pale graphite and periwinkle ink. Every color on the site is one of the roles below, in its day or night value, at any opacity. There is no second accent, no pink and no framework default. The active `html.dark` class switches all authored surfaces, including figures, Canvas and Three.js scenes.

The roles live in **src/styles/colors.json**. Everything else is generated from it or checked against it.

<!-- roles -->
| Role | Light | Dark | Use |
|---|---|---|---|
| `bg` | #f4f5f2 | #0d0f14 | Page / drawing paper |
| `surface` | #eaece9 | #15181f | Raised surface / desk |
| `surface-2` | #dfe2df | #1e222b | Inset surface / printed grid |
| `line` | #11141c | #dce2f0 | Hairline (apply alpha) |
| `text` | #11141c | #e4e8f0 | Reading ink |
| `muted` | #585e6a | #949cac | Secondary copy |
| `faint` | #646a76 | #848c9c | Quiet labels |
| `accent` | #2b3fd6 | #8a9bff | Action / focus |
| `eng` | #0e8076 | #4ad0be | Engineering data |
| `life` | #8442a0 | #c496ff | Life data |
| `work` | #b07a0c | #eebe5a | Work data |
| `chassis` | #333946 | #50596c | Device shell / framing board |
| `metal` | #a8afba | #707b91 | Device metal / diagram edges |
| `scrim` | #11141c | #090b10 | Media scrim / shadow |
| `on-media` | #f4f5f2 | #e4e8f0 | Ink over media / neutral scene light |
<!-- end roles -->

## Authoring

- **Chrome and type:** use `text-muted`, `bg-surface`, `hover:text-accent` or `rgb(var(--line) / var(--hair-a))`. Tailwind's `surface2` and historical `border-border` are aliases. Tailwind's default color scale, shadow, ring and placeholder colors are mapped to roles in `tailwind.config.mjs`; `bg-pink-500` and similar don't exist.
- **Accent is the only signal color.** Links, focus, the active step and illustration ink (the pen stroke, the circle, the Wi-Fi thread) all use `accent`: ultramarine by day, periwinkle at night. Domain colors (`eng`/`life`/`work`) are for chart bars, dots and syntax tokens, not for body text or a second highlight.
- **SVG:** `stroke="rgb(var(--accent))"`. Use transparent, none, currentColor, opacity, and gradients/shadows derived from roles. `scrim` and `on-media` keep controls legible over third-party imagery.
- **Canvas and Three:** they can't resolve CSS variables themselves. Read computed RGB triplets through `readPalette(host)`, pass the snapshot into the painters, and use e.g. `ctx.strokeStyle = palette['accent']`. Refresh materials, lights, textures and the current frame when the theme changes. Don't run an idle render loop.
- **Code blocks:** Shiki uses its `css-variables` theme. `global.css` maps each token to a role (keyword → accent, string → eng, constant → work, function → life, comment → faint, punctuation → muted), so code follows day and night.
- **Adding a role:** only for a distinct, reusable need. Edit **src/styles/colors.json** with both values and a purpose, run `npm run colors:sync`, then review both themes and contrast on the real surface.

## The two gates

`npm run build` runs both, and CI runs the build, so a color outside the palette can't ship.

1. **Source gate**, `npm run colors:check` (`scripts/check-colors.mjs`), runs before Astro. It parses authored source and public files (Astro compiler, PostCSS, TypeScript AST): CSS declarations, inline styles, Tailwind class candidates (variants, arbitrary values, `@apply`), SVG paints, and Canvas/DOM/Three color sinks. It rejects anything that isn't a role, and verifies that `colors.css`, both favicons and the table above match `colors.json`. Markdown prose, code samples, URL fragments and non-style strings are ignored.
2. **Shipped gate**, `npm run colors:check:dist` (`scripts/check-built-colors.mjs`), runs after Astro on `dist/`. It reads every color the browser receives: all bundled CSS (including Tailwind preflight and defaults), every inline `style`, `<style>` block, SVG paint and theme-color meta in the HTML. Each value must be `rgb(var(--role))` (any alpha) or the exact day/night value of a role; fully transparent is allowed. Role variables must carry their generated values. It refuses to pass on an empty build. This is what catches colors that no author typed, such as framework defaults or syntax-theme hues.

Both report file, line and a fix, and exit 1 on any finding.

**What is not proven:**
- These are file-level checks, not a per-pixel guarantee.
- Colors computed at runtime in JavaScript (e.g. strings built by concatenation) are checked only where they hit a known sink in source.
- Three.js materials, lighting and shading, texture filtering and anti-aliasing blend role colors into in-between shades. That is expected.
- Third-party thumbnails, iframes and photos are outside the palette and sit under a `scrim`.
- The OG image renderer uses the night roles. LinkedIn slide exports are offline editorial assets, not site surfaces.
- For a new rendering API, add a sink and a failing regression case before using it.
