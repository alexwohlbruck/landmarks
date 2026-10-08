/**
 * The Rookery (209 South LaSalle, 1888, Burnham & Root), Chicago — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-rookery.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/73706154,
 * 41.879082,-87.631830. Its walls run at 359.1° / 89.1°, so the catalog
 * bearing is 359.1 and the block is square to its own frame.
 *
 * Identity, in order: the square red block with its open light court; the
 * rough granite base with the big round-arched entrances on LaSalle (west)
 * and Adams (north); the central pavilions on those fronts, flanked by
 * round turrets with conical caps above the parapet; the tiers of arched
 * windows (two arcades, each three storeys) between brick piers; the
 * glazed hipped skylight over the lobby at the bottom of the court.
 *
 * Evidence:
 *  - plan: OSM outline, 51.0 × 54.2 m, the same as HABS ILL-1030's 167'6" ×
 *    177'8". The light court from HABS sheet 3 (third floor plan): 19.2 m
 *    E-W, 22.1 m N-S, centred N-S, 16.2 m from LaSalle, with its west
 *    corners cut and the oriel stair (6.8 m across) on its west wall.
 *  - heights, all from HABS sheet 4 (photogrammetric west elevation, 1967):
 *    granite base 30.50 ft (9.3 m), belt courses at 57.75 ft (17.6 m) and
 *    96.18 ft (29.3 m), main parapet 160.57 ft (48.9 m), pavilion parapet
 *    ~166 ft (50.6 m), turret finials 180.5 ft (55.0 m; published 181 ft).
 *    Bays, window widths and the arch radii are measured on the same sheet
 *    (5.0 px/ft): four bays a side either side of a 13.6 m pavilion.
 *  - the north front has its own projecting centre bay and arched entrance
 *    but no turrets (Teemu008's and Sknuteson's photos from the north-west). The south and
 *    east walls are given the same window rhythm without the pavilions;
 *    no photo here shows them closely (estimate).
 *  - colour: red-brown brick and terracotta (finish, pulled light from the
 *    photos' #a87566), the base a lighter rock-faced red granite; the
 *    court's white glazed brick is trim.
 *
 * Photos (Wikimedia Commons): Rookery_Building_(6038513231).jpg (Teemu008,
 * CC BY-SA 2.0); Rookery_Building_2014.jpg (Sknuteson, CC BY-SA 4.0);
 * Chicago_-_S_LaSalle_St_-_Rookery_-_01.jpg and _02 (HaSt, CC BY-SA 4.0);
 * Rookery_Building,_Chicago,_Illinois_(11004246306).jpg (Ken Lund, CC BY-SA
 * 2.0); HABS ILL,16-CHIG,31-1 (Cervin Robinson, 1963, public domain) and
 * HABS ILL-1030 sheets 2–4 (public domain). No commercial imagery.
 *
 * Left out: the cresting, the colonnettes and carved birds, the balconies,
 * the oriel bays' mullions, the flagpole.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'
import { box, hipRoof } from './chi-board-of-trade'

const brick = new Part(), granite = new Part(), win = new Part(), roof = new Part(), glass = new Part(), court = new Part()

const HX = 25.5, HY = 27.1
const BASE = 9.3, BELT1 = 17.6, BELT2 = 29.3, CORN = 46.3, PARA = 48.9
const PAVN = 5.0 // the Adams front's narrower centre bay (Teemu008's photo)
const PAV = 6.8, PAVTOP = 50.6, PROJ = 0.6 // pavilion half-width, top, projection

/** A window panel with a semicircular head: rectangle z0..zs, arch above. */
function archPanel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, zs: number, out = 0.05, seg = 8) {
  const { P } = onWall(a, b)
  const r = (s1 - s0) / 2, c = (s0 + s1) / 2
  p.quad(P(s0, z0, out), P(s1, z0, out), P(s1, zs, out), P(s0, zs, out))
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    p.tri(P(c, zs, out), P(c + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(c + r * Math.cos(t1), zs + r * Math.sin(t1), out))
  }
}

// ---------------------------------------------------------------------------
// The block: granite base, brick body, cornice, parapet; the light court.

const outer = rect(-HX, -HY, HX, HY)
walls(granite, outer, 0, BASE)
walls(brick, outer, BASE, CORN)
// Cornice band, a little proud, then the parapet with a bevelled coping.
const corn = inset(outer, -0.35)
walls(brick, corn, CORN, CORN + 1.2)
brick.loft([outer.map(([x, y]) => [x, y, CORN] as V3), corn.map(([x, y]) => [x, y, CORN] as V3)])
walls(brick, outer, CORN + 1.2, PARA - 0.4)
walls(brick, outer, PARA - 0.4, PARA, inset(outer, 0.4))

// Belt courses at the top of the base and between the tiers.
for (const z of [BASE - 0.6, BELT1 - 0.5, BELT2 - 0.5]) {
  const band = inset(outer, -0.25), part = z < BASE ? granite : brick
  walls(part, band, z, z + 0.6)
  part.loft([band.map(([x, y]) => [x, y, z + 0.6] as V3), outer.map(([x, y]) => [x, y, z + 0.6] as V3)])
}

// The court: west corners cut, oriel stair on its west wall.
const CW = -9.3, CE = 9.9, CS = -11.2, CN = 10.9, CUT = 2.4, COURT = 9.6
const courtRing: XY[] = [[CW + CUT, CS], [CE, CS], [CE, CN], [CW + CUT, CN], [CW, CN - CUT], [CW, CS + CUT]]
// The court's walls face inwards, so their ring runs clockwise.
walls(court, [...courtRing].reverse(), COURT, PARA)
// Roof: the ring between the parapet and the court, in four convex pieces.
const L = HX - 0.4, T = HY - 0.4
for (const r of [
  [[-L, CN], [L, CN], [L, T], [-L, T]],
  [[-L, -T], [L, -T], [L, CS], [-L, CS]],
  [[CE, CS], [L, CS], [L, CN], [CE, CN]],
  [[-L, CS], [CW + CUT, CS], [CW, CS + CUT], [CW, CN - CUT], [CW + CUT, CN], [-L, CN]],
] as XY[][]) cap(roof, r, PARA)
// The lobby skylight at the bottom of the court.
hipRoof(glass, CW, CS, CE, CN, COURT, COURT + 3.2)
// The oriel stair: a half-cylinder standing out from the court's west wall.
{
  const R = 3.4, seg = 8
  const P = (t: number, z: number): V3 => [CW + R * Math.sin(t), R * Math.cos(t), z]
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    court.quad(P(t1, COURT + 3), P(t0, COURT + 3), P(t0, PARA + 0.8), P(t1, PARA + 0.8))
    roof.tri([CW, 0, PARA + 0.8], P(t1, PARA + 0.8), P(t0, PARA + 0.8))
    // Windows in vertical strips round the stair.
    const tm = (t0 + t1) / 2, n: XY = [Math.sin(tm), Math.cos(tm)]
    const a = P(t0 + 0.12, 0), b = P(t1 - 0.12, 0)
    win.quad([a[0] + n[0] * 0.05, a[1] + n[1] * 0.05, COURT + 4], [b[0] + n[0] * 0.05, b[1] + n[1] * 0.05, COURT + 4], [b[0] + n[0] * 0.05, b[1] + n[1] * 0.05, PARA - 1.5], [a[0] + n[0] * 0.05, a[1] + n[1] * 0.05, PARA - 1.5])
  }
}

// ---------------------------------------------------------------------------
// Fronts. Faces as a→b with the outside on the right.

const W: [XY, XY] = [[-HX, HY], [-HX, -HY]]
const N: [XY, XY] = [[HX, HY], [-HX, HY]]
const S: [XY, XY] = [[-HX, -HY], [HX, -HY]]
const E: [XY, XY] = [[HX, -HY], [HX, HY]]

/** Windows of one side section: `n` bays between s0 and s1 along the face. */
function section(face: [XY, XY], s0: number, s1: number, n: number, arched: boolean) {
  const [a, b] = face, pitch = (s1 - s0) / n, w = pitch * 0.56
  // Storeys within each tier, the brick spandrels between them showing.
  const tiers: [number, number, number][] = [[BASE, BELT1, 2], [BELT1, BELT2, 3], [BELT2, 42.7, 3]]
  for (let k = 0; k < n; k++) {
    const c = s0 + (k + 0.5) * pitch, l = c - w / 2, r = c + w / 2
    panel(win, a, b, l - 0.3, r + 0.3, 1.0, 7.6) // shopfronts
    for (const [t0, t1, f] of tiers) {
      const h = (t1 - t0) / f
      for (let i = 0; i < f; i++) {
        const z0 = t0 + i * h + 0.7, z1 = t0 + (i + 1) * h - 0.5
        if (arched && t0 > BASE && i === f - 1) archPanel(win, a, b, l, r, z0, z1 - w / 2)
        else panel(win, a, b, l, r, z0, z1)
      }
    }
    panel(win, a, b, l, r, 43.3, 45.5)
  }
}

/** A central pavilion: projecting bay, arched entrance, oriels, great arch, turrets. */
function pavilion(face: [XY, XY], grand: boolean, PAV: number) {
  const top = grand ? PAVTOP : PARA
  const [a, b] = face, { L: len, P } = onWall(a, b), m = len / 2
  // The projecting bay as a shallow box on the face.
  const q = [P(m - PAV, 0, 0), P(m + PAV, 0, 0), P(m + PAV, 0, PROJ), P(m - PAV, 0, PROJ)].map(v => [v[0], v[1]] as XY)
  // q runs along the face then out: make it counter-clockwise.
  const ring: XY[] = [q[0], q[1], q[2], q[3]]
  const ccw = (ring[1][0] - ring[0][0]) * (ring[2][1] - ring[0][1]) - (ring[1][1] - ring[0][1]) * (ring[2][0] - ring[0][0]) > 0
  const r = ccw ? ring : [...ring].reverse()
  walls(granite, r, 0, BASE)
  walls(brick, r, BASE, top - 0.4)
  walls(brick, r, top - 0.4, top, inset(r, 0.3))
  cap(roof, inset(r, 0.3), top)
  const o = PROJ + 0.05
  // Round-arched entrance through the base.
  archPanel(win, a, b, m - 4.6, m + 4.6, 0.2, 2.8, o, 10)
  const ww = PAV - 2.4
  // Two oriel groups, then the great arched window, then the attic window.
  // Oriel storeys, a panel each, and the great arch over the top tier.
  for (const [t0, t1, f] of [[BASE, BELT1, 2], [BELT1, BELT2, 3], [BELT2, 37.6, 2]] as [number, number, number][]) {
    const h = (t1 - t0) / f
    for (let i = 0; i < f; i++) panel(win, a, b, m - ww, m + ww, t0 + i * h + 0.7, t0 + (i + 1) * h - 0.5, o)
  }
  archPanel(win, a, b, m - ww, m + ww, 37.6, 37.6, o, 10)
  panel(win, a, b, m - ww + 0.8, m + ww - 0.8, 43.2, 45.6, o)
  // On LaSalle, turrets at the pavilion's edges: drums above the cornice,
  // conical caps. The Adams front has only the projecting bay.
  if (grand) for (const s of [m - PAV, m + PAV]) {
    const c = P(s, 0, PROJ - 0.6)
    lathe(brick, c[0], c[1], [[0, 38], [1.15, 38], [1.15, PAVTOP + 0.6], [1.35, PAVTOP + 0.6], [1.35, PAVTOP + 1.4], [1.0, PAVTOP + 1.4], [0.55, 53.6], [0.15, 55.0], [0, 55.0]], 12)
  }
}

section(W, 0.8, m0(W) - PAV - 0.6, 4, true)
section(W, m0(W) + PAV + 0.6, 2 * HY - 0.8, 4, true)
section(N, 0.8, m0(N) - PAVN - 0.6, 4, true)
section(N, m0(N) + PAVN + 0.6, 2 * HX - 0.8, 4, true)
section(S, 0.8, 2 * HX - 0.8, 9, false)
section(E, 0.8, 2 * HY - 0.8, 10, false)
pavilion(W, true, PAV)
pavilion(N, false, PAVN)
function m0(f: [XY, XY]) { return Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1]) / 2 }

// Corner finials on the street corners.
for (const [x, y] of [[-HX, HY], [-HX, -HY], [HX, HY]] as XY[]) {
  const cx = x - Math.sign(x) * 0.9, cy = y - Math.sign(y) * 0.9
  lathe(brick, cx, cy, [[0, PARA - 0.2], [1.0, PARA - 0.2], [1.0, PARA + 1.0], [0.75, PARA + 1.0], [0.1, 52.2], [0, 52.2]], 10)
}

await save('chi-rookery', 'The Rookery', [41.879082, -87.63183], 359.1, [
  { part: brick, material: finish('rookery-brick', 0xbb8a7b) },
  { part: granite, material: finish('rookery-granite', 0xcca796) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
  { part: court, material: PALETTE.trim },
])
