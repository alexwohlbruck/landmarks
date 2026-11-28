/**
 * Hunt's Tomb (George W. P. Hunt family tomb), Papago Park, Phoenix
 * (1931) — original procedural geometry, CC0-1.0.
 * bun generators/phx-hunts-tomb.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centre of OSM way/287818676 (building=yes, historic=tomb, height 6.1,
 * roof:shape pyramidal, NRHP 08000526, wikidata Q24192027),
 * -111.9443878, 33.4518971. Bearing 0: OSM draws it square to north.
 *
 * Identity (from the photos below):
 *  1. A plain square pyramid clad in white tile, standing alone on the top
 *     of a red butte.                                (byers, hill, close)
 *  2. A low terrace round it, edged by a red-brown wall where the hill
 *     falls away.                                              (hill)
 *  3. On one face a small dark doorway and a dark tablet. (byers)
 *  4. Floodlit at night: the white pyramid glows over the city. (byers)
 *
 * Plan: the pyramid is OSM's 6.3 by 6.5 m square. The lidar puts its apex
 * about a metre east of OSM's centre; OSM is kept. The terrace: the lidar's
 * flat pad, x -4.5..5.5, y -5.5..5.5.
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020), 0.5 m
 * grid. The terrace stands 1.4 m above the ground at its west edge and
 * 0.4 m above it at the east (the butte top falls west); the lidar's
 * highest return is 5.6 m above the terrace, which under-reads a sharp
 * apex on a 0.5 m grid. Published: 6.1 m (OSM height tag). Drawn 6.0 m
 * above the terrace, which matches byers' steepness.
 * Ground: Mapterhorn falls about 0.8 m across the terrace, lowest at a
 * corner, which is y = 0 here; the terrace top is 1.3 m above
 * that, and its walls run down to y = 0 all round. elevation 0.
 *
 * Estimated: the doorway and tablet sizes (scaled from byers against the
 * 6.3 m base); which face they are on (byers looks west over the city's
 * lights at dusk, so the face it shows is drawn as the east face).
 *
 * Photos (evidence, Wikimedia Commons):
 *  byers  "Hunts Tomb Papago Park Phoenix AZ.jpg", DaveByers, CC BY-SA 4.0,
 *         at dusk, floodlit: the tile, the doorway and tablet
 *         https://commons.wikimedia.org/wiki/File:Hunts_Tomb_Papago_Park_Phoenix_AZ.jpg
 *  hill   "2014, Papago Park Features Created by the Works Progress
 *         Administration, The Honoroable George W.P. Hunt Family Tomb on the
 *         Hilltop - panoramio.jpg", Chris English, CC BY-SA 3.0: the
 *         pyramid on its terrace and red wall, from below
 *         https://commons.wikimedia.org/wiki/File:2014,_Papago_Park_Features_Created_by_the_Works_Progress_Administration,_The_Honoroable_George_W.P._Hunt_Family_Tomb_on_the_Hilltop_-_panoramio.jpg
 *  close  "2013, Resting Place of the late Governor George W. P. Hunt -
 *         panoramio.jpg", Chris English, CC BY-SA 3.0: the pyramid on the
 *         butte top from the pond
 *         https://commons.wikimedia.org/wiki/File:2013,_Resting_Place_of_the_late_Governor_George_W._P._Hunt_-_panoramio.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the iron fence round the terrace is left out (too thin); the
 * terrace's outline beyond the lidar pad (the path's ramp) is left to the
 * map. The tile courses are not drawn.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { box, save } from './atl-flatiron-building'

if (import.meta.main) {
  const tile = new Part(), terrace = new Part(), dark = new Part()

  // The terrace: a pad with a red-brown wall, its top 1.3 m over y = 0.
  const T = 1.3
  box(terrace, -4.5, 5.5, -5.5, 5.5, 0, T, terrace, 0.15)

  // The pyramid: OSM's square, apex 6.0 m over the terrace, on a thin
  // white footing course.
  const hx = 3.14, hy = 3.26, Z0 = T + 0.25, APEX = T + 6.0
  box(tile, -hx - 0.1, hx + 0.1, -hy - 0.1, hy + 0.1, T, Z0, tile, 0.05)
  const c: V3[] = [[-hx, -hy, Z0], [hx, -hy, Z0], [hx, hy, Z0], [-hx, hy, Z0]], top: V3 = [0, 0, APEX]
  for (let i = 0; i < 4; i++) tile.tri(c[i], c[(i + 1) % 4], top)

  // The east face: a dark doorway and, beside it, a dark tablet, set flush
  // on the slope (byers).
  const k = hx / (APEX - Z0) // inward run per metre of rise
  const onEast = (y: number, z: number, out = 0.04): V3 => [hx - k * (z - Z0) + out, y, z]
  const panel = (y0: number, y1: number, z0: number, z1: number) =>
    dark.quad(onEast(y0, z0), onEast(y1, z0), onEast(y1, z1), onEast(y0, z1))
  panel(-1.7, -1.0, Z0, Z0 + 1.5) // doorway
  panel(-0.3, 0.9, Z0 + 0.3, Z0 + 1.7) // tablet

  await save('phx-hunts-tomb', "Hunt's Tomb", [
    { part: tile, material: { ...finish('hunt-tile', 0xf4f2ec), floodlight: (_p, n) => (n[2] < 0.95 ? 1 : 0.6) } },
    { part: terrace, material: finish('hunt-terrace', 0xc79b86) },
    { part: dark, material: finish('hunt-bronze', 0x5f5a55) },
  ], { height: APEX, anchor: [33.4518971, -111.9443878], bearing: 0 })
}
