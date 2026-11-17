/**
 * Lotte World Tower, Seoul — original procedural geometry, CC0-1.0.
 * bun generators/seoul-lotte-world-tower.ts
 *
 * Map frame, turned to the tower: BEARING 67.3, so model +x points to compass
 * 157.3 and +y to 67.3. In that frame the faces are the planes x, y = +/-h;
 * the two seam corners are (+,+) (pointing ESE, 112 deg) and (-,-) (WNW,
 * 292 deg); the two plain round corners are (-,+) (NNE, 22 deg) and (+,-)
 * (SSW, 202 deg). Origin = area centroid of the OSM outline way/914963586.
 * y = 0 is the plaza at the foot of the tower; elevation 0. Terrain could not
 * be checked: Mapterhorn has no z15 tiles over Seoul (city notes).
 *
 * Form, as read from OSM and the photos:
 * - a rounded square, 71.5 m across the faces at the foot, tapering in a
 *   convex "bullet" curve to about 23 m at the top;
 * - two opposite corners are plain and round; the other two carry the seam,
 *   a narrow slot running the full height (dark glass inside, white lips).
 *   Above ~440 m the seam's walls splay open and cut the seam corners back,
 *   so from the plain-corner sides (SSW, NNE) the top narrows into the
 *   lantern, while from the seam sides (WNW, ESE) the seam runs up into the
 *   split between two crown horns;
 * - the crown, 505-554.5 m, an open lattice of real 3D members (fins and
 *   ring beams round a recessed silver core). 505-520 m it is the shaft's
 *   own plan carried on, so the shaft runs into the lantern with no step;
 *   520-554.5 m it is two horns, the plain-corner quadrants (15 fins and
 *   three rings each, the core stopping 6.5 m short of the top), drawn in
 *   by up to 30% over their top 10 m so the lantern's top edge rolls in as
 *   in the SSW photo; between the horns the split, floored at 520 m;
 * - the diagonal bracing seen through the glass at 440-505 m: two zigzags
 *   crossing on every face, as raised white strips;
 * - pale silver glass, a cooler, darker band over the bottom 60 m (shade and
 *   reflections in the day view 5 photo), raised white mullion ridges (about
 *   seven per face, following the taper, no horizontal lines), and the
 *   short dark louvre bands of the mechanical floors in pairs on every face;
 * - the low podium on the south-east side (OSM way/878620802).
 *
 * Evidence
 * - OSM relation/8824257 (type=building, height 555, 123 levels, wikidata
 *   Q12616233), outline way/914963586 and its parts, fetched with
 *   tools/osm.py on 2026-11-13. The parts give the plan by floor: 71.5 m
 *   across at the foot (way/914963586, way/879571752), 69.8 at L40-42
 *   (way/888605473), 54.4 at L79 (888605472), 51.3 at L79-85 (879798717),
 *   38 at L85-107 (888605471), 33 at L107-118 (879798716), 28.5 at L118-120
 *   (888605470); the slot in the (+,+) and (-,-) corners at every level
 *   (2 m at the foot, ~7 m wide and ~4.5 m deep at L79, ~10 m wide and
 *   wide-open at L118-120); the two horns to 554.5 m (635073469, 635073470)
 *   and the floor between them at 520 m (635073462). The skillion "roof"
 *   parts (879798696...879808333) model the crown's slopes and are covered.
 *   Floor heights: about 4.05 m a floor (L118, the glass-floored deck, is
 *   published at ~478 m), used to put the OSM levels at heights.
 * - Published: 554.5 m, 123 storeys, Kohn Pedersen Fox, completed 2017
 *   (Wikipedia "Lotte World Tower"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, daylight unless noted):
 *   "Lotte World day view 5.jpg", kallerna, CC BY-SA 4.0, from the SSW over
 *   Seokchon Lake: the silhouette was measured row by row from the 8200 px
 *   original against the published height (seam-corner to seam-corner
 *   width by height, matched by the model within ~1 m from 140 m to the
 *   top) and the crown lattice, its base band and the ears at ~475 m;
 *   https://commons.wikimedia.org/wiki/File:Lotte_World_day_view_5.jpg
 *   "Lotte World morning view 8.jpg", kallerna, CC BY-SA 4.0, SSW at dawn:
 *   profile, louvre bands, lantern;
 *   https://commons.wikimedia.org/wiki/File:Lotte_World_morning_view_8.jpg
 *   "Lotte World Tower from Seongsu Bridge.jpg", Ox1997cow, CC BY-SA 3.0,
 *   from the WNW, straight down the seam: the seam line and the split crown
 *   horns; https://commons.wikimedia.org/wiki/File:Lotte_World_Tower_from_Seongsu_Bridge.jpg
 *   "Lotte World Tower near Cheongdam Bridge 2022.jpg", Ox1997cow, CC BY 3.0,
 *   from the WNW; https://commons.wikimedia.org/wiki/File:Lotte_World_Tower_near_Cheongdam_Bridge_2022.jpg
 *   "Olympic Bridge and Lotte World Tower.jpg", lazy fri13th, public domain,
 *   from the NNW; https://commons.wikimedia.org/wiki/File:Olympic_Bridge_and_Lotte_World_Tower.jpg
 *   "Han River and Lotte World Tower.jpg", mauveine.kim, CC0, from the NW;
 *   https://commons.wikimedia.org/wiki/File:Han_River_and_Lotte_World_Tower.jpg
 *   "Lotte World Tower 09 (33435692451).jpg", Republic of Korea (KOREA.NET),
 *   CC BY-SA 2.0, looking down a seam corner from the deck: the slot, its
 *   glass and the podium below;
 *   https://commons.wikimedia.org/wiki/File:Lotte_World_Tower_09_(33435692451).jpg
 *   "Lotte World Tower (3).jpg", Шохбоз, CC BY-SA 4.0, looking down the
 *   facade: the pale glass and white mullions;
 *   https://commons.wikimedia.org/wiki/File:Lotte_World_Tower_(3).jpg
 *   "Lotte World Tower In Jamsil (144738473).jpeg", Jongjin Lee, CC BY 3.0,
 *   at night (lit windows and crown, under construction);
 *   https://commons.wikimedia.org/wiki/File:Lotte_World_Tower_In_Jamsil_(144738473).jpeg
 * - No lidar, NAIP or Mapillary: none covers Korea / no token (city notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Measured (OSM): the plan by level, the bearing (minimum-area rectangle of
 *   the outline), the round-corner radius (~0.6 h at the foot, ~0.53 h above
 *   L79), the face bow toward the seam corners (~0.06 h), the slot at L79 and
 *   above, the podium outline.
 * - Measured (photo, scaled to 554.5 m): the silhouette by height, the
 *   lantern's base (~505 m), the seam's width at mid-height (~4-5 m, from
 *   the Seongsu Bridge photo), the horns' height and the gap between them.
 * - Published: total height 554.5 m.
 * - Estimated: the profile between OSM levels; the slot depth and splay
 *   above 440 m (fitted to the SSW silhouette); the lattice spacing (fins at
 *   every other plan vertex below 520 m, 15 per horn above; rings at 505,
 *   520, 532, 544 and 554.5 m), drawn bolder and sparser than the real fine
 *   fins; the bracing's pattern (two crossing zigzags per face, nodes at 440,
 *   472 and 505 m), sketched from the SSW photo; the louvre bands' heights (115, 180,
 *   260, 335, 410, 445 m, counted on the dawn photo) and size; the podium's
 *   height (10 m, against the trees in the day view 5 photo); the mullion
 *   ridges (about seven per face, standing in for the dense real ones); the
 *   glass colours (sampled from the day view 5 photo: #b5c0d0-#bbc6d4 on the
 *   shaft, #8d9194 low down, pulled to the palette's lightness).
 * - Invented: none of the massing. The small "ears" (maintenance davits?)
 *   at the seam corners near 475 m are left out.
 *
 * Doubts
 * - OSM's floor-by-floor parts are drawn by one mapper; the slot widths at
 *   L107-120 (~9-10 m) look wider than the photos show the seam's dark line,
 *   so the model keeps the line narrow (4.5 m) and splays the walls instead.
 * - The ESE seam corner and the NNE side are only seen in distant photos; the
 *   tower is modelled symmetric (it is, by design and in OSM).
 * - The podium (way/878620802) has no height tag and no clear photo; it is
 *   drawn as a plain 10 m block.
 * - The type=building relation/8824257 has no geometry of its own and is not
 *   listed in `replaces`; its member ways are.
 *
 * Night: the curtain wall and seam glow as windows (the louvre bands share
 * the seam's dark `window` material to stay within six materials, so they
 * glow too); the crown lattice is
 * `neon-lotte-crown` (the lantern is lit white at night); the white
 * mullions carry a little `_FLOODLIGHT` so they don't turn into dark
 * stripes on the lit shaft.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 67.3
const ANCHOR = { lng: 127.1026585, lat: 37.5125414 }
const TOP = 554.5 // published / OSM height of the crown
const BODY = 505 // top of the glazed shaft, base of the open lantern
const SPLIT = 520 // floor of the split between the two crown horns (OSM part way/635073462)

type P2 = [number, number]
const S2 = Math.SQRT2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const table = (rows: [number, number][]) => (z: number) => {
  if (z <= rows[0][0]) return rows[0][1]
  for (let i = 0; i < rows.length - 1; i++) {
    const [z0, v0] = rows[i], [z1, v1] = rows[i + 1]
    if (z <= z1) return v0 + ((v1 - v0) * (z - z0)) / (z1 - z0)
  }
  return rows[rows.length - 1][1]
}

// --- Profile: half-width across the faces by height. ---
const half = table([
  [0, 35.7], [100, 35.5], [170, 34.9], [250, 31.8], [320, 27.2], [345, 25.6], [400, 21.6],
  [433, 19.0], [478, 16.0], [505, 14.2], [520, 13.4], [540, 12.4], [TOP, 11.4],
])
/** Radius of the two plain (round) corners. */
const radius = (z: number) => half(z) * lerp(0.6, 0.55, Math.min(1, z / 320))
/** How far each face bows in toward the seam corner. */
const bow = (z: number) => 0.06 * half(z)
/**
 * The seam: a slot cut into the two seam corners. slotB is its width at the
 * bottom (the dark line), slotW where its walls meet the faces (the walls splay
 * open above 440 m, cutting the seam corners back toward the lantern), slotD
 * its depth from the corner's tip.
 */
const slotB = table([[0, 3.0], [150, 3.5], [320, 4.0], [BODY, 4.5]])
const slotW = table([[0, 3.0], [150, 3.5], [320, 4.0], [425, 4.4], [450, 5.6], [470, 7.4], [490, 10], [BODY, 13], [SPLIT, 20]])
const slotD = table([[0, 2.0], [150, 3.0], [320, 4.6], [433, 7.5], [460, 9], [485, 12], [BODY, 14], [SPLIT, 16]])

const e1: P2 = [1 / S2, 1 / S2] // along the seam diagonal, toward the (+,+) seam corner
const e2: P2 = [-1 / S2, 1 / S2] // across it, toward the (-,+) round corner

/** Face y = +h, from the round corner's tangent point (s = 0) to the seam corner (s = 1). */
function face(z: number) {
  const h = half(z), r = radius(z), b = bow(z)
  const x0 = -(h - r), x1 = h - b
  const y = (x: number) => h - b * ((x - x0) / (x1 - x0)) ** 2
  return { h, r, b, x0, x1, y }
}

const NF = 5 // face samples
const NA = 4 // arc samples per half corner

/**
 * Quarter of the plan: from the seam diagonal (+,+) to the round diagonal (-,+),
 * counter-clockwise from above. Returns points and which edges are creases.
 */
function quarter(z: number): { pts: P2[]; flat: boolean[] } {
  const f = face(z)
  const w = slotW(z), d = slotD(z)
  const tip = (f.x1) * S2
  const din = tip - d
  const s0: P2 = [din * e1[0], din * e1[1]]
  const wb = slotB(z)
  const s1: P2 = [s0[0] + (wb / 2) * e2[0], s0[1] + (wb / 2) * e2[1]]
  // the wall meets the face where e2 . p = w / 2, i.e. y - x = w / sqrt 2
  let lo = f.x0, hi = f.x1
  for (let k = 0; k < 50; k++) {
    const x = (lo + hi) / 2
    if (f.y(x) - x - w / S2 > 0) lo = x
    else hi = x
  }
  const s2: P2 = [lo, f.y(lo)]
  const pts: P2[] = [s0, s1, s2]
  const flat = [true, true] // s0-s1, s1-s2
  for (let i = 1; i <= NF; i++) {
    const x = lerp(s2[0], f.x0, i / NF)
    pts.push([x, f.y(x)])
    flat.push(false)
  }
  const cx = f.x0, cy = f.h - f.r
  for (let i = 1; i <= NA; i++) {
    const a = Math.PI / 2 + (i / NA) * (Math.PI / 4)
    pts.push([cx + f.r * Math.cos(a), cy + f.r * Math.sin(a)])
    flat.push(false)
  }
  return { pts, flat }
}

/** The whole plan ring at height z, and its crease flags per edge (edge i runs i -> i+1). */
function plan(z: number): { ring: P2[]; flat: boolean[]; lips: number[]; lines: number[]; bottoms: number[]; walls: number[] } {
  const q = quarter(z)
  const n = q.pts.length
  // Second quarter: the first reflected across the round diagonal y = -x and
  // reversed, so it runs on counter-clockwise; the round-diagonal point R is
  // shared. The other half is the first turned 180 degrees.
  const refl = (p: P2): P2 => [-p[1], -p[0]]
  const q2 = q.pts.map(refl).reverse()
  const halfRing = [...q.pts.slice(0, n - 1), ...q2.slice(0, n - 1)]
  const flat = [...q.flat, ...[...q.flat].reverse()] // one flag per edge, 2n - 2 of them
  const ring = [...halfRing, ...halfRing.map((p) => [-p[0], -p[1]] as P2)]
  const flags = [...flat, ...flat]
  const m = halfRing.length
  // lips: the slot's outer edges (s2 of each side); lines: pale mullion lines on the faces
  const lips = [2, m - 2, m + 2, 2 * m - 2]
  // the face samples (3..6), the middle of each round corner's arc (9) and the round diagonal (n - 1)
  const lines = [3, 4, 5, 6, 9, n - 1, m - 9, m - 6, m - 5, m - 4, m - 3]
  const lineAll = [...lines, ...lines.map((i) => i + m)]
  const bottoms = [0, m - 1, m, 2 * m - 1], walls = [1, m - 2, m + 1, 2 * m - 2]
  return { ring, flat: flags, lips, lines: lineAll, bottoms, walls }
}

// ---------------------------------------------------------------- helpers
const LOW = 60 // the cooler, darker band at the foot
const glassWall = new Part(), glassLow = new Part(), seam = new Part(), fin = new Part(), crown = new Part(), roof = new Part()

const nrm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const fnorm = (a: V3, b: V3, c: V3): V3 => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  return nrm([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]])
}

/**
 * Loft a closed ring through levels with smooth normals, except across
 * crease edges (flat[i] marks edge i -> i+1 as its own flat face). `pick`
 * sends each edge to a part (the slot walls go to the seam material).
 */
function loftRing(levels: { z: number; ring: P2[] }[], flat: boolean[], pick: (e: number) => Part) {
  const n = levels[0].ring.length, L = levels.length
  const P = levels.map(({ z, ring }) => ring.map(([x, y]) => [x, y, z] as V3))
  const FN: V3[][] = [] // FN[l][e]
  for (let l = 0; l < L - 1; l++) {
    FN.push([])
    for (let e = 0; e < n; e++) {
      const j = (e + 1) % n
      FN[l].push(fnorm(P[l][e], P[l][j], P[l + 1][j]))
    }
  }
  const corner = (l: number, v: number, e: number): V3 => {
    // vertex v at level l, as seen from edge e
    const other = v === e ? (e - 1 + n) % n : (e + 1) % n
    const edges = !flat[e] && !flat[other] ? [e, other] : [e]
    const s: V3 = [0, 0, 0]
    for (const ee of edges) for (const ll of [l - 1, l]) {
      if (ll < 0 || ll >= L - 1) continue
      const m = FN[ll][ee]
      s[0] += m[0]; s[1] += m[1]; s[2] += m[2]
    }
    return nrm(s)
  }
  for (let l = 0; l < L - 1; l++) for (let e = 0; e < n; e++) {
    const j = (e + 1) % n
    const a = P[l][e], b = P[l][j], c = P[l + 1][j], d = P[l + 1][e]
    const na = corner(l, e, e), nb = corner(l, j, e), nc = corner(l + 1, j, e), nd = corner(l + 1, e, e)
    const part = pick(e)
    part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    part.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

/** Ear-clipping triangulation of a simple polygon (counter-clockwise), capped at height z. */
function capPoly(p: Part, poly0: P2[], z: number, up: boolean) {
  // drop points that sit on a straight line between their neighbours
  const poly = poly0.filter((b, i) => {
    const a = poly0[(i - 1 + poly0.length) % poly0.length], c = poly0[(i + 1) % poly0.length]
    return Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) > 1e-6
  })
  const idx = poly.map((_, i) => i)
  const area = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: P2, a: P2, b: P2, c: P2) => area(a, b, q) > 1e-9 && area(b, c, q) > 1e-9 && area(c, a, q) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (area(a, b, c) <= 1e-9) continue
      if (idx.some((i) => i !== i0 && i !== i1 && i !== i2 && inside(poly[i], a, b, c))) continue
      tri(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) tri(poly[idx[0]], poly[idx[1]], poly[idx[2]])
  function tri(a: P2, b: P2, c: P2) {
    const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
    if (up) p.tri(A, B, C)
    else p.tri(A, C, B)
  }
}

/** Outward horizontal normal of a ring at vertex i (bisector of the two edges). */
function vnormal(ring: P2[], i: number): P2 {
  const n = ring.length
  const a = ring[(i - 1 + n) % n], b = ring[i], c = ring[(i + 1) % n]
  const t1 = [b[0] - a[0], b[1] - a[1]], t2 = [c[0] - b[0], c[1] - b[1]]
  const l1 = Math.hypot(t1[0], t1[1]) || 1, l2 = Math.hypot(t2[0], t2[1]) || 1
  const m = [t1[0] / l1 + t2[0] / l2, t1[1] / l1 + t2[1] / l2]
  const lm = Math.hypot(m[0], m[1]) || 1
  return [m[1] / lm, -m[0] / lm] // CCW ring: right of the tangent is outward
}

/**
 * A rectangular member swept through a list of section centres; each
 * section is given by its centre, outward normal and tangent (both
 * horizontal) and the member's half-sizes.
 */
function member(p: Part, secs: { c: V3; n: P2; t: P2; out: number; inn: number; hw: number; hz?: number }[], capEnds = true, back = true) {
  const ring = secs.map(({ c, n, t, out, inn, hw }) => [
    [c[0] - t[0] * hw - n[0] * inn, c[1] - t[1] * hw - n[1] * inn, c[2]],
    [c[0] - t[0] * hw + n[0] * out, c[1] - t[1] * hw + n[1] * out, c[2]],
    [c[0] + t[0] * hw + n[0] * out, c[1] + t[1] * hw + n[1] * out, c[2]],
    [c[0] + t[0] * hw - n[0] * inn, c[1] + t[1] * hw - n[1] * inn, c[2]],
  ] as V3[])
  for (let k = 0; k < ring.length - 1; k++) {
    const r0 = ring[k], r1 = ring[k + 1]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      if (!back && i === 3) continue // the face against the wall
      p.quad(r0[i], r0[j], r1[j], r1[i])
    }
  }
  if (capEnds) {
    const a = ring[0], b = ring[ring.length - 1]
    p.quad(a[0], a[3], a[2], a[1])
    p.quad(b[0], b[1], b[2], b[3])
  }
}

/** A horizontal band (box section) following a closed ring at height z0..z1. */
function band(p: Part, ring: P2[], z0: number, z1: number, out: number, inn: number) {
  const n = ring.length
  const N = ring.map((_, i) => vnormal(ring, i))
  const at = (i: number, o: number, z: number): V3 => [ring[i][0] + N[i][0] * o, ring[i][1] + N[i][1] * o, z]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad(at(i, out, z0), at(j, out, z0), at(j, out, z1), at(i, out, z1)) // outer
    p.quad(at(i, -inn, z1), at(j, -inn, z1), at(j, -inn, z0), at(i, -inn, z0)) // inner
    p.quad(at(i, -inn, z1), at(i, out, z1), at(j, out, z1), at(j, -inn, z1)) // top
    p.quad(at(i, -inn, z0), at(j, -inn, z0), at(j, out, z0), at(i, out, z0)) // bottom
  }
}

/**
 * A raised strip with a ridged (triangular) section, laid along a surface:
 * each section is a point on the surface, its outward normal and the
 * in-surface direction across the strip. Smooth along its length, so
 * consecutive sections share vertices.
 */
function ridge(p: Part, secs: { c: V3; n: V3; perp: V3 }[], w: number, out: number, caps = true) {
  const add = (a: V3, b: V3, k: number): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
  const S = secs.map(({ c, n, perp }) => {
    const L = add(add(c, perp, -w / 2), n, -0.15), R = add(add(c, perp, w / 2), n, -0.15), A = add(c, n, out)
    const nl = nrm(add(add([0, 0, 0], n, w / 2), perp, -(out + 0.15)))
    const nr = nrm(add(add([0, 0, 0], n, w / 2), perp, out + 0.15))
    return { L, R, A, nl, nr }
  })
  for (let k = 0; k < S.length - 1; k++) {
    const a = S[k], b = S[k + 1]
    p.tri(a.L, a.A, b.A, undefined, undefined, undefined, [a.nl, a.nl, b.nl])
    p.tri(a.L, b.A, b.L, undefined, undefined, undefined, [a.nl, b.nl, b.nl])
    p.tri(a.A, a.R, b.R, undefined, undefined, undefined, [a.nr, a.nr, b.nr])
    p.tri(a.A, b.R, b.A, undefined, undefined, undefined, [a.nr, b.nr, b.nr])
  }
  if (caps) for (const [e, sgn] of [[S[0], -1], [S[S.length - 1], 1]] as const) {
    const d = nrm([0, 0, sgn])
    p.tri(e.L, e.A, e.R, undefined, undefined, undefined, [d, d, d])
  }
}

// ---------------------------------------------------------------- shaft
const LEVELS = [0, LOW, 100, 140, 190, 240, 280, 320, 360, 395, 425, 450, 470, 490, BODY]
const plans = LEVELS.map((z) => ({ z, ...plan(z) }))
const FLAT = plans[0].flat
// edges that belong to the slot (both walls and the bottom) take the seam material
const slotEdge = (e: number) => FLAT[e]
// up to 460 m the whole seam is dark; above it the walls splay open and catch the light
const SPLAY = 450
const BOT = new Set(plans[0].bottoms)
loftRing(plans.filter(({ z }) => z <= LOW), FLAT, (e) => (slotEdge(e) ? seam : glassLow))
loftRing(plans.filter(({ z }) => z >= LOW && z <= SPLAY), FLAT, (e) => (slotEdge(e) ? seam : glassWall))
loftRing(plans.filter(({ z }) => z >= SPLAY), FLAT, (e) => (BOT.has(e) ? seam : glassWall))

// Bottom cap (for a closed solid) and the roof of the shaft at BODY
capPoly(roof, plans[0].ring, 0, false)
capPoly(roof, plans[plans.length - 1].ring, BODY, true)

// Pale mullion lines and the white lips of the seam, following the surface:
// a raised ridge at every face sample and at the round corners, about seven
// per face, and a bolder one on each lip of the seam.
function surfaceLine(i: number, w: number, out: number) {
  const secs = plans.map(({ z, ring }) => {
    const n = vnormal(ring, i)
    return { c: [ring[i][0], ring[i][1], z] as V3, n: [n[0], n[1], 0] as V3, perp: [-n[1], n[0], 0] as V3 }
  })
  ridge(fin, secs, w, out)
}
for (const i of plans[0].lips) surfaceLine(i, 2.2, 0.6)
for (const i of plans[0].lines) surfaceLine(i, 1.2, 0.4)

/** The four faces: the face y = +h of the first quarter and its images. */
const FACE_MAPS: ((p: P2) => P2)[] = [(p) => p, (p) => [-p[1], -p[0]], (p) => [-p[0], -p[1]], (p) => [p[1], p[0]]]
/** A point on the face y = +h at height z, t = 0 at the seam's lip to t = 1 at the round corner. */
function onFace(t: number, z: number): { c: P2; n: P2 } {
  const f = face(z), s2x = quarter(z).pts[2][0]
  const x = lerp(s2x, f.x0, t)
  const dydx = (-2 * f.b * (x - f.x0)) / (f.x1 - f.x0) ** 2
  const l = Math.hypot(dydx, 1)
  return { c: [x, f.y(x)], n: [-dydx / l, 1 / l] }
}

// Diagonal bracing seen through the glass below the lantern, ~440-505 m:
// two zigzags crossing on every face, as raised white strips.
{
  const ZS = [440, 472, BODY]
  const T0 = 0.08, T1 = 0.92
  for (const start of [T0, T1]) {
    for (let k = 0; k < ZS.length - 1; k++) {
      const ta = k % 2 === 0 ? start : T0 + T1 - start, tb = T0 + T1 - ta
      const N = 4
      const pts = Array.from({ length: N + 1 }, (_, j) => {
        const t = lerp(ta, tb, j / N), z = lerp(ZS[k], ZS[k + 1], j / N)
        return { ...onFace(t, z), z }
      })
      for (const m of FACE_MAPS) {
        const P = pts.map(({ c, n, z }) => ({ c: [...m(c), z] as V3, n: [...m(n), 0] as V3 }))
        const secs = P.map((q, j) => {
          const a = P[Math.max(0, j - 1)].c, b = P[Math.min(P.length - 1, j + 1)].c
          const d = nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
          const n = q.n
          const perp = nrm([n[1] * d[2] - n[2] * d[1], n[2] * d[0] - n[0] * d[2], n[0] * d[1] - n[1] * d[0]])
          return { c: q.c, n, perp }
        })
        ridge(fin, secs, 1.6, 0.5)
      }
    }
  }
}

// Louvre bands of the mechanical floors: the short dark bars seen in pairs on
// every face in the distant photos, one near the round corner and one near
// the seam on each face.
const louvre = seam // dark like the seam glass
{
  const LOUVRES = [115, 180, 260, 335, 410, 445]
  const maps: ((p: P2) => P2)[] = [(p) => p, (p) => [-p[1], -p[0]], (p) => [-p[0], -p[1]], (p) => [p[1], p[0]]]
  for (const zc of LOUVRES) {
    const H = 4.5, z0 = zc - H / 2, z1 = zc + H / 2
    for (const t of [0.3, 0.72]) {
      const corners = [z0, z1].map((z) => {
        const f = face(z), s2x = quarter(z).pts[2][0]
        const x = lerp(s2x, f.x0, t)
        const w = 6.2 * Math.sqrt(f.h / 35.7)
        const y = (xx: number) => f.y(xx) + 0.18
        return { a: [x + w, y(x + w)] as P2, b: [x - w, y(x - w)] as P2, z }
      })
      for (const m of maps) {
        const A = m(corners[0].a), B = m(corners[0].b), C = m(corners[1].b), D = m(corners[1].a)
        const P = (q: P2, z: number): V3 => [q[0], q[1], z]
        const mid = m([(corners[0].a[0] + corners[0].b[0]) / 2, (corners[0].a[1] + corners[0].b[1]) / 2])
        const l = Math.hypot(mid[0], mid[1])
        const nn: V3 = [mid[0] / l, mid[1] / l, 0]
        // the face's own outward normal is close enough to the radial one here
        const fN = (() => {
          const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy)
          let n2: V3 = [dy / L, -dx / L, 0]
          if (n2[0] * nn[0] + n2[1] * nn[1] < 0) n2 = [-n2[0], -n2[1], 0]
          return n2
        })()
        louvre.tri(P(A, z0), P(B, z0), P(C, z1), undefined, undefined, undefined, [fN, fN, fN])
        louvre.tri(P(A, z0), P(C, z1), P(D, z1), undefined, undefined, undefined, [fN, fN, fN])
      }
    }
  }
}

// ---------------------------------------------------------------- crown
// Lower lantern, BODY..SPLIT: the shaft's own plan carried on as lattice
// (rings and fins round a recessed core), with the seam still opening, so the
// shaft runs into the lantern with no step. Its roof at 520 m is the floor of
// the split between the horns (OSM way/635073462).
{
  const inset = (ring: P2[], o: number) => ring.map((p, i) => { const m = vnormal(ring, i); return [p[0] - m[0] * o, p[1] - m[1] * o] as P2 })
  const LZ = [BODY, 512.5, SPLIT]
  loftRing(LZ.map((z) => ({ z, ring: inset(plan(z).ring, 2.2) })), FLAT, () => glassWall)
  capPoly(roof, inset(plan(SPLIT).ring, 2.2), SPLIT, true)
  band(crown, plan(BODY).ring, BODY, BODY + 3.4, 0.12, 0.9)
  band(crown, plan(SPLIT).ring, SPLIT - 1.6, SPLIT, 0.12, 0.9)
  const ring0 = plan(BODY).ring, nn = ring0.length
  const glassy = ring0.map((_, i) => !(FLAT[i] && FLAT[(i - 1 + nn) % nn]))
  let k = 0
  for (let i = 0; i < nn; i++) {
    if (!glassy[i]) continue
    if (k++ % 2) continue
    const secs = LZ.map((z) => {
      const r = plan(z).ring, m = vnormal(r, i)
      return { c: [r[i][0], r[i][1], z] as V3, n: m, t: [-m[1], m[0]] as P2, out: 0.45, inn: 0.75, hw: 0.65 }
    })
    member(crown, secs, false)
  }
}
// Upper lantern, SPLIT..TOP: two horns, the round-corner quadrants, with the
// split between them running along the seam diagonal.
const HC = 0.0 // inner edges sit this far off the axes
const HCH = 4.0 // chamfer of the inner corner
function hornA(z: number): P2[] {
  // outline from the face midpoint on y = +h, round the (-,+) corner, to the face midpoint on x = -h,
  // then back along the inner edges (x = -HC side ... y = +HC side) with a chamfer near the centre.
  const f = face(z)
  const pts: P2[] = []
  const xm = -HC
  const NFh = 3
  for (let i = 0; i <= NFh; i++) {
    const x = lerp(xm, f.x0, i / NFh)
    pts.push([x, f.y(x)])
  }
  const cx = f.x0, cy = f.h - f.r
  for (let i = 1; i <= 3; i++) {
    const a = Math.PI / 2 + (i / 3) * (Math.PI / 4)
    pts.push([cx + f.r * Math.cos(a), cy + f.r * Math.sin(a)])
  }
  const q = pts.slice(0, pts.length - 1)
  const refl = (p: P2): P2 => [-p[1], -p[0]]
  const out = [...pts, ...q.map(refl).reverse()] // M1 .. R .. M2
  // inner edges: from M2 = (-h', HC) inward to the chamfer, then to M1's inner end
  out.push([-HC - HCH, HC], [-HC, HC + HCH])
  // counter-clockwise from above? M1 is at top right of this quadrant going left: that is CCW. Good.
  return out
}
/**
 * The lantern keeps the shaft's taper and rolls in over its top edge, as in
 * the SSW photo: each horn is drawn in toward its own middle by k(z).
 */
const roll = (z: number) => {
  if (z <= SPLIT) return 1
  if (z <= 544) return 1 - 0.1 * ((z - SPLIT) / (544 - SPLIT))
  const a = Math.min(1, (z - 544) / (TOP - 544)) // a quarter-round over the last 10.5 m
  return 0.9 - 0.2 * (1 - Math.sqrt(1 - a * a))
}
function hornOf(z: number, sign: number): P2[] {
  const raw = hornA(z)
  // the horn's middle: the round corner's centre of mass, roughly
  const cx = raw.reduce((s, p) => s + p[0], 0) / raw.length, cy = raw.reduce((s, p) => s + p[1], 0) / raw.length
  const k = roll(z)
  return raw.map(([x, y]) => [sign * (cx + (x - cx) * k), sign * (cy + (y - cy) * k)] as P2)
}
const hornAr = (z: number) => hornOf(z, 1)
const hornB = (z: number) => hornOf(z, -1)

for (const horn of [hornAr, hornB]) {
  const zs = [532, 544, TOP]
  const rings = zs.map((z) => horn(z))
  const n = rings[0].length
  // a recessed silver core inside the lattice, open over the top 6.5 m
  const inset = (ring: P2[], o: number) => ring.map((p, i) => { const m = vnormal(ring, i); return [p[0] - m[0] * o, p[1] - m[1] * o] as P2 })
  const cz = [SPLIT, 548]
  const cr = cz.map((z) => inset(horn(z), 2.6))
  const flatH = rings[0].map((_, i) => i >= n - 3) // inner straight edges are creases
  loftRing(cz.map((z, k) => ({ z, ring: cr[k] })), flatH, () => glassWall)
  capPoly(roof, cr[1], 548, true)
  // rings
  for (const [k, z] of zs.entries()) {
    const hz = k === zs.length - 1 ? 2.2 : 1.5
    const z0 = k === zs.length - 1 ? z - hz : z - hz / 2
    band(crown, horn(z), z0, z0 + hz, 0.12, 0.9) // flush with the shaft below: no ledge
  }
  // fins at every outline vertex, SPLIT - 15 .. TOP (they run down over the lower lantern)
  for (let i = 0; i < n; i++) {
    const secs = [SPLIT, 536, 549, TOP].map((z) => {
      const rr = horn(z)
      const m = vnormal(rr, i)
      return { c: [rr[i][0], rr[i][1], z] as V3, n: m, t: [-m[1], m[0]] as P2, out: 0.45, inn: 0.75, hw: 0.65 }
    })
    member(crown, secs, true)
  }
}
// ---------------------------------------------------------------- podium
// OSM building:part way/878620802: the low podium wrapping the south-east
// face (model +x). Height estimated (see header).
{
  const PODIUM: P2[] = [
    [34.0, 25.1], [33.5, 28.2], [36.6, 28.3], [37.9, 25.0], [41.0, 19.3], [44.1, 12.0], [45.3, 6.9], [45.8, 1.3],
    [45.3, -3.7], [44.4, -9.9], [42.6, -14.2], [40.7, -18.8], [38.1, -23.6], [35.6, -27.7], [32.4, -31.4],
    [28.6, -34.8], [24.6, -37.5], [20.0, -39.0], [16.0, -39.7], [12.3, -39.6], [12.1, -35.4], [18.2, -34.8],
    [24.2, -33.0], [29.2, -29.4], [32.8, -24.5], [34.5, -18.6], [35.1, -12.3], [35.5, -6.0], [35.6, 0.2],
    [35.5, 6.4], [35.0, 15.8], [34.4, 21.8],
  ]
  // the OSM ring is clockwise; make it counter-clockwise
  let a = 0
  for (let i = 0; i < PODIUM.length; i++) {
    const p = PODIUM[i], q = PODIUM[(i + 1) % PODIUM.length]
    a += p[0] * q[1] - q[0] * p[1]
  }
  const poly = a < 0 ? [...PODIUM].reverse() : PODIUM
  const H = 10
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length]
    glassWall.quad([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], H], [p[0], p[1], H])
  }
  capPoly(roof, poly, H, true)
}

// ---------------------------------------------------------------- write
// The outline and every building:part of relation/8824257 (the tower), the podium included.
const REPLACES = [
  'way/914963586',
  'way/879571752',
  'way/888605473',
  'way/888605472',
  'way/879798717',
  'way/888605471',
  'way/879798716',
  'way/888605470',
  'way/879571750',
  'way/635073462',
  'way/635073469',
  'way/635073470',
  'way/878620802',
  'way/879798696',
  'way/879798698',
  'way/879798699',
  'way/879798700',
  'way/879798702',
  'way/879798703',
  'way/879798704',
  'way/879798705',
  'way/879798706',
  'way/879798707',
  'way/879798708',
  'way/879798710',
  'way/879798711',
  'way/879798712',
  'way/879798713',
  'way/879798714',
  'way/879798715',
  'way/879808331',
  'way/879808332',
  'way/879808333',
]

const parts = [
  { part: glassWall, material: windowVariant(2, 0xb9c4d1) },
  { part: glassLow, material: windowVariant(3, 0xa8b3bd) },
  { part: seam, material: PALETTE.window },
  // the pale mullions catch the light at night rather than turning into dark stripes
  { part: fin, material: { ...finish('lotte-mullion', 0xf1f3f3), floodlight: () => 0.6 } },
  { part: crown, material: finish('neon-lotte-crown', 0xeef1f2) },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (process.env.COUNTS) console.log(parts.map(({ part, material }) => material.name + ' ' + part.triangles).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Lotte World Tower', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-lotte-world-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
