/**
 * Mather Tower (75 East Wacker, 1928, Herbert Hugh Riddle; now a Club
 * Quarters hotel), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-mather-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/147399564,
 * 41.887616,-87.625442. The building stands square to the bend of Wacker
 * Drive: its short faces run at 34.9°, so the catalog bearing is 34.9 and
 * the model is built square to its own frame (the Wacker front is the west
 * face here).
 *
 * Identity, in order: the slim octagonal tower on the slab, stepping in by
 * stages to a crenellated lantern — the "pencil"; the white terracotta; the
 * slab's three tall window bays between plain end piers.
 *
 * Evidence:
 *  - plan: OSM outline, 30.4 × 20.6 m; the octagon OSM way/592122465,
 *    ~11 m across, a little off the slab's centre (kept where OSM has it).
 *  - heights: 158 m (OSM, published 521 ft) and 41 floors. The slab is 24
 *    floors (OSM part way/686198765 says 23 levels; published 24), its
 *    middle at ~88 m, the end piers a storey lower, so the parapet steps
 *    (Tony Hisgett). The octagon rises in four stages, each tapering
 *    slightly and set back at a ledge (to ~101, 123, 134 and 144 m, 11.2,
 *    9.9, 8.4 and 7.3 m across), then the crenellated lantern (5.6 m) to
 *    ~154 m and its small open frame to 158 m. Widths are in the ratios of
 *    Hisgett's telephoto; heights are his photo's divisions corrected
 *    roughly for its upward view, so they are estimates.
 *  - colour: white glazed terracotta, the palette stone with trim for the
 *    copings and the lantern; windows the palette window.
 *
 * Photos (Wikimedia Commons): Mather_Tower,_Chicago_in_May_2016.jpg
 * (MusikAnimal, CC BY-SA 4.0); Chicago_Buildings_15_(15430932830).jpg and
 * 15a (Tony Hisgett, CC BY 2.0); Mather_Tower_(9043777245).jpg (Teemu008,
 * CC BY-SA 2.0); Mather_Tower_3.JPG (Thshriver, CC BY-SA 3.0); Mather
 * Tower.jpg (Antoine Taveneaux, CC BY-SA 3.0). No commercial imagery.
 *
 * Left out: the Gothic tracery and the octagon's buttress piers, the cast
 * iron of the shopfronts.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { block, chamfer, panel, parapetRoof, rect, rows, save, walls, type XY } from './chi-aon-center'

const stone = new Part(), trim = new Part(), win = new Part(), roof = new Part()

const HX = 15.2, HY = 10.3, SLAB = 88
const OX = -1.9, OY = -0.95 // octagon centre, from OSM
const TOP = 158

/** A regular octagon, flats facing the axes, `w` across the flats. */
const oct = (w: number): XY[] => Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 8 + (i * Math.PI) / 4, r = w / 2 / Math.cos(Math.PI / 8)
  return [OX + r * Math.cos(a), OY + r * Math.sin(a)] as XY
})

// Slab: the end piers stop a storey short; the middle rises to a parapet
// with three crenellated blocks a face.
const EDGE = SLAB - 4
const slab = chamfer(rect(-HX, -HY, HX, HY), 0.5)
walls(stone, slab, 0, EDGE - 1.2)
walls(trim, slab, EDGE - 1.2, EDGE)
parapetRoof(trim, roof, slab, EDGE, 0.6, 1)
const upper = chamfer(rect(-HX + 4.5, -HY + 3.5, HX - 4.5, HY - 3.5), 0.4)
walls(stone, upper, EDGE - 1, SLAB - 1.2)
walls(trim, upper, SLAB - 1.2, SLAB)
parapetRoof(trim, roof, upper, SLAB, 0.5, 0.8)
for (let i = 0; i < 4; i++) {
  const a = upper[(2 * i + 1) % upper.length], b = upper[(2 * i + 2) % upper.length] // the long edges between chamfers
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  for (const t of [0.2, 0.5, 0.8]) {
    const c: XY = [a[0] + u[0] * L * t - n[0] * 0.5, a[1] + u[1] * L * t - n[1] * 0.5]
    const w = Math.min(2.6, L * 0.18)
    const r: XY[] = [[c[0] - u[0] * w / 2 - n[0] * 0.5, c[1] - u[1] * w / 2 - n[1] * 0.5], [c[0] + u[0] * w / 2 - n[0] * 0.5, c[1] + u[1] * w / 2 - n[1] * 0.5],
      [c[0] + u[0] * w / 2 + n[0] * 0.5, c[1] + u[1] * w / 2 + n[1] * 0.5], [c[0] - u[0] * w / 2 + n[0] * 0.5, c[1] - u[1] * w / 2 + n[1] * 0.5]]
    block(trim, trim, r, SLAB - 0.5, SLAB + 2.2, 0.2)
  }
}
// The slab's windows: three tall bays in the middle of each face, pairs of
// windows in three-storey groups, and single windows in the end piers.
const groups = rows(7, EDGE - 2, 8, 1.4)
const faces: [XY, XY][] = [[[-HX, -HY], [HX, -HY]], [[HX, -HY], [HX, HY]], [[HX, HY], [-HX, HY]], [[-HX, HY], [-HX, -HY]]]
for (const [a, b] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), end = L * 0.2
  const bay = (L - 2 * end) / 3
  for (let k = 0; k < 3; k++) for (const [z0, z1] of groups) panel(win, a, b, end + k * bay + 1.0, end + (k + 1) * bay - 1.0, z0, z1)
  for (const s of [end * 0.5, L - end * 0.5]) for (const [z0, z1] of groups) panel(win, a, b, s - 0.5, s + 0.5, z0 + 1, z1 - 1)
  panel(win, a, b, end, L - end, 0.6, 5.6)
}
// Corner pinnacles on the end piers.
for (const [x, y] of [[-HX, -HY], [HX, -HY], [HX, HY], [-HX, HY]]) {
  const cx = x - Math.sign(x) * 1.0, cy = y - Math.sign(y) * 1.0
  block(trim, trim, chamfer(rect(cx - 1, cy - 1, cx + 1, cy + 1), 0.3), EDGE - 0.5, EDGE + 3.5, 0.3)
}

// Octagon: four stages, each tapering slightly and set back from the one
// below at a trim ledge, then the crenellated lantern.
const STAGES: [number, number, number][] = [ // z0, z1, width across the flats at the foot
  [SLAB - 1, 101, 11.2], [101, 123, 9.9], [123, 134, 8.4], [134, 144, 7.3],
]
/** A window panel on flat i of a tapering octagon stage, centred, `w` wide. */
function flatPanel(i: number, z0: number, z1: number, wa: number, wb: number, Z0: number, Z1: number, w: number) {
  const at = (z: number, s: number): V3 => {
    const t = (z - Z0) / (Z1 - Z0), o = oct(wa + (wb - wa) * t), j = (i + 1) % 8
    const m: XY = [(o[i][0] + o[j][0]) / 2, (o[i][1] + o[j][1]) / 2], d: XY = [o[j][0] - o[i][0], o[j][1] - o[i][1]]
    const L = Math.hypot(d[0], d[1]), nx = m[0] - OX, ny = m[1] - OY, nl = Math.hypot(nx, ny)
    return [m[0] + d[0] / L * s * w / 2 + nx / nl * 0.06, m[1] + d[1] / L * s * w / 2 + ny / nl * 0.06, z]
  }
  win.quad(at(z0, -1), at(z0, 1), at(z1, 1), at(z1, -1))
}
for (const [k, [z0, z1, w]] of STAGES.entries()) {
  const wt = w * 0.95
  walls(stone, oct(w), z0, z1 - 0.8, oct(wt))
  // Ledge: a trim band, then in to the next stage's foot.
  const next = STAGES[k + 1]?.[2] ?? 5.6
  walls(trim, oct(wt), z1 - 0.8, z1, oct(wt + 0.3))
  const top = oct(wt + 0.3), inner = oct(next)
  for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; trim.quad([top[i][0], top[i][1], z1], [top[j][0], top[j][1], z1], [inner[j][0], inner[j][1], z1], [inner[i][0], inner[i][1], z1]) }
  const n = Math.max(1, Math.round((z1 - z0) / 11))
  for (const [a, b] of rows(z0 + 1.5, z1 - 1.6, n, 1.4)) for (let i = 0; i < 8; i++) flatPanel(i, a, b, w, wt, z0, z1 - 0.8, Math.min(1.5, w * 0.16))
}
// Lantern: a narrow octagon with tall openings and a crenellated top, and
// the little open frame over it.
const L0 = 144, L1 = 153.5, LW = 5.6
walls(stone, oct(LW), L0, L1)
for (let i = 0; i < 8; i++) flatPanel(i, L0 + 1, L1 - 1.4, LW, LW, L0, L1, 1.1)
block(trim, null, oct(LW + 0.5), L1 - 0.4, L1 + 0.5, 0.2)
parapetRoof(trim, roof, oct(LW + 0.5), L1 + 0.5, 0.5, 0.4)
for (const [x, y] of oct(LW + 0.1)) block(trim, trim, chamfer(rect(x - 0.45, y - 0.45, x + 0.45, y + 0.45), 0.12), L1 + 0.5, L1 + 2.3, 0.15)
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const x = OX + sx * 1.1, y = OY + sy * 1.1
  block(trim, trim, chamfer(rect(x - 0.3, y - 0.3, x + 0.3, y + 0.3), 0.08), L1 + 0.5, TOP - 0.6, 0.1)
}
block(trim, trim, chamfer(rect(OX - 1.45, OY - 1.45, OX + 1.45, OY + 1.45), 0.2), TOP - 0.6, TOP, 0.15)

await save('chi-mather-tower', 'Mather Tower', [41.887616, -87.625442], 34.9, [
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
])
