/**
 * Lloyd's Building (1 Lime Street), City of London — original procedural
 * geometry, CC0-1.0.
 * bun generators/london-lloyds-building.ts
 *
 * Writes two levels of detail in one frame: models/london-lloyds-building.glb
 * (the low model: bold forms, a pod and a drum band every two storeys, three
 * ducts a tower) and models/london-lloyds-building.detail.glb (every storey's
 * pod and drum band, five ducts a tower, floor bands every storey).
 *
 * Map frame turned to the building's grid: +y runs along bearing 23 (the long
 * axis of the atrium), +x along bearing 113, z up, metres. BEARING 23.
 * Origin = centroid of the OSM outline way/23988892.
 *
 * Evidence
 * - OSM way/23988892 (outline, 88 m) and parts way/310187362 (atrium),
 *   310187363 (south tower), 310187364 (south-east tiers), 310187365 (east
 *   tower), 310187366 (west tier), 310187367 (west tower), 310187370 (north-
 *   east tower), 445330146 (south-west tiers), 445330148 (the main block),
 *   read in this frame (bin/frame.py). Their heights are rough (several are
 *   20 m off the lidar), so plan comes from OSM and heights from lidar.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0, heights above the street (~12 m above the box's ground_min, which is
 *   a basement light-well):
 *     main gallery block 68 m; atrium vault crown 78–80 m, above 75 m over
 *     x -12..8; south-west terraces 41 m with a 54 m step on the west
 *     (y -10..-4); south-east tiers 54 m;
 *     towers: north-east 88, east 88 (y 2..12) and 78–80 (y 12..21), west 88
 *     (x -40..-29, y 8..22, a little west of the OSM part), south 74–76,
 *     and a lower north-west tower ~66 m at x -22..-12, y 36..44 that OSM
 *     does not map (drawn here; it is open street in OSM, so nothing is
 *     replaced there).
 * - Published (Wikipedia; Historic England list entry 1405493, Grade I):
 *   Richard Rogers Partnership, 1986; 88 m, 95 m to the tops of the cranes;
 *   six satellite towers carrying stairs, lifts, services and stacked toilet
 *   pods; the barrel-vaulted glass atrium; stainless-steel cladding; blue
 *   gantry cranes on the towers; the gallery blocks step down in terraces.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Lloyd's Building from St Mary Axe.jpg", DanielMichaelPerry, CC0 — from
 *     the north-east: the drums, pods, ducts, plant rooms, the atrium end;
 *   "Lloyd's building in City of London.jpg", Choinowski, CC BY-SA 4.0 —
 *     stacked stainless pods with portholes, stair drums, the concrete frame;
 *   "Lloyd's Building 01.jpg", Rafa Esteve, CC BY-SA 4.0 — a stair drum's
 *     storey bands, the ducts;
 *   "Lloyd's Building and Company 02.jpg", Rafa Esteve, CC BY-SA 4.0;
 *   "Lloyd's Building Silhouette.jpg", Jordon Houston, CC BY-SA 4.0;
 *   "Cheesegrater and Gherkin.jpg", Colin, CC BY-SA 4.0 — from the south
 *     and above: the high atrium vault with its fan-glazed, white-framed
 *     south end, the towers' plant rooms, the blue cranes;
 *   "Southeastern view from The Look Out, the 50th floor of 8 Bishopsgate,
 *     London.jpg", Paul W, CC0 — the atrium vault from above;
 *   night: "Lloyd's building at night 2023-11-16.jpg", Matt Brown, CC BY 2.0,
 *     and "Lloyd's building at night IMG 1341.JPG", Deror_avi, CC BY-SA 3.0 —
 *     the stainless towers floodlit warm white, lit office floors. Neither
 *     shows blue lighting, so no neon is drawn: the steel carries
 *     _FLOODLIGHT instead, and the cranes stay painted blue.
 *
 * Measured: plan (OSM), heights (lidar). Published: 88/95 m. Estimated: which
 * face of each tower carries the drum and the pod stack (from the photos where
 * a tower is seen; the others follow the same pattern), drum radius 4–5 m,
 * pods 3.3 m tall a storey (4.2 m), duct sizes (0.55–0.95 m radius, four a tower low, five in detail), plant rooms
 * the top 7 m, the crane gantries (6.5 m), the top storey of each gallery
 * block set back 3 m (the terraces), the frame: columns every ~6 m and floor
 * bands every two storeys (every storey in the detail model) in front of dark
 * glazing recessed 1.2 m, the atrium vault 20 m wide (lidar) springing at
 * 70 m with eight ribs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 23
const ANCHOR = { lng: -0.0824276, lat: 51.5130062 }

type Vec = V3
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossV = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function quadOut(p: Part, q: Vec[], inside: Vec) {
  const n = crossV(sub(q[1], q[0]), sub(q[2], q[0]))
  const m: Vec = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, (q[0][2] + q[2][2]) / 2]
  if (dot(n, sub(m, inside)) >= 0) p.quad(q[0], q[1], q[2], q[3])
  else p.quad(q[0], q[3], q[2], q[1])
}
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  const P = (x: number, y: number, z: number): Vec => [x, y, z]
  const c: Vec = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  const f: Vec[][] = [
    [P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)],
    [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)],
    [P(x1, y1, z0), P(x0, y1, z0), P(x0, y1, z1), P(x1, y1, z1)],
    [P(x0, y1, z0), P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1)],
    [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)],
  ]
  if (bottom) f.push([P(x0, y0, z0), P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0)])
  for (const q of f) quadOut(p, q, c)
}
/** A vertical cylinder or arc a0..a1, smooth-shaded, with an optional top cap. */
function cylinder(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg: number, a0 = 0, a1 = 2 * Math.PI, top = true) {
  for (let i = 0; i < seg; i++) {
    const t0 = a0 + ((a1 - a0) * i) / seg, t1 = a0 + ((a1 - a0) * (i + 1)) / seg
    const n0: Vec = [Math.cos(t0), Math.sin(t0), 0], n1: Vec = [Math.cos(t1), Math.sin(t1), 0]
    const A: Vec = [cx + r * n0[0], cy + r * n0[1], z0], B: Vec = [cx + r * n1[0], cy + r * n1[1], z0]
    const C: Vec = [B[0], B[1], z1], D: Vec = [A[0], A[1], z1]
    p.tri(A, B, C, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n0])
    if (top) p.tri([cx, cy, z1], D, C)
  }
}

// --- Plan (OSM) and heights (lidar) ---
type Blk = { x0: number; x1: number; y0: number; y1: number; h: number }
const OFFICE: Blk[] = [
  { x0: -27.5, x1: 23.2, y0: -4, y1: 35.9, h: 68 },
  { x0: -27.5, x1: -10, y0: -10, y1: -4, h: 54 },
  { x0: -27.5, x1: 2.7, y0: -35, y1: -10, h: 41 },
  { x0: -7.1, x1: 8.8, y0: -43.7, y1: -35, h: 41 },
  { x0: 2.7, x1: 23.2, y0: -34.8, y1: -4, h: 54 },
]
const ATRIUM = { x0: -12, x1: 8, y0: -16.9, y1: 25, spring: 70 }

type Side = 'N' | 'E' | 'S' | 'W'
type Tower = { x0: number; x1: number; y0: number; y1: number; h: number; drum: Side; pods: Side; crane: boolean }
const TOWERS: Tower[] = [
  { x0: 2.2, x1: 16.9, y0: 35.9, y1: 48.5, h: 88, drum: 'N', pods: 'E', crane: true }, // north-east
  { x0: 23.2, x1: 33.8, y0: 2.2, y1: 12, h: 88, drum: 'E', pods: 'S', crane: true }, // east
  { x0: 23.2, x1: 33.6, y0: 12, y1: 21.3, h: 80, drum: 'N', pods: 'E', crane: false }, // east, second
  { x0: -38.5, x1: -27.5, y0: 8.5, y1: 21.5, h: 88, drum: 'W', pods: 'N', crane: true }, // west
  { x0: 8.8, x1: 23.6, y0: -47.5, y1: -34.8, h: 76, drum: 'S', pods: 'E', crane: true }, // south
  { x0: -22, x1: -12, y0: 35.9, y1: 43, h: 66, drum: 'N', pods: 'W', crane: false }, // north-west (lidar only)
]
const STOREY = 4.2
const SETBACK = 3 // the top storey of each gallery block steps back: the terraces
const OUT: Record<Side, [number, number]> = { N: [0, 1], S: [0, -1], E: [1, 0], W: [-1, 0] }

/** The height of whatever stands at a plan point (blocks below their terrace, towers). */
const covers = (pt: [number, number]): number => {
  let h = 0
  for (const b of OFFICE) if (pt[0] > b.x0 && pt[0] < b.x1 && pt[1] > b.y0 && pt[1] < b.y1) h = Math.max(h, b.h - STOREY)
  for (const t of TOWERS) if (pt[0] > t.x0 && pt[0] < t.x1 && pt[1] > t.y0 && pt[1] < t.y1) h = Math.max(h, t.h)
  return h
}

function build(detail: boolean) {
  const steel = new Part() // stainless: drums, pods, ducts, plant rooms, floor bands
  const concrete = new Part() // cores, columns, roofs
  const glazing = new Part() // the offices' dark glazing
  const vault = new Part() // atrium glass
  const blue = new Part() // crane gantries
  const ribs = new Part() // the atrium's white steel

  const BAND = detail ? STOREY : 2 * STOREY

  // --- Gallery blocks: dark glazing recessed behind columns and floor bands ---
  const officeWalls = (b: Blk, inset: number, z0: number, z1: number, cap: boolean) => {
    const x0 = b.x0 + inset, x1 = b.x1 - inset, y0 = b.y0 + inset, y1 = b.y1 - inset
    const c: Vec = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
    if (cap) concrete.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
    const edges: [number, number, number, number, number, number][] = [
      [x0, y0, x1, y0, 0, -1], [x1, y0, x1, y1, 1, 0], [x1, y1, x0, y1, 0, 1], [x0, y1, x0, y0, -1, 0],
    ]
    const R = 1.2 // the glazing's recess behind the frame line
    for (const [ax, ay, cx, cy, nx, ny] of edges) {
      const L = Math.hypot(cx - ax, cy - ay), n = Math.max(1, Math.round(L / 6))
      const runs: [number, number, number][] = [] // t0, t1, lowest visible z
      for (let k = 0; k < n; k++) {
        const t0 = k / n, t1 = (k + 1) / n
        const probe: [number, number] = [ax + ((cx - ax) * (t0 + t1)) / 2 + nx * 0.6, ay + ((cy - ay) * (t0 + t1)) / 2 + ny * 0.6]
        const zLo = Math.max(z0, Math.min(covers(probe), z1))
        if (zLo < z1 - 0.01) runs.push([t0, t1, zLo])
      }
      runs.forEach(([t0, t1, zLo], ri) => {
        const p0: [number, number] = [ax + (cx - ax) * t0 - nx * R, ay + (cy - ay) * t0 - ny * R]
        const p1: [number, number] = [ax + (cx - ax) * t1 - nx * R, ay + (cy - ay) * t1 - ny * R]
        quadOut(glazing, [[p0[0], p0[1], zLo], [p1[0], p1[1], zLo], [p1[0], p1[1], z1], [p0[0], p0[1], z1]], c)
        // a column at each run's start, from the frame line back to the glass
        const qx = ax + (cx - ax) * t0, qy = ay + (cy - ay) * t0, s = 0.6
        const bx0 = nx > 0 ? qx - R : nx < 0 ? qx : qx - s, bx1 = nx > 0 ? qx : nx < 0 ? qx + R : qx + s
        const by0 = ny > 0 ? qy - R : ny < 0 ? qy : qy - s, by1 = ny > 0 ? qy : ny < 0 ? qy + R : qy + s
        if (detail || inset === 0) box(concrete, bx0, bx1, by0, by1, zLo, z1 + 0.4)
      })
      // the closing column at the wall's far end
      if (runs.length && runs[runs.length - 1][1] === 1) {
        const zLo = runs[runs.length - 1][2], s = 0.6
        const bx0 = nx > 0 ? cx - R : nx < 0 ? cx : cx - s, bx1 = nx > 0 ? cx : nx < 0 ? cx + R : cx + s
        const by0 = ny > 0 ? cy - R : ny < 0 ? cy : cy - s, by1 = ny > 0 ? cy : ny < 0 ? cy + R : cy + s
        box(concrete, bx0, bx1, by0, by1, zLo, z1 + 0.4)
      }
      // floor bands over each visible stretch, from the glass out to the frame line
      for (let z = z0 + BAND; z < z1 - 0.8; z += BAND) {
        let s0 = -1, s1 = -1
        const flush = () => {
          if (s0 < 0) return
          const q0x = ax + (cx - ax) * s0, q0y = ay + (cy - ay) * s0, q1x = ax + (cx - ax) * s1, q1y = ay + (cy - ay) * s1
          const xa = Math.min(q0x, q1x), xb = Math.max(q0x, q1x), ya = Math.min(q0y, q1y), yb = Math.max(q0y, q1y)
          if (nx) box(steel, nx > 0 ? xa - R : xa - 0.2, nx > 0 ? xa + 0.2 : xa + R, ya, yb, z - 0.45, z + 0.45, detail)
          else box(steel, xa, xb, ny > 0 ? ya - R : ya - 0.2, ny > 0 ? ya + 0.2 : ya + R, z - 0.45, z + 0.45, detail)
          s0 = -1
        }
        for (const [t0, t1, zLo] of runs) {
          if (zLo < z - 0.45) { if (s0 < 0) s0 = t0; s1 = t1 } else flush()
        }
        flush()
      }
    }
  }
  for (const b of OFFICE) {
    officeWalls(b, 0, 0, b.h - STOREY, false)
    concrete.quad([b.x0, b.y0, b.h - STOREY], [b.x1, b.y0, b.h - STOREY], [b.x1, b.y1, b.h - STOREY], [b.x0, b.y1, b.h - STOREY])
    officeWalls(b, SETBACK, b.h - STOREY, b.h, true) // the top storey, stepped back: the terraces
  }

  // --- The atrium: a high barrel vault on a glazed, white-framed south end ---
  {
    const { x0, x1, y0, y1, spring } = ATRIUM
    const r = (x1 - x0) / 2, cx = (x0 + x1) / 2
    const c: Vec = [cx, (y0 + y1) / 2, spring]
    quadOut(vault, [[x0, y0, 37], [x1, y0, 37], [x1, y0, spring], [x0, y0, spring]], c)
    quadOut(vault, [[x0, y1, 64], [x1, y1, 64], [x1, y1, spring], [x0, y1, spring]], c)
    for (const x of [x0, x1]) {
      quadOut(vault, [[x, y0, 37], [x, -10, 37], [x, -10, spring], [x, y0, spring]], c)
      quadOut(vault, [[x, -10, 50], [x, -4, 50], [x, -4, spring], [x, -10, spring]], c)
      quadOut(vault, [[x, -4, 64], [x, y1, 64], [x, y1, spring], [x, -4, spring]], c)
    }
    const SEG = 12
    const arc = (i: number, y: number, rr = r): Vec => {
      const t = Math.PI - (Math.PI * i) / SEG
      return [cx + rr * Math.cos(t), y, spring + rr * Math.sin(t)]
    }
    for (let i = 0; i < SEG; i++) {
      const t0 = Math.PI - (Math.PI * i) / SEG, t1 = Math.PI - (Math.PI * (i + 1)) / SEG
      const n0: Vec = [Math.cos(t0), 0, Math.sin(t0)], n1: Vec = [Math.cos(t1), 0, Math.sin(t1)]
      const A = arc(i, y0), B = arc(i + 1, y0), C = arc(i + 1, y1), D = arc(i, y1)
      vault.tri(A, B, C, undefined, undefined, undefined, [n0, n1, n1])
      vault.tri(A, C, D, undefined, undefined, undefined, [n0, n1, n0])
      quadOut(vault, [[cx, y0, spring], arc(i, y0), arc(i + 1, y0), [cx, y0, spring]], [cx, y0 + 1, spring + 2])
      quadOut(vault, [[cx, y1, spring], arc(i, y1), arc(i + 1, y1), [cx, y1, spring]], [cx, y1 - 1, spring + 2])
    }
    // Ribs: bold white arches standing on the vault.
    const nR = 7
    for (let k = 0; k <= nR; k++) {
      const y = y0 + 0.5 + ((y1 - y0 - 1) * k) / nR
      for (let i = 0; i < SEG; i++) {
        const a = arc(i, y, r), b = arc(i + 1, y, r), a2 = arc(i, y, r + 0.9), b2 = arc(i + 1, y, r + 0.9)
        const w = 0.4
        quadOut(ribs, [[a[0], y - w, a[2]], [b[0], y - w, b[2]], [b2[0], y - w, b2[2]], [a2[0], y - w, a2[2]]], [cx, y, spring])
        quadOut(ribs, [[a[0], y + w, a[2]], [b[0], y + w, b[2]], [b2[0], y + w, b2[2]], [a2[0], y + w, a2[2]]], [cx, y, spring])
        quadOut(ribs, [[a2[0], y - w, a2[2]], [b2[0], y - w, b2[2]], [b2[0], y + w, b2[2]], [a2[0], y + w, a2[2]]], [cx, y, spring])
      }
    }
    // Fan-glazed ends: radial bars; and the south front's white frame below the fan.
    for (const [y, o] of [[y0, -1], [y1, 1]] as [number, number][]) {
      for (let i = 1; i < SEG; i++) {
        const e = arc(i, y), w = 0.25
        const dx = e[0] - cx, dz = e[2] - spring, l = Math.hypot(dx, dz), px = (-dz / l) * w, pz = (dx / l) * w
        const yy = y + o * 0.1
        quadOut(ribs, [[cx + px, yy, spring + pz], [e[0] + px, yy, e[2] + pz], [e[0] - px, yy, e[2] - pz], [cx - px, yy, spring - pz]], [cx, y - o, spring + 1])
      }
    }
    const nm = detail ? 8 : 4
    for (let k = 0; k <= nm; k++) {
      const x = x0 + ((x1 - x0) * k) / nm
      box(ribs, x - 0.3, x + 0.3, y0 - 0.5, y0 + 0.1, 37, spring + 0.3)
    }
    for (let z = 37 + 2 * STOREY; z < spring - 1; z += 2 * STOREY) box(ribs, x0, x1, y0 - 0.5, y0 + 0.1, z - 0.3, z + 0.3)
    box(ribs, x0 - 0.3, x1 + 0.3, y0 - 0.6, y0 + 0.2, spring - 0.4, spring + 0.6, true) // the springing beam
  }

  // --- Service towers ---
  for (const t of TOWERS) {
    const W = t.x1 - t.x0, D = t.y1 - t.y0
    let cx0 = t.x0, cx1 = t.x1, cy0 = t.y0, cy1 = t.y1
    const R = Math.min(5, (t.drum === 'N' || t.drum === 'S' ? W : D) * 0.34)
    const POD = 3.4
    const shrink = (side: Side, by: number) => {
      if (side === 'N') cy1 -= by
      if (side === 'S') cy0 += by
      if (side === 'E') cx1 -= by
      if (side === 'W') cx0 += by
    }
    shrink(t.drum, R)
    shrink(t.pods, POD)
    const PLANT = 7, top = t.h - PLANT
    box(concrete, cx0, cx1, cy0, cy1, 0, top) // the concrete core
    box(steel, t.x0 + 0.3, t.x1 - 0.3, t.y0 + 0.3, t.y1 - 0.3, top, t.h) // plant room
    for (let z = top + 1.6; z < t.h - 0.5; z += detail ? 1.8 : 2.8) box(concrete, t.x0 + 0.15, t.x1 - 0.15, t.y0 + 0.15, t.y1 - 0.15, z, z + 0.3)

    // Stair drum: a stainless half-cylinder banded every storey (two in the low model).
    {
      const [ox, oy] = OUT[t.drum]
      const along = t.drum === 'N' || t.drum === 'S'
      const ccx = along ? (t.pods === 'E' ? cx0 + R + 0.6 : t.pods === 'W' ? cx1 - R - 0.6 : (cx0 + cx1) / 2) : ox > 0 ? cx1 : cx0
      const ccy = along ? (oy > 0 ? cy1 : cy0) : t.pods === 'N' ? cy0 + R + 0.6 : t.pods === 'S' ? cy1 - R - 0.6 : (cy0 + cy1) / 2
      const a = Math.atan2(oy, ox), seg = detail ? 8 : 6
      for (let z = 0; z < top - 0.5; z += BAND) {
        const z1 = Math.min(top, z + BAND - 0.6)
        cylinder(steel, ccx, ccy, R, z + 0.6, z1, seg, a - Math.PI / 2, a + Math.PI / 2, true)
        if (detail) cylinder(concrete, ccx, ccy, R - 0.5, z, z + 0.6, seg, a - Math.PI / 2, a + Math.PI / 2, false)
      }
    }
    // Toilet pods: distinct stainless boxes stacked on the pod face.
    {
      const [ox, oy] = OUT[t.pods]
      const along = t.pods === 'N' || t.pods === 'S'
      const a0 = along ? cx0 + 0.6 : cy0 + 0.6, a1 = Math.min(along ? cx1 - 0.6 : cy1 - 0.6, a0 + 6)
      const step = detail ? STOREY : 2 * STOREY, hgt = detail ? 3.3 : 2 * STOREY - 1.0
      for (let z = 1; z + hgt < top; z += step) {
        if (along) {
          const y0 = oy > 0 ? cy1 : cy0 - POD + 0.2, y1 = oy > 0 ? cy1 + POD - 0.2 : cy0
          box(steel, a0, a1, y0, y1, z, z + hgt, detail)
        } else {
          const x0 = ox > 0 ? cx1 : cx0 - POD + 0.2, x1 = ox > 0 ? cx1 + POD - 0.2 : cx0
          box(steel, x0, x1, a0, a1, z, z + hgt, detail)
        }
      }
    }
    // Ducts: a bundle of stainless pipes, full height, standing in the pod strip beyond the
    // pods (toward the drum end), at the pods' depth so they read beside them.
    {
      const [ox, oy] = OUT[t.pods]
      const along = t.pods === 'N' || t.pods === 'S'
      const n = detail ? 5 : 4, seg = detail ? 10 : 6
      const radii = [0.95, 0.8, 0.7, 0.6, 0.55]
      const a1 = Math.min(along ? cx1 - 0.6 : cy1 - 0.6, (along ? cx0 : cy0) + 0.6 + 6)
      let at = a1 + 0.3
      for (let k = 0; k < n; k++) {
        const r = radii[k]
        at += r
        const depth = 1.6 + (k % 2) * 1.2 // staggered in and out, a bundle rather than a row
        const px = along ? at : ox > 0 ? cx1 + depth : cx0 - depth
        const py = along ? (oy > 0 ? cy1 + depth : cy0 - depth) : at
        cylinder(steel, px, py, r, 0, t.h + 1.5, seg)
        at += r + 0.25
      }
    }
    // Blue gantry crane: two legs and a boom over the plant room.
    if (t.crane) {
      const z0 = t.h, z1 = t.h + 6.5
      const long = W >= D
      const mx = (t.x0 + t.x1) / 2, my = (t.y0 + t.y1) / 2
      const half = (long ? W : D) / 2 - 1
      for (const s of [-1, 1]) {
        const lx = long ? mx + s * half * 0.7 : mx, ly = long ? my : my + s * half * 0.7
        box(blue, lx - 0.5, lx + 0.5, ly - 0.5, ly + 0.5, z0, z1 - 1)
      }
      if (long) box(blue, mx - half - 2, mx + half + 2, my - 0.8, my + 0.8, z1 - 1.2, z1, true)
      else box(blue, mx - 0.8, mx + 0.8, my - half - 2, my + half + 2, z1 - 1.2, z1, true)
    }
  }

  // Floodlit stainless at night: the towers' sides, brightest low down; roofs barely.
  const flood = (p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.15 : 0.9 - 0.4 * Math.min(1, p[2] / 90))
  return [
    { part: steel, material: { ...finish('stainless', 0xc9cfd4, 0.4), floodlight: flood } },
    { part: concrete, material: finish('concrete', 0x878985) },
    { part: glazing, material: PALETTE.window },
    { part: vault, material: PALETTE.glass },
    { part: blue, material: finish('crane-blue', 0x3f74b5) },
    { part: ribs, material: PALETTE.trim },
  ]
}

const REPLACES = ['way/23988892', 'way/310187362', 'way/310187363', 'way/310187364', 'way/310187365', 'way/310187366', 'way/310187367', 'way/310187370', 'way/445330146', 'way/445330148']
for (const [file, detail, maxTri, maxBytes] of [
  ['london-lloyds-building.glb', false, 6500, 256000],
  ['london-lloyds-building.detail.glb', true, 40000, 1536 * 1024],
] as [string, boolean, number, number][]) {
  const parts = build(detail)
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb("Lloyd's Building", parts, {
    license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 94.5,
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: REPLACES,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
