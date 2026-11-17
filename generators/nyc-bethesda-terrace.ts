/**
 * Bethesda Terrace, Central Park (Calvert Vaux and Jacob Wrey Mould,
 * 1859–64) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-bethesda-terrace.ts  (writes both models below)
 *
 * Frame: x across the terrace (≈ east-south-east), y along its axis toward
 * the Lake (bearing 16.7°), z up, metres. Anchor: on the terrace axis at the
 * foot of the Arcade's north face, -73.9710115, 40.7738660. z = 0 is the
 * lower plaza (the Esplanade) at the Arcade's foot; the upper terrace and
 * Terrace Drive are 5.9 m higher. The fountain, its pool and rim are
 * nyc-bethesda-fountain's; paving, the drive's roadway and the grass are
 * the map's. OSM maps the terrace only as pedestrian areas
 * (relation/3170084, way/426502658) and the Arcade as a tunnel footway
 * (way/234241518), with no building or man_made outline, so `replaces` is
 * empty.
 *
 * Two models, one per ground level, both at this anchor and bearing. The
 * map lifts a flat-based model by the terrain under it, read on a 7 x 7 grid
 * over its plan, so one model spanning the plaza and the Mall 5.9 m above it
 * had its upper level lifted twice and floated about 6 m:
 * - nyc-bethesda-terrace, the plaza level: the Arcade's north face, the two
 *   side stairs and the plaza's balustrades. The side stairs are drawn on
 *   their own ground (the terrain is the stair), the Arcade at its real
 *   height from the plaza.
 * - nyc-bethesda-terrace-mall, the Mall level: the grand stair's well and the
 *   balustrades along the drive. y = 0 is the well's foot at the plaza level;
 *   `elevation` -5.4 sets the drive on the map's ground (the 5.9 m depth less
 *   the map's 0.5 m base sink). The map's terrain doesn't show the well as a
 *   pit, so its lower flight is under the drawn ground there.
 *
 * What is modelled: the Arcade's north face with its seven arched openings
 * and balustrade, the gold Minton-tile ceiling seen through them, its three
 * south arches onto the grand central stair (at the foot of the open well,
 * y -33; the landing north of it is under the drive); the stair's well (two
 * flights and a landing) and its balustraded walls up to the Mall; the two
 * side stairs north of the drive (two flights each, a landing, solid
 * balustrades and newel posts); the upper balustrades along the drive; the
 * lower plaza's side balustrades with their triple-newel clusters. Left to
 * the map: the drive and the Arcade's deck, the hall under them (the map's
 * ground covers it), the Lake-end parapet (a low line 35 m out that read as
 * noise).
 *
 * Evidence
 * - OSM (ODbL): plan of the plaza (relation/3170084 outer way/234243771),
 *   the side stairs (way/44225604, 31 steps; way/44225620, 40 steps), the
 *   grand stair (way/234241520, 28 steps), the Arcade (way/234241518), the
 *   upper pedestrian area (way/426502658). Axis bearing 16.7° from the
 *   plaza's long edges; the plan is symmetric about x = 0 to 0.2 m.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 1 m grid. Measured (above the
 *   plaza at the Arcade's foot): upper terrace / drive 5.9 m; side-stair
 *   landing 2.95 m between y = -1 and 4.5, flights from y = -7 and to
 *   y = 12.2; Arcade balustrade top ~7.0 m, the pedestals at its ends ~9 m;
 *   grand stair well ~9 m wide, flights y = -33…-40 and -46…-52 either side
 *   of a landing at 2.7 m, its walls' tops ~7 m; posts of the plaza's cross
 *   balustrades at y ≈ 29, x ≈ ±14…±22. The lidar sits ~1 m east of OSM; the
 *   model follows OSM's axis (the fountain model's lidar anchor is 0.7 m
 *   west of it).
 * - Published (Wikipedia, "Bethesda Terrace and Fountain"; Central Park
 *   Conservancy): two levels joined by two grand staircases and a lesser
 *   one under Terrace Drive; mustard-olive New Brunswick sandstone with
 *   harder cappings and granite steps; the Arcade's ceiling of ~14,000
 *   Minton encaustic tiles (reinstalled 2007).
 * - Photos (Wikimedia Commons):
 *   Christian David, "Bethesda Terrace and 432 Park Avenue from the Lake"
 *     (CC BY-SA 4.0) https://commons.wikimedia.org/wiki/File:Bethesda_Terrace_and_432_Park_Avenue_from_the_Lake,_Central_Park,_Manhattan,_New_York.jpg
 *   Julian Lupyan, "Bethesda Terrace and Fountain, Central Park, 2025" (CC0)
 *     https://commons.wikimedia.org/wiki/File:Bethesda_Terrace_and_Fountain,_Central_Park,_2025.jpg
 *   Jim.henderson, "Bethesda Terrace from west" (public domain)
 *     https://commons.wikimedia.org/wiki/File:Bethesda_Terrace_from_west_jeh.jpg
 *   JJxFile, "Bethesda Terrace in the time of pandemic" (CC BY-SA 4.0, the
 *     Arcade's south arches and the grand stair)
 *     https://commons.wikimedia.org/wiki/File:Bethesda_Terrace_in_the_time_of_pandemic.jpg
 *   Jakub Hałun, "Bethesda Terrace Arcade … 20231002 1841 1887" (CC BY 4.0,
 *     the hall, its arches and ceiling)
 *     https://commons.wikimedia.org/wiki/File:Bethesda_Terrace_Arcade,_Central_Park,_New_York_City,_20231002_1841_1887.jpg
 *   Daniel Dimitrov, "Bethesda Terrace Central Park Manhattan NYC" (CC BY-SA 4.0)
 *     https://commons.wikimedia.org/wiki/File:Bethesda_Terrace_Central_Park_Manhattan_NYC.jpg
 *
 * Estimated from the photos scaled to the lidar: the arches (2.3 m wide,
 * springing 3.3 m, semicircular) and piers, the hall's ceiling at 4.9 m, the
 * stair widths, balustrade height (1.0 m) and post spacing, the newel and
 * pedestal sizes, the Lake parapet (0.8 m). The balustrades' pierced
 * openings and carvings are drawn as solid parapets, as at map distance.
 * Invented: nothing beyond simplification.
 *
 * Doubts: the cross balustrades at y = 29 rest on lidar posts and two photos
 * from the terrace; the terrain under the Arcade and stairs is the Mall's
 * level in the DEM, which the map fills down (see `terrain.ts check`).
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, chamferRect } from './nyc-570-lexington'

// Two models: the plaza level (the Arcade's face, the side stairs, the plaza's
// balustrades) and the Mall level (the grand stair's well, the drive's
// balustrades), each standing on its own ground. See the header.
const parts = () => ({ stone: new Part(), cap: new Part(), steps: new Part(), dark: new Part(), tiles: new Part() })
const PLAZA = parts(), MALL = parts()
let { stone, cap, steps, dark, tiles } = PLAZA
const use = (p: typeof PLAZA) => ({ stone, cap, steps, dark, tiles } = p)

const U = 5.9 // the upper terrace and drive above the plaza
const TAU = Math.PI * 2

/** A bevelled box. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, bevel = 0.12, top: Part | null = p) {
  prism({ wall: p, win: null, roof: top, coping: top ?? undefined, ring: chamferRect(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1), 0), z0, z1, facade: null, bevel })
}
/** A plain axis box with all six faces (no bevel), cheap. */
function cube(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, faces = { bottom: false }) {
  const a: V3 = [x0, y0, z0], b: V3 = [x1, y0, z0], c: V3 = [x1, y1, z0], d: V3 = [x0, y1, z0]
  const e: V3 = [x0, y0, z1], f: V3 = [x1, y0, z1], g: V3 = [x1, y1, z1], h: V3 = [x0, y1, z1]
  p.quad(a, b, f, e); p.quad(b, c, g, f); p.quad(c, d, h, g); p.quad(d, a, e, h); p.quad(e, f, g, h)
  if (faces.bottom) p.quad(a, d, c, b)
}

/** A quad wound to face n. */
function qn(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}

/** A newel post: a shaft with a capping slab and a low cap. */
function newel(cx: number, cy: number, z0: number, h: number, w = 0.8) {
  const r = w / 2
  cube(stone, cx - r, cy - r, cx + r, cy + r, z0, z0 + h - 0.25)
  cube(cap, cx - r - 0.1, cy - r - 0.1, cx + r + 0.1, cy + r + 0.1, z0 + h - 0.25, z0 + h - 0.1, { bottom: true })
  box(cap, cx - r + 0.08, cy - r + 0.08, cx + r - 0.08, cy + r - 0.08, z0 + h - 0.1, z0 + h + 0.15, 0.1)
}

/**
 * A solid balustrade along a straight line from a to b (plan), its foot at
 * foot(t) and its top rail at top(t) for t along the line, `w` thick, with
 * a capping rail. Posts are added by the caller.
 */
function rail(a: [number, number], b: [number, number], foot: (t: number) => number, top: (t: number) => number, w = 0.45, ts = [0, 1]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = uy, ny = -ux
  const P = (t: number, s: number, z: number): V3 => [a[0] + ux * L * t + nx * s, a[1] + uy * L * t + ny * s, z]
  const h = w / 2, hc = h + 0.08
  for (let i = 0; i < ts.length - 1; i++) {
    const t0 = ts[i], t1 = ts[i + 1]
    const f0 = foot(t0), f1 = foot(t1), r0 = top(t0) - 0.14, r1 = top(t1) - 0.14
    stone.quad(P(t0, h, f0), P(t1, h, f1), P(t1, h, r1), P(t0, h, r0))
    stone.quad(P(t1, -h, f1), P(t0, -h, f0), P(t0, -h, r0), P(t1, -h, r1))
    // the capping rail
    const c0 = top(t0), c1 = top(t1)
    cap.quad(P(t0, hc, r0), P(t1, hc, r1), P(t1, hc, c1), P(t0, hc, c0))
    cap.quad(P(t1, -hc, r1), P(t0, -hc, r0), P(t0, -hc, c0), P(t1, -hc, c1))
    cap.quad(P(t0, -hc, c0), P(t0, hc, c0), P(t1, hc, c1), P(t1, -hc, c1))
  }
  for (const [t, s] of [[ts[0], -1], [ts[ts.length - 1], 1]] as [number, number][]) {
    const f = foot(t), r = top(t) - 0.14, c = top(t)
    const q = (a: V3, b: V3, cc: V3, d: V3, part: Part) => (s > 0 ? part.quad(a, b, cc, d) : part.quad(b, a, d, cc))
    q(P(t, -h, f), P(t, h, f), P(t, h, r), P(t, -h, r), stone)
    q(P(t, -hc, r), P(t, hc, r), P(t, hc, c), P(t, -hc, c), cap)
  }
}
const flat = (z: number) => () => z

/**
 * A wall face in the plane through `o` along unit `u` (plan), facing `n`,
 * from s = s0 to s1, z0 to zTop, pierced by semicircular arches [centre s,
 * half-width r, springing z]. Both faces, the jambs and the soffits.
 */
function arcadeWall(o: [number, number], u: [number, number], s0: number, s1: number, z0: number, zTop: number, arches: [number, number, number][], t: number, back: Part) {
  const nrm: [number, number] = [u[1], -u[0]]
  const P = (s: number, z: number, d: number): V3 => [o[0] + u[0] * s + nrm[0] * d, o[1] + u[1] * s + nrm[1] * d, z]
  const face = (a: [number, number], b: [number, number], c: [number, number], d: [number, number]) => {
    stone.quad(P(a[0], a[1], 0), P(b[0], b[1], 0), P(c[0], c[1], 0), P(d[0], d[1], 0))
    back.quad(P(b[0], b[1], -t), P(a[0], a[1], -t), P(d[0], d[1], -t), P(c[0], c[1], -t))
  }
  let s = s0
  const N = 10
  for (const [c, r, zs] of arches) {
    face([s, z0], [c - r, z0], [c - r, zTop], [s, zTop])
    for (let i = 0; i < N; i++) {
      const a0 = Math.PI - (i * Math.PI) / N, a1 = Math.PI - ((i + 1) * Math.PI) / N
      const p0: [number, number] = [c + r * Math.cos(a0), zs + r * Math.sin(a0)], p1: [number, number] = [c + r * Math.cos(a1), zs + r * Math.sin(a1)]
      face(p0, p1, [p1[0], zTop], [p0[0], zTop])
      // soffit, facing into the opening
      stone.quad(P(p1[0], p1[1], 0), P(p0[0], p0[1], 0), P(p0[0], p0[1], -t), P(p1[0], p1[1], -t))
    }
    // jambs
    stone.quad(P(c - r, zs, 0), P(c - r, z0, 0), P(c - r, z0, -t), P(c - r, zs, -t))
    stone.quad(P(c + r, z0, 0), P(c + r, zs, 0), P(c + r, zs, -t), P(c + r, z0, -t))
    s = c + r
  }
  face([s, z0], [s1, z0], [s1, zTop], [s, zTop])
}

// ===========================================================================
// The Arcade: north face at y = 0, x ±11.25, under the drive to y = -27.
// ===========================================================================
// AH: the hall runs on under the well's covered landing to the foot of the
// first flight, where the open well begins (lidar).
const AX = 11.25, AS = -27, AH = -33, WT = 1.1
{
  const pitch = (2 * AX) / 7, r = 1.15, zs = 3.3
  const arches = Array.from({ length: 7 }, (_, k): [number, number, number] => [-AX + pitch * (k + 0.5), r, zs])
  arcadeWall([-AX, 0], [1, 0], 0, 2 * AX, 0, 5.3, arches.map(([c, rr, z]) => [c + AX, rr, z]), WT, dark)
  // Pilasters on the piers and the entablature band over the arches.
  for (let k = 0; k <= 7; k++) {
    const x = -AX + pitch * k, w = k === 0 || k === 7 ? 0.9 : 0.55
    box(stone, x - w / 2, 0, x + w / 2, 0.25, 0, 5.3, 0.06, null)
  }
  box(cap, -AX - 0.1, -0.2, AX + 0.1, 0.4, 5.3, U, 0.1)
  // The balustrade over the Arcade, posts over every pier, tall pedestals at the ends.
  rail([-AX + 0.5, 0], [AX - 0.5, 0], flat(U), flat(U + 1.0), 0.45)
  for (let k = 1; k < 7; k++) newel(-AX + pitch * k, 0, U, 1.3, 0.6)
  for (const s of [-1, 1]) {
    box(stone, s * AX - 0.75, -0.75, s * AX + 0.75, 0.75, U, U + 1.9, 0.1, null)
    box(cap, s * AX - 0.9, -0.9, s * AX + 0.9, 0.9, U + 1.9, U + 2.15, 0.06)
    box(cap, s * AX - 0.45, -0.45, s * AX + 0.45, 0.45, U + 2.15, U + 3.0, 0.15)
  }
  // The hall behind: the Minton ceiling (4.9 m) seen through the arches, in
  // gold coffers; the rest of the hall is under the drive and the map's ground.
  const zc = 4.9, xi = AX - 0.6, cy0 = -WT - 4.4, cy1 = -WT
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    const xa = -xi + ((2 * xi) * i) / 3 + 0.25, xb = -xi + ((2 * xi) * (i + 1)) / 3 - 0.25
    const ya = cy0 + ((cy1 - cy0) * j) / 2 + 0.25, yb = cy0 + ((cy1 - cy0) * (j + 1)) / 2 - 0.25
    tiles.quad([xa, ya, zc], [xa, yb, zc], [xb, yb, zc], [xb, ya, zc])
  }
  dark.quad([-xi, cy0, zc + 0.02], [-xi, cy1, zc + 0.02], [xi, cy1, zc + 0.02], [xi, cy0, zc + 0.02])
  use(MALL)
  // South face onto the grand stair's landing: three arches across the well.
  const GW = 4.0
  const sp = (2 * GW) / 3
  arcadeWall([GW, AH], [-1, 0], 0, 2 * GW, 0, U - 0.3, [0, 1, 2].map((k): [number, number, number] => [sp * (k + 0.5), 1.0, 3.3]), WT, dark)
}

// ===========================================================================
// The grand central stair, south of the drive: a well x ±4 between walls,
// a covered landing y -27…-33 at the plaza level (the hall's end), flights to
// 2.7 m and to the Mall.
// ===========================================================================
{
  const GW = 4.0, TW = 0.8
  const flights: [number, number, number, number][] = [[-33, -40, 0, 2.7], [-46, -52, 2.7, U - 0.3]]
  const surf = (y: number) => (y > -33 ? 0 : y > -40 ? (2.7 * (-33 - y)) / 7 : y > -46 ? 2.7 : y > -52 ? 2.7 + ((U - 3.0) * (-46 - y)) / 6 : U - 0.3)
  for (const [y0, y1, z0, z1] of flights) {
    const n = Math.round((z1 - z0) / 0.16), d = (y1 - y0) / n, h = (z1 - z0) / n
    for (let k = 0; k < n; k++) {
      const ya = y0 + d * k, yb = ya + d, zt = z0 + h * (k + 1)
      qn(steps, [-GW, ya, zt - h], [GW, ya, zt - h], [GW, ya, zt], [-GW, ya, zt], [0, 1, 0])
      qn(steps, [-GW, ya, zt], [GW, ya, zt], [GW, yb, zt], [-GW, yb, zt], [0, 0, 1])
    }
  }
  qn(steps, [-GW, -40, 2.7], [GW, -40, 2.7], [GW, -46, 2.7], [-GW, -46, 2.7], [0, 0, 1])
  // Well walls with their balustrades: masonry to the Mall's level, then the rail.
  for (const s of [-1, 1]) {
    const xi = s * GW, xo = s * (GW + TW)
    // The wall's foot follows the stair inside the well; outside it is the Mall's ground.
    const ys = [AS, -33, -40, -46, -52, -52.5], T = ys.map((y) => (y - AS) / (-52.5 - AS))
    const yAt = (t: number) => AS + (-52.5 - AS) * t
    // Under the covered landing the wall is hidden; its foot rises to the deck there.
    const foot = (y: number) => (y > AH ? ((U - 0.3) * (y - AH)) / (AS - AH) : surf(y))
    rail([s * (GW + TW / 2), AS], [s * (GW + TW / 2), -52.5], (t) => foot(yAt(t)), flat(U + 0.9), TW, T)
    void xi, xo
    for (const y of [AS - 0.5, -33, -40, -46, -52]) newel(s * (GW + TW / 2), y, U - 0.1, 1.3, 0.75)
  }
  // The drive's south edge: balustrade from the well out to the flanking walks.
  for (const s of [-1, 1]) {
    rail([s * (GW + TW), AS - 0.4], [s * 17.5, AS - 0.4], flat(U - 0.2), flat(U + 0.85), 0.45)
    newel(s * 11.25, AS - 0.4, U - 0.2, 1.25, 0.65)
    newel(s * 17.5, AS - 0.4, U - 0.2, 1.4, 0.8)
  }
}

use(PLAZA)
// ===========================================================================
// The side stairs north of the drive: x 11.25…23.7 each side, from the drive
// (y -7) to a landing (y -1…4.5, 2.95 m) and down to the plaza (y 12.2).
// ===========================================================================
{
  const XI = AX, XO = 23.7, RW = 0.7
  const YT = -7, YL0 = -1, YL1 = 4.5, YB = 12.2
  // Drawn on their own ground, not at their real heights (drive 5.9 m, landing
  // 2.95 m): the map lifts a flat-based model by the terrain under it, and the
  // terrain here is the stair itself, so the steps are a low relief and the
  // balustrades stand 1.05 m over it.
  const H = 0.15
  for (const s of [-1, 1]) {
    const x0 = s * (XI + RW), x1 = s * (XO - RW)
    const xa = Math.min(x0, x1), xb = Math.max(x0, x1)
    // flights: each step a tread and the riser facing down the stair (toward +y)
    for (const [y0, y1, n] of [[YT, YL0, 20], [YL1, YB, 20]] as [number, number, number][]) {
      const d = (y1 - y0) / n
      for (let k = 0; k < n; k++) {
        const ya = y0 + d * k, yb = ya + d
        qn(steps, [xa, ya, H], [xa, yb, H], [xb, yb, H], [xb, ya, H], [0, 0, 1])
        qn(steps, [xa, yb, 0], [xb, yb, 0], [xb, yb, H], [xa, yb, H], [0, 1, 0])
      }
    }
    // the balustrade walls either side
    const ts = [YT - 0.5, YT, YL0, YL1, YB, YB + 0.5]
    for (const xr of [s * (XI + RW / 2), s * (XO - RW / 2)]) {
      rail([xr, ts[0]], [xr, ts[ts.length - 1]], () => 0, () => 1.2, RW, ts.map((y) => (y - ts[0]) / (ts[ts.length - 1] - ts[0])))
      for (const y of [YT, YL0, YL1]) newel(xr, y, 0, 1.55, 0.95)
      newel(xr, YB + 0.3, 0, 1.7, 1.05)
    }
    // the upper balustrade along the drive, from the stair top outward
    use(MALL)
    rail([s * XO, YT - 0.5], [s * 36, YT - 0.5], flat(U - 0.3), flat(U + 1.0), 0.5)
    for (const x of [27.5, 31.5, 36]) newel(s * x, YT - 0.5, U - 0.3, 1.5, 0.8)
    use(PLAZA)
  }
}

// ===========================================================================
// The lower plaza: side balustrades (x ±23.7, y 12.2…41.5), the cross
// balustrades at y 29 with their triple-newel clusters, the Lake parapet.
// ===========================================================================
{
  for (const s of [-1, 1]) {
    const xe = s * 23.7
    rail([xe, 12.6], [xe, 41.5], flat(0), flat(1.0), 0.45, [0, 0.25, 0.5, 0.75, 1])
    for (const y of [20.5, 29, 35.5, 41.5]) newel(xe, y, 0, 1.4, 0.7)
    rail([s * 16.5, 29], [xe, 29], flat(0), flat(1.0), 0.45)
    // the cluster: three tall newels on a shared plinth
    box(stone, s * 14.2 - 1.3, 27.8, s * 14.2 + 1.3, 30.2, 0, 0.5, 0.1, cap)
    for (const [dx, dy] of [[-0.75, -0.6], [0.75, -0.6], [0, 0.65]]) newel(s * 14.2 + dx, 29 + dy, 0.5, 2.1, 0.85)
  }
}

const materials = (p: typeof PLAZA) => [
  { part: p.stone, material: { name: 'sandstone', color: 0xc2ae84, roughness: 0.9 } },
  { part: p.cap, material: { name: 'trim', color: 0xddd1b2, roughness: 0.85 } },
  { part: p.steps, material: { name: 'granite', color: 0xb3ada2, roughness: 0.9 } },
  { part: p.dark, material: { name: 'window', color: 0x4d4538, roughness: 0.9 } },
  { part: p.tiles, material: { name: 'window-tiles', color: 0xc79a4e, roughness: 0.5 } },
].filter(({ part }) => part.triangles > 0)
finishModel('Bethesda Terrace', 'nyc-bethesda-terrace', materials(PLAZA), { bearing: 16.7, height: U + 3.0 }, 6500)
finishModel('Bethesda Terrace, Mall level', 'nyc-bethesda-terrace-mall', materials(MALL), { bearing: 16.7, height: U + 1.4, elevation: -5.4 }, 6500)
void TAU
