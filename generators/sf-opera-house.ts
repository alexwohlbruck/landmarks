/**
 * War Memorial Opera House, San Francisco — original procedural geometry,
 * CC0-1.0.
 * bun generators/sf-opera-house.ts
 *
 * Also the shared kit for its near-twin, generators/sf-veterans-building.ts,
 * which imports `warMemorial()` and the solids below, so the two stay
 * consistent.
 *
 * Frame: built turned to the street grid, BEARING 350.7 (Van Ness Avenue runs
 * 9.3° west of north). x across the block (+x = the Van Ness front, east),
 * y along it (+y north), z up, metres. Origin = area centroid of the OSM
 * outline way/32865161. The building is drawn symmetric about y = VC, its
 * measured centre line. y = 0 is the lowest ground the building touches (the
 * Grove Street drive on the south side, 19.2 m NAVD88); Van Ness and the court
 * are ~1.3 m higher, and the walls run down to y = 0 all round.
 *
 * Evidence
 * - OSM way/32865161 (civic, height 44, no building:parts).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m, sampled in the turned
 *   frame (/tmp/city/sf/work/sf-opera-house): the plan sits 1.5 m east and
 *   1.5 m south of the OSM outline, and the lidar wins. Measured: colonnade
 *   front x = 50.9, its cornice 20.3 and ledge 21.6; attic 24.3; the mansard
 *   rising ~6.5 m inward to a flat roof at 31; side walls |y| = 28.8 with the
 *   same cornice and attic; corner pavilions to |y| = 37.2 between x = 25.5
 *   and 43.5, joined to the colonnade by concave quadrant walls, their hipped
 *   caps peaking at 30; the stage block behind (x -53.5..-36, |y| 24.5) with
 *   the same mansard; the fly tower x -31.5..-6.5, |y| 21.9, cornice 40.2-41.5,
 *   its hipped roof to a flat top at 46.4 (a ridge reads 47.9); the Grove
 *   Street porte-cochère canopy 6 m up, 5 m deep.
 * - Published (Wikipedia, NRHP Civic Center district): 1932, Arthur Brown Jr.
 *   with G. Albert Lansburgh; granite and terra cotta; Doric colonnade on a
 *   rusticated arcaded base.
 * - Photos (Wikimedia Commons): "War Memorial Opera House (San Francisco).JPG"
 *   (Sanfranman59, CC BY-SA 3.0, the Van Ness front square on: 8 column pairs,
 *   7 arches); "San Francisco Opera House, July 2015.jpg" (Chris06, CC BY-SA
 *   4.0, the colonnade from the north-east); "War Memorial Opera House
 *   side.jpg" (Andreas Praefcke, CC BY 3.0, the south side, pavilion, fly
 *   tower); "OPERA HOUSE, CORNER VIEW ... HABS CAL,38-SANFRA,71-B-1" (HABS,
 *   public domain, from the south-east, the concave corners and the separate
 *   pavilion hips); "Aerial view of the Beaux Arts Civic Center of SF.jpg"
 *   (Dllu, CC BY-SA 4.0, from above the south-east: the roofs, the side
 *   arcades of arched windows over a ground arcade, the attic windows);
 *   "San Francisco City Hall, War Memorial Opera House, War Memorial Veterans
 *   Building.jpg" (Yair Haklai, CC BY-SA 4.0, the court sides).
 *
 * Estimated from the photos: the storey lines of the front (base and
 * balustrade to 10.4, columns to 18.8, from the photo's column-to-base ratio),
 * the column size (1.4 m) and pair spacing (6.55 m), the arches (3 m wide), the side arcade (ten tall arched
 * windows over ten ground arches on the main body, three on the stage block),
 * the attic windows, the pavilion niches, and the rear (west) face, which no
 * photo shows: drawn as three rows of plain windows. The fly tower's blind
 * panels are drawn as pilaster strips. Colours: granite as City Hall's
 * (sf-city-hall.ts), the mansard grey-green metal from the photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------------------
// Polygons

export const area = (r: XY[]) => {
  let s = 0
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s / 2
}

export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** Offset a counter-clockwise ring inwards by d (outwards if negative), mitred. */
export function inset(r: XY[], d: number): XY[] {
  const n = r.length
  const nrm = (a: XY, b: XY): XY => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]
  }
  return r.map((c, i) => {
    const n1 = nrm(r[(i - 1 + n) % n], c), n2 = nrm(c, r[(i + 1) % n])
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [c[0] + ((n1[0] + n2[0]) / Math.max(k, 0.2)) * d, c[1] + ((n1[1] + n2[1]) / Math.max(k, 0.2)) * d] as XY
  })
}

/** Cut every sharp convex corner of a counter-clockwise ring by d, for a bevelled edge. */
export function chamfer(r: XY[], d: number): XY[] {
  const out: XY[] = []
  const n = r.length
  for (let i = 0; i < n; i++) {
    const p = r[(i - 1 + n) % n], c = r[i], q = r[(i + 1) % n]
    const a: XY = [p[0] - c[0], p[1] - c[1]], b: XY = [q[0] - c[0], q[1] - c[1]]
    const la = Math.hypot(...a), lb = Math.hypot(...b)
    const turn = (c[0] - p[0]) * (q[1] - c[1]) - (c[1] - p[1]) * (q[0] - c[0])
    const cos = (a[0] * b[0] + a[1] * b[1]) / (la * lb)
    if (turn > 0 && cos > -0.5 && la > 2.5 * d && lb > 2.5 * d) {
      out.push([c[0] + (a[0] / la) * d, c[1] + (a[1] / la) * d], [c[0] + (b[0] / lb) * d, c[1] + (b[1] / lb) * d])
    } else out.push(c)
  }
  return out
}

/** Ear clipping for a simple counter-clockwise ring. */
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i)
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = r[ia], b = r[ib], c = r[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(r[j], a, b, c))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** Points on a circle from angle a0 to a1 (radians), both ends included. */
export function arc(c: XY, R: number, a0: number, a1: number, n: number): XY[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)] as XY
  })
}

/** A circular arc from p to q bulging by `sag` to the right of p→q (negative: to the left). */
export function bulge(p: XY, q: XY, sag: number, n: number): XY[] {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), s = Math.abs(sag)
  const R = (L * L) / 4 / (2 * s) + s / 2
  const m: XY = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const right: XY = [(q[1] - p[1]) / L, -(q[0] - p[0]) / L], k = Math.sign(sag)
  const c: XY = [m[0] - right[0] * k * (R - s), m[1] - right[1] * k * (R - s)]
  let a0 = Math.atan2(p[1] - c[1], p[0] - c[0]), a1 = Math.atan2(q[1] - c[1], q[0] - c[0])
  // take the short way round
  while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI
  while (a0 - a1 > Math.PI) a1 += 2 * Math.PI
  return arc(c, R, a0, a1, n)
}

// ---------------------------------------------------------------------------
// Solids

/** Walls of a counter-clockwise ring between two heights, facing out (optionally lofted to r1). */
export function walls(p: Part, r: XY[], z0: number, z1: number, r1: XY[] = r, skip?: (i: number) => boolean) {
  for (let i = 0; i < r.length; i++) {
    if (skip?.(i)) continue
    const j = (i + 1) % r.length
    p.quad([r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1])
  }
}

export function cap(p: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
}

/** A flat-topped prism over a counter-clockwise ring. */
export function prism(wall: Part, top: Part | null, r: XY[], z0: number, z1: number, bottom?: Part) {
  walls(wall, r, z0, z1)
  if (top) cap(top, r, z1)
  if (bottom) cap(bottom, r, z0, false)
}

/** A projecting band: a prism on the ring pushed out by `out`, with its underside. */
export function band(p: Part, r: XY[], out: number, z0: number, z1: number) {
  const o = inset(r, -out)
  prism(p, p, o, z0, z1, p)
}

/**
 * A hipped roof over a rectangle: slopes from the rectangle at z0 up to a
 * flat top inset by d, collapsing to a ridge where the rectangle is narrower
 * than 2d.
 */
export function hipRect(side: Part, top: Part | null, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, d: number) {
  const dx = Math.min(d, (x1 - x0) / 2), dy = Math.min(d, (y1 - y0) / 2)
  const lo = rect(x0, y0, x1, y1), hi = rect(x0 + dx, y0 + dy, x1 - dx, y1 - dy)
  walls(side, lo, z0, z1, hi)
  if (top && x1 - x0 > 2 * d + 0.01 && y1 - y0 > 2 * d + 0.01) cap(top, hi, z1)
}

/** A smooth upright cylinder (a column), with a flat top. */
export function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 10, top = true) {
  for (let i = 0; i < seg; i++) {
    const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    const A: V3 = [cx + r * n0[0], cy + r * n0[1], z0], B: V3 = [cx + r * n1[0], cy + r * n1[1], z0]
    const C: V3 = [B[0], B[1], z1], D: V3 = [A[0], A[1], z1]
    p.tri(A, B, C, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n0])
    if (top) p.tri([cx, cy, z1], D, C)
  }
}

/** An axis-aligned box with its top and sides (no underside unless asked). */
export function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, under = false) {
  prism(p, p, rect(x0, y0, x1, y1), z0, z1, under ? p : undefined)
}

// ---------------------------------------------------------------------------
// Facade panels: flat shapes set 6 cm proud of a wall, oriented to face `n`.

const ori = (A: XY, B: XY, n: XY): [XY, XY] => ((B[1] - A[1]) * n[0] - (B[0] - A[0]) * n[1] >= 0 ? [A, B] : [B, A])

/** A rectangle on the wall through A–B (plan points), facing n, between z0 and z1. */
export function panel(p: Part, A: XY, B: XY, n: XY, z0: number, z1: number, o = 0.06) {
  const [a, b] = ori(A, B, n)
  const P = (q: XY, z: number): V3 => [q[0] + n[0] * o, q[1] + n[1] * o, z]
  p.quad(P(a, z0), P(b, z0), P(b, z1), P(a, z1))
}

/** A round-headed opening A–B wide, from z0 to its crown zc (a true semicircle). */
export function arched(p: Part, A: XY, B: XY, n: XY, z0: number, zc: number, o = 0.06, seg = 8) {
  const [a, b] = ori(A, B, n)
  const w = Math.hypot(b[0] - a[0], b[1] - a[1]), rad = w / 2, spring = zc - rad
  const u: XY = [(b[0] - a[0]) / w, (b[1] - a[1]) / w], m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const P = (s: number, z: number): V3 => [m[0] + u[0] * s + n[0] * o, m[1] + u[1] * s + n[1] * o, z]
  if (spring > z0) p.quad(P(-rad, z0), P(rad, z0), P(rad, spring), P(-rad, spring))
  for (let i = 0; i < seg; i++) {
    const t0 = (Math.PI * i) / seg, t1 = (Math.PI * (i + 1)) / seg
    p.tri(P(0, spring), P(rad * Math.cos(t0), spring + rad * Math.sin(t0)), P(rad * Math.cos(t1), spring + rad * Math.sin(t1)))
  }
}

/** A proud vertical strip (pilaster or fin) on the wall through A–B, `d` deep. */
export function strip(p: Part, A: XY, B: XY, n: XY, z0: number, z1: number, d: number) {
  const [a, b] = ori(A, B, n)
  const Q = (q: XY, o: number, z: number): V3 => [q[0] + n[0] * o, q[1] + n[1] * o, z]
  p.quad(Q(a, d, z0), Q(b, d, z0), Q(b, d, z1), Q(a, d, z1))
  p.quad(Q(a, 0, z0), Q(a, d, z0), Q(a, d, z1), Q(a, 0, z1))
  p.quad(Q(b, d, z0), Q(b, 0, z0), Q(b, 0, z1), Q(b, d, z1))
  p.quad(Q(a, 0, z1), Q(a, d, z1), Q(b, d, z1), Q(b, 0, z1))
}

/** Move parts in the map frame after building (x east, y north). */
export function shift(parts: Part[], dx: number, dy: number) {
  for (const p of parts) for (let i = 0; i < p.pos.length; i += 3) { p.pos[i] += dx; p.pos[i + 2] -= dy }
}

// ---------------------------------------------------------------------------
// The War Memorial pair: a Doric colonnade over a rusticated arcade on the
// Van Ness front, concave quadrant walls to corner pavilions, a long body
// with arcaded sides, a cornice, an attic and a mansard.

export type WarMemorialSpec = {
  front: number // x of the base, entablature and quadrant ends
  loggia: number // x of the wall behind the columns
  colHalf: number // half-width of the colonnade
  pav: { x0: number; x1: number; half: number; hA: number } // pavilions; hA = where the quadrant meets their face
  sag: number // how far the quadrant walls curve in
  body: { x0: number; half: number }
  rear?: { x0: number; half: number } // a narrower block behind (the opera's stage)
  z: { ground: number; base: number; colTop: number; cornice: number; ledge: number; attic: number; top: number; pavTop: number }
  atticIn: number // attic face behind the wall face
  mansardIn: number // how far the mansard climbs inward
  pairs: number; pairStep: number; colR: number; colGap: number
  loggiaArches: boolean // round-headed loggia windows (Veterans) or square (Opera)
  sides: { x0: number; x1: number; n: number; half: number }[] // arcaded side runs
  upper: { w: number; z0: number; zc: number } // tall arched windows
  lower: { w: number; z0: number; zc: number } // ground-floor arches
  glassFrom?: number // the mansard is glazed above this height (Veterans)
}

export type WarMemorialParts = { granite: Part; light: Part; windows: Part; metal: Part; roof: Part; glass: Part }

/** The plan outline (counter-clockwise), and the two quadrant arcs for reuse. */
export function warMemorialPlan(s: WarMemorialSpec) {
  const { front, colHalf, pav, body, rear } = s
  const qS = bulge([pav.x1, -pav.hA], [front, -colHalf], -s.sag, 6) // concave: bows into the building
  const qN = bulge([front, colHalf], [pav.x1, pav.hA], -s.sag, 6)
  const ring: XY[] = []
  if (rear) ring.push([rear.x0, -rear.half], [body.x0, -rear.half])
  ring.push([body.x0, -body.half], [pav.x0, -body.half], [pav.x0, -pav.half], [pav.x1, -pav.half])
  ring.push(...qS, ...qN)
  ring.push([pav.x1, pav.half], [pav.x0, pav.half], [pav.x0, body.half], [body.x0, body.half])
  if (rear) ring.push([body.x0, rear.half], [rear.x0, rear.half])
  return { ring, qS, qN }
}

export function warMemorial(s: WarMemorialSpec, P: WarMemorialParts) {
  const { granite, light, windows, metal, roof, glass } = P
  const { front, loggia, colHalf, pav, body, rear, z } = s
  const { ring: ring0, qS, qN } = warMemorialPlan(s)
  const ring = chamfer(ring0, 0.45)
  // Find the colonnade edge (front, -colHalf)→(front, colHalf) in the bevelled ring.
  const isFront = (i: number) => {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    return Math.abs(a[0] - front) < 0.01 && Math.abs(b[0] - front) < 0.01 && a[1] < 0 && b[1] > 0
  }

  // Walls up to the cornice, except the colonnade bay, which is open above the base.
  walls(granite, ring, 0, z.cornice, ring, isFront)
  const F0: XY = [front, -colHalf], F1: XY = [front, colHalf]
  panelWall(granite, F0, F1, 0, z.base)
  panelWall(granite, F0, F1, z.colTop, z.cornice)
  // The loggia: back wall, end walls, floor and ceiling. Its walls are in deep shade in
  // every photo, which is what makes the columns stand out, so they take the darker
  // roof grey rather than the sunlit granite.
  panelWall(roof, [loggia, -colHalf], [loggia, colHalf], z.base, z.colTop)
  panelWall(roof, [loggia, colHalf], [front, colHalf], z.base, z.colTop)
  panelWall(roof, [front, -colHalf], [loggia, -colHalf], z.base, z.colTop)
  cap(granite, rect(loggia, -colHalf, front, colHalf), z.base)
  cap(roof, rect(loggia, -colHalf, front, colHalf), z.colTop, false)

  // Stringcourse on the base, cornice band and ledge, attic, attic coping.
  band(light, ring, 0.22, z.base - 0.7, z.base - 0.03)
  band(light, ring, 0.35, z.cornice - 0.8, z.cornice)
  prism(light, light, inset(ring, 0.5), z.cornice, z.ledge)
  const attic = inset(ring0, s.atticIn)
  walls(granite, attic, z.ledge, z.attic - 0.45)
  band(light, attic, 0.25, z.attic - 0.45, z.attic) // the coping, which is also the attic's top

  // Mansards: the long body (with its front) and the stage block; hipped caps on the pavilions.
  const ai = s.atticIn, mi = s.mansardIn
  const mansard = (x0: number, x1: number, h: number) => {
    if (s.glassFrom === undefined) return hipRect(metal, roof, x0, x1, -h, h, z.attic, z.top, mi)
    // Veterans: metal below, a continuous band of skylight glazing above.
    const t = (s.glassFrom - z.attic) / (z.top - z.attic), d = mi * t
    hipRect(metal, null, x0, x1, -h, h, z.attic, s.glassFrom, d)
    hipRect(glass, roof, x0 + d, x1 - d, -h + d, h - d, s.glassFrom, z.top, mi - d)
  }
  // The body's mansard stops short of the quadrants; the front block gets its own hip over
  // the colonnade, which the photos show as a separate roof.
  mansard(body.x0 + ai, pav.x1 + 0.5, body.half - ai)
  mansard(pav.x0 + 4, front - ai - 0.1, colHalf - 1.2)
  if (rear) mansard(rear.x0 + ai, body.x0 + mi, rear.half - ai)
  for (const k of [-1, 1]) {
    const y0 = k > 0 ? body.half - ai : -pav.half + ai, y1 = k > 0 ? pav.half - ai : -(body.half - ai)
    hipRect(metal, roof, pav.x0 + ai, pav.x1 - ai, y0, y1, z.attic, z.pavTop, 4.8)
  }

  // The colonnade: paired Doric columns on plinths, with abaci.
  const cx = front - s.colR - 0.2
  for (let k = 0; k < s.pairs; k++) {
    const yc = (k - (s.pairs - 1) / 2) * s.pairStep
    for (const dy of [-s.colGap / 2, s.colGap / 2]) {
      const y = yc + dy, h = s.colR + 0.15
      box(light, cx - h, cx + h, y - h, y + h, z.base, z.base + 0.45)
      cyl(light, cx, y, s.colR, z.base + 0.45, z.colTop - 0.4, 12, false)
      box(light, cx - h, cx + h, y - h, y + h, z.colTop - 0.4, z.colTop, true)
    }
  }
  // The loggia reads as a deep shadow behind the columns: its glazed back wall is one dark
  // band (lit at night, as the real one is), or a row of tall arches (Veterans). The base
  // arcade sits under it.
  if (!s.loggiaArches) panel(windows, [loggia, -colHalf + 0.3], [loggia, colHalf - 0.3], [1, 0], z.base + 0.3, z.colTop - 0.2)
  else for (let k = 0; k < s.pairs; k++) {
    // Veterans: the wall behind each pair is in shadow too, so the columns stand out
    // against dark on both sides; only the spandrels over the arches stay light.
    const yc = (k - (s.pairs - 1) / 2) * s.pairStep, h = s.colGap / 2 + s.colR + 0.5
    panel(windows, [loggia, Math.max(yc - h, -colHalf + 0.3)], [loggia, Math.min(yc + h, colHalf - 0.3)], [1, 0], z.base + 0.3, z.colTop - 0.2)
  }
  for (let k = 0; k < s.pairs - 1; k++) {
    const yc = (k - (s.pairs - 2) / 2) * s.pairStep, w = s.pairStep - s.colGap - 2 * s.colR - 1.0
    if (s.loggiaArches) arched(windows, [loggia, yc - w / 2 - 0.05], [loggia, yc + w / 2 + 0.05], [1, 0], z.base + 0.3, z.colTop - 0.35)
    arched(windows, [front, yc - 1.5], [front, yc + 1.5], [1, 0], z.ground + 0.3, z.base - 3.6)
  }
  // Attic windows over the front bays.
  for (let k = 0; k < s.pairs - 1; k++) {
    const yc = (k - (s.pairs - 2) / 2) * s.pairStep, xa = front - s.atticIn
    panel(windows, [xa, yc - 0.75], [xa, yc + 0.75], [1, 0], z.ledge + 0.6, z.attic - 0.9)
  }

  // Quadrant walls: an arched door low down and a small window above, at their middle.
  for (const q of [qS, qN]) {
    const m = q[3], t: XY = [q[4][0] - q[2][0], q[4][1] - q[2][1]], L = Math.hypot(...t)
    const u: XY = [t[0] / L, t[1] / L], n: XY = [u[1], -u[0]]
    const at = (d: number): XY => [m[0] + u[0] * d, m[1] + u[1] * d]
    arched(windows, at(-1.2), at(1.2), n, z.ground + 0.3, z.base - 4.2, 0.1)
    panel(windows, at(-0.6), at(0.6), n, z.base + 2.2, z.base + 4.2, 0.1)
  }

  // Pavilions: a tall niche window over an arched window on the side; small windows on the front.
  for (const k of [-1, 1]) {
    const y = k * pav.half, xm = (pav.x0 + pav.x1) / 2, n: XY = [0, k]
    arched(windows, [xm - 2.1, y], [xm + 2.1, y], n, z.base - 0.6, z.colTop - 0.9)
    arched(windows, [xm - 1.2, y], [xm + 1.2, y], n, z.ground + 0.3, z.base - 4.2)
    const yf = k * (pav.half + pav.hA) / 2
    panel(windows, [pav.x1, yf - 0.6], [pav.x1, yf + 0.6], [1, 0], z.base + 1.2, z.base + 3.2)
    panel(windows, [pav.x1, yf - 0.7], [pav.x1, yf + 0.7], [1, 0], z.ground + 0.5, z.ground + 3.5)
  }

  // Arcaded sides: tall arched windows over ground arches, attic windows above.
  for (const r of s.sides) {
    const step = (r.x1 - r.x0) / r.n
    for (const k of [-1, 1]) {
      const y = k * r.half, n: XY = [0, k], ya = k * (r.half - s.atticIn)
      for (let i = 0; i < r.n; i++) {
        const xm = r.x0 + step * (i + 0.5)
        arched(windows, [xm - s.upper.w / 2, y], [xm + s.upper.w / 2, y], n, s.upper.z0, s.upper.zc)
        arched(windows, [xm - s.lower.w / 2, y], [xm + s.lower.w / 2, y], n, s.lower.z0, s.lower.zc)
        panel(windows, [xm - 0.7, ya], [xm + 0.7, ya], n, z.ledge + 0.6, z.attic - 0.9)
      }
    }
  }
  return { ring: ring0 }
}

/** A plain wall rectangle A→B facing right of travel, z0..z1. */
function panelWall(p: Part, A: XY, B: XY, z0: number, z1: number) {
  p.quad([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1])
}

// Granite as City Hall's (same architect, same stone); the mansard grey-green metal.
export const GRANITE = finish('granite', 0xe4e1d9)
export const LIGHT = finish('granite-light', 0xf1efe9)
export const MANSARD = finish('mansard-copper', 0x8c9e95)
/** Tar-and-gravel flats, as City Hall's. */
export const FLAT = { ...PALETTE.roof, color: 0xb6bcbf }

// ---------------------------------------------------------------------------
// The Opera House

const BEARING = 350.7
const ANCHOR = { lng: -122.4209046, lat: 37.7785751 }
const VC = -0.7 // the measured centre line, south of the anchor

export const OPERA: WarMemorialSpec = {
  front: 50.9, loggia: 47.8, colHalf: 24.4,
  pav: { x0: 25.5, x1: 43.5, half: 37.2, hA: 32.6 }, sag: 0.8,
  body: { x0: -36, half: 28.8 }, rear: { x0: -53.5, half: 24.5 },
  z: { ground: 1.3, base: 10.4, colTop: 18.8, cornice: 20.3, ledge: 21.6, attic: 24.3, top: 31, pavTop: 30 },
  atticIn: 1.8, mansardIn: 6.5,
  pairs: 8, pairStep: 6.55, colR: 0.7, colGap: 1.85, loggiaArches: false,
  sides: [{ x0: -34.6, x1: 23.6, n: 10, half: 28.8 }, { x0: -52, x1: -37.5, n: 3, half: 24.5 }],
  upper: { w: 2.8, z0: 10.8, zc: 18.2 },
  lower: { w: 3.0, z0: 0.4, zc: 5.6 },
}

async function main() {
  const P: WarMemorialParts = { granite: new Part(), light: new Part(), windows: new Part(), metal: new Part(), roof: new Part(), glass: new Part() }
  const { granite, light, windows, metal, roof } = P
  warMemorial(OPERA, P)

  // Fly tower: plain stone walls with pilaster strips, a cornice, a hipped roof to a flat top.
  const ft = { x0: -31.5, x1: -6.5, half: 21.9 }
  const ftRing = chamfer(rect(ft.x0, -ft.half, ft.x1, ft.half), 0.45)
  walls(granite, ftRing, 24, 40.2)
  band(light, ftRing, 0.35, 39.6, 40.4)
  prism(light, light, inset(ftRing, 0.3), 40.4, 41.5)
  hipRect(metal, roof, ft.x0 + 0.5, ft.x1 - 0.5, -ft.half + 0.5, ft.half - 0.5, 41.5, 46.4, 5.2)
  for (const k of [-1, 1]) {
    for (let i = 1; i < 4; i++) { // long sides: four bays
      const x = ft.x0 + ((ft.x1 - ft.x0) * i) / 4
      strip(light, [x - 0.6, k * ft.half], [x + 0.6, k * ft.half], [0, k], 31, 39.6, 0.25)
    }
    for (let i = 1; i < 6; i++) { // ends: six bays
      const y = -ft.half + (2 * ft.half * i) / 6, x = k > 0 ? ft.x1 : ft.x0
      strip(light, [x, y - 0.6], [x, y + 0.6], [k, 0], 31, 39.6, 0.25)
    }
  }

  // Rear (west) face of the stage block: three rows of plain windows.
  const xr = OPERA.rear!.x0
  for (let i = 0; i < 6; i++) {
    const y = -20 + i * 8
    for (const [z0, z1] of [[2.2, 4.8], [8, 10.8], [14, 17]]) panel(windows, [xr, y - 0.8], [xr, y + 0.8], [-1, 0], z0, z1)
  }

  // The Grove Street porte-cochère canopy on the south side.
  box(metal, -31, 22, -34.0, -OPERA.body.half, 5.2, 6.0, true)

  shift([granite, light, windows, metal, roof], 0, VC)
  const parts = [
    { part: granite, material: GRANITE },
    { part: light, material: LIGHT },
    { part: windows, material: PALETTE.window },
    { part: metal, material: MANSARD },
    { part: roof, material: FLAT },
  ]
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('War Memorial Opera House', parts, {
    license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 46.4,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: ['way/32865161'],
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/sf-opera-house.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

if (import.meta.main) await main()
