/**
 * James R. Thompson Center (100 West Randolph, 1985, Murphy/Jahn — Helmut
 * Jahn), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-thompson-center.ts
 *
 * Being renovated for Google (2024–2027): the curtain wall is being reglazed
 * and the atrium refitted, but the form (the leaning curved front, the
 * stepped bands and the sloped rotunda top) is kept. This model draws that
 * form as built and as it stands; the colours follow the 1985 building, and
 * the base's red and white arcade may change when the work ends.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/230926922,
 * 41.8851748,-87.6317257. Its straight walls run at 358.8° / 88.8°, so the
 * catalog bearing is 358.8 and the block is square to this frame.
 *
 * Identity, in order: the leaning, curved glass front that sweeps round the
 * plaza at Clark and Randolph — a quarter cone centred on the block's
 * north-west corner — banded by dark recessed storeys into three tiers; the
 * flat cut where that cone meets the straight Clark Street wall; the
 * truncated glass cylinder of the rotunda, its top sloping down to the
 * front; the red-columned arcade under the overhang.
 *
 * Evidence:
 *  - plan: OSM outline. The curved front fits a circle of radius 113.9 m
 *    centred at (-41.4, 51.0), within a metre of every outline vertex on the
 *    curve; that centre is the block's north-west corner, so the front is
 *    drawn as a cone about it. On USGS NAIP the roof's curved edge lies
 *    ~80-84 m from the same centre; 84 m is used at the roof, so the front
 *    leans back ~30 m over its height. The rotunda's skylight is a circle of
 *    ~26 m radius at (-13, 0) on NAIP, its edge touching the roof edge.
 *  - heights: 94 m overall (OSM height; the rotunda's slanted cut is drawn to ~95.5 m so the slant
 *    reads, within the uncertainty of the shadow measurement);
 *    17 storeys (published). Main roof ~79 m, the arcade ~11.5 m, and the
 *    dark bands at about a third and two thirds of the front, from Ken
 *    Lund's and ajay_suresh's views of the front; estimates.
 *  - rotunda top: the sloping cut, high at the back (~95.5 m; OSM gives 94) and down to the
 *    roof at the front, from the shadow it casts on NAIP and the views from
 *    the plaza; the exact slope is an estimate.
 *  - colour: pale silver panels with blocks of lighter sky-blue glass
 *    (two light window colours), dark bands, the base's salmon-red columns and spandrels pulled to the
 *    palette's lightness.
 *
 * Photos (Wikimedia Commons): James_R._Thompson_Center,_Chicago,_Illinois
 * _(9179428785).jpg and (9179432271).jpg (Ken Lund, CC BY-SA 2.0);
 * James_R._Thompson_Center_(51573845537).jpg (ajay_suresh, CC BY 2.0);
 * James_R._Thompson_Center_Corner_View,_Chicago,_Illinois.jpg (Pokemonprime,
 * CC BY 4.0); James_R._Thompson_Center.JPG (Primeromundo, public domain);
 * James_R_Thompson_Center_behind_Chicago_City_Hall.JPG (CC BY-SA 2.5). USGS
 * NAIP for the plan. No commercial imagery.
 *
 * Left out: the mullion grid and the coloured panel pattern, the Dubuffet
 * sculpture, the pedway and CTA entrances, rooftop plant.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, circle, clip, lathe, rect, save, type XY } from './chi-merchandise-mart'

const X0 = -45.8, X1 = 53.8, Y0 = -62.8, Y1 = 50.3
const C: XY = [-41.4, 51.0]
const R0 = 113.9, RTOP = 84, ARC = 11.5, ROOF = 79
const R = (z: number) => (z <= ARC ? R0 : R0 - ((R0 - RTOP) * (z - ARC)) / (ROOF - ARC))

/** Clip a 3D polygon to the block's rectangle in plan, interpolating z. */
function clip3(poly: V3[]): V3[] {
  let out = poly
  const planes: [number, number, number][] = [[1, 0, -X0], [-1, 0, X1], [0, 1, -Y0], [0, -1, Y1]] // a x + b y + c >= 0
  for (const [a, b, c] of planes) {
    const src = out
    out = []
    for (let k = 0; k < src.length; k++) {
      const p = src[k], q = src[(k + 1) % src.length]
      const sp = a * p[0] + b * p[1] + c, sq = a * q[0] + b * q[1] + c
      if (sp >= 0) out.push(p)
      if ((sp >= 0) !== (sq >= 0)) {
        const t = sp / (sp - sq)
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t])
      }
    }
    if (!out.length) break
  }
  return out
}
const fan = (p: Part, poly: V3[]) => { for (let i = 1; i < poly.length - 1; i++) p.tri(poly[0], poly[i], poly[i + 1]) }

const TH0 = (-96 * Math.PI) / 180, TH1 = (6 * Math.PI) / 180, SEG = 28
const at = (th: number, r: number, z: number): V3 => [C[0] + r * Math.cos(th), C[1] + r * Math.sin(th), z]

/** The cone between z0 and z1 at radii r(z), clipped to the block; outward faces. */
function cone(pick: Part | ((i: number) => Part), z0: number, z1: number, r0 = R(z0), r1 = R(z1)) {
  for (let i = 0; i < SEG; i++) {
    const p = typeof pick === 'function' ? pick(i) : pick
    const a = TH0 + ((TH1 - TH0) * i) / SEG, b = TH0 + ((TH1 - TH0) * (i + 1)) / SEG
    // Counter-clockwise seen from outside (the south-east): angle runs
    // anticlockwise about C, so a→b at the bottom then up.
    const q = clip3([at(a, r0, z0), at(b, r0, z0), at(b, r1, z1), at(a, r1, z1)])
    if (q.length >= 3) fan(p, q)
  }
}

/** A straight wall a→b (counter-clockwise round the block) where it lies inside the cone, z0..z1. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number, steps = 4, out = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const span = (z: number): [number, number] | null => {
    // Points s along the wall within R(z) of C.
    const r = R(z), f: XY = [a[0] - C[0], a[1] - C[1]]
    const B = f[0] * u[0] + f[1] * u[1], Q = f[0] * f[0] + f[1] * f[1] - r * r, D = B * B - Q
    if (D <= 0) return null
    const s0 = Math.max(0, -B - Math.sqrt(D)), s1 = Math.min(L, -B + Math.sqrt(D))
    return s1 - s0 > 0.05 ? [s0, s1] : null
  }
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  for (let k = 0; k < steps; k++) {
    const za = z0 + ((z1 - z0) * k) / steps, zb = z0 + ((z1 - z0) * (k + 1)) / steps
    const A = span(za), B = span(zb)
    if (A && B) p.quad(P(A[0], za), P(A[1], za), P(B[1], zb), P(B[0], zb))
    else if (A) {
      // The cone leaves the wall within this step: close it with a triangle
      // up to where the span shrinks to nothing.
      let lo = za, hi = zb
      for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; if (span(m)) lo = m; else hi = m }
      const S = span(lo) ?? A
      p.tri(P(A[0], za), P(A[1], za), P((S[0] + S[1]) / 2, lo))
    }
  }
}

function build() {
  const curtain = new Part(), blue = new Part(), band = new Part(), red = new Part(), roof = new Part(), glass = new Part()
  const trim = curtain

  // The leaning front in tiers with dark recessed bands between them.
  const tiers: [number, number][] = [[ARC + 3.2, 34.8], [38.6, 56.8], [60.6, ROOF - 1.8]]
  const bands: [number, number][] = [[ARC, ARC + 3.2], [34.8, 38.6], [56.8, 60.6], [ROOF - 1.8, ROOF]]
  // Two tones of glass in broad vertical blocks, staggered tier to tier as
  // in the photos: pale silver panels and a lighter sky blue.
  tiers.forEach(([z0, z1], t) => cone((i) => ((Math.floor(i / 2) + t) % 3 === 0 ? blue : curtain), z0, z1))
  for (const [z0, z1] of bands) cone(band, z0, z1)

  // The straight back walls and the cut flank on Clark Street, in the same
  // bands, from the ground up to the roof.
  const corners: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4]
    wall(curtain, a, b, 0, ARC, 1)
    for (const [z0, z1] of tiers) wall(curtain, a, b, z0, z1, 8)
    for (const [z0, z1] of bands) wall(band, a, b, z0, z1, 1)
  }

  // Roof: the block within RTOP of the corner, and the rotunda.
  const top = clip(circle(C[0], C[1], RTOP, 64), rect(X0, Y0, X1, Y1))
  cap(roof, top, ROOF)

  // Arcade under the overhang: a recessed glass wall, red columns, the
  // overhang's red fascia and its soffit.
  const DEEP = 5.5
  for (let i = 0; i < SEG; i++) {
    const a = TH0 + ((TH1 - TH0) * i) / SEG, b = TH0 + ((TH1 - TH0) * (i + 1)) / SEG
    const q = clip3([at(a, R0 - DEEP, 0), at(b, R0 - DEEP, 0), at(b, R0 - DEEP, ARC), at(a, R0 - DEEP, ARC)])
    if (q.length >= 3) fan(band, q)
    const f = clip3([at(a, R0, ARC - 1.8), at(b, R0, ARC - 1.8), at(b, R0, ARC + 0.8), at(a, R0, ARC + 0.8)])
    if (f.length >= 3) fan(red, f)
    const s = clip3([at(a, R0 - DEEP, ARC - 1.8), at(b, R0 - DEEP, ARC - 1.8), at(b, R0, ARC - 1.8), at(a, R0, ARC - 1.8)])
    if (s.length >= 3) fan(trim, s)
  }
  for (let k = 0; k < 15; k++) {
    const th = TH0 + ((TH1 - TH0) * (k + 0.5)) / 15, c = at(th, R0 - 1.3, 0)
    if (c[0] < X0 + 2 || c[0] > X1 - 2 || c[1] < Y0 + 2) continue
    lathe(red, c[0], c[1], [[0.75, 0], [0.75, ARC - 1.8]], 8)
  }

  // The rotunda: a cylinder through the roof, cut by a plane sloping down
  // to the front (south-east).
  const RC: XY = [-13, 0], rr = 26, d: XY = [Math.SQRT1_2, -Math.SQRT1_2]
  const zc = (p: XY) => 87.5 - 8 * (((p[0] - RC[0]) * d[0] + (p[1] - RC[1]) * d[1]) / rr)
  const ring = circle(RC[0], RC[1], rr, 20)
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length]
    const lo = ROOF - 0.5
    if (zc(p) - lo > 0.2 || zc(q) - lo > 0.2) band.quad([p[0], p[1], lo], [q[0], q[1], lo], [q[0], q[1], zc(q) - 0.5], [p[0], p[1], zc(p) - 0.5])
    trim.quad([p[0], p[1], zc(p) - 0.5], [q[0], q[1], zc(q) - 0.5], [q[0], q[1], zc(q)], [p[0], p[1], zc(p)])
  }
  const c3: V3 = [RC[0], RC[1], zc(RC)]
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length]
    glass.tri(c3, [p[0], p[1], zc(p)], [q[0], q[1], zc(q)])
  }

  return [
    { part: curtain, material: windowVariant(2, 0xd3dbe1) },
    { part: blue, material: windowVariant(3, 0xaecbe1) },
    { part: band, material: PALETTE.window },
    { part: red, material: finish('thompson-red', 0xcf8e80) },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) await save('chi-thompson-center', 'James R. Thompson Center', [41.8851748, -87.6317257], 358.8, build())
