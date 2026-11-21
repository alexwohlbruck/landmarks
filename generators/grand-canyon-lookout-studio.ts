/**
 * Lookout Studio, Grand Canyon Village (South Rim): procedural, CC0-1.0.
 * bun generators/grand-canyon-lookout-studio.ts
 *
 * Mary Colter's 1914 studio for the Fred Harvey Company, built of the rim's
 * own rubble limestone so it looks grown out of the edge. What makes it read:
 * - a long, low stone studio under a thin, pale flat roof with a deep eave,
 *   a band of blue-framed windows facing the canyon;
 * - the stone tower at its east end, one storey above the roof, with a
 *   ragged rubble top, over a lower storey that steps down the rim;
 * - the slim stone chimney off the south-west corner; stone terraces below.
 *
 * Orientation (checked in a second pass): photos D1457 and 5296 both look
 * west-north-west at the east face, with the tower at its right (north)
 * end behind the eave and the chimney at the far left (south-west); the
 * lidar's tower top (x -4..0.5, y -1..7) agrees. The first pass had put the
 * window band on the north face and the chimney at the west end.
 *
 * Uses the shared kit in grand-canyon-bright-angel-lodge.ts.
 *
 * Frame: x east, y north, z up, metres, turned to bearing 12 (the walls run
 * at 12 and 102 degrees), so +y faces the canyon. Anchor (-112.141310,
 * 36.057816): the centroid of OSM way/164580569 (Lookout Studio, Q6675514).
 *
 * Plan from lidar, not OSM: USGS 3DEP AZ_GrandCanyonNP_1_2019 (flown 2019),
 * 0.5 m grid, and the NAIP aerial agree that the studio's roof runs from
 * about x = -14 to x = 2.5 and the tower stands at x -3..2.5 on the canyon
 * side, with a lower stepped block east of it to x = 9. The OSM outline
 * (x -7.8..7.6) sits about 6 m east of that; the model follows lidar and
 * NAIP and replaces the OSM way.
 *
 * Heights, above y = 0 = the lowest ground under the footprint (2084.6 m,
 * the east block's foot on the rim slope; the street on the south side is
 * 8.4 m higher):
 * - studio roof 11.1 m (lidar 42.1 over ground_min 2053.59, measured);
 * - tower top 14.0 m (lidar 43.8-45.2, measured); the model puts the
 *   tower body at 13.5 m and its broken rubble blocks at 13.8-15.5 m, as
 *   photos 5296 and D1457 show it standing well above the roof (the
 *   lidar grid averages the broken top);
 * - east block / terrace 6.5 m (lidar 36-38.8, measured);
 * - west chimney top 14.6 m: estimated from photos (lidar doesn't catch it);
 * - window bands: estimated from the photos below.
 *
 * Photos (EVIDENCE):
 * - "Lookout Studio Grand Canyon Village 09 2017 5296.jpg" and "5298",
 *   Mariordo (Mario Roberto Durán Ortiz), CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Lookout_Studio_Grand_Canyon_Village_09_2017_5296.jpg
 *   (canyon side, from below);
 * - "Grand Canyon National Park Lookout Studio D1457 (4690625725).jpg",
 *   Grand Canyon NPS, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park_Lookout_Studio_D1457_(4690625725).jpg
 *   (from the rim to the east, roof and tower);
 * - "Grand Canyon Village-Look-Out Studio-1914.jpg", Marine 69-71,
 *   CC BY-SA 4.0 (street side).
 *
 * Second pass (lead review: "plain beige boxes"): the stone is now the
 * photos' cool grey-buff Kaibab rubble (#c4bfb3, pulled to the palette's
 * lightness) mottled with flush darker rubble stones; every wall top
 * (tower, west parapet, chimney, terrace parapets) is broken into stepped
 * blocks of random height, as the photos show; the windows have the blue
 * frames and a centre bar; the east terrace steps down the rim in two
 * levels (5296, D1457). Block heights and stone placement are invented
 * (seeded), within the ranges the photos show.
 *
 * Doubts: the stone terraces and retaining walls below the studio are left
 * to the terrain; the porch and its wooden rails beside the tower are
 * dropped as too fine.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, face, panels, prism, rect, save, type XY } from './grand-canyon-bright-angel-lodge'

const stone = new Part(), rubble = new Part(), roof = new Part(), win = new Part(), frame = new Part()

// Seeded random numbers, so the rubble is the same on every build.
let seed = 1914
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
const lerp = (a: number, b: number) => a + (b - a) * rnd()

/**
 * A rubble wall along x or y whose top steps up and down in blocks 0.9-2 m
 * long, wandering between zLo and zHi (a random walk, so it reads as
 * broken stonework rather than battlements).
 */
function ragged(x0: number, x1: number, y0: number, y1: number, z0: number, zLo: number, zHi: number) {
  const alongX = x1 - x0 >= y1 - y0
  const a0 = alongX ? x0 : y0, a1 = alongX ? x1 : y1
  let a = a0, z = lerp(zLo, zHi)
  while (a < a1 - 1e-6) {
    let b = Math.min(a1, a + lerp(0.9, 2.0))
    if (a1 - b < 0.6) b = a1
    if (alongX) box(stone, a, b, y0, y1, z0, z, 0.1)
    else box(stone, x0, x1, a, b, z0, z, 0.1)
    z = Math.min(zHi, Math.max(zLo, z + lerp(-0.45, 0.45) * (zHi - zLo)))
    a = b
  }
}

/**
 * Flush darker rubble stones on a wall face from A to B (outward to the
 * right of A→B), between z0 and z1, skipping the spans in `gaps` (metres
 * along the face, with heights), so the wall reads as laid rubble.
 */
function stones(A: XY, B: XY, z0: number, z1: number, n: number, gaps: [number, number, number, number][] = []) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const nrm: V3 = [u[1], -u[0], 0]
  for (let k = 0, tries = 0; k < n && tries < n * 6; tries++) {
    const w = lerp(0.5, 1.1), h = lerp(0.3, 0.55)
    const s = lerp(0.2, L - 0.2 - w), z = lerp(z0, z1 - h)
    if (gaps.some(([g0, g1, h0, h1]) => s < g1 && s + w > g0 && z < h1 && z + h > h0)) continue
    const P = (t: number, zz: number): V3 => [A[0] + u[0] * t + nrm[0] * 0.03, A[1] + u[1] * t + nrm[1] * 0.03, zz]
    face(rubble, [P(s, z), P(s + w, z), P(s + w, z + h), P(s, z + h)], nrm)
    k++
  }
}

/** Blue-framed windows: a frame panel, the glass, and a blue centre bar. */
function framed(A: XY, B: XY, count: number, w: number, z0: number, z1: number, margin: number) {
  panels(frame, A, B, count, w + 0.36, z0 - 0.18, z1 + 0.18, margin - 0.18, 0.03)
  panels(win, A, B, count, w, z0, z1, margin, 0.05)
  panels(frame, A, B, count, 0.16, z0, z1, margin, 0.07)
}

// The studio: rubble walls to the roof, a thin pale roof slab with a deep eave.
prism(stone, rect(-14, 2.5, -10, 5), 0, 10.8, 0, null)
box(roof, -14.7, 3.1, -10.6, 5.9, 10.8, 11.2, 0.12)
// The window band of blue-framed lights on the east face, south of the
// tower, over the terrace (photos 5296 and D1457: four big lights), and a
// band on the canyon face west of the tower.
framed([2.5, -10], [2.5, -0.5], 4, 1.3, 7.6, 10.2, 0.8)
framed([-4.5, 5], [-14, 5], 3, 1.5, 7.6, 10.2, 1.2)
// Street side: small windows and the door just above the street (8.4 m).
framed([-14, -10], [2.5, -10], 4, 1.3, 8.9, 10.4, 1.5)
// West end.
framed([-14, 5], [-14, -10], 2, 1.5, 7.4, 10.0, 3)
// Laid rubble on the studio's faces, round the windows.
stones([2.5, -10], [2.5, -0.5], 0.5, 10.6, 40, [[0, 9.5, 7.3, 10.5]])
stones([-4.5, 5], [-14, 5], 1, 10.6, 34, [[0, 9.5, 7.3, 10.5]])
stones([-14, -10], [2.5, -10], 7.5, 10.6, 16, [[0, 16.5, 8.6, 10.7]])
stones([-14, 5], [-14, -10], 2, 10.6, 26, [[0, 15, 7.1, 10.3]])

// The west end's rubble wall breaks up through the roof as a broken parapet
// (D1457, 5296: a ragged stone end rising above the eave).
ragged(-14.6, -13.6, -10.4, -3, 10.6, 11.3, 12.4)

// The tower, a storey over the roof, its rubble top broken and stepped:
// highest at the canyon (north-west) corner, lowest on the east (D1457).
prism(stone, rect(-4.5, 1, -0.5, 6.5), 0, 13.5, 0.15)
ragged(-4.5, 1, 5.8, 6.5, 13.3, 14.0, 14.9)
ragged(-4.5, 1, -0.5, 0.2, 13.3, 13.8, 14.4)
box(stone, -4.5, -2.6, 4.2, 6.5, 13.3, 15.5, 0.1) // the tall broken corner
box(stone, -4.5, -3.4, 0.2, 4.2, 13.3, 14.8, 0.1)
// Tower windows: the canyon face's upper light and the lower door storey,
// and the east face's upper light.
framed([1, 6.5], [-4.5, 6.5], 1, 2.4, 11.0, 12.6, 1.55)
framed([1, 6.5], [-4.5, 6.5], 1, 1.7, 7.4, 10.0, 1.9)
framed([1, -0.5], [1, 6.5], 1, 2.0, 11.0, 12.6, 2.5)
framed([1, -0.5], [1, 6.5], 1, 1.5, 7.0, 9.6, 2.75)
stones([1, 6.5], [-4.5, 6.5], 1, 14, 20, [[1.3, 4.2, 7.2, 12.9]])
stones([1, -0.5], [1, 6.5], 11.3, 13.4, 5, [[2.3, 4.7, 10.8, 12.9]])

// The terraces east of the studio stepping down the rim: an upper one at
// the tower's door storey and a lower one at the rim's edge, each with a
// broken rubble parapet (5296, D1457: plain rubble, no windows).
prism(stone, rect(2.5, 6.2, -8, 8), 0, 6.5, 0.15)
prism(stone, rect(6.2, 9.6, -6.5, 6.5), 0, 4.0, 0.15)
ragged(5.6, 6.2, -8, 8, 6.4, 7.0, 7.7)
ragged(2.5, 5.6, 7.4, 8, 6.4, 7.0, 7.6)
ragged(2.5, 5.6, -8, -7.4, 6.4, 6.9, 7.5)
ragged(9.0, 9.6, -6.5, 6.5, 3.9, 4.5, 5.2)
ragged(6.2, 9.0, 5.9, 6.5, 3.9, 4.5, 5.1)
ragged(6.2, 9.0, -6.5, -5.9, 3.9, 4.4, 5.0)
stones([6.2, -8], [6.2, 8], 0.4, 6.3, 6)
stones([9.6, -6.5], [9.6, 6.5], 0.2, 3.8, 24)
stones([6.2, -8], [6.2, -6.5], 4, 6.3, 1)
stones([2.5, 8], [6.2, 8], 0.5, 6.3, 8)
stones([9.6, 6.5], [6.2, 6.5], 0.3, 3.8, 6)

// The slim ruined chimney off the south-west, its top broken open like a
// ruin (photos 5296, D1457, Marine 69-71; lidar 45.6-45.9 at x -6..-3,
// y -11..-14, partly a juniper beside it), behind a low broken wall.
prism(stone, rect(-6.2, -4.6, -12.0, -10), 0, 13.4, 0.15)
box(stone, -6.2, -5.7, -12.0, -10, 13.3, 14.6, 0.08)
box(stone, -5.1, -4.6, -12.0, -10, 13.3, 14.2, 0.08)
box(stone, -6.2, -4.6, -11.2, -10, 13.3, 13.8, 0.08)
ragged(-14, -6.2, -11.0, -10, 0, 9.3, 10.1)
stones([-6.2, -12], [-4.6, -12], 9, 13, 3)

await save('grand-canyon-lookout-studio', 'Lookout Studio', [
  // The rim's cool grey-buff Kaibab limestone, its darker rubble stones,
  // the pale roof, slate windows and their blue frames.
  { part: stone, material: finish('lookout-stone', 0xc4bfb3) },
  { part: rubble, material: finish('lookout-rubble', 0xada89c) },
  { part: roof, material: finish('lookout-roof', 0xdad8d2) },
  { part: win, material: PALETTE.window },
  { part: frame, material: finish('lookout-frame', 0x46669a) },
], { bearing: 12, elevation: 0, height: 15.5 })
