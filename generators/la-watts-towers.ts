/**
 * Watts Towers (Simon Rodia, built 1921-1954), Watts, Los Angeles —
 * procedural, CC0-1.0.
 * bun generators/la-watts-towers.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The anchor
 * (-118.24105, 33.93872) is 0.3 m east of the Center Tower's foot (OSM node
 * 4113030224); positions below are metres from it. y = 0 is the ground of the
 * lot, which is flat (LA County lidar ground 31.4-31.9 m; 3DEP 31.6-32.0 m).
 *
 * What makes it the Watts Towers: two very tall, slender, ringed lattice
 * spires standing close together, wider and bulging at the foot and
 * tapering to a needle; a third, half as tall, a few metres off; a scatter
 * of lower spires round them; all a grey mortar-and-steel lattice, inside a
 * low mortar wall round a triangular lot.
 *
 * Drawn for the map rather than as the real lattice: each spire is a solid
 * core cone in a darker tone (the dense lattice seen through, as it reads
 * from a distance) inside a cage of chunky pale posts and rings. Rings are
 * every 3 m rather than every metre, and 0.5 m thick rather than a few
 * centimetres, so they hold at phone size.
 *
 * Sources:
 * - OSM: the four man_made=tower nodes 4113030222-225 of the site
 *   relation 9320963 (Watts Towers, NRHP 77000297): the Center Tower's foot
 *   (node 224, by the anchor), the East Tower's (node 223, 5.5 m east-south-
 *   east of it), the West Tower's (node 225, 7 m west-north-west), and a
 *   lower spire (node 222). The lot: way/40186827 (the state historic
 *   park), a right triangle 51 m along 107th Street, 27 m on the west, its
 *   long side on the old railway; the wall follows it.
 * - Lidar (LA County 2020 surface model, 1.5 m grid): the lattice is too
 *   open for the laser to find its tops, but it confirms the two tall
 *   towers' feet (returns to 20 m at the Center Tower's node, to 14 m at
 *   the East Tower's), the third and a lower spire (4 m and 9 m returns at
 *   nodes 225 and 222), and an otherwise open lot with low structures.
 * - Published (Wikipedia, "Watts Towers"; NPS NRHP nomination): seventeen
 *   interconnected structures; the tallest 99.5 ft (30.3 m); West Tower
 *   55 ft (16.8 m), Center 99.5 ft (30.3 m), East 97.75 ft (29.8 m); steel
 *   rebar and mesh, mortar, mosaic of tile, glass and shells.
 * - Photos (Wikimedia Commons): "Highsmithwattstowers.jpg" (Carol M.
 *   Highsmith, public domain; from 107th Street to the south: the West
 *   Tower at left, the arch, the two tall towers, lower spires to the
 *   right), "Watts Towers (5872095388)" and "(5872095286)" (InSapphoWeTrust,
 *   CC BY-SA 2.0; from the street along the wall, and from below),
 *   "Watts-towers.jpg" (CC BY-SA 3.0; from the south-west, the fence and
 *   wall in front), "Watts Towers in Los Angeles 02/05/08" (Levi Clancy,
 *   CC BY-SA 4.0; the lattice, rings and colour), "Part of Watts Towers..."
 *   (Carol M. Highsmith, public domain, four; the cage rings, the arches
 *   between towers, the wall and its gate).
 * - Colour: weathered grey mortar over the steel, tinted green and blue by
 *   the mosaic (photos), pulled to the palette's lightness: pale mortar for
 *   the cage, a grey-green for the lattice core, a warm grey for the wall.
 * - Estimated from photos, scaled by the published heights: each tower's
 *   profile (the tall towers about 4 m across at the foot, a little wider just
 *   above it, then a long concave taper to a needle: 0.85 of the foot's
 *   width at a quarter of the height, 0.5 at half, 0.25 at three
 *   quarters, measured on the Highsmith photo; the West Tower 2 m
 *   across), the arch between the West and Center towers
 *   (about 11 m high), and the lower spires' heights (5-11 m) and places,
 *   which only node 222 records; the wall's height (2.2 m).
 * - Left out: the fine lattice and its mosaic, the gazebo, the Ship of
 *   Marco Polo's hull, the fountains, the other small arches.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const cage = new Part(), core = new Part(), wall = new Part()

type Profile = [number, number][] // [z, radius]

function radiusAt(p: Profile, z: number) {
  if (z <= p[0][0]) return p[0][1]
  for (let i = 0; i < p.length - 1; i++) {
    const [z0, r0] = p[i], [z1, r1] = p[i + 1]
    if (z <= z1) return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0)
  }
  return p[p.length - 1][1]
}

/** A surface of revolution about a vertical axis at (cx, cy), closed at the top. */
function cone(part: Part, cx: number, cy: number, prof: Profile, seg: number) {
  const ring = (r: number, z: number) =>
    Array.from({ length: seg }, (_, i) => {
      const a = (2 * Math.PI * i) / seg
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    })
  const rings = prof.map(([z, r]) => ring(Math.max(r, 0.001), z))
  part.loft(rings)
  const top = prof[prof.length - 1]
  if (top[1] > 0.01) part.cap(rings[rings.length - 1], true)
}

/** A horizontal ring with a square section, `t` thick, centred on radius r. */
function hoop(part: Part, cx: number, cy: number, r: number, z: number, t: number, seg: number) {
  const ri = Math.max(r - t / 2, 0.05), ro = r + t / 2, z0 = z - t / 2, z1 = z + t / 2
  for (let i = 0; i < seg; i++) {
    const a0 = (2 * Math.PI * i) / seg, a1 = (2 * Math.PI * (i + 1)) / seg
    const P = (rr: number, a: number, zz: number): V3 => [cx + rr * Math.cos(a), cy + rr * Math.sin(a), zz]
    part.quad(P(ro, a0, z0), P(ro, a1, z0), P(ro, a1, z1), P(ro, a0, z1)) // outside
    part.quad(P(ri, a1, z0), P(ri, a0, z0), P(ri, a0, z1), P(ri, a1, z1)) // inside
    part.quad(P(ri, a0, z1), P(ro, a0, z1), P(ro, a1, z1), P(ri, a1, z1)) // top
    // no underside: the map is seen from above
  }
}

/** A square-section bar along a polyline, `t` across, with closed ends. */
function bar(part: Part, pts: V3[], t: number) {
  const h = t / 2
  const secs = pts.map((p, k) => {
    const q = pts[Math.min(k + 1, pts.length - 1)], o = pts[Math.max(k - 1, 0)]
    let d: V3 = [q[0] - o[0], q[1] - o[1], q[2] - o[2]]
    const l = Math.hypot(...d) || 1
    d = [d[0] / l, d[1] / l, d[2] / l]
    // a side vector, horizontal, across the bar
    let s: V3 = [-d[1], d[0], 0]
    const sl = Math.hypot(...s)
    s = sl < 1e-6 ? [1, 0, 0] : [s[0] / sl, s[1] / sl, 0]
    const u: V3 = [d[1] * s[2] - d[2] * s[1], d[2] * s[0] - d[0] * s[2], d[0] * s[1] - d[1] * s[0]]
    const c = (a: number, b: number): V3 => [p[0] + s[0] * a + u[0] * b, p[1] + s[1] * a + u[1] * b, p[2] + s[2] * a + u[2] * b]
    return [c(-h, -h), c(h, -h), c(h, h), c(-h, h)]
  })
  for (let k = 0; k < secs.length - 1; k++) {
    const a = secs[k], b = secs[k + 1]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      part.quad(a[i], a[j], b[j], b[i])
    }
  }
  part.quad(secs[0][3], secs[0][2], secs[0][1], secs[0][0])
  const e = secs[secs.length - 1]
  part.quad(e[0], e[1], e[2], e[3])
}

/**
 * One spire: a solid core cone at `coreK` of the cage radius, `posts`
 * chunky posts up the profile, and hoops every `gap` metres.
 */
function spire(cx: number, cy: number, prof: Profile, o: { posts: number; gap: number; seg: number; t: number; coreK: number; spin?: number }) {
  const H = prof[prof.length - 1][0]
  // core, closing to a needle
  cone(core, cx, cy, prof.map(([z, r]) => [z, z >= H ? 0 : r * o.coreK] as [number, number]), Math.max(8, o.seg - 4))
  // posts, following the profile, from the ground to just below the tip
  const zs: number[] = []
  for (const [z] of prof) if (z < H - 0.5) zs.push(z)
  zs.push(H - 0.4)
  for (let k = 0; k < o.posts; k++) {
    const a = (2 * Math.PI * k) / o.posts + (o.spin ?? 0)
    bar(cage, zs.map(z => {
      const r = radiusAt(prof, z)
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    }), o.t * 0.9)
  }
  // hoops
  for (let z = o.gap; z < H - 1.2; z += o.gap) {
    const r = radiusAt(prof, z)
    if (r < 0.35) break
    hoop(cage, cx, cy, r, z, o.t * 1.25, o.seg)
  }
  // finial: a short needle above the core
  bar(cage, [[cx, cy, H - 1.5], [cx, cy, H + 0.6]], o.t * 0.9)
}

// The two tall towers: a broad, bulging cage at the foot, drawing in by a
// third of the height, then a long straight taper to the needle (photos).
const CENTER: Profile = [[0, 1.95], [2, 2.1], [7.5, 1.8], [15, 1.05], [22.7, 0.52], [27, 0.28], [30.3, 0.04]]
const EAST: Profile = [[0, 1.75], [2, 1.9], [7.4, 1.62], [14.9, 0.95], [22.4, 0.47], [26.6, 0.25], [29.8, 0.04]]
const WEST: Profile = [[0, 0.95], [2, 1.0], [4.5, 0.85], [8.4, 0.55], [12.6, 0.3], [16.8, 0.04]]
spire(-0.3, 0, CENTER, { posts: 8, gap: 3, seg: 12, t: 0.5, coreK: 0.5 })
spire(5.2, -1.6, EAST, { posts: 8, gap: 3, seg: 12, t: 0.5, coreK: 0.5, spin: 0.2 })
spire(-6.9, 2.4, WEST, { posts: 6, gap: 2.8, seg: 12, t: 0.45, coreK: 0.5 })

// The lower spires round them (node 222 is mapped; the rest are placed from
// the photos within the lot).
const low = (h: number, r: number): Profile => [[0, r], [h * 0.3, r * 0.8], [h * 0.7, r * 0.35], [h, 0.04]]
for (const [x, y, h, r] of [
  [9.4, -2.4, 11, 1.0],
  [13.5, -3.6, 6, 0.7],
  [-14.5, 8, 8, 0.8],
  [-20, 3, 6, 0.7],
  [-12, 10, 6.5, 0.7],
  [-23, 14, 5, 0.6],
] as [number, number, number, number][]) {
  spire(x, y, low(h, r), { posts: 4, gap: 2.6, seg: 8, t: 0.4, coreK: 0.55 })
}

// The arch between the West and Center towers: a semicircle on two posts,
// a broad band (photos: about 11 m high, the width of the gap).
{
  const a: V3 = [-6.9 + 1.2, 2.4 - 0.4, 0], b: V3 = [-0.3 - 2.3, 0 + 0.8, 0]
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  const half = Math.hypot(b[0] - a[0], b[1] - a[1]) / 2
  const dx = (b[0] - a[0]) / (2 * half), dy = (b[1] - a[1]) / (2 * half)
  const spring = 11 - half
  const pts: V3[] = [[a[0], a[1], 0]]
  for (let i = 0; i <= 10; i++) {
    const th = Math.PI - (Math.PI * i) / 10
    pts.push([mx + dx * half * Math.cos(th), my + dy * half * Math.cos(th), spring + half * Math.sin(th)])
  }
  pts.push([b[0], b[1], 0])
  bar(cage, pts, 0.5)
}

// The wall round the lot (OSM way/40186827, set 0.6 m inside it).
{
  const lot: [number, number][] = [[-28.3, -5.0], [-26.4, 20.4], [21.0, -4.7]]
  const T = 0.5, H = 2.2, b = 0.12
  for (let i = 0; i < lot.length; i++) {
    const [x0, y0] = lot[i], [x1, y1] = lot[(i + 1) % lot.length]
    const l = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / l, uy = (y1 - y0) / l
    const nx = uy * (T / 2), ny = -ux * (T / 2) // to the right of the direction
    const P = (x: number, y: number, z: number): V3 => [x, y, z]
    const A = [x0 - nx, y0 - ny], B = [x1 - nx, y1 - ny], C = [x1 + nx, y1 + ny], D = [x0 + nx, y0 + ny]
    // two long faces, the top with a slight bevel, the ends
    wall.quad(P(D[0], D[1], 0), P(C[0], C[1], 0), P(C[0], C[1], H - b), P(D[0], D[1], H - b))
    wall.quad(P(B[0], B[1], 0), P(A[0], A[1], 0), P(A[0], A[1], H - b), P(B[0], B[1], H - b))
    const m = (p: number[], q: number[], k: number) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]
    const Ai = m(A, D, 0.25), Bi = m(B, C, 0.25), Ci = m(C, B, 0.25), Di = m(D, A, 0.25)
    wall.quad(P(D[0], D[1], H - b), P(C[0], C[1], H - b), P(Ci[0], Ci[1], H), P(Di[0], Di[1], H))
    wall.quad(P(B[0], B[1], H - b), P(A[0], A[1], H - b), P(Ai[0], Ai[1], H), P(Bi[0], Bi[1], H))
    wall.quad(P(Di[0], Di[1], H), P(Ci[0], Ci[1], H), P(Bi[0], Bi[1], H), P(Ai[0], Ai[1], H))
    wall.quad(P(A[0], A[1], 0), P(D[0], D[1], 0), P(D[0], D[1], H - b), P(A[0], A[1], H - b))
    wall.quad(P(C[0], C[1], 0), P(B[0], B[1], 0), P(B[0], B[1], H - b), P(C[0], C[1], H - b))
  }
}

const parts = [
  { part: cage, material: finish('watts-mortar', 0xbdbdb2) },
  { part: core, material: finish('watts-lattice', 0x76847d) },
  { part: wall, material: finish('watts-wall', 0xd6c8b8) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(14), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Watts Towers', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'relation/9320963',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-watts-towers.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
