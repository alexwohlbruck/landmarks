/**
 * Brooklyn Bridge, Brooklyn approach (1883) — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-brooklyn-bridge-brooklyn-approach.ts
 *
 * The three granite blocks of the bridge's masonry approach on the Brooklyn
 * side, landward of the anchorage, between the street crossings: over the
 * Brooklyn-Queens Expressway's ramps, beside Prospect Street, and the
 * wedge at Cadman Plaza East where the promenade comes down. The streets
 * between them are crossed on plate girders, which the map draws as its own
 * decks over its own bridge outlines; so does it the roadways, the promenade
 * and their parapets on top. This model is only the masonry under them: the
 * walls, a cornice, and the blind arches along the long sides, each filled
 * with a brick wall and a small window.
 *
 * Frame: the Brooklyn Bridge model's own, x across the bridge, y along it
 * toward Manhattan, z up, metres; placed at the same bearing, 316.18°, with
 * the anchor on the bridge's centre line 705 m on the Brooklyn side of the
 * point midway between the towers. z = 0 is the lowest ground under the
 * blocks (`D0`, about 10 m NAVD88).
 *
 * Height. Each block's top follows the map's roadways over it, 0.4 m under
 * them, so the roadways rest on the masonry rather than floating over it or
 * being cut by it: under each roadway its own height, across the strip under
 * the promenade a slope from one roadway to the other, and past a roadway's
 * outer edge that roadway's height, as a ledge; and under the promenade
 * where it comes down below the roadways, at Cadman Plaza East, its height. The map has the west
 * roadway 2.5 to 3 m above the east one here; the real ones are level, and
 * the blocks follow the map. If the map's profile changes, regenerate
 * `ROADS` (from barrelman's bridge_decks) and this model.
 *
 * Standing on the terrain. The walls run down to the ground vertex by
 * vertex, from a 2.5 m table of the map's own terrain in this frame
 * (`GROUND`: AWS Terrain Tiles, from USGS 3DEP, as Parchment draws them),
 * less D0. (A 5 m 3DEP table misses the map's hump along the Manhattan-side
 * end by up to 3.7 m, enough for the map not to see the feet as following
 * its terrain.) Every foot sits at the DEM less a constant, so a map
 * that finds a model's ground from its lowest vertices drapes the blocks
 * over its terrain, as it does the bridge, instead of setting them rigidly
 * on their mean ground.
 *
 * Sources:
 * - OSM: the blocks way/1255692942 (height=12), way/1255692947 (9) and
 *   way/888759008 (5), all building=yes, bridge:support=abutment,
 *   material=stone, colour #d8d5ca; the girder crossings between them,
 *   way/888759003, way/888759005 and way/888759007 (man_made=bridge,
 *   layer=1), left to the map. The footprints, pilaster notches included,
 *   are OSM's; the heights are not (OSM's are the street-side walls' tops
 *   at their lowest; the blocks reach up to the roadways, 3–17 m above
 *   their streets).
 * - Wikipedia, "Brooklyn Bridge": "The approaches are supported by
 *   Renaissance-style arches made of masonry; the arch openings themselves
 *   were filled with brick walls, with small windows within." The Brooklyn
 *   approach is 971 ft long.
 * - "Chapter 04: Bridges to Brooklyn", nycsubway.org (from the 1883 opening
 *   accounts): the Brooklyn approach "spans several streets by plate
 *   girders" and is 100 ft wide.
 * - The masonry's colours are the bridge model's granite, curtain and trim,
 *   which OSM's #d8d5ca and the anchorage photos agree with.
 *
 * Estimated or simplified:
 * - The arches' rhythm (a bay about every 11 m, the arch 0.6 of it), their
 *   crowns 2.6 m under the top, and the window in each (1.4 × 2 m): no open
 *   photo of these walls was at hand; the anchorage's blind arches set the
 *   style.
 * - The walls are plumb; the cornice is a plain band 0.4 m proud.
 * - The heights follow the map's roadways, not the real ones (see Height).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { groundAt, type GroundGrid } from './bridge-kit'
import { PALETTE } from './palette'

// The abutments, in this frame, counter-clockwise or not (OSM order); [x, y].
const W1255692942: [number, number][] = [[-17.03, 95.12], [-17.06, 90.61], [-15.59, 90.59], [-16.1, 24.46], [-17.49, 24.44], [-17.52, 20.08], [-15.05, 20.05], [-9.87, 25.18], [-0.11, 34.86], [5.21, 40.15], [10.55, 45.44], [14.59, 49.45], [15.81, 49.45], [15.88, 53.18], [14.67, 53.12], [14.77, 59.47], [15.94, 59.46], [15.95, 63.07], [13.89, 65.26], [10.31, 69.07], [5.19, 74.52], [-0.29, 80.37], [-8.77, 89.42], [-14.08, 95.07]]
const W1255692947: [number, number][] = [[-16.65, -5.42], [-16.52, -8.83], [-15.77, -8.81], [-15.39, -19.76], [-16.24, -19.79], [-16.14, -22.75], [-14.46, -22.7], [-9.37, -27.9], [-1.42, -36.01], [1.81, -39.26], [5.53, -43.1], [9.51, -47.21], [11.98, -49.65], [13.95, -51.68], [14.59, -52.33], [15.95, -52.33], [15.91, -48.79], [14.85, -48.8], [14.92, 20.01], [15.92, 20.01], [15.91, 23.79], [14.27, 23.81], [10.92, 20.46], [4.9, 14.44], [-0.37, 9.18], [-9.96, -0.42], [-14.91, -5.37]]
const W888759008: [number, number][] = [[-15.05, -48.37], [-13.02, -63.51], [-11.25, -76.47], [-8.87, -94.12], [0.72, -84.81], [3.67, -81.96], [5.96, -79.73], [9.18, -76.61], [9.06, -73.23], [5.82, -69.91], [2.58, -66.58], [-0.44, -63.5], [-5.76, -58.06], [-11.05, -52.69]]

// The map's roadways over the approach (barrelman bridge_decks, bake of 2026-10-23):
// per 3 m station y, each roadway's [x from, x to, height above NAVD88]: west, east, promenade.
type Across = [number, number, number] | null
const ROADS: [number, Across, Across, Across][] = [
  [-101.0, [-8.13, 7.32, 24.7], [4.14, 18.62, 23.01], [1.35, 4.32, 24.16]],
  [-98.0, [-8.38, 7.06, 24.86], [3.87, 18.47, 23.12], [0.96, 3.93, 24.31]],
  [-95.0, [-8.64, 6.8, 25.03], [3.6, 18.32, 23.24], [0.56, 3.54, 24.5]],
  [-92.0, [-8.9, 6.54, 25.21], [3.33, 18.1, 23.38], [0.17, 3.15, 24.7]],
  [-89.0, [-9.16, 6.27, 25.39], [3.06, 17.87, 23.53], [-0.23, 2.75, 24.92]],
  [-86.0, [-9.44, 6.0, 25.58], [2.82, 17.64, 23.7], [-0.57, 2.42, 25.14]],
  [-83.0, [-9.72, 5.72, 25.77], [2.59, 17.41, 23.87], [-0.82, 2.17, 25.38]],
  [-80.0, [-9.99, 5.45, 25.97], [2.4, 17.23, 24.06], [-1.04, 1.95, 25.62]],
  [-77.0, [-10.23, 5.22, 26.17], [2.22, 17.06, 24.25], [-1.2, 1.79, 25.87]],
  [-74.0, [-10.47, 4.99, 26.37], [2.09, 16.94, 24.44], [-1.37, 1.63, 26.12]],
  [-71.0, [-10.7, 4.77, 26.58], [1.97, 16.81, 24.63], [-1.53, 1.47, 26.38]],
  [-68.0, [-10.87, 4.62, 26.78], [1.85, 16.7, 24.81], [-1.69, 1.3, 26.64]],
  [-65.0, [-10.95, 4.54, 26.98], [1.73, 16.59, 25.0], [-1.85, 1.14, 26.89]],
  [-62.0, [-11.05, 4.43, 27.19], [1.68, 16.53, 25.17], [-2.02, 0.98, 27.14]],
  [-59.0, [-11.16, 4.3, 27.38], [1.62, 16.48, 25.35], [-2.19, 0.81, 27.38]],
  [-56.0, [-11.38, 4.06, 27.58], [1.59, 16.43, 25.5], [-2.34, 0.66, 27.62]],
  [-53.0, [-11.73, 3.68, 27.77], [1.6, 16.43, 25.64], [-2.46, 0.53, 27.84]],
  [-50.0, [-12.08, 3.31, 27.95], [2.0, 16.76, 25.78], [-2.57, 0.43, 28.06]],
  [-47.0, [-12.44, 2.95, 28.13], [2.4, 17.12, 25.91], [-2.64, 0.35, 28.27]],
  [-44.0, [-12.8, 2.59, 28.3], [2.87, 17.64, 26.02], [-2.72, 0.28, 28.47]],
  [-41.0, [-13.16, 2.23, 28.46], [3.24, 18.06, 26.13], [-2.79, 0.21, 28.66]],
  [-38.0, [-13.52, 1.87, 28.62], [3.21, 18.05, 26.23], [-2.87, 0.13, 28.84]],
  [-35.0, [-13.88, 1.51, 28.77], [3.18, 18.04, 26.33], [-2.94, 0.06, 29.02]],
  [-32.0, [-14.24, 1.17, 28.91], [3.16, 18.02, 26.41], [-3.01, -0.01, 29.2]],
  [-29.0, [-14.6, 0.85, 29.05], [3.13, 17.99, 26.49], [-3.09, -0.09, 29.37]],
  [-26.0, [-14.8, 0.67, 29.18], [3.11, 17.97, 26.56], [-3.16, -0.16, 29.54]],
  [-23.0, [-14.87, 0.62, 29.3], [3.09, 17.95, 26.63], [-3.23, -0.23, 29.7]],
  [-20.0, [-14.94, 0.56, 29.41], [3.07, 17.93, 26.7], [-3.31, -0.31, 29.86]],
  [-17.0, [-15.0, 0.49, 29.51], [3.05, 17.91, 26.76], [-3.38, -0.38, 30.02]],
  [-14.0, [-15.07, 0.43, 29.61], [3.06, 17.92, 26.82], [-3.45, -0.45, 30.18]],
  [-11.0, [-15.13, 0.36, 29.69], [3.08, 17.94, 26.87], [-3.53, -0.53, 30.33]],
  [-8.0, [-15.2, 0.3, 29.77], [3.12, 17.98, 26.92], [-3.57, -0.58, 30.49]],
  [-5.0, [-15.26, 0.23, 29.84], [3.16, 18.02, 26.97], [-3.59, -0.6, 30.64]],
  [-2.0, [-15.31, 0.19, 29.91], [3.2, 18.06, 27.02], [-3.36, -0.37, 30.8]],
  [1.0, [-15.34, 0.16, 29.97], [3.25, 18.11, 27.06], [-2.87, 0.11, 30.95]],
  [4.0, [-15.35, 0.15, 30.03], [3.29, 18.15, 27.11], [-2.42, 0.56, 31.11]],
  [7.0, [-15.34, 0.16, 30.08], [3.33, 18.19, 27.15], [-2.01, 0.98, 31.26]],
  [10.0, [-15.33, 0.17, 30.13], [3.38, 18.23, 27.2], [-1.83, 1.16, 31.42]],
  [13.0, [-15.31, 0.19, 30.18], [3.42, 18.28, 27.24], [-1.82, 1.18, 31.58]],
  [16.0, [-15.3, 0.2, 30.23], [3.46, 18.32, 27.28], [-1.8, 1.2, 31.73]],
  [19.0, [-15.29, 0.21, 30.28], [3.49, 18.35, 27.32], [-1.77, 1.23, 31.89]],
  [22.0, [-15.28, 0.22, 30.33], [3.48, 18.34, 27.37], [-1.74, 1.26, 32.05]],
  [25.0, [-15.26, 0.24, 30.37], [3.46, 18.32, 27.41], [-1.71, 1.29, 32.21]],
  [28.0, [-15.22, 0.28, 30.42], [3.41, 18.27, 27.46], [-1.68, 1.32, 32.37]],
  [31.0, [-15.17, 0.33, 30.46], [3.37, 18.23, 27.51], [-1.65, 1.35, 32.54]],
  [34.0, [-15.12, 0.38, 30.5], [3.32, 18.18, 27.56], [-1.63, 1.37, 32.7]],
  [37.0, [-15.07, 0.43, 30.55], [3.28, 18.14, 27.61], [-1.62, 1.38, 32.87]],
  [40.0, [-15.02, 0.48, 30.59], [3.23, 18.09, 27.66], [-1.63, 1.37, 33.03]],
  [43.0, [-14.96, 0.53, 30.63], [3.19, 18.05, 27.72], [-1.64, 1.36, 33.2]],
  [46.0, [-14.91, 0.58, 30.68], [3.15, 18.01, 27.77], [-1.65, 1.35, 33.37]],
  [49.0, [-14.86, 0.64, 30.72], [3.12, 17.97, 27.83], [-1.66, 1.34, 33.55]],
  [52.0, [-14.81, 0.69, 30.76], [3.09, 17.94, 27.88], [-1.68, 1.32, 33.72]],
  [55.0, [-14.76, 0.74, 30.8], [3.06, 17.92, 27.94], [-1.69, 1.31, 33.9]],
  [58.0, [-14.71, 0.79, 30.84], [3.03, 17.89, 28.0], [-1.7, 1.3, 34.07]],
  [61.0, [-14.66, 0.84, 30.88], [3.0, 17.86, 28.06], [-1.71, 1.29, 34.25]],
  [64.0, [-14.61, 0.89, 30.92], [2.97, 17.83, 28.12], [-1.72, 1.28, 34.42]],
  [67.0, [-14.55, 0.94, 30.96], [2.94, 17.8, 28.18], [-1.73, 1.27, 34.6]],
  [70.0, [-14.5, 0.99, 31.0], [2.93, 17.79, 28.24], [-1.75, 1.25, 34.78]],
  [73.0, [-14.45, 1.05, 31.05], [2.92, 17.78, 28.3], [-1.76, 1.24, 34.96]],
  [76.0, [-14.4, 1.1, 31.09], [2.92, 17.78, 28.36], [-1.77, 1.23, 35.14]],
  [79.0, [-14.35, 1.15, 31.13], [2.92, 17.78, 28.42], [-1.78, 1.22, 35.31]],
  [82.0, [-14.3, 1.2, 31.17], [2.92, 17.78, 28.48], [-1.75, 1.25, 35.49]],
  [85.0, [-14.25, 1.25, 31.22], [2.93, 17.78, 28.54], [-1.7, 1.3, 35.66]],
  [88.0, [-14.21, 1.29, 31.26], [2.93, 17.79, 28.6], [-1.65, 1.35, 35.84]],
  [91.0, [-14.17, 1.33, 31.3], [2.92, 17.78, 28.66], [-1.6, 1.4, 36.01]],
  [94.0, [-14.14, 1.36, 31.34], [2.89, 17.75, 28.72], [-1.54, 1.46, 36.19]],
  [97.0, [-14.13, 1.37, 31.39], [2.86, 17.72, 28.78], [-1.49, 1.51, 36.36]],
  [100.0, [-14.11, 1.39, 31.43], [2.81, 17.67, 28.84], [-1.44, 1.56, 36.52]],
]

// The map's terrain (AWS Terrain Tiles, from USGS 3DEP), metres, read as Parchment draws it every 2.5 m:
// rows along y from y = -100, columns across from x = -20.
const GROUND: GroundGrid = { y0: -100, x0: -20, step: 2.5, z: [
  [20.4, 19.4, 18.6, 18.1, 18.3, 19.4, 20.7, 22.0, 23.0, 23.1, 23.1, 23.1, 23.0, 23.1, 23.0, 22.6, 18.9],
  [21.4, 20.3, 19.4, 18.7, 19.3, 20.6, 22.0, 22.9, 23.2, 23.1, 23.1, 23.1, 23.1, 23.1, 22.9, 22.4, 18.1],
  [22.2, 21.2, 20.2, 19.5, 20.8, 22.1, 22.9, 23.2, 23.2, 23.2, 23.1, 23.2, 23.2, 22.7, 21.4, 21.0, 17.1],
  [22.6, 22.0, 21.3, 20.5, 21.9, 23.1, 23.3, 23.3, 23.2, 23.3, 23.3, 23.3, 22.8, 21.3, 19.6, 17.6, 16.5],
  [22.8, 22.7, 22.1, 21.4, 22.2, 23.2, 23.3, 23.3, 23.4, 23.4, 23.4, 22.9, 21.5, 19.8, 18.1, 16.6, 16.4],
  [22.6, 22.8, 22.7, 22.2, 22.7, 23.2, 23.2, 23.3, 23.5, 23.4, 22.9, 21.7, 19.9, 17.9, 16.8, 16.3, 16.2],
  [22.6, 22.7, 23.0, 23.0, 23.1, 23.2, 23.2, 23.3, 23.6, 22.8, 21.2, 18.6, 17.0, 16.6, 16.4, 16.2, 16.1],
  [22.6, 22.8, 23.1, 23.3, 23.2, 23.1, 23.1, 23.4, 23.1, 19.9, 17.2, 16.9, 16.7, 16.5, 16.3, 16.1, 16.0],
  [22.5, 22.8, 22.9, 23.3, 23.1, 23.1, 23.1, 23.2, 21.8, 18.4, 17.8, 17.3, 16.9, 16.6, 16.2, 16.0, 15.9],
  [22.5, 22.7, 22.9, 23.1, 23.0, 23.1, 23.1, 22.9, 20.8, 18.9, 18.3, 17.7, 17.1, 16.7, 16.2, 15.9, 15.8],
  [22.6, 22.7, 22.8, 22.9, 23.0, 23.0, 23.0, 22.7, 21.2, 19.9, 19.0, 18.2, 17.4, 16.7, 16.1, 15.8, 15.8],
  [22.6, 22.6, 22.7, 22.9, 23.0, 22.9, 23.0, 22.7, 21.5, 20.4, 19.4, 18.5, 17.6, 16.7, 15.9, 15.7, 15.6],
  [22.7, 22.6, 22.7, 22.9, 22.9, 22.9, 22.9, 22.7, 21.7, 20.6, 19.7, 18.6, 17.5, 16.5, 15.8, 15.6, 15.6],
  [22.4, 22.6, 22.7, 22.8, 22.8, 22.9, 22.9, 22.7, 21.7, 20.6, 19.5, 18.7, 17.9, 16.6, 15.7, 15.6, 15.5],
  [21.8, 22.4, 22.6, 22.7, 22.8, 22.8, 22.7, 22.4, 21.5, 20.5, 19.4, 18.4, 17.6, 17.1, 16.0, 15.5, 15.5],
  [21.1, 21.9, 22.6, 22.6, 22.7, 22.6, 22.2, 21.6, 21.0, 20.3, 19.4, 18.4, 17.2, 16.4, 15.7, 15.6, 15.6],
  [20.2, 21.1, 22.5, 22.6, 22.5, 22.1, 21.5, 20.9, 20.2, 19.6, 19.0, 18.3, 17.4, 16.4, 15.7, 15.7, 15.6],
  [19.0, 20.3, 22.4, 22.4, 22.2, 21.6, 21.0, 20.4, 19.7, 19.1, 18.4, 17.7, 17.0, 16.3, 15.8, 15.7, 15.5],
  [18.0, 19.6, 21.8, 21.6, 21.4, 21.1, 20.7, 20.1, 19.5, 18.9, 18.3, 17.6, 17.0, 16.3, 15.9, 15.6, 15.4],
  [16.9, 17.8, 19.9, 20.0, 20.1, 20.0, 19.9, 19.6, 19.2, 18.6, 18.0, 17.4, 16.8, 16.2, 15.7, 15.4, 15.1],
  [16.0, 16.4, 18.0, 18.6, 18.6, 18.5, 18.5, 18.5, 18.4, 18.1, 17.7, 17.1, 16.5, 15.9, 15.5, 15.2, 15.0],
  [15.5, 15.6, 16.8, 17.1, 17.1, 17.1, 17.0, 17.0, 17.0, 17.0, 16.9, 16.6, 16.2, 15.7, 15.2, 15.0, 14.8],
  [15.2, 15.2, 15.6, 15.7, 15.7, 15.6, 15.6, 15.6, 15.6, 15.6, 15.5, 15.5, 15.4, 15.2, 15.0, 14.9, 14.8],
  [15.0, 14.9, 14.9, 14.9, 14.9, 14.9, 14.9, 14.9, 14.8, 14.8, 14.9, 14.9, 14.9, 14.9, 14.8, 14.7, 14.6],
  [14.8, 14.8, 14.7, 14.7, 14.7, 14.8, 14.8, 14.8, 14.8, 14.8, 14.8, 14.8, 14.8, 14.8, 14.7, 14.6, 14.4],
  [14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.8, 14.8, 14.8, 14.8, 14.8, 14.8, 14.7, 14.5, 14.4],
  [14.6, 14.6, 14.6, 14.6, 14.6, 14.6, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.6, 14.4, 14.3],
  [14.5, 14.5, 14.5, 14.5, 14.5, 14.5, 14.6, 14.6, 14.6, 14.6, 14.6, 14.6, 14.6, 14.6, 14.4, 14.2, 14.2],
  [14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.5, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.2, 14.1, 14.1],
  [14.3, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.4, 14.3, 14.3, 14.2, 14.2, 14.2, 14.2, 14.1, 14.0, 13.9],
  [14.3, 14.5, 14.5, 14.4, 14.4, 14.4, 14.4, 14.4, 14.3, 14.2, 14.2, 14.2, 14.1, 14.1, 14.0, 13.9, 13.8],
  [14.4, 14.5, 14.5, 14.4, 14.4, 14.3, 14.3, 14.2, 14.2, 14.1, 14.1, 14.0, 13.9, 13.9, 13.8, 13.8, 13.6],
  [14.3, 14.4, 14.4, 14.3, 14.3, 14.2, 14.2, 14.1, 14.0, 14.0, 13.9, 13.9, 13.8, 13.7, 13.7, 13.6, 13.5],
  [14.2, 14.3, 14.2, 14.2, 14.1, 14.1, 14.0, 14.0, 13.9, 13.8, 13.8, 13.7, 13.6, 13.6, 13.5, 13.5, 13.4],
  [14.1, 14.1, 14.1, 14.0, 14.0, 13.9, 13.9, 13.8, 13.7, 13.7, 13.6, 13.6, 13.5, 13.4, 13.4, 13.5, 13.4],
  [14.0, 14.1, 14.0, 14.0, 13.9, 13.9, 13.8, 13.7, 13.7, 13.6, 13.6, 13.5, 13.4, 13.4, 13.3, 13.3, 13.2],
  [13.9, 13.9, 13.9, 13.9, 13.8, 13.8, 13.7, 13.7, 13.6, 13.6, 13.5, 13.4, 13.4, 13.3, 13.2, 13.2, 13.2],
  [13.8, 13.8, 13.8, 13.7, 13.7, 13.7, 13.6, 13.6, 13.5, 13.5, 13.5, 13.4, 13.4, 13.3, 13.2, 13.1, 13.0],
  [13.7, 13.7, 13.7, 13.6, 13.6, 13.5, 13.5, 13.4, 13.4, 13.3, 13.3, 13.2, 13.2, 13.2, 13.1, 13.0, 12.9],
  [13.6, 13.6, 13.5, 13.4, 13.4, 13.3, 13.3, 13.3, 13.2, 13.2, 13.2, 13.2, 13.2, 13.2, 13.1, 12.9, 12.9],
  [13.5, 13.4, 13.4, 13.3, 13.3, 13.3, 13.2, 13.2, 13.2, 13.2, 13.1, 13.1, 13.0, 13.0, 12.9, 12.8, 12.9],
  [13.4, 13.3, 13.3, 13.3, 13.2, 13.2, 13.2, 13.2, 13.1, 13.1, 13.1, 13.1, 13.1, 13.0, 12.8, 12.7, 12.7],
  [13.3, 13.3, 13.2, 13.2, 13.2, 13.1, 13.1, 13.0, 13.0, 13.0, 12.9, 12.9, 12.9, 12.8, 12.7, 12.5, 12.6],
  [13.2, 13.2, 13.2, 13.2, 13.1, 13.1, 13.1, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 12.9, 12.7, 12.5, 12.6],
  [13.2, 13.1, 13.1, 13.0, 13.1, 13.1, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 12.7, 12.5, 12.4],
  [13.1, 13.1, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 12.9, 12.6, 12.4, 12.4],
  [13.0, 13.0, 13.1, 13.1, 13.1, 13.1, 13.1, 13.0, 12.9, 12.9, 12.8, 12.7, 12.7, 12.6, 12.4, 12.2, 12.2],
  [12.9, 12.9, 13.0, 13.1, 13.1, 13.1, 13.1, 13.1, 13.0, 13.0, 12.9, 12.9, 12.8, 12.8, 12.4, 12.2, 12.2],
  [12.8, 12.9, 12.9, 12.9, 12.9, 12.9, 12.9, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 12.6, 12.2, 12.2],
  [12.7, 12.7, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8, 12.8, 12.4, 12.2, 12.2],
  [12.6, 12.6, 12.8, 12.8, 12.7, 12.7, 12.7, 12.7, 12.7, 12.7, 12.7, 12.7, 12.7, 12.7, 12.3, 12.1, 12.1],
  [12.4, 12.4, 12.5, 12.5, 12.4, 12.4, 12.4, 12.4, 12.4, 12.3, 12.4, 12.4, 12.4, 12.4, 12.3, 12.1, 12.1],
  [12.4, 12.4, 12.4, 12.4, 12.3, 12.3, 12.2, 12.2, 12.1, 12.1, 12.1, 12.0, 12.0, 11.9, 12.0, 12.1, 12.1],
  [12.4, 12.3, 12.4, 12.3, 12.3, 12.2, 12.2, 12.2, 12.2, 12.1, 12.1, 12.1, 12.1, 12.0, 12.0, 12.0, 12.0],
  [12.3, 12.3, 12.3, 12.3, 12.3, 12.2, 12.2, 12.2, 12.2, 12.2, 12.1, 12.1, 12.1, 12.1, 12.0, 12.0, 12.1],
  [12.2, 12.2, 12.2, 12.2, 12.2, 12.2, 12.2, 12.2, 12.1, 12.1, 12.1, 12.1, 12.1, 12.1, 12.1, 12.1, 12.1],
  [12.1, 12.2, 12.3, 12.3, 12.3, 12.3, 12.2, 12.2, 12.2, 12.3, 12.2, 12.2, 12.3, 12.3, 12.1, 12.1, 12.2],
  [12.0, 12.1, 12.1, 12.1, 12.2, 12.2, 12.2, 12.3, 12.3, 12.4, 12.4, 12.5, 12.6, 12.6, 12.1, 12.1, 12.2],
  [11.9, 12.0, 12.1, 12.2, 12.2, 12.3, 12.3, 12.4, 12.5, 12.6, 12.6, 12.7, 12.7, 12.7, 12.3, 12.1, 12.2],
  [11.8, 12.0, 12.1, 12.2, 12.2, 12.3, 12.3, 12.4, 12.4, 12.5, 12.5, 12.5, 12.6, 12.6, 12.4, 12.2, 12.3],
  [11.8, 12.0, 12.0, 12.1, 12.1, 12.2, 12.2, 12.2, 12.3, 12.3, 12.4, 12.5, 12.5, 12.5, 12.5, 12.4, 12.4],
  [11.8, 11.8, 11.9, 12.0, 12.0, 12.1, 12.1, 12.2, 12.2, 12.3, 12.3, 12.4, 12.4, 12.5, 12.5, 12.5, 13.0],
  [11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.1, 12.2, 12.2, 12.3, 12.3, 12.4, 12.4, 12.4, 12.7, 12.9, 14.2],
  [11.6, 11.6, 11.6, 11.8, 11.9, 12.0, 12.1, 12.2, 12.2, 12.3, 12.3, 12.4, 12.4, 12.5, 12.9, 13.1, 14.9],
  [11.6, 11.5, 11.5, 11.6, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.4, 12.4, 12.6, 13.1, 14.1, 16.6],
  [11.4, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.3, 12.3, 12.4, 12.5, 12.9, 14.5, 16.6, 17.2],
  [11.3, 11.4, 11.6, 11.6, 11.6, 11.7, 11.8, 11.9, 12.1, 12.2, 12.3, 12.4, 12.7, 14.1, 16.8, 17.1, 17.2],
  [11.2, 11.3, 11.4, 11.6, 11.7, 11.8, 11.8, 11.9, 12.0, 12.1, 12.2, 12.5, 13.8, 16.6, 17.1, 17.1, 17.2],
  [11.1, 11.2, 11.3, 11.4, 11.6, 11.7, 11.8, 11.9, 11.9, 12.0, 12.3, 13.6, 16.5, 17.1, 17.1, 17.1, 17.2],
  [11.1, 11.1, 11.3, 11.4, 11.4, 11.6, 11.7, 11.8, 11.9, 12.1, 13.4, 16.3, 17.2, 17.2, 17.1, 17.1, 16.4],
  [11.0, 11.2, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.9, 13.2, 16.0, 17.3, 17.3, 17.2, 17.2, 16.5, 12.7],
  [10.9, 11.3, 11.3, 11.3, 11.4, 11.4, 11.5, 11.7, 13.0, 15.8, 17.3, 17.4, 17.3, 17.3, 16.7, 13.8, 11.4],
  [10.9, 11.1, 11.5, 11.4, 11.3, 11.4, 11.5, 12.8, 15.6, 17.4, 17.4, 17.4, 17.4, 16.9, 14.2, 11.4, 11.3],
  [10.7, 10.8, 11.0, 11.2, 11.4, 11.4, 12.5, 15.4, 17.4, 17.5, 17.5, 17.4, 17.0, 14.6, 11.5, 11.3, 11.2],
  [10.6, 10.8, 11.0, 11.0, 11.1, 12.2, 15.2, 17.5, 17.6, 17.6, 17.5, 17.1, 14.8, 11.7, 11.4, 11.3, 11.2],
  [10.5, 10.6, 10.8, 10.9, 11.9, 14.9, 17.4, 17.6, 17.6, 17.6, 17.2, 15.1, 11.8, 11.4, 11.4, 11.2, 11.1],
  [10.5, 10.5, 10.7, 11.6, 14.8, 17.3, 17.7, 17.7, 17.7, 17.3, 15.2, 12.0, 11.5, 11.4, 11.3, 11.1, 10.9],
  [10.3, 10.5, 11.3, 14.5, 17.2, 17.8, 17.8, 17.8, 17.5, 15.5, 12.2, 11.6, 11.5, 11.3, 11.0, 11.0, 10.9],
  [10.2, 10.8, 14.2, 17.2, 17.8, 17.8, 17.8, 17.6, 15.7, 12.6, 11.7, 11.6, 11.3, 10.8, 10.9, 10.8, 10.7],
  [10.3, 13.5, 17.0, 17.9, 17.9, 17.9, 17.8, 16.0, 12.9, 11.9, 11.7, 11.3, 10.6, 10.4, 10.4, 10.7, 10.7],
  [12.9, 16.6, 17.9, 18.0, 18.0, 17.9, 16.2, 13.2, 12.0, 11.7, 11.2, 10.4, 10.2, 10.0, 10.0, 10.4, 10.7],
]}

const CLEAR = 0.4    // the top's depth under the roadway over it
const BURY = 0.3     // where a roadway runs on the ground, the top stays this far under it
const CORNICE = [1.4, 0.3] as const // the cornice band, below the top
const PROUD = 0.4
const BAY = 11
const TILE = 4       // the top's triangles, at most this long a side

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const g = (x: number, y: number) => groundAt(GROUND, x, y)
const D0 = Math.min(...[W1255692942, W1255692947, W888759008].flat().map(([x, y]) => g(x, y)))

/** One roadway across a station: its heights' row, interpolated along y. */
function roadAt(y: number, k: 1 | 2 | 3): [number, number, number] | null {
  for (let i = 1; i < ROADS.length; i++) {
    const a = ROADS[i - 1], b = ROADS[i]
    if (y < a[0] || y > b[0]) continue
    const ra = a[k], rb = b[k]
    if (!ra || !rb) return ra ?? rb
    const t = (y - a[0]) / (b[0] - a[0])
    return [0, 1, 2].map((j) => ra[j] + (rb[j] - ra[j]) * t) as [number, number, number]
  }
  return null
}

/** The roadways' surface at (x, y), NAVD88: sloped across the gap between them, held flat past their outer edges. */
function roadways(x: number, y: number): number {
  const w = roadAt(y, 1), e = roadAt(y, 2)
  if (!w || !e) return (w ?? e)![2]
  const over = [w, e].filter(([a, b]) => x >= a && x <= b).map(([, , h]) => h)
  if (over.length) return Math.min(...over)
  if (x < w[0]) return w[2]
  if (x > e[1]) return e[2]
  const t = (x - w[1]) / (e[0] - w[1])
  return w[2] + (e[2] - w[2]) * Math.min(Math.max(t, 0), 1)
}

/** The lowest deck over (x, y): the roadways, or the promenade where it comes down below them. */
function roadway(x: number, y: number): number {
  const walk = roadAt(y, 3)
  const under = roadways(x, y)
  return walk && x >= walk[0] && x <= walk[1] ? Math.min(under, walk[2]) : under
}

const foot = (x: number, y: number) => g(x, y) - D0
const top = (x: number, y: number) => Math.max(roadway(x, y) - CLEAR, g(x, y) - BURY) - D0

const granite = new Part(), deck = new Part(), curtain = new Part(), trim = new Part(), glazing = new Part()

function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const ok = dot(cross(sub(b, a), sub(c, a)), n) >= 0
  const [q1, q3] = ok ? [b, d] : [d, b]
  p.tri(a, q1, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, q3, undefined, undefined, undefined, [n, n, n])
}

const area = (pts: [number, number][]) =>
  pts.reduce((s, [x0, y0], i) => { const [x1, y1] = pts[(i + 1) % pts.length]; return s + x0 * y1 - x1 * y0 }, 0) / 2

/** Ear-clipped triangles of a simple polygon, counter-clockwise. */
function ears(pts: [number, number][]): [number, number][][] {
  const idx = pts.map((_, i) => i), out: [number, number][][] = []
  const turn = (a: [number, number], b: [number, number], c: [number, number]) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: [number, number], a: [number, number], b: [number, number], c: [number, number]) =>
    turn(a, b, p) > 0 && turn(b, c, p) > 0 && turn(c, a, p) > 0
  while (idx.length > 3) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const a = pts[idx[(i + idx.length - 1) % idx.length]], b = pts[idx[i]], c = pts[idx[(i + 1) % idx.length]]
      const tn = turn(a, b, c)
      if (Math.abs(tn) < 1e-6) { idx.splice(i, 1); cut = true; break }
      if (tn < 0) continue
      if (idx.some((j) => ![a, b, c].includes(pts[j]) && inside(pts[j], a, b, c))) continue
      out.push([a, b, c]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) throw new Error('polygon would not triangulate')
  }
  out.push(idx.map((i) => pts[i]))
  return out
}

/** The polygon's part on the side of the line `n·p = d` where `n·p >= d`. */
function clip(pts: [number, number][], n: [number, number], d: number): [number, number][] {
  const out: [number, number][] = []
  const side = (p: [number, number]) => n[0] * p[0] + n[1] * p[1] - d
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], sa = side(a), sb = side(b)
    if (sa >= 0) out.push(a)
    if ((sa >= 0) !== (sb >= 0)) { const t = sa / (sa - sb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}

/** Where the top bends across the band of y from `ya`: the roadways' edges at its middle. */
const cutsAt = (ya: number) =>
  ([1, 2, 3] as const).map((k) => roadAt(ya + TILE / 2, k)).flatMap((r) => (r ? [r[0], r[1]] : [])).sort((a, b) => a - b)

/**
 * The top: cut into bands along y and, within each, at the roadways' edges,
 * where the top bends, so every flat triangle stays under the roadways.
 */
function roof(pts: [number, number][]) {
  const ys = pts.map(([, y]) => y)
  for (let i = Math.floor(Math.min(...ys) / TILE); i * TILE < Math.max(...ys); i++) {
    const ya = i * TILE, yb = ya + TILE
    const band = clip(clip(pts, [0, 1], ya), [0, -1], -yb)
    if (band.length < 3) continue
    const edges = [-Infinity, ...cutsAt(ya), Infinity]
    for (let j = 0; j < edges.length - 1; j++) {
      let piece = band
      if (edges[j] > -Infinity) piece = clip(piece, [1, 0], edges[j])
      if (edges[j + 1] < Infinity) piece = clip(piece, [-1, 0], -edges[j + 1])
      if (piece.length < 3 || Math.abs(area(piece)) < 1e-3) continue
      for (const [a, b, c] of ears(piece)) {
        const turn = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        if (Math.abs(turn) < .02) continue
        const [p, q] = turn > 0 ? [b, c] : [c, b]
        deck.tri([a[0], a[1], top(...a)], [p[0], p[1], top(...p)], [q[0], q[1], top(...q)])
      }
    }
  }
}

/**
 * Where along a to b (0–1) a wall's head must have a vertex to meet the top
 * exactly: the top's band lines and roadway cuts, and every TILE metres.
 */
function stops(a: [number, number], b: [number, number]): number[] {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / TILE))
  const ts = Array.from({ length: k + 1 }, (_, i) => i / k)
  const dy = b[1] - a[1], dx = b[0] - a[0]
  const lo = Math.min(a[1], b[1]), hi = Math.max(a[1], b[1])
  for (let i = Math.floor(lo / TILE); i * TILE <= hi; i++) {
    const ya = i * TILE
    if (Math.abs(dy) > 1e-9) ts.push((ya - a[1]) / dy)
    if (Math.abs(dx) > 1e-9) for (const x of cutsAt(ya)) {
      const t = (x - a[0]) / dx, y = a[1] + dy * t
      if (y >= ya && y <= ya + TILE) ts.push(t)
    }
  }
  return [...new Set(ts.filter((t) => t >= 0 && t <= 1).map((t) => Math.round(t * 1e6) / 1e6))].sort((p, q) => p - q)
}

/** A wall from a to b, from `lo` to `hi`, facing n. */
function wall(p: Part, a: [number, number], b: [number, number], n: V3, lo: (x: number, y: number) => number, hi: (x: number, y: number) => number) {
  const ts = stops(a, b)
  for (let i = 0; i < ts.length - 1; i++) {
    const [xa, ya] = [a[0] + (b[0] - a[0]) * ts[i], a[1] + (b[1] - a[1]) * ts[i]]
    const [xb, yb] = [a[0] + (b[0] - a[0]) * ts[i + 1], a[1] + (b[1] - a[1]) * ts[i + 1]]
    if (Math.hypot(xb - xa, yb - ya) < 1e-3) continue
    quad(p, [xa, ya, lo(xa, ya)], [xb, yb, lo(xb, yb)], [xb, yb, hi(xb, yb)], [xa, ya, hi(xa, ya)], n)
  }
}

/** A round-headed blind arch on a wall, flush, with its brick infill's window. */
function arch(c: [number, number], t: [number, number], n: V3, w: number) {
  const r = w / 2
  const ends = [-r, r].map((s) => [c[0] + t[0] * s, c[1] + t[1] * s])
  const floor = Math.max(...ends.map(([x, y]) => foot(x, y)))
  const crown = Math.min(...ends.map(([x, y]) => top(x, y))) - CORNICE[0] - 1.2
  const spring = crown - r
  if (spring - floor < 1.5) return
  const at = (s: number, z: number, out: number): V3 => [c[0] + t[0] * s + n[0] * out, c[1] + t[1] * s + n[1] * out, z]
  const ring: V3[] = [at(-r, floor, .04), at(r, floor, .04)]
  for (let i = 0; i <= 8; i++) { const a = (Math.PI * i) / 8; ring.push(at(r * Math.cos(a), spring + r * Math.sin(a), .04)) }
  const hub = at(0, floor, .04)
  for (let i = 1; i < ring.length; i++) {
    const [p, q] = [ring[i], ring[(i + 1) % ring.length]]
    const ok = dot(cross(sub(p, hub), sub(q, hub)), n) >= 0
    curtain.tri(hub, ok ? p : q, ok ? q : p, undefined, undefined, undefined, [n, n, n])
  }
  const z0 = Math.max(floor + .8, spring - 1.6)
  if (spring + r * .5 - z0 >= 1.6)
    quad(glazing, at(-.7, z0, .08), at(.7, z0, .08), at(.7, z0 + 2, .08), at(-.7, z0 + 2, .08), n)
}

/** The outline without the vertices that only bend it a few centimetres. */
function simplified(pts: [number, number][]): [number, number][] {
  const out = [...pts]
  for (let i = 0; i < out.length && out.length > 3;) {
    const a = out[(i + out.length - 1) % out.length], b = out[i], c = out[(i + 1) % out.length]
    const off = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / Math.hypot(c[0] - a[0], c[1] - a[1])
    if (off < .15) out.splice(i, 1)
    else i++
  }
  return out
}

function block(outline: [number, number][]) {
  const pts = simplified(area(outline) > 0 ? outline : [...outline].reverse())
  roof(pts)
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: [number, number] = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n: V3 = [t[1], -t[0], 0]
    wall(granite, a, b, n, foot, top)
    if (L < 6) continue
    // The cornice: a band PROUD of the wall, its ends stopped short of the corners.
    const o = (p: [number, number], s: number): [number, number] => [p[0] + n[0] * PROUD + t[0] * s, p[1] + n[1] * PROUD + t[1] * s]
    const a1 = o(a, .3), b1 = o(b, -.3)
    const c0 = (x: number, y: number) => top(x - n[0] * PROUD, y - n[1] * PROUD) - CORNICE[0]
    const c1 = (x: number, y: number) => top(x - n[0] * PROUD, y - n[1] * PROUD) - CORNICE[1]
    wall(trim, a1, b1, n, c0, c1)
    const up: V3 = [n[0] * .2, n[1] * .2, 1], down: V3 = [0, 0, -1]
    const back = (p: [number, number]): [number, number] => [p[0] - n[0] * PROUD, p[1] - n[1] * PROUD]
    const k = Math.max(1, Math.ceil(L / (2 * TILE)))
    for (let j = 0; j < k; j++) {
      const s0 = j / k, s1 = (j + 1) / k
      const P0: [number, number] = [a1[0] + (b1[0] - a1[0]) * s0, a1[1] + (b1[1] - a1[1]) * s0]
      const P1: [number, number] = [a1[0] + (b1[0] - a1[0]) * s1, a1[1] + (b1[1] - a1[1]) * s1]
      const B0 = back(P0), B1 = back(P1)
      quad(trim, [...P0, c1(...P0)], [...P1, c1(...P1)], [...B1, c1(...P1) + .15], [...B0, c1(...P0) + .15], up)
      quad(trim, [...P0, c0(...P0)], [...B0, c0(...P0)], [...B1, c0(...P1)], [...P1, c0(...P1)], down)
    }
    for (const s of [0, 1]) {
      const P = s ? b1 : a1, B = back(P), e: V3 = s ? [t[0], t[1], 0] : [-t[0], -t[1], 0]
      quad(trim, [...P, c0(...P)], [...B, c0(...P)], [...B, c1(...P)], [...P, c1(...P)], e)
    }
    // Blind arches along the long walls.
    if (L < 10) continue
    const bays = Math.max(1, Math.round(L / BAY)), bay = L / bays
    for (let j = 0; j < bays; j++) {
      const s = bay * (j + .5)
      arch([a[0] + t[0] * s, a[1] + t[1] * s], t, n, Math.min(bay * .6, bay - 2.5))
    }
  }
}

block(W1255692942)
block(W1255692947)
block(W888759008)

// ---- Write -----------------------------------------------------------------------

const list = [
  { part: granite, material: { name: 'granite', color: 0xd2c2ab } },
  { part: deck, material: PALETTE.roof },
  { part: curtain, material: { name: 'curtain-wall', color: 0xc3b19a } },
  { part: trim, material: { name: 'limestone-trim', color: 0xdcd0bd } },
  { part: glazing, material: { name: 'vault-window', color: 0x6f7d88 } },
]
const extras = {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the bridge centre line, on the lowest ground under the blocks',
  bearing: 316.18, elevation: 0, groundNAVD88: Math.round(D0 * 100) / 100, clearance: CLEAR,
}
console.log(list.map(({ part, material }) => `${material.name} ${part.triangles}`).join(", "))
const tris = list.reduce((s, { part }) => s + part.triangles, 0)
if (tris > 5000) throw new Error(`${tris} triangles, over 5000`)
const glb = writeGlb('Brooklyn Bridge, Brooklyn approach', list, extras)
if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over the 250 KB cap`)
const out = new URL('../models/nyc-brooklyn-bridge-brooklyn-approach.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes, ground ${D0.toFixed(2)} m NAVD88`)
