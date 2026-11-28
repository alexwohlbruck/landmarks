/**
 * Millennium Tower, Boston (1 Franklin Street): original procedural geometry,
 * CC0-1.0.
 * bun generators/bos-millennium-tower.ts
 *
 * Handel Architects, completed 2016; 60 storeys of flats over a retail base.
 * A long blue-glass bar made of parallel glass "shards" staggered in plan
 * and in height: the south face steps out eastward in four stages, the
 * north face in three, a lower shard caps the north side and another the
 * west end, and the top steps up from the south-east corner to a high
 * prow at the west end. A dark band of recessed balconies runs across both
 * broad faces near the top.
 *
 * Frame: map frame turned to BEARING 41: +x runs along the bar (compass
 * 131°, south-east), +y across it (compass 41°, north-east), z up, metres.
 * Origin = the anchor, the centroid of OSM outline way/95035761.
 *
 * Evidence
 * - OSM way/95035761 (outline, 54 levels, height 209), building:part
 *   way/1281259198 (the tower, 56 levels, 209; its stepped plan is used
 *   below, squared off) and way/1281259199 (the four-storey base). The
 *   Burnham Building (way/409161385) next door is a separate building and is
 *   left alone.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 0.5 m grid read
 *   in this frame. The streets fall from 3 m above the box's ground_min on
 *   Washington Street (west) to about 1 m on the east side; heights below
 *   are above that low street (ground_min + 1):
 *   - main roof 197-198 over x -26..32.5, y -8..16, with returns to 200-202
 *     in places and 202 over x -22..0 (the highest, 202.4, at the west);
 *     drawn as four shards stepping up westward, 196 / 198 / 200 / 202
 *     (x 21..32.5 / 7..21 / -9.5..7 / west of -9.5), the steps the photo
 *     from the north shows (it reads them as ~3 m each);
 *   - north shard (y 16..21.5) and west-end shard (x -32..-24) 185.5;
 *   - south-east shard (x 21..32.5, y -9..-3) 191;
 *   - base 17 (way/1281259199), its west end on Washington Street 21.
 *   The published height (Wikipedia, CTBUH: 685 ft, 209 m; OSM 209) is not
 *   borne out by the lidar, which finds nothing above 202.4 m; the lidar is
 *   used.
 * - Commons photos, all EVIDENCE:
 *   - "Millennium Tower Boston.jpg", Percival Kestreltail, CC BY-SA 4.0:
 *     from Boston Common (south-west); the stepped top rising to the west,
 *     the lower west shard, the balcony band on the south face;
 *     https://commons.wikimedia.org/wiki/File:Millennium_Tower_Boston.jpg
 *   - "Millennium Tower, Boston, Massachusetts.jpg", Jhern668, CC BY-SA 4.0: from a
 *     tower to the north; the lower north shard with its balcony band and
 *     the main roof stepping up behind it;
 *     https://commons.wikimedia.org/wiki/File:Millennium_Tower,_Boston,_Massachusetts.jpg
 *   - "Millennium Tower - Boston.jpg", Farragutful, CC BY-SA 4.0: from the Common, the
 *     west end and its shards;
 *     https://commons.wikimedia.org/wiki/File:Millennium_Tower_-_Boston.jpg
 *   - "Millennium Tower from Common.jpg", Fletcher, CC BY 4.0: from the west, the
 *     whole height over Downtown Crossing; glass colour.
 *     https://commons.wikimedia.org/wiki/File:Millennium_Tower_from_Common.jpg
 *
 * - Mapterhorn terrain: the map's ground under the tower AND the Burnham
 *   Building is a pit 13-15 m below the streets round it (the 2008-2014
 *   excavation of the Filene's block, still in the elevation model). The
 *   map puts y = 0 on the pit floor, so the model is authored from the low
 *   street and lifted by B = 13 m, its walls running down to y = 0. If the
 *   terrain is corrected, B must go back to 0. Terrain check: ok, ok.
 *
 * Estimated: the balcony bands' extent (south face z 163-175 over
 * x -2..27; north face z 171-183 over x -17..22) from the two photos; the
 * floor lines every three storeys (~9.9 m) and the pale joints at the
 * shard edges; the low glazed base's window bands.
 * Doubts: the published 209 m may include glass screens the lidar misses;
 * the east end is seen only obliquely.
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 41
const ANCHOR = { lng: -71.059506, lat: 42.355728 }
/** The low street above y = 0, the floor of the map terrain's pit (see the header). */
const B = 13

type P2 = [number, number]
const glass = new Part(), line = new Part(), roof = new Part(), dark = new Part(), base = new Part()

const area2 = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
function earcut(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 2000) {
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (area2(poly[a], poly[b], poly[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c &&
        area2(poly[a], poly[b], poly[j]) >= 0 && area2(poly[b], poly[c], poly[j]) >= 0 && area2(poly[c], poly[a], poly[j]) >= 0)) continue
      out.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function ccw(poly: P2[]): P2[] {
  let A = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; A += a[0] * b[1] - b[0] * a[1] }
  return A < 0 ? [...poly].reverse() : poly
}
function cap(p: Part, poly: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(poly)) {
    const A: V3 = [...poly[a], z], B: V3 = [...poly[b], z], C: V3 = [...poly[c], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
function inside(p: P2, poly: P2[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

type Vol = { poly: P2[]; top: number; wall: Part; lines: boolean; topPart: Part }
// --- Plan (squared off from way/1281259198 and the lidar) ---
// the main bar, cut into four shards whose tops step up westward
const M1: P2[] = [[-26.6, -2.5], [-9.5, -2.5], [-9.5, 16], [-24, 16], [-24, 3.5], [-27.7, 3.5]]
const M2: P2[] = [[-9.5, -5.5], [7, -5.5], [7, 16], [-9.5, 16]]
const M3: P2[] = [[7, -8], [21, -8], [21, 16], [7, 16]]
const M4: P2[] = [[21, -3], [32.5, -3], [32.5, 16], [21, 16]]
const S: P2[] = [[21, -8], [32.5, -8], [32.5, -3], [21, -3]]
const N: P2[] = [[-24, 16], [32.5, 16], [32.5, 21.5], [-14, 21.5], [-14, 19.2], [-22, 19.2], [-22, 17.5], [-24, 17.5]]
const WS: P2[] = [[-27.7, 3.5], [-24, 3.5], [-24, 17.5], [-30.5, 17.5], [-31.8, 14], [-32, 10], [-31.7, 5.7]]
const PODIUM: P2[] = [[-35.9, 6.3], [-34.5, -19.1], [32.2, -22.5], [32.5, -8], [7, -8], [7, -5.5], [-9.5, -5.5], [-9.5, -2.5], [-26.6, -2.5], [-27.7, 3.5], [-31.7, 5.7]]
const PODIUM_W: P2[] = [[-35.9, 6.3], [-34.5, -19.1], [-26, -19.5], [-26, -2.6], [-27.7, 3.5], [-31.7, 5.7]]

const vols: Vol[] = [
  { poly: M1, top: 202, wall: glass, lines: true, topPart: roof },
  { poly: M2, top: 200, wall: glass, lines: true, topPart: roof },
  { poly: M3, top: 198, wall: glass, lines: true, topPart: roof },
  { poly: M4, top: 196, wall: glass, lines: true, topPart: roof },
  { poly: S, top: 191, wall: glass, lines: true, topPart: roof },
  { poly: N, top: 185.5, wall: glass, lines: true, topPart: roof },
  { poly: WS, top: 185.5, wall: glass, lines: true, topPart: roof },
  { poly: PODIUM, top: 17, wall: base, lines: false, topPart: roof },
  { poly: PODIUM_W, top: 21, wall: base, lines: false, topPart: roof },
].map((v) => ({ ...v, poly: ccw(v.poly) }))

/** The highest volume (other than `self`) just outside an edge: walls start above it. */
function neighbourTop(self: Vol, a: P2, b: P2, s: number): number {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
  const p: P2 = [a[0] + t[0] * s * L + n[0] * 0.3, a[1] + t[1] * s * L + n[1] * 0.3]
  let top = 0
  for (const v of vols) if (v !== self && inside(p, v.poly)) top = Math.max(top, v.top)
  return top
}

const FLOOR = 197 / 60, GROUP = 3 * FLOOR
for (const v of vols) {
  const P = v.poly
  for (let k = 0; k < P.length; k++) {
    const a = P[k], b = P[(k + 1) % P.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // split long edges where the neighbour changes (sample at a few points)
    const cuts = [0, 0.25, 0.5, 0.75, 1]
    for (let i = 0; i < cuts.length - 1; i++) {
      const s0 = cuts[i], s1 = cuts[i + 1]
      const z0 = neighbourTop(v, a, b, (s0 + s1) / 2)
      if (z0 >= v.top) continue
      const A: P2 = [a[0] + (b[0] - a[0]) * s0, a[1] + (b[1] - a[1]) * s0]
      const Bp: P2 = [a[0] + (b[0] - a[0]) * s1, a[1] + (b[1] - a[1]) * s1]
      v.wall.quad([A[0], A[1], z0], [Bp[0], Bp[1], z0], [Bp[0], Bp[1], v.top], [A[0], A[1], v.top])
      if (!v.lines || L * (s1 - s0) < 0.5) continue
      const tt: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [tt[1], -tt[0]]
      const o = (p: P2, d: number): P2 => [p[0] + n[0] * d, p[1] + n[1] * d]
      const A2 = o(A, 0.12), B2 = o(Bp, 0.12)
      // floor lines every three storeys, above the neighbour, below the top
      for (let z = GROUP; z < v.top - 2; z += GROUP) {
        if (z < z0 + 1) continue
        line.quad([A2[0], A2[1], z - 0.22], [B2[0], B2[1], z - 0.22], [B2[0], B2[1], z + 0.22], [A2[0], A2[1], z + 0.22])
      }
      // a pale cap band at the shard's top edge
      line.quad([A2[0], A2[1], v.top - 0.9], [B2[0], B2[1], v.top - 0.9], [B2[0], B2[1], v.top], [A2[0], A2[1], v.top])
    }
  }
  cap(v.topPart, P, v.top)
}

// Grey vertical joints at the tower's outer corners (the shard edges).
for (const v of vols.filter((v) => v.lines)) {
  const P = v.poly
  for (let k = 0; k < P.length; k++) {
    const p = P[k], q = P[(k + P.length - 1) % P.length], r = P[(k + 1) % P.length]
    if (area2(q, p, r) <= 0) continue // only convex corners
    const z0 = Math.max(neighbourTop(v, q, p, 0.98), neighbourTop(v, p, r, 0.02))
    if (z0 >= v.top) continue
    const d1 = norm([p[0] - q[0], p[1] - q[1]]), d2 = norm([r[0] - p[0], r[1] - p[1]])
    const out = norm([d1[1] - d2[1], -d1[0] + d2[0]])
    const c: P2 = [p[0] + out[0] * 0.15, p[1] + out[1] * 0.15]
    const tng = norm([d2[0] - d1[0], d2[1] - d1[1]])
    const A: P2 = [c[0] - tng[0] * 0.25, c[1] - tng[1] * 0.25], B: P2 = [c[0] + tng[0] * 0.25, c[1] + tng[1] * 0.25]
    base.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], v.top], [A[0], A[1], v.top])
  }
}
function norm(v: P2): P2 { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A flat panel on wall a→b (anticlockwise plan), x-range clipped, z0..z1, set out by d. */
function band(p: Part, poly: P2[], x0: number, x1: number, z0: number, z1: number, faceSign: number, d = 0.1) {
  for (let k = 0; k < poly.length; k++) {
    const a = poly[k], b = poly[(k + 1) % poly.length]
    if (Math.abs(a[1] - b[1]) > 1e-6) continue // only faces along x
    const dir = Math.sign(a[0] - b[0]) // +1 runs -x: the north face (outside +y)
    if (dir !== faceSign) continue
    const lo = Math.max(Math.min(a[0], b[0]), x0), hi = Math.min(Math.max(a[0], b[0]), x1)
    if (hi - lo < 1) continue
    const y = a[1] + faceSign * d
    if (faceSign > 0) p.quad([hi, y, z0], [lo, y, z0], [lo, y, z1], [hi, y, z1])
    else p.quad([lo, y, z0], [hi, y, z0], [hi, y, z1], [lo, y, z1])
  }
}
// The recessed balcony bands: south face (M and S) and the north shard.
for (const P of [M2, M3, S]) band(dark, P, -2, 27, 163, 175, -1, 0.14)
band(dark, N, -17, 22, 171.5, 183, 1, 0.14)

// --- The base: glazed shopfronts and two window bands in the stone-grey base ---
{
  const P = vols[7].poly
  for (let k = 0; k < P.length; k++) {
    const a = P[k], b = P[(k + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) continue
    const z0 = neighbourTop(vols[7], a, b, 0.5)
    if (z0 > 0) continue
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    const q = (s: number, z: number, d = 0.08): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
    glass.quad(q(0.8, 0.3), q(L - 0.8, 0.3), q(L - 0.8, 5.0), q(0.8, 5.0))
    glass.quad(q(0.8, 7.0), q(L - 0.8, 7.0), q(L - 0.8, 15.0), q(0.8, 15.0))
  }
}

const parts = [
  { part: glass, material: windowVariant(2, 0x8eaed6) },
  { part: line, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: finish('balcony-band', 0x4c5866) },
  { part: base, material: finish('base-grey', 0xc9ccce) },
]
// Stand it in the terrain's pit: everything is authored from the street (z = 0)
// and lifted by B; the walls' feet (authored at z = 0) stay at y = 0, the pit
// floor (see the header).
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) if (part.pos[i] > 1e-6) part.pos[i] += B
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Millennium Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: B + 202,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/95035761', 'way/1281259198', 'way/1281259199'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-millennium-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
