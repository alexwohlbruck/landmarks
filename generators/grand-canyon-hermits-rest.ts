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
 * - chimney 15.5: estimated from the Quinn photo (about twice the wall's
 *   height over the path);
 * - shelter roof 6.5 (lidar 24 m), its floor 3.0: estimated from photo 007;
 * - window and door heights: estimated from photo 5852.
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
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, face, panels, post, prism, rect, save, type XY } from './grand-canyon-bright-angel-lodge'

/** A frustum from rectangle B (at z0) to rectangle T (at z1), with a lid. */
function frustum(p: Part, B: [number, number, number, number], T: [number, number, number, number], z0: number, z1: number) {
  const b = rect(...B), t = rect(...T)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const ex = b[j][0] - b[i][0], ey = b[j][1] - b[i][1]
    face(p, [[b[i][0], b[i][1], z0], [b[j][0], b[j][1], z0], [t[j][0], t[j][1], z1], [t[i][0], t[i][1], z1]], [ey, -ex, 0.3])
  }
  face(p, t.map(([x, y]) => [x, y, z1]), [0, 0, 1])
}

const stone = new Part(), log = new Part(), roof = new Part(), win = new Part()

const PLAZA = 6.5

// The hall, stone from the canyon-side ground to its roof. Its west half
// stands forward to the plaza (photos Quinn and 5852: the stone mass with
// the chimney and a door); the east half sits back behind the porch.
const HALL: XY[] = [[-8.8, 0.6], [-1, 0.6], [-1, 4], [5, 4], [5, 9], [-8.8, 9]]
prism(stone, HALL, 0, 10.4, 0.15)
// The ragged rubble top along the plaza walls and the ends.
const ragged: [number, number, number, number, number][] = [
  [-8.8, -5.2, 0.6, 1.5, 11.2], [-5.2, -3.0, 0.6, 1.4, 11.9], [-3.0, -1, 0.6, 1.5, 11.4],
  [-1.9, -1, 1.5, 4, 11.6], [-1, 2.2, 4, 4.9, 12.2], [2.2, 5, 4, 4.9, 11.6],
  [4.2, 5, 4.9, 9, 11.2], [-8.8, -8.0, 1.5, 9, 11.0],
]
for (const [x0, x1, y0, y1, z] of ragged) box(stone, x0, x1, y0, y1, 10.2, z, 0.15)
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
for (const x of [1.6, 4.0, 6.3]) post(log, [x, 0.5], 0.22, PLAZA - 0.6, 8.7, 6)

// The chimney over the fireplace alcove, at the hall's west end: a rubble
// stack narrowing to its top.
frustum(stone, [-8.8, -5.6, 0.6, 3.8], [-7.9, -6.5, 1.2, 2.6], 10.2, 15.5)

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


await save('grand-canyon-hermits-rest', 'Hermits Rest', [
  // Buff-grey rubble limestone, red-brown logs, the pale flat roofs.
  { part: stone, material: finish('hermits-stone', 0xd6c8ae) },
  { part: log, material: finish('hermits-log', 0x8a5a45) },
  { part: roof, material: finish('hermits-roof', 0xd3cfc6) },
  { part: win, material: PALETTE.window },
], { bearing: 330, elevation: 0, height: 15.5 })
