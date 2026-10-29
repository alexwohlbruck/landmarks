import { expect, test } from 'bun:test'
import { inspectGlb } from '../src/model-info'
import { writeGlb } from '../src/glb'
import { assetRows, geometryRows } from '../web/model-details'
import type { Asset } from '../src/release'

const model = (extra: object = {}) => writeGlb({ json: {
  asset: { version: '2.0', generator: 'Test exporter' },
  nodes: [{ name: 'Wheel', mesh: 0 }, { mesh: 0 }],
  meshes: [{ primitives: [{ indices: 1, attributes: { POSITION: 0 } }] }],
  accessors: [{ count: 4 }, { count: 6 }, { count: 3, componentType: 5126, type: 'SCALAR', bufferView: 0 }],
  bufferViews: [{ byteOffset: 0, byteLength: 12 }],
  ...extra,
}, bin: new Uint8Array(new Float32Array([0, 2, 5]).buffer) })

test('reports static triangle faces and shared-mesh vertex instances without inventing animation or textures', () => {
  expect(inspectGlb(model())).toMatchObject({ triangles: 4, vertices: 8, meshes: 1, meshInstances: 2, nodes: 2, primitives: 1, animations: [], textures: 0, images: [], generator: 'Test exporter' })
})
test('measures animation timestamps and reports image sources, materials, and extensions', () => {
  const info = inspectGlb(model({
    animations: [{ name: 'Spin', samplers: [{ input: 2, output: 0 }], channels: [{ sampler: 0, target: { node: 0, path: 'rotation' } }] }],
    textures: [{ source: 0 }, { source: 1 }],
    images: [{ name: 'Embedded', mimeType: 'image/png', bufferView: 0 }, { uri: 'texture.jpg' }],
    materials: [{ name: 'Metal' }], extensionsUsed: ['KHR_materials_unlit'],
  }))
  expect(info.animations).toEqual([{ name: 'Spin', durationSeconds: 5, channels: 1, keyframes: 3, targets: ['Wheel · rotation'] }])
  expect(info.textures).toBe(2)
  expect(info.images[0]).toMatchObject({ embedded: true, bytes: 12, mimeType: 'image/png' })
  expect(info.images[1]).toMatchObject({ embedded: false, uri: 'texture.jpg', bytes: null })
  expect(info.materials).toEqual(['Metal'])
  expect(info.extensionsUsed).toEqual(['KHR_materials_unlit'])
})
test('counts triangle strips and fans as faces rather than assuming every primitive is a triangle list', () => {
  expect(inspectGlb(model({ meshes: [{ primitives: [{ mode: 5, attributes: { POSITION: 0 } }, { mode: 6, attributes: { POSITION: 0 } }] }] }))).toMatchObject({ triangles: 8, vertices: 8 })
})
test('detail rows use the selected file size, face count, animation, and texture data', () => {
  const lod = { bytes: 12345, sha256: 'original-sha', triangles: 99, gzip: { bytes: 2345, sha256: 'gzip-sha', encoding: 'gzip-file' } } as Asset['lods']['low']
  const rows = Object.fromEntries(geometryRows(lod, inspectGlb(model())))
  expect(rows['GLB file size']).toContain('12,345 bytes')
  expect(rows['Triangle faces']).toBe('4')
  expect(rows.Animated).toBe('No')
  expect(rows.Textures).toBe('None (0)')
  expect(rows['GLB SHA-256']).toBe('original-sha')
  const rowsWithoutInspection = Object.fromEntries(geometryRows(lod))
  expect(rowsWithoutInspection.Animated).toBe('Inspecting…')
  expect(rowsWithoutInspection['Triangle faces']).toBe('99')
})
test('placement metadata preserves historical placement and full coordinate precision', () => {
  const a = { id: 'tower', model: 'old-tower', name: 'Original Tower', anchor: [2.123456789, 48], bounds: [2, 47, 3, 49], placement: { bearing: 30, scale: 0.5 }, elevation: -3, minZoom: 14, heading: 0, revision: 'past-revision', lods: {}, entranceLights: [], units: 'metres', axes: 'X east / Y up / Z south' } as unknown as Asset
  const rows = Object.fromEntries(assetRows(a))
  expect(rows['Model ID']).toBe('old-tower')
  expect(rows.Longitude).toBe('2.123456789')
  expect(rows['Authored bearing (baked)']).toBe('30°')
  expect(rows['Elevation offset']).toBe('-3 m')
  expect(rows.Revision).toBe('past-revision')
})
