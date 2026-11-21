/**
 * Winged Figures of the Republic, the Monument of Dedication at Hoover Dam
 * (Oskar J. W. Hansen, 1935), on the Nevada side above the dam.
 * Procedural, CC0-1.0. bun generators/lv-winged-figures-of-the-republic.ts
 *
 * What it is: two seated bronze figures, arms raised, each with a pair of
 * tall upswept wings meeting in a V over its head, on the two ends of a low
 * black diorite base at the foot of the canyon wall. The base is a shallow V
 * open to the plaza: a taller central pedestal carrying the flagpole, wing
 * walls swept forward to the two figure plinths, the figures turned a little
 * toward each other.
 *
 * Map frame: x across the monument (toward the east figure), y back toward
 * the canyon wall, z up, metres. Origin: the central (flagpole) pedestal at
 * -114.739049, 36.016669; bearing 338.6, so the monument faces 158.6 (SSE)
 * across the plaza. y = 0 is the plaza, 377 m NAVD88. elevation 0.
 *
 * Sources
 * - OSM node/3357670472 and node/3357670473 (tourism=artwork, the two
 *   figures, 9.6 m apart), node/3357670471 (man_made=flagpole). No building
 *   is mapped here: replaces [].
 * - USGS 3DEP lidar AZ_LowerColoradoRiver_B1_2018 (tools/lidar.py, 0.5 m),
 *   NAVD88: plaza 377 m; central pedestal 380 m (3 m); wing walls 379 m
 *   (2 m, about 1 m thick); the two figures' wings read to 386 m (9 m) at
 *   (-2.75, -5.0) and (6.75, -1.5) east/north of -114.73906, 36.01668, which
 *   fixes their spacing (10.1 m), the V of the base and the bearing.
 * - Published (Wikipedia, "Winged Figures of the Republic"; USBR): bronze
 *   figures over 30 ft (9.1 m) high on a black diorite base, the flagpole
 *   142 ft (43.3 m), the terrazzo star-map floor, 1935.
 * - Photos (Wikimedia Commons):
 *   "Winged Figures of the Republic - 3.jpg", APK, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Winged_Figures_of_the_Republic_-_3.jpg
 *     (the whole monument face on: the V base, the pedestals, both figures);
 *   "Winged Figures of the Republic Right Statue.jpg", Noah Wulf, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Winged_Figures_of_the_Republic_Right_Statue.jpg
 *     (one figure face on: legs down the plinth, arms up, the wings' V);
 *   "Winged Figures of the Republic - 4.jpg", APK, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Winged_Figures_of_the_Republic_-_4.jpg
 *     (the flagpole and the wing tips against the canyon wall).
 *
 * Measured (lidar): the base's plan and heights, the figures' places and
 * their 9 m overall height above the plaza (which agrees with the published
 * 30 ft). Published: the flagpole. Estimated from APK's face-on photo
 * (scaled by the 3 m pedestal, about 100 px a metre): the seat at 3.0 m,
 * the plinths, the figure's proportions (shoulders 4.4 m, head to 5 m, fists
 * to 6 m, feet at 1.7 m), the wings' outline and their 30-degree sweep back,
 * the figures' 26-degree turn inward (square to their wing walls), the
 * pole's taper. Left out: the terrazzo star map (paving is the map's, STYLE
 * "Don't model the ground"), the inscription, the flag (it moves), the
 * figures' faces and feathers. Doubt: OSM's flagpole node sits 5 m north of
 * the central pedestal, at the rock; the photos show the pole rising from
 * the pedestal, which is where it is drawn.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './lv-wynn'

type XY = [number, number]
const DEG = Math.PI / 180

const BRONZE: MaterialSpec = { ...finish('bronze', 0x9a9a80), floodlight: (_p, n) => (n[2] > 0.7 ? 0.2 : 0.7) }
const DIORITE: MaterialSpec = finish('diorite', 0x4a4f57, 0.5)
const POLE: MaterialSpec = finish('flagpole', 0x5a5f66, 0.5)
const bronze = new Part(), diorite = new Part(), pole = new Part()

/** A local frame: origin, and the figure's front direction. Points are (a across, b back, z). */
type Frame = { o: XY; front: XY }
function W(f: Frame, a: number, b: number, z: number): V3 {
  const Y: XY = [-f.front[0], -f.front[1]] // back
  const X: XY = [Y[1], -Y[0]] // right-handed: across
  return [f.o[0] + a * X[0] + b * Y[0], f.o[1] + a * X[1] + b * Y[1], z]
}
const ID: Frame = { o: [0, 0], front: [0, -1] }

/** Close a stack of convex rings (counter-clockwise from above) into a solid. */
function solid(p: Part, rings: V3[][]) {
  p.loft(rings)
  p.cap(rings[rings.length - 1], true)
  p.cap(rings[0], false)
}
/** A box in a frame, a0..a1 across, b0..b1 back, z0..z1. */
function box(p: Part, f: Frame, a0: number, a1: number, b0: number, b1: number, z0: number, z1: number) {
  const r = (z: number) => [W(f, a0, b0, z), W(f, a1, b0, z), W(f, a1, b1, z), W(f, a0, b1, z)]
  solid(p, [r(z0), r(z1)])
}
/** A rectangular section at height z, half-width w, from b0 to b1. */
const sec = (f: Frame, w: number, b0: number, b1: number, z: number, a = 0) =>
  [W(f, a - w, b0, z), W(f, a + w, b0, z), W(f, a + w, b1, z), W(f, a - w, b1, z)]

// ---- the diorite base -----------------------------------------------------------
const PED = 3.0 // central pedestal (lidar 380 m)
const WALL = 2.1 // wing walls (lidar 379 m)
const SEAT = 3.0
// central pedestal, its front corners chamfered
{
  const ring = (z: number): V3[] => [[-1.0, -1.3, z], [1.0, -1.3, z], [1.5, -0.8, z], [1.5, 1.2, z], [-1.5, 1.2, z], [-1.5, -0.8, z]]
  solid(diorite, [ring(0), ring(PED - 0.25), ring(PED - 0.25).map(([x, y, z]) => [x * 0.9, y * 0.9, z + 0.25] as V3)])
}
const ARM: XY = [2.9, -1.4] // from the pedestal's side to a figure plinth
const armLen = Math.hypot(ARM[0], ARM[1])
for (const side of [-1, 1]) {
  const dir: XY = [(side * ARM[0]) / armLen, ARM[1] / armLen]
  // the figure faces square to its wall, toward the plaza: turned inward
  const front: XY = side > 0 ? [dir[1], -dir[0]] : [-dir[1], dir[0]]
  const mid: XY = [side * 1.5 + (side * ARM[0]) / 2, -0.2 + ARM[1] / 2]
  const wallF: Frame = { o: mid, front }
  box(diorite, wallF, -armLen / 2 - 0.3, armLen / 2 + 0.3, -0.5, 0.5, 0, WALL)
  // the figure's plinth: a column with a stepped seat block on it
  const at: XY = [side * 5.0, -2.0]
  const F: Frame = { o: at, front }
  box(diorite, F, -0.95, 0.95, -0.9, 0.9, 0, 2.3)
  box(diorite, F, -0.7, 0.7, -0.55, 0.75, 2.3, SEAT)
  figure(F)
}

// ---- a figure -------------------------------------------------------------------
function figure(F: Frame) {
  // lower legs, together, down the front of the plinth to the feet
  solid(bronze, [sec(F, 0.45, -0.95, -0.45, 1.65), sec(F, 0.42, -0.9, -0.4, 2.6), sec(F, 0.46, -0.95, -0.35, SEAT + 0.4)])
  // thighs on the seat
  solid(bronze, [sec(F, 0.48, -0.95, 0.25, SEAT), sec(F, 0.5, -0.95, 0.25, SEAT + 0.45)])
  // torso: narrow hips to a broad chest
  solid(bronze, [sec(F, 0.42, -0.2, 0.35, SEAT + 0.35), sec(F, 0.5, -0.3, 0.35, SEAT + 0.8), sec(F, 0.72, -0.4, 0.4, 4.2), sec(F, 0.62, -0.3, 0.35, 4.5)])
  // head
  solid(bronze, [sec(F, 0.2, -0.3, 0.1, 4.45), sec(F, 0.24, -0.35, 0.15, 4.75), sec(F, 0.18, -0.25, 0.1, 5.05)])
  // arms raised straight up beside the head, fists against the wings
  for (const s of [-1, 1]) solid(bronze, [sec(F, 0.17, -0.1, 0.25, 4.2, s * 0.5), sec(F, 0.14, -0.05, 0.22, 6.1, s * 0.42)])
  // wings: two broad blades in a V, swept back 35 degrees, meeting near the tips
  const outline: XY[] = [[0, 3.4], [1.0, 3.8], [1.5, 4.6], [1.45, 6.2], [0.9, 7.8], [0.25, 9.2], [-0.05, 5.6]]
  for (const s of [-1, 1]) {
    const sw = 30 * DEG
    const d: XY = [s * Math.cos(sw), Math.sin(sw)] // along the blade, in (a, b)
    const nrm: XY = [-d[1], d[0]] // the blade's thickness direction
    const t = 0.09
    const pt = (w: number, z: number, k: number): V3 => W(F, s * 0.2 + d[0] * w + nrm[0] * k, 0.35 + d[1] * w + nrm[1] * k, z)
    const front = outline.map(([w, z]) => pt(w, z, t)), back = outline.map(([w, z]) => pt(w, z, -t))
    const c = outline.reduce((m, [w, z]) => [m[0] + w / outline.length, m[1] + z / outline.length], [0, 0])
    const cf = pt(c[0], c[1], t), cb = pt(c[0], c[1], -t)
    const n = outline.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      // both faces and the rim; Part.tri winds each to its own normal, so emit the pair
      bronze.tri(cf, front[i], front[j])
      bronze.tri(cf, front[j], front[i])
      bronze.tri(cb, back[i], back[j])
      bronze.tri(cb, back[j], back[i])
      bronze.quad(front[i], back[i], back[j], front[j])
      bronze.quad(front[j], back[j], back[i], front[i])
    }
  }
}

// ---- the flagpole: 142 ft from the plaza, rising from the pedestal ---------------
{
  const HPOLE = 43.3
  const ring = (r: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [0.2 + r * Math.cos((i * 45 + 22.5) * DEG), 0.3 + r * Math.sin((i * 45 + 22.5) * DEG), z] as V3)
  pole.loft([ring(0.3, PED - 0.05), ring(0.17, HPOLE - 0.4)])
  solid(pole, [ring(0.17, HPOLE - 0.4), ring(0.32, HPOLE - 0.25), ring(0.32, HPOLE - 0.05), ring(0.05, HPOLE + 0.1)])
}

await save('lv-winged-figures-of-the-republic', 'Winged Figures of the Republic', [
  { part: bronze, material: BRONZE },
  { part: diorite, material: DIORITE },
  { part: pole, material: POLE },
], 43.4, 'Y up, -Z north, +X east, metres; origin at the central pedestal (-114.739049, 36.016669), on the plaza; bearing 338.6')
