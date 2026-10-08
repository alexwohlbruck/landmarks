/**
 * Mandalay Bay, Las Vegas: the gold Y-shaped hotel tower and, beside it,
 * the W Las Vegas tower (THEhotel, later Delano) in the same gold glass.
 * Procedural, CC0-1.0.
 * bun generators/lv-mandalay-bay.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the plan is drawn in
 * OSM's own orientation (the north arm runs within 1° of true north). The
 * origin is the area centroid of the main tower's outline, way/27858550,
 * which falls on the hub of the Y.
 *
 * Published (Wikipedia, "Mandalay Bay" and "W Las Vegas"): the tower opened
 * in 1999, 43 storeys, built out in a Y, with rows of gold neon tubing up
 * its sides between mirrored gold windows; the Four Seasons occupies floors
 * 35 to 39. W Las Vegas (2003) is also 43 storeys and has "the same exterior
 * appearance as the main resort". A slackline record was set 480 ft (146 m)
 * up, at the roof.
 *
 * Measured, from OSM: both footprints (way/27858550, 146 m tagged;
 * way/118347176, 148 m tagged), simplified to 0.4 m. The Y's arms are about
 * 20 m wide and 85 m from the hub, 120° apart, with chamfered ends; the W is
 * an L, an 83 x 18 m slab with a 21 x 61 m wing running north.
 *
 * Photos (Wikimedia Commons):
 * - "Mandalay Bay Hotel Las Vegas (July 15 2008).jpg", Cyberdoomslayer,
 *   CC BY-SA 4.0: the north and south-west arms, the pale pilasters, the
 *   white crown band with the sign, the stone base;
 * - "Mandalay Bay hotel.jpg", Supercarwaar, CC BY-SA 4.0: the crown and the
 *   gold band under it, the recessed glass at the hub, pilaster spacing;
 * - "Mandalay Bay Resort and Casino from McCarran International Airport"
 *   (15700532911), Ken Lund, CC BY-SA 2.0: the tower from the south-east;
 * - "Las Vegas Strip 006.Mandalay Bay Complex", Zyrckonicks, CC BY-SA 4.0,
 *   and "Delano Hotel Las Vegas.jpg", EconomicOldenburger, CC BY-SA 4.0: the
 *   W tower beside it, gold with pilasters and a pale crown;
 * - "Mandalay Bay Resort and Casino.jpg", Ken Lund, CC BY-SA 2.0: at night,
 *   the glass is lit by rooms, so the gold walls are a `window-2` wall.
 *
 * Estimated: the stone base at 10 m, the crown band at 9 m with an 8 m gold
 * band under it where the fins stop, the hub's 6 m lift and its extent
 * (13 m out along each arm, from the photos), the fin spacing (about 9 m).
 *
 * Checked and not modelled: a sawtooth of facets along the wing faces. The
 * OSM outline (31 nodes) and the NAIP roofline give each wing side as one
 * straight edge, and the frontal Supercarwaar photo shows one flat plane of
 * glass between the fins; the bands of fins seen crowded together are the
 * curved inner junctions between arms, seen obliquely, which are modelled. The casino and convention podiums
 * (way/116660358 and others) are left to the map; the signs are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { block, prism, type XY } from './lv-luxor'

const gold = new Part() // gold glass walls
const trim = new Part() // pilasters and the crown band
const roof = new Part()
const base = new Part() // the stone base

const Y_TOWER: XY[] = [
  [-10.2, 98.5], [-4.8, 103.8], [4.4, 103.8], [8.9, 98.5], [10.0, 19.7], [11.3, 15.1], [15.4, 6.5], [22.5, -0.9], [90.8, -40.0],
  [92.5, -47.0], [87.4, -55.5], [80.4, -57.3], [13.2, -18.7], [7.7, -17.1], [3.1, -16.2], [-6.5, -16.5], [-14.2, -19.2],
  [-80.2, -57.4], [-87.6, -55.4], [-92.6, -47.1], [-90.5, -40.2], [-22.8, -1.1], [-18.8, 2.7], [-15.6, 7.0], [-13.4, 11.0], [-10.5, 19.7],
]
const W_TOWER: XY[] = [
  [-250.9, 183.1], [-265.7, 183.1], [-268.7, 180.7], [-268.9, 104.0], [-227.3, 104.0], [-188.6, 102.6], [-186.2, 104.8],
  [-186.1, 108.2], [-184.2, 109.7], [-184.0, 115.1], [-185.9, 117.2], [-186.1, 119.9], [-188.1, 122.1], [-247.1, 122.6], [-248.5, 180.6],
]

const BASE = 10, CROWN = 9, BAND = 8, LIFT = 6, HUB = 13

/** The outward side of each edge, for a ring whichever way it turns. */
const area = (poly: XY[]) => poly.reduce((s, p, i) => {
  const q = poly[(i + 1) % poly.length]
  return s + p[0] * q[1] - q[0] * p[1]
}, 0) / 2

/**
 * Fins: broad pale strips, 2.2 m wide and 0.5 m proud, on the long faces
 * about 9 m apart (a quarter of a bay wide, as in the Supercarwaar photo),
 * and a pair on each arm end, from the base to the tall gold band under the
 * crown. Each is a three-sided box, so it shows edge-on.
 */
function pilasters(poly: XY[], z0: number, z1: number, spacing = 9) {
  const ccw = area(poly) > 0
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 8) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n: XY = ccw ? [u[1], -u[0]] : [-u[1], u[0]]
    const count = Math.round(L / spacing) - 1
    const at0 = L < 12 ? [0.18 * L, 0.82 * L] : Array.from({ length: count }, (_, k) => ((k + 1) * L) / (count + 1))
    for (const s of at0) {
      const w = 1.1, d = 0.5
      const at = (t: number, o: number, z: number): V3 => [a[0] + u[0] * t + n[0] * o, a[1] + u[1] * t + n[1] * o, z]
      const p0 = at(s - w, 0, z0), p1 = at(s + w, 0, z0), q0 = at(s - w, d, z0), q1 = at(s + w, d, z0)
      const up = (p: V3): V3 => [p[0], p[1], z1]
      // Front, two sides and the top, wound outward.
      const quad = (a1: V3, b1: V3, c1: V3, d1: V3) => {
        const nx = (b1[1] - a1[1]) * (c1[2] - a1[2]) - (b1[2] - a1[2]) * (c1[1] - a1[1])
        const ny = (b1[2] - a1[2]) * (c1[0] - a1[0]) - (b1[0] - a1[0]) * (c1[2] - a1[2])
        const mx = (a1[0] + c1[0]) / 2 - (a[0] + u[0] * s), my = (a1[1] + c1[1]) / 2 - (a[1] + u[1] * s)
        if (nx * mx + ny * my >= 0) trim.quad(a1, b1, c1, d1)
        else trim.quad(d1, c1, b1, a1)
      }
      quad(q0, q1, up(q1), up(q0))
      quad(p0, q0, up(q0), up(p0))
      quad(q1, p1, up(p1), up(q1))
      trim.quad(up(q0), up(q1), up(p1), up(p0))
    }
  }
}

/** Clip a polygon to the side of a line where dot(p, dir) >= k (or <= k). */
function clip(poly: XY[], dir: XY, k: number, keepAbove: boolean): XY[] {
  const f = (p: XY) => (p[0] * dir[0] + p[1] * dir[1] - k) * (keepAbove ? 1 : -1)
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q)
    if (fp >= 0) out.push(p)
    if (fp >= 0 !== fq >= 0) {
      const t = fp / (fp - fq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

/** Glass from the base up to `top - CROWN`, then the pale crown band and roof. */
function body(poly: XY[], top: number) {
  prism(gold, gold, poly, BASE, top - CROWN)
  prism(trim, roof, poly, top - CROWN, top)
}

/**
 * The Y: stone base, gold glass, the pale crown. The hub where the arms meet
 * rises 6 m above the wings with its own crown: every photo taken down an
 * arm shows it over the arm end (Cyberdoomslayer from the north, Ken Lund
 * from the south-east, the small sign above the hub in the Supercarwaar
 * photo), while the far arm ends seen side-on keep the wing height.
 */
const H = 146
prism(base, base, Y_TOWER, 0, BASE)
const arms: XY[] = [[0, 1], [Math.cos(-Math.PI / 6), Math.sin(-Math.PI / 6)], [-Math.cos(-Math.PI / 6), Math.sin(-Math.PI / 6)]]
let hub = Y_TOWER
for (const dir of arms) {
  body(clip(Y_TOWER, dir, HUB, true), H)
  hub = clip(hub, dir, HUB, false)
}
body(hub, H + LIFT)
pilasters(Y_TOWER, BASE, H - CROWN - BAND)

// W Las Vegas: the same skin, no raised ends.
prism(base, base, W_TOWER, 0, BASE)
body(W_TOWER, 148)
pilasters(W_TOWER, BASE, 148 - CROWN - BAND)
block(trim, roof, -262, -244, 108, 120, 148, 152, 0.6)

const parts = [
  { part: gold, material: windowVariant(2, 0xd6b46c) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: base, material: PALETTE.stone },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Mandalay Bay', parts, {
  license: 'CC0-1.0',
  height: 152,
  frame: 'Y up, -Z north, +X east, metres; origin at the way/27858550 centroid; bearing 0',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/lv-mandalay-bay.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
