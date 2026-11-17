/**
 * Dallas Hall, Southern Methodist University — procedural, CC0-1.0, no
 * textures.
 * bun generators/dal-smu-dallas-hall.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/179096189 (lng -96.7849011, lat 32.8452576). The
 * outline's long walls run 1.6° clockwise from east, so the model is placed
 * at bearing 1.6 and built square. The portico faces south, down the main
 * quad (Bishop Boulevard).
 *
 * What it is: SMU's first building (Shepley, Rutan & Coolidge, 1912–15),
 * Georgian Revival after Jefferson's Rotunda and the Pantheon. A long
 * three-storey red-brick block over a pale raised basement, its wings under
 * hipped slate roofs, each wing ending in a semicircular colonnade of giant
 * columns. In the middle a square pavilion with a pale stone entablature and
 * corner balustrades carries a hexastyle Corinthian portico on a broad stair,
 * a chamfered brick attic, a round brick drum and a shallow verdigris copper
 * dome with a small crown. Portico and dome are the identity.
 *
 * Covers and replaces: the outline way/179096189 (OSM has no parts).
 *
 * Evidence
 * - OSM way/179096189 (measured): outline 82.5 m east–west including the
 *   two semicircular end colonnades (radius 6.0 m about x = ±35.3), the
 *   wings 18.4 m deep, the central pavilion ±11.5 m, the portico 17.5 m
 *   wide reaching y = -16.4, the north projection ±9.1 m to y = 19.
 * - USGS 3DEP lidar, TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m grid,
 *   read in the model frame (heights above the ground at the walls, which is
 *   2.2 m over the box's lowest return): wing eaves 15.0 and ridge 18.0 with
 *   the ridge running out to x = ±34 (steep hipped ends); pediment eaves
 *   16.6 and apex 19.7; pavilion corner balustrades 17.9; the chamfered attic
 *   20.6 (flat faces ±11, ±7 m wide at their edges); the drum 22.3 at radius
 *   ~10; the dome surface 24.5 at r = 8, 25.9 at r = 6, 27.4 at r = 3, which
 *   fits a sphere of radius 11 m: a cap rising 5.4 m off a 9.4 m base
 *   radius, the photographed profile (drum 20 m across, dome rim 18.5 m,
 *   in the Highsmith photo; NAIP shows about 21 m over the coping); the crown 28.8. The end colonnades 12.6
 *   (balustrade) and 11.3 (roof inside it); the north projection a gable, eaves 15.0, ridge 18.0,
 *   flat to its north end. The lidar sits ~1 m north and ~1 m east of the
 *   OSM outline; the model is centred between them on y and on OSM in x.
 * - Photos (Wikimedia Commons), all from the south side:
 *   "Dallas Hall on the campus of Southern Methodist University, Dallas,
 *   Texas LCCN2015630915.jpg" (Carol M. Highsmith, public domain): square on
 *   from the quad; read at 3840 px against the pediment apex (19.7 m, lidar)
 *   and the foot of the stair: portico floor 2.95, column bases to capital
 *   tops 2.95–14.2, column bays 2.94 m, shafts 1.5 m across, entablature
 *   14.2–16.5, raking cornice 17.1 m wide; three window rows at 3.8–5.9,
 *   7.9–10.1 and 11.3–13.3 over a pale basement to 3.0; wing cornice 14.0–14.8;
 *   window bays 3.4 m; a giant colonnade with a balustrade on the west end.
 *   "Dallas Hall (Southern Methodist University) in May 2008.jpg"
 *   (Spencerjc1, CC BY-SA 3.0) and "Dallas Hall.jpg" (Spencerjc1, CC BY-SA
 *   3.0): the portico, attic, drum and dome in sun; colours.
 *   "Dallas Hall1.JPG" (public domain): from the south-west, the portico's
 *   return column and the antae behind it, the stair, the west wing.
 *   "Dallas Hall at SMU looking northeast.jpg" (Abrown4055, CC BY-SA 4.0):
 *   the same side, the stair's cheeks.
 *   "Dallas Hall (Southern Methodist University).JPG" (Jeffrey Beall, CC BY-SA
 *   3.0), "Dallas Hall Southern Methodist University.jpg" (Ed Uthman, CC BY
 *   3.0), "Southern Methodist University July 2016 108 (Dallas Hall).jpg"
 *   (Michael Barera, CC BY-SA 4.0): the whole south front.
 *   "SMU Dallas Hall.png" (Elred, CC0): the front at dusk.
 *   Colours from these, pulled to the palette: red-brown brick, cream
 *   limestone, blue-grey slate, light verdigris copper.
 * - USGS NAIP orthophoto (public domain): the plan; the dome's verdigris, the
 *   grey wing roofs, the pale portico roof and end colonnades. (NAIP sits
 *   ~5 m west of OSM and lidar here.)
 * - Published (Wikipedia "Dallas Hall"; SMU): completed 1915, Shepley, Rutan
 *   & Coolidge, modelled on the Pantheon and the UVA Rotunda; National
 *   Register 1978.
 * - Estimated: the north side (no photo): the projection's windows and its
 *   brick gable; the end colonnades' column count (7 per half-circle) and
 *   the loggia wall behind them; the attic's arched windows on the faces no
 *   photo shows.
 * - Simplified: Corinthian capitals as a flared bell under a square abacus;
 *   dentils, keystones and window heads as a pale frame round each window;
 *   balusters as a plain parapet; the dome's step rings and the crown's
 *   finials as one short drum.
 *
 * Night: the portico, the attic and the dome are floodlit; windows glow.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { arc, arcCap, arcPanel, arcWall, block, cbox, cylinder, gable, grow, hip, panel, qf, rect, tf, type Rect, type Side, type XY } from './dc-white-house'
import { lathe, pcap, saveModel } from './dc-nga-west'

// ---- Plan (OSM, lidar).
const WX = 11.5 // the pavilion's half-width; the wings start here
const WE = 35.3 // the wings' ends, the centres of the end colonnades
const WY = 9.4 // the wings' half-depth
const PY0 = -11.0, PY1 = 11.0 // the pavilion's front and back walls
const NX = 9.1, NY = 19.3 // the north projection
const AR = 6.0 // the end colonnades' radius
// ---- Heights (lidar, and the Highsmith photo scaled to the lidar).
const BASE = 3.0 // the pale raised basement
const WALL = 14.0, EAVE = 14.8, RIDGE = 18.0 // wings and north projection
const ENT0 = 14.2, ENT1 = 16.5 // portico and pavilion entablature
const BAL = 17.8 // the pavilion's corner balustrades
const APEX = 19.7 // the pediment
const ATTIC = 19.7, ATTIC_TOP = 20.3, ATTIC_HALF = 11.0, ATTIC_CHAMFER = 4.3
const DRUM_R = 10.0, DRUM_TOP = 22.0, COPING = 22.4
const DOME_R0 = 9.4, SPHERE = 11.0 // the dome: a cap of a sphere of radius 11
const CROWN_R = 1.7, CROWN0 = 27.6, CROWN1 = 28.8
// ---- Portico.
const FLOOR = 2.95
const COL_R = 0.8
const COL_X = [-7.35, -4.41, -1.47, 1.47, 4.41, 7.35]
const COL_Y = -15.6, RET_Y = -12.66
const PX = 8.6 // the portico's half-width at the entablature
const PF = -16.45 // the entablature's front face
const STAIR = 6, STAIR_RUN = 1.07

const ROWS: [number, number][] = [[3.9, 6.0], [7.7, 10.0], [11.3, 13.3]]
const BAYS = Array.from({ length: 7 }, (_, i) => WX + 3.4 * (i + 0.5))

/** A window with its pale frame and head: the frame sits on the wall, the glass on the frame. */
function window(trim: Part, win: Part, side: Side, at: number, c: number, z0: number, z1: number, w = 1.3) {
  panel(trim, side, at, c - w / 2 - 0.22, c + w / 2 + 0.22, z0 - 0.18, z1 + 0.5, 0.03)
  panel(win, side, at, c - w / 2, c + w / 2, z0, z1, 0.06)
}

/** A round column: plinth, tapering shaft, flared bell capital, abacus. */
function corinthian(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 12) {
  const pl = r * 1.25, cap = Math.min(1.3, (z1 - z0) * 0.11), ab = 0.35
  cbox(p, rect(cx - pl, cx + pl, cy - pl, cy + pl), z0, z0 + 0.4, { b: 0.08 })
  cylinder(p, cx, cy, r, z0 + 0.4, z1 - cap - ab, seg, r * 0.9)
  cylinder(p, cx, cy, r * 0.9, z1 - cap - ab, z1 - ab, seg, r * 1.25)
  const a = r * 1.3
  cbox(p, rect(cx - a, cx + a, cy - a, cy + a), z1 - ab, z1, { bottom: true, top: false })
}

/** A flat panel with a semicircular head on a wall facing `n` (unit, horizontal), centred on `c`. */
function archPanel(p: Part, c: V3, n: V3, w: number, z0: number, zs: number, seg = 6) {
  const t: V3 = [-n[1], n[0], 0], r = w / 2
  const P = (a: number, z: number): V3 => [c[0] + t[0] * a + n[0] * 0.05, c[1] + t[1] * a + n[1] * 0.05, z]
  qf(p, P(-r, z0), P(r, z0), P(r, zs), P(-r, zs), n)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    tf(p, P(0, zs), P(r * Math.cos(a0), zs + r * Math.sin(a0)), P(r * Math.cos(a1), zs + r * Math.sin(a1)), n)
  }
}

/** A chamfered square ring (an octagon with unequal sides), CCW from above. */
function octagon(h: number, c: number): XY[] {
  return [[-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c]]
}

function prismXY(p: Part, pts: XY[], z0: number, z1: number, top: Part | boolean, b = 0) {
  const ring = (q: XY[], z: number): V3[] => q.map(([x, y]) => [x, y, z] as V3)
  if (b > 0) {
    const inner = pts.map(([x, y]) => { const l = Math.hypot(x, y); return [x - (x / l) * b, y - (y / l) * b] as XY })
    p.loft([ring(pts, z0), ring(pts, z1 - b), ring(inner, z1)])
    if (top) (top === true ? p : top).cap(ring(inner, z1), true)
  } else {
    p.loft([ring(pts, z0), ring(pts, z1)])
    if (top) (top === true ? p : top).cap(ring(pts, z1), true)
  }
}

function build() {
  const brick = new Part(), stone = new Part(), roof = new Part(), dome = new Part(), win = new Part()

  // ---- Wings: pale basement, brick, stone cornice, a hipped slate roof with
  // steep ends, a sill course under the top row, three rows of framed windows.
  for (const s of [-1, 1]) {
    const r = s < 0 ? rect(-WE, -WX, -WY, WY) : rect(WX, WE, -WY, WY)
    cbox(stone, grow(r, 0.12), 0, BASE, { b: 0.1 })
    cbox(brick, r, BASE, WALL, { top: false })
    cbox(stone, grow(r, 0.1), 11.05, 11.3, { top: false, bottom: true })
    cbox(stone, grow(r, 0.4), WALL, EAVE, { b: 0.15, bottom: true, top: false })
    hip(roof, grow(r, 0.4), EAVE, RIDGE, 1.7, roof, WY + 0.35)
    for (const bx of BAYS) {
      const x = s * bx
      for (const [side, at] of [['s', -WY], ['n', WY]] as [Side, number][]) {
        for (const [z0, z1] of ROWS) window(stone, win, side, at, x, z0, z1)
        panel(win, side, at + (side === "s" ? -0.12 : 0.12), x - 0.6, x + 0.6, 0.9, 2.3, 0.05)
      }
    }
    // the end walls, either side of the colonnade
    for (const y of [-7.6, 7.6]) for (const [z0, z1] of ROWS) window(stone, win, s < 0 ? 'w' : 'e', s * WE, y, z0, z1)
  }

  // ---- The end colonnades: a semicircle of giant columns on the basement,
  // the loggia wall behind, an entablature ring and a balustrade.
  for (const s of [-1, 1]) {
    const cx = s * WE, a0 = s > 0 ? -90 : 90, a1 = s > 0 ? 90 : 270
    const half = (r: number): XY[] => arc(cx, 0, r, a0, a1, 10)
    prismXY(stone, half(AR + 0.12), 0, BASE, true)
    arcWall(brick, cx, 0, 3.9, a0, a1, 10, BASE, 11.0)
    for (let k = 0; k <= 6; k++) {
      const a = ((a0 + (k * 180) / 6) * Math.PI) / 180
      corinthian(stone, cx + 5.25 * Math.cos(a), 5.25 * Math.sin(a), 0.5, BASE, 11.0, 8)
    }
    // entablature ring, then the balustrade on its rim, the roof inside it
    arcWall(stone, cx, 0, AR, a0, a1, 10, 11.0, 12.6)
    arcCap(stone, cx, 0, AR - 0.4, AR, a0, a1, 10, 12.6)
    arcWall(stone, cx, 0, AR - 0.4, a0, a1, 10, 12.0, 12.6, false)
    arcCap(stone, cx, 0, 0, AR - 0.4, a0, a1, 10, 12.0)
    arcCap(stone, cx, 0, 3.9, AR, a0, a1, 10, 11.0, false)
    for (let k = 0; k < 6; k++) arcPanel(win, cx, 0, AR + 0.12, a0 + 15 + 30 * k, 0.9, 1.0, 2.1, 0.04)
    for (let k = 0; k < 3; k++) {
      const a = a0 + 30 + 60 * k
      arcPanel(win, cx, 0, 3.9, a, 1.2, 3.9, 6.0)
      arcPanel(win, cx, 0, 3.9, a, 1.2, 7.7, 10.0)
    }
  }

  // ---- The pavilion: basement, brick, stone corner pilasters, the stone
  // entablature carried round from the portico, and a parapet at the corners.
  const pav = rect(-WX, WX, PY0, PY1)
  cbox(stone, grow(pav, 0.12), 0, BASE, { b: 0.1 })
  cbox(brick, pav, BASE, ENT0, { top: false })
  cbox(stone, grow(pav, 0.12), ENT0, ENT1 - 0.6, { top: false })
  cbox(stone, grow(pav, 0.45), ENT1 - 0.6, ENT1, { b: 0.15, bottom: true, top: false })
  // parapet round the roof at the corners, outside the attic
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = sx * (WX + 0.3), y0 = sy * (PY1 + 0.3), d = 5.2
    const ra = rect(Math.min(x0, x0 - sx * d), Math.max(x0, x0 - sx * d), Math.min(y0, y0 - sy * 0.5), Math.max(y0, y0 - sy * 0.5))
    const rb = rect(Math.min(x0, x0 - sx * 0.5), Math.max(x0, x0 - sx * 0.5), Math.min(y0, y0 - sy * d), Math.max(y0, y0 - sy * d))
    cbox(stone, ra, ENT1, BAL, { b: 0.08 })
    cbox(stone, rb, ENT1, BAL, { b: 0.08 })
  }
  stone.cap([[-WX, PY0, ENT1], [WX, PY0, ENT1], [WX, PY1, ENT1], [-WX, PY1, ENT1]], true)
  // corner pilasters (quoins), on the front and the sides
  for (const sx of [-1, 1]) {
    block(stone, 's', PY0, sx * WX - (sx > 0 ? 1.0 : 0), sx * WX + (sx < 0 ? 1.0 : 0), BASE, ENT0, 0.1, false, false)
    block(stone, sx < 0 ? 'w' : 'e', sx * WX, PY0, PY0 + 1.0, BASE, ENT0, 0.1, false, false)
  }
  // The front under the portico: antae behind the return columns, the tall
  // door with its fanlight, and three rows of windows in the other bays.
  for (const sx of [-1, 1]) block(stone, 's', PY0, sx * 7.35 - 0.6, sx * 7.35 + 0.6, FLOOR, ENT0, 0.35, false, false)
  panel(win, 's', PY0, -1.0, 1.0, FLOOR, 9.4, 0.06)
  window(stone, win, 's', PY0, 0, 11.3, 13.3)
  for (const x of [-5.88, -2.94, 2.94, 5.88]) for (const [z0, z1] of ROWS) window(stone, win, 's', PY0, x, z0, z1, 1.2)
  // the pavilion's side faces, in front of and behind the wings
  for (const [side, at] of [['w', -WX], ['e', WX]] as [Side, number][]) {
    for (const [z0, z1] of ROWS) window(stone, win, side, at, PY0 + 0.8, z0, z1, 0.8)
  }

  // ---- The portico: platform and stair, six columns and two returns, the
  // entablature, and the pediment under a pale roof.
  cbox(stone, rect(-PX, PX, PF - 0.15, PY0), 0, FLOOR, { b: 0.06 })
  for (let k = 0; k < STAIR; k++) {
    const h = FLOOR - (k + 1) * (FLOOR / (STAIR + 1))
    cbox(stone, rect(-PX + 0.6, PX - 0.6, PF - 0.15 - (k + 1) * STAIR_RUN, PF - 0.15 - k * STAIR_RUN), 0, h, { top: true })
  }
  // the stair's cheek blocks
  for (const sx of [-1, 1]) cbox(stone, rect(sx < 0 ? -PX - 0.4 : PX - 0.6, sx < 0 ? -PX + 0.6 : PX + 0.4, PF - 0.15 - STAIR * STAIR_RUN, PF - 0.15), 0, 1.4, { b: 0.1 })
  for (const x of COL_X) corinthian(stone, x, COL_Y, COL_R, FLOOR, ENT0)
  for (const x of [COL_X[0], COL_X[5]]) corinthian(stone, x, RET_Y, COL_R, FLOOR, ENT0)
  cbox(stone, rect(-PX, PX, PF, PY0), ENT0, ENT1 - 0.6, { bottom: true, top: false })
  cbox(stone, rect(-PX - 0.3, PX + 0.3, PF - 0.3, PY0), ENT1 - 0.6, ENT1, { b: 0.15, bottom: true, top: false })
  gable(stone, stone, rect(-PX - 0.3, PX + 0.3, PF - 0.3, PY0 + 1.0), ENT1, APEX, true, [true, false])

  // ---- The attic: a chamfered brick block on the pavilion roof, its stone
  // cornice, and an arched window on each face the pediment leaves open.
  const oct = octagon(ATTIC_HALF, ATTIC_CHAMFER)
  prismXY(brick, oct, ENT1, ATTIC, false)
  prismXY(stone, octagon(ATTIC_HALF + 0.3, ATTIC_CHAMFER + 0.12), ATTIC, ATTIC_TOP, true, 0.15)
  for (let i = 0; i < 8; i++) {
    const a = oct[i], b = oct[(i + 1) % 8]
    const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: V3 = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
    if (n[1] < -0.9) continue // behind the pediment
    archPanel(win, c, n, 1.3, BAL + 0.1, 19.0)
  }

  // ---- The drum and its coping, the dome, the crown.
  const SEG = 24
  lathe(brick, 0, 0, [[DRUM_R, ATTIC_TOP], [DRUM_R, DRUM_TOP]], SEG, false)
  lathe(stone, 0, 0, [[DRUM_R + 0.2, DRUM_TOP], [DRUM_R + 0.2, COPING - 0.1], [DRUM_R + 0.1, COPING], [DOME_R0, COPING]], SEG, false)
  const zc = COPING - Math.sqrt(SPHERE * SPHERE - DOME_R0 * DOME_R0)
  const prof: [number, number][] = []
  const t0 = Math.asin(DOME_R0 / SPHERE), t1 = Math.asin(CROWN_R / SPHERE)
  for (let k = 0; k <= 6; k++) {
    const t = t0 + ((t1 - t0) * k) / 6
    prof.push([SPHERE * Math.sin(t), zc + SPHERE * Math.cos(t)])
  }
  lathe(dome, 0, 0, prof, SEG, false)
  const zr = prof[prof.length - 1][1]
  lathe(roof, 0, 0, [[CROWN_R, zr - 0.1], [CROWN_R, CROWN1 - 0.35], [CROWN_R + 0.25, CROWN1 - 0.2], [CROWN_R + 0.25, CROWN1], [0, CROWN1]], 12, false)
  void CROWN0

  // ---- The north projection: basement, brick, cornice, a gabled roof with a
  // brick gable to the north, windows on three sides.
  const np = rect(-NX, NX, PY1 - 0.5, NY)
  cbox(stone, grow(np, 0.12), 0, BASE, { b: 0.1 })
  cbox(brick, np, BASE, WALL, { top: false })
  cbox(stone, grow(np, 0.1), 11.05, 11.3, { top: false, bottom: true })
  cbox(stone, grow(np, 0.4), WALL, EAVE, { b: 0.15, bottom: true, top: false })
  gable(roof, brick, rect(-NX - 0.4, NX + 0.4, PY1 - 0.5, NY + 0.4), EAVE, RIDGE, true, [false, true])
  for (const x of [-5.1, -1.7, 1.7, 5.1]) for (const [z0, z1] of ROWS) window(stone, win, 'n', NY, x, z0, z1)
  for (const [side, at] of [['w', -NX], ['e', NX]] as [Side, number][]) {
    for (const y of [13.6, 16.8]) for (const [z0, z1] of ROWS) window(stone, win, side, at, y, z0, z1)
  }

  return [
    { part: brick, material: { ...BRICK, floodlight: lit } },
    { part: stone, material: { ...STONE, floodlight: lit } },
    { part: roof, material: SLATE },
    { part: dome, material: { ...COPPER, floodlight: lit } },
    { part: win, material: PALETTE.window },
  ]
}

/**
 * Night: floodlights on the quad light the portico, the attic and the dome
 * from the south; the wings and the north side stay dim.
 */
const lit = (p: V3, n: V3): number => {
  if (p[2] > ENT1 - 0.1 && Math.hypot(p[0], p[1]) < 13) return n[2] > 0.8 ? 0.35 : 0.85
  if (p[1] < PY0 + 0.5 && Math.abs(p[0]) < PX + 0.6) return n[2] > 0.8 ? 0.3 : 0.95
  return 0
}

/** Red-brown brick, a cool red rather than orange, pulled to the palette's lightness. */
const BRICK = finish('smu-brick', 0x955f55)
/** Cream Indiana-type limestone: columns, entablature, basement, frames. */
const STONE = finish('smu-limestone', 0xece3d3)
/** Blue-grey slate. */
const SLATE = finish('smu-slate', 0x86919a)
/** The dome's light verdigris. */
const COPPER = finish('smu-verdigris', 0x8db5a6)

if (import.meta.main) {
  await saveModel('dal-smu-dallas-hall', 'Dallas Hall', build(), { source: 'generators/dal-smu-dallas-hall.ts' })
}
