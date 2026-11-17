/**
 * Torre de Rectoría, UNAM (1950–52, Mario Pani, Enrique del Moral and
 * Salvador Ortega Flores; murals by David Alfaro Siqueiros, 1952–56),
 * Ciudad Universitaria, Mexico City — original procedural geometry,
 * CC0-1.0, no textures.
 *   bun generators/mexico-city-unam-rectoria.ts
 *
 * Map frame: x east, y north, z up, metres; square to the building, whose
 * walls run at 84° / 174°, so the bearing is 354. Anchor = centroid of the
 * tower outline way/73147253 (19.332399, -99.188074).
 *
 * Identity: the slab tower of dark glass banded by long horizontal window
 * ribbons and thin floor fins, under a deep dark-red roof slab; the
 * windowless red wall on its west side (the UNAM shield high on it) and
 * the ochre brick shaft at its north-west corner, both rising past the
 * roof; Siqueiros' relief box "Nuevo símbolo universitario" cantilevered
 * from the east face; the low wing round the tower's foot with Siqueiros'
 * reliefs: "Las fechas en la historia de México" along the top of its north
 * face and "El pueblo a la universidad, la universidad al pueblo" across
 * its south end; red roofs.
 *
 * Evidence
 * - OSM: tower outline way/73147253 (17 levels); glass block
 *   way/1173156544 (17 levels); red wall way/1173156545 (19 levels,
 *   firebrick, windowless); ochre shaft way/1173156546 (18 levels, wheat);
 *   way/1173156548 (a 0.7 m sliver beside the shaft, 16 levels); the relief
 *   box way/1341387913 (levels 5–7, goldenrod, east face); the low wing
 *   way/260241576 (roof indianred).
 * - Published: 59 m tall (Sociedad Matemática Mexicana, "Date un rol"
 *   2017 poster; Chilango): the red wall is drawn to 59.5 m, the ochre
 *   shaft 58 m, the glass block's roof slab 57.1 m. Murals and faces
 *   (UNAM Global, Gaceta UNAM, Excélsior 2024): south "Del pueblo a la
 *   Universidad, la Universidad al pueblo"; north "Las fechas en la historia
 *   de México / El derecho a la cultura"; east "Nuevo símbolo universitario"
 *   (1953); west the university's shield. The brief's "relief on the
 *   south face of the tower" is the east-face box; the south relief is on
 *   the low wing's south end (both drawn).
 * - Estimated (photos): lobby 3.5 m, 16 floors of 3.3 m; the relief box
 *   10 m tall from 16 m, 11 m wide, 3 m deep, placed at the south-east
 *   corner as Daniel Case's photo shows (OSM has it centred 5 m further
 *   north and 1.5 m deep); the low wing 9.5 m (ground floor 3.2 m, glazed
 *   floor, frieze level), scaled on Case's photo against the tower's
 *   59 m (review round 1: it was 12.4 m). Plan checked against OSM: glass
 *   block 19.4 × 20.1 m, tower outline 25.5 × 21.4 m; in Case's photo
 *   the east face is ~20 m and the tower ~61 m to the top, so the plan and
 *   height stand.
 * - Terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s); the
 *   esplanade is near flat. Not checked.
 * - Photos (Wikimedia Commons; EVIDENCE):
 *   r00 Daniel Case, "UNAM administration building, Ciudad
 *     Universitaria.jpg", CC BY-SA 3.0, 2015 (east and north faces, the
 *     relief box, the ochre shaft, the north frieze);
 *   r01/r02/r03 ProtoplasmaKid, "Conjunto de la Torre de Rectoría de la
 *     UNAM 1, 4, 6.jpg", CC BY-SA 4.0, 2022 (the low wing and its frieze);
 *   r04 ProtoplasmaKid, "Ciudad Universitaria UNAM - Torre de Rectoría -
 *     1.jpg", CC BY-SA 3.0, 2011 (the relief box from below);
 *   r05/r06 ProtoplasmaKid, "Ciudad Universitaria con dron 2025 - 1, 3.jpg",
 *     CC BY-SA 4.0, 2025 (the frieze; the shield on the red wall);
 *   r07 Régis Lachaume, "CU-Mexico-rectoria-2.jpg", public domain, 2006;
 *   r08 Luisalvaz, "Torre de rectoría de la UNAM con murales de Siqueiros
 *     01.jpg", CC BY-SA 4.0, 2025 (the south relief under restoration);
 *   r09 Androide rockero, "Torre de Rectoría y Biblioteca Central UNAM al
 *     fondo.jpg", CC0, 2025 (the red wall and the shield).
 * - Look-only: none.
 * Colours: red wall and roofs #a65a4c (photo ~#9c3b2e pulled light), ochre
 *   brick and relief gold #cfa55e, dark glass `window` with lighter ribbons
 *   `window-2`, pale fins and relief highlights `trim`, the wing's stone.
 * Night: the glazing glows (`window`, `window-2`).
 * Doubts: the faces. OSM's parts, Daniel Case's photo and the published
 *   mural list agree on east (relief box) and west (red wall, shield), but
 *   Androide rockero's view of the red wall seems to put the ochre shaft
 *   on its south side; OSM was followed. Floor count and heights estimated;
 *   the reliefs are drawn as a few flat and projecting colour masses.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, chamfer, save, walls, type XY } from './chi-aon-center'
import { quad } from './dc-nationals-park'

export const ANCHOR: [number, number] = [-99.188074, 19.332399]
export const BEARING = 354

const ccw = (r: XY[]) => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) < 0 ? [...r].reverse() : r)
/** A block over a plan ring: walls and a top. */
function prismP(side: Part, top: Part | null, r: XY[], z0: number, z1: number) {
  const R = ccw(r)
  walls(side, R, z0, z1)
  if (top) cap(top, R, z1)
}
/** An axis box from corner to corner. */
function boxA(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = false) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(p, r, z0, z1)
  cap(p, r, z1)
  if (bottom) cap(p, r, z0, false)
}
/** A flat panel on a vertical wall from a to b (plan), heights z0..z1, `out` metres proud along the outward normal. */
function panel(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = dy / l, ny = -dx / l
  const P = (s: number, z: number): V3 => [a[0] + dx * s + nx * out, a[1] + dy * s + ny * out, z]
  quad(p, [P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)], [nx, ny, 0])
}

function build() {
  const glass = new Part(), band = new Part(), red = new Part(), ochre = new Part(), trim = new Part(), stone = new Part()

  // --- The tower (OSM parts, turned 6° to the building's own frame).
  const GL: XY[] = [[-8.2, -6.7], [-8.2, -10.4], [11.2, -10.4], [11.2, 9.7], [-4.5, 9.7], [-4.5, -6.7]]
  const RED: XY[] = [[-12.8, -6.7], [-4.5, -6.7], [-4.5, 4.5], [-12.8, 4.5]]
  const TAN: XY[] = [[-10.7, 4.5], [-4.5, 4.5], [-4.5, 11], [-10.7, 11]]
  const LOBBY = 3.5, FL = 3.3, NF = 16, TOP = LOBBY + NF * FL // 56.3
  // the lobby: dark glazing set back under the first floor
  const GLin: XY[] = [[-7.7, -6.7], [-7.7, -9.9], [10.7, -9.9], [10.7, 9.2], [-4.5, 9.2], [-4.5, -6.7]]
  prismP(glass, null, GLin, 0, LOBBY)
  cap(trim, ccw(GL), LOBBY, false)
  // the curtain wall: dark glass with a lighter ribbon of glazing every
  // second floor and the slab edges projecting as thin pale fins
  prismP(glass, null, GL, LOBBY, TOP)
  const GLR = ccw(GL)
  for (let f = 0; f < NF; f += 2) {
    const z = LOBBY + f * FL
    for (let i = 0; i < GLR.length; i++) {
      const a = GLR[i], b = GLR[(i + 1) % GLR.length]
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 2) continue
      if (a[0] === -4.5 && b[0] === -4.5) continue // against the red wall
      panel(band, a, b, 0, 1, z + 1.0, z + 3.0, 0.05)
    }
    if (f > 0) { // the slab fin
      const fin = chamfer(ccw([[-8.5, -6.7], [-8.5, -10.7], [11.5, -10.7], [11.5, 10.0], [-4.5, 10.0], [-4.5, -6.7]]), 0.2)
      walls(trim, fin, z - 0.18, z + 0.18)
      cap(trim, fin, z + 0.18)
    }
  }
  // the deep dark-red roof slab
  const CORN = chamfer(ccw([[-8.8, -6.7], [-8.8, -11.0], [11.8, -11.0], [11.8, 10.3], [-4.5, 10.3], [-4.5, -6.7]]), 0.3)
  walls(red, CORN, TOP, TOP + 0.8)
  cap(red, CORN, TOP + 0.8)
  cap(red, CORN, TOP, false)

  // the red wall (west) and the ochre brick shaft (north-west), both
  // windowless, rising past the roof
  prismP(red, red, chamfer(ccw(RED), 0.3), 0, 59.5)
  prismP(ochre, ochre, chamfer(ccw(TAN), 0.3), 0, 58)
  // the UNAM shield high on the red west face: the gold eagle and the
  // shield (Siqueiros' poniente)
  panel(ochre, [-12.8, 4.5], [-12.8, -6.7], 0.15, 0.85, 45, 54.5, 0.08)
  panel(trim, [-12.8, 4.5], [-12.8, -6.7], 0.35, 0.65, 46.5, 52.5, 0.14)

  // --- "Nuevo símbolo universitario" (Siqueiros, 1953): the relief box
  // cantilevered from the east face over floors 4–6, overhanging the south-east corner (photos; OSM
  // way/1341387913 has it 5 m further north), gold with the red
  // triangle and the pale eagles' rings.
  const BX0 = 11.2, BX1 = 14.2, BY0 = -11.4, BY1 = -0.4, BZ0 = 16, BZ1 = 26
  boxA(ochre, BX0, BY0, BZ0, BX1, BY1, BZ1, true)
  panel(red, [BX1, BY0], [BX1, BY1], 0.38, 0.62, BZ0 + 0.6, BZ0 + 6.5, 0.07)
  panel(red, [BX1, BY0], [BX1, BY1], 0.45, 0.55, BZ0 + 6.5, BZ0 + 8.5, 0.07)
  for (const [s0, s1] of [[0.12, 0.36], [0.64, 0.88]]) panel(trim, [BX1, BY0], [BX1, BY1], s0, s1, BZ1 - 5.2, BZ1 - 1.6, 0.07)
  panel(red, [BX0, BY0], [BX1, BY0], 0.1, 0.9, BZ0 + 1.5, BZ1 - 1.5, 0.06) // the south end of the box

  // --- The low wing (OSM way/260241576), wrapped round the tower's foot:
  // a stone ground floor, a glazed floor between ochre slab edges, the
  // frieze level, a red roof.
  const LOW: XY[] = [[-36.7, -60.2], [-2.7, -59.9], [-3.1, -10.4], [-8.2, -10.4], [-8.2, -6.7], [-12.8, -6.7], [-12.8, 4.5], [-11.3, 4.5], [-11.3, 10.9], [-39.6, 10.8], [-39.6, -4.8], [-37.1, -4.8]]
  const LR = ccw(LOW)
  walls(stone, LR, 0, 3.2)
  walls(ochre, LR, 3.2, 3.7)
  walls(glass, LR, 3.7, 6.2)
  walls(ochre, LR, 6.2, 6.6)
  walls(stone, LR, 6.6, 9.5)
  cap(red, LR, 9.5)
  // ground-floor glazing in broad bays on the long sides
  for (const [a, b] of [[[-2.7, -59.9], [-3.1, -10.4]], [[-37.1, -4.8], [-36.7, -60.2]]] as [XY, XY][]) {
    for (let i = 0; i < 4; i++) panel(glass, a, b, 0.05 + i * 0.24, 0.23 + i * 0.24, 0.5, 2.8, 0.05)
  }

  // "Las fechas en la historia de México" (north): the frieze along the
  // top of the wing's north face — the dates panel, the great hands and
  // the pencil, standing out from the wall.
  const NA: XY = [-11.3, 10.9], NB: XY = [-39.6, 10.8]
  panel(ochre, NA, NB, 0.02, 0.98, 6.7, 9.4, 0.08)
  panel(trim, NA, NB, 0.03, 0.17, 6.9, 9.2, 0.14) // the dates
  panel(red, NA, NB, 0.22, 0.62, 7.0, 9.0, 0.6) // the hands and the pencil, in relief
  panel(trim, NA, NB, 0.62, 0.95, 7.5, 8.5, 0.4)

  // "El pueblo a la universidad, la universidad al pueblo" (south): the
  // great relief across the wing's south end — the crowd of figures
  // climbing toward the university, in ochre, red-brown and pale stone,
  // its main figures standing well out.
  const SA: XY = [-36.7, -60.2], SB: XY = [-2.7, -59.9]
  panel(ochre, SA, SB, 0.03, 0.97, 3.8, 9.3, 0.08)
  panel(red, SA, SB, 0.1, 0.45, 4.2, 8.8, 0.9)
  panel(red, SA, SB, 0.55, 0.9, 4.2, 8.0, 0.6)
  panel(trim, SA, SB, 0.45, 0.55, 4.6, 9.1, 1.2)
  panel(trim, SA, SB, 0.2, 0.32, 6.0, 8.2, 1.0)

  return [
    { part: glass, material: PALETTE.window },
    { part: band, material: windowVariant(2, 0x9fb3c2) },
    { part: red, material: finish('rectoria-red', 0xa65a4c) },
    { part: ochre, material: finish('rectoria-ochre', 0xcfa55e) },
    { part: trim, material: PALETTE.trim },
    { part: stone, material: PALETTE.stone },
  ]
}

if (import.meta.main) {
  const parts = build()
  for (const { part, material } of parts) console.log(material.name.padEnd(18), part.triangles)
  await save('mexico-city-unam-rectoria', 'Torre de Rectoría UNAM', ANCHOR, BEARING, parts, 5000)
}
