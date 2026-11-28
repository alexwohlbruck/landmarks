/**
 * Vittoriano (Altare della Patria; Monumento Nazionale a Vittorio Emanuele
 * II), Piazza Venezia, Rome: procedural, CC0-1.0, no textures.
 *   bun generators/rome-vittoriano.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 343.3 (the
 * front faces Piazza Venezia, a little west of north; the bearing is the
 * direction of the long edges of OSM's five stair parts, 73.3 deg, less
 * 90). Origin: the centroid of the OSM outline relation/1849830, at
 * 12.4830772, 41.8946398. The monument is symmetric about x = -3.0 (the
 * axis through the stair, the Altare and the propylaea in OSM); everything
 * here is built in u = x + 3 and mirrored, except the podium, whose plan is
 * OSM's own (its east and west wings differ).
 *
 * Heights are from the level of Piazza Venezia (y = 0), the reference OSM's
 * part heights share: the stair parts rise 1-5 m, the terrace 6, the
 * Altare 20, the equestrian group 20-44 (published 24.8 m with its base:
 * 20 + 24.8 = 44.8).
 *
 * Modelled: the entrance stair (41 m wide, 34 long) from the piazza to the
 * Altare terrace (6 m) with the two bronze groups (Il Pensiero, L'Azione)
 * on their pedestals at its foot; the front corner blocks (8 m) with the
 * four marble groups on pedestals; the side stairs to the 16 m blocks; the
 * flights rising sideways to the Altare; the Altare della Patria (20 m),
 * curved in front, with the gold ground of the statue of Roma; the
 * equestrian statue of Victor Emmanuel II on its stepped plinth; the
 * 25 m podium on OSM's plan with its windows; the 30 m terraces before the
 * propylaea with the four columns carrying gilded Victories; the portico
 * (sommoportico): a 10 m stylobate, 16 Corinthian columns 15 m tall on a
 * concave arc (radius 115 m), the dark doors and the dark mosaic band on
 * its back wall, the entablature, the attic and the cornice at 60 m; the
 * two propylaea: a tetrastyle porch with a pediment and a glazed gable
 * roof, columns in antis on the outer side and at the back, the cella, the
 * entablature, the tall attic to 66.8 m, the stepped top to 69.6 m (the
 * published 70 m roof) and the bronze quadrigas with the winged Victories
 * to about 80.5 m (published 81 m).
 *
 * Sources
 * - OSM (ODbL), fetched 2026-11-28 through the API map call: the outline
 *   relation/1849830 (building=public, "Altare della Patria") and its parts:
 *   podium relation/19432906 (25 m); stair relation/19781001-19781005
 *   (1-5 m); terrace relation/19781006 (6); corner blocks
 *   relation/19432900, 19432901 (8); side stairs relation/19781007, 19781008
 *   (14, skillion); 16 m blocks relation/19432902, 19432903; flights
 *   relation/19781009, 19781010 (18, skillion); Altare relation/19432904
 *   (20); equestrian group relation/19780991-19780999 (20-44); portico
 *   relation/19528316 (52), relation/19528317 (25-35), relation/19528319
 *   (52-60); 16 columns way/1425082377-1425082392 (35-52); propylaea
 *   relation/19432898, 19432899 (55-62), porches relation/19432896,
 *   19432897 (55-60 gabled), relation/19528312, 19528313 (35), antae
 *   relation/19528308-19528311, walls relation/19778787, 19778788, piers
 *   relation/19778791, 19778792, bases relation/19778789, 19778790
 *   (25-35), terraces relation/19528314, 19528315 (30); porch columns
 *   way/1425082346-1425082353; side and back columns
 *   way/1446568933-1446568949; Victory columns way/1446568921-1446568928;
 *   quadriga stack way/1446694343-1446694350; pedestals
 *   way/1446803467-1446803480; the small roof way/124808520 behind the
 *   portico.
 * - Published: Italian Wikipedia, "Vittoriano" (read 2026-11): 135 m wide,
 *   130 m deep, 70 m high, 81 m with the quadrigas; the portico 72 m long
 *   with 16 columns 15 m tall; the entrance stair 41 m wide and 34 m long;
 *   the Altare terrace 66 m wide; the equestrian statue 12 m high and 10 m
 *   long, 24.8 m with its base; the four marble groups 6 m; Botticino
 *   marble throughout.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Alvesgaspar, "Altar della Patria September 2015-1.jpg", CC BY-SA 4.0
 *     (the front from Piazza Venezia: every tier, the groups, the portico
 *     and propylaea, the colours);
 *     https://commons.wikimedia.org/wiki/File:Altar_della_Patria_September_2015-1.jpg
 *   2 Rabax63, "VittorianoOst.jpg", CC BY-SA 4.0 (from the east: the east
 *     propylaeum's side columns in antis, its porch and gable roof, the
 *     attic and stepped top under the quadriga, the podium's windows);
 *     https://commons.wikimedia.org/wiki/File:VittorianoOst.jpg
 * - Terrain: Mapterhorn has only z13 here. It rises about 17 m from the
 *   piazza to the back of the podium, smoothed; the real ground at the back
 *   is the Capitoline's top, near the podium's 25 m. It also tilts across
 *   the flat piazza, so the map's ground at the stair's foot is 3.3 m over
 *   the lowest ground under the footprint (the west front corner): every
 *   height here is lifted by PIAZZA = 3.3 m, and what stands on the piazza
 *   runs down to y = 0 (terrain check: ok, ok). Elevation 0.
 * - Plan: the podium is OSM's outline simplified to 0.8 m, so its edge can
 *   differ from the shared edge with Santa Maria in Aracoeli by that much.
 *
 * Numbers
 * - From OSM: every plan (podium as mapped; the rest symmetrised about
 *   u = 0, within 1 m of both sides), the tier heights 6, 8, 16, 20, 25,
 *   30, 35, the column positions, the porch and propylaeum plans.
 * - Published: portico columns 15 m (35-50), the equestrian group's 24.8 m,
 *   the roof at 70 m and the quadrigas to 81 m.
 * - Estimated from photo 1 (portico columns 15 m = the scale): the portico
 *   entablature and attic 10 m (to 60, as OSM); the propylaeum columns
 *   18 m (35-53, against the portico's 215 px, 255 px), their entablature
 *   4 m and attic to 66.8; the quadrigas 10.9 m over a 2.8 m stepped top
 *   (OSM's stack 62-70 is lower than the published 70/81); the bronze groups
 *   5.5 m on 5.5 m pedestals (people for scale); the marble groups 5 m on
 *   4 m pedestals; the Victory columns 15 m with 3 m statues.
 * - The flights beside the Altare rise sideways toward it (the diagonal
 *   line of treads in photo 1), from 6 to 20 m.
 * - Simplified: no flags, flagpoles, balusters (solid parapets instead),
 *   reliefs, region statues on the portico cornice, inscriptions, lamps or
 *   fountains (their basins are water, the map's); capitals are flared
 *   bells; the sculpture is bold masses at the real size and pose.
 *
 * Review rework (2026-11-28): tetrastyle porches with stronger pediments
 *   and attic panels; the equestrian group rebuilt bold at 12 m on an 11 m
 *   plinth; the quadrigas as four splayed rearing horses, a chariot with
 *   wheels and a tall winged Victory; the Altare frieze, cornices and
 *   balustrades as bright-marble bands ('trim'); the two corner fountains
 *   (basins and groups as masses; the east basin's rim stands 2.3 m because
 *   the z13 ground tilts up there); a projecting cornice under and over the
 *   portico's attic. For bytes: the stairs are single stepped profiles, the
 *   statue groups single bold figures, the back loggias' three columns are
 *   left out, the glazed roofs share the shade material.
 *
 * Night: the whole monument is floodlit white; the portico's doors and the
 *   windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { earcut, extrude, prism, rect, save, smooth, tube, body, ellipsoid, type XY } from './dc-wwii-memorial'

const marble = new Part()
const bronze = new Part()
const gold = new Part()
const win = new Part()
const trim = new Part() // cornices, balustrade bands, the Altare's frieze: the bright marble
const shade = new Part() // the shadowed walls behind the colonnades

const X0 = -3.0 // the symmetry axis, in the anchor's frame

// ---------------------------------------------------------------- helpers

function tri(p: Part, a: V3, b: V3, c: V3, dir: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] < 0) p.tri(a, c, b)
  else p.tri(a, b, c)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  tri(p, a, b, c, dir)
  tri(p, a, c, d, dir)
}
/** A box from corner ranges; `b` bevels the top edge. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, b = 0, bottom = false) {
  // Bevels only where they catch light at map distance.
  if (Math.abs(x1 - x0) < 6 && Math.abs(y1 - y0) < 6) b = 0
  prism(p, rect((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2), z0, z1, b, bottom)
}
/** The same box on both sides of the axis (a and b are distances from it). */
function pair(p: Part, a0: number, a1: number, y0: number, y1: number, z0: number, z1: number, b = 0, bottom = false) {
  box(p, a0, a1, y0, y1, z0, z1, b, bottom)
  box(p, -a1, -a0, y0, y1, z0, z1, b, bottom)
}
const mirror = (r: XY[]): XY[] => r.map(([u, v]) => [-u, v] as XY).reverse()
/** A flat panel on a wall facing `dir` (x or y), from (a0..a1) along it. */
function panelY(p: Part, y: number, u0: number, u1: number, z0: number, z1: number, out: 1 | -1) {
  quad(p, [u0, y, z0], [u1, y, z0], [u1, y, z1], [u0, y, z1], [0, out, 0])
}
function panelX(p: Part, x: number, y0: number, y1: number, z0: number, z1: number, out: 1 | -1) {
  quad(p, [x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1], [out, 0, 0])
}
/** A surface of revolution: rows of [r, z], `n` sides, smooth. */
function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n: number) {
  smooth(p, m => {
    const rings = prof.map(([r, z]) => Array.from({ length: n }, (_, i) => {
      const a = ((i + 0.5) / n) * Math.PI * 2
      return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
    }))
    m.loft(rings)
  }, 50)
}

/** A Corinthian column: square plinth, tapering shaft, flared capital, abacus. */
function column(cx: number, cy: number, z0: number, z1: number, d: number) {
  const cap = d * 1.15, base = d * 0.55
  // The capital flares out to the abacus' width under the architrave.
  lathe(marble, cx, cy, [[d * 0.52, z0], [d * 0.43, z1 - cap], [d * 0.8, z1]], 6)
}

/**
 * A bold horse facing +y with its hooves at (x, y, z); `s` = scale (1: about
 * 10 m long and 9.8 m to the ears, the equestrian statue's size). `rear`
 * lifts the forelegs. Tubes: widths are vertical radii, depths lateral.
 */
function horse(p: Part, x: number, y: number, z: number, s: number, rear = 0, light = false) {
  const P = (dx: number, dy: number, dz: number): V3 => [x + dx * s, y + dy * s, z + dz * s]
  if (light) {
    // The quadriga's horses: each leg pair one slab, barrel, neck and head.
    tube(p, [P(0, -2.7, 0), P(0, -2.4, 5.2)], [0.6 * s, 0.9 * s], [0.95 * s, 1.0 * s], 4, { capEnds: false })
    tube(p, [P(0, 2.4 + rear * 1.4, rear * 2.6), P(0, 2.2, 5.2)], [0.55 * s, 0.85 * s], [0.95 * s, 1.0 * s], 4, { capEnds: false })
    tube(p, [P(0, -3.4, 6.4), P(0, 0, 6.2), P(0, 3.0, 7.0)], [1.4 * s, 1.95 * s, 1.5 * s], [1.1 * s, 1.4 * s, 1.15 * s], 5)
    tube(p, [P(0, 2.6, 7.6), P(0, 3.9, 10.0), P(0, 5.3, 8.8)], [1.1 * s, 0.6 * s, 0.38 * s], [0.7 * s, 0.45 * s, 0.32 * s], 4)
    return
  }
  // Hind legs, forelegs (lifted and bent when rearing), as pairs.
  for (const sx of [-0.7, 0.7]) {
    tube(p, [P(sx, -2.6, 0), P(sx, -2.9, 2.4), P(sx, -2.4, 5.2)], [0.45 * s, 0.6 * s, 0.9 * s], [0.4 * s, 0.5 * s, 0.7 * s], 4, { capEnds: false })
    tube(p, [P(sx, 2.4 + rear * 1.4, rear * 2.6), P(sx, 2.6 + rear * 0.3, 2.6 + rear * 1.4), P(sx, 2.2, 5.2)], [0.42 * s, 0.55 * s, 0.85 * s], [0.38 * s, 0.48 * s, 0.7 * s], 4, { capEnds: false })
  }
  // The barrel, the chest rising to the neck, the head, the tail.
  tube(p, [P(0, -3.4, 6.4), P(0, -1.2, 6.2), P(0, 1.2, 6.4), P(0, 3.0, 7.0)], [1.4 * s, 1.95 * s, 1.95 * s, 1.5 * s], [1.15 * s, 1.5 * s, 1.5 * s, 1.2 * s], 6)
  tube(p, [P(0, 2.6, 7.6), P(0, 3.5, 9.0), P(0, 3.9, 10.0)], [1.2 * s, 0.85 * s, 0.6 * s], [0.75 * s, 0.6 * s, 0.45 * s], 5)
  tube(p, [P(0, 3.6, 10.1), P(0, 4.6, 9.6), P(0, 5.3, 8.8)], [0.6 * s, 0.5 * s, 0.38 * s], [0.45 * s, 0.4 * s, 0.32 * s], 4)
  tube(p, [P(0, -3.5, 7.2), P(0, -4.2, 5.6), P(0, -4.3, 3.8)], [0.4 * s, 0.45 * s, 0.3 * s], undefined, 4)
}

/** A standing draped figure: rows of [z, rx, ry] from its feet, and a head. */
function figure(p: Part, x: number, y: number, z: number, h: number, w: number) {
  body(p, [[z, w * 0.5, w * 0.4, x, y], [z + h * 0.55, w * 0.42, w * 0.32, x, y], [z + h * 0.8, w * 0.38, w * 0.27, x, y], [z + h * 0.86, w * 0.18, w * 0.18, x, y]], 5)
  body(p, [[z + h * 0.86, w * 0.12, w * 0.12, x, y], [z + h * 0.92, w * 0.17, w * 0.17, x, y], [z + h, w * 0.1, w * 0.1, x, y]], 5)
}
/** A pair of wings rising behind a figure, as thick slabs. */
function wings(p: Part, x: number, y: number, z: number, span: number, h: number) {
  for (const s of [-1, 1]) {
    const a: V3 = [x + s * 0.2, y - 0.3, z], b: V3 = [x + s * span, y - 0.9, z + h * 0.55], c: V3 = [x + s * span * 0.75, y - 1.1, z + h]
    const t = 0.3
    tri(p, a, b, c, [0, 1, 0])
    tri(p, [a[0], a[1] - t, a[2]], [b[0], b[1] - t, b[2]], [c[0], c[1] - t, c[2]], [0, -1, 0])
  }
}

// ---------------------------------------------------------------- the front

// The terrace (6 m): the whole stage between the corner blocks, the stair's
// head curving out to it (OSM relation/19781006, symmetrised).
{
  const half: XY[] = [[0, 57.6], [19.2, 57.6], [21.7, 57.3], [24.3, 56.6], [27.2, 55.3], [29.9, 53.3], [31.8, 51.1], [33.3, 49.2], [37.2, 49.2], [37.2, 6.3], [0, 6.3]]
  const ring: XY[] = [...half.slice(1, -1), ...mirror(half.slice(1, -1))]
  extrude(marble, ring, 0, 6, undefined, { caps: [false, true] })
}
// Parapets along the curved head of the terrace.
{
  const pts: XY[] = [[19.2, 57.6], [21.7, 57.3], [24.3, 56.6], [27.2, 55.3], [29.9, 53.3], [31.8, 51.1], [33.3, 49.2]]
  const inner = pts.map(([u, v]) => [u * 0.975, v - 0.6] as XY)
  const band: XY[] = [...pts, ...inner.reverse()]
  for (const s of [-1, 1]) extrude(trim, band.map(([u, v]) => [s * u, v] as XY), 6, 7.3, undefined, { caps: [false, true] })
}

// The entrance stair: 15 treads of 0.4 m from the piazza to the terrace.
{
  const N = 12, y0 = 87.9, y1 = 57.6
  extrude(marble, sawtooth(y0, y1, 0, 6, N), -19.2, 19.2, (v, z, u) => [u, v, z], { caps: [false, false] })
  // The stair's side walls, stepping up with it.
  for (const s of [-1, 1]) {
    face(marble, [[y0, 0], [y0, 0.9], [y1, 6.9], [y1, 0]], (v, w) => [s * 19.2, v, w], [-s, 0, 0])
    face(marble, [[y0, 0], [y0, 0.9], [y1, 6.9], [y1, 0]], (v, w) => [s * 20.0, v, w], [s, 0, 0])
    quad(marble, [s * 19.2, y0, 0.9], [s * 20.0, y0, 0.9], [s * 20.0, y1, 6.9], [s * 19.2, y1, 6.9], [0, 0.2, 1])
    quad(marble, [s * 19.2, y0, 0], [s * 20.0, y0, 0], [s * 20.0, y0, 0.9], [s * 19.2, y0, 0.9], [0, 1, 0])
  }
}

/** A stair's side profile in (along, up): from `a0` (bottom, height z0) to `a1` (top, z1) in n steps. */
function sawtooth(a0: number, a1: number, z0: number, z1: number, n: number): XY[] {
  const pts: XY[] = [[a0, z0 - 0.001 > 0 ? 0 : 0]]
  for (let i = 0; i < n; i++) {
    const a = a0 + ((a1 - a0) * i) / n, z = z0 + ((z1 - z0) * (i + 1)) / n
    pts.push([a, z], [a + (a1 - a0) / n, z])
  }
  pts.push([a1, 0])
  return pts
}
/** A flat polygon in (v, w) placed by `at`, facing `dir`. */
function face(p: Part, ring: XY[], at: (u: number, v: number) => V3, dir: V3) {
  for (const [i, j, k] of earcut(ring)) tri(p, at(...ring[i]), at(...ring[j]), at(...ring[k]), dir)
}

// The two bronze groups on their pedestals at the stair's foot (the tabs
// in OSM's outline: u ±21.1, 3.8 x 5.3 m).
for (const s of [-1, 1]) {
  const cx = s * 21.1, cy = 85.2
  box(marble, cx - 2.0, cx + 2.0, cy - 2.7, cy + 2.7, 0, 4.9)
  box(trim, cx - 2.3, cx + 2.3, cy - 2.9, cy + 2.9, 4.9, 5.6)
  figure(bronze, cx, cy + 0.2, 5.6, 5.4, 3.0)
  wings(bronze, cx, cy - 0.2, 8.6, 2.2, 3.0)
}

// The front corner blocks (8 m), their side stairs to the 16 m blocks, and
// the 16 m blocks against the podium (OSM, symmetrised).
pair(marble, 37.2, 56.5, 30.6, 49.2, 0, 8, 0.15)
pair(trim, 36.9, 56.8, 30.3, 49.7, 7.4, 8.0) // cornice
pair(trim, 37.2, 56.5, 48.9, 49.5, 8, 9.4) // front balustrade
for (const s of [-1, 1]) extrude(marble, sawtooth(30.8, 20.9, 8, 16, 5), s * 38.2, s * 55.5, (v, z, u) => [u, v, z], { caps: [false, false] })
for (const s of [-1, 1]) for (const [a, b] of [[37.2, 38.2], [55.5, 56.5]]) {
  // The side stairs' walls, their balustrades stepping up with them.
  const prof: XY[] = [[30.8, 0], [30.8, 9.4], [20.9, 17.2], [20.9, 0]]
  extrude(trim, prof, s * a, s * b, (v, z, u) => [u, v, z])
}
pair(marble, 37.2, 56.5, 11.2, 21.0, 0, 16, 0.15)
pair(trim, 36.9, 56.8, 10.9, 21.3, 15.4, 16.0)
pair(trim, 37.2, 56.5, 20.5, 21.1, 16, 17.2)

// The four marble groups on their pedestals on the corner blocks (OSM
// way/1446803467-1446803470: u ±36.6 and ±55.4, y 47.1).
for (const a of [38.6, 54.3]) for (const s of [-1, 1]) {
  const cx = s * a, cy = 46.6
  box(trim, cx - 1.7, cx + 1.7, cy - 1.7, cy + 1.7, 8, 12.2)
  figure(marble, cx, cy, 12.2, 5.6, 3.0)
}

// The two fountains at the front corners (the Adriatic, east, and the
// Tyrrhenian, west): a basin standing out of the corner block's front and
// the sculpture group against the wall, as simple masses.
for (const s of [-1, 1]) {
  const cx = s * 46.8, cy = 49.4
  prism(trim, Array.from({ length: 5 }, (_, i) => {
    const a = (Math.PI * i) / 4
    return [cx + 6.0 * Math.cos(a), cy + 4.5 * Math.sin(a)] as XY
  }), 0, s > 0 ? 2.3 : 0.9, 0) // east rim raised to the map's tilted ground there
  box(marble, cx - 3.0, cx + 3.0, cy, cy + 1.6, 0, 2.4)
  figure(marble, cx, cy + 1.2, 2.4, 4.6, 3.2)
}

// The flights beside the Altare, rising sideways toward it, 6 to 20 m.
for (const s of [-1, 1]) extrude(marble, sawtooth(37.2, 16.8, 6, 20, 8).map(([a, z]) => [s * a, z] as XY), 6.3, 23.2, (u, z, v) => [u, v, z], { caps: [false, true] })

// The Altare della Patria (20 m): sides straight, the front curving out to
// the flat centre with the statue of Roma on her gold ground.
{
  const half: XY[] = [[2.6, 31.8], [7.0, 31.0], [11.0, 29.6], [14.4, 27.6], [16.8, 25.6], [16.8, 6.3]]
  const ring: XY[] = [...mirror(half), ...half]
  extrude(marble, ring, 6, 18.8)
  // The top cornice, proud, in the bright marble.
  const out: XY[] = ring.map(([u, v]) => [u * 1.03, v > 10 ? v + 0.45 : v] as XY)
  extrude(trim, out, 18.3, 20, undefined, { caps: [true, true] })
  // The frieze of the Altare: the relief band either side of Roma, as a
  // bright band standing out of the wall, and its base moulding.
  const fr: XY[] = ring.map(([u, v]) => [u * 1.015, v > 10 ? v + 0.3 : v] as XY)
  extrude(trim, fr, 9.0, 15.2, undefined, { caps: [false, true] })
  extrude(trim, ring.map(([u, v]) => [u * 1.025, v > 10 ? v + 0.4 : v] as XY), 6.0, 7.2, undefined, { caps: [false, true] })
  // The gold ground behind Roma, her niche, and her figure.
  panelY(gold, 32.15, -2.0, 2.0, 8.4, 16.6, 1)
  figure(marble, 0, 32.6, 8.8, 5.6, 1.6)
}

// The equestrian statue on its plinth (published: 24.8 m with the base,
// the bronze 12 m high and 10 m long; OSM relation/19780991-19780999): the
// plinth from the Altare's top at 20 m to 31 m, the bronze to 43 m, reaching
// into the colonnade's lower third as in photo 1.
{
  const cy = 17.0, z = 31.0
  box(trim, -4.6, 4.6, cy - 7.4, cy + 7.4, 20, 22.5, 0.2)
  box(marble, -3.6, 3.6, cy - 6.6, cy + 6.6, 22.5, 29.6, 0.2)
  box(trim, -4.0, 4.0, cy - 7.0, cy + 7.0, z - 1.4, z, 0.2)
  horse(bronze, 0, cy - 0.4, z, 1.0, 0.35)
  // The king: thighs astride the barrel, torso, arms, head and helmet.
  for (const s of [-1, 1]) tube(bronze, [[s * 0.9, cy - 0.6, z + 8.6], [s * 1.6, cy + 0.2, z + 7.2], [s * 1.5, cy + 0.1, z + 5.6]], [0.5, 0.45, 0.35], [0.45, 0.4, 0.35], 4)
  tube(bronze, [[0, cy - 0.7, z + 8.2], [0, cy - 0.5, z + 9.8], [0, cy - 0.35, z + 11.0]], [0.8, 0.8, 0.6], [1.15, 1.0, 0.75], 6)
  for (const s of [-1, 1]) tube(bronze, [[s * 1.0, cy - 0.4, z + 10.6], [s * 1.25, cy + 0.6, z + 9.4], [s * 0.6, cy + 1.6, z + 9.0]], [0.3, 0.28, 0.24], undefined, 4)
  ellipsoid(bronze, [0, cy - 0.3, z + 11.6], [0.5, 0.55, 0.6], 6, 3)
  ellipsoid(bronze, [0, cy - 0.55, z + 12.2], [0.28, 0.65, 0.35], 6, 3)
}

// ---------------------------------------------------------------- the podium (25 m)

const PODIUM: XY[] = ([[-36.8, 11.4], [-36.7, 6.3], [33.0, 6.0], [33.0, 14.1], [54.0, 14.8], [54.2, 5.5], [60.2, 5.4], [60.3, -20.0], [72.8, -20.0], [73.3, -43.1], [70.7, -43.2], [71.0, -70.9], [61.0, -70.8], [61.0, -73.1], [34.2, -72.2], [35.8, -51.4], [13.0, -51.8], [-44.9, -49.7], [-45.5, -55.9], [-50.7, -54.5], [-51.1, -61.3], [-71.7, -57.2], [-72.3, -17.0], [-66.8, -16.9], [-66.9, 7.0], [-60.2, 7.0], [-60.2, 11.2]] as XY[])
  .map(([x, y]) => [x - X0, y] as XY)
extrude(marble, PODIUM, 0, 24.2, undefined, { caps: [false, true] })
extrude(trim, PODIUM.map(([u, v]) => [u * 1.004, v + (v > 0 ? 0.15 : -0.15)] as XY), 24.2, 25)
// Its front parapet behind the flights, and the windows on its sides and back.
pair(trim, 16.8, 36.2, 6.2, 6.8, 25, 26.4)
for (const s of [-1, 1]) {
  const X = s > 0 ? 76.3 + 0.04 : -69.3 - 0.04
  for (const yy of [-27, -32, -37]) panelX(win, X, yy - 0.9, yy + 0.9, 19.5, 22.5, s as 1 | -1)
  const X2 = s > 0 ? 74.0 + 0.04 : -63.9 - 0.04
  for (const yy of [-50, -56, -62]) panelX(win, X2, yy - 0.9, yy + 0.9, 19.5, 22.5, s as 1 | -1)
}
for (const uu of [-34, -26, -18, -10, 10, 18, 26, 34]) panelY(win, -51.4 - 0.05, uu - 0.9, uu + 0.9, 19.5, 22.5, -1)

// ---------------------------------------------------------------- the portico

// The colonnade's arc: centre (0, YC), radius R through the column centres
// (OSM: centre column line at y -32.4, the ends at u ±31.5, y -28.0).
const R = 114.9, YC = -32.4 + R
const arcY = (u: number, r: number) => YC - Math.sqrt(r * r - u * u)
const BACK = -44.0, PW = 33.6
const arcRing = (r: number, n = 8): XY[] => {
  const pts: XY[] = []
  for (let i = 0; i <= n; i++) {
    const u = -PW + (2 * PW * i) / n
    pts.push([u, arcY(u, r)])
  }
  return [...pts, [PW, BACK], [-PW, BACK]]
}
// The stylobate (25-35), its parapet, the floor of the portico.
extrude(marble, arcRing(R - 3.6), 25, 34.2, undefined, { caps: [false, true] })
extrude(trim, arcRing(R - 4.0), 34.0, 35, undefined, { caps: [false, true] })
// The back wall: dark doors in every bay and the dark mosaic band.
extrude(marble, arcRing(R + 4.3), 35, 50.4, undefined, { caps: [false, true] })
const COLS = 16, SP = 4.2
const colU = Array.from({ length: COLS }, (_, i) => (i - (COLS - 1) / 2) * SP)
for (let i = 0; i <= COLS; i++) {
  const u = i === 0 ? colU[0] - SP / 2 : i === COLS ? colU[COLS - 1] + SP / 2 : (colU[i - 1] + colU[i]) / 2
  if (Math.abs(u) > PW - 1.2) continue
  const r = R + 4.3 - 0.05
  const w = 1.25
  const a = Math.asin((u - w) / r), b = Math.asin((u + w) / r)
  const p0: V3 = [r * Math.sin(a), YC - r * Math.cos(a), 0], p1: V3 = [r * Math.sin(b), YC - r * Math.cos(b), 0]
  quad(win, [p0[0], p0[1], 35.4], [p1[0], p1[1], 35.4], [p1[0], p1[1], 40.2], [p0[0], p0[1], 40.2], [0, 1, 0])
}
{
  // The shadowed back wall behind the columns, from the floor to the band.
  const r = R + 4.3 - 0.03, n = 8
  for (let i = 0; i < n; i++) {
    const u0 = -PW + ((2 * PW) * i) / n, u1 = -PW + ((2 * PW) * (i + 1)) / n
    quad(shade, [u0, arcY(u0, r), 35], [u1, arcY(u1, r), 35], [u1, arcY(u1, r), 50.4], [u0, arcY(u0, r), 50.4], [0, 1, 0])
  }
}
{
  // The mosaic band under the entablature, the whole length of the wall.
  const r = R + 4.3 - 0.05, n = 12
  for (let i = 0; i < n; i++) {
    const u0 = -PW + 1 + ((2 * PW - 2) * i) / n, u1 = -PW + 1 + ((2 * PW - 2) * (i + 1)) / n
    quad(bronze, [u0, arcY(u0, r), 46.6], [u1, arcY(u1, r), 46.6], [u1, arcY(u1, r), 49.6], [u0, arcY(u0, r), 49.6], [0, 1, 0])
  }
}
// The sixteen columns, 15 m.
for (const u of colU) column(u, arcY(u, R), 35, 50.4, 1.55)
// The entablature over the colonnade back to the wall; the main cornice
// projecting in the bright marble; the attic set back above it with its
// band of sunk panels in shade; the crowning cornice, projecting.
extrude(marble, arcRing(R - 1.0), 50.4, 54.0, undefined, { caps: [true, false] })
extrude(trim, arcRing(R - 2.4), 54.0, 55.3, undefined, { caps: [true, true] })
extrude(marble, arcRing(R - 0.4), 55.3, 58.9, undefined, { caps: [false, false] })
extrude(trim, arcRing(R - 1.6), 58.9, 60.2, undefined, { caps: [true, true] })
for (let i = 0; i < 12; i++) {
  const u0 = -PW + 1.6 + ((2 * PW - 3.2) * i) / 12 + 0.6, u1 = -PW + 1.6 + ((2 * PW - 3.2) * (i + 1)) / 12 - 0.6
  const r = R - 0.4 - 0.04
  quad(shade, [u0, arcY(u0, r), 56.0], [u1, arcY(u1, r), 56.0], [u1, arcY(u1, r), 58.2], [u0, arcY(u0, r), 58.2], [0, 1, 0])
}

// ---------------------------------------------------------------- the propylaea

for (const s of [-1, 1] as const) {
  const U = (a: number) => s * a
  const B = (a0: number, a1: number, y0: number, y1: number, z0: number, z1: number, b = 0, bottom = false, p: Part = marble) =>
    box(p, U(a0), U(a1), y0, y1, z0, z1, b, bottom)
  const F = -20.0, K = -43.6 // front and back of the main block
  // Bases (25-35) and the 30 m terrace in front, with its windows.
  B(33.6, 57.5, K, F, 25, 35, 0.15)
  B(36.4, 54.4, -20.5, -11.4, 25, 35, 0.15)
  B(36.3, 54.5, -11.6, -2.0, 25, 30, 0.15)
  for (const a of [42.0, 45.4, 48.8]) panelY(win, -2.0 + 0.04, U(a) - 0.8, U(a) + 0.8, 26.0, 28.6, 1)
  for (const yy of [-24, -28, -32, -36, -40]) panelX(win, U(57.5 + 0.04), yy - 0.7, yy + 0.7, 28.5, 32.0, s)
  // The Victory columns on the terrace.
  for (const a of [38.2, 53.0]) {
    const cx = U(a), cy = -4.6
    box(marble, cx - 0.9, cx + 0.9, cy - 0.9, cy + 0.9, 30, 33.5, 0.1)
    lathe(marble, cx, cy, [[0.5, 33.5], [0.42, 44.0], [0.62, 44.9]], 6)
    box(marble, cx - 0.6, cx + 0.6, cy - 0.6, cy + 0.6, 44.9, 45.3)
    figure(gold, cx, cy, 45.3, 2.6, 0.9)
    wings(gold, cx, cy + 0.4, 46.6, 1.3, 1.9)
  }
  // The main block above 35: the solid wall against the portico, the rear
  // corner pier, the front corner, the cella, and columns in antis on the
  // outer side and at the back.
  B(33.6, 38.6, K, F, 35, 53)
  B(52.2, 57.5, K, -38.6, 35, 53)
  B(54.3, 57.5, -21.4, F, 35, 53)
  B(39.0, 53.2, -38.2, -21.4, 35, 53)
  // The shadowed cella walls behind the side and back columns and the porch.
  panelX(shade, U(53.2 + 0.03), -38.2, -21.4, 35, 53, s)
  panelY(shade, -38.2 - 0.03, U(39.0), U(53.2), 35, 53, -1)
  panelY(shade, -21.4 + 0.03, U(38.4), U(52.3), 35, 53, 1)
  for (const yy of [-23.8, -27.6, -31.4, -35.2]) column(U(55.6), yy, 35, 53, 1.7)
  // (The back loggia's three columns are left out for the byte budget: the
  // back faces the hill and is seen from nowhere; its opening is shade.)
  // The porch: antae, four columns, its entablature, pediment and roof.
  B(36.4, 38.4, -20.5, -11.4, 35, 53)
  B(52.3, 54.4, -20.5, -11.4, 35, 53)
  // Tetrastyle: four columns across the porch's front (photos 1 and 2; OSM
  // maps two of each row), the shade behind them.
  for (const a of [40.1, 43.6, 47.1, 50.6]) column(U(a), -12.9, 35, 53, 1.7)
  B(36.2, 54.6, -20.2, -11.1, 53, 56.0, 0.1)
  B(35.8, 55.0, -20.4, -10.6, 56.0, 56.8, 0, false, trim)
  {
    const a0 = 35.8, a1 = 55.0, m = (a0 + a1) / 2, z0 = 56.8, z1 = 61.6, yf = -11.0, yb = -20.4
    face(marble, [[a0, z0], [a1, z0], [m, z1]], (a, z) => [U(a), yf - 0.4, z], [0, 1, 0])
    quad(shade, [U(a0), yf, z0], [U(m), yf, z1], [U(m), yb, z1], [U(a0), yb, z0], [-s * 0.4, 0, 1])
    quad(shade, [U(m), yf, z1], [U(a1), yf, z0], [U(a1), yb, z0], [U(m), yb, z1], [s * 0.4, 0, 1])
    // Raking cornices, standing proud of the tympanum.
    for (const [ae, d] of [[a0, 1], [a1, -1]] as const) {
      const r: XY[] = [[ae, z0], [m, z1 + 0.05], [m, z1 - 1.0], [ae + d * 1.9, z0]]
      extrude(trim, r.map(([a, z]) => [U(a), z] as XY), yf - 0.4, yf + 0.4, (u, z, w) => [u, w, z])
    }
  }
  // Entablature, attic, cornice and the stepped top.
  B(33.6, 57.5, K, F, 53, 56.0, 0.1)
  B(33.2, 57.9, K - 0.4, F + 0.4, 56.0, 56.8, 0, false, trim)
  B(34.1, 57.0, K + 0.5, F - 0.5, 56.8, 65.4, 0.1)
  B(33.3, 57.8, K - 0.5, F + 0.5, 65.4, 66.8, 0.25, false, trim)
  // The attic's sunk panels on the outer side and the front, in shade.
  for (const yy of [-38.6, -31.8, -25.0]) panelX(shade, U(57.0 + 0.04), yy - 2.4, yy + 2.4, 58.4, 63.6, s)
  for (const a of [38.4, 45.5, 52.6]) panelY(shade, F - 0.5 + 0.04, U(a) - 2.4, U(a) + 2.4, 58.4, 63.6, 1)
  // Pilasters framing the outer side's loggia and its base.
  for (const yy of [-21.0, -40.4]) B(57.5, 58.0, yy - 0.8, yy + 0.8, 25, 53, 0, false, trim)
  B(35.8, 55.3, K + 2.4, F - 2.4, 66.8, 68.2, 0.15)
  B(39.0, 52.1, K + 5.6, F - 5.6, 68.2, 69.6, 0.15)

  // The quadriga: four rearing horses abreast, splayed a little, the
  // chariot with its two wheels, the upright winged Victory.
  {
    const cx = U(45.55), cy = -31.0, z = 69.6, hs = 0.58
    for (const [k, k2] of [[-1.5, -0.25], [-0.5, -0.08], [0.5, 0.08], [1.5, 0.25]]) horse(bronze, cx + k * 2.0 + k2 * 2, cy + 1.2, z, hs, 0.8, true)
    // Chariot body and wheels.
    box(bronze, cx - 1.5, cx + 1.5, cy - 4.0, cy - 1.6, z + 0.6, z + 3.0)
    for (const sx of [-1, 1]) {
      // A wheel as an upright disc facing x, beside the chariot.
      const wx = cx + sx * 1.75, wy = cy - 2.8, wz = z + 1.5, r = 1.5
      const ring: XY[] = Array.from({ length: 6 }, (_, i) => [wy + r * Math.cos((i * Math.PI) / 3), wz + r * Math.sin((i * Math.PI) / 3)] as XY)
      extrude(bronze, ring, wx - 0.2, wx + 0.2, (v, w, u) => [u, v, w])
    }
    figure(bronze, cx, cy - 2.8, z + 2.6, 6.0, 1.8)
    wings(bronze, cx, cy - 2.6, z + 5.6, 3.0, 4.6)
    // Her arm raised high.
    tube(bronze, [[cx, cy - 2.6, z + 7.6], [cx + 0.2, cy - 1.6, z + 10.0]], [0.35, 0.28], undefined, 4)
  }
}

// ---------------------------------------------------------------- write

// Shift the symmetric frame onto the anchor.
// Lift everything above the piazza by PIAZZA, stretching what stands on
// y = 0 down to it (see the header: the map's ground at the stair's foot).
const PIAZZA = 3.3
for (const p of [marble, bronze, gold, win, trim, shade]) for (let i = 0; i < p.pos.length; i += 3) {
  p.pos[i] += X0
  // glTF y is up.
  if (p.pos[i + 1] > 0.001) p.pos[i + 1] += PIAZZA
}

// Floodlight: the marble is lit all over, its tops less; the sculpture dimmer.
const up = (n: V3) => (n[2] > 0.7 ? 0.5 : 1)
const lit = (k: number) => (_p: V3, n: V3) => k * up(n)

await save('rome-vittoriano', 'Vittoriano', [
  // Very white Botticino marble (photos 1 and 2), at the palette's lightness;
  // dark green-grey bronze; the gold of Roma's ground and the Victories.
  { part: marble, material: { ...finish('botticino-marble', 0xe9e4d9), floodlight: lit(1) } },
  { part: bronze, material: finish('vittoriano-bronze', 0x56615b) },
  { part: gold, material: finish('vittoriano-gold', 0xd2b066) },
  { part: win, material: PALETTE.window },
  { part: trim, material: { ...finish('vittoriano-trim', 0xfbf8f1), floodlight: lit(1) } },
  // The marble in the portico's shade (photos 1 and 2 show it mid-grey),
  // also the propylaea's glazed roofs.
  { part: shade, material: finish('vittoriano-shade', 0xb3ada2) },
], { bearing: 343.3, osm: 'relation/1849830' }, 6500)
