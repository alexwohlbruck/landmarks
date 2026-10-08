/**
 * Bank of America Corporate Center (1992, Cesar Pelli), Charlotte —
 * original procedural geometry, CC0-1.0.
 * bun generators/bank-of-america-corporate-center.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Placed at bearing 48.8°, so the tower's faces, which sit square to
 * Uptown's street grid, are square to this frame.
 *
 * What makes it itself, and what this model keeps:
 *  1. a cross plan: a broad, gently bowed slab of pale rose granite proud of
 *     the middle of each face, square core corners between them, a narrow
 *     glazed notch in each re-entrant corner;
 *  2. a taper in setbacks near the top, slabs and corners stepping at
 *     different heights, so the top reads as a rounded "bullet";
 *  3. a short silver coronet: concentric rings of pointed rods on a stepped
 *     drum, the innermost ring tallest;
 *  4. punched windows in granite: here broad slate panels, one per bay and
 *     three floors, with the granite showing as piers and spandrels;
 *  5. a darker rose granite plinth with a tall glazed entrance on each slab.
 *
 * Evidence (2026 rework):
 *  - Lidar: USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m DSM in this frame,
 *    folded over the plan's eight symmetries. The plaza round the tower is
 *    5.4–6.7 m above the cloud's lowest point (a stair pit), so heights here
 *    are lidar minus 5.9 m, the lowest real ground at the footprint.
 *    Measured: base corners 42; core corners 162 out to ±21.5; slabs 177,
 *    out to 26.3 on the axis and 24.5 at their edges (a 1.5–2 m bow), 27 m
 *    wide; core corners stepped to ±18.7 up to 196, then ±16.5; slabs
 *    stepped to 22.5 (to 208) and 20.3 (to 224); a rounded band to ≈19 m out
 *    with rods to 238; crown rods at r ≈ 14.5 → 249, 11.5 → 255, 7.5 → 260,
 *    4.5 → 266, round a flat centre at 253. These agree with OSM's
 *    building:part heights (161, 177, 208, 224, 235 … 264) to about a metre.
 *  - Published: 265.5 m (871 ft) to the top, 60 floors (Wikipedia, CTBUH).
 *    The lidar's rod tips at 266 are taken as that top.
 *  - OSM: way/341587198 and its parts give the footprint (±24.4 m, the base
 *    square) and the part heights above.
 *  - Photos (Wikimedia Commons, all checked by eye): jbarreiros, "Bank of
 *    America, Charlotte NC (crop)" CC BY 2.0 (diagonal elevation);
 *    Nop, "Bank of America Corporate Center" public domain (crown close-up);
 *    Ken Lund, "... (5811071198)" CC BY-SA 2.0 (notches, taper);
 *    Kiran891, "Bank of America Corporate Center Charlotte NC" and "...,
 *    North Carolina" CC BY-SA 4.0 (plinth, plaza and Tryon sides);
 *    kreg.steppe, "Bank of America Corporate Center Charlotte" CC BY 2.0;
 *    Jt12081988, "BofA Corp Center" CC BY-SA 4.0 (aerial, plan and crown).
 *  - Estimated: the notch width (1.5 m, below the lidar's resolution), the
 *    plinth height (14 m) and entrance size, bay counts from the photos.
 *
 * Earlier versions measured the plan from Google's 3D renders; this one is
 * rebuilt from lidar, OSM and licensed photos only, and nothing in it rests
 * on commercial imagery.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

const granite = new Part(), plinth = new Part(), facade = new Part()
const silver = new Part(), crownGlass = new Part(), terrace = new Part()

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

/** A star-shaped ring capped by a fan from the origin. */
function cap(part: Part, ring: XY[], z: number) {
  for (let i = 0; i < ring.length; i++) part.tri([0, 0, z], at(ring[i], z), at(ring[(i + 1) % ring.length], z))
}

/**
 * A crown rod: a slim fin of triangular section standing on the wall at `p`,
 * facing `n`, from `z0` to `z1` and then a short point. Its back faces the
 * drum and is left open, which keeps a few hundred rods inside the budget.
 */
function fin(part: Part, p: XY, n: XY, z0: number, z1: number, tip: number, w = .6, d = 1.1, lean = 0) {
  // `p` is the wall's face: the rod sits inside it, its nose flush, so nothing
  // stands proud of the face below. `lean` tips the rod inward by its top.
  const t: XY = [-n[1], n[0]], q = add2(p, n, -d)
  const b1 = add2(add2(q, t, -w / 2), n, -.2), b2 = add2(add2(q, t, w / 2), n, -.2), o = add2(q, n, d)
  const up = (a: XY): XY => add2(a, n, -lean)
  const ap = up(add2(q, n, d * .3)), apex: V3 = [ap[0], ap[1], z1 + tip]
  for (const [a, b] of [[b1, o], [o, b2]] as [XY, XY][]) {
    const m = outward(a, b)
    poly(part, [at(a, z0), at(b, z0), at(up(b), z1), at(up(a), z1)], [m[0], m[1], 0])
    poly(part, [at(up(a), z1), at(up(b), z1), apex], [m[0], m[1], .5])
  }
}

// ---------- windows ----------

/**
 * Broad slate panels on the granite (STYLE.md, Windows): one per bay, three
 * floors tall, granite left between bays as piers and between groups as
 * spandrels. The photos show punched windows about two to a panel's width.
 * Groups are counted up from the plinth, so they line up across every face
 * and tier.
 */
const PLINTH = 14, FLOOR = 3.9, GROUP = 3 * FLOOR, SPANDREL = 3.0, PIER = 2.2, PROUD = .04

function panels(a: XY, b: XY, z0: number, z1: number, bays: number, pier = PIER) {
  const n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
  // narrow faces up the taper keep a slimmer panel rather than going blank
  if (L / bays < pier + 1.6) pier = Math.min(pier, L / bays * .35)
  if (L / bays < 1.5) return
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], bay = L / bays
  for (let g = Math.floor((z0 - PLINTH) / GROUP); PLINTH + g * GROUP < z1; g++) {
    const lo = Math.max(PLINTH + g * GROUP + SPANDREL / 2, z0 + 1.2)
    const hi = Math.min(PLINTH + (g + 1) * GROUP - SPANDREL / 2, z1 - 1.2)
    if (hi - lo < 2.6) continue // short panels at tier breaks keep the windows running up the taper
    for (let k = 0; k < bays; k++) {
      const p = add2(add2(a, t, k * bay + pier / 2), n, PROUD), q = add2(add2(a, t, (k + 1) * bay - pier / 2), n, PROUD)
      wall(facade, p, q, lo, hi)
    }
  }
}

/** A run of edges that make one face: granite, with panels. */
function windowedFace(pts: XY[], z0: number, z1: number, bayW = 5.4) {
  pts.slice(1).forEach((b, i) => wall(granite, pts[i], b, z0, z1))
  const a = pts[0], b = pts[pts.length - 1]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (pts.length === 2) panels(a, b, z0, z1, Math.max(1, Math.round(L / bayW)))
  else pts.slice(1).forEach((q, i) => panels(pts[i], q, z0, z1, 1))
}

// ---------- the shaft ----------

const W = 13.5       // slab half-width: 27 m slabs (lidar)
const CH = .6        // chamfer on every convex vertical edge
const SLAB_SEGS = 5  // facets across a bowed slab: one window bay each
const NOTCH = 1.5    // the glazed notch in each re-entrant corner

/**
 * Tiers, from the lidar. `P` is how far the slab's middle stands out, `bow`
 * how much further than its edges; `c` is the core corner, `n` its notch
 * (0 for a plain chamfered corner).
 */
type Tier = { z0: number; z1: number; P: number; bow: number; c: number; n: number; ch: number }
// `ch` grows up the taper so the corners round off towards the top, as the
// photos show; the bow deepens a little for the same reason.
const tiers: Tier[] = [
  { z0: 0, z1: 42, P: 26.0, bow: 1.5, c: 23.6, n: 0, ch: CH },
  { z0: 42, z1: 161, P: 26.0, bow: 1.5, c: 21.5, n: NOTCH, ch: CH },
  { z0: 161, z1: 177, P: 26.0, bow: 1.5, c: 18.7, n: NOTCH, ch: .9 },
  { z0: 177, z1: 196, P: 22.6, bow: 1.4, c: 18.7, n: NOTCH, ch: 1.4 },
  { z0: 196, z1: 208, P: 22.6, bow: 1.6, c: 16.6, n: 0, ch: 2.0 },
  { z0: 208, z1: 224, P: 20.4, bow: 1.8, c: 16.6, n: 0, ch: 2.6 },
]

type Kind = 'slab' | 'trim' | 'return' | 'core' | 'notch'
type Run = { pts: XY[]; kind: Kind }

/** One tier's ring as runs of edges (one run per face), counter-clockwise. */
function outline(t: Tier): Run[] {
  const { P, bow, c, n, ch: CH } = t
  const yf = (x: number) => -(P - bow * (x / W) ** 2)
  const face: XY[] = []
  for (let k = 0; k <= SLAB_SEGS; k++) {
    const x = -(W - CH) + 2 * (W - CH) * k / SLAB_SEGS
    face.push([x, yf(x)])
  }
  const side: Run[] = [{ pts: face, kind: 'slab' }]
  const end: XY = [W, yf(W) + CH]
  side.push({ pts: [face[SLAB_SEGS], end], kind: 'trim' })
  side.push({ pts: [end, [W, -c]], kind: 'return' })
  if (n > 0) {
    side.push({ pts: [[W, -c], [c - n, -c]], kind: 'core' })
    side.push({ pts: [[c - n, -c], [c - n, -c + n], [c, -c + n]], kind: 'notch' })
    side.push({ pts: [[c, -c + n], [c, -W]], kind: 'core' })
  } else {
    side.push({ pts: [[W, -c], [c - CH, -c]], kind: 'core' })
    side.push({ pts: [[c - CH, -c], [c, -c + CH]], kind: 'trim' })
    side.push({ pts: [[c, -c + CH], [c, -W]], kind: 'core' })
  }
  const end2: XY = [yf(W) * -1 - CH, -W]
  side.push({ pts: [[c, -W], end2], kind: 'return' })
  side.push({ pts: [end2, rot(face[0], 1)], kind: 'trim' })
  const runs: Run[] = []
  for (let s = 0; s < 4; s++) for (const r of side) runs.push({ kind: r.kind, pts: r.pts.map((p) => rot(p, s)) })
  return runs
}

/** Does this run's wall carry straight on into the next tier? */
function continues(r: Run, t: Tier, next?: Tier) {
  if (!next) return false
  if (r.kind === 'slab') return next.P === t.P
  if (r.kind === 'core' || r.kind === 'notch') return next.c === t.c && next.n === t.n
  return next.P === t.P && next.c === t.c
}

const HEAD = 2.5 // the silver parapet where a tier steps back

function tierWalls(t: Tier, next: Tier | undefined) {
  const runs = outline(t)
  for (const r of runs) {
    const head = t.z0 >= 161 && !continues(r, t, next) ? HEAD : 0
    const top = t.z1 - head, z0 = t.z0
    // The plinth: darker granite to 14 m, a tall glazed entrance in the
    // middle facet of each slab.
    if (z0 === 0) {
      r.pts.slice(1).forEach((b, i) => {
        const a = r.pts[i]
        if (r.kind === 'slab' && i === Math.floor(SLAB_SEGS / 2)) {
          const n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1]), tt: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
          wall(plinth, a, b, 0, PLINTH)
          wall(facade, add2(add2(a, tt, .9), n, PROUD), add2(add2(b, tt, -.9), n, PROUD), 0, PLINTH - 2.5)
        } else wall(plinth, a, b, 0, PLINTH)
      })
    }
    const zf = Math.max(z0, PLINTH)
    if (r.kind === 'trim') wall(granite, r.pts[0], r.pts[1], zf, top)
    else if (r.kind === 'notch') {
      // the notch's two short walls share a panel per group: a glazed seam
      // broken by spandrels, as the photos show it, not a stripe
      r.pts.slice(1).forEach((b, i) => { wall(granite, r.pts[i], b, zf, top); panels(r.pts[i], b, zf, top, 1, .3) })
    } else windowedFace(r.pts, zf, top)
    if (head) r.pts.slice(1).forEach((b, i) => wall(silver, r.pts[i], b, top, t.z1))
    // Where a slab steps back, a palisade of silver rods stands on its
    // parapet (Nop's crown close-up shows it on every upper slab step): two
    // per window bay, rising a little past the parapet.
    if (head && r.kind === 'slab') r.pts.slice(1).forEach((b, i) => {
      const a = r.pts[i], n = outward(a, b)
      for (const f of [.25, .75]) fin(silver, add2(a, [b[0] - a[0], b[1] - a[1]], f), n, top - 2, t.z1 + 1, 1.2, .5, .6)
    })
  }
  cap(terrace, runs.flatMap((r) => r.pts.slice(0, -1)), t.z1)
}

tiers.forEach((t, i) => tierWalls(t, tiers[i + 1]))

// ---------- the band, 224–230 m ----------
// A rounded square (|x|^4.5 + |y|^4.5 = S^4.5): the lidar puts it ≈19 m out
// on the axes and 16.3 m along each axis on the diagonals, flush with the
// tier's corners. It is kept low and leans inward, glazed behind a ring of
// silver rods, so the top tier rolls over into the coronet instead of
// standing as a collar under it.
const S = 19, EXP = 4.5, BAND_SEGS = 32
const BAND0 = 224, BAND1 = 230, BAND_IN = .9
const sq = (a: number, s = S): XY => {
  const c = Math.cos(a), sn = Math.sin(a)
  const k = s / (Math.abs(c) ** EXP + Math.abs(sn) ** EXP) ** (1 / EXP)
  return [k * c, k * sn]
}
const sqNormal = (p: XY): XY => norm2([Math.sign(p[0]) * Math.abs(p[0]) ** (EXP - 1), Math.sign(p[1]) * Math.abs(p[1]) ** (EXP - 1)])
const bandLo: XY[] = [], bandHi: XY[] = []
for (let i = 0; i < BAND_SEGS; i++) {
  const a = (i + .5) / BAND_SEGS * 2 * Math.PI
  bandLo.push(sq(a)); bandHi.push(sq(a, S * BAND_IN))
}
for (let i = 0; i < BAND_SEGS; i++) {
  const j = (i + 1) % BAND_SEGS
  crownGlass.quad(at(bandLo[i], BAND0), at(bandLo[j], BAND0), at(bandHi[j], BAND1), at(bandHi[i], BAND1))
}
cap(silver, bandHi, BAND1)
const BAND_LEAN = S * (1 - BAND_IN) / (BAND1 - BAND0)
for (let i = 0; i < BAND_SEGS; i++) {
  const p = sq((i + 1) / BAND_SEGS * 2 * Math.PI)
  fin(silver, p, sqNormal(p), BAND0 + .3, 233.5, 1.5, .6, 1.1, BAND_LEAN * (233.5 - BAND0))
}

// ---------- the coronet: rings of rods on a stepped, domed drum ----------
// Each drum leans in as it rises and its rods lean with it, so the rod tips
// trace the rounded bullet the photos show.
function ring(r: number, z0: number, z1: number, rods: number, rodTop: number, tip: number, segs = 16, w = .6) {
  const rt = r * .92, lean = (r - rt) / (z1 - z0)
  const lo: XY[] = [], hi: XY[] = []
  for (let i = 0; i < segs; i++) {
    const a = (i + .5) / segs * 2 * Math.PI
    lo.push([r * Math.cos(a), r * Math.sin(a)]); hi.push([rt * Math.cos(a), rt * Math.sin(a)])
  }
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % segs
    crownGlass.quad(at(lo[i], z0), at(lo[j], z0), at(hi[j], z1), at(hi[i], z1))
  }
  cap(crownGlass, hi, z1)
  for (let i = 0; i < rods; i++) {
    const a = i / rods * 2 * Math.PI, n: XY = [Math.cos(a), Math.sin(a)]
    fin(silver, [n[0] * r, n[1] * r], n, z0 + .5, rodTop - tip, tip, w, 1.1, lean * (rodTop - tip - z0))
  }
}
// radius, drum top, rods, rod tip — rod tips at the lidar's heights
const RINGS: [number, number, number, number][] = [
  [14.6, 242, 36, 249],
  [11.6, 248, 28, 255],
  [7.6, 252, 20, 260],
  [4.6, 253, 12, 265.5],
]
RINGS.forEach(([r, top, n, tipZ], i) => ring(r, i ? RINGS[i - 1][1] : BAND1, top, n, tipZ, i === 3 ? 2.5 : 1.8, i > 1 ? 12 : 16, i === 3 ? .7 : .6))

// ---------- write ----------
// Identity colours from the daylight photos, pulled to the palette's
// lightness: pale rose-beige granite, the plinth's darker rose, silver rods.
const parts = [
  { part: granite, material: finish('boa-granite', 0xede3da) },
  { part: plinth, material: finish('boa-plinth', 0xd8c3bb) },
  { part: facade, material: PALETTE.window },
  { part: silver, material: finish('boa-silver', 0xe6eaec, .5) },
  { part: crownGlass, material: finish('boa-crown-glass', 0xd5e1e8, .3) }, // pale, so the silver rods read as one bright crown
  { part: terrace, material: PALETTE.roof },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bank of America Corporate Center', parts, {
  license: 'CC0-1.0', bearing: 48.8, elevation: 0, height: 265.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/341587198', 'way/341587200', 'way/341587199', 'way/341587201', 'way/341587202', 'way/341587204', 'way/766639185', 'way/341587207', 'way/341587210', 'way/766639186', 'way/341587214'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/bank-of-america-corporate-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
