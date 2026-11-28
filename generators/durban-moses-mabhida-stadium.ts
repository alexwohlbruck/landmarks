/**
 * Moses Mabhida Stadium (gmp Architekten with Ibhola Lethu Consortium,
 * roof and arch by schlaich bergermann partner, 2006-2009), Durban:
 * original procedural geometry, CC0-1.0, no textures.
 *   bun generators/durban-moses-mabhida-stadium.ts
 * Writes models/durban-moses-mabhida-stadium.glb (low) and
 * models/durban-moses-mabhida-stadium.detail.glb (detail: the cables from
 * the arch to the roof, more columns and folds, the SkyCar's rails).
 *
 * Map frame: x east, y north, z up, metres; y = 0 is the pitch. Anchor =
 * the centre of the OSM pitch (way/43924261, 104.9 x 70.3 m), lng
 * 31.0303995, lat -29.8289890. Bearing 20.8: the pitch's long axis, which
 * the arch follows (its plan runs at 19-20 deg), so model +y runs along
 * the arch toward its single north foot.
 *
 * Identity, in order: the great white arch, single at its north foot and
 * split into two legs to the south, braced like a ladder, rising 106 m
 * over the pitch; the SkyCar on the north leg and the viewing platform at
 * the top; the white membrane roof hung from it by cables, folded into
 * tent peaks round its rim; the ring of slender white columns and the
 * glazed concourse; the bowl of blue-green seats.
 *
 * Evidence
 *  - Plan: OSM. The arch (way/172893308, "Moses Mabhida Arch", traced
 *    node by node): its split point is over the pitch centre, the north
 *    foot at (-5.3, 192.2), the south feet at (35.5, -184.4) and (-28.5,
 *    -186.9) in this frame (drawn at x 3.5 +- 32, y -185.6). The stadium
 *    (relation/318673): outer way/38067322, 273 x 295 m, centred at
 *    (-2.8, -1.5); inner way/44108242, the roof opening, 114 x 238 m,
 *    elongated along the arch.
 *  - Published (Wikipedia "Moses Mabhida Stadium"): stadium 320 x 280 x
 *    45 m (drawn on the OSM outline, 273 x 295 m: OSM is the roof's rim);
 *    arch 350 m long, 105 m span height, top 106 m above the pitch, a 5 x
 *    5 m steel box (drawn 6 m single, 5 m split, for phone size); roof 46,000 m2 of PTFE-coated glass-fibre membrane
 *    hung from the arch by 95 mm cables, glowing when lit; 8 m retaining
 *    walls round the field (drawn: the wall round the pitch 9.5 m, to clear the map's pit sides, the
 *    lower tier rising from its top); tallest column 46 m; a funicular (SkyCar) from
 *    the north side to a viewing platform on top.
 *  - Sunken field: the field is below the street (the 8 m retaining
 *    walls); the map's terrain (Mapterhorn, z12 only here) shows the pit
 *    about 6.5 m below the ground round the stadium, so elevation 0: the
 *    terrain already puts the pitch at its lowest point. The street and
 *    the columns' feet are drawn at +7 m; the arch springs at +12 m from
 *    foundation blocks run up to the map's ground there (11-13.5 m).
 *  - Heights: roof rim 45 m (published height), tent peaks 49 m, the roof's
 *    inner edge 52-58 m (the membrane rises from its rim toward the arch,
 *    d6), all ESTIMATED from d1, d6, d7 and d9 against the arch.
 *  - Photos (Flickr, all EVIDENCE):
 *    - d1 Chris Bloom, "Moses Mabhida Stadium", CC BY-SA 2.0 (2009,
 *      building) — the arch's section, the column ring.
 *      https://www.flickr.com/photos/51048785@N00/3263805888
 *    - d2 Sir. Mikhael, "Moses Mabhida Stadium, Durban", CC BY 2.0 — from
 *      the beachfront: the arch over the roof.
 *      https://www.flickr.com/photos/33791380@N08/4085235899
 *    - d4, d5, d7, d9 South African Tourism, "Moses Mabhida Stadium,
 *      Durban, KwaZulu-Natal, South Africa", CC BY 2.0 — the roof from
 *      inside, the split legs with their braces from the top, the folded
 *      roof rim, the seats.
 *      https://www.flickr.com/photos/25779097@N08/20504803572
 *      https://www.flickr.com/photos/25779097@N08/20325195540
 *      https://www.flickr.com/photos/25779097@N08/20504823892
 *      https://www.flickr.com/photos/25779097@N08/19892694813
 *    - d6 Sir. Mikhael, "Moses Mabhida Stadium, Durban", CC BY 2.0 — from
 *      the south, level: the split legs and the ladder braces, the roof's
 *      pleats. https://www.flickr.com/photos/33791380@N08/4085229747
 *  No look-only sources. No commercial imagery. No lidar here.
 *
 * Invented or simplified: the arch's curve is two half-parabolas meeting
 * at the top; the roof is drawn as folds between 48 (64) column peaks;
 * the stands are plain surfaces in one blended seat colour (the real
 * seats are a mosaic of blues, greens and oranges); the cables are drawn
 * 0.3 m thick and at a third of their number, in the detail model only;
 * the SkyCar's cabin is a glazed box at an arbitrary point on its run.
 * Colours: arch and columns #f1f0ea, membrane #ecebe4, concrete #cfcac2,
 * seats #86a0ac (d7, d9), glazing the palette's slate.
 * Doubts: the roof's heights; the column count; the arch's exact curve.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { face } from './phl-independence-hall'
import { bar } from './johannesburg-hillbrow-tower'
import { box, writeModel, type Slot } from './pretoria-union-buildings'

const ID = 'durban-moses-mabhida-stadium'
const NAME = 'Moses Mabhida Stadium'
const ANCHOR: [number, number] = [31.0303995, -29.828989]
const BEARING = 20.8

const se = (t: number, a: number, b: number, e: number) => Math.pow(Math.pow(Math.abs(Math.cos(t) / a), e) + Math.pow(Math.abs(Math.sin(t) / b), e), -1 / e)
const CX = -2.8, CY = -1.5
const OUT = (t: number) => se(t, 136.6, 147.5, 2.3)
const OPEN = (t: number) => se(t, 57, 119, 2.4)
const BOWL = (t: number) => se(t, 46, 64, 4)
const ZST = 7, ZRIM = 45, ZPEAK = 49
/** The roof's inner edge, hung from the arch: highest along the long sides, under the arch's flanks. */
const ZIN = (t: number) => 52 + 6 * Math.cos(t) ** 2

/** The arch: north half single, south half two legs. s in [-1, 1], -1 the south feet, 1 the north foot. */
const YN = 192.2, YS = -185.6
const ZF = 12 // the arch springs from its foundations at the map's ground there
const archZ = (y: number) => ZF + (106 - ZF) * (1 - (y / (y >= 0 ? YN : YS)) ** 2)
function archPoint(s: number, leg: number): V3 {
  if (s >= 0) { const y = s * YN; return [-5.3 * s, y, archZ(y)] }
  const y = -s * YS, f = -s
  return [3.5 * f + leg * 32 * f, y, archZ(y)]
}

/** A square tube along a polyline, side w, its sides kept upright. */
function tube(p: Part, pts: V3[], w: number) {
  const secs = pts.map((P, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const t: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], tl = Math.hypot(...t)
    let side: V3 = [t[1], -t[0], 0]; const sl = Math.hypot(...side) || 1; side = [side[0] / sl, side[1] / sl, 0]
    const up: V3 = [side[1] * t[2] / tl - 0, -side[0] * t[2] / tl, (side[0] * t[1] - side[1] * t[0]) / tl]
    const ul = Math.hypot(...up)
    const u: V3 = [up[0] / ul, up[1] / ul, up[2] / ul]
    const h = w / 2
    return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a1, b1]) => [P[0] + (side[0] * a1 + u[0] * b1) * h, P[1] + (side[1] * a1 + u[1] * b1) * h, P[2] + (side[2] * a1 + u[2] * b1) * h] as V3)
  })
  const cen = (i: number): V3 => pts[i]
  for (let i = 0; i < pts.length - 1; i++) {
    for (let k = 0; k < 4; k++) {
      const j = (k + 1) % 4
      const A = secs[i][k], B = secs[i][j], C = secs[i + 1][j], D = secs[i + 1][k]
      const m: V3 = [(A[0] + B[0] + C[0] + D[0]) / 4 - (cen(i)[0] + cen(i + 1)[0]) / 2, (A[1] + B[1] + C[1] + D[1]) / 4 - (cen(i)[1] + cen(i + 1)[1]) / 2, (A[2] + B[2] + C[2] + D[2]) / 4 - (cen(i)[2] + cen(i + 1)[2]) / 2]
      face(p, [A, B, C, D], m)
    }
  }
}

function build(detail: boolean) {
  const white = new Part(), membrane = new Part(), concrete = new Part(), seats = new Part(), glass = new Part()
  const at = (t: number, r: number, z: number): V3 => [CX + r * Math.cos(t), CY + r * Math.sin(t), z]

  // --- The arch.
  const NS = detail ? 40 : 22
  const north = Array.from({ length: NS + 1 }, (_, i) => archPoint(i / NS, 0))
  tube(white, north, 6)
  for (const leg of [-1, 1]) tube(white, Array.from({ length: NS + 1 }, (_, i) => archPoint(-i / NS, leg)), 5)
  // ladder braces between the south legs (d5, d6)
  for (let i = 1; i <= 6; i++) {
    const s = -0.13 * i - 0.05
    const a = archPoint(s, -1), b = archPoint(s, 1)
    bar(white, a, b, 1.8)
  }
  // feet: concrete blocks at the street
  // (the feet stand where the map's ground is 11-13.5 m over the pitch)
  for (const [P, top] of [[archPoint(1, 0), 12.5], [archPoint(-1, -1), 14.5], [archPoint(-1, 1), 14.5]] as [V3, number][]) box(concrete, P[0] - 5, P[1] - 5, P[0] + 5, P[1] + 5, 0, top)
  // the viewing platform on the top, and the SkyCar on the north leg
  box(concrete, -6, -4, 6, 4, 108.3, 109.0)
  {
    const s = 0.55, P = archPoint(s, 0), Q = archPoint(s + 0.03, 0)
    const d: V3 = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]], L = Math.hypot(...d)
    const t: V3 = [d[0] / L, d[1] / L, d[2] / L]
    const C: V3 = [P[0], P[1], P[2] + 2.5 + 2]
    bar(glass, [C[0] - t[0] * 3.5, C[1] - t[1] * 3.5, C[2] - t[2] * 3.5], [C[0] + t[0] * 3.5, C[1] + t[1] * 3.5, C[2] + t[2] * 3.5], 4)
    if (detail) for (const off of [-1.4, 1.4]) bar(concrete, archPoint(0.02, 0).map((v, k) => v + (k === 0 ? off : k === 2 ? 2.7 : 0)) as V3, archPoint(0.98, 0).map((v, k) => v + (k === 0 ? off : k === 2 ? 2.7 : 0)) as V3, 0.35)
  }

  // --- The roof: folds between peaks over the columns, from the rim in to the opening.
  const NC = detail ? 64 : 48
  const ang = (k: number) => (k / NC) * 2 * Math.PI
  for (let k = 0; k < NC; k++) {
    const t0 = ang(k), t1 = ang(k + 1), tm = (t0 + t1) / 2
    const rimPeak0 = at(t0, OUT(t0), ZPEAK), rimPeak1 = at(t1, OUT(t1), ZPEAK)
    const rimValley = at(tm, OUT(tm) - 1.5, ZRIM)
    const in0 = at(t0, OPEN(t0), ZIN(t0)), in1 = at(t1, OPEN(t1), ZIN(t1)), inM = at(tm, OPEN(tm), ZIN(tm) - 1.5)
    // two triangles a side of the valley line, the folds of the membrane
    face(membrane, [rimPeak0, rimValley, inM], [0, 0, 1])
    face(membrane, [rimPeak0, inM, in0], [0, 0, 1])
    face(membrane, [rimValley, rimPeak1, in1], [0, 0, 1])
    face(membrane, [rimValley, in1, inM], [0, 0, 1])
    // the column under each peak: leaning slightly out, white
    const foot = at(t0, OUT(t0) - 9, ZST), top = at(t0, OUT(t0), ZPEAK - 0.5)
    bar(white, foot, top, 1.1)
    // the edge ring at the rim (compression ring)
    bar(white, at(t0, OUT(t0), ZRIM - 1), at(t1, OUT(t1), ZRIM - 1), 1.0)
  }
  // --- The concourse glazing and the bowl's back, inside the columns.
  for (let k = 0; k < NC; k++) {
    const t0 = ang(k), t1 = ang(k + 1)
    const r = (t: number) => OUT(t) - 12
    const n: V3 = [Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2), 0]
    face(concrete, [at(t0, r(t0), 0), at(t1, r(t1), 0), at(t1, r(t1), ZST), at(t0, r(t0), ZST)], n)
    face(glass, [at(t0, r(t0), ZST), at(t1, r(t1), ZST), at(t1, r(t1), ZST + 9), at(t0, r(t0), ZST + 9)], n)
    face(concrete, [at(t0, r(t0), ZST + 9), at(t1, r(t1), ZST + 9), at(t1, r(t1), ZST + 17), at(t0, r(t0), ZST + 17)], n)
    // the raking back of the upper tier, up to the roof
    face(concrete, [at(t0, r(t0), ZST + 17), at(t1, r(t1), ZST + 17), at(t1, OUT(t1) - 4, ZRIM - 3), at(t0, OUT(t0) - 4, ZRIM - 3)], [n[0], n[1], 0.4])
    // the stands: the 8 m retaining wall, the lower tier, the upper tier
    const inw: V3 = [-n[0], -n[1], 0], up: V3 = [-n[0], -n[1], 1.2]
    const B = (t: number, f: number) => BOWL(t) + ((OUT(t) - 5) - BOWL(t)) * f
    face(concrete, [at(t0, BOWL(t0), 0), at(t1, BOWL(t1), 0), at(t1, BOWL(t1), 9.5), at(t0, BOWL(t0), 9.5)], inw)
    face(seats, [at(t0, B(t0, 0), 9.5), at(t1, B(t1, 0), 9.5), at(t1, B(t1, 0.38), 22), at(t0, B(t0, 0.38), 22)], up)
    face(concrete, [at(t0, B(t0, 0.38), 22), at(t1, B(t1, 0.38), 22), at(t1, B(t1, 0.4), 25), at(t0, B(t0, 0.4), 25)], inw)
    face(seats, [at(t0, B(t0, 0.4), 25), at(t1, B(t1, 0.4), 21.5), at(t1, B(t1, 0.95), ZRIM - 3.5), at(t0, B(t0, 0.95), ZRIM - 3.5)], up)
  }
  // --- The cables from the arch down to the roof's inner edge (detail only).
  if (detail) {
    const NCab = 40
    for (let i = 0; i < NCab; i++) {
      const t = ((i + 0.5) / NCab) * 2 * Math.PI
      const P = at(t, OPEN(t), ZIN(t))
      const yy = Math.max(YS * 0.85, Math.min(YN * 0.85, P[1]))
      const s = yy >= 0 ? yy / YN : -yy / YS
      const A = archPoint(s, yy >= 0 ? 0 : P[0] > 3.5 * (-s) ? 1 : -1)
      bar(white, A, P, 0.3)
    }
  }

  const floodArch = (_p: V3, n: V3) => (n[2] < -0.3 ? 0.9 : 0.6)
  return [
    { part: white, material: { ...finish('mms-arch-white', 0xf1f0ea), floodlight: floodArch } },
    { part: membrane, material: { ...finish('mms-membrane', 0xecebe4), doubleSided: true, floodlight: (_p: V3, n: V3) => (n[2] < 0 ? 0.9 : 0.5) } },
    { part: concrete, material: finish('mms-concrete', 0xcfcac2) },
    { part: seats, material: finish('mms-seats', 0x86a0ac) },
    { part: glass, material: PALETTE.window },
  ] as Slot[]
}

if (import.meta.main) {
  const extras = { anchor: ANCHOR, bearing: BEARING }
  await writeModel(`${ID}.glb`, NAME, build(false), extras, 6500, 250_000)
  await writeModel(`${ID}.detail.glb`, NAME, build(true), extras, 40_000, 1_536_000)
}
