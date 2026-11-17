/**
 * St George's Cathedral, Wale Street, Cape Town (Herbert Baker; foundation
 * stone 1901, chancel 1901-09, transepts 1930-36, detached bell tower 1979):
 * original procedural geometry, CC0-1.0.
 * bun generators/cpt-st-georges-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/141281671,
 * lng 18.4194365, lat -33.9248907. Its walls run at 41 / 131 degrees, so the
 * catalog bearing is 41: in the model +y is the Wale Street side (facing
 * north-east), +x the Adderley Street / Government Avenue end (south-east),
 * -x the uphill north-west end. (The minimum-area rectangle of the irregular
 * outline gives 50 degrees; the long walls themselves fit 41 exactly.)
 *
 * Identity, in order: the tall north-transept front on Wale Street, with
 * its steep gable between two square buttress-turrets topped by pinnacles,
 * the huge pointed traceried window under a deep arch, the carved balcony
 * and the three-arched porch on its flight of steps; the long nave-and-
 * chancel in brown-honey Table Mountain sandstone with a steep red-brown
 * tiled roof, a clerestory of pointed windows set in big relieving arches
 * between buttresses, and lean-to aisles below; the rose window in the
 * south transept gable on the Company's Garden side; the detached octagonal
 * bell tower behind the north-west end.
 *
 * Evidence:
 *  - plan: OSM outline way/141281671 (no building:parts and no height
 *    tags), read in the turned frame: chancel and nave x -26.5..34, the
 *    north transept front x 4.9..22.6 at y 15.8, the round stair turret
 *    x -5..4.9 beside it, the stepped south chapels (y -9.7 to -14.5), the
 *    south transept to y -17.7 with a lower annex to -20.6, the narrow
 *    north-west sanctuary x -39.5..-26.5 (8.6 m wide) and the rounded
 *    south-east end (radius about 7.6 m). The bell tower is the separate
 *    OSM octagon way/141281674 (8 m across, centre x -35.1, y -11.9); Dove's
 *    Guide (dove.cccbr.org.uk/tower/13736) puts the ring of ten in a
 *    detached tower at exactly that point, and Wikipedia says the tower
 *    (1979) is reinforced concrete clad in Table Mountain sandstone.
 *  - heights: none published. Measured on dd10 (the north front straight
 *    on), scaled to the OSM front width of 17.7 m: gable apex 38.5 m, turret
 *    tops 32 m (drawn 4.8 m square, a little
 *    bolder than the 3.8 m measured, so they read at phone size) and
 *    pinnacles to 36.6 m, the great pointed window 15.8-27.5 m
 *    (drawn 7.4 m wide, against 8.1 m measured, to clear the turrets), balcony 12.3-14.4 m, porch arches to 10.9 m, the porch
 *    floor about 2.7 m above the street, nave eaves about 18 m, aisle eaves
 *    about 10.5 m. Estimated: nave ridge 27 m (the roof pitch from js and
 *    hayes), transept walls 30 m and ridge 37.5 m, the sanctuary's 12 / 17 m
 *    (seen only as a roof end), the stair turret 22 m, the bell tower
 *    20 m to its eaves (its taper and lancets from eafeya, its octagonal
 *    top and low pyramid roof from goerge; no photo shows it whole).
 *  - bays: five clerestory bays to the chancel north-west of the transept,
 *    three to the nave south-east of it (js), each a pointed window in a
 *    round relieving arch between buttresses.
 *  - colour: mottled grey-tan Table Mountain sandstone (#b3a58e, after lead
 *    review against js, dd10 and hayes), dressings a shade lighter
 *    for the balcony, pinnacles and copings, red-brown tiles held
 *    at the palette's terracotta.
 *  - map terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s);
 *    no lidar in South Africa. The site rises gently to the south-west
 *    (the porch stands up a flight of steps from Wale Street). Elevation 0;
 *    the walls run down to y = 0 all round.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - 00000-St_Georges_Cathedral-Cape_Town-s.jpg (Janek Szymanowski, CC BY-SA
 *    3.0, 1988) "js": from above across Wale Street, the whole north side.
 *  - StGeorgesCathedral02.JPG (Mike Hayes, public domain) "hayes": the north
 *    transept and chancel from Wale Street.
 *  - Catedral_de_San_Jorge,_Ciudad_del_Cabo,_Sudáfrica,_2018-07-19,_DD_10.jpg
 *    (Diego Delso, CC BY-SA 4.0) "dd10": the north front straight on.
 *  - St_George's_Cathedral_from_inside_The_Company's_Gardens.jpg (Lara van
 *    Dyk, CC BY-SA 3.0)
 *    "garden": the south transept and its rose window.
 *  - At_Cape_Town_(MP)_2018_266.jpg (Mike Peel, CC BY-SA 4.0): the Wale
 *    Street side from the east.
 *  - St._George's_Cathedral,_Cape_Town.JPG (EaFeya, CC BY-SA 3.0) "eafeya":
 *    the bell tower from below.
 *  - St_Goerge_Cathedral.jpg (David Henry Emslie, CC BY-SA 3.0) "goerge": the bell tower's top at
 *    night from up the hill.
 *  - St_George's_Cathedral,_Wale_Street,_Cape_Town.jpg (Danie van der Merwe,
 *    CC BY 2.0); St_George's_Cathedral_CT.jpg (Mwgielink, CC BY-SA 3.0);
 *    StGeorgesCathedral.jpg (David Henry Emslie, CC BY-SA 3.0); Cape_Town_(ZA),_St_George's_
 *    Cathedral_--_2024_--_3492/3494/3497/3503.jpg (Dietmar Rabich, CC BY-SA
 *    4.0): the north front, the chancel wall, the porch, the loggia.
 * No commercial imagery. No look-only sources.
 *
 * Left out: tracery, the balcony's carving (a solid band), the loggia with
 * the cross on the globe, railings, the temporary scaffold galleries some
 * photos show on the roofs, the neighbouring Old Cathedral School.
 *
 * Doubts: the south-west side is seen only in part (garden); the south
 * chapels' roofs and the sanctuary at the north-west end are drawn plainly
 * from the outline. The south-east end is drawn as a polygonal apse after
 * the rounded OSM outline; no photo shows it clearly. All heights are
 * photo-scaled (no lidar here); expect +-2 m.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, walls, cap, inset, block, lathe, triangulate, type XY } from './chi-aon-center'
import { face, along, archOn, discOn, rectOn, ngon } from './phl-independence-hall'
import { gableRoof, pointedOn, wallSlab, pyramid } from './amsterdam-westerkerk'

const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)

function build() {
  const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

  /** Walls of a box with a bevelled top lip, plus its cap in `top`. */
  const box = (p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top: Part | null = p, bev = 0.3) =>
    block(p, top, rect(x0, y0, x1, y1), z0, z1, bev)
  /** A square buttress-turret with a chamfered shaft and a pyramid pinnacle. */
  const turret = (cx: number, cy: number, h: number, z1: number, tip: number) => {
    const r = rect(cx - h, cy - h, cx + h, cy + h)
    const ch = (q: XY[], d: number) => q.flatMap((c, i) => {
      const p = q[(i + 3) % 4], n = q[(i + 1) % 4]
      const t = (a: XY, b: XY, k: number): XY => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
      const L = Math.hypot(n[0] - c[0], n[1] - c[1])
      return [t(c, p, d / L), t(c, n, d / L)]
    })
    const ring = ch(r, 0.35)
    walls(stone, ring, 0, z1 - 0.6)
    const lip = ch(rect(cx - h - 0.2, cy - h - 0.2, cx + h + 0.2, cy + h + 0.2), 0.4)
    walls(trim, ring, z1 - 0.6, z1 - 0.3, lip)
    walls(trim, lip, z1 - 0.3, z1)
    cap(trim, lip, z1)
    pyramid(trim, ch(rect(cx - h * 0.7, cy - h * 0.7, cx + h * 0.7, cy + h * 0.7), 0.25), z1, [cx, cy, tip])
  }
  /** A gable triangle on the wall a→b (counter-clockwise ring), from z0 to the apex. */
  const gable = (p: Part, a: XY, b: XY, z0: number, apex: number, t = 0.6, o0 = -0.6) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    wallSlab(p, a, b, [[0, z0], [L, z0], [L / 2, apex]], t, o0)
  }
  /** Coping strips along the two raking edges of a gable on wall a→b. */
  const coping = (a: XY, b: XY, z0: number, apex: number, w = 0.45) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    wallSlab(trim, a, b, [[0, z0], [L / 2, apex], [L / 2, apex + w], [0, z0 + w]], 1.3, -1.0)
    wallSlab(trim, a, b, [[L / 2, apex], [L, z0], [L, z0 + w], [L / 2, apex + w]], 1.3, -1.0)
  }
  /** A clerestory or aisle bay: a pointed window in a round relieving arch. */
  const bay = (a: XY, b: XY, s: number, hw: number, z0: number, zs: number, relief = true) => {
    if (relief) archOn(trim, a, b, s, hw + 1.1, z0 - 0.6, zs + 0.2, 0.04, 10)
    pointedOn(win, a, b, s, hw, z0, zs, 0.09, 4)
  }

  // ------------------------------------------------------------ dimensions
  const NY0 = -6.9, NY1 = 8.3, NC = (NY0 + NY1) / 2 // nave walls, centre line
  const EAVE = 18, RIDGE = 27
  const XW = -26.5, XE = 26.3                       // nave/chancel ends (apse centre at XE)
  const AIS = 10.5                                   // aisle eaves

  // ------------------------------------------------------- nave and chancel
  {
    const r = rect(XW, NY0, XE, NY1)
    walls(stone, r, 0, EAVE)
    // Cornice band under the eaves and a plinth.
    walls(trim, inset(r, -0.25), EAVE - 0.7, EAVE - 0.2, inset(r, -0.25))
    gableRoof(roof, null, XW, NY0, XE, NY1, EAVE, RIDGE, true, 0.6, 0)
    // North-west gable end, with its corner turrets.
    gable(stone, [XW, NY1], [XW, NY0], EAVE - 0.4, RIDGE + 0.6, 0.8, -0.8)
    coping([XW, NY1], [XW, NY0], EAVE, RIDGE + 0.6)
    turret(XW - 0.2, NY1 - 0.4, 1.1, EAVE + 2.5, EAVE + 5.5)
    turret(XW - 0.2, NY0 + 0.4, 1.1, EAVE + 2.5, EAVE + 5.5)
    pointedOn(win, [XW, NY1], [XW, NY0], (NY1 - NY0) / 2, 2.6, 13, 18.5, 0.06, 5)
    // The polygonal south-east apse (the rounded end in OSM), r 7.6.
    const R = 7.6, n = 6
    const pts: XY[] = Array.from({ length: n + 1 }, (_, i) => {
      const t = -Math.PI / 2 + (i / n) * Math.PI
      return [XE + R * Math.cos(t), NC + R * Math.sin(t)]
    })
    for (let i = 0; i < n; i++) {
      const [a, b] = [pts[i], pts[i + 1]]
      stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE], [a[0], a[1], EAVE])
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      pointedOn(win, a, b, L / 2, 1.1, 11.5, 15.5, 0.08, 4)
      pointedOn(win, a, b, L / 2, 0.7, 3.5, 6.5, 0.08, 3)
      // Hipped roof facets to the ridge end.
      const o = (R + 0.7) / R
      face(roof, [[XE + (a[0] - XE) * o, NC + (a[1] - NC) * o, EAVE - 0.5], [XE + (b[0] - XE) * o, NC + (b[1] - NC) * o, EAVE - 0.5], [XE, NC, RIDGE]], [mx - XE, my - NC, R])
      // Buttress at each angle.
      if (i > 0) {
        const nx = (a[0] - XE) / R, ny = (a[1] - NC) / R
        const c: XY = [a[0] + nx * 0.6, a[1] + ny * 0.6]
        const ring: XY[] = [[c[0] - ny * 0.6 - nx * 0.6, c[1] + nx * 0.6 - ny * 0.6], [c[0] - ny * 0.6 + nx * 0.6, c[1] + nx * 0.6 + ny * 0.6], [c[0] + ny * 0.6 + nx * 0.6, c[1] - nx * 0.6 + ny * 0.6], [c[0] + ny * 0.6 - nx * 0.6, c[1] - nx * 0.6 - ny * 0.6]]
        const cw = ((ring[1][0] - ring[0][0]) * (ring[2][1] - ring[1][1]) - (ring[1][1] - ring[0][1]) * (ring[2][0] - ring[1][0])) < 0
        block(stone, trim, cw ? [...ring].reverse() : ring, 0, EAVE - 3, 0.3)
      }
    }
    // Hip end pinnacles where the apse meets the nave walls (js).
    turret(XE, NY1 + 0.2, 0.8, EAVE + 1.5, EAVE + 4)
    turret(XE, NY0 - 0.2, 0.8, EAVE + 1.5, EAVE + 4)

    // Clerestory: five bays of the chancel (x < 4.9) and three of the nave
    // (x > 22.6) on the north side; the same on the south above the chapels.
    const north: [XY, XY] = [[XE, NY1], [XW, NY1]], south: [XY, XY] = [[XW, NY0], [XE, NY0]]
    const nb = [-23.4, -17.4, -11.4, -5.4]
    for (const x of nb) {
      bay(north[0], north[1], XE - x, 1.2, 12.0, 15.3)
      bay(south[0], south[1], x - XW, 1.2, 12.0, 15.3)
    }
    for (const x of [-0.1, 20.4, 24.0]) bay(south[0], south[1], x - XW, 1.2, 12.0, 15.3)
    for (const x of [24.4]) bay(north[0], north[1], XE - x, 1.0, 12.0, 15.3)
    // Buttresses between the clerestory bays, standing on the aisle roofs.
    for (const x of [-26.0, -20.4, -14.4, -8.4, -2.7]) {
      box(stone, x - 0.45, NY1, x + 0.45, NY1 + 0.7, AIS, EAVE + 0.4, trim, 0.2)
      box(stone, x - 0.45, NY0 - 0.7, x + 0.45, NY0, AIS, EAVE + 0.4, trim, 0.2)
    }
  }

  // ----------------------------------------------------------------- aisles
  /** A lean-to aisle from the nave wall out to yo, x0..x1, low eave at the outer wall. */
  const aisle = (x0: number, x1: number, yi: number, yo: number, zlow: number, zhigh: number, ends: [boolean, boolean] = [true, true]) => {
    const r = yo > yi ? rect(x0, yi, x1, yo) : rect(x0, yo, x1, yi)
    walls(stone, r, 0, zlow)
    const sg = Math.sign(yo - yi), o = 0.4
    const s = (zhigh - zlow) / Math.abs(yo - yi)
    const ye = yo + sg * o, ze = zlow - o * s
    face(roof, [[x0 - 0.2, ye, ze], [x1 + 0.2, ye, ze], [x1 + 0.2, yi, zhigh], [x0 - 0.2, yi, zhigh]], [0, sg, 1 / s])
    face(roof, [[x0 - 0.2, ye, ze - 0.25], [x1 + 0.2, ye, ze - 0.25], [x1 + 0.2, ye, ze], [x0 - 0.2, ye, ze]], [0, sg, 0])
    face(roof, [[x0 - 0.2, ye, ze - 0.25], [x1 + 0.2, ye, ze - 0.25], [x1 + 0.2, yi, zhigh - 0.25], [x0 - 0.2, yi, zhigh - 0.25]], [0, 0, -1])
    if (ends[0]) face(stone, [[x0, yo, zlow], [x0, yi, zlow], [x0, yi, zhigh]], [-1, 0, 0])
    if (ends[1]) face(stone, [[x1, yo, zlow], [x1, yi, zlow], [x1, yi, zhigh]], [1, 0, 0])
    walls(trim, inset(r, -0.15), zlow - 0.5, zlow - 0.1, inset(r, -0.15))
  }
  // North aisle of the chancel, x -26.5..-6.6, out to y 10.6.
  aisle(-26.5, -4.2, NY1, 10.6, AIS - 1.5, AIS + 0.6)
  for (const x of [-23.4, -17.4, -11.4]) pointedOn(win, [-4.2, 10.6], [-26.5, 10.6], -4.2 - x, 0.55, 3.2, 6.6, 0.07, 3)
  // North aisle of the nave, x 22.6..26.3 to y 8.4: within the nave line already.
  // South chapels, stepped as in OSM, under one lean-to line.
  aisle(-26.2, -12.9, NY0, -14.0, AIS - 0.5, AIS + 1.2, [true, false])
  aisle(-12.9, -6.5, NY0, -9.7, AIS - 1.5, AIS + 0.6, [false, false])
  aisle(-6.5, -1.9, NY0, -12.9, AIS - 0.5, AIS + 1.2, [false, false])
  aisle(-1.9, 6.0, NY0, -14.5, AIS - 0.5, AIS + 1.2, [false, true])
  aisle(17.2, 22.0, NY0, -13.6, AIS - 0.5, AIS + 1.2, [true, true])
  for (const x of [-22.6, -17.0]) pointedOn(win, [-26.2, -14.0], [-12.9, -14.0], x + 26.2, 0.6, 3.2, 7.0, 0.07, 3)
  for (const x of [-4.2, 1.0]) pointedOn(win, [-6.5, -14.5], [6, -14.5], x + 6.5, 0.6, 3.2, 7.0, 0.07, 3)
  // North-west sanctuary, x -39.5..-26.5, y -3.7..4.9, lower, gabled.
  {
    const r = rect(-39.5, -3.7, XW, 4.9)
    walls(stone, r, 0, 12)
    gableRoof(roof, stone, -39.5, -3.7, XW, 4.9, 12, 17, true, 0.4, 0.2)
    walls(trim, inset(r, -0.2), 11.4, 11.9, inset(r, -0.2))
    pointedOn(win, [-39.5, 4.9], [-39.5, -3.7], 4.3, 1.6, 5.0, 10.5, 0.07, 4)
    for (const x of [-36.5, -31.5]) {
      pointedOn(win, [XW, 4.9], [-39.5, 4.9], XW - x, 0.7, 4.5, 9.5, 0.07, 3)
      pointedOn(win, [-39.5, -3.7], [XW, -3.7], x + 39.5, 0.7, 4.5, 9.5, 0.07, 3)
    }
  }

  // --------------------------------------------------------------- transepts
  const TX0 = 4.9, TX1 = 22.6, TC = (TX0 + TX1) / 2, TY = 15.8
  const TW = 30, TR = 37.5, TA = 38.5
  {
    // North transept: from the nave centre out to the Wale Street front.
    const gx0 = TX0 + 2.8, gx1 = TX1 - 2.8
    const r = rect(gx0, NC, gx1, TY - 0.6)
    walls(stone, r, 0, TW)
    gableRoof(roof, null, gx0, NC, gx1, TY - 0.6, TW, TR, false, 0.5, 0)
    // The front screen gable rises a little above the roof between the turrets.
    gable(stone, [gx1, TY - 0.6], [gx0, TY - 0.6], TW - 0.5, TA, 1.0, -0.4)
    coping([gx1, TY - 0.6], [gx0, TY - 0.6], TW + 0.3, TA)
    walls(stone, rect(gx0, TY - 0.6, gx1, TY), 0, TW)
    gable(stone, [gx0, NC], [gx1, NC], TW - 0.3, TR, 0.6, -0.6)
    // The flanking buttress-turrets, full height, with pinnacles.
    for (const cx of [TX0 + 2.0, TX1 - 2.0]) {
      turret(cx, TY - 1.3, 2.4, 32, 36.6)
      // The turrets step out at the base, below the balcony (dd10).
      box(stone, cx - 2.8, TY - 3.9, cx + 2.8, TY + 1.4, 0, 12.5, trim, 0.4)
    }
    // A second, lower stage of buttresses behind the turrets on the sides.
    box(stone, TX0, TY - 6.5, gx0, TY - 2.8, 0, 27, trim, 0.3)
    box(stone, gx1, TY - 6.5, TX1, TY - 2.8, 0, 27, trim, 0.3)
    const F: [XY, XY] = [[gx1, TY], [gx0, TY]], fc = (gx1 - gx0) / 2
    // The great window under its deep round-headed arch; the oculus above.
    // The great pointed window (lancet head, tracery left out) in its deep
    // pointed surround; outer ring to about 29.5 m, glass to 27.5 m.
    pointedOn(trim, F[0], F[1], fc, 4.3, 14.6, 22.05, 0.05, 6)
    pointedOn(stone, F[0], F[1], fc, 4.0, 15.2, 21.5, 0.08, 6)
    pointedOn(win, F[0], F[1], fc, 3.7, 15.8, 21.1, 0.12, 6)
    discOn(trim, F[0], F[1], fc, 34.2, 1.0, 0.1, 10)
    discOn(win, F[0], F[1], fc, 34.2, 0.6, 0.14, 10)
    // Balcony band and the projecting porch with its three arches.
    const pf = TY + 1.6
    box(stone, gx0 + 0.3, TY, gx1 - 0.3, pf, 0, 12.3, trim, 0.25)
    box(trim, gx0 + 0.1, TY - 0.2, gx1 - 0.1, pf + 0.3, 12.3, 14.2, trim, 0.3)
    const P: [XY, XY] = [[gx1 - 0.3, pf], [gx0 + 0.3, pf]], pc = (gx1 - gx0 - 0.6) / 2
    archOn(door, P[0], P[1], pc, 1.9, 2.7, 8.5, 0.06, 10)
    archOn(win, P[0], P[1], pc - 3.9, 1.3, 2.7, 7.4, 0.06, 8)
    archOn(win, P[0], P[1], pc + 3.9, 1.3, 2.7, 7.4, 0.06, 8)
    archOn(trim, P[0], P[1], pc, 2.5, 8.5, 8.5, 0.03, 10)
    // The flight of steps up to the porch (the floor is about 2.7 m up).
    for (let k = 0; k < 3; k++) box(trim, gx0 - 0.4 + k * 0.6, pf, gx1 + 0.4 - k * 0.6, pf + 2.6 - k * 0.85, 0, 0.9 * (k + 1), trim, 0.1)
    // Side walls' tall windows (above the nave roof) on the transept flanks.
    pointedOn(win, [gx0, TY - 0.6], [gx0, NC], 6.5, 1.2, 21, 26.5, 0.07, 4)
    pointedOn(win, [gx1, NC], [gx1, TY - 0.6], TY - 0.6 - NC - 6.5, 1.2, 21, 26.5, 0.07, 4)
  }
  {
    // South transept with the rose window (garden side), and its low annex.
    const sx0 = 6.0, sx1 = 17.2, sy = -17.7
    const r = rect(sx0, sy, sx1, NC)
    walls(stone, r, 0, TW - 2)
    gableRoof(roof, null, sx0, sy, sx1, NC, TW - 2, TR - 2.5, false, 0.5, 0)
    gable(stone, [sx0, sy], [sx1, sy], TW - 2.5, TA - 2.5, 1.0, -0.4)
    coping([sx0, sy], [sx1, sy], TW - 1.7, TA - 2.5)
    gable(stone, [sx1, NC], [sx0, NC], TW - 2.3, TR - 2.5, 0.6, -0.6)
    turret(sx0 - 0.2, sy + 0.9, 1.1, TW - 1, TW + 2.2)
    turret(sx1 + 0.2, sy + 0.9, 1.1, TW - 1, TW + 2.2)
    const S: [XY, XY] = [[sx0, sy], [sx1, sy]], c = (sx1 - sx0) / 2
    discOn(trim, S[0], S[1], c, 21.5, 4.2, 0.05, 16)
    discOn(win, S[0], S[1], c, 21.5, 3.5, 0.1, 16)
    for (const d of [-2.4, 0, 2.4]) pointedOn(win, S[0], S[1], c + d, 0.75, 10.5, 15.5, 0.08, 3)
    box(stone, 10.4, -20.6, sx1, sy, 0, 7.5, roof, 0.3)
    pointedOn(win, [sx0, NC], [sx0, sy], NC - sy - 5, 1.1, 18, 23, 0.07, 4)
    pointedOn(win, [sx1, sy], [sx1, NC], 5, 1.1, 18, 23, 0.07, 4)
  }
  // The round stair turret and the buttressed bay beside the north front.
  {
    const c: XY = [0.3, 14.2], ring = ngon(c[0], c[1], 3.4, 8)
    walls(stone, ring, 0, 19.5)
    walls(trim, inset(ring, -0.25), 18.9, 19.7, inset(ring, -0.25))
    cap(roof, inset(ring, -0.25), 19.7)
    for (const k of [1, 2, 3]) {
      const a = ring[k], b = ring[(k + 1) % 8]
      pointedOn(win, a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 0.55, 13.5, 17, 0.07, 3)
      pointedOn(win, a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 0.45, 6, 9, 0.07, 3)
    }
  }

  // ------------------------------------------------------------- bell tower
  {
    // The detached octagonal tower (way/141281674), battered, with lancets
    // high up, a corbelled cornice and a low pyramid roof.
    const cx = -35.1, cy = -11.9
    const base = ngon(cx, cy, 4.3, 8), top = ngon(cx, cy, 3.5, 8)
    walls(stone, base, 0, 18.5, top)
    const lip = ngon(cx, cy, 3.95, 8)
    walls(trim, top, 18.5, 19.2, lip)
    walls(trim, lip, 19.2, 20)
    cap(trim, lip, 20)
    pyramid(roof, ngon(cx, cy, 4.05, 8), 20, [cx, cy, 22.8])
    for (let k = 0; k < 8; k++) {
      const a = top[k], b = top[(k + 1) % 8]
      // The face leans in; set the window on the upper part where it is nearly at `top`.
      pointedOn(win, a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 0.55, 14.2, 17.4, 0.12, 3)
    }
    for (let k = 0; k < 8; k++) {
      const a = top[k]
      lathe(trim, a[0], a[1], [[0.28, 19.8], [0.28, 20.6], [0, 22.0]], 4)
    }
  }

  return [
    { part: stone, material: { ...finish('cpt-cathedral-sandstone', 0xb3a58e), floodlight: flood } },
    { part: trim, material: { ...finish('cpt-cathedral-dressing', 0xc7baa3), floodlight: flood } },
    { part: roof, material: PALETTE.terracotta },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('cpt-st-georges-cathedral', "St George's Cathedral", [-33.9248907, 18.4194365], 41, build() as any, 6500)
