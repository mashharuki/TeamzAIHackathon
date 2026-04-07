#!/bin/bash

SCRIPT_DIR="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
SKILL_DIR="$(CDPATH='' cd -- "$SCRIPT_DIR/.." && pwd)"

for ENV_FILE in "$PWD/.env" "$SKILL_DIR/.env"; do
  if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
  fi
done

QUERY="$1"
FORMAT="${2:-raw}"
DATA_FORMAT="${3:-parsed_light}"

if [ -z "$QUERY" ]; then
  echo "Usage: $0 \"query\" [format] [data_format]" >&2
  echo "Example: $0 \"pizza\" raw parsed_light" >&2
  exit 1
fi

if [ -z "${BRIGHTDATA_API_KEY:-}" ]; then
  echo "Error: BRIGHTDATA_API_KEY is not set." >&2
  exit 1
fi

if [ -z "${BRIGHTDATA_UNLOCKER_ZONE:-}" ]; then
  echo "Error: BRIGHTDATA_UNLOCKER_ZONE is not set." >&2
  exit 1
fi

SEARCH_URL="https://www.google.com/search?q=$(printf '%s' "$QUERY" | jq -sRr @uri)"

PAYLOAD=$(jq -n \
  --arg zone "$BRIGHTDATA_UNLOCKER_ZONE" \
  --arg url "$SEARCH_URL" \
  --arg format "$FORMAT" \
  --arg data_format "$DATA_FORMAT" \
  '{
    zone: $zone,
    url: $url,
    format: $format,
    data_format: $data_format
  }')

curl -s 'https://api.brightdata.com/request' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $BRIGHTDATA_API_KEY" \
  -d "$PAYLOAD"
