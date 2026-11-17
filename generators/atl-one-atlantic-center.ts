/**
 * One Atlantic Center (IBM Tower), Atlanta (1987, Johnson/Burgee Architects
 * with Heery & Heery) — original procedural geometry, CC0-1.0.
 * bun generators/atl-one-atlantic-center.ts [out.glb]
 *
 * This file also holds the small kit the other B3 Midtown towers import
 * (atl-1180-peachtree, atl-promenade-ii): walls over ring edges, bevelled
 * prisms, polygon caps, window panels grouped across storeys, pyramids and
 * pinnacles. The tower's own build runs only when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/39450314,
 * 33.787081, -84.387369. Bearing 0: the outline is square to the compass.
 *
 * Identity (Commons photos below): a 50-storey pink-beige granite shaft,
 * square with a broad projecting bay on each face and the corners cut back
 * and chamfered, strong vertical piers with dark window strips grouped two
 * storeys at a time; a row of tall round-arched windows under the parapet;
 * gothic gablets and pinnacles round the parapet and round a second,
 * smaller stone tier; a plain stone block; then a steep copper pyramid,
 * weathered green-grey, with a gilded open lantern and spike at the apex.
 * At night the pyramid and the crown tiers are floodlit warm white
 * (thombo2's and Royian's night photos), so they carry `_FLOODLIGHT`.
 *
 * Evidence:
 *  - plan: OSM way/39450314 (projecting bays ±25.9 m, 29.6 m wide; corner
 *    faces at ±23.8 m with a 4.3 m chamfer), symmetrised; the pyramid's
 *    base from OSM part way/1425865538 (±16.8 m).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid, measured above the street round the tower (282.0 m; the site is
 *    flat, Mapterhorn 281.5–283 m under the footprint): shaft parapet
 *    191.6 m, gablet tips to about 207 m, second tier 201 m (±21 m), stone
 *    block 212 m (±16.8 m), pyramid sides rising at 1.9:1 to an apex at
 *    242 m, lantern and spike to 250.3 m. Published height 249.9 m (820 ft,
 *    Wikipedia, CTBUH), 50 floors; OSM height 250.
 *  - lantern 242–250 m: lidar tip, its shape from AtlChampion's photos.
 *  - bay rhythm (five bays on a projecting bay, one on each corner face and
 *    chamfer), the arched top storeys and the pinnacle count: estimated
 *    from AtlChampion's photos.
 *  - colours: granite #d9c2b0-ish in sun in every daylight photo, pulled to
 *    the palette's lightness; copper weathered green-grey; gilt lantern.
 *  - y = 0 is the street round the tower; elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - AOneAtlanticCenterMT2511-0835.jpg, AtlChampion, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:AOneAtlanticCenterMT2511-0835.jpg
 *    (from the west-north-west, high: crown, pinnacles, bays)
 *  - AOneAtlanticCenterMT2511-0307.jpg, AtlChampion, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:AOneAtlanticCenterMT2511-0307.jpg
 *  - Promenade_2,_One_Atlantic_Center.jpg, AAK, public domain
 *    https://commons.wikimedia.org/wiki/File:Promenade_2,_One_Atlantic_Center.jpg
 *    (from the west, with Promenade II and Regions Plaza)
 *  - One_Atlantic_Center.jpg, Atlantacitizen, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:One_Atlantic_Center.jpg (street)
 *  - Atlanta_at_night.jpg, Royian, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Atlanta_at_night.jpg (night)
 *  - "Midtown Atlanta at Night", thombo2, CC BY 2.0
 *    https://www.flickr.com/photos/17383471@N00/180785520 (dusk, floodlit
 *    pyramid)
 * USGS NAIP for the roof. No look-only sources. No commercial imagery.
 *
 * Doubts: the lidar has few returns on the south half of the roof, so the
 * crown is mirrored from the north half. The gablets are drawn as plain
 * square pinnacles; the arched entrance and the darker granite plinth are
 * left out. Window bays are counted from two photos of the south and west
 * faces; the north and east faces are assumed the same (the tower is
 * symmetric in plan).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ─────────────────────────────── shared kit ───────────────────────────────

export type XY = [number, number]
export const at = (p: XY, z: number): V3 => [p[0], p[1], z]
export const rot90 = (p: XY, k: number): XY => {
  let [x, y] = p
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) [x, y] = [-y, x]
  return [x, y]
}
const nrm2 = (v: XY): XY => {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}
/** Outward normal of an edge of a counter-clockwise ring. */
export const outward = (a: XY, b: XY): XY => nrm2([b[1] - a[1], a[0] - b[0]])
export const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
export const add2 = (a: XY, v: XY, k = 1): XY => [a[0] + v[0] * k, a[1] + v[1] * k]

/** A vertical quad over edge a→b of a counter-clockwise ring, facing out. */
export function wall(p: Part, a: XY, b: XY, z0: number, z1: number) {
  p.quad(at(a, z0), at(b, z0), at(b, z1), at(a, z1))
}

/** Walls round a whole counter-clockwise ring. */
export function ringWalls(p: Part, ring: XY[], z0: number, z1: number) {
  ring.forEach((a, i) => wall(p, a, ring[(i + 1) % ring.length], z0, z1))
}

/** A flat cap over a simple counter-clockwise polygon (ear clipping). */
export function capPoly(p: Part, ring: XY[], z: number, up = true) {
  const idx = ring.map((_, i) => i)
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) > 1e-9 && cr(b, c, q) > 1e-9 && cr(c, a, q) > 1e-9
  const emit = (a: XY, b: XY, c: XY) => (up ? p.tri(at(a, z), at(b, z), at(c, z)) : p.tri(at(a, z), at(c, z), at(b, z)))
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k - 1 + idx.length) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = ring[ia], b = ring[ib], c = ring[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(ring[j], a, b, c))) continue
      emit(a, b, c)
      idx.splice(k, 1)
      cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) emit(ring[idx[0]], ring[idx[1]], ring[idx[2]])
}

/** A mitred offset of a counter-clockwise ring; d < 0 shrinks it. */
export function offset(ring: XY[], d: number): XY[] {
  const n = ring.length
  return ring.map((q, i) => {
    const a = ring[(i - 1 + n) % n], b = ring[(i + 1) % n]
    const n1 = outward(a, q), n2 = outward(q, b)
    const m = nrm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [q[0] + m[0] * k, q[1] + m[1] * k] as XY
  })
}

/** A solid prism with a bevelled top edge (STYLE.md), its roof in `top`. */
export function prism(p: Part, ring: XY[], z0: number, z1: number, top: Part = p, bev = 0.5) {
  const inner = offset(ring, -bev)
  ringWalls(p, ring, z0, z1 - bev)
  p.loft([ring.map((q) => at(q, z1 - bev)), inner.map((q) => at(q, z1))])
  capPoly(top, inner, z1, true)
}

/** A pyramid over a convex counter-clockwise ring to an apex. */
export function pyramid(p: Part, ring: XY[], z0: number, apex: V3) {
  ring.forEach((a, i) => p.tri(at(a, z0), at(ring[(i + 1) % ring.length], z0), apex))
}

/** A square pinnacle: a short shaft and a pointed cap, `s` across. */
export function pinnacle(p: Part, c: XY, z0: number, h: number, s: number, shaft = 0.35) {
  const r = s / 2
  const sq: XY[] = [[c[0] - r, c[1] - r], [c[0] + r, c[1] - r], [c[0] + r, c[1] + r], [c[0] - r, c[1] + r]]
  const zs = z0 + h * shaft
  if (shaft > 0) ringWalls(p, sq, z0, zs)
  pyramid(p, sq, zs, [c[0], c[1], z0 + h])
}

export type Bands = {
  /** Height of one panel group (two or three storeys) and the spandrel between groups. */
  group: number
  spandrel: number
  /** Window bays across the edge and the pier left between them. */
  bays: number
  pier: number
  /** Where the grouping starts, so groups line up across faces. */
  origin?: number
}

/** Slate panels standing just proud of the wall over a→b, between z0 and z1. */
export function panels(p: Part, a: XY, b: XY, z0: number, z1: number, o: Bands, proud = 0.05) {
  const n = outward(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const bay = L / o.bays
  const g0 = o.origin ?? 0
  for (let g = Math.floor((z0 - g0) / o.group); g0 + g * o.group < z1; g++) {
    const lo = Math.max(g0 + g * o.group + o.spandrel / 2, z0 + 0.6)
    const hi = Math.min(g0 + (g + 1) * o.group - o.spandrel / 2, z1 - 0.6)
    if (hi - lo < 1.5) continue
    for (let k = 0; k < o.bays; k++) {
      const s = (k * bay + o.pier / 2) / L, e = ((k + 1) * bay - o.pier / 2) / L
      if (e <= s) continue
      wall(p, add2(lerp2(a, b, s), n, proud), add2(lerp2(a, b, e), n, proud), lo, hi)
    }
  }
}

/** One round-headed window panel: a rectangle to `spring` and a semicircle on it. */
export function archPanel(p: Part, a: XY, b: XY, lo: number, spring: number, segs = 8, proud = 0.05) {
  const n = outward(a, b)
  const A = add2(a, n, proud), B = add2(b, n, proud)
  wall(p, A, B, lo, spring)
  const m = lerp2(A, B, 0.5), r = Math.hypot(B[0] - A[0], B[1] - A[1]) / 2
  const t = nrm2([B[0] - A[0], B[1] - A[1]])
  for (let i = 0; i < segs; i++) {
    const a0 = Math.PI * i / segs, a1 = Math.PI * (i + 1) / segs
    const q0 = add2(m, t, r * Math.cos(a0)), q1 = add2(m, t, r * Math.cos(a1))
    // counter-clockwise seen from outside: centre, then the right-hand point, then the left
    p.tri(at(m, spring), at(q0, spring + r * Math.sin(a0)), at(q1, spring + r * Math.sin(a1)))
  }
}

export function triangles(parts: Array<{ part: Part }>) {
  return parts.reduce((n, { part }) => n + part.triangles, 0)
}

export async function write(id: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, extras: Record<string, unknown>, maxTris = 5000) {
  const tris = triangles(parts)
  if (tris > maxTris) throw new Error(`Triangle budget exceeded: ${tris}`)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ─────────────────────────────── the tower ───────────────────────────────

function build() {
  const granite = new Part(), trim = new Part(), glass = new Part()
  const copper = new Part(), gold = new Part(), roof = new Part()

  // Plan: projecting bays at ±A, W either side of the axis; corner faces at
  // ±B, chamfered by K. One side's run, rotated round the four faces.
  const A = 25.9, W = 14.8, B = 23.8, K = 4.3
  const side: XY[] = [[A, -W], [A, W], [B, W], [B, B - K], [B - K, B], [W, B]]
  const ring: XY[] = []
  for (let s = 0; s < 4; s++) ring.push(...side.map((q) => rot90(q, s)))

  const PARAPET = 191.6, TIER2 = 201, BLOCK = 212, APEX = 242, TIP = 250.3
  const FLOOR = 3.83, ARCH0 = PARAPET - 3 * FLOOR - 1.4 // the arched top storeys
  const bands: Bands = { group: 2 * FLOOR, spandrel: 1.7, bays: 1, pier: 1.6, origin: 4.4 }

  // Shaft walls and windows, face by face.
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    wall(granite, a, b, 0, PARAPET)
    const kind = i % 6 // 0 bay face, 1 return, 2 corner face, 3 chamfer, 4 corner face, 5 return
    if (kind === 1 || kind === 5) continue // 2.1 m returns stay plain stone
    const bays = kind === 0 ? 5 : 1
    const pier = kind === 0 ? 3.0 : 1.8
    // ground floor: tall lobby glazing
    panels(glass, a, b, 0, 9.5, { group: 9.5, spandrel: 0, bays, pier: pier + 0.6 })
    panels(glass, a, b, 12.2, kind === 0 ? ARCH0 : PARAPET - 4, { ...bands, bays, pier })
    if (kind === 0) {
      // the arcade of round-headed windows under the parapet, one per bay
      const n = outward(a, b)
      void n
      for (let k = 0; k < bays; k++) {
        const s = (k * L / bays + pier / 2) / L, e = ((k + 1) * L / bays - pier / 2) / L
        const p0 = lerp2(a, b, s), p1 = lerp2(a, b, e)
        const r = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2
        archPanel(glass, p0, p1, ARCH0 + 1.2, PARAPET - 2.2 - r)
      }
    }
  }
  // parapet cornice: a bevelled lip just inside the walls, and the roof
  const lip = offset(ring, 0.35)
  ringWalls(trim, lip, PARAPET - 1.4, PARAPET - 0.6)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], c = lip[i], d = lip[(i + 1) % ring.length]
    trim.quad(at(a, PARAPET - 1.7), at(b, PARAPET - 1.7), at(d, PARAPET - 1.4), at(c, PARAPET - 1.4)) // soffit chamfer
    trim.quad(at(c, PARAPET - 0.6), at(d, PARAPET - 0.6), at(b, PARAPET), at(a, PARAPET))
  }
  capPoly(roof, ring, PARAPET)

  // Gablets and pinnacles round the parapet: on every bay pier of the
  // projecting bays, at the bay's ends, and at the chamfer's ends.
  for (let s = 0; s < 4; s++) {
    for (let k = 0; k <= 5; k++) {
      const y = -W + (2 * W) * k / 5
      pinnacle(trim, rot90([A - 1.2, y], s), PARAPET, k === 0 || k === 5 ? 10 : 7.5, 1.9)
    }
    pinnacle(trim, rot90([B - 1.1, B - K + 0.3], s), PARAPET, 9, 1.9)
    pinnacle(trim, rot90([B - K + 0.3, B - 1.1], s), PARAPET, 9, 1.9)
  }

  // Second tier: a chamfered square, ±21 m, with a row of small arched
  // windows and pinnacles at its corners.
  const T = 21, TK = 4
  const t2: XY[] = []
  for (let s = 0; s < 4; s++) t2.push(rot90([T, -(T - TK)], s), rot90([T, T - TK], s))
  prism(granite, t2, PARAPET - 1, TIER2, roof, 0.5)
  t2.forEach((a, i) => {
    const b = t2[(i + 1) % t2.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 8) return
    const n = 6
    for (let k = 0; k < n; k++) {
      const s = (k + 0.25) / n, e = (k + 0.75) / n
      archPanel(glass, lerp2(a, b, s), lerp2(a, b, e), PARAPET + 1.2, TIER2 - 3.6, 6)
    }
  })
  for (let s = 0; s < 4; s++) {
    pinnacle(trim, rot90([T - 1.3, T - TK + 0.2], s), TIER2, 7, 1.7)
    pinnacle(trim, rot90([T - TK + 0.2, T - 1.3], s), TIER2, 7, 1.7)
    pinnacle(trim, rot90([T - 1.1, 0], s), TIER2, 6, 1.6)
  }

  // The plain stone block under the pyramid, with a cornice.
  const S = 16.8
  const sq = (h: number): XY[] => [[-h, -h], [h, -h], [h, h], [-h, h]]
  prism(granite, sq(S), TIER2 - 1, BLOCK - 0.8, roof, 0.4)
  prism(trim, sq(S + 0.5), BLOCK - 0.8, BLOCK, roof, 0.3)

  // The copper pyramid, eaves a little proud of the block.
  pyramid(copper, sq(S + 0.4), BLOCK, [0, 0, APEX])
  // gilt hip rolls: a thin ridge strip down each hip, visible in every photo
  for (let s = 0; s < 4; s++) {
    const c = rot90([S + 0.4, S + 0.4], s), n = nrm2(rot90([1, 1], s))
    const t: XY = [-n[1] * 0.35, n[0] * 0.35]
    const lo1 = add2(c, t), lo2 = add2(c, t, -1)
    gold.tri([lo1[0] + n[0] * 0.15, lo1[1] + n[1] * 0.15, BLOCK], [c[0] + n[0] * 0.35, c[1] + n[1] * 0.35, BLOCK], [0, 0, APEX + 0.3])
    gold.tri([c[0] + n[0] * 0.35, c[1] + n[1] * 0.35, BLOCK], [lo2[0] + n[0] * 0.15, lo2[1] + n[1] * 0.15, BLOCK], [0, 0, APEX + 0.3])
  }

  // The gilt lantern: an octagonal drum on a plinth, a little dome, a spike.
  const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => {
    const a = (i + 0.5) / 8 * 2 * Math.PI
    return [r * Math.cos(a), r * Math.sin(a)] as XY
  })
  ringWalls(gold, oct(1.9), APEX - 2.5, APEX + 1)
  ringWalls(gold, oct(1.4), APEX + 1, APEX + 3.8)
  ringWalls(gold, oct(1.9), APEX + 3.8, APEX + 4.4)
  capPoly(gold, oct(1.9), APEX + 1)
  pyramid(gold, oct(1.9), APEX + 4.4, [0, 0, APEX + 5.6])
  pyramid(gold, oct(0.45), APEX + 5.4, [0, 0, TIP])

  const lit = (from: number, k: number) => (p: V3, n: V3) => (p[2] < from ? 0 : Math.min(1, k * (0.4 + 0.6 * (1 - Math.max(0, n[2])))))
  return [
    { part: granite, material: { ...finish('oac-granite', 0xd6bba5), floodlight: lit(186, 0.85) } },
    { part: trim, material: { ...finish('oac-pinnacle', 0xf3e4d6), floodlight: lit(186, 1) } },
    { part: glass, material: PALETTE.window },
    { part: copper, material: { ...finish('oac-copper', 0x7e9c8c), floodlight: () => 1 } },
    { part: gold, material: { ...finish('oac-gilt', 0xd8b25a, 0.5), floodlight: () => 1 } },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) {
  await write('atl-one-atlantic-center', 'One Atlantic Center', build(), {
    bearing: 0, elevation: 0, height: 250.3,
    replaces: ['way/39450314', 'way/1425865538', 'way/1451518610', 'way/1451518611'],
  })
}
