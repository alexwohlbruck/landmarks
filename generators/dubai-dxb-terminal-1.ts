/**
 * Dubai International Airport (DXB), Terminal 1 and Concourse C:
 * procedural, CC0-1.0, no textures.
 *
 *   bun generators/dubai-dxb-terminal-1.ts
 *
 * Writes two models, one per freestanding building, each a low .glb and a
 * .detail.glb:
 * - models/dubai-dxb-terminal-1 (detail: the arcade's arch heads and the
 *   canopy tube drawn finer);
 * - models/dubai-dxb-concourse-c (detail: a smoother barrel roof and the
 *   jet bridges OSM maps).
 * Built with the kit in dubai-dxb-terminal-3.ts.
 *
 * Two OSM buildings 300 m apart, joined only underground by a 300 m tunnel
 * with travelators (Wikipedia), so each is its own model:
 * - Terminal 1 (way/98425196): the landside terminal of 1971, rebuilt
 *   inside and out since, 650 m by 100-125 m, flat-roofed at 19 m. Its
 *   kerb front (south-west) is the arcade people know: a white frame
 *   standing 1.6 m proud of the glass, cut into full-height pointed arches,
 *   its thin piers rising from the ground and flaring at the springing into
 *   the arch heads ("stylized palm trees", Wikipedia, on the 1971
 *   building); dark glass fills each arch down to the kerb canopy, whose
 *   front is a big round silver tube; a glazed ground floor below.
 *   [dubai-dxb-terminal-1]
 * - Concourse C (way/10315513; the Sheikh Rashid Terminal, 2000), 792 m by
 *   62-72 m: dark glass walls in white frames to 18 m under one long, low
 *   silver barrel roof rising to 28 m, rounded down at both ends (the
 *   radiating roof lines over its north-west end in MoHasanie's 2009 photo
 *   are the "palm-frond" look), with teal glass gate modules.
 *   [dubai-dxb-concourse-c]
 * Concourse D, 600 m further north-west and linked by people mover, is its
 * own model (dubai-dxb-concourse-d).
 *
 * Frame: x along the buildings (to bearing 121.5 deg, south-east), y to the
 * north-east, z up, metres; both models placed at bearing 31.5. The rings
 * are in one site frame whose origin is the area centroid of way/98425196;
 * each model is moved onto its own anchor:
 * - dubai-dxb-terminal-1: the area centroid of way/98425196, lng 55.352952,
 *   lat 25.2491766 (site frame 0, 0).
 * - dubai-dxb-concourse-c: the area centroid of way/10315513, lng
 *   55.3539753, lat 25.2526651 (site frame -113.69, 382.73).
 * The site is flat (Mapterhorn z12: 4.6-6.1 m).
 *
 * Numbers
 * - Footprints: OSM ways above (ODbL), fetched 2026-11.
 * - Concourse C length 800 m: published (Wikipedia); OSM 792 m.
 * - Concourse C walls 18 m, crest 28 m: estimated from Simon_sees' 2022
 *   photo, scaled by the 87 m control tower beside it.
 * - Terminal 1 19 m; arcade bays 11.5 m (56 along the kerb face, the arch
 *   about as wide as it is tall above the canopy in Sergey Vladimirov's
 *   photo), piers 1.2 m, springing at 9.8 m, apex at 17.8 m; canopy at
 *   6 m with a 2 m round tube 4.6 m out: estimated from that photo (cars
 *   and doors for scale).
 * - Gate modules: at the paired vertices OSM's outline has at each gate,
 *   13 x 8 m, 15 m tall: estimated.
 *
 * Sources (evidence); [T1] = Terminal 1, [C] = Concourse C, [both]
 * - OSM way 98425196 [T1]; way 10315513 and the aeroway=jet_bridge ways
 *   on it [C].
 * - Wikipedia, "Dubai International Airport" (Terminal 1 history and the
 *   1971 columns; Concourse C length and tunnel) [both].
 * - "Dubai International Airport", Sergey Vladimirov, CC BY 2.0, 2007
 *   (Terminal 1's kerb arcade) [T1]:
 *   https://www.flickr.com/photos/65783662@N00/2187618962
 * - "DXB T1.jpg", Vitorabdala, CC BY-SA 4.0, 2021 (the arcade heads at night) [T1]:
 *   https://commons.wikimedia.org/wiki/File:DXB_T1.jpg
 * - "Dubai Airport Trip 2009 215.jpg", MoHasanie, CC BY 3.0 (C's roof and
 *   north-west end) [C]: https://commons.wikimedia.org/wiki/File:Dubai_Airport_Trip_2009_215.jpg
 * - "Dubai Airport Control Tower", Simon_sees, CC BY 2.0, 2022 (C's barrel
 *   roof and glass walls beside the tower) [C]:
 *   https://www.flickr.com/photos/39551170@N02/52060264803
 * - "Dubai Airport overview.jpg", Umair Shaikh, CC BY-SA 2.0, and
 *   "ISS-65 Dubai International Airport and Dubai Creek (cropped).jpg",
 *   NASA, public domain (plans and roofs) [both]:
 *   https://commons.wikimedia.org/wiki/File:Dubai_Airport_overview.jpg
 *   https://commons.wikimedia.org/wiki/File:ISS-65_Dubai_International_Airport_and_Dubai_Creek_(cropped).jpg
 *
 * Look-only: Elmar Bajora's "Dubai Terminal No.1" and Arne Bevaart's
 * "Dubai Airport Departures Terminal 1" (Flickr, NC/ND) [T1].
 *
 * Doubts
 * - No licensed photo shows Terminal 1's airside or roof up close; drawn
 *   plain. The arcade photo is from 2007, before the 2013-15 renovation;
 *   the 2021 night photo shows the same arch heads.
 * - Concourse C's heights are scaled from one photo.
 * - Whether the arcade runs the whole 650 m kerb face: the photo shows a
 *   long run of it; drawn along the whole face. The bay count is an
 *   estimate, not counted.
 */
import { Part, type V3 } from './mesh'
import { cap, clean, panels, triangulate, walls, type XY } from './clt-terminal'
import { finish } from './palette'
import { DXB, gateModules, jetBridges, oquad, otri, recentre, vaultConcourse, writeModel } from './dubai-dxb-terminal-3'

const BEARING = 31.5
/** The rings below are in one site frame (origin: the area centroid of way/98425196); each model is moved onto its own anchor. */
const T1_MODEL = { id: 'dubai-dxb-terminal-1', name: 'Dubai International Airport Terminal 1', origin: [0, 0] as XY }
const CONCOURSE_C = { id: 'dubai-dxb-concourse-c', name: 'Dubai International Airport Concourse C', origin: [-113.69, 382.73] as XY }

const T1: XY[] = [[-128.75, 46.12], [26.42, 46.49], [26.41, 43.31], [249.81, 43.86], [249.83, 48.05], [315.36, 48.21], [315.35, 43.76], [335.96, 43.81], [335.63, -49.59], [193.05, -49.95], [168.59, -50.0], [135.94, -50.08], [90.93, -50.2], [64.8, -50.26], [44.98, -50.31], [16.47, -49.97], [-30.74, -50.09], [-54.46, -50.55], [-131.99, -50.75], [-175.78, -50.85], [-285.76, -54.01], [-309.2, -54.69], [-312.38, -54.78], [-314.96, 45.49], [-242.29, 45.84], [-242.17, 72.0], [-194.12, 71.32], [-129.05, 69.47], [-129.01, 64.58]]
/** OSM's jet bridges on Concourse C (aeroway=jet_bridge), building end first. */
const BRIDGES: XY[][] = [[[-406.1, 350.3], [-406.7, 345.1], [-395.5, 327.5], [-395.9, 324.5], [-375.4, 323.8]], [[-336.2, 349.3], [-324.1, 326.6], [-324.0, 323.1], [-295.4, 323.7]], [[-275.3, 348.3], [-261.1, 325.7], [-256.4, 319.3], [-250.3, 319.0], [-223.8, 315.7]], [[-213.9, 417.6], [-215.4, 437.7], [-199.5, 446.0], [-215.8, 453.6]], [[-182.4, 347.0], [-166.7, 328.4], [-166.7, 325.2], [-144.2, 320.3]], [[-142.6, 417.6], [-111.1, 441.1], [-110.9, 447.9]], [[-83.7, 346.1], [-77.7, 326.2], [-55.4, 321.7]], [[-14.3, 347.9], [-15.4, 322.6], [2.7, 323.5], [27.0, 320.9]], [[9.7, 417.5], [2.8, 432.1], [3.3, 436.8], [-24.0, 446.1]], [[28.4, 348.8], [62.6, 324.8], [108.8, 324.3], [135.5, 323.2]], [[72.7, 417.1], [72.6, 439.4], [66.3, 448.1]], [[164.9, 352.5], [165.9, 346.6], [191.1, 329.2], [191.2, 324.7], [216.0, 322.0]], [[167.3, 414.3], [163.4, 444.3]], [[207.8, 413.3], [246.3, 435.4], [247.4, 443.0]], [[283.1, 355.6], [285.2, 326.5], [302.9, 318.2]], [[286.2, 409.7], [287.2, 412.6], [308.2, 433.4]]]
const C: XY[] = [[286.87, 355.29], [283.12, 355.61], [281.36, 355.59], [272.9, 355.4], [165.84, 352.52], [164.93, 352.52], [28.43, 348.79], [27.16, 348.79], [15.17, 348.61], [-14.33, 347.9], [-15.43, 347.9], [-81.91, 346.09], [-83.73, 346.09], [-108.36, 345.58], [-131.93, 346.17], [-180.86, 347.03], [-182.37, 347.03], [-225.13, 347.63], [-273.43, 348.27], [-275.32, 348.26], [-335.61, 349.28], [-336.18, 349.28], [-406.09, 350.35], [-408.26, 350.34], [-438.89, 351.16], [-440.94, 351.14], [-496.41, 353.19], [-498.52, 353.19], [-504.88, 353.41], [-505.43, 402.78], [-505.43, 403.42], [-505.34, 414.04], [-501.94, 413.86], [-499.57, 413.85], [-438.1, 414.41], [-436.84, 414.4], [-373.85, 414.51], [-372.92, 414.51], [-287.05, 416.5], [-286.13, 416.5], [-224.45, 417.64], [-215.41, 417.59], [-213.89, 417.59], [-145.03, 417.65], [-142.6, 417.64], [-84.28, 417.61], [8.03, 417.52], [9.71, 417.51], [13.98, 417.49], [72.15, 417.14], [72.73, 417.13], [167.28, 414.28], [168.11, 414.28], [207.76, 413.32], [209.71, 413.3], [284.06, 409.77], [286.22, 409.65], [286.94, 409.83]]

/** Points of a two-centred pointed arch over [x0, x1], springing at zs and rising `rise`: left springing → apex → right springing. */
function archHead(x0: number, x1: number, zs: number, rise: number, seg: number): XY[] {
  const w = x1 - x0, R = (w * w / 4 + rise * rise) / w, aMax = Math.asin(Math.min(1, rise / R))
  const out: XY[] = []
  for (let i = 0; i <= seg; i++) { const t = (aMax * i) / seg; out.push([x0 + R - R * Math.cos(t), zs + R * Math.sin(t)]) }
  for (let i = seg - 1; i >= 0; i--) { const t = (aMax * i) / seg; out.push([x1 - R + R * Math.cos(t), zs + R * Math.sin(t)]) }
  return out
}

/**
 * Terminal 1's kerb front along a→b (the wall faces right of travel): a white
 * frame standing `D` proud of the glass, cut into full-height pointed arches,
 * so its piers rise thin from the ground and flare at the springing into the
 * arch heads; the glass in each arch down to the canopy and a glazed ground
 * floor; the kerb canopy with its big round silver tube along the front.
 */
function kerbArcade(P: { white: Part; glass: Part; silver: Part }, a: XY, b: XY, o: { H: number; bay: number; pier: number; zs: number; rise: number; zc: number; D: number; seg: number; tubeSeg: number }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const Q = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  const out: V3 = [n[0], n[1], 0]
  const nb = Math.max(1, Math.round(L / o.bay)), bw = L / nb
  const heads = Array.from({ length: nb }, (_, j) => archHead(j * bw + o.pier / 2, (j + 1) * bw - o.pier / 2, o.zs, o.rise, o.seg))
  const apexIdx = o.seg
  // the piers: CCW polygons in (s, z)
  for (let k = 0; k <= nb; k++) {
    const sk = k * bw
    const L0 = Math.max(0, sk - o.pier / 2), R0 = Math.min(L, sk + o.pier / 2)
    const poly: XY[] = [[L0, 0], [R0, 0]]
    if (k < nb) { const h = heads[k]; poly.push([R0, o.zs], ...h.slice(1, apexIdx + 1), [h[apexIdx][0], o.H]) }
    else poly.push([R0, o.H])
    if (k > 0) { const h = heads[k - 1]; poly.push([h[apexIdx][0], o.H], ...h.slice(apexIdx, 2 * o.seg)) ; poly.push([L0, o.zs]) }
    else poly.push([L0, o.H])
    for (const [i, j, m] of triangulate(poly)) otri(P.white, Q(poly[i][0], poly[i][1], o.D), Q(poly[j][0], poly[j][1], o.D), Q(poly[m][0], poly[m][1], o.D), out)
    // reveals on every edge but the bottom and the top
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length]
      if ((p[1] === 0 && q[1] === 0) || (p[1] === o.H && q[1] === o.H)) continue
      const ds = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(ds, dz) || 1
      const os = dz / l, oz = -ds / l
      oquad(P.white, Q(p[0], p[1], 0), Q(q[0], q[1], 0), Q(q[0], q[1], o.D), Q(p[0], p[1], o.D), [u[0] * os, u[1] * os, oz])
    }
  }
  // the top of the frame
  oquad(P.white, Q(0, o.H, 0), Q(L, o.H, 0), Q(L, o.H, o.D), Q(0, o.H, o.D), [0, 0, 1])
  // glass: each arch from the canopy up, and the ground floor between the piers
  for (let j = 0; j < nb; j++) {
    const h = heads[j], x0 = h[0][0], x1 = h.at(-1)![0]
    const ring: XY[] = [[x0, o.zc + 0.4], [x1, o.zc + 0.4], ...h.slice().reverse()]
    const c = Q((x0 + x1) / 2, o.zc + 0.4, 0.05)
    for (let i = 1; i < ring.length - 1; i++) otri(P.glass, c, Q(ring[i][0], ring[i][1], 0.05), Q(ring[i + 1][0], ring[i + 1][1], 0.05), out)
    oquad(P.glass, Q(x0, 0.3, 0.05), Q(x1, 0.3, 0.05), Q(x1, o.zc - 0.9, 0.05), Q(x0, o.zc - 0.9, 0.05), out)
  }
  // the canopy: a shallow slab out to a big round tube
  const T = 4.6, rT = 1.0, zT = o.zc - 0.2
  oquad(P.silver, Q(0, zT + 0.35, o.D), Q(L, zT + 0.35, o.D), Q(L, zT + 0.35, T), Q(0, zT + 0.35, T), [0, 0, 1])
  oquad(P.silver, Q(0, zT - 0.35, o.D), Q(L, zT - 0.35, o.D), Q(L, zT - 0.35, T), Q(0, zT - 0.35, T), [0, 0, -1])
  const ts = o.tubeSeg
  const ring = (s: number) => Array.from({ length: ts }, (_, i) => { const t = (i / ts) * 2 * Math.PI; return Q(s, zT + rT * Math.sin(t), T + rT * Math.cos(t)) })
  const nrm = Array.from({ length: ts }, (_, i) => { const t = (i / ts) * 2 * Math.PI; return [n[0] * Math.cos(t), n[1] * Math.cos(t), Math.sin(t)] as V3 })
  const r0 = ring(0), r1 = ring(L)
  for (let i = 0; i < ts; i++) {
    const j = (i + 1) % ts
    P.silver.tri(r0[i], r1[i], r1[j], undefined, undefined, undefined, [nrm[i], nrm[i], nrm[j]])
    P.silver.tri(r0[i], r1[j], r0[j], undefined, undefined, undefined, [nrm[i], nrm[j], nrm[j]])
  }
  for (let i = 1; i < ts - 1; i++) { otri(P.silver, r0[0], r0[i], r0[i + 1], [-u[0], -u[1], 0]); otri(P.silver, r1[0], r1[i], r1[i + 1], [u[0], u[1], 0]) }
  return nb
}

/** Terminal 1: white block, flat roof, the kerb arcade on the south-west face. */
function buildT1(detail: boolean) {
  const silver = new Part(), white = new Part(), win = new Part(), roof = new Part()
  let bays = 0
  const r = clean(T1, 0.4)
  const H = 19
  walls(white, r, 0, H)
  cap(roof, r, H)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const kerb = b[0] > a[0] && Math.abs(b[1] - a[1]) < 8 && a[1] < 0 // south-west face (the ring runs +x along it)
    if (kerb && L > 12) {
      bays += kerbArcade({ white, glass: win, silver }, a, b, { H, bay: 11.5, pier: 1.2, zs: 9.8, rise: 8.0, zc: 6.2, D: 1.6, seg: detail ? 6 : 3, tubeSeg: detail ? 14 : 8 })
    } else if (L > 12) {
      panels(win, [a, b], 3, 6.5, { bay: 14, gap: 1.6, minLen: 12, keep: (p, q) => p === a && q === b })
      panels(win, [a, b], 9.5, 15, { bay: 14, gap: 1.6, minLen: 12, keep: (p, q) => p === a && q === b })
    }
  }
  if (!detail) console.log(`terminal 1 kerb front: ${bays} bays`)
  return recentre([
    { part: silver, material: DXB.silver },
    { part: white, material: finish('dxb-white', 0xeceeee) },
    { part: win, material: DXB.window },
    { part: roof, material: DXB.roof },
  ], T1_MODEL.origin)
}

/** Concourse C: glass walls under a low silver barrel, rounded ends. */
function buildC(detail: boolean) {
  const silver = new Part(), teal = new Part(), win = new Part(), trim = new Part(), roof = new Part()
  vaultConcourse({ metal: silver, glass: silver, podium: trim, podiumWin: win, roof, trim }, C, {
    z0: 18, H: 28, bay: 60, rows: detail ? 10 : 6, tipRow: 0, endLen: 30, n: 2, foot: 0.3, endCols: detail ? 6 : 4,
    endGlassRows: 0, fins: false, podiumBands: [[1.8, 7.6], [9.6, 16.6]], podiumBay: 24,
  })
  gateModules({ glass: teal, trim }, C, { endClear: 26, along: 12, out: 7, h: 15 })
  if (detail) jetBridges({ body: trim, glass: win }, BRIDGES)
  return recentre([
    { part: silver, material: DXB.silver },
    { part: teal, material: DXB.teal },
    { part: win, material: DXB.window },
    { part: trim, material: DXB.trim },
    { part: roof, material: DXB.roof },
  ], CONCOURSE_C.origin)
}

if (import.meta.main) {
  for (const M of [T1_MODEL, CONCOURSE_C]) {
    const build = M === T1_MODEL ? buildT1 : buildC
    const extras = { bearing: BEARING, elevation: 0 }
    await writeModel(`${M.id}.glb`, M.name, build(false), extras, 8000, 250_000)
    await writeModel(`${M.id}.detail.glb`, M.name, build(true), extras, 40_000, 1_500_000)
  }
}
