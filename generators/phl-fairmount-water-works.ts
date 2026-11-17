/**
 * Fairmount Water Works, Philadelphia — procedural, CC0-1.0, no textures.
 * bun generators/phl-fairmount-water-works.ts
 *
 * Map frame: x across the river bank (east, inland), y along it
 * (north-north-west, upstream), z up, metres. Placed at bearing 352.5°, the
 * line of the mill houses' walls (all the complex's OSM outlines agree to
 * within a degree, except the Engine House, turned 17.4° with the bank, and
 * the New Mill House, set square to the dam). The anchor is the area
 * centroid of the eight outlines it replaces (lng -75.183648, lat
 * 39.966381). z = 0 is the Schuylkill below the dam, the lowest ground under
 * the footprint; the water itself is the map's.
 *
 * What it is: Frederick Graff's water works (1812-72) on the east bank under
 * Fairmount, the hill the Museum of Art now stands on. A long granite-faced
 * mill house rises straight out of the river, with a white balustrade along
 * its roof terrace and, on the terrace, a row of white Greek Revival
 * pavilions: from the south, the Engine House (1815, with its river
 * veranda, now a restaurant behind glass), the Caretaker's House with its
 * cupola, the South Entrance House, the central open Pavilion (a Tuscan
 * colonnade under a pediment), the North Entrance House (each entrance house
 * carrying a copy of a William Rush figure, "The Schuylkill Chained" and
 * "The Schuylkill Freed"), the Watering Committee Building, and at the
 * north end, against the dam, Birkinbine's New Mill House (1859-61), a
 * granite block whose roof is a paved terrace at the level of the bank.
 *
 * Covers and replaces: relation/11817436 (New Mill House), way/865740088
 * (Old Mill House), way/865740087 (Engine House), way/865740089
 * (Caretaker's House), way/74728243 (South Entrance House), way/74728259
 * (Pavilion), way/74728242 (North Entrance House), way/74728261 (Watering
 * Committee Building). node/367975478 is the site's point of interest, not
 * a building, and is left off. The gazebos on the hill (Mercury Pavilion,
 * way/657694325; Rustic Pavilion, way/865750218) and the Eagle Pavilion at
 * the dam (way/705043627) stand apart and are not drawn.
 *
 * Evidence
 * - OSM outlines (measured, in this frame): the mill houses' river face at
 *   x -1 to -6.6 (each pavilion's bay stepping out), their landward edge
 *   x 20 (south) to 13 (north), y -45 to 33; Engine House centred (6.8,
 *   -59.1), 23.7 x 24 m, turned 17.4° clockwise; New Mill House the
 *   relation's outline, with its three buttressed bays on the river.
 * - USGS 3DEP lidar, USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 0.5 m, heights over the tailwater (ground_min, the river):
 *   terrace 7.0-7.1; New Mill House roof 6.7-6.8; the pool above the dam
 *   2.4-3.5; the bank east of the works 6.0-7.0. Pavilion ridge 15.5 along
 *   x at y -5, eaves 13.6; entrance houses' roofs 10.0-10.3 with the
 *   figures to 11.5; Caretaker's House 12.3-13.0, its cupola 15.0;
 *   Watering Committee ridge 12.9 along x, eaves 12.0; Engine House hip
 *   ridge 23.1, eaves about 18, its wings 12.5-14, its veranda roof 9.7-12.
 * - USGS NAIP orthophoto (public domain): plan, the pale metal roofs.
 * - Photos (Wikimedia Commons): HAER PA-51-PHILA-328 / HABS PA-1654 by Jack
 *   E. Boucher and others (public domain): aerial views looking east,
 *   south-east and north-east (the plan, every roof, the New Mill House's
 *   arches), "View looking south, showing North Entrance House and central
 *   Pavilion" (the Tuscan colonnade, the entrance house), "View looking
 *   west, land facade of Engine House" (its three-storey centre and
 *   lunetted wings); "DSC05845 (1)Fairmount Water Works from the Schuykill
 *   River.jpg" (Librarian1984, CC BY-SA 4.0: the river face's bays,
 *   lunettes and water arches, the Pavilion's four-by-seven columns);
 *   "Fairmount Water Works on a Cloudy Day.jpg" (Goldpanda94, CC BY-SA 4.0);
 *   "Fairmount Water Works and Philadelphia Art Museum.jpg" (Laura Klotz,
 *   CC BY-SA 4.0: the New Mill House roof terrace, the Watering Committee
 *   portico); "Fairmount Water Works at dusk.jpg" (SkipL, CC BY-SA 4.0:
 *   the Engine House and its veranda, the floodlighting);
 *   "Philadelphia Museum of Art & Fairmount Water Works.jpg" (Zhicheng
 *   Zhao, CC BY-SA 4.0: the whole row from across the river).
 * - Estimated from the photos: column sizes (Pavilion 0.84 m across, 5.2 m
 *   tall), the river face's lunettes (1.5 m across), its small square-headed
 *   openings and the one great water arch at the south end (4.2 m, to 2.4
 *   m), the shade inside the colonnades (a dark core and ceiling), the pale
 *   grey metal roofs (Zhao, Klotz), the Engine House's window rows, the balustrades (0.95 m),
 *   the statues as plain white blocks.
 *
 * Doubts
 * - The map's terrain steps from the river (0) to the bank (7) across the
 *   mill houses, and its fill under the model is a ramp between them. The
 *   model keeps its true shape, standing on the river. `terrain.ts check`
 *   passes (nothing buried), but the map lifts each low vertex by the
 *   ground under it: by its formula the terrace comes out about 8.9 m up
 *   on the river face and about 12.5 m on the landward edge, where the bank
 *   is drawn at about 8.4, so the landward side stands on a plinth of 3-5 m
 *   and the Pavilion's floor tilts about 3 m along its length. That is the
 *   map's drape on a river wall, not the model; a rigid placement would
 *   need a map change.
 * - The New Mill House's roof is drawn as plain paving; NAIP now shows
 *   rows of pale structures on it, not drawn.
 * - The Engine House's river veranda is drawn as a glazed colonnade under a
 *   lean-to roof, as it stands today (restaurant enclosure), not as the
 *   open veranda of the HAER photos.
 *
 * Night: the pavilions and the granite face are floodlit (SkipL's dusk
 * photo), so the stucco and granite carry `_FLOODLIGHT`; windows and the
 * glazed veranda glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cbox, cylinder, grow, panel, qf, rect, tf, type Rect, type Side } from './dc-white-house'
import { pslab, saveModel, type XY } from './dc-nga-west'

const stucco = new Part(), granite = new Part(), roof = new Part(), win = new Part(), shadow = new Part(), glazing = new Part()

const TERRACE = 7.0 // the mill houses' roof terrace (lidar)
const BAL = 0.95 // balustrade height

// ---------------------------------------------------------------------------
// Helpers.

/** A flat shape on a wall: points (s along the wall from a, z), facing out of a CCW ring. */
function wallShape(p: Part, a: XY, b: XY, pts: [number, number][], d = 0.05) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const ux = dx / l, uy = dy / l, nx = uy, ny = -ux
  const P = ([s, z]: [number, number]): V3 => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d, z]
  const n: V3 = [nx, ny, 0]
  for (let i = 1; i < pts.length - 1; i++) tf(p, P(pts[0]), P(pts[i]), P(pts[i + 1]), n)
}
/** A semicircular-headed opening, or a lunette when hi - lo = w / 2: a convex outline. */
function archShape(c: number, w: number, lo: number, hi: number, seg = 8): [number, number][] {
  const r = w / 2, spring = hi - r
  const pts: [number, number][] = spring > lo + 1e-6 ? [[c - r, lo], [c + r, lo]] : []
  for (let k = 0; k <= seg; k++) {
    const t = Math.PI * (k / seg)
    pts.push([c + r * Math.cos(t), spring + r * Math.sin(t)])
  }
  return pts
}
/** A segmental water arch: a chord `w` wide rising `rise` over the waterline. */
function segmentShape(c: number, w: number, z0: number, rise: number, seg = 6): [number, number][] {
  const h = w / 2, R = (h * h + rise * rise) / (2 * rise), zc = z0 + rise - R
  const a0 = Math.asin(h / R)
  const pts: [number, number][] = [[c, z0]]
  for (let k = 0; k <= seg; k++) {
    const t = a0 - (2 * a0 * k) / seg
    pts.push([c + R * Math.sin(t), zc + R * Math.cos(t)])
  }
  return pts
}

/** Copy a part into another, turned `angle` (radians, counter-clockwise) and moved to (cx, cy). */
function placeInto(dst: Part, src: Part, cx: number, cy: number, angle: number) {
  const c = Math.cos(angle), s = Math.sin(angle)
  for (let i = 0; i < src.pos.length; i += 3) {
    const x = src.pos[i], y = -src.pos[i + 2], z = src.pos[i + 1]
    const nx = src.nrm[i], ny = -src.nrm[i + 2], nz = src.nrm[i + 1]
    const X = cx + x * c - y * s, Y = cy + x * s + y * c
    const NX = nx * c - ny * s, NY = nx * s + ny * c
    dst.pos.push(X, z, -Y)
    dst.nrm.push(NX, nz, -NY)
  }
  dst.uv.push(...src.uv)
}

/** A plain Tuscan column: base slab, shaft, a cushion capital. */
function tuscan(p: Part, x: number, y: number, r: number, z0: number, z1: number, seg = 8) {
  cbox(p, rect(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3), z0, z0 + 0.25, { top: true })
  cylinder(p, x, y, r, z0 + 0.25, z1 - 0.45, seg, r * 0.86)
  cylinder(p, x, y, r * 0.86, z1 - 0.45, z1 - 0.2, seg, r * 1.15)
  cbox(p, rect(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3), z1 - 0.2, z1, { bottom: true, top: false })
}

/**
 * A gable roof with its ends: ridge along x or y over rect r, eaves at E,
 * ridge at A, overhang o; `ends` closes each end as a pediment (stucco
 * frame on a slightly recessed tympanum) or leaves it open.
 */
function gableRoof(r: Rect, ridge: 'x' | 'y', E: number, A: number, o: number, ends: [boolean, boolean]) {
  const g = grow(r, o)
  const cx = (g.x0 + g.x1) / 2, cy = (g.y0 + g.y1) / 2
  const W = ridge === 'x' ? (g.y1 - g.y0) / 2 : (g.x1 - g.x0) / 2
  const L = ridge === 'x' ? (g.x1 - g.x0) / 2 : (g.y1 - g.y0) / 2
  const P = (a: number, l: number, z: number): V3 => (ridge === 'x' ? [cx + l, cy + a, z] : [cx + a, cy + l, z])
  const D = (a: number, l: number, z: number): V3 => (ridge === 'x' ? [l, a, z] : [a, l, z])
  for (const s of [-1, 1]) qf(roof, P(s * W, -L, E), P(s * W, L, E), P(0, L, A), P(0, -L, A), D(s * (A - E), 0, W))
  ends.forEach((on, i) => {
    if (!on) return
    const e = i === 0 ? -1 : 1, l = e * (L - o), n = D(0, e, 0)
    const k = (A - E) / W, t = 0.3, Wi = (A - t - E - 0.12) / k
    tf(stucco, P(-W, l, E), P(W, l, E), P(0, l, A), n)
    tf(stucco, P(-Wi, l + e * 0.0, E + 0.12), P(Wi, l, E + 0.12), P(0, l, A - t), n)
    // the raking cornices stand a little proud
    for (const s of [-1, 1]) qf(stucco, P(s * W, l + e * 0.25, E), P(0, l + e * 0.25, A), P(0, l + e * 0.25, A - t), P(s * (W - t / k), l + e * 0.25, E), n)
  })
}

/** A building's body: walls, a cornice band. */
function body(p: Part, r: Rect, z0: number, z1: number, cornice = 0.35) {
  cbox(p, r, z0, z1 - cornice, { top: false })
  cbox(p, grow(r, 0.25), z1 - cornice, z1, { b: 0.12, bottom: true, top: false })
}

/** A balustrade along a wall top: a solid white band with a capping rail. */
function balustradeLine(a: XY, b: XY, z: number) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const nx = dy / l, ny = -dx / l, t = 0.3
  const pts: XY[] = [[a[0], a[1]], [b[0], b[1]], [b[0] - nx * t, b[1] - ny * t], [a[0] - nx * t, a[1] - ny * t]]
  pslab(stucco, pts, z, z + BAL, 0.06)
}

// ===========================================================================
// The mill houses and their terrace: bays along the river, each from its
// river face back to the landward edge, granite to the terrace.
const xEast = (y: number) => 20.1 - ((y + 49.7) * 6.6) / 82.7
const bays: [number, number, number][] = [ // y0, y1, river face x
  [-45.1, -33.9, -1.2], [-33.9, -28.8, 2.0], [-28.8, -16.4, -1.0], [-16.4, -11.4, 0.7],
  [-11.4, 1.7, -3.1], [1.7, 6.4, -0.5], [6.4, 19.3, -3.8], [19.3, 23.9, -2.3], [23.9, 31.3, -6.5],
]
for (const [y0, y1, xf] of bays) {
  const ring: XY[] = [[xf, y0], [xEast(y0), y0], [xEast(y1), y1], [xf, y1]]
  pslab(granite, ring, 0, TERRACE, 0.15)
  // the river face: water arches and lunettes, one set per 6 m
  const a: XY = [xf, y1], b: XY = [xf, y0] // runs south along the face, facing -x
  const L = y1 - y0, n = Math.max(1, Math.round(L / 6.2))
  if (L > 4.5) {
    for (let k = 0; k < n; k++) {
      const c = (L * (k + 0.5)) / n
      // lunettes high in the bay, a small square-headed opening low between them
      for (const s of n === 1 && L < 6 ? [0] : [-1, 1]) wallShape(win, a, b, archShape(c + s * (L / n) * 0.24, 1.5, 3.6, 4.35))
      wallShape(shadow, a, b, [[c - 0.45, 1.0], [c + 0.45, 1.0], [c + 0.45, 2.6], [c - 0.45, 2.6]])
    }
  }
  // the one great water arch, at the south end under the Caretaker's House
  if (y0 === -45.1) wallShape(shadow, a, b, segmentShape(L * 0.62, 4.2, 0, 2.4))
  // balustrade on the river edge of the terrace
  balustradeLine([xf + 0.05, y1], [xf + 0.05, y0], TERRACE)
}

// ---------------------------------------------------------------------------
// The Pavilion: an open Tuscan colonnade, four by seven, under a gable with
// a pediment at each end, on the terrace.
{
  const r = rect(-2.8, 16.4, -11.1, 1.4)
  cbox(granite, grow(r, 0.4), TERRACE - 0.2, TERRACE + 0.35, { b: 0.1 })
  const z0 = TERRACE + 0.35, z1 = 12.4, E = 13.6, A = 15.5
  const xs = [r.x0 + 0.6, r.x1 - 0.6], ys = [r.y0 + 0.6, r.y1 - 0.6]
  for (let k = 0; k < 4; k++) {
    const y = ys[0] + ((ys[1] - ys[0]) * k) / 3
    for (const x of xs) tuscan(stucco, x, y, 0.42, z0, z1)
  }
  for (let k = 1; k < 6; k++) {
    const x = xs[0] + ((xs[1] - xs[0]) * k) / 6
    for (const y of ys) tuscan(stucco, x, y, 0.42, z0, z1)
  }
  // the shade inside the colonnade: a dark core and ceiling seen between the columns
  cbox(shadow, rect(r.x0 + 2.1, r.x1 - 2.1, r.y0 + 2.1, r.y1 - 2.1), z0, z1, { top: false })
  qf(shadow, [r.x0, r.y0, z1 - 0.02], [r.x1, r.y0, z1 - 0.02], [r.x1, r.y1, z1 - 0.02], [r.x0, r.y1, z1 - 0.02], [0, 0, -1])
  cbox(stucco, r, z1, E - 0.3, { bottom: true, top: false })
  cbox(stucco, grow(r, 0.3), E - 0.3, E, { b: 0.12, bottom: true, top: false })
  gableRoof(r, 'x', E, A, 0.3, [true, true])
}

// ---------------------------------------------------------------------------
// The entrance houses: long low blocks with a hip roof and a white figure
// group on a pedestal at the middle; a row of small windows on the river.
for (const [r, fig] of [[rect(1.3, 6.2, 7.2, 20.2), 13.7], [rect(4.3, 9.0, -28.6, -15.7), -22.15]] as [Rect, number][]) {
  body(stucco, r, TERRACE - 0.2, 9.8)
  cbox(roof, grow(r, 0.25), 9.8, 10.25, { b: 0.4 })
  const xc = (r.x0 + r.x1) / 2
  cbox(stucco, rect(xc - 1.2, xc + 1.2, fig - 1.6, fig + 1.6), 10.0, 11.0, { b: 0.15 })
  cbox(stucco, rect(xc - 0.8, xc + 0.8, fig - 1.3, fig + 1.3), 11.0, 11.7, { b: 0.3 })
  cbox(stucco, rect(xc - 0.55, xc + 0.55, fig - 0.4, fig + 0.6), 11.7, 12.5, { b: 0.25 })
  const nW = Math.round((r.y1 - r.y0) / 2.6)
  for (let k = 0; k < nW; k++) {
    const yc = r.y0 + ((r.y1 - r.y0) * (k + 0.5)) / nW
    panel(win, 'w', r.x0, yc - 0.45, yc + 0.45, 8.0, 9.2, 0.05)
  }
  panel(win, 's', r.y0, xc - 0.7, xc + 0.7, TERRACE, 9.3, 0.05)
  panel(win, 'n', r.y1, xc - 0.7, xc + 0.7, TERRACE, 9.3, 0.05)
}

// ---------------------------------------------------------------------------
// The Caretaker's House: a small temple facing the river, with a cupola.
{
  const r = rect(-1.0, 11.8, -40.0, -33.2)
  body(stucco, r, TERRACE - 0.2, 12.0)
  gableRoof(r, 'x', 12.0, 13.1, 0.3, [true, true])
  const yc = (r.y0 + r.y1) / 2
  for (const s of [-1, 1]) wallShape(win, [r.x0, r.y1], [r.x0, r.y0], archShape(3.4 + s * 1.6, 1.1, 8.0, 10.6))
  for (let k = 0; k < 3; k++) {
    const x = r.x0 + 2.5 + k * 4
    panel(win, 's', r.y0, x - 0.55, x + 0.55, 8.2, 10.4, 0.05)
    panel(win, 'n', r.y1, x - 0.55, x + 0.55, 8.2, 10.4, 0.05)
  }
  // cupola
  const cx = 4.0
  cbox(stucco, rect(cx - 1.1, cx + 1.1, yc - 1.1, yc + 1.1), 12.6, 14.1, { b: 0.1 })
  cbox(roof, rect(cx - 1.3, cx + 1.3, yc - 1.3, yc + 1.3), 14.1, 14.35, {})
  cylinder(roof, cx, yc, 0.9, 14.35, 15.0, 8, 0.15)
}

// ---------------------------------------------------------------------------
// The Watering Committee Building: a temple, four columns before the river
// front under a pediment, arched niches down its sides.
{
  const r = rect(-6.3, 6.8, 24.2, 31.0)
  const cella = rect(-3.4, 6.8, 24.2, 31.0)
  body(stucco, cella, TERRACE - 0.2, 12.0)
  cbox(stucco, rect(r.x0, cella.x0, r.y0, r.y1), TERRACE - 0.2, TERRACE + 0.3, { b: 0.1 })
  cbox(stucco, rect(r.x0, cella.x0, r.y0, r.y1), 11.0, 11.65, { bottom: true, top: false })
  for (let k = 0; k < 4; k++) tuscan(stucco, r.x0 + 0.6, r.y0 + 0.8 + ((r.y1 - r.y0 - 1.6) * k) / 3, 0.38, TERRACE + 0.3, 11.0)
  gableRoof(r, 'x', 12.0, 12.95, 0.25, [true, true])
  panel(shadow, 'w', cella.x0, r.y0 + 0.2, r.y1 - 0.2, TERRACE + 0.3, 11.0, 0.03)
  qf(shadow, [r.x0, r.y0, 10.98], [cella.x0, r.y0, 10.98], [cella.x0, r.y1, 10.98], [r.x0, r.y1, 10.98], [0, 0, -1])
  panel(win, 'w', cella.x0, 26.6, 28.6, TERRACE + 0.3, 10.2, 0.05)
  for (let k = 0; k < 3; k++) {
    const x = cella.x0 + 1.8 + k * 3.4
    wallShape(shadow, [x - 1, r.y0], [x + 1, r.y0], archShape(1, 1.5, 7.9, 10.6))
    wallShape(shadow, [x + 1, r.y1], [x - 1, r.y1], archShape(1, 1.5, 7.9, 10.6))
  }
}

// ---------------------------------------------------------------------------
// The New Mill House: the relation's outline in granite from the river to
// its roof terrace, three great arches in its buttressed river bays, a
// balustrade round the terrace.
{
  const NM: XY[] = [[-41.0, 41.7], [-37.9, 40.2], [-37.7, 40.6], [-30.8, 37.3], [-31.4, 36.0], [-28.4, 34.6], [-27.9, 35.8],
    [-21.4, 32.7], [-22.0, 31.5], [-19.2, 30.2], [-18.7, 31.3], [-13.2, 28.7], [-13.5, 28.0], [-10.7, 26.6], [-8.6, 30.9],
    [-6.6, 30.0], [-6.8, 31.3], [0.7, 32.0], [2.4, 35.7], [8.2, 47.7], [-1.2, 52.4], [-1.0, 52.7], [-26.6, 64.9],
    [-29.4, 59.0], [-32.1, 60.4], [-38.4, 47.1]]
  const ROOF = 6.75
  // walls in short pieces, the roof terrace on top
  pslab(granite, NM, 0, ROOF, 0.15)
  for (const [a, b] of [[[-37.7, 40.6], [-30.8, 37.3]], [[-27.9, 35.8], [-21.4, 32.7]], [[-18.7, 31.3], [-13.2, 28.7]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    wallShape(shadow, a, b, archShape(L / 2, 4.6, 0.0, 5.2, 10))
  }
  // the pool face: a row of tall arched windows
  {
    const a: XY = [-1.0, 52.7], b: XY = [-26.6, 64.9], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let k = 0; k < 6; k++) wallShape(win, a, b, archShape((L * (k + 0.5)) / 6, 1.4, 3.2, 5.6))
  }
  for (const [a, b] of [[[-41.0, 41.7], [-37.9, 40.2]], [[-37.7, 40.6], [-30.8, 37.3]], [[-27.9, 35.8], [-21.4, 32.7]],
    [[-18.7, 31.3], [-13.2, 28.7]], [[-13.5, 28.0], [-10.7, 26.6]], [[8.2, 47.7], [-1.2, 52.4]], [[-1.0, 52.7], [-26.6, 64.9]],
    [[-26.6, 64.9], [-29.4, 59.0]], [[-38.4, 47.1], [-41.0, 41.7]], [[-32.1, 60.4], [-38.4, 47.1]]] as [XY, XY][]) {
    balustradeLine(a, b, ROOF)
  }
}

// ---------------------------------------------------------------------------
// The Engine House, turned with the bank: a granite base from the river to
// the terrace, a glazed veranda along the river, the three-storey centre
// under a hip roof, and lower flat-roofed wings north and south.
{
  const eh = { stucco: new Part(), granite: new Part(), roof: new Part(), win: new Part(), shadow: new Part(), glazing: new Part() }
  const U = 11.85, V = 12.0 // half sizes, u across (east), v along (north)
  cbox(eh.granite, rect(-U, U, -V, V), 0, TERRACE, { b: 0.15 })
  // river face arches
  for (const v of [-6, 0, 6]) {
    const a: XY = [-U, v + 2.5], b: XY = [-U, v - 2.5]
    wallShape(eh.win, a, b, archShape(2.5, 1.4, 3.6, 4.3))
  }
  // centre block
  const C = rect(-4.8, 9.2, -7.4, 7.4)
  body(eh.stucco, C, TERRACE, 18.0, 0.5)
  {
    const g = grow(C, 0.3), ix = 5.3, iy = 5.3
    const a: V3[] = [[g.x0, g.y0, 18], [g.x1, g.y0, 18], [g.x1, g.y1, 18], [g.x0, g.y1, 18]]
    const t: V3[] = [[g.x0 + ix, g.y0 + iy, 23.1], [g.x1 - ix, g.y0 + iy, 23.1], [g.x1 - ix, g.y1 - iy, 23.1], [g.x0 + ix, g.y1 - iy, 23.1]]
    eh.roof.loft([a, t])
    eh.roof.cap(t, true)
  }
  for (const [x, w] of [[-1.5, 1.2], [6.0, 1.2]] as [number, number][]) cbox(eh.stucco, rect(x - w / 2, x + w / 2, -1.0, 1.0), 20.0, 24.6, { b: 0.1 })
  const rows: [number, number][] = [[8.6, 11.0], [12.0, 14.6], [15.6, 16.9]]
  for (let k = 0; k < 3; k++) {
    const v = -4.6 + k * 4.6
    for (const [z0, z1] of rows) {
      panel(eh.win, 'e', C.x1, v - 0.65, v + 0.65, z0, z1, 0.05)
      if (z0 > 11) panel(eh.win, 'w', C.x0, v - 0.65, v + 0.65, z0, z1, 0.05)
    }
  }
  for (const s of [-1, 1]) for (const [z0, z1] of rows) {
    for (const u of [-1.0, 5.4]) panel(eh.win, s < 0 ? 's' : 'n', s * 7.4, u - 0.65, u + 0.65, z0, z1, 0.05)
  }
  // wings
  for (const s of [-1, 1]) {
    const w = s < 0 ? rect(-4.8, U, -V, -7.4) : rect(-4.8, U, 7.4, V)
    body(eh.stucco, w, TERRACE, 13.0, 0.4)
    cbox(eh.roof, grow(w, -0.3), 12.9, 13.15, { top: true })
    const vc = (w.y0 + w.y1) / 2
    panel(eh.win, 'e', U, vc - 0.8, vc + 0.8, 7.6, 10.6, 0.05)
    panel(eh.win, s < 0 ? 's' : 'n', s * V, 1.0, 2.6, 7.6, 10.6, 0.05)
    panel(eh.win, s < 0 ? 's' : 'n', s * V, 6.5, 8.1, 7.6, 10.6, 0.05)
  }
  // the veranda: slim columns along the river, glass between, a lean-to roof
  const vx0 = -U + 0.3, vx1 = -4.8
  for (let k = 0; k <= 8; k++) {
    const v = -V + 0.4 + ((2 * V - 0.8) * k) / 8
    tuscan(eh.stucco, vx0 + 0.3, v, 0.25, TERRACE, 10.4, 6)
  }
  panel(eh.glazing, 'w', vx0 + 0.45, -V + 0.4, V - 0.4, TERRACE + 0.3, 10.1, 0.0)
  cbox(eh.stucco, rect(vx0, vx1, -V + 0.1, V - 0.1), 10.4, 10.9, { bottom: true, top: false })
  qf(eh.stucco, [vx0 - 0.3, -V, 10.9], [vx0 - 0.3, V, 10.9], [vx1, V, 12.0], [vx1, -V, 12.0], [-1.1, 0, vx1 - vx0])
  for (const s of [-1, 1]) tf(eh.stucco, [vx0 - 0.3, s * V, 10.9], [vx1, s * V, 10.9], [vx1, s * V, 12.0], [0, s, 0])
  const ang = (-17.4 * Math.PI) / 180, cx = 6.8, cy = -59.1
  placeInto(stucco, eh.stucco, cx, cy, ang)
  placeInto(granite, eh.granite, cx, cy, ang)
  placeInto(roof, eh.roof, cx, cy, ang)
  placeInto(win, eh.win, cx, cy, ang)
  placeInto(shadow, eh.shadow, cx, cy, ang)
  placeInto(glazing, eh.glazing, cx, cy, ang)
}

// Floodlit: the river fronts brightest, the land sides softly; tops faint.
const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.15
  if (n[2] < -0.7) return 0.3
  return n[0] < -0.3 ? 0.95 : 0.6
}
const STUCCO = { ...finish('fww-stucco', 0xf1e9d6), floodlight: lit }
const GRANITE = { ...finish('fww-granite', 0xb7b3a8), floodlight: lit }
if (import.meta.main) {
  await saveModel('phl-fairmount-water-works', 'Fairmount Water Works', [
    { part: stucco, material: STUCCO },
    { part: granite, material: GRANITE },
    { part: roof, material: finish('fww-roof', 0xc4c9ca) },
    { part: win, material: PALETTE.window },
    { part: shadow, material: finish('fww-shadow', 0x66696b) },
    { part: glazing, material: windowVariant(2, 0xa9bfd1) },
  ], { source: 'generators/phl-fairmount-water-works.ts', bearing: 352.5, osm: 'relation/11817436', footprint: [63, 139], height: 24.6 }, 5000)
}
