/**
 * 35 Hudson Yards — procedural, CC0-1.0, no textures.
 * bun generators/nyc-35-hudson-yards.ts
 *
 * Map frame: x = model east (towards Tenth Avenue), y = model north (West
 * 34th Street), z up, metres. Placed at bearing 29°, the Manhattan grid.
 * Anchor: area centroid of the OSM outline way/468721008. Kit from
 * nyc-30-hudson-yards.ts.
 *
 * Evidence
 * - OSM way/468721008 and its parts 1089415971–81, which map the tower's
 *   tiers exactly: a 77 m base over the whole lot and a 26 m strip on its
 *   south and east sides; then a 35 × 34 m shaft whose corners round off
 *   one at a time at each setback (south-west at 135 m, south-east at
 *   173 m, north-east at 210 m, north-west at 248 m); and a 276 m crown cut
 *   by a V notch in the middle of each face, the notches bottoming out at
 *   282–290 m. Plans here are OSM's rings.
 * - Published: 308 m (1,009 ft), 72 floors, David Childs / Skidmore, Owings
 *   & Merrill, 2019; residential over a hotel (Wikipedia). The crown is
 *   drawn to 308 m rather than OSM's 304.8 m.
 * - No lidar: the 2017 USGS flight predates the tower.
 * - Photos (Wikimedia Commons, daylight, several sides and from the
 *   north-east and west at a distance):
 *   /tmp/city/nyc/work/nyc-35-hudson-yards/photos/credits.txt. Glass between
 *   pale limestone piers, a pale horizontal band at every setback, the
 *   notched crown.
 *
 * Estimated: the bay width (4.6 m, a little coarser than the real piers),
 * four-storey panel rows, the colours, and the 26 m strip's facade.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, capPoly, type XY } from './nyc-570-lexington'
import { volume, at, type Bays } from './nyc-30-hudson-yards'

const glass = new Part(), stone = new Part(), roof = new Part()

const B: Bays = { bay: 4.6, pier: 1.2, row: 13.2, brk: 0.8, foot: 1.2, head: 1.2, minWidth: 1.8 }
const base: Bays = { ...B, row: 9.5, foot: 5, head: 3 }

const strip: XY[] = [[-24.8, -19.8], [-24.7, -29.6], [21.3, -29.3], [21.5, -27.7], [23.3, -12.2], [24.7, -0.6], [26.0, 10.8], [28.0, 27.6], [28.1, 28.2], [19.7, 28.2], [19.5, -19.7]]
const podium: XY[] = [[19.7, 28.2], [19.5, -19.7], [-24.8, -19.8], [-24.6, 28.1]]
const t1: XY[] = [[19.5, -19.7], [19.6, 14.6], [-15.4, 14.4], [-15.4, -19.8]]
const t2: XY[] = [[19.5, -19.7], [19.6, 14.6], [-15.4, 14.4], [-15.4, -8.6], [-14.8, -11.1], [-13.9, -13.5], [-12.8, -15.8], [-11.7, -17.6], [-9.9, -19.8]]
const t3: XY[] = [[-15.4, -8.6], [-14.8, -11.1], [-13.9, -13.5], [-12.8, -15.8], [-11.7, -17.6], [-9.9, -19.8], [6.8, -19.7], [9.2, -19.5], [12.0, -18.8], [14.5, -17.7], [16.6, -16.5], [18.3, -15.4], [19.5, -14.3], [19.6, 14.6], [-15.4, 14.4]]
const t4: XY[] = [[6.8, -19.7], [9.2, -19.5], [12.0, -18.8], [14.5, -17.7], [16.6, -16.5], [18.3, -15.4], [19.5, -14.3], [19.6, 1.8], [19.2, 4.2], [18.5, 7.0], [17.3, 9.5], [16.2, 11.5], [15.0, 13.2], [13.8, 14.5], [-15.4, 14.4], [-15.4, -8.6], [-14.8, -11.1], [-13.9, -13.5], [-12.8, -15.8], [-11.7, -17.6], [-9.9, -19.8]]
const t5: XY[] = [[18.5, 7.0], [17.3, 9.5], [16.2, 11.5], [15.0, 13.2], [13.8, 14.5], [-3.7, 14.5], [-5.9, 14.2], [-7.7, 13.8], [-10.1, 12.8], [-12.0, 11.8], [-13.5, 10.6], [-15.4, 8.8], [-15.4, -8.6], [-14.8, -11.1], [-13.9, -13.5], [-12.8, -15.8], [-11.7, -17.6], [-9.9, -19.8], [6.8, -19.7], [9.2, -19.5], [12.0, -18.8], [14.5, -17.7], [16.6, -16.5], [18.3, -15.4], [19.5, -14.3], [19.6, 1.8], [19.2, 4.2]]
// The crown: t5 with a V notch in the middle of each face.
const crown: XY[] = [[2.8, 10.1], [1.0, 14.5], [-3.7, 14.5], [-5.9, 14.2], [-7.7, 13.8], [-10.1, 12.8], [-12.0, 11.8], [-13.5, 10.6], [-15.4, 8.8], [-10.8, -1.7], [-15.4, -3.7], [-15.4, -8.6], [-14.8, -11.1], [-13.9, -13.5], [-12.8, -15.8], [-11.7, -17.6], [-9.9, -19.8], [0.8, -15.2], [2.8, -19.8], [6.8, -19.7], [9.2, -19.5], [12.0, -18.8], [14.5, -17.7], [16.6, -16.5], [18.3, -15.4], [19.5, -14.3], [15.0, -4.0], [19.6, -2.0], [19.6, 1.8], [19.2, 4.2], [18.5, 7.0], [17.3, 9.5], [16.2, 11.5], [15.0, 13.2], [13.8, 14.5]]

const ccw = (r: XY[]) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] } return s > 0 ? r : [...r].reverse() }

/** A vertical prism tier on a plan ring, glass bays on every wall, roof on top. */
function tier(ring: XY[], z0: number, z1: number, f: Bays | null, hide?: (a: XY, b: XY) => boolean, back = stone) {
  const r = ccw(ring)
  volume([at(r, z0), at(r, z1)], back, (_, i) => {
    if (!f) return null
    const a = r[i], b = r[(i + 1) % r.length]
    return hide && hide(a, b) ? null : [glass, f]
  }, null)
  capPoly(roof, r, z1)
}

// Base: the 26 m strip and the 77 m podium; walls inside the tower are skipped.
tier(strip, 0, 26, base, (a, b) => Math.abs(a[0] - 19.6) < 0.3 && Math.abs(b[0] - 19.6) < 0.3)
tier(podium, 0, 77, base)
// The shaft, rounding a corner at each setback.
tier(t1, 77, 135, B)
tier(t2, 135, 173, B)
tier(t3, 173, 210, B)
tier(t4, 210, 248, B)
tier(t5, 248, 276, B)
// The crown to 308 m; its notches stop at 282–290 m on small floors.
tier(crown, 276, 308, { ...B, row: 10.4, head: 1.4 })
for (const [ring, z] of [[[[-9.9, -19.8], [2.8, -19.8], [0.8, -15.2]], 282], [[[-15.4, -3.7], [-10.8, -1.7], [-15.4, 8.8]], 286], [[[1.0, 14.5], [2.8, 10.1], [13.8, 14.5]], 290], [[[19.5, -14.3], [19.6, -2.0], [15.0, -4.0]], 288]] as [XY[], number][]) {
  tier(ring, 276, z, null, undefined, glass) // glazed, as the notch's floors are
}

finishModel('35 Hudson Yards', 'nyc-35-hudson-yards', [
  { part: glass, material: { ...windowVariant(1, 0xaabfcf), name: 'window' } },
  { part: stone, material: finish('hy35-limestone', 0xe9e1d2) },
  { part: roof, material: PALETTE.roof },
], { bearing: 29, osm: 'way/468721008', height: 308 })
