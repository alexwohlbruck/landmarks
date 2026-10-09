/**
 * Prison Ship Martyrs' Monument, Fort Greene Park, Brooklyn (McKim, Mead &
 * White / Stanford White, 1908; brazier by Adolph Weinman) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-prison-ship-martyrs.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 315°: the column's plinths and abacus are square to the NW–SE
 * axis of the park, and the great stair falls away to the north-west (model
 * +y), toward Myrtle Avenue. Model −x (true south-west) is the face with the
 * bronze door. Anchor: the centroid of OSM way/296157576 (the monument,
 * building=yes), which with its parts way/296157582 (shaft) and
 * way/296157583 (urn) this model replaces.
 *
 * y = 0 is the foot of the stair, the lowest ground under the model. The
 * hilltop plaza round the column is 4.7 m higher (lidar), so the column's
 * plinths start at z = 4.7; the plaza itself is the map's paving and is not
 * drawn, only the stair that climbs to it. Elevation 0.
 *
 * Evidence
 * - Published (Wikipedia; NYC Parks): a granite Doric column 149 ft (45 m)
 *   over the crypt, at the top of a 100 ft (30 m) wide, 33-step staircase;
 *   an eight-ton bronze brazier (funeral urn) by Weinman on top.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 0.5 m, /tmp/city/nyc/lidar.py,
 *   read in the model frame. Plaza 31.1 m NAVD88; lower plinth +0.5 m out to
 *   ±8.2 m, upper plinth +1.0 m to ±4.75 m; the abacus top 35.7 m above the
 *   plaza, a 7.0 m square; the brazier to 44.0 m at the centre, its rim
 *   ~42.4 m at r ≈ 1.8 m. The stair: plaza edge 34 m from the column, falling
 *   4.7 m over ~12 m to a landing (the terraced lawn below it is the map's).
 * - OSM: shaft part a 4.4 m circle; urn part a ~2.4 m circle (46–50 m tags,
 *   not used: the lidar is preferred).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-prison-ship-martyrs/photos/credits.txt: Beyond My
 *   Ken (CC BY-SA 4.0, the whole column from the south-west; the top from
 *   the east), Tessa Bury (CC BY 4.0, aerial: plinths, abacus, brazier
 *   pedestal), aismallard (CC BY-SA 3.0, the great stair from below with
 *   the column behind and the granite balls on the stair's end pedestals),
 *   Jazz Guy (CC BY 2.0, the stair from the landing).
 *
 * Estimated from the photos against the lidar: shaft diameter 5.5 m at the
 * foot and 4.85 m under the capital (the south-west and stair photos,
 * scaled to the 7.0 m abacus and corrected for distance; OSM's 4.4 m
 * circle reads a little small); 20 flutes drawn as
 * flat facets; the echinus and annulets (1.6 m), the abacus 1.1 m thick; the
 * brazier's stepped pedestal, four splayed legs with X braces, its bowl,
 * rim band and domed lid. The stair's cheek walls and their end pedestals
 * and balls are from the stair photo; the crypt entrance (in the lower
 * terraces) is left out, as are the railing round the abacus, the Greek-key
 * band, the four eagles on the plaza and the plaque.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'
import { TAU, smooth, solid, lathe, ellipsoid, block } from './nyc-columbus-monument'

const granite = new Part(), steps = new Part(), bronze = new Part(), door = new Part()

// --- The great stair: 33 risers from the foot (y = 46.2) up to the plaza
// edge (y = 34), 30 m wide, between granite cheek walls. ---
const PZ = 4.7
{
  const n = 33, yTop = 34.0, yBot = 46.2, X = 15
  const run = (yBot - yTop) / n, rise = PZ / n
  for (let k = 0; k < n; k++) {
    // Step k counted from the top: its tread at z = PZ − k·rise, from y0 to y1.
    const z = PZ - k * rise, y0 = yTop + k * run, y1 = y0 + run
    steps.quad([-X, y0, z], [X, y0, z], [X, y1, z], [-X, y1, z]) // tread
    steps.quad([X, y1, z - rise], [-X, y1, z - rise], [-X, y1, z], [X, y1, z]) // riser, facing +y
    for (const s of [-1, 1]) {
      // the stair's end face under this tread (hidden behind the cheek wall, but closes the solid)
      const a: V3 = [s * X, y0, 0], b: V3 = [s * X, y1, 0], c: V3 = [s * X, y1, z], d: V3 = [s * X, y0, z]
      if (s > 0) steps.quad(a, b, c, d); else steps.quad(b, a, d, c)
    }
  }
  // Cheek walls: a sloping granite parapet 1.1 m wide each side, its coping
  // 0.6 m above the nosings, squared off at the foot.
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? X : -X - 1.1, x1 = s > 0 ? X + 1.1 : -X
    const top = (y: number) => PZ + 0.6 - (PZ * (y - yTop)) / (yBot - yTop)
    const yEnd = yBot + 0.6
    // profile in the y–z plane, extruded across x0..x1
    const prof: [number, number][] = [[yTop - 1.6, 0], [yEnd, 0], [yEnd, 1.0], [yBot - 1.0, top(yBot - 1.0)], [yTop, top(yTop)], [yTop - 1.6, top(yTop)]]
    const ring = (x: number) => prof.map(([y, z]): V3 => [x, y, z])
    const A = ring(x0), B = ring(x1)
    for (let i = 0; i < prof.length; i++) {
      const j = (i + 1) % prof.length
      granite.quad(A[i], A[j], B[j], B[i])
    }
    // the two end caps (the profile is convex)
    for (let i = 1; i < prof.length - 1; i++) { granite.tri(B[0], B[i], B[i + 1]); granite.tri(A[0], A[i + 1], A[i]) }
    // The pedestal at the head of the wall and its granite ball.
    const cx = (x0 + x1) / 2, cy = yTop - 0.9
    block(granite, cx - 0.9, cy - 0.9, cx + 0.9, cy + 0.9, PZ - 0.5, PZ + 1.25, 0.08, 0.1)
    block(granite, cx - 1.0, cy - 1.0, cx + 1.0, cy + 1.0, PZ + 1.25, PZ + 1.45, 0.08, 0.08)
    smooth(granite, q => ellipsoid(q, [cx, cy, PZ + 2.05], [0.62, 0.62, 0.62], 12, 6), 70)
  }
}

// --- The column: two square plinths, the fluted shaft, the Doric capital,
// a square abacus (the viewing platform). ---
prism({ wall: steps, win: null, roof: steps, ring: chamferRect(-8.2, -8.2, 8.2, 8.2, 0), z0: 0, z1: PZ + 0.5, facade: null, bevel: 0.12 })
prism({ wall: granite, win: null, roof: granite, ring: chamferRect(-4.75, -4.75, 4.75, 4.75, 0), z0: PZ + 0.5, z1: PZ + 1.0, facade: null, bevel: 0.12 })
const S0 = PZ + 1.0, S1 = PZ + 33.0
{
  // Twenty flutes as flat facets, a faint entasis.
  const n = 20, r = (t: number) => 2.75 + (2.42 - 2.75) * t + 0.06 * Math.sin(Math.PI * t)
  const rings = [0, 0.25, 0.5, 0.75, 1].map(t => Array.from({ length: n }, (_, i): V3 => {
    const a = (i + 0.5) * TAU / n
    return [r(t) * Math.cos(a), r(t) * Math.sin(a), S0 + (S1 - S0) * t]
  }))
  granite.loft(rings)
}
// Annulets, echinus flaring to the abacus.
smooth(granite, q => lathe(q, [[2.48, S1], [2.48, S1 + 0.3], [2.53, S1 + 0.32], [2.7, S1 + 0.65], [2.98, S1 + 1.05], [3.2, S1 + 1.45], [3.22, S1 + 1.6]], 20), 40)
const AB0 = S1 + 1.6, AB1 = PZ + 35.7
block(granite, -3.5, -3.5, 3.5, 3.5, AB0, AB1, 0.06, 0.14)
// The bronze door at the shaft's foot on the south-west face (model −x).
{
  const x = -(2.75 * Math.cos(Math.PI / 20) + 0.04), w = 0.75
  door.quad([x, w, S0], [x, -w, S0], [x, -w, S0 + 2.7], [x, w, S0 + 2.7])
}

// --- The brazier: a stepped pedestal, four splayed legs braced with X's,
// the bowl with its rim band, a domed lid and finial. Weinman's bronze. ---
block(granite, -1.75, -1.75, 1.75, 1.75, AB1, AB1 + 1.2, 0.35, 0.1)
block(granite, -1.45, -1.45, 1.45, 1.45, AB1 + 1.2, AB1 + 1.6, 0.3, 0.08)
{
  const zL = AB1 + 1.6, zT = PZ + 41.9
  const at = (sx: number, sy: number, t: number): V3 => {
    const h = 1.12 + 0.3 * t
    return [sx * h, sy * h, zL + (zT - zL) * t]
  }
  // Legs: square posts, 0.42 m, leaning out.
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const sq = (t: number, w: number) => {
      const c = at(sx, sy, t)
      return chamferRect(c[0] - w, c[1] - w, c[0] + w, c[1] + w, 0.05).map(([x, y]): V3 => [x, y, c[2]])
    }
    solid(bronze, [sq(0, 0.24), sq(1, 0.26)])
    // The palmette crest on the leg's top, a bold leaf.
    smooth(bronze, q => ellipsoid(q, [at(sx, sy, 1)[0], at(sx, sy, 1)[1], zT + 0.35], [0.26, 0.26, 0.5], 8, 4), 60)
  }
  // X braces on each face, flat bars from leg foot to leg head.
  const bar = (a: V3, b: V3, out: V3) => {
    const w = 0.11, d = 0.07
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(u[0], u[1], u[2])
    const ux = u[0] / L, uy = u[1] / L, uz = u[2] / L
    // side vector: cross(out, u)
    const sx = out[1] * uz - out[2] * uy, sy = out[2] * ux - out[0] * uz, sz = out[0] * uy - out[1] * ux
    const sl = Math.hypot(sx, sy, sz), S: V3 = [sx / sl * w, sy / sl * w, sz / sl * w]
    const ring = (p: V3): V3[] => [
      [p[0] - S[0] - out[0] * d, p[1] - S[1] - out[1] * d, p[2] - S[2]],
      [p[0] + S[0] - out[0] * d, p[1] + S[1] - out[1] * d, p[2] + S[2]],
      [p[0] + S[0] + out[0] * d, p[1] + S[1] + out[1] * d, p[2] + S[2]],
      [p[0] - S[0] + out[0] * d, p[1] - S[1] + out[1] * d, p[2] - S[2]],
    ]
    bronze.sweep([ring(a), ring(b)])
  }
  const faces: [[number, number], [number, number], V3][] = [
    [[1, -1], [1, 1], [1, 0, 0]], [[-1, -1], [-1, 1], [-1, 0, 0]], [[-1, 1], [1, 1], [0, 1, 0]], [[-1, -1], [1, -1], [0, -1, 0]],
  ]
  for (const [p, q, out] of faces) {
    const inset = (v: V3): V3 => [v[0] + out[0] * 0.02, v[1] + out[1] * 0.02, v[2]]
    bar(inset(at(p[0], p[1], 0.03)), inset(at(q[0], q[1], 0.9)), out)
    bar(inset(at(q[0], q[1], 0.03)), inset(at(p[0], p[1], 0.9)), out)
  }
  // The bowl inside the legs, its rim band, the lid.
  // A broad, nearly cylindrical bowl rounding in to a narrow foot halfway
  // down the legs (lidar: rim ~r 1.8 m; the east photo).
  const zB = zL + 1.5
  smooth(bronze, q => lathe(q, [[0.5, zB], [0.95, zB + 0.25], [1.4, zB + 0.9], [1.68, zB + 1.7], [1.78, zT - 0.35], [2.05, zT - 0.3], [2.05, zT + 0.3], [1.9, zT + 0.35]], 16, 0, 0, false), 50)
  // The lid: a low dome with a raised band and a short finial.
  smooth(bronze, q => lathe(q, [[1.9, zT + 0.35], [1.9, zT + 0.8], [1.98, zT + 0.85], [1.75, zT + 1.05], [1.2, zT + 1.3], [0.5, zT + 1.45], [0.3, zT + 1.5], [0.32, zT + 1.68], [0.02, zT + 1.85]], 16), 60)
  bronze.cap(Array.from({ length: 16 }, (_, i): V3 => [0.45 * Math.cos(i * TAU / 16), 0.45 * Math.sin(i * TAU / 16), zB]), false)
}

finishModel("Prison Ship Martyrs' Monument", 'nyc-prison-ship-martyrs', [
  { part: granite, material: { name: 'granite', color: 0xe3e1da, roughness: 0.85 } },
  { part: steps, material: { name: 'granite-steps', color: 0xd6d3cb, roughness: 0.85 } },
  { part: bronze, material: { name: 'bronze-patina', color: 0x6fa595, roughness: 0.7 } },
  { part: door, material: { name: 'bronze', color: 0x55756b, roughness: 0.75 } },
], { bearing: 315, osm: 'way/296157576', height: PZ + 43.75 }, 5000)
