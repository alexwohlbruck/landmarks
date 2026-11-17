/**
 * Independence Hall (the Pennsylvania State House, 1732-53; steeple rebuilt
 * 1828 by William Strickland), Chestnut Street between 5th and 6th,
 * Philadelphia — original procedural geometry, CC0-1.0.
 * bun generators/phl-independence-hall.ts
 *
 * Also exports the small kit the other phl- models by this builder use
 * (Congress Hall, Liberty Bell Center): oriented faces, arcade walls with
 * real semicircular openings, arched panels and Georgian sash windows. The
 * Independence Hall model is only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/25271595,
 * 39.948904,-75.150028. Its walls run at 99.4° / 9.4°, so the catalog
 * bearing is 9.4 and the building is square to this frame: +y is the
 * Chestnut Street (north) front, -y Independence Square.
 *
 * What the outline covers: the main block, the south tower and steeple, the
 * two arcades (hyphens) and the two wing buildings (the 1890s-1960s
 * reconstructions of the 1736 wings). Congress Hall (way/40083518) and Old
 * City Hall (way/40083567) are separate buildings and separate models.
 *
 * Identity, in order: the white wooden steeple on the brick tower over the
 * square — the square clock stage with its big dial and balustrade, the
 * octagonal arcaded belfry, the bell dome, the small lantern and spire; the
 * long two-storey red-brick block with nine bays, white cornice, quoins and
 * the balustraded roof deck between the end walls, each end wall topped by a
 * pair of chimneys joined by an arched screen; the open three-arch arcades
 * to the low hipped wing buildings; the stone tall-case clock on the west
 * end wall. At night the brick and the steeple are floodlit, the windows
 * glow warm behind their curtains and the four dials glow.
 *
 * Evidence:
 *  - plan: OSM outline and parts (way/335689527 main block, 335689528-530
 *    and 335689536/336004603 the tower and steeple, 335689534/535 the
 *    arcades, 335689531/533 the wings). HABS PA-1430 (Library of Congress,
 *    public domain; delineated 1986-87 from stereo photogrammetry), sheet 3
 *    first-floor plan: main block 32.7 × 13.8 m, tower 10.7 m square
 *    projecting 9.4 m, arcades 10.4 m long set 1.4 m behind the north front,
 *    wings 14.0 × 9.1 m. The main block uses HABS' 32.6 m length and OSM's
 *    14.7 m depth (lidar suggests ~15 m between the walls; HABS 13.8 m),
 *    so its north front stays on OSM's line; the tower is on OSM's centre.
 *  - heights: HABS sheets 4 and 5 (north and south elevations, 1:128, scale
 *    bar 32.7 px/m on the LoC scan): main cornice 12.3-12.6 m, roof deck
 *    15.2 m, balustrade 16.2 m, chimney screens 18.7 m; tower stages 12.6,
 *    15.9 (pediment band; apex 17.25), 21.0-21.6 (brick tower cornice),
 *    white clock stage 22.4-27.9 with the dial centre at 25.5 m, cornice to
 *    28.5, balustrade 29.6, belfry 30.6-36.2, dome to 38.7, lantern to
 *    40.8, lantern cap 41.8, spire 47, ball 47.3, vane top 51.4 m (the
 *    published 168 ft 7 in, which OSM also gives the spire part). Wings
 *    and arcades from HABS sheet 21 (figured dimensions): wing floors 0,
 *    3.12 and 6.23 m, ridge 8.98, chimneys 10.94 m; arcade arches springing
 *    at 3.29 m, keystones 4.9 m, roof peak 6.69 m.
 *  - lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 0.5 m
 *    grid: eave 12.7, deck 15.7, balustrade 16.6, brick tower top 21.2,
 *    clock-stage balustrade 29.9, lantern 41.2, highest return 50.2 m (the
 *    vane rod), all above the local ground; agrees with HABS to ~0.5 m.
 *  - window bays: nine to the north front (3.43 m centres), three each side
 *    of the tower on the south; sashes 1.8 × 3.2 m (HABS sheet 4); marble
 *    panels under the upper windows; tower Palladian window, oculus,
 *    pediment and upper window from HABS sheet 5 and the photos.
 *  - colours, from the daylight photos: the warm red Flemish-bond brick
 *    pulled to the palette's lightness; the white painted wood of the
 *    cornices, sashes, balustrades and steeple (palette trim); the
 *    weathered grey cedar shakes of the roofs and the bell dome; the dark
 *    near-white dials in dark rims (north photo; they glow white at
 *    night, so the faces are a `window-` material, the rims charcoal); the belfry and lantern openings in charcoal.
 *  - night: Abhiram Juvvadi's night photo: brick front and steeple
 *    floodlit, sashes lit warm, dials glowing, roof dark.
 *
 * Photos (Wikimedia Commons): Exterior_of_the_Independence_Hall,_Aug_2019.jpg
 * (Mys 721tx, CC BY-SA 3.0); Independence_Hall_(DSC03685).jpg (night,
 * Polibil, CC BY-SA 4.0); Independence_Hall_008.jpg (Foolish Productions
 * Photography, CC BY-SA 4.0); Independence_Hall,_2016_2.jpg (xiquinhosilva,
 * CC BY 2.0); Independence_Hall,_Philadelphia_PA.JPG (Kwdavids, CC BY-SA
 * 3.0); Independence_Hall_Rear_Exterior.jpg and Independence_Hall_Steeple.jpg
 * (Andrew Rehbein, CC BY-SA 4.0); Independence_Hall_from_south_(rear)_Philly
 * .jpg (Smallbones, CC0); Independence_Hall_steeple,_Philadelphia,
 * _Pennsylvania_LCCN2011630516.tif (Carol M. Highsmith, public domain);
 * Rear_of_Independence_Hall,_Philadelphia,_PA.jpg (Hsrifkin, CC BY-SA 4.0);
 * West_wing_building_of_Independence_Hall_and_Congress_Hall.jpg (Ben
 * Franske, CC BY-SA 4.0); Independence_Mall_2004.jpg (Robin Miller, NPS,
 * public domain, the high view from the south). HABS PA-1430 sheets 3, 4, 5, 19 and 21 (public
 * domain). USGS NAIP for the plan and roof colours (the deck is flat-seam
 * copper, the slopes cedar shakes). No commercial imagery.
 *
 * Left out: pilasters and capitals on the tower, the urns (except the four
 * on the clock-stage balustrade), the garland under the dials, the
 * downspouts, the soapstone water table, the sash bars, the south porch
 * steps, the Barry and Washington statues.
 *
 * Doubts: the main block's depth (OSM 14.7, HABS 13.8, lidar ~15 m); the
 * east and west end-wall windows are placed from HABS sheet 19 and two
 * photos only; the arcades' depth follows HABS, the lidar puts them ~1 m
 * further north; the east wing is drawn as the west wing's mirror (HABS
 * figures only the west wing) without its chimneys, as the elevations
 * show; the roof deck is flat-seam copper (pale green in NAIP and the
 * high photo) but drawn in the shake grey to keep to six materials.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, lathe, rect, save, walls, type XY } from './chi-aon-center'
import { hipRoof } from './chi-board-of-trade'

// ---------------------------------------------------------------------------
// Kit, shared by this builder's phl- models.

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A convex polygon, wound so that it faces `n`. */
export function face(p: Part, pts: V3[], n: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const ring = dot(g, n) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < ring.length - 1; i++) p.tri(ring[0], ring[i], ring[i + 1])
}

/** An axis-aligned box with all six faces (top and bottom optional). */
export function cube(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true, bottom = false) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  if (top) cap(p, rect(x0, y0, x1, y1), z1)
  if (bottom) cap(p, rect(x0, y0, x1, y1), z0, false)
}

/** A box whose top edge is chamfered by `b` (walls in `wall`, top in `top`). */
export function bbox(wall: Part, top: Part | null, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, b = 0.25) {
  const r = rect(x0, y0, x1, y1), i = inset(r, b)
  walls(wall, r, z0, z1 - b)
  walls(wall, r, z1 - b, z1, i)
  if (top) cap(top, i, z1)
}

/** A regular polygon ring, counter-clockwise, a flat side facing each axis when n = 8. */
export function ngon(cx: number, cy: number, r: number, n: number, a0 = Math.PI / n): XY[] {
  return Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + (i * 2 * Math.PI) / n), cy + r * Math.sin(a0 + (i * 2 * Math.PI) / n)] as XY)
}

/** A point s along wall a→b (counter-clockwise ring), at z, `out` outside it. */
export function along(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  return { L, u, n, P: (s: number, z: number, out = 0): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z] }
}

/** A flat rectangle on wall a→b, centred `c` along it, half-width `hw`. */
export function rectOn(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, z1: number, out = 0.05) {
  const { P } = along(a, b)
  p.quad(P(c - hw, z0, out), P(c + hw, z0, out), P(c + hw, z1, out), P(c - hw, z1, out))
}

/** A flat round-headed panel on wall a→b: a rectangle to the springline zs, then a semicircle. */
export function archOn(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, zs: number, out = 0.05, seg = 10) {
  const { P } = along(a, b)
  if (zs > z0) p.quad(P(c - hw, z0, out), P(c + hw, z0, out), P(c + hw, zs, out), P(c - hw, zs, out))
  const C = P(c, zs, out)
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI
    p.tri(C, P(c + hw * Math.cos(t0), zs + hw * Math.sin(t0), out), P(c + hw * Math.cos(t1), zs + hw * Math.sin(t1), out))
  }
}

/** A round disc on wall a→b. */
export function discOn(p: Part, a: XY, b: XY, c: number, z: number, r: number, out = 0.06, seg = 16) {
  const { P } = along(a, b)
  const C = P(c, z, out)
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
    p.tri(C, P(c + r * Math.cos(t0), z + r * Math.sin(t0), out), P(c + r * Math.cos(t1), z + r * Math.sin(t1), out))
  }
}

/** A triangular pediment standing proud of wall a→b: base z0, apex z1, depth d. */
export function pedimentOn(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, z1: number, d = 0.3) {
  const { P, n } = along(a, b)
  const N: V3 = [n[0], n[1], 0]
  face(p, [P(c - hw, z0, d), P(c + hw, z0, d), P(c, z1, d)], N)
  const l = Math.hypot(hw, z1 - z0)
  const sl: V3 = [(-(z1 - z0) / l) * along(a, b).u[0], (-(z1 - z0) / l) * along(a, b).u[1], hw / l]
  const sr: V3 = [((z1 - z0) / l) * along(a, b).u[0], ((z1 - z0) / l) * along(a, b).u[1], hw / l]
  face(p, [P(c - hw, z0, 0), P(c - hw, z0, d), P(c, z1, d), P(c, z1, 0)], sl)
  face(p, [P(c + hw, z0, d), P(c + hw, z0, 0), P(c, z1, 0), P(c, z1, d)], sr)
  face(p, [P(c - hw, z0, 0), P(c + hw, z0, 0), P(c + hw, z0, d), P(c - hw, z0, d)], [0, 0, -1])
}

/**
 * A Georgian sash on wall a→b: a white frame (`frame`) a little larger than
 * the glazing (`glass`), both flat on the wall.
 */
export function sash(frame: Part, glass: Part, a: XY, b: XY, c: number, hw: number, z0: number, z1: number, f = 0.2) {
  rectOn(frame, a, b, c, hw + f, z0 - f, z1 + f, 0.04)
  rectOn(glass, a, b, c, hw, z0, z1, 0.08)
}

/**
 * A wall with round-arched openings cut right through it: an arcade. The
 * wall runs along u from u0 to u1, is `t` thick across w (w = 0 is the face
 * the normal `front` points out of), and stands z0..z1. `M(u, w, z)` maps to
 * the map frame. Each opening is centred at c, half-width hw, springing at zs.
 */
export function arcade(p: Part, M: (u: number, w: number, z: number) => V3, u0: number, u1: number, t: number, z0: number, z1: number, open: { c: number; hw: number; zs: number }[], seg = 10, ends = true) {
  const vec = (du: number, dw: number, dz: number): V3 => sub(M(du, dw, dz), M(0, 0, 0))
  const front = vec(0, -1, 0), back = vec(0, 1, 0), up: V3 = [0, 0, 1]
  const os = [...open].sort((a, b) => a.c - b.c)
  for (const [w, n] of [[0, front], [t, back]] as [number, V3][]) {
    // Piers between openings, full height.
    let u = u0
    for (const o of os) {
      face(p, [M(u, w, z0), M(o.c - o.hw, w, z0), M(o.c - o.hw, w, z1), M(u, w, z1)], n)
      u = o.c + o.hw
    }
    face(p, [M(u, w, z0), M(u1, w, z0), M(u1, w, z1), M(u, w, z1)], n)
    // Spandrels: strips from the arch up to the top line.
    for (const o of os) {
      for (let k = 0; k < seg; k++) {
        const a0 = Math.PI - (k / seg) * Math.PI, a1 = Math.PI - ((k + 1) / seg) * Math.PI
        const x0 = o.c + o.hw * Math.cos(a0), x1 = o.c + o.hw * Math.cos(a1)
        const y0 = o.zs + o.hw * Math.sin(a0), y1 = o.zs + o.hw * Math.sin(a1)
        face(p, [M(x0, w, y0), M(x1, w, y1), M(x1, w, z1), M(x0, w, z1)], n)
      }
    }
  }
  for (const o of os) {
    // Jambs, facing into the opening.
    face(p, [M(o.c - o.hw, 0, z0), M(o.c - o.hw, t, z0), M(o.c - o.hw, t, o.zs), M(o.c - o.hw, 0, o.zs)], vec(1, 0, 0))
    face(p, [M(o.c + o.hw, 0, z0), M(o.c + o.hw, t, z0), M(o.c + o.hw, t, o.zs), M(o.c + o.hw, 0, o.zs)], vec(-1, 0, 0))
    // Soffit of the arch, facing down and in.
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * Math.PI, a1 = ((k + 1) / seg) * Math.PI, am = (a0 + a1) / 2
      const pt = (a: number, w: number) => M(o.c + o.hw * Math.cos(a), w, o.zs + o.hw * Math.sin(a))
      const n = sub(M(o.c, 0, o.zs), M(o.c + Math.cos(am), 0, o.zs + Math.sin(am)))
      face(p, [pt(a0, 0), pt(a1, 0), pt(a1, t), pt(a0, t)], n)
    }
  }
  face(p, [M(u0, 0, z1), M(u1, 0, z1), M(u1, t, z1), M(u0, t, z1)], up)
  if (ends) {
    face(p, [M(u0, 0, z0), M(u0, t, z0), M(u0, t, z1), M(u0, 0, z1)], vec(-1, 0, 0))
    face(p, [M(u1, 0, z0), M(u1, t, z0), M(u1, t, z1), M(u1, 0, z1)], vec(1, 0, 0))
  }
}

/** Openings of equal width spread along u0..u1 with piers `pier` wide at both ends. */
export function spread(u0: number, u1: number, n: number, pier: number, zs: number) {
  const hw = (u1 - u0 - (n + 1) * pier) / n / 2
  return Array.from({ length: n }, (_, i) => ({ c: u0 + pier + hw + i * (2 * hw + pier), hw, zs }))
}

/** Floodlight share for a floodlit wall: faces lit, tops only a little. */
export const floodWalls = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)

// ---------------------------------------------------------------------------
// Independence Hall

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), dial = new Part(), dark = new Part()

  // Main block: HABS length, OSM north front and depth.
  const CX = 0.3, HX = 16.3, X0 = CX - HX, X1 = CX + HX
  const YN = 7.27, YS = -7.4, CY = (YN + YS) / 2
  const EAVE = 12.3, CORN = 12.65, DECK = 15.2, DH = 3.1 // deck half-width

  // Walls, then the cornice round them.
  const block = rect(X0, YS, X1, YN)
  walls(brick, block, 0, EAVE)
  bbox(trim, null, X0 - 0.45, YS - 0.45, X1 + 0.45, YN + 0.45, EAVE, CORN, 0.3)
  // Quoins: pale stone strips on the four corners.
  for (const [x, y, sx, sy] of [[X0, YS, 1, 1], [X1, YS, -1, 1], [X1, YN, -1, -1], [X0, YN, 1, -1]] as [number, number, number, number][]) {
    cube(trim, Math.min(x - sx * 0.05, x + sx * 0.6), Math.min(y - sy * 0.05, y + sy * 0.05), Math.max(x - sx * 0.05, x + sx * 0.6), Math.max(y - sy * 0.05, y + sy * 0.05), 0.8, EAVE, false)
    cube(trim, Math.min(x - sx * 0.05, x + sx * 0.05), Math.min(y - sy * 0.05, y + sy * 0.6), Math.max(x - sx * 0.05, x + sx * 0.05), Math.max(y - sy * 0.05, y + sy * 0.6), 0.8, EAVE, false)
  }

  // The roof: shakes up from the cornice to the copper deck, the end walls
  // rising as brick trapezoids to the deck.
  {
    const e = 0.15 // eave line just inside the cornice's outer edge
    const yN0 = YN + 0.3 - e, yS0 = YS - 0.3 + e, yN1 = CY + DH, yS1 = CY - DH
    face(roof, [[X0, yN0, CORN], [X1, yN0, CORN], [X1, yN1, DECK], [X0, yN1, DECK]], [0, 0.6, 0.8])
    face(roof, [[X0, yS0, CORN], [X1, yS0, CORN], [X1, yS1, DECK], [X0, yS1, DECK]], [0, -0.6, 0.8])
    face(roof, [[X0, yS1, DECK], [X1, yS1, DECK], [X1, yN1, DECK], [X0, yN1, DECK]], [0, 0, 1])
    for (const [x, s] of [[X0, -1], [X1, 1]] as [number, number][]) {
      face(brick, [[x, yS0, CORN], [x, yN0, CORN], [x, yN1, DECK], [x, yS1, DECK]], [s, 0, 0])
    }
    // Balustrade along the deck's long edges, between the chimney screens.
    for (const y of [yN1 - 0.15, yS1 + 0.15]) bbox(trim, trim, X0 + 1.0, y - 0.13, X1 - 1.0, y + 0.13, DECK, DECK + 1.0, 0.08)
    // Chimney screens on the end walls: two stacks and an arched screen.
    for (const x of [X0 + 0.45, X1 - 0.45]) {
      const M = (u: number, w: number, z: number): V3 => [x - 0.45 + w, u, z]
      arcade(brick, M, CY - DH - 0.1, CY + DH + 0.1, 0.9, DECK, 18.7, spread(CY - DH - 0.1, CY + DH + 0.1, 3, 0.7, 16.95), 8)
    }
  }

  // Facade: nine bays on the north front (3.43 m centres), two storeys.
  const BAYS = [-13.65, -10.2, -6.75, -3.3, 0, 3.3, 6.75, 10.2, 13.65]
  const LOW: [number, number] = [1.9, 5.15], UP: [number, number] = [8.25, 11.45]
  const nA: XY = [X1, YN], nB: XY = [X0, YN], sA: XY = [X0, YS], sB: XY = [X1, YS]
  const eA: XY = [X1, YS], eB: XY = [X1, YN], wA: XY = [X0, YN], wB: XY = [X0, YS]
  // Belt course and the marble panels under the upper sashes.
  bbox(trim, null, X0 - 0.06, YS - 0.06, X1 + 0.06, YN + 0.06, 5.95, 6.25, 0.04)
  for (const b of BAYS) {
    const s = HX - b // along the north wall from its east end
    sash(trim, win, nA, nB, s, 0.9, UP[0], UP[1])
    rectOn(trim, nA, nB, s, 1.05, 6.55, 7.35, 0.04)
    if (b === 0) rectOn(trim, nA, nB, s, 0.95, 0.4, 4.6, 0.06) // the door
    else sash(trim, win, nA, nB, s, 0.9, LOW[0], LOW[1])
  }
  for (const b of BAYS.filter((b) => Math.abs(b) > 6)) {
    const s = HX + b
    sash(trim, win, sA, sB, s, 0.9, UP[0], UP[1])
    sash(trim, win, sA, sB, s, 0.9, LOW[0], LOW[1])
    rectOn(trim, sA, sB, s, 1.05, 6.55, 7.35, 0.04)
  }
  // End walls: two upper sashes each, one lower on the south half (the
  // arcade meets the north half); the west end keeps its middle for the clock.
  for (const [a, b, xs] of [[eA, eB, 1], [wA, wB, -1]] as [XY, XY, number][]) {
    const off = (y: number) => (xs > 0 ? y - YS : YN - y)
    for (const y of [CY - 4.3, CY + 4.3]) sash(trim, win, a, b, off(y), 0.85, UP[0], UP[1])
    sash(trim, win, a, b, off(CY - 4.3), 0.85, LOW[0], LOW[1])
  }

  // The west end's tall-case clock: a stone shaft from the arcade roof to a
  // pedimented head carrying a dial at the eaves.
  {
    const x = X0, y = CY + 0.2
    bbox(trim, trim, x - 0.75, y - 0.6, x, y + 0.6, 6.0, 10.0, 0.1)
    bbox(trim, trim, x - 1.0, y - 1.3, x, y + 1.3, 10.0, 13.5, 0.12)
    pedimentOn(trim, [x - 1.0, y + 1.3], [x - 1.0, y - 1.3], 1.3, 1.4, 13.5, 14.4, 0.95)
    discOn(dark, [x - 1.0, y + 1.3], [x - 1.0, y - 1.3], 1.3, 11.8, 1.05, 0.04)
    discOn(dial, [x - 1.0, y + 1.3], [x - 1.0, y - 1.3], 1.3, 11.8, 0.82, 0.08)
  }

  // ------------------------------------------------------------------ tower
  const TX = CX, TY = -11.0
  const T0 = 5.43, T1 = 5.2
  const stage = (h: number) => rect(TX - h, TY - h, TX + h, TY + h)
  walls(brick, stage(T0), 0, EAVE)
  bbox(trim, null, TX - T0 - 0.45, TY - T0 - 0.45, TX + T0 + 0.45, YS, EAVE, CORN, 0.3)
  walls(brick, stage(T1), CORN, 21.0)
  bbox(trim, null, TX - T1 - 0.12, TY - T1 - 0.12, TX + T1 + 0.12, TY + T1 + 0.12, 15.9, 16.2, 0.05)
  bbox(trim, trim, TX - T1 - 0.4, TY - T1 - 0.4, TX + T1 + 0.4, TY + T1 + 0.4, 21.0, 21.6, 0.25)
  // Corner urns' plinth, then the white clock stage.
  bbox(trim, trim, TX - 4.3, TY - 4.3, TX + 4.3, TY + 4.3, 21.6, 22.4, 0.12)
  const CL = 3.65
  walls(trim, stage(CL), 22.4, 27.9)
  bbox(trim, trim, TX - CL - 0.35, TY - CL - 0.35, TX + CL + 0.35, TY + CL + 0.35, 27.9, 28.5, 0.2)
  // The balustrade, a white parapet round a roof, with urns at its corners.
  {
    const r = stage(3.45), i = inset(r, 0.3)
    walls(trim, r, 28.5, 29.6)
    walls(trim, [...i].reverse(), 28.5, 29.6)
    for (let k = 0; k < 4; k++) {
      const a = r[k], b = r[(k + 1) % 4], c = i[(k + 1) % 4], d = i[k]
      face(trim, [[a[0], a[1], 29.6], [b[0], b[1], 29.6], [c[0], c[1], 29.6], [d[0], d[1], 29.6]], [0, 0, 1])
      lathe(trim, a[0] + (a[0] < TX ? 0.15 : -0.15), a[1] + (a[1] < TY ? 0.15 : -0.15), [[0.18, 29.6], [0.25, 29.9], [0.12, 30.3], [0, 30.45]], 6)
    }
    cap(roof, i, 28.6)
  }
  // Tower faces: south, east and west carry the Palladian window (south
  // only), the oculus under the pediment and the upper sash; all four the
  // dial. Faces as wall segments a→b of the stage rings.
  const faces = (h: number) => {
    const r = stage(h)
    return { S: [r[0], r[1]], E: [r[1], r[2]], N: [r[2], r[3]], W: [r[3], r[0]] } as Record<string, [XY, XY]>
  }
  for (const k of ['S', 'E', 'W']) {
    const [a, b] = faces(T1)[k]
    const c = T1
    discOn(trim, a, b, c, 14.3, 1.25, 0.05)
    discOn(win, a, b, c, 14.3, 0.95, 0.09)
    pedimentOn(trim, a, b, c, 3.4, 16.15, 17.45, 0.35)
    sash(trim, win, a, b, c, 0.9, 17.6, 19.9)
    const [a0, b0] = faces(T0)[k]
    if (k === 'S') {
      // Palladian window over the door.
      archOn(trim, a0, b0, T0, 1.25, 4.4, 8.4, 0.04)
      archOn(win, a0, b0, T0, 0.95, 4.6, 8.4, 0.08)
      sash(trim, win, a0, b0, T0 - 2.0, 0.5, 4.6, 7.6)
      sash(trim, win, a0, b0, T0 + 2.0, 0.5, 4.6, 7.6)
      rectOn(trim, a0, b0, T0, 1.1, 0.4, 3.6, 0.06)
    } else {
      sash(trim, win, a0, b0, T0, 0.85, 8.4, 11.2)
      sash(trim, win, a0, b0, T0, 0.85, 2.0, 5.0)
    }
  }
  {
    const [a, b] = faces(T1).N
    sash(trim, win, a, b, T1, 0.9, 17.6, 19.9)
  }
  // The dials: published 3 m across; drawn 3.5 m, a near-white face inside a
  // bold charcoal rim so they read on the white stage.
  for (const k of ['S', 'E', 'W', 'N']) {
    const [a, b] = faces(CL)[k]
    discOn(dark, a, b, CL, 25.4, 1.75, 0.04, 20)
    discOn(dial, a, b, CL, 25.4, 1.3, 0.08, 20)
  }

  // ---------------------------------------------------------------- steeple
  bbox(trim, trim, TX - 2.65, TY - 2.65, TX + 2.65, TY + 2.65, 29.6, 30.6, 0.1)
  {
    const oct = ngon(TX, TY, 2.76, 8)
    walls(trim, oct, 30.6, 35.6)
    for (let k = 0; k < 8; k++) archOn(dark, oct[k], oct[(k + 1) % 8], 1.06, 0.62, 31.2, 34.2, 0.04, 8)
    const ent = ngon(TX, TY, 2.98, 8)
    walls(trim, ent, 35.6, 36.2)
    face(trim, ent.map(([x, y]) => [x, y, 35.6] as V3), [0, 0, -1])
    // The bell dome, shakes over a curved profile.
    lathe(roof, TX, TY, [[2.98, 36.2], [2.45, 36.22], [2.42, 36.6], [2.25, 37.2], [1.85, 37.85], [1.3, 38.35], [0.95, 38.62], [0.9, 38.7]], 16, Math.PI / 8)
    // Lantern, its cap and the spire.
    const lan = ngon(TX, TY, 1.0, 8)
    walls(trim, ngon(TX, TY, 1.1, 8), 38.7, 38.95)
    walls(trim, lan, 38.95, 40.5)
    for (let k = 0; k < 8; k++) archOn(dark, lan[k], lan[(k + 1) % 8], 0.38, 0.22, 39.2, 40.0, 0.03, 6)
    walls(trim, ngon(TX, TY, 1.15, 8), 40.5, 40.8)
    face(trim, ngon(TX, TY, 1.15, 8).map(([x, y]) => [x, y, 40.5] as V3), [0, 0, -1])
    lathe(roof, TX, TY, [[1.15, 40.8], [0.95, 40.85], [0.85, 41.2], [0.55, 41.6], [0.3, 41.8], [0.28, 42.2], [0.06, 47.0], [0, 47.05]], 8, Math.PI / 8)
    lathe(trim, TX, TY, [[0, 47.0], [0.22, 47.1], [0.32, 47.3], [0.22, 47.5], [0, 47.6]], 8)
    lathe(trim, TX, TY, [[0.07, 47.6], [0.05, 51.4], [0, 51.42]], 6)
    // The vane, a flat arrow pointing along the main axis.
    const vane: V3[] = [[TX - 0.6, TY, 50.85], [TX + 0.7, TY, 50.85], [TX + 0.7, TY, 51.15], [TX - 0.6, TY, 51.15]]
    face(trim, vane, [0, -1, 0])
    face(trim, vane, [0, 1, 0])
  }

  // --------------------------------------------------- arcades and wings
  // HABS sheet 21 (west wing and arcade elevations, figured): arcade arches
  // springing at 3.29 m, keystones 4.9 m, roof peak 6.69 m; wing floors at
  // 0, 3.12 and 6.23 m, roof peak 8.98 m, chimneys 10.94 m; six bays to the
  // long fronts, doors in the end bays of the north front and the inner end
  // bay of the south; the outer end walls blank.
  const AL = 10.5, WL = 14.3, WY0 = -1.9, WY1 = 7.6
  const AY0 = YN - 4.6, AY1 = YN - 1.45 // the arcade's south and north faces
  for (const s of [-1, 1]) {
    const xa = s < 0 ? X0 - AL : X1, xb = s < 0 ? X0 : X1 + AL
    // Two arcaded walls, north and south, under a low hipped roof.
    const open = spread(xa, xb, 3, 0.62, 3.3)
    arcade(brick, (u, w, z) => [u, AY1 - w, z], xa, xb, 0.55, 0, 5.75, open, 10, false)
    arcade(brick, (u, w, z) => [u, AY0 + w, z], xa, xb, 0.55, 0, 5.75, open, 10, false)
    face(brick, [[xa, AY0 + 0.55, 5.75], [xb, AY0 + 0.55, 5.75], [xb, AY1 - 0.55, 5.75], [xa, AY1 - 0.55, 5.75]], [0, 0, -1])
    bbox(trim, null, xa, AY0 - 0.25, xb, AY1 + 0.25, 5.55, 5.95, 0.12)
    hipRoof(roof, xa, AY0 - 0.25, xb, AY1 + 0.25, 5.95, 6.7)
    // Wing building.
    const wx0 = s < 0 ? X0 - AL - WL : X1 + AL, wx1 = wx0 + WL, wcx = (wx0 + wx1) / 2
    const wr = rect(wx0, WY0, wx1, WY1)
    walls(brick, wr, 0, 6.0)
    bbox(trim, null, wx0 - 0.35, WY0 - 0.35, wx1 + 0.35, WY1 + 0.35, 5.95, 6.4, 0.2)
    hipRoof(roof, wx0 - 0.35, WY0 - 0.35, wx1 + 0.35, WY1 + 0.35, 6.4, 8.98)
    if (s < 0) for (const dx of [-2.3, 2.1]) bbox(brick, brick, wcx + dx - 0.45, WY0 + 1.2, wcx + dx + 0.45, WY0 + 2.6, 6.5, 10.94, 0.1)
    // Windows: six bays to the long fronts.
    const wa = { S: [wr[0], wr[1]], E: [wr[1], wr[2]], N: [wr[2], wr[3]], W: [wr[3], wr[0]] } as Record<string, [XY, XY]>
    for (const k of ['N', 'S']) {
      const [a, b] = wa[k]
      for (let i = 0; i < 6; i++) {
        const c = WL / 2 + (i - 2.5) * 2.25
        // Which bay is next to the arcade: on the south front s runs west to east.
        const inner = k === 'S' ? (s < 0 ? i === 5 : i === 0) : false
        sash(trim, win, a, b, c, 0.52, 3.75, 5.45)
        if ((k === 'N' && (i === 0 || i === 5)) || inner) rectOn(trim, a, b, c, 0.58, 0.2, 2.75, 0.06)
        else sash(trim, win, a, b, c, 0.52, 0.75, 2.65)
      }
    }
  }

  const steeple = (p: V3, n: V3) => (p[2] > 21 ? (n[2] > 0.7 ? 0.4 : 1) : floodWalls(p, n))
  return [
    { part: brick, material: { ...finish('ih-brick', 0xab5c49), floodlight: floodWalls } },
    { part: trim, material: { ...PALETTE.trim, floodlight: steeple } },
    { part: roof, material: finish('ih-shakes', 0x85817e) },
    // Twelve-over-twelve sashes read pale by day; warm behind curtains at night.
    { part: win, material: { ...PALETTE.window, color: 0x98a6b1 } },
    { part: dial, material: windowVariant(2, 0xf4efe4) },
    { part: dark, material: finish('ih-belfry', 0x4a4f57) },
  ]
}

if (import.meta.main) await save('phl-independence-hall', 'Independence Hall', [39.948904, -75.150028], 9.4, build(), 6500)
