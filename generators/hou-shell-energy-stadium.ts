/**
 * Shell Energy Stadium, Houston (Houston Dynamo FC and Houston Dash; opened
 * 2012 as BBVA Compass Stadium, Populous) — procedural, CC0-1.0, no textures.
 * bun generators/hou-shell-energy-stadium.ts
 *
 * Map frame: x across the field, y along it, z up, metres. Placed at bearing
 * 34.5°, the field's long axis (the long sides of the inner ring
 * way/261250002), so +y points up the field to the north-east end on Texas
 * Avenue and +x to the south-east sideline on Emancipation Avenue. The anchor
 * is the area centroid of the outline way/261098257 (outer ring of
 * building=stadium relation/4829389). z = 0 is the field, the lowest ground:
 * it is about 4 m below the plaza and streets round the stadium (lidar), and
 * the map's terrain (Mapterhorn) shows that pit too, so `elevation` stays 0.
 *
 * What makes it read as itself, from the photos: a rectangular soccer
 * stadium wrapped in a pale silver perforated-metal skin folded into big
 * triangular facets, standing on an orange base; two long flat grey roofs
 * over the sideline stands; an open stand at the north-east end, with the
 * scoreboard / Shell sign frame over its middle and a video board in the
 * skin below it; a box canopy over the middle of the south-west end, with a
 * low white building behind it; orange seats. (The brief said "orange and
 * silver mesh": in every photo the mesh is silver and the orange is the base
 * wall, the podium blocks and the entrance glazing behind the mesh. The model
 * follows the photos.)
 *
 * Evidence
 * - OSM: outline way/261098257 (leisure=stadium, height 21.3) and inner ring
 *   way/261250002 of relation/4829389; no building:parts.
 * - Measured, lidar: USGS 3DEP TX_Coastal_B1_2018 (flight 2018), 1 m, read
 *   in this frame (field 0.5 m above the box's ground_min, which is
 *   subtracted from everything below):
 *   sideline roofs 24.3 m at their front edge (x = ±44) falling to 22.4 m at
 *   the back (x = ±73.5), from y = -52 to y = 87, wrapping the north-east
 *   corners to y ≈ 98; the south-west centre canopy 25.1 → 22.3 m over
 *   x = ±18, y = -40 to -78; the skin's top all round (sampled just inside
 *   the outline, both halves agree within 1 m: `RING`); the north-east stand
 *   rising from 1.5 m at y = 77 to 17 m at y = 105; the sign frame's top
 *   26.4 m at x = ±11, y = 105; sideline podium blocks 9 m, x = ±74 to ±82;
 *   the north-east podium 9 m, y = 111 to 118; the south-west building's
 *   flat roof 8.5 m; plaza and streets 3–4.5 m above the field.
 * - USGS NAIP orthophoto: plan of the roofs, the south-west canopy and white
 *   building, the open north-east stand, the skin's outline.
 * - Published (Wikipedia "Shell Energy Stadium"): opened 2012, Populous;
 *   22,039 seats; renamed 2021 (PNC), 2023 (Shell Energy).
 * - Photos (Wikimedia Commons):
 *   HDFC PR, "Shell Energy Stadium East Facade along Emancipation" (aerial
 *   from the south-east), "Shell Energy Stadium North Facade along Texas
 *   Avenue", "Shell Energy Stadium" (aerial over the north-east end),
 *   "Shell Energy Stadium Geometric Entrance" and "Shell Energy Stadium
 *   Illuminated at Night" (overall aerial at dusk), all CC BY-SA 4.0;
 *   Houtexusa, "BBVA Compass Stadium East Facade", "BBVA Compass Stadium,
 *   North Facade", "BBVA Compass Stadium, Northwest Entrance" (CC BY-SA 3.0,
 *   street level: the orange base and the faceted mesh); WhisperToMe,
 *   "BBVACompassStadiumAnotherview" (CC0) and "BBVACompass000" (CC BY-SA
 *   3.0, from Walker Street: the pale south-west building); Victor Araiza,
 *   "BBVA Compass Stadium 2013-04-28" (CC BY 2.0, inside: orange seats, the
 *   roof truss, the scoreboard); Sonoma23, "Shell Energy Stadium in der
 *   Abenddämmerung" (CC0, inside); Roy Luck, "BBVA Compass Stadium, Houston
 *   TX" (CC BY 2.0, panorama inside).
 *
 * Estimated: the facets' fold (3.4 m out at mid height, the foot 2.4 m out, from the photos), the
 * stands' tier split and the suite band (photos), the roof slab and truss
 * depth (3 m truss, photo), the video board (16 × 9 m, against the base
 * wall in the photos), podium-block gaps (the aerial from the south-east).
 * Left out: the field (the map's), the lettering on the roofs and signs, the
 * light rows under the roof fronts, stairs and ramps, the white trim along the
 * mesh facets, and the part of the white south-west building outside the OSM
 * outline.
 *
 * Doubts: the inside of the sideline stands is under the roofs and only seen
 * in photos from inside, so its rake is estimated. The map lifts the
 * model by the terrain under it (the plaza is about 4 m above the field), so
 * the outside reads a little taller than the real thing above the street.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]

const mesh = new Part(), canopy = new Part(), orange = new Part()
const charcoal = new Part(), seats = new Part(), sign = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** A quad, wound to face `hint`. */
function quad(p: Part, P: V3[], hint: V3) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const o = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  tri(p, P[o[0]], P[o[1]], P[o[2]], hint)
  tri(p, P[o[0]], P[o[2]], P[o[3]], hint)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  const f = cross(sub(B, A), sub(C, A))
  if (Math.hypot(...f) < 1e-9) return
  if (dot(f, hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
/** Axis-aligned box; `skip` drops faces by name. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skip = '', top?: Part, side?: Part) {
  const s = side ?? p
  if (!skip.includes('t')) quad(top ?? p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
  if (!skip.includes('b')) quad(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1])
  if (!skip.includes('e')) quad(s, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  if (!skip.includes('w')) quad(s, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0])
  if (!skip.includes('n')) quad(s, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0])
  if (!skip.includes('s')) quad(s, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
}
/** A wall split into pieces no longer than 5 m, so the map's drape can bend it. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number, out: V3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 5))
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n
    const p0: XY = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0]
    const p1: XY = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]
    quad(p, [[p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1]], out)
  }
}
/** A flat roof over a polygon star-shaped from `c`, with its walls. */
function block(poly: XY[], c: XY, z: number, roofP: Part, wallP: Part) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    tri(roofP, [c[0], c[1], z], [a[0], a[1], z], [b[0], b[1], z], [0, 0, 1])
    const out: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    const m: XY = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]
    wall(wallP, a, b, 0, z, out[0] * m[0] + out[1] * m[1] > 0 ? out : mul(out, -1))
  }
}

// ---------------------------------------------------------------------------
// The skin's ring: the outline, made symmetrical across the field's axis,
// with the skin's top height at each corner (lidar, see header). Given for
// the south-east half (x ≥ 0) from the north-east end round to the
// south-west end, and mirrored.

const C: XY = [0, 16.5] // centre of the field
const RING: [number, number, number][] = [
  [0, 112, 21.7], [11, 112, 21.4], [17, 112, 20.1], [23, 112, 18.5], [34, 111.6, 17.4], [47, 109.8, 17.6],
  [57, 104, 19], [62, 101, 20.6], [64.5, 97, 22.4], [67.5, 92, 22.6], [70.5, 87.5, 22.5], [73.5, 72, 22.4],
  [73.5, 36, 22.4], [73.5, 0, 22.4], [73.5, -36, 22.4], [71, -51, 22.6], [68, -57, 22.7], [64, -63, 22.0], [60, -67, 20.2],
  [57, -71, 18.5], [53.5, -75.5, 15.5], [50, -79, 12.5], [44, -80, 14], [31, -81, 14], [23, -82, 14.5],
  [19, -82, 20.5], [0, -82, 20.8],
]
// Densify each edge to segments of at most 7 m, then mirror.
const half: [number, number, number][] = []
for (let i = 0; i < RING.length - 1; i++) {
  const [x0, y0, h0] = RING[i], [x1, y1, h1] = RING[i + 1]
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 7))
  for (let j = 0; j < n; j++) {
    const t = j / n
    half.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, h0 + (h1 - h0) * t])
  }
}
half.push(RING[RING.length - 1])
// Clockwise from above: down the +x side, back up the -x side.
const ring: [number, number, number][] = [...half, ...half.slice(1, -1).reverse().map(([x, y, h]) => [-x, y, h] as [number, number, number])]
const N = ring.length
const P = (k: number) => ring[((k % N) + N) % N]

/** Unit outward normal (away from C) of ring segment k → k+1. */
function segOut(k: number): XY {
  const a = P(k), b = P(k + 1)
  let n: XY = [b[1] - a[1], -(b[0] - a[0])]
  const l = Math.hypot(n[0], n[1])
  n = [n[0] / l, n[1] / l]
  const m: XY = [(a[0] + b[0]) / 2 - C[0], (a[1] + b[1]) / 2 - C[1]]
  return n[0] * m[0] + n[1] * m[1] >= 0 ? n : [-n[0], -n[1]]
}
/** Outward normal at ring vertex k (average of its segments). */
function vOut(k: number): XY {
  const a = segOut(k - 1), b = segOut(k)
  const n: XY = [a[0] + b[0], a[1] + b[1]], l = Math.hypot(n[0], n[1])
  return [n[0] / l, n[1] / l]
}

// ---------------------------------------------------------------------------
// The skin: orange base wall up to the podium roofs (8.5 m; dark recessed
// concourse along the sidelines, between the podium blocks), then the silver
// mesh folded into diamonds. Both sides drawn, so it reads from inside too.

const BASE = 8.5
for (let k = 0; k < N; k++) {
  const a = P(k), b = P(k + 1), o = segOut(k)
  const oa = vOut(k), ob = vOut(k + 1)
  wall(Math.abs(a[0]) > 72 && Math.abs(b[0]) > 72 ? charcoal : orange, [a[0] + oa[0] * 0.6, a[1] + oa[1] * 0.6], [b[0] + ob[0] * 0.6, b[1] + ob[1] * 0.6], 0, BASE, [o[0], o[1], 0])
}
// One diamond bay per two ring segments: its top corners on the outline, its
// bottom corners 2.4 m out over the base (the skin leans out at its foot, as
// photographed), its centre 3.4 m out, so each bay reads as the photos' big
// folded X.
if (N % 2) throw new Error('ring needs an even count')
for (let k = 0; k < N; k += 2) {
  const a = P(k), m = P(k + 1), b = P(k + 2), oa = vOut(k), ob = vOut(k + 2), om = vOut(k + 1)
  const B0: V3 = [a[0] + oa[0] * 2.4, a[1] + oa[1] * 2.4, BASE], B1: V3 = [b[0] + ob[0] * 2.4, b[1] + ob[1] * 2.4, BASE]
  const T0: V3 = [a[0], a[1], a[2]], T1: V3 = [b[0], b[1], b[2]]
  const M: V3 = [m[0] + om[0] * 3.4, m[1] + om[1] * 2.2, (BASE + m[2]) / 2]
  const out: V3 = [om[0], om[1], 0]
  for (const [A, Bv] of [[B0, B1], [B1, T1], [T1, T0], [T0, B0]] as [V3, V3][]) {
    tri(mesh, A, Bv, M, out)
    tri(mesh, A, Bv, M, mul(out, -1))
  }
}

// ---------------------------------------------------------------------------
// Stands, lofted between the field edge and the back of the stands, along
// rays from the field's centre through each ring vertex: a 1.2 m field wall,
// the lower tier, a riser (the suites, glazed, on the sidelines), the upper
// tier, and a walkway back to the skin.

const FX = 40.5, FY0 = -44, FY1 = 77 // field edge: the inner ring plus 2 m
function fieldEdge(d: XY): XY {
  const ts: number[] = []
  if (d[0] !== 0) ts.push((Math.sign(d[0]) * FX - 0) / d[0])
  if (d[1] !== 0) ts.push(((d[1] > 0 ? FY1 : FY0) - C[1]) / d[1])
  const t = Math.min(...ts.filter(t => t > 0))
  return [C[0] + d[0] * t, C[1] + d[1] * t]
}
type Prof = { f: XY; m: XY; b: XY; zb: number; zm: number; side: boolean }
const prof: Prof[] = []
for (let k = 0; k < N; k++) {
  const [x, y, h] = P(k)
  const d: XY = [x - C[0], y - C[1]]
  const f = fieldEdge(d), o = vOut(k)
  const b: XY = [x - o[0] * 1.5, y - o[1] * 1.5]
  const zb = Math.min(h - 1.2, 20)
  const t = 0.48
  const m: XY = [f[0] + (b[0] - f[0]) * t, f[1] + (b[1] - f[1]) * t]
  const side = Math.abs(x) > 72 && y > -40 && y < 75
  prof.push({ f, m, b, zb, zm: 1.2 + (zb - 1.2) * 0.4, side })
}
const v3 = (p: XY, z: number): V3 => [p[0], p[1], z]
for (let k = 0; k < N; k++) {
  const A = prof[k], B = prof[(k + 1) % N]
  const inw: V3 = [C[0] - (A.f[0] + B.f[0]) / 2, C[1] - (A.f[1] + B.f[1]) / 2, 0]
  const up: V3 = [inw[0] * 0.02, inw[1] * 0.02, 1]
  quad(charcoal, [v3(A.f, 0), v3(B.f, 0), v3(B.f, 1.2), v3(A.f, 1.2)], inw) // field wall
  quad(seats, [v3(A.f, 1.2), v3(B.f, 1.2), v3(B.m, B.zm), v3(A.m, A.zm)], up) // lower tier
  quad(charcoal, [v3(A.m, A.zm), v3(B.m, B.zm), v3(B.m, A.zm + 2.6), v3(A.m, A.zm + 2.6)], inw)
  quad(seats, [v3(A.m, A.zm + 2.6), v3(B.m, B.zm + 2.6), v3(B.b, B.zb), v3(A.b, A.zb)], up) // upper tier
  const ra = P(k), rb = P(k + 1)
  quad(canopy, [v3(A.b, A.zb), v3(B.b, B.zb), [rb[0], rb[1], B.zb], [ra[0], ra[1], A.zb]], [0, 0, 1]) // walkway
}

// ---------------------------------------------------------------------------
// The sideline roofs: flat grey slabs falling from 24.3 m at the front to
// 22.4 m at the skin, with a 3 m dark truss along the front edge and a dark
// soffit. South-east half; mirrored.

const ROOF: XY[] = [[44, -52], [52, -53], [60, -58], [65, -62], [68, -57], [71, -51], [73.5, -36], [73.5, 72], [70.5, 87.5], [67.5, 92], [64.5, 97], [57, 88], [44, 87]]
const roofZ = (x: number) => 24.3 - ((Math.abs(x) - 44) * 1.9) / 29.5
for (const s of [1, -1]) {
  const poly = ROOF.map(([x, y]) => [s * x, y] as XY)
  const c: XY = [s * 60, 15]
  const TH = 0.9
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    tri(canopy, [c[0], c[1], roofZ(c[0])], [a[0], a[1], roofZ(a[0])], [b[0], b[1], roofZ(b[0])], [0, 0, 1])
    tri(charcoal, [c[0], c[1], roofZ(c[0]) - TH], [a[0], a[1], roofZ(a[0]) - TH], [b[0], b[1], roofZ(b[0]) - TH], [0, 0, -1])
    const n: V3 = [b[1] - a[1], -(b[0] - a[0]), 0]
    const m: XY = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1]]
    const out = n[0] * m[0] + n[1] * m[1] > 0 ? n : mul(n, -1)
    quad(canopy, [[a[0], a[1], roofZ(a[0]) - TH], [b[0], b[1], roofZ(b[0]) - TH], [b[0], b[1], roofZ(b[0])], [a[0], a[1], roofZ(a[0])]], out)
  }
  // The front truss.
  const x = s * 44, z = roofZ(44) - TH
  box(charcoal, Math.min(x, x - s * 2.5), Math.max(x, x - s * 2.5), -52, 87, z - 2.6, z, 't')
}

// ---------------------------------------------------------------------------
// South-west end: the box canopy over the middle of the stand (25.1 → 22.3 m,
// a 2.5 m fascia all round), and the low white building behind it.

{
  const x = 18.5, y0 = -78, y1 = -40, z = (y: number) => 22.3 + ((y - y0) * 2.8) / (y1 - y0), F = 2.5
  quad(canopy, [[-x, y0, z(y0)], [x, y0, z(y0)], [x, y1, z(y1)], [-x, y1, z(y1)]], [0, 0, 1])
  quad(charcoal, [[-x, y0, z(y0) - F], [x, y0, z(y0) - F], [x, y1, z(y1) - F], [-x, y1, z(y1) - F]], [0, 0, -1])
  quad(canopy, [[-x, y1, z(y1) - F], [x, y1, z(y1) - F], [x, y1, z(y1)], [-x, y1, z(y1)]], [0, 1, 0])
  quad(canopy, [[-x, y0, z(y0) - F], [x, y0, z(y0) - F], [x, y0, z(y0)], [-x, y0, z(y0)]], [0, -1, 0])
  for (const s of [1, -1]) quad(canopy, [[s * x, y0, z(y0) - F], [s * x, y1, z(y1) - F], [s * x, y1, z(y1)], [s * x, y0, z(y0)]], [s, 0, 0])
}
block([[48, -118.5], [52.5, -103], [58.5, -75.5], [50.5, -79.6], [25, -82.6], [-25, -82.6], [-50.5, -79.6], [-58.5, -75.5], [-52.5, -103], [-48, -118.5]], [0, -100], 8.5, mesh, mesh)

// ---------------------------------------------------------------------------
// Orange podium blocks outside the skin along both sidelines (with gaps for
// the stairs) and along the north-east end, 9 m, with pale roofs.

for (const s of [1, -1]) for (const [y0, y1] of [[-40, -14], [-8, 46], [52, 72]]) {
  const xa = s * 74, xb = s * 82
  box(orange, Math.min(xa, xb), Math.max(xa, xb), y0, y1, 0, 9, 'b' + (s > 0 ? 'w' : 'e'), canopy)
}
box(orange, -38, 38, 112.5, 118.5, 0, 9, 'bs', canopy)

// ---------------------------------------------------------------------------
// North-east end: the scoreboard frame over the middle of the stand (top
// 26.4 m), its back carrying the lit Shell sign to the street, and the video
// board set in the skin below it.

box(charcoal, -13, 13, 104, 106.5, 15.5, 26.4)
quad(sign, [[-12.2, 106.55, 16.3], [12.2, 106.55, 16.3], [12.2, 106.55, 25.6], [-12.2, 106.55, 25.6]], [0, 1, 0])
box(charcoal, -8, 8, 112, 114, 10, 19, 'bs')

// ---------------------------------------------------------------------------
// Materials (six). Silver mesh and the pale south-west building; the grey
// roofs, walkways and podium roofs; Dynamo orange (the base, the podium
// blocks and the seats, as photographed; pulled to the palette's lightness);
// charcoal for the trusses, soffits, field wall and boards; suite glazing;
// the Shell sign, lit at night.
const parts = [
  { part: mesh, material: finish('shell-stadium-mesh', 0xdde0e2) },
  { part: canopy, material: finish('shell-stadium-roof', 0xa9afb4) },
  { part: orange, material: finish('dynamo-orange', 0xdf7b4a) },
  { part: charcoal, material: finish('shell-stadium-charcoal', 0x4a4f57) },
  { part: seats, material: finish('dynamo-seats', 0xa86f58) },
  { part: sign, material: finish('neon-shell-sign', 0xf0ebe0) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(26), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Shell Energy Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 34.5, osm: 'relation/4829389', height: 26.4,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/hou-shell-energy-stadium.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
