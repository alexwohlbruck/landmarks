/**
 * Q2 Stadium (2021, Gensler; Walter P Moore, structure), home of Austin FC,
 * 10414 McKalla Place, Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-q2-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 339.2 (the pitch's long
 * axis, OSM way/953824941), so +y points up the pitch to the North
 * Building. The anchor is the centre of the pitch, -97.71948, 30.38786
 * (the outline's centroid is 6 m south-east of it; the pitch centre keeps
 * the bowl symmetric in the frame). z = 0 is the field.
 *
 * Identity: a rectangular bowl of bright green seats; a white roof canopy
 * all the way round over the stands, carried on big concrete columns at the
 * corners; white steel trusses standing up on the side roofs (a gable seen
 * end on, from outside); a two-tier main stand on the west with a dark band
 * of suites; one big steep tier on the east and at the south (supporters')
 * end, with the video board hung under the roof over it; the black North
 * Building with its glass club and green-striped panel at the north end.
 *
 * Plan (OSM, read in this frame): the outline way/1034643928 (x -87..87,
 * y -102..88); the roof parts way/961741983 (west, x -76..-36, height 30),
 * way/961741984 (east, x 36..79), way/1023431479 (south, y -102..-67),
 * way/1023431476 (north, y 36..72). The roof's opening is drawn x -44..44,
 * y -69..67: the photos put its front edge over the stands' lower rows,
 * not at the touchlines where the OSM roof parts stop (x 36); the North Building
 * way/897365979 (y 62..87). The pitch is 105 x 69 m (Wikipedia; OSM draws
 * 103 x 64); the field wall stands 5.5 m off the touchlines and 7 m off
 * the goal lines (photo "corn1").
 *
 * Heights: the stadium is newer than the only lidar (USGS 3DEP
 * USGS_LPC_TX_Central_B1_2017_LAS_2019, flown 2017), so: the truss peaks
 * 36.5 (OSM relation/13704106 height), the roof canopy 26-28.5 (OSM roof
 * height 30 including its fascia, and the photos); the stands estimated by
 * counting rows (about 0.45 m a row) in "ziegler", "kush" and "corn1":
 * west lower tier to 9, suite face to 15, upper tier to 24, club top 26;
 * east one tier to 19; south one steep tier to 18; north lower seats to
 * 7 and the North Building to 21.
 *
 * Elevation 0: the field is not drawn sunken. In "corn1", taken a few rows
 * up from the field, the ground outside the south-east corner shows at
 * about eye level, and the south-west tunnel opens at field level, so the
 * field sits at most 2-3 m below the plaza; that is less than the
 * terrain's own fall across the site (Mapterhorn: 1.5-6 m, the site's
 * pre-2019 ground), so no negative elevation is set. No published depth
 * was found (Wikipedia gives none).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  moore    "Q2 Stadium Austin Texas 2021.jpg", Larry D. Moore, CC BY 4.0
 *           (outside, from the north: North Building, roof trusses)
 *           https://commons.wikimedia.org/wiki/File:Q2_Stadium_Austin_Texas_2021.jpg
 *  ziegler  "Austin FC Stadium vs. Columbus Crew.jpg", Daniel Ziegler,
 *           CC BY-SA 4.0 (the west stand from the east)
 *           https://commons.wikimedia.org/wiki/File:Austin_FC_Stadium_vs._Columbus_Crew.jpg
 *  kush     "Austin Fc Vs FC Dallas in August 2026.jpg", Kushinumi, CC BY 4.0
 *           (from the south end: North Building, east stand)
 *           https://commons.wikimedia.org/wiki/File:Austin_Fc_Vs_FC_Dallas_in_August_2026.jpg
 *  corn1    "Austin FC VS FC Dallas by cornfield948 (20210830150401).jpg",
 *           cornfield948, CC BY-SA 3.0 (the south end and video board)
 *           https://commons.wikimedia.org/wiki/File:Austin_FC_VS_FC_Dallas_by_cornfield948_(20210830150401).jpg
 *  constr   "Austin FC Stadium Construction July 2020.jpg", Larry D. Moore,
 *           CC BY 4.0 (the roof's trusses and the stand's underside)
 *           https://commons.wikimedia.org/wiki/File:Austin_FC_Stadium_Construction_July_2020.jpg
 * No look-only sources, no commercial imagery.
 *
 * Outside: only the North Building is black; round the other three sides
 * the outside is an open grey concrete frame with the stands' green seats
 * showing between the piers ("moore", left, and "constr").
 *
 * Doubts: every stand height is a row count (±2 m); the east, south and
 * west outsides are photographed only obliquely (the bays are drawn
 * evenly);
 * the corners are blends; the cable stays over the end roofs, lights,
 * boards and stairs are left out. The pitch is the map's.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save } from './atl-flatiron-building'

const seats = new Part(), concrete = new Part(), dark = new Part(), white = new Part(), glass = new Part()

// ── the bowl: one section swept round the field wall ──────────────────────

/** A section, d out from the field wall, z up; same shape on every side. */
type Prof = { l1: number; z1: number; z2: number; l2: number; z3: number; z4: number; D: number; out: number }
const W: Prof = { l1: 20, z1: 9, z2: 15, l2: 15, z3: 24, z4: 26, D: 40, out: 26 }
const E: Prof = { l1: 20, z1: 10.5, z2: 10.5, l2: 16, z3: 19, z4: 21, D: 46, out: 21 }
const S: Prof = { l1: 15, z1: 9.5, z2: 9.5, l2: 14, z3: 18, z4: 20, D: 41, out: 20 }
const N: Prof = { l1: 12, z1: 7, z2: 7, l2: 0.5, z3: 7.3, z4: 21, D: 29, out: 21 }
const CORNER: Prof = { l1: 14, z1: 8, z2: 8, l2: 10, z3: 14, z4: 15, D: 30, out: 15 }
type Pt = [number, number, Part]
/**
 * The map's ground over the site (Mapterhorn, tools/terrain.ts check),
 * metres above its lowest point, rows north to south (y 88.6 .. -101),
 * columns x -80.1 .. 86.1. The site's ground is older than the stadium and
 * rises about 4 m to the north-west, so the front of the bowl is built up
 * to it there ("A part built lower than the ground under it",
 * docs/evidence.md): the field wall's foot follows the ground.
 */
const GROUND = [
  [4.8, 3.9, 3.2, 2.5, 2.1, 1.1, 0.6], [4.3, 3.6, 2.6, 2.5, 2.4, 1.2, 0.4], [4.2, 3.0, 2.2, 1.7, 1.8, 0.9, 1.6],
  [3.6, 2.6, 1.7, 1.1, 1.0, 0.6, 0.3], [2.5, 2.1, 1.8, 1.0, 1.7, 0.6, 1.1], [1.5, 1.2, 1.2, 1.0, 0.7, 0.3, 0.1],
  [1.9, 1.2, 1.1, 0.8, 0.5, 0.7, 0.4],
]
function ground(x: number, y: number) {
  const u = Math.min(6, Math.max(0, ((x + 80.1) / 166.2) * 6)), v = Math.min(6, Math.max(0, ((88.6 - y) / 189.6) * 6))
  const i = Math.min(5, Math.floor(v)), j = Math.min(5, Math.floor(u)), fv = v - i, fu = u - j
  return (GROUND[i][j] * (1 - fu) + GROUND[i][j + 1] * fu) * (1 - fv) + (GROUND[i + 1][j] * (1 - fu) + GROUND[i + 1][j + 1] * fu) * fv
}
function section(p: Prof, g = 0, wall: Part = concrete): Pt[] {
  const a = p.l1, b = p.l1 + 1.5, c = b + p.l2
  return [
    [0, 0, dark], // the field wall
    [0, 1.5 + g, seats],
    [a, p.z1, concrete], // the concourse
    [b, p.z1, glass], // the suite face (flat where there is none)
    [b, p.z2, seats],
    [c, p.z3, dark], // the back wall up to the club's top
    [c, p.z4, concrete], // the stand's top
    [p.D, p.out, wall], // the outer wall: black only on the North Building
    [p.D, 0, wall],
  ]
}
const mix = (a: Prof, b: Prof, t: number): Prof => {
  const o: any = {}
  for (const k of Object.keys(a) as (keyof Prof)[]) o[k] = a[k] * (1 - t) + b[k] * t
  return o
}

const FX = 40, FY0 = -59.5, FY1 = 59.5, R = 8 // the field wall: a rounded rectangle
type Station = { p: [number, number]; n: [number, number]; prof: Prof }
const stations: Station[] = []
function side(a: [number, number], b: [number, number], n: [number, number], prof: Prof, k: number) {
  for (let i = 0; i <= k; i++) stations.push({ p: [a[0] + ((b[0] - a[0]) * i) / k, a[1] + ((b[1] - a[1]) * i) / k], n, prof })
}
function corner(c: [number, number], a0: number, from: Prof, to: Prof) {
  // the corner: the sections dip to the lower corner profile and back
  for (let i = 1; i < 6; i++) {
    const a = ((a0 + (i * 90) / 6) * Math.PI) / 180, t = i / 6
    const prof = t < 0.5 ? mix(from, CORNER, t * 2) : mix(CORNER, to, (t - 0.5) * 2)
    stations.push({ p: [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)], n: [Math.cos(a), Math.sin(a)], prof })
  }
}
// counter-clockwise from the south-east corner
side([FX, FY0 + R], [FX, FY1 - R], [1, 0], E, 8)
corner([FX - R, FY1 - R], 0, E, N)
side([FX - R, FY1], [-FX + R, FY1], [0, 1], N, 6)
corner([-FX + R, FY1 - R], 90, N, W)
side([-FX, FY1 - R], [-FX, FY0 + R], [-1, 0], W, 8)
corner([-FX + R, FY0 + R], 180, W, S)
side([-FX + R, FY0], [FX - R, FY0], [0, -1], S, 6)
corner([FX - R, FY0 + R], 270, S, E)
stations.push(stations[0])

function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (g[0] * out[0] + g[1] * out[1] + g[2] * out[2] < 0) p.quad(a, d, c, b)
  else p.quad(a, b, c, d)
}
for (let k = 0; k < stations.length - 1; k++) {
  const s0 = stations[k], s1 = stations[k + 1]
  const lift = (s: Station) => Math.max(0, ground(s.p[0], s.p[1]) + 0.5 - 0.3)
  const north = s0.n[1] > 0.95 && s1.n[1] > 0.95
  const a = section(s0.prof, lift(s0), north ? dark : concrete), b = section(s1.prof, lift(s1), north ? dark : concrete)
  const Q = (s: Station, [d, z]: Pt): V3 => [s.p[0] + s.n[0] * d, s.p[1] + s.n[1] * d, z]
  const n: [number, number] = [s0.n[0] + s1.n[0], s0.n[1] + s1.n[1]]
  for (let i = 0; i < a.length - 1; i++) {
    const dd = a[i + 1][0] - a[i][0], dz = a[i + 1][1] - a[i][1]
    if (Math.abs(dd) + Math.abs(dz) < 1e-3) continue
    // the face looks toward the field (−n) and up for a rake, outward for the outer wall
    const out: V3 = [-dz * n[0], -dz * n[1], dd * 2]
    quadOut(a[i][2], Q(s0, a[i]), Q(s1, b[i]), Q(s1, b[i + 1]), Q(s0, a[i + 1]), out)
  }
  // Round the east, south and west the outside is an open concrete frame:
  // between the piers you see the green seats of the stand's back rows
  // and the underside of the rake ("moore", left; "constr"). Drawn as a
  // green opening in each bay between 1.5 m concrete piers.
  if (!north) {
    const A = Q(s0, [s0.prof.D + 0.06, 0, seats]), B = Q(s1, [s1.prof.D + 0.06, 0, seats])
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (L > 4) {
      const t = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], P = (u: number, z: number): V3 => [A[0] + t[0] * u, A[1] + t[1] * u, z]
      const z0 = Math.max(lift(s0), lift(s1)) + 4, z1 = Math.min(s0.prof.out, s1.prof.out) - 3
      quadOut(seats, P(0.75, z0), P(L - 0.75, z0), P(L - 0.75, z1), P(0.75, z1), [n[0], n[1], 0])
    }
  }
}

// ── the North Building's faces ────────────────────────────────────────────

// the glass club over the dark screen box, facing the field
const NB0 = FY1 + N.l1 + 2
quadOut(glass, [-30, NB0 - 0.1, 16], [30, NB0 - 0.1, 16], [30, NB0 - 0.1, 20], [-30, NB0 - 0.1, 20], [0, -1, 0])
// outside (photo "moore", from the north): over a dark ground floor, a
// two-storey glass band across most of the face; at its west end a panel
// of bold green vertical stripes; at its east end the entrance, a tall
// glass box in a broad green frame.
const NB1 = FY1 + N.D, NO: V3 = [0, 1, 0]
const nb = (p: Part, x0: number, x1: number, z0: number, z1: number, o = 0.1) => quadOut(p, [x0, NB1 + o, z0], [x1, NB1 + o, z0], [x1, NB1 + o, z1], [x0, NB1 + o, z1], NO)
nb(glass, -12, 20, 7, 18)
for (let x = -30; x < -14; x += 2.8) nb(seats, x, x + 1.6, 6, 18.5)
nb(seats, 20.5, 33, 0.5, 15) // the entrance's green frame
nb(glass, 22, 31.5, 0.5, 13.5, 0.16)

// ── the video board at the south end, hung under the roof ─────────────────

box(dark, -14, 14, FY0 - S.D + 6, FY0 - S.D + 9, 19.5, 26, dark, 0.2)

// ── the roof ──────────────────────────────────────────────────────────────

/** A rounded rectangle with a fixed number of points per side and corner. */
function rrect(x0: number, x1: number, y0: number, y1: number, r: number): [number, number][] {
  const out: [number, number][] = []
  const corners: [number, number, number][] = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]]
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i <= 4; i++) {
      const a = ((a0 + i * 22.5) * Math.PI) / 180
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  return out
}
const RI = rrect(-44, 44, -69, 67, 6), RO = rrect(-79, 79, -101, 84, 10)
const Z0 = 26, Z1 = 28.5
const at = (r: [number, number][], z: number) => r.map(([x, y]) => [x, y, z] as V3)
const loopQuads = (p: Part, A: V3[], B: V3[], out: (i: number) => V3) => {
  for (let i = 0; i < A.length; i++) { const j = (i + 1) % A.length; quadOut(p, A[i], A[j], B[j], B[i], out(i)) }
}
const cen = (r: [number, number][], i: number): V3 => { const [x, y] = r[i]; return [x, y * 0.8, 0] }
loopQuads(white, at(RI, Z0), at(RO, Z0), () => [0, 0, -1]) // underside
loopQuads(white, at(RI, Z1), at(RO, Z1), () => [0, 0, 1]) // top
loopQuads(white, at(RI, Z0), at(RI, Z1), (i) => { const c = cen(RI, i); return [-c[0], -c[1], 0] }) // the inner fascia
loopQuads(white, at(RO, Z0), at(RO, Z1), (i) => cen(RO, i)) // the outer edge

// the corner columns carrying the roof
for (const [x, y] of [[-38, 62], [38, 62], [-38, -69], [38, -69]] as [number, number][])
  box(concrete, x - 1.4, x + 1.4, y - 1.4, y + 1.4, 0, Z0, null, 0.3)

// the trusses standing on the side roofs: a ridge chord and frames down to
// the roof's front and back edges every 12 m
function bar(p: Part, a: V3, b: V3, r: number) {
  const t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(t[0], t[1], t[2])
  const tn = t.map((v) => v / L)
  let s = [tn[1], -tn[0], 0]; if (Math.hypot(s[0], s[1]) < 0.3) s = [1, 0, 0]
  const sl = Math.hypot(s[0], s[1], s[2]); s = s.map((v) => v / sl)
  const u = [tn[1] * s[2] - tn[2] * s[1], tn[2] * s[0] - tn[0] * s[2], tn[0] * s[1] - tn[1] * s[0]]
  const ring = (c: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) => [c[0] + (s[0] * i + u[0] * j) * r, c[1] + (s[1] * i + u[1] * j) * r, c[2] + (s[2] * i + u[2] * j) * r] as V3)
  const A = ring(a), B = ring(b)
  for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; const m: V3 = [(A[k][0] + A[l][0]) / 2 - a[0], (A[k][1] + A[l][1]) / 2 - a[1], (A[k][2] + A[l][2]) / 2 - a[2]]; quadOut(p, A[k], A[l], B[l], B[k], m) }
}
for (const sx of [-1, 1]) {
  const xf = sx * 44.5, xb = sx * 78.5, xr = (xf + xb) / 2, ZP = 36.5
  const ys: number[] = []
  for (let y = -92; y <= 77; y += 13) ys.push(y)
  ys.forEach((y, i) => {
    bar(white, [xr, y, ZP], [xf, y, Z1], 0.5)
    bar(white, [xr, y, ZP], [xb, y, Z1], 0.5)
    bar(white, [xr, y, ZP], [xr, y, Z1], 0.3)
    // diagonal webs in both slopes, zig-zagging bay by bay
    const yn = ys[i + 1]
    if (yn === undefined) return
    const up = i % 2 === 0
    for (const xe of [xf, xb]) bar(white, [xr, up ? y : yn, ZP], [xe, up ? yn : y, Z1], 0.3)
  })
  bar(white, [xr, ys[0], ZP], [xr, ys[ys.length - 1], ZP], 0.55) // the ridge chord
}

if (import.meta.main) {
  await save('atx-q2-stadium', 'Q2 Stadium', [
    { part: seats, material: finish('q2-seat-green', 0x63a650) },
    { part: concrete, material: finish('q2-concrete', 0xc9c7c0) },
    { part: dark, material: finish('q2-black', 0x4a4f57) },
    { part: white, material: { ...PALETTE.trim, floodlight: (_p, n) => (n[2] < -0.5 ? 0.6 : 0.1) } },
    { part: glass, material: PALETTE.window },
  ], { bearing: 339.2, height: 36.5, replaces: ['relation/13704106', 'way/1034643928', 'way/897365979', 'way/961741983', 'way/961741984', 'way/1023431472', 'way/1023431473', 'way/1023431474', 'way/1023431475', 'way/1023431476', 'way/1023431477', 'way/1023431478', 'way/1023431479'] }, 6500)
}
