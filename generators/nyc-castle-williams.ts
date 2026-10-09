/**
 * Castle Williams, Governors Island — procedural, CC0-1.0, no textures.
 * bun generators/nyc-castle-williams.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing -3.2° (the outline's fitted axis; the plan is round, so it only
 * sets which way the gorge's straight walls run). Anchor: area centroid of
 * the OSM multipolygon relation/3700068.
 *
 * Evidence
 * - OSM relation/3700068 (outline: a circle 61.6 m across, centre at
 *   (-0.95, 0.85) in the model frame, with its south-east quarter squared
 *   off by two straight walls meeting at (29.6, -26); height 14.9 m). No
 *   building parts.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), in the model frame
 *   (/tmp/city/nyc/work/nyc-castle-williams/bands.png). The ground round the
 *   fort lies at 2.2–2.9 m NAVD88 (y = 0 at 2.2 m). The ring's parapet rim
 *   15.0 m, its roof terrace 13.1 m, the court face at r ≈ 18 m; the court
 *   at ground level. The ring stands full height to two square cuts, y = -6.5
 *   on the east face and x = 9 on the south face; the gorge block between
 *   them, in the squared-off corner, stands 8.0 m. Two small round stair
 *   towers in the court reach ~11.7 m.
 * - NAIP orthophoto (USGS, public domain): the ring roof, the two round
 *   stair towers in the court, the gorge's flat roof.
 * - Published: 1807–1811, Jonathan Williams; red Newark sandstone, about
 *   200 ft (61 m) across, walls 7–8 ft thick at the top, three tiers of
 *   casemates for the guns, an open court; a prison 1912–1966 (Wikipedia;
 *   NPS).
 * - Photos, credits in /tmp/city/nyc/work/nyc-castle-williams/photos/credits.txt:
 *   from the harbour, west (Joe Mabel, CC BY-SA 3.0); the gorge and its
 *   end blocks from the south-east (NPS, public domain); the sally port
 *   (Axel Tschentscher, CC BY-SA 4.0); a 1980s HABS helicopter view from
 *   the north (public domain); others by ChrisRuvolo, King of Hearts and
 *   Beyond My Ken (CC BY-SA 4.0).
 *
 * Estimated: the gun ports' size (1.2 m) and count (27 to a tier round the
 * curve), the tiers' heights (centred 1.6, 5.4 and 9.3 m, from the harbour
 * photo scaled to the lidar's rim), the coping profile, the gorge's windows
 * and the sally port's place on its south wall, the corner bartizan. The
 * court and its paving are the map's, not modelled.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, circle } from './nyc-570-lexington'
import { archPanel, rectPanel, spread } from './nyc-city-hall'

const stone = new Part(), coping = new Part(), win = new Part(), roof = new Part(), door = new Part()

const C: XY = [-0.95, 0.85], R = 30.8, RI = 18.0
const WALL = 13.6, TOP = 15.0, TERRACE = 13.1, GORGE = 8.0
const deg = Math.PI / 180
const at = (r: number, a: number): XY => [C[0] + r * Math.cos(a * deg), C[1] + r * Math.sin(a * deg)]
const angleOf = (p: XY) => Math.atan2(p[1] - C[1], p[0] - C[0]) / deg
const arc = (r: number, a0: number, a1: number, n: number): XY[] => Array.from({ length: n + 1 }, (_, i) => at(r, a0 + ((a1 - a0) * i) / n))

// Plan (OSM + lidar). The circle's south-east quarter is squared off by the
// east face (x = 29) and the south face; the ring stands full height up to
// the cuts y = -6.5 and x = 9, and the low gorge block fills the corner.
const E_CUT: XY = [29.0, -6.5] // on the circle
const S_JOIN: XY = [4.0, -29.47] // where the south face leaves the circle (OSM)
const S_CUT: XY = [9.0, -28.2]
const CORNER: XY = [29.5, -26.0]
const innerAt = (x: number | null, y: number | null): XY => {
  if (x !== null) return [x, C[1] - Math.sqrt(RI * RI - (x - C[0]) ** 2)]
  return [C[0] + Math.sqrt(RI * RI - (y! - C[1]) ** 2), y!]
}
const IS = innerAt(9.0, null), IE = innerAt(null, -6.5)
const aE = angleOf(E_CUT), aS = angleOf(S_JOIN) + 360, aIS = angleOf(IS) + 360, aIE = angleOf(IE)

const outerPath: XY[] = [...arc(R, aE, aS, 40), [6.72, -28.91], S_CUT]
const innerPath: XY[] = arc(RI, aIS, aIE + 360 - 360, 36) // clockwise: from the south cut round to the east cut
const ring: XY[] = [...outerPath, IS, ...innerPath.slice(1, -1), IE]
prism({ wall: stone, win: null, roof, ring, z0: 0, z1: TERRACE, facade: null, bevel: 0.3 })

/** Sweep a profile (d outward from the wall line, z) along an open path; outward is to the right of travel. */
function sweep(p: Part, path: XY[], prof: [number, number][]) {
  const nrm = path.map((q, i) => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    return [dy / l, -dx / l] as XY
  })
  const pt = (i: number, d: number, z: number): V3 => [path[i][0] + nrm[i][0] * d, path[i][1] + nrm[i][1] * d, z]
  for (let i = 0; i < path.length - 1; i++)
    for (let k = 0; k < prof.length - 1; k++) {
      const [d0, z0] = prof[k], [d1, z1] = prof[k + 1]
      p.quad(pt(i, d0, z0), pt(i + 1, d0, z0), pt(i + 1, d1, z1), pt(i, d1, z1))
    }
  // Close both ends with a fan.
  for (const [i, s] of [[0, -1], [path.length - 1, 1]] as [number, number][]) {
    const pts = prof.map(([d, z]) => pt(i, d, z)), c = pt(i, prof[prof.length - 1][0], prof[0][1])
    for (let k = 0; k < pts.length - 1; k++) s > 0 ? p.tri(c, pts[k], pts[k + 1]) : p.tri(c, pts[k + 1], pts[k])
  }
}
// The outer parapet with its heavy rounded coping, then the court face's low parapet.
sweep(coping, outerPath, [[0, WALL - 0.4], [0.35, WALL], [0.45, WALL + 0.5], [0.25, TOP - 0.2], [-0.2, TOP], [-1.4, TOP], [-1.6, TOP - 0.3], [-1.6, TERRACE]])
sweep(coping, [IS, ...innerPath.slice(1, -1), IE], [[0, TERRACE], [0, TERRACE + 1.1], [-0.7, TERRACE + 1.1], [-0.7, TERRACE]])
// The cut ends get the same parapet across them.
sweep(coping, [S_CUT, IS], [[0.05, TERRACE], [0.05, TOP - 0.4], [-1.2, TOP - 0.4], [-1.2, TERRACE]])
sweep(coping, [IE, E_CUT], [[0.05, TERRACE], [0.05, TOP - 0.4], [-1.2, TOP - 0.4], [-1.2, TERRACE]])

// --- Three tiers of casemate openings round the curve ---
{
  const N = 27
  for (let i = 0; i < N; i++) {
    const a = aE + 3 + ((aS - aE - 6) * (i + 0.5)) / N
    const p = at(R, a - 0.6), q = at(R, a + 0.6)
    for (const zc of [1.6, 5.4, 9.3]) rectPanel(win, p, q, Math.hypot(q[0] - p[0], q[1] - p[1]) / 2, 1.2, zc - 0.6, zc + 0.6, 0.06)
  }
  // Windows on the court face, three storeys.
  for (let i = 0; i < 18; i++) {
    const a = aIS - 6 - ((aIS - aIE - 12) * (i + 0.5)) / 18
    const p = at(RI, a + 1.4), q = at(RI, a - 1.4) // the court face looks inward: run clockwise
    const L = Math.hypot(q[0] - p[0], q[1] - p[1])
    for (const [z0, z1] of [[1.2, 3.4], [5.0, 7.0], [8.8, 10.6]]) rectPanel(win, p, q, L / 2, 0.9, z0, z1, 0.06)
  }
  // The end blocks' cut faces towards the gorge: a column of windows each.
  for (const [a, b] of [[S_CUT, IS], [IE, E_CUT]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const s of [L * 0.3, L * 0.7]) rectPanel(win, a, b, s, 1.2, 9.3 - 0.6, 9.3 + 0.6, 0.06)
  }
}

// --- The gorge: the lower block closing the corner with two straight walls ---
{
  const gin = arc(RI, aIE, aIS - 360, 8) // the court face, clockwise from the east cut to the south cut
  const g: XY[] = [S_CUT, CORNER, E_CUT, ...gin]
  prism({ wall: stone, win: null, roof, ring: g, z0: 0, z1: GORGE, facade: null, bevel: 0.3 })
  sweep(coping, [S_CUT, CORNER, E_CUT], [[0, GORGE - 0.5], [0.15, GORGE - 0.5], [0.15, GORGE + 0.3], [-0.6, GORGE + 0.3], [-0.6, GORGE]])
  // South wall: the sally port under its arch; small square windows in two storeys.
  const L1 = Math.hypot(CORNER[0] - S_CUT[0], CORNER[1] - S_CUT[1])
  archPanel(door, S_CUT, CORNER, L1 * 0.55, 2.4, 0, 3.7, 0.06, 8)
  for (const s of [2.5, 6.0, L1 - 6, L1 - 2.5]) rectPanel(win, S_CUT, CORNER, s, 1.2, 1.4, 3.0, 0.06)
  for (const s of [2.5, 6.0, 9.5, L1 - 9.5 + 2, L1 - 6, L1 - 2.5]) rectPanel(win, S_CUT, CORNER, s, 1.1, 5.0, 6.4, 0.06)
  // East wall.
  const L2 = Math.hypot(E_CUT[0] - CORNER[0], E_CUT[1] - CORNER[1])
  for (const s of spread(1.5, L2 - 1.5, 5)) { rectPanel(win, CORNER, E_CUT, s, 1.2, 1.4, 3.0, 0.06); rectPanel(win, CORNER, E_CUT, s, 1.1, 5.0, 6.4, 0.06) }
  // The corbelled bartizan on the corner.
  const t = (r: number, z: number): V3[] => circle(CORNER[0], CORNER[1], r, 12).map(([x, y]) => [x, y, z] as V3)
  stone.loft([t(0.4, 4.6), t(1.4, 5.8), t(1.4, GORGE + 0.6)])
  coping.loft([t(1.4, GORGE + 0.6), t(1.55, GORGE + 0.9), t(1.2, GORGE + 1.1)])
  coping.cap(t(1.2, GORGE + 1.1), true)
}

// --- Two round stair towers standing in the court ---
for (const [x, y] of [[-7.0, -13.5], [13.0, 10.5]] as XY[]) {
  const t = (r: number, z: number): V3[] => circle(x, y, r, 12).map(([a, b]) => [a, b, z] as V3)
  stone.loft([t(1.8, 0), t(1.8, 11.2)])
  coping.loft([t(1.8, 11.2), t(1.95, 11.7)])
  roof.loft([t(1.95, 11.7), t(0.2, 12.6)])
}

finishModel('Castle Williams', 'nyc-castle-williams', [
  { part: stone, material: finish('castle-sandstone', 0xbf9184) },
  { part: coping, material: finish('castle-coping', 0xa59791) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
], { bearing: -3.2, osm: 'relation/3700068', height: 15 }, 5000)
