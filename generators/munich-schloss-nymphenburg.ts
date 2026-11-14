/**
 * Schloss Nymphenburg (Agostino Barelli 1664-75; wings and pavilions by
 * Enrico Zuccalli, Giovanni Antonio Viscardi and Joseph Effner, to about
 * 1730), Munich: original procedural geometry, CC0-1.0.
 * bun generators/munich-schloss-nymphenburg.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Anchor = area centroid of OSM way/1154184378, the outer ring of
 * relation/2144986 (the whole palace range): 48.1583221, 11.5045175. It falls
 * in the court of honour, 91 m east of the central pavilion. Bearing 357: the
 * range's axis (the paired pavilions' centres, OSM), so the facades are
 * square to the model's axes. The range is symmetric about y = -3.75 (every
 * OSM pair of pavilions and wings mirrors to within 1.5 m), and the model
 * mirrors the north half to the south.
 *
 * What is modelled: the whole relation. The central pavilion (Barelli's
 * cube, five levels, tall hipped roof, giant pilasters, three tall arched
 * windows over three arched doorways, double open stairs on both fronts); the
 * two-storey arcaded galleries with balustraded flat roofs; the first pair
 * of pavilions (square, steep pyramid roofs); the second pair, stepped
 * forward toward the court of honour; the long two-storey wings; the low
 * links; and the two quadrangles at the ends, as plain wings round their
 * courts (the south one is the Marstall, three storeys; the north one two).
 * The court of honour itself, its canal and the Schlossrondell's
 * Kavaliershäuser are separate (ground, water, other OSM buildings) and left
 * to the map; so are the Amalienburg and the park pavilions.
 *
 * Evidence
 *  - OSM (ODbL): relation/2144986 (building, heritage, Q131631; outer
 *    way/1154184378, four courts); building:parts way/160265535 (central
 *    pavilion, 5 levels, hipped), way/311978908, 311978909 (galleries, 2
 *    levels, flat), way/311978905, 311978913 (pavilions, 3 levels, hipped),
 *    way/311978907, 311978914 (forward pavilions, 3 levels), way/312000915,
 *    311978911 (long wings, 2 and 3 levels, hipped), way/311978915,
 *    311978910 (links, 2 levels, gabled), relation/12127738 (south
 *    quadrangle, 3 levels) and relation/12127745 (north quadrangle, 2 levels,
 *    gabled). Every plan dimension is from these.
 *  - Terrain (Mapterhorn): the ground rises about 2.9 m from the north end
 *    to the south end; each block's facade starts at its own ground level
 *    (estimated from that table), walls run down to y = 0.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - Richard Bartz, "Image-Schloss Nymphenburg Munich CC.jpg", CC BY-SA 2.5:
 *      the central pavilion and the first pavilions square on; the height
 *      ruler (central pavilion 35.2 m wide in OSM: cornice 23.5 m, roof top
 *      about 29.5 m; pavilions cornice 14.3 m, roof top 22.2 m; galleries
 *      10.5 m). https://commons.wikimedia.org/wiki/File:Image-Schloss_Nymphenburg_Munich_CC.jpg
 *    - Peulle, "Schloss Nymphenburg main building.jpg", CC BY-SA 4.0: the
 *      central pavilion, galleries and both pavilions from the lawn; roof
 *      pitch, dormers, chimneys. https://commons.wikimedia.org/wiki/File:Schloss_Nymphenburg_main_building.jpg
 *    - Carsten Steger, "Aerial image of Schloss Nymphenburg.jpg", CC BY-SA 4.0:
 *      the whole range from the south-east; roof colours (central roof
 *      red-brown, pavilions and quadrangles orange tile), the stepped plan,
 *      the long wings and quadrangles. https://commons.wikimedia.org/wiki/File:Aerial_image_of_Schloss_Nymphenburg.jpg
 *    - Flocci Nivis, "20220923 Nymphenburg Palace 01.jpg", CC BY 4.0.
 *      https://commons.wikimedia.org/wiki/File:20220923_Nymphenburg_Palace_01.jpg
 *    - Burkhard Mücke, "Schloss Nymphenburg, Weitwinkelansicht.jpg", CC BY-SA
 *      4.0: the court-of-honour front. https://commons.wikimedia.org/wiki/File:Schloss_Nymphenburg,_Weitwinkelansicht.jpg
 *    - Lucas Garron, "Wide Panorama of Schloss Nymphenburg in Winter.jpg", CC0.
 *      https://commons.wikimedia.org/wiki/File:Wide_Panorama_of_Schloss_Nymphenburg_in_Winter.jpg
 *    - Peulle, "Schloss Nymphenburg main entrance.jpg", CC BY-SA 4.0: the open
 *      stair. https://commons.wikimedia.org/wiki/File:Schloss_Nymphenburg_main_entrance.jpg
 *  No look-only sources, no commercial imagery, no LoD2 city model. No lidar
 *  in Germany.
 *
 * Numbers: plan measured from OSM; heights estimated from the Bartz photo,
 * scaled by the OSM widths (above). The long wings (cornice 10.5 m, roof to
 * 16 m), the links (7 / 9.5 m) and the quadrangles (south 13 / 19.5 m, north
 * 11 / 17 m) are estimated from the aerial against the pavilions. Window
 * rhythm counted from the photos (central pavilion 9 bays, pavilions 7).
 *
 * Simplified or left out: the gilt capitals, statues, vases and the
 * balustrade's balusters (a solid parapet); chimneys drawn as plain stacks;
 * dormers only on the pavilions; the quadrangles' court facades have no
 * windows; the small chapel bay on the north quadrangle's west side is a
 * plain block; the south half mirrors the north (OSM tags the south long wing
 * 3 levels and the north 2; the aerial shows them alike).
 * Night: windows glow; the facades are floodlit, the central pavilion's most.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const ID = 'munich-schloss-nymphenburg'
const YC = -3.75 // the axis of symmetry
const mir = (y: number) => 2 * YC - y
/** Ground under a block, above the lowest point (north end), from the terrain table. */
const ground = (y: number) => Math.max(0, Math.min(3, 1.45 - y * 0.0048))

const wall = new Part(), trim = new Part(), tile = new Part(), win = new Part()
const tile2 = new Part() // the central roof's darker tile

// ---------------------------------------------------------------------------
// Primitives

/** A box with its top and four sides. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top = true) {
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const e: V3 = [x0, y0, z1], f: V3 = [x1, y0, z1], g: V3 = [x1, y1, z1], h: V3 = [x0, y1, z1]
  p.quad(a, b, f, e); p.quad(b, c, g, f); p.quad(c, d, h, g); p.quad(d, a, e, h)
  if (top) p.quad(e, f, g, h)
}

/** A hipped roof over a rectangle (pyramid if square), eaves at z0, apex/ridge at z1, overhang o. */
function hip(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, o = 0.6) {
  x0 -= o; x1 += o; y0 -= o; y1 += o
  const w = x1 - x0, l = y1 - y0
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  if (Math.abs(w - l) < 0.5) {
    const t: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, z1]
    p.tri(a, b, t); p.tri(b, c, t); p.tri(c, d, t); p.tri(d, a, t)
  } else if (l > w) {
    const r0: V3 = [(x0 + x1) / 2, y0 + w / 2, z1], r1: V3 = [(x0 + x1) / 2, y1 - w / 2, z1]
    p.tri(a, b, r0); p.quad(b, c, r1, r0); p.tri(c, d, r1); p.quad(d, a, r0, r1)
  } else {
    const r0: V3 = [x0 + l / 2, (y0 + y1) / 2, z1], r1: V3 = [x1 - l / 2, (y0 + y1) / 2, z1]
    p.quad(a, b, r1, r0); p.tri(b, c, r1); p.quad(c, d, r0, r1); p.tri(d, a, r0)
  }
  p.quad(d, c, b, a) // soffit
}

/** A gabled roof, ridge along y. */
function gable(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, gableWall: Part, o = 0.4) {
  const xm = (x0 + x1) / 2
  const a: V3 = [x0 - o, y0 - o, z0], b: V3 = [x1 + o, y0 - o, z0], c: V3 = [x1 + o, y1 + o, z0], d: V3 = [x0 - o, y1 + o, z0]
  const r0: V3 = [xm, y0 - o, z1], r1: V3 = [xm, y1 + o, z1]
  p.quad(b, c, r1, r0); p.quad(d, a, r0, r1)
  gableWall.tri([x0, y0, z0], [x1, y0, z0], [xm, y0, z1 - 0.3])
  gableWall.tri([x1, y1, z0], [x0, y1, z0], [xm, y1, z1 - 0.3])
}

/** A projecting cornice band round a rectangle. */
function cornice(x0: number, x1: number, y0: number, y1: number, z: number, h = 0.8, o = 0.45) {
  box(trim, x0 - o, x1 + o, y0 - o, y1 + o, z - h, z, false)
}

type Face = 'e' | 'w' | 'n' | 's'
/**
 * Points along a face: the face's outward normal, a point at horizontal
 * offset u (from the face's left end seen from outside) and height z.
 */
function onFace(x0: number, x1: number, y0: number, y1: number, f: Face) {
  const d = 0.05
  switch (f) {
    case 'e': return { len: y1 - y0, at: (u: number, z: number): V3 => [x1 + d, y0 + u, z] }
    case 'w': return { len: y1 - y0, at: (u: number, z: number): V3 => [x0 - d, y1 - u, z] }
    case 'n': return { len: x1 - x0, at: (u: number, z: number): V3 => [x1 - u, y1 + d, z] }
    case 's': return { len: x1 - x0, at: (u: number, z: number): V3 => [x0 + u, y0 - d, z] }
  }
}
/** A flat panel on a face: u0..u1 across, z0..z1 up, an optional semicircular head. */
function panel(p: Part, at: (u: number, z: number) => V3, u0: number, u1: number, z0: number, z1: number, arched = false) {
  if (!arched) { p.quad(at(u0, z0), at(u1, z0), at(u1, z1), at(u0, z1)); return }
  const r = (u1 - u0) / 2, zs = z1 - r, um = (u0 + u1) / 2
  p.quad(at(u0, z0), at(u1, z0), at(u1, zs), at(u0, zs))
  const seg = 8
  for (let k = 0; k < seg; k++) {
    const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
    p.tri(at(um, zs), at(um + r * Math.cos(a0), zs + r * Math.sin(a0)), at(um + r * Math.cos(a1), zs + r * Math.sin(a1)))
  }
}
type Row = { z0: number; z1: number; w?: number; arched?: (bay: number, bays: number) => boolean; part?: (bay: number, bays: number) => Part | null }
/** Windows in bays across a face; rows at heights above the block's ground g. */
function windows(x0: number, x1: number, y0: number, y1: number, faces: Face[], bays: (len: number) => number, rows: Row[], g: number, margin = 1.2) {
  for (const f of faces) {
    const { len, at } = onFace(x0, x1, y0, y1, f)
    const n = bays(len), bw = (len - 2 * margin) / n
    for (let i = 0; i < n; i++) for (const r of rows) {
      const part = r.part ? r.part(i, n) : win
      if (!part) continue
      const w = Math.min(bw * 0.55, r.w ?? 1.5)
      const uc = margin + bw * (i + 0.5)
      panel(part, at, uc - w / 2, uc + w / 2, g + r.z0, g + r.z1, r.arched?.(i, n) ?? false)
    }
  }
}
/** Flat pilaster strips on a face (real 3D, 0.35 m proud), at offsets u. */
function pilasters(x0: number, x1: number, y0: number, y1: number, f: Face, us: number[], z0: number, z1: number, w = 1.0) {
  const out = 0.35
  for (const u of us) {
    const { at } = onFace(x0, x1, y0, y1, f)
    const a = at(u - w / 2, z0), b = at(u + w / 2, z0)
    const n: V3 = f === 'e' ? [out, 0, 0] : f === 'w' ? [-out, 0, 0] : f === 'n' ? [0, out, 0] : [0, -out, 0]
    const xs = [a[0], b[0], a[0] + n[0], b[0] + n[0]], ys = [a[1], b[1], a[1] + n[1], b[1] + n[1]]
    box(trim, Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), z0, z1)
  }
}

// ---------------------------------------------------------------------------
// The blocks

type Block = { x0: number; x1: number; y0: number; y1: number }
const both = (b: Block): Block[] => [b, { ...b, y0: mir(b.y1), y1: mir(b.y0) }]
const mid = (b: Block) => (b.y0 + b.y1) / 2

/** The central pavilion: x -105.6..-76.0, y -21.3..13.9 (OSM way/160265535). */
function central() {
  const b = { x0: -105.6, x1: -76.0, y0: -21.3, y1: 13.9 }
  const g = ground(mid(b))
  const ZC = g + 23.5, ZR = g + 29.4
  box(wall, b.x0, b.x1, b.y0, b.y1, 0, ZC)
  cornice(b.x0, b.x1, b.y0, b.y1, ZC + 0.4, 1.2, 0.6)
  box(trim, b.x0 - 0.3, b.x1 + 0.3, b.y0 - 0.3, b.y1 + 0.3, 0, g + 1.0) // plinth
  cornice(b.x0, b.x1, b.y0, b.y1, g + 6.4, 0.5, 0.25) // string course over the ground floor
  hip(tile2, b.x0, b.x1, b.y0, b.y1, ZC + 0.4, ZR, 0.8)
  // chimneys: two pairs on the roof slopes
  for (const y of [b.y0 + 9, b.y1 - 9]) for (const x of [b.x0 + 9, b.x1 - 9]) box(wall, x - 0.7, x + 0.7, y - 0.5, y + 0.5, ZC + 2, ZC + 7.2)
  const front = (len: number) => 9, side = (len: number) => 7
  const centre3 = (i: number, n: number) => Math.abs(i - (n - 1) / 2) <= 1
  // fronts (east to the court, west to the garden): ground-floor doors in the centre, two arched tall floors, attic
  for (const f of ['e', 'w'] as Face[]) {
    windows(b.x0, b.x1, b.y0, b.y1, [f], front, [
      { z0: 1.8, z1: 5.0, w: 1.2, part: (i, n) => (centre3(i, n) ? null : win) },
      { z0: 7.6, z1: 11.2, w: 1.25, arched: centre3 },
      { z0: 13.2, z1: 18.2, w: 1.35, arched: centre3 },
      { z0: 20.0, z1: 21.9, w: 1.1 },
    ], g)
    const { len, at } = onFace(b.x0, b.x1, b.y0, b.y1, f)
    const bw = (len - 2.4) / 9
    for (const i of [3, 4, 5]) { const uc = 1.2 + bw * (i + 0.5); panel(win, at, uc - 1.2, uc + 1.2, g + 1.0, g + 5.8, true) }
    pilasters(b.x0, b.x1, b.y0, b.y1, f, [0.9, 1.2 + bw * 3, 1.2 + bw * 6, len - 0.9], g + 1.0, ZC - 0.8, 1.1)
    // the double open stair: two flights rising outward from the centre to a landing at the piano nobile
    const s = f === 'e' ? 1 : -1, xf = f === 'e' ? b.x1 : b.x0
    const yc = (b.y0 + b.y1) / 2, zl = g + 5.8
    box(trim, Math.min(xf, xf + s * 4.5), Math.max(xf, xf + s * 4.5), yc - 7, yc + 7, 0, zl) // landing
    for (const side of [-1, 1]) {
      const yA = yc + side * 7, yB = yc + side * 16 // the flight runs out from the landing to the ground
      const xa = Math.min(xf + s * 0.5, xf + s * 4.5), xb = Math.max(xf + s * 0.5, xf + s * 4.5)
      const lo = Math.min(yA, yB), hi = Math.max(yA, yB)
      const zA = zl, zB = g + 0.3
      const zAt = (y: number) => (y === yA ? zA : zB)
      // a sloped wedge: top surface from (yA, zA) to (yB, zB), sides down to 0
      const t0: V3 = [xa, lo, zAt(lo)], t1: V3 = [xb, lo, zAt(lo)], t2: V3 = [xb, hi, zAt(hi)], t3: V3 = [xa, hi, zAt(hi)]
      trim.quad(t0, t1, t2, t3)
      trim.quad([xa, lo, 0], [xa, hi, 0], t3, t0) // west side
      trim.quad([xb, hi, 0], [xb, lo, 0], t1, t2) // east side
      if (side > 0) trim.quad([xa, hi, 0], [xb, hi, 0], t2, t3); else trim.quad([xb, lo, 0], [xa, lo, 0], t0, t1)
    }
  }
  windows(b.x0, b.x1, b.y0, b.y1, ['n', 's'], side, [
    { z0: 7.4, z1: 11.6, w: 1.5 }, { z0: 12.8, z1: 18.6, w: 1.5 }, { z0: 19.8, z1: 22.0, w: 1.3 },
  ], g)
}

/** A gallery: two storeys, open arcade below, balustraded flat roof. */
function gallery(b: Block) {
  const g = ground(mid(b)), Z = g + 10.5
  box(wall, b.x0, b.x1, b.y0, b.y1, 0, Z, false)
  box(trim, b.x0, b.x1, b.y0, b.y1, Z - 0.01, Z) // the terrace
  cornice(b.x0, b.x1, b.y0, b.y1, Z, 0.6, 0.3)
  // solid parapet for the balustrade, ends left open to the pavilions
  for (const [x0, x1] of [[b.x0, b.x0 + 0.5], [b.x1 - 0.5, b.x1]]) box(trim, x0, x1, b.y0, b.y1, Z, Z + 1.1)
  const arc = (len: number) => 5
  windows(b.x0, b.x1, b.y0, b.y1, ['e', 'w'], arc, [
    { z0: 0.2, z1: 4.6, w: 2.8, arched: () => true },
    { z0: 6.0, z1: 8.8, w: 1.4 },
  ], g, 0.8)
}

/** A pavilion: three storeys, steep hipped roof with dormers. */
function pavilion(b: Block, cor: number, top: number, bays: number) {
  const g = ground(mid(b))
  box(wall, b.x0, b.x1, b.y0, b.y1, 0, g + cor, false)
  cornice(b.x0, b.x1, b.y0, b.y1, g + cor + 0.4, 0.9, 0.5)
  box(trim, b.x0 - 0.25, b.x1 + 0.25, b.y0 - 0.25, b.y1 + 0.25, 0, g + 0.8)
  hip(tile, b.x0, b.x1, b.y0, b.y1, g + cor + 0.4, g + top, 0.7)
  windows(b.x0, b.x1, b.y0, b.y1, ['e', 'w', 'n', 's'], () => bays, [
    { z0: 1.3, z1: 3.8, w: 1.3 }, { z0: 5.4, z1: 8.4, w: 1.4 }, { z0: 9.9, z1: 12.6, w: 1.4 },
  ], g)
  // dormers: one per face, a small gabled box on the roof slope
  const zc = g + cor + 0.4, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2
  const hx = (b.x1 - b.x0) / 2, hy = (b.y1 - b.y0) / 2, run = 0.42 // fraction of the way up the slope
  const h = top - cor - 0.4
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const r = dx ? hx : hy
    const px = cx + dx * r * (1 - run), py = cy + dy * r * (1 - run), z = zc + h * run * 0.95
    const w = 1.0, d = 1.2
    const x0 = dx ? Math.min(px, px - dx * d) : px - w, x1 = dx ? Math.max(px, px - dx * d) : px + w
    const y0 = dy ? Math.min(py, py - dy * d) : py - w, y1 = dy ? Math.max(py, py - dy * d) : py + w
    box(wall, x0, x1, y0, y1, z - 1.6, z + 0.6)
    const { at } = onFace(x0 - 0.02, x1 + 0.02, y0 - 0.02, y1 + 0.02, dx > 0 ? 'e' : dx < 0 ? 'w' : dy > 0 ? 'n' : 's')
    panel(win, at, 0.6, 1.4, z - 1.3, z + 0.3)
    box(tile, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15, z + 0.6, z + 0.9)
  }
}

/** A long wing: two storeys, hipped roof. */
function wing(b: Block, cor: number, top: number, rows: Row[], faces: Face[] = ['e', 'w']) {
  const g = ground(mid(b))
  box(wall, b.x0, b.x1, b.y0, b.y1, 0, g + cor, false)
  cornice(b.x0, b.x1, b.y0, b.y1, g + cor + 0.3, 0.7, 0.4)
  hip(tile, b.x0, b.x1, b.y0, b.y1, g + cor + 0.3, g + top, 0.6)
  windows(b.x0, b.x1, b.y0, b.y1, faces, (len) => Math.max(1, Math.round(len / 3.7)), rows, g)
}

// ---------------------------------------------------------------------------

function build() {
  central()
  for (const b of both({ x0: -90.9, x1: -79.8, y0: 13.9, y1: 35.3 })) gallery(b)
  for (const b of both({ x0: -94.7, x1: -71.0, y0: 35.3, y1: 60.4 })) pavilion(b, 14.3, 22.4, 7)
  for (const b of both({ x0: -67.7, x1: -47.2, y0: 58.0, y1: 81.0 })) pavilion(b, 14.3, 22.0, 6)
  // the link between the two pavilions (OSM way/311978907's west bulge), a stair hall
  for (const b of both({ x0: -75.4, x1: -67.7, y0: 58.0, y1: 70.0 })) {
    const g = ground(mid(b))
    box(wall, b.x0, b.x1, b.y0, b.y1, 0, g + 11)
    hip(tile, b.x0, b.x1, b.y0, b.y1, g + 11, g + 14, 0.4)
  }
  const two: Row[] = [{ z0: 1.4, z1: 4.0, w: 1.3 }, { z0: 5.6, z1: 8.6, w: 1.4 }]
  for (const b of both({ x0: -49.4, x1: -35.9, y0: 81.0, y1: 135.3 })) wing(b, 10.5, 16.0, two)
  for (const b of both({ x0: -40.9, x1: -36.2, y0: 135.3, y1: 172.0 })) {
    const g = ground(mid(b))
    box(wall, b.x0, b.x1, b.y0, b.y1, 0, g + 7, false)
    gable(tile, b.x0, b.x1, b.y0, b.y1, g + 7, g + 9.5, wall)
  }

  // The south quadrangle (Marstall, relation/12127738): wings round two courts.
  const three: Row[] = [{ z0: 1.4, z1: 3.9, w: 1.3 }, { z0: 5.3, z1: 8.1, w: 1.4 }, { z0: 9.3, z1: 11.6, w: 1.3 }]
  const S = { x0: -44.0, x1: 73.2, y0: -318.9, y1: -178.6 }
  wing({ x0: S.x0, x1: -30.0, y0: S.y0, y1: S.y1 }, 13, 19.5, three, ['w'])
  wing({ x0: 60.0, x1: S.x1, y0: S.y0, y1: S.y1 }, 13, 19.5, three, ['e'])
  wing({ x0: -30.0, x1: 60.0, y0: S.y0, y1: -304.0 }, 13, 19.5, three, ['s'])
  wing({ x0: -30.0, x1: 60.0, y0: -193.2, y1: S.y1 }, 13, 19.5, three, ['n'])
  wing({ x0: -30.0, x1: 60.0, y0: -274.0, y1: -257.6 }, 13, 19.5, [])

  // The north quadrangle (relation/12127745).
  const N = { x0: -49.3, x1: 67.6, y0: 172.0, y1: 313.1 }
  wing({ x0: N.x0, x1: -35.2, y0: N.y0, y1: N.y1 }, 11, 17, two, ['w'])
  wing({ x0: 54.9, x1: N.x1, y0: N.y0, y1: N.y1 }, 11, 17, two, ['e'])
  wing({ x0: -35.2, x1: 54.9, y0: N.y0, y1: 185.3 }, 11, 17, two, ['s'])
  wing({ x0: -35.2, x1: 54.9, y0: 298.5, y1: N.y1 }, 11, 17, two, ['n'])
  wing({ x0: -35.2, x1: 54.9, y0: 251.4, y1: 265.0 }, 11, 17, [])
  wing({ x0: -67.3, x1: N.x0, y0: 207.3, y1: 229.0 }, 9, 13, two, ['w'])

  const lit = (p: V3, n: V3) => (n[2] > 0.6 ? 0 : p[0] < -70 && p[1] > -30 && p[1] < 22 ? 0.9 : 0.5)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: wall, material: { ...finish('nymphenburg-white', 0xf0ece2), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, color: 0xf6eedc, floodlight: lit } },
    { part: tile, material: finish('nymphenburg-tile', 0xc5704f) },
    { part: tile2, material: finish('nymphenburg-tile-dark', 0xa9604c) },
    { part: win, material: PALETTE.window },
  ]
  return parts.filter((x) => x.part.triangles > 0)
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (parts.length > 6) throw new Error(`${parts.length} materials`)
  const glb = writeGlb('Schloss Nymphenburg', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    anchor: [48.1583221, 11.5045175], bearing: 357, elevation: 0,
  })
  if (triangles > 6500 || glb.length > 250_000) throw new Error(`budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
  const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
