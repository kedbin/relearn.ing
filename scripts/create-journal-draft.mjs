#!/usr/bin/env node

import fs from 'node:fs';
import { parseArgs } from 'node:util';
import {
  buildMarkdown,
  journalUrlForSlug,
  readBodyFromFile,
  readStdin,
  resolveJournalFilePath,
  slugFromFilePath,
  todayIsoDate,
  writeMarkdownFile,
} from './lib/journal.mjs';

function usage() {
  console.log(`Usage:
  node scripts/create-journal-draft.mjs --title "..." [options]

Options:
  --entry <entry-054>            Use a specific entry id (defaults to next entry)
  --filename <entry-054.md>      Use a specific filename in src/content/journal
  --file <path>                  Write to an explicit path
  --title <text>                 Entry title (required)
  --summary <text>               Summary (defaults to title)
  --status <Draft>               Status (defaults to Draft)
  --category <text>              Category (defaults to Relearn Engineering / AI Engineering)
  --date <YYYY-MM-DD>            Date (defaults to today)
  --highlight <text>             Repeat for each highlight
  --body <markdown>              Inline body markdown
  --body-file <path>             Read body from file and strip existing frontmatter
  --linkedin <text>              Full LinkedIn post body
  --linkedin-file <path>         Read LinkedIn post body from file
  --linkedin-headline <text>     Build a LinkedIn stub from a headline
  --threads <text>               Full Threads post body
  --threads-file <path>          Read Threads post body from file
  --threads-headline <text>      Build a Threads stub from a headline
  --no-publish-social            Set publish_social to false (default is true)
  --overwrite                    Overwrite the target file if it exists
  --dry-run                      Print output instead of writing file
  --help                         Show this help

If stdin is piped and no --body/--body-file is supplied, stdin becomes the body.
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
    body: { type: 'string' },
    'body-file': { type: 'string' },
    linkedin: { type: 'string' },
    'linkedin-file': { type: 'string' },
    'linkedin-headline': { type: 'string' },
    threads: { type: 'string' },
    'threads-file': { type: 'string' },
    'threads-headline': { type: 'string' },
    'no-publish-social': { type: 'boolean', default: false },
    overwrite: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
  allowPositionals: false,
});

if (values.help) {
  usage();
  process.exit(0);
}

if (!values.title) {
  usage();
  console.error('Error: --title is required.');
  process.exit(1);
}

const outputPath = resolveJournalFilePath({
  entry: values.entry,
  filename: values.filename,
  filePath: values.file,
});

if (fs.existsSync(outputPath) && !values.overwrite && !values['dry-run']) {
  console.error(`Error: ${outputPath} already exists. Use --overwrite to replace it.`);
  process.exit(1);
}

const slug = slugFromFilePath(outputPath);

let body = '';
if (values['body-file']) {
  body = readBodyFromFile(values['body-file']);
} else if (values.body) {
  body = values.body.trimEnd();
} else if (!process.stdin.isTTY) {
  body = (await readStdin()).trimEnd();
}

const linkedInText =
  maybeReadText({ directText: values.linkedin, filePath: values['linkedin-file'] }) ??
  buildLinkedInStub(values['linkedin-headline'] ?? values.title, slug);

const threadsText =
  maybeReadText({ directText: values.threads, filePath: values['threads-file'] }) ??
  buildThreadsStub(values['threads-headline'] ?? values.title, slug);

const attributes = {
  title: values.title,
  date: values.date ?? todayIsoDate(),
  summary: values.summary ?? values.title,
  status: values.status ?? 'Draft',
  category: values.category ?? 'Relearn Engineering / AI Engineering',
  highlights: values.highlight ?? [],
  publish_social: !values['no-publish-social'],
  linkedin: linkedInText,
  threads: threadsText,
};

const output = buildMarkdown(attributes, body);

if (values['dry-run']) {
  process.stdout.write(output);
} else {
  writeMarkdownFile(outputPath, attributes, body);
  console.log(`Created ${outputPath}`);
}
