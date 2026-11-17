/**
 * Williams Tower (formerly Transco Tower; 2800 Post Oak Boulevard, Uptown
 * Houston; Philip Johnson and John Burgee, 1983) — original procedural
 * geometry, CC0-1.0.
 * bun generators/hou-williams-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/48486714,
 * 29.737262,-95.461394. The walls run 0.9° anticlockwise of the compass
 * (OSM and lidar agree), so the catalog bearing is 359.1 and the plan is
 * square to the frame.
 *
 * Identity, in order: a slim square glass shaft with re-entrant (notched)
 * corners; the ziggurat of corner setbacks in the top fifth, stepping in
 * from each corner towards the middle of every face; the continuous vertical
 * slots of dark glass running up every face to the top of their step; the
 * square cap with its low pyramid roof and the rotating beacon on the
 * apex; the six-storey glass podium round the foot, with the granite arched
 * portal on Post Oak Boulevard (east).
 *
 * Plan (all measured, OSM building:parts read in the turned frame; lidar
 * confirms each tier): the shaft is a 48 m square (OSM 47.4 x 48.0) centred
 * at (6.8, -0.3), its corners notched 4.6 m each way above 38 m. Tiers, in
 * plan from the corner inwards:
 *   notch filled to 38 m (OSM 581342685, lidar 38.2);
 *   the two strips flanking each notch (|u| 14.4-19.4 on the face) to 197 m
 *     (OSM 581354692 197, lidar 197.0-197.3);
 *   the corner square behind them (19.4 m half square, OSM 581354696 226,
 *     lidar 225.1-225.3) to 225.5 m;
 *   the 28.8 m wide cross arms to the face (OSM 581354694 233, lidar 233.0);
 *   the 20 m arms in the middle of each face to 249.5 m (OSM 581354697 250,
 *     19.1 m wide; lidar 248.8 roof, 250.4 parapet and about 22 m wide:
 *     drawn 20 m);
 *   the 28.8 m centre square to 261 m (OSM 581354693 261, lidar 260.9);
 *   the plant screen, a 26.8 m square to 267.5 m (lidar 267.4-267.8 at its
 *     edge), under the pyramid rising to 273.8 m (lidar; OSM 274 with
 *     roof:height 8); the beacon lantern to 276.4 m (lidar 276.4; published
 *     height 275 m / 901 ft, Wikipedia, CTBUH).
 *   Heights are above the street, which the lidar puts 2.9 m above its
 *   ground_min (a loading ramp).
 *  - podium: OSM parts 581354690/1 (south and north wings), 581342682 (west
 *    wing), 581342686 (the bridge to the west garage, 6.6 m clear under it),
 *    581354695 (east), all 28 m; lidar roof 26.3 m, parapet 27.9 m.
 *  - east portal: the 19 m projection of 581354695, lidar 28.8 m, a granite
 *    block with a tall arched window (Ksaziz photo). Arch window 8.4 m wide,
 *    springing at 15 m (estimate from the photo against the portal width).
 *  - slots: four on each arm, one on each 233 m strip and one on each 197 m
 *    strip, counted on Agsftw's 2013 photo and Argos'Dad's; drawn 1.6 m wide
 *    and 1.1 m deep (estimate) from the podium roof to their tier's top.
 *    The lidar picks up the piers between them along the faces.
 *  - lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 1 m grid.
 *  - colours: the curtain wall is blue reflective glass in a fine silver
 *    grid; photos sample #3c5976 (sun) to #5d7085 (sky reflection): a
 *    silvery steel-blue window variant, lighter than the palette window,
 *    and the slots in the darker palette window, as they read in every
 *    photo. The plant screen is pale grey (Argos'Dad, Agsftw); the pyramid
 *    mid grey (NAIP #857f8a, OSM roof:colour); the portal's granite warm
 *    pale beige-pink (Ksaziz).
 *  - night: office floors lit (window, window-2); the beacon is a rotating
 *    searchlight whose beam shows for miles (Bill Jacobus's night photo):
 *    a lamp on the apex.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Williams Tower in Houston - Dec 2013.JPG, Agsftw, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Williams_Tower_in_Houston_-_Dec_2013.JPG
 *  - HoustonWilliamsTower.jpg, Argos'Dad, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:HoustonWilliamsTower.jpg
 *  - TranscoWilliamsTower1 (147355748).jpg, Ed Schipul, CC BY-SA 2.0
 *    https://commons.wikimedia.org/wiki/File:TranscoWilliamsTower1_(147355748).jpg
 *  - Williamstower.jpg, Hequals2henry, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Williamstower.jpg
 *  - Williams Tower Front.jpg, Ksaziz, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Williams_Tower_Front.jpg
 *  - Hot air balloon passing by williams energy tower.jpg, Bill Jacobus, PD
 *    https://commons.wikimedia.org/wiki/File:Hot_air_balloon_passing_by_williams_energy_tower.jpg
 *  - Williams Tower, (formerly the Transco Tower) ... LCCN2011634993.tif and
 *    Aerial view of Transco Tower ... LCCN2011631610.tif, Carol M.
 *    Highsmith, PD (aerials from the south)
 *    https://commons.wikimedia.org/wiki/File:Williams_Tower,_(formerly_the_Transco_Tower)_a_skyscraper_located_in_the_Uptown_District_of_Houston,_Texas_LCCN2011634993.tif
 *  - Williams Tower.jpg (night, beacon beam), Bill Jacobus, CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Williams_Tower.jpg
 * Aerial: USGS NAIP (public domain). No look-only sources; no commercial imagery.
 *
 * Doubts: the slot count and spacing come from two photos and are drawn
 * evenly; the real ones are 3-4 storey-module wide piers apart and may
 * differ by a metre. The arms are drawn 20 m wide, between OSM (19.1) and
 * lidar (about 22). Only the east portal is drawn; the podium's other
 * entrances, the west bridge's underside detail and the roof plant are
 * left plain. The beacon housing is a simple box.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, panel, save, walls, type XY } from './chi-aon-center'

const glass = new Part(), slot = new Part(), silver = new Part(), roof = new Part(), granite = new Part(), lamp = new Part()

const CX = 6.8, CY = -0.3 // shaft centre in the anchor frame
const H = 24 // half the shaft
const N = 19.4 // notch line: the corner notches run from N to H
const X = 14.4 // cross arms and centre square, half width
const A = 10 // the middle arms, half width
const SW = 0.8, SD = 1.1 // slot half width and depth

type Pt = { p: XY; slot?: boolean } // `slot`: the edge leaving this point is slot glass
const P = (x: number, y: number): XY => [CX + x, CY + y]

/** The east quarter of a tier's outline (u runs south to north along x = H), turned four times. */
function ring(quarter: Pt[]): Pt[] {
  const out: Pt[] = []
  for (let k = 0; k < 4; k++) {
    const c = [1, 0, -1, 0][k], s = [0, 1, 0, -1][k]
    for (const q of quarter) out.push({ p: [q.p[0] * c - q.p[1] * s, q.p[0] * s + q.p[1] * c], slot: q.slot })
  }
  return out.map(q => ({ p: P(q.p[0], q.p[1]), slot: q.slot }))
}
/** The face x = H from u0 to u1 with slots cut in at the given u. */
function face(u0: number, u1: number, slots: number[]): Pt[] {
  const out: Pt[] = [{ p: [H, u0] }]
  for (const u of slots.filter(u => u > u0 && u < u1).sort((a, b) => a - b))
    out.push({ p: [H, u - SW], slot: true }, { p: [H - SD, u - SW], slot: true }, { p: [H - SD, u + SW], slot: true }, { p: [H, u + SW] })
  return out
}

const ARM = [-6.9, -2.3, 2.3, 6.9], STRIP233 = [-12.2, 12.2], STRIP197 = [-16.9, 16.9]
const ALL = [...ARM, ...STRIP233, ...STRIP197]

// Tiers, bottom to top: [z0, z1, outline].
const tiers: [number, number, Pt[]][] = [
  [0, 28, ring([{ p: [H, -H] }])],
  [28, 38, ring(face(-H, H, ALL))],
  [38, 197, ring([{ p: [N, -N] }, ...face(-N, N, ALL), { p: [H, N] }])],
  [197, 225.5, ring([{ p: [N, -N] }, { p: [N, -X] }, ...face(-X, X, [...ARM, ...STRIP233]), { p: [H, X] }, { p: [N, X] }])],
  [225.5, 233, ring([{ p: [X, -X] }, ...face(-X, X, [...ARM, ...STRIP233]), { p: [H, X] }])],
  [233, 249.5, ring([{ p: [X, -X] }, { p: [X, -A] }, ...face(-A, A, ARM), { p: [H, A] }, { p: [X, A] }])],
  [249.5, 261, ring([{ p: [X, -X] }])],
]

/** Walls of a tier, slot edges in the dark glass. */
function tierWalls(r: Pt[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i].p, b = r[(i + 1) % r.length].p
    ;(r[i].slot ? slot : glass).quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** Is the segment a→b on the outline of the ring r (the tier above carries on there)? */
function onOutline(a: XY, b: XY, r: Pt[]) {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return r.some((q, i) => {
    const c = q.p, d = r[(i + 1) % r.length].p
    const L = Math.hypot(d[0] - c[0], d[1] - c[1]), t = ((m[0] - c[0]) * (d[0] - c[0]) + (m[1] - c[1]) * (d[1] - c[1])) / (L * L)
    if (t < -1e-6 || t > 1 + 1e-6) return false
    return Math.abs((m[0] - c[0]) * (d[1] - c[1]) - (m[1] - c[1]) * (d[0] - c[0])) / L < 0.05
  })
}

for (let i = 0; i < tiers.length; i++) {
  const [z0, z1, r] = tiers[i]
  tierWalls(r, z0, z1)
  cap(roof, r.map(q => q.p), z1)
  // A silver coping where the tier stops: every edge the tier above doesn't carry on.
  const next = tiers[i + 1]?.[2]
  if (i === 0) continue // hidden in the podium
  for (let k = 0; k < r.length; k++) {
    const a = r[k].p, b = r[(k + 1) % r.length].p
    if (r[k].slot || (next && onOutline(a, b, next))) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    panel(silver, a, b, 0, L, z1 - 0.9, z1, 0.06)
  }
}

// The plant screen and the pyramid with the beacon.
{
  const S = 13.4, ZS = 267.5, ZP = 273.8
  const ccw: XY[] = [P(-S, -S), P(S, -S), P(S, S), P(-S, S)]
  walls(roof, ccw, 261, ZS)
  const E = 0.5 // eaves overhang
  const eave: XY[] = [P(-S - E, -S - E), P(S + E, -S - E), P(S + E, S + E), P(-S - E, S + E)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    silver.quad([ccw[i][0], ccw[i][1], ZS], [ccw[j][0], ccw[j][1], ZS], [eave[j][0], eave[j][1], ZS], [eave[i][0], eave[i][1], ZS])
    roof.tri([eave[i][0], eave[i][1], ZS], [eave[j][0], eave[j][1], ZS], [CX, CY, ZP])
  }
  // Beacon lantern: a short silver drum carrying the lamp.
  const L = 1.2
  const lan: XY[] = [P(-L, -L), P(L, -L), P(L, L), P(-L, L)]
  walls(silver, lan, ZP - 1.5, ZP + 1.0)
  cap(silver, lan, ZP + 1.0)
  // Lamp: an octahedron bead, bolder than the real lens so it reads at night.
  const c: V3 = [CX, CY, ZP + 1.6], r = 1.1
  const v: V3[] = [[c[0] + r, c[1], c[2]], [c[0], c[1] + r, c[2]], [c[0] - r, c[1], c[2]], [c[0], c[1] - r, c[2]]]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    lamp.tri(v[i], v[j], [c[0], c[1], c[2] + r])
    lamp.tri(v[j], v[i], [c[0], c[1], c[2] - r])
  }
}

// Podium: glass wings, 28 m, round the foot (OSM parts, model frame).
{
  const ZR = 26.3, ZT = 27.9
  const wing = (x0: number, y0: number, x1: number, y1: number, zb = 0) => {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    walls(glass, r, zb, ZT)
    if (zb > 0) cap(silver, r, zb, false)
    // parapet coping, roof sunk inside it
    const i: XY[] = [[x0 + 0.6, y0 + 0.6], [x1 - 0.6, y0 + 0.6], [x1 - 0.6, y1 - 0.6], [x0 + 0.6, y1 - 0.6]]
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      silver.quad([r[k][0], r[k][1], ZT], [r[l][0], r[l][1], ZT], [i[l][0], i[l][1], ZT], [i[k][0], i[k][1], ZT])
      silver.quad([i[l][0], i[l][1], ZT], [i[k][0], i[k][1], ZT], [i[k][0], i[k][1], ZR], [i[l][0], i[l][1], ZR])
    }
    cap(roof, i, ZR)
    for (let k = 0; k < 4; k++) panel(silver, r[k], r[(k + 1) % 4], 0, Math.hypot(r[(k + 1) % 4][0] - r[k][0], r[(k + 1) % 4][1] - r[k][1]), ZT - 1.4, ZT - 0.4, 0.05)
  }
  wing(-12.6, CY + H, 25.6, 35.6) // north
  wing(-12.5, -35.3, 25.8, CY - H) // south
  wing(-29.3, -19.3, CX - H, 18.6) // west
  wing(-46.1, -15.1, -29.3, 15.1, 6.6) // bridge to the garage
  wing(CX + H, -19.7, 36.1, 18.2) // east
}

// East portal on Post Oak Boulevard: a granite block with a tall arched window.
{
  const x0 = CX + H, x1 = 39.0, y0 = CY - 9.6, y1 = CY + 9.6, ZT = 28.8
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(granite, r, 0, ZT - 0.4)
  const ins: XY[] = r.map(([x, y]) => [x + (x === x0 ? 0 : -0.4), y + (y === y0 ? 0.4 : -0.4)] as XY)
  walls(granite, r, ZT - 0.4, ZT, ins)
  cap(roof, ins, ZT)
  // Arched window on the east face: a rectangle and a true semicircle on top.
  const a: XY = [x1, y0], b: XY = [x1, y1], w = 4.2, mid = 9.6, spring = 15
  panel(slot, a, b, mid - w, mid + w, 0, spring, 0.05)
  const n = 10, out = 0.05
  for (let i = 0; i < n; i++) {
    const t0 = Math.PI * i / n, t1 = Math.PI * (i + 1) / n
    const s0 = mid + w * Math.cos(Math.PI - t0), s1 = mid + w * Math.cos(Math.PI - t1)
    const z0 = spring + w * Math.sin(t0), z1 = spring + w * Math.sin(t1)
    const Q = (s: number, z: number): V3 => [x1 + out, y0 + s, z]
    slot.tri(Q(mid, spring), Q(s0, z0), Q(s1, z1))
  }
}

await save('hou-williams-tower', 'Williams Tower', [29.737262, -95.461394], 359.1, [
  { part: glass, material: windowVariant(2, 0x7d98b8) },
  { part: slot, material: PALETTE.window },
  { part: silver, material: finish('williams-silver', 0xd9dde2) },
  { part: roof, material: PALETTE.roof },
  { part: granite, material: finish('williams-granite', 0xe6d7c8) },
  { part: lamp, material: finish('lamp-beacon', 0xd9dde2) },
], 6500)
