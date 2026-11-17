/**
 * The Gate, DIFC, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-gate-building.ts
 *
 * The headquarters of the Dubai International Financial Centre (2004,
 * Gensler): a 62.5 m square block of pale stone with a tall rectangular
 * opening through its middle on the DIFC's NNE-SSW axis, so it reads as a
 * gateway from Sheikh Zayed Road. The legs either side carry big glass
 * walls on their outer faces; over the opening runs a stone attic with
 * slot windows, a recessed glass storey crossed by a row of white X braces,
 * and a stone parapet band; a low pavilion stands back on the roof.
 *
 * Frame: x, y, z up in the model's turned frame, metres; origin at the
 * centroid of OSM way/256973497 (55.281157 E, 25.2145569 N). BEARING 28:
 * local +y is the NNE face (the opening's face, towards SZR and the
 * Emirates Towers), local +x the ESE face.
 *
 * Identity: OSM way/256973497 (building=commercial, 15 levels, height 60,
 * name "Dubai International Financial Centre", wikidata Q3269086, the DIFC
 * itself) is the only 62.5 m square in the DIFC, and the photos below show
 * the arch block standing on it: on the axis between the Emirates Towers
 * and the Gate Village, with Burj Khalifa behind it seen from the NNE. OSM
 * has no separate "The Gate" feature here; the lead's coordinate
 * (55.2813 E 25.2140 N) falls 60 m south of this outline, in the Gate
 * Village.
 *
 * Evidence
 * - OSM way/256973497: a 62.5 m square (two collinear extra nodes),
 *   measured; height 60, 15 levels, tagged.
 * - Photos (daylight unless noted):
 *   "DIFC @ Dubai", flickr *_* (22539273@N00), CC BY 2.0,
 *     https://www.flickr.com/photos/22539273@N00/15628595748 (from the NNE,
 *     distant and level, the opening face square on: the opening's width and
 *     height and the attic bands are read from it);
 *   "Emirates Towers in Dubai at dawn.jpg", Jackardsiffant, CC BY 3.0,
 *     https://commons.wikimedia.org/wiki/File:Emirates_Towers_in_Dubai_at_dawn.jpg
 *     (from the south-east and above, at dawn: the SSW opening face and the
 *     ESE glass face with its stone frame, the X-braced storey, the slots and
 *     the roof pavilion).
 *   These are the only two licensed photos found (Commons has none: the
 *   UAE has no freedom of panorama); every other side is drawn by symmetry.
 * - No lidar or aerials cover the UAE in the allowed sources; the map terrain
 *   (Mapterhorn) has no tiles here, so the ground was not checked. Flat
 *   site; elevation 0.
 *
 * Numbers
 * - Square 62.5 m and roof 60 m: OSM, measured/tagged. The NNE photo gives
 *   width / height 185 / 173 px, i.e. 58 m tall for 62.5 m wide, which
 *   agrees.
 * - From the NNE photo (zoomed, 11.8 px/m on the 62.5 m face; round 2):
 *   the opening is centred, 20.5 m clear inside a 1.8 m dark reveal
 *   (24 m overall, 0.39 of the face) and 37 m tall; attic stone band
 *   37-44.5 m, X-braced glass storey 44.5-52.5 m (set back 1 m), parapet
 *   band 52.5-60 m; roof pavilion 4 m tall and 0.83 of
 *   the width. All estimated.
 * - Glass walls on the ESE/WNW faces: inside a 5 m stone frame (dawn photo,
 *   0.08 of the face), from 4 to 36 m. Estimated.
 * - Opening reveal: a 1.8 m darker stone frame round both jambs and the
 *   lintel, the same stone on the opening's inner walls and soffit.
 * - Slot windows in the two stone bands: 1.3 m wide at 2.6 m centres
 *   (dawn photo), drawn a little wider than real. X braces: seven a face,
 *   members 1.4 m wide (bolder than real).
 * Look-only references: none.
 * Doubts: only two licensed photos, both of the NNE/SSW opening faces and
 * the ESE face; the WNW face is drawn as the ESE one. The opening's inner
 * walls are drawn in the reveal stone (the dawn photo shows them dark,
 * partly glazed). The
 * lower "Gate Village" wings round it are separate OSM buildings and are not
 * modelled. Event tents mapped under and beside the arch
 * (way/1346109176-1346109182, temporary) are inside the outline and are
 * listed in `replaces`.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'

type V2 = [number, number]
type Box = [number, number, number, number] // x0, x1, y0, y1

const ID = 'dubai-gate-building'
const ANCHOR = { lng: 55.281157, lat: 25.2145569 }
const BEARING = 28

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

/** A box with chamfered vertical corners, bevelled top and/or bottom edges. */
function box(part: Part, b: Box, z0: number, z1: number, bev = 0.5, o: { top?: boolean; bottom?: boolean; bottomBevel?: boolean } = {}) {
  const top = o.top ?? true
  const P = chamfer(ring(b), bev), Q = inset(P, bev), n = P.length
  const zb = o.bottomBevel ? z0 + bev : z0, zt = top ? z1 - bev : z1
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    part.quad(at(P[i], zb), at(P[j], zb), at(P[j], zt), at(P[i], zt))
    if (top) part.quad(at(P[i], zt), at(P[j], zt), at(Q[j], z1), at(Q[i], z1))
    if (o.bottomBevel) part.quad(at(Q[i], z0), at(Q[j], z0), at(P[j], zb), at(P[i], zb))
  }
  if (top) part.cap(Q.map((p) => at(p, z1)), true)
  if (o.bottom || o.bottomBevel) part.cap((o.bottomBevel ? Q : P).map((p) => at(p, z0)), false)
}

/**
 * A flat quad on one face of a square of half-width h: face 0 +y, 1 +x,
 * 2 -y, 3 -x; s runs across the face (left to right seen from outside).
 * Corners are given as (s, z) pairs, so diagonals work too.
 */
function onFace(part: Part, h: number, face: number, pts: [number, number][], out = 0.06) {
  const nrm: V2[] = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  const n = nrm[face], u: V2 = [-n[1], n[0]], d = h + out
  const p = ([s, z]: [number, number]): V3 => [n[0] * d + u[0] * s, n[1] * d + u[1] * s, z]
  part.quad(p(pts[0]), p(pts[1]), p(pts[2]), p(pts[3]))
}
const rectOn = (part: Part, h: number, face: number, s0: number, s1: number, z0: number, z1: number, out = 0.06) =>
  onFace(part, h, face, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], out)

// --- the building -------------------------------------------------------------

const H = 31.25 // half the 62.5 m square
const OW = 10.25 // half the opening's clear width (20.5 m)
const FR = 1.8 // the dark reveal frame round it (24 m overall)
const Z = { open: 37, band1: 44.5, band2: 52.5, roof: 60, pav: 64 }
const RECESS = 1.0

const stone = new Part(), glass = new Part(), dark = new Part(), trim = new Part(), slot = new Part(), reveal = new Part()

// The two legs, the opening between them (along y), up to the attic.
box(stone, [-H, -OW, -H, H], 0, Z.open + 0.5, 0.5, { top: false })
box(stone, [OW, H, -H, H], 0, Z.open + 0.5, 0.5, { top: false })
// Attic: stone band (with the opening's ceiling under it), the recessed
// X-braced glass storey, then the parapet band with a bevelled top.
box(stone, [-H, H, -H, H], Z.open, Z.band1, 0.5, { bottom: true })
box(dark, [-H + RECESS, H - RECESS, -H + RECESS, H - RECESS], Z.band1, Z.band2, 0.3, { top: false })
box(stone, [-H, H, -H, H], Z.band2, Z.roof, 0.5, { bottomBevel: true })
// Roof pavilion, set back.
box(stone, [-26, 26, -26, 26], Z.roof, Z.pav, 0.4)
for (let f = 0; f < 4; f++) for (let k = 0; k < 6; k++) {
  const s = -23 + k * 8.1
  rectOn(glass, 26, f, s, s + 4.4, Z.roof + 1.0, Z.pav - 1.0)
}

// X braces on the recessed storey: seven bays a face (the dawn photo shows
// seven to eight), white members drawn bold (1.4 m) so they read at 80 px.
{
  const h = H - RECESS, n = 7, w = (2 * h - 1) / n, t = 0.7, z0 = Z.band1 + 0.3, z1 = Z.band2 - 0.3
  for (let f = 0; f < 4; f++) for (let k = 0; k < n; k++) {
    const a = -h + 0.5 + k * w, b = a + w
    onFace(trim, h, f, [[a, z0], [a + 2 * t, z0], [b, z1 - 0.0], [b - 2 * t, z1]], 0.08)
    onFace(trim, h, f, [[b - 2 * t, z0], [b, z0], [a + 2 * t, z1], [a, z1]], 0.1)
  }
}

// Slot windows in both stone bands, all four faces.
for (let f = 0; f < 4; f++) {
  for (let k = 0; k < 22; k++) {
    const s = -H + 3.2 + k * 2.65
    rectOn(slot, H, f, s, s + 1.3, Z.band1 - 6.2, Z.band1 - 1.6)
    rectOn(slot, H, f, s, s + 1.3, Z.band2 + 2.2, Z.roof - 2.0)
  }
}

// The opening's frame: a darker stone reveal of equal width on both jambs
// and across the lintel, on both opening faces (NNE photo: a dark frame
// about 1.8 m wide round the clear opening, centred on the face).
for (const f of [0, 2]) {
  rectOn(reveal, H, f, -OW - FR, -OW, 0, Z.open + FR, 0.08)
  rectOn(reveal, H, f, OW, OW + FR, 0, Z.open + FR, 0.08)
  rectOn(reveal, H, f, -OW, OW, Z.open, Z.open + FR, 0.08)
}

// Glass walls on the legs' outer (ESE/WNW) faces inside a 5 m stone frame.
rectOn(glass, H, 1, -H + 5, H - 5, 4, Z.open - 1.2)
rectOn(glass, H, 3, -H + 5, H - 5, 4, Z.open - 1.2)
// The opening's inner walls and soffit: the same reveal stone on both
// sides, so the jambs read alike from any angle.
{
  // the inner faces are at x = -OW (facing +x) and x = +OW (facing -x)
  const y0 = -H + 1.5, y1 = H - 1.5, z0 = 0.4, z1 = Z.open - 0.6
  reveal.quad([-OW + 0.06, y0, z0], [-OW + 0.06, y1, z0], [-OW + 0.06, y1, z1], [-OW + 0.06, y0, z1])
  reveal.quad([OW - 0.06, y1, z0], [OW - 0.06, y0, z0], [OW - 0.06, y0, z1], [OW - 0.06, y1, z1])
  // soffit, facing down
  const zs = Z.open - 0.06
  reveal.quad([-OW, y0, zs], [-OW, y1, zs], [OW, y1, zs], [OW, y0, zs])
}

const mats: Swatch[] = [
  finish('gate-stone', 0xdedad0),
  PALETTE.window,
  windowVariant(2, 0x4f5f63),
  PALETTE.trim,
  windowVariant(3, 0x5b6b78),
  finish('gate-reveal', 0x9a9c9c),
]
const parts = [stone, glass, dark, trim, slot, reveal].map((part, i) => ({ part, material: mats[i] }))
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Gate', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: Z.pav,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/256973497', 'way/1346109176', 'way/1346109177', 'way/1346109178', 'way/1346109179', 'way/1346109180', 'way/1346109181', 'way/1346109182'],
})
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
