/**
 * King Street Station (1906, Reed & Stem), Seattle: procedural, CC0-1.0.
 * bun generators/sea-king-street-station.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the walls run within
 * a degree of true north in the lidar). The origin is the area centroid of
 * OSM way/4725281 (the outline); y = 0 is the ground around the building
 * (5.3 m NAVD88), which is flat on all four sides (lidar ground returns).
 *
 * Form: an L-shaped, three-storey red-brick block under one hipped roof of
 * green tile, a long wing running north-south and a shorter one running west
 * along the south end, with the campanile (after St Mark's in Venice) in the
 * inside corner of the L: a brick shaft with recessed panels, an arcaded
 * belfry, a heavy cornice, a narrower clock stage with a clock on each face,
 * and a steep slate pyramid. A flat-roofed one-storey annex runs along the
 * north end and up the west side of the long wing.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 0.5 m surface model, heights above
 * the ground; OSM sits ~1 m west of the lidar, so the plan is taken from the
 * lidar):
 * - roof eaves at 16.6-16.8 m, both ridges at 23.0 m (lidar max 23.0); eave
 *   lines x -6.3..19.3 (long wing) and y -28.75..-3.2 (south wing);
 * - the annex roof at 10.5 m;
 * - the tower: 11 m square at its belfry cornice, 50.7 m; the clock stage
 *   8.5-9 m across with its cornice at 60.4 m; the pyramid rising from
 *   there, lidar points to 74.6 m near the tip (finial).
 * Published: tower 242 ft (73.8 m) to the finial (Wikipedia, "King Street
 * Station"); OSM part way/442511849 74 m.
 * From photos: the tower's stage proportions (belfry 4.6 m, clock stage
 * 8.5 m, pyramid base 0.56 of the shaft's width and 1.65 times as tall), the
 * clock diameter (about 0.4 of the clock stage), three belfry arches and
 * three shaft panels a face, the white cornice and stone base of the hall,
 * the bay rhythm (about 4.3 m), colours.
 * Estimated: wall lines 0.8 m inside the lidar eaves; the window grouping
 * (one panel per bay for the ground floor, one for the two upper floors).
 * Left out: the platform canopies and the Jackson Street plaza deck (not the
 * building), the lettering on the cornice (signage), the pyramid's small
 * dormers and railings, the clock hands (too thin to read).
 *
 * Photos: see /tmp/city/sea/work/sea-king-street-station/credits.txt
 * ("Amtrak: King Street Station" by Loco Steve, CC BY 2.0, from the
 * north-west; "Fourth Avenue South (brighter)", Dominikosaurus, CC BY-SA 3.0,
 * from the south-east; "Seattle - King Street Station 03" and "08", Joe
 * Mabel, CC BY-SA 3.0, from the north and south; "King Street Station and
 * Seattle skyline from I-90 ramp", SounderBruce, CC BY-SA 4.0, from the
 * south; "KING STREET STATION SEATTLE WA - panoramio", Loco Steve, CC BY 3.0,
 * from the south along the tracks).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const brick = new Part()   // red brick walls
const trim = new Part()    // stone cornices, base, clock rims
const tile = new Part()    // the green tile roof
const slate = new Part()   // the spire, the annex's flat roof
const win = new Part()     // windows
const clock = new Part()   // the clock faces (lit at night)

/** A polygon facing `n`, fanned from its first corner. */
function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}

/** A rectangle with its corners cut by `c`, counter-clockwise. */
function chamferRect(x0: number, y0: number, x1: number, y1: number, c: number): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

/** A vertical prism over a ring (counter-clockwise), with optional caps. */
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  const n = ring.length
  for (let i = 0; i < n; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[(i + 1) % n]
    p.quad([ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1])
  }
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}

/** A centred square block, chamfered. */
const sq = (p: Part, cx: number, cy: number, h: number, z0: number, z1: number, c = 0.35, top = true, bottom = false) =>
  prism(p, chamferRect(cx - h, cy - h, cx + h, cy + h, c), z0, z1, top, bottom)

/**
 * A flat panel on a wall: `o` a point on the wall at the panel's centre
 * line, `t` the unit direction along the wall, `n` its outward normal.
 * The top is a semicircle when `arch` is set (width / 2 radius).
 */
function panel(p: Part, o: XY, t: XY, n: XY, w: number, z0: number, z1: number, arch = false, off = 0.05) {
  const at = (s: number, z: number): V3 => [o[0] + t[0] * s + n[0] * off, o[1] + t[1] * s + n[1] * off, z]
  const nn: V3 = [n[0], n[1], 0]
  if (!arch) return poly(p, [at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1)], nn)
  const r = w / 2, zs = z1 - r
  const pts: V3[] = [at(-r, z0), at(r, z0)]
  for (let k = 0; k <= 10; k++) {
    const a = (k / 10) * Math.PI
    pts.push(at(r * Math.cos(a), zs + r * Math.sin(a)))
  }
  poly(p, pts, nn)
}

/** A disc on a wall, for the clocks. */
function disc(p: Part, o: XY, t: XY, n: XY, zc: number, r: number, off: number, seg = 16) {
  const c: V3 = [o[0] + n[0] * off, o[1] + n[1] * off, zc]
  for (let k = 0; k < seg; k++) {
    const a0 = (k / seg) * 2 * Math.PI, a1 = ((k + 1) / seg) * 2 * Math.PI
    const P = (a: number): V3 => [c[0] + t[0] * r * Math.cos(a), c[1] + t[1] * r * Math.cos(a), zc + r * Math.sin(a)]
    poly(p, [c, P(a0), P(a1)], [n[0], n[1], 0])
  }
}

// ------------------------------------------------------------- the hall ---
// The L in plan. Eave lines from the lidar; both wings 25.6 m across the
// eaves so the hips meet in one junction at equal ridge heights.
const EAVE = 16.6, RIDGE = 23.0, OVER = 0.8
const AX0 = -6.3, AX1 = 19.3           // long wing, eave lines
const BY0 = -28.75, BY1 = -3.15        // south wing
const AY1 = 28.25, BX0 = -24.7         // north end, west end
const HALF = (AX1 - AX0) / 2           // 12.8, the same for both wings
const JX = AX0 + HALF, JY = BY0 + HALF // where the ridges meet
const WALL: XY[] = [
  [BX0 + OVER, BY0 + OVER], [AX1 - OVER, BY0 + OVER], [AX1 - OVER, AY1 - OVER],
  [AX0 + OVER, AY1 - OVER], [AX0 + OVER, BY1 - OVER], [BX0 + OVER, BY1 - OVER],
]
const EAVES: XY[] = [[BX0, BY0], [AX1, BY0], [AX1, AY1], [AX0, AY1], [AX0, BY1], [BX0, BY1]]
const CORNICE0 = 15.2, BASE = 1.0

// Walls: a stone base, brick to the cornice. The top is under the roof.
prism(trim, WALL, 0, BASE, false)
prism(brick, WALL, BASE, CORNICE0, false)
// The cornice: a white band out to the eave line, with its soffit.
{
  const n = EAVES.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = EAVES[i], b = EAVES[j], wa = WALL[i], wb = WALL[j]
    trim.quad([a[0], a[1], CORNICE0 + 0.4], [b[0], b[1], CORNICE0 + 0.4], [b[0], b[1], EAVE], [a[0], a[1], EAVE])
    // A sloped underside from the wall out to the band.
    poly(trim, [[wa[0], wa[1], CORNICE0], [wb[0], wb[1], CORNICE0], [b[0], b[1], CORNICE0 + 0.4], [a[0], a[1], CORNICE0 + 0.4]], [0, 0, -1])
  }
}
// The roof: six planes meeting along two ridges.
{
  const E = (x: number, y: number): V3 => [x, y, EAVE]
  const Rr = (x: number, y: number): V3 => [x, y, RIDGE]
  const J = Rr(JX, JY), N = Rr(JX, AY1 - HALF), W = Rr(BX0 + HALF, JY)
  const up = (P: V3[]) => poly(tile, P, [0, 0, 1])
  up([E(AX1, BY0), E(AX1, AY1), N, J])          // east
  up([E(AX1, AY1), E(AX0, AY1), N])             // north hip
  up([E(AX0, AY1), E(AX0, BY1), J, N])          // west of the long wing
  up([E(AX0, BY1), E(BX0, BY1), W, J])          // north of the south wing
  up([E(BX0, BY1), E(BX0, BY0), W])             // west hip
  up([E(BX0, BY0), E(AX1, BY0), J, W])          // south
}
// Windows: a tall ground-floor window per bay and one panel over the two
// upper floors, on every wall clear of the tower and the annex.
{
  const n = WALL.length
  for (let i = 0; i < n; i++) {
    const a = WALL[i], b = WALL[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [t[1], -t[0]]
    const bays = Math.max(1, Math.round((L - 3) / 4.3))
    const step = (L - 3) / bays
    for (let k = 0; k < bays; k++) {
      const s = 1.5 + step * (k + 0.5)
      const o: XY = [a[0] + t[0] * s, a[1] + t[1] * s]
      // Skip what the tower and the annex cover.
      const inTower = o[0] > -15.5 && o[0] < -3.9 && o[1] > -5.5 && o[1] < 6.1
      const inAnnexN = o[1] > 27 && o[0] > -10.5 && i === 2 // north wall
      const inAnnexW = i === 3 && o[1] > 13.0                // long wing's west wall
      if (inTower) continue
      if (!inAnnexN && !inAnnexW) panel(win, o, t, nrm, 1.9, 1.6, 5.6, true)
      // Above the annex roof only the top floor shows.
      panel(win, o, t, nrm, 1.7, inAnnexN || inAnnexW ? 11.3 : 7.0, 13.4)
    }
  }
}

// ------------------------------------------------------------ the annex ---
{
  const AH = 10.5
  for (const r of [chamferRect(-9.7, 27.0, 19.3, 33.75, 0.3), chamferRect(-9.7, 13.75, -5.0, 27.3, 0.3)]) {
    prism(trim, r, 0, BASE, false)
    prism(brick, r, BASE, AH - 0.8, false)
    prism(trim, r, AH - 0.8, AH, false)
    poly(slate, r.map(([x, y]) => [x, y, AH] as V3), [0, 0, 1])
  }
  // Ground-floor windows along the north and west faces.
  for (let x = -6; x <= 16; x += 4.4) panel(win, [x, 33.75], [1, 0], [0, 1], 2.0, 1.8, 7.6, true)
  for (let y = 16.5; y <= 31; y += 4.4) panel(win, [-9.7, y], [0, -1], [-1, 0], 2.0, 1.8, 7.6, true)
}

// ------------------------------------------------------------ the tower ---
{
  const CX = -9.7, CY = 0.3
  const S = 5.0                 // the shaft's half width
  const faces: Array<{ t: XY; n: XY }> = [
    { t: [1, 0], n: [0, -1] }, { t: [0, 1], n: [1, 0] }, { t: [-1, 0], n: [0, 1] }, { t: [0, -1], n: [-1, 0] },
  ]
  const onFace = (f: { t: XY; n: XY }, h: number, s: number): XY => [CX + f.n[0] * h + f.t[0] * s, CY + f.n[1] * h + f.t[1] * s]

  // Shaft: a core set back 0.3 m, with corner piers and two between, so the
  // three long recessed panels of each face read; a stone base.
  sq(trim, CX, CY, S + 0.2, 0, 1.4, 0.3, false)
  sq(brick, CX, CY, S - 0.3, 1.4, 43.8, 0.0, false)
  for (const f of faces) {
    for (const s of [-1.55, 1.55]) {
      const c = onFace(f, S - 0.15, s)
      const ax = f.t
      const pier: XY[] = [
        [c[0] - ax[0] * 0.45 - f.n[0] * 0.15, c[1] - ax[1] * 0.45 - f.n[1] * 0.15],
        [c[0] + ax[0] * 0.45 - f.n[0] * 0.15, c[1] + ax[1] * 0.45 - f.n[1] * 0.15],
        [c[0] + ax[0] * 0.45 + f.n[0] * 0.15, c[1] + ax[1] * 0.45 + f.n[1] * 0.15],
        [c[0] - ax[0] * 0.45 + f.n[0] * 0.15, c[1] - ax[1] * 0.45 + f.n[1] * 0.15],
      ]
      // Wind counter-clockwise whichever way the face points.
      const area = pier.reduce((s2, p, i) => { const q = pier[(i + 1) % 4]; return s2 + p[0] * q[1] - q[0] * p[1] }, 0)
      prism(brick, area > 0 ? pier : [...pier].reverse(), 1.4, 43.8, false)
    }
  }
  // Corner piers: L-shaped, as an outer square ring at the corners.
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = CX + sx * S, y0 = CY + sy * S
    const r = chamferRect(Math.min(x0, x0 - sx * 1.3), Math.min(y0, y0 - sy * 1.3), Math.max(x0, x0 - sx * 1.3), Math.max(y0, y0 - sy * 1.3), 0)
    prism(brick, r, 1.4, 43.8, false)
  }
  // The panels' heads: a full-width band above them.
  sq(brick, CX, CY, S, 43.8, 45.3, 0.3, false)
  sq(trim, CX, CY, S + 0.3, 45.3, 46.6, 0.3, true, true)        // string course and balustrade
  sq(brick, CX, CY, S - 0.05, 46.6, 50.0, 0.3, false)            // belfry
  for (const f of faces) for (const s of [-2.6, 0, 2.6]) panel(win, onFace(f, S - 0.05, s), f.t, f.n, 1.8, 46.9, 49.6, true)
  sq(trim, CX, CY, S + 0.6, 50.0, 50.9, 0.4, true, true)         // the belfry's heavy cornice
  // The clock stage, narrower, with stone corner quoins.
  const C = 4.35
  sq(brick, CX, CY, C, 50.9, 59.6, 0.0, false)
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x0 = CX + sx * C, y0 = CY + sy * C
    prism(trim, chamferRect(Math.min(x0 + sx * 0.08, x0 - sx * 0.9), Math.min(y0 + sy * 0.08, y0 - sy * 0.9), Math.max(x0 + sx * 0.08, x0 - sx * 0.9), Math.max(y0 + sy * 0.08, y0 - sy * 0.9), 0), 50.9, 59.6, false)
  }
  for (const f of faces) {
    disc(trim, onFace(f, C, 0), f.t, f.n, 55.2, 1.95, 0.08)
    disc(clock, onFace(f, C, 0), f.t, f.n, 55.2, 1.55, 0.14)
  }
  sq(trim, CX, CY, C + 0.5, 59.6, 60.4, 0.35, true, true)       // top cornice
  // The pyramid: steep, 6.2 m at its base, to 71 m; a short finial.
  const P = 3.1, TIP = 71.0
  const base = (sx: number, sy: number): V3 => [CX + sx * P, CY + sy * P, 60.4]
  const tip: V3 = [CX, CY, TIP]
  const corners = [base(-1, -1), base(1, -1), base(1, 1), base(-1, 1)]
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4]
    slate.tri(a, b, tip)
  }
  sq(trim, CX, CY, P + 0.3, 60.4, 61.0, 0.2, true)             // the pyramid's base course
  sq(slate, CX, CY, 0.28, TIP - 0.6, 73.8, 0.08, true)          // finial
}

// ---------------------------------------------------------------- output ---
// Colours from the daylight photos (Loco Steve's 2012 view; Dominikosaurus's
// from 4th Avenue): a deep red-brown brick pulled light, the white cornices,
// the green tile roof restored in 2013, the slate-violet spire, pale clock
// glass.
const parts = [
  { part: brick, material: finish('kss-brick', 0xa9665a) },
  { part: trim, material: PALETTE.trim },
  { part: tile, material: finish('kss-green-tile', 0x6f9a80) },
  { part: slate, material: finish('kss-slate', 0x6e6978) },
  { part: win, material: PALETTE.window },
  { part: clock, material: windowVariant(2, 0xdfe3df) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('King Street Station', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 73.8,
})
await Bun.write(new URL('../models/sea-king-street-station.glb', import.meta.url), glb)
console.log(`sea-king-street-station.glb: ${triangles} triangles, ${glb.length} bytes`)
