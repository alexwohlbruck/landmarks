/**
 * Millennium Tower, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-millennium-tower.ts
 *
 * Map frame, rotated to the building: +x (u) points south-east along the
 * long axis, +y (v) north-east, z up, metres. BEARING 45 (the SoMa grid).
 * Origin = centroid of the OSM tower outline way/72963089.
 *
 * Evidence
 * - OSM way/72963089: the tower, a 48 x 33 m rectangle with notched corners
 *   (north-west and north-east), 58 levels, height 197. way/73348851
 *   "Millennium Lofts" (height 44): the 12-storey mid-rise on Fremont Street
 *   and the podium joining it to the tower, the second half of the same
 *   development. No building:parts.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m, in the building
 *   frame (/tmp/city/sf/lidar.py): street at 3.4-4.0 m NAVD88 (y = 0 at 3.6;
 *   the -2 m pit on the Mission Street side is the 2022-23 pile-retrofit
 *   excavation, as are the 80-93 m returns between tower and mid-rise, which
 *   are drill rigs); the roof is a wedge: a ridge at 197.5 m running corner to
 *   corner from the west to the east corner of the plan, falling ~0.72 m per
 *   metre to 181 m at the north and south corners, where it levels off; a
 *   185-187 m terrace on each slope is folded into the plane. Mid-rise roof
 *   44-47 m with a 49 m plant room at its north-west end; podium 11-14 m.
 * - Published (Wikipedia): 197 m, 58 storeys, Handel Architects, 2009; glass
 *   curtain wall. It leans ~0.5 m to the north-west; not modelled.
 * - Photos (daylight): "Millennium Tower San Francisco October 2008.jpg"
 *   (Daniel Ramirez, CC BY 2.0, the sloped top with its level shoulder),
 *   "Millennium Tower in San Francisco (3477319899).jpg" (Daniel Ramirez,
 *   CC BY 2.0, the base on Mission Street), "Millennium Tower San Francisco
 *   July 2008.jpg" (Hydrogen Iodide, public domain, from the west up
 *   Mission), "Millennium Tower San Francisco 2021.jpg" (Dead.rabbit,
 *   CC BY-SA 4.0), "Millennium Tower (114658072).jpg" (DestinationFearFan,
 *   CC BY-SA 4.0, the finned long face and the corner notch),
 *   "MillenniumTower-2016-06-21.jpg" (Georgewilliamherbert, CC BY-SA 4.0).
 *
 * Estimated: the facade split (the long faces read silver from dense vertical
 * fins, the short faces as blue glass with floor lines; from the 2021 and
 * DestinationFearFan photos), trim spacing, the 8 m lobby and its band, and
 * the mid-rise and podium facades (no licensed photo of them was found; drawn
 * plainly). The brief described a rounded-triangular plan; OSM, the lidar and
 * the photos all show a notched rectangle, which is what is modelled.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 45
const ANCHOR = { lng: -122.3961896, lat: 37.7904092 }

const glass = new Part(), fins = new Part(), trim = new Part(), roof = new Part(), lobby = new Part(), slope = new Part()
const stone = trim // podium walls and plant room: pale, like the mullion trim

type P2 = [number, number]
// Tower outline (way/72963089) in the building frame, counter-clockwise.
const TOWER: P2[] = [
  [-24.54, -12.95], [-14.27, -13.03], [-14.32, -16.12], [23.08, -16.42], [23.54, 14.59], [9.65, 14.7],
  [8.29, 16.8], [-11.92, 16.91], [-13.22, 14.88], [-23.24, 14.96], [-23.41, 3.68], [-24.3, 3.69],
]
// Tidy the plan: square the edges that OSM draws a few cm off.
TOWER.forEach((p) => { p[0] = Math.round(p[0] * 4) / 4; p[1] = Math.round(p[1] * 4) / 4 })

// --- The wedge roof: a corner-to-corner ridge, planes falling to a level shoulder. ---
const R0: P2 = [-24.5, -13], R1: P2 = [23.5, 14.5]
const RL = Math.hypot(R1[0] - R0[0], R1[1] - R0[1])
const RN: P2 = [-(R1[1] - R0[1]) / RL, (R1[0] - R0[0]) / RL] // normal to the ridge, towards the north corner
const RIDGE = 197.5, SHOULDER = 181, SLOPE = 0.72
const DC = (RIDGE - SHOULDER) / SLOPE
const dist = (p: P2) => (p[0] - R0[0]) * RN[0] + (p[1] - R0[1]) * RN[1]
const H = (p: P2) => Math.max(SHOULDER, RIDGE - SLOPE * Math.abs(dist(p)))

/** Split a closed outline's edges where they cross the roof's fold lines, so its top is piecewise straight. */
function foldEdges(poly: P2[]): P2[] {
  const out: P2[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    out.push(a)
    const da = dist(a), db = dist(b)
    const cuts = [-DC, 0, DC].map((c) => (c - da) / (db - da)).filter((t) => t > 1e-4 && t < 1 - 1e-4).sort((x, y) => x - y)
    for (const t of cuts) out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earclip(poly: P2[]): [P2, P2, P2][] {
  const pts = poly.slice(), tris: [P2, P2, P2][] = []
  const cross = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => cross(a, b, p) > 1e-9 && cross(b, c, p) > 1e-9 && cross(c, a, p) > 1e-9
  let guard = 0
  while (pts.length > 3 && guard++ < 5000) {
    let cut = false
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i + pts.length - 1) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length]
      if (cross(a, b, c) <= 1e-9) continue
      if (pts.some((p) => p !== a && p !== b && p !== c && inside(p, a, b, c))) continue
      tris.push([a, b, c]); pts.splice(i, 1); cut = true; break
    }
    if (!cut) pts.splice(0, 1) // degenerate (collinear) leftovers
  }
  if (pts.length === 3) tris.push([pts[0], pts[1], pts[2]])
  return tris
}
/** Clip a polygon to the half-plane k*dist(p) >= c*k (Sutherland-Hodgman). */
function clip(poly: P2[], c: number, keepAbove: boolean): P2[] {
  const f = (p: P2) => (keepAbove ? dist(p) - c : c - dist(p))
  const out: P2[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}

// --- Walls, edge by edge. ---
const LOBBY = 8, BAND = 10.5
/** True for the long faces (normal along v): the silver finned faces. */
const finned = (a: P2, b: P2) => Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]) && Math.hypot(b[0] - a[0], b[1] - a[1]) > 12
{
  const ring = foldEdges(TOWER)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const ha = H(a), hb = H(b)
    const q = (z0a: number, z0b: number, z1a: number, z1b: number, p: Part) =>
      p.quad([a[0], a[1], z0a], [b[0], b[1], z0b], [b[0], b[1], z1b], [a[0], a[1], z1a])
    q(0, 0, LOBBY, LOBBY, lobby)
    q(LOBBY, LOBBY, BAND, BAND, trim)
    // find which original edge this sub-edge lies on, for the finned test
    const orig = TOWER.findIndex((p, k) => {
      const nx = TOWER[(k + 1) % TOWER.length]
      const cr = (nx[0] - p[0]) * (a[1] - p[1]) - (nx[1] - p[1]) * (a[0] - p[0])
      const cr2 = (nx[0] - p[0]) * (b[1] - p[1]) - (nx[1] - p[1]) * (b[0] - p[0])
      return Math.abs(cr) < 1e-3 && Math.abs(cr2) < 1e-3
    })
    const e0 = TOWER[orig], e1 = TOWER[(orig + 1) % TOWER.length]
    q(BAND, BAND, ha, hb, finned(e0, e1) ? fins : glass)
  }
}

// Trim: a parapet lip along the sloped top, vertical fin lines on the long faces,
// floor lines on the short faces, and the notched corners' slim piers.
function onEdge(a: P2, b: P2, t: number, out: number): P2 {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
  return [a[0] + (b[0] - a[0]) * t + nx * out, a[1] + (b[1] - a[1]) * t + ny * out]
}
/** A small proud strip on an edge: lateral t0..t1, from z0(t) to z1(t). */
function strip(a: P2, b: P2, t0: number, t1: number, z0: (t: number) => number, z1: (t: number) => number, d = 0.25) {
  const pts = (t: number, o: number, z: number): V3 => { const p = onEdge(a, b, t, o); return [p[0], p[1], z] }
  const A0 = pts(t0, -0.02, z0(t0)), B0 = pts(t1, -0.02, z0(t1)), A1 = pts(t0, -0.02, z1(t0)), B1 = pts(t1, -0.02, z1(t1))
  const a0 = pts(t0, d, z0(t0)), b0 = pts(t1, d, z0(t1)), a1 = pts(t0, d, z1(t0)), b1 = pts(t1, d, z1(t1))
  trim.quad(a0, b0, b1, a1) // face
  trim.quad(A0, a0, a1, A1) // side at t0
  trim.quad(b0, B0, B1, b1) // side at t1
  trim.quad(a1, b1, B1, A1) // top
  trim.quad(A0, B0, b0, a0) // underside
}
{
  const ring = foldEdges(TOWER)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const top = (t: number) => H([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    strip(a, b, 0, 1, (t) => top(t) - 1.1, (t) => top(t), 0.3) // parapet lip
  }
  for (let k = 0; k < TOWER.length; k++) {
    const a = TOWER[k], b = TOWER[(k + 1) % TOWER.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const top = (t: number) => H([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) - 1.1
    if (finned(a, b)) {
      const n = Math.round(L / 6.5)
      for (let j = 1; j < n; j++) { const t = j / n, w = 0.45 / L; strip(a, b, t - w, t + w, () => BAND, top, 0.22) }
    } else if (L > 12) {
      for (let z = BAND + 13.6; z < SHOULDER - 6; z += 13.6) strip(a, b, 0.01, 0.99, () => z, () => z + 0.7, 0.2)
    }
  }
}

// --- Roof: the wedge planes and the level shoulders, each piece triangulated in plan. ---
{
  const pieces = [
    clip(TOWER, DC, true), clip(clip(TOWER, DC, false), 0, true),
    clip(clip(TOWER, 0, false), -DC, true), clip(TOWER, -DC, false),
  ].filter((p) => p.length >= 3)
  for (const piece of pieces) {
    for (const [a, b, c] of earclip(piece)) slope.tri([a[0], a[1], H(a) - 0.6], [b[0], b[1], H(b) - 0.6], [c[0], c[1], H(c) - 0.6])
  }
}

// --- Mid-rise and podium (way/73348851). ---
type Box = { u0: number; u1: number; v0: number; v1: number; z0: number; z1: number }
function box(p: Part, b: Box, capPart: Part = roof) {
  const c: V3[] = [[b.u0, b.v0, 0], [b.u1, b.v0, 0], [b.u1, b.v1, 0], [b.u0, b.v1, 0]]
  for (let i = 0; i < 4; i++) {
    const a = c[i], d = c[(i + 1) % 4]
    p.quad([a[0], a[1], b.z0], [d[0], d[1], b.z0], [d[0], d[1], b.z1], [a[0], a[1], b.z1])
  }
  capPart.cap(c.map(([x, y]) => [x, y, b.z1] as V3), true)
}
// Podium: the outline's L, 12.5 m, stone with a long window band.
const PODIUM: P2[] = [[-24.5, 18.75], [30.75, 18.75], [30.75, 66.25], [20, 66.25], [20, 68.75], [-24.5, 68.75]]
{
  const PZ = 12.5
  for (let i = 0; i < PODIUM.length; i++) {
    const a = PODIUM[i], b = PODIUM[(i + 1) % PODIUM.length]
    stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], PZ], [a[0], a[1], PZ])
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const n = Math.max(1, Math.round(L / 9))
    for (let j = 0; j < n; j++) {
      const t0 = j / n + 0.6 / L, t1 = (j + 1) / n - 0.6 / L
      for (const [z0, z1] of [[1, 4.6], [6.4, 11]]) {
        const p0 = onEdge(a, b, t0, 0.04), p1 = onEdge(a, b, t1, 0.04)
        ;(z0 < 2 ? lobby : glass).quad([p0[0], p0[1], z0], [p1[0], p1[1], z0], [p1[0], p1[1], z1], [p0[0], p0[1], z1])
      }
    }
  }
  const tris = earclip(PODIUM)
  for (const [a, b, c] of tris) roof.tri([a[0], a[1], PZ], [b[0], b[1], PZ], [c[0], c[1], PZ])
  // Mid-rise: glass box with floor lines every three storeys, plant room on top.
  const M = { u0: -24.5, u1: 21, v0: 40, v1: 68.75, z0: PZ, z1: 45.5 }
  box(glass, M)
  const MP: P2[] = [[M.u0, M.v0], [M.u1, M.v0], [M.u1, M.v1], [M.u0, M.v1]]
  for (let i = 0; i < 4; i++) {
    const a = MP[i], b = MP[(i + 1) % 4]
    for (let z = PZ + 10.2; z < M.z1 - 2; z += 10.2) strip(a, b, 0, 1, () => z, () => z + 0.8, 0.2)
    strip(a, b, 0, 1, () => M.z1 - 1, () => M.z1, 0.25)
  }
  box(stone, { u0: -23, u1: -12, v0: 60, v1: 67.5, z0: M.z1, z1: 49 })
}

const parts = [
  { part: glass, material: windowVariant(2, 0xa6bccd) },
  { part: fins, material: windowVariant(3, 0xc6d1d9) },
  { part: trim, material: finish('mullion-silver', 0xe8ecee) },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x7e8c97 } },
  { part: slope, material: PALETTE.glass },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Millennium Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: RIDGE,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/72963089', 'way/73348851'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-millennium-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
