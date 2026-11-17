/**
 * Hyatt Regency Dallas (300 Reunion Boulevard East, 1978, Welton Becket &
 * Associates) — original procedural geometry, CC0-1.0.
 * bun generators/dal-hyatt-regency.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/610136503 (tourism=hotel),
 * 32.7756328, -96.809383. The central tower's slab walls run at 327° / 57°
 * (length-weighted edge histogram of the parts), so the catalog bearing is
 * 327 and the central slabs are square to this frame; the north wing turns
 * a further ~30° (the hotel's "Y"), as OSM draws it.
 *
 * Identity, in order: the staggered mirror-glass slabs stepping down from a
 * 28-storey crown slab to the north and south in many terraces; the
 * half-round stair drums on the slab ends; the coarse bright mullion grid on
 * the silver-blue mirror glass; the sloped glass atrium roofs on the south
 * face; the long low precast podium and convention wing.
 *
 * Evidence:
 *  - plan: every OSM building:part inside the outline (41 ways, listed in
 *    PARTS by id), extruded as drawn; they cover the outline completely.
 *    Simplified only by dropping collinear and sub-0.25 m points. Checked
 *    against USGS NAIP (0.4 m) for the slab plan and the podium.
 *  - heights: USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight). y = 0
 *    is the lowest ground, on the west side (1.7 m above the box's
 *    ground_min). The mirror glass gives almost no lidar returns on the
 *    upper slabs, so only these roofs are measured (median DSM in the
 *    part, minus 1.7): 379 north end 49.9 m, 368 52.9, 367 and 369 40.8,
 *    atrium 364 37.7, skillion 363 high side 42.2, podium 354 17.5,
 *    convention wing 700/701 18.8, 360 18.8, 362 13.2, and the small podium
 *    parts as marked in H. Those measured roofs sit 4.8-5.9 m above the OSM
 *    heights (OSM measures from the east plaza), so every unmeasured tower
 *    slab is OSM height + 5.5 (estimated): crown slab 373 96 -> 101.5 m.
 *    Published: 343 ft / 105 m roof, 28 floors (Wikipedia); the model's
 *    101.5 m crown is 3.5 m under it (doubt: OSM's 96 may be low, or the
 *    105 m counts from a lower grade).
 *  - skillions: 363 and 366 are tagged roof:shape=skillion without a
 *    direction; both fall to the south, as Carol M. Highsmith's view from
 *    the south shows the sloped glass stepping down toward the camera. Low
 *    sides are the neighbouring roofs (estimates).
 *  - facade: real grid is one storey of square mirror panels with bright
 *    mullions (all photos); drawn as pale lines every three storeys
 *    (9.6 m) and mullions ~9.6 m apart, plus bright corner mullions. The
 *    podium's glazed band over pale panels between precast piers ~10 m
 *    apart from Highsmith's photo of the convention wing; elsewhere on the
 *    podium (west side, unphotographed) the same treatment is assumed.
 *  - colour: the mirror glass reads silver to sky blue in every daylight
 *    photo; pulled to a light windowVariant (#a9bfd1) as STYLE.md asks.
 *    Precast podium tan from Highsmith, pulled light (#e2d3bb).
 *  - night: the hotel's windows are lit (Milestone2's dusk view), so the
 *    mirror glass is `window-2`; the sloped atrium roofs stay `glass`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hyatt_Regency,_Dallas,_Texas.jpg, Texas Lane, CC BY-SA 4.0
 *  - Downtown_Dallas_Skyline_with_shot_of_Hyatt_Regency_Dallas_and_the_Reunion_Tower.jpg,
 *    Milestone2, CC BY-SA 3.0 (from the north-east, dusk)
 *  - Reunion_Tower_-_Hyatt_Regency.jpg, Farragutful, CC BY-SA 4.0 (east)
 *  - Reunion_tower_dallas.jpg, Batrak, CC BY-SA 2.0 (west)
 *  - Reunion_tower_dallas_texas_051605_kdh.jpg, Kevin D. Hartnell, CC BY-SA 3.0
 *  - Reunion-Tower-0268.jpg, Loadmaster (David R. Tribble), CC BY-SA 3.0
 *  - Reunion_Tower,_a_561-foot-high_observation_tower..._LCCN2014632137.tif,
 *    Carol M. Highsmith, public domain (south)
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: the upper slab heights rest on OSM (+5.5 m), not lidar; part 365
 * (OSM 44, drawn 49.5) has a few lidar returns at ~39.6 that may be a lower
 * terrace; the west podium face is unphotographed; the Reunion Tower and its
 * base (way/1428779225, parts 1491048355-59) are not part of this model.
 *
 * Left out: the fine one-storey mirror grid, rooftop plant, the porte-cochère
 * canopy detail, the tunnel to Union Station.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, inset, inside, panel, save, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7756328, -96.809383]
const BEARING = 327
/** Three storeys of ~3.2 m: the pitch of the pale lines on the mirror glass. */
const GRID = 9.6

/**
 * The OSM building:part ways inside the outline way/610136503, as
 * east/north metres from the anchor (simplified: collinear and sub-0.25 m
 * points dropped), counter-clockwise.
 */
const PARTS: Record<number, number[]> = {
  1491048351: [2.5, 39.5, 9.1, 43.8, 3.5, 52.6, 15.8, 60.6, 14.4, 65, 11.8, 68.8, 8.2, 71.2, 0.1, 66.3, -4, 63.7, -8.2, 70.2, -15.2, 66],
  1491048352: [-1.9, 46.1, -0.5, 47.2, 0.2, 49, 0.3, 51, -0.3, 52.7, -1.7, 53.8, -3.5, 54.6, -5.3, 54.6, -6.9, 53.7],
  1491048353: [-12.6, 85.3, -21.8, 92.1, -23.2, 91.9, -26.3, 91.3, -22.8, 63.7, -13.7, 49.2, -6.9, 53.7, -15.2, 66, -18.3, 70.4, -19.7, 84.1],
  1491048354: [-32, 37.2, -48.6, 26.4, -49.2, 25.5, -55.6, -6, -55.5, -6.9, -55, -7.8, -22.3, -58.3, -21.3, -58.9, -20.7, -59.1, -19.4, -58.9, 8.1, -41.5, 8.6, -40.4, 8.7, -39.3, 8.1, -38.7, -10.3, -10.4, -8.4, -9.3, -17.7, 5, -15.2, 6.6, -25.1, 21.5, -22.6, 23.2],
  1491048360: [-26.3, 91.3, -23.2, 91.9, -15.7, 86, -14.5, 85.3, -12.6, 85.3, 14, 119.5, 14, 121.4, 0.2, 132, 0.9, 133.5, 1.5, 133.5, 2, 133.7, 2.7, 134.3, 3.1, 135.1, 3.1, 136, 2.8, 136.9, -10.9, 152.8, -11.7, 153.5, -12.6, 153.9, -13.7, 153.8, -14.8, 153.3, -15.5, 152.1, -15.5, 151, -15.2, 150.2, -14.5, 149.5, -18.9, 143.5, -19.7, 144.1, -20.5, 144.2, -21.4, 144.2, -22.2, 143.8, -39, 122.8, -46.6, 112.1, -46.6, 110.5, -45.4, 108.9, -42.8, 107, -27.1, 97.1],
  1491048361: [24.9, 33.7, 20.5, 40.5, 14, 36.3, 18.4, 29.6],
  1491048362: [21.4, 2.8, 0.7, -10.5, 15.8, -33.8, 8.1, -38.7, 8.7, -39.3, 8.6, -40.4, 8.1, -41.5, -19.4, -58.9, -20.7, -59.1, -21.3, -58.9, -22.3, -58.3, -10.8, -76, 1.1, -53.2, 5.4, -50.5, 21.6, -49.9, 53.4, -65.6, 62.4, -60.2],
  1491048363: [36, 12.2, 34.4, 14.6, 31, 12.4, 29.3, 15, -2.6, -5.5, 0.7, -10.5],
  1491048364: [6.8, -19.7, 42, 3.1, 36, 12.2, 0.7, -10.5],
  1491048365: [-6.1, 5.2, -0.1, -3.9, 26.2, 13, 20.3, 22.1],
  1491048366: [-6.1, 5.2, 20.3, 22.1, 18.6, 24.7, 15.4, 22.7, 9.1, 32.7, -14.3, 18.1],
  1491048367: [34.4, 14.6, 42.5, 2.4, 43.3, 1.8, 44.3, 1.5, 45.2, 1.4, 46.1, 1.6, 46.9, 2.1, 47.6, 2.7, 48.1, 3.6, 48.3, 4.3, 48.3, 5.1, 48, 6, 47.6, 6.8, 50.3, 8.5, 40.7, 23.5, 28.8, 15.7, 29.3, 15, 31, 12.4],
  1491048368: [18.6, 24.7, 26.2, 13, 26.8, 12.4, 27.4, 12, 28.3, 11.8, 29.3, 11.7, 30.2, 11.9, 31, 12.4, 31.7, 13, 32.1, 13.7, 32.4, 14.5, 32.4, 15.4, 32.1, 16.2, 31.8, 17, 34.6, 18.9, 24.9, 33.7, 12.8, 26, 15.4, 22.7],
  1491048369: [-10.9, -10.8, -1.6, -25.1, -0.9, -24.6, 1.1, -23.4, 2.3, -24.5, 4.2, -24.8, 6, -24.2, 7, -22.8, 7.2, -21.9, 7.3, -21.2, 6.8, -19.7, -2.6, -5.5],
  1491048370: [-17.7, 5, -8.4, -9.3, -5.8, -7.6, -4.5, -8.7, -2.7, -9, -0.9, -8.3, 0.2, -7, 0.3, -6.1, 0.4, -5.3, -0.1, -3.9, -9.4, 10.3],
  1491048371: [-12, 19.6, 5.5, 30.5, 2.3, 35.4, -15, 24.1],
  1491048372: [-25.1, 21.5, -15.2, 6.6, -12.6, 8.2, -11.4, 7.1, -9.5, 6.8, -7.6, 7.5, -6.7, 8.8, -6.5, 9.7, -6.4, 10.5, -7, 12, -15, 24.1, 2.3, 35.4, 10.2, 23.5, 11.6, 22.2, 13.5, 21.8, 15.4, 22.7, 16.3, 23.9, 16.6, 25.5, 15.9, 27.2, 18.8, 29.1, 18.4, 29.6, 9.1, 43.8],
  1491048373: [-13.5, 23.9, -12.4, 23.1, -11, 23.1, -1.7, 29.3, -1.5, 30.5, -1.7, 31.7, -12.4, 47.5, -24.2, 40.1],
  1491048374: [-22.2, 22.5, 2.8, 39, -6.9, 53.7, -20.7, 44.6, -21.4, 45.6, -22.8, 46.3, -24.4, 46.3, -25.8, 45.6, -26.9, 44, -26.9, 42.1, -26.2, 41, -32, 37.2],
  1491048375: [-29, 39.1, -13.7, 49.2, -22.8, 63.7, -30, 58.9, -30.8, 59.9, -32.2, 60.6, -33.8, 60.6, -35.2, 59.9, -36.3, 58.3, -36.3, 56.4, -35.6, 55.3, -38.5, 53.4],
  1491048376: [-41.1, 60.6, -40.1, 60.6, -39.8, 59.4, -40.2, 59.1, -40.5, 58.5, -40.7, 57.7, -40.6, 56.9, -40.2, 56, -39.5, 55.4, -38.8, 55.2, -38.1, 55.1, -37.5, 54.1, -35.6, 55.3, -22.8, 63.7, -25, 80.5, -33.4, 79.4, -33.6, 80.7, -34.6, 81.9, -36.1, 82.6, -37.6, 82.5, -39.3, 81.5, -40.1, 79.7, -39.9, 78.4, -43.2, 78],
  1491048377: [-43.2, 78, -25, 80.5, -27.1, 97.1, -35.4, 96.1, -35.7, 97.4, -36.6, 98.7, -38.1, 99.3, -39.7, 99.3, -41.3, 98.3, -42.2, 96.6, -42, 95.3, -45.3, 95],
  1491048378: [-42.8, 107, -43.4, 106.1, -42.7, 105.6, -43, 102.5, -43.7, 102.4, -44.4, 102.2, -44.9, 101.5, -45.2, 100.7, -45.3, 99.8, -44.8, 99, -44.4, 98.5, -43.8, 98.3, -44.1, 95.1, -27.1, 97.1, -15.4, 111.6, -22.4, 117.3, -21.7, 118.1, -21.5, 119.7, -22, 121.2, -23.1, 122.3, -24.9, 122.8, -26.8, 122.3, -27.6, 121.3, -30.2, 123.2],
  1491048379: [-30.2, 123.2, -15.4, 111.6, -5, 125.4, -11.8, 130.7, -11.2, 131.5, -10.9, 133.1, -11.4, 134.6, -12.5, 135.7, -14.3, 136.3, -16.2, 135.7, -17, 134.7, -19.5, 136.6],
  1491058685: [-50.8, 30.8, -55.6, 31.7, -60.2, 7.9, -55.5, 7],
  1491058686: [-47.2, 47.2, -47.6, 48.2, -47.6, 51.3, -48.3, 52.7, -49.1, 53.9, -50.1, 54.7, -51.3, 55.2, -53.9, 55.3, -55.9, 54.4, -57.2, 53.1, -58.1, 51.6, -61.6, 34, -61.2, 32.6, -60.6, 31.2, -59.9, 30.1, -59, 29.2, -56.2, 28.6, -54.3, 28.6, -52.8, 29.2, -51.5, 30, -50.8, 30.8],
  1491058687: [-55, -7.8, -57.1, -9, -24.4, -59.6, -22.3, -58.3],
  1491058688: [-55, -7.8, -55.5, -6.9, -55.6, -6, -49.2, 25.5, -48.6, 26.4, -29, 39.1, -38.5, 53.4, -46.1, 48.4, -47.2, 47.2, -50.8, 30.8, -58.2, -6.7, -56.2, -9.2, -54.9, -9.7, -53.9, -9.5],
  1491058689: [-10.8, -76, -10.5, -75.3, -21.3, -58.9, -22.3, -58.3],
  1491058690: [-4.3, -86.5, -3.2, -84.4, -6.1, -83.2, -23.3, -56.8, -23.9, -57.7, -24, -58.9, -23.2, -61.3, -7.6, -84.8],
  1491058691: [74.3, -95.9, 76.9, -90.2, 77.2, -89, 76.9, -87.7, 60, -61.7, 58.8, -62.4, 74.8, -86.3, 75.3, -87.8, 75.5, -89.6, 72.5, -95.1],
  1491058692: [54.6, -113.5, 53.5, -115.7, 55.7, -116.7, 56.8, -116.8, 62.7, -116.5, 63.9, -115.8, 64.7, -114.9, 67.4, -109.6, 65.5, -108.6, 63, -113.4, 62.1, -114.3, 61.3, -114.6, 57.9, -114.6, 56.5, -114.5],
  1491058693: [54.6, -113.5, 56.5, -114.5, 57.9, -114.6, 61.3, -114.6, 62.1, -114.3, 63, -113.4, 65.5, -108.6, 64, -107.9, 62.6, -109.7, 61.5, -110.1, 54.8, -110.1],
  1491058694: [64, -107.9, 70.5, -111.1, 71.2, -109.6, 72.8, -110.4, 78.1, -99.7, 76.5, -99, 77.3, -97.4, 70.8, -94.2],
  1491058695: [44.5, -114, 45.4, -112.2, 3.1, -91.1, 2.1, -93],
  1491058696: [46.7, -109.8, 4.5, -88.5, 3.1, -91.1, 45.4, -112.2],
  1491058697: [48.5, -106.6, 43.4, -115.9, 51.1, -120, 56.2, -110.7],
  1491058698: [-1.6, -81.6, -6.7, -90.9, 1, -95, 6, -85.7],
  1491058699: [8.1, -38.7, 10, -37.5, 10.8, -38.6, 12, -39.4, 13.7, -39.5, 14.5, -39.3, 15.4, -39, 16, -38.3, 16.4, -37.6, 16.8, -36.1, 16.5, -34.9, 15.8, -33.8, 6.8, -19.7, -0.9, -24.6],
  1491058700: [2.5, -87.1, 3.1, -87.8, 46.7, -109.8, 47.8, -110.2, 61.5, -110.1, 62.6, -109.7, 64, -107.9, 70.8, -94.2, 72.5, -95.1, 75.5, -89.6, 75.3, -87.8, 74.8, -86.3, 58.8, -62.4, 53.4, -65.6, 21.6, -49.9, 5.4, -50.5, 1.1, -53.2, -10.8, -76, -6.1, -83.2, -3.2, -84.4, -1.6, -81.6],
  1491058701: [20.9, -51.7, 20, -51.7, 7.5, -52.3, 6.4, -52.7, 5.5, -53.6, -5.3, -75.1, -5.3, -76.1, -4.9, -77.3, 2.5, -87.1, 3.1, -87.8, 46.7, -109.8, 47.8, -110.2, 61.5, -110.1, 62.6, -109.7, 64, -107.9, 73.5, -88.9, 73.6, -87.7, 73.2, -86.4, 64.6, -73.7],
}

/**
 * Heights above y = 0 (the lowest ground, on the west side by Reunion
 * Boulevard, 1.7 m above the lidar box's ground_min). `m` = lidar roof
 * (median DSM inside the part, minus 1.7); `o` = OSM height + 5.5, the
 * offset the measured tower roofs show (OSM heights are from the east plaza).
 * [top, kind, low side of a skillion]
 */
type Kind = 'mirror' | 'stone' | 'atrium'
const H: Record<number, [number, Kind, number?]> = {
  // the tower: staggered mirror-glass slabs
  1491048373: [101.5, 'mirror'], // o 96, crown slab
  1491048374: [95.5, 'mirror'], // o 90
  1491048375: [89.5, 'mirror'], // o 84
  1491048376: [77.5, 'mirror'], // o 72
  1491048377: [65.5, 'mirror'], // o 60
  1491048378: [55.5, 'mirror'], // o 50
  1491048379: [49.9, 'mirror'], // m (OSM 44)
  1491048372: [65.5, 'mirror'], // o 60
  1491048371: [64.5, 'mirror'], // o 59
  1491048366: [63.5, 'atrium', 49.5], // o 58, glass skillion falling south to 365
  1491048365: [49.5, 'mirror'], // o 44
  1491048370: [53.5, 'mirror'], // o 48
  1491048368: [52.9, 'mirror'], // m (OSM 48)
  1491048367: [40.8, 'mirror'], // m (OSM 36)
  1491048369: [40.8, 'mirror'], // m (OSM 36)
  1491048363: [42.2, 'atrium', 37.7], // m high side (OSM 38), glass skillion falling south
  1491048364: [37.7, 'atrium'], // m (OSM 33), atrium roof
  1491048361: [18.8, 'mirror'], // m (OSM 15)
  1491048352: [16.8, 'mirror'], // m (OSM 8)
  1491058699: [16.2, 'mirror'], // m (OSM 13)
  // podium, porte-cochere and the convention wing: precast stone
  1491048354: [17.5, 'stone'], // m (OSM 14)
  1491048360: [18.8, 'stone'], // m (OSM 15)
  1491048362: [13.2, 'stone'], // m (OSM 10)
  1491048351: [14.0, 'stone'], // m (OSM 6, min 3)
  1491048353: [11.7, 'stone'], // m (OSM 7)
  1491058700: [18.8, 'stone'], // m (OSM 15)
  1491058701: [18.8, 'stone'], // m (OSM 16)
  1491058685: [4.0, 'stone'], // m (OSM 3)
  1491058686: [6.8, 'stone'], // m (OSM 10)
  1491058687: [13.5, 'stone'], // m (OSM 10)
  1491058688: [13.0, 'stone'], // m (OSM 11)
  1491058689: [13.2, 'stone'], // m (OSM 14)
  1491058690: [14.3, 'stone'], // m (OSM 11)
  1491058691: [14.2, 'stone'], // m (OSM 11)
  1491058692: [13.5, 'stone'], // estimated from its neighbours (OSM 11)
  1491058693: [15.5, 'stone'], // estimated (OSM 15)
  1491058694: [16.7, 'stone'], // m (OSM 18)
  1491058695: [14.2, 'stone'], // m (OSM 12, min 5)
  1491058696: [18.6, 'stone'], // m (OSM 14)
  1491058697: [16.7, 'stone'], // estimated as 694/698 (OSM 18)
  1491058698: [16.7, 'stone'], // m (OSM 18)
}

/** east/north → the model's turned frame (x 90° clockwise of the bearing, y along it). */
function frame(flat: number[]): XY[] {
  const b = (BEARING * Math.PI) / 180, out: XY[] = []
  for (let i = 0; i < flat.length; i += 2) {
    const e = flat[i], n = flat[i + 1]
    out.push([e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)])
  }
  return out
}

/** Interior angle turn at vertex i, in degrees (0 = straight). */
function turn(r: XY[], i: number) {
  const p = r[(i - 1 + r.length) % r.length], c = r[i], n = r[(i + 1) % r.length]
  const a = Math.atan2(c[1] - p[1], c[0] - p[0]), b = Math.atan2(n[1] - c[1], n[0] - c[0])
  let d = ((b - a) * 180) / Math.PI
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}

function build() {
  const mirror = new Part(), trim = new Part(), stone = new Part(), roof = new Part(), win = new Part(), glass = new Part()
  const all = Object.entries(PARTS).map(([k, flat]) => ({ id: Number(k), r: frame(flat), top: H[Number(k)][0], low: H[Number(k)][2] }))

  /**
   * How high the wall a→b of part `id` is buried in its neighbours: the
   * lowest, along the wall, of the tallest other part just outside it. Walls,
   * lines and mullions below that are never seen, so they are not drawn.
   */
  function buried(id: number, a: XY, b: XY) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    let h = Infinity
    for (const t of [0.08, 0.3, 0.5, 0.7, 0.92]) {
      const q: XY = [a[0] + (b[0] - a[0]) * t + n[0] * 0.4, a[1] + (b[1] - a[1]) * t + n[1] * 0.4]
      let m = 0
      for (const o of all) if (o.id !== id && inside(q, o.r)) m = Math.max(m, o.low ?? o.top)
      h = Math.min(h, m)
    }
    return h
  }

  for (const { id, r, top, low } of all) {
    const kind = H[id][1]
    const edges = r.map((a, i) => {
      const b = r[(i + 1) % r.length]
      return { a, b, L: Math.hypot(b[0] - a[0], b[1] - a[1]), z0: buried(id, a, b) }
    })
    if (kind === 'stone') {
      // Precast podium: wall, a pale coping band, flat roof.
      const ins = inset(r, 0.35)
      edges.forEach(({ a, b, z0 }, i) => {
        const c = ins[i], d = ins[(i + 1) % r.length]
        if (z0 < top - 0.8) stone.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], top - 0.8], [a[0], a[1], top - 0.8])
        if (z0 < top - 0.35) trim.quad([a[0], a[1], Math.max(z0, top - 0.8)], [b[0], b[1], Math.max(z0, top - 0.8)], [b[0], b[1], top - 0.35], [a[0], a[1], top - 0.35])
        if (z0 < top) trim.quad([a[0], a[1], top - 0.35], [b[0], b[1], top - 0.35], [d[0], d[1], top], [c[0], c[1], top])
      })
      cap(roof, ins, top)
      // Pale infill panels under a dark glazed band, between broad precast
      // piers about 10 m apart (Highsmith's view of the convention wing).
      if (top > 10) for (const { a, b, L, z0 } of edges) {
        if (L < 7 || z0 > top * 0.5) continue
        const n = Math.max(1, Math.round((L - 2) / 10)), p = (L - 2) / n
        for (let k = 0; k < n; k++) {
          const s0 = 1 + k * p + 0.8, s1 = 1 + (k + 1) * p - 0.8
          panel(win, a, b, s0, s1, top * 0.6, top - 2.4, 0.05)
          if (z0 < top * 0.5) panel(trim, a, b, s0, s1, Math.max(z0, 0.4), top * 0.5, 0.05)
        }
      }
      continue
    }
    if (kind === 'atrium' && low !== undefined) {
      // Skillion: high along its north (+y) edge, falling to `low` at the south.
      const ys = r.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys)
      const zt = (p: XY) => low + ((p[1] - y0) / (y1 - y0)) * (top - low)
      for (const { a, b, z0 } of edges) {
        if (z0 >= Math.min(zt(a), zt(b))) continue
        mirror.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], zt(b)], [a[0], a[1], zt(a)])
      }
      const pts = r.map(p => [p[0], p[1], zt(p)] as V3)
      for (let i = 1; i < pts.length - 1; i++) glass.tri(pts[0], pts[i], pts[i + 1])
      continue
    }
    // Mirror-glass slab with a slim bright parapet.
    const ins = inset(r, 0.3)
    edges.forEach(({ a, b, z0 }, i) => {
      const c = ins[i], d = ins[(i + 1) % r.length]
      if (z0 < top - 0.5) mirror.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], top - 0.5], [a[0], a[1], top - 0.5])
      if (z0 < top) trim.quad([a[0], a[1], top - 0.5], [b[0], b[1], top - 0.5], [d[0], d[1], top], [c[0], c[1], top])
    })
    cap(kind === 'atrium' ? glass : roof, ins, top)
    // The mirror grid, drawn coarse: a pale line every three storeys and a
    // mullion every ~9.6 m on the long faces (the real grid is one storey).
    for (const { a, b, L, z0 } of edges) {
      if (L < 2.5 || z0 >= top - 4) continue
      for (let z = GRID; z < top - 4; z += GRID) if (z > z0) panel(trim, a, b, 0, L, z - 0.18, z + 0.18, 0.05)
      if (L < 12) continue
      const n = Math.round(L / GRID)
      for (let k = 1; k < n; k++) panel(trim, a, b, (k * L) / n - 0.15, (k * L) / n + 0.15, z0, top - 0.5, 0.05)
    }
    // Bright vertical mullions on the slab corners.
    for (let i = 0; i < r.length; i++) {
      if (Math.abs(turn(r, i)) < 40) continue
      const j = (i - 1 + r.length) % r.length
      for (const [{ a, b, L, z0 }, s] of [[edges[j], 1], [edges[i], 0]] as [typeof edges[0], number][]) {
        if (L < 1.2 || z0 >= top - 0.5) continue
        const w = 0.45
        panel(trim, a, b, s ? L - w : 0, s ? L : w, z0, top - 0.5, 0.06)
      }
    }
  }

  return [
    { part: mirror, material: windowVariant(2, 0xa9bfd1) },
    { part: trim, material: PALETTE.trim },
    { part: stone, material: finish('hyatt-precast', 0xe2d3bb) },
    { part: roof, material: PALETTE.roof },
    { part: glass, material: PALETTE.glass },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('dal-hyatt-regency', 'Hyatt Regency Dallas', ANCHOR, BEARING, build(), 6500)
