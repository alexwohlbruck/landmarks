/**
 * Golden Gate Bridge (1937; Joseph Strauss, Charles Ellis, Leon Moisseiff;
 * art-deco styling by Irving Morrow) — procedural, CC0-1.0.
 * bun generators/sf-golden-gate-bridge.ts
 *
 * The whole suspension bridge as one placement, pylon S1 to pylon N1: both
 * towers, the two main cables, the suspenders, the stiffening trusses under
 * the roadway, the floor beams and lateral bracing, the sidewalk railings,
 * and the pylons' concrete legs where the cables turn down. Writes a low
 * model (towers with plain-edged legs, cables, the trusses as solid bands)
 * and a detail model (the approved towers in full, the trusses as lattice,
 * suspenders, railings, floor beams), which a map draws from detailZoom up.
 *
 * Frame: x across the bridge, y along it toward Marin, z up, metres; origin
 * midway between the towers, on the water. Placed at bearing 354.69°, the
 * line from the south tower's centroid to the north one's. The map owns the
 * roadway and sidewalk surfaces: the trusses hang below them, the railings
 * stand beside them, and nothing here is a slab at road level.
 *
 * Height. z = 0 is the water. Structure heights are lidar heights above the
 * water's own returns (0.5 m NAVD88), as the towers always were; ground
 * heights are 3DEP bare earth plus 1.1 m, the DEM's water reading here, so
 * the pylons' feet land on the terrain the map draws. The roadway, from
 * lidar: 81.2 m at midspan, 74.1 m at the towers, 66 m at the pylons. The
 * OSM outline records no height, so the map has none of its own to build
 * to; these are the heights to give it.
 *
 * Standing on the terrain: the towers stand in the water at z = 0 and the
 * pylons' legs run down to the ground under them vertex by vertex, from
 * 4 m tables of 3DEP heights in this frame (SOUTH_GROUND, NORTH_GROUND), so
 * every foot sits 1.1 m above the DEM.
 *
 * The span's sources:
 * - OSM: the outline relation/21407754 (way/370672707), 29 m wide, from
 *   y = -975 to +976; Pylon S1, way/1560010162 and way/1560010163, its two
 *   legs either side of the roadway (Pylon N1 is not mapped; drawn as S1's
 *   mirror).
 * - Lidar (USGS 3DEP CA_SanFrancisco_1_B23, 2023, 0.5 m grids across the
 *   deck at midspan, y = -320, -560, ±810, ±960 and over both pylons): the
 *   roadway above; the cables 27.5 m apart, 85.1 m high at midspan (centre)
 *   and 194.8 m at y = -560, a parabola to 226.7 m at the saddles (the
 *   published sag is 470 ft, 143 m); on the side spans 137.9 m at y = ±810
 *   and 75.8 m at ±960, entering the pylons' housings at about 72 m; the
 *   housings' tops 75.4 m; the suicide-deterrent net (2023), 6.7 m under the
 *   sidewalks, which is left out.
 * - Published (Wikipedia "Golden Gate Bridge"; goldengate.org): main span
 *   4,200 ft, side spans 1,125 ft; cables 36 3/8 in; stiffening trusses
 *   25 ft deep, 90 ft apart; suspenders in pairs every 50 ft.
 * - Estimated: the truss panels (25 ft, Warren with verticals), the floor
 *   beams' depth, the railing's height (1.3 m), the pylon legs' plain
 *   concrete form (their art-deco relief is left out). The cables are drawn
 *   1.3 m thick and the suspenders 0.44 m, a little over the real ones.
 *
 * The towers' sources, unchanged:
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
import { band, footedWall, groundAt, merged, movedAlong, parabola, rod, stations, strip, truss, tube, type GroundGrid } from './bridge-kit'
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

/**
 * One tower, centred on its pier on the water, into the three parts given.
 * `simple` is the far view's: plain-edged legs, no corbelled brackets or
 * fluting, so two towers fit the low model's budget.
 */
function tower(lit: Part, shade: Part, pier: Part, simple = false) {
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
        box(legSkin(last, k === 0), a, b, -hd, hd, z0, z1, simple
          ? { r: 0, bottom: false }
          : { r: 0.25, top: z1 === 224.6 ? 0.4 : 0.15, bottom: false })
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
    if (simple) return
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
  if (!simple) for (let i = -3; i <= 3; i++) box(L, i * 2.9 - 0.7, i * 2.9 + 0.7, -1.75, 1.75, 216.5, 221.8, { r: 0 , bottom: false })

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
}

// ---- The span ------------------------------------------------------------------

const S = 1275.77               // tower centre to tower centre (OSM)
const TY = S / 2                // towers at y = ±TY
const FACE = 7.5                // the deck stops this far from a tower's centre line
const END = 975                 // the outline's ends, at pylons S1 and N1
const HOUSING = [972.6, 982.7]  // the pylons' cable housings, along y (OSM, Pylon S1)

/**
 * The roadway, metres above the water, from lidar: a vertical curve 81.2 m
 * high at midspan and 74.1 m at the towers, falling on through the side
 * spans to 66 m at the pylons.
 */
const road = (y: number): number => {
  const a = Math.abs(y)
  return a <= TY ? 81.2 - 1.74e-5 * y * y : side(a)
}
const side = parabola([TY, 81.2 - 1.74e-5 * TY * TY], [810, 70.6], [960, 66.5])

const CABLE_X = 13.75, CABLE_R = 0.65
const SADDLE = 226.7, LOW = 85.1
const mainCable = (y: number) => LOW + (SADDLE - LOW) * (y / TY) ** 2
const sideCable = parabola([TY, SADDLE], [810, 137.9], [960, 75.8])
const cable = (y: number) => Math.max(Math.abs(y) <= TY ? mainCable(y) : sideCable(Math.abs(y)), road(y) + 1.5)

const TRUSS_DOWN = 7.6          // the stiffening trusses' depth under the roadway (25 ft)
const TRUSS_W = 0.8
const PANEL = 7.62              // truss panels, 25 ft; suspenders every second panel (50 ft)
const RAIL_X = 14.3

const spans: [number, number][] = [[-END, -TY - FACE], [-TY + FACE, TY - FACE], [TY + FACE, END]]
const curve = ([a, b]: [number, number]) => stations(a, b, 50)
const panels = ([a, b]: [number, number]) => stations(a, b, PANEL)

// 3DEP bare-earth heights above the water (NAVD88 + 1.1), 4 m apart in this
// frame, under the pylons: rows along |y| from 966, columns across from x = -22.
const SOUTH_GROUND: GroundGrid = { y0: -990, x0: -22, step: 4, z: [
  [4.5, 6.1, 6.1, 6.0, 6.1, 6.3, 6.7, 6.7, 6.8, 6.7, 6.7, 6.7],
  [3.6, 6.2, 6.2, 6.1, 6.2, 6.3, 6.5, 6.5, 6.6, 6.7, 7.0, 7.0],
  [4.5, 6.2, 6.2, 6.1, 6.2, 6.2, 6.4, 6.3, 6.3, 6.5, 6.7, 6.5],
  [5.4, 6.2, 6.2, 6.1, 6.2, 6.2, 6.2, 6.2, 6.1, 6.2, 6.3, 6.1],
  [3.9, 4.1, 5.0, 3.6, 4.0, 5.0, 3.8, 5.6, 5.9, 6.0, 6.0, 5.8],
  [0.9, 0.8, 0.9, 1.0, 1.2, 1.2, 1.2, 1.7, 1.9, 2.0, 3.5, 2.0],
  [0.9, 0.8, 0.9, 1.0, 1.0, 1.1, 1.0, 1.1, 1.1, 1.4, 1.8, 1.1],
] }
const NORTH_GROUND: GroundGrid = { y0: 966, x0: -22, step: 4, z: [
  [61.4, 57.9, 55.9, 55.3, 52.8, 50.3, 47.8, 45.2, 41.9, 39.7, 37.5, 31.4],
  [60.9, 56.5, 56.0, 55.0, 52.0, 48.1, 45.5, 42.8, 39.0, 36.2, 33.1, 30.0],
  [56.6, 56.3, 54.9, 52.1, 48.8, 45.2, 41.9, 38.7, 35.0, 33.9, 30.1, 28.9],
  [56.3, 56.3, 54.6, 52.6, 49.2, 45.8, 42.4, 39.0, 35.6, 33.8, 29.8, 28.7],
  [56.3, 56.3, 55.1, 53.1, 49.3, 45.7, 42.3, 38.9, 35.5, 33.1, 29.3, 29.0],
  [56.3, 56.4, 56.0, 53.6, 49.8, 46.2, 42.4, 38.8, 35.3, 32.5, 29.4, 29.1],
  [56.4, 56.3, 56.3, 54.9, 51.4, 47.8, 44.3, 40.7, 37.1, 34.0, 30.7, 29.3],
] }

if (import.meta.main) {
  const lit = new Part(), shade = new Part(), pier = new Part()
  const litFar = new Part(), shadeFar = new Part(), pierFar = new Part()
  tower(lit, shade, pier)
  tower(litFar, shadeFar, pierFar, true)
  const towers = (p: Part) => merged(movedAlong(p, -TY), movedAlong(p, TY))

  const steelLow = new Part(), steelDetail = new Part(), web = new Part()
  const under = new Part(), underDetail = new Part()
  const concrete = new Part()
  const top = (y: number) => road(y) - .4
  const bot = (y: number) => road(y) - TRUSS_DOWN

  for (const span of spans) {
    const ys = curve(span)
    for (const s of [-1, 1]) {
      const x0 = s * (CABLE_X - TRUSS_W / 2), x1 = s * (CABLE_X + TRUSS_W / 2)
      band(steelLow, x0, x1, ys, top, bot, { out: true, top: true, bottom: true, ends: true })
      truss(steelDetail, web, s * CABLE_X, panels(span), top, bot, { chordW: TRUSS_W, topD: .9, botD: .9, member: .45, curve: ys })
      // Railing along the sidewalk's outer edge: a top rail on posts.
      band(steelDetail, s * (RAIL_X - .08), s * (RAIL_X + .08), ys, (y) => road(y) + 1.3, (y) => road(y) + 1.1)
      for (const y of stations(span[0], span[1], 3.81))
        rod(steelDetail, [s * RAIL_X, y, road(y) - .4], [s * RAIL_X, y, road(y) + 1.15], .07, 3)
    }
    // The deck's underside, facing down, between the trusses.
    for (const p of [under, underDetail]) band(p, -CABLE_X + TRUSS_W / 2, CABLE_X - TRUSS_W / 2, ys, top, (y) => road(y) - 1.0, { bottom: true })
    // Floor beams and the bottom lateral bracing, every 50 ft.
    const ps = panels(span)
    for (let i = 0; i < ps.length; i += 2) {
      const y = ps[i]
      band(underDetail, -CABLE_X, CABLE_X, [y - .25, y + .25], () => road(y) - 1.0, () => road(y) - 2.6, { bottom: true, ends: true })
      if (i + 2 < ps.length) {
        const y2 = ps[i + 2]
        for (const [xa, xb] of [[-1, 1], [1, -1]])
          strip(web, [xa * CABLE_X, y, bot(y) + .5], [xb * CABLE_X, y2, bot(y2) + .5], .5, [0, 0, 1])
      }
    }
    // Suspenders, one per 50 ft (each is a pair of ropes).
    for (let i = 0; i < ps.length; i += 2) {
      const y = ps[i]
      if (Math.abs(Math.abs(y) - TY) < FACE + 4 || Math.abs(y) > END - 4) continue
      for (const s of [-1, 1]) {
        const z1 = cable(y) - CABLE_R * .6
        if (z1 - top(y) > 1) rod(steelDetail, [s * CABLE_X, y, top(y)], [s * CABLE_X, y, z1], .22, 4)
      }
    }
  }

  // Main cables, housing to housing, over the saddles.
  const cablePath = (x: number, step: number): V3[] => [
    [x, -HOUSING[1], road(END) + 3],
    ...spans.flatMap(([a, b]) => stations(a, b, step).map((y) => [x, y, cable(y)] as V3)),
    [x, HOUSING[1], road(END) + 3],
  ]
  for (const s of [-1, 1]) {
    tube(steelLow, cablePath(s * CABLE_X, 60), CABLE_R, 5)
    tube(steelDetail, cablePath(s * CABLE_X, 10), CABLE_R, 10)
  }

  // Pylons S1 and N1: a concrete leg either side of the roadway, from the
  // ground up past the deck, housing the cables where they turn down.
  const HOUSE_TOP = 75.4
  for (const [sy, ground] of [[-1, SOUTH_GROUND], [1, NORTH_GROUND]] as [number, GroundGrid][]) {
    const g = (x: number, y: number) => groundAt(ground, x, y)
    const [ya, yb] = sy < 0 ? [-HOUSING[1], -HOUSING[0]] : [HOUSING[0], HOUSING[1]]
    for (const s of [-1, 1]) {
      const xi = s * 12.0, xo = s * 19.1
      const t = () => HOUSE_TOP
      footedWall(concrete, [xi, ya], [xo, ya], g, t, [0, -1, 0])
      footedWall(concrete, [xi, yb], [xo, yb], g, t, [0, 1, 0])
      footedWall(concrete, [xo, ya], [xo, yb], g, t, [s, 0, 0])
      footedWall(concrete, [xi, ya], [xi, yb], g, t, [-s, 0, 0])
      band(concrete, Math.min(xi, xo), Math.max(xi, xo), [ya, yb], t, t, { top: true })
      // A shallow cap, a step proud of the leg.
      band(concrete, Math.min(xi, xo) - .4, Math.max(xi, xo) + .4, [ya - .4, yb + .4], () => HOUSE_TOP - .3, () => HOUSE_TOP - 1.4)
    }
  }

  const ORANGE: Swatch = finish('international-orange', 0xc8553f)
  const ORANGE_SHADE: Swatch = finish('international-orange-shade', 0xa9452f)
  const CONCRETE: Swatch = finish('concrete', 0xd9d3c7)
  const low = [
    { part: merged(towers(litFar), steelLow), material: ORANGE },
    { part: merged(towers(shadeFar), under), material: ORANGE_SHADE },
    { part: merged(towers(pierFar), concrete), material: CONCRETE },
  ]
  const detail = [
    { part: merged(towers(lit), steelDetail, web), material: { ...ORANGE, doubleSided: true } },
    { part: merged(towers(shade), underDetail), material: ORANGE_SHADE },
    { part: merged(towers(pier), concrete), material: CONCRETE },
  ]
  const extras = {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin midway between the towers, on the water',
    bearing: 354.69, elevation: 0, towers: [-TY, TY], ends: [-END, END],
    roadwayMidspan: road(0), roadwayAtTowers: road(TY), roadwayEnds: road(END),
  }
  for (const [file, list, maxTris, maxBytes] of [
    ['sf-golden-gate-bridge.glb', low, 6500, 250 * 1024],
    ['sf-golden-gate-bridge.detail.glb', detail, 40000, 1536 * 1024],
  ] as const) {
    const tris = countParts([...list])
    if (tris > maxTris) throw new Error(`${file}: ${tris} triangles, over ${maxTris}`)
    const glb = writeGlb('Golden Gate Bridge', [...list], extras)
    if (glb.length > maxBytes) throw new Error(`${file}: ${glb.length} bytes, over ${maxBytes}`)
    await Bun.write(new URL(`../models/${file}`, import.meta.url), glb)
    console.log(`${file}: ${tris} triangles, ${glb.length} bytes`)
  }
}
