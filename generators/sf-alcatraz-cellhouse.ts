/**
 * Alcatraz Main Cellhouse, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-alcatraz-cellhouse.ts
 *
 * Frame: built turned to the building, BEARING 315.8: +y runs along the
 * cellhouse to the north-west (the dining hall end), +x across it to the
 * north-east, z up, metres. Origin = centroid of the three OSM outlines the
 * model replaces (way/128245373 Main Prison, way/128245367 Administration
 * Block, way/24433437 Dining Hall), which are one connected building.
 *
 * Evidence
 * - OSM: the three outlines above, no heights. OSM on Alcatraz sits 10-14 m
 *   west of the 2023 lidar (and agrees with NAIP), consistently for every
 *   feature; for this building the best fit is 13.5 m east, 4.5 m south
 *   (IoU 0.85). The model keeps OSM's position so it lines up with the map's
 *   paths, and takes the plan and every height from the lidar.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m in this frame
 *   (/tmp/city/sf/work/sf-alcatraz-cellhouse/{rot,sect,ring}.py). y = 0 is the
 *   lowest ground at the walls, 35.5 m NAVD88, by the dining hall's north-west
 *   corner; the island top round the cellhouse proper is 6.5 m higher, so its
 *   lower 6.5 m is buried on every side but the dining hall's. Plan: the
 *   cellhouse 50.5 m wide by 50.5 m long with a north-east notch, its south
 *   end narrowed to 39.5 m, the administration block across the south-east
 *   end (36.5 x 16 m), the dining hall (23.5 x 52 m) on the axis to the
 *   north-west. Heights above y = 0: cellhouse roof 16.2, parapet 16.9, three
 *   long roof monitors to 17.0-17.5; dining hall roof 15.2, parapet 16.1;
 *   administration roof 15.5 with a raised middle (16.8), parapet 16.9, the
 *   front parapet 17.7, a penthouse at the junction 18.2.
 * - Published: Wikipedia "Alcatraz Federal Penitentiary"; NPS: the cellhouse,
 *   built 1910-12 by the Army as the Pacific Branch military prison, reinforced
 *   concrete, four three-tier cell blocks, the dining hall at the west end, the
 *   administration offices at the south-east entrance.
 * - Commons daylight photos: "Alcatraz Cellhouse.jpg" (Dav, CC BY 2.5, the
 *   whole south-west side from the bay), "Lighthouse California-05967 -
 *   Alcatraz Island Lighthouse (20637738295).jpg" (Dennis G. Jarvis, CC BY-SA
 *   2.0, the same side), "Alcatraz Cellhouse side.jpg" (Technochick, CC BY-SA
 *   2.0, the south-west wall close up: pilasters, tall barred windows, the
 *   cornice), "Alcatraz - Main Cellhouse (4409210917).jpg" (Daniel Ramirez,
 *   CC BY 2.0, from the recreation yard: the dining hall's rusticated base
 *   and paired windows), "Alcatraz Island, helicopter view.jpg" (Kitchen,
 *   CC BY 2.0, from the north-west above: roofs, monitors, the dining hall
 *   end), "Alcatraz Island aerial view.jpg" (Ralf Baechle, CC BY-SA 4.0),
 *   "San Francisco (CA, USA), Alcatraz, Administration Block -- 2022 --
 *   3161.jpg" (Dietmar Rabich, CC BY-SA 4.0, the entrance front).
 *
 * Estimated from the photos: the window rows (the cellhouse's three rows of
 * tall barred windows, the dining hall's rusticated base and two rows of
 * paired windows, the administration block's two rows of large windows and
 * its arched entrance), bay widths (2.8 m on the cellhouse: 18 window columns along its 50 m south-west side; 4.3 m on the dining hall), pilasters and cornice. The
 * monitors are raised boxes (0.9 m sides) with pitched glass tops, 2.8 m wide,
 * on the lidar's lines; their ridges (17.7) sit 0.2-0.7 m over the
 * lidar's, to read as the boxes the aerials show. The
 * cellhouse's ochre-buff and the administration block's peachier paint are
 * one weathered buff here.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 315.8
const ANCHOR = { lng: -122.4229929, lat: 37.826688 }
const wall = new Part(), trim = new Part(), roof = new Part(), windows = new Part(), glass = new Part(), entrance = new Part()

type XY = [number, number]
const area = (p: XY[]) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (p: XY[]) => (area(p) < 0 ? [...p].reverse() : p)
const inside = (p: XY[], x: number, y: number) => {
  let c = false
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
/** Move every edge of a counter-clockwise polygon inward by d (outward if d < 0). */
function inset(p: XY[], d: number): XY[] {
  const n = p.length
  return p.map((_, i) => {
    const a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n]
    const e1 = norm([b[0] - a[0], b[1] - a[1]]), e2 = norm([c[0] - b[0], c[1] - b[1]])
    const n1: XY = [-e1[1], e1[0]], n2: XY = [-e2[1], e2[0]] // left normals point inside
    // intersect the two offset lines
    const p1: XY = [a[0] + n1[0] * d, a[1] + n1[1] * d], p2: XY = [b[0] + n2[0] * d, b[1] + n2[1] * d]
    const den = e1[0] * e2[1] - e1[1] * e2[0]
    if (Math.abs(den) < 1e-9) return [b[0] + n1[0] * d, b[1] + n1[1] * d] as XY
    const t = ((p2[0] - p1[0]) * e2[1] - (p2[1] - p1[1]) * e2[0]) / den
    return [p1[0] + e1[0] * t, p1[1] + e1[1] * t] as XY
  })
}
function norm(v: XY): XY { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l] }
/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function triangulate(poly: XY[]): [XY, XY, XY][] {
  const idx = poly.map((_, i) => i), out: [XY, XY, XY][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
    for (let k = 0; k < idx.length; k++) {
      const a = poly[idx[(k - 1 + idx.length) % idx.length]], b = poly[idx[k]], c = poly[idx[(k + 1) % idx.length]]
      if (cross(a, b, c) <= 1e-9) continue
      const tri = [a, b, c]
      if (idx.some((j) => { const q = poly[j]; return !tri.includes(q) && inside(tri as XY[], q[0], q[1]) })) continue
      out.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  out.push([poly[idx[0]], poly[idx[1]], poly[idx[2]]])
  return out
}
const cap = (p: Part, poly: XY[], z: number) => { for (const [a, b, c] of triangulate(poly)) p.tri([...a, z], [...b, z], [...c, z]) }
/** Vertical walls round a counter-clockwise polygon, facing out (or in, for a parapet's inner face). */
function walls(p: Part, poly: XY[], z0: number, z1: number, inward = false) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (inward) p.quad([b[0], b[1], z0], [a[0], a[1], z0], [a[0], a[1], z1], [b[0], b[1], z1])
    else p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** A flat ring between two polygons (outer and an inset of it) at height z, facing up or down. */
function ringCap(p: Part, outer: XY[], inner: XY[], z: number, up = true) {
  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length
    const q: V3[] = [[...inner[i], z], [...outer[i], z], [...outer[j], z], [...inner[j], z]] as V3[]
    if (up) p.quad(q[0], q[1], q[2], q[3])
    else p.quad(q[3], q[2], q[1], q[0])
  }
}

// --- Plan (lidar, in the frame) and heights above y = 0 ---
type Zone = { name: string; poly: XY[]; roof: number; parapet: number; ground: number; rows: [number, number][]; bay: number; win: number; pair?: boolean; base?: number }
const ZONES: Zone[] = [
  {
    name: 'cellhouse',
    poly: ccw([[-25, 25], [16.5, 25], [16.5, 9.5], [25.5, 9.5], [25.5, -41], [-14, -41], [-14, -25.5], [-25, -25.5]]),
    roof: 16.2, parapet: 16.9, ground: 6.5, bay: 2.8, win: 1.3,
    rows: [[7.4, 8.8], [10.4, 12.6], [13.3, 15.1]],
  },
  {
    name: 'administration',
    poly: ccw([[-11, -41], [25.5, -41], [25.5, -57], [-11, -57]]),
    roof: 15.5, parapet: 16.9, ground: 6.5, bay: 5.2, win: 2.2,
    rows: [[8.4, 11.4], [12.3, 14.6]],
  },
  {
    name: 'dining hall',
    poly: ccw([[-13, 25], [10.5, 25], [10.5, 77], [-13, 77]]),
    roof: 15.2, parapet: 16.1, ground: 2.1, bay: 4.3, win: 0.95, pair: true, base: 6.0,
    rows: [[7.0, 9.6], [10.6, 13.4]],
  },
]
/** Covered by another zone at least as tall as z: no window there. */
const covered = (self: Zone, x: number, y: number, z: number) => ZONES.some((o) => o !== self && z < o.parapet && inside(o.poly, x, y))

for (const zn of ZONES) {
  const P = zn.poly, inner = inset(P, 0.4)
  walls(wall, P, 0, zn.parapet)
  ringCap(trim, P, inner, zn.parapet) // parapet coping
  walls(wall, inner, zn.roof, zn.parapet, true)
  cap(roof, inner, zn.roof)
  // cornice band under the parapet
  const out = inset(P, -0.28)
  walls(trim, out, zn.roof - 0.9, zn.roof - 0.45)
  ringCap(trim, out, P, zn.roof - 0.45, true)
  ringCap(trim, out, P, zn.roof - 0.9, false)
  // the dining hall's rusticated base: a plinth slightly proud, capped by a string course
  if (zn.base) {
    const pl = inset(P, -0.15)
    walls(wall, pl, 0, zn.base)
    ringCap(trim, pl, P, zn.base)
  }

  // Facades: bays of windows between pilasters on every exposed wall.
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const nx = uy, ny = -ux // outward for a counter-clockwise polygon
    const n = Math.max(1, Math.round(L / zn.bay)), w = L / n
    const at = (s: number, off: number, z: number): V3 => [a[0] + ux * s + nx * off, a[1] + uy * s + ny * off, z]
    const open = (s: number, z: number) => !covered(zn, a[0] + ux * s + nx * 0.6, a[1] + uy * s + ny * 0.6, z)
    const off = zn.base ? 0.2 : 0.05
    for (let k = 0; k < n; k++) {
      const sm = w * (k + 0.5)
      const isDoor = zn.name === 'administration' && Math.abs(ny + 1) < 0.01 && k === Math.floor(n / 2)
      for (const [z0, z1] of zn.rows) {
        if (!open(sm, z1)) continue
        const panes = zn.pair ? [sm - zn.win / 2 - 0.25, sm + zn.win / 2 + 0.25] : [sm]
        for (const c of panes) windows.quad(at(c - zn.win / 2, 0.05, z0), at(c + zn.win / 2, 0.05, z0), at(c + zn.win / 2, 0.05, z1), at(c - zn.win / 2, 0.05, z1))
      }
      // the dining hall's basement windows, one per bay
      if (zn.base && open(sm, 5.0)) windows.quad(at(sm - 0.6, 0.2, 3.2), at(sm + 0.6, 0.2, 3.2), at(sm + 0.6, 0.2, 5.0), at(sm - 0.6, 0.2, 5.0))
      // the administration block's arched entrance, in the middle of its front
      if (isDoor) {
        const r = 1.3, z0 = zn.ground, spring = z0 + 2.4, o = 0.06
        entrance.quad(at(sm - r, o, z0), at(sm + r, o, z0), at(sm + r, o, spring), at(sm - r, o, spring))
        for (let j = 0; j < 10; j++) {
          const t0 = (Math.PI * j) / 10, t1 = (Math.PI * (j + 1)) / 10
          entrance.tri(at(sm, o, spring), at(sm + r * Math.cos(t0), o, spring + r * Math.sin(t0)), at(sm + r * Math.cos(t1), o, spring + r * Math.sin(t1)))
        }
      }
    }
    // pilasters between the bays, from the ground (or the plinth) to the cornice
    const pz0 = zn.base ?? zn.ground, pz1 = zn.roof - 0.9
    for (let k = 1; k < n; k++) {
      const s = w * k
      if (!open(s, pz1)) continue
      const h = 0.38, d = off + 0.2
      wall.quad(at(s - h, d, pz0), at(s + h, d, pz0), at(s + h, d, pz1), at(s - h, d, pz1))
      wall.quad(at(s - h, 0, pz0), at(s - h, d, pz0), at(s - h, d, pz1), at(s - h, 0, pz1))
      wall.quad(at(s + h, d, pz0), at(s + h, 0, pz0), at(s + h, 0, pz1), at(s + h, d, pz1))
    }
  }
}

// Roof monitors on the cellhouse: long glazed lanterns along the cell blocks.
function monitor(u: number, v0: number, v1: number, top: number, half = 1.4) {
  const z0 = 16.2, z1 = z0 + 0.9
  top = Math.max(top, z1 + 0.6)
  const x0 = u - half, x1 = u + half
  roof.quad([x0, v0, z0], [x1, v0, z0], [x1, v0, z1], [x0, v0, z1])
  roof.quad([x1, v1, z0], [x0, v1, z0], [x0, v1, z1], [x1, v1, z1])
  roof.quad([x1, v0, z0], [x1, v1, z0], [x1, v1, z1], [x1, v0, z1])
  roof.quad([x0, v1, z0], [x0, v0, z0], [x0, v0, z1], [x0, v1, z1])
  glass.quad([x1, v0, z1], [x1, v1, z1], [u, v1, top], [u, v0, top])
  glass.quad([x0, v1, z1], [x0, v0, z1], [u, v0, top], [u, v1, top])
  roof.tri([x0, v0, z1], [x1, v0, z1], [u, v0, top])
  roof.tri([x1, v1, z1], [x0, v1, z1], [u, v1, top])
}
monitor(-12, -18, -10, 17.0); monitor(-12, -8, 17, 17.0)
monitor(0, -35, -10, 17.5); monitor(0, -8, 17, 17.5)
monitor(11.5, -35, -10, 17.5); monitor(11.5, -8, 1, 17.5)

// Administration block: its raised middle, the taller front parapet, the penthouse at the junction.
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part = roof) {
  walls(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)
  cap(top, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z1)
}
box(wall, -3, 17.5, -56.6, -43, 15.5, 16.8)
box(wall, -11, 25.5, -57, -56.4, 16.9, 17.7, trim)
box(wall, -1, 17.5, -43.5, -39.5, 16.2, 18.2)

const parts = [
  { part: wall, material: finish('weathered-buff', 0xe6dcc8) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('pale-roof', 0xcbcfd1) },
  { part: windows, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: entrance, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Alcatraz Main Cellhouse', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 18.2,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/128245373', 'way/128245367', 'way/24433437'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-alcatraz-cellhouse.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
