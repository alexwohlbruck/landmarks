import * as maplibregl from 'maplibre-gl'
import type { GeoJSONSource } from 'maplibre-gl'
import '@google/model-viewer'
import type { ModelViewerElement } from '@google/model-viewer'
import type { Asset } from '../src/release'
import { LandmarkModels } from './map-models'

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T
const viewer = $<ModelViewerElement>('viewer')
const search = $<HTMLInputElement>('search')
const regionSelect = $<HTMLSelectElement>('region')
const lodSelect = $<HTMLSelectElement>('lod')
const base = new URL('./', window.location.href)
// Release paths are rooted at the dataset, which may be hosted in a subdirectory.
const assetUrl = (path: string) => new URL(path.replace(/^\//, ''), base).href
maplibregl.setWorkerUrl(assetUrl('maplibre-gl-worker.mjs'))
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const regions: [string, number, number][] = [
  ['Paris', 2.29, 48.86], ['New York', -73.97, 40.75], ['Chicago', -87.63, 41.88],
  ['Charlotte & Carowinds', -80.85, 35.23], ['Washington, DC', -77.04, 38.9],
  ['Los Angeles & Disneyland', -118.24, 34.05], ['San Francisco Bay Area', -122.42, 37.77],
  ['Las Vegas', -115.17, 36.11], ['Seattle', -122.33, 47.61], ['Walt Disney World', -81.58, 28.42],
]
function regionFor(asset: Asset) {
  const [lng, lat] = asset.anchor
  return [...regions].sort((a, b) =>
    ((a[1] - lng) * Math.cos(lat * Math.PI / 180)) ** 2 + (a[2] - lat) ** 2 -
    (((b[1] - lng) * Math.cos(lat * Math.PI / 180)) ** 2 + (b[2] - lat) ** 2))[0][0]
}
let assets: Asset[] = []
let filtered: Asset[] = []
let selected: Asset | undefined
let ready = false
let map: maplibregl.Map | undefined
let modelLayer: LandmarkModels | undefined
const regionById = new Map<string, string>()

function features() {
  return { type: 'FeatureCollection' as const, features: filtered.map(a => ({
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
  const term = search.value.trim().toLocaleLowerCase()
  filtered = assets.filter(a => (!regionSelect.value || regionById.get(a.id) === regionSelect.value) &&
    `${a.name} ${a.id} ${regionById.get(a.id)}`.toLocaleLowerCase().includes(term))
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
    region.textContent = regionById.get(a.id)!
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
    modelLayer?.setAssets(filtered, selected?.id)
  }
}
function showModel() {
  if (!selected) return
  const lod = lodSelect.value === 'detail' ? selected.lods.detail! : selected.lods.low
  $('model-status').textContent = 'Loading 3D model…'
  const url = assetUrl(lod.url)
  const download = $<HTMLAnchorElement>('download')
  download.href = url
  download.download = `${selected.id}-${lodSelect.value}.glb`
  // Reset the orbit when switching models; model-viewer frames each model automatically.
  viewer.cameraOrbit = '-35deg 70deg auto'
  if (viewer.src === url && viewer.loaded) $('model-status').textContent = ''
  else viewer.src = url
}
function selectAsset(a: Asset, fly = false) {
  selected = a
  history.replaceState(null, '', `#${encodeURIComponent(a.id)}`)
  $('place-name').textContent = a.name
  $('credit').textContent = a.attribution ?? (a.artisticLicense === 'CC0-1.0' ? '' : `${a.authors.join(', ')} · ${a.artisticLicense}`)
  viewer.alt = `Interactive 3D model of ${a.name}. Drag to rotate and scroll or pinch to zoom.`
  lodSelect.value = 'low'
  lodSelect.hidden = !a.lods.detail
  showModel()
  document.querySelectorAll<HTMLButtonElement>('.result').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === a.id)))
  if (map) {
    modelLayer?.setAssets(filtered, a.id)
    if (fly) modelLayer?.focus(a)
  }
}
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
regionSelect.addEventListener('change', () => { renderResults(); fitAll() })
$('reset-map').addEventListener('click', () => {
  search.value = ''
  regionSelect.value = ''
  renderResults()
  fitAll()
})
window.addEventListener('hashchange', () => {
  const a = assets.find(a => a.id === location.hash.slice(1))
  if (a) selectAsset(a, true)
})
async function getJSON(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Dataset request failed (${response.status})`)
  return response.json()
}
async function init() {
  const pointer = await getJSON(assetUrl('api/v1/latest.json'))
  const catalogue = await getJSON(assetUrl(pointer.catalogue))
  const data = await getJSON(assetUrl(catalogue.assets))
  assets = (data.assets as Asset[]).sort((a, b) => a.name.localeCompare(b.name))
  assets.forEach(a => regionById.set(a.id, regionFor(a)))
  for (const region of [...new Set(regionById.values())].sort()) {
    const option = document.createElement('option')
    option.value = region
    option.textContent = `${region} (${assets.filter(a => regionById.get(a.id) === region).length})`
    regionSelect.append(option)
  }
  renderResults()
  selectAsset(assets.find(a => a.id === location.hash.slice(1)) ?? assets.find(a => a.id === 'empire-state-building') ?? assets[0])
  try {
    map = new maplibregl.Map({ container: 'map', style: 'https://tiles.openfreemap.org/styles/positron',
      center: selected!.anchor, zoom: 16.5, pitch: 60, bearing: -25, maxZoom: 20, canvasContextAttributes: { antialias: true }, attributionControl: { compact: true }, renderWorldCopies: false })
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right')
    map.on('error', event => { console.error(event.error); $('map-status').title = event.error.message; $('map-status').textContent = 'Some map tiles could not load. You can still browse the collection and preview models.' })
    map.on('idle', () => { if (map!.areTilesLoaded()) $('map-status').textContent = '' })
    map.on('load', () => {
      modelLayer = new LandmarkModels(assetUrl, a => selectAsset(a), message => { $('map-status').textContent = message })
      map!.addLayer(modelLayer)
      modelLayer.setAssets(filtered, selected!.id)
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
