/**
 * Royce Hall (1929, Allison & Allison), UCLA, Westwood — original
 * procedural geometry, CC0-1.0.
 *
 *   bun generators/la-royce-hall.ts
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the building is square
 * to the compass within a degree). Origin at the OSM outline's area
 * centroid, on the lowest ground under the footprint: 127.5 m at the
 * north-west corner. The ground rises to 136.6 m along the south front
 * (USGS 3DEP), so the south facade's detail starts 9 m up.
 *
 * Romanesque Revival in red brick and cast stone: a long south front with
 * two tall square towers (after Sant'Ambrogio in Milan) flanking a gabled
 * entrance of stacked triple arches, ground-floor arcades along the front
 * and the east side, round stair turrets at the corners, red tile roofs,
 * and the auditorium's tall flat-roofed box behind. The twin towers, the
 * triple-arched gable between them, the red brick and the tile roofs are
 * the identity.
 *
 * Evidence
 * - Plan: OSM way/422876632 (matches LA County LARIAC 2020 footprint
 *   427803849067 within a metre): south front y -37.8 (-39.6 at the
 *   entrance), x -28.8 to 46.9; corner turrets at (-31,-27) and (48,-27).
 * - Heights: LA County lidar surface model (LACounty_Dynamic/Elevation
 *   layer 8, 2.5 m grid) over the 127.5 m low point: towers 42.2–43.0 m (34.5 m
 *   over the south plaza, 1 m samples), front arcades 14, entrance gable 30.4, front range ridge 27.2,
 *   auditorium 29.0 (flat), its side aisles 22, east wing 27–29, rear range
 *   23, north-east block 19–20. LARIAC: 35.6 m over its own ground.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   r1 "2019 UCLA Royce Hall 2" (Beyond My Ken, CC BY-SA 4.0) — from the
 *      south-east: the south front and the east arcade wing with its round
 *      turret;
 *   r2 "Royce Hall Facade" (Josh Lee, CC BY-SA 3.0) — the south front;
 *   r3 "UCLA Royce side HDR" (Josh Lee, CC BY-SA 3.0) — the east side,
 *      the round turret;
 *   r4 "Royce Hall edit" (NativeForeigner, CC BY-SA 3.0) — from the south;
 *   USGS NAIP for the tile roofs and the auditorium's grey roof.
 * - Colour: the photos (warm red brick, buff cast stone, red tile).
 *
 * Estimated: eave heights (from the photos against the lidar ridges), the
 * west and north wings (simplified to the ridges lidar shows), the tower
 * plans (9 m squares placed symmetrically about the entrance, the lidar
 * peaks within 2 m), the number of arches (6 a side on the front, 11 on the
 * east), the tower belfry openings. Left out: the steps, the lamp posts,
 * the small north-side turrets, roof equipment.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, lngLat, rect, prism, archPanel, cap, hipRoof, cylinder, save, wallLen } from './la-getty-center'

const O = [-118.44228, 34.07284] as const
const C: XY = [6.55, 1.46]
/** OSM local metres → model frame. */
const P = (x: number, y: number): XY => [x - C[0], y - C[1]]
const R = (x0: number, y0: number, x1: number, y1: number) => rect(x0 - C[0], y0 - C[1], x1 - C[0], y1 - C[1])

const brick = new Part(), stone = new Part(), tile = new Part(), roof = new Part(), win = new Part()

const GS = 8.3 // the south plaza over the low point (3DEP 135.7–135.8 m)

/** A brick range: walls to the eave, a hip (or gabled) tile roof with a small overhang. */
function range(r: XY[], eave: number, ridge: number, hips: [boolean, boolean] = [true, true]) {
  prism(brick, null, r, 0, eave, { corner: 0.25, bevel: 0 })
  cap(brick, r, eave)
  hipRoof(tile, r, eave, ridge - eave, { hips, eave: 0.6, gable: brick })
}

// ---------- the south front range, ridge 27.2 ----------
// set back behind the one-storey arcades, which stand forward to the
// outline at 14 m (lidar, 1 m samples: 14 m over y -33…-38, 26–27 behind)
range(R(-28.8, -33, -7, -21), 22, 27.2)
range(R(25.2, -33, 46.9, -21), 22, 27.2)
for (const [x0, x1] of [[-28.8, -7], [25.2, 46.9]]) {
  prism(stone, null, R(x0, -37.8, x1, -33), 0, 14, { corner: 0.2, bevel: 0.25 })
  cap(roof, R(x0 + 0.4, -37.4, x1 - 0.4, -33), 14)
}

// ---------- the towers ----------
const TOWERS = [-2.5, 20.7]
for (const tx of TOWERS) {
  const sq = R(tx - 4.5, -39.6, tx + 4.5, -30.6)
  prism(brick, null, sq, 0, 40.0, { corner: 0.3, bevel: 0 })
  cap(brick, sq, 40.0)
  // a stone cornice and the low pyramid tile roof (lidar tops 42.2–43.0)
  prism(stone, null, R(tx - 4.9, -40.0, tx + 4.9, -30.2), 39.4, 40.4, { corner: 0.3, bevel: 0.3 })
  hipRoof(tile, R(tx - 4.9, -40.0, tx + 4.9, -30.2), 40.4, 2.6, { eave: 0.2 })
  // stone string courses
  for (const z of [GS + 14.0, GS + 21.5, GS + 25.3]) prism(stone, null, R(tx - 4.65, -39.75, tx + 4.65, -30.45), z, z + 0.7, { corner: 0.3, bevel: 0.2 })
  // belfry: three arched openings a face, and a slit window lower down
  const faces: [XY, XY][] = [
    [P(tx - 4.5, -39.6), P(tx + 4.5, -39.6)], // south
    [P(tx + 4.5, -39.6), P(tx + 4.5, -30.6)], // east
    [P(tx + 4.5, -30.6), P(tx - 4.5, -30.6)], // north
    [P(tx - 4.5, -30.6), P(tx - 4.5, -39.6)], // west
  ]
  for (const [a, b] of faces) {
    // belfry: three bold round-headed openings filling the top stage
    for (const s of [1.75, 4.5, 7.25]) archPanel(win, a, b, s - 1.15, s + 1.15, GS + 26.3, GS + 30.8, 0.06)
    for (const s of [3.0, 6.0]) archPanel(win, a, b, s - 1.0, s + 1.0, GS + 22.2, GS + 25.0, 0.06)
    archPanel(win, a, b, 3.8, 5.2, GS + 15.0, GS + 20.5, 0.06)
  }
}

// ---------- the entrance between the towers: stacked triple arches in a stone gable ----------
{
  const r = R(2, -39.6, 16.2, -21)
  prism(stone, null, r, 0, 25, { corner: 0.2, bevel: 0 })
  cap(stone, r, 25)
  hipRoof(tile, r, 25, 5.4, { hips: [false, false], eave: 0.4, gable: brick })
  const a = P(2, -39.6), b = P(16.2, -39.6), L = wallLen(a, b)
  for (let k = 0; k < 3; k++) {
    const c = (L / 3) * (k + 0.5)
    archPanel(win, a, b, c - 1.75, c + 1.75, GS + 0.3, GS + 7.6, 0.06)
    archPanel(win, a, b, c - 1.6, c + 1.6, GS + 9.2, GS + 15.2, 0.06)
  }
}

// ---------- front and east arcades and the upper arched windows ----------
{
  // south faces of the front range: arcade below, arched windows above
  for (const [x0, x1] of [[-28.8, -7], [25.2, 46.9]]) {
    const a = P(x0, -37.8), b = P(x1, -37.8), L = wallLen(a, b), n = 6, bay = (L - 1.6) / n
    for (let k = 0; k < n; k++) {
      const c = 0.8 + bay * (k + 0.5)
      archPanel(win, a, b, c - bay * 0.32, c + bay * 0.32, GS + 0.3, GS + 4.6, 0.06)
    }
    const a2 = P(x0, -33), b2 = P(x1, -33), L2 = wallLen(a2, b2)
    for (let k = 0; k < 4; k++) {
      const c = 1.2 + ((L2 - 2.4) / 4) * (k + 0.5)
      archPanel(win, a2, b2, c - 1.1, c + 1.1, GS + 7.5, GS + 12.5, 0.06)
    }
  }
}

// ---------- the auditorium and the wings ----------
prism(brick, null, R(-11, -21, 18, 23), 0, 29.0, { corner: 0.3, bevel: 0.3 })
cap(roof, R(-10.7, -20.7, 17.7, 22.7), 29.0)
range(R(-28.5, -21, -11, 25), 19, 23.5, [true, true])
range(R(18, -21, 47, 18), 22, 27.5, [true, true])
range(R(-31.8, 18, 42.5, 34.7), 19, 23.5, [true, true])
range(R(42.5, 18.1, 54.2, 50.9), 15.5, 20.5, [true, true])
// the low west terrace rooms and the north service block
prism(brick, roof, R(-37.5, -16.7, -28.5, 12.3), 0, 11.5, { corner: 0.3, bevel: 0.3 })
prism(brick, roof, R(-2.2, 34.7, 18.1, 42.5), 0, 12, { corner: 0.3, bevel: 0.3 })

// east face of the east wing: an arcade of eleven and arched windows above
{
  const a = P(47, -21), b = P(47, 18), L = wallLen(a, b)
  for (let k = 0; k < 11; k++) {
    const c = 0.8 + ((L - 1.6) / 11) * (k + 0.5)
    archPanel(win, a, b, c - 1.1, c + 1.1, GS + 0.3, GS + 4.4, 0.06)
  }
  for (let k = 0; k < 4; k++) {
    const c = 2 + ((L - 4) / 4) * (k + 0.5)
    archPanel(win, a, b, c - 1.1, c + 1.1, GS + 7.0, GS + 11.8, 0.06)
  }
}

// ---------- round stair turrets at the front corners ----------
for (const [x, y] of [[-30.9, -27.0], [48.4, -27.0]] as [number, number][]) {
  const [cx, cy] = P(x, y)
  cylinder(brick, cx, cy, 4.9, 0, 22.5, 16)
  cylinder(stone, cx, cy, 5.15, GS + 5.4, GS + 6.1, 16)
  cylinder(tile, cx, cy, 5.4, 22.5, 26.5, 16, { r1: 0.3 })
  for (let k = 0; k < 5; k++) {
    // arched windows round the outward half
    const ang = (x < 0 ? Math.PI : 0) + ((k - 2) * Math.PI) / 6
    const a: XY = [cx + 4.92 * Math.cos(ang - 0.18), cy + 4.92 * Math.sin(ang - 0.18)]
    const b: XY = [cx + 4.92 * Math.cos(ang + 0.18), cy + 4.92 * Math.sin(ang + 0.18)]
    archPanel(win, a, b, 0, wallLen(a, b), GS + 7.0, GS + 11.0, 0.08)
  }
}


if (import.meta.main) {
  const [lng, lat] = lngLat(C, O[0], O[1])
  console.log(`anchor ${lng.toFixed(7)}, ${lat.toFixed(7)}`)
  save('la-royce-hall', 'Royce Hall', [
    { part: brick, material: finish('royce-brick', 0xc48b78) },
    { part: stone, material: finish('royce-stone', 0xe8d8bd) },
    { part: tile, material: PALETTE.terracotta },
    { part: roof, material: PALETTE.roof },
    { part: win, material: { ...PALETTE.window, color: 0x5f6870 } },
  ], { bearing: 0, elevation: 0, height: 42.4, replaces: ['way/422876632'] })
}
