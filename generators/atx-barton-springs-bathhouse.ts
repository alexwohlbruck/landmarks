/**
 * Barton Springs Bathhouse, Zilker Park, Austin (1947, Dan Driscoll; Moderne) -
 * procedural, CC0-1.0, no textures.
 * bun generators/atx-barton-springs-bathhouse.ts
 *
 * The long, low bathhouse beside Barton Springs Pool: a central L of two
 * one-storey bars in buff brick with high bands of steel windows, the rounded
 * entrance pavilion at its north-east corner under a cantilevered flat roof, and
 * the two open-air dressing courts either side, walled in limestone, with flat
 * roofs cantilevered over their long sides.
 *
 * Frame: x along the building (bearing 75, to the ENE), y across it (+y to the
 * NNW), z up, metres; catalog bearing 345. Anchor -97.771354, 30.264083, the
 * outline's centroid. z = 0 is the lowest ground under it (Mapterhorn 137.3 m at
 * the south-east corner); the ground round the building is 138.0-138.3 m (lidar,
 * Mapterhorn), 0.7-1.0 m up. Walls run down to z = 0.
 *
 * Replaces: the multipolygon relation/13599348 (outer way/313446759, courts
 * 1015712053 and 1015712050) and the court roofs way/1015712051 and 1015712052.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): relation/13599348 (amenity=public_bath,
 *   start_date 1947), the court roofs 1015712051 and 1015712052.
 * - Lidar (measured; USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown 2017,
 *   0.5 m grid; much of the roof under live-oak canopy, read from the lowest
 *   returns): the two bars' roofs 143.35 m (5.35 m over the ground); the round
 *   pavilion 141.75 m; the court walls and roof strips 140.4-141.0 m; the courts
 *   open to the sky; the ground 138.0 m north, 137.3-138.1 m south.
 * - Published: built 1947 to a design by Dan Driscoll, City of Austin (Austin
 *   Parks and Recreation; Barton Springs Pool, NRHP 2003).
 * Photos (evidence):
 * - Lars Plougmann, "Barton Springs Pool main building in winter", CC BY-SA 2.0
 *   (buff brick, a band of steel windows with pale frames high on the wall, the
 *   flat roof and coping, the limestone court wall beside it):
 *   https://www.flickr.com/photos/75062596@N00/15365527325
 *
 * Numbers
 * - Windows 2.6 x 2.3 m, sills 2.3 m over the ground, 4.5 m apart (photo-scaled
 *   from the 3-light-wide steel sash); coping 0.3 m.
 * - The pavilion: the OSM arc fits a circle of radius 8.1 m. Cantilevers: its roof 1.2 m, the court roofs 2.7 m deep (OSM) plus
 *   1.0 m over the courts (estimated).
 * - Colours from the photo, pulled to the palette: buff brick #dcc497, limestone
 *   #e2d8cc, roof slabs `trim`, roofs `roof`, windows `window`.
 * - Night: the windows (`window`).
 *
 * Doubts
 * - One photo only, of one face: the other faces, the pavilion's glazing and the
 *   entrances are not photographed under an open licence, so the window bands are
 *   repeated round the bars, the pavilion is drawn with a glazed band on its
 *   street side and no doors are drawn. The trees hide much of the roof from the
 *   lidar; the heights are from the lowest returns.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face } from './bridge-kit'
import { earclip } from './atx-pfluger-pedestrian-bridge'

type P2 = [number, number]
const BRICK: MaterialSpec = finish('buff-brick', 0xdcc497)
const LIME: MaterialSpec = finish('limestone', 0xe2d8cc)
const TRIM: MaterialSpec = PALETTE.trim
const ROOF: MaterialSpec = PALETTE.roof
const WIN: MaterialSpec = PALETTE.window

const G = 0.8 // the ground round the building over z = 0
const BAR = G + 5.35, DRUM = G + 3.75, COURT = G + 2.5

/** A prism over a simple plan polygon (any winding) from z0 to z1, sides and top (and bottom if asked). */
function prism(p: Part, plan: P2[], z0: number, z1: number, top = true, bottom = false) {
  let a = 0
  for (let i = 0; i < plan.length; i++) a += plan[i][0] * plan[(i + 1) % plan.length][1] - plan[(i + 1) % plan.length][0] * plan[i][1]
  const r = a < 0 ? [...plan].reverse() : plan
  for (let i = 0; i < r.length; i++) {
    const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % r.length], l = Math.hypot(x1 - x0, y1 - y0) || 1
    face(p, [x0, y0, z0], [x1, y1, z0], [x1, y1, z1], [x0, y0, z1], [(y1 - y0) / l, -(x1 - x0) / l, 0])
  }
  const up: V3 = [0, 0, 1], dn: V3 = [0, 0, -1]
  for (const [i, j, k] of earclip(r)) {
    if (top) p.tri([r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1], undefined, undefined, undefined, [up, up, up])
    if (bottom) p.tri([r[i][0], r[i][1], z0], [r[k][0], r[k][1], z0], [r[j][0], r[j][1], z0], undefined, undefined, undefined, [dn, dn, dn])
  }
}
const rect = (x0: number, x1: number, y0: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const grow = (r: P2[], d: number): P2[] => { const xs = r.map((q) => q[0]), ys = r.map((q) => q[1]); return rect(Math.min(...xs) - d, Math.max(...xs) + d, Math.min(...ys) - d, Math.max(...ys) + d) }

/** Window panels along a wall from a to b (plan), facing n, every `step` metres. */
function windows(w: Part, a: P2, b: P2, n: P2, step = 4.5, wd = 2.6) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], k = Math.floor((L - 1.5) / step)
  const off = (L - (k - 1) * step) / 2
  for (let i = 0; i < k; i++) {
    const c = off + i * step, o = 0.05
    const p0: P2 = [a[0] + t[0] * (c - wd / 2) + n[0] * o, a[1] + t[1] * (c - wd / 2) + n[1] * o]
    const p1: P2 = [a[0] + t[0] * (c + wd / 2) + n[0] * o, a[1] + t[1] * (c + wd / 2) + n[1] * o]
    face(w, [p0[0], p0[1], G + 2.3], [p1[0], p1[1], G + 2.3], [p1[0], p1[1], G + 4.6], [p0[0], p0[1], G + 4.6], [n[0], n[1], 0])
  }
}

function build() {
  const brick = new Part(), lime = new Part(), trim = new Part(), roof = new Part(), win = new Part()
  // ---- the central L: the north bar and the south bar (lidar 5.35 m)
  const north = rect(-14.5, 5.2, 0.3, 14.2), south = rect(4.4, 16.3, -17.1, 0.3)
  for (const r of [north, south]) {
    prism(brick, r, 0, BAR - 0.3, false)
    prism(trim, grow(r, 0.3), BAR - 0.3, BAR, true, true)
    prism(roof, grow(r, -0.25), BAR, BAR + 0.04, true)
  }
  windows(win, [5.2, 14.2], [-14.5, 14.2], [0, 1])
  windows(win, [-14.5, 0.3], [4.4, 0.3], [0, -1])
  windows(win, [4.4, -17.1], [16.3, -17.1], [0, -1])
  windows(win, [16.3, -17.1], [16.3, 0.3], [1, 0])
  windows(win, [4.4, 0.3], [4.4, -17.1], [-1, 0])
  // ---- the round pavilion at the north-east corner (OSM arc: centre (9.0, 4.4), radius 8.1, from -29 to 117 deg)
  const C: P2 = [9.0, 4.4], R = 8.1, A0 = (-29 * Math.PI) / 180, A1 = (117 * Math.PI) / 180
  const at = (t: number, r = R): P2 => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t)]
  const arcT = Array.from({ length: 11 }, (_, k) => A0 + ((A1 - A0) * k) / 10)
  const arc = arcT.map((t) => at(t))
  prism(brick, [[5.2, 0.3], ...arc], 0, DRUM - 0.3, false)
  // its cantilevered roof, 1.2 m out round the curve
  prism(trim, [[5.2, 0.3], ...arcT.map((t) => at(t, R + 1.2))], DRUM - 0.3, DRUM, true, true)
  prism(roof, [[5.6, 0.7], ...arcT.map((t) => at(t, R - 0.4))], DRUM, DRUM + 0.04, true)
  // a glazed band round the curve
  for (let i = 0; i + 1 < arc.length; i++) {
    const [a, b] = [arc[i], arc[i + 1]], m: P2 = [(a[0] + b[0]) / 2 - C[0], (a[1] + b[1]) / 2 - C[1]], l = Math.hypot(...m)
    const n: P2 = [m[0] / l, m[1] / l], o = 0.05
    face(win, [a[0] + n[0] * o, a[1] + n[1] * o, G + 1.2], [b[0] + n[0] * o, b[1] + n[1] * o, G + 1.2], [b[0] + n[0] * o, b[1] + n[1] * o, DRUM - 0.7], [a[0] + n[0] * o, a[1] + n[1] * o, DRUM - 0.7], [n[0], n[1], 0])
  }
  // ---- the dressing courts: limestone walls round open courts, roofs over their long sides
  const T = 0.45
  for (const [x0, x1, y0, y1, roofs] of [[-41.7, -14.5, -4.5, 14.2, [1, -1]], [16.3, 40.4, -17.1, 0.4, [1]]] as [number, number, number, number, number[]][]) {
    for (const r of [rect(x0, x1, y1 - T, y1), rect(x0, x1, y0, y0 + T), rect(x0, x0 + T, y0 + T, y1 - T), rect(x1 - T, x1, y0 + T, y1 - T)]) prism(lime, r, 0, COURT, true)
    for (const s of roofs) {
      const ya = s > 0 ? y1 : y0, yb = ya - s * 3.7
      prism(roof, rect(x0 + T, x1 - T, Math.min(ya, yb), Math.max(ya, yb)), COURT - 0.25, COURT + 0.05, true, false)
      prism(trim, rect(x0 + T, x1 - T, Math.min(yb, yb + s * 0.25), Math.max(yb, yb + s * 0.25)), COURT - 0.35, COURT + 0.1, true, true)
    }
  }
  // the main roofs (inside the coping)
  return [{ part: brick, material: BRICK }, { part: lime, material: LIME }, { part: trim, material: TRIM }, { part: roof, material: ROOF }, { part: win, material: WIN }]
}

if (import.meta.main) {
  const list = build()
  const tris = list.reduce((n, p) => n + p.part.triangles, 0)
  const glb = writeGlb('Barton Springs Bathhouse', list, { license: 'CC0-1.0', bearing: 345, elevation: 0 })
  console.log(`atx-barton-springs-bathhouse.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
  if (tris > 5000 || glb.length > 250 * 1024) throw new Error('over budget')
  await Bun.write(new URL('../models/atx-barton-springs-bathhouse.glb', import.meta.url), glb)
}
