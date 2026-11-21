/**
 * The Westin Charlotte (601 S College St, 2003, John Portman & Associates),
 * Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-westin.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/397372377) on the lowest ground. Placed at
 * bearing 49.2, square to Uptown's grid and to the hotel slab: the slab's long
 * faces look north-east (+y, Stonewall St side) and south-west (-y), its
 * ends north-west (-x) and south-east (+x, College St).
 *
 * Identity, in order:
 *  - a long, thin slab of blue glass, 25 storeys, drawn as big shifted glass
 *    rectangles outlined in white;
 *  - a pale stone shaft standing proud at the middle of each end, a pointed
 *    prow in plan, rising past the roof;
 *  - a white open frame crowning the slab and running out past its ends;
 *  - a two-storey band at storeys 14-15 where the glass stops short of the
 *    ends, opening dark notches beside the shafts;
 *  - a broad beige stone podium filling the block, with a rounded corner at
 *    College St and Brooklyn Village Avenue.
 *
 * Evidence:
 *  - OSM: outline way/397372377 (94 m); parts way/1351487376 (slab 0-52 m),
 *    way/1351487383 (the recessed band 52-59, 8 m in from each end),
 *    way/1351487384 (slab 59-87), way/1351487377 and -378 (the end shafts, 94
 *    m, pointed prows 6.3 m wide projecting 4.3 m), way/1351487379 and
 *    -381 (13 m), way/1351487382 (20 m). Plan from these.
 *  - Published: 89.3 m, 25 floors, completed 2003 (CTBUH,
 *    https://www.skyscrapercenter.com/building/the-westin-charlotte/15524;
 *    Wikipedia "The Westin Charlotte").
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *    read in the frame. Ground around the hotel about 6 m above the crop's
 *    lowest return. Measured above that ground: shafts 93 m; the white frame
 *    86 m; the slab roof 80.5 m; the podium south-west of the slab (the
 *    outline's south part, which OSM has no part for) 16.5 m, flat; the
 *    strip on the north-east side 12 m; the north-west end 16.5 m. The
 *    south part settled as a flat podium roof by NAIP (below) and the lidar.
 *  - NAIP: USGS NAIP orthophoto (tools/usgs.py naip, 100 m half-size at the
 *    anchor, overlaid with the OSM outline): the outline's whole south part,
 *    south-west of the slab to the Blue Line, is one flat white roof with no
 *    change of level, so it is drawn as one 16.5 m podium (lidar); the darker
 *    roof terrace west of the outline's notch lies outside the outline and
 *    is not drawn. The Willamor photo shows the same low pale podium in
 *    front of the slab.
 *  - Terrain (Mapterhorn): the site rises about 6 m towards College St on
 *    the map (the podium partly read as ground); elevation 0.
 *  - Photos (Wikimedia Commons, daylight):
 *    "Uptown Charlotte Westin November 2023.jpg" (City Dweller 2, CC BY-SA
 *    4.0, from College St and Brooklyn Village Ave: the glass rectangles,
 *    the end shaft, the top frame, the curved podium,
 *    https://commons.wikimedia.org/wiki/File:Uptown_Charlotte_Westin_November_2023.jpg);
 *    "Westin Hotel, Charlotte, NC IMG 5236.JPG" (Billy Hathorn, public
 *    domain, the long face: both shafts, the frame, the recessed band,
 *    https://commons.wikimedia.org/wiki/File:Westin_Hotel,_Charlotte,_NC_IMG_5236.JPG);
 *    "Westin Charlotte.jpg" (James Willamor, CC BY-SA 3.0, the south-west
 *    long face square on over the low podium: one joint down the middle of
 *    each glass block, the band's glass carried across with open ends,
 *    https://commons.wikimedia.org/wiki/File:Westin_Charlotte.jpg).
 *    No commercial imagery. No look-only sources.
 *
 * Estimated: the pattern of white lines on the glass (one horizontal and one
 * vertical joint per tier, staggered like the photo, not traced line for
 * line); the frame's 2.5 m run past the ends and 1.2 m depth; the podium's
 * window bands. Doubts: the north-west end and the north-east face are seen
 * only in the Hathorn photo; the "Westin" lettering on the frame is left out.
 * The skybridge to the south-west (way/1189773794, 10-20 m) is a separate
 * building and is not drawn or replaced.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, onWall, panel, save, walls, inset, type XY } from './chi-aon-center'

const BEARING = 49.2
const ANCHOR: [number, number] = [35.2217308, -80.8473147]

const glass = new Part(), recess = new Part(), stone = new Part(), white = new Part(), roof = new Part()

const SX0 = -48.7, SX1 = 36.7, SY0 = 5.9, SY1 = 25.3
const ROOF = 80.5, FRAME = 86, SHAFT = 93, POD = 16.5, STRIP = 12.5
const BAND0 = 52, BAND1 = 59, BX0 = -41.0, BX1 = 29.2
const slab: XY[] = [[SX0, SY0], [SX1, SY0], [SX1, SY1], [SX0, SY1]]

// --- Podium: the outline, 16.5 m south-west of the slab's north-east face, 12.5 m beyond it.
const OUTLINE: XY[] = [[-22.1, 33.5], [-22.2, 37.5], [-31.0, 37.4], [-31.0, 33.6], [-44.0, 33.8], [-46.5, 33.5], [-49.2, 32.5], [-51.8, 30.7], [-53.7, 28.5], [-55.1, 26.0], [-55.6, 22.6], [-55.8, 0.1], [-51.0, 0.3], [-14.8, -0.2], [-14.9, -3.1], [-18.8, -3.1], [-18.6, -34.9], [-14.6, -34.7], [-14.6, -39.4], [-12.4, -39.4], [-12.2, -42.2], [-12.3, -46.7], [1.2, -46.7], [26.5, -46.7], [31.6, -47.0], [44.5, 32.7]]
/** Clip a ring to y < c (below) or y >= c (above). */
function clipY(r: XY[], c: number, below: boolean): XY[] {
  const inside = (p: XY) => (below ? p[1] <= c : p[1] >= c)
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) {
      const t = (c - a[1]) / (b[1] - a[1])
      out.push([a[0] + t * (b[0] - a[0]), c])
    }
  }
  return out.filter((p, i) => { const q = out[(i + 1) % out.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05 })
}
for (const [r, h] of [[clipY(OUTLINE, SY1, true), POD], [clipY(OUTLINE, SY1, false), STRIP]] as [XY[], number][]) {
  walls(stone, r, 0, h)
  cap(roof, r, h)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], { L } = onWall(a, b)
    if (L < 3) continue
    // skip the shared cut line between the two heights
    if (Math.abs(a[1] - SY1) < 0.01 && Math.abs(b[1] - SY1) < 0.01) continue
    panel(glass, a, b, 0.5, L - 0.5, 0.6, 4.4)
  }
}
// the wall where the 16.5 m podium rises over the 12.5 m strip faces north-east
{
  const r = clipY(OUTLINE, SY1, false)
  const xs = r.filter(p => Math.abs(p[1] - SY1) < 0.01).map(p => p[0])
  const x0 = Math.min(...xs), x1 = Math.max(...xs)
  stone.quad([x1, SY1, STRIP], [x0, SY1, STRIP], [x0, SY1, POD], [x1, SY1, POD])
}

// --- Slab: glass, white joints in staggered rectangles.
walls(glass, slab, POD - 1, BAND0)
walls(glass, slab, BAND1, ROOF)
{
  const band: XY[] = [[BX0, SY0 + 0.6], [BX1, SY0 + 0.6], [BX1, SY1 - 0.6], [BX0, SY1 - 0.6]]
  // the glass carries on across the middle (photos); only the band's ends, open past the glass, read dark
  walls(glass, band, BAND0, BAND1)
  for (const k of [1, 3]) panel(recess, band[k], band[(k + 1) % 4], 0, onWall(band[k], band[(k + 1) % 4]).L, BAND0, BAND1, 0.05)
  // the open ends of the band: floor and soffit
  for (const [x0, x1] of [[SX0, BX0], [BX1, SX1]]) {
    const R: XY[] = [[x0, SY0], [x1, SY0], [x1, SY1], [x0, SY1]]
    cap(roof, R, BAND0)
    cap(white, R, BAND1, false)
  }
  // the slab's edge at the band, a thin white lip
  for (let i = 0; i < 4; i++) {
    const a = slab[i], b = slab[(i + 1) % 4], { L } = onWall(a, b)
    panel(white, a, b, 0, L, BAND0 - 0.6, BAND0, 0.06)
    panel(white, a, b, 0, L, BAND1, BAND1 + 0.6, 0.06)
  }
}
// white joints: corner edges, tier lines, and staggered verticals
for (let i = 0; i < 4; i++) {
  const a = slab[i], b = slab[(i + 1) % 4], { L } = onWall(a, b), long = i % 2 === 0
  for (const [z0, z1] of [[POD, BAND0], [BAND1, ROOF]]) {
    panel(white, a, b, 0, 0.5, z0, z1, 0.06)
    panel(white, a, b, L - 0.5, L, z0, z1, 0.06)
  }
  if (!long) continue
  if (i === 0) {
    // south-west face (Williams photo): one joint down the middle of each block, three across the band
    for (const [z0, z1] of [[POD, BAND0], [BAND1, ROOF]]) panel(white, a, b, L / 2 - 0.25, L / 2 + 0.25, z0, z1, 0.06)
    for (const f of [0.3, 0.5, 0.7]) panel(white, a, b, f * L - 0.25, f * L + 0.25, BAND0, BAND1, 0.07)
    continue
  }
  const mid = (POD + BAND0) / 2, mid2 = (BAND1 + ROOF) / 2
  for (const z of [mid, 41, mid2]) panel(white, a, b, 0.5, L - 0.5, z - 0.2, z + 0.2, 0.06)
  const v: [number, number, number][] = [
    [0.30, POD, 24], [0.62, 24, 41], [0.38, 41, BAND0], [0.55, BAND1, mid2], [0.25, mid2, ROOF], [0.78, mid2, ROOF], [0.12, POD, 24],
  ]
  for (const [f, z0, z1] of v) {
    const s = (i === 0 ? f : 1 - f) * L
    panel(white, a, b, s - 0.2, s + 0.2, z0, z1, 0.06)
  }
}
cap(roof, slab, ROOF)

// --- The white crown frame: 80.5 to 86, out 2.5 m past each end.
{
  const O: XY[] = [[SX0 - 2.5, SY0 - 0.4], [SX1 + 2.5, SY0 - 0.4], [SX1 + 2.5, SY1 + 0.4], [SX0 - 2.5, SY1 + 0.4]]
  const I = inset(O, 1.2)
  walls(white, O, ROOF, FRAME)
  walls(white, [...I].reverse(), ROOF, FRAME)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    white.quad([O[i][0], O[i][1], FRAME], [O[j][0], O[j][1], FRAME], [I[j][0], I[j][1], FRAME], [I[i][0], I[i][1], FRAME])
    white.quad([O[j][0], O[j][1], ROOF], [O[i][0], O[i][1], ROOF], [I[i][0], I[i][1], ROOF], [I[j][0], I[j][1], ROOF])
  }
}

// --- End shafts: pale stone prows (way/1351487377-378), ground to 93 m.
for (const [end, dir] of [[SX1, 1], [SX0, -1]] as [number, number][]) {
  const yc = 15.0, h = 3.15, back = end - dir * 2.5, tip = end + dir * 4.3
  let r: XY[] = [[back, yc - h], [end, yc - h], [tip, yc], [end, yc + h], [back, yc + h]]
  if (dir < 0) r = r.map(([x, y]) => [x, 2 * yc - y] as XY)
  walls(stone, r, POD - 1, SHAFT - 1.2)
  // cap stepped out like the photos' beam ends
  const rc = r.map(([x, y]) => [x + (x === back ? 0 : dir * 0.5), y + Math.sign(y - yc) * 0.5] as XY)
  walls(stone, rc, SHAFT - 1.2, SHAFT)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    stone.quad([rc[j][0], rc[j][1], SHAFT - 1.2], [rc[i][0], rc[i][1], SHAFT - 1.2], [r[i][0], r[i][1], SHAFT - 1.2], [r[j][0], r[j][1], SHAFT - 1.2])
  }
  cap(roof, rc, SHAFT)
  // a slit window up the prow's two faces
  for (const k of [1, 2]) {
    const { L } = onWall(r[k], r[k + 1])
    panel(recess, r[k], r[k + 1], L * 0.35, L * 0.65, POD + 2, ROOF - 2, 0.05)
  }
}

if (import.meta.main) {
  await save('clt-westin', 'The Westin Charlotte', ANCHOR, BEARING, [
    { part: glass, material: { ...PALETTE.window, color: 0x7f9fc2 } },
    { part: recess, material: windowVariant(2, 0x5a6f84) },
    { part: stone, material: finish('westin-stone', 0xddd2c1) },
    { part: white, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
  ])
}
