import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const frontMatter = require('front-matter');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const REPO_ROOT = path.resolve(__dirname, '..', '..');
export const JOURNAL_DIR = path.join(REPO_ROOT, 'src', 'content', 'journal');
export const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
export const CANONICAL_FRONTMATTER_ORDER = [
  'title',
  'date',
  'summary',
  'status',
  'category',
  'highlights',
  'audioUrl',
  'linkedin_video_urn',
  'publish_social',
  'linkedin',
  'threads',
];

export function normalizeNewlines(value) {
  return value.replace(/\r\n/g, '\n');
}

export function ensureTrailingNewline(value) {
  return value.endsWith('\n') ? value : `${value}\n`;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function formatEntryId(numberValue) {
  return `entry-${String(numberValue).padStart(3, '0')}`;
}

export function normalizeEntryId(rawValue) {
  if (!rawValue) {
    throw new Error('Missing entry identifier.');
  }

  const withoutExt = path.basename(String(rawValue).trim()).replace(/\.md$/i, '');

  if (/^\d+$/.test(withoutExt)) {
    return formatEntryId(Number(withoutExt));
  }

  const match = withoutExt.match(/^entry-(\d+)$/i);
  if (match) {
    return formatEntryId(Number(match[1]));
  }

  return withoutExt;
}

export function getJournalEntrySlugs() {
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((fileName) => /^entry-\d+\.md$/i.test(fileName))
    .map((fileName) => fileName.replace(/\.md$/i, ''))
    .sort();
}

export function getNextEntryId() {
  const currentMax = getJournalEntrySlugs().reduce((maxValue, slug) => {
    const match = slug.match(/^entry-(\d+)$/i);
    return match ? Math.max(maxValue, Number(match[1])) : maxValue;
  }, 0);

  return formatEntryId(currentMax + 1);
}

export function resolveJournalFilePath({ entry, filename, filePath } = {}) {
  if (filePath) {
    return path.resolve(filePath);
  }

  const slug = normalizeEntryId(filename ?? entry ?? getNextEntryId());
  return path.join(JOURNAL_DIR, `${slug}.md`);
}

export function slugFromFilePath(filePath) {
  return path.basename(filePath, '.md');
}

export function stripFrontmatter(rawContent) {
  return normalizeNewlines(rawContent).replace(FRONTMATTER_PATTERN, '').replace(/^\n+/, '');
}

export function readBodyFromFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  return stripFrontmatter(rawContent).trimEnd();
}

export function parseMarkdownFile(filePath) {
  const rawContent = normalizeNewlines(fs.readFileSync(filePath, 'utf8'));
  const attributes = rawContent.startsWith('---\n') ? frontMatter(rawContent).attributes : {};
  const body = stripFrontmatter(rawContent).trimEnd();

  return {
    rawContent,
    attributes,
    body,
  };
}

function formatScalar(key, value) {
  if (typeof value === 'string') {
    const normalized = normalizeNewlines(value).trimEnd();
    if (normalized.includes('\n')) {
      const lines = normalized.split('\n');
      return [`${key}: |`, ...lines.map((line) => `  ${line}`)].join('\n');
    }

    return `${key}: ${JSON.stringify(normalized)}`;
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return `${key}: ${String(value)}`;
  }

  throw new Error(`Unsupported scalar value for ${key}.`);
}

function formatArray(key, values) {
  if (values.length === 0) {
    return `${key}: []`;
  }

  return [
    `${key}:`,
    ...values.map((value) => `  - ${JSON.stringify(String(value))}`),
  ].join('\n');
}

export function orderFrontmatterKeys(attributes) {
  const definedKeys = Object.keys(attributes).filter(
    (key) => attributes[key] !== undefined && attributes[key] !== null
  );

  const knownKeys = CANONICAL_FRONTMATTER_ORDER.filter((key) => definedKeys.includes(key));
  const extraKeys = definedKeys.filter((key) => !CANONICAL_FRONTMATTER_ORDER.includes(key));

  return [...knownKeys, ...extraKeys];
}

export function serializeFrontmatter(attributes) {
  return orderFrontmatterKeys(attributes)
    .map((key) => {
      const value = attributes[key];

      if (Array.isArray(value)) {
        return formatArray(key, value);
      }

      return formatScalar(key, value);
    })
    .join('\n');
}

export function buildMarkdown(attributes, body = '') {
  const serializedFrontmatter = serializeFrontmatter(attributes);
  const normalizedBody = normalizeNewlines(body).replace(/^\n+/, '').trimEnd();

  if (!normalizedBody) {
    return `---\n${serializedFrontmatter}\n---\n`;
  }

  return `---\n${serializedFrontmatter}\n---\n\n${ensureTrailingNewline(normalizedBody)}`;
}

export function writeMarkdownFile(filePath, attributes, body = '') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buildMarkdown(attributes, body), 'utf8');
}

export function readStdin() {
  return new Promise((resolve, reject) => {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    process.stdin.on('end', () => resolve(input));
    process.stdin.on('error', reject);
  });
}

export function journalUrlForSlug(slug) {
  return `https://relearn.ing/journal/${slug}/`;
}
