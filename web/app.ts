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
import { hydrateIcons, icon, typeIcon } from './icons'

hydrateIcons()

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T
const viewer = $<ModelViewerElement>('viewer')
const search = $<HTMLInputElement>('search')
const placeSelect = $<HTMLSelectElement>('place')
const typeSelect = $<HTMLSelectElement>('type')
const tagSelect = $<HTMLSelectElement>('tag')
const sourceSelect = $<HTMLSelectElement>('source-filter')
const versionSelect = $<HTMLSelectElement>('version')
const filterSelects = [placeSelect, typeSelect, tagSelect, sourceSelect]
const lodButtons = [...document.querySelectorAll<HTMLButtonElement>('#lod-control button')]
let lod: 'low' | 'detail' = 'detail'
const mobile = matchMedia('(max-width: 820px)')
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
const badge = (text: string, variant = '', glyph?: SVGElement) => {
  const span = document.createElement('span')
  span.className = `badge ${variant}`.trim()
  if (glyph) span.append(glyph)
  span.append(text)
  return span
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
  updateChips()
}
/** Chips read "Place" until chosen, then show the choice with a clear button. */
function updateChips() {
  for (const select of filterSelects) {
    const chip = select.closest<HTMLElement>('.chip')!
    const active = !!select.value
    chip.classList.toggle('active', active)
    const label = chip.querySelector<HTMLElement>('.chip-label')!
    label.dataset.name ??= label.textContent!
    label.textContent = active ? select.selectedOptions[0].text : label.dataset.name
    chip.querySelector('.chip-clear')?.remove()
    chip.querySelector('.icon')!.toggleAttribute('hidden', active)
    if (active) {
      const clear = document.createElement('button')
      clear.type = 'button'
      clear.className = 'chip-clear'
      clear.setAttribute('aria-label', `Clear ${select.getAttribute('aria-label')!.replace(/^Filter by /, '')} filter`)
      clear.append(icon('x'))
      clear.addEventListener('click', event => { event.preventDefault(); select.value = ''; applyFilters() })
      chip.append(clear)
    }
  }
}
function applyFilters() {
  if (mobile.matches && browse.dataset.snap !== 'full') setSnap(browse, 'half')
  updateChips()
  $('clear-search').hidden = !search.value
  search.closest('.search-field')!.classList.toggle('has-value', !!search.value)
  renderResults()
  fitAll()
}
function clearFilters() {
  search.value = ''
  filterSelects.forEach(select => { select.value = '' })
  applyFilters()
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
  const filteredOut = filtered.length !== assets.length
  $('result-count').textContent = `${filtered.length.toLocaleString()} ${filteredOut ? `of ${assets.length.toLocaleString()} ` : ''}landmark${assets.length === 1 ? '' : 's'}`
  const fragment = document.createDocumentFragment()
  filtered.forEach(a => {
    const button = document.createElement('button')
    button.className = 'result'
    button.type = 'button'
    button.dataset.id = a.id
    button.setAttribute('aria-pressed', String(selected?.id === a.id))
    const glyph = document.createElement('span')
    glyph.className = 'result-icon'
    glyph.append(typeIcon(a.type))
    const text = document.createElement('span')
    text.className = 'result-text'
    const title = document.createElement('span')
    title.className = 'result-name'
    title.textContent = a.name
    const region = document.createElement('span')
    region.className = 'result-meta'
    region.textContent = `${placeName(a)} · ${sourceName(a)}`
    text.append(title, region)
    button.append(glyph, text)
    if (a.reviewStatus === 'draft') button.append(badge('Draft', 'warning result-tag'))
    button.addEventListener('click', () => selectAsset(a, true))
    fragment.append(button)
  })
  if (!filtered.length) {
    const empty = document.createElement('div')
    empty.className = 'empty'
    const text = document.createElement('p')
    text.textContent = 'No landmarks match these filters.'
    const reset = document.createElement('button')
    reset.type = 'button'
    reset.className = 'button outline'
    reset.textContent = 'Clear filters'
    reset.addEventListener('click', clearFilters)
    empty.append(text, reset)
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
  $('theme-toggle').title = dark ? 'Night: switch to day mode' : 'Day: switch to night mode'
  $('theme-label').textContent = dark ? 'Night' : 'Day'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#110f0c' : '#f9f8f6')
  if (ready) styleMarkers()
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
  const current = lod === 'detail' && displayed.lods.detail ? displayed.lods.detail : displayed.lods.low
  const level = current === displayed.lods.detail ? 'detail' : 'low'
  lodButtons.forEach(b => b.setAttribute('aria-checked', String(b.dataset.lod === level)))
  $('model-status').textContent = 'Loading 3D model…'
  const url = assetUrl(current.url)
  const download = $<HTMLAnchorElement>('download')
  download.href = url
  download.download = `${displayed.id}-${level}.glb`
  download.querySelector('span')!.textContent = `Download GLB · ${size(current.bytes)}`
  download.title = `${level === 'detail' ? 'High' : 'Low'} LOD GLB`
  const stats: [string, string][] = [['Triangles', current.triangles.toLocaleString()], ['File size', size(current.bytes)]]
  stats.push(['Height', displayed.height ? `${displayed.height.toLocaleString(undefined, { maximumFractionDigits: 1 })} m` : '—'])
  $('model-stats').replaceChildren(...stats.map(([label, text]) => {
    const tile = document.createElement('div')
    const dt = document.createElement('dt')
    dt.textContent = label
    const dd = document.createElement('dd')
    dd.textContent = text
    tile.append(dt, dd)
    return tile
  }))
  void inspectFile(displayed, current)
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
  $('model-location').replaceChildren(icon('map-pin'), `${placeName(a)} · ${a.anchor.map(n => n.toFixed(5)).join(', ')}`)
  const review = a.reviewStatus ?? 'unreviewed'
  $('review-status').textContent = review.replace(/^./, c => c.toUpperCase())
  $('badges').replaceChildren(
    badge(a.type ?? 'landmark', 'primary', typeIcon(a.type)),
    badge(sourceName(a)),
    badge(review.replace(/^./, c => c.toUpperCase()), review === 'approved' ? 'success' : review === 'draft' ? 'warning' : ''),
  )
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
    button.title = `Show all landmarks tagged ${tag}`
    button.addEventListener('click', () => { tagSelect.value = tag; applyFilters() })
    return button
  }))
  const downloads: HTMLAnchorElement[] = []
  for (const [name, file] of Object.entries(a.lods)) {
    downloads.push(link(`${name === 'low' ? 'Low LOD' : 'High LOD'} GLB · ${size(file.bytes)}`, assetUrl(file.url)))
    downloads.push(link(`${name === 'low' ? 'Low LOD' : 'High LOD'} gzip file · ${size(file.gzip.bytes)}`, assetUrl(file.gzip.url)))
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
  lod = a.lods.detail ? 'detail' : 'low'
  $('lod-control').hidden = !a.lods.detail
  showModel()
}
async function loadHistory(a: Asset, requested?: string) {
  const request = ++selectionRequest
  versions = []
  $('version-controls').hidden = true
  versionSelect.replaceChildren(new Option('Current version', ''))
  versionSelect.disabled = true
  $('version-note').textContent = a.collection?.id === 'open-landmarks' ? 'Upstream revision; history is maintained by OpenLandmarks.' : 'Loading version history…'
  $<HTMLAnchorElement>('git-history').firstChild!.textContent = a.collection?.id === 'open-landmarks' ? 'View upstream collection ' : 'View source history '
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
  $('past-version').hidden = !past
  $('past-version-text').textContent = past ? `Viewing ${past.date.slice(0, 10)} · ${past.commit.slice(0, 7)}. The map shows the current placement.` : ''
  const commit = $<HTMLAnchorElement>('version-commit')
  commit.hidden = !past
  if (past) commit.href = `https://github.com/alexwohlbruck/landmarks/commit/${past.commit}`
}
function selectAsset(a: Asset, fly = false, revision?: string) {
  selected = a
  setInspectorOpen(true)
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
  retry.className = 'button outline'
  retry.addEventListener('click', () => { viewer.removeAttribute('src'); showModel() })
  $('model-status').replaceChildren(message, retry)
})
lodButtons.forEach(button => button.addEventListener('click', () => { lod = button.dataset.lod as typeof lod; showModel() }))
search.addEventListener('input', applyFilters)
filterSelects.forEach(select => select.addEventListener('change', applyFilters))
$('reset-map').addEventListener('click', clearFilters)
$('clear-search').addEventListener('click', () => { search.value = ''; applyFilters(); search.focus() })
document.addEventListener('keydown', event => {
  const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement
  if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) { event.preventDefault(); search.focus() }
  else if (event.key === 'Escape' && event.target === search && search.value) { search.value = ''; applyFilters() }
})
$('current-version').addEventListener('click', () => { versionSelect.value = ''; versionSelect.dispatchEvent(new Event('change')) })
$('copy-link').addEventListener('click', async () => {
  const label = $('copy-link').querySelector('span')!
  try { await navigator.clipboard.writeText(location.href); label.textContent = 'Copied' }
  catch { label.textContent = 'Copy the address bar' }
  setTimeout(() => { label.textContent = 'Copy link' }, 1600)
})
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')]
function showTab(tab: HTMLButtonElement) {
  for (const t of tabs) {
    const active = t === tab
    t.setAttribute('aria-selected', String(active))
    t.tabIndex = active ? 0 : -1
    $(t.getAttribute('aria-controls')!).hidden = !active
  }
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => showTab(tab))
  tab.addEventListener('keydown', event => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const next = tabs[(i + step + tabs.length) % tabs.length]
    showTab(next)
    next.focus()
  })
})
/** Keep the map's centre in the space the floating panels leave uncovered. */
function updateMapPadding() {
  if (!map) return
  if (mobile.matches) { map.setPadding({ top: 56, bottom: Math.min(sheetVisible(), innerHeight * 0.6), left: 0, right: 0 }); return }
  const gutter = 12
  const browse = document.querySelector<HTMLElement>('.browse')!.offsetWidth
  const inspector = document.body.classList.contains('inspector-closed') ? 0 : $('inspector').offsetWidth
  map.setPadding({ top: 0, bottom: 0, left: browse + gutter, right: inspector ? inspector + gutter : 0 })
}
function setInspectorOpen(open: boolean) {
  if (mobile.matches) { if (open) showSheet(inspector, inspector.dataset.snap === 'full' ? 'full' : 'half'); return }
  if (document.body.classList.contains('inspector-closed') !== open) return
  document.body.classList.toggle('inspector-closed', !open)
  $('open-inspector').hidden = open
  updateMapPadding()
}
$('close-inspector').addEventListener('click', () => { setInspectorOpen(false); $('open-inspector').focus() })
$('open-inspector').addEventListener('click', () => setInspectorOpen(true))
window.addEventListener('resize', updateMapPadding)

/* Phone layout: one bottom sheet at a time, dragged between peek, half and full. */
type Snap = 'peek' | 'half' | 'full' | 'hidden'
const browse = document.querySelector<HTMLElement>('.browse')!
const inspector = $('inspector')
const brandBar = document.querySelector<HTMLElement>('.brand-bar')!
/** How much of the map the open sheet covers once it settles. */
const sheetVisible = () => {
  const sheet = [browse, inspector].find(s => s.dataset.snap && s.dataset.snap !== 'hidden')
  if (!sheet) return 0
  const offsets = sheetOffsets(sheet)
  return sheet.offsetHeight - offsets[sheet.dataset.snap as keyof typeof offsets]
}
const safeArea = document.createElement('div')
safeArea.style.cssText = 'position:fixed;width:0;height:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none'
document.body.append(safeArea)
/** Peeking shows the search and filters, or the selected landmark's name. */
const peekHeight = (sheet: HTMLElement) => {
  const last = sheet.querySelector<HTMLElement>(sheet === browse ? '.results-bar' : '.inspector-head')!
  return last.offsetTop + last.offsetHeight + safeArea.offsetHeight
}
const sheetOffsets = (sheet: HTMLElement): Record<Exclude<Snap, 'hidden'>, number> => {
  const height = sheet.offsetHeight
  return { full: 0, half: Math.max(0, height - innerHeight * 0.52), peek: height - peekHeight(sheet) }
}
function setSnap(sheet: HTMLElement, snap: Snap) {
  sheet.style.setProperty('--peek', `${peekHeight(sheet)}px`)
  sheet.dataset.snap = snap
  if (snap !== 'full') sheet.scrollTop = 0
  document.body.style.setProperty('--sheet-visible', `${Math.min(sheetVisible(), innerHeight * 0.6)}px`)
  updateMapPadding()
}
function showSheet(sheet: HTMLElement, snap: Snap) {
  const other = sheet === browse ? inspector : browse
  other.dataset.snap = 'hidden'
  setSnap(sheet, snap)
}
function layout() {
  if (mobile.matches) {
    document.body.classList.remove('inspector-closed')
    $('open-inspector').hidden = true
    document.body.prepend(brandBar)
    if (!browse.dataset.snap) browse.dataset.snap = 'peek'
    if (!inspector.dataset.snap) inspector.dataset.snap = 'hidden'
  } else {
    browse.prepend(brandBar)
    delete browse.dataset.snap
    delete inspector.dataset.snap
  }
  document.body.style.setProperty('--sheet-visible', `${mobile.matches ? Math.min(sheetVisible(), innerHeight * 0.6) : 0}px`)
  updateMapPadding()
}
mobile.addEventListener('change', layout)
$('sheet-close').addEventListener('click', () => showSheet(browse, 'peek'))
search.addEventListener('focus', () => { if (mobile.matches) showSheet(browse, 'full') })
/** Drag a sheet by its grip or header, or anywhere while it isn't fully open. */
function draggable(sheet: HTMLElement, handles: string) {
  let drag: { id: number; y: number; base: number; at: number; last: number; lastAt: number; moved: boolean } | undefined
  sheet.addEventListener('pointerdown', event => {
    if (!mobile.matches || event.button) return
    const target = event.target as Element
    const handle = target.closest(handles)
    if (sheet.dataset.snap === 'full' && !handle) return
    if (!handle && target.closest('model-viewer, input, select, textarea, .segmented')) return
    if (event.pointerType === 'mouse') event.preventDefault()
    const base = new DOMMatrix(getComputedStyle(sheet).transform).m42
    drag = { id: event.pointerId, y: event.clientY, base, at: event.timeStamp, last: event.clientY, lastAt: event.timeStamp, moved: false }
  })
  // Follow the pointer on the window: a mouse isn't captured until the drag starts.
  window.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return
    const dy = event.clientY - drag.y
    if (!drag.moved) {
      if (Math.abs(dy) < 6) return
      drag.moved = true
      try { sheet.setPointerCapture(event.pointerId) } catch {}
      sheet.classList.add('dragging')
    }
    const { peek } = sheetOffsets(sheet)
    const y = Math.min(peek + 40, Math.max(0, drag.base + dy))
    sheet.style.transform = `translateY(${y}px)`
    drag.at = drag.lastAt; drag.lastAt = event.timeStamp; drag.last = event.clientY
  })
  const end = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return
    const { moved, base, y } = drag
    const velocity = (event.clientY - drag.last) / Math.max(1, event.timeStamp - drag.at)
    drag = undefined
    sheet.classList.remove('dragging')
    if (!moved) {
      // A tap on the grip or header steps the sheet up.
      if (!sheet.contains(event.target as Node)) return
      if ((event.target as Element).closest(handles) && !(event.target as Element).closest('button, a') && sheet.dataset.snap !== 'full')
        setSnap(sheet, sheet.dataset.snap === 'peek' ? 'half' : 'full')
      return
    }
    // A finished drag isn't a click on whatever is under the finger.
    const swallow = (e: Event) => { e.stopPropagation(); e.preventDefault() }
    sheet.addEventListener('click', swallow, { capture: true, once: true })
    setTimeout(() => sheet.removeEventListener('click', swallow, { capture: true }))
    const offsets = sheetOffsets(sheet)
    const projected = base + (event.clientY - y) + velocity * 180
    const snap = (Object.keys(offsets) as (keyof typeof offsets)[])
      .reduce((best, key) => Math.abs(offsets[key] - projected) < Math.abs(offsets[best] - projected) ? key : best, 'half')
    sheet.style.transform = ''
    setSnap(sheet, snap)
  }
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
}
draggable(browse, '.sheet-grip, .results-bar, .brand-bar')
draggable(inspector, '.sheet-grip, .inspector-head')
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
    updateChips()
    renderResults()
  }
  selectAsset(asset, true, urlSelection().revision)
})
/** Markers use the interface's primary colour: brown-gold by day, brighter gold at night. */
function styleMarkers() {
  const [fill, ink, line] = dark ? ['#c69853', '#1a140c', '#110f0c'] : ['#896734', '#fdfaf4', '#fdfcfa']
  map!.setPaintProperty('clusters-halo', 'circle-color', fill)
  map!.setPaintProperty('clusters', 'circle-color', fill)
  map!.setPaintProperty('clusters', 'circle-stroke-color', line)
  map!.setPaintProperty('cluster-count', 'text-color', ink)
  map!.setPaintProperty('landmark-points', 'circle-color', fill)
  map!.setPaintProperty('landmark-points', 'circle-stroke-color', line)
}
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
  const linked = !!location.hash
  layout()
  selectAsset(assetFromUrl(), false, urlSelection().revision)
  if (mobile.matches && !linked) showSheet(browse, 'peek')
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
    updateMapPadding()
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right')
    map.on('error', event => { console.error(event.error); $('map-status').title = event.error.message; $('map-status').textContent = 'Some map tiles could not load. You can still browse the collection and preview models.' })
    map.on('idle', () => { if (map!.areTilesLoaded()) $('map-status').textContent = '' })
    map.on('load', () => {
      // Mapterhorn: open terrarium tiles from USGS 3DEP lidar in the US, the DEM
      // Parchment draws and the models are built on. Life-size, like Parchment.
      map!.addSource('terrain-dem', { type: 'raster-dem', encoding: 'terrarium', tileSize: 512, maxzoom: 15,
        tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],
        attribution: '<a href="https://mapterhorn.com/attribution" target="_blank">© Mapterhorn</a>' })
      map!.setTerrain({ source: 'terrain-dem', exaggeration: 1 })
      modelLayer = new LandmarkModels(assetUrl, a => selectAsset(a), message => { $('map-status').textContent = message }, updateMapCredits)
      map!.addLayer(modelLayer)
      modelLayer.setAssets(mapCollection(), selected!.id)
      map!.addSource('landmarks', { type: 'geojson', data: features(), cluster: true, clusterMaxZoom: 13, clusterRadius: 48 })
      map!.addLayer({ id: 'clusters-halo', maxzoom: 14, type: 'circle', source: 'landmarks', filter: ['has', 'point_count'], paint: {
        'circle-opacity': 0.22, 'circle-radius': ['step', ['get', 'point_count'], 25, 20, 31, 70, 38],
      } })
      map!.addLayer({ id: 'clusters', maxzoom: 14, type: 'circle', source: 'landmarks', filter: ['has', 'point_count'], paint: {
        'circle-stroke-width': 2, 'circle-radius': ['step', ['get', 'point_count'], 18, 20, 24, 70, 31],
      } })
      map!.addLayer({ id: 'cluster-count', maxzoom: 14, type: 'symbol', source: 'landmarks', filter: ['has', 'point_count'], layout: {
        'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Regular'], 'text-size': 12, 'text-allow-overlap': true,
      } })
      map!.addLayer({ id: 'landmark-points', type: 'circle', source: 'landmarks', filter: ['!', ['has', 'point_count']], paint: {
        'circle-radius': ['step', ['zoom'], 7, 14, 4], 'circle-stroke-width': 2,
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
      styleMarkers()
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
