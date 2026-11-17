/** Shared source normalization and discovery rules, independent of the DOM. */
import type { Asset } from '../src/release'
import type { Place } from '../src/catalog'
export const OPEN_LANDMARKS = { id: 'open-landmarks', name: 'OpenLandmarks', url: 'https://open-landmarks.benmaps.fr/' }
export type UpstreamAsset = Omit<Asset, 'model' | 'placement' | 'references'> & {
  model?: string; placement?: Asset['placement']; approved?: boolean
  geometryStatus?: string; assistance?: string
  references?: (NonNullable<Asset['references']>[number] & { sourcePage?: string })[]
  boundsBlenderM?: number[][]
}
/** Preserve upstream metadata and make every download independent of our hosting path. */
export function normalizeUpstream(raw: UpstreamAsset, place?: Place): Asset {
  const url = (path: string) => new URL(path, OPEN_LANDMARKS.url).href
  const lod = (value: Asset['lods']['low']) => ({ ...value, url: url(value.url), gzip: { ...value.gzip, url: url(value.gzip.url) } })
  return {
    ...raw, id: `open-landmarks--${raw.id}`, model: raw.model ?? raw.id,
    placement: raw.placement ?? { bearing: 0, scale: 1 },
    collection: OPEN_LANDMARKS,
    lods: { low: lod(raw.lods.low), ...(raw.lods.detail ? { detail: lod(raw.lods.detail) } : {}) },
    metadata: url(raw.metadata),
    ...(raw.source ? { source: { ...raw.source, url: url(raw.source.url) } } : {}),
    ...(place ? { place } : {}),
    reviewStatus: raw.approved ? 'approved' : raw.geometryStatus ?? 'draft',
    references: raw.references?.map(r => ({ ...r, url: r.url ?? r.sourcePage! })),
    ...(raw.boundsBlenderM ? { height: raw.boundsBlenderM[1][2] - raw.boundsBlenderM[0][2] } : {}),
  }
}
export function matchesAsset(a: Asset, filters: { term: string; place: string; type: string; tag: string; source: string }) {
  const places = [a.place, ...(a.placeParents ?? [])].filter(Boolean)
  const text = [a.name, a.id, a.type, ...(a.tags ?? []), ...places.map(p => p!.name),
    ...a.authors, ...(a.credits ?? []).flatMap(c => [c.name, c.model ?? '', c.github ?? '']), a.collection?.name, a.description].join(' ').toLowerCase()
  return (!filters.place || places.some(p => p!.id === filters.place)) &&
    (!filters.type || (a.type ?? 'landmark') === filters.type) &&
    (!filters.tag || a.tags?.includes(filters.tag)) &&
    (!filters.source || a.collection?.id === filters.source) && text.includes(filters.term.trim().toLowerCase())
}
/** Prefer selected, then local versions of an OSM/Wikidata feature. Both stay in search. */
export function mapAssets(assets: Asset[], selectedId?: string): Asset[] {
  const keys = new Set<string>()
  return [...assets].sort((a, b) => Number(b.id === selectedId) - Number(a.id === selectedId) ||
    Number(a.collection?.id === 'open-landmarks') - Number(b.collection?.id === 'open-landmarks'))
    .filter(a => {
      const refs = [a.osm, ...a.additionalOsm].filter(Boolean).map(r => `osm:${r!.type}/${r!.id}`)
      if (a.wikidata) refs.push(`wd:${a.wikidata}`)
      if (refs.some(ref => keys.has(ref))) return false
      refs.forEach(ref => keys.add(ref))
      return true
    })
}
