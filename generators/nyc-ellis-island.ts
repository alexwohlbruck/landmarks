/**
 * Ellis Island Main Building (National Museum of Immigration) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-ellis-island.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. The front, with
 * the three great arches and the entrance canopy, faces model south (true
 * bearing ~225°, towards the ferry slip). Placed at bearing 44.5°, the
 * outline's long walls. Anchor: area centroid of the OSM outline
 * way/95161971.
 *
 * Evidence
 * - OSM way/95161971 (outline, 118 × 66 m: the wings, the front recessed
 *   between the towers, the rear annex; 3 levels, roof #946e48) and its
 *   parts 1177355003/004 (two glass hipped skylights on the west wing).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), in the model frame
 *   (/tmp/city/nyc/work/nyc-ellis-island/bands.png), above the lowest
 *   ground (1.6 m NAVD88): the wings' flat roofs 18.2 m, parapets 19.5 m;
 *   the front and rear blocks between the towers 19.7 m; the Great Hall's
 *   clerestory x -30…30, y -15…5.5, walls to ~26 m under a red gabled
 *   roof, ridge 29 m along x, its gable ends at x = ±30; the four towers,
 *   8 × 8 m, at x ±(19…28), y -29…-21 and 12…20, domes to ~35 m and
 *   finials to 38.5–41 m; the rear annex 7.5 m; the canopy 17 m wide, 32 m long
 *   (y -25…-57), eaves ~5 m, ridge ~7.6 m.
 * - NAIP orthophoto (USGS, public domain): the hall's red tile roof, the
 *   wings' dark flat roofs and skylights, the canopy's glazed roof.
 * - Published: 1900, Boring & Tilton, French Renaissance Revival; red brick
 *   in Flemish bond with limestone trim; four towers with copper domes; the
 *   Great Hall (Registry Room) on the second floor behind three great
 *   arched windows; the red steel and glass entrance canopy reproduces the
 *   original's form (Wikipedia; NRHP 66000119; NPS).
 * - Photos, credits in /tmp/city/nyc/work/nyc-ellis-island/photos/credits.txt:
 *   the front and canopy (chensiyuan, CC BY-SA 4.0), from the south-west and
 *   west over the water (Jakub Hałun, CC BY 4.0), an aerial from the south
 *   (public domain), others by Simeon87, Dmckelvey4, Bohao Zhao.
 *
 * Estimated: storey heights and window counts (from the front photo scaled
 * to the lidar's 19.7 m cornice), the tower stages (limestone to the
 * cornice, the banded brick shaft to 29 m, the lantern to 31.6 m, the
 * onion dome to 35.8 m, the spire to 40.6 m within the lidar's 38.5–41 m), the front gables
 * (apex 23.5 m), the canopy's posts and roof, the rear and wing-end
 * windows (drawn like the front). The skylights on the wings are left as
 * flat roof.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel, circle } from './nyc-570-lexington'
import { archPanel, rectPanel, band, spread, block, dome } from './nyc-city-hall'

const brick = new Part(), stone = new Part(), win = new Part(), tile = new Part(), copper = new Part(), roof = new Part()

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const edges = (r: XY[]) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])

const BASE = 6.2, CORN = 19.7, WING = 18.2

/** Wing windows on a wall: arched windows in the limestone ground storey, two brick storeys above. */
function wingWindows(a: XY, b: XY, pitch = 4.3, margin = 2.5) {
  const n = Math.round((L(a, b) - 2 * margin) / pitch)
  if (n < 1) return
  for (const s of spread(margin, L(a, b) - margin, n)) {
    archPanel(win, a, b, s, 1.6, 1.3, 5.0, 0.06, 6)
    rectPanel(win, a, b, s, 1.5, 7.6, 11.0)
    rectPanel(win, a, b, s, 1.5, 12.8, 16.0)
  }
}

// --- The wings: brick over a limestone ground storey, flat roofs behind a parapet ---
for (const sx of [-1, 1]) {
  const r: XY[] = sx < 0 ? rect(-59.05, -28.8, -28.5, 20.8) : rect(28.5, -29.0, 58.8, 20.9)
  prism({ wall: brick, win: null, roof, ring: r, z0: 0, z1: WING + 1.3, facade: null, bevel: 0.35 })
  band(stone, r, 0, BASE, 0.25)
  band(stone, r, WING - 0.3, WING + 0.4, 0.45)
  band(stone, r, WING + 1.0, WING + 1.3, 0.2)
  for (const [a, b] of edges(r)) {
    // The wall the towers and hall stand against is hidden: skip the inner end.
    const inner = Math.abs(a[0] - b[0]) < 0.5 && Math.abs(Math.abs(a[0]) - 28.5) < 0.5
    if (!inner) wingWindows(a, b)
  }
  // Limestone quoins: a pier on each outer corner, a little proud of both faces.
  for (const [x, y] of r) if (Math.abs(x) > 40) {
    const x0 = x > 0 ? x - 2.0 : x - 0.15, y0 = y > 0 ? y - 2.0 : y - 0.15
    block(stone, x0, y0, x0 + 2.15, y0 + 2.15, BASE, WING)
  }
}

// --- The central block between the wings, to the 19.7 m cornice ---
const centre = rect(-28.5, -24.0, 28.5, 14.5)
prism({ wall: stone, win: null, roof, ring: centre, z0: 0, z1: CORN, facade: null, bevel: 0.3 })
band(stone, centre, CORN - 1.0, CORN, 0.6)
{
  // The front between the towers: three great arched windows over a rusticated base.
  const a: XY = [-19.5, -24.0], b: XY = [19.5, -24.0]
  for (const s of [6.8, 19.5, 32.2]) {
    archPanel(stone, a, b, s, 10.2, 1.0, 17.6, 0.25, 10) // the limestone arch surround
    archPanel(win, a, b, s, 8.4, 1.2, 16.6, 0.32, 10)
  }
  // Brick panels in the spandrels and over the arches.
  for (const s of [0.8, 13.15, 25.85, 38.2]) rectPanel(brick, a, b, s, s < 1 || s > 38 ? 1.4 : 2.3, 8, 15.5, 0.08)
  for (const s of spread(1.5, 37.5, 16)) rectPanel(win, a, b, s, 1.1, 17.4, 18.5, 0.08) // the attic's small windows
  // The rear: three tall arched windows of the hall.
  const c: XY = [19.5, 14.5], d: XY = [-19.5, 14.5]
  for (const s of [6.8, 19.5, 32.2]) archPanel(win, c, d, s, 6.5, 8.0, 17.0, 0.06, 10)
  for (const s of spread(1, 38, 8)) rectPanel(win, c, d, s, 1.6, 1.4, 5.0)
}
// Front and rear roofs: three gables each, a red tiled roof rising to the hall's clerestory.
for (const [y0, y1] of [[-24.0, -15.0], [14.5, 5.5]]) {
  const sgn = Math.sign(y1 - y0)
  for (const cx of [-12.7, 0, 12.7]) {
    const w = 5.6, apex = 24.6
    const A: V3 = [cx - w, y0, CORN], B: V3 = [cx + w, y0, CORN], P: V3 = [cx, y0, apex]
    const A1: V3 = [cx - w, y1, CORN], B1: V3 = [cx + w, y1, CORN], P1: V3 = [cx, y1, apex]
    // Gable face: a brick tympanum, edged in dark copper.
    if (sgn > 0) brick.tri(A, B, P); else brick.tri(B, A, P)
    // Roof planes.
    if (sgn > 0) { tile.quad(A, P, P1, A1); tile.quad(P, B, B1, P1) } else { tile.quad(A, A1, P1, P); tile.quad(P, P1, B1, B) }
    // Dark copper coping along the raking edges, standing just proud of the face.
    for (const [q0, q1] of [[A, P], [P, B]] as [V3, V3][]) {
      const d = -0.25 * sgn, t = 0.3
      const sec = (c: V3): V3[] => [[c[0], c[1] + d - t, c[2] - t], [c[0], c[1] + d + t, c[2] - t], [c[0], c[1] + d + t, c[2] + t], [c[0], c[1] + d - t, c[2] + t]]
      copper.sweep([sec(q0), sec(q1)])
    }
    // A ridge finial.
    block(copper, cx - 0.25, y0 - 0.25, cx + 0.25, y0 + 0.25, apex - 0.2, apex + 1.4)
  }
  // Flat roof strips between and beside the gables, slightly raised.
  const ya = Math.min(y0, y1), yb = Math.max(y0, y1)
  roof.quad([-28.5, ya, CORN + 0.05], [28.5, ya, CORN + 0.05], [28.5, yb, CORN + 0.05], [-28.5, yb, CORN + 0.05])
}

// --- The Great Hall's clerestory and its red gabled roof ---
{
  const HX = 29.6, HY0 = -15.0, HY1 = 5.5, EAVE = 23.6, RIDGE = 29.2, ym = (HY0 + HY1) / 2
  const hall = rect(-HX, HY0, HX, HY1)
  prism({ wall: brick, win: null, roof: null, ring: hall, z0: CORN, z1: EAVE, facade: null, bevel: 0.3 })
  band(stone, hall, EAVE - 0.6, EAVE, 0.4)
  for (const [a, b] of edges(hall)) {
    const len = L(a, b)
    if (len > 30) for (const s of spread(2, len - 2, 11)) rectPanel(win, a, b, s, 2.2, CORN + 1.0, EAVE - 1.2)
  }
  // Gable ends at x = ±HX: brick triangles.
  for (const sx of [-1, 1]) {
    const x = sx * HX
    const p0: V3 = [x, HY0, EAVE], p1: V3 = [x, HY1, EAVE], pk: V3 = [x, ym, RIDGE]
    if (sx > 0) brick.tri(p0, p1, pk); else brick.tri(p1, p0, pk)
  }
  const o = 0.6 // eaves overhang
  const e0: V3 = [-HX - o, HY0 - o, EAVE - 0.2], e1: V3 = [HX + o, HY0 - o, EAVE - 0.2]
  const e2: V3 = [HX + o, HY1 + o, EAVE - 0.2], e3: V3 = [-HX - o, HY1 + o, EAVE - 0.2]
  const r0: V3 = [-HX - o, ym, RIDGE + 0.2], r1: V3 = [HX + o, ym, RIDGE + 0.2]
  tile.quad(e0, e1, r1, r0); tile.quad(e2, e3, r0, r1)
  // Undersides of the overhang so the roof never shows a hole from below.
  tile.quad(e1, e0, [-HX - o, HY0 - o, EAVE - 0.21], [HX + o, HY0 - o, EAVE - 0.21])
  // Copper ridge cap and the small corner domes on the gables.
  block(copper, -HX - o, ym - 0.35, HX + o, ym + 0.35, RIDGE + 0.1, RIDGE + 0.6)
  for (const x of [-HX, HX]) for (const y of [HY0, HY1]) {
    block(stone, x - 0.8, y - 0.8, x + 0.8, y + 0.8, EAVE - 0.5, EAVE + 1.2)
    dome(copper, x, y, 0.8, EAVE + 1.2, 1.2, 10, 3)
  }
}

// --- The four corner towers: limestone to the cornice, then a tall banded brick shaft with
// arched openings, an octagonal lantern stage, an onion dome and a slender spire (lidar: tips
// 38.5–41 m, about as far above the 19.7 m cornice as the facade below it) ---
const SHAFT = 29.0, LANTERN = 31.6, ONION = 35.8, TIP = 40.6
for (const [cx, cy] of [[-23.5, -25.0], [23.6, -25.0], [-23.5, 15.8], [23.6, 15.8]] as XY[]) {
  const h = 4.1
  const t = rect(cx - h, cy - h, cx + h, cy + h)
  prism({ wall: stone, win: null, roof: null, ring: t, z0: 0, z1: CORN, facade: null, bevel: 0.3 })
  band(stone, t, CORN - 1.0, CORN, 0.6)
  for (const [a, b] of edges(t)) {
    rectPanel(brick, a, b, h, 4.6, BASE + 0.8, CORN - 2.2, 0.06)
    rectPanel(win, a, b, h, 1.3, 9.0, 11.6, 0.1)
    rectPanel(win, a, b, h, 1.3, 13.6, 16.2, 0.1)
    rectPanel(win, a, b, h, 1.3, 2.0, 4.6, 0.06)
  }
  // The shaft above the cornice: brick banded in limestone, a tall round-arched opening on each face.
  const sh = 3.7, st = rect(cx - sh, cy - sh, cx + sh, cy + sh)
  prism({ wall: brick, win: null, roof: null, ring: st, z0: CORN, z1: SHAFT, facade: null, bevel: 0.3 })
  for (const z of [21.0, 23.2, 25.4]) band(stone, st, z, z + 0.7, 0.08)
  band(stone, st, SHAFT - 0.9, SHAFT, 0.45)
  for (const [a, b] of edges(st)) {
    archPanel(stone, a, b, sh, 2.9, 20.6, 27.9, 0.1, 8)
    archPanel(win, a, b, sh, 2.0, 21.0, 27.4, 0.16, 8)
  }
  // Lantern stage: an octagon with small arched openings and a cornice.
  const oct = (r: number, z: number): V3[] => circle(cx, cy, r, 8, Math.PI / 8).map(([x, y]) => [x, y, z] as V3)
  stone.loft([oct(3.0, SHAFT), oct(3.0, LANTERN - 0.5)])
  stone.loft([oct(3.0, LANTERN - 0.5), oct(3.3, LANTERN - 0.1), oct(3.3, LANTERN), oct(3.0, LANTERN)])
  const o8 = circle(cx, cy, 3.0, 8, Math.PI / 8)
  for (let i = 0; i < 8; i++) { const a = o8[i], b = o8[(i + 1) % 8]; archPanel(win, a, b, L(a, b) / 2, 1.0, SHAFT + 0.4, LANTERN - 0.7, 0.05, 6) }
  // The onion dome, swelling past the lantern and drawing in to a neck.
  const ring = (r: number, z: number): V3[] => circle(cx, cy, r, 12).map(([x, y]) => [x, y, z] as V3)
  const prof: [number, number][] = [[2.9, LANTERN], [3.25, LANTERN + 0.8], [3.15, LANTERN + 1.7], [2.5, LANTERN + 2.7], [1.4, LANTERN + 3.5], [0.5, ONION]]
  copper.loft(prof.map(([r, z]) => ring(r, z)))
  // Lantern finial and the slender spire.
  copper.loft([ring(0.5, ONION), ring(0.55, ONION + 0.9), ring(0.3, ONION + 1.1), ring(0.05, TIP)])
}

// --- The rear annex, low, behind the hall ---
{
  const r = rect(-18.4, 14.5, 18.7, 37.1)
  prism({ wall: brick, win: null, roof, ring: r, z0: 0, z1: 7.5, facade: null, bevel: 0.3 })
  band(stone, r, 6.8, 7.5, 0.3)
  const [, E, N, W] = edges(r)
  for (const [a, b] of [E, N, W]) for (const s of spread(2, L(a, b) - 2, Math.round(L(a, b) / 4.5))) rectPanel(win, a, b, s, 1.5, 1.5, 5.2)
}

// --- The entrance canopy: red-painted steel on square piers, a gabled roof (y -24…-57) ---
{
  const X = 8.4, Y0 = -24.3, Y1 = -57.0, EAVE = 5.0, RIDGE = 7.6
  // Square stone piers with red steel posts, both sides.
  for (const y of spread(Y1, Y0, 6)) for (const sx of [-1, 1]) {
    const x = sx * (X - 0.6)
    block(stone, x - 0.5, y - 0.5, x + 0.5, y + 0.5, 0, 1.6)
    block(tile, x - 0.2, y - 0.2, x + 0.2, y + 0.2, 1.6, EAVE)
  }
  // Red eaves beams and the roof planes.
  for (const sx of [-1, 1]) block(tile, sx * X - 0.3, Y1, sx * X + 0.3, Y0, EAVE - 0.5, EAVE)
  const a0: V3 = [-X - 0.4, Y1, EAVE], a1: V3 = [-X - 0.4, Y0, EAVE], b0: V3 = [X + 0.4, Y1, EAVE], b1: V3 = [X + 0.4, Y0, EAVE]
  const r0: V3 = [0, Y1, RIDGE], r1: V3 = [0, Y0, RIDGE]
  // The roof reads as its red-painted steel frame from the map; glazing is left out.
  tile.quad(a1, a0, r0, r1); tile.quad(b0, b1, r1, r0)
  tile.quad(a0, a1, r1, r0); tile.quad(b1, b0, r0, r1) // both sides, so it reads from below too
  // Red rafters across the roof at each pier line, and the gable frame at the open end.
  const rafter = (p: V3, q: V3, n = 0.18) => {
    const sec = (c: V3): V3[] => [[c[0], c[1] - n, c[2]], [c[0], c[1] + n, c[2]], [c[0], c[1] + n, c[2] + 0.3], [c[0], c[1] - n, c[2] + 0.3]]
    tile.sweep([sec(p), sec(q)])
  }
  for (const y of spread(Y1, Y0, 6)) { rafter([-X - 0.4, y, EAVE + 0.05], [0, y, RIDGE + 0.05]); rafter([0, y, RIDGE + 0.05], [X + 0.4, y, EAVE + 0.05]) }
}

finishModel('Ellis Island Main Building', 'nyc-ellis-island', [
  { part: brick, material: finish('ellis-brick', 0xc98a78) },
  { part: stone, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: tile, material: PALETTE.terracotta },
  { part: copper, material: PALETTE.copper },
  { part: roof, material: PALETTE.roof },
], { bearing: 44.5, osm: 'way/95161971', height: 40.6 }, 6500)
