#!/usr/bin/env bash
# Regenerate the docs screenshots: the docs tours (e2e/<browser>/docs/) against
# the built extension (scripts/build.mjs, run first), one browser after the
# other. Firefox: the pages of dist/firefox opened as files with a stubbed API
# (Playwright cannot load an extension into Firefox); Chrome: dist/chrome
# loaded unpacked into a throwaway headless Chromium profile.
#
#   scripts/docs-screenshots.sh [outdir] [firefox|chrome]   # default: docs/screenshots, both
#
# Each browser's PNGs go to <outdir>/<browser>/. No server, no Docker: nothing
# binds a port and there is no compose project. ARTIFACTS: where Playwright's
# test results go (default: a temp dir). Node + `npm ci` and
# `npx playwright install firefox chromium` in e2e/ are the caller's.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/docs/screenshots}"
OUT="$(mkdir -p "$OUT" && cd "$OUT" && pwd)"
ARTIFACTS="${ARTIFACTS:-$(mktemp -d)}"

node "$ROOT/scripts/build.mjs"
cd "$ROOT/e2e"
for browser in ${2:-firefox chrome}; do
  DOCS_SCREENSHOT_DIR="$OUT/$browser" npx playwright test -c "$browser/playwright.docs.config.ts" --output "$ARTIFACTS/test-results-$browser"
done
echo "docs-screenshots: $(find "$OUT" -name '*.png' | wc -l) PNGs in $OUT"
