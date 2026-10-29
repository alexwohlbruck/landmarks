/**
 * Validate the catalog and build the static release.
 *
 *   bun run build [--out dist]   write the release to dist/
 *   bun run validate             check everything the build checks, write nothing
 *
 * Exits non-zero, listing every problem, if the catalog or a model is wrong,
 * so a bad edit never publishes.
 */
import { copyFileSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
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
// Bundle the browser-only demo alongside the existing dataset. Everything in
// dist/ is static and uses dataset-relative URLs, including on GitHub Pages.
// Retain third-party license text with the bundled dependencies.
const dependencyRoot = join(root, 'node_modules')
const licenseFiles = [...new Bun.Glob('**/{LICENSE,LICENSE.*,LICENSE-*,LICENCE,LICENCE.*,NOTICE,NOTICE.*,COPYING}').scanSync({ cwd: dependencyRoot })].sort()
writeFileSync(join(out, 'third-party-licenses.txt'), licenseFiles.map(file =>
  `===== ${file} =====\n${readFileSync(join(dependencyRoot, file), 'utf8')}`,
).join('\n\n'))
for (const file of ['index.html', 'style.css', 'favicon.svg'])
  copyFileSync(join(root, 'web', file), join(out, file))
for (const file of ['maplibre-gl.css', 'maplibre-gl-worker.mjs'])
  copyFileSync(join(root, 'node_modules/maplibre-gl/dist', file), join(out, file))
const browser = await Bun.build({
  entrypoints: [join(root, 'web/app.ts')],
  outdir: out,
  target: 'browser',
  minify: true,
  naming: 'app.js',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
})
if (!browser.success) {
  console.error(browser.logs)
  process.exit(1)
}
console.log(`wrote ${release.files.size} dataset files and the demo to ${out}`)
