#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fm from 'front-matter';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const journalDir = resolve(repoRoot, 'src/content/journal');
const defaultOutDir = '/home/kedbin/projects/relearn-videos/out';
const width = 1080;
const height = 1350;

const themes = {
  editorial: { bg: '#020617', fg: '#e2e8f0', muted: '#94a3b8', accent: '#2dd4bf', accent2: '#a78bfa', warm: '#f59e0b' },
  minimal: { bg: '#0b1020', fg: '#f8fafc', muted: '#94a3b8', accent: '#e2e8f0', accent2: '#cbd5e1', warm: '#94a3b8' },
  signal: { bg: '#050816', fg: '#e5f4ff', muted: '#8aa4c4', accent: '#38bdf8', accent2: '#818cf8', warm: '#f59e0b' },
  ember: { bg: '#130a0a', fg: '#fff7ed', muted: '#fdba74', accent: '#fb7185', accent2: '#f97316', warm: '#fbbf24' },
};

function parseArgs(argv) {
  const args = { theme: 'editorial', maxHighlightSlides: 4 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--entry') args.entry = argv[++i];
    else if (arg === '--file') args.file = argv[++i];
    else if (arg === '--plan-file') args.planFile = argv[++i];
    else if (arg === '--theme') args.theme = argv[++i];
    else if (arg === '--output') args.output = argv[++i];
    else if (arg === '--preview-dir') args.previewDir = argv[++i];
    else if (arg === '--html-output') args.htmlOutput = argv[++i];
    else if (arg === '--max-highlight-slides') args.maxHighlightSlides = Number(argv[++i]);
    else if (arg === '-h' || arg === '--help') {
      console.log(`Usage: generate-linkedin-slides-html.mjs --entry entry-XXX --output out.pdf [--preview-dir dir] [--theme editorial|minimal|signal|ember] [--html-output file]`);
      process.exit(0);
    } else throw new Error(`Unknown arg: ${arg}`);
  }
  if (!args.entry && !args.file) throw new Error('Provide --entry or --file');
  if (!args.output) throw new Error('Provide --output');
  return args;
}

function normalizeEntry(entry) {
  return entry?.startsWith('entry-') ? entry : `entry-${entry}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function stripMarkdown(value = '') {
  return String(value)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstSentence(value = '', fallback = '', max = 220) {
  const clean = stripMarkdown(value || fallback);
  const match = clean.match(/^(.+?[.!?])\s/);
  const sentence = match?.[1] || clean;
  return sentence.length > max ? `${sentence.slice(0, max - 1).trim()}…` : sentence;
}

function compactPhrase(value = '', fallback = '', max = 84) {
  const clean = stripMarkdown(value || fallback);
  const phrase = clean
    .replace(/^(The|A|An)\s+/i, '')
    .split(/[:;—–-]/)[0]
    .trim();
  const text = phrase || clean || fallback;
  if (text.length <= max) return text;
  const words = text.split(/\s+/);
  const kept = [];
  for (const word of words) {
    const next = [...kept, word].join(' ');
    if (next.length > max) break;
    kept.push(word);
  }
  return kept.join(' ') || text.slice(0, max).trim();
}

function slidePhrase(value = '', fallback = '') {
  const text = stripMarkdown(value || fallback);
  const lower = text.toLowerCase();
  if (/syntax.*cheap|code generation|bad architecture|bad code/.test(lower)) return 'Cheap syntax. Expensive architecture.';
  if (/builder|typing|implementation details|constraints|handoff/.test(lower)) return 'Builders design constraints.';
  if (/pipeline|roles|artifacts|callbacks|verification/.test(lower)) return 'Roles. Artifacts. Callbacks.';
  if (/domain|language|semantic|bounded/.test(lower)) return 'Language anchors the model.';
  if (/test|tdd|verify|ci|gate/.test(lower)) return 'Tests set the speed limit.';
  if (/deep module|module|interface|architecture/.test(lower)) return 'Deep modules shrink context.';
  if (/agent|probabilistic|model|ai/.test(lower)) return 'Structure keeps AI useful.';
  return compactPhrase(text, fallback, 52);
}

function supportingPhrase(value = '', fallback = '') {
  const text = stripMarkdown(value || fallback);
  const lower = text.toLowerCase();
  if (/syntax.*cheap|code generation|bad architecture/.test(lower)) return 'AI amplifies the structure it is placed inside.';
  if (/builder|typing|implementation details|constraints/.test(lower)) return 'The scarce skill is judgment at the boundary.';
  if (/pipeline|roles|artifacts|callbacks/.test(lower)) return 'Fast workers need explicit ownership and feedback.';
  if (/domain|language/.test(lower)) return 'Shared words prevent semantic drift.';
  if (/test|tdd/.test(lower)) return 'Executable checks beat persuasive prose.';
  return compactPhrase(text, fallback, 88);
}

function keywordEmoji(text = '') {
  const lower = text.toLowerCase();
  if (/test|tdd|verify|ci|gate|review/.test(lower)) return '✅';
  if (/domain|language|semantic|bounded|context/.test(lower)) return '🧭';
  if (/module|architecture|interface|deep|structure/.test(lower)) return '🏗️';
  if (/ai|agent|model|probabilistic|llm/.test(lower)) return '🤖';
  if (/audio|listen|voice/.test(lower)) return '🎧';
  if (/watch|video|youtube/.test(lower)) return '▶️';
  if (/read|article|relearn/.test(lower)) return '📖';
  return '✨';
}

function bodyParagraphs(body) {
  return body
    .split(/\n{2,}/)
    .map((block) => stripMarkdown(block))
    .filter((block) => block && !block.startsWith('References'))
    .filter((block) => !/^Full article at relearn\.ing/i.test(block))
    .filter((block) => !/^Watch:/i.test(block))
    .filter((block) => !/^Listen:/i.test(block))
    .filter((block) => block.length > 40);
}

function findChrome() {
  for (const candidate of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('Missing Chrome/Chromium; needed for HTML slide screenshot/PDF rendering');
}

function buildSlides(entryId, attrs, body, maxHighlightSlides) {
  const title = attrs.title || entryId;
  const summary = attrs.summary || 'A new relearn.ing journal entry.';
  const category = attrs.category || 'Relearn Engineering';
  const date = attrs.date || '';
  const highlights = Array.isArray(attrs.highlights) ? attrs.highlights.map(stripMarkdown).filter(Boolean) : [];
  const paragraphs = bodyParagraphs(body);
  const fallbackInsights = [
    'Fundamentals compound.',
    'Language anchors the model.',
    'Tests set the speed limit.',
    'Deep modules shrink context.',
  ];
  while (highlights.length < Math.max(4, maxHighlightSlides)) {
    highlights.push(fallbackInsights[highlights.length % fallbackInsights.length]);
  }
  const links = [
    ['Full article', `https://relearn.ing/journal/${entryId}/`],
    attrs.youtube_url ? ['Watch', attrs.youtube_url] : null,
    attrs.audioUrl ? ['Listen', attrs.audioUrl] : null,
  ].filter(Boolean);

  // Dynamic slide generation from entry content
  const p1 = paragraphs[0] || summary;
  const p2 = paragraphs[1] || highlights[0];
  const p3 = paragraphs[2] || highlights[1];
  const p4 = paragraphs[3] || highlights[2];

  const slides = [
    { kind: 'cover', layout: 'cover', marker: '01', eyebrow: category.replace(/\/.*/, '').trim() || 'AI-assisted content', title: slidePhrase(title, title), body: firstSentence(summary, summary, 140), note: 'Swipe for the full story →' },
    { kind: 'problem', layout: 'problem', marker: '02', eyebrow: 'The problem', title: slidePhrase(p1, highlights[0]), body: supportingPhrase(p1, highlights[0]), bullets: paragraphs.length > 2 ? [compactPhrase(paragraphs[1], highlights[1], 42), compactPhrase(paragraphs[2], highlights[2], 42), compactPhrase(paragraphs[3], highlights[3], 42)] : highlights.slice(0, 3).map(h => compactPhrase(h, '', 42)) },
    { kind: 'stack', layout: 'stack', marker: '03', eyebrow: 'What changed', title: 'Key shifts that made the difference.', body: 'The core insights:', bullets: highlights.slice(0, Math.min(4, maxHighlightSlides)).map(h => compactPhrase(h, '', 90)) },
    { kind: 'compare', layout: 'compare', marker: '04', eyebrow: 'Before / After', title: 'The pivot that mattered most.', body: firstSentence(p2, highlights[0], 120) },
    { kind: 'quote', layout: 'quote', marker: '05', eyebrow: 'Takeaway', title: slidePhrase(highlights[0], title), body: supportingPhrase(highlights[0], summary) },
    { kind: 'flow', layout: 'flow', marker: '06', eyebrow: 'How it works', title: 'The pattern behind the result.', body: 'The same approach applies beyond this one story:', bullets: highlights.slice(1, 4).map(h => compactPhrase(h, '', 42)) },
    { kind: 'takeaway', layout: 'takeaway', marker: '07', eyebrow: 'Bottom line', title: slidePhrase(highlights[highlights.length - 1] || title, title), body: firstSentence(summary, summary, 140) },
    { kind: 'links', layout: 'cta', marker: '08', eyebrow: 'Continue', title: 'Read the full article', body: 'Then watch or listen when you want the narrated version.', links },
  ];
  return slides;
}

function baseCss(theme) {
  return `
    @page { size: ${width}px ${height}px; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: ${width}px; background: linear-gradient(152deg, #03131f 0%, #020617 48%, #11112b 100%); color: ${theme.fg}; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .deck { width: ${width}px; }
    .slide { position: relative; width: ${width}px; height: ${height + 92}px; page-break-after: always; overflow: hidden; padding: 82px 76px 74px; background:
      radial-gradient(circle at 20% 5%, ${theme.accent}24 0, transparent 34%),
      radial-gradient(circle at 95% 22%, ${theme.accent2}24 0, transparent 30%),
      linear-gradient(152deg, #03131f 0%, #020617 48%, #11112b 100%); }
    @media print { .slide { height: ${height}px; } }
    .slide::before { content: ""; position: absolute; inset: 34px; border: 1px solid rgba(148,163,184,.20); border-radius: 44px; pointer-events: none; }
    .slide::after { content: ""; position: absolute; width: 520px; height: 520px; right: -230px; bottom: -160px; border-radius: 999px; border: 62px solid ${theme.accent}22; }
    .layout { position: relative; z-index: 2; height: 100%; display: grid; grid-template-rows: auto 1fr; }
    .topbar { display: flex; justify-content: space-between; align-items: center; gap: 24px; }
    .eyebrow { color: ${theme.accent}; text-transform: uppercase; letter-spacing: .16em; font-weight: 900; font-size: 22px; }
    .marker { color: ${theme.warm}; font-size: 24px; font-weight: 950; }
    .content { align-self: center; min-width: 0; }
    h1, h2 { margin: 0; line-height: .96; letter-spacing: -.055em; font-weight: 950; text-wrap: balance; }
    h1 { font-size: 88px; max-width: 900px; }
    h2 { font-size: 76px; max-width: 900px; }
    .body { max-width: 840px; color: ${theme.fg}; font-size: 34px; line-height: 1.2; margin-top: 34px; text-wrap: balance; }
    .note, .panel { margin-top: 54px; width: fit-content; max-width: 720px; padding: 24px 30px; border-radius: 28px; background: rgba(15,23,42,.74); border: 1px solid rgba(148,163,184,.22); color: ${theme.fg}; font-size: 28px; line-height: 1.18; }
    .foot { position: absolute; left: 76px; right: 76px; bottom: 118px; display: flex; align-items: center; justify-content: space-between; color: rgba(226,232,240,.38); font-size: 22px; letter-spacing: .04em; }
    .progress { display: flex; gap: 12px; }
    .progress span { width: 56px; height: 10px; border-radius: 999px; background: ${theme.accent}; }
    .progress span:nth-child(2) { width: 34px; background: ${theme.accent2}; }
    .progress span:nth-child(3) { width: 20px; background: ${theme.warm}; }
    .bullets { display: grid; gap: 18px; margin-top: 46px; }
    .bullet { position: relative; padding: 24px 28px 24px 72px; border-radius: 26px; background: rgba(15,23,42,.78); border: 1px solid rgba(148,163,184,.20); color: ${theme.fg}; font-size: 28px; line-height: 1.12; }
    .bullet::before { content: ""; position: absolute; left: 28px; top: 32px; width: 18px; height: 18px; border-radius: 999px; background: ${theme.accent}; box-shadow: 0 0 28px ${theme.accent}; }
    .visual { margin-top: 46px; display: grid; gap: 18px; }
    .pill { display: inline-flex; align-items: center; gap: 16px; width: fit-content; padding: 18px 24px; border-radius: 999px; background: rgba(45,212,191,.12); border: 1px solid rgba(45,212,191,.28); color: ${theme.accent}; font-weight: 900; font-size: 24px; letter-spacing: .04em; text-transform: uppercase; }
    .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 46px; }
    .compare-card { min-height: 270px; padding: 28px; border-radius: 30px; background: rgba(15,23,42,.72); border: 1px solid rgba(148,163,184,.18); }
    .compare-card strong { display: block; color: ${theme.accent}; font-size: 26px; margin-bottom: 18px; text-transform: uppercase; letter-spacing: .12em; }
    .compare-card p { margin: 0; color: ${theme.fg}; font-size: 34px; line-height: 1.12; font-weight: 800; }
    .flow-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 46px; }
    .flow-step { min-height: 160px; padding: 22px; border-radius: 28px; background: rgba(15,23,42,.78); border: 1px solid rgba(148,163,184,.20); display: grid; align-content: center; text-align: center; color: ${theme.fg}; font-size: 24px; font-weight: 850; }
    .quote-mark { position: absolute; right: 78px; top: 155px; font-size: 220px; line-height: 1; color: rgba(45,212,191,.11); font-weight: 950; }
    .slide-quote h2 { font-size: 96px; max-width: 760px; }
    .slide-takeaway h2 { font-size: 86px; }
    .links { display: grid; gap: 18px; margin-top: 50px; }
    .link-card { display: grid; grid-template-columns: 210px 1fr; gap: 24px; align-items: center; padding: 26px 28px; border-radius: 28px; background: rgba(15,23,42,.80); border: 1px solid rgba(148,163,184,.20); }
    .link-card.primary { min-height: 136px; border-left: 12px solid ${theme.warm}; background: rgba(245,158,11,.13); }
    .link-card.secondary { opacity: .78; }
    .link-label { color: ${theme.accent}; font-size: 24px; font-weight: 950; text-transform: uppercase; letter-spacing: .12em; }
    .link-url { color: ${theme.fg}; font-size: 30px; line-height: 1.08; overflow-wrap: anywhere; }
  `;
}

function renderSlide(slide, index, total) {
  const titleTag = slide.kind === 'cover' ? 'h1' : 'h2';
  const bullets = slide.bullets?.length ? `<div class="bullets">${slide.bullets.map((b) => `<div class="bullet">${escapeHtml(b)}</div>`).join('')}</div>` : '';
  const compare = slide.kind === 'compare' ? `<div class="compare-grid"><div class="compare-card"><strong>Shallow</strong><p>Many leaky files. More context loss.</p></div><div class="compare-card"><strong>Deep</strong><p>Simple boundary. Safer AI edits.</p></div></div>` : '';
  const flow = slide.kind === 'flow' ? `<div class="flow-row"><div class="flow-step">W1<br/>orchestrates</div><div class="flow-step">W2<br/>audio</div><div class="flow-step">W3<br/>visuals</div><div class="flow-step">Callbacks<br/>sync</div></div>` : '';
  const links = slide.links?.length ? `<div class="links">${slide.links.map(([label, url], linkIndex) => {
    // Use the actual URL from frontmatter, not a generic domain label
    // Truncate for display: show domain + path for readability
    const rawUrl = url || '';
    let displayUrl = rawUrl
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');
    // If the URL is very long, show domain + first path segment for readability
    if (displayUrl.length > 60) {
      const urlObj = new URL(rawUrl);
      const firstSegment = urlObj.pathname.split('/').filter(Boolean)[0] || '';
      displayUrl = firstSegment
        ? `${urlObj.hostname}/${firstSegment}…`
        : urlObj.hostname;
    }
    const emphasis = linkIndex === 0 ? 'primary' : 'secondary';
    return `<div class="link-card ${emphasis}"><div class="link-label">${escapeHtml(label)}</div><div class="link-url">${escapeHtml(displayUrl)}</div></div>`;
  }).join('')}</div>` : '';
  const layout = slide.layout || slide.kind;
  return `<section class="slide slide-${escapeHtml(layout)} slide-kind-${escapeHtml(slide.kind)}">
    <div class="layout">
      ${slide.kind === 'quote' ? '<div class="quote-mark">“</div>' : ''}
      <div class="topbar"><div class="eyebrow">${escapeHtml(slide.eyebrow)}</div><div class="marker">${escapeHtml(slide.marker || String(index).padStart(2, '0'))}/${String(total).padStart(2, '0')}</div></div>
      <main class="content">
        <${titleTag}>${escapeHtml(slide.title)}</${titleTag}>
        ${slide.body ? `<div class="body ${slide.kind === 'links' ? 'muted' : ''}">${escapeHtml(slide.body)}</div>` : ''}
        ${slide.note ? `<div class="note">${escapeHtml(slide.note)}</div>` : ''}
        ${bullets}${compare}${flow}${links}
        ${slide.kicker ? `<aside class="panel"><div class="kicker">${escapeHtml(slide.kicker)}</div></aside>` : ''}
      </main>
      <footer class="foot"><div class="progress"><span></span><span></span><span></span></div><div>relearn.ing</div></footer>
    </div>
  </section>`;
}

function htmlDocument(slides, theme, onlyIndex = null) {
  const selected = onlyIndex == null ? slides : [slides[onlyIndex]];
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=${width}, initial-scale=1"><style>${baseCss(theme)}</style></head><body><main class="deck">${selected.map((slide, idx) => renderSlide(slide, onlyIndex == null ? idx + 1 : onlyIndex + 1, slides.length)).join('')}</main></body></html>`;
}

function runChrome(args) {
  const chrome = findChrome();
  execFileSync(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none', '--default-background-color=020617', ...args], { stdio: 'ignore' });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const entryId = normalizeEntry(args.entry || args.file?.match(/entry-\d+/)?.[0]);
  const entryFile = resolve(args.file || `${journalDir}/${entryId}.md`);
  if (!existsSync(entryFile)) throw new Error(`Missing journal entry: ${entryFile}`);
  const parsed = fm(readFileSync(entryFile, 'utf8'));
  const theme = themes[args.theme] || themes.editorial;
  const slides = buildSlides(entryId, parsed.attributes, parsed.body, args.maxHighlightSlides);
  const output = resolve(args.output);
  mkdirSync(dirname(output), { recursive: true });
  const htmlOutput = resolve(args.htmlOutput || `${defaultOutDir}/${entryId}-linkedin-slides.html`);
  mkdirSync(dirname(htmlOutput), { recursive: true });
  writeFileSync(htmlOutput, htmlDocument(slides, theme));

  if (args.previewDir) {
    const previewDir = resolve(args.previewDir);
    rmSync(previewDir, { recursive: true, force: true });
    mkdirSync(previewDir, { recursive: true });
    slides.forEach((_, index) => {
      const slideHtml = resolve(previewDir, `${String(index + 1).padStart(2, '0')}.html`);
      const slidePng = resolve(previewDir, `${String(index + 1).padStart(2, '0')}.png`);
      writeFileSync(slideHtml, htmlDocument(slides, theme, index));
      runChrome([`--window-size=${width},${height + 92}`, `--screenshot=${slidePng}`, pathToFileURL(slideHtml).href]);
    });
  }

  runChrome(['--print-to-pdf-no-header', `--print-to-pdf=${output}`, pathToFileURL(htmlOutput).href]);
  console.log(output);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
