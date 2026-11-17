/**
 * George Washington Bridge, New York tower (1931; Othmar Ammann, Cass
 * Gilbert) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-george-washington-bridge-new-york.ts
 * Needs `writeTower` from nyc-george-washington-bridge.ts, which has the
 * tower's design and all its sources; this file only stands it on its site.
 *
 * The same tower as the New Jersey one, which stands in the Hudson on the
 * water, set on the Manhattan shore in Fort Washington Park. Two things
 * differ, both from the site:
 *
 * - The pier stands on land. Mapterhorn (z15, the terrain the map draws)
 *   reads the ground under it 0.3–4.7 m NAVD88, higher on the landward side,
 *   where the New Jersey tower's water reads a flat -0.9 m. So the pier runs
 *   down to that ground vertex by vertex, every 2.5 m round its foot, from a
 *   2 m table of Mapterhorn heights plus 0.7 m taken in this frame
 *   (`GROUND`), and keeps its step (4.3 and 5.1 m above the river) where the
 *   ground is lower; where the ground rises over it, it stops at the ground.
 *   The step's wall and the legs' corner posts run on down to the ground
 *   inside the pier, hidden, so the model's lowest vertex everywhere under
 *   it is a foot on the ground. Every foot sits at the DEM's own height above the river datum, so
 *   a map that reads a model's ground from its lowest vertices drapes the
 *   tower over its terrain rather than lifting it rigidly by the mean rise of
 *   its footprint.
 * - The roadway is lower here. Lidar (USGS 3DEP NY_NewYorkCity 2017, 1 m
 *   grid, tools/lidar.py) reads the upper roadway's surface at 70.6–71.2 m
 *   NAVD88 within 12 m of the tower and the Hudson's surface at -0.7 m, so
 *   the deck stub's top is 71.5 m above the river, where the shared
 *   design has 74 m (between this and the New Jersey tower's 77 m). The
 *   stub keeps its 11 m depth.
 * - The pier's top is 5.1 m above the river (lidar, 5.1–5.2 m round the
 *   legs; the shared design has 4.5 m).
 *
 * Height: z = 0 is the Hudson as the lidar reads it, -0.7 m NAVD88, which is
 * what every structure height in nyc-george-washington-bridge.ts is measured
 * from; the top is 184 m above it.
 */
import { groundAt, type GroundGrid } from './bridge-kit'
import { writeTower } from './nyc-george-washington-bridge'

// Mapterhorn z15 under the pier plus 0.7 m: metres above the river datum,
// every 2 m in this frame (x across the bridge, y along it toward New
// Jersey), rows along y, columns across x.
const GROUND: GroundGrid = { y0: -16, x0: -38, step: 2, z: [
  [3.7, 3.7, 3.7, 3.7, 3.8, 3.8, 3.7, 3.7, 3.7, 3.7, 3.7, 3.8, 3.9, 3.9, 4.0, 4.1, 4.1, 4.2, 4.2, 4.3, 4.3, 4.4, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.7, 4.6, 4.5, 4.4, 4.2, 4.0, 3.7, 3.5, 3.2],
  [3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.8, 3.9, 3.9, 4.0, 4.1, 4.1, 4.2, 4.3, 4.3, 4.4, 4.5, 4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9, 4.9, 4.8, 4.7, 4.5, 4.3, 4.0, 3.8, 3.6, 3.3, 3.1],
  [3.7, 3.7, 3.7, 3.7, 3.7, 3.8, 3.8, 3.7, 3.7, 3.8, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 5.0, 5.0, 5.0, 5.0, 4.9, 4.7, 4.5, 4.3, 4.1, 3.7, 3.2, 2.9],
  [3.7, 3.7, 3.7, 3.7, 3.8, 3.8, 3.7, 3.7, 3.7, 3.8, 3.8, 3.9, 3.9, 4.0, 4.1, 4.2, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.7, 4.7, 4.8, 4.9, 5.0, 5.1, 5.1, 5.1, 5.1, 5.1, 5.0, 5.0, 5.1, 4.9, 4.0, 3.0, 2.8],
  [3.7, 3.6, 3.6, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.8, 3.8, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.3, 4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.8, 4.8, 4.9, 4.9, 5.0, 5.1, 5.1, 5.2, 5.2, 5.2, 5.4, 5.3, 4.1, 3.0, 2.7],
  [3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.7, 3.7, 3.7, 3.8, 3.8, 3.8, 3.9, 4.0, 4.0, 4.1, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8, 4.8, 4.9, 4.9, 5.0, 5.0, 5.1, 5.2, 5.2, 5.3, 5.2, 4.1, 2.8, 2.7],
  [3.5, 3.5, 3.5, 3.6, 3.6, 3.6, 3.7, 3.7, 3.7, 3.8, 3.8, 3.7, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.7, 4.8, 4.8, 4.8, 4.9, 5.1, 5.2, 5.2, 5.2, 4.3, 2.9, 2.7],
  [3.5, 3.5, 3.5, 3.6, 3.6, 3.6, 3.6, 3.7, 3.7, 3.8, 3.8, 3.7, 3.8, 3.9, 3.9, 4.0, 4.1, 4.2, 4.2, 4.3, 4.4, 4.5, 4.5, 4.6, 4.6, 4.6, 4.6, 4.7, 4.7, 4.7, 4.6, 4.7, 4.9, 5.1, 5.2, 5.2, 4.4, 3.1, 2.7],
  [3.5, 3.4, 3.5, 3.6, 3.6, 3.6, 3.7, 3.7, 3.7, 3.8, 3.7, 3.7, 3.7, 3.8, 3.9, 4.0, 4.1, 4.1, 4.2, 4.3, 4.3, 4.4, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.6, 4.5, 4.4, 4.5, 4.7, 4.9, 5.1, 5.2, 4.3, 2.9, 2.6],
  [3.4, 3.4, 3.5, 3.6, 3.6, 3.6, 3.7, 3.7, 3.7, 3.8, 3.8, 3.7, 3.7, 3.8, 3.8, 3.9, 4.0, 4.1, 4.2, 4.2, 4.3, 4.3, 4.3, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.2, 4.3, 4.5, 4.7, 4.9, 5.1, 4.5, 2.8, 2.5],
  [3.3, 3.4, 3.5, 3.6, 3.6, 3.6, 3.7, 3.7, 3.7, 3.8, 3.7, 3.7, 3.7, 3.7, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.2, 4.2, 4.2, 4.2, 4.3, 4.3, 4.3, 4.3, 4.3, 4.2, 4.0, 4.2, 4.4, 4.5, 4.7, 5.0, 4.4, 2.8, 2.4],
  [3.4, 3.3, 3.4, 3.6, 3.6, 3.6, 3.6, 3.7, 3.7, 3.8, 3.7, 3.7, 3.6, 3.7, 3.8, 3.8, 3.9, 4.0, 4.1, 4.1, 4.1, 4.1, 4.1, 4.1, 4.1, 4.2, 4.2, 4.2, 4.2, 4.0, 3.8, 3.9, 4.2, 4.3, 4.5, 4.9, 4.0, 2.6, 2.3],
  [3.3, 3.3, 3.4, 3.5, 3.6, 3.6, 3.7, 3.7, 3.7, 3.8, 3.7, 3.6, 3.6, 3.7, 3.8, 3.8, 3.9, 3.9, 3.9, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.1, 4.1, 4.1, 4.1, 3.9, 3.7, 3.8, 3.9, 4.0, 4.4, 4.9, 4.0, 2.1, 1.9],
  [3.3, 3.3, 3.4, 3.5, 3.6, 3.6, 3.6, 3.7, 3.7, 3.8, 3.8, 3.6, 3.6, 3.6, 3.7, 3.8, 3.8, 3.8, 3.8, 3.8, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 4.0, 4.0, 3.9, 3.7, 3.5, 3.6, 3.5, 3.7, 4.2, 4.8, 4.3, 2.0, 1.6],
  [3.2, 3.3, 3.3, 3.5, 3.6, 3.7, 3.7, 3.7, 3.7, 3.8, 3.7, 3.6, 3.6, 3.6, 3.6, 3.7, 3.7, 3.7, 3.7, 3.8, 3.7, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.9, 3.8, 3.5, 3.2, 3.3, 3.0, 3.2, 3.7, 4.5, 3.8, 1.9, 1.3],
  [3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.6, 3.5, 3.5, 3.5, 3.6, 3.6, 3.6, 3.6, 3.6, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.8, 3.7, 3.3, 3.0, 2.7, 2.4, 2.4, 2.6, 3.1, 2.4, 1.3, 1.1],
  [3.3, 3.3, 3.4, 3.5, 3.5, 3.6, 3.7, 3.6, 3.6, 3.6, 3.6, 3.6, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.6, 3.6, 3.6, 3.6, 3.6, 3.5, 3.1, 2.7, 2.4, 2.1, 1.8, 1.6, 1.6, 1.2, 1.0, 1.0],
] }

if (import.meta.main) await writeTower({
  id: 'nyc-george-washington-bridge-new-york',
  deck: 71.5,
  pier: 5.1,
  ground: (x, y) => groundAt(GROUND, x, y),
  extras: { datum: 'z = 0 is the Hudson as the 2017 lidar reads it, -0.7 m NAVD88' },
})
