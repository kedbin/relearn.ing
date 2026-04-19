#!/usr/bin/env node

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { parseMarkdownFile, resolveJournalFilePath } from './lib/journal.mjs';

function usage() {
  console.log(`Usage:
  node scripts/extract-social-metadata.mjs --file <path>
  node scripts/extract-social-metadata.mjs --entry <entry-057>

Outputs JSON with publish_social, social copy, media URNs, media titles, and a UTF-8 content hash.
`);
}

const { values } = parseArgs({
  options: {
    entry: { type: 'string' },
    filename: { type: 'string' },
    file: { type: 'string' },
    help: { type: 'boolean', default: false },
  },
  allowPositionals: false,
});

if (values.help || (!values.entry && !values.filename && !values.file)) {
  usage();
  process.exit(values.help ? 0 : 1);
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

const { attributes } = parseMarkdownFile(targetPath);

const linkedin = typeof attributes.linkedin === 'string' ? attributes.linkedin : '';
const threads = typeof attributes.threads === 'string' ? attributes.threads : '';
const imageUrn = typeof attributes.linkedin_image_urn === 'string' ? attributes.linkedin_image_urn : '';
const documentUrn = typeof attributes.linkedin_document_urn === 'string' ? attributes.linkedin_document_urn : '';
const documentTitle =
  typeof attributes.linkedin_document_title === 'string' ? attributes.linkedin_document_title : '';
const videoUrn = typeof attributes.linkedin_video_urn === 'string' ? attributes.linkedin_video_urn : '';

const contentHash = createHash('md5')
  .update(`${linkedin}${threads}${imageUrn}${documentUrn}${documentTitle}${videoUrn}`, 'utf8')
  .digest('hex');

process.stdout.write(
  JSON.stringify(
    {
      file: targetPath,
      publish_social: attributes.publish_social === true,
      linkedin,
      threads,
      audio_url: typeof attributes.audioUrl === 'string' ? attributes.audioUrl : '',
      image_urn: imageUrn,
      document_urn: documentUrn,
      document_title: documentTitle,
      video_urn: videoUrn,
      content_hash: contentHash,
    },
    null,
    2,
  ) + '\n',
);
