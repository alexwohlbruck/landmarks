/**
 * Busch Stadium (III), St. Louis (MLB, St. Louis Cardinals, opened 2006) —
 * procedural, CC0-1.0, no textures.  bun generators/stl-busch-stadium.ts
 *
 * Map frame: x across the park (first-base side +x), y from home plate
 * toward centre field, z up, metres. Placed at bearing 63°, the line from
 * home plate to the mound in the USGS NAIP orthophoto (home plate at about
 * (-5, -37.5) in this frame, the mound at (-5, -19)). Anchor: the area
 * centroid of the outer way of the stadium outline (building=stadium
 * relation/2511955, outer way/42341545, inner way/102759630 the field).
 *
 * The stands only: grass, infield, warning track and the outfield plazas are
 * the map's. z = 0 is the playing field.
 *
 * Elevation: 0. The field is sunk below the streets on three sides, and the
 * map's Mapterhorn terrain already carries that pit: `terrain.ts grid` shows
 * the field at 2.0 m (relative) and the streets round it 3 to 10 m. The USGS
 * lidar bare earth outside the outline, measured from the field: Spruce
 * Street behind home plate and the first-base side about 0 to 1 m, Broadway
 * (right field) 5 to 6.5 m, Eighth Street (third base) 4.5 to 5.5 m, Clark
 * Avenue (left and centre field) 7.5 to 8.3 m. Those street levels set where
 * the facade detail starts; the walls run down to the field on every side.
 * Because the pit is already in the terrain, a negative elevation would sink
 * the stands a second time (the Carter–Finley lesson).
 *
 * How it is built: the bowl is lofted round C = (-5, -19), the mound, with
 * `loftSections` from dc-nationals-park.ts. At each angle θ (clockwise from
 * centre field) the section runs out from the field wall (OSM inner way) to
 * the outline (OSM outer way). Every radius and height below is measured from
 * the USGS lidar (USGS_LPC_MO_StLouis_2017_LAS_2018, flown 2017–18, 1 m grid)
 * in 6° steps (table ROWS: lower-bowl back, canopy front, canopy back):
 *   - the lower bowl, field wall to about 5 m;
 *   - the club and suite glass under the decks, a loge deck at 15 m;
 *   - home plate, first base and the right-field corner (θ 46°–234°): the
 *     upper deck from 23 m rising to a 31 m top concourse under a 13 m
 *     deep light steel canopy at 40.7 m (thin 1.2 m fascia, on posts); the brick perimeter building behind, roof 27 m, street front
 *     31 m;
 *   - the third-base gate (θ 234°–256°, Gate 3 on Eighth Street): no canopy,
 *     the deck tops out at 29 m under a 31 m roof, between two brick towers
 *     of 36 m with the steel truss arch between them (photo);
 *   - third base to the left-field corner (θ 256°–316°): a lower stand, the
 *     loge deck rising 15 → 19 m, the upper rows under a canopy at 35 m,
 *     the perimeter building at 22.5–23.5 m with a 26.5–27 m street front
 *     (also 26.5 m from θ 198° to Gate 3, lidar);
 *   - six light towers, 60 m, at the twelve legs OSM maps
 *     (man_made=mast tower:type=lighting), each two legs about 10 m apart
 *     with a lamp bank on each and an arched beam between (photos);
 *   - brick towers at the gates: 36 m at Gate 3, 33 m at Gates 1 and 2
 *     (lidar), and the 36 m brick block in the right-field corner;
 *   - the outfield is open toward downtown and the Arch: low left-field
 *     bleachers to 9 m over a 4.5 m wall, the batter's eye block in centre (16–17 m), the
 *     right-field bleachers to 13.5 m, the two video boards in right-centre
 *     on a diagonal (main board to 32.5 m with the red Budweiser sign to
 *     35.5 m, the second to 31 m) and the 17 m patio building behind them.
 *
 * Identity (from the photos): the red-brick street walls with big openings
 * and cast-stone cornices; the brick gate towers with their tall
 * round-headed windows and the black steel truss arch between them (an echo
 * of Eads Bridge); the red seats in three tiers wrapping home plate to the
 * foul poles; the light open steel canopies; the H-shaped black light towers with
 * their lamp banks; the open outfield with the scoreboards in right-centre.
 *
 * Evidence
 * - OSM: outline relation/2511955 (outer way/42341545, also tagged
 *   leisure=stadium; inner way/102759630); light-tower legs
 *   node/5839356615, 12054217525–12054217535; gates node/12054218207
 *   (Gate 1), 2611720295 (2), 12054217988 (3), 12054217725 (4),
 *   12054217592 (5), 12054217593 (6). No building or building:part lies
 *   inside the outline (osm.py buildings, half 250 m); the nearest, roofs
 *   way/617745448, 617745453 and 1301409955 by the Clark Avenue gates, stand
 *   just outside it and are left to the map.
 * - Measured: USGS lidar 2017–18 (every height and radius above, the light
 *   towers' tops, the gate towers, the scoreboards); USGS NAIP orthophoto
 *   (plan, home-plate line, roof colours). Mapterhorn terrain (the pit).
 * - Published: opened 2006, HOK Sport; capacity about 45,000 (Wikipedia,
 *   "Busch Stadium").
 * - Photos (EVIDENCE):
 *   - "Busch Stadium III, St. Louis, third base entrance.jpg", Paul.hawke,
 *     CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Busch_Stadium_III,_St._Louis,_third_base_entrance.jpg
 *     (Gate 3 from the west: brick towers, arch, light towers, canopies);
 *   - "Busch Stadium 2022.jpg", Lightmetro, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Busch_Stadium_2022.jpg
 *     (the bowl from behind home plate: decks, canopies, light towers,
 *     scoreboards, open outfield);
 *   - "Busch Pano 2022.jpg", Lightmetro, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Busch_Pano_2022.jpg
 *     (the third-base canopy and towers);
 *   - "Busch Stadium 24 August 2013.JPG", Fredlyfish4, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Busch_Stadium_24_August_2013.JPG
 *     (the outfield and right-centre boards from the third-base upper deck);
 *   - "Busch Stadium from the Gateway Arch, St. Louis, September 10, 2017.jpg",
 *     HeatherMarieKosur, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Busch_Stadium_from_the_Gateway_Arch,_St._Louis,_September_10,_2017.jpg
 *     (the whole park from the east-north-east);
 *   - "Busch Stadium 004 (2335167947).jpg", binkle_28, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Busch_Stadium_004_(2335167947).jpg
 *     (Gate 3's south tower and arch during construction);
 *   - "Busch Stadium 17", pvsbond (Flickr), CC BY-SA 2.0,
 *     https://www.flickr.com/photos/56141425@N00/689287251 (the brick wall,
 *     openings and cornice close up).
 * Estimated: the glass and fascia bands under the decks and the facade
 * openings (from the photos, not measured); the hidden rake of the upper
 * decks under the canopies; the lamp banks' size; the arch's span and rise
 * (photo, scaled from the 36 m towers). Not drawn: the field, the plazas,
 * the statues, flagpoles, signs and lettering (the Budweiser sign is one red
 * bar), the ribbon boards. Doubts: only Gate 3 is photographed here, so the
 * truss arch is drawn there only; Gates 1 and 2 have their lidar towers and
 * a plain dark gate opening. The east (Broadway) and south (Spruce) facades
 * follow the west facade's banding. The assignment placed the big video
 * board in left-centre; the photos show it in right-centre, as drawn.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, loftSections, prism, quad, rayHit, type SectionPt, type XY } from './dc-nationals-park'

// OSM in this frame (bearing 63°, about the anchor).
const OUTLINE: XY[] = [[-20.8, -129.7], [-19.2, -131.4], [-17.5, -132.9], [-15.8, -134.0], [-13.8, -135.0], [-11.8, -136.0], [-9.5, -136.7], [-6.8, -137.2], [-3.6, -137.5], [-0.7, -137.4], [2.8, -136.7], [6.0, -135.6], [9.2, -133.9], [11.6, -132.2], [14.0, -129.9], [16.5, -132.5], [22.0, -126.9], [18.6, -123.6], [21.4, -120.7], [22.4, -121.8], [60.1, -83.8], [58.9, -82.6], [61.8, -79.8], [62.9, -80.9], [68.4, -75.5], [67.3, -74.4], [69.5, -72.2], [70.5, -73.2], [84.7, -58.9], [83.7, -57.8], [85.7, -55.9], [86.7, -56.9], [92.1, -51.6], [91.1, -50.5], [93.7, -48.0], [94.5, -48.9], [106.6, -36.6], [132.7, -10.3], [131.7, -9.3], [134.6, -6.4], [137.6, -9.6], [143.0, -4.2], [140.6, -1.8], [142.2, -0.3], [143.7, 1.7], [145.2, 4.1], [146.5, 6.6], [147.5, 9.4], [148.2, 12.1], [148.4, 14.6], [148.4, 16.1], [148.4, 17.6], [148.0, 20.6], [147.2, 23.2], [146.2, 25.9], [144.6, 28.5], [143.0, 30.6], [140.5, 33.2], [142.8, 35.6], [136.3, 42.2], [134.9, 40.8], [132.0, 43.8], [132.9, 44.8], [96.5, 81.2], [95.5, 80.0], [92.3, 83.2], [94.1, 85.0], [90.7, 88.5], [86.9, 92.3], [84.3, 89.6], [79.2, 84.4], [74.6, 78.7], [23.1, 129.2], [12.0, 118.0], [9.6, 114.7], [-17.0, 114.7], [-17.1, 105.6], [-19.9, 105.7], [-21.7, 110.5], [-32.5, 106.9], [-31.2, 102.3], [-53.1, 94.6], [-67.0, 80.5], [-63.0, 76.5], [-78.0, 61.8], [-86.5, 70.1], [-78.9, 77.6], [-82.4, 81.0], [-85.1, 83.7], [-92.5, 76.1], [-90.0, 73.7], [-91.6, 72.0], [-92.8, 73.2], [-109.6, 56.2], [-130.9, 34.6], [-134.2, 31.3], [-132.9, 30.0], [-134.8, 28.1], [-136.4, 29.8], [-141.8, 24.2], [-139.1, 21.5], [-140.7, 19.8], [-142.4, 17.9], [-144.1, 15.2], [-145.2, 12.8], [-146.1, 9.9], [-146.7, 6.9], [-146.8, 4.3], [-146.8, 3.3], [-146.6, 1.4], [-146.2, -1.1], [-145.4, -3.8], [-144.5, -6.0], [-142.9, -8.6], [-141.3, -10.9], [-139.2, -13.3], [-141.5, -15.7], [-138.8, -18.4], [-136.1, -21.2], [-134.7, -20.0], [-132.0, -22.7], [-133.2, -23.8], [-111.3, -45.3], [-110.2, -44.3], [-107.6, -47.0], [-109.3, -48.8], [-105.8, -52.4], [-102.2, -56.0], [-101.5, -55.4], [-91.2, -65.5], [-80.7, -75.7], [-81.4, -76.5], [-77.8, -80.0], [-74.3, -83.6], [-72.3, -81.7], [-69.4, -84.6], [-70.5, -85.7], [-31.9, -123.8], [-30.8, -122.7], [-29.3, -124.2], [-27.7, -125.7], [-28.9, -126.9], [-23.4, -132.3]]
// The field: inner way/102759630. Its edge is the field wall.
const FIELD: XY[] = [[-50.0, -15.3], [-56.5, 12.5], [-76.4, 32.0], [-78.4, 39.9], [-61.4, 57.1], [-67.4, 62.9], [-64.0, 66.4], [-53.4, 77.2], [-49.3, 81.5], [-43.3, 75.7], [-17.7, 83.5], [-17.5, 95.5], [-17.2, 102.5], [6.9, 102.4], [6.9, 111.0], [12.5, 111.1], [7.0, 95.6], [6.9, 84.3], [33.4, 75.8], [39.7, 82.2], [54.3, 67.6], [57.8, 64.2], [51.5, 58.0], [65.9, 43.8], [67.5, 33.7], [56.1, 22.0], [56.9, 17.3], [37.7, -17.7], [33.8, -21.7], [30.1, -24.3], [19.0, -35.4], [16.8, -40.1], [12.7, -44.3], [8.8, -47.8], [6.8, -49.1], [5.4, -50.1], [1.9, -51.6], [0.2, -51.9], [-1.6, -52.3], [-5.5, -52.5], [-8.4, -52.2], [-10.4, -51.8], [-11.4, -51.6], [-13.9, -50.6], [-16.8, -48.9], [-19.1, -47.0], [-22.3, -43.9], [-25.9, -40.4], [-25.3, -39.8], [-27.7, -36.2], [-40.5, -23.5], [-42.3, -21.7]]

const C: XY = [-5, -19]
const dirOf = (a: number): XY => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)]
const at = (a: number, r: number): XY => [C[0] + dirOf(a)[0] * r, C[1] + dirOf(a)[1] * r]
const wallR = (a: number) => rayHit(FIELD, C, dirOf(a % 360))
const outerR = (a: number) => rayHit(OUTLINE, C, dirOf(a % 360)) - 0.3
const lerpTable = (t: number[][], a: number, col = 1) => {
  if (a <= t[0][0]) return t[0][col]
  for (let i = 0; i < t.length - 1; i++) if (a <= t[i + 1][0]) {
    const f = (a - t[i][0]) / (t[i + 1][0] - t[i][0])
    return t[i][col] + (t[i + 1][col] - t[i][col]) * f
  }
  return t[t.length - 1][col]
}

const brick = new Part(), stone = new Part(), roof = new Part(), steel = new Part(), seats = new Part(), glass = new Part()

/** [θ, lower-bowl back, canopy front, canopy back], lidar, 6° steps. */
const ROWS = [
  [46, 107.5, 119, 132], [52, 108.5, 120.5, 133], [58, 105, 118.5, 132], [64, 101.5, 113, 126.5], [70, 98, 110, 123.5],
  [76, 91.5, 106, 121], [82, 83, 97.5, 113.5], [88, 78, 91.5, 105], [94, 74, 86, 100], [100, 70.5, 82.5, 96.5],
  [106, 67.5, 79.5, 93.5], [112, 64.5, 76.5, 90.5], [118, 61, 73, 87], [124, 59.5, 72, 84.5], [130, 59.5, 71.5, 83.5],
  [136, 59.5, 70.5, 83.5], [142, 60, 71, 84], [148, 60.5, 71.5, 85], [154, 61.5, 72.5, 85.5], [160, 61.5, 72.5, 85.5],
  [166, 61, 73, 86], [172, 61.5, 73.5, 86.5], [178, 60.5, 73, 86], [184, 61, 72.5, 86], [190, 61, 72.5, 85.5],
  [196, 60, 71.5, 84.5], [202, 59.5, 71.5, 84.5], [208, 59, 70, 84], [214, 58.5, 70, 83.5], [220, 57, 69, 81.5],
  [226, 56.5, 69, 81.5], [234, 58, 70, 82], [240, 59.5, 0, 0], [246, 60.5, 0, 0], [252, 63.5, 0, 0],
  [256, 66, 79, 94], [258, 67.5, 80, 95], [264, 72, 84, 97], [270, 73.5, 85.5, 98], [276, 75, 86, 101],
  [282, 79, 91, 106], [288, 83.5, 96.5, 113], [294, 90.5, 103.5, 120.5], [300, 95.5, 108, 122.5], [306, 94.5, 106.5, 119.5],
  [312, 93.5, 105.5, 118.5], [316, 93.5, 106, 118.5],
]
const HIGH_END = 234, LOW_START = 256, LOW_END = 316
/** Street level outside the outline above the field (lidar bare earth), by θ. */
const STREET = [[0, 8.3], [10, 8.3], [20, 6.6], [40, 6.5], [50, 5.6], [60, 5.1], [70, 4.8], [80, 5.0], [90, 2.4], [100, 0.3],
  [140, 0], [170, 1.0], [190, 0.9], [200, 1.8], [210, 2.6], [220, 3.3], [230, 4.2], [240, 4.7], [260, 4.9], [270, 5.0],
  [280, 5.5], [290, 6.0], [300, 6.5], [310, 6.8], [320, 7.6], [330, 7.8], [340, 8.2], [360, 8.3]]
const street = (a: number) => lerpTable(STREET, ((a % 360) + 360) % 360)

type Kind = 'high' | 'gate' | 'low'
const kindOf = (a: number): Kind => (a <= HIGH_END ? 'high' : a < LOW_START ? 'gate' : 'low')
/** Roof and street-front heights of the perimeter building. */
const perim = (a: number) => {
  const k = kindOf(a)
  if (k === 'high') return a >= 198 ? { roof: 25, par: 26.5 } : { roof: 27, par: 31 }
  if (k === 'gate') return { roof: 29, par: 29 }
  return a >= 300 ? { roof: 23.5, par: 27 } : { roof: 22.5, par: 26.5 }
}

/** The grandstand section at one angle, from the lower bowl's back to the street. */
function standSection(a: number): SectionPt[] {
  const k = kindOf(a)
  const rb = lerpTable(ROWS, a, 1), cf = lerpTable(ROWS, a, 2), cb = lerpTable(ROWS, a, 3)
  const ro = outerR(a)
  const { roof: zr, par } = perim(a)
  let rL = rb + 3, zL = 15.5, zU = 23, rT = cb - 1.5, zT = 31
  if (k === 'gate') { rT = rb + 14; zT = 29 }
  if (k === 'low') { rL = cf - 3; zL = 19; zT = 27 }
  zT = Math.max(zT, zr + 0.5)
  const rS = rT + 1.5
  const rP = Math.max(rS + 0.5, ro - 6)
  return [
    { r: rb - 1, z: 5, part: roof }, // concourse behind the lower bowl
    { r: rb, z: 5, part: glass }, // club and suite glass
    { r: rb, z: 13.8, part: roof }, // thin pale lip of the loge deck
    { r: rb, z: 15, part: seats }, // loge deck, red seats
    { r: rL, z: zL, part: glass }, // suites under the upper deck
    { r: rL, z: zU - 1.2, part: roof }, // thin pale lip of the upper deck
    { r: rL, z: zU, part: seats }, // upper deck, red seats, up to the top concourse
    { r: rT, z: zT, part: roof }, // top concourse, under the canopy
    { r: rS, z: zT, part: brick }, // its back wall
    { r: rS, z: zr, part: roof }, // perimeter building roof
    { r: rP, z: zr, part: brick }, // step up to the street front
    { r: rP, z: par, part: roof },
    { r: ro, z: par, part: stone }, // cast-stone cornice
    { r: ro, z: par - 1.6, part: brick }, // red brick street walls
    { r: ro, z: 0, part: null },
  ]
}

// The grandstand, right-field corner round home plate to the left-field corner.
const STAND_ANGLES: number[] = []
for (let a = 46; a < LOW_END; a += 4) STAND_ANGLES.push(a)
STAND_ANGLES.push(LOW_START, LOW_END)
STAND_ANGLES.sort((p, q) => p - q)
loftSections(C, STAND_ANGLES, STAND_ANGLES.map(standSection), brick)

// The lower bowl: red seats from the field wall up to the concourse, with a
// cross aisle.
loftSections(C, STAND_ANGLES, STAND_ANGLES.map((a) => {
  const rw = wallR(a), rb = Math.max(lerpTable(ROWS, a, 1) - 1, rw + 3)
  // the front row stands higher in the corners, where the seats start up
  // the slope from the bullpens (lidar)
  const zf = a < 62 || a > 290 ? 2.6 : 1.2
  const rm = rw + (rb - rw) * 0.55, zm = zf + (5 - zf) * 0.55
  return [
    { r: rw, z: 0, part: steel }, // field wall
    { r: rw, z: zf, part: seats },
    { r: rm, z: zm, part: stone }, // cross aisle
    { r: rm + 1.2, z: zm, part: seats },
    { r: rm + 1.2, z: zm + 0.5, part: seats },
    { r: rb, z: 5, part: null },
    { r: rb, z: 0, part: null },
  ]
}), stone)

// The canopies: light open steel roofs over the upper decks' back rows,
// as deep as the lidar shows, with a thin 1.2 m pale fascia, on slim posts
// rising from the top concourse.
function canopy(angles: number[], z: number, zBase: (a: number) => number) {
  loftSections(C, angles, angles.map((a) => {
    const cf = lerpTable(ROWS, a, 2), cb = lerpTable(ROWS, a, 3)
    return [
      { r: cf - 1, z: z - 1.2, part: roof },
      { r: cf - 1, z, part: roof },
      { r: cb + 0.5, z, part: roof },
      { r: cb + 0.5, z: z - 0.6, part: steel },
      { r: cf - 1, z: z - 1.2, part: null },
    ]
  }), roof)
  for (let i = 1; i < angles.length - 1; i += 3) {
    const a = angles[i], cb = lerpTable(ROWS, a, 3)
    const d = dirOf(a), t: V3 = [d[1], -d[0], 0], n: V3 = [d[0], d[1], 0]
    const p = at(a, cb - 1.2), z0 = zBase(a)
    box(steel, [p[0], p[1], (z0 + z - 0.6) / 2], [t, n, [0, 0, 1]], [0.35, 0.35, (z - 0.6 - z0) / 2])
  }
}
canopy(STAND_ANGLES.filter((a) => a <= HIGH_END), 40.7, () => 31)
canopy(STAND_ANGLES.filter((a) => a >= LOW_START), 35, () => 27)

// Left field: low bleachers up to Clark Avenue's level, θ 316° → 347°.
{
  const angles = [316, 320, 324, 328, 332, 336, 340, 344, 347]
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a), ro = outerR(a)
    return [
      { r: rw, z: 0, part: steel }, // outfield wall, 4.5 m (lidar)
      { r: rw, z: 4.5, part: steel },
      { r: rw + 1, z: 5, part: seats }, // first row a step over the wall
      { r: ro - 3, z: 9, part: roof },
      { r: ro, z: 9, part: brick },
      { r: ro, z: 0, part: null },
    ]
  }), brick)
}

// Centre field: the batter's eye slope behind the wall and the plaza are
// the map's ground (the terrain stands 5–6 m over the field there).

// Right field: bleachers from the wall up to the scoreboards, θ 9° → 46°.
const BACK = [[6, 125], [9, 127.5], [22, 127], [37, 119.5], [42, 123], [46, 125]]
{
  const angles = [369, 372, 376, 380, 384, 388, 392, 396, 400, 403, 406]
  loftSections(C, angles, angles.map((a) => {
    const rw = wallR(a), rk = lerpTable(BACK, a - 360)
    const zt = a - 360 < 38 ? 13.5 : 15
    return [
      { r: rw, z: 0, part: steel },
      { r: rw, z: 3.2, part: steel },
      { r: rw + 1, z: 3.6, part: seats },
      { r: rk, z: zt, part: roof },
      { r: rk + 1.2, z: zt, part: brick },
      { r: rk + 1.2, z: 0, part: null },
    ]
  }), brick)
}

/** A plan polygon between two angles and two radii (outer may follow the outline). */
function sector(a0: number, a1: number, r0: number, r1: number | null, n = 3): XY[] {
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push(at(a, r1 ?? outerR(a))) }
  for (let i = n; i >= 0; i--) { const a = a0 + ((a1 - a0) * i) / n; pts.push(at(a, r0)) }
  return pts
}

// The patio building behind the main board, 17 m, θ 8° → 22°.
prism(sector(8, 22, 128.5, null), 0, 17, brick, roof)
// The batter's eye: a dark block in centre field with a pale roof, and the
// smaller brick block beside it.
prism(sector(352, 365, 120, 131, 4), 0, 17, steel, roof)
prism(sector(347, 352, 120, 127, 2), 0, 15, brick, roof)
// The 36 m brick block in the right-field corner.
prism(sector(39, 46, 128, null, 2), 0, 34.6, brick, null)
prism(sector(39, 46, 128, null, 2), 34.6, 36, stone, roof)

/** Unit vector, outward normal of a wall segment (away from C). */
function outward(p: XY, q: XY): V3 {
  const e: XY = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(e[0], e[1])
  let n: V3 = [e[1] / L, -e[0] / L, 0]
  const m: XY = [(p[0] + q[0]) / 2 - C[0], (p[1] + q[1]) / 2 - C[1]]
  if (n[0] * m[0] + n[1] * m[1] < 0) n = [-n[0], -n[1], 0]
  return n
}
/** A flush panel on the wall from p to q, between u0..u1 along it and z0..z1. */
function panel(part: Part, p: XY, q: XY, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  const n = outward(p, q)
  const P = (u: number, z: number): V3 => [p[0] + (q[0] - p[0]) * u + n[0] * off, p[1] + (q[1] - p[1]) * u + n[1] * off, z]
  quad(part, [P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1)], n)
}

// Gate towers: brick, a cast-stone cap and a tall round-headed window on the
// street face; Gate 3 (photo) 36 m, Gates 1 and 2 (lidar) 33 m.
function gateTower(a0: number, a1: number, depth: number, top: number) {
  const rMax = Math.max(outerR(a0), outerR(a1), outerR((a0 + a1) / 2)) + 1.2
  const ro0 = rMax, ro1 = rMax
  const poly: XY[] = [at(a0, ro0 - depth), at(a1, ro1 - depth), at(a1, ro1), at(a0, ro0)]
  prism(poly, 0, top - 2.2, brick, null)
  // the cast-stone cornice cap, proud of the shaft
  const c: XY = [(poly[0][0] + poly[1][0] + poly[2][0] + poly[3][0]) / 4, (poly[0][1] + poly[1][1] + poly[2][1] + poly[3][1]) / 4]
  prism(poly.map(([x, y]) => [c[0] + (x - c[0]) * 1.1, c[1] + (y - c[1]) * 1.1] as XY), top - 2.2, top, stone, roof)
  // the window: a jamb rectangle and a semicircular head, on the street face
  const p = at(a1, ro1), q = at(a0, ro0)
  const n = outward(q, p)
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), w = Math.min(3.4, L * 0.3)
  const s = street((a0 + a1) / 2)
  const z0 = s + 3, zs = top - 6.5 - w / 2 // a long slot to just under the cap
  const mid: XY = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], e: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
  const W = (u: number, z: number): V3 => [mid[0] + e[0] * u + n[0] * 0.05, mid[1] + e[1] * u + n[1] * 0.05, z]
  quad(glass, [W(-w / 2, z0), W(w / 2, z0), W(w / 2, zs), W(-w / 2, zs)], n)
  const N = 8
  for (let i = 0; i < N; i++) {
    const t0 = Math.PI - (Math.PI * i) / N, t1 = Math.PI - (Math.PI * (i + 1)) / N
    const h0 = W((Math.cos(t0) * w) / 2, zs + (Math.sin(t0) * w) / 2), h1 = W((Math.cos(t1) * w) / 2, zs + (Math.sin(t1) * w) / 2)
    quad(glass, [W(0, zs), h0, h1, h1], n)
  }
}
gateTower(228, 234.5, 12, 36)
gateTower(248.5, 255.5, 12, 36)
gateTower(163.5, 169.5, 10, 33)
gateTower(187.5, 193, 10, 33)
gateTower(67, 71.5, 10, 33)
gateTower(81, 85, 10, 33)

// The gates between the towers: a dark steel frame over the opening.
function gateFrame(a0: number, a1: number, z1: number) {
  const p = at(a0, outerR(a0)), q = at(a1, outerR(a1))
  panel(steel, p, q, 0.02, 0.98, street((a0 + a1) / 2), z1)
}
{ // Gate 3: the open steel framing above the arch reads pale against the sky
  const p = at(234.5, outerR(234.5)), q = at(248.5, outerR(248.5))
  panel(roof, p, q, 0.01, 0.99, street(241), 28)
}
gateFrame(169.5, 187.5, 22)
gateFrame(71.5, 81, 22)

// Gate 3's steel truss arch (photos): a segmental arch from tower to tower,
// springing 4.5 m over Eighth Street and rising 8.5 m, a bold black band, with
// the open concourse (glazed) under it.
{
  const p = at(234.5, outerR(234.5)), q = at(248.5, outerR(248.5))
  const n = outward(p, q), L = Math.hypot(q[0] - p[0], q[1] - p[1]), e: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
  const s0 = street(241), z0 = s0 + 4.5, rise = 8.5
  const R = (L * L / 4 + rise * rise) / (2 * rise), cz = z0 + rise - R
  const half = Math.asin(L / 2 / R)
  const N = 10
  const W = (u: number, z: number, off: number): V3 => [p[0] + e[0] * u + n[0] * off, p[1] + e[1] * u + n[1] * off, z]
  const arc = (i: number): [number, number] => { const t = -half + (i / N) * 2 * half; return [L / 2 + R * Math.sin(t), cz + R * Math.cos(t)] }
  for (let i = 0; i < N; i++) {
    const [u0, za] = arc(i), [u1, zb] = arc(i + 1)
    quad(glass, [W(u0, s0, 0.12), W(u1, s0, 0.12), W(u1, zb, 0.12), W(u0, za, 0.12)], n) // the opening under the arch
    const t = -half + ((i + 0.5) / N) * 2 * half
    const tan: V3 = [e[0] * Math.cos(t), e[1] * Math.cos(t), -Math.sin(t)]
    const up: V3 = [e[0] * Math.sin(t), e[1] * Math.sin(t), Math.cos(t)]
    const um = L / 2 + R * Math.sin(t), zm = cz + R * Math.cos(t)
    box(steel, [p[0] + e[0] * um + n[0] * 1.0, p[1] + e[1] * um + n[1] * 1.0, zm + 1.1], [tan, n, up], [R * half / N + 0.15, 0.7, 1.6], true) // a 3.2 m deep truss band
  }
}

// Facade openings on the street walls (photos): big rectangular bays, one tall
// dark opening per bay between brick piers, from just over the street to
// under the cornice band.
const TOWERS = [[65, 87], [161, 195], [226, 258]]
for (let i = 0; i < STAND_ANGLES.length - 1; i++) {
  const a0 = STAND_ANGLES[i], a1 = STAND_ANGLES[i + 1]
  if (TOWERS.some(([t0, t1]) => a1 > t0 && a0 < t1)) continue
  const p = at(a0, outerR(a0)), q = at(a1, outerR(a1))
  if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 5) continue
  const { par } = perim(a0)
  const z0 = Math.max(street((a0 + a1) / 2) + 3, 3), z1 = par - 3.5
  if (z1 - z0 < 6) continue
  panel(glass, p, q, 0.13, 0.87, z0, z1) // one tall opening per bay, brick piers between
}

// Light towers: two open ladder legs about 10 m apart (OSM), a lamp bank on top
// of each facing the field, a beam over the top (60 m, lidar) and an arched
// beam between the legs under the lamps.
const TOWER_LEGS: [XY, XY][] = [
  [[-83.0, 67.0], [-75.9, 74.2]], [[-90.5, -43.7], [-98.0, -36.6]], [[-69.9, -64.2], [-62.4, -71.2]],
  [[51.5, -75.8], [59.0, -68.2]], [[83.9, -37.5], [79.0, -47.2]], [[74.5, 80.6], [82.2, 73.2]],
]
const TOP = 60
for (const [A, B] of TOWER_LEGS) {
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const t: V3 = [(B[0] - A[0]) / L, (B[1] - A[1]) / L, 0]
  const M: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  let n: V3 = [-t[1], t[0], 0]
  if (n[0] * (0 - M[0]) + n[1] * (20 - M[1]) < 0) n = [-n[0], -n[1], 0] // toward the field
  const ax: [V3, V3, V3] = [t, n, [0, 0, 1]]
  for (const P of [A, B]) {
    // each leg an open ladder: two posts 3.2 m apart with rungs
    for (const k of [-1, 1]) box(steel, [P[0] + t[0] * k * 1.6, P[1] + t[1] * k * 1.6, (22 + TOP - 8) / 2], ax, [0.35, 0.35, (TOP - 8 - 22) / 2])
    for (let z = 34; z < TOP - 10; z += 6) box(steel, [P[0], P[1], z], ax, [1.6, 0.25, 0.25])
    box(steel, [P[0], P[1], TOP - 4.2], ax, [2.4, 0.45, 4.2], true) // lamp bank on top of the leg
    box(glass, [P[0] + n[0] * 0.5, P[1] + n[1] * 0.5, TOP - 4.3], ax, [2.1, 0.05, 3.8]) // lamps: `window`, so they glow at night
  }
  box(steel, [M[0], M[1], TOP - 0.5], ax, [L / 2, 0.6, 0.5], true) // top beam
  // the arched beam under the lamp banks
  const N = 4
  for (let i = 0; i < N; i++) {
    const u0 = -L / 2 + (L * i) / N, u1 = u0 + L / N
    const z = (u: number) => TOP - 12.5 + 2.5 * (1 - (2 * u / L) ** 2)
    const um = (u0 + u1) / 2, dz = z(u1) - z(u0), len = Math.hypot(L / N, dz)
    const tt: V3 = [t[0] * (L / N) / len, t[1] * (L / N) / len, dz / len]
    const up: V3 = [-t[0] * dz / len, -t[1] * dz / len, (L / N) / len]
    box(steel, [M[0] + t[0] * um, M[1] + t[1] * um, z(um)], [tt, n, up], [len / 2 + 0.1, 0.45, 0.45], true)
  }
}

// The right-centre video boards on their diagonal, facing home plate: the
// main board with its red Budweiser sign, and the second board beside it.
function board(a0: number, r0: number, a1: number, r1: number, z0: number, z1: number, sign: boolean) {
  const p = at(a0, r0), q = at(a1, r1)
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), e: V3 = [(q[0] - p[0]) / L, (q[1] - p[1]) / L, 0]
  let n: V3 = [-e[1], e[0], 0]
  const home: XY = [-5, -37.5]
  if (n[0] * (home[0] - p[0]) + n[1] * (home[1] - p[1]) < 0) n = [-n[0], -n[1], 0]
  const m: XY = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const ax: [V3, V3, V3] = [e, n, [0, 0, 1]]
  box(steel, [m[0], m[1], (z0 + z1) / 2], ax, [L / 2, 0.8, (z1 - z0) / 2], true)
  box(glass, [m[0] + n[0] * 0.8, m[1] + n[1] * 0.8, (z0 + z1) / 2 + 0.6], ax, [L / 2 - 1.2, 0.05, (z1 - z0) / 2 - 2])
  for (const s of [-1, 1]) box(steel, [m[0] + e[0] * s * (L / 2 - 2), m[1] + e[1] * s * (L / 2 - 2), (12 + z0) / 2], ax, [0.7, 0.7, (z0 - 12) / 2])
  if (sign) {
    box(seats, [m[0] + n[0] * 0.3, m[1] + n[1] * 0.3, z1 + 1.5], ax, [L * 0.36, 0.5, 1.5], true)
    box(seats, [m[0] + n[0] * 0.3, m[1] + n[1] * 0.3, z1 + 3.6], ax, [2.2, 0.5, 0.7], true) // the eagles and clock
  }
}
board(9, 129.5, 22.5, 129, 15, 32.5, true)
board(23.5, 128.5, 37, 121, 13, 31, false)

// ---------------------------------------------------------------------------
// Night: the brick street walls and gate towers are washed with light below
// the cornices; the concourse openings, the boards and the light towers' lamp
// banks glow as windows.
const floodBrick = (p: V3, n: V3) => (Math.abs(n[2]) > 0.5 ? 0 : p[2] < 30 ? 0.55 : 0.2)
const parts = [
  { part: brick, material: { ...finish('busch-brick', 0xb87262), floodlight: floodBrick } },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: steel, material: finish('busch-steel', 0x4f555c) },
  { part: seats, material: finish('busch-red-seats', 0xbd5558) },
  { part: glass, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (import.meta.main) {
  for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Busch Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    bearing: 63, osm: 'relation/2511955', height: TOP,
  })
  if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/stl-busch-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
