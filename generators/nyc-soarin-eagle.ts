/**
 * Soarin' Eagle (Zamperla Volare flying coaster), Luna Park, Coney Island:
 * procedural, CC0-1.0.
 * bun generators/nyc-soarin-eagle.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Coordinates below are
 * in the Cyclone's park frame (metres east and north of lon -73.9778, lat
 * 40.575); the model's origin is the area centroid of the OSM outline
 * way/952530239 (attraction=roller_coaster, Soarin' Eagle), on the ground.
 * Luna Park is level here, so elevation 0.
 *
 * The ride. RCDB 9515: a Zamperla Volare, 391 m of track, 50 ft (15 m)
 * high, 41 km/h, two heartline rolls, a spiral lift, 48 x 25 m; at Elitch
 * Gardens before Luna Park. The 2019 photos show it by Luna Park's Surf
 * Avenue gate; OSM (2021, revised 2023) and the USGS NAIP orthophoto put it
 * in the 27 x 48 m lot south of the Bowery by the Steeplechase, its long side
 * north-south, and the July 2024 photos show it there, with the Wonder Wheel
 * behind. It is a dense frame of tall blue tubular columns and cross beams,
 * grey service decks with stairs, a tall square lift tower whose track climbs
 * in a helix to the "SOARIN' EAGLE" boards on top, and a red-orange track
 * that winds back and forth through the frame in level runs and tight turns,
 * the train hanging under it.
 *
 * Evidence and what rests on it:
 *   footprint 27 x 48 m, long side north-south: OSM way/952530239 (published
 *     48 x 25 m, RCDB), NAIP (the red runs north-south, the light-blue
 *     station roof along the east side, the tower's top at the north end);
 *   height 15 m track, lift tower ~17 m, its boards to ~19.5 m: published
 *     height, the tower and decks estimated from the photos against it;
 *   the frame, the decks at ~10 m, the tower and its boards, the colours:
 *     photos;
 *   the track's plan: NOT in OSM, and no photo shows it whole. It is drawn
 *     as the photos show its kind (a helix up the tower, then runs the
 *     length of the frame at falling levels, turned round at each end, with
 *     the two heartline rolls on two of the runs), sized to the footprint and
 *     to about the published length (drawn 380 m). Treat the run-by-run
 *     layout as invented.
 * Lidar (USGS NY_NewYorkCity, 2017) predates the ride's move here and isn't
 * used.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "Coney Island Brooklyn July 2024 012", "018", "019", Kidfly182, CC BY 4.0
 *   "Coney Island Brooklyn Jul 2019 55", "59", "60", "62", "63", "64" and
 *     "Sep 2019 03"-"06", Epicgenius, CC BY-SA 4.0 (at the old site)
 *   "Soarin' Eagle 1", Eden, Janine and Jim, CC BY 2.0
 *   "Soaring Eagle Scream Zone Luna Park Coney Island" and "Lift Soaring
 *     Eagle ...", Eliedion, CC BY-SA 3.0 (2011, the ride seen from above)
 * Look-only: none.
 *
 * Style: the track is one broad red-orange ribbon (box section, drawn wider
 * than the real one) hung under the frame; the frame is chunky blue columns
 * and beams, not lattice; decks and the station roof are plain slabs; the
 * tower's boards are plain navy boards (not a landmark sign, so no
 * lettering).
 *
 * Doubts: the track layout (above); whether the station is on the east side
 * (NAIP's light-blue roof suggests so); the exact column grid.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const LAT0 = 40.575, LON0 = -73.9778
const MX = 111320 * Math.cos((LAT0 * Math.PI) / 180), MY = 110574
// Area centroid of way/952530239 in the park frame.
const OUTLINE: [number, number][] = [[-225.1, -111.7], [-243.1, -112.6], [-249.1, -112.9], [-245.6, -151.2], [-234.9, -150.9], [-234.4, -159.6], [-222.6, -158.9]]
const ANCHOR = (() => {
  let A = 0, cx = 0, cy = 0
  for (let i = 0; i < OUTLINE.length; i++) {
    const [x0, y0] = OUTLINE[i], [x1, y1] = OUTLINE[(i + 1) % OUTLINE.length], c = x0 * y1 - x1 * y0
    A += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
  }
  return [cx / (3 * A), cy / (3 * A)] as [number, number]
})()
const M = (x: number, y: number, z: number): V3 => [x - ANCHOR[0], y - ANCHOR[1], z]

const track = new Part(), frame = new Part(), deck = new Part(), stationRoof = new Part(), board = new Part()

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

// ------------------------------------------------------------- the track ---
// Control points in ride order, park frame [x, y, z of the running rail].
const P: [number, number, number][] = []
const pt = (x: number, y: number, z: number) => P.push([x, y, z])
/**
 * A run along x from y0 to y1, falling z0 → z1 with the gentle hills the
 * photos show on every run (amplitude `wave`, about 12 m apart), a point
 * every ~3 m (ends excluded).
 */
const run = (x: number, y0: number, y1: number, z0: number, z1: number, wave = 1.8) => {
  const k = Math.max(2, Math.round(Math.abs(y1 - y0) / 3)), L = Math.abs(y1 - y0)
  const hills = Math.max(1, Math.round(L / 12))
  for (let i = 1; i < k; i++) {
    const u = i / k
    pt(x, y0 + (y1 - y0) * u, z0 + (z1 - z0) * u + wave * Math.sin(Math.PI * hills * u) ** 2)
  }
}
/** A turn about (cx, cy), radius r, from angle a0 to a1 (degrees, anticlockwise positive), z0 → z1. */
const turn = (cx: number, cy: number, r: number, a0: number, a1: number, z0: number, z1: number) => {
  const k = Math.max(2, Math.round(Math.abs(a1 - a0) / 30))
  for (let i = 0; i <= k; i++) {
    const a = ((a0 + ((a1 - a0) * i) / k) * Math.PI) / 180
    pt(cx + r * Math.cos(a), cy + r * Math.sin(a), z0 + ((z1 - z0) * i) / k)
  }
}
// Run lines across the width, west to east, 4.5 m apart; the station on the east edge.
const XW = -246.2, X2 = -241.7, X3 = -237.2, X4 = -232.7, X5 = -228.4, XST = -224.6
const NORTH = -129.5, SOUTH = -148.5
// The station, heading north, the train hanging under the rail.
pt(XST, -155, 4.2); pt(XST, -146, 4.2); pt(XST, -137, 4.2); pt(XST, -128, 4.3)
// Up to the north edge and west to the lift.
turn(XST - 4.5, -124.5, 4.5, 0, 90, 4.4, 4.8)
// Spiral lift: three and a quarter turns anticlockwise round the tower,
// ending on its north side heading west.
const HC: [number, number] = [-239.0, -118.0], HR = 5.0
{
  pt(-231.5, -120.0, 5.0)
  const a0 = Math.atan2(-120 - HC[1], -231.5 - HC[0]) + 0.35, N = 28, TURNS = 3.25
  for (let k = 1; k <= N; k++) {
    const a = a0 + (k / N) * TURNS * 2 * Math.PI
    pt(HC[0] + HR * Math.cos(a), HC[1] + HR * Math.sin(a), 5.2 + (10.3 * k) / N)
  }
}
// Along the north edge to the west side, then down it at the top level.
pt(-243.6, -112.4, 15.4)
pt(XW, -116.5, 15.1)
pt(XW, -121.5, 14.9)
run(XW, -121.5, SOUTH, 14.9, 13.6)
turn((XW + X2) / 2, SOUTH, (X2 - XW) / 2, 180, 360, 13.4, 12.8)
// North up the second line: the first heartline roll.
const ROLL1 = [P.length - 1, 0]
run(X2, SOUTH, NORTH, 12.6, 11.4)
ROLL1[1] = P.length
turn((X2 + X3) / 2, NORTH, (X3 - X2) / 2, 180, 0, 11.2, 10.6)
run(X3, NORTH, SOUTH - 1, 10.0, 8.4)
turn((X3 + X4) / 2, SOUTH - 1, (X4 - X3) / 2, 180, 360, 8.0, 6.8)
// North up the fourth line: the second heartline roll.
const ROLL2 = [P.length - 1, 0]
run(X4, SOUTH - 1, NORTH, 6.5, 5.6)
ROLL2[1] = P.length
turn((X4 + X5) / 2, NORTH, (X5 - X4) / 2, 180, 0, 5.4, 4.9)
run(X5, NORTH, -153.5, 4.7, 4.4, 0.8)
// Round into the station.
turn((X5 + XST) / 2, -155.5, (XST - X5) / 2, 180, 360, 4.3, 4.2)

// Dense centripetal Catmull–Rom through the points, closed, every ~0.6 m.
type S = { p: V3; roll: number }
const dense: S[] = []
const n = P.length
for (let i = 0; i < n; i++) {
  const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n]
  const d = (a: number[], b: number[]) => Math.max(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) ** 0.5, 1e-3)
  const t0 = 0, t1 = d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3)
  const K = Math.max(3, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]) / 0.6))
  // Heartline rolls: a full turn of the section about the rail between two points.
  const rollSpan = [ROLL1, ROLL2].find(([a, b]) => i >= a && i < b)
  for (let k = 0; k < K; k++) {
    const t = t1 + ((t2 - t1) * k) / K
    const L = (a: number[], b: number[], ta: number, tb: number) => [0, 1, 2].map((c) => ((tb - t) * a[c] + (t - ta) * b[c]) / (tb - ta))
    const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3)
    const C = L(L(A1, A2, t0, t2), L(A2, A3, t1, t3), t1, t2) as V3
    let roll = 0
    if (rollSpan) {
      const u = (i - rollSpan[0] + k / K) / (rollSpan[1] - rollSpan[0])
      roll = 2 * Math.PI * (u - Math.sin(2 * Math.PI * u) / (2 * Math.PI))
    }
    dense.push({ p: M(...C), roll })
  }
}
// Swept box section: a broad rail deck (W wide) with the box spine above it,
// since the train hangs underneath.
const W = 1.5, DECK = 0.2, SPINE_W = 0.8, SPINE_H = 0.9
const section = (q: S, t: V3) => {
  const up0 = unit(sub([0, 0, 1], mul(t, t[2]))), left0 = cross(up0, t)
  const c = Math.cos(q.roll), s = Math.sin(q.roll)
  const up = unit(add(mul(up0, c), mul(left0, s))), left = cross(up, t)
  const at = (l: number, u: number) => add(q.p, add(mul(left, l), mul(up, u)))
  return {
    ring: [at(W / 2, 0), at(-W / 2, 0), at(-SPINE_W / 2, DECK + SPINE_H), at(SPINE_W / 2, DECK + SPINE_H)],
    up, left,
  }
}
let len3 = 0
{
  const D = dense.length
  const tanD = (i: number) => unit(sub(dense[(i + 1) % D].p, dense[(i - 1 + D) % D].p))
  for (let i = 0; i < D; i++) len3 += Math.hypot(...sub(dense[(i + 1) % D].p, dense[i].p))
  // Keep a section wherever the track has turned 11° or rolled 20°, and at
  // least every 4 m.
  const keep: number[] = [0]
  for (let i = 1; i < D; i++) {
    const j = keep[keep.length - 1]
    if (Math.hypot(...sub(dense[i].p, dense[j].p)) >= 4 || dot(tanD(i), tanD(j)) < Math.cos((11 * Math.PI) / 180) || Math.abs(dense[i].roll - dense[j].roll) > 0.35) keep.push(i)
  }
  const N = keep.length
  const secs = keep.map((i) => section(dense[i], tanD(i)))
  for (let ii = 0; ii < N; ii++) {
    const i = keep[ii]
    const a = secs[ii].ring, b = secs[(ii + 1) % N].ring
    for (let k = 0; k < a.length; k++) {
      const k2 = (k + 1) % a.length
      // Outward normal from the section's centre.
      // The ring runs clockwise in (left, up), so its outward side is t × edge.
      const want = cross(tanD(i), sub(a[k2], a[k]))
      const f = cross(sub(b[k], a[k]), sub(a[k2], a[k]))
      if (dot(f, want) >= 0) { track.tri(a[k], b[k], a[k2]); track.tri(a[k2], b[k], b[k2]) }
      else { track.tri(a[k], a[k2], b[k]); track.tri(a[k2], b[k2], b[k]) }
    }
  }
}

// ------------------------------------------------------------- the frame ---
function tube(p: Part, a: V3, b: V3, r: number, sides = 6) {
  const ax = unit(sub(b, a)), ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u = unit(cross(ax, ref)), v = cross(ax, u)
  for (let k = 0; k < sides; k++) {
    const t0 = (k / sides) * 2 * Math.PI, t1 = ((k + 1) / sides) * 2 * Math.PI
    const d0 = add(mul(u, Math.cos(t0)), mul(v, Math.sin(t0))), d1 = add(mul(u, Math.cos(t1)), mul(v, Math.sin(t1)))
    const a0 = add(a, mul(d0, r)), a1 = add(a, mul(d1, r)), b0 = add(b, mul(d0, r)), b1 = add(b, mul(d1, r))
    p.tri(a0, a1, b1, undefined, undefined, undefined, [d0, d1, d1]); p.tri(a0, b1, b0, undefined, undefined, undefined, [d0, d1, d0])
  }
}
function slab(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const c = [M(x0, y0, 0), M(x1, y1, 0)]
  const X0 = c[0][0], Y0 = c[0][1], X1 = c[1][0], Y1 = c[1][1]
  const q = (a: V3, b: V3, cc: V3, d: V3) => { p.tri(a, b, cc); p.tri(a, cc, d) }
  q([X0, Y0, z1], [X1, Y0, z1], [X1, Y1, z1], [X0, Y1, z1])
  q([X0, Y0, z0], [X0, Y1, z0], [X1, Y1, z0], [X1, Y0, z0])
  q([X0, Y0, z0], [X1, Y0, z0], [X1, Y0, z1], [X0, Y0, z1])
  q([X1, Y0, z0], [X1, Y1, z0], [X1, Y1, z1], [X1, Y0, z1])
  q([X1, Y1, z0], [X0, Y1, z0], [X0, Y1, z1], [X1, Y1, z1])
  q([X0, Y1, z0], [X0, Y0, z0], [X0, Y0, z1], [X0, Y1, z1])
}
// Column lines across the width and along the length, clear of the runs
// (between them), each column standing to just above the highest track
// within 4 m of it, as the real columns carry the track on arms.
const XS = [-248.4, -244.6, -240.8, -236.3, -231.5, -226.8, -223.2], YS = [-156, -147, -138, -129, -120.5, -113]
const inside = (x: number, y: number) => !(x < -235 && y < -151.5)
const topAt = (x: number, y: number) => {
  let top = 0
  for (const q of dense) {
    const [qx, qy] = [q.p[0] + ANCHOR[0], q.p[1] + ANCHOR[1]]
    if (Math.hypot(qx - x, qy - y) < 4.2) top = Math.max(top, q.p[2])
  }
  return top
}
const cols = new Map<string, number>()
for (const x of XS) for (const y of YS) {
  if (!inside(x, y)) continue
  const t = topAt(x, y)
  if (t < 3) continue
  cols.set(`${x},${y}`, t + 1.6)
}
const R = 0.32
for (const [k, top] of cols) {
  const [x, y] = k.split(',').map(Number)
  tube(frame, M(x, y, 0), M(x, y, top), R)
}
// Beams between neighbouring columns at the lower of their tops, and a tie
// at 5 m: the frame the photos show as portals.
for (let i = 0; i < XS.length; i++) for (let j = 0; j < YS.length; j++) {
  const a = cols.get(`${XS[i]},${YS[j]}`)
  if (a === undefined) continue
  for (const [di, dj] of [[1, 0], [0, 1]]) {
    const b = cols.get(`${XS[i + di]},${YS[j + dj]}`)
    if (b === undefined) continue
    const z = Math.min(a, b) - 0.3
    tube(frame, M(XS[i], YS[j], z), M(XS[i + di], YS[j + dj], z), 0.22, 4)
    if (Math.min(a, b) > 8) tube(frame, M(XS[i], YS[j], 5), M(XS[i + di], YS[j + dj], 5), 0.18, 4)
  }
}
// The lift tower: four columns round the helix to 17 m, bands every 4 m,
// the top deck, and the two SOARIN' EAGLE boards leaning out from its top.
{
  const h = HR + 1.4, TOP = 17
  const c: [number, number][] = [[HC[0] - h, HC[1] - h], [HC[0] + h, HC[1] - h], [HC[0] + h, HC[1] + h], [HC[0] - h, HC[1] + h]]
  for (const [x, y] of c) tube(frame, M(x, y, 0), M(x, y, TOP), 0.42)
  for (let z = 4; z <= TOP; z += 4.3) for (let k = 0; k < 4; k++) {
    const [x0, y0] = c[k], [x1, y1] = c[(k + 1) % 4]
    tube(frame, M(x0, y0, z), M(x1, y1, z), 0.25, 4)
  }
  slab(deck, HC[0] - h, HC[1] - h, HC[0] + h, HC[1] + 1, TOP - 0.4, TOP)
  // Boards: navy, facing east and south, each 7 m x 1.6 m, tilted up.
  const bz = TOP + 1.3
  slab(board, HC[0] + h - 0.3, HC[1] - h + 0.4, HC[0] + h + 0.1, HC[1] + h - 0.4, bz - 0.8, bz + 0.8)
  slab(board, HC[0] - h + 0.4, HC[1] - h - 0.1, HC[0] + h - 0.4, HC[1] - h + 0.3, bz - 0.8, bz + 0.8)
}
// Service decks at ~10.5 m over the west half, as in the photos.
slab(deck, -248.8, -142, -241.6, -134, 9.4, 9.8)
slab(deck, -241.2, -125.2, -232.8, -122.6, 13.2, 13.6)
// The station canopy along the east side.
slab(stationRoof, -231.4, -157.6, -225.6, -130.5, 6.6, 7.0)
for (const [x, y] of [[-231, -157], [-226, -157], [-231, -131], [-226, -131], [-231, -144], [-226, -144]] as [number, number][]) tube(frame, M(x, y, 0), M(x, y, 6.6), 0.18, 4)

// ---------------------------------------------------------------- output ---
const parts = [
  { part: track, material: finish('soarin-red', 0xd2593c) },
  { part: frame, material: finish('soarin-blue', 0x4a66b0) },
  { part: deck, material: PALETTE.roof },
  { part: stationRoof, material: finish('soarin-station-roof', 0x7ea3cc) },
  { part: board, material: finish('neon-soarin-sign', 0x34407a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb("Soarin' Eagle", parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 19.4, trackLength: 391, osm: 'way/952530239',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-soarin-eagle.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes; track ${len3.toFixed(0)} m drawn (published 391), ${cols.size} columns`)
console.log(parts.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
console.log(`anchor ${(LON0 + ANCHOR[0] / MX).toFixed(7)}, ${(LAT0 + ANCHOR[1] / MY).toFixed(7)}`)
// Clearance: stretches of track closer than 3.2 m apart, away from each other along it.
{
  const N = dense.length
  let worst = Infinity, at = ''
  for (let i = 0; i < N; i += 2) for (let j = i + 40; j < N; j += 2) {
    if (N - j + i < 40) continue
    const d = Math.hypot(...sub(dense[i].p, dense[j].p))
    if (d < worst) { worst = d; at = `${i}/${j} at (${(dense[i].p[0] + ANCHOR[0]).toFixed(0)}, ${(dense[i].p[1] + ANCHOR[1]).toFixed(0)}, ${dense[i].p[2].toFixed(1)} vs ${dense[j].p[2].toFixed(1)})` }
  }
  console.log(`closest approach between stretches ${worst.toFixed(1)} m, ${at}`)
}
