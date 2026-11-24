/**
 * Luna Park entrance gate, Surf Avenue, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-luna-park-gate.ts
 *
 * Map frame: x east, y north, z up, metres; built facing north (onto Surf
 * Avenue) and placed at bearing 5, the line of the park's Surf Avenue
 * frontage. The origin is where OSM's entrance footway (way/1210681894,
 * from the Surf Avenue sidewalk south into the park) crosses that frontage
 * line, between Jones Walk Games (way/248495783, 1000 Surf Avenue) and the
 * Cyclone Cafe (way/248496521), on the ground. Level street: elevation 0.
 *
 * The gate: Wikipedia ("Luna Park (Coney Island, 2010)") says the entrance
 * "is patterned after the entrance to the original 1903 Luna Park". A pair
 * of tall red-brown obelisks and a pair of shorter square pylons topped
 * with gold balls frame black iron gates; across the top, a gold scroll
 * band carries a row of red pinwheel sunbursts with navy hubs, each
 * cradled in a gold crescent moon, all studded with bulbs.
 *
 * Evidence and what rests on it:
 *   the location: OSM (the footway above, the frontage line of way/230060362)
 *     and the USGS NAIP orthophoto, which shows a red and gold structure
 *     across that gap on the Surf Avenue line;
 *   the layout (obelisks outside, ball pylons inside, five pinwheels with
 *     the largest in the middle, gates below a gold arch): "LunaParkConeyIsland"
 *     (front, from Surf Avenue), "Entrance to Luna Park Coney Island" and
 *     Loozrboy's "Luna Park" (close-ups of the pinwheels, crescents and ball
 *     finial);
 *   sizes: estimated by scaling those photos against the 2.8 m gates; the
 *     overall width (17 m) also fits the 27 m gap between the buildings.
 *     Every dimension here is an estimate (±20%);
 *   colours: the photos.
 * Lidar (USGS NY_NewYorkCity, 2017) is older than nothing here (the gate
 * dates from 2010) but its returns on thin ornament are too sparse to read;
 * not used.
 *
 * Photos (EVIDENCE):
 *   "LunaParkConeyIsland.JPG", BuickCenturyDriver (English Wikipedia), CC0
 *     (2011)
 *   "Entrance to Luna Park Coney Island.JPG", Eliedion, CC BY-SA 3.0 (2010)
 *   "Luna Park" (Flickr 6920230386), Loozrboy, CC BY-SA 2.0 (2012)
 * Look-only: none used. The park's newer Bowery-side gate ("Coney Island
 * Brooklyn Jul 2019 77", "78", Epicgenius) has the same pinwheels on a navy
 * portal; it is a different gate and is not modelled.
 *
 * Style: pinwheel blades are bold wedges and the crescents broad bands; no
 * bulbs, lettering or scroll filigree. The pinwheels and gold scrollwork
 * are lit with bulbs, so they glow at night in their own colours (neon*).
 * The iron gates are solid charcoal leaves, since bars would shimmer.
 *
 * Doubts: all sizes (from photos, no published dimensions); the newest open
 * photos of this gate are from 2012, so later repaints or changes would not
 * show; the back (park side), which no photo shows, is drawn the same as
 * the front.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

const pylon = new Part(), navy = new Part(), gold = new Part(), red = new Part(), iron = new Part()

/** A square ring centred on (cx, cy) at height z, half-width h, chamfered by c, CCW from above. */
function ring(cx: number, cy: number, z: number, h: number, c = 0): V3[] {
  if (c <= 0) return [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  const k = h - c
  return [[cx - k, cy - h, z], [cx + k, cy - h, z], [cx + h, cy - k, z], [cx + h, cy + k, z], [cx + k, cy + h, z], [cx - k, cy + h, z], [cx - h, cy + k, z], [cx - h, cy - k, z]]
}
/**
 * A closed solid through cross-sections (rings of points in the same
 * order), ends capped; faces wound to point away from the local centre, so
 * any convex section works in any orientation.
 */
function tube(p: Part, secs: V3[][]) {
  const n = secs[0].length
  const centre = (s: V3[]) => mul(s.reduce((a, b) => add(a, b), [0, 0, 0] as V3), 1 / s.length)
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  for (let k = 0; k < secs.length - 1; k++) {
    const c = centre([...secs[k], ...secs[k + 1]])
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = secs[k][i], b = secs[k][j], d = secs[k + 1][i], e = secs[k + 1][j]
      if (dot(cross(sub(b, a), sub(d, a)), sub(a, c)) >= 0) { p.tri(a, b, d); p.tri(b, e, d) }
      else { p.tri(a, d, b); p.tri(b, d, e) }
    }
  }
  for (const [s, other] of [[secs[0], secs[1]], [secs[secs.length - 1], secs[secs.length - 2]]]) {
    const c = centre(s), away = sub(c, centre(other))
    for (let i = 0; i < n; i++) {
      const a = s[i], b = s[(i + 1) % n]
      if (dot(cross(sub(a, c), sub(b, c)), away) >= 0) p.tri(c, a, b)
      else p.tri(c, b, a)
    }
  }
}
/** A flat convex shape drawn in the x–z plane, from y0 to y1. */
function plate(p: Part, pts: [number, number][], y0: number, y1: number) {
  tube(p, [pts.map(([x, z]) => [x, y0, z] as V3), pts.map(([x, z]) => [x, y1, z] as V3)])
}
/** A band in the x–z plane along a polyline, `w` tall, from y0 to y1. */
function band(p: Part, path: [number, number][], w: number | ((i: number) => number), y0: number, y1: number) {
  for (let i = 0; i < path.length - 1; i++) {
    const [x0, z0] = path[i], [x1, z1] = path[i + 1]
    const L = Math.hypot(x1 - x0, z1 - z0), nx = -(z1 - z0) / L, nz = (x1 - x0) / L
    const w0 = (typeof w === 'number' ? w : w(i)) / 2, w1 = (typeof w === 'number' ? w : w(i + 1)) / 2
    plate(p, [[x0 - nx * w0, z0 - nz * w0], [x1 - nx * w1, z1 - nz * w1], [x1 + nx * w1, z1 + nz * w1], [x0 + nx * w0, z0 + nz * w0]], y0, y1)
  }
}
/** A UV sphere, smooth-shaded. */
function sphere(p: Part, c: V3, r: number, seg = 10, rings = 6) {
  const at = (i: number, j: number): V3 => {
    const th = (j / rings) * Math.PI, ph = (i / seg) * 2 * Math.PI
    return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const n00 = at(i, j), n10 = at(i + 1, j), n01 = at(i, j + 1), n11 = at(i + 1, j + 1)
    const P = (n: V3) => add(c, mul(n, r))
    if (j > 0) p.tri(P(n00), P(n01), P(n10), undefined, undefined, undefined, [n00, n01, n10])
    if (j < rings - 1) p.tri(P(n10), P(n01), P(n11), undefined, undefined, undefined, [n10, n01, n11])
  }
}

// ------------------------------------------------------------ the pylons ---
// Tall obelisks outside, shorter ball-topped pylons inside; mirrored.
const OB_X = 5.1, OB_H = 13, BP_X = 3.4, BP_H = 8.0, POST_X = 8.5
for (const s of [-1, 1]) {
  // Obelisk: a plinth, then a tapering shaft to a pyramid point.
  const ox = s * OB_X
  tube(pylon, [ring(ox, 0, 0, 0.85, 0.12), ring(ox, 0, 1.2, 0.85, 0.12)])
  tube(pylon, [ring(ox, 0, 1.2, 0.65, 0.1), ring(ox, 0, OB_H - 1.2, 0.3, 0.05), ring(ox, 0, OB_H, 0.02, 0.005)])
  // Ball pylon: a square pier with a cornice and a gold ball.
  const bx = s * BP_X
  tube(pylon, [ring(bx, 0, 0, 0.5, 0.08), ring(bx, 0, BP_H - 0.5, 0.45, 0.08)])
  tube(pylon, [ring(bx, 0, BP_H - 0.5, 0.6, 0.1), ring(bx, 0, BP_H, 0.6, 0.1)])
  sphere(gold, [bx, 0, BP_H + 0.55], 0.55)
  // Outer post carrying the end of the row.
  const px = s * POST_X
  tube(pylon, [ring(px, 0, 0, 0.3, 0.05), ring(px, 0, 4.6, 0.3, 0.05)])
}

// --------------------------------------------------- beam, gates, scroll ---
// The navy beam behind the ornament, across the full width at the gates' head.
tube(navy, [[[-POST_X, -0.45, 3.0], [POST_X, -0.45, 3.0], [POST_X, 0.15, 3.0], [-POST_X, 0.15, 3.0]], [[-POST_X, -0.45, 3.6], [POST_X, -0.45, 3.6], [POST_X, 0.15, 3.6], [-POST_X, 0.15, 3.6]]])
// The main gates, two leaves under a shallow arch, and a side gate each side.
for (const s of [-1, 1]) {
  const a = 0.08, b = BP_X - 0.5
  plate(iron, [[s * a, 0], [s * b, 0], [s * b, 2.7], [s * a, 3.0]], -0.06, 0.06)
  plate(iron, [[s * (OB_X + 0.7), 0], [s * (POST_X - 0.3), 0], [s * (POST_X - 0.3), 2.5], [s * (OB_X + 0.7), 2.5]], -0.06, 0.06)
}
// The gold scroll: a band rising from the outer posts to the middle,
// riding just above the beam, in front of the pylons.
const YF0 = 0.55, YF1 = 0.8 // the ornament's plane, in front of the pylons
{
  const path: [number, number][] = []
  for (let i = 0; i <= 16; i++) {
    const x = -POST_X + (2 * POST_X * i) / 16, u = x / POST_X
    path.push([x, 3.75 + 1.0 * (1 - u * u) + 0.25 * Math.cos(u * Math.PI * 2.5)])
  }
  band(gold, path, 0.32, YF0, YF1)
}

// -------------------------------------------------------- the pinwheels ---
// [x, z, radius]: the largest in the middle, as in the photos.
const WHEELS: [number, number, number][] = [[0, 7.6, 2.4], [-4.0, 6.1, 2.0], [4.0, 6.1, 2.0], [-7.4, 5.3, 1.6], [7.4, 5.3, 1.6]]
const BLADES = 12
for (const [cx, cz, r] of WHEELS) {
  // Gold crescent moon cradling the wheel from below, thick at the bottom,
  // its horns up either side.
  const arc: [number, number][] = [], K = 12
  const R = r + 0.4
  for (let i = 0; i <= K; i++) {
    const t = ((160 + (220 * i) / K) * Math.PI) / 180
    arc.push([cx + R * Math.cos(t), cz + R * Math.sin(t)])
  }
  band(gold, arc, (i) => 0.14 + 0.46 * Math.sin((Math.PI * i) / K), YF0, YF1)
  // Hub.
  const hub: [number, number][] = Array.from({ length: 10 }, (_, i) => {
    const t = (i / 10) * 2 * Math.PI
    return [cx + 0.27 * r * Math.cos(t), cz + 0.27 * r * Math.sin(t)]
  })
  plate(navy, hub, YF1 - 0.05, YF1 + 0.25)
  // Blades: wedges from the hub out, each about two thirds of its share.
  for (let k = 0; k < BLADES; k++) {
    const t = (k / BLADES) * 2 * Math.PI, dt = (0.68 * Math.PI) / BLADES
    const r0 = 0.24 * r
    plate(red, [
      [cx + r0 * Math.cos(t - dt * 0.6), cz + r0 * Math.sin(t - dt * 0.6)],
      [cx + r * Math.cos(t - dt), cz + r * Math.sin(t - dt)],
      [cx + r * Math.cos(t + dt), cz + r * Math.sin(t + dt)],
      [cx + r0 * Math.cos(t + dt * 0.6), cz + r0 * Math.sin(t + dt * 0.6)],
    ], YF1 - 0.02, YF1 + 0.18)
  }
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: pylon, material: finish('luna-gate-red-brown', 0xb0523f) },
  { part: navy, material: finish('luna-gate-navy', 0x3d4c86) },
  { part: gold, material: finish('neon-luna-gold', 0xcda44e) },
  { part: red, material: finish('neon-luna-red', 0xd4484a) },
  { part: iron, material: finish('luna-gate-iron', 0x4a4f57) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Luna Park entrance gate', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 5, elevation: 0, height: OB_H,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-luna-park-gate.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
