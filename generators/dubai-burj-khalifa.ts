/**
 * Burj Khalifa (2004–2010, Adrian Smith for SOM), Downtown Dubai — original
 * procedural geometry, CC0-1.0.
 * bun generators/dubai-burj-khalifa.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor: area centroid of the OSM outline way/446646206,
 * 25.1972073 N, 55.2741554 E. Bearing 6°: OSM's three lowest wing tips lie
 * at bearings 186.3, 65.1 and 307.0 from the centre (mean offset 6.1° from a
 * perfect 0/120/240 Y), so in the model frame the wings point to 180 (S),
 * 60 (NE) and 300 (NW). The tower centre (where the wing axes meet, under
 * the OSM spire part) sits 1.3 m north of the anchor.
 *
 * Identity, in order of importance: the slender stepped silhouette to an
 * 828 m tip; the Y plan whose wings set back one at a time, spiralling
 * clockwise up the tower (NW, NE, S, NW, ...); each wing end a rounded
 * column, with the higher tiers' noses carried down the flanks as a bundle
 * of shallow round columns; the bare pinnacle; the silvery glass with
 * stainless fins and pale silver louvred plant-floor bands.
 *
 * Sources:
 *  - OSM (ODbL): outline way/446646206 (levels 163, maxheight 828) and its
 *    building:parts, which map every setback as a lune with its height:
 *    35 m (three wing tips), NW 70/160/270/405, NE 105/200/315/460, S
 *    130/235/360/520, then 545/560/580 (between the wings), 605/625/645,
 *    660/680/700, core 710, spire pieces 720/740/760, tip 828. The podium
 *    parts are 15 m. Every height in the massing is OSM's tag. The podium
 *    is OSM's outline clipped to 68 m from the tower centre (see Doubts).
 *  - Wikipedia "Burj Khalifa" (read 2026-11): architectural height 828 m,
 *    roof 739.4 m, top floor 585.4 m, 154 + 9 maintenance floors, 27
 *    setbacks in a spiral, mechanical floors 17–18, 40–42, 73–75, 109–111,
 *    136–138, 155 and 160–163; reflective glass with aluminium and textured
 *    stainless spandrels and vertical tubular fins; a 200 m pinnacle pipe.
 *  - Elevation: Commons File:BurjKhalifaHeight.png (CC BY-SA 3.0, derived
 *    from File:BurjKhalifaHeight.svg by Astronaut et al., scaled from CTBUH
 *    data), https://commons.wikimedia.org/wiki/File:BurjKhalifaHeight.png —
 *    used at 0.5 px/m to check the tier widths and the upper taper.
 *  - Photos (Wikimedia Commons), with the side each was taken from:
 *    * Burj_Khalifa_(16260269606).jpg, Laika ac, CC BY-SA 2.0, from the
 *      south-east (Business Bay), level: tier heights, columns, spire.
 *      https://commons.wikimedia.org/wiki/File:Burj_Khalifa_(16260269606).jpg
 *    * Dubai_Skyline_mit_Burj_Khalifa_(18241030269).jpg, Tim Reckmann, CC BY
 *      2.0, aerial from the north-north-west: widths at every height.
 *      https://commons.wikimedia.org/wiki/File:Dubai_Skyline_mit_Burj_Khalifa_(18241030269).jpg
 *    * Burj_Khalifa_from_a_ferry,_Dubai.jpg, Jpbowen, CC BY-SA 4.0, distant
 *      from the west-south-west (the sea).
 *      https://commons.wikimedia.org/wiki/File:Burj_Khalifa_from_a_ferry,_Dubai.jpg
 *    * Burj_Khalifa_Dubai_UAE_(14159904937).jpg, Gary Bembridge, CC BY 2.0,
 *      distant from the north (Port Rashid).
 *      https://commons.wikimedia.org/wiki/File:Burj_Khalifa_Dubai_UAE_(14159904937).jpg
 *    * The_Dubai_Fountain_&_Burj_Khalifa_Pixabay.jpg, Christian Raggini,
 *      CC0, close from the lake (south-east): the round columns, grooves,
 *      fins, the plant band at ~160 m, the low terraced podium.
 *      https://commons.wikimedia.org/wiki/File:The_Dubai_Fountain_%26_Burj_Khalifa_Pixabay.jpg
 *    * Front_view_from_Burj_Khalifa_Metro_Station.jpg, Aspere, CC0: colour.
 *      https://commons.wikimedia.org/wiki/File:Front_view_from_Burj_Khalifa_Metro_Station.jpg
 *    * Dubai_Design_District_View_of_Burj_Khalifa_Afternoon.jpg, Leakingh,
 *      CC BY-SA 4.0: silhouette at dusk.
 *      https://commons.wikimedia.org/wiki/File:Dubai_Design_District_View_of_Burj_Khalifa_Afternoon.jpg
 *  - No lidar, NAIP or map terrain here (UAE; Mapterhorn has no z15 tiles,
 *    so tools/terrain.ts could not check the site). Downtown is flat;
 *    elevation 0.
 *  No Google, Apple, Bing or Mapbox imagery, Street View or 3D tiles were
 *  used. No look-only references.
 *
 * Numbers:
 *  - Published/OSM: every tier and lobe height, 828 m tip, podium 15 m.
 *  - OSM, averaged over the three wings: wing tip radii 62/52/43/34.5/25.5 m
 *    (S, NW, NE measure 60.3–63.1, 50.4–53.0, 41.4–43.8, 33.1–35.4,
 *    23.9–26.2).
 *  - Estimated from OSM ray sections: wing half-width 12.5 m (OSM 11.5 at
 *    the noses to 14 at the roots); hub faces 14.6 m from the centre, a
 *    near-sharp V (OSM 16.6–19.9; drawn tighter so the slot between wings
 *    reads as in photos);
 *    nose lengths 16/14/13/12.5/12.5 m (the lower noses are pointed in OSM,
 *    the upper ones round).
 *  - Estimated from the elevation and the Reckmann aerial: the upper lobes
 *    (above 520 m) are about 10% smaller than OSM's parts; the clad spire
 *    tiers end at 744 m (photos: about 745 m; Wikipedia roof 739.4 m).
 *  - Estimated from photos: slots between the nose columns 3.2 m deep and
 *    2.2 m wide at the floor (drawn bolder than real so the bundle of
 *    cylinders reads at phone size); plant louvre bands 6–7 m at the plant
 *    floors, 3 m at level 155 (585 m), pale silver, a touch lighter than
 *    the glass, as in the photos; fin spacing (drawn at every
 *    other nose vertex, 1 m wide, 0.4 m proud; real fins are much finer and
 *    denser).
 *  - Drawn bolder than real: the pinnacle (2.3 m radius at 744 m to 0.5 m at
 *    the tip; the real pipe is far thinner) and the fins.
 *
 * Night: the curtain wall glows as windows; white uplighting (floodlight)
 * washes the stainless fins and the plant louvres, strongest low down; the
 * pinnacle is `neon` and glows white, as the spire's lights do. The podium
 * is pale stone, unlit.
 *
 * Doubts:
 *  - The podium follows the OSM outline at OSM's 15 m, in pale stone (in
 *    every photo it is low and barely visible). The fountain photo shows it
 *    terraced, perhaps 15–25 m at the tower. OSM's long pointed blades along
 *    each wing (to 93 m from the centre) are not confirmed by any photo, so
 *    the outline is clipped at 68 m, just past the 62 m wing tips; the
 *    blade parts stay in `replaces`, so their outer ends (68–93 m) are drawn
 *    by neither the map nor the model.
 *  - The upper lobes (545–744 m) are simplified to six round-nosed lobes and
 *    a core, following OSM's parts; their exact plans are not photographed.
 *  - Wing widths are constant up the tower here; the real flanks step in
 *    small notches.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

// ---------- frame ----------
// Model frame is turned to bearing 6°: the three wings point to model
// bearings 60 (NE wing), 180 (S wing) and 300 (NW wing).
const BEARING = 6
// Tower centre (where the wing axes meet and the spire stands), relative to
// the anchor (area centroid of OSM way/446646206), in the model frame.
const C: XY = [-0.14, 1.29]

const dir = (deg: number): XY => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)]

// ---------- plan shapes ----------
// Every plan level is the union of convex shapes, each containing the tower
// centre, so the union is star-shaped about it and can be handled in polar
// form. Shapes are in tower-centred coordinates.

/** A wing or lobe: a bar of half-width w from the centre to a nose of length Ln (tangent ogive; Ln = w is a semicircle) ending at radius L. */
function bar(axis: number, L: number, w: number, Ln: number, seg = 7): XY[] {
  const u = dir(axis), v: XY = [-u[1], u[0]] // v = u turned 90° ccw
  const at = (a: number, p: number): XY => [u[0] * a + v[0] * p, u[1] * a + v[1] * p]
  const s0 = L - Ln
  const R = (w * w + Ln * Ln) / (2 * w)
  const phiMax = Math.asin(Math.min(1, Ln / R))
  const right: XY[] = [], left: XY[] = []
  for (let k = 0; k <= seg; k++) {
    const phi = (k / seg) * phiMax
    // right arc centred at (s0, R - w), from (s0, -w) to the tip
    right.push(at(s0 + R * Math.sin(phi), R - w - R * Math.cos(phi)))
    left.push(at(s0 + R * Math.sin(phi), -(R - w - R * Math.cos(phi))))
  }
  const root = -2
  return [at(root, -w), ...right, ...left.reverse().slice(1), at(root, w)]
}

/** A circle as a polygon (ccw). */
function circle(r: number, n = 12): XY[] {
  return Array.from({ length: n }, (_, k) => dir(-(360 * k) / n).map((c) => c * r) as XY)
}

const ang = (p: XY) => Math.atan2(p[1], p[0]) // ccw from +x
const cr2 = (a: XY, b: XY) => a[0] * b[1] - a[1] * b[0]

/** Distance from the origin to where a ray at angle t leaves a polygon containing the origin. */
function exitR(poly: XY[], t: number): number {
  const d: XY = [Math.cos(t), Math.sin(t)]
  let best = 0
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const e: XY = [b[0] - a[0], b[1] - a[1]]
    const den = cr2(d, e)
    if (Math.abs(den) < 1e-12) continue
    const tt = cr2(a, e) / den, s = cr2(a, d) / den
    if (tt > 0 && s >= -1e-9 && s <= 1 + 1e-9) best = Math.max(best, tt)
  }
  return best
}

/** Proper intersections of two segments. */
function segX(a: XY, b: XY, c: XY, d: XY): XY | null {
  const r: XY = [b[0] - a[0], b[1] - a[1]], s: XY = [d[0] - c[0], d[1] - c[1]]
  const den = cr2(r, s)
  if (Math.abs(den) < 1e-12) return null
  const q: XY = [c[0] - a[0], c[1] - a[1]]
  const t = cr2(q, s) / den, u = cr2(q, r) / den
  if (t < -1e-9 || t > 1 + 1e-9 || u < -1e-9 || u > 1 + 1e-9) return null
  return [a[0] + r[0] * t, a[1] + r[1] * t]
}

/** The outline of a union of star-shaped convex shapes, ccw, with collinear points dropped. */
function union(shapes: XY[][]): XY[] {
  const angles: number[] = []
  for (const s of shapes) for (const p of s) angles.push(ang(p))
  for (let i = 0; i < shapes.length; i++)
    for (let j = i + 1; j < shapes.length; j++)
      for (let a = 0; a < shapes[i].length; a++)
        for (let b = 0; b < shapes[j].length; b++) {
          const x = segX(shapes[i][a], shapes[i][(a + 1) % shapes[i].length], shapes[j][b], shapes[j][(b + 1) % shapes[j].length])
          if (x) angles.push(ang(x))
        }
  const norm = angles.map((t) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).sort((a, b) => a - b)
  const uniq: number[] = []
  for (const t of norm) if (!uniq.length || t - uniq[uniq.length - 1] > 1e-7) uniq.push(t)
  if (uniq.length > 1 && uniq[0] + 2 * Math.PI - uniq[uniq.length - 1] < 1e-7) uniq.pop()
  let pts: XY[] = uniq.map((t) => {
    const r = Math.max(...shapes.map((s) => exitR(s, t)))
    return [r * Math.cos(t), r * Math.sin(t)] as XY
  })
  // drop collinear and duplicate points
  let changed = true
  while (changed) {
    changed = false
    const out: XY[] = []
    for (let i = 0; i < pts.length; i++) {
      const a = out.length ? out[out.length - 1] : pts[(i - 1 + pts.length) % pts.length], p = pts[i], b = pts[(i + 1) % pts.length]
      const e1: XY = [p[0] - a[0], p[1] - a[1]], e2: XY = [b[0] - p[0], b[1] - p[1]]
      const l1 = Math.hypot(...e1), l2 = Math.hypot(...e2)
      if (l1 < 0.05 || Math.abs(cr2(e1, e2)) / (l1 * l2 || 1) < 0.004) { changed = true; continue }
      out.push(p)
    }
    pts = out
  }
  // round to the centimetre so identical edges at successive levels match
  return pts.map((p) => [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100] as XY)
}

// ---------- the massing schedule ----------
// Each wing ends in a rounded nose; below each setback the noses of all the
// higher tiers carry on down the wing's flanks as shallow rounded columns
// with a groove between each pair (the nested lunes OSM maps as parts, and
// the bundle of cylinders every photo shows). A tier's nose is drawn as a
// half-ellipse: half-width W across, E along the wing.
const W = 12.5           // wing half-width (OSM: 11.5 near the noses, 14 at the roots)
const HUB = 14.6         // centre faces between the wings: nearly a sharp V (OSM: 16.6–19.9)
const NOTCH = 3.2        // depth of the slot between two nose columns (photos)
const SLOT = 1.1         // half-width of the slot's floor
const PODIUM_H = 15      // OSM building:part height=15
const PODIUM_R = 68      // podium clipped to this radius (see the podium)
type Tier = { L: number; E: number; top: number }
// Tip radii from OSM, averaged over the three wings (S / NW / NE):
// 60.3/62.9/63.1, 50.4/52.8/53.0, 41.4/43.7/43.8, 33.1/35.4/35.4, 23.9/26.1/26.2.
const TIPS = [62, 52, 43, 34.5, 25.5]
const NOSE = [16, 14, 13, 12.5, 12.5]
const tiersFor = (tops: number[]): Tier[] => TIPS.map((L, i) => ({ L, E: NOSE[i], top: tops[i] }))
const WINGS: { axis: number; tiers: Tier[] }[] = [
  { axis: 60, tiers: tiersFor([35, 105, 200, 315, 460]) },  // NE
  { axis: 300, tiers: tiersFor([35, 70, 160, 270, 405]) }, // NW
  { axis: 180, tiers: tiersFor([35, 130, 235, 360, 520]) }, // S
] // in ccw order (bearing decreasing)
const HUB_TOP = 520
// Above the wings: six lobes, still stepping clockwise (OSM parts 545–710),
// pulled in about 10% from OSM to match the elevation and photos.
type Lobe = { axis: number; L: number; w: number; top: number }
const LOBES: Lobe[] = [
  { axis: 0, L: 17, w: 11.5, top: 545 },
  { axis: 120, L: 16.5, w: 11, top: 560 },
  { axis: 240, L: 16.5, w: 11, top: 580 },
  { axis: 60, L: 14.5, w: 9.5, top: 605 },
  { axis: 180, L: 14, w: 9.5, top: 625 },
  { axis: 300, L: 14.5, w: 9.5, top: 645 },
  { axis: 0, L: 11, w: 7.5, top: 660 },
  { axis: 120, L: 9, w: 6, top: 680 },
  { axis: 240, L: 9, w: 6, top: 700 },
  { axis: 60, L: 7.5, w: 5, top: 710 },
  { axis: 180, L: 7, w: 5, top: 710 },
  { axis: 300, L: 7.5, w: 5, top: 710 },
  // the clad base of the spire (OSM parts 720, 740, 760), drawn a little fatter
  { axis: 0, L: 5.5, w: 3.6, top: 720 },
  { axis: 60, L: 4.8, w: 3.2, top: 732 },
  { axis: 300, L: 4.8, w: 3.2, top: 744 },
]
const CORE = [{ r: 5.5, top: 710 }, { r: 3.0, top: 744 }]
const CORE_TOP = 744
// The exposed pinnacle (Wikipedia: roof 739.4 m, a 200 m pinnacle pipe;
// photos show the clad tiers ending about 745 m and a bare mast above),
// drawn bolder than real so it survives at phone size.
const NEEDLE = { base: 744, step: 784, r0: 2.3, r1: 1.6, rTop: 0.5 }
const TIP = 828

/** Half-width of one tier's nose ellipse at distance a along the wing (0 outside). */
const ell = (t: Tier, a: number) => { const c = t.L - t.E, x = (a - c) / t.E; return Math.abs(x) >= 1 ? 0 : W * Math.sqrt(1 - x * x) }
const S_ROOT = (HUB - W * Math.cos(Math.PI / 6)) / Math.sin(Math.PI / 6) // where a wing flank meets the hub face

/** One flank of a wing at tier k: [a, p] from the root to the tip, p >= 0. */
function flank(tiers: Tier[], k: number): XY[] {
  const live = tiers.slice(k)
  const last = live[live.length - 1]
  const env = (a: number) => Math.max(a <= last.L - last.E ? W : 0, ...live.map((t) => ell(t, a)))
  const cand: number[] = [S_ROOT, last.L - last.E]
  const grooves = new Set<number>()
  for (const t of live) {
    const c = t.L - t.E
    for (let i = 0; i <= 16; i++) {
      const a = c + t.E * Math.cos((i / 16) * Math.PI)
      if (a > S_ROOT && ell(t, a) >= env(a) - 1e-9) cand.push(a)
    }
  }
  // grooves: where consecutive noses cross
  for (let i = 0; i < live.length - 1; i++) {
    const o = live[i], n = live[i + 1]
    let lo = n.L - n.E, hi = o.L - o.E // n dominates at its centre, o at its own
    if (ell(o, lo) - ell(n, lo) > 0 || ell(o, hi) - ell(n, hi) < 0) continue
    for (let it = 0; it < 50; it++) { const m = (lo + hi) / 2; if (ell(o, m) - ell(n, m) < 0) lo = m; else hi = m }
    const a = (lo + hi) / 2
    if (Math.max(ell(o, a), ell(n, a)) >= env(a) - 1e-6) { const r = Math.round(a * 1000) / 1000; cand.push(r); grooves.add(r) }
  }
  const near = (a: number) => [...grooves].some((g) => Math.abs(a - g) < SLOT + 0.8)
  const as = [...new Set(cand.map((a) => Math.round(a * 1000) / 1000))].filter((a) => a >= S_ROOT - 1e-6 && a <= live[0].L + 1e-6 && (grooves.has(a) || !near(a))).sort((x, y) => x - y)
  // each groove becomes a square-bottomed slot: lip, floor, floor, lip
  const out: XY[] = []
  for (const a of as) {
    if (!grooves.has(a)) { out.push([a, env(a)]); continue }
    const lip = SLOT + 0.7
    out.push([a - lip, env(a - lip)], [a - SLOT, env(a) - NOTCH], [a + SLOT, env(a) - NOTCH], [a + lip, env(a + lip)])
  }
  return out.map(([a, p]) => [Math.round(a * 1000) / 1000, p] as XY)
}

function planAt(z: number): XY[] {
  if (z >= HUB_TOP) {
    const shapes: XY[][] = []
    for (const l of LOBES) if (z < l.top) shapes.push(bar(l.axis, l.L, l.w, l.w, l.w > 6 ? 6 : 4))
    for (const c of CORE) if (z < c.top) shapes.push(circle(c.r))
    return union(shapes)
  }
  const ring: XY[] = []
  const hexR = HUB / Math.cos(Math.PI / 6)
  for (const w of WINGS) {
    let k = -1, lo = 0
    w.tiers.forEach((t, i) => { if (k < 0 && z >= lo && z < t.top) k = i; lo = t.top })
    const u = dir(w.axis), v: XY = [-u[1], u[0]]
    const at = (a: number, p: number): XY => [u[0] * a + v[0] * p, u[1] * a + v[1] * p]
    if (k < 0) { // the wing has ended: the hub's face
      ring.push(dir(w.axis + 30).map((c) => c * hexR) as XY, dir(w.axis - 30).map((c) => c * hexR) as XY)
      continue
    }
    const f = flank(w.tiers, k)
    for (const [a, p] of f) ring.push(at(a, -p))
    for (let i = f.length - 1; i >= 0; i--) if (f[i][1] > 1e-6) ring.push(at(f[i][0], f[i][1])) // the tip (p = 0) is already in
  }
  return ring.map((p) => [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100] as XY)
}

// ---------- parts ----------
const glass = new Part()   // silver-blue curtain wall
const steel = new Part()   // stainless fins
const band = new Part()    // louvred mechanical-floor bands
const roof = new Part()    // setback terraces
const podium = new Part()  // the low glass podium
const spire = new Part()   // the spire, lit at night

const T = (p: XY, z: number): V3 => [p[0] + C[0], p[1] + C[1], z]

// ---------- walls with vertical merging ----------
const outward = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l] }

function vertexNormals(r: XY[], smooth = 0.42): { na: V3; nb: V3 }[] {
  const n = r.length
  const en = r.map((p, i) => outward(p, r[(i + 1) % n]))
  const vn = (i: number, e: number): V3 => {
    const a = en[(i - 1 + n) % n], b = en[i]
    const turn = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])))
    if (turn < smooth) { const m: XY = [a[0] + b[0], a[1] + b[1]]; const l = Math.hypot(...m); return [m[0] / l, m[1] / l, 0] }
    return [en[e][0], en[e][1], 0]
  }
  return r.map((_, i) => ({ na: vn(i, i), nb: vn((i + 1) % n, i) }))
}

/** Full-perimeter mechanical bands (tops of the two-storey plant floors). */
const MECH: [number, number][] = [[70, 6], [160, 7], [270, 7], [405, 7], [520, 7], [585, 3]]

function wallQuad(part: Part, a: XY, b: XY, z0: number, z1: number, na: V3, nb: V3) {
  if (z1 - z0 < 0.01) return
  part.tri(T(a, z0), T(b, z0), T(b, z1), undefined, undefined, undefined, [na, nb, nb])
  part.tri(T(a, z0), T(b, z1), T(a, z1), undefined, undefined, undefined, [na, nb, na])
}

function emitWall(a: XY, b: XY, z0: number, z1: number, na: V3, nb: V3) {
  // collect band ranges
  const ranges: [number, number][] = []
  for (const [h, bh] of MECH) if (h > z0 + 0.5 && h <= z1) ranges.push([Math.max(z0, h - bh), h])
  ranges.sort((p, q) => p[0] - q[0])
  let z = z0
  for (const [r0, r1] of ranges) {
    wallQuad(glass, a, b, z, r0, na, nb)
    wallQuad(band, a, b, Math.max(z, r0), r1, na, nb)
    z = r1
  }
  wallQuad(glass, a, b, z, z1, na, nb)
}

// ---------- the tower body ----------
const levels = [...new Set([PODIUM_H, ...WINGS.flatMap((w) => w.tiers.map((t) => t.top)), HUB_TOP, ...LOBES.map((l) => l.top), ...CORE.map((c) => c.top)])]
  .filter((z) => z >= PODIUM_H).sort((a, b) => a - b)
const rings: XY[][] = []
for (let i = 0; i < levels.length - 1; i++) rings.push(planAt((levels[i] + levels[i + 1]) / 2))

type Active = { a: XY; b: XY; z0: number; na: V3; nb: V3 }
const key = (a: XY, b: XY) => `${a[0]},${a[1]},${b[0]},${b[1]}`
let active = new Map<string, Active>()
for (let i = 0; i < rings.length; i++) {
  const r = rings[i], z = levels[i]
  const nrm = vertexNormals(r)
  const next = new Map<string, Active>()
  r.forEach((p, k) => {
    const q = r[(k + 1) % r.length], kk = key(p, q)
    next.set(kk, active.get(kk) ?? { a: p, b: q, z0: z, ...nrm[k] })
  })
  for (const [kk, e] of active) if (!next.has(kk)) emitWall(e.a, e.b, e.z0, z, e.na, e.nb)
  active = next
}
for (const e of active.values()) emitWall(e.a, e.b, e.z0, CORE_TOP, e.na, e.nb)

// ---------- setback terraces ----------
function polarR(r: XY[], t: number) { return exitR(r, t) }
function terrace(outer: XY[], inner: XY[] | null, z: number) {
  if (!inner) { // top cap: a fan
    for (let i = 0; i < outer.length; i++) roof.tri(T([0, 0], z), T(outer[i], z), T(outer[(i + 1) % outer.length], z))
    return
  }
  const ts = [...outer, ...inner].map((p) => ((ang(p) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).sort((a, b) => a - b)
  const uniq: number[] = []
  for (const t of ts) if (!uniq.length || t - uniq[uniq.length - 1] > 1e-6) uniq.push(t)
  const pt = (r: number, t: number): XY => [r * Math.cos(t), r * Math.sin(t)]
  for (let i = 0; i < uniq.length; i++) {
    const t0 = uniq[i], t1 = uniq[(i + 1) % uniq.length] + (i === uniq.length - 1 ? 2 * Math.PI : 0)
    const o0 = polarR(outer, t0), o1 = polarR(outer, t1), n0 = polarR(inner, t0), n1 = polarR(inner, t1)
    if (o0 - n0 < 0.02 && o1 - n1 < 0.02) continue
    const A = pt(n0, t0), B = pt(o0, t0), Cc = pt(o1, t1), D = pt(n1, t1)
    if (o0 - n0 >= 0.02) roof.tri(T(A, z), T(B, z), T(Cc, z))
    if (o1 - n1 >= 0.02) roof.tri(T(A, z), T(Cc, z), T(D, z))
  }
}
for (let i = 0; i < rings.length; i++) terrace(rings[i], rings[i + 1] ?? null, levels[i + 1])

// ---------- fins on the wing noses ----------
// Stainless fins run up each nose. Drawn every other nose vertex, standing
// 0.35 m proud, about 1 m wide, so they read as the vertical ribbing.
function fins() {
  for (const w of WINGS) {
    const u = dir(w.axis), v: XY = [-u[1], u[0]]
    const at = (a: number, p: number): XY => [u[0] * a + v[0] * p, u[1] * a + v[1] * p]
    let lo = PODIUM_H
    w.tiers.forEach((t, k) => {
      const f = flank(w.tiers, k)
      // the front nose: points of this tier's own ellipse, beyond the groove
      const inner = w.tiers[k + 1]
      const front = f.filter(([a]) => !inner || a > inner.L - 1)
      const zTop = t.top - 1
      for (let i = front.length - 1; i >= 1; i -= 2) {
        const [a, p] = front[i], [a0, p0] = front[i - 1]
        for (const side of p > 0.01 ? [-1, 1] : [1]) {
          const P = at(a, side * p), Pn = at(a0, side * p0)
          let tan: XY = [Pn[0] - P[0], Pn[1] - P[1]]
          if (Math.hypot(...tan) < 1e-6) continue
          if (i === front.length - 1) tan = [v[0], v[1]] // the tip: across the wing
          const tl = Math.hypot(...tan), tu: XY = [tan[0] / tl, tan[1] / tl]
          let o: XY = [tu[1], -tu[0]]
          if (o[0] * (P[0]) + o[1] * (P[1]) < 0) o = [-o[0], -o[1]]
          const hw = 0.5, pr = 0.4
          const c: XY = [P[0] + o[0] * pr, P[1] + o[1] * pr]
          const A: XY = [c[0] - tu[0] * hw, c[1] - tu[1] * hw], B: XY = [c[0] + tu[0] * hw, c[1] + tu[1] * hw]
          const Ai: XY = [A[0] - o[0] * pr, A[1] - o[1] * pr], Bi: XY = [B[0] - o[0] * pr, B[1] - o[1] * pr]
          // face and two cheeks, wound to face out
          const face = (p1: XY, p2: XY) => {
            const n: XY = [(p2[1] - p1[1]), -(p2[0] - p1[0])], m: XY = [(p1[0] + p2[0]) / 2 - c[0] + o[0] * pr / 2, (p1[1] + p2[1]) / 2 - c[1] + o[1] * pr / 2]
            if (n[0] * m[0] + n[1] * m[1] >= 0) steel.quad(T(p1, lo), T(p2, lo), T(p2, zTop), T(p1, zTop))
            else steel.quad(T(p2, lo), T(p1, lo), T(p1, zTop), T(p2, zTop))
          }
          face(A, B); face(Ai, A); face(B, Bi)
        }
      }
      lo = t.top
    })
  }
}
fins()

// ---------- the spire ----------
function cone(part: Part, z0: number, z1: number, r0: number, r1: number, n = 8) {
  const ring = (r: number) => circle(r, n)
  const lo = ring(r0), hi = ring(r1)
  for (let k = 0; k < n; k++) {
    const l = (k + 1) % n
    const na: V3 = [lo[k][0] / r0, lo[k][1] / r0, 0], nb: V3 = [lo[l][0] / r0, lo[l][1] / r0, 0]
    part.tri(T(lo[k], z0), T(lo[l], z0), T(hi[l], z1), undefined, undefined, undefined, [na, nb, nb])
    part.tri(T(lo[k], z0), T(hi[l], z1), T(hi[k], z1), undefined, undefined, undefined, [na, nb, na])
  }
  if (r1 > 0.05) for (let k = 0; k < n; k++) part.tri(T([0, 0], z1), T(hi[k], z1), T(hi[(k + 1) % n], z1))
}
cone(spire, NEEDLE.base, NEEDLE.step, NEEDLE.r0, NEEDLE.r1, 8)
cone(spire, NEEDLE.step, TIP, NEEDLE.r1 * 0.75, NEEDLE.rTop, 8)

// ---------- the podium (OSM outline way/446646206, 15 m) ----------
const OUTLINE: XY[] = [[-15.8, -18.8], [-12.2, -70.2], [1.0, -93.2], [4.3, -86.9], [13.1, -69.8], [15.1, -17.5], [16.0, -17.8], [18.5, -27.3], [22.7, -25.8], [26.5, -23.5], [29.7, -20.5], [32.2, -16.8], [34.0, -12.8], [34.9, -8.4], [34.8, -4.0], [33.9, 0.3], [24.8, -2.7], [24.3, -2.0], [65.8, 22.5], [80.8, 44.5], [54.3, 44.9], [9.0, 24.8], [8.8, 25.7], [15.3, 32.6], [11.3, 35.6], [6.7, 37.6], [1.8, 38.6], [-3.2, 38.6], [-8.1, 37.4], [-12.7, 35.2], [-16.6, 32.1], [-8.9, 25.2], [-9.2, 24.4], [-52.0, 45.8], [-78.6, 46.8], [-65.1, 24.2], [-24.7, -3.0], [-25.4, -3.8], [-34.3, -1.0], [-35.2, -5.4], [-35.1, -10.0], [-34.0, -14.4], [-32.0, -18.4], [-29.5, -22.2], [-26.2, -25.3], [-22.4, -27.6], [-18.1, -29.0], [-16.7, -19.5]]
{
  const area = OUTLINE.reduce((s, p, i) => s + cr2(p, OUTLINE[(i + 1) % OUTLINE.length]), 0)
  const ring = area < 0 ? [...OUTLINE].reverse() : OUTLINE
  const off = (p: XY): XY => [p[0] - C[0], p[1] - C[1]] // outline is anchor-relative; T adds C back
  // Clipped to 68 m from the tower centre: OSM's podium parts run out in
  // pointed blades to 93 m along each wing, which no photo confirms; the
  // photos show a low terraced podium hugging the base (Sutherland–Hodgman
  // against a 32-gon).
  let rr = ring.map(off)
  const clip = circle(PODIUM_R, 32)
  for (let i = 0; i < clip.length; i++) {
    const A = clip[i], B = clip[(i + 1) % clip.length]
    const inside = (p: XY) => cr2([B[0] - A[0], B[1] - A[1]], [p[0] - A[0], p[1] - A[1]]) >= 0
    const out: XY[] = []
    for (let k = 0; k < rr.length; k++) {
      const P = rr[k], Q = rr[(k + 1) % rr.length]
      const x = segX(P, Q, [A[0] - (B[0] - A[0]) * 10, A[1] - (B[1] - A[1]) * 10], [B[0] + (B[0] - A[0]) * 10, B[1] + (B[1] - A[1]) * 10])
      if (inside(P)) { out.push(P); if (!inside(Q) && x) out.push(x) }
      else if (inside(Q) && x) out.push(x)
    }
    rr = out
  }
  const nrm = vertexNormals(rr, 0.3)
  rr.forEach((p, k) => wallQuad(podium, p, rr[(k + 1) % rr.length], 0, PODIUM_H, nrm[k].na, nrm[k].nb))
  // roof: ear clipping
  const idx = rr.map((_, i) => i)
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr2([b[0] - a[0], b[1] - a[1]], [p[0] - a[0], p[1] - a[1]]) > 1e-9 && cr2([c[0] - b[0], c[1] - b[1]], [p[0] - b[0], p[1] - b[1]]) > 1e-9 && cr2([a[0] - c[0], a[1] - c[1]], [p[0] - c[0], p[1] - c[1]]) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = rr[i0], b = rr[i1], c = rr[i2]
      if (cr2([b[0] - a[0], b[1] - a[1]], [c[0] - a[0], c[1] - a[1]]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(rr[j], a, b, c))) continue
      podium.tri(T(a, PODIUM_H), T(b, PODIUM_H), T(c, PODIUM_H)); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) podium.tri(T(rr[idx[0]], PODIUM_H), T(rr[idx[1]], PODIUM_H), T(rr[idx[2]], PODIUM_H))
}

// ---------- write ----------
// Night: white uplighting washes the stainless fins, strongest low down and
// fading up the tower; the spire glows (neon); the curtain wall is windows.
const uplight = (p: V3, n: V3) => (n[2] > 0.5 ? 0 : 0.95 - 0.35 * Math.min(1, p[2] / 600))
const parts = [
  { part: glass, material: windowVariant(2, 0xaebdcb) },
  { part: steel, material: { ...finish('burj-steel', 0xdde2e6, 0.45), floodlight: uplight } },
  { part: band, material: { ...finish('burj-plant-louvre', 0xc4ccd3, 0.5), floodlight: uplight } },
  { part: roof, material: PALETTE.roof },
  { part: podium, material: PALETTE.stone },
  { part: spire, material: finish('neon-burj-spire', 0xc8d0d7, 0.4) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Burj Khalifa', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: TIP,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/dubai-burj-khalifa.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles (${parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', ')}), ${glb.length} bytes`)
