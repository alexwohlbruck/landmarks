/**
 * Ally Charlotte Center (601 S Tryon St, 2021, Crescent Communities;
 * Gensler), Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-ally-center.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/1046738978) on the lowest ground. Placed at
 * bearing 49.2, square to Uptown's grid: -x faces South Tryon Street
 * (north-west), +y faces Stonewall Street (north-east).
 *
 * Identity, in order:
 *  - a plain 26-storey slab, long side on Tryon, under a white screen crown
 *    carrying the magenta "ally" sign at its Tryon face's south-west end;
 *  - its two facets: most of the tower is a grey aluminium grid, one cell to
 *    two storeys, while the north corner (Tryon and Stonewall) is a sheer
 *    flush glass block standing a little proud of the grid;
 *  - the tall glazed lobby on Tryon and the low brick retail podium at each
 *    end.
 *
 * Evidence:
 *  - OSM: outline way/1046738978 (tagged 130 m, 26 levels, Q48840112),
 *    parts way/1351695576 (the tower, 110 m: a 40 x 75 m rectangle),
 *    way/1351695577 and way/1351695578 (7 m retail at the north-east and
 *    south-west ends), way/1351695582-585 (rooftop plant, 117-123 m, inside
 *    the screen). Plan measured from these.
 *  - Published: 378 ft / 115.2 m, 26 floors, completed 2021 (CTBUH, via
 *    Wikipedia "Ally Charlotte Center" and "List of tallest buildings in
 *    Charlotte"). The 115.2 m is taken as the screen's top; OSM's 130 m on the
 *    outline matches no photo and is not used.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17) predates the
 *    tower (the site was a surface lot); not used for heights.
 *  - Photos (Wikimedia Commons, daylight):
 *    "Ally Charlotte Center.jpg" (Jt12081988, CC BY-SA 4.0, elevated, from
 *    across Tryon: the grid, the flush corner block, the screen and sign,
 *    https://commons.wikimedia.org/wiki/File:Ally_Charlotte_Center.jpg);
 *    "Ally Charlotte Center S Tryon St.jpg" (City Dweller 2, CC BY-SA 4.0,
 *    the Tryon face and lobby,
 *    https://commons.wikimedia.org/wiki/File:Ally_Charlotte_Center_S_Tryon_St.jpg);
 *    "Ally Center Charlotte May 2022.jpg" (City Dweller 2, CC BY-SA 4.0, from
 *    Tryon to the north-east,
 *    https://commons.wikimedia.org/wiki/File:Ally_Center_Charlotte_May_2022.jpg);
 *    "Ally building 2019.jpg" (Cmett003, CC BY-SA 4.0, under construction:
 *    the two facets meeting,
 *    https://commons.wikimedia.org/wiki/File:Ally_building_2019.jpg);
 *    "Ally Charlotte Center Restaurants Along South Tryon Late March 2024.jpg"
 *    and "Ally Charlotte Center Dos Caminos Late March 2024.jpg" (City
 *    Dweller 2, CC BY-SA 4.0, the brick podium,
 *    https://commons.wikimedia.org/wiki/File:Ally_Charlotte_Center_Restaurants_Along_South_Tryon_Late_March_2024.jpg,
 *    https://commons.wikimedia.org/wiki/File:Ally_Charlotte_Center_Dos_Caminos_Late_March_2024.jpg).
 *    Mapillary was searched; its nearby images show only the street.
 *    No commercial imagery. No look-only sources were used.
 *
 * Estimated: the roof at 109 m and the screen 109-115.2 m (one and a half
 * storeys in the photos); the lobby 13 m (three storeys); the grid's cells,
 * 8 m (two storeys) by ~7 m (seven cells and the flush block on Tryon, per
 * Jt12081988's photo); the flush block's extent (22 m along Tryon, 16 m
 * along Stonewall) and its 0.8 m projection, read off the photos; the
 * podium's brick, a buff between the red and the tan brick the photos show.
 * The "ally" sign is drawn as plain block letters: it is the one mark that
 * names the tower from the street and the skyline. It is lit after dark, so
 * it is `neon-ally-magenta` and glows magenta at night (STYLE.md, "Night").
 *
 * Doubts: the south-east (back) and south-west faces are unphotographed and
 * are drawn as grid like the Tryon face; the flush block's return along
 * Stonewall is seen only obliquely. OSM's 123 m plant box is not drawn, as
 * nothing shows above the screen. Left out: mullions, the floor lines in the
 * flush glass, the Tryon canopy, the plaza and the JW Marriott next door.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { cap, panel, save, walls, rect, type XY } from './chi-aon-center'

const BEARING = 49.2
const ANCHOR: [number, number] = [35.2227002, -80.8488837]

// Roofs share the frame's grey, which keeps the model to six materials.
const frame = new Part(), glass = new Part(), sheer = new Part(), screen = new Part(), brick = new Part(), sign = new Part()
const roof = frame

// Plan (OSM way/1351695576): x -20.9..19.1, y -33.6..41.3.
const X0 = -20.9, X1 = 19.1, Y0 = -33.6, Y1 = 41.3
/** The grid faces sit this far behind the flush corner block. */
const STEP = 0.8
/** The flush block: the north corner, 22 m along Tryon and 16 m along Stonewall. */
const FX = X0 + 16, FY = Y1 - 22
const LOBBY = 13, ROOF = 109, TOP = 115.2, CELL = 8

// --- The grid tower: grey frame, glass in two-storey cells.
const G: XY[] = rect(X0 + STEP, Y0, X1, Y1 - STEP)
walls(frame, G, 0, ROOF)
cap(roof, G, ROOF)
/** Glass cells on wall a→b between s0 and s1, `n` across, every two storeys. */
function cells(a: XY, b: XY, s0: number, s1: number, n: number, z0 = 0.6) {
  const pier = 1.0, w = (s1 - s0 - (n + 1) * pier) / n
  for (let k = 0; k < n; k++) {
    const p = s0 + pier + k * (w + pier)
    panel(glass, a, b, p, p + w, z0, LOBBY - 0.8)
    for (let z = LOBBY; z + CELL <= ROOF + 0.1; z += CELL) panel(glass, a, b, p, p + w, z + 0.5, z + CELL - 0.5)
  }
}
{
  const [sw, se, ne, nw] = G
  const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
  // Tryon (-x), running from the north corner south-west: the grid starts
  // past the flush block.
  const tryon = L(nw, sw), flushT = Y1 - STEP - FY
  cells(nw, sw, flushT, tryon, Math.round((tryon - flushT) / 7))
  // South-west end, south-east (back) face: grid throughout.
  cells(sw, se, 0, L(sw, se), Math.round(L(sw, se) / 7))
  cells(se, ne, 0, L(se, ne), Math.round(L(se, ne) / 7))
  // Stonewall (+y): grid east of the flush block.
  const stone = L(ne, nw), flushS = FX - (X0 + STEP)
  cells(ne, nw, 0, stone - flushS, Math.round((stone - flushS) / 7))
}

// --- The flush corner block: sheer glass, a pale line every two storeys.
{
  const F: XY[] = rect(X0, FY, FX, Y1)
  walls(frame, F, 0, ROOF)
  cap(roof, F, ROOF)
  for (let i = 0; i < 4; i++) {
    const a = F[i], b = F[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // only the two street faces show; the others are buried in the grid block
    const out = (i === 2 || i === 3)
    if (!out) continue
    panel(sheer, a, b, 0.5, L - 0.5, 0.6, LOBBY - 0.8)
    for (let z = LOBBY; z + CELL <= ROOF + 0.1; z += CELL) panel(sheer, a, b, 0.5, L - 0.5, z + 0.6, z + CELL - 0.6)
  }
}

// --- The screen crown: white, flush with the grid's faces.
{
  const S: XY[] = rect(X0 + STEP, Y0, X1, Y1 - STEP)
  walls(screen, S, ROOF, TOP - 0.4)
  const T: XY[] = rect(X0 + STEP + 0.3, Y0 + 0.3, X1 - 0.3, Y1 - STEP - 0.3)
  walls(screen, S, TOP - 0.4, TOP, T)
  // a shallow well inside, so it reads as a screen, not a solid box
  const I: XY[] = rect(X0 + STEP + 0.7, Y0 + 0.7, X1 - 0.7, Y1 - STEP - 0.7)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    screen.quad([T[i][0], T[i][1], TOP], [T[j][0], T[j][1], TOP], [I[j][0], I[j][1], TOP], [I[i][0], I[i][1], TOP])
  }
  walls(screen, [...I].reverse(), TOP - 2.5, TOP)
  cap(roof, I, TOP - 2.5)
}

// --- The "ally" sign: block letters on the screen's Tryon face, south-west end.
{
  const x = X0 + STEP - 0.12 // just proud of the screen
  const h = 5.0, z0 = ROOF + 0.7, s0 = Y0 + 4 // letters run from s0 north-east
  // Letter strokes as [y0, y1, zLow, zHigh] boxes in the face (y along, z up), 0.3 m deep.
  const box = (y0: number, y1: number, za: number, zb: number) => {
    const P = (y: number, z: number, d: number): V3 => [x - d, y, z]
    const d = 0.3
    // Tryon face looks -x: draw the front, top, bottom and both ends.
    sign.quad(P(y1, za, d), P(y0, za, d), P(y0, zb, d), P(y1, zb, d))
    sign.quad(P(y0, zb, 0), P(y0, zb, d), P(y0, za, d), P(y0, za, 0))
    sign.quad(P(y1, za, 0), P(y1, za, d), P(y1, zb, d), P(y1, zb, 0))
    sign.quad(P(y1, zb, 0), P(y1, zb, d), P(y0, zb, d), P(y0, zb, 0))
    sign.quad(P(y0, za, 0), P(y0, za, d), P(y1, za, d), P(y1, za, 0))
  }
  // Reading from the street the letters run right to left in +y (looking south-east, +y is on the left).
  const w = 1.0, x0 = h * 0.62, top = z0 + h
  let c = s0 + 4 * 1.3 + x0 * 2 + 1.0 // start of 'a' at the far (north-east) end
  // a: a bowl and its stem
  box(c - x0, c, z0, z0 + w); box(c - x0, c, z0 + h * 0.6 - w, z0 + h * 0.6); box(c - w, c, z0 + w, z0 + h * 0.6 - w); box(c - x0, c - x0 + w, z0, z0 + h * 0.6)
  c -= x0 + 0.9
  // l, l
  box(c - w, c, z0, top); c -= w + 0.9
  box(c - w, c, z0, top); c -= w + 0.9
  // y: two arms and a descender
  box(c - w, c, z0 + h * 0.15, z0 + h * 0.6); box(c - x0, c - x0 + w, z0 - h * 0.15, z0 + h * 0.6); box(c - x0, c, z0 + h * 0.15 - w, z0 + h * 0.15)
}

// --- Podium: buff brick retail at both ends, 7 m (OSM).
{
  const NE: XY[] = [[-23.4, 41.3 - STEP], [19.1, 41.3 - STEP], [19.1, 43.7], [-23.3, 43.8]]
  const SW: XY[] = [[-17.3, -39.5], [-13.2, -39.5], [-13.3, -43.1], [7.3, -43.1], [7.3, -46.5], [24.9, -46.5], [24.9, -29.0], [19.1, -29.0], [19.1, -33.6], [-17.3, -33.6]]
  for (const P of [NE, SW]) {
    walls(brick, P, 0, 7)
    cap(roof, P, 7)
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 8) continue
      const n = Math.round(L / 5.5), w = (L - (n + 1) * 1.2) / n
      for (let k = 0; k < n; k++) panel(glass, a, b, 1.2 + k * (w + 1.2), 1.2 + k * (w + 1.2) + w, 0.6, 5.0)
    }
  }
}

if (import.meta.main) {
  await save('clt-ally-center', 'Ally Charlotte Center', ANCHOR, BEARING, [
    { part: frame, material: finish('ally-aluminium', 0xc9cdcf) },
    { part: glass, material: { ...PALETTE.window, color: 0x6f8f98 } },
    { part: sheer, material: windowVariant(2, 0x9fb9cb) },
    { part: screen, material: finish('ally-screen', 0xe9ebea) },
    { part: brick, material: finish('ally-brick', 0xc29a7c) },
    { part: sign, material: finish('neon-ally-magenta', 0xc0479b, 0.6) },
  ])
}
