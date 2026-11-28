/**
 * Old South Meeting House, 310 Washington Street at Milk Street, Boston
 * (1729, Robert Twelves; builder Joshua Blanchard) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-old-south-meeting-house.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 31: the hall runs along Milk Street at 121°, so x
 * runs along the hall, the tower at -x on Washington Street (west-north-
 * west), the hipped east end at +x; +y is the north side, -y Milk Street.
 * Anchor = the centroid of OSM way/29620426, -71.0583758, 42.3569900.
 *
 * Identity (from the photos below):
 *  1. The steeple, which is the landmark: a tall square brick tower with a
 *     clock, oculi and louvred round-headed openings at the top, a white
 *     modillion cornice and balustrade with urns at the corners, an open
 *     octagonal white loggia of arches on columns round a louvred core, a
 *     ring of eight small pedimented lucarnes, and a tall slender octagonal
 *     green copper spire with a gilt ball and a weathervane.
 *  2. A plain red-brick (Flemish bond) meeting house with two tiers of
 *     round-headed sash windows, a belt course between them, a white eaves
 *     cornice, a dark slate roof gabled to Washington Street and hipped at
 *     the east end, an oculus in the gable.
 *  3. The tower stands centred on the west gable and carries the main door.
 *
 * Plan: USGS lidar, not OSM. OSM way/29620426 draws the west wall at
 * x = -9.5 and the tower over the south half of the west end; the 2021 lidar
 * (and NAIP) show a 29.3 × 20.9 m hall (x -13.3..16.0, y -10.4..10.5) — the
 * published 93–95 × 66–68 ft (Wikipedia, citing Benes 2012) — with the
 * 6.3 m tower centred on the west gable (x -18.3..-12.0, y -3.6..2.7). The
 * east and long walls agree with OSM within 0.5 m. The small one-storey
 * annex on the east end (x 16.0..19.2, y -1.8..6.1) is in OSM's outline and
 * in the lidar (about 8 m to its eaves).
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid, read
 * with tools/lidar_frame.py. y = 0 is the lowest ground, at the south-east
 * corner on Milk Street (0.9 above the grid's ground_min); Washington Street
 * at the tower is 1.5 up (the Mapterhorn terrain agrees). Measured: eaves
 * 12.4, ridge 20.1, the hip from x 10.5; the tower's cornice 26.4 and the
 * urns 28.4; the loggia's entablature 32.6; the lucarne ring 37.4. The spire is too thin
 * for the lidar, so the steeple above the lucarnes is scaled from the HABS
 * photo (Hubbard, below; a view-camera shot with parallel verticals) against
 * the lidar's tower cornice and lucarnes: spire apex 49.0, vane tip 52.2
 * (50.7 above Washington Street). Wikipedia (citing the NPS) gives 183 ft
 * (55.8 m) for the tower with its steeple, sometimes 180 ft; neither fits the
 * photo and the lidar together, which put the vane 5 m lower. The lidar and
 * HABS photo agree within 1 m at the cornice, loggia and lucarnes.
 *
 * Estimated from the photos: window and belt heights (scaled from the
 * 12.4 m eaves in the Crisco 1492 photo), the tower's belts (4.8, 10.7,
 * 16.6), clock (centre 19.3, 2.75 m across), louvred openings (21.4..24.8)
 * and brick top (25.6) from the HABS photo;
 * the loggia (5.7 m across, columns 26.7..30.4), the lucarnes and the
 * spire's base (2.3 m across) from the Beyond My Ken close-up against the
 * 6.3 m tower.
 *
 * Ground: falls 1.5 m from Washington Street to the east end; elevation 0.
 * The tower door sits at the street (1.5); the uphill walls run down to 0.
 *
 * Night: the steeple is floodlit white; the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Old South Meeting House, Boston, MA, 2023-02-21 01.jpg, Crisco 1492,
 *    CC BY-SA 4.0 (tower and north side from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Old_South_Meeting_House,_Boston,_MA,_2023-02-21_01.jpg
 *  - 2017 Old South Meeting House steeple 3.jpg, Beyond My Ken, CC BY-SA 4.0
 *    (the loggia, lucarnes and spire close up)
 *    https://commons.wikimedia.org/wiki/File:2017_Old_South_Meeting_House_steeple_3.jpg
 *  - Boston Old South Meeting House NW PICT0018 19940925.jpg, Karlunun,
 *    CC BY-SA 4.0 (the west gable and tower square on)
 *    https://commons.wikimedia.org/wiki/File:Boston_Old_South_Meeting_House_NW_PICT0018_19940925.jpg
 *  - Old South Meetinghouse, Milk and Washington Sts. Downtown.jpg, Hsin Ju
 *    HSU, CC BY-SA 3.0 (the tower's west face and door)
 *    https://commons.wikimedia.org/wiki/File:Old_South_Meetinghouse,_Milk_and_Washington_Sts._Downtown.jpg
 *  - Old South Meetinghouse BW.jpg, Cortlandt V.D. Hubbard (HABS), public
 *    domain (the tower's west face and steeple from Washington Street)
 *    https://commons.wikimedia.org/wiki/File:Old_South_Meetinghouse_BW.jpg
 *  - Old South Meeting House (53826239858).jpg, Ethan Long, CC BY-SA 2.0
 *    (the steeple from the south-east)
 *    https://commons.wikimedia.org/wiki/File:Old_South_Meeting_House_(53826239858).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the Milk Street (south) side and the east end are not in the
 * photos used; seven bays and a central door are drawn on the south side
 * like the north. The clock is photographed on the tower's north face only;
 * it is drawn on the south face too. The roof ventilators, the spire's small
 * oculi and the modillions are left out. The east annex is drawn plain.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), spire = new Part(), gold = new Part()

const X0 = -13.3, X1 = 16.0, Y0 = -10.4, Y1 = 10.5, EAVE = 12.4, RIDGE = 20.1, HIP = 10.5
const ST = 1.5 // Washington Street at the tower
const YM = (Y0 + Y1) / 2

/** A flat polygon, wound to face `out`. */
function poly(p: Part, pts: V3[], out: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}

// ── Hall ──
box(brick, X0, X1, Y0, Y1, 0, EAVE, null, 0)
cornice(trim, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], EAVE - 0.5, 0.55, 0.45, null)
cornice(trim, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], 5.5, 0.3, 0.1, null) // belt course
{
  const o = 0.5, ez = EAVE - 0.35, s = (RIDGE - EAVE) / (YM - Y0)
  const lo = EAVE - o * s
  const A: V3 = [X0 - 0.35, Y0 - o, lo], B: V3 = [X1 + o, Y0 - o, lo], C: V3 = [X1 + o, Y1 + o, lo], D: V3 = [X0 - 0.35, Y1 + o, lo]
  const R0: V3 = [X0 - 0.35, YM, RIDGE], R1: V3 = [HIP, YM, RIDGE]
  poly(roof, [A, B, R1, R0], [0, -1, 1])
  poly(roof, [C, D, R0, R1], [0, 1, 1])
  poly(roof, [B, C, R1], [1, 0, 1])
  poly(roof, [A, D, C, B], [0, 0, -1])
  void ez
  // the west gable in brick, its raking cornices white
  poly(brick, [[X0, Y0, EAVE], [X0, Y1, EAVE], [X0, YM, RIDGE]], [-1, 0, 0])
  for (const k of [Y0 - 0.5, Y1 + 0.5]) {
    const sec = (y: number, z: number): V3[] => [[X0 - 0.4, y, z], [X0 + 0.05, y, z], [X0 + 0.05, y, z - 0.45], [X0 - 0.4, y, z - 0.45]]
    trim.sweep([sec(k, lo + 0.05), sec(YM, RIDGE + 0.12)])
  }
}

type F = [XY, XY]
// Faces run with the outside on the right; s is metres along them.
const SOUTH: F = [[X0, Y0], [X1, Y0]], NORTH: F = [[X1, Y1], [X0, Y1]], EAST: F = [[X1, Y0], [X1, Y1]]
const WEST_S: F = [[X0, -3.6], [X0, Y0]], WEST_N: F = [[X0, Y1], [X0, 2.7]]

function arched(f: F, s: number, z0: number, w: number, zs: number) {
  onWall(trim, f[0], f[1], archShape(s, w + 0.3, z0 - 0.15, zs, 10), 0.03)
  onWall(win, f[0], f[1], archShape(s, w, z0, zs, 10), 0.06)
}
function oculus(f: F, s: number, z: number, r: number) {
  const c = (rr: number) => Array.from({ length: 12 }, (_, i) => [s + rr * Math.cos((i / 12) * Math.PI * 2), z + rr * Math.sin((i / 12) * Math.PI * 2)] as [number, number])
  onWall(trim, f[0], f[1], c(r + 0.18), 0.03)
  onWall(win, f[0], f[1], c(r), 0.06)
}
// Long sides: seven bays, two tiers of round-headed windows.
for (const f of [SOUTH, NORTH]) {
  const L = X1 - X0
  for (let k = -3; k <= 3; k++) {
    const s = L / 2 + k * 3.7
    if (k === 0 && f === SOUTH) {
      onWall(trim, f[0], f[1], archShape(s, 2.0, 0, 3.0, 10), 0.03)
      onWall(roof, f[0], f[1], rectShape(s - 0.75, s + 0.75, 0, 2.9), 0.06)
      onWall(win, f[0], f[1], archShape(s, 1.5, 2.95, 3.0, 10), 0.06)
    } else arched(f, s, 1.8, 1.45, 4.0)
    arched(f, s, 6.6, 1.55, 9.8)
  }
}
// West gable either side of the tower: a window a tier, an oculus high up.
for (const f of [WEST_S, WEST_N]) {
  const L = Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
  arched(f, L / 2, 2.2 + ST * 0.5, 1.45, 4.3)
  arched(f, L / 2, 6.6, 1.55, 9.8)
  oculus(f, L * 0.45, 14.2, 0.45)
}
// East end: three bays.
for (const d of [-6, 0, 6]) {
  arched(EAST, (Y1 - Y0) / 2 + d, 1.8, 1.45, 4.0)
  arched(EAST, (Y1 - Y0) / 2 + d, 6.6, 1.55, 9.8)
}
// East annex.
box(brick, X1, 19.2, -1.8, 6.1, 0, 7.6, null, 0)
poly(roof, [[19.4, -2.0, 7.6], [19.4, 6.3, 7.6], [X1, 6.3, 9.4], [X1, -2.0, 9.4]], [1, 0, 1])
poly(roof, [[19.2, -1.8, 7.6], [X1, -1.8, 9.4], [X1, -1.8, 7.6]], [0, -1, 0])
poly(roof, [[19.2, 6.1, 7.6], [X1, 6.1, 9.4], [X1, 6.1, 7.6]], [0, 1, 0])

// ── Tower ──
const TX0 = -18.3, TX1 = -12.0, TY0 = -3.6, TY1 = 2.7, TC: XY = [(TX0 + TX1) / 2, (TY0 + TY1) / 2], TH = 3.15
const TTOP = 25.6
box(brick, TX0, TX1, TY0, TY1, 0, TTOP, null, 0)
const tring: XY[] = [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]
for (const z of [4.8, 10.7, 16.6]) cornice(trim, tring, z, 0.28, 0.08, null)
{
  const TW: F = [[TX0, TY1], [TX0, TY0]], TS: F = [[TX0, TY0], [TX1, TY0]], TN: F = [[TX1, TY1], [TX0, TY1]], TE: F = [[TX1, TY0], [TX1, TY1]]
  // west face: the door, two round-headed windows, an oculus, the louvred opening
  onWall(trim, TW[0], TW[1], archShape(TH, 1.9, ST, ST + 2.7, 10), 0.03)
  onWall(roof, TW[0], TW[1], rectShape(TH - 0.75, TH + 0.75, ST, ST + 2.6), 0.06)
  onWall(win, TW[0], TW[1], archShape(TH, 1.5, ST + 2.65, ST + 2.7, 10), 0.06)
  arched(TW, TH, 6.6, 1.3, 9.2)
  arched(TW, TH, 12.5, 1.3, 15.0)
  oculus(TW, TH, 19.3, 0.5)
  for (const f of [TW, TS, TN, TE]) {
    onWall(trim, f[0], f[1], archShape(TH, 1.7, 21.4, 23.9, 10), 0.03)
    onWall(roof, f[0], f[1], archShape(TH, 1.4, 21.6, 23.9, 10), 0.06)
  }
  for (const f of [TS, TN]) {
    oculus(f, TH, 8.5, 0.45)
    oculus(f, TH, 14.2, 0.45)
    // the clock: a black dial in a white ring, gilt hands
    const c = (r: number) => Array.from({ length: 16 }, (_, i) => [TH + r * Math.cos((i / 16) * Math.PI * 2), 19.3 + r * Math.sin((i / 16) * Math.PI * 2)] as [number, number])
    onWall(trim, f[0], f[1], c(1.38), 0.03)
    onWall(roof, f[0], f[1], c(1.22), 0.06)
    onWall(gold, f[0], f[1], rectShape(TH - 0.07, TH + 0.07, 19.25, 20.15), 0.08)
    onWall(gold, f[0], f[1], [[TH - 0.05, 19.25], [TH + 0.6, 19.55], [TH + 0.55, 19.65], [TH - 0.05, 19.4]], 0.08)
  }
}
// Cornice and balustrade with urns at the corners.
cornice(trim, tring, TTOP, 0.8, 0.5, trim)
const [cx, cy] = TC
box(trim, cx - 2.85, cx + 2.85, cy - 2.85, cy + 2.85, TTOP + 0.8, 27.6, trim, 0.06)
for (const [a, b] of [[[cx - 2.85, cy - 2.85], [cx + 2.85, cy - 2.85]], [[cx + 2.85, cy - 2.85], [cx + 2.85, cy + 2.85]], [[cx + 2.85, cy + 2.85], [cx - 2.85, cy + 2.85]], [[cx - 2.85, cy + 2.85], [cx - 2.85, cy - 2.85]]] as F[])
  for (const s of [1.5, 4.2]) onWall(roof, a, b, rectShape(s - 1.05, s + 1.05, TTOP + 1.0, 27.35), 0.03) // the balusters' shadow
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  box(trim, cx + sx * 2.85 - 0.3, cx + sx * 2.85 + 0.3, cy + sy * 2.85 - 0.3, cy + sy * 2.85 + 0.3, TTOP + 0.8, 27.75, trim, 0.05)
  revolve(trim, [cx + sx * 2.85, cy + sy * 2.85], [[0, 27.75], [0.2, 27.8], [0.27, 28.0], [0.14, 28.2], [0, 28.4]], 6, 0, true, false)
}

// ── Octagonal loggia: columns and arches round a louvred core ──
const R8 = 1 / Math.cos(Math.PI / 8)
const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 8 + (i / 8) * Math.PI * 2
  return [cx + r * R8 * Math.cos(a), cy + r * R8 * Math.sin(a)] as XY
})
const LZ0 = TTOP + 0.8, SPRING = 30.4, ENT = 31.4, LTOP = 32.6
const ov = (r: number) => r * R8 // an octagon's corner radius from its flat
revolve(trim, [cx, cy], [[ov(2.6), LZ0], [ov(2.6), LZ0 + 0.3], [ov(2.0), LZ0 + 0.3], [ov(2.0), ENT], [0, ENT]], 8, Math.PI / 8, true, false)
{
  const o = oct(2.0)
  for (let i = 0; i < 8; i++) {
    const a = o[i], b = o[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(roof, a, b, archShape(L / 2, L * 0.62, 26.0, 29.6, 8), 0.04) // the louvres in shadow
  }
}
{
  const o = oct(2.75)
  for (const c of o) revolve(trim, c, [[0.2, LZ0 + 0.3], [0.2, SPRING], [0.3, SPRING + 0.1], [0.3, SPRING + 0.25], [0, SPRING + 0.25]], 8, 0, true, false)
  // arch spandrels and the entablature, on the outer octagon
  for (let i = 0; i < 8; i++) {
    const a = o[i], b = o[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1]), r = L / 2 - 0.2
    const arc = Array.from({ length: 7 }, (_, k) => [L / 2 - r * Math.cos((k / 6) * (Math.PI / 2)), SPRING + r * Math.sin((k / 6) * (Math.PI / 2))] as [number, number])
    for (const side of [0, 1]) {
      const m = (q: [number, number]): [number, number] => (side ? [L - q[0], q[1]] : q)
      const corner: [number, number] = m([0, ENT])
      for (let k = -1; k < arc.length - 1; k++) {
        const p0 = k < 0 ? m([0, SPRING]) : m(arc[k]), p1 = m(arc[k + 1])
        onWall(trim, a, b, [corner, p0, p1], 0)
      }
      onWall(trim, a, b, [corner, m(arc[arc.length - 1]), m([L / 2, ENT])], 0)
    }
  }
  revolve(trim, [cx, cy], [[ov(2.75), ENT], [ov(2.95), ENT + 0.3], [ov(2.95), LTOP - 0.25], [ov(3.1), LTOP], [0, LTOP]], 8, Math.PI / 8, true, false)
}
// The low copper roof of the loggia, the eight lucarnes and the spire.
revolve(spire, [cx, cy], [[ov(3.05), LTOP], [ov(2.2), 33.1], [ov(1.15), 33.2], [0, 33.2]], 8, Math.PI / 8, true, false)
for (let i = 0; i < 8; i++) {
  const ang = (i / 8) * Math.PI * 2, u: XY = [Math.cos(ang), Math.sin(ang)], v: XY = [-u[1], u[0]]
  const P = (r: number, t: number, z: number): V3 => [cx + u[0] * r + v[0] * t, cy + u[1] * r + v[1] * t, z]
  const r0 = 0.9, r1 = 1.95, w = 0.48, z0 = 33.0, z1 = 36.4, zr = 37.4
  const ring: V3[] = [P(r0, -w, 0), P(r1, -w, 0), P(r1, w, 0), P(r0, w, 0)]
  for (let k = 0; k < 4; k++) {
    const A = ring[k], B = ring[(k + 1) % 4]
    poly(trim, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], [(A[0] + B[0]) / 2 - (cx + u[0] * 1.5), (A[1] + B[1]) / 2 - (cy + u[1] * 1.5), 0])
  }
  poly(roof, [P(r1 + 0.03, -0.3, 34.4), P(r1 + 0.03, 0.3, 34.4), P(r1 + 0.03, 0.3, 36.0), P(r1 + 0.03, -0.3, 36.0)], [u[0], u[1], 0])
  poly(trim, [P(r1 + 0.05, -w - 0.08, z1), P(r1 + 0.05, w + 0.08, z1), P(r1 + 0.05, 0, zr)], [u[0], u[1], 0])
  poly(spire, [P(r1 + 0.05, -w - 0.08, z1), P(r1 + 0.05, 0, zr), P(r0, 0, zr), P(r0, -w - 0.08, z1)], [v[0] * -1, v[1] * -1, 1])
  poly(spire, [P(r1 + 0.05, w + 0.08, z1), P(r0, w + 0.08, z1), P(r0, 0, zr), P(r1 + 0.05, 0, zr)], [v[0], v[1], 1])
}
revolve(spire, [cx, cy], [[ov(1.15), 33.2], [ov(1.15), 33.8], [0, 49.0]], 8, Math.PI / 8, true, false)
// gilt ball, rod and vane
revolve(gold, [cx, cy], [[0.06, 48.8], [0.26, 49.0], [0.32, 49.3], [0.26, 49.6], [0.06, 49.8], [0.06, 51.9], [0, 52.2]], 8, 0, true, false)
box(gold, cx - 0.05, cx + 0.05, cy - 0.6, cy + 0.6, 50.5, 50.6, gold, 0)
box(gold, cx - 0.7, cx + 0.7, cy - 0.05, cy + 0.05, 50.5, 50.6, gold, 0)
box(gold, cx - 0.06, cx + 0.06, cy - 0.2, cy + 1.2, 51.0, 51.4, gold, 0)

const lit = (p: V3) => (p[2] > TTOP - 0.5 ? 0.9 : 0)
await save('bos-old-south-meeting-house', 'Old South Meeting House', [
  { part: brick, material: finish('osmh-brick', 0x9f5b49) },
  { part: trim, material: { ...finish('osmh-white', 0xf4efe6), floodlight: lit } },
  { part: roof, material: finish('osmh-slate', 0x6f777f) },
  { part: win, material: PALETTE.window },
  { part: spire, material: { ...finish('osmh-copper', 0x7c9a8e), floodlight: (p) => (p[2] < 45 ? 0.6 : 0.3) } },
  { part: gold, material: { ...finish('osmh-gold', 0xd9b45e), floodlight: () => 0.8 } },
], { height: 52.2, anchor: [42.35699, -71.0583758], bearing: 31 })
