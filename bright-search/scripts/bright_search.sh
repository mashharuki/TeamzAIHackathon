#!/bin/bash

SCRIPT_DIR="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
SKILL_DIR="$(CDPATH='' cd -- "$SCRIPT_DIR/.." && pwd)"

# Load local env files if present so the script works without manual export.
for ENV_FILE in "$PWD/.env" "$SKILL_DIR/.env"; do
  if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
  fi
done

QUERY="$1"
CURSOR="${2:-0}"

if [ -z "$QUERY" ]; then
  echo "Usage: $0 \"query\" [cursor]" >&2
  exit 1
fi

if [ -z "${BRIGHTDATA_API_KEY:-}" ]; then
  echo "Error: BRIGHTDATA_API_KEY is not set." >&2
  echo "Get a key from https://brightdata.com/cp" >&2
  exit 1
fi

if [ "$BRIGHTDATA_API_KEY" = "paste-your-api-key-here" ] || [ "$BRIGHTDATA_API_KEY" = "your-api-key" ]; then
  echo "Error: BRIGHTDATA_API_KEY is still a placeholder. Update .env first." >&2
  exit 1
fi

if [ -z "${BRIGHTDATA_UNLOCKER_ZONE:-}" ]; then
  echo "Error: BRIGHTDATA_UNLOCKER_ZONE is not set." >&2
  echo "Create a zone at https://brightdata.com/cp" >&2
  exit 1
fi

if [ "$BRIGHTDATA_UNLOCKER_ZONE" = "paste-your-zone-name-here" ] || [ "$BRIGHTDATA_UNLOCKER_ZONE" = "your-zone-name" ]; then
  echo "Error: BRIGHTDATA_UNLOCKER_ZONE is still a placeholder. Update .env first." >&2
  exit 1
fi

START=$((CURSOR * 10))
ENCODED_QUERY=$(printf '%s' "$QUERY" | jq -sRr @uri)
SEARCH_URL="https://www.google.com/search?q=${ENCODED_QUERY}&start=${START}"

PAYLOAD=$(jq -n \
  --arg url "$SEARCH_URL" \
  --arg zone "$BRIGHTDATA_UNLOCKER_ZONE" \
  '{
    url: $url,
    zone: $zone,
    format: "raw",
    data_format: "parsed_light"
  }')

RESPONSE=$(curl -s -X POST 'https://api.brightdata.com/request' \
  -H "Authorization: Bearer $BRIGHTDATA_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "$PAYLOAD")

echo "$RESPONSE" | jq '{
  organic: [.organic[]? | select(.link and .title) | {
    link: .link,
    title: .title,
    description: (.description // "")
  }]
}'
