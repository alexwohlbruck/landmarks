/**
 * National Museum of African American History and Culture (NMAAHC) —
 * procedural, CC0-1.0, no textures.
 * bun generators/dc-nmaahc.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * the OSM outline (way/398810868). The building is square to the compass
 * (its walls run at 89–90°), so it is placed at bearing 0.
 *
 * Modelled: the shadowed glass ground storey (a darker window tone); the "corona", three stacked inverted
 * tiers whose bronze screen leans outward at 17°, each tier tucked in at its
 * foot so the stack reads as a sawtooth; the dark soffit under each tier;
 * the grey roof and its mechanical penthouse; the big glazed openings cut
 * through the screen (the long slot and the diagonal slash on the west face,
 * the smaller windows on the other three); and the south porch, a thin
 * long-span canopy over the Madison Drive entrance on its two piers.
 *
 * Evidence:
 * - OSM: way/398810868, the outline, 60.9 × 59.8 m (taken as the corona's
 *   foot); way/898560007 (building=roof, height 7), the porch, 11.6 m deep
 *   along the whole south side. OSM's height of 18.1 m is not the
 *   building's (the photos put the corona's top near 32 m). The oculus on the
 *   north lawn (way/898560016) is a separate building and is not replaced.
 * - Published: Wikipedia "National Museum of African American History and
 *   Culture" (Freelon Adjaye Bond / SmithGroup, 2016; five storeys above
 *   ground; 3,600 bronze-coloured cast-aluminium corona panels; a 200 ft
 *   (61 m) long-span porch). Enclos (curtain-wall contractor): 123 ft high;
 *   the tiers lean at 17°, the angle of the Washington Monument's capstone.
 * - Photos (Wikimedia Commons): "National Museum of African American History
 *   and Culture in February 2020.jpg" (Frank Schulenburg, CC BY-SA 4.0,
 *   from the south-west: porch, west slot and slash, south windows);
 *   "… (97901).jpg" (Rhododendrites, CC BY-SA 4.0, porch edge);
 *   "… - exterior 20250405.jpg" (Frypie, CC BY-SA 4.0, from the north-west at
 *   a distance: proportions, penthouse); "… 2019.jpg" (Difference engine,
 *   CC BY-SA 4.0, north-west: tier heights, base); "… 9264994.jpg"
 *   (slowking4, GFDL 1.2, west face: slot and slash positions); "… - Joy of
 *   Museums - External 2.jpg" (GordonMakryllos, CC BY-SA 4.0, from the
 *   north-east: east and north windows, roof edge).
 *
 * Measured from the photos: ground storey 4.6 m (about 13% of the height,
 * as the frontal photos show it), set 1.6 m back under the first tier;
 * three tiers of 9.3 m, so the corona's roof is at 32.5 m and each tier
 * flares 2.84 m (9.3 × tan 17°); the porch, 6.4 m
 * at its top (OSM: 7 m); the penthouse, 55 m square (NAIP), to 35 m. The
 * published 123 ft (37.5 m)
 * is taken to be from the lower grade on Constitution Avenue or to the top
 * of the plant, and is not used directly. Estimated: the window positions
 * (to a few metres, from oblique photos), the porch's piers and its
 * soffit slope. The screen's lattice is drawn as broad bronze faces, as the
 * brief asks, not as a pattern. Not modelled: the oculus, the lawn walls,
 * the fountain, the lettering.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

// ===========================================================================
// A small kit shared by dc-nmaahc, dc-natural-history and dc-american-indian.

export type XY = [number, number]

/** Emit a quad (or triangle) with its winding fixed so it faces `dir`. */
export function orient(p: Part, q: V3[], dir: V3) {
  const [a, b, c] = q
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const fwd = n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] >= 0
  if (q.length === 3) return fwd ? p.tri(q[0], q[1], q[2]) : p.tri(q[0], q[2], q[1])
  if (fwd) p.quad(q[0], q[1], q[2], q[3])
  else p.quad(q[0], q[3], q[2], q[1])
}

export const area2 = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
/** Counter-clockwise from above. */
export const ccw = (r: XY[]) => (area2(r) < 0 ? [...r].reverse() : r)

/** Ear-clipping triangulation of a simple polygon (any winding); index triples, CCW. */
export function earcut(ring0: XY[]): [number, number, number][] {
  const flip = area2(ring0) < 0
  const idx = ring0.map((_, i) => i)
  if (flip) idx.reverse()
  const P = ring0
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (q: XY, a: XY, b: XY, c: XY) => cr(a, b, q) >= -1e-9 && cr(b, c, q) >= -1e-9 && cr(c, a, q) >= -1e-9
  const out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let best = -1, bestScore = -Infinity
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = P[ia], b = P[ib], c = P[ic]
      const c2 = cr(a, b, c)
      if (c2 <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inTri(P[j], a, b, c) &&
        !(P[j][0] === a[0] && P[j][1] === a[1]) && !(P[j][0] === c[0] && P[j][1] === c[1]))) continue
      // prefer fat ears, so long thin slivers don't fan across the plan
      const e = Math.max(Math.hypot(a[0] - b[0], a[1] - b[1]), Math.hypot(b[0] - c[0], b[1] - c[1]), Math.hypot(a[0] - c[0], a[1] - c[1]))
      const score = c2 / (e * e)
      if (score > bestScore) { bestScore = score; best = i }
    }
    if (best < 0) throw new Error('earcut: polygon is not simple')
    out.push([idx[(best + idx.length - 1) % idx.length], idx[best], idx[(best + 1) % idx.length]])
    idx.splice(best, 1)
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat polygon at height z, facing up or down. */
export function cap(p: Part, ring: XY[], z: number, up = true) {
  for (const [a, b, c] of earcut(ring)) orient(p, [[...ring[a], z], [...ring[b], z], [...ring[c], z]] as V3[], [0, 0, up ? 1 : -1])
}

/** Vertical walls round a ring (any winding), facing out. */
export function walls(p: Part, ring0: XY[], z0: number, z1: number) {
  const ring = ccw(ring0)
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}

/** Offset a ring outward by d (inward when negative), mitred, any winding. */
export function offset(ring0: XY[], d: number): XY[] {
  const ring = ccw(ring0), n = ring.length
  const out = ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n]
    const e1 = norm2([p[0] - a[0], p[1] - a[1]]), e2 = norm2([b[0] - p[0], b[1] - p[1]])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
    const k = Math.max(0.5, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + (m[0] * d) / k, p[1] + (m[1] * d) / k] as XY
  })
  return area2(ring0) < 0 ? out.reverse() : out
}
const norm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/**
 * A solid between z0 and z1 over a ring, its top edge chamfered by `b`
 * (the soft edge STYLE.md asks for). `top` may be another part (a roof).
 */
export function slab(p: Part, ring: XY[], z0: number, z1: number, b = 0.4, top: Part | boolean = true, bottom = false) {
  const R = ccw(ring)
  if (b > 0) {
    walls(p, R, z0, z1 - b)
    const I = offset(R, -b)
    p.loft([R.map(([x, y]) => [x, y, z1 - b] as V3), I.map(([x, y]) => [x, y, z1] as V3)])
    if (top) cap(top === true ? p : top, I, z1, true)
  } else {
    walls(p, R, z0, z1)
    if (top) cap(top === true ? p : top, R, z1, true)
  }
  if (bottom) cap(p, R, z0, false)
}

/** The flat ring between an outer and an inner ring with the same count, at z. */
export function annulus(p: Part, outer: XY[], inner: XY[], z: number, up = true) {
  const O = ccw(outer), I = area2(inner) < 0 ? [...inner].reverse() : inner
  for (let i = 0; i < O.length; i++) {
    const j = (i + 1) % O.length
    orient(p, [[...O[i], z], [...O[j], z], [...I[j], z], [...I[i], z]] as V3[], [0, 0, up ? 1 : -1])
  }
}

export const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
export function circle(cx: number, cy: number, r: number, n: number, a0 = 0): XY[] {
  return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a0 + (k * 2 * Math.PI) / n), cy + r * Math.sin(a0 + (k * 2 * Math.PI) / n)] as XY)
}

/** A smooth-shaded surface of revolution through (radius, z) profile points. */
export function lathe(p: Part, cx: number, cy: number, prof: [number, number][], n = 16, capTop = true) {
  const P = (r: number, z: number, a: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    // normal of the profile segment, (dz, -dr) in (r, z)
    const nr = z1 - z0, nz = -(r1 - r0), l = Math.hypot(nr, nz) || 1
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n, b = ((i + 1) * 2 * Math.PI) / n
      const N = (ang: number): V3 => [(Math.cos(ang) * nr) / l, (Math.sin(ang) * nr) / l, nz / l]
      if (r1 < 1e-6) p.tri(P(r0, z0, a), P(r0, z0, b), P(0, z1, 0), undefined, undefined, undefined, [N(a), N(b), [0, 0, 1]])
      else {
        p.tri(P(r0, z0, a), P(r0, z0, b), P(r1, z1, b), undefined, undefined, undefined, [N(a), N(b), N(b)])
        p.tri(P(r0, z0, a), P(r1, z1, b), P(r1, z1, a), undefined, undefined, undefined, [N(a), N(b), N(a)])
      }
    }
  }
  const [rt, zt] = prof[prof.length - 1]
  if (capTop && rt > 1e-6) p.cap(circle(cx, cy, rt, n).map(([x, y]) => [x, y, zt] as V3), true)
}

/**
 * A flat panel on a wall segment a→b of a CCW ring (so it faces out),
 * between fractions t0..t1 along it and heights z0..z1, standing d proud.
 */
export function panel(p: Part, a: XY, b: XY, t0: number, t1: number, z0: number, z1: number, d = 0.05) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const nx = dy / l, ny = -dx / l
  const P = (t: number, z: number): V3 => [a[0] + dx * t + nx * d, a[1] + dy * t + ny * d, z]
  p.quad(P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1))
}

export type Mat = { name: string; color: number; roughness?: number }

/** Check the budgets and write models/<id>.glb. */
export async function save(id: string, name: string, parts: Array<{ part: Part; material: Mat }>, extras: Record<string, unknown>, maxTris = 5000) {
  const used = parts.filter(({ part }) => part.triangles)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ===========================================================================
// The NMAAHC.

if (import.meta.main) {
  const bronze = new Part(), soffit = new Part(), glassWall = new Part(), roof = new Part()

  // Plan: the corona's foot, from the OSM outline (centred).
  const X0 = -30.3, X1 = 30.3, Y0 = -29.9, Y1 = 29.9
  const BASE = 4.6, TIER = 9.3, FLARE = TIER * Math.tan((17 * Math.PI) / 180) // 2.84 m
  const TOP = BASE + 3 * TIER // 32.5, the corona's roof
  const PENT = 35.0
  const foot = (o: number) => rect(X0 - o, X1 + o, Y0 - o, Y1 + o)

  // Ground storey: glass in the corona's shadow, set well back under the
  // first tier, so it reads as a dark band rather than a plinth.
  const G = 1.6
  const glassRing = foot(-G)
  walls(glassWall, glassRing, 0, BASE)

  // The three tiers. Each leans out at 17° from its foot to its top, and the
  // next one starts back at the foot line, leaving a dark soffit between.
  for (let k = 0; k < 3; k++) {
    const z0 = BASE + k * TIER, z1 = z0 + TIER
    const ring = (o: number, z: number) => foot(o).map(([x, y]) => [x, y, z] as V3)
    // the leaning face, then a small chamfer over the lip
    bronze.loft([ring(0, z0), ring(FLARE, z1 - 0.3), ring(FLARE - 0.35, z1)])
    // underside of the tier, from the glass (or the tier below's foot line) out to the foot
    annulus(soffit, foot(0), k === 0 ? glassRing : foot(-0.01), z0, false)
    // top of the overhang, from the lip in to the next tier's foot (hidden by the roof on the last)
    if (k < 2) annulus(bronze, foot(FLARE - 0.35), foot(0), z1, true)
    else annulus(bronze, foot(FLARE - 0.35), foot(FLARE - 3.0), z1, true)
  }
  // Roof, a little below the screen's top edge, with the screen's inner face.
  // NAIP shows the screen's top as a ring about 3 m deep, a shadowed well
  // inside it, and a broad pale penthouse (its plant and solar panels
  // are left off).
  const ROOF = TOP - 1.5
  {
    const inner = foot(FLARE - 3.0)
    const I = ccw(inner)
    for (let i = 0; i < 4; i++) {
      const a = I[i], b = I[(i + 1) % 4]
      orient(bronze, [[a[0], a[1], ROOF], [b[0], b[1], ROOF], [b[0], b[1], TOP], [a[0], a[1], TOP]], [-(a[0] + b[0]), -(a[1] + b[1]), 0])
    }
    cap(soffit, inner, ROOF)
    // the penthouse: grey metal box over most of the roof
    slab(roof, foot(-2.8), ROOF, PENT, 0.4)
  }

  // Openings in the screen: glazed, dark. A point on a face at height z
  // stands FLARE·(z − z0)/TIER out from the foot line within its tier.
  const out = (z: number) => {
    const k = Math.min(2, Math.floor((z - BASE) / TIER))
    return ((z - BASE - k * TIER) / TIER) * FLARE
  }
  const win = new Part()
  /** A quad on a face: side, then corners as (s along the face from its west/south end, z). */
  function opening(side: 'n' | 's' | 'e' | 'w', pts: [number, number][]) {
    const d = 0.08
    const P = ([s, z]: [number, number]): V3 => {
      const o = out(z) + d
      if (side === 's') return [X0 + s, Y0 - o, z]
      if (side === 'n') return [X0 + s, Y1 + o, z]
      if (side === 'w') return [X0 - o, Y0 + s, z]
      return [X1 + o, Y0 + s, z]
    }
    const dir: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'w' ? [-1, 0, 0] : [1, 0, 0]
    orient(win, pts.map(P), dir)
  }
  // Openings must stay within one tier so they lie flat on its face.
  const T = (k: number, f: number) => BASE + k * TIER + f * TIER
  // West face (s from the south end): the long slot low in the top tier,
  // and the slash dropping through the middle tier about a third from the south.
  opening('w', [[54, T(2, 0.12)], [6, T(2, 0.12)], [6, T(2, 0.34)], [54, T(2, 0.34)]])
  opening('w', [[21.5, T(1, 0.97)], [19.6, T(1, 0.97)], [18.0, T(1, 0.06)], [19.9, T(1, 0.06)]])
  // South face (s from the west end): a wide window in the middle tier, a small one above.
  opening('s', [[36, T(1, 0.35)], [42.5, T(1, 0.35)], [42.5, T(1, 0.7)], [36, T(1, 0.7)]])
  opening('s', [[44.5, T(2, 0.3)], [46.5, T(2, 0.3)], [46.5, T(2, 0.62)], [44.5, T(2, 0.62)]])
  // East face (s from the south end): one wide window near the north end of the middle tier.
  opening('e', [[40, T(1, 0.5)], [48, T(1, 0.5)], [48, T(1, 0.85)], [40, T(1, 0.85)]])
  opening('e', [[1.5, T(2, 0.3)], [5, T(2, 0.3)], [5, T(2, 0.55)], [1.5, T(2, 0.55)]])
  // North face (s from the west end): a cut at its west end in the top tier, and one at the east.
  opening('n', [[1.5, T(2, 0.3)], [6, T(2, 0.3)], [6, T(2, 0.55)], [1.5, T(2, 0.55)]])
  opening('n', [[55, T(2, 0.3)], [59, T(2, 0.3)], [59, T(2, 0.55)], [55, T(2, 0.55)]])

  // The porch: a thin canopy along the south side (OSM way/898560007),
  // thickest at the building, knife-thin at its front edge, on two piers.
  {
    const PY0 = Y0 + G, PY1 = -41.5, PX0 = -29.2, PX1 = 29.2
    const top = 6.4, backUnder = 5.2, frontUnder = 6.0
    const A: V3 = [PX0, PY0, top], B: V3 = [PX1, PY0, top], C: V3 = [PX1, PY1, top], D: V3 = [PX0, PY1, top]
    const a: V3 = [PX0, PY0, backUnder], b: V3 = [PX1, PY0, backUnder], c: V3 = [PX1, PY1, frontUnder], d: V3 = [PX0, PY1, frontUnder]
    orient(soffit, [A, B, C, D], [0, 0, 1])
    orient(soffit, [a, b, c, d], [0, 0, -1])
    orient(soffit, [d, c, C, D], [0, -1, 0])
    orient(soffit, [a, d, D, A], [-1, 0, 0])
    orient(soffit, [b, c, C, B], [1, 0, 0])
    // piers: tapering blades, wider at the top, near each end of the front
    for (const px of [-19, 25.5]) {
      const w0 = 0.8, w1 = 2.2, t = 0.7, y = PY1 + 2.2
      const ring0: V3[] = [[px - w0, y - t, 0], [px + w0, y - t, 0], [px + w0, y + t, 0], [px - w0, y + t, 0]]
      const ring1: V3[] = ring0.map(([x, yy], i) => [px + (i === 0 || i === 3 ? -w1 : w1), yy, frontUnder + 0.2])
      soffit.loft([ring0, ring1])
    }
  }

  const BRONZE = finish('nmaahc-bronze', 0x6e5a49)
  const DARK = finish('nmaahc-shadow', 0x564a40)
  await save('dc-nmaahc', 'National Museum of African American History and Culture', [
    { part: bronze, material: BRONZE },
    { part: soffit, material: DARK },
    { part: glassWall, material: windowVariant(2, 0x4e5862) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ].reduce((acc, e) => {
    // window walls and screen openings share one material
    const prev = acc.find((x) => x.material.name === e.material.name)
    if (prev) { prev.part.pos.push(...e.part.pos); prev.part.nrm.push(...e.part.nrm); prev.part.uv.push(...e.part.uv) } else acc.push(e)
    return acc
  }, [] as Array<{ part: Part; material: Mat }>), { source: 'generators/dc-nmaahc.ts' })
}
