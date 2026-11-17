/**
 * 1540 Broadway signs, Times Square, Manhattan: the sign wall on the base of
 * the former Bertelsmann Building (east side of Broadway, 45th to 46th
 * Street; Disney Store and the former Forever 21 below). Signage only; the
 * building stays the map's OSM extrusion. Procedural, CC0-1.0.
 *   bun generators/nyc-1540-broadway-signs.ts
 *
 * What it draws:
 * - the lower sign band over the two-storey shopfronts, 9.6-19.6 m, the
 *   whole Broadway front and round the 45th Street corner (q1, q6, q3): an
 *   amber block on the north part (the orange Disney screen of q6, the
 *   Dutton Ranch board of q1) and a white block wrapping the corner (the
 *   "21" screen of q6, the grey days boards of q1);
 * - "1540 BROADWAY" in tall individual letters standing on the band's top
 *   rail (q6, q3, d33, q1): the one long-standing named sign here, so it
 *   carries lettering (STYLE.md "Famous signs"). The letters are a bold
 *   grotesque, traced from q6 (2015): a narrow oval 0, round O, flat-
 *   topped 4 and 5, straight-legged R, pointed A and W. Their faces are
 *   colour-changing LEDs (white in q6, pink in q3, blue in d33); drawn white;
 * - the upper tier on the podium roof: a teal screen behind the letters'
 *   north end (q6, q3) and the corner screen at 45th Street (LG's, blue in
 *   q1, its dark side to 45th Street).
 * Screens are bold colour blocks, no ad imagery or ad lettering.
 *
 * Night: screens and letters are `neon-*` in their dominant colours; the
 * cabinets, rail, piers and legs are one dark `sign-frame`. Night photos:
 * q3, q6, d33.
 *
 * Frame: x east', y north', z up (mesh.ts), turned by bearing 28.36 so +y
 * runs north along the Broadway front of OSM way/137716320 (Bertelsmann
 * Building, no height; its podium part way/259064345 is 20 m, the tower
 * parts way/259064343/44/46/51 155-188 m, way/259064349 the 223 m crown).
 * The origin is the middle of that front on the ground: the front is x = 0
 * from y = -27.19 (45th St corner) to y = 27.19 (46th St), and 45th Street
 * runs from (0, -27.19) to (56.47, -26.94). Every cabinet below the
 * podium's 20 m has its back plane 0.3 m outside the outline (checked
 * below; the build fails under 0.2 m). The letters rise above 20 m on the
 * band's rail, and the upper screens stand on the podium roof on legs, as
 * the real ones do.
 *
 * Measured (USGS 3DEP lidar, NYC 2017 flight, 1 m grid, read in this frame
 * with tools/lidar_frame.py): podium roof 19.3-19.6 m; the upper north
 * screen's top 35.4 m along x 2-6 from y -2 to 18; the corner screen's top
 * 37.6 m along x 4-6 from y -10 to -24 and back along y -22/-24 to x 10.
 * Lidar puts the podium's edge about 2 m west of and south of OSM's lines;
 * the model keeps to OSM.
 * Estimated from photos: the band's bottom at 9.6 m (two shopfront storeys,
 * people ~1.7 m), the 45th Street return's 28 m, the letters' 2.4 m cap
 * height and spacing (13 slots over the front, q6), the upper screens'
 * 21 m bottoms. Cabinet depths are invented to read as LED cabinets.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - q1 "1540 Broadway (55284019625).jpg", Ajay Suresh, CC BY 4.0, 18 May
 *   2026: https://commons.wikimedia.org/wiki/File:1540_Broadway_(55284019625).jpg
 * - q6 "Times Square - New York, NY, USA - August 2015 05.jpg", Giorgio
 *   Galeotti, CC BY 4.0 (night; the letter trace):
 *   https://commons.wikimedia.org/wiki/File:Times_Square_-_New_York,_NY,_USA_-_August_2015_05.jpg
 * - q3 "1540 Broadway (15747989925).jpg", Phil Dolby, CC BY 2.0, 2014
 *   (night): https://commons.wikimedia.org/wiki/File:1540_Broadway_(15747989925).jpg
 * - d33 "Times Sq Dec 2021 33.jpg", Epicgenius, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Dec_2021_33.jpg
 * - q9 "Times Sq Apr 2017 15.jpg", Epicgenius, CC BY-SA 4.0:
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Apr_2017_15.jpg
 * - q4 "Disney Store Times Square NYC.jpg", Nielsoncaetanosalmeron, CC BY
 *   4.0, May 2026 (night, the shopfront):
 *   https://commons.wikimedia.org/wiki/File:Disney_Store_Times_Square_NYC.jpg
 *
 * Doubts:
 * - The band's split into screens changes with the tenants (q6 2015 vs q1
 *   2026); the two colour blocks are a simplification of both.
 * - The 45th Street return's length and the corner screen's side are seen
 *   only obliquely (q1).
 * - The letters' colour changes; white is one of several.
 * - The upper north screen's exact width is lidar's 20 m line; no photo
 *   shows it square on.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes } from './lettering'

type P2 = [number, number]

const frame = new Part(), letters = new Part(), amber = new Part(), white = new Part(), blue = new Part(), teal = new Part()

const HOST_H = 20 // OSM height of the podium part way/259064345
/** The host outline in this frame (way/137716320). */
const HOST: P2[] = [[-0.01, 27.19], [0, -27.19], [56.47, -26.94], [56.29, -18.75], [56.29, -17.7], [56.32, -12.74], [56.41, 2.72], [67.37, 2.75], [67.41, 26.55], [67.34, 33.37], [63.02, 33.35], [31.54, 33.25], [31.54, 27.32]]

// ------------------------------------------------------------ helpers
const norm2 = (v: P2): P2 => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A quad wound so its face points along `want`. */
function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

type Face = { z0: number; z1: number; part: Part }
/**
 * A cabinet between a back path and a front path (same point count, same
 * direction) from z0 to z1. The front face carries `faces` (screens) and is
 * `body` elsewhere; back, top, bottom and ends are `body`.
 */
function cabinet(back: P2[], front: P2[], z0: number, z1: number, faces: Face[], body = frame) {
  const n = back.length
  const cuts = [...new Set([z0, z1, ...faces.flatMap((f) => [f.z0, f.z1])])].sort((a, b) => a - b)
  for (let i = 0; i < n - 1; i++) {
    const out: V3 = [front[i][0] + front[i + 1][0] - back[i][0] - back[i + 1][0], front[i][1] + front[i + 1][1] - back[i][1] - back[i + 1][1], 0]
    for (let k = 0; k < cuts.length - 1; k++) {
      const a = cuts[k], b = cuts[k + 1]
      const part = faces.find((f) => f.z0 <= a + 1e-6 && f.z1 >= b - 1e-6)?.part ?? body
      quadOut(part, [front[i][0], front[i][1], a], [front[i + 1][0], front[i + 1][1], a], [front[i + 1][0], front[i + 1][1], b], [front[i][0], front[i][1], b], out)
    }
    const inn: V3 = [-out[0], -out[1], 0]
    quadOut(body, [back[i][0], back[i][1], z0], [back[i + 1][0], back[i + 1][1], z0], [back[i + 1][0], back[i + 1][1], z1], [back[i][0], back[i][1], z1], inn)
    quadOut(body, [back[i][0], back[i][1], z1], [back[i + 1][0], back[i + 1][1], z1], [front[i + 1][0], front[i + 1][1], z1], [front[i][0], front[i][1], z1], [0, 0, 1])
    quadOut(body, [back[i][0], back[i][1], z0], [back[i + 1][0], back[i + 1][1], z0], [front[i + 1][0], front[i + 1][1], z0], [front[i][0], front[i][1], z0], [0, 0, -1])
  }
  for (const [i, j] of [[0, 1], [n - 1, n - 2]]) {
    const d = norm2([back[i][0] - back[j][0], back[i][1] - back[j][1]])
    quadOut(body, [back[i][0], back[i][1], z0], [front[i][0], front[i][1], z0], [front[i][0], front[i][1], z1], [back[i][0], back[i][1], z1], [d[0], d[1], 0])
  }
}

/** A plain box. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  cabinet([[x0, y0], [x0, y1]], [[x1, y0], [x1, y1]], z0, z1, [], p)
}

/**
 * The outline polyline `pts` (walked with the building on its right)
 * offset `d` outward, each joint rounded with radius `r` in `k` steps.
 * Paths with the same pts and k have matching points.
 */
function offsetPath(pts: P2[], d: number, r: number, k = 3): P2[] {
  const dirs = pts.slice(1).map((p, i) => norm2([p[0] - pts[i][0], p[1] - pts[i][1]]))
  const nrm = dirs.map(([x, y]): P2 => [-y, x]) // left = outside
  const line = (i: number, p: P2): P2 => [p[0] + nrm[i][0] * d, p[1] + nrm[i][1] * d]
  const out: P2[] = [line(0, pts[0])]
  for (let j = 1; j < pts.length - 1; j++) {
    const a = dirs[j - 1], b = dirs[j]
    const phi = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])))
    const m: P2 = [pts[j][0] + (nrm[j - 1][0] + nrm[j][0]) / (1 + Math.cos(phi)) * d, pts[j][1] + (nrm[j - 1][1] + nrm[j][1]) / (1 + Math.cos(phi)) * d]
    const t = r * Math.tan(phi / 2)
    const t1: P2 = [m[0] - a[0] * t, m[1] - a[1] * t]
    const c: P2 = [t1[0] - nrm[j - 1][0] * r, t1[1] - nrm[j - 1][1] * r]
    const s0 = Math.atan2(t1[1] - c[1], t1[0] - c[0])
    for (let i = 0; i <= k; i++) {
      const s = s0 - (phi * i) / k // a right turn runs clockwise
      out.push([c[0] + r * Math.cos(s), c[1] + r * Math.sin(s)])
    }
  }
  out.push(line(pts.length - 2, pts[pts.length - 1]))
  return out
}

// ------------------------------------------------------------ the lower band
const BACK = 0.3, DEPTH = 1.0
const Z0 = 9.6, Z1 = 19.6
const C45: P2 = [0, -27.19]
const at45 = (x: number): P2 => [x, -27.19 + (0.25 / 56.47) * x] // a point on the 45th St line
const screen = (part: Part): Face[] => [{ z0: Z0 + 0.3, z1: Z1 - 0.3, part }]
{
  // white block: from 28 m along 45th St, round the corner, up Broadway to y = -1.6
  const pts: P2[] = [at45(28), C45, [0, -1.6]]
  cabinet(offsetPath(pts, BACK, 0.1), offsetPath(pts, BACK + DEPTH, 0.6), Z0, Z1, screen(white))
  // amber block: two screens on the north part with a recessed seam
  const bw = (y0: number, y1: number, d: number, faces: Face[]) => cabinet([[-BACK, y0], [-BACK, y1]], [[-BACK - d, y0], [-BACK - d, y1]], Z0, Z1, faces)
  bw(-1.6, -1.2, 0.7, [])
  bw(-1.2, 12.2, DEPTH, screen(amber))
  bw(12.2, 12.6, 0.7, [])
  bw(12.6, 27.0, DEPTH, screen(amber))
  // fascia under it and the top rail the letters and floodlights stand on
  const all: P2[] = [at45(28), C45, [0, 27.0]]
  cabinet(offsetPath(all, BACK, 0.1), offsetPath(all, BACK + 0.6, 0.3), Z0 - 0.6, Z0, [])
  cabinet(offsetPath(all, BACK, 0.1), offsetPath(all, BACK + 1.7, 0.8), Z1, Z1 + 0.3, [])
  // the dark clad piers that carry it down to the pavement (q1): the
  // corner, the north end and the 45th Street end
  const pier = (p: P2[]) => cabinet(offsetPath(p, BACK, 0.1), offsetPath(p, BACK + 0.7, 0.3), 0, Z0 - 0.6, [])
  pier([at45(1.2), C45, [0, -26.0]])
  pier([[0, 25.8], [0, 27.0]])
  pier([at45(28), at45(26.8)])
}

// ------------------------------------------------------------ 1540 BROADWAY
// Letter units: cap height 1, centre-lines 0.1-0.9 (stroke 0.2), u right.
const glyph: Record<string, [number, (p: Pen) => void]> = {
  '1': [0.62, (p) => p.moveTo([0.16, 0.7]).lineTo([0.44, 0.9]).lineTo([0.44, 0.1])],
  '5': [0.78, (p) => p.moveTo([0.68, 0.9]).lineTo([0.16, 0.9]).lineTo([0.13, 0.55])
    .cubicTo([0.3, 0.64], [0.7, 0.66], [0.7, 0.34], 6).cubicTo([0.7, 0.02], [0.24, 0.02], [0.1, 0.2], 6)],
  '4': [0.82, (p) => { p.moveTo([0.58, 0.1]).lineTo([0.58, 0.9]).lineTo([0.08, 0.32]).lineTo([0.76, 0.32]) }],
  '0': [0.76, (p) => p.circle([0.38, 0.5], 0.28, 0.4, 14)],
  'B': [0.82, (p) => {
    p.moveTo([0.12, 0.1]).lineTo([0.12, 0.9]).lineTo([0.44, 0.9]).cubicTo([0.68, 0.9], [0.68, 0.52], [0.44, 0.52], 5).lineTo([0.12, 0.52])
    p.moveTo([0.44, 0.52]).cubicTo([0.74, 0.52], [0.74, 0.1], [0.44, 0.1], 5).lineTo([0.12, 0.1])
  }],
  'R': [0.82, (p) => {
    p.moveTo([0.12, 0.1]).lineTo([0.12, 0.9]).lineTo([0.44, 0.9]).cubicTo([0.7, 0.9], [0.7, 0.5], [0.44, 0.5], 5).lineTo([0.12, 0.5])
    p.moveTo([0.42, 0.5]).lineTo([0.7, 0.1])
  }],
  'O': [0.96, (p) => p.circle([0.48, 0.5], 0.38, 0.4, 16)],
  'A': [0.88, (p) => { p.moveTo([0.08, 0.1]).lineTo([0.44, 0.9]).lineTo([0.8, 0.1]); p.moveTo([0.22, 0.36]).lineTo([0.66, 0.36]) }],
  'D': [0.86, (p) => p.moveTo([0.12, 0.9]).lineTo([0.38, 0.9]).cubicTo([0.82, 0.9], [0.82, 0.1], [0.38, 0.1], 7).lineTo([0.12, 0.1]).lineTo([0.12, 0.9])],
  'W': [1.2, (p) => p.moveTo([0.06, 0.9]).lineTo([0.32, 0.1]).lineTo([0.6, 0.78]).lineTo([0.88, 0.1]).lineTo([1.14, 0.9])],
  'Y': [0.86, (p) => { p.moveTo([0.08, 0.9]).lineTo([0.43, 0.48]).lineTo([0.78, 0.9]); p.moveTo([0.43, 0.48]).lineTo([0.43, 0.1]) }],
}
{
  const H = 2.4, ZL = Z1 + 0.3, XB = -0.7, TEXT = '1540 BROADWAY'
  const slots = TEXT.length - 0.5, y0 = 26.4, pitch = (2 * 26.4) / slots
  let s = 0
  for (const ch of TEXT) {
    if (ch === ' ') { s += 0.5; continue }
    const [w, draw] = glyph[ch]
    const pen = new Pen()
    draw(pen)
    const yc = y0 - (s + 0.5) * pitch
    // the reader faces east (+x), so their right is south (-y)
    strokes(letters, pen.paths, {
      width: 0.22, depth: 0.45, back: true,
      place: (u, v, wo) => [XB - wo, yc - (u - w / 2) * H, ZL + v * H],
    })
    s += 1
  }
}

// ------------------------------------------------------------ the upper tier
{
  // the teal screen behind the letters' north end, on the podium roof
  cabinet([[2.5, -2], [2.5, 18]], [[1.5, -2], [1.5, 18]], 21, 35.4, [{ z0: 21.3, z1: 35.1, part: teal }])
  for (const y of [-1, 5.5, 11.5, 17]) box(frame, 1.8, y - 0.3, HOST_H, 2.4, y + 0.3, 21)
  // the corner screen at 45th Street: blue to Broadway, a dark side to 45th
  cabinet([[4.5, -23.5], [4.5, -9]], [[3.5, -23.5], [3.5, -9]], 21, 37.6, [{ z0: 21.3, z1: 37.3, part: blue }])
  cabinet([[3.5, -23.5], [11, -23.5]], [[3.5, -24.5], [11, -24.5]], 21, 37.6, [])
  for (const y of [-23.2, -16, -9.6]) box(frame, 3.8, y - 0.3, HOST_H, 4.4, y + 0.3, 21)
  for (const x of [7, 10.4]) box(frame, x - 0.3, -24.2, HOST_H, x + 0.3, -23.6, 21)
}

// ------------------------------------------------------------ checks and output
const parts = [
  { part: frame, material: finish('sign-frame', 0x4a4f57) },
  { part: letters, material: finish('neon-1540-letters', 0xf2f0ea) },
  { part: amber, material: finish('neon-screen-amber', 0xf08a2c) },
  { part: white, material: finish('neon-screen-white', 0xe8eef4) },
  { part: blue, material: finish('neon-screen-blue', 0x3a6fe0) },
  { part: teal, material: finish('neon-screen-teal', 0x34b5c6) },
]

/** Distance from p to the host outline, negative inside it. */
function outlineDistance(p: P2): number {
  let inside = false, best = Infinity
  for (let i = 0, j = HOST.length - 1; i < HOST.length; j = i++) {
    const [ax, ay] = HOST[j], [bx, by] = HOST[i]
    if ((ay > p[1]) !== (by > p[1]) && p[0] < ((bx - ax) * (p[1] - ay)) / (by - ay) + ax) inside = !inside
    const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy)))
    best = Math.min(best, Math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy))
  }
  return inside ? -best : best
}
let nearest = Infinity
for (const { part } of parts)
  for (let i = 0; i < part.pos.length; i += 3) {
    const [x, h, yNeg] = [part.pos[i], part.pos[i + 1], part.pos[i + 2]]
    if (h < HOST_H - 1e-6) nearest = Math.min(nearest, outlineDistance([x, -yNeg]))
  }
if (nearest < 0.2 - 1e-6) throw new Error(`a sign under the host's height is ${nearest.toFixed(2)} m from its outline`)

const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('1540 Broadway signs', parts, {
  license: 'CC0-1.0', bearing: 28.36, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-1540-broadway-signs.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m; nearest sign under ${HOST_H} m is ${nearest.toFixed(2)} m outside the host outline`)
