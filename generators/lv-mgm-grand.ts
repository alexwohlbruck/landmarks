/**
 * MGM Grand Las Vegas: the emerald-green glass hotel tower (1993, Veldon
 * Simpson) in its cross plan, the stepped terraces down to the old Marina
 * wing, and the bronze lion at the Strip corner. Procedural, CC0-1.0.
 * bun generators/lv-mgm-grand.ts
 *
 * Also a small kit shared by this builder's other Las Vegas models (the
 * arena, the stadium, the airport tower, the welcome sign): faces oriented
 * by a wanted normal, profile extrusions in any vertical plane, and solids
 * of revolution. Importing this file builds nothing; running it writes
 * models/lv-mgm-grand.glb.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the wings run within
 * 1° of the compass, so the plan is drawn in OSM's own orientation. The
 * origin is the area centroid of the tower parts below.
 *
 * Measured, from OSM:
 * - way/115093734, the cross: the north, east and south wings and the core,
 *   all 22 m wide with 4-5 m chamfers at the wing ends, tagged 89 m and 30
 *   levels, building:colour #018438;
 * - the west wing in slices: way/115095169 (30 levels), 115095172 (28),
 *   115095167 (26), 115095174 (24), 115095166 (22), 115095173 (20),
 *   115095160 (18), each about 8.5 m long, then way/115095161 (tagged 18
 *   levels) running 120 m on to the Strip;
 * - the lion's round pedestal, from the 2023 NAIP orthophoto (USGS, public
 *   domain): a drum about 15 m across at the Strip and Tropicana corner.
 *
 * Published (Wikipedia, "MGM Grand Las Vegas"): 30 storeys, "excluding a
 * 14-story section, which originally opened as the Marina Hotel in 1975"
 * and is now the west wing; "the hotel's exterior consists of green glass
 * panels, originally meant to evoke Emerald City". The lion is 45 ft
 * (13.7 m) tall on a 25 ft (7.6 m) pedestal, the largest bronze statue in
 * the US (Snellen Johnson, 1997).
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - p1 "20080404-Vegas-MGMGrand-Day.jpg", Bobak Ha'Eri, CC BY 3.0, and
 *   p2 "Las Vegas MGM Grand at day 2013.jpg", Tuxyso, CC BY-SA 3.0: from
 *   the west, the north and south wings' long faces with the stepped west
 *   wing coming at the camera between them, and the lion on its drum;
 * - p7 "MGM Grand Hotel.jpg", Clément Bardot, CC BY-SA 4.0: from the
 *   south-west, the staircase of terraces with a slanted glass riser on
 *   every step, down to the low Marina block;
 * - p5 "Las Vegas MGM Grand P4220724.jpg", Alexander Migl, CC BY-SA 4.0:
 *   from the north-west, the north wing's face and the steps beyond;
 * - p9 "Las Vegas. MGM Grand Las Vegas visto dall'Excalibur.jpg", André
 *   Corboz, CC BY-SA 4.0 (1990s): the staircase ending on the flat Marina;
 * - p8 "MGM Lion in Las Vegas.JPG", Simeon87, CC BY-SA 3.0: the lion in
 *   profile, lying with its head up, facing the Strip, on a pale fluted drum;
 * - a1 "Las Vegas Strip During Takeoff from McCarran International Airport
 *   (15517068968)", Ken Lund, CC BY-SA 2.0: the cross from the air.
 *
 * Estimated: the Marina wing at 14 storeys of 3.1 m (OSM's 18 levels would
 * put it level with the lowest step, which every photo shows above it);
 * the green bands (one light band every four floors, the top two floors
 * solid), which abstract the real per-floor striping; the slanted glass
 * on each step (4.5 m of each 6 m riser, from p7); a seventh step at 16
 * levels, over the Marina's east end, where p7 counts more steps than OSM's
 * six; the lion's proportions, from p8.
 *
 * Not modelled: the casino podium, the arena and the glass rotunda behind
 * the lion (their own OSM buildings), the signs and lettering.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, ccw, chamfer, prism, save, triangulate, type XY } from './lv-wynn'

// ================================================================ the kit

const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle wound so its normal points along `want`. */
export function triTo(p: Part, a: V3, b: V3, c: V3, want: V3) {
  if (dot3(cross3(sub3(b, a), sub3(c, a)), want) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
/** A quad (planar, convex) wound so its normal points along `want`. */
export function quadTo(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  triTo(p, a, b, c, want)
  triTo(p, a, c, d, want)
}

/**
 * A vertical plane to draw profiles in: `o` its origin on the ground, `u`
 * the horizontal direction profile x runs along (a unit XY), profile y is
 * up, and the solid is extruded along w = u turned 90° clockwise.
 */
export type Plane = { o: XY; u: XY }
export const planeAt = (o: XY, bearingDeg: number): Plane => {
  const a = (bearingDeg * Math.PI) / 180
  return { o, u: [Math.sin(a), Math.cos(a)] }
}
const wOf = (pl: Plane): XY => [pl.u[1], -pl.u[0]]
export const inPlane = (pl: Plane, x: number, z: number, w: number): V3 => {
  const wv = wOf(pl)
  return [pl.o[0] + pl.u[0] * x + wv[0] * w, pl.o[1] + pl.u[1] * x + wv[1] * w, z]
}

/**
 * A profile (x along the plane, z up) extruded across the plane from w0 to
 * w1. `side(i)` picks the part for the face on edge i (from point i to
 * i + 1 of the counter-clockwise profile); the two flat ends go to `ends`.
 */
export function extrude(pl: Plane, prof: XY[], w0: number, w1: number, side: (i: number) => Part, ends: Part) {
  const r = ccw(prof), n = r.length, wv = wOf(pl)
  const P = (q: XY, w: number) => inPlane(pl, q[0], q[1], w)
  for (let i = 0; i < n; i++) {
    const a = r[i], b = r[(i + 1) % n]
    const dx = b[0] - a[0], dz = b[1] - a[1]
    // Outward normal of a ccw profile edge is (dz, -dx) in profile space.
    const want: V3 = [pl.u[0] * dz, pl.u[1] * dz, -dx]
    quadTo(side(i), P(a, w0), P(b, w0), P(b, w1), P(a, w1), want)
  }
  for (const [i, j, k] of triangulate(r)) {
    triTo(ends, P(r[i], w1), P(r[j], w1), P(r[k], w1), [wv[0], wv[1], 0])
    triTo(ends, P(r[i], w0), P(r[j], w0), P(r[k], w0), [-wv[0], -wv[1], 0])
  }
}

/**
 * A solid of revolution about a vertical axis at c: `prof` is [radius, z]
 * from the bottom up; radius 0 closes a pole. Smooth-shaded sides.
 */
export function lathe(p: Part, c: XY, prof: [number, number][], seg = 16, a0 = 0, top: Part | null = null) {
  const ring = (r: number, z: number): V3[] =>
    Array.from({ length: seg }, (_, i) => {
      const a = a0 + (i / seg) * Math.PI * 2
      return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, z] as V3
    })
  const rings = prof.map(([r, z]) => ring(r, z))
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    // Normal of the profile segment, for smooth shading round the ring.
    const dr = r1 - r0, dz = z1 - z0, l = Math.hypot(dr, dz) || 1
    const nr = dz / l, nz = -dr / l
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg
      const a = (i / seg) * Math.PI * 2 + a0, b = (j / seg) * Math.PI * 2 + a0
      const na: V3 = [Math.cos(a) * nr, Math.sin(a) * nr, nz], nb: V3 = [Math.cos(b) * nr, Math.sin(b) * nr, nz]
      const A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i]
      if (r0 > 1e-6) p.tri(A, B, C, [0, 0], [0, 0], [0, 0], [na, nb, nb])
      if (r1 > 1e-6) p.tri(A, C, D, [0, 0], [0, 0], [0, 0], [na, nb, na])
    }
  }
  const [rt, zt] = prof[prof.length - 1]
  if (top && rt > 1e-6) cap(top, rings[prof.length - 1].map(([x, y]) => [x, y] as XY), zt)
}

/** Walls only, round a ring, from z0 to z1. */
export function walls(p: Part, ring: XY[], z0: number, z1: number) {
  const r = ccw(ring)
  p.loft([r.map(([x, y]): V3 => [x, y, z0]), r.map(([x, y]): V3 => [x, y, z1])])
}

/** A rectangle ring from its corner extents. */
export const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ================================================================ MGM Grand

if (import.meta.main) {
  const glass = new Part() // the green curtain wall
  const band = new Part() // the light green floor bands and the top floors
  const roof = new Part()
  const sky = new Part() // the slanted glass risers of the terraces
  const bronze = new Part() // the lion
  const stone = new Part() // the lion's drum

  /** Anchor: the area centroid of the tower parts, in OSM-local metres. */
  const AX = 31.8, AY = -8.8
  const L = (pts: XY[]): XY[] => pts.map(([x, y]) => [x - AX, y - AY])

  const FLOOR = 89 / 30
  const H = 89
  const CROWN = 2 * FLOOR // the solid top two floors
  const BAND = 1.8
  /** Light band lines every four floors, below the crown. */
  const bandsUnder = (top: number) => {
    const out: number[] = []
    for (let k = 1; k * 4 * FLOOR + BAND / 2 < top - 1.5; k++) out.push(k * 4 * FLOOR)
    return out
  }

  /**
   * A banded green block: glass, a light band every four floors, the top
   * `crown` metres light, then a bevelled roof. `ring` is already chamfered.
   */
  function block(ring: XY[], top: number, crown = CROWN) {
    let z = 0
    for (const b of bandsUnder(top - crown)) {
      walls(glass, ring, z, b - BAND / 2)
      walls(band, ring, b - BAND / 2, b + BAND / 2)
      z = b + BAND / 2
    }
    walls(glass, ring, z, top - crown)
    prism(band, roof, ring, top - crown, top, 0.5, 0)
  }

  // The cross: north, east and south wings and the core at 30 storeys, and
  // the first 50 m of the west wing (way/115093734 with way/115095169, its
  // chevron notch squared off at the 30-level slice's west edge).
  const CROSS: XY[] = L([
    [69.2, 104.2], [69.2, 108.0], [65.5, 111.8], [51.9, 111.7], [47.9, 108.2], [48.3, 7.4], [42.7, 1.4],
    [-8.8, 0.9], [-8.8, -21.0],
    [42.2, -20.6], [48.5, -27.1], [48.8, -123.2], [53.1, -128.1], [65.8, -128.2], [70.7, -123.8], [70.6, -27.1],
    [77.0, -20.2], [175.1, -18.3], [179.3, -13.7], [179.2, -1.1], [173.8, 4.6], [76.9, 1.7], [70.4, 8.0],
  ])
  block(chamfer(ccw(CROSS), 0.6), H)

  // The terraces: seven steps of two storeys from 28 down to 16 levels, each
  // with a slanted glass riser on its west edge (p7), extruded across the
  // wing. Their west edges are the OSM slices' west edges.
  const WEST = [-68.2, -59.7, -51.0, -43.0, -34.0, -26.0, -17.0, -8.8]
  const LEVELS = [16, 18, 20, 22, 24, 26, 28]
  const Y0 = -21.0 - AY, Y1 = 0.9 - AY
  const SLANT = 4.5
  const across = planeAt([0, 0], 90) // profile x runs east, extruded southward
  for (let k = 0; k < LEVELS.length; k++) {
    const x0 = WEST[k] - AX, x1 = WEST[k + 1] - AX, h = LEVELS[k] * FLOOR
    // The step's own band lines, then the green wall up to the slant.
    const ring = rect(x0, x1, Y0, Y1)
    let z = 0
    for (const b of bandsUnder(h - SLANT)) {
      // North and south faces only: the east face is hidden in the next step.
      for (const [a, c] of [[ring[0], ring[1]], [ring[2], ring[3]]] as [XY, XY][]) {
        const want: V3 = a[1] === Y0 ? [0, -1, 0] : [0, 1, 0]
        quadTo(glass, [a[0], a[1], z], [c[0], c[1], z], [c[0], c[1], b - BAND / 2], [a[0], a[1], b - BAND / 2], want)
        quadTo(band, [a[0], a[1], b - BAND / 2], [c[0], c[1], b - BAND / 2], [c[0], c[1], b + BAND / 2], [a[0], a[1], b + BAND / 2], want)
      }
      z = b + BAND / 2
    }
    // From the last band up: a profile with the slanted riser, extruded
    // across the wing (w runs from north to south: w = -y).
    const prof: XY[] = [[x0, z], [x1, z], [x1, h], [x0 + SLANT, h], [x0, h - SLANT]]
    extrude(across, prof, -Y1, -Y0, (i) => (i === 3 ? sky : i === 2 ? roof : glass), glass)
    // The west face from the lower step's roof up to where the profile starts.
    const below = k === 0 ? 14 * 3.1 : LEVELS[k - 1] * FLOOR
    if (z > below) quadTo(glass, [x0, Y0, below], [x0, Y1, below], [x0, Y1, z], [x0, Y0, z], [-1, 0, 0])
  }

  // The Marina: the original 14-storey hotel, now the west wing, to the Strip.
  const MARINA_H = 14 * 3.1
  // Its east end runs on under the first step, so the joint shows no notch.
  const MARINA: XY[] = L([[-176.6, -1.0], [-176.7, -18.3], [-64, -19.4], [-64, -1.0]])
  block(chamfer(ccw(MARINA), 0.6), MARINA_H, 2 * 3.1)

  // The lion on its drum at the corner, facing the intersection.
  const LION: XY = [-219.6 - AX, -129.6 - AY]
  const DRUM_R = 7.5, DRUM_H = 7.6
  lathe(stone, LION, [[DRUM_R + 1.2, 0], [DRUM_R + 1.2, 1.2], [DRUM_R, 1.2], [DRUM_R, DRUM_H - 0.4], [DRUM_R - 0.4, DRUM_H]], 16, 0, roof)
  // The lion, lying with its head up (p8): the haunch and body, the mane,
  // the head, then the forelegs, as side profiles extruded across, in a
  // plane facing bearing 240° (towards the corner). Profile x runs forward.
  const lionPlane = planeAt(LION, 240)
  const zl = DRUM_H
  const lift = (pts: XY[]): XY[] => pts.map(([x, z]) => [x, z + zl])
  const body: XY[] = lift([[-7.2, 0], [2.5, 0], [2.8, 4.5], [0.5, 7.4], [-2.5, 6.4], [-5.2, 6.4], [-6.9, 5.2], [-7.6, 2.8]])
  const mane: XY[] = lift([[-1.4, 3.5], [3.8, 3.0], [5.0, 7.0], [4.6, 11.0], [2.6, 12.8], [0.2, 12.2], [-1.8, 9.0]])
  const head: XY[] = lift([[3.4, 8.0], [7.2, 8.4], [8.2, 9.6], [7.9, 11.0], [6.2, 13.0], [4.4, 13.7], [3.2, 12.0]])
  const paw: XY[] = lift([[1.0, 0], [7.8, 0], [8.1, 1.4], [7.0, 1.9], [3.6, 2.1], [1.8, 4.2]])
  const B = () => bronze
  extrude(lionPlane, body, -3.0, 3.0, B, bronze)
  extrude(lionPlane, mane, -3.9, 3.9, B, bronze)
  extrude(lionPlane, head, -2.2, 2.2, B, bronze)
  extrude(lionPlane, paw, -3.0, -1.2, B, bronze)
  extrude(lionPlane, paw, 1.2, 3.0, B, bronze)

  const parts = [
    { part: glass, material: windowVariant(2, 0x5b8f7c) },
    { part: band, material: finish('mgm-emerald', 0x96c3ad) },
    { part: roof, material: PALETTE.roof },
    { part: sky, material: PALETTE.glass },
    { part: bronze, material: finish('mgm-bronze', 0xc9a25f, 0.5) },
    { part: stone, material: PALETTE.stone },
  ]
  await save('lv-mgm-grand', 'MGM Grand Las Vegas', parts, H,
    'Y up, -Z north, +X east, metres; origin at the area centroid of the tower parts (way/115093734 and the west-wing slices); bearing 0')
}
