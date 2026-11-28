/**
 * Namba Parks (なんばパークス) and Parks Tower, Naniwa, Osaka: procedural, CC0-1.0.
 * bun generators/osaka-namba-parks.ts
 *
 * Map frame: x east, y north, z up, metres, origin on the ground at the
 * centroid of OSM way/451572345 (Namba Parks' outline); bearing 0, every
 * part drawn at its own OSM coordinates.
 *
 * The 2003-07 shopping complex by Jon Jerde over the old Osaka Stadium site:
 * a canyon of curving, striated earth-toned terraces whose roofs are the
 * Parks Garden, stepping down from the north end by Parks Tower (2F to 9F)
 * along a winding open-air valley, with the 30-storey Parks Tower at the
 * north-west corner.
 *
 * OSM: the outline way/451572345 (10 levels) is tiled by 39 building:parts
 * tagged 1 to 10 levels (way/461204705 ... way/612107035); every part is
 * extruded to its own level count, so the terraces step as OSM maps them.
 * The 1-level part way/612107035 is the storey under the canyon floor (the
 * valley walk is at 2F, as the Nankai 2F link shows); its top is drawn as
 * paving. Parks Tower is its own building, way/146693120 (30 levels,
 * height 149, start 2003), sharing its east wall with the outline; the brief
 * asked for it to be included where OSM ties it to the complex, and it is
 * the complex's office tower (en.wikipedia "Parks Tower (Namba Parks)"), so
 * it is modelled and replaced. The Namba Parks residential tower to the
 * south (way/178424064) is a separate building and is left to the map.
 *
 * Heights: 4.5 m a level (estimated: Parks Tower's published 149 m over 30
 * floors is 5.0 m a floor with its lobby; retail floors are lower); a level
 * count of 9.5 is 42.75 m. Rings simplified to 0.8 m.
 *
 * From photos (lead review round 1 applied: warmer strata, planting,
 * only the real rooftop structures, a glass tower with fins):
 * - the terrace walls a warm sandstone in horizontal strata, two tones
 *   (663highland's aerials and Wpcpey's canyon overview, sunlit #d8bf96 and
 *   #c09a68), drawn as alternating bands a level (4.5 m) tall, broad enough
 *   to read as strata rather than pinstripes; walls hidden against a
 *   neighbouring part are not drawn;
 * - every terrace top a garden (#8fa364), a low sandstone parapet on its
 *   open edges, and along those edges alternating trees (dark canopies 6 m
 *   across, #5e7a45) and shrubs (light, 3.6 m), one every 7.5 m, inset from
 *   the edge (simple squat canopies; the real planting is denser);
 * - the round glass lift towers (the three small 9-10 level parts) as glass
 *   cylinders; the one beside OSM's canopy part (way/461925114) carries the
 *   white saucer, about 18 m across (663highland, "02s5");
 * - the big round south block (way/461925112): a turf top with an oval
 *   amphitheatre of four steps (size estimated);
 * - glazed shop fronts along the walls at the canyon floor; the 1-level
 *   canyon floor paved in the light sandstone;
 * - Parks Tower: dark charcoal-blue glass (#2c3646-#3a4659 in sun, drawn
 *   #48576c, near STYLE.md's floor) with slim silver vertical fins every
 *   ~7 m (#b3bbc3), a frame line over the lobby, a dark roof.
 *
 * Estimated: the level height, the band height, the parapets, the shop
 * glazing, the planting's spacing and size, the saucer and the amphitheatre,
 * the fins' spacing. Left out: the canyon's bridges, the stairs.
 * Doubts: OSM's level counts are taken as they are.
 *
 * Night: the shop glazing and the tower glow (window-2).
 *
 * Photos (Wikimedia Commons):
 * - "150328 Namba Parks Osaka Japan01bs3.jpg", 663highland, CC BY 2.5 (aerial from the north: terraces, tower)
 * - "150328 Namba Parks Osaka Japan02s5.jpg", 663highland, CC BY 2.5 (aerial: canyon, strata, gardens)
 * - "150328 Namba Parks Osaka Japan03bs3.jpg", 663highland, CC BY 2.5 (aerial, wide)
 * - "150328 Namba Parks Osaka Japan04s3.jpg", 663highland, CC BY 2.5 (Parks Tower)
 * - "NAMBA PARKS Overview 201306.jpg", Wpcpey, CC BY-SA 4.0 (canyon walls, colours)
 * - "Namba Parks.jpg", BradBeattie, CC BY-SA 3.0 (canyon floor, strata)
 * - "Parks Tower (Namba Parks) 20100418-001.jpg", J o, CC BY-SA 3.0 (tower, north front)
 * Look-only: none.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { walls, cap, area, type XY } from './chi-aon-center'

const PARTS: Array<{ id: string; levels: number; kind: string; ring: XY[] }> = [
  { id: "way/461204705", levels: 2, kind: "yes", ring: [[-8.1, 122.0], [-5.2, 105.9], [-11.7, 106.8], [-12.0, 105.0], [-6.6, 101.5], [-5.2, 95.6], [-5.7, 91.9], [-6.2, 90.4], [-9.8, 91.5], [-13.4, 87.3], [-18.1, 86.7], [-20.0, 83.4], [-23.3, 86.9], [-24.9, 91.2], [-24.3, 105.4], [-30.4, 121.5], [-30.8, 126.7], [-29.3, 133.8], [-19.9, 133.1], [-15.8, 136.2], [-8.8, 126.2]] },
  { id: "way/461376382", levels: 2, kind: "yes", ring: [[-49.6, 68.9], [-38.4, 78.0], [-32.7, 78.7], [-25.8, 76.3], [-20.5, 72.8], [-32.9, 74.0], [-38.8, 72.7], [-43.3, 70.4], [-48.7, 65.1]] },
  { id: "way/461376383", levels: 3, kind: "yes", ring: [[-9.0, 73.7], [-20.0, 83.4], [-18.1, 86.7], [-13.4, 87.3], [-9.8, 91.5], [-6.2, 90.4], [-5.7, 91.9], [-5.2, 95.6], [-6.6, 101.5], [-12.0, 105.0], [-11.7, 106.8], [-5.2, 105.9], [-8.8, 126.2], [-5.6, 121.3], [-2.1, 106.1], [1.5, 97.2], [13.4, 79.5], [5.2, 76.1], [5.1, 74.1], [-1.9, 75.9]] },
  { id: "way/461376384", levels: 3, kind: "yes", ring: [[-48.7, 65.1], [-43.3, 70.4], [-32.9, 74.0], [-20.5, 72.8], [-15.1, 67.9], [-12.9, 63.7], [-25.7, 66.6], [-33.3, 66.7], [-40.2, 64.8], [-46.7, 61.1]] },
  { id: "way/461376385", levels: 3, kind: "yes", ring: [[-12.9, 63.7], [-15.1, 67.9], [-6.0, 68.6], [-4.1, 63.9]] },
  { id: "way/461376386", levels: 4, kind: "yes", ring: [[-3.5, 52.4], [-4.1, 63.9], [-9.0, 73.7], [-1.9, 75.9], [5.1, 74.1], [5.2, 76.1], [21.1, 84.3], [29.8, 68.5], [12.7, 57.5], [10.6, 62.0], [6.4, 63.3], [4.2, 62.0], [0.7, 54.3]] },
  { id: "way/461376387", levels: 4, kind: "yes", ring: [[-46.7, 61.1], [-40.2, 64.8], [-33.3, 66.7], [-19.2, 65.6], [-12.9, 63.7], [-11.3, 58.4], [-11.6, 53.5], [-18.2, 59.4], [-24.8, 61.3], [-38.0, 59.1], [-43.9, 55.7]] },
  { id: "way/461376388", levels: 4, kind: "yes", ring: [[-11.6, 53.5], [-11.3, 58.4], [-3.2, 56.7], [-3.5, 52.4]] },
  { id: "way/461376390", levels: 5, kind: "yes", ring: [[-3.5, 52.4], [0.7, 54.3], [4.2, 62.0], [6.4, 63.3], [10.6, 62.0], [12.7, 57.5], [29.8, 68.5], [38.2, 54.1], [28.6, 55.3], [28.4, 56.9], [25.8, 59.0], [22.8, 58.2], [21.9, 54.6], [18.8, 50.3], [16.6, 50.9], [15.3, 46.7], [19.3, 43.2], [19.9, 34.7], [17.4, 35.6], [12.9, 32.8], [7.3, 34.3], [5.6, 37.7], [6.0, 39.8], [4.1, 40.6], [-0.9, 41.5], [-6.6, 40.8]] },
  { id: "way/461376391", levels: 5, kind: "yes", ring: [[-38.5, 43.4], [-43.9, 55.7], [-38.0, 59.1], [-24.8, 61.3], [-18.2, 59.4], [-11.6, 53.5], [-15.0, 41.6], [-20.9, 45.4], [-25.3, 46.4], [-34.3, 45.7]] },
  { id: "way/461376392", levels: 5, kind: "yes", ring: [[-15.0, 41.6], [-13.2, 46.9], [-5.1, 47.5], [-6.4, 42.3]] },
  { id: "way/461414175", levels: 6, kind: "yes", ring: [[-13.7, 4.9], [-19.8, 10.6], [-21.3, 15.1], [-20.4, 21.6], [-28.6, 24.8], [-37.0, 25.5], [-38.5, 43.4], [-34.3, 45.7], [-25.3, 46.4], [-20.9, 45.4], [-15.0, 41.6], [-16.4, 29.3], [-11.1, 17.1], [-5.8, 8.5], [-10.8, 7.2]] },
  { id: "way/461414176", levels: 6, kind: "yes", ring: [[-14.9, 25.4], [-16.4, 29.3], [-11.8, 30.4], [-6.4, 30.9], [-3.2, 27.3]] },
  { id: "way/461414177", levels: 6, kind: "yes", ring: [[6.7, 3.8], [2.6, 7.4], [3.5, 13.7], [2.3, 19.5], [-6.4, 30.9], [-6.6, 40.8], [-0.9, 41.5], [6.0, 39.8], [6.1, 35.7], [9.1, 33.2], [14.8, 33.2], [17.4, 35.6], [19.9, 34.7], [19.3, 43.2], [15.3, 46.7], [16.6, 50.9], [18.8, 50.3], [21.9, 54.6], [22.8, 58.2], [25.8, 59.0], [28.4, 56.9], [28.6, 55.3], [38.2, 54.1], [46.6, 36.3], [38.8, 40.2], [37.4, 44.5], [37.7, 49.6], [27.9, 51.2], [25.4, 50.2], [22.0, 42.9], [21.7, 33.7], [18.3, 30.0], [21.2, 24.2], [16.4, 18.3], [16.1, 12.6], [17.9, 8.5], [14.2, 6.1], [7.2, 8.0]] },
  { id: "way/461414178", levels: 7, kind: "yes", ring: [[1.3, -88.6], [-1.9, -90.2], [2.7, -77.0], [-0.4, -65.8], [1.2, -65.4], [-1.3, -59.8], [0.4, -40.6], [-1.1, -23.7], [-0.2, -18.1], [-1.7, -11.8], [6.7, -10.6], [6.6, -2.6], [8.2, 0.5], [6.7, 3.8], [7.2, 8.0], [14.2, 6.1], [17.9, 8.5], [16.1, 12.6], [16.4, 18.3], [21.2, 24.2], [18.3, 30.0], [21.7, 33.7], [22.0, 42.9], [25.4, 50.2], [27.9, 51.2], [37.7, 49.6], [37.8, 42.4], [36.1, 44.4], [31.4, 46.1], [27.2, 44.4], [26.7, 35.2], [23.6, 28.9], [25.5, 22.4], [30.3, 21.6], [34.0, 16.1], [33.6, 11.2], [32.1, 9.0], [26.5, 7.1], [28.0, -2.9], [29.5, -4.7], [26.0, -9.4], [24.4, -14.6], [22.9, -14.4], [21.9, -19.4], [19.6, -23.3], [15.7, -27.0], [14.2, -24.6], [2.9, -26.3], [4.8, -38.3], [0.9, -56.4], [5.7, -67.7], [7.7, -66.9], [9.0, -73.0], [5.7, -83.4]] },
  { id: "way/461504576", levels: 6, kind: "yes", ring: [[0.5, -76.2], [-4.3, -61.3], [-4.6, -55.8], [-0.4, -35.8], [0.4, -40.6], [-1.3, -59.8], [1.2, -65.4], [-0.4, -65.8], [2.7, -77.0], [1.4, -82.0]] },
  { id: "way/461504577", levels: 7, kind: "yes", ring: [[-24.1, -69.1], [-22.7, -62.7], [-16.4, -51.3], [-16.3, -47.0], [-23.0, -45.2], [-25.6, -41.9], [-28.4, -43.4], [-29.9, -40.6], [-28.8, -33.6], [-26.7, -29.4], [-27.5, -29.0], [-23.0, -20.6], [-26.8, -13.3], [-27.3, -8.9], [-26.8, -0.0], [-23.7, 5.2], [-26.2, 10.7], [-26.3, 15.4], [-28.5, 15.7], [-28.3, 18.8], [-37.0, 19.6], [-37.0, 25.5], [-28.6, 24.8], [-20.4, 21.6], [-21.3, 15.1], [-19.8, 10.6], [-13.7, 4.9], [-15.8, 2.1], [-16.5, -1.7], [-12.9, -8.9], [-9.8, -10.5], [-9.4, -17.3], [-12.6, -32.8], [-11.4, -51.8], [-12.8, -57.2], [-17.5, -63.0], [-15.8, -66.6], [-18.6, -66.6], [-20.8, -69.8]] },
  { id: "way/461504578", levels: 6, kind: "yes", ring: [[-11.4, -51.8], [-12.6, -32.8], [-9.4, -17.3]] },
  { id: "way/461504579", levels: 7, kind: "yes", ring: [[-9.4, -17.3], [-9.8, -10.5], [-1.7, -11.8], [-0.2, -18.1], [-3.1, -16.8]] },
  { id: "way/461504580", levels: 8, kind: "yes", ring: [[-1.9, -90.2], [3.8, -86.4], [7.6, -79.5], [9.0, -73.0], [7.7, -66.9], [5.7, -67.7], [0.9, -56.4], [4.8, -38.3], [2.9, -26.3], [14.2, -24.6], [15.7, -27.0], [21.9, -19.4], [22.9, -14.4], [24.4, -14.6], [24.5, -29.4], [29.2, -37.5], [28.7, -42.2], [25.2, -41.8], [23.1, -38.1], [13.6, -40.8], [13.1, -48.7], [8.8, -52.9], [9.1, -56.7], [15.0, -61.1], [21.6, -61.0], [24.0, -59.7], [24.5, -61.6], [28.9, -62.2], [25.2, -104.0], [11.5, -102.9], [-5.8, -103.9], [-5.5, -97.2]] },
  { id: "way/461925097", levels: 10, kind: "yes", ring: [[1.5, -11.6], [1.2, -2.6], [6.6, -2.6], [6.7, -10.6]] },
  { id: "way/461925098", levels: 8, kind: "yes", ring: [[-10.2, -90.0], [-8.5, -87.3], [-1.6, -87.5], [-1.9, -90.2]] },
  { id: "way/461925100", levels: 9, kind: "yes", ring: [[-5.5, -97.2], [-11.6, -97.9], [-15.8, -96.9], [-10.2, -90.0], [-1.9, -90.2]] },
  { id: "way/461925101", levels: 8, kind: "yes", ring: [[-15.8, -96.9], [-28.1, -92.3], [-41.0, -89.7], [-35.3, -40.1], [-40.9, -39.5], [-41.2, -42.8], [-50.3, -40.4], [-48.6, -35.5], [-33.2, -38.8], [-27.5, -29.0], [-26.7, -29.4], [-29.8, -37.4], [-29.9, -40.6], [-28.4, -43.4], [-25.6, -41.9], [-23.0, -45.2], [-16.3, -47.0], [-16.4, -51.3], [-22.7, -62.7], [-24.1, -69.1], [-20.8, -69.8], [-18.6, -66.6], [-15.8, -66.6], [-12.6, -68.2], [-8.7, -75.1], [-8.0, -82.4], [-11.3, -87.6], [-14.6, -87.0], [-17.6, -83.8], [-19.9, -85.4], [-13.8, -89.8], [-10.2, -90.0]] },
  { id: "way/461925102", levels: 9.5, kind: "yes", ring: [[25.2, -41.8], [22.0, -41.4], [20.2, -45.9], [24.0, -59.7], [18.8, -61.4], [11.5, -59.4], [9.1, -56.7], [8.8, -52.9], [13.1, -48.7], [13.6, -40.8], [23.1, -38.1]] },
  { id: "way/461925103", levels: 9.5, kind: "yes", ring: [[28.9, -62.2], [24.5, -61.6], [20.2, -45.9], [22.0, -41.4], [44.0, -43.8], [42.8, -56.3], [29.7, -55.0]] },
  { id: "way/461925104", levels: 8, kind: "yes", ring: [[42.8, -56.3], [44.0, -43.8], [28.7, -42.2], [29.2, -37.5], [35.1, -38.7], [38.5, -37.3], [41.7, -33.7], [44.8, -28.1], [46.1, -13.8], [55.0, -14.5], [50.8, -57.1]] },
  { id: "way/461925105", levels: 8, kind: "yes", ring: [[46.1, -13.8], [44.9, -9.5], [48.7, -9.9], [49.8, 2.9], [36.5, 4.4], [35.9, -1.0], [33.7, -1.3], [29.5, -4.7], [28.0, -2.9], [26.5, 7.1], [32.1, 9.0], [33.6, 11.2], [34.0, 16.1], [30.3, 21.6], [25.5, 22.4], [23.6, 28.9], [37.3, 27.4], [38.3, 35.9], [35.6, 39.6], [38.8, 40.2], [46.6, 36.3], [51.8, 23.6], [61.4, -12.1], [66.0, -39.0], [65.8, -58.6], [50.8, -57.1], [55.0, -14.5]] },
  { id: "way/461925106", levels: 9, kind: "yes", ring: [[37.3, 27.4], [26.9, 28.5], [29.1, 34.3], [29.2, 40.4], [35.6, 39.6], [38.3, 35.9]] },
  { id: "way/461925107", levels: 8, kind: "yes", ring: [[26.9, 28.5], [23.6, 28.9], [26.7, 35.2], [27.2, 44.4], [31.4, 46.1], [34.1, 45.4], [36.1, 44.4], [38.8, 40.2], [29.2, 40.4], [29.1, 34.3]] },
  { id: "way/461925108", levels: 8, kind: "yes", ring: [[-33.2, -38.8], [-48.6, -35.5], [-58.3, -28.4], [-66.9, -17.9], [-70.9, -17.8], [-70.9, -8.5], [-74.6, -7.3], [-75.4, -2.7], [-73.8, -0.7], [-75.5, 7.7], [-70.9, 7.5], [-70.7, 12.0], [-38.0, 9.3], [-37.0, 19.6], [-28.3, 18.8], [-28.5, 15.7], [-26.3, 15.4], [-26.2, 10.7], [-23.7, 5.2], [-26.8, -0.0], [-26.8, -13.3], [-23.0, -20.6]] },
  { id: "way/461925109", levels: 10, kind: "yes", ring: [[-41.7, -48.4], [-40.9, -39.5], [-35.3, -40.1], [-36.3, -48.9]] },
  { id: "way/461925110", levels: 8, kind: "yes", ring: [[30.9, -38.5], [26.4, -33.8], [24.5, -29.4], [23.7, -19.5], [26.0, -9.4], [31.6, -2.6], [35.9, -1.0], [35.1, -8.6], [44.9, -9.5], [46.2, -21.2], [44.8, -28.1], [41.7, -33.7], [38.5, -37.3], [35.1, -38.7]] },
  { id: "way/461925111", levels: 10, kind: "yes", ring: [[35.1, -8.6], [36.5, 4.4], [49.8, 2.9], [48.7, -9.9]] },
  { id: "way/461925112", levels: 10, kind: "commercial", ring: [[28.9, -62.2], [29.7, -55.0], [65.8, -58.6], [60.0, -107.5], [25.2, -104.0]] },
  { id: "way/461925113", levels: 10, kind: "yes", ring: [[-15.8, -96.9], [-19.0, -105.3], [-38.4, -105.2], [-38.2, -101.5], [-42.0, -101.1], [-41.0, -89.7], [-28.1, -92.3]] },
  { id: "way/461925114", levels: 10, kind: "roof", ring: [[2.7, -11.5], [-0.7, -11.1], [-5.6, -6.5], [-5.7, -3.3], [-4.1, -0.9], [2.0, 1.5], [7.6, -0.4], [10.6, -4.9], [10.5, -7.6], [8.6, -9.7]] },
  { id: "way/612107029", levels: 2, kind: "yes", ring: [[-17.6, -83.8], [-19.9, -85.4], [-13.8, -89.8], [-10.2, -90.0], [-8.5, -87.3], [-9.0, -85.4], [-12.7, -87.9]] },
  { id: "way/612107035", levels: 1, kind: "yes", ring: [[-44.4, 151.1], [-28.3, 149.3], [-25.8, 150.8], [-15.8, 136.2], [-19.9, 133.1], [-29.3, 133.8], [-30.8, 126.7], [-28.0, 113.0], [-24.3, 105.4], [-24.9, 91.2], [-23.3, 86.9], [-9.0, 73.7], [-4.1, 63.9], [-3.2, 56.7], [-6.6, 40.8], [-6.4, 30.9], [2.3, 19.5], [3.5, 13.7], [2.6, 7.4], [6.7, 3.8], [8.2, 0.5], [6.6, -2.6], [1.2, -2.6], [1.5, -11.6], [-1.7, -11.8], [-0.2, -18.1], [-1.1, -23.7], [-0.4, -35.8], [-4.6, -55.8], [-4.3, -61.3], [1.4, -82.0], [-5.5, -97.2], [-5.8, -103.9], [2.1, -102.9], [2.1, -109.0], [-19.0, -108.7], [-19.0, -105.3], [-15.8, -96.9], [-8.5, -87.3], [-8.0, -82.4], [-10.2, -71.5], [-12.6, -68.2], [-17.3, -65.0], [-17.5, -63.0], [-12.8, -57.2], [-11.4, -51.8], [-9.4, -17.3], [-9.8, -10.5], [-12.9, -8.9], [-16.5, -1.7], [-15.8, 2.1], [-13.7, 4.9], [-10.8, 7.2], [-5.8, 8.5], [-11.1, 17.1], [-16.4, 29.3], [-16.3, 34.9], [-11.3, 58.4], [-15.1, 67.9], [-25.8, 76.3], [-32.7, 78.7], [-38.4, 78.0], [-49.6, 68.9], [-52.0, 79.2], [-45.9, 97.2], [-42.5, 114.7], [-42.4, 134.8]] },
]
const TOWER: XY[] = [[-67.0, 79.8], [-52.0, 79.2], [-49.6, 68.9], [-48.7, 65.1], [-46.7, 61.1], [-43.9, 55.7], [-40.5, 49.0], [-38.5, 43.4], [-37.2, 34.1], [-37.0, 25.5], [-36.9, 21.6], [-37.0, 19.6], [-38.0, 9.3], [-70.7, 12.0], [-73.3, 12.2], [-73.2, 13.5], [-69.2, 55.8]]

const LEVEL = 4.5
/** Strata band height. */
const BAND = LEVEL
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

function build() {
  const sand = new Part()   // sandstone strata, light
  const ochre = new Part()  // sandstone strata, dark
  const garden = new Part() // roof gardens
  const trees_ = new Part() // tree canopies (the darker green)
  const glazing = new Part() // shop fronts, tower windows (window-2)
  const tframe = new Part() // Parks Tower's silver fins and roof

  /** The height of the tallest part (or the tower) under a point, 0 outside them all. */
  const inside = (q: XY, r: XY[]) => {
    let c = false
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j]
      if (yi > q[1] !== yj > q[1] && q[0] < xi + ((q[1] - yi) * (xj - xi)) / (yj - yi)) c = !c
    }
    return c
  }
  const groundAt = (q: XY, self: XY[]) => {
    let h = 0
    for (const p of PARTS) if (p.ring !== self && p.kind !== 'roof' && inside(q, p.ring)) h = Math.max(h, p.levels * LEVEL)
    if (inside(q, TOWER)) h = Math.max(h, 149)
    return h
  }
  /**
   * Walls in strata bands a level tall, edge by edge, each starting at the
   * top of whatever part stands against it outside (hidden walls are not drawn).
   * Returns the base height of each edge.
   */
  const bandWalls = (r: XY[], self: XY[], z1: number) => {
    const bases: number[] = []
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      const mid: XY = [(a[0] + b[0]) / 2 + ((b[1] - a[1]) / len) * 0.7, (a[1] + b[1]) / 2 + ((a[0] - b[0]) / len) * 0.7]
      const z0 = groundAt(mid, self)
      bases.push(z0)
      if (z0 >= z1 - 0.01) continue
      let k = Math.floor(z0 / (BAND))
      for (let z = k * BAND; z < z1 - 0.01; z += BAND, k++) {
        const za = Math.max(z, z0), zb = Math.min(z1, z + BAND)
        if (zb - za > 0.01) (k % 2 ? ochre : sand).quad([a[0], a[1], za], [b[0], b[1], za], [b[0], b[1], zb], [a[0], a[1], zb])
      }
    }
    return bases
  }
  /** A tree or shrub canopy: a squat octahedron with smooth normals, so it reads round. */
  const canopy = (part: Part, c: V3, r: number, hgt: number) => {
    const top: V3 = [c[0], c[1], c[2] + hgt], bot: V3 = [c[0], c[1], c[2]]
    const mid = c[2] + hgt * 0.45
    const ring: V3[] = [0, 1, 2, 3].map((k) => [c[0] + r * Math.cos(k * Math.PI / 2 + 0.4), c[1] + r * Math.sin(k * Math.PI / 2 + 0.4), mid])
    const nrm = (q: V3): V3 => {
      const d: V3 = [(q[0] - c[0]) / r, (q[1] - c[1]) / r, (q[2] - mid) / (hgt * 0.55)]
      const l = Math.hypot(...d) || 1
      return [d[0] / l, d[1] / l, d[2] / l]
    }
    for (let k = 0; k < 4; k++) {
      const A = ring[k], B = ring[(k + 1) % 4]
      part.tri(A, B, top, undefined, undefined, undefined, [nrm(A), nrm(B), [0, 0, 1]])
      part.tri(B, A, bot, undefined, undefined, undefined, [nrm(B), nrm(A), [0, 0, -1]])
    }
  }
  const lifts = new Set(['way/461925097', 'way/461925109', 'way/461925100'])
  let trees = 0
  for (const p of PARTS) {
    const r = ccw(p.ring)
    const h = p.levels * LEVEL
    if (p.kind === 'roof') continue // the saucer's footprint: drawn with its lift below
    if (lifts.has(p.id)) {
      // the round glass lift towers; the one by the canopy part carries the saucer
      const cx = r.reduce((t, q) => t + q[0], 0) / r.length, cy = r.reduce((t, q) => t + q[1], 0) / r.length
      const rad = Math.sqrt(Math.abs(area(r)) / Math.PI)
      const K = 12
      for (let k = 0; k < K; k++) {
        const a0 = (k / K) * 2 * Math.PI, a1 = ((k + 1) / K) * 2 * Math.PI
        const A: V3 = [cx + rad * Math.cos(a0), cy + rad * Math.sin(a0), 0], B: V3 = [cx + rad * Math.cos(a1), cy + rad * Math.sin(a1), 0]
        glazing.quad(A, B, [B[0], B[1], h], [A[0], A[1], h])
        sand.tri([cx, cy, h + 0.6], [A[0], A[1], h], [B[0], B[1], h])
        if (p.id === 'way/461925097') {
          // the saucer: a white dish 18 m across on the lift's head (663highland)
          const R = 9, z0 = h - 0.5, z1 = h + 1.6
          const P = (a: number, rr: number, z: number): V3 => [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z]
          sand.quad(P(a1, rad, z0 - 1.5), P(a1, R, z0), P(a0, R, z0), P(a0, rad, z0 - 1.5)) // underside, facing down and out
          sand.quad(P(a0, R, z0), P(a1, R, z0), P(a1, R, z1), P(a0, R, z1)) // rim
          sand.quad(P(a0, R, z1), P(a1, R, z1), P(a1, R * 0.85, z1 - 0.4), P(a0, R * 0.85, z1 - 0.4)) // lip
          garden.tri([cx, cy, z1 - 0.4], P(a0, R * 0.85, z1 - 0.4), P(a1, R * 0.85, z1 - 0.4)) // the dish's planting
        }
      }
      continue
    }
    const bases = bandWalls(r, p.ring, h)
    if (p.levels <= 1) { cap(sand, r, h); continue } // the canyon floor, paved
    cap(garden, r, h)
    // planter parapets on the exposed edges, with trees and shrubs along them
    for (let i = 0; i < r.length; i++) {
      if (bases[i] >= h) continue
      const a = r[i], b = r[(i + 1) % r.length]
      sand.quad([a[0], a[1], h], [b[0], b[1], h], [b[0], b[1], h + 0.9], [a[0], a[1], h + 0.9])
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n = [(b[1] - a[1]) / len, (a[0] - b[0]) / len]
      const nt = Math.floor(len / 7.5)
      for (let k = 0; k < nt && trees < 300; k++) {
        const u = (k + 0.5) / nt, big = (k + i) % 2 === 0
        const inset = big ? 3.2 : 1.8
        const q: XY = [a[0] + (b[0] - a[0]) * u - n[0] * inset, a[1] + (b[1] - a[1]) * u - n[1] * inset]
        if (!inside(q, r)) continue
        if (big) canopy(trees_, [q[0], q[1], h + 1.2], 3.0, 5.2)
        else canopy(garden, [q[0], q[1], h + 0.2], 1.8, 2.0)
        trees++
      }
    }
    // the amphitheatre on the round south block: oval stepped seating round a turf floor
    if (p.id === 'way/461925112') {
      const cx = r.reduce((t, q) => t + q[0], 0) / r.length, cy = r.reduce((t, q) => t + q[1], 0) / r.length
      const xs = r.map((q) => q[0]), ys = r.map((q) => q[1])
      const ax = (Math.max(...xs) - Math.min(...xs)) * 0.34, ay = (Math.max(...ys) - Math.min(...ys)) * 0.34
      const K = 20, steps = 4
      const E = (k: number, s: number, z: number): V3 => {
        const f = 1 - 0.13 * s, a = (k / K) * 2 * Math.PI
        return [cx + ax * f * Math.cos(a), cy + ay * f * Math.sin(a), z]
      }
      for (let st = 0; st < steps; st++) {
        const zt = h + 0.8 * (steps - st), zb = h + 0.8 * (steps - st - 1)
        for (let k = 0; k < K; k++) {
          // the tread
          sand.quad(E(k, st, zt), E(k + 1, st, zt), E(k + 1, st + 1, zt), E(k, st + 1, zt))
          // the riser, facing the middle
          ochre.quad(E(k + 1, st + 1, zb), E(k, st + 1, zb), E(k, st + 1, zt), E(k + 1, st + 1, zt))
          if (st === 0) sand.quad(E(k + 1, 0, h), E(k, 0, h), E(k, 0, zt), E(k + 1, 0, zt)) // outer wall, facing out... wound below
        }
      }
    }
    // shop glazing at the canyon floor on the longer walls
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 9 || bases[i] > 5) continue
      const n = [(b[1] - a[1]) / len, (a[0] - b[0]) / len]
      const P = (u: number, z: number): V3 => [a[0] + (b[0] - a[0]) * u + n[0] * 0.05, a[1] + (b[1] - a[1]) * u + n[1] * 0.05, z]
      const m = 1.2 / len
      glazing.quad(P(m, 5.4), P(1 - m, 5.4), P(1 - m, 8.6), P(m, 8.6))
    }
  }

  // --- Parks Tower: 149 m of dark charcoal-blue glass with silver vertical fins.
  {
    const r = ccw(TOWER)
    const H = 149
    walls(glazing, r, 0, H)
    cap(glazing, r, H) // the roof reads dark from the towers round it
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 1.5) continue
      const n: V3 = [(b[1] - a[1]) / len, (a[0] - b[0]) / len, 0]
      const t: V3 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len, 0]
      const nf = Math.max(1, Math.round(len / 7))
      for (let k = 0; k <= nf; k++) {
        if (k === nf && len < 20) continue
        const c: V3 = [a[0] + t[0] * (len * k / nf), a[1] + t[1] * (len * k / nf), 0]
        const w = 0.18, d = 0.7, z0 = 9, z1 = H - 0.3
        const P = (s: number, o: number, z: number): V3 => [c[0] + t[0] * s + n[0] * o, c[1] + t[1] * s + n[1] * o, z]
        tframe.quad(P(-w, d, z0), P(w, d, z0), P(w, d, z1), P(-w, d, z1))
        tframe.quad(P(w, 0, z0), P(w, d, z0), P(w, d, z1), P(w, 0, z1)) // wound from outside along +t
        tframe.quad(P(-w, d, z0), P(-w, 0, z0), P(-w, 0, z1), P(-w, d, z1))
      }
      // the lobby's frame line and the crown's band
      const P = (u: number, o: number, z: number): V3 => [a[0] + t[0] * u + n[0] * o, a[1] + t[1] * u + n[1] * o, z]
      tframe.quad(P(0, 0.4, 8.2), P(len, 0.4, 8.2), P(len, 0.4, 9.2), P(0, 0.4, 9.2))
    }
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: sand, material: finish('parks-sandstone', 0xdcc39a) },
    { part: ochre, material: finish('parks-ochre', 0xc29a66) },
    { part: garden, material: finish('parks-garden', 0x8fa364) },
    { part: trees_, material: finish('parks-trees', 0x5e7a45) },
    { part: glazing, material: windowVariant(2, 0x48576c) },
    { part: tframe, material: finish('parks-tower-fins', 0xb3bbc3) },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 6500) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Namba Parks', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 149,
  })
  const out = new URL('../models/osaka-namba-parks.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
