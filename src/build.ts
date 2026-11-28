/**
 * Validate the catalog and build the static release.
 *
 *   bun run build [--out dist]   write the release to dist/
 *   bun run validate [--all]     check what the build checks, write nothing
 *
 * Locally, validate reads and bakes only the models of landmarks this branch
 * adds or changes (src/scope.ts); the whole catalog's JSON is still checked.
 * --all, LANDMARKS_ALL=1 or CI checks every model, as the build always does.
 *
 * Exits non-zero, listing every problem, if the catalog or a model is wrong,
 * so a bad edit never publishes.
 */
import { copyFileSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { basename, dirname, join, resolve } from 'node:path'
import { buildRelease, CatalogError } from './release'
import { readCatalog, storageProblems } from './catalog-files'
import { buildHistory } from './history'
import { validateCatalog } from './catalog'
import { changedScope, scopeCatalog } from './scope'

const args = process.argv.slice(2)
const check = args.includes('--check')
const outAt = args.indexOf('--out')
const out = resolve(outAt >= 0 ? args[outAt + 1] : join(import.meta.dir, '../dist'))
const root = join(import.meta.dir, '..')

const stored = storageProblems(root)
if (stored.length) {
  console.error(stored.join('\n'))
  process.exit(1)
}

// The map cuts buildings out of the basemap with the stored footprints, not
// the catalog's refs: a landmark without them shows OSM's parts through it.
const footprints = JSON.parse(readFileSync(join(root, 'web/replacement-footprints.json'), 'utf8')).refs ?? {}
const unrefreshed = readCatalog(root).landmarks
  .filter(l => l.replaces?.length && JSON.stringify(footprints[l.id]) !== JSON.stringify(l.replaces)).map(l => l.id)
if (unrefreshed.length) {
  console.error(`web/replacement-footprints.json is out of date for ${unrefreshed.join(', ')}: run bun tools/replacement-footprints.ts`)
  process.exit(1)
}

if (check) {
  const catalog = readCatalog(root)
  const scope = changedScope(root, catalog)
  if (!scope.all) {
    const problems = validateCatalog(catalog)
    if (!problems.length) {
      try {
        buildRelease(root, scopeCatalog(catalog, scope.landmarks))
      } catch (err) {
        if (!(err instanceof CatalogError)) throw err
        problems.push(...err.problems)
      }
    }
    if (problems.length) {
      console.error(new CatalogError(problems).message)
      process.exit(1)
    }
    console.log(`checked ${scope.landmarks.size} of ${catalog.landmarks.length} landmarks, the ones changed since ${scope.base.slice(0, 8)}; --all checks every model`)
    process.exit(0)
  }
  console.log(`checking every model (${scope.reason})`)
}

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

const history = buildHistory(root, release)
console.log(`history: ${history.versions} versions from ${history.commits} commits; ${history.unavailable} unavailable snapshots${history.complete ? '' : ' (partial checkout)'}`)

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
for (const file of ['index.html', 'style.css', 'favicon.svg', 'claude.ico', 'og-image.jpg', 'open-landmarks.json'])
  copyFileSync(join(root, 'web', file), join(out, file))
for (const file of ['maplibre-gl.css', 'maplibre-gl-worker.mjs'])
  copyFileSync(join(root, 'node_modules/maplibre-gl/dist', file), join(out, file))
mkdirSync(join(out, 'fonts'), { recursive: true })
for (const [family, weights] of [['geist-sans', [400, 500, 600]], ['geist-mono', [400]]] as const)
  for (const weight of weights) {
    const file = `${family}-latin-${weight}-normal.woff2`
    copyFileSync(join(root, `node_modules/@fontsource/${family}/files`, file), join(out, 'fonts', file))
  }
const browser = await Bun.build({
  entrypoints: [join(root, 'web/app.ts')],
  outdir: out,
  target: 'browser',
  minify: true,
  naming: 'app-[hash].js',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
})
if (!browser.success) {
  console.error(browser.logs)
  process.exit(1)
}
// GitHub Pages caches assets for ten minutes. Content-addressed URLs prevent
// a newly deployed page from running an older cached app or stylesheet.
const entry = browser.outputs.find(output => output.kind === 'entry-point')!
const script = basename(entry.path)
const css = readFileSync(join(out, 'style.css'))
const stylesheet = `style-${createHash('sha256').update(css).digest('hex').slice(0, 12)}.css`
writeFileSync(join(out, stylesheet), css)
const html = readFileSync(join(out, 'index.html'), 'utf8')
  .replace('./app.js', `./${script}`)
  .replace('./style.css', `./${stylesheet}`)
writeFileSync(join(out, 'index.html'), html)
// Older cached HTML can still find its entrypoint during the transition.
writeFileSync(join(out, 'app.js'), `import './${script}';\n`)
console.log(`wrote ${release.files.size} dataset files and the demo to ${out}`)
