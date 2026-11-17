/**
 * AT&T Stadium (Cowboys Stadium), Arlington, Texas (2009, HKS) — procedural,
 * CC0-1.0.
 * bun generators/dal-att-stadium.ts
 *
 * What makes it AT&T Stadium: the two huge steel box arches that run the
 * length of the building over the retractable roof and come down outside
 * each end onto concrete feet; the low white dome, with the raised plateau
 * of the two retractable panels riding on the arches; the glass end walls
 * (the end-zone doors) under a curved fascia, with the arch legs standing in
 * front of them between the projecting corner blocks; and the dark glass
 * wall that leans outward all round the long sides, with a glazed band set
 * back above it under the roof's eave.
 *
 * Frame: built in a frame turned to bearing 339°, so +x runs along the long
 * axis (69°, towards the north-east end zone) and +y across it (339°). The
 * axis is the line through the four OSM arch-foot buildings (way/126704934,
 * 126704935, 126704936, 126705089), whose pairs both run at 69.0°; their
 * middle lands within 1 m of the outline's centroid. The anchor is the area
 * centroid of OSM way/47086748 (the stadium outline), -97.092837 32.747842.
 *
 * Ground: the field is below grade, so y = 0 is the field and the street
 * outside is at z = 15 (S below). Catalog `elevation` is -15: published
 * "the field sits 50 feet below street level" (Walter P Moore, the
 * structural engineer, walterpmoore.com project page; the geotechnical
 * write-up at geoprac.net gives about 54 ft; Wikipedia gives an average
 * excavation of 54 ft). The walls run straight down from the street to
 * the field, out of sight below ground.
 *
 * Heights and plan, measured from USGS 3DEP lidar TX_Pecos_Dallas_B3_2018
 * (2018 flight; the stadium dates from 2009), 1 m grid, read in this frame
 * with tools/lidar_frame.py. Street level is taken as 11.0 m above the
 * grid's ground_min (the plazas and car parks all round read 10-11 m); all
 * heights below are above the street:
 * - the leaning side wall's top: a flat ring at 30.6 m with a 32.1 m lip,
 *   its outline 122 m off the axis at mid-length, 103.5 m at x = ±100,
 *   80.5 m at ±135, and corner blocks reaching x = ±158 beside the end
 *   walls (traced every 5 m; the points in WALL_TOP);
 * - the roof: an elliptic paraboloid, z = 78.9 - 0.001682 x² - 0.002373 y²,
 *   fitted to 12 lidar points to within 1 m; its eave an ellipse 160 by
 *   116.5 m, cut off by the end walls at x = ±143.5, which the lidar shows
 *   as a sheer drop from 44.5 m at the axis;
 * - the retractable panels: a plateau |x| ≤ 65, |y| ≤ 45 (as OSM
 *   way/126702663), 83.3 m at the crown and 77 m at its ends;
 * - the arches: centred 41.2 m either side of the axis (OSM's arch-leg
 *   footprints, 4.4 m wide), their top a circle through the lidar points on
 *   the legs, centre 218.8 m below the street, radius 296.4 m, so 77.6 m at
 *   the crown (under the panels) and meeting the street at x = ±200; the
 *   lidar shows the legs to within 1 m of that circle from x = 140 to 195.
 *   Over the roof the arches are nearly flush with it; they are drawn 1.5 m
 *   proud so they read.
 * - the arch feet: concrete wedges about 7 m high (lidar) on OSM's footprints
 *   at x = 182-200.
 *
 * Published (cited): arches 1,225 ft long and 292 ft above the field, a
 * box truss 35 ft deep by 17 ft wide (bdcnetwork.com "Cowboys stadium soars
 * in Arlington"; walterpmoore.com); end-zone doors 180 ft wide by 120 ft
 * high in five leaves of 38 ft (bdcnetwork.com; AIA "AIArchitect" 2009);
 * the canted glass wall 86 ft high, sloping outward at 14°; a translucent
 * fabric roof whose opening is 410 by 256 ft (walterpmoore.com). The lidar
 * puts the arch top about 93 m above the field against a published 89 m
 * (292 ft); the lidar is kept, since it is what the map's street sees.
 *
 * Estimated from the photos: the wall's lean taken as the published 14°
 * over the lidar's 30.6 m (7.6 m); the end walls leaning out 3.5 m over
 * their height; the eave fascia 2.5 m and the eave 2 m proud of the set-back
 * glazed band; the end-wall fascia 3 m; the door posts and door head.
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "Arlington June 2020 2/3/4 (AT&T Stadium).jpg", Michael Barera,
 *   CC BY-SA 4.0: the south-west end zone from the park, arch legs in front
 *   of the doors, the leaning side wall and the corner blocks;
 * - "Richard Greene Linear Park June 2020 27 (AT&T Stadium).jpg", Michael
 *   Barera, CC BY-SA 4.0: from the south, the end and the long south-east
 *   side, the roof plateau and the set-back glazed band;
 * - "AT&T Stadium, home of the Dallas Cowboys ... LCCN2015630685.tif" and
 *   "Cowboys Stadium, a domed stadium with a retractable roof ...
 *   LCCN2013650777.tif", Carol M. Highsmith, public domain: the north-east
 *   end and the long side across the lake;
 * - "Cowboys stadium outside view.JPG", Mahanga, CC BY 3.0: an end;
 * - "Dallas Stadium Support.JPG", M.Fitzsimmons, CC BY-SA 3.0: an arch leg
 *   close up, its open box truss and the concrete wedge it lands on;
 * - "Cowboys Stadium 2.jpg", bobbyh_80, CC BY 2.0: dusk, the lit end wall;
 * - "Cowboys-Stadium-Night.jpg", Alienevil, CC BY-SA 3.0: night, the side
 *   wall and the band above it lit, the roof dark.
 * - Plan: USGS NAIP orthophoto (public domain).
 *
 * Left out: the AT&T globes and lettering on the roof and over the doors,
 * the video board inside, the stands (under the roof), the plazas, flags and
 * the Cowboys star. The arches' truss webbing is drawn only on the legs.
 *
 * Doubts: no licensed photo from the north-west side (it is drawn as the
 * mirror of the south-east, as the lidar shows it is); the end walls' lean is
 * estimated; the 15 m field depth is the published round figure.
 * Terrain: `bun tools/terrain.ts check dal-att-stadium` prints ok at
 * elevation -15. An earlier build failed it (637 m² buried, 6.9 m deep, at
 * the arch feet) because the legs' chords and diagonals ran on below the
 * street to their circle's ground crossing, 6 m under the street inside the
 * feet; every leg member now stops where its underside meets the street.
 * The field depth and arch circle were not the cause. Street level measured
 * on the same lidar's ground grid: 172.5-173.5 m at the four feet, 173.9-
 * 174.0 m on the end and south-east plazas (S = 173.87 m here), 170-172 m
 * on the north-west side, which falls away; the map drapes the street-level
 * parts over those differences. The field itself can't be measured (the
 * roof was closed for the flight), so its depth stays the published 50 ft.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const S = 15 // the street, above the field (y = 0)

const roof = new Part(), panel = new Part(), steel = new Part()
const glass = new Part(), endGlass = new Part()
const skirt = roof // the walls below the street, out of sight on the map

// ---------------------------------------------------------------- helpers

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => {
  const l = Math.hypot(...a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
/** A planar polygon (convex, or fan-safe from its first corner), wound to face `hint`. */
function face(p: Part, P: V3[], hint: V3, normals?: V3[]) {
  let n: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]
  }
  const flip = dot(n, hint) < 0
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1]
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-7) continue
    const na = normals && [normals[0], normals[i], normals[i + 1]]
    if (flip) p.tri(a, c, b, undefined, undefined, undefined, na && [na[0], na[2], na[1]])
    else p.tri(a, b, c, undefined, undefined, undefined, na)
  }
}
/** A tube through successive 4-corner sections, closed at both ends. */
function tube(p: Part, secs: V3[][], caps = true) {
  const centre = (s: V3[]): V3 => [0, 1, 2].map((k) => s.reduce((t, q) => t + q[k], 0) / s.length) as V3
  for (let k = 0; k < secs.length - 1; k++) {
    const a = secs[k], b = secs[k + 1], c = centre([...a, ...b])
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const q = [a[i], a[j], b[j], b[i]]
      face(p, q, sub(centre(q), c))
    }
  }
  if (caps) {
    const f = secs[0], l = secs[secs.length - 1]
    face(p, f, sub(centre(f), centre(secs[1])))
    face(p, l, sub(centre(l), centre(secs[secs.length - 2])))
  }
}
/** Ear-clipping triangulation of a simple polygon in plan, at height z, facing up. */
function capPolygon(p: Part, poly: XY[], z: number) {
  const area = poly.reduce((s, a, i) => { const b = poly[(i + 1) % poly.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const idx = poly.map((_, i) => i)
  if (area < 0) idx.reverse()
  const crs = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => crs(a, b, q) >= 0 && crs(b, c, q) >= 0 && crs(c, a, q) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (crs(a, b, c) <= 1e-9) continue
      if (idx.some((k) => k !== ia && k !== ib && k !== ic && inside(poly[k], a, b, c))) continue
      p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) {
    const [a, b, c] = idx.map((k) => poly[k])
    p.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
  }
}
/** Catmull-Rom through points, `per` samples per span. */
function spline(pts: XY[], per: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

// ---------------------------------------------------------------- the forms

/** The roof's surface, above the field (lidar fit). */
const roofZ = (x: number, y: number) => S + 78.9 - 0.001682 * x * x - 0.002373 * y * y
const roofN = (x: number, y: number): V3 => unit([2 * 0.001682 * x, 2 * 0.002373 * y, 1])
const EA = 160, EB = 116.5 // the eave ellipse
const XE = 143.5 // the end walls' top
const T0 = Math.acos(XE / EA) // the eave's parameter where it meets an end wall
const YE = EB * Math.sin(T0) // 51.5: the end walls' half-width at the eave
const eave = (t: number): XY => [EA * Math.cos(t), EB * Math.sin(t)]
const WALL_H = 30.6, LIP = 1.5
const LEAN = WALL_H * Math.tan((14 * Math.PI) / 180)

// The leaning wall's top (lidar), one quarter from the axis to the corner
// block's tip, and the lean's weight at each point (the blocks' end faces
// stand upright).
const WALL_TOP: [number, number, number][] = [
  [0, 122, 1], [20, 121.5, 1], [40, 120.5, 1], [60, 117, 1], [80, 111.5, 1], [100, 103.5, 1],
  [120, 92.5, 1], [135, 80.5, 1], [146, 70, 1], [150, 65, 0.8], [154, 60, 0.5], [158, 54, 0], [158, 47, 0],
]

// --- The leaning glass wall, the lip and the flat ring behind it, per side.
for (const sy of [1, -1]) {
  // The arc from the +x corner block round to the -x one.
  const q = WALL_TOP.map(([x, y]) => [x, y] as XY)
  const sm = spline(q.slice(0, 10), 3).concat(q.slice(10)) // smooth the long side, keep the block's corners
  const w = (i: number) => {
    // weights along `sm`: 1 until the block, then from WALL_TOP
    const p = sm[i]
    const j = WALL_TOP.findIndex(([x, y]) => Math.abs(x - p[0]) < 1e-6 && Math.abs(y - p[1]) < 1e-6)
    return j >= 0 ? WALL_TOP[j][2] : 1
  }
  const quarter = sm.map((p, i) => ({ p, w: w(i) }))
  const arc = [...quarter.slice().reverse(), ...quarter.slice(1).map(({ p, w }) => ({ p: [-p[0], p[1]] as XY, w }))]
  // arc runs +x tip → axis → -x tip; mirror for the -y side
  const top: XY[] = arc.map(({ p }) => [p[0], sy * p[1]])
  const wt = arc.map(({ w }) => w)
  const n = top.length
  const nrm = (i: number): XY => {
    const a = top[Math.max(0, i - 1)], b = top[Math.min(n - 1, i + 1)]
    let d: XY = [b[0] - a[0], b[1] - a[1]]
    const l = Math.hypot(...d)
    d = [d[0] / l, d[1] / l]
    let o: XY = [d[1], -d[0]]
    if (o[0] * top[i][0] + o[1] * top[i][1] < 0) o = [-o[0], -o[1]]
    return o
  }
  const base: XY[] = top.map((p, i) => { const o = nrm(i); return [p[0] - o[0] * LEAN * wt[i], p[1] - o[1] * LEAN * wt[i]] })
  for (let i = 0; i < n - 1; i++) {
    const out: V3 = [...nrm(i), 0] as V3
    const b0 = base[i], b1 = base[i + 1], t0 = top[i], t1 = top[i + 1]
    face(glass, [[b0[0], b0[1], S], [b1[0], b1[1], S], [t1[0], t1[1], S + WALL_H], [t0[0], t0[1], S + WALL_H]], out)
    face(steel, [[t0[0], t0[1], S + WALL_H], [t1[0], t1[1], S + WALL_H], [t1[0], t1[1], S + WALL_H + LIP], [t0[0], t0[1], S + WALL_H + LIP]], out)
    face(skirt, [[b0[0], b0[1], 0], [b1[0], b1[1], 0], [b1[0], b1[1], S], [b0[0], b0[1], S]], out)
    // two pale floor lines across the glass, as the photos show its bands
    for (const f of [0.36, 0.68]) {
      const g = f + 0.9 / WALL_H, o = 0.15
      const at = (b: XY, t: XY, s: number, k: number): V3 => {
        const nn = nrm(k)
        return [b[0] + (t[0] - b[0]) * s + nn[0] * o, b[1] + (t[1] - b[1]) * s + nn[1] * o, S + WALL_H * s]
      }
      face(steel, [at(b0, t0, f, i), at(b1, t1, f, i + 1), at(b1, t1, g, i + 1), at(b0, t0, g, i)], out)
    }
  }
  // The corner blocks' inner faces, towards the arch legs, at |y| = 47.
  for (const sx of [1, -1]) {
    const tip = top[sx > 0 ? 0 : n - 1]
    face(glass, [[sx * (XE - 3.5), tip[1], 0], [tip[0], tip[1], 0], [tip[0], tip[1], S + WALL_H + LIP], [sx * (XE - 3.5), tip[1], S + WALL_H + LIP]], [0, -sy, 0])
  }
  // The flat ring on top, closed across behind the end walls.
  capPolygon(roof, [...top, [-(XE - 3.5), sy * 47], [XE - 3.5, sy * 47]], S + WALL_H + LIP)
}

// --- The set-back glazed band under the eave, its soffit and fascia, and the roof.
const NA = 36 // eave samples per side
const FASCIA = 2.5, SET = 2
{
  for (const sy of [1, -1]) {
    const ts = Array.from({ length: NA + 1 }, (_, k) => T0 + ((Math.PI - 2 * T0) * k) / NA)
    const E = ts.map((t) => { const [x, y] = eave(t); return [x, sy * y] as XY })
    const nE = ts.map((t) => { const v = unit([Math.cos(t) / EA, (sy * Math.sin(t)) / EB, 0]); return [v[0], v[1]] as XY })
    const C = E.map((p, k) => [p[0] - nE[k][0] * SET, p[1] - nE[k][1] * SET] as XY)
    // pin the band's ends to the end walls
    C[0] = [XE - 0.3, C[0][1]]
    C[NA] = [-(XE - 0.3), C[NA][1]]
    for (let k = 0; k < NA; k++) {
      const out: V3 = [(nE[k][0] + nE[k + 1][0]) / 2, (nE[k][1] + nE[k + 1][1]) / 2, 0]
      const z0 = roofZ(...E[k]), z1 = roofZ(...E[k + 1])
      const lo = S + WALL_H + LIP
      face(glass, [[C[k][0], C[k][1], lo], [C[k + 1][0], C[k + 1][1], lo], [C[k + 1][0], C[k + 1][1], z1 - FASCIA], [C[k][0], C[k][1], z0 - FASCIA]], out)
      face(roof, [[E[k][0], E[k][1], z0 - FASCIA], [E[k + 1][0], E[k + 1][1], z1 - FASCIA], [E[k + 1][0], E[k + 1][1], z1], [E[k][0], E[k][1], z0]], out)
      face(roof, [[C[k][0], C[k][1], z0 - FASCIA], [C[k + 1][0], C[k + 1][1], z1 - FASCIA], [E[k + 1][0], E[k + 1][1], z1 - FASCIA], [E[k][0], E[k][1], z0 - FASCIA]], [0, 0, -1])
    }
  }
  // The roof: rings scaled from its outline (the eave's two arcs and the
  // two straight ends), smooth-shaded from the paraboloid's gradient.
  const ring: XY[] = []
  for (let k = 0; k < NA; k++) { const [x, y] = eave(T0 + ((Math.PI - 2 * T0) * k) / NA); ring.push([x, y]) }
  const NE = 8
  for (let k = 0; k < NE; k++) ring.push([-XE, YE - (2 * YE * k) / NE])
  for (let k = 0; k < NA; k++) { const [x, y] = eave(T0 + ((Math.PI - 2 * T0) * k) / NA); ring.push([-x, -y]) }
  for (let k = 0; k < NE; k++) ring.push([XE, -YE + (2 * YE * k) / NE])
  const us = [1, 0.93, 0.84, 0.73, 0.6, 0.45, 0.28, 0.12]
  const P = (u: number, i: number): V3 => { const [x, y] = ring[i % ring.length]; return [x * u, y * u, roofZ(x * u, y * u)] }
  const N = (p: V3) => roofN(p[0], p[1])
  const m = ring.length
  for (let r = 0; r < us.length - 1; r++)
    for (let i = 0; i < m; i++) {
      const a = P(us[r], i), b = P(us[r], i + 1), c = P(us[r + 1], i + 1), d = P(us[r + 1], i)
      face(roof, [a, b, c], [0, 0, 1], [N(a), N(b), N(c)])
      face(roof, [a, c, d], [0, 0, 1], [N(a), N(c), N(d)])
    }
  const top: V3 = [0, 0, roofZ(0, 0)]
  for (let i = 0; i < m; i++) { const a = P(us[us.length - 1], i), b = P(us[us.length - 1], i + 1); face(roof, [a, b, top], [0, 0, 1], [N(a), N(b), [0, 0, 1]]) }
}

// --- The end walls: glass from the field to the roof's edge, leaning out,
// under a white fascia, with the five door leaves' posts and the door head.
const END_LEAN = 3.5, DOOR_H = 36.6, DOOR_W = 29
for (const sx of [1, -1]) {
  const xAt = (z: number) => sx * (XE - END_LEAN * (1 - Math.max(0, z - S) / (roofZ(XE, 0) - S)))
  const NS = 12
  for (let k = 0; k < NS; k++) {
    const y0 = -YE + (2 * YE * k) / NS, y1 = -YE + (2 * YE * (k + 1)) / NS
    const z0 = roofZ(XE, y0) - 3, z1 = roofZ(XE, y1) - 3
    face(endGlass, [[xAt(S), y0, S], [xAt(S), y1, S], [xAt(z1), y1, z1], [xAt(z0), y0, z0]], [sx, 0, 0])
    face(skirt, [[xAt(S), y0, 0], [xAt(S), y1, 0], [xAt(S), y1, S], [xAt(S), y0, S]], [sx, 0, 0])
    // fascia, 3 m, a little proud
    const f = (z: number) => xAt(z) + sx * 0.5
    face(roof, [[f(z0), y0, z0], [f(z1), y1, z1], [f(z1 + 3), y1, z1 + 3], [f(z0 + 3), y0, z0 + 3]], [sx, 0, 0])
    face(roof, [[f(z0), y0, z0], [xAt(z0), y0, z0], [xAt(z1), y1, z1], [f(z1), y1, z1]], [0, 0, -1])
  }
  // posts and door head, proud of the glass
  const post = (y: number, wdt: number, z0: number, z1: number) => {
    const d = 0.6
    const s0 = [[-wdt / 2, 0], [wdt / 2, 0], [wdt / 2, d], [-wdt / 2, d]] as XY[]
    const sec = (z: number) => s0.map(([a, o]) => [xAt(z) + sx * o, y + a, z] as V3)
    tube(steel, [sec(z0), sec(z1)])
  }
  for (const y of [-DOOR_W, -DOOR_W * 0.6, -DOOR_W * 0.2, DOOR_W * 0.2, DOOR_W * 0.6, DOOR_W]) post(y, Math.abs(y) === DOOR_W ? 2.2 : 1.2, S, S + DOOR_H)
  for (const y of [-YE + 1.5, YE - 1.5]) post(y, 2.5, S, roofZ(XE, YE) - 3)
  {
    const d = 0.7, z0 = S + DOOR_H, z1 = S + DOOR_H + 2.4
    const sec = (y: number) => [[xAt(z0), y, z0], [xAt(z1), y, z1], [xAt(z1) + sx * d, y, z1], [xAt(z0) + sx * d, y, z0]] as V3[]
    tube(steel, [sec(-DOOR_W - 1.1), sec(DOOR_W + 1.1)])
    // a transom halfway up the doors
    const zm = S + DOOR_H / 2, sec2 = (y: number) => [[xAt(zm), y, zm], [xAt(zm + 1), y, zm + 1], [xAt(zm + 1) + sx * 0.5, y, zm + 1], [xAt(zm) + sx * 0.5, y, zm]] as V3[]
    tube(steel, [sec2(-DOOR_W), sec2(DOOR_W)])
  }
}

// --- The retractable panels: a plateau over the opening, on the arches.
{
  const X = 65, Y = 45, nx = 10, ny = 6
  const pz = (x: number, y: number) => S + 83.3 - 0.0015 * x * x - 0.0022 * y * y
  const pn = (x: number, y: number): V3 => unit([0.003 * x, 0.0044 * y, 1])
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) {
      const x0 = -X + (2 * X * i) / nx, x1 = -X + (2 * X * (i + 1)) / nx
      const y0 = -Y + (2 * Y * j) / ny, y1 = -Y + (2 * Y * (j + 1)) / ny
      const c: V3[] = [[x0, y0, pz(x0, y0)], [x1, y0, pz(x1, y0)], [x1, y1, pz(x1, y1)], [x0, y1, pz(x0, y1)]]
      const ns = c.map((p) => pn(p[0], p[1]))
      face(panel, [c[0], c[1], c[2]], [0, 0, 1], [ns[0], ns[1], ns[2]])
      face(panel, [c[0], c[2], c[3]], [0, 0, 1], [ns[0], ns[2], ns[3]])
    }
  // the sides, down into the dome
  const side = (a: XY, b: XY, out: V3, n: number) => {
    for (let k = 0; k < n; k++) {
      const p = (s: number): XY => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]
      const p0 = p(k / n), p1 = p((k + 1) / n)
      face(panel, [[p0[0], p0[1], roofZ(...p0) - 1], [p1[0], p1[1], roofZ(...p1) - 1], [p1[0], p1[1], pz(...p1)], [p0[0], p0[1], pz(...p0)]], out)
    }
  }
  side([X, -Y], [X, Y], [1, 0, 0], ny)
  side([-X, Y], [-X, -Y], [-1, 0, 0], ny)
  side([X, Y], [-X, Y], [0, 1, 0], nx)
  side([-X, -Y], [X, -Y], [0, -1, 0], nx)
}

// --- The arches. The top of each is a circle (lidar): centre 218.8 m below
// the street, radius 296.4 m; the box is 10.7 m deep (35 ft) and drawn 6.5 m
// wide on the legs (17 ft is 5.2 m) and 8 m over the roof, where the truss
// and its catwalks read as a broad raised band: widened to read on a phone.
const AY = 41.2, AW = 6.5, AD = 10.7, AWR = 8, PROUD = 2.5
const RC = -218.8 + S, RR = 296.4
const archTop = (x: number) => RC + Math.sqrt(RR * RR - x * x)
for (const sy of [1, -1]) {
  const yc = sy * AY
  const yl = yc - AW / 2, yr = yc + AW / 2
  // Over the roof, from under the panels to the end wall: a box riding
  // proud of the dome.
  for (const side of [-1, 1]) {
    const run = [60, 72, 86, 100, 114, 126, 136, XE].map((x) => side * x).sort((a, b) => a - b)
    const yl = yc - AWR / 2, yr = yc + AWR / 2
    const secs = run.map((x) => {
      const zt = Math.max(archTop(x), roofZ(x, yc) + PROUD)
      const zb = Math.min(roofZ(x, yl), roofZ(x, yr)) - 1
      return [[x, yl, zb], [x, yr, zb], [x, yr, zt], [x, yl, zt]] as V3[]
    })
    tube(steel, secs)
  }
  // The legs, outside the end walls: an open box truss, a top and a bottom
  // chord with diagonals between, down into the feet.
  for (const sx of [1, -1]) {
    const f0 = Math.asin((XE - 1) / RR)
    const at = (f: number, r: number, y: number): V3 => [sx * r * Math.sin(f), y, RC + r * Math.cos(f)]
    // Every member stops where its underside meets the street: nothing of
    // the legs is drawn below the street (they end in the concrete feet).
    const fEnd = (r: number) => Math.acos((S - RC) / r)
    const chord = (r0: number, r1: number) => {
      const f1 = fEnd(r0)
      const n = 8
      const secs: V3[][] = []
      for (let k = 0; k <= n; k++) {
        const f = f0 + ((f1 - f0) * k) / n
        secs.push([at(f, r0, yl), at(f, r0, yr), at(f, r1, yr), at(f, r1, yl)])
      }
      tube(steel, secs)
    }
    const CH = 3
    chord(RR - CH, RR) // top chord
    chord(RR - AD, RR - AD + CH) // bottom chord
    // diagonals, a Warren pattern, as plates across the box
    const nd = 8, f1 = fEnd(RR - AD + CH - 0.2) - 1.6 / RR // the diagonals stop where the bottom chord does
    for (let k = 0; k < nd; k++) {
      const fa = f0 + ((f1 - f0) * k) / nd, fb = f0 + ((f1 - f0) * (k + 1)) / nd
      const [fTop, fBot] = k % 2 ? [fa, fb] : [fb, fa]
      const t = 1.6 / RR // half the plate's thickness, as an angle
      const rT = RR - CH + 0.2, rB = RR - AD + CH - 0.2
      const secA = [at(fTop - t, rT, yl), at(fTop - t, rT, yr), at(fTop + t, rT, yr), at(fTop + t, rT, yl)]
      const secB = [at(fBot - t, rB, yl), at(fBot - t, rB, yr), at(fBot + t, rB, yr), at(fBot + t, rB, yl)]
      tube(steel, [secA, secB])
    }
    // The foot: a concrete wedge on OSM's footprint, peaked at 7 m.
    const x0 = sx * 182, x1 = sx * 201, xr = sx * 192, H = 7.5, e = 1
    const y0 = yc - 4.3, y1 = yc + 4.3
    const pts = (y: number): V3[] => [[x0, y, S - 2], [x0, y, S + e], [xr, y, S + H], [x1, y, S + e], [x1, y, S - 2]]
    const L = pts(y0), R = pts(y1)
    face(steel, L, [0, -1, 0])
    face(steel, R, [0, 1, 0])
    for (let k = 0; k < 4; k++) {
      const q = [L[k], L[k + 1], R[k + 1], R[k]]
      const mid: V3 = [(q[0][0] + q[1][0]) / 2, 0, (q[0][2] + q[1][2]) / 2]
      face(steel, q, sub(mid, [xr, 0, S + 2]))
    }
  }
}

// ---------------------------------------------------------------- materials and output
// From the daylight photos: the roof and fascias a cool white; the panels a
// touch brighter; the arches, door frames and the wall's lip silver-grey
// painted steel; the leaning side wall and the band above it blue-grey
// glass (lit at night); the end walls paler glass, showing the lit bowl
// through it at night.
const parts = [
  { part: roof, material: finish('att-roof', 0xe4e7e9) },
  { part: panel, material: finish('att-roof-panel', 0xf2f3f2) },
  {
    part: steel,
    material: {
      ...finish('att-arch-steel', 0xaab4bd),
      // the arch legs are floodlit at night (night photo); nothing else on this material
      floodlight: (p: V3) => (Math.abs(p[0]) > 145 && Math.abs(Math.abs(p[1]) - AY) < 6 ? 0.8 : 0),
    },
  },
  { part: glass, material: { ...PALETTE.window, color: 0x76899a } },
  { part: endGlass, material: windowVariant(2, 0x8ea4b6) },
]
const out = parts
const triangles = out.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of out) console.log(material.name.padEnd(18), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('AT&T Stadium', out, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the field below the way/47086748 centroid; bearing 339',
  bearing: 339, elevation: -15, osm: 'way/47086748',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/dal-att-stadium.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
