import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { classifyRings, VectorTile } from '@mapbox/vector-tile'
import { PbfReader } from 'pbf'
import clipping, { type MultiPolygon, type Polygon } from 'polygon-clipping'
import { geometryArea, replaceBuildingTile, subtractFootprints, tilePoint } from '../web/building-geometry'
import fixtures from './fixtures/building-replacements.json'
import footprintData from '../web/replacement-footprints.json'

const square = (x: number, y: number, size: number): Polygon => [[[x,y],[x+size,y],[x+size,y+size],[x,y+size],[x,y]]]
const polygons = (bytes: Uint8Array) => {
  const layer = new VectorTile(new PbfReader(bytes)).layers.building
  expect(layer).toBeDefined()
  const result: MultiPolygon = []
  for (let i = 0; i < layer.length; i++) {
    const f = layer.feature(i)
    expect(f.properties.render_height).toBeDefined()
    result.push(...classifyRings(f.loadGeometry()).map(p => p.map(r => r.map(p => [p.x, p.y] as [number, number]))))
  }
  return { layer, result }
}

test('remove one building without deleting its disconnected merged neighbors', () => {
  const target = square(0, 0, 10), neighbor = square(20, 0, 10)
  expect(subtractFootprints(target, [[target]])).toEqual([])
  expect(subtractFootprints(neighbor, [[target]])).toEqual([neighbor])
})

test('clip a connected polygon and preserve buildings inside courtyard holes', () => {
  expect(geometryArea(subtractFootprints(square(0, 0, 20), [[square(0, 0, 10)]]))).toBe(300)
  const courtyard: Polygon = [...square(0, 0, 20), ...square(5, 5, 10)]
  expect(subtractFootprints(square(7, 7, 3), [[courtyard]])).toEqual([square(7, 7, 3)])
})

test('remove quantization slivers around a substantially matching footprint', () => {
  expect(subtractFootprints(square(0, 0, 10), [[square(0.1, 0.1, 10)]])).toEqual([])
})

for (const fixture of fixtures) {
  test(`real OpenFreeMap regression: ${fixture.id}`, () => {
    const input = new Uint8Array(readFileSync(join(import.meta.dir, 'fixtures', `${fixture.id}.pbf`)))
    const geometry = (footprintData.assets as unknown as Record<string, MultiPolygon>)[fixture.id]
    const before = polygons(input)
    expect(fixture.featureIds.some(id => id % 10 === 0)).toBe(true)
    const output = replaceBuildingTile(input, fixture.tile, [{ geometry, ids: [] }])
    const after = polygons(output)
    const mask = geometry.map(p => p.map(r => r.map(point => tilePoint(point, fixture.tile, before.layer.extent))))
    const remainingOverlap = geometryArea(clipping.intersection(after.result, mask))
    expect(remainingOverlap).toBeLessThan(fixture.overlapBefore * 0.001)
    // Every completely unrelated component must survive, even when its ID is
    // the same as one of the removed components. This catches whole-ID deletion.
    const neighbors = before.result.filter(p => geometryArea(clipping.intersection([p], mask)) === 0)
    expect(neighbors.length).toBeGreaterThan(0)
    expect(geometryArea(clipping.difference(clipping.union(neighbors), after.result))).toBeLessThan(0.001)
    // No loaded models means no holes in the original building layer.
    const unchanged = polygons(replaceBuildingTile(input, fixture.tile, []))
    expect(geometryArea(unchanged.result)).toBeCloseTo(geometryArea(before.result), 3)
  })
}
