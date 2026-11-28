/**
 * Jackson County Courthouse (1934, Wight and Wight with Keene & Simpson),
 * 415 East 12th Street, Kansas City, Missouri — original procedural
 * geometry, CC0-1.0.
 * bun generators/kc-jackson-county-courthouse.ts
 *
 * Uses the helpers exported by kc-city-hall.ts (`stepped`, `columns`,
 * `spread`) and kc-power-and-light-building.ts (`Tower`, `groups`).
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/118650981, -94.5779876 39.0992103.
 * Its walls run at 2.2° (the downtown grid): bearing 2.2. Elevation 0.
 *
 * Identity, in order: the broad pale limestone slab tower, long east-west,
 * facing City Hall across 12th Street; its notched upper corners; the nine
 * window strips in the middle of the long faces between plain side bays of
 * single windows; the gilded ornamental panels in the strips over the top
 * five floors and the gilded frieze under the parapet; the low broad base
 * with corner pavilions, its sculpted frieze and the tall bronze-grilled
 * entrance in the middle of the north front; the lower wing to the south.
 *
 * Evidence
 * - OSM way/118650981 (height 90, 22 levels, Q14704325) and its parts:
 *   way/1344842521 (base, 22), 1344842520 (south wing, 11), 466561680 (the
 *   tower to 69) and 1344842522 (the tower to 93, chamfered corners). Plans
 *   follow OSM.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 0.5 m, read in this
 *   frame. Heights above y = 0 (lowest ground under the footprint, the
 *   north-west corner, ~273.6 m NAVD88 from the map's terrain; lidar - 1.1),
 *   measured: base roof 23, its parapet 26; the south wing 13.5, rim 15;
 *   the tower's full plan to 71, then the corners notched ~3 m both ways;
 *   tower roof 88-91, parapet 92. The 12th Street front is ~3-5 above y = 0,
 *   so the tower stands ~89 m above the street (OSM 90; published 22
 *   storeys). The lidar shows the middle of the north base front (x ±14)
 *   recessed to the tower face with an entrance porch and steps (6 m above
 *   ground_min, against 24-27 on the pavilions); built so. Lidar and OSM
 *   disagree on the tower's depth by ~1.5 m (lidar 28, OSM 26.5); OSM kept.
 * - Photos: "Jackson County Kansas City Courthouse 20161026-7020-7029.jpg"
 *   (Kbh3rd, CC BY 4.0; frontal from the north, on City Hall's steps: the
 *   tower ~0.77 of the base's width, nine strips between side bays, the
 *   gilded panels over the top five floors, base window groups) and
 *   "...20161026-7036-7038.jpg" (Kbh3rd, CC BY 4.0; from the north-east:
 *   the east face's strips, the notched corners, the base pavilions, the
 *   stone's colour in sun). Flickr 3463061080 "Jackson County Courthouse"
 *   (The DLC, CC BY-SA 2.0; a 1930s linen postcard from the north-east,
 *   massing only).
 * - Estimated: storey 4 m (22 floors to 88 m), three-storey window groups;
 *   the east and west faces' strips (five, from the north-east photo).
 * - Doubts: no photo of the south or west sides; the south wing's windows
 *   repeat the base rhythm.
 *
 * Colours: limestone pale warm grey (#d3cbbd in sun, Kbh3rd), pulled to the
 * palette's lightness; windows slate; the gilded panels a muted gold.
 * Night: the tower is floodlit (`_FLOODLIGHT`), the base not.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panel, parapetRoof, rect, save, type XY } from './chi-aon-center'
import { Tower, groups } from './kc-power-and-light-building'
import { columns, spread, stepped } from './kc-city-hall'

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), gilt = new Part(), door = new Part()
  const T = new Tower(stone, roof, win)
  const ST = 4.0
  const Y0 = -11.3, Y1 = 15.2, CY = (Y0 + Y1) / 2, HX = 24.45, HY = (Y1 - Y0) / 2

  // --- base: two pavilions reaching 12th Street, the middle recessed to the tower
  const pavW = rect(-30.8, -18.4, -15.2, 21.3), pavE = rect(16.5, -18.4, 30.7, 21.3)
  const mid = rect(-15.2, -18.4, 16.5, Y1)
  for (const r of [pavW, pavE, mid]) T.mass(r, 0, 23, 0.4, null)
  for (const r of [pavW, pavE]) parapetRoof(stone, roof, r, 26, 0.7, 3)
  parapetRoof(stone, roof, mid, 25, 0.6, 2)
  // the entrance porch and steps
  block(stone, roof, rect(-12, Y1, 12, Y1 + 2.6), 0, 5.2, 0.2)
  for (let i = 0; i < 5; i++) block(stone, roof, rect(-9, Y1 + 2.6, 9, Y1 + 2.6 + 0.6 * (5 - i)), 0, 4.9 - 0.25 * i, 0.05)
  // the south wing
  T.mass(rect(-17.4, -25.3, 17.1, -18.4), 0, 13.5, 0.3, null)
  parapetRoof(stone, roof, rect(-17.4, -25.3, 17.1, -18.4), 15, 0.6, 1.5)

  // --- the tower: full plan to 71, notched corners above, parapet 92
  const full = rect(-HX, Y0, HX, Y1)
  const top = stepped(0, CY, [[HX, HY - 3], [HX - 3, HY]])
  T.mass(full, 23, 71, 0.4)
  T.mass(top, 71, 92, 0, null)
  parapetRoof(stone, roof, top, 92, 0.7, 2.5)

  // --- tower windows
  const G = (z0: number, z1: number) => groups(z0, z1, ST, 3, 1.5)
  const body = G(27, 70) // below the notch
  const upper: [number, number][] = [[72.5, 76.8]]
  const ornament: [number, number][] = [[78.2, 86.6]]
  // the long faces: nine strips in the middle 30 m, a single column in each side bay
  for (const [a, b] of [[[-HX, Y0], [HX, Y0]], [[HX, Y1], [-HX, Y1]]] as [XY, XY][]) {
    const strips = spread(9.6, 39.3, 9, 1.85)
    columns(win, a, b, strips, [...body, ...upper])
    columns(gilt, a, b, strips, ornament)
    columns(win, a, b, [[4.0, 5.0], [43.9, 44.9]], groups(27, 70, ST, 2, 1.6))
    columns(win, a, b, [[6.6, 7.6], [41.3, 42.3]], groups(72, 86, ST, 2, 1.6))
    panel(gilt, a, b, 9.0, 39.9, 88.2, 89.8, 0.06) // gilded frieze
  }
  // the short faces: five strips, plain bays either side
  for (const [a, b] of [[[HX, Y0], [HX, Y1]], [[-HX, Y1], [-HX, Y0]]] as [XY, XY][]) {
    const strips = spread(6.0, 20.5, 5, 1.7)
    columns(win, a, b, strips, [...body])
    const [p, q]: [XY, XY] = a[1] < b[1] ? [[HX, Y0 + 3], [HX, Y1 - 3]] : [[-HX, Y1 - 3], [-HX, Y0 + 3]]
    columns(win, p, q, spread(3.0, 17.5, 5, 1.7), upper)
    columns(gilt, p, q, spread(3.0, 17.5, 5, 1.7), ornament)
  }

  // --- base windows
  const lower: [number, number][] = [[4.5, 9.0]], tall: [number, number][] = [[10.6, 15.6], [16.6, 20.2]]
  // north front: the pavilions (three columns each), the middle (three each side of the entrance)
  for (const [x0, x1] of [[-30.8, -15.2], [16.5, 30.7]]) {
    const a: XY = [x1, 21.3], b: XY = [x0, 21.3], L = x1 - x0
    columns(win, a, b, spread(3.0, L - 3.0, 3, 1.7), [...lower, ...tall])
    panel(gilt, a, b, 2.5, L - 2.5, 21.2, 22.0, 0.05)
  }
  {
    const a: XY = [16.5, Y1], b: XY = [-15.2, Y1], c = (16.5 + 15.2) / 2 // s of x = 0.65
    columns(win, a, b, [...spread(1.8, c - 4.2, 3, 1.6), ...spread(c + 4.2, 31.7 - 1.8, 3, 1.6)], [[6.5, 10.0], ...tall])
    panel(stone, a, b, c - 3.6, c + 3.6, 0, 21.5, 0.12) // the entrance surround
    panel(door, a, b, c - 2.6, c + 2.6, 5.2, 9.5, 0.16)
    panel(win, a, b, c - 2.6, c + 2.6, 10.3, 19.6, 0.16) // the bronze grille
    panel(stone, a, b, 1.2, 30.5, 20.6, 22.4, 0.05) // the relief frieze, slightly proud
  }
  // east, west and south faces of the base, and the south wing
  for (const [a, b, n] of [[[30.7, -18.4], [30.7, 21.3], 8], [[-30.8, 21.3], [-30.8, -18.4], 8], [[-15.2, -18.4], [-30.8, -18.4], 3], [[30.7, -18.4], [17.1, -18.4], 3]] as [XY, XY, number][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    columns(win, a, b, spread(2.5, L - 2.5, n, 1.6), [...lower, ...tall])
  }
  for (const [a, b, n] of [[[-17.4, -25.3], [17.1, -25.3], 9], [[17.1, -25.3], [17.1, -18.4], 2], [[-17.4, -18.4], [-17.4, -25.3], 2]] as [XY, XY, number][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    columns(win, a, b, spread(1.5, L - 1.5, n, 1.6), [[3.0, 6.6], [7.6, 11.8]])
  }

  const lit = (p: V3, n: V3) => {
    if (p[2] < 23.5) return 0
    const k = Math.min(1, 0.55 + 0.45 * (p[2] - 23) / 69)
    return n[2] > 0.7 ? k * 0.3 : k
  }
  return [
    { part: stone, material: { ...finish('kcjc-limestone', 0xddd4c4), floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: gilt, material: finish('kcjc-gilt', 0xcfb57c) },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('kc-jackson-county-courthouse', 'Jackson County Courthouse', [39.0992103, -94.5779876], 2.2, build(), 6500)
