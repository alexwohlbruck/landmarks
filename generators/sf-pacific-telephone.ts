/**
 * Pacific Telephone Building (140 New Montgomery), San Francisco — original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-pacific-telephone.ts
 *
 * Frame: built turned to the SoMa grid, BEARING 44.7 (the outline's main
 * axis). x along New Montgomery Street (+x towards Mission Street), +y towards
 * the New Montgomery front, z up, metres. Origin = centroid of the OSM outline
 * way/80296766.
 *
 * Evidence
 * - OSM way/80296766 (an L: a 49 x 19 m front block on New Montgomery and a
 *   15 x 31 m back wing), parts 684195506 (26 levels) and 684195508 (one
 *   storey, in the yard). The outline sits ~1.5 m off the lidar; lidar wins.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m in the turned frame
 *   (/tmp/city/sf/work/fd/grid.py); y = 0 is the lowest ground (5.5 m NAVD88).
 *   The L rises to 78 m at its corners and 97 m elsewhere; a setback L inset
 *   3-4 m to 119 m; a central top block (12.5 x 13 m) to 131 m; the lantern
 *   on it reads 146-150 m in a 3 m patch, which the photos show is mostly the
 *   flagstaff: drawn as a 4 m lantern to 136.5 m with a cap to 140 m; a small
 *   plant room (lidar: scattered 133-141 m returns, off the axis and not seen
 *   in the front photos as a separate mass) drawn low, to 123 m, behind the
 *   parapet so the crown stays one central block; the core projects 3.6 m into the yard to 119 m;
 *   the one-storey yard building ~8 m.
 * - Published (Wikipedia, SF Landmark No. 239, NRHP): 1925, Miller & Pflueger
 *   with A. A. Cantin, 133 m, 26 floors, the city's first major art-deco
 *   tower, faced in pale terracotta with eagles along the parapets.
 * - Commons daylight photos: "140 New Montgomery from Salesforce Park.jpg"
 *   (Dead.rabbit, CC BY-SA 4.0, the back face and setbacks, from the
 *   south-east), "140 New Montgomery Street (PacBell Building) seen from
 *   Mission Street.jpg" (Joe Mabel, CC BY 4.0), "140 New Montgomery 2021.jpg"
 *   (Dead.rabbit, CC BY-SA 4.0), "140 New Montgomery.jpg" (Todd Freeman, CC
 *   BY-SA 4.0), "Pacific Telephone Building.jpg" (Jellicatx3, CC BY-SA 4.0).
 *
 * Estimated: storeys (~4.4 m), the window grouping (one panel per ~4.6 m bay,
 * a pair of windows between the main piers, in three-storey groups with
 * spandrel bands; piers 0.25 m proud), the parapet finials standing for the
 * eagles (2 m, every ~5 m), the 4 m corner chamfers that make the 78 m corner
 * steps, the lantern's pointed cap.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 44.7
const ANCHOR = { lng: -122.4000099, lat: 37.7866793 }
const terracotta = new Part(), windows = new Part(), roof = new Part(), trim = new Part()

type Box = { x0: number; x1: number; y0: number; y1: number; z: number; z0?: number; ch?: number; crown?: number }
const BASE = 0
const BOXES: Box[] = [
  { x0: -2, x1: 26, y0: -9, y1: -4, z: 8 }, // one-storey yard building
  { x0: -22.5, x1: 28.5, y0: -4, y1: 18.3, z: 78 }, // the L, to the corner steps
  { x0: -22.5, x1: -2, y0: -27.5, y1: -4, z: 78 },
  { x0: -22.5, x1: 28.5, y0: -4, y1: 18.3, z: 97, z0: 77.8, ch: 4, crown: 1.8 },
  { x0: -22.5, x1: -2, y0: -27.5, y1: 2, z: 97, z0: 77.8, ch: 4, crown: 1.8 },
  { x0: -18, x1: 25.5, y0: -4, y1: 15.5, z: 119, z0: 96.8, crown: 2.2 }, // the setback L
  { x0: -18, x1: -2, y0: -25.5, y1: -3.9, z: 119, z0: 96.8, crown: 2.2 },
  { x0: -1.5, x1: 11.5, y0: -7.5, y1: -3.9, z: 119, crown: 2.2 }, // the core's projection into the yard
  { x0: -1, x1: 11.5, y0: -7.5, y1: 5.5, z: 131, z0: 118.8, crown: 2.2 }, // top block
  { x0: 13, x1: 19.5, y0: -5.5, y1: -0.5, z: 123, z0: 118.8 }, // plant room, kept low behind the parapet
]
/** Inside some box at least as tall as z: a panel there would never be seen. */
const buried = (x: number, y: number, z: number) =>
  BOXES.some((b) => x > b.x0 + 0.05 && x < b.x1 - 0.05 && y > b.y0 + 0.05 && y < b.y1 - 0.05 && z < b.z)

/** A box with chamfered vertical edges and a flat roof. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.4, top: Part | null = roof) {
  const r: [number, number][] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}

// Window rows on one grid for every block: the lobby, then three-storey groups.
const STOREY = 4.4
function rowsFor(top: number, crown: boolean): { z0: number; z1: number; arch: boolean }[] {
  const rows = [{ z0: 1.5, z1: 6.5, arch: false }]
  for (let z = 8.5; z + 3 * STOREY <= top + 0.01; z += 3 * STOREY) rows.push({ z0: z + 1.2, z1: z + 3 * STOREY - 1.2, arch: false })
  const lastRow = rows[rows.length - 1]
  if (crown && top - 1.5 - lastRow.z1 > 4) rows.push({ z0: lastRow.z1 + 2.4, z1: top - 2, arch: true })
  return rows
}
/** Panels along the wall a→b (outward to the right), on every bay not buried in a taller block. */
function facade(a: [number, number], b: [number, number], bottom: number, top: number, crown: boolean) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  const n = Math.max(1, Math.round((L - 1.6) / 4.6)), w = (L - 1.6) / n
  const P = (s: number, z: number): V3 => [a[0] + ux * s + nx * 0.05, a[1] + uy * s + ny * 0.05, z]
  for (let k = 0; k < n; k++) {
    const s0 = 0.8 + w * k + 0.8, s1 = 0.8 + w * (k + 1) - 0.8, sm = (s0 + s1) / 2
    for (const r of rowsFor(top, crown)) {
      const z0 = Math.max(r.z0, bottom + 1.2), z1 = Math.min(r.z1, top - 1.6)
      if (z1 - z0 < 2.5) continue
      if (buried(a[0] + ux * sm + nx * 0.4, a[1] + uy * sm + ny * 0.4, z1)) continue
      if (!r.arch) { windows.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)); continue }
      // a round-headed gothic opening: rectangle plus a semicircle, flush
      const rad = (s1 - s0) / 2, spring = r.z1 - rad
      windows.quad(P(s0, r.z0), P(s1, r.z0), P(s1, spring), P(s0, spring))
      for (let i = 0; i < 8; i++) {
        const t0 = (Math.PI * i) / 8, t1 = (Math.PI * (i + 1)) / 8
        windows.tri(P(sm, spring), P(sm + rad * Math.cos(t0), spring + rad * Math.sin(t0)), P(sm + rad * Math.cos(t1), spring + rad * Math.sin(t1)))
      }
    }
  }
  // the main piers between bays, slightly proud, from the base to the crown
  if (bottom > 0) for (let k = 1; k < n; k++) {
    const sm = 0.8 + w * k
    if (buried(a[0] + ux * sm + nx * 0.4, a[1] + uy * sm + ny * 0.4, bottom + 1)) continue
    const Q = (s: number, o: number, z: number): V3 => [a[0] + ux * s + nx * o, a[1] + uy * s + ny * o, z]
    const z0 = bottom + 0.2, z1 = top - 1.2, h = 0.45
    terracotta.quad(Q(sm - h, 0.25, z0), Q(sm + h, 0.25, z0), Q(sm + h, 0.25, z1), Q(sm - h, 0.25, z1))
    terracotta.quad(Q(sm - h, 0, z0), Q(sm - h, 0.25, z0), Q(sm - h, 0.25, z1), Q(sm - h, 0, z1))
    terracotta.quad(Q(sm + h, 0.25, z0), Q(sm + h, 0, z0), Q(sm + h, 0, z1), Q(sm + h, 0.25, z1))
  }
}

for (const b of BOXES) {
  const z0 = b.z0 ?? 0, ch = b.ch ?? 0.4
  block(terracotta, b.x0, b.x1, b.y0, b.y1, z0, b.z, ch, roof)
  const corners: [number, number][] = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]]
  for (let i = 0; i < 4; i++) {
    // the straight run of each face, between its corner chamfers
    const [ax, ay] = corners[i], [bx, by] = corners[(i + 1) % 4], L = Math.hypot(bx - ax, by - ay)
    const t = ch > 1 ? ch / L : 0
    facade([ax + (bx - ax) * t, ay + (by - ay) * t], [bx - (bx - ax) * t, by - (by - ay) * t], z0, b.z, !!b.crown)
  }
  if (!b.crown) continue
  // Crown: a pale cornice band and pinnacles
  // at the corners and every few bays along each face.
  block(trim, b.x0 - 0.3, b.x1 + 0.3, b.y0 - 0.3, b.y1 + 0.3, b.z - 1.2, b.z - 0.4, ch + 0.1, null)
  const pin = (x: number, y: number, s: number) => {
    block(trim, x - s, x + s, y - s, y + s, b.z - 0.4, b.z + b.crown!, 0.2, trim)
  }
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = corners[i], [bx, by] = corners[(i + 1) % 4]
    const L = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(L / 5))
    for (let k = 0; k < n; k++) {
      const t = ch > 1 ? (ch + (k * (L - 2 * ch)) / n) / L : k / n, x0 = ax + (bx - ax) * t, y0 = ay + (by - ay) * t
      const x = x0 + Math.sign((b.x0 + b.x1) / 2 - x0) * 0.55, y = y0 + Math.sign((b.y0 + b.y1) / 2 - y0) * 0.55
      if (buried(x, y, b.z + 1)) continue // only where the parapet is open to the sky
      pin(x, y, k === 0 && ch <= 1 ? 0.6 : 0.4)
    }
  }
}
// The lantern on the top block, with a pointed cap (the flagstaff left out).
{
  const x = 4, y = 0
  block(terracotta, x - 2, x + 2, y - 2, y + 2, 130.8, 136.5, 0.3, trim)
  const tip: V3 = [x, y, 140]
  const sq: V3[] = [[x - 1.7, y - 1.7, 136.5], [x + 1.7, y - 1.7, 136.5], [x + 1.7, y + 1.7, 136.5], [x - 1.7, y + 1.7, 136.5]]
  for (let i = 0; i < 4; i++) trim.tri(sq[i], sq[(i + 1) % 4], tip)
}

const parts = [
  { part: terracotta, material: finish('pale-terracotta', 0xe9e6de) },
  { part: trim, material: PALETTE.trim },
  { part: windows, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pacific Telephone Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 140,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/80296766', 'way/684195506', 'way/684195508'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-pacific-telephone.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
