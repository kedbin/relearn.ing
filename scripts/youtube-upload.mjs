#!/usr/bin/env node
/**
 * Self-contained YouTube uploader (replaces the deleted
 * `~/.opencode/skill/remotion/scripts/youtube-video-upload.sh`).
 *
 * Implements the CLI contract `scripts/upload-youtube-video.mjs` expects:
 *   youtube-upload.mjs <video> --title ... --description ... --privacy-status ...
 *                     [--tag ...] [--client-secrets path] [--token-file path]
 *   youtube-upload.mjs --authorize-only [--client-secrets path] [--token-file path]
 *
 * Prints exactly one JSON object on stdout (`url`, `video_id`, ...) and logs
 * everything else to stderr, because the caller parses stdout.
 *
 * One-time setup:
 *   1. Google Cloud Console -> APIs & Services -> enable "YouTube Data API v3"
 *   2. Credentials -> Create credentials -> OAuth client ID -> "Desktop app"
 *   3. Download the JSON to ~/.config/relearn/youtube-client.json
 *   4. npm run journal:youtube-auth     (opens a browser, stores a refresh token)
 *
 * Credentials live outside the repo in ~/.config/relearn/ (chmod 600).
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import { parseArgs } from 'node:util';

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const DEFAULT_CLIENT_SECRETS = path.join(os.homedir(), '.config/relearn/youtube-client.json');
const DEFAULT_TOKEN_FILE = path.join(os.homedir(), '.config/relearn/youtube-token.json');
// Fixed port + root path: works for 'Desktop app' clients (any loopback port is allowed)
// and is trivial to register verbatim if the client is a 'Web application'.
const AUTH_PORT = Number(process.env.YT_AUTH_PORT ?? 8765);
const LOOPBACK_PATH = process.env.YT_REDIRECT_PATH ?? '/';

function usage() {
  console.log(`Usage:
  youtube-upload.mjs --authorize-only [--client-secrets <json>] [--token-file <json>]
  youtube-upload.mjs <video.mp4> --title "..." --description "..." \\
      [--privacy-status unlisted|public|private] [--tag one --tag two] \\
      [--client-secrets <json>] [--token-file <json>]

Env overrides: YT_CLIENT_SECRETS, YT_TOKEN_FILE, YT_PRIVACY_STATUS
`);
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: 'string' },
    description: { type: 'string', default: '' },
    'privacy-status': { type: 'string' },
    tag: { type: 'string', multiple: true, default: [] },
    'client-secrets': { type: 'string' },
    'token-file': { type: 'string' },
    'authorize-only': { type: 'boolean', default: false },
    'category-id': { type: 'string', default: '28' }, // 28 = Science & Technology
    help: { type: 'boolean', default: false },
  },
});

if (values.help) {
  usage();
  process.exit(0);
}

const clientSecretsPath = values['client-secrets'] ?? process.env.YT_CLIENT_SECRETS ?? DEFAULT_CLIENT_SECRETS;
const tokenFilePath = values['token-file'] ?? process.env.YT_TOKEN_FILE ?? DEFAULT_TOKEN_FILE;

function log(...args) {
  console.error(...args);
}

function readClientSecrets() {
  if (!fs.existsSync(clientSecretsPath)) {
    log(`error: OAuth client secrets not found at ${clientSecretsPath}`);
    log('');
    log('Create one (2 minutes, one time):');
    log('  console.cloud.google.com → APIs & Services → enable "YouTube Data API v3"');
    log('  Credentials → Create credentials → OAuth client ID → Desktop app');
    log(`  download the JSON to ${clientSecretsPath}`);
    log('');
    log('then run: npm run journal:youtube-auth');
    process.exit(2);
  }

  const raw = JSON.parse(fs.readFileSync(clientSecretsPath, 'utf8'));
  const client = raw.installed ?? raw.web ?? raw;
  if (!client.client_id || !client.client_secret) {
    log(`error: ${clientSecretsPath} is not a usable OAuth client JSON (missing client_id/client_secret)`);
    process.exit(2);
  }

  return {
    client_id: client.client_id,
    client_secret: client.client_secret,
    isDesktop: Boolean(raw.installed),
  };
}

function writeTokenFile(payload) {
  fs.mkdirSync(path.dirname(tokenFilePath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(tokenFilePath, JSON.stringify(payload, null, 2) + '\n', { mode: 0o600 });
  try {
    fs.chmodSync(tokenFilePath, 0o600);
  } catch {
    // best effort on filesystems without unix perms
  }
}

async function exchangeToken(params) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = body.error_description ?? body.error ?? response.statusText;
    throw new Error(`token endpoint ${response.status}: ${detail}`);
  }
  return body;
}

async function authorize() {
  const client = readClientSecrets();
  const server = http.createServer();

  await new Promise((resolve, reject) => {
    server.once('error', (error) => {
      reject(
        error.code === 'EADDRINUSE'
          ? new Error(
              `port ${AUTH_PORT} is already in use. Stop the other process or set YT_AUTH_PORT=<port> (and add that redirect URI to the OAuth client if it is a Web client).`,
            )
          : error,
      );
    });
    server.listen(AUTH_PORT, '127.0.0.1', resolve);
  });

  const { port } = server.address();
  const redirectUri = `http://127.0.0.1:${port}${LOOPBACK_PATH}`;

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', client.client_id);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPES.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  log('Open this URL and approve access to your YouTube channel:');
  log('');
  log(authUrl.toString());
  log('');
  if (!client.isDesktop) {
    log(`note: this is a "web" OAuth client. ${redirectUri} must be registered as a redirect URI.`);
    log('      A "Desktop app" client avoids that requirement entirely.');
  }
  log('waiting for the browser callback...');

  const code = await new Promise((resolve, reject) => {
    const waitMs = Number(process.env.YT_AUTH_TIMEOUT_MS ?? 900_000);
    const timeout = setTimeout(() => {
      server.close();
      reject(new Error(`timed out after ${Math.round(waitMs / 1000)}s waiting for the OAuth callback`));
    }, waitMs);

    server.on('request', (req, res) => {
      const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
      if (url.pathname !== LOOPBACK_PATH) {
        res.writeHead(404).end('not found');
        return;
      }

      const error = url.searchParams.get('error');
      const value = url.searchParams.get('code');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(
        '<!doctype html><meta charset="utf-8"><title>relearn.ing</title>' +
          '<body style="font-family:system-ui;padding:3rem">' +
          `<h2>${error ? 'Authorization failed' : 'YouTube authorization received'}</h2>` +
          `<p>${error ? String(error) : 'You can close this tab and return to the terminal.'}</p></body>`,
      );

      clearTimeout(timeout);
      server.close();
      if (error) reject(new Error(`authorization denied: ${error}`));
      else if (!value) reject(new Error('callback did not include a code'));
      else resolve(value);
    });
  });

  const token = await exchangeToken({
    code,
    client_id: client.client_id,
    client_secret: client.client_secret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  if (!token.refresh_token) {
    throw new Error(
      'no refresh_token returned. Re-run with prompt=consent (default here) or revoke the app at myaccount.google.com/permissions and retry.',
    );
  }

  writeTokenFile({
    client_id: client.client_id,
    client_secret: client.client_secret,
    refresh_token: token.refresh_token,
    redirect_uri: redirectUri,
    scope: token.scope ?? SCOPES.join(' '),
    obtained_at: new Date().toISOString(),
  });

  log(`✅ refresh token stored at ${tokenFilePath} (chmod 600)`);
  process.stdout.write(JSON.stringify({ authorized: true, token_file: tokenFilePath }, null, 2) + '\n');
}

async function accessToken() {
  if (!fs.existsSync(tokenFilePath)) {
    log(`error: no token at ${tokenFilePath}. Run: npm run journal:youtube-auth`);
    process.exit(2);
  }

  const stored = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
  if (!stored.refresh_token || !stored.client_id || !stored.client_secret) {
    log(`error: ${tokenFilePath} is missing refresh_token/client_id/client_secret. Re-run npm run journal:youtube-auth`);
    process.exit(2);
  }

  try {
    const token = await exchangeToken({
      client_id: stored.client_id,
      client_secret: stored.client_secret,
      refresh_token: stored.refresh_token,
      grant_type: 'refresh_token',
    });
    return token.access_token;
  } catch (error) {
    log(`error: could not refresh the YouTube access token: ${error.message}`);
    log('       if the app was revoked or rotated, re-run: npm run journal:youtube-auth');
    process.exit(2);
  }
}

function clamp(text, max) {
  const value = String(text ?? '');
  return value.length <= max ? value : value.slice(0, max - 1).trimEnd() + '…';
}

async function upload(videoPath, token) {
  const size = fs.statSync(videoPath).size;
  const title = clamp(values.title ?? path.basename(videoPath), 100);
  const description = clamp(values.description, 5000);
  const privacyStatus = values['privacy-status'] ?? process.env.YT_PRIVACY_STATUS ?? 'unlisted';

  if (!['public', 'unlisted', 'private'].includes(privacyStatus)) {
    log(`error: --privacy-status must be public, unlisted, or private (got ${privacyStatus})`);
    process.exit(2);
  }

  const metadata = {
    snippet: {
      title,
      description,
      tags: values.tag.filter(Boolean),
      categoryId: values['category-id'],
    },
    status: {
      privacyStatus,
      selfDeclaredMadeForKids: false,
    },
  };

  const initResponse = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(size),
        'X-Upload-Content-Type': 'video/mp4',
      },
      body: JSON.stringify(metadata),
    },
  );

  if (!initResponse.ok) {
    const detail = await initResponse.text();
    throw new Error(`resumable session failed (${initResponse.status}): ${detail.slice(0, 500)}`);
  }

  const sessionUrl = initResponse.headers.get('location');
  if (!sessionUrl) throw new Error('resumable session response had no Location header');

  log(`uploading ${(size / 1024 / 1024).toFixed(1)} MB → YouTube (${privacyStatus})`);
  const putResponse = await fetch(sessionUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'video/mp4',
      'Content-Length': String(size),
    },
    body: fs.createReadStream(videoPath),
    duplex: 'half',
  });

  const body = await putResponse.json().catch(() => ({}));
  if (!putResponse.ok || !body.id) {
    throw new Error(`upload failed (${putResponse.status}): ${JSON.stringify(body).slice(0, 500)}`);
  }

  return {
    url: `https://www.youtube.com/watch?v=${body.id}`,
    video_id: body.id,
    title: body.snippet?.title ?? title,
    privacy_status: body.status?.privacyStatus ?? privacyStatus,
    file: videoPath,
    bytes: size,
  };
}

try {
  if (values['authorize-only']) {
    await authorize();
    process.exit(0);
  }

  const videoPath = positionals[0];
  if (!videoPath) {
    usage();
    log('error: provide the video file to upload');
    process.exit(1);
  }
  if (!fs.existsSync(videoPath)) {
    log(`error: video file does not exist: ${videoPath}`);
    process.exit(1);
  }

  readClientSecrets();
  const token = await accessToken();
  const result = await upload(videoPath, token);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  log(`✅ ${result.url}`);
} catch (error) {
  log(`error: ${error.message}`);
  process.exit(1);
}
