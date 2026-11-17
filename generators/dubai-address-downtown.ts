/**
 * The Address Downtown, Dubai — original procedural geometry, CC0-1.0.
 * bun generators/dubai-address-downtown.ts
 *
 * This file also exports the small plan-and-block kit used by the other Dubai
 * models of this builder (dubai-address-sky-view, dubai-millennium-tower,
 * dubai-opus import it). Merge this generator first.
 *
 * Frame: map frame, x east, y north, z up, metres, turned to BEARING 11 (the
 * tower's long axis), origin at the centroid of the tower part.
 *
 * Evidence
 * - OSM way/532836513 (building:part, height 306.2, 63 levels, wikidata
 *   Q111150315): the tower's leaf-shaped plan, 42.6 x 82.2 m, round at the
 *   south end and pointed at the north tip. The 20 m podium outline
 *   way/47515674 (building=retail, wikipedia "The Address Downtown Dubai",
 *   wikidata Q677823) is the hotel's base and the Dubai Mall link; the model
 *   does not draw it and does not replace it, so the map keeps its extrusion.
 * - Published: 306 m (the batch assignment; OSM's height tag 306.2 and 63
 *   levels agree), opened 2008 (OSM start_date on the podium).
 * - Photos (all daylight unless noted):
 *   a1 "The Address Downtown Dubai", kameraderie, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/100083154@N03/11535177394 (from the lake, W);
 *   a3 "The Address @ Downtown Dubai", *_* (flickr 22539273@N00), CC BY 2.0,
 *     https://www.flickr.com/photos/22539273@N00/15617699028 (from the lake, W: the
 *     broad west face, the hood and twin pins over the north tip, the tiers);
 *   a4 "The Address Downtown Dubai", oiva_eskola, CC BY-SA 2.0,
 *     https://www.flickr.com/photos/8107050@N02/16317989997 (night, from the Burj
 *     Khalifa: the hood and spire lit white);
 *   a5 "The Address, Downtown Dubai", Rob Young, CC BY 2.0,
 *     https://www.flickr.com/photos/76562640@N00/30987941652 (from the SW, under wraps
 *     after the 2015 fire: hood, pins and the curved tiers);
 *   a9 "View from Burj Khalifa (8667329327).jpg", Rob Young, CC BY 2.0,
 *     https://commons.wikimedia.org/wiki/File:View_from_Burj_Khalifa_(8667329327).jpg;
 *   a10 "Dubai Fountain from Burj Khalifa (15795939749).jpg", edward stojakovic,
 *     CC BY 2.0, https://commons.wikimedia.org/wiki/File:Dubai_Fountain_from_Burj_Khalifa_(15795939749).jpg
 *     (from the NW and high: the white body, the setback, the dark lantern band
 *     and the pale hood; the distant view used for the height fractions).
 * - No lidar or aerial imagery covers the UAE in the allowed sources, and the
 *   map terrain (Mapterhorn) has no tiles here, so the ground could not be
 *   checked. The site is flat; elevation 0.
 *
 * Numbers
 * - Tip 306: published. Plan: OSM (resampled to 28 points, lightly smoothed).
 * - Estimated from a10 and a3 as fractions of 306 m: the south-end setback
 *   at 200 m (0.65), a second at 226 m, the dark lantern band 233-246 m, the
 *   hood 246-288 m (0.80-0.94), the second pin 299 m. The plan above the
 *   setbacks is the OSM plan pulled back towards the north tip (0.84, 0.76,
 *   0.69 of its length) - estimated. The hood is a quarter-ellipse in section
 *   closing on the north tip - drawn from a3/a5/a10.
 * - Tiers: four rounded tiers on the west side and round the north tip, 11 to
 *   3 m out from the tower, tops at 21/31/41/50 m - estimated from a3, a5 and
 *   a10 (photo a3 is close and low, so heights were taken lower than it shows).
 * - Facade (lead review, round 1): pale silver cladding is the main surface,
 *   as in a5 and a10; each 13 m (three-floor) group has a 5 m dark window band
 *   broken by a pier every fourth plan edge, and 8 m of cladding. The two plan
 *   edges at the north tip are dark full height: the dark vertical strip in a5.
 * - Bevels 0.5-0.9 m on every terrace, tier and setback; the hood is smooth.
 * - The spire and the second pin are drawn a little thicker than real.
 * Look-only references: none.
 * Doubts: no photo shows the east face squarely; the tiers' extent round the
 * east side and the low block on the south side (a3, right) are left to the
 * map's podium extrusion. The tower part's 20 m podium (way/47515674) is not
 * replaced; if the map drops building outlines that have parts, the podium
 * will be missing round the tower.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'

// ---------------------------------------------------------------------------
// Kit: plans are CCW polygons in the model frame (x east, y north, metres).
// ---------------------------------------------------------------------------
export type V2 = [number, number]

export const add2 = (a: V2, b: V2): V2 => [a[0] + b[0], a[1] + b[1]]
export const sub2 = (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]]
export const mul2 = (a: V2, s: number): V2 => [a[0] * s, a[1] * s]
export const nrm2 = (a: V2): V2 => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] }
export const lerp2 = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

export function area(poly: V2[]) {
  let s = 0
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return s / 2
}
export const ccw = (poly: V2[]) => (area(poly) < 0 ? [...poly].reverse() : poly)

/** A superellipse (power 2: an ellipse; higher: squarer), CCW, n points. */
export function oval(c: V2, a: number, b: number, n = 24, p = 2, rot = 0): V2[] {
  const out: V2[] = [], cr = Math.cos(rot), sr = Math.sin(rot)
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, ct = Math.cos(t), st = Math.sin(t)
    const x = a * Math.sign(ct) * Math.abs(ct) ** (2 / p), y = b * Math.sign(st) * Math.abs(st) ** (2 / p)
    out.push([c[0] + x * cr - y * sr, c[1] + x * sr + y * cr])
  }
  return out
}

/** Resample a closed outline to n points evenly spaced along its perimeter. */
export function resample(poly: V2[], n: number, smooth = 0): V2[] {
  const segs: number[] = []
  let L = 0
  for (let i = 0; i < poly.length; i++) { const d = Math.hypot(...sub2(poly[(i + 1) % poly.length], poly[i])); segs.push(d); L += d }
  const out: V2[] = []
  let i = 0, acc = 0
  for (let k = 0; k < n; k++) {
    const s = (k / n) * L
    while (acc + segs[i] < s) { acc += segs[i]; i++ }
    out.push(lerp2(poly[i], poly[(i + 1) % poly.length], (s - acc) / (segs[i] || 1)))
  }
  let r = out
  for (let it = 0; it < smooth; it++) r = r.map((p, k) => lerp2(p, lerp2(r[(k + n - 1) % n], r[(k + 1) % n], 0.5), 0.5))
  return r
}

/** A CCW polygon moved inwards by d (negative: outwards), mitred with a cap. */
export function inset(poly: V2[], d: number): V2[] {
  const n = poly.length
  return poly.map((v, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const u1 = nrm2(sub2(v, a)), u2 = nrm2(sub2(b, v))
    const n1: V2 = [-u1[1], u1[0]], n2: V2 = [-u2[1], u2[0]]
    const k = Math.max(0.35, 1 + n1[0] * n2[0] + n1[1] * n2[1])
    return add2(v, mul2(add2(n1, n2), d / k))
  })
}

/** Chamfer every corner sharper than `deg` by cutting `cut` metres back along both edges. */
export function chamfer(poly: V2[], cut: number, deg = 30): V2[] {
  const out: V2[] = [], n = poly.length
  poly.forEach((p, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const u1 = nrm2(sub2(p, a)), u2 = nrm2(sub2(b, p))
    const turn = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / (Math.PI / 180)
    if (turn < deg) { out.push(p); return }
    out.push(add2(p, mul2(u1, -cut)), add2(p, mul2(u2, cut)))
  })
  return out
}

/** Clip a polygon to the half-plane dot(p, dir) <= v. */
export function clip(poly: V2[], dir: V2, v: number): V2[] {
  const out: V2[] = [], f = (p: V2) => p[0] * dir[0] + p[1] * dir[1] - v
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa <= 0) out.push(a)
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) out.push(lerp2(a, b, fa / (fa - fb)))
  }
  return out
}

/** Ear-clipping triangulation of a simple CCW polygon. */
export function triangulate(poly: V2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), tris: [number, number, number][] = []
  const cz = (a: V2, b: V2, c: V2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: V2, a: V2, b: V2, c: V2) => cz(a, b, p) >= -1e-9 && cz(b, c, p) >= -1e-9 && cz(c, a, p) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(poly[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) { // degenerate leftovers: fan them
      for (let k = 1; k < idx.length - 1; k++) tris.push([idx[0], idx[k], idx[k + 1]])
      return tris
    }
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}

const at = (p: V2, z: number): V3 => [p[0], p[1], z]

/** Outward vertex normals of a CCW ring: smooth where the turn is under `smooth` degrees. */
function edgeNormals(ring: V2[]): V2[] {
  return ring.map((p, i) => { const d = nrm2(sub2(ring[(i + 1) % ring.length], p)); return [d[1], -d[0]] as V2 })
}
function cornerNormal(en: V2[], v: number, e: number, smooth: number): V2 {
  const n = en.length, a = en[(v + n - 1) % n], b = en[v]
  const dot = a[0] * b[0] + a[1] * b[1]
  if (Math.acos(Math.max(-1, Math.min(1, dot))) / (Math.PI / 180) < smooth) return nrm2(add2(a, b))
  return en[e]
}

/**
 * Side walls between ring r0 at z0 and ring r1 at z1 (same vertex count, CCW).
 * `pick(i)` may route edge i's quad to another part (a different material).
 */
export function walls(part: Part, r0: V2[], z0: number, r1: V2[], z1: number, smooth = 35, pick?: (i: number) => Part | null, tilt = 0) {
  const n = r0.length, e0 = edgeNormals(r0), e1 = edgeNormals(r1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const target = pick ? pick(i) : part
    if (!target) continue
    const n3 = (m: V2): V3 => { const s = Math.hypot(m[0], m[1], tilt); return [m[0] / s, m[1] / s, tilt / s] }
    const a0 = n3(cornerNormal(e0, i, i, smooth)), b0 = n3(cornerNormal(e0, j, i, smooth))
    const a1 = n3(cornerNormal(e1, i, i, smooth)), b1 = n3(cornerNormal(e1, j, i, smooth))
    target.tri(at(r0[i], z0), at(r0[j], z0), at(r1[j], z1), undefined, undefined, undefined, [a0, b0, b1])
    target.tri(at(r0[i], z0), at(r1[j], z1), at(r1[i], z1), undefined, undefined, undefined, [a0, b1, a1])
  }
}

/** A flat cap over a CCW polygon at z, facing up or down. */
export function fill(part: Part, poly: V2[], z: number, up = true) {
  for (const [i, j, k] of triangulate(poly)) {
    if (up) part.tri(at(poly[i], z), at(poly[j], z), at(poly[k], z))
    else part.tri(at(poly[i], z), at(poly[k], z), at(poly[j], z))
  }
}

export type BlockOpts = { bev?: number; botBev?: number; top?: boolean; bottom?: boolean; smooth?: number; topPart?: Part; bevPart?: Part; pick?: (i: number) => Part | null }

/**
 * A vertical prism over a CCW plan from z0 to z1 with a rounded bevel round
 * the top edge (and optionally the bottom): the walls stop `bev` short and a
 * chamfer runs in to the inset cap.
 */
export function block(part: Part, plan: V2[], z0: number, z1: number, o: BlockOpts = {}) {
  const bev = Math.min(o.bev ?? 0.5, (z1 - z0) / 2.2), bb = Math.min(o.botBev ?? 0, (z1 - z0) / 2.2), sm = o.smooth ?? 35
  const inner = bev > 0 ? inset(plan, bev) : plan
  walls(part, plan, z0 + bb, plan, z1 - bev, sm, o.pick)
  if (bev > 0) walls(o.bevPart ?? part, plan, z1 - bev, inner, z1, sm, undefined, 0.9)
  if (o.top !== false) fill(o.topPart ?? part, inner, z1, true)
  if (bb > 0) {
    const ib = inset(plan, bb)
    walls(o.bevPart ?? part, ib, z0, plan, z0 + bb, sm, undefined, -0.9)
    if (o.bottom) fill(part, ib, z0, false)
  } else if (o.bottom) fill(part, plan, z0, false)
}

/** A tapered round mast from z0 (radius r0) to a point at z1. */
export function mast(part: Part, c: V2, r0: number, z0: number, z1: number, n = 10, bulge = 0) {
  const rings: { r: number; z: number }[] = [
    { r: r0, z: z0 }, { r: r0 * (1 + bulge), z: z0 + (z1 - z0) * 0.3 }, { r: r0 * 0.55, z: z0 + (z1 - z0) * 0.75 }, { r: 0.05, z: z1 },
  ]
  for (let k = 0; k < rings.length - 1; k++) {
    const A = oval(c, rings[k].r, rings[k].r, n), B = oval(c, rings[k + 1].r, rings[k + 1].r, n)
    walls(part, A, rings[k].z, B, rings[k + 1].z, 50, undefined, (rings[k].r - rings[k + 1].r) / (rings[k + 1].z - rings[k].z))
  }
}

/** A grid surface P[i][j] (quads P[i][j] P[i+1][j] P[i+1][j+1] P[i][j+1] wound CCW from outside), smooth-shaded. */
export function grid(part: Part, P: V3[][]) {
  const I = P.length, J = P[0].length
  const N: V3[][] = P.map((row) => row.map(() => [0, 0, 0] as V3))
  const crs = (a: V3, b: V3, c: V3): V3 => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  }
  for (let i = 0; i < I - 1; i++) for (let j = 0; j < J - 1; j++) {
    const f = crs(P[i][j], P[i + 1][j], P[i + 1][j + 1])
    const g = crs(P[i][j], P[i + 1][j + 1], P[i][j + 1])
    for (const [a, b] of [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]) for (let k = 0; k < 3; k++) N[a][b][k] += f[k] + g[k]
  }
  const un = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
  for (let i = 0; i < I - 1; i++) for (let j = 0; j < J - 1; j++) {
    const a = P[i][j], b = P[i + 1][j], c = P[i + 1][j + 1], d = P[i][j + 1]
    part.tri(a, b, c, undefined, undefined, undefined, [un(N[i][j]), un(N[i + 1][j]), un(N[i + 1][j + 1])])
    part.tri(a, c, d, undefined, undefined, undefined, [un(N[i][j]), un(N[i + 1][j + 1]), un(N[i][j + 1])])
  }
}

/** Write a model's GLB, checking the budget. */
export async function writeModel(
  id: string, name: string, parts: Array<{ part: Part; material: Swatch & { floodlight?: (p: V3, n: V3) => number } }>,
  extras: Record<string, unknown>, limit = 5000,
) {
  const live = parts.filter(({ part }) => part.triangles > 0)
  if (live.length > 6) throw new Error(`Too many materials: ${live.length}`)
  const triangles = live.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > limit) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, live, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------
// The Address Downtown
// ---------------------------------------------------------------------------
const ID = 'dubai-address-downtown'
const ANCHOR = { lng: 55.2788846, lat: 25.19399 } // centroid of the tower part way/532836513
const BEARING = 11 // the tower's long axis (south end to the pointed north tip)

// OSM way/532836513 (building:part, height 306.2, 63 levels) in the model frame.
const OUTLINE: V2[] = [[7.4, 44.7], [5.1, 45.5], [2.4, 44.5], [-2.8, 39.2], [-8.4, 30.7], [-13.6, 22.3], [-17.0, 15.6], [-18.6, 6.5], [-19.0, -10.9], [-20.0, -20.2], [-17.7, -27.0], [-12.8, -32.3], [-6.3, -35.5], [2.4, -36.7], [8.5, -35.2], [14.0, -29.5], [18.8, -17.8], [22.0, -5.3], [22.6, 5.6], [21.3, 15.0], [19.1, 21.8], [15.1, 30.8], [11.5, 38.6]]

const TIP: V2 = [5.0, 44.6] // the pointed north tip: the spine that runs up into the spire
const H = {
  tip: 306, // published
  setback: 200, // the south end steps back (photos a3, a10: 0.65 of the tip); again at 226
  lantern: 233, // dark glass band under the crown hood (photo a10: 0.76)
  hood: 246, // the pale hood starts (photos a10, a5: 0.80)
  hoodTop: 288, // the hood closes on the spine at the north tip (photos a3, a5: 0.94)
  pin2: 299, // the second, shorter pin beside the spire (photo a5)
  pitch: 13, // three floors to a facade group
  window: 5.0, // the dark window band in each 13 m group; the rest is cladding
  base: 14, // the body's facade bands start over the podium
}

function buildAddress() {
  const glass = new Part(), silver = new Part(), roof = new Part(), tier = new Part(), dark = new Part()
  const plan = ccw(resample(OUTLINE, 28, 1))

  /** The plan pulled back from the south end (ly) and narrowed (sx), anchored at the north tip. */
  const shrink = (ly: number, sx: number): V2[] =>
    plan.map(([x, y]) => [TIP[0] + (x - TIP[0]) * sx, TIP[1] - (TIP[1] - y) * ly] as V2)

  // --- Body: pale silver cladding is the main surface (photos a5, a10); the
  // windows are narrower dark bands, one per three floors, broken by piers (every fourth edge). A
  // dark vertical strip runs down the north tip (photo a5). ---
  let tipV = 0
  plan.forEach((q, i) => { if (Math.hypot(q[0] - TIP[0], q[1] - TIP[1]) < Math.hypot(plan[tipV][0] - TIP[0], plan[tipV][1] - TIP[1])) tipV = i })
  const n = plan.length
  const isTip = (i: number) => i === tipV || i === (tipV + n - 1) % n
  const groups = (p: V2[], z0: number, z1: number) => {
    let z = z0
    const win = (i: number) => (isTip(i) ? dark : i % 4 === 3 ? silver : glass)
    const clad = (i: number) => (isTip(i) ? dark : silver)
    while (z + H.pitch <= z1 + 0.1) {
      walls(glass, p, z, p, z + H.window, 35, win)
      walls(silver, p, z + H.window, p, z + H.pitch, 35, clad)
      z += H.pitch
    }
    if (z < z1 - 0.1) walls(silver, p, z, p, z1, 35, clad)
  }
  block(silver, plan, 0, H.base, { bev: 0, top: false })
  groups(plan, H.base, H.setback - 1)
  block(silver, plan, H.setback - 1, H.setback, { bev: 0.6, topPart: roof })

  // --- Upper body: the south end stepped back twice under the lantern. ---
  const upper = shrink(0.84, 0.95)
  const zU = H.setback + 2 * H.pitch
  groups(upper, H.setback, zU)
  block(silver, upper, zU, zU + 1, { bev: 0.6, topPart: roof })
  const upper2 = shrink(0.76, 0.91)
  block(silver, upper2, zU + 1, H.lantern, { bev: 0.6, topPart: roof, pick: (i) => (isTip(i) ? dark : silver) })
  // the dark lantern band, set back under the hood
  block(dark, shrink(0.69, 0.86), H.lantern, H.hood, { bev: 0, top: false })

  // --- The hood: a pale shell, quarter-elliptic in section, closing on the tip. ---
  const nH = 10
  const f = (t: number) => Math.sqrt(Math.max(0, 1 - t * t))
  for (let k = 0; k < nH; k++) {
    const t0 = k / nH, t1 = (k + 1) / nH
    const z0 = H.hood + (H.hoodTop - H.hood) * t0
    const z1 = H.hood + (H.hoodTop - H.hood) * t1
    // section: ly follows a quarter ellipse; the sides narrow a little less
    const ly0 = 0.72 * Math.max(0.1, f(t0)), ly1 = 0.72 * Math.max(0.1, f(t1))
    const r0 = shrink(ly0, Math.max(0.18, 0.88 * f(t0 * 0.95))), r1 = shrink(ly1, Math.max(0.18, 0.88 * f(t1 * 0.95)))
    walls(silver, r0, z0, r1, z1, 40, undefined, 0.15 + 1.2 * t1)
    if (k === nH - 1) fill(silver, r1, z1, true)
  }

  // --- Spire and the second pin at the tip. ---
  mast(silver, add2(TIP, [-0.6, -3.4]), 3.2, H.hoodTop - 10, H.tip, 10, 0.12)
  mast(silver, add2(TIP, [-0.2, -10]), 2.2, H.hoodTop - 10, H.pin2, 8)

  // --- Rounded tiers wrapping the west side and the north tip at the base. ---
  const tiers: [number, number, number][] = [[11, 0, 21], [8, 21, 31], [5.5, 31, 41], [3, 41, 50]]
  for (const [off, z0, z1] of tiers) {
    const p = ccw(clip(clip(inset(plan, -off), [1, 0], 6), [0, -1], 16))
    const sm = resample(p, 30, 2)
    block(glass, sm, z0, z1 - 2.6, { bev: 0, top: false })
    block(tier, inset(sm, -0.5), z1 - 2.6, z1, { bev: 0.6, topPart: roof })
  }

  const mats: Swatch[] = [
    { name: 'window', color: 0x6f8395, roughness: 0.3 },
    // the hood and spire are lit white at night (photo a4); the facade bands are not
    { ...finish('silver-cladding', 0xe2e4e7, 0.5), floodlight: (p: V3) => (p[2] > H.lantern ? 0.85 : 0) } as Swatch,
    PALETTE.roof,
    PALETTE.trim,
    windowVariant(2, 0x56616c),
  ]
  return [glass, silver, roof, tier, dark].map((part, i) => ({ part, material: mats[i] }))
}

if (import.meta.main) {
  await writeModel(ID, 'The Address Downtown', buildAddress(), {
    bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H.tip,
    replaces: ['way/532836513'],
  })
}
