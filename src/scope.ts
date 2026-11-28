/**
 * Which landmarks a local check needs to look at: the ones a branch adds or
 * changes, found with Git, rather than all 2,000-odd.
 *
 * A landmark is in scope when its placement, its model entry, a GLB of its
 * model, its model's generator or its place changed since the branch left
 * main. Everything is in scope when the check code itself changed (src/,
 * test/, package.json, bun.lock, tsconfig.json), on CI, with --all or
 * LANDMARKS_ALL=1, or when Git can't say what changed.
 */
import { execFileSync } from 'node:child_process'
import type { Catalog } from './catalog'

export type Scope =
  | { all: true; reason: string }
  | { all: false; base: string; landmarks: Set<string> }

/** Paths whose change can affect every landmark's check. */
const SHARED = /^(src|test)\/|^(package\.json|bun\.lock|tsconfig\.json)$/

export function changedScope(root: string, catalog: Catalog, opts: { all?: boolean } = {}): Scope {
  if (opts.all || process.argv.includes('--all')) return { all: true, reason: '--all' }
  if (process.env.LANDMARKS_ALL) return { all: true, reason: 'LANDMARKS_ALL' }
  if (process.env.CI) return { all: true, reason: 'CI' }

  const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { stdio: ['ignore', 'pipe', 'ignore'] }).toString()
  let base: string, paths: string[]
  try {
    base = git('merge-base', 'HEAD', 'origin/main').trim()
  } catch {
    try { base = git('merge-base', 'HEAD', 'main').trim() } catch { return { all: true, reason: 'no main branch to compare with' } }
  }
  try {
    paths = [...git('diff', '--name-only', base).split('\n'), ...git('ls-files', '--others', '--exclude-standard').split('\n')].filter(Boolean)
  } catch {
    return { all: true, reason: 'git diff failed' }
  }
  const shared = paths.find(p => SHARED.test(p))
  if (shared) return { all: true, reason: `${shared} changed` }
  return { all: false, base, landmarks: landmarksTouchedBy(paths, catalog) }
}

/** The landmarks a set of changed repo paths affects. */
export function landmarksTouchedBy(paths: string[], catalog: Catalog): Set<string> {
  const changed = new Set(paths)
  const models = new Set<string>()
  const places = new Set<string>()
  const landmarks = new Set<string>()
  for (const p of paths) {
    const m = /^catalog\/(landmarks|models|places)\/(.+)\.json$/.exec(p)
    if (m?.[1] === 'landmarks') landmarks.add(m[2])
    else if (m?.[1] === 'models') models.add(m[2])
    else if (m?.[1] === 'places') places.add(m[2])
  }
  for (const m of catalog.models)
    if ((m.file && changed.has(m.file)) || (m.detail && changed.has(m.detail)) || (m.source && changed.has(m.source))) models.add(m.id)
  for (const l of catalog.landmarks) if (models.has(l.model) || (l.place && places.has(l.place))) landmarks.add(l.id)
  // A deleted landmark's file is in the diff but not in the catalog.
  const ids = new Set(catalog.landmarks.map(l => l.id))
  return new Set([...landmarks].filter(id => ids.has(id)))
}

/**
 * The shipped catalog as the tests see it: every landmark when the scope is
 * everything, otherwise the changed ones plus the fixtures the tests name.
 */
export function catalogInScope(root: string, catalog: Catalog, fixtures: string[] = []): Catalog {
  const scope = changedScope(root, catalog)
  return scope.all ? catalog : scopeCatalog(catalog, new Set([...scope.landmarks, ...fixtures]))
}

/** The catalog cut down to some landmarks, the models they place and every place. */
export function scopeCatalog(catalog: Catalog, landmarks: Set<string>): Catalog {
  const kept = catalog.landmarks.filter(l => landmarks.has(l.id))
  const models = new Set(kept.map(l => l.model))
  return { ...catalog, landmarks: kept, models: catalog.models.filter(m => models.has(m.id)) }
}
