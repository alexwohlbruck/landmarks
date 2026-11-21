/**
 * Yavapai Geology Museum (Yavapai Observation Station), South Rim, Grand
 * Canyon: procedural, CC0-1.0.
 * bun generators/grand-canyon-yavapai-geology-museum.ts
 *
 * Herbert Maier's 1928 observation station on the rim east of Grand Canyon
 * Village: a low building of rough buff Kaibab limestone that grows out of
 * the rim rock. What makes it read:
 * - the observation room on the canyon end, a band of big plate-glass view
 *   windows between stone piers under a thin flat roof with a log fascia,
 *   its north-east corner rounded, on a stone base that drops to the rock;
 * - the plaza side: a rubble wall whose top steps up to a taller centre,
 *   with log viga ends under the top, a plank door at the west end;
 * - the entrance in the inside corner at the east end, under a flat log
 *   canopy carried on a stone pillar;
 * - the pale flat roofs (NAIP).
 *
 * Uses the shared kit in grand-canyon-bright-angel-lodge.ts.
 *
 * Frame: x, y, z up, metres, turned to bearing 15 (the building's walls in
 * NAIP and lidar), so +y faces the canyon (north-north-east) and +x runs
 * east-south-east. Anchor (-112.11763, 36.06606), on OSM way/126467052.
 * The OSM outline sits about 6 m west of the building in lidar and NAIP
 * (both agree); the model follows lidar and NAIP, so the building lies at
 * x -3.8..17.3, y -5..14 in this frame.
 *
 * Sources:
 * - OSM way/126467052, ODbL (name, alt_name, identity; the plan is offset).
 * - USGS 3DEP lidar AZ_GrandCanyonNP_1_2019 (flown 2019), 0.5 m grid, read
 *   in the model's frame (heights over ground_min 2048.96 m): plaza ground
 *   106.5; ground under the observation room 101.5-103.5; observation room
 *   roof 109.8; plaza-side roofs 110.4; top of the south wall 112-113 (the
 *   juniper in front of it also returns there).
 * - USGS NAIP aerial (public domain): the plan, the rounded north-east
 *   corner, the east wing and the pale roofs.
 * - Photos (EVIDENCE):
 *   - "Yavapai Geology Museum.jpg", Michael Quinn (NPS), public domain,
 *     https://commons.wikimedia.org/wiki/File:Yavapai_Geology_Museum.jpg
 *     (from the west along the rim: the observation room and its windows);
 *   - "Yavapai Geology Museum - south-facing exterior.jpg", Grand Canyon
 *     NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:Yavapai_Geology_Museum_-_south-facing_exterior.jpg
 *     (the plaza side: stepped rubble wall, vigas, door, entrance);
 *   - "09431 Yavapai Geology Museum Grand Canyon (5590084543).jpg", Grand
 *     Canyon NPS, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:09431_Yavapai_Geology_Museum_Grand_Canyon_(5590084543).jpg
 *     (the observation room on its stone base over the rock, from the west).
 *
 * Numbers, above y = 0 = 101.5 m over ground_min (the lowest ground under
 * the footprint, at the observation room's north-west corner):
 * - plaza 5.1, observation room roof 8.3, plaza-side roofs 8.9: lidar;
 * - the stepped wall top 10.0 and 10.9: lidar 112-113 and the south photo
 *   (the centre about 2.5 door heights over the plaza), estimated;
 * - view windows 5.5-7.65, doors 2.3 m: estimated from the photos;
 * - the plan: NAIP, read on a 2 m grid in the model's frame (about 0.5 m).
 *
 * Not modelled: the railed overlook terraces round the building, the flag
 * pole and antenna, the stone steps.
 *
 * Doubts: the entrance's place in plan is read from the south photo and the
 * NAIP inside corner, not measured. The east wing's walls are seen in no
 * photo; they are drawn plain with one window band.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, panels, post, prism, rect, save, type XY } from './grand-canyon-bright-angel-lodge'

const stone = new Part(), log = new Part(), roof = new Part(), win = new Part()

const PLAZA = 5.1

// The observation room on the canyon end: stone from the rock to its roof,
// the north-east corner rounded (NAIP).
const arc: XY[] = []
for (let i = 0; i <= 6; i++) {
  const a = (Math.PI / 2) * (i / 6)
  arc.push([7 + 4 * Math.cos(a), 10 + 4 * Math.sin(a)])
}
const ROOM: XY[] = [[-3.8, 4], [11, 4], ...arc, [-3.8, 14]]
prism(stone, ROOM, 0, 8.0, 0.1, null)
// Its thin flat roof, overhanging, with a log fascia under the lip.
{
  const arcO: XY[] = []
  for (let i = 0; i <= 6; i++) {
    const a = (Math.PI / 2) * (i / 6)
    arcO.push([7 + 4.5 * Math.cos(a), 10 + 4.5 * Math.sin(a)])
  }
  const ROOF: XY[] = [[-4.3, 3.5], [11.5, 3.5], ...arcO, [-4.3, 14.5]]
  prism(log, ROOF, 7.75, 8.05, 0)
  prism(roof, ROOF, 8.05, 8.3, 0.05)
}
// The view windows, big panes between stone piers.
panels(win, [-3.8, 14], [-3.8, 4], 3, 2.8, 5.5, 7.65, 0.3)
panels(win, [7, 14], [-3.8, 14], 3, 3.1, 5.5, 7.65, 0.3)
for (let i = 0; i < 6; i++) panels(win, arc[i], arc[i + 1], 1, 0.85, 5.5, 7.65, 0)
panels(win, [11, 4], [11, 10], 1, 3.0, 5.5, 7.65, 2.0)

// The plaza-side block and the east wing, flat-roofed (lidar 110.4).
prism(stone, rect(0, 14, -5, 4.2), 0, 8.9, 0.25)
prism(stone, rect(10.8, 17.3, 3.75, 9), 0, 8.9, 0.25)
// The rubble wall along the plaza, its top stepping up to a taller centre.
box(stone, 2, 12, -5, -1.5, 8.6, 10.0, 0.35)
box(stone, 4.5, 9.5, -5, -2.5, 9.8, 10.9, 0.35)
// Viga ends under the wall top.
for (const x of [5, 6.3, 7.6, 8.9]) box(log, x - 0.22, x + 0.22, -5.5, -5, 8.6, 9.05, 0)
// The plank door at the west end of the plaza wall.
box(log, 1.0, 2.3, -5.06, -5, PLAZA, PLAZA + 2.3, 0)
// The plaza wall's small high windows and the east wing's window band.
panels(win, [14, -5], [14, 4.2], 1, 1.6, PLAZA + 0.9, PLAZA + 2.3, 3)
panels(win, [17.3, 3.75], [17.3, 9], 2, 1.6, PLAZA + 0.9, PLAZA + 2.4, 0.8)
panels(win, [17.3, 9], [11, 9], 1, 3.0, PLAZA + 0.6, PLAZA + 2.5, 1.2)

// The entrance in the inside corner: glazed doors on the east wing's south
// face, a flat roof on a log lintel, carried on a stone pillar.
panels(win, [14, 3.75], [17.3, 3.75], 1, 2.2, PLAZA, PLAZA + 2.6, 0.5)
box(log, 14, 17.6, 0.6, 1.0, PLAZA + 2.8, PLAZA + 3.2, 0)
box(roof, 13.9, 17.7, 0.4, 3.75, PLAZA + 3.2, PLAZA + 3.45, 0.05)
prism(stone, rect(16.3, 17.6, -0.4, 1.0), 0, PLAZA + 3.2, 0.2)
post(log, [14.4, 0.8], 0.18, PLAZA, PLAZA + 2.8, 6)

await save('grand-canyon-yavapai-geology-museum', 'Yavapai Geology Museum', [
  // Buff Kaibab limestone rubble, red-brown logs, the pale flat roofs.
  { part: stone, material: finish('yavapai-stone', 0xd9c3a1) },
  { part: log, material: finish('yavapai-log', 0x8a5a45) },
  { part: roof, material: finish('yavapai-roof', 0xd6d2c9) },
  { part: win, material: PALETTE.window },
], { bearing: 15, elevation: 0, height: 10.9 })
