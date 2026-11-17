/**
 * Monumento a los Niños Héroes (Altar a la Patria), east entrance of the
 * Bosque de Chapultepec, Mexico City (architect Enrique Aragón Echegaray,
 * sculptor Ernesto Tamariz, 1952): procedural, CC0-1.0.
 *   bun generators/mexico-city-ninos-heroes.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 63.2: the
 * model's +y is the way the monument opens, east-north-east toward the
 * avenue and the plaza in front. Origin: on the monument's axis inside the
 * platform (lng -99.1793014, lat 19.4215103), 13 m back from the centre
 * of the columns' arc toward the columns; the arc's centre is at (0, 13).
 *
 * Form: the marble platform with its three front steps; six tall white
 * marble columns on an arc of 25.3 m radius (at ±16.2, ±35 and ±53.7
 * degrees from the axis, a wide gap in the middle), each with a black
 * bronze collar, a black bronze eagle with raised wings on its inner face
 * and a black bronze torch flame on top; the low grey-veined marble wall
 * that links them, in two arms; and in the middle gap, the pedestal
 * inscribed "A los defensores de la Patria 1846-1847" carrying Tamariz's
 * white marble group, the Patria holding a dead cadet with a youth beside
 * her, and the marble block standing behind it to one side. Symmetric
 * apart from the sculpture and that block.
 *
 * Sources
 * - OSM (ODbL): way/55212777 (historic=monument, the platform; not a
 *   building) and the six columns, way/1140261804-06 and
 *   way/1264978530/32/34 (man_made=obelisk, 2.4-2.5 m circles; not
 *   buildings). No building is mapped, so nothing is replaced. The arc was
 *   fitted to the six column centres (radius 25.3 m, every column within
 *   0.12 m of it); the platform outline is OSM's, turned into this frame.
 * - Published (es.wikipedia "Altar a la Patria"): six marble columns in a
 *   semicircle crowned with torches, bronze eagles on the upper shafts,
 *   the central group (the Patria with a fallen cadet, and a standing
 *   youth with the flag), 1952.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 José Luiz, "Monumento a los Niños Heroes - Mexico 2024.jpg",
 *     CC BY-SA 4.0 (the whole front, level from the plaza: the
 *     calibration photo);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_los_Ni%C3%B1os_Heroes_-_Mexico_2024.jpg
 *   2 José Luiz, "Monumento a los Niños Heroes - Mexico 2024 (2).jpg",
 *     CC BY-SA 4.0 (the centre: steps, pedestal, group, eagles, torches);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_los_Ni%C3%B1os_Heroes_-_Mexico_2024_(2).jpg
 *   3 Another Believer, "Mexico City (2018) - 030.jpg", CC BY-SA 4.0 (from
 *     the north end of the arc, across the columns and the wall).
 *     https://commons.wikimedia.org/wiki/File:Mexico_City_(2018)_-_030.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the park entrance is on the flat basin floor; elevation 0.
 * - Heights (estimated from photos 1 and 2, scaled on OSM's 2.4 m column
 *   diameter; the columns read 12-13.5 diameters tall in them): platform
 *   1.2 m in three steps; column shafts 23.3 m above it (photo 1, scaled
 *   on the 8.2 m OSM spacing of two columns at the same depth; 10.6
 *   diameters, as photo 2 gives), the bronze collar at 17.9 m, the eagles
 *   to 23.2 m, the torches to 26.5 m, so the top is 27.7 m over the plaza;
 *   wall 4.7 m with its cornice; pedestal 4.5 m; the group about 6.5 m
 *   (drawn 1.35 times a first estimate, as the photos show it).
 *   No published heights were found.
 * - Colours from photos 1 and 2: white marble columns and statue #f1eee8,
 *   grey-veined marble wall #b7b9b9 and platform #d9d8d4, black bronze
 *   pulled to #4d4f52.
 * - Simplified: the eagles as a body and two raised wing blades, the torch
 *   flames as one bundled flame, the group as bold blocks; the flagpole
 *   and the railing are left out.
 *
 * Night: the columns, the wall and the group are floodlit (`floodlight`).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { body, ellipsoid, extrude, prism, rect, save, tube, type XY } from './dc-wwii-memorial'

const white = new Part()
const wall = new Part()
const floor = new Part()
const bronze = new Part()

const TAU = Math.PI * 2
const deg = Math.PI / 180

// ---- the platform: OSM's outline turned into this frame -------------------------
// OSM points are metres east/north of (-99.179293, 19.421488); the frame
// origin is 0.88 m west and 2.47 m north of that.
const OSM: XY[] = [[11.16, -21.39], [13.91, -20.17], [15.83, -18.29], [17.39, -16.43], [18.61, -13.95], [19.54, -10.88], [20.3, -7.05], [20.65, -2.75], [20.33, 1.3], [19.49, 5.94], [17.89, 10.14], [15.04, 15.19], [12.29, 18.72], [8.71, 22.26], [4.36, 25.03], [-0.2, 27.11], [-4.49, 28.01], [-8.35, 27.8], [-11.55, 26.87], [-14.25, 25.11], [-16.08, 22.93], [-17.41, 20.63], [-18.37, 18.08], [-19.1, 15.03], [-19.5, 12.24], [-19.86, 8.08], [-19.64, 4.57], [-18.82, 0.34], [-17.07, -4.33], [-14.43, -8.78], [-12.71, -11.46], [-10.65, -13.93], [-8.39, -16.32], [-6.4, -18.01], [-4.25, -19.56], [-1.96, -20.62], [0.63, -21.64], [2.87, -22.21], [5.48, -22.38], [8.44, -22.0]]
const B = 63.2 * deg
const toLocal = ([e, n]: XY): XY => {
  const x = e + 0.88, y = n - 2.47
  return [x * Math.cos(B) - y * Math.sin(B), x * Math.sin(B) + y * Math.cos(B)]
}
const plat = OSM.map(toLocal)
const cx = plat.reduce((s, p) => s + p[0], 0) / plat.length, cy = plat.reduce((s, p) => s + p[1], 0) / plat.length
const shrink = (k: number): XY[] => plat.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k])
const P = 1.2
// Three treads of 0.4 m, each stepping in about 0.7 m.
extrude(floor, plat, 0, 0.4)
extrude(floor, shrink(0.97), 0.4, 0.8)
extrude(floor, shrink(0.94), 0.8, P)

// ---- the arc ----------------------------------------------------------------------
const C: XY = [0, 13], R = 25.3
const onArc = (a: number, r = R): XY => [C[0] + r * Math.sin(a * deg), C[1] - r * Math.cos(a * deg)]

// The wall arms, from the outer columns in to the inner ones, on a stepped base.
function arcBand(p: Part, a0: number, a1: number, r0: number, r1: number, z0: number, z1: number, n: number) {
  const ring: XY[] = []
  for (let i = 0; i <= n; i++) ring.push(onArc(a0 + ((a1 - a0) * i) / n, r1))
  for (let i = n; i >= 0; i--) ring.push(onArc(a0 + ((a1 - a0) * i) / n, r0))
  extrude(p, ring, z0, z1)
}
for (const s of [-1, 1]) {
  const a0 = s * 16.2, a1 = s * 53.7
  const [lo, hi] = s > 0 ? [a0, a1] : [a1, a0]
  arcBand(wall, lo, hi, 23.9, 27.0, P, P + 0.6, 12)
  arcBand(wall, lo, hi, 24.4, 26.4, P + 0.6, P + 4.1, 12)
  arcBand(wall, lo, hi, 24.2, 26.6, P + 4.1, P + 4.7, 12)
}

// ---- the six columns -----------------------------------------------------------------
// Heights from photo 1, scaled on the 8.2 m OSM spacing of two columns at
// the same depth: shaft 23.3 m over the platform, collar at 17.9, eagle to
// 23.2, torch to 26.4.
const SHAFT = 23.3, RC = 1.2, COLLAR = 17.9
for (const a of [-53.7, -35, -16.2, 16.2, 35, 53.7]) {
  const [x, y] = onArc(a)
  const z0 = P
  const L = (rows: number[][]) => rows.map(([z, r]) => [z, r, r, x, y])
  prism(white, rect(x, y, 1.55, 1.55, -a * deg, 0.2), z0, z0 + 0.7, 0.12)
  body(white, L([[z0 + 0.7, RC + 0.1], [z0 + 1.0, RC], [z0 + SHAFT, RC]]), 16)
  // Black bronze collar under the eagle.
  body(bronze, L([[z0 + COLLAR - 0.1, RC + 0.05], [z0 + COLLAR + 0.1, RC + 0.32], [z0 + COLLAR + 0.6, RC + 0.32], [z0 + COLLAR + 0.7, RC + 0.05]]), 16)
  // The eagle on the face toward the arc's centre: a bold body and two
  // broad wings raised straight up beside it, wider than the shaft at the
  // top, so it reads as the dark mass it is.
  const ix = (C[0] - x) / R, iy = (C[1] - y) / R // inward unit
  const tx = -iy, ty = ix // along the arc
  const at = (o: number, t: number, z: number): V3 => [x + ix * (RC + o) + tx * t, y + iy * (RC + o) + ty * t, z0 + z]
  const e = COLLAR + 0.6
  ellipsoid(bronze, at(0.2, 0, e + 1.4), [0.6, 0.55, 1.5], 8, 4)
  ellipsoid(bronze, at(0.45, 0, e + 3.0), [0.32, 0.36, 0.38], 6, 3)
  for (const side of [-1, 1]) {
    // A wing blade, standing up from the shoulder and wrapping the shaft.
    const ring: XY[] = [[0.15, e + 0.3], [0.85, e + 0.9], [1.3, e + 2.2], [1.45, e + 3.8], [1.2, e + 4.9], [0.75, e + 4.3], [0.35, e + 3.6], [0.15, e + 2.0]]
    extrude(bronze, ring, -0.18, 0.18, (t, z, w) => at(0.05 + w - Math.max(0, Math.abs(t) - 0.6) * 0.5, side * t, z))
  }
  // The torch: a black flame bundle on the shaft's top.
  body(bronze, L([[z0 + SHAFT - 0.05, RC + 0.02], [z0 + SHAFT + 0.7, RC * 0.98], [z0 + SHAFT + 2.0, RC * 0.78], [z0 + SHAFT + 2.8, RC * 0.42], [z0 + SHAFT + 3.2, 0.05]]), 12)
}

// ---- the centre: pedestal, group and the block behind ----------------------------------
// Pedestal 4.5 m and group 6.5 m, from photos 1 and 2.
{
  const [x, y] = onArc(0, 21.2)
  prism(wall, rect(x, y, 2.4, 2.0, 0, 0.15), P, P + 0.6, 0.1)
  prism(wall, rect(x, y, 2.0, 1.65, 0, 0.15), P + 0.6, P + 4.5, 0.12)
  const k = 1.35, z = P + 4.5
  const g = (dx: number, dy: number, dz: number): V3 => [x + dx * k, y + dy * k, z + dz * k]
  const w = (v: number[]) => v.map(n => n * k)
  // The Patria: a tall draped standing woman, slightly right of centre.
  tube(white, [g(0.3, 0, 0), g(0.3, 0, 2.2), g(0.3, 0, 3.8)], w([0.9, 0.7, 0.55]), w([0.75, 0.55, 0.42]), 10)
  ellipsoid(white, g(0.3, 0.05, 4.3), w([0.36, 0.38, 0.48]) as V3, 8, 4)
  // The dead cadet slumped across her, held at her right side.
  tube(white, [g(1.25, 0.55, 1.0), g(0.9, 0.65, 2.0), g(0.6, 0.6, 2.9)], w([0.35, 0.45, 0.4]), w([0.35, 0.4, 0.35]), 8)
  ellipsoid(white, g(0.95, 0.65, 3.1), w([0.28, 0.28, 0.3]) as V3, 6, 3)
  // The youth at her left with the flag gathered over his arm.
  tube(white, [g(-0.85, 0.2, 0), g(-0.85, 0.2, 2.0), g(-0.85, 0.2, 3.2)], w([0.45, 0.42, 0.42]), w([0.38, 0.35, 0.3]), 8)
  ellipsoid(white, g(-0.85, 0.25, 3.65), w([0.3, 0.32, 0.38]) as V3, 6, 3)
  // The flag's folds, falling in front between them.
  tube(white, [g(-0.6, 0.5, 2.6), g(-0.2, 0.7, 1.4), g(0.2, 0.75, 0.2)], w([0.3, 0.55, 0.75]), w([0.2, 0.3, 0.35]), 8)
  // The marble block behind, to the group's left.
  const [bx, by] = onArc(-6, 24.6)
  prism(wall, rect(bx, by, 1.2, 0.8, 0, 0.12), P, P + 4.4, 0.12)
}

const flood = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.4 : 1)

await save('mexico-city-ninos-heroes', 'Monumento a los Niños Héroes', [
  { part: white, material: { ...finish('white-marble', 0xf1eee8), floodlight: flood } },
  { part: wall, material: { ...finish('grey-marble', 0xb7b9b9), floodlight: flood } },
  { part: floor, material: finish('platform-marble', 0xd9d8d4) },
  { part: bronze, material: finish('black-bronze', 0x4d4f52) },
], { bearing: 63.2 }, 6500)
void TAU
