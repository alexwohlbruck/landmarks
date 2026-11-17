/**
 * The Index, DIFC, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-index-tower.ts
 *
 * Foster + Partners' 326 m slab (2010): offices in the lower 40%, flats
 * above. The long north and south faces are glass between four beige
 * concrete fins that lean out towards the ground; each short end is a pair
 * of leaning concrete walls with a deep slot between them, bridged at the
 * top. The glass rises above the concrete in a serrated crown of glass
 * blades. The office glass carries horizontal sun-shading louvres, the flats
 * vertical fins.
 *
 * Frame: x east, y north, z up, metres; origin at the centroid of OSM
 * way/182071958 (55.2777181 E, 25.2074618 N). BEARING 0: the slab's long
 * axis runs east-west (OSM 90.6 degrees; the 0.6 degree twist is left out,
 * under 0.4 m at the ends).
 *
 * Identity: OSM way/182071958 "Index Tower" (wikidata Q1264855, height 326,
 * 80 levels, architect parts below). Wikidata P625 puts Q1264855 at
 * 55.279019 E 25.207117 N, 130 m east of the outline; the outline is the one
 * that carries the wikidata tag and the detailed building:parts, and the
 * photos (the only 80-storey slab with leaning beige ends here, south of the
 * DIFC across Al Mustaqbal Street) match it. The coordinate in the lead's
 * brief (55.2805 E 25.2125 N) is the DIFC Gate Avenue area, not the tower.
 *
 * Evidence
 * - OSM way/182071958 and its 30 building:parts (way/935572013-041,
 *   936115283, 937048146), measured: the glass slab 76.7 x 23.3 m (part 018,
 *   322 m); four transverse fins 3.1-3.4 m thick at x = -36.7, -9.1, 17.2,
 *   43.4 (300 m), standing 3 m proud of both long faces at the top and
 *   carried out as sloped skillion stubs to 5.8 m proud at the ground; the
 *   two end walls 3.2 m thick, 8.5 m long at the top, carried out by skillion
 *   legs to 21 m long at the ground (parts 013/016/031/032); the bridge
 *   between them at 297-300 m (parts 015/029); six 5.6 m glass blades to
 *   326 m (parts 020-027); the office glass 1 m proud to 130 m (part 937048146);
 *   a 4 m podium under the whole outline (part 936115283). OSM colours:
 *   concrete #BBAC9B, glass #5D7581.
 * - Published: 326 m (OSM; Wikipedia gives 328 m to the top, 80 floors),
 *   Foster + Partners, completed 2010; offices on floors 1-25, flats above
 *   (Wikipedia "The Index (Dubai)").
 * - Photos (daylight):
 *   "The Index Tower - panoramio.jpg", Aidas U., CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:The_Index_Tower_-_panoramio.jpg
 *     (from the south-west: the leaning end walls and the end slot with its
 *     stepped sky gardens, the louvred office band, the fins, the colours);
 *   "Index Tower @ Dubai", flickr *_* (22539273@N00), CC BY 2.0,
 *     https://www.flickr.com/photos/22539273@N00/15793308966 (from the south,
 *     distant and level: the proportions and the serrated glass crown),
 *     https://www.flickr.com/photos/22539273@N00/15793317266 and
 *     https://www.flickr.com/photos/22539273@N00/15793262696 (closer views);
 *   "Norman Foster's Index Tower", Tim Brown Architecture, CC BY 2.0,
 *     https://www.flickr.com/photos/11381771@N04/2316941922 (the crown fins
 *     from below);
 *   "Aerial photographs of Dubai (taken from Burj Khalifa ) 01.jpg",
 *     Paasikivi, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Aerial_photographs_of_Dubai_(taken_from_Burj_Khalifa_)_01.jpg
 *     (from the south-west, above: the whole slab, the ends and the top).
 * - No lidar or aerials cover the UAE in the allowed sources; the map terrain
 *   (Mapterhorn) has no tiles here, so the ground was not checked. Flat
 *   site; elevation 0.
 *
 * Numbers
 * - Every plan dimension and the heights 4, 130, 297, 300, 322 and 326:
 *   OSM parts, measured/tagged (see above). The lean of the fins is drawn as
 *   a straight slope from the stubs' ground edge to the top. The end walls'
 *   lean is 10 m, not OSM's 13 m: in the photo from the Burj (long face
 *   nearly square on) the east pier widens from 10 m at the top to about
 *   18.5-20 m at the ground, scaled by the 77 m slab.
 * - Office louvres: bands every 3 floors (about 12 m), estimated from the
 *   photos; the pale louvre zone over the offices (130-150 m, stepped) and
 *   the flats' vertical fins (one per blade and one between): estimated.
 * - The office glass reads as a dark louvred band, the flats as lighter
 *   glass with pale fins, as in the photos from the Burj and the south.
 * - End slot: dark glazing to 130 m; above it, five tall sky-garden openings
 *   (from the panoramio photo, estimated at 31.5 m centres).
 * Look-only references: none.
 * Doubts: OSM's skillion stubs are tagged height 1 with roof:height 299 (a
 * slope from the top down to the ground); read as leaning legs, which the
 * panoramio photo confirms for the end walls. The north face is not
 * photographed square on; it is drawn like the south face. The 4 m podium
 * is drawn plain.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, windowVariant, PALETTE, type Swatch } from './palette'

type V2 = [number, number]
type Box = [number, number, number, number] // x0, x1, y0, y1

const ID = 'dubai-index-tower'
const ANCHOR = { lng: 55.2777181, lat: 25.2074618 }
const BEARING = 0
const TIP = 326

// --- helpers ---------------------------------------------------------------

function norm(v: V2): V2 { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const ring = (b: Box): V2[] => [[b[0], b[2]], [b[1], b[2]], [b[1], b[3]], [b[0], b[3]]]
function chamfer(poly: V2[], c: number): V2[] {
  const out: V2[] = []
  poly.forEach((p, i) => {
    const a = poly[(i + poly.length - 1) % poly.length], b = poly[(i + 1) % poly.length]
    const ua = norm([a[0] - p[0], a[1] - p[1]]), ub = norm([b[0] - p[0], b[1] - p[1]])
    out.push([p[0] + ua[0] * c, p[1] + ua[1] * c], [p[0] + ub[0] * c, p[1] + ub[1] * c])
  })
  return out
}
function inset(poly: V2[], d: number): V2[] {
  const n = poly.length
  return poly.map((v, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const u1 = norm([v[0] - a[0], v[1] - a[1]]), u2 = norm([b[0] - v[0], b[1] - v[1]])
    const n1: V2 = [-u1[1], u1[0]], n2: V2 = [-u2[1], u2[0]]
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [v[0] + (n1[0] + n2[0]) * d / k, v[1] + (n1[1] + n2[1]) * d / k]
  })
}
const at = (p: V2, z: number): V3 => [p[0], p[1], z]

/**
 * A box whose plan may change from `b` at z0 to `t` at z1 (a leaning wall),
 * with chamfered vertical corners and a bevelled top edge.
 */
function loftBox(part: Part, b: Box, t: Box, z0: number, z1: number, bev = 0.5, top = true) {
  const B = chamfer(ring(b), bev), T = chamfer(ring(t), bev), n = B.length
  const zt = top ? z1 - bev : z1
  // the wall ring just under the bevel, interpolated along the lean
  const f = (zt - z0) / (z1 - z0)
  const M = B.map((p, i): V2 => [p[0] + (T[i][0] - p[0]) * f, p[1] + (T[i][1] - p[1]) * f])
  const Q = inset(T, bev)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    part.quad(at(B[i], z0), at(B[j], z0), at(M[j], zt), at(M[i], zt))
    if (top) part.quad(at(M[i], zt), at(M[j], zt), at(Q[j], z1), at(Q[i], z1))
  }
  if (top) part.cap(Q.map((p) => at(p, z1)), true)
}
const box = (part: Part, b: Box, z0: number, z1: number, bev = 0.5, top = true) => loftBox(part, b, b, z0, z1, bev, top)

/** A flat panel on a face of constant y (side +1 north, -1 south), x0..x1, z0..z1. */
function panelY(part: Part, y: number, side: 1 | -1, x0: number, x1: number, z0: number, z1: number, out = 0.06) {
  const yy = y + side * out
  if (side > 0) part.quad([x1, yy, z0], [x0, yy, z0], [x0, yy, z1], [x1, yy, z1])
  else part.quad([x0, yy, z0], [x1, yy, z0], [x1, yy, z1], [x0, yy, z1])
}
/** A flat panel on a face of constant x (side +1 east, -1 west), y0..y1, z0..z1. */
function panelX(part: Part, x: number, side: 1 | -1, y0: number, y1: number, z0: number, z1: number, out = 0.06) {
  const xx = x + side * out
  if (side > 0) part.quad([xx, y0, z0], [xx, y1, z0], [xx, y1, z1], [xx, y0, z1])
  else part.quad([xx, y1, z0], [xx, y0, z0], [xx, y0, z1], [xx, y1, z1])
}

// --- plan (OSM parts, metres from the centroid) ------------------------------

const SLAB: Box = [-35.0, 41.7, -15.2, 8.1] // glass slab, to 322 (part 018)
const OFFICE: Box = [-34.9, 41.8, -16.2, 9.1] // office glass, 1 m proud, to 130
const FINS: [number, number][] = [[-38.3, -35.0], [-10.6, -7.5], [15.6, 18.8], [41.7, 45.1]]
const FIN_Y_TOP: [number, number] = [-18.2, 11.1], FIN_Y_GROUND: [number, number] = [-21.0, 13.9]
const BAYS: [number, number][] = [[-35.0, -10.6], [-7.5, 15.6], [18.8, 41.7]]
const BLADES: [number, number][] = [[-32.6, -26.9], [-18.9, -13.3], [-5.7, -0.1], [8.0, 13.6], [20.9, 26.5], [34.1, 39.7]]
// end walls: y bands, and x at the top and at the ground (west, east)
const WALL_Y: [number, number][] = [[-15.3, -12.1], [4.7, 7.9]]
// ground ends: OSM's legs reach -59.8 / 66.7 (13 m out); the Burj photo
// shows about 8.5-10 m, so the lean is drawn 10 m
const WEST = { inner: -38.3, top: -46.8, ground: -56.8 }
const EAST = { inner: 45.1, top: 53.6, ground: 63.6 }
const PODIUM: Box = [-67.0, 66.7, -21.1, 21.1]
const Z = { podium: 4, office: 130, core: 300, bridge: 297, glass: 322, blade: TIP }

const concrete = new Part(), glass = new Part(), office = new Part(), fins = new Part(), plinth = new Part(), louvre = new Part()

// Podium under the whole outline (part 936115283).
box(plinth, PODIUM, 0, Z.podium, 0.5)

// Glass slab, the office glass, the crown blades.
box(glass, SLAB, Z.podium, Z.glass, 0.4)
box(office, OFFICE, Z.podium, Z.office, 0.3)
for (const [x0, x1] of BLADES) box(glass, [x0, x1, -16.2, 9.1], Z.office, Z.blade, 0.5)

// The four fins, leaning out towards the ground on both faces.
for (const [x0, x1] of FINS) loftBox(concrete, [x0, x1, FIN_Y_GROUND[0], FIN_Y_GROUND[1]], [x0, x1, FIN_Y_TOP[0], FIN_Y_TOP[1]], Z.podium, Z.core, 0.5)

// The end walls, leaning out along the axis, and the bridge between each pair.
for (const E of [WEST, EAST]) {
  const lo = (a: number, b: number): [number, number] => [Math.min(a, b), Math.max(a, b)]
  for (const [y0, y1] of WALL_Y) {
    const [g0, g1] = lo(E.inner, E.ground), [t0, t1] = lo(E.inner, E.top)
    loftBox(concrete, [g0, g1, y0, y1], [t0, t1, y0, y1], Z.podium, Z.core, 0.5)
  }
  const [t0, t1] = lo(E.inner, E.top)
  box(concrete, [t0, t1, WALL_Y[0][1] - 0.3, WALL_Y[1][0] + 0.3], Z.bridge - 4, Z.core - 0.1, 0.4)
  // the slot's back: dark glazing over the office floors, then sky-garden
  // openings in the concrete (the fin's outer face is the slot's back wall)
  const side = Math.sign(E.top) as 1 | -1
  const back = E.inner
  const [s0, s1] = [WALL_Y[0][1] + 0.6, WALL_Y[1][0] - 0.6]
  // back wall is the end fin; panels on it facing out along the axis
  panelX(office, back, side, s0, s1, Z.podium + 1, Z.office)
  for (let k = 0; k < 5; k++) { const z = 136 + k * 31.5; panelX(glass, back, side, s0, s1, z, z + 26) }
}

// --- facades ------------------------------------------------------------------

// Office floors: horizontal louvre bands every three floors on the long faces.
for (let z = Z.podium + 8; z < Z.office - 2; z += 12) {
  for (const [x0, x1] of BAYS) {
    panelY(louvre, OFFICE[2], -1, x0 + 0.2, x1 - 0.2, z, z + 1.8)
    panelY(louvre, OFFICE[3], 1, x0 + 0.2, x1 - 0.2, z, z + 1.8)
  }
}
// The transition at the office roof: a 20 m zone of pale vertical louvres
// across each bay (the photos show it light, stepping up between the fins).
for (const [x0, x1] of BAYS) {
  const n = 6, w = (x1 - x0) / n
  for (let k = 0; k < n; k++) {
    const a = x0 + k * w + 0.5, b = x0 + (k + 1) * w - 0.9
    const z1 = Z.office + (k === 0 || k === n - 1 ? 12 : 20)
    panelY(fins, SLAB[2], -1, a, b, Z.office, z1)
    panelY(fins, SLAB[3], 1, a, b, Z.office, z1)
  }
}
// Flats: pale vertical fins, one up each blade and one in the gap between
// the blades of a bay, drawn bold enough to read.
const finX: number[] = BLADES.map(([a, b]) => (a + b) / 2)
for (let k = 0; k < BLADES.length; k += 2) finX.push((BLADES[k][1] + BLADES[k + 1][0]) / 2)
for (const xc of finX) {
  const proud = BLADES.some(([a, b]) => xc > a && xc < b)
  const yS = proud ? -16.2 : SLAB[2], yN = proud ? 9.1 : SLAB[3]
  const top = proud ? Z.blade - 1.5 : Z.core - 4
  panelY(fins, yS, -1, xc - 0.7, xc + 0.7, Z.office + 12, top)
  panelY(fins, yN, 1, xc - 0.7, xc + 0.7, Z.office + 12, top)
}

const mats: Swatch[] = [
  finish('index-concrete', 0xd3bf9b),
  PALETTE.window,
  windowVariant(2, 0x4e5b66),
  finish('index-fins', 0xc4c9cc, 0.5),
  PALETTE.stone,
  windowVariant(3, 0x6f7f8c),
]
const parts = [concrete, glass, office, fins, plinth, louvre].map((part, i) => ({ part, material: mats[i] }))
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Index', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES(),
})
function REPLACES() {
  const ids = ['way/182071958', 'way/936115283', 'way/937048146']
  for (let i = 13; i <= 41; i++) ids.push(`way/9355720${String(i).padStart(2, '0')}`)
  return ids
}
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
