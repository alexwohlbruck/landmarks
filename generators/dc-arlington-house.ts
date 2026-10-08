/**
 * Arlington House, The Robert E. Lee Memorial — procedural, CC0-1.0, no
 * textures.
 * bun generators/dc-arlington-house.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/41279883 (lng -77.0726362, lat 38.8811764). The
 * outline's long east front runs 0.5° west of north, so the model is placed
 * at bearing 359.5 and built square. The portico faces east, toward the
 * city across the river.
 *
 * What it is: George Hadfield's Greek Revival mansion for George Washington
 * Parke Custis, 1803–18, on the hilltop above Arlington National Cemetery.
 * A two-storey centre block under a single low gable whose east end is the
 * pediment of a deep portico of eight massive unfluted Doric columns (six
 * across the front, one more behind each end), and a one-storey wing either
 * side, its front flush with the block, three tall arched windows in arched
 * recesses, a balustrade round a low slate roof. Walls of brick under
 * stucco scored and painted as buff ashlar; the columns painted as marble.
 *
 * Covers and replaces: the outline way/41279883 (centre block and wings)
 * and way/1500304896 (the portico). The two slave quarters to the west
 * (way/41279884, way/41279885) are separate buildings and are left alone.
 *
 * Evidence
 * - HABS VA-443 (Historic American Buildings Survey, 1940–41, D. F. Ciango,
 *   public domain; Wikimedia Commons "Arlington House, Lee Drive, ... HABS
 *   VA,7-ARL,1- (sheet 2–6 of 18)"): measured plans and elevations. The
 *   front 139 ft 8 in (42.6 m): centre block 59 ft 6 in (18.1 m), wings
 *   39 ft 11 in and 40 ft 3 in (12.2 m); the block 12.2 m deep, the wings
 *   35 ft 9½ in (10.9 m); the portico's column centres 54 ft 2 in (16.5 m)
 *   apart in bays of 10 ft 10¾ in and 10 ft 9½ in, the front row
 *   22 ft 10½ in (7.0 m) out from the wall, the second pair 9 ft 5½ in.
 *   Read off the east elevation against its scale bar: portico floor 0.8 m,
 *   columns to 7.5 m, entablature to 9.2 m, pediment apex 13.5 m; wing
 *   cornice 5.5 m and balustrade 6.3 m; chimneys to 12.9 m, flush with the
 *   block's side walls 4.4 and 7.0 m back from the front. The north and
 *   west elevations: one gable over block and portico (a pediment with a
 *   lunette at the west end too), the wings' low hipped slate roofs inside
 *   the balustrade.
 * - OSM (measured): the outline 43.5 m north–south and the portico way, which
 *   ends on the front columns' centres (13.8 m). OSM splits block and wings
 *   at 25 m / 9.2 m and makes the block 14.2 m deep; the HABS drawings are
 *   followed instead, so the model sits up to 2 m inside the outline at the
 *   back.
 * - Published (Wikipedia, "Arlington House, The Robert E. Lee Memorial";
 *   NPS): a front 140 ft long; eight portico columns 5 ft (1.5 m) across.
 * - Photos (Wikimedia Commons): "Arlington House front view.JPG" (public
 *   domain), the east front; "Arlington House (The Robert E. Lee Memorial)
 *   ARHO6035.jpg" (National Park Service, public domain), the east front
 *   square on; "Arlington House from SE corner.jpg" (Billkoplitz, CC BY-SA
 *   3.0), the portico in depth and the south wing; "Robert E. Lee house.JPG"
 *   (Stephanie Hendricks, CC BY-SA 3.0), the pediment from the foot of the
 *   hill. Colours from these: buff-pink stucco, cream columns and tympanum,
 *   dark grey roofs.
 * - USGS NAIP orthophoto (public domain): one gable, ridge east–west, over
 *   block and portico; the column row; the wings' low roofs.
 * - Estimated: the wings' hip height inside the balustrade (6.7 m); the
 *   wings' chimney positions in depth.
 * - Simplified: the triglyph frieze, the marbling, the balusters (a plain
 *   parapet), the shutters (drawn as the window panel), the steps (one),
 *   the basement windows, the west porches and the conservatory's glazed
 *   arcade (drawn as the wing's arched windows) are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, gable, hip, panel, qf, rect, tf, type Side } from './dc-white-house'
import { saveModel } from './dc-nga-west'

// ---- Plan (HABS, placed on the OSM front and centroid).
const XE = 6.8 // the front wall of block and wings
const XW = XE - 12.2 // the block's back wall
const WX0 = XE - 10.9 // the wings' back wall
const YB = 9.07 // the block's half-width
const YW = YB + 12.2 // the wings' far ends
const XC1 = XE + 2.88, XC2 = XE + 6.97 // the portico's two rows of columns
const R = 0.76 // 5 ft columns
const XP = XC2 + R + 0.1 // the entablature's front face
const COLS = [-8.255, -4.935, -1.645, 1.645, 4.935, 8.255]
// ---- Heights (HABS east elevation).
const FLOOR = 0.8
const COL = 7.5
const EAVE = 9.2
const APEX = 13.5
const WING = 5.5, WING_PARAPET = 6.3, WING_TOP = 6.7

/** A flat panel with a semicircular head, on a wall facing `side`. */
function archPanel(p: Part, side: Side, at: number, c: number, w: number, z0: number, zs: number, d = 0.05, seg = 8) {
  const n: V3 = side === 'n' ? [0, 1, 0] : side === 's' ? [0, -1, 0] : side === 'e' ? [1, 0, 0] : [-1, 0, 0]
  const ns = side === 'n' || side === 's'
  const off = at + (ns ? n[1] : n[0]) * d
  const Q = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
  const r = w / 2
  qf(p, Q(c - r, z0), Q(c + r, z0), Q(c + r, zs), Q(c - r, zs), n)
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    tf(p, Q(c, zs), Q(c + r * Math.cos(a0), zs + r * Math.sin(a0)), Q(c + r * Math.cos(a1), zs + r * Math.sin(a1)), n)
  }
}

/** A tall arched window in its arched recess, as on every face of the wings. */
function recessedWindow(shade: Part, win: Part, side: Side, at: number, c: number) {
  archPanel(shade, side, at, c, 2.4, 1.0, 3.6, 0.02)
  archPanel(win, side, at, c, 1.25, 1.75, 3.65, 0.05)
}

/** A Doric column: a tapering round shaft, a flaring echinus and a square abacus. */
function doric(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 16) {
  const ab = 0.3, ech = 0.3
  cylinder(p, cx, cy, r, z0, z1 - ab - ech, seg, r * 0.9)
  cylinder(p, cx, cy, r * 0.9, z1 - ab - ech, z1 - ab, seg, r * 1.12)
  const a = r * 1.18
  cbox(p, rect(cx - a, cx + a, cy - a, cy + a), z1 - ab, z1, { bottom: true, top: false })
}

function build() {
  const stucco = new Part(), shade = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()

  // ---- Centre block, its cornice, and the one gable over block and portico.
  cbox(stucco, rect(XW, XE, -YB, YB), 0, EAVE - 0.45, { top: false })
  cbox(trim, rect(XW - 0.3, XE, -YB - 0.3, YB + 0.3), EAVE - 0.45, EAVE, { bottom: true, top: false })
  gable(roof, stucco, rect(XW - 0.3, XP + 0.3, -YB - 0.3, YB + 0.3), EAVE, APEX, false, [true, false])
  // The west gable is a pediment too, with a lunette.
  archPanel(win, 'w', XW - 0.3, 0, 1.3, 10.1, 10.9, 0.05)

  // ---- Portico: floor and step, eight columns, entablature, pediment.
  cbox(stucco, rect(XE, XP + 0.5, -YB, YB), 0, FLOOR, { b: 0.08 })
  cbox(stucco, rect(XP + 0.5, XP + 1.0, -YB + 0.4, YB - 0.4), 0, FLOOR / 2, { b: 0.05 })
  for (const y of COLS) doric(trim, XC2, y, R, FLOOR, COL)
  for (const y of [COLS[0], COLS[5]]) doric(trim, XC1, y, R, FLOOR, COL)
  // entablature: architrave and frieze as one deep beam, then the cornice
  cbox(stucco, rect(XE, XP, -YB, YB), COL, EAVE - 0.45, { top: false, bottom: true })
  cbox(trim, rect(XE, XP + 0.3, -YB - 0.3, YB + 0.3), EAVE - 0.45, EAVE, { bottom: true, top: false })
  // the tympanum, set just inside the raking cornice
  tf(trim, [XP + 0.04, -YB, EAVE], [XP + 0.04, YB, EAVE], [XP + 0.04, 0, APEX - 0.4], [1, 0, 0])
  // The front wall under the portico: the door, four windows, and the five
  // small upper windows under the entablature.
  panel(door, 'e', XE, -0.85, 0.85, FLOOR, 4.0)
  for (const y of [-6.2, -3.15, 3.15, 6.2]) panel(win, 'e', XE, y - 0.62, y + 0.62, 1.75, 4.1)
  for (const y of [-6.2, -3.15, 0, 3.15, 6.2]) panel(win, 'e', XE, y - 0.62, y + 0.62, 6.35, 7.5)

  // West front: three bays, two storeys; the middle one wider.
  for (const y of [-5.5, 5.5]) {
    archPanel(shade, 'w', XW, y, 2.2, 2.1, 4.3, 0.02)
    panel(win, 'w', XW, y - 0.7, y + 0.7, 2.3, 4.5)
    panel(win, 'w', XW, y - 0.7, y + 0.7, 6.3, 8.0)
  }
  panel(door, 'w', XW, -1.3, 1.3, 1.6, 4.6)
  panel(win, 'w', XW, -1.3, 1.3, 6.3, 8.2)
  // Side walls, above the wings' roofs: two upper windows each.
  for (const s of [-1, 1]) for (const x of [XE - 3.0, XE - 9.0]) panel(win, s < 0 ? 's' : 'n', s * YB, x - 0.6, x + 0.6, 6.9, 8.4)

  // ---- Chimneys, flush with the side walls.
  for (const s of [-1, 1]) for (const x of [XE - 4.4, XE - 7.0]) {
    cbox(stucco, rect(x - 0.7, x + 0.7, s * YB - 0.9, s * YB + 0.1), EAVE - 1, 12.9, { b: 0.08 })
  }

  // ---- Wings: walls, cornice, a parapet for the balustrade round a low hipped
  // slate roof, a small chimney, and three arched windows in arched recesses
  // on the front and back, one on the far end.
  for (const s of [-1, 1]) {
    const y0 = s < 0 ? -YW : YB, y1 = s < 0 ? -YB : YW
    // the far end grows outward; the end against the block stays on its wall
    const grown = (d: number) => rect(WX0 - d, XE + d, s < 0 ? y0 - d : y0, s < 0 ? y1 : y1 + d)
    cbox(stucco, rect(WX0, XE, y0, y1), 0, WING - 0.4, { top: false })
    cbox(trim, grown(0.25), WING - 0.4, WING, { bottom: true, top: false })
    cbox(trim, grown(0.05), WING, WING_PARAPET, { top: false })
    // the parapet's inner face and its coping, then the roof inside it
    const t = 0.3
    const ir: [number, number][] = [[WX0 + t, s < 0 ? y0 + t : y0], [XE - t, s < 0 ? y0 + t : y0], [XE - t, s < 0 ? y1 : y1 - t], [WX0 + t, s < 0 ? y1 : y1 - t]]
    const or: [number, number][] = [[WX0 - 0.05, s < 0 ? y0 - 0.05 : y0], [XE + 0.05, s < 0 ? y0 - 0.05 : y0], [XE + 0.05, s < 0 ? y1 : y1 + 0.05], [WX0 - 0.05, s < 0 ? y1 : y1 + 0.05]]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, a = ir[i], b = ir[j]
      qf(trim, [a[0], a[1], WING], [b[0], b[1], WING], [b[0], b[1], WING_PARAPET], [a[0], a[1], WING_PARAPET], [-(b[1] - a[1]), b[0] - a[0], 0])
      qf(trim, [a[0], a[1], WING_PARAPET], [b[0], b[1], WING_PARAPET], [or[j][0], or[j][1], WING_PARAPET], [or[i][0], or[i][1], WING_PARAPET], [0, 0, 1])
    }
    hip(roof, rect(ir[0][0], ir[2][0], Math.min(ir[0][1], ir[2][1]), Math.max(ir[0][1], ir[2][1])), WING, WING_TOP, 3.5)
    const cy = (y0 + y1) / 2
    cbox(stucco, rect(XE - 6.5, XE - 5.7, cy - 0.4, cy + 0.4), WING, s > 0 ? 9.3 : 8.0, { b: 0.05 })
    for (const off of [2.4, 5.85, 9.3]) {
      recessedWindow(shade, win, 'e', XE, s * (YB + off))
      recessedWindow(shade, win, 'w', WX0, s * (YB + off))
    }
    recessedWindow(shade, win, s < 0 ? 's' : 'n', s < 0 ? y0 : y1, XE - 5.45)
  }

  return [
    { part: stucco, material: STUCCO },
    { part: shade, material: STUCCO_SHADE },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ]
}

/** The buff-pink painted stucco, pulled to the palette's lightness. */
const STUCCO = finish('arlington-stucco', 0xe7cfb5)
/** The same in the shade of the arched recesses. */
const STUCCO_SHADE = finish('arlington-stucco-shade', 0xd6bea4)

if (import.meta.main) {
  await saveModel('dc-arlington-house', 'Arlington House', build(), { source: 'generators/dc-arlington-house.ts' })
}
