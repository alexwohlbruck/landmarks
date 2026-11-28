/**
 * Hayden Flour Mill silos ("Hayden Silos"), Tempe, Arizona (concrete
 * grain elevator of the Hayden Flour Mill, mid-20th century) — original
 * procedural geometry, CC0-1.0. They stand about 20 m east of the mill
 * (phx-hayden-flour-mill), at the foot of Tempe Butte, and don't touch it.
 * bun generators/phx-hayden-flour-mill-silos.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centroid of OSM way/544822358 (-111.9392606, 33.4288585). The model is
 * built in a frame turned to bearing 4.8, the long axis of the OSM outline.
 *
 * Identity (from the photos below):
 *  1. A long row of tall concrete bins, their round fronts reading as deep
 *     flutes down the long faces.                          (o1, lake, ht1)
 *  2. The taller head house at the south end with a few small windows near
 *     the top and the rusty elevator gear on its roof.    (o1, lake, ht1)
 *  3. The gallery along the top of the bins.                       (o1)
 *  4. Pale cream concrete.
 *
 * Plan: OSM way/544822358, 7.6 m by 40 m: two rows of seven bins 3.9 m
 * across (seven flutes per long face in o1, 27.3 m of bins) and the head
 * house at the south end, which the lidar shows about 9 m square, a little
 * wider than the bins. A small low block at the head house's south-west
 * foot (o1, lidar).
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m
 * grid, above the ground round the silos (358.55 m, flat within 0.5 m):
 * bins 35.0, the gallery 38.0, the head house 46.0, the elevator gear on
 * top to about 50; the low block 7. OSM's height tag (43) is in between.
 *
 * Estimated: the bin count across (two rows, from the 7.6 m width); the
 * head house's rounded corners (ht1, o1); the window sizes; the gear as a
 * plain block and mast.
 *
 * Photos (evidence, Wikimedia Commons):
 *  o1   "Hayden Flour Mill Tempe 01.jpg", Olaf2, CC BY-SA 4.0
 *       https://commons.wikimedia.org/wiki/File:Hayden_Flour_Mill_Tempe_01.jpg
 *  lake "231021-1 Hayden Flour Mill and Tempe Town Lake.jpg", Hunter Trick
 *       (TrickHunter), CC BY-SA 4.0
 *       https://commons.wikimedia.org/wiki/File:231021-1_Hayden_Flour_Mill_and_Tempe_Town_Lake.jpg
 *  ht1  "231029-1 Hayden Flour Mill.jpg", Hunter Trick (TrickHunter),
 *       CC BY-SA 4.0
 *       https://commons.wikimedia.org/wiki/File:231029-1_Hayden_Flour_Mill.jpg
 * No look-only sources. No commercial imagery. Elevation 0.
 * Night: unlit apart from the few head-house windows.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, prism, save, type XY } from './atl-flatiron-building'

const conc = new Part(), win = new Part(), rust = new Part()

function face(p: Part, q: V3[], want: V3) {
  const b = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], c = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
  const g = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}
/** A smooth vertical cylinder (open, no caps) of radius r about c, from z0 to z1, over angles a0..a1. */
function cyl(p: Part, c: XY, r: number, z0: number, z1: number, n: number, a0 = 0, a1 = 2 * Math.PI) {
  for (let i = 0; i < n; i++) {
    const t0 = a0 + ((a1 - a0) * i) / n, t1 = a0 + ((a1 - a0) * (i + 1)) / n
    const P = (t: number, z: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z], N = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
    p.tri(P(t0, z0), P(t1, z0), P(t1, z1), undefined, undefined, undefined, [N(t0), N(t1), N(t1)])
    p.tri(P(t0, z0), P(t1, z1), P(t0, z1), undefined, undefined, undefined, [N(t0), N(t1), N(t0)])
  }
}

const R = 1.95, BIN = 35.0, GAL = 38.0, HEAD = 46.0
const Y0 = -8.4, NB = 7 // the bins run north from y -8.4
// the core between the bins, then the outer half of each bin
prism(conc, ccw([[-R, Y0], [R, Y0], [R, Y0 + NB * 2 * R], [-R, Y0 + NB * 2 * R]]), 0, BIN, conc, 0)
for (let i = 0; i < NB; i++) {
  const y = Y0 + R + i * 2 * R
  cyl(conc, [R, y], R, 0, BIN, 8, -Math.PI / 2, Math.PI / 2) // east row, outer half
  cyl(conc, [-R, y], R, 0, BIN, 8, Math.PI / 2, (3 * Math.PI) / 2) // west row, outer half
  // their tops
  for (const [cx, a0] of [[R, -Math.PI / 2], [-R, Math.PI / 2]] as const) {
    for (let k = 0; k < 8; k++) {
      const t0 = a0 + (Math.PI * k) / 8, t1 = a0 + (Math.PI * (k + 1)) / 8
      face(conc, [[cx, y, BIN], [cx + R * Math.cos(t0), y + R * Math.sin(t0), BIN], [cx + R * Math.cos(t1), y + R * Math.sin(t1), BIN]], [0, 0, 1])
    }
  }
}
// the north end's two bins
for (const cx of [R, -R]) cyl(conc, [cx, Y0 + NB * 2 * R - R], R, 0, BIN, 4, 0, Math.PI)
// the gallery along the top
prism(conc, ccw([[-1.7, Y0 - 0.5], [1.7, Y0 - 0.5], [1.7, Y0 + NB * 2 * R - 0.4], [-1.7, Y0 + NB * 2 * R - 0.4]]), BIN, GAL, conc, 0.2)

// ── the head house: a 9 m tower with rounded corners at the south end ──
{
  const x0 = -4.5, x1 = 4.5, y0 = -20.6, y1 = Y0, rc = 2.2
  const ring: XY[] = []
  const corners: [number, number, number][] = [[x1 - rc, y0 + rc, -Math.PI / 2], [x1 - rc, y1 - rc, 0], [x0 + rc, y1 - rc, Math.PI / 2], [x0 + rc, y0 + rc, Math.PI]]
  for (const [cx, cy, a] of corners) for (let k = 0; k <= 3; k++) ring.push([cx + rc * Math.cos(a + (k / 3) * (Math.PI / 2)), cy + rc * Math.sin(a + (k / 3) * (Math.PI / 2))])
  prism(conc, ccw(ring), 0, HEAD, conc, 0.3)
  // small windows near the top on the east and south faces (o1, lake)
  for (const z of [HEAD - 10.5, HEAD - 7.5, HEAD - 4.5]) {
    for (const y of [-16.5, -13]) face(win, [[x1 + 0.05, y - 0.55, z], [x1 + 0.05, y + 0.55, z], [x1 + 0.05, y + 0.55, z + 1.3], [x1 + 0.05, y - 0.55, z + 1.3]], [1, 0, 0])
    for (const x of [-1.5, 1.5]) face(win, [[x - 0.55, y0 - 0.05, z], [x + 0.55, y0 - 0.05, z], [x + 0.55, y0 - 0.05, z + 1.3], [x - 0.55, y0 - 0.05, z + 1.3]], [0, -1, 0])
  }
  // the rusty elevator gear on the roof: a block and a mast
  prism(rust, ccw([[-1.6, -16.2], [1.6, -16.2], [1.6, -12.8], [-1.6, -12.8]]), HEAD, HEAD + 2.6, rust, 0.1)
  prism(rust, ccw([[-0.4, -15], [0.4, -15], [0.4, -14.2], [-0.4, -14.2]]), HEAD + 2.6, HEAD + 4.2, rust, 0.05)
}
// the low block at the head house's south-west foot
prism(conc, ccw([[-9, -19], [-4.5, -19], [-4.5, -12], [-9, -12]]), 0, 7, conc, 0.2)

await save('phx-hayden-flour-mill-silos', 'Hayden Flour Mill Silos', [
  { part: conc, material: { ...finish('hayden-silo', 0xeadfc8), floodlight: (_p, n) => (n[2] < 0.5 ? 0.3 : 0) } },
  { part: win, material: { ...PALETTE.window, color: 0x5f6870 } },
  { part: rust, material: finish('hayden-rust', 0x93603f) },
], { height: 50.2, anchor: [33.4288585, -111.9392606], bearing: 4.8 }, 5000)
