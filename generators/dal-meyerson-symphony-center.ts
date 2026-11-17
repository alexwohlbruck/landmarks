/**
 * Morton H. Meyerson Symphony Center (2301 Flora Street, Dallas; I. M. Pei &
 * Partners, 1989) — original procedural geometry, CC0-1.0.
 * bun generators/dal-meyerson-symphony-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Anchor = centroid of the OSM outline way/28544900, 32.7899083,
 * -96.7986206. Bearing 18.6: the concert-hall box's short walls run at
 * 18.6° / 198.6° and its long walls at 108.6° (lidar), so the box is square
 * to this frame; the lobby wings follow the street grid of Flora Street
 * (46.9°, OSM), turned 28.3° against the box, which is Pei's rotation.
 *
 * Identity, in order: the tall plain cream limestone box of the hall; the
 * crescent of sloping glass (the conoid) wrapping its south side, a glazed
 * ground storey, an outward-leaning glass wall, a curved limestone band and
 * an arched glass lens rising against the box above it; the two more arched
 * glass lenses leaning on the box's north and east walls over the lobby;
 * the street-square limestone-framed glass lobby on the north and east; the
 * free-standing limestone portal frame in front of the Flora Street side.
 *
 * Evidence:
 *  - plan: box, from USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight,
 *    0.5 m grid): x -38.8..26.8, y -24.2..19.6 (65.6 x 43.8 m), walls sharp
 *    in the DSM. Lobby wings: the OSM outline on the north and east, the
 *    south-east wall set 5 m inside the outline where the lidar's 15 m roof
 *    ends (the outline there includes the colonnade and the portal). Conoid:
 *    a circle fitted to the OSM outline's curved south edge (centre
 *    (5.6, -7.2), radius 28.4), meeting the box's south wall at x -17.2 and
 *    28.3. Portal: the thin 16 m line in the lidar along the south-east
 *    outline, 37 m long, checked against NAIP.
 *  - heights (lidar DSM minus the local ground, 141.1 m): box 30.4 m
 *    (measured); lobby roofs 15.6 (measured, 15-16); arched lenses meet the
 *    box at 21.6-22.8 at their crowns (measured, south and east; north
 *    estimated the same); conoid outer edge 13.5-16 (measured 11-16 at the
 *    rim); portal 16.5 (measured); west service wall 5.5 (measured ~5).
 *  - proportions of the conoid's layers (glazed ground storey to ~5.2 m,
 *    stone band, outward-leaning glass to ~13.5 m, stone band to 16 m) and
 *    the lobby bays from Praefcke's photos 03 and 02 and Highsmith's
 *    LCCN2015630763; the north lens's span (x -12..25) from Praefcke's
 *    "Dallas Meyerson 2008" (seen from the north-west).
 *  - colour: the limestone reads warm cream-grey in every daylight photo,
 *    kept a touch warmer and darker than `stone` (#e4d6c1); the conoid glass
 *    pale grey-green and reflective (window-2 #b4c8cc); the lenses `glass`.
 *  - night: the lobby and the conoid are lit from inside at dusk (Highsmith
 *    LCCN2015630763 / 630572), so lobby glass is `window` and the conoid
 *    wall `window-2`; the arched lenses are skylights and stay `glass`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Dallas_Meyerson_Center_01..05.jpg, _back.jpg, Dallas_Meyerson_2008.jpg,
 *    Winspear_Opera_House_11_view_Meyerson.jpg — Andreas Praefcke, CC BY 3.0
 *  - Dallas_Meyerson_01.jpg — Joe Mabel, CC BY-SA 3.0
 *  - Dallas_Meyerson_Symphony_Center.jpg — William Addington, CC BY 2.0
 *  - Morton_H_Meyerson_Symphony_Center.jpg — Drumguy8800, CC BY-SA 3.0
 *  - The_Morton_H._Myerson_Symphony_Center..._LCCN2015630763.tif, 630572,
 *    630573, 630824, 631027 — Carol M. Highsmith, public domain
 * Aerial: USGS NAIP (public domain). No look-only sources. No commercial
 * imagery or 3D tiles.
 *
 * Doubts: the north lens is drawn like the south and east ones from one
 * distant photo and a weak lidar rise; the west service wall is seen only
 * in Praefcke's "back" photo; the box's top is drawn flat (lidar 30-31 m
 * everywhere). Left out: the tall limestone pylon south-east of the conoid
 * (no clear lidar return), the steel-and-glass mullion grid of the conoid,
 * lettering, the cafe terrace steps, the Kelly sculpture.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, panel, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7899083, -96.7986206]
const BEARING = 18.6

/** The hall box. */
const BX0 = -38.8, BX1 = 26.8, BY0 = -24.2, BY1 = 19.6, BOX = 30.4
/** Lobby roof. */
const LOBBY = 15.6
/** The conoid: centre and outer radius of the curved south wall. */
const CC: XY = [5.6, -7.2], CR = 28.4

/** Bevelled vertical prism: walls, a chamfered top lip and a cap. */
function prism(wall: Part, top: Part, r: XY[], z0: number, z1: number, bevel = 0.45) {
  const ins = inset(r, bevel)
  walls(wall, r, z0, z1 - bevel)
  walls(wall, r, z1 - bevel, z1, ins)
  cap(top, ins, z1)
}

/** Point on the conoid circle at angle a (radians, from +x), radius r, height z. */
const onArc = (a: number, r: number, z: number): V3 => [CC[0] + r * Math.cos(a), CC[1] + r * Math.sin(a), z]

function build() {
  const lime = new Part(), roof = new Part(), win = new Part(), cone = new Part(), glass = new Part(), trim = new Part()

  // --- The hall box: plain limestone, a slim bevel at the top.
  const box: XY[] = [[BX0, BY0], [BX1, BY0], [BX1, BY1], [BX0, BY1]]
  prism(lime, roof, box, 0, BOX, 0.5)
  // A pale coping line a storey under the top, as the stone coursing reads.
  for (let i = 0; i < 4; i++) {
    const a = box[i], b = box[(i + 1) % 4]
    panel(trim, a, b, 0, Math.hypot(b[0] - a[0], b[1] - a[1]), BOX - 1.6, BOX - 1.3, 0.04)
  }

  // --- West service wall under the back of the box (Praefcke "back").
  prism(lime, roof, [[-44.5, -19], [BX0, -19], [BX0, 15], [-44.5, 15]], 0, 5.5, 0.3)

  // --- Lobby wings on the north and east, square to the street grid,
  // wrapping the box's north-east corner.
  const L: XY[] = [
    [BX1, BY0], [37.5, BY0], [58.6, 14.8], [38.6, 26.3], [30.4, 28.7], [23.1, 29.2], [11.6, 35.3],
    [9.0, 30.4], [-4.0, 37.4], [-1.6, 41.8], [-18.3, 50.7], [-35.0, BY1], [BX1, BY1],
  ]
  const n = L.length
  for (let i = 0; i < n; i++) {
    const a = L[i], b = L[(i + 1) % n]
    // Edges along the box are hidden inside it.
    if ((a[0] === BX1 && b[0] === BX1) || (a[1] === BY1 && b[1] === BY1)) continue
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    lime.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], LOBBY], [a[0], a[1], LOBBY])
    if (len < 3) continue
    // Ground storey: glass between limestone piers ~6 m apart; a stone
    // spandrel band; then the two-storey glass wall in broad bays under a
    // stone top band (Praefcke 02, Mabel).
    const bays = Math.max(1, Math.round((len - 1.2) / 6))
    const p = (len - 1.2) / bays
    for (let k = 0; k < bays; k++) {
      const s0 = 0.6 + k * p + 0.5, s1 = 0.6 + (k + 1) * p - 0.5
      panel(win, a, b, s0, s1, 0.3, 5.0, 0.05)
    }
    const up = Math.max(1, Math.round((len - 1.2) / 4.5))
    const q = (len - 1.2) / up
    for (let k = 0; k < up; k++) {
      const s0 = 0.6 + k * q + 0.18, s1 = 0.6 + (k + 1) * q - 0.18
      panel(cone, a, b, s0, s1, 6.6, 13.9, 0.05)
    }
  }
  cap(roof, L, LOBBY)
  // Parapet lip around the lobby roof edge.
  for (let i = 0; i < n; i++) {
    const a = L[i], b = L[(i + 1) % n]
    if ((a[0] === BX1 && b[0] === BX1) || (a[1] === BY1 && b[1] === BY1)) continue
    panel(trim, a, b, 0, Math.hypot(b[0] - a[0], b[1] - a[1]), LOBBY - 0.5, LOBBY, 0.06)
  }

  // --- The conoid crescent on the south side. Along each radial line from
  // the rim (r = CR) in to the box's south wall: a glazed ground storey at
  // the rim under a stone band; the conoid, glass sloping inward and up to a
  // curved limestone band about halfway in; then the arched upper lens
  // rising to the box wall (lidar: 9-12 m at the rim, 15-18 midway, 20-22
  // at the wall; Highsmith LCCN2015630763 for the layers).
  const span = (x: number, x0: number, x1: number, rise: number, z0: number) => {
    const t = (2 * (x - x0)) / (x1 - x0) - 1
    return z0 + rise * Math.max(0, 1 - t * t)
  }
  const half = Math.sqrt(CR * CR - (CC[1] - BY0) ** 2)
  const ex0 = CC[0] - half, ex1 = CC[0] + half
  const aHalf = Math.asin((CC[1] - BY0) / CR)
  const a0 = Math.PI + aHalf, a1 = 2 * Math.PI - aHalf // west end, round the south, to the east end
  const SEG = 20
  /** Radial line i: rim point, and where it meets the box wall. */
  const radial = (i: number) => {
    const t = a0 + ((a1 - a0) * i) / SEG, c = Math.cos(t), s = Math.sin(t)
    const rim: XY = [CC[0] + CR * c, CC[1] + CR * s]
    const k = (BY0 - CC[1]) / s // radius where the line crosses y = BY0
    const wall: XY = [CC[0] + k * c, BY0]
    return { rim, wall, c, s }
  }
  const at2 = (r: ReturnType<typeof radial>, f: number, z: number, out = 0): V3 =>
    [r.rim[0] + (r.wall[0] - r.rim[0]) * f + r.c * out, r.rim[1] + (r.wall[1] - r.rim[1]) * f + r.s * out, z]
  const F_BAND = 0.46, F_LENS = 0.53, Z_BAND0 = 15.2, Z_BAND1 = 16.8
  for (let i = 0; i < SEG; i++) {
    const r0 = radial(i), r1 = radial(i + 1)
    const q = (p: Part, f0: number, z0: number, f1: number, z1: number, o0 = 0, o1 = 0) =>
      p.quad(at2(r0, f0, z0, o0), at2(r1, f0, z0, o0), at2(r1, f1, z1, o1), at2(r0, f1, z1, o1))
    q(win, 0.0, 0, 0.0, 5.0, -0.8, -0.8) // ground storey glass, set back under the band
    q(lime, 0.0, 5.0, 0.0, 5.0, -0.8, 0) // band soffit
    q(lime, 0.0, 5.0, 0.0, 6.8) // stone band
    q(cone, 0.0, 6.8, F_BAND, Z_BAND0) // conoid glass
    q(lime, F_BAND, Z_BAND0, F_BAND, Z_BAND1) // curved limestone band
    q(lime, F_BAND, Z_BAND1, F_LENS, Z_BAND1) // its top
    // upper lens, to an arch on the box wall
    const w0 = at2(r0, 1, 0), w1 = at2(r1, 1, 0)
    const top0: V3 = [w0[0], BY0, span(w0[0], ex0, ex1, 6.0, Z_BAND1)], top1: V3 = [w1[0], BY0, span(w1[0], ex0, ex1, 6.0, Z_BAND1)]
    glass.quad(at2(r0, F_LENS, Z_BAND1), at2(r1, F_LENS, Z_BAND1), top1, top0)
    // pale mullion ribs on the conoid and the lens, every other radial line
    if (i % 3 === 1) {
      const m = (f0: number, z0: number, f1: number, z1: number, w = 0.22) => {
        const A = at2(r0, f0, z0, 0.06), B = at2(r0, f1, z1, 0.06), d: V3 = [-r0.s * w, r0.c * w, 0]
        trim.quad([A[0] - d[0], A[1] - d[1], A[2]], [A[0] + d[0], A[1] + d[1], A[2]], [B[0] + d[0], B[1] + d[1], B[2]], [B[0] - d[0], B[1] - d[1], B[2]])
      }
      m(0, 6.8, F_BAND, Z_BAND0)
      const tz = span(at2(r0, 1, 0)[0], ex0, ex1, 6.0, Z_BAND1)
      m(F_LENS, Z_BAND1 + 0.05, 1, tz + 0.05)
    }
  }

  // --- Arched lenses leaning on the box's east and north walls.
  const lens = (along: 'x' | 'y', face: number, s0: number, s1: number, rise: number) => {
    const N = 12
    const pts = Array.from({ length: N + 1 }, (_, i) => {
      const s = s0 + ((s1 - s0) * i) / N
      const z = span(s, s0, s1, rise, LOBBY)
      const d = 0.75 * (z - LOBBY)
      const top: V3 = along === 'y' ? [face, s, z] : [s, face, z]
      const foot: V3 = along === 'y' ? [face + d, s, LOBBY] : [s, face + d, LOBBY]
      return { top, foot }
    })
    for (let i = 0; i < N; i++) {
      if (along === 'y') glass.quad(pts[i].foot, pts[i + 1].foot, pts[i + 1].top, pts[i].top)
      else glass.quad(pts[i + 1].foot, pts[i].foot, pts[i].top, pts[i + 1].top)
      if (i % 3 === 1 && i < N - 1) {
        const { top, foot } = pts[i + 1], w = 0.22
        const off = (p: V3, k: number): V3 => along === 'y' ? [p[0] + 0.06, p[1] + k * w, p[2] + 0.06] : [p[0] + k * w, p[1] + 0.06, p[2] + 0.06]
        if (along === 'y') trim.quad(off(foot, -1), off(foot, 1), off(top, 1), off(top, -1))
        else trim.quad(off(foot, 1), off(foot, -1), off(top, -1), off(top, 1))
      }
    }
  }
  lens('y', BX1, -20.5, 15.5, 7.2) // east wall, over the entrance lobby (Praefcke 01)
  lens('x', BY1, -12, 25, 6.0) // north wall (Praefcke 2008, Winspear 11)

  // --- The free-standing portal frame along Flora Street.
  const u: XY = [-0.4746, -0.8802], nn: XY = [-0.8802, 0.4746]
  const base: XY = [61.5 + nn[0] * 1.2, 9.6 + nn[1] * 1.2]
  const at = (s: number, o: number): XY => [base[0] + u[0] * s + nn[0] * o, base[1] + u[1] * s + nn[1] * o]
  const S0 = 21, S1 = 58, T = 0.9, LEG = 5.8 // half thickness; leg width (Praefcke 02, Highsmith 630763)
  const quadXY = (s0: number, s1: number): XY[] => [at(s0, T), at(s0, -T), at(s1, -T), at(s1, T)]
  const ccw = (r: XY[]) => {
    const a = r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
    return a < 0 ? [...r].reverse() : r
  }
  prism(lime, lime, ccw(quadXY(S0, S0 + LEG)), 0, 13.7, 0.01)
  prism(lime, lime, ccw(quadXY(S1 - LEG, S1)), 0, 13.7, 0.01)
  prism(lime, lime, ccw(quadXY(S0, S1)), 13.7, 16.5, 0.3)
  // underside of the beam between the legs
  cap(lime, ccw(quadXY(S0 + LEG, S1 - LEG)), 13.7, false)

  return [
    { part: lime, material: finish('meyerson-limestone', 0xe4d6c1) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: cone, material: windowVariant(2, 0xaec3cf) },
    { part: glass, material: PALETTE.glass },
    { part: trim, material: PALETTE.trim },
  ]
}

if (import.meta.main) await save('dal-meyerson-symphony-center', 'Morton H. Meyerson Symphony Center', ANCHOR, BEARING, build(), 5000)
