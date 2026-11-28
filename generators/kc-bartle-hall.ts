/**
 * Bartle Hall (H. Roe Bartle Exhibition Hall, 1976; expanded over
 * Interstate 670 in 1994) and its four "Sky Stations" pylons (R.M.
 * Fischer, 1994), Kansas City Convention Center, Kansas City, Missouri —
 * original procedural geometry, CC0-1.0.
 * bun generators/kc-bartle-hall.ts
 *
 * Map frame: x east, y north, z up, metres, in the hall's own axes,
 * placed at bearing 1.7° (the long walls of OSM way/38500669 run 1.7°).
 * Origin: the outline's centroid; z = 0 at the lowest ground under it,
 * the floor of the I-670 trench that runs east–west under the south part
 * of the hall (lidar 266.9 m). The streets around stand 9–15 m higher and
 * the walls run down into them.
 *
 * Identity, from the photos:
 *  1. the four pylons in a row across the hall, square concrete shafts
 *     stepping in about 20 m above the roof, rising some 50 m over it
 *     (Charvex, from the south-west and from 12th St at dusk);
 *  2. their sculptures: an inverted pyramid frame on each shaft, a small
 *     cap and ball on three, a stack of five discs bristling with rods and
 *     a ball on the east one (Nightryder84, Pylon 01; Charvex);
 *  3. the cable fans from the pylons down to the roof (Charvex);
 *  4. the very long, flat hall, a pale roof, and the folded-plate long
 *     walls: big pale inverted triangles against mid-grey (Charvex, from
 *     Broadway; the south part shows the same zigzag as steel trusses,
 *     from the south-west);
 *  5. over the interstate, the hall stands on a deck on columns with the
 *     roads running underneath (Charvex, from the south-west).
 *
 * Evidence:
 *  - OSM way/38500669 (building=yes, levels 6, "Bartle Hall", wikidata
 *    Q4865353): a 95 × 456 m rectangle in this frame (x ±47.5,
 *    y −224 … 232) with a lower tail at the south-east corner (x 30–47,
 *    y −274 … −224). No building:part ways; no neighbour overlaps.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 1 m
 *    grids in two crops (half 140 m at y −140, half 125 m at y +115).
 *    Above the trench floor: flat roof 34.0 the whole length, falling to
 *    ≈31 at the eaves; the south tail ≈17; pylon centres at
 *    x −41.5, −13.5, 13.5, 40.5 on y −101; tops 93.5 (three) and 101.8
 *    (east). The eaves' sloped grey band (28 → 34 m over 6 m) is from
 *    Charvex's photo; lidar only shows the roof dropping ≈3 m there. Lidar fills each pylon as an 8 × 14 m block (the cable fans
 *    run north–south); the shafts are drawn from the photos instead.
 *    Ground: trench floor 0–4 for y −190 … −118; streets 9 (west) to 15
 *    (north end).
 *  - NAIP (public domain): the pale roof, the trench, the pylon row.
 *  - Estimated from the photos (scaled by the lidar heights): shafts
 *    4.6 m square to 20 m above the roof, then 3.8 m square to 84 m (a
 *    shaft is ≈1/12 of its height above the roof in Charvex's south-west
 *    photo); pyramid frame 84–90 m, 11 m across; the disc stack 5.6 m
 *    across with rods 13 m tip to tip (Nightryder84's close-up, scaled by
 *    the shaft); the trusses' spacing (≈19 m bays) and the deck at
 *    9 m over the trench; cable count and landing points (fewer than the
 *    real fans).
 *  - Simplified: the south part's N-trusses over dark wall are drawn with
 *    the same pale triangles as the north part's folded plate; the
 *    triangles' period (≈30 m) and apex height (street + 2 m) are
 *    estimated from the Broadway photo.
 *
 * Night: the sculptures glow (`neon-sky-station`, in their silver day
 * colour; Charvex's dusk photo shows them lit) and the shafts are
 * floodlit from below; the hall is unlit.
 *
 * Photos (evidence):
 *  - Bartle Hall from southwest.jpg, Charvex, public domain,
 *    https://commons.wikimedia.org/wiki/File:Bartle_Hall_from_southwest.jpg
 *  - Bartle Hall from Broadway Blvd.jpg, Charvex, public domain,
 *    https://commons.wikimedia.org/wiki/File:Bartle_Hall_from_Broadway_Blvd.jpg
 *  - Bartle Hall Sky Stations Kansas City MO.jpg, Charvex, public domain,
 *    https://commons.wikimedia.org/wiki/File:Bartle_Hall_Sky_Stations_Kansas_City_MO.jpg
 *  - Bartle Hall Convention Ctr Pylon 01.JPG, Nightryder84, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Bartle_Hall_Convention_Ctr_Pylon_01.JPG
 *  - USGS NAIP orthophoto. No commercial imagery.
 *
 * Doubts: whether all three western sculptures are the same (photos show
 * them alike from two sides); the cable landing points; the east side's
 * trusses (no east-side photo was opened; drawn as the west).
 */
import { Part, writeGlb, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'

const X0 = -47.5, X1 = 47.5, Y0 = -224, Y1 = 232
const ROOF = 34, EAVE = 28, CHAMFER = 6
const DECK = 9 // the hall's floor over the trench
const TRENCH: [number, number] = [-190, -118]
const MAST_Y = -101
const MASTS = [-41.5, -13.5, 13.5, 40.5]
const ROOF_MAST = ROOF, STEP = ROOF + 20, SHAFT_TOP = 84

const wall = new Part(), truss = new Part(), roof = new Part(), concrete = new Part(), sculpture = new Part(), soffit = new Part()

const area = (a: V3, b: V3, c: V3) => { const n = cross(sub(b, a), sub(c, a)); return Math.hypot(n[0], n[1], n[2]) }
const quad = (p: Part, a: V3, b: V3, c: V3, d: V3) => {
  if (area(a, b, c) > 1e-6) p.tri(a, b, c)
  if (area(a, c, d) > 1e-6) p.tri(a, c, d)
}
/** An axis-aligned box; `bottom` false leaves out the underside. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  quad(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]) // south
  quad(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]) // north
  quad(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]) // east
  quad(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]) // west
  quad(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]) // top
  if (bottom) quad(p, [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0])
}
/** A square-section bar from a to b, `w` thick, its faces wound outward. */
function bar(p: Part, a: V3, b: V3, w: number) {
  const d = sub(b, a), L = Math.hypot(d[0], d[1], d[2]), t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  let u = cross(t, ref); const lu = Math.hypot(...u); u = [u[0] / lu, u[1] / lu, u[2] / lu]
  const v = cross(t, u), h = w / 2
  const ring = (o: V3) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, r]): V3 =>
    [o[0] + (u[0] * s + v[0] * r) * h, o[1] + (u[1] * s + v[1] * r) * h, o[2] + (u[2] * s + v[2] * r) * h])
  const ra = ring(a), rb = ring(b), c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  const face = (q: V3[]) => {
    const n = cross(sub(q[1], q[0]), sub(q[2], q[0])), o = sub(q[0], c)
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] >= 0) quad(p, q[0], q[1], q[2], q[3])
    else quad(p, q[3], q[2], q[1], q[0])
  }
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; face([ra[i], ra[j], rb[j], rb[i]]) }
  face(ra); face(rb)
}
/** A vertical cylinder (n sides) with a top and bottom. */
function drum(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 12) {
  const P = (i: number, z: number): V3 => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI), z]
  for (let i = 0; i < n; i++) {
    quad(p, P(i, z0), P(i + 1, z0), P(i + 1, z1), P(i, z1))
    p.tri([cx, cy, z1], P(i, z1), P(i + 1, z1))
    p.tri([cx, cy, z0], P(i + 1, z0), P(i, z0))
  }
}
/** A ball, smooth, `n` around and n/2 up. */
function ball(p: Part, c: V3, r: number, n = 10) {
  const m = n / 2
  const P = (i: number, k: number): [V3, V3] => {
    const th = (i / n) * 2 * Math.PI, ph = (k / m) * Math.PI - Math.PI / 2
    const nn: V3 = [Math.cos(ph) * Math.cos(th), Math.cos(ph) * Math.sin(th), Math.sin(ph)]
    return [[c[0] + r * nn[0], c[1] + r * nn[1], c[2] + r * nn[2]], nn]
  }
  for (let k = 0; k < m; k++)
    for (let i = 0; i < n; i++) {
      const [a, na] = P(i, k), [b, nb] = P(i + 1, k), [cc, nc] = P(i + 1, k + 1), [d, nd] = P(i, k + 1)
      if (area(a, b, cc) > 1e-6) p.tri(a, b, cc, undefined, undefined, undefined, [na, nb, nc])
      if (area(a, cc, d) > 1e-6) p.tri(a, cc, d, undefined, undefined, undefined, [na, nc, nd])
    }
}

// --- the hall ----------------------------------------------------------------
// Long walls, down to the trench floor except over the interstate, where
// the hall stands on its deck.
for (const [ya, yb, zb] of [[Y0, TRENCH[0], 0], [TRENCH[0], TRENCH[1], DECK], [TRENCH[1], Y1, 0]] as const) {
  quad(wall, [X1, ya, zb], [X1, yb, zb], [X1, yb, EAVE], [X1, ya, EAVE]) // east
  quad(wall, [X0, yb, zb], [X0, ya, zb], [X0, ya, EAVE], [X0, yb, EAVE]) // west
}
quad(wall, [X0, Y0, 0], [X1, Y0, 0], [X1, Y0, EAVE], [X0, Y0, EAVE]) // south end
quad(wall, [X1, Y1, 0], [X0, Y1, 0], [X0, Y1, EAVE], [X1, Y1, EAVE]) // north end
// The pale roof, its edge sloping up to the flat top.
{
  const o: V3[] = [[X0, Y0, EAVE], [X1, Y0, EAVE], [X1, Y1, EAVE], [X0, Y1, EAVE]]
  const c = CHAMFER
  const i: V3[] = [[X0 + c, Y0 + c, ROOF], [X1 - c, Y0 + c, ROOF], [X1 - c, Y1 - c, ROOF], [X0 + c, Y1 - c, ROOF]]
  for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; quad(wall, o[k], o[l], i[l], i[k]) } // grey metal band (Charvex)
  quad(roof, i[0], i[1], i[2], i[3])
}
// Over the trench: the deck's dark underside, the abutments, and columns.
quad(soffit, [X0, TRENCH[1], DECK], [X1, TRENCH[1], DECK], [X1, TRENCH[0], DECK], [X0, TRENCH[0], DECK])
quad(soffit, [X0, TRENCH[1], 0], [X1, TRENCH[1], 0], [X1, TRENCH[1], DECK], [X0, TRENCH[1], DECK]) // faces south
quad(soffit, [X1, TRENCH[0], 0], [X0, TRENCH[0], 0], [X0, TRENCH[0], DECK], [X1, TRENCH[0], DECK]) // faces north
for (const x of [-40, -13, 13, 40])
  for (let y = TRENCH[0] + 14; y < TRENCH[1] - 6; y += 18) box(concrete, x - 0.8, x + 0.8, y - 0.8, y + 0.8, 0, DECK)
// The lower south-east tail (OSM; lidar ≈17).
box(wall, 30, 47.3, -274, Y0, 0, 17)

// The folded-plate walls: big pale inverted triangles along both long
// walls, wide under the eave and pointing down toward the street, with the
// mid-grey wall showing between them as upward triangles (Charvex, from
// Broadway; the 1994 part carries the same rhythm in its steel trusses).
{
  const n = Math.round((Y1 - Y0) / 30), bay = (Y1 - Y0) / n, zt = EAVE - 0.15
  // street level climbs toward the north end (lidar; map terrain)
  const zb = (y: number) => Math.max(10, 10 + (y - 100) * 0.037)
  for (const [x, o] of [[X0, -0.15], [X1, 0.15]] as const) {
    const X = x + o
    for (let k = 0; k < n; k++) {
      const ya = Y0 + k * bay + 0.4, yb = Y0 + (k + 1) * bay - 0.4, yc = (ya + yb) / 2
      const apex: V3 = [X, yc, zb(yc) + 2]
      const A: V3 = [X, ya, zt], B: V3 = [X, yb, zt]
      if (o > 0) truss.tri(apex, B, A) // east wall faces +x
      else truss.tri(apex, A, B)
      // a pale frame on the sloped edges, standing proud, so the zigzag reads
      bar(truss, [X + o * 2, ya, zt - 0.4], [X + o * 2, yc, apex[2]], 1.0)
      bar(truss, [X + o * 2, yc, apex[2]], [X + o * 2, yb, zt - 0.4], 1.0)
    }
    bar(truss, [X + o * 2, Y0 + 0.6, zt - 0.4], [X + o * 2, Y1 - 0.6, zt - 0.4], 1.0)
  }
}

// --- the Sky Stations ---------------------------------------------------------
for (const [m, mx] of MASTS.entries()) {
  const y = MAST_Y
  box(concrete, mx - 2.3, mx + 2.3, y - 2.3, y + 2.3, ROOF_MAST - 4, STEP)
  box(concrete, mx - 1.9, mx + 1.9, y - 1.9, y + 1.9, STEP, SHAFT_TOP)
  // The inverted pyramid frame on the shaft.
  const z0 = SHAFT_TOP, z1 = SHAFT_TOP + 6, r0 = 1.9, r1 = 5.5
  const lo: V3[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]): V3 => [mx + a * r0, y + b * r0, z0 + 0.3])
  const hi: V3[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]): V3 => [mx + a * r1, y + b * r1, z1])
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    bar(sculpture, lo[k], hi[k], 0.6)
    bar(sculpture, hi[k], hi[l], 0.6)
    const mid: V3 = [(lo[k][0] + lo[l][0]) / 2, (lo[k][1] + lo[l][1]) / 2, z0 + 0.3]
    bar(sculpture, mid, hi[k], 0.5)
    bar(sculpture, mid, hi[l], 0.5)
  }
  drum(sculpture, mx, y, 1.3, z0, z1 + 0.6, 10)
  if (m < 3) {
    // A small cap and ball (lidar top 93.5).
    drum(sculpture, mx, y, 1.6, z1 + 0.6, z1 + 1.8, 10)
    ball(sculpture, [mx, y, 92.5], 1.0, 10)
  } else {
    // Five discs with rods, a core and a ball (lidar top 101.8).
    drum(sculpture, mx, y, 1.6, z1, 98.6, 10)
    for (let k = 0; k < 5; k++) {
      const zd = z1 + 0.6 + k * 1.5
      drum(sculpture, mx, y, 2.8, zd, zd + 0.4, 12)
      for (let i = 0; i < 3; i++) {
        const a = ((i * 60 + k * 30) * Math.PI) / 180, R = 6.5
        bar(sculpture, [mx - R * Math.cos(a), y - R * Math.sin(a), zd + 0.2], [mx + R * Math.cos(a), y + R * Math.sin(a), zd + 0.2], 0.45)
      }
    }
    ball(sculpture, [mx, y, 100.5], 1.3, 10)
  }
  // Cable fans to the roof, north and south.
  for (const s of [-1, 1])
    for (const d of [30, 55, 80, 105]) {
      const lx = Math.max(X0 + 1, Math.min(X1 - 1, mx * 1.12))
      bar(truss, [mx, y + s * 2.1, 80 - d / 15], [lx, y + s * d, ROOF], 0.45)
    }
}

// --- write ------------------------------------------------------------------
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: wall, material: finish('hall-wall', 0x8a9097) },
  { part: truss, material: finish('pale-steel', 0xd6d8d7, 0.6) },
  { part: roof, material: finish('hall-roof', 0xdcdedb) },
  { part: concrete, material: { ...finish('pylon-concrete', 0xc6c7c4), floodlight: (p, n) => (n[2] > 0.7 ? 0 : p[2] > ROOF ? 0.7 : 0) } },
  { part: sculpture, material: finish('neon-sky-station', 0xdfe2e5, 0.5) },
  { part: soffit, material: finish('deck-shadow', 0x4a4f57) },
]
const triangles = parts.reduce((a, { part }) => a + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bartle Hall', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 101.8, bearing: 1.7,
})
await Bun.write(new URL('../models/kc-bartle-hall.glb', import.meta.url), glb)
console.log(`kc-bartle-hall.glb: ${triangles} triangles, ${glb.length} bytes`)
