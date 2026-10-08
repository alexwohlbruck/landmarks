/**
 * The Big Apple Coaster (Manhattan Express, 1997), New York-New York, Las
 * Vegas: procedural, CC0-1.0.
 * bun generators/lv-big-apple-coaster.ts   (REPORT=1 for the element table)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame's origin
 * is lon -115.1745, lat 36.1021 (`origin`); the model's origin is the middle
 * of the track's footprint (see anchor), on the ground. The Strip is flat
 * here, so the terrain grid is level. Built with ./coaster-kit.ts.
 *
 * Plan: the OSM route relation 19531865, its twelve `roller_coaster=track`
 * ways in relation order and direction of travel (way/115662438 …
 * way/646113825), checked against a USGS NAIP orthophoto (public domain):
 * the west and south runs, the lift on the north-west diagonal and the
 * structure on the casino roof along the Strip all sit on the trace. The
 * chain starts where the track leaves the casino at its north wall, just
 * after the indoor station (node/9536189989), and is 1,333 m round in plan.
 *
 * Profile: a TOGO custom looper (RCDB 139; Wikipedia: 4,777 ft, 203 ft high,
 * a 144 ft drop, 67 mph, a vertical loop and a dive loop). The order is
 * Wikipedia's ride description, placed on the plan by its shape:
 *
 *   left 135° turn out of the station          s 0–48
 *   chain lift on the north-west diagonal      s 48–164, crest 62 m (203 ft)
 *   45° left over the top, first drop (76 ft) over the driveway, foot s 240
 *   hill curving left at the south-west corner, 54 m, s 300
 *   second drop (144 ft, 55°) along Tropicana, foot s 352
 *   hill in front of the tower (the big arch in every photo from the
 *     south-east), 40 m, s 410, then left over the corner onto the roof,
 *     passing 27–31 m up over the helix
 *   vertical loop on the casino roof, 24 m     s 560–600
 *   twist right into the dive loop, north end  s 615–685 (a 180° hand roll)
 *   mid-course brakes on the hill along the Strip side, s 705–760
 *   180° turn at the south end, airtime hill, 180° turn at the north end
 *   two airtime hills south, the 540° helix to the right, s 1046–1140,
 *     its stacked turns 5 m apart (its OSM turns are drawn 2 m tighter, so
 *     the helix clears the south hairpin)
 *   last airtime hill, final brakes, and indoors to the station
 *
 * Heights above the ground are published for the lift (203 ft) and the second
 * drop (144 ft); everything else is estimated from the photos below and from
 * the energy check: modelled track 1,389 m (published 1,456; OSM's plan is
 * simplified) and top speed 110 km/h (published 108). The casino roof under
 * the east half is 11 m up, and every stretch over it is kept above 13 m.
 *
 * Photos (Wikimedia Commons): "New York New York Hotel and Casino in Las
 * Vegas" (Jbro1186, CC BY-SA 4.0), "Las Vegas New York New York 2013"
 * (Tuxyso, CC BY-SA 3.0), "The Roller Coaster of New York New York and
 * Excalibur" and "New York New York in Las Vegas and its roller coaster"
 * (Supercarwaar, CC BY-SA 4.0), "Big Apple Coaster 1" and "2" (Jeremy
 * Thompson, CC BY 2.0), "New York New York Las Vegas December 2013" (King of
 * Hearts, CC BY-SA 3.0).
 *
 * Style: red track and spine as one swept ribbon (the photos' crimson, pulled
 * to the palette's lightness), on cream columns and A-frames. The station is
 * indoors, so its canopy sits hidden under the casino roof of
 * lv-new-york-new-york, which draws the building the track runs over.
 */
import { buildCoaster } from './coaster-kit'

// The OSM circuit in the park frame, in the direction of travel.
const CHAIN: [number, number][] = [
  [19.5, 115.6], [19.3, 117.7], [16.0, 120.4], [-22.4, 120.9], [-24.9, 120.1], [-107.4, 37.3], [-138.6, 6.4], [-142.0, -0.9],
  [-145.1, -14.8], [-144.2, -74.4], [-141.4, -82.2], [-138.7, -86.8], [-131.4, -90.4], [-127.4, -91.4], [-122.4, -92.2], [11.5, -92.8],
  [22.3, -90.6], [34.2, -86.2], [37.4, -84.5], [43.7, -80.7], [51.0, -73.8], [61.8, -59.9], [64.3, -52.0], [64.0, -38.0],
  [60.8, -17.5], [60.0, -13.8], [59.5, -8.8], [52.0, 52.1], [53.8, 59.6], [57.7, 64.0], [64.9, 64.7], [70.4, 61.5],
  [73.7, 55.0], [73.7, 23.6], [76.8, -54.1], [75.0, -62.2], [67.3, -66.5], [60.8, -65.5], [54.8, -63.6], [50.9, -58.7],
  [48.6, -51.1], [48.8, -43.2], [46.5, 11.1], [45.8, 21.9], [41.5, 43.0], [41.2, 49.0], [42.9, 56.9], [52.3, 60.5],
  [59.6, 56.7], [64.1, 44.0], [64.1, 27.9], [63.9, 4.4], [64.9, -20.0], [70.5, -38.2], [70.2, -52.8], [70.6, -57.3],
  [68.6, -60.6], [65.6, -61.9], [62.8, -62.1], [59.2, -61.8], [56.1, -59.9], [54.6, -57.1], [55.4, -51.0], [59.5, -47.6],
  [63.3, -46.9], [67.5, -48.7], [70.2, -52.8], [70.6, -57.3], [68.6, -60.6], [65.6, -61.9], [62.8, -62.1], [57.1, -60.3],
  [54.5, -57.9], [51.8, -47.1], [51.8, -38.2], [51.1, 39.6], [50.4, 43.2], [48.6, 46.0], [33.0, 61.7], [21.0, 73.8],
  [19.3, 76.9], [18.8, 80.4],
]

await buildCoaster({
  name: 'Big Apple Coaster',
  out: '../models/lv-big-apple-coaster.glb',
  origin: [-115.1745, 36.1021],
  chain: CHAIN,
  anchor: [-34, 14],
  ground: { x0: -200, y0: -200, step: 200, rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], base: 625 },
  profile: [
    { name: 'leaving the station', s: 0, z: 8 },
    { name: 'foot of the lift', s: 50, z: 9, r: 15 },
    { name: 'lift crest (203 ft)', s: 166, z: 62, r: 20 },
    { name: 'pre-drop, 45° left', s: 196, z: 59, r: 25 },
    { name: 'first drop (76 ft), foot', s: 240, z: 38 },
    { name: 'hill at the south-west corner', s: 300, z: 54, r: 18, pitch: 55 },
    { name: 'second drop (144 ft), foot', s: 352, z: 12, r: 30 },
    { name: 'hill in front of the tower', s: 410, z: 40 },
    { name: 'over the corner, above the helix', s: 485, z: 31 },
    { name: 'onto the roof, above the helix', s: 530, z: 27 },
    { name: 'vertical loop, in', s: 560, z: 18 },
    { name: 'vertical loop, out', s: 600, z: 18 },
    { name: 'dive loop, top', s: 650, z: 36 },
    { name: 'dive loop, out', s: 686, z: 18 },
    { name: 'mid-course brakes', s: 708, z: 28 },
    { name: 'mid-course brakes, out', s: 760, z: 28 },
    { name: '180° turn at the south end', s: 795, z: 17 },
    { name: 'airtime hill', s: 860, z: 25 },
    { name: '180° turn at the north end', s: 925, z: 17 },
    { name: 'valley', s: 962, z: 15 },
    { name: 'airtime hill', s: 980, z: 21 },
    { name: 'valley', s: 997, z: 15 },
    { name: 'airtime hill', s: 1014, z: 20 },
    { name: 'helix, in', s: 1046, z: 23 },
    { name: 'helix, upper turn', s: 1062, z: 22.6, r: 60 },
    { name: 'helix, lower turn', s: 1110, z: 16.6, r: 60 },
    { name: 'helix, out', s: 1140, z: 13 },
    { name: 'last airtime hill', s: 1172, z: 18 },
    { name: 'final brakes', s: 1196, z: 14 },
    { name: 'into the casino', s: 1230, z: 13 },
    { name: 'station', s: 1259, z: 8 },
  ],
  lift: [50, 166],
  brakes: [
    { from: 708, to: 760, z: 28, head: 1.5 },
    { from: 1196, to: 50, z: 8, head: 0.5 },
  ],
  inversions: [
    { kind: 'loop', name: 'vertical loop', from: 560, to: 600, height: 24, rTop: 5, offset: 3 },
  ],
  // The dive loop drawn as OSM draws it, a hairpin, rolled over the top.
  rolls: [{ from: 641, to: 662, deg: 180, ease: 18, name: 'dive loop' }],
  losses: [0.01, 0.0004],
  track: { W: 3.0, RAIL: 0.6, DEPTH: 1.8, SPINE: 1.3 }, // drawn bolder than life so it reads at map scale
  // Indoors, under the casino roof (11 m): hidden, but the kit needs one.
  station: { ring: [[28, 58], [38, 66], [26, 78], [16, 70]], posts: [], roofZ: 9 },
  colours: { deck: ['bac-red', 0xc0424a], spine: 'deck', supports: ['bac-cream', 0xeadcc0] },
  supportR: [0.75, 0.9, 1.05],
  meta: { height: 62, trackLength: 1456 },
})
