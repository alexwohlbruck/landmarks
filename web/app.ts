import * as maplibregl from 'maplibre-gl'
import type { GeoJSONSource } from 'maplibre-gl'
import '@google/model-viewer'
import type { ModelViewerElement } from '@google/model-viewer'
import type { Asset } from '../src/release'
import { nightGlb } from './night-model'
import { applyMapTheme } from './theme'
import { LandmarkModels } from './map-models'
import { matchesAsset, mapAssets } from './collection'
import { renderCredit } from './credits'
import type { Credit } from '../src/catalog'
import { inspectGlb, type ModelInfo } from '../src/model-info'
import { assetRows, geometryRows, renderRows, renderAllMetadata } from './model-details'
import type { AssetHistory } from '../src/history'

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T
const viewer = $<ModelViewerElement>('viewer')
const search = $<HTMLInputElement>('search')
const placeSelect = $<HTMLSelectElement>('place')
const typeSelect = $<HTMLSelectElement>('type')
const tagSelect = $<HTMLSelectElement>('tag')
const sourceSelect = $<HTMLSelectElement>('source-filter')
const versionSelect = $<HTMLSelectElement>('version')
const filterSelects = [placeSelect, typeSelect, tagSelect, sourceSelect]
const lodSelect = $<HTMLSelectElement>('lod')
const base = new URL('./', window.location.href)
// Release paths are rooted at the dataset, which may be hosted in a subdirectory.
const assetUrl = (path: string) => new URL(path.replace(/^\//, ''), base).href
maplibregl.setWorkerUrl(assetUrl(`maplibre-gl-worker.mjs?v=${maplibregl.getVersion()}`))
const stored = (key: string) => { try { return localStorage.getItem(key) } catch { return null } }
const saveSetting = (key: string, value: string) => { try { localStorage.setItem(key, value) } catch {} }
let dark = (stored('landmarks-theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'
let previewController: AbortController | undefined
let previewObjectUrl: string | undefined
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
viewer.autoRotate = !reducedMotion
let assets: Asset[] = []
let filtered: Asset[] = []
let selected: Asset | undefined
let ready = false
let map: maplibregl.Map | undefined
let modelLayer: LandmarkModels | undefined
let displayed: Asset | undefined
let versions: AssetHistory['versions'] = []
let selectionRequest = 0
let inspectionController: AbortController | undefined
const inspectionCache = new Map<string, ModelInfo>()
const historyCache = new Map<string, AssetHistory>()
const sourceName = (a: Asset) => a.collection?.name ?? 'Landmarks'
const placeName = (a: Asset) => a.place?.name ?? 'Place unspecified'
const mapCollection = () => mapAssets(filtered, selected?.id)
const link = (label: string, href: string) => {
  const a = document.createElement('a')
  a.textContent = label
  a.href = href
  return a
}
const size = (bytes: number) => `${(bytes / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} kB`
function setUrl() {
  if (selected) history.replaceState(null, '', `#${encodeURIComponent(selected.id)}${displayed && displayed.revision !== selected.revision ? `@${displayed.revision}` : ''}`)
}
function urlSelection() {
  const [id, revision] = location.hash.slice(1).split('@')
  try { return { id: decodeURIComponent(id), revision } } catch { return { id: '', revision: undefined } }
}
function fillFilters() {
  const places = new Map(assets.flatMap(a => [a.place, ...(a.placeParents ?? [])]).filter(Boolean).map(p => [p!.id, p!.name]))
  const sources = new Map(assets.map(a => [a.collection?.id ?? 'landmarks', sourceName(a)]))
  const groups: [HTMLSelectElement, string, Map<string, string>][] = [
    [placeSelect, 'All places', places],
    [typeSelect, 'All types', new Map(assets.map(a => [a.type ?? 'landmark', a.type ?? 'landmark']))],
    [tagSelect, 'All tags', new Map(assets.flatMap(a => a.tags ?? []).map(t => [t, t]))],
    [sourceSelect, 'All sources', sources],
  ]
  for (const [select, label, values] of groups) {
    const value = select.value
    select.replaceChildren(new Option(label, ''))
    for (const [id, name] of [...values].sort((a, b) => a[1].localeCompare(b[1]))) select.add(new Option(name, id))
    if (values.has(value)) select.value = value
  }
}

function features() {
  return { type: 'FeatureCollection' as const, features: mapCollection().map(a => ({
    type: 'Feature' as const, geometry: { type: 'Point' as const, coordinates: a.anchor },
    properties: { id: a.id, name: a.name },
  })) }
}
function fitAll() {
  if (!map || !filtered.length) return
  const bounds = new maplibregl.LngLatBounds()
  filtered.forEach(a => bounds.extend(a.anchor))
  map.fitBounds(bounds, { elevation: 0, pitch: filtered.length === 1 ? 60 : 0, padding: { top: 65, bottom: 45, left: 45, right: 45 }, maxZoom: 15, duration: reducedMotion ? 0 : 900 })
}
function renderResults() {
  filtered = assets.filter(a => matchesAsset(a, { term: search.value, place: placeSelect.value, type: typeSelect.value, tag: tagSelect.value, source: sourceSelect.value }))
  $('result-count').textContent = `${filtered.length.toLocaleString()} landmark${filtered.length === 1 ? '' : 's'}`
  const fragment = document.createDocumentFragment()
  filtered.forEach(a => {
    const button = document.createElement('button')
    button.className = 'result'
    button.type = 'button'
    button.dataset.id = a.id
    button.setAttribute('aria-pressed', String(selected?.id === a.id))
    const text = document.createElement('span')
    const title = document.createElement('span')
    title.className = 'result-name'
    title.textContent = a.name
    const region = document.createElement('small')
    region.textContent = `${placeName(a)} · ${sourceName(a)}${a.reviewStatus === 'draft' ? ' · Draft' : ''}`
    text.append(title, region)
    button.append(text)
    button.addEventListener('click', () => selectAsset(a, true))
    fragment.append(button)
  })
  if (!filtered.length) {
    const empty = document.createElement('p')
    empty.className = 'empty'
    empty.textContent = 'No landmarks found.'
    fragment.append(empty)
  }
  $('results').replaceChildren(fragment)
  if (ready) {
    (map!.getSource('landmarks') as GeoJSONSource).setData(features())
    modelLayer?.setAssets(mapCollection(), selected?.id)
  }
}
function renderFileInfo(a: Asset, lod: Asset['lods']['low'], info?: ModelInfo) {
  renderRows($('geometry-details'), geometryRows(lod, info))
  $('animation-details').replaceChildren(...(info?.animations ?? []).map(clip => {
    const li = document.createElement('li')
    li.textContent = `${clip.name} · ${clip.durationSeconds === null ? 'Duration unknown' : `${clip.durationSeconds.toLocaleString(undefined, { maximumFractionDigits: 3 })} seconds`} · ${clip.channels} channels · ${clip.keyframes} timestamp samples · ${clip.targets.join(', ')}`
    return li
  }))
  $('texture-details').replaceChildren(...(info?.images ?? []).map(img => {
    const li = document.createElement('li')
    li.textContent = `${img.name} · ${img.mimeType ?? 'MIME type unspecified'} · ${img.embedded ? 'embedded' : 'external'}${img.bytes === null ? '' : ` · ${img.bytes.toLocaleString()} bytes`}${img.uri ? ` · ${img.uri}` : ''}`
    return li
  }))
  // Upstream file inspection supplements its published record without overwriting it.
  const metadata = info && !lod.info ? { ...a, inspectedFile: { url: lod.url, info } } : a
  renderAllMetadata($('all-metadata'), metadata)
  $('metadata-json').textContent = JSON.stringify(metadata, null, 2)
}
async function inspectFile(a: Asset, lod: Asset['lods']['low']) {
  inspectionController?.abort()
  const controller = new AbortController()
  inspectionController = controller
  const cached = lod.info ?? inspectionCache.get(lod.url)
  renderFileInfo(a, lod, cached)
  $('inspection-status').textContent = cached ? '' : 'Reading animation and texture metadata from this GLB…'
  if (cached) return
  try {
    const response = await fetch(assetUrl(lod.url), { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const bytes = new Uint8Array(await response.arrayBuffer())
    const info = inspectGlb(bytes)
    if (controller.signal.aborted) return
    inspectionCache.set(lod.url, info)
    if (inspectionCache.size > 24) inspectionCache.delete(inspectionCache.keys().next().value!)
    renderFileInfo(a, lod, info)
    $('inspection-status').textContent = ''
  } catch {
    if (controller.signal.aborted) return
    $('inspection-status').textContent = 'File inspection unavailable. Published file statistics and metadata are still shown.'
    document.querySelectorAll('#geometry-details dd').forEach(dd => { if (dd.textContent === 'Inspecting…') dd.textContent = 'Unavailable' })
  }
}
function updateAppearance() {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document.documentElement.dataset.lighting = dark ? 'night' : 'day'
  $('theme-toggle').setAttribute('aria-checked', String(dark))
  $('theme-toggle').title = dark ? 'Switch to day mode' : 'Switch to night mode'
  $('theme-label').textContent = dark ? 'Night' : 'Day'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#151b23' : '#fafaf7')
  if (map && ready) applyMapTheme(map, dark)
  modelLayer?.setNight(dark)
  if (displayed) showModel()
}
$('theme-toggle').addEventListener('click', () => { dark = !dark; saveSetting('landmarks-theme', dark ? 'dark' : 'light'); updateAppearance() })
updateAppearance()
async function setPreview(url: string) {
  previewController?.abort()
  const controller = new AbortController()
  previewController = controller
  if (previewObjectUrl) { URL.revokeObjectURL(previewObjectUrl); previewObjectUrl = undefined }
  if (!dark) { viewer.exposure = 1.1; viewer.shadowIntensity = 1; viewer.src = url; return }
  viewer.exposure = 1
  viewer.shadowIntensity = 0
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const bytes = nightGlb(new Uint8Array(await response.arrayBuffer()), url)
    if (controller.signal.aborted) return
    previewObjectUrl = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'model/gltf-binary' }))
    viewer.src = previewObjectUrl
  } catch {
    if (controller.signal.aborted) return
    $('model-status').textContent = 'Night lighting could not load. Switch to day mode to retry.'
  }
}
function showModel() {
  if (!displayed) return
  const lod = lodSelect.value === 'detail' && displayed.lods.detail ? displayed.lods.detail : displayed.lods.low
  $('model-status').textContent = 'Loading 3D model…'
  const url = assetUrl(lod.url)
  const download = $<HTMLAnchorElement>('download')
  download.href = url
  download.download = `${displayed.id}-${lodSelect.value}.glb`
  $('model-stats').textContent = `${lod.triangles.toLocaleString()} triangles · ${size(lod.bytes)}${displayed.height ? ` · ${displayed.height.toLocaleString()} m tall` : ''}`
  void inspectFile(displayed, lod)
  viewer.cameraOrbit = '-35deg 70deg auto'
  if (!dark && viewer.src === url && viewer.loaded) { previewController?.abort(); $('model-status').textContent = '' }
  else void setPreview(url)
}
function renderInspector(a: Asset) {
  displayed = a
  renderRows($('placement-details'), assetRows(a))
  const replacements = [a.osm, ...a.additionalOsm].filter((ref): ref is NonNullable<Asset['osm']> => !!ref)
  $('replacement-count').textContent = replacements.length ? `${replacements.length} mapped feature(s) replaced` : 'No replaced OSM features declared.'
  $('replacement-details').replaceChildren(...replacements.map(ref => {
    const li = document.createElement('li')
    li.append(link(`${ref.type}/${ref.id}`, ref.url))
    return li
  }))
  $('place-name').textContent = a.name
  $('model-description').textContent = a.description ?? a.assistance ?? ''
  $('model-location').textContent = `${placeName(a)} · ${a.type ?? 'landmark'} · ${a.anchor.map(n => n.toFixed(5)).join(', ')}`
  $('review-status').textContent = `Review: ${a.reviewStatus ?? 'unreviewed'}`
  $('source-name').replaceChildren(link(sourceName(a), a.collection?.url ?? 'https://github.com/alexwohlbruck/landmarks'))
  $('credit').textContent = a.attribution ?? ''
  const credits: Credit[] = a.credits ?? a.authors.map(name => ({ name, kind: 'organization' as const, role: '' }))
  $('authors').replaceChildren(...credits.map(c => renderCredit(c, assetUrl)))
  const licenseUrl = a.licenseUrl ?? `https://spdx.org/licenses/${encodeURIComponent(a.artisticLicense)}.html`
  $('license').replaceChildren(link(a.artisticLicense, licenseUrl))
  $('license-scope').textContent = a.licenseScope
  $('model-tags').replaceChildren(...(a.tags ?? []).map(tag => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = tag
    button.addEventListener('click', () => { tagSelect.value = tag; renderResults(); fitAll() })
    return button
  }))
  const downloads: HTMLAnchorElement[] = []
  for (const [name, lod] of Object.entries(a.lods)) {
    downloads.push(link(`${name === 'low' ? 'Low LOD' : 'High LOD'} GLB · ${size(lod.bytes)}`, assetUrl(lod.url)))
    downloads.push(link(`${name === 'low' ? 'Low LOD' : 'High LOD'} gzip file · ${size(lod.gzip.bytes)}`, assetUrl(lod.gzip.url)))
  }
  if (a.source) downloads.push(link(`Editable source · ${size(a.source.bytes)}`, assetUrl(a.source.url)))
  if (a.sourcePage) downloads.push(link('Original model source', a.sourcePage))
  downloads.push(link('Full metadata & attribution', assetUrl(a.metadata)))
  for (const osm of [a.osm, ...a.additionalOsm].filter(Boolean)) downloads.push(link(`OSM ${osm!.type}/${osm!.id}`, osm!.url))
  if (a.wikidata) downloads.push(link('Wikidata', `https://www.wikidata.org/wiki/${a.wikidata}`))
  $('downloads').replaceChildren(...downloads)
  $('references').replaceChildren(...(a.references ?? []).map(r => {
    const item = document.createElement('li')
    item.append(link(r.title, r.url), document.createTextNode([r.author, r.license].filter(Boolean).map(s => ` · ${s}`).join('')))
    return item
  }))
  $('references-section').hidden = !a.references?.length
  viewer.alt = `Interactive 3D model of ${a.name}. Drag to rotate and scroll or pinch to zoom.`
  lodSelect.value = a.lods.detail ? 'detail' : 'low'
  lodSelect.hidden = !a.lods.detail
  showModel()
}
async function loadHistory(a: Asset, requested?: string) {
  const request = ++selectionRequest
  versions = []
  $('version-controls').hidden = true
  versionSelect.replaceChildren(new Option('Current version', ''))
  versionSelect.disabled = true
  $('version-note').textContent = a.collection?.id === 'open-landmarks' ? 'Upstream revision; history is maintained by OpenLandmarks.' : 'Loading version history…'
  $<HTMLAnchorElement>('git-history').href = a.collection?.id === 'open-landmarks' ? a.collection.url : `https://github.com/alexwohlbruck/landmarks/commits/main/models/${a.model}.glb`
  if (a.collection?.id === 'open-landmarks') return
  try {
    let data = historyCache.get(a.id)
    if (!data) { data = await getJSON(assetUrl(`api/v1/history/${a.id}.json`)); historyCache.set(a.id, data!) }
    if (request !== selectionRequest) return
    versions = data!.versions.filter(v => v.asset.revision !== a.revision)
    for (const v of versions) versionSelect.add(new Option(`${v.date.slice(0, 10)} · ${v.commit.slice(0, 7)} · ${v.message}`, v.asset.revision))
    versionSelect.disabled = !versions.length
    $('version-controls').hidden = !versions.length
    $('version-note').textContent = [versions.length ? `${versions.length} past version${versions.length === 1 ? '' : 's'}` : '', !data!.complete ? 'Partial Git history' : '', data!.unavailable ? `${data!.unavailable} older snapshots could not be built` : ''].filter(Boolean).join(' · ')
    if (requested) {
      const past = versions.find(v => v.asset.revision === requested)
      if (past) { versionSelect.value = requested; renderInspector(past.asset); showVersionNote(past) }
      else $('version-note').textContent = 'Requested revision is unavailable. Showing the current version.'
    }
  } catch {
    if (request === selectionRequest) $('version-note').textContent = 'Version history unavailable. Current model is still available.'
  }
}
function showVersionNote(past?: AssetHistory['versions'][number]) {
  $('past-version').textContent = past ? `Viewing ${past.date.slice(0, 10)} · ${past.commit.slice(0, 7)}. The map shows the current placement.` : ''
  const commit = $<HTMLAnchorElement>('version-commit')
  commit.hidden = !past
  if (past) commit.href = `https://github.com/alexwohlbruck/landmarks/commit/${past.commit}`
}
function selectAsset(a: Asset, fly = false, revision?: string) {
  selected = a
  showVersionNote()
  renderInspector(a)
  if (!revision) setUrl()
  void loadHistory(a, revision)
  document.querySelectorAll<HTMLButtonElement>('.result').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === a.id)))
  if (map) {
    if (ready) (map.getSource('landmarks') as GeoJSONSource).setData(features())
    modelLayer?.setAssets(mapCollection(), a.id)
    if (fly) modelLayer?.focus(a)
  }
}
versionSelect.addEventListener('change', () => {
  const past = versions.find(v => v.asset.revision === versionSelect.value)
  renderInspector(past?.asset ?? selected!)
  showVersionNote(past)
  setUrl()
})
viewer.addEventListener('load', () => { $('model-status').textContent = '' })
viewer.addEventListener('error', () => {
  const message = document.createElement('span')
  message.textContent = 'Model could not load. '
  const retry = document.createElement('button')
  retry.textContent = 'Retry'
  retry.style.pointerEvents = 'auto'
  retry.addEventListener('click', () => { viewer.removeAttribute('src'); showModel() })
  $('model-status').replaceChildren(message, retry)
})
lodSelect.addEventListener('change', showModel)
search.addEventListener('input', () => { renderResults(); fitAll() })
filterSelects.forEach(select => select.addEventListener('change', () => { renderResults(); fitAll() }))
$('reset-map').addEventListener('click', () => {
  search.value = ''
  filterSelects.forEach(select => { select.value = '' })
  renderResults()
  fitAll()
})
function assetFromUrl() {
  return assets.find(a => a.id === urlSelection().id) ??
    assets.find(a => a.id === 'empire-state-building') ?? assets[0]
}
window.addEventListener('hashchange', () => {
  const asset = assetFromUrl()
  if (!asset) return
  if (!filtered.some(a => a.id === asset.id)) {
    search.value = ''
    filterSelects.forEach(select => { select.value = '' })
    renderResults()
  }
  selectAsset(asset, true, urlSelection().revision)
})
async function getJSON(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Dataset request failed (${response.status})`)
  return response.json()
}
async function init() {
  const local = async () => {
    const pointer = await getJSON(assetUrl('api/v1/latest.json'))
    const catalogue = await getJSON(assetUrl(pointer.catalogue))
    return (await getJSON(assetUrl(catalogue.assets))).assets as Asset[]
  }
  const sources = await Promise.allSettled([local(), getJSON(assetUrl('open-landmarks.json')).then(data => data.assets as Asset[])])
  assets = sources.flatMap(result => result.status === 'fulfilled' ? result.value : []).sort((a, b) => a.name.localeCompare(b.name) || sourceName(a).localeCompare(sourceName(b)))
  if (!assets.length) throw new Error('No collections available')
  $('collection-status').textContent = sources.some(r => r.status === 'rejected') ? 'One collection could not load. Refresh to retry.' : ''
  fillFilters()
  renderResults()
  selectAsset(assetFromUrl(), false, urlSelection().revision)
  const escape = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
  let creditControl = new maplibregl.AttributionControl({ compact: true })
  const updateMapCredits = (visible: Asset[]) => {
    if (!map) return
    const attributions = [...new Set(visible.filter(a => a.artisticLicense !== 'CC0-1.0').map(a => `${a.attribution ?? a.authors.join(', ')} · ${a.artisticLicense}`))].map(escape)
    map.removeControl(creditControl)
    creditControl = new maplibregl.AttributionControl({ compact: true, customAttribution: attributions })
    map.addControl(creditControl)
  }
  try {
    map = new maplibregl.Map({ container: 'map', style: 'https://tiles.openfreemap.org/styles/positron',
      center: selected!.anchor, zoom: 16.5, pitch: 60, bearing: -25, maxZoom: 20, canvasContextAttributes: { antialias: true }, attributionControl: false, renderWorldCopies: false })
    map.addControl(creditControl)
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right')
    map.on('error', event => { console.error(event.error); $('map-status').title = event.error.message; $('map-status').textContent = 'Some map tiles could not load. You can still browse the collection and preview models.' })
    map.on('idle', () => { if (map!.areTilesLoaded()) $('map-status').textContent = '' })
    map.on('load', () => {
      modelLayer = new LandmarkModels(assetUrl, a => selectAsset(a), message => { $('map-status').textContent = message }, updateMapCredits)
      map!.addLayer(modelLayer)
      modelLayer.setAssets(mapCollection(), selected!.id)
      map!.addSource('landmarks', { type: 'geojson', data: features(), cluster: true, clusterMaxZoom: 13, clusterRadius: 48 })
      map!.addLayer({ id: 'clusters-halo', maxzoom: 14, type: 'circle', source: 'landmarks', filter: ['has', 'point_count'], paint: {
        'circle-color': '#98ad7b', 'circle-opacity': 0.24, 'circle-radius': ['step', ['get', 'point_count'], 25, 20, 31, 70, 38],
      } })
      map!.addLayer({ id: 'clusters', maxzoom: 14, type: 'circle', source: 'landmarks', filter: ['has', 'point_count'], paint: {
        'circle-color': '#425b3e', 'circle-stroke-color': '#f7f8ee', 'circle-stroke-width': 2,
        'circle-radius': ['step', ['get', 'point_count'], 18, 20, 24, 70, 31],
      } })
      map!.addLayer({ id: 'cluster-count', maxzoom: 14, type: 'symbol', source: 'landmarks', filter: ['has', 'point_count'], layout: {
        'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Regular'], 'text-size': 12, 'text-allow-overlap': true,
      }, paint: { 'text-color': '#ffffff' } })
      map!.addLayer({ id: 'landmark-points', type: 'circle', source: 'landmarks', filter: ['!', ['has', 'point_count']], paint: {
        'circle-color': '#536f48', 'circle-radius': ['step', ['zoom'], 7, 14, 4], 'circle-stroke-width': 2, 'circle-stroke-color': '#fffef3',
      } })
      map!.on('click', 'clusters', async e => {
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return
        try {
          const zoom = await (map!.getSource('landmarks') as GeoJSONSource).getClusterExpansionZoom(feature.properties.cluster_id)
          map!.easeTo({ center: feature.geometry.coordinates as [number, number], zoom, pitch: zoom >= 14 ? 60 : 0, duration: reducedMotion ? 0 : 650 })
        } catch { $('map-status').textContent = 'The map is updating. Click the circle again to explore.' }
      })
      map!.on('click', 'landmark-points', e => {
        const a = assets.find(a => a.id === e.features?.[0].properties.id)
        if (a) {
          selectAsset(a)
          document.querySelector<HTMLButtonElement>(`.result[data-id="${a.id}"]`)?.scrollIntoView({ block: 'nearest' })
        }
      })
      for (const layer of ['clusters', 'landmark-points']) {
        map!.on('mouseenter', layer, () => { map!.getCanvas().style.cursor = 'pointer' })
        map!.on('mouseleave', layer, () => { map!.getCanvas().style.cursor = '' })
      }
      modelLayer.focus(selected!)
      ready = true
      applyMapTheme(map!, dark)
      modelLayer.setNight(dark)
      $('map-status').textContent = ''
    })
  } catch {
    $('map-status').textContent = 'The map needs WebGL support. You can still search the collection and download models.'
  }
}
init().catch(error => {
  console.error(error)
  $('result-count').textContent = 'Collection unavailable'
  $('map-status').textContent = 'The collection could not load. Please refresh to try again.'
  $('model-status').textContent = 'The collection could not load.'
})
