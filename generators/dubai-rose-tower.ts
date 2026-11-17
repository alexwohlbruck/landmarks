/**
 * Rose Rayhaan by Rotana (Rose Tower), Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-rose-tower.ts
 *
 * A slender 333 m hotel on Sheikh Zayed Road (2007, Khatib & Alami): a
 * blue-green glass shaft with a silver spine up its two broad faces and
 * silver "petal" panels flaring at its foot, under a tall pointed (ogive)
 * crown of silver louvres on a gold band, topped by a ball and a spire.
 *
 * Frame: x, y, z up in the model's turned frame, metres; origin at the
 * centroid of OSM way/64890199 (55.2765922 E, 25.2116707 N). BEARING 31.8:
 * local +y runs along SZR (NNE), local +x is the broad ESE face towards the
 * road.
 *
 * Identity: OSM way/64890199 "Rose Rayhaan by Rotana" (wikidata Q648338,
 * height 315, 72 levels). Wikidata P625 for Q648338 is 55.27666 E
 * 25.21174 N, 8 m from the outline's centroid. The photos show the ogive
 * crown on this site, south-west of the Gevora Hotel (way/125848289).
 *
 * Evidence
 * - OSM way/64890199: a 26.5 x 23.9 m rectangle, measured (632 m2). Its
 *   width is confirmed against the Gevora Hotel beside it (OSM 31 x 38 m) in
 *   the flickr photo 15197356673: the Rose's crown is 0.72 of Gevora's width.
 * - Published: 333 m to the tip (Wikipedia "Rose Rayhaan by Rotana",
 *   Wikidata), 72 floors, completed 2007. OSM height 315 m, read as the top
 *   of the crown (the spire above it is 18 m).
 * - Photos (daylight unless noted):
 *   "Aerial photographs of Dubai (taken from Burj Khalifa ) 01.jpg",
 *     Paasikivi, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Aerial_photographs_of_Dubai_(taken_from_Burj_Khalifa_)_01.jpg
 *     (from the SSW, level with the crown: the crown's height and shape);
 *   "Financial District @ Dubai", flickr *_* (22539273@N00), CC BY 2.0,
 *     https://www.flickr.com/photos/22539273@N00/15197356673 (whole tower
 *     beside Gevora) and https://www.flickr.com/photos/22539273@N00/15631830027
 *     (distant, level, the crown and the silver panels);
 *   "Rose Tower and 21st Century Tower", pjf.id.au (Paul Fenwick), CC BY 2.0,
 *     https://www.flickr.com/photos/92134758@N00/3655669521 (the SZR face:
 *     the spine, the petal panels, the gold band);
 *   "Torres en el Centro Financiero de Dubai", Edgardo W. Olivera, CC BY 2.0,
 *     https://www.flickr.com/photos/124137421@N04/36406987746;
 *   "Rose Tower, Dubai", elisasophia, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/30609972@N06/5559268624 (dusk: the
 *     crown's louvres and its solid silver centre, the gold band);
 *   "Sheikh Zayed Road on 16 June 2007 Pict 2.jpg", Imre Solt, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:Sheikh_Zayed_Road_on_16_June_2007_Pict_2.jpg
 *     (along SZR from the NE: the crown front-on).
 * - No lidar or aerials cover the UAE in the allowed sources; the map terrain
 *   (Mapterhorn) has no tiles here, so the ground was not checked. Flat
 *   site; elevation 0.
 *
 * Numbers
 * - Plan: the OSM rectangle, measured, with 4 m rounded corners (the photos
 *   show no sharp corners). Tip 333: published. Crown top 315: OSM height.
 * - Crown foot (gold band) 260.5-265 m: estimated from the Burj photo, where
 *   the crown is 1.8 times its own width tall (51 m for the 28 m it shows),
 *   and the flickr photos (crown base at 0.79-0.80 of the tip height).
 * - Crown: an ogive in both directions (pointed arch of radius 8.5 crown
 *   half-widths), louvred in twelve silver bands with dark gaps, a solid silver
 *   centre (half the face at the foot, narrowing with the crown) on the two
 *   broad faces (photos). Ball
 *   4.4 m across at 315 (bolder than real); the spire
 *   tapers from 1.8 m (bolder than real).
 * - Spine: 3.6 m wide, both broad faces, ground to the crown; petals: silver
 *   triangles 17 m wide at the foot rising to a point at 130 m (0.4 of the
 *   tip height in the SZR photo). Estimated.
 * Look-only references: none.
 * Doubts: the real plan is softer than the OSM rectangle (the broad faces
 * look gently convex in the street photos); the narrow NNE/SSW faces are
 * drawn as plain glass. The low podium round the base is not part of this
 * outline and is not modelled.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, windowVariant, type Swatch } from './palette'

type V2 = [number, number]

const ID = 'dubai-rose-tower'
const ANCHOR = { lng: 55.2765922, lat: 25.2116707 }
const BEARING = 31.8

const A = 11.95, B = 13.25, R = 4 // half-sizes across (x) and along SZR (y); corner radius
const Z = { band0: 260.5, crown: 265, top: 315, tip: 333 }

/** A rounded rectangle, CCW from the +x face's centre line, k segments a corner. */
function rrect(a: number, b: number, r: number, k = 3): V2[] {
  const pts: V2[] = []
  const corners: [number, number, number][] = [[a - r, b - r, 0], [-(a - r), b - r, 90], [-(a - r), -(b - r), 180], [a - r, -(b - r), 270]]
  for (const [cx, cy, a0] of corners) for (let i = 0; i <= k; i++) {
    const t = ((a0 + (90 * i) / k) * Math.PI) / 180
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)])
  }
  return pts
}
const at = (p: V2, z: number): V3 => [p[0], p[1], z]
const scaled = (s: number) => rrect(A * s, B * s, R * s)

const glass = new Part(), silver = new Part(), louvre = new Part(), gold = new Part()

// --- shaft: a glass prism with smooth rounded corners -------------------------
{
  const P = rrect(A, B, R), n = P.length
  const nrm = (i: number): V3 => {
    // outward normal: average of the two adjacent edge normals
    const a = P[(i + n - 1) % n], p = P[i], b = P[(i + 1) % n]
    const e1: V2 = [p[0] - a[0], p[1] - a[1]], e2: V2 = [b[0] - p[0], b[1] - p[1]]
    const m: V2 = [e1[1] + e2[1], -(e1[0] + e2[0])], l = Math.hypot(m[0], m[1])
    return [m[0] / l, m[1] / l, 0]
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, ni = nrm(i), nj = nrm(j)
    glass.tri(at(P[i], 0), at(P[j], 0), at(P[j], Z.band0), undefined, undefined, undefined, [ni, nj, nj])
    glass.tri(at(P[i], 0), at(P[j], Z.band0), at(P[i], Z.band0), undefined, undefined, undefined, [ni, nj, ni])
  }
}

// --- the broad faces: silver spine and petals ---------------------------------
for (const side of [1, -1]) {
  const x = side * (A + 0.06)
  // face quad helper: s runs along y, outward = side
  const q = (y0: number, y1: number, z0: number, z1: number) => {
    if (side > 0) silver.quad([x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1])
    else silver.quad([x, y1, z0], [x, y0, z0], [x, y0, z1], [x, y1, z1])
  }
  q(-1.8, 1.8, 0, Z.band0)
  // petals: a triangle each side of the spine, wide at the foot, pointed at 130 m
  const x2 = side * (A + 0.08)
  const tri = (a: V3, b: V3, c: V3) => (side > 0 ? silver.tri(a, b, c) : silver.tri(a, c, b))
  tri([x2, -8.6, 0], [x2, -1.8, 0], [x2, -1.8, 130])
  tri([x2, 1.8, 0], [x2, 8.6, 0], [x2, 1.8, 130])
}

// --- gold band at the crown's foot ---------------------------------------------
{
  const P = rrect(A + 0.45, B + 0.45, R + 0.45), Q = rrect(A, B, R)
  const n = P.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    gold.quad(at(Q[i], Z.band0 - 0.4), at(Q[j], Z.band0 - 0.4), at(P[j], Z.band0), at(P[i], Z.band0))
    gold.quad(at(P[i], Z.band0), at(P[j], Z.band0), at(P[j], Z.crown), at(P[i], Z.crown))
    gold.quad(at(P[i], Z.crown), at(P[j], Z.crown), at(Q[j], Z.crown + 0.4), at(Q[i], Z.crown + 0.4))
  }
}

// --- the ogive crown ------------------------------------------------------------
{
  const H = Z.top - Z.crown, w = (A + B) / 2, hn = H / w, Rr = (hn * hn + 1) / 2
  const f = (z: number) => Math.max(0, Math.sqrt(Rr * Rr - (z / w) ** 2) - (Rr - 1)) // 1 at the foot, 0 at the apex
  const levels = 24
  const zs = Array.from({ length: levels + 1 }, (_, k) => Z.crown + 0.4 + (H - 0.4) * (1 - (1 - k / levels) ** 1.15))
  const rings = zs.map((z) => scaled(Math.max(f(z - Z.crown), 0.035)).map((p) => at(p, z)))
  const n = rings[0].length
  for (let k = 0; k < levels; k++) {
    const stripe = k % 2 === 1 && k < levels - 3 // dark gaps between silver louvres
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const b0 = rings[k][i], b1 = rings[k][j], t0 = rings[k + 1][i], t1 = rings[k + 1][j]
      // the solid silver centre on the broad faces: quads whose centre lies
      // within 40% of the half-length either side of the x axis
      const cy = (b0[1] + b1[1]) / 2, cx = (b0[0] + b1[0]) / 2, half = B * f(zs[k] - Z.crown) + 1e-6
      const halfX = A * f(zs[k] - Z.crown) + 1e-6
      const centre = Math.abs(cy) < 0.24 * half && Math.abs(cx) > 0.5 * halfX
      const part = stripe && !centre ? louvre : silver
      part.quad(b0, b1, t1, t0)
    }
  }
  silver.cap(rings[levels], true)
}

// --- ball and spire ------------------------------------------------------------
{
  const c: V3 = [0, 0, Z.top + 1.6], r = 2.2, seg = 10, rows = 6
  const pt = (i: number, k: number): V3 => {
    const th = (i / seg) * Math.PI * 2, ph = -Math.PI / 2 + (k / rows) * Math.PI
    return [c[0] + r * Math.cos(ph) * Math.cos(th), c[1] + r * Math.cos(ph) * Math.sin(th), c[2] + r * Math.sin(ph)]
  }
  for (let k = 0; k < rows; k++) for (let i = 0; i < seg; i++) {
    const a = pt(i, k), b = pt(i + 1, k), d = pt(i, k + 1), e = pt(i + 1, k + 1)
    if (k > 0) silver.tri(a, b, e)
    if (k < rows - 1) silver.tri(a, e, d)
  }
  // the spire: a square mast tapering from 1.8 m to a point
  const base = Z.top + 3.2, h0 = 0.9
  const r0: V3[] = [[-h0, -h0, base], [h0, -h0, base], [h0, h0, base], [-h0, h0, base]]
  const apex: V3 = [0, 0, Z.tip]
  for (let i = 0; i < 4; i++) silver.tri(r0[i], r0[(i + 1) % 4], apex)
}

const mats: Swatch[] = [
  { name: 'window', color: 0x6c92a8, roughness: 0.3 },
  finish('rose-silver', 0xdfe4e7, 0.45),
  windowVariant(2, 0x56687a),
  finish('rose-gold', 0xcaa868, 0.5),
]
const parts = [glass, silver, louvre, gold].map((part, i) => ({ part, material: mats[i] }))
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Rose Rayhaan by Rotana', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: Z.tip,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/64890199'],
})
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
