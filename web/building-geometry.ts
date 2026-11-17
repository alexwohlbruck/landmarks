import { classifyRings, VectorTile } from '@mapbox/vector-tile'
import { fromVectorTileJs, GeoJSONWrapper, type Feature } from '@maplibre/vt-pbf'
import { PbfReader } from 'pbf'
import clipping, { type MultiPolygon, type Polygon, type Pair } from 'polygon-clipping'

export type Footprint = { geometry: MultiPolygon; ids: number[] }
export type TileCoordinate = { z: number; x: number; y: number }
type Bounds = [number, number, number, number]

export function tilePoint([lng, lat]: Pair, tile: TileCoordinate, extent: number): Pair {
  const n = 2 ** tile.z
  return [((lng + 180) / 360 * n - tile.x) * extent,
    ((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * n - tile.y) * extent]
}
const ringArea = (ring: Pair[]) => ring.reduce((sum, p, i) => {
  const q = ring[(i + 1) % ring.length]
  return sum + p[0] * q[1] - q[0] * p[1]
}, 0) / 2
export const geometryArea = (geometry: MultiPolygon) => geometry.reduce((sum, polygon) =>
  sum + Math.abs(ringArea(polygon[0])) - polygon.slice(1).reduce((n, ring) => n + Math.abs(ringArea(ring)), 0), 0)
function bounds(geometry: MultiPolygon): Bounds {
  const b: Bounds = [Infinity, Infinity, -Infinity, -Infinity]
  for (const p of geometry.flat(2)) {
    b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1])
    b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1])
  }
  return b
}
const overlaps = (a: Bounds, b: Bounds) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]

/** Operate on each polygon, not its merged feature ID. Never remove a merged
 * feature wholesale: its other components can be buildings blocks away. */
export function subtractFootprints(polygon: Polygon, masks: MultiPolygon[]): MultiPolygon {
  const box = bounds([polygon])
  const nearby = masks.filter(mask => overlaps(box, bounds(mask)))
  if (!nearby.length) return [polygon]
  const area = geometryArea([polygon])
  const covered = clipping.intersection([polygon], clipping.union(nearby[0], ...nearby.slice(1)))
  // Tile vertices are quantized/simplified. A matching footprint can differ by
  // a fraction of a tile pixel; remove the whole matched component to avoid
  // leaving thin extruded walls along its boundary.
  if (geometryArea(covered) >= area * 0.8) return []
  if (!covered.length) return [polygon]
  return clipping.difference([polygon], ...nearby)
}

/** Rewrite only the building layer, preserving height/base/color and holes. */
export function replaceBuildingTile(bytes: Uint8Array, tile: TileCoordinate, footprints: Footprint[]): Uint8Array {
  const source = new VectorTile(new PbfReader(bytes)).layers.building
  if (!source) return fromVectorTileJs({ layers: {} })
  const masks = footprints.map(f => f.geometry.map(p => p.map(r => r.map(point => tilePoint(point, tile, source.extent)))))
    .filter(mask => overlaps(bounds(mask), [-16, -16, source.extent + 16, source.extent + 16]))
  const exactIds = new Set(footprints.flatMap(f => f.ids))
  const features: Feature[] = []
  for (let i = 0; i < source.length; i++) {
    const feature = source.feature(i)
    // Unmerged IDs are reliable. Planetiler changes merged IDs to end in 0;
    // those must always be processed spatially, component by component.
    if (feature.id !== undefined && feature.id % 10 !== 0 && exactIds.has(feature.id)) continue
    const polygons = classifyRings(feature.loadGeometry())
    for (const polygon of polygons) {
      const rings: Polygon = polygon.map(r => r.map(p => [p.x, p.y]))
      const remaining = subtractFootprints(rings, masks)
      for (const piece of remaining) {
        const geometry = piece.map(ring => ring.map(([x, y]): Pair => [Math.round(x), Math.round(y)]))
          .filter(r => r.length >= 4 && Math.abs(ringArea(r)) > 0)
        if (geometry.length) features.push({ id: features.length + 1, type: 3, tags: feature.properties, geometry })
      }
    }
  }
  const output = new GeoJSONWrapper(features, { version: 2, extent: source.extent })
  output.name = 'building'
  return fromVectorTileJs({ layers: { building: output } })
}
