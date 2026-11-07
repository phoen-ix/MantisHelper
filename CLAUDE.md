# Mantis Helper

MV3 browser extension (Firefox, Chrome, Edge): select an issue number, context menu, the issue opens in
Mantis. One source tree; README is the overview. This repository merged the former
`Plugin-Chrome-Edge-MantisHelper` (archived) and is to be renamed on GitHub from
`Plugin-FireFox-MantisHelper` to `MantisHelper`; links already use https://github.com/phoen-ix/MantisHelper.

## Layout

- `data/` — shared by both browsers: `background.js` (Chrome service worker, Firefox background page),
  `mantis.js` (parsing, unit-tested), `options.*`, `invalid_selection.html`. Call `chrome.*` only
  (Firefox MV3 has it, with promises). CRLF line endings, like both manifests.
- `manifest.json` (shared keys) + `manifest.chrome.json` / `manifest.firefox.json` (top-level keys added
  per browser) → `scripts/build.mjs` → `dist/chrome/`, `dist/firefox/`. One manifest for both does not lint
  clean (web-ext: `background.service_worker` ignored by Firefox).
- `e2e/` — one npm package, two suites: `firefox/` (temporary add-on over RDP, pages as files with
  `stub.ts`), `chrome/` (unpacked into Chromium). Each has `COVERAGE.md`; keep it in step with its tests.
- `docs/screenshots/{firefox,chrome}/` — from the docs tours; the gallery is `docs/screenshots/README.md`.
- `PRIVACY.md` — the privacy policy the store listings link to.

## Commands

```
npm ci && npm run lint && npm test        # ESLint + web-ext lint (dist/firefox, warnings fail) + unit tests
npm run build                              # dist/<browser>/ + dist/mantis-helper-<browser>-<version>.zip
cd e2e && npm ci && npx playwright install firefox chromium
scripts/e2e.sh firefox|chrome [args]       # one suite per run; builds first
scripts/docs-screenshots.sh [outdir] [firefox|chrome]
```

## Invariants

- Version: one, in `manifest.json`, bumped only in a `Release x.y.z: …` commit together with the README
  changelog. The Firefox gecko id `mantis-helper@monumental.at` and the store ids in the README never change.
- Browser differences go in the manifest overlays; in `data/` only where a browser behaves differently
  (incognito hint tab in `background.js`, the control border in `options.html`).
- The options page border is each browser's native control colour: Chrome #767676, Firefox #8f8f9d.
