/**
 * Golden Gate Bridge towers (1937; Joseph Strauss, Charles Ellis, Leon
 * Moisseiff; art-deco styling by Irving Morrow) — procedural, CC0-1.0.
 * bun generators/sf-golden-gate-bridge.ts
 *
 * One tower, placed twice (south and north). Map frame: x across the
 * bridge, y along it, z up, metres; origin at the centre of the pier on
 * the water. Placed at bearing 354.7°, the line from the south tower to
 * the north one. Only the towers: the deck, the stiffening truss and the
 * suspenders are left to the map, as the batch brief asks. The main cables
 * are left out too: stubs of them read as horns at map scale. Their
 * saddle housings stay on the leg tops.
 *
 * What makes it the Golden Gate: International Orange; two tall stepped
 * legs, cruciform in plan, whose faces carry broad vertical recesses; four
 * deep portal struts above the deck, the openings between them with stepped
 * art-deco corners, shrinking upward; the legs stepping in toward the top;
 * two X-braced panels under the deck; a pale concrete pier.
 *
 * Sources:
 * - OSM: both towers are mapped as outline + building:parts with heights,
 *   at the scale of the legs' 3.5 ft cells. South: way/1330586852 "San
 *   Francisco Tower" and 26 parts; north: way/1330832666 "Marin Tower" and
 *   22 parts. The two agree to 0.1 m once turned into the bridge frame, and
 *   every plan dimension here is theirs: the pier (42.8 x 20.2 m, rounded
 *   ends, 13 m), the leg plinths (13–21 m), the legs' cruciform sections
 *   and where they step (74, 123, 162, 195 m), the struts (24–26, 50–52,
 *   111–121, 151–161, 185–193, 215–223 m, 3.8 m deep).
 * - Lidar (USGS 3DEP, CA_SanFrancisco_1_B23, flown 2023, 0.5 m grid; water
 *   at 0.5 m NAVD88, which is y = 0 here), identical at both towers: leg
 *   tops 224.6 m, top strut 223.3 m, saddle housings 229.5 m, deck 74.9 m;
 *   legs centred 13.7 m either side of the axis, stepping in at 162 and 195
 *   m as OSM has them.
 * - Published: towers 746 ft (227 m) above the water and 500 ft above the
 *   roadway; main span 4,200 ft (1,280 m; the two outline centroids are
 *   1,275 m apart); main cables 36 3/8 in (0.92 m); colour International
 *   Orange (Wikipedia "Golden Gate Bridge"; goldengate.org).
 * - Photos (Wikimedia Commons): "Golden Gate Bridge, north tower detail"
 *   and "Golden Gate Bridge, North view" (Radomianin, CC BY-SA 4.0); "Golden
 *   Gate bridge pillar" (Calibas, CC BY-SA 4.0; the struts' corbelled
 *   corners from the deck); "Sausalito (CA, USA), Golden Gate Bridge Vista
 *   Point -- 2022 -- 3070" (Dietmar Rabich, CC BY-SA 4.0; the portal face);
 *   "GoldenGateBridge BakerBeach MC" (Christian Mehlführer, CC BY 3.0) and
 *   "Golden Gate Bridge as seen from Marshall's Beach, March 2018" (Frank
 *   Schulenburg, CC BY-SA 4.0; the south tower, X panels and pier); "Golden
 *   Gate Bridge, top of South Tower, 1984" (Jet Lowe, HAER, public domain;
 *   the saddles); "Golden Gate Bridge tower views 01/12" (Ɱ, CC BY-SA 4.0);
 *   "Aerial view of Golden Gate Bridge from the south" (Daniel L. Lu, CC
 *   BY-SA 4.0).
 * - Estimated from photos: the stepped corner brackets of the openings
 *   (three 1.3 m steps, 3.0, 1.9 and 0.9 m wide), the recessed panel on each strut face, the
 *   X members' width (2 m), a strut under the deck (66–69 m, the truss's
 *   seat; OSM has the deck itself there), the saddle housing's curve, and
 *   the top strut's fluting (seven ribs).
 * - Colour: International Orange from sunlit daylight photos (#c45140 to
 *   #d26053); the recessed faces a shade darker, so the fluting reads in
 *   the map's flat lighting; the pier's concrete pale grey.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'

// ---- Shared helpers (also used by the Bay Bridge towers) -------------------

const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** Picks the part a face is drawn in, from its outward normal. */
export type Skin = (n: V3) => Part

/** One quad, CCW seen from outside, in the part its normal picks. */
function face(skin: Skin, a: V3, b: V3, c: V3, d: V3) {
  skin(norm(cross(sub(b, a), sub(c, a)))).quad(a, b, c, d)
}

/** Corners of a plan rectangle with chamfered corners (r = 0: plain), CCW from above. */
function rim(x0: number, x1: number, y0: number, y1: number, r: number, z: number): V3[] {
  if (r <= 0) return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  return [[x0 + r, y0, z], [x1 - r, y0, z], [x1, y0 + r, z], [x1, y1 - r, z],
    [x1 - r, y1, z], [x0 + r, y1, z], [x0, y1 - r, z], [x0, y0 + r, z]]
}

/** A closed prism lofted through rings (each CCW seen from the far end), capped. */
export function loftSolid(skin: Skin, rings: V3[][], caps = [true, true]) {
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    face(skin, rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
  }
  const fan = (ring: V3[], flip: boolean) => {
    const pts = flip ? [...ring].reverse() : ring
    for (let i = 1; i < pts.length - 1; i++) {
      const nn = norm(cross(sub(pts[i], pts[0]), sub(pts[i + 1], pts[0])))
      skin(nn).tri(pts[0], pts[i], pts[i + 1])
    }
  }
  if (caps[1]) fan(rings[rings.length - 1], false)
  if (caps[0]) fan(rings[0], true)
}

/**
 * An upright box with chamfered vertical edges (r) and an optional
 * chamfered top edge (top). `bottom: false` leaves out the hidden base.
 */
export function box(skin: Skin, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  { r = 0.3, top = 0, bottom = true } = {}) {
  const rings = [rim(x0, x1, y0, y1, r, z0), rim(x0, x1, y0, y1, r, z1 - top)]
  if (top > 0) rings.push(rim(x0 + top, x1 - top, y0 + top, y1 - top, Math.max(0.05, r - top * 0.4), z1))
  loftSolid(skin, rings, [bottom, true])
}

/** An upright prism over a convex plan polygon (CCW from above). */
export function prism(skin: Skin, plan: [number, number][], z0: number, z1: number, bottom = true) {
  loftSolid(skin, [plan.map(([x, y]) => [x, y, z0] as V3), plan.map(([x, y]) => [x, y, z1] as V3)], [bottom, true])
}

/**
 * A straight member from a to b: a w x t rectangle (t measured along
 * `side`), or with `round` an n-gon of diameter w.
 */
export function beam(skin: Skin, a: V3, b: V3, w: number, t: number, side: V3 = [0, 1, 0], round = 0) {
  const d = norm(sub(b, a))
  const S = norm(sub(side, mul(d, side[0] * d[0] + side[1] * d[1] + side[2] * d[2])))
  const W = cross(S, d)
  const section = (o: V3): V3[] => round
    ? Array.from({ length: round }, (_, i) => {
      const th = (2 * Math.PI * i) / round
      return add(o, add(mul(W, Math.cos(th) * w / 2), mul(S, Math.sin(th) * w / 2)))
    })
    : [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => add(o, add(mul(W, u * w / 2), mul(S, v * t / 2))))
  loftSolid(skin, [section(a), section(b)])
}

/** A skin that draws every face in one part. */
export const one = (p: Part): Skin => () => p

export const countParts = (parts: { part: Part }[]) => parts.reduce((s, p) => s + p.part.triangles, 0)

// ---- The Golden Gate tower --------------------------------------------------

if (import.meta.main) {
  const lit = new Part()     // International Orange
  const shade = new Part()   // the same paint on recessed faces
  const pier = new Part()    // concrete

  /**
   * The legs' faces: a wing's face is recessed when another wing of the
   * same section stands proud of it in that direction. `proudX`/`proudY`
   * say whether this box carries the leg's outermost face that way.
   */
  const legSkin = (proudX: boolean, proudY: boolean): Skin => (n) => {
    if (Math.abs(n[2]) > 0.7) return lit
    if (Math.abs(n[0]) > 0.9) return proudX ? lit : shade
    if (Math.abs(n[1]) > 0.9) return proudY ? lit : shade
    return lit
  }
  const L = one(lit), S = one(shade)

  // Pier: OSM's outline, rounded cutwater ends, 13 m.
  const half: [number, number][] = [[17.5, -10.1], [19.5, -8.3], [20.7, -4.5], [21.2, -2.2], [21.4, 0],
    [21.2, 2.2], [20.7, 4.5], [19.5, 8.3], [17.5, 10.1]]
  const plan = [...half, ...half.map(([x, y]) => [-x, -y] as [number, number])]
  prism(one(pier), plan, 0, 12.4, false)
  prism(one(pier), plan.map(([x, y]) => [x * 0.985, y * 0.97] as [number, number]), 12.4, 13, false)

  // Leg sections, x as distances from the axis (OSM, bridge frame).
  // Each: [z0, z1, [[xin, xout, halfDepth], ...]] from the core outward.
  type Wing = [number, number, number]
  const sections: [number, number, Wing[]][] = [
    [13, 21, [[11.0, 16.4, 7.8], [10.0, 17.5, 4.85], [8.9, 18.6, 2.8]]],   // plinth
    [21, 74, [[12.1, 15.3, 6.9], [11.0, 16.4, 3.7], [10.0, 17.5, 1.85]]],
    [74, 123, [[12.1, 15.3, 5.8], [11.0, 16.4, 3.7], [10.0, 17.5, 1.85]]],
    [123, 162, [[12.1, 15.3, 4.9], [11.0, 16.4, 2.75], [10.0, 17.5, 1.85]]],
    [162, 195, [[12.1, 15.3, 4.9], [11.0, 16.4, 1.85]]],
    [195, 224.6, [[12.1, 15.3, 3.7]]],
  ]
  for (const s of [-1, 1]) {
    for (const [z0, z1, wings] of sections) {
      wings.forEach(([xi, xo, hd], k) => {
        const [a, b] = s > 0 ? [xi, xo] : [-xo, -xi]
        const last = k === wings.length - 1
        box(legSkin(last, k === 0), a, b, -hd, hd, z0, z1, { r: 0.25, top: z1 === 224.6 ? 0.4 : 0.15, bottom: false })
      })
    }
  }
  /** The leg's inner face (toward the axis) at height z. */
  const inner = (z: number) => (z >= 195 ? 12.1 : z >= 162 ? 11.0 : 10.0)

  // Saddle housings: a low curved hood on each leg top, lofted across it.
  for (const s of [-1, 1]) {
    const R = 6, C = 223.0, Y = 3.5, x0 = s > 0 ? 12.5 : -14.9
    // Ring in the (y, z) plane, CCW seen from +x.
    const ring = (x: number): V3[] => [[x, -Y, 224.6], [x, Y, 224.6],
      ...Array.from({ length: 9 }, (_, i) => { const y = Y - (2 * Y * i) / 8; return [x, y, C + Math.sqrt(R * R - y * y)] as V3 })]
    loftSolid(L, [ring(x0), ring(x0 + 2.4)])
  }

  /** A strut between the legs with a recessed panel on each face. */
  function strut(z0: number, z1: number, band = 1.5) {
    const xi = inner(z0) + 0.4
    box(S, -xi, xi, -1.45, 1.45, z0 + band, z1 - band, { r: 0, bottom: false })
    box(L, -xi, xi, -1.9, 1.9, z0, z0 + band, { r: 0.2 })
    box(L, -xi, xi, -1.9, 1.9, z1 - band, z1, { r: 0.2, top: 0.2 })
  }
  /**
   * Stepped art-deco brackets in an opening's corners: two steps against
   * the legs at height z, hanging down (dir -1) or standing up (dir +1).
   */
  function brackets(z: number, dir: number) {
    const xi = inner(z + dir * 0.5)
    for (const s of [-1, 1]) for (const [w, k] of [[3.0, 0], [1.9, 1], [0.9, 2]]) {
      const za = dir > 0 ? z + k * 1.3 : z - (k + 1) * 1.3
      const [a, b] = s > 0 ? [xi - w, xi + 0.3] : [-xi - 0.3, -xi + w]
      box(L, a, b, -1.9, 1.9, za, za + 1.3, { r: 0 })
    }
  }

  // Above the deck: four portal struts, the openings' corners stepped.
  const struts: [number, number][] = [[111, 121], [151, 161], [185, 193], [215, 223.3]]
  for (const [z0, z1] of struts) {
    strut(z0, z1)
    brackets(z0, -1)        // top corners of the opening below
  }
  for (const [, z1] of struts.slice(0, 3)) brackets(z1, 1) // bottom corners of the opening above
  // The top strut's face is fluted: broad vertical ribs across its recess.
  for (let i = -3; i <= 3; i++) box(L, i * 2.9 - 0.7, i * 2.9 + 0.7, -1.75, 1.75, 216.5, 221.8, { r: 0 , bottom: false })

  // Under the deck: the truss's seat, then two X-braced panels of about
  // equal height (photos; OSM puts the middle strut at 50–52 m, which
  // would make the upper panel two-thirds the lower's).
  strut(66, 69, 1.0)
  for (const [z0, z1] of [[22, 25], [46.5, 49.5]]) box(L, -10.4, 10.4, -1.9, 1.9, z0, z1, { r: 0.2 })
  for (const [z0, z1] of [[25, 46.5], [49.5, 66]]) {
    for (const s of [-1, 1]) beam(L, [-10.6 * s, 0, z0 - 0.6], [10.6 * s, 0, z1 + 0.6], 2.6, 2.6)
    const zm = (z0 + z1) / 2
    beam(L, [0, 0, zm - 2.4], [0, 0, zm + 2.4], 3.4, 3.0, [0, 1, 0])
  }

  const ORANGE: Swatch = finish('international-orange', 0xc8553f)
  const ORANGE_SHADE: Swatch = finish('international-orange-shade', 0xa9452f)
  const CONCRETE: Swatch = finish('concrete', 0xd9d3c7)
  const parts = [{ part: lit, material: ORANGE }, { part: shade, material: ORANGE_SHADE }, { part: pier, material: CONCRETE }]
  const triangles = countParts(parts)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Golden Gate Bridge tower', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at the pier centre on the water', height: 229.5, bearing: 354.7,
  })
  await Bun.write(new URL('../models/sf-golden-gate-bridge.glb', import.meta.url), glb)
  console.log(`sf-golden-gate-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
}
