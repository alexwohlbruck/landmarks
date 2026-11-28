/**
 * Kansas Speedway main grandstand, Kansas City, Kansas (2001) —
 * procedural, CC0-1.0. bun generators/kc-kansas-speedway.ts
 *
 * The frontstretch grandstand of the 1.5-mile tri-oval: one continuous
 * seating bank about 640 m long that follows the front straight's dogleg,
 * its lower bowl on an earth bank rising from the track wall to a cross
 * aisle at the level of the outside concourse, its upper bowl on a steel
 * frame rising to a top walkway 31.5 m over the track (29 over its foot), and the suites and
 * press box on the upper rows around the start/finish line, with a stair
 * tower at the south end. The track, apron, infield, fences and lights are
 * the map's or left out (STYLE.md: don't model the ground or a field).
 *
 * Frame: x east, y north, z up, metres; origin at the OSM grandstand's
 * centroid (-94.8339389, 39.1163872), bearing 0. The stand is swept along
 * its OSM front edge (way/42240743's track side), measured outward. z = 0 is
 * 302.0 m NAVD88, the first row's foot and the lowest map ground under the
 * footprint (Mapterhorn 301.99); the outside concourse is at 313.0 (11.0).
 * elevation 0.
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): way/42240743 (building=grandstand),
 *   the front edge from (-285, -278) to (-127, 340) in the speedway's frame,
 *   about 57 m deep; the speedway way/186964147 (leisure=stadium,
 *   capacity 48000, Q1723946).
 * - Lidar (measured; USGS 3DEP KS_Statewide_B16_2018, flown 2018), sampled
 *   every 5 m along the outward normal at 21 stations the whole length; the
 *   section is the same everywhere: the track wall's top 301.9 at -5 m,
 *   the first row 303.4 at 0, the lower bowl rising to the cross aisle
 *   313.0 at 25 m (the bare-earth model keeps it: an earth bank), the upper
 *   bowl from 316.0 at 30 m to 331.0 at 60 m (no ground returns: a frame),
 *   then the concourse at 313. The suites and press box: 344.6-345.6 over
 *   offsets 45-60 from (-305, 51) to (-254, 181), with roof plant to 350.9;
 *   a stair tower to 348.8 at (-295, -214).
 * - Map terrain: Mapterhorn z15 (tools/terrain.ts grid): the earth bank under
 *   the lower bowl from the track (0) to the concourse (16 over the track).
 *
 * Photos (evidence, Wikimedia Commons)
 * - Balaji, "The Kansas Speedway.jpg", CC BY-SA 2.0 (from the upper rows:
 *   green lower rows, a yellow band, blue upper rows; the suites' glass):
 *   https://commons.wikimedia.org/wiki/File:The_Kansas_Speedway.jpg
 * - Wikipedialuva, "Kansas Speedway stands and track (August 2025).jpg",
 *   CC BY 4.0 (from the infield: the whole stand, teal-green lower and navy
 *   upper seats, the suites and press box at the top in the middle, the
 *   blue stair tower at the south end):
 *   https://commons.wikimedia.org/wiki/File:Kansas_Speedway_stands_and_track_(August_2025).jpg
 * - Lectrician2, "Kansas Speedway Aerial.jpg", CC BY-SA 4.0 (drone, from the
 *   backstretch: the stand along the frontstretch only, the press box):
 *   https://commons.wikimedia.org/wiki/File:Kansas_Speedway_Aerial.jpg
 * - elisfkc, "Kansas Speedway (44619764251).jpg", CC BY-SA 2.0 (from the
 *   air: the stand's plan along the dogleg):
 *   https://commons.wikimedia.org/wiki/File:Kansas_Speedway_(44619764251).jpg
 *
 * Numbers
 * - Measured (lidar): the whole section above, the suites' extent and top,
 *   the stair tower's top.
 * - Estimated (photos): the seat colours' split (lower bowl green, upper
 *   bowl blue); the suites' two glazed bands; the stair tower 9 x 9 m.
 * - Colours: seat colours from the daylight photos, pulled lighter; pale
 *   concrete; dark glass in the suites, which glow at night.
 *
 * Doubts
 * - The yellow "KANSAS SPEEDWAY" lettered in the upper seats is not drawn.
 * - Light poles along the top, the catch fence and the concourse
 *   buildings behind the stand are left out.
 * - The suites' end shapes and rooftop plant are simplified.
 * - The lidar (2018) shows the same seating section over the whole OSM
 *   outline; the 2019 drone aerial seems to show the south part of the
 *   frontstretch without stands. Kept to the lidar and OSM; if seats were
 *   removed since, the south end should be cut back.
 * - The ends of the lower bowl are lifted 0.8 m over their last 14 m, where
 *   the earth bank rises (lidar), so no seat sits under the map's ground.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { countParts } from './sf-golden-gate-bridge'
import { finish, PALETTE } from './palette'

// The OSM front edge, moved to the grandstand's centroid.
const CX = -287.99, CY = 63.58
const FRONT: [number, number][] = ([[-284.8, -278.2], [-311.2, -117.2], [-315.7, -38.1], [-305.0, 51.4], [-282.0, 126.7],
  [-240.2, 207.5], [-192.0, 269.7], [-162.9, 300.3], [-126.6, 339.8]] as [number, number][]).map(([x, y]) => [x - CX, y - CY])

/** The section, outward offset o against height z (lidar - 302.0). */
const SECTION: [number, number][] = [[0, 0], [0, 1.4], [25, 11.0], [28, 11.0], [28, 14.0], [60, 29.0], [62, 29.0], [62, 0]]
const LOWER = 1, UPPER = 4   // the SECTION edges that are seats

type Station = { p: [number, number]; n: [number, number]; s: number }
function resample(path: [number, number][], step: number): Station[] {
  const cum = [0]
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
  const L = cum[cum.length - 1], n = Math.ceil(L / step)
  const at = (s: number): [number, number] => {
    let i = 1
    while (i < path.length - 1 && cum[i] < s) i++
    const f = (s - cum[i - 1]) / (cum[i] - cum[i - 1])
    return [path[i - 1][0] + (path[i][0] - path[i - 1][0]) * f, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * f]
  }
  const ss = Array.from({ length: n + 1 }, (_, i) => (L * i) / n)
  // smooth the corners a little: average each point with its neighbours
  const raw = ss.map(at)
  const pts = raw.map((p, i) => i === 0 || i === raw.length - 1 ? p
    : [(raw[i - 1][0] + 2 * p[0] + raw[i + 1][0]) / 4, (raw[i - 1][1] + 2 * p[1] + raw[i + 1][1]) / 4] as [number, number])
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    // travel runs north along the west side of the track: outward is to the left (west)
    return { p, n: [-(b[1] - a[1]) / l, (b[0] - a[0]) / l], s: ss[i] }
  })
}

const ST = resample(FRONT, 12)
const at = (q: Station, o: number, z: number): V3 => [q.p[0] + q.n[0] * o, q.p[1] + q.n[1] * o, z]

const k = { concrete: new Part(), lower: new Part(), upper: new Part(), glass: new Part(), roof: new Part(), tower: new Part() }

/** A quad wound so its normal points along `out` (a rough outward direction). */
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, out: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.quad(a, b, c, d)
  else p.quad(a, d, c, b)
}

/** Sweep a closed section (traversed clockwise in o, z) along stations; `mat(j)` picks each edge's part. */
function sweep(st: Station[], secs: [number, number][] | ((q: Station) => [number, number][]), mat: (j: number) => Part | null, caps = true) {
  const secAt = (q: Station) => typeof secs === 'function' ? secs(q) : secs
  for (let i = 0; i + 1 < st.length; i++) {
    const [a, b] = [st[i], st[i + 1]]
    const [sa, sb] = [secAt(a), secAt(b)]
    const n2: [number, number] = [(a.n[0] + b.n[0]) / 2, (a.n[1] + b.n[1]) / 2]
    for (let j = 0; j < sa.length; j++) {
      const p = mat(j)
      if (!p) continue
      const [o0, z0] = sa[j], [o1, z1] = sa[(j + 1) % sa.length]
      const [, w0] = sb[j], [, w1] = sb[(j + 1) % sb.length]
      const out: V3 = [n2[0] * -(z1 - z0), n2[1] * -(z1 - z0), o1 - o0]
      quad(p, at(a, o0, z0), at(b, o0, w0), at(b, o1, w1), at(a, o1, z1), out)
    }
  }
  if (!caps) return
  for (const [q, dir] of [[st[0], -1], [st[st.length - 1], 1]] as [Station, number][]) {
    const t: V3 = [q.n[1] * dir, -q.n[0] * dir, 0]   // along the path, outward at this end
    const pts = secAt(q).map(([o, z]) => at(q, o, z))
    const last = pts[pts.length - 1]
    for (let i = 0; i + 2 < pts.length; i++) {
      const [a, b, c] = [last, pts[i], pts[i + 1]]
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
      const nn = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
      if (nn[0] * t[0] + nn[1] * t[1] >= 0) k.concrete.tri(a, b, c)
      else k.concrete.tri(a, c, b)
    }
  }
}

// ---- The stand -----------------------------------------------------------------------

// At its two ends the lower bowl's bank rises about 0.8 m (lidar: 302.4 / 306.6 / 308.6 at
// 0 / 5 / 10 m out, against 303.4 / 305.3 / 307.2 mid-stand): lift it there over the last 14 m.
const S_END = ST[ST.length - 1].s
const lift = (q: Station) => 0.8 * Math.max(0, 1 - Math.min(q.s, S_END - q.s) / 14)
const sectionAt = (q: Station): [number, number][] => SECTION.map(([o, z], i) => [o, i >= 1 && i <= 3 ? z + lift(q) : z])
sweep(ST, sectionAt, (j) => j === LOWER ? k.lower : j === UPPER ? k.upper : j === SECTION.length - 1 ? null : k.concrete)

// ---- Suites and press box ------------------------------------------------------------

const SUITES = ST.filter((q) => q.p[1] + CY >= 51 && q.p[1] + CY <= 181)
const seatZ = (o: number) => 14.0 + ((o - 28) * 15) / 32
const SUITE: [number, number][] = [[43, seatZ(43)], [43, 43.0], [62.5, 43.0], [62.5, 29.0]]
sweep(SUITES, SUITE, (j) => j === 1 ? k.roof : j === 3 ? null : k.concrete)
// the glazed bands on its face, just proud of it
for (const [z0, z1] of [[23.5, 30.5], [32.5, 40.5]]) sweep(SUITES, [[42.9, z0], [42.9, z1], [42.95, z1], [42.95, z0]], (j) => j === 0 ? k.glass : null, false)

// ---- Stair tower at the south end ----------------------------------------------------

{
  const q = ST.reduce((best, s) => Math.abs(s.p[1] + CY + 214) < Math.abs(best.p[1] + CY + 214) ? s : best)
  const t: [number, number] = [q.n[1], -q.n[0]]
  const P = (o: number, u: number, z: number): V3 => [q.p[0] + q.n[0] * o + t[0] * u, q.p[1] + q.n[1] * o + t[1] * u, z]
  const box: [number, number][] = [[50, -4.5], [59, -4.5], [59, 4.5], [50, 4.5]]
  const H = 46.8
  for (let i = 0; i < 4; i++) {
    const [a, b] = [box[i], box[(i + 1) % 4]]
    const mo = (a[0] + b[0]) / 2 - 54.5, mu = (a[1] + b[1]) / 2
    const out: V3 = [q.n[0] * mo + t[0] * mu, q.n[1] * mo + t[1] * mu, 0]
    quad(k.tower, P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], H), P(a[0], a[1], H), out)
  }
  quad(k.concrete, P(50, -4.5, H), P(59, -4.5, H), P(59, 4.5, H), P(50, 4.5, H), [0, 0, 1])
}

// ---- Write ---------------------------------------------------------------------------

const list = [
  { part: k.concrete, material: finish('concrete', 0xd9d6cf) },
  { part: k.lower, material: finish('seats-green', 0x6f9f86) },
  { part: k.upper, material: finish('seats-blue', 0x5f78a8) },
  { part: k.glass, material: { ...PALETTE.window } },
  { part: k.roof, material: PALETTE.roof },
  { part: k.tower, material: finish('tower-blue', 0x6688b8) },
]
const tris = countParts(list)
const glb = writeGlb('Kansas Speedway grandstand', list, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the grandstand centroid, at the track wall foot',
  bearing: 0, elevation: 0,
})
console.log(`kc-kansas-speedway.glb: ${tris} triangles, ${glb.length} bytes; ` + list.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
if (tris > 5000 || glb.length > 250 * 1024) throw new Error('over budget')
await Bun.write(new URL('../models/kc-kansas-speedway.glb', import.meta.url), glb)
