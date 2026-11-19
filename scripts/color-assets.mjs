import { readFileSync, writeFileSync } from 'node:fs';
import roles from '../src/styles/colors.json' with { type: 'json' };

const entries = Object.entries(roles);
for (const [name, { light, dark, role }] of entries) {
  if (!/^[a-z][a-z0-9-]*$/.test(name) || ![light, dark].every(v => /^#[a-f0-9]{6}$/.test(v)) || !role)
    throw Error('Invalid palette role: ' + name);
}
const rgb = hex => hex.slice(1).match(/../g).map(x => parseInt(x,16)).join(' ');
const modes = ['light', 'dark'];
const css = '/* Generated from colors.json; see docs/COLOR.md. */\n' + modes.map(mode =>
  (mode === 'light' ? ':root' : 'html.dark') + ' {\n' +
  entries.map(([k,v]) => '  --' + k + ': ' + rgb(v[mode]) + ';').join('\n') + '\n}\n').join('\n');

const table = ['| Role | Light | Dark | Use |','|---|---|---|---|', ...entries.map(([k,v]) =>
  '| `' + k + '` | ' + v.light + ' | ' + v.dark + ' | ' + v.role + ' |')].join('\n');
const doc = readFileSync('docs/COLOR.md','utf8').replaceAll('\r\n','\n');
const block = /<!-- roles -->[\s\S]*?<!-- end roles -->/;
if (!block.test(doc)) throw Error('Missing role table in docs/COLOR.md');
const assets = {
  'docs/COLOR.md': doc.replace(block, '<!-- roles -->\n'+table+'\n<!-- end roles -->'),
  'src/styles/colors.css': css,
};
for (const mode of modes) {
  const c = k => roles[k][mode];
  assets['public/favicon'+(mode === 'light' ? '-light' : '')+'.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="${c('bg')}"/>
  <text x="15" y="23" text-anchor="middle" font-family="'Instrument Serif', Georgia, serif" font-style="italic" font-size="24" fill="${c('text')}">r</text>
  <rect x="21" y="19" width="4" height="4" fill="${c('accent')}"/>
</svg>
`;
}
export function checkAssets(write = false) {
  for (const [file, expected] of Object.entries(assets)) {
    if (write) writeFileSync(file, expected);
    else if (readFileSync(file, 'utf8').replaceAll('\r\n','\n') !== expected)
      throw Error(file + ':1: generated palette drift; run npm run colors:sync');
  }
}
if (process.argv.includes('--write')) checkAssets(true);
