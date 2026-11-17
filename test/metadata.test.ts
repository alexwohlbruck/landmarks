import { describe, expect, test } from 'bun:test'
import { validateCatalog, type Catalog } from '../src/catalog'
import { buildRelease } from '../src/release'
import { matchesAsset, mapAssets, normalizeUpstream, type UpstreamAsset } from '../web/collection'
import { box, material, writeGlb } from './helpers'
const catalog: Catalog = {
  places: [
    { id: 'remote-area', name: 'Remote region', kind: 'region' },
    { id: 'small-town', name: 'Small Town', kind: 'town', parent: 'remote-area' },
  ],
  models: [{ id: 'tower', file: 'models/tower.glb', type: 'tower', tags: ['historic'], credits: [
    { name: 'Ada', kind: 'person', role: 'modeler' }, { name: 'Claude', kind: 'ai', role: 'generator', model: 'Claude Opus 5.5' },
  ] }],
  landmarks: [{ id: 'tower', name: 'Tower', model: 'tower', lng: -10, lat: 50, place: 'small-town', replaces: ['way/123'] }],
}
const bytes = writeGlb('test', [{ part: box([-1, -1, 0], [1, 1, 10]), material }])
const asset = () => buildRelease('', catalog, () => bytes).assets[0]
describe('public model metadata', () => {
  test('defaults the license and preserves places, tags, and AI credits in the release', () => {
    const a = asset()
    expect(a.artisticLicense).toBe('CC0-1.0')
    expect(a.credits).toEqual(catalog.models[0].credits)
    expect(a.authors).toEqual(['Ada', 'Claude'])
    expect(a.place?.id).toBe('small-town')
    expect(a.placeParents?.map(p => p.id)).toEqual(['remote-area'])
    expect(a.type).toBe('tower')
    expect(a.tags).toEqual(['historic'])
  })
  test('rejects unknown places, parent cycles, duplicate tags, and unsafe source paths', () => {
    const c = structuredClone(catalog)
    c.places![0].parent = 'small-town'
    c.landmarks[0].place = 'missing'
    c.models[0].tags = ['bad tag', 'bad tag']
    c.models[0].source = '../secret'
    const errors = validateCatalog(c).join('\n')
    for (const text of ['parent cycle', 'unknown place', 'tags must be unique', 'source must stay inside']) expect(errors).toContain(text)
  })
  test('keeps alternate licenses and required attribution', () => {
    const c = structuredClone(catalog)
    c.models[0].license = 'CC-BY-4.0'
    expect(validateCatalog(c).join()).toContain('needs an attribution')
    c.models[0].attribution = 'Tower by Ada'
    const a = buildRelease('', c, () => bytes).assets[0]
    expect(a.artisticLicense).toBe('CC-BY-4.0')
    expect(a.attribution).toBe('Tower by Ada')
  })
})
describe('combined collections', () => {
  test('normalizes remote paths and IDs without changing upstream license or provenance', () => {
    const a = asset()
    const remote = normalizeUpstream({ ...a, approved: false, geometryStatus: 'draft', source: { url: '/objects/source.blend.gz', bytes: 50, sha256: 'abc' } } as UpstreamAsset)
    expect(remote.id).toBe('open-landmarks--tower')
    expect(remote.lods.low.url).toStartWith('https://open-landmarks.benmaps.fr/models/')
    expect(remote.source?.url).toBe('https://open-landmarks.benmaps.fr/objects/source.blend.gz')
    expect(remote.artisticLicense).toBe(a.artisticLicense)
    expect(remote.reviewStatus).toBe('draft')
    expect(remote.metadata).toStartWith('https://open-landmarks.benmaps.fr/assets/')
  })
  test('searches credits and tags, filters source and place ancestors', () => {
    const filters = { term: 'opus', place: 'remote-area', type: 'tower', tag: 'historic', source: 'landmarks' }
    expect(matchesAsset(asset(), filters)).toBe(true)
    expect(matchesAsset(asset(), { ...filters, source: 'open-landmarks' })).toBe(false)
    expect(matchesAsset(asset(), { ...filters, place: 'paris' })).toBe(false)
  })
  test('keeps a single map model for the same feature and lets selection override local preference', () => {
    const local = asset()
    const remote = normalizeUpstream({ ...local, artisticLicense: 'CC-BY-4.0', attribution: 'Upstream author' } as UpstreamAsset)
    expect(mapAssets([remote, local]).map(a => a.id)).toEqual([local.id])
    expect(mapAssets([local, remote], remote.id).map(a => a.id)).toEqual([remote.id])
    expect(mapAssets([local, { ...remote, osm: null }])).toHaveLength(2)
  })
})
