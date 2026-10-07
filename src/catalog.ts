/**
 * The catalog: models, and the placements that put them on the map.
 *
 * A model is a GLB in `models/` plus its licence and author. A landmark
 * places a model: where, which way round, how big, and which OSM elements it
 * stands in for. One model can be placed many times (the Eiffel Tower stands
 * in Paris and, at half scale, in Las Vegas).
 */

export type CatalogModel = {
  id: string
  /** Relative to the repo root. */
  file: string
  license: string
  author: string
  /** The generator that writes it, relative to the repo root. */
  source?: string
  /** A credit a map must show while drawing it, for licences that need one (CC-BY). */
  attribution?: string
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
  /** Metres above the ground the model's origin sits. */
  elevation?: number
  /** Smallest zoom a client should draw it at. */
  minzoom?: number
  replaces?: string[]
  wikidata?: string
}

export type Catalog = { models: CatalogModel[]; landmarks: CatalogLandmark[] }

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
  const models = new Set<string>()
  for (const m of catalog.models ?? []) {
    if (!SLUG_RE.test(m.id)) problems.push(`model "${m.id}": id must be a lowercase slug`)
    if (models.has(m.id)) problems.push(`model "${m.id}": duplicate id`)
    models.add(m.id)
    if (!m.file?.endsWith('.glb')) problems.push(`model "${m.id}": file must be a .glb`)
    if (m.file?.includes('..') || m.file?.startsWith('/')) problems.push(`model "${m.id}": file must stay inside the repo`)
    if (!m.license) problems.push(`model "${m.id}": license is required`)
    if (!m.author) problems.push(`model "${m.id}": author is required`)
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
    if (!(Math.abs(l.lng) <= 180 && Math.abs(l.lat) <= 85)) problems.push(`${at}: lng/lat out of range`)
    if (l.bearing !== undefined && !Number.isFinite(l.bearing)) problems.push(`${at}: bearing must be a number`)
    if (l.scale !== undefined && !(l.scale > 0)) problems.push(`${at}: scale must be positive`)
    if (l.elevation !== undefined && !Number.isFinite(l.elevation)) problems.push(`${at}: elevation must be a number`)
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
