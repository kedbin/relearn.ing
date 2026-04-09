#!/usr/bin/env node

import fs from 'node:fs';
import { parseArgs } from 'node:util';
import {
  buildMarkdown,
  journalUrlForSlug,
  parseMarkdownFile,
  readBodyFromFile,
  resolveJournalFilePath,
  slugFromFilePath,
} from './lib/journal.mjs';

function usage() {
  console.log(`Usage:
  node scripts/update-journal-frontmatter.mjs --entry entry-054 [options]

Options:
  --entry <entry-054>                Target entry id
  --filename <entry-054.md>          Target filename in src/content/journal
  --file <path>                      Target explicit path
  --title <text>
  --summary <text>
  --status <Draft|Published>
  --category <text>
  --date <YYYY-MM-DD>
  --highlight <text>                 Repeat to replace highlights
  --clear-highlights                 Replace highlights with []
  --audio-url <url>                  Set audioUrl
  --clear-audio-url                  Remove audioUrl
  --linkedin-video-urn <urn>         Set linkedin_video_urn
  --clear-linkedin-video-urn         Remove linkedin_video_urn
  --publish-social                   Set publish_social to true
  --no-publish-social                Set publish_social to false
  --linkedin <text>
  --linkedin-file <path>
  --linkedin-headline <text>         Build a LinkedIn stub from a headline
  --threads <text>
  --threads-file <path>
  --threads-headline <text>          Build a Threads stub from a headline
  --body-file <path>                 Replace body with file contents (frontmatter stripped)
  --dry-run                          Print updated file instead of writing
  --help                             Show this help
`);
}

function maybeReadText({ directText, filePath }) {
  if (filePath) {
    return fs.readFileSync(filePath, 'utf8').trimEnd();
  }

  if (directText) {
    return directText.trimEnd();
  }

  return undefined;
}

function buildLinkedInStub(headline, slug) {
  return `${headline}\n\nFull draft:\n\n${journalUrlForSlug(slug)}`;
}

function buildThreadsStub(headline, slug) {
  return `${headline}\n\nrelearn.ing/journal/${slug}/`;
}

const { values } = parseArgs({
  options: {
    entry: { type: 'string' },
    filename: { type: 'string' },
    file: { type: 'string' },
    title: { type: 'string' },
    summary: { type: 'string' },
    status: { type: 'string' },
    category: { type: 'string' },
    date: { type: 'string' },
    highlight: { type: 'string', multiple: true },
    'clear-highlights': { type: 'boolean', default: false },
    'audio-url': { type: 'string' },
    'clear-audio-url': { type: 'boolean', default: false },
    'linkedin-video-urn': { type: 'string' },
    'clear-linkedin-video-urn': { type: 'boolean', default: false },
    'publish-social': { type: 'boolean', default: false },
    'no-publish-social': { type: 'boolean', default: false },
    linkedin: { type: 'string' },
    'linkedin-file': { type: 'string' },
    'linkedin-headline': { type: 'string' },
    threads: { type: 'string' },
    'threads-file': { type: 'string' },
    'threads-headline': { type: 'string' },
    'body-file': { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
  allowPositionals: false,
});

if (values.help) {
  usage();
  process.exit(0);
}

if (!values.entry && !values.filename && !values.file) {
  usage();
  console.error('Error: provide --entry, --filename, or --file.');
  process.exit(1);
}

const targetPath = resolveJournalFilePath({
  entry: values.entry,
  filename: values.filename,
  filePath: values.file,
});

if (!fs.existsSync(targetPath)) {
  console.error(`Error: ${targetPath} does not exist.`);
  process.exit(1);
}

const { attributes, body } = parseMarkdownFile(targetPath);
const nextAttributes = { ...attributes };
const slug = slugFromFilePath(targetPath);
let nextBody = body;

for (const key of ['title', 'summary', 'status', 'category', 'date']) {
  if (values[key] !== undefined) {
    nextAttributes[key] = values[key];
  }
}

if (values.highlight?.length) {
  nextAttributes.highlights = values.highlight;
}

if (values['clear-highlights']) {
  nextAttributes.highlights = [];
}

if (values['audio-url'] !== undefined) {
  nextAttributes.audioUrl = values['audio-url'];
}

if (values['clear-audio-url']) {
  delete nextAttributes.audioUrl;
}

if (values['linkedin-video-urn'] !== undefined) {
  nextAttributes.linkedin_video_urn = values['linkedin-video-urn'];
}

if (values['clear-linkedin-video-urn']) {
  delete nextAttributes.linkedin_video_urn;
}

if (values['publish-social']) {
  nextAttributes.publish_social = true;
}

if (values['no-publish-social']) {
  nextAttributes.publish_social = false;
}

const linkedInText = maybeReadText({
  directText: values.linkedin,
  filePath: values['linkedin-file'],
});
if (linkedInText !== undefined) {
  nextAttributes.linkedin = linkedInText;
} else if (values['linkedin-headline']) {
  nextAttributes.linkedin = buildLinkedInStub(values['linkedin-headline'], slug);
}

const threadsText = maybeReadText({
  directText: values.threads,
  filePath: values['threads-file'],
});
if (threadsText !== undefined) {
  nextAttributes.threads = threadsText;
} else if (values['threads-headline']) {
  nextAttributes.threads = buildThreadsStub(values['threads-headline'], slug);
}

if (values['body-file']) {
  nextBody = readBodyFromFile(values['body-file']);
}

const output = buildMarkdown(nextAttributes, nextBody);

if (values['dry-run']) {
  process.stdout.write(output);
} else {
  fs.writeFileSync(targetPath, output, 'utf8');
  console.log(`Updated ${targetPath}`);
}
