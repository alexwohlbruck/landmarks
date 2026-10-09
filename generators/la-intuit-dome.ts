/**
 * Intuit Dome, Inglewood (LA Clippers arena, AECOM, opened August 2024) —
 * procedural, CC0-1.0.
 * bun generators/la-intuit-dome.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The anchor is the
 * area centroid of OSM way/1209626565 (building=stadium "Intuit Dome").
 * The site is flat (USGS 3DEP 26.5-28 m outside the excavation), so y = 0 is
 * the natural grade the published heights are measured from.
 *
 * What makes it the Intuit Dome, above all from above: a squat egg of a
 * shell, faceted all over in a diamond grid of pale PTFE panels; a broad
 * flat top whose solar panels swirl round in a pinwheel; the big blue
 * "INTUIT DOME" disc in the middle of them; and the red steel diagrid left
 * bare over the glazed lobby at the west end, by the main entrance on the
 * plaza.
 *
 * Sources:
 * - Plan: OSM way/1209626565 (234 × 134 m), sampled in polar angle about the
 *   middle of its bounding box and lightly smoothed, so the mapper's square
 *   corners and the notch at the west entrance round off into the shell's
 *   egg. USGS NAIP 2022-05-11 (under construction) for the bowl's centre,
 *   which the solar top is centred on.
 * - Heights: the LA County 2020 lidar predates the arena (it shows the
 *   1-2 storey buildings that stood on the site, all under 10 m), so no
 *   height here is measured. Published: top of the shell 121 ft (36.9 m)
 *   above natural grade (STRUCTURE magazine, "Intuit Dome Is Nothing But
 *   Net"); roof shell 277,000 sq ft; 18,000 seats.
 * - Photos: "Intuit dome from the air pic 2" and "Intuit Dome from the air 1"
 *   (AVandewerdt, CC BY-SA 4.0, Commons; high oblique from the south: the
 *   solar pinwheel, the blue disc, the facets, the red diagrid at the NW);
 *   "2023_11_16_ind-den-lax-sony_158" (Nfrastructure, CC BY 2.0, Flickr;
 *   near-overhead, red diagrid along the west end); "Intuit Dome under
 *   construction October 2023 from the southwest" and "... from the west"
 *   (Dialh, CC0; the egg profile and the full red diagrid before cladding);
 *   "Intuit Dome from Prairie Ave", "... from Century Blvd and Prairie Ave",
 *   "... Exterior and Main Entrance", "... from L.A. Clippers Plaza",
 *   "... Exterior from L.A. Clippers Plaza" (Spatms, CC BY-SA 4.0; the west
 *   and north-west sides by day: pale facets, red diagrid at the entrance).
 * - Estimated: the top disc (140 × 108 m, centred 25 m east of the
 *   outline's middle, from its share of the shell's length in the two
 *   aerials: about 72 m of shell west of it and 20 m east), the blue disc
 *   (44 m, 0.37 of the solar top's width in the aerials), the profile (a
 *   tucked-in foot, the widest girth at 14 m, a rounded shoulder about 20 m
 *   across, then a gentle slope to the top's edge at 35 m, steep everywhere
 *   as the photos from the west and south-west show), the plan (the OSM
 *   trace smoothed and blended half and half with an ellipse on its
 *   bounding box, because the trace's square SE corner and west notch are
 *   not in the photos), the extent of the red diagrid (112°-168°
 *   anticlockwise from east about the middle, the north-west, up the flank
 *   and over the shoulder, from the plaza and Prairie Avenue photos), the
 *   facet count (60 round, 8 rows, alternate diagonals 1.3 m proud; the real
 *   panels are smaller), the solar arms (32 rows of panel blocks, turning
 *   anticlockwise outwards as seen from above, about 45°).
 * - Colours, from the daylight photos pulled to the palette's lightness:
 *   PTFE skin cool silver #d3d7da, roof membrane #e9ebea, Clippers red
 *   #c65a52, solar panels #4d5563 (no darker than charcoal), Intuit blue
 *   #5d8fcf, the lobby glazing behind the red diagrid `window`.
 * - Left out: the plaza and its paving; the plaza's white shade canopy, its
 *   buildings and video board (OSM way/1499990023, way/1499990024 and the
 *   roofs way/1499990026-27 are separate buildings, and no post-2024
 *   orthophoto places the canopy); the Players' Garage (way/1323019262) and
 *   the garages and bridge over Prairie Avenue; the INTUIT DOME lettering.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const shell = new Part(), lobby = new Part(), red = new Part()
const solar = new Part(), blue = new Part(), rim = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

/** A triangle wound to face `hint`. */
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  const f = cross(sub(B, A), sub(C, A))
  if (Math.hypot(...f) < 1e-9) return
  if (dot(f, hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
function quad(p: Part, P: V3[], hint: V3) {
  tri(p, P[0], P[1], P[2], hint)
  tri(p, P[0], P[2], P[3], hint)
}

/** A flat strip from a to b, `w` wide, lying on the surface whose outward normal is `outward`. */
function ribbon(p: Part, a: V3, b: V3, w: number) {
  const n = outward(mul(add(a, b), 0.5))
  const s = mul(unit(cross(sub(b, a), n)), w / 2)
  const lo = (q: V3): V3 => [q[0], q[1], Math.max(0.05, q[2])]
  quad(p, [lo(sub(a, s)), lo(add(a, s)), lo(add(b, s)), lo(sub(b, s))], n)
}

// ---------------------------------------------------------------------------
// Plan: OSM way/1209626565 in the anchor frame.
const OSM: XY[] = [[80.8, 52.5], [77.8, 54.6], [62.2, 64.5], [-13.8, 69.6], [-31.9, 67.4], [-50.9, 62.9], [-67.0, 57.3], [-76.5, 52.8], [-77.7, 52.1], [-85.0, 47.7], [-95.8, 39.0], [-102.5, 32.4], [-107.8, 23.4], [-120.9, 22.6], [-122.3, 2.4], [-117.6, -30.9], [-101.5, -31.5], [-92.3, -39.2], [-83.0, -46.9], [-72.1, -53.0], [-62.3, -57.2], [-58.7, -57.8], [-57.9, -64.3], [30.3, -64.5], [30.1, -58.6], [111.9, -58.8], [109.6, -0.3], [109.2, 10.8], [106.5, 19.7], [97.8, 36.1], [88.0, 45.7]]
const C: XY = [-5.2, 2.5] // middle of the outline's bounding box
/** Distance from C to the outline along angle t (anticlockwise from east). */
function reach(t: number): number {
  const d: XY = [Math.cos(t), Math.sin(t)]
  let best = 0
  for (let i = 0; i < OSM.length; i++) {
    const [x1, y1] = OSM[i], [x2, y2] = OSM[(i + 1) % OSM.length]
    const ex = x2 - x1, ey = y2 - y1, den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-12) continue
    const qx = x1 - C[0], qy = y1 - C[1]
    const r = (qx * ey - qy * ex) / den, s = (qx * d[1] - qy * d[0]) / den
    if (r > 0 && s >= -1e-6 && s <= 1 + 1e-6) best = Math.max(best, r)
  }
  return best
}
const J = 60 // facets round the shell
const raw = Array.from({ length: 4 * J }, (_, i) => reach((i / (4 * J)) * 2 * Math.PI))
/** The base radius at angle t: the trace averaged over ±15°, blended with an ellipse. */
function baseR(t: number): number {
  const n = raw.length, w = 10
  const i0 = Math.round((((t / (2 * Math.PI)) % 1 + 1) % 1) * n)
  let s = 0
  for (let k = -w; k <= w; k++) s += raw[(i0 + k + n) % n]
  // Half the smoothed trace, half a superellipse on its bounding box: the
  // shell is an egg, the trace a hand-drawn polygon with square corners.
  const c = Math.abs(Math.cos(t)), si = Math.abs(Math.sin(t)), SE = 2.0
  const sup = 1 / ((c / 117) ** SE + (si / 67) ** SE) ** (1 / SE)
  return 0.5 * (s / (2 * w + 1)) + 0.5 * sup
}

// The flat top: an ellipse over the bowl, the solar field and the blue disc.
const D: XY = [20, 1], TA = 70, TB = 54
const LOGO = 22
const Z_EDGE = 35, Z_TOP = 36.9, Z_WIDE = 14
/** The top's edge at angle t about D. */
const topEdge = (t: number): XY => {
  const c = Math.cos(t), s = Math.sin(t)
  const r = 1 / Math.hypot(c / TA, s / TB)
  return [D[0] + r * c, D[1] + r * s]
}

// ---------------------------------------------------------------------------
// Shell: steep everywhere, as the photos from the west and south-west show:
// a tucked-in foot, the widest girth at Z_WIDE, a rounded shoulder about
// 20 m across, then a gentle slope in to the edge of the top. Where the
// shell runs far past the top (the long west end over the lobby) that slope
// is long and low; on the north and south flanks there is barely any.
// Alternate rings turn by half a facet, so the flat-shaded triangles make
// the diamond grid.
const K = 9
/** Ring k's inset from the outline (m) and height, given the margin M between outline and top. */
function profile(k: number, M: number): [number, number] {
  const R = Math.min(M * 0.6, 20)
  const zs = Z_EDGE - 0.08 * (M - R) // top of the shoulder
  switch (k) {
    case 0: return [2.6, 0]
    case 1: return [0.7, Z_WIDE / 2]
    case 2: return [0, Z_WIDE]
  }
  if (k <= 5) {
    const ph = ((k - 2) / 3) * (Math.PI / 2)
    return [R * (1 - Math.cos(ph)), Z_WIDE + (zs - Z_WIDE) * Math.sin(ph)]
  }
  const u = (k - 5) / 3
  return [R + (M - R) * u, zs + (Z_EDGE - zs) * u]
}
const ringPt = (k: number, j: number): V3 => {
  const off = k % 2 ? 0.5 : 0
  const a = ((j + off) / J) * 2 * Math.PI
  const r = baseR(a)
  const b: XY = [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]
  // The top's edge in the same direction, seen from D.
  const t = topEdge(Math.atan2(b[1] - D[1], b[0] - D[0]))
  const M = Math.hypot(b[0] - t[0], b[1] - t[1])
  const [inset, z] = profile(k, M)
  const f = 1 - inset / M
  // Alternate diagonals of the lattice stand 1.3 m proud, so the flat
  // facets fold like the real shell's shingled diamond panels.
  const m = j - Math.floor(k / 2)
  const bump = k > 0 && k < K - 1 && ((m % 2) + 2) % 2 === 0 ? 1.3 : 0
  const o = unit([b[0] - t[0], b[1] - t[1], Math.max(0, z - Z_WIDE) / 10])
  return [t[0] + (b[0] - t[0]) * f + o[0] * bump, t[1] + (b[1] - t[1]) * f + o[1] * bump, z + o[2] * bump]
}
const ring = Array.from({ length: K }, (_, k) => Array.from({ length: J }, (_, j) => ringPt(k, j)))

// The bare red diagrid over the glazed lobby: the west end, from NNW round
// to WSW about C (angles anticlockwise from east).
const RED0 = (112 * Math.PI) / 180, RED1 = (168 * Math.PI) / 180
const angOf = (p: V3) => {
  const a = Math.atan2(p[1] - C[1], p[0] - C[0])
  return a < 0 ? a + 2 * Math.PI : a
}
const inRed = (...ps: V3[]) => {
  const a = angOf(mul(ps.reduce((s, p) => add(s, p), [0, 0, 0] as V3), 1 / ps.length))
  // Up the flank and over the shoulder, as from the plaza; the top over the
  // lobby is clad like the rest.
  return a >= RED0 && a <= RED1 && ps.every(p => p[2] < Z_EDGE - 1.5)
}
const outward = (p: V3): V3 => unit([p[0] - D[0], p[1] - D[1], Math.max(0, p[2] - Z_WIDE) * 1.5])

for (let k = 0; k < K - 1; k++) {
  const A = ring[k], B = ring[k + 1]
  for (let j = 0; j < J; j++) {
    const j1 = (j + 1) % J
    // Even ring k: B[j] sits between A[j] and A[j+1]; odd: A[j+1] sits between B[j] and B[j+1].
    const t1: V3[] = k % 2 === 0 ? [A[j], A[j1], B[j]] : [A[j1], B[j1], B[j]]
    const t2: V3[] = k % 2 === 0 ? [A[j1], B[j1], B[j]] : [A[j], A[j1], B[j]]
    for (const t of [t1, t2]) {
      const c = mul(add(add(t[0], t[1]), t[2]), 1 / 3)
      tri(inRed(...t) ? lobby : shell, t[0], t[1], t[2], outward(c))
    }
  }
}
// Red diagrid: every facet edge in the west end, set just proud of the glass.
{
  const lift = (p: V3) => add(p, mul(outward(p), 0.7))
  const seen = new Set<string>()
  const edge = (a: V3, b: V3) => {
    const key = [a, b].map(p => p.map(v => v.toFixed(2)).join(',')).sort().join('|')
    if (seen.has(key) || !inRed(a, b)) return
    seen.add(key)
    ribbon(red, lift(a), lift(b), 1.8)
  }
  for (let k = 0; k < K - 1; k++) for (let j = 0; j < J; j++) {
    const j1 = (j + 1) % J
    const A = ring[k], B = ring[k + 1]
    if (k % 2 === 0) { edge(A[j], B[j]); edge(A[j1], B[j]) } else { edge(A[j1], B[j]); edge(A[j1], B[j1]) }
    if (k > 0 && k < K - 1) edge(A[j], A[j1])
  }
}
// The foot: close the shell down to the ground under its tuck.
for (let j = 0; j < J; j++) {
  const a = ring[0][j], b = ring[0][(j + 1) % J]
  if (a[2] > 0.01) quad(shell, [[a[0], a[1], 0], [b[0], b[1], 0], b, a], outward(a))
}

// ---------------------------------------------------------------------------
// The top: from its edge (the shell's last ring) in to the blue disc, rising
// gently to the middle; solar arms swirl over it.
const TOPN = 3
const topZ = (s: number) => Z_EDGE + (Z_TOP - 0.4 - Z_EDGE) * (1 - (1 - s) ** 2) // s: 0 edge → 1 disc
const edgeTop = ring[K - 1]
const discPt = (p: V3, s: number): V3 => {
  const a = Math.atan2(p[1] - D[1], p[0] - D[0])
  const L: XY = [D[0] + LOGO * Math.cos(a), D[1] + LOGO * Math.sin(a)]
  return [p[0] + (L[0] - p[0]) * s, p[1] + (L[1] - p[1]) * s, topZ(s)]
}
for (let i = 0; i < TOPN; i++) {
  const s0 = i / TOPN, s1 = (i + 1) / TOPN
  for (let j = 0; j < J; j++) {
    const p = edgeTop[j], q = edgeTop[(j + 1) % J]
    quad(rim, [discPt(p, s0), discPt(q, s0), discPt(q, s1), discPt(p, s1)], [0, 0, 1])
  }
}
// The blue disc on its white curb.
{
  const N = 32, zc = Z_TOP - 0.4, zb = Z_TOP
  const P = (r: number, i: number, z: number): V3 => [D[0] + r * Math.cos((i / N) * 2 * Math.PI), D[1] + r * Math.sin((i / N) * 2 * Math.PI), z]
  for (let i = 0; i < N; i++) {
    quad(rim, [P(LOGO, i, zc - 0.6), P(LOGO, i + 1, zc - 0.6), P(LOGO, i + 1, zb), P(LOGO, i, zb)], [Math.cos(((i + 0.5) / N) * 2 * Math.PI), Math.sin(((i + 0.5) / N) * 2 * Math.PI), 0])
    quad(rim, [P(LOGO, i, zb), P(LOGO, i + 1, zb), P(LOGO - 1.6, i + 1, zb), P(LOGO - 1.6, i, zb)], [0, 0, 1])
    tri(blue, [D[0], D[1], zb], P(LOGO - 1.6, i, zb), P(LOGO - 1.6, i + 1, zb), [0, 0, 1])
  }
}
// Solar arms: strips in the top's own polar frame, from just outside the disc
// to just inside the edge, each turning anticlockwise as it goes out.
{
  const ARMS = 32, SEG = 8, S0 = 0.06, S1 = 0.96, TWIST = (45 * Math.PI) / 180, FILL = 0.62
  // The top in polar form about D: radius at angle a between the disc and the edge.
  const edgeAt = (a: number): XY => topEdge(a)
  const at = (a: number, s: number): V3 => {
    const e = edgeAt(a)
    const L: XY = [D[0] + LOGO * Math.cos(a), D[1] + LOGO * Math.sin(a)]
    // s: 0 at the disc, 1 at the edge (the opposite sense to topZ's).
    return [L[0] + (e[0] - L[0]) * s, L[1] + (e[1] - L[1]) * s, topZ(1 - s) + 0.35]
  }
  const half = (FILL * Math.PI) / ARMS
  for (let i = 0; i < ARMS; i++) {
    const a0 = (i / ARMS) * 2 * Math.PI
    for (let g = 0; g < SEG; g++) {
      // Each arm is a row of panel blocks with gaps between, as the real rows of
      // panels are, not one continuous band.
      const s = S0 + ((S1 - S0) * g) / SEG, t = S0 + ((S1 - S0) * (g + 0.8)) / SEG
      const as = a0 + TWIST * ((s - S0) / (S1 - S0)) ** 1.2, at2 = a0 + TWIST * ((t - S0) / (S1 - S0)) ** 1.2
      // Arms widen outwards with the circumference.
      const ws = half * (0.75 + 0.25 * s), wt = half * (0.75 + 0.25 * t)
      quad(solar, [at(as - ws, s), at(as + ws, s), at(at2 + wt, t), at(at2 - wt, t)], [0, 0, 1])
    }
  }
}

// ---------------------------------------------------------------------------
// Palette, from the daylight photos pulled to the palette's lightness: the
// PTFE skin a cool pale silver (it reads near white from the air, grey-white
// from the street), the lobby `glass`, the diagrid Clippers red softened,
// the solar panels a dark slate blue no darker than charcoal, the disc
// Intuit blue softened, and its curb white `trim`.
const parts = [
  { part: shell, material: finish('ptfe-silver', 0xd3d7da) },
  { part: lobby, material: PALETTE.window },
  { part: red, material: finish('clippers-red', 0xc65a52) },
  { part: solar, material: finish('solar-panel', 0x4d5563, 0.4) },
  { part: blue, material: finish('intuit-blue', 0x5d8fcf) },
  { part: rim, material: finish('roof-white', 0xe9ebea) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Intuit Dome', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/1209626565',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-intuit-dome.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
