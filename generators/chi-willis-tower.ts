/**
 * Willis Tower (Sears Tower, 1973, SOM: Bruce Graham, Fazlur Khan), Chicago —
 * original procedural geometry, CC0-1.0.
 * bun generators/chi-willis-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. The anchor is the centroid of the OSM outline (way/380868216),
 * 41.8787278,-87.6359459. The tube grid in OSM is turned 1.07° anticlockwise
 * from true north (mean of 29 tube edges), so the catalog bearing is 358.93°
 * and the tubes are square to this frame.
 *
 * Identity: nine 75 ft (22.86 m) square tubes in a 3×3 bundle, 225 ft
 * (68.58 m) a side (Wikipedia, citing SOM/CTBUH). The NW and SE tubes stop at
 * the 50th floor, the NE and SW at the 66th, the N, E and S at the 90th; the
 * W and centre tubes rise to the 108-storey roof at 442 m. That termination
 * pattern is exact (Wikipedia; OSM building:parts agree tube for tube).
 *
 * Heights:
 *  - roof 442 m: published (442.1 m) and OSM.
 *  - setback roofs 206 / 268 / 366 m: estimated. OSM tags 200 / 260 / 355,
 *    but in a distant telephoto from the lake (Chris6d, PD), scaled by the
 *    known 85 m from roof to the west antenna tip and cross-checked against
 *    the tube widths, the steps measure ≈209 / ≈266 / ≈365 m, and scaling
 *    442 m by floor count (50, 66, 90 of 108) gives 205 / 270 / 368 m. OSM
 *    reads about 3% low on all three, so the measured values are used.
 *  - west antenna tip 527 m (1,729 ft, published, after the 2000
 *    extension); east antenna 521 m, measured from the Chinatown telephoto
 *    (Daniel Schwen, CC BY-SA 4.0), where the west tip stands ~5 m higher.
 *    The antenna profiles (stepped white masts, two slim outboard poles
 *    each) and the ~4 m roof penthouse are from the same photo.
 *  - mechanical floors 29–32, 64–65, 88–89, 104–108 (Wikipedia floor list)
 *    show in every photo as solid black bands without glazing; they are
 *    drawn as the frame showing between window groups. Every tube top also
 *    reads as a dark two-storey band (photos), so the 50-storey tubes get one.
 *  - antenna positions: OSM (way/233918141, way/233918220), ±13.4 m either
 *    side of the 108-storey block's centre on its centreline.
 *  - the four white drums on the 50- and 66-storey roofs: OSM parts
 *    (way/1178243970-73), r ≈ 4 m, 5 m tall.
 *  - podium: OSM building:parts (the 2020 three-level annex with its roof
 *    garden, the glass-roofed Jackson atrium and Wacker entrance), heights
 *    as tagged, outlines simplified to 0.35 m.
 *
 * Facade: perimeter columns at 15 ft (Wikipedia), so five bays per tube
 * face. One slate window panel per bay per group of about four floors, the
 * black aluminium frame showing between as piers and spandrels, a wider pier
 * at every tube line. Colours: the body is black anodised aluminium with
 * bronze-tinted glass; per STYLE.md it is pulled up to charcoal #4a4f57 and
 * the glass to a warm slate a step lighter, which is how it reads in sun.
 *
 * Left out: the Skydeck's glass ledge boxes on the west face at 412 m (they
 * project 1.3 m and vanish at map scale), the antennas' cross-arms and dishes.
 *
 * Photos (Wikimedia Commons): Willis_Tower_From_Lake.jpg (Chris6d, PD);
 * Willis_Tower_Chinatown.jpg, Chicago_Sears_Tower.jpg, Willis_Tower.jpg
 * (Daniel Schwen, CC BY-SA); Willis_Tower,_Chicago_September_2016-26.jpg
 * (Alvesgaspar, CC BY-SA 4.0); Sears_Tower_(1795363412).jpg (Jeramey
 * Jannene, CC BY 2.0); Willis_Tower_antennas_(12889516014).jpg (Jaysin
 * Trevino, CC BY 2.0); Chicago_in_2022_Top_of_the_Willis_Tower (Chris
 * Rycroft, CC BY 2.0); Carol M. Highsmith aerials (PD). No commercial
 * imagery or 3D tiles were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const frame = new Part(), win = new Part(), roof = new Part()
const white = new Part(), glass = new Part(), garden = new Part()

// ---------- the tube grid ----------
const T = 22.86 // one tube, 75 ft
const CX = 3.92, CY = 17.2 // grid centre in the anchor frame (OSM tube parts)
const X0 = CX - 1.5 * T, Y0 = CY - 1.5 * T
// Tube heights by [row][col], row 0 = south, col 0 = west.
const H50 = 206, H66 = 268, H90 = 366, ROOF = 442
const HT = [
  [H66, H90, H50], // SW, S, SE
  [ROOF, ROOF, H90], // W, C, E
  [H50, H90, H66], // NW, N, NE
]
const height = (r: number, c: number) => (r < 0 || r > 2 || c < 0 || c > 2 ? 0 : HT[r][c])

/** Floor n's top, piecewise through the measured setbacks. */
function F(n: number) {
  const k: XY[] = [[0, 0], [50, H50], [66, H66], [90, H90], [108, ROOF]]
  for (let i = 1; i < k.length; i++)
    if (n <= k[i][0]) return k[i - 1][1] + (n - k[i - 1][0]) / (k[i][0] - k[i - 1][0]) * (k[i][1] - k[i - 1][1])
  return ROOF
}
// Solid black bands: mechanical floors 29–32, 64–65, 88–89, 104–108.
const BANDS: XY[] = [[F(28), F(32)], [F(63), F(65) + 1], [F(87), F(89)], [F(106), ROOF]]

const BEVEL = .6 // corner chamfer
const LIP = .45 // chamfered coping at each tube top
const PIER = 1.0, EDGE = .8, SPANDREL = .9, BAY = T / 5, OUT = .05
// Lowest glazing per face side, above the podium wings that wrap the base.
const SILL: Record<string, number> = { n: 8, e: 12, s: 22, w: 22 }

type Side = 'n' | 'e' | 's' | 'w'
const DIRS: Record<Side, { dr: number; dc: number; n: V3 }> = {
  n: { dr: 1, dc: 0, n: [0, 1, 0] }, e: { dr: 0, dc: 1, n: [1, 0, 0] },
  s: { dr: -1, dc: 0, n: [0, -1, 0] }, w: { dr: 0, dc: -1, n: [-1, 0, 0] },
}
/** The face's bottom edge, run anticlockwise seen from above (left to right from outside). */
function edgeOf(r: number, c: number, s: Side): [XY, XY] {
  const x0 = X0 + c * T, x1 = x0 + T, y0 = Y0 + r * T, y1 = y0 + T
  return s === 's' ? [[x0, y0], [x1, y0]] : s === 'e' ? [[x1, y0], [x1, y1]]
    : s === 'n' ? [[x1, y1], [x0, y1]] : [[x0, y1], [x0, y0]]
}
/** Height range over which a tube side is outside air. */
function exposure(r: number, c: number, s: Side): XY | null {
  const h = height(r, c), d = DIRS[s], hn = height(r + d.dr, c + d.dc)
  return hn < h ? [hn, h] : null
}
const LEFT: Record<Side, Side> = { s: 'w', e: 's', n: 'e', w: 'n' }
const RIGHT: Record<Side, Side> = { s: 'e', e: 'n', n: 'w', w: 's' }

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3, nc = nb, nd = na) {
  p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
  p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
}
const unit = (v: V3): V3 => { const l = Math.hypot(...v); return v.map(q => q / l) as V3 }

/** Ranges where a tube corner is convex: both sides meeting there are exposed. */
function overlap(a: XY | null, b: XY | null): XY | null {
  if (!a || !b) return null
  const lo = Math.max(a[0], b[0]), hi = Math.min(a[1], b[1])
  return hi > lo ? [lo, hi] : null
}

// ---------- tube faces, corners, tops ----------
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
  const h = HT[r][c]
  for (const s of ['s', 'e', 'n', 'w'] as Side[]) {
    const ex = exposure(r, c, s)
    if (!ex) continue
    const [a, b] = edgeOf(r, c, s), n = DIRS[s].n
    const len = T, ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len
    const P = (u: number, z: number, out = 0): V3 => [a[0] + ux * u + n[0] * out, a[1] + uy * u + n[1] * out, z]
    // Corner bevels at the face's two ends.
    const bl = overlap(ex, exposure(r, c, LEFT[s])), br = overlap(ex, exposure(r, c, RIGHT[s]))
    const cuts = [...new Set([ex[0], ex[1], ...(bl ?? []), ...(br ?? [])])].sort((p, q) => p - q)
    const top = h - LIP
    for (let k = 0; k < cuts.length - 1; k++) {
      const z0 = cuts[k], z1 = Math.min(cuts[k + 1], top)
      if (z1 <= z0) continue
      const zm = (z0 + z1) / 2
      const u0 = bl && zm > bl[0] && zm < bl[1] ? BEVEL : 0
      const u1 = br && zm > br[0] && zm < br[1] ? len - BEVEL : len
      quadN(frame, P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1), n, n)
    }
    // Coping chamfer along the top: from the wall at h−LIP to the roof inset.
    {
      const u0 = bl && bl[1] >= h ? BEVEL : 0, u1 = br && br[1] >= h ? len - BEVEL : len
      const v0 = bl && bl[1] >= h ? BEVEL + LIP * .414 : 0, v1 = br && br[1] >= h ? len - BEVEL - LIP * .414 : len
      const up = unit([n[0], n[1], 1.6])
      quadN(frame, P(u0, top), P(u1, top), P(v1, h, -LIP), P(v0, h, -LIP), n, n, up, up)
    }
    // Window panels: five bays, groups of about four floors between bands.
    const zones: XY[] = []
    // The 50-storey tubes have no published mechanical floor at the top, but
    // read just as dark there as the others do.
    const bands = [...BANDS, ...(h === H50 ? [[F(48), H50] as XY] : [])].filter(([b0]) => b0 < h)
    let lo = Math.max(ex[0], SILL[s]) + .6
    for (const [b0, b1] of bands.sort((p, q) => p[0] - q[0])) {
      if (b0 > lo) zones.push([lo, b0])
      lo = Math.max(lo, b1)
    }
    if (h - 2 > lo) zones.push([lo, h - 2])
    for (const [z0, z1] of zones) {
      const span = z1 - z0
      if (span < 3) continue
      const groups = Math.max(1, Math.round(span / 15.5)), g = span / groups
      for (let j = 0; j < groups; j++) {
        const zz0 = z0 + j * g + SPANDREL / 2, zz1 = z0 + (j + 1) * g - SPANDREL / 2
        for (let b = 0; b < 5; b++) {
          const p0 = b * BAY + (b === 0 ? EDGE : PIER / 2), p1 = (b + 1) * BAY - (b === 4 ? EDGE : PIER / 2)
          win.quad(P(p0, zz0, OUT), P(p1, zz0, OUT), P(p1, zz1, OUT), P(p0, zz1, OUT))
        }
      }
    }
  }
  // Corner chamfers, one per convex corner range, smooth across both faces.
  for (const s of ['s', 'e', 'n', 'w'] as Side[]) {
    const ra = overlap(exposure(r, c, s), exposure(r, c, RIGHT[s]))
    if (!ra) continue
    const corner = edgeOf(r, c, s)[1], n1 = DIRS[s].n, n2 = DIRS[RIGHT[s]].n
    // Corner sits at the end of side s and the start of the next side.
    const back: XY = [-n2[0], -n2[1]] // along side s, back from the corner
    const fwd: XY = [-n1[0], -n1[1]] // along the next side, away from the corner
    const A = (z: number, d = BEVEL): V3 => [corner[0] + back[0] * d, corner[1] + back[1] * d, z]
    const B = (z: number, d = BEVEL): V3 => [corner[0] + fwd[0] * d, corner[1] + fwd[1] * d, z]
    const z1 = Math.min(ra[1], height(r, c) - LIP)
    quadN(frame, A(ra[0]), B(ra[0]), B(z1), A(z1), n1, n2)
    if (ra[1] >= height(r, c)) {
      // Coping over the chamfer.
      const h = height(r, c), d = BEVEL + LIP * .414
      const A2: V3 = [corner[0] + back[0] * d - n1[0] * LIP, corner[1] + back[1] * d - n1[1] * LIP, h]
      const B2: V3 = [corner[0] + fwd[0] * d - n2[0] * LIP, corner[1] + fwd[1] * d - n2[1] * LIP, h]
      const m = unit([n1[0] + n2[0], n1[1] + n2[1], 2.2])
      quadN(frame, A(z1), B(z1), B2, A2, n1, n2, m, m)
    }
  }
  // Roof: the tube square, inset by the coping on exposed sides and cut at
  // convex corners. Sides against a taller neighbour run to the wall.
  {
    const x0 = X0 + c * T, x1 = x0 + T, y0 = Y0 + r * T, y1 = y0 + T
    const inS = exposure(r, c, 's') ? LIP : 0, inE = exposure(r, c, 'e') ? LIP : 0
    const inN = exposure(r, c, 'n') ? LIP : 0, inW = exposure(r, c, 'w') ? LIP : 0
    const conv = (s: Side) => { const o = overlap(exposure(r, c, s), exposure(r, c, RIGHT[s])); return !!o && o[1] >= h }
    const d = BEVEL + LIP * .414
    const ring: XY[] = []
    const corner = (p: XY, a: XY, b: XY, cut: boolean) => { if (cut) ring.push(a, b); else ring.push(p) }
    corner([x0 + inW, y0 + inS], [x0 + inW, y0 + d], [x0 + d, y0 + inS], conv('w'))
    corner([x1 - inE, y0 + inS], [x1 - d, y0 + inS], [x1 - inE, y0 + d], conv('s'))
    corner([x1 - inE, y1 - inN], [x1 - inE, y1 - d], [x1 - d, y1 - inN], conv('e'))
    corner([x0 + inW, y1 - inN], [x0 + d, y1 - inN], [x0 + inW, y1 - d], conv('n'))
    roof.cap(ring.map(([x, y]): V3 => [x, y, h]), true)
  }
}

// ---------- roof furniture ----------
function cylinder(p: Part, cx: number, cy: number, sections: [number, number][], seg = 12, capTop = true) {
  const rings = sections.map(([z, rad]) => Array.from({ length: seg }, (_, i): V3 => {
    const a = (i + .5) * 2 * Math.PI / seg
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a), z]
  }))
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    const nm = (v: V3): V3 => unit([v[0] - cx, v[1] - cy, 0])
    if (rings[k][i][0] === rings[k + 1][i][0] && rings[k][i][1] === rings[k + 1][i][1] && sections[k][0] === sections[k + 1][0]) continue
    const flat = sections[k][0] === sections[k + 1][0]
    if (flat) p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    else quadN(p, rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i], nm(rings[k][i]), nm(rings[k][j]))
  }
  if (capTop) p.cap(rings.at(-1)!, true)
}
/** A stepped mast: [height above roof, diameter] pairs, each step a short taper. */
// Drawn 1.5× their measured diameter: at true size the masts all but vanish
// at phone size, and they are half of what makes the silhouette.
const BOLD = 1.5
function mast(cx: number, cy: number, steps: [number, number][], tip: number) {
  const s: [number, number][] = [[ROOF, steps[0][1] / 2 * BOLD]]
  for (let i = 0; i < steps.length; i++) {
    const [z, dia] = steps[i]
    s.push([ROOF + z, dia / 2 * BOLD])
    const next = steps[i + 1]?.[1] ?? .85
    s.push([ROOF + z + 1.2, next / 2 * BOLD])
  }
  s.push([ROOF + tip - 1.5, .35 * BOLD], [ROOF + tip, .15])
  cylinder(white, cx, cy, s, 12, true)
}
const BX = X0 + T, BY = CY // centre of the 108-storey block (W + C tubes)
// Low dark mechanical penthouse on the roof.
{
  const px = 11, py = 7, z = ROOF, hz = ROOF + 4
  const q: XY[] = [[BX - px, BY - py], [BX + px, BY - py], [BX + px, BY + py], [BX - px, BY + py]]
  frame.loft([q.map(([x, y]): V3 => [x, y, z]), q.map(([x, y]): V3 => [x, y, hz])])
  roof.cap(q.map(([x, y]): V3 => [x, y, hz]), true)
}
// West antenna: 527 m. East: 521 m. Profiles from the Chinatown telephoto.
mast(BX - 13.4, BY, [[23, 4.2], [45, 3.0], [63, 2.0]], 85)
mast(BX + 13.4, BY, [[23, 3.7], [50, 2.5], [70, 1.9]], 79)
// Slim outboard poles beside each mast.
for (const [x, y, top] of [[-5.6, -1.6, 40], [-3.8, 1.8, 37], [5.2, 1.6, 39], [3.8, -1.8, 37]] as const) {
  const cx = BX + (x < 0 ? -13.4 : 13.4) + x
  cylinder(white, cx, BY + y, [[ROOF, .55 * BOLD], [ROOF + top, .45 * BOLD]], 8, true)
}
// White drums on the 50- and 66-storey roofs (OSM parts).
for (const [r, c, dx, dy] of [[0, 2, .2, -.4], [2, 0, -.6, .4], [0, 0, .2, -.2], [2, 2, -.4, .2]] as const) {
  const h = HT[r][c], cx = X0 + (c + .5) * T + dx * T / 2, cy = Y0 + (r + .5) * T + dy * T / 2
  cylinder(white, cx, cy, [[h, 4.1], [h + 4.6, 4.1], [h + 5, 3.7]], 14, true)
}

// ---------- podium (OSM building:parts) ----------
type Pod = { id: string; h: number; roof: 'garden' | 'glass' | 'roof'; ring: XY[] }
const PODIUM: Pod[] = [
  { id: 'way/1007423276', h: 21, roof: 'glass', ring: [[-7.0, -17.7], [-7.6, -44.7], [15.6, -44.7], [16.0, -17.7]] },
  { id: 'way/1178212992', h: 10, roof: 'garden', ring: [[38.9, 29.0], [44.7, 28.8], [44.8, 59.9], [24.6, 59.9], [24.6, 52.2], [38.7, 52.2]] },
  { id: 'way/1178212993', h: 5, roof: 'roof', ring: [[-20.7, 60.0], [-20.9, 52.2], [24.6, 52.2], [24.6, 59.9]] },
  { id: 'way/1178212994', h: 10, roof: 'garden', ring: [[38.8, -48.9], [15.6, -48.9], [15.5, -58.5], [44.7, -58.5], [44.7, 5.2], [38.8, 5.7]] },
  { id: 'way/1178212995', h: 20, roof: 'garden', ring: [[-47.2, -48.6], [-7.1, -48.7], [-7.2, -54.4], [15.5, -54.4], [15.5, -48.8], [38.8, -48.9], [38.8, -17.9], [16.0, -17.7], [15.9, -44.7], [-7.6, -44.7], [-7.0, -17.7], [-30.8, -17.9], [-30.9, 6.5], [-47.2, 6.5]] },
  { id: 'way/1178212996', h: 25, roof: 'roof', ring: [[-36.1, -20.8], [-36.0, -38.3], [-16.1, -38.4], [-16.1, -20.9]] },
  { id: 'way/1178212997', h: 18, roof: 'roof', ring: [[-39.4, -48.7], [-39.6, -58.3], [-20.7, -58.4], [-20.6, -48.7]] },
  { id: 'way/1178212998', h: 10, roof: 'garden', ring: [[-47.2, -48.6], [-47.2, -58.4], [-39.6, -58.3], [-39.4, -48.7]] },
  { id: 'way/1178212999', h: 10, roof: 'garden', ring: [[-20.7, -58.4], [-7.1, -58.3], [-7.1, -48.7], [-20.6, -48.7]] },
  { id: 'way/1178213001', h: 18, roof: 'glass', ring: [[-39.5, 6.5], [-30.9, 6.5], [-30.9, 28.3], [-39.5, 28.3]] },
  { id: 'way/1178226263', h: 10, roof: 'garden', ring: [[-31.0, 52.2], [-20.9, 52.2], [-20.7, 60.0], [-47.3, 60.0], [-47.3, 51.3], [-31.0, 51.3]] },
  { id: 'way/1178226264', h: 20, roof: 'garden', ring: [[-47.3, 51.3], [-47.2, 28.3], [-30.9, 28.3], [-31.0, 51.3]] },
]
const area = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
function inside([x, y]: XY, r: XY[]) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++)
    if ((r[i][1] > y) !== (r[j][1] > y) && x < (r[j][0] - r[i][0]) * (y - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
  return c
}
/** Ear clipping for a simple anticlockwise ring. */
function triangulate(ring: XY[]): [XY, XY, XY][] {
  const v = [...ring], out: [XY, XY, XY][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (v.length > 3 && guard++ < 1000) {
    for (let i = 0; i < v.length; i++) {
      const a = v[(i + v.length - 1) % v.length], b = v[i], c = v[(i + 1) % v.length]
      if (cr(a, b, c) <= 1e-9) continue
      if (v.some(p => p !== a && p !== b && p !== c && inside(p, [a, b, c]))) continue
      out.push([a, b, c]); v.splice(i, 1); break
    }
  }
  out.push([v[0], v[1], v[2]])
  return out
}
/** Height of whatever stands just outside a podium edge: tower, another part, or air. */
function neighbour(p: XY, self: Pod) {
  const [x, y] = p
  if (x > X0 && x < X0 + 3 * T && y > Y0 && y < Y0 + 3 * T) return ROOF
  let h = 0
  for (const q of PODIUM) if (q !== self && inside(p, q.ring)) h = Math.max(h, q.h)
  return h
}
for (const pod of PODIUM) {
  const ring = area(pod.ring) < 0 ? [...pod.ring].reverse() : pod.ring
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const n: V3 = [uy, -ux, 0]
    const P = (u: number, z: number, o = 0): V3 => [a[0] + ux * u + n[0] * o, a[1] + uy * u + n[1] * o, z]
    // An edge can run partly against a taller neighbour and partly in the
    // open, so sample along it and wall each run from what stands outside.
    const steps = Math.max(1, Math.round(L / 1)), runs: { u0: number; u1: number; hn: number }[] = []
    for (let k = 0; k < steps; k++) {
      const u = (k + .5) * L / steps
      const hn = neighbour([a[0] + ux * u + n[0] * .8, a[1] + uy * u + n[1] * .8], pod)
      const last = runs.at(-1)
      if (last && last.hn === hn) last.u1 = (k + 1) * L / steps
      else runs.push({ u0: k * L / steps, u1: (k + 1) * L / steps, hn })
    }
    for (const { u0, u1, hn } of runs) {
      if (hn >= pod.h) continue
      frame.quad(P(u0, hn), P(u1, hn), P(u1, pod.h), P(u0, pod.h))
      // Storefront and annex glazing, broken into bays on long runs.
      const z0 = hn + (hn > 0 ? .8 : 1), z1 = pod.h - 1.4, l = u1 - u0
      if (z1 - z0 < 2 || l < 4) continue
      const bays = Math.max(1, Math.round(l / 9)), w = l / bays
      for (let k = 0; k < bays; k++) {
        const p0 = u0 + k * w + .6, p1 = u0 + (k + 1) * w - .6
        win.quad(P(p0, z0, OUT), P(p1, z0, OUT), P(p1, z1, OUT), P(p0, z1, OUT))
      }
    }
  }
  const top = pod.roof === 'garden' ? garden : pod.roof === 'glass' ? glass : roof
  for (const [p, q, r] of triangulate(ring)) top.tri([p[0], p[1], pod.h], [q[0], q[1], pod.h], [r[0], r[1], pod.h])
}

// ---------- write ----------
const parts = [
  { part: frame, material: finish('black-aluminium', 0x4a4f57, .6) },
  { part: win, material: { ...PALETTE.window, color: 0x5f6873 } },
  { part: roof, material: PALETTE.roof },
  { part: white, material: finish('antenna-white', 0xe8eaea, .6) },
  { part: glass, material: PALETTE.glass },
  { part: garden, material: finish('roof-garden', 0x98a585) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Willis Tower', parts, {
  license: 'CC0-1.0', bearing: 358.93, elevation: 0, anchor: [41.8787278, -87.6359459], height: 527,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  note: 'Nine bundled tubes ending at 50, 66, 90 and 108 floors; two white antennas; OSM podium',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/chi-willis-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
