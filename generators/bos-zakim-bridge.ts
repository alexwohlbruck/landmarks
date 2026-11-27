/**
 * Leonard P. Zakim Bunker Hill Memorial Bridge, Boston–Charlestown (2002–2003;
 * concept Christian Menn with Miguel Rosales, engineer Ruchu Hsu / Parsons
 * Brinckerhoff) — procedural, CC0-1.0. bun generators/bos-zakim-bridge.ts
 *
 * The cable-stayed bridge as one placement, end to end of its OSM outline
 * (way/508557869): the two inverted-Y concrete towers with their obelisk
 * tops, standing on the river's banks with their legs straddling the eight
 * main lanes; the main span's stays in two inclined planes from the legs and
 * shaft to the deck's edges; the back spans' stays in one central pair of
 * planes down to the median; the steel main-span deck with the two
 * cantilevered northbound lanes outside the east plane; the concrete back
 * spans, where those two lanes run on their own deck; the cross-heads under
 * the deck at the towers; back-span piers. Writes a low model (towers, deck,
 * stay fans as pale veils with every drawn stay as a bold band) and a detail model
 * (stays drawn one by one), which a map draws from detailZoom up.
 *
 * Frame: x across (+x toward the north-east, the cantilevered lanes' side),
 * y along toward Charlestown, z up, metres. Origin midway between the two
 * tower axes measured in the lidar, on the river. Placed at bearing 319.83°,
 * the line between the towers. z = 0 is the river: NAVD88 + 0.1 m (the map's
 * Mapterhorn water reads -0.1 to 0.1 m; the lidar's 0.2–0.3 m).
 *
 * Lidar: USGS 3DEP MA_CentralEastern_1_2021 (2021 flight; tools/lidar.py at
 * 1 m over the whole bridge and 0.5 m over each tower).
 * Measured:
 * - roadway (tools/bridge_ele.py measure on all three carriageways, within
 *   0.3 m of each other): a straight 5.0 % grade from 5.6 m NAVD88 at the
 *   Boston end of the outline (y = -206.9) to s = 200 m, then a vertical curve
 *   of about 210 m flattening to 20.8 m at the Charlestown end (y = 202). The
 *   model is built to that roadway (road() below); the OSM `ele` tags that
 *   give the map the same deck are in ~/landmarks-scratch/osm-ele/
 *   bos-zakim-bridge.osc (not uploaded).
 * - towers: axes 226.5 m apart at y = ±113.25; tips 90.7 m (Boston) and
 *   100.3 m (Charlestown) NAVD88, both 80.4 m over the deck there, modelled as
 *   80.5 m (published "height 270 ft (82 m)", Wikipedia: so over the deck);
 *   the obelisk's top about 4 x 4 m; the legs' outer faces ±24.5 m from the
 *   axis at deck level, leaning in 0.444 m per metre up and merging about
 *   49 m over the deck.
 * - deck: main span 58 m across (x -21.75 to 36; published width 183 ft,
 *   56 m); back spans the main box x -21 to 19 and the cantilevered lanes'
 *   deck x 23 to 35.5, apart.
 * - stays: the main span's land from the towers to 8 m short of midspan, the
 *   back spans' to y = -191.75 and +195 in the median; the highest leave the
 *   towers 62 m over the deck.
 * Published (Wikipedia "Leonard P. Zakim Bunker Hill Memorial Bridge"): total
 * 1,432 ft (436 m), main span 745 ft (227 m; lidar 226.5), width 183 ft,
 * height 270 ft, clearance 40 ft, ten lanes, four each way between the cables
 * and two cantilevered outside them; obelisk tops echoing the Bunker Hill
 * Monument.
 *
 * Photos (Wikimedia Commons; all evidence):
 * - "Zakim Bridge Aerial", Edward Orde, CC BY-SA 4.0: from the Boston end,
 *   high: the inverted Ys, the legs outside the main lanes, the back stays to
 *   the median, the cantilevered lanes east of the east leg.
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_Aerial.jpg
 * - "Zakim Bridge as seen from the south", 4300streetcar, CC BY 4.0: the
 *   tower along its axis: leg and shaft widths, junction and pyramidion.
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_as_seen_from_the_south.jpg
 * - "Zakim Bridge from Below, August 2024", 4300streetcar, CC BY 4.0: the
 *   legs running on below the deck to the bank, the cross-head, the back
 *   span's box and pier, the main span's stay brackets.
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_from_Below,_August_2024.jpg
 * - "Zakim Bridge P1030253", "Zakim Bridge and railroad bridge Boston
 *   P1010835", "Zakim Bridge, Boston, from below P1010837", NewtonCourt,
 *   CC BY-SA 4.0: tower close-up, broadside from the river (east), the main
 *   span's fascia and underside.
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_P1030253.jpg
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_and_railroad_bridge_Boston_P1010835.jpg
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge,_Boston,_from_below_P1010837.jpg
 * - "Zakim Bridge closer from Bunker Hill", VidTheKid, CC BY-SA 3.0:
 *   broadside from the north-east, both towers and fans.
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_closer_from_Bunker_Hill.jpg
 * - "Leonard P. Zakim Bunker Hill Memorial Bridge from Charlestown September
 *   2025", 4300streetcar, CC BY 4.0; "Zakim Bridge underside September 2024",
 *   4300streetcar, CC BY 4.0; "Boston, Zakim Bridge, December 28, 2011",
 *   MassDOT, public domain (the stays anchored on the legs' inner faces below
 *   the junction and on the shaft above it).
 *   https://commons.wikimedia.org/wiki/File:Leonard_P._Zakim_Bunker_Hill_Memorial_Bridge_from_Charlestown_September_2025.jpg
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_underside_September_2024.jpg
 *   https://commons.wikimedia.org/wiki/File:Boston,_Zakim_Bridge,_December_28,_2011_(6588687977).jpg
 * - Night: "Boston Zakim Bridge SW 9429 20190428", Karlunun, CC BY-SA 4.0,
 *   and "Zakim Bridge at Dusk", Eric Kilby, CC BY-SA 2.0: stays lit white,
 *   the legs washed blue.
 *   https://commons.wikimedia.org/wiki/File:Boston_Zakim_Bridge_SW_9429_20190428.jpg
 *   https://commons.wikimedia.org/wiki/File:Zakim_Bridge_at_Dusk.jpg
 *
 * Estimated (from the photos, scaled by the measured tower):
 * - legs 5.5 m across and 7.5 m along the bridge at the deck, 4.0 x 5.5 m
 *   where they merge; carried straight on below the deck to a plinth on the
 *   bank; shaft 5.4 x 5.8 m at the junction to 4.7 x 4.9 m under a 2.3 m
 *   pyramidion. The south photo, scaled by the 31.5 m from the junction to
 *   the tip (14.4 px/m), gives legs 4.2-4.7 m across horizontally and the
 *   shaft 3.75 m (lidar top ~4 m): the model is drawn about 15 % bolder so
 *   the towers hold at phone size.
 * - stays: about 18 per plane per tower in the photos, drawn at half that
 *   (9 per main-span plane, 8 per back-span plane), 0.5 m thick in the detail
 *   model and 0.9 m in the low one, where a pale half-opaque veil fills each
 *   fan so it reads as one white sheet from far off; anchored from 34 m (main) and 47 m (back) to 62 m over the deck,
 *   evenly spaced, landing from 18 m off the tower.
 * - deck depths: main box 2.8 m, cantilever 1.8 m, back-span box 3.0 m,
 *   parapets 1.1 m; the cross-heads 4.5 m deep. A soffit slab 2 m (1.2 m
 *   under the cantilevered lanes) below the roadways closes the deck seen
 *   from above, well under the map's roads; left out where the Boston end
 *   runs into the map's ground.
 * - piers: one auxiliary pier in each back span (y = -160, +158) and the end
 *   pier at Charlestown (y = 200), two columns under the main box and one
 *   under the cantilevered lanes. Their real number and stations are not
 *   measured (hidden under the deck in the lidar; no open photo shows them
 *   all).
 *
 * Ends (bridge rules): at Boston the deck comes down onto the tunnel
 * approach's fill (5.7 m against the map's 5.5 m ground), its faces running
 * into the ground. At Charlestown the I-93 viaduct carries on as bridge=yes
 * ways with no outline of their own, so it is the map's: the model ends on
 * its end pier with the deck's end face.
 *
 * Ground: Mapterhorn z15 under the site (tools/terrain.ts grid, 5 m), as the
 * GROUND table; feet sink 0.4 m into it (never below the river).
 *
 * Doubts:
 * - OSM's tower ways (way/485005954, way/485005963, building=tower,
 *   height 98) and their pyramidal parts (way/816957205, way/816957206) sit
 *   about 10 m east of the lidar's towers; replaces lists them with the
 *   outline so the map doesn't draw them.
 * - Back-span piers estimated (above). The stays' count is estimated from
 *   photos; their spacing is even, not measured.
 * - Night: the real legs are washed blue; the map's floodlight is warm white,
 *   so the towers are floodlit and the stays glow their own pale blue-white
 *   (`neon-stay`). The blue on the legs is not drawn.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { band, face, footedLoft, groundAt, rod, stations, type GroundGrid } from './bridge-kit'
import { box, countParts, loftSolid, one } from './sf-golden-gate-bridge'
import { finish } from './palette'

// ---- Measurements -------------------------------------------------------------

const TS = -113.25, TN = 113.25     // tower axes (lidar)
const Y0 = -206.9, Y1 = 202.0        // the outline's ends: Boston (deck lands), Charlestown (map's viaduct goes on)

/**
 * The roadway, metres above the river (NAVD88 + 0.1), measured: a straight
 * 5.0 % grade up from the Boston end, then from s = 200 m a 210 m vertical
 * curve to the crest at the Charlestown end.
 */
function road(y: number): number {
  const s = y - Y0
  if (s <= 200) return 5.69 + 0.05 * s
  const t = Math.min(s - 200, 210)
  return 15.69 + 0.05 * t - (0.05 / 420) * t * t
}

// The map's ground (Mapterhorn z15, tools/terrain.ts grid at the anchor,
// bearing 319.83), metres above the river, 5 m apart: x from -45, y from -215.
const GROUND: GroundGrid = { y0: -215, x0: -45, step: 5, z: [
  [2.9,2.7,2.7,3.1,3.4,3.9,5.0,5.1,5.1,5.0,5.1,5.1,5.0,5.6,5.1,5.0,3.5,3.4,3.5,3.6],
  [3.1,3.0,2.9,3.2,3.4,3.9,5.3,5.4,5.3,5.3,5.3,5.4,5.3,5.9,5.3,5.3,3.6,3.4,3.5,3.6],
  [3.1,3.1,3.0,3.2,3.4,4.1,5.6,5.7,5.6,5.4,5.6,5.6,5.6,6.2,5.7,5.5,3.7,3.4,3.6,3.6],
  [3.1,3.1,3.2,3.2,3.4,3.8,5.8,5.9,5.8,3.5,5.7,5.9,5.8,6.4,5.9,5.8,3.8,3.6,3.6,3.6],
  [3.1,3.1,3.2,3.2,3.2,3.8,6.1,6.2,6.1,5.6,6.0,6.1,6.1,6.7,6.2,6.1,3.9,3.6,3.6,3.6],
  [3.2,3.2,3.3,3.0,3.2,3.9,6.3,6.4,6.4,6.0,6.3,6.4,6.3,6.9,6.5,6.3,3.9,3.5,3.5,3.5],
  [3.2,3.2,3.3,2.9,3.1,3.6,5.8,6.0,6.0,5.8,5.9,5.8,5.2,3.2,3.1,4.9,3.6,3.4,3.4,3.4],
  [3.2,3.2,3.3,2.7,3.1,3.4,4.7,5.1,5.0,4.9,4.8,4.6,3.9,2.2,1.9,2.6,3.2,3.3,3.3,3.3],
  [3.2,3.3,3.1,2.5,2.9,3.2,4.1,4.2,4.1,4.0,3.9,3.8,3.2,2.1,2.0,2.6,3.1,3.2,3.3,3.2],
  [3.2,3.3,2.8,2.3,3.0,3.0,3.5,3.3,3.2,3.1,3.0,2.9,2.8,2.0,2.0,2.6,3.1,3.2,3.2,3.2],
  [3.3,3.4,2.3,2.1,2.9,2.8,2.8,2.7,2.5,2.4,2.3,2.2,2.0,1.8,2.0,2.5,3.0,3.1,3.1,3.1],
  [3.3,3.4,1.8,1.9,2.7,2.6,2.7,2.6,2.4,2.3,2.2,2.1,1.9,1.8,2.0,2.7,3.1,3.0,3.0,2.9],
  [3.4,3.3,1.4,2.0,2.5,2.8,3.1,2.9,2.7,2.6,2.3,2.2,2.0,1.8,1.9,2.3,2.6,2.8,2.8,3.0],
  [3.4,2.6,1.1,2.2,2.3,2.9,3.5,3.3,3.1,2.9,2.6,2.4,2.2,1.9,1.8,2.1,2.3,2.5,2.7,2.9],
  [3.3,1.3,0.8,2.1,2.2,2.3,2.5,2.4,2.4,2.3,2.3,2.3,2.2,2.1,2.1,2.1,2.1,2.3,2.5,2.8],
  [3.1,0.3,0.6,2.1,2.2,2.0,1.9,1.9,1.9,1.8,1.9,1.8,1.8,2.0,2.0,2.0,2.0,2.1,1.9,1.6],
  [2.1,0.0,0.8,2.2,2.1,2.0,1.9,1.9,1.9,1.9,1.9,1.9,1.8,1.8,1.8,1.4,1.1,0.4,0.0,0.0],
  [0.1,0.0,1.7,2.2,2.1,1.9,1.7,1.5,1.4,1.4,1.4,1.4,1.4,1.7,1.5,0.2,0.0,0.0,0.0,0.0],
  [0.0,0.0,2.7,2.5,2.1,1.9,1.6,1.3,1.1,0.8,0.7,0.7,0.8,0.8,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,0.0,3.0,2.7,2.3,1.9,1.6,1.3,1.0,0.7,0.4,0.2,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,1.8,3.1,2.9,2.7,2.1,1.6,1.2,0.9,0.6,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [0.0,2.8,3.1,3.0,2.7,2.0,1.6,1.2,0.8,0.4,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [1.0,3.0,2.8,2.5,2.2,2.0,1.6,1.1,0.7,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [2.9,2.8,2.6,2.3,2.1,1.9,1.4,0.9,0.5,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.3,2.8,2.5,2.3,2.1,1.9,1.3,0.7,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.0,2.8,2.6,2.3,2.2,2.0,1.2,0.5,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,2.9,2.8,2.5,2.2,2.0,1.0,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.0,2.9,2.6,2.4,2.0,0.7,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.0,3.0,2.7,2.5,1.9,0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.1,3.0,2.7,2.5,1.3,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.1,2.9,2.7,2.5,0.2,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.0,2.9,2.7,1.0,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.0,2.9,1.9,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.0,2.7,0.3,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,3.0,1.5,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.1,2.7,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  [3.2,0.8,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0,0.0],
  [2.3,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0,0.0],
  [0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0,0.0],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0,0.0],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0,0.0],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.0],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.2,1.9],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.6,2.4,2.8],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.1,0.1,0.9,2.7,2.8,3.0],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.1,0.4,2.4,2.9,3.0,3.1],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.5,1.3,2.6,3.1,3.2,3.3],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.7,2.7,3.1,3.3,3.4,3.4,3.4],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.4,2.2,3.4,3.5,3.6,3.6,3.6,3.4],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.3,1.3,2.9,3.7,3.7,3.7,3.7,3.6,3.4],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.3,1.0,2.0,3.2,3.8,3.8,3.7,3.7,3.5,3.3],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.7,1.6,2.6,3.5,3.9,3.8,3.8,3.7,3.4,3.3],
  [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.3,0.7,1.2,1.8,2.7,3.6,3.9,3.7,3.6,3.5,3.4,3.3],
  [0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2,0.6,1.1,1.6,2.1,2.8,3.7,3.8,3.7,3.5,3.4,3.4,3.3],
  [0.3,0.3,0.2,0.2,0.2,0.2,0.3,0.6,0.9,1.4,1.9,2.4,3.0,3.7,3.7,3.6,3.6,3.5,3.4,3.3],
  [0.3,0.3,0.3,0.3,0.2,0.3,0.6,0.9,1.3,1.6,2.0,2.4,3.0,3.5,3.5,3.6,3.6,3.5,3.4,3.3],
  [0.3,0.3,0.3,0.3,0.3,0.9,0.9,1.2,1.6,2.0,2.3,2.6,3.0,3.5,3.6,3.6,3.6,3.6,3.4,3.3],
  [0.3,0.3,0.3,0.3,0.5,0.6,1.0,1.5,1.8,2.2,2.6,2.9,3.3,3.6,3.7,3.7,3.8,3.6,3.4,3.4],
  [0.3,0.3,0.3,0.4,0.6,0.8,1.3,1.7,2.1,2.4,2.8,3.1,3.5,3.8,4.0,3.9,3.8,3.5,3.4,3.4],
  [0.3,0.3,0.4,0.6,0.7,1.5,2.5,2.7,3.0,3.2,3.4,3.7,3.9,4.1,4.2,4.0,3.8,3.6,3.5,3.5],
  [0.3,0.3,0.6,0.7,1.4,3.2,3.5,3.5,3.6,3.7,3.8,3.9,4.1,4.3,4.3,4.1,3.9,3.6,3.6,3.9],
  [0.3,0.3,0.7,1.7,3.6,4.4,4.4,4.4,4.4,4.3,4.3,4.3,4.3,4.3,4.4,4.2,3.9,3.6,4.7,6.5],
  [0.3,0.3,1.5,3.7,4.8,4.5,4.5,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.2,3.9,3.6,4.5,6.6],
  [0.3,0.3,2.6,5.0,4.8,3.6,3.6,3.6,3.7,3.8,3.9,4.1,4.2,4.4,4.4,4.2,3.9,3.7,4.1,4.5],
  [0.3,0.3,1.8,4.3,3.9,3.1,3.2,3.3,3.5,3.6,3.8,3.9,4.1,4.2,4.3,4.1,3.9,3.8,3.6,3.6],
  [0.3,0.3,1.2,2.4,3.0,3.1,3.2,3.3,3.4,3.6,3.7,3.8,3.9,4.1,4.1,3.9,3.7,3.4,3.1,2.7],
  [0.3,0.3,1.0,2.2,2.9,3.0,3.2,3.2,3.3,3.4,3.5,3.6,3.7,3.8,3.7,3.4,3.0,2.3,2.2,2.2],
  [0.3,0.3,0.5,1.7,2.5,2.9,3.0,3.0,3.1,3.1,3.2,3.3,3.4,3.4,3.1,2.5,1.9,1.8,1.9,2.6],
  [0.3,0.3,0.4,1.6,2.3,2.8,2.9,2.9,2.9,3.0,3.0,3.0,3.0,2.8,2.1,1.8,1.5,1.9,2.9,3.4],
  [0.3,0.3,0.3,1.6,2.5,2.7,2.7,2.6,2.5,2.3,2.1,1.9,1.7,1.5,1.4,1.7,2.3,2.7,2.9,3.1],
  [0.3,0.3,0.3,0.9,2.6,2.7,2.5,2.3,2.2,1.9,1.7,1.5,1.3,1.1,1.2,1.9,2.5,2.7,2.9,2.9],
  [0.3,0.3,0.3,0.9,2.6,2.7,2.5,2.3,2.1,1.9,1.7,1.5,1.4,1.3,1.5,2.0,2.7,2.9,3.0,3.0],
  [0.3,0.3,0.3,0.6,2.5,2.6,2.7,2.6,2.5,2.4,2.3,2.2,2.0,2.0,2.2,2.5,3.0,3.1,3.2,3.1],
  [0.3,0.3,0.3,0.4,2.2,2.5,2.6,2.7,2.8,2.9,2.9,2.8,2.7,2.7,3.0,3.2,3.3,3.3,3.4,3.3],
  [0.3,0.3,0.3,0.3,0.8,2.5,2.6,2.7,2.8,2.9,3.0,3.1,3.2,3.2,3.4,3.5,3.6,3.4,3.4,3.4],
] }

const ground = (x: number, y: number): number => groundAt(GROUND, x, y)
/** Feet sink 0.4 m into the map's ground (never below the river), so its coarser tiles don't leave them floating. */
const foot = (x: number, y: number): number => Math.max(0, ground(x, y) - 0.4)

// ---- Parts ---------------------------------------------------------------------

type Lod = 'low' | 'detail'
type Kit = { concrete: Part; deck: Part; under: Part; stays: Part; veil: Part }
const newKit = (): Kit => ({ concrete: new Part(), deck: new Part(), under: new Part(), stays: new Part(), veil: new Part() })

/** A rectangle centred on (cx, cy), half-sizes hx, hy, chamfered r, at height z; CCW from above. */
function ring(cx: number, cy: number, hx: number, hy: number, z: number, r: number): V3[] {
  return ([[cx - hx + r, cy - hy], [cx + hx - r, cy - hy], [cx + hx, cy - hy + r], [cx + hx, cy + hy - r],
    [cx + hx - r, cy + hy], [cx - hx + r, cy + hy], [cx - hx, cy + hy - r], [cx - hx, cy - hy + r]] as [number, number][])
    .map(([x, y]) => [x, y, z] as V3)
}

// ---- Towers --------------------------------------------------------------------

const ABOVE = 80.5, JOIN = 49, CAP = 2.3
/** A leg's outer face, its width across and its half-depth along the bridge, dz metres above the deck. */
const legOut = (dz: number) => 24.5 - 0.444 * dz
const legW = (dz: number) => 5.5 - (1.5 * dz) / JOIN
const legD = (dz: number) => 3.75 - (1.0 * dz) / JOIN
/** The shaft's half-sizes, dz above the deck. */
const shaftHX = (dz: number) => 2.7 - (0.35 * (dz - JOIN)) / (ABOVE - JOIN)
const shaftHY = (dz: number) => 2.9 - (0.45 * (dz - JOIN)) / (ABOVE - JOIN)

function tower(k: Kit, ty: number) {
  const C = one(k.concrete), deck = road(ty)
  for (const s of [-1, 1]) {
    // Where the leg's line meets the bank: a plinth there, the leg straight from it to the shaft.
    let dz0 = -deck
    for (let i = 0; i < 4; i++) {
      const cx = s * (legOut(dz0) - legW(dz0) / 2)
      dz0 = Math.max(...[-4, 4].flatMap((dx) => [-5, 5].map((dy) => ground(cx + dx, ty + dy)))) - deck
    }
    const cx0 = s * (legOut(dz0) - legW(dz0) / 2)
    const g = Math.min(...[-4.5, 4.5].flatMap((dx) => [-5.5, 5.5].map((dy) => ground(cx0 + dx, ty + dy))))
    const top = Math.max(g + 1.5, deck + dz0 + 1.5)
    const plan: [number, number][] = [[cx0 - 4.5, ty - 5.5], [cx0 + 4.5, ty - 5.5], [cx0 + 4.5, ty + 5.5], [cx0 - 4.5, ty + 5.5]]
    footedLoft(k.concrete, foot, [{ plan, z: 'ground' }, { plan, z: top }], 3)
    const ringAt = (dz: number) => ring(s * (legOut(dz) - legW(dz) / 2), ty, legW(dz) / 2, legD(dz), deck + dz, 0.5)
    loftSolid(C, [ringAt(top - 0.1 - deck), ringAt(JOIN + 3)], [false, false])
  }
  // The shaft from inside the legs' junction to the obelisk's pyramidion.
  const zs = [JOIN - 6, JOIN, 66, ABOVE - CAP]
  loftSolid(C, zs.map((dz) => ring(0, ty, shaftHX(dz), shaftHY(dz), deck + dz, 0.4)), [true, false])
  const base = ring(0, ty, shaftHX(ABOVE - CAP), shaftHY(ABOVE - CAP), deck + ABOVE - CAP, 0.4)
  const apex: V3 = [0, ty, deck + ABOVE]
  for (let i = 0; i < base.length; i++) k.concrete.tri(base[i], base[(i + 1) % base.length], apex)
  // The cross-head under the deck between the legs.
  box(C, -21, 21, ty - 3, ty + 3, deck - 7.5, deck - 3.0, { r: 0.4 })
}

// ---- Stays ---------------------------------------------------------------------

// Per tower: the main span's two planes, from the legs' inner faces and the
// shaft to the deck's edges at x = +-20.5, landing from 18 m off the tower to
// 8 m short of midspan; the back span's central pair of planes (x = +-0.9),
// from the shaft to the median, landing from 18 m off the tower to the lidar's
// last anchor. Drawn at half their estimated real number.
const N_MAIN = 9, N_BACK = 8, MAIN_LOW = 34, BACK_LOW = 47, TOP_ANCHOR = 62, NEAR = 18
const BACK_FAR = { [TS]: 78.5, [TN]: 81.75 } as Record<number, number>

function stayLines(ty: number): { main: [V3, V3][][]; back: [V3, V3][][] } {
  const deck = road(ty), dirMain = -Math.sign(ty), dirBack = Math.sign(ty)
  const main: [V3, V3][][] = [], back: [V3, V3][][] = []
  for (const s of [-1, 1]) {
    const lines: [V3, V3][] = []
    for (let i = 0; i < N_MAIN; i++) {
      const t = i / (N_MAIN - 1), dz = MAIN_LOW + (TOP_ANCHOR - MAIN_LOW) * t
      const x = dz < JOIN ? s * (legOut(dz) - legW(dz) + 0.3) : s * (shaftHX(dz) - 0.3)
      const top: V3 = [x, ty + dirMain * (dz < JOIN ? legD(dz) : shaftHY(dz)) * 0.8, deck + dz]
      const y = ty + dirMain * (NEAR + (Math.abs(ty) - 8 - NEAR) * t)
      lines.push([top, [s * 20.5, y, road(y) + 0.2]])
    }
    main.push(lines)
  }
  for (const s of [-1, 1]) {
    const lines: [V3, V3][] = []
    for (let i = 0; i < N_BACK; i++) {
      const t = i / (N_BACK - 1), dz = BACK_LOW + (TOP_ANCHOR - BACK_LOW) * t
      const top: V3 = [s * 0.9, ty + dirBack * shaftHY(dz) * 0.8, deck + dz]
      const y = ty + dirBack * (NEAR + (BACK_FAR[ty] - NEAR) * t)
      lines.push([top, [s * 0.9, y, road(y) + 0.9]])
    }
    back.push(lines)
  }
  return { main, back }
}

function stays(k: Kit, ty: number, lod: Lod) {
  const { main, back } = stayLines(ty)
  for (const lines of [...main, ...back]) {
    if (lod === 'detail') for (const [a, b] of lines) rod(k.stays, a, b, 0.25, 6)
    else {
      for (const [a, b] of lines) rod(k.stays, a, b, 0.45, 3)
    }
  }
  if (lod === 'low') for (const lines of [...main, back[0]]) {
    // The fan between the stays, a pale double-sided veil so the fan reads as one sheet from far off.
    const ls = lines === back[0] ? back[0].map(([a, b]) => [[0, a[1], a[2]], [0, b[1], b[2]]] as [V3, V3]) : lines
    for (let i = 0; i < ls.length - 1; i++) {
      const [t0, d0] = ls[i], [t1, d1] = ls[i + 1]
      k.veil.tri(t0, d0, d1); k.veil.tri(t0, d1, t1)
    }
  }
}

// ---- Deck ----------------------------------------------------------------------

/** A face bottom that never reaches below the map's ground at x (the deck's Boston end runs into the fill). */
const under = (x: number, depth: number) => (y: number) => {
  // Where the deck comes within 1.2 m of the ground, its faces run down into
  // it: the Boston end comes off its fill.
  const g = ground(x, y), b = road(y) - depth
  return b - g > 1.2 ? b : Math.min(b, g - 0.4)
}

/**
 * A soffit slab under the roadways, its top `d` metres under the road: seen
 * through the open deck from above where the map draws no road, as in the
 * previews. Its top is left out where it would sit in the map's ground.
 */
function soffit(p: Part, x0: number, x1: number, ys: number[], d: number, depth: number) {
  const topAt = (y: number) => road(y) - d
  band(p, x0, x1, ys, topAt, under((x0 + x1) / 2, depth), { bottom: true })
  const clear = ys.filter((y) => topAt(y) > Math.max(...[x0, (x0 + x1) / 2, x1].map((x) => ground(x, y))) + 0.3)
  if (clear.length > 1) band(p, x0, x1, clear, topAt, under((x0 + x1) / 2, depth), { top: true })
}

function deckSpan(k: Kit, ys: number[], main: boolean) {
  const top = (y: number) => road(y) - 0.2, para = (y: number) => road(y) + 1.1
  const F = { out: true, in: true, bottom: true }
  if (main) {
    // Steel main span: west fascia, the cantilevered lanes' east fascia, the
    // box's underside and the shallower cantilever soffit outside it.
    band(k.deck, -21.75, -20.75, ys, top, under(-21.75, 2.8), F)
    band(k.deck, 35, 36, ys, top, under(36, 1.8), F)
    soffit(k.under, -20.75, 20.75, ys, 2.0, 2.8)
    band(k.under, 20.25, 20.75, ys, (y) => road(y) - 1.8, under(20.75, 2.8), { out: true })
    soffit(k.under, 20.75, 35, ys, 1.2, 1.8)
    band(k.deck, -21.75, -21.25, ys, para, top, { out: true, in: true, top: true })
    band(k.deck, 35.5, 36, ys, para, top, { out: true, in: true, top: true })
  } else {
    // Concrete back spans: the main box (-21 to 19) and, apart from it, the
    // cantilevered lanes' own deck (23 to 35.5).
    band(k.deck, -21, -20, ys, top, under(-21, 3.0), F)
    band(k.deck, 18, 19, ys, top, under(19, 3.0), F)
    band(k.deck, 23, 24, ys, top, under(23, 2.2), F)
    band(k.deck, 34.5, 35.5, ys, top, under(35.5, 2.2), F)
    soffit(k.under, -20, 18, ys, 2.0, 3.0)
    soffit(k.under, 24, 34.5, ys, 1.2, 2.2)
    // The median curb the back stays anchor in.
    band(k.deck, -1.3, 1.3, ys, (y) => road(y) + 0.9, under(0, 1.5), { out: true, in: true, top: true })
    for (const [x0, x1] of [[-21, -20.5], [18.5, 19], [23, 23.5], [35, 35.5]])
      band(k.deck, x0, x1, ys, para, top, { out: true, in: true, top: true })
  }
}

/** The deck's end face at y, between x0 and x1, facing `dir` along the bridge. */
function endFace(p: Part, y: number, x0: number, x1: number, depth: number, dir: number) {
  const zt = road(y) - 0.2, zb = Math.max(road(y) - depth, ground((x0 + x1) / 2, y))
  if (zt - zb > 0.1) face(p, [x0, y, zb], [x1, y, zb], [x1, y, zt], [x0, y, zt], [0, dir, 0])
}

function deck(k: Kit, lod: Lod) {
  const step = lod === 'low' ? 24 : 12
  deckSpan(k, stations(Y0, TS, step), false)
  deckSpan(k, stations(TS, TN, step), true)
  deckSpan(k, stations(TN, Y1, step), false)
  for (const [y, dir] of [[Y0, -1], [Y1, 1]] as [number, number][]) {
    endFace(k.deck, y, -21, 19, 3.0, dir)
    endFace(k.deck, y, 23, 35.5, 2.2, dir)
  }
}

// ---- Piers ---------------------------------------------------------------------

// Back-span piers (estimated): one auxiliary pier in each back span and the
// Charlestown end pier, where the map's viaduct takes over. Two columns under
// the main box's cap, one under the cantilevered lanes'.
const PIERS = [-160, 158, Y1 - 2]

function piers(k: Kit) {
  const C = one(k.concrete)
  for (const y of PIERS) {
    // Caps shallower where the deck is low, so they stay clear of the ground.
    const g = Math.max(...[-20, 0, 18, 35].map((x) => ground(x, y)))
    const capTop = road(y) - 3.0, capBot = Math.max(capTop - 2.0, g + 1.3)
    const cTop = capTop + 0.8, cBot = Math.max(cTop - 1.6, g + 1.3)
    box(C, -20.5, 18.5, y - 1.75, y + 1.75, capBot, capTop, { r: 0.4 })
    box(C, 23.5, 35, y - 1.5, y + 1.5, cBot, cTop, { r: 0.3 })
    for (const [x, top] of [[-11, capBot], [9, capBot], [29.25, cBot]] as [number, number][]) {
      const plan: [number, number][] = [[x - 1.75, y - 1.75], [x + 1.75, y - 1.75], [x + 1.75, y + 1.75], [x - 1.75, y + 1.75]]
      footedLoft(k.concrete, foot, [{ plan, z: 'ground' }, { plan, z: top + 0.1 }], 2.5, false)
    }
  }
}

// ---- Build -----------------------------------------------------------------------

function build(lod: Lod): Kit {
  const k = newKit()
  for (const ty of [TS, TN]) { tower(k, ty); stays(k, ty, lod) }
  deck(k, lod)
  piers(k)
  return k
}

if (import.meta.main) {
  // Night: the towers floodlit (only near the tower axes; faces looking up
  // dimmer), the stays glowing their own pale blue-white.
  const flood = (p: V3, n: V3) => (Math.abs(Math.abs(p[1]) - 113.25) < 12 && p[2] > 3 ? (n[2] > 0.7 ? 0.3 : 1) : 0)
  const CONCRETE = { ...finish('tower-concrete', 0xbebcb4), floodlight: flood }
  const DECK = finish('deck-fascia', 0xc4c6c4)
  const UNDER = finish('deck-underside', 0x8d9296)
  const STAY = finish('neon-stay', 0xf8fafc)
  const VEIL = { ...finish('stay-fan', 0xf4f6f8), opacity: 0.5, doubleSided: true }
  const low = build('low'), detail = build('detail')
  const lowList = [
    { part: low.concrete, material: CONCRETE }, { part: low.deck, material: DECK }, { part: low.under, material: UNDER },
    { part: low.stays, material: STAY }, { part: low.veil, material: VEIL },
  ]
  const detailList = [
    { part: detail.concrete, material: CONCRETE }, { part: detail.deck, material: DECK }, { part: detail.under, material: UNDER },
    { part: detail.stays, material: STAY },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the tower axes, on the river',
    bearing: 319.83, elevation: 0, towers: [TS, TN], ends: [Y0, Y1],
    roadwayEnds: [road(Y0), road(Y1)], roadwayAtTowers: [road(TS), road(TN)], towerTops: [road(TS) + ABOVE, road(TN) + ABOVE],
  }
  for (const [file, list, maxTris, maxBytes] of [
    ['bos-zakim-bridge.glb', lowList, 5000, 250 * 1024],
    ['bos-zakim-bridge.detail.glb', detailList, 40000, 1536 * 1024],
  ] as const) {
    const tris = countParts([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Leonard P. Zakim Bunker Hill Memorial Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
