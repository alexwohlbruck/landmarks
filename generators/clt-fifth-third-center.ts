/**
 * 201 North Tryon (1997, built as the IJL Financial Center, then Fifth
 * Third Center; Smallwood, Reynolds, Stewart, Stewart & Associates),
 * Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-fifth-third-center.ts
 *
 * Name: Wikipedia's article is now "201 North Tryon (Charlotte, North
 * Carolina)", "formally known as the IJL Financial Center and Fifth Third
 * Center": 447 ft / 136 m, 30 floors, completed 1997.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/498314236) on the lowest ground. Placed at
 * bearing 52.67, square to Uptown's grid (+y up North Tryon toward Sixth
 * Street). The tower itself is turned 45° to the grid: its plan is a
 * square standing on one corner, with its sides facing the compass points.
 *
 * Identity:
 *  - the diamond plan, its east and west corners notched;
 *  - a tall oval "lens" running through it from the north corner to the
 *    south corner, rising highest: beige stone with paired windows on its
 *    long sides, glass curtain wall at its pointed ends (Willamor's photo
 *    reads as a stone drum with glass edges; Short's shows a glass end);
 *  - the two stone halves either side of it, beige with paired windows in
 *    vertical strips, each stepping down at its rim, the west half taller
 *    than the east;
 *  - white rods along every rim of the crown (Chris Short's photo).
 *
 * Evidence:
 *  - OSM: outline way/498314236 (office, 136 m, 30 levels), parts
 *    way/1327048769 (131 m, the glass lens, drawn narrower than lidar
 *    shows it), way/1327048766 (8 m, the south podium) and way/1327048767
 *    (7 m, the north podium).
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid.
 *    Street 6.0 m above the box's lowest return; heights here from it.
 *    The diamond's corners at (-33, 5), (27, 5), (-3, 38), (-3, -28) in
 *    this frame; the lens is about 30 m wide; lens roof 125.9, its rim
 *    128.4, plant and rods inside to 137.5 m (published 136 m). West half
 *    121.3 m with a 3 m rim band at 113.6; east half 113 m with its rim at
 *    105.3. Podiums 7-10 m (trees in the cells).
 *  - Photos (Wikimedia Commons, daylight):
 *    "Fifth Third Center December 2023.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    from North Tryon: the lens and the east half,
 *    https://commons.wikimedia.org/wiki/File:Fifth_Third_Center_December_2023.jpg);
 *    "Fifth Third Center Charlotte.jpg" (James Willamor, CC BY-SA 3.0,
 *    from the south: the stone and the notched corner,
 *    https://commons.wikimedia.org/wiki/File:Fifth_Third_Center_Charlotte.jpg);
 *    "Fifth Third Center (Charlotte) top.jpg" (Chris Short, CC BY-SA 2.0,
 *    the crown's steps and rods,
 *    https://commons.wikimedia.org/wiki/File:Fifth_Third_Center_(Charlotte)_top.jpg).
 *    No commercial imagery or 3D tiles; no look-only sources.
 *
 * Estimated: the lens as an ellipse (30 x 66 m) clipped to the diamond;
 * the notches (3 m deep, from OSM); window strips three storeys high at
 * 4 m a storey, 1.8 m wide, one per 3.4 m bay, so the stone piers read as wide as in
 * the photos; the oval's glass ends where it is more than 0.88 of its
 * half-length from the middle; the rods (0.45 m, 4.5 m tall, every
 * 6 m; on the oval's rim 8.2 m, so their tops reach the published
 * 136 m and lidar's highest returns); the plant box's plan. Colours: beige stone and blue-grey glass
 * from the daylight photos, pulled to the palette's lightness.
 *
 * Doubts: the photos show the stone halves stepping two or three times at
 * the rim, a bay at a time near the corners; lidar resolves one step, which
 * is what is drawn. Where the oval's stone gives way to glass is estimated. The lens's
 * curved top edge is drawn flat; its curve in the photos is the ellipse
 * seen in perspective. The podiums are drawn as plain boxes; the north
 * podium stops 0.8 m short of its OSM north edge, which it shares with the
 * separate building way/1181405203.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { area, bays, cap, panel, parapetRoof, rect, rows, save, walls, type XY } from './chi-aon-center'

const BEARING = 52.67
const ANCHOR: [number, number] = [35.2285785, -80.8418303]

const stoneP = new Part(), win = new Part(), glass = new Part(), roof = new Part(), rods = new Part()

const CX = -3, CY = 5, HX = 30, HY = 33, NOTCH = 3
const LENS = 125.9, LENS_RIM = 128.4, WEST = 121.3, WEST_RIM = 113.6, EAST = 113, EAST_RIM = 105.3
const FLOOR = 4

const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
/** Clip a ring by the half-plane f(p) ≥ 0. */
function clip(ring: XY[], f: (p: XY) => number): XY[] {
  const out: XY[] = []
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  })
  return out.filter((p, i) => { const q = out[(i + 1) % out.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
}

// The diamond, counter-clockwise from the east corner, with V notches at
// the east and west corners.
const E: XY = [CX + HX, CY], N: XY = [CX, CY + HY], W: XY = [CX - HX, CY], S: XY = [CX, CY - HY]
const along = (a: XY, b: XY, d: number): XY => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * d / L, a[1] + (b[1] - a[1]) * d / L] }
const diamond: XY[] = [
  [E[0] - NOTCH, E[1]], along(E, N, 4.2), N, along(W, N, 4.2), [W[0] + NOTCH, W[1]], along(W, S, 4.2), S, along(E, S, 4.2),
]

// --- The stone halves, each with its rim band and the higher inner tier.
for (const side of [-1, 1]) {
  const half = ccw(clip(diamond, p => side * (p[0] - CX)))
  const [rim, top] = side < 0 ? [WEST_RIM, WEST] : [EAST_RIM, EAST]
  walls(stoneP, half, 0, rim)
  cap(roof, half, rim)
  const tier = ccw(clip(diamond.map(([x, y]) => [CX + (x - CX) * (1 - 3.2 / HX), CY + (y - CY) * (1 - 3.2 / HY)] as XY), p => side * (p[0] - CX)))
  walls(stoneP, tier, rim, top - 0.5)
  parapetRoof(stoneP, roof, tier, top - 0.5, 0.4, 0.6)
  // window strips, two storeys a panel, on the outer faces only
  const groups = rows(6, rim - 1, Math.round((rim - 7) / (3 * FLOOR)), 1.3)
  bays(win, half, groups, { bay: 1.8, gap: 1.6, end: 1.2, minLen: 5 })
  bays(win, tier, rows(rim + 0.8, top - 1.5, 1, 0.6), { bay: 1.8, gap: 1.6, end: 1.2, minLen: 5 })
  // rods on the rim band and the tier
  for (const [ring, z] of [[half, rim], [tier, top]] as [XY[], number][]) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (Math.abs(a[0] - CX) < 0.1 && Math.abs(b[0] - CX) < 0.1) continue // the cut along the lens
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
      for (let s = 3; s < L - 1.5; s += 6) rod([a[0] + u[0] * s - u[1] * 0.3, a[1] + u[1] * s + u[0] * 0.3], z)
    }
  }
}

/** Window bays on the single wall a→b (as `bays` does for a whole ring). */
function edgeBays(p: Part, a: XY, b: XY, rs: [number, number][], bay: number, gap: number, end: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), use = L - 2 * end
  if (use < bay * 0.6) return
  const k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
  for (let q = 0; q < k; q++) for (const [z0, z1] of rs) panel(p, a, b, end + q * (w + gap), end + q * (w + gap) + w, z0, z1)
}

function rod(p: XY, z: number, h = 4.5) {
  const R: XY[] = rect(p[0] - 0.22, p[1] - 0.22, p[0] + 0.22, p[1] + 0.22)
  walls(rods, R, z - 0.6, z + h)
  cap(rods, R, z + h)
}

// --- The glass lens: an ellipse clipped to the diamond.
const ellipse: XY[] = Array.from({ length: 28 }, (_, i) => {
  const t = (i / 28) * 2 * Math.PI
  return [CX - 0.5 + 15 * Math.cos(t), CY + (HY + 2) * Math.sin(t)] as XY
})
const lens = ccw(ellipse)
const lensClipped = ccw(clip(clip(clip(clip(lens,
  p => 1 - (p[0] - CX) / HX - (p[1] - CY) / HY),
  p => 1 + (p[0] - CX) / HX - (p[1] - CY) / HY),
  p => 1 + (p[0] - CX) / HX + (p[1] - CY) / HY),
  p => 1 - (p[0] - CX) / HX + (p[1] - CY) / HY))
walls(stoneP, lensClipped, 0, LENS_RIM)
parapetRoof(stoneP, roof, lensClipped, LENS_RIM, 0.5, LENS_RIM - LENS)
// The oval's pointed ends are glass curtain wall; its long sides are the
// same beige stone as the halves, with paired windows (Willamor's photo
// from the south shows the drum stone between glass ends).
{
  const glassRows = rows(0.5, LENS_RIM - 1, Math.round(LENS_RIM / (3 * FLOOR)), 0.5)
  const stoneRows = rows(6, LENS_RIM - 1.5, Math.round((LENS_RIM - 7) / (3 * FLOOR)), 1.3)
  for (let i = 0; i < lensClipped.length; i++) {
    const a = lensClipped[i], b = lensClipped[(i + 1) % lensClipped.length]
    const end = Math.abs((a[1] + b[1]) / 2 - CY) > 0.88 * HY
    if (end) edgeBays(glass, a, b, glassRows, 2.6, 0.3, 0.15)
    else edgeBays(win, a, b, stoneRows, 1.8, 1.6, 0.9)
  }
}
for (let i = 0; i < lensClipped.length; i += 1) rod(lensClipped[i], LENS_RIM, 8.2)
// plant inside the rim
{
  const P: XY[] = Array.from({ length: 16 }, (_, i) => {
    const t = (i / 16) * 2 * Math.PI
    return [CX - 0.5 + 8 * Math.cos(t), CY + 20 * Math.sin(t)] as XY
  })
  walls(roof, P, LENS, 132)
  cap(roof, P, 132)
}

// --- Podiums (OSM parts), plain stone with shopfronts.
const podiums: [XY[], number][] = [
  [[[-14.7, -18.6], [-18.8, -23.3], [-18.3, -27.9], [-16.6, -44.7], [-13.7, -44.4], [11.2, -41.4], [15.0, -40.9], [14.9, -39.2], [26.5, -38.0], [25.7, -32.2], [23.3, -25.6], [20.7, -20.6], [18.1, -17.0], [14.2, -13.1], [-1.3, -30.5]], 8],
  [[[12.0, 20.8], [27.4, 37.5], [27.4, 45.4], [-3.3, 42.7], [-6.7, 42.4], [-6.5, 37.2]], 7],
]
for (const [ring0, h] of podiums) {
  const ring = ccw(ring0)
  walls(stoneP, ring, 0, h)
  cap(roof, ring, h)
  bays(glass, ring, [[0.4, h - 2.2]], { bay: 4, gap: 1.2, end: 1, minLen: 6 })
}

if (import.meta.main) {
  await save('clt-fifth-third-center', '201 North Tryon', ANCHOR, BEARING, [
    { part: stoneP, material: finish('201-tryon-stone', 0xe2d3bd) },
    { part: win, material: { ...PALETTE.window, color: 0x6a8199 } },
    { part: glass, material: { ...PALETTE.window, name: 'window-2', color: 0x5e7489 } },
    { part: roof, material: PALETTE.roof },
    { part: rods, material: PALETTE.trim },
  ], 6500)
}
