/**
 * Mission San Juan Capistrano, the chapel (1756 onward, completed as a chapel
 * c. 1786), San Antonio Missions National Historical Park (UNESCO World
 * Heritage), Texas. A long, low, flat-roofed whitewashed chapel on the west
 * side of the mission compound, its long east side facing the plaza: a row of
 * shallow blind arches along its base with the doors in them, and over the
 * main door, towards the north end, the pierced espadaña: a bell wall in two tiers (two
 * bells below, one above) with scrolled shoulders, finials and a cross.
 * The espadaña is a thin pierced wall (see-through openings), built with the
 * helper in sat-mission-espada.ts.
 * The espadaña is a thin pierced wall with see-through openings, built with
 * `piercedWall` from sat-mission-espada.ts (merge that file first).
 * Original procedural geometry, CC0-1.0.   bun generators/sat-mission-san-juan.ts
 *
 * Frame: bearing 8.8 (the OSM outline is square to 0.1 m in it). x east,
 * y north, z up, metres. Drawn about -98.45534, 29.33298 and shifted by
 * (0.24, -3.14) so the origin is the area centroid of OSM way/130922311
 * (-98.455337, 29.333008).
 *
 * Ground: flat (Mapterhorn 0.0-0.4 m over 40 m). Elevation 0.
 *
 * Evidence
 * - OSM way/130922311 (building=church): in the frame, x -5.0..5.7 for
 *   y -7.7..7.8 and x -5.0..1.0 for y 7.8..17.1: 24.8 m long, matching the
 *   photo's 25 m facade.
 * - USGS lidar (2017) is no use here: the chapel stands under tree canopy
 *   (the grid shows only crowns); heights are from the photo.
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Mission san juan capistrano 2014.jpg" (Larry D. Moore, CC BY 4.0): the
 *     east side square on, scaled from the 2.4 m door at 48 px/m: the wall
 *     5.3 m rising to 6.9 at the north end, the espadaña 7.8 m across its
 *     scrolls, its lower tier 4.8 m wide to 10.2 with two bell openings, the
 *     upper tier 2.8 m wide to 13.0 with one, the cap to 13.7 and the cross to
 *     14.6; the blind arches 2.3 m wide to 3.2; the window at the north end;
 *   "Mission San Juan Capistrano 648.jpg" (Chris Light, CC BY-SA 4.0): the
 *     same side from across the compound, the buttress piers between the
 *     arches.
 *
 * Doubts: OSM's plan has the north part (y 7.8..17.1) 4.7 m shallower on
 * the east; the photo shows one straight east face with the arcade running
 * under the espadaña, so the model follows the photo and stands up to 4.7 m
 * east of OSM's line there (open ground; no other building). The west side and ends are drawn
 * plain (no photo).
 *
 * Night: the east side and espadaña softly floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, block, cross3 } from './sat-san-fernando-cathedral'
import { piercedWall, archRing, mirrorOutline } from './sat-mission-espada'

const white = new Part(), stone = new Part(), roof = new Part(), win = new Part(), wood = new Part(), dark = new Part()
const E: XY = [1, 0]
const sE = (y: number) => y

// the chapel, flat-roofed behind low parapets: lower to the south, taller
// behind the espadaña. The east face is drawn straight along its whole
// length, as the photo shows it (OSM steps it back 4.7 m north of y 7.8).
block(white, -5.0, 5.7, -7.7, 7.8, 0, 5.3, 0.15, roof)
block(white, -5.0, 5.7, 7.8, 17.1, 0, 6.6, 0.15, roof)
// the blind arcade along the east side, with piers, and the doors in it
for (let k = 0; k < 7; k++) {
  const y = -6.4 + k * 2.6
  onWall(stone, [5.7, 0], E, roundPts(sE(y), 2.2, 0, 3.2, 8), 0.03)
  onWall(white, [5.7, 0], E, roundPts(sE(y), 1.9, 0, 3.0, 8), 0.05)
  block(white, 5.7, 6.05, y + 1.1, y + 1.5, 0, 3.6, 0.05)
}
onWall(wood, [5.7, 0], E, rectPts(sE(-3.8) - 0.4, sE(-3.8) + 0.4, 0, 2.2), 0.07)
onWall(wood, [5.7, 0], E, rectPts(sE(-7.1) - 0.35, sE(-7.1) + 0.35, 0, 2.0), 0.07)
onWall(win, [5.7, 0], E, rectPts(sE(-5.9) - 0.3, sE(-5.9) + 0.3, 3.9, 4.4), 0.06)
// the main door in a grey stone surround, and the north window
onWall(stone, [5.7, 0], E, rectPts(sE(6.6) - 0.95, sE(6.6) + 0.95, 0, 3.1), 0.07)
onWall(wood, [5.7, 0], E, rectPts(sE(6.6) - 0.55, sE(6.6) + 0.55, 0, 2.45), 0.1)
onWall(win, [5.7, 0], E, rectPts(sE(14.8) - 0.6, sE(14.8) + 0.6, 3.6, 4.8), 0.06)

// the espadaña: a thin white bell wall (0.9 m) rising from the east wall,
// its outline curved (scroll shoulders, a scalloped crest) and its three bell
// openings cut right through, read from the photo at 48 px/m
{
  const X0 = 5.05, X1 = 5.95, Y = 9.4
  const half: XY[] = [
    [3.9, 6.2], [3.9, 6.9], [3.98, 7.15], [3.85, 7.4], [3.55, 7.5], // the outer volute
    [3.1, 7.6], [2.8, 7.85], [2.58, 8.2], [2.45, 8.7], // the concave rise to the lower tier
    [2.45, 10.2], [2.6, 10.2], [2.6, 10.5], // its cornice
    [2.3, 10.55], [2.05, 10.75], [1.8, 11.05], [1.6, 11.45], [1.45, 11.9], // the upper scroll
    [1.45, 13.0], [1.6, 13.0], [1.6, 13.25], // the upper cornice
    [1.1, 13.3], [0.8, 13.5], [0.45, 13.7], [0, 13.78], // the scalloped crest
  ]
  const holes = [archRing(Y - 1.2, 1.2, 8.3, 10.0, 6), archRing(Y + 1.2, 1.2, 8.3, 10.0, 6), archRing(Y, 1.1, 10.95, 12.8, 6)]
  piercedWall(white, X0, X1, mirrorOutline(half, Y), holes)
  cross3(stone, (X0 + X1) / 2, Y, 13.75, 0.95, 0.14)
  // finials on the shoulders and the lower tier's corners
  for (const s of [-1, 1]) {
    block(white, X0 + 0.15, X1 - 0.15, Y + s * 2.25 - 0.22, Y + s * 2.25 + 0.22, 10.5, 11.0, 0.05)
    block(white, X0 + 0.15, X1 - 0.15, Y + s * 3.55 - 0.2, Y + s * 3.55 + 0.2, 7.5, 7.95, 0.05)
  }
  // a bell hanging in each opening (dark bronze), seen through the wall
  for (const [d, zt] of [[-1.15, 10.0], [1.15, 10.0], [0, 12.75]]) block(dark, X0 + 0.2, X1 - 0.2, Y + d - 0.25, Y + d + 0.25, zt - 1.25, zt - 0.6, 0.06)
}

// ---------------------------------------------------------------------------
const all = [white, stone, roof, win, wood, dark]
shift(all, 0.24, -3.14)
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : n[0] > 0.5 ? 0.7 : 0.25)
const parts = [
  { part: white, material: { ...finish('sanjuan-whitewash', 0xf3f1ea), floodlight: lit } },
  { part: stone, material: { ...finish('sanjuan-grey-stone', 0xb9b2a4), floodlight: lit } },
  { part: roof, material: { ...PALETTE.roof, color: 0xb3b2aa } },
  { part: win, material: PALETTE.window },
  { part: wood, material: finish('sanjuan-door', 0x7a5c40) },
  { part: dark, material: finish('sanjuan-bell-bronze', 0x5a5146) },
]
const glb = writeGlb('Mission San Juan Capistrano', parts, {
  license: 'CC0-1.0', bearing: 8.8, elevation: 0, anchor: [29.333008, -98.455337],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/130922311'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Mission San Juan Capistrano', parts, glb, 5000)
const out = new URL('../models/sat-mission-san-juan.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
