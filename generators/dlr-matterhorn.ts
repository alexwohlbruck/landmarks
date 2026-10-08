/**
 * Matterhorn Bobsleds, Disneyland Park, Anaheim: procedural, CC0-1.0.
 *   bun generators/dlr-matterhorn.ts
 *
 * Map frame: x east, y north, z up, metres. Geometry is written in a park
 * frame about (-117.9178511, 33.8130585) and shifted so the origin is the
 * centroid of the OSM outline; the script prints that anchor. Bearing 0.
 *
 * What the model is: the mountain (a rock-and-snow heightfield over the
 * outline, a steep four-ridged spire with the hooked summit, broken cliffs
 * round the foot), the dark cave mouths and three waterfalls, pines on the
 * lower ledges, and the bobsled track only where it runs in the open at the
 * foot: both run-outs past the splash pools to the station, the Tomorrowland
 * track's bridge over the Fantasyland one, and a short stretch on the east.
 *
 * Evidence
 * - OSM (measured): the outline way/107280556 (Matterhorn Bobsleds,
 *   building=yes, 55 x 72 m); the summit node/14081280525 (natural=peak);
 *   both circuits as route relations, relation/7751714 (Tomorrowland side)
 *   and relation/7751715 (Fantasyland side), whose ways are chained here in
 *   ride order, with tunnel/covered tags marking what is inside the rock.
 *   The building:parts' heights (25, 41.1, 45 m) are tiers, not contours:
 *   41 m over 850 m² cannot be true of a 45 m peak, so they are not used,
 *   except 122504263's 44.8056 m (147 ft) for the summit.
 * - Published: 147 ft (44.8 m), a 1:100 Matterhorn; lift 80 ft (24.4 m),
 *   track 2,037 and 2,134 ft, 27 mph (Wikipedia, RCDB 200). The 2012 repaint
 *   put more snow on the north side and left the base mostly bare
 *   (Wikipedia), which the snow rule follows.
 * - Photos (credits in the placement report): from the Tomorrowland monorail
 *   station (ESE) "Matterhorn - Disneyland 2012.jpg" and "Matterhorn in
 *   Disneyland.jpg" for the massing, the cliffs, caves and the long
 *   north-east ridge; Ken Lund's view from the Fun Wheel (SSW, far and
 *   elevated, the least foreshortened) for the spire's slope (about 65°)
 *   and the hook; "The Matterhorn (28171910666).jpg" (Fantasyland, WNW) and
 *   the Main Street view for the hook's direction (WSW); "Matterhorndisney.jpg"
 *   for the current colours (grey rock, white snow on the ledges).
 * - Estimated: the spire's profile and the shoulders (SW, W, E) from those
 *   photos; the short cliff at the foot (3 to 8 m, broken; the flanks above
 *   broaden steadily, so the shoulders are sloped, not a plateau); the low ground round the
 *   splash pools in the north lobe; the cave and waterfall positions; the
 *   track heights (an even descent from the 80 ft lift to the pools; the
 *   bridge raised to clear the other track). The hook is a separate block
 *   jutting about 3 m over the west-south-west face.
 * - Invented: the rock's crags (noise), the snow blotches, the trees' places.
 * - Track: drawn here, not with coaster-kit.ts. Nearly all of both circuits
 *   is inside the mountain; the kit sweeps a whole circuit, which would cost
 *   the budget for track nobody sees. Only open stretches under 5 m (and any
 *   under 12 m with less than 4.5 m of rock over them) are drawn, as a broad
 *   light steel ribbon on short posts, with the rock cut down round them. The L3/L4 ways on the
 *   north face are not tagged tunnel in OSM but lie well inside this rock
 *   surface, so they are left to the rock (seen in reality only through
 *   openings). All ways of both circuits go in `replaces`; the six
 *   service=siding ways do not.
 */
import { Part, addGltfTriangles, cross, len, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2
const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const plus = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const smoothstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }
const hash2 = (i: number, j: number) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s) }
/** Smooth value noise in [0, 1). */
function noise(x: number, y: number) {
  const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j
  const su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v)
  const a = hash2(i, j), b = hash2(i + 1, j), c = hash2(i, j + 1), d = hash2(i + 1, j + 1)
  return (a * (1 - su) + b * su) * (1 - sv) + (c * (1 - su) + d * su) * sv
}
/** Smooth maximum: blends two surfaces over a band `k` m wide. */
const smax = (a: number, b: number, k = 3) => { const h = clamp(0.5 + (a - b) / (2 * k)); return b + (a - b) * h + k * h * (1 - h) }
/** Unit vector in plan for a compass bearing (degrees clockwise from north). */
const compass = (deg: number): XY => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)]

// The park frame: equirectangular metres about the point the brief gives for
// way/107280556 (x east, y north).
const LON0 = -117.9178511, LAT0 = 33.8130585
const MX = 111320 * Math.cos((LAT0 * Math.PI) / 180), MY = 110574

// ------------------------------------------------------------------- OSM

/** way/107280556, "Matterhorn Bobsleds", building=yes: the mountain's outline (park frame). */
const OUTLINE: XY[] = [
  [23.4, -10.7], [24.6, -7.5], [25.2, -4.3], [26.5, 2.9], [27.5, 8.2], [27.9, 10.4], [26.6, 11.7], [23.8, 16.1],
  [21.3, 18.0], [19.6, 19.3], [13.4, 24.2], [13.9, 25.4], [14.8, 28.0], [16.3, 31.0], [10.2, 33.3], [10.6, 34.0],
  [10.5, 34.8], [8.1, 35.5], [7.2, 35.9], [6.7, 36.6], [5.6, 37.8], [5.0, 37.8], [4.7, 37.8], [3.8, 36.7],
  [3.2, 36.4], [1.9, 35.9], [-0.1, 35.1], [-0.4, 32.5], [-3.8, 32.0], [-2.5, 29.8], [-3.7, 29.0], [-4.7, 27.6],
  [-6.2, 25.6], [-8.6, 22.8], [-11.3, 20.5], [-14.8, 18.4], [-17.7, 18.0], [-18.5, 16.6], [-19.1, 16.6], [-19.9, 16.6],
  [-22.6, 14.8], [-24.1, 13.1], [-24.9, 10.0], [-25.0, 8.9], [-25.4, 4.8], [-25.5, 3.8], [-25.6, 3.2], [-26.4, -2.9],
  [-27.0, -11.1], [-27.0, -15.0], [-26.1, -17.8], [-24.9, -20.7], [-23.4, -22.8], [-20.8, -25.0], [-19.8, -25.8], [-18.9, -26.6],
  [-15.1, -28.6], [-10.0, -31.7], [-7.3, -31.4], [-3.7, -31.7], [0.2, -34.4], [4.2, -33.9], [7.8, -34.4], [10.3, -32.8],
  [13.0, -29.9], [13.9, -28.7], [15.5, -27.7], [16.2, -27.5], [17.6, -27.2], [18.1, -26.9], [19.6, -26.2], [20.6, -25.5],
  [20.5, -23.7], [19.6, -22.3], [18.9, -21.4], [17.9, -20.9], [17.1, -20.6], [18.1, -18.1], [19.6, -18.4], [20.5, -17.4],
  [20.9, -16.3], [21.2, -15.1], [22.7, -12.7],
]
/** The roller_coaster=track ways of both circuits (park frame, in the direction of travel). */
const WAYS: Record<number, XY[]> = {
  135568239: [[-7.3, 21.4], [-6.6, 22.9], [-3.7, 26.4], [-0.7, 28.8], [1.2, 30.0], [5.9, 31.0], [8.9, 30.4]],
  135568231: [[8.9, 30.4], [14.8, 28.0]],
  542182059: [[14.8, 28.0], [25.8, 24.2], [27.4, 23.1]],
  542182060: [
    [27.4, 23.1], [28.1, 20.8], [28.0, 19.6], [27.5, 18.0], [26.4, 16.4], [25.9, 15.3], [26.1, 13.6], [27.4, 12.9],
    [28.6, 12.9], [33.1, 17.7], [35.5, 23.2], [35.6, 23.5], [36.2, 26.4], [36.2, 27.7], [34.5, 29.8], [31.3, 31.0],
    [16.2, 36.6], [11.7, 38.4], [10.0, 38.7], [8.4, 37.9], [7.4, 37.3], [6.7, 36.6],
  ],
  542212418: [
    [6.7, 36.6], [5.4, 35.0], [5.2, 29.8], [2.6, 24.7], [0.8, 20.7], [-4.4, -16.6], [-4.2, -18.3], [-3.0, -19.6],
    [-1.5, -20.1], [0.0, -19.9], [9.2, -3.6], [8.6, 7.7], [8.4, 8.6], [8.0, 10.0], [7.2, 11.3], [5.7, 13.5],
    [4.9, 14.0], [4.0, 14.3], [2.7, 14.2],
  ],
  136148704: [
    [10.3, 14.9], [8.6, 16.8], [8.2, 17.1], [7.8, 17.4], [6.8, 17.9], [6.3, 18.1], [5.8, 18.2], [2.6, 18.2],
    [-1.0, 17.8], [-3.5, 16.7],
  ],
  542212425: [
    [-3.5, 16.7], [-8.2, 14.3], [-10.0, 10.6], [-11.4, 6.8], [-11.2, 3.2], [-8.3, -5.2], [-6.4, -9.0], [-6.1, -10.8],
    [-6.5, -11.9], [-7.3, -12.8], [-9.0, -14.9], [-11.9, -15.8], [-16.8, -15.7], [-18.8, -14.2], [-20.1, -12.4], [-20.4, -6.4],
    [-18.8, -0.1], [-17.0, 4.2], [-15.1, 11.0], [-9.9, 15.5], [-1.0, 19.9], [5.4, 20.1], [6.2, 20.0], [6.8, 19.8],
    [9.6, 18.6], [11.3, 17.5],
  ],
  136148706: [
    [-4.3, -27.5], [-8.7, -27.0], [-9.1, -26.9], [-9.4, -26.8], [-11.2, -26.2], [-13.4, -25.2], [-14.1, -24.9], [-14.8, -24.5],
    [-15.5, -24.0], [-16.1, -23.5], [-18.9, -20.9], [-19.2, -20.5], [-19.6, -20.1], [-21.2, -17.5], [-22.7, -14.1], [-23.1, -10.7],
    [-22.1, 7.6], [-21.1, 10.4],
  ],
  542212430: [[-21.1, 10.4], [-19.0, 13.9], [-16.0, 16.4], [-9.3, 19.5], [-7.3, 21.4]],
  542212421: [
    [-5.5, 10.3], [-6.2, 8.6], [-6.5, 6.1], [-5.5, 4.5], [-4.2, 3.5], [4.9, 1.1], [6.4, 0.0], [7.4, -0.8],
    [8.0, -2.6], [7.8, -4.0], [7.0, -5.1], [6.3, -6.5], [5.2, -8.5], [3.2, -10.0], [1.3, -10.1], [-1.3, -10.0],
    [-4.2, -9.7], [-6.5, -8.4], [-8.5, -5.7], [-10.5, -4.7], [-11.8, -4.2], [-14.0, -4.7], [-15.3, -6.5], [-15.4, -8.5],
    [-15.3, -11.4], [-15.0, -17.5], [-13.9, -19.0], [-12.6, -20.1], [-11.3, -20.8], [-10.0, -21.2], [-7.0, -19.4], [-5.5, -18.6],
    [-4.1, -16.6], [-3.1, -15.6], [-1.3, -14.8], [0.7, -15.2], [2.4, -16.6], [2.8, -18.5], [2.1, -20.6], [0.6, -22.1],
    [-1.4, -22.8], [-3.4, -22.6], [-4.8, -21.7], [-6.0, -20.3], [-7.0, -19.4], [-11.4, -14.7], [-15.3, -11.4], [-16.6, -10.2],
    [-17.1, -8.5], [-16.8, -6.7], [-16.4, -5.5], [-15.7, -4.6], [-14.8, -3.7], [-10.7, -1.5], [-8.6, -1.1], [-6.6, -1.3],
    [-5.6, -1.7], [0.9, -5.5], [3.0, -6.4], [5.2, -6.4], [6.3, -6.5], [7.0, -6.5], [8.9, -6.2], [10.2, -5.0],
    [11.3, -3.9], [12.1, -2.6], [13.1, -0.6], [13.6, 1.2], [12.9, 7.9], [10.3, 14.9],
  ],
  542212428: [[10.5, -26.4], [8.9, -26.9], [7.4, -27.3], [4.3, -27.8], [-1.6, -27.9], [-4.3, -27.5]],
  136148703: [[12.5, -24.5], [10.5, -26.4]],
  136148701: [[16.4, -16.2], [14.9, -20.9], [12.5, -24.5]],
  135568234: [
    [11.3, 17.5], [15.8, 14.9], [18.2, 12.9], [19.4, 11.0], [19.4, 7.9], [16.8, 0.2], [15.8, -2.8], [15.9, -8.1],
    [16.3, -12.7], [16.4, -16.2],
  ],
  136148698: [[2.7, 14.2], [1.4, 14.0], [-2.0, 13.0], [-3.4, 12.3], [-4.7, 11.4], [-5.5, 10.3]],
  135935730: [
    [24.1, 4.3], [24.6, 7.8], [23.5, 13.3], [19.9, 17.2], [12.4, 21.9], [8.7, 24.5], [7.1, 26.7], [3.9, 29.8],
    [-1.5, 29.8], [-4.7, 27.6],
  ],
  542212409: [[22.5, -6.1], [24.1, 4.3]],
  542182061: [[-4.7, 27.6], [-7.3, 26.3], [-12.3, 23.8], [-16.1, 21.5], [-17.4, 20.6], [-18.2, 19.6], [-18.7, 18.0], [-19.1, 16.6]],
  135568236: [[-19.1, 16.6], [-20.9, 12.4], [-21.8, 9.7], [-23.4, 8.5], [-25.0, 8.9]],
  266075984: [
    [-25.0, 8.9], [-25.3, 9.7], [-25.4, 12.1], [-25.8, 19.8], [-26.0, 24.6], [-25.8, 26.9], [-24.5, 28.3], [-22.8, 29.8],
    [-18.8, 31.3], [-6.6, 35.7], [-1.1, 37.8], [0.0, 38.3], [1.6, 38.3], [2.8, 37.7], [3.8, 36.7],
  ],
  542212416: [[3.8, 36.7], [4.3, 34.8]],
  942638295: [[4.3, 34.8], [4.2, 31.0], [-0.7, 21.6], [-1.0, 19.9], [-6.1, -16.7]],
  542212395: [
    [-6.1, -16.7], [-6.5, -17.3], [-7.1, -17.7], [-8.3, -18.6], [-9.6, -18.9], [-10.1, -18.8], [-10.6, -18.6], [-12.1, -17.3],
    [-12.5, -16.4], [-12.9, -15.1], [-12.9, -8.5], [-13.0, -4.0], [-13.0, -2.9], [-12.6, -1.3], [-8.6, 6.0], [-7.4, 7.2],
    [-5.2, 7.5], [-3.6, 7.3], [-2.7, 6.2], [-0.8, 3.8], [1.4, -0.1], [2.4, -1.0], [3.8, -1.7], [4.9, -1.6],
    [6.0, -1.1], [6.8, -0.6], [7.3, 0.0], [7.7, 1.1], [7.8, 3.6], [5.9, 7.5], [3.2, 11.1],
  ],
  942638294: [
    [3.2, 11.1], [1.7, 11.5], [0.5, 11.5], [-0.7, 11.0], [-1.7, 10.6], [-3.0, 8.9], [-3.4, 8.1], [-3.7, 6.3],
    [-3.5, 5.6], [-2.5, 3.8], [-1.2, 3.2], [1.8, 2.6], [4.5, 2.6], [6.8, 3.5], [8.6, 5.0], [9.5, 6.6],
    [9.9, 8.4], [9.1, 10.3], [7.7, 11.9], [4.0, 12.8], [1.4, 12.7],
  ],
  542212399: [
    [-4.0, 9.9], [-12.7, -14.1], [-12.9, -15.1], [-12.9, -16.1], [-13.1, -18.2], [-12.7, -19.1], [-12.2, -19.7], [-10.8, -19.8],
    [-4.8, -14.0], [-2.2, -13.1], [0.5, -13.0], [3.5, -14.1], [4.9, -15.9], [5.5, -17.9],
  ],
  942638293: [
    [5.5, -17.9], [5.5, -20.2], [4.8, -22.3], [3.4, -24.0], [1.0, -24.7], [-0.8, -24.9], [-2.8, -25.2], [-5.0, -24.7],
    [-6.5, -23.4], [-14.4, -16.1], [-16.9, -13.6],
  ],
  542212401: [
    [-17.7, -3.9], [-15.5, -0.7], [-12.8, 0.3], [-8.9, 0.6], [-2.7, -1.0], [-0.8, -2.4], [2.4, -3.2], [4.7, -2.7],
    [8.0, -0.9], [9.7, 3.1], [10.4, 5.5], [10.5, 5.8], [10.5, 6.1], [10.7, 9.4], [10.7, 9.7], [10.5, 10.1],
    [8.7, 13.6],
  ],
  542184358: [[8.7, 13.6], [7.0, 14.9], [5.1, 15.6], [3.4, 16.0], [2.0, 15.9], [0.5, 15.6], [-1.3, 14.8], [-2.9, 13.9]],
  542212404: [
    [-2.9, 13.9], [-6.5, 12.2], [-6.9, 11.9], [-7.2, 11.5], [-9.4, 7.9], [-10.7, 5.4], [-12.6, 2.8], [-15.5, 0.8],
    [-17.0, 1.1], [-18.2, 2.1],
  ],
  542212406: [[-12.4, 15.3], [-5.1, 20.0], [-2.7, 21.6], [3.4, 22.0], [7.4, 20.7]],
  135568240: [
    [7.4, 20.7], [10.1, 19.8], [14.8, 17.7], [17.7, 15.8], [18.3, 15.4], [18.7, 14.9], [21.0, 11.7], [21.2, 11.2],
    [21.4, 10.5], [21.8, 7.8], [21.4, 5.3], [19.7, 1.6], [18.4, -1.3],
  ],
  542212414: [
    [18.4, -1.3], [14.2, -5.3], [10.0, -7.2], [7.0, -11.0], [6.5, -15.1], [6.0, -22.7], [4.5, -26.0], [2.9, -27.5],
    [0.7, -28.4], [-2.3, -28.9], [-7.5, -28.4],
  ],
  542212411: [
    [-23.4, -20.2], [-25.4, -16.7], [-25.7, -14.4], [-25.7, -12.5], [-25.1, -10.7], [-22.3, -6.2], [-21.7, -5.6], [-21.2, -5.1],
    [-19.1, -3.8], [-13.0, -2.9], [-7.3, -4.8], [-2.7, -7.6], [4.6, -12.8], [5.0, -13.0], [5.4, -13.1], [11.8, -14.4],
    [18.0, -13.8],
  ],
  136148700: [[-16.9, -13.6], [-17.6, -11.6], [-18.0, -9.6], [-18.1, -6.4], [-17.7, -3.9]],
  136148697: [[-7.5, -28.4], [-10.6, -28.4], [-14.5, -27.4], [-18.9, -24.0], [-23.4, -20.2]],
  136148702: [[1.4, 12.7], [-0.7, 12.4], [-2.1, 11.8], [-4.0, 9.9]],
  136148705: [[-18.2, 2.1], [-19.9, 5.6], [-19.9, 8.0], [-19.2, 9.7], [-16.6, 12.3], [-12.4, 15.3]],
  135568227: [[18.0, -13.8], [18.6, -13.3], [19.2, -12.8], [20.5, -11.3], [22.0, -8.9], [22.5, -6.1]],
}

/** natural=peak node/14081280525 "Matterhorn Mountain"; the summit. */
const PEAK: XY = [0.2, -0.9]
const SUMMIT = 44.8 // 147 ft, published; OSM way/122504263 height=44.8056

/**
 * The two circuits in ride order, from the station on the north side. Every
 * way is listed (all of them go in `replaces`); `profile` is the height of
 * the rails above the ground against metres of OSM polyline from the station:
 * the chain lift to 80 ft (published), then an even descent to the splash
 * pool, which is how a bobsled run coasts down. Only the ways not tagged
 * tunnel/covered are candidates for drawing.
 */
const TRACKS: { name: string; ways: number[]; profile: [number, number][] }[] = [
  {
    // relation/7751714
    name: 'Tomorrowland track',
    ways: [542212418, 136148698, 542212421, 136148704, 542212425, 135568234, 136148701, 136148703, 542212428, 136148706, 542212430,
      135568239, 135568231, 542182059, 542182060],
    profile: [[0, 1.2], [101, 24.4], [500, 6.5], [528, 4.6], [545, 4.2], [552, 1.8], [557, 1.2], [700, 1.2]],
  },
  {
    // relation/7751715
    name: 'Fantasyland track',
    ways: [542212416, 942638295, 542212395, 942638294, 136148702, 542212399, 942638293, 136148700, 542212401, 542184358, 542212404,
      136148705, 542212406, 135568240, 542212414, 136148697, 542212411, 135568227, 542212409, 135935730, 542182061, 135568236, 266075984],
    profile: [[0, 1.2], [55, 24.4], [552, 3.2], [575, 1.4], [596, 1.2], [700, 1.2]],
  },
]
const TUNNEL = new Set([542212418, 542212421, 542212425, 542212428, 136148706, 542212430, 542212416, 942638295, 542212395, 942638294,
  542212399, 942638293, 542212401, 542212404, 542212406, 542212414, 542212411, 542212409, 135568236])

// ------------------------------------------------------------- the frame

const area = (p: XY[]) => p.reduce((s, [x0, y0], i) => { const [x1, y1] = p[(i + 1) % p.length]; return s + x0 * y1 - x1 * y0 }, 0) / 2
const polyCentroid = (p: XY[]) => {
  let a = 0, cx = 0, cy = 0
  for (let i = 0; i < p.length; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length], c = x0 * y1 - x1 * y0
    a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
  }
  return [cx / (3 * a), cy / (3 * a)] as XY
}
const OUT = area(OUTLINE) < 0 ? [...OUTLINE].reverse() : OUTLINE
const [AX, AY] = polyCentroid(OUT)

/** Distance from a point to the outline, positive inside. */
function inside(x: number, y: number) {
  let c = false, d = Infinity
  for (let i = 0; i < OUT.length; i++) {
    const [x0, y0] = OUT[i], [x1, y1] = OUT[(i + 1) % OUT.length]
    if ((y0 > y) !== (y1 > y) && x < x0 + ((y - y0) / (y1 - y0)) * (x1 - x0)) c = !c
    const ex = x1 - x0, ey = y1 - y0, t = clamp(((x - x0) * ex + (y - y0) * ey) / (ex * ex + ey * ey))
    d = Math.min(d, Math.hypot(x - x0 - t * ex, y - y0 - t * ey))
  }
  return c ? d : -d
}

// --------------------------------------------------------- the mountain

/** A ridge: a crest line from `a` to `b` (park frame, with heights) whose flanks fall at `flank` m per m. */
type Ridge = { a: [number, number, number]; b: [number, number, number]; flank: number }
function ridgeZ(r: Ridge, x: number, y: number) {
  const [x0, y0, z0] = r.a, [x1, y1, z1] = r.b
  const ex = x1 - x0, ey = y1 - y0, t = clamp(((x - x0) * ex + (y - y0) * ey) / (ex * ex + ey * ey))
  const d = Math.hypot(x - x0 - t * ex, y - y0 - t * ey)
  return z0 + (z1 - z0) * t - r.flank * d
}
/** A plateau: a lumpy table at `z`, radius `r`, falling at `fall` m per m beyond it. */
type Table = { x: number; y: number; z: number; r: number; fall: number }
const tableZ = (p: Table, x: number, y: number) => p.z - p.fall * Math.max(0, Math.hypot(x - p.x, y - p.y) - p.r)

// The summit's hook: the top leans out to the west-south-west, over a sheer
// face (photos: from Main Street and the Fun Wheel the summit overhangs to
// the left, from Fantasyland to the right, from the monorail station it is
// seen end-on).
const HOOK = compass(250)
const RIDGES: Ridge[] = [
  // The long north-east ridge, the one every photo from Tomorrowland shows
  // falling to the right of the summit.
  { a: [PEAK[0] + 3, PEAK[1] + 3, 39], b: [17, 15, 19], flank: 1.5 },
  { a: [17, 15, 19], b: [21, 20, 9], flank: 1.5 },
]
const TABLES: Table[] = [
  // The shoulder south-west of the peak (left of the summit from the
  // monorail station, right of it from Fantasyland).
  { x: -13, y: -15, z: 18, r: 1.5, fall: 1.2 },
  // The west shoulder.
  { x: -16, y: 1, z: 15, r: 1.5, fall: 1.2 },
  // The east shoulder, over Tomorrowland.
  { x: 13, y: -11, z: 17, r: 1.5, fall: 1.2 },
]

/** Height of the cliff tops along the outline: tall broken columns, low round the north lobe (the splash pools). */
/** How far into the low ground round the splash pools a point is: the north lobe and the north-west corner, where the run-outs pass. */
const lowland = (x: number, y: number) => clamp(smoothstep(16, 25, y) + smoothstep(6, 13, y) * smoothstep(-13, -20, x))
function rimZ(x: number, y: number) {
  const north = lowland(x, y)
  const col = noise(x * 0.11 + 4, y * 0.11) * 0.7 + noise(x * 0.4, y * 0.4 + 2) * 0.3
  return (3 + 5 * col) * (1 - 0.6 * north)
}

/**
 * The spire's fall against ridged distance from its axis: a blunt knob on
 * top, then about 67° for the first 18 m down (the Fun Wheel photo, the least
 * foreshortened), easing to 60° and then 47° down to a short cliff at the foot, so
 * the whole is one broadening pyramid towards the base.
 */
const fall = (rd: number) =>
  rd < 2.2 ? 0.45 * rd : rd < 9.5 ? 1 + 2.35 * (rd - 2.2) : rd < 15 ? 18.2 + 1.7 * (rd - 9.5) : 27.6 + 1.08 * (rd - 15)

/** Height of the rock and snow above the ground. */
function heightAt(x: number, y: number) {
  const d = Math.max(0, inside(x, y))
  // The spire: a four-sided pyramid with its ridges to the NE, NW, SW and SE
  // (the real mountain's Hörnli, Zmutt, Lion and Furggen ridges). Its axis
  // stands a little east-north-east of the summit, so the top overhangs to
  // the west-south-west over a sheer face: the hook.
  const cx = PEAK[0] - HOOK[0] * 1.2, cy = PEAK[1] - HOOK[1] * 1.2
  const dx = x - cx, dy = y - cy
  const u = (dx + dy) / Math.SQRT2, v = (-dx + dy) / Math.SQRT2
  const r = Math.hypot(dx, dy)
  const rd = 0.4 * r + 0.6 * (Math.abs(u) + Math.abs(v)) / Math.SQRT2
  const hookward = clamp((dx * HOOK[0] + dy * HOOK[1]) / (r || 1), 0, 1)
  const sheer = hookward * hookward * smoothstep(8, 3, rd)
  const crag = 3.6 * (noise(x * 0.22 + 5, y * 0.22) - 0.5) + 2.2 * (noise(x * 0.55, y * 0.55 + 7) - 0.5)
  let z = SUMMIT - fall(rd) * (1 + 0.7 * sheer) + crag * smoothstep(2, 9, rd)
  // The base: cliffs round the outline, rising a little inwards.
  const base = rimZ(x, y) + 1.5 * smoothstep(0, 6, d) * (1 - lowland(x, y)) + crag * 0.5 * (1 - 0.6 * lowland(x, y))
  z = smax(z, base, 2.5)
  for (const g of RIDGES) z = smax(z, ridgeZ(g, x, y) + crag * 0.5, 2.5)
  for (const t of TABLES) z = smax(z, tableZ(t, x, y) + crag * 0.6, 2.5)
  return z
}

// ------------------------------------------------------------ the track

/** A way's polyline, its length and its s along its circuit. */
type Run = { id: number; pts: XY[]; s0: number; s1: number; zAt: (s: number) => number }
const RUNS: Run[] = []
for (const t of TRACKS) {
  let s = 0
  const zAt = (q: number) => {
    const p = t.profile
    for (let i = 0; i < p.length - 1; i++) if (q <= p[i + 1][0]) return p[i][1] + ((p[i + 1][1] - p[i][1]) * (q - p[i][0])) / (p[i + 1][0] - p[i][0])
    return p[p.length - 1][1]
  }
  for (const id of t.ways) {
    const pts = WAYS[id]
    let L = 0
    for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    RUNS.push({ id, pts, s0: s, s1: s + L, zAt })
    s += L
  }
}

/** The open-air runs, resampled about every 2.5 m with heights: [x, y, z] in the park frame. */
const OPEN = RUNS.filter((r) => !TUNNEL.has(r.id)).map((r) => {
  const out: V3[] = []
  let s = r.s0
  for (let i = 0; i < r.pts.length - 1; i++) {
    const [x0, y0] = r.pts[i], [x1, y1] = r.pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0)
    const n = Math.max(1, Math.round(L / 2.5))
    for (let k = 0; k < n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n, r.zAt(s + (L * k) / n)])
    s += L
  }
  const e = r.pts[r.pts.length - 1]
  out.push([e[0], e[1], r.zAt(r.s1)])
  return { id: r.id, pts: out }
})
/**
 * A run is drawn where it is open to the sky: where the rock over it would
 * be no more than a few metres deep, the groove is carved and the track laid
 * in it; deeper than that it is behind the mountain's skin, seen only through
 * openings, and left to the rock.
 */
// The runs at the foot (under 5 m: the run-outs past the splash pools to the
// station) are always open: the rock round them is cut down to the track.
const DRAWN = OPEN.filter((r) => r.pts.every(([x, y, z]) => z < 5 || (z < 12 && (inside(x, y) < 0 || heightAt(x, y) - z < 4.5))))

/** The drawn track carves a groove where it crosses the rock, so it never sinks in. */
function carved(x: number, y: number, z: number) {
  for (const run of DRAWN)
    for (let i = 0; i < run.pts.length - 1; i++) {
      const [x0, y0, z0] = run.pts[i], [x1, y1, z1] = run.pts[i + 1]
      const ex = x1 - x0, ey = y1 - y0, t = clamp(((x - x0) * ex + (y - y0) * ey) / (ex * ex + ey * ey))
      const dist = Math.hypot(x - x0 - t * ex, y - y0 - t * ey)
      const zt = z0 + (z1 - z0) * t - 0.9
      if (dist < 8) z = Math.min(z, zt + Math.max(0, dist - 1.8) * 2.2)
    }
  return Math.max(z, 0)
}
const H = (x: number, y: number) => carved(x, y, heightAt(x, y))

// ------------------------------------------------------------- the mesh

const rock = new Part(), snow = new Part(), pine = new Part(), track = new Part(), water = new Part(), cave = new Part()
const posts = track
const L = (v: V3): V3 => [v[0] - AX, v[1] - AY, v[2]]

function smooth(target: Part, tris: V3[][], crease = 40) {
  const p = new Part()
  for (const [a, b, c] of tris) p.tri(L(a), L(b), L(c))
  addGltfTriangles(target, new Float32Array(p.pos), Uint32Array.from({ length: p.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
}

const N = 92
const per: number[] = [0]
for (let i = 0; i < OUT.length; i++) per.push(per[i] + Math.hypot(OUT[(i + 1) % OUT.length][0] - OUT[i][0], OUT[(i + 1) % OUT.length][1] - OUT[i][1]))
const total = per[OUT.length]
const edge: XY[] = Array.from({ length: N }, (_, k) => {
  const s = (k / N) * total
  let i = 0
  while (per[i + 1] < s) i++
  const t = (s - per[i]) / (per[i + 1] - per[i]), a = OUT[i], b = OUT[(i + 1) % OUT.length]
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
})
// Keep the outline's sharp corners: move each to its nearest sample.
for (const c of OUT) {
  let best = 0
  edge.forEach((e, k) => { if (Math.hypot(e[0] - c[0], e[1] - c[1]) < Math.hypot(edge[best][0] - c[0], edge[best][1] - c[1])) best = k })
  if (Math.hypot(edge[best][0] - c[0], edge[best][1] - c[1]) < 1.6) edge[best] = c
}
const C = PEAK
const TS = [0.985, 0.95, 0.91, 0.865, 0.815, 0.76, 0.705, 0.65, 0.595, 0.54, 0.485, 0.43, 0.38, 0.33, 0.28, 0.235, 0.19, 0.15, 0.11, 0.075, 0.04]
const ringXY = (t: number): XY[] => edge.map(([x, y]) => [C[0] + (x - C[0]) * t, C[1] + (y - C[1]) * t])
const rings: V3[][] = TS.map((t) => ringXY(t).map(([x, y]): V3 => [x, y, H(x, y)]))
const apex: V3 = [C[0] + HOOK[0] * 0.6, C[1] + HOOK[1] * 0.6, SUMMIT]

/**
 * Snow: blotches lying on the ledges, thickest on the upper slopes, lower on
 * the north side (the 2012 repaint) and sparse on the base, never on the
 * sheerest faces.
 */
function isSnow(a: V3, b: V3, c: V3) {
  const n = unit(cross(sub(b, a), sub(c, a)))
  const x = (a[0] + b[0] + c[0]) / 3, y = (a[1] + b[1] + c[1]) / 3, z = (a[2] + b[2] + c[2]) / 3
  const northness = (y - PEAK[1]) / (Math.hypot(x - PEAK[0], y - PEAK[1]) || 1)
  // Ledges: patches long round the mountain and short up it, so the snow
  // lies in broken horizontal bands, as on every photo.
  const ang = Math.atan2(y - PEAK[1], x - PEAK[0])
  const ledge = noise(z * 0.55 + 3, ang * 4.5) * 0.6 + noise(x * 0.5, y * 0.5 + z * 0.3) * 0.4
  // About half the upper two-thirds, thinning on the shoulders and the foot;
  // never a solid cap.
  const cover = 0.12 + 0.43 * smoothstep(6, 26, z + 4 * northness) - 0.06 * smoothstep(38, 44, z)
  return ledge < cover && n[2] > 0.3 + 0.12 * (noise(x * 0.7 + 3, y * 0.7) - 0.5)
}
const snowTris: V3[][] = [], rockTris: V3[][] = []
const tri = (a: V3, b: V3, c: V3) => (isSnow(a, b, c) ? snowTris : rockTris).push([a, b, c])
for (let i = 0; i < rings.length - 1; i++)
  for (let k = 0; k < N; k++) {
    const j = (k + 1) % N, a = rings[i][k], b = rings[i][j], c = rings[i + 1][j], d = rings[i + 1][k]
    // Split each quad along its shorter diagonal, so ridges stay sharp.
    if (len(sub(a, c)) < len(sub(b, d))) { tri(a, b, c); tri(a, c, d) } else { tri(a, b, d); tri(b, c, d) }
  }
const last = rings[rings.length - 1]
for (let k = 0; k < N; k++) tri(last[k], last[(k + 1) % N], apex)
// The hook: the summit block juts out over the sheer west-south-west face,
// its underside cut back to the face (the photos from Main Street, the Fun
// Wheel and Fantasyland). A closed block, its root buried in the spire.
{
  const side: XY = [-HOOK[1], HOOK[0]]
  const sec = (t: number, w: number, z0: number, z1: number, lean = 0): V3[] => {
    const cx = PEAK[0] + HOOK[0] * t, cy = PEAK[1] + HOOK[1] * t
    const o = (s: number, z: number, dt = 0): V3 => [cx + side[0] * s + HOOK[0] * dt, cy + side[1] * s + HOOK[1] * dt, z]
    // Counter-clockwise seen from the tip: bottom-left, bottom-right, top-right, top-left.
    return [o(-w / 2, z0, -lean), o(w / 2, z0, -lean), o(w / 2 * 0.8, z1), o(-w / 2 * 0.8, z1)]
  }
  const rs = [sec(-2.5, 5, 37, 44.6), sec(0.6, 4.4, 39.5, 44.8), sec(2.2, 3.2, 41.6, 44.3, 0.8), sec(3, 1.8, 42.8, 43.8, 0.6)]
  for (let r = 0; r < rs.length - 1; r++)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      tri(rs[r][j], rs[r][i], rs[r + 1][i]); tri(rs[r][j], rs[r + 1][i], rs[r + 1][j])
    }
  const tip = rs[rs.length - 1]
  tri(tip[0], tip[1], tip[2]); tri(tip[0], tip[2], tip[3])
}
smooth(snow, snowTris, 38)
// The cliffs: from the ground to the rim, every other column standing proud
// (the vertical rock pillars round the base in every photo).
{
  const top = rings[0]
  const at = (k: number, t: number, z: number): V3 => {
    const [x, y] = edge[k]
    return [C[0] + (x - C[0]) * t, C[1] + (y - C[1]) * t, z]
  }
  const rib = (k: number) => (k % 2 ? 0.02 : 0) + 0.012 * hash2(k, 7)
  const foot = edge.map((_, k): V3 => at(k, 1, -0.3))
  const low = edge.map((_, k): V3 => at(k, 0.998 - rib(k), top[k][2] * 0.35))
  const mid = edge.map((_, k): V3 => at(k, 0.992 - rib(k) * 1.2, top[k][2] * 0.7))
  const wall: V3[][] = []
  const rr = [foot, low, mid, top]
  for (let r = 0; r < rr.length - 1; r++)
    for (let k = 0; k < N; k++) {
      const j = (k + 1) % N
      wall.push([rr[r][k], rr[r][j], rr[r + 1][j]], [rr[r][k], rr[r + 1][j], rr[r + 1][k]])
    }
  smooth(rock, [...rockTris, ...wall], 38)
}

// ------------------------------------------------------------ track parts

// A broad steel ribbon (the two rails, the ties and the sled's width read as
// one band at map scale) on short posts where it stands clear of the rock.
const W = 2.2, DEPTH = 0.45
for (const run of DRAWN) {
  const pts = run.pts
  let since = 99
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y, z] = pts[i]
    since += Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1])
    const under = inside(x, y) > 0 ? H(x, y) : 0
    if (since < 6 || z - DEPTH - under < 0.4) continue
    since = 0
    const r = 0.22, ring = (zz: number) => [[-r, -r], [r, -r], [r, r], [-r, r]].map(([a, b]): V3 => L([x + a, y + b, zz]))
    posts.loft([ring(under - 0.2), ring(z - DEPTH + 0.05)])
  }
  const sections = pts.map((c, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const fwd = unit(sub(b, a))
    const side = unit(cross(fwd, [0, 0, 1]))
    const o = (s: number, u: number): V3 => L(plus(c, plus(scale(side, s), [0, 0, u])))
    return [o(-W / 2, 0), o(W / 2, 0), o(W / 2, -DEPTH), o(-W / 2, -DEPTH)]
  })
  for (let k = 0; k < sections.length - 1; k++) {
    const r0 = sections[k], r1 = sections[k + 1]
    for (let i = 0; i < 3; i++) track.quad(r0[i + 1], r0[i], r1[i], r1[i + 1])
  }
}

// ------------------------------------------------- caves, falls, pines

/** The rock surface where it reaches height `z` on a bearing from the peak, and its outward normal. */
function surfaceAt(bearing: number, z: number) {
  const [ux, uy] = compass(bearing)
  let r = 0.5
  const Hs = (x: number, y: number) => (inside(x, y) < 0 ? 0 : H(x, y))
  while (r < 45 && Hs(PEAK[0] + ux * r, PEAK[1] + uy * r) > z) r += 0.1
  r -= 0.1
  const x = PEAK[0] + ux * r, y = PEAK[1] + uy * r
  const gx = (H(x + 0.8, y) - H(x - 0.8, y)) / 1.6, gy = (H(x, y + 0.8) - H(x, y - 0.8)) / 1.6
  return { p: [x, y, z] as V3, n: unit([-gx, -gy, 1]), out: [ux, uy] as XY }
}
/**
 * Dark cave mouths: the big openings on the Tomorrowland face (the old
 * Skyway holes and the bobsled portals; photos from the monorail station and
 * Tomorrowland Terrace), one each to the north-east and west. A dark slab
 * laid on the face, its back buried 2 m in the rock.
 */
const CAVES: [number, number, number, number][] = [
  // bearing°, height of the mouth's middle, width, height
  [100, 15, 3.4, 5], [122, 13, 3, 4.4], [140, 17, 2.6, 3.6], [82, 16, 2.8, 4], [45, 13, 2.6, 3.6],
]
for (const [b, z, w, h] of CAVES) {
  const { p, n } = surfaceAt(b, z)
  const right = unit(cross([0, 0, 1], n)), up = unit(cross(n, right))
  const ring: V3[] = []
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * Math.PI
    // An arch: straight jambs, a round head.
    const sx = Math.cos(a) * w / 2, sy = h / 2 - w / 2 + Math.sin(a) * w / 2
    ring.push(plus(p, plus(scale(right, sx), scale(up, sy))))
  }
  ring.push(plus(p, plus(scale(right, -w / 2), scale(up, -h / 2))), plus(p, plus(scale(right, w / 2), scale(up, -h / 2))))
  const front = ring.map((q) => L(plus(q, scale(n, 0.25)))), back = ring.map((q) => L(plus(q, scale(n, -2))))
  const m = front.length
  for (let i = 0; i < m; i++) { const j = (i + 1) % m; cave.quad(front[i], front[j], back[j], back[i]) }
  for (let i = 1; i < m - 1; i++) { cave.tri(front[0], front[i], front[i + 1]); cave.tri(front[0], front[i + 1], front[i]) }
}
/** Waterfalls down the cliffs: south-south-west and north-east (photos), white water in a strip. */
for (const [b, top] of [[205, 17], [38, 15], [128, 11]] as [number, number][]) {
  const steps = 6
  const pts = Array.from({ length: steps + 1 }, (_, i) => surfaceAt(b, Math.max(0.3, top * (1 - i / steps))))
  for (let i = 0; i < steps; i++) {
    const a = pts[i], c = pts[i + 1]
    const sa = unit(cross([0, 0, 1], a.n)), sc = unit(cross([0, 0, 1], c.n))
    const q = (s: typeof a, side: V3, k: number) => L(plus(plus(s.p, scale(s.n, 0.3)), scale(side, k)))
    water.quad(q(c, sc, -0.9), q(c, sc, 0.9), q(a, sa, 0.9), q(a, sa, -0.9))
  }
}
/**
 * Pines on the lower ledges, smaller higher up (Disney's forced
 * perspective): two stacked cones each.
 */
{
  const trees: XY[] = []
  for (let i = 0; i < 4000 && trees.length < 22; i++) {
    const x = -30 + 62 * hash2(i, 1), y = -36 + 76 * hash2(i, 2)
    const d = inside(x, y)
    if (d < 1.5 || d > 12) continue
    const z = H(x, y)
    const g = Math.hypot(H(x + 1, y) - H(x - 1, y), H(x, y + 1) - H(x, y - 1)) / 2
    if (z < 2 || z > 18 || g > 1.45 || trees.some(([tx, ty]) => Math.hypot(tx - x, ty - y) < 5)) continue
    if (DRAWN.some((r) => r.pts.some(([px, py]) => Math.hypot(px - x, py - y) < 3.5))) continue
    trees.push([x, y])
    const h = 7.5 - 0.18 * z
    const base = z - 0.6
    const cone = (r: number, z0: number, z1: number) => {
      const ring = Array.from({ length: 7 }, (_, k): V3 => {
        const a = (k / 7) * TAU + i
        return L([x + r * Math.cos(a), y + r * Math.sin(a), z0])
      })
      const tip = L([x, y, z1])
      for (let k = 0; k < 7; k++) pine.tri(ring[k], ring[(k + 1) % 7], tip)
      for (let k = 1; k < 6; k++) pine.tri(ring[0], ring[k + 1], ring[k])
    }
    cone(0.36 * h, base + 0.12 * h, base + 0.68 * h)
    cone(0.25 * h, base + 0.48 * h, base + h)
  }
}

// ---------------------------------------------------------------- output

const parts = [
  { part: rock, material: finish('matterhorn-rock', 0xaaa49c) },
  { part: snow, material: finish('matterhorn-snow', 0xf3f2ee) },
  { part: pine, material: finish('matterhorn-pine', 0x5e8268) },
  { part: track, material: finish('matterhorn-track', 0xb4b9be) },
  { part: cave, material: finish('matterhorn-cave', 0x4a4f57) },
  { part: water, material: finish('matterhorn-falls', 0xcfe4ee) },
].filter(({ part }) => part.triangles > 0)
const triangles = parts.reduce((sum, { part }) => sum + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
console.log('drawn runs:', DRAWN.map((r) => r.id).join(' '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Matterhorn Bobsleds', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: SUMMIT,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/dlr-matterhorn.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
console.log(`anchor ${(LON0 + AX / MX).toFixed(7)}, ${(LAT0 + AY / MY).toFixed(7)}`)
