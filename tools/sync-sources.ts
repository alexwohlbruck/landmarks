/** Refresh the checked-in metadata snapshot; GLBs remain on the upstream host. */
import { normalizeUpstream, OPEN_LANDMARKS, type UpstreamAsset } from '../web/collection'
import type { Place } from '../src/catalog'
const get = async (path: string) => {
  const response = await fetch(new URL(path, OPEN_LANDMARKS.url), { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`${response.url}: HTTP ${response.status}`)
  return response.json()
}
const pointer = await get('/api/v1/preview.json')
const catalogue = await get(pointer.catalogue)
const data = await get(catalogue.assets)
if (!Array.isArray(data.assets) || !data.assets.length) throw new Error('Upstream returned no models; keeping existing snapshot')
// Curated place associations for the source's current coverage. New coverage stays
// unspecified until assigned explicitly, never snapped to an unrelated nearest city.
const places: Place[] = [
  { id: 'paris', name: 'Paris', kind: 'city', wikidata: 'Q90' },
  { id: 'london', name: 'London', kind: 'city', wikidata: 'Q84' },
  { id: 'san-francisco-bay-area', name: 'San Francisco Bay Area', kind: 'region' },
]
const overrides: Record<string, string> = await Bun.file(new URL('../web/upstream-places.json', import.meta.url)).json()
const assets = (data.assets as UpstreamAsset[]).map(raw => {
  if (!raw.id || !raw.lods?.low?.url || !raw.artisticLicense || !raw.metadata || !Array.isArray(raw.authors)) throw new Error('Unsupported upstream asset')
  return normalizeUpstream(raw, places.find(p => p.id === overrides[raw.id]))
})
await Bun.write(new URL('../web/open-landmarks.json', import.meta.url), JSON.stringify({
  source: OPEN_LANDMARKS, release: pointer.release, channel: pointer.channel,
  assets,
}, null, 2) + '\n')
console.log(`Updated OpenLandmarks: ${assets.length} models from ${pointer.release}`)
