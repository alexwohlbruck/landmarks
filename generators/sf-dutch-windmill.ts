/**
 * Dutch Windmill (North Windmill), Golden Gate Park, San Francisco —
 * original procedural geometry, CC0-1.0.
 * bun generators/sf-dutch-windmill.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin = centroid of
 * the OSM outline way/287921407 (the gallery's circle, r ~9 m), on the
 * lowest ground under it.
 *
 * Evidence
 * - OSM way/287921407 (building, height 13), a 9 m circle: the stage
 *   (gallery) round the tower.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023): ground at the foot 8.25 m
 *   NAVD88 (y = 0; the mound rises to 9.5 m on the south); gallery deck
 *   17.1 m (+8.85); cap crown 34.7 m (+26.45), the cap r ~3.4 m, its curb
 *   ~+22.5; the sails face west, their plane ~4 m west of the tower's axis,
 *   hub ~+24.6, a sail reaching 47.6 m (+39.3) and the other pair spanning
 *   31 m; the fantail east of the cap, its wheel's top +28.1 at 6-9 m east.
 * - Published (SF Rec & Park; Wikipedia "Dutch Windmill"): 1903, 75 ft
 *   smock mill, sails 102 ft (31 m) tip to tip; restored 1981 and 2002.
 * - Commons daylight photos: "Dutch Windmill Golden Gate Park.jpg" (Kaldari,
 *   CC0); "Golden Gate Park North Dutch Windmill.jpg" (Harry Cutts, CC BY-SA
 *   4.0); "Golden Gate Park - Dutch Windmill - March 2018 (1792).jpg" and
 *   "(1777).jpg" (Gregory Varnum, CC BY-SA 4.0); "Historic Dutch windmill in
 *   Golden Gate Park, San Francisco.jpg" (Wouter Kiel, CC BY 2.0).
 *
 * Estimated from the photos, scaled by the lidar: the concrete base's taper
 * (r 5.1 to 4.4), the shingled tower's (r 4.2 to 3.05), the cap's onion
 * profile, the gallery braces, sail widths (lattice 2.3 m, leading board
 * 0.6 m) and the fantail's size. The tower is drawn round, as the photos
 * show the shingles, not octagonal. The gallery railing is too thin to draw.
 * The weathered timber reads grey-brown in the photos and is pulled to the
 * palette's lightness; the copper cap is bronze with a green cast.
 *
 * The sails are their own node, pivoting at the hub on a horizontal
 * east-west axis, so they can turn (STYLE.md "Animation"). It ships static,
 * in the X pose most photos show.
 */
import { Part, writeGlb, type NodeSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { beam, lathe, ngon, prism, report, flat } from './sf-de-young'

const ANCHOR = { lng: -122.50940580, lat: 37.77044089 }
const shingle = new Part(), concrete = new Part(), cap = new Part(), wood = new Part(), win = new Part()
const sailWood = new Part()

// --- heights above y = 0 (8.25 m NAVD88) ---
const GALLERY = 8.85, TOWER_TOP = 22.4, CURB = 22.9, CROWN = 26.45
const HUB: V3 = [-4.0, 0, 24.6]
const R_SAIL = 15.2

// concrete base: a cone from the ground to the gallery
lathe(concrete, [[5.1, 0], [4.45, GALLERY - 0.5]], 20, [0, 0], 0, true)
// gallery: a timber disc with a fascia
prism(wood, ngon(0, 0, 9.0, 24), GALLERY - 0.55, GALLERY, wood, 0.15, true)
// braces under the gallery, from the base to the deck's edge
for (let i = 0; i < 10; i++) {
  const t = (2 * Math.PI * (i + 0.5)) / 10
  beam(wood, [4.85 * Math.cos(t), 4.85 * Math.sin(t), 3.4], [8.0 * Math.cos(t), 8.0 * Math.sin(t), GALLERY - 0.55], 0.3)
}
// shingled tower, tapering, with a slight swell
const TOWER: [number, number][] = [[4.25, GALLERY - 0.6], [4.15, GALLERY + 3], [3.75, 16], [3.3, 20.5], [3.05, TOWER_TOP]]
const rAt = (z: number) => { for (let i = 0; i + 1 < TOWER.length; i++) { const [r0, z0] = TOWER[i], [r1, z1] = TOWER[i + 1]; if (z <= z1) return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0) } return TOWER[TOWER.length - 1][0] }
lathe(shingle, TOWER, 20, [0, 0], 0, true)
// the curb under the cap, then the cap: an onion of copper scales
lathe(wood, [[3.05, TOWER_TOP - 0.05], [3.55, TOWER_TOP + 0.05], [3.55, CURB], [3.4, CURB + 0.05]], 20)
lathe(cap, [[3.4, CURB], [3.6, CURB + 0.7], [3.55, CURB + 1.5], [3.15, CURB + 2.4], [2.3, CURB + 3.05], [1.1, CROWN - 0.1], [0, CROWN]], 20)
flat(wood, ngon(0, 0, 3.55, 20), TOWER_TOP - 0.05, false)

// windshaft stub from the cap to the hub
beam(wood, [-2.6, 0, HUB[2]], [HUB[0] + 0.3, 0, HUB[2]], 0.7)

// fantail: a frame running back east from the cap, the wheel on it
{
  const z = CURB - 0.3
  beam(wood, [2.6, -0.9, z], [7.6, -0.9, z], 0.4)
  beam(wood, [2.6, 0.9, z], [7.6, 0.9, z], 0.4)
  prism(wood, [[5.6, -1.1], [7.8, -1.1], [7.8, 1.1], [5.6, 1.1]], z, z + 0.3, wood, 0, true)
  beam(wood, [7.4, 0, z + 0.3], [6.6, 0, 26.2], 0.3)
  beam(wood, [3.4, 0, z], [6.4, 0, 26.0], 0.3)
  // the rosette wheel: a disc in the x-z plane, axis north-south
  const C: V3 = [6.6, 0, 26.2], R = 1.9, n = 12
  for (const side of [-0.12, 0.12]) {
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      const P = (a: number, r: number): V3 => [C[0] + r * Math.cos(a), C[1] + side, C[2] + r * Math.sin(a)]
      if (side > 0) wood.tri(P(0, 0), P(a0, R), P(a1, R))
      else wood.tri(P(0, 0), P(a1, R), P(a0, R))
    }
  }
}

// small louvred windows up the tower (south and north), a door and portholes in the base
for (const t of [-Math.PI / 2, Math.PI / 2]) {
  for (const z of [11.5, 15.5, 19.2]) {
    const s: V3 = [-Math.sin(t), Math.cos(t), 0]
    const P = (u: number, zz: number): V3 => { const r = rAt(zz) + 0.05; return [r * Math.cos(t) + s[0] * u, r * Math.sin(t) + s[1] * u, zz] }
    win.quad(P(-0.25, z), P(0.25, z), P(0.25, z + 0.9), P(-0.25, z + 0.9))
  }
}
{
  // the door on the south side of the base
  const t = -Math.PI / 2, r = 5.05
  const s: V3 = [-Math.sin(t), Math.cos(t), 0]
  const P = (u: number, z: number): V3 => [(r - (z * 0.65) / (GALLERY - 0.5) + 0.04) * Math.cos(t) + s[0] * u, (r - (z * 0.65) / (GALLERY - 0.5) + 0.04) * Math.sin(t) + s[1] * u, z]
  win.quad(P(-0.6, 0.6), P(0.6, 0.6), P(0.6, 2.8), P(-0.6, 2.8))
}

// --- The sails: their own node at the hub. Authored about the hub, in the
// y-z plane (the sails face west). Pose: an X, 30 degrees off vertical.
const sailParts = [{ part: sailWood, material: finish('windmill-sail', 0xc4baa9) }]
for (let k = 0; k < 4; k++) {
  const a = Math.PI / 2 - Math.PI / 6 + (k * Math.PI) / 2 // direction of this sail in the (y, z) plane
  const d: V3 = [0, Math.cos(a), Math.sin(a)], s: V3 = [0, -Math.sin(a), Math.cos(a)] // along, and across (turning side)
  const P = (along: number, across: number, x = 0): V3 => [x, d[1] * along + s[1] * across, d[2] * along + s[2] * across]
  // the whip (stock), a beam from the hub to the tip
  beam(sailWood, P(-0.6, 0), P(R_SAIL, 0), 0.45, 0.45, [1, 0, 0])
  // the lattice drawn as a broad panel on the trailing side, a narrow board on the leading side
  for (const [w0, w1] of [[0.3, 2.6], [-0.9, -0.3]] as [number, number][]) {
    const r0 = 3.4, r1 = R_SAIL - 0.2, x0 = -0.08, x1 = 0.08
    const q = [P(r0, w0, x0), P(r1, w0, x0), P(r1, w1, x0), P(r0, w1, x0)]
    const h = [P(r0, w0, x1), P(r1, w0, x1), P(r1, w1, x1), P(r0, w1, x1)]
    // both faces and the rim
    sailWood.quad(q[0], q[1], q[2], q[3]); sailWood.quad(h[3], h[2], h[1], h[0])
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; sailWood.quad(q[j], q[i], h[i], h[j]) }
  }
}
// the hub boss
beam(sailWood, [-0.5, 0, 0], [0.4, 0, 0], 1.1, 1.1, [0, 0, 1])

const parts = [
  { part: shingle, material: finish('windmill-shingle', 0x9f9487) },
  { part: concrete, material: finish('windmill-concrete', 0xb8afa2) },
  { part: cap, material: finish('windmill-cap', 0x968c6c) },
  { part: wood, material: finish('windmill-timber', 0x8f8376) },
  { part: win, material: PALETTE.window },
]
const nodes: NodeSpec[] = [{ name: 'sails', translation: HUB, parts: sailParts }]
const glb = writeGlb('Dutch Windmill', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: HUB[2] + R_SAIL,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/287921407'],
}, { nodes })
const tris = report('Dutch Windmill', [...parts, ...sailParts], glb)
const out = new URL('../models/sf-dutch-windmill.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
