import { expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildHistory, type AssetHistory } from '../src/history'
import { buildRelease } from '../src/release'
import type { Catalog } from '../src/catalog'
import { box, material, writeGlb } from './helpers'

test('publishes real Git versions with their original geometry, source, placement, and license', () => {
  const root = mkdtempSync(join(tmpdir(), 'landmarks-history-'))
  const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' }).toString().trim()
  try {
    git('init')
    mkdirSync(join(root, 'models'))
    mkdirSync(join(root, 'generators'))
    const c: Catalog = { models: [{ id: 'tower', file: 'models/tower.glb', source: 'generators/tower.ts', license: 'CC-BY-4.0', author: 'Original author', attribution: 'Original credit' }], landmarks: [{ id: 'tower', name: 'Tower', model: 'tower', lng: 2, lat: 48, bearing: 30 }] }
    const save = (height: number) => {
      writeFileSync(join(root, 'models/tower.glb'), writeGlb('tower', [{ part: box([-1, -1, 0], [1, 1, height]), material }]))
      writeFileSync(join(root, 'generators/tower.ts'), `// height ${height}`)
      writeFileSync(join(root, 'catalog.json'), JSON.stringify(c))
    }
    const commit = (message: string) => {
      git('add', '.')
      git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', message)
      return git('rev-parse', 'HEAD')
    }
    save(10)
    const first = commit('First tower')
    const mainBranch = git('branch', '--show-current')
    const before = buildRelease(root).assets[0]
    git('checkout', '-b', 'model-update')
    c.models[0].license = 'CC0-1.0'
    c.models[0].author = 'New author'
    c.landmarks[0].bearing = 60
    save(20)
    const second = commit('Update tower')
    git('checkout', mainBranch)
    git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '--no-ff', 'model-update', '-m', 'Merge updated tower')
    const release = buildRelease(root)
    const id = release.release
    const summary = buildHistory(root, release)
    const history: AssetHistory = JSON.parse(new TextDecoder().decode(release.files.get('api/v1/history/tower.json')))
    expect(summary).toMatchObject({ complete: true, versions: 2, unavailable: 0 })
    expect(history.versions.map(v => v.commit)).toEqual([second, first])
    const past = history.versions[1].asset
    expect(past).toEqual(before)
    expect(past.artisticLicense).toBe('CC-BY-4.0')
    expect(past.authors).toEqual(['Original author'])
    expect(release.files.has(past.lods.low.url.slice(1))).toBe(true)
    expect(new TextDecoder().decode(release.files.get(past.source!.url.slice(1)))).toBe('// height 10')
    expect(release.release).toBe(id)
    expect(JSON.parse(new TextDecoder().decode(release.files.get('api/v1/latest.json'))).release).toBe(id)
    expect(release.assets[0].lods.low.sha256).not.toBe(past.lods.low.sha256)
    // Rebuilding from a clean output requires no previous deployment or network.
    const again = buildRelease(root)
    buildHistory(root, again)
    expect(again.files.get('api/v1/history/tower.json')).toEqual(release.files.get('api/v1/history/tower.json'))
  } finally { rmSync(root, { recursive: true, force: true }) }
})
