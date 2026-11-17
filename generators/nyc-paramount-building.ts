/**
 * The Paramount Building (1501 Broadway, west side of Broadway between West
 * 43rd and 44th Streets, Times Square; 1926-27, Rapp & Rapp; NYC landmark
 * 1988). Procedural, CC0-1.0, no textures.
 *   bun generators/nyc-paramount-building.ts
 *
 * What makes it itself, and the photos each comes from:
 * 1. the wedding cake: a 61 m slab on Broadway and both streets, stepping
 *    back in eight stages on the north, east and south sides to a narrow
 *    clock tower (jjj, kid, td01, td03, lidar);
 * 2. the clock tower: big dials on the east and west faces, open ring
 *    clocks with twelve star discs on the north and south faces, a carved
 *    frieze over the dial and pinnacles on every corner (bmk, scu, clock);
 * 3. the glass globe on a copper drum on top (bmk, scu, lund);
 * 4. the jagged pinnacled tops of every setback, floodlit gold at night
 *    (td01, td03, kid);
 * 5. the five-storey limestone base with the carved arch, the bulb-lit
 *    "Paramount" script over it and the Hard Rock Cafe marquee under it
 *    (quin, hr23, jjj, hrn).
 *
 * Map frame: x = model east (Broadway), y = model north (44th Street),
 * z up, metres. Placed at bearing 29, the Manhattan grid: OSM's outline
 * edges come out axis-aligned within 0.1 m. Anchor: the area centroid of
 * the OSM outline way/266149373 (-73.9867022, 40.7572223). The outline in
 * this frame runs x -32.4..30.2, y -30.4..30.5, with a 3.2 m notch in its
 * west side; Broadway is the x = 30.2 face, 43rd Street y = -30.4.
 * Replaces the outline and its 14 building:part ways (all of them lie
 * inside it; checked against the OSM map call, osm.py buildings).
 *
 * Evidence
 * - OSM way/266149373 (outline) and parts 288298857..288298870 and
 *   311451315: the plan of the base, the setback rings on the north, east
 *   and south faces and the light court on the west side of the tower.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, read in the model frame
 *   (tools/lidar_frame.py, 0.5 m grid). The street falls from 44th Street
 *   to 43rd and Broadway by about 4 m; heights here are above the lowest
 *   street (Broadway at 43rd), lidar minus 1.5 m. Measured: the west
 *   (theatre) block 44 m, with a 31 m strip on 44th Street; the slab's
 *   outer ring 61.5 m, then 68.5, 79, 86, 93 (a wing reaching west to
 *   x = 3 on the north side and 9 on the south), 104, 108, 115.5 and the
 *   clock tower's roof at 126.5 m with corner pinnacles to 130; the
 *   globe's top at 138.5 m. The lidar sits ~2.5 m west of OSM's inner
 *   parts (the tower is x 13-21.5, OSM 14.8-24), so the tower stages follow
 *   the lidar and the outer ring follows OSM, where the two agree.
 * - Published (Wikipedia "1501 Broadway", citing the NYC LPC designation
 *   reports of 1987/88): 33 storeys; roof 391 ft (119 m), pinnacle 455 ft
 *   (139 m: the lidar's 138.5 m matches); a limestone base of five storeys
 *   and brick above; eight setbacks, the first above the 18th storey; clock
 *   faces about 25 ft (7.6 m) across on the west and east, smaller faces on
 *   the north and south; the globe 19 ft (5.8 m) across, of 90 glass
 *   panels, lit at night (constant white with a red pulse each quarter
 *   hour since the 1996 restoration); over 1,000 floodlights on the
 *   setbacks originally; the Hard Rock Cafe marquee 39 ft (12 m) wide,
 *   three panels with a curved LED display.
 * Estimated (from photos, scaled by the lidar stages): the dial 8.8 m
 *   across (a little over the published 25 ft, as the photos show it
 *   filling its stage) centred at 118.6 m in a 10.6 m square panel; the
 *   ring clocks 5.6 m across at 112.2 m on the north and south faces of
 *   the 115.5 m pavilions, level with the dial's foot (scu, from a tower
 *   nearby; bmk); the drum 4.2 m across, 6 m tall; pinnacle sizes and
 *   spacing; the arch (5.6 m opening, crown 18 m, scaled by the marquee's
 *   published 12 m in hr23) and its position (centre 12 m north of 43rd
 *   Street, one bay in from the corner, hr23 and jjj); the "Paramount"
 *   script 7 m wide over it (quin); the marquee's panels (2.8 + 1.9 +
 *   7.3 m, 3 m deep, 4-10.4 m up, hr23); the
 *   guitar sign on the corner (8-19.5 m) and the vertical ad cabinet on the
 *   43rd Street face (24-38 m); base bays 4.4 m, upper bays 3 m.
 * Invented / left out: the carved ornament (arch surround drawn as a plain
 *   band, the frieze over the dial as a raised panel), the curved scroll
 *   buttresses at the upper setbacks, the shopfront signs at street level,
 *   the window pattern of the light court.
 *
 * Lettering (STYLE.md "Famous signs"): the bulb-lit "Paramount" script
 * over the arch, the building's own long-standing sign, traced from quin
 * (straight on, CC BY 4.0) as centre-lines in its pixels and stroked with
 * lettering.ts; strokes are even, so the script's swelling is approximate.
 * "Hard Rock" on the marquee's header is traced from hr23 (CC BY 3.0)
 * roughly, as bold upright strokes; it only reads close up.
 *
 * Night (td01, td03, hrn, lund): the setbacks from the first ledge (61.5 m)
 * up are floodlit gold, so the masonry carries `floodlight` there: each
 * ledge's fixtures wash the wall above, brightest at the ledge and fading
 * towards the next, little on the roofs. The slab below 61.5 m and the base
 * are not floodlit (in the photos they are only tinted by the square's
 * signs, which is not drawn). The clock dials and the star discs are lit white, the globe glows
 * (drawn as `window`, so it shines warm white; the quarter-hour red pulse
 * is not drawn). The "Paramount" bulbs, the marquee's screens and the ad
 * cabinet glow white (`neon-paramount-white`); the "Hard Rock" letters and
 * the guitar sign glow orange-red (`neon-hard-rock`).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - jjj "1501 Broadway, NYC.jpg", JJonahJackalope, CC BY-SA 4.0 (2024):
 *   from Broadway and 43rd, the whole east and south faces.
 *   https://commons.wikimedia.org/wiki/File:1501_Broadway,_NYC.jpg
 * - kid "1501 Broadway.jpg", Kidfly182, CC BY 4.0 (2024): the east face
 *   straight up, the setbacks and the clock stage.
 *   https://commons.wikimedia.org/wiki/File:1501_Broadway.jpg
 * - bmk "1501 Broadway rear top.jpg", Beyond My Ken, CC BY-SA 4.0 (2011):
 *   the clock tower, dial, ring clock, globe and drum.
 *   https://commons.wikimedia.org/wiki/File:1501_Broadway_rear_top.jpg
 * - scu "Paramount Building via One Times Square.jpg", Scu ba, CC0 (2024):
 *   the top from the south-east, at height.
 *   https://commons.wikimedia.org/wiki/File:Paramount_Building_via_One_Times_Square.jpg
 * - clock "Clock on the Paramount Building (4672393664).jpg", Tony
 *   Hisgett, CC BY 2.0 (2010).
 *   https://commons.wikimedia.org/wiki/File:Clock_on_the_Paramount_Building_(4672393664).jpg
 * - lund "1501 Broadway, Times Square, New York (7237735096).jpg", Ken
 *   Lund, CC BY-SA 2.0 (2012).
 *   https://commons.wikimedia.org/wiki/File:1501_Broadway,_Times_Square,_New_York_(7237735096).jpg
 * - td01, td03 "43rd St Bway 7th Av td 01/03 - Paramount Building.jpg",
 *   Tdorante10, CC BY-SA 4.0 (night, April 2018).
 *   https://commons.wikimedia.org/wiki/File:43rd_St_Bway_7th_Av_td_01_-_Paramount_Building.jpg
 *   https://commons.wikimedia.org/wiki/File:43rd_St_Bway_7th_Av_td_03_-_Paramount_Building.jpg
 * - quin "Paramount Building Ornate Archway and Marquee Sign - 1501
 *   Broadway, NYC.jpg", Anthony Quintano, CC BY 4.0 (2025): the arch and
 *   the "Paramount" script.
 *   https://commons.wikimedia.org/wiki/File:Paramount_Building_Ornate_Archway_and_Marquee_Sign_-_1501_Broadway,_NYC.jpg
 * - hr23 "Hard Rock-2023.jpg", Alberto-g-rovi, CC BY 3.0 (2023): the
 *   marquee, the arch and the guitar sign.
 *   https://commons.wikimedia.org/wiki/File:Hard_Rock-2023.jpg
 * - hrn "Times Square Night, Hard Rock Café.jpg", Francesca.hyanna19,
 *   CC BY-SA 4.0 (night, 2018).
 *   https://commons.wikimedia.org/wiki/File:Times_Square_Night,_Hard_Rock_Caf%C3%A9.jpg
 *
 * Doubts: the west (rear) face and the light court are seen in no photo
 * here and follow OSM and lidar only; the limestone base and trim share
 * one masonry colour with the buff brick (six materials: the sixth is the
 * green copper drum), so the base reads a touch warmer than its grey stone;
 * the marquee's body is drawn in roof grey, not dark bronze; the marquee's and
 * signs' sizes are photo estimates; the guitar sign's mounting (drawn
 * diagonally on the corner) is read from two oblique photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'
import { type XY, type Facade, quadN, inside, finishModel, prism, unit } from './nyc-570-lexington'

// One masonry material: the limestone base and trim and the buff brick are
// close in tone in the photos, and the sixth material goes to the copper drum.
const brick = new Part(), lime = brick, win = new Part(), roof = new Part(), white = new Part(), rock = new Part(), copper = new Part()

const BASE = 22 // top of the limestone base
const BROADWAY = 30.2, SOUTH = -30.4, NORTH = 30.45

// ------------------------------------------------------------ plan
type Box = [number, number, number, number, number]
// The outline (OSM, model frame) less the 31 m strip on 44th Street.
const westBlock: XY[] = [
  [-32.43, -20.18], [-29.25, -20.17], [-29.25, 2.18], [-28.03, 7.85], [-28.25, 13.6], [-27.63, 18.58],
  [-32.44, 18.57], [-32.44, NORTH], [-23, NORTH], [-23, 21.5], [1, 21.5], [1, NORTH], [BROADWAY, NORTH],
  [BROADWAY, SOUTH], [-32.44, SOUTH],
]
// The tower block, below its first setback: the whole Broadway half
// except the light court behind the tower (x < 14.4 between the wings).
const slab: XY[] = [[1, NORTH], [1, 13.3], [13, 13.3], [13, -15.05], [8.76, -15.05], [8.76, SOUTH], [BROADWAY, SOUTH], [BROADWAY, NORTH]]
const TX0 = 13, TX1 = 21.5 // the tower's west and east faces (lidar)
const CLOCK_TOP = 126.5
const boxes: Box[] = [
  [-23, 21.5, 1, NORTH, 31],
  [1, -28.6, 28.6, 28.6, 68.5],
  [1, -26.6, 26.6, 26.6, 79],
  [1, -24.6, 24.6, 24.6, 86],
  [8, 3.5, 13, 9.5, 89], // a lift bulkhead on the light court
  [3, 13.3, 22.3, 21.3, 93], [9, -21.3, 22.3, -13.3, 93], [TX0, -13.3, 22.3, 13.3, 93],
  [TX0, -16.5, 22, 16.5, 104],
  [TX0, -15, 22, 15, 108],
  [TX0, -12.5, TX1, 12.5, 115.5],
  [TX0, -7.5, TX1, 7.5, 113.5], // the clock stage, continued in limestone above
]
// The 61.5 m outer ring is the slab itself; the setback boxes above are
// clipped to its plan (the light court and the south wing's west edge).
const slabRects: [number, number, number, number][] = [[1, 13.3, BROADWAY, NORTH], [13, -15.05, BROADWAY, 13.3], [8.76, SOUTH, BROADWAY, -15.05]]
const clipToSlab = (b: Box): Box[] => slabRects.flatMap(([x0, y0, x1, y1]) => {
  const c: Box = [Math.max(b[0], x0), Math.max(b[1], y0), Math.min(b[2], x1), Math.min(b[3], y1), b[4]]
  return c[2] - c[0] > 0.01 && c[3] - c[1] > 0.01 ? [c] : []
})
const polys: [number, XY[]][] = [[44, westBlock], [61.5, slab]]

// ------------------------------------------------------------ facades
const upper: Facade = { bay: 4.2, ratio: 0.55, floor: 3.55, group: 3, spandrel: 2.2, sill: 1.4, head: 1.6, minLength: 3, margin: 0.5 }
const lower: Facade = { bay: 4.4, ratio: 0.66, floor: 4.6, group: 2, spandrel: 1.2, sill: 0.8, head: 2.8, ground: 0.6, minLength: 4, margin: 0.8 }

// The arch on Broadway, one bay in from 43rd Street.
const ARCH_Y = -18.5, ARCH_R = 2.8, ARCH_SPRING = 15.2
/** Skip base window panels behind the arch and the corner signs. */
const skipBase = (n: V3, s0: number, s1: number, a: XY, uy: number) => {
  const y0 = a[1] + uy * s0, y1 = a[1] + uy * s1
  return n[0] > 0.9 && Math.max(y0, y1) > ARCH_Y - ARCH_R - 1.4 && Math.min(y0, y1) < ARCH_Y + ARCH_R + 1.4
}

/** One wall a→b (counter-clockwise ring order, so it faces out) with grouped window panels 0.05 m proud. */
function wall(p: Part, a: XY, b: XY, z0: number, z1: number, f: Facade | null, groundRow: boolean, skip?: typeof skipBase) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 1e-6 || z1 - z0 < 1e-6) return
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n: V3 = [uy, -ux, 0]
  const v = (s: number, z: number, d = 0): V3 => [a[0] + ux * s + n[0] * d, a[1] + uy * s + n[1] * d, z]
  quadN(p, v(0, z0), v(L, z0), v(L, z1), v(0, z1), [n, n, n, n])
  if (!f) return
  const margin = f.margin ?? 0, usable = L - 2 * margin
  if (L < (f.minLength ?? 4) || usable < f.bay * 0.6) return
  const count = Math.max(1, Math.round(usable / f.bay)), pitch = usable / count, w = pitch * f.ratio
  const bottom = z0 + (groundRow ? (f.ground ?? f.sill) : f.sill), top = z1 - f.head
  if (top - bottom < f.floor * 0.8) return
  const rows = Math.max(1, Math.round((top - bottom) / (f.floor * f.group))), rh = (top - bottom) / rows
  for (let r = 0; r < rows; r++) {
    const lo = bottom + r * rh + (r ? f.spandrel / 2 : 0), hi = bottom + (r + 1) * rh - (r < rows - 1 ? f.spandrel / 2 : 0)
    for (let k = 0; k < count; k++) {
      const c = margin + pitch * (k + 0.5)
      if (skip && skip(n, c - w / 2, c + w / 2, a, uy)) continue
      win.quad(v(c - w / 2, lo, 0.05), v(c + w / 2, lo, 0.05), v(c + w / 2, hi, 0.05), v(c - w / 2, hi, 0.05))
    }
  }
}

// ------------------------------------------------------------ the stepped mass (a height field)
const UP: V3 = [0, 0, 1]
const BEVEL = 0.45
{
  // the lift bulkhead stands in the light court, outside the slab
  const bx = boxes.flatMap((b) => (b[4] === 89 ? [b] : clipToSlab(b)))
  const xs = [...new Set([...bx.flatMap((b) => [b[0], b[2]]), ...polys.flatMap(([, r]) => r.map((p) => p[0]))])].sort((a, b) => a - b)
  const ys = [...new Set([...bx.flatMap((b) => [b[1], b[3]]), ...polys.flatMap(([, r]) => r.map((p) => p[1]))])].sort((a, b) => a - b)
  const H = ys.slice(1).map((_, j) => xs.slice(1).map((_, i) => {
    const x = (xs[i] + xs[i + 1]) / 2, y = (ys[j] + ys[j + 1]) / 2
    return Math.max(0, ...bx.map((b) => (x > b[0] && x < b[2] && y > b[1] && y < b[3] ? b[4] : 0)),
      ...polys.map(([z, r]) => (inside([x, y], r) ? z : 0)))
  }))
  const h = (i: number, j: number) => H[j]?.[i] ?? 0
  type W = { a: XY; b: XY; lo: number; hi: number }
  const walls: W[] = []
  const add = (a: XY, b: XY, lo: number, hi: number) => {
    if (hi <= lo + 1e-6) return
    const prev = walls.find((w) => w.lo === lo && w.hi === hi && w.b[0] === a[0] && w.b[1] === a[1] &&
      Math.abs((w.b[0] - w.a[0]) * (b[1] - a[1]) - (w.b[1] - w.a[1]) * (b[0] - a[0])) < 1e-9)
    if (prev) prev.b = b; else walls.push({ a, b, lo, hi })
  }
  const nx = xs.length - 1, ny = ys.length - 1
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) add([xs[i], ys[j]], [xs[i + 1], ys[j]], h(i, j - 1), h(i, j))
  for (let j = ny - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) add([xs[i + 1], ys[j + 1]], [xs[i], ys[j + 1]], h(i, j + 1), h(i, j))
  for (let i = nx - 1; i >= 0; i--) for (let j = 0; j < ny; j++) add([xs[i + 1], ys[j]], [xs[i + 1], ys[j + 1]], h(i + 1, j), h(i, j))
  for (let i = 0; i < nx; i++) for (let j = ny - 1; j >= 0; j--) add([xs[i], ys[j + 1]], [xs[i], ys[j]], h(i - 1, j), h(i, j))
  // The kinked west wall of the theatre block (not axis-aligned) is drawn
  // by the grid as small steps; that is within 1.2 m of OSM and unseen.
  for (const w of walls) {
    const top = w.hi - BEVEL
    const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]), n: V3 = [(w.b[1] - w.a[1]) / L, -(w.b[0] - w.a[0]) / L, 0]
    if (w.lo < BASE) {
      // Broadway's front has the finer bays of the ornamented base (hr23).
      wall(lime, w.a, w.b, w.lo, Math.min(top, BASE), L > 6 ? (n[0] > 0.9 && w.a[0] > 30 ? { ...lower, bay: 2.7, ratio: 0.6 } : lower) : null, w.lo < 0.01, skipBase)
      // A cornice over the base: a small limestone band 0.3 m proud.
      if (top > BASE + 1) {
        const o = (p: XY, d: number): XY => [p[0] + n[0] * d, p[1] + n[1] * d]
        const a = o(w.a, 0.3), b = o(w.b, 0.3)
        quadN(lime, [a[0], a[1], BASE - 0.9], [b[0], b[1], BASE - 0.9], [b[0], b[1], BASE], [a[0], a[1], BASE], [n, n, n, n])
        lime.quad([w.a[0], w.a[1], BASE - 0.9], [w.b[0], w.b[1], BASE - 0.9], [b[0], b[1], BASE - 0.9], [a[0], a[1], BASE - 0.9])
        const nu = unit([n[0], n[1], 1.2])
        quadN(lime, [a[0], a[1], BASE], [b[0], b[1], BASE], [w.b[0], w.b[1], BASE + 0.3], [w.a[0], w.a[1], BASE + 0.3], [nu, nu, nu, nu])
      }
    }
    // The light court behind the tower (west-facing walls east of x = 1,
    // below the 93 m wings) is seen in no photo: plain brick.
    const court = n[0] < -0.9 && w.a[0] > 1.5 && w.hi <= 93.01 && w.a[0] < 14 && L < 10
    if (top > BASE) wall(brick, w.a, w.b, Math.max(w.lo, BASE), top, w.hi - w.lo > 4 && !court ? upper : null, false)
    const coping = w.hi > 58 ? lime : brick
    const nu = unit([n[0], n[1], 0.2])
    quadN(coping, [w.a[0], w.a[1], top], [w.b[0], w.b[1], top],
      [w.b[0] - n[0] * BEVEL, w.b[1] - n[1] * BEVEL, w.hi], [w.a[0] - n[0] * BEVEL, w.a[1] - n[1] * BEVEL, w.hi], [nu, nu, UP, UP])
  }
  const used = new Set<string>()
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const z = h(i, j)
    if (!z || used.has(`${i},${j}`)) continue
    let e = i + 1
    while (e < nx && h(e, j) === z && !used.has(`${e},${j}`)) e++
    let r = j + 1
    while (r < ny && Array.from({ length: e - i }, (_, k) => i + k).every((k) => h(k, r) === z && !used.has(`${k},${r}`))) r++
    for (let yy = j; yy < r; yy++) for (let xx = i; xx < e; xx++) used.add(`${xx},${yy}`)
    roof.quad([xs[i], ys[j], z - 0.04], [xs[e], ys[j], z - 0.04], [xs[e], ys[r], z - 0.04], [xs[i], ys[r], z - 0.04])
  }
}

// The south wing's west face over the theatre block is cut into narrow
// steps by the setbacks above 61.5 m (too narrow for panels); give the part
// south of the 93 m wing, 44-61.5 m,
// its windows (the wall itself is drawn above).
wall(new Part(), [8.76, -21.3], [8.76, SOUTH], 44, 61.5 - BEVEL, upper, false)

/** The height field's height at a point (the same boxes and polygons as the mass). */
const heightAt = (x: number, y: number) => Math.max(0,
  ...boxes.flatMap((b) => (b[4] === 89 ? [b] : clipToSlab(b))).map((b) => (x > b[0] && x < b[2] && y > b[1] && y < b[3] ? b[4] : 0)),
  ...polys.map(([z, r]) => (inside([x, y], r) ? z : 0)))

// ------------------------------------------------------------ pinnacles on the setbacks
/** A square pinnacle block with a pyramidal cap. */
function pinnacle(p: Part, x: number, y: number, z: number, s: number, h: number, pointed = false) {
  const r = (zz: number, d: number): V3[] => [[x - d, y - d, zz], [x + d, y - d, zz], [x + d, y + d, zz], [x - d, y + d, zz]]
  p.loft([r(z - 0.3, s), r(z + h, s)])
  const t = r(z + h, s), apex: V3 = [x, y, z + h + s * 0.9]
  if (!pointed) { p.cap(t, true); return }
  for (let i = 0; i < 4; i++) p.tri(t[i], t[(i + 1) % 4], apex)
}
// Each stage: [x0, y0, x1, y1, height]; pinnacles at its east corners and
// along its east, north and south edges, set just inside the coping.
// Each stage: [south-side west end, y0, x1, y1, height, north-side west
// end]; pinnacles at its corners and along its south, east and north edges,
// set just inside the coping.
const stages: [number, number, number, number, number, number][] = [
  [8.76, SOUTH, BROADWAY, NORTH, 61.5, 1], [8.76, -28.6, 28.6, 28.6, 68.5, 1], [8.76, -26.6, 26.6, 26.6, 79, 1],
  [8.76, -24.6, 24.6, 24.6, 86, 1], [9, -21.3, 22.3, 21.3, 93, 3], [TX0, -16.5, 22, 16.5, 104, TX0], [TX0, -12.5, TX1, 12.5, 115.5, TX0],
]
for (const [ws, y0, x1, y1, z, wn] of stages) {
  const PITCH = z > 100 ? 7.5 : 9, d = 0.75, s = z > 100 ? 0.75 : 0.6, hh = z > 100 ? 3.2 : 2.4
  const pts: XY[] = []
  const along = (a: XY, b: XY, pitch: number) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / pitch))
    for (let k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  along([ws + d, y0 + d], [x1 - d, y0 + d], PITCH)
  along([x1 - d, y0 + d], [x1 - d, y1 - d], PITCH)
  along([x1 - d, y1 - d], [wn + d, y1 - d], PITCH)
  pts.push([wn + d, y1 - d])
  for (const [x, y] of pts) {
    // every pinnacle must stand on a roof of its own stage's height
    const e = s * 0.9, corners: XY[] = [[x - e, y - e], [x + e, y - e], [x + e, y + e], [x - e, y + e]]
    const under = corners.map(([cx, cy]) => heightAt(cx, cy))
    if (under.some((h) => h < z - 0.01)) throw new Error(`pinnacle off its roof at ${x.toFixed(1)}, ${y.toFixed(1)}, ${z}`)
    if (under.some((h) => h > z + 0.01)) continue // inside the stage above: not drawn
    pinnacle(z > 100 ? lime : brick, x, y, z, s, hh)
  }
}

// ------------------------------------------------------------ scroll buttresses
// Concave quarter-round buttresses on the north and south faces of the
// 104 m stage, sweeping down onto the 93 m roof (scu, bmk, kid's outline).
for (const sy of [1, -1]) for (const x of [TX0 + 1.6, 22 - 1.6]) {
  const yw = sy * 16.5, R = 4.5, w = 0.7, n = 6
  // profile: from the wall at z 104 out to yw + sy*R at z 93 + 0.2, concave
  const prof: [number, number][] = Array.from({ length: n + 1 }, (_, i) => {
    const t = (i / n) * Math.PI / 2
    return [R * (1 - Math.cos(t)), 104 - 0.4 - (104 - 0.4 - 93) * Math.sin(t) ** 0.9]
  })
  const P = (dx: number, k: number): V3 => [x + dx, yw + sy * prof[k][0], prof[k][1]]
  for (let k = 0; k < n; k++) {
    // the curved top face
    const q = [P(-w, k), P(w, k), P(w, k + 1), P(-w, k + 1)]
    if (sy > 0) lime.quad(q[0], q[1], q[2], q[3]); else lime.quad(q[1], q[0], q[3], q[2])
    // the two sides, down to the roof
    for (const sx of [-1, 1]) {
      const a = P(sx * w, k), b = P(sx * w, k + 1), c: V3 = [b[0], b[1], 93], d: V3 = [a[0], a[1], 93]
      if (sx * sy > 0) lime.quad(d, c, b, a); else lime.quad(a, b, c, d)
    }
  }
}

// ------------------------------------------------------------ the clock stage
const CX = (TX0 + TX1) / 2, CY = 0, CW = (TX1 - TX0) / 2, CD = 7.5
prism({ wall: lime, win: null, roof, ring: [[TX0, -CD], [TX1, -CD], [TX1, CD], [TX0, CD]], z0: 113.5, z1: CLOCK_TOP, facade: null, bevel: 0.4 })
// Corner piers rising to pinnacles (lidar 130-131.5 m at the corners).
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const x = CX + sx * (CW - 0.7), y = CY + sy * (CD - 0.7)
  pinnacle(lime, x, y, CLOCK_TOP, 0.95, 3.0, true)
}
// East and west: the square dial panel (a shallow raised frame), the dial,
// its twelve star discs and the hands; the carved frieze above as a raised band.
const DIAL_Z = 118.6, DIAL_R = 4.4, PANEL = 5.3
const time = { h: 10, m: 10 }
for (const sx of [1, -1]) {
  const x = CX + sx * CW
  const P = (y: number, z: number, d: number): V3 => [x + sx * d, y * sx, z] // y measured to the viewer's right... mirrored by sx
  // the panel frame (four bars round the dial)
  const bar = (y0: number, z0: number, y1: number, z1: number, d0: number, d1: number) => {
    const f = [P(y0, z0, d1), P(y1, z0, d1), P(y1, z1, d1), P(y0, z1, d1)]
    const facing = (q: V3[]) => {
      const c = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], e = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
      return (c[1] * e[2] - c[2] * e[1]) * sx > 0 ? q : [q[3], q[2], q[1], q[0]]
    }
    const [a, b, c, d] = facing(f)
    lime.quad(a, b, c, d)
    // sides of the bar
    for (const [p0, p1] of [[[y0, z0], [y1, z0]], [[y1, z0], [y1, z1]], [[y1, z1], [y0, z1]], [[y0, z1], [y0, z0]]] as [number, number][][]) {
      const q = [P(p0[0], p0[1], d0), P(p1[0], p1[1], d0), P(p1[0], p1[1], d1), P(p0[0], p0[1], d1)]
      const mid: V3 = [(q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2, (q[0][2] + q[1][2]) / 2]
      const cen: V3 = [x, ((y0 + y1) / 2) * sx, (z0 + z1) / 2]
      const want = [mid[0] - cen[0], mid[1] - cen[1], mid[2] - cen[2]]
      const g = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], k = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]]
      const nn = [g[1] * k[2] - g[2] * k[1], g[2] * k[0] - g[0] * k[2], g[0] * k[1] - g[1] * k[0]]
      if (nn[0] * want[0] + nn[1] * want[1] + nn[2] * want[2] >= 0) lime.quad(q[0], q[1], q[2], q[3]); else lime.quad(q[3], q[2], q[1], q[0])
    }
  }
  const t = 0.6
  bar(-PANEL, DIAL_Z - PANEL, PANEL, DIAL_Z - PANEL + t, 0, 0.3)
  bar(-PANEL, DIAL_Z + PANEL - t, PANEL, DIAL_Z + PANEL, 0, 0.3)
  bar(-PANEL, DIAL_Z - PANEL + t, -PANEL + t, DIAL_Z + PANEL - t, 0, 0.3)
  bar(PANEL - t, DIAL_Z - PANEL + t, PANEL, DIAL_Z + PANEL - t, 0, 0.3)
  // the frieze over the panel
  bar(-PANEL, DIAL_Z + PANEL + 0.5, PANEL, DIAL_Z + PANEL + 2.2, 0, 0.25)
  // the dial
  const N = 16
  for (let i = 0; i < N; i++) {
    const a0 = (2 * Math.PI * i) / N, a1 = (2 * Math.PI * (i + 1)) / N
    const c = P(0, DIAL_Z, 0.12), p0 = P(DIAL_R * Math.cos(a0), DIAL_Z + DIAL_R * Math.sin(a0), 0.12), p1 = P(DIAL_R * Math.cos(a1), DIAL_Z + DIAL_R * Math.sin(a1), 0.12)
    white.tri(c, p0, p1)
  }
  // star discs (dark) and hands (dark)
  const disc = (y: number, z: number, r: number, d: number, part: Part) => {
    // a pentagon (the stars of the Paramount logo, simplified)
    const q = Array.from({ length: 5 }, (_, i) => P(y + r * Math.cos(Math.PI / 2 + (2 * Math.PI * i) / 5), z + r * Math.sin(Math.PI / 2 + (2 * Math.PI * i) / 5), d))
    for (let i = 1; i < 4; i++) part.tri(q[0], q[i], q[i + 1])
  }
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * 2 * Math.PI
    disc(3.6 * Math.sin(a), DIAL_Z + 3.6 * Math.cos(a), 0.5, 0.16, win)
  }
  const hand = (frac: number, len: number, wd: number) => {
    const a = frac * 2 * Math.PI, ry = Math.sin(a), rz = Math.cos(a), py = rz, pz = -ry
    const q = [P(-py * wd, DIAL_Z - pz * wd, 0.22), P(py * wd, DIAL_Z + pz * wd, 0.22), P(ry * len, DIAL_Z + rz * len, 0.22), P(ry * len, DIAL_Z + rz * len, 0.22)]
    win.tri(q[0], q[1], q[2])
    win.tri(q[1], q[0], P(-ry * 0.6, DIAL_Z - rz * 0.6, 0.22))
  }
  hand(((time.h % 12) + time.m / 60) / 12, 2.5, 0.35)
  hand(time.m / 60, 3.5, 0.28)
}
// North and south: open ring clocks, a dark ring with twelve lit discs,
// standing 0.4 m off the north and south faces of the 115.5 m pavilions
// in front of the clock stage, just above the 108 m roof (scu, bmk).
const RING_Z = 112.2, RING_R = 2.8
for (const sy of [1, -1]) {
  const y = CY + sy * 12.5 + sy * 0.4
  // u runs to the viewer's right on either face
  const P = (u: number, z: number, d = 0): V3 => [CX - sy * u, y + sy * d, z]
  const N = 16
  for (let i = 0; i < N; i++) {
    const a0 = (2 * Math.PI * i) / N, a1 = (2 * Math.PI * (i + 1)) / N
    const q = [P(RING_R * Math.cos(a0), RING_Z + RING_R * Math.sin(a0)), P(RING_R * Math.cos(a1), RING_Z + RING_R * Math.sin(a1)),
      P((RING_R - 0.8) * Math.cos(a1), RING_Z + (RING_R - 0.8) * Math.sin(a1)), P((RING_R - 0.8) * Math.cos(a0), RING_Z + (RING_R - 0.8) * Math.sin(a0))]
    win.quad(q[0], q[1], q[2], q[3])
    // the back of the ring and its rim, toward the wall
    const b = q.map((p) => [p[0], p[1] - sy * 0.4, p[2]] as V3)
    win.quad(q[1], q[0], b[0], b[1])
  }
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * 2 * Math.PI, u = (RING_R - 0.4) * Math.sin(a), z = RING_Z + (RING_R - 0.4) * Math.cos(a)
    const r = 0.45, q = Array.from({ length: 5 }, (_, i) => P(u + r * Math.cos(Math.PI / 2 + (2 * Math.PI * i) / 5), z + r * Math.sin(Math.PI / 2 + (2 * Math.PI * i) / 5), 0.06))
    for (let i = 1; i < 4; i++) white.tri(q[0], q[i], q[i + 1])
  }
  // hands across the open ring
  const hb = (a: number, len: number) => {
    const ry = Math.sin(a), rz = Math.cos(a)
    const q: V3[] = [P(-rz * 0.18, RING_Z + ry * 0.18, 0.02), P(rz * 0.18, RING_Z - ry * 0.18, 0.02), P(ry * len, RING_Z + rz * len, 0.02)]
    win.tri(q[0], q[1], q[2])
  }
  hb((((time.h % 12) + time.m / 60) / 12) * 2 * Math.PI, 1.5)
  hb((time.m / 60) * 2 * Math.PI, 2.1)
}

// ------------------------------------------------------------ drum and globe
{
  const ring = (r: number, z: number, n = 12): V3[] => Array.from({ length: n }, (_, i) => [CX + r * Math.cos((i * 2 * Math.PI) / n), CY + r * Math.sin((i * 2 * Math.PI) / n), z])
  // A square plinth, the drum, a flared collar, and the cup under the globe.
  prism({ wall: lime, win: null, roof: lime, ring: [[CX - 3, CY - 3], [CX + 3, CY - 3], [CX + 3, CY + 3], [CX - 3, CY + 3]], z0: CLOCK_TOP - 0.3, z1: CLOCK_TOP + 1.2, facade: null, bevel: 0.3 })
  copper.loft([ring(2.1, CLOCK_TOP + 1.2), ring(2.1, 130.3), ring(2.6, 131.2), ring(2.6, 131.8), ring(1.7, 133.1)]) // the cup closes onto the globe
  // The globe: 5.8 m across (published 19 ft), top at 138.5 m.
  const R = 2.9, GZ = 138.5 - R, segs = 12, rows = 7
  const pt = (i: number, j: number): V3 => {
    const th = (i * 2 * Math.PI) / segs, ph = -Math.PI / 2 + (j * Math.PI) / rows
    return [CX + R * Math.cos(ph) * Math.cos(th), CY + R * Math.cos(ph) * Math.sin(th), GZ + R * Math.sin(ph)]
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < segs; i++) {
    const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
    if (j === 0) win.tri(a, c, d)
    else if (j === rows - 1) win.tri(a, b, c)
    else win.quad(a, b, c, d)
  }
  // a small finial cap
  copper.loft([ring(0.5, 138.35, 8), ring(0.2, 138.9, 8)])
  copper.cap(ring(0.2, 138.9, 8), true)
}

// ------------------------------------------------------------ the arch on Broadway
{
  const X = BROADWAY, segs = 10
  const P = (y: number, z: number, d: number): V3 => [X + d, y, z]
  // glazing: a rectangle up to the spring and a semicircular fan
  win.quad(P(ARCH_Y - ARCH_R, 0, 0.06), P(ARCH_Y + ARCH_R, 0, 0.06), P(ARCH_Y + ARCH_R, ARCH_SPRING, 0.06), P(ARCH_Y - ARCH_R, ARCH_SPRING, 0.06))
  for (let i = 0; i < segs; i++) {
    const a0 = Math.PI * i / segs, a1 = Math.PI * (i + 1) / segs
    win.tri(P(ARCH_Y, ARCH_SPRING, 0.06), P(ARCH_Y + ARCH_R * Math.cos(a0), ARCH_SPRING + ARCH_R * Math.sin(a0), 0.06), P(ARCH_Y + ARCH_R * Math.cos(a1), ARCH_SPRING + ARCH_R * Math.sin(a1), 0.06))
  }
  // the surround: a band 1.1 m wide, 0.35 m proud, round the arch and down the jambs
  const W = 1.0, D = 0.35
  const band = (y0: number, z0: number, y1: number, z1: number, y2: number, z2: number, y3: number, z3: number) => {
    lime.quad(P(y0, z0, D), P(y1, z1, D), P(y2, z2, D), P(y3, z3, D))
  }
  for (const s of [-1, 1]) {
    const yi = ARCH_Y + s * ARCH_R, yo = ARCH_Y + s * (ARCH_R + W)
    if (s < 0) band(yo, 0, yi, 0, yi, ARCH_SPRING, yo, ARCH_SPRING); else band(yi, 0, yo, 0, yo, ARCH_SPRING, yi, ARCH_SPRING)
    // jamb sides
    const side = (y: number, n: number) => {
      const q = [P(y, 0, 0), P(y, 0, D), P(y, ARCH_SPRING, D), P(y, ARCH_SPRING, 0)]
      if (n > 0) lime.quad(q[0], q[3], q[2], q[1]); else lime.quad(q[0], q[1], q[2], q[3])
    }
    side(yo, s); side(yi, -s)
  }
  for (let i = 0; i < segs; i++) {
    const a0 = Math.PI * i / segs, a1 = Math.PI * (i + 1) / segs
    const ri = ARCH_R, ro = ARCH_R + W
    const pi0: [number, number] = [ARCH_Y + ri * Math.cos(a0), ARCH_SPRING + ri * Math.sin(a0)], pi1: [number, number] = [ARCH_Y + ri * Math.cos(a1), ARCH_SPRING + ri * Math.sin(a1)]
    const po0: [number, number] = [ARCH_Y + ro * Math.cos(a0), ARCH_SPRING + ro * Math.sin(a0)], po1: [number, number] = [ARCH_Y + ro * Math.cos(a1), ARCH_SPRING + ro * Math.sin(a1)]
    band(pi0[0], pi0[1], po0[0], po0[1], po1[0], po1[1], pi1[0], pi1[1])
    // outer and inner edges
    lime.quad(P(po0[0], po0[1], 0), P(po1[0], po1[1], 0), P(po1[0], po1[1], D), P(po0[0], po0[1], D))
    lime.quad(P(pi1[0], pi1[1], 0), P(pi0[0], pi0[1], 0), P(pi0[0], pi0[1], D), P(pi1[0], pi1[1], D))
  }
}

// ------------------------------------------------------------ the "Paramount" script over the arch
{
  // Centre-lines in quin's pixels (1280 px wide; v down). The arch's outer
  // surround spans u 240-1115 there, 9.2 m here.
  const pen = new Pen()
  // P: the stem with its hooked foot, and the big bowl over it
  pen.moveTo([352, 172]).cubicTo([342, 250], [322, 330], [292, 368], 5).quadTo([262, 392], [250, 350], 3)
  pen.moveTo([258, 252]).cubicTo([228, 180], [300, 132], [362, 140], 5).cubicTo([422, 146], [420, 214], [370, 240], 5).quadTo([336, 256], [304, 250], 3)
  const oval = (cx: number, cy: number, rx: number, ry: number) => pen.circle([cx, cy], rx, ry, 8)
  // a
  oval(452, 218, 26, 30); pen.moveTo([482, 186]).lineTo([476, 252])
  // r
  pen.moveTo([502, 252]).lineTo([512, 190]).quadTo([528, 176], [552, 188], 3)
  // a
  oval(588, 214, 26, 30); pen.moveTo([618, 184]).lineTo([612, 248])
  // m
  pen.moveTo([640, 246]).lineTo([650, 182]).quadTo([676, 160], [684, 200], 3).lineTo([680, 244])
  pen.moveTo([684, 200]).quadTo([708, 160], [728, 200], 3).lineTo([724, 250])
  // o
  oval(772, 222, 28, 32)
  // u
  pen.moveTo([818, 200]).lineTo([812, 246]).quadTo([826, 276], [860, 252], 3).moveTo([866, 206]).lineTo([862, 270])
  // n
  pen.moveTo([890, 290]).lineTo([902, 232]).quadTo([926, 210], [944, 240], 3).lineTo([942, 300])
  // t: stem and crossbar
  pen.moveTo([1010, 214]).lineTo([998, 340]).quadTo([996, 372], [1026, 362], 3)
  pen.moveTo([972, 250]).lineTo([1058, 236])
  const K = 7.6 / 875
  // u → north (+y), v up, w out of the face (+x, east); the lowercase
  // baseline (v = 250 px) at 19.2 m, level with the arch's crown.
  const place = (u: number, v: number, w: number): V3 => [BROADWAY + 0.02 + w, ARCH_Y + (u - 677) * K, 19.2 + (250 - v) * K]
  strokes(white, pen.paths, { width: 26, depth: 0.22, place })
}

// ------------------------------------------------------------ the Hard Rock Cafe marquee
const MQ = { z0: 4.0, scr: 7.6, hdr: 9.0, crest: 10.4 }
/** An axis-aligned box. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = true) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  if (bottom) p.cap(r(z0), false)
}
{
  // panels from south: left 3.3 m, the round medallion 2.2 m, the main 6.5 m
  const panels: [number, number, number][] = [[-24.0, -21.2, 2.4], [-19.3, -12.0, 3.0]]
  for (const [y0, y1, depth] of panels) {
    const x1 = BROADWAY + depth
    box(roof, BROADWAY, y0, MQ.z0, x1, y1, MQ.hdr)
    // the screen on the front and both ends, 0.05 m proud, with a dark border
    white.quad([x1 + 0.05, y0 + 0.3, MQ.z0 + 0.3], [x1 + 0.05, y1 - 0.3, MQ.z0 + 0.3], [x1 + 0.05, y1 - 0.3, MQ.scr], [x1 + 0.05, y0 + 0.3, MQ.scr])
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const q: V3[] = [[BROADWAY + 0.4, y + s * 0.05, MQ.z0 + 0.3], [x1 - 0.3, y + s * 0.05, MQ.z0 + 0.3], [x1 - 0.3, y + s * 0.05, MQ.scr], [BROADWAY + 0.4, y + s * 0.05, MQ.scr]]
      if (s < 0) white.quad(q[0], q[1], q[2], q[3]); else white.quad(q[3], q[2], q[1], q[0])
    }
    // the fan crest over the header
    const yc = (y0 + y1) / 2, hw = Math.min(1.2, (y1 - y0) * 0.2)
    const c: V3[] = [[x1 - 0.2, yc - hw, MQ.hdr], [x1 - 0.2, yc + hw, MQ.hdr], [x1 - 0.2, yc, MQ.crest]]
    roof.tri(c[0], c[1], c[2])
    roof.tri(c[1], c[0], c[2])
  }
  // the medallion: a disc on a short post, the Hard Rock roundel
  {
    const yc = -20.25, zc = 6.6, r = 0.95, x = BROADWAY + 2.6, n = 12
    for (let i = 0; i < n; i++) {
      const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n
      rock.tri([x, yc, zc], [x, yc + r * Math.cos(a0), zc + r * Math.sin(a0)], [x, yc + r * Math.cos(a1), zc + r * Math.sin(a1)])
    }
    box(roof, BROADWAY, yc - 1.1, MQ.z0, x - 0.02, yc + 1.1, MQ.hdr - 0.2)
  }
  // "Hard Rock" on the main panel's header, bold upright strokes (hr23).
  const pen = new Pen()
  const H = 1.0 // cap height in letter units
  // H
  pen.moveTo([0, 0]).lineTo([0, H]); pen.moveTo([0.55, 0]).lineTo([0.55, H]); pen.moveTo([0, 0.5]).lineTo([0.55, 0.5])
  // a
  pen.circle([0.95, 0.3], 0.24, 0.3, 7); pen.moveTo([1.19, 0.6]).lineTo([1.19, 0])
  // r
  pen.moveTo([1.42, 0]).lineTo([1.42, 0.6]).quadTo([1.5, 0.66], [1.7, 0.6], 3)
  // d
  pen.circle([2.0, 0.3], 0.24, 0.3, 7); pen.moveTo([2.24, 0]).lineTo([2.24, H])
  // R
  pen.moveTo([2.75, 0]).lineTo([2.75, H]).lineTo([3.1, H]).quadTo([3.35, 0.75], [3.1, 0.5], 3).lineTo([2.75, 0.5]); pen.moveTo([3.05, 0.5]).lineTo([3.3, 0])
  // o
  pen.circle([3.68, 0.3], 0.24, 0.3, 7)
  // c
  pen.moveTo([4.42, 0.52]).quadTo([4.2, 0.72], [4.04, 0.4], 3).quadTo([4.0, 0.0], [4.42, 0.08], 3)
  // k
  pen.moveTo([4.62, 0]).lineTo([4.62, H]); pen.moveTo([4.98, 0.6]).lineTo([4.66, 0.3]).lineTo([5.0, 0])
  const S = 0.62, x1 = BROADWAY + 3.0, yMid = -15.65
  const place = (u: number, v: number, w: number): V3 => [x1 + 0.02 + w, yMid + (u - 2.5) * S, MQ.scr + 0.4 + v * S]
  strokes(rock, pen.paths, { width: 0.2, depth: 0.12, place })
}

// ------------------------------------------------------------ signs on the corner
// The Hard Rock guitar: a vertical sign set diagonally on the corner of
// Broadway and 43rd Street, facing south-east (hr23, jjj).
{
  // centred so its back plane passes 0.05 m off the corner: it bites into both walls
  const f = Math.SQRT1_2, c: XY = [BROADWAY + 0.35 * f, SOUTH - 0.35 * f]
  const P = (u: number, z: number, d: number): V3 => [c[0] + u * f + d * f, c[1] + u * f - d * f, z] // u along the face (to the north-east), d out (south-east)
  const slab = (u0: number, u1: number, z0: number, z1: number) => {
    const d0 = -0.3, d1 = 0.3
    const q = (u: number, z: number, d: number) => P(u, z, d)
    // front, back, sides, top, bottom
    rock.quad(q(u0, z0, d1), q(u1, z0, d1), q(u1, z1, d1), q(u0, z1, d1))
    rock.quad(q(u1, z0, d0), q(u0, z0, d0), q(u0, z1, d0), q(u1, z1, d0))
    rock.quad(q(u0, z0, d0), q(u0, z0, d1), q(u0, z1, d1), q(u0, z1, d0))
    rock.quad(q(u1, z0, d1), q(u1, z0, d0), q(u1, z1, d0), q(u1, z1, d1))
    rock.quad(q(u0, z1, d1), q(u1, z1, d1), q(u1, z1, d0), q(u0, z1, d0))
    rock.quad(q(u0, z0, d0), q(u1, z0, d0), q(u1, z0, d1), q(u0, z0, d1))
  }
  slab(-1.5, 1.5, 7.6, 10.6) // the body, carrying the round logo
  slab(-1.1, 1.1, 10.6, 12.4)
  slab(-0.35, 0.35, 12.4, 18.2) // the neck
  slab(-0.55, 0.55, 18.2, 19.6) // the headstock
}
// The vertical ad cabinet on the 43rd Street face, one bay from the corner
// (a rotating ad: a plain lit face, no lettering).
{
  const y = SOUTH - 0.35, x0 = 23.6, x1 = 27.2
  box(roof, x0, y - 0.6, 24, x1, y + 0.35, 38.5)
  white.quad([x0 + 0.25, y - 0.65, 24.3], [x1 - 0.25, y - 0.65, 24.3], [x1 - 0.25, y - 0.65, 38.2], [x0 + 0.25, y - 0.65, 38.2])
}

// ------------------------------------------------------------ write
// Floodlights on the setbacks (td01, td03): fixtures on each ledge from the
// first setback (61.5 m) up wash the wall above them, brightest at the
// ledge and fading towards the next one; roofs catch a little. The slab
// below 61.5 m and the base are not floodlit (only tinted by the square's
// signs, which is not drawn).
const LEDGES = [61.5, 68.5, 79, 86, 93, 104, 108, 115.5, CLOCK_TOP, 140]
const lit = (p: V3, n: V3): number => {
  const z = p[2]
  let k = -1
  for (let i = 0; i < LEDGES.length - 1; i++) if (z >= LEDGES[i] - 0.05) k = i
  if (k < 0) return 0
  if (n[2] > 0.8) return 0.25
  const t = Math.min(1, (z - LEDGES[k]) / (LEDGES[k + 1] - LEDGES[k]))
  return 1 - 0.6 * t
}
finishModel('Paramount Building', 'nyc-paramount-building', [
  { part: brick, material: { ...finish('paramount-masonry', 0xdcc9a7), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: copper, material: finish('paramount-copper', 0x7c9f8c) },
  { part: white, material: finish('neon-paramount-white', 0xe4ebe6) },
  { part: rock, material: finish('neon-hard-rock', 0xe0602e) },
], { bearing: 29, osm: 'way/266149373', height: 138.9 }, 6500)
