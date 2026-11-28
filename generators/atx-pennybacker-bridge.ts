/**
 * Pennybacker Bridge (Loop 360 Bridge), Austin (1982; TxDOT) — procedural,
 * CC0-1.0, no textures.
 * bun generators/atx-pennybacker-bridge.ts
 *
 * A weathering-steel through arch carrying Loop 360 (Capital of Texas
 * Highway) over Lake Austin, with no pier in the water. One placement for
 * the whole structure inside OSM's man_made=bridge outline, abutment to
 * abutment: the two rust-coloured box ribs either side of the deck, joined
 * over the roadway by nine box struts, springing from the rock at the
 * waterline on the south bank and from the foot of the north cliff; the
 * X-bracing between the ribs under the deck at each end; the deck's steel
 * girders, its hanger brackets and concrete parapets and median barrier;
 * the south approach's five spans on concrete column bents over the low
 * south bank (boat ramp and parking); the north bent and the two
 * abutments. Low model: no hangers or rails. Detail model (z16): the
 * hanger pairs, the rail on the parapets, the girders under the deck
 * opened into lines.
 *
 * The limestone cliffs either side are the map's terrain and are not drawn.
 *
 * Frame: x across (+x to the ESE, the downstream side), y along the bridge
 * toward the north end (NNE), z up, metres. Bearing 28.84, the line of both
 * carriageways (OSM ways 126746778, 177701858, straight); anchor
 * -97.7971880, 30.3494717, the outline's centroid. z = 0 is Lake Austin,
 * the map's Mapterhorn water (150.00 m; the lidar's lake 150.10 m, NAVD88).
 * Feet on land run down to the map's terrain vertex by vertex (GROUND,
 * Mapterhorn z15, 5 m in this frame); the south rib footing stands at the
 * water.
 *
 * The map owns the roadways between the parapets (x = -12.9 to 12.9, the
 * median barrier aside); nothing here is a slab at road level there.
 *
 * Roadway built to (lidar, tools/bridge_ele.py measure on 126746778 and
 * 177701858, USGS_LPC_TX_Central_B1_2017_LAS_2019; heights above 150.00 m):
 * one straight 3.00 % grade, 13.57 m at the south end (y = -176.1) to
 * 24.15 m at the north end (y = 176.1), the same on both carriageways within
 * 0.04 m; no vertical curve. `ele` for both carriageways' end nodes and one
 * new node each at midspan is proposed in
 * landmarks-scratch/osm-ele/atx-pennybacker-bridge.osc and .md (+1.04 m,
 * GEOID18 to EGM96), not uploaded.
 *
 * Ends. Both ends land: the south on the slope up from the boat-ramp flat
 * (lidar bare earth 1.3 m under the road at the outline's end), the north
 * on the cliff top (1.0 m under). Abutment faces stand where the map's
 * terrain is a girder's depth under the deck (y = -172 and 171); the
 * parapets and the slab edge run on to the outline's ends over walls footed
 * on the terrain.
 *
 * Replaces: the man_made=bridge outline way/708944434 (OSM maps no
 * buildings or piers under it).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): outline way/708944434 (352 x 26.8 m,
 *   bridge:structure=arch, Q7164471); roadways 126746778 (northbound,
 *   x = +4.35) and 177701858 (southbound, x = -6.1); the Loop 360 Boat Ramp
 *   (way/237476685) under the south approach; the cliffs at the north end.
 * - Lidar (measured; USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 *   2017, 1 m grid): the roadway; the deck 26-27 m wide with parapets and a
 *   median barrier 0.8 m over the road; the ribs' tops either side of the
 *   deck, 2 m wide, a parabola z = 51.9 - 0.00524 (y - 52.1)^2 (rms 0.14 m
 *   over 151 cells): crown 51.9 m over the lake, 33 m over the road, at
 *   y = 52.1; the ribs pass the deck at y = -25 and 129; nine struts over
 *   the roadway every 15 m (y = -10 to 110); the lake at 150.10 m (the
 *   datum check: Lake Austin's normal pool is 492.8 ft, 150.2 m).
 *   The lidar sits 0.5-1 m east of OSM; the model follows OSM, the map's
 *   roadways.
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid, bearing 28.84, 5 m).
 * - Published (Wikipedia, "Pennybacker Bridge"; TxDOT): through arch of
 *   weathering steel, 1,150 ft long, 600 ft (183 m) arch span, no supports
 *   in the water; opened 1982.
 * Photos (evidence):
 * - Dbtfz, "PennybackerBridge.jpg", public domain (from the north cliff:
 *   struts, deck, south approach on bents):
 *   https://commons.wikimedia.org/wiki/File:PennybackerBridge.jpg
 * - CQui, "Lake Austin Pennybacker Bridge.JPG", CC BY-SA 2.5 (from the lake:
 *   ribs, hangers in pairs at the deck brackets, struts, the north foot):
 *   https://commons.wikimedia.org/wiki/File:Lake_Austin_Pennybacker_Bridge.JPG
 * - Ramir Borja, "Pennybacker Bridge.jpg", CC BY-SA 2.5 (under the deck:
 *   girders, brackets, rib depth growing to the springing, bents):
 *   https://commons.wikimedia.org/wiki/File:Pennybacker_Bridge.jpg
 * - Haythemhammour, "Pennybacker Bridge September 2018.jpg", CC0 (from the
 *   north-west overlook):
 *   https://commons.wikimedia.org/wiki/File:Pennybacker_Bridge_September_2018.jpg
 * - Jeff Gunn, "Austin, Pennybacker Bridge.jpg", CC BY 2.0 (overlook):
 *   https://commons.wikimedia.org/wiki/File:Austin,_Pennybacker_Bridge.jpg
 * - Eric Hunt, "Pennybacker Bridge View.jpg", CC BY 2.5:
 *   https://commons.wikimedia.org/wiki/File:Pennybacker_Bridge_View.jpg
 * - MX, "Pennybacker Bridge - June 2019 (1).jpg", CC BY-SA 4.0 (on the deck:
 *   parapet, portal strut):
 *   https://commons.wikimedia.org/wiki/File:Pennybacker_Bridge_-_June_2019_(1).jpg
 * - sbmeaper1, "Under 360 Bridge, Austin TX", CC0 (Flickr 28794974245: the
 *   X-bracing between the ribs under the deck, the round bent columns):
 *   https://www.flickr.com/photos/142289055@N04/28794974245
 * - kperkins14, "Loop 360 Bridge", CC BY-SA 2.0 (Flickr 2853652223, overlook):
 *   https://www.flickr.com/photos/62405508@N00/2853652223
 * - Jared Tennant, "Pennybacker Bridge, Austin Texas.jpg", CC BY 2.0 (night):
 *   https://commons.wikimedia.org/wiki/File:Pennybacker_Bridge,_Austin_Texas.jpg
 *
 * Numbers
 * - Ribs: centres x = +-14.4 (just outside the deck), 1.8 m wide (lidar
 *   2 m); depth 2.6 m at the crown growing to 3.6 m at the springings
 *   (photo-scaled against the 26.8 m deck). Springings: south at y = -43 on
 *   a footing at the water, north at y = 148 into the foot of the cliff.
 * - Struts: 1.1 m deep, 0.9 m wide (photo), under the rib tops at the
 *   lidar's nine stations.
 * - Hangers: pairs every 9.6 m, 15 a side, symmetric about the crown
 *   (estimated from the lake photo: eight a half-arch); brackets 2 m out
 *   from the girders at each.
 * - Deck: slab edge 0.35 m, steel girders to 2.3 m under the road
 *   (photo-scaled), parapets 0.85 m (lidar 0.8), median barrier 0.6 m wide.
 * - Bents: four round columns, 1.4 m (photo), at y = -146.4, -120.8,
 *   -95.2, -69.6 and -47 (south) and 151 (north): positions estimated from
 *   the overlook photos (four or five bents under the south approach,
 *   evenly spaced), not measured.
 * - Posts from the rib to the deck at y = -34.3 and 138.5, and the
 *   X-bracing under the deck at each end, from the photos.
 * - Colours: weathering steel from daylight photo samples (hue 10-20 deg,
 *   #8b5a45 lit), pulled to the palette's lightness: #9a5b45, girders and
 *   undersides #7d4b3b; concrete #d4d3cb; hangers galvanised #9a9fa6.
 * - Night: nothing on the arch is lit (night photo); no lamps or
 *   floodlighting.
 *
 * Doubts
 * - Bent positions and column count are estimated; the south approach may
 *   have a different span arrangement.
 * - Hanger spacing is estimated (15 a side); the hangers' real cable groups
 *   (two pairs) are drawn as one pair.
 * - The posts and bracing under the deck near the springings are
 *   simplified to vertical posts and one X each end.
 */
import { Part, writeGlb, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { band, face, footedLoft, groundAt, rod, stations, type GroundGrid } from './bridge-kit'

// ---- The map's terrain, metres above the lake (Mapterhorn z15, 150.00 m) ----
// rows along y from -200 every 5 m, columns across x from -30 every 5 m
const GROUND: GroundGrid = { y0: -200, x0: -30, step: 5, z: [
  [9.1, 10.9, 12.0, 12.5, 12.8, 12.9, 12.9, 12.9, 12.7, 12.5, 11.9, 10.4, 8.7],
  [9.4, 11.1, 12.2, 12.7, 12.9, 13.0, 13.1, 13.0, 12.9, 12.6, 12.1, 10.6, 8.8],
  [9.7, 11.3, 12.4, 12.9, 13.1, 13.2, 13.2, 13.2, 13.0, 12.8, 12.3, 10.9, 9.1],
  [9.8, 11.5, 12.8, 13.1, 13.2, 13.3, 13.4, 13.3, 13.2, 12.9, 12.5, 11.1, 9.5],
  [10.0, 11.6, 12.8, 13.3, 13.3, 13.4, 13.5, 13.4, 13.3, 13.1, 12.6, 11.3, 9.7],
  [9.9, 11.2, 11.8, 11.9, 12.0, 12.1, 12.1, 12.1, 12.0, 11.9, 11.8, 11.0, 9.7],
  [9.2, 10.0, 10.2, 10.3, 10.3, 10.3, 10.3, 10.3, 10.2, 10.2, 10.2, 9.8, 8.9],
  [7.9, 8.3, 8.6, 8.6, 8.6, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.2, 7.6],
  [6.4, 6.7, 6.9, 7.0, 6.9, 6.9, 6.8, 6.8, 6.8, 6.8, 6.7, 6.5, 6.0],
  [4.8, 5.1, 5.2, 5.4, 5.3, 5.2, 5.1, 5.1, 5.0, 5.1, 5.0, 4.7, 4.4],
  [3.5, 3.6, 3.6, 3.8, 3.6, 3.6, 3.5, 3.4, 3.3, 3.3, 3.2, 2.9, 2.6],
  [3.1, 3.0, 3.0, 2.9, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1],
  [3.2, 3.0, 2.8, 2.7, 2.7, 2.7, 2.6, 2.6, 2.6, 2.5, 2.4, 2.3, 2.5],
  [3.6, 3.4, 3.2, 3.0, 2.9, 2.9, 2.9, 2.8, 2.7, 2.8, 2.8, 2.8, 2.9],
  [3.8, 3.7, 3.6, 3.4, 3.4, 3.3, 3.3, 3.2, 3.2, 3.2, 3.2, 3.3, 3.3],
  [3.9, 3.8, 3.7, 3.7, 3.6, 3.6, 3.6, 3.6, 3.5, 3.5, 3.5, 3.5, 3.5],
  [3.9, 3.9, 3.9, 3.8, 3.8, 3.8, 3.7, 3.7, 3.7, 3.6, 3.6, 3.6, 3.6],
  [3.4, 3.7, 3.8, 3.6, 3.4, 3.3, 3.2, 3.1, 3.0, 3.1, 3.1, 3.1, 3.3],
  [2.9, 3.4, 3.5, 3.1, 2.9, 2.8, 2.7, 2.6, 2.5, 2.5, 2.5, 2.6, 2.8],
  [2.7, 3.0, 3.1, 2.7, 2.6, 2.6, 2.5, 2.5, 2.4, 2.4, 2.4, 2.5, 2.5],
  [2.6, 2.8, 2.8, 2.5, 2.4, 2.4, 2.5, 2.5, 2.5, 2.4, 2.4, 2.4, 2.4],
  [2.6, 2.6, 2.5, 2.5, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4],
  [2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.3, 2.3, 2.3, 2.4],
  [2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3],
  [2.1, 2.1, 2.2, 2.2, 2.2, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3],
  [1.9, 2.0, 2.1, 2.1, 2.2, 2.3, 2.3, 2.3, 2.3, 2.2, 2.3, 2.3, 2.3],
  [1.7, 1.9, 2.0, 2.1, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2],
  [1.5, 1.8, 2.0, 2.1, 2.1, 2.1, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2],
  [1.4, 1.8, 2.0, 2.1, 2.1, 2.1, 2.1, 2.1, 2.2, 2.1, 2.1, 2.0, 2.0],
  [1.6, 2.0, 2.1, 2.2, 2.2, 2.2, 2.2, 2.2, 2.1, 2.2, 2.2, 2.3, 2.3],
  [1.9, 2.3, 2.5, 2.4, 1.8, 1.7, 1.8, 1.9, 2.3, 2.1, 2.4, 2.0, 1.4],
  [1.4, 0.9, 0.8, 0.7, 0.8, 0.6, 0.7, 1.0, 1.3, 0.1, 0.1, 0.0, 0.0],
  ...Array.from({ length: 35 }, () => Array(13).fill(0)), // y = -40 .. 130: the lake
  [0.0, 0.0, 0.1, 0.6, 1.0, 1.4, 1.4, 1.4, 1.6, 2.0, 1.6, 0.8, 0.2],
  [1.1, 1.6, 2.4, 3.6, 4.1, 4.5, 4.4, 4.4, 4.5, 4.6, 4.2, 3.8, 3.3],
  [4.3, 5.0, 5.6, 6.7, 7.0, 7.2, 7.3, 7.3, 7.4, 7.3, 7.3, 7.3, 7.4],
  [7.6, 8.3, 9.0, 9.2, 9.5, 9.9, 10.0, 10.0, 10.0, 10.1, 10.6, 11.1, 11.1],
  [10.9, 11.7, 12.5, 12.7, 12.7, 13.2, 13.3, 13.4, 13.6, 13.7, 13.8, 15.0, 14.7],
  [14.1, 14.9, 15.6, 16.2, 16.2, 16.5, 16.8, 16.9, 17.2, 17.3, 17.1, 17.9, 18.7],
  [17.4, 18.2, 18.3, 19.4, 19.1, 19.1, 19.2, 19.3, 19.5, 20.1, 20.4, 20.2, 21.8],
  [20.9, 21.4, 21.2, 21.5, 21.4, 21.1, 21.1, 21.2, 21.6, 22.0, 22.1, 22.0, 25.5],
  [24.5, 23.2, 22.9, 22.8, 22.7, 23.1, 23.0, 23.2, 23.3, 22.7, 22.7, 22.8, 32.4],
  [34.7, 24.3, 23.7, 24.0, 24.2, 24.3, 24.4, 24.3, 24.2, 24.0, 23.2, 24.1, 36.9],
  [37.7, 24.7, 24.0, 24.3, 24.4, 24.5, 24.6, 24.5, 24.4, 24.3, 23.5, 24.7, 37.3],
  [37.9, 25.1, 24.1, 24.3, 24.6, 24.7, 24.7, 24.7, 24.5, 24.4, 23.8, 25.0, 37.2],
  [37.8, 25.8, 24.1, 24.4, 24.7, 24.8, 24.9, 24.8, 24.7, 24.5, 23.9, 25.7, 37.3],
  [37.9, 26.7, 24.3, 24.6, 24.9, 25.0, 25.1, 25.0, 24.9, 24.6, 24.1, 25.7, 37.5],
] }
if (GROUND.z.length !== 81) throw new Error(`GROUND has ${GROUND.z.length} rows`)
const ground = (x: number, y: number) => Math.max(0, groundAt(GROUND, x, y))

// ---- The roadway (lidar, tools/bridge_ele.py; metres above 150.00 m) ---------
const road = (y: number) => 18.848 + 0.029956 * y

// ---- Plan -----------------------------------------------------------------------
const Y_S = -176.1, Y_N = 176.1 // the outline's ends, where the deck lands
const Y_SABUT = -172, Y_NABUT = 171 // abutment faces (terrain a girder's depth under the deck)
const EDGE = 13.35, PAR_IN = 12.9, PAR_H = 0.85 // slab edge, parapet inner face, parapet height
const MED_X = -0.9, MED_W = 0.6 // median barrier, midway between OSM's carriageways
const GIRDER = 2.3, SLAB = 0.35 // girders' bottom and the slab edge under the road
const FASCIA = 13.0 // the outer girders' web
const under = (y: number) => road(y) - GIRDER
/** The foot of a barrier: on the deck, or down to the terrain past the abutments. */
const foot = (x: number, y: number) => (y < Y_SABUT || y > Y_NABUT ? Math.min(road(y) - 0.05, ground(x, y)) : road(y) - 0.05)

// ---- The arch (lidar fit) ---------------------------------------------------------
const RIB_X = 14.4, RIB_W = 2.0
const CROWN_Y = 52.1, CROWN_Z = 51.9, K = 0.00524
const Y_SS = -43, Y_NS = 141 // springings: the south at the water, the north on the rock at the cliff foot
const ribTop = (y: number) => CROWN_Z - K * (y - CROWN_Y) ** 2
const ribDepth = (y: number) => 3.0 + 1.0 * ((y - CROWN_Y) / 96) ** 2
const ribBot = (y: number) => ribTop(y) - ribDepth(y)
const STRUTS = stations(-10, 110, 15)
const HANGERS = Array.from({ length: 15 }, (_, i) => CROWN_Y + 9.6 * (i - 7))
const POSTS = [-34.3, 134.5]
const BENTS = [-146.4, -120.8, -95.2, -69.6, -47, 151]
const COLS = [-10.6, -3.9, 3.9, 10.6]

// ---- Materials ------------------------------------------------------------------
const STEEL: MaterialSpec = finish('weathering-steel', 0x9a5b45)
const SHADE: MaterialSpec = finish('weathering-steel-shade', 0x7d4b3b)
const CONCRETE: MaterialSpec = finish('concrete', 0xd4d3cb)
const CABLE: MaterialSpec = finish('hanger-steel', 0x9a9fa6)
type Set = { steel: Part; shade: Part; concrete: Part; cable: Part }

const nrm = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const addv = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** A box member from a to b, w wide (horizontal) and h deep. */
function beam(p: Part, a: V3, b: V3, w: number, h: number) {
  const t = nrm(sub(b, a))
  const side = nrm(Math.abs(t[2]) > 0.95 ? cross(t, [1, 0, 0]) : cross(t, [0, 0, 1]))
  const up = cross(side, t)
  const c = (o: V3, s: number, u: number) => addv(o, addv(mul(side, (s * w) / 2), mul(up, (u * h) / 2)))
  const A = [c(a, -1, -1), c(a, 1, -1), c(a, 1, 1), c(a, -1, 1)], B = [c(b, -1, -1), c(b, 1, -1), c(b, 1, 1), c(b, -1, 1)]
  const ns: V3[] = [mul(up, -1), side, up, mul(side, -1)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    face(p, A[i], A[j], B[j], B[i], ns[i])
  }
  face(p, A[0], A[1], A[2], A[3], mul(t, -1))
  face(p, B[0], B[1], B[2], B[3], t)
}
/** An upright box x0..x1, y0..y1, from z0 (or the ground) to z1. */
function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number | 'ground', z1: number, seg = 3) {
  footedLoft(p, ground, [
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: z0 },
    { plan: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z: z1 },
  ], seg)
}
/** A round column on the ground, radius r, to z1. */
function column(p: Part, x: number, y: number, r: number, z1: number, sides: number) {
  const plan = Array.from({ length: sides }, (_, i) => {
    const a = (2 * Math.PI * i) / sides
    return [x + r * Math.cos(a), y + r * Math.sin(a)] as [number, number]
  })
  footedLoft(p, ground, [{ plan, z: 'ground' }, { plan, z: z1 }], 10, false)
}
/** A wall along y at x, facing `side` (+1 east), between bot(y) and top(y). */
function wallY(p: Part, x: number, ys: number[], top: (y: number) => number, bot: (y: number) => number, side: number) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const [a, b] = [ys[i], ys[i + 1]]
    face(p, [x, a, bot(a)], [x, b, bot(b)], [x, b, top(b)], [x, a, top(a)], [side, 0, 0])
  }
}
/** A flat sheet x0..x1 along ys at z(y), facing up or down. */
function sheet(p: Part, x0: number, x1: number, ys: number[], z: (y: number) => number, up: boolean) {
  for (let i = 0; i + 1 < ys.length; i++) {
    const [a, b] = [ys[i], ys[i + 1]]
    const t = nrm([0, b - a, z(b) - z(a)]), n: V3 = up ? [0, -t[2], t[1]] : [0, t[2], -t[1]]
    face(p, [x0, a, z(a)], [x1, a, z(a)], [x1, b, z(b)], [x0, b, z(b)], n)
  }
}
const sortedYs = (y0: number, y1: number, step: number, br: number[] = []) =>
  [...new Set([...stations(y0, y1, step), ...br.filter((b) => b > y0 && b < y1)])].sort((a, b) => a - b)

// ---- Arch ---------------------------------------------------------------------------
function arch(s: Set, detail: boolean) {
  const ys = stations(Y_SS, Y_NS, detail ? 4 : 8)
  for (const sd of [-1, 1]) band(s.steel, sd * (RIB_X - RIB_W / 2), sd * (RIB_X + RIB_W / 2), ys, ribTop, ribBot)
  // struts over the roadway, just under the rib tops
  for (const y of STRUTS) beam(s.steel, [-(RIB_X - RIB_W / 2), y, ribTop(y) - 0.85], [RIB_X - RIB_W / 2, y, ribTop(y) - 0.85], 0.9, 1.1)
  // footings: the south one at the water, the north one into the cliff foot
  for (const [y, d] of [[Y_SS, -1], [Y_NS, 1]] as [number, number][]) {
    for (const sd of [-1, 1]) {
      const x = sd * RIB_X, z = ribBot(y) + 0.8
      block(s.concrete, x - 1.8, x + 1.8, y - 2.5, y + 2.5, 'ground', Math.max(z, ground(x, y + d * 2) + 0.6))
    }
  }
  // X-bracing between the ribs under the deck, and posts from the ribs to the deck, at each end
  for (const [ya, yb] of [[-40.5, -29.5], [139, 131]]) {
    const za = ribTop(ya) - ribDepth(ya) / 2, zb = ribTop(yb) - ribDepth(yb) / 2
    beam(s.shade, [-RIB_X + 0.9, ya, za], [RIB_X - 0.9, yb, zb], 0.9, 0.9)
    beam(s.shade, [RIB_X - 0.9, ya, za], [-RIB_X + 0.9, yb, zb], 0.9, 0.9)
  }
  for (const y of POSTS) for (const sd of [-1, 1])
    block(s.steel, sd * RIB_X - 0.5, sd * RIB_X + 0.5, y - 0.5, y + 0.5, ribTop(y) - 0.3, road(y) - SLAB)
  // hangers: a pair at each bracket (detail)
  if (detail) for (const y of HANGERS) for (const sd of [-1, 1]) for (const dy of [-0.3, 0.3])
    rod(s.cable, [sd * RIB_X, y + dy, road(y) - SLAB], [sd * RIB_X, y + dy, ribBot(y) + 0.1], 0.11, 4)
}

// ---- Deck ---------------------------------------------------------------------------
function deck(s: Set, detail: boolean) {
  const step = detail ? 8 : 16
  const br = [Y_SABUT, Y_NABUT, ...BENTS]
  const all = sortedYs(Y_S, Y_N, step, br)
  const span = all.filter((y) => y >= Y_SABUT - 1e-6 && y <= Y_NABUT + 1e-6)
  const landS = all.filter((y) => y <= Y_SABUT + 1e-6), landN = all.filter((y) => y >= Y_NABUT - 1e-6)
  for (const sd of [-1, 1]) {
    const o = (l: number[]) => (sd > 0 ? l : [...l].reverse())
    // the slab edge and parapet's outer face, one face from under the slab to the parapet top
    wallY(s.concrete, sd * EDGE, o(span), (y) => road(y) + PAR_H, (y) => road(y) - SLAB, sd)
    sheet(s.concrete, sd > 0 ? FASCIA : -EDGE, sd > 0 ? EDGE : -FASCIA, span, (y) => road(y) - SLAB, false)
    // on land past the abutments, the edge wall runs down to the terrain
    for (const l of [landS, landN]) wallY(s.concrete, sd * EDGE, o(l), (y) => road(y) + PAR_H, (y) => Math.min(ground(sd * EDGE, y), road(y) - SLAB), sd)
    // parapet: inner face and cap
    wallY(s.concrete, sd * PAR_IN, o(all), (y) => road(y) + PAR_H, (y) => foot(sd * PAR_IN, y), -sd)
    sheet(s.concrete, sd > 0 ? PAR_IN : -EDGE, sd > 0 ? EDGE : -PAR_IN, all, (y) => road(y) + PAR_H, true)
    // the outer girder
    wallY(s.shade, sd * FASCIA, o(span), (y) => road(y) - SLAB, under, sd)
    // hanger brackets (and at the posts): floor-beam ends out to the ribs
    for (const y of [...HANGERS, ...POSTS]) {
      const x0 = sd > 0 ? FASCIA : -RIB_X - 0.6, x1 = sd > 0 ? RIB_X + 0.6 : -FASCIA
      block(s.steel, x0, x1, y - 0.55, y + 0.55, road(y) - SLAB - 1.7, road(y) - SLAB)
    }
    // parapet rail (detail): a pipe on posts
    if (detail) {
      const x = sd * (EDGE - 0.2)
      for (const y of stations(Y_S + 0.3, Y_N - 0.3, 3)) rod(s.cable, [x, y, road(y) + PAR_H], [x, y, road(y) + PAR_H + 0.6], 0.05, 3)
      for (let i = 0; i + 1 < all.length; i++)
        rod(s.cable, [x, all[i], road(all[i]) + PAR_H + 0.6], [x, all[i + 1], road(all[i + 1]) + PAR_H + 0.6], 0.07, 4)
    }
  }
  // the median barrier
  for (const sd of [-1, 1]) wallY(s.concrete, MED_X + (sd * MED_W) / 2, sd > 0 ? all : [...all].reverse(), (y) => road(y) + PAR_H, (y) => foot(MED_X, y), sd)
  sheet(s.concrete, MED_X - MED_W / 2, MED_X + MED_W / 2, all, (y) => road(y) + PAR_H, true)
  for (const [y, d] of [[Y_S, -1], [Y_N, 1]] as [number, number][]) {
    face(s.concrete, [MED_X - MED_W / 2, y, foot(MED_X, y)], [MED_X + MED_W / 2, y, foot(MED_X, y)], [MED_X + MED_W / 2, y, road(y) + PAR_H], [MED_X - MED_W / 2, y, road(y) + PAR_H], [0, d, 0])
    for (const sd of [-1, 1]) {
      const xa = sd * PAR_IN, xb = sd * EDGE
      face(s.concrete, [xa, y, Math.min(ground(xb, y), road(y) - SLAB)], [xb, y, Math.min(ground(xb, y), road(y) - SLAB)], [xb, y, road(y) + PAR_H], [xa, y, road(y) + PAR_H], [0, d, 0])
    }
  }
  // underside: a soffit in the low model; the girder lines in the detail
  if (!detail) sheet(s.shade, -FASCIA, FASCIA, span, under, false)
  else {
    sheet(s.shade, -FASCIA, FASCIA, span, (y) => road(y) - SLAB - 0.05, false)
    for (const x of [-7.8, -2.6, 2.6, 7.8]) for (const sd of [-1, 1])
      wallY(s.shade, x + sd * 0.25, sd > 0 ? span : [...span].reverse(), (y) => road(y) - SLAB, under, sd)
    for (const sd of [-1, 1]) wallY(s.shade, sd * (FASCIA - 0.5), sd > 0 ? [...span].reverse() : span, (y) => road(y) - SLAB, under, -sd)
    for (const x of [-FASCIA, -7.8, -2.6, 2.6, 7.8, FASCIA - 0.5])
      sheet(s.shade, x, x + 0.5, span, under, false)
  }
  // abutments: concrete faces from the terrain to under the slab
  for (const [y, d] of [[Y_SABUT, -1], [Y_NABUT, 1]] as [number, number][]) {
    const xs = stations(-EDGE, EDGE, 3)
    for (let i = 0; i + 1 < xs.length; i++) {
      const [a, b] = [xs[i], xs[i + 1]]
      face(s.concrete, [a, y, ground(a, y)], [b, y, ground(b, y)], [b, y, road(y) - SLAB], [a, y, road(y) - SLAB], [0, -d, 0])
    }
    // the girders' end plate over the abutment
    face(s.shade, [-FASCIA, y, under(y)], [FASCIA, y, under(y)], [FASCIA, y, road(y) - SLAB], [-FASCIA, y, road(y) - SLAB], [0, -d, 0])
  }
}

// ---- Bents --------------------------------------------------------------------------
function bents(s: Set, detail: boolean) {
  for (const y of BENTS) {
    for (const x of COLS) column(s.concrete, x, y, 0.7, under(y) - 0.9, detail ? 12 : 8)
    // the cap beam under the girders
    block(s.concrete, -12.2, 12.2, y - 0.8, y + 0.8, under(y) - 1.1, under(y), 30)
  }
}

function build(detail: boolean): Set {
  const s: Set = { steel: new Part(), shade: new Part(), concrete: new Part(), cable: new Part() }
  arch(s, detail)
  deck(s, detail)
  bents(s, detail)
  return s
}

if (import.meta.main) {
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin on the deck centre line at the outline centroid, at the lake',
    bearing: 28.84, elevation: 0,
    roadway: { south: road(Y_S), north: road(Y_N), grade: 0.03, crownOfArch: CROWN_Z },
  }
  for (const [file, detail, maxTris, maxBytes] of [
    ['atx-pennybacker-bridge.glb', false, 6500, 250 * 1024],
    ['atx-pennybacker-bridge.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const s = build(detail)
    const list = [
      { part: s.steel, material: STEEL }, { part: s.shade, material: SHADE },
      { part: s.concrete, material: CONCRETE }, { part: s.cable, material: CABLE },
    ].filter((p) => p.part.triangles > 0)
    const tris = list.reduce((n, p) => n + p.part.triangles, 0)
    const glb = writeGlb('Pennybacker Bridge', list, extras)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
    if (tris > maxTris || glb.length > maxBytes) throw new Error(`${file} over budget`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
  }
}
