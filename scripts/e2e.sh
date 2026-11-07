#!/usr/bin/env bash
# Run one browser's e2e suite against the built extension (scripts/build.mjs,
# run first):
#   firefox  e2e/firefox/ (inventory in its COVERAGE.md): dist/firefox installed
#            as a temporary add-on over Firefox's remote debugging protocol (on a
#            Unix socket), and its pages opened as files
#   chrome   e2e/chrome/ (inventory in its COVERAGE.md): dist/chrome loaded
#            unpacked into a fresh headless Chromium profile per test
#
#   scripts/e2e.sh firefox|chrome [playwright args]   # e.g. tests/menu.spec.ts, -g options, --repeat-each=3
#
# No server, no Docker: fake sites are Playwright routes, so nothing binds a
# port and there is no compose project. ARTIFACTS: where Playwright's results
# and traces go (default: a temp dir). Node + `npm ci` and
# `npx playwright install firefox chromium` in e2e/ are the caller's.
set -euo pipefail

BROWSER="${1:-}"
case "$BROWSER" in
  firefox | chrome) shift ;;
  *) echo "usage: scripts/e2e.sh firefox|chrome [playwright args]" >&2; exit 2 ;;
esac
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACTS="${ARTIFACTS:-$(mktemp -d)}"

node "$ROOT/scripts/build.mjs"
cd "$ROOT/e2e"
echo "e2e: results in $ARTIFACTS/test-results"
npx playwright test -c "$BROWSER/playwright.config.ts" --output "$ARTIFACTS/test-results" "$@"
