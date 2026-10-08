/**
 * NASCAR Hall of Fame, Charlotte — procedural, CC0-1.0, no textures.
 * bun generators/nascar-hall-of-fame.ts [out.glb]
 *
 * Map frame: x across the block (+x towards South Caldwell Street, south-east),
 * y along it (+y towards the plaza and East MLK Jr Boulevard, north-east), z up,
 * metres. Placed at bearing 55°, the long axis of the OSM outline. The anchor is
 * the area centroid of the outline (way/322278731); every coordinate below is
 * that outline and its building:parts measured in this rotated frame.
 *
 * What makes it read as itself is the stainless-steel "racetrack" ribbon: a
 * broad banked band, bulging outward like a track's banking, wrapped round
 * the oval. It is broken twice in plan — by the NASCAR Plaza office tower on
 * the south-east side (a separate building, not modelled) and by the pale
 * stone block on the north-west side — so it is two sweeps:
 *
 *  - east: along the south-east side, round the rounded east end, where it
 *    drops low over the Great Hall's glass, then rising and thinning across
 *    the plaza front and leaving the wall as a cantilevered blade (OSM's metal
 *    building:part) that ends against the stone block;
 *  - west: from a pointed tip at the stone block round the west end, ending
 *    against the tower.
 *
 * Evidence
 * - Lidar (USGS 3DEP NC Phase 4, Mecklenburg 2016, 1 m), against the lowest
 *   ground under the footprint (the west end): the bowl's rim and the main
 *   roof are both at 21 m all round — the band's top is the roof edge, not a
 *   wall above it; inside the rim at the west end the roof drops to 13.6 m;
 *   the blade's top is 19.5 m at its root, 18.3–18.8 m midway and 20 m at its
 *   tip; stone block 22.5 m, ballroom 26.5 m, link 23–25 m, the west-end
 *   corner blocks 14 m. The outline is the bowl's outer edge (ground just
 *   outside it).
 * - Photos: Daniel Lobo (Commons, CC BY 2.0, the plaza front and the rounded
 *   east end), Jeffrey Hayes (Commons, CC BY 2.0, the same from the plaza),
 *   Denton Harryman (Commons, CC0, the west end: the bowl over the base and
 *   its murals, the NASCAR Plaza tower behind on the right), Groupuscule
 *   (Commons, CC BY-SA 3.0, from the convention centre), Ken Lund
 *   (Flickr/Commons, CC BY-SA 2.0, the stone block and the blade's tip).
 *   Read off them, scaled to the lidar: the bowl's bottom edge 10 m up on
 *   the long sides, dipping to about 4.5 m round the east end and rising to
 *   about 12.5 m over the plaza front; the Great Hall's glass on a 3 m stone
 *   plinth up to the band; the band leans out over a base set back about
 *   4.5 m (estimated), most at the east end; long dark slots run along it.
 *   The band is drawn a little broader and more upright on the long sides
 *   than the photos show, so it reads from above at phone size.
 * - Estimated: the set-back and the bulge of the bowl, the slot positions,
 *   the murals' size and spacing, the north-west side (no photo: plain stone),
 *   the blade's underside.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const stone = new Part(), trim = new Part(), glass = new Part()
const ribbon = new Part(), soffit = new Part(), roof = new Part()

// ---------------------------------------------------------------------------
// Small vector helpers.

const unit3 = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const smooth = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c) }

/** A quad with per-corner normals; the winding is chosen to face the normals. */
function quad(p: Part, P: V3[], N: V3[]) {
  const n = N.map(unit3)
  const avg: V3 = [0, 0, 0]
  for (const v of n) for (let k = 0; k < 3; k++) avg[k] += v[k]
  const face = cross3(sub3(P[1], P[0]), sub3(P[2], P[0]))
  const o = dot3(face, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const tri = (a: number, b: number, c: number) => {
    const area = Math.hypot(...cross3(sub3(P[b], P[a]), sub3(P[c], P[a])))
    if (area > 1e-8) p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [n[a], n[b], n[c]])
  }
  tri(o[0], o[1], o[2])
  tri(o[0], o[2], o[3])
}

// ---------------------------------------------------------------------------
// Polygons: counter-clockwise from above.

const area = (poly: XY[]) => poly.reduce((s, p, i) => {
  const q = poly[(i + 1) % poly.length]
  return s + p[0] * q[1] - q[0] * p[1]
}, 0) / 2
const ccw = (poly: XY[]) => (area(poly) < 0 ? [...poly].reverse() : poly)

/** Ear clipping, for the concave roof of the oval. */
function earClip(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const crossz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) =>
    crossz(a, b, p) > 1e-9 && crossz(b, c, p) > 1e-9 && crossz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (crossz(a, b, c) <= 1e-9) continue
      if (idx.some(j => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      clipped = true
      break
    }
    if (!clipped) idx.splice(0, 1) // degenerate sliver: drop a collinear point
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

function cap(p: Part, poly: XY[], z: number) {
  for (const [a, b, c] of earClip(poly))
    p.tri([...poly[a], z], [...poly[b], z], [...poly[c], z], undefined, undefined, undefined, [[0, 0, 1], [0, 0, 1], [0, 0, 1]])
}

/** Outward unit normal of each edge, and a mitred inset of each vertex. */
function edgeNormal(a: XY, b: XY): XY {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
  return [dy / l, -dx / l]
}
function inset(poly: XY[], d: number): XY[] {
  const n = poly.length
  return poly.map((p, i) => {
    const a = edgeNormal(poly[(i + n - 1) % n], p), b = edgeNormal(p, poly[(i + 1) % n])
    const m: XY = [a[0] + b[0], a[1] + b[1]]
    const l = Math.hypot(...m) || 1
    const cos = Math.max(0.5, (m[0] * a[0] + m[1] * a[1]) / l) // limit the mitre
    return [p[0] - (m[0] / l) * (d / cos), p[1] - (m[1] / l) * (d / cos)]
  })
}

/**
 * A prism with a rounded top edge: vertical walls (material per edge and per
 * height band), a bevel rolling over to the roof, and a flat roof.
 */
type Band = { p: Part; z0: number; z1: number; recess?: number }
function prism(poly: XY[], z0: number, z1: number, walls: (a: XY, b: XY) => Band[], top: Part, bevel = 0.45) {
  poly = ccw(poly)
  const n = poly.length, zb = z1 - bevel
  const lip = inset(poly, bevel)
  const all = poly.map((a, i) => walls(a, poly[(i + 1) % n]))
  const recessed = all.map(bands => bands.some(b => b.recess))
  const RECESS = 0.05 // windows sit just into the wall (STYLE.md)
  const back = inset(poly, RECESS) // mitred, so neighbouring recessed bays meet
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = poly[i], b = poly[j]
    const nm = edgeNormal(a, b), N: V3 = [nm[0], nm[1], 0]
    const bands = all[i]
    for (const band of bands) {
      const lo = Math.max(z0, band.z0), hi = Math.min(zb, band.z1)
      if (hi <= lo) continue
      if (!band.recess) {
        quad(band.p, [[...a, lo], [...b, lo], [...b, hi], [...a, hi]], [N, N, N, N])
        continue
      }
      const A = recessed[(i + n - 1) % n] ? back[i] : ([a[0] - nm[0] * RECESS, a[1] - nm[1] * RECESS] as XY)
      const B = recessed[j] ? back[j] : ([b[0] - nm[0] * RECESS, b[1] - nm[1] * RECESS] as XY)
      quad(band.p, [[...A, lo], [...B, lo], [...B, hi], [...A, hi]], [N, N, N, N])
      // Sills above and below a recessed band, and jambs where it starts and
      // stops, in the surrounding wall's stone.
      const U: V3 = [0, 0, 1], D: V3 = [0, 0, -1]
      quad(stone, [[...a, lo], [...b, lo], [...B, lo], [...A, lo]], [U, U, U, U])
      quad(stone, [[...a, hi], [...b, hi], [...B, hi], [...A, hi]], [D, D, D, D])
      const t: V3 = [b[0] - a[0], b[1] - a[1], 0]
      if (!recessed[(i + n - 1) % n]) quad(stone, [[...a, lo], [...A, lo], [...A, hi], [...a, hi]], [t, t, t, t].map(unit3))
      if (!recessed[j]) { const m = unit3([-t[0], -t[1], 0]); quad(stone, [[...b, lo], [...B, lo], [...B, hi], [...b, hi]], [m, m, m, m]) }
    }
    const mid = unit3([nm[0], nm[1], 1])
    quad(bands.at(-1)!.p === glass ? stone : bands.at(-1)!.p, [[...a, zb], [...b, zb], [...lip[j], z1], [...lip[i], z1]],
      [unit3([nm[0], nm[1], 0.3]), unit3([nm[0], nm[1], 0.3]), mid, mid])
  }
  cap(top, lip, z1)
}

// ---------------------------------------------------------------------------
// OSM geometry in the model frame (bearing 55°, origin at the outline's
// centroid).

/** The rounded east end and SE side, tower corner to the blade's root. */
const EAST: XY[] = [
  [51.5, -5.0], [52.7, 4.3], [53.3, 13.5], [54.3, 23.3], [54.2, 30.8], [54.3, 39.4], [53.0, 53.3], [51.6, 62.5],
  [50.1, 69.6], [48.9, 73.6], [45.2, 82.2], [41.4, 87.9], [37.9, 92.0], [34.1, 94.8], [29.9, 97.2], [25.8, 98.7],
  [21.8, 99.6], [17.7, 100.0], [13.9, 99.6], [8.5, 98.4], [3.7, 96.3], [1.0, 94.1],
]
/** The blade's outer edge (way/766639184), root to tip at the stone block. */
const BLADE: XY[] = [[-1.4, 93.8], [-3.8, 92.6], [-7.8, 89.2], [-12.9, 83.7], [-17.1, 79.0], [-21.2, 72.3], [-23.8, 66.2], [-26.1, 60.3], [-27.2, 56.0]]
/** The north-west side and the west end, stone block to tower. */
const WEST: XY[] = [
  [-44.1, 7.6], [-43.8, 1.4], [-43.5, -4.5], [-44.0, -10.5], [-44.8, -21.9], [-45.0, -35.6], [-44.4, -48.4], [-43.2, -60.5],
  [-41.6, -69.8], [-38.7, -78.4], [-36.2, -83.9], [-32.8, -90.0], [-27.6, -96.3], [-24.5, -99.0], [-20.9, -101.5],
  [-18.7, -102.7], [-15.2, -104.2], [-12.0, -104.9], [-9.2, -105.4], [-4.2, -105.7], [0.4, -105.1], [4.5, -104.0],
  [7.8, -102.7], [10.8, -100.9], [14.1, -98.7], [18.5, -94.6], [22.7, -89.9], [26.1, -85.2], [28.6, -80.7], [30.3, -77.2],
]
/** The glass front between the blade's root and the stone block: the outline itself. */
const FRONT: XY[] = [[-1.9, 91.0], [-5.1, 87.2], [-8.3, 82.5], [-10.5, 78.9], [-12.4, 74.4], [-13.9, 69.9], [-15.0, 64.0], [-15.3, 58.8], [-14.9, 53.7]]
/** Along the tower's north-west face, west to east. */
const TOWER_SIDE: XY[] = [
  [33.3, -77.1], [32.4, -64.2], [28.7, -64.5], [27.3, -56.4], [26.1, -43.6], [25.9, -29.3], [26.2, -18.0], [27.1, -7.7],
  [27.6, -3.1], [28.0, 0.0], [45.0, -1.7], [45.3, -6.5],
]
const BLOCK: XY[] = [[-22.9, 9.5], [-44.1, 7.6], [-45.6, 23.8], [-49.9, 71.7], [-28.8, 73.7], [-27.2, 56.0], [-26.8, 52.4]] // way/1352128758, 21 m
const BALLROOM: XY[] = [[-21.1, -82.3], [24.2, -77.8], [18.1, -9.0], [-27.3, -13.2]] // way/1352128756, 25 m
const LINK: XY[] = [[27.6, -3.1], [17.7, -3.8], [18.1, -9.0], [24.2, -77.8], [30.3, -77.2], [26.1, -43.6], [27.1, -7.7]] // way/1352128757, 21 m (simplified)
const STEPS_W: XY[] = [[-36.2, -83.9], [-34.2, -102.5], [-20.9, -101.5], [-27.6, -96.3]] // way/1352128751, 13 m
const STEPS_E: XY[] = [[14.1, -98.7], [23.2, -97.7], [22.7, -89.9], [18.5, -94.6]] // way/1352128752, 13 m

// ---------------------------------------------------------------------------
// Paths: Chaikin-smoothed, resampled evenly, with an outward normal per sample
// (the paths run counter-clockwise round the building, so outward is to the
// right of travel).

type Sample = { p: XY; n: XY; s: number }
function path(pts: XY[], step = 2.6): Sample[] {
  let q = pts
  for (let it = 0; it < 2; it++) {
    const r: XY[] = [q[0]]
    for (let i = 0; i < q.length - 1; i++) {
      const a = q[i], b = q[i + 1]
      r.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]])
    }
    r.push(q.at(-1)!)
    q = r
  }
  const cum = [0]
  for (let i = 1; i < q.length; i++) cum.push(cum[i - 1] + Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]))
  const L = cum.at(-1)!, n = Math.max(2, Math.round(L / step))
  const at = (s: number): XY => {
    let i = 1
    while (i < q.length - 1 && cum[i] < s) i++
    const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
    return [q[i - 1][0] + (q[i][0] - q[i - 1][0]) * t, q[i - 1][1] + (q[i][1] - q[i - 1][1]) * t]
  }
  const ps = Array.from({ length: n + 1 }, (_, k) => at((k * L) / n))
  return ps.map((p, k) => {
    const a = ps[Math.max(0, k - 1)], b = ps[Math.min(n, k + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return { p, n: [dy / l, -dx / l] as XY, s: (k * L) / n }
  })
}


// ---------------------------------------------------------------------------
// Heights, from the lidar (see the header): the bowl's rim and the main roof
// both stand 21 m above the lowest ground; the west end's roof inside the rim
// is down at 13.6 m.

const RIM = 21
const ROOF = 20.6
const LOW_ROOF = 13.6
const LOW_Y = -86 // the low west-end roof lies beyond this line
const WALL = 4.5 // the stone base stands this far inside the bowl's outer edge
const roofAt = (p: XY) => (p[1] < LOW_Y ? LOW_ROOF : ROOF)
const off = (m: Sample, d: number): XY => [m.p[0] + m.n[0] * d, m.p[1] + m.n[1] * d]

/**
 * The steel bowl wall, swept along a path. Each section is a closed profile
 * in (d, z), d outward from the path: the foot on the stone base's wall line,
 * a belly bulging out, the top edge on the path itself at the rim, a flat top,
 * the inside face down to the roof, and a soffit back to the foot. The outer
 * face is shaded smooth, so the bowl reads as one curved, flaring surface.
 * Where the band leaves the building as the blade (`free`), the inside face
 * stops short and the section becomes a slim wing of its own depth.
 */
type Profile = { zb: number; zt: number; foot: number; free?: number }
type Section = { m: Sample; zb: number; zt: number; foot: number; pts: XY[] }
function sweepRibbon(S: Sample[], profile: (m: Sample) => Profile) {
  const sections: Section[] = S.map(m => {
    const { zb, zt, foot, free = 0 } = profile(m)
    // A broad flat top, so from above the band reads as a silver ring round
    // the roof; the free blade is slimmer.
    const LIP = 6 - free * 3.4
    const h = zt - zb, bev = Math.min(0.6, h * 0.12)
    const backD = -(LIP + 0.3) + free * 0.3 - free * 0.5
    const backZ = roofAt(off(m, -WALL)) - 0.05 + free * (zb + 0.9 - roofAt(off(m, -WALL)))
    // Counter-clockwise round the section: up the outer face, in across the
    // top, down the inside, out along the underside.
    const pts: XY[] = [
      [-foot, zb],
      [-foot * 0.32, zb + h * 0.42],
      [-bev * 0.4, zt - bev],
      [-bev, zt],
      [-LIP, zt],
      [backD, backZ],
      [Math.min(-foot, backD) - 0.2, Math.min(zb + 0.6, backZ)],
    ]
    return { m, zb, zt, foot, pts }
  })
  // Segment k of the profile runs pts[k] → pts[k+1]; the outer face (0–2)
  // is smooth, the rest flat. The underside (5, 6) is the dark soffit.
  const SMOOTH = new Set([0, 1, 2])
  const at = (c: Section, k: number): V3 => {
    const [d, z] = c.pts[k]
    return [c.m.p[0] + c.m.n[0] * d, c.m.p[1] + c.m.n[1] * d, z]
  }
  const segN = (c: Section, k: number): [number, number] => {
    const a = c.pts[k], b = c.pts[(k + 1) % c.pts.length]
    const dd = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dd, dz) || 1
    return [dz / l, -dd / l] // right of travel: outward on a CCW loop
  }
  const n3 = (c: Section, [nd, nz]: [number, number]): V3 => [c.m.n[0] * nd, c.m.n[1] * nd, nz]
  const vN = (c: Section, k: number, seg: number): V3 => {
    // At a vertex shared by two smooth segments, average them.
    const prev = (seg + c.pts.length - 1) % c.pts.length
    if (SMOOTH.has(seg) && SMOOTH.has(prev) && k === seg) {
      const a = segN(c, prev), b = segN(c, seg)
      return n3(c, [a[0] + b[0], a[1] + b[1]])
    }
    const next = (seg + 1) % c.pts.length
    if (SMOOTH.has(seg) && SMOOTH.has(next) && k === next) {
      const a = segN(c, seg), b = segN(c, next)
      return n3(c, [a[0] + b[0], a[1] + b[1]])
    }
    return n3(c, segN(c, seg))
  }
  const P = sections[0].pts.length
  for (let i = 0; i < sections.length - 1; i++) {
    const a = sections[i], b = sections[i + 1]
    for (let k = 0; k < P; k++) {
      const k1 = (k + 1) % P
      const part = k >= 5 ? soffit : ribbon
      quad(part, [at(a, k), at(b, k), at(b, k1), at(a, k1)], [vN(a, k, k), vN(b, k, k), vN(b, k1, k), vN(a, k1, k)])
    }
  }
  // Close the two ends with the profile.
  for (const [c, next] of [[sections[0], sections[1]], [sections.at(-1)!, sections.at(-2)!]] as const) {
    const t = unit3(sub3(at(c, 0), at(next, 0)))
    for (let k = 1; k < P - 1; k++) {
      const tri = [at(c, 0), at(c, k), at(c, k + 1)]
      const f = cross3(sub3(tri[1], tri[0]), sub3(tri[2], tri[0]))
      if (Math.hypot(...f) < 1e-8) continue
      const [x, y, z] = dot3(f, t) >= 0 ? tri : [tri[0], tri[2], tri[1]]
      ribbon.tri(x, y, z, undefined, undefined, undefined, [t, t, t])
    }
  }
  return sections
}

/** A point on a section's outer face at height z (on the foot–belly–top chain). */
function outer(c: Section, z: number, lift = 0.05): V3 {
  const chain = c.pts.slice(0, 3)
  let d = chain[2][0]
  for (let k = 0; k < 2; k++) {
    const [d0, z0] = chain[k], [d1, z1] = chain[k + 1]
    if (z >= z0 && z <= z1) { d = d0 + ((z - z0) / (z1 - z0)) * (d1 - d0); break }
  }
  return [c.m.p[0] + c.m.n[0] * (d + lift), c.m.p[1] + c.m.n[1] * (d + lift), z]
}

/**
 * The long dark slots cut along the bowl, as in the photos: flush dark bands
 * laid just proud of the steel. `z` is a slot's bottom as a fraction of the
 * band's height at each section, so it follows the band as it rises and falls.
 */
function slots(sec: Section[], runs: [number, number, number, number][]) {
  for (const [s0, s1, f, H] of runs) {
    const span = sec.filter(c => c.m.s >= s0 && c.m.s <= s1)
    for (let k = 0; k < span.length - 1; k++) {
      const a = span[k], b = span[k + 1]
      const za = a.zb + f * (a.zt - a.zb), zb = b.zb + f * (b.zt - b.zb)
      const na = unit3([a.m.n[0], a.m.n[1], 0.3]), nb = unit3([b.m.n[0], b.m.n[1], 0.3])
      quad(soffit, [outer(a, za), outer(b, zb), outer(b, zb + H), outer(a, za + H)], [na, nb, nb, na])
    }
  }
}

// East sweep: along the south-east side, round the rounded east end, where
// the band drops low over the Great Hall's glass and then rises and thins
// across the plaza front, and off the building as the blade.
const east = path([...EAST, ...BLADE])
const rootS = east.reduce((best, m) => (Math.hypot(m.p[0] - 1.0, m.p[1] - 94.1) < Math.hypot(best.p[0] - 1.0, best.p[1] - 94.1) ? m : best)).s
const roundS = east.find(m => m.p[1] > 55)!.s
const tipS = east.at(-1)!.s
const eastSec = sweepRibbon(east, m => {
  if (m.s <= roundS) return { zb: 10, zt: RIM, foot: 2 + 2.5 * smooth((m.s - roundS + 30) / 30) }
  if (m.s <= rootS) {
    const u = (m.s - roundS) / (rootS - roundS)
    // Lowest at the apex of the rounded end, as in the plaza photos.
    const zb = u < 0.6 ? 10 - 5.5 * smooth(u / 0.6) : 4.5 + 8 * smooth((u - 0.6) / 0.4)
    return { zb, zt: RIM - 1.5 * smooth((u - 0.6) / 0.4), foot: 4.5 - 1.5 * smooth((u - 0.65) / 0.35) }
  }
  // The blade: lidar puts its top at 18.3–18.8 m midway, 20 m at the tip.
  const t = (m.s - rootS) / (tipS - rootS)
  return { zb: 12.5 + t * 2.5, zt: 19.5 + t * 0.8 - 1.1 * Math.sin(Math.PI * t), foot: 3 - t * 0.8, free: smooth(t * 4) }
})
slots(eastSec, [[6, 60, 0.5, 1.1], [40, roundS + 30, 0.68, 1.1], [roundS + 20, rootS + 30, 0.3, 0.8]])

// West sweep: rises out of a point at the stone block, then the full bowl
// round the west end to the tower.
const west = path(WEST)
const westSec = sweepRibbon(west, m => {
  const t = smooth(m.s / 24)
  return { zb: 19 - t * 9, zt: 20.2 + t * (RIM - 20.2), foot: 0.6 + t * 1.4 }
})
slots(westSec, [[30, 90, 0.5, 1.1], [75, 150, 0.66, 1.1], [140, 200, 0.45, 1.1]])

// ---------------------------------------------------------------------------
// The stone base under the bowl: the outline with the bowl runs set back to
// the wall line. A plinth of stone with the Great Hall's glass above it on the
// east end and the plaza front; elsewhere solid limestone, with the big grey
// relief murals on the west end, under the bowl, between its corner blocks.
// The west end beyond LOW_Y is the low roof inside the bowl.

const eastWall = east.filter(m => m.s <= rootS + 1e-6).map(m => off(m, -WALL))
const westWall = west.map(m => off(m, -WALL))
const BODY: XY[] = ccw([...eastWall, ...FRONT, [-26.8, 52.4], [-22.9, 9.5], ...westWall, ...TOWER_SIDE])

/** The part of a polygon on one side of the line y = c (Sutherland–Hodgman). */
function clipY(poly: XY[], c: number, keepAbove: boolean): XY[] {
  const inside = (p: XY) => (keepAbove ? p[1] >= c : p[1] <= c)
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) {
      const t = (c - a[1]) / (b[1] - a[1])
      out.push([a[0] + (b[0] - a[0]) * t, c])
    }
  }
  return out
}

const frontSet = new Set(FRONT.map(p => p.join()))
const eastSet = new Set(eastWall.map(p => p.join()))
const westIdx = new Map(westWall.map((p, i) => [p.join(), i]))
const glassEdges: [XY, XY][] = []
const GLASS_TOP = (a: XY) => {
  // Glass runs up to the ribbon's underside above it.
  let best = eastSec[0], d = Infinity
  for (const c of eastSec) {
    const p = off(c.m, -WALL), dd = Math.hypot(p[0] - a[0], p[1] - a[1])
    if (dd < d) { d = dd; best = c }
  }
  return Math.min(ROOF - 1, best.zb + 0.4)
}
function walls(top: number) {
  return (a: XY, b: XY): Band[] => {
    const isFront = frontSet.has(a.join()) && frontSet.has(b.join())
    const isHall = eastSet.has(a.join()) && eastSet.has(b.join()) && a[1] > 52 && b[1] > 52
    if (isFront || isHall || (eastSet.has(a.join()) && frontSet.has(b.join()))) {
      glassEdges.push([a, b])
      const g = Math.min(top - 0.5, isFront ? 13 : Math.max(GLASS_TOP(a), GLASS_TOP(b)))
      return [{ p: stone, z0: 0, z1: 3 }, { p: glass, z0: 3, z1: g, recess: 0.5 }, { p: stone, z0: g, z1: top }]
    }
    const i = westIdx.get(a.join()), j = westIdx.get(b.join())
    // The murals: big flush grey panels under the bowl on the street side,
    // two edges of panel to one of pier.
    if (i !== undefined && j !== undefined && a[1] < -95 && b[1] < -95 && a[0] > -20 && b[0] < 13 && i % 3 !== 0)
      return [{ p: stone, z0: 0, z1: 4.6 }, { p: soffit, z0: 4.6, z1: 9, recess: 0.5 }, { p: stone, z0: 9, z1: top }]
    return [{ p: stone, z0: 0, z1: top }]
  }
}
prism(clipY(BODY, LOW_Y, true), 0, ROOF, walls(ROOF), roof, 0.4)
prism(clipY(BODY, LOW_Y, false), 0, LOW_ROOF, walls(LOW_ROOF), roof, 0.4)

// Slim pale vertical mullions on the glass, just proud of the recessed panes.
{
  let run = 0
  for (const [a, b] of glassEdges) {
    const nm = edgeNormal(a, b), N: V3 = [nm[0], nm[1], 0]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const top = frontSet.has(a.join()) ? 13 : Math.min(ROOF - 1, Math.max(GLASS_TOP(a), GLASS_TOP(b)))
    const t = 0.35 / Math.max(L, 0.35)
    if (run++ % 2 === 0 && L > 1) quad(trim, [[...a, 3], [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 3],
      [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, top], [...a, top]], [N, N, N, N])
  }
}

// The pale stone block on the plaza's north-west side, where the blade ends,
// with the big video screen on its plaza face. Lidar: 22.5 m.
prism(BLOCK, 0, 22.5, () => [{ p: stone, z0: 0, z1: 22.5 }], roof)
{
  const a: XY = [-49.9, 71.7], b: XY = [-28.8, 73.7], nm = edgeNormal(b, a)
  const at = (t: number, z: number): V3 => [a[0] + (b[0] - a[0]) * t + nm[0] * 0.04, a[1] + (b[1] - a[1]) * t + nm[1] * 0.04, z]
  const N: V3 = [nm[0], nm[1], 0]
  quad(glass, [at(0.2, 10), at(0.8, 10), at(0.8, 18.5), at(0.2, 18.5)], [N, N, N, N])
}
// The ballroom box rising out of the roof (lidar 26.5 m), the link beside the
// tower (lidar 23–25 m), and the stone entrance blocks at the west end's two
// corners (lidar 14 m).
prism(BALLROOM, ROOF - 0.5, 26.5, () => [{ p: trim, z0: 0, z1: 26.5 }], roof)
prism(LINK, ROOF - 0.5, 23.5, () => [{ p: stone, z0: 0, z1: 23.5 }], roof, 0.3)
prism(STEPS_W, 0, 14, () => [{ p: stone, z0: 0, z1: 14 }], roof)
prism(STEPS_E, 0, 14, () => [{ p: stone, z0: 0, z1: 14 }], roof)

// ---------------------------------------------------------------------------
// The shared palette (STYLE.md). The brushed-stainless bowl is the
// building's whole identity, so it is a bright silver with a darker
// underside, and the roofs (white membrane in the NAIP aerial, hidden behind
// the band from the street) are the library `roof` grey so the band stands
// out against them from above. The limestone base is `stone`, the ballroom
// `trim`, the glass a pale window variant; the slots and the grey relief
// murals share the underside's grey.
const parts = [
  { part: ribbon, material: finish('nascar-steel', 0xd9dee2, 0.45) },
  { part: soffit, material: finish('nascar-steel-underside', 0x8a9198, 0.6) },
  // The Great Hall's glass is pale and greenish-reflective in the photos.
  { part: glass, material: windowVariant(2, 0xa3bcc0) },
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('NASCAR Hall of Fame', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 55, osm: 'way/322278731', footprint: [104, 206], height: 26.5,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/nascar-hall-of-fame.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
