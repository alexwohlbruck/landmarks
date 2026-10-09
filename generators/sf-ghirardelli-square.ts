/**
 * Ghirardelli Square, San Francisco: the Clock Tower Building, the Mustard
 * and Cocoa Buildings along North Point Street, and the rooftop sign that
 * spans them — original procedural geometry, CC0-1.0.
 * bun generators/sf-ghirardelli-square.ts
 *
 * Frame: built turned to the block, BEARING 351 (the Western Addition grid
 * runs 9° anticlockwise of north). x along North Point Street (+x = Larkin
 * Street, east), y across the block (+y = the plaza and Beach Street, north),
 * z up, metres. Origin = the area centroid of the four outlines modelled.
 *
 * Evidence
 * - OSM: Clock Tower Building way/939539785 with its tower part
 *   way/939539839 (the south-east corner, 6.5 x 6.3 m), the connector
 *   way/939539786, Mustard Building way/939539784, Cocoa Building
 *   way/288388853 (5 levels, 22 m). The square's other buildings are left to
 *   the map.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m: the lowest ground
 *   under the outlines is 17.0 m NAVD88 on the Cocoa Building's plaza side, so
 *   y = 0 is there; North Point Street runs at 20.5-21 m (+3.5 to +4). Roofs:
 *   Clock Tower Building 30.3 (+13.3) with its cornice and parapet to 31.3;
 *   connector 31.8; Mustard 35.0 (+18); Cocoa 39.5 (+22.5). Tower: the
 *   balustrade and corner pinnacles 42.5-46 (+25.5 to +29), the slate spire's
 *   top 51.5 (+34.5), finial 52.9 (+35.9). The sign: a line of returns 45 m
 *   long at local y = +2.5 over both roofs, the tall letters' tops at 48.3
 *   (+31.3) and the short ones' at 46.3 (+29.3).
 * - Published (Wikipedia, NRHP, SF Landmark No. 30): the Ghirardelli
 *   chocolate works, 1893-1916, by William Mooser II; the Clock Tower
 *   Building (1911) after the Château de Blois; the illuminated sign, 1923,
 *   is a city landmark in its own right; rehabilitated as a shopping square
 *   in 1964 (Wurster, Bernardi & Emmons; Lawrence Halprin).
 * - Commons daylight photos: "Ghirardelli Square Sign.JPG" (Ryan U, CC BY-SA
 *   3.0, the sign over the Mustard Building from Beach Street); "Ghirardelli
 *   Square Sign in San Francisco.jpg" (CC0, the sign's full length over the
 *   Mustard and Cocoa Buildings, crenellations and cream trim); "Ghirardelli
 *   Square, San Francisco 2023-07-20.jpg" (The wub, CC BY-SA 4.0, the tower
 *   and sign from the north-east); "Looking to North Point St from Larkin St,
 *   SF.jpg" and "Ghirardelli Square entrance, Larkin St, SF.jpg" (Roman
 *   Eugeniusz, CC BY-SA 3.0, the clock tower's stages and the Larkin front);
 *   "Ghiradelli Square sign from Aquatic Park Bathhouse, SF.jpg" (kevinmcgill,
 *   CC BY-SA 2.0, the sign's scaffold).
 *
 * Famous-sign exception (STYLE.md): the sign carries its lettering, as simple
 * extruded block letters (a plain sans, not the real serif face) standing on
 * a frame of chunky posts and rails in place of the real open lattice.
 *
 * Estimated from the photos: letter sizes (cap 6.4 m, x-height 4.4 m, from
 * the lidar's two top levels and the photos' ratio), the frame's posts, the
 * tower's stages (quoined brick shaft, string course, clock stage, cream
 * corbelled cornice and balustrade, corner pinnacles, a dormer each side of
 * the steep slate roof, its flat top), window rows and bays, the crenellated
 * parapets of the Mustard and Cocoa Buildings and the Clock Tower Building's
 * cornice.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 351
const ANCHOR = { lng: -122.42283442, lat: 37.80560018 }
const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), slate = new Part(), dark = new Part()
const letters = trim // the sign's letters are the same warm white as the trim

const STREET = 3.7 // North Point Street above y = 0

/** A box with chamfered vertical edges; `skip` leaves out walls ('s','e','n','w'). */
function block(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = part, skip = '') {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  const side = ['s', 'se', 'e', 'ne', 'n', 'nw', 'w', 'sw']
  for (let i = 0; i < 8; i++) {
    if (skip.includes(side[i]) && side[i].length === 1) continue
    const a = r[i], b = r[(i + 1) % 8]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}

/** A plain box without a bottom: the sign's frame members. */
function bar(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const q: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4]; part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]) }
  part.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
}

// A face of a rectangle: origin a, direction t, outward normal n (right of t).
type Face = { a: XY; t: XY; n: XY; len: number }
const face = (a: XY, b: XY): Face => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const at = (f: Face, s: number, d: number, z: number): V3 => [f.a[0] + f.t[0] * s + f.n[0] * d, f.a[1] + f.t[1] * s + f.n[1] * d, z]
const panel = (p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(f, s0, d, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s0, d, z1))
/** A small box on a face (pilaster, lintel, merlon): s0..s1 along, d0..d1 out from the wall, z0..z1. */
function relief(p: Part, f: Face, s0: number, s1: number, d1: number, z0: number, z1: number, d0 = 0) {
  p.quad(at(f, s0, d1, z0), at(f, s1, d1, z0), at(f, s1, d1, z1), at(f, s0, d1, z1))
  p.quad(at(f, s0, d0, z0), at(f, s0, d1, z0), at(f, s0, d1, z1), at(f, s0, d0, z1))
  p.quad(at(f, s1, d1, z0), at(f, s1, d0, z0), at(f, s1, d0, z1), at(f, s1, d1, z1))
  p.quad(at(f, s0, d1, z1), at(f, s1, d1, z1), at(f, s1, d0, z1), at(f, s0, d0, z1))
  if (z0 > 0.01 && d0 >= 0) p.quad(at(f, s0, d0, z0), at(f, s1, d0, z0), at(f, s1, d1, z0), at(f, s0, d1, z0))
  if (d0 < 0) p.quad(at(f, s1, d0, z0), at(f, s0, d0, z0), at(f, s0, d0, z1), at(f, s1, d0, z1))
}
const facesOf = (x0: number, x1: number, y0: number, y1: number): Record<string, Face> => ({
  s: face([x0, y0], [x1, y0]), e: face([x1, y0], [x1, y1]), n: face([x1, y1], [x0, y1]), w: face([x0, y1], [x0, y0]),
})

type Bldg = {
  x0: number; x1: number; y0: number; y1: number; h: number
  rows: [number, number][] // window rows, z ranges
  bay: number // window spacing
  blind?: string // faces without windows (party walls)
  skip?: string // faces left out entirely
  crenel?: boolean
}
function building(b: Bldg) {
  block(brick, b.x0, b.x1, b.y0, b.y1, 0, b.h, 0.3, roof, b.skip ?? '')
  const F = facesOf(b.x0, b.x1, b.y0, b.y1)
  for (const k of ['s', 'e', 'n', 'w']) {
    if ((b.blind ?? '').includes(k) || (b.skip ?? '').includes(k)) continue
    const f = F[k], n = Math.max(1, Math.round((f.len - 1.6) / b.bay)), w = (f.len - 1.6) / n
    for (let i = 0; i < n; i++) {
      const sc = 0.8 + w * (i + 0.5), hw = Math.min(0.85, w / 2 - 0.5)
      for (const [z0, z1] of b.rows) {
        if (k === 's' && z0 < STREET + 0.4) continue
        panel(win, f, sc - hw, sc + hw, z0, z1)
        panel(trim, f, sc - hw - 0.2, sc + hw + 0.2, z1, z1 + 0.4, 0.06) // cream lintel
      }
    }
  }
  // the parapet: a cream coping, and crenellations where the building has them
  for (const k of ['s', 'e', 'n', 'w']) {
    if ((b.skip ?? '').includes(k)) continue
    const f = F[k]
    relief(trim, f, -0.1, f.len + 0.1, 0.2, b.h - 0.9, b.h - 0.5)
    if (!b.crenel) continue
    const m = Math.max(2, Math.round(f.len / 2.6))
    for (let i = 0; i < m; i++) {
      const sc = (f.len * (i + 0.5)) / m
      relief(trim, f, sc - 0.45, sc + 0.45, 0.1, b.h - 0.5, b.h + 0.85, -0.5)
    }
  }
}

// --- The buildings (OSM outlines squared to the block) ---
const H_COCOA = 22.3, H_MUSTARD = 17.9, H_LINK = 14.8, H_CLOCK = 13.3
const rowsFrom = (z0: number, n: number, storey: number, win = 2.1): [number, number][] =>
  Array.from({ length: n }, (_, i) => [z0 + i * storey, z0 + i * storey + win] as [number, number])
building({ x0: -51.9, x1: -5.8, y0: -11.1, y1: 10.6, h: H_COCOA, rows: rowsFrom(1.4, 5, 4.1, 2.5), bay: 4.4, blind: 'e', crenel: true })
building({ x0: -5.8, x1: 34.3, y0: -11.0, y1: 6.6, h: H_MUSTARD, rows: rowsFrom(1.2, 4, 4.0, 2.5), bay: 4.2, blind: 'ew', skip: 'w', crenel: true })
building({ x0: 34.3, x1: 36.8, y0: -8.7, y1: 5.3, h: H_LINK, rows: [], bay: 3, blind: 'snew', skip: 'ew' })
// Clock Tower Building: an L round the tower, with a bold cream cornice.
const TW: [number, number, number, number] = [47.7, 54.2, -11.0, -4.7] // the tower's plan
building({ x0: 36.8, x1: 47.7, y0: -11.0, y1: 14.9, h: H_CLOCK, rows: rowsFrom(1.0, 3, 3.6, 2.3), bay: 3.4, blind: 'w', skip: 'e' })
building({ x0: 47.7, x1: 53.6, y0: -4.7, y1: 14.9, h: H_CLOCK, rows: rowsFrom(1.0, 3, 3.6, 2.3), bay: 3.4, skip: 'sw' })
for (const [f, s0, s1] of [
  [face([36.8, -11.0], [47.7, -11.0]), -0.3, 10.9], [face([53.6, -4.7], [53.6, 14.9]), 0, 19.9], [face([53.6, 14.9], [36.8, 14.9]), -0.3, 17.1],
] as [Face, number, number][]) {
  relief(trim, f, s0, s1, 0.45, H_CLOCK - 2.0, H_CLOCK - 0.9)
  relief(trim, f, s0, s1, 0.25, H_CLOCK - 2.4, H_CLOCK - 2.0)
}

// ---------------------------------------------------------------------------
// The clock tower.
{
  const [x0, x1, y0, y1] = TW
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
  const STRING = 18.1, CLOCK0 = 18.7, CORNICE = 23.0, PARAPET = 25.5, SPIRE = 34.4, FINIAL = 35.9
  block(brick, x0, x1, y0, y1, 0, CORNICE, 0.25, null)
  const F = facesOf(x0, x1, y0, y1)
  for (const k of ['s', 'e', 'n', 'w']) {
    const f = F[k]
    // cream quoined corners
    relief(trim, f, 0.1, 0.85, 0.12, H_CLOCK, CORNICE)
    relief(trim, f, f.len - 0.85, f.len - 0.1, 0.12, H_CLOCK, CORNICE)
    // the clock: a pale chapter ring on the brick, with a darker hub
    const sc = f.len / 2, zc = (CLOCK0 + CORNICE) / 2, R = 1.75, n = 16
    const pt = (r: number, a: number, d: number) => at(f, sc + r * Math.cos(a), d, zc + r * Math.sin(a))
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
      trim.quad(pt(R, a0, 0.05), pt(R, a1, 0.05), pt(R - 0.45, a1, 0.05), pt(R - 0.45, a0, 0.05))
    }
    for (let i = 0; i < 8; i++) {
      const a0 = (i / 8) * 2 * Math.PI, a1 = ((i + 1) / 8) * 2 * Math.PI
      dark.tri(at(f, sc, 0.05, zc), pt(0.35, a0, 0.05), pt(0.35, a1, 0.05))
    }
    // a tall slit window in the shaft, where it shows above the roofs
    if (k === 's' || k === 'e') panel(win, f, sc - 0.4, sc + 0.4, 14.2, 16.8)
  }
  // string course under the clock stage, the cornice band and the balustrade
  block(trim, x0 - 0.25, x1 + 0.25, y0 - 0.25, y1 + 0.25, STRING, CLOCK0, 0.2, trim)
  block(trim, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15, CORNICE, CORNICE + 1.3, 0.2, null)
  block(trim, x0 - 0.5, x1 + 0.5, y0 - 0.5, y1 + 0.5, CORNICE + 1.3, CORNICE + 1.8, 0.25, trim)
  block(trim, x0 - 0.35, x1 + 0.35, y0 - 0.35, y1 + 0.35, CORNICE + 1.8, PARAPET, 0.2, roof)
  // corner pinnacles: square turrets with pointed caps
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const px = cx + sx * (hx - 0.2), py = cy + sy * (hy - 0.2)
    block(trim, px - 0.5, px + 0.5, py - 0.5, py + 0.5, PARAPET, PARAPET + 2.2, 0.15, null)
    const tip: V3 = [px, py, PARAPET + 3.3]
    const q: V3[] = [[px - 0.55, py - 0.55, PARAPET + 2.2], [px + 0.55, py - 0.55, PARAPET + 2.2], [px + 0.55, py + 0.55, PARAPET + 2.2], [px - 0.55, py + 0.55, PARAPET + 2.2]]
    for (let i = 0; i < 4; i++) trim.tri(q[i], q[(i + 1) % 4], tip)
  }
  // the steep slate roof: a truncated pyramid with a flat, crested top
  const b0 = 2.65, b1 = 0.75
  const ring = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  slate.loft([ring(b0, PARAPET), ring(b1, SPIRE)])
  block(trim, cx - b1 - 0.1, cx + b1 + 0.1, cy - b1 - 0.1, cy + b1 + 0.1, SPIRE, SPIRE + 0.45, 0.1, trim)
  block(dark, cx - 0.09, cx + 0.09, cy - 0.09, cy + 0.09, SPIRE + 0.45, FINIAL, 0.02, dark)
  // a gabled dormer on each face of the roof
  const slope = (b0 - b1) / (SPIRE - PARAPET)
  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2, c = Math.cos(ang), s = Math.sin(ang)
    const P = (u: number, v: number, z: number): V3 => [cx + c * v - s * u, cy + s * v + c * u, z] // u across the face, v outward
    const w = 1.0, z0 = PARAPET, z1 = PARAPET + 3.3, zr = z1 + 1.2, front = b0 + 0.05
    const back = (z: number) => b0 - slope * (z - PARAPET) - 0.3
    trim.quad(P(-w, front, z0), P(w, front, z0), P(w, front, z1), P(-w, front, z1)) // dormer face
    trim.tri(P(-w, front, z1), P(w, front, z1), P(0, front, zr)) // gable
    for (const sg of [-1, 1]) {
      const a = P(sg * w, front, z0), b = P(sg * w, back(z1), z1), d = P(sg * w, front, z1)
      if (sg < 0) trim.tri(a, d, b); else trim.tri(a, b, d)
      // gable roof slope
      const r0 = P(sg * w, front, z1), r1 = P(0, front, zr), r2 = P(0, back(zr), zr), r3 = P(sg * w, back(z1), z1)
      if (sg < 0) slate.quad(r0, r1, r2, r3); else slate.quad(r1, r0, r3, r2)
    }
    win.quad(P(-0.5, front + 0.05, z0 + 0.6), P(0.5, front + 0.05, z0 + 0.6), P(0.5, front + 0.05, z1 - 0.4), P(-0.5, front + 0.05, z1 - 0.4))
  }
}

// ---------------------------------------------------------------------------
// The sign: "Ghirardelli" in block letters on a frame of posts and rails,
// standing across the Mustard and Cocoa roofs. Letters face north, the plaza
// and the bay, so the G is at the east end; from North Point Street they read from behind.
{
  const CAP = 6.4, XH = 4.4, ST = 1.1, DEPTH = 0.45
  const SY = 2.5 // the sign's line, local y
  const BASE = 24.9 // letters' baseline
  const X0 = -31.2, X1 = 14.4
  // 2D shapes in letter space (u along, v up from the baseline); extruded in y.
  type Poly = [number, number][] & { hide?: number[] }
  const glyphs: { w: number; polys: Poly[] }[] = []
  const rect = (u0: number, v0: number, u1: number, v1: number): Poly => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  /** Annulus sectors from a0 to a1 (anticlockwise), as quads. */
  const arc = (cu: number, cv: number, r: number, a0: number, a1: number, n = 10): Poly[] => {
    const out: Poly[] = []
    for (let i = 0; i < n; i++) {
      const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n, ri = r - ST
      const q: Poly = [[cu + ri * Math.cos(t0), cv + ri * Math.sin(t0)], [cu + r * Math.cos(t0), cv + r * Math.sin(t0)], [cu + r * Math.cos(t1), cv + r * Math.sin(t1)], [cu + ri * Math.cos(t1), cv + ri * Math.sin(t1)]]
      // radial edges between neighbouring sectors are inside the stroke
      q.hide = [...(i > 0 ? [0] : []), ...(i < n - 1 ? [2] : [])]
      out.push(q)
    }
    return out
  }
  const D = Math.PI / 180
  const R = XH / 2
  const G = { w: CAP, polys: [...arc(CAP / 2, CAP / 2, CAP / 2, 35 * D, 360 * D, 12), rect(CAP / 2, CAP / 2 - ST / 2 - 0.4, CAP, CAP / 2 + ST / 2 - 0.4), rect(CAP - ST, 0.8, CAP, CAP / 2 + ST / 2 - 0.4)] }
  const h = { w: XH - 0.2, polys: [rect(0, 0, ST, CAP), rect(XH - 0.2 - ST, 0, XH - 0.2, XH - R + 0.2), ...arc((XH - 0.2) / 2, XH - R + 0.2, (XH - 0.2) / 2, 0, 180 * D, 6)] }
  const i = { w: ST, polys: [rect(0, 0, ST, XH), rect(0, XH + 0.8, ST, XH + 0.8 + ST)] }
  const r = { w: 2.9, polys: [rect(0, 0, ST, XH), ...arc(2.2, XH - 2.2, 2.2, 90 * D, 180 * D, 5).map((p) => p), rect(2.2, XH - ST, 2.9, XH)] }
  const a = { w: XH - 0.2, polys: [...arc(R - 0.1, R, R, 0, 360 * D, 10), rect(XH - 0.2 - ST, 0, XH - 0.2, XH)] }
  const d = { w: XH - 0.2, polys: [...arc(R - 0.1, R, R, 0, 360 * D, 10), rect(XH - 0.2 - ST, 0, XH - 0.2, CAP)] }
  const e = { w: XH, polys: [...arc(R, R, R, 0, 320 * D, 10), rect(0.3, R - ST / 2, XH - 0.3, R + ST / 2)] }
  const l = { w: ST, polys: [rect(0, 0, ST, CAP)] }
  glyphs.push(G, h, i, r, a, r, d, e, l, l, i)
  const total = glyphs.reduce((s, g) => s + g.w, 0)
  const gap = (X1 - X0 - total) / (glyphs.length - 1)
  let u = X0
  const y0 = SY - DEPTH / 2, y1 = SY + DEPTH / 2
  for (const g of glyphs) {
    for (const p of g.polys) {
      // read from the north, so the word runs east to west: x = X0 + X1 - u.
      // The mirror reverses the polygon's turn in (x, z), hence the windings below.
      const pts = p.map(([pu, pv]): [number, number] => [X0 + X1 - (u + pu), BASE + pv])
      for (let k = 1; k < pts.length - 1; k++) {
        letters.tri([pts[0][0], y1, pts[0][1]], [pts[k][0], y1, pts[k][1]], [pts[k + 1][0], y1, pts[k + 1][1]])
        letters.tri([pts[0][0], y0, pts[0][1]], [pts[k + 1][0], y0, pts[k + 1][1]], [pts[k][0], y0, pts[k][1]])
      }
      for (let k = 0; k < pts.length; k++) {
        if (p.hide?.includes(k)) continue
        const A = pts[k], B = pts[(k + 1) % pts.length]
        letters.quad([A[0], y0, A[1]], [B[0], y0, B[1]], [B[0], y1, B[1]], [A[0], y1, A[1]])
      }
    }
    u += g.w + gap
  }
  // the frame: two rails under the letters and posts down to the roofs
  const roofAt = (x: number) => (x < -5.8 ? H_COCOA : H_MUSTARD)
  bar(dark, X0 - 0.5, X1 + 0.5, SY - 0.2, SY + 0.2, BASE - 0.5, BASE)
  bar(dark, X0 - 0.5, X1 + 0.5, SY - 0.2, SY + 0.2, BASE + CAP - 1.2, BASE + CAP - 0.8)
  for (let k = 0; k <= 10; k++) {
    const x = X0 - 0.3 + ((X1 - X0 + 0.6) * k) / 10
    bar(dark, x - 0.18, x + 0.18, SY - 0.18, SY + 0.18, roofAt(x), BASE + CAP - 0.8)
    // a back leg: the frame is a deep truss, braced from behind
    bar(dark, x - 0.15, x + 0.15, SY - 3.2, SY - 2.9, roofAt(x), BASE)
  }
  bar(dark, X0 - 0.5, X1 + 0.5, SY - 3.2, SY - 2.9, BASE - 0.4, BASE)
  for (let k = 0; k <= 10; k++) {
    const x = X0 - 0.3 + ((X1 - X0 + 0.6) * k) / 10
    bar(dark, x - 0.12, x + 0.12, SY - 2.9, SY - 0.2, BASE - 0.4, BASE)
  }
}

// Close the bottom.
for (const [x0, x1, y0, y1] of [[-51.9, 34.3, -11.1, 10.6], [36.8, 53.6, -11.0, 14.9]]) brick.quad([x0, y0, 0], [x0, y1, 0], [x1, y1, 0], [x1, y0, 0])

const parts = [
  { part: brick, material: finish('ghirardelli-brick', 0xc4826c) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: slate, material: finish('slate', 0x8e867d) },
  { part: dark, material: finish('sign-steel', 0x6e747b) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Ghirardelli Square', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 35.9,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/939539785', 'way/939539839', 'way/939539786', 'way/939539784', 'way/288388853'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-ghirardelli-square.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
