/**
 * Lions Gate Bridge (First Narrows Bridge), Vancouver – West Vancouver
 * (1938; Monsarrat and Pratley; suspended deck replaced 2000–01) —
 * procedural, CC0-1.0.
 * bun generators/van-lions-gate-bridge.ts
 *
 * The whole structure inside the OSM outline: the two green steel towers
 * with their stacked X bracing and arched portal strut on concrete piers,
 * the twin main cables and backstays with their necklace lights, the
 * suspended main span and side spans on stiffening trusses, the walkways
 * outside the cables (jogging round the tower legs), the south anchorage on
 * the Prospect Point bluff with its cable housings and the gate pylons, and
 * the North Viaduct: a deck truss on braced steel bent towers from the
 * side span's end tower down to the abutment on the North Shore
 * embankment, with the north anchorage on the ground under it. Writes a
 * low model (trusses as solid bands, no suspenders) and a detail model
 * (open trusses, suspenders, railings, more bracing).
 *
 * Frame: x across the bridge (+x east of the axis), y along it toward the
 * North Shore, z up, metres; origin midway between the towers on the water
 * (Mapterhorn's water reads 0.0–0.1 here). Placed at bearing 31.109°, the
 * direction of the bridge's OSM road way/4755915 (a straight two-node way
 * along the whole outline), anchored on that way 236.375 m north of the
 * centre of the south pier (way/497479012), so the south tower stands on
 * its pier and the north tower half the published main span beyond.
 * The map owns the roadway: the trusses stand under and beside it, the
 * barriers beside it, and nothing here is a slab across it.
 *
 * OSM: outline way/497479013 (man_made=bridge, Q124352), y = -478…+1070,
 * about 19.5 m wide; pier way/497479012 (bridge:support=pier, 44 x 20 m,
 * rounded ends) under the south tower; pylons way/497479011 (south, on the
 * pier) and way/497479010 (north, 25 x 6.5 m, height 111). The north pylon
 * is mapped at y = 217.6, 18.8 m short of the published span; the model
 * keeps the published span from the well-mapped south pier (see doubts).
 * way/674163154, a small man_made=bridge 75 m south of the outline (the
 * causeway over Stanley Park Drive), is a separate structure and left to
 * the map. No building is under the outline.
 *
 * Published (Wikipedia "Lions Gate Bridge"): main span 472.75 m (473), total
 * 1,517.3 m with the approach spans and 1,823 m with the North Viaduct
 * (the outline is 1,548 m), towers 111 m above the water, clearance 61 m;
 * the 2001 deck has the walkways cantilevered outside the cables; 170
 * decorative lights on the cables since 1986 (LED since 2009). Side spans
 * 187 m each (Structurae).
 *
 * Heights (z above the water; no open lidar reaches the bridge, so
 * `tools/bridge_ele.py` can't be used here):
 * - roadway: measured from Xiao23's side view from Ambleside (photo 2
 *   below) against the 111 m towers: the deck band's top 61.3 m at
 *   midspan, 55–57 at the towers. Built to: crest 60.7 at midspan, a
 *   parabola to 55.5 at the towers (4.4 % there); north of the north tower
 *   one straight 4.44 % grade over the side span and the viaduct to 18.9 at
 *   the north abutment (y = 1060), where Mapterhorn's embankment top reads
 *   18.4–18.8; the south side span straight from 55.5 to 51.4 at the bluff
 *   (y = -444), the road in the Prospect Point cutting as Mapterhorn reads
 *   it (51.3–51.5). The main span's truss underside at midspan is 57.8: the
 *   published 61 m clearance is taken above chart datum (about 3 m under
 *   mean water at Vancouver), which is what the photo shows. ESTIMATED from
 *   photos and terrain, not measured; no `ele` is tagged in OSM.
 * - towers, from the oblique view of the north tower in the North Approach
 *   photo (scaled to 111 m): pedestals to 7.4; bottom strut 9.3–11.3; X
 *   panels 11.3–30.7 and 30.7–49.6; the seat strut under the deck; the
 *   portal strut 67.4–70.6 with its semicircular arch springing at 61.5;
 *   X panels 70.6–88.6 and 88.6–105.8; top strut 105.8–109; saddle
 *   housings to 111.
 * - cables: saddles 109.5; main cable low point 65.8 (necklace lights 4–6 m
 *   over the deck band at midspan in photo 2, sag 1:11). North backstay to
 *   the north anchorage on the ground at y = 562 (the cables pass the deck
 *   at the side span's end tower and reach a concrete block on the ground
 *   about three bent towers further on in the North Approach photo; a 0.5 m
 *   bump in Mapterhorn at y = 555–590 agrees); south backstay to the cable
 *   housings at the bluff end, at road level (photo 6).
 * - Mapterhorn terrain (tools/terrain.ts, 5 m on the bluff, 10 m on the
 *   North Shore) under everything on land: S_GROUND and N_GROUND below.
 *
 * Photos (Wikimedia Commons, daylight unless noted; all EVIDENCE):
 * 1. "Lions Gate Bridge (air).jpg", Tawker, GFDL / CC BY-SA 3.0: the south
 *    tower from a floatplane: pier, pedestals, X panels, the arched portal
 *    strut, the walkways jogging round the legs, the deck's green edge.
 * 2. "Lions Gate Bridge (First Narrows Bridge) 2.JPG", Xiao23, CC BY-SA
 *    3.0 (dusk): the whole bridge side-on from Ambleside: deck profile,
 *    cable sag, necklace lights.
 * 3. "Lions Gate Bridge North Approach.jpg", "Thank You (21 Millions+) views
 *    from Los Angeles, USA" (Flickr), CC BY 2.0: the north tower's stages,
 *    the north side span, the cables going down to the north anchorage, the
 *    viaduct's deck truss on X-braced bent towers.
 * 4. "Lions-Gate-Bridge-North-Shore.jpg", Penapox, CC BY-SA 4.0: drone view
 *    from the north: the viaduct's length, bent towers, colour.
 * 5. "Lions Gate Bridge (From Stanley Park).JPG", LeGrosJR, CC BY-SA 3.0:
 *    the whole bridge from the east.
 * 6. "Lions Gate Bridge south side.jpg", Emma0mb, CC BY 4.0: the south
 *    approach: gate pylons with lanterns and lions, the cables coming down
 *    to the housings at the bluff end.
 * 7. "Lions Gate Bridge Night.jpg", Alexey Golubev, CC BY-SA 4.0 (night):
 *    necklace lights on the cables, the towers floodlit green.
 *
 * Estimated: leg section (3.4 m across, 6.0 m along at the foot tapering
 *   to 4.0 at the top; OSM's pylon is 25 m across, which takes in the
 *   walkway jogs); leg centres and cable planes 7.6 m off the axis, from the
 *   outline's width and the aerial photo (the roadway passes between the
 *   legs, the walkways outside them); stiffening truss 3.8 m deep on the
 *   main span and 4.5 m on the side spans and viaduct; the viaduct's bent
 *   towers (two bents 10 m apart, every ~35 m; their stations are not
 *   measured); the south pier 5 m high, the north pier a plain block; the
 *   gate pylons (3.2 x 5 m, 11.5 m over the road). The cables are drawn
 *   1.0 m thick (low 1.2), about twice the real ones; suspenders (detail)
 *   every 18 m, half the real density. 39 lamp beads per cable in the low
 *   model, 77 in the detail (photo 2 counts about 42 a cable over the main
 *   span).
 * Doubts: the north tower's station (published span vs the OSM pylon 18.8
 *   m south); the roadway heights are photo-scaled (±2 m); the north
 *   anchorage's form and station are read from one photo; the south
 *   anchorage is drawn as a concrete block under the deck end, its real
 *   form under the bluff unseen; the lions themselves are not drawn, only
 *   their plinths.
 *
 * Night: the necklace (`lamp` beads on the cables) and the green
 * floodlighting of the towers (`_FLOODLIGHT` on the tower steel); the gate
 * pylons' lanterns are `lamp` too.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { along, band, bead, chamferedRect, footedLoft, groundAt, merged, parabola, rod, stations, strip, truss, tube, type GroundGrid } from './bridge-kit'
import { beam, box, loftSolid, type Skin } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements -----------------------------------------------------------

const TY = 236.375                     // towers at y = ±TY (main span 472.75 m)
const LEG_X = 7.6, LEG_W = 3.4
const LEG_IN = LEG_X - LEG_W / 2, LEG_OUT = LEG_X + LEG_W / 2
const LEG_BASE = 7.4, LEG_TOP = 109
/** The legs' half-depth along the bridge at height z. */
const legD = (z: number) => 3.0 - (1.0 * (z - LEG_BASE)) / (LEG_TOP - LEG_BASE)

const CREST = 60.7, ROAD_TOWER = 55.5
const K = (CREST - ROAD_TOWER) / (TY * TY)
const N_ABUT = 1060, N_ROAD_END = 18.9
const G_N = (ROAD_TOWER - N_ROAD_END) / (N_ABUT - TY)
const S_ABUT = -444, S_ROAD_END = 51.4
/** The roadway (estimated from photos and terrain), metres above the water. */
const road = (y: number): number => {
  if (Math.abs(y) <= TY) return CREST - K * y * y
  if (y > TY) return ROAD_TOWER - G_N * (y - TY)
  if (y < S_ABUT) return S_ROAD_END
  return ROAD_TOWER - ((ROAD_TOWER - S_ROAD_END) * (y + TY)) / (S_ABUT + TY)
}

const CABLE_X = 7.6, SADDLE = 109.5, LOW = 65.8
const mainCable = (y: number) => LOW + (SADDLE - LOW) * (y / TY) ** 2
const N_ANCH: [number, number] = [562, 9.0]
const S_ANCH: [number, number] = [-438, road(-438) + 1.6]
/** A backstay: a shallow parabola from the saddle to the anchorage. */
function backstay([ye, ze]: [number, number], sag: number) {
  const s = Math.sign(ye)
  return parabola([s * TY, SADDLE], [(s * TY + ye) / 2, (SADDLE + ze) / 2 - sag], [ye, ze])
}
const N_STAY = backstay(N_ANCH, 4), S_STAY = backstay(S_ANCH, 3)
/**
 * The cables' distance from the axis: in the tower planes over the main span
 * and down to the south housings; the north backstays splay out to pass
 * outside the walkways where they cross the deck at the side span's end
 * (y = 422) on their way down to the anchorage.
 */
const cableX = (y: number) => (y <= TY ? CABLE_X : CABLE_X + (5.1 * (y - TY)) / (N_ANCH[0] - TY))

/** Stiffening trusses in the cable planes; the viaduct's under the barriers. */
const TRUSS_X = CABLE_X, VIA_X = 6.6
const UP = 0.9, MAIN_DOWN = 2.9, SIDE_DOWN = 3.6
const WALK_IN = 7.95, WALK_OUT = 9.8
const N_SIDE_END = 423.4               // the side span's end tower, where the viaduct starts
const S_SIDE_END = -426                // the south anchorage block's face

// Mapterhorn ground (metres above the water) in this frame. South: the
// Prospect Point bluff, 5 m apart, columns x = -25…25. North: the North
// Shore, 10 m apart, columns x = -30…30. Water elsewhere.
const S_GROUND: GroundGrid = { y0: -490, x0: -25, step: 5, z: [
  [59.7, 56.9, 53.5, 51.8, 51.5, 51.5, 51.5, 51.7, 51.6, 51.5, 51.5], [58.9, 55.8, 52.8, 51.6, 51.4, 51.4, 51.4, 51.5, 51.3, 51.1, 51.0], [58.0, 54.8, 52.1, 51.4, 51.4, 51.4, 51.3, 51.4, 51.2, 51.0, 50.7],
  [57.4, 54.1, 51.7, 51.4, 51.4, 51.3, 51.4, 51.4, 51.3, 51.0, 50.6], [56.6, 53.5, 51.5, 51.4, 51.3, 51.3, 51.4, 51.4, 51.3, 51.1, 50.3], [55.8, 52.7, 51.3, 51.4, 51.3, 51.3, 51.3, 51.4, 51.3, 50.6, 49.0],
  [55.1, 52.3, 51.2, 51.3, 51.3, 51.3, 51.3, 51.3, 51.1, 49.7, 47.8], [54.2, 51.7, 51.1, 51.2, 51.2, 51.3, 51.3, 51.1, 50.5, 48.8, 46.7], [53.5, 51.4, 51.1, 50.9, 50.9, 51.3, 51.0, 50.6, 49.2, 46.9, 44.7],
  [53.0, 51.2, 50.9, 50.4, 50.0, 50.0, 49.8, 49.3, 47.5, 45.1, 43.2], [52.4, 50.9, 50.5, 49.9, 49.1, 48.7, 48.3, 47.7, 45.8, 43.6, 42.2], [51.8, 50.7, 49.7, 48.8, 48.0, 47.6, 47.2, 46.4, 44.6, 42.5, 40.9],
  [51.4, 50.6, 49.0, 47.7, 46.9, 46.2, 45.6, 44.8, 43.6, 41.6, 39.7], [51.4, 50.5, 48.9, 47.7, 46.6, 45.3, 44.0, 42.8, 41.7, 40.0, 38.3], [51.0, 49.8, 48.5, 46.9, 45.6, 44.2, 42.8, 41.5, 40.3, 38.7, 37.1],
  [49.4, 48.0, 47.0, 45.5, 44.3, 43.0, 41.7, 40.3, 39.0, 37.4, 35.9], [48.0, 46.8, 45.8, 44.2, 43.0, 41.7, 40.3, 39.1, 37.7, 36.1, 34.6], [46.9, 46.0, 44.8, 43.3, 42.1, 40.7, 39.3, 38.0, 36.4, 34.8, 33.4],
  [45.8, 44.8, 43.5, 42.1, 40.8, 39.4, 37.9, 36.5, 35.0, 33.7, 32.3], [44.9, 43.6, 42.2, 41.1, 39.8, 38.2, 36.6, 35.1, 33.8, 32.6, 31.3], [43.8, 42.3, 41.0, 40.3, 39.1, 37.3, 35.4, 33.8, 32.5, 31.4, 30.2],
  [42.5, 41.2, 39.8, 38.7, 37.5, 35.9, 34.2, 32.7, 31.4, 30.2, 29.3], [41.3, 40.0, 38.4, 37.1, 35.9, 34.5, 33.1, 31.7, 30.4, 29.4, 28.6], [40.2, 38.8, 37.3, 35.8, 34.6, 33.3, 32.0, 30.6, 29.5, 28.6, 27.8],
  [38.9, 37.3, 35.9, 34.8, 33.7, 32.3, 30.7, 29.3, 28.2, 27.4, 26.7], [37.3, 36.0, 35.1, 33.9, 32.6, 31.0, 29.3, 27.7, 26.3, 25.6, 25.2], [36.5, 35.0, 34.1, 32.9, 31.5, 29.9, 28.2, 26.3, 25.2, 24.8, 24.7],
  [35.3, 34.0, 33.2, 31.8, 30.3, 28.8, 27.3, 25.6, 25.0, 24.7, 24.6], [34.1, 33.1, 32.1, 30.8, 29.0, 27.5, 26.1, 25.1, 24.8, 24.6, 24.6], [33.1, 32.2, 31.2, 29.8, 27.8, 26.4, 25.4, 24.8, 24.6, 24.6, 24.4],
  [32.2, 31.4, 30.4, 28.9, 27.0, 25.9, 25.1, 24.6, 24.5, 24.5, 24.0], [31.2, 30.4, 29.4, 27.5, 26.1, 25.3, 24.7, 24.3, 24.3, 24.0, 23.4], [28.6, 28.5, 28.0, 27.1, 26.0, 25.2, 24.5, 24.2, 24.0, 23.5, 22.6],
  [23.3, 24.0, 25.2, 26.1, 25.3, 24.7, 24.2, 23.8, 23.4, 22.7, 21.9], [18.3, 18.9, 20.4, 21.9, 21.1, 21.7, 22.9, 23.1, 22.3, 21.7, 21.1], [14.0, 14.3, 14.4, 15.2, 15.6, 17.3, 19.6, 20.7, 21.0, 20.9, 20.2],
  [10.3, 9.9, 9.6, 10.3, 11.3, 12.4, 13.4, 14.8, 17.4, 19.3, 19.5], [6.6, 6.2, 5.8, 6.3, 7.1, 7.5, 7.7, 8.6, 11.4, 15.3, 17.9], [4.0, 3.8, 3.4, 3.4, 3.6, 3.7, 4.0, 4.8, 6.3, 9.4, 13.1],
  [2.4, 2.2, 2.0, 1.9, 2.1, 2.5, 2.8, 3.0, 3.5, 4.5, 6.4], [0.6, 0.4, 0.5, 0.6, 1.0, 1.4, 1.7, 1.8, 2.2, 2.8, 3.4], [0.1, 0.1, 0.1, 0.1, 0.3, 0.7, 0.9, 1.0, 1.0, 1.1, 1.7],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.3, 0.3, 0.4, 0.4], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.1],
] }
const N_GROUND: GroundGrid = { y0: 170, x0: -30, step: 10, z: [
  [0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.0], [0.1, 0.1, 0.0, 0.1, 0.1, 0.1, 0.0], [0.1, 0.1, 0.3, 0.4, 0.3, 0.1, 0.1],
  [0.4, 2.4, 2.9, 3.1, 3.1, 2.8, 1.4], [1.8, 3.0, 2.8, 2.8, 2.9, 3.1, 2.8], [2.1, 3.1, 2.8, 2.8, 2.9, 3.1, 3.0],
  [2.4, 2.9, 3.1, 2.8, 2.9, 3.2, 3.0], [2.8, 3.7, 3.4, 2.9, 3.1, 3.1, 3.0], [3.3, 3.6, 3.1, 2.7, 2.9, 3.0, 3.0],
  [3.4, 3.1, 2.6, 2.6, 2.8, 3.0, 3.2], [3.2, 2.9, 2.6, 2.5, 2.6, 3.1, 3.2], [3.1, 2.8, 2.4, 2.5, 2.4, 2.5, 2.7],
  [2.8, 2.6, 2.4, 2.4, 2.4, 2.4, 2.9], [2.5, 2.4, 2.3, 2.3, 2.4, 2.3, 2.7], [2.4, 2.3, 2.4, 2.3, 2.2, 2.2, 2.4],
  [2.3, 2.3, 2.4, 2.3, 2.1, 2.3, 2.5], [2.3, 2.3, 2.4, 2.4, 2.3, 2.1, 2.7], [2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.8],
  [2.4, 2.4, 2.6, 2.5, 2.3, 2.3, 2.5], [2.4, 2.6, 2.9, 2.6, 2.4, 2.4, 2.6], [2.4, 2.6, 2.7, 2.8, 2.3, 2.4, 2.5],
  [2.4, 2.5, 2.6, 2.6, 2.4, 2.3, 2.3], [2.4, 2.5, 2.5, 2.5, 2.4, 2.4, 2.6], [2.6, 2.3, 2.6, 2.6, 2.5, 2.4, 2.5],
  [2.4, 2.4, 2.5, 2.4, 2.5, 2.4, 2.5], [2.5, 2.5, 2.4, 2.4, 2.5, 2.5, 2.6], [2.6, 2.5, 2.4, 2.4, 2.4, 2.4, 2.3],
  [2.6, 2.6, 2.6, 2.9, 2.4, 2.2, 2.3], [2.6, 2.7, 2.6, 2.5, 2.4, 2.4, 2.6], [2.9, 3.8, 2.6, 2.4, 2.4, 2.4, 2.7],
  [3.0, 3.3, 2.7, 2.7, 2.6, 2.5, 2.8], [2.9, 3.0, 2.8, 2.8, 2.6, 2.6, 2.7], [3.0, 3.0, 2.8, 2.8, 2.7, 2.8, 2.7],
  [3.0, 2.9, 2.8, 2.9, 2.9, 3.0, 2.9], [3.5, 3.0, 3.2, 3.3, 3.1, 2.8, 3.5], [3.6, 3.0, 3.2, 3.2, 3.2, 3.1, 4.2],
  [3.9, 3.2, 3.2, 3.2, 3.2, 3.2, 4.1], [4.0, 3.4, 3.1, 3.1, 3.2, 3.3, 3.6], [4.1, 3.8, 3.6, 3.5, 3.5, 3.7, 3.9],
  [4.6, 4.5, 4.5, 4.4, 4.4, 4.4, 4.4], [5.0, 5.0, 4.9, 4.8, 4.8, 4.8, 4.8], [5.0, 5.1, 5.0, 4.9, 4.9, 4.9, 4.9],
  [4.8, 4.8, 4.8, 4.7, 4.6, 4.6, 4.5], [3.6, 4.0, 4.0, 3.6, 4.0, 4.4, 4.3], [3.1, 3.4, 3.4, 3.6, 4.2, 4.6, 4.3],
  [2.9, 3.2, 3.2, 3.4, 3.9, 4.2, 4.2], [2.9, 3.0, 3.1, 4.2, 3.9, 4.3, 4.2], [2.8, 2.9, 3.1, 4.1, 4.1, 4.3, 4.3],
  [2.9, 2.9, 3.2, 4.0, 4.3, 4.3, 4.4], [3.0, 3.1, 3.2, 4.1, 4.3, 4.2, 5.0], [3.1, 3.2, 3.2, 4.0, 4.3, 4.3, 5.3],
  [3.2, 3.2, 3.3, 4.1, 4.2, 4.3, 5.2], [3.4, 3.3, 3.4, 4.1, 4.1, 4.3, 5.1], [3.4, 3.4, 3.5, 3.9, 4.1, 4.3, 4.7],
  [3.4, 3.5, 3.5, 4.0, 4.1, 6.3, 6.1], [3.4, 3.6, 3.7, 4.1, 4.7, 8.0, 7.3], [3.7, 3.6, 3.8, 4.4, 5.5, 8.2, 7.8],
  [4.8, 3.7, 3.9, 4.5, 4.9, 7.8, 6.9], [6.0, 3.8, 3.8, 4.6, 4.9, 7.3, 6.6], [4.8, 4.0, 4.0, 4.2, 4.8, 6.0, 5.9],
  [4.4, 4.1, 4.2, 4.5, 4.8, 5.1, 5.4], [4.5, 4.3, 4.3, 4.6, 5.0, 5.5, 5.5], [4.5, 4.5, 4.4, 5.0, 5.3, 5.8, 5.5],
  [4.5, 4.6, 4.7, 5.0, 5.2, 5.3, 5.0], [4.4, 4.7, 4.9, 5.8, 5.5, 5.6, 5.5], [4.6, 4.8, 5.1, 5.8, 5.6, 5.7, 5.7],
  [4.8, 4.9, 5.2, 6.0, 5.7, 5.9, 6.1], [4.8, 5.0, 5.2, 5.8, 5.8, 6.0, 6.6], [5.1, 5.1, 5.2, 5.9, 5.9, 6.0, 6.6],
  [5.2, 5.3, 5.4, 6.1, 6.0, 6.0, 6.3], [5.4, 5.6, 5.6, 6.2, 6.1, 6.1, 6.5], [5.4, 5.7, 5.9, 6.3, 6.2, 6.2, 6.5],
  [5.3, 5.8, 5.9, 6.3, 6.4, 6.4, 6.8], [5.4, 6.0, 6.1, 6.7, 6.6, 6.9, 7.0], [5.4, 6.1, 6.4, 7.2, 6.8, 7.0, 7.2],
  [5.4, 6.3, 6.7, 7.4, 7.1, 7.3, 7.3], [5.6, 6.4, 6.8, 7.5, 7.2, 7.4, 7.4], [5.7, 6.5, 6.9, 7.6, 7.4, 7.6, 7.8],
  [5.9, 6.7, 7.1, 7.7, 7.5, 7.7, 8.0], [6.3, 6.9, 7.2, 7.8, 7.7, 7.6, 8.0], [6.4, 7.0, 7.3, 7.7, 7.7, 7.7, 7.8],
  [6.5, 7.2, 7.4, 7.7, 7.7, 7.8, 7.7], [6.7, 7.3, 7.4, 7.6, 7.6, 7.8, 7.8], [7.0, 7.4, 7.5, 7.5, 7.5, 7.8, 8.2],
  [7.3, 7.5, 7.6, 7.4, 7.4, 7.5, 7.7], [7.3, 7.6, 7.7, 7.8, 7.3, 7.3, 7.6], [7.3, 7.6, 7.6, 7.4, 7.1, 7.0, 6.9],
  [7.4, 7.7, 7.7, 7.5, 7.2, 6.8, 6.5], [7.6, 7.7, 8.0, 8.0, 7.6, 7.0, 6.9], [7.6, 9.4, 12.5, 13.2, 12.4, 9.2, 6.9],
  [7.7, 10.9, 16.7, 18.4, 16.5, 11.2, 6.9], [7.7, 11.0, 17.8, 18.7, 17.3, 10.7, 7.0], [7.9, 11.1, 17.6, 18.3, 17.2, 10.5, 7.2],
] }
/** The map's ground under (x, y), metres above the water (0 on the water). */
const ground = (x: number, y: number): number => {
  const g = y <= -270 ? groundAt(S_GROUND, x, y) : y >= 190 ? groundAt(N_GROUND, x, y) : 0
  return Math.max(0, g - 0.1)
}

// ---- Parts ------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { green: Part; shade: Part; concrete: Part; cable: Part; lamp: Part; web: Part }
const newKit = (): Kit => ({ green: new Part(), shade: new Part(), concrete: new Part(), cable: new Part(), lamp: new Part(), web: new Part() })
/** Green steel, its downward faces in the shade colour (the dark underside in every photo). */
const steel = (k: Kit): Skin => (n) => (n[2] < -0.5 ? k.shade : k.green)
const plain = (p: Part): Skin => () => p

// ---- A tower ----------------------------------------------------------------

/** The plan ring of a stadium-shaped pier: a rectangle with semicircular ends across the bridge. */
function stadium(ty: number, halfX: number, halfY: number, n = 8): [number, number][] {
  const c = halfX - halfY, out: [number, number][] = []
  for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (Math.PI * i) / n; out.push([c + halfY * Math.cos(a), ty + halfY * Math.sin(a)]) }
  for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (Math.PI * i) / n; out.push([-c + halfY * Math.cos(a), ty + halfY * Math.sin(a)]) }
  return out
}

/** Corners of a chamfered rectangle at height z, CCW from above. */
const rim = (x0: number, x1: number, y0: number, y1: number, r: number, z: number): V3[] =>
  chamferedRect(x0, x1, y0, y1, r).map(([x, y]) => [x, y, z] as V3)

function tower(k: Kit, ty: number, south: boolean, lod: Lod) {
  const S = steel(k)
  // The pier: the south one as OSM maps it (44 x 20 m, rounded ends), in the
  // water; the north one a plain block on the beach.
  const plan = south ? stadium(ty + 0.25, 22, 9.8, lod === 'low' ? 4 : 8) : chamferedRect(-12.5, 12.5, ty - 6.5, ty + 6.5, 1.5)
  const inset = plan.map(([x, y]) => [x * 0.985, ty + (y - ty) * 0.97] as [number, number])
  footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: 4.6 }, { plan: inset, z: 5.0 }], lod === 'low' ? 12 : 4)
  // Pedestals under the legs.
  for (const s of [-1, 1]) box(plain(k.concrete), s * LEG_X - 2.7, s * LEG_X + 2.7, ty - 4, ty + 4, 5.0, LEG_BASE, { r: 0.5, top: 0.3, bottom: false })
  // Legs: steel boxes, chamfered, tapering along the bridge.
  for (const s of [-1, 1]) {
    const a = s * LEG_X - LEG_W / 2, b = s * LEG_X + LEG_W / 2
    const rings = [LEG_BASE, LEG_TOP].map((z) => rim(a, b, ty - legD(z), ty + legD(z), 0.4, z))
    loftSolid(S, rings, [false, true])
    // Saddle housing on top.
    box(S, a - 0.3, b + 0.3, ty - 2.4, ty + 2.4, LEG_TOP, 111, { r: 0.5, top: 0.4, bottom: true })
  }
  /** A strut between the legs' inner faces, z0–z1. */
  const strut = (z0: number, z1: number, d: number) => box(S, -LEG_IN - 0.2, LEG_IN + 0.2, ty - d, ty + d, z0, z1, { r: 0, bottom: true })
  /** An X panel between the legs, z0–z1. */
  const xPanel = (z0: number, z1: number) => {
    const t = Math.min(legD(z0), legD(z1)) * 0.9
    for (const s of [-1, 1]) beam(S, [-s * (LEG_IN + 0.3), ty, z0], [s * (LEG_IN + 0.3), ty, z1], 1.4, t)
  }
  strut(9.3, 11.3, 1.6)
  xPanel(11.3, 30.7)
  xPanel(30.7, 49.6)
  strut(49.6, 51.8, 1.8)
  // The portal strut: a lattice girder whose underside is a semicircular
  // arch springing from the legs (photo 1), drawn as a solid plate.
  const R = LEG_IN, CROWN = 67.4, SPRING = CROWN - R, TOP = 70.6, d = 1.3
  const n = lod === 'low' ? 8 : 12
  const arc = Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI - (Math.PI * i) / n; return [R * Math.cos(a), SPRING + R * Math.sin(a)] as [number, number] })
  for (let i = 0; i < n; i++) {
    const [x0, z0] = arc[i], [x1, z1] = arc[i + 1]
    for (const [y, sy] of [[ty - d, -1], [ty + d, 1]] as [number, number][]) {
      const q: V3[] = [[x0, y, z0], [x1, y, z1], [x1, y, TOP], [x0, y, TOP]]
      if (sy > 0) k.green.quad(q[0], q[1], q[2], q[3]); else k.green.quad(q[0], q[3], q[2], q[1])
    }
    // The arch's soffit, facing in and down.
    k.shade.quad([x0, ty + d, z0], [x1, ty + d, z1], [x1, ty - d, z1], [x0, ty - d, z0])
  }
  k.green.quad([-R, ty - d, TOP], [R, ty - d, TOP], [R, ty + d, TOP], [-R, ty + d, TOP])
  xPanel(TOP, 88.6)
  xPanel(88.6, 105.8)
  strut(105.8, LEG_TOP, 1.6)
}

// ---- Spans ------------------------------------------------------------------

const MAIN: [number, number] = [-TY + 2.6, TY - 2.6]
const S_SIDE: [number, number] = [S_SIDE_END, -TY - 2.6]
const N_SIDE: [number, number] = [TY + 2.6, N_SIDE_END]
const VIA: [number, number] = [N_SIDE_END, N_ABUT]

/** The deck structure from a to b: trusses at ±X, barriers, the soffit, the walkways outside. */
function deck(k: Kit, [a, b]: [number, number], X: number, down: number, lod: Lod, curved: boolean) {
  const top = (y: number) => road(y) + UP, bot = (y: number) => road(y) - down
  const ys = stations(a, b, curved ? (lod === 'low' ? 24 : 12) : 1e4)
  for (const s of [-1, 1]) {
    if (lod === 'low') {
      band(k.green, s * (X - 0.35), s * (X + 0.35), ys, top, (y) => bot(y) + 0.01, { out: true, in: true, top: true, ends: true })
      band(k.shade, s * (X - 0.35), s * (X + 0.35), ys, (y) => bot(y) + 0.01, bot, { bottom: true })
    } else {
      truss(k.green, k.web, s * X, stations(a, b, 9), top, bot, { chordW: 0.7, topD: 0.7, botD: 0.8, member: 0.4, curve: ys })
    }
    // The barrier between the roadway and the truss, and the deck's margin
    // out to the walkway (0.3 m under the road).
    band(k.concrete, s * 5.8, s * 6.3, ys, (y) => road(y) + 0.85, (y) => road(y) - 0.3, { out: true, in: true, top: true })
    const m0 = Math.min(6.3, X - 0.35), m1 = X - 0.35
    if (m1 > m0 + 0.05) band(k.concrete, s * m0, s * m1, ys, (y) => road(y) - 0.3, (y) => road(y) - 0.6, { top: true })
    if (X + 0.35 < WALK_IN) band(k.concrete, s * (X + 0.35), s * WALK_IN, ys, (y) => road(y) - 0.3, (y) => road(y) - 0.6, { top: true, bottom: true })
  }
  // The floor's underside between the trusses, facing down.
  band(k.shade, -X + 0.35, X - 0.35, ys, (y) => road(y) - 0.6, (y) => road(y) - 1.4, { bottom: true })
  if (lod === 'detail') for (const y of stations(a, b, 9)) band(k.shade, -X, X, [y - 0.3, y + 0.3], () => road(y) - 1.4, () => bot(y) + 0.6, { bottom: true, out: true, in: true, ends: true })
}

/** A walkway outside the cables from a to b on side s: its slab (the model's own surface) and, in the detail, its railing. */
function walkway(k: Kit, [a, b]: [number, number], s: number, lod: Lod, x0 = WALK_IN, x1 = WALK_OUT, curved = true) {
  const ys = stations(a, b, curved ? (lod === 'low' ? 24 : 12) : 1e4)
  band(k.concrete, s * x0, s * x1, ys, (y) => road(y) + 0.15, (y) => road(y) - 0.35, { out: true, top: true, ends: true })
  band(k.shade, s * x0, s * x1, ys, (y) => road(y) - 0.35, (y) => road(y) - 0.36, { bottom: true })
  if (lod === 'detail') band(k.web, s * (x1 - 0.06), s * x1, ys, (y) => road(y) + 1.25, (y) => road(y) + 1.05, { out: true, in: true, top: true })
  if (lod === 'detail') for (const y of stations(a, b, 3)) strip(k.web, [s * (x1 - 0.03), y, road(y) + 0.15], [s * (x1 - 0.03), y, road(y) + 1.1], 0.12, [1, 0, 0])
}

/** The walkways along the whole bridge, jogging out round each tower's legs (photo 1). */
function walkways(k: Kit, lod: Lod) {
  const J = 4.6, OUT0 = LEG_OUT + 0.2, OUT1 = OUT0 + (WALK_OUT - WALK_IN)
  for (const s of [-1, 1]) {
    walkway(k, [-436, -TY - J], s, lod, WALK_IN, WALK_OUT, false)
    walkway(k, [-TY + J, TY - J], s, lod)
    walkway(k, [TY + J, N_ABUT], s, lod, WALK_IN, WALK_OUT, false)
    for (const ty of [-TY, TY]) {
      walkway(k, [ty - J, ty + J], s, lod, OUT0, OUT1, false)
      for (const [ya, yb] of [[ty - J, ty - J + 1.4], [ty + J - 1.4, ty + J]]) walkway(k, [ya, yb], s, lod, WALK_IN, OUT0 + 0.01, false)
    }
  }
}

/**
 * A bent tower under the side span's end or the viaduct: two bents `len`
 * apart, each two posts at ±X from the ground to a cap girder under the
 * trusses, X-braced between the bents on each side.
 */
function bentTower(k: Kit, yc: number, X: number, len: number, lod: Lod) {
  const S = steel(k)
  const ya = yc - len / 2, yb = yc + len / 2
  const capTop = (y: number) => road(y) - SIDE_DOWN, capBot = (y: number) => capTop(y) - 1.2
  for (const y of [ya, yb]) {
    for (const s of [-1, 1]) {
      const x = s * X, h = 0.55
      const plan: [number, number][] = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
      footedLoft(k.green, ground, [{ plan, z: 'ground' }, { plan, z: capBot(y) + 0.05 }], 30, false)
    }
    if (lod === 'detail' || len > 12) box(S, -X - 0.7, X + 0.7, y - 0.6, y + 0.6, capBot(y), capTop(y), { r: 0 })
  }
  if (lod === 'low' && len <= 12) box(S, -X - 0.7, X + 0.7, ya - 0.6, yb + 0.6, Math.min(capBot(ya), capBot(yb)), Math.max(capTop(ya), capTop(yb)), { r: 0 })
  const g = Math.max(ground(-X, yc), ground(X, yc)) + 0.8
  const zTop = Math.min(capBot(ya), capBot(yb))
  if (zTop - g < 2) return
  const levels = stations(g, zTop, lod === 'low' ? 1e4 : 11)
  for (const s of [-1, 1]) for (let i = 0; i + 1 < levels.length; i++) {
    const [za, zb] = [levels[i], levels[i + 1]]
    strip(k.web, [s * X, ya + 0.4, za], [s * X, yb - 0.4, zb], 0.6, [1, 0, 0])
    strip(k.web, [s * X, yb - 0.4, za], [s * X, ya + 0.4, zb], 0.6, [1, 0, 0])
  }
  if (lod === 'detail') for (const y of [ya, yb]) for (let i = 0; i + 1 < levels.length; i++) {
    const [za, zb] = [levels[i], levels[i + 1]]
    strip(k.web, [-X, y, za], [X, y, zb], 0.45, [0, 1, 0])
    strip(k.web, [X, y, za], [-X, y, zb], 0.45, [0, 1, 0])
  }
}

/** The viaduct's bent towers, about every 35 m from the side span's end to the abutment (stations estimated). */
const VIA_TOWERS = stations(N_SIDE_END, N_ABUT, 36).slice(1, -1)

function spans(k: Kit, lod: Lod) {
  deck(k, MAIN, TRUSS_X, MAIN_DOWN, lod, true)
  deck(k, S_SIDE, TRUSS_X, SIDE_DOWN, lod, false)
  deck(k, N_SIDE, TRUSS_X, SIDE_DOWN, lod, false)
  deck(k, VIA, VIA_X, SIDE_DOWN, lod, false)
  walkways(k, lod)
  // The side span's end tower, wider and carrying both the side span and the viaduct.
  bentTower(k, N_SIDE_END, VIA_X + 0.4, 14, lod)
  for (const y of VIA_TOWERS) bentTower(k, y, VIA_X, 10, lod)
}

// ---- Anchorages and the ends --------------------------------------------------

function ends(k: Kit, lod: Lod) {
  const C = plain(k.concrete), seg = lod === 'low' ? 8 : 3
  // South: the anchorage block under the deck's end on the bluff, from the
  // side span's end to the bluff's edge, 0.4 m under the road, and the
  // cable housings on it beside the roadway.
  const sPlan = chamferedRect(-10.5, 10.5, S_ABUT, S_SIDE_END, 0.8)
  footedLoft(k.concrete, ground, [{ plan: sPlan, z: 'ground' }, { plan: sPlan, z: road(S_SIDE_END) - 0.4 }], seg)
  for (const s of [-1, 1]) {
    const x0 = s * 6.4, x1 = s * 8.8
    box(C, Math.min(x0, x1), Math.max(x0, x1), -445, -436, road(-440) - 0.4, road(-440) + 2.6, { r: 0.4, top: 0.3, bottom: false })
  }
  // The gate pylons on the Prospect Point approach, fluted concrete with a
  // lantern on top, the lions on plinths in front of them (photo 6).
  for (const s of [-1, 1]) {
    const x0 = s * 11.4, x1 = s * 14.6, [xa, xb] = [Math.min(x0, x1), Math.max(x0, x1)]
    const base = chamferedRect(xa, xb, -463, -458, 0.3)
    const z0 = S_ROAD_END, inset = chamferedRect(xa + 0.3, xb - 0.3, -462.7, -458.3, 0.3)
    footedLoft(k.concrete, ground, [{ plan: base, z: 'ground' }, { plan: base, z: z0 + 10.6 }, { plan: inset, z: z0 + 11.2 }], seg)
    box(steel(k), (xa + xb) / 2 - 0.6, (xa + xb) / 2 + 0.6, -461.1, -459.9, z0 + 11.2, z0 + 12.0, { r: 0.2 })
    bead(k.lamp, [(xa + xb) / 2, -460.5, z0 + 12.5], 0.7, lod === 'low')
    const plinth = chamferedRect(xa + 0.2, xb - 0.2, -467, -463, 0.2)
    footedLoft(k.concrete, ground, [{ plan: plinth, z: 'ground' }, { plan: plinth, z: z0 + 1.6 }], seg)
    // The lion, a couchant block on the plinth.
    box(C, xa + 0.6, xb - 0.6, -466.6, -463.4, z0 + 1.6, z0 + 3.0, { r: 0.5, top: 0.4, bottom: false })
  }
  // North: the anchorage block on the ground under the viaduct, the cables
  // going into its top.
  const nPlan = chamferedRect(-15, 15, N_ANCH[0] - 14, N_ANCH[0] + 16, 1.2)
  footedLoft(k.concrete, ground, [{ plan: nPlan, z: 'ground' }, { plan: nPlan, z: N_ANCH[1] - 0.5 }], seg)
  // The north abutment where the viaduct lands on the embankment, 0.4 m
  // under the roadway, and short wing walls.
  const zt = road(N_ABUT) - 0.4
  const wall = chamferedRect(-10.2, 10.2, N_ABUT, N_ABUT + 3, 0)
  footedLoft(k.concrete, ground, [{ plan: wall, z: 'ground' }, { plan: wall, z: zt }], seg)
  for (const s of [-1, 1]) {
    const [xa, xb] = s < 0 ? [-10.2, -8.6] : [8.6, 10.2]
    footedLoft(k.concrete, ground, [{ plan: chamferedRect(xa, xb, N_ABUT - 8, N_ABUT, 0), z: 'ground' }, { plan: chamferedRect(xa, xb, N_ABUT - 8, N_ABUT, 0), z: road(N_ABUT - 8) - 0.4 }], seg)
  }
}

// ---- Cables, suspenders, lights ------------------------------------------------

function cables(k: Kit, lod: Lod) {
  const R = lod === 'low' ? 0.6 : 0.5, sides = lod === 'low' ? 5 : 10
  const stays: [(y: number) => number, [number, number]][] = [[S_STAY, S_ANCH], [N_STAY, N_ANCH]]
  for (const s of [-1, 1]) {
    const x = s * CABLE_X, xs = (y: number) => s * cableX(y)
    tube(k.cable, stations(-TY, TY, lod === 'low' ? 24 : 8).map((y) => [x, y, mainCable(y)] as V3), R, sides)
    for (const [z, end] of stays) {
      const sg = Math.sign(end[0])
      tube(k.cable, stations(sg * TY, end[0], lod === 'low' ? 40 : 10).map((y) => [xs(y), y, z(y)] as V3), R, sides)
    }
    // Necklace lights (photos 2 and 7): about 11 m apart, 42 a cable over
    // the main span and 17–18 on each backstay down to the deck. The low
    // model keeps every other one, larger.
    const r = lod === 'low' ? 1.6 : 0.55, keep = (i: number) => lod === 'detail' || i % 2 === 0
    const lift = (p: V3): V3 => [p[0], p[1], p[2] + R + r * 0.6]
    along(stations(-TY, TY, 4).map((y) => [x, y, mainCable(y)] as V3), 42).forEach((p, i) => keep(i) && bead(k.lamp, lift(p), r, lod === 'low'))
    for (const [z, end, count, stop] of [[S_STAY, S_ANCH, 18, -432], [N_STAY, N_ANCH, 17, 418]] as const) {
      const sg = Math.sign(end[0])
      along(stations(sg * TY, stop, 6).map((y) => [xs(y), y, z(y)] as V3), count).forEach((p, i) => keep(i) && bead(k.lamp, lift(p), r, lod === 'low'))
    }
  }
  if (lod === 'detail') {
    // Suspenders every 18 m, half the real density, from the cable to the truss's top chord.
    const hang = (y: number, z: (y: number) => number) => {
      for (const s of [-1, 1]) {
        const z0 = road(y) + UP, z1 = z(y) - 0.4
        if (z1 - z0 > 0.8) rod(k.cable, [s * CABLE_X, y, z0], [s * cableX(y), y, z1], 0.22, 4)
      }
    }
    for (const y of stations(-TY, TY, 18).slice(1, -1)) hang(y, mainCable)
    for (const y of stations(TY, N_SIDE_END, 18).slice(1, -1)) hang(y, N_STAY)
    for (const y of stations(-TY, S_SIDE_END, 18).slice(1, -1)) hang(y, S_STAY)
  }
}

// ---- Build --------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  tower(k, -TY, true, lod)
  tower(k, TY, false, lod)
  spans(k, lod)
  ends(k, lod)
  cables(k, lod)
  return k
}

/** The towers' green floodlighting: their steel, faces looking up barely lit. */
const towerLight = (p: V3, n: V3) => (Math.abs(Math.abs(p[1]) - TY) < 6 && p[2] > 7 && Math.abs(p[0]) < 11 ? (n[2] > 0.7 ? 0.25 : 0.85) : 0)

if (import.meta.main) {
  // Colours from the daylight photos: the bridge's green paint pulled to the
  // palette's lightness, its underside in shadow; pale concrete; the
  // cables' pale grey; the lamp fittings' grey.
  const GREEN = { ...finish('lions-gate-green', 0x4f9e7a), floodlight: towerLight }
  const SHADE = finish('lions-gate-green-shade', 0x3b7a60)
  const CONCRETE = finish('concrete', 0xd6d3cb)
  const CABLE = finish('cable-paint', 0xbcc6bf)
  const LAMP = { name: 'lamp', color: 0xd4d8d2 }
  const low = build('low'), detail = build('detail')
  const list = (k: Kit) => [
    { part: merged(k.green, k.web), material: { ...GREEN, doubleSided: true } },
    { part: k.shade, material: SHADE },
    { part: k.concrete, material: CONCRETE },
    { part: k.cable, material: CABLE },
    { part: k.lamp, material: LAMP },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    bearing: 31.109, elevation: 0, towers: [-TY, TY], ends: [S_ABUT, N_ABUT],
    roadwayMidspan: road(0), roadwayAtTowers: ROAD_TOWER, roadwayEnds: [road(S_ABUT), road(N_ABUT)],
  }
  for (const [file, parts, maxTris, maxBytes] of [
    ['van-lions-gate-bridge.glb', list(low), 6500, 250 * 1024],
    ['van-lions-gate-bridge.detail.glb', list(detail), 40000, 1536 * 1024],
  ] as const) {
    const tris = parts.reduce((n, p) => n + p.part.triangles, 0)
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Lions Gate Bridge', [...parts], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
