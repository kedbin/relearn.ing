// Renders public/og.png (1200×630) from the live entry data, in the hero's visual language.
// usage: node scripts/og/render-og.mjs   (requires `playwright` resolvable + a built site's search.json at dist/)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const entries = JSON.parse(readFileSync(root + 'dist/search.json', 'utf8'));
const font = (p) => 'data:font/woff2;base64,' + readFileSync(root + 'node_modules/' + p).toString('base64');

const ts = (d) => new Date(d + 'T12:00:00Z').getTime();
const sorted = [...entries].sort((a, b) => ts(a.date) - ts(b.date));
const start = ts(sorted[0].date) - 6 * 864e5, end = Math.max(Date.now(), ts(sorted.at(-1).date)) + 6 * 864e5;
const col = { Engineering: '#4ad0be', Life: '#c496ff', Work: '#eebe5a' };
const bars = sorted.map((e, i) => {
  const x = ((ts(e.date) - start) / (end - start)) * 1040;
  const h = 18 + Math.sqrt(e.minutes / 15) * 70;
  const last = i === sorted.length - 1;
  return `<rect x="${x.toFixed(1)}" y="${110 - h}" width="3" height="${h}" fill="${last ? '#8a9bff' : col[e.domain]}" opacity="${last ? 1 : 0.85}"/>`;
}).join('');

const html = `<!doctype html><html><head><style>
@font-face{font-family:IS;src:url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2')})}
@font-face{font-family:IS;font-style:italic;src:url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')})}
@font-face{font-family:GM;src:url(${font('@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2')})}
*{margin:0}body{width:1200px;height:630px;background:#0d0f14;color:#e4e8f0;font-family:GM;position:relative;overflow:hidden}
.top{position:absolute;left:80px;right:80px;top:64px;display:flex;justify-content:space-between;font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:#626a7a}
.w{position:absolute;left:72px;top:96px;font-family:IS;font-size:228px;letter-spacing:-.045em;line-height:1}
.d{color:#8a9bff;font-size:.42em;vertical-align:.42em;margin:0 .07em}
.i{font-style:italic;background:linear-gradient(90deg,#e4e8f0 30%,rgba(228,232,240,.15));-webkit-background-clip:text;color:transparent;padding-right:.08em}
.def{position:absolute;left:80px;top:372px;font-family:IS;font-size:34px;color:#949cac}
svg{position:absolute;left:80px;bottom:70px}
.ax{position:absolute;left:80px;right:80px;bottom:40px;display:flex;justify-content:space-between;font-size:14px;color:#626a7a;letter-spacing:.06em}
</style></head><body>
<div class="top"><span>A public lab notebook</span><span>${entries.length} entries · relearn.ing</span></div>
<div class="w">re<span class="d">·</span>learn<span class="d">·</span><span class="i">ing</span></div>
<div class="def"><i>verb, present participle</i> — rebuilding how you work and live, on purpose.</div>
<svg width="1040" height="112">${bars}<rect x="0" y="110" width="1040" height="1" fill="#e4e8f0" opacity=".15"/></svg>
<div class="ax"><span>${new Date(start + 6 * 864e5).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}</span><span style="color:#8a9bff">NOW</span></div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
writeFileSync(root + 'public/og.png', await page.screenshot({ type: 'png' }));
await browser.close();
console.log('wrote public/og.png');
