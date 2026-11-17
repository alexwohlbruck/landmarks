/**
 * OBA Oosterdok (Openbare Bibliotheek Amsterdam), Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-oba.ts
 *
 * Jo Coenen's central library of 2007 on the Oosterdokseiland: a big block
 * of pale stone and glass whose south front, on the Oosterdokskade plaza,
 * is framed by two tall stone pylons (a broad one at the west corner, a
 * narrow one to the east) holding up a huge cantilevered roof canopy; under
 * it the front is pulled back behind a grid of deep red-brown window frames,
 * with a glazed, colonnaded ground floor and a white floor slab above the
 * entrance. Along the west side the floors step down in terraces.
 *
 * Note: the brief describes the canopy as facing the IJ. The photos and the
 * outline show it on the south front, over the Oosterdokskade entrance
 * plaza (the IJ is to the north, behind the ODE offices); modelled as the
 * photos show it.
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north is
 * bearing 8° (the front, edges at 98°); the canopy front faces −y (bearing
 * 188°). Anchor: the area centroid of OSM way/240467636, the library's own
 * outline.
 *
 * Evidence
 * - OSM: way/779659694 (building=college [sic], building:part, height 48,
 *   ref:bag 0363100012164964) is the BAG outline of the whole block, the
 *   library and the TomTom/ODE offices to the north (way/453809679 and its
 *   parts 1487606296–98, which stay on the map). way/240467636 is the
 *   library's part; ways 1487606300–1487606311 are its floor parts.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012164964, LoD2.2 from AHN lidar, sampled on a 2 m grid in this
 *   frame (ground NAP +1.82). Measured: the main roof 41.6 for the front
 *   half (y < −6) and 45.1 behind, with a 46.5 rooftop block in the middle;
 *   the front strip y −28…−34 at 36.6 (the canopy's top); along the west
 *   side a terrace at 24.8 (about 4 m wide) and a podium at 8.7 (about 6 m
 *   wide). The ODE part's roof is corrupt in 3D BAG and not used.
 * - Published: architect Jo Coenen, opened 7 July 2007; ten floors open to
 *   the public with the restaurant on the seventh (nl.wikipedia "Openbare
 *   Bibliotheek Amsterdam").
 * - Photos (Wikimedia Commons, all EVIDENCE, all Txllxt TxllxT unless noted):
 *   - "Amsterdam - Oosterdokskade - Amsterdam Public Library 2007 by Jo
 *     Coenen - Conservatorium van Amsterdam 2008 by Frits van Dongen 01.jpg"
 *     to "… 05.jpg", CC BY-SA 4.0 — the front from the plaza (wide-angle):
 *     pylons, canopy, the red frame grid, the colonnade and white slab.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Oosterdokskade_-_Amsterdam_Public_Library_2007_by_Jo_Coenen_-_Conservatorium_van_Amsterdam_2008_by_Frits_van_Dongen_05.jpg
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_-_Oosterdokskade_-_Amsterdam_Public_Library_2007_by_Jo_Coenen_-_Conservatorium_van_Amsterdam_2008_by_Frits_van_Dongen_01.jpg
 *   - Ciell, "OBA building side view.jpg", CC BY-SA 4.0 — the west pylon
 *     and the west side's stacked floors.
 *     https://commons.wikimedia.org/wiki/File:OBA_building_side_view.jpg
 *   - VrijMokum, "750-slinger OBA 1.jpg", CC BY-SA 4.0 — the west pylon and
 *     entrance steps close up. https://commons.wikimedia.org/wiki/File:750-slinger_OBA_1.jpg
 *
 * Estimated from the photos (all wide-angle, so widths more than heights):
 * the west pylon x −16…−5, the east pylon x 21…26.5, both 9 m deep, running
 * from the ground into the canopy; the recessed front at y −22; the canopy's
 * top 36.6 (3D BAG) reaching the outline's front, 2.6 m past the pylons' faces
 * and 11.6 m past the recessed front, its pale front edge 3.6 m deep (Txllxt
 * 05: the edge is about a third of a pylon's width), its dark underside
 * sloping down to 30.4 at the recessed front; the top floors behind it, set
 * back to y −27, rise to the main roof (3D BAG's step 36.6 → 41.6); stone
 * balcony ledges along the west side's glazed floors (Ciell); the
 * red frame grid 9.4–32; the side walls in the same red-brown with glass
 * (Ciell's photo); the white slab 8.6–9.4; the glazed ground floor
 * 0–8.6 set back to y −20 behind a colonnade.
 *
 * Doubts: no level, distant photo of the front exists on Commons, and the
 * north and east sides (against the ODE offices and the Conservatorium) are
 * unphotographed; drawn plain. Night: the windows and the entrance glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, type XY, type Facade, insetRing, area } from './nyc-570-lexington'
import { rectPanel, block, column } from './nyc-city-hall'

const stone = new Part(), frame = new Part(), win = new Part(), roof = new Part(), door = new Part(), soffit = new Part()

const outline: XY[] = [
  [-3.63, 32.32], [5.69, 35.36], [5.1, 38.0], [15.54, 40.52], [15.96, 38.67], [17.99, 29.94], [25.95, -4.42], [27.67, -11.76],
  [31.11, -26.4], [32.83, -33.69], [22.05, -34.84], [22.05, -33.73], [14.86, -33.64], [-6.89, -33.55], [-11.87, -33.53],
  [-15.22, -33.52], [-36.56, 24.86],
]
const WEST = outline.length - 2 // the edge (−15.22, −33.52) → (−36.56, 24.86)

/** Clip a ring to y ≥ c (Sutherland–Hodgman). */
function clipY(r: XY[], c: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], ia = a[1] >= c, ib = b[1] >= c
    if (ia) out.push(a)
    if (ia !== ib) { const t = (c - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, c]) }
  }
  return out
}
/** Move one edge of a clockwise-or-not ring inward by d (its neighbours' lines kept). */
function pushEdge(r: XY[], k: number, d: number): XY[] {
  const n = r.length, a = r[k], b = r[(k + 1) % n]
  let s = 0; for (let i = 0; i < n; i++) { const p = r[i], q = r[(i + 1) % n]; s += p[0] * q[1] - q[0] * p[1] }
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  const nIn: XY = s > 0 ? [-u[1], u[0]] : [u[1], -u[0]]
  const meet = (p: XY, q: XY): XY => { // line through p→q meets the moved edge line
    const v: XY = [q[0] - p[0], q[1] - p[1]], o: XY = [a[0] + nIn[0] * d, a[1] + nIn[1] * d]
    const den = v[0] * u[1] - v[1] * u[0], t = ((o[0] - p[0]) * u[1] - (o[1] - p[1]) * u[0]) / den
    return [p[0] + v[0] * t, p[1] + v[1] * t]
  }
  const out = r.slice()
  out[k] = meet(r[(k + n - 1) % n], a)
  out[(k + 1) % n] = meet(r[(k + 2) % n], b)
  return out
}

/** Shrink a ring of either winding by d, so stacked volumes never share a wall plane. */
const shrink = (r: XY[], d: number) => insetRing(r, area(r) > 0 ? d : -d)

const FRONT = -22.0, MAIN = 41.6, BACK = 45.1, CORE = 46.5
const facade: Facade = { bay: 3.0, ratio: 0.88, floor: 3.6, group: 2, spandrel: 0.6, sill: 0.5, head: 0.6, ground: 0.5, margin: 0.5 }
// The front face (y = FRONT) gets its own treatment, not the generic facade.
const noFront = (_: number, a: XY, b: XY) => (Math.abs(a[1] - FRONT) < 0.01 && Math.abs(b[1] - FRONT) < 0.01 ? null : facade)

// ---------------------------------------------------------------- the stepped west side and the body
const podium = clipY(outline, FRONT)
prism({ wall: stone, win, roof, ring: podium, z0: 0, z1: 8.7, facade, faceFacade: noFront, bevel: 0.3 })
const terrace = shrink(clipY(pushEdge(outline, WEST, 6.0), FRONT), 0.08)
prism({ wall: stone, win, roof, ring: terrace, z0: 8.3, z1: 24.8, facade, faceFacade: noFront, bevel: 0.3 })
const body = shrink(clipY(pushEdge(outline, WEST, 10.0), FRONT), 0.16)
prism({ wall: frame, win, roof, ring: body, z0: 24.4, z1: MAIN, facade, faceFacade: noFront, bevel: 0.3 })
prism({ wall: frame, win, roof, ring: shrink(clipY(pushEdge(outline, WEST, 10.0), -6.0), 0.24), z0: MAIN - 0.4, z1: BACK, facade, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: [[-12, -4], [18, -4], [18, 26], [-12, 26]], z0: BACK - 0.4, z1: CORE, facade: null, bevel: 0.3 })

/** Balcony slabs: pale stone ledges `d` deep along every outer edge of a ring except the recessed front. */
function ledges(r: XY[], zs: number[], d = 1.2, t = 0.35) {
  const rr = area(r) > 0 ? r : r.slice().reverse()
  for (let k = 0; k < rr.length; k++) {
    const a = rr[k], b = rr[(k + 1) % rr.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4 || (Math.abs(a[1] - FRONT) < 0.01 && Math.abs(b[1] - FRONT) < 0.01)) continue
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const P = (s: number, o: number, z: number): V3 => [a[0] + ux * s + nx * o, a[1] + uy * s + ny * o, z]
    for (const z of zs) {
      const s0 = 0.6, s1 = L - 0.6
      stone.quad(P(s0, d, z), P(s1, d, z), P(s1, d, z + t), P(s0, d, z + t)) // face
      stone.quad(P(s0, 0, z + t), P(s0, d, z + t), P(s1, d, z + t), P(s1, 0, z + t)) // top
      stone.quad(P(s0, 0, z), P(s1, 0, z), P(s1, d, z), P(s0, d, z)) // underside
      stone.quad(P(s0, 0, z), P(s0, d, z), P(s0, d, z + t), P(s0, 0, z + t))
      stone.quad(P(s1, d, z), P(s1, 0, z), P(s1, 0, z + t), P(s1, d, z + t))
    }
  }
}
// the west side's stacked glazed floors with balconies (Ciell's photo)
ledges(podium, [4.2])
ledges(terrace, [12.0, 16.0, 20.0])
ledges(body, [28.2, 31.8, 35.4])

// ---------------------------------------------------------------- the front under the canopy
// The canopy: top 36.6 (3D BAG), a 3.6 m pale front edge at the outline's front
// (y −33.6), its dark underside sloping back and down to 30.4 at the recessed
// front (y −22); behind y −27 the top floors rise to the main roof. The two
// pylons run from the ground into it.
const CANOPY_TOP = 36.6, EDGE_LOW = 33.0, SOFFIT_BACK = 30.4, CY = -33.6, YB = -27.0, CX0 = -16.2, CX1 = 32.5
const soffitZ = (y: number) => EDGE_LOW + ((y - CY) / (FRONT - CY)) * (SOFFIT_BACK - EDGE_LOW)
const pylon = (x0: number, x1: number) => {
  prism({ wall: stone, win: null, roof: null, ring: [[x0, -31.0], [x1, -31.0], [x1, FRONT + 0.2], [x0, FRONT + 0.2]], z0: 0, z1: EDGE_LOW + 0.4, facade: null, bevel: 0.35 })
}
pylon(-16.0, -5.0)
pylon(21.0, 26.5)
{
  const zb = soffitZ(YB)
  soffit.quad([CX1, CY, EDGE_LOW], [CX0, CY, EDGE_LOW], [CX0, FRONT, SOFFIT_BACK], [CX1, FRONT, SOFFIT_BACK])
  stone.quad([CX0, CY, EDGE_LOW], [CX1, CY, EDGE_LOW], [CX1, CY, CANOPY_TOP], [CX0, CY, CANOPY_TOP]) // the bold pale front edge
  stone.quad([CX0, CY, CANOPY_TOP], [CX1, CY, CANOPY_TOP], [CX1, YB, CANOPY_TOP], [CX0, YB, CANOPY_TOP]) // pale on top too (Txllxt 05)
  frame.quad([CX0, YB, CANOPY_TOP], [CX1, YB, CANOPY_TOP], [CX1, YB, MAIN], [CX0, YB, MAIN])
  rectPanel(win, [CX0, YB], [CX1, YB], (CX1 - CX0) / 2, CX1 - CX0 - 2, CANOPY_TOP + 0.8, MAIN - 0.8, 0.06)
  roof.quad([CX0, YB, MAIN], [CX1, YB, MAIN], [CX1, FRONT, MAIN], [CX0, FRONT, MAIN])
  // the ends: the canopy's in stone, the top floors' in the frame colour
  for (const [x, sgn] of [[CX1, 1], [CX0, -1]] as [number, number][]) {
    const q = (pts: [number, number][], p: Part) => {
      const v = pts.map(([y, z]) => [x, y, z] as V3)
      if (sgn > 0) p.quad(v[0], v[1], v[2], v[3]); else p.quad(v[3], v[2], v[1], v[0])
    }
    q([[CY, EDGE_LOW], [YB, zb], [YB, CANOPY_TOP], [CY, CANOPY_TOP]], stone)
    q([[YB, zb], [FRONT, SOFFIT_BACK], [FRONT, MAIN], [YB, MAIN]], frame)
  }
}
// the recessed front: red-brown frame grid between the pylons, the white slab, the glazed ground floor
{
  const a: XY = [-5.0, FRONT], b: XY = [21.0, FRONT], L = 26.0
  rectPanel(frame, a, b, L / 2, L, 9.4, SOFFIT_BACK - 0.1, 0.25)
  const cols = 8, rows = 4
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const s = (L * (i + 0.5)) / cols, z0 = 10.0 + j * 5.1
    rectPanel(win, a, b, s, L / cols - 0.9, z0, z0 + 4.4, 0.3)
  }
  // the deeper stacked boxes: two floors of the grid pushed forward, offset
  block(frame, 4.0, FRONT - 2.2, 14.0, FRONT, 15.8, 21.6)
  block(frame, -2.0, FRONT - 1.4, 8.0, FRONT, 21.6, 27.4)
  rectPanel(win, [4.0, FRONT - 2.2], [14.0, FRONT - 2.2], 5.0, 8.4, 16.4, 21.0, 0.05)
  rectPanel(win, [-2.0, FRONT - 1.4], [8.0, FRONT - 1.4], 5.0, 8.4, 22.2, 26.8, 0.05)
  // the white floor slab over the entrance
  block(stone, -5.0, FRONT - 3.5, 21.0, FRONT, 8.6, 9.4, true)
  // ground floor glazing and the colonnade
  rectPanel(door, a, b, L / 2, L - 0.4, 0.3, 8.4, 0.06)
  for (const x of [0.5, 6.5, 12.5, 18.0]) column(stone, x, FRONT - 2.4, 0.45, 0, 8.6, { n: 10, base: 0.2, cap: 0.2, taper: 1 })
  // the strip east of the east pylon, glazed
  rectPanel(win, [26.5, FRONT], [29.6, FRONT], 1.55, 2.4, 1.0, SOFFIT_BACK - 1.0, 0.06)
}

// ---------------------------------------------------------------- write
const pale = (p: V3, n: V3): number => (p[1] < FRONT + 0.5 && n[2] < 0.5 ? 0.5 : 0)
finishModel('OBA Oosterdok', 'amsterdam-oba', [
  { part: stone, material: { ...finish('oba-stone', 0xd9cdb7), floodlight: pale } },
  { part: frame, material: finish('oba-frame', 0x925f50) },
  { part: win, material: PALETTE.window },
  { part: roof, material: { ...PALETTE.roof, color: 0x86817a } },
  { part: door, material: PALETTE.entrance },
  { part: soffit, material: finish('oba-soffit', 0x5f5953) },
], { bearing: 8, osm: 'way/779659694', height: CORE }, 5000)
