// Shipped-output palette gate (see docs/COLOR.md).
// The source gate (check-colors.mjs) reads what we author. This one reads what the browser
// actually receives in dist/: every CSS file, every inline style and SVG paint in the HTML, and
// the SVG files. Each color must be a palette role (rgb(var(--role)), any alpha) or the exact
// day/night value of a role. Anything else — a framework default gray, a syntax-theme hue,
// a stray pink — fails the build with file, the offending value and a fix.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';
import values from 'postcss-value-parser';
import roles from '../src/styles/colors.json' with { type: 'json' };

const names = Object.keys(roles);
const hex = new Set(names.flatMap((k) => [roles[k].light, roles[k].dark]).map((v) => v.toLowerCase()));
const channels = new Set([...hex].map((h) => h.slice(1).match(/../g).map((x) => parseInt(x, 16)).join(' ')));
const roleVar = new RegExp('^--(?:' + names.join('|') + ')$');
const neutral = /^(?:none|transparent|currentcolor|inherit|initial|unset|revert|canvastext|canvas)$/i;
const pigment = /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)$/i;
// CSS named colors that could hide a hue. `transparent`/`currentColor` are neutral above.
const namedColor = /^(?:white|black|red|pink|hotpink|deeppink|crimson|magenta|fuchsia|orange|yellow|green|blue|purple|violet|gray|grey|silver|maroon|navy|teal|olive|lime|aqua|cyan|salmon|coral|tomato|gold|indigo|plum|orchid|brown|tan|beige|ivory|khaki|lavender)$/i;
// Properties that never carry color even if a word looks like one (e.g. `white-space`).
const colorless = /^(?:white-space|font|font-family|content|grid-template-areas|animation-name|transition-property|will-change)$/i;

/** 0 0 0 / .1 → "0 0 0" ; 0,0,0,.1 → "0 0 0" */
function rgbChannels(args) {
  const parts = args.replace(/\/.*$/, '').split(/[\s,]+/).filter(Boolean);
  if (parts.length < 3 || parts.some((p) => !/^\d+(\.\d+)?$/.test(p))) return null;
  return parts.slice(0, 3).map(Number).join(' ');
}

function expandHex(h) {
  const x = h.slice(1).toLowerCase();
  if (x.length === 3 || x.length === 4) return { rgb: '#' + x.slice(0, 3).replace(/./g, (c) => c + c), alpha: x[3] ?? 'f' };
  return { rgb: '#' + x.slice(0, 6), alpha: x.slice(6) || 'ff' };
}

export function checkValue(prop, value) {
  const found = [];
  if (colorless.test(prop)) return found;
  if (prop.startsWith('--') && !roleVar.test(prop) && !/color|bg|shadow|ring|fill|stroke|code|shiki|tw-/i.test(prop)) return found;
  values(value).walk((node) => {
    if (node.type === 'function') {
      if (node.value === 'url') return false;
      if (node.value === 'var') {
        const name = node.nodes[0]?.value ?? '';
        if (/^--(?:shiki|astro-code)-/.test(name) && !/^--astro-code-/.test(name)) found.push(values.stringify(node));
        return false; // vars resolve to declarations checked elsewhere in the same output
      }
      if (pigment.test(node.value)) {
        const inner = values.stringify(node.nodes);
        if (/^\s*var\(--([\w-]+)\)/.test(inner)) {
          if (!names.includes(inner.match(/^\s*var\(--([\w-]+)\)/)[1])) found.push(values.stringify(node));
        } else {
          const ch = /^rgba?$/i.test(node.value) ? rgbChannels(inner) : null;
          // Fully transparent black is how Tailwind writes "no shadow"; it paints nothing.
          const invisible = ch === '0 0 0' && /\/\s*0\s*$|,\s*0\s*$/.test(inner);
          if (!invisible && !(ch && channels.has(ch))) found.push(values.stringify(node));
        }
        return false;
      }
    }
    if (node.type === 'word') {
      if (/^#[\da-f]{3,8}$/i.test(node.value)) {
        const { rgb, alpha } = expandHex(node.value);
        if (!hex.has(rgb) && !/^0+$/.test(alpha)) found.push(node.value);
      } else if (namedColor.test(node.value) && !neutral.test(node.value)) found.push(node.value);
    }
  });
  return found;
}

export function checkCss(file, css, baseLine = 1) {
  const errors = [];
  const root = postcss.parse(css);
  root.walkDecls((d) => {
    if (roleVar.test(d.prop)) {
      const ch = d.value.trim();
      if (!channels.has(ch)) errors.push(`${file}:${baseLine + d.source.start.line - 1}: ${d.prop}: ${ch} is not its day/night value — run npm run colors:sync`);
      return;
    }
    for (const v of checkValue(d.prop, d.value))
      errors.push(`${file}:${baseLine + d.source.start.line - 1}: ${d.prop}: ${v} is outside the palette — use a role from docs/COLOR.md`);
  });
  return errors;
}

export function checkHtml(file, html) {
  const errors = [];
  const lineOf = (i) => html.slice(0, i).split('\n').length;
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) errors.push(...checkCss(file, m[1], lineOf(m.index)));
  for (const m of html.matchAll(/\sstyle="([^"]*)"/gi)) errors.push(...checkCss(file, '*{' + m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'") + '}', lineOf(m.index)));
  for (const m of html.matchAll(/\s(fill|stroke|stop-color|flood-color|color)="([^"]*)"/gi)) {
    if (m[1].toLowerCase() === 'color' && !/^<(?:svg|path|g|rect|circle|line|polyline|polygon|text)\b/i.test(html.slice(html.lastIndexOf('<', m.index), m.index))) continue;
    for (const v of checkValue(m[1], m[2])) errors.push(`${file}:${lineOf(m.index)}: ${m[1]}="${v}" is outside the palette — use a role from docs/COLOR.md`);
  }
  for (const m of html.matchAll(/<meta\s+name="theme-color"\s+content="([^"]+)"/gi)) {
    if (!hex.has(m[1].toLowerCase())) errors.push(`${file}:${lineOf(m.index)}: theme-color ${m[1]} is outside the palette`);
  }
  return errors;
}

function* files(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) yield* files(p);
    else yield p;
  }
}

export function checkDist(dir = 'dist') {
  if (!fs.existsSync(dir)) throw Error(`${dir}/ not found — run astro build first`);
  const errors = [];
  let css = 0, html = 0;
  for (const p of files(dir)) {
    const rel = path.relative('.', p).replaceAll('\\', '/');
    if (p.endsWith('.css')) { css++; errors.push(...checkCss(rel, fs.readFileSync(p, 'utf8'))); }
    else if (p.endsWith('.html') || p.endsWith('.svg')) { html++; errors.push(...checkHtml(rel, fs.readFileSync(p, 'utf8'))); }
  }
  if (!css || !html) errors.push(`${dir}: nothing to check (${css} CSS, ${html} HTML/SVG) — the gate refuses to pass on an empty build`);
  return { errors: [...new Set(errors)], css, html };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { errors, css, html } = checkDist(process.argv[2] ?? 'dist');
  for (const e of errors.slice(0, 200)) console.error(e);
  if (errors.length) {
    console.error(`\n${errors.length} shipped color(s) outside the relearn.ing palette.`);
    process.exitCode = 1;
  } else console.log(`Shipped colors match the palette (${css} CSS, ${html} HTML/SVG files).`);
}
