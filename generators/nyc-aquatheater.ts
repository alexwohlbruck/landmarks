/**
 * Aquatheater, New York Aquarium, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-aquatheater.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of the OSM outline way/405885395 (building=yes,
 * leisure=stadium, "Aquatheater"), -73.9748631 40.5742852. y = 0 is the
 * lowest ground under the footprint (the path behind the stand on the
 * north); elevation 0.
 *
 * The landmark. The aquarium's open-air amphitheatre for its sea lion
 * shows (Wikipedia, "New York Aquarium", lists it among the five exhibits
 * as of 2018). A horseshoe of open bleachers wraps the north and west sides
 * of the show pool and faces south-east towards it and the Sea Cliffs
 * rockwork beyond, with the ocean behind. The OSM outline is the stand
 * itself, not the pool: its inner edge is the pool's rim and its outer edge
 * the back of the stand. What makes it read:
 *   1. the stepped horseshoe of pale aluminium bleachers;
 *   2. the high, plain concrete back wall on the outside of the curve;
 *   3. the low front wall along the pool rim (the pool itself is water,
 *      which the map draws, so it isn't modelled);
 *   4. the small stair block at the back of the north side (the bump in the
 *      OSM outline).
 *   5. the aisle stairs splitting the stand into blocks (three, drawn as
 *      bold strips; their places are estimated from the photo from above).
 *
 * Numbers:
 *   plan: the OSM outline, used as drawn; NAIP (USGS) agrees.
 *   heights: measured, lidar (USGS NY_NewYorkCity, 2017; tools/lidar.py
 *     grid at 0.5 m): the pool deck is about 1.3 m above the path behind
 *     the stand, the back rows 6 to 7 m above it. Front of the stand 1.4 m;
 *     top tread 6.8 m; back parapet 7.8 m (estimated, 1 m over the top
 *     row as in the photo from above). The higher returns (12 to 16 m) are
 *     the light masts, left out as too thin to read.
 *   seven tiers: invented; the real stand has many more, narrower rows,
 *     grouped here so they read at map distance.
 *   stair block 7.3 m: estimated.
 *
 * Photos (EVIDENCE):
 *   "Osborne, the Sea Lion; New York Aquarium" (Flickr 4415956944),
 *     jschauma, CC BY 2.0: the stand and pool from above, 2010.
 *     https://www.flickr.com/photos/25464516@N07/4415956944
 *   "Aquatheater" (Flickr 9699082865), edenpictures, CC BY 2.0: the pool
 *     and stage from the bleachers.
 *     https://www.flickr.com/photos/10485077@N06/9699082865
 *   "New York Aquarium / Coney Island Beach" (Flickr 4415167375), jschauma,
 *     CC BY 2.0: the Sea Cliffs beside it.
 *     https://www.flickr.com/photos/25464516@N07/4415167375
 * Aerial: USGS NAIP orthophoto (public domain), via tools/usgs.py naip.
 * OSM: way/405885395 (ODbL).
 * No look-only sources were used.
 *
 * Doubts: no licensed photo shows the outside of the back wall, so its
 * plain concrete finish is a guess; the photos are from 2010 to 2013, and
 * the aquarium was rebuilt in places after Hurricane Sandy (2012).
 */
import { Part, writeGlb, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

// The pool rim (inner edge) and the back of the stand (outer edge), both
// from the stand's east end to its west end, from OSM way/405885395.
const INNER: XY[] = [[22.0, -9.4], [15.9, -0.3], [14.0, 0.5], [-12.6, -6.0], [-13.8, -8.1], [-14.8, -17.9]]
const OUTER: XY[] = [
  [26.6, -6.2], [28.7, -0.4], [22.7, 8.5], [14.4, 11.8], [-0.7, 8.1], [-6.3, 6.8],
  [-18.3, 3.8], [-24.4, -2.8], [-25.5, -13.1], [-20.1, -17.4],
]
const STAIR: XY[] = [[-6.3, 6.8], [-0.7, 8.1], [-1.3, 10.8], [-7.0, 9.4]]

const FRONT = 1.4, TOP = 6.8, PARAPET = 7.8, TIERS = 7, N = 22

function resample(pl: XY[], n: number): XY[] {
  const seg = pl.slice(1).map((b, i) => Math.hypot(b[0] - pl[i][0], b[1] - pl[i][1]))
  const total = seg.reduce((s, l) => s + l, 0)
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    let t = (total * k) / n, i = 0
    while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++ }
    const f = Math.min(1, t / seg[i])
    out.push([pl[i][0] + (pl[i + 1][0] - pl[i][0]) * f, pl[i][1] + (pl[i + 1][1] - pl[i][1]) * f])
  }
  return out
}

/** A quad wound to face `want` (any vector on the outside). */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const g = cross(sub(b, a), sub(c, a))
  if (g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0) p.quad(d, c, b, a)
  else p.quad(a, b, c, d)
}

const seats = new Part(), concrete = new Part(), roof = new Part()
const inner = resample(INNER, N), outer = resample(OUTER, N)
const at = (k: number, t: number): XY => [inner[k][0] + (outer[k][0] - inner[k][0]) * t, inner[k][1] + (outer[k][1] - inner[k][1]) * t]
const P = (xy: XY, z: number): V3 => [xy[0], xy[1], z]
const tread = (j: number) => FRONT + ((TOP - FRONT) * (j + 1)) / TIERS
const UP: V3 = [0, 0, 1]
// Towards the pool from a point of the band.
const toPool = (k: number): V3 => { const a = inner[k], b = outer[k]; return [a[0] - b[0], a[1] - b[1], 0] }

for (let k = 0; k < N; k++) {
  const wantIn = toPool(k)
  // Front wall on the pool rim.
  face(concrete, P(inner[k], 0), P(inner[k + 1], 0), P(inner[k + 1], tread(0)), P(inner[k], tread(0)), wantIn)
  for (let j = 0; j < TIERS; j++) {
    const t0 = j / TIERS, t1 = (j + 1) / TIERS, h = tread(j)
    face(seats, P(at(k, t0), h), P(at(k + 1, t0), h), P(at(k + 1, t1), h), P(at(k, t1), h), UP)
    if (j + 1 < TIERS) face(concrete, P(at(k, t1), h), P(at(k + 1, t1), h), P(at(k + 1, t1), tread(j + 1)), P(at(k, t1), tread(j + 1)), wantIn)
  }
  // Back parapet: inner face, coping, and the outer back wall to the ground.
  const wantOut: V3 = [-wantIn[0], -wantIn[1], 0]
  const ob0 = outer[k], ob1 = outer[k + 1]
  const ib0 = at(k, 0.97), ib1 = at(k + 1, 0.97)
  face(concrete, P(ib0, TOP), P(ib1, TOP), P(ib1, PARAPET + 0.1), P(ib0, PARAPET + 0.1), wantIn)
  face(concrete, P(ob0, PARAPET), P(ob1, PARAPET), P(ib1, PARAPET + 0.1), P(ib0, PARAPET + 0.1), UP)
  face(concrete, P(ob0, 0), P(ob1, 0), P(ob1, PARAPET), P(ob0, PARAPET), wantOut)
}
// Aisle stairs: three bold concrete strips across the tiers (the photo from
// above shows aisles splitting the stand into blocks).
for (const k of [5, 11, 17]) {
  const mixK = (t: number, f: number): XY => {
    const a = at(k, t), b = at(k + 1, t)
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
  }
  for (let j = 0; j < TIERS; j++) {
    const t0 = j / TIERS, t1 = (j + 1) / TIERS, h = tread(j) + 0.06
    face(concrete, P(mixK(t0, 0.35), h), P(mixK(t0, 0.65), h), P(mixK(t1, 0.65), h), P(mixK(t1, 0.35), h), UP)
  }
}

// The two ends: a stepped profile from the ground.
for (const k of [0, N]) {
  const other = k === 0 ? 1 : N - 1
  const want: V3 = [inner[k][0] - inner[other][0], inner[k][1] - inner[other][1], 0]
  for (let j = 0; j < TIERS; j++) {
    const a = at(k, j / TIERS), b = at(k, (j + 1) / TIERS)
    face(concrete, P(a, 0), P(b, 0), P(b, tread(j)), P(a, tread(j)), want)
  }
  face(concrete, P(at(k, 0.97), TOP), P(outer[k], TOP), P(outer[k], PARAPET), P(at(k, 0.97), PARAPET + 0.1), want)
}

// The stair block at the back of the north side.
{
  const h = 7.3
  for (let i = 0; i < 4; i++) {
    const a = STAIR[i], b = STAIR[(i + 1) % 4]
    const want: V3 = [(a[1] - b[1]) * -1, (b[0] - a[0]) * -1, 0] // outward for a counter-clockwise ring
    face(concrete, P(a, 0), P(b, 0), P(b, h), P(a, h), want)
  }
  face(roof, P(STAIR[0], h), P(STAIR[1], h), P(STAIR[2], h), P(STAIR[3], h), UP)
}

const parts = [
  { part: seats, material: finish('aqt-bleacher', 0xd6dadd, 0.5) },
  { part: concrete, material: finish('aqt-concrete', 0xc9c3b8) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Aquatheater', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: PARAPET, osm: 'way/405885395',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-aquatheater.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
console.log(parts.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
