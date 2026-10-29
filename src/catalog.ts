/**
 * The catalog: models, and the placements that put them on the map.
 *
 * A model is a GLB in `models/` plus its licence and author. A landmark
 * places a model: where, which way round, how big, and which OSM elements it
 * stands in for. One model can be placed many times (the Eiffel Tower stands
 * in Paris and, at half scale, in Las Vegas).
 */

export const DEFAULT_LICENSE = 'CC0-1.0'
export const MODEL_TYPES = ['landmark', 'building', 'bridge', 'coaster', 'ride', 'monument', 'sculpture', 'tower', 'fountain', 'stadium', 'infrastructure', 'landscape', 'other'] as const
export type ModelType = typeof MODEL_TYPES[number]
export type Credit = {
  name: string
  kind: 'person' | 'organization' | 'ai'
  role?: string
  url?: string
  /** GitHub login; the viewer uses its profile link and avatar. */
  github?: string
  /** Actual LLM used, required for AI credits. Separate from the author's name. */
  model?: string
}
export type Reference = { title: string; url: string; author?: string; license?: string }
export type Place = {
  /** Permanent catalog key; names may change without breaking references. */
  id: string
  name: string
  kind: 'city' | 'town' | 'village' | 'region' | 'site' | 'country'
  parent?: string
  wikidata?: string
  osm?: string
}

export type CatalogModel = {
  id: string
  /** Relative to the repo root. */
  file: string
  /** SPDX identifier; omitted means CC0-1.0. Custom licenses need licenseUrl. */
  license?: string
  licenseUrl?: string
  /** Legacy credit, accepted for older catalogs. Prefer credits for new models. */
  author?: string
  credits?: Credit[]
  type?: ModelType
  tags?: string[]
  description?: string
  references?: Reference[]
  reviewStatus?: 'unreviewed' | 'draft' | 'reviewed'
  /** Dataset provenance, distinct from the source-code path below. */
  collection?: string
  /** The generator that writes it, relative to the repo root. */
  source?: string
  /** Original model's web page, when imported from another creator. */
  sourcePage?: string
  /** A credit a map must show while drawing it, for licences that need one (CC-BY). */
  attribution?: string
  /**
   * A finer GLB, in the same frame, that a map switches to from `detailZoom`
   * up: thin parts the low model leaves out, such as a bridge's suspenders.
   */
  detail?: string
  /** Smallest zoom the detail model is drawn at; 17 when absent. */
  detailZoom?: number
}

export type CatalogLandmark = {
  id: string
  name: string
  model: string
  lng: number
  lat: number
  /** Degrees clockwise from north that the model's -Z axis is turned to. */
  bearing?: number
  scale?: number
  /**
   * Metres the model is raised (positive) or sunk (negative) from where the
   * map would otherwise stand it, its y = 0 on the lowest ground under its
   * footprint. For what the terrain doesn't show: a plinth or pier OSM
   * doesn't map, a field below the street. Absent means 0.
   */
  elevation?: number
  /** Smallest zoom a client should draw it at. */
  minzoom?: number
  replaces?: string[]
  wikidata?: string
  /** Explicit place, never inferred by the viewer from coordinates. */
  place?: string
}

export type Catalog = { places?: Place[]; models: CatalogModel[]; landmarks: CatalogLandmark[] }
export const creditsFor = (model: CatalogModel): Credit[] => model.credits ?? (model.author ? [{ name: model.author, kind: 'organization' }] : [])
export const licenseFor = (model: CatalogModel) => model.license ?? DEFAULT_LICENSE
const webUrl = (value: string) => { try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false } }
const safePath = (file: string) => !file.includes('..') && !file.startsWith('/') && !file.includes('\\') && !file.includes(':')

/**
 * The most a placement may be raised or sunk, in metres. Well past any real
 * plinth, pier or sunken bowl: a larger value is a typo or a model whose own
 * y = 0 is wrong, and should be fixed in the model.
 */
export const MAX_ELEVATION_M = 200

/** What a placement without `minzoom` gets: the zoom Barrelman has always used. */
export const DEFAULT_MIN_ZOOM = 14

const OSM_REF_RE = /^(node|way|relation)\/\d+$/
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const WIKIDATA_RE = /^Q\d+$/

/**
 * Check a catalog's shape. Returns every problem rather than throwing on the
 * first, so one run reports everything wrong with an edit. The same rules
 * Barrelman applied to the catalog when it shipped one.
 */
export function validateCatalog(catalog: Catalog): string[] {
  const problems: string[] = []
  const places = new Map((catalog.places ?? []).map(p => [p.id, p]))
  if (places.size !== (catalog.places ?? []).length) problems.push('places: duplicate id')
  for (const p of catalog.places ?? []) {
    const at = `place "${p.id}"`
    if (!SLUG_RE.test(p.id) || !p.name?.trim()) problems.push(`${at}: requires a slug id and name`)
    if (!['city', 'town', 'village', 'region', 'site', 'country'].includes(p.kind)) problems.push(`${at}: invalid kind`)
    if (p.wikidata && !WIKIDATA_RE.test(p.wikidata)) problems.push(`${at}: invalid Wikidata id`)
    if (p.osm && !OSM_REF_RE.test(p.osm)) problems.push(`${at}: invalid OSM ref`)
    const seen = new Set([p.id])
    let parent = p.parent
    while (parent) {
      if (!places.has(parent)) { problems.push(`${at}: unknown parent "${parent}"`); break }
      if (seen.has(parent)) { problems.push(`${at}: parent cycle`); break }
      seen.add(parent)
      parent = places.get(parent)!.parent
    }
  }
  const models = new Set<string>()
  for (const m of catalog.models ?? []) {
    if (!SLUG_RE.test(m.id)) problems.push(`model "${m.id}": id must be a lowercase slug`)
    if (models.has(m.id)) problems.push(`model "${m.id}": duplicate id`)
    models.add(m.id)
    for (const [key, file] of [['file', m.file], ['detail', m.detail]] as const) {
      if (key === 'detail' && file === undefined) continue
      if (!file?.endsWith('.glb')) problems.push(`model "${m.id}": ${key} must be a .glb`)
      if (file && !safePath(file)) problems.push(`model "${m.id}": ${key} must stay inside the repo`)
    }
    if (m.detailZoom !== undefined && !(m.detail && m.detailZoom >= 0 && m.detailZoom <= 24))
      problems.push(`model "${m.id}": detailZoom must be 0-24, on a model with a detail file`)
    if (m.license !== undefined && !m.license.trim()) problems.push(`model "${m.id}": license must not be empty`)
    if (!creditsFor(m).length) problems.push(`model "${m.id}": author or credits is required`)
    for (const credit of m.credits ?? []) {
      if (!credit.name?.trim() || !['person', 'organization', 'ai'].includes(credit.kind)) problems.push(`model "${m.id}": invalid credit`)
      if (credit.kind === 'ai' && !credit.model?.trim()) problems.push(`model "${m.id}": AI credit needs the model used`)
      if (credit.model !== undefined && (credit.kind !== 'ai' || !credit.model.trim())) problems.push(`model "${m.id}": model used belongs on an AI credit`)
      if (credit.github && !/^@?[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(credit.github)) problems.push(`model "${m.id}": invalid GitHub username`)
      if (credit.url && !webUrl(credit.url)) problems.push(`model "${m.id}": credit URL must be http(s)`)
    }
    if (m.type && !MODEL_TYPES.includes(m.type)) problems.push(`model "${m.id}": unknown type "${m.type}"`)
    if (m.tags && (m.tags.some(t => !SLUG_RE.test(t)) || new Set(m.tags).size !== m.tags.length)) problems.push(`model "${m.id}": tags must be unique lowercase slugs`)
    if (m.source && !safePath(m.source)) problems.push(`model "${m.id}": source must stay inside the repo`)
    if (m.sourcePage && !webUrl(m.sourcePage)) problems.push(`model "${m.id}": sourcePage must be http(s)`)
    if (m.licenseUrl && !webUrl(m.licenseUrl)) problems.push(`model "${m.id}": license URL must be http(s)`)
    if (m.license && !/^(CC0-1\.0|CC-BY(-SA|-NC|-NC-SA|-ND|-NC-ND)?-(1\.0|2\.0|2\.5|3\.0|4\.0)|MIT|Apache-2\.0)$/.test(m.license) && !m.licenseUrl) problems.push(`model "${m.id}": custom license needs licenseUrl`)
    if (m.reviewStatus && !['unreviewed', 'draft', 'reviewed'].includes(m.reviewStatus)) problems.push(`model "${m.id}": invalid reviewStatus`)
    for (const ref of m.references ?? []) if (!ref.title?.trim() || !webUrl(ref.url)) problems.push(`model "${m.id}": reference needs a title and http(s) URL`)
    if (/^CC-BY/i.test(m.license ?? '') && !m.attribution)
      problems.push(`model "${m.id}": a ${m.license} model needs an attribution`)
  }
  const ids = new Set<string>()
  for (const l of catalog.landmarks ?? []) {
    const at = `landmark "${l.id}"`
    if (!SLUG_RE.test(l.id)) problems.push(`${at}: id must be a lowercase slug`)
    if (ids.has(l.id)) problems.push(`${at}: duplicate id`)
    ids.add(l.id)
    if (!l.name) problems.push(`${at}: name is required`)
    if (!models.has(l.model)) problems.push(`${at}: unknown model "${l.model}"`)
    if (l.place && !places.has(l.place)) problems.push(`${at}: unknown place "${l.place}"`)
    if (catalog.places && !l.place) problems.push(`${at}: place is required when the catalog defines places`)
    if (!(Math.abs(l.lng) <= 180 && Math.abs(l.lat) <= 85)) problems.push(`${at}: lng/lat out of range`)
    if (l.bearing !== undefined && !Number.isFinite(l.bearing)) problems.push(`${at}: bearing must be a number`)
    if (l.scale !== undefined && !(l.scale > 0)) problems.push(`${at}: scale must be positive`)
    if (l.elevation !== undefined && !(Number.isFinite(l.elevation) && Math.abs(l.elevation) <= MAX_ELEVATION_M))
      problems.push(`${at}: elevation must be a number of metres within ±${MAX_ELEVATION_M}`)
    if (l.minzoom !== undefined && !(l.minzoom >= 0 && l.minzoom <= 24)) problems.push(`${at}: minzoom must be 0-24`)
    if (l.wikidata !== undefined && !WIKIDATA_RE.test(l.wikidata)) problems.push(`${at}: "${l.wikidata}" is not a Wikidata id like Q243`)
    for (const ref of l.replaces ?? [])
      if (!OSM_REF_RE.test(ref)) problems.push(`${at}: "${ref}" is not an OSM ref like way/123`)
    if (new Set(l.replaces ?? []).size !== (l.replaces ?? []).length) problems.push(`${at}: replaces lists a ref twice`)
  }
  for (const id of models)
    if (!(catalog.landmarks ?? []).some((l) => l.model === id)) problems.push(`model "${id}": not placed anywhere`)
  return problems
}
