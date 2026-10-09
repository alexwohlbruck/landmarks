/**
 * Metropolitan Opera House, Lincoln Center — procedural, CC0-1.0, no
 * textures.
 * bun generators/nyc-met-opera.ts
 *
 * Also the small kit for the Lincoln Center trio of this batch
 * (nyc-david-geffen-hall and nyc-koch-theater import `face`, `cube`,
 * `archFace` and `vault` from here). The model is only written when this
 * file is run directly.
 *
 * Map frame: x = model east (the plaza front, towards Columbus Avenue),
 * y = model north (Hearst Plaza), z up, metres. Placed at bearing 29°, the
 * Manhattan grid. Anchor: area centroid of the OSM outline way/265354534.
 *
 * Identifying features (from the photos):
 * 1. The plaza front: five tall round arches, true semicircles springing
 *    high up, on slender travertine piers, under a thin flat band.
 * 2. The deep loggia behind them: barrel-vault soffits back to a glass wall
 *    (dark glass with the lobby behind, arched at the head like the arches),
 *    a balcony line about 5 m up and the lit entrance doors under it.
 * 3. The long sides: closely set full-height travertine fins with shadowed
 *    glass between, under a plain top band.
 * 4. The tall plain stage house rising behind the front block.
 * 5. Cream travertine throughout.
 *
 * Evidence
 * - OSM way/265354534 (outline, 137 × 52 m, plus the south wing to
 *   y = −33) and its parts 330177538 (main block), 1475173703 (south wing),
 *   1475173704 (stage house, x −48…−5, y −15…18).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/lc/rot.py), above the Amsterdam Avenue sidewalk,
 *   the lowest ground under the footprint (19.6 m NAVD88): the plaza in
 *   front 5.0–5.4 m (ground returns); main roof 33.6–33.9 m; stage house
 *   45.0 m; a lower roof well at the rear, 27 m, x −62…−50; the south
 *   wing 13.7 m.
 * - Published: Wallace K. Harrison, opened 1966; the facade's five arches
 *   about 96 ft (29 m) tall (Wikipedia; Lincoln Center).
 * - Photos (Wikimedia Commons, daylight): the front head-on (D. Benjamin
 *   Miller, CC0), the north side from Hearst Plaza and the front corners
 *   (Epicgenius, CC BY-SA 4.0), the roof from a nearby tower (Ostarrichi,
 *   CC BY-SA 4.0); /tmp/city/nyc/work/nyc-met-opera/photos/credits.txt.
 *
 * Measured from the head-on photo, scaled to the 51.9 m front: arch clear
 * span 8.7 m (radius 4.33), crown 1.3 m under the roof, so springing 28.2 m
 * up; piers 1.5 m (1.3 m at the corners); balcony line 5 m above the plaza.
 * Estimated: the loggia's depth (5.2 m), the fins' pitch (drawn 3.0 m, a
 * little wider than the real ~1.5 m so they read), the top band, the rear
 * (Amsterdam Avenue) wall, drawn plain as no licensed photo of it was found.
 * The plaza, the fountain and the trees are not modelled. y = 0 is the
 * Amsterdam Avenue sidewalk; the front's detail starts at the plaza level,
 * 5.2 m up, as STYLE.md asks for the uphill side.
 */
import { Part, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { finishModel, massing, unit, type XY } from './nyc-570-lexington'

// ===========================================================================
// Kit for the Lincoln Center trio
// ===========================================================================

const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const sb = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** A quad whose winding is flipped if needed so its normal points along `want`. */
export function quadTo(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cr(sb(b, a), sb(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** An axis-aligned box: four sides and a top (and a bottom if asked). */
export function cube(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bottom = false) {
  const r: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const t = r.map(([x, y]) => [x, y, z1] as V3)
  p.loft([r, t]); p.cap(t, true); if (bottom) p.cap(r, false)
}

/**
 * A wall frame on the line a→b (counter-clockwise ring order, so it faces
 * out): `at(s, z, d)` is s along the wall, z up, d out from the face.
 */
export function face(a: XY, b: XY) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const n: V3 = [uy, -ux, 0]
  const at = (s: number, z: number, d = 0): V3 => [a[0] + ux * s + n[0] * d, a[1] + uy * s + n[1] * d, z]
  /** A flat rectangle s0..s1, z0..z1 at d, facing out. */
  const rect = (p: Part, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
    p.quad(at(s0, z0, d), at(s1, z0, d), at(s1, z1, d), at(s0, z1, d))
  /** A box standing on the wall: s0..s1 along, d0..d1 out, z0..z1, with its top. */
  const box = (p: Part, s0: number, s1: number, d0: number, d1: number, z0: number, z1: number, top = true) => {
    const r: V3[] = [at(s0, z0, d1), at(s1, z0, d1), at(s1, z0, d0), at(s0, z0, d0)]
    const t = r.map(([x, y]) => [x, y, z1] as V3)
    // Ring order must be counter-clockwise from above for loft to face out.
    const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0
    const R = ccw ? r : r.slice().reverse(), Tt = ccw ? t : t.slice().reverse()
    p.loft([R, Tt]); if (top) p.cap(Tt, true)
  }
  return { L, n, at, rect, box }
}

/** Points of a semicircle (s, z) from the right springing to the left, `segs` segments. */
export const semi = (sc: number, zs: number, r: number, segs: number) =>
  Array.from({ length: segs + 1 }, (_, i) => { const t = (Math.PI * i) / segs; return [sc + r * Math.cos(t), zs + r * Math.sin(t)] as [number, number] })

/**
 * The spandrel face around a round arch on a wall: the rectangle
 * s0..s1 × zs..zt minus a semicircle spanning s0..s1, springing at zs.
 */
export function archFace(p: Part, f: ReturnType<typeof face>, s0: number, s1: number, zs: number, zt: number, segs = 12, d = 0) {
  const sc = (s0 + s1) / 2, r = (s1 - s0) / 2, h = zt - zs
  const tc = Math.atan2(h, r)
  const ts = [...Array.from({ length: segs + 1 }, (_, i) => (Math.PI * i) / segs), tc, Math.PI - tc].sort((a, b) => a - b)
  const out = (t: number): [number, number] => {
    const c = Math.cos(t), s = Math.sin(t)
    const k = Math.min(Math.abs(c) > 1e-9 ? r / Math.abs(c) : Infinity, s > 1e-9 ? h / s : Infinity)
    return [sc + k * c, zs + k * s]
  }
  for (let i = 0; i < ts.length - 1; i++) {
    const t0 = ts[i], t1 = ts[i + 1]
    if (t1 - t0 < 1e-6) continue
    const A0: [number, number] = [sc + r * Math.cos(t0), zs + r * Math.sin(t0)], A1: [number, number] = [sc + r * Math.cos(t1), zs + r * Math.sin(t1)]
    const O0 = out(t0), O1 = out(t1)
    quadTo(p, f.at(A0[0], A0[1], d), f.at(O0[0], O0[1], d), f.at(O1[0], O1[1], d), f.at(A1[0], A1[1], d), f.n)
  }
}

/** The barrel soffit of a round arch, from the face (d = 0) back to d = −depth, facing its axis. */
export function vault(p: Part, f: ReturnType<typeof face>, s0: number, s1: number, zs: number, depth: number, segs = 12) {
  const sc = (s0 + s1) / 2, r = (s1 - s0) / 2
  const pts = semi(sc, zs, r, segs)
  for (let i = 0; i < segs; i++) {
    const [a, b] = [pts[i], pts[i + 1]]
    const m = [(a[0] + b[0]) / 2 - sc, (a[1] + b[1]) / 2 - zs]
    const c = f.at(sc - m[0], zs - m[1], 0), o = f.at(sc, zs, 0)
    const want: V3 = unit([c[0] - o[0], c[1] - o[1], c[2] - o[2]])
    quadTo(p, f.at(a[0], a[1], 0), f.at(b[0], b[1], 0), f.at(b[0], b[1], -depth), f.at(a[0], a[1], -depth), want)
  }
}

/** A flat round-headed panel: rectangle z0..spring plus a semicircle over s0..s1. */
export function archPanel(p: Part, f: ReturnType<typeof face>, s0: number, s1: number, z0: number, zs: number, d = 0.06, segs = 12) {
  const sc = (s0 + s1) / 2, r = (s1 - s0) / 2
  if (zs > z0) f.rect(p, s0, s1, z0, zs, d)
  const pts = semi(sc, zs, r, segs)
  for (let i = 0; i < segs; i++) quadTo(p, f.at(sc, zs, d), f.at(pts[i][0], pts[i][1], d), f.at(pts[i + 1][0], pts[i + 1][1], d), f.at(sc, zs, d), f.n)
}

/**
 * A fin wall on the line a→b: fins `fw` wide and `depth` proud at `pitch`,
 * from z0 to z1, with recess panels between them `inset` metres behind the
 * fins' faces (the line a→b is the fins' front).
 */
export function fins(fin: Part, recess: Part, a: XY, b: XY, z0: number, z1: number, pitch: number, fw: number, depth: number, s0 = 0, s1?: number) {
  const f = face(a, b), end = s1 ?? f.L
  const n = Math.max(1, Math.round((end - s0) / pitch)), p = (end - s0) / n
  f.rect(recess, s0, end, z0, z1, -depth)
  for (let k = 0; k <= n; k++) {
    const c = s0 + k * p
    const lo = Math.max(s0, c - fw / 2), hi = Math.min(end, c + fw / 2)
    f.box(fin, lo, hi, -depth - 0.02, 0, z0, z1, false)
  }
}

// ===========================================================================
// The Metropolitan Opera House
// ===========================================================================

function build() {
  const stone = new Part(), recess = new Part(), win = new Part(), door = new Part(), roof = new Part(), trim = new Part()

  const XF = 70.7, XG = 65.5, YS = -24.1, YN = 27.8, XW = -66.2
  const ROOF = 33.8, PLAZA = 5.2, STAGE = 45.0, WING = 13.7
  const FIN = 0.8, BAND = 1.6

  // Massing: the main block inset by the fins' depth on the long sides (the
  // fins stand out to the outline), the rear roof well, the stage house and
  // the south wing.
  massing({
    wall: stone, win: null, roof, coping: stone, facade: null, bevel: 0.4,
    boxes: [
      [XW, YS + FIN, -62, YN - FIN, ROOF], [-62, YS + FIN, -50, -18, ROOF], [-62, 22, -50, YN - FIN, ROOF],
      [-50, YS + FIN, XG, YN - FIN, ROOF], [-62, -18, -50, 22, 27],
      [-48.1, -15.1, -4.9, 18.0, STAGE],
      [-57.1, -33.3, -6.0, YS + FIN, WING],
    ],
  })

  // The long sides: full-height fins out to the outline, a plain top band.
  // North: a = front end, running west.
  fins(stone, recess, [XG, YN], [XW, YN], PLAZA * 0 + 0, ROOF - BAND, 3.0, 1.4, FIN)
  fins(stone, recess, [-6.0, YS], [XG, YS], 0, ROOF - BAND, 3.0, 1.4, FIN)
  fins(stone, recess, [XW, YS], [-6.0, YS], WING, ROOF - BAND, 3.0, 1.4, FIN, 9.1)
  for (const [a, b, z0] of [[[XG, YN], [XW, YN], 0], [[XW, YS], [XG, YS], 0]] as [XY, XY, number][]) {
    const f = face(a, b)
    f.box(stone, 0, f.L, -FIN - 0.02, 0, ROOF - BAND, ROOF, true)
    void z0
  }

  // The plaza front: five round arches on slender piers, a deep loggia.
  const W = YN - YS, E = 1.3, P = 1.5, C = (W - 4 * P - 2 * E) / 5, R = C / 2
  const CROWN = ROOF - 1.3, SPRING = CROWN - R
  const front = face([XF, YS], [XF, YN])   // s runs south → north, facing +x
  const glassF = face([XG, YS], [XG, YN])  // the glass wall, facing +x
  const bays: [number, number][] = []
  for (let k = 0; k < 5; k++) { const s0 = E + k * (C + P); bays.push([s0, s0 + C]) }
  // Piers (front faces, sides in the loggia) and the face over them.
  const piers: [number, number][] = [[0, E], ...bays.slice(0, 4).map(([, s1]) => [s1, s1 + P] as [number, number]), [W - E, W]]
  for (const [s0, s1] of piers) {
    front.rect(stone, s0, s1, 0, ROOF - 0.4, 0)
    // The pier's sides, back to the glass wall.
    const q = (s: number, dir: number) => {
      const a = front.at(s, 0, 0), b = front.at(s, 0, -(XF - XG)), c = front.at(s, SPRING, -(XF - XG)), d = front.at(s, SPRING, 0)
      quadTo(stone, a, b, c, d, [0, dir, 0])
    }
    if (s0 > 0) q(s0, -1)
    if (s1 < W) q(s1, 1)
  }
  for (const [s0, s1] of bays) {
    archFace(stone, front, s0, s1, SPRING, ROOF - 0.4, 12)
    vault(recess, front, s0, s1, SPRING, XF - XG, 12)
    // The glass wall: dark glass in the arch, the balcony line, lit doors below.
    // The glass is set in a lit stone frame inside the vault, its arched
    // head lower and narrower than the arch (head-on photo), so the cream
    // soffit rings the dark glass.
    archPanel(recess, glassF, s0, s1, PLAZA + 5.7, SPRING, 0.04, 12)
    archPanel(win, glassF, s0 + 0.8, s1 - 0.8, PLAZA + 5.7, SPRING - 1.6, 0.08, 12)
    glassF.rect(win, s0, s1, PLAZA, PLAZA + 5.0, 0.06)
    glassF.rect(door, (s0 + s1) / 2 - 1.8, (s0 + s1) / 2 + 1.8, PLAZA, PLAZA + 3.4, 0.1)
    glassF.box(trim, s0, s1, 0, 1.6, PLAZA + 5.0, PLAZA + 5.7, true)
  }
  // The front block's ends (the corner piers' outer faces), its coping and roof.
  for (const [a, b] of [[[XG, YS], [XF, YS]], [[XF, YN], [XG, YN]]] as [XY, XY][]) face(a, b).rect(stone, 0, XF - XG, 0, ROOF, 0)
  quadTo(stone, [XF, YS, ROOF - 0.4], [XF, YN, ROOF - 0.4], [XF - 0.4, YN, ROOF], [XF - 0.4, YS, ROOF], unit([1, 0, 1]))
  roof.quad([XG - 0.5, YS, ROOF - 0.03], [XF - 0.4, YS, ROOF - 0.03], [XF - 0.4, YN, ROOF - 0.03], [XG - 0.5, YN, ROOF - 0.03])
  // The loggia floor, at the plaza's level, over a plinth down to y = 0.
  cube(stone, XG, YS + 0.01, XF - 0.02, YN - 0.01, 0, PLAZA)

  finishModel('Metropolitan Opera House', 'nyc-met-opera', [
    { part: stone, material: finish('lincoln-travertine', 0xede6d8) },
    { part: recess, material: finish('met-recess', 0xd3c6b0) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: roof, material: PALETTE.roof },
    { part: trim, material: PALETTE.trim },
  ], { bearing: 29, osm: 'way/265354534', height: STAGE })
}

if (import.meta.main) build()
