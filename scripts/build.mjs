// The unpacked extension per browser: dist/chrome/ and dist/firefox/, each with
// manifest.json plus that browser's manifest.<browser>.json (top-level keys).
//
//   node scripts/build.mjs        # npm run build also zips them into dist/
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const root = new URL('..', import.meta.url)
const json = (file) => JSON.parse(readFileSync(new URL(file, root), 'utf8'))

for (const browser of ['chrome', 'firefox']) {
  const out = new URL(`dist/${browser}/`, root)
  rmSync(out, { recursive: true, force: true })
  for (const p of ['data', 'icons', 'License.md', 'README.md']) cpSync(new URL(p, root), new URL(p, out), { recursive: true })
  const manifest = { ...json('manifest.json'), ...json(`manifest.${browser}.json`) }
  writeFileSync(new URL('manifest.json', out), `${JSON.stringify(manifest, null, 2)}\n`)
}
