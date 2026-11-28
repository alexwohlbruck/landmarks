/**
 * The Austonian, 200 Congress Avenue, Austin (2010, Ziegler Cooper
 * Architects) — original procedural geometry, CC0-1.0.
 * bun generators/atx-the-austonian.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.9: the street grid. Anchor = area centroid of
 * OSM way/204413181 ("The Austonian", 56 levels, wikidata Q3297809),
 * -97.7444472, 30.2647759.
 *
 * Identity (from the photos): a very slender residential slab, 26 x 48 m,
 * its long faces gently bowed and its ends rounded, in pale silver-blue
 * glass ringed by white balcony slab edges, with balcony stacks on the
 * rounded ends; the top storeys stepped in at the ends; an oval glass
 * crown screen standing over the roof; a pale limestone podium (parking
 * and lobby) under the whole block.
 *
 * Evidence and numbers:
 *  - lidar: USGS 3DEP USGS_LPC_TX_Central_B1_2017 (2017 flight), 1 m grid
 *    read in the frame (ground ~0.7 m over ground_min under the tower; the
 *    site is flat, Mapterhorn within 1 m). Measured: the podium 29-30 m
 *    (drawn 30); the shaft's ends 175 m; the main roof 190.7 m (drawn
 *    190.5); the crown screen 204-210 m over an oval about 20 x 30 m
 *    (drawn 207.5, top 208.8 for the frame); the shaft x -26..+1, y -24..+24
 *    with ends narrowing to ~14 m at y +-22 (drawn as a rounded rectangle,
 *    corner radius 8 m).
 *  - published: 683 ft (208 m), 56 storeys, completed 2010 (Wikipedia, "The
 *    Austonian"; OSM part way/516289335 height 207).
 *  - plan: OSM outline for the podium; the tower part (way/516289335, the
 *    west half) agrees with the lidar to within ~1.5 m; the lidar podium
 *    reads ~2 m wider on the east, OSM kept.
 *  - estimated from the photos: the small step at ~143 m ("shawn"), the
 *    bow of the long faces (~1.4 m), the balcony lines (drawn every three
 *    storeys), the podium's window groups and cornice.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  shawn "TheAustonian.jpg", Shawnbell, CC BY 3.0 (the long east face and
 *        podium, from above) https://commons.wikimedia.org/wiki/File:TheAustonian.jpg
 *  han   "Austonian Austin.jpg", HanFSolo, CC BY-SA 3.0 (a rounded end,
 *        looking up) https://commons.wikimedia.org/wiki/File:Austonian_Austin.jpg
 *  lsm   "Austonian-Apr2010-a.JPG", LoneStarMike, CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:Austonian-Apr2010-a.JPG
 *  iak   "The-austonian.jpg", Iaksge, CC BY-SA 3.0
 *        https://commons.wikimedia.org/wiki/File:The-austonian.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the crown's exact outline (photos show a curved glass screen,
 * the lidar an oval ~20 x 30 m) is simplified to an oval with a level
 * crest; whether it is lit at night is not confirmed by an open photo, so
 * it stays dark glass. The podium's facades are drawn as plain window
 * groups.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { prism, smoothWall, capPoly, ccw, panels, save, type XY } from './atl-flatiron-building'

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function triOut(p: Part, a: V3, b: V3, c: V3, out: V3) {
  if (dot3(cross3(sub3(b, a), sub3(c, a)), out) < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}

// ── Plan (x east, y north along the street grid, bearing 17.9) ──
// The podium: OSM way/204413181, squared.
const POD: XY[] = [[-27.8, -27.7], [14.8, -27.7], [14.8, -23.5], [18.7, -23.5], [18.7, 27.7], [-27.4, 27.7]]
// The tower: a slender slab with gently bowed long faces and rounded ends,
// 26 x 48 m, centred on (CX, 0) (lidar: x -26..1, y -24..24 at 2 m cells).
const CX = -13.5
function towerPlan(hw: number, hl: number, r: number, bow: number): XY[] {
  // a rounded rectangle, half-width hw (x), half-length hl (y), corner radius r,
  // the long faces bowed out by `bow` at mid-length
  const pts: XY[] = []
  const corner = (cx: number, cy: number, a0: number) => {
    for (let k = 0; k <= 4; k++) {
      const a = a0 + (k / 4) * (Math.PI / 2)
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  }
  const side = (x: number, sgn: number) => {
    for (let k = 1; k < 6; k++) {
      const t = k / 6, y = sgn * (-(hl - r) + 2 * (hl - r) * t)
      const b = bow * (1 - (y / (hl - r)) ** 2)
      pts.push([x + Math.sign(x - CX) * b, y])
    }
  }
  corner(CX + hw - r, -hl + r, -Math.PI / 2)
  side(CX + hw, 1)
  corner(CX + hw - r, hl - r, 0)
  corner(CX - hw + r, hl - r, Math.PI / 2)
  side(CX - hw, -1)
  corner(CX - hw + r, -hl + r, Math.PI)
  return ccw(pts)
}

// ── Heights (m above the lowest ground; lidar USGS 2017, ground ~0.7 under the tower) ──
const POD_TOP = 30
const STEP = 143 // the shaft steps in a little
const SHAFT_TOP = 175 // the ends stop here
const TIER_TOP = 190.5 // the top storeys, set in
const TOP = 208.8 // the crown screen's crest

const glass = new Part(), trim = new Part(), stone = new Part(), roof = new Part(), crown = new Part(), podWin = new Part()

// ── Podium: pale limestone, grouped window panels, a glass bay on the long faces ──
prism(stone, POD, 0, POD_TOP, roof, 0.5)
panels(podWin, POD, 4.5, POD_TOP - 3, { group: 7.5, gap: 1.4, bay: 4.2, pier: 1.1, margin: 1.5, min: 3 })
prism(trim, POD.map(([x, y]) => [x + (x < 0 ? -0.4 : 0.4), y + (y < 0 ? -0.4 : 0.4)] as XY), POD_TOP - 1.4, POD_TOP, roof, 0.3)

// ── The shaft ──
const P0 = towerPlan(13, 24, 8, 1.4)
const P1 = towerPlan(12.2, 23.2, 7.6, 1.4)
const P2 = towerPlan(10.6, 20.5, 6.8, 1.2)
smoothWall(glass, P0, POD_TOP, STEP)
capPoly(roof, P0, STEP, true)
smoothWall(glass, P1, STEP, SHAFT_TOP)
capPoly(roof, P1, SHAFT_TOP, true)
smoothWall(glass, P2, SHAFT_TOP, TIER_TOP)
capPoly(roof, P2, TIER_TOP, true)

/** A thin horizontal band just outside a ring (a slab edge or balcony line). */
function ringBand(p: Part, ring: XY[], z0: number, z1: number, out: number) {
  const n = ring.length
  const o = ring.map((q, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey)
    return [q[0] + (ey / l) * out, q[1] - (ex / l) * out] as XY
  })
  smoothWall(p, o, z0, z1)
  // its top and underside
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const A: V3 = [ring[i][0], ring[i][1], z1], B: V3 = [o[i][0], o[i][1], z1], C: V3 = [o[j][0], o[j][1], z1], D: V3 = [ring[j][0], ring[j][1], z1]
    triOut(p, A, B, C, [0, 0, 1]); triOut(p, A, C, D, [0, 0, 1])
    const a: V3 = [ring[i][0], ring[i][1], z0], b: V3 = [o[i][0], o[i][1], z0], c: V3 = [o[j][0], o[j][1], z0], d: V3 = [ring[j][0], ring[j][1], z0]
    triOut(p, a, b, c, [0, 0, -1]); triOut(p, a, c, d, [0, 0, -1])
  }
}
// balcony slab edges every three storeys (3.3 m floors), white; heavier at the steps
for (let z = POD_TOP + 9.9; z < STEP - 2; z += 9.9) ringBand(trim, P0, z - 0.3, z + 0.3, 0.7)
for (let z = STEP + 9.9; z < SHAFT_TOP - 2; z += 9.9) ringBand(trim, P1, z - 0.3, z + 0.3, 0.7)
ringBand(trim, P2, SHAFT_TOP + 7.8, SHAFT_TOP + 8.4, 0.5)
ringBand(trim, P0, STEP - 0.6, STEP, 0.4)
ringBand(trim, P1, SHAFT_TOP - 0.8, SHAFT_TOP, 0.4)
ringBand(trim, P2, TIER_TOP - 0.8, TIER_TOP, 0.4)
ringBand(trim, P0, POD_TOP, POD_TOP + 4.5, 0.05) // the open amenity storey's columns read as a pale band
// the balcony stacks at the rounded ends: white vertical mullion lines on each end
for (const [P, z0, z1] of [[P0, POD_TOP + 4.5, STEP], [P1, STEP, SHAFT_TOP]] as [XY[], number, number][]) {
  for (let i = 0; i < P.length; i++) {
    const q = P[i]
    if (Math.abs(q[1]) < 15) continue // only round the ends
    const a = P[(i - 1 + P.length) % P.length], b = P[(i + 1) % P.length]
    const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey), n: XY = [ey / l, -ex / l]
    const t: XY = [ex / l, ey / l], w = 0.35
    const ring: XY[] = [[q[0] - t[0] * w, q[1] - t[1] * w], [q[0] + t[0] * w, q[1] + t[1] * w], [q[0] + t[0] * w + n[0] * 0.5, q[1] + t[1] * w + n[1] * 0.5], [q[0] - t[0] * w + n[0] * 0.5, q[1] - t[1] * w + n[1] * 0.5]]
    prism(trim, ccw(ring), z0, z1, trim, 0)
  }
}

// ── The crown: an oval glass screen over the top storeys ──
{
  const n = 16, rx = 10, ry = 15
  const ring: XY[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [CX + rx * Math.cos(a), ry * Math.sin(a)] as XY
  })
  const zt = (_x: number) => TOP - 1.3 // flat crest (lidar 204-209 across it; drawn level)
  const outer = ring, inner = ring.map(([x, y]) => [CX + (x - CX) * 0.95, y * 0.967] as XY)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = outer[i], b = outer[j], c = inner[i], d = inner[j]
    const mx = (a[0] + b[0]) / 2 - CX, my = (a[1] + b[1]) / 2, out: V3 = [mx / rx, my / ry, 0]
    triOut(crown, [a[0], a[1], TIER_TOP], [b[0], b[1], TIER_TOP], [b[0], b[1], zt(b[0])], out)
    triOut(crown, [a[0], a[1], TIER_TOP], [b[0], b[1], zt(b[0])], [a[0], a[1], zt(a[0])], out)
    const inn: V3 = [-out[0], -out[1], 0]
    triOut(crown, [c[0], c[1], TIER_TOP], [d[0], d[1], TIER_TOP], [d[0], d[1], zt(d[0])], inn)
    triOut(crown, [c[0], c[1], TIER_TOP], [d[0], d[1], zt(d[0])], [c[0], c[1], zt(c[0])], inn)
    triOut(trim, [a[0], a[1], zt(a[0])], [b[0], b[1], zt(b[0])], [d[0], d[1], zt(d[0])], [0, 0, 1])
    triOut(trim, [a[0], a[1], zt(a[0])], [d[0], d[1], zt(d[0])], [c[0], c[1], zt(c[0])], [0, 0, 1])
  }
  // the screen's frame lines: vertical ribs
  for (let i = 0; i < n; i += 2) {
    const [x, y] = outer[i], nn: XY = [(x - CX) / rx, y / ry], l = Math.hypot(nn[0], nn[1])
    const u: XY = [nn[0] / l, nn[1] / l], t: XY = [-u[1], u[0]], w = 0.3
    const r: XY[] = [[x - t[0] * w, y - t[1] * w], [x + t[0] * w, y + t[1] * w], [x + t[0] * w + u[0] * 0.4, y + t[1] * w + u[1] * 0.4], [x - t[0] * w + u[0] * 0.4, y - t[1] * w + u[1] * 0.4]]
    prism(trim, ccw(r), TIER_TOP, zt(x) - 0.05, trim, 0)
  }
}

if (import.meta.main) {
  await save('atx-the-austonian', 'The Austonian', [
    { part: glass, material: { ...PALETTE.window, color: 0xa3bacd } },
    { part: podWin, material: windowVariant(2, 0x6f8496) },
    { part: trim, material: PALETTE.trim },
    { part: stone, material: PALETTE.stone },
    { part: roof, material: PALETTE.roof },
    { part: crown, material: PALETTE.glass },
  ], { bearing: 17.9, height: TOP, replaces: ['way/204413181', 'way/516289335'] }, 6500)
}
