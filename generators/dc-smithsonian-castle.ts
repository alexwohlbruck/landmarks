/**
 * Smithsonian Institution Building ("the Castle") — procedural, CC0-1.0, no
 * textures. bun generators/dc-smithsonian-castle.ts
 *
 * Also the small kit for the Smithsonian group (dc-smithsonian-castle,
 * dc-arts-and-industries, dc-hirshhorn, dc-air-and-space): the helpers below
 * are exported and the model is only built when this file is run directly.
 * They sit on top of the President's Park kit in dc-white-house.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the outline's long
 * walls running due east–west. The anchor is the area centroid of the OSM
 * outline relation/7393969 (lng -77.0259511, lat 38.8887781).
 *
 * What it is: James Renwick's Norman Revival castle (1847–55; East Wing
 * raised by Adolf Cluss, 1883) in Seneca red sandstone, a muted red-mauve,
 * under dark slate roofs. From west to east: the West Wing (the "chapel", a
 * gabled hall with an apse on the north), the low West Range, the Centre
 * Building (two storeys of round-arched windows under a long gabled roof),
 * the East Range and the East Wing. The towers are the identity, so each is
 * drawn with its own plan, height and top:
 * - Flag Tower (north, west of the entrance): the tallest, 41.7 m; square
 *   with corner buttresses, an octagonal belfry stage, a flat corbelled top.
 * - North Tower (east of the entrance): square, a steep flared slate
 *   pyramid to 34.5 m.
 * - Between them, the entrance front's tall gable with its rose window, and
 *   the crenellated porte-cochère in front.
 * - South Tower: 9.3 × 13 m, crenellated, 25.9 m, with the oriel window and
 *   the arched south door; a round crenellated stair turret on its west side
 *   to 29.6 m.
 * - Campanile (north-east corner of the Centre Building): 5.3 m square, a
 *   belfry stage and a flared pyramid spire to 35.7 m.
 * - Octagonal Tower (south-west corner): 26.5 m, flat corbelled top.
 * - South-east tower: slender octagon with a slate spire, 27.4 m.
 * - North-west tower of the Centre Building: slender, with a spire, 27.7 m.
 * - West Wing tower (north-west): slender, with a spire, 27.4 m.
 *
 * Covers and replaces: relation/7393969, the outline (its three member ways
 * are untagged). OSM has no building:parts inside it. The small dcgis
 * buildings south of it in the Haupt Garden (way/66418599, 66418611, …) are
 * garden kiosks and stair heads, not part of the Castle, and are left alone.
 *
 * Evidence
 * - OSM (measured): the outline, 135.5 × 47 m overall. Centre Building
 *   x −32.5…28.0, y −8.9…7.8 (16.7 m deep); West Range to x −51.6; West Wing
 *   x −64.6…−51.6 with its apse (r 3.9 m) and tower; East Range to x 47.2;
 *   East Wing x 47.2…63.0 with its east porch to 68.1; the north entrance
 *   group x −11.7…7.5 out to y 25.1; the South Tower x −7.0…2.3 to y −22.2;
 *   the round bumps for the octagonal towers and the stair turret.
 * - HABS DC-141 (public domain), photogrammetric elevations by Ohio State
 *   University, 1963 (sheets 1–4 of 6: north, east, south and west
 *   elevations, scale bars in feet and metres) and the 21-sheet set of
 *   plans and sections. Heights read off them, ground = the north entrance:
 *   Flag Tower 136.9 ft (41.7 m, stated); South Tower parapet 84.9 ft
 *   (25.9 m, stated); stair turret 97 ft; Campanile 115 ft; North Tower's
 *   pyramid 113 ft; NW and SE spires about 90–96 ft; Octagonal Tower about
 *   87 ft; Centre Building eaves about 16 m and ridge 21.7 m (its west
 *   gable); ranges 10.7–11 m; West Wing eaves 10.7 m, gable 18.4 m; East
 *   Wing walls about 13 m, roofs to about 19 m, its lantern 22 m;
 *   porte-cochère 6.7 m.
 * - Published (Wikipedia, "Smithsonian Institution Building"): South Tower
 *   91 ft high and 37 ft square; the taller north tower 145 ft; the
 *   Campanile 17 ft square and 117 ft tall. Seneca red sandstone.
 * - Photos (Wikimedia Commons): south front, "Smithsonian Building NR.jpg"
 *   (Noclip, public domain) and "Smithsonian Institution Building
 *   south.jpg" (Robert Lyle Bolton, CC BY 2.0, 2019); from the north,
 *   "Washington October 2016-13.jpg" (Alvesgaspar, CC BY-SA 4.0) and "The
 *   Smithsonian Castle in Winter.jpg" (Northern-Virginia-Photographer, CC
 *   BY-SA 4.0, 2020); aerials "Smithsonian Castle Aerial highsmith.jpg"
 *   (Carol M. Highsmith, public domain, 2006, from the south) and "Aerial
 *   View of Castle.jpg" (Jeffrey Ploskonka, public domain, from the north).
 * - Estimated: storey heights and window sizes from the elevations; the
 *   Flag Tower's octagonal stage from 30 m (HABS sheet 17 plans its upper
 *   floors as octagons); the East Wing's roofs simplified to one hip with a
 *   lantern and four corner stacks; the West Range and East Range roofs
 *   drawn as low hips.
 * - Simplified: corbel tables are one projecting band; buttresses only on
 *   the big towers; merlons only where the photos show crenellations (South
 *   Tower, stair turret, porte-cochère, North Tower's parapet); the flagpole
 *   and finials are left out. The Castle has been under renovation since
 *   2023; it is drawn as finished, as before the works.
 */
import { Part, cross, len, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, gable, grow, hip, panel, qf, rect, save, tf, type Rect, type Side, type XY } from './dc-white-house'

export { cbox, gable, grow, hip, panel, qf, rect, save, tf }
export type { Rect, Side, XY }

// ===========================================================================
// Kit, shared with the other Smithsonian models.

const NORMALS: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }

/**
 * A round-arched window: a flat panel from z0 up to the springing line and a
 * semicircular head on top, so its total height is z1. Set on the wall
 * plane `at`, spanning a0..a1 along it.
 */
export function archWin(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, seg = 6, d = 0.04) {
  const r = (a1 - a0) / 2, spring = Math.max(z0, z1 - r), am = (a0 + a1) / 2
  const n = NORMALS[side], ns = side === 'n' || side === 's'
  const off = at + (ns ? n[1] : n[0]) * d
  const P = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
  if (spring > z0) qf(p, P(a0, z0), P(a1, z0), P(a1, spring), P(a0, spring), n)
  for (let k = 0; k < seg; k++) {
    const t0 = Math.PI * (k / seg), t1 = Math.PI * ((k + 1) / seg)
    tf(p, P(am, spring), P(am + r * Math.cos(t0), spring + r * Math.sin(t0)), P(am + r * Math.cos(t1), spring + r * Math.sin(t1)), n)
  }
}

/** A round window (a rose or oculus), flat on the wall. */
export function roundWin(p: Part, side: Side, at: number, a: number, z: number, r: number, seg = 12, d = 0.04) {
  const n = NORMALS[side], ns = side === 'n' || side === 's'
  const off = at + (ns ? n[1] : n[0]) * d
  const P = (u: number, v: number): V3 => (ns ? [u, off, v] : [off, u, v])
  for (let k = 0; k < seg; k++) {
    const t0 = (2 * Math.PI * k) / seg, t1 = (2 * Math.PI * (k + 1)) / seg
    tf(p, P(a, z), P(a + r * Math.cos(t0), z + r * Math.sin(t0)), P(a + r * Math.cos(t1), z + r * Math.sin(t1)), n)
  }
}

/** A regular polygon's ring (CCW from above), first corner at angle `rot` (radians). */
export function ngon(cx: number, cy: number, r: number, n: number, z: number, rot = Math.PI / n): V3[] {
  return Array.from({ length: n }, (_, k) => {
    const t = rot + (2 * Math.PI * k) / n
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z] as V3
  })
}

/** A vertical prism on a regular polygon, flat-sided, optionally capped. */
export function ngonPrism(p: Part, cx: number, cy: number, r: number, n: number, z0: number, z1: number, o: { top?: boolean | Part; bottom?: boolean; r1?: number } = {}) {
  const a = ngon(cx, cy, r, n, z0), b = ngon(cx, cy, o.r1 ?? r, n, z1)
  p.loft([a, b])
  if (o.top !== false) (o.top instanceof Part ? o.top : p).cap(b, true)
  if (o.bottom) p.cap(a, false)
}

/** A pyramid (spire) from a convex ring up to a point, with no base. */
export function spire(p: Part, base: V3[], apex: V3) {
  for (let i = 0; i < base.length; i++) {
    const a = base[i], b = base[(i + 1) % base.length]
    const f = cross(sub(b, a), sub(apex, a))
    if (len(f) < 1e-9) continue
    p.tri(a, b, apex)
  }
}

/** A rectangle's ring, CCW from above. */
export const rring = (r: Rect, z: number): V3[] => [[r.x0, r.y0, z], [r.x1, r.y0, z], [r.x1, r.y1, z], [r.x0, r.y1, z]]

/**
 * A flared slate spire on a ring: an eave that kicks out past the wall,
 * then a steep concave climb to the point. `ringAt(grow, z)` gives the ring.
 */
export function flaredSpire(p: Part, ringAt: (g: number, z: number) => V3[], z0: number, apex: V3, eave = 0.5, under?: Part) {
  const r0 = ringAt(eave, z0), r1 = ringAt(-0.15 * (apex[2] - z0) * 0.25, z0 + (apex[2] - z0) * 0.22)
  p.loft([r0, r1])
  if (under) under.cap(r0, false)
  spire(p, r1, apex)
}

/**
 * Merlons on a rectangle's parapet: blocks `w` wide, `h` tall, `t` deep,
 * spaced `pitch` along every side, one on each corner.
 */
export function crenels(p: Part, r: Rect, z: number, h: number, pitch = 1.3, w = 0.7, t = 0.4) {
  const sides: Array<[number, number, number, number, boolean]> = [
    [r.x0, r.x1, r.y0, r.y0 + t, true], [r.x0, r.x1, r.y1 - t, r.y1, true],
    [r.x0, r.x0 + t, r.y0, r.y1, false], [r.x1 - t, r.x1, r.y0, r.y1, false],
  ]
  // A low continuous wall under the merlons, then the merlons.
  for (const [x0, x1, y0, y1, alongX] of sides) {
    const L = alongX ? x1 - x0 : y1 - y0
    const n = Math.max(2, Math.round((L - w) / pitch) + 1), step = (L - w) / (n - 1)
    for (let k = 0; k < n; k++) {
      const s = step * k
      if (!alongX && (k === 0 || k === n - 1)) continue // corners already placed by the x sides
      const m = alongX ? rect(x0 + s, x0 + s + w, y0, y1) : rect(x0, x1, y0 + s, y0 + s + w)
      cbox(p, m, z, z + h, {})
    }
  }
}

/** Merlons round a regular polygon's rim. */
export function ngonCrenels(p: Part, cx: number, cy: number, r: number, n: number, z: number, h: number, w = 0.55) {
  for (let k = 0; k < n; k++) {
    const t = (2 * Math.PI * (k + 0.5)) / n
    const mx = cx + (r - 0.2) * Math.cos(t), my = cy + (r - 0.2) * Math.sin(t)
    const c = Math.cos(t), s = Math.sin(t)
    // A small box turned to face out.
    const hw = w / 2, hd = 0.2
    const pt = (u: number, v: number, zz: number): V3 => [mx + c * v - s * u, my + s * v + c * u, zz]
    // (u, v) runs tangent then radial, so this order is counter-clockwise from above.
    const lo = [pt(-hw, hd, z), pt(hw, hd, z), pt(hw, -hd, z), pt(-hw, -hd, z)].reverse()
    const hi = lo.map(([x, y]) => [x, y, z + h] as V3)
    p.loft([lo, hi])
    p.cap(hi, true)
  }
}

/** Evenly spaced bay centres between a0 and a1. */
export function bays(a0: number, a1: number, n: number) {
  const step = (a1 - a0) / n
  return Array.from({ length: n }, (_, k) => a0 + step * (k + 0.5))
}

// ===========================================================================
// The Castle.

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), door = new Part()

  // ---- Centre Building.
  const CB = rect(-32.5, 28.0, -8.9, 7.8)
  const EAVE = 16.0, RIDGE = 21.7
  cbox(stone, CB, 0, EAVE, { top: false })
  cbox(trim, grow(CB, 0.35), EAVE - 1.0, EAVE, { bottom: true, top: false }) // corbel table and parapet
  cbox(slate, CB, EAVE - 0.05, EAVE, { top: true })
  gable(slate, stone, grow(CB, 0.2, 0.2), EAVE, RIDGE, false)
  // Base course.
  cbox(trim, grow(CB, 0.15), 0, 1.2, { top: true })
  // The west gable's rose window (HABS west elevation).
  roundWin(win, 'w', CB.x0 - 0.2, (CB.y0 + CB.y1) / 2, 18.0, 1.6)
  roundWin(win, 'e', CB.x1 + 0.2, (CB.y0 + CB.y1) / 2, 18.0, 1.6)
  // Two storeys of round-arched windows, the upper ones tall (the
  // lecture hall and galleries), on both long fronts.
  const cbWindows = (side: Side, at: number, runs: Array<[number, number, number]>) => {
    for (const [a0, a1, n] of runs) for (const c of bays(a0, a1, n)) {
      archWin(win, side, at, c - 0.85, c + 0.85, 2.6, 6.6)
      archWin(win, side, at, c - 0.95, c + 0.95, 8.4, 14.0)
    }
  }
  cbWindows('n', CB.y1, [[-31.0, -12.2, 5], [8.0, 26.5, 5]])
  cbWindows('s', CB.y0, [[-30.5, -9.0, 5], [3.5, 26.5, 6]])
  // A string course between the storeys.
  cbox(trim, grow(CB, 0.12), 7.3, 7.8, { bottom: true, top: true })

  // ---- West Range: one tall storey, low hipped roof.
  const WR = rect(-51.6, -32.5, -9.0, 7.3)
  cbox(stone, WR, 0, 10.7, { top: false })
  cbox(trim, grow(WR, 0.3), 9.9, 10.7, { bottom: true, top: false })
  hip(slate, grow(WR, 0.1), 10.7, 12.2, 5.0)
  for (const c of bays(-50.6, -33.6, 6)) {
    archWin(win, 's', WR.y0, c - 0.9, c + 0.9, 2.2, 7.2)
    archWin(win, 'n', WR.y1, c - 0.9, c + 0.9, 2.2, 7.2)
  }

  // ---- West Wing: the chapel, gabled north–south, rose windows in both
  // gables, the apse on the north and the slender tower beside it.
  const WW = rect(-64.6, -51.6, -12.4, 9.5)
  cbox(stone, WW, 0, 10.7, { top: false })
  cbox(trim, grow(WW, 0.3), 9.9, 10.7, { bottom: true, top: false })
  gable(slate, stone, grow(WW, 0.2, 0.2), 10.7, 18.4, true)
  for (const [side, at] of [['s', WW.y0 - 0.2], ['n', WW.y1 + 0.2]] as Array<[Side, number]>) {
    roundWin(win, side, at, -58.1, 13.6, 1.7)
  }
  for (const c of bays(-63.8, -52.4, 3)) archWin(win, 's', WW.y0, c - 0.95, c + 0.95, 2.4, 8.4)
  for (const c of bays(-11.0, 8.0, 5)) {
    archWin(win, 'w', WW.x0, c - 0.85, c + 0.85, 2.4, 8.4)
    archWin(win, 'e', WW.x1, c - 0.85, c + 0.85, 2.4, 8.4)
  }
  // Apse: a half-round wall and a half cone.
  {
    const cx = -57.95, cy = 9.5, r = 3.9, n = 8
    const ring = (rr: number, z: number) => Array.from({ length: n + 1 }, (_, k) => {
      const t = (Math.PI * k) / n
      return [cx + rr * Math.cos(t), cy + rr * Math.sin(t), z] as V3
    })
    const b = ring(r, 0), t = ring(r, 8.2), e = ring(r + 0.3, 8.2)
    for (let k = 0; k < n; k++) qf(stone, b[k + 1], b[k], t[k], t[k + 1], [Math.cos(Math.PI * (k + 0.5) / n), Math.sin(Math.PI * (k + 0.5) / n), 0])
    const apex: V3 = [cx, cy, 11.0]
    for (let k = 0; k < n; k++) tf(slate, e[k], e[k + 1], apex, [Math.cos(Math.PI * (k + 0.5) / n), Math.sin(Math.PI * (k + 0.5) / n), 1])
    for (let k = 0; k < n; k += 2) {
      const tm = (Math.PI * (k + 1)) / n
      // narrow arched windows round the apse: drawn as panels on its chords
      const side: Side = Math.abs(Math.cos(tm)) > 0.7 ? (Math.cos(tm) > 0 ? 'e' : 'w') : 'n'
      if (side === 'n') archWin(win, 'n', cy + r * Math.sin(tm) * 0.98, cx + r * Math.cos(tm) - 0.5, cx + r * Math.cos(tm) + 0.5, 2.4, 6.4)
    }
  }
  // West Wing tower.
  tower(rect(-67.4, -64.4, 5.6, 9.5), 22.0, 27.4)

  // ---- East Range.
  const ER = rect(33.3, 47.2, -8.3, 6.3)
  cbox(stone, ER, 0, 11.0, { top: false })
  cbox(trim, grow(ER, 0.3), 10.2, 11.0, { bottom: true, top: false })
  hip(slate, grow(ER, 0.1), 11.0, 12.6, 4.5)
  for (const c of bays(34.2, 46.2, 4)) {
    for (const [side, at] of [['s', ER.y0], ['n', ER.y1]] as Array<[Side, number]>) {
      archWin(win, side, at, c - 0.8, c + 0.8, 2.2, 5.6)
      archWin(win, side, at, c - 0.7, c + 0.7, 6.8, 9.6)
    }
  }

  // ---- East Wing (Cluss's four storeys): crenellated walls, a steep hip,
  // a lantern and four corner stacks; the east porch.
  const EW = rect(47.2, 63.0, -13.4, 11.5)
  cbox(stone, EW, 0, 13.0, { top: false })
  cbox(trim, grow(EW, 0.3), 12.2, 13.0, { bottom: true, top: false })
  hip(slate, grow(EW, 0.1), 13.0, 19.0, 5.5)
  {
    const L = rect(52.7, 57.5, -3.3, 1.5)
    cbox(stone, L, 18.0, 20.0, { top: false })
    flaredSpire(slate, (g, z) => rring(grow(L, g), z), 20.0, [55.1, -0.9, 23.5], 0.3)
    for (const [x, y] of [[48.4, -12.2], [61.8, -12.2], [48.4, 10.3], [61.8, 10.3]] as XY[]) {
      const r = rect(x - 1.0, x + 1.0, y - 1.0, y + 1.0)
      cbox(stone, r, 10.0, 16.0, { top: false })
      cbox(trim, grow(r, 0.2), 16.0, 16.6, { bottom: true })
    }
  }
  for (const [side, at, a0, a1, n] of [['s', EW.y0, 48.5, 61.7, 4], ['n', EW.y1, 48.5, 61.7, 4], ['e', EW.x1, -12.0, 10.0, 6]] as Array<[Side, number, number, number, number]>) {
    for (const c of bays(a0, a1, n)) for (const z of [1.8, 5.2, 8.6]) archWin(win, side, at, c - 0.7, c + 0.7, z, z + 2.4)
  }
  cbox(stone, rect(63.0, 68.1, -4.9, 2.7), 0, 6.0, { top: false })
  crenels(stone, rect(63.0, 68.1, -4.9, 2.7), 6.0, 0.8, 1.3, 0.6, 0.35)
  cbox(trim, rect(63.0, 68.0, -4.8, 2.6), 5.7, 6.0, {})
  archWin(door, 'e', 68.1, -2.3, 0.1, 0.0, 3.6)

  // ---- South Tower, with its oriel, door and the round stair turret.
  const ST = rect(-7.0, 2.3, -22.2, -8.9)
  const ST_TOP = 25.9
  cbox(stone, ST, 0, ST_TOP - 1.6, { top: false })
  cbox(trim, grow(ST, 0.4), ST_TOP - 1.6, ST_TOP - 0.8, { bottom: true, top: slate })
  crenels(stone, grow(ST, 0.4), ST_TOP - 0.8, 0.9, 1.4, 0.75, 0.45)
  // Corner buttresses up to the parapet.
  for (const [x, y] of [[ST.x0, ST.y0], [ST.x1, ST.y0]] as XY[]) cbox(stone, rect(x - 0.45, x + 0.45, y - 0.45, y + 0.45), 0, ST_TOP - 2.0, { top: true })
  // The arched south door, the oriel over it and the tall window above.
  const stc = (ST.x0 + ST.x1) / 2
  archWin(door, 's', ST.y0, stc - 1.6, stc + 1.6, 0.0, 5.4, 8)
  const oriel = rect(stc - 2.4, stc + 2.4, ST.y0 - 1.0, ST.y0)
  cbox(stone, oriel, 7.6, 13.6, { bottom: true, top: false })
  cbox(trim, grow(oriel, 0.15), 13.6, 14.0, { bottom: true })
  for (const c of [stc - 1.5, stc, stc + 1.5]) archWin(win, 's', oriel.y0, c - 0.5, c + 0.5, 9.0, 13.0)
  archWin(win, 's', ST.y0, stc - 1.2, stc + 1.2, 16.2, 21.8)
  for (const [side, at] of [['e', ST.x1], ['w', ST.x0]] as Array<[Side, number]>) {
    for (const c of [-19.0, -12.5]) archWin(win, side, at, c - 0.75, c + 0.75, 16.6, 21.4)
  }
  // Stair turret on the tower's west side (OSM bump at x −8.4).
  ngonPrism(stone, -8.3, -17.0, 1.6, 8, 0, 28.0, { top: false })
  ngonPrism(trim, -8.3, -17.0, 1.95, 8, 28.0, 28.8, { bottom: true, top: slate })
  ngonCrenels(stone, -8.3, -17.0, 1.95, 8, 28.8, 0.8)

  // ---- The north entrance group: Flag Tower (west), North Tower (east),
  // the tall entrance gable between them and the porte-cochère in front.
  const FT = rect(-12.3, -4.7, 9.4, 17.0)
  const FT_TOP = 41.7, FT_OCT = 30.0
  cbox(stone, FT, 0, FT_OCT, { top: false })
  for (const [x, y] of [[FT.x0, FT.y0], [FT.x1, FT.y0], [FT.x0, FT.y1], [FT.x1, FT.y1]] as XY[]) {
    cbox(stone, rect(x - 0.55, x + 0.55, y - 0.55, y + 0.55), 0, FT_OCT + 1.6, { top: false })
    flaredSpire(trim, (g, z) => rring(grow(rect(x - 0.55, x + 0.55, y - 0.55, y + 0.55), g), z), FT_OCT + 1.6, [x, y, FT_OCT + 3.4], 0.05)
  }
  cbox(trim, grow(FT, 0.2), FT_OCT - 0.6, FT_OCT, { bottom: true, top: slate })
  const fc: XY = [(FT.x0 + FT.x1) / 2, (FT.y0 + FT.y1) / 2]
  ngonPrism(stone, fc[0], fc[1], 3.85, 8, FT_OCT, FT_TOP - 1.4, { top: false })
  ngonPrism(trim, fc[0], fc[1], 4.3, 8, FT_TOP - 1.4, FT_TOP, { bottom: true, top: slate })
  // Belfry openings on the octagon's four main faces, the clock's rose
  // and the stair windows below.
  const octR = 3.85 * Math.cos(Math.PI / 8)
  archWin(win, 'n', fc[1] + octR, fc[0] - 0.9, fc[0] + 0.9, 31.4, 39.2)
  archWin(win, 's', fc[1] - octR, fc[0] - 0.9, fc[0] + 0.9, 31.4, 39.2)
  archWin(win, 'w', fc[0] - octR, fc[1] - 0.9, fc[1] + 0.9, 31.4, 39.2)
  archWin(win, 'e', fc[0] + octR, fc[1] - 0.9, fc[1] + 0.9, 31.4, 39.2)
  roundWin(win, 'n', FT.y1, fc[0], 25.6, 1.25)
  roundWin(win, 'w', FT.x0, fc[1], 25.6, 1.25)
  for (const z of [17.0, 9.5]) {
    archWin(win, 'n', FT.y1, fc[0] - 1.7, fc[0] - 0.5, z, z + 4.6)
    archWin(win, 'n', FT.y1, fc[0] + 0.5, fc[0] + 1.7, z, z + 4.6)
    archWin(win, 'w', FT.x0, fc[1] - 1.7, fc[1] - 0.5, z, z + 4.6)
    archWin(win, 'w', FT.x0, fc[1] + 0.5, fc[1] + 1.7, z, z + 4.6)
  }

  const NT = rect(0.6, 7.5, 11.3, 18.8)
  const NT_TOP = 27.0
  cbox(stone, NT, 0, NT_TOP - 0.7, { top: false })
  cbox(trim, grow(NT, 0.3), NT_TOP - 0.7, NT_TOP, { bottom: true, top: false })
  flaredSpire(slate, (g, z) => rring(grow(NT, g), z), NT_TOP, [(NT.x0 + NT.x1) / 2, (NT.y0 + NT.y1) / 2, 34.5], 0.55, trim)
  const nc: XY = [(NT.x0 + NT.x1) / 2, (NT.y0 + NT.y1) / 2]
  for (const [side, at, a] of [['n', NT.y1, nc[0]], ['e', NT.x1, nc[1]]] as Array<[Side, number, number]>) {
    for (const d of [-1.6, 0, 1.6]) archWin(win, side, at, a + d - 0.55, a + d + 0.55, 20.0, 25.4)
    for (const d of [-1.0, 1.0]) archWin(win, side, at, a + d - 0.6, a + d + 0.6, 13.0, 17.6)
    for (const d of [-1.0, 1.0]) archWin(win, side, at, a + d - 0.6, a + d + 0.6, 5.4, 10.0)
  }
  for (const [x, y] of [[NT.x0, NT.y1], [NT.x1, NT.y1]] as XY[]) cbox(stone, rect(x - 0.45, x + 0.45, y - 0.45, y + 0.45), 0, NT_TOP - 1.2, { top: true })

  // The entrance front between the towers: a tall gable with the rose.
  const EF = rect(-4.7, 0.6, 7.8, 17.6)
  cbox(stone, EF, 0, 20.7, { top: false })
  gable(slate, stone, grow(EF, 0.15, 0), 20.7, 24.7, true)
  roundWin(win, 'n', EF.y1 + 0.15, -2.05, 18.2, 1.5)
  for (const c of [-3.2, -0.9]) archWin(win, 'n', EF.y1, c - 0.6, c + 0.6, 9.5, 14.4)
  // Porte-cochère: a crenellated arch in front of the entrance.
  const PC = rect(-5.8, 0.7, 17.6, 25.1)
  cbox(stone, PC, 0, 6.0, { top: slate })
  cbox(trim, grow(PC, 0.2), 5.7, 6.1, { bottom: true, top: false })
  crenels(stone, grow(PC, 0.2), 6.1, 0.8, 1.3, 0.6, 0.35)
  archWin(door, 'n', PC.y1, -4.2, -0.9, 0.0, 4.8, 8)
  archWin(door, 'w', PC.x0, 19.4, 23.4, 0.0, 4.6, 8)
  archWin(door, 'e', PC.x1, 19.4, 23.4, 0.0, 4.6, 8)

  // ---- Campanile, north-east corner of the Centre Building.
  const CP = rect(28.0, 33.3, 5.5, 10.8)
  cbox(stone, CP, 0, 28.3, { top: false })
  cbox(trim, grow(CP, 0.25), 27.7, 28.5, { bottom: true, top: false })
  cbox(trim, grow(CP, 0.15), 19.6, 20.1, { bottom: true, top: false })
  flaredSpire(slate, (g, z) => rring(grow(CP, g), z), 28.5, [30.65, 8.15, 35.7], 0.45, trim)
  for (const [side, at, a] of [['n', CP.y1, 30.65], ['e', CP.x1, 8.15], ['w', CP.x0, 8.15], ['s', CP.y0, 30.65]] as Array<[Side, number, number]>) {
    for (const d of [-1.05, 1.05]) {
      archWin(win, side, at, a + d - 0.6, a + d + 0.6, 21.0, 26.8)
      if (side !== 's') archWin(win, side, at, a + d - 0.55, a + d + 0.55, 13.2, 18.4)
    }
  }

  // ---- The slender towers.
  // Octagonal Tower, south-west corner: flat corbelled top.
  ngonPrism(stone, -31.7, -10.6, 2.15, 8, 0, 25.0, { top: false })
  ngonPrism(trim, -31.7, -10.6, 2.5, 8, 25.0, 26.5, { bottom: true, top: slate })
  for (const z of [17.5, 21.0]) archWin(win, 's', -10.6 - 2.15 * Math.cos(Math.PI / 8), -32.2, -31.2, z, z + 2.8)
  // South-east octagon with a slate spire.
  ngonPrism(stone, 29.8, -10.3, 1.75, 8, 0, 21.6, { top: false })
  ngonPrism(trim, 29.8, -10.3, 2.0, 8, 21.6, 22.2, { bottom: true, top: false })
  flaredSpire(slate, (g, z) => ngon(29.8, -10.3, 2.0 + g, 8, z), 22.2, [29.8, -10.3, 27.4], 0.15, trim)
  // North-west tower of the Centre Building.
  tower(rect(-35.4, -32.2, 6.6, 9.8), 22.2, 27.7)

  /** A slender square tower with a spire. */
  function tower(r: Rect, top: number, apex: number) {
    cbox(stone, r, 0, top, { top: false })
    cbox(trim, grow(r, 0.25), top, top + 0.6, { bottom: true, top: false })
    flaredSpire(slate, (g, z) => rring(grow(r, 0.25 + g), z), top + 0.6, [(r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, apex], 0.2, trim)
    const c = (r.y0 + r.y1) / 2
    archWin(win, 'w', r.x0, c - 0.5, c + 0.5, top - 5.2, top - 1.4)
    archWin(win, 'n', r.y1, (r.x0 + r.x1) / 2 - 0.5, (r.x0 + r.x1) / 2 + 0.5, top - 5.2, top - 1.4)
  }

  console.log({ stone: stone.triangles, trim: trim.triangles, slate: slate.triangles, win: win.triangles, door: door.triangles })
  return save('dc-smithsonian-castle', 'Smithsonian Institution Building', [
    { part: stone, material: finish('castle-sandstone', 0xb3776f) },
    { part: trim, material: finish('castle-sandstone-trim', 0xc58d85) },
    { part: slate, material: finish('castle-slate', 0x6a7078) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ], { bearing: 0, osm: 'relation/7393969', footprint: [135.5, 47.3], height: 41.7 }, 6500)
}

if (import.meta.main) await build()
