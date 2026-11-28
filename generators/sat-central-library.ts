/**
 * San Antonio Central Library: procedural, CC0-1.0.
 * bun generators/sat-central-library.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * lidar grid's centre, OSM's outline centroid (way/78595854:
 * -98.4928486, 29.4323936). y = 0 is the street round the site, which is
 * flat (2017 lidar ground, within 0.5 m).
 *
 * Ricardo Legorreta with Sprinkle Robey and Johnson-Dempsey, 1995: big
 * cubic masses in "enchilada red" stucco over a pink sandstone base,
 * stepping down to the west, a red tower on the roof, a lavender cylinder
 * on a corner, rows of slit windows and deep square openings, and a
 * skylit atrium.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the main block 30 m (x -11..44, y -40..15), the atrium skylight on it
 *   to 35.5 m (four glass pyramids, white in the 2022 NAIP aerial) and a
 *   south-east block to 40 m;
 * - the tower to 45 m (x -10..-1, y 6..16): red like the rest (Eden's
 *   photo shows a red box on the roof; NAIP shows nothing yellow there, so
 *   the brief's "yellow tower" is not drawn; yellow appears only inside
 *   the framed openings);
 * - the roofs are painted red (NAIP), drawn a shade off the walls;
 * - the north wing 21 m and the west wing 12 m, following OSM's
 *   diagonal north-east and south-west edges.
 * From photos: the colours (pulled to the palette's lightness), the slit
 * window rows, the cylinder, the sandstone base.
 * Estimated: the cylinder's place (the south-west corner) and size, the
 * base band's height (3.5 m), the slit rows, the plans of the raised
 * masses (rectangles fitted to the lidar).
 * Left out: the tall triangular fin on one roof edge (seen in one photo;
 * neither the lidar nor NAIP shows it, so it cannot be placed), the framed roof terrace, the
 * stair, the window grilles.
 *
 * OSM: way/78595854 (outline, 6 levels, no parts), replaced. The parking
 * garage to the south (way/398836775) is its own building.
 *
 * Night: the slit windows are `window`; the stucco is not lit.
 *
 * Photos (all EVIDENCE):
 * - "San Antonio Central Library.jpg", MagicM100, CC0 (Commons)
 * - "Central Library I (48875268292).jpg", "Central Library II
 *   (48874533928).jpg", Eden, Janine and Jim, CC BY 2.0 (Commons)
 * - USGS NAIP orthophoto (public domain): roof colours, the skylight
 * - "San Antonio Central Library", digtexorg, CC BY-SA 2.0,
 *   https://www.flickr.com/photos/130019385@N02/16554664835 (the yellow tower's terrace)
 * No look-only sources used.
 *
 * Doubts: which corner carries the cylinder; the masses on the roof are
 * read from the lidar only.
 */
import { Part, writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, bayPanels, type XY } from './sat-frost-tower'

const red = new Part()
const glass = new Part()
const lav = new Part()
const base = new Part()
const win = new Part()
const roofP = new Part()

const BASE = 3.5
function mass(P0: XY[], z1: number, p = red, slits = true, z0 = 0) {
  const P = ring(P0)
  if (z0 === 0) { walls(base, P, 0, BASE); walls(p, P, BASE, z1) } else walls(p, P, z0, z1)
  capPoly(roofP, P, z1, true)
  if (slits && z1 - z0 > 8) bayPanels(win, P, [[z1 - 7.5, z1 - 3.5]], 0.55, 1.5, 6)
}
// the main block, the raised masses, the yellow tower
mass([[-11.6, -38.5], [44.3, -40.3], [44.6, 15], [-10, 15]], 30)
mass([[29, -37], [44.3, -37], [44.3, -20], [29, -20]], 40, red, true, 30)
mass([[-10, 6], [-1, 6], [-1, 16], [-10, 16]], 45, red, true, 0)
// the north wing (21 m) and the west wing (12 m)
mass([[-25, 14], [-1, 14], [-1, 34], [-25, 44]], 21)
mass([[-41.8, -17.1], [-11.9, -29.5], [-10, -29.5], [-10, 14], [-25, 14], [-25, 30], [-41.9, 30]], 12)
mass([[-41.9, 30], [-25, 30], [-25, 44], [-41.9, 51.2]], 12)
// The atrium skylight on the main block: four glass pyramids (NAIP shows
// them white, 2 by 2; the lidar's raised area, to 35.5 m).
{
  const X0 = 9, X1 = 28, Y0 = -24, Y1 = 0, Z = 30, APEX = 35.5
  const hx = (X1 - X0) / 4, hy = (Y1 - Y0) / 4
  for (const cx of [X0 + hx, X1 - hx]) for (const cy of [Y0 + hy, Y1 - hy]) {
    const c: [number, number] = [cx, cy]
    const P: XY[] = [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]
    for (let i = 0; i < 4; i++) {
      const a = P[i], b = P[(i + 1) % 4]
      // counter-clockwise ring, so (a, b, apex) faces outward and up
      glass.tri([a[0], a[1], Z], [b[0], b[1], Z], [c[0], c[1], APEX])
    }
  }
}
// the lavender cylinder on the south-west corner, with its row of slits
{
  const cx = -37.5, cy = -17.5, R = 5, H = 11, K = 20
  const C: XY[] = Array.from({ length: K }, (_, k) => [cx + R * Math.cos((2 * Math.PI * k) / K), cy + R * Math.sin((2 * Math.PI * k) / K)])
  walls(lav, ring(C), 0, H)
  capPoly(roofP, ring(C), H, true)
  bayPanels(win, ring(C), [[2.2, 3.4]], 0.5, 0.5, 1.0, (i) => {
    const a = (2 * Math.PI * (i + 0.5)) / K
    return Math.sin(a) > 0.3 || Math.cos(a) > 0.3 // only the outward (south-west) half
  })
}

// Colours from daylight photos, pulled to the palette's lightness.
const parts = [
  { part: red, material: finish('library-enchilada-red', 0xd06f5c) },
  { part: glass, material: PALETTE.glass },
  { part: lav, material: finish('library-lavender', 0xa49cd2) },
  { part: base, material: finish('library-sandstone', 0xd8b8a4) },
  { part: win, material: PALETTE.window },
  { part: roofP, material: finish('library-roof-red', 0xc9806c) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('San Antonio Central Library', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 45, anchor: [29.4323936, -98.4928486], replaces: ['way/78595854'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-central-library.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
