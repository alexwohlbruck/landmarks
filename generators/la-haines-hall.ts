/**
 * Haines Hall (1929, George W. Kelham), UCLA, Westwood — original
 * procedural geometry, CC0-1.0.
 *
 *   bun generators/la-haines-hall.ts
 *
 * Uses the kit in la-kerckhoff-hall.ts (arcades, arch rings, gabled roofs).
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the outline is square to
 * the compass within 0.3°). Origin at the OSM outline's area centroid
 * (-118.441239, 34.072898), on the lowest ground under the footprint:
 * 135.5 m NAVD88 at the south-west corner (USGS 3DEP); the ground rises
 * about 1.2 m to the north.
 *
 * Romanesque Revival in red brick banded with cast stone, an E in plan:
 * two gabled four-storey blocks (south and north) joined by a flat-roofed
 * east range, with a low hipped lecture wing between them on the west, so
 * two courts open to the west. The south front has seven bays, each a
 * relieving arch of stone voussoirs with a roundel over a pair of arched
 * windows, a row of fourteen arched windows above, a corbel-table frieze
 * under red tile eaves, and a stone-striped base. The east gables each hold
 * a third-floor loggia of three round arches on slender stone columns, with a rose
 * window in the gable. The striped base, the relieving arches, the tile
 * gables and the loggias are the identity.
 *
 * Evidence
 * - Plan: OSM way/422876570 (building=university, height 21.3; LA County
 *   bld_id 428057849308).
 * - Heights: USGS_LPC_CA_LosAngeles_2016_LAS_2018 (2016 flight), 0.5 m
 *   grid, over the 135.5 m ground: south and north blocks eaves 17.7–17.9
 *   and ridges 21.4–21.5 (ridges east–west, the same height right to the
 *   gable walls, so gabled, not hipped), east range flat at 15.8 with a
 *   16.7 parapet, its tile-roofed penthouse 18.4, the lecture wing 7.6–8.0,
 *   the low strip north of the north block 12.0.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   h1 "2019 UCLA Haines Hall 1.jpg" (Beyond My Ken, CC BY-SA 4.0) — an
 *      entrance bay, the stone striping and the corbel table;
 *   h2 "2019 UCLA Haines Hall 2.jpg" (Beyond My Ken, CC BY-SA 4.0) — the
 *      south-east corner: the east gable and its loggia, the east range;
 *   h3 "2019 UCLA Royce Hall and Haines Hall.jpg" (Beyond My Ken, CC BY-SA
 *      4.0) — the whole south front from the south-east, beside Royce;
 *   USGS NAIP for the tile roofs and the east range's flat grey roof.
 * - Colour: Haines and Royce share their brick, stone and tile; in h3,
 *   lit alike, Haines's brick samples #c69b73 against Royce's #bf9a74, so
 *   the model takes la-royce-hall's colours (brick #c48b78, stone #e8d8bd,
 *   the palette's terracotta).
 *
 * Estimated: storey heights and window sizes (scaled from h3 against the
 * lidar eaves), the loggia (8.6 m wide, 2.5 m deep, its floor 9.0 m up and
 * its crowns 13.8 m, scaled in h2 against the 17.8 m eave), the number
 * of bays on the faces no photo shows squarely.
 * Doubts: no licensed photo shows the west and north sides or the courts:
 * they carry the south front's pattern, and the west gables are drawn
 * without loggias. NAIP (later than the lidar) shows a paler roof over the
 * east ends of the blocks; the lidar shows the same pitched profile there,
 * so the tile roof runs to the east gables. The low strip along the north
 * front is flat-roofed from lidar alone.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, prism, cap, archPanel, panel, hipRoof, band, save, wallLen, onWall } from './la-getty-center'
import { arcade, archRing, disc, gableRoof, wallBands, faces, block, wallNormal } from './la-kerckhoff-hall'

const brick = new Part(), stone = new Part(), tile = new Part(), roof = new Part(), win = new Part(), door = new Part()

const EAVE = 17.8, RIDGE = 21.45, ER_TOP = 15.8
/** the striped base: a stone plinth, then stone bands to the springing of the relieving arches */
const STRIPES: [number, number][] = [[0, 1.3], [2.05, 2.5], [3.3, 3.75], [4.55, 5.0], [5.8, 6.25], [7.05, 7.5]]

/**
 * The Haines bay pattern on wall a→b between s0 and s1: ground windows in
 * pairs, a stone relieving arch with a roundel over two arched windows,
 * and two arched windows above.
 */
function bays(a: XY, b: XY, s0: number, s1: number, n: number, o: { top?: number; entrance?: number; skip?: number[] } = {}) {
  const bay = (s1 - s0) / n, k3 = o.top ?? 0, w = Math.min(1.45, bay * 0.26)
  for (let k = 0; k < n; k++) {
    if (o.skip?.includes(k)) continue
    const c = s0 + bay * (k + 0.5)
    if (k !== o.entrance) for (const d of [-1, 1]) panel(win, a, b, c + d * 0.95 - w / 2, c + d * 0.95 + w / 2, 1.9, 3.8, 0.06)
    const R = Math.min(2.5, bay * 0.45)
    archRing(stone, a, b, c, R - 0.45, R, 8.3, 0.04, 8)
    disc(stone, a, b, c, 8.3 + (R - 0.45) * 0.62, 0.4, 0.05, 8)
    for (const d of [-1, 1]) archPanel(win, a, b, c + d * R * 0.42 - w / 2, c + d * R * 0.42 + w / 2, 5.9, 8.75, 0.06)
    for (const d of [-1, 1]) archPanel(win, a, b, c + d * 0.95 - w / 2, c + d * 0.95 + w / 2, 11.6 - k3, 15.0 - k3 * 1.4, 0.06)
  }
}

/** A gabled block: brick walls to the eave, stone stripes, a corbel-table frieze, a tile roof. */
function gabledBlock(x0: number, y0: number, x1: number, y1: number, loggia: boolean) {
  const f = faces(x0, y0, x1, y1), Ly = y1 - y0, c = Ly / 2, LW = 8.6, LD = 2.5, Z0 = 9.0, Z1 = 14.4
  if (loggia) {
    // walls with a two-storey notch in the east gable for the loggia
    prism(brick, null, rect(x0, y0, x1, y1), 0, Z0, { corner: 0.25, bevel: 0 })
    const notched: XY[] = [[x0, y0], [x1, y0], [x1, y0 + c - LW / 2], [x1 - LD, y0 + c - LW / 2], [x1 - LD, y0 + c + LW / 2], [x1, y0 + c + LW / 2], [x1, y1], [x0, y1]]
    prism(brick, null, notched, Z0, Z1, { corner: 0.25, bevel: 0 })
    prism(brick, null, rect(x0, y0, x1, y1), Z1, EAVE, { corner: 0.25, bevel: 0, bottom: stone })
    const a: XY = [x1, y0 + c - LW / 2], b: XY = [x1, y0 + c + LW / 2]
    const W = 2.5, CR = 13.8, bay = LW / 3
    arcade(brick, a, b, { s0: 0, s1: LW, n: 3, w: W, z0: Z0 - 0.15, zs: Z0, crown: CR, z1: Z1, kind: 'round', t: 0.55, L: LD, back: win, floor: true })
    // stone columns: the pier fronts, capitals and the arch rings
    for (let k = 0; k <= 3; k++) {
      const sc = bay * k, h = (bay - W) / 2
      panel(stone, a, b, sc - h, sc + h, Z0, CR - W / 2, 0.03)
      panel(stone, a, b, sc - h - 0.12, sc + h + 0.12, CR - W / 2 - 0.35, CR - W / 2, 0.06)
    }
    for (let k = 0; k < 3; k++) archRing(stone, a, b, bay * (k + 0.5), W / 2, W / 2 + 0.32, CR - W / 2, 0.03, 8)
    // the loggia's stone frame: a band at its floor and over its arches
    panel(stone, a, b, -0.3, LW + 0.3, Z0 - 0.5, Z0, 0.06)
    panel(stone, a, b, -0.3, LW + 0.3, Z1 - 0.35, Z1 + 0.1, 0.06)
  } else prism(brick, null, rect(x0, y0, x1, y1), 0, EAVE, { corner: 0.25, bevel: 0 })
  cap(brick, rect(x0, y0, x1, y1), EAVE)
  gableRoof(tile, brick, x0, y0, x1, y1, EAVE, RIDGE - EAVE, 0.7)
  // the corbel table follows the gables' rakes
  for (const k of ['E', 'W'] as const) {
    const [ga, gb] = f[k], L = wallLen(ga, gb), n = wallNormal(ga, gb), rise = RIDGE - EAVE
    for (const [s0, s1, z0, z1] of [[0, L / 2, EAVE, RIDGE], [L / 2, L, RIDGE, EAVE]]) {
      const P = (s: number, z: number) => onWall(ga, gb, s, z, 0.08)
      const A = P(s0, z0 - 0.8), B = P(s1, z1 - 0.8), C = P(s1, z1 - 0.05), D = P(s0, z0 - 0.05)
      stone.tri(A, B, C, undefined, undefined, undefined, [n, n, n])
      stone.tri(A, C, D, undefined, undefined, undefined, [n, n, n])
    }
    void rise
  }
  band(stone, rect(x0, y0, x1, y1), EAVE - 0.95, EAVE - 0.15, 0.22)
  // stripes, kept off the loggia
  for (const k of ['S', 'N', 'W'] as const) wallBands(stone, f[k][0], f[k][1], STRIPES)
  wallBands(stone, f.E[0], f.E[1], STRIPES.filter(([z]) => z < Z0 || !loggia), [])
  if (loggia) wallBands(stone, f.E[0], f.E[1], STRIPES.filter(([z]) => z >= Z0), [[c - LW / 2 - 0.3, c + LW / 2 + 0.3]])
  // gable ends: side bays (and, on the west, a centre bay), a rose window
  for (const k of ['E', 'W'] as const) {
    const [a, b] = f[k], L = wallLen(a, b)
    // the gables carry single stacks of windows, no relieving arches (h2)
    const stack = (c: number, top = true) => {
      panel(win, a, b, c - 0.75, c + 0.75, 1.9, 4.4, 0.06)
      archPanel(win, a, b, c - 0.75, c + 0.75, 6.0, 10.2, 0.06)
      archPanel(win, a, b, c - 0.7, c + 0.7, 11.6, 15.2, 0.06)
      if (top) archPanel(win, a, b, c - 0.6, c + 0.6, EAVE - 0.6, EAVE + 1.1, 0.06)
    }
    const side = (L - LW) / 4 - 0.15
    if (k === 'E' && loggia) {
      for (const c of [side, L - side]) stack(c)
      for (const d of [-1, 1]) {
        panel(win, a, b, L / 2 + d * 1.6 - 0.7, L / 2 + d * 1.6 + 0.7, 1.9, 4.4, 0.06)
        archPanel(win, a, b, L / 2 + d * 1.6 - 0.7, L / 2 + d * 1.6 + 0.7, 5.6, 8.2, 0.06)
      }
    } else for (const c of [side, L / 2, L - side]) stack(c, c !== L / 2)
    disc(stone, a, b, L / 2, EAVE + 1.25, 1.25, 0.04, 12)
    disc(win, a, b, L / 2, EAVE + 1.25, 0.95, 0.07, 12)
  }
}

// ---------- the blocks ----------
gabledBlock(-19.5, -44.3, 19.4, -26.3, true)
gabledBlock(-19.1, 23.4, 19.6, 41.4, true)

// south front: seven bays, the entrance in the middle
{
  const [a, b] = faces(-19.5, -44.3, 19.4, -26.3).S, L = wallLen(a, b)
  bays(a, b, 0, L, 7, { entrance: 3 })
  const c = L * 0.5 - 19.5
  prism(stone, stone, rect(c - 1.75, -44.75, c + 1.75, -44.2), 0, 5.6, { corner: 0.12, bevel: 0.12 })
  panel(door, [c - 1.75, -44.75], [c + 1.75, -44.75], 0.75, 2.75, 1.4, 4.4, 0.04)
}
// the south block's court side and east tip
{
  const [a, b] = faces(-19.5, -44.3, 19.4, -26.3).N // s runs west from x 19.4
  bays(a, b, 22.7, 38.9, 3)
}
// the north block: the court side, and the north front above the low strip
{
  const f = faces(-19.1, 23.4, 19.6, 41.4)
  bays(f.S[0], f.S[1], 0, 15.8, 3)
  const [a, b] = f.N, L = wallLen(a, b)
  for (let k = 0; k < 14; k++) {
    const c = (L / 14) * (k + 0.5)
    archPanel(win, a, b, c - 0.72, c + 0.72, 13.0, 15.6, 0.06)
  }
}
// the low strip along the north front
{
  block(brick, roof, rect(-15.9, 41.35, 16.3, 44.3), 0, 12.0)
  band(stone, rect(-15.9, 41.35, 16.3, 44.3), 11.2, 12.0, 0.12)
  const f = faces(-15.9, 41.35, 16.3, 44.3)
  wallBands(stone, f.N[0], f.N[1], STRIPES.slice(0, 4))
  const [a, b] = f.N, L = wallLen(a, b)
  for (let k = 0; k < 7; k++) {
    const c = (L / 7) * (k + 0.5)
    for (const d of [-1, 1]) {
      panel(win, a, b, c + d * 1.0 - 0.7, c + d * 1.0 + 0.7, 1.9, 3.8, 0.06)
      archPanel(win, a, b, c + d * 1.0 - 0.7, c + d * 1.0 + 0.7, 5.6, 9.6, 0.06)
    }
  }
}

// ---------- the east range: flat, parapeted, three storeys ----------
{
  const X0 = -3.2, X1 = 16.5, Y0 = -26.2, Y1 = 23.3
  prism(brick, roof, rect(X0, Y0, X1, Y1), 0, ER_TOP + 0.9, { corner: 0.2, bevel: 0.15 })
  band(stone, rect(X0, Y0, X1, Y1), ER_TOP - 0.7, ER_TOP + 0.1, 0.2)
  const f = faces(X0, Y0, X1, Y1)
  wallBands(stone, f.E[0], f.E[1], STRIPES)
  wallBands(stone, f.W[0], f.W[1], STRIPES, [[14.0, 35.7]])
  bays(f.E[0], f.E[1], 0, wallLen(...f.E), 9, { top: 0.9, entrance: 4 })
  const [ea, eb] = f.E, c = wallLen(ea, eb) / 2
  prism(stone, stone, rect(X1 - 0.05, Y0 + c - 1.5, X1 + 0.45, Y0 + c + 1.5), 0, 5.0, { corner: 0.1, bevel: 0.1 })
  panel(door, [X1 + 0.45, Y0 + c - 1.5], [X1 + 0.45, Y0 + c + 1.5], 0.7, 2.3, 1.2, 4.0, 0.04)
  bays(f.W[0], f.W[1], 0, 14.0, 3, { top: 0.9 })
  bays(f.W[0], f.W[1], 35.7, 49.5, 3, { top: 0.9 })
  // the tile-roofed penthouse
  prism(brick, null, rect(1.5, 17.0, 6.5, 22.5), ER_TOP, 17.7, { corner: 0.15, bevel: 0 })
  hipRoof(tile, rect(1.5, 17.0, 6.5, 22.5), 17.7, 1.0, { eave: 0.35 })
}

// ---------- the lecture wing on the west: low, hipped, tall arched windows ----------
{
  const ring: XY[] = [[-3.3, -12.5], [-3.3, 9.3], [-20.9, 9.2], [-23.7, 4.1], [-26.9, 4.0], [-26.8, -7.3], [-23.6, -7.3], [-21.0, -12.5]]
  prism(brick, tile, ring, 0, 6.9, { corner: 0.25, bevel: 0 })
  band(stone, ring, 6.2, 6.8, 0.15)
  hipRoof(tile, rect(-21.0, -12.5, -3.3, 9.3), 6.9, 1.0, { eave: 0.5 })
  hipRoof(tile, rect(-26.9, -7.3, -20.5, 4.0), 6.9, 0.9, { eave: 0.5 })
  const S: [XY, XY] = [[-21.0, -12.5], [-3.3, -12.5]], N: [XY, XY] = [[-3.3, 9.3], [-20.9, 9.2]], W: [XY, XY] = [[-26.9, 4.0], [-26.8, -7.3]]
  for (const [a, b] of [S, N]) {
    wallBands(stone, a, b, STRIPES.slice(0, 3))
    const L = wallLen(a, b)
    for (let k = 0; k < 5; k++) { const c = (L / 5) * (k + 0.5); archPanel(win, a, b, c - 0.8, c + 0.8, 1.9, 5.5, 0.06) }
  }
  wallBands(stone, W[0], W[1], STRIPES.slice(0, 3))
  for (const c of [2.8, 5.65, 8.5]) archPanel(win, W[0], W[1], c - 0.8, c + 0.8, 1.9, 5.5, 0.06)
}

save('la-haines-hall', 'Haines Hall', [
  { part: brick, material: finish('haines-brick', 0xc48b78) },
  { part: stone, material: finish('haines-stone', 0xe8d8bd) },
  { part: tile, material: PALETTE.terracotta },
  { part: roof, material: PALETTE.roof },
  { part: win, material: { ...PALETTE.window, color: 0x5f6870 } },
  { part: door, material: PALETTE.entrance },
], { bearing: 0, elevation: 0, height: 21.45, replaces: ['way/422876570'] }, 6500)
