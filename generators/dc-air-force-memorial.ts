/**
 * United States Air Force Memorial, Arlington, Virginia — procedural, CC0-1.0.
 *
 *   bun generators/dc-air-force-memorial.ts
 *
 * Map frame: x east, y north, z up, metres. The origin is the middle of the
 * three spire bases (lng -77.0662258, lat 38.8685145), on the plaza.
 * Bearing 0: the bases are placed as OSM has them, in true north.
 *
 * Three stainless-steel spires (James Ingo Freed, 2006), 270, 231 and 201 ft
 * tall, rising from points 120° apart and peeling away from each other like
 * the contrails of a bomb burst. Each is a triangular blade tapering to a
 * point, near-vertical at the foot and curving outward as it climbs.
 *
 * Evidence
 *  - OSM (measured): the three spire footprints, way/1097795824 (height
 *    82.3), way/1097795825 (61.2) and way/1097795826 (70.4), each a triangle
 *    about 3.7 × 3.4 m, tagged historic=memorial, material=stainless_steel.
 *    None is a building, and the memorial's areas (way/38314833,
 *    way/171790083) are historic=monument, not buildings, so the model
 *    replaces nothing.
 *  - Published (Wikipedia): spires 201 ft (61 m) to 270 ft (82 m); stainless
 *    steel plate, concrete-filled in the lower two-thirds.
 *  - Photos (Wikimedia Commons): Duane Lempke's three aerials (CC0) from the
 *    north-east, south-west and above; Arlington County's aerial (CC BY-SA
 *    2.0); Tony Webster (CC BY-SA 2.0) from the foot of the spires; Thomson200
 *    (CC0) from the approach. Used for the curvature, the taper and the
 *    triangular section.
 *
 * Estimated: the outward sweep of each tip, about a fifth of the spire's
 * height (read off the aerials, where the near-radial spire stands straight
 * and the other two splay to the sides), growing with the height to the
 * power 1.8: a gentle arc the whole way up, as the aerials show, not a hook
 * at the top. The section is OSM's triangle, tapering to a 0.2 m tip.
 *
 * The dais under the spires is drawn as a low hexagonal plinth, 0.8 m high
 * (estimated); its paving and star are ground.
 *
 * Left out: the Honor Guard statues, the inscription walls and the glass
 * contemplation wall, all small and some way from the spires; the plaza and
 * its star are ground.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { prism, smooth, type XY } from './dc-wwii-memorial'

const steel = new Part()
const dais = new Part()

// OSM triangles, relative to the anchor (OSM's centre at x 41.1, y -18.3 from
// the lead's reference point), with each spire's published height.
const C: XY = [41.1, -18.3]
const SPIRES: { tri: XY[]; h: number }[] = [
  { tri: [[34.1, -9.7], [30.3, -9.0], [31.6, -12.4]], h: 82.3 },
  { tri: [[40.2, -29.3], [36.5, -28.6], [37.7, -32.0]], h: 61.2 },
  { tri: [[55.4, -13.8], [51.7, -13.1], [52.9, -16.5]], h: 70.4 },
].map(s => ({ tri: s.tri.map(([x, y]) => [x - C[0], y - C[1]] as XY), h: s.h }))

const SWEEP = 0.2, LEVELS = 16
for (const { tri, h } of SPIRES) {
  const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3
  const r = Math.hypot(cx, cy), out: XY = [cx / r, cy / r]
  // Counter-clockwise from above.
  const ccw = ((tri[1][0] - tri[0][0]) * (tri[2][1] - tri[0][1]) - (tri[1][1] - tri[0][1]) * (tri[2][0] - tri[0][0])) > 0 ? tri : [...tri].reverse()
  smooth(steel, p => {
    const rings: V3[][] = []
    for (let k = 0; k <= LEVELS; k++) {
      const t = k / LEVELS
      const z = h * t
      const off = SWEEP * h * Math.pow(t, 1.8)
      // Taper from the OSM triangle to a slim tip; the section stays square to
      // the ground, which is how the plates read in the photos.
      const s = 1 - t * 0.94
      rings.push(ccw.map(([x, y]) => [cx + (x - cx) * s + out[0] * off, cy + (y - cy) * s + out[1] * off, z] as V3))
    }
    p.loft(rings)
    p.cap(rings[LEVELS], true)
  }, 45)
}

// The low triangular dais the spires stand on (aerials), its corners just
// outside the spire feet; 0.8 m, estimated against people in the photos.
{
  const corners = SPIRES.map(({ tri }) => {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3
    const r = Math.hypot(cx, cy)
    return [cx + (cx / r) * 2.6, cy + (cy / r) * 2.6] as XY
  })
  // Cut each corner so the dais is a hexagon with short ends at the spires.
  const ring: XY[] = []
  for (let i = 0; i < 3; i++) {
    const a = corners[i], b = corners[(i + 1) % 3], c = corners[(i + 2) % 3]
    const towards = (p: XY, q: XY, d: number): XY => {
      const l = Math.hypot(q[0] - p[0], q[1] - p[1])
      return [p[0] + (q[0] - p[0]) * d / l, p[1] + (q[1] - p[1]) * d / l]
    }
    ring.push(towards(a, c, 2.2), towards(a, b, 2.2))
  }
  prism(dais, ring, 0, 0.8, 0.12)
}

const { save } = await import('./dc-wwii-memorial')
await save('dc-air-force-memorial', 'United States Air Force Memorial', [
  // Polished stainless steel: a light, cool grey that takes the sky.
  { part: steel, material: finish('stainless-steel', 0xc8ccd0, 0.35) },
  // The dais's dark granite paving edge, pulled light.
  { part: dais, material: finish('af-granite', 0x9a9c9c) },
], { bearing: 0 })
