/**
 * One Dalton (Four Seasons Hotel and Private Residences), Boston: original
 * procedural geometry, CC0-1.0.
 * bun generators/bos-one-dalton.ts
 *
 * Henry N. Cobb of Pei Cobb Freed & Partners with CambridgeSeven, completed
 * 2019; 61 floors. A rounded-triangle prism in blue-green glass, its walls
 * made of tall vertical glass bands with pale joints, a flat top behind a
 * glass parapet, a column of deep balcony slots near the north-east corner
 * in the upper half, and a pale stone hotel base with glazed bands and a
 * white louvred band round the south corner.
 *
 * Frame: map frame, bearing 0 (x east, y north, z up), metres. Origin = the
 * anchor, the centroid of OSM multipolygon relation/11207403.
 *
 * Evidence
 * - OSM relation/11207403 (outline, hotel, 61 levels, 226 m, glass) and its
 *   building:part way/818117637 (the same outline); the roof parts
 *   way/816334360 and way/818117636 (one footprint, tagged 5-15 m and 5 m)
 *   and way/833091391 (5-15 m), the entrance canopies off the west face and
 *   round the south corner, drawn as thin slabs at 5.0-5.8 m (the Ha'Eri
 *   photo shows a thin canopy over the entrance, not a 10 m block; the
 *   lidar plan already covers 27-63 % of them).
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight; the tower was
 *   finished in 2019), 0.5 m grid in this frame; street 2.2 m above the box's
 *   ground_min:
 *   - the plan below is the lidar roof edge, traced in 144 directions from
 *     (0.6, 1.6), median-smoothed and kept every 10°; it matches the OSM
 *     outline to ~1-3 m and is the same at 60, 200 and 222 m (a straight
 *     prism, no taper);
 *   - parapet rim 226-228.5 all round (227.0 used); roof inside it at
 *     218-226 (222.0 used); a plant box to ~229 near the middle; the highest
 *     return 234 m is a small object at the NE corner (left out);
 *   - a gap below 100 m between the body and a thin outer wall near the NE
 *     corner on the north face: the balcony slot (drawn as a dark recessed
 *     strip from 100 m up, as the photos show it).
 * - Published (Wikipedia "One Dalton"): roof 742 ft (226.2 m), 61 floors,
 *   completed 2019, Henry N. Cobb / Pei Cobb Freed and CambridgeSeven.
 * - Commons photos, all EVIDENCE:
 *   - "One Dalton, Boston.jpg", Kenneth C. Zirkel, CC BY-SA 4.0: the whole
 *     tower from the street; glass bands, the balcony slot, the stone base
 *     with its louvred band and glazed bands;
 *     https://commons.wikimedia.org/wiki/File:One_Dalton,_Boston.jpg
 *   - "2023-0322-One Dalton.jpg", Bobak Ha'Eri, CC BY 3.0: the base close
 *     up (stone, two glazed bands, louvres, entrance canopy) and the tower;
 *     https://commons.wikimedia.org/wiki/File:2023-0322-One_Dalton.jpg
 *   - "Boston Skyline from Back Bay Fens.jpg", Joe Passe, CC BY-SA 2.0: from
 *     the west-south-west, the flat top, vertical bands, teal glass, the
 *     balcony slot at the right edge near the top.
 *     https://commons.wikimedia.org/wiki/File:Boston_Skyline_from_Back_Bay_Fens.jpg
 *
 * Estimated: the base storeys (lobby to 6 m, glazed bands to 20 m, louvred
 * band to 26 m) and their extent round the south corner, from the two street
 * photos; the band joints every ~3.7 m (one per plan vertex); the slot's
 * depth (drawn flush, dark) and its bottom at 100 m (lidar says below 100 m; the Zirkel photo
 * shows it in the upper half).
 * Doubts: no photo of the north face itself; the slot's exact position
 * rests on the lidar gap. No night photo was found; the windows are lit as
 * a residential tower.
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const ANCHOR = { lng: -71.083956, lat: 42.345722 }
const RIM = 227.0, ROOF = 222.0
const C: [number, number] = [0.6, 1.6]

type P2 = [number, number]
/** Lidar roof edge, anticlockwise from east, every 10° about C. */
const PLAN: P2[] = [
  [23.8, 1.6], [25.0, 5.9], [23.1, 9.8], [18.8, 12.1], [15.0, 13.7], [11.6, 14.8], [8.6, 15.5], [6.0, 16.3],
  [3.3, 16.9], [0.6, 17.1], [-2.1, 17.2], [-5.4, 18.1], [-8.9, 18.1], [-13.2, 18.1], [-17.3, 16.6], [-19.4, 13.1],
  [-19.1, 8.8], [-19.2, 5.1], [-18.1, 1.6], [-17.7, -1.6], [-16.7, -4.7], [-15.9, -7.9], [-14.6, -11.1], [-13.0, -14.6],
  [-11.0, -18.5], [-8.2, -22.7], [-4.2, -25.7], [0.6, -24.5], [4.8, -22.1], [8.0, -18.8], [11.1, -16.6], [13.5, -13.8],
  [15.7, -11.0], [17.6, -8.2], [19.8, -5.4], [21.6, -2.1],
]
const N = PLAN.length

const glassP = new Part(), joint = new Part(), stone = new Part(), roof = new Part(), dark = new Part(), lobby = new Part()

const norm = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const angleOf = (p: P2) => ((Math.atan2(p[1] - C[1], p[0] - C[0]) * 180) / Math.PI + 360) % 360
/** Edge k's outward normal. */
const nrm = (k: number): P2 => { const a = PLAN[k], b = PLAN[(k + 1) % N]; return norm([b[1] - a[1], a[0] - b[0]]) }
const off = (p: P2, n: P2, d: number): P2 => [p[0] + n[0] * d, p[1] + n[1] * d]

/** A quad on edge k between heights, set out by d, from s0 to s1 (0..1) along the edge. */
function onEdge(p: Part, k: number, z0: number, z1: number, d: number, s0 = 0, s1 = 1) {
  const a = PLAN[k], b = PLAN[(k + 1) % N], n = nrm(k)
  const A = off([a[0] + (b[0] - a[0]) * s0, a[1] + (b[1] - a[1]) * s0], n, d)
  const B = off([a[0] + (b[0] - a[0]) * s1, a[1] + (b[1] - a[1]) * s1], n, d)
  p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
}

// The hotel base wraps the south corner: edges whose midpoint lies between these compass-math angles.
const isBase = (k: number) => { const m = angleOf([(PLAN[k][0] + PLAN[(k + 1) % N][0]) / 2, (PLAN[k][1] + PLAN[(k + 1) % N][1]) / 2]); return m > 205 && m < 325 }
// The balcony slot: on the north face near the NE corner (lidar gap at x 14-22, y 14: edges 2 and 3, ~8 m).
const isSlot = (k: number) => k === 2 || k === 3

const LOBBY = 6.0, BASE_TOP = 26.0, LOUVRE = 20.5, SLOT_BOT = 100

for (let k = 0; k < N; k++) {
  const a = PLAN[k], b = PLAN[(k + 1) % N]
  // body wall: glass, except the stone base on the south corner
  if (isBase(k)) {
    stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], BASE_TOP], [a[0], a[1], BASE_TOP])
    glassP.quad([a[0], a[1], BASE_TOP], [b[0], b[1], BASE_TOP], [b[0], b[1], RIM], [a[0], a[1], RIM])
    // two glazed bands in the stone, and the lobby glazing
    onEdge(lobby, k, 0.4, LOBBY - 0.8, 0.06, 0.08, 0.92)
    onEdge(glassP, k, LOBBY + 0.9, 12.6, 0.06, 0.04, 0.96)
    onEdge(glassP, k, 13.6, 19.4, 0.06, 0.04, 0.96)
    // the white louvred band: pale fins standing out from the stone
    for (const s of [0.17, 0.5, 0.83]) onEdge(joint, k, LOUVRE, BASE_TOP - 0.3, 0.25, s - 0.06, s + 0.06)
  } else {
    glassP.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], RIM], [a[0], a[1], RIM])
    onEdge(lobby, k, 0.4, LOBBY - 0.8, 0.06, 0.06, 0.94) // ground-floor glazing reads warmer
  }
  if (isSlot(k)) onEdge(dark, k, SLOT_BOT, RIM - 1.5, 0.07, k === 2 ? 0.25 : 0, 1)
}

// Band joints: a pale vertical line at every plan vertex, above the base where there is one.
for (let k = 0; k < N; k++) {
  const p = PLAN[k], prev = (k + N - 1) % N
  const n = norm([nrm(prev)[0] + nrm(k)[0], nrm(prev)[1] + nrm(k)[1]]), t: P2 = [-n[1], n[0]]
  const z0 = isBase(k) || isBase(prev) ? BASE_TOP : LOBBY
  const A = off([p[0] - t[0] * 0.3, p[1] - t[1] * 0.3], n, 0.12), B = off([p[0] + t[0] * 0.3, p[1] + t[1] * 0.3], n, 0.12)
  joint.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], RIM], [A[0], A[1], RIM])
}
// A pale line over the lobby all round, and the stone base's cornice.
for (let k = 0; k < N; k++) {
  onEdge(joint, k, LOBBY - 0.6, LOBBY + 0.3, 0.14)
  if (isBase(k)) onEdge(joint, k, BASE_TOP - 0.3, BASE_TOP + 0.5, 0.18)
}

// --- Top: parapet rim, roof inside it, a plant box ---
{
  const inner = PLAN.map(([x, y]) => { const v = norm([C[0] - x, C[1] - y]); return [x + v[0] * 2.5, y + v[1] * 2.5] as P2 })
  for (let k = 0; k < N; k++) {
    const a = PLAN[k], b = PLAN[(k + 1) % N], c = inner[(k + 1) % N], d = inner[k]
    joint.quad([a[0], a[1], RIM], [b[0], b[1], RIM], [c[0], c[1], RIM], [d[0], d[1], RIM])
    glassP.quad([c[0], c[1], ROOF], [d[0], d[1], ROOF], [d[0], d[1], RIM], [c[0], c[1], RIM]) // inner face, facing in
    roof.tri([C[0], C[1], ROOF], [d[0], d[1], ROOF], [c[0], c[1], ROOF])
  }
  const box: P2[] = [[-8, -6], [6, -6], [6, 6], [-8, 6]]
  for (let k = 0; k < 4; k++) {
    const a = box[k], b = box[(k + 1) % 4]
    roof.quad([a[0], a[1], ROOF], [b[0], b[1], ROOF], [b[0], b[1], 229], [a[0], a[1], 229])
  }
  roof.cap(box.map(([x, y]) => [x, y, 229] as V3), true)
}

// --- Entrance canopies: the OSM roof parts off the west and south-west faces, as thin slabs ---
const CANOPIES: P2[][] = [
  // way/816334360 (= way/818117636), west face
  [[-11.7, -11.0], [-13.7, -12.1], [-15.2, -12.8], [-19.9, -15.3], [-22.6, -7.9], [-24.7, -0.5], [-20.1, 1.1], [-16.4, 2.2], [-14.0, -4.4]],
  // way/833091391, round the south corner
  [[-13.7, -12.1], [-9.4, -24.4], [-8.9, -25.5], [-8.4, -26.8], [-7.4, -27.9], [-6.1, -28.6], [-5.1, -29.0], [-4.0, -29.0], [-2.8, -28.9],
    [-1.9, -28.5], [-0.7, -27.6], [0.4, -26.5], [4.8, -21.7], [9.1, -17.0], [7.9, -15.8], [6.5, -14.3], [0.2, -21.6], [-1.4, -23.0],
    [-2.6, -23.7], [-4.0, -23.9], [-5.8, -23.5], [-7.1, -22.8], [-7.9, -21.8], [-11.7, -11.0]],
]
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
const CAN_Z0 = 5.0, CAN_Z1 = 5.8 // OSM min_height 5; slab thickness estimated
for (let poly of CANOPIES) {
  let A = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; A += a[0] * b[1] - b[0] * a[1] }
  if (A < 0) poly = [...poly].reverse()
  for (const [a, b, c] of earcut(poly)) {
    joint.tri([...poly[a], CAN_Z1], [...poly[b], CAN_Z1], [...poly[c], CAN_Z1])
    joint.tri([...poly[a], CAN_Z0], [...poly[c], CAN_Z0], [...poly[b], CAN_Z0])
  }
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    joint.quad([a[0], a[1], CAN_Z0], [b[0], b[1], CAN_Z0], [b[0], b[1], CAN_Z1], [a[0], a[1], CAN_Z1])
  }
}

const parts = [
  { part: glassP, material: windowVariant(2, 0x7b9db3) },
  { part: joint, material: PALETTE.trim },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: finish('balcony-slot', 0x4a525b) },
  { part: lobby, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('One Dalton', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 229,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['relation/11207403', 'way/818117637', 'way/816334360', 'way/818117636', 'way/833091391'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-one-dalton.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
