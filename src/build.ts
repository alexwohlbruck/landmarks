/**
 * Validate the catalog and build the static release.
 *
 *   bun run build [--out dist]   write the release to dist/
 *   bun run validate             check everything the build checks, write nothing
 *
 * Exits non-zero, listing every problem, if the catalog or a model is wrong,
 * so a bad edit never publishes.
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { buildRelease, CatalogError } from './release'

const args = process.argv.slice(2)
const check = args.includes('--check')
const outAt = args.indexOf('--out')
const out = resolve(outAt >= 0 ? args[outAt + 1] : join(import.meta.dir, '../dist'))
const root = join(import.meta.dir, '..')

let release
try {
  release = buildRelease(root)
} catch (err) {
  if (!(err instanceof CatalogError)) throw err
  console.error(err.message)
  process.exit(1)
}

const models = [...release.files.keys()].filter((p) => p.endsWith('.glb')).length
console.log(`${release.release}: ${release.assets.length} landmarks, ${models} model files`)
if (check) process.exit(0)

rmSync(out, { recursive: true, force: true })
for (const [path, bytes] of release.files) {
  const file = join(out, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, bytes)
}
// Pages would otherwise run Jekyll over the tree, for nothing.
writeFileSync(join(out, '.nojekyll'), '')
writeFileSync(
  join(out, 'index.html'),
  `<!doctype html><meta charset="utf-8"><title>Landmarks</title>
<p>Static releases of <a href="https://github.com/alexwohlbruck/landmarks">alexwohlbruck/landmarks</a>, in the
<a href="https://github.com/benjamintd/open-landmarks">Open Landmarks</a> format. Start at
<a href="api/v1/latest.json">api/v1/latest.json</a>.</p>
`,
)
console.log(`wrote ${release.files.size} files to ${out}`)
