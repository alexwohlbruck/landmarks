/**
 * Al Yaqoub Tower (AHS Tower), Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-al-yaqoub-tower.ts
 *
 * A 328 m residential tower on Sheikh Zayed Road modelled on London's Big Ben
 * (Elizabeth Tower): a plain square sandstone shaft, a projecting clock stage
 * with a clock on each face, then a steep maroon pyramid roof, a lantern and
 * a spire.
 *
 * Frame: x east, y north, z up in the model's own turned frame, metres;
 * origin at the centroid of OSM way/238284900 (55.279777 E, 25.2164029 N).
 * BEARING 32.8: local +y points along the outline's edge at 32.8 degrees,
 * so every face of the square is a face of the model.
 *
 * Identity: OSM way/238284900 "Al Yaqoub Tower" (height 328, 69 levels,
 * wikidata Q1808295). Wikidata P625 puts Q1808295 at 55.279806 E 25.216333 N,
 * 8 m from the outline's centroid; the height tag matches the published
 * height. The photos below show the clock tower on this site: east of the
 * Maze/Capricorn towers, west of the DIFC Gate.
 *
 * Evidence
 * - OSM way/238284900: a 34.3 m square (one collinear extra node), measured.
 * - Published: 328 m to the tip (Wikipedia "Al Yaqoub Tower", OSM height;
 *   Wikidata gives 330.1), 69 floors (OSM) / 79 (Wikidata), completed 2013.
 * - Photos (all daylight unless noted):
 *   "Emirates Towers in Dubai at dawn.jpg", Jackardsiffant, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Emirates_Towers_in_Dubai_at_dawn.jpg
 *     (from the south-east, high and distant, two faces seen, the ESE face
 *     about 18 degrees off square: every height below is read from it);
 *   "Financial District @ Dubai", flickr *_* (22539273@N00), CC BY 2.0,
 *     https://www.flickr.com/photos/22539273@N00/15631830027 (from the
 *     south-south-east, distant and level, two faces: colours, roof, dials);
 *   "Dubai Skyline from Dubai Metro.jpg", Leo Rodman, CC BY-SA 2.0,
 *     https://commons.wikimedia.org/wiki/File:Dubai_Skyline_from_Dubai_Metro.jpg
 *     (from the metro on SZR, south-west: maroon roof, lantern, dial frame);
 *   "DIFC (Dubai International Financial Centre)", EuroSlice, CC BY 2.0,
 *     https://www.flickr.com/photos/104021946@N05/28724198092 (from SZR:
 *     white dials, maroon roof);
 *   "Aerial photographs of Dubai (taken from Burj Khalifa ) 01.jpg",
 *     Paasikivi, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Aerial_photographs_of_Dubai_(taken_from_Burj_Khalifa_)_01.jpg
 *     (from above, south-west).
 * - No lidar or aerials cover the UAE in the allowed sources. The map terrain
 *   (Mapterhorn) has no tiles here, so the ground was not checked; the site
 *   is flat. Elevation 0.
 *
 * Numbers
 * - Shaft: the OSM square, 34.3 m, from the ground to the clock stage
 *   (measured). The photos show no wider base.
 * - Tip 328: published. Everything else estimated from the dawn photo,
 *   scaled by the shaft's projected width there (two faces seen, about 18
 *   degrees off the SSE face: 210 px for 43 m, 4.9 px/m), and checked
 *   against the distant SSE photo (both clocks equally seen, so the shaft
 *   shows its 48.5 m diagonal): spire 308.5-328, two lantern tiers 295-302
 *   and 303-307.5 (14 and 12 m wide), roof pyramid 273-295 (32 m wide at its
 *   foot, 14 m at the top), parapet 270-273 with corner pinnacles to 278.5,
 *   clock stage 245-269 and 39 m wide (stage width / shaft width 1.14 in
 *   both photos; height / width 0.62), belfry of tall slots 226-242, stone
 *   bands at 226, 183, 138, 95 and 50 m. The two photos agree within about
 *   10%; the roof and spire were made steeper and slimmer after comparing.
 * - Dial: a 18 x 19 m ornamental square with a 12.4 m disc (dawn photo),
 *   drawn as a flat gilt square and a light disc with no numerals.
 * - Facade: the dark central strip down each face (0.15 of the face, photo),
 *   broken at each band and half-way between, and two bays of window
 *   panels either side, one 3.6 m panel per bay spanning three floors
 *   (about 11 m pitch, 3.2 m stone spandrels, 2.1-2.4 m piers): the photo's
 *   small punched windows grouped per STYLE.md, so the sandstone still
 *   dominates without a per-floor dot grid (lead review, round 1).
 * - Spire, pinnacles and lantern are drawn a little bolder than real so the
 *   crown holds at 80 px.
 * Look-only references: none.
 * Doubts: the dial is a flat light disc (the lattice round it is left out);
 * the roof's dormer band is a single row of light panels; no photo shows the
 * NNE and WNW faces square on, they are drawn like the others (the tower is
 * symmetric in every photo).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

type V2 = [number, number]

const ID = 'dubai-al-yaqoub-tower'
const ANCHOR = { lng: 55.279777, lat: 25.2164029 }
const BEARING = 32.8

// --- helpers ---------------------------------------------------------------

/** Chamfer every corner of a CCW polygon by c. */
function chamfer(poly: V2[], c: number): V2[] {
  const out: V2[] = []
  poly.forEach((p, i) => {
    const a = poly[(i + poly.length - 1) % poly.length], b = poly[(i + 1) % poly.length]
    const ua = norm([a[0] - p[0], a[1] - p[1]]), ub = norm([b[0] - p[0], b[1] - p[1]])
    out.push([p[0] + ua[0] * c, p[1] + ua[1] * c], [p[0] + ub[0] * c, p[1] + ub[1] * c])
  })
  return out
}
function norm(v: V2): V2 { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
/** A convex CCW polygon moved inwards by d. */
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
const rect = (hx: number, hy: number, cx = 0, cy = 0): V2[] => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]]
const at = (p: V2, z: number): V3 => [p[0], p[1], z]

/**
 * A convex prism with chamfered vertical corners and a bevel round its top
 * (and optionally its bottom) edge: walls, the bevel, and the caps.
 */
function block(part: Part, poly: V2[], z0: number, z1: number, bev = 0.5, opts: { bottom?: boolean; bottomBevel?: boolean; top?: boolean } = {}) {
  const P = chamfer(poly, bev), Q = inset(P, bev), n = P.length
  const top = opts.top ?? true
  const zb = opts.bottomBevel ? z0 + bev : z0, zt = top ? z1 - bev : z1
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    part.quad(at(P[i], zb), at(P[j], zb), at(P[j], zt), at(P[i], zt))
    if (top) part.quad(at(P[i], zt), at(P[j], zt), at(Q[j], z1), at(Q[i], z1))
    if (opts.bottomBevel) part.quad(at(Q[i], z0), at(Q[j], z0), at(P[j], zb), at(P[i], zb))
  }
  if (top) part.cap(Q.map((p) => at(p, z1)), true)
  if (opts.bottom || opts.bottomBevel) part.cap((opts.bottomBevel ? Q : P).map((p) => at(p, z0)), false)
}

/** A truncated pyramid (frustum) between two square half-widths. */
function frustum(part: Part, h0: number, h1: number, z0: number, z1: number, capTop = true) {
  const r0 = rect(h0, h0).map((p) => at(p, z0)), r1 = rect(h1, h1).map((p) => at(p, z1))
  part.loft([r0, r1])
  if (capTop && h1 > 0) part.cap(r1, true)
}

/**
 * A flat rectangle on one face of a square of half-width h, facing direction
 * `face` (0 +y, 1 +x, 2 -y, 3 -x), from s0 to s1 across the face (measured
 * left to right seen from outside) and z0 to z1, set `out` metres proud.
 */
function onFace(part: Part, h: number, face: number, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const d = h + out
  // outward normal and the across direction (left to right seen from outside)
  const nrm: V2[] = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  const n = nrm[face], u: V2 = [-n[1], n[0]]
  const p = (s: number, z: number): V3 => [n[0] * d + u[0] * s, n[1] * d + u[1] * s, z]
  part.quad(p(s0, z0), p(s1, z0), p(s1, z1), p(s0, z1))
}

/** A flat disc on a face, as onFace, centred at s, z. */
function discOnFace(part: Part, h: number, face: number, s: number, z: number, r: number, out = 0.08, seg = 16) {
  const nrm: V2[] = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  const n = nrm[face], u: V2 = [-n[1], n[0]], d = h + out
  const p = (a: number, b: number): V3 => [n[0] * d + u[0] * a, n[1] * d + u[1] * a, b]
  const c = p(s, z)
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2
    part.tri(c, p(s + r * Math.cos(a0), z + r * Math.sin(a0)), p(s + r * Math.cos(a1), z + r * Math.sin(a1)))
  }
}

// --- the tower ----------------------------------------------------------------

const H = 17.15 // shaft half-width (OSM square, 34.3 m)
const BANDS = [50, 95, 138, 183, 226] // stone bands up the shaft
const BELFRY = [226, 242], CLOCK = [245, 269], CH = 19.6 // clock stage half-width
const ROOF = [273, 295], LANTERN = [295, 302], LANTERN2 = [303.2, 307.5], TIP = 328

const stone = new Part(), win = new Part(), roof = new Part(), trim = new Part(), dial = new Part(), gilt = new Part()

// Shaft, in one piece to the belfry top, bevelled corners.
block(stone, rect(H, H), 0, BELFRY[1], 0.6, { top: false })
// Stone bands: shallow projecting courses.
for (const z of BANDS) block(trim, rect(H + 0.5, H + 0.5), z - 1.2, z + 0.4, 0.4, { bottomBevel: true })

// Windows: the dark central strip and two bays of panels either side, one
// panel per bay spanning three floors (about 11 m pitch), stone piers and
// spandrels between (lead review: the earlier narrow columns read as a dot grid).
const strip = 0.15 * 2 * H / 2 // half-width of the central strip (5.1 m wide)
// two bays either side: 3.6 m panels between 2.1-2.4 m stone piers
const cols: [number, number][] = []
for (const s0 of [-H + 2.4, -H + 8.4]) cols.push([s0, s0 + 3.6], [-s0 - 3.6, -s0])
const levels = [4, ...BANDS] // the ground storey starts at 4 m (door zone below)
for (let k = 0; k < levels.length - 1; k++) {
  const z0 = levels[k] + (k === 0 ? 0 : 0.8), z1 = levels[k + 1] - 1.6
  for (let f = 0; f < 4; f++) {
    // the strip in two lengths per band, stone between, so it never reads as one stripe
    const zm = (z0 + z1) / 2
    onFace(win, H, f, -strip, strip, z0 + 0.6, zm - 1.3)
    onFace(win, H, f, -strip, strip, zm + 1.3, z1)
    const rows = Math.max(1, Math.round((z1 - z0) / 11))
    const step = (z1 - z0) / rows
    for (let r = 0; r < rows; r++) for (const [s0, s1] of cols) onFace(win, H, f, s0, s1, z0 + r * step + 1.6, z0 + (r + 1) * step - 1.6)
  }
}
// Belfry: tall slots across each face.
for (let f = 0; f < 4; f++) for (let k = 0; k < 7; k++) {
  const s = -H + 2.4 + k * ((2 * H - 4.8 - 2.6) / 6)
  onFace(win, H, f, s, s + 2.6, BELFRY[0] + 1.5, BELFRY[1] - 1)
}

// Cornice under the clock stage, the stage, and its parapet.
block(trim, rect(CH - 0.8, CH - 0.8), BELFRY[1], CLOCK[0], 0.5, { bottomBevel: true })
block(stone, rect(CH, CH), CLOCK[0], CLOCK[1], 0.6, { bottomBevel: true, top: false })
block(trim, rect(CH + 0.6, CH + 0.6), CLOCK[1], CLOCK[1] + 1.4, 0.4, { bottomBevel: true })
block(stone, rect(CH - 0.4, CH - 0.4), CLOCK[1] + 1.4, ROOF[0], 0.4)
// Corner pinnacles on the parapet: bold square shafts with pyramid caps.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: V2 = [sx * (CH - 1.6), sy * (CH - 1.6)]
  block(stone, rect(1.4, 1.4, c[0], c[1]), ROOF[0], ROOF[0] + 2.6, 0.3)
  const r0 = rect(1.4, 1.4, c[0], c[1]).map((p) => at(p, ROOF[0] + 2.6))
  const apex: V3 = [c[0], c[1], ROOF[0] + 5.5]
  for (let i = 0; i < 4; i++) roof.tri(r0[i], r0[(i + 1) % 4], apex)
}
// The clocks: a gilt square frame and a light disc on every face.
const zc = (CLOCK[0] + CLOCK[1]) / 2
for (let f = 0; f < 4; f++) {
  onFace(gilt, CH, f, -9, 9, zc - 9.5, zc + 9.5, 0.06)
  discOnFace(dial, CH, f, 0, zc, 6.2, 0.12, 20)
}
// Small windows in the stage's corners beside the dial frame.
for (let f = 0; f < 4; f++) for (const s of [-CH + 2, CH - 4.2]) onFace(win, CH, f, s, s + 2.2, CLOCK[0] + 3, CLOCK[1] - 3)

// Roof: the steep maroon pyramid, truncated under the lantern; a band of
// light dormer panels round its foot.
{
  const h0 = CH - 3.6, h1 = 6.9
  frustum(roof, h0, h1, ROOF[0], ROOF[1], false)
  // dormers: light panels lying in the sloped faces, a row of five per face
  const t0 = 0.22, t1 = 0.42 // fractions up the slope
  const nrm: V2[] = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  for (let f = 0; f < 4; f++) {
    const n = nrm[f], u: V2 = [-n[1], n[0]]
    const hz = (t: number) => h0 + (h1 - h0) * t, z = (t: number) => ROOF[0] + (ROOF[1] - ROOF[0]) * t
    const off = 0.08
    for (let k = 0; k < 5; k++) {
      const s0 = -0.62 + k * 0.27, s1 = s0 + 0.15
      const P = (t: number, s: number): V3 => [n[0] * (hz(t) + off) + u[0] * s * hz(t), n[1] * (hz(t) + off) + u[1] * s * hz(t), z(t)]
      trim.quad(P(t0, s0), P(t0, s1), P(t1, s1), P(t1, s0))
    }
  }
}
// Lantern: a white stage with dark openings, a cornice, then the spire.
block(trim, rect(6.9, 6.9), LANTERN[0], LANTERN[1], 0.4)
for (let f = 0; f < 4; f++) for (const s of [-5.0, -1.1, 2.8]) onFace(win, 6.9, f, s, s + 2.2, LANTERN[0] + 2, LANTERN[1] - 2)
block(trim, rect(7.7, 7.7), LANTERN[1] - 0.2, LANTERN2[0], 0.35, { bottomBevel: true })
// the second, smaller lantern tier
block(trim, rect(5.8, 5.8), LANTERN2[0], LANTERN2[1], 0.35)
for (let f = 0; f < 4; f++) for (const s of [-4.4, 1.6]) onFace(win, 5.8, f, s, s + 2.6, LANTERN2[0] + 1, LANTERN2[1] - 1)
block(trim, rect(6.4, 6.4), LANTERN2[1] - 0.2, LANTERN2[1] + 1.0, 0.3, { bottomBevel: true })
{
  // spire: a square pyramid, drawn bold (wider than real) so it survives 80 px
  const base = LANTERN2[1] + 1.0, h = 5.0
  const r0 = rect(h, h).map((p) => at(p, base))
  const mid = rect(1.6, 1.6).map((p) => at(p, TIP - 4))
  roof.loft([r0, mid])
  const apex: V3 = [0, 0, TIP]
  for (let i = 0; i < 4; i++) gilt.tri(mid[i], mid[(i + 1) % 4], apex)
}

const mats: Swatch[] = [
  finish('yaqoub-sandstone', 0xe2d3b0),
  PALETTE.window,
  finish('yaqoub-maroon-roof', 0xa0625b),
  PALETTE.trim,
  finish('clock-dial', 0xf6f3ea, 0.6),
  finish('gilt', 0xc8a868, 0.5),
]
const parts = [stone, win, roof, trim, dial, gilt].map((part, i) => ({ part, material: mats[i] }))
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Al Yaqoub Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/238284900'],
})
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
