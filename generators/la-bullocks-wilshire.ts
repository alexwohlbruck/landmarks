/**
 * Bullocks Wilshire (John and Donald Parkinson, 1929), 3050 Wilshire Blvd,
 * Los Angeles; now Southwestern Law School — original procedural geometry,
 * CC0-1.0.
 * bun generators/la-bullocks-wilshire.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * OSM way/427824132 (-118.2887936, 34.0615227) on the lowest ground under it
 * (lidar 78.8 m at the south-west; Wilshire's kerb is ~1.5 m higher).
 * Bearing 0: the building is square to the grid (its Wilshire face runs
 * within a degree of east–west).
 *
 * Art deco department store in buff terracotta: low wings along Wilshire
 * stepping up to a 30 m central mass, and the 241 ft tower on the Wilshire
 * face with its patina-green copper crown. Tall window bays between broad
 * piers, each topped by a green spandrel panel; the motor court and
 * porte-cochère at the back.
 *
 * Sources:
 * - Plan: OSM way/427824132 (4,344 m2; height "74.3;241 ft") and its tower
 *   part way/490392556 (8.8 × 8.8 m).
 * - Heights: LA County lidar DSM (LARIAC, 2 m grid, sampled 2026), above the
 *   lowest ground: west wing 15–18 m, middle front wing 20 m, central mass
 *   30 m with a 35 m rear range and a 41 m rear stair tower, east wing
 *   20–25 m, porte-cochère 11 m, tower shaft 62 m, crown peak 74–75 m
 *   (published 241 ft = 73.5 m).
 * - Photos (Wikimedia Commons, all CC BY-SA 3.0 unless noted): b1
 *   "Bullocks Wilshire.jpg" (Antoine Taveneaux; tower and Wilshire face from
 *   the north-east); b2–b5 "Bullocks Wilshire Bldg. 2/5/4/7" (MikeJiroch;
 *   the Wilshire face, bays with green spandrels, the tower's slot); b6
 *   "Bullocks Wilshire Building" (Craig Baker, CC BY-SA 4.0; from the
 *   north-west); b7 "Bullocks Wilshire, rear" (Jrkagan, public domain; from
 *   the south across the motor court); b8 "Bullocks Wilshire (2423581128)"
 *   (maria rachelle, CC BY 2.0; the copper crown).
 *
 * Estimated: block outlines (rectangles fitted to the DSM at 2 m), the bays
 * (5.2 m, one tall window panel per bay spanning two to three floors, a
 * green spandrel panel above each), the crown's steps (b8). Left out: the
 * fluted piers and the reliefs, the black plinth, the canopies, signage.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, block, panel, at, type XY } from './la-lacma-geffen'

const terra = new Part(), green = new Part(), win = new Part(), roof = new Part()

type Faces = { n?: boolean; s?: boolean; e?: boolean; w?: boolean }
/**
 * A rectangular mass u0…u1 × v0…v1 to z1 with window bays on the listed
 * faces: tall panels from zLo up, `rows` tiers, each capped by a green
 * spandrel (b3, b4).
 */
function mass(u0: number, u1: number, v0: number, v1: number, z1: number, faces: Faces = {}, zLo = 4.5, rows = 1, bay = 5.2) {
  const R: XY[] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  block(terra, roof, R, 0, z1, 0.45)
  const edges: [keyof Faces, XY, XY][] = [['s', R[0], R[1]], ['e', R[1], R[2]], ['n', R[2], R[3]], ['w', R[3], R[0]]]
  for (const [f, a, b] of edges) {
    if (!faces[f]) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nb = Math.floor((L - 2) / bay)
    if (nb < 1) continue
    const m = (L - nb * bay) / 2, top = z1 - 2.4, h = (top - zLo) / rows
    for (let k = 0; k < nb; k++) {
      const s0 = m + k * bay + 0.95, s1 = m + (k + 1) * bay - 0.95
      for (let r = 0; r < rows; r++) {
        const z0 = zLo + r * h, zt = z0 + h - 1.6
        panel(win, a, b, s0, s1, z0, zt)
        panel(green, a, b, s0, s1, zt + 0.2, zt + 1.3, 0.06)
      }
    }
  }
}

// ---------- the masses (DSM) ----------
mass(-17, -10, -32, 14, 15.5, { n: true, w: true, s: true })            // west end
mass(-10, 18, -14, 14, 18, { n: true, w: false })                       // west front wing
mass(-10, 18, -32, -14, 15.5, { s: true })                              // west rear
mass(18, 30, -12, 14, 20.5, { n: true })                                // middle front wing
mass(30, 60, -18, 14, 30, { n: true, e: false }, 4.5, 2)                // central mass
mass(18, 30, -32, -12, 30, { s: true }, 4.5, 2)                         // rear of the centre
mass(30, 60, -32, -18, 35, { s: true }, 4.5, 2)                         // rear range
mass(36, 44, -27, -18, 41)                                              // rear stair tower
mass(60, 74, 4, 14, 20.5, { n: true, e: true })                         // east front wing
mass(60, 74, -32, 4, 25.5, { e: true, s: true }, 4.5, 2)                // east wing
mass(37, 59, -42, -32, 11, { s: true, e: true, w: true }, 1.0)          // porte-cochère

// ---------- the tower ----------
// Shaft 8.8 m square on the Wilshire face to 58 m; corner piers step in to
// 62 m; the copper crown in three stepped stages to a short spire at 74.5 m
// (DSM: shaft 62–64, peak 74–75; b1, b8).
{
  const cx = 47.6, cy = 10.3, h = 4.4, SHAFT = 58
  const sq = (r: number): XY[] => [[cx - r, cy - r], [cx + r, cy - r], [cx + r, cy + r], [cx - r, cy + r]]
  block(terra, roof, sq(h), 0, SHAFT, 0.4)
  // the window slot on each face: tall panels with green spandrels (b1, b5)
  const S = sq(h)
  for (let i = 0; i < 4; i++) {
    const a = S[i], b = S[(i + 1) % 4]
    for (let z = 32; z < SHAFT - 4; z += 6.5) {
      panel(win, a, b, h - 1.3, h + 1.3, z, z + 4.6)
      panel(green, a, b, h - 1.3, h + 1.3, z + 4.8, z + 6.1, 0.06)
    }
  }
  // stepped corner piers above the shaft (terracotta) round a green core
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = cx + sx * (h - 1.1), py = cy + sy * (h - 1.1)
    block(terra, terra, [[px - 1.1, py - 1.1], [px + 1.1, py - 1.1], [px + 1.1, py + 1.1], [px - 1.1, py + 1.1]], SHAFT, 63, 0.3)
  }
  block(green, green, sq(3.4), SHAFT, 64.5, 0.3)
  block(green, green, sq(2.7), 64.5, 68.5, 0.3)
  block(green, green, sq(1.9), 68.5, 71.5, 0.3)
  // the spire: a four-sided point
  const top = [cx, cy, 74.5] as [number, number, number]
  const B = sq(1.3)
  for (let i = 0; i < 4; i++) {
    const a = B[i], b = B[(i + 1) % 4]
    green.tri(at(a, 71.5), at(b, 71.5), top)
  }
}

const parts = [
  { part: terra, material: finish('bullocks-terracotta', 0xe8d2aa) },
  { part: green, material: PALETTE.patina },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
if (import.meta.main) {
  const { glb, triangles } = finishModel('la-bullocks-wilshire', 'Bullocks Wilshire', parts, {
    bearing: 0, height: 74.5, replaces: ['way/427824132', 'way/490392556'],
  })
  const out = process.argv[2] ?? new URL('../models/la-bullocks-wilshire.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
