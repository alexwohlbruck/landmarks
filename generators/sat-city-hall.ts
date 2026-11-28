/**
 * San Antonio City Hall, in the middle of Military Plaza (Plaza de Armas),
 * San Antonio, Texas. Built 1888-1891 to designs by Otto Kramer, in cream
 * limestone, Italian Renaissance Revival; in 1927 its central clock tower,
 * mansard pavilions and corner turret were taken down and a fourth storey
 * added under a red-tile roof edge. This models the building as it stands:
 * the tower and turrets are gone (see the 1891 view under Look-only).
 * Original procedural geometry, CC0-1.0.   bun generators/sat-city-hall.ts
 *
 * Frame: bearing 0.5 (the OSM outline is square to 0.1 m in it). x east,
 * y north, z up, metres. Origin at the area centroid of OSM way/78601538
 * (-98.495125, 29.424599). The main entrance faces east, towards the
 * cathedral. The building is symmetric about both axes except the entrance
 * and the rooftop penthouse.
 *
 * Ground: the plaza round the building is flat (Mapterhorn 1.6-2.2 m in the
 * table), but a dry areaway runs along the walls: lidar ground 0.2-0.7 at
 * the west wall, and the map's terrain reads 0-0.9 all under the footprint.
 * y = 0 is that areaway floor; the plaza is at z 2.0, the raised ground floor
 * and the east door at 4.0. Heights below are lidar heights over its
 * ground_min, which is the same level. Elevation 0.
 *
 * Evidence
 * - OSM way/78601538 (building=civic, no parts, no height): x -13.2..13.2,
 *   y -20.1..20.1.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-city-hall/lidar.json): the main
 *   cornice ledge round the whole building at 20.7-20.9; the fourth storey
 *   set back about 1 m inside it, its tiled edge at 26.0-26.2 (drawn as a
 *   thin eave to 25.95 over walls to 25.5, as the photos show it) and the
 *   flat roof inside at 25.2-25.5; a rooftop penthouse x 3.9..8.9, y -0.5..16 at
 *   28.1-29.0.
 * - Published: Wikipedia "San Antonio City Hall"; Texas Historical
 *   Commission marker text (1888-1891, Otto Kramer; fourth floor 1927).
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "San Antonio July 2017 07 (City Hall).jpg" (Michael Barera, CC BY-SA
 *     4.0): the east front: the central entrance up a broad stair, the big
 *     round-arched window over it, corner pavilions with paired round-arched
 *     windows, single arched windows between, rectangular windows in the
 *     fourth storey, the red-tile roof edge and the penthouse behind it;
 *   "San Antonio City Hall.jpg" (Paul Sableman, CC BY 2.0): two sides from
 *     the south-west: the pavilions standing a little proud, the string
 *     courses, round-arched windows on the first and second floors and
 *     square-headed ones above, the heavy cornice under the fourth storey,
 *     the low tile roof edge; cream limestone.
 * - Look-only (not used for the shape): "East and north elevations - San
 *   Antonio City Hall ... HABS TEX,15-SANT,29-2" (HABS, public domain), a
 *   photograph of an 1890s view showing the lost tower and turret.
 *
 * Estimated: the storey heights (from the east photo, 21 px/m, and the
 * lidar cornice), the bay rhythm of the long sides (seven bays between the
 * pavilions) and the west and north sides, which are drawn like the east
 * and south without the entrance; the pavilions' projection (0.8 m, as the south-west photo shows it).
 *
 * Night: the stone is floodlit softly all round; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, offset, flat, report, writeGlb, type XY } from './sf-de-young'
import { onWall, rectPts, roundPts, block } from './sat-san-fernando-cathedral'

const stone = new Part(), trim = new Part(), tile = new Part(), roof = new Part(), win = new Part(), door = new Part()

const HX = 13.2, HY = 20.1, P = 7.0, D = 0.8
const PLAZA = 2.0, FLOOR = 4.0
const CORNICE0 = 19.7, CORNICE1 = 20.8, TOP4 = 25.5, EDGE = 25.95, ROOFZ = 25.3
const SET = 1.0

// the body: a rectangle whose middle of each side is recessed D behind the corner pavilions
const BODY: XY[] = [
  [-HX, -HY], [-HX + P, -HY], [-HX + P, -HY + D], [HX - P, -HY + D], [HX - P, -HY],
  [HX, -HY], [HX, -HY + P], [HX - D, -HY + P], [HX - D, HY - P], [HX, HY - P],
  [HX, HY], [HX - P, HY], [HX - P, HY - D], [-HX + P, HY - D], [-HX + P, HY],
  [-HX, HY], [-HX, HY - P], [-HX + D, HY - P], [-HX + D, -HY + P], [-HX, -HY + P],
]
prism(stone, BODY, 0, CORNICE0, null)
// rusticated base course up to the raised floor, and string courses
prism(stone, offset(BODY, 0.15), 0, FLOOR, stone, 0.1)
for (const z of [8.9, 14.6]) prism(trim, offset(BODY, 0.12), z, z + 0.4, trim, 0.08)
// the main cornice, a bold ledge all round
const RECT = (h: number, d: number): XY[] => [[-h, -d], [h, -d], [h, d], [-h, d]]
prism(trim, RECT(HX + 0.45, HY + 0.45), CORNICE0, CORNICE1, trim, 0.3)
// the fourth storey (1927), set back, with its own thin cornice and the red-tile edge over a flat roof
const F4 = RECT(HX - SET, HY - SET)
prism(stone, F4, CORNICE1, TOP4, null)
prism(trim, offset(F4, 0.2), TOP4 - 0.35, TOP4, null)
{
  // a thin tiled eave, 0.7 m deep, over the cornice: the walls dominate (review)
  const o = offset(F4, 0.7), i = offset(F4, -0.05)
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    tile.quad([...o[k], TOP4 - 0.1], [...o[j], TOP4 - 0.1], [...i[j], EDGE], [...i[k], EDGE])
    tile.quad([...o[j], TOP4 - 0.1], [...o[k], TOP4 - 0.1], [...o[k], TOP4 - 0.22], [...o[j], TOP4 - 0.22])
    tile.quad([...i[j], ROOFZ], [...i[k], ROOFZ], [...i[k], EDGE], [...i[j], EDGE])
  }
  flat(trim, o, TOP4 - 0.22, false)
  flat(roof, i, ROOFZ)
}
// the rooftop penthouse (lidar)
block(stone, 3.9, 8.9, -0.5, 16.0, ROOFZ, 28.8, 0.15, roof)

// ---- windows ----
type Face = { at: XY; n: XY; s: (x: number, y: number) => number }
const faces = {
  E: { at: [HX, 0], n: [1, 0], s: (_x: number, y: number) => y } as Face,
  W: { at: [-HX, 0], n: [-1, 0], s: (_x: number, y: number) => -y } as Face,
  N: { at: [0, HY], n: [0, 1], s: (x: number) => -x } as Face,
  S: { at: [0, -HY], n: [0, -1], s: (x: number) => x } as Face,
}
/** The face's plane pulled in by `inset` (the recessed middle, or the fourth storey). */
const plane = (f: Face, inset: number): XY => [f.at[0] - f.n[0] * inset, f.at[1] - f.n[1] * inset]

function bay(f: Face, s: number, inset: number, w: number, pair: boolean, entrance = false) {
  const at = plane(f, inset), xs = pair ? [s - w * 0.72, s + w * 0.72] : [s]
  for (const c of xs) {
    if (!entrance) onWall(win, at, f.n, roundPts(c, w, FLOOR + 0.8, 8.4, 6), 0.06)
    onWall(win, at, f.n, roundPts(c, w, 10.0, 14.1, 6), 0.06)
    onWall(win, at, f.n, rectPts(c - w / 2, c + w / 2, 15.6, 18.7), 0.06)
  }
  // the basement windows in the base course
  if (!entrance) for (const c of xs) onWall(win, at, f.n, rectPts(c - w / 2, c + w / 2, 1.0, 3.0), 0.21)
}
for (const [key, f] of Object.entries(faces) as [keyof typeof faces, Face][]) {
  const long = key === 'E' || key === 'W' // E and W faces run along y (40.2 m)
  const half = long ? HY : HX
  // the corner pavilions: paired windows
  for (const sg of [-1, 1]) bay(f, sg * (half - P / 2), 0, 1.15, true)
  // the recessed middle: single windows
  const mids = long ? [-10.5, -7, -3.5, 0, 3.5, 7, 10.5] : [-4.2, 0, 4.2]
  for (const s of mids) {
    const ent = key === 'E' && s === 0
    bay(f, s, D, ent ? 2.6 : 1.3, false, ent)
  }
  // the fourth storey: a window over each bay below
  const at4 = plane(f, SET)
  const s4 = [...[-1, 1].flatMap((sg) => [sg * (half - P / 2) - 0.85, sg * (half - P / 2) + 0.85]), ...mids]
  for (const s of s4) onWall(win, at4, f.n, rectPts(s - 0.55, s + 0.55, 21.6, 24.0), 0.06)
}

// ---- the east entrance: the door at the top of a broad stair ----
{
  const f = faces.E, at = plane(f, D)
  onWall(trim, at, f.n, roundPts(0, 3.4, FLOOR, 8.3, 8), 0.1)
  onWall(door, at, f.n, roundPts(0, 2.4, FLOOR, 7.6, 8), 0.16)
  onWall(trim, at, f.n, roundPts(0, 3.6, 9.6, 14.6, 8), 0.03)
  // the stair: four flights' worth of steps, from the plaza to the door, with cheek walls
  const X0 = HX - D, W = 3.4
  for (let k = 0; k < 5; k++) {
    const x1 = X0 + 4.5 - k * 0.9, z1 = PLAZA + (FLOOR - PLAZA) * ((k + 1) / 5)
    block(stone, X0, x1, -W, W, 0, z1, 0, trim)
  }
  for (const y of [-W - 0.5, W]) block(stone, X0, X0 + 4.8, y, y + 0.5, 0, FLOOR + 0.6, 0.1)
}

// ---------------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[2] < 21 ? 0.6 : 0.4)
const parts = [
  { part: stone, material: { ...finish('city-hall-limestone', 0xece5d4), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: tile, material: { ...PALETTE.terracotta, color: 0xb27461 } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('city-hall-door', 0x6e4a38) },
]
const glb = writeGlb('San Antonio City Hall', parts, {
  license: 'CC0-1.0', bearing: 0.5, elevation: 0, anchor: [29.424599, -98.495125],
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/78601538'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('San Antonio City Hall', parts, glb, 5000)
const out = new URL('../models/sat-city-hall.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
