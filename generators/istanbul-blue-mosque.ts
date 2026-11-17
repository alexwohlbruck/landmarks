/**
 * Sultan Ahmed Mosque (Blue Mosque), Sultanahmet, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-blue-mosque.ts
 *
 * Built 1609-1616 (Sedefkâr Mehmed Ağa). The prayer hall's cascade of a
 * central dome on a window drum, four semi-domes over a lower lead skirt (the
 * exedrae tier), four octagonal turrets with small domes at the corners of
 * the dome square, two round buttress turrets on the north and qibla fronts,
 * and four corner domes; the six minarets; the courtyard with its domed
 * arcade (30 domes) and the şadırvan.
 *
 * Frame: x across the mosque's axis (world bearing 43.5), y along it towards
 * the courtyard (world 313.5), z up; placed with bearing 313.5. Origin at the
 * centroid of the OSM outline's outer ring (28.976653, 41.005409). y = 0 is
 * the lowest ground, on the south-east (qibla) side; the hall floor and the
 * courtyard are taken as F = 2 m above it (estimated: the site falls from
 * the Hippodrome towards the Arasta bazaar). Walls run down to y = 0 all
 * round. elevation 0. No terrain check could run: Mapterhorn has no z15
 * terrain here, and there is no lidar for Turkey.
 *
 * OSM (ODbL), fetched 2026-11: relation/18055570 (outline: outer ring and
 * the open court as its inner ring), relation/6006925 (hall, 8 m),
 * relation/6961001 (dome block), and 96 building / building:part ways inside
 * the outline: the six minarets with their pedestals, the dome, drum,
 * semi-dome and turret parts, all 30 arcade domes, the portals and the
 * şadırvan's parts. Used for the plan: hall 65 x 58 m (x -32.5..32.5,
 * y -56.5..1.7); courtyard to y = 57; open court x +-23.4, y 10..48;
 * minaret positions; arcade dome positions (9 + 9 + 6 + 6). OSM's height
 * tags for the cascade (dome 52-62 m, finial 66.5 m) disagree with the
 * published 43 m dome and with every photo, so they are not used. The
 * şadırvan is mapped 6.6 m east of the axis; the courtyard photos show it on
 * the axis in front of the portal, so it is centred here. The Hünkâr Kasrı
 * (way/530509287) and other outbuildings outside the outline are left out.
 *
 * Published (Wikipedia, "Blue Mosque, Istanbul"):
 * - inner dome 23.5 m across, 43 m high; prayer hall about 64 x 72 m;
 * - six minarets 64 m; the four at the hall's corners have three şerefes,
 *   the two at the courtyard's far corners two;
 * - four semi-domes each with smaller exedrae; four corner domes;
 * - courtyard arcade of 26 columns under 30 domes; a hexagonal şadırvan.
 *
 * Estimated from photos (scaled against the hall minarets, 64 m, balcony
 * spacing about 9.5 m; the Galata Tower telephoto view is the main ruler):
 * - hall minaret şerefes at 23, 32.5, 42 m, cap base 49.5 m; courtyard
 *   minarets shorter, şerefes at 26.5 and 36 m, tip 59 m (both photos from
 *   the north and the Galata view show their tips well below the others);
 * - hall walls 17 m (F + 15) to the cornice;
 * - dome square block to 31 m; main drum 31-36 m, dome rise 7.7 m to about
 *   43.7 m, outer diameter about 25 m (Galata view: dome width 0.57 of the
 *   minaret from tip to first şerefe), gilt alem to about 50 m;
 * - semi-domes radius 10.6 m, drums to 24 m, crowns at 30 m;
 * - octagonal corner turrets to 31.5 m with domes to 34 m; round buttress
 *   turrets to 26 m; corner domes on short drums to about 22 m;
 * - arcade: portico (hall side) roof 11.8 m, the other wings 9.4 m; the
 *   portico's central portal and the far gate raised, with domes.
 * Invented / simplified: window counts and sizes (grouped panels: a square
 * lower window and a pair of round-headed windows per bay); the exedrae as
 * one lead skirt per semi-dome; flat stone terraces over the galleries;
 * arcade arches as semicircles (the real ones are slightly pointed).
 *
 * Minarets are drawn about 1.3 times their real diameter (3.8 m shaft), with
 * each şerefe as a bold corbelled ring, so they survive at phone size.
 *
 * Colours from daylight photos, pulled to the palette: pale grey limestone
 * (#e6e2d9), blue-grey lead (#95a0ad), gilt finials. Night: the mosque is
 * floodlit, stone, domes and minarets (night photo below), so stone and
 * lead carry _FLOODLIGHT; windows glow.
 *
 * Photos (EVIDENCE, all Wikimedia Commons):
 * - "Exterior of Sultan Ahmed I Mosque in Istanbul, Turkey 002.jpg",
 *   Moonik, CC BY-SA 3.0 (from the east, about 88 degrees)
 *   https://commons.wikimedia.org/wiki/File:Exterior_of_Sultan_Ahmed_I_Mosque_in_Istanbul,_Turkey_002.jpg
 * - "Sultan Ahmed Mosque 2022 5.jpg", kallerna, CC BY-SA 4.0 (from the
 *   east-south-east, about 115, with the Hünkâr Kasrı)
 *   https://commons.wikimedia.org/wiki/File:Sultan_Ahmed_Mosque_2022_5.jpg
 * - "Sultan Ahmed Mosque 2022 3.jpg", kallerna, CC BY-SA 4.0 (from
 *   Sultanahmet Park, north-east, about 40)
 *   https://commons.wikimedia.org/wiki/File:Sultan_Ahmed_Mosque_2022_3.jpg
 * - "View of the Blue Mosque from the Galata Tower (1).jpg", José Luiz,
 *   CC BY-SA 3.0 (from the north, about 355, telephoto)
 *   https://commons.wikimedia.org/wiki/File:View_of_the_Blue_Mosque_from_the_Galata_Tower_(1).jpg
 * - "Blue Mosque (Sultan Ahmet Camii) DSCF4575.jpg", R Prazeres,
 *   CC BY-SA 4.0 (courtyard, portico and cascade)
 *   https://commons.wikimedia.org/wiki/File:Blue_Mosque_(Sultan_Ahmet_Camii)_DSCF4575.jpg
 * - "Sultan Ahmed I Mosque in 2026 26.jpg", Joseolgon, CC BY 4.0 (night)
 *   https://commons.wikimedia.org/wiki/File:Sultan_Ahmed_I_Mosque_in_2026_26.jpg
 * Look-only: none.
 *
 * Doubts: no photo of the courtyard's far (north-west) gate or the outside
 * of the courtyard walls from the Hippodrome was used, so the far gate and
 * the courtyard's outer windows are plain estimates; the site's slope (F)
 * is estimated, not measured; the west side is assumed to mirror the east.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part()

// ---------------------------------------------------------------------------
// Helpers.

/** A convex planar polygon, fan-triangulated and wound to face `n`. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** Vertical prism over a counter-clockwise ring, flat-shaded. */
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}

/** A rectangle with chamfered corners, counter-clockwise. */
function rect(x0: number, x1: number, y0: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, k) => {
    const a = phase + (k * TAU) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}

/**
 * A surface of revolution about a vertical axis through (cx, cy), smooth-
 * shaded along the profile. `prof` runs [r, z] from the bottom up; r = 0
 * closes to a point. a0..a1 limits it to part of a turn (semi-domes).
 */
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], n: number, a0 = 0, a1 = TAU, smooth: boolean | 'ring' = true) {
  const m = prof.length
  const nrm2 = prof.map((_, i) => {
    const pa = prof[Math.max(0, i - 1)], pb = prof[Math.min(m - 1, i + 1)]
    const dr = pb[0] - pa[0], dz = pb[1] - pa[1]
    const l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  const steps = n
  for (let k = 0; k < steps; k++) {
    const t0 = a0 + ((a1 - a0) * k) / steps, t1 = a0 + ((a1 - a0) * (k + 1)) / steps
    for (let i = 0; i < m - 1; i++) {
      const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
      const N = (j: number, t: number): V3 => [nrm2[j][0] * Math.cos(t), nrm2[j][0] * Math.sin(t), nrm2[j][1]]
      // segment normal, for flat shading
      const dr = prof[i + 1][0] - prof[i][0], dz = prof[i + 1][1] - prof[i][1]
      const l = Math.hypot(dr, dz) || 1
      const tm = (t0 + t1) / 2
      const F: V3 = [(dz / l) * Math.cos(tm), (dz / l) * Math.sin(tm), -dr / l]
      // 'ring': smooth round the axis, hard along the profile
      const S = (t: number): V3 => [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
      const nA = smooth === 'ring' ? S(t0) : smooth ? N(i, t0) : F, nB = smooth === 'ring' ? S(t1) : smooth ? N(i, t1) : F
      const nC = smooth === 'ring' ? S(t1) : smooth ? N(i + 1, t1) : F, nD = smooth === 'ring' ? S(t0) : smooth ? N(i + 1, t0) : F
      const a = P(i, t0), b = P(i, t1), c = P(i + 1, t1), d = P(i + 1, t0)
      if (prof[i][0] > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}

/** Points of a segmental dome: base radius r at z, rising h; `rings` steps. */
function domeProfile(r: number, z: number, h: number, rings: number): [number, number][] {
  const R = (r * r + h * h) / (2 * h), zc = z + h - R
  const top = Math.asin(r / R)
  return Array.from({ length: rings + 1 }, (_, k) => {
    const a = top * (1 - k / rings)
    return [R * Math.sin(a), zc + R * Math.cos(a)] as [number, number]
  })
}

/** A lead dome with a short lead lip, and its gilt finial (alem). */
function dome(cx: number, cy: number, r: number, z: number, h: number, n: number, rings: number, alemH = 0, lip = true) {
  if (lip) revolve(lead, cx, cy, [[r + 0.25, z - 0.35], [r + 0.25, z]], n, 0, TAU, 'ring')
  revolve(lead, cx, cy, lip ? [[r + 0.25, z], ...domeProfile(r, z, h, rings)] : domeProfile(r, z, h, rings), n)
  if (alemH > 0) alem(cx, cy, z + h, alemH)
}

/** The gilt finial: a stem with two bulbs, drawn bold. */
function alem(cx: number, cy: number, z: number, h: number) {
  const w = Math.max(0.22, h * 0.07)
  revolve(gilt, cx, cy, [[w * 1.6, z - 0.2], [w * 2.6, z + h * 0.3], [w * 0.9, z + h * 0.55], [0, z + h]], 5, 0, TAU, true)
}

/** A flat panel on a vertical wall: base (x0,y0)-(x1,y1) along the wall, offset out by `out` along n. */
function panel(p: Part, a: XY, b: XY, z0: number, z1: number, n: XY, arch = false, out = 0.05) {
  const o: XY = [n[0] * out, n[1] * out]
  const A: V3 = [a[0] + o[0], a[1] + o[1], z0], B: V3 = [b[0] + o[0], b[1] + o[1], z0]
  const N3: V3 = [n[0], n[1], 0]
  if (!arch) {
    poly(p, [A, B, [B[0], B[1], z1], [A[0], A[1], z1]], N3)
    return
  }
  // a round-headed panel: rectangle to z1 - half the width, then a semicircle
  const w = Math.hypot(b[0] - a[0], b[1] - a[1]), r = w / 2, zs = z1 - r
  poly(p, [A, B, [B[0], B[1], zs], [A[0], A[1], zs]], N3)
  const ux = (b[0] - a[0]) / w, uy = (b[1] - a[1]) / w
  const cxp = (A[0] + B[0]) / 2, cyp = (A[1] + B[1]) / 2
  const pts: V3[] = []
  for (let k = 0; k <= 4; k++) {
    const t = Math.PI - (Math.PI * k) / 4
    pts.push([cxp + ux * r * Math.cos(t), cyp + uy * r * Math.cos(t), zs + r * Math.sin(t)])
  }
  poly(p, pts, N3)
}

// ---------------------------------------------------------------------------
// Plan, in the model frame: x across the axis (towards world 43.5 degrees),
// y along it towards the courtyard (world 313.5 degrees). Origin at the
// centroid of the OSM outline (relation/18055570). All from OSM unless noted.

const F = 2 // the floor and courtyard above the lowest ground (south-east side); estimated
const HX = 32.5 // half width of hall and courtyard (OSM: 65 m)
const QY = -56.5 // qibla wall (OSM)
const NY = 1.7 // hall north wall / courtyard portico back (OSM)
const CY = 57 // far courtyard wall (OSM)
const IX = 23.4, IY0 = 10, IY1 = 48 // the open court (OSM inner ring)
const DC: XY = [0, -27.4] // main dome centre: middle of the hall
const WALL = F + 15 // hall wall top; photo-scaled against the minaret balconies

// Hall body.
prism(stone, rect(-HX, HX, QY, NY, 0.6), 0, WALL, false)
// a stone cornice band at the wall top
prism(stone, rect(-HX - 0.35, HX + 0.35, QY - 0.35, NY + 0.35, 0.8), WALL - 1.0, WALL + 0.3, false)
// the flat terraces over the galleries read as pale stone in the photos
poly(stone, rect(-HX - 0.35, HX + 0.35, QY - 0.35, NY + 0.35, 0.8).map(([x, y]) => [x, y, WALL + 0.3] as V3), [0, 0, 1])

// Hall windows: seven bays a side, a square lower window and a tall
// round-headed upper pair per bay, grouped as one panel each.
{
  const sides: Array<{ a: XY; b: XY; n: XY; bays: number; low: boolean }> = [
    { a: [-HX, QY], b: [HX, QY], n: [0, -1], bays: 7, low: true }, // qibla
    { a: [HX, QY], b: [HX, NY], n: [1, 0], bays: 7, low: true }, // east
    { a: [-HX, NY], b: [-HX, QY], n: [-1, 0], bays: 7, low: true }, // west
    { a: [HX, NY], b: [-HX, NY], n: [0, 1], bays: 7, low: false }, // north, above the portico
  ]
  for (const s of sides) {
    const L = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1])
    const ux = (s.b[0] - s.a[0]) / L, uy = (s.b[1] - s.a[1]) / L
    const bay = (L - 8) / s.bays
    for (let k = 0; k < s.bays; k++) {
      const m = 4 + bay * (k + 0.5)
      const at = (d: number): XY => [s.a[0] + ux * d, s.a[1] + uy * d]
      const hw = bay * 0.21, g = bay * 0.06
      if (s.low) panel(win, at(m - hw), at(m + hw), F + 2.0, F + 4.8, s.n)
      // a pair of round-headed windows above; on the north wall only the
      // part above the portico roof shows
      const z0 = s.low ? F + 7.6 : F + 10.6, z1 = F + 12.8
      panel(win, at(m - hw), at(m - g), z0, z1, s.n, true)
      panel(win, at(m + g), at(m + hw), z0, z1, s.n, true)
    }
  }
}

// The cascade. Main dome block (the pendentive mass over the four piers).
const BH = 13.5 // half side of the dome square; inner dome 23.5 m (published) plus the arches
const BLOCK = F + 29
prism(stone, rect(DC[0] - BH, DC[0] + BH, DC[1] - BH, DC[1] + BH, 0.5), WALL, BLOCK)

// Semi-domes, one on each side, each over a lower lead skirt (the exedrae tier).
const SR = 10.6, SDRUM0 = WALL, SDRUM1 = F + 22, SCROWN = BLOCK - 1.0
const semis: Array<{ c: XY; a: number }> = [
  { c: [DC[0], DC[1] + BH], a: 0 }, // north: opens towards +y
  { c: [DC[0], DC[1] - BH], a: Math.PI }, // qibla
  { c: [DC[0] + BH, DC[1]], a: -Math.PI / 2 }, // east
  { c: [DC[0] - BH, DC[1]], a: Math.PI / 2 }, // west
]
for (const s of semis) {
  const a0 = s.a, a1 = s.a + Math.PI
  // the exedra tier: a sloped lead skirt round the semi-dome's drum
  revolve(lead, s.c[0], s.c[1], [[SR + 2.8, WALL], [SR + 2.8, WALL + 1.2], [SR + 0.2, WALL + 3.4]], 8, a0, a1)
  // drum with its window ring
  revolve(stone, s.c[0], s.c[1], [[SR, SDRUM0], [SR, SDRUM1]], 10, a0, a1, false)
  for (let k = 0; k < 10; k++) {
    const A: XY = [s.c[0] + SR * Math.cos(a0 + (Math.PI * k) / 10), s.c[1] + SR * Math.sin(a0 + (Math.PI * k) / 10)]
    const B: XY = [s.c[0] + SR * Math.cos(a0 + (Math.PI * (k + 1)) / 10), s.c[1] + SR * Math.sin(a0 + (Math.PI * (k + 1)) / 10)]
    const f = (t: number): XY => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]
    panel(win, f(0.22), f(0.78), WALL + 3.6, SDRUM1 - 0.5, [Math.cos(a0 + (Math.PI * (k + 0.5)) / 10), Math.sin(a0 + (Math.PI * (k + 0.5)) / 10)])
  }
  // quarter dome: a lip then a segmental half dome rising to the block
  revolve(lead, s.c[0], s.c[1], [[SR + 0.3, SDRUM1 - 0.3], [SR + 0.3, SDRUM1], ...domeProfile(SR, SDRUM1, SCROWN - SDRUM1, 3)], 10, a0, a1)
}

// Main drum (window ring with buttresses) and dome. Inner dome 23.5 m
// across, 43 m high (published); the outer shell photo-scaled.
const MDR = 11.7, MD0 = BLOCK, MD1 = F + 34, MDH = 7.7
{
  const n = 24
  revolve(stone, DC[0], DC[1], [[MDR, MD0], [MDR, MD1]], n, Math.PI / n, TAU + Math.PI / n, false)
  for (let k = 0; k < n; k++) {
    const t = (k * TAU) / n, nx = Math.cos(t), ny = Math.sin(t)
    const a0 = t - Math.PI / n, a1 = t + Math.PI / n
    const A: XY = [DC[0] + MDR * Math.cos(a0), DC[1] + MDR * Math.sin(a0)]
    const B: XY = [DC[0] + MDR * Math.cos(a1), DC[1] + MDR * Math.sin(a1)]
    const f = (s: number): XY => [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s]
    panel(win, f(0.2), f(0.8), MD0 + 0.7, MD1 - 0.4, [nx, ny])
  }
  // buttresses between the windows: small stone fins, one per two windows
  for (let k = 0; k < n; k += 3) {
    const t = ((k + 0.5) * TAU) / n
    const c: XY = [DC[0] + (MDR + 0.6) * Math.cos(t), DC[1] + (MDR + 0.6) * Math.sin(t)]
    const ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux
    const ring: XY[] = [
      [c[0] - ux * 0.8 - vx * 0.45, c[1] - uy * 0.8 - vy * 0.45],
      [c[0] + ux * 0.8 - vx * 0.45, c[1] + uy * 0.8 - vy * 0.45],
      [c[0] + ux * 0.8 + vx * 0.45, c[1] + uy * 0.8 + vy * 0.45],
      [c[0] - ux * 0.8 + vx * 0.45, c[1] - uy * 0.8 + vy * 0.45],
    ]
    prism(stone, ring, MD0, MD1 - 0.2)
  }
  dome(DC[0], DC[1], MDR + 0.5, MD1, MDH, 24, 5, 6.5)
}

// Four octagonal turrets with small domes at the corners of the dome square.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [DC[0] + sx * BH, DC[1] + sy * BH]
  prism(stone, circle(c[0], c[1], 3.0, 8, Math.PI / 8), WALL, F + 29.5)
  dome(c[0], c[1], 2.9, F + 29.5, 2.5, 10, 2, 2.4)
}

// Two round buttress turrets on each of the north and qibla fronts.
for (const sx of [-1, 1]) for (const y of [NY - 5.2, QY + 5.2]) {
  prism(stone, circle(sx * 15.6, y, 2.4, 8, Math.PI / 8), WALL, F + 24)
  dome(sx * 15.6, y, 2.3, F + 24, 1.3, 8, 2)
}

// Corner domes over the four corner bays, on short window drums.
for (const sx of [-1, 1]) for (const y of [DC[1] + 20.4, DC[1] - 20.4]) {
  const c: XY = [sx * 22.4, y]
  const n = 12
  revolve(stone, c[0], c[1], [[5.2, WALL], [5.2, F + 16.6]], n, Math.PI / n, TAU + Math.PI / n, false)
  for (let k = 0; k < n; k += 2) {
    const t = (k * TAU) / n
    const A: XY = [c[0] + 5.2 * Math.cos(t - Math.PI / n), c[1] + 5.2 * Math.sin(t - Math.PI / n)]
    const B: XY = [c[0] + 5.2 * Math.cos(t + Math.PI / n), c[1] + 5.2 * Math.sin(t + Math.PI / n)]
    const f = (s: number): XY => [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s]
    panel(win, f(0.25), f(0.75), WALL + 0.3, F + 16.3, [Math.cos(t), Math.sin(t)])
  }
  dome(c[0], c[1], 5.3, F + 16.6, 3.4, 12, 2, 2.4)
}

// ---------------------------------------------------------------------------
// Courtyard with its domed arcade (30 domes) and the şadırvan.

const PORCH_ROOF = F + 9.8, SIDE_ROOF = F + 7.4
type Wing = { roof: number; spring: number }
const front: Wing = { roof: PORCH_ROOF, spring: F + 5.2 }
const side: Wing = { roof: SIDE_ROOF, spring: F + 3.4 }

// Wing bodies: outer walls and roof slabs. The inner side is open arcade.
const SLAB = 1.1
function wingBox(x0: number, x1: number, y0: number, y1: number, w: Wing, outer: Array<'n' | 's' | 'e' | 'w'>) {
  // roof slab
  prism(stone, rect(x0, x1, y0, y1), w.roof - SLAB, w.roof, true, true)
  // outer walls, 1.2 m thick, from the ground to the slab
  for (const o of outer) {
    const t = 1.2
    const r = o === 'n' ? rect(x0, x1, y1 - t, y1) : o === 's' ? rect(x0, x1, y0, y0 + t) : o === 'e' ? rect(x1 - t, x1, y0, y1) : rect(x0, x0 + t, y0, y1)
    prism(stone, r, 0, w.roof - SLAB, false)
  }
}
// front portico (hall side), sides, far wing; corners belong to the side wings
wingBox(-IX, IX, NY, IY0, front, [])
wingBox(-HX, -IX, NY, IY1, side, ['w'])
wingBox(IX, HX, NY, IY1, side, ['e'])
wingBox(-HX, HX, IY1, CY, side, ['n', 'w', 'e'])
// the side wings' corner bays next to the portico rise to the portico roof
for (const sx of [-1, 1]) prism(stone, rect(sx > 0 ? IX : -HX, sx > 0 ? HX : -IX, NY, IY0), SIDE_ROOF, PORCH_ROOF, true)

// Arcade fronts: round arches on columns, each bay a real opening.
function arcade(a: XY, b: XY, bays: number, w: Wing, n: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const bay = L / bays, pier = 0.9, depth = 1.0
  const top = w.roof - SLAB
  const at = (d: number, off: number, z: number): V3 => [a[0] + ux * d + n[0] * off, a[1] + uy * d + n[1] * off, z]
  const N3: V3 = [n[0], n[1], 0]
  for (let k = 0; k <= bays; k++) {
    // columns (a pier at each end belongs to the corner)
    const d = k * bay
    const d0 = Math.max(0, d - pier / 2), d1 = Math.min(L, d + pier / 2)
    const ring: XY[] = [
      [at(d0, -depth, 0)[0], at(d0, -depth, 0)[1]], [at(d1, -depth, 0)[0], at(d1, -depth, 0)[1]],
      [at(d1, 0, 0)[0], at(d1, 0, 0)[1]], [at(d0, 0, 0)[0], at(d0, 0, 0)[1]],
    ]
    // keep the ring counter-clockwise
    const area = ring.reduce((s, p, i) => { const q = ring[(i + 1) % 4]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
    prism(stone, area > 0 ? ring : ring.slice().reverse(), 0, w.spring, false)
  }
  for (let k = 0; k < bays; k++) {
    const c = (k + 0.5) * bay, r = bay / 2 - pier / 2, segs = 6
    const pts: Array<[number, number]> = []
    for (let i = 0; i <= segs; i++) {
      const t = Math.PI - (Math.PI * i) / segs
      pts.push([c + r * Math.cos(t), w.spring + r * Math.sin(t)])
    }
    // spandrel face: vertical strips from the arch up to the slab
    const edgeL = c - bay / 2, edgeR = c + bay / 2
    // the springing points reach out to the bay's edges at the spring line
    pts[0][0] = edgeL + pier / 2; pts[segs][0] = edgeR - pier / 2
    const tx = (i: number) => edgeL + ((edgeR - edgeL) * i) / segs
    poly(stone, [at(edgeL, 0, w.spring), at(pts[0][0], 0, w.spring), at(edgeL, 0, top)], N3)
    poly(stone, [at(pts[segs][0], 0, w.spring), at(edgeR, 0, w.spring), at(edgeR, 0, top)], N3)
    for (let i = 0; i < segs; i++) {
      const [d0, z0] = pts[i]
      let [d1, z1] = pts[i + 1]
      poly(stone, [at(d0, 0, z0), at(d1, 0, z1), at(tx(i + 1), 0, top), at(tx(i), 0, top)], N3)
      // soffit: the arch's underside, facing down and in, at half the
      // spandrel's segments (it is mostly out of sight)
      if (i % 2) continue
      ;[d1, z1] = pts[i + 2] as [number, number]
      const mx = (d0 + d1) / 2 - c, mz = (z0 + z1) / 2 - w.spring
      const inward: V3 = [-(ux * mx), -(uy * mx), -mz]
      poly(stone, [at(d0, 0, z0), at(d1, 0, z1), at(d1, -depth, z1), at(d0, -depth, z0)], inward)
    }
  }
}
arcade([-IX, IY0], [IX, IY0], 7, front, [0, 1])
arcade([IX, IY1], [-IX, IY1], 7, side, [0, -1])
arcade([-IX, IY1], [-IX, IY0], 6, side, [1, 0])
arcade([IX, IY0], [IX, IY1], 6, side, [-1, 0])

// The arcade domes: nine along the portico, nine along the far wing, six on
// each side between the corners (OSM has all 30).
{
  const fy = (NY + IY0) / 2, by = (IY1 + CY) / 2, sxp = (IX + HX) / 2
  const pb = (2 * IX) / 7, sb = (IY1 - IY0) / 6
  for (let k = 0; k < 7; k++) {
    const x = -IX + pb * (k + 0.5)
    const big = Math.abs(k - 3) <= 2
    if (k !== 3) dome(x, fy, big ? 3.1 : 2.8, PORCH_ROOF, big ? 2.5 : 2.2, 10, 2, 0, false)
    dome(x, by, 2.75, SIDE_ROOF, 2.1, 8, 2, 0, false)
  }
  for (const sx of [-1, 1]) {
    dome(sx * sxp, fy, 3.0, PORCH_ROOF, 2.3, 10, 2, 0, false) // portico corners
    dome(sx * sxp, by, 2.9, SIDE_ROOF, 2.1, 8, 2, 0, false)
    for (let k = 0; k < 6; k++) dome(sx * sxp, IY0 + sb * (k + 0.5), 2.75, SIDE_ROOF, 2.1, 8, 2, 0, false)
  }
  // Central portal of the portico: a taller block with a raised dome.
  const x0 = -pb / 2, x1 = pb / 2
  prism(stone, rect(x0 - 0.4, x1 + 0.4, NY, IY0 + 0.6, 0.3), PORCH_ROOF - SLAB, F + 12.6)
  dome(0, fy + 0.3, 3.1, F + 12.6, 2.6, 12, 3, 1.4)
  // Far gate on the axis: a raised block with a dome.
  prism(stone, rect(x0 - 0.4, x1 + 0.4, IY1 - 0.6, CY + 0.6, 0.3), SIDE_ROOF - SLAB, F + 10.0)
  dome(0, by, 2.9, F + 10.0, 2.3, 10, 2, 1.2)
}

// Windows on the courtyard's outer walls, one per bay.
{
  const z0 = F + 1.0, z1 = F + 3.6
  for (let k = 0; k < 8; k++) {
    const y = NY + 2 + ((CY - NY - 4) * (k + 0.5)) / 8
    panel(win, [HX, y - 1.2], [HX, y + 1.2], z0, z1, [1, 0])
    panel(win, [-HX, y + 1.2], [-HX, y - 1.2], z0, z1, [-1, 0])
  }
  for (let k = 0; k < 9; k++) {
    const x = -HX + 2 + ((2 * HX - 4) * (k + 0.5)) / 9
    if (Math.abs(x) < 4.5) continue
    panel(win, [x + 1.2, CY], [x - 1.2, CY], z0, z1, [0, 1])
  }
}

// Şadırvan: a hexagonal domed kiosk on columns in the middle of the court.
{
  const c: XY = [0, (IY0 + IY1) / 2]
  for (const [x, y] of circle(c[0], c[1], 2.4, 6, Math.PI / 6)) prism(stone, circle(x, y, 0.4, 4, Math.PI / 4), 0, F + 3.6, false)
  prism(stone, circle(c[0], c[1], 3.2, 6, Math.PI / 6), F + 3.6, F + 4.4, true, true)
  dome(c[0], c[1], 2.6, F + 4.4, 2.1, 12, 2, 1.0)
}

// ---------------------------------------------------------------------------
// Minarets: four at the hall's corners with three şerefes, two at the far
// corners of the courtyard with two (Wikipedia; photos from the east and
// north-east confirm the count). Shafts drawn about 1.5 times the real
// diameter so they survive at phone size.

function minaret(cx: number, cy: number, ped: number, balconies: number[], capBase: number, tip: number) {
  const n = 8, R = 1.9
  // square pedestal up to the roofline, then a short polygonal transition
  prism(stone, rect(cx - 2.4, cx + 2.4, cy - 2.4, cy + 2.4), 0, ped)
  let z = ped
  for (const b of balconies) {
    revolve(stone, cx, cy, [[R, z], [R, b - 1.9]], n, 0, TAU, 'ring')
    // corbelled underside, parapet, and the floor ring back to the shaft
    revolve(stone, cx, cy, [[R, b - 1.9], [R + 1.35, b], [R + 1.35, b + 1.2], [R, b + 1.3]], n, 0, TAU, 'ring')
    z = b + 1.3
  }
  revolve(stone, cx, cy, [[R, z], [R * 0.92, capBase]], n, 0, TAU, 'ring')
  revolve(lead, cx, cy, [[R * 1.05, capBase], [0.3, tip - 2.9], [0, tip - 2.6]], n)
  alem(cx, cy, tip - 2.8, 2.8)
}
for (const sx of [-1, 1]) {
  minaret(sx * 30.6, -54.5, WALL + 1.5, [F + 21, F + 30.5, F + 40], F + 47.5, 64)
  minaret(sx * 30.4, -0.6, WALL + 1.5, [F + 21, F + 30.5, F + 40], F + 47.5, 64)
  minaret(sx * 31.2, 55.6, SIDE_ROOF + 1.5, [F + 24.5, F + 34], F + 44, 59)
}

// ---------------------------------------------------------------------------
// Write.

// The mosque is floodlit at night, stone and domes alike; faces looking up
// catch less of it.
const lit = (k: number) => (_p: V3, n: V3) => k * (n[2] > 0.9 ? 0.45 : 1)
const parts = [
  { part: stone, material: { ...finish('limestone', 0xe6e2d9), floodlight: lit(0.9) } },
  { part: lead, material: { ...finish('lead', 0x95a0ad), floodlight: () => 0.95 } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Sultan Ahmed Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 313.5, elevation: 0, height: 64,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-blue-mosque.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
