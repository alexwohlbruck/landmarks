/**
 * Build a release in Open Landmarks' published format.
 *
 * Open Landmarks (https://github.com/benjamintd/open-landmarks) publishes
 * immutable releases behind small channel pointers:
 *
 *   /api/v1/latest.json                          pointer: the current release
 *   /api/v1/preview.json                         pointer for the preview channel
 *   /api/v1/releases/<release>/catalogue.json    release summary, links the rest
 *   /api/v1/releases/<release>/assets.json       every asset's record
 *   /api/v1/releases/<release>/index/12/x/y.json the same records, by z12 tile
 *   /models/<id>/<sha256>/low.glb                the model, content-addressed
 *   /models/<id>/<sha256>/low.glb.gz             the same, as a gzip file
 *   /assets/<id>/<revision>/asset.json           one record on its own
 *
 * Writing exactly that means any Open Landmarks client, Barrelman's importer
 * among them, reads this dataset with no special case.
 *
 * Open Landmarks has no bearing or scale: an asset's geometry is baked in
 * place, with heading 0. Our catalog places one model many times, so each
 * placement becomes its own asset with its bearing and scale baked into a copy
 * of the GLB (see bakePlacement). A placement with nothing to bake keeps the
 * model's exact bytes, and identical bytes are stored once.
 *
 * Elevation is the exception. It is published as its own field rather than
 * baked, because a map grounds a model by its geometry: it reads the lowest
 * points as the model's ground and sets them on the terrain, which would
 * pull a baked lift straight back down. As a field, the model's ground stays
 * at y = 0 and the map applies the offset after grounding it. An asset with
 * no `elevation` (every Open Landmarks asset) stands at 0.
 *
 * Nothing here reads the clock or git, and every list is sorted, so the same
 * catalog always builds byte-identical files and the same release id. A
 * client that skips an unchanged release id (Barrelman does) then skips an
 * unchanged catalog.
 */
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { existsSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { DEFAULT_MIN_ZOOM, validateCatalog, type Catalog, type CatalogLandmark, type CatalogModel } from './catalog'
import { bakePlacement, glbBounds, triangleCount } from './glb'

export const SCHEMA_VERSION = 1
export const AXES = 'X east / Y up / Z south'
export const INDEX_ZOOM = 12
export const REPOSITORY = 'https://github.com/alexwohlbruck/landmarks'
/** The pointers published. Both name the same release: there is no review queue here. */
export const CHANNELS = ['latest', 'preview'] as const

const OSM_ATTRIBUTION = '© OpenStreetMap contributors'
const LICENSE_SCOPE =
  'The model licence covers the 3D model only. The anchor and the OSM elements it replaces are derived from ' +
  'OpenStreetMap and are ODbL-1.0.'

type Lod = {
  url: string
  bytes: number
  sha256: string
  triangles: number
  gzip: { url: string; bytes: number; sha256: string; encoding: 'gzip-file' }
}
type OsmRef = { type: string; id: number; url: string }

/** One asset record, as published in assets.json. */
export type Asset = {
  id: string
  name: string
  anchor: [number, number]
  heading: 0
  units: 'metres'
  axes: typeof AXES
  minZoom: number
  lods: { low: Lod }
  triangles: number
  entranceLights: number[][]
  osm: OsmRef | null
  additionalOsm: OsmRef[]
  /** Not in Open Landmarks' schema; Barrelman uses it to match two sources' models of one building. */
  wikidata?: string
  attribution?: string
  authors: string[]
  artisticLicense: string
  spatialDataLicense: 'ODbL-1.0'
  licenseScope: string
  /**
   * Not in Open Landmarks' schema: metres the model is raised (positive) or
   * sunk (negative) from where the map grounds it. Not baked into the GLB,
   * and omitted when 0, which is what a reader should assume when it is absent.
   */
  elevation?: number
  /** Not in Open Landmarks' schema: the catalog model and the placement baked into the GLB. */
  model: string
  placement: { bearing: number; scale: number }
  source?: { url: string; bytes: number; sha256: string }
  bounds: [number, number, number, number]
  revision: string
  metadata: string
}

export type Release = {
  release: string
  assets: Asset[]
  /** Path under dist/ → contents. */
  files: Map<string, Uint8Array>
}

const sha256 = (bytes: Uint8Array | string) => createHash('sha256').update(bytes).digest('hex')
const json = (value: unknown) => new TextEncoder().encode(JSON.stringify(value))
const round = (v: number, places = 7) => Number(v.toFixed(places))

/** "way/123" → Open Landmarks' { type, id, url }. */
export function osmRef(ref: string): OsmRef {
  const [type, id] = ref.split('/')
  return { type, id: Number(id), url: `https://www.openstreetmap.org/${type}/${id}` }
}

/** The z12 tile an anchor falls in, as Open Landmarks' index names it. */
export function indexTile(lng: number, lat: number, z = INDEX_ZOOM): [number, number] {
  const n = 2 ** z
  const x = Math.floor(((lng + 180) / 360) * n)
  const r = (lat * Math.PI) / 180
  const y = Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n)
  return [x, y]
}

export class CatalogError extends Error {
  constructor(public problems: string[]) {
    super(`catalog has ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n  ${problems.join('\n  ')}`)
  }
}

/**
 * Check the catalog and the files it names, without building anything.
 * Everything wrong is reported at once.
 */
export function checkCatalog(root: string, catalog: Catalog): string[] {
  const problems = validateCatalog(catalog)
  for (const m of catalog.models ?? []) {
    const path = join(root, m.file ?? '')
    if (!m.file || !existsSync(path)) {
      problems.push(`model "${m.id}": ${m.file} does not exist`)
      continue
    }
    try {
      const { height, radius } = glbBounds(new Uint8Array(readFileSync(path)))
      // Standing on its origin, not centred on it.
      if (!(height > 0) || !(radius > 0)) problems.push(`model "${m.id}": has no extent above its origin`)
    } catch (err) {
      problems.push(`model "${m.id}": ${(err as Error).message}`)
    }
    if (m.source && !existsSync(join(root, m.source))) problems.push(`model "${m.id}": source ${m.source} does not exist`)
  }
  return problems
}

/**
 * Build the release for the catalog at `root`. Throws a CatalogError listing
 * every problem rather than publishing a partial release.
 */
export function buildRelease(root: string, catalog: Catalog = JSON.parse(readFileSync(join(root, 'catalog.json'), 'utf8'))): Release {
  const problems = checkCatalog(root, catalog)
  if (problems.length) throw new CatalogError(problems)

  const files = new Map<string, Uint8Array>()
  const models = new Map<string, CatalogModel>(catalog.models.map((m) => [m.id, m]))
  const modelBytes = new Map<string, Uint8Array>()
  const byHash = new Map<string, Lod>()
  const sources = new Map<string, Asset['source']>()
  const assets: Asset[] = []
  let maxHeightM = 0

  // Code-point order, not locale order, so the build is the same on every machine.
  const placements = [...catalog.landmarks].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  for (const l of placements) {
    const model = models.get(l.model)!
    let bytes = modelBytes.get(model.id)
    if (!bytes) modelBytes.set(model.id, (bytes = new Uint8Array(readFileSync(join(root, model.file)))))
    const placement = { bearing: l.bearing ?? 0, scale: l.scale ?? 1 }
    const elevation = l.elevation ?? 0
    let baked: Uint8Array
    try {
      baked = bakePlacement(bytes, placement)
    } catch (err) {
      problems.push(`landmark "${l.id}": cannot bake its placement: ${(err as Error).message}`)
      continue
    }
    const lod = lodFor(l, baked, byHash, files)
    const { height, radius } = glbBounds(baked)
    // How high it reaches above the ground, as before elevation stopped being baked.
    maxHeightM = Math.max(maxHeightM, height + elevation)

    let source: Asset['source']
    if (model.source) {
      source = sources.get(model.source)
      if (!source) {
        const text = readFileSync(join(root, model.source))
        const sha = sha256(text)
        const url = `/objects/${sha}/${basename(model.source)}`
        files.set(url.slice(1), new Uint8Array(text))
        sources.set(model.source, (source = { url, bytes: text.length, sha256: sha }))
      }
    }

    const [first, ...rest] = (l.replaces ?? []).map(osmRef)
    const dLat = radius / 111_320
    const dLng = radius / (111_320 * Math.cos((l.lat * Math.PI) / 180))
    const record: Omit<Asset, 'revision' | 'metadata'> = {
      id: l.id,
      name: l.name,
      anchor: [l.lng, l.lat],
      heading: 0,
      units: 'metres',
      axes: AXES,
      minZoom: l.minzoom ?? DEFAULT_MIN_ZOOM,
      lods: { low: lod },
      triangles: lod.triangles,
      entranceLights: [],
      osm: first ?? null,
      additionalOsm: rest,
      ...(l.wikidata ? { wikidata: l.wikidata } : {}),
      ...(model.attribution ? { attribution: model.attribution } : {}),
      ...(elevation ? { elevation } : {}),
      authors: [model.author],
      artisticLicense: model.license,
      spatialDataLicense: 'ODbL-1.0',
      licenseScope: LICENSE_SCOPE,
      model: model.id,
      placement,
      ...(source ? { source } : {}),
      bounds: [round(l.lng - dLng), round(l.lat - dLat), round(l.lng + dLng), round(l.lat + dLat)],
    }
    // A revision names this exact record, as Open Landmarks' does, so its
    // standalone copy is as immutable as the models.
    const revision = sha256(JSON.stringify(record))
    const asset: Asset = { ...record, revision, metadata: `/assets/${l.id}/${revision}/asset.json` }
    files.set(asset.metadata.slice(1), json(asset))
    assets.push(asset)
  }
  if (problems.length) throw new CatalogError(problems)

  const bounds = assets.reduce(
    (b, a) => [Math.min(b[0], a.bounds[0]), Math.min(b[1], a.bounds[1]), Math.max(b[2], a.bounds[2]), Math.max(b[3], a.bounds[3])],
    [Infinity, Infinity, -Infinity, -Infinity],
  )

  // The release id is a hash of everything a client reads, so it moves when
  // and only when the published data does.
  const content = {
    schemaVersion: SCHEMA_VERSION,
    attribution: OSM_ATTRIBUTION,
    dataLicense: 'ODbL-1.0',
    repository: REPOSITORY,
    assets,
  }
  const release = `landmarks-${sha256(JSON.stringify(content)).slice(0, 20)}`
  const base = `api/v1/releases/${release}`

  const tiles = new Map<string, Asset[]>()
  for (const a of assets) {
    const key = indexTile(...a.anchor).join('/')
    tiles.set(key, [...(tiles.get(key) ?? []), a])
  }
  const occupied = [...tiles.keys()].sort()
  for (const key of occupied) files.set(`${base}/index/${INDEX_ZOOM}/${key}.json`, json({ schemaVersion: SCHEMA_VERSION, release, assets: tiles.get(key) }))

  files.set(`${base}/assets.json`, json({ schemaVersion: SCHEMA_VERSION, release, assets }))
  files.set(`${base}/catalogue.json`, json({
    schemaVersion: SCHEMA_VERSION,
    release,
    channel: CHANNELS[0],
    count: assets.length,
    status: 'published',
    assetBase: '/',
    bounds: assets.length ? bounds.map((v) => round(v)) : null,
    maxHeightM: round(maxHeightM, 1),
    attribution: OSM_ATTRIBUTION,
    dataLicense: 'ODbL-1.0',
    repository: REPOSITORY,
    index: { zoom: INDEX_ZOOM, template: `/${base}/index/${INDEX_ZOOM}/{x}/{y}.json`, occupied },
    assets: `/${base}/assets.json`,
  }))
  for (const channel of CHANNELS)
    files.set(`api/v1/${channel}.json`, json({ schemaVersion: SCHEMA_VERSION, channel, release, count: assets.length, catalogue: `/${base}/catalogue.json` }))
  return { release, assets, files }
}

/** The LOD record for a baked GLB, storing its bytes once however many placements share them. */
function lodFor(l: CatalogLandmark, baked: Uint8Array, byHash: Map<string, Lod>, files: Map<string, Uint8Array>): Lod {
  const sha = sha256(baked)
  const seen = byHash.get(sha)
  if (seen) return seen
  // A gzip header carries no name or time from zlib, so this is deterministic.
  const gz = new Uint8Array(gzipSync(baked, { level: 9 }))
  const url = `/models/${l.id}/${sha}/low.glb`
  files.set(url.slice(1), baked)
  files.set(`${url.slice(1)}.gz`, gz)
  const lod: Lod = {
    url,
    bytes: baked.length,
    sha256: sha,
    triangles: triangleCount(baked),
    gzip: { url: `${url}.gz`, bytes: gz.length, sha256: sha256(gz), encoding: 'gzip-file' },
  }
  byHash.set(sha, lod)
  return lod
}
