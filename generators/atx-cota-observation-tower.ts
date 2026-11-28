/**
 * Circuit of the Americas observation tower (2012, Miró Rivera
 * Architects), Elroy, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-cota-observation-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 326.5, so +y points
 * north-west, from the tower out along the red canopy over the amphitheatre
 * stage, and the deck cantilevers toward -y (south-east). Anchor = area
 * centroid of OSM way/847781224 (building, height 76.5), -97.637866,
 * 30.134243. z = 0 is the lowest ground under the footprint, the stage pit
 * under the canopy's far end (Mapterhorn and lidar ground about 0.3 m over
 * the lidar box's ground_min); every height below is lidar minus 0.3.
 *
 * Identity: a square white stair tower, its flights zig-zagging up every
 * face round a pale core; a cantilevered observation deck with a rounded
 * end; and the red "veil", a band of parallel steel tubes that stands off
 * the tower's north-west face, bends over the top as a roof over the deck,
 * and at the bottom sweeps out into a fanned canopy over the amphitheatre
 * stage, carried on white V columns.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame with tools/lidar_frame.py):
 *  - veil roof: measured, top 79.4 at y -3 falling to 77.6 at its tip
 *    (y -12.5), x -7..3.5 (10.5 m wide, centred x -1.8: the lidar sits
 *    1.8 m west of the OSM outline's centre, and the model follows the
 *    lidar);
 *  - top bend: radius 4.5 (lidar edges smear; radius from the photos);
 *    the veil leans out as it falls, from y 7.2 under the bend to 9.6 at
 *    z 31.6 (the lidar puts it at y 7.5-8.3; "mcgehee" shows the gap to
 *    the shaft growing from 1.5 m to 4 m, which the model follows);
 *  - bottom bend radius 11.6, fitted to the lidar at y 10-16; the canopy
 *    from z 20.0 at its root to 21.5 at y 66, its fan x -28..24 at y 58 and its
 *    front an arc at y 66-70: measured;
 *  - total height 77 m above the tower's ground (published 251 ft;
 *    Wikipedia "Circuit of the Americas"), lidar 77.3: z 79.4 on ground
 *    z 2.1;
 *  - deck floor z 72.3 (published 230 ft = 70 m above ground; a few lidar
 *    returns at 72.6 through the roof); deck slab 1.8 m: photo-scaled;
 *  - shaft 9.5 m square, y -4..5.5; deck end y -9.5, rounded at radius
 *    3: photo-scaled from "mcgehee" (side on, 0.06 m/px from the published
 *    heights: shaft 9.8 m, deck overhang 3.9 m, roof 2.4 m past the deck);
 *    core 5.4 m and its head 4.7 m over the deck from "harper";
 *  - 17 stair levels of 4 m: counted on "mcgehee"; outriggers from the
 *    shaft to the veil every 8.4 m: counted on "mcgehee";
 *  - the raised plaza (z 8.3, y 24-48) that the V columns stand on is
 *    ground in both the lidar and the map's terrain, so it is not modelled;
 *    the map fills the terrain under the model to about z 5 there, so the
 *    columns' feet run down to z 4.2;
 *    the V columns' positions are estimated from "mcgehee" and "xgames";
 *  - the stage: its dark back wall at y 46-48 and the white membrane roof
 *    under the tubes over y 40-68 from "fromtower"; heights estimated.
 *  - 15 tubes, drawn 0.5 m thick at 0.7 m centres (the real veil has more,
 *    thinner tubes; the band is kept bold for phone size).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  mcgehee   "Tower at Circuit of the Americas.jpg", Earl McGehee, CC BY-SA 3.0
 *            https://commons.wikimedia.org/wiki/File:Tower_at_Circuit_of_the_Americas.jpg
 *  harper    "Copa Tower (11121910464).jpg", Glenn Harper, CC BY-SA 2.0
 *            https://commons.wikimedia.org/wiki/File:Copa_Tower_(11121910464).jpg
 *  elave     "Tower (31641665621).jpg", el_ave, CC BY 2.0
 *            https://commons.wikimedia.org/wiki/File:Tower_(31641665621).jpg
 *  pedrik    "Circuit of the Americas (30183010830).jpg", pedrik, CC BY 2.0
 *            https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_(30183010830).jpg
 *  xgames    "COTA Observation Tower with X Games 2014 Signage.jpg", RM VM, CC BY-SA 4.0
 *            https://commons.wikimedia.org/wiki/File:COTA_Observation_Tower_with_X_Games_2014_Signage.jpg
 *  fromtower "Austin360 amphitheater from tower 2013.jpg", Larry D. Moore, CC BY 4.0
 *            https://commons.wikimedia.org/wiki/File:Austin360_amphitheater_from_tower_2013.jpg
 *  gill217   "COTA Tower 217.jpg", gillfoto, CC BY-SA 4.0 (night: the shaft
 *            floodlit in red, white and blue)
 *            https://commons.wikimedia.org/wiki/File:COTA_Tower_217.jpg
 * Also: USGS NAIP (plan of the canopy). No look-only sources, no commercial
 * imagery.
 *
 * Replaces the tower (way/847781224) and the amphitheatre stage under the
 * canopy (way/847781223, "Germania Insurance Amphitheater"). way/998801550
 * west of the tower is a separate neighbour (flat ground in the lidar); the
 * deck's edge may reach 0.6 m over it.
 *
 * Doubts: the deck's plan and the shaft's size are photo-scaled (±1 m); the
 * V columns' count and spacing, the stage wall and the membrane's extent
 * are estimates; the tubes are fewer and bolder than the real ones; the
 * stair flights are a zig-zag abstraction of the real scissor stairs.
 * Left out: railings, people, the lift, the tubes' fixings, lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, prism, save, type XY } from './atl-flatiron-building'

const red = new Part(), white = new Part(), core = new Part(), glass = new Part(), dark = new Part()

const XC = -1.8 // the tower's axis in x (lidar)
const G = 2.1 // the ground at the tower
const S0 = -4.0, S1 = 5.5, SH = 4.75 // the shaft: y range, half-width in x
const DECK = 72.3, DECK_T = 1.8
const CORE_H = 3.2, CORE_TOP = 77.0

// ── tubes ─────────────────────────────────────────────────────────────────

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const nrm3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const crs3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** A tube of square section, smooth-shaded so it reads round, along a path. */
function tube(p: Part, path: V3[], r: number, caps = true) {
  const rings: V3[][] = [], ns: V3[][] = []
  for (let i = 0; i < path.length; i++) {
    const t = nrm3(sub3(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]))
    let side = crs3(t, [0, 0, 1])
    if (Math.hypot(...side) < 0.3) side = crs3(t, [1, 0, 0])
    side = nrm3(side)
    const up = nrm3(crs3(side, t))
    const ring: V3[] = [], nr: V3[] = []
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 4 + (k * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a)
      const d: V3 = [side[0] * c + up[0] * s, side[1] * c + up[1] * s, side[2] * c + up[2] * s]
      ring.push([path[i][0] + d[0] * r, path[i][1] + d[1] * r, path[i][2] + d[2] * r])
      nr.push(d)
    }
    rings.push(ring)
    ns.push(nr)
  }
  for (let i = 0; i < rings.length - 1; i++)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      const a = rings[i][k], b = rings[i][l], c = rings[i + 1][l], d = rings[i + 1][k]
      p.tri(a, b, c, undefined, undefined, undefined, [ns[i][k], ns[i][l], ns[i + 1][l]])
      p.tri(a, c, d, undefined, undefined, undefined, [ns[i][k], ns[i + 1][l], ns[i + 1][k]])
    }
  if (caps) {
    const f = rings[0], e = rings[rings.length - 1]
    const t0 = nrm3(sub3(path[0], path[1])), t1 = nrm3(sub3(path[path.length - 1], path[path.length - 2]))
    p.tri(f[0], f[1], f[2], undefined, undefined, undefined, [t0, t0, t0]); p.tri(f[0], f[2], f[3], undefined, undefined, undefined, [t0, t0, t0])
    p.tri(e[0], e[1], e[2], undefined, undefined, undefined, [t1, t1, t1]); p.tri(e[0], e[2], e[3], undefined, undefined, undefined, [t1, t1, t1])
  }
}

/** A straight strut between two points (an unbevelled square bar). */
function bar(p: Part, a: V3, b: V3, r: number) {
  tube(p, [a, b], r)
}

// The veil's profile in (y, z), shared by every tube, from the canopy's
// root up the tower and over the deck to the roof's tip.
const N = 15, PITCH = 0.7, TR = 0.25
const BOT_R = 11.6, BOT_C: [number, number] = [9.6 + BOT_R, 31.6]
const TOP_R = 4.5, TOP_C: [number, number] = [7.2 - TOP_R, 79.1 - TOP_R]
const profile: [number, number][] = []
for (let k = 0; k <= 6; k++) { // bottom bend: from the canopy root (angle -90) to vertical (180)
  const a = (-90 - (k / 6) * 90) * (Math.PI / 180)
  profile.push([BOT_C[0] + BOT_R * Math.cos(a), BOT_C[1] + BOT_R * Math.sin(a)])
}
for (let k = 0; k <= 5; k++) { // top bend: from vertical (0) to level (90)
  const a = ((k / 5) * 90) * (Math.PI / 180)
  profile.push([TOP_C[0] + TOP_R * Math.cos(a), TOP_C[1] + TOP_R * Math.sin(a)])
}
// the roof over the deck: a slight fall to the tip, which turns down
for (const [y, z] of [[-3, 79.1], [-8, 78.7], [-11.5, 78.0], [-13, 77.2]] as [number, number][]) profile.push([y, z])

// The canopy: the tubes fan out from the root (y 19.9) to the front arc.
const ROOT_Y = BOT_C[0]
const canopyZ = (y: number) => 20.0 + (1.5 * (y - ROOT_Y)) / 46
const fanHalf = (y: number) => {
  const t = Math.min(1, Math.max(0, (y - ROOT_Y) / (57 - ROOT_Y)))
  return (PITCH * (N - 1)) / 2 + t * (27.5 - (PITCH * (N - 1)) / 2)
}
const FAN_XC = (y: number) => XC + Math.min(1, Math.max(0, (y - ROOT_Y) / 37)) * -0.2
const frontY = (u: number) => 70 - 13 * u * u // u in -1..1: the tube's place across the fan

for (let i = 0; i < N; i++) {
  const u = (i - (N - 1) / 2) / ((N - 1) / 2)
  const xv = XC + u * (PITCH * (N - 1)) / 2
  const path: V3[] = []
  // canopy, from its front end back to the root
  const yEnd = frontY(u)
  for (let k = 6; k >= 1; k--) {
    const y = ROOT_Y + ((yEnd - ROOT_Y) * k) / 6
    path.push([FAN_XC(y) + u * fanHalf(y), y, canopyZ(y)])
  }
  for (const [y, z] of profile) path.push([xv, y, z])
  tube(red, path, TR)
}
// More tubes join the canopy between those as the fan opens (the fan
// carries about twice as many tubes as the veil on the tower, "fromtower").
for (let i = 0; i < N - 1; i++) {
  const u = (i + 0.5 - (N - 1) / 2) / ((N - 1) / 2)
  const yEnd = frontY(u), y0 = ROOT_Y + 7
  const path: V3[] = []
  for (let k = 5; k >= 0; k--) {
    const y = y0 + ((yEnd - y0) * k) / 5
    path.push([FAN_XC(y) + u * fanHalf(y), y, canopyZ(y)])
  }
  tube(red, path, TR)
}

// ── the shaft ─────────────────────────────────────────────────────────────

const YC = (S0 + S1) / 2
// the pale core, up through the deck to the lift head
box(core, XC - CORE_H, XC + CORE_H, YC - CORE_H, YC + CORE_H, 0, CORE_TOP, core, 0.3)
// corner posts of the stair cage
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x = XC + sx * (SH - 0.3), y = YC + sy * (SH - 0.3)
  box(white, x - 0.3, x + 0.3, y - 0.3, y + 0.3, 0, DECK - DECK_T, null, 0)
}
// stair flights: on every face a slab rising corner to corner, the
// direction alternating level by level, so the faces zig-zag as they do
const LEV = 4.0, NLEV = 17
const faceDirs: { o: XY; t: XY; n: XY; L: number }[] = [
  { o: [XC - SH, YC - SH], t: [1, 0], n: [0, -1], L: 2 * SH }, // south-east face (-y)
  { o: [XC + SH, YC - SH], t: [0, 1], n: [1, 0], L: 2 * SH },
  { o: [XC + SH, YC + SH], t: [-1, 0], n: [0, 1], L: 2 * SH },
  { o: [XC - SH, YC + SH], t: [0, -1], n: [-1, 0], L: 2 * SH },
]
function slab(p: Part, A: V3, B: V3, n: XY, depth: number, th: number) {
  // a slanted plank from A to B, `depth` in from the face (toward -n), th thick
  const inA: V3 = [A[0] - n[0] * depth, A[1] - n[1] * depth, A[2]], inB: V3 = [B[0] - n[0] * depth, B[1] - n[1] * depth, B[2]]
  const lo = (q: V3): V3 => [q[0], q[1], q[2] - th]
  const P = [A, B, inB, inA], Q = P.map(lo)
  const quadO = (a: V3, b: V3, c: V3, d: V3, out: V3) => {
    const g = crs3(sub3(b, a), sub3(c, a))
    if (g[0] * out[0] + g[1] * out[1] + g[2] * out[2] < 0) p.quad(a, d, c, b)
    else p.quad(a, b, c, d)
  }
  quadO(P[0], P[1], P[2], P[3], [0, 0, 1])
  quadO(Q[0], Q[3], Q[2], Q[1], [0, 0, -1])
  quadO(Q[0], Q[1], P[1], P[0], [n[0], n[1], 0])
  const t = nrm3(sub3(B, A))
  quadO(Q[1], Q[2], P[2], P[1], t)
  quadO(Q[3], Q[0], P[0], P[3], [-t[0], -t[1], -t[2]])
}
for (let l = 0; l < NLEV; l++) {
  const z0 = G + l * LEV, z1 = z0 + LEV
  if (z1 > DECK - DECK_T - 0.2) break
  faceDirs.forEach((f, fi) => {
    const flip = (l + fi) % 2 === 1
    const s0 = 0.6, s1 = f.L - 0.6
    const P = (s: number, z: number): V3 => [f.o[0] + f.t[0] * s + f.n[0] * 0.05, f.o[1] + f.t[1] * s + f.n[1] * 0.05, z]
    const A = P(flip ? s1 : s0, z0 + 0.4), B = P(flip ? s0 : s1, z1)
    slab(white, A, B, f.n, SH - CORE_H, 0.45)
    // the landing ring at the top of the flight, all round
    slab(white, P(0, z1), P(f.L, z1), f.n, SH - CORE_H, 0.45)
  })
}
// outriggers from the shaft's north-west face to the veil, every 8.4 m
for (let z = 24.5; z < 70; z += 8.4) {
  const yv = 9.6 - (2.4 * (z - 31.6)) / (74.6 - 31.6)
  const xa = XC - (PITCH * (N - 1)) / 2, xb = XC + (PITCH * (N - 1)) / 2
  bar(white, [xa, yv - 0.45, z], [xb, yv - 0.45, z], 0.22)
  for (const x of [XC - 3.5, XC + 3.5]) bar(white, [x, S1, z], [x, yv - 0.4, z], 0.18)
}

// ── the deck ──────────────────────────────────────────────────────────────

const DX = SH + 0.5, DY0 = -9.5, DY1 = 7.1, RR = 3
const deckRing: XY[] = []
deckRing.push([XC + DX, DY1], [XC - DX, DY1])
for (let k = 0; k <= 4; k++) { const a = Math.PI + (k / 4) * (Math.PI / 2); deckRing.push([XC - DX + RR + RR * Math.cos(a), DY0 + RR + RR * Math.sin(a)]) }
for (let k = 0; k <= 4; k++) { const a = -Math.PI / 2 + (k / 4) * (Math.PI / 2); deckRing.push([XC + DX - RR + RR * Math.cos(a), DY0 + RR + RR * Math.sin(a)]) }
const deckCcw = deckRing.slice().reverse() as XY[] // the ring above is clockwise; prism wants ccw
// a slab whose underside steps in, so the fascia reads thin
prism(white, deckCcw, DECK - DECK_T, DECK, white, 0.3, true)
// the glass balustrade round the deck's open edges
{
  const ring = deckCcw
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.abs(a[1] - DY1) < 0.01 && Math.abs(b[1] - DY1) < 0.01) continue // the veil side
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    const A: V3 = [a[0] - n[0] * 0.15, a[1] - n[1] * 0.15, DECK], B: V3 = [b[0] - n[0] * 0.15, b[1] - n[1] * 0.15, DECK]
    glass.quad(A, B, [B[0], B[1], DECK + 1.2], [A[0], A[1], DECK + 1.2])
    glass.quad(B, A, [A[0], A[1], DECK + 1.2], [B[0], B[1], DECK + 1.2])
  }
}
// white posts from the deck's long edges up to the veil's roof
for (const sx of [-1, 1]) for (const y of [-6.5, -2.5, 1.5]) {
  const x = XC + sx * (DX - 0.4)
  bar(white, [x, y, DECK], [x, y, 79.0 - 0.0 - (y < -3 ? (0.4 * (-3 - y)) / 5 : 0) - 0.3], 0.12)
}

// ── the canopy's supports and the stage ───────────────────────────────────

// white cross trusses under the tubes
for (const y of [24, 31, 38]) {
  const h = fanHalf(y) - 0.6, z = canopyZ(y) - TR - 0.35
  bar(white, [FAN_XC(y) - h, y, z], [FAN_XC(y) + h, y, z], 0.35)
}
// V columns: pairs of struts from one foot on the ground to the canopy
const ground = (y: number) => (y < 22 ? G - 0.2 : 4.5)
for (const [y, s] of [[15, 0.82], [27, 0.85], [39, 0.85]] as [number, number][]) {
  for (const sx of [-1, 1]) {
    const x = FAN_XC(y) + sx * fanHalf(y) * s
    const foot: V3 = [x, y, ground(y) - 0.3]
    const zc = canopyZ(y) - TR - 0.2
    bar(white, foot, [FAN_XC(y - 3) + sx * fanHalf(y - 3) * s, y - 3, zc], 0.25)
    bar(white, foot, [FAN_XC(y + 3) + sx * fanHalf(y + 3) * s, y + 3, zc], 0.25)
  }
}
// the stage roof: a white membrane under the tubes over the stage
{
  const ys = [40, 46, 52, 58, 64]
  const left = ys.map((y) => [FAN_XC(y) - fanHalf(y) + 1, y] as XY)
  const right = ys.map((y) => [FAN_XC(y) + fanHalf(y) - 1, y] as XY).reverse()
  const arc: XY[] = []
  for (let k = -3; k <= 3; k++) { const u = k / 3.6; arc.push([FAN_XC(66) + u * fanHalf(66), frontY(u) - 1.2]) }
  const ring: XY[] = [...left.slice(0, 4), ...arc.filter(([, y]) => y > 60), ...right.slice(1)]
  const ccwRing = ring.map(([x, y]) => [x, y] as XY)
  // right side was reversed: ring runs up the left, across the front, down the right = clockwise; flip
  const memb = ccwRing.slice().reverse() as XY[]
  const z = canopyZ(52) - TR - 0.5
  capPoly(white, memb, z, true)
  capPoly(white, memb, z - 0.6, false)
  for (let i = 0; i < memb.length; i++) {
    const a = memb[i], b = memb[(i + 1) % memb.length]
    white.quad([a[0], a[1], z - 0.6], [b[0], b[1], z - 0.6], [b[0], b[1], z], [a[0], a[1], z])
  }
}
// the stage's dark back wall
box(dark, FAN_XC(47) - fanHalf(47) + 3, FAN_XC(47) + fanHalf(47) - 3, 46, 48, 0, 17.5, dark, 0.3)

if (import.meta.main) {
  await save('atx-cota-observation-tower', 'Circuit of the Americas Observation Tower', [
    { part: red, material: { ...finish('cota-veil-red', 0xc8423c), floodlight: () => 0.5 } },
    { part: white, material: { ...PALETTE.trim, floodlight: (_p, n) => (n[2] > 0.7 ? 0.2 : 0.7) } },
    { part: core, material: { ...finish('cota-core', 0xf4eee5), floodlight: () => 0.9 } },
    { part: glass, material: { ...PALETTE.glass, doubleSided: true } },
    { part: dark, material: finish('cota-stage-black', 0x4a4f57) },
  ], { bearing: 326.5, height: 79.4, replaces: ['way/847781224', 'way/847781223'] }, 6500)
}
