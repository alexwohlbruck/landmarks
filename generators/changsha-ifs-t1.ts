/**
 * Changsha IFS Tower T1 (with T2 and the IFS podium), Furong, Changsha —
 * original procedural geometry, CC0-1.0.
 * bun generators/changsha-ifs-t1.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (the OSM outlines are drawn square to north). Origin = the
 * centroid of T1's outline way/527545453 (112.9735231 E, 28.1953571 N), on
 * the ground; y = 0 is the street; elevation 0.
 *
 * Why T2 and the podium are here: OSM maps T1 (way/527545453) and T2
 * (way/527545451) as outlines lying wholly inside the IFS podium outline
 * way/527545435 (长沙IFS, building=retail, 60 m, 10 levels), inside the one
 * landuse 长沙IFS国金中心 (way/527545440): one complex on one podium, so the
 * model draws all three and replaces all three.
 *
 * Form, as read from OSM and the photos:
 * - T1: a 59 x 45 m slab-like box with notched (re-entrant) corners, rising
 *   straight to ~378 m, then stepping in three times (378, 411, 439 m) to a
 *   crenellated open crown frame at 452.1 m (four slots in the long faces,
 *   three in the short ones), over a roof at ~441 m;
 * - dark louvred mechanical panels in the middle of each face at the
 *   plant floors (~70, 137, 204, 271, 334, 396 m), about 55 % of the face wide;
 * - T2: 54 x 44 m, the same language, its corners stepping in at ~255, 280 and
 *   300 m to a flat top at 315 m;
 * - shallow vertical fins in the glass (every ~11 m in the low model, ~3 m in
 *   the detail LOD, which adds spandrel lines every 2 floors) and a silver lip
 *   at the foot of each setback;
 * - the towers are drawn from the podium roof up (their lower floors are
 *   inside it);
 * - the podium: OSM's outline extruded to its tagged 60 m, light panels with
 *   glazed bands, its roof a garden.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): T1 way/527545453 (building=office,
 *   height 452, 93 levels, name "Changsha IFS Tower T1"); T2 way/527545451
 *   (height 315, 65 levels, "Changsha IFS Tower T2"); podium way/527545435
 *   (height 60, 10 levels). Wikidata Q5410187 "Changsha IFS" (452.1 m,
 *   coordinates on T1; it carries no OSM link) and Q29837575 for T2.
 * - Published: T1 452.1 m, 94 floors; T2 315 m (CTBUH; Wikipedia "Changsha IFS").
 * - Photos (Wikimedia Commons, daylight unless noted):
 *   "Changsha IFS Tower 24 August 2023c.jpg", Huangdan2060, CC0: T1 and T2
 *   from the south-west, the louvre panels and the crown;
 *   https://commons.wikimedia.org/wiki/File:Changsha_IFS_Tower_24_August_2023c.jpg
 *   "Changsha IFS 20250401E.jpg", Huangdan2060, CC BY 4.0, camera 260 m
 *   south-east (Commons camera location), dusk: both crowns, the notched
 *   corners and T2's stepped corners;
 *   https://commons.wikimedia.org/wiki/File:Changsha_IFS_20250401E.jpg
 *   "Changsha IFS 20250401B.jpg", Huangdan2060, CC BY 4.0, camera 790 m
 *   east-south-east, dusk: the two towers' heights and spacing;
 *   https://commons.wikimedia.org/wiki/File:Changsha_IFS_20250401B.jpg
 *   "长沙IFS国金中心.jpg", 維基小霸王, CC BY-SA 4.0: T1 from a height, the
 *   setbacks and crown slots (measured), glass colour;
 *   https://commons.wikimedia.org/wiki/File:%E9%95%BF%E6%B2%99IFS%E5%9B%BD%E9%87%91%E4%B8%AD%E5%BF%83.jpg
 *   "Changsha IFS Tower 18 September 2023b.jpg", Huangdan2060, CC0: T1 from the
 *   street, colour; "Changsha IFS 10971-Changsha (48549538781).jpg",
 *   xiquinhosilva, CC BY 2.0, at night: the lit facade.
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 452.1 m (T1), 315 m (T2). OSM: footprints; podium 60 m.
 * - Measured (photo 維基小霸王, scaled to 452.1 m): setbacks at ~378, 411 and
 *   439 m; louvre panels at ~70 m spacing.
 * - Estimated: corner notches 3 m (T1) and 2.5 m (T2), the setbacks 2–3 m per
 *   step, T2's steps from the dusk photo; colours sampled from the Huangdan2060
 *   CC0 and 維基小霸王 photos (#688595–#7495a5 glass, pulled to #6b8ca0; louvres
 *   #263a3a–#85a79a, drawn #4f5c63).
 *
 * Doubts
 * - The podium's 60 m is OSM's tag; the photos show it lower at the street
 *   edges (stepped terraces are not modelled).
 * - T2's crown steps are read from one dusk photo.
 * - The rooftop garden and its sculptures are drawn only as a green roof.
 *
 * Night: the curtain walls glow as windows (the real towers also carry an LED
 * dot grid, not modelled); the crown frame is floodlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, prism, saveLods, type Layer } from './auckland-sky-tower'
import { capRing, ccwXY, type XY } from './wuhan-greenland-center'

const T1_TOP = 452.1
const T2_TOP = 315
const POD_H = 60
const PODIUM: XY[] = [[147.1, 110.7], [146.5, -25.0], [25.8, -27.0], [-31.0, -28.0], [-31.1, -23.0], [-35.7, -23.1], [-35.4, 0.5], [-43.1, 0.5], [-43.2, -11.0], [-54.5, -10.7], [-54.4, -1.5], [-64.7, -1.2], [-63.8, 19.6], [-115.8, 20.6], [-116.8, 16.8], [-155.3, 17.1], [-163.6, -20.6], [-172.9, -19.4], [-169.8, -3.4], [-178.6, -3.8], [-178.9, -8.4], [-224.0, -6.8], [-224.3, 0.3], [-228.5, 112.4], [-176.7, 125.6], [-172.9, 118.4], [-170.4, 121.0], [-165.5, 122.0], [-161.2, 121.4], [-158.8, 119.1], [-155.2, 108.8], [-143.6, 109.5], [-139.3, 134.2], [-124.9, 131.6], [-127.4, 117.0], [-39.1, 118.2], [-32.9, 118.7], [-29.5, 121.8], [-27.0, 128.1], [-26.5, 135.5], [-24.8, 142.7], [-21.2, 150.0], [-14.9, 154.4], [-7.9, 157.5], [0.1, 158.7], [8.6, 156.6], [16.9, 150.8], [26.9, 142.7], [43.6, 133.8], [60.4, 128.2], [81.2, 126.6], [122.6, 126.4], [122.7, 110.6]]
// T1 and T2 rectangles from OSM (centre, half-sizes); the anchor's centroid differs from T1's
// rectangle centre by under 0.1 m
const T1C: XY = [0, 0], T1H: XY = [29.6, 22.6]
const T2C: XY = [114.75, 82.7], T2H: XY = [27.1, 22.05]

/** a rectangle with re-entrant corner notches n (12 points, CCW) */
function notched(c: XY, hx: number, hy: number, n: number): XY[] {
  const p: XY[] = [[hx, -hy + n], [hx, hy - n], [hx - n, hy - n], [hx - n, hy], [-hx + n, hy], [-hx + n, hy - n], [-hx, hy - n], [-hx, -hy + n], [-hx + n, -hy + n], [-hx + n, -hy], [hx - n, -hy], [hx - n, -hy + n]]
  return p.map(([x, y]) => [c[0] + x, c[1] + y] as XY)
}

type Set = { glass: Part; louvre: Part; frame: Part; roof: Part; podium: Part; garden: Part }
const mk = (): Set => ({ glass: new Part(), louvre: new Part(), frame: new Part(), roof: new Part(), podium: new Part(), garden: new Part() })

/** walls of a CCW ring from z0 to z1 (flat faces), with its roof (or skipped) */
function tier(s: Set, ring: XY[], z0: number, z1: number, roof: Part | null, wall: (a: XY, b: XY) => Part) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    face(wall(a, b), [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], n)
  }
  if (roof) capRing(roof, ring.map((p) => [p[0], p[1], z1] as V3), true)
  void s
}

/** a dark louvre panel centred on a wall a→b, w fraction of its width, from z0 to z1, 0.06 proud */
function louvre(p: Part, a: XY, b: XY, w: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
  const u = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t + n[0] * 0.06, a[1] + (b[1] - a[1]) * t + n[1] * 0.06, z]
  const t0 = 0.5 - w / 2, t1 = 0.5 + w / 2
  face(p, [u(t0, z0), u(t1, z0), u(t1, z1), u(t0, z1)], [n[0], n[1], 0])
}

/** a sill ledge under a louvre: w of the wall, d proud, 0.4 thick */
function sill(p: Part, a: XY, b: XY, w: number, z: number, d: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const u = (q: number, zz: number, o: number): V3 => [a[0] + (b[0] - a[0]) * q + n[0] * o, a[1] + (b[1] - a[1]) * q + n[1] * o, zz]
  const q0 = 0.5 - w / 2, q1 = 0.5 + w / 2
  face(p, [u(q0, z, d), u(q1, z, d), u(q1, z + 0.4, d), u(q0, z + 0.4, d)], [n[0], n[1], 0])
  face(p, [u(q0, z + 0.4, 0), u(q0, z + 0.4, d), u(q1, z + 0.4, d), u(q1, z + 0.4, 0)], [0, 0, 1])
  face(p, [u(q0, z, 0), u(q0, z, d), u(q0, z + 0.4, d), u(q0, z + 0.4, 0)], [-t[0], -t[1], 0])
  face(p, [u(q1, z, d), u(q1, z, 0), u(q1, z + 0.4, 0), u(q1, z + 0.4, d)], [t[0], t[1], 0])
}

/** a proud lip (d out, h tall) round a CCW ring at z */
function lip(p: Part, ring: XY[], z: number, d: number, h: number) {
  const n = ring.length
  const off = ring.map((_, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[i], c = ring[(i + 1) % n]
    const n1: XY = [(b[1] - a[1]), -(b[0] - a[0])], n2: XY = [(c[1] - b[1]), -(c[0] - b[0])]
    const l1 = Math.hypot(...n1), l2 = Math.hypot(...n2)
    const m: XY = [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2], dot = (m[0] * n1[0]) / l1 + (m[1] * n1[1]) / l1
    return [b[0] + (m[0] / dot) * d, b[1] + (m[1] / dot) * d] as XY
  })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, A = off[i], B = off[j]
    const nn: V3 = [B[1] - A[1], -(B[0] - A[0]), 0]
    face(p, [[A[0], A[1], z], [B[0], B[1], z], [B[0], B[1], z + h], [A[0], A[1], z + h]], nn)
    face(p, [[ring[i][0], ring[i][1], z + h], [A[0], A[1], z + h], [B[0], B[1], z + h], [ring[j][0], ring[j][1], z + h]], [0, 0, 1])
  }
}

/** the long walls of a notched ring: the four faces between notches (indices 0,4,6,10 of the 12) */
const mainWalls = (r: XY[]): [XY, XY][] => [[r[0], r[1]], [r[3], r[4]], [r[6], r[7]], [r[9], r[10]]]

function tower(s: Set, d: boolean, c: XY, h: XY, steps: { z: number; inset: [number, number]; notch: number }[], top: number, louvres: number[], crown: { z: number; slots: [number, number] } | null) {
  let z0 = POD_H // the towers rise out of the podium: nothing is drawn inside it
  const glass = () => s.glass
  for (let k = 0; k < steps.length; k++) {
    const st = steps[k], z1 = k + 1 < steps.length ? steps[k + 1].z : crown ? crown.z : top
    const ring = notched(c, h[0] - st.inset[0], h[1] - st.inset[1], st.notch)
    tier(s, ring, z0, z1, s.roof, (a, b) => (Math.hypot(b[0] - a[0], b[1] - a[1]) < st.notch + 0.01 ? s.louvre : s.glass))
    // a silver lip round the foot of each setback tier
    if (k > 0) lip(s.frame, ring, z0, 0.5, 0.6)
    for (const zl of louvres) if (zl > z0 + 4 && zl < z1 - 4) for (const [a, b] of mainWalls(ring)) {
      louvre(s.louvre, a, b, 0.55, zl - 3, zl - 0.6); louvre(s.louvre, a, b, 0.55, zl + 0.6, zl + 3)
      sill(s.frame, a, b, 0.57, zl - 3.4, 0.45)
    }
    {
      for (const [a, b] of mainWalls(ring)) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L], t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
        const nf = Math.round(L / (d ? 3 : 11))
        for (let f = 1; f < nf; f++) {
          const q = f / nf
          const c: XY = [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q]
          const P = (o: number, w: number, z: number): V3 => [c[0] + n[0] * o + t[0] * w, c[1] + n[1] * o + t[1] * w, z]
          const za = z0 + 0.3, zb = z1 - 0.3
          const fo = d ? 0.4 : 0.5, fw = d ? 0.2 : 0.3
          face(s.glass, [P(fo, -fw, za), P(fo, fw, za), P(fo, fw, zb), P(fo, -fw, zb)], [n[0], n[1], 0])
          face(s.glass, [P(0, -fw, za), P(fo, -fw, za), P(fo, -fw, zb), P(0, -fw, zb)], [-t[0], -t[1], 0])
          face(s.glass, [P(fo, fw, za), P(0, fw, za), P(0, fw, zb), P(fo, fw, zb)], [t[0], t[1], 0])
          face(s.glass, [P(0, -fw, zb), P(fo, -fw, zb), P(fo, fw, zb), P(0, fw, zb)], [0, 0, 1])
        }
      }
      // detail: spandrel lines every 2 floors
      for (let i = 0; i < 12 && d; i += 1) {
        const a = ring[i], b = ring[(i + 1) % 12]
        const L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (L < 6) continue
        const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
        for (let z = z0 + 9; z < z1 - 3; z += 9) {
          if (louvres.some((zl) => Math.abs(zl - z) < 5)) continue
          const u = (t: number, zz: number, o: number): V3 => [a[0] + (b[0] - a[0]) * t + n[0] * o, a[1] + (b[1] - a[1]) * t + n[1] * o, zz]
          face(s.frame, [u(0, z, 0.35), u(1, z, 0.35), u(1, z + 0.45, 0.35), u(0, z + 0.45, 0.35)], [n[0], n[1], 0])
          face(s.frame, [u(0, z + 0.45, 0), u(0, z + 0.45, 0.35), u(1, z + 0.45, 0.35), u(1, z + 0.45, 0)], [0, 0, 1])
        }
      }
    }
    z0 = z1
  }
  if (crown) {
    // the open crown frame: a parapet wall round the last tier, cut by slots, over a roof 2 m in
    const last = steps[steps.length - 1]
    const ring = notched(c, h[0] - last.inset[0] - 1.2, h[1] - last.inset[1] - 1.2, last.notch + 0.5)
    const inner = notched(c, h[0] - last.inset[0] - 2.2, h[1] - last.inset[1] - 2.2, last.notch + 0.5)
    capRing(s.roof, inner.map((p) => [p[0], p[1], crown.z + 2] as V3), true)
    for (let i = 0; i < 12; i++) {
      const a = ring[i], b = ring[(i + 1) % 12], ai = inner[i], bi = inner[(i + 1) % 12]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
      const long = L > 20
      const ns = L < 6 ? 0 : long ? crown.slots[0] : crown.slots[1]
      // segments between slots (slot 1.6 m wide, from crown.z + 4 to the top)
      const cuts: [number, number][] = []
      for (let q = 1; q <= ns; q++) { const t = q / (ns + 1), hw = 0.8 / L; cuts.push([t - hw, t + hw]) }
      const P = (t: number, z: number, inn = false): V3 => { const A = inn ? ai : a, B = inn ? bi : b; return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z] }
      const zb = crown.z + 4
      // the solid band under the slots
      face(s.frame, [P(0, crown.z), P(1, crown.z), P(1, zb), P(0, zb)], [n[0], n[1], 0])
      face(s.frame, [P(1, crown.z, true), P(0, crown.z, true), P(0, top, true), P(1, top, true)], [-n[0], -n[1], 0])
      let t0 = 0
      for (const [ca, cb] of [...cuts, [1, 1] as [number, number]]) {
        face(s.frame, [P(t0, zb), P(ca, zb), P(ca, top), P(t0, top)], [n[0], n[1], 0])
        face(s.frame, [P(t0, top), P(ca, top), P(ca, top, true), P(t0, top, true)], [0, 0, 1])
        if (cb < 1) {
          // slot jambs and sill
          face(s.frame, [P(ca, zb), P(ca, zb, true), P(ca, top, true), P(ca, top)], [-(b[0] - a[0]) / L, -(b[1] - a[1]) / L, 0])
          face(s.frame, [P(cb, zb, true), P(cb, zb), P(cb, top), P(cb, top, true)], [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0])
          face(s.frame, [P(ca, zb), P(cb, zb), P(cb, zb, true), P(ca, zb, true)], [0, 0, 1])
        }
        t0 = cb
      }
    }
  }
}

function build(s: Set, d: boolean) {
  // T1: straight to 378, then three steps, the crown frame from 441 to the top
  tower(s, d, T1C, T1H, [
    { z: 0, inset: [0, 0], notch: 3 },
    { z: 378, inset: [1.5, 2.5], notch: 3.5 },
    { z: 411, inset: [3.5, 4.5], notch: 4 },
    { z: 439, inset: [5, 6], notch: 4.5 },
  ], T1_TOP, [70, 137, 204, 271, 334, 396, 425], { z: 441, slots: [4, 3] })
  // T2
  tower(s, d, T2C, T2H, [
    { z: 0, inset: [0, 0], notch: 2.5 },
    { z: 255, inset: [1.5, 1.5], notch: 4 },
    { z: 280, inset: [3, 3], notch: 5.5 },
    { z: 300, inset: [4.5, 4.5], notch: 7 },
  ], T2_TOP, [70, 137, 204, 268], null)

  // the podium: walls in panels, two glazed bands, a garden roof
  const pod = ccwXY(PODIUM)
  prism(s.podium, pod, 0, POD_H, { top: false })
  capRing(s.garden, pod.map((p) => [p[0], p[1], POD_H] as V3), true)
  for (let i = 0; i < pod.length; i++) {
    const a = pod[i], b = pod[(i + 1) % pod.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 8) continue
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const u = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t + n[0] * 0.05, a[1] + (b[1] - a[1]) * t + n[1] * 0.05, z]
    const m = 2 / L
    for (const [z0, z1] of [[1.5, 9], [24, 30], [42, 48]]) face(s.glass, [u(m, z0), u(1 - m, z0), u(1 - m, z1), u(m, z1)], [n[0], n[1], 0])
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x6b8ca0 }
const LOUVRE: MaterialSpec = finish('ifs-louvre', 0x4f5c63, 0.7)
const FRAME: MaterialSpec = { ...finish('ifs-silver', 0xc9d3d8, 0.45), floodlight: (p) => (p[2] > 430 ? 0.85 : 0.1) }
const ROOFM: MaterialSpec = PALETTE.roof
const PODM: MaterialSpec = finish('ifs-podium', 0xd9dad6)
const GARDEN: MaterialSpec = finish('ifs-roof-garden', 0xa7b596)

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.louvre, material: LOUVRE },
  { part: s.frame, material: FRAME },
  { part: s.roof, material: ROOFM },
  { part: s.podium, material: PODM },
  { part: s.garden, material: GARDEN },
]

if (import.meta.main) {
  await saveLods('changsha-ifs-t1', 'Changsha IFS Tower T1', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, bearing 0; origin at the centroid of the T1 outline, on the street',
    bearing: 0, height: T1_TOP,
  }, 5000)
}
