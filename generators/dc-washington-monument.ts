/**
 * Washington Monument — procedural, CC0-1.0, no textures.
 * bun generators/dc-washington-monument.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the OSM
 * outline (way/766761337), which is a 17 m square aligned to the compass, so
 * the model is placed at bearing 0. The entrance is on the east face.
 *
 * Evidence:
 * - OSM way/766761337: square outline 17.0 × 17.0 m, height 169.294,
 *   roof:shape pyramidal, roof:height 16.76.
 * - Published (NPS; Wikipedia "Washington Monument"): 555 ft 5 1/8 in
 *   (169.29 m) tall; the shaft is 500 ft (152.4 m) to the base of the
 *   pyramidion, 55 ft 1 1/2 in (16.80 m) square at the ground and
 *   34 ft 5 1/2 in (10.50 m) at the top; the pyramidion is 55 ft (16.76 m)
 *   tall. Construction stopped in 1854 at about 152 ft (46 m); when it
 *   resumed in 1879 the marble came from a different quarry, and the change of
 *   shade at that course is still visible. Eight observation windows, two per
 *   face, sit at the 500 ft level just above the shaft.
 * - Photos (Wikimedia Commons): "Washington Monument - 01.jpg" (Carlos
 *   Delgado, CC BY-SA 3.0, from the north-west, overcast); "Washington
 *   Monument in 2017, NW side.jpg" (Iswzo, CC BY-SA 4.0, sunlit);
 *   "Washington Monument 2022.jpg" (Greyfiveys, CC BY-SA 4.0); "Aerial view of
 *   Washington Monument looking north" LCCN2011634191 (Carol M. Highsmith,
 *   public domain). In them the lower third reads a touch whiter and cooler,
 *   the upper shaft a touch warmer and creamier.
 *
 * Estimated: the window and door sizes (read off the photos against the
 * known face width), and the colour of each marble band. The step between
 * the two bands is drawn a little stronger than the photos show, so the
 * line still reads at phone size (200 and 80 px), where the monument stands
 * at minzoom 13–14. Not modelled: the
 * ring of 50 flags, the earth mound and plaza (ground), and the east
 * screening building (way/897141356), which is a separate building outside
 * the outline.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const lower = new Part(), upper = new Part(), win = new Part(), door = new Part()

const H_SHAFT = 152.4      // base of the pyramidion
const H_TOP = 169.29       // apex
const H_CHANGE = 46.3      // the 1854 / 1879 course, 152 ft
const B0 = 16.8 / 2        // half width at the ground
const B1 = 10.5 / 2        // half width at the top of the shaft
const C = 0.35             // corner chamfer, horizontal
const half = (z: number) => B0 + (B1 - B0) * (z / H_SHAFT)

/** A chamfered square ring at height z, counter-clockwise from above. */
function ring(h: number, z: number): V3[] {
  const c = Math.min(C, h * 0.2)
  return [
    [-h + c, -h, z], [h - c, -h, z], [h, -h + c, z], [h, h - c, z],
    [h - c, h, z], [-h + c, h, z], [-h, h - c, z], [-h, -h + c, z],
  ]
}

// Shaft in two bands of marble, meeting at the 1854 course.
lower.loft([ring(half(0), 0), ring(half(H_CHANGE), H_CHANGE)])
upper.loft([ring(half(H_CHANGE), H_CHANGE), ring(half(H_SHAFT), H_SHAFT)])

// Pyramidion: the chamfered ring closing to the apex.
{
  const r = ring(B1, H_SHAFT), apex: V3 = [0, 0, H_TOP]
  for (let i = 0; i < r.length; i++) upper.tri(r[i], r[(i + 1) % r.length], apex)
}

/**
 * A flat panel on one face of the monument, `s` across the face (from its
 * centre) and `z` up, lifted 0.03 m off the surface. `face` turns the south
 * face (normal -y) about the vertical axis by quarter turns, counter-clockwise.
 */
function panel(p: Part, face: number, s0: number, s1: number, z0: number, z1: number, surface: (z: number) => number) {
  const a = (face * Math.PI) / 2, cs = Math.cos(a), sn = Math.sin(a)
  // On the south face, x = s and y = -surface(z) - lift.
  const pt = (s: number, z: number): V3 => {
    const x = s, y = -surface(z) - 0.03
    return [x * cs - y * sn, x * sn + y * cs, z]
  }
  p.quad(pt(s0, z0), pt(s1, z0), pt(s1, z1), pt(s0, z1))
}

// Observation windows: two per face, at the foot of the pyramidion, which
// tapers from 5.25 m to nothing over 16.89 m.
const pyr = (z: number) => B1 * (1 - (z - H_SHAFT) / (H_TOP - H_SHAFT))
for (let f = 0; f < 4; f++) {
  for (const s of [-1.55, 1.55]) panel(win, f, s - 0.45, s + 0.45, H_SHAFT + 0.9, H_SHAFT + 2.3, pyr)
}

// The east doorway, under its carved lintel: face 1 is east.
panel(door, 1, -1.3, 1.3, 0, 4.2, half)

const parts = [
  { part: lower, material: finish('marble-lower', 0xf0ebe2) },
  { part: upper, material: finish('marble-upper', 0xeadfcb) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Washington Monument', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/766761337', footprint: [16.8, 16.8], height: H_TOP,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dc-washington-monument.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
