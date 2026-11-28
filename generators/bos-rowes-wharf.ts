/**
 * Rowes Wharf, Boston (Boston Harbor Hotel and Rowes Wharf): original
 * procedural geometry, CC0-1.0.
 * bun generators/bos-rowes-wharf.ts
 *
 * Skidmore, Owings & Merrill (Adrian Smith), 1987. A red-brick and cast-stone
 * harbourfront complex along Atlantic Avenue: a long brick block with a
 * 15-storey tower at each end, cut in the middle by a six-storey stone
 * arch over a public passage to the harbour, topped by a domed rotunda
 * (the observatory); and three seven-storey brick wings with hipped roofs
 * running out over the wharves, each ending in a round glass bay and
 * stepping down to the water.
 *
 * Frame: map frame, bearing 0 (x east, y north, z up), metres. Origin = the
 * anchor, the centroid of OSM outline way/29615909.
 *
 * Evidence
 * - OSM: the outline way/29615909 (hotel, brick, the main block and the
 *   south wing) and the two north wings way/240440938 and way/240440937
 *   (7 levels, brick), with their 60-odd building:parts (tower blocks of
 *   15-16 levels, the 9-10-level middle, the 11-level dome, the 7-level
 *   arch fronts, the wings' 7-level hipped parts way/240440944 "Central
 *   Wharf Building", way/240440945 "Rowes Wharf Condominiums" and
 *   way/240441120, their round bays and the 3-6-level steps at their
 *   ends). Every part of 12 m2 or more is drawn from its OSM plan; smaller
 *   corner pieces are left to their neighbours.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m grid; the
 *   median roof inside each part, above Atlantic Avenue (ground_min + 6.0;
 *   the wharf decks are 1 m lower, the water has no returns): towers 60.3,
 *   their round glass corners 65.7; the middle 38-41; the six-storey
 *   ranges 28-35; the rotunda 44-47; the arch fronts 32-35; the wings' eaves
 *   ~25.5 and ridges ~31; round bays 27.5; steps 21.6/18/14.4/10. Parts with
 *   too few lidar cells take 3.6 m a storey.
 * - Mapterhorn terrain: the land is 5.8-6.1 m above the harbour, and the
 *   wings stand over water, where the terrain is the water. The map puts
 *   y = 0 at the lowest ground under the footprint, the water, so the
 *   street is B = 4.9 m up (the land as the terrain check draws it) and every wall runs down to y = 0, as the
 *   wharf's face does. Elevation stays 0 (no deck is drawn under the
 *   wings to stand on).
 * - Commons photos, all EVIDENCE:
 *   - "2017 Rowes Wharf from Boston Harbor 1.jpg", Beyond My Ken,
 *     CC BY-SA 4.0: from the harbour (east); the arch, the rotunda's green
 *     dome, the end towers, both wings with their round glass bays;
 *     https://commons.wikimedia.org/wiki/File:2017_Rowes_Wharf_from_Boston_Harbor_1.jpg
 *   - "Rowes-Wharf-Boston-Harbor-Hotel-05-2018.jpg", Gunnar Klack,
 *     CC BY-SA 4.0: the arch from Atlantic Avenue (west), straight on; the
 *     stone block, the arch's proportions, the rotunda's glazed drum, the
 *     brick ranges either side with their stone bands;
 *     https://commons.wikimedia.org/wiki/File:Rowes-Wharf-Boston-Harbor-Hotel-05-2018.jpg
 *   - "Rowes Wharf & Boston Skyline (54960820583).jpg", ajay_suresh,
 *     CC BY 4.0: from Fan Pier (south-east); the wings stepping down, hipped
 *     roofs, the round bays.
 *     https://commons.wikimedia.org/wiki/File:Rowes_Wharf_%26_Boston_Skyline_(54960820583).jpg
 *
 * Measured from the harbour photo (Beyond My Ken), head-on, against the
 * stone block: the block is ~32.5 m wide (wider than OSM's 27-29 m stone
 * fronts; its height to the cornice, 35 m, is the top of the lidar's
 * 32-35 m) and the arch's clear opening is 60 % of it, 19.5 m, a true
 * semicircle springing at 9.75 m with its crown at 19.5 m; the coffered
 * ring is 2.4 m deep (drawn in the roof grey, as are the passage walls
 * and vault, so the opening reads dark as it does in shade), its top at 21.9 m, just under the attic windows
 * (24.5-32 m). The
 * brick ranges along Atlantic Avenue (OSM 6 levels) are drawn 34 m, as
 * the Atlantic Avenue photo shows nine storeys and the
 * lidar reads 32-35 m just inside their street face. Estimated: the link
 * between the main block and the south wing (inside the outline but in no
 * part; lidar 24 m); the windows (one panel per bay per two storeys),
 * the stone bands, the hipped roofs' pitch, the rotunda's drum and dome
 * (drum to 44, dome to 47.5, from the lidar).
 * Doubts: the small domed water-shuttle pavilion on the pier is a separate
 * building and is not drawn; the corner turret pieces under 12 m2 are
 * merged into their neighbours.
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const ANCHOR = { lng: -71.050285, lat: 42.356386 }
/** Atlantic Avenue above y = 0 (the water under the wings; see the header). */
const B = 4.9

type P2 = [number, number]
type Part0 = { id: string; top: number; kind: 'flat' | 'hip' | 'round'; poly: P2[] }

const REPLACES = ['way/240434366', 'way/240434367', 'way/240434368', 'way/240434369', 'way/240434370', 'way/240434371', 'way/240434372', 'way/240434373', 'way/240434374', 'way/240434375', 'way/240437771', 'way/240437772', 'way/240437773', 'way/240437774', 'way/240437775', 'way/240437776', 'way/240437777', 'way/240437778', 'way/240437779', 'way/240437780', 'way/240437781', 'way/240437782', 'way/240437783', 'way/240437784', 'way/240437785', 'way/240437786', 'way/240437787', 'way/240437788', 'way/240437789', 'way/240437790', 'way/240437791', 'way/240440937', 'way/240440938', 'way/240440941', 'way/240440942', 'way/240440943', 'way/240440944', 'way/240440945', 'way/240440946', 'way/240440947', 'way/240440948', 'way/240440949', 'way/240440950', 'way/240440951', 'way/240440952', 'way/240440953', 'way/240440954', 'way/240440955', 'way/240440956', 'way/240440957', 'way/240440958', 'way/240440959', 'way/240440960', 'way/240441119', 'way/240441120', 'way/240441121', 'way/240441122', 'way/240441123', 'way/240441124', 'way/240441125', 'way/240441126', 'way/240441127', 'way/240569376', 'way/240569377', 'way/240569378', 'way/240569379', 'way/29615909']

const PARTS: Part0[] = [
  { id: 'way/240434367', top: 60.3, kind: 'flat', poly: [[-8.3, 47.4], [-8.4, 50.3], [-8.7, 55.6], [-7.6, 56.2], [-6.1, 57.2], [-4.2, 57.7], [-1.8, 57.7], [0.2, 57.1], [1.4, 56.5], [2.8, 56.1], [3.0, 50.7], [3.2, 47.9], [6.9, 48.0], [6.8, 50.9], [10.6, 51.0], [9.6, 71.2], [9.1, 77.6], [-17.6, 70.6], [-15.7, 49.9], [-12.1, 50.1], [-12.0, 47.2]] }, // 15 lv, 578 m2
  { id: 'way/240437771', top: 40.8, kind: 'round', poly: [[-9.0, 2.1], [-7.7, 1.5], [-5.6, 0.9], [-2.8, 0.8], [-1.0, 1.0], [1.2, 1.6], [0.3, -10.6], [-1.3, -11.4], [-2.9, -11.8], [-4.7, -11.9], [-6.2, -11.9], [-9.2, -10.7], [-10.5, -9.6]] }, // 10 lv, 133 m2
  { id: 'way/240437772', top: 40.6, kind: 'round', poly: [[-8.4, 24.6], [-8.0, 36.4], [-6.8, 37.1], [-4.9, 37.9], [-3.4, 38.0], [-1.3, 38.0], [1.2, 37.1], [2.6, 36.2], [2.4, 24.3], [-0.1, 25.2], [-1.5, 25.5], [-3.7, 25.7], [-5.2, 25.5], [-6.5, 25.3]] }, // 10 lv, 132 m2
  { id: 'way/240437773', top: 60.3, kind: 'flat', poly: [[-0.7, -24.9], [-1.1, -27.7], [-1.8, -31.8], [-3.0, -31.6], [-4.1, -32.2], [-5.4, -32.5], [-7.6, -32.4], [-8.9, -32.0], [-10.7, -31.0], [-11.7, -30.2], [-13.0, -30.0], [-12.3, -25.8], [-11.9, -23.1], [-15.3, -22.6], [-15.7, -25.3], [-19.1, -24.8], [-24.1, -52.4], [0.1, -57.8], [5.8, -29.0], [2.3, -28.4], [2.8, -25.5]] }, // 15 lv, 682 m2
  { id: 'way/240437774', top: 57.6, kind: 'flat', poly: [[-3.0, -31.6], [-1.2, -19.2], [0.2, -19.4], [-0.2, -22.2], [-0.7, -24.9], [-1.1, -27.7], [-1.8, -31.8]] }, // 16 lv, 16 m2
  { id: 'way/240437775', top: 38.4, kind: 'flat', poly: [[3.6, -20.0], [0.2, -19.4], [-1.2, -19.2], [-2.9, -17.8], [-4.0, -17.4], [-5.3, -17.1], [-6.5, -17.0], [-8.7, -17.4], [-11.0, -17.6], [-14.5, -17.2], [-13.3, 5.5], [-11.8, 3.9], [-10.0, 2.6], [-10.5, -9.6], [-9.2, -10.7], [-7.4, -11.6], [-4.7, -11.9], [-2.9, -11.8], [-1.3, -11.4], [0.3, -10.6], [1.2, 1.6], [3.0, 2.5], [4.8, 3.7], [6.5, 5.5], [6.3, 3.8]] }, // 9 lv, 253 m2
  { id: 'way/240437776', top: 38.0, kind: 'flat', poly: [[-10.2, 23.7], [-11.7, 22.6], [-12.6, 21.7], [-11.8, 41.5], [-8.1, 41.7], [-6.1, 41.0], [-4.7, 40.3], [-3.1, 40.1], [-1.7, 40.3], [-0.1, 40.6], [1.3, 41.2], [2.6, 42.1], [7.1, 42.3], [7.7, 20.2], [7.7, 18.9], [6.4, 20.9], [5.0, 22.5], [3.7, 23.5], [2.4, 24.3], [2.6, 36.2], [1.2, 37.1], [-0.2, 37.7], [-3.4, 38.0], [-4.9, 37.9], [-6.8, 37.1], [-8.0, 36.4], [-8.4, 24.6]] }, // 9 lv, 210 m2
  { id: 'way/240437777', top: 34.0, kind: 'flat', poly: [[-21.6, -16.3], [-21.9, -19.0], [-22.2, -21.7], [-22.5, -24.3], [-22.7, -25.9], [-23.8, -33.9], [-25.0, -41.9], [-27.3, -54.7], [3.2, -62.0], [7.4, -40.9], [8.8, -32.9], [9.3, -29.6], [9.7, -26.8], [10.1, -23.9], [10.5, -21.0], [11.0, -16.9], [12.7, -0.9], [9.1, -0.6], [7.1, -20.5], [6.6, -23.3], [6.2, -26.2], [5.8, -29.0], [0.1, -57.8], [-24.1, -52.4], [-19.1, -24.8], [-18.8, -22.2], [-18.4, -19.5], [-18.0, -16.8], [-16.4, 1.4], [-20.0, 1.5], [-20.2, -1.8], [-20.9, -9.9]] }, // 6 lv, 488 m2
  { id: 'way/240437778', top: 34.0, kind: 'flat', poly: [[9.1, 77.6], [9.6, 71.2], [10.6, 51.0], [10.6, 48.2], [10.7, 45.3], [10.8, 42.5], [10.9, 28.3], [14.3, 28.3], [14.4, 31.4], [14.5, 39.5], [14.4, 42.6], [14.4, 45.5], [14.4, 48.4], [14.3, 51.2], [14.2, 55.6], [13.9, 63.7], [13.4, 71.7], [12.8, 79.0], [12.6, 81.4], [8.9, 80.4], [-17.8, 73.4], [-19.1, 73.1], [-20.0, 71.9], [-20.5, 70.8], [-19.9, 62.7], [-19.5, 54.7], [-19.3, 49.8], [-19.2, 46.9], [-19.2, 44.0], [-19.1, 41.2], [-19.0, 28.4], [-16.0, 28.4], [-15.5, 44.2], [-15.6, 47.1], [-15.7, 49.9], [-17.6, 70.6]] }, // 6 lv, 421 m2
  { id: 'way/240437788', top: 34.7, kind: 'flat', poly: [[-16.0, 28.4], [-16.1, 20.9], [-13.3, 20.9], [-11.8, 41.5], [-11.9, 44.4], [-15.5, 44.2]] }, // 8 lv, 79 m2
  { id: 'way/240437789', top: 38.0, kind: 'flat', poly: [[10.9, 28.3], [10.8, 42.5], [10.7, 45.3], [7.0, 45.2], [7.1, 42.3], [7.7, 20.2], [10.9, 20.2]] }, // 8 lv, 87 m2
  { id: 'way/240437790', top: 38.0, kind: 'flat', poly: [[3.2, -22.7], [6.6, -23.3], [7.1, -20.5], [9.1, -0.6], [9.4, 3.5], [6.3, 3.8], [3.6, -20.0]] }, // 8 lv, 89 m2
  { id: 'way/240437791', top: 34.7, kind: 'flat', poly: [[-14.5, -17.2], [-13.3, 5.5], [-16.1, 5.8], [-16.4, 1.4], [-18.0, -16.8], [-18.4, -19.5], [-15.0, -19.9]] }, // 8 lv, 81 m2
  { id: 'way/240440941', top: 27.4, kind: 'round', poly: [[69.1, 42.8], [69.1, 28.2], [72.9, 28.2], [76.8, 28.2], [80.6, 28.3], [80.6, 30.0], [81.5, 31.1], [82.2, 32.4], [82.6, 33.6], [82.8, 35.1], [82.8, 36.4], [82.6, 38.2], [81.9, 39.7], [80.6, 41.3], [80.6, 42.8], [76.7, 42.8], [72.9, 42.8]] }, // 0 lv, 185 m2
  { id: 'way/240440942', top: 27.5, kind: 'round', poly: [[86.3, 104.5], [90.1, 93.1], [93.4, 94.2], [96.7, 95.2], [100.0, 96.3], [100.3, 98.6], [100.6, 100.1], [100.2, 102.6], [99.5, 104.0], [98.8, 105.0], [96.6, 106.6], [92.9, 106.6], [89.6, 105.6]] }, // 0 lv, 140 m2
  { id: 'way/240440944', top: 27.5, kind: 'hip', poly: [[69.0, 46.1], [69.1, 42.8], [72.9, 42.8], [76.7, 42.8], [80.6, 42.8], [80.6, 41.3], [81.9, 39.7], [82.6, 38.2], [82.8, 36.4], [82.8, 35.1], [82.6, 33.6], [82.2, 32.4], [81.5, 31.1], [80.6, 30.0], [80.6, 28.3], [76.8, 28.2], [72.9, 28.2], [69.1, 28.2], [69.1, 24.6], [23.5, 24.4], [23.4, 46.0]] }, // 7 lv, 1169 m2
  { id: 'way/240440945', top: 27.4, kind: 'hip', poly: [[99.6, 97.3], [96.7, 95.2], [93.4, 94.2], [90.1, 93.1], [91.5, 88.7], [26.4, 67.4], [21.6, 81.7], [20.9, 83.8], [20.1, 86.4], [85.2, 107.7], [86.3, 104.5], [89.6, 105.6], [92.9, 106.6], [96.2, 107.7], [98.0, 105.9], [99.5, 104.0], [100.2, 102.6], [100.5, 101.3], [100.3, 98.6]] }, // 7 lv, 1513 m2
  { id: 'way/240440947', top: 10.3, kind: 'flat', poly: [[80.6, 28.3], [80.7, 24.6], [83.8, 24.7], [83.8, 28.3], [84.6, 29.8], [85.4, 31.3], [85.9, 33.6], [85.9, 35.9], [85.7, 38.5], [84.8, 40.7], [83.7, 42.8], [83.7, 46.2], [80.6, 46.2], [80.6, 42.8], [80.6, 41.3], [81.9, 39.7], [82.6, 38.2], [82.8, 36.4], [82.8, 35.1], [82.6, 33.6], [82.2, 32.4], [81.5, 31.1], [80.6, 30.0]] }, // 3 lv, 72 m2
  { id: 'way/240440948', top: 12.6, kind: 'flat', poly: [[100.0, 96.3], [101.4, 91.9], [104.2, 92.8], [102.9, 96.9], [103.2, 98.3], [103.5, 100.2], [103.2, 102.2], [102.7, 104.2], [101.7, 105.8], [100.5, 107.1], [99.1, 108.2], [97.9, 111.8], [95.2, 110.9], [96.2, 107.7], [98.0, 105.9], [99.5, 104.0], [100.2, 102.6], [100.5, 101.3], [100.3, 98.6]] }, // 3 lv, 60 m2
  { id: 'way/240440949', top: 21.6, kind: 'flat', poly: [[72.9, 42.8], [69.1, 42.8], [69.0, 46.1], [72.9, 46.1]] }, // 6 lv, 13 m2
  { id: 'way/240440951', top: 14.4, kind: 'flat', poly: [[98.1, 90.8], [101.4, 91.9], [100.0, 96.3], [96.7, 95.2]] }, // 4 lv, 16 m2
  { id: 'way/240440952', top: 18.0, kind: 'flat', poly: [[94.8, 89.8], [98.1, 90.8], [96.7, 95.2], [93.4, 94.2]] }, // 5 lv, 16 m2
  { id: 'way/240440953', top: 21.6, kind: 'flat', poly: [[69.1, 28.2], [72.9, 28.2], [73.0, 24.6], [69.1, 24.6]] }, // 6 lv, 14 m2
  { id: 'way/240440956', top: 18.0, kind: 'flat', poly: [[73.0, 24.6], [76.8, 24.6], [76.8, 28.2], [72.9, 28.2]] }, // 5 lv, 14 m2
  { id: 'way/240440957', top: 18.0, kind: 'flat', poly: [[72.9, 42.8], [76.7, 42.8], [76.7, 46.2], [72.9, 46.1]] }, // 5 lv, 13 m2
  { id: 'way/240440958', top: 21.6, kind: 'flat', poly: [[90.1, 93.1], [93.4, 94.2], [94.8, 89.8], [91.5, 88.7]] }, // 6 lv, 16 m2
  { id: 'way/240440959', top: 14.4, kind: 'flat', poly: [[76.8, 28.2], [80.6, 28.3], [80.7, 24.6], [76.8, 24.6]] }, // 4 lv, 14 m2
  { id: 'way/240440960', top: 14.4, kind: 'flat', poly: [[76.7, 42.8], [80.6, 42.8], [80.6, 46.2], [76.7, 46.2]] }, // 4 lv, 13 m2
  { id: 'way/240441119', top: 26.6, kind: 'round', poly: [[28.4, -46.7], [25.0, -63.0], [28.4, -63.7], [31.9, -64.5], [35.4, -65.2], [37.3, -62.3], [38.9, -58.8], [39.7, -55.2], [39.5, -51.4], [38.9, -48.9], [35.4, -48.2], [31.9, -47.5]] }, // 0 lv, 201 m2
  { id: 'way/240441120', top: 26.5, kind: 'hip', poly: [[38.9, -48.9], [35.4, -48.2], [31.9, -47.5], [28.4, -46.7], [29.1, -43.4], [17.3, -40.9], [16.8, -43.1], [12.4, -64.0], [24.2, -66.5], [25.0, -63.0], [28.4, -63.7], [31.9, -64.5], [35.4, -65.2], [37.3, -62.3], [38.9, -58.8], [39.7, -55.2], [39.5, -51.4]] }, // 7 lv, 487 m2
  { id: 'way/240441121', top: 21.6, kind: 'flat', poly: [[25.0, -63.0], [28.4, -63.7], [27.7, -67.3], [24.2, -66.5]] }, // 6 lv, 13 m2
  { id: 'way/240441122', top: 21.6, kind: 'flat', poly: [[28.4, -46.7], [31.9, -47.5], [32.6, -44.0], [29.1, -43.4]] }, // 6 lv, 12 m2
  { id: 'way/240441123', top: 18.0, kind: 'flat', poly: [[31.9, -64.5], [28.4, -63.7], [27.7, -67.3], [31.2, -68.0]] }, // 5 lv, 13 m2
  { id: 'way/240441124', top: 18.0, kind: 'flat', poly: [[31.9, -47.5], [35.4, -48.2], [36.1, -44.6], [32.6, -44.0]] }, // 5 lv, 13 m2
  { id: 'way/240441125', top: 14.4, kind: 'flat', poly: [[35.4, -48.2], [38.9, -48.9], [39.7, -45.3], [36.1, -44.6]] }, // 4 lv, 13 m2
  { id: 'way/240441126', top: 14.4, kind: 'flat', poly: [[31.9, -64.5], [31.2, -68.0], [33.3, -68.5], [35.4, -65.2]] }, // 4 lv, 13 m2
  { id: 'way/240441127', top: 9.5, kind: 'flat', poly: [[34.3, -68.7], [35.4, -65.2], [37.3, -62.3], [38.9, -58.8], [39.7, -55.2], [39.5, -51.4], [38.9, -48.9], [39.7, -45.3], [44.1, -46.1], [47.0, -46.6]] }, // 3 lv, 63 m2
  { id: 'way/240569376', top: 65.8, kind: 'round', poly: [[-1.2, -19.2], [-3.0, -31.6], [-4.1, -32.2], [-5.4, -32.5], [-7.6, -32.4], [-8.9, -32.0], [-10.7, -31.0], [-11.7, -30.2], [-9.8, -17.8], [-7.7, -17.1], [-5.3, -17.1], [-4.0, -17.4], [-2.9, -17.8]] }, // 16 lv, 128 m2
  { id: 'way/240569377', top: 65.7, kind: 'round', poly: [[2.0, 56.1], [2.6, 42.1], [1.3, 41.2], [-0.1, 40.6], [-1.7, 40.3], [-3.1, 40.1], [-4.7, 40.3], [-6.1, 41.0], [-7.5, 41.7], [-8.0, 55.6], [-6.9, 56.7], [-5.2, 57.5], [-3.1, 57.8], [-1.8, 57.7], [0.2, 57.1]] }, // 16 lv, 165 m2
  { id: 'way/240569378', top: 57.6, kind: 'flat', poly: [[-11.7, -30.2], [-13.0, -30.0], [-12.3, -25.8], [-11.9, -23.1], [-11.5, -20.4], [-11.0, -17.6], [-9.8, -17.8]] }, // 16 lv, 16 m2
]

const brick = new Part(), stone = new Part(), win = new Part(), roof = new Part(), dome = new Part(), bay = new Part()

const area2 = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
function earcut(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 4000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (area2(poly[a], poly[b], poly[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c &&
        area2(poly[a], poly[b], poly[j]) >= 0 && area2(poly[b], poly[c], poly[j]) >= 0 && area2(poly[c], poly[a], poly[j]) >= 0)) continue
      out.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1) // degenerate remainder: drop a point rather than loop
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function ccw(poly: P2[]): P2[] {
  let A = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; A += a[0] * b[1] - b[0] * a[1] }
  return A < 0 ? [...poly].reverse() : poly
}
function cap(p: Part, poly: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(poly)) {
    const A: V3 = [...poly[a], z], Bv: V3 = [...poly[b], z], C: V3 = [...poly[c], z]
    if (up) p.tri(A, Bv, C); else p.tri(A, C, Bv)
  }
}
function inside(p: P2, poly: P2[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
/** Push a closed anticlockwise polygon out by d (in for d < 0), mitred. */
function offset(poly: P2[], d: number): P2[] {
  const n = poly.length
  const nrm = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
  return poly.map((q, i) => {
    const p = poly[(i + n - 1) % n], r = poly[(i + 1) % n]
    const n1 = nrm([q[1] - p[1], p[0] - q[0]]), n2 = nrm([r[1] - q[1], q[0] - r[0]])
    const m = nrm([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.5, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k] as P2
  })
}
/** A quad turned so it faces `out`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.quad(a, b, c, d); else p.quad(a, d, c, b)
}

// ---------- the arch block and its rotunda (drawn by hand; the OSM parts there are skipped) ----------
const AX0 = -19.5, AX1 = 13.5, AY0 = -2.5, AY1 = 30, ATOP = 35
const PY0 = 4, PY1 = 23.5, SPRING = 9.75, PR = (PY1 - PY0) / 2, PC = (PY0 + PY1) / 2
const ROT_C: P2 = [-3.5, 13.5], ROT_R = 11, DRUM = 44, APEX = 47.5

type Vol = { poly: P2[]; top: number; kind: string; id: string }
const vols: Vol[] = PARTS.map((p) => ({ ...p, poly: ccw(p.poly) }))
// the link between the main block and the south wing: inside the outline but in no part (lidar 24 m)
vols.push({ id: 'link', poly: ccw([[3, -60], [13, -62], [13, -41], [5, -41]]), top: 24, kind: 'flat' })
vols.push({ id: 'arch', poly: ccw([[AX0, AY0], [AX1, AY0], [AX1, AY1], [AX0, AY1]]), top: ATOP, kind: 'arch' })

function neighbourTop(self: Vol, p: P2): number {
  let top = -1
  for (const v of vols) if (v !== self && inside(p, v.poly)) top = Math.max(top, v.top)
  return top
}
const Z = (h: number) => B + h // street-relative height → model z
const FLOOR = 3.6

for (const v of vols) {
  if (v.kind === 'arch') continue
  const P = v.poly
  const eave = v.kind === 'hip' ? v.top - 2.0 : v.top
  const wall = v.kind === 'round' ? bay : brick
  for (let k = 0; k < P.length; k++) {
    const a = P[k], b = P[(k + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    const segs = v.kind === 'round' ? 1 : Math.max(1, Math.round(L / FLOOR))
    for (let i = 0; i < segs; i++) {
      const A: P2 = [a[0] + t[0] * (L * i) / segs, a[1] + t[1] * (L * i) / segs]
      const Bp: P2 = [a[0] + t[0] * (L * (i + 1)) / segs, a[1] + t[1] * (L * (i + 1)) / segs]
      const m: P2 = [(A[0] + Bp[0]) / 2 + n[0] * 0.4, (A[1] + Bp[1]) / 2 + n[1] * 0.4]
      const nt = neighbourTop(v, m)
      // a wall shared with a round glass bay that lies inside this part is the bay's to draw (no coplanar twin)
      if (v.kind !== 'round') {
        const q: P2 = [(A[0] + Bp[0]) / 2 - n[0] * 0.4, (A[1] + Bp[1]) / 2 - n[1] * 0.4]
        if (vols.some((w) => w !== v && w.kind === 'round' && inside(q, w.poly))) continue
      }
      if (nt >= eave) continue
      const z0 = nt < 0 ? 0 : Z(nt), z1 = Z(eave)
      wall.quad([A[0], A[1], z0], [Bp[0], Bp[1], z0], [Bp[0], Bp[1], z1], [A[0], A[1], z1])
      const o = (p: P2, d: number): P2 => [p[0] + n[0] * d, p[1] + n[1] * d]
      const band = (p: Part, zb: number, zt: number, d: number, s0 = 0, s1 = 1) => {
        const P0 = o([A[0] + (Bp[0] - A[0]) * s0, A[1] + (Bp[1] - A[1]) * s0], d), P1 = o([A[0] + (Bp[0] - A[0]) * s1, A[1] + (Bp[1] - A[1]) * s1], d)
        p.quad([P0[0], P0[1], zb], [P1[0], P1[1], zb], [P1[0], P1[1], zt], [P0[0], P0[1], zt])
      }
      if (v.kind === 'round') {
        // white frames every two storeys on the glass bays
        for (let h = 3 * FLOOR; h < eave - 2; h += 3 * FLOOR) if (Z(h) > z0 + 0.5) band(stone, Z(h) - 0.3, Z(h) + 0.3, 0.1)
        band(stone, z1 - 0.8, z1, 0.12)
        continue
      }
      // stone cornice at the eave and a stone band over the ground floor, one run per wall
      if (i === 0) {
        const nm = neighbourTop(v, [(a[0] + b[0]) / 2 + n[0] * 0.4, (a[1] + b[1]) / 2 + n[1] * 0.4])
        if (nm < eave) {
          const P0 = o(a, 0.18), P1 = o(b, 0.18)
          stone.quad([P0[0], P0[1], z1 - 1.0], [P1[0], P1[1], z1 - 1.0], [P1[0], P1[1], z1], [P0[0], P0[1], z1])
          if (nm < 0) {
            stone.quad([P0[0], P0[1], Z(FLOOR * 2) - 0.5], [P1[0], P1[1], Z(FLOOR * 2) - 0.5], [P1[0], P1[1], Z(FLOOR * 2) + 0.3], [P0[0], P0[1], Z(FLOOR * 2) + 0.3])
            if (L > 3) { const W0 = o(a, 0.06), W1 = o(b, 0.06); win.quad([W0[0], W0[1], Z(0.4)], [W1[0], W1[1], Z(0.4)], [W1[0], W1[1], Z(FLOOR * 2 - 1.0)], [W0[0], W0[1], Z(FLOOR * 2 - 1.0)]) }
          }
        }
      }
      // windows: a panel per bay per two storeys; shopfronts on the street
      const first = nt < 0 ? FLOOR * 2 : nt
      if (L / segs < 3) continue
      for (let h = first + 0.9; h + 2 * FLOOR - 1.2 <= eave - 1.0; h += 2 * FLOOR) band(win, Z(h), Z(h + 2 * FLOOR - 1.6), 0.06, 0.24, 0.76)
    }
  }
  if (v.kind === 'hip') {
    // hipped roof: the eave ring rises to an inset ridge ring
    const inner = offset(P, -5)
    for (let k = 0; k < P.length; k++) {
      const a = P[k], b = P[(k + 1) % P.length], c = inner[(k + 1) % P.length], d = inner[k]
      roof.quad([a[0], a[1], Z(eave)], [b[0], b[1], Z(eave)], [c[0], c[1], Z(v.top + 1.5)], [d[0], d[1], Z(v.top + 1.5)])
    }
    cap(roof, inner, Z(v.top + 1.5))
  } else cap(roof, P, Z(v.top))
}

// --- the arch block: piers, the spandrel over the arch, the passage and its vault ---
{
  const N = 10
  const arc = (i: number): [number, number] => {
    const a = Math.PI - (Math.PI * i) / N // from the south springing over to the north
    return [PC + PR * Math.cos(a), SPRING + PR * Math.sin(a)]
  }
  for (const [x, s] of [[AX0, -1], [AX1, 1]] as [number, number][]) {
    const out: V3 = [s, 0, 0]
    face(stone, [x, AY0, 0], [x, PY0, 0], [x, PY0, Z(ATOP)], [x, AY0, Z(ATOP)], out)
    face(stone, [x, PY1, 0], [x, AY1, 0], [x, AY1, Z(ATOP)], [x, PY1, Z(ATOP)], out)
    for (let i = 0; i < N; i++) {
      const [y0, z0] = arc(i), [y1, z1] = arc(i + 1)
      face(stone, [x, y0, Z(z0)], [x, y1, Z(z1)], [x, y1, Z(ATOP)], [x, y0, Z(ATOP)], out)
      // the arch ring, standing proud of the face
      const R2 = PR + 2.4, d = s * 0.35
      const a0 = Math.PI - (Math.PI * i) / N, a1 = Math.PI - (Math.PI * (i + 1)) / N
      const p = (r: number, a: number): V3 => [x + d, PC + r * Math.cos(a), Z(SPRING + r * Math.sin(a))]
      face(roof, p(PR, a0), p(PR, a1), p(R2, a1), p(R2, a0), out) // the coffered ring reads darker than the stone
      face(stone, [x, PC + PR * Math.cos(a0), Z(SPRING + PR * Math.sin(a0))], [x, PC + PR * Math.cos(a1), Z(SPRING + PR * Math.sin(a1))], p(PR, a1), p(PR, a0), [0, -Math.cos((a0 + a1) / 2), -Math.sin((a0 + a1) / 2)])
    }
    // windows: a row of tall windows under the cornice, small ones up the piers
    const wy = (y0: number, y1: number, z0: number, z1: number) => face(win, [x + s * 0.06, y0, Z(z0)], [x + s * 0.06, y1, Z(z0)], [x + s * 0.06, y1, Z(z1)], [x + s * 0.06, y0, Z(z1)], out)
    for (let j = 0; j < 6; j++) { const y = AY0 + 3 + ((AY1 - AY0 - 6) * (j + 0.5)) / 6; wy(y - 1.2, y + 1.2, 24.5, 32.0) }
    for (const yc of [(AY0 + PY0) / 2, (PY1 + AY1) / 2]) for (let h = 3; h < 21; h += 3.6) wy(yc - 0.8, yc + 0.8, h, h + 1.8)
    // cornice
    face(stone, [x + s * 0.4, AY0, Z(ATOP - 1.2)], [x + s * 0.4, AY1, Z(ATOP - 1.2)], [x + s * 0.4, AY1, Z(ATOP)], [x + s * 0.4, AY0, Z(ATOP)], out)
    face(stone, [x, AY0, Z(ATOP)], [x, AY1, Z(ATOP)], [x + s * 0.4, AY1, Z(ATOP)], [x + s * 0.4, AY0, Z(ATOP)], [0, 0, 1])
  }
  // passage walls and the barrel vault
  // the passage in shade: its walls and coffered vault in the darker grey
  face(roof, [AX0, PY0, 0], [AX1, PY0, 0], [AX1, PY0, Z(SPRING)], [AX0, PY0, Z(SPRING)], [0, 1, 0])
  face(roof, [AX0, PY1, 0], [AX1, PY1, 0], [AX1, PY1, Z(SPRING)], [AX0, PY1, Z(SPRING)], [0, -1, 0])
  for (let i = 0; i < N; i++) {
    const [y0, z0] = arc(i), [y1, z1] = arc(i + 1)
    const my = (y0 + y1) / 2 - PC, mz = (z0 + z1) / 2 - SPRING
    face(roof, [AX0, y0, Z(z0)], [AX1, y0, Z(z0)], [AX1, y1, Z(z1)], [AX0, y1, Z(z1)], [0, -my, -mz])
  }
  // the block's own north and south walls where nothing stands against them, and its roof
  const self = vols[vols.length - 1]
  for (const [y, s] of [[AY0, -1], [AY1, 1]] as [number, number][]) {
    for (let x = AX0; x < AX1 - 0.01; x += 3.3) {
      const x1 = Math.min(AX1, x + 3.3), nt = neighbourTop(self, [(x + x1) / 2, y + s * 0.4])
      if (nt >= ATOP) continue
      face(stone, [x, y, nt < 0 ? 0 : Z(nt)], [x1, y, nt < 0 ? 0 : Z(nt)], [x1, y, Z(ATOP)], [x, y, Z(ATOP)], [0, s, 0])
    }
  }
  cap(roof, ccw([[AX0, AY0], [AX1, AY0], [AX1, AY1], [AX0, AY1]]), Z(ATOP))
}

// --- the rotunda: a glazed stone drum and a green dome with a small lantern ---
{
  const S = 16
  const pt = (r: number, i: number, z: number): V3 => [ROT_C[0] + r * Math.cos((2 * Math.PI * i) / S), ROT_C[1] + r * Math.sin((2 * Math.PI * i) / S), z]
  for (let i = 0; i < S; i++) {
    const out: V3 = [Math.cos((2 * Math.PI * (i + 0.5)) / S), Math.sin((2 * Math.PI * (i + 0.5)) / S), 0]
    face(stone, pt(ROT_R, i, Z(ATOP)), pt(ROT_R, i + 1, Z(ATOP)), pt(ROT_R, i + 1, Z(DRUM)), pt(ROT_R, i, Z(DRUM)), out)
    // a tall window in each face of the drum
    const r = ROT_R + 0.06, a0 = (2 * Math.PI * (i + 0.2)) / S, a1 = (2 * Math.PI * (i + 0.8)) / S
    const w = (a: number, z: number): V3 => [ROT_C[0] + r * Math.cos(a), ROT_C[1] + r * Math.sin(a), z]
    face(win, w(a0, Z(ATOP + 3.5)), w(a1, Z(ATOP + 3.5)), w(a1, Z(DRUM - 1.8)), w(a0, Z(DRUM - 1.8)), out)
    // the dome: three rings up to the lantern
    const ring = (j: number) => { const e = (Math.PI / 2) * (j / 3) * 0.9; return [ROT_R * Math.cos(e), Z(DRUM) + (APEX - 1.5 - DRUM) * Math.sin(e) / Math.sin(Math.PI / 2 * 0.9)] }
    for (let j = 0; j < 3; j++) {
      const [r0, z0] = ring(j), [r1, z1] = ring(j + 1)
      face(dome, pt(r0, i, z0), pt(r0, i + 1, z0), pt(r1, i + 1, z1), pt(r1, i, z1), [out[0], out[1], 0.6])
    }
    const [rt, zt] = ring(3)
    dome.tri(pt(rt, i, zt), pt(rt, i + 1, zt), [ROT_C[0], ROT_C[1], zt])
    // lantern
    const l = (i2: number, z: number): V3 => pt(1.6, i2, z)
    if (i % 2 === 0) face(stone, l(i, zt), l(i + 2, zt), l(i + 2, Z(APEX)), l(i, Z(APEX)), out)
  }
  for (let i = 0; i < S; i += 2) dome.tri(pt(1.6, i, Z(APEX)), pt(1.6, i + 2, Z(APEX)), [ROT_C[0], ROT_C[1], Z(APEX + 0.6)])
}

const ARCH = (p: V3) => p[0] > AX0 - 2 && p[0] < AX1 + 2 && p[1] > AY0 - 1 && p[1] < AY1 + 1
const parts = [
  { part: brick, material: finish('rowes-brick', 0xb98370) },
  { part: stone, material: { ...finish('cast-stone', 0xe3cfac), floodlight: (p: V3) => (ARCH(p) ? 1 : 0) } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: dome, material: { ...PALETTE.copper, floodlight: () => 0.7 } },
  { part: bay, material: windowVariant(2, 0xc3d1da) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map((p) => p.material.name + ':' + p.part.triangles).join(' '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Rowes Wharf', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: B + APEX + 0.6,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-rowes-wharf.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
