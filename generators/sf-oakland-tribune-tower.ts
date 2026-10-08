/**
 * Oakland Tribune Tower, Oakland — original procedural geometry, CC0-1.0.
 * bun generators/sf-oakland-tribune-tower.ts
 *
 * Frame: built turned to the block, BEARING 26.5 (Franklin Street runs 26.5°
 * east of north). x across the block (+x = east-south-east, towards Webster
 * Street), y along Franklin Street (+y = north-north-east, 13th Street), z up,
 * metres. Origin = the area centroid of the OSM outline way/91760682.
 *
 * Evidence
 * - OSM way/91760682 (outline, 20 levels, 93 m, "source: bing- approx"),
 *   parts way/425060610 (the tower, 20 levels, 93 m), way/660808996 (6
 *   levels), way/660808997 (8 levels) and way/660808995 (the roof). The
 *   outline is 28 x 31 m and sits ~1.5 m east of the lidar; the lidar wins.
 * - USGS 3DEP lidar (CA_AlamedaCo_2_2021) at 0.5 m in the turned frame
 *   (/tmp/city/sf/work/oak/frame.py). y = 0 is the lowest ground under the
 *   footprint, 13.0 m NAVD88; the block is flat (13.0-13.45). The tower shaft
 *   is 15 x 17.6 m (x -16..-1, y -0.6..17); the balcony with the TRIBUNE
 *   signs reaches 1.2 m out and its letters top out at 61.5 m; the arched
 *   stage's cornice edge reads 73.7; each face has a central gable peaking at
 *   81 over a balustrade at ~77; the steep copper roof rises to a flat top at
 *   94.5 (5 x 8.5 m); the mast tip reads 119.2. The eight-storey wing south of
 *   the tower reaches 38.9 (cornice 35.8); the six-storey Tribune Building
 *   27.2; its L-shaped lower wing on the east and north 22.5-24.
 * - Published (Wikipedia, Oakland landmark; NRHP Downtown Oakland Historic
 *   District): 1923, Edward T. Foulkes; 305 ft (93 m), 20 storeys; the TRIBUNE
 *   signs are neon, lit red at night.
 * - Commons daylight photos: "USA-Oakland-Tribune Building and Tower-1..20.jpg"
 *   (Eugene Zelenko, CC BY-SA 4.0; -2, -6, -9, -12, -13, -15 used most: the
 *   crown from four sides, the shaft, the corbel band, the lower building);
 *   "Oakland tribune tower detail.jpg" (ArielGlenn, CC BY-SA 3.0, the crown
 *   and signs close up); "Oakland, California (June 28, 2019) - old Tribune
 *   Tower and new construction.jpg" (Sharon Hahn Darlin, CC BY 2.0, from afar).
 *
 * Famous-sign exception (STYLE.md): the four TRIBUNE signs carry their
 * lettering, as extruded block letters (a plain sans) standing on the balcony
 * parapet. By day they are cream like the trim, as in the photos.
 *
 * Estimated from the photos: storey heights (5.5 m ground storey, then 3.6 m),
 * the window bays (three per face, each a pair of windows, drawn as one panel
 * per bay per two storeys), the corbel band's depth and corbel spacing, the
 * three arched windows per face, the attic's small windows, the clock
 * aedicules (5.8 m wide, dial 3.9 m across), the roof's springing (inset 1.9 m
 * at 77.3 m) and the mast's thickness. The flagpoles and the roof's small
 * dormers are left out. The lower buildings' window rhythm is simplified.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 26.5
const ANCHOR = { lng: -122.270827, lat: 37.803054 }
const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), copper = new Part(), metal = new Part()

/** A box with chamfered vertical edges; `top` caps it. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = p, bottom = false) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
  if (bottom) for (let i = 1; i < 7; i++) p.tri([r[0][0], r[0][1], z0], [r[i + 1][0], r[i + 1][1], z0], [r[i][0], r[i][1], z0])
}

// A face of a rectangle walked anticlockwise: origin a, direction t, outward normal n.
type Face = { a: XY; t: XY; n: XY; len: number }
const face = (a: XY, b: XY): Face => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const at = (f: Face, s: number, d: number, z: number): V3 => [f.a[0] + f.t[0] * s + f.n[0] * d, f.a[1] + f.t[1] * s + f.n[1] * d, z]
const facesOf = (x0: number, x1: number, y0: number, y1: number): Face[] =>
  [face([x0, y0], [x1, y0]), face([x1, y0], [x1, y1]), face([x1, y1], [x0, y1]), face([x0, y1], [x0, y0])]
const panel = (p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(f, s0, d, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s0, d, z1))
/** A small box on a face: s0..s1 along, out to d1 from the wall, z0..z1. */
function relief(p: Part, f: Face, s0: number, s1: number, d1: number, z0: number, z1: number, under = false) {
  p.quad(at(f, s0, d1, z0), at(f, s1, d1, z0), at(f, s1, d1, z1), at(f, s0, d1, z1))
  p.quad(at(f, s0, 0, z0), at(f, s0, d1, z0), at(f, s0, d1, z1), at(f, s0, 0, z1))
  p.quad(at(f, s1, d1, z0), at(f, s1, 0, z0), at(f, s1, 0, z1), at(f, s1, d1, z1))
  p.quad(at(f, s0, d1, z1), at(f, s1, d1, z1), at(f, s1, 0, z1), at(f, s0, 0, z1))
  if (under) p.quad(at(f, s0, 0, z0), at(f, s1, 0, z0), at(f, s1, d1, z0), at(f, s0, d1, z0))
}
/** A round-headed window panel: rectangle and a true semicircle of its own width. */
function arched(p: Part, f: Face, sc: number, w: number, z0: number, z1: number, d = 0.05) {
  const r = w / 2, spring = z1 - r
  panel(p, f, sc - r, sc + r, z0, spring, d)
  for (let i = 0; i < 8; i++) {
    const a0 = (Math.PI * i) / 8, a1 = (Math.PI * (i + 1)) / 8
    p.tri(at(f, sc, d, spring), at(f, sc + r * Math.cos(a0), d, spring + r * Math.sin(a0)), at(f, sc + r * Math.cos(a1), d, spring + r * Math.sin(a1)))
  }
}
/** A disc flat on a face (clock dial). */
function disc(p: Part, f: Face, sc: number, zc: number, r: number, d: number, n = 16) {
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
    p.tri(at(f, sc, d, zc), at(f, sc + r * Math.cos(a0), d, zc + r * Math.sin(a0)), at(f, sc + r * Math.cos(a1), d, zc + r * Math.sin(a1)))
  }
}
const ring = (cx: number, cy: number, hx: number, hy: number, z: number): V3[] => [[cx - hx, cy - hy, z], [cx + hx, cy - hy, z], [cx + hx, cy + hy, z], [cx - hx, cy + hy, z]]

// ---------------------------------------------------------------------------
// The low buildings: the eight-storey wing, the six-storey Tribune Building
// and its lower L, from the lidar.
type Box = { x0: number; x1: number; y0: number; y1: number; h: number; open: string; storeys: number[]; bay: number; cornice?: boolean }
const BOXES: Box[] = [
  { x0: -16, x1: -1, y0: -13, y1: -0.6, h: 38.6, open: 'w', storeys: [5.5, 9.2, 12.9, 16.6, 20.3, 24, 27.7, 31.4], bay: 3.6, cornice: true }, // eight storeys
  { x0: -16, x1: -1, y0: -15.5, y1: -13, h: 12.4, open: 'w', storeys: [5.5], bay: 3.6 },
  { x0: -1, x1: 14, y0: -15.5, y1: 11, h: 27.2, open: '', storeys: [5.5, 9.8, 14.1, 18.4, 22.7], bay: 3.4, cornice: true }, // the Tribune Building
  { x0: 14, x1: 18.5, y0: -15.5, y1: 17, h: 23.9, open: 'en', storeys: [5.5, 9.8, 14.1, 18.4], bay: 3.4, cornice: true },
  { x0: 2, x1: 14, y0: 11, y1: 17, h: 23.9, open: 'n', storeys: [5.5, 9.8, 14.1, 18.4], bay: 3.4, cornice: true },
]
const TX0 = -16, TX1 = -1, TY0 = -0.6, TY1 = 17 // the tower shaft
const TCX = (TX0 + TX1) / 2, TCY = (TY0 + TY1) / 2
const solids = [...BOXES, { x0: TX0, x1: TX1, y0: TY0, y1: TY1, h: 77.3 }]
const buried = (x: number, y: number, z: number) =>
  solids.some((b) => x > b.x0 + 0.05 && x < b.x1 - 0.05 && y > b.y0 + 0.05 && y < b.y1 - 0.05 && z < b.h)

const SIDES = 'senw'
for (const b of BOXES) {
  block(brick, b.x0, b.x1, b.y0, b.y1, 0, b.h, 0.3, roof)
  const F = facesOf(b.x0, b.x1, b.y0, b.y1)
  F.forEach((f, k) => {
    const n = Math.max(1, Math.round((f.len - 1.2) / b.bay)), w = (f.len - 1.2) / n
    // a face is open to the street (doors and shop windows) or a party wall above a neighbour
    const street = b.open.includes(SIDES[k])
    const tops = [...b.storeys.slice(1), b.h - (b.cornice ? 1.6 : 0.4)]
    for (let i = 0; i < n; i++) {
      const sc = 0.6 + w * (i + 0.5), hw = w / 2 - 0.55
      const probe = (z: number) => buried(...(at(f, sc, 0.3, z).slice(0, 2) as XY), z)
      if (street && !probe(2)) panel(win, f, sc - hw, sc + hw, 0.6, 4.4) // shop fronts
      // upper storeys, in pairs: one panel per bay per two storeys
      for (let s = 0; s < b.storeys.length; s += 2) {
        const z0 = b.storeys[s] + 0.8, z1 = (tops[s + 1] ?? tops[s]) - 0.7
        if (z1 - z0 < 1 || probe(z1)) continue
        if (!street && !probe(z0) && z0 < 22) continue // neighbours' party walls are blind below their roofs
        panel(win, f, sc - hw, sc + hw, z0, z1)
      }
    }
    if (b.cornice) relief(trim, f, -0.45, f.len + 0.45, 0.45, b.h - 1.3, b.h - 0.5, true)
    relief(trim, f, -0.15, f.len + 0.15, 0.15, b.h - 0.5, b.h)
    if (street) relief(trim, f, -0.1, f.len + 0.1, 0.12, 4.6, 5.3) // the storefront cornice
  })
}

// ---------------------------------------------------------------------------
// The tower.
const SHAFT = 51.8 // top of the plain brick shaft; the corbels start here
const BALC = 55.6, PARA = 56.6 // balcony slab top, parapet top (the letters stand on it)
const CORN = 72.0, ATTIC = 75.6, BAL = 77.3 // arched stage cornice, attic top, balustrade top
const ROOF_TOP = 94.5, MAST = 119.2
const OUT = 1.2 // the balcony's reach
block(brick, TX0, TX1, TY0, TY1, 0, CORN, 0.3, null)
const TF = facesOf(TX0, TX1, TY0, TY1)
TF.forEach((f) => {
  // three bays a face, each a pair of windows, drawn per two storeys
  const bays = 3, edge = 1.8, w = (f.len - 2 * edge) / bays
  const storeys = [5.5, 9.1, 12.7, 16.3, 19.9, 23.5, 27.1, 30.7, 34.3, 37.9, 41.5, 45.1, 48.7]
  for (let i = 0; i < bays; i++) {
    const sc = edge + w * (i + 0.5), hw = 1.1
    const probe = (z: number) => buried(...(at(f, sc, 0.3, z).slice(0, 2) as XY), z)
    if (!probe(2)) panel(win, f, sc - hw, sc + hw, 0.6, 4.4)
    for (let s = 0; s < storeys.length; s += 2) {
      const z0 = storeys[s] + 0.9, z1 = Math.min(SHAFT - 1.2, (storeys[s + 2] ?? SHAFT) - 1.3)
      if (z1 - z0 < 1.5 || probe(z0)) continue
      panel(win, f, sc - hw, sc + hw, z0, z1)
    }
    // the arched stage: three tall round-headed windows
    arched(trim, f, sc, 3.4, PARA + 3.2, CORN - 2.0, 0.03) // cream surround
    arched(win, f, sc, 2.6, PARA + 3.6, CORN - 2.4, 0.07)
  }
  // cream quoins up the corners of the arched stage
  relief(trim, f, 0, 0.7, 0.1, PARA, CORN)
  relief(trim, f, f.len - 0.7, f.len, 0.1, PARA, CORN)

  // The corbel band: cream brackets under a projecting balcony, brick between.
  const nc = Math.round(f.len / 1.25)
  for (let i = 0; i <= nc; i++) {
    const sc = (f.len * i) / nc, hw = 0.32
    const s0 = Math.max(-OUT, sc - hw - (i === 0 ? OUT : 0)), s1 = Math.min(f.len + OUT, sc + hw + (i === nc ? OUT : 0))
    const P = (s: number, d: number, z: number) => at(f, s, d, z)
    const zb = SHAFT - 0.4, d0 = 0.3, zt = BALC - 0.8
    // a wedge: shallow at its foot, the balcony's reach at its head
    trim.quad(P(s0, d0, zb), P(s1, d0, zb), P(s1, OUT, zt), P(s0, OUT, zt))
    trim.quad(P(s0, 0, zb), P(s0, d0, zb), P(s0, OUT, zt), P(s0, 0, zt))
    trim.quad(P(s1, d0, zb), P(s1, 0, zb), P(s1, 0, zt), P(s1, OUT, zt))
    trim.quad(P(s0, 0, zb - 0.01), P(s1, 0, zb - 0.01), P(s1, d0, zb), P(s0, d0, zb))
  }
  // the balcony slab, the brick band behind the brackets and the parapet
  relief(trim, f, -OUT, f.len + OUT, OUT + 0.05, BALC - 0.8, BALC, true)
  relief(trim, f, -OUT, f.len + OUT, OUT + 0.05, BALC, PARA)
  relief(trim, f, -0.1, f.len + 0.1, 0.1, SHAFT - 1.4, SHAFT - 0.6)
  // the arched stage's cornice, two steps
  relief(trim, f, -0.6, f.len + 0.6, 0.6, CORN, CORN + 0.9, true)
  relief(trim, f, -0.3, f.len + 0.3, 0.3, CORN - 0.6, CORN)
  // the attic: cream, with a row of small windows; then the cornice and balustrade
  relief(trim, f, 0, f.len, 0.02, CORN + 0.9, ATTIC)
  const na = 6
  for (let i = 0; i < na; i++) {
    const sc = 1.6 + ((f.len - 3.2) * (i + 0.5)) / na
    panel(win, f, sc - 0.45, sc + 0.45, CORN + 1.6, ATTIC - 0.9, 0.08)
  }
  relief(trim, f, -0.4, f.len + 0.4, 0.4, ATTIC, ATTIC + 0.6, true)
  relief(trim, f, 0, f.len, 0.05, ATTIC + 0.6, BAL)
})
// attic and balustrade body (cream), capped by the roof deck
block(trim, TX0, TX1, TY0, TY1, CORN, BAL, 0.3, roof)

// corner finials on the balustrade
for (const [x, y] of [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]] as XY[]) {
  const sx = Math.sign(TCX - x), sy = Math.sign(TCY - y), cx = x + sx * 0.6, cy = y + sy * 0.6
  block(trim, cx - 0.6, cx + 0.6, cy - 0.6, cy + 0.6, BAL, BAL + 1.4, 0.15, null)
  const q = ring(cx, cy, 0.65, 0.65, BAL + 1.4), tip: V3 = [cx, cy, BAL + 3.0]
  for (let i = 0; i < 4; i++) trim.tri(q[i], q[(i + 1) % 4], tip)
}

// The steep copper roof: a truncated hip from the balustrade to a flat,
// crested top, and the mast.
{
  const b0x = 5.6, b0y = 6.9, b1x = 2.4, b1y = 3.7
  copper.loft([ring(TCX, TCY, b0x, b0y, BAL), ring(TCX, TCY, b1x, b1y, ROOF_TOP)])
  copper.cap(ring(TCX, TCY, b1x, b1y, ROOF_TOP), true)
  block(trim, TCX - b1x - 0.1, TCX + b1x + 0.1, TCY - b1y - 0.1, TCY + b1y + 0.1, ROOF_TOP, ROOF_TOP + 0.7, 0.1, trim)
  const mb = ring(TCX, TCY, 0.28, 0.28, ROOF_TOP + 0.7), mt = ring(TCX, TCY, 0.06, 0.06, MAST)
  metal.loft([mb, mt])
  metal.cap(mt, true)

  // The clock aedicules: a cream frame in front of the roof's foot on each
  // face, with a segmental head peaking at 81 m, and the dial.
  TF.forEach((f) => {
    const sc = f.len / 2, hw = 2.9, z0 = ATTIC, z1 = 80.5, apex = 81.6
    const back = (f.n[0] !== 0 ? (TX1 - TX0) / 2 - b0x : (TY1 - TY0) / 2 - b0y) + 1.6 // reach into the roof slope
    const d0 = -back, d1 = 0.1
    // front face: a flat frame with a low pediment
    const front: [number, number][] = [[-hw, z0], [hw, z0], [hw, z1], [0, apex], [-hw, z1]]
    const F3 = (s: number, z: number, d: number) => at(f, sc + s, d, z)
    for (let i = 1; i < front.length - 1; i++) trim.tri(F3(front[0][0], front[0][1], d1), F3(front[i][0], front[i][1], d1), F3(front[i + 1][0], front[i + 1][1], d1))
    // sides and the top running back into the roof
    for (let i = 1; i < front.length; i++) {
      const [sa, za] = front[i], [sb, zb] = front[(i + 1) % front.length]
      trim.quad(F3(sa, za, d1), F3(sa, za, d0), F3(sb, zb, d0), F3(sb, zb, d1))
    }
    disc(win, f, sc, 78.3, 1.95, d1 + 0.05)
    disc(trim, f, sc, 78.3, 0.3, d1 + 0.08, 8)
  })
}

// ---------------------------------------------------------------------------
// The TRIBUNE signs, one on each face, standing on the balcony parapet.
{
  const H = 4.4, ST = 0.75, DEPTH = 0.3, GAP = 0.45
  type Poly = [number, number][]
  const rect = (u0: number, v0: number, u1: number, v1: number): Poly => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const W = 1.9 // letter width
  const glyph: Record<string, Poly[]> = {
    T: [rect(0, H - ST, W, H), rect(W / 2 - ST / 2, 0, W / 2 + ST / 2, H - ST)],
    R: [rect(0, 0, ST, H), rect(ST, H - ST, W - 0.35, H), rect(ST, H / 2 - ST / 2 + 0.1, W - 0.35, H / 2 + ST / 2 + 0.1), rect(W - ST, H / 2 + 0.2, W, H - 0.35),
      [[W / 2 - 0.2, H / 2 - ST / 2 + 0.1], [W / 2 - 0.2 + ST, H / 2 - ST / 2 + 0.1], [W, 0], [W - ST - 0.1, 0]]],
    I: [rect(W / 2 - ST / 2 - 0.35, 0, W / 2 + ST / 2 - 0.35, H)],
    B: [rect(0, 0, ST, H), rect(ST, H - ST, W - 0.35, H), rect(ST, H / 2 - ST / 2, W - 0.35, H / 2 + ST / 2), rect(ST, 0, W - 0.35, ST),
      rect(W - ST, H / 2 + 0.2, W - 0.05, H - 0.35), rect(W - ST, 0.35, W, H / 2 - 0.2)],
    U: [rect(0, 0.3, ST, H), rect(W - ST, 0.3, W, H), rect(0.3, 0, W - 0.3, ST)],
    N: [rect(0, 0, ST, H), rect(W - ST, 0, W, H), [[ST, H], [ST, H - 1.3], [W - ST, 0], [W - ST, 1.3]]],
    E: [rect(0, 0, ST, H), rect(ST, H - ST, W, H), rect(ST, H / 2 - ST / 2, W - 0.25, H / 2 + ST / 2), rect(ST, 0, W, ST)],
  }
  const word = 'TRIBUNE'
  const widths = [...word].map((c) => (c === 'I' ? ST + 0.0 : W))
  TF.forEach((f) => {
    const total = widths.reduce((s, w) => s + w, 0) + GAP * (word.length - 1)
    let u = (f.len - total) / 2
    const d1 = OUT - 0.1, d0 = d1 - DEPTH, z0 = PARA
    ;[...word].forEach((c, k) => {
      const shift = c === 'I' ? -(W / 2 - ST / 2 - 0.35) : 0
      for (const poly of glyph[c]) {
        const pts = poly.map(([pu, pv]) => [u + pu + shift, z0 + pv] as [number, number])
        // front (outward) and back faces, then the sides
        for (let i = 1; i < pts.length - 1; i++) {
          trim.tri(at(f, pts[0][0], d1, pts[0][1]), at(f, pts[i][0], d1, pts[i][1]), at(f, pts[i + 1][0], d1, pts[i + 1][1]))
          trim.tri(at(f, pts[0][0], d0, pts[0][1]), at(f, pts[i + 1][0], d0, pts[i + 1][1]), at(f, pts[i][0], d0, pts[i][1]))
        }
        for (let i = 0; i < pts.length; i++) {
          const A = pts[i], B = pts[(i + 1) % pts.length]
          trim.quad(at(f, A[0], d0, A[1]), at(f, B[0], d0, B[1]), at(f, B[0], d1, B[1]), at(f, A[0], d1, A[1]))
        }
      }
      u += widths[k] + GAP
    })
  })
}

const parts = [
  { part: brick, material: finish('tribune-brick', 0xcc8a66) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: copper, material: PALETTE.copper },
  { part: metal, material: PALETTE.metal },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Oakland Tribune Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: MAST,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/91760682', 'way/425060610', 'way/660808995', 'way/660808996', 'way/660808997'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-oakland-tribune-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
