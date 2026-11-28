/**
 * Mortgage Matchup Center (opened 1992 as America West Arena; later US
 * Airways Center, Talking Stick Resort Arena and Footprint Center;
 * renovated 2020–21), Phoenix, Arizona — original procedural geometry,
 * CC0-1.0.
 * bun generators/phx-footprint-center.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the arena's walls
 * run north–south and east–west. Anchor -112.0712148, 33.4459271, the area
 * centroid of OSM's outline way/24635397. Geometry below is written in
 * "site" metres about -112.07137, 33.44613 and shifted by (-14.4, +22.5)
 * into the anchor frame on output.
 *
 * What is drawn: OSM way/24635397 (the arena, start_date 1992) and its
 * part way/537143037 (the bowl). The parking garage on the west side,
 * way/109835135 (building=parking, 4 levels), shares the bowl's west wall
 * but is its own OSM building; it is left to the map, so the model stops
 * at the bowl's west face (x -37 in site metres).
 *
 * Identity (from the photos below):
 *  1. The big chamfered-octagon bowl, its walls in two tones: a grey-beige
 *     block lower body and a cream upper drum over a dark recessed band,
 *     under a low hipped roof.                    (s2005, u4, lidar, NAIP)
 *  2. The curved four-storey glass lobby wrapping the round plaza at the
 *     north-west corner (1st St & Jefferson), with the arena's name in
 *     big letters on its roof and a tall banner screen at its west end.
 *                                                  (fc22, NAIP)
 *  3. The long glass atrium on the east side along 3rd Street, its glass
 *     roof sloping down to the street.             (u4, NAIP, lidar)
 *  4. The glazed north lobby along Jefferson between them.     (u4)
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020, 1 m grid,
 * tools/lidar.py, read with tools/lidar_frame.py; ground_min 329.85 m).
 * The site is flat within 1.8 m (Mapterhorn, tools/terrain.ts grid), so
 * y = 0 is the lowest ground and heights are lidar values. Measured: the
 * bowl's eaves 27 (parapet to 28), the hipped roof's flat top 35.8 over
 * x -5..35, y -65..-5 (site), the roof falling about 1.2 m per 5 m to the
 * eaves on every side; the bowl's plan x -36.5..67.1, y -96..28 with 24 m
 * chamfers (the lidar's edge; OSM's part has 28 m chamfers); the north and
 * north-west lobbies 16.5–17.8 (drawn 17); the east atrium's roof 19.6 at
 * its west edge to 17 at the street; the low south strip about 6.
 * Plan: OSM's outline, the round plaza's arc refitted as a circle (centre
 * -59, 62 site metres, radius 30) through OSM's arc nodes.
 *
 * Estimated: the dark band's height (16.8–20.3, from s2005 and u4 scaled
 * to the lidar eaves); the south face's centre bay, its arched window and
 * the doors (s2005); the lobbies' curtain walls (fc22, u4): door storey to
 * 4.4, a pale soffit band to 5.3, then light glass to the coping at 15.6
 * with mullions about every 3 m and transoms at 9 and 12.8; the name sign
 * on the curved lobby (fc22: a dark row of letters on the coping, drawn
 * as one plain block per letter, 3.8 m tall, about 1.5 times the real
 * letters so they read at phone size; the arena was renamed in 2025 and
 * the letters change with sponsors); the banner screens (fc22 west end;
 * u4 at the north-east corner); the north lobby's white truss canopy (u4:
 * four masts to 19.5, a 5.6 m deep canopy at 12.4–12.9 with a deeper truss
 * edge). Left out: the plaza's lamps and trees, the rooftop plant, the
 * separate canopy north of the round plaza (outside OSM's outline).
 * Rework (lead review against fc22): the curved and north lobbies were
 * slate panels inside a beige frame under a thin sign strip; they are now
 * light glass curtain walls with pale mullions under a bold dark sign, and
 * the truss canopy was added. Massing unchanged. To stay at six materials,
 * the east atrium's glass roof is drawn in the roof colour, and the sign
 * shares the banners' dark purple `neon-screen`.
 * The 2020–21 renovation: fc22 (Aug 2022) and the NAIP roof (which reads
 * FOOTPRINT CENTER, so post-2021) both match the lidar's curved lobby
 * and roof; colours of the bowl walls come from the 2005 and 2013 photos,
 * since no licensed post-2021 photo shows them.
 *
 * Photos (evidence, Wikimedia Commons):
 *  fc22  "Footprint Center 2022.jpg", Troutfarm27, CC BY-SA 4.0, Aug 2022,
 *        from the round plaza (north-west)
 *        https://commons.wikimedia.org/wiki/File:Footprint_Center_2022.jpg
 *  u4    "US Airways Center-4.jpg", Visitor7, CC BY-SA 3.0, Dec 2013, from
 *        Jefferson & 3rd St (north-east)
 *        https://commons.wikimedia.org/wiki/File:US_Airways_Center-4.jpg
 *  s2005 "AmericaWestArenasouthsidedec2005.jpg", combusean, CC BY 2.0,
 *        Dec 2005, the south face
 *        https://commons.wikimedia.org/wiki/File:AmericaWestArenasouthsidedec2005.jpg
 * Aerial: USGS NAIP (public domain) for the plan and roof colour.
 * No look-only sources. No commercial imagery.
 *
 * Night: the lobby and atrium curtain walls (`window-2`), their door
 * storeys and the bowl's band (`window`) glow; the banner screens and the
 * name sign are `neon-screen` and glow in their own purple; the east
 * atrium's glass roof is drawn as roof and stays dark.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant, type Swatch } from './palette'

const ID = 'phx-footprint-center'
type XY = [number, number]
const SHIFT: XY = [-14.4, 22.5]

const block = new Part(), cream = new Part(), roof = new Part(), win = new Part(), glazing = new Part(), screen = new Part()

// ── Helpers (site coordinates in, anchor frame out) ─────────────────────
const P = (x: number, y: number, z: number): V3 => [x + SHIFT[0], y + SHIFT[1], z]
const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** Ear-clipping triangulation of a simple ccw ring. */
function earcut(ring: XY[]): [XY, XY, XY][] {
  const pts = [...ring], out: [XY, XY, XY][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (pts.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i + pts.length - 1) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length]
      if (cr(a, b, c) <= 1e-9) continue
      if (pts.some((p) => p !== a && p !== b && p !== c && inside(p, a, b, c))) continue
      out.push([a, b, c]); pts.splice(i, 1); cut = true; break
    }
    if (!cut) break
  }
  if (pts.length === 3) out.push([pts[0], pts[1], pts[2]])
  return out
}
/** Walls of a ring from z0 to z1. */
function walls(part: Part, ring: XY[], z0: number, z1: number, inward = false) {
  const r = inward ? [...ccw(ring)].reverse() : ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    part.quad(P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1))
  }
}
/** A flat top over a ring. */
function top(part: Part, ring: XY[], z: number) {
  for (const [a, b, c] of earcut(ccw(ring))) part.tri(P(a[0], a[1], z), P(b[0], b[1], z), P(c[0], c[1], z))
}
/** A flat panel on the face a→b (outward to the right), fractions s0..s1, heights z0..z1. */
function panel(part: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const n: XY = [(dy / L) * off, (-dx / L) * off]
  const p = (s: number): XY => [a[0] + dx * s + n[0], a[1] + dy * s + n[1]]
  const [p0, p1] = [p(s0), p(s1)]
  part.quad(P(p0[0], p0[1], z0), P(p1[0], p1[1], z0), P(p1[0], p1[1], z1), P(p0[0], p0[1], z1))
}
/** A box standing proud of the face a→b: fractions s0..s1, depth d, heights z0..z1. */
function slabOn(part: Part, a: XY, b: XY, s0: number, s1: number, d: number, z0: number, z1: number, o0 = 0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy)
  const n: XY = [dy / L, -dx / L]
  const p = (s: number, o: number): XY => [a[0] + dx * s + n[0] * o, a[1] + dy * s + n[1] * o]
  const r: XY[] = [p(s0, o0), p(s1, o0), p(s1, o0 + d), p(s0, o0 + d)]
  walls(part, r, z0, z1)
  top(part, r, z1)
}
/** An octagon: centre, half sizes, chamfer; ccw from the east face's south end. */
function oct(cx: number, cy: number, hx: number, hy: number, ch: number): XY[] {
  return [
    [cx + hx, cy - hy + ch], [cx + hx, cy + hy - ch], [cx + hx - ch, cy + hy], [cx - hx + ch, cy + hy],
    [cx - hx, cy + hy - ch], [cx - hx, cy - hy + ch], [cx - hx + ch, cy - hy], [cx + hx - ch, cy - hy],
  ]
}
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])

// ── The bowl ────────────────────────────────────────────────────────────
const CX = 15.3, CY = -34, HX = 51.8, HY = 62, CH = 24
const LOW = 16.8, BAND = 20.3, EAVE = 27, PARAPET = 28, CROWN = 35.8
const bowl = oct(CX, CY, HX, HY, CH)
walls(block, bowl, 0, LOW)
walls(cream, bowl, LOW, PARAPET)
// the dark recessed band all round, then a cream sill line over it
for (const [a, b] of edges(bowl)) panel(win, a, b, 0.02, 0.98, LOW + 0.2, BAND, 0.06)
// the parapet's inner face and the gutter at the eaves
const inner = oct(CX, CY, HX - 1, HY - 1, CH - 0.4)
walls(cream, inner, EAVE, PARAPET, true)
for (let i = 0; i < 8; i++) {
  const j = (i + 1) % 8
  cream.quad(P(bowl[i][0], bowl[i][1], PARAPET), P(bowl[j][0], bowl[j][1], PARAPET), P(inner[j][0], inner[j][1], PARAPET), P(inner[i][0], inner[i][1], PARAPET))
}
// The hipped roof: from the inner parapet ring at the eaves up to the
// flat top x -5..35, y -65..-5 (site).
{
  const flat: XY[] = [[35, -65], [35, -5], [35, -5], [-5, -5], [-5, -5], [-5, -65], [-5, -65], [35, -65]]
  const ri = inner
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    const b0 = P(ri[i][0], ri[i][1], EAVE), b1 = P(ri[j][0], ri[j][1], EAVE)
    const t0 = P(flat[i][0], flat[i][1], CROWN), t1 = P(flat[j][0], flat[j][1], CROWN)
    if (flat[i][0] === flat[j][0] && flat[i][1] === flat[j][1]) roof.tri(b0, b1, t1)
    else roof.quad(b0, b1, t1, t0)
  }
  roof.quad(P(-5, -65, CROWN), P(35, -65, CROWN), P(35, -5, CROWN), P(-5, -5, CROWN))
}

// The south face (s2005): a cream centre bay standing proud, an arched
// window high up, a tall grid window and the doors below.
{
  const a = bowl[6], b = bowl[7] // the south face runs west → east... reversed for outward south
  const [s0, s1] = [0.5 - 7 / (b[0] - a[0]), 0.5 + 7 / (b[0] - a[0])]
  // ccw ring: the south face's edge goes from bowl[6] (west) to bowl[7] (east), outward is south
  slabOn(cream, a, b, s0, s1, 1.2, 0, LOW + 0.6)
  const fa: XY = [a[0], a[1] - 1.2], fb: XY = [b[0], b[1] - 1.2]
  const w = b[0] - a[0], mid = (a[0] + b[0]) / 2
  // the grid window (two storeys) and the doors
  panel(win, fa, fb, (mid - 3.2 - a[0]) / w, (mid + 3.2 - a[0]) / w, 5.2, 11.2)
  panel(win, fa, fb, (mid - 3.6 - a[0]) / w, (mid + 3.6 - a[0]) / w, 0.3, 3.8)
  // the arched window: a semicircle of radius 3.2 on short jambs
  const y = a[1] - 1.2 - 0.06, zc = 13.2, R = 3.2
  win.quad(P(mid - R, y, 12), P(mid + R, y, 12), P(mid + R, y, zc), P(mid - R, y, zc))
  for (let k = 0; k < 10; k++) {
    const t0 = Math.PI * (k / 10), t1 = Math.PI * ((k + 1) / 10)
    win.tri(P(mid, y, zc), P(mid + R * Math.cos(t0), y, zc + R * Math.sin(t0)), P(mid + R * Math.cos(t1), y, zc + R * Math.sin(t1)))
  }
}
// The chamfer faces' slit windows on the lower body (s2005, u4): two
// broad panels each.
for (const k of [5, 7]) {
  const [a, b] = edges(bowl)[k]
  panel(win, a, b, 0.18, 0.46, 9, 12.5)
  panel(win, a, b, 0.54, 0.82, 9, 12.5)
}

// ── The lobbies (17 m) ──────────────────────────────────────────────────
const LOBBY = 17
// The round plaza: a circle, centre (-59, 62), radius 30; the curved glass
// lobby runs round it from the north lobby (-23°) to the west wing (-141°).
const arc: XY[] = []
for (let k = 0; k <= 10; k++) {
  const t = ((-23 - (118 * k) / 10) * Math.PI) / 180
  arc.push([-59 + 30 * Math.cos(t), 62 + 30 * Math.sin(t)])
}
const north: XY[] = [
  [66, 4], [67.7, 22.6], [46.2, 30.9], [48.5, 37.7], [-24.2, 66.1], [-26.8, 59.8],
  ...arc,
  [-85.5, 41.6], [-85.6, 35.5], [-94.5, 35.5], [-94.6, 18.8], [-91.1, 15.3], [-43.6, 15.5], [-43.6, 11.8], [-39.8, 11.9], [-39.7, -0.2],
  [-30, -4], [20, -6],
]
walls(block, north, 0, LOBBY)
top(roof, north, LOBBY)
// a cream coping band round its top
for (const [a, b] of edges(ccw(north))) panel(cream, a, b, 0, 1, LOBBY - 1.4, LOBBY, 0.12)

/**
 * A glass curtain wall on the face a→b (fc22, u4): the ground storey's
 * doors in dark `window` under a pale soffit band, then light reflective
 * glass (`window-2`) up to the coping, ruled by thin pale mullions every
 * `bay` metres and two transoms.
 */
const GROUND = 4.4, SOFFIT = 5.3, GTOP = LOBBY - 1.4
function curtain(a: XY, b: XY, s0: number, s1: number, bay: number, ends = true) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), w = (s1 - s0) * L
  panel(win, a, b, s0, s1, 0.3, GROUND)
  panel(cream, a, b, s0, s1, GROUND, SOFFIT, 0.1)
  panel(glazing, a, b, s0, s1, SOFFIT, GTOP)
  const n = Math.max(1, Math.round(w / bay)), m = 0.28 / L
  for (let i = ends ? 0 : 1; i <= (ends ? n : n - 1); i++) {
    const s = s0 + ((s1 - s0) * i) / n
    panel(cream, a, b, Math.max(s0, s - m / 2), Math.min(s1, s + m / 2), SOFFIT, GTOP, 0.11)
  }
  for (const z of [9, 12.8]) panel(cream, a, b, s0, s1, z, z + 0.24, 0.1)
}
// The curved lobby (fc22): the curtain wall round the plaza, a banner
// screen over each end bay, and the name sign standing on the coping.
for (let k = 0; k < arc.length - 1; k++) {
  // the ring runs east → west along the arc; outward (into the plaza) is to the right
  const a = arc[k], b = arc[k + 1]
  if (k === 0 || k === arc.length - 2) slabOn(screen, a, b, 0.02, 0.98, 0.5, 2.5, LOBBY - 1)
  else curtain(a, b, 0, 1, 2.9, k === 1)
}
// The sign (fc22): a dark row of big letters on the coping over the middle
// of the arc, read as one block per letter. The arena was renamed in 2025
// and the letters change with sponsors, so they are plain blocks: 16 of
// them (the logo plus FOOTPRINT CENTER), with a word gap.
{
  const c: XY = [-59, 62], R = 30, t0 = -35, t1 = -129, H = 3.8
  const glyphs = [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1]
  const total = glyphs.reduce((s, g) => s + g, 0)
  let u = 0
  for (const g of glyphs) {
    if (g === 0.5) { u += g; continue }
    const ta = t0 + ((t1 - t0) * (u + 0.1)) / total, tb = t0 + ((t1 - t0) * (u + g - 0.1)) / total
    u += g
    const at = (t: number): XY => [c[0] + R * Math.cos((t * Math.PI) / 180), c[1] + R * Math.sin((t * Math.PI) / 180)]
    // outward (into the plaza) is to the right of a → b running clockwise
    slabOn(screen, at(ta), at(tb), 0, 1, 0.7, LOBBY, LOBBY + H, -0.7)
  }
}
// The north lobby along Jefferson (u4): the same curtain wall, and in
// front of it the white truss canopy on its masts.
{
  const a: XY = [48.5, 37.7], b: XY = [-24.2, 66.1]
  curtain(a, b, 0.02, 0.98, 3.1)
  for (const s of [0.08, 0.36, 0.64, 0.92]) slabOn(cream, a, b, s - 0.006, s + 0.006, 0.9, 0, LOBBY + 2.5, 4.2)
  // the canopy: a thin deck with a deeper truss edge on its outer side
  slabOn(cream, a, b, 0.03, 0.97, 5.6, 12.4, 12.9, 0.12)
  slabOn(cream, a, b, 0.03, 0.97, 0.5, 11.6, 12.9, 5.2)
}
// The north-east corner block (u4): a banner screen on its north face.
slabOn(screen, [67.7, 22.6], [46.2, 30.9], 0.15, 0.85, 0.5, 4, LOBBY - 2)
// The west wing's doors on 1st Street, and its north face.
panel(win, [-94.6, 18.8], [-94.5, 35.5], 0.1, 0.9, 0.3, 4.5)
panel(win, [-94.6, 18.8], [-94.5, 35.5], 0.1, 0.9, 7, 14)

// ── The east atrium on 3rd Street (u4, NAIP) ────────────────────────────
{
  const W = 66, E = 87.4, S = -82, N = 14.6, HW = 19.6, HE = 17
  const h = (x: number) => HW + ((HE - HW) * (x - 72)) / (E - 72)
  // block end walls and a block spine on the bowl side
  const ring: XY[] = [[W, S], [E, S], [E, N], [W, N]]
  // east face: glass curtain wall, full height
  glazing.quad(P(E, S, 0), P(E, N, 0), P(E, N, HE), P(E, S, HE))
  // the end walls: block, sloped tops
  block.quad(P(W, S, 0), P(E, S, 0), P(E, S, HE), P(W, S, HW))
  block.quad(P(E, N, 0), P(W, N, 0), P(W, N, HW), P(E, N, HE))
  // the glass roof sloping down to the street, from x 72; flat block roof
  // over the spine x 66–72
  roof.quad(P(72, S, HW), P(E, S, HE), P(E, N, HE), P(72, N, HW))
  roof.quad(P(W, S, HW), P(72, S, HW), P(72, N, HW), P(W, N, HW))
  // block frames at the ends of the glass and a band at the top
  for (const [y0, y1] of [[S, S + 5], [N - 5, N]]) {
    block.quad(P(E + 0.08, y0, 0), P(E + 0.08, y1, 0), P(E + 0.08, y1, HE), P(E + 0.08, y0, HE))
  }
  block.quad(P(E + 0.1, S, HE - 1.2), P(E + 0.1, N, HE - 1.2), P(E + 0.1, N, HE), P(E + 0.1, S, HE))
  // the end walls' glazing (u4: the north end is glass behind the banner)
  panel(screen, [E, N], [W, N], 0.1, 0.65, 3, HE - 2.5, 0.1)
  void ring
}

// ── The low south strip (6 m) and the corner fills (16.5 m) ─────────────
const south: XY[] = [[-21.2, -97], [-18.3, -97.1], [-18.2, -101.5], [10.8, -101.8], [10.7, -96.3], [21.4, -96.2], [21.7, -104.9], [50.5, -105.4], [50.8, -96.4], [40, -90], [-10, -90]]
walls(block, south, 0, 6)
top(roof, south, 6)
for (const fill of [
  [[-21.2, -97], [-12.5, -96], [-36.5, -72], [-36.7, -79.7]] as XY[],
  [[50.8, -96.4], [68.9, -80.1], [67.1, -72], [43.1, -96]] as XY[],
]) {
  walls(block, fill, 0, 16.5)
  top(roof, fill, 16.5)
}

// ── Write ───────────────────────────────────────────────────────────────
const parts: { part: Part; material: Swatch }[] = [
  { part: block, material: finish('fc-block', 0xd5cbba) },
  { part: cream, material: finish('fc-cream', 0xeee2c6) },
  { part: roof, material: finish('fc-roof', 0xcdd0d0) },
  { part: win, material: { ...PALETTE.window, color: 0x6c8597 } },
  { part: glazing, material: windowVariant(2, 0xa9c4d0) },
  { part: screen, material: finish('neon-screen', 0x4a4468) },
]
const used = parts.filter((p) => p.part.triangles > 0)
const triangles = used.reduce((s, p) => s + p.part.triangles, 0)
if (used.length > 6) throw new Error(`${ID}: ${used.length} materials`)
if (triangles > 5000) throw new Error(`${ID}: ${triangles} triangles`)
const glb = writeGlb('Mortgage Matchup Center', used, {
  license: 'CC0-1.0',
  frame: 'Y up, -Z north, +X east, metres; origin on the ground at the outline centroid (-112.0712148, 33.4459271); bearing 0',
})
if (glb.length > 250_000) throw new Error(`${ID}: ${glb.length} bytes`)
const out = new URL(`../models/${ID}.glb`, import.meta.url).pathname
await Bun.write(out, glb)
console.log(used.map((p) => `${p.material.name}: ${p.part.triangles}`).join(', '))
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
