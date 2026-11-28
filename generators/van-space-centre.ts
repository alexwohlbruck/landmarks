/**
 * H. R. MacMillan Space Centre and Museum of Vancouver, Vanier Park (1968;
 * Gerald Hamilton) — procedural, CC0-1.0.
 * bun generators/van-space-centre.ts
 *
 * The round planetarium building whose white ribbed conical roof, rising to a
 * narrow flared crown, recalls a Haida woven hat: the crown, the concave
 * cone with its radial ribs, the glazed clerestory ring under its eave, the
 * wide coffered saucer cantilevered over the plaza, the flaring tree columns
 * and the recessed ground-floor drum; and the low flat-roofed museum blocks
 * round it, faced in white patterned precast.
 *
 * Frame: x east, y north, z up, metres (bearing 0). Origin at the area
 * centroid of the OSM outline (relation/7440597, outer way/609628580 less
 * the courtyard way/512393025), on the lowest ground.
 *
 * Evidence
 *  - OSM: relation/7440597 ("Museum of Vancouver", building, Q1478298) with
 *    building:parts way/512393026 (the dome, a ~21 m radius circle, height
 *    16.34, pyramidal), way/609628578 (the crown, r 3.8, height 25.16),
 *    way/512393023 (west block, 9.49), way/512393024 (south-east block,
 *    12.36) and way/609628579 (east wing, 10.2); the courtyard
 *    way/512393025. The tagged heights are the City lidar's averages.
 *  - Heights: City of Vancouver building footprints 2009 (City 2009 lidar;
 *    Contains information licensed under the Open Government Licence –
 *    Vancouver), building 138670: max 26.15 m (the crown), the cone's facet
 *    average 16.3 over a base of 8.5 m; the blocks' bases 7.0 (east wing,
 *    the lowest), 7.2 (south-east), 7.9 (the main body), 10.1 (west), so
 *    each block's walls start 0–3.1 m up and run down to the ground.
 *    MEASURED.
 *  - The dome's section, from photo 1 against the 26 m total: the ground
 *    drum to 7.5 m (radius 13), the saucer's underside rising from the
 *    drum to its rim (radius 21) at 10.1, the coffered rim to 13.0, the clerestory
 *    13–15.6 (radius 16.5), the cone's eave (radius 18.8) at 15.6, concave
 *    to the neck (radius 2.6) at 23.6, the crown flaring to radius 3.7 at
 *    25.8. ESTIMATED.
 *  - Photos (Wikimedia Commons, EVIDENCE):
 *    1. "Museum of Vancouver - Flickr - Reg Natarajan.jpg", Reg Natarajan,
 *       CC BY 2.0: the south front square-on.
 *    2. "Museum of Vancouver.jpg", Ɱ, CC BY-SA 4.0: the south-west front.
 *    3. "Museum of Vancouver and H.R. MacMillan Space Centre WLM2012.JPG",
 *       MRDXII, CC BY-SA 3.0: the south front.
 *    4. "Museum of Vancouver back.jpg", Jeff Hitchcock, CC BY 2.0: the
 *       north side: the glass entry block, the precast blocks.
 *    5. "H.R. MacMillan Space Centre Crab.jpg", Stokedonfooty, CC BY-SA
 *       3.0: the coffered soffit and the tree columns.
 *  - Mapterhorn: the ground rises about 3 m from the north side to the
 *    south plaza; the uphill (south) side of the drum sinks into it.
 *  Elevation 0.
 *
 * Doubts: the saucer's coffers and the precast pattern are left plain; the
 * crab sculpture (George Norris, 1968) in the pool is not drawn (a thin
 * steel sculpture that won't read at map scale); the north glass entry
 * block is drawn as part of the main body at its height; the dome's
 * section is photo-scaled.
 *
 * Night: the clerestory and ground-floor glazing are `window`; the white
 * roof is floodlit (`_FLOODLIGHT`).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { earcut, prism } from './berlin-chancellery'
import { ccw, type XY } from './berlin-kit'
import clipping from 'polygon-clipping'
import { PALETTE, finish } from './palette'

const OUTLINE: XY[] = [[-22.01, -10.43], [-36.71, -16.90], [-38.72, -12.65], [-42.27, -14.31], [-44.06, -10.54], [-48.73, -12.72], [-56.71, 4.13], [-52.10, 6.28], [-53.71, 9.68], [-50.00, 11.42], [-52.34, 16.36], [-35.74, 24.10], [-33.63, 19.65], [-29.92, 21.38], [-28.22, 17.78], [-24.29, 19.61], [-28.27, 28.01], [-13.59, 34.86], [-9.52, 26.27], [-5.24, 28.26], [-6.91, 31.78], [-3.45, 33.39], [-5.90, 38.59], [11.10, 46.53], [13.35, 41.76], [17.49, 43.70], [19.36, 39.75], [23.48, 41.67], [31.38, 24.96], [27.38, 23.10], [29.36, 18.91], [25.20, 16.96], [27.04, 13.08], [22.20, 10.83], [28.64, -2.78], [33.49, -0.51], [35.72, -5.20], [39.11, -3.62], [40.74, -7.06], [45.58, -4.79], [53.59, -21.72], [49.55, -23.61], [51.25, -27.20], [47.21, -29.10], [49.15, -32.91], [43.52, -36.03], [32.18, -41.31], [30.09, -36.90], [26.81, -38.43], [25.20, -35.02], [21.87, -36.58], [14.90, -21.84], [13.17, -24.45], [5.98, -28.72], [-2.32, -29.91], [-10.44, -27.81], [-17.12, -22.78], [-21.33, -15.57]]
const COURT: XY[] = [[-0.22, 29.65], [14.32, 36.44], [21.20, 21.90], [6.67, 15.11]]
const WEST: XY[] = [[-48.77, 7.69], [-32.01, 15.52], [-24.23, -0.92], [-40.99, -8.75]]
const SOUTHEAST: XY[] = [[20.21, -16.85], [36.82, -9.10], [44.56, -25.47], [27.95, -33.22]]
const EAST: XY[] = [[14.90, -21.84], [18.16, -17.75], [20.16, -9.73], [18.93, -1.57], [14.63, 5.50], [13.15, 6.61], [22.20, 10.83], [28.64, -2.78], [33.49, -0.51], [35.72, -5.20], [39.11, -3.62], [40.74, -7.06], [45.58, -4.79], [53.59, -21.72], [49.55, -23.61], [51.25, -27.20], [47.21, -29.10], [49.15, -32.91], [43.52, -36.03], [32.18, -41.31], [30.09, -36.90], [26.81, -38.43], [25.20, -35.02], [21.87, -36.58]]
const DOME: XY[] = [[18.16, -17.75], [14.90, -21.84], [13.17, -24.45], [5.98, -28.72], [-2.32, -29.91], [-10.44, -27.81], [-17.12, -22.78], [-21.33, -15.57], [-22.01, -10.43], [-22.41, -7.31], [-20.21, 0.73], [-15.20, 7.17], [-8.12, 11.26], [-0.00, 12.40], [7.94, 10.41], [13.15, 6.61], [14.63, 5.50], [18.93, -1.57], [20.16, -9.73]]
const CROWN: XY[] = [[-5.80, -7.31], [-5.91, -9.38], [-4.90, -11.20], [-3.23, -12.16], [-1.30, -12.18], [0.38, -11.24], [1.39, -9.60], [1.46, -7.78], [0.65, -6.13], [-0.84, -5.06], [-2.66, -4.81], [-4.59, -5.61]]

const white = new Part(), concrete = new Part(), precast = new Part(), win = new Part(), roofP = new Part()

// ---- The museum blocks (bases above the lowest, from the lidar) ---------------------------
/** A hole joined to its outer ring by a slit, so one ear-clipping serves. */
function keyhole(outer: XY[], hole: XY[]): XY[] {
  const o = ccw(outer), h = [...ccw(hole)].reverse()
  let best = [0, 0, Infinity]
  o.forEach((a, i) => h.forEach((b, j) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (d < best[2]) best = [i, j, d] }))
  const [i, j] = best
  return [...o.slice(0, i + 1), ...h.slice(j), ...h.slice(0, j + 1), ...o.slice(i)]
}
const DOME_C: XY = [-1.1, -8.6]
const circle = (c: XY, r: number, n = 32): XY[] => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * Math.sin((2 * Math.PI * i) / n)] as XY)
const closed = (r: XY[]) => [...r, r[0]]
{
  // The main body: the outline less the courtyard, the planetarium's circle
  // and the separately measured blocks, at its own lidar height.
  const H = 0.9 + 9.3
  const body = clipping.difference([closed(OUTLINE), closed(COURT)] as any, [closed(circle(DOME_C, 21.2))] as any,
    [closed(WEST)] as any, [closed(SOUTHEAST)] as any, [closed(EAST)] as any) as unknown as XY[][][]
  for (const poly of body) {
    const rings = poly.map((r) => r.slice(0, -1) as XY[])
    for (const [k, r] of rings.entries()) {
      const c = k === 0 ? ccw(r) : [...ccw(r)].reverse()
      for (let i = 0; i < c.length; i++) {
        const u = c[i], v = c[(i + 1) % c.length]
        precast.quad([u[0], u[1], 0], [v[0], v[1], 0], [v[0], v[1], H], [u[0], u[1], H])
      }
    }
    let outer = rings[0]
    for (const hole of rings.slice(1)) outer = keyhole(outer, hole)
    const t = ccw(outer)
    for (const [i, j, k] of earcut(t)) roofP.tri([t[i][0], t[i][1], H], [t[j][0], t[j][1], H], [t[k][0], t[k][1], H])
  }
}
prism(precast, roofP, WEST, 0, 3.1 + 9.49)
prism(precast, roofP, SOUTHEAST, 0, 0.2 + 12.36)
prism(precast, roofP, EAST, 0, 10.2)

// ---- The planetarium ---------------------------------------------------------------------
const C: XY = DOME_C, N = 24
const ring = (r: number, z: number, a0 = 0): V3[] => Array.from({ length: N }, (_, i) => {
  const a = a0 + (2 * Math.PI * i) / N
  return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z] as V3
})
/** Loft rings (CCW from above) into a part, outward-facing, smooth. */
function lathe(p: Part, prof: [number, number][], inward = false) {
  for (let k = 0; k + 1 < prof.length; k++) {
    const A = ring(prof[k][0], prof[k][1]), B = ring(prof[k + 1][0], prof[k + 1][1])
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      const q = inward ? [A[i], B[i], B[j], A[j]] : [A[i], A[j], B[j], B[i]]
      p.quad(q[0], q[1], q[2], q[3])
    }
  }
}
const F = 1.5                              // the dome's floor above the lowest ground
// The ground-floor drum: glazed between pale piers.
lathe(concrete, [[13, 0], [13, F]])
lathe(win, [[12.6, F], [12.6, F + 6.0]])
// The tree columns: eight, flaring into the soffit.
for (let i = 0; i < 8; i++) {
  const a = (2 * Math.PI * (i + 0.5)) / 8, ca = Math.cos(a), sa = Math.sin(a)
  const P = (r: number, t: number, z: number): V3 => [C[0] + r * ca - t * sa, C[1] + r * sa + t * ca, z]
  const prof: [number, number, number][] = [[13.6, 0.7, 0], [13.6, 0.7, F + 4.0], [14.4, 1.3, F + 5.4], [15.6, 2.2, F + 6.6]]
  for (let k = 0; k + 1 < prof.length; k++) {
    const [r0, w0, z0] = prof[k], [r1, w1, z1] = prof[k + 1], d0 = 0.7, d1 = 0.7
    const q = (r: number, w: number, d: number, z: number): V3[] => [P(r - d, -w, z), P(r + d, -w, z), P(r + d, w, z), P(r - d, w, z)]
    const A = q(r0, w0, d0, z0), B = q(r1, w1, d1, z1)
    for (let e = 0; e < 4; e++) { const f = (e + 1) % 4; concrete.quad(A[e], A[f], B[f], B[e]) }
  }
}
// The saucer: its soffit rising from the drum to the rim, the rim, its top.
lathe(concrete, [[12.6, F + 6.0], [21, F + 8.6]])
lathe(white, [[21, F + 8.6], [21.2, F + 11.5]])
lathe(white, [[21.2, F + 11.5], [16.5, F + 11.5]])
// The clerestory ring.
lathe(win, [[16.5, F + 11.5], [16.5, F + 14.1]])
// The cone: eave soffit, the concave roof, the neck and the crown.
const cone: [number, number][] = [[18.8, F + 14.1], [14, F + 15.7], [10, F + 17.4], [6.5, F + 19.2], [4.0, F + 20.9], [2.8, F + 22.1], [2.6, F + 23.0], [2.9, F + 23.6], [3.4, F + 24.0], [3.7, F + 24.3]]
lathe(white, [[16.5, F + 14.1], [18.8, F + 14.1]])
lathe(white, cone)
white.cap(ring(3.7, F + 24.3), true)
// Radial ribs: sixteen raised strips down the cone.
for (let i = 0; i < 16; i++) {
  const a = (2 * Math.PI * i) / 16, ca = Math.cos(a), sa = Math.sin(a), w = 0.22
  for (let k = 0; k + 1 < 6; k++) {
    const [r0, z0] = cone[k], [r1, z1] = cone[k + 1]
    const pt = (r: number, z: number, t: number, lift: number): V3 => [C[0] + r * ca - t * sa, C[1] + r * sa + t * ca, z + lift]
    const wa = w * (r0 / 18.8) + 0.08, wb = w * (r1 / 18.8) + 0.08
    white.quad(pt(r0, z0, -wa, 0.12), pt(r0, z0, wa, 0.12), pt(r1, z1, wb, 0.12), pt(r1, z1, -wb, 0.12))
  }
}

const WHITE = { ...finish('planetarium-white', 0xf2f0ea), floodlight: (p: V3, n: V3) => (Math.hypot(p[0] - C[0], p[1] - C[1]) < 19 && p[2] > F + 13 ? 0.7 : 0) }
const parts = [
  { part: white, material: WHITE },
  { part: concrete, material: finish('pale-concrete', 0xddd9cf) },
  { part: precast, material: finish('precast-white', 0xe6e2d8) },
  { part: win, material: PALETTE.window },
  { part: roofP, material: PALETTE.roof },
]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('H. R. MacMillan Space Centre and Museum of Vancouver', parts, { license: 'CC0-1.0', bearing: 0, elevation: 0 })
await Bun.write(new URL('../models/van-space-centre.glb', import.meta.url), glb)
console.log(`van-space-centre.glb: ${tris} triangles, ${glb.length} bytes`)
