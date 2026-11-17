/**
 * Burj Al Arab (1994–1999, Tom Wright of WS Atkins), Jumeirah, Dubai —
 * original procedural geometry, CC0-1.0.
 * bun generators/dubai-burj-al-arab.ts [out.glb]
 *
 * The full header (sources, numbers, doubts) is the SOURCES comment below
 * the imports.
 */
import { Part, writeGlb, cross, sub, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

/* SOURCES
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: area centroid of the OSM outline way/12700546,
 * 25.1413059 N, 55.1853463 E. Bearing 127.3°: the axis of the V, from the
 * spine (apex, north-west, sea side) to the fabric sail (south-east, facing
 * the shore). In the model frame the sail faces +y; the spine's back is at
 * y = -68.8 (OSM apex). Below, u is the distance forward of that back line,
 * so y = u - 68.8.
 *
 * Identity, in order of importance: the sail silhouette in side view (a
 * vertical spine at the back, the white fabric front swelling out and curving
 * back to the roof); the two white curved steel legs that stand clear of the
 * building at the base and arch inward to meet the mast in a pointed arch;
 * the mast; the helipad disc cantilevered off the top of the sail and the Al
 * Muntaha restaurant pod crossing the spine at 200 m; the diagonal steel
 * trusses between legs and spine; the white ribbed (scalloped) PTFE fabric
 * front between two columns of blue rooms; blue glass wing faces.
 *
 * Sources:
 *  - OSM (ODbL): outline way/12700546 (building=hotel, height 321, 56
 *    levels): a sector, apex at the spine, wing ends at ±38.8 m, 92 m in
 *    front of the apex, and a circular front reaching 108.3 m. The Skyview
 *    Bar way/1173799867 (the Al Muntaha cantilever, a 60 x 21 m strip across
 *    the axis). Two untagged 5 x 6 m buildings way/1054051580 and
 *    way/1054051581, placed symmetrically at x = ±50, u = 88: probably the
 *    legs' footings (the photos show the legs landing clear of the building,
 *    about ±48 m apart); the side photo puts the leg feet at u = 72, so the
 *    model follows the photo in u and the pads in x. Other buildings on the island (Scape way/636376063, roofs
 *    way/1272790433, way/1272790434) are separate and not modelled; the
 *    island itself is the map's ground.
 *  - Wikipedia "Burj Al Arab" (read 2026-11): 321 m to the mast top, helipad
 *    at 210 m, top floor 197.5 m, Al Muntaha 200 m up "supported by a full
 *    cantilever that extends 27 m from either side of the mast", atrium
 *    180 m, 56 floors (28 duplex levels), two wings in a V with the fabric
 *    closing the atrium.
 *  - Photos (Wikimedia Commons), with the side each was taken from:
 *    * Burj_al_Arab_and_the_Beach_(14535539076).jpg, Wings and Petals,
 *      CC BY 2.0, distant and level from the beach to the north-east (a near
 *      side view, about 15° off): the side profile (front at 104/108/106/
 *      99/86/74 m from the back at heights 0/44/89/133/177/206 m, scaled to
 *      321 m), the leg's curve, the truss groups at 11/60/126/190 m, the
 *      helipad and pod heights, the shaft and mast.
 *      https://commons.wikimedia.org/wiki/File:Burj_al_Arab_and_the_Beach_(14535539076).jpg
 *    * Burj_Al_Arab,_Dubai.jpg, Heba Hashem, CC BY-SA 4.0, distant from
 *      inland (south-east, about 25° off the axis): the front, the legs
 *      standing about ±50 m apart at the base, the ribbed fabric between
 *      the two window columns, the shaft between the legs.
 *      https://commons.wikimedia.org/wiki/File:Burj_Al_Arab,_Dubai.jpg
 *    * Burj_Al_Arab_and_the_beach_(Pexels_823696).jpg, Aleksandar Pasaric,
 *      CC0, from the sea (south-west): the south-west face, trusses, pod.
 *      https://commons.wikimedia.org/wiki/File:Burj_Al_Arab_and_the_beach_(Pexels_823696).jpg
 *    * Jumeirah_Beach_-_panoramio_(1).jpg, Aidas U., CC BY 3.0, from the
 *      beach (north-east): side profile, scallops of the fabric.
 *      https://commons.wikimedia.org/wiki/File:Jumeirah_Beach_-_panoramio_(1).jpg
 *    * Madinat_Jumeirah-Dubai3303.JPG, Diego Delso, CC BY-SA 4.0, from
 *      Madinat Jumeirah (south-south-west): the top, pod, helipad, colours.
 *      https://commons.wikimedia.org/wiki/File:Madinat_Jumeirah-Dubai3303.JPG
 *    * Dubai_in_January_2025_12.jpg, Renek78, CC0, from Madinat Jumeirah:
 *      colour of the glass and fabric in sun.
 *      https://commons.wikimedia.org/wiki/File:Dubai_in_January_2025_12.jpg
 *    * A_burjalrab_green_view.jpg, Afk2007, CC BY-SA 4.0: colours, pod end.
 *      https://commons.wikimedia.org/wiki/File:A_burjalrab_green_view.jpg
 *    * Night: New_Year_in_Dubai_-_Burj_Al_Arab_(31865708942).jpg, Bengin
 *      Ahmad, CC BY 2.0; Burj_Al-Arab_(13996844503).jpg, Marco Becerra,
 *      CC BY 2.0 (the sail lit in changing colours).
 *  - No lidar, NAIP or map terrain here (UAE; Mapterhorn has no z15 tiles,
 *    so tools/terrain.ts could not check the site). The island is flat
 *    reclaimed land; elevation 0.
 *  No Google, Apple, Bing or Mapbox imagery, Street View or 3D tiles were
 *  used. No look-only references.
 *
 * Numbers:
 *  - Published: mast top 321 m, helipad deck 210 m, pod at 200 m and 27 m
 *    each side of the mast.
 *  - OSM: depth (108.3 m back to front), the legs' spread (±48–50 m), the
 *    wing line x = 0.42 u.
 *  - Estimated from the front photo (lead review): above 40 m the plan
 *    draws in as a pointed (equilateral) arch, closing almost to a point at
 *    the roof, so the front reads as a lens; the fabric fills about 78% of
 *    the front width, flanked by narrow window columns at the wing ends
 *    (u = F-30 to F-11).
 *  - Estimated from the photos scaled to 321 m: the side profile (above),
 *    roof 206 m, shaft top 272 m and the legs meeting it at about 278 m, the
 *    leg path, helipad radius 12.5 m and 10 m forward of the sail's top, pod
 *    21 m deep (u -7..14) and 10 m tall, shaft 13 x 17 m, the window columns
 *    at the wing ends, scallop depth (1.5 m)
 *    and spacing (13 bays), truss groups.
 *  - Drawn bolder than real: the legs (5.2 m), trusses (2.4 m), mast.
 *
 * Night: the sail is lit in changing colours; it is drawn floodlit in a calm
 * white (`_FLOODLIGHT` 1 on the fabric), as are the legs, trusses, spine and
 * mast. The blue glass bands glow as windows (rooms lit), and the pod's
 * glazing too.
 *
 * Doubts:
 *  - The OSM Skyview Bar strip lies 35–55 m forward of the apex; the photos
 *    (side view, and the pod end seen beyond the spine from the south-west)
 *    put the pod across the spine, about -7..14 m. The photos are followed.
 *  - The exact plan of the wing ends and the fabric's width are estimated
 *    from oblique photos; no plan drawing or aerial was available.
 *  - The wing faces are drawn as continuous blue ribbons two duplex floors
 *    tall with white bands, as the real faces read; no piers.
 */

type XY = [number, number]
const BEARING = 127.3
const U0 = -68.8 // y of the spine's back line (OSM apex)
const P = (x: number, u: number, z: number): V3 => [x, u + U0, z]

// ---------- helpers ----------
const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scl = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Smooth monotone-ish interpolation through a table [[x, y], ...] (Catmull-Rom, clamped). */
function interp(tab: XY[], x: number): number {
  if (x <= tab[0][0]) return tab[0][1]
  if (x >= tab[tab.length - 1][0]) return tab[tab.length - 1][1]
  let i = 0
  while (tab[i + 1][0] < x) i++
  const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)]
  const t = (x - p1[0]) / (p2[0] - p1[0])
  const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * (p2[0] - p1[0])
  const m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * (p2[0] - p1[0])
  const t2 = t * t, t3 = t2 * t
  return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2
}

/** A grid surface: g[j][i], i along, j up; smooth normals from the grid; outward = cross(d/di, d/dj). */
function surface(part: Part, g: V3[][], flip = false) {
  const J = g.length, I = g[0].length
  const nrm: V3[][] = g.map((row, j) => row.map((_, i) => {
    const a = g[j][Math.min(I - 1, i + 1)], b = g[j][Math.max(0, i - 1)]
    const c = g[Math.min(J - 1, j + 1)][i], d = g[Math.max(0, j - 1)][i]
    const n = norm(cross(sub(a, b), sub(c, d)))
    return flip ? scl(n, -1) : n
  }))
  for (let j = 0; j < J - 1; j++)
    for (let i = 0; i < I - 1; i++) {
      const A = g[j][i], B = g[j][i + 1], C = g[j + 1][i + 1], D = g[j + 1][i]
      const nA = nrm[j][i], nB = nrm[j][i + 1], nC = nrm[j + 1][i + 1], nD = nrm[j + 1][i]
      part.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      part.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
    }
}

/** A tube along a path, smooth-shaded; `ref` picks the side the section's first corner faces. */
function tube(part: Part, path: V3[], r: number | number[], n = 8, cap = true) {
  const rings: V3[][] = [], centers: V3[] = []
  for (let k = 0; k < path.length; k++) {
    const T = norm(sub(path[Math.min(path.length - 1, k + 1)], path[Math.max(0, k - 1)]))
    let N = norm(cross(T, [0, 0, 1]))
    if (Math.hypot(...cross(T, [0, 0, 1])) < 1e-3) N = norm(cross(T, [1, 0, 0]))
    const B = norm(cross(T, N))
    const rr = Array.isArray(r) ? r[k] : r
    const ring: V3[] = []
    for (let i = 0; i <= n; i++) {
      const a = (2 * Math.PI * i) / n
      ring.push(add(path[k], add(scl(N, Math.cos(a) * rr), scl(B, Math.sin(a) * rr))))
    }
    rings.push(ring); centers.push(path[k])
  }
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < n; i++) {
      const a = rings[k][i], b = rings[k][i + 1], c = rings[k + 1][i + 1], d = rings[k + 1][i]
      const na = norm(sub(a, centers[k])), nb = norm(sub(b, centers[k])), nc = norm(sub(c, centers[k + 1])), nd = norm(sub(d, centers[k + 1]))
      part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
      part.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
    }
  if (cap) for (const k of [0, rings.length - 1]) {
    const T = norm(sub(path[k === 0 ? 1 : k], path[k === 0 ? 0 : k - 1]))
    const out = k === 0 ? scl(T, -1) : T
    for (let i = 0; i < n; i++) part.tri(centers[k], rings[k][i], rings[k][i + 1], undefined, undefined, undefined, [out, out, out])
  }
}

/** A straight beam with a square section of side w between two points. */
function beam(part: Part, a: V3, b: V3, w: number, h = w) {
  const T = norm(sub(b, a))
  let N = cross(T, [0, 0, 1])
  N = Math.hypot(...N) < 1e-3 ? [1, 0, 0] : norm(N)
  const B = norm(cross(N, T))
  const c = (p: V3, s: number, t: number) => add(p, add(scl(N, s * w / 2), scl(B, t * h / 2)))
  const sq = (p: V3) => [c(p, -1, -1), c(p, 1, -1), c(p, 1, 1), c(p, -1, 1)]
  const A = sq(a), Bq = sq(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid = scl(add(add(A[i], A[j]), add(Bq[i], Bq[j])), 0.25)
    const ctr = scl(add(a, b), 0.5)
    const out = norm(sub(mid, ctr))
    part.tri(A[i], A[j], Bq[j], undefined, undefined, undefined, [out, out, out])
    part.tri(A[i], Bq[j], Bq[i], undefined, undefined, undefined, [out, out, out])
  }
  const ta = scl(T, -1)
  part.tri(A[0], A[2], A[1], undefined, undefined, undefined, [ta, ta, ta]); part.tri(A[0], A[3], A[2], undefined, undefined, undefined, [ta, ta, ta])
  part.tri(Bq[0], Bq[1], Bq[2], undefined, undefined, undefined, [T, T, T]); part.tri(Bq[0], Bq[2], Bq[3], undefined, undefined, undefined, [T, T, T])
}

/** A chamfered box (plan x0..x1, u0..u1) from z0 to z1, flat-shaded. */
function box(part: Part, x0: number, x1: number, u0: number, u1: number, z0: number, z1: number, ch = 0.6, top = true) {
  const ring: XY[] = [[x0 + ch, u0], [x1 - ch, u0], [x1, u0 + ch], [x1, u1 - ch], [x1 - ch, u1], [x0 + ch, u1], [x0, u1 - ch], [x0, u0 + ch]]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    part.quad(P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1))
  }
  if (top) part.cap(ring.map(([x, u]) => P(x, u, z1)), true)
}

// ---------- parts ----------
const white = new Part() // legs, trusses, spine, shaft, mast, helipad, pod shell, spandrels
const sail = new Part() // the PTFE fabric front
const glass = new Part() // blue room glazing on the wing ends
const sideGlass = new Part() // paler glazing on the wing sides
const podGlass = new Part() // restaurant glazing
const roof = new Part()

// ---------- the side profile ----------
const ROOF = 206
/** The fabric front's distance from the back line, at height z (side photo). */
const FRONT: XY[] = [[0, 103.5], [12, 105.5], [44, 108.3], [89, 107], [133, 99], [177, 86], [ROOF, 74]]
const F = (z: number) => interp(FRONT, z)
const WING = 0.42 // wing line: x = WING * u (OSM sector)
/** Plan corners at height z: A = wing end on the V line, B = where the fabric starts. */
function plan(z: number) {
  const f = F(z)
  // seen from the front the body is a pointed lens: above ~40 m the wings
  // and the fabric draw in, closing almost to a point at the roof (front photo)
  const t = Math.max(0, (z - 40) / (ROOF + 4 - 40))
  const taper = Math.max(0.04, 2 * Math.sqrt(1 - 0.75 * t * t) - 1) // pointed (equilateral) arch
  const uA = f - 30, xA = WING * uA * taper
  // the fabric fills most of the front, flanked by narrow window columns
  const k = 0.78 - 0.2 * t * t
  const xB = k * xA
  const d = 11 * (xB / 30) // fabric bulge in front of B
  return { f, uA, xA, xB, uB: f - d, d }
}
const BACK = 4 // half-width of the back line

// ---------- wings: blue bands with white floor bands ----------
// Two duplex floors (about 13.2 m) per band; a 2.2 m white band between.
const BANDS: number[] = [0, 9]
for (let z = 9; z + 13.2 <= ROOF + 0.1; z += 13.2) BANDS.push(+(z + 13.2).toFixed(2))
if (BANDS[BANDS.length - 1] < ROOF) BANDS.push(ROOF)
const SPAN = 3.0
for (let k = 0; k < BANDS.length - 1; k++) {
  const zs = [BANDS[k], BANDS[k] + (k === 0 ? 0 : SPAN), BANDS[k + 1]]
  for (let s = 0; s < 2; s++) {
    const z0 = zs[s], z1 = zs[s + 1]
    if (z1 - z0 < 0.01) continue
    const part = s === 0 ? white : glass
    const side = s === 0 ? white : sideGlass
    const p0 = plan(z0), p1 = plan(z1)
    // right wing face (+x), back -> A
    side.quad(P(BACK, 0, z0), P(p0.xA, p0.uA, z0), P(p1.xA, p1.uA, z1), P(BACK, 0, z1))
    // right wing end, A -> B
    part.quad(P(p0.xA, p0.uA, z0), P(p0.xB, p0.uB, z0), P(p1.xB, p1.uB, z1), P(p1.xA, p1.uA, z1))
    // left wing end, B -> A
    part.quad(P(-p0.xB, p0.uB, z0), P(-p0.xA, p0.uA, z0), P(-p1.xA, p1.uA, z1), P(-p1.xB, p1.uB, z1))
    // left wing face, A -> back
    side.quad(P(-p0.xA, p0.uA, z0), P(-BACK, 0, z0), P(-BACK, 0, z1), P(-p1.xA, p1.uA, z1))
  }
}
// back face (behind the spine core; mostly hidden)
white.quad(P(-BACK, 0, 0), P(BACK, 0, 0), P(BACK, 0, ROOF), P(-BACK, 0, ROOF))

// ---------- the fabric sail, scalloped between ribs ----------
{
  const BAYS = 13, SUB = 4, NA = 14, RIB = 1.5
  const g: V3[][] = []
  for (let j = 0; j <= BAYS * SUB; j++) {
    const z = (ROOF * j) / (BAYS * SUB)
    const fr = (j % SUB) / SUB
    const pull = RIB * (1 - Math.sin(Math.PI * fr)) * (j === 0 ? 0.4 : 1)
    const p = plan(z)
    const row: V3[] = []
    for (let i = 0; i <= NA; i++) {
      const phi = (Math.PI * i) / NA // 0 at right B, pi at left B
      const s = Math.sin(phi)
      row.push(P(p.xB * Math.cos(phi), p.uB + (p.d - pull) * s - pull * 0.35 * s, z))
    }
    g.push(row)
  }
  surface(sail, g)
}

// ---------- roof ----------
{
  const p = plan(ROOF)
  const ring: V3[] = [P(BACK, 0, ROOF), P(p.xA, p.uA, ROOF)]
  for (let i = 0; i <= 12; i++) {
    const phi = (Math.PI * i) / 12
    ring.push(P(p.xB * Math.cos(phi), p.uB + p.d * Math.sin(phi), ROOF))
  }
  ring.push(P(-p.xA, p.uA, ROOF), P(-BACK, 0, ROOF))
  // The ring isn't convex where the wings meet the back line, so a fan
  // would turn a triangle over; ear-clip it instead.
  for (const [i, j, k] of earClip(ring)) roof.tri(ring[i], ring[j], ring[k])
}

/** Ear-clipping triangulation of a simple ring, counter-clockwise from above. */
function earClip(ring: V3[]): [number, number, number][] {
  const cz = (a: V3, b: V3, c: V3) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  while (idx.length > 3) {
    const k = idx.findIndex((i1, k) => {
      const i0 = idx[(k + idx.length - 1) % idx.length], i2 = idx[(k + 1) % idx.length]
      const [a, b, c] = [ring[i0], ring[i1], ring[i2]]
      return cz(a, b, c) > 1e-9 && !idx.some((j) => j !== i0 && j !== i1 && j !== i2 &&
        cz(a, b, ring[j]) >= 0 && cz(b, c, ring[j]) >= 0 && cz(c, a, ring[j]) >= 0)
    })
    if (k < 0) throw new Error('earClip: ring is not simple')
    out.push([idx[(k + idx.length - 1) % idx.length], idx[k], idx[(k + 1) % idx.length]])
    idx.splice(k, 1)
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

// ---------- spine core and the shaft above the roof ----------
box(white, -7, 7, -1, 16, 0, ROOF + 1.5, 0.8)
const SHAFT_TOP = 272
box(white, -5.5, 5.5, 9, 25, ROOF, SHAFT_TOP, 0.8, false)
{
  // pointed top of the shaft, where the legs meet
  const ring: XY[] = [[-5.5, 9], [5.5, 9], [5.5, 25], [-5.5, 25]]
  const apex = P(0, 18, SHAFT_TOP + 9)
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4]
    white.tri(P(a[0], a[1], SHAFT_TOP), P(b[0], b[1], SHAFT_TOP), apex)
  }
}
// mast (bolder than real)
{
  const path: V3[] = [], r: number[] = []
  for (let k = 0; k <= 4; k++) { path.push(P(0, 18, 270 + (321 - 270) * (k / 4))); r.push(lerp(2.6, 0.7, k / 4)) }
  tube(white, path, r, 8)
}

// ---------- the legs ----------
// Feet at x ±48 (OSM pads) and u 72 (side photo), rising nearly vertical, arching in
// to meet the shaft top (side and front photos).
const LEG: [number, number, number][] = [
  [48, 72, 0], [48, 72, 40], [47, 71, 90], [44.5, 67, 133], [40, 60, 175], [34, 53, 205], [24.5, 42, 235], [14, 31, 258], [4, 21, 276],
]
function legPath(sx: number): V3[] {
  const out: V3[] = []
  const N = 24
  // parametrise by index along the control polygon with Catmull-Rom
  const ctrl = LEG.map(([x, u, z]) => [sx * x, u, z] as V3)
  for (let k = 0; k <= N; k++) {
    const t = (k / N) * (ctrl.length - 1)
    const i = Math.min(ctrl.length - 2, Math.floor(t)), f = t - i
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)]
    const c = (a: number, b: number, cc: number, d: number) =>
      0.5 * (2 * b + (-a + cc) * f + (2 * a - 5 * b + 4 * cc - d) * f * f + (-a + 3 * b - 3 * cc + d) * f * f * f)
    out.push(P(c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1]), c(p0[2], p1[2], p2[2], p3[2])))
  }
  out[0][2] = 0
  return out
}
/** The leg's centre at height z (on the given side). */
function legAt(sx: number, z: number): V3 {
  const pts = legPath(sx)
  for (let k = 0; k < pts.length - 1; k++)
    if (pts[k + 1][2] >= z) {
      const t = (z - pts[k][2]) / (pts[k + 1][2] - pts[k][2])
      return [lerp(pts[k][0], pts[k + 1][0], t), lerp(pts[k][1], pts[k + 1][1], t), z]
    }
  return pts[pts.length - 1]
}
for (const sx of [1, -1]) tube(white, legPath(sx), 2.6, 8)

// ---------- trusses between legs and spine ----------
// Three groups (11–60, 60–126, 126–190 m): a horizontal tie at each group
// line and one diagonal from the leg at a group's top to the spine at its foot.
{
  const LINES = [11, 60, 126, 190]
  for (const sx of [1, -1]) {
    const spine = (z: number): V3 => P(sx * 7, 8, z)
    for (const z of LINES) beam(white, spine(z), legAt(sx, z), 2.2, 2.4)
    for (let k = 0; k < LINES.length - 1; k++) {
      beam(white, legAt(sx, LINES[k + 1]), spine(LINES[k]), 2.4)
    }
  }
}

// ---------- helipad ----------
{
  const C: XY = [0, 80], R = 12.5, TOP = 211, RIM = 1.6, N = 16
  const ring = (r: number, z: number) => Array.from({ length: N }, (_, i) => {
    const a = (2 * Math.PI * i) / N
    return P(C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z)
  })
  const top = ring(R, TOP), lo = ring(R, TOP - RIM), under = ring(4, TOP - RIM - 5.5), stem = ring(2.6, ROOF - 2)
  white.loft([lo, top])
  white.loft([under, lo])
  white.loft([stem, under])
  white.cap(top, true)
}

// ---------- Al Muntaha restaurant pod ----------
{
  // section (u, z) as an octagon, extruded across x; ends taper.
  const sec = (h: number, d: number, uc: number, zc: number): XY[] => [
    [uc - d / 2 + 2, zc - h / 2], [uc + d / 2 - 2, zc - h / 2], [uc + d / 2, zc - h / 2 + 2], [uc + d / 2, zc + h / 2 - 1.5],
    [uc + d / 2 - 1.5, zc + h / 2], [uc - d / 2 + 1.5, zc + h / 2], [uc - d / 2, zc + h / 2 - 1.5], [uc - d / 2, zc - h / 2 + 2],
  ]
  const UC = 3.5, ZC = 199
  const xs = [-30, -24, 24, 30]
  const secs = [sec(8, 16, UC, ZC + 0.8), sec(12, 23, UC, ZC), sec(12, 23, UC, ZC), sec(8, 16, UC, ZC + 0.8)]
  const rings: V3[][] = xs.map((x, k) => secs[k].map(([u, z]) => P(x, u, z)))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
      // glazing on the long sides' upper half
      const zmid = (a[2] + b[2]) / 2
      const isGlass = k === 1 && (i === 2 || i === 6) && Math.abs(zmid - ZC) < 4
      const part = isGlass ? podGlass : white
      // section points run ccw in (u, z), i.e. ccw seen from +x (y x z = x); quad (a, b, c, d) faces out
      part.quad(a, b, c, d)
    }
  // end faces: glazed ovals
  const endL = rings[0], endR = rings[3]
  for (const [ring, sx] of [[endL, -1], [endR, 1]] as [V3[], number][]) {
    const c = scl(ring.reduce((s, p) => add(s, p), [0, 0, 0] as V3), 1 / ring.length)
    const n: V3 = [sx, 0, 0]
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      white.tri(c, ring[i], ring[j], undefined, undefined, undefined, [n, n, n])
    }
    // oval window inset on the end
    const win = Array.from({ length: 10 }, (_, i) => {
      const a = (2 * Math.PI * i) / 10
      return add(c, [sx * 0.06, 5.5 * Math.cos(a), 2.4 * Math.sin(a)] as V3)
    })
    for (let i = 0; i < 10; i++) podGlass.tri(add(c, [sx * 0.06, 0, 0]), win[i], win[(i + 1) % 10], undefined, undefined, undefined, [n, n, n])
  }
}

// ---------- write ----------
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.85)
const parts = [
  { part: white, material: { ...finish('burj-white', 0xedeeec, 0.6), floodlight: lit } },
  { part: sail, material: { ...finish('burj-sail', 0xfbf9f4, 0.9), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : 1) } },
  { part: glass, material: windowVariant(2, 0x7b9bc6) },
  { part: sideGlass, material: windowVariant(3, 0x9fb4cb) },
  { part: podGlass, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Burj Al Arab', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 321,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/dubai-burj-al-arab.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles (${parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')}), ${glb.length} bytes`)
