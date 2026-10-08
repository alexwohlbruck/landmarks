/**
 * Fox Oakland Theatre, Oakland — original procedural geometry, CC0-1.0.
 * bun generators/sf-fox-oakland.ts
 *
 * Frame: built turned to the block, BEARING 11.3 (Telegraph Avenue runs 11.3°
 * east of north here). x across the block (+x = east, the Telegraph Avenue
 * front), y along it (+y = north, towards 19th Street), z up, metres. Origin = the area centroid of the OSM outline
 * way/31149191.
 *
 * Evidence
 * - OSM way/31149191 (outline, 3 levels, no height). Matches the lidar within
 *   ~1 m.
 * - USGS 3DEP lidar (CA_AlamedaCo_2_2021) at 0.5-1 m in the turned frame
 *   (/tmp/city/sf/work/oak/frame.py). y = 0 is street level, 8.7 m NAVD88
 *   (the footprint's 5th percentile; the single lowest return, 7.7, is a
 *   light well). Above street level: the three-storey wings round the block,
 *   roof ~16 m and their crenellated parapet ~18; the auditorium in the middle
 *   (x -23..26, y -20..20), walls ~21 and a vault to 25; the stage house at
 *   the back, 23 and its fly tower 27; on Telegraph the entrance pavilion
 *   (x 33..40, y -8..8) 21 m, its two small domed turrets 25; the square
 *   base of the dome 21 and the dome, r 4.5 centred 9.5 m behind the front,
 *   peaking at 32.4; the blade sign, at the pavilion's north corner, 24.5 m
 *   and reaching 3 m out; the marquee ~7.
 * - Published (Wikipedia; NRHP; Oakland Landmark): 1928, Weeks & Day with
 *   Maury I. Diggs; "Indo-Moorish" (Hindu-Moorish) style; restored 2009.
 * - Commons daylight photos: "Fox Oakland Theatre (Oakland, CA).JPG"
 *   (Sanfranman59, CC BY-SA 3.0, the Telegraph front); "Fox Oakland.jpg",
 *   "Fox Oakland-2..10.jpg" (Almonroth, CC BY-SA 3.0: dome, turrets, wings,
 *   crenellations, terracotta spandrels); "Fox-oakland-theatre-uptown-
 *   oakland.jpg" (Tandonva, CC0, the front); "Oakland Fox Theatre,
 *   2012-08-31.jpg" (Michael Mamaril, CC BY-SA 3.0, the blade); "Oakland Fox
 *   Theater 2014.jpg" (Cullen328, CC0, the corner from the south-east); "Fox
 *   Theater of Oakland, Wide.jpg" (Cy2005, CC BY-SA 4.0).
 *
 * Famous-sign exception (STYLE.md): the blade carries FOX across its crest
 * and OAKLAND stacked below, as extruded block letters on both faces.
 *
 * Estimated from the photos: storey heights, the wings' bays (~4.5 m, one
 * window panel per bay over floors two and three with the terracotta
 * spandrel between), the merlons' size and spacing, the pavilion's pointed
 * arch (5 m wide) and the tile panels round it, the turrets (r 1.6), the drum and the dome's bell profile
 * and its four blue tile panels, the letter sizes, the marquee.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 11.3
const ANCHOR = { lng: -122.2705411, lat: 37.8080679 }
const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), red = new Part(), tile = new Part()

function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = p) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}
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
function relief(p: Part, f: Face, s0: number, s1: number, d1: number, z0: number, z1: number, under = false, d0 = 0) {
  p.quad(at(f, s0, d1, z0), at(f, s1, d1, z0), at(f, s1, d1, z1), at(f, s0, d1, z1))
  p.quad(at(f, s0, d0, z0), at(f, s0, d1, z0), at(f, s0, d1, z1), at(f, s0, d0, z1))
  p.quad(at(f, s1, d1, z0), at(f, s1, d0, z0), at(f, s1, d0, z1), at(f, s1, d1, z1))
  p.quad(at(f, s0, d1, z1), at(f, s1, d1, z1), at(f, s1, d0, z1), at(f, s0, d0, z1))
  if (under) p.quad(at(f, s0, d0, z0), at(f, s1, d0, z0), at(f, s1, d1, z0), at(f, s0, d1, z0))
  if (d0 < 0) p.quad(at(f, s1, d0, z0), at(f, s0, d0, z0), at(f, s0, d0, z1), at(f, s1, d0, z1))
}
/** A pointed (two-centred) arch panel: rectangle plus an equilateral pointed head. */
function pointed(p: Part, f: Face, sc: number, w: number, z0: number, z1: number, d: number) {
  const r = w, hw = w / 2, rise = Math.sqrt(r * r - hw * hw), spring = z1 - rise
  panel(p, f, sc - hw, sc + hw, z0, spring, d)
  const n = 6, pts: [number, number][] = []
  for (let i = 0; i <= n; i++) { const a = (Math.PI / 3) * (i / n); pts.push([sc - hw + r * Math.cos(a) - 0, spring + r * Math.sin(a)]) } // right flank, centred on the left springing
  const left = pts.map(([s, z]): [number, number] => [2 * sc - s, z]).reverse()
  // fan from the middle of the springing line
  const ring = [...pts.slice(0, n), ...left.slice(0, n + 1)] // right foot -> apex -> left foot
  for (let i = 0; i < ring.length - 1; i++) p.tri(at(f, sc, d, spring), at(f, ring[i][0], d, ring[i][1]), at(f, ring[i + 1][0], d, ring[i + 1][1]))
}
/** A stepped merlon row along a face, on a parapet top at z. */
function merlons(f: Face, z: number, step = 2.6, w = 1.3, h = 1.4) {
  const n = Math.max(1, Math.round(f.len / step))
  for (let i = 0; i < n; i++) {
    const sc = (f.len * (i + 0.5)) / n
    relief(brick, f, sc - w / 2, sc + w / 2, 0.05, z, z + h * 0.6, false, -0.45)
    relief(brick, f, sc - w / 4, sc + w / 4, 0.05, z + h * 0.6, z + h, false, -0.45) // the step
  }
}

// ---------------------------------------------------------------------------
// The three-storey wings round the block (one prism on the outline), with
// the crenellated parapet, bays of windows over storefronts, and terracotta
// spandrels between floors two and three.
const FX = 40 // the Telegraph front
const OUT: XY[] = [[-38.5, -33.3], [29.1, -33.3], [FX, -23.6], [FX, 24.2], [30.4, 33.2], [-38.5, 33.2]]
const WING = 16.3
const PAV = { x0: 33, y0: -8, y1: 8, h: 21 } // the entrance pavilion
{
  const c: XY = [0, 0]
  for (let i = 0; i < OUT.length; i++) {
    const a = OUT[i], b = OUT[(i + 1) % OUT.length], f = face(a, b)
    brick.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WING], [a[0], a[1], WING])
    roof.tri([c[0], c[1], WING], [a[0], a[1], WING], [b[0], b[1], WING])
    // parapet coping and merlons
    relief(trim, f, -0.1, f.len + 0.1, 0.12, WING - 0.5, WING)
    const skip = (s: number) => { const p = at(f, s, 0, 0); return p[0] > FX - 1 && p[1] > PAV.y0 - 0.5 && p[1] < PAV.y1 + 0.5 }
    const n = Math.max(1, Math.round((f.len - 1) / 4.5)), w = (f.len - 1) / n
    for (let k = 0; k < n; k++) {
      const sc = 0.5 + w * (k + 0.5)
      if (skip(sc)) continue
      const hw = Math.min(1.1, w / 2 - 1.0)
      if (i !== 5) panel(win, f, sc - hw - 0.4, sc + hw + 0.4, 0.4, 3.9) // storefronts (not the back)
      panel(win, f, sc - hw, sc + hw, 5.8, 8.9, 0.06) // second floor
      panel(red, f, sc - hw - 0.2, sc + hw + 0.2, 9.2, 10.4, 0.06) // terracotta spandrel
      panel(win, f, sc - hw, sc + hw, 10.7, 13.4, 0.06) // third floor
      // the merlon over each bay, and a smaller one over each pier
      const ms = (s: number, mw: number, h: number) => {
        relief(brick, f, s - mw / 2, s + mw / 2, 0.05, WING, WING + h * 0.6, false, -0.45)
        relief(brick, f, s - mw / 4, s + mw / 4, 0.05, WING + h * 0.6, WING + h, false, -0.45)
      }
      ms(sc, 2.0, 1.9)
    }
    relief(trim, f, -0.05, f.len + 0.05, 0.1, 4.4, 5.0) // the storefront cornice
  }
}

// The auditorium rising inside, its vault, and the stage house at the back.
{
  block(brick, -23, 26, -20, 20, WING - 0.5, 21, 0.3, null)
  const r = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  roof.loft([r(-23, 26, -20, 20, 21), r(-20, 23, -3, 3, 25)])
  roof.cap(r(-20, 23, -3, 3, 25), true)
  block(brick, -38.5, -23, -20, 20, WING - 0.5, 23, 0.3, roof)
  block(brick, -37, -28, -15, 14, 22.5, 27, 0.3, roof)
  for (const f of facesOf(-38.5, -23, -20, 20)) merlons(f, 23, 3.2, 1.4, 1.2)
}

// ---------------------------------------------------------------------------
// The entrance pavilion: a cream frontispiece with a great pointed arch, two
// small domed turrets, then the square base of the dome behind.
{
  const x0 = PAV.x0, x1 = FX + 0.4, y0 = PAV.y0, y1 = PAV.y1, h = PAV.h
  block(trim, x0, x1, y0, y1, 0, h, 0.3, roof)
  const F = facesOf(x0, x1, y0, y1)
  const front = F[1], mid = front.len / 2
  pointed(trim, front, mid, 6.0, 7.2, 17.4, 0.2) // the arch's frame, standing proud
  pointed(win, front, mid, 4.8, 7.6, 16.5, 0.26) // the lattice window
  panel(tile, front, mid - 4.0, mid + 4.0, 17.9, 19.8, 0.08) // the blue tile band over the arch
  for (const s of [mid - 5.6, mid + 5.6]) panel(tile, front, s - 0.7, s + 0.7, 11, 16.5, 0.08) // tiled lattice panels on the piers
  panel(win, front, mid - 4.2, mid + 4.2, 0.3, 3.6, 0.08) // doors under the marquee
  for (const f of F) merlons(f, h, 1.8, 1.0, 1.3)
  // side windows on the pavilion's flanks above the wings
  for (const f of [F[0], F[2]]) for (const s of [2.2, 5.0]) panel(win, f, s - 0.5, s + 0.5, WING + 1.2, h - 1.5)
  // turrets: octagonal, cream, with small domes
  for (const ty of [y0 + 1.6, y1 - 1.6]) {
    const cx = x1 - 1.7, n = 8, R = 1.6, z0 = h - 3, z1 = 23
    const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), ty + r * Math.sin(a), z]
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      trim.quad(P(R, a0, z0), P(R, a1, z0), P(R, a1, z1), P(R, a0, z1))
      trim.tri(P(R + 0.15, a0, z1), P(R + 0.15, a1, z1), P(0, 0, 26.0)) // domed cap
      if (i % 2 === 0) { const am = (a0 + a1) / 2, q = (r: number, da: number, z: number) => P(r, am + da, z); const ra = R * Math.cos(Math.PI / n) + 0.03; win.quad(q(ra, -0.2, z1 - 2.2), q(ra, 0.2, z1 - 2.2), q(ra, 0.2, z1 - 0.6), q(ra, -0.2, z1 - 0.6)) }
    }
  }
}
// The dome: a square base, a drum with lattice windows, and a bell-shaped
// dome with four blue tile panels.
{
  const CX = 30.5, CY = 0
  block(trim, 26, PAV.x0 + 0.1, -6.5, 6.5, WING - 0.5, 21.5, 0.3, roof)
  for (const f of facesOf(26, PAV.x0 + 0.1, -6.5, 6.5)) merlons(f, 21.5, 1.7, 0.9, 1.0)
  const n = 12, R = 4.4
  const prof: [number, number][] = [[R, 21.5], [R, 25.3], [R + 0.35, 25.6], [R + 0.35, 26.0]]
  // bell: swelling a little, then curving in to the tip
  const bell: [number, number][] = [[4.6, 27.2], [4.4, 28.6], [3.7, 30.0], [2.6, 31.2], [1.3, 32.1], [0.3, 32.6]]
  prof.push(...bell)
  const P = (r: number, a: number, z: number): V3 => [CX + r * Math.cos(a), CY + r * Math.sin(a), z]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * (i - 0.5)) / n, a1 = (2 * Math.PI * (i + 0.5)) / n
      // the blue tile panels: the facets facing the four axes, on the dome's lower part
      const part = k >= 3 && k <= 6 && i % 3 === 0 ? tile : trim
      part.quad(P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1))
      if (k === 0 && i % 3 === 0) { // lattice windows in the drum, on the axes
        const am = (a0 + a1) / 2, q = (da: number, z: number) => P(R * Math.cos(Math.PI / n) + 0.04, am + da, z)
        win.quad(q(-0.09, 22.2), q(0.09, 22.2), q(0.09, 24.8), q(-0.09, 24.8))
      }
    }
  }
  // finial
  const top = prof[prof.length - 1]
  for (let i = 0; i < 6; i++) {
    const a0 = (2 * Math.PI * i) / 6, a1 = (2 * Math.PI * (i + 1)) / 6
    trim.tri(P(top[0], a0, top[1]), P(top[0], a1, top[1]), [CX, CY, 33.6])
  }
}

// ---------------------------------------------------------------------------
// The marquee and the blade.
{
  const x0 = FX + 0.4, x1 = 43.6, y0 = -5.2, y1 = 5.2, z0 = 3.7, z1 = 6.9
  block(red, x0, x1, y0, y1, z0, z1, 0.2, roof)
  red.quad([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0])
  const F = facesOf(x0, x1, y0, y1)
  for (const f of [F[0], F[1], F[2]]) panel(win, f, 0.3, f.len - 0.3, z0 + 0.5, z1 - 0.6, 0.04)
  relief(trim, F[1], 0.2, F[1].len - 0.2, 0.06, z1 - 0.3, z1 + 0.6) // the OAKLAND crest strip
}
{
  const BY = 6.3, BT = 0.6, x0 = FX + 0.2, x1 = 43.2, z0 = 6.9, z1 = 23.2
  block(red, x0, x1, BY - BT, BY + BT, z0, z1, 0.15, red)
  // the crest: a wider cream-edged panel with FOX across it, and a finial
  block(red, x0, x1 + 0.3, BY - BT - 0.05, BY + BT + 0.05, z1 - 0.2, z1 + 1.4, 0.15, red)
  const cap: V3[] = [[x0 + 0.2, BY - 0.5, z1 + 1.4], [x1 + 0.1, BY - 0.5, z1 + 1.4], [x1 + 0.1, BY + 0.5, z1 + 1.4], [x0 + 0.2, BY + 0.5, z1 + 1.4]]
  for (let i = 0; i < 4; i++) trim.tri(cap[i], cap[(i + 1) % 4], [(x0 + x1) / 2, BY, z1 + 2.6])
  type Poly = [number, number][]
  const rect = (u0: number, v0: number, u1: number, v1: number): Poly => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const glyphs = (H: number, W: number, ST: number): Record<string, Poly[]> => ({
    F: [rect(0, 0, ST, H), rect(ST, H - ST, W, H), rect(ST, H / 2 - ST / 2, W - 0.2, H / 2 + ST / 2)],
    O: [rect(0, 0, ST, H), rect(W - ST, 0, W, H), rect(ST, 0, W - ST, ST), rect(ST, H - ST, W - ST, H)],
    X: [[[0, 0], [ST, 0], [W, H], [W - ST, H]], [[W - ST, 0], [W, 0], [ST, H], [0, H]]],
    A: [[[0, 0], [ST, 0], [W / 2 + ST / 4, H], [W / 2 - ST / 4 - 0.12, H]], [[W - ST, 0], [W, 0], [W / 2 + ST / 4 + 0.12, H], [W / 2 - ST / 4, H]], rect(0.35, H * 0.25, W - 0.35, H * 0.25 + ST * 0.9)],
    K: [rect(0, 0, ST, H), [[ST, H / 2 - 0.25], [W - ST, H], [W, H], [ST + 0.3, H / 2 - 0.25]], [[ST + 0.3, H / 2 + 0.05], [W, 0], [W - ST, 0], [ST, H / 2 + 0.05]]],
    L: [rect(0, 0, ST, H), rect(ST, 0, W, ST)],
    N: [rect(0, 0, ST, H), rect(W - ST, 0, W, H), [[ST, H], [ST, H - 0.7], [W - ST, 0], [W - ST, 0.7]]],
    D: [rect(0, 0, ST, H), rect(ST, 0, W - 0.3, ST), rect(ST, H - ST, W - 0.3, H), rect(W - ST, 0.3, W, H - 0.3)],
  })
  const faces = [face([x0, BY - BT], [x1, BY - BT]), face([x1, BY + BT], [x0, BY + BT])]
  const draw = (f: Face, poly: Poly, s0: number, zb: number, d1: number) => {
    const pts = poly.map(([pu, pv]) => [s0 + pu, zb + pv] as [number, number])
    for (let i = 1; i < pts.length - 1; i++) trim.tri(at(f, pts[0][0], d1, pts[0][1]), at(f, pts[i][0], d1, pts[i][1]), at(f, pts[i + 1][0], d1, pts[i + 1][1]))
    for (let i = 0; i < pts.length; i++) {
      const A = pts[i], B = pts[(i + 1) % pts.length]
      trim.quad(at(f, A[0], 0.04, A[1]), at(f, B[0], 0.04, B[1]), at(f, B[0], d1, B[1]), at(f, A[0], d1, A[1]))
    }
  }
  for (const f of faces) {
    const L = f.len // the blade's run, x0..x1
    // FOX across the crest
    const g = glyphs(1.15, 0.8, 0.26), fw = 3 * 0.8 + 2 * 0.15
    ;['F', 'O', 'X'].forEach((c, k) => { for (const poly of g[c]) draw(f, poly, (L - fw) / 2 + k * 0.95, z1 - 0.05, 0.2) })
    // OAKLAND stacked below
    const G = glyphs(1.75, 1.9, 0.45)
    ;[...'OAKLAND'].forEach((c, k) => { for (const poly of G[c]) draw(f, poly, (L - 1.9) / 2 + 0.25, z1 - 2.15 - k * 2.12, 0.14) })
  }
}

const parts = [
  { part: brick, material: finish('fox-brick', 0xe3d0a8) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: red, material: finish('fox-red', 0xbe5a4e) },
  { part: tile, material: finish('fox-blue-tile', 0x6f93ae) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Fox Oakland Theatre', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 33.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/31149191'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-fox-oakland.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
