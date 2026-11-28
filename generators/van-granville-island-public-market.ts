/**
 * Granville Island Public Market, Vancouver (sheds from 1917 and later;
 * converted to the market in 1979) — procedural, CC0-1.0.
 * bun generators/van-granville-island-public-market.ts
 *
 * The cluster of corrugated industrial sheds that became the market: the
 * gabled sheds with their gable ends to Johnston Street, the long
 * north-west shed and the two tall sheds with clerestory monitors along
 * their ridges, the lower gabled infill and the two-storey flat block
 * between them, the red-roofed pavilion and the glass entrance at the plaza
 * end; the green-and-white and blue-and-white striped awnings along the
 * street; and the "GRANVILLE ISLAND PUBLIC MARKET" sign: cream slab-serif
 * capitals on both faces of a dark plank board on brackets over the north-west shed, with
 * its row of gooseneck lamps.
 *
 * Frame: x across (east'), y along (north'), z up, metres, turned to
 * bearing 50.3 (the sheds' walls run at 50.3° and 140.3°; +y points to the
 * water, -y to Johnston Street). Origin at the centre of the complex's
 * extents.
 *
 * Evidence
 *  - OSM: site relation/7071553 (Q114841864) with the market's buildings
 *    way/480330054 (start_date 1917), way/27926613 and way/1526558935; the
 *    same lidar building also covers way/1456059708, way/1526558936 and the
 *    street canopy way/962460810 (building=roof), so the model draws and
 *    replaces all six.
 *  - Heights: City of Vancouver building footprints 2009 (City 2009 lidar;
 *    Contains information licensed under the Open Government Licence –
 *    Vancouver), building 132644, base 3.6 m: roof facets (above the base)
 *    7.4 (the long north-west shed, ridge), 4.2 (its low north-west side),
 *    8.1 (the flat two-storey block), 8.5 (the two gabled sheds at x 10–19
 *    and 28–36), 7.2 (the red-roofed pavilion), 5.7 and 4.7 (the lower
 *    infill, drawn as low gables as the photos show them), 4.7 (the glass
 *    entrance), 4.3 (the north end over the dock). MEASURED. Eaves and the
 *    monitors' size: ESTIMATED from photos 1 and 3.
 *  - Photos (EVIDENCE):
 *    1. "Granvill Island's Public Market", La Citta Vita (Flickr 7802578648),
 *       CC BY-SA 2.0: from the Granville Street Bridge: the sheds' roofs and
 *       monitors, the awnings along Johnston Street (blue and white at the
 *       plaza end, green and white beyond), the red pavilion and glass
 *       entrance at the plaza, the sign at the far end.
 *    2. "Granville Island Public Market", niftyniall (Flickr 14595723898),
 *       CC BY-SA 2.0: the same from higher up.
 *    3. "Granville Island Public Market 1.jpg", Ymblanter (Commons), CC BY-SA
 *       4.0: the sign, its lamps, a gable end, the green awnings.
 *    4. "granville island public market sign", Fairview Condo (Flickr
 *       4096867815), CC BY-SA 2.0: the whole sign square-on: the letters
 *       traced from it (bold slab-serif capitals, cap height about half the
 *       board), the plank board, the brackets, two rows of gooseneck lamps.
 *    5. "Granville Island Public Market 2015.jpg", Jay Esplana (Commons), CC
 *       BY 4.0 (night): the sign lit, the corner entrance.
 *  - Mapterhorn: 3.6–3.9 m under the floor, falling to 1.3 m at the sea
 *    wall by the water-side corner; the map stands the model on that low
 *    point, so the floor is built 2.9 m up (the fill reads up to 2.6 under
 *    it) on a plinth whose walls run down to it (FLOOR). Elevation 0.
 *
 * Materials (six): the sheds' grey corrugated walls; cream (the pale roofs
 * as the aerial photos show them, the letters, the awnings' white stripes,
 * trim);
 * barn red (the pavilion roof, the sign board, doors and posts: one muted
 * red-brown for the red roof and the dark-brown board); awning green; blue
 * (`window-2`: the blue awnings, the shopfront and monitor glazing, lit
 * at night); the sign's `lamp`s.
 *
 * Doubts: the sign's length (32 m) and station are estimated from photo 1;
 * its board is drawn red-brown, a little redder than the real dark-brown
 * planks, to keep to six materials; the water side and the north-west side
 * are seen only from far off; the skylight stripes on the roofs are left
 * out; the Granville Street Bridge passing overhead to the east is not drawn.
 *
 * Night: the sign's lamps (`lamp`), the shopfronts and blue awnings
 * (`window-2`).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { box, type Skin } from './sf-golden-gate-bridge'
import { bead } from './bridge-kit'
import { Pen, strokes, type Pt } from './lettering'
import { finish, windowVariant } from './palette'

const OX = 5.6, OY = -1.8          // the extents' centre in the survey frame
const wall = new Part(), cream = new Part(), red = new Part(), green = new Part(), blue = new Part(), lamp = new Part()
const W: Skin = () => wall
const n3 = (v: V3): V3 => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l] }
/** A quad facing n (Part.tri winds to agree with explicit normals). */
function quad(p: Part, q: V3[], n: V3) {
  const m = n3(n)
  p.tri(q[0], q[1], q[2], undefined, undefined, undefined, [m, m, m])
  p.tri(q[0], q[2], q[3], undefined, undefined, undefined, [m, m, m])
}
const at = (x: number, y: number, z: number): V3 => [x - OX, y - OY, z]

/**
 * A gabled shed, ridge along y, from survey-frame x0..x1, y0..y1: walls to
 * the eave, gable ends, a corrugated roof with a 0.4 m overhang, and with
 * `monitor` a raised clerestory monitor along the ridge.
 */
function shed(x0: number, x1: number, y0: number, y1: number, eave: number, ridge: number, rp: Part = cream, monitor = 0) {
  box(W, x0 - OX, x1 - OX, y0 - OY, y1 - OY, 0, eave, { r: 0, bottom: false })
  const xm = (x0 + x1) / 2, o = 0.4, drop = ((ridge - eave) / ((x1 - x0) / 2)) * o
  for (const y of [y0, y1]) {
    const s = y === y0 ? -1 : 1
    wall.tri(at(x0, y, eave), at(x1, y, eave), at(xm, y, ridge), undefined, undefined, undefined, [[0, s, 0], [0, s, 0], [0, s, 0]])
  }
  for (const [xa, sgn] of [[x0, -1], [x1, 1]] as [number, number][]) {
    const xe = xa + sgn * o
    const q = [at(xe, y0 - o, eave - drop), at(xe, y1 + o, eave - drop), at(xm, y1 + o, ridge), at(xm, y0 - o, ridge)]
    quad(rp, q, [sgn * (ridge - eave), 0, (x1 - x0) / 2])
    quad(rp, [q[0], q[3], q[2], q[1]], [-sgn * (ridge - eave), 0, -(x1 - x0) / 2])
  }
  if (monitor > 0) {
    // The monitor: low glazed sides (a cream band) under its own shallow gable.
    const hw = monitor / 2, ya = y0 + 2.5, yb = y1 - 2.5
    const zr = ridge - ((ridge - eave) * hw) / ((x1 - x0) / 2), zt = ridge + 1.0, zp = zt + 0.6
    box(W, xm - hw - OX, xm + hw - OX, ya - OY, yb - OY, zr, zt, { r: 0, bottom: false })
    for (const s of [-1, 1]) quad(blue, [at(xm + s * (hw + 0.03), ya + 0.4, zr + 0.25), at(xm + s * (hw + 0.03), yb - 0.4, zr + 0.25), at(xm + s * (hw + 0.03), yb - 0.4, zt - 0.15), at(xm + s * (hw + 0.03), ya + 0.4, zt - 0.15)].map((p, i) => s > 0 ? p : [p[0], p[1], p[2]]) as V3[], [s, 0, 0])
    for (const s of [-1, 1]) {
      const q = [at(xm + s * (hw + 0.3), ya - 0.3, zt - 0.1), at(xm + s * (hw + 0.3), yb + 0.3, zt - 0.1), at(xm, yb + 0.3, zp), at(xm, ya - 0.3, zp)]
      quad(cream, q, [s * 0.6, 0, hw + 0.3])
      quad(cream, [q[0], q[3], q[2], q[1]], [-s * 0.6, 0, -(hw + 0.3)])
    }
    for (const y of [ya - 0.3, yb + 0.3]) {
      const s = y < (ya + yb) / 2 ? -1 : 1
      wall.tri(at(xm - hw - 0.3, y, zt - 0.1), at(xm + hw + 0.3, y, zt - 0.1), at(xm, y, zp), undefined, undefined, undefined, [[0, s, 0], [0, s, 0], [0, s, 0]])
    }
  }
}
/** A flat-roofed block. */
function flat(x0: number, x1: number, y0: number, y1: number, h: number) {
  box(W, x0 - OX, x1 - OX, y0 - OY, y1 - OY, 0, h - 0.35, { r: 0, bottom: false })
  box(() => cream, x0 - OX - 0.1, x1 - OX + 0.1, y0 - OY - 0.1, y1 - OY + 0.1, h - 0.35, h, { r: 0, bottom: true })
}

// ---- The sheds (City 2009 lidar heights above the floor) -----------------------------
shed(-38.0, -15.4, -40.9, 20.4, 4.4, 7.6, cream, 4.0)    // the long north-west shed and its monitor
shed(-30.5, -20.5, 20.4, 38.9, 3.0, 4.3)                // its north end over the dock
shed(-15.4, -3.0, -15.2, 23.5, 3.6, 5.6)                // the lower sheds between
shed(-3.0, 9.6, -15.2, 23.5, 3.6, 5.6)
flat(-11.8, 2.3, -40.6, -15.2, 8.1)                     // the two-storey block
shed(2.3, 9.6, -40.6, -15.2, 3.6, 5.2)
shed(9.6, 19.1, -40.5, -3.3, 5.6, 8.5, cream, 3.0)       // tall gabled shed with monitor
shed(19.1, 27.7, -40.6, -3.5, 4.4, 6.4)                 // the gabled infill
shed(27.7, 36.0, -40.7, -3.5, 5.6, 8.5, cream, 3.0)      // tall gabled shed with monitor
shed(9.6, 27.0, -3.5, 10.4, 4.0, 6.2)                   // the water-side sheds
shed(27.0, 44.8, -3.5, 10.4, 4.0, 6.2)
shed(36.0, 51.2, -35.9, -4.7, 5.0, 7.4, red)            // the red-roofed pavilion at the plaza
// The glass entrance at the plaza corner: a glazed gable (blue-grey glass) on a low frame.
box(W, 36.0 - OX, 51.1 - OX, -40.8 - OY, -35.9 - OY, 0, 0.6, { r: 0, bottom: false })
{
  const [x0, x1, y0, y1, e, r] = [36.0, 51.1, -40.8, -35.9, 3.6, 4.9]
  for (const [a, b, c, d, n] of [
    [at(x0, y0, 0.6), at(x1, y0, 0.6), at(x1, y0, e), at(x0, y0, e), [0, -1, 0]],
    [at(x1, y0, 0.6), at(x1, y1, 0.6), at(x1, y1, e), at(x1, y0, e), [1, 0, 0]],
    [at(x0, y1, 0.6), at(x0, y0, 0.6), at(x0, y0, e), at(x0, y1, e), [-1, 0, 0]],
    [at(x0, y0, e), at(x1, y0, e), at(x1, (y0 + y1) / 2, r), at(x0, (y0 + y1) / 2, r), [0, -1, 1.6]],
    [at(x1, y1, e), at(x0, y1, e), at(x0, (y0 + y1) / 2, r), at(x1, (y0 + y1) / 2, r), [0, 1, 1.6]],
  ] as [V3, V3, V3, V3, V3][]) quad(blue, [a, b, c, d], n)
  for (const x of [x0, x1]) blue.tri(at(x, y0, e), at(x, y1, e), at(x, (y0 + y1) / 2, r), undefined, undefined, undefined, [[x === x0 ? -1 : 1, 0, 0], [x === x0 ? -1 : 1, 0, 0], [x === x0 ? -1 : 1, 0, 0]])
  // Its steel frame: cream ribs over the glass.
  for (let x = x0 + 1.5; x < x1; x += 3) box(() => cream, x - OX - 0.1, x - OX + 0.1, y0 - OY - 0.05, y0 - OY + 0.05, 0.6, e, { r: 0, bottom: false })
}

// ---- Shopfronts and doors ---------------------------------------------------------------
/** A flush panel on the wall y = yw (facing -y if s < 0), x0..x1, z0..z1. */
function onY(p: Part, yw: number, s: number, x0: number, x1: number, z0: number, z1: number) {
  const y = yw + s * 0.04
  quad(p, [at(x0, y, z0), at(x1, y, z0), at(x1, y, z1), at(x0, y, z1)], [0, s, 0])
}
function onX(p: Part, xw: number, s: number, y0: number, y1: number, z0: number, z1: number) {
  const x = xw + s * 0.04
  quad(p, [at(x, y0, z0), at(x, y1, z0), at(x, y1, z1), at(x, y0, z1)], [s, 0, 0])
}
// Johnston Street side: shopfront glazing between piers under the awnings, a red door in every other bay.
for (const [x0, x1, y] of [[-37, -16.4, -40.9], [-11, 1.5, -40.6], [10.4, 18.3, -40.5], [20, 27, -40.6], [28.5, 35.2, -40.7]]) {
  const n = Math.max(1, Math.round((x1 - x0) / 5)), w = (x1 - x0) / n
  for (let i = 0; i < n; i++) {
    const a = x0 + i * w + 0.5, b = a + w - 1.0
    if (i % 2 === 0) { onY(blue, y, -1, a, b, 0.9, 2.9) } else { onY(blue, y, -1, a, a + w * 0.45, 0.9, 2.9); onY(red, y, -1, a + w * 0.55, b, 0, 2.6) }
  }
}
onY(blue, -40.6, -1, -10.5, 1.0, 4.6, 6.8)
// Big shed doors at the water end, glazing on the water side and along the dock.
for (const [x0, x1] of [[-36, -30], [-24, -17.4]]) onY(red, 20.4, 1, x0, x1, 0, 3.6)
for (const [x0, x1] of [[12, 22], [29, 42]]) onY(blue, 10.4, 1, x0, x1, 1.0, 3.4)
onX(blue, 51.2, 1, -33, -7, 1.0, 3.8)
for (const [y0, y1] of [[-36, -22], [-18, -4], [0, 16]]) onX(blue, -38.0, -1, y0, y1, 1.0, 3.2)

// ---- Awnings along Johnston Street: green and white, then blue and white -------------------
{
  const yw = -40.6, out = 3.8, z0 = 4.0, z1 = 2.9, sw = 1.6
  for (const [a, b, col] of [[-37.5, -16, green], [-11.5, 8, green], [8, 35.5, blue]] as [number, number, Part][]) {
    const n = Math.round((b - a) / sw)
    for (let i = 0; i < n; i++) {
      const x0 = a + ((b - a) * i) / n, x1 = a + ((b - a) * (i + 1)) / n, p = i % 2 ? cream : col
      const q = [at(x0, yw - out, z1), at(x1, yw - out, z1), at(x1, yw, z0), at(x0, yw, z0)]
      quad(p, q, [0, -(z0 - z1), out])
      quad(p, [q[0], q[3], q[2], q[1]], [0, z0 - z1, -out])
      quad(p, [at(x0, yw - out, z1 - 0.45), at(x1, yw - out, z1 - 0.45), at(x1, yw - out, z1), at(x0, yw - out, z1)], [0, -1, 0])
    }
    // Red posts and rail at the awnings' front edge (photo 3).
    for (let x = a + 0.3; x < b; x += 6) box(() => red, x - OX - 0.15, x - OX + 0.15, yw - out - OY, yw - out - OY + 0.3, 0, z1, { r: 0, bottom: false })
  }
}

// ---- The sign ------------------------------------------------------------------------------------
// Bold slab-serif capitals, cap height 1, traced from photo 4: even strokes,
// short slab serifs on the stems' feet and heads, round bowls.
const SW = 0.17
type Glyph = { w: number; draw: (p: Pen) => void }
const slab = (p: Pen, pts: Pt[]) => { for (const [u, v] of pts) p.moveTo([u - 0.1, v]).lineTo([u + 0.1, v]) }
const G: Record<string, Glyph> = {
  G: { w: 0.66, draw: (p) => { p.moveTo([0.62, 0.84]).cubicTo([0.52, 1.02], [0.03, 1.04], [0.03, 0.5], 6).cubicTo([0.03, -0.05], [0.56, -0.04], [0.63, 0.12], 6).lineTo([0.63, 0.44]).lineTo([0.38, 0.44]) } },
  R: { w: 0.62, draw: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.36, 1]).cubicTo([0.62, 1], [0.62, 0.52], [0.36, 0.52], 4).lineTo([0.06, 0.52]); p.moveTo([0.3, 0.52]).lineTo([0.58, 0]); slab(p, [[0.06, 0], [0.06, 1], [0.6, 0]]) } },
  A: { w: 0.68, draw: (p) => { p.moveTo([0.02, 0]).lineTo([0.34, 1]).lineTo([0.66, 0]); p.moveTo([0.15, 0.34]).lineTo([0.53, 0.34]); slab(p, [[0.04, 0], [0.64, 0]]) } },
  N: { w: 0.66, draw: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.6, 0]).lineTo([0.6, 1]); slab(p, [[0.06, 0], [0.6, 1]]) } },
  V: { w: 0.66, draw: (p) => { p.moveTo([0.02, 1]).lineTo([0.33, 0]).lineTo([0.64, 1]); slab(p, [[0.04, 1], [0.62, 1]]) } },
  I: { w: 0.2, draw: (p) => { p.moveTo([0.1, 0]).lineTo([0.1, 1]); slab(p, [[0.1, 0], [0.1, 1]]) } },
  L: { w: 0.52, draw: (p) => { p.moveTo([0.06, 1]).lineTo([0.06, 0]).lineTo([0.5, 0]).lineTo([0.5, 0.18]); slab(p, [[0.06, 1]]) } },
  E: { w: 0.54, draw: (p) => { p.moveTo([0.5, 0.82]).lineTo([0.5, 1]).lineTo([0.06, 1]).lineTo([0.06, 0]).lineTo([0.52, 0]).lineTo([0.52, 0.18]); p.moveTo([0.06, 0.52]).lineTo([0.38, 0.52]) } },
  S: { w: 0.58, draw: (p) => { p.moveTo([0.53, 0.84]).cubicTo([0.46, 1.03], [0.04, 1.04], [0.04, 0.75], 5).cubicTo([0.04, 0.5], [0.55, 0.53], [0.55, 0.25], 5).cubicTo([0.55, -0.05], [0.09, -0.04], [0.03, 0.16], 5) } },
  D: { w: 0.66, draw: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.3, 1]).cubicTo([0.68, 1], [0.68, 0], [0.3, 0], 6).lineTo([0.06, 0]); slab(p, [[0.06, 0], [0.06, 1]]) } },
  P: { w: 0.6, draw: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.34, 1]).cubicTo([0.62, 1], [0.62, 0.46], [0.34, 0.46], 4).lineTo([0.06, 0.46]); slab(p, [[0.06, 0], [0.06, 1]]) } },
  U: { w: 0.64, draw: (p) => { p.moveTo([0.06, 1]).lineTo([0.06, 0.32]).cubicTo([0.06, -0.08], [0.58, -0.08], [0.58, 0.32], 5).lineTo([0.58, 1]); slab(p, [[0.06, 1], [0.58, 1]]) } },
  B: { w: 0.6, draw: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.32, 1]).cubicTo([0.56, 1], [0.56, 0.54], [0.32, 0.54], 4).lineTo([0.06, 0.54]); p.moveTo([0.32, 0.54]).cubicTo([0.62, 0.54], [0.62, 0], [0.32, 0], 4).lineTo([0.06, 0]); slab(p, [[0.06, 0], [0.06, 1]]) } },
  C: { w: 0.62, draw: (p) => { p.moveTo([0.58, 0.82]).cubicTo([0.5, 1.03], [0.03, 1.04], [0.03, 0.5], 6).cubicTo([0.03, -0.04], [0.5, -0.03], [0.59, 0.17], 6) } },
  M: { w: 0.82, draw: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]).lineTo([0.41, 0.15]).lineTo([0.76, 1]).lineTo([0.76, 0]); slab(p, [[0.06, 0], [0.76, 0]]) } },
  K: { w: 0.64, draw: (p) => { p.moveTo([0.06, 0]).lineTo([0.06, 1]); p.moveTo([0.58, 1]).lineTo([0.08, 0.42]); p.moveTo([0.24, 0.6]).lineTo([0.6, 0]); slab(p, [[0.06, 0], [0.06, 1], [0.58, 1], [0.6, 0]]) } },
  T: { w: 0.6, draw: (p) => { p.moveTo([0.02, 0.84]).lineTo([0.02, 1]).lineTo([0.58, 1]).lineTo([0.58, 0.84]); p.moveTo([0.3, 1]).lineTo([0.3, 0]); slab(p, [[0.3, 0]]) } },
}
function text(s: string, gap: number, space: number): { pen: Pen; width: number } {
  const pen = new Pen()
  let u = 0
  for (const ch of s) {
    if (ch === ' ') { u += space; continue }
    const g = G[ch], part = new Pen()
    g.draw(part)
    pen.add(part, u)
    u += g.w + gap
  }
  return { pen, width: u - gap }
}
{
  // The board on the north-west shed's roof, along its outer side, its face to
  // the north-west; brackets down to the roof; two rows of gooseneck lamps.
  const x = -33.0, CAP = 1.25, zb = 8.4, zt = 10.9
  const { pen, width } = text('GRANVILLE ISLAND PUBLIC MARKET', 0.12, 0.42)
  const L = width * CAP + 2.0, yc = -12.0, y0 = yc - L / 2, y1 = yc + L / 2
  const roofZ = 4.4 + ((7.6 - 4.4) * (x + 38.0)) / ((-15.4 + 38.0) / 2)
  box(() => red, x - OX - 0.2, x - OX + 0.2, y0 - OY, y1 - OY, zb, zt, { r: 0, bottom: true })
  for (let y = y0 + 1; y <= y1 - 1 + 1e-6; y += (y1 - y0 - 2) / 8) {
    box(() => red, x - OX - 0.12, x - OX + 0.12, y - OY - 0.12, y - OY + 0.12, roofZ - 0.3, zb, { r: 0, bottom: false })
    box(() => red, x - OX + 0.1, x - OX + 1.6, y - OY - 0.1, y - OY + 0.1, roofZ + 0.5, roofZ + 0.75, { r: 0, bottom: false })
  }
  // The letters on both faces: toward the plaza and the bridge (+x; photo 1
  // reads it from there) and toward the water (-x).
  const v0 = zb + (zt - zb - CAP) / 2
  strokes(cream, pen.paths, { width: SW, depth: 0.1, place: (u, v, w) => at(x + 0.2 + w * CAP, y0 + 1.0 + u * CAP, v0 + v * CAP) })
  strokes(cream, pen.paths, { width: SW, depth: 0.1, place: (u, v, w) => at(x - 0.2 - w * CAP, y1 - 1.0 - u * CAP, v0 + v * CAP) })
  // Gooseneck lamps along the top, in two staggered rows.
  for (let y = y0 + 0.8, i = 0; y < y1; y += 1.6, i++) bead(lamp, at(x - 0.5 - (i % 2) * 0.5, y, zt + 0.8 + (i % 2) * 0.35), 0.3, true)
}

// ---- The floor's plinth ------------------------------------------------------------------
// The map stands the model on the lowest ground under it, the sea wall's
// slope at the water-side corner, about 2.5 m under the market floor
// (Mapterhorn 1.3 there against 3.6–3.9 under the floor). Everything above
// is lifted by FLOOR and the outer walls run down to that ground.
const FLOOR = 2.9
for (const part of [wall, cream, red, green, blue, lamp]) for (let i = 1; i < part.pos.length; i += 3) part.pos[i] += FLOOR
for (const [x0, x1, y0, y1] of [[-38.0, -15.4, -40.9, 20.4], [-30.5, -20.5, 20.4, 38.9], [-15.4, 9.6, -15.2, 23.5], [-11.8, 9.6, -40.6, -15.2],
  [9.6, 36.0, -40.7, -3.3], [9.6, 44.8, -3.5, 10.4], [36.0, 51.2, -40.8, -4.7]]) box(W, x0 - OX, x1 - OX, y0 - OY, y1 - OY, 0, FLOOR, { r: 0, bottom: false })

// ---- Write ----------------------------------------------------------------------------------------
const parts = [
  { part: wall, material: finish('market-shed-grey', 0xa9a59b) },
  { part: cream, material: finish('market-cream', 0xf1e9d6) },
  { part: red, material: finish('market-barn-red', 0xa5503f) },
  { part: green, material: finish('awning-green', 0x3f9a63) },
  { part: blue, material: windowVariant(2, 0x5a86b8) },
  { part: lamp, material: { name: 'lamp', color: 0xe4e0d4 } },
]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
const glb = writeGlb('Granville Island Public Market', parts, { license: 'CC0-1.0', bearing: 50.3, elevation: 0 })
await Bun.write(new URL('../models/van-granville-island-public-market.glb', import.meta.url), glb)
console.log(`van-granville-island-public-market.glb: ${tris} triangles, ${glb.length} bytes`)
