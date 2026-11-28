/**
 * The Driskill (1886, Jasper N. Preston & Son, Romanesque Revival), 604
 * Brazos Street at East 6th Street, Austin — procedural, CC0-1.0, no
 * textures.
 *   bun generators/atx-driskill-hotel.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 17.5, the downtown
 * grid, so +x is the Brazos Street front (east-south-east), -y the 6th
 * Street front (south-south-west), -x the west side over the parking lot,
 * and +y the north side against the 1929 tower annex (a separate building,
 * not modelled). Anchor = area centroid of OSM way/313917989, -97.741715,
 * 30.268115. z = 0 is the lowest ground under the footprint, the 6th
 * Street sidewalk at the south-east corner; the ground rises about 1.8 m
 * to the north along Brazos (lidar ground), so the north ends of the side
 * walls run further down.
 *
 * Identity: a four-storey block of buff-pink brick banded in white
 * limestone; on Brazos and on 6th Street a central pavilion with a
 * two-storey columned porch carrying a balcony, a big round-arched loggia
 * on the top floor and a steep stone-coped gable ("THE DRISKILL") rising
 * over the roofline; smaller gables over pavilions either side; stacked
 * corner balconies; rows of round-arched windows in white surrounds, big
 * arches on the ground floor; a heavy white cornice. The busts of the
 * Driskill brothers are left out, as asked; the name band is a plain
 * stone band (no lettering).
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame with tools/lidar_frame.py; heights
 * over the base):
 *  - walls x -23.7..23.9, y -26.6..26.4 (OSM outline; lidar edges agree
 *    within half a metre; OSM's chamfered corners are where the corner
 *    balconies are); main parapet 21.5 (lidar 21.3-22.0);
 *  - the cross roof over y -3..9 from the west wall to Brazos, ridge 27.6,
 *    and the Brazos gable centred at y = 3, apex 29.5 on the face (lidar
 *    29.5); the 6th Street gable centred at x = 1, x -5..7, its roof back
 *    to y = -12, apex on the face 29.5 (lidar 29.0-30.8 with the finial);
 *  - the porches: Brazos x 23.9..29, y -4.5..11; 6th Street y -26.6..-29.5,
 *    x -4.5..6.5; top of the balustrade 12.5 (lidar 12.4-12.6);
 *  - the court on the north side x -8.5..8.5, y 13..26.4, roof 14.4 (lidar
 *    13.9-15.3);
 *  - the side pavilions' small gables, apex 25 (lidar 23.6-24.4 on the
 *    coarse grid); positions from "highsmith" (symmetric about the centre
 *    gable);
 *  - floor lines 6.6, 12.0, 16.4, cornice 19.8-21.5; windows' widths and
 *    heads: scaled on "highsmith" (14.2 px a metre at the facade), the
 *    camera's height makes the storey heights good to about half a metre;
 *  - colours from "highsmith" (overcast; brick #877b71, stone bands,
 *    slate #9a9c9f), pulled to the palette's lightness: brick #bca197,
 *    limestone the palette `trim`.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *  highsmith "The historic Driskill Hotel in downtown Austin, Texas. A
 *            Romanesque-style building completed in 1886...", Carol M.
 *            Highsmith, public domain (square on to a central-gable front)
 *            https://commons.wikimedia.org/wiki/File:The_historic_Driskill_Hotel_in_downtown_Austin,_Texas._A_Romanesque-style_building_completed_in_1886,_the_Driskill_is_one_of_the_best-known_hotels_in_Texas_LCCN2014632495.tif
 *  moore     "Driskill austin 2006.jpg", Larry D. Moore, CC BY 4.0 (along
 *            6th Street from the west: porch, arcade, corner gable)
 *            https://commons.wikimedia.org/wiki/File:Driskill_austin_2006.jpg
 *  d67       "Driskill Hotel - Austin, Texas - DSC09367.jpg", Daderot, CC0
 *            (the corner balconies)
 *            https://commons.wikimedia.org/wiki/File:Driskill_Hotel_-_Austin,_Texas_-_DSC09367.jpg
 *  zirkel    "Driskill Hotel Exterior.jpg", Kenneth C. Zirkel, CC BY-SA 3.0
 *            https://commons.wikimedia.org/wiki/File:Driskill_Hotel_Exterior.jpg
 *  henderson "Driskill Hotel, Austin, Texas (8511756450).jpg", Nicolas
 *            Henderson, CC BY 2.0 (a long front and its corner)
 *            https://commons.wikimedia.org/wiki/File:Driskill_Hotel,_Austin,_Texas_(8511756450).jpg
 * Also OSM (ODbL) and the lidar. No look-only sources, no commercial imagery.
 *
 * Replaces way/313917989 (the 1929 annex to the north is its own OSM way
 * and is not drawn).
 *
 * Doubts: the west side (over the parking lot) and the north court are
 * not photographed: their windows are the same paired arches at the same
 * floors; the west wall's gable is a plain gable end. The white banding of
 * the brick between the floor lines is left out (it would shimmer); only
 * the floor belts and the window surrounds are drawn.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, prism, save, type XY } from './atl-flatiron-building'
import { flush, opening, gableRoof } from './atx-governors-mansion'

const brick = new Part(), stone = new Part(), roof = new Part(), win = new Part(), door = new Part()

const X0 = -23.7, X1 = 23.9, Y0 = -26.6, Y1 = 26.4
const TOP = 21.5, CORN = 19.8, FL = [6.6, 12.0, 16.4]
/** Ground over the base along the walls: rises to the north. */
const g = (y: number) => 0.4 + 1.6 * Math.max(0, Math.min(1, (y - Y0) / (Y1 - Y0)))

// ── the block: two wings and the south bar round the low court on the north ──
const CX0 = -8.5, CX1 = 8.5, CY = 13
prism(brick, [[X0, Y0], [X1, Y0], [X1, Y1], [CX1, Y1], [CX1, CY], [CX0, CY], [CX0, Y1], [X0, Y1]], 0, CORN, null, 0)
// the cornice: a white band projecting 0.35, the parapet over it, the flat roof
prism(stone, [[X0 - 0.35, Y0 - 0.35], [X1 + 0.35, Y0 - 0.35], [X1 + 0.35, Y1 + 0.35], [CX1 - 0.35, Y1 + 0.35], [CX1 - 0.35, CY - 0.35], [CX0 + 0.35, CY - 0.35], [CX0 + 0.35, Y1 + 0.35], [X0 - 0.35, Y1 + 0.35]], CORN, CORN + 0.7, null, 0.2, true)
prism(brick, [[X0, Y0], [X1, Y0], [X1, Y1], [CX1, Y1], [CX1, CY], [CX0, CY], [CX0, Y1], [X0, Y1]], CORN + 0.7, TOP - 0.3, null, 0)
prism(stone, [[X0 - 0.15, Y0 - 0.15], [X1 + 0.15, Y0 - 0.15], [X1 + 0.15, Y1 + 0.15], [CX1 - 0.15, Y1 + 0.15], [CX1 - 0.15, CY - 0.15], [CX0 + 0.15, CY - 0.15], [CX0 + 0.15, Y1 + 0.15], [X0 - 0.15, Y1 + 0.15]], TOP - 0.3, TOP, roof, 0.12)
// the court's low wing
box(brick, CX0, CX1, CY, Y1, 0, 13.8, null, 0)
box(stone, CX0 - 0.1, CX1 + 0.1, CY, Y1 + 0.1, 13.8, 14.4, roof, 0.12)

// ── the gabled roofs ──
// the cross roof from the west wall to Brazos, and the 6th Street gable's roof
gableRoof(roof, brick, X0, X1, -3, 9, TOP, 27.6, 'x', 0.3)
gableRoof(roof, brick, -5, 7, Y0, -12, TOP, 27.6, 'y', 0.3)
/** A stone-coped gable standing on a face: a pentagon wall `t` thick, from a to b, its outside to the right. */
function pediment(a: XY, b: XY, z0: number, zs: number, apex: number, t = 0.5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number, d: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
  const ring: [number, number][] = [[0, z0], [L, z0], [L, zs], [L / 2, apex], [0, zs]]
  for (const [d, out] of [[0.05, true], [-t, false]] as const) {
    const pts = ring.map(([s, z]) => P(s, z, d))
    const c = P(L / 2, (z0 + zs) / 2, d)
    for (let i = 0; i < 5; i++) {
      const p0 = pts[i], p1 = pts[(i + 1) % 5]
      if (out) brick.tri(c, p0, p1)
      else brick.tri(c, p1, p0)
    }
  }
  // the sides and the stone coping up the rakes
  for (let i = 0; i < 5; i++) {
    const [s0, z0_] = ring[i], [s1, z1_] = ring[(i + 1) % 5]
    if (i === 0) continue
    const part = i === 2 || i === 3 ? stone : brick
    const w = i === 2 || i === 3 ? 0.35 : 0
    part.quad(P(s0, z0_ + w, 0.15), P(s0, z0_ + w, -t - 0.1), P(s1, z1_ + w, -t - 0.1), P(s1, z1_ + w, 0.15))
    if (w) {
      part.quad(P(s0, z0_, 0.15), P(s1, z1_, 0.15), P(s1, z1_ + w, 0.15), P(s0, z0_ + w, 0.15))
      part.quad(P(s1, z1_, -t - 0.1), P(s0, z0_, -t - 0.1), P(s0, z0_ + w, -t - 0.1), P(s1, z1_ + w, -t - 0.1))
    }
  }
  // the name band at the gable's foot, and the finial
  flush(stone, a, b, 0.4, L - 0.4, zs - 1.3, zs - 0.3, 0.1)
  const top = P(L / 2, apex, -t / 2)
  box(stone, top[0] - 0.2, top[0] + 0.2, top[1] - 0.2, top[1] + 0.2, apex - 0.2, apex + 1.3, stone, 0.1)
}

// ── a front: belts, windows by floor, pavilions ──
type Bay = 'pair' | 'triple' | 'corner'
/**
 * One face from a to b (outside to the right), centre `c` metres from a;
 * `bays` are offsets either side of the centre (mirrored) and their kind;
 * `centre` draws the porch pavilion's openings, the gables and the porch.
 */
function front(a: XY, b: XY, c: number, bays: [number, Bay][], centre: number | null, gy: (s: number) => number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // the white floor belts
  for (const z of FL) flush(stone, a, b, 0, L, z - 0.2, z + 0.25, 0.07)
  // the white impost bands at the arches' springing, one a floor ("highsmith")
  for (const z of [4.9, 10.4, 14.9, 18.6]) flush(stone, a, b, 0, L, z - 0.15, z + 0.15, 0.07)
  const arch = (s: number, w: number, z0: number, zs: number) => {
    const seg = w > 2 ? 8 : 6
    opening(stone, a, b, s, w + 0.5, z0 - 0.15, zs, 'round', 0.05, seg)
    opening(win, a, b, s, w, z0, zs, 'round', 0.09, seg)
  }
  const floors = (s: number, kind: Bay) => {
    const gs = gy(s)
    // the ground floor: one big round arch
    if (kind !== 'corner') arch(s, 2.6, gs + 0.9, 4.9)
    else opening(win, a, b, s, 1.2, gs + 0.9, 5.2, 'round', 0.09)
    const n = kind === 'triple' ? 3 : kind === 'pair' ? 2 : 1, w = kind === 'triple' ? 0.9 : 1.05, gap = 0.4
    for (let k = 0; k < n; k++) {
      const sk = s + (k - (n - 1) / 2) * (w + gap)
      arch(sk, w, 7.6, 10.4)
      arch(sk, w, 12.9, 14.9)
      arch(sk, w * 0.9, 17.1, 18.6)
    }
  }
  for (const [d, kind] of bays) {
    for (const s of [c - d, c + d]) if (s > 0.8 && s < L - 0.8) floors(s, kind)
  }
  if (centre === null) return
  const w = centre // half width of the pavilion
  // behind the porch: three arched doorways, three tall windows over them
  for (const k of [-1, 0, 1]) {
    const s = c + k * 3.3
    opening(stone, a, b, s, 2.6, gy(s) + 0.6, 4.5, 'round', 0.05)
    opening(door, a, b, s, 2.1, gy(s) + 0.7, 4.5, 'round', 0.09)
    opening(win, a, b, s, 1.6, 7.4, 10.6, 'round', 0.09)
  }
  // third floor: a row of five windows; fourth: the big loggia arch between two smaller ones
  for (let k = -2; k <= 2; k++) opening(win, a, b, c + k * 2.2, 1.3, 12.9, 15.4, 'flat', 0.09)
  arch(c, 3.6, 16.9, 18.0)
  for (const k of [-1, 1]) arch(c + k * 3.6, 1.6, 17.0, 18.6)
  // the fourth-floor balcony across the pavilion over the porch, and the
  // stone piers framing the pavilion, capped over the cornice ("highsmith")
  const P = (sv: number, d: number): XY => [a[0] + (b[0] - a[0]) / L * sv + (b[1] - a[1]) / L * d, a[1] + (b[1] - a[1]) / L * sv - (b[0] - a[0]) / L * d]
  {
    const q0 = P(c - w + 1, 0), q1 = P(c + w - 1, 1.3)
    const bx0 = Math.min(q0[0], q1[0]), bx1 = Math.max(q0[0], q1[0]), by0 = Math.min(q0[1], q1[1]), by1 = Math.max(q0[1], q1[1])
    box(stone, bx0, bx1, by0, by1, FL[2] - 0.4, FL[2], stone, 0.1, true)
    const r0 = P(c - w + 1, 1.1), r1 = P(c + w - 1, 1.3)
    box(stone, Math.min(r0[0], r1[0]), Math.max(r0[0], r1[0]), Math.min(r0[1], r1[1]), Math.max(r0[1], r1[1]), FL[2], FL[2] + 1.0, stone, 0.06)
    for (const sv of [c - w + 0.5, c + w - 0.5]) {
      const p0 = P(sv - 0.5, -0.2), p1 = P(sv + 0.5, 0.6)
      box(stone, Math.min(p0[0], p1[0]), Math.max(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.max(p0[1], p1[1]), FL[1], 24.2, stone, 0.2)
    }
  }
  // the gable over the pavilion
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  pediment([a[0] + u[0] * (c - w), a[1] + u[1] * (c - w)], [a[0] + u[0] * (c + w), a[1] + u[1] * (c + w)], CORN, 23.4, 29.5)
}
/** The small gable over a side pavilion, with its little roof running back. */
function sideGable(a: XY, b: XY, s: number, w: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const p0: XY = [a[0] + u[0] * (s - w / 2), a[1] + u[1] * (s - w / 2)], p1: XY = [a[0] + u[0] * (s + w / 2), a[1] + u[1] * (s + w / 2)]
  pediment(p0, p1, CORN, 22.3, 25.2, 0.4)
}

// the Brazos front (x = X1, from south to north), centred at y = 3
front([X1, Y0], [X1, Y1], 3 - Y0, [[9.6, 'pair'], [13.6, 'triple'], [17.6, 'pair'], [21.2, 'pair']], 6, g)
for (const d of [-13.6, 13.6]) sideGable([X1, Y0], [X1, Y1], 3 - Y0 + d, 4.6)
// the 6th Street front (y = Y0, from west to east), centred at x = 1
front([X0, Y0], [X1, Y0], 1 - X0, [[9.3, 'pair'], [13.3, 'triple'], [17.3, 'pair']], 6, () => 0.4)
for (const d of [-13.3, 13.3]) sideGable([X0, Y0], [X1, Y0], 1 - X0 + d, 4.4)
// the west side (y = Y1 to Y0) and the north faces: paired arches, no pavilions
front([X0, Y1], [X0, Y0], Y1 - 3, [[4.5, 'pair'], [9.5, 'pair'], [14.5, 'pair'], [19.5, 'pair']], null, (s) => g(Y1 - s))
front([X1, Y1], [CX1, Y1], (X1 - CX1) / 2, [[0, 'pair'], [5, 'pair']], null, () => 2.0)
front([CX0, Y1], [X0, Y1], (CX0 - X0) / 2, [[0, 'pair'], [5, 'pair']], null, () => 2.0)

// ── the porches: two storeys of white columns, a balcony on each floor ──
function porch(x0: number, x1: number, y0: number, y1: number, alongX: boolean, gz: number) {
  const D = 11.4
  // columns: four across the front, one back at each side
  const cols: XY[] = []
  if (alongX) {
    const yf = y0 + 0.45
    for (const t of [0, 1 / 3, 2 / 3, 1]) cols.push([x0 + 0.45 + t * (x1 - x0 - 0.9), yf])
  } else {
    const xf = x1 - 0.45
    for (const t of [0, 1 / 3, 2 / 3, 1]) cols.push([xf, y0 + 0.45 + t * (y1 - y0 - 0.9)])
  }
  for (const [x, y] of cols) {
    box(stone, x - 0.35, x + 0.35, y - 0.35, y + 0.35, gz, D, null, 0.12)
    box(stone, x - 0.5, x + 0.5, y - 0.5, y + 0.5, gz, gz + 0.8, stone, 0.1) // the base
  }
  // the floor at the steps, the second-floor balcony and the roof deck, each slab with a balustrade band
  box(stone, x0, x1, y0, y1, 0, gz + 0.3, stone, 0.1)
  for (const z of [FL[0] - 0.3, D]) {
    box(stone, x0, x1, y0, y1, z - 0.5, z, stone, 0.12, true)
    const rail = 1.0
    if (alongX) {
      box(stone, x0, x1, y0, y0 + 0.2, z, z + rail, stone, 0.06)
      box(stone, x0, x0 + 0.2, y0, y1, z, z + rail, stone, 0.06)
      box(stone, x1 - 0.2, x1, y0, y1, z, z + rail, stone, 0.06)
    } else {
      box(stone, x1 - 0.2, x1, y0, y1, z, z + rail, stone, 0.06)
      box(stone, x0, x1, y0, y0 + 0.2, z, z + rail, stone, 0.06)
      box(stone, x0, x1, y1 - 0.2, y1, z, z + rail, stone, 0.06)
    }
  }
}
porch(X1, 29, -4.5, 10.5, false, g(3))
porch(-4.5, 6.5, -29.5, Y0, true, 0.4)

// ── the stacked corner balconies ──
function cornerBalconies(cx: number, cy: number, sx: number, sy: number) {
  for (const z of FL) {
    const xa = cx - sx * 2.0, xb = cx + sx * 1.4, ya = cy - sy * 2.0, yb = cy + sy * 1.4
    box(stone, Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), z - 0.4, z, stone, 0.1, true)
    // the balustrade along the two outer sides
    const ox = cx + sx * 1.4, oy = cy + sy * 1.4
    box(stone, Math.min(ox, ox - sx * 0.2), Math.max(ox, ox - sx * 0.2), Math.min(ya, yb), Math.max(ya, yb), z, z + 1.0, stone, 0.06)
    box(stone, Math.min(xa, xb), Math.max(xa, xb), Math.min(oy, oy - sy * 0.2), Math.max(oy, oy - sy * 0.2), z, z + 1.0, stone, 0.06)
  }
  // a stone pier over the corner, capped above the parapet
  box(stone, Math.min(cx, cx - sx * 1.2), Math.max(cx, cx - sx * 1.2), Math.min(cy, cy - sy * 1.2), Math.max(cy, cy - sy * 1.2), TOP - 0.2, TOP + 1.6, stone, 0.2)
}
cornerBalconies(X1, Y0, 1, -1)
cornerBalconies(X1, Y1, 1, 1)
cornerBalconies(X0, Y0, -1, -1)

if (import.meta.main) {
  await save('atx-driskill-hotel', 'The Driskill', [
    { part: brick, material: finish('driskill-brick', 0xbca197) },
    { part: stone, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 17.5, replaces: ['way/313917989'] }, 6500)
}
