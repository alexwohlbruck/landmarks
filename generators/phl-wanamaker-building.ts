/**
 * Wanamaker Building (built 1902-11 as the John Wanamaker Store, D. H.
 * Burnham & Co.; Macy's from 2006 until it closed in March 2025; offices
 * above) — original procedural geometry, CC0-1.0.
 * bun generators/phl-wanamaker-building.ts [out.glb]
 *
 * Name: OSM way/198674659 carries addr:housename "The Wanamaker Building",
 * old_name "John Wanamaker Store; Macy's" and disused:shop=department_store
 * (the store is closed); the City's LI_BUILDING_FOOTPRINTS layer names it
 * "Wanamaker Building" (1301-25 Chestnut St), and the entablature over the
 * Penn Square entrance reads THE WANAMAKER BUILDING (Peetlesnumber1's
 * photos). Display name "Wanamaker Building".
 *
 * Frame: map frame turned to the Center City grid, bearing 9.3 (OSM sides
 * 9.5-9.6 / 99.5). +x east-south-east (Juniper St), +y north-north-east
 * (Market St), z up, metres. Origin = centroid of the OSM outline,
 * 39.951401, -75.162149, on the street (3.0 m above the lidar box's
 * ground_min, a subway stair). The site is flat. Elevation 0.
 *
 * Identity, in order: a whole city block of pale granite, 9 by 17 bays, a
 * flat-topped Florentine palazzo; the heavy projecting cornice; the
 * arcaded top storeys (tall round arches, one a bay, over a row of
 * round-headed windows); the giant engaged columns of the two-storey base;
 * from above, the Grand Court's glass skylight in the middle of the roof
 * and the two white hipped roofs over the north and south ends.
 *
 * Evidence
 *  - OSM: outline way/198674659 (78.4 x 149.7 m, height 82.2) and the
 *    parts way/785232307 (the same outline), /336681364 (the Grand Court
 *    roof), /336681365 and /336681366 (the north and south hipped roofs),
 *    /354994854 and /354994855 (roof structures). All replaced.
 *  - Lidar: USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown 2015), 1 m
 *    grid read in this frame. Above the street: the cornice/parapet 74.9
 *    all round; the roof 73.0; the north and south hipped roofs (x
 *    -24.6..23.9, |y| 44..65) eaves ~75, ridges 78.4-79.2; the Grand Court
 *    skylight (x -11..10, |y| < 17) ridge ~81; plant blocks either side of
 *    it ~81; two penthouses (x -8..1, |y| 24..37) to ~89.5.
 *  - City of Philadelphia LI_BUILDING_FOOTPRINTS: approx_hgt 267 ft (81 m,
 *    the roof structures).
 *  - Published (Wikipedia "Wanamaker's"; NRHP 78002459): 12 storeys,
 *    D. H. Burnham & Co., completed 1911, granite.
 *  - Photo-measured: bays from the postcard (NBY 6951) and Fred
 *    Cherrygarden's photo: 9 arches on the Market St front, 17 on the long
 *    sides (8.7-8.8 m bays). Heights of the stages from the postcard (a
 *    distant, nearly level view) and Daniel Case's corner photo: base and
 *    its entablature to 17.8; nine storeys of paired windows to 57.5; a
 *    storey of round-headed windows to 62; a belt; the tall arcade to 70;
 *    the cornice 71.6-74.9.
 *  - Estimated: column size and spacing (one at each pier), window widths,
 *    arch radii, the cornice's projection (1.5 m), the plant blocks' plan.
 *  - Colours: pale warm-grey granite (Daniel Case, Fred Cherrygarden),
 *    pulled to the palette's lightness; windows a dark neutral (city
 *    notes); the white membrane hipped roofs and the blue-grey court
 *    skylight from NAIP.
 *
 * Photos (EVIDENCE):
 *  - Wanamaker_Building,_Philadelphia,_PA.jpg, Daniel Case, CC BY-SA 4.0
 *    (from the north-west, by City Hall: Market St front and 13th St side)
 *    https://commons.wikimedia.org/wiki/File:Wanamaker_Building,_Philadelphia,_PA.jpg
 *  - Wanamaker_Building.jpg, Fred Cherrygarden, CC BY-SA 4.0 (a corner,
 *    looking up: arcade, cornice)
 *    https://commons.wikimedia.org/wiki/File:Wanamaker_Building.jpg
 *  - WanamakerBuilding5/6/7.JPG, Peetlesnumber1, CC BY-SA 3.0 (the
 *    Penn Square base: giant columns, entablature lettered THE WANAMAKER
 *    BUILDING)
 *    https://commons.wikimedia.org/wiki/File:WanamakerBuilding5.JPG
 *  - OBLIQUE VIEW, CHESTNUT STREET ELEVATION (HABS PA,51-PHILA,370-1), PD
 *    https://commons.wikimedia.org/wiki/File:OBLIQUE_VIEW,_CHESTNUT_STREET_ELEVATION_-_John_Wanamaker_Store,_Thirteenth_and_Chestnut_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA,51-PHILA,370-1.tif
 *  - John Wanamaker Building, Philadelphia, PA., Juniper and Market
 *    Streets (postcard, NBY 6951), public domain
 *    https://commons.wikimedia.org/wiki/File:John_Wanamaker_Building,_Philadelphia,_PA.,_Juniper_and_Market_Streets,_Architects_D.H._Burnham..._(NBY_6951).jpg
 *  - USGS NAIP orthophoto (public domain), the roof.
 *  No look-only sources; no commercial imagery.
 *
 * Night: the office windows above glow (`window`). The store closed in
 * March 2025, so the base's shop windows and entrances are a dark
 * non-glowing finish (`wanamaker-shopfront`). No licensed night photo was
 * found; the granite is not floodlit.
 *
 * Left out: the cornice's modillions and dentils, the attic's small
 * windows, the arcade's paired windows and colonnettes (each arch is one
 * panel), rustication, flagpoles, the eagle and lamps.
 *
 * Doubts: the Juniper St (east) side has no photo of its own (built like
 * the others, as the postcard shows its corner); the storey heights are
 * from perspective photos and a postcard; the roof plant's layout is from
 * lidar and NAIP only.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, onWall, panel, rect, save, walls, type XY } from './chi-aon-center'

const stone = new Part()
const trim = new Part()
const roof = new Part()
const win = new Part()
const glass = new Part()
const door = new Part() // the closed store's shopfronts and entrances

const HX = 39.2, HY = 74.8
const BODY = rect(-HX, -HY, HX, HY)
const BASE_TOP = 15.8, ENT_TOP = 17.8, SHAFT_TOP = 57.5, ARCH1_TOP = 62.0
const BELT0 = 62.4, BELT1 = 63.3, ARCADE_TOP = 70.4, CORNICE0 = 71.6, TOP = 74.9, ROOF = 73.0

const ST = (SHAFT_TOP - ENT_TOP) / 9
const SHAFT_ROWS: [number, number][] = [0, 2, 4, 6].map((k) => [ENT_TOP + k * ST + 1.4, ENT_TOP + (k + 2) * ST - 1.8] as [number, number])
SHAFT_ROWS.push([ENT_TOP + 8 * ST + 1.2, SHAFT_TOP - 1.0])

/** A projecting band round ring r, z0..z1, `out` beyond it. */
function band(p: Part, r: XY[], z0: number, z1: number, out: number) {
  const o = inset(r, -out)
  walls(p, o, z0, z1)
  walls(p, o, z1, z1, r)
  walls(p, r, z0, z0, o)
}

/** A round-headed panel on wall a→b centred at s, w wide, from z0 with the arch springing at zs. */
function archPanel(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zs: number, out = 0.05, seg = 10) {
  const { P } = onWall(a, b)
  const h = w / 2
  p.quad(P(s - h, z0, out), P(s + h, z0, out), P(s + h, zs, out), P(s - h, zs, out))
  for (let j = 0; j < seg; j++) {
    const t0 = (Math.PI * j) / seg, t1 = (Math.PI * (j + 1)) / seg
    p.tri(P(s, zs, out), P(s + h * Math.cos(t0), zs + h * Math.sin(t0), out), P(s + h * Math.cos(t1), zs + h * Math.sin(t1), out))
  }
}

/** An engaged half-column on wall a→b at s, radius r, z0..z1 (smooth-shaded). */
function column(p: Part, a: XY, b: XY, s: number, r: number, z0: number, z1: number, seg = 6) {
  const { P, u, n } = onWall(a, b)
  for (let k = 0; k < seg; k++) {
    const t0 = (Math.PI * k) / seg, t1 = (Math.PI * (k + 1)) / seg
    const pt = (t: number, z: number) => P(s - r * Math.cos(t), z, r * Math.sin(t))
    const nm = (t: number): V3 => [-u[0] * Math.cos(t) + n[0] * Math.sin(t), -u[1] * Math.cos(t) + n[1] * Math.sin(t), 0]
    p.tri(pt(t0, z0), pt(t1, z0), pt(t1, z1), undefined, undefined, undefined, [nm(t0), nm(t1), nm(t1)])
    p.tri(pt(t0, z0), pt(t1, z1), pt(t0, z1), undefined, undefined, undefined, [nm(t0), nm(t1), nm(t0)])
  }
  // square plinth and capital blocks
  for (const [za, zb, k] of [[z0, z0 + 1.0, 1.25], [z1 - 0.7, z1, 1.3]] as [number, number, number][]) {
    const w = r * k
    const q = (s0: number, s1: number, d0: number, d1: number) => {
      p.quad(P(s0, za, d1), P(s1, za, d1), P(s1, zb, d1), P(s0, zb, d1))
      p.quad(P(s0, za, d0), P(s0, za, d1), P(s0, zb, d1), P(s0, zb, d0))
      p.quad(P(s1, za, d1), P(s1, za, d0), P(s1, zb, d0), P(s1, zb, d1))
      p.quad(P(s0, zb, d1), P(s1, zb, d1), P(s1, zb, d0), P(s0, zb, d0))
    }
    q(s - w, s + w, 0, w)
  }
}

/** A hipped roof over rect (x0,y0,x1,y1) from z0 to a ridge at z1, ridge along the long side. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const along = y1 - y0 >= x1 - x0
  const half = (along ? x1 - x0 : y1 - y0) / 2
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const r0: V3 = along ? [cx, y0 + half, z1] : [x0 + half, cy, z1]
  const r1: V3 = along ? [cx, y1 - half, z1] : [x1 - half, cy, z1]
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (along) {
    p.tri(A, B, r0); p.tri(C, D, r1)
    p.quad(B, C, r1, r0); p.quad(D, A, r0, r1)
  } else {
    p.tri(B, C, r1); p.tri(D, A, r0)
    p.quad(A, B, r1, r0); p.quad(C, D, r0, r1)
  }
}

function build() {
  // ---- the block ----
  walls(stone, BODY, 0, CORNICE0)
  // base: slightly proud, with its entablature (the lettered frieze)
  const base = inset(BODY, -0.3)
  walls(stone, base, 0, BASE_TOP)
  walls(stone, base, BASE_TOP, BASE_TOP, BODY)
  band(trim, BODY, BASE_TOP, ENT_TOP, 0.75)
  band(trim, BODY, SHAFT_TOP - 0.2, SHAFT_TOP + 0.4, 0.3) // sill course under the arched storey
  band(trim, BODY, BELT0, BELT1, 0.45) // belt under the arcade
  // the cornice: a heavy projecting block with a bevelled top
  const co = inset(BODY, -1.5)
  walls(trim, BODY, CORNICE0, CORNICE0, co)
  walls(trim, co, CORNICE0, TOP - 0.5)
  walls(trim, co, TOP - 0.5, TOP, inset(co, 0.5))
  const lip = inset(co, 0.5), rin = inset(BODY, 0.6)
  walls(trim, lip, TOP, TOP, rin)
  walls(trim, rin.slice().reverse(), ROOF, TOP) // inner face of the parapet, facing the roof
  cap(roof, rin, ROOF)

  // ---- bays: 9 on the short fronts, 17 on the long sides ----
  for (let i = 0; i < 4; i++) {
    const a = BODY[i], b = BODY[(i + 1) % 4]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = L > 100 ? 17 : 9, step = L / n
    const ab = [inset(base, 0)[i], inset(base, 0)[(i + 1) % 4]] as [XY, XY]
    for (let k = 0; k < n; k++) {
      const c = step * (k + 0.5)
      // shaft: nine storeys of 4.41 m; the pair of windows in each bay as
      // one panel two storeys high, granite showing round it as piers and
      // spandrels (the facade is mostly wall in the photos)
      for (const [z0, z1] of SHAFT_ROWS) panel(win, a, b, c - 1.5, c + 1.5, z0, z1)
      // the storey of round-headed windows
      archPanel(win, a, b, c, 4.2, SHAFT_TOP + 0.9, ARCH1_TOP - 2.1)
      // the arcade: a tall round arch a bay
      archPanel(win, a, b, c, 5.6, BELT1 + 0.6, ARCADE_TOP - 2.8)
      // base: shop glass between the columns, entrances in the middle bay
      const mid = k === Math.floor(n / 2)
      // (shop windows, then the mezzanine's over a stone transom)
      panel(door, ab[0], ab[1], c - 2.9, c + 2.9, mid ? 0 : 1.0, 8.2)
      panel(door, ab[0], ab[1], c - 2.9, c + 2.9, 9.6, BASE_TOP - 1.6)
    }
    // giant engaged columns at every pier (not at the corners, which are
    // solid piers in the photos)
    for (let k = 1; k < n; k++) column(stone, ab[0], ab[1], step * k, 0.85, 0, BASE_TOP)
  }

  // ---- the roof (lidar, NAIP) ----
  // north and south: low white hipped roofs on short walls
  for (const [y0, y1] of [[44.0, 65.0], [-65.4, -44.4]]) {
    block(roof, null, rect(-24.5, y0, 23.8, y1), ROOF, 75.2, 0)
    hipRoof(trim, -24.5, y0, 23.8, y1, 75.2, 78.8)
  }
  // the Grand Court skylight, glass, on a low curb
  block(roof, null, rect(-10.8, -17.2, 9.6, 17.3), ROOF, 75.0, 0)
  hipRoof(glass, -10.8, -17.2, 9.6, 17.3, 75.0, 81.0)
  // plant blocks either side of the court and the two penthouses
  for (const r of [rect(-28, -20, -18, 22), rect(12, -20, 20.5, 22)]) block(roof, roof, r, ROOF, 80.5, 0.4)
  for (const [y0, y1] of [[24, 36.5], [-40, -24]]) block(roof, roof, rect(-8, y0, 1, y1), ROOF, 89.5, 0.4)

  return [
    { part: stone, material: finish('wanamaker-granite', 0xe2d8c8) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: { ...PALETTE.window, color: 0x596169 } },
    { part: glass, material: PALETTE.glass },
    { part: door, material: finish('wanamaker-shopfront', 0x565d64) },
  ]
}

if (import.meta.main) await save('phl-wanamaker-building', 'Wanamaker Building', [39.951401, -75.162149], 9.3, build())
