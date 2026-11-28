/**
 * Christopher S. Bond Bridge ("New Paseo Bridge"), Kansas City, Missouri
 * (2010; Parsons, architect Bradley Touchstone) — procedural, CC0-1.0.
 * bun generators/kc-bond-bridge.ts
 *
 * The single-pylon cable-stayed bridge carrying I-29/I-35/US 71 over the
 * Missouri River, as one placement over the whole OSM outline way/708969114:
 * the delta (A-shaped) concrete pylon standing in the river, its legs
 * straddling the deck and kinking in below it to a pile cap, with a strut
 * under the deck at the kink; the stays in two inclined planes from the
 * upper legs to the deck edges, fanning both ways; the blue steel edge
 * girders and concrete parapets of the one deck that carries both
 * carriageways; the four-column pier at the south bank and the abutment
 * against the downtown fill; and the north approach spans on four-column
 * piers over the bank and the levee to where the deck lands on its
 * embankment. No road surfaces: the map draws both carriageways; the model
 * draws the girders and parapets beside them and the underside below.
 *
 * Writes a low model (pylon, deck, piers, every other stay plus a faint veil
 * per fan) and a detail model (all the drawn stays and their blue anchor
 * pipes), which a map draws from detailZoom 16 up.
 *
 * Frame: x across (+x to the right looking along +y), y along the bridge
 * toward the north (Clay County) end, z up, metres. Origin at the outline's
 * centroid (-94.5658579, 39.1233336), placed at bearing 340.2 (the two
 * carriageways: -19.6 and -20.1 degrees). z = 0 is the river: lidar water
 * 219.82 m NAVD88, Mapterhorn 219.75-219.85. elevation 0 (the pile cap
 * stands in the water, the lowest point of the footprint).
 *
 * Roadway built to (measured: tools/bridge_ele.py measure on both
 * carriageways, USGS 3DEP MO_FEMANRCS_1_2020, flown 2020; mean of the two,
 * metres above the river): 21.7 at the south abutment (y = -270), rising to
 * a crest of 23.3 at y = -90..-110, 23.2 at the pylon, then a steady ~2 %
 * fall to 17.95 at y = 263.6, where both carriageways land on the
 * embankment (lidar road minus bare earth -0.03 m). See ROAD; the OSM `ele`
 * survey for the map's deck is ~/landmarks-scratch/osm-ele/kc-bond-bridge.md.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/708969114
 *   (man_made=bridge, bridge:structure=cable-stayed, Q5113181), 41.8 m wide
 *   (x -21.0..20.8), y -269.8..263.6 in this frame, with notches at the
 *   pylon (y -48..-64); carriageways way/544392690 (northbound, 4 lanes) and
 *   way/560399630 (southbound, 3 lanes), 19.8 m apart.
 * - Lidar (measured; MO_FEMANRCS_1_2020): pylon apex 315.2 m = 95.4 m over
 *   the water at y = -57, x = +1; the legs' outer faces reach deck level at
 *   x = -23 and +25, each leg about 5.5 m along the bridge; the stays land
 *   on the deck from y = +65 (north fan) to y = -195 (south fan); deck
 *   edges at x = -21..+22; the roadway above.
 * - Published (Wikipedia, "Christopher S. Bond Bridge (Kansas City,
 *   Missouri)", citing the KC ICON release of 2007-11-14): single-tower
 *   cable-stayed; a 260 ft delta-shaped pylon rising 316 ft (96.3 m) above
 *   the river (lidar 95.4 m); opened September 2010.
 * - Map terrain: Mapterhorn z15 along the axis (tools/terrain.ts grid, bearing
 *   340.2): the river from y = +35 to -210; the north bank 4.3-4.9 m, the
 *   levee 10-11 m at y = 200-240, the embankment 17-18 m from y = 250; the
 *   south bank rising to 10-11.5 m at the abutment, the fill behind it.
 *
 * Photos (evidence)
 * - Todd Wade, "Christopher Bond Bridge U0T7762.jpg", CC BY 2.0 (from the
 *   bank below: the A legs, the lower legs converging to the pile cap, the
 *   blue edge girders, the stays' blue anchor pipes):
 *   https://commons.wikimedia.org/wiki/File:Christopher_Bond_Bridge_U0T7762.jpg
 * - Todd Wade, "Christopher Bond Bridge U0T7104.jpg", CC BY 2.0 (broadside
 *   from the south bank: the pylon in the river, the four-column pier at
 *   the south bank, the north approach piers):
 *   https://commons.wikimedia.org/wiki/File:Christopher_Bond_Bridge_U0T7104.jpg
 * - Antony-22, "Christopher S. Bond Bridge 2025a/b/c.jpg", CC BY-SA 4.0
 *   (from the downtown riverfront; on the deck: the A over both
 *   carriageways, the fans, the pale concrete):
 *   https://commons.wikimedia.org/wiki/File:Christopher_S._Bond_Bridge_2025a.jpg
 *   https://commons.wikimedia.org/wiki/File:Christopher_S._Bond_Bridge_2025b.jpg
 *   https://commons.wikimedia.org/wiki/File:Christopher_S._Bond_Bridge_2025c.jpg
 * - Smuckola, "New Paseo Bridge, Kansas City, Missouri.jpg", CC BY-SA 4.0
 *   (on the deck: the legs, the anchorages up the legs):
 *   https://commons.wikimedia.org/wiki/File:New_Paseo_Bridge,_Kansas_City,_Missouri.jpg
 * - davedehetre, "The Paseo bridge (ICON/Bond bridge)", Flickr 6804871515,
 *   CC BY 2.0 (dusk from the bank: the pylon floodlit warm white, the stays
 *   lit; the strut under the deck at the legs' kink):
 *   https://www.flickr.com/photos/22433418@N04/6804871515
 * Look-only: Vincent Parsons, Flickr 6625668739 (CC BY-NC), not used.
 *
 * Numbers
 * - Pylon at y = -57 (lidar). Upper legs: horizontal section 4.4-3.6 m across x
 *   5.6 m along (photo-scaled; lidar 5-6 m along), centre x = ±23.2 at the
 *   deck (lidar outer faces) rising to ±1.7 at 95.4 m, so the legs meet at
 *   the apex. Lower legs 4.2 x 6.4 m from the deck down to x = ±14.5 on the
 *   pile cap (photo-scaled from U0T7762 and the dusk photo); the strut under
 *   the deck 2.8 m deep (photo); pile cap 36 x 12 x 3 m (estimated).
 * - Stays: 10 per fan, four fans (two planes, each fanning north and
 *   south), anchored up the legs from 52 to 91 m (photo-scaled), landing
 *   0.4 m outside the deck edges 16 m to 122 m (north) and 138 m (south)
 *   from the pylon (lidar ends). The real fans look to have 10-12 stays
 *   (photos); drawn 0.3 m thick in the detail model, every other one
 *   0.45 m thick plus a veil in the low model.
 * - Deck: 42 m overall (outline, lidar); blue edge girders 2.3 m deep under a
 *   1.0 m concrete parapet (photo-scaled), the underside 1.6 m under the
 *   roadway (estimated).
 * - Piers: four columns (1.8 m, estimated) under a cap beam; the south one at
 *   y = -195 where the south fan ends (photo U0T7104: one span on to the
 *   abutment); the north ones every 33 m from y = +65 to +230 (estimated from
 *   U0T7104; the lidar can't see under the deck). The south abutment at
 *   y = -269.8 from the bank (11.5 m) to under the roadway.
 * - Colours (daylight photos): pale warm concrete #d9d4c8; the girders'
 *   painted blue pulled lighter, #5a84b4; white stays; the underside in shade.
 *
 * Night: the pylon is floodlit (its sides fully, faces looking up dimly) and
 * the stays carry floodlight 0.8, as the dusk photo shows; the rest is dark.
 *
 * Doubts
 * - The north approach's pier count and spacing are estimated, and the piers
 *   are drawn alike; the real ones may differ in column count.
 * - The deck's centre line is taken as x = 0; OSM's carriageways centre on
 *   -0.6 m and the lidar deck on about +0.5 m.
 * - The pylon's apex detail (the slight notch between the legs) is drawn as
 *   a plain flat top where the legs meet.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, footedLoft, groundAt, piecewise, rod, stations, type GroundGrid } from './bridge-kit'
import { box, countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements ---------------------------------------------------------------

const PY = -57                 // the pylon's centre along the bridge
const S_END = -269.8, N_END = 263.6
const HALF = 21                // half the deck's width
const TOP = 95.4               // apex over the water (lidar)

/** The roadway above the river (lidar, mean of the two carriageways). */
const road = piecewise([
  [-270, 21.73], [-250, 22.1], [-230, 22.43], [-210, 22.74], [-190, 22.94], [-170, 23.06], [-150, 23.17],
  [-130, 23.24], [-110, 23.27], [-90, 23.3], [-70, 23.25], [-50, 23.13], [-30, 23.03], [-10, 22.88], [10, 22.71],
  [30, 22.45], [50, 22.14], [70, 21.83], [90, 21.45], [110, 21.07], [130, 20.66], [150, 20.25], [170, 19.86],
  [190, 19.46], [210, 19.04], [230, 18.65], [250, 18.24], [264, 17.95],
])

/** Map ground above the river (Mapterhorn z15, 219.8 m = 0), 5 m apart across (x -25..25) and along y. */
const GROUND: GroundGrid = { y0: -290, x0: -25, step: 5, z: [
  [19.9, 20.2, 20.6, 20.8, 21.1, 21.3, 21.6, 21.8, 22.1, 21.4, 12.5], [17.8, 18.6, 19.1, 19.2, 19.3, 19.4, 19.6, 19.6, 18.8, 16.4, 11.6], [14.9, 15.8, 16.4, 16.6, 16.6, 16.8, 16.8, 16.9, 16.1, 13.8, 11.1], [12.8, 13.1, 13.8, 13.9, 13.9, 14.0, 14.1, 14.2, 13.6, 11.3, 10.6],
  [10.9, 11.0, 11.2, 11.3, 11.3, 11.4, 11.4, 11.4, 11.1, 10.5, 10.5], [10.5, 10.5, 10.5, 10.5, 10.5, 10.4, 10.4, 10.5, 10.4, 10.4, 10.4], [10.6, 10.6, 10.6, 10.6, 10.4, 10.2, 10.4, 10.6, 10.8, 10.5, 10.5], [10.8, 10.8, 10.8, 10.6, 10.0, 10.3, 10.5, 10.6, 10.9, 10.9, 10.8],
  [10.6, 10.8, 10.8, 9.9, 10.1, 10.3, 10.5, 10.8, 10.9, 11.1, 11.1], [9.5, 9.6, 9.8, 9.8, 10.0, 10.1, 10.1, 10.1, 10.1, 10.2, 10.1], [8.8, 8.9, 9.0, 9.0, 9.1, 9.1, 9.2, 9.3, 9.4, 9.5, 9.5], [7.4, 7.5, 7.8, 7.9, 8.0, 8.1, 8.2, 8.4, 8.5, 8.5, 9.0],
  [5.9, 6.0, 6.2, 6.5, 6.5, 6.5, 6.7, 6.8, 6.8, 7.2, 7.7], [4.0, 4.9, 4.8, 4.7, 4.8, 4.8, 4.9, 5.0, 5.2, 5.7, 6.0], [2.1, 2.5, 2.8, 2.9, 3.0, 3.1, 3.2, 3.2, 3.7, 4.0, 4.4], [0.2, 0.2, 0.6, 0.8, 1.1, 1.2, 1.3, 1.6, 1.9, 2.2, 2.6],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.5, 0.6], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], [0.2, 0.2, 0.2, 0.4, 0.4, 0.5, 0.5, 0.4, 0.2, 0.2, 0.4], [0.2, 0.2, 0.8, 0.8, 1.3, 1.6, 1.3, 1.1, 0.8, 0.8, 1.1],
  [1.8, 1.6, 1.3, 2.2, 2.5, 2.2, 2.1, 1.8, 1.6, 1.2, 1.3], [3.9, 3.8, 3.4, 3.4, 3.2, 3.0, 2.7, 2.5, 2.2, 1.9, 1.6], [4.2, 4.0, 4.0, 3.7, 3.5, 3.2, 3.0, 2.8, 2.5, 2.2, 1.9], [4.4, 4.2, 4.2, 4.0, 3.8, 3.6, 3.2, 3.1, 2.8, 2.6, 2.2],
  [4.5, 4.4, 4.4, 4.4, 4.2, 4.2, 4.2, 4.0, 3.9, 3.7, 3.5], [4.7, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4], [4.8, 4.7, 4.7, 4.7, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5], [4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.7, 4.7, 4.5, 4.5],
  [4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.8, 4.8, 4.8, 4.8, 4.8], [4.9, 5.0, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9], [4.9, 5.0, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.8, 4.8], [5.0, 5.0, 5.0, 5.0, 4.9, 4.9, 4.9, 4.8, 4.8, 4.8, 4.8],
  [5.0, 5.0, 5.0, 5.0, 5.0, 4.9, 4.9, 4.8, 4.8, 4.7, 4.7], [4.9, 5.0, 5.0, 5.0, 4.9, 4.9, 4.8, 4.8, 4.8, 4.7, 4.5], [4.9, 4.9, 4.9, 4.9, 4.9, 4.8, 4.8, 4.8, 4.7, 4.5, 4.5], [4.9, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7, 4.7, 4.5, 4.5, 4.5],
  [4.8, 4.8, 4.9, 4.9, 4.9, 4.8, 4.8, 4.7, 4.5, 4.5, 4.5], [4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.5, 4.5, 4.5, 4.5], [4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.7, 4.5, 4.5, 4.5, 4.5], [4.7, 4.8, 4.8, 4.8, 4.7, 4.7, 4.5, 4.5, 4.5, 4.5, 4.5],
  [4.5, 4.5, 4.7, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5], [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.5], [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4, 4.4], [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.4, 4.4, 4.2, 4.4],
  [4.4, 4.4, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4, 4.4, 4.2, 4.2], [4.2, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.2, 4.2], [4.4, 4.4, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4, 4.2, 4.2, 4.2], [5.8, 5.5, 5.4, 5.2, 5.0, 4.8, 4.5, 4.5, 4.4, 4.4, 4.4],
  [7.5, 7.2, 7.0, 6.7, 6.5, 6.2, 6.0, 5.8, 5.5, 5.2, 5.0], [9.1, 8.8, 8.5, 8.3, 8.0, 7.8, 7.5, 7.2, 7.0, 6.8, 6.5], [10.8, 10.3, 9.9, 9.8, 9.5, 9.3, 9.0, 8.8, 8.5, 8.3, 8.0], [11.0, 11.0, 11.0, 10.8, 10.8, 10.5, 10.4, 10.2, 10.0, 9.8, 9.6],
  [9.9, 10.2, 10.4, 10.5, 10.8, 10.8, 10.9, 10.9, 11.0, 11.0, 11.0], [9.6, 9.8, 9.9, 10.0, 10.1, 10.2, 10.4, 10.5, 10.6, 10.6, 10.8], [9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8], [9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8],
  [9.8, 9.8, 9.8, 9.6, 9.6, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8], [11.0, 10.5, 9.8, 9.5, 9.5, 9.6, 9.6, 9.6, 9.6, 9.6, 9.8], [13.2, 12.3, 11.6, 11.3, 10.6, 9.8, 9.5, 9.5, 9.5, 9.5, 9.6], [15.2, 14.0, 14.3, 14.4, 13.9, 13.3, 12.3, 11.0, 10.0, 9.6, 9.5],
  [17.2, 17.1, 17.3, 17.4, 17.3, 17.3, 16.9, 16.6, 15.9, 14.6, 9.9], [18.2, 18.1, 18.1, 18.1, 18.2, 18.3, 18.2, 18.1, 18.1, 17.8, 12.8], [18.1, 17.9, 17.9, 18.1, 18.1, 18.2, 18.1, 18.1, 17.9, 17.8, 12.5], [17.8, 17.8, 17.8, 17.9, 18.1, 18.1, 18.1, 17.9, 17.8, 17.8, 12.0],
  [17.6, 17.8, 17.8, 17.8, 17.9, 18.1, 17.9, 17.8, 17.8, 17.6, 11.3], [17.6, 17.6, 17.8, 17.8, 17.8, 17.9, 17.8, 17.8, 17.6, 17.6, 11.1], [17.6, 17.6, 17.6, 17.6, 17.8, 17.9, 17.8, 17.6, 17.6, 17.3, 11.2], [17.4, 17.4, 17.6, 17.6, 17.6, 17.8, 17.6, 17.6, 17.4, 17.2, 11.2],
  [17.3, 17.4, 17.4, 17.6, 17.6, 17.6, 17.6, 17.4, 17.3, 17.1, 11.2],
] }
// The same 2 m apart at the two ends, where the deck meets its abutments.
const N_GROUND: GroundGrid = { y0: 224, x0: -26, step: 2, z: [
  [9.78, 9.78, 9.78, 9.78, 9.88, 9.88, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.88, 9.78, 9.88, 9.78, 9.88, 9.88, 9.88, 9.88, 9.88, 9.88, 9.88, 9.88, 9.88, 9.88], [9.78, 9.78, 9.78, 9.78, 9.88, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.88, 9.88, 9.88, 9.88], [9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.68, 9.68, 9.68, 9.68, 9.68, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.88, 9.88, 9.88, 9.88],
  [9.78, 9.78, 9.78, 9.78, 9.78, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.78, 9.78, 9.78, 9.78, 9.78, 9.88, 9.88], [9.98, 9.88, 9.88, 9.78, 9.78, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78], [10.68, 10.58, 10.38, 10.18, 9.98, 9.68, 9.68, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.68, 9.58, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68],
  [11.58, 11.38, 11.18, 10.98, 10.58, 10.18, 9.98, 9.68, 9.68, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68], [12.48, 12.28, 11.98, 11.68, 11.38, 10.98, 10.68, 10.38, 10.28, 10.08, 9.88, 9.78, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68, 9.68], [13.38, 13.18, 12.78, 12.38, 12.08, 11.78, 11.58, 11.48, 11.38, 11.18, 10.78, 10.48, 10.08, 9.88, 9.68, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.68, 9.68],
  [14.28, 13.98, 13.48, 12.98, 12.68, 12.58, 12.58, 12.68, 12.58, 12.38, 12.08, 11.68, 11.38, 10.98, 10.58, 10.18, 9.88, 9.68, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58], [14.98, 14.68, 14.08, 13.68, 13.58, 13.58, 13.78, 13.88, 13.88, 13.68, 13.48, 13.18, 12.78, 12.48, 12.18, 11.68, 11.18, 10.78, 10.28, 9.98, 9.78, 9.58, 9.58, 9.58, 9.58, 9.58, 9.58], [15.78, 15.38, 14.78, 14.48, 14.68, 14.88, 15.08, 15.18, 15.08, 14.98, 14.78, 14.58, 14.38, 14.18, 13.78, 13.48, 12.98, 12.58, 11.98, 11.48, 10.98, 10.38, 10.08, 9.78, 9.68, 9.58, 9.58],
  [16.48, 16.08, 15.68, 15.78, 15.98, 16.18, 16.38, 16.38, 16.38, 16.28, 16.08, 15.98, 15.88, 15.68, 15.48, 15.28, 14.98, 14.68, 14.28, 13.88, 13.38, 12.78, 12.18, 11.38, 10.48, 9.78, 9.58], [17.38, 17.08, 16.88, 17.08, 17.38, 17.38, 17.48, 17.58, 17.48, 17.48, 17.38, 17.28, 17.38, 17.38, 17.18, 17.08, 16.88, 16.78, 16.58, 16.28, 16.08, 15.68, 15.18, 14.58, 13.18, 10.98, 9.78], [17.98, 17.88, 17.98, 17.88, 17.98, 18.08, 18.08, 18.18, 18.08, 18.18, 18.18, 18.18, 18.28, 18.28, 18.18, 18.18, 18.08, 17.98, 17.88, 17.78, 17.78, 17.68, 17.38, 17.28, 16.18, 12.98, 10.08],
  [18.28, 18.18, 18.08, 18.08, 18.08, 18.08, 18.08, 18.18, 18.18, 18.18, 18.28, 18.28, 18.38, 18.38, 18.38, 18.28, 18.28, 18.18, 18.18, 18.08, 18.08, 17.98, 17.98, 17.88, 17.48, 14.38, 10.68], [18.28, 18.08, 18.08, 18.08, 17.98, 17.98, 18.08, 18.08, 18.18, 18.18, 18.18, 18.28, 18.28, 18.28, 18.28, 18.28, 18.18, 18.18, 18.08, 18.08, 17.98, 17.98, 17.98, 17.88, 17.48, 14.98, 11.18], [18.28, 18.08, 18.08, 17.98, 17.98, 17.98, 18.08, 18.08, 18.08, 18.18, 18.18, 18.18, 18.28, 18.28, 18.18, 18.18, 18.18, 18.08, 18.08, 18.08, 17.98, 17.98, 17.98, 17.88, 17.48, 15.08, 10.88],
  [18.28, 18.08, 17.98, 17.98, 17.98, 17.98, 17.98, 18.08, 18.08, 18.08, 18.18, 18.18, 18.18, 18.18, 18.18, 18.18, 18.08, 18.08, 18.08, 17.98, 17.98, 17.88, 17.88, 17.88, 17.38, 14.58, 10.78], [18.18, 17.98, 17.88, 17.88, 17.88, 17.98, 17.98, 17.98, 17.98, 18.08, 18.08, 18.18, 18.18, 18.18, 18.18, 18.08, 18.08, 18.08, 17.98, 17.98, 17.98, 17.88, 17.88, 17.78, 17.18, 14.28, 10.78], [18.18, 17.88, 17.78, 17.88, 17.88, 17.88, 17.98, 17.98, 17.98, 18.08, 18.08, 18.08, 18.18, 18.18, 18.08, 18.08, 18.08, 17.98, 17.98, 17.88, 17.88, 17.88, 17.78, 17.78, 17.28, 14.08, 10.38],
  [17.98, 17.68, 17.68, 17.78, 17.88, 17.88, 17.88, 17.88, 17.98, 17.98, 18.08, 18.08, 18.08, 18.18, 18.08, 18.08, 17.98, 17.98, 17.88, 17.88, 17.88, 17.78, 17.78, 17.68, 16.88, 13.58, 10.58], [17.88, 17.58, 17.68, 17.78, 17.78, 17.78, 17.88, 17.88, 17.88, 17.98, 17.98, 17.98, 18.08, 18.08, 18.08, 17.98, 17.98, 17.98, 17.88, 17.88, 17.78, 17.78, 17.68, 17.68, 16.68, 13.28, 10.38], [17.88, 17.58, 17.68, 17.78, 17.78, 17.78, 17.88, 17.88, 17.88, 17.98, 17.98, 17.98, 18.08, 18.08, 18.08, 17.98, 17.98, 17.98, 17.88, 17.78, 17.78, 17.68, 17.68, 17.68, 16.78, 12.78, 10.28],
  [17.88, 17.48, 17.58, 17.68, 17.68, 17.78, 17.78, 17.88, 17.88, 17.88, 17.88, 17.98, 17.98, 17.98, 17.98, 17.98, 17.88, 17.88, 17.78, 17.78, 17.68, 17.68, 17.68, 17.58, 16.38, 12.88, 10.48], [17.78, 17.48, 17.58, 17.68, 17.68, 17.78, 17.78, 17.78, 17.78, 17.88, 17.88, 17.88, 17.98, 17.98, 17.98, 17.88, 17.88, 17.88, 17.78, 17.68, 17.68, 17.68, 17.68, 17.58, 16.28, 12.68, 10.28], [17.78, 17.38, 17.48, 17.68, 17.68, 17.68, 17.68, 17.78, 17.78, 17.78, 17.88, 17.88, 17.98, 17.98, 17.88, 17.88, 17.88, 17.88, 17.78, 17.68, 17.68, 17.58, 17.58, 17.48, 15.98, 12.18, 10.38],
] }
const S_GROUND: GroundGrid = { y0: -291, x0: -26, step: 2, z: [
  [19.88, 20.08, 20.18, 20.28, 20.38, 20.48, 20.58, 20.78, 20.88, 20.98, 21.08, 21.18, 21.28, 21.38, 21.48, 21.58, 21.68, 21.78, 21.88, 21.98, 22.08, 22.18, 22.28, 21.68, 19.28, 14.78, 11.38], [19.58, 19.88, 20.18, 20.28, 20.38, 20.48, 20.58, 20.68, 20.78, 20.88, 20.98, 21.08, 21.08, 21.18, 21.38, 21.38, 21.48, 21.58, 21.58, 21.78, 21.48, 21.28, 21.18, 20.48, 18.68, 14.78, 11.28], [18.68, 19.18, 19.58, 19.78, 19.88, 19.98, 20.08, 20.18, 20.28, 20.28, 20.28, 20.38, 20.38, 20.48, 20.58, 20.58, 20.68, 20.68, 20.78, 20.68, 20.28, 19.58, 18.98, 18.28, 16.58, 13.58, 11.38],
  [17.48, 17.88, 18.38, 18.58, 18.78, 18.98, 19.18, 19.28, 19.28, 19.28, 19.28, 19.38, 19.38, 19.38, 19.48, 19.58, 19.58, 19.68, 19.68, 19.68, 19.28, 18.38, 17.38, 16.48, 15.08, 12.78, 11.18], [16.48, 16.68, 17.08, 17.38, 17.68, 17.98, 18.08, 18.18, 18.18, 18.18, 18.18, 18.28, 18.28, 18.28, 18.38, 18.48, 18.48, 18.58, 18.58, 18.58, 18.18, 17.38, 16.38, 15.28, 13.98, 12.28, 10.98], [15.38, 15.58, 15.98, 16.28, 16.58, 16.88, 16.98, 17.08, 17.18, 17.18, 17.18, 17.18, 17.28, 17.28, 17.38, 17.38, 17.48, 17.48, 17.48, 17.48, 17.08, 16.28, 15.28, 14.28, 13.08, 11.78, 10.98],
  [14.38, 14.58, 14.88, 15.28, 15.58, 15.78, 15.98, 16.08, 16.08, 16.08, 16.08, 16.18, 16.18, 16.18, 16.28, 16.28, 16.28, 16.38, 16.38, 16.38, 16.08, 15.18, 14.28, 13.28, 12.28, 11.38, 10.88], [13.58, 13.68, 13.88, 14.28, 14.48, 14.78, 14.98, 14.98, 15.08, 15.08, 15.08, 15.08, 15.08, 15.08, 15.18, 15.18, 15.18, 15.28, 15.28, 15.28, 14.98, 14.28, 13.28, 12.28, 11.38, 10.88, 10.78], [12.68, 12.78, 12.98, 13.18, 13.48, 13.78, 13.88, 13.88, 13.98, 13.98, 13.98, 13.98, 13.98, 14.08, 14.08, 14.18, 14.18, 14.18, 14.28, 14.28, 13.98, 13.18, 12.18, 11.38, 10.78, 10.68, 10.68],
  [11.88, 11.88, 12.08, 12.18, 12.38, 12.68, 12.78, 12.88, 12.88, 12.88, 12.88, 12.98, 12.98, 12.98, 12.98, 13.08, 13.08, 13.08, 13.08, 13.08, 12.98, 12.18, 11.28, 10.78, 10.58, 10.58, 10.68], [11.18, 11.18, 11.28, 11.38, 11.48, 11.58, 11.78, 11.78, 11.88, 11.88, 11.88, 11.88, 11.88, 11.88, 11.98, 11.98, 11.98, 11.98, 11.98, 11.98, 11.88, 11.18, 10.68, 10.58, 10.48, 10.58, 10.58], [10.78, 10.78, 10.78, 10.88, 10.88, 10.78, 10.88, 10.88, 10.88, 10.88, 10.88, 10.98, 10.98, 10.88, 10.98, 10.98, 10.98, 10.98, 10.98, 10.98, 10.98, 10.68, 10.48, 10.48, 10.48, 10.48, 10.48],
  [10.58, 10.68, 10.68, 10.68, 10.58, 10.58, 10.48, 10.58, 10.48, 10.48, 10.48, 10.48, 10.58, 10.48, 10.48, 10.48, 10.48, 10.58, 10.48, 10.48, 10.48, 10.48, 10.48, 10.48, 10.48, 10.48, 10.48], [10.58, 10.58, 10.58, 10.58, 10.58, 10.58, 10.58, 10.58, 10.58, 10.58, 10.58, 10.48, 10.48, 10.38, 10.38, 10.38, 10.48, 10.58, 10.58, 10.48, 10.48, 10.48, 10.48, 10.48, 10.48, 10.48, 10.48], [10.58, 10.58, 10.58, 10.58, 10.58, 10.68, 10.58, 10.58, 10.58, 10.58, 10.58, 10.58, 10.38, 10.38, 10.38, 10.48, 10.48, 10.58, 10.58, 10.68, 10.58, 10.58, 10.48, 10.48, 10.48, 10.58, 10.58],
  [10.68, 10.68, 10.68, 10.58, 10.58, 10.68, 10.68, 10.68, 10.68, 10.68, 10.68, 10.38, 10.28, 10.28, 10.38, 10.48, 10.48, 10.58, 10.68, 10.68, 10.68, 10.68, 10.58, 10.58, 10.58, 10.58, 10.58], [10.68, 10.68, 10.68, 10.68, 10.68, 10.68, 10.68, 10.78, 10.68, 10.68, 10.48, 10.28, 10.18, 10.28, 10.38, 10.48, 10.58, 10.58, 10.68, 10.78, 10.78, 10.78, 10.68, 10.58, 10.58, 10.58, 10.58], [10.78, 10.78, 10.78, 10.68, 10.78, 10.78, 10.78, 10.78, 10.78, 10.48, 10.18, 10.18, 10.18, 10.28, 10.38, 10.48, 10.58, 10.58, 10.68, 10.78, 10.88, 10.88, 10.88, 10.68, 10.68, 10.68, 10.58],
  [10.88, 10.88, 10.78, 10.78, 10.78, 10.88, 10.88, 10.88, 10.58, 10.28, 10.08, 10.18, 10.18, 10.28, 10.38, 10.48, 10.58, 10.58, 10.68, 10.78, 10.88, 10.98, 10.98, 10.88, 10.78, 10.68, 10.68], [10.98, 10.88, 10.88, 10.88, 10.88, 10.88, 10.88, 10.68, 10.28, 10.08, 10.08, 10.18, 10.18, 10.28, 10.38, 10.48, 10.58, 10.68, 10.68, 10.78, 10.88, 10.98, 11.08, 11.08, 10.98, 10.88, 10.88], [10.78, 10.88, 10.88, 10.98, 10.98, 10.98, 10.68, 10.28, 10.08, 9.98, 10.08, 10.18, 10.28, 10.28, 10.38, 10.48, 10.58, 10.68, 10.68, 10.88, 10.88, 10.98, 11.08, 11.18, 11.18, 11.08, 11.08],
  [10.28, 10.38, 10.48, 10.58, 10.68, 10.58, 10.38, 10.08, 9.98, 9.98, 10.08, 10.18, 10.28, 10.28, 10.38, 10.48, 10.58, 10.68, 10.78, 10.78, 10.88, 10.88, 10.98, 11.08, 11.08, 11.08, 11.18], [9.78, 9.78, 9.88, 9.98, 10.08, 10.18, 10.08, 9.88, 9.88, 9.98, 10.08, 10.18, 10.18, 10.28, 10.38, 10.48, 10.48, 10.58, 10.58, 10.58, 10.68, 10.68, 10.68, 10.68, 10.68, 10.68, 10.68], [9.58, 9.58, 9.58, 9.68, 9.68, 9.78, 9.78, 9.78, 9.88, 9.98, 9.98, 10.08, 10.08, 10.18, 10.18, 10.18, 10.18, 10.18, 10.18, 10.18, 10.18, 10.18, 10.18, 10.18, 10.28, 10.18, 10.18],
  [9.38, 9.38, 9.48, 9.58, 9.58, 9.58, 9.58, 9.68, 9.68, 9.68, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78, 9.78], [8.98, 9.08, 9.08, 9.28, 9.28, 9.38, 9.18, 9.18, 9.28, 9.28, 9.28, 9.38, 9.38, 9.38, 9.38, 9.38, 9.48, 9.48, 9.48, 9.48, 9.58, 9.58, 9.58, 9.58, 9.58, 9.68, 9.68], [8.48, 8.58, 8.58, 8.68, 8.78, 8.88, 8.78, 8.78, 8.78, 8.88, 8.88, 8.88, 8.88, 8.98, 8.98, 8.98, 9.08, 9.08, 9.18, 9.18, 9.28, 9.28, 9.38, 9.38, 9.48, 9.58, 9.58],
] }
const inGrid = (g: GroundGrid, x: number, y: number) =>
  y >= g.y0 && y <= g.y0 + g.step * (g.z.length - 1) && x >= g.x0 && x <= g.x0 + g.step * (g.z[0].length - 1)
const ground = (x: number, y: number) =>
  inGrid(N_GROUND, x, y) ? groundAt(N_GROUND, x, y) : inGrid(S_GROUND, x, y) ? groundAt(S_GROUND, x, y) : groundAt(GROUND, x, y)

// ---- Parts --------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { concrete: Part; girder: Part; under: Part; stays: Part; veil: Part }
const newKit = (): Kit => ({ concrete: new Part(), girder: new Part(), under: new Part(), stays: new Part(), veil: new Part() })

/** A horizontal rectangle centred on (cx, cy), half-sizes hx, hy, chamfer r, at z; CCW from above. */
function ring(cx: number, cy: number, hx: number, hy: number, z: number, r: number): V3[] {
  return ([[cx - hx + r, cy - hy], [cx + hx - r, cy - hy], [cx + hx, cy - hy + r], [cx + hx, cy + hy - r],
    [cx + hx - r, cy + hy], [cx - hx + r, cy + hy], [cx - hx, cy + hy - r], [cx - hx, cy - hy + r]] as [number, number][])
    .map(([x, y]) => [x, y, z] as V3)
}

// ---- Pylon --------------------------------------------------------------------

const KINK = road(PY) - 2.6            // where the legs kink, just under the girders
const LEG_X0 = 23.2, LEG_X1 = 1.7      // upper legs' centre at the kink and at the top
const legX = (z: number) => LEG_X0 - ((LEG_X0 - LEG_X1) * (z - KINK)) / (TOP - KINK)
const CAP_TOP = 3, FOOT_X = 14.5

function pylon(k: Kit) {
  const C = one(k.concrete)
  // the pile cap in the river
  box(C, -18, 18, PY - 6, PY + 6, 0, CAP_TOP, { r: 1.2, top: 0.3 })
  for (const s of [-1, 1]) {
    // lower leg: from the pile cap out to the kink
    loftSolid(C, [ring(s * FOOT_X, PY, 2.3, 3.4, CAP_TOP - 0.2, 0.5), ring(s * LEG_X0, PY, 2.1, 3.2, KINK, 0.5)], [false, false])
    // upper leg: from the kink in to the apex, where the two meet
    loftSolid(C, [ring(s * LEG_X0, PY, 2.2, 3.2, KINK - 0.4, 0.5), ring(s * legX(70), PY, 2.0, 2.9, 70, 0.45),
      ring(s * LEG_X1, PY, 1.8, 2.8, TOP - 0.5, 0.45)], [false, false])
  }
  // the apex block where the legs meet, its top bevelled
  loftSolid(C, [ring(0, PY, 3.2, 2.8, TOP - 4, 0.45), ring(0, PY, 3.4, 2.8, TOP - 0.5, 0.45), ring(0, PY, 2.9, 2.3, TOP, 0.3)], [false, true])
  // the strut under the deck, between the kinks
  box(C, -LEG_X0, LEG_X0, PY - 2.6, PY + 2.6, KINK - 2.8, KINK + 0.2, { r: 0.4 })
}

// ---- Stays --------------------------------------------------------------------

const N_STAYS = 10, Z_LOW = 52, Z_HIGH = 91, NEAR = 16, FAR_N = 122, FAR_S = 138

function stays(k: Kit, lod: Lod) {
  for (const s of [-1, 1])
    for (const [dir, far] of [[1, FAR_N], [-1, FAR_S]] as [number, number][]) {
      const lines: [V3, V3][] = []
      for (let i = 0; i < N_STAYS; i++) {
        const t = i / (N_STAYS - 1)
        const z = Z_LOW + (Z_HIGH - Z_LOW) * t
        const y = PY + dir * (NEAR + (far - NEAR) * t)
        lines.push([[s * legX(z), PY + dir * 2.6, z], [s * (HALF + 0.4), y, road(y) + 0.6]])
      }
      if (lod === 'detail') {
        for (const [a, b] of lines) {
          rod(k.stays, a, b, 0.3, 4)
          // the blue anchor pipe over the stay's last 3.5 m
          const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), f = 1 - 3.5 / L
          rod(k.girder, [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f], b, 0.5, 6)
        }
      } else {
        for (let i = 1; i < N_STAYS; i += 2) rod(k.stays, lines[i][0], lines[i][1], 0.45, 3)
        rod(k.stays, lines[0][0], lines[0][1], 0.45, 3)
        // the fan between the stays, a faint double-sided veil
        const [[t0, d0], [t1, d1]] = [lines[0], lines[N_STAYS - 1]]
        k.veil.tri(t0, d0, d1); k.veil.tri(t0, d1, t1)
      }
    }
}

// ---- Deck ----------------------------------------------------------------------

/** Deck stations: every `step` m, with the pylon, the piers and both ends included. */
function deckStations(step: number): number[] {
  const marks = [S_END, -195, PY - 3, PY + 3, ...PIERS_N, N_ABUT, N_END].sort((a, b) => a - b)
  const out: number[] = []
  for (let i = 0; i + 1 < marks.length; i++) out.push(...stations(marks[i], marks[i + 1], step).slice(i ? 1 : 0))
  return out
}

function deck(k: Kit, lod: Lod) {
  const ys = deckStations(lod === 'low' ? 20 : 10)
  // Near the north end the deck comes down onto its embankment: nothing below the ground.
  const low = (d: number) => (y: number) => Math.max(road(y) - d, Math.min(ground(-HALF, y), ground(0, y), ground(HALF, y)))
  for (const s of [-1, 1]) {
    // the blue edge girder, its outer face flush with the parapet's
    band(k.girder, s * (HALF - 1.2), s * HALF, ys, (y) => road(y) - 0.1, low(2.4), { out: true, in: true, bottom: true, ends: true })
    // the concrete parapet beside the roadway
    band(k.concrete, s * (HALF - 0.6), s * HALF, ys, (y) => road(y) + 0.9, (y) => road(y) - 0.1, { out: true, in: true, top: true, ends: true })
  }
  // the floor's underside between the girders, facing down
  band(k.under, -HALF + 1.2, HALF - 1.2, ys, (y) => road(y) - 0.9, low(1.6), { bottom: true })
}

// ---- Piers and abutment ------------------------------------------------------------

const PIERS_N = [65, 98, 131, 164, 197, 230]
const PIERS = [-195, ...PIERS_N]
const N_ABUT = 242, N_ABUT_END = 249
const COLS = [-17, -6.5, 6.5, 17]

function piers(k: Kit) {
  const C = one(k.concrete)
  for (const y of PIERS) {
    const capTop = road(y) - 2.4, capBot = capTop - 2.0
    if (capBot - ground(0, y) < 0.8) continue
    box(C, -HALF + 0.6, HALF - 0.6, y - 1.4, y + 1.4, capBot, capTop, { r: 0.4 })
    for (const x of COLS) {
      const plan: [number, number][] = ring(x, y, 0.9, 0.9, 0, 0.25).map(([px, py]) => [px, py])
      footedLoft(k.concrete, ground, [{ plan, z: 'ground' }, { plan, z: capBot + 0.1 }], 2, false)
    }
  }
  // The south abutment: a wall across the deck's end from the bank to 0.4 m
  // under the roadway, its back in the fill.
  const wall: [number, number][] = [[-HALF - 0.6, S_END - 3], [HALF + 0.6, S_END - 3], [HALF + 0.6, S_END + 0.6], [-HALF - 0.6, S_END + 0.6]]
  footedLoft(k.concrete, ground, [{ plan: wall, z: 'ground' }, { plan: wall, z: road(S_END) - 0.4 }], 1.5)
  // The north abutment at the top of the embankment's slope: its face at
  // N_ABUT, its top 0.4 m under the roadway, back to where the map's
  // embankment reaches the roadway (y = 249); the deck runs on to its end on the ground.
  const ys = stations(N_ABUT, N_ABUT_END, 2)
  const block: [number, number][] = [...ys.map((y) => [HALF + 0.6, y] as [number, number]), ...ys.reverse().map((y) => [-HALF - 0.6, y] as [number, number])]
  const rings = [{ plan: block, z: 'ground' as const }, { plan: block, z: road(N_ABUT_END) - 0.4 }]
  footedLoft(k.concrete, ground, rings, 1.5)
}

// ---- Build -----------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  pylon(k)
  stays(k, lod)
  deck(k, lod)
  piers(k)
  return k
}

if (import.meta.main) {
  // Floodlit pylon (dusk photo): the legs' sides lit, faces looking up dimly; nothing else in the concrete.
  const flood = (p: V3, n: V3) => (Math.abs(p[1] - PY) < 8 && p[2] > 2 ? (n[2] > 0.7 ? 0.3 : 1) : 0)
  const CONCRETE = { ...finish('pylon-concrete', 0xd9d4c8), floodlight: flood }
  const GIRDER = finish('girder-blue', 0x5a84b4)
  const UNDER = finish('deck-underside', 0x8a9096)
  const STAY = { ...finish('stay-white', 0xf1f0ec), floodlight: () => 0.8 }
  const VEIL = { ...finish('stay-fan', 0xf1f0ec), opacity: 0.35, doubleSided: true }
  const low = build('low'), detail = build('detail')
  const lowList = [
    { part: low.concrete, material: CONCRETE }, { part: low.girder, material: GIRDER }, { part: low.under, material: UNDER },
    { part: low.stays, material: STAY }, { part: low.veil, material: VEIL },
  ]
  const detailList = [
    { part: detail.concrete, material: CONCRETE }, { part: detail.girder, material: GIRDER }, { part: detail.under, material: UNDER },
    { part: detail.stays, material: STAY },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the outline centroid, on the river',
    bearing: 340.2, elevation: 0, pylon: PY, ends: [S_END, N_END],
    roadwayAtPylon: road(PY), roadwayEnds: [road(S_END), road(N_END)], apex: TOP,
  }
  for (const [file, list, maxTris, maxBytes] of [
    ['kc-bond-bridge.glb', lowList, 5000, 250 * 1024],
    ['kc-bond-bridge.detail.glb', detailList, 40000, 1536 * 1024],
  ] as const) {
    const tris = countParts([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Christopher S. Bond Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
