/**
 * Nathan's Famous, the original stand at Surf and Stillwell Avenues, Coney
 * Island (1916) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-nathans-famous.ts
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0 (the Surf Avenue
 * front runs due east–west). Anchor: area centroid of OSM way/248474744 and
 * way/248474704 together (-73.981459, 40.575224). The building stands on
 * the south-west corner of the intersection: its north front faces Surf
 * Avenue, its east front Stillwell Avenue, its west side the picnic yard on
 * Schweikerts Walk.
 *
 * Evidence
 * - OSM: way/248474744 (Nathan's, 1310 Surf Avenue, building=retail,
 *   height 8.3) is the low stand; way/248474704 (building=retail, height
 *   12.6, no name) is the taller block behind it on Stillwell, under the
 *   Wall of Fame. Both outlines are used as drawn: the Surf front is square
 *   to the compass and the other walls run about 7° off it.
 * - NYC lidar (USGS 3DEP NY_NewYorkCity, 2017), read at 0.5 m: the ground
 *   rises about 0.5 m from the Surf front to the south wall (y = 0 is the
 *   Surf side). The stand's roof is at 7.5–8.4 m either side of a lower
 *   north–south strip (4.8 m, x = -6.9…1.1); the sign boards round the
 *   north, east and west edges stand to 8.6–9.3 m; the rear block's roof
 *   is at 12.8 m; a billboard on its north edge reaches 16.6 m; the Wall
 *   of Fame's crest about 15 m.
 * - Photos (Wikimedia Commons):
 *   - "MTA Coney Is Stillwell 26 - Nathan's Famous.jpg", Tdorante10, CC BY-SA
 *     4.0 (from the north-east corner of the intersection: both fronts, the
 *     rear billboard, both mascots, the vertical neon sign)
 *   - "NathansHotDog-1 (48034164583).jpg", Ajay Suresh, CC BY 2.0 (the
 *     Stillwell front square on: the Wall of Fame scoreboard over the yellow
 *     wall with its red doors, the sign board, the Clam Bar band)
 *   - "The Original Nathans Hot Dogs Coney Island, NY 2 (48596261392).jpg",
 *     Mike Kalasnik, CC BY-SA 2.0 (the Surf front: "This is the original",
 *     "Follow the crowd", the vertical sign, the mascot on the roof)
 *   - "Nathan's Famous Coney Island 002/003/004/008/009.jpg", Kidfly182,
 *     CC BY 4.0, and "Nathan's Famous frankfurters (1310 Surf Avenue …)
 *     001.jpg", Leonard J. DeFrancisci, CC BY-SA 3.0 (the sign boards, the
 *     yellow Sea Food / Delicatessen band, the striped awnings, the vertical
 *     sign's stepped shape, the flood lamps on arms)
 *   - "Coney Island Surf Av 08 - Nathan's Famous.jpg", Tdorante10, CC BY-SA
 *     4.0 (the west side on the picnic yard: glass doors, awning, boards,
 *     the hanging "Original Nathans" sign)
 *   - "Coney Island Brooklyn Jul 2019 02.jpg", Epicgenius, CC BY-SA 4.0
 *     (the Stillwell front from the north-east)
 *
 * Heights of the bands, from the photos scaled to the lidar sign tops:
 * shopfront glazing 0.9–2.9 m, the striped awning to 3.4 m, the yellow
 * band 3.4–4.9 m, the white sign boards 4.9 m to their tops, the vertical
 * sign 3.6–10.2 m, the Wall of Fame 4.0–13.6 m with its crest to 15.2 m.
 * Estimated: the mascots' size (about 3.5 m, from Stillwell 26 and
 * Kalasnik), the rear billboard's width (from the lidar and Stillwell 26),
 * the vertical sign's widths. The south wall and the west wall of the rear
 * block aren't photographed and are drawn plain. A second billboard the
 * lidar shows at the rear block's south-west corner (16 m) isn't in any
 * photo and is left out.
 *
 * The green "Nathan's" script is the sign people know, so it is drawn as
 * lettering (STYLE.md, "Famous signs"), traced from the Kidfly182 and
 * Kalasnik photos: an upright script, a long swash under it. The other
 * words on the boards (red "THIS IS THE ORIGINAL", the Delicatessen bulb
 * letters, FAMOUS FRANKFURTERS) are left off; the vertical sign keeps its
 * stacked NATHANS because it is the stand's night-time emblem.
 *
 * Night: the Delicatessen band, the vertical sign, the rear billboard and
 * the Take Home Food box glow (neon); the Wall of Fame and the shopfronts
 * are lit (window); the flood lamps on their arms are lamp beads, and the
 * white boards they light carry _FLOODLIGHT.
 *
 * Six materials: the white of the boards serves the walls and the flat
 * roofs too, which are pale membrane in the photos taken from the
 * Thunderbolt and the Wonder Wheel's direction.
 */
import { Part, type V3, sub, cross } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, prism, type XY } from './nyc-570-lexington'
import { Pen, strokes } from './lettering'

const white = new Part(), yellow = new Part(), green = new Part(), red = new Part(), glaze = new Part(), lamp = new Part()

// ---------------------------------------------------------------------------
// Plan (OSM, metres from the anchor).
// ---------------------------------------------------------------------------
const NW: XY = [-16.73, 19.46], NE: XY = [12.1, 19.62], E: XY = [15.09, -2.42]
const SE: XY = [16.32, -17.79], SW: XY = [-11.41, -21.54], W: XY = [-13.24, -6.26]
const ROOF_HI = 7.6, ROOF_LO = 4.8, REAR = 12.8
const BAND0 = 3.4, BAND1 = 4.9
const TROUGH0 = -6.9, TROUGH1 = 1.1

// ---------------------------------------------------------------------------
// Helpers: a frame on a wall or sign, oriented faces, boxes in that frame.
// ---------------------------------------------------------------------------
type Frame = { at: (s: number, z: number, d?: number) => V3; xy: (s: number, d?: number) => XY; u: V3; n: V3; L: number }
/** A frame at `o` running along `dir`; d points to the right of dir (the outside of a counter-clockwise ring). */
function frame(o: XY, dir: XY, L = 0): Frame {
  const l = Math.hypot(dir[0], dir[1]), u: XY = [dir[0] / l, dir[1] / l], n: XY = [u[1], -u[0]]
  return {
    at: (s, z, d = 0) => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d, z],
    xy: (s, d = 0) => [o[0] + u[0] * s + n[0] * d, o[1] + u[1] * s + n[1] * d],
    u: [u[0], u[1], 0], n: [n[0], n[1], 0], L,
  }
}
const along = (a: XY, b: XY) => frame(a, [b[0] - a[0], b[1] - a[1]], Math.hypot(b[0] - a[0], b[1] - a[1]))
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]]
const UP: V3 = [0, 0, 1], DOWN: V3 = [0, 0, -1]

/** A convex polygon, wound to face `want`. */
function face(p: Part, pts: V3[], want: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] >= 0 ? pts : [...pts].reverse()
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
/** A closed box in a frame: s0…s1 along, z0…z1 up, d0…d1 out. */
function slab(p: Part, F: Frame, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number) {
  const P = (s: number, z: number, d: number) => F.at(s, z, d)
  face(p, [P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1)], F.n)
  face(p, [P(s0, z0, d0), P(s1, z0, d0), P(s1, z1, d0), P(s0, z1, d0)], neg(F.n))
  face(p, [P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0)], neg(F.u))
  face(p, [P(s1, z0, d0), P(s1, z0, d1), P(s1, z1, d1), P(s1, z1, d0)], F.u)
  face(p, [P(s0, z1, d0), P(s1, z1, d0), P(s1, z1, d1), P(s0, z1, d1)], UP)
  if (z0 > 0.01) face(p, [P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1)], DOWN)
}
/** A flat panel on a wall, facing out. */
const panel = (p: Part, F: Frame, s0: number, s1: number, z0: number, z1: number, d: number) =>
  face(p, [F.at(s0, z0, d), F.at(s1, z0, d), F.at(s1, z1, d), F.at(s0, z1, d)], F.n)
/** A sloping shop awning: from the wall at zTop out to `out` metres at zBot, with a valance. */
function awning(p: Part, F: Frame, s0: number, s1: number, zTop: number, zBot: number, out: number, d0 = 0) {
  const t0 = F.at(s0, zTop, d0), t1 = F.at(s1, zTop, d0), b0 = F.at(s0, zBot, d0 + out), b1 = F.at(s1, zBot, d0 + out)
  const v0 = F.at(s0, zBot - 0.3, d0 + out), v1 = F.at(s1, zBot - 0.3, d0 + out), w0 = F.at(s0, zBot - 0.3, d0), w1 = F.at(s1, zBot - 0.3, d0)
  const slope: V3 = [F.n[0] * (zTop - zBot), F.n[1] * (zTop - zBot), out]
  face(p, [t0, b0, b1, t1], slope)
  face(p, [b0, v0, v1, b1], F.n)
  face(p, [w0, w1, v1, v0], DOWN)
  face(p, [t0, b0, v0, w0], neg(F.u))
  face(p, [t1, b1, v1, w1], F.u)
}
/** An upright cylinder (optionally tapering), capped. */
function cylinder(p: Part, c: XY, r0: number, r1: number, z0: number, z1: number, n = 10, top = true) {
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
    const P = (a: number, r: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
    face(p, [P(a0, r0, z0), P(a1, r0, z0), P(a1, r1, z1), P(a0, r1, z1)], [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
    if (top) face(p, [[c[0], c[1], z1], P(a0, r1, z1), P(a1, r1, z1)], UP)
  }
}
/** A square post standing on the plan. */
function post(p: Part, c: XY, w: number, z0: number, z1: number) {
  slab(p, frame([c[0] - w / 2, c[1] + w / 2], [1, 0]), 0, w, z0, z1, 0, w)
}

// ---------------------------------------------------------------------------
// The green script "Nathan's", traced from the sign boards: upright, the
// lower case on a 0.55 x-height, the swash under "athan's". About 3.7
// units wide on a cap height of 1, origin at the left end of the baseline.
// ---------------------------------------------------------------------------
function script(): { letters: Pen; swash: Pen } {
  const L = new Pen()
  L.moveTo([0.06, 0]).lineTo([0.18, 1.0]).lineTo([0.58, 0.03]).lineTo([0.7, 1.0]).quadTo([0.74, 1.08], [0.86, 1.04], 2)
  const bowl = (cx: number) => {
    L.circle([cx, 0.25], 0.19, 0.23, 8)
    L.moveTo([cx + 0.2, 0.5]).lineTo([cx + 0.2, 0.08]).quadTo([cx + 0.22, 0], [cx + 0.31, 0.04], 2)
  }
  bowl(1.0)
  L.moveTo([1.45, 0.92]).lineTo([1.45, 0.08]).quadTo([1.47, 0], [1.56, 0.04], 2)
  L.moveTo([1.32, 0.6]).lineTo([1.62, 0.6])
  const arch = (x0: number, x1: number, top: number) => {
    L.moveTo([x0, top]).lineTo([x0, 0])
    L.moveTo([x0, 0.3]).quadTo([x0 + 0.03, 0.56], [(x0 + x1) / 2, 0.56], 2).quadTo([x1, 0.56], [x1, 0.3], 2).lineTo([x1, 0])
  }
  arch(1.72, 2.04, 0.98)
  bowl(2.3)
  arch(2.7, 3.02, 0.54)
  L.moveTo([3.17, 0.98]).lineTo([3.13, 0.74])
  L.moveTo([3.52, 0.47]).cubicTo([3.42, 0.58], [3.24, 0.5], [3.32, 0.36], 3).cubicTo([3.4, 0.24], [3.6, 0.2], [3.5, 0.07], 3).cubicTo([3.42, -0.03], [3.27, 0.02], [3.24, 0.06], 2)
  const S = new Pen()
  S.moveTo([0.5, -0.2]).lineTo([3.72, -0.2])
  return { letters: L, swash: S }
}
const SCRIPT = script()
/** The script on a face, centred at s, baseline at z, `k` metres per unit, standing `d` out. */
function nathans(F: Frame, s: number, z: number, k: number, d: number) {
  const place = (u: number, v: number, w: number): V3 => F.at(s + (u - 1.86) * k, z + v * k, d + w)
  strokes(green, SCRIPT.letters.paths, { width: 0.21, depth: 0.05, place })
  strokes(green, SCRIPT.swash.paths, { width: 0.26, depth: 0.05, place })
}

// ---------------------------------------------------------------------------
// Massing: the stand (high roofs either side of the lower middle strip),
// the rear block, from the OSM outlines.
// ---------------------------------------------------------------------------
/** The part of a ring between two x values. */
function clipX(ring: XY[], x0: number, x1: number): XY[] {
  const cut = (pts: XY[], x: number, keepAbove: boolean) => {
    const out: XY[] = []
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      const ia = keepAbove ? a[0] >= x : a[0] <= x, ib = keepAbove ? b[0] >= x : b[0] <= x
      if (ia) out.push(a)
      if (ia !== ib) { const t = (x - a[0]) / (b[0] - a[0]); out.push([x, a[1] + t * (b[1] - a[1])]) }
    }
    return out
  }
  return cut(cut(ring, x0, true), x1, false)
}
const stand: XY[] = [NW, W, E, NE]
prism({ wall: white, win: null, roof: white, ring: clipX(stand, -99, TROUGH0), z0: 0, z1: ROOF_HI, facade: null, bevel: 0 })
prism({ wall: white, win: null, roof: white, ring: clipX(stand, TROUGH0, TROUGH1), z0: 0, z1: ROOF_LO, facade: null, bevel: 0 })
prism({ wall: white, win: null, roof: white, ring: clipX(stand, TROUGH1, 99), z0: 0, z1: ROOF_HI, facade: null, bevel: 0 })
prism({ wall: white, win: null, roof: white, ring: [W, SW, SE, E], z0: 0, z1: REAR, facade: null, bevel: 0.4 })

// Faces, each running left to right as seen from outside.
const fN = along(NE, NW) // Surf Avenue
const fE = along(E, NE) // Stillwell Avenue, the stand
const fER = along(SE, E) // Stillwell Avenue, the rear block (Wall of Fame)
const fW = along(NW, W) // the picnic yard, the stand
const fRN = along(E, W) // the rear block's north wall, over the stand's roof

// ---------------------------------------------------------------------------
// Shopfronts: glazing between white piers, the awnings, the Clam Bar band.
// ---------------------------------------------------------------------------
function glazing(F: Frame, s0: number, s1: number, z0: number, z1: number, bay: number) {
  const n = Math.max(1, Math.round((s1 - s0) / bay)), w = (s1 - s0) / n
  for (let k = 0; k < n; k++) panel(glaze, F, s0 + k * w + 0.18, s0 + (k + 1) * w - 0.18, z0, z1, 0.05)
}
glazing(fN, 0.6, fN.L - 0.6, 0.9, 2.9, 2.9)
awning(green, fN, 0.3, fN.L - 0.3, BAND0, 2.75, 1.1, 0.05)
glazing(fE, 0.6, fE.L - 0.6, 0.9, 2.9, 2.6)
slab(glaze, fE, 0.4, 13.4, 2.95, BAND0, 0.05, 0.35) // the blue CLAM BAR band
awning(green, fE, 13.4, fE.L - 0.3, BAND0, 2.75, 1.0, 0.05)
// The west side: folding glass doors under a long awning.
glazing(fW, 0.6, fW.L - 0.8, 0.35, 2.8, 2.2) // ground about 0.3 m up at the south end
awning(green, fW, 0.3, fW.L - 0.3, 3.3, 2.8, 1.0, 0.05)

// ---------------------------------------------------------------------------
// The yellow Sea Food / Delicatessen band and the white sign boards, with
// a green line where the crowd frieze runs along the boards' foot.
// ---------------------------------------------------------------------------
slab(yellow, fN, 0.0, fN.L, BAND0, BAND1, 0.05, 0.45)
slab(yellow, fE, 0.0, fE.L + 0.4, BAND0, BAND1, 0.05, 0.45)
slab(white, fN, -0.4, fN.L + 0.3, BAND1, 9.2, 0.0, 0.3)
slab(white, fE, 0.0, fE.L, BAND1, 8.8, 0.0, 0.3)
slab(white, fW, 0.0, fW.L, 3.3, 8.8, 0.0, 0.3)
for (const [F, top] of [[fN, 9.2], [fE, 8.8]] as [Frame, number][]) {
  panel(green, F, 0.1, F.L - 0.1, BAND1 + 0.9, BAND1 + 1.05, 0.31)
  panel(white, F, 0.1, F.L - 0.1, top - 0.18, top - 0.08, 0.31)
}
// The boards' panel joints, as slim white ribs standing proud.
for (const s of [9.8, 19.4]) slab(white, fN, s - 0.12, s + 0.12, BAND1, 9.35, 0.3, 0.42)
slab(white, fE, 10.9, 11.15, BAND1, 8.95, 0.3, 0.42)
// The script: three on Surf ("This is the original", "Follow the
// crowd", "…more than just the best hot dog"), two on Stillwell.
nathans(fN, 4.9, 6.45, 1.6, 0.3)
nathans(fN, 14.6, 6.55, 1.6, 0.3)
nathans(fN, 24.6, 6.45, 1.45, 0.3)
nathans(fE, 5.4, 6.35, 1.4, 0.3)
nathans(fE, 16.6, 6.35, 1.45, 0.3)

// ---------------------------------------------------------------------------
// The vertical "ORIGINAL NATHANS FAMOUS FRANKFURTERS" sign on the Surf
// front, turned to face up Stillwell (north-east): yellow, a red rim, the
// stacked red letters on both faces, a stepped foot.
// ---------------------------------------------------------------------------
{
  const c = fN.xy(20.4, 1.75)
  const B = frame([c[0], c[1]], [-Math.SQRT1_2, Math.SQRT1_2]) // faces NE
  const parts: [number, number, number][] = [[0.75, 6.0, 10.4], [1.1, 5.3, 6.0], [1.45, 3.6, 5.3]]
  for (const [hw, z0, z1] of parts) {
    slab(red, B, -hw - 0.12, hw + 0.12, z0 - 0.12, z1 + 0.12, -0.14, 0.14)
    slab(yellow, B, -hw, hw, z0, z1, -0.22, 0.22)
  }
  // NATHANS, top to bottom: the sign's condensed sans capitals as drawn
  // in Kidfly182 002 and 009 (straight-sided N, H, T, a pointed A, a
  // round-shouldered S), 0.48 m tall.
  const L = new Pen()
  const glyph: Record<string, (x: number, y: number) => void> = {
    N: (x, y) => { L.moveTo([x - 0.3, y]).lineTo([x - 0.3, y + 1]).lineTo([x + 0.3, y]).lineTo([x + 0.3, y + 1]) },
    A: (x, y) => { L.moveTo([x - 0.35, y]).lineTo([x, y + 1]).lineTo([x + 0.35, y]); L.moveTo([x - 0.2, y + 0.38]).lineTo([x + 0.2, y + 0.38]) },
    T: (x, y) => { L.moveTo([x - 0.35, y + 1]).lineTo([x + 0.35, y + 1]); L.moveTo([x, y + 1]).lineTo([x, y]) },
    H: (x, y) => { L.moveTo([x - 0.3, y]).lineTo([x - 0.3, y + 1]); L.moveTo([x + 0.3, y]).lineTo([x + 0.3, y + 1]); L.moveTo([x - 0.3, y + 0.5]).lineTo([x + 0.3, y + 0.5]) },
    S: (x, y) => { L.moveTo([x + 0.3, y + 0.85]).quadTo([x + 0.05, y + 1.08], [x - 0.28, y + 0.82], 2).quadTo([x - 0.3, y + 0.55], [x, y + 0.5], 2).quadTo([x + 0.32, y + 0.42], [x + 0.28, y + 0.15], 2).quadTo([x - 0.02, y - 0.08], [x - 0.32, y + 0.15], 2) },
  }
  'NATHANS'.split('').forEach((ch, i) => glyph[ch](0, 6.5 - 1.18 * i))
  const k = 0.48
  for (const back of [false, true]) {
    const sg = back ? -1 : 1
    strokes(red, L.paths, { width: 0.24, depth: 0.05, place: (u, v, w) => B.at(sg * u * 0.9, 6.5 + v * k, sg * (0.22 + w)) })
  }
  // Bracket back to the boards.
  slab(white, fN, 20.25, 20.55, 8.6, 8.8, 0.3, 1.8)
  slab(white, fN, 20.25, 20.55, 4.6, 4.8, 0.45, 1.8)
}

// The yellow Take Home Food box on the corner of Surf and Stillwell.
{
  const c = fN.xy(-0.2, 0.9)
  const B = frame([c[0], c[1]], [-Math.SQRT1_2, Math.SQRT1_2])
  slab(red, B, -1.2, 1.2, 3.55, 6.45, -0.2, 0.2)
  slab(yellow, B, -1.08, 1.08, 3.67, 6.33, -0.28, 0.28)
}

// The hanging "Original Nathans" sign over the picnic yard, on its bracket.
slab(white, fW, 8.4, 8.6, 6.2, 6.35, 0.3, 2.1)
{
  const B = frame(fW.xy(8.5, 1.3), [fW.n[0], fW.n[1]])
  slab(red, B, -0.85, 0.85, 4.35, 6.15, -0.08, 0.08)
  slab(yellow, B, -0.75, 0.75, 4.45, 6.05, -0.14, 0.14)
}

// ---------------------------------------------------------------------------
// Flood lamps on arms over the boards (lamp beads; the boards they light
// carry _FLOODLIGHT through the white material).
// ---------------------------------------------------------------------------
function lamps(F: Frame, top: number, n: number, skip?: [number, number]) {
  for (let k = 0; k < n; k++) {
    const s = (F.L * (k + 0.5)) / n
    if (skip && s > skip[0] && s < skip[1]) continue
    slab(white, F, s - 0.07, s + 0.07, top - 0.1, top + 0.05, 0.0, 1.5)
    slab(white, F, s - 0.07, s + 0.07, top - 0.4, top + 0.05, 0.0, 0.14)
    slab(lamp, F, s - 0.28, s + 0.28, top - 0.32, top + 0.0, 1.3, 1.75)
  }
}
lamps(fN, 9.2, 8, [18.5, 22.5]) // none through the vertical sign
lamps(fE, 8.8, 6)
lamps(fW, 8.8, 7)

// ---------------------------------------------------------------------------
// The rear block on Stillwell: the yellow wall with its red doors and the
// painted script, the Wall of Fame scoreboard over it.
// ---------------------------------------------------------------------------
slab(yellow, fER, 0.0, fER.L, 0.0, 4.0, 0.0, 0.08)
// The ground here is about 0.5 m above the Surf front (y = 0), so the doors start there.
for (const s of [1.4, 3.6, 11.3, 13.5]) panel(red, fER, s - 0.7, s + 0.7, 0.55, 3.0, 0.1)
{
  // Scoreboard: a red frame, a blue face (lit), the Wall of Fame strip,
  // the shoulders and crest of its top edge.
  const s0 = 0.1, s1 = fER.L - 0.1, d0 = 0.08, d1 = 0.55
  const top = (s: number) => {
    const t = (s - s0) / (s1 - s0), e = Math.min(t, 1 - t) * (s1 - s0)
    const shoulder = 13.6 + Math.min(1, e / 1.4) * 1.0
    const crest = Math.max(0, 1 - Math.abs(t - 0.5) / 0.14) // the central bump
    return shoulder + 0.6 * Math.min(1, crest * 1.6)
  }
  const cols = [s0, s0 + 1.4, s0 + 0.36 * (s1 - s0), s0 + 0.5 * (s1 - s0), s0 + 0.64 * (s1 - s0), s1 - 1.4, s1]
  for (let i = 0; i < cols.length - 1; i++) {
    const a = cols[i], b = cols[i + 1]
    const P = (s: number, z: number, d: number) => fER.at(s, z, d)
    // Red frame body, closed.
    face(red, [P(a, 4.0, d1), P(b, 4.0, d1), P(b, top(b), d1), P(a, top(a), d1)], fER.n)
    face(white, [P(a, 4.0, d0), P(b, 4.0, d0), P(b, top(b), d0), P(a, top(a), d0)], neg(fER.n)) // the unlit back
    const ta = top(a), tb = top(b)
    const nTop: V3 = [-(tb - ta) * fER.u[0], -(tb - ta) * fER.u[1], b - a]
    face(red, [P(a, ta, d0), P(b, tb, d0), P(b, tb, d1), P(a, ta, d1)], nTop)
    face(red, [P(a, 4.0, d0), P(b, 4.0, d0), P(b, 4.0, d1), P(a, 4.0, d1)], DOWN)
    // Blue face inside the rim.
    const ia = Math.max(a, s0 + 0.35), ib = Math.min(b, s1 - 0.35)
    if (ib > ia) face(glaze, [P(ia, 5.2, d1 + 0.02), P(ib, 5.2, d1 + 0.02), P(ib, top(ib) - 0.35, d1 + 0.02), P(ia, top(ia) - 0.35, d1 + 0.02)], fER.n)
  }
  face(red, [fER.at(s0, 4.0, d0), fER.at(s0, 4.0, d1), fER.at(s0, top(s0), d1), fER.at(s0, top(s0), d0)], neg(fER.u))
  face(red, [fER.at(s1, 4.0, d0), fER.at(s1, 4.0, d1), fER.at(s1, top(s1), d1), fER.at(s1, top(s1), d0)], fER.u)
  // The Wall of Fame strip and the white logo plate on the crest.
  panel(glaze, fER, s0 + 0.35, s1 - 0.35, 4.15, 4.95, d1 + 0.02)
  const mid = (s0 + s1) / 2
  panel(white, fER, mid - 1.9, mid + 1.9, 13.75, 14.95, d1 + 0.03)
  nathans(fER, mid, 14.15, 0.8, d1 + 0.03)
}

// ---------------------------------------------------------------------------
// The rear billboard on the rear block's north edge, facing Surf Avenue.
// ---------------------------------------------------------------------------
slab(yellow, fRN, 5.5, 21.0, 9.0, 16.6, 0.0, 0.35)
nathans(fRN, 11.0, 13.2, 1.9, 0.35)

// ---------------------------------------------------------------------------
// The hot-dog mascots in chef's hats, each holding up a white "For over
// 100 years" board: one over "Follow the crowd" on Surf, one on the
// Stillwell side of the roof.
// ---------------------------------------------------------------------------
function mascot(c: XY, base: number, foot: number, facing: XY) {
  const F = frame(c, [-facing[1], facing[0]]) // n = facing; s runs to the viewer's right
  post(white, c, 0.3, base, foot)
  cylinder(red, c, 0.4, 0.56, foot, foot + 0.5, 10, false)
  cylinder(red, c, 0.56, 0.56, foot + 0.5, foot + 3.0, 10, false)
  cylinder(red, c, 0.56, 0.4, foot + 3.0, foot + 3.5, 10, true)
  cylinder(white, c, 0.48, 0.68, foot + 3.5, foot + 4.3, 10, true) // hat
  // The arm out to the board, and the board on its own post.
  // The board stands to the viewer's right.
  slab(red, F, 0.5, 1.3, foot + 2.3, foot + 2.55, -0.12, 0.12)
  post(white, F.xy(2.6, 0), 0.25, base, foot + 1.6)
  slab(red, F, 1.2, 4.0, foot + 1.5, foot + 3.3, -0.12, 0.12)
  slab(white, F, 1.32, 3.88, foot + 1.62, foot + 3.18, -0.17, 0.17)
}
mascot([-1.5, 16.6], ROOF_LO, 9.4, [0, 1])
mascot([11.0, 6.0], ROOF_HI, 9.0, [1, 0.12])

/** On the outer face of a sign board: facing out, standing just proud of the wall line. */
const BOARDS = [fN, fE, fW]
function onBoard(F: Frame, p: V3, n: V3) {
  const o = F.at(0, 0, 0), d = (p[0] - o[0]) * F.n[0] + (p[1] - o[1]) * F.n[1]
  return n[0] * F.n[0] + n[1] * F.n[1] > 0.9 && d > 0.2 && d < 0.5
}
finishModel("Nathan's Famous, Coney Island", 'nyc-nathans-famous', [
  {
    part: white,
    material: {
      ...finish('nathans-white', 0xf3eee3),
      // The flood lamps light the boards on Surf, Stillwell and the yard.
      floodlight: (p: V3, n: V3) => (p[2] > 4.6 && p[2] < 9.5 && BOARDS.some((F) => onBoard(F, p, n)) ? 0.85 : 0),
    },
  },
  { part: yellow, material: finish('neon-nathans-yellow', 0xe9c23e) },
  { part: green, material: finish('nathans-green', 0x2f8a5c) },
  { part: red, material: finish('neon-nathans-red', 0xc8402f) },
  { part: glaze, material: { ...PALETTE.window, color: 0x4f6c98 } },
  { part: lamp, material: finish('lamp-flood', 0x8a8f96) },
], { bearing: 0, osm: 'way/248474744', height: 16.6 })
