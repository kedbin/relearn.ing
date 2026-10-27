#!/usr/bin/env bash
# Publish journal audio to Cloudflare R2 so it is served from audio.relearn.ing.
#
# Uses the Cloudflare REST API directly (no wrangler install, no S3 access keys):
#   PUT /client/v4/accounts/{account}/r2/buckets/{bucket}/objects/{key}
#
# Credentials live outside the repo, in ~/.config/relearn/r2.env (chmod 600),
# override the path with R2_ENV_FILE. Expected keys:
#   CLOUDFLARE_ACCOUNT_ID=...
#   CLOUDFLARE_API_TOKEN=...   # token with R2:Edit (and R2:Read for the verify step)
#   R2_BUCKET=relearn-audio    # bucket with the audio.relearn.ing custom domain
#
# Usage:
#   npm run journal:audio-upload -- public/audio/entry-065-part1.mp3 [more.mp3 ...]
#
# Afterwards point frontmatter at the CDN:
#   npm run journal:update -- --entry entry-065 \
#     --audio-url https://audio.relearn.ing/entry-065-part1.mp3

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE="${R2_ENV_FILE:-$HOME/.config/relearn/r2.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <file.mp3> [more.mp3 ...]" >&2
  exit 1
fi

missing=0
for var in CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN R2_BUCKET; do
  if [[ -z "${!var:-}" ]]; then
    echo "error: $var is not set (looked in $ENV_FILE and the environment)" >&2
    missing=1
  fi
done
[[ "$missing" -eq 0 ]] || exit 1

command -v curl >/dev/null || { echo "error: curl not found" >&2; exit 1; }
command -v python3 >/dev/null || { echo "error: python3 not found" >&2; exit 1; }

api="https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/r2/buckets/$R2_BUCKET/objects"
fail=0

for file in "$@"; do
  if [[ ! -f "$file" ]]; then
    echo "error: $file does not exist" >&2
    fail=1
    continue
  fi

  key="$(basename "$file")"
  local_md5="$(md5sum "$file" | cut -d' ' -f1)"
  echo "==> $file -> r2://$R2_BUCKET/$key ($local_md5)"

  response="$(curl -sS -X PUT "$api/$key" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: audio/mpeg" \
    --data-binary "@$file" || true)"

  if ! printf '%s' "$response" | python3 -c 'import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get("success") else 1)' 2>/dev/null; then
    echo "    ❌ upload failed: ${response:0:300}" >&2
    fail=1
    continue
  fi

  url="https://audio.relearn.ing/$key"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 60 "$url" || echo 000)"
  if [[ "$code" != "200" ]]; then
    echo "    ❌ $url -> $code (check the bucket's custom domain / public access)" >&2
    fail=1
    continue
  fi

  remote_md5="$(curl -sS --max-time 120 "$url" | md5sum | cut -d' ' -f1)"
  if [[ "$remote_md5" == "$local_md5" ]]; then
    echo "    ✅ $url -> 200, md5 match"
  else
    echo "    ❌ $url -> 200 but md5 mismatch (local $local_md5, remote $remote_md5)" >&2
    fail=1
  fi
done

exit "$fail"
