/**
 * The White House: the Executive Residence, the West Colonnade and the
 * West Wing — procedural, CC0-1.0, no textures.
 * bun generators/dc-white-house.ts
 *
 * Also the shared kit for the President's Park group (dc-white-house,
 * dc-eisenhower-eob, dc-treasury): the helpers below are exported and the
 * model itself is only built when this file is run directly.
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, since the outline's
 * long walls run due east–west. The anchor is the centroid of the OSM outline
 * relation/19761182 (lng -77.036553, lat 38.897666), which is also, within
 * 0.1 m, the main block's axis of symmetry.
 *
 * What it covers, and what it does not
 * - relation/19761182 is the Executive Residence alone: the main block and
 *   the South Portico. Its building:parts (main block, roof, the South
 *   Portico's base, columns and roof, the eight chimneys) are all modelled.
 * - The North Portico stands outside that outline in OSM, as its own parts
 *   (columns, entablature, gable roof, steps) and a building=roof way. It is
 *   part of the residence, so it is modelled and replaced too.
 * - The South Portico's two curved stairs are separate buildings (h=2) just
 *   outside the outline; modelled and replaced.
 * - The West Colonnade (way/238241017) and the West Wing (relation/19761232
 *   and its parts: main block 257920201, penthouse 257920192, east block
 *   257920184, the Cabinet Room's raised roof 257920197, the Oval Office
 *   238241023, the north portico 257920193 with roof 1445440857 and columns
 *   257920178–181, and the west entrance canopy, building=roof 887434559)
 *   are modelled and replaced.
 * - The east side is not modelled. The East Wing and the East Colonnade were
 *   demolished on 20–23 October 2025 (Wikipedia, "East Wing": AP photos of
 *   23 October show "the entire East Wing, including the East Colonnade"
 *   gone). OSM maps the site, from the residence's east wall outwards, as
 *   building=construction "State Ballroom" (way/1536631257, checked
 *   2026-07-08). G. Edward Johnson's aerials of 9 September 2026 show the
 *   ballroom as a concrete and steel frame, and a new low glazed link against
 *   the residence's east end, still wrapped and scaffolded with workers on
 *   its roof. Neither is finished, so neither is drawn, and nothing on that
 *   side is replaced.
 * - Indoor room polygons tagged building:part inside the outline (toilets,
 *   indoor=room, height 0 or none) are not buildings; they are listed in
 *   `replaces` only because they sit wholly inside the model and a client
 *   would otherwise draw them as flat boxes. (They draw nothing above ground,
 *   so leaving them off would also be harmless.)
 *
 * Evidence
 * - OSM (measured): outline 52.2 × 26.4 m for the main block, the South
 *   Portico's bow 9 m deep, the North Portico 16.3 × 12.7 m. Column centres
 *   (14 parts, 1.17 m wide), chimney positions (8 parts, 1.9 × 2.4 m, h=23),
 *   roof part h 18–21. The South Portico's six columns fit a circle of
 *   radius 7.7 m centred 1.7 m north of the south wall line, at 25°, 50° and
 *   77° either side of the axis; the bow wall and base are drawn on the same
 *   centre. OSM puts the North Portico 0.4 m east of the axis; it is centred
 *   here, since the real portico is on the axis.
 * - Published (White House Historical Association, "White House
 *   Dimensions"; Wikipedia): 168 × 85.5 ft (51.2 × 26.1 m) main block
 *   without porticos; 70 ft (21.3 m) to the top of the roof on the south
 *   side and 60 ft 4 in (18.4 m) on the north, so the north ground is 2.9 m above the
 *   south lawn and y = 0 is the south lawn. Ground floor rusticated and
 *   exposed on the south, hidden on the north; State and Second floors in
 *   11 bays on the north (4 + 3 + 4) and 4 + bow + 4 on the south; third
 *   floor (1927) set back behind the balustrade with long shed dormers under
 *   a low hip roof; Truman Balcony inside the South Portico.
 * - Photos (Wikimedia Commons): north front, "The White House June 2024.jpg"
 *   (DJTechYT, CC BY-SA 4.0); south front, "White House (South Lawn).jpeg"
 *   (Mark Skrobola, CC BY 2.0) and "The White House South Portico.jpg"
 *   (Trendscope, CC BY 4.0); from above the south, "South facade of the
 *   White House, Washington DC, as seen from the Washington Monument.jpg"
 *   (Ad Meskens, CC BY-SA 3.0); aerials "Aerial view of the White House.jpg"
 *   (Carol M. Highsmith, public domain) and "White House construction aerial
 *   view 2025-12-03 14-15-53.jpg" (G. Edward Johnson, CC BY 4.0), which shows
 *   the East Wing site cleared.
 * - USGS NAIP orthophoto (public domain): plan, roof colours, the third
 *   floor's set-back roof.
 * - Estimated from the photos: storey heights (ground floor 4.4 m, State
 *   floor windows 5.6–9.2 m, Second floor 10.9–13.4 m), cornice 14.4–16.4 m,
 *   balustrade to 18 m, third floor wall to 18.6 m and a low hip to a broad
 *   flat deck at 19.5 m; the north pediment's apex at 21 m. The published
 *   21.3 m roof top is not followed: aerials and the view from the south
 *   lawn show the roof as a low, pale deck that barely clears the
 *   balustrade, so it is drawn that way; only the chimneys (23 m, OSM)
 *   stand clear of it;
 *   columns 10 m from the ground-floor base to the entablature; the
 *   solarium on the South Portico to 20 m; the stairs' rise.
 * - The Truman Balcony is drawn as a deep slab with a railing band across
 *   the South Portico's columns, about 10 m up.
 * - Wings, evidence. OSM (measured): every plan above. Published
 *   (Wikipedia, "West Wing"): Eric Gugler's 1934 rebuild added the set-back
 *   "penthouse" storey; the ground floor is partly a basement, so the first
 *   floor, the Rose Garden and the colonnade sit at about the south lawn's
 *   level. Photos: "White House W. Wing in April 2019.jpg" (Dan Scavino,
 *   public domain; the colonnade against the residence's west end),
 *   "Exterior of the White House West wing 001.jpg" (Geraldshields11, CC BY-SA
 *   4.0; the press room's arched north wall), "Oval Office Exterior.jpg"
 *   (Nilington, public domain), "Entrance of the West Wing under snow.jpg"
 *   (Chuck Kennedy, White House, public domain; the north portico), "Trump
 *   White House Rose Garden (September 5, 2025).jpg" (Speaker Mike Johnson,
 *   public domain), "Aerial view of the White House.jpg" (Carol M.
 *   Highsmith, public domain; roofs from the north), and "2026-09-09
 *   helipad construction White House Washington DC 12-33-53.jpg", "2026-09-09
 *   construction at the White House Washington DC 12-38-13.jpg" and "Marine
 *   One approaching the Ellipse Washington DC 2026-09-09 12-39-04 2.jpg" (G.
 *   Edward Johnson, CC BY 4.0; the colonnade and the West Wing from the
 *   south, and the east side today). The elevation "White House West
 *   Wing.svg" (Hstoops, CC0) was used only to confirm the massing.
 * - Wings, estimated: the colonnade's top at 5.7 m, columns 3.5 m (OSM says
 *   7 m, but photos put the parapet just under the residence's State-floor
 *   sills); the West Wing's cornice 6.2 m, penthouse wall to 8.55 m, and the
 *   window counts and spacing, read from the photos. The West Wing's roof
 *   edge is a plain parapet, not a balustrade: no photo shows balusters on
 *   it. OSM heights (7 m parapet, 10 m penthouse roof, 8 m Cabinet Room
 *   roof, 9 m Oval Office dome) are followed. The terracotta roof colour
 *   comes from OSM roof:colour=brown and the aerials.
 * - Simplified: window pediments are flat hoods; balusters are a light grey
 *   panel between white piers; the flagpole, lamps and the North Portico's
 *   lantern are left out.
 */
import { Part, cross, len, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ===========================================================================
// Kit, shared with dc-eisenhower-eob.ts and dc-treasury.ts.

export type XY = [number, number]
export type Rect = { x0: number; x1: number; y0: number; y1: number }
export const rect = (x0: number, x1: number, y0: number, y1: number): Rect => ({ x0, x1, y0, y1 })
export const grow = (r: Rect, d: number, dy = d): Rect => ({ x0: r.x0 - d, x1: r.x1 + d, y0: r.y0 - dy, y1: r.y1 + dy })
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (v: V3): V3 => { const l = len(v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** A quad turned to face `n`, whatever order its corners came in. */
export function qf(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const f = cross(sub(b, a), sub(c, a))
  if (len(f) < 1e-9) return
  if (dot(f, n) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
/** A triangle turned to face `n`. */
export function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  const f = cross(sub(b, a), sub(c, a))
  if (len(f) < 1e-9) return
  if (dot(f, n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}

/** A rectangle's ring with 45° chamfered corners of size c (c = 0: plain), CCW from above. */
export function ring(r: Rect, c: number, z: number): V3[] {
  if (c <= 0) return [[r.x0, r.y0, z], [r.x1, r.y0, z], [r.x1, r.y1, z], [r.x0, r.y1, z]]
  return [[r.x0 + c, r.y0, z], [r.x1 - c, r.y0, z], [r.x1, r.y0 + c, z], [r.x1, r.y1 - c, z],
    [r.x1 - c, r.y1, z], [r.x0 + c, r.y1, z], [r.x0, r.y1 - c, z], [r.x0, r.y0 + c, z]]
}

/**
 * A box, optionally with chamfered vertical corners (c) and a bevelled top
 * edge (b), so parapets and cornices catch a highlight. `bottom` closes the
 * underside, for bands that project.
 */
export function cbox(p: Part, r: Rect, z0: number, z1: number, o: { c?: number; b?: number; top?: boolean | Part; bottom?: boolean } = {}) {
  const c = o.c ?? 0, b = Math.min(o.b ?? 0, (z1 - z0) * 0.9)
  const rings = [ring(r, c, z0)]
  if (b > 0) {
    rings.push(ring(r, c, z1 - b))
    rings.push(ring(grow(r, -b), c > 0 ? Math.max(0.02, c - b * 0.414) : 0, z1))
  } else rings.push(ring(r, c, z1))
  p.loft(rings)
  if (o.top !== false) (o.top instanceof Part ? o.top : p).cap(rings[rings.length - 1], true)
  if (o.bottom) p.cap(rings[0], false)
}

/** A hollow rectangular wall of thickness t (a parapet), open in the middle. */
export function wallRing(p: Part, r: Rect, t: number, z0: number, z1: number) {
  const ri = grow(r, -t)
  p.loft([ring(r, 0, z0), ring(r, 0, z1)])
  p.loft([ring(ri, 0, z0).reverse(), ring(ri, 0, z1).reverse()])
  const o = ring(r, 0, z1), i = ring(ri, 0, z1)
  for (let k = 0; k < 4; k++) { const l = (k + 1) % 4; p.quad(i[k], o[k], o[l], i[l]) }
}

/**
 * A hip (or mansard) roof: the rectangle at z0 rising to an inset flat top
 * at z1. The inset is clamped so the top never inverts; `top` may be a
 * different part (a mansard's flat deck).
 */
export function hip(p: Part, r: Rect, z0: number, z1: number, inset: number, top: Part | false = p, insetY = inset) {
  const ix = Math.min(inset, (r.x1 - r.x0) / 2 - 0.05), iy = Math.min(insetY, (r.y1 - r.y0) / 2 - 0.05)
  const a = ring(r, 0, z0), t = ring(grow(r, -ix, -iy), 0, z1)
  p.loft([a, t])
  if (top) top.cap(t, true)
}

/** A gable roof over a rectangle, ridge along y (`ns`) or x; gable ends go to `ends`. */
export function gable(roof: Part, ends: Part, r: Rect, z0: number, z1: number, ns = true, closeEnds: [boolean, boolean] = [true, true]) {
  if (ns) {
    const xm = (r.x0 + r.x1) / 2
    qf(roof, [r.x0, r.y0, z0], [r.x0, r.y1, z0], [xm, r.y1, z1], [xm, r.y0, z1], [-(z1 - z0), 0, xm - r.x0])
    qf(roof, [r.x1, r.y0, z0], [r.x1, r.y1, z0], [xm, r.y1, z1], [xm, r.y0, z1], [z1 - z0, 0, r.x1 - xm])
    if (closeEnds[0]) tf(ends, [r.x0, r.y0, z0], [r.x1, r.y0, z0], [xm, r.y0, z1], [0, -1, 0])
    if (closeEnds[1]) tf(ends, [r.x0, r.y1, z0], [r.x1, r.y1, z0], [xm, r.y1, z1], [0, 1, 0])
  } else {
    const ym = (r.y0 + r.y1) / 2
    qf(roof, [r.x0, r.y0, z0], [r.x1, r.y0, z0], [r.x1, ym, z1], [r.x0, ym, z1], [0, -(z1 - z0), ym - r.y0])
    qf(roof, [r.x0, r.y1, z0], [r.x1, r.y1, z0], [r.x1, ym, z1], [r.x0, ym, z1], [0, z1 - z0, r.y1 - ym])
    if (closeEnds[0]) tf(ends, [r.x0, r.y0, z0], [r.x0, r.y1, z0], [r.x0, ym, z1], [-1, 0, 0])
    if (closeEnds[1]) tf(ends, [r.x1, r.y0, z0], [r.x1, r.y1, z0], [r.x1, ym, z1], [1, 0, 0])
  }
}

/** Which way a wall faces. */
export type Side = 'n' | 's' | 'e' | 'w'
const NORMAL: Record<Side, V3> = { n: [0, 1, 0], s: [0, -1, 0], e: [1, 0, 0], w: [-1, 0, 0] }

/**
 * A flat panel on a wall: the wall plane is at `at` (y for n/s, x for e/w),
 * the panel spans a0..a1 along the wall (x for n/s, y for e/w), lifted `d`
 * off it. Windows sit at d = 0.04.
 */
export function panel(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d = 0.04) {
  const n = NORMAL[side]
  const ns = side === 'n' || side === 's'
  const off = at + (ns ? n[1] : n[0]) * d
  const P = (a: number, z: number): V3 => (ns ? [a, off, z] : [off, a, z])
  qf(p, P(a0, z0), P(a1, z0), P(a1, z1), P(a0, z1), n)
}

/** A block standing proud of a wall by `d` (a hood, pier or plinth); back face omitted. */
export function block(p: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, d: number, bottom = true, top = true) {
  const n = NORMAL[side], ns = side === 'n' || side === 's'
  const sgn = ns ? n[1] : n[0]
  const P = (a: number, z: number, k: number): V3 => (ns ? [a, at + sgn * k, z] : [at + sgn * k, a, z])
  const lo: V3 = ns ? [-1, 0, 0] : [0, -1, 0], hi: V3 = ns ? [1, 0, 0] : [0, 1, 0]
  qf(p, P(a0, z0, d), P(a1, z0, d), P(a1, z1, d), P(a0, z1, d), n)
  qf(p, P(a0, z0, 0), P(a0, z0, d), P(a0, z1, d), P(a0, z1, 0), lo)
  qf(p, P(a1, z0, 0), P(a1, z0, d), P(a1, z1, d), P(a1, z1, 0), hi)
  if (top) qf(p, P(a0, z1, 0), P(a1, z1, 0), P(a1, z1, d), P(a0, z1, d), [0, 0, 1])
  if (bottom) qf(p, P(a0, z0, 0), P(a1, z0, 0), P(a1, z0, d), P(a0, z0, d), [0, 0, -1])
}

/** A smooth-shaded round column (no caps), optionally tapering to r1. */
export function cylinder(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 10, r1 = r) {
  for (let k = 0; k < seg; k++) {
    const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    const b0: V3 = [cx + r * n0[0], cy + r * n0[1], z0], b1: V3 = [cx + r * n1[0], cy + r * n1[1], z0]
    const t0: V3 = [cx + r1 * n0[0], cy + r1 * n0[1], z1], t1: V3 = [cx + r1 * n1[0], cy + r1 * n1[1], z1]
    p.tri(b0, b1, t1, undefined, undefined, undefined, [n0, n1, n1])
    p.tri(b0, t1, t0, undefined, undefined, undefined, [n0, n1, n0])
  }
}

/** A column with a square plinth and a square abacus. */
export function column(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 10) {
  const pl = r * 1.3, cap = Math.min(0.5, (z1 - z0) * 0.05)
  cbox(p, rect(cx - pl, cx + pl, cy - pl, cy + pl), z0, z0 + cap, { top: true })
  cylinder(p, cx, cy, r, z0 + cap, z1 - cap, seg, r * 0.9)
  cbox(p, rect(cx - pl, cx + pl, cy - pl, cy + pl), z1 - cap, z1, { bottom: true })
}

/** Points on an arc about (cx, cy), angles in degrees, inclusive. */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number, seg: number): XY[] {
  return Array.from({ length: seg + 1 }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * k) / seg) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as XY
  })
}

/** Smooth vertical wall along an arc, facing out (or in). */
export function arcWall(p: Part, cx: number, cy: number, r: number, a0: number, a1: number, seg: number, z0: number, z1: number, out = true) {
  const pts = arc(cx, cy, r, a0, a1, seg)
  for (let k = 0; k < seg; k++) {
    const A = pts[k], B = pts[k + 1]
    const nA = unit([(A[0] - cx) * (out ? 1 : -1), (A[1] - cy) * (out ? 1 : -1), 0])
    const nB = unit([(B[0] - cx) * (out ? 1 : -1), (B[1] - cy) * (out ? 1 : -1), 0])
    const a0v: V3 = [A[0], A[1], z0], b0v: V3 = [B[0], B[1], z0], a1v: V3 = [A[0], A[1], z1], b1v: V3 = [B[0], B[1], z1]
    const f = cross(sub(b0v, a0v), sub(b1v, a0v))
    if (dot(f, nA) >= 0) {
      p.tri(a0v, b0v, b1v, undefined, undefined, undefined, [nA, nB, nB])
      p.tri(a0v, b1v, a1v, undefined, undefined, undefined, [nA, nB, nA])
    } else {
      p.tri(a0v, b1v, b0v, undefined, undefined, undefined, [nA, nB, nB])
      p.tri(a0v, a1v, b1v, undefined, undefined, undefined, [nA, nA, nB])
    }
  }
}

/** A flat annular sector (r0 = 0: a fan), facing up or down. */
export function arcCap(p: Part, cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, seg: number, z: number, up = true) {
  const n: V3 = [0, 0, up ? 1 : -1]
  const o = arc(cx, cy, r1, a0, a1, seg), i = arc(cx, cy, Math.max(r0, 1e-4), a0, a1, seg)
  for (let k = 0; k < seg; k++) {
    if (r0 <= 0) tf(p, [cx, cy, z], [o[k][0], o[k][1], z], [o[k + 1][0], o[k + 1][1], z], n)
    else qf(p, [i[k][0], i[k][1], z], [o[k][0], o[k][1], z], [o[k + 1][0], o[k + 1][1], z], [i[k + 1][0], i[k + 1][1], z], n)
  }
}

/** A flat panel tangent to an arc wall of radius r, centred at angle a (degrees), w wide. */
export function arcPanel(p: Part, cx: number, cy: number, r: number, a: number, w: number, z0: number, z1: number, d = 0.04) {
  // Split in two so the chord stays within a few centimetres of the curve.
  const half = (w / 2 / r) * (180 / Math.PI)
  for (const [s0, s1] of [[a - half, a], [a, a + half]]) {
    const m = ((s0 + s1) / 2) * (Math.PI / 180)
    const n: V3 = [Math.cos(m), Math.sin(m), 0]
    const P = (s: number, z: number): V3 => {
      const t = (s * Math.PI) / 180
      return [cx + (r + d) * Math.cos(t), cy + (r + d) * Math.sin(t), z]
    }
    qf(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), n)
  }
}

/** A vertical prism over a convex polygon (CCW or not), with optional caps. */
export function prism(p: Part, pts: XY[], z0: number, z1: number, top: Part | boolean = true, bottom = false) {
  let area = 0
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1] }
  const ccw = area > 0 ? pts : [...pts].reverse()
  p.loft([ccw.map(([x, y]) => [x, y, z0] as V3), ccw.map(([x, y]) => [x, y, z1] as V3)])
  if (top) (top instanceof Part ? top : p).cap(ccw.map(([x, y]) => [x, y, z1] as V3), true)
  if (bottom) p.cap(ccw.map(([x, y]) => [x, y, z0] as V3), false)
}

/**
 * A balustrade along one straight run: a light baluster panel between
 * plain piers, on a plinth and under a rail. The panel's colour carries
 * the balusters' shadowy rhythm, which no geometry this coarse can.
 */
export function balustrade(stone: Part, bal: Part, side: Side, at: number, a0: number, a1: number, z0: number, z1: number, pitch: number, t = 0.45) {
  const n = NORMAL[side], ns = side === 'n' || side === 's'
  const sgn = ns ? n[1] : n[0]
  // Body: a thin wall whose outer face is the wall plane `at`.
  const inner = at - sgn * t
  const r = ns ? rect(a0, a1, Math.min(at, inner), Math.max(at, inner)) : rect(Math.min(at, inner), Math.max(at, inner), a0, a1)
  const plinth = 0.22 * (z1 - z0), rail = 0.2 * (z1 - z0)
  cbox(stone, r, z0, z0 + plinth, { top: false })
  cbox(bal, r, z0 + plinth, z1 - rail, { top: false })
  cbox(stone, grow(r, 0.06), z1 - rail, z1, { b: 0.06, bottom: true })
  const count = Math.max(1, Math.round((a1 - a0) / pitch))
  const step = (a1 - a0) / count, pw = Math.min(0.55, step * 0.3)
  for (let k = 0; k <= count; k++) {
    const a = a0 + k * step
    const s0 = Math.max(a0, a - pw / 2), s1 = Math.min(a1, a + pw / 2)
    block(stone, side, at, s0, s1, z0 + plinth, z1 - rail, 0.03, false)
  }
}

/** Triangle and byte budgets, and the write. */
export async function save(id: string, name: string, parts: Array<{ part: Part; material: { name: string; color: number; roughness?: number } }>, extras: Record<string, unknown>, maxTris = 5000) {
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (parts.length > 6) throw new Error(`${id}: ${parts.length} materials`)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250 * 1024) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ===========================================================================
// The White House.

function build() {
  const paint = new Part(), win = new Part(), roof = new Part(), bal = new Part(), door = new Part()

  // Plan (OSM, centred): main block, South Portico centre, North Portico.
  const X = 26.1, YS = -12.1, YN = 14.3
  const body = rect(-X, X, YS, YN)
  const BOW: XY = [0, -10.4] // centre of the South Portico's circle
  const R_WALL = 5.6, R_COL = 7.7, R_ROOF = 8.5, R_BASE = 8.7
  const NP = rect(-8.0, 8.0, YN, 27.0)

  // Heights. y = 0 is the south lawn; the north ground is 2.9 m higher.
  // (The north ground is 2.9 m up: north-side detail starts above it.)
  const G = 4.4 // top of the ground floor; the State floor
  const FRIEZE = 14.4, CORNICE = 16.4, BAL_TOP = 18.0
  const ATTIC_TOP = 18.6, ROOF_TOP = 19.5

  // ---- Main block: walls, string course, entablature, cornice.
  cbox(paint, body, 0, FRIEZE, { c: 0.25, top: false })
  cbox(paint, grow(body, 0.12), G, G + 0.4, { c: 0.3, b: 0.1, bottom: true, top: false })
  cbox(paint, grow(body, 0.08), FRIEZE, CORNICE - 0.7, { c: 0.3, top: false, bottom: true })
  cbox(paint, grow(body, 0.55), CORNICE - 0.7, CORNICE, { c: 0.5, b: 0.3, bottom: true })

  // Balustrade round the roof edge, piers on the bay rhythm.
  const BI = 0.55 // set back from the cornice lip to the wall line
  const bx0 = -X + 0.1, bx1 = X - 0.1
  // South run is broken by the portico's own curved balustrade.
  const bowEdge = Math.sqrt(R_ROOF * R_ROOF - (YS - BOW[1]) ** 2) // where the portico ring meets the wall
  balustrade(paint, bal, 's', YS + 0.1, bx0, -bowEdge, CORNICE, BAL_TOP, 4.05)
  balustrade(paint, bal, 's', YS + 0.1, bowEdge, bx1, CORNICE, BAL_TOP, 4.05)
  balustrade(paint, bal, 'n', YN - 0.1, NP.x1, bx1, CORNICE, BAL_TOP, 4.05)
  balustrade(paint, bal, 'n', YN - 0.1, bx0, NP.x0, CORNICE, BAL_TOP, 4.05)
  balustrade(paint, bal, 'e', X - 0.1, YS + 0.1, YN - 0.1, CORNICE, BAL_TOP, 4.4)
  balustrade(paint, bal, 'w', -X + 0.1, YS + 0.1, YN - 0.1, CORNICE, BAL_TOP, 4.4)
  void BI

  // Roof deck behind the balustrade.
  cbox(roof, grow(body, -0.4), CORNICE - 0.05, CORNICE + 0.05, { top: true })

  // ---- Third floor: set back (OSM roof part), a wall of shed-dormer
  // windows, a low hip roof with a flat top.
  const attic = rect(-22.5, 22.5, -8.5, 10.8)
  cbox(paint, attic, CORNICE, ATTIC_TOP, { top: false })
  hip(roof, grow(attic, 0.3), ATTIC_TOP, ROOF_TOP, 2.6) // low slope to a broad flat deck
  cbox(paint, grow(attic, 0.3), ATTIC_TOP - 0.25, ATTIC_TOP, { bottom: true, top: false })
  for (const xs of [[-20.5, -14.2], [-12.0, -6.6], [6.6, 12.0], [14.2, 20.5]]) {
    panel(win, 's', attic.y0, xs[0], xs[1], 16.9, 18.2)
    panel(win, 'n', attic.y1, xs[0], xs[1], 16.9, 18.2)
  }
  for (const ys of [[-6.5, -1.0], [3.2, 8.8]]) {
    panel(win, 'e', attic.x1, ys[0], ys[1], 16.9, 18.2)
    panel(win, 'w', attic.x0, ys[0], ys[1], 16.9, 18.2)
  }

  // ---- Chimneys (OSM positions, symmetrical): tall white stacks with a cap.
  for (const [cx, cy] of [[6.75, 9.2], [12.6, 9.2], [4.6, -5.5], [12.5, -5.5]] as XY[]) {
    for (const s of [-1, 1]) {
      const r = rect(s * cx - 0.95, s * cx + 0.95, cy - 1.2, cy + 1.2)
      cbox(paint, r, CORNICE, 22.4, { c: 0.15, top: false })
      cbox(paint, grow(r, 0.15), 22.4, 23.0, { c: 0.2, b: 0.12, bottom: true })
    }
  }

  // ---- Windows: four bays either side of each portico, mirrored.
  const bays = [10.4, 14.5, 18.5, 22.6]
  const W = 1.6
  const stateWin = (side: Side, at: number, x: number) => {
    panel(win, side, at, x - W / 2, x + W / 2, 5.6, 9.2)
    block(paint, side, at, x - W / 2 - 0.35, x + W / 2 + 0.35, 9.45, 9.95, 0.3)
  }
  const secondWin = (side: Side, at: number, x: number) => {
    panel(win, side, at, x - W / 2, x + W / 2, 10.9, 13.4)
    block(paint, side, at, x - W / 2 - 0.2, x + W / 2 + 0.2, 13.55, 13.85, 0.18)
  }
  for (const s of [-1, 1]) for (const b of bays) {
    const x = s * b
    for (const [side, at] of [['s', YS], ['n', YN]] as [Side, number][]) {
      stateWin(side, at, x)
      secondWin(side, at, x)
    }
    // Ground floor: exposed on the south only.
    panel(win, 's', YS, x - 0.7, x + 0.7, 1.0, 3.3)
  }
  // Ends: three bays.
  for (const y of [-6.4, 1.1, 8.6]) {
    for (const [side, at] of [['e', X], ['w', -X]] as [Side, number][]) {
      panel(win, side, at, y - W / 2, y + W / 2, 5.6, 9.2)
      block(paint, side, at, y - W / 2 - 0.35, y + W / 2 + 0.35, 9.45, 9.95, 0.3)
      panel(win, side, at, y - W / 2, y + W / 2, 10.9, 13.4)
    }
  }
  // Ground-floor rustication on the exposed south: a few shallow bands.
  for (const z of [1.0, 2.15, 3.3]) {
    block(paint, 's', YS, -X, -bowEdge, z - 0.06, z + 0.06, 0.06)
    block(paint, 's', YS, bowEdge, X, z - 0.06, z + 0.06, 0.06)
  }

  // ---- South Portico: arcaded base, bow wall, six columns, entablature,
  // curved balustrade, the Truman Balcony, the solarium on top.
  const angBase = Math.asin((BOW[1] - YS) / R_BASE) * 180 / Math.PI // degrees below the x axis at the wall
  const angRoof = Math.asin((BOW[1] - YS) / R_ROOF) * 180 / Math.PI
  const angWall = Math.asin((BOW[1] - YS) / R_WALL) * 180 / Math.PI
  // Base: the ground floor of the bow, out to the outline.
  arcWall(paint, BOW[0], BOW[1], R_BASE, -180 + angBase, -angBase, 14, 0, G)
  arcCap(paint, BOW[0], BOW[1], R_WALL, R_BASE, -180 + angBase, -angBase, 14, G)
  for (const a of [-125, -90, -55]) arcPanel(a === -90 ? door : win, BOW[0], BOW[1], R_BASE, a, 1.8, 0.6, 3.5)
  // Bow wall with its three windows a floor.
  arcWall(paint, BOW[0], BOW[1], R_WALL, -180 + angWall, -angWall, 12, G, FRIEZE)
  for (const a of [-130, -90, -50]) {
    arcPanel(a === -90 ? door : win, BOW[0], BOW[1], R_WALL, a, 1.7, 5.0, 9.4)
    arcPanel(win, BOW[0], BOW[1], R_WALL, a, 1.5, 10.9, 13.4)
  }
  // Truman Balcony: a thin floor between the bow wall and the columns.
  // A deep slab the columns pass through, with a railing at its edge, so it
  // reads as the band across the portico that it is in the photos.
  const angCol = Math.asin((BOW[1] - YS) / (R_COL + 0.2)) * 180 / Math.PI
  arcCap(paint, BOW[0], BOW[1], R_WALL, R_COL + 0.2, -180 + angCol, -angCol, 14, 10.3)
  arcCap(paint, BOW[0], BOW[1], R_WALL, R_COL + 0.2, -180 + angCol, -angCol, 14, 9.7, false)
  arcWall(paint, BOW[0], BOW[1], R_COL + 0.2, -180 + angCol, -angCol, 14, 9.7, 10.3)
  arcWall(bal, BOW[0], BOW[1], R_COL - 0.05, -180 + angCol, -angCol, 14, 10.3, 11.3)
  arcWall(bal, BOW[0], BOW[1], R_COL - 0.15, -180 + angCol, -angCol, 14, 10.3, 11.3, false)
  // Columns.
  for (const a of [-25, -50, -77]) for (const s of [1, -1]) {
    const t = ((s > 0 ? a : -180 - a) * Math.PI) / 180
    column(paint, BOW[0] + R_COL * Math.cos(t), BOW[1] + R_COL * Math.sin(t), 0.58, G, FRIEZE, 10)
  }
  // Entablature ring and its curved balustrade.
  arcWall(paint, BOW[0], BOW[1], R_ROOF, -180 + angRoof, -angRoof, 14, FRIEZE, CORNICE)
  arcCap(paint, BOW[0], BOW[1], R_WALL - 0.5, R_ROOF, -180 + angRoof, -angRoof, 14, FRIEZE, false)
  arcCap(roof, BOW[0], BOW[1], 0, R_ROOF, -180 + angRoof, -angRoof, 14, CORNICE - 0.02)
  arcWall(paint, BOW[0], BOW[1], R_ROOF - 0.05, -180 + angRoof, -angRoof, 14, CORNICE, CORNICE + 0.35)
  arcWall(bal, BOW[0], BOW[1], R_ROOF - 0.12, -180 + angRoof, -angRoof, 14, CORNICE + 0.35, BAL_TOP - 0.32)
  arcWall(paint, BOW[0], BOW[1], R_ROOF - 0.02, -180 + angRoof, -angRoof, 14, BAL_TOP - 0.32, BAL_TOP)
  arcCap(paint, BOW[0], BOW[1], R_ROOF - 0.55, R_ROOF - 0.02, -180 + angRoof, -angRoof, 14, BAL_TOP)
  arcWall(bal, BOW[0], BOW[1], R_ROOF - 0.55, -180 + angRoof, -angRoof, 14, CORNICE, BAL_TOP, false)
  for (const a of [-20, -45, -90, -135, -160]) {
    const t = (a * Math.PI) / 180, r0 = R_ROOF - 0.55, r1 = R_ROOF + 0.02
    const c: XY = [BOW[0] + ((r0 + r1) / 2) * Math.cos(t), BOW[1] + ((r0 + r1) / 2) * Math.sin(t)]
    cbox(paint, rect(c[0] - 0.3, c[0] + 0.3, c[1] - 0.3, c[1] + 0.3), CORNICE + 0.35, BAL_TOP - 0.32, { top: false })
  }
  // Solarium: a low glazed room on the portico roof (OSM pyramidal part).
  const sol: XY[] = [[-4.6, -14.2], [-3.1, -16.2], [3.1, -16.2], [4.6, -14.2], [4.6, -10.0], [3.1, -8.5], [-3.1, -8.5], [-4.6, -10.0]]
  prism(paint, sol, CORNICE, 16.9, false)
  prism(win, sol.map(([x, y]) => [x * 0.985, -12.35 + (y + 12.35) * 0.985] as XY), 16.9, 18.9, false)
  {
    const lid = sol.map(([x, y]) => [x * 1.06, -12.35 + (y + 12.35) * 1.06] as XY)
    prism(paint, lid, 18.9, 19.3, false, true)
    const top = lid.map(([x, y]) => [x * 0.45, -12.35 + (y + 12.35) * 0.45] as XY)
    roof.loft([[...lid].reverse().map(([x, y]) => [x, y, 19.3] as V3), [...top].reverse().map(([x, y]) => [x, y, 20.0] as V3)])
    roof.cap([...top].reverse().map(([x, y]) => [x, y, 20.0] as V3), true)
  }

  // Curved stairs either side of the bow (OSM ways 1425481054/55): a ramp
  // from the lawn at the front up to the State floor beside the wall.
  for (const s of [-1, 1]) {
    const inner = arc(BOW[0], BOW[1], R_BASE, -75, -30, 6), outer = arc(BOW[0], BOW[1], R_BASE + 3.4, -75, -30, 6)
    const h = (k: number) => 0.4 + (G - 0.6) * (k / 6)
    for (let k = 0; k < 6; k++) {
      const f = (q: XY, z: number): V3 => [s * q[0], q[1], z]
      const n: V3 = [0, 0, 1]
      qf(paint, f(inner[k], h(k)), f(outer[k], h(k)), f(outer[k + 1], h(k + 1)), f(inner[k + 1], h(k + 1)), n)
      const ox = outer[k], oy = outer[k + 1]
      qf(paint, f(ox, 0), f(oy, 0), f(oy, h(k + 1)), f(ox, h(k)), [s * (ox[0] - BOW[0]), ox[1] - BOW[1], 0])
    }
    // Front end and the wall-side end.
    const f = (q: XY, z: number): V3 => [s * q[0], q[1], z]
    qf(paint, f(inner[0], 0), f(outer[0], 0), f(outer[0], h(0)), f(inner[0], h(0)), [0, -1, 0])
    qf(paint, f(inner[6], 0), f(outer[6], 0), f(outer[6], h(6)), f(inner[6], h(6)), [s, 0.3, 0])
  }

  // ---- North Portico: podium, four-by-two Ionic columns, entablature and
  // attic level with the balustrade, pediment and gable roof.
  cbox(paint, rect(NP.x0, NP.x1, YN - 0.2, NP.y1), 0, G, { c: 0.2 })
  for (const x of [-6.95, -2.3, 2.3, 6.95]) column(paint, x, 25.95, 0.58, G, FRIEZE, 10)
  for (const s of [-1, 1]) for (const y of [19.5, 22.2]) column(paint, s * 6.95, y, 0.58, G, FRIEZE, 10)
  for (const s of [-1, 1]) cbox(paint, rect(s * 6.95 - 0.45, s * 6.95 + 0.45, YN, YN + 0.5), G, FRIEZE, { top: false }) // pilasters at the wall
  const ent = rect(NP.x0 + 0.3, NP.x1 - 0.3, YN, NP.y1 - 0.3)
  cbox(paint, ent, FRIEZE, CORNICE - 0.7, { bottom: true, top: false })
  cbox(paint, grow(ent, 0.3), CORNICE - 0.7, CORNICE, { b: 0.25, bottom: true, top: false })
  cbox(paint, ent, CORNICE, BAL_TOP, { top: false })
  cbox(paint, grow(ent, 0.2), BAL_TOP - 0.35, BAL_TOP, { b: 0.1, bottom: true })
  // Pediment: a white tympanum under a grey gable roof that runs back to the attic.
  const ped = rect(ent.x0 - 0.2, ent.x1 + 0.2, YN - 1.5, ent.y1 + 0.2)
  gable(roof, paint, ped, BAL_TOP, 21.0, true, [true, true])
  // Doorway behind the columns.
  panel(door, 'n', YN, -1.0, 1.0, G, 8.6)
  for (const x of [-4.7, 4.7]) { panel(win, 'n', YN, x - W / 2, x + W / 2, 5.6, 9.2); panel(win, 'n', YN, x - W / 2, x + W / 2, 10.9, 13.4) }
  panel(win, 'n', YN, -W / 2, W / 2, 10.9, 13.4)

  const terrace = new Part()
  wings(paint, bal, win, roof, door, terrace)

  return [
    { part: paint, material: finish('white-house-paint', 0xfaf7f1) },
    { part: bal, material: finish('baluster', 0xd8d6d0) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: roof, material: finish('white-house-roof', 0xcdc9c1) },
    { part: terrace, material: finish('terrace-roof', 0xc9a495) },
  ]
}

// ===========================================================================
// The West Colonnade and the West Wing. Same frame as the residence; plan
// from the OSM ways named at each block. y = 0 (the south lawn) is also, to
// within half a metre, the Rose Garden and the West Wing's first floor: the
// colonnade enters the residence at its ground floor, and the Oval Office
// opens onto the colonnade.

/** Points round an ellipse, CCW from +x, angles in degrees. */
function ellipse(cx: number, cy: number, a: number, b: number, seg: number, a0 = 0, a1 = 360): XY[] {
  const n = a1 - a0 === 360 ? seg : seg + 1
  return Array.from({ length: n }, (_, k) => {
    const t = ((a0 + ((a1 - a0) * k) / seg) * Math.PI) / 180
    return [cx + a * Math.cos(t), cy + b * Math.sin(t)] as XY
  })
}

/** A smooth-shaded closed elliptical wall, facing out. */
function ellipseWall(p: Part, cx: number, cy: number, a: number, b: number, seg: number, z0: number, z1: number) {
  const pts = ellipse(cx, cy, a, b, seg)
  const nrm = ([x, y]: XY): V3 => unit([(x - cx) / (a * a), (y - cy) / (b * b), 0])
  for (let k = 0; k < seg; k++) {
    const A = pts[k], B = pts[(k + 1) % seg], nA = nrm(A), nB = nrm(B)
    const b0: V3 = [A[0], A[1], z0], b1: V3 = [B[0], B[1], z0], t0: V3 = [A[0], A[1], z1], t1: V3 = [B[0], B[1], z1]
    p.tri(b0, b1, t1, undefined, undefined, undefined, [nA, nB, nB])
    p.tri(b0, t1, t0, undefined, undefined, undefined, [nA, nB, nA])
  }
}

/** A flat panel on an elliptical wall at angle t (degrees), w wide. */
function ellipsePanel(p: Part, cx: number, cy: number, a: number, b: number, t: number, w: number, z0: number, z1: number, d = 0.05) {
  const r = (t * Math.PI) / 180
  const P: XY = [cx + a * Math.cos(r), cy + b * Math.sin(r)]
  const T = unit([-a * Math.sin(r), b * Math.cos(r), 0]), N = unit([Math.cos(r) / a, Math.sin(r) / b, 0])
  const at = (s: number, z: number): V3 => [P[0] + T[0] * s + N[0] * d, P[1] + T[1] * s + N[1] * d, z]
  qf(p, at(-w / 2, z0), at(w / 2, z0), at(w / 2, z1), at(-w / 2, z1), N)
}

/** A plain shaft with a square abacus: the colonnades' Tuscan columns. */
function tuscan(p: Part, x: number, y: number, r: number, z0: number, z1: number) {
  cylinder(p, x, y, r, z0, z1 - 0.3, 8, r * 0.88)
  cbox(p, rect(x - r * 1.25, x + r * 1.25, y - r * 1.25, y + r * 1.25), z1 - 0.3, z1, { bottom: true, top: false })
}

function wings(paint: Part, shade: Part, win: Part, roof: Part, door: Part, terrace: Part) {
  // ---- West Colonnade (way/238241017): an open Tuscan colonnade along the
  // Rose Garden, the enclosed West Terrace (press briefing room) behind it,
  // one flat terrace roof behind a plain parapet. Its top sits just under the
  // residence's State-floor sills (photo), so 5.7 m, not OSM's 7. The
  // entablature and parapet together are about half the columns' height
  // (two photos).
  const C_FLOOR = 0.4, C_COL = 3.9, C_ENT = 4.9, C_TOP = 5.7
  const COL = rect(-64.3, -26.1, -7.5, 3.2), BACK = -3.9 // back wall of the open walk
  cbox(paint, rect(COL.x0, COL.x1, BACK, COL.y1), 0, C_ENT, { top: false })
  cbox(paint, rect(COL.x0, COL.x1, COL.y0, BACK), 0, C_FLOOR, { top: true })
  cbox(paint, rect(COL.x0, COL.x1, COL.y0, BACK), C_COL, C_ENT, { top: false, bottom: true })
  cbox(paint, grow(COL, 0, 0.2), C_ENT - 0.3, C_ENT + 0.05, { b: 0.1, top: false, bottom: true })
  terrace.cap(ring(grow(COL, 0, -0.3), 0, C_ENT + 0.1), true)
  cbox(paint, rect(COL.x0, COL.x1, COL.y0 - 0.05, COL.y0 + 0.3), C_ENT + 0.05, C_TOP, { b: 0.08 })
  cbox(paint, rect(COL.x0, -43.1, COL.y1 - 0.3, COL.y1 + 0.05), C_ENT + 0.05, C_TOP, { b: 0.08 })
  const cols = 10, cx0 = -61.0, cx1 = -29.4, pitch = (cx1 - cx0) / (cols - 1)
  for (let k = 0; k < cols; k++) tuscan(paint, cx0 + k * pitch, COL.y0 + 0.5, 0.34, C_FLOOR, C_COL)
  // The walk behind the columns is in shade in every photo: its back wall
  // takes the baluster grey, so the columns read against it.
  panel(shade, 's', BACK, COL.x0, COL.x1, C_FLOOR, C_COL, 0.02)
  // Arched French doors on the back wall, one per bay, and the press room's
  // arched windows on the north side (photos).
  for (let k = 0; k < cols - 1; k++) {
    const x = cx0 + (k + 0.5) * pitch
    panel(win, 's', BACK, x - 0.65, x + 0.65, C_FLOOR + 0.1, 3.3)
  }
  for (let x = -61.6; x < -44; x += 2.4) panel(win, 'n', COL.y1, x - 0.6, x + 0.6, 1.0, 3.8)
  // The curved press-room bay at the north-west corner of the residence, and
  // the steps back to the residence's wall.
  prism(paint, [[-43.1, 2.9], [-34.0, 2.9], [-34.0, 10.3], [-35.5, 10.1], [-38.3, 9.2], [-39.9, 8.3], [-41.4, 7.3], [-43.1, 6.5]], 0, C_TOP, terrace)
  cbox(paint, rect(-34.0, -31.0, 2.9, 6.5), 0, C_TOP, { top: terrace })
  cbox(paint, rect(-31.0, -26.1, 2.9, 4.2), 0, C_TOP, { top: terrace })

  // ---- West Wing (relation/19761232). Heights: walls to a cornice at 6.2 m
  // and a parapet to 7 m (OSM h=7); the 1934 "penthouse" storey set back
  // 1.5 m (OSM part 257920192) under a low pale mansard to 9.8 m (OSM h=10,
  // roof 1.5 m).
  const W_CORN = 5.6, W_ROOF = 6.2, W_PAR = 7.0
  const MB = rect(-110.0, -78.3, -36.8, -6.5) // main block, way/257920201's west part
  cbox(paint, MB, 0, W_CORN, { c: 0.2, top: false })
  cbox(paint, grow(MB, 0.3), W_CORN, W_ROOF, { c: 0.3, b: 0.15, top: false, bottom: true })
  wallRing(paint, MB, 0.35, W_ROOF, W_PAR)
  roof.cap(ring(grow(MB, -0.35), 0, W_ROOF), true)
  const PH = rect(-108.5, -79.8, -35.3, -8.1)
  cbox(paint, PH, W_ROOF, 8.3, { top: false })
  cbox(paint, grow(PH, 0.15), 8.3, 8.55, { b: 0.08, top: false, bottom: true })
  hip(roof, grow(PH, 0.1), 8.55, 9.8, 1.6)
  for (let x = -106.5; x <= -81; x += 2.55) for (const [side, at] of [['s', PH.y0], ['n', PH.y1]] as [Side, number][]) panel(win, side, at, x - 0.45, x + 0.45, 7.0, 7.9)
  for (let y = -33.2; y <= -10; y += 2.55) for (const [side, at] of [['w', PH.x0], ['e', PH.x1]] as [Side, number][]) panel(win, side, at, y - 0.45, y + 0.45, 7.0, 7.9)
  // Tall first-floor windows (photos: one row, plain frames).
  const tall = (side: Side, at: number, a: number) => panel(win, side, at, a - 0.65, a + 0.65, 1.3, 4.6)
  for (const x of [-107.5, -104.5, -101.5, -96.6, -91.8, -87.0, -84.0, -81.0]) tall('n', MB.y1, x)
  for (let x = -108.0; x <= -80.9; x += 3.0) tall('s', MB.y0, x)
  for (const y of [-34.4, -31.2, -28.0, -19.2, -16.0, -12.8, -9.6]) tall('w', MB.x0, y)
  panel(door, 'n', MB.y1, -95.0, -93.4, 0.3, 3.6)
  panel(door, 'w', MB.x0, -24.4, -22.8, 0.3, 3.4)
  // North entrance portico (257920193, roof 1445440857, columns
  // 257920178–181): four columns under a flat canopy, 4–6 m (OSM).
  for (const x of [-90.3, -92.95, -95.6, -98.2]) tuscan(paint, x, -0.85, 0.3, 0, 4.2)
  cbox(paint, rect(-98.8, -89.6, MB.y1, -0.35), 4.2, 5.8, { b: 0.15, bottom: true, top: roof })
  // West entrance canopy (building=roof way/887434559) on two posts.
  cbox(paint, rect(-118.5, -110.0, -26.0, -21.2), 3.2, 3.55, { b: 0.08, bottom: true })
  for (const y of [-25.6, -21.6]) cbox(paint, rect(-118.3, -118.0, y - 0.15, y + 0.15), 0, 3.2, { top: false })

  // East block (257920184): the Oval Office, the Cabinet Room's raised roof
  // (257920197, h=8) and the press offices, under terracotta-coloured roof
  // (OSM roof:colour brown; aerials). Along its east side an open loggia
  // faces the Rose Garden and meets the colonnade at the corner.
  const EB = rect(-78.3, -64.3, -35.6, -7.6), ANNEX = rect(-76.5, -64.3, -7.6, 3.2), LOG_X = -68.0
  cbox(paint, rect(EB.x0, LOG_X, EB.y0, EB.y1), 0, W_CORN, { top: false })
  cbox(paint, ANNEX, 0, W_CORN, { top: false })
  cbox(paint, rect(LOG_X, EB.x1, EB.y0, EB.y1), 0, C_FLOOR, { top: true })
  cbox(paint, rect(LOG_X, EB.x1, EB.y0, EB.y1), 4.2, W_CORN, { top: false, bottom: true })
  for (let k = 0; k < 7; k++) tuscan(paint, EB.x1 - 0.5, EB.y0 + 0.7 + k * ((EB.y1 - EB.y0 - 1.4) / 6), 0.3, C_FLOOR, 4.2)
  panel(shade, 'e', LOG_X, EB.y0, EB.y1, C_FLOOR, 4.2, 0.02)
  for (const y of [-24.0, -20.0, -16.0, -12.0]) panel(win, 'e', LOG_X, y - 0.7, y + 0.7, C_FLOOR + 0.1, 3.6)
  panel(door, 'e', LOG_X, -29.2, -27.8, C_FLOOR + 0.1, 3.0)
  for (const x of [-74.0, -70.5, -67.0]) tall('n', ANNEX.y1, x)
  for (const y of [-3.0, 0.5]) tall('w', ANNEX.x0, y)
  // Cornice and parapet round the outside edges only (the west edge abuts
  // the main block; the Oval Office carries its own).
  cbox(paint, rect(-70.0, EB.x1 + 0.3, EB.y0 - 0.3, EB.y0 + 0.3), W_CORN, W_ROOF, { b: 0.15, top: false, bottom: true })
  cbox(paint, rect(EB.x1 - 0.3, EB.x1 + 0.3, EB.y0, ANNEX.y1), W_CORN, W_ROOF, { b: 0.15, top: false, bottom: true })
  cbox(paint, rect(ANNEX.x0 - 0.3, EB.x1, ANNEX.y1 - 0.3, ANNEX.y1 + 0.3), W_CORN, W_ROOF, { b: 0.15, top: false, bottom: true })
  cbox(paint, rect(ANNEX.x0 - 0.3, ANNEX.x0 + 0.3, MB.y1, ANNEX.y1), W_CORN, W_ROOF, { b: 0.15, top: false, bottom: true })
  cbox(paint, rect(-70.0, EB.x1, EB.y0, EB.y0 + 0.35), W_ROOF, W_PAR, { b: 0.08 })
  cbox(paint, rect(EB.x1 - 0.35, EB.x1, EB.y0, ANNEX.y1), W_ROOF, W_PAR, { b: 0.08 })
  cbox(paint, rect(ANNEX.x0, EB.x1, ANNEX.y1 - 0.35, ANNEX.y1), W_ROOF, W_PAR, { b: 0.08 })
  cbox(paint, rect(ANNEX.x0, ANNEX.x0 + 0.35, MB.y1, ANNEX.y1), W_ROOF, W_PAR, { b: 0.08 })
  terrace.cap(ring(rect(EB.x0, EB.x1, EB.y0, EB.y1), 0, W_ROOF), true)
  terrace.cap(ring(ANNEX, 0, W_ROOF), true)
  const CR = rect(-74.9, -68.4, -26.3, -7.6)
  cbox(paint, CR, W_ROOF, 7.75, { top: false })
  cbox(terrace, grow(CR, 0.12), 7.75, 7.95, { b: 0.08, bottom: true })

  // The Oval Office (way/238241023): an oval bay on the south side, its
  // long axis north–south (OSM: 9.4 × 11.6 m outside), three tall windows
  // to the lawn, and a low white drum and dome over it (OSM dome, h=9).
  const O: XY = [-74.1, -32.0], OA = 4.7, OB = 5.8, OS = 24
  ellipseWall(paint, O[0], O[1], OA, OB, OS, 0, W_CORN)
  ellipseWall(paint, O[0], O[1], OA + 0.25, OB + 0.25, OS, W_CORN, W_ROOF)
  {
    const i = ellipse(O[0], O[1], OA, OB, OS), o = ellipse(O[0], O[1], OA + 0.25, OB + 0.25, OS)
    for (let k = 0; k < OS; k++) {
      const l = (k + 1) % OS
      qf(paint, [i[k][0], i[k][1], W_CORN], [o[k][0], o[k][1], W_CORN], [o[l][0], o[l][1], W_CORN], [i[l][0], i[l][1], W_CORN], [0, 0, -1])
    }
  }
  ellipseWall(paint, O[0], O[1], OA + 0.05, OB + 0.05, OS, W_ROOF, W_PAR)
  paint.cap(ellipse(O[0], O[1], OA + 0.25, OB + 0.25, OS).map(([x, y]) => [x, y, W_ROOF] as V3), true)
  paint.cap(ellipse(O[0], O[1], OA + 0.05, OB + 0.05, OS).map(([x, y]) => [x, y, W_PAR] as V3), true)
  ellipseWall(paint, O[0], O[1], OA * 0.78, OB * 0.78, OS, W_PAR, 7.6)
  const dome = [0.78, 0.6, 0.3].map((s, k) => ellipse(O[0], O[1], OA * s, OB * s, OS).map(([x, y]) => [x, y, [7.6, 8.4, 8.85][k]] as V3))
  paint.loft(dome)
  paint.cap(dome[2], true)
  for (const t of [-62, -90, -118]) ellipsePanel(win, O[0], O[1], OA, OB, t, 1.4, 0.6, 4.6)
}

if (import.meta.main) {
  await save('dc-white-house', 'White House', build(), {
    bearing: 0, osm: 'relation/19761182', footprint: [144.7, 64.8], height: 23,
  }, 6500)
}
