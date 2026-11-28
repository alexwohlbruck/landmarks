/**
 * Burrard Bridge (Burrard Street Bridge), Vancouver (1930–32; architect
 * G. L. Thornton Sharp, engineer John R. Grant) — procedural, CC0-1.0.
 * bun generators/van-burrard-bridge.ts
 *
 * The whole structure inside the OSM outline, from the Kitsilano landing to
 * Pacific Street: the steel Pratt through truss of the centre span with its
 * arched top chord, between the two concrete pylon piers, each a pair of
 * art deco towers joined over the roadway by a gallery with a red tile roof;
 * the Warren deck trusses of the four close approach spans on concrete
 * piers; the concrete girder viaducts on paired-column bents beyond them to
 * an abutment at each end; the heavy concrete parapets.
 *
 * Frame: x across (+x to the right looking along +y), y along the bridge
 * toward downtown (north-east), z up, metres; origin at the centre of the
 * main span on the water (Mapterhorn reads 0.1–1 m on False Creek). Placed
 * at bearing 63.84°, the line of the two OSM road ways (way/23188868 and
 * way/849900149, straight over the whole bridge), anchored on it at the
 * middle of the outline's wider main-span stretch.
 *
 * OSM: outline way/492631024 (man_made=bridge, bridge:structure=truss,
 * Q919808), y = -572.2…+291.6, ±13 m wide, widening to ±15 over the main
 * span (y = -52.6…+52.6, where the through trusses stand outside the
 * sidewalks) and at the downtown end (y = 280…291.6). No separate
 * man_made=bridge approach outlines and no buildings under it; the small
 * building=bridge way/1523674587 nearby is off the bridge (90 m east).
 *
 * Published (Wikipedia "Burrard Bridge", the City's 2001 heritage study as
 * cited there): length 836 m, main span 89.6 m, "a high, five-part bridge
 * on four piers": a Pratt through truss in the centre, Warren deck trusses
 * in the two close approach spans each side; the central piers carried up
 * into towers joined by overhead galleries; heavy pierced concrete
 * parapets; 2.6 m sidewalks.
 *
 * Heights: no open lidar reaches Vancouver's bridges, so
 * `tools/bridge_ele.py` can't be used and no ele is tagged; all of these are ESTIMATED.
 * - roadway: 31 m over the water at the main span (Diego Delso's side-on
 *   panorama, photo 1, scaled on the 89.6 m span: deck 33 m to the pier
 *   footings), a crest flat over ±100 m as photos 1–3 show, then straight
 *   grades to the landings: 3.6 % to 12.3 m at the Kitsilano end (y = -572;
 *   Mapterhorn 11.8–12.4 there) and 5.0 % to 19.0 m at Pacific Street
 *   (y = 291.6; Mapterhorn 18.4–18.8).
 * - pylons: towers 16 m over the road (photo 1: 0.48 of the deck's height
 *   over the water), the gallery 10–14 m over the road under its red roof;
 *   the truss's crown 13 m over the road, its ends 6 m.
 * - spans: main-span piers at y = ±50 (10 m thick, so 90 m between faces);
 *   approach piers at ±135 and ±215 (photo 1: about 80 m spans); deck
 *   trusses 11 m deep (photo 1: half the deck's height over the water); viaduct bents every ~25 m (estimated).
 * - Mapterhorn ground (tools/terrain.ts, 5 x 4 m) under everything on land:
 *   S_GROUND and N_GROUND below. Under the south viaduct it reads 7–8 m on
 *   the axis but 3–5 m 20 m to the side: the DEM keeps a raised strip under
 *   the deck; the bents stand on the DEM as the map draws it.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * 1. "Puente Burrard, Vancouver, Canadá, 2017-08-14, DD 27.jpg", Diego
 *    Delso, CC BY-SA 4.0: side-on from the east (Granville Island side).
 * 2. "Burrard Bridge from the east.jpg", Ymblanter, CC BY-SA 4.0.
 * 3. "Burrard Bridge 02.JPG", Xicotencatl, CC BY-SA 4.0.
 * 4. "Burrard Street Bridge as gateway.jpg", Alethe, CC BY-SA 3.0: the
 *    pylon pairs, the galleries' red roofs, the truss from above.
 * 5. "Burrard Street Bridge in Night.JPG", Jayaddev, CC BY-SA 3.0 (night):
 *    pylons floodlit, lanterns in the towers' arched openings.
 *
 * Doubts: the deck heights and the pier stations are photo-scaled (±2 m,
 * ±5 m); the south viaduct's bent spacing and form are from far views
 * only; the ship-prow busts, the pylon ornament and the parapets' piercing
 * are left out; the downtown end's widening (y = 280–291.6) is drawn as the
 * abutment's wing walls.
 *
 * Night: the towers' arched openings are `window` (they glow), a `lamp`
 * lantern tops each tower, and the pylons are floodlit (`_FLOODLIGHT`).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, bead, chamferedRect, footedLoft, groundAt, merged, stations, strip, truss, type GroundGrid } from './bridge-kit'
import { beam, box, type Skin } from './sf-golden-gate-bridge'
import { PALETTE, finish } from './palette'

// ---- Measurements ---------------------------------------------------------------

const S_END = -572.2, N_END = 291.6
const CREST = 31, S_ROAD_END = 12.3, N_ROAD_END = 19.0, FLAT = 100
const gS = (CREST - S_ROAD_END) / (-S_END - FLAT / 2), gN = (CREST - N_ROAD_END) / (N_END - FLAT / 2)
/** The roadway (estimated), metres above the water. */
const road = (y: number): number => {
  const g = y < 0 ? gS : gN, a = Math.abs(y)
  return a <= FLAT ? CREST - (g * a * a) / (2 * FLAT) : CREST - (g * FLAT) / 2 - g * (a - FLAT)
}
const PYLON = 50, PIER_D = 5               // main piers at y = ±50, 10 m thick
const APPROACH = [135, 215]                // approach piers at ±135 and ±215
const TRUSS_X = 13.8, DECK_X = 12.0, EDGE = 13.0
const DECK_DEPTH = 11

const S_GROUND: GroundGrid = { y0: -580, x0: -24, step: 5, z: [
  [12.5, 11.9, 11.6, 11.8, 11.9, 12.1, 12.4, 12.6, 12.7, 12.8, 12.7, 12.9, 13.2], [12.4, 11.8, 11.4, 11.4, 11.5, 11.7, 11.8, 11.9, 11.9, 12, 12.1, 12.2, 12.4], [12.4, 11.7, 11.3, 11.2, 11.1, 11.2, 11.2, 11.3, 11.3, 11.4, 11.7, 11.9, 12],
  [12, 11.5, 11.1, 11.1, 11.1, 11.2, 11.2, 11.2, 11.2, 11.4, 11.6, 11.7, 11.7], [11.6, 11, 10.7, 10.7, 10.7, 10.7, 10.6, 10.6, 10.7, 11, 11.3, 11.2, 11.2], [10.9, 10.4, 10.2, 10.1, 10, 10, 10, 10, 10, 10, 10.1, 10.4, 10.4],
  [10.2, 10, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 10, 10.1], [10, 9.9, 9.9, 9.9, 9.9, 9.9, 10, 10, 10, 9.9, 10, 10, 10.1], [9.9, 9.9, 9.9, 9.9, 9.9, 10, 10, 10, 10, 10.1, 10.1, 10.1, 10.1],
  [9.9, 9.9, 9.9, 9.9, 9.9, 10, 10, 10, 10, 10, 10, 10, 10], [9.8, 9.8, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 10], [9.8, 9.8, 9.8, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9],
  [9.8, 9.8, 9.8, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9], [9.8, 9.8, 9.8, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.8], [9.9, 9.8, 9.8, 9.8, 9.8, 9.9, 9.9, 9.9, 9.9, 9.8, 9.8, 9.8, 9.8],
  [10, 9.8, 9.7, 9.7, 9.7, 9.8, 9.8, 9.8, 9.9, 9.8, 9.8, 9.8, 9.7], [10.1, 9.9, 9.7, 9.6, 9.7, 9.8, 9.8, 9.9, 9.9, 9.9, 9.8, 9.8, 9.7], [9.8, 9.8, 9.6, 9.6, 9.7, 9.7, 9.8, 9.8, 9.7, 9.7, 9.7, 9.7, 9.5],
  [9.5, 9.6, 9.5, 9.5, 9.5, 9.5, 9.5, 9.6, 9.5, 9.5, 9.5, 9.5, 9.4], [9.2, 9.4, 9.4, 9.4, 9.4, 9.4, 9.5, 9.4, 9.4, 9.4, 9.3, 9.3, 9.3], [9, 9.2, 9.2, 9.3, 9.3, 9.4, 9.4, 9.4, 9.3, 9.3, 9.3, 9.2, 9.2],
  [8.8, 8.9, 9, 9.1, 9.2, 9.2, 9.2, 9.2, 9.2, 9.1, 9.1, 9.1, 9.1], [8.7, 8.8, 8.9, 8.9, 9, 9, 9, 9, 9, 9, 9, 8.9, 8.9], [8.6, 8.7, 8.8, 8.8, 8.9, 8.9, 8.9, 8.9, 8.9, 8.8, 8.8, 8.8, 8.8],
  [8.8, 8.7, 8.7, 8.8, 8.8, 8.8, 8.8, 8.8, 8.7, 8.7, 8.7, 8.7, 8.7], [8.6, 8.6, 8.6, 8.7, 8.7, 8.8, 8.8, 8.7, 8.7, 8.7, 8.7, 8.6, 8.6], [8.4, 8.5, 8.6, 8.6, 8.7, 8.8, 8.8, 8.7, 8.7, 8.7, 8.6, 8.5, 8.5],
  [8.4, 8.4, 8.5, 8.5, 8.6, 8.7, 8.7, 8.8, 8.7, 8.6, 8.6, 8.5, 8.4], [8.4, 8.3, 8.3, 8.5, 8.6, 8.8, 8.7, 8.7, 8.6, 8.6, 8.5, 8.4, 8.4], [8.3, 8.3, 8.3, 8.3, 8.4, 8.4, 8.4, 8.5, 8.5, 8.5, 8.4, 8.4, 8.3],
  [8.3, 8.1, 8.2, 8.2, 8.3, 8.3, 8.3, 8.4, 8.4, 8.4, 8.4, 8.3, 8.3], [8.8, 8.1, 8, 8.1, 8.1, 8.2, 8.2, 8.3, 8.3, 8.4, 8.3, 8.3, 8.2], [9.5, 8.5, 8, 8, 8, 8.1, 8.1, 8.2, 8.3, 8.3, 8.3, 8.3, 8.2],
  [9.8, 8.8, 8.1, 7.9, 7.9, 8, 8.1, 8.2, 8.2, 8.2, 8.2, 8.2, 8.1], [9.5, 8.7, 8, 7.8, 7.9, 7.9, 8, 8, 8, 8.1, 8.1, 8.1, 8.1], [9.1, 8.2, 7.9, 7.8, 7.8, 7.9, 7.9, 8, 8, 8.1, 8.1, 8, 8],
  [8.7, 8, 7.8, 7.8, 7.8, 7.9, 7.9, 8, 8, 8, 8, 8, 8], [8.4, 7.7, 7.8, 7.8, 7.8, 7.8, 7.9, 7.9, 7.9, 8, 7.9, 7.9, 7.9], [8.2, 7.6, 7.6, 7.6, 7.7, 7.7, 7.8, 7.8, 7.8, 7.9, 7.9, 7.9, 7.9],
  [8.2, 7.4, 7.5, 7.6, 7.6, 7.7, 7.7, 7.8, 7.8, 7.8, 7.9, 7.9, 7.9], [8, 7.4, 7.5, 7.5, 7.5, 7.6, 7.6, 7.7, 7.7, 7.8, 7.8, 7.9, 7.8], [7.7, 7.2, 7.3, 7.4, 7.5, 7.6, 7.6, 7.7, 7.8, 7.8, 7.8, 7.8, 7.8],
  [7.6, 6.9, 7, 7.3, 7.6, 7.7, 7.7, 7.7, 7.8, 7.8, 7.8, 7.8, 7.8], [7.4, 6.9, 6.9, 7.3, 7.6, 7.7, 7.7, 7.7, 7.7, 7.7, 7.7, 7.8, 7.8], [7.5, 6.9, 7.2, 7.6, 7.5, 7.5, 7.6, 7.6, 7.6, 7.6, 7.6, 7.7, 7.8],
  [7.5, 6.9, 7.1, 7.5, 7.5, 7.4, 7.4, 7.5, 7.5, 7.6, 7.6, 7.7, 7.7], [7.4, 6.7, 6.9, 7.2, 7.3, 7.4, 7.4, 7.4, 7.5, 7.5, 7.6, 7.6, 7.7], [7.2, 6.6, 6.6, 7, 7.2, 7.4, 7.4, 7.4, 7.5, 7.5, 7.5, 7.6, 7.7],
  [7.3, 6.8, 6.8, 7.1, 7.2, 7.3, 7.4, 7.4, 7.5, 7.5, 7.5, 7.6, 7.6], [7.7, 7.6, 7.5, 7.5, 7.5, 7.5, 7.6, 7.6, 7.6, 7.5, 7.5, 7.5, 7.6], [7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.6, 7.5, 7.5, 7.4, 7.5],
  [6.1, 6.1, 6.2, 6.9, 7.5, 7.5, 7.6, 7.6, 7.6, 7.5, 7.5, 7.4, 7.5], [5.8, 5.8, 6.1, 7, 7.5, 7.6, 7.6, 7.5, 7.5, 7.4, 7.3, 7.4, 7.5], [5.8, 5.8, 6.2, 7.1, 7.6, 7.6, 7.6, 7.6, 7.5, 7.2, 7.1, 7.1, 7.4],
  [5.8, 5.8, 6.2, 7, 7.5, 7.6, 7.5, 7.4, 7.3, 7, 6.6, 6.6, 6.9], [5.7, 5.6, 6, 7.1, 7.6, 7.6, 7.5, 7.4, 7.3, 6.9, 6.2, 5.9, 5.9], [5.6, 5.5, 5.9, 7.1, 7.7, 7.6, 7.5, 7.4, 7.2, 6.6, 5.7, 5.4, 5.4],
  [5.6, 5.4, 5.8, 7.2, 7.9, 7.9, 7.7, 7.4, 7.1, 6.4, 5.4, 5, 4.9], [5.4, 5.3, 5.7, 7.1, 7.9, 7.9, 7.7, 7.4, 7.1, 6.3, 5.1, 4.5, 4.2], [5.3, 5.1, 5.5, 6.9, 7.8, 7.8, 7.6, 7.4, 7, 5.9, 4.7, 4, 3.7],
  [5.1, 5, 5.4, 6.9, 7.8, 7.8, 7.6, 7.4, 7, 6, 4.4, 3.6, 3.2], [5, 4.9, 5.4, 6.8, 7.8, 7.9, 7.7, 7.4, 7, 6.1, 4.5, 3.4, 3], [4.7, 4.6, 4.9, 6.4, 7.8, 8, 7.8, 7.5, 7.1, 6, 4.2, 3.1, 2.9],
  [4.5, 4.5, 4.9, 6.2, 7.6, 7.9, 7.6, 7.4, 7, 5.9, 4.2, 3.1, 2.8], [4.3, 4.2, 4.7, 6.1, 7.4, 7.6, 7.4, 7.1, 6.7, 5.7, 4.1, 3, 2.8], [4.1, 4, 4.6, 6.1, 7.4, 7.6, 7.3, 7.1, 6.8, 5.9, 4.1, 3, 2.8],
  [3.8, 3.9, 4.5, 6, 7.2, 7.6, 7.5, 7.3, 7.1, 5.8, 4.1, 3.1, 2.9], [3.6, 3.6, 4.2, 5.5, 6.5, 6.7, 6.6, 6.5, 6.2, 5.2, 3.8, 3, 2.8], [3.5, 3.4, 3.6, 4, 4.3, 4.4, 4.3, 4.2, 4, 3.6, 3.1, 2.9, 2.8],
  [3.3, 3.3, 3.4, 3.4, 3.4, 3.4, 3.3, 3.2, 3.1, 3, 2.9, 2.8, 2.8], [3.3, 3.4, 4, 4.7, 4.9, 4.9, 4.9, 4.8, 4.6, 4.2, 3.5, 3, 2.8], [3.4, 3.8, 5, 6.5, 7, 6.9, 7, 7.1, 6.9, 5.8, 4.4, 3.3, 2.8],
  [3.4, 4, 5.2, 6.7, 7.7, 7.8, 7.7, 7.6, 7.3, 6.4, 4.9, 3.4, 2.8], [3.4, 4, 5.4, 7, 7.9, 8, 7.9, 7.9, 7.8, 6.9, 5.1, 3.4, 2.8], [3.3, 3.8, 5.2, 6.9, 7.9, 8.1, 8.1, 8, 7.8, 6.7, 4.9, 3.4, 2.8],
  [3.1, 3.8, 5.2, 7, 8.1, 8.3, 8.3, 8.3, 8, 6.7, 4.8, 3.4, 2.8], [3, 3.6, 5.1, 7, 8.2, 8.4, 8.4, 8.4, 8, 6.7, 4.8, 3.4, 2.9], [2.8, 3.4, 4.9, 6.7, 8, 8.3, 8.3, 8.2, 7.8, 6.5, 4.5, 3.2, 2.8],
  [2.6, 3.2, 4.5, 6.4, 7.7, 8.1, 8.1, 7.9, 7.5, 6.1, 4.3, 3, 2.7], [1.9, 2.7, 4.1, 6, 7.5, 7.8, 7.7, 7.5, 7, 5.7, 4, 2.9, 2.6], [0.9, 2, 3.3, 4.8, 6.1, 6.6, 6.7, 6.6, 6.3, 5.1, 3.8, 2.9, 2.6],
  [0.3, 1.2, 2.4, 3.2, 3.9, 4.2, 4.3, 4.5, 4.4, 3.7, 2.9, 2.5, 2.4], [0.2, 0.4, 1.2, 1.8, 2.1, 2, 1.9, 1.8, 1.9, 1.9, 1.9, 1.8, 1.6], [0.4, 0.2, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.1],
  [0.5, 0.4, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
] }
const N_GROUND: GroundGrid = { y0: 35, x0: -24, step: 5, z: [
  [0.2, 0.3, 0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.6, 0.8, 0.9, 0.9], [0.2, 0.2, 0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 1], [0.2, 0.4, 0.7, 0.9, 0.9, 0.9, 0.8, 0.8, 0.8, 0.8, 0.7, 0.8, 1],
  [0.2, 0.7, 1.5, 2.6, 3.2, 3.4, 3.4, 3.3, 3.1, 2.2, 1, 0.9, 1.2], [0.6, 1.2, 2.2, 4.1, 5.3, 5.7, 6, 6.1, 5.7, 4.2, 2, 1.1, 1.4], [1.2, 2.1, 4, 6.1, 6.9, 7.1, 7.1, 7.1, 6.4, 5.1, 3, 1.3, 1.5],
  [1.9, 3.6, 5.5, 6.7, 6.9, 7, 7, 6.8, 6.3, 5.4, 4.1, 3, 2.5], [3.1, 4.9, 6.2, 6.6, 6.7, 6.8, 6.8, 6.7, 6.1, 4.9, 4, 3.6, 3.6], [4.6, 5.8, 6.3, 6.5, 6.5, 6.6, 6.6, 6.5, 5.7, 4.6, 3.9, 3.7, 3.6],
  [5.5, 6, 6.2, 6.3, 6.3, 6.3, 6.4, 6.3, 5.6, 4.6, 4.1, 3.7, 3.5], [5.9, 6, 6, 6.1, 6.1, 6.2, 6.2, 6.2, 5.7, 4.8, 4.3, 3.8, 3.6], [5.8, 5.8, 5.8, 5.9, 6, 6, 6.1, 6.1, 5.8, 5.1, 4.7, 4.3, 4],
  [5.7, 5.7, 5.7, 5.8, 5.8, 5.9, 5.9, 5.9, 5.7, 5.4, 5.1, 4.9, 4.5], [5.6, 5.6, 5.6, 5.7, 5.8, 5.8, 5.8, 5.9, 5.8, 5.5, 5.3, 5.1, 4.5], [5.5, 5.5, 5.6, 5.6, 5.7, 5.7, 5.8, 5.8, 5.7, 5.4, 4.8, 4.4, 4],
  [5.4, 5.5, 5.5, 5.6, 5.7, 5.8, 5.9, 5.9, 5.4, 4.7, 4, 3.7, 3.6], [5.4, 5.5, 5.6, 5.6, 5.7, 5.8, 5.8, 5.6, 4.8, 4, 3.8, 3.6, 3.6], [5.2, 5.2, 5.2, 5.3, 5.4, 5.4, 5.4, 5.3, 4.6, 3.9, 3.7, 3.7, 3.7],
  [5, 5, 5, 5, 5.1, 5.1, 5.2, 5.2, 4.9, 4.3, 3.9, 3.8, 3.8], [5, 5, 5, 4.9, 5, 5.1, 5.1, 5.2, 5.2, 5.1, 4.6, 4.1, 4], [5.1, 5.1, 5, 5, 5.1, 5.1, 5.2, 5.3, 5.3, 5.3, 4.9, 4.3, 4.3],
  [5.2, 5.1, 5.1, 5.1, 5.1, 5.2, 5.3, 5.4, 5.4, 5.4, 5.1, 4.5, 4.5], [5.3, 5.3, 5.2, 5.2, 5.3, 5.4, 5.4, 5.5, 5.5, 5.5, 5.2, 4.6, 4.6], [5.5, 5.4, 5.4, 5.4, 5.4, 5.5, 5.6, 5.6, 5.6, 5.6, 5.4, 4.9, 4.9],
  [5.6, 5.6, 5.6, 5.5, 5.6, 5.6, 5.7, 5.7, 5.8, 5.8, 5.8, 5.5, 5.5], [5.9, 5.8, 5.8, 5.8, 5.8, 5.8, 5.8, 5.9, 5.9, 6.1, 6.3, 6.1, 6.1], [6.1, 6, 6, 6, 6, 6, 6, 6, 6.1, 6.2, 6.4, 6.6, 6.7],
  [6.5, 6.4, 6.3, 6.3, 6.3, 6.3, 6.3, 6.2, 6.3, 6.5, 6.7, 7, 7.2], [7.4, 7.2, 6.8, 6.7, 6.8, 6.7, 6.7, 6.7, 6.8, 6.9, 7.1, 7.3, 7.4], [8, 7.8, 7.5, 7.3, 7.3, 7.4, 7.4, 7.4, 7.4, 7.5, 7.7, 7.9, 7.9],
  [8.6, 8.4, 8, 7.9, 7.9, 7.9, 7.9, 7.8, 7.8, 7.9, 8.1, 8.3, 8.3], [9.2, 9.1, 8.8, 8.6, 8.5, 8.5, 8.4, 8.4, 8.4, 8.4, 8.6, 8.8, 8.8], [9.6, 9.4, 9.3, 9.3, 9.2, 9.2, 9.1, 9.1, 9, 9, 9.3, 9.3, 9.2],
  [9.4, 9.4, 9.4, 9.4, 9.3, 9.3, 9.3, 9.2, 9.2, 9.3, 9.4, 9.5, 9.4], [9.5, 9.5, 9.4, 9.4, 9.4, 9.4, 9.3, 9.3, 9.3, 9.3, 9.3, 9.3, 9.2], [9.7, 9.7, 9.7, 9.7, 9.6, 9.6, 9.5, 9.5, 9.4, 9.4, 9.4, 9.3, 9.3],
  [10.1, 10, 10, 10.1, 10, 10, 9.9, 9.8, 9.7, 9.6, 9.6, 9.5, 9.5], [10.8, 11.1, 11.1, 11, 10.9, 10.8, 10.7, 10.6, 10.6, 10.4, 10.2, 9.9, 9.8], [11.2, 11.9, 12.2, 11.9, 11.7, 11.6, 11.5, 11.6, 11.8, 11.9, 11.7, 10.8, 10.4],
  [11.8, 12.4, 12.5, 12.4, 12.3, 12.3, 12.4, 12.4, 12.4, 12.4, 12.1, 11.4, 10.9], [13.2, 13.2, 13, 12.9, 12.8, 12.8, 12.8, 12.8, 12.7, 12.7, 12.6, 12.3, 11.8], [14.2, 13.9, 13.6, 13.5, 13.4, 13.4, 13.3, 13.2, 13.1, 13, 13, 13.1, 13],
  [14.4, 14.3, 14.2, 14, 13.9, 13.9, 13.7, 13.6, 13.5, 13.4, 13.4, 13.7, 13.9], [14.6, 14.7, 14.7, 14.5, 14.4, 14.3, 14.2, 14.1, 13.9, 13.9, 13.8, 13.9, 14], [15, 15.1, 15.1, 15, 14.8, 14.7, 14.6, 14.5, 14.4, 14.3, 14.2, 14.1, 13.9],
  [15.6, 15.6, 15.5, 15.4, 15.3, 15.2, 15, 14.9, 14.8, 14.7, 14.5, 14.2, 14], [16.3, 16.2, 16, 15.8, 15.7, 15.5, 15.4, 15.3, 15.2, 15, 14.8, 14.3, 14.1], [16.6, 16.6, 16.4, 16.2, 16, 15.9, 15.8, 15.7, 15.5, 15.4, 15.2, 14.9, 14.7],
  [16.7, 16.6, 16.5, 16.4, 16.2, 16.1, 16, 15.8, 15.7, 15.5, 15.4, 15.3, 15.1], [16.9, 16.8, 16.7, 16.6, 16.6, 16.4, 16.3, 16.2, 16.1, 16, 15.8, 15.7, 15.5], [17.3, 17.3, 17.2, 17.2, 17.1, 17, 16.9, 16.7, 16.6, 16.5, 16.4, 16.2, 16.1],
  [18.1, 18, 18, 17.8, 17.7, 17.6, 17.4, 17.3, 17.2, 17, 16.9, 16.7, 16.5], [18.4, 18.4, 18.4, 18.3, 18.2, 18, 17.9, 17.8, 17.7, 17.5, 17.4, 17.2, 17], [18.8, 18.8, 18.8, 18.8, 18.8, 18.7, 18.7, 18.6, 18.5, 18.3, 18.2, 17.8, 17.4],
] }
/** 2 m patches where feet stand on steep or uneven ground: the south bents by the street dip, the downtown approach pier, the downtown end, the downtown pylon. */
const PATCHES: GroundGrid[] = [
  { y0: -300, x0: -12, step: 2, z: [[7.1, 7.5, 7.7, 7.6, 7.6, 7.6, 7.5, 7.5, 7.4, 7.3, 7.2, 6.9, 6.6], [7.1, 7.6, 7.7, 7.8, 7.7, 7.6, 7.6, 7.4, 7.4, 7.3, 7.1, 6.9, 6.5], [7.2, 7.7, 7.9, 7.9, 7.9, 7.7, 7.6, 7.5, 7.4, 7.3, 7.1, 6.9, 6.4], [7.2, 7.7, 8, 8, 7.9, 7.8, 7.7, 7.6, 7.5, 7.3, 7.2, 6.9, 6.4], [7.1, 7.7, 8, 8, 7.9, 7.9, 7.7, 7.6, 7.5, 7.4, 7.2, 6.8, 6.3], [7.1, 7.6, 7.9, 8, 7.9, 7.8, 7.7, 7.6, 7.4, 7.3, 7.1, 6.8, 6.3], [7, 7.5, 7.9, 7.9, 7.9, 7.8, 7.6, 7.5, 7.4, 7.3, 7.1, 6.7, 6.1], [6.9, 7.5, 7.8, 7.9, 7.9, 7.8, 7.6, 7.5, 7.4, 7.2, 7, 6.6, 6], [6.8, 7.5, 7.8, 7.9, 7.8, 7.7, 7.5, 7.4, 7.3, 7.2, 6.9, 6.6, 5.9], [6.9, 7.5, 7.8, 7.9, 7.8, 7.7, 7.5, 7.4, 7.3, 7.2, 6.9, 6.6, 6], [6.9, 7.5, 7.8, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.2, 7, 6.6, 6], [6.9, 7.5, 7.8, 7.9, 7.9, 7.8, 7.7, 7.5, 7.4, 7.3, 7, 6.6, 6], [6.8, 7.5, 7.9, 8, 7.9, 7.8, 7.7, 7.5, 7.4, 7.2, 7, 6.6, 6], [6.7, 7.4, 7.8, 8, 7.9, 7.8, 7.7, 7.6, 7.4, 7.3, 7, 6.7, 6], [6.6, 7.3, 7.8, 8, 8, 7.9, 7.7, 7.6, 7.5, 7.4, 7.1, 6.7, 6], [6.4, 7.2, 7.8, 8, 8, 7.9, 7.8, 7.7, 7.5, 7.4, 7.1, 6.6, 6], [6.3, 7.1, 7.7, 7.9, 7.9, 7.9, 7.7, 7.6, 7.5, 7.4, 7.1, 6.6, 5.9], [6.2, 7, 7.6, 7.8, 7.9, 7.8, 7.7, 7.5, 7.4, 7.3, 7, 6.5, 5.9], [6.3, 7, 7.5, 7.8, 7.8, 7.7, 7.6, 7.5, 7.4, 7.2, 7, 6.5, 5.9], [6.2, 7, 7.5, 7.7, 7.7, 7.6, 7.5, 7.4, 7.2, 7.1, 6.9, 6.4, 5.8], [6.1, 6.8, 7.4, 7.5, 7.6, 7.4, 7.4, 7.2, 7.1, 7, 6.7, 6.3, 5.7], [6, 6.8, 7.3, 7.5, 7.5, 7.4, 7.3, 7.2, 7, 6.9, 6.7, 6.4, 5.8], [6.1, 6.8, 7.3, 7.5, 7.5, 7.4, 7.3, 7.2, 7.1, 6.9, 6.8, 6.4, 5.9], [6.1, 6.9, 7.4, 7.6, 7.6, 7.5, 7.4, 7.3, 7.2, 7.1, 6.9, 6.5, 5.9], [6.1, 6.9, 7.3, 7.6, 7.6, 7.6, 7.5, 7.4, 7.3, 7.2, 7, 6.5, 5.9], [6, 6.7, 7.2, 7.5, 7.6, 7.5, 7.5, 7.4, 7.3, 7.2, 7.1, 6.6, 5.8], [5.9, 6.6, 7.1, 7.3, 7.4, 7.4, 7.4, 7.3, 7.2, 7.1, 6.9, 6.4, 5.7], [5.7, 6.3, 6.8, 7, 7, 7, 6.9, 6.9, 6.8, 6.7, 6.5, 6.1, 5.4], [5.3, 5.8, 6.2, 6.3, 6.3, 6.3, 6.2, 6.1, 6.1, 6, 5.8, 5.4, 4.9], [4.7, 5.1, 5.3, 5.3, 5.3, 5.3, 5.2, 5.2, 5.1, 5.1, 5, 4.7, 4.3], [4, 4.2, 4.3, 4.3, 4.4, 4.3, 4.3, 4.2, 4.2, 4.2, 4, 3.9, 3.6], [3.5, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.5, 3.5, 3.5, 3.4, 3.3, 3.2], [3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.3, 3.3, 3.2, 3.2, 3.1, 3.1, 3], [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.4, 3.4, 3.3, 3.3, 3.2, 3.1, 3.1], [3.9, 4, 4, 4.1, 4, 4, 4, 3.9, 3.8, 3.8, 3.7, 3.5, 3.5], [4.7, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.8, 4.8, 4.7, 4.6, 4.4, 4.2], [5.5, 5.7, 5.8, 5.8, 5.8, 5.8, 5.9, 5.9, 5.8, 5.8, 5.7, 5.4, 4.9], [6.2, 6.6, 6.6, 6.6, 6.6, 6.6, 6.7, 6.7, 6.7, 6.7, 6.6, 6.2, 5.6]] },
  { y0: 120, x0: -18, step: 2, z: [[5.2, 5.2, 5.2, 5.3, 5.3, 5.4, 5.4, 5.4, 5.4, 5.4, 5.4, 5.3, 5, 4.6, 4.2, 3.9, 3.8, 3.7, 3.7], [5.1, 5.1, 5.1, 5.1, 5.1, 5.2, 5.2, 5.3, 5.3, 5.3, 5.3, 5.2, 5, 4.7, 4.3, 4, 3.8, 3.8, 3.8], [5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.2, 5.2, 5.2, 5.2, 5.1, 4.8, 4.5, 4.2, 4, 3.9, 3.8], [5, 5, 5, 5, 5, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.2, 5.1, 5, 4.8, 4.4, 4.2, 4, 3.9], [5, 5, 5, 5, 5, 5, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.2, 5.1, 5, 4.8, 4.5, 4.3, 4.1], [5, 5, 4.9, 4.9, 5, 5, 5, 5.1, 5.1, 5.1, 5.1, 5.2, 5.2, 5.2, 5.2, 5.1, 4.8, 4.6, 4.3], [5, 5, 4.9, 4.9, 5, 5, 5.1, 5.1, 5.1, 5.1, 5.2, 5.2, 5.2, 5.3, 5.3, 5.2, 5.1, 4.8, 4.5], [5, 5, 5, 5, 5, 5, 5.1, 5.1, 5.2, 5.2, 5.2, 5.3, 5.3, 5.3, 5.3, 5.3, 5.2, 4.9, 4.6], [5.1, 5, 5, 5, 5.1, 5.1, 5.1, 5.1, 5.2, 5.2, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.2, 5, 4.7], [5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.2, 5.2, 5.2, 5.3, 5.3, 5.3, 5.3, 5.3, 5.4, 5.4, 5.3, 5.1, 4.7], [5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.2, 5.2, 5.3, 5.3, 5.3, 5.4, 5.4, 5.4, 5.4, 5.4, 5.3, 5.1, 4.8]] },
  { y0: 274, x0: -20, step: 2, z: [[16.6, 16.5, 16.5, 16.4, 16.4, 16.3, 16.2, 16.2, 16.1, 16, 15.9, 15.9, 15.8, 15.7, 15.6, 15.6, 15.5, 15.4, 15.4, 15.3, 15.3], [16.6, 16.6, 16.5, 16.5, 16.4, 16.3, 16.3, 16.2, 16.2, 16.1, 16, 15.9, 15.9, 15.8, 15.7, 15.6, 15.6, 15.5, 15.5, 15.4, 15.4], [16.7, 16.6, 16.6, 16.6, 16.5, 16.4, 16.4, 16.3, 16.3, 16.2, 16.1, 16.1, 16, 16, 15.9, 15.8, 15.7, 15.7, 15.6, 15.5, 15.5], [16.8, 16.8, 16.7, 16.7, 16.6, 16.6, 16.6, 16.5, 16.4, 16.4, 16.3, 16.3, 16.2, 16.2, 16.1, 16, 16, 15.9, 15.8, 15.7, 15.7], [16.9, 16.9, 16.9, 16.8, 16.8, 16.8, 16.7, 16.7, 16.6, 16.6, 16.5, 16.5, 16.4, 16.4, 16.3, 16.3, 16.2, 16.1, 16, 16, 15.9], [17.1, 17.1, 17.1, 17.1, 17, 17, 17, 16.9, 16.9, 16.8, 16.7, 16.7, 16.6, 16.6, 16.5, 16.5, 16.4, 16.3, 16.2, 16.2, 16.1], [17.4, 17.4, 17.4, 17.4, 17.3, 17.3, 17.2, 17.1, 17.1, 17.1, 17, 16.9, 16.9, 16.8, 16.8, 16.7, 16.6, 16.5, 16.5, 16.4, 16.3], [17.8, 17.7, 17.7, 17.6, 17.6, 17.6, 17.5, 17.4, 17.4, 17.3, 17.2, 17.2, 17.1, 17, 17, 16.9, 16.8, 16.7, 16.7, 16.6, 16.5], [18, 18, 18, 17.9, 17.8, 17.8, 17.7, 17.6, 17.6, 17.5, 17.4, 17.4, 17.3, 17.3, 17.2, 17.1, 17, 17, 16.9, 16.8, 16.7], [18.2, 18.1, 18.1, 18.1, 18, 18, 17.9, 17.8, 17.8, 17.7, 17.6, 17.6, 17.5, 17.4, 17.4, 17.3, 17.3, 17.2, 17.1, 17, 16.9]] },
  { y0: 40, x0: -24, step: 2, z: [[0.2, 0.2, 0.2, 0.3, 0.3, 0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.6, 0.6, 0.7, 0.8, 0.8, 0.8, 1], [0.2, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.6, 0.6, 0.7, 0.7, 0.8, 0.9, 1], [0.2, 0.3, 0.3, 0.4, 0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.7, 0.8, 0.9, 1], [0.2, 0.3, 0.5, 0.7, 0.9, 1, 1.2, 1.3, 1.3, 1.3, 1.2, 1.2, 1.2, 1.2, 1.1, 1.1, 1.1, 1, 0.9, 0.8, 0.7, 0.8, 0.8, 1, 1.1], [0.2, 0.4, 0.6, 0.9, 1.2, 1.6, 1.9, 2.1, 2.2, 2.3, 2.3, 2.2, 2.2, 2.2, 2.1, 2.1, 2, 1.8, 1.5, 1.1, 0.9, 0.8, 0.9, 1, 1.1], [0.2, 0.5, 0.7, 1.1, 1.5, 2, 2.6, 3, 3.2, 3.3, 3.4, 3.4, 3.4, 3.4, 3.3, 3.3, 3.1, 2.8, 2.2, 1.5, 1, 0.9, 0.9, 1.1, 1.2], [0.4, 0.6, 0.9, 1.2, 1.7, 2.4, 3.1, 3.7, 4.1, 4.3, 4.4, 4.5, 4.5, 4.6, 4.5, 4.4, 4.3, 3.8, 3, 2, 1.3, 1, 1, 1.1, 1.3], [0.5, 0.8, 1.1, 1.5, 2, 2.8, 3.7, 4.4, 4.9, 5.1, 5.3, 5.5, 5.6, 5.7, 5.7, 5.5, 5.3, 4.7, 3.8, 2.7, 1.7, 1.2, 1.1, 1.2, 1.4], [0.7, 1, 1.3, 1.8, 2.6, 3.5, 4.5, 5.3, 5.7, 6, 6.2, 6.3, 6.5, 6.5, 6.5, 6.4, 6, 5.3, 4.5, 3.4, 2.3, 1.5, 1.2, 1.3, 1.5], [0.9, 1.2, 1.6, 2.3, 3.2, 4.4, 5.4, 6.1, 6.5, 6.7, 6.8, 6.9, 7, 7, 7, 6.8, 6.3, 5.7, 4.8, 3.8, 2.7, 1.7, 1.2, 1.3, 1.5], [1.2, 1.5, 2.1, 2.9, 4, 5.1, 6.1, 6.6, 6.9, 7, 7.1, 7.1, 7.1, 7.2, 7.1, 6.9, 6.4, 5.8, 5.1, 4.1, 3, 2, 1.3, 1.2, 1.5]] },
]
const inside = (g: GroundGrid, x: number, y: number) => y >= g.y0 && y <= g.y0 + g.step * (g.z.length - 1) && x >= g.x0 && x <= g.x0 + g.step * (g.z[0].length - 1)
const ground = (x: number, y: number): number => {
  for (const p of PATCHES) if (inside(p, x, y)) return Math.max(0, groundAt(p, x, y) - 0.1)
  const g = y <= -160 ? groundAt(S_GROUND, x, y) : y >= 35 ? groundAt(N_GROUND, x, y) : 0
  return Math.max(0, g - 0.1)
}

type Kit = { concrete: Part; steel: Part; shade: Part; roof: Part; window: Part; lamp: Part; web: Part }
const k: Kit = { concrete: new Part(), steel: new Part(), shade: new Part(), roof: new Part(), window: new Part(), lamp: new Part(), web: new Part() }
const C: Skin = () => k.concrete
const S: Skin = (n) => (n[2] < -0.5 ? k.shade : k.steel)

// ---- Main span: the Pratt through truss -------------------------------------------
{
  const half = PYLON - PIER_D
  const top = (y: number) => {
    const a = Math.abs(y)
    return a <= 40 ? road(y) + 13 - 7 * (a / 40) ** 2 : road(y) + 6 - (5.2 * (a - 40)) / (half - 40)
  }
  const bot = (y: number) => road(y) - 1.4
  const ys = stations(-half, half, 7.5)
  for (const s of [-1, 1]) truss(k.steel, k.web, s * TRUSS_X, ys, top, bot, { chordW: 0.8, topD: 0.9, botD: 1.1, member: 0.55, post: 0.6, minWeb: 1 })
  // Top lateral struts between the planes, and the floor's underside.
  for (const y of ys.filter((_, i) => i % 2 === 0 && Math.abs(ys[i]) < 40)) beam(S, [-TRUSS_X, y, top(y) - 0.45], [TRUSS_X, y, top(y) - 0.45], 0.5, 0.5, [0, 1, 0])
  band(k.shade, -TRUSS_X, TRUSS_X, stations(-half, half, 10), (y) => road(y) - 1.5, (y) => road(y) - 2.2, { bottom: true, ends: true })
  // Sidewalk margins between the cycle lanes and the trusses (the map draws the paths on top).
  for (const s of [-1, 1]) band(k.concrete, s * 11.2, s * (TRUSS_X - 0.4), stations(-half, half, 10), (y) => road(y) - 0.3, (y) => road(y) - 0.6, { top: true })
}

// ---- The pylon piers ------------------------------------------------------------------
function pylon(yc: number) {
  const zr = road(yc), zDeck = zr - 2.2
  // The pier under the deck, full width, on a plinth at the water.
  // (the downtown pier stands on the shore, where the ground rises past the plinth's top).
  const plinth = chamferedRect(-22.5, 22.5, yc - PIER_D - 1, yc + PIER_D + 1, 1.5), pier = chamferedRect(-21.5, 21.5, yc - PIER_D, yc + PIER_D, 0.6)
  if (yc < 0) footedLoft(k.concrete, ground, [{ plan: plinth, z: 'ground' }, { plan: plinth, z: 2.2 }], 3)
  footedLoft(k.concrete, ground, [{ plan: pier, z: yc < 0 ? 2.2 : 'ground' }, { plan: pier, z: zDeck }], 2)
  // The towers each side of the deck, stepped in near the top.
  const T0 = 14.6, T1 = 21.5, H = zr + 16
  for (const s of [-1, 1]) {
    const [a, b] = s < 0 ? [-T1, -T0] : [T0, T1]
    box(C, a, b, yc - PIER_D - 0.5, yc + PIER_D + 0.5, zDeck, zr + 13.2, { r: 0.5, bottom: false })
    box(C, a + 0.7, b - 0.7, yc - PIER_D + 0.2, yc + PIER_D - 0.2, zr + 13.2, H - 0.8, { r: 0.4, bottom: false })
    box(C, a + 1.4, b - 1.4, yc - PIER_D + 0.9, yc + PIER_D - 0.9, H - 0.8, H, { r: 0.3, top: 0.2, bottom: false })
    // Lantern on top.
    bead(k.lamp, [(a + b) / 2, yc, H + 0.9], 0.8)
    // Arched openings on the tower's outer face, toward the creek (photos 1
    // and 5): round-headed, flush, glowing at night.
    const w = 2.6, z0 = zr + 7.8, zs = zr + 11.2, n = 8, x = s * (T1 + 0.03), nn: V3 = [s, 0, 0]
    const P = (u: number, z: number): V3 => [x, yc + u, z]
    const pts: V3[] = [P(-w / 2, z0), P(w / 2, z0)]
    for (let i = 0; i <= n; i++) { const t = (Math.PI * i) / n; pts.push(P((w / 2) * Math.cos(t), zs + (w / 2) * Math.sin(t))) }
    for (let i = 1; i + 1 < pts.length; i++) k.window.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [nn, nn, nn])
  }
  // The gallery over the roadway and its red tile roof, gabled along x.
  box(C, -T0, T0, yc - 3.6, yc + 3.6, zr + 10, zr + 14, { r: 0.3, bottom: true })
  const r0 = zr + 14, r1 = zr + 15.4, Y0 = yc - 4.0, Y1 = yc + 4.0
  for (const [ya, yb, sy] of [[Y0, yc, -1], [Y1, yc, 1]] as [number, number, number][]) {
    const q: V3[] = [[-T0, ya, r0], [T0, ya, r0], [T0, yb, r1], [-T0, yb, r1]]
    const nn: V3 = [0, sy * 0.95, 0.3]
    k.roof.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn, nn, nn])
    k.roof.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn, nn, nn])
  }
}
pylon(-PYLON)
pylon(PYLON)

// ---- Approach spans: Warren deck trusses on concrete piers -------------------------------
const deckTop = (y: number) => road(y) - 0.3, deckBot = (y: number) => road(y) - DECK_DEPTH
for (const sg of [-1, 1]) {
  const ends = [PYLON + PIER_D, ...APPROACH].map((v) => sg * v)
  for (let i = 0; i + 1 < ends.length; i++) {
    const [a, b] = [Math.min(ends[i], ends[i + 1]), Math.max(ends[i], ends[i + 1])]
    const ys = stations(a, b, 10)
    for (const s of [-1, 1]) truss(k.steel, k.web, s * DECK_X, ys, deckTop, deckBot, { chordW: 0.8, topD: 0.9, botD: 0.9, member: 0.6, post: 0.35 })
    band(k.shade, -DECK_X, DECK_X, stations(a, b, 1e4), (y) => road(y) - 1.0, (y) => road(y) - 1.8, { bottom: true })
  }
  // The approach piers: a concrete wall across under the trusses.
  for (const p of APPROACH) {
    const yc = sg * p, plan = chamferedRect(-14, 14, yc - 2.6, yc + 2.6, 0.8)
    footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: deckBot(yc) - 0.05 }], 2)
  }
}

// ---- Concrete viaducts to the landings ---------------------------------------------------
for (const [a, b] of [[S_END, -APPROACH[1]], [APPROACH[1], N_END]] as [number, number][]) {
  const ys = stations(a, b, 1e4), girder = (y: number) => road(y) - 2.4
  band(k.concrete, -EDGE, EDGE, ys, (y) => road(y) - 0.3, girder, { out: true, in: false, bottom: true })
  // Bents: two columns and a cap, about every 25 m.
  const n = Math.round((b - a) / 25)
  for (const yc of stations(a, b, (b - a) / n).slice(1, -1)) {
    for (const s of [-1, 1]) {
      const x = s * 8, plan = chamferedRect(x - 0.9, x + 0.9, yc - 0.9, yc + 0.9, 0.2)
      footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: girder(yc) - 1.1 }], 0.9, false)
    }
    box(C, -10.5, 10.5, yc - 1, yc + 1, girder(yc) - 1.2, girder(yc), { r: 0.2 })
  }
}
// Abutments at the two landings, 0.4 m under the road, with short wing walls.
for (const [y0, y1] of [[S_END, S_END + 3], [N_END - 3, N_END]]) {
  const plan = chamferedRect(-EDGE, EDGE, y0, y1, 0)
  footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: road((y0 + y1) / 2) - 0.4 }], 4)
}
for (const s of [-1, 1]) {
  const [xa, xb] = s < 0 ? [-17.6, -13] : [13, 17.6]
  const plan = chamferedRect(xa, xb, 280, N_END, 0.3)
  footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: road(286) + 1.1 }], 4)
}

// ---- Parapets along the whole deck outside the main span ------------------------------
for (const [a, b] of [[S_END, -PYLON - PIER_D], [PYLON + PIER_D, N_END - 3]] as [number, number][]) {
  const ys = stations(a, b, 1e4)
  for (const s of [-1, 1]) band(k.concrete, s * (EDGE - 0.5), s * EDGE, ys, (y) => road(y) + 1.1, (y) => road(y) - 0.3, { out: true, in: true, top: true, ends: true })
  for (const s of [-1, 1]) band(k.concrete, s * 11.2, s * (EDGE - 0.5), ys, (y) => road(y) - 0.3, (y) => road(y) - 0.6, { top: true })
}

const flood = (p: V3, n: V3) => (Math.abs(Math.abs(p[1]) - PYLON) < 7 && p[2] > 1 && Math.abs(p[0]) > 14 && n[2] < 0.7 ? 0.85 : Math.abs(Math.abs(p[1]) - PYLON) < 7 && p[2] > 1 && p[2] < 28 && n[2] < 0.7 ? 0.6 : 0)

if (import.meta.main) {
  // Colours from the daylight photos: cream concrete, the trusses' grey-green
  // paint and its shaded underside, the galleries' red tile.
  const CONCRETE = { ...finish('burrard-concrete', 0xe0d8c4), floodlight: flood }
  const STEEL = finish('burrard-steel', 0x8c9a98)
  const SHADE = finish('burrard-steel-shade', 0x6c7876)
  const ROOF = finish('burrard-tile', 0xb8644e)
  const LAMP = { name: 'lamp', color: 0xd8cfb8 }
  const parts = [
    { part: k.concrete, material: CONCRETE },
    { part: merged(k.steel, k.web), material: { ...STEEL, doubleSided: true } },
    { part: k.shade, material: SHADE },
    { part: k.roof, material: ROOF },
    { part: k.window, material: PALETTE.window },
    { part: k.lamp, material: LAMP },
  ]
  const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
  if (tris > 6500) throw new Error(`${tris} triangles, over 6500`)
  const glb = writeGlb('Burrard Bridge', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the main span centre, on the water',
    bearing: 63.84, elevation: 0, ends: [S_END, N_END], roadwayCrest: CREST, roadwayEnds: [road(S_END), road(N_END)],
  })
  if (glb.length > 250 * 1024) throw new Error(`${glb.length} bytes, over 250 KB`)
  await Bun.write(new URL('../models/van-burrard-bridge.glb', import.meta.url), glb)
  console.log(`van-burrard-bridge.glb: ${tris} triangles, ${glb.length} bytes`)
}
