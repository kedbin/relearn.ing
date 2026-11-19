import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { checkCss, checkHtml, checkDist } from './check-built-colors.mjs';
import roles from '../src/styles/colors.json' with { type: 'json' };

const day = roles.accent.light, night = roles.accent.dark;

const deniedCss = [
  '.a{color:#ff7a96}',                         // the retired pink (night)
  '.a{color:#b02d50}',                         // the retired pink (day)
  '.a{color:rgb(255 122 150)}',
  '.a{border-color:#9ca3af}',                  // Tailwind default gray
  '.a{--tw-ring-color: rgb(147 197 253 / .5)}',// Tailwind default ring
  '.a{box-shadow:0 1px 3px rgb(0 0 0 / .1)}',  // Tailwind default shadow
  '.a{background:linear-gradient(white, rgb(var(--bg)))}',
  '.a{color:hotpink}',
  '.a{color:rgb(var(--accent-2))}',
  ':root{--accent: 255 0 0}',                  // role overwritten with an off-palette value
  '.a{color:var(--shiki-dark)}',
];
const allowedCss = [
  '.a{color:rgb(var(--accent) / .5); background:transparent; border-color:currentColor}',
  `.a{color:${day}} .b{color:${night}}`,
  '.a{--tw-shadow: 0 0 #0000; white-space:nowrap}',
  '.a{color:var(--astro-code-token-keyword)}',
  `:root{--accent: ${day.slice(1).match(/../g).map(x=>parseInt(x,16)).join(' ')}}`,
];
for (const css of deniedCss) test('dist rejects ' + css, () => assert.ok(checkCss('x.css', css).length > 0));
for (const css of allowedCss) test('dist allows ' + css, () => assert.deepEqual(checkCss('x.css', css), []));

test('dist checks inline styles, SVG paint and theme-color in HTML', () => {
  const bad = '<meta name="theme-color" content="#ffffff"><p style="color:#ff7a96">x</p><svg><path fill="#C4704F"/></svg><span style="--shiki-dark:#4D9375">';
  const errors = checkHtml('page.html', bad);
  assert.equal(errors.length, 4, errors.join('\n'));
  assert.match(errors[0], /^page\.html:1: /);
  assert.deepEqual(checkHtml('ok.html', `<meta name="theme-color" content="${roles.bg.light}"><path fill="rgb(var(--accent))" stroke="none"/>`), []);
});

test('the real gate exits nonzero on an injected off-palette build', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-'));
  fs.mkdirSync(path.join(dir, '_astro'));
  fs.writeFileSync(path.join(dir, '_astro', 'a.css'), '.x{color:#ff7a96}');
  fs.writeFileSync(path.join(dir, 'index.html'), '<p>ok</p>');
  assert.throws(() => execFileSync(process.execPath, ['scripts/check-built-colors.mjs', dir], { stdio: 'pipe' }), (e) => e.status === 1 && /#ff7a96/.test(String(e.stderr)));
  fs.writeFileSync(path.join(dir, '_astro', 'a.css'), '.x{color:rgb(var(--accent))}');
  assert.match(execFileSync(process.execPath, ['scripts/check-built-colors.mjs', dir]).toString(), /match the palette/);
  fs.rmSync(dir, { recursive: true });
});

test('an empty build never passes', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-empty-'));
  assert.ok(checkDist(dir).errors.length > 0);
  fs.rmSync(dir, { recursive: true });
});
