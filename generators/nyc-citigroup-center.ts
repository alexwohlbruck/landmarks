/**
 * Citigroup Center (601 Lexington Avenue) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-citigroup-center.ts
 *
 * Map frame: x = model east (Third Avenue side), y = model north (East 54th
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/164105516, which covers the tower,
 * the glass atrium and the stepped low-rise building to the east. Kit from
 * nyc-570-lexington.ts.
 *
 * Evidence
 * - OSM way/164105516 and its parts: tower 258744609 (skillion crown, 279 m,
 *   min 35), 258744605 (north strip, 279), 258744590 (south strip, 242); the
 *   four mid-side stilts 258744594/595/596/600 (8.2 m square, 35 m) and the
 *   core 258744612; the stepped base strips 258744601/602/603/608 (10–22 m);
 *   the atrium gables 258744593/597/599 (28 m); the low-rise 258744606.
 *   St. Peter's Lutheran Church (way/258744589) is a separate building under
 *   the tower's north-west corner, so it is not modelled or replaced.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled into the model frame
 *   (/tmp/city/nyc/work/nyc-citigroup-center/rot.png). Street level is
 *   4.5 m above the lowest return (the sunken plaza at Lexington and 53rd,
 *   which the map's terrain does not see), so y = 0 is the street. Measured
 *   above it: tower square x −50.8…−1.2, y −31.6…18.0 (49.6 m, published
 *   157 ft = 47.9 m); roof 242 m with a 4.6 m flat strip on the south side,
 *   then the crown slope rising north at ≈ 43° to 280 m, flat for the last
 *   4 m; base terraces stepping 12/16/20/24 m on 53rd Street; low-rise 27 m
 *   edges, 31 and 35 m in the middle; the atrium roof gives no returns (glass).
 * - Published: 279 m, 59 floors, Hugh Stubbins / William LeMessurier, 1977;
 *   the tower stands 114 ft (35 m) up on four columns at the middle of each
 *   side, with the corners cantilevered 72 ft; 45° crown facing south;
 *   aluminium and glass ribbon facade (Wikipedia; NYC LPC designation 2016).
 * - Photos (Wikimedia Commons, daylight, several sides): see
 *   /tmp/city/nyc/work/nyc-citigroup-center/photos/credits.txt.
 *
 * Facade: continuous ribbon windows drawn as one band per three storeys,
 * aluminium spandrels between, bands stopping short of the corners; the
 * crown's side triangles and north face are solid aluminium; the slope is a
 * pale metal plane.
 *
 * Estimated: the atrium's glass roof shape (one gable over the whole hall;
 * OSM maps three small gables), the low-rise terraces' plan (from the lidar's
 * coarse levels and one street photo), the band proportions.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, massing, capPoly, chamferRect, quadN, type Facade, type XY } from './nyc-570-lexington'

const alu = new Part(), win = new Part(), roof = new Part(), glass = new Part(), slope = new Part(), low = new Part()

// Tower plan and levels (lidar, street = 0).
const X0 = -50.8, X1 = -1.2, Y0 = -31.6, Y1 = 18.0
const LIFT = 35, ROOF = 242, TOP = 280, SLOPE_Y0 = -27, SLOPE_Y1 = 14

// --- Stilts and core ------------------------------------------------------
const CX = (X0 + X1) / 2, CY = (Y0 + Y1) / 2, S = 4.1
for (const [x, y] of [[X0 + S, CY], [X1 - S, CY], [CX, Y0 + S], [CX, Y1 - S]] as XY[]) {
  prism({ wall: alu, win: null, roof: null, ring: [[x - S, y - S], [x + S, y - S], [x + S, y + S], [x - S, y + S]], z0: 0, z1: LIFT, facade: null, bevel: 0.5 })
}
// The core: an octagonal shaft (OSM 258744612), glass at its foot.
const core = chamferRect(CX - 8.2, CY - 8.4, CX + 8.2, CY + 8.4, 2.1)
prism({ wall: alu, win: null, roof: null, ring: core, z0: 0, z1: LIFT, facade: null, bevel: 0.4 })

// --- Tower shaft: ribbon windows, three storeys a band --------------------
const ribbons: Facade = { bay: 60, ratio: 0.965, floor: 3.55, group: 3, spandrel: 6.0, sill: 2.4, head: 2.2, minLength: 4 }
const shaft: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
prism({ wall: alu, win, roof: null, ring: shaft, z0: LIFT, z1: ROOF, facade: ribbons, bevel: 0.6 })
// Soffit under the cantilevered floors, in shadow.
capPoly(roof, shaft, LIFT, false)

// --- Crown -----------------------------------------------------------------
// Side walls: the (y, z) profile extruded through the east and west faces.
const prof: [number, number][] = [[SLOPE_Y0, ROOF], [Y1, ROOF], [Y1, TOP], [SLOPE_Y1, TOP]]
for (const [x, east] of [[X1, true], [X0, false]] as [number, boolean][]) {
  const n: V3 = [east ? 1 : -1, 0, 0]
  const P = prof.map(([y, z]) => [x, y, z] as V3)
  if (east) { alu.tri(P[0], P[1], P[2], undefined, undefined, undefined, [n, n, n]); alu.tri(P[0], P[2], P[3], undefined, undefined, undefined, [n, n, n]) }
  else { alu.tri(P[0], P[2], P[1], undefined, undefined, undefined, [n, n, n]); alu.tri(P[0], P[3], P[2], undefined, undefined, undefined, [n, n, n]) }
}
// North face of the crown.
{ const n: V3 = [0, 1, 0]; quadN(alu, [X1, Y1, ROOF], [X0, Y1, ROOF], [X0, Y1, TOP], [X1, Y1, TOP], [n, n, n, n]) }
// Flat top strip, the south roof strip, and the slope.
roof.quad([X0, SLOPE_Y1, TOP], [X1, SLOPE_Y1, TOP], [X1, Y1, TOP], [X0, Y1, TOP])
roof.quad([X0, Y0, ROOF], [X1, Y0, ROOF], [X1, SLOPE_Y0, ROOF], [X0, SLOPE_Y0, ROOF])
slope.quad([X0, SLOPE_Y0, ROOF], [X1, SLOPE_Y0, ROOF], [X1, SLOPE_Y1, TOP], [X0, SLOPE_Y1, TOP])
// A low parapet lip round the south strip, so the roof edge reads.
{
  const t = 0.8, h = 1.2
  const lip = (a: XY, b: XY) => prism({ wall: alu, win: null, roof: alu, ring: [a, [b[0], a[1]], b, [a[0], b[1]]], z0: ROOF, z1: ROOF + h, facade: null, bevel: 0.3 })
  lip([X0, Y0], [X1, Y0 + t])
}

// --- Base: stepped terraces, atrium and the low-rise ------------------------
const lowFacade: Facade = { bay: 9, ratio: 0.9, floor: 3.9, group: 1, spandrel: 1.5, sill: 1.0, head: 1.0, ground: 5, minLength: 5 }
massing({
  wall: low, win, roof, facade: lowFacade, bevel: 0.4,
  boxes: [
    // Terraces on the tower's east side, stepping up towards the atrium (OSM 258744608/601/602/603).
    [-22.2, -31.6, -11, 18, 10],
    [-11, -31.6, -8, 18, 14],
    [-8, -31.6, -5, 18, 18],
    [-5, -31.6, -1.5, 18, 22],
    // The south wing along 53rd Street and the low-rise office building.
    [-1.5, -31.7, 15.7, -15, 26],
    [15.7, -31.8, 29.6, 29.5, 27],
    [29.6, -0.8, 58.6, 29.5, 27],
    [17.5, -13, 44.5, 20.4, 31],
    [21, -10, 41, 17.5, 35],
  ],
})
// The atrium: glass walls under a glass gable (no lidar returns: glass).
{
  const ax0 = -1.5, ax1 = 15.7, ay0 = -15, ay1 = 24, eave = 22, ridge = 28, xm = (ax0 + ax1) / 2
  prism({ wall: low, win: glass, roof: null, ring: [[ax0, ay0], [ax1, ay0], [ax1, ay1], [ax0, ay1]], z0: 0, z1: eave, facade: { ...lowFacade, group: 2, ground: 1.5 }, bevel: 0.3 })
  glass.quad([ax0, ay0, eave], [ax0, ay1, eave], [xm, ay1, ridge], [xm, ay0, ridge]) // west pane faces up-west
  glass.quad([ax1, ay1, eave], [ax1, ay0, eave], [xm, ay0, ridge], [xm, ay1, ridge])
  for (const [y, s] of [[ay0, -1], [ay1, 1]] as [number, number][]) {
    const a: V3 = [ax0, y, eave], b: V3 = [ax1, y, eave], c: V3 = [xm, y, ridge]
    if (s < 0) low.tri(a, b, c); else low.tri(b, a, c)
  }
}

finishModel('Citigroup Center', 'nyc-citigroup-center', [
  { part: alu, material: finish('citi-aluminium', 0xebebe7) },
  { part: win, material: windowVariant(2, 0x7f95a7) },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
  { part: slope, material: finish('citi-crown', 0xcfd3d5) },
  { part: low, material: finish('citi-base', 0xc9ccce) },
], { bearing: 29, osm: 'way/164105516', height: 280 })
