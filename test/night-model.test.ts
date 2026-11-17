import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { nightColor, nightGlb } from '../web/night-model'
import { applyMapTheme } from '../web/theme'
import { parseGlb } from '../src/glb'
import { inspectGlb } from '../src/model-info'
import { box, material, writeGlb } from './helpers'
import type { Map as LibreMap } from 'maplibre-gl'

test('night lighting preserves authored window/lamp glows and brightens floodlit surfaces', () => {
  const dark = nightColor([0.5, 0.5, 0.5], 'stone', 0)
  const floodlit = nightColor([0.5, 0.5, 0.5], 'stone', 1)
  expect(floodlit[0]).toBeGreaterThan(dark[0])
  expect(nightColor([0, 0, 0], 'windows', 0)).toEqual([1, 0.72, 0.4])
  expect(nightColor([0, 0, 0], 'lamp-warm', 0)[0]).toBeGreaterThan(0.9)
})
test('night conversion keeps animation, geometry, and embedded textures, without changing original bytes', () => {
  for (const id of ['eiffel-tower', 'wonder-wheel', 'carowinds-skytower']) {
    const bytes = new Uint8Array(readFileSync(join(import.meta.dir, '../models', `${id}.glb`)))
    const copy = bytes.slice()
    const original = parseGlb(bytes)
    const night = nightGlb(bytes)
    const result = parseGlb(night)
    expect(bytes).toEqual(copy)
    expect(result.bin.slice(0, original.bin.length)).toEqual(original.bin.slice())
    expect(result.json.animations).toEqual(original.json.animations)
    expect(result.json.nodes).toEqual(original.json.nodes)
    expect(result.json.images).toEqual(original.json.images)
    expect(inspectGlb(night).triangles).toBe(inspectGlb(bytes).triangles)
    for (const mesh of result.json.meshes) for (const p of mesh.primitives) {
      expect(result.json.materials[p.material].extensions).toHaveProperty('KHR_materials_unlit')
      expect(p.attributes.COLOR_0).toBeNumber()
    }
  }
})
test('per-vertex floodlight masks produce different night colors', () => {
  const bytes = writeGlb('lit', [{ part: box([0, 0, 0], [1, 1, 2]), material: { ...material, floodlight: p => p[2] / 2 } }])
  const { json, bin } = parseGlb(nightGlb(bytes))
  const p = json.meshes[0].primitives[0]
  const accessor = json.accessors[p.attributes.COLOR_0]
  const view = json.bufferViews[accessor.bufferView]
  const colors = new Float32Array(bin.slice(view.byteOffset, view.byteOffset + view.byteLength).buffer)
  expect(Math.max(...colors.filter((_, i) => i % 4 === 0))).toBeGreaterThan(Math.min(...colors.filter((_, i) => i % 4 === 0)) + 0.1)
})
test('map theme changes colors in place and restores original style expressions exactly', () => {
  const paints: unknown[][] = []
  const layers = [{ id: 'land', paint: { 'fill-color': '#f0f0f0' } }, { id: 'labels', paint: { 'text-color': ['match', ['get', 'class'], 'city', '#333333', '#777777'] } }]
  const map = { getStyle: () => ({ layers }), getLayer: () => true, setPaintProperty: (...args: unknown[]) => paints.push(args) } as unknown as LibreMap
  applyMapTheme(map, true)
  expect(paints[0][2]).not.toBe('#f0f0f0')
  applyMapTheme(map, false)
  expect(paints[2][2]).toBe('#f0f0f0')
  expect(paints[3][2]).toEqual(layers[1].paint['text-color'])
})
