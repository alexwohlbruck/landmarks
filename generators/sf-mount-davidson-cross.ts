/**
 * Mount Davidson Cross, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-mount-davidson-cross.ts
 *
 * Map frame: x east, y north, z up, metres, no rotation (bearing 0): the
 * arms run north-south, the faces look east and west. Origin = the centre of
 * the shaft (lidar; 2.0 m east of the OSM node/633021134), on the ground
 * round the summit platform (283.0 m NAVD88). Only the cross and its stepped
 * platform: the eucalyptus and cypress round it are the map's.
 *
 * Evidence
 * - OSM node/633021134 (man_made=cross); no building, so `replaces` is empty.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023, 0.5 m), above 283.0 m:
 *   the platform 1.0 m, about 12.5 x 16 m; the shaft 3 x 3 m in plan, top
 *   31.6 (30.6 above the platform); the arms along north-south, 11.5 m
 *   across, 3 m thick, top 25.5. The trees round it reach 17-21 m.
 * - Published (Wikipedia "Mount Davidson (California)"): 103 ft (31.4 m)
 *   concrete cross, 1934, the highest point in San Francisco.
 * - Commons daylight photos: "Mount Davidson Cross (4426560750).jpg" and
 *   "(4426561302).jpg" (Daniel Ramirez, CC BY 2.0; face on from the path:
 *   arm span 12.0 m and depth 3.5 m when scaled by the lidar height, shaft
 *   2.6 m, the low stepped platform with a block at each end); "Mount
 *   Davidson cross.jpg" (Troymccluresf, CC BY-SA 3.0); "That Sf Cross
 *   (53453432).jpeg" (Erik Hansen, CC BY 3.0; the arms from below);
 *   "Cross on Mount Davidson on a gray day in San Francisco.png" (Tim Adams,
 *   CC BY 3.0).
 *
 * Colour: pale grey board-marked concrete, a shade warmer on the platform.
 * Estimated: the platform's three steps and end blocks, the arm depth (3.5 m,
 *   photo), the shallow panels on the shaft and arms (the faint relief seen in
 *   the photos, drawn as frames standing 6 cm proud), the 0.25 m chamfers.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const ANCHOR = { lng: -122.4547473, lat: 37.7383418 }
const concrete = new Part(), platform = new Part()

/** A box with chamfered vertical and top edges (c), bottom left open. */
function cbox(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.25, bottom = false) {
  // an octagon: the rectangle with its vertical edges cut by c, drawn d in
  // from the walls; the top ring is drawn 0.7c in, so the top edges bevel too
  const ring = (d: number, z: number): V3[] => [
    [x0 + c, y0 + d, z], [x1 - c, y0 + d, z], [x1 - d, y0 + c, z], [x1 - d, y1 - c, z],
    [x1 - c, y1 - d, z], [x0 + c, y1 - d, z], [x0 + d, y1 - c, z], [x0 + d, y0 + c, z],
  ]
  const A = ring(0, z0), B = ring(0, z1 - c * 0.7), T = ring(c * 0.7, z1)
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    part.quad(A[i], A[j], B[j], B[i])
    part.quad(B[i], B[j], T[j], T[i])
  }
  for (let i = 1; i < 7; i++) part.tri(T[0], T[i], T[i + 1])
  if (bottom) for (let i = 1; i < 7; i++) part.tri(A[0], A[i + 1], A[i])
}
/** A faint panel on a vertical face (`plane` = the face's distance from the axis). */
function panel(part: Part, face: 'e' | 'w' | 'n' | 's', plane: number, a0: number, a1: number, z0: number, z1: number, d = 0.06) {
  // drawn as a slightly proud frame (4 thin strips), which catches the light
  const w = 0.18
  const P = (a: number, z: number, off: number): V3 => {
    if (face === 'e') return [plane + off, a, z]
    if (face === 'w') return [-plane - off, -a, z]
    if (face === 'n') return [-a, plane + off, z]
    return [a, -plane - off, z]
  }
  const strip = (s0: number, s1: number, t0: number, t1: number) => {
    part.quad(P(s0, t0, d), P(s1, t0, d), P(s1, t1, d), P(s0, t1, d))
    part.quad(P(s0, t0, 0), P(s1, t0, 0), P(s1, t0, d), P(s0, t0, d))
    part.quad(P(s1, t1, 0), P(s0, t1, 0), P(s0, t1, d), P(s1, t1, d))
  }
  strip(a0, a1, z0, z0 + w)
  strip(a0, a1, z1 - w, z1)
  strip(a0, a0 + w, z0 + w, z1 - w)
  strip(a1 - w, a1, z0 + w, z1 - w)
}

// Platform: three steps up to 1.0 m, with a block at each end of the top step.
const P0 = 1.0
cbox(platform, -6.4, 6.4, -8.0, 8.0, 0, P0 * 0.34, 0.1)
cbox(platform, -5.8, 5.8, -7.4, 7.4, 0, P0 * 0.67, 0.1)
cbox(platform, -5.2, 5.2, -6.8, 6.8, 0, P0, 0.1)
for (const y of [-6.2, 6.2]) cbox(platform, -1.0, 1.0, y - 0.6, y + 0.6, P0, P0 + 1.1, 0.12)
// Cross: shaft 3 x 3 m to 31.6, arms 11.5 m across (north-south), 3.5 m deep, top 25.5.
const H = 31.6, HS = 1.5, ARM_TOP = 25.5, ARM_D = 3.5, SPAN = 5.75
cbox(concrete, -HS, HS, -HS, HS, P0, H, 0.25)
cbox(concrete, -HS, HS, -SPAN, -HS + 0.01, ARM_TOP - ARM_D, ARM_TOP, 0.25, true)
cbox(concrete, -HS, HS, HS - 0.01, SPAN, ARM_TOP - ARM_D, ARM_TOP, 0.25, true)
// Faint panels on the east and west faces of the shaft and arms.
for (const f of ['e', 'w'] as const) {
  panel(concrete, f, HS, -0.9, 0.9, P0 + 2.4, ARM_TOP - ARM_D - 0.8)
  panel(concrete, f, HS, -0.9, 0.9, ARM_TOP + 0.8, H - 0.8)
  panel(concrete, f, HS, -SPAN + 0.6, -HS - 0.4, ARM_TOP - ARM_D + 0.6, ARM_TOP - 0.6)
  panel(concrete, f, HS, HS + 0.4, SPAN - 0.6, ARM_TOP - ARM_D + 0.6, ARM_TOP - 0.6)
}

const parts = [
  { part: concrete, material: finish('cross-concrete', 0xdddbd4) },
  { part: platform, material: finish('platform-concrete', 0xd2cec5) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
for (const { part, material } of parts) console.log(`  ${material.name}: ${part.triangles}`)
const glb = writeGlb('Mount Davidson Cross', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: [],
})
const out = new URL('../models/sf-mount-davidson-cross.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
