/**
 * John F. Kennedy Presidential Library and Museum, Columbia Point, Boston
 * (1979, I. M. Pei; the Stephen E. Smith Center wing 1991): the white
 * precast concrete tower, truncated-triangle in plan, the dark glass
 * pavilion against it, and the low white blocks and drums round them —
 * original procedural geometry, CC0-1.0.
 * bun generators/bos-jfk-library.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 0: the tower's long west face runs north–south.
 * Anchor -71.0342, 42.3162, the middle of the complex (the outline
 * way/217512570 and the west wing way/217512167 together); the harbour is
 * to the north and east, the entrance plaza to the south.
 *
 * Identity (from the photos below):
 *  1. The tall white tower: a triangle in plan, its 44 m west face square
 *     to the compass, its two other faces converging on an apex buried in
 *     the pavilion; blank precast concrete with a flat top behind a
 *     parapet, its sharp south-west corner a blade from the plaza.
 *  2. The pavilion: a near-cube of dark glass in a black space frame, about
 *     as tall as the tower, its top edges chamfered all round.
 *  3. Low white blocks round the base: the long entrance block across the
 *     front of tower and pavilion with the glazed entrance at plaza level,
 *     the round-ended block with a taller drum to the south-east, the
 *     D-shaped theatre block and the long west wing (the Smith Center) with
 *     its north terrace.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m
 * grid, read with tools/lidar_frame.py at bearing 0; z = 0 is the lawn on
 * the harbour side (4.8 m above the grid's ground_min). Measured: the
 * entrance plaza on the south 5.8; the tower's parapet 38.3 and its roof
 * 34.9; the pavilion's top 35.2; the entrance block 14.1; the south-east
 * round-ended block 10.5 and its drum 14.2; the theatre block 14.9; the
 * west wing and middle 10.7; the north terrace 5.9. Plans are from the OSM
 * outlines and lidar together (the tower: the lidar's 38 m rim, a
 * triangle (13.5, 30.5), (15.5, -13.5), (34, 9) whose apex stands 3 m
 * above the pavilion's roof inside it; OSM's way/830076701 cuts it off at
 * the pavilion; the
 * pavilion: lidar x 26–47.5, y -2.5–21.5; the south-east end: OSM's arc,
 * a circle of radius 15.9 at (50.5, -22.1); the theatre block's round west
 * side: radius 16.5 at (-8.5, 5.5), from lidar).
 *
 * Estimated from the photos: the pavilion's chamfer (2.6 m); the space
 * frame's module (drawn 4.4 m, a coarser grid than the real one so it reads
 * without shimmer); the entrance glazing (5.8–9.3, x 21–45); the parapet's
 * width (2 m).
 *
 * Ground: the site steps up from the harbour lawn (z 0) to the entrance
 * plaza (5.8) on the south; Mapterhorn shows the same rise. Every block
 * runs down to z = 0 and sinks into the plaza side. Elevation 0.
 *
 * Night: the tower is floodlit white (Fcb981's dusk photo), the entrance
 * glass glows; the pavilion's glass stays dark (`glass`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - John F Kennedy Presidential Library June 2017.jpg, Larry D. Moore,
 *    CC BY 4.0 (the entrance front from the south)
 *    https://commons.wikimedia.org/wiki/File:John_F_Kennedy_Presidential_Library_June_2017.jpg
 *  - JFK library Stitch Crop.jpg, Fcb981, CC BY-SA 3.0 (from the south-west
 *    at dusk)
 *    https://commons.wikimedia.org/wiki/File:JFK_library_Stitch_Crop.jpg
 *  - John F. Kennedy Presidential Library and Museum (NARA).jpg, U.S.
 *    National Archives, public domain (the front)
 *    https://commons.wikimedia.org/wiki/File:John_F._Kennedy_Presidential_Library_and_Museum_(NARA).jpg
 *  - JFK-Library-Museum-01.jpg, Sintakso, CC BY-SA 4.0 (the pavilion's
 *    harbour side and the white blocks west of it)
 *    https://commons.wikimedia.org/wiki/File:JFK-Library-Museum-01.jpg
 * No commercial imagery. Published: architect and dates from Wikipedia
 * (John F. Kennedy Presidential Library and Museum).
 *
 * Doubts: the west wing and the north side are seen in one photo only and
 * drawn plain; the tower's few slot windows
 * and the lettering over the entrance are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { onWall, rectShape } from './atl-tech-tower'
import { at, capPoly, ccw, offset, prism, save, smoothWall, type XY, circle } from './atl-flatiron-building'

const conc = new Part(), glass = new Part(), frame = new Part(), win = new Part(), roof = new Part()

const PLAZA = 5.8

const arc = (c: XY, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })

/** A white block with a flat roof and a small bevel. */
const block = (ring: XY[], h: number) => prism(conc, ccw(ring), 0, h, roof, 0.35)

// ── low blocks ──
// the west wing (the Smith Center) and the middle, one roof level
block([[-65.6, 12.9], [-29.0, -18.1], [13.5, -16.5], [13.5, 22], [-31, 22], [-35.1, 29.6], [-44.6, 37.7]], 10.7)
// the north terrace
block([[-35.1, 29.6], [-31, 22], [13.5, 22], [12.2, 31], [8.55, 33.8]], 5.9)
// the D-shaped theatre block
block([...arc([-8.5, 5.5], 16.5, 90, 222, 10), [2, -6], [2, 22]], 14.9)
// the entrance block across the front
block([[15.5, -14.5], [58, -14.5], [60, -6], [52, -1], [15.5, -1]], 14.1)
// the south-east round-ended block and its drum
{
  const c: XY = [50.5, -22.1]
  block([...arc(c, 15.9, 180, 360, 12), [66.4, -14], [34.6, -14]], 10.5)
  const d: XY = [49, -20.5]
  smoothWall(conc, circle(d, 6, 16), 0, 13.8)
  conc.loft([at(circle(d, 6, 16), 13.8), at(circle(d, 5.6, 16), 14.2)])
  capPoly(roof, circle(d, 5.6, 16), 14.2, true)
}
// the entrance: a glazed band at plaza level on the front, doors in the middle
{
  const a: XY = [15.5, -14.5], b: XY = [58, -14.5] // south face, outside to the right (south)
  onWall(win, a, b, rectShape(5.5, 29.5, PLAZA, PLAZA + 3.5), 0.05)
  onWall(conc, a, b, rectShape(5.5, 29.5, PLAZA + 3.5, PLAZA + 3.8), 0.07)
  for (let s = 8.5; s < 29.5; s += 3) onWall(frame, a, b, rectShape(s - 0.1, s + 0.1, PLAZA, PLAZA + 3.5), 0.08)
}

// ── the tower ──
const TOWER: XY[] = ccw([[13.5, 30.5], [15.5, -13.5], [34, 9]])
{
  const H = 38.3, R = 34.9
  // walls to the parapet, then a roof well inside a 2 m parapet
  const inner = offset(TOWER, -2)
  conc.loft([at(TOWER, 0), at(TOWER, H - 0.35)])
  conc.loft([at(TOWER, H - 0.35), at(offset(TOWER, -0.35), H)])
  const o = offset(TOWER, -0.35), n = o.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    conc.quad([inner[i][0], inner[i][1], H], [o[i][0], o[i][1], H], [o[j][0], o[j][1], H], [inner[j][0], inner[j][1], H])
  }
  conc.loft([at([...inner].reverse(), R), at([...inner].reverse(), H)])
  capPoly(roof, inner, R, true)
}

// ── the glass pavilion ──
{
  const X0 = 26, X1 = 47.5, Y0 = -2.5, Y1 = 21.5, ZW = 32.6, ZT = 35.2, C = 2.6
  const K = 2.4 // the chamfered east corners (OSM)
  const base: XY[] = [[X0, Y0], [X1 - K, Y0], [X1, Y0 + K], [X1, Y1 - K], [X1 - K, Y1], [X0, Y1]]
  const top: XY[] = [[X0 + C, Y0 + C], [X1 - C - K * 0.6, Y0 + C], [X1 - C, Y0 + C + K * 0.6], [X1 - C, Y1 - C - K * 0.6], [X1 - C - K * 0.6, Y1 - C], [X0 + C, Y1 - C]]
  glass.loft([at(base, 0), at(base, ZW), at(top, ZT)])
  capPoly(glass, top, ZT, true)
  // the space frame: a coarse grid of dark members on the three open faces
  const M = 4.4
  const faces: Array<[XY, XY]> = [[[X0, Y0], [X1 - K, Y0]], [[X1, Y0 + K], [X1, Y1 - K]], [[X1 - K, Y1], [X0, Y1]]]
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nb = Math.round(L / M)
    for (let k = 1; k < nb; k++) onWall(frame, a, b, rectShape((k * L) / nb - 0.14, (k * L) / nb + 0.14, 0, ZW), 0.06)
    for (let z = 14.1 + M; z < ZW - 1; z += M) onWall(frame, a, b, rectShape(0.15, L - 0.15, z - 0.14, z + 0.14), 0.06)
    onWall(frame, a, b, rectShape(0, L, ZW - 0.25, ZW + 0.05), 0.07)
  }
  // the corner members and the chamfer's ridge lines
  for (const [x, y] of base) {
    const t = 0.3
    frame.loft([at([[x - t, y - t], [x + t, y - t], [x + t, y + t], [x - t, y + t]], 0), at([[x - t, y - t], [x + t, y - t], [x + t, y + t], [x - t, y + t]], ZW)])
  }
}

// ── night: the tower and the white blocks floodlit ──
const lit = (p: V3, n: V3) => {
  if (n[2] > 0.7) return 0.1
  if (p[2] > 15 && p[0] < 27) return 0.9
  return 0.4
}
await save('bos-jfk-library', 'John F. Kennedy Presidential Library and Museum', [
  { part: conc, material: { ...finish('jfk-concrete', 0xeeebe3), floodlight: lit } },
  { part: glass, material: { ...PALETTE.glass, color: 0x4f5a66 } },
  { part: frame, material: finish('jfk-frame', 0x4a4f57, 0.5) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { height: 38.3, anchor: [42.3162, -71.0342], bearing: 0 }, 5000)
