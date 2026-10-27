#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import {
  buildMarkdown,
  journalUrlForSlug,
  parseMarkdownFile,
  resolveJournalFilePath,
  slugFromFilePath,
} from './lib/journal.mjs';

// Local, self-contained uploader (the old ~/.opencode/skill/remotion helper no longer exists).
const YOUTUBE_UPLOAD_HELPER = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'youtube-upload.mjs',
);
const VALID_YOUTUBE_PRIVACY_STATUSES = new Set(['public', 'unlisted', 'private']);

function usage() {
  console.log(`Usage:
  node scripts/upload-youtube-video.mjs --entry entry-057 --video /path/to/video.mp4 [options]
  node scripts/upload-youtube-video.mjs --authorize-only [options]

Options:
  --entry <entry-057>                Target entry id
  --filename <entry-057.md>          Target filename in src/content/journal
  --file <path>                      Target explicit path
  --video <path>                     Local master video file to upload to YouTube (MP4/MOV/etc.)
  --title <text>                     Override YouTube title
  --description <text>               Override YouTube description
  --description-file <path>          Read YouTube description from file
  --tag <text>                       Repeat for YouTube tags
  --privacy-status <public|unlisted|private>
                                     Defaults to frontmatter or public
  --client-secrets <path>            Override OAuth client JSON path
  --token-file <path>                Override cached token file path
  --authorize-only                   Run the one-time browser auth flow only
  --no-frontmatter-update            Upload but leave the journal file unchanged
  --dry-run                          Print resolved metadata without uploading
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

function buildYouTubeDescriptionStub(summary, slug) {
  return `${summary}\n\nFull draft:\n\n${journalUrlForSlug(slug)}`;
}

function ensureValidPrivacyStatus(value) {
  if (value && !VALID_YOUTUBE_PRIVACY_STATUSES.has(value)) {
    throw new Error('--privacy-status must be one of public, unlisted, or private.');
  }
}

const { values } = parseArgs({
  options: {
    entry: { type: 'string' },
    filename: { type: 'string' },
    file: { type: 'string' },
    video: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    'description-file': { type: 'string' },
    tag: { type: 'string', multiple: true },
    'privacy-status': { type: 'string' },
    'client-secrets': { type: 'string' },
    'token-file': { type: 'string' },
    'authorize-only': { type: 'boolean', default: false },
    'no-frontmatter-update': { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
  allowPositionals: false,
});

if (values.help) {
  usage();
  process.exit(0);
}

ensureValidPrivacyStatus(values['privacy-status']);

if (!fs.existsSync(YOUTUBE_UPLOAD_HELPER)) {
  console.error(`Error: missing helper script ${YOUTUBE_UPLOAD_HELPER}`);
  process.exit(1);
}

if (values['authorize-only']) {
  const authorizeArgs = ['--authorize-only'];

  if (values['client-secrets']) {
    authorizeArgs.push('--client-secrets', values['client-secrets']);
  }

  if (values['token-file']) {
    authorizeArgs.push('--token-file', values['token-file']);
  }

  if (values['dry-run']) {
    process.stdout.write(
      JSON.stringify(
        {
          helper: YOUTUBE_UPLOAD_HELPER,
          authorize_only: true,
          client_secrets: values['client-secrets'] ?? null,
          token_file: values['token-file'] ?? null,
        },
        null,
        2,
      ) + '\n',
    );
    process.exit(0);
  }

  const authorizeResult = spawnSync(process.execPath, [YOUTUBE_UPLOAD_HELPER, ...authorizeArgs], {
    encoding: 'utf8',
    stdio: ['inherit', 'inherit', 'inherit'],
  });

  process.exit(authorizeResult.status ?? 1);
}

if (!values.entry && !values.filename && !values.file) {
  usage();
  console.error('Error: provide --entry, --filename, or --file.');
  process.exit(1);
}

if (!values.video) {
  usage();
  console.error('Error: --video is required unless --authorize-only is used.');
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

if (!fs.existsSync(values.video)) {
  console.error(`Error: video file does not exist: ${values.video}`);
  process.exit(1);
}

const { attributes, body } = parseMarkdownFile(targetPath);
const slug = slugFromFilePath(targetPath);
const title = values.title ?? attributes.youtube_title ?? attributes.title ?? slug;
const description =
  maybeReadText({
    directText: values.description,
    filePath: values['description-file'],
  }) ??
  attributes.youtube_description ??
  buildYouTubeDescriptionStub(attributes.summary ?? title, slug);
const tags =
  values.tag?.length > 0
    ? values.tag.map((tag) => String(tag).trim()).filter(Boolean)
    : Array.isArray(attributes.youtube_tags)
      ? attributes.youtube_tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [];
const privacyStatus = values['privacy-status'] ?? attributes.youtube_privacy_status ?? 'public';

const uploadArgs = [
  values.video,
  '--title',
  title,
  '--description',
  description,
  '--privacy-status',
  privacyStatus,
];

for (const tag of tags) {
  uploadArgs.push('--tag', tag);
}

if (values['client-secrets']) {
  uploadArgs.push('--client-secrets', values['client-secrets']);
}

if (values['token-file']) {
  uploadArgs.push('--token-file', values['token-file']);
}

if (values['dry-run']) {
  process.stdout.write(
    JSON.stringify(
      {
        helper: YOUTUBE_UPLOAD_HELPER,
        file: targetPath,
        video: values.video,
        title,
        description,
        tags,
        privacy_status: privacyStatus,
        client_secrets: values['client-secrets'] ?? null,
        token_file: values['token-file'] ?? null,
      },
      null,
      2,
    ) + '\n',
  );
  process.exit(0);
}

const uploadResult = spawnSync(process.execPath, [YOUTUBE_UPLOAD_HELPER, ...uploadArgs], {
  encoding: 'utf8',
  stdio: ['inherit', 'pipe', 'inherit'],
});

if (uploadResult.status !== 0) {
  process.exit(uploadResult.status ?? 1);
}

const rawStdout = uploadResult.stdout.trim();
if (!rawStdout) {
  console.error('Error: YouTube upload helper returned no JSON output.');
  process.exit(1);
}

let uploadJson;
try {
  uploadJson = JSON.parse(rawStdout);
} catch (error) {
  console.error('Error: failed to parse YouTube upload helper output as JSON.');
  console.error(rawStdout);
  process.exit(1);
}

const youtubeUrl = uploadJson.url;
const youtubeVideoId = uploadJson.video_id;

if (!youtubeUrl || !youtubeVideoId) {
  console.error('Error: upload helper JSON is missing url or video_id.');
  console.error(rawStdout);
  process.exit(1);
}

if (!values['no-frontmatter-update']) {
  const nextAttributes = {
    ...attributes,
    youtube_title: title,
    youtube_description: description,
    youtube_privacy_status: privacyStatus,
    youtube_url: youtubeUrl,
    youtube_video_id: youtubeVideoId,
  };

  if (tags.length > 0) {
    nextAttributes.youtube_tags = tags;
  }

  fs.writeFileSync(targetPath, buildMarkdown(nextAttributes, body), 'utf8');
}

process.stdout.write(
  JSON.stringify(
    {
      file: targetPath,
      youtube_url: youtubeUrl,
      youtube_video_id: youtubeVideoId,
      youtube_privacy_status: privacyStatus,
      frontmatter_updated: !values['no-frontmatter-update'],
    },
    null,
    2,
  ) + '\n',
);
