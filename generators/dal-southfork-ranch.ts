/**
 * Southfork Ranch, the Ewing mansion — procedural, CC0-1.0, no textures.
 * bun generators/dal-southfork-ranch.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/172351926 (lng -96.6093807, lat 33.0492574), which
 * is the house itself (building=house, tourism=attraction). Its walls run
 * true north–south, so the model is placed at bearing 0. The front, with the
 * columned porch, faces west across the lawn; the pool is behind it on the
 * east.
 *
 * What it is: the ranch house in Parker, Texas, built 1970 for J. Cloyce Box
 * and used as the Ewing family home in "Dallas" (1978–91, 2012–14). White
 * clapboard, black shutters, grey-brown shingle roofs. A two-storey centre
 * block, cross-gabled, whose west gable is a broad pediment over a
 * full-height porch of four round columns with a balcony between the
 * storeys; one-and-a-half-storey wings north and south, each with a gabled
 * dormer to the front; a lower north wing with a white cupola; a rear
 * balcony deck and a tall white chimney on the east. The pediment and porch
 * are the identity.
 *
 * Covers and replaces: way/172351926 (OSM has no parts).
 *
 * Evidence
 * - OSM way/172351926 (measured): the plan. The centre block x -9.3..8,
 *   y -9.2..2.9 (the porch the first 2.4 m of it); south wing x -7..5 to
 *   y -17.6; north wing x -6.9..5 to y 11.6; the cupola wing x -3.9..5 to
 *   y 21.2; the rear deck x 8..11.9, y -8.8..-1.1.
 * - USGS 3DEP lidar, TX_Pecos_Dallas_B3_2018 (2018 flight), 0.5 m grid (this
 *   site is inside it, though the city notes expected not), heights above
 *   the ground at the walls (1.3 m over the box's lowest return): centre
 *   block an east–west ridge at y = -3 of 8.9 m and a north–south ridge at
 *   x = -1 of 9.1 m, eaves 5.8–6.1; the north and south wings ridges 6.0 at
 *   x = -1, running out to their ends (gabled), eaves ~2.8; the cupola wing
 *   ridge 5.2–5.5 at x = 0.5; the rear deck 3.1–3.8; the chimney 9.4 at
 *   x = 9, y = -4.5.
 * - Photos (Wikimedia Commons):
 *   "Main house at Southfork Ranch in Parker, Texas, ... LCCN2015631260.tif"
 *   (Carol M. Highsmith, public domain): the west front square on. Scaled on
 *   the pediment's 12 m width (OSM): four columns 3.45 m apart, 0.55 m
 *   across, to 5.3 m; balcony floor 3.1 m; pediment base 5.4 and apex 8.9
 *   (the lidar's 8.9); one dormer per wing; the cupola on the north wing;
 *   window and shutter layout.
 *   "SouthForkFront.jpg" (Sf46, public domain): from the north-west: the
 *   north wing's dormer, the cross gable's north end with its vent, the
 *   cupola wing set back, the porch in depth.
 *   "Southfork Ranch-03.jpg" (Priwo, public domain): the east side: the
 *   rear gable, the white brick chimney, the balcony deck on posts with its
 *   stair. "Southfork Ranch-04.jpg" (Priwo, public domain): the deck and
 *   pool. "Southfork Ranch-02.jpg" (Priwo, public domain): from the
 *   south-west across the paddock. "Southfork ranch.jpg" (Triebtäter, CC BY-SA
 *   2.0 de): the west front from the field.
 *   Colours from these, pulled to the palette: white clapboard, grey-brown
 *   shingles, black shutters (held at charcoal).
 * - USGS NAIP orthophoto (public domain): the plan, the grey roofs, the pool
 *   to the east.
 * - Published (Wikipedia "Southfork Ranch"): built 1970, in Parker, Collin
 *   County; the Ewing home in "Dallas".
 * - Estimated: the dormers' size and height (photo); the cupola's size; the
 *   windows on the north, south and east faces (partly photographed); the
 *   deck's railing height.
 * - Simplified: the lattice balcony railings as white bands; the deck's
 *   stair, the roof vents, the shutters' louvres and the cupola's finial are
 *   left out or drawn as plain blocks.
 *
 * Night: windows glow; the west front is floodlit as for events.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, cylinder, gable, grow, panel, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

// ---- Plan (OSM).
const CX0 = -7.0, CX1 = 8.0, CY0 = -9.2, CY1 = 2.9 // the centre block's walls
const PORCH = -9.3 // the porch's front
const CYM = (CY0 + CY1) / 2 // the pediment's axis
const SW = rect(-6.95, 5.05, -17.6, CY0) // south wing
const NW = rect(-6.9, 5.0, CY1, 11.6) // north wing
const KW = rect(-3.9, 5.0, 11.6, 21.15) // the cupola wing
const DECK = rect(CX1, 11.9, -8.75, -1.05)
// ---- Heights (lidar; photo-scaled where noted).
const EAVE2 = 5.8, RIDGE_EW = 8.9, RIDGE_NS = 9.1 // centre block
const EAVE1 = 2.8, RIDGE1 = 6.0 // the wings
const RIDGE_K = 5.4 // the cupola wing
const COL_TOP = 5.35, BALCONY = 3.1
const COLS = [-5.18, -1.73, 1.73, 5.18].map((d) => CYM + d)
const OVER = 0.4 // eaves overhang

/** A window with black shutters either side. */
function shuttered(win: Part, shut: Part, side: Side, at: number, c: number, z0: number, z1: number, w = 1.1) {
  panel(win, side, at, c - w / 2, c + w / 2, z0, z1, 0.05)
  panel(shut, side, at, c - w / 2 - 0.5, c - w / 2 - 0.05, z0, z1, 0.05)
  panel(shut, side, at, c + w / 2 + 0.05, c + w / 2 + 0.5, z0, z1, 0.05)
}

/** A gabled wing: walls, a ridge along y at x = xr, overhanging eaves, closed gable ends where asked. */
function wing(white: Part, roof: Part, r: Rect, eave: number, ridge: number, ends: [boolean, boolean]) {
  cbox(white, r, 0, eave, { top: false })
  const g = rect(r.x0 - OVER, r.x1 + OVER, r.y0 - (ends[0] ? OVER : 0), r.y1 + (ends[1] ? OVER : 0))
  gable(roof, white, g, eave - 0.2, ridge, true, ends)
  // the soffits under the side eaves
  for (const [xa, xb] of [[g.x0, r.x0], [r.x1, g.x1]]) {
    qf(white, [xa, g.y0, eave - 0.2], [xb, g.y0, eave - 0.2], [xb, g.y1, eave - 0.2], [xa, g.y1, eave - 0.2], [0, 0, -1])
  }
}

/** A gabled dormer on a west-facing roof slope, centred on y = c, its face at x = fx. */
function dormer(white: Part, roof: Part, win: Part, shut: Part, fx: number, c: number, back: number, z0: number) {
  const hw = 1.1, wall = z0 + 1.6, apex = wall + 0.9
  cbox(white, rect(fx, back, c - hw, c + hw), z0, wall, { top: false })
  gable(roof, white, rect(fx - 0.25, back, c - hw - 0.2, c + hw + 0.2), wall, apex, false, [true, false])
  shuttered(win, shut, 'w', fx, c, z0 + 0.25, wall - 0.2, 0.75)
}

function build() {
  const white = new Part(), roof = new Part(), win = new Part(), shut = new Part(), door = new Part(), shade = new Part()

  // ---- Centre block: two storeys under crossed gables. The east–west gable
  // runs out over the porch to the pediment; the north–south one shows its
  // gable ends over the wings' roofs.
  cbox(white, rect(CX0, CX1, CY0, CY1), 0, EAVE2, { top: false })
  gable(roof, white, rect(PORCH - 0.25, CX1 + OVER, CY0 - OVER, CY1 + OVER), EAVE2 - 0.2, RIDGE_EW, false, [true, true])
  gable(roof, white, rect(-6.0, 4.0, CY0 - OVER, CY1 + OVER), EAVE2 - 0.2, RIDGE_NS, true, [true, true])
  // the pediment's cornice line and the porch ceiling
  cbox(white, rect(PORCH - 0.25, CX0, CY0 - OVER, CY1 + OVER), COL_TOP, EAVE2 - 0.2, { top: false })
  qf(shade, [PORCH - 0.25, CY0 - OVER, COL_TOP], [CX0, CY0 - OVER, COL_TOP], [CX0, CY1 + OVER, COL_TOP], [PORCH - 0.25, CY1 + OVER, COL_TOP], [0, 0, -1])
  // the porch's back wall, in the porch's shadow
  panel(shade, 'w', CX0, CY0, CY1, 0, COL_TOP, 0.02)
  // the vent in each gable
  for (const [side, at] of [['s', CY0 - OVER], ['n', CY1 + OVER]] as [Side, number][]) panel(shut, side, at, -1.35, -0.65, 7.2, 8.0, 0.03)

  // ---- The porch: four round two-storey columns, the balcony between the
  // storeys with its railing, the front wall's door and windows.
  for (const y of COLS) {
    cylinder(white, PORCH + 0.4, y, 0.3, 0, COL_TOP - 0.3, 12)
    cbox(white, rect(PORCH + 0.4 - 0.4, PORCH + 0.4 + 0.4, y - 0.4, y + 0.4), COL_TOP - 0.3, COL_TOP, { bottom: true, top: false })
    cbox(white, rect(PORCH + 0.4 - 0.38, PORCH + 0.4 + 0.38, y - 0.38, y + 0.38), 0, 0.3, {})
  }
  cbox(white, rect(PORCH + 0.2, CX0, CY0 + 0.1, CY1 - 0.1), BALCONY - 0.25, BALCONY, {})
  qf(shade, [PORCH + 0.2, CY0 + 0.1, BALCONY - 0.25], [CX0, CY0 + 0.1, BALCONY - 0.25], [CX0, CY1 - 0.1, BALCONY - 0.25], [PORCH + 0.2, CY1 - 0.1, BALCONY - 0.25], [0, 0, -1])
  cbox(white, rect(PORCH + 0.3, PORCH + 0.5, CY0 + 0.1, CY1 - 0.1), BALCONY, BALCONY + 1.0, { b: 0.05 })
  cbox(white, rect(PORCH - 0.05, CX0, CY0 - 0.1, CY1 + 0.1), 0, 0.25, { b: 0.05 })
  panel(door, 'w', CX0, CYM - 0.6, CYM + 0.6, 0.25, 2.5)
  panel(win, 'w', CX0, CYM - 0.75, CYM + 0.75, BALCONY + 0.05, 5.15)
  for (const d of [-3.24, 3.24]) {
    shuttered(win, shut, 'w', CX0, CYM + d, 0.8, 2.6, 1.2)
    shuttered(win, shut, 'w', CX0, CYM + d, 3.6, 5.2, 1.2)
  }
  // the centre block's east face: French doors below, windows above
  for (const y of [-6.9, -3.15, 0.6]) {
    panel(win, 'e', CX1, y - 0.7, y + 0.7, 0.2, 2.5)
    shuttered(win, shut, 'e', CX1, y, 3.6, 5.1)
  }

  // ---- The rear deck on posts, its railing, and the white chimney.
  for (const x of [DECK.x0 + 1.2, DECK.x1 - 0.2]) for (const y of [DECK.y0 + 0.2, (DECK.y0 + DECK.y1) / 2, DECK.y1 - 0.2]) {
    cbox(white, rect(x - 0.15, x + 0.15, y - 0.15, y + 0.15), 0, BALCONY - 0.25, { top: false })
  }
  cbox(white, DECK, BALCONY - 0.25, BALCONY, { bottom: true })
  for (const r of [rect(DECK.x1 - 0.12, DECK.x1, DECK.y0, DECK.y1), rect(CX1 + 1.4, DECK.x1, DECK.y0, DECK.y0 + 0.12), rect(CX1 + 1.4, DECK.x1, DECK.y1 - 0.12, DECK.y1)]) {
    cbox(white, r, BALCONY, BALCONY + 1.0, {})
  }
  cbox(white, rect(CX1, CX1 + 1.4, -5.2, -3.8), 0, 9.4, { b: 0.08 })

  // ---- The wings, their front dormers, and the cupola.
  wing(white, roof, SW, EAVE1, RIDGE1, [true, false])
  wing(white, roof, NW, EAVE1, RIDGE1, [false, true])
  wing(white, roof, KW, EAVE1, RIDGE_K, [false, true])
  const slope = (RIDGE1 - EAVE1 + 0.2) / ((SW.x1 - SW.x0) / 2 + OVER)
  const fx = SW.x0 + 1.6, zf = EAVE1 - 0.2 + slope * (fx - SW.x0 + OVER)
  dormer(white, roof, win, shut, fx, (SW.y0 + SW.y1) / 2, (SW.x0 + SW.x1) / 2 - 0.05, zf - 0.3)
  dormer(white, roof, win, shut, NW.x0 + 1.6, (NW.y0 + NW.y1) / 2, (NW.x0 + NW.x1) / 2 - 0.05, zf - 0.3)
  const kx = (KW.x0 + KW.x1) / 2, ky = 16.4
  cbox(white, rect(kx - 0.7, kx + 0.7, ky - 0.7, ky + 0.7), RIDGE_K - 0.8, RIDGE_K + 0.6, { top: false })
  cbox(white, rect(kx - 0.85, kx + 0.85, ky - 0.85, ky + 0.85), RIDGE_K + 0.6, RIDGE_K + 0.75, { bottom: true, b: 0.05 })
  cbox(white, rect(kx - 0.55, kx + 0.55, ky - 0.55, ky + 0.55), RIDGE_K + 0.75, RIDGE_K + 1.6, { top: false })
  for (const s of ['n', 's', 'e', 'w'] as Side[]) {
    const at = s === 'n' ? ky + 0.55 : s === 's' ? ky - 0.55 : s === 'e' ? kx + 0.55 : kx - 0.55
    const c = s === 'n' || s === 's' ? kx : ky
    panel(shut, s, at, c - 0.32, c + 0.32, RIDGE_K + 0.9, RIDGE_K + 1.45, 0.03)
  }
  cbox(white, rect(kx - 0.7, kx + 0.7, ky - 0.7, ky + 0.7), RIDGE_K + 1.6, RIDGE_K + 1.72, { bottom: true })
  // the bell roof and finial
  const bell: [number, number][] = [[0.7, 0], [0.62, 0.3], [0.42, 0.55], [0.15, 0.75], [0.06, 1.1]]
  for (let k = 0; k < bell.length - 1; k++) {
    const [r0, h0] = bell[k], [r1, h1] = bell[k + 1]
    cylinder(white, kx, ky, r0, RIDGE_K + 1.72 + h0, RIDGE_K + 1.72 + h1, 8, r1)
  }

  // ---- Windows on the wings.
  for (const y of [-11.6, -15.6]) { shuttered(win, shut, 'w', SW.x0, y, 0.8, 2.3); shuttered(win, shut, 'e', SW.x1, y, 0.8, 2.3) }
  for (const y of [5.4, 9.4]) { shuttered(win, shut, 'w', NW.x0, y, 0.8, 2.3); shuttered(win, shut, 'e', NW.x1, y, 0.8, 2.3) }
  for (const y of [13.7, 16.4, 19.1]) { shuttered(win, shut, 'w', KW.x0, y, 0.8, 2.3); shuttered(win, shut, 'e', KW.x1, y, 0.8, 2.3) }
  for (const x of [-3.6, 1.7]) {
    shuttered(win, shut, 's', SW.y0, x, 0.8, 2.3)
    shuttered(win, shut, 's', SW.y0, -0.95, 3.4, 4.5, 0.8)
  }
  for (const x of [-1.6, 2.7]) shuttered(win, shut, 'n', KW.y1, x, 0.8, 2.3)

  return [
    { part: white, material: { ...WHITE, floodlight: frontLit } },
    { part: roof, material: SHINGLE },
    { part: win, material: PALETTE.window },
    { part: shut, material: SHUTTER },
    { part: door, material: PALETTE.entrance },
    { part: shade, material: WHITE_SHADE },
  ]
}

/** The west front and porch take the floodlights; the rest stays dim. */
const frontLit = (p: V3, n: V3): number => (n[2] > 0.8 ? 0.15 : n[0] < -0.5 && p[0] < CX0 + 0.5 ? 0.85 : p[0] < CX0 + 0.5 && p[1] > CY0 - 1 && p[1] < CY1 + 1 ? 0.7 : 0)

/** White painted clapboard. */
const WHITE = finish('southfork-white', 0xf4f1ea)
/** The same white in the porch's shadow, so the columns and railing read against it. */
const WHITE_SHADE = finish('southfork-white-shade', 0xc9c6c0)
/** Grey-brown asphalt shingles, pulled to the palette's lightness. */
const SHINGLE = finish('southfork-shingle', 0x8f8983)
/** The black shutters and gable vents, held at charcoal. */
const SHUTTER = finish('southfork-shutter', 0x4a4f57)

if (import.meta.main) {
  await saveModel('dal-southfork-ranch', 'Southfork Ranch', build(), { source: 'generators/dal-southfork-ranch.ts' })
}
