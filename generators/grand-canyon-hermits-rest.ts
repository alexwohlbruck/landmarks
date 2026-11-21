/**
 * Hermits Rest, West Rim, Grand Canyon: procedural, CC0-1.0.
 * bun generators/grand-canyon-hermits-rest.ts
 *
 * Mary Colter's 1914 rest house for the Fred Harvey Company at the end of
 * the Hermit Road, a rubble-stone hut dug into the slope so that it looks
 * like a ruin an old hermit built. What makes it read:
 * - a low, long hall of rough buff limestone with a ragged rubble top, a
 *   band of log-framed windows under it, facing the plaza;
 * - a flat pale roof on red-brown log posts and beams across the plaza
 *   front (the entrance porch);
 * - the tall rubble chimney at the west end (the big fireplace alcove);
 * - on the canyon side, the lower storey with its windows and the open log
 *   shelter on stone walls, a level below the plaza.
 *
 * Uses the shared kit in grand-canyon-bright-angel-lodge.ts.
 *
 * Frame: x, y, z up, metres, turned to bearing 330, so +y faces the canyon
 * (north-west) and +x runs along the hall (east-north-east). Anchor
 * (-112.21110, 36.06206), at the OSM outline of way/174994338 (Hermit's
 * Rest, Q2623583). The OSM outline sits about 4 m south-east of the
 * building in lidar and NAIP; the model follows lidar.
 *
 * Sources:
 * - OSM way/174994338, ODbL (name, identity; plan only roughly).
 * - USGS 3DEP lidar AZ_GrandCanyonNP_1_2019 (flown 2019), 0.5 m grid, read
 *   in the model's frame: the building covers x -14..5, y 1..11 (no ground
 *   returns); front porch roof 26 m and hall roof 27 m over ground_min
 *   2008.35 m; the lower roof over the west shelter and the canyon side
 *   24 m; the plaza in front 24-26 m; the canyon-side ground 17-21 m.
 * - USGS NAIP aerial: the pale flat roofs and the plan.
 * - Photos (EVIDENCE):
 *   - "Hermit's Rest.jpg", NPS photo by Michael Quinn, public domain,
 *     https://commons.wikimedia.org/wiki/File:Hermit%27s_Rest.jpg
 *     (from the south-west: chimney, stone wall, entrance porch);
 *   - "Grand Canyon National Park Hermits Rest 20100612 5852
 *     (4701862912).jpg", Grand Canyon NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park_Hermits_Rest_20100612_5852_(4701862912).jpg
 *     (the plaza front from above: porch roof, log window band, doors);
 *   - "Grand Canyon National Park Hermits Rest 007 (5952622693).jpg",
 *     Grand Canyon NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Grand_Canyon_National_Park_Hermits_Rest_007_(5952622693).jpg
 *     (from the west: the log shelter and the canyon-side storey).
 *
 * Numbers, above y = 0 = 2025.85 m (the lowest ground under the footprint,
 * at the shelter's canyon corner; the plaza is z 6.5):
 * - front porch roof 9.4, hall roof 10.4: lidar (26-27 m), measured;
 * - ragged stone top of the front wall to 11.4-12.4: estimated from the
 *   photos (the thin parapet is between lidar cells);
 * - chimney 15.5, its broken top block 16.1: estimated from the Quinn photo (about twice the wall's
 *   height over the path);
 * - shelter roof 6.5 (lidar 24 m), its floor 3.0: estimated from photo 007;
 * - window and door heights: estimated from photo 5852.
 *
 * Rework (lead review: "smooth pale beige boxes"): the stone is now the
 * Quinn photo's weathered grey-brown Kaibab rubble (#b8ab97, pulled to the
 * palette's lightness) with flush darker stones laid over every face; the
 * wall tops are broken into stepped blocks of random height; the chimney is
 * a stepped rubble stack with a broken top block (to 16.1) in place of the
 * smooth frustum; the logs are dark brown, the porch posts thicker, and log
 * vigas run across the porch and out of the hall wall. Block heights and
 * stone placement are invented (seeded) within the photos' ranges. Anchor,
 * bearing, plan and roof heights are unchanged.
 *
 * Not modelled: the stone arch with the bell on the approach path (too thin
 * to read; OSM has no building for it), the low stone walls of the plaza,
 * the diagonal log brace and the porch railings.
 *
 * Doubts: the lidar puts the hall roof only about 3 m over the plaza, lower
 * than the photos suggest; the parapet is drawn to the photos. The plan of
 * the west shelter and the canyon side is from lidar alone (no photo shows
 * the canyon face square on).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, face, panels, post, prism, rect, save, type XY } from './grand-canyon-bright-angel-lodge'

const stone = new Part(), rubble = new Part(), log = new Part(), roof = new Part(), win = new Part()

// Seeded random numbers, so the rubble is the same on every build.
let seed = 1914
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
const lerp = (a: number, b: number) => a + (b - a) * rnd()

/**
 * A rubble wall along x or y whose top steps up and down in blocks 0.8-1.8 m
 * long, wandering between zLo and zHi (as on Lookout Studio).
 */
function ragged(x0: number, x1: number, y0: number, y1: number, z0: number, zLo: number, zHi: number) {
  const alongX = x1 - x0 >= y1 - y0
  const a0 = alongX ? x0 : y0, a1 = alongX ? x1 : y1
  let a = a0, z = lerp(zLo, zHi)
  while (a < a1 - 1e-6) {
    let b = Math.min(a1, a + lerp(0.8, 1.8))
    if (a1 - b < 0.6) b = a1
    if (alongX) box(stone, a, b, y0, y1, z0, z, 0.1)
    else box(stone, x0, x1, a, b, z0, z, 0.1)
    z = Math.min(zHi, Math.max(zLo, z + lerp(-0.5, 0.5) * (zHi - zLo)))
    a = b
  }
}

/**
 * Flush darker rubble stones on a wall face from A to B (outward to the
 * right of A→B), between z0 and z1, skipping the spans in `gaps` (metres
 * along the face, with heights), so the wall reads as laid rubble.
 */
function stones(A: XY, B: XY, z0: number, z1: number, n: number, gaps: [number, number, number, number][] = [], off = 0.03) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L]
  const nrm: V3 = [u[1], -u[0], 0]
  for (let k = 0, tries = 0; k < n && tries < n * 6; tries++) {
    const w = Math.min(lerp(0.55, 1.2), L - 0.3), h = lerp(0.35, 0.6)
    const s = lerp(0.15, L - 0.15 - w), z = lerp(z0, z1 - h)
    if (gaps.some(([g0, g1, h0, h1]) => s < g1 && s + w > g0 && z < h1 && z + h > h0)) continue
    const P = (t: number, zz: number): V3 => [A[0] + u[0] * t + nrm[0] * off, A[1] + u[1] * t + nrm[1] * off, zz]
    face(rubble, [P(s, z), P(s + w, z), P(s + w, z + h), P(s, z + h)], nrm)
    k++
  }
}

/** Darker stones on all four faces of an axis box, between z0 and z1. */
function stonesBox(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, n: number) {
  stones([x0, y0], [x1, y0], z0, z1, n)
  stones([x1, y0], [x1, y1], z0, z1, n)
  stones([x1, y1], [x0, y1], z0, z1, n)
  stones([x0, y1], [x0, y0], z0, z1, n)
}

const PLAZA = 6.5

// The hall, stone from the canyon-side ground to its roof. Its west half
// stands forward to the plaza (photos Quinn and 5852: the stone mass with
// the chimney and a door); the east half sits back behind the porch.
const HALL: XY[] = [[-8.8, 0.6], [-1, 0.6], [-1, 4], [5, 4], [5, 9], [-8.8, 9]]
prism(stone, HALL, 0, 10.4, 0.15)
// The ragged rubble top along the plaza walls and the ends: broken, stepped
// blocks of random height (Quinn: the wall top is heavy, irregular rubble).
ragged(-8.8, -1, 0.6, 1.5, 10.2, 10.9, 12.3)
ragged(-1.9, -1, 1.5, 4, 10.2, 11.0, 12.0)
ragged(-1, 5, 4, 4.9, 10.2, 11.2, 12.5)
ragged(4.2, 5, 4.9, 9, 10.2, 10.8, 11.8)
ragged(-8.8, -8.0, 1.5, 9, 10.2, 10.7, 11.6)
ragged(-8.0, 4.2, 8.3, 9, 10.2, 10.6, 11.3)
// The log-framed window band above the porch roof (photo 5852), with the
// log beam under it.
panels(win, [-1, 4], [5, 4], 1, 4.6, 9.8, 11.0, 0.7, 0.05)
box(log, -1, 5, 3.7, 4, 9.45, 9.8, 0)
// Plaza front: the shop windows and doors under the porch; the door and a
// window in the forward stone mass.
panels(win, [-1, 4], [5, 4], 3, 1.5, PLAZA, PLAZA + 2.3, 0.6, 0.05)
panels(win, [-8.8, 0.6], [-1, 0.6], 2, 1.4, PLAZA, PLAZA + 2.2, 1.6, 0.05)
// The canyon face: the lower storey and the upper windows.
panels(win, [5, 9], [-8.8, 9], 4, 2.0, 7.4, 9.2, 1.0, 0.05)
// East end.
panels(win, [5, 4], [5, 9], 1, 1.8, PLAZA + 0.3, PLAZA + 2.3, 1.5, 0.05)
panels(win, [5, 4], [5, 9], 1, 2.0, 2.6, 4.8, 1.5, 0.05)

// The entrance porch: a pale flat roof with a log fascia on red log posts.
box(roof, -1, 6.6, 0.4, 4, 9.15, 9.45, 0.05)
box(log, -1, 6.7, 0.25, 0.65, 8.65, 9.15, 0)
box(log, 6.3, 6.7, 0.25, 4, 8.65, 9.15, 0)
for (const x of [1.6, 4.0, 6.3]) post(log, [x, 0.5], 0.3, PLAZA - 0.6, 8.7, 6)
// The porch's log vigas, running out of the stone mass and past the fascia
// (Quinn: dark round beam ends over the entrance).
for (const y of [1.2, 2.1, 3.0]) box(log, -1, 7.3, y - 0.17, y + 0.17, 8.8, 9.15, 0)
// Viga ends out of the hall's plaza wall under its ragged top.
for (const x of [-0.2, 1.4, 3.0, 4.4]) box(log, x - 0.18, x + 0.18, 3.4, 4, 10.25, 10.6, 0)

// The chimney over the fireplace alcove, at the hall's west end: a tall
// rubble stack in steps, each course of blocks set in from the one below,
// its top broken (Quinn: it rises about as far again over the wall top).
const STACK: [number, number, number, number, number, number][] = [
  [-8.9, -5.5, 0.5, 3.9, 10.2, 12.1],
  [-8.6, -5.9, 0.8, 3.6, 12.1, 13.4],
  [-8.3, -6.2, 1.0, 3.3, 13.4, 14.5],
  [-8.0, -6.5, 1.25, 3.05, 14.5, 15.5],
]
for (const [x0, x1, y0, y1, z0, z1] of STACK) {
  box(stone, x0, x1, y0, y1, z0, z1, 0.12)
  stonesBox(x0, x1, y0, y1, z0 + 0.1, z1 - 0.1, 2)
}
// The broken top: a last block on one side, higher than the rest.
box(stone, -8.0, -7.1, 1.25, 2.6, 15.4, 16.1, 0.08)

// West of the hall, a lower stone block whose flat roof is about plaza level
// (lidar 24 m), its ragged top a little higher.
prism(stone, rect(-14, -8.8, 1.6, 8), 0, 6.9, 0.15)
box(stone, -14, -12.6, 1.6, 8, 6.7, 7.6, 0.15)
box(stone, -12.6, -10.2, 1.6, 2.6, 6.7, 7.9, 0.15)
panels(win, [-14, 8], [-14, 1.6], 1, 1.6, 3.0, 5.0, 2, 0.05)

// The canyon side, a storey below the plaza: the open log shelter (photo
// 007) on its stone base and low walls, under a flat roof at 6.5.
prism(stone, rect(-14, 5, 9, 12), 0, 3.0, 0.15)
prism(stone, rect(-14, -8.8, 8, 9), 0, 3.0, 0.15)
const low: XY[][] = [rect(-14, 5, 11.5, 12), rect(-14, -13.5, 8, 11.5), rect(4.5, 5, 9, 11.5)]
for (const r of low) prism(stone, r, 3.0, 4.0, 0.1)
for (const x of [-13.6, -9.0, -4.4, 0.2, 4.6]) post(log, [x, 11.6], 0.22, 4.0, 6.0, 6)
post(log, [-13.6, 8.4], 0.22, 4.0, 6.0, 6)
box(log, -14.3, 5.3, 11.4, 11.8, 5.6, 6.1, 0, null)
box(roof, -14.5, 5.5, 8, 12.1, 6.1, 6.45, 0.05)
// The lower storey's windows behind the shelter.
panels(win, [5, 9], [-8.8, 9], 4, 1.8, 3.2, 5.4, 1.2, 0.05)

// Laid rubble: flush darker stones over every face, round the openings.
stones([-8.8, 0.6], [-1, 0.6], PLAZA, 10.2, 16, [[2.0, 3.5, 6.4, 8.8], [4.3, 5.8, 6.4, 8.8]])
stones([-1, 0.6], [-1, 4], PLAZA, 10.2, 6)
stones([5, 4], [5, 9], 0.2, 10.2, 14, [[1.4, 3.6, 2.5, 4.9], [1.4, 3.6, 6.7, 8.9]])
stones([5, 9], [-8.8, 9], 6.5, 10.2, 14, [[1.4, 3.5, 7.3, 9.3], [4.4, 6.5, 7.3, 9.3], [7.3, 9.4, 7.3, 9.3], [10.3, 12.4, 7.3, 9.3]])
stones([-8.8, 9], [-8.8, 0.6], 7.0, 10.2, 8)
stones([-14, 1.6], [-8.8, 1.6], 0.5, 6.8, 12)
stones([-14, 8], [-14, 1.6], 0.2, 6.8, 12, [[2.2, 4.2, 2.9, 5.1]])
stones([5, 12], [-14, 12], 0.1, 2.9, 14)

await save('grand-canyon-hermits-rest', 'Hermits Rest', [
  // The Kaibab rubble's weathered grey-brown, its darker stones, dark log
  // beams and posts, the pale flat roofs.
  { part: stone, material: finish('hermits-stone', 0xb8ab97) },
  { part: rubble, material: finish('hermits-rubble', 0x998b78) },
  { part: log, material: finish('hermits-log', 0x6a4a3a) },
  { part: roof, material: finish('hermits-roof', 0xd3cfc6) },
  { part: win, material: PALETTE.window },
], { bearing: 330, elevation: 0, height: 16.1 })
