/**
 * Co-Cathedral of the Sacred Heart (1111 St Joseph Parkway, 2008, Ziegler
 * Cooper Architects), Houston — original procedural geometry, CC0-1.0.
 * bun generators/hou-sacred-heart-co-cathedral.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Built turned to the downtown grid: catalog bearing 34.6 (the
 * outline's walls run at 34.6° / 124.6°), so model +y points north-east up
 * the nave to the crossing and apse, -y to the entrance front on St Joseph
 * Parkway, +x south-east. Anchor = centroid of the OSM outline
 * way/182189009, 29.7499017,-95.3686743.
 *
 * Identity, in order: the freestanding square bell tower beside the
 * entrance front, stepping in twice to an open belfry of tall slots and a
 * gold cross; the tall flat gabled entrance front with its great glazed
 * window in a gold frame over three bronze doors, between lower pylons;
 * the shallow green copper dome on a windowed drum over a square crossing,
 * near the far end; the long nave and the wide transept under pale metal
 * gable roofs; pale Indiana limestone throughout.
 *
 * Evidence:
 *  - plan: OSM way/182189009 read in the turned frame: nave x ±11 from the
 *    front at y -38.2 to the crossing; chapel wings x ±24.2, y -32.7..-22.2;
 *    transept x ±24.2 (aisles) / ±27.6, y 6.5..29; end porches to x ±28.6;
 *    apse to y 32. The bell tower is not in OSM; it is placed from the lidar
 *    (an 8 m square top centred at x 37.5, y -39) and the photos.
 *  - heights: USGS 3DEP lidar TX_Coastal_B1_2018 (flown 2018, the building
 *    is 2008), 0.5 m grids, street 0.6 m above the grid minimum. Measured:
 *    aisles 14.0; nave clerestory eaves 21.3, ridge 25.8; entrance front
 *    (a 2 m deep slab, x ±8, y -38.4..-36.4) shoulders 24.8 and apex 27.9,
 *    so it stands 2-3.5 m clear of the nave roof all along its top, no
 *    more; stepped side bays 21.3 (x ±8..9.2) and 18.6 (to x ±11.2); chapel
 *    wings eaves ~8, ridge 10.4; transept aisles 14.1, walls 21.3, ridge
 *    26.0; crossing block 27.1; dome top 35.9, its cross 40.5; apse 14.4;
 *    bell tower parapet 35.6-36.9, top 38.6, cross 42.0. Published
 *    (Wikipedia): dome 117 ft (36 m), nave 72 ft (22 m), tower 140 ft
 *    (43 m), all matching.
 *  - the tower's lower widths (10 m base, 9 m middle) and setbacks at
 *    ~15 m and ~28 m, the piers framing two tall blind panels a face on
 *    both, the belfry's three openings a face in two rows (tall 28.8-33.4,
 *    short 34.1-35.7) drawn as dark unlit voids, the front's window
 *    (x ±4.6, 9-23 m) and doors, the drum's windows and the dome's
 *    overhanging rim: from the photos, scaled on the lidar heights
 *    (estimates).
 *  - colour: Indiana limestone, warm beige with a pink cast in sun:
 *    #cfbfa5 sampled on the sunlit nave wall in Antony-22's 2018b photo,
 *    #918272 on the tower in shade in Yunakov's; drawn #ecdcc6; metal roofs pale grey from NAIP (#b7bec4); the dome's
 *    weathered copper green-grey in Farragutful's photo (#7f978d), pulled
 *    light to #93a99d; gold for the crosses and the window frame; the bronze doors
 *    and belfry openings a dark unlit void colour (#4e5258).
 *  - night: no licensed night photo found. The front, tower and dome get a
 *    modest floodlight share (estimate); windows lit.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Co-Cathedral_of_the_Sacred_Heart_-_03.jpg and _-_06.jpg, Oleg
 *    Yunakov, CC BY-SA 4.0 (front and tower; belfry close-up)
 *    https://commons.wikimedia.org/wiki/File:Co-Cathedral_of_the_Sacred_Heart_-_03.jpg
 *    https://commons.wikimedia.org/wiki/File:Co-Cathedral_of_the_Sacred_Heart_-_06.jpg
 *  - Co-Cathedral_of_the_Sacred_Heart_-_Houston_01.jpg and _02.jpg,
 *    Farragutful, CC BY-SA 4.0 (dome and drum; tower)
 *    https://commons.wikimedia.org/wiki/File:Co-Cathedral_of_the_Sacred_Heart_-_Houston_01.jpg
 *    https://commons.wikimedia.org/wiki/File:Co-Cathedral_of_the_Sacred_Heart_-_Houston_02.jpg
 *  - Sacred_Heart_Co-Cathedral_Houston_2018a.jpg and 2018b.jpg, Antony-22,
 *    CC BY-SA 4.0 (front; the west side with dome and tower)
 *    https://commons.wikimedia.org/wiki/File:Sacred_Heart_Co-Cathedral_Houston_2018a.jpg
 *    https://commons.wikimedia.org/wiki/File:Sacred_Heart_Co-Cathedral_Houston_2018b.jpg
 *  USGS NAIP for the plan and roof colours. No commercial imagery.
 *  Look-only (seen, not relied on): _jjph's Flickr set, CC BY-NC-SA 2.0.
 *
 * Left out: the reliefs and lettering over the doors, the stone mullion
 * grids, the window grilles, the stepped outer panels of the front, the
 * plaza and steps.
 *
 * The bell tower has no OSM way (it is freestanding, south-east of the
 * front), so `replaces` can't list it; it is drawn from the lidar.
 *
 * Doubts: the far (east) side, the transept ends and the apse are not in
 * any licensed photo and are drawn plain from the lidar; the tower is not
 * in OSM, so the map may still draw nothing (or something else) under it;
 * its lower widths are photo estimates.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, inset, lathe, panel, rect, save, walls, type XY } from './chi-aon-center'

const TOWER: XY = [37.5, -39]
const DOME: XY = [0, 18]
const FRONT_SHOULDER = 24.8, FRONT_APEX = 27.9

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), copper = new Part(), gold = new Part(), dark = new Part()

  // ---- nave --------------------------------------------------------------
  block(stone, roof, rect(-11, -36, 11, 9), 0, 14.0, 0.4)
  walls(stone, rect(-8, -36, 8, 9), 14.0, 21.3)
  gableY(roof, stone, 8.4, 21.3, 25.8, -36, 9)
  // the entrance front: a tall flat slab with a low gable, standing clear
  // of the nave roof all round (lidar: shoulders 24.8, apex 27.9), between
  // stepped side bays (21.3, the clerestory's end; then 18.6)
  const FY0 = -38.4, FY1 = -36.4
  walls(stone, rect(-8, FY0, 8, FY1), 0, FRONT_SHOULDER)
  gableFront(stone, -8, 8, FY0, FY1, FRONT_SHOULDER, FRONT_APEX)
  for (const s of [1, -1]) {
    block(stone, stone, s > 0 ? rect(8, FY0 + 0.3, 9.2, -27) : rect(-9.2, FY0 + 0.3, -8, -27), 0, 21.3, 0.3)
    block(stone, stone, s > 0 ? rect(9.2, FY0 + 0.7, 11.2, -27) : rect(-11.2, FY0 + 0.7, -9.2, -27), 0, 18.6, 0.4)
  }
  // chapel wings either side of the front half of the nave
  for (const s of [1, -1]) {
    const r = s > 0 ? rect(11, -32.7, 24.2, -22.2) : rect(-24.2, -32.7, -11, -22.2)
    walls(stone, r, 0, 8.0)
    gableX(roof, stone, s > 0 ? 11 : -24.2, s > 0 ? 24.2 : -11, -27.45, 5.25 + 0.2, 8.0, 10.4)
  }

  // ---- transept, crossing, apse -----------------------------------------
  block(stone, roof, rect(-24.2, 6.5, 24.2, 29), 0, 14.1, 0.4)
  walls(stone, rect(-27.6, 9, 27.6, 27), 0, 21.3)
  gableX(roof, stone, -27.6, 27.6, 18, 9.4, 21.3, 26.0)
  for (const s of [1, -1]) block(stone, roof, s > 0 ? rect(27.6, 12.8, 28.6, 22.2) : rect(-28.6, 12.8, -27.6, 22.2), 0, 14.0, 0.3)
  block(stone, roof, rect(-8.4, 27, 8.4, 31.1), 0, 14.4, 0.4)
  block(stone, roof, rect(-5.9, 30, 5.9, 32), 0, 14.4, 0.4)
  block(stone, roof, rect(DOME[0] - 9, DOME[1] - 9, DOME[0] + 9, DOME[1] + 9), 14, 27.1, 0.5)
  // drum, rim, shallow copper dome, cross
  lathe(stone, DOME[0], DOME[1], [[8.0, 26.6], [8.0, 32.0]], 16)
  lathe(copper, DOME[0], DOME[1], [[8.0, 32.0], [8.9, 32.0], [8.9, 32.4], [8.6, 32.6], [7.6, 33.6], [5.8, 34.7], [3.2, 35.5], [0.0, 35.9]], 16)
  for (let k = 0; k < 12; k++) {
    const a = ((k + 0.5) / 12) * 2 * Math.PI, d = 0.12, r = 8.04
    const P = (t: number, z: number): V3 => [DOME[0] + r * Math.cos(t), DOME[1] + r * Math.sin(t), z]
    win.quad(P(a - d, 28.2), P(a + d, 28.2), P(a + d, 31.0), P(a - d, 31.0))
  }
  cross(gold, DOME[0], DOME[1], 35.6, 40.5, 2.4)

  // ---- windows -----------------------------------------------------------
  for (const s of [1, -1]) {
    // nave aisle walls (x = ±11) behind the chapel wings and to the transept
    const a: XY = s > 0 ? [11, -36] : [-11, 9], b: XY = s > 0 ? [11, 9] : [-11, -36]
    const at = (y: number) => (s > 0 ? y + 36 : 9 - y)
    for (const y of [-19, -14, -9, -4, 1]) panel(win, a, b, at(y) - 1.0, at(y) + 1.0, 3.0, 11.6, 0.05)
    for (const y of [-33.5, -28.5, -23.5]) panel(win, a, b, at(y) - 0.8, at(y) + 0.8, 10.0, 12.8, 0.05)
    // clerestory (x = ±8)
    const c: XY = s > 0 ? [8, -36] : [-8, 9], d: XY = s > 0 ? [8, 9] : [-8, -36]
    for (const y of [-31, -25, -19, -13, -7, -1, 5]) panel(win, c, d, at(y) - 1.4, at(y) + 1.4, 15.4, 20.0, 0.05)
    // transept ends (x = ±27.6): three tall lights
    const e: XY = s > 0 ? [27.6, 9] : [-27.6, 27], f: XY = s > 0 ? [27.6, 27] : [-27.6, 9]
    for (const o of [-3.2, 0, 3.2]) panel(win, e, f, 9 + o - 1.1, 9 + o + 1.1, 15.0, 20.4, 0.05)
    // transept fronts and backs (y = 9 / 27) over the aisles
    const g: XY = s > 0 ? [-27.6, 9] : [27.6, 27], h: XY = s > 0 ? [27.6, 9] : [-27.6, 27]
    for (const x of [-22, -16, 16, 22]) panel(win, g, h, 27.6 + s * x - 1.3, 27.6 + s * x + 1.3, 15.4, 20.0, 0.05)
    // chapel wings, outer ends
    const i: XY = s > 0 ? [24.2, -32.7] : [-24.2, -22.2], j: XY = s > 0 ? [24.2, -22.2] : [-24.2, -32.7]
    for (const o of [3, 5.25, 7.5]) panel(win, i, j, o - 0.7, o + 0.7, 2.0, 6.6, 0.05)
  }
  // the front: the great window in its gold frame, three bronze doors
  const fa: XY = [-8, FY0], fb: XY = [8, FY0]
  panel(gold, fa, fb, 8 - 5.0, 8 + 5.0, 6.6, 24.0, 0.04)
  panel(win, fa, fb, 8 - 4.4, 8 + 4.4, 7.2, 23.4, 0.08)
  // the marble frieze between doors and window, then the three bronze doors
  panel(stone, fa, fb, 8 - 4.4, 8 + 4.4, 5.6, 7.2, 0.09)
  for (const x of [-2.6, 0, 2.6]) panel(dark, fa, fb, 8 - x - 0.95, 8 - x + 0.95, 0, 5.2, 0.06)
  cross(gold, 0, FY0 + 1.0, FRONT_APEX - 0.3, FRONT_APEX + 4.0, 2.4)

  // ---- bell tower --------------------------------------------------------
  const [tx, ty] = TOWER
  block(stone, null, rect(tx - 5, ty - 5, tx + 5, ty + 5), 0, 15, 0)
  cap(roof, rect(tx - 5, ty - 5, tx + 5, ty + 5), 15)
  block(stone, null, rect(tx - 4.5, ty - 4.5, tx + 4.5, ty + 4.5), 15, 28, 0)
  cap(roof, rect(tx - 4.5, ty - 4.5, tx + 4.5, ty + 4.5), 28)
  block(stone, null, rect(tx - 4, ty - 4, tx + 4, ty + 4), 28, 36.2, 0)
  block(stone, roof, rect(tx - 3.6, ty - 3.6, tx + 3.6, ty + 3.6), 36.2, 37.5, 0.3)
  block(stone, roof, rect(tx - 2.6, ty - 2.6, tx + 2.6, ty + 2.6), 37.5, 38.6, 0.3)
  cross(gold, tx, ty, 38.4, 42.0, 1.8)
  // Belfry: three bold openings a face in two rows, tall below and short
  // above, dark voids in the stone frame (not lit).
  const belfry = rect(tx - 4, ty - 4, tx + 4, ty + 4)
  for (let i = 0; i < 4; i++) {
    const a = belfry[i], b = belfry[(i + 1) % 4]
    for (const c of [1.6, 4, 6.4]) {
      panel(dark, a, b, c - 0.9, c + 0.9, 28.8, 33.4, 0.05)
      panel(dark, a, b, c - 0.9, c + 0.9, 34.1, 35.7, 0.05)
    }
  }
  // Shaft and base: corner and middle piers standing proud, so each face
  // reads as two tall blind panels.
  for (const [h, z0, z1] of [[5, 0, 15], [4.5, 15, 28]] as [number, number, number][]) {
    const r = rect(tx - h, ty - h, tx + h, ty + h)
    for (let i = 0; i < 4; i++) {
      const a = r[i], b = r[(i + 1) % 4], L = 2 * h
      for (const [s0, s1] of [[0, 0.9], [L / 2 - 0.45, L / 2 + 0.45], [L - 0.9, L]]) pier(stone, a, b, s0, s1, z0, z1 - 0.6, 0.3)
    }
  }

  const flood = (p: V3, n: V3) => {
    if (n[2] > 0.7) return 0.2
    if (Math.hypot(p[0] - TOWER[0], p[1] - TOWER[1]) < 6) return 0.4 + 0.5 * (p[2] / 38)
    if (p[1] < -37.5) return 0.8
    if (Math.hypot(p[0] - DOME[0], p[1] - DOME[1]) < 9.5 && p[2] > 26) return 0.7
    return 0.25
  }
  return [
    { part: stone, material: { ...finish('indiana-limestone', 0xecdcc6), floodlight: flood } },
    { part: roof, material: finish('pale-metal-roof', 0xb7bec4) },
    { part: win, material: PALETTE.window },
    { part: copper, material: { ...finish('dome-copper', 0x93a99d), floodlight: flood } },
    { part: gold, material: finish('gold', 0xd8b45a) },
    // bronze doors and the belfry's open voids: dark, unlit
    { part: dark, material: finish('dark-void', 0x4e5258) },
  ]
}

/** A pier standing `out` proud of wall a→b, from s0 to s1 along it, z0 to z1. */
function pier(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, o: number): XY => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o]
  block(p, p, [P(s0, -0.05), P(s0, out), P(s1, out), P(s1, -0.05)], z0, z1, 0)
}

/** A triangle or quad wound so that it faces along `n`. */
function oriented(p: Part, pts: V3[], n: V3) {
  const [a, b, c] = pts
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const q = g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0 ? pts : [...pts].reverse()
  if (q.length === 3) p.tri(q[0], q[1], q[2]); else p.quad(q[0], q[1], q[2], q[3])
}

/** A gable roof along y (x ±half, y0..y1), eaves z0, ridge z1, with end triangles in `end`. */
function gableY(roof: Part, end: Part, half: number, z0: number, z1: number, y0: number, y1: number) {
  const k = (z1 - z0) / half
  oriented(roof, [[half, y0, z0], [half, y1, z0], [0, y1, z1], [0, y0, z1]], [k, 0, 1])
  oriented(roof, [[-half, y0, z0], [-half, y1, z0], [0, y1, z1], [0, y0, z1]], [-k, 0, 1])
  oriented(end, [[half, y0, z0], [0, y0, z1], [-half, y0, z0]], [0, -1, 0])
  oriented(end, [[half, y1, z0], [0, y1, z1], [-half, y1, z0]], [0, 1, 0])
}

/** A gable roof along x (x0..x1) with ridge at y = yc, half-width `half`. */
function gableX(roof: Part, end: Part, x0: number, x1: number, yc: number, half: number, z0: number, z1: number) {
  const k = (z1 - z0) / half
  oriented(roof, [[x0, yc + half, z0], [x1, yc + half, z0], [x1, yc, z1], [x0, yc, z1]], [0, k, 1])
  oriented(roof, [[x0, yc - half, z0], [x1, yc - half, z0], [x1, yc, z1], [x0, yc, z1]], [0, -k, 1])
  oriented(end, [[x0, yc - half, z0], [x0, yc, z1], [x0, yc + half, z0]], [-1, 0, 0])
  oriented(end, [[x1, yc - half, z0], [x1, yc, z1], [x1, yc + half, z0]], [1, 0, 0])
}

/** The gabled top of the entrance front: a prism x0..x1, y0..y1, shoulders z0, apex z1. */
function gableFront(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const xm = (x0 + x1) / 2, k = (z1 - z0) / ((x1 - x0) / 2)
  for (const [y, n] of [[y0, -1], [y1, 1]] as [number, number][]) oriented(p, [[x0, y, z0], [xm, y, z1], [x1, y, z0]], [0, n, 0])
  oriented(p, [[x1, y0, z0], [x1, y1, z0], [xm, y1, z1], [xm, y0, z1]], [k, 0, 1])
  oriented(p, [[x0, y0, z0], [x0, y1, z0], [xm, y1, z1], [xm, y0, z1]], [-k, 0, 1])
}

/** A gold cross standing on (x, y) from z0 to z1, arms `w` wide, facing ±y and ±x alike. */
function cross(p: Part, x: number, y: number, z0: number, z1: number, w: number) {
  const t = 0.28
  block(p, p, rect(x - t, y - t, x + t, y + t), z0, z1, 0)
  const za = z1 - (z1 - z0) * 0.32
  block(p, p, rect(x - w / 2, y - t, x + w / 2, y + t), za - t, za + t, 0)
}

if (import.meta.main) await save('hou-sacred-heart-co-cathedral', 'Co-Cathedral of the Sacred Heart', [29.7499017, -95.3686743], 34.6, build())
