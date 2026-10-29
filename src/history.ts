/** Materialize Git revisions into the static site. No GitHub API or visitor-side
 * Git access, and no dependency on a previous deployment surviving. */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { buildRelease, type Asset, type Release } from './release'
import { basename } from 'node:path'
import type { Catalog } from './catalog'

export type HistoryEntry = { commit: string; date: string; message: string; asset: Asset }
export type AssetHistory = { complete: boolean; unavailable: number; versions: HistoryEntry[] }
export type HistorySummary = { complete: boolean; commits: number; versions: number; unavailable: number }
const hash = (value: string) => createHash('sha256').update(value).digest('hex')

export function buildHistory(root: string, current: Release): HistorySummary {
  const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
  const write = (path: string, value: unknown) => current.files.set(path, new TextEncoder().encode(JSON.stringify(value)))
  const histories = new Map(current.assets.map(a => [a.id, { complete: false, unavailable: 0, versions: [] } as AssetHistory]))
  let complete = false
  let commits: string[] = []
  try {
    complete = git('rev-parse', '--is-shallow-repository').toString().trim() === 'false'
    commits = git('log', '--topo-order', '--reverse', '--format=%H', '--', 'catalog.json', 'models', 'generators').toString().trim().split('\n').filter(Boolean)
  } catch { /* Source archives can still build a current-only collection. */ }
  const fingerprints = new Map<string, Set<string>>()
  const revisions = new Map<string, Set<string>>()
  let unavailable = 0
  let versions = 0
  for (const commit of commits) {
    const tree = new Map(git('ls-tree', '-r', commit).toString().trim().split('\n').map(line => {
      const [entry, path] = line.split('\t')
      return [path, entry.split(' ')[2]]
    }))
    if (!tree.has('catalog.json')) continue
    const catalog = JSON.parse(git('cat-file', 'blob', tree.get('catalog.json')!).toString()) as Catalog
    const [date, ...message] = git('show', '-s', '--format=%cI%n%s', commit).toString().trim().split('\n')
    // Blob reads are shared within the commit, including replicated placements.
    const bytes = new Map<string, Uint8Array>()
    const read = (path: string) => {
      const oid = tree.get(path)
      if (!oid) throw new Error(`Missing historical file: ${path}`)
      if (!bytes.has(oid)) bytes.set(oid, new Uint8Array(git('cat-file', 'blob', oid)))
      return bytes.get(oid)!
    }
    for (const l of catalog.landmarks ?? []) {
      const history = histories.get(l.id)
      if (!history) continue
      const authored = catalog.models.find(m => m.id === l.model)
      if (!authored) continue
      const model = { ...authored }
      // Imported models once used source for a credit page, not a repo file.
      if (model.source && /^https?:\/\//.test(model.source)) {
        model.sourcePage = model.source
        delete model.source
      }
      // Early catalogs retained Barrelman paths after moving generators here.
      // Resolve that recorded layout mismatch using files in this exact tree.
      if (model.source && !tree.has(model.source) && model.source.startsWith('scripts/landmarks/')) {
        const relocated = `generators/${basename(model.source)}`
        if (tree.has(relocated)) model.source = relocated
      }
      const fingerprint = hash(JSON.stringify([l, model, catalog.places, tree.get(model.file), model.detail && tree.get(model.detail), model.source && tree.get(model.source)]))
      const seen = fingerprints.get(l.id) ?? new Set<string>()
      if (seen.has(fingerprint)) continue
      seen.add(fingerprint)
      fingerprints.set(l.id, seen)
      try {
        const snapshot = buildRelease(root, { models: [model], landmarks: [l], ...(catalog.places ? { places: catalog.places } : {}) }, read)
        const asset = snapshot.assets[0]
        const seenRevisions = revisions.get(l.id) ?? new Set<string>()
        if (seenRevisions.has(asset.revision)) continue
        seenRevisions.add(asset.revision)
        revisions.set(l.id, seenRevisions)
        // Only immutable model, source and metadata objects, not release pointers.
        for (const [path, value] of snapshot.files) if (!path.startsWith('api/')) current.files.set(path, value)
        history.versions.push({ commit, date, message: message.join('\n'), asset })
        versions++
      } catch {
        history.unavailable++
        unavailable++
      }
    }
  }
  for (const [id, history] of histories) {
    history.complete = complete
    history.versions.reverse()
    write(`api/v1/history/${id}.json`, history)
  }
  const summary = { complete, commits: commits.length, versions, unavailable }
  write('api/v1/history.json', summary)
  return summary
}
