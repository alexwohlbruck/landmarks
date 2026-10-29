import { expect, test } from 'bun:test'
import { isInView, replacementIds } from '../web/map-models'
import type { Asset } from '../src/release'

const asset = {
  id: 'example', minZoom: 15, bounds: [-74.01, 40.7, -74, 40.71],
  osm: { type: 'way', id: 34633854, url: '' },
  additionalOsm: [{ type: 'relation', id: 123, url: '' }, { type: 'node', id: 456, url: '' }],
} as Asset

test('replacement IDs follow OpenFreeMap Planetiler encoding, including OSM types', () => {
  // Empire State Building: verified against the actual OpenFreeMap building tile.
  expect(replacementIds(asset)).toEqual([346338542, 1233, 4561])
  expect(replacementIds({ ...asset, osm: null, additionalOsm: [] })).toEqual([])
})

test('only load visible models at their zoom, with a selected-model override', () => {
  const view: [number, number, number, number] = [-74.1, 40.6, -73.9, 40.8]
  expect(isInView(asset, view, 15)).toBe(true)
  expect(isInView(asset, view, 14)).toBe(false)
  expect(isInView(asset, view, 14, 'example')).toBe(true)
  expect(isInView(asset, view, 12, 'example')).toBe(false)
  expect(isInView(asset, [-122.5, 37.7, -122.4, 37.8], 18)).toBe(false)
  // A bridge can intersect the view even with its anchor outside it.
  expect(isInView({ ...asset, bounds: [-74.2, 40.65, -74.05, 40.75] }, view, 15)).toBe(true)
})
