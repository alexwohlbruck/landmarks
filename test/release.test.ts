import { describe, expect, test, setDefaultTimeout } from 'bun:test'

// Each test builds the whole catalog (400+ landmarks), which takes seconds.
setDefaultTimeout(120_000)
import { createHash } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildRelease, CatalogError, indexTile, type Asset } from '../src/release'
import type { Catalog } from '../src/catalog'
import { place, worldVertices } from './helpers'

const ROOT = join(import.meta.dir, '..')
const shipped = (): Catalog => JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf8'))
const sha = (b: Uint8Array) => createHash('sha256').update(b).digest('hex')
const text = (b: Uint8Array) => JSON.parse(new TextDecoder().decode(b))

describe('the release', () => {
  const release = buildRelease(ROOT)
  const file = (url: string) => {
    const bytes = release.files.get(url.replace(/^\//, ''))
    if (!bytes) throw new Error(`${url} is not in the release`)
    return bytes
  }

  test('chains pointer → catalogue → assets, as Open Landmarks does', () => {
    for (const channel of ['latest', 'preview']) {
      const pointer = text(file(`/api/v1/${channel}.json`))
      expect(pointer).toMatchObject({ schemaVersion: 1, channel, release: release.release, count: release.assets.length })
      const catalogue = text(file(pointer.catalogue))
      expect(catalogue.release).toBe(release.release)
      expect(text(file(catalogue.assets)).assets).toEqual(release.assets)
    }
  })

  test('publishes every asset the way an Open Landmarks client checks it', () => {
    for (const a of release.assets) {
      expect(a.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(a.heading).toBe(0)
      expect(a.axes).toBe('X east / Y up / Z south')
      const { low } = a.lods
      expect(low.url).toMatch(new RegExp(`^/models/[a-z0-9-]+/${low.sha256}/low\\.glb$`))
      const glb = file(low.url)
      expect(sha(glb)).toBe(low.sha256)
      expect(glb.length).toBe(low.bytes)
      // The gzip variant is a gzip file of the same bytes, with its own hash.
      const gz = file(low.gzip.url)
      expect(sha(gz)).toBe(low.gzip.sha256)
      expect(gz.length).toBe(low.gzip.bytes)
      expect(sha(new Uint8Array(gunzipSync(gz)))).toBe(low.sha256)
      // Its standalone record is this record.
      expect(text(file(a.metadata))).toEqual(a)
    }
  })

  test('maps replaces to osm and additionalOsm, in order', () => {
    const catalog = shipped()
    for (const l of catalog.landmarks) {
      const a = release.assets.find((x) => x.id === l.id)!
      const refs = [a.osm, ...a.additionalOsm].filter(Boolean).map((r) => `${r!.type}/${r!.id}`)
      expect(refs).toEqual(l.replaces ?? [])
    }
    const eiffel = release.assets.find((a) => a.id === 'eiffel-tower')!
    expect(eiffel.osm).toEqual({ type: 'way', id: 5013364, url: 'https://www.openstreetmap.org/way/5013364' })
  })

  test('gives each placement of a model its own baked file', () => {
    const paris = release.assets.find((a) => a.id === 'eiffel-tower')!
    const vegas = release.assets.find((a) => a.id === 'paris-las-vegas-eiffel-tower')!
    expect(paris.model).toBe('eiffel-tower')
    expect(vegas.model).toBe('eiffel-tower')
    expect(vegas.placement).toEqual({ bearing: 45, scale: 0.5 })
    expect(paris.lods.low.sha256).not.toBe(vegas.lods.low.sha256)
  })

  test('publishes elevation as a field, only where it is set', () => {
    const catalog = shipped()
    for (const l of catalog.landmarks) {
      const a = release.assets.find((x) => x.id === l.id)!
      if (l.elevation) expect(a.elevation).toBe(l.elevation)
      else expect('elevation' in a).toBe(false)
    }
  })

  test('draws every raised placement where the baked lift did: same vertices, lower by elevation', () => {
    const catalog = shipped()
    const raised = catalog.landmarks.filter((l) => l.elevation)
    expect(raised.map((l) => l.id)).toContain('statue-of-liberty')
    for (const l of raised) {
      const asset = release.assets.find((a) => a.id === l.id)!
      const model = catalog.models.find((m) => m.id === l.model)!
      const authored = new Uint8Array(readFileSync(join(ROOT, model.file)))
      const published = file(asset.lods.low.url)
      // At rest and part way through any animation, so moving parts are checked too.
      for (const k of [undefined, 1]) {
        // What the release used to bake: turned, scaled and lifted by `elevation`.
        const before = worldVertices(authored, k).flatMap((p) => p.positions).map((p) => place(p, { ...l, elevation: l.elevation }))
        const now = worldVertices(published, k).flatMap((p) => p.positions).map(([x, y, z]) => [x, y + asset.elevation!, z])
        expect(now.length).toBe(before.length)
        now.forEach((v, i) => v.forEach((c, n) => expect(c).toBeCloseTo(before[i][n], 3)))
      }
    }
  })

  test('keeps a model placed as authored byte for byte', () => {
    const catalog = shipped()
    const upright = catalog.landmarks.find((l) => !l.bearing && !l.scale)!
    const model = catalog.models.find((m) => m.id === upright.model)!
    const asset = release.assets.find((a) => a.id === upright.id)!
    expect(asset.lods.low.sha256).toBe(sha(new Uint8Array(readFileSync(join(ROOT, model.file)))))
  })

  test('indexes each asset under the z12 tile of its anchor', () => {
    const catalogue = text(file(text(file('/api/v1/latest.json')).catalogue))
    for (const a of release.assets) {
      const key = indexTile(...a.anchor).join('/')
      expect(catalogue.index.occupied).toContain(key)
      expect(text(file(`/api/v1/releases/${release.release}/index/12/${key}.json`)).assets.map((x: Asset) => x.id)).toContain(a.id)
    }
  })
})

describe('the release id', () => {
  test('is the same for the same catalog, file for file', () => {
    const a = buildRelease(ROOT)
    const b = buildRelease(ROOT)
    expect(a.release).toBe(b.release)
    expect([...a.files.keys()]).toEqual([...b.files.keys()])
    for (const [path, bytes] of a.files) expect(sha(b.files.get(path)!)).toBe(sha(bytes))
  })

  test('moves when a placement does', () => {
    const catalog = shipped()
    const before = buildRelease(ROOT, catalog).release
    catalog.landmarks[0] = { ...catalog.landmarks[0], bearing: (catalog.landmarks[0].bearing ?? 0) + 1 }
    expect(buildRelease(ROOT, catalog).release).not.toBe(before)
  })

  test('stores identical bytes once', () => {
    const catalog = shipped()
    const eiffel = catalog.landmarks.find((l) => l.id === 'eiffel-tower')!
    catalog.landmarks.push({ ...eiffel, id: 'eiffel-tower-again' })
    const { assets, files } = buildRelease(ROOT, catalog)
    const again = assets.find((a) => a.id === 'eiffel-tower-again')!
    expect(again.lods.low.url).toBe(assets.find((a) => a.id === 'eiffel-tower')!.lods.low.url)
    expect([...files.keys()].some((p) => p.startsWith('models/eiffel-tower-again/'))).toBe(false)
  })
})

test('refuses to build a catalog with problems, listing them all', () => {
  const catalog = shipped()
  catalog.landmarks[0] = { ...catalog.landmarks[0], model: 'missing', replaces: ['123'] }
  try {
    buildRelease(ROOT, catalog)
    throw new Error('built')
  } catch (err) {
    expect(err).toBeInstanceOf(CatalogError)
    expect((err as CatalogError).problems.length).toBeGreaterThanOrEqual(2)
  }
})
