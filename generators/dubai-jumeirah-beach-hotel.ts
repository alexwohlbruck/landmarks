/**
 * Jumeirah Beach Hotel (1997, WS Atkins), Jumeirah, Dubai — original
 * procedural geometry, CC0-1.0.
 * bun generators/dubai-jumeirah-beach-hotel.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: area centroid of the OSM outline way/10316322,
 * 25.141572 N, 55.1907292 E. Bearing 26.1° (the outline's long axis): in the
 * model frame +y runs along the hotel to its north-north-east end, and -x is
 * the sea side (west-north-west).
 *
 * Identity, in order of importance: a breaking wave. A narrow,
 * near-vertical full-height stretch at the south-west end, its tip curving
 * as a crescent, with the white crown block and its X frame on top; from it
 * the wave drops steeply and runs out in a long low tail along the S-curve
 * to the north-east end. The sea face is blue glass with white floor bands;
 * the land face is mostly white balconies and terraces with glass bands; a
 * grey service tower stands behind the point on the land side.
 *
 * Sources:
 *  - OSM (ODbL): outline way/10316322 (building=yes, tourism=hotel, height
 *    104, 26 levels, start_date 1997). The plan follows it: the model is
 *    built in stations every 4 m along its axis, each spanning the
 *    outline's width there. The podium way/182900210 around it (low hotel
 *    wings, untagged height) and the canopy way/1047823539 are separate and
 *    left to the map.
 *  - Wikipedia "Jumeirah Beach Hotel" (read 2026-11): opened 1997, 26
 *    floors, 93 m high when completed (SkyscraperPage); OSM gives 104 m,
 *    taken here as the top of the crown frame, with the roof at the point
 *    93 m.
 *  - Photos (Wikimedia Commons), with the side each was taken from:
 *    * Picture_223_-_Flickr_-_Ghayty.jpg, ghaya alghaya, CC BY 2.0, aerial
 *      from the sea (west): the S plan, the point near the middle, the
 *      north-east half's blue sea face rolling down to a low end, the
 *      south-west half's white terraces facing the sea, the grey core.
 *      https://commons.wikimedia.org/wiki/File:Picture_223_-_Flickr_-_Ghayty.jpg
 *    * Jumeira_Beach_Hotel_(вид_с_аквапарка)_-_panoramio.jpg, Валерий Дед,
 *      CC BY 3.0, level from Wild Wadi (south-east): the land side; the
 *      north-east half's terraces curving down (concave) over a few floors
 *      of glass; the south-west half's blue glass land face; the crown.
 *      https://commons.wikimedia.org/wiki/File:Jumeira_Beach_Hotel_(%D0%B2%D0%B8%D0%B4_%D1%81_%D0%B0%D0%BA%D0%B2%D0%B0%D0%BF%D0%B0%D1%80%D0%BA%D0%B0)_-_panoramio.jpg
 *    * Wild_Wadi_Water_Park_Dubai_(42447767842).jpg, (27628724907) and
 *      (40691481300), Jeremy Thompson, CC BY 2.0, from Wild Wadi (south):
 *      the point end-on as a crescent, terraces, the grey core tower.
 *      https://commons.wikimedia.org/wiki/File:Wild_Wadi_Water_Park_Dubai_(42447767842).jpg
 *    * Jumeirah_beach_hotel_-_panoramio_(1).jpg, Simon Costello, CC BY
 *      3.0: colours.
 *      https://commons.wikimedia.org/wiki/File:Jumeirah_beach_hotel_-_panoramio_(1).jpg
 *    * Burj_al_Arab_and_the_Beach_(14535539076).jpg, Wings and Petals, CC BY
 *      2.0, distant from the beach (north-east): the hotel end-on with its
 *      point and grey core.
 *      https://commons.wikimedia.org/wiki/File:Burj_al_Arab_and_the_Beach_(14535539076).jpg
 *    * Burj_Al_Arab_and_Jumeirah_Beach_(9601659067).jpg, Yacine Hary, CC
 *      BY 2.0: at night (glass lit, blue floodlighting).
 *  - No lidar, NAIP or map terrain here (UAE; Mapterhorn has no z15 tiles,
 *    so tools/terrain.ts could not check the site). The beach is flat;
 *    elevation 0.
 *  No Google, Apple, Bing or Mapbox imagery, Street View or 3D tiles were
 *  used. No look-only references.
 *
 * Numbers:
 *  - OSM: plan, 104 m overall (crown top).
 *  - Published: 93 m roof (Wikipedia), used for the point's roof.
 *  - Estimated from the land-side photos (primary for the elevation, at
 *    the lead's review): full height (93 m) from the south-west tip to
 *    y = -114; then the sea face falls as 18 + 75 (1 - s)^2.3 to 18 m at the
 *    north-east end; the land-side wall at 60% of that, with terraces
 *    between; the crown block 92–104 m over 10 m of the point; the grey core
 *    (x -13.5..-4.5, y -106..-86, 85 m); band spacing (three floors).
 *
 * Night: the blue glass and the core glow as windows; the white terraces
 * and the crown are softly floodlit.
 *
 * Doubts:
 *  - The wave's cross-section is simplified to a straight slope from the
 *    glass edge to the terrace edge, banded white and glass along its
 *    length; the real terraces step floor by floor.
 *  - The core's footprint is a guess from the outline's bulge; the
 *    south-west half's land face is seen only obliquely.
 *  - The aerial from the sea shows the north-east half higher and convex
 *    on the sea side; the model follows the level land-side photos, as the
 *    lead asked, and keeps the aerial for the plan only.
 *  - The crescent at the tip is the S-curve's own end, not a modelled curl;
 *    the X frame is drawn grey on a solid white block so it survives at
 *    phone size (the real frame is open).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]
const BEARING = 26.1

// OSM way/10316322 in the model frame (x across, y along the bearing).
const RING: XY[] = [[12.0, 96.8], [16.3, 84.3], [18.4, 68.3], [22.9, 62.9], [25.3, 59.0], [26.8, 53.4], [27.4, 43.3], [26.4, 37.8], [24.4, 31.0], [22.1, 24.9], [17.1, 15.8], [22.6, 16.2], [7.9, -6.4], [5.3, -11.6], [-3.6, -35.3], [-5.5, -42.1], [-7.2, -58.7], [-7.7, -64.9], [-8.2, -74.8], [-7.8, -86.2], [-5.0, -103.1], [-3.5, -104.6], [-2.5, -106.2], [-1.6, -107.8], [-1.2, -109.6], [-1.5, -112.1], [-2.4, -113.8], [-1.0, -119.0], [1.7, -126.7], [6.0, -136.4], [5.7, -140.8], [1.9, -144.0], [-2.5, -144.8], [-6.2, -143.9], [-11.7, -131.9], [-17.2, -117.5], [-21.5, -91.8], [-22.4, -74.7], [-22.1, -65.8], [-20.9, -58.0], [-18.4, -44.6], [-14.6, -33.0], [-8.8, -19.6], [-9.5, -13.6], [-9.2, -9.5], [-7.6, -6.5], [-4.7, -3.6], [-1.3, -1.9], [1.2, 7.5], [3.7, 18.1], [5.3, 36.0], [4.9, 52.0], [3.9, 67.3], [-0.0, 86.0], [-2.2, 94.1], [-5.2, 102.2], [-9.0, 111.6], [-13.6, 121.3], [-18.3, 131.2], [-18.6, 131.8], [-18.7, 132.5], [-18.9, 133.4], [-18.7, 135.2], [-18.0, 136.9], [-16.9, 138.2], [-15.3, 139.2], [-13.3, 139.7], [-11.7, 139.6], [-10.0, 139.0], [-8.7, 138.1], [-7.6, 136.7], [-5.1, 131.9], [-2.1, 126.7], [0.6, 121.2], [6.7, 108.4]]

/** The outline's extent across, at a given y. */
function across(y: number): [number, number] {
  const xs: number[] = []
  for (let i = 0; i < RING.length; i++) {
    const a = RING[i], b = RING[(i + 1) % RING.length]
    if ((a[1] - y) * (b[1] - y) < 0) xs.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]))
  }
  xs.sort((p, q) => p - q)
  return [xs[0], xs[xs.length - 1]]
}

// ---------- the wave's profile ----------
// The point is a narrow, near-vertical stretch at the south-west end (its
// end-on crescent is the S-curve's tip); from it the wave drops steeply,
// then runs out in a long low tail to the north-east end.
const Y0 = -142, Y1 = 138.5, YT = -114, YP = -128 // ends, end of the point, crown station
const TOP = 93, CROWN = 104
/** Heights at y: the sea face (glass) rises to `sea`; the land face's wall to `land`, with terraces between. */
function heights(y: number): { sea: number; land: number } {
  if (y <= YT) return { sea: TOP, land: TOP }
  const s = Math.min(1, (y - YT) / (Y1 - YT))
  const sea = 18 + (TOP - 18) * Math.pow(1 - s, 2.3)
  const land = Math.max(8, sea * (0.6 + 0.4 * Math.pow(1 - s, 10)))
  return { sea, land }
}

// ---------- stations ----------
type St = { y: number; x0: number; x1: number; h0: number; h1: number }
const ST: St[] = []
{
  const ys: number[] = []
  for (let y = Y0; y < Y1; y += 5) ys.push(y)
  ys.push(Y1)
  for (const v of [YP, YT]) if (!ys.includes(v)) ys.push(v)
  ys.sort((a, b) => a - b)
  for (const y of ys) {
    let [x0, x1] = across(y)
    if (x1 - x0 < 6) { const c = (x0 + x1) / 2; x0 = c - 3; x1 = c + 3 }
    const { sea, land } = heights(y)
    ST.push({ y, x0, x1, h0: sea, h1: land })
  }
}

// ---------- parts ----------
const white = new Part() // floor bands, terraces' balconies, crown
const glass = new Part() // blue glass
const core = new Part() // grey service tower
const roof = new Part()

const BAND = 10.5, LINE = 1.4 // three floors per band, a white floor band between

/** Clip a wall strip between two stations to a z range, return polygon in (t, z). */
function clip(hA: number, hB: number, z0: number, z1: number): XY[] {
  let poly: XY[] = [[0, 0], [1, 0], [1, hB], [0, hA]]
  const cut = (keep: (p: XY) => boolean, at: (a: XY, b: XY) => XY) => {
    const out: XY[] = []
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length]
      if (keep(a)) { out.push(a); if (!keep(b)) out.push(at(a, b)) }
      else if (keep(b)) out.push(at(a, b))
    }
    poly = out
  }
  const atZ = (z: number) => (a: XY, b: XY): XY => [a[0] + ((z - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), z]
  cut((p) => p[1] >= z0 - 1e-9, atZ(z0))
  if (poly.length) cut((p) => p[1] <= z1 + 1e-9, atZ(z1))
  return poly
}

/** A banded wall from a to b (plan points), top heights hA, hB; faces to the right of a->b... outward set by order. */
function wall(a: XY, b: XY, hA: number, hB: number, glassy: boolean) {
  const hmax = Math.max(hA, hB)
  for (let z = 0; z < hmax; z += BAND) {
    // sea face: glass with white floor bands; land face: white balconies with glass bands
    const segs: [number, number, Part][] = glassy
      ? [[z, z + LINE, white], [z + LINE, z + BAND, glass]]
      : [[z, z + 6.8, white], [z + 6.8, z + BAND, glass]]
    for (const [z0, z1, part] of segs) {
      const poly = clip(hA, hB, z0, z1)
      if (poly.length < 3) continue
      const pts = poly.map(([t, zz]) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, zz] as V3)
      for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1])
    }
  }
}

// side walls: sea side (x0, faces -x) and land side (x1, faces +x)
for (let k = 0; k < ST.length - 1; k++) {
  const A = ST[k], B = ST[k + 1]
  // both faces rise to their edge heights; the slope between them carries the terraces
  wall([B.x0, B.y], [A.x0, A.y], B.h0, A.h0, true)
  wall([A.x1, A.y], [B.x1, B.y], A.h1, B.h1, false)
  // the sloping terraces: from the glass edge's top to the low edge, in strips along the wave
  const N = 4
  const edge = (s: St, f: number): V3 => {
    // f = 0 at the glass edge, 1 at the terrace edge's foot
    return [s.x0 + (s.x1 - s.x0) * f, s.y, s.h0 + (s.h1 - s.h0) * f]
  }
  for (let i = 0; i < N; i++) {
    const f0 = i / N, f1 = (i + 1) / N
    const part = i === 1 ? glass : white
    const p = [edge(A, f0), edge(A, f1), edge(B, f1), edge(B, f0)]
    // orient so the face points up
    const n = (p[1][0] - p[0][0]) * (p[3][1] - p[0][1]) - (p[1][1] - p[0][1]) * (p[3][0] - p[0][0])
    if (n > 0) part.quad(p[0], p[1], p[2], p[3])
    else part.quad(p[0], p[3], p[2], p[1])
  }
}
// end caps
for (const [st, dir] of [[ST[0], -1], [ST[ST.length - 1], 1]] as [St, number][]) {
  const pts: V3[] = [[st.x0, st.y, 0], [st.x1, st.y, 0], [st.x1, st.y, st.h1], [st.x0, st.y, st.h0]]
  if (dir < 0) roof.quad(pts[0], pts[1], pts[2], pts[3])
  else roof.quad(pts[1], pts[0], pts[3], pts[2])
}

// ---------- the crown frame at the point ----------
{
  const s = ST.find((t) => t.y === YP)!
  // a solid white crown block (bold enough for a phone), with the frame's X
  // drawn on its two end faces in grey
  const x0 = s.x0 + 0.2, x1 = s.x1 - 0.2, HALF = 5, z0 = TOP - 1, z1 = CROWN
  {
    const c: V3[] = [[x0, YP - HALF, z0], [x1, YP - HALF, z0], [x1, YP + HALF, z0], [x0, YP + HALF, z0]]
    const t = c.map(([x, y]) => [x, y, z1] as V3)
    white.loft([c, t]); white.cap(t, true)
  }
  let yc = YP, d = 0.3, part = white
  const w = 2.6
  const bar = (a: XY, b: XY) => {
    // a flat bar in the x-z plane at y = yc, from a to b (x, z), width w, depth d
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz)
    const nx = (-dz / L) * (w / 2), nz = (dx / L) * (w / 2)
    const q = (p: XY, sx: number, sy: number): V3 => [p[0] + nx * sx, yc + sy * d, p[1] + nz * sx]
    const f = [q(a, -1, -1), q(b, -1, -1), q(b, 1, -1), q(a, 1, -1)]
    const r = [q(a, -1, 1), q(b, -1, 1), q(b, 1, 1), q(a, 1, 1)]
    const quadOut = (p0: V3, p1: V3, p2: V3, p3: V3) => {
      const c: V3 = [(a[0] + b[0]) / 2, yc, (a[1] + b[1]) / 2]
      const m: V3 = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2, (p0[2] + p2[2]) / 2]
      const e1: V3 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], e2: V3 = [p3[0] - p0[0], p3[1] - p0[1], p3[2] - p0[2]]
      const n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      if (n[0] * (m[0] - c[0]) + n[1] * (m[1] - c[1]) + n[2] * (m[2] - c[2]) >= 0) part.quad(p0, p1, p2, p3)
      else part.quad(p0, p3, p2, p1)
    }
    quadOut(f[0], f[1], f[2], f[3]); quadOut(r[0], r[1], r[2], r[3])
    for (let i = 0; i < 4; i++) quadOut(f[i], f[(i + 1) % 4], r[(i + 1) % 4], r[i])
  }
  const zt = z1 - 1.6, zb = z0 + 1.6, xa = x0 + 1.6, xb = x1 - 1.6
  part = roof
  for (const side of [-1, 1]) {
    yc = YP + side * (HALF + 0.3)
    bar([xa, zb], [xb, zt]); bar([xb, zb], [xa, zt])
  }
}

// ---------- the grey service tower behind the point ----------
{
  const cx = -9, cy = -96, hx = 4.5, hy = 10, H = 85, n = 6
  const ring: V3[] = []
  // stadium plan: straight sides along y, round ends
  for (let i = 0; i <= n; i++) { const a = Math.PI * (i / n); ring.push([cx + hx * Math.cos(a), cy + (hy - hx) + hx * Math.sin(a), 0]) }
  for (let i = 0; i <= n; i++) { const a = Math.PI + Math.PI * (i / n); ring.push([cx + hx * Math.cos(a), cy - (hy - hx) + hx * Math.sin(a), 0]) }
  const top = ring.map(([x, y]) => [x, y, H] as V3)
  core.loft([ring, top])
  roof.cap(top, true)
}

// ---------- write ----------
const soft = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.15 : 0.55)
const parts = [
  { part: white, material: { ...finish('jbh-white', 0xf0eee9, 0.7), floodlight: soft } },
  { part: glass, material: windowVariant(2, 0x6f93c0) },
  { part: core, material: windowVariant(3, 0x939daa) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Jumeirah Beach Hotel', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: CROWN,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/dubai-jumeirah-beach-hotel.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles (${parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')}), ${glb.length} bytes`)
