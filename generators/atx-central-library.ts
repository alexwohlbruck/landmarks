/**
 * Austin Central Library, 710 W Cesar Chavez Street, Austin (2017,
 * Lake|Flato with Shepley Bulfinch) — original procedural geometry, CC0-1.0.
 * bun generators/atx-central-library.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 17.7: the model's axes follow Austin's street grid
 * (Cesar Chavez Street runs along x on the south, Shoal Creek is east).
 * Anchor = area centroid of OSM way/516271467 ("Austin Central Library",
 * 6 levels), -97.7517529, 30.2659719.
 *
 * Identity (from the photos):
 *  1. A big, thin, flat roof canopy that overhangs every side by several
 *     metres, its underside dark, over a recessed glazed top floor.
 *  2. Upper floors clad in dark brown horizontal metal louvres (brise-
 *     soleil) with long window bands; a two-storey base of buff limestone
 *     and glass.
 *  3. The rooftop butterfly garden on the south-east quarter, open to the
 *     sky under a raised solar-panel trellis, and another solar array on
 *     the roof canopy.
 *  4. A lower wing on the north-east, toward Shoal Creek.
 *
 * Evidence:
 *  - plan: OSM way/516271467 as drawn.
 *  - heights: USGS 3DEP lidar USGS_LPC_TX_Central_B1_2017 (2017 flight, the
 *    year the library opened; the roof was finished), 0.5 m grid read in
 *    the frame, less 4 m (y = 0 is Mapterhorn's lowest ground under the
 *    footprint, on the creek side; Cesar Chavez is about 3 m above it and
 *    2nd Street about 6.5 m). Measured: the roof canopy 34 m and its overhang
 *    past the walls (lidar edges against OSM: at least 5 m west and 4-6 m
 *    south, the west edge running off the lidar crop; drawn 7 m there); the solar array on it
 *    to 38 m; the garden quarter's trellis 28.5 m; the north-east wing 21 m.
 *  - NAIP (USGS, 0.14 m) for the roof plan: the white canopy, the solar
 *    arrays, the green garden in the south-east quarter.
 *  - estimated from the photos: the floor heights (6 levels, OSM), the
 *    limestone base 9 m, the window bands, the top floor's inset.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  b02  "Austin Public Library August 2019 02.jpg", Michael Barera, CC BY-SA 4.0
 *       (the south-east corner on Cesar Chavez) https://commons.wikimedia.org/wiki/File:Austin_Public_Library_August_2019_02.jpg
 *  b01  "Austin Public Library August 2019 01.jpg", Michael Barera, CC BY-SA 4.0
 *       (from the Shoal Creek trail) https://commons.wikimedia.org/wiki/File:Austin_Public_Library_August_2019_01.jpg
 *  b10  "Austin Public Library August 2019 10 (Roof Garden).jpg", Michael
 *       Barera, CC BY-SA 4.0 (the garden and its solar trellis)
 *  ces  "Austin public library from Cesar Chavez entrance.jpg", Mikerussell, CC BY-SA 4.0
 *  carmen "Austin Public Library, downtown branch.jpg", CarmenEsparzaAmoux, CC BY-SA 4.0
 * Not used: "John Henry Faulk Central Library.jpg" shows the old library.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the six-storey atrium, the screened stair tower and the
 * cantilevered reading porches are reduced to the louvred volume; the
 * north and west sides are seen only obliquely. The lidar's lowest ground
 * is a dip inside the footprint, so the base may sit a metre or two low.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, prism, save, split, wall, type XY } from './atl-flatiron-building'
import { wallBand } from './atx-google-tower'

const stone = new Part(), louvre = new Part(), win = new Part(), canopy = new Part(), garden = new Part(), solar = new Part()

const OUTLINE: XY[] = [[-30.28, 4.46], [-30.36, -29.9], [-19.02, -32.94], [-14.29, -32.56], [6.18, -30.91], [30.41, -31.32], [28.7, -7.64], [28.4, -7.56], [24.68, -6.64], [21.75, -5.9], [23.83, -0.56], [25.62, 4.06], [26.39, 6.04], [32.31, 5.29], [38.4, 24.96], [37.41, 25.25], [21, 30.11], [6.44, 30.68], [-30.56, 30.42]]
// The main block (the outline less the north-east wing).
const MAIN: XY[] = [[-30.36, -29.9], [-19.02, -32.94], [-14.29, -32.56], [6.18, -30.91], [30.41, -31.32], [28.7, -7.64], [21.75, -5.9], [25.62, 4.06], [26.39, 6.04], [26.39, 30.3], [6.44, 30.68], [-30.56, 30.42], [-30.28, 4.46]]
const WING: XY[] = [[26.39, 6.04], [32.31, 5.29], [38.4, 24.96], [37.41, 25.25], [26.39, 28.5]]

const BASE = 9, BODY = 26, TOPF = 31.5, C0 = 33.4, C1 = 34

// The limestone base and the louvred upper floors.
// The west face (San Antonio Street) is limestone to the top floor, with
// punched windows; the others are louvred above the base.
const isWest = (a: XY, b: XY) => a[0] < -29 && b[0] < -29
for (let i = 0; i < MAIN.length; i++) {
  const a = MAIN[i], b = MAIN[(i + 1) % MAIN.length], seg = split([a, b], 5).concat([b])
  for (let k = 0; k < seg.length - 1; k++) {
    const r: XY[] = [seg[k], seg[k + 1]]
    const q = (z0: number, z1: number, p: Part) => p.quad([r[0][0], r[0][1], z0], [r[1][0], r[1][1], z0], [r[1][0], r[1][1], z1], [r[0][0], r[0][1], z1])
    if (isWest(a, b)) q(0, BODY, stone)
    else { q(0, BASE, stone); q(BASE, BODY, louvre) }
  }
}
prism(louvre, WING, 0, 21, canopy, 0.4)

// Window bands: two long bands of glass in the louvres, and storefront
// glazing in the limestone base, panel by panel with piers between.
const ring = MAIN
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 6) continue
  if (isWest(a, b)) {
    // punched windows in the limestone, one panel per bay and two storeys
    const n = Math.round((L - 4) / 5), w = (L - 4) / n, t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let k = 0; k < n; k++) for (const [z0, z1] of [[11, 16], [18.5, 23.5]]) {
      const s0 = 2 + k * w + 1.1, s1 = 2 + (k + 1) * w - 1.1
      wallBand(win, [a[0] + t[0] * s0, a[1] + t[1] * s0], [a[0] + t[0] * s1, a[1] + t[1] * s1], z0, z1, 0.06)
    }
  } else {
    // broad glazing behind the bronze screens: two bands of two storeys,
    // the bronze showing between them and at the ends
    wallBand(win, a, b, 10.8, 16.2, 0.06, 1.6)
    wallBand(win, a, b, 18.6, 24.2, 0.06, 1.6)
  }
  const n = Math.max(1, Math.round((L - 2) / 7)), w = (L - 2) / n
  const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (let k = 0; k < n; k++) {
    const s0 = 1 + k * w + 1.2, s1 = 1 + (k + 1) * w - 1.2
    wallBand(win, [a[0] + t[0] * s0, a[1] + t[1] * s0], [a[0] + t[0] * s1, a[1] + t[1] * s1], 3.2, 7.6, 0.06)
  }
}
for (let i = 0; i < WING.length; i++) {
  const a = WING[i], b = WING[(i + 1) % WING.length]
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 6) { wallBand(win, a, b, 7, 9.5, 0.06, 1.5); wallBand(win, a, b, 14, 16.5, 0.06, 1.5) }
}

// The roof over the louvred body, under the recessed top floor and the garden.
capPoly(canopy, MAIN, BODY, true)

// The top floor: glass set 1.5 m in, under the canopy, except over the
// south-east garden quarter (x > 4, y < -12).
const TOP_A: XY[] = [[-28.8, -12], [19.5, -12], [19.5, 28.8], [-28.8, 28.8]]
const TOP_B: XY[] = [[-28.8, -29.3], [4, -29.3], [4, -12], [-28.8, -12]]
prism(win, TOP_A, BODY, TOPF, null, 0)
prism(win, TOP_B, BODY, TOPF, null, 0)

// The roof canopy: a thin slab (0.6 m at its edge) overhanging about 7 m on
// the west and south, 3-4 m on the north and east, dark bronze underneath
// and at the edge, pale on top; the garden quarter is left open.
const CAN_A: XY[] = [[-38, -12], [33.5, -12], [33.5, 34.5], [-38, 34.5]]
const CAN_B: XY[] = [[-38, -40], [4, -40], [4, -12], [-38, -12]]
for (const r of [CAN_A, CAN_B]) {
  capPoly(louvre, r, C0, false)
  wall(louvre, r, C0, C1 - 0.4)
  prism(canopy, r, C1 - 0.4, C1, canopy, 0.15)
}

// The solar array raised on the canopy, toward the north.
box(solar, -17, 19, 4, 15, C1 + 2.6, C1 + 3.4, solar, 0.2, true)
for (const [x, y] of [[-16, 5], [18, 5], [-16, 14], [18, 14]] as XY[]) box(louvre, x - 0.25, x + 0.25, y - 0.25, y + 0.25, C1, C1 + 2.6, null, 0)
// The butterfly garden: a planted deck over the south-east quarter, under
// a raised trellis of solar panels on posts.
const GARDEN: XY[] = [[4, -30.9], [30.41, -31.32], [28.7, -12], [4, -12]]
capPoly(garden, GARDEN, BODY + 0.4, true)
const TRELLIS: XY[] = [[5.5, -30], [28, -30.3], [27, -13.5], [5.5, -13.5]]
prism(solar, TRELLIS, 28.2, 28.8, solar, 0.15, true)
for (const [x, y] of [[6.5, -29], [27, -29.3], [26, -14.5], [6.5, -14.5], [16.5, -29], [16.5, -14.5]] as XY[]) box(louvre, x - 0.25, x + 0.25, y - 0.25, y + 0.25, BODY, 28.2, null, 0)
void OUTLINE
void ([] as V3[])

if (import.meta.main) {
  await save('atx-central-library', 'Austin Central Library', [
    { part: stone, material: finish('library-limestone', 0xe3cfa8) },
    { part: louvre, material: finish('library-louvres', 0x6e5647) },
    { part: win, material: PALETTE.window },
    { part: canopy, material: finish('library-canopy', 0xe2e1db) },
    { part: garden, material: finish('library-garden', 0x93a77d) },
    { part: solar, material: finish('library-solar', 0x5d6b7c, 0.4) },
  ], { bearing: 17.7, height: C1 + 3.4, replaces: ['way/516271467'] })
}
