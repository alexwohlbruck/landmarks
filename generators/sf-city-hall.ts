/**
 * San Francisco City Hall — original procedural geometry, CC0-1.0.
 * bun generators/sf-city-hall.ts
 *
 * Map frame, turned to the building: +x is the Polk Street (east) front's
 * outward normal, +y the McAllister Street (north) front's, z up, metres.
 * BEARING 351, the Civic Center street grid. Origin = the centre of the dome
 * (lidar), which is the building's centre of symmetry; the OSM outline's
 * centroid sits 1.5 m off it because the Van Ness portico projects further.
 *
 * Evidence
 * - OSM relation/7261820 (multipolygon, outer way/494810795 with two courtyard
 *   rings): 127 x 88 m; dome parts way/494810783, 494810785, 494810787,
 *   494810790, 494810791, 494810794, 494810820, 494810823, 494810826,
 *   494810839, 494810841 (heights 30-93 m).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, heights above the
 *   lowest ground under the footprint (17.4 m NAVD88, the areaways on the
 *   north side): wing cornice 22.2, balustrade 23.5, a steep mansard to 26.2
 *   (glazed: teal skylights in the aerials) and flat roofs at 26-28; corner pavilions 24.3; central pavilions'
 *   entablature 27.4 and pediment apex 32.4, with gabled roofs behind; square
 *   dome base 34.6 (balustrade 36); drum podium r 17.7 to 41; colonnade to
 *   ~52; attic to 56.5; dome springing r 14.2 at 56.5, and the dome's section
 *   fits a half-ellipse 15 m tall to within 0.5 m (r 13: 62.0, r 10: 67.0,
 *   r 6: 70.3); lantern ring r 5 at 72.5, lantern r 3.5 to 80-82, spire tip
 *   93.35. Courtyards' roofs at 14 m. The Van Ness (west) portico reaches
 *   51.5 m from the dome centre, the Polk (east) one 47.5 m: kept as measured.
 * - Published (Wikipedia; SF Landmark No. 64): 1915, Bakewell & Brown (Arthur
 *   Brown Jr.); dome 307 ft (93.6 m), higher than the US Capitol's.
 * - Commons photos (daylight): "San Francisco City Hall September 2013
 *   panorama 2.jpg" (King of Hearts, CC BY-SA 3.0, dome from the east);
 *   "San Francisco City Hall (front).jpg" (Supercarwaar, CC BY-SA 4.0, east
 *   front); "San Francisco City Hall - DSC02824.JPG" (Daderot, CC0, east
 *   pavilion); "San Francisco City Hall 2010.jpg" (Another Believer, CC BY-SA
 *   3.0, east pavilion); "San Francisco City Hall, San Francisco, California
 *   LCCN2013630375.tif" (Carol M. Highsmith, public domain, dome from the
 *   north-east); "City Hall San Francisco 04 2015 1728.jpg" (Mariordo, CC BY-SA
 *   4.0, aerial from the north-east); "San Francisco City Hall, aerial shot.jpg"
 *   (Kitchen, CC BY 2.0); "SFCityHallWestSide.JPG" (Leonard G., CC SA 1.0);
 *   "McAllister - panoramio.jpg" (Gianluca Cogoli, CC BY 3.0, north-west).
 *
 * Colour: the photos show the dome as dark slate-grey lead with gilded ribs,
 * cartouches, garland ring and lantern, not green; the sloped bands round the
 * wings are glazing that reads teal from above, drawn as `glass`. Estimated from photos: the facade storeys (8 m
 * rusticated base, giant order to 18.2, attic), bay counts (9 bays a wing on
 * Polk and Van Ness, 11 on the north and south centres), the pavilions' six
 * columns and three arched windows, the 16-bay drum with paired columns, the
 * lantern's stages. The corner pavilions' windows are simplified.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 351
// The outline relation and every building:part inside it (the dome's tiers and the cross wings).
const REPLACES = ['relation/7261820', ...[494810783, 494810785, 494810787, 494810790, 494810791, 494810794, 494810820, 494810823, 494810826, 494810839, 494810841].map((w) => `way/${w}`)]
const ANCHOR = { lng: -122.4192226, lat: 37.7792751 }

const stone = new Part(), win = new Part(), roof = new Part(), skylight = new Part(), slate = new Part(), gold = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return v.map((n) => n / l) as V3 }
const up: V3 = [0, 0, 1], down: V3 = [0, 0, -1]

// --- Mirroring. The body is built one quadrant at a time (x >= 0, y >= 0) and
// mirrored; a mirror flips the winding, so triangles are re-ordered.
let SX = 1, SY = 1
const T = (p: V3): V3 => [p[0] * SX, p[1] * SY, p[2]]
function tri(part: Part, a: V3, b: V3, c: V3, n?: V3[]) {
  const N = n?.map(T)
  if (SX * SY > 0) part.tri(T(a), T(b), T(c), undefined, undefined, undefined, N)
  else part.tri(T(a), T(c), T(b), undefined, undefined, undefined, N && [N[0], N[2], N[1]])
}
function quad(part: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  tri(part, a, b, c, n && [n[0], n[1], n[2]])
  tri(part, a, c, d, n && [n[0], n[2], n[3]])
}
function fan(part: Part, pts: V3[], n?: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(part, pts[0], pts[i], pts[i + 1], n && [n, n, n])
}
/** Axis-aligned box; `skip` lists faces left out ('t','b','n','s','e','w'). */
function box(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = '') {
  const P = (x: number, y: number, z: number): V3 => [x, y, z]
  if (!skip.includes('t')) quad(part, P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1))
  if (!skip.includes('b')) quad(part, P(x0, y0, z0), P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0))
  if (!skip.includes('s')) quad(part, P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1))
  if (!skip.includes('n')) quad(part, P(x1, y1, z0), P(x0, y1, z0), P(x0, y1, z1), P(x1, y1, z1))
  if (!skip.includes('e')) quad(part, P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1))
  if (!skip.includes('w')) quad(part, P(x0, y1, z0), P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1))
}

// --- A straight wall segment, a -> b, outward normal on the right (the plan
// is walked anticlockwise). s runs along it, d outward, z up.
type Seg = { a: XY; t: XY; n: XY; len: number }
function seg(a: XY, b: XY): Seg {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const P = (g: Seg, s: number, d: number, z: number): V3 => [g.a[0] + g.t[0] * s + g.n[0] * d, g.a[1] + g.t[1] * s + g.n[1] * d, z]
const N3 = (g: Seg): V3 => [g.n[0], g.n[1], 0]
function wall(part: Part, g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) {
  const n = N3(g)
  quad(part, P(g, s0, d, z0), P(g, s1, d, z0), P(g, s1, d, z1), P(g, s0, d, z1), [n, n, n, n])
}
/**
 * A moulding swept along a segment: profile points (d, z) run out from the
 * wall, up, and back in (anticlockwise in the d-z plane), with end caps.
 */
function band(part: Part, g: Seg, s0: number, s1: number, prof: [number, number][], caps = false) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
    quad(part, P(g, s0, d0, z0), P(g, s1, d0, z0), P(g, s1, d1, z1), P(g, s0, d1, z1))
  }
  // Ends are usually buried in a neighbouring wall, or meet the neighbouring
  // band's face at a corner (bands run past convex corners by their depth).
  if (!caps) return
  fan(part, prof.map(([d, z]) => P(g, s0, d, z)))
  fan(part, [...prof].reverse().map(([d, z]) => P(g, s1, d, z)))
}
/** A flat window panel just proud of the plane at offset d. */
function pane(g: Seg, s0: number, s1: number, z0: number, z1: number, d = 0) {
  wall(win, g, s0, s1, z0, z1, d + 0.05)
}
/** A round-headed window: semicircular head of the opening's own width. */
function arched(part: Part, g: Seg, sc: number, w: number, z0: number, z1: number, d = 0) {
  const r = w / 2, spring = z1 - r
  const pts: V3[] = [P(g, sc, d + 0.05, (z0 + spring) / 2), P(g, sc - r, d + 0.05, z0), P(g, sc + r, d + 0.05, z0)]
  for (let k = 0; k <= 8; k++) pts.push(P(g, sc + r * Math.cos((k * Math.PI) / 8), d + 0.05, spring + r * Math.sin((k * Math.PI) / 8)))
  pts.push(P(g, sc - r, d + 0.05, z0))
  const n = N3(g)
  for (let i = 1; i < pts.length - 1; i++) tri(part, pts[0], pts[i], pts[i + 1], [n, n, n])
}
/** An engaged half column standing on the wall plane (half hexagon). */
function halfColumn(g: Seg, sc: number, r: number, z0: number, z1: number, d = 0) {
  const k = 3
  for (let i = 0; i < k; i++) {
    const a0 = Math.PI - (i * Math.PI) / k, a1 = Math.PI - ((i + 1) * Math.PI) / k
    const q = (a: number, z: number) => P(g, sc + r * Math.cos(a), d + r * Math.sin(a), z)
    const nn = (a: number): V3 => unit([g.t[0] * Math.cos(a) + g.n[0] * Math.sin(a), g.t[1] * Math.cos(a) + g.n[1] * Math.sin(a), 0])
    quad(stone, q(a0, z0), q(a1, z0), q(a1, z1), q(a0, z1), [nn(a0), nn(a1), nn(a1), nn(a0)])
  }
}
/** A free-standing round column (octagonal prism, smooth). */
function column(part: Part, c: XY, r: number, z0: number, z1: number, seg = 8) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i * 2 * Math.PI) / seg, a1 = ((i + 1) * 2 * Math.PI) / seg
    const q = (a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
    const nn = (a: number): V3 => [Math.cos(a), Math.sin(a), 0]
    quad(part, q(a0, z0), q(a1, z0), q(a1, z1), q(a0, z1), [nn(a0), nn(a1), nn(a1), nn(a0)])
  }
}

// ---------------------------------------------------------------------------
// Plan (quadrant x >= 0, y >= 0), lidar and OSM.
const WU = 43.4 // Polk / Van Ness wing walls
const WV = 62.2 // McAllister / Grove centre walls
const CPU = 44.4, CPV0 = 47.9, CPV1 = 58.6 // corner pavilions on the long fronts
const CPN = 63.5, CPX0 = 22 // corner pavilions on the short fronts
// The outer corner is cut away in a concave quarter round (OSM, lidar).
const NOTCH: XY[] = [[WU, CPV1], [WU, 60.1], [41.2, 60.4], [40.2, 61.4], [39.6, CPN]]
const PW = 13 // half width of the central pavilions and the cross wings
const BLK = 20.6 // half size of the square block under the drum
const CY0 = 20.6, CY1 = 37.7, CX = 19.5 // courtyards
const ROOF = 27.4, COURT = 14

// Elevations.
const BASE = 8.0 // rusticated base
const ORDER = 18.2 // top of the giant order on the wings
const ENT = 20.0 // top of the wing entablature
const CORNICE = 22.2, BALUSTRADE = 23.5, CORNER_PED = 24.4
const PAV_BASE = 8.8, PAV_ORDER = 23.0, PAV_ENT = 27.4, PED_EAVE = 28.1, PED_APEX = 32.5

// The plinth's underside sits on the ground, so its profile starts at the face.
const plinth = (h: number, d = 0.35): [number, number][] => [[d, 0], [d, h - 0.35], [0, h]]
const cornice = (z0: number, z1: number, d: number): [number, number][] => [[0, z0], [d * 0.55, z0 + (z1 - z0) * 0.35], [d, z1 - (z1 - z0) * 0.4], [d, z1], [0, z1]]

/**
 * A wing front: giant engaged order on a rusticated base, one window bay
 * between columns. `halfBay` adds half a bay past the last column, ending on
 * the mirror axis, whose window the mirrored quadrant completes.
 */
function colonnade(g: Seg, cols: number[], halfBay = 0) {
  const end = g.len
  wall(stone, g, 0, end, 0, BALUSTRADE)
  quad(stone, P(g, 0, 0, BALUSTRADE), P(g, end, 0, BALUSTRADE), P(g, end, -0.5, BALUSTRADE), P(g, 0, -0.5, BALUSTRADE))
  const e1 = halfBay ? 0 : 1 // bands stop at the mirror axis
  band(stone, g, -0.35, end + 0.35 * e1, plinth(BASE))
  band(stone, g, -0.85, end + 0.85 * e1, cornice(ORDER, ENT, 0.85))
  band(stone, g, -0.75, end + 0.75 * e1, cornice(21.2, CORNICE, 0.75))
  for (const c of cols) halfColumn(g, c, 0.72, BASE, ORDER)
  const bays: [number, number][] = []
  for (let i = 0; i < cols.length - 1; i++) bays.push([(cols[i] + cols[i + 1]) / 2, (cols[i + 1] - cols[i]) * 0.5])
  for (const [sc, w] of bays) {
    pane(g, sc - w / 2, sc + w / 2, 2.2, 6.0, 0.35)
    pane(g, sc - w / 2, sc + w / 2, 9.2, 17.3)
  }
  if (halfBay) {
    const w = halfBay * 0.5
    pane(g, end - w / 2, end, 2.2, 6.0, 0.35)
    pane(g, end - w / 2, end, 9.2, 17.3)
  }
}
/**
 * A plain front without the giant order: the corner pavilions and the short
 * walls between. Cornice at 22.2, then a balustrade to 23.5 unless `top` says
 * otherwise; windows in `bays` (arched on the ground floor, two above).
 */
function plainFace(g: Seg, bays: number[] = [], top = BALUSTRADE) {
  wall(stone, g, 0, g.len, 0, top)
  band(stone, g, -0.35, g.len + 0.35, plinth(BASE))
  band(stone, g, -0.45, g.len + 0.45, cornice(ORDER, ENT, 0.45))
  band(stone, g, -0.75, g.len + 0.75, cornice(21.2, CORNICE, 0.75))
  for (const sc of bays) {
    arched(win, g, sc, 2.1, 2.0, 6.8, 0.35)
    pane(g, sc - 0.95, sc + 0.95, 9.2, 12.9)
    pane(g, sc - 0.95, sc + 0.95, 14.3, 17.6)
  }
}
/** The flat top of a balustrade, from a wall back to the mansard. */
function deck(g: Seg, depth: number, z = BALUSTRADE) {
  quad(stone, P(g, 0, 0, z), P(g, g.len, 0, z), P(g, g.len, -depth, z), P(g, 0, -depth, z), [up, up, up, up])
}

/**
 * The central pavilion on Polk (east, front at 47.5) or Van Ness (west, 51.5):
 * rusticated base with three doors and a gilded balcony, six giant columns
 * before three arched windows, entablature and pediment.
 */
function pavilion(front: number) {
  const back = front - 1.9 // recessed wall behind the columns
  const PIER = 11.3 // end piers from here to PW
  const fr = seg([front, 0], [front, PW])
  // Base block, full width.
  wall(stone, fr, 0, PW, 0, PAV_BASE)
  band(stone, fr, 0, PW + 0.35, plinth(1.2, 0.35))
  // Top of the base inside the recess, with the gilded balcony rail at its edge.
  quad(stone, [back, 0, PAV_BASE], [front, 0, PAV_BASE], [front, PIER, PAV_BASE], [back, PIER, PAV_BASE])
  if (SY > 0) box(gold, front - 0.45, front - 0.05, -PIER, PIER, PAV_BASE, PAV_BASE + 0.9, 'b')
  // Doors: three, centred on the arched windows above.
  for (const c of [0, 5.5]) if (c > 0 || SY > 0) {
    pane(fr, c - 1.2, c + 1.2, 0.6, 5.4)
  }
  // Recessed wall and end pier.
  const rw = seg([back, 0], [back, PIER])
  wall(stone, rw, 0, PIER, PAV_BASE, PAV_ORDER)
  for (const c of [0, 5.5]) if (c > 0 || SY > 0) arched(win, rw, c, 3.3, 11.0, 20.4)
  wall(stone, fr, PIER, PW, PAV_BASE, PAV_ORDER)
  const pierSide = seg([back, PIER], [front, PIER])
  wall(stone, pierSide, 0, front - back, PAV_BASE, PAV_ORDER)
  // Entablature: soffit, face, cornice.
  quad(stone, [back, 0, PAV_ORDER], [back, PIER, PAV_ORDER], [front, PIER, PAV_ORDER], [front, 0, PAV_ORDER])
  wall(stone, fr, 0, PW, PAV_ORDER, PAV_ENT)
  band(stone, fr, 0, PW + 0.6, cornice(PAV_ENT - 0.9, PAV_ENT, 0.6))
  band(stone, fr, 0, PW + 0.5, cornice(PAV_ORDER, PAV_ORDER + 0.8, 0.4))
  // Columns.
  for (const v of [2.7, 8.3, 10.35]) {
    const c: XY = [front - 0.95, v]
    column(stone, c, 0.82, PAV_BASE, PAV_ORDER)
  }
  // Side of the pavilion (y = PW), from the wing wall out, up to the cross wing's eave.
  const side = seg([front, PW], [WU, PW])
  wall(stone, side, 0, front - WU, 0, PAV_ENT)
  band(stone, side, -0.6, front - WU, cornice(PAV_ENT - 0.9, PAV_ENT, 0.6))
  band(stone, side, -0.35, front - WU, plinth(BASE))
  // Cross wing walls above the roof, back to the drum block.
  const xw = seg([front, PW], [BLK, PW])
  wall(stone, xw, 0, front - BLK, ROOF - 0.5, PED_EAVE)
  // Pediment: tympanum set back, raking cornice, gabled roof behind.
  const ty = front - 0.35
  tri(stone, [ty, 0, PAV_ENT], [ty, PW - 0.6, PAV_ENT], [ty, 0, PED_APEX - 0.55], [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
  const slope = (PED_APEX - PED_EAVE) / PW
  const rk = (y: number, dz: number, x: number): V3 => [x, y, PED_EAVE + (PW - y) * slope + dz]
  const f = front + 0.45
  // raking cornice: front face, underside, top is the roof's edge
  quad(stone, rk(0, -1.0, f), rk(PW + 0.4, -1.0, f), rk(PW + 0.4, 0.05, f), rk(0, 0.05, f))
  quad(stone, rk(0, -1.0, ty), rk(PW + 0.4, -1.0, ty), rk(PW + 0.4, -1.0, f), rk(0, -1.0, f))
  quad(roof, rk(0, 0.05, f), rk(PW + 0.4, 0.05, f), rk(PW + 0.4, 0.05, BLK), rk(0, 0.05, BLK))
  quad(stone, rk(PW + 0.4, -1.0, BLK), rk(PW + 0.4, 0.05, BLK), rk(PW + 0.4, 0.05, f), rk(PW + 0.4, -1.0, f))
}

// ---------------------------------------------------------------------------
// One quadrant of the body. `front` is that side's pavilion front.
function quadrant(front: number) {
  // Long front (x = WU side), walked north.
  pavilion(front)
  const wing = seg([WU, PW], [WU, CPV0])
  const bay = wing.len / 9
  colonnade(wing, Array.from({ length: 10 }, (_, k) => k * bay))
  // Corner pavilion on the long front: 1 m proud, cornice at 22.2 and a low
  // pediment to 24.4 (lidar); the balustrade line continues behind it.
  {
    const r0 = seg([WU, CPV0], [CPU, CPV0]), f = seg([CPU, CPV0], [CPU, CPV1]), r1 = seg([CPU, CPV1], [WU, CPV1])
    for (const g of [r0, f, r1]) { plainFace(g, g === f ? [2.9, 7.8] : [], CORNICE); deck(g, 1.0, CORNICE) }
    const back = seg([WU, CPV0], [WU, CPV1])
    wall(stone, back, 0, back.len, CORNICE - 0.1, BALUSTRADE)
    deck(back, 0.5)
    const mid = (CPV0 + CPV1) / 2, x0 = WU - 0.6, xf = CPU + 0.5
    tri(stone, [CPU, CPV0 + 0.4, CORNICE], [CPU, CPV1 - 0.4, CORNICE], [CPU, mid, CORNER_PED - 0.2], [[1, 0, 0], [1, 0, 0], [1, 0, 0]])
    for (const [ya, yb] of [[CPV0 - 0.3, mid], [mid, CPV1 + 0.3]]) {
      const za = ya === mid ? CORNER_PED : CORNICE - 0.05, zb = yb === mid ? CORNER_PED : CORNICE - 0.05
      quad(stone, [xf, ya, za], [xf, yb, zb], [x0, yb, zb], [x0, ya, za])
      quad(stone, [xf, ya, za - 0.45], [xf, yb, zb - 0.45], [xf, yb, zb], [xf, ya, za])
    }
  }
  // The cut-away corner, then the corner pavilion on the short front.
  for (let i = 0; i < NOTCH.length - 1; i++) {
    const g = seg(NOTCH[i], NOTCH[i + 1])
    plainFace(g)
    deck(g, 1.2)
  }
  {
    const f = seg([NOTCH[NOTCH.length - 1][0], CPN], [CPX0, CPN]), r = seg([CPX0, CPN], [CPX0, WV])
    plainFace(f, [3.2, 8.8, 14.4])
    deck(f, CPN - WV + 0.6)
    plainFace(r)
  }
  // Short front centre (y = WV), 11 bays across, so a window sits on the axis.
  const b = (2 * CPX0) / 11
  colonnade(seg([CPX0, WV], [0, WV]), Array.from({ length: 6 }, (_, k) => k * b), b)
  // Mansard ring of skylights: steep from the balustrade, then a flatter
  // pitch to the flat roofs. Its path cuts the corner inside the notch.
  const path: XY[] = [[WU, 0], [WU, 59.6], [39.9, WV], [0, WV]]
  const inset = (d: number): XY[] => path.map((p, i) => {
    const prev = path[i - 1], next = path[i + 1]
    const nIn = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] }
    if (!prev) { const n = nIn(p, next); return [p[0] + n[0] * d, p[1] + n[1] * d] }
    if (!next) { const n = nIn(prev, p); return [p[0] + n[0] * d, p[1] + n[1] * d] }
    const u = nIn(prev, p), v = nIn(p, next), k = 1 + u[0] * v[0] + u[1] * v[1]
    return [p[0] + ((u[0] + v[0]) * d) / k, p[1] + ((u[1] + v[1]) * d) / k]
  })
  const prof: [number, number][] = [[0.5, BALUSTRADE], [2.6, 26.3], [5.0, ROOF]]
  for (let k = 0; k < prof.length - 1; k++) {
    const A = inset(prof[k][0]), B = inset(prof[k + 1][0]), z0 = prof[k][1], z1 = prof[k + 1][1]
    for (let i = 0; i < path.length - 1; i++) quad(skylight, [...A[i], z0], [...A[i + 1], z0], [...B[i + 1], z1], [...B[i], z1])
  }
  const IN = inset(5.0)
  // Flat roofs round the courtyard and the drum block.
  const R = (x0: number, x1: number, y0: number, y1: number) => quad(roof, [x0, y0, ROOF], [x1, y0, ROOF], [x1, y1, ROOF], [x0, y1, ROOF])
  fan(roof, [[0, CY1, ROOF], [IN[1][0], CY1, ROOF], [...IN[1], ROOF], [...IN[2], ROOF], [0, IN[2][1], ROOF]], up)
  R(CX, IN[1][0], CY0, CY1)
  R(BLK, IN[1][0], PW, CY0)
  // Courtyard: floor (a low roof at 14 m) and inner walls with windows.
  quad(slate, [0, CY0, COURT], [CX, CY0, COURT], [CX, CY1, COURT], [0, CY1, COURT]) // in shadow most of the day
  // Inner walls face into the courtyard.
  const inner = [seg([CX, CY1], [CX, CY0]), seg([0, CY1], [CX, CY1])]
  for (const g of inner) {
    wall(stone, g, 0, g.len, COURT, ROOF)
    const n = Math.floor(g.len / 4)
    for (let k = 0; k < n; k++) {
      const sc = (g.len * (k + 0.5)) / n
      pane(g, sc - 0.9, sc + 0.9, 16.2, 24.6)
    }
  }
  // Square block under the drum: walls from the courtyard up, cornice, balustrade.
  const be = seg([BLK, 0], [BLK, BLK]), bn = seg([BLK, BLK], [0, BLK])
  wall(stone, be, PW, BLK, ROOF - 0.5, 34.6)
  wall(stone, be, 0, PW, PED_EAVE, 34.6)
  wall(stone, bn, 0, BLK, COURT, 34.6)
  for (const g of [be, bn]) {
    band(stone, g, g === be ? 0 : -0.5, g.len + 0.5, cornice(33.8, 34.6, 0.5))
    band(stone, g, g === be ? 0 : -0.5, g.len + 0.5, [[0, 34.6], [0.2, 34.6], [0.2, 36.0], [-0.4, 36.0], [-0.4, 34.6]])
    const cs = g === bn ? [3.4, 10.3, 17.2] : [(PW + BLK) / 2]
    for (const sc of cs) {
      if (g === bn) pane(g, sc - 1.0, sc + 1.0, 16.2, 24.6)
      pane(g, sc - 1.0, sc + 1.0, 29.6, 32.6)
    }
  }
  // Block top: the quarter annulus between the square and the drum podium.
  {
    const r = 17.7, n = 8
    for (let k = 0; k < n; k++) {
      const a0 = (k * Math.PI) / 2 / n, a1 = ((k + 1) * Math.PI) / 2 / n
      const sq = (a: number): V3 => { const m = Math.max(Math.cos(a), Math.sin(a)); return [(BLK * Math.cos(a)) / m, (BLK * Math.sin(a)) / m, 34.6] }
      const ci = (a: number): V3 => [r * Math.cos(a), r * Math.sin(a), 34.6]
      quad(stone, ci(a0), sq(a0), sq(a1), ci(a1), [up, up, up, up])
    }
  }
  // Closed underneath, for the shadow pass.
  quad(stone, [0, 0, 0], [0, WV, 0], [WU, WV, 0], [WU, 0, 0])
}

for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  SX = sx; SY = sy
  quadrant(sx > 0 ? 47.5 : 51.5)
}
SX = 1; SY = 1

// ---------------------------------------------------------------------------
// Drum, dome and lantern: solids of revolution about the origin.
const SEG = 32
function lathe(part: Part, prof: [number, number][], seg = SEG, smooth = true, phase = 0) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    for (let i = 0; i < seg; i++) {
      const t0 = phase + (i / seg) * 2 * Math.PI, t1 = phase + ((i + 1) / seg) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
      const nn = (t: number): V3 => unit([(Math.cos(t) * dz) / l, (Math.sin(t) * dz) / l, -dr / l])
      const n = smooth ? [nn(t0), nn(t1), nn(t1), nn(t0)] : undefined
      if (r1 < 1e-6) { tri(part, p(r0, z0, t0), p(r0, z0, t1), [0, 0, z1], n && [n[0], n[1], up]); continue }
      if (r0 < 1e-6) { tri(part, [0, 0, z0], p(r1, z1, t1), p(r1, z1, t0), n && [down, n[2], n[3]]); continue }
      quad(part, p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), p(r1, z1, t0), n)
    }
  }
}
/** A box standing radially at angle a: radial r0..r1, tangential half width w. */
function radialBox(part: Part, a: number, r0: number, r1: number, w: number, z0: number, z1: number, topW = w) {
  const c = Math.cos(a), s = Math.sin(a)
  const q = (r: number, t: number, z: number): V3 => [r * c - t * s, r * s + t * c, z]
  const B = [q(r0, -w, z0), q(r1, -w, z0), q(r1, w, z0), q(r0, w, z0)]
  const Tp = [q(r0, -topW, z1), q(r1, -topW, z1), q(r1, topW, z1), q(r0, topW, z1)]
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quad(part, B[i], B[j], Tp[j], Tp[i]) }
  quad(part, Tp[0], Tp[1], Tp[2], Tp[3])
}
/** A tapering finial on a pedestal, square in plan. */
function spike(part: Part, a: number, r: number, w: number, z0: number, z1: number) {
  const c = Math.cos(a), s = Math.sin(a)
  const q = (dr: number, t: number, z: number): V3 => [(r + dr) * c - t * s, (r + dr) * s + t * c, z]
  const B = [q(-w, -w, z0), q(w, -w, z0), q(w, w, z0), q(-w, w, z0)]
  const tip = q(0, 0, z1)
  for (let i = 0; i < 4; i++) tri(part, B[i], B[(i + 1) % 4], tip)
}

const STEP = (2 * Math.PI) / 16 // 16 bays round the drum; a window faces each axis
// Drum podium, plain, with a cornice where the colonnade stands.
lathe(stone, [[17.7, 34.0], [17.7, 40.5], [18.1, 41.0], [15.6, 41.0]], 24)
// Colonnade: a 16-sided windowed wall with a pier and a pair of columns at each angle.
{
  const R = 15.6, half = STEP / 2
  for (let k = 0; k < 16; k++) {
    const a0 = k * STEP - half, a1 = k * STEP + half
    const p = (a: number, z: number, r = R): V3 => [r * Math.cos(a), r * Math.sin(a), z]
    quad(stone, p(a0, 41), p(a1, 41), p(a1, 51.6), p(a0, 51.6))
    // window centred on the facet (the facet's apothem is R cos(half))
    const ap = R * Math.cos(half) + 0.06, w = 1.15, c = k * STEP
    const q = (t: number, z: number): V3 => [ap * Math.cos(c) - t * Math.sin(c), ap * Math.sin(c) + t * Math.cos(c), z]
    quad(win, q(-w, 42.6), q(w, 42.6), q(w, 49.4), q(-w, 49.4))
    // pier and paired columns at the angle between facets
    const pa = a1
    radialBox(stone, pa, 14.8, 16.75, 1.35, 41, 51.6)
    for (const t of [-0.8, 0.8]) {
      const cx = 17.3 * Math.cos(pa) - t * Math.sin(pa), cy = 17.3 * Math.sin(pa) + t * Math.cos(pa)
      column(stone, [cx, cy], 0.5, 41, 51.4, 6)
    }
  }
}
// Entablature, attic, and the ring of pedestals with finials round the dome's foot.
lathe(stone, [[15.4, 51.2], [17.9, 51.9], [17.9, 53.0], [15.35, 53.0], [15.35, 56.0], [15.75, 56.6], [14.2, 56.6]], 24)
for (let k = 0; k < 16; k++) {
  const a = k * STEP + STEP / 2
  radialBox(stone, a, 15.0, 16.8, 0.85, 53.0, 55.6)
  radialBox(stone, a, 15.6, 16.6, 0.42, 55.6, 57.8, 0.22) // the urn on its pedestal
}
// Dome: a half-ellipse 14.2 m across at the springing and 15 m tall (lidar fit).
const DR = 14.2, DZ = 56.5, DH = 15.0
const domeAt = (r: number): number => DZ + DH * Math.sqrt(Math.max(0, 1 - (r / DR) ** 2))
const DOME_TOP_R = 5.0
const domeRows: number[] = []
for (let i = 0; i <= 9; i++) {
  const t = (i / 9) * Math.acos(DOME_TOP_R / DR)
  domeRows.push(DR * Math.cos(t))
}
{
  // Smooth ellipse normals; the top row is the gilded garland band.
  for (let i = 0; i < domeRows.length - 1; i++) {
    const r0 = domeRows[i], r1 = domeRows[i + 1], z0 = domeAt(r0), z1 = domeAt(r1)
    const part = i >= domeRows.length - 2 ? gold : slate
    for (let k = 0; k < SEG; k++) {
      const t0 = (k / SEG) * 2 * Math.PI, t1 = ((k + 1) / SEG) * 2 * Math.PI
      const p = (r: number, z: number, t: number): V3 => [r * Math.cos(t), r * Math.sin(t), z]
      const nn = (r: number, z: number, t: number): V3 => unit([(r / DR ** 2) * Math.cos(t), (r / DR ** 2) * Math.sin(t), (z - DZ) / DH ** 2])
      quad(part, p(r0, z0, t0), p(r0, z0, t1), p(r1, z1, t1), p(r1, z1, t0), [nn(r0, z0, t0), nn(r0, z0, t1), nn(r1, z1, t1), nn(r1, z1, t0)])
    }
  }
  // gilded ring at the springing
  lathe(gold, [[14.36, 56.55], [14.2, 57.4]])
  // 16 gilded ribs, over the drum's piers
  for (let k = 0; k < 16; k++) {
    const a = k * STEP + STEP / 2
    for (let i = 0; i < domeRows.length - 2; i++) {
      const r0 = domeRows[i], r1 = domeRows[i + 1]
      const pt = (r: number, t: number): V3 => {
        const z = domeAt(r), n = unit([r / DR ** 2, 0, (z - DZ) / DH ** 2])
        const rr = r + n[0] * 0.14, zz = z + n[2] * 0.14, aa = a + t / Math.max(r, 1)
        return [rr * Math.cos(aa), rr * Math.sin(aa), zz]
      }
      const w0 = 0.32, w1 = 0.32
      quad(gold, pt(r0, -w0), pt(r0, w0), pt(r1, w1), pt(r1, -w1))
    }
  }
  // gilded cartouches, one on each panel above its middle
  for (let k = 0; k < 16; k++) {
    const a = k * STEP, r = 10.6, z = domeAt(r)
    const n = unit([r / DR ** 2, 0, (z - DZ) / DH ** 2])
    const tz: V3 = unit([-n[2], 0, n[0]]) // up the dome in the radial plane
    const c: V3 = [r + n[0] * 0.12, 0, z + n[2] * 0.12]
    const ring: V3[] = []
    for (let j = 0; j < 6; j++) {
      const th = (j / 6) * 2 * Math.PI, e = 1.0 * Math.cos(th), f = 1.3 * Math.sin(th)
      const lp: V3 = [c[0] + tz[0] * f, e, c[2] + tz[2] * f]
      ring.push([lp[0] * Math.cos(a) - lp[1] * Math.sin(a), lp[0] * Math.sin(a) + lp[1] * Math.cos(a), lp[2]])
    }
    const cc: V3 = [c[0] * Math.cos(a), c[0] * Math.sin(a), c[2]]
    const nw: V3 = [n[0] * Math.cos(a), n[0] * Math.sin(a), n[2]]
    for (let j = 0; j < 6; j++) tri(gold, cc, ring[j], ring[(j + 1) % 6], [nw, nw, nw])
  }
}
// Lantern: ring platform, octagonal base stage with gilded urns, a ring of
// gilded columns round a slate core, gilded cornice, upper stage, gilded crown,
// slate spire and gilded finial (lidar tip 93.35; published 93.6).
const LZ = domeAt(DOME_TOP_R)
lathe(slate, [[DOME_TOP_R + 0.1, LZ - 0.3], [5.3, 71.6], [5.3, 72.1], [4.05, 72.1]], 16)
lathe(slate, [[4.05, 72.1], [4.05, 74.0], [3.9, 74.0], [2.45, 74.0]], 8, false, Math.PI / 8)
for (let k = 0; k < 8; k++) spike(gold, (k + 0.5) * (Math.PI / 4), 4.2, 0.32, 72.1, 76.0)
lathe(slate, [[2.45, 74.0], [2.45, 79.9]], 8, true, Math.PI / 8)
for (let k = 0; k < 8; k++) {
  const a = (k + 0.5) * (Math.PI / 4)
  column(gold, [3.15 * Math.cos(a), 3.15 * Math.sin(a)], 0.3, 74.0, 79.7, 6)
}
lathe(gold, [[3.1, 79.6], [3.65, 80.0], [3.65, 80.7], [2.25, 80.7]], 8, false, Math.PI / 8)
lathe(slate, [[2.25, 80.7], [2.25, 82.6], [1.95, 82.6]], 8, false, Math.PI / 8)
lathe(gold, [[1.95, 82.6], [1.7, 84.0], [1.0, 85.2], [0.85, 85.2]], 8, true, Math.PI / 8)
lathe(slate, [[0.85, 85.2], [0.12, 92.3]], 8, true)
lathe(gold, [[0.12, 92.3], [0.32, 92.6], [0.3, 92.9], [0.08, 93.1], [0.0, 93.6]], 8, true)

// sRGB from the photos: the granite in daylight (cool pale grey), the leaded
// dome (slate grey with a blue cast), its gilding, the teal skylight bands.
const parts = [
  { part: stone, material: finish('granite', 0xe4e1d9) },
  { part: win, material: PALETTE.window },
  { part: roof, material: { ...PALETTE.roof, color: 0xb6bcbf } }, // pale tar and gravel in the aerials
  { part: skylight, material: { name: 'glass', color: 0x88aeaa, roughness: 0.3 } },
  { part: slate, material: finish('dome-slate', 0x7d878d) },
  { part: gold, material: finish('gilt', 0xd6b24f, 0.5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('San Francisco City Hall', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 93.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-city-hall.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
