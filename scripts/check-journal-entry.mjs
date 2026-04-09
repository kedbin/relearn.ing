#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  buildMarkdown,
  getJournalEntrySlugs,
  JOURNAL_DIR,
  parseMarkdownFile,
  resolveJournalFilePath,
} from './lib/journal.mjs';

const REQUIRED_KEYS = ['title', 'date', 'summary', 'status', 'category', 'highlights'];
const RECOMMENDED_KEYS = ['publish_social', 'linkedin', 'threads'];

function usage() {
  console.log(`Usage:
  node scripts/check-journal-entry.mjs --entry entry-054 [--fix]
  node scripts/check-journal-entry.mjs --all [--fix]

Options:
  --entry <entry-054>        Check a specific journal entry
  --filename <entry-054.md>  Check a filename in src/content/journal
  --file <path>              Check an explicit file path
  --all                      Check every numbered journal entry
  --fix                      Rewrite files into canonical helper format
  --help                     Show this help
`);
}

function getTargetFiles(values) {
  if (values.all) {
    return getJournalEntrySlugs().map((slug) => path.join(JOURNAL_DIR, `${slug}.md`));
  }

  return [
    resolveJournalFilePath({
      entry: values.entry,
      filename: values.filename,
      filePath: values.file,
    }),
  ];
}

const { values } = parseArgs({
  options: {
    entry: { type: 'string' },
    filename: { type: 'string' },
    file: { type: 'string' },
    all: { type: 'boolean', default: false },
    fix: { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
  allowPositionals: false,
});

if (values.help || (!values.all && !values.entry && !values.filename && !values.file)) {
  usage();
  process.exit(values.help ? 0 : 1);
}

const targetFiles = getTargetFiles(values);
let issueCount = 0;

for (const filePath of targetFiles) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filePath} missing`);
    issueCount += 1;
    continue;
  }

  let parsed;
  try {
    parsed = parseMarkdownFile(filePath);
  } catch (error) {
    issueCount += 1;
    console.log(`❌ ${filePath}`);
    console.log(`   - frontmatter parse failed: ${error.message}`);
    console.log('   - fix the frontmatter manually or with the canonical journal helper, then rerun this check');
    continue;
  }

  const { rawContent, attributes, body } = parsed;
  const issues = [];

  for (const key of REQUIRED_KEYS) {
    if (attributes[key] === undefined) {
      issues.push(`missing required field: ${key}`);
    }
  }

  for (const key of RECOMMENDED_KEYS) {
    if (attributes[key] === undefined) {
      issues.push(`missing recommended field: ${key}`);
    }
  }

  if (!Array.isArray(attributes.highlights)) {
    issues.push('highlights must be an array');
  }

  if (attributes.publish_social !== undefined && typeof attributes.publish_social !== 'boolean') {
    issues.push('publish_social must be a boolean');
  }

  if (!body.trim()) {
    issues.push('body is empty');
  }

  const canonical = buildMarkdown(attributes, body);
  const needsRewrite = canonical !== rawContent;
  if (needsRewrite && !values.fix) {
    issues.push('frontmatter/body spacing is non-canonical');
  }

  if (values.fix && needsRewrite) {
    fs.writeFileSync(filePath, canonical, 'utf8');
  }

  if (issues.length === 0) {
    console.log(`${values.fix && needsRewrite ? '🔧' : '✅'} ${filePath}`);
    continue;
  }

  issueCount += issues.length;
  console.log(`❌ ${filePath}`);
  for (const issue of issues) {
    console.log(`   - ${issue}`);
  }
}

if (issueCount > 0) {
  process.exit(1);
}
