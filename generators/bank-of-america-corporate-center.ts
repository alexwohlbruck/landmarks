/**
 * Bank of America Corporate Center (1992, Cesar Pelli), Charlotte —
 * original procedural geometry, CC0-1.0.
 * bun generators/bank-of-america-corporate-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Placed at bearing 48.8°, so the tower's faces, which sit square to
 * Uptown's street grid, are square to this frame.
 *
 * Plan: a square core with a broad, slightly bowed slab standing proud of the
 * middle of each face. The corners between the slabs are re-entrant and
 * glazed. Going up, the core corners step in (161, 177 m) and the slabs step
 * back (177, 208, 224 m) without narrowing, so the plan becomes a stepped
 * cross; a silver-finned square band (224–235 m) carries a stepped crown of
 * silver rods in three rings, ending at 264 m.
 *
 * Sources: heights are OSM's building:parts, checked against lidar
 * (Mecklenburg 2016, USGS 3DEP NC Phase 4, 1 m): less the 6 m the lidar box's
 * lowest ground lies below the plaza, it reads 43, 162, 178, 208, 225 and
 * 267 m, every tier within a metre or two of OSM. Lidar also puts the tower
 * 2-4 m north-east of the anchor; the anchor is left as catalogued. Plan
 * dimensions were first measured from Google's photorealistic 3D renders
 * (slabs at ±24.6 m and 25 m wide); lidar confirms them (46-48 m across).
 * OSM's tier outlines trace the core corners, not the slabs, so they are used
 * for the core steps only. The crown's ring radii are from the elevation
 * silhouettes and Commons photos.
 *
 * What makes it recognisable, each drawn as plain geometry:
 * - the bullet-shaped top: setbacks stepping in to a crown of silver rods
 *   in rings, short and dense, brightest part of the tower (rods drawn
 *   wider and fewer than the real ones so they read on a phone);
 * - rows of silver rods along each setback's parapet (jbarreiros's and
 *   Kiran891's photos);
 * - the notched corners running up the shaft between the slabs: dark glass
 *   broken by granite bands, as the punched windows are;
 * - warm pale granite with dark punched windows, grouped per STYLE.md as one
 *   panel per window pair and three floors; a rose-granite base.
 *
 * Photos (Wikimedia Commons): "Bank of America, Charlotte NC (crop)"
 * (jbarreiros, CC BY 2.0); "Bank of America Corporate Center" (Nop, public
 * domain); "Bank of America Corporate Center, Charlotte, North Carolina
 * (5811071198)" (Ken Lund, CC BY-SA 2.0); "Bank of America Corporate Center
 * Charlotte NC" (Kiran891, CC BY-SA 4.0); "Bank of America Corporate Center
 * Charlotte" (kreg.steppe, CC BY 2.0); "BofA Corp Center" (Jt12081988, CC
 * BY-SA 4.0); "One South at the Plaza, Omni Hotel, Bank of America Corporate
 * Center, Truist Center, Ritz-Carlton" (Kiran891, CC BY-SA 4.0).
 *
 * Estimated: the rod counts and widths, the notch width (widened slightly so
 * the notch reads), the plinth's height and openings, the window pairs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

// The plinth is rose granite; the glazing shares the windows' material. The
// re-entrant corner notches are dark glass like the windows, cut by granite
// bands at every window group so they read as a notch, not a dark stripe.
// The crown's drums are a grey-blue glass that sets the bright rods off.
const granite = new Part(), base = new Part(), facade = new Part(), glass = facade
const silver = new Part(), steel = new Part(), terrace = new Part()

// ---------- helpers ----------

const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const add2 = (a: XY, b: XY, k = 1): XY => [a[0] + b[0] * k, a[1] + b[1] * k]
const at = (p: XY, z: number): V3 => [p[0], p[1], z]
const rot = (p: XY, s: number): XY => {
  let [x, y] = p
  for (let k = 0; k < s; k++) [x, y] = [-y, x]
  return [x, y]
}

/** A planar convex polygon, wound to face `hint`. */
function poly(part: Part, pts: V3[], hint: V3) {
  const a = pts[0], b = pts[1], c = pts[2]
  const n = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const p = n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < p.length - 1; i++) part.tri(p[0], p[i], p[i + 1])
}

/** Outward normal of a counter-clockwise edge. */
const outward = (a: XY, b: XY): XY => norm2([b[1] - a[1], -(b[0] - a[0])])

/** A plain wall over a ring edge. */
function wall(part: Part, a: XY, b: XY, z0: number, z1: number) {
  part.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
}

/**
 * A window band: the edge's wall with a full-height opening recessed `r`,
 * leaving `sill` and `head` of solid wall below and above.
 */
function band(a: XY, b: XY, z0: number, z1: number, sill: number, head: number, headPart = granite, r = .6) {
  const n = outward(a, b), ai = add2(a, n, -r), bi = add2(b, n, -r)
  const lo = z0 + sill, hi = z1 - head
  if (sill > 0) wall(headPart, a, b, z0, lo)
  if (head > 0) wall(headPart, a, b, hi, z1)
  wall(glass, ai, bi, lo, hi)
  const t = norm2([b[0] - a[0], b[1] - a[1]])
  poly(headPart, [at(a, lo), at(ai, lo), at(ai, hi), at(a, hi)], [t[0], t[1], 0])
  poly(headPart, [at(b, lo), at(bi, lo), at(bi, hi), at(b, hi)], [-t[0], -t[1], 0])
  if (sill > 0) poly(headPart, [at(a, lo), at(b, lo), at(bi, lo), at(ai, lo)], [0, 0, 1])
  if (head > 0) poly(headPart, [at(a, hi), at(b, hi), at(bi, hi), at(ai, hi)], [0, 0, -1])
}

/** A star-shaped ring capped by a fan from the origin. */
function cap(part: Part, ring: XY[], z: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    part.tri([0, 0, z], at(a, z), at(b, z))
  }
}

/**
 * A crown rod: a fin of triangular section standing on the wall at `p`,
 * facing `n`, from `z0` up to `z1` at its sides and `z1 + tip` at its front
 * ridge, so it ends in a point. Each side is one quad; the back faces the
 * wall and is left open. Four triangles a rod is what lets the tower carry
 * some four hundred of them inside the file budget.
 */
function fin(part: Part, p: XY, n: XY, z0: number, z1: number, tip: number, w = .8, d = 1.3) {
  const t: XY = [-n[1], n[0]]
  const b1 = add2(add2(p, t, -w / 2), n, -.2), b2 = add2(add2(p, t, w / 2), n, -.2), o = add2(p, n, d)
  for (const [a, b] of [[b1, o], [o, b2]] as [XY, XY][]) {
    const m = outward(a, b)
    const za = a === o ? z1 + tip : z1, zb = b === o ? z1 + tip : z1
    poly(part, [at(a, z0), at(b, z0), at(b, zb), at(a, za)], [m[0], m[1], 0])
  }
}

// ---------- the tower ----------

const W = 12.6      // slab half-width (25 m slabs on a 49 m face)
const BOW = .8      // how far a slab's middle stands proud of its ends
const CH = .6       // chamfer on every convex vertical edge
const SLAB_SEGS = 6  // facets across a bowed slab face

/**
 * Windows are slate panels on the granite (STYLE.md, Windows): one panel per
 * window pair, two floors tall, with the granite left showing between bays as
 * piers and between groups as spandrels; two floors a group, so a panel is
 * about as tall as two of the real window pairs and the face keeps its
 * punched look (taller groups read as stripes). Groups are counted from the ground,
 * so they line up across every face and tier.
 */
const FLOOR = 3.9, GROUP = 2 * FLOOR, SPANDREL = 2.4, PIER = 1.7, PROUD = .04

/** Window panels on the wall over a→b, `bays` across, standing just proud of it. */
function panels(a: XY, b: XY, z0: number, z1: number, bays: number, pier: number) {
  const n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < pier + 1.5) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], bay = L / bays
  for (let g = Math.floor(z0 / GROUP); g * GROUP < z1; g++) {
    const lo = Math.max(g * GROUP + SPANDREL / 2, z0 + 1), hi = Math.min((g + 1) * GROUP - SPANDREL / 2, z1 - 1)
    if (hi - lo < 3) continue
    for (let k = 0; k < bays; k++) {
      const p = add2(add2(a, t, k * bay + pier / 2), n, PROUD), q = add2(add2(a, t, (k + 1) * bay - pier / 2), n, PROUD)
      wall(facade, p, q, lo, hi)
    }
  }
}

/**
 * A run of wall edges that make one face: granite, with window panels. A
 * straight run is one wall split into bays about 4 m wide; a bowed slab's
 * facets take a panel each.
 */
function windowedFace(pts: XY[], z0: number, z1: number, bayW = 4.2) {
  pts.slice(1).forEach((b, i) => wall(granite, pts[i], b, z0, z1))
  const a = pts[0], b = pts[pts.length - 1]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const straight = pts.every((p) => Math.abs((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) < 1e-6 * L * L + 1e-9)
  if (straight) panels(a, b, z0, z1, Math.max(1, Math.round(L / bayW)), PIER)
  else pts.slice(1).forEach((q, i) => panels(pts[i], q, z0, z1, 1, PIER))
}

/**
 * Tier plans. `c` is the core corner and `n` the glazed notch cut out of it.
 * The notches are a little wider than main's seam so they read; `c` is set so that
 * 2c − n, the corner's reach in the diagonal views, matches the renders.
 */
type Tier = { z0: number; z1: number; P: number; c: number; n: number }
const tiers: Tier[] = [
  { z0: 42, z1: 161, P: 24.6, c: 20.7, n: 3.4 },
  { z0: 161, z1: 177, P: 24.6, c: 19.2, n: 3.0 },
  { z0: 177, z1: 208, P: 22.3, c: 18.0, n: 2.6 },
  { z0: 208, z1: 224, P: 19.5, c: 17.6, n: 2.2 },
]

type Kind = 'slab' | 'trim' | 'return' | 'core' | 'notch'
type Run = { pts: XY[]; kind: Kind }

/** One tier's ring as runs of edges (one run per face), counter-clockwise. */
function outline(P: number, c: number, n: number): Run[] {
  const yf = (x: number) => -(P - BOW * (x / W) ** 2)
  const side: Run[] = []
  const face: XY[] = []
  for (let k = 0; k <= SLAB_SEGS; k++) {
    const x = -(W - CH) + 2 * (W - CH) * k / SLAB_SEGS
    face.push([x, yf(x)])
  }
  side.push({ pts: face, kind: 'slab' })
  const end: XY = [W, yf(W) + CH]
  side.push({ pts: [face[SLAB_SEGS], end], kind: 'trim' })
  if (c > W + 1) {
    side.push({ pts: [end, [W, -c]], kind: 'return' })
    side.push({ pts: [[W, -c], [c - n, -c]], kind: 'core' })
    side.push({ pts: [[c - n, -c], [c - n, -c + n], [c, -c + n]], kind: 'notch' })
    side.push({ pts: [[c, -c + n], [c, -W]], kind: 'core' })
    side.push({ pts: [[c, -W], [P - BOW - CH, -W]], kind: 'return' })
  } else side.push({ pts: [end, [W, -W], [P - BOW - CH, -W]], kind: 'return' })
  // the next slab's chamfer, ending at that slab's first point
  side.push({ pts: [[P - BOW - CH, -W], rot(face[0], 1)], kind: 'trim' })
  const runs: Run[] = []
  for (let s = 0; s < 4; s++) for (const r of side) runs.push({ kind: r.kind, pts: r.pts.map((p) => rot(p, s)) })
  return runs
}

/** A row of rods along the parapet a→b, about `gap` apart, standing `h` above `z`. */
function rodRow(a: XY, b: XY, z: number, h: number, gap = 2.1) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / gap)), n = outward(a, b)
  for (let i = 0; i < k; i++) {
    const p: XY = [a[0] + (b[0] - a[0]) * (i + .5) / k, a[1] + (b[1] - a[1]) * (i + .5) / k]
    fin(silver, p, n, z - 3, z + h - 1.2, 1.2, .45, .8)
  }
}

function tierWalls(t: Tier, next: Tier | undefined, rods: boolean) {
  const runs = outline(t.P, t.c, t.n)
  for (const r of runs) {
    // a slab that carries on into the next tier has no parapet here
    const parapet = rods && !(r.kind === 'slab' && next?.P === t.P)
    if (r.kind === 'notch') {
      // dark glass in the window groups, granite bands between
      r.pts.slice(1).forEach((b, i) => {
        wall(granite, r.pts[i], b, t.z0, t.z1)
        panels(r.pts[i], b, t.z0, t.z1, 1, .5)
      })
    } else if (r.kind === 'trim') wall(granite, r.pts[0], r.pts[1], t.z0, t.z1)
    else windowedFace(r.pts, t.z0, t.z1)
    // the setback's comb of silver rods, along slab faces and their returns
    if (parapet && r.kind === 'slab') {
      r.pts.slice(1).forEach((b, i) => rodRow(r.pts[i], b, t.z1, 3.2))
    }
  }
  const ring = runs.flatMap((r) => r.pts.slice(0, -1))
  cap(terrace, ring, t.z1)
}

tiers.forEach((t, i) => tierWalls(t, tiers[i + 1], true))

// ---------- base, 0–42 m: a full square, the slabs' own width ----------
// A 12 m granite plinth with three tall glazed openings a face, then
// window panels up to 42 m.
{
  const H = 24.4, Z1 = 42, PLINTH = 12, DOOR = 2.2
  const ring: XY[] = []
  for (let s = 0; s < 4; s++) {
    const xs = [-(H - CH), -14 - DOOR, -14 + DOOR, -DOOR, DOOR, 14 - DOOR, 14 + DOOR, H - CH]
    const pts = xs.map((x) => rot([x, -H], s))
    pts.slice(1).forEach((b, i) => {
      if (i % 2) band(pts[i], b, 0, PLINTH, 0, 3, base, .8)
      else wall(base, pts[i], b, 0, PLINTH)
    })
    windowedFace(pts, PLINTH, Z1)
    const corner: [XY, XY] = [rot([H - CH, -H], s), rot([H, -H + CH], s)]
    wall(base, corner[0], corner[1], 0, PLINTH)
    wall(granite, corner[0], corner[1], PLINTH, Z1)
    ring.push(...pts)
  }
  cap(terrace, ring, Z1)
}

// ---------- the silver band, 224–235 m ----------
// A rounded square (a superellipse, |x|³ + |y|³ = S³): the renders show it
// ±17.3 m on the axes but only ≈19 m out on the diagonals, a curved band
// rather than a square with corners.
const S = 17.3, BAND_SEGS = 32
const BAND0 = 224, GLASS1 = 228.5, BAND1 = 235
const bandRing: XY[] = [], bandNormals: XY[] = []
for (let i = 0; i < BAND_SEGS; i++) {
  const a = (i + .5) / BAND_SEGS * 2 * Math.PI, c = Math.cos(a), sn = Math.sin(a)
  const k = S / Math.cbrt(Math.abs(c) ** 3 + Math.abs(sn) ** 3)
  const p: XY = [k * c, k * sn]
  bandRing.push(p)
  bandNormals.push(norm2([Math.sign(p[0]) * p[0] ** 2, Math.sign(p[1]) * p[1] ** 2]))
}
for (let i = 0; i < BAND_SEGS; i++) {
  const a = bandRing[i], b = bandRing[(i + 1) % BAND_SEGS]
  wall(glass, a, b, BAND0, GLASS1)
  wall(steel, a, b, GLASS1, BAND1)
}
cap(steel, bandRing, BAND1)
// rods at every vertex and every edge's middle; the four on the diagonals
// stand a little taller
bandRing.forEach((p, i) => {
  const q = bandRing[(i + 1) % BAND_SEGS]
  const m = norm2([p[0] + q[0], p[1] + q[1]]), k = S / Math.cbrt(Math.abs(m[0]) ** 3 + Math.abs(m[1]) ** 3)
  const mp: XY = [m[0] * k, m[1] * k]
  const diagonal = i % (BAND_SEGS / 4) === BAND_SEGS / 8 - 1 || i % (BAND_SEGS / 4) === BAND_SEGS / 8
  fin(silver, p, bandNormals[i], GLASS1 - 1, BAND1 - .5 + (diagonal ? 1.5 : 0), 1.2)
  fin(silver, mp, norm2([Math.sign(mp[0]) * mp[0] ** 2, Math.sign(mp[1]) * mp[1] ** 2]), GLASS1 - 1, BAND1 - .5, 1.2)
})

// ---------- the crown: rings of rods ----------
function ring(r: number, z0: number, z1: number, rods: number, rodTop: number, segs = 16) {
  const pts: XY[] = []
  for (let i = 0; i < segs; i++) {
    const a = (i + .5) / segs * 2 * Math.PI
    pts.push([r * Math.cos(a), r * Math.sin(a)])
  }
  for (let i = 0; i < segs; i++) wall(steel, pts[i], pts[(i + 1) % segs], z0, z1)
  cap(steel, pts, z1)
  for (let i = 0; i < rods; i++) {
    const a = i / rods * 2 * Math.PI, n: XY = [Math.cos(a), Math.sin(a)]
    fin(silver, [n[0] * r * .98, n[1] * r * .98], n, z0 + 1, rodTop, 2.4, .55, 1.1)
  }
}
// Rings of rods. The elevations step 14.4 m → 245, 11.4 m → 253, ≈7.5 m →
// 256 and a 5.2 m drum → 264; the top view shows another rim at ≈12.5 m.
const RINGS: [number, number, number, number][] = [
  // radius, wall top, rod top, rods
  [14.4, 240, 243.6, 48],
  [12.7, 243.5, 246.8, 42],
  [11.0, 248, 251.6, 36],
  [7.8, 252.5, 255.2, 28],
  [5.2, 259.5, 262.6, 22],
]
RINGS.forEach(([r, top, rod, n], i) => ring(r, i ? RINGS[i - 1][1] : BAND1, top, n, rod, i > 2 ? 12 : 16))

// ---------- write ----------
// Identity colours, muted to the palette's lightness: the warm pale granite,
// the rose-granite plinth and the bright silver crown.
const parts = [
  { part: granite, material: finish('boa-granite', 0xecdfd4) },
  { part: base, material: finish('boa-rose', 0xd9b2a4) },
  { part: facade, material: PALETTE.window },
  { part: silver, material: finish('boa-silver', 0xf6f8f9, .4) },
  { part: steel, material: { ...PALETTE.glass, color: 0x91a7b8 } },
  { part: terrace, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bank of America Corporate Center', parts, {
  license: 'CC0-1.0', bearing: 48.8, elevation: 0, height: 264,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/341587198', 'way/341587200', 'way/341587199', 'way/341587201', 'way/341587202', 'way/341587204', 'way/766639185', 'way/341587207', 'way/341587210', 'way/766639186', 'way/341587214'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/bank-of-america-corporate-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
