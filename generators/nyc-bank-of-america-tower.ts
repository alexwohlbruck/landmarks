/**
 * Bank of America Tower (One Bryant Park) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-bank-of-america-tower.ts
 *
 * Map frame: x = model east (Sixth Avenue), y = model north (West 43rd
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/86121621, which covers the whole
 * block front from Sixth Avenue to 4 Times Square, podium included.
 *
 * The tower is two crystalline shards, each a convex hull of measured
 * points: vertical walls that break into leaning facets near the top, and
 * the south shard's roof a single plane rising to the east. Each facet is
 * broad light glass bays between pale vertical fins, three storeys a panel;
 * the leaning folds are whole planes of a slightly deeper glass shade, so
 * the crystalline facets read.
 *
 * Evidence
 * - OSM way/86121621 and parts 260153997 (spire, 366 m), 260153998,
 *   279687416–420 and 279691503–511 (the two shards' tops, skillion facets),
 *   291927532 (15 m) and 291927536 (30 m podium). OSM's top heights
 *   (236–279 m) are low against the lidar and were not used.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), sliced at 60/120/180/230/250/
 *   270 m in the model frame (/tmp/city/nyc/work/nyc-bank-of-america-tower/
 *   slices.txt). Street ≈ 18.3 m NAVD88. Measured above it:
 *   - north shard x −1.5…64, y 2.2…27.5; walls plumb to ≈ 120 m, then the
 *     Sixth Avenue face leans in to x ≈ 50 at the 249 m roof and the
 *     north-east corner is cut by a big facet falling from 248 m at x 14 to
 *     ≈ 105 m at the Sixth Avenue corner;
 *   - south shard x 3.5…60.5 at 43rd/the middle, east face running
 *     diagonally to x 53 at 42nd Street, y −25…2.2; west face plumb to
 *     ≈ 185 m then leaning to x 12 at the roof; the roof a plane rising from
 *     ≈ 250 m at the west to 286 m at the north-east corner; the south-west
 *     corner bevelled down to ≈ 168 m;
 *   - a lower west wing x −5.5…3.5, y −24…−2, roof ≈ 108–150 m rising east;
 *   - the spire at x 36.5, y −10, tip 366 m; podium 45 m (31 m along 43rd
 *     Street, 38 m strip on 42nd); the 15 m OSM part along Sixth Avenue and
 *     42nd Street reads as open ground in the lidar and is not modelled.
 * - Published: 366 m with spire, 288 m roof, 55 floors, Cook+Fox, 2009;
 *   faceted glass curtain wall with fritted bands; a lattice spire of 77 m
 *   (Wikipedia; CTBUH).
 * - Photos (Wikimedia Commons, daylight): see
 *   /tmp/city/nyc/work/nyc-bank-of-america-tower/photos/credits.txt.
 *
 * Estimated: the exact facet vertices (from 2–3 m lidar slices), the
 * north face's top edge, the wing's roof, the spire's base width (5 m) and
 * its drawing as a solid tapering mast rather than a lattice.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, massing, spire, type Facade } from './nyc-570-lexington'

const glass = new Part(), fold = new Part(), fin = new Part(), roof = new Part(), top = new Part(), mast = new Part()
const podium = fin

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const nrm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** Faces of the convex hull of a few points, each as a counter-clockwise (from outside) polygon. */
function hull(pts: V3[]): { poly: V3[]; n: V3 }[] {
  const eps = 0.05, seen = new Set<string>(), faces: { poly: V3[]; n: V3 }[] = []
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) for (let k = j + 1; k < pts.length; k++) {
    let n = crs(sub(pts[j], pts[i]), sub(pts[k], pts[i]))
    if (Math.hypot(...n) < 1e-6) continue
    n = nrm(n)
    const d = pts.map((p) => dot(n, sub(p, pts[i])))
    if (d.every((v) => v <= eps)) { /* outward = n */ } else if (d.every((v) => v >= -eps)) n = [-n[0], -n[1], -n[2]]
    else continue
    const on = pts.map((p, m) => [m, Math.abs(dot(n, sub(p, pts[i])))] as [number, number]).filter(([, v]) => v <= eps).map(([m]) => m)
    const key = on.join(',')
    if (seen.has(key)) continue
    seen.add(key)
    // Order the coplanar points round their centroid, counter-clockwise about n.
    const c: V3 = [0, 1, 2].map((a) => on.reduce((s, m) => s + pts[m][a], 0) / on.length) as V3
    const u = nrm(sub(pts[on[0]], c)), w = crs(n, u)
    const sorted = on.map((m) => pts[m]).sort((p, q) => Math.atan2(dot(sub(p, c), w), dot(sub(p, c), u)) - Math.atan2(dot(sub(q, c), w), dot(sub(q, c), u)))
    // Drop points inside the polygon's outline (2D hull by gift wrapping on the sorted ring).
    const ring: V3[] = []
    for (const p of sorted) {
      ring.push(p)
      while (ring.length >= 3) {
        const a = ring[ring.length - 3], b = ring[ring.length - 2], q = ring[ring.length - 1]
        if (dot(crs(sub(b, a), sub(q, b)), n) <= 1e-6) ring.splice(ring.length - 2, 1); else break
      }
    }
    faces.push({ poly: ring, n })
  }
  return faces
}

const FLOOR = 4.1, GROUP = 3, BREAK = 0.7, BAY = 4.6, PIER = 1.1

/**
 * A crystalline shard: each wall facet is pale backing (the mullion fins and
 * spandrels) with broad glass bays laid 0.06 m proud, three storeys a panel.
 * Plumb faces take one glass shade, the leaning folds another, so the facets
 * read. Up-facing facets are the glass crown.
 */
function shard(pts: V3[], roofPart: Part, glazed = true) {
  for (const { poly, n } of hull(pts)) {
    if (n[2] < -0.5) continue // the underside sits on the ground
    const flatTop = n[2] > 0.55
    const leaning = Math.abs(n[2]) > 0.04
    // Leaning folds are drawn whole in the deeper glass shade: they are
    // narrow, often triangular, and read best as one clean plane.
    const p = flatTop ? roofPart : !glazed ? podium : leaning ? fold : fin
    for (let i = 1; i < poly.length - 1; i++) p.tri(poly[0], poly[i], poly[i + 1], undefined, undefined, undefined, [n, n, n])
    if (flatTop || !glazed || leaning) continue
    const glassPart = glass
    // Face frame: e horizontal along the face, f up the face.
    const e = nrm(crs([0, 0, 1], n)), f = nrm(crs(n, e)), O = poly[0]
    const at = (u: number, z: number): V3 => {
      const sF = (z - O[2]) / f[2]
      return [O[0] + e[0] * u + f[0] * sF + n[0] * 0.06, O[1] + e[1] * u + f[1] * sF + n[1] * 0.06, z]
    }
    // The face's u-span where the plane z = h cuts it.
    const span = (h: number): [number, number] | null => {
      const us: number[] = []
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length]
        if ((a[2] - h) * (b[2] - h) <= 0 && a[2] !== b[2]) {
          const t = (h - a[2]) / (b[2] - a[2])
          us.push(dot(sub([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, h], O), e))
        }
      }
      return us.length >= 2 ? [Math.min(...us), Math.max(...us)] : null
    }
    const zs = poly.map((q) => q[2]), z0 = Math.min(...zs), z1 = Math.max(...zs)
    const RH = FLOOR * GROUP
    for (let h = Math.max(z0, 0) + (z0 < 1 ? 6 : 0.6); h + RH * 0.5 < z1; h += RH) {
      const lo = h, hi = Math.min(h + RH - BREAK, z1 - 0.8)
      if (hi - lo < 3) continue
      const a = span(lo + 0.01), b = span(hi - 0.01)
      if (!a || !b) continue
      const u0 = Math.max(a[0], b[0]) + PIER, u1 = Math.min(a[1], b[1]) - PIER
      const W = u1 - u0
      if (W < 2.5) continue
      const count = Math.max(1, Math.round((W + PIER) / BAY)), pitch = (W + PIER) / count
      for (let k = 0; k < count; k++) {
        const pa = u0 + k * pitch, pb = pa + pitch - PIER
        glassPart.quad(at(pa, lo), at(pb, lo), at(pb, hi), at(pa, hi))
      }
    }
  }
}

// North shard (along 43rd Street).
shard([
  [-1.5, 2.2, 0], [64, 2.2, 0], [64, 27.5, 0], [-1.5, 27.5, 0],
  [-1.5, 2.2, 249], [50, 2.2, 249], [48.5, 15, 249], [14, 26.5, 248], [4, 26.5, 248], [-1.5, 27.5, 236],
  [64, 2.2, 118], [64, 27.5, 105], [30, 27.5, 200],
], top)

// South shard (along 42nd Street), the taller one, carrying the spire.
shard([
  [3.5, -25, 0], [53, -25, 0], [60.5, 2.2, 0], [3.5, 2.2, 0],
  [3.5, -25, 168], [3.5, -12, 185], [3.5, 2.2, 228],
  [60.5, 2.2, 286], [53, -25, 277],
  [12, -21, 250], [12, -4, 254], [8, 2.2, 256], [20, -25, 248],
], top)

// The lower west wing.
shard([
  [-5.5, -24, 0], [3.5, -24, 0], [3.5, -2, 0], [-5.5, -2, 0],
  [-5.5, -24, 108], [-5.5, -2, 108], [3.5, -24, 150], [3.5, -2, 150],
], roof)

// Spire: a slender tapering mast on the south shard's roof.
const SX = 36.5, SY = -10
spire(mast, [[SX - 2.6, SY - 2.6], [SX + 2.6, SY - 2.6], [SX + 2.6, SY + 2.6], [SX - 2.6, SY + 2.6]], 262, [SX, SY, 366])

// Podium: glass and stone blocks west of the tower.
const podiumF: Facade = { bay: 6, ratio: 0.82, floor: 4.5, group: 2, spandrel: 1.6, sill: 1.2, head: 1.2, ground: 6, minLength: 4 }
massing({
  wall: podium, win: glass, roof, facade: podiumF, bevel: 0.4,
  boxes: [
    [-63, -26, -1.5, 13, 45],
    [-63, 13, -1.5, 28, 31],
    [-63, -30.5, 20, -26, 38],
  ],
})

finishModel('Bank of America Tower', 'nyc-bank-of-america-tower', [
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
  { part: fold, material: windowVariant(3, 0x9cb4c8) },
  { part: fin, material: finish('boa-fin', 0xe4e9ec) },
  { part: top, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
  { part: mast, material: finish('boa-spire', 0xe6e7e6) },
], { bearing: 29, osm: 'way/86121621', height: 366 })
