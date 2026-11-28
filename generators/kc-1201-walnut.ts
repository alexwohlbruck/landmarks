/**
 * 1201 Walnut (1991, Hellmuth, Obata + Kassabaum), 1201 Walnut Street,
 * Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-1201-walnut.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/132570882, -94.5817501 39.0996080.
 * Its walls run at 2.5° / 92.5° (the downtown grid), so the bearing is 2.5
 * and the model is square to its own frame. Elevation 0.
 *
 * Identity, in order: a broad dark-blue glass slab, 40 × 48 m, rising sheer
 * from a two-storey pale granite base; the pale granite grid laid over the
 * glass, full width on the lower two-thirds and splitting into two halves
 * that step in toward the top, leaving a dark centre on every face; the
 * corners clipped above a pale ledge at ~77 m; the pale cornice line, the
 * dark attic and the low slate hipped roof.
 *
 * NOTE: the assignment called this "a pale granite tower with a gabled crown".
 * Every licensed photo shows dark blue glass with a pale grid and a low hipped
 * top; the pale gabled tower beside One Kansas City Place is Town Pavilion
 * (kc-town-pavilion). The photos and lidar win.
 *
 * Evidence
 * - OSM way/132570882 (height 130, 30 levels, Q4548077): the footprint,
 *   39.6 × 47.8 m. No building:parts. Its NW corner is cut 6.5 m at street
 *   level only; the model keeps the corners symmetric (the lidar shows the
 *   tower's corners square to within ~1.5 m).
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame (the cloud sits ~1 m east of OSM). Heights above y = 0 (the SW
 *   corner; the site rises ~2 m to the NE), measured: the glass walls'
 *   parapet 116 all round; corner ledges at 76.5 (the clipped corners above
 *   them); the attic 120.8, set in ~2.5 m; the hipped roof rising to a flat
 *   top at 128 over the middle; equipment to 129.8. Published 130 m
 *   (427 ft), 30 storeys (Wikipedia, CTBUH).
 * - Photos: "1201 Walnut-Kansas City MO.jpg" (User:Charvex, public domain;
 *   from the north up Walnut: the grid splitting into two framed halves
 *   with a dark centre toward the top, the clipped corners, the cornice and
 *   hipped roof); "1201 Walnut.jpg" (Noah Bohland, CC BY-SA 4.0; from the
 *   east-south-east: the full-width lower grid, the ledge and the stepped
 *   upper grid, the granite base); "One Kansas City Place Complex and Town
 *   Pavilion.JPG" (Baylor98, CC BY-SA 4.0; from the south-east, beside
 *   One KC Place and Town Pavilion: proportions, the colours in sun).
 * - Estimated: the grid is drawn at about half the real density (cells
 *   ~6.5 m square against the real ~4.2 × 3.9 m, one per storey), lines
 *   0.5 m, so it reads without shimmering; the step heights of the grid
 *   (photos, scaled by the 116 m parapet); the base height (8.5 m, two
 *   storeys); the hip's slope (lidar, coarse).
 * - Doubts: no photo of the west face; it is drawn like the others.
 *
 * Colours: the glass is deep navy in every photo (#2b3a5c in shade), pulled
 * light to a blue slate; the grid and base a warm pale granite (#cdc4b5 in
 * sun); the roof a grey slate; the recessed centre slot of each face a
 * darker navy (`window-2`). Night: the glass is office curtain wall, so it
 * is `window` and glows; the grid and base stay unlit.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, cap, chamfer, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

/** A pale grid of lines on wall a→b over [s0, s1] × [z0, z1]: about `cw` × `ch` cells, lines `lw` wide. */
function grid(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, cw: number, ch: number, lw = 0.5, out = 0.06) {
  const { P } = onWall(a, b)
  const n = Math.max(1, Math.round((s1 - s0) / cw)), m = Math.max(1, Math.round((z1 - z0) / ch))
  const q = (sa: number, sb: number, za: number, zb: number) => p.quad(P(sa, za, out), P(sb, za, out), P(sb, zb, out), P(sa, zb, out))
  for (let k = 0; k <= n; k++) {
    const s = s0 + (s1 - s0) * k / n
    q(Math.max(s0, s - lw / 2), Math.min(s1, s + lw / 2), z0, z1)
  }
  for (let j = 0; j <= m; j++) {
    const z = z0 + (z1 - z0) * j / m
    q(s0, s1, Math.max(z0, z - lw / 2), Math.min(z1, z + lw / 2))
  }
}

function build() {
  const glass = new Part(), granite = new Part(), slate = new Part(), slot = new Part()
  const HX = 19.7, HY = 23.8
  const BASE = 8.5, LEDGE = 76.5, PARAPET = 116, ATTIC = 120.8, TOP = 126

  // --- masses
  const plinth = chamfer(rect(-HX - 0.5, -HY - 0.5, HX + 0.5, HY + 0.5), 1.8)
  block(granite, granite, plinth, 0, BASE, 0.3)
  const lower = chamfer(rect(-HX, -HY, HX, HY), 1.4)
  walls(glass, lower, BASE, LEDGE)
  cap(granite, lower, LEDGE) // shows only at the clipped corners above
  const upper = chamfer(rect(-HX, -HY, HX, HY), 4.2)
  walls(glass, upper, LEDGE, PARAPET - 0.9)
  walls(granite, upper, PARAPET - 0.9, PARAPET) // the pale cornice line
  const lip = inset(upper, 0.6)
  walls(granite, upper, PARAPET, PARAPET, lip)
  // the dark attic, set in, and the low hipped roof to its flat top
  const attic = chamfer(rect(-HX + 2.6, -HY + 2.6, HX - 2.6, HY - 2.6), 3.2)
  cap(slate, lip, PARAPET)
  walls(glass, attic, PARAPET, ATTIC - 0.4)
  walls(granite, attic, ATTIC - 0.4, ATTIC)
  const eave = inset(attic, -0.4)
  walls(granite, attic, ATTIC, ATTIC, eave)
  const ridge = chamfer(rect(-11, -15, 11, 15), 2.8)
  // the hip: eave ring (8 corners) up to the flat top ring (8 corners)
  walls(slate, eave, ATTIC, TOP, ridge)
  cap(slate, ridge, TOP)
  block(slate, slate, rect(-4, -6, 4, 6), TOP, TOP + 2.5, 0.2) // roof equipment (lidar 129.8; the hip's top read 128 with it)

  // --- the granite grid on the four faces
  const CW = 6.5, CH = 6.6
  const faces: [XY, XY][] = [[[-HX, -HY], [HX, -HY]], [[HX, -HY], [HX, HY]], [[HX, HY], [-HX, HY]], [[-HX, HY], [-HX, -HY]]]
  for (const [a, b] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), c = L / 2
    // lower two-thirds: one grid across the face, clear of the corners
    grid(granite, a, b, 3.2, L - 3.2, BASE + 1.2, LEDGE - 1.2, CW, CH)
    // above the ledge: two halves either side of a dark centre slot, their
    // outer edges stepping in toward the top
    const g = 1.6
    const half = (o0: number, z0: number, z1: number, ch: number) => {
      grid(granite, a, b, o0, c - g, z0, z1, CW, ch)
      grid(granite, a, b, c + g, L - o0, z0, z1, CW, ch)
    }
    half(5.2, LEDGE + 1.4, 96, CH)
    half(L * 0.2, 96, 106, 5.0)
    half(L * 0.32, 106, 113.5, 7.5)
    panel(slot, a, b, c - g + 0.25, c + g - 0.25, LEDGE + 1.4, 113.5, 0.05)
  }
  return [
    { part: glass, material: { ...PALETTE.window, color: 0x4b5f87 } },
    { part: slot, material: windowVariant(2, 0x3f4f70) },
    { part: granite, material: finish('kc1201-granite', 0xddd4c5) },
    { part: slate, material: finish('kc1201-slate', 0x646b74) },
  ]
}

if (import.meta.main) await save('kc-1201-walnut', '1201 Walnut', [39.099608, -94.5817501], 2.5, build())
