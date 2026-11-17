/**
 * Castle of Good Hope (Kasteel de Goede Hoop, 1666-79), Cape Town:
 * original procedural geometry, CC0-1.0.
 * bun generators/cpt-castle-of-good-hope.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outer way/8035421 of
 * relation/57263, lng 18.4277155, lat -33.9258792. Bearing 0: the fort is
 * a pentagon and is built straight in the map frame.
 *
 * What it is: the Dutch East India Company's five-bastioned star fort, the
 * oldest surviving colonial building in South Africa. From above it is a
 * five-pointed star: dark grey rubble-stone walls (Malmesbury shale) rising
 * from the moat, a red-brick parapet along their tops, grassed ramparts and
 * bastions behind it; inside, ochre-yellow buildings round two courtyards,
 * divided by the long cross wing (the Kat, with its balcony). The main gate
 * (1682) faces the Grand Parade on the north-west curtain: a grey stone
 * portal with a pediment, and behind it the brick bell tower with its
 * domed belfry. The bastions are Leerdam (west, by the gate), Oranje,
 * Nassau, Catzenellenbogen and Buuren.
 *
 * Evidence:
 *  - plan: OSM relation/57263 (measured): the star outline way/8035421
 *    (simplified to 0.6 m), the two courtyards way/28912980 and
 *    way/28912981 (simplified to 1.8 m), the building in the south
 *    courtyard way/424911893. Across the points about 230 m.
 *  - heights: OSM tags the relation 13.5 m and its wall parts 9 m (skillion
 *    0.5 m), the inner ranges 8.5-10 m (e.g. 424845803 Secunde's House
 *    10 m), the gate parts 9 m, the bell tower's dome 12.5 m. Drawn: the
 *    stone walls to a cordon at 7.6 m, the brick parapet to 9.4 m, the
 *    rampart behind it at 7.9 m; the ranges round
 *    the courtyards 10 m, 8 m deep (estimated from Debbielouise's aerial
 *    photo and the courtyard photos); the bell tower 3.4 m square, its
 *    belfry to 14.6 m and the dome and vane to 19 m, estimated from Bernard
 *    Gagnon's photo of the gate scaled to the 9 m wall (OSM's 12.5 m reads
 *    low against that photo; the photo was preferred).
 *  - colours from the daylight photos: the grey shale of the walls pulled
 *    to the palette's lightness, the red-brown brick parapet, ochre-yellow
 *    lime-washed ranges, grey roofs, the grassed ramparts as a muted green.
 *  - map terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s).
 *    The site is flat reclaimed ground. Elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - The_Castle_of_Good_Hope_Cape_Town_-_Arial_view.JPG (Debbielouise,
 *    CC BY-SA 3.0): from a tower to the west: the star, the grassed
 *    ramparts, the yellow ranges and the Kat.
 *  - Castle_of_Good_Hope,_Cape_Town_01.jpg to _04.jpg (Bernard Gagnon,
 *    CC BY-SA 4.0): the gate and bell tower, the courtyard ranges and the
 *    Kat balcony, the brick parapet.
 *  - Cape_Town's_Castle_of_Good_Hope.jpg (Witstinkhout, CC BY-SA 3.0) and
 *    Castle_of_Good_Hope_Cape_Town.jpg (Mattias Hill, CC BY-SA 3.0): the
 *    walls over the moat.
 *  - The_Castle_of_Good_Hope_Cape_Town_-_View_of_Leerdam_1.JPG and - View
 *    of Oranje.JPG (Debbielouise, CC BY-SA 3.0): bastions.
 *  - Castle_of_Good_Hope,_Cape_Town,_South_Africa.jpg (CivArmy, CC BY-SA
 *    4.0): a curtain wall from across the moat.
 *  - Cape_Town,_Castle_Of_Good_Hope_-_panoramio_(2).jpg (scott marsland,
 *    CC BY 3.0): the approach and gate.
 *  - Castle_of_good_hope_cape_town_02.jpg and _14.jpg (Nkansahrexford,
 *    CC BY-SA 4.0): panoramas on a bastion.
 * No commercial imagery. No look-only sources.
 *
 * Drawn coarser than real: the ranges round the courtyards are drawn as
 * one 8 m deep, 10 m range along each courtyard side, flat-roofed, with two
 * rows of windows; the Kat's balcony and the courtyard stairs are left
 * out, as are the moat, the lawns, the outworks, the sentry boxes, the
 * cannon and the embrasures. The gate passage is drawn closed.
 *
 * Doubts: the lead's notes call the walls ochre-yellow; every photo shows
 * the outer walls dark grey stone under a red-brick parapet, and only the
 * inner buildings yellow, so that is what is drawn. The ranges' roofs are
 * drawn flat and grey (the aerial photo shows grey roofs but not their
 * pitch).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, lathe, walls, cap, inset, rectOn, face, along, ball, archOn, pyramid, type XY } from './amsterdam-westerkerk'
import { triangulate } from './chi-aon-center'
import { pedimentOn } from './phl-independence-hall'
import { boxOn, band, edges } from './cpt-old-town-house'

// ---- plan (OSM, metres from the anchor)
const STAR: XY[] = [[-12.2, -90.3], [-15.5, -77.1], [48.7, -62.1], [51.8, -74.8], [93.3, -79.3], [82.7, -38.9], [68.9, -38.2], [73.7, 27.4], [87.5, 26.4], [104.7, 65.2], [62.4, 67.3], [56.6, 53.0], [-4.2, 78.1], [1.1, 90.9], [-29.3, 119.4], [-43.8, 79.8], [-33.3, 70.4], [-54.0, 46.6], [-55.1, 47.5], [-58.9, 43.2], [-57.8, 42.3], [-76.6, 21.5], [-87.0, 30.4], [-123.0, 9.0], [-89.1, -16.9], [-77.9, -9.9], [-43.3, -65.5], [-55.2, -72.6], [-46.7, -113.1]]
const COURT_N: XY[] = [[-14.8, 0.2], [-15.3, 6.7], [-12.7, 7.8], [-8.5, 4.2], [47.9, 39.6], [55.0, 35.0], [60.0, 38.2], [13.9, 57.0], [13.0, 54.8], [9.6, 56.1], [10.5, 58.4], [-16.7, 70.4], [-21.8, 64.4], [-20.1, 62.9], [-42.9, 36.9], [-44.6, 38.4], [-48.4, 34.1], [-46.7, 32.6], [-69.8, 6.9], [-58.9, -11.6], [-55.8, -12.2], [-57.7, -13.4], [-48.0, -29.5], [-42.7, -26.1], [-47.8, -18.0], [-37.4, -14.0], [-39.2, -11.2], [-34.2, -8.0], [-32.4, -10.8]]
const COURT_S: XY[] = [[60.7, 35.9], [56.3, 33.1], [55.6, 23.7], [-24.4, -28.0], [-37.5, -34.6], [-41.6, -28.1], [-46.8, -31.4], [-25.1, -66.2], [55.0, -47.9], [55.0, -38.6], [52.6, -38.4], [53.1, -31.9], [55.4, -32.0]]
const INNER_BLD: XY[] = [[-27.6, -52.3], [-29.0, -53.1], [-27.2, -56.1], [-25.9, -55.3], [-21.2, -63.2], [-8.9, -56.1], [-7.9, -57.8], [3.5, -51.3], [5.1, -55.1], [17.2, -52.4], [2.5, -20.7], [-11.8, -29.4], [-10.0, -32.5], [-8.8, -31.8], [-1.3, -44.8], [-20.3, -55.7], [-27.8, -42.8], [-26.6, -42.1], [-28.4, -39.0], [-33.6, -42.0]]

const WALL = 8.3, PAR = 9.4, RANGE = 10.0, DEPTH = 8.0

const segCross = (a: XY, b: XY, c: XY, d: XY) => {
  const o = (p: XY, q: XY, r: XY) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
  const d1 = o(a, b, c), d2 = o(a, b, d), d3 = o(c, d, a), d4 = o(c, d, b)
  return d1 * d2 < -1e-9 && d3 * d4 < -1e-9
}

/** Join counter-clockwise holes into a counter-clockwise outer ring with zero-width bridges. */
function bridge(outer: XY[], holes: XY[][]): XY[] {
  let ring = [...outer]
  const rest = holes.map((h) => [...h].reverse()) // holes run clockwise in the joined ring
  while (rest.length) {
    let best: [number, number, number, number] | null = null
    for (let hi = 0; hi < rest.length; hi++) {
      const h = rest[hi]
      for (let j = 0; j < h.length; j++) for (let i = 0; i < ring.length; i++) {
        const d = Math.hypot(h[j][0] - ring[i][0], h[j][1] - ring[i][1])
        if (best && d >= best[0]) continue
        const segs: [XY, XY][] = []
        for (const r of [ring, ...rest]) for (let k = 0; k < r.length; k++) segs.push([r[k], r[(k + 1) % r.length]])
        if (segs.some(([p, q]) => segCross(ring[i], h[j], p, q))) continue
        best = [d, hi, j, i]
      }
    }
    if (!best) throw new Error('no bridge')
    const [, hi, j, i] = best
    const h = rest.splice(hi, 1)[0]
    const loop = [...h.slice(j), ...h.slice(0, j), h[j]]
    ring = [...ring.slice(0, i + 1), ...loop, ring[i], ...ring.slice(i + 1)]
  }
  return ring
}

function build() {
  const stone = new Part(), brick = new Part(), yellow = new Part(), green = new Part(), roof = new Part(), win = new Part()

  // ------------------------------------------------- walls and ramparts
  // The shale walls from the moat to the cordon, the brick parapet on them,
  // the grassed rampart behind.
  // (Gagnon's and Witstinkhout's photos: the brick is about a fifth of the
  // wall's height.)
  const CORD = 7.6
  walls(stone, STAR, 0, CORD)
  band(stone, STAR, CORD - 0.45, CORD, 0.12, 0.05)
  const pin = inset(STAR, 1.0)
  walls(brick, STAR, CORD, PAR)
  walls(brick, [...pin].reverse(), WALL - 0.4, PAR)
  for (let k = 0; k < STAR.length; k++) {
    const l = (k + 1) % STAR.length
    brick.quad([STAR[k][0], STAR[k][1], PAR], [STAR[l][0], STAR[l][1], PAR], [pin[l][0], pin[l][1], PAR], [pin[k][0], pin[k][1], PAR])
  }
  {
    const top = bridge(pin, [COURT_N, COURT_S])
    for (const [a, b, c] of triangulate(top)) {
      const A: V3 = [top[a][0], top[a][1], WALL - 0.4], B: V3 = [top[b][0], top[b][1], WALL - 0.4], C: V3 = [top[c][0], top[c][1], WALL - 0.4]
      green.tri(A, B, C)
    }
  }

  // ------------------------------------------- ranges round the courtyards
  // One 8 m deep range along each courtyard side longer than 6 m: yellow
  // walls with two rows of windows to the courtyard, a grey roof.
  let alt = 0
  for (const court of [COURT_N, COURT_S]) {
    for (const [a, b] of edges(court)) {
      const { L, u, n } = along(a, b)
      if (L < 6) continue
      // The Kat, the cross wing between the courtyards, stands higher.
      const kat = (a[0] === -8.5 && b[0] === 47.9) || (a[0] === 55.6 && b[0] === -24.4)
      const h = kat ? 11.8 : RANGE + (alt++ % 2) * 0.15
      // n points out of the courtyard, into the range.
      const P = (s: number, d: number, z: number): V3 => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d, z]
      const s0 = -0.3, s1 = L + 0.3
      face(yellow, [P(s0, 0, 0), P(s1, 0, 0), P(s1, 0, h), P(s0, 0, h)], [-n[0], -n[1], 0])
      face(yellow, [P(s0, DEPTH, WALL - 0.5), P(s1, DEPTH, WALL - 0.5), P(s1, DEPTH, h), P(s0, DEPTH, h)], [n[0], n[1], 0])
      face(yellow, [P(s0, 0, 0), P(s0, DEPTH, 0), P(s0, DEPTH, h), P(s0, 0, h)], [-u[0], -u[1], 0])
      face(yellow, [P(s1, 0, 0), P(s1, DEPTH, 0), P(s1, DEPTH, h), P(s1, 0, h)], [u[0], u[1], 0])
      face(roof, [P(s0, -0.25, h), P(s1, -0.25, h), P(s1, DEPTH, h), P(s0, DEPTH, h)], [0, 0, 1])
      // eaves line
      face(roof, [P(s0, -0.25, h - 0.35), P(s1, -0.25, h - 0.35), P(s1, -0.25, h), P(s0, -0.25, h)], [-n[0], -n[1], 0])
      // windows to the courtyard, two storeys
      const nw = Math.floor((L - 2) / 3.6)
      const rb: [XY, XY] = [b, a] // the wall seen from the courtyard
      for (let i = 0; i < nw; i++) {
        const s = L / 2 + (i - (nw - 1) / 2) * 3.6
        rectOn(win, rb[0], rb[1], L - s, 0.6, 1.6, 3.4, 0.06)
        rectOn(win, rb[0], rb[1], L - s, 0.6, 5.4, 7.3, 0.06)
      }
    }
  }
  // The building standing in the south courtyard.
  walls(yellow, INNER_BLD, 0, 9.5)
  cap(roof, INNER_BLD, 9.5)
  for (const [a, b] of edges(INNER_BLD)) {
    const { L } = along(a, b)
    if (L < 8) continue
    for (let s = 2.5; s < L - 1.5; s += 3.6) {
      rectOn(win, a, b, s, 0.55, 1.6, 3.4, 0.06)
      rectOn(win, a, b, s, 0.55, 5.4, 7.2, 0.06)
    }
  }

  // --------------------------------------------------- gate and bell tower
  // The portal on the gate's projecting face (OSM's notch in the north-west
  // curtain): pilasters, the arched opening, a pediment over it.
  {
    const a: XY = [-55.1, 47.5], b: XY = [-58.9, 43.2]
    const { L } = along(a, b)
    const c = L / 2
    boxOn(stone, a, b, c - 3.3, c + 3.3, 0, 7.6, 0, 0.7)
    archOn(win, a, b, c, 1.5, 0, 3.4, 0.74, 10)
    for (const d of [-2.6, 2.6]) boxOn(stone, a, b, c + d - 0.4, c + d + 0.4, 0, 7.0, 0.7, 1.0)
    boxOn(stone, a, b, c - 3.5, c + 3.5, 7.0, 7.6, 0.7, 1.05)
    pedimentOn(stone, a, b, c, 3.3, 7.6, 9.6, 0.9)
    // Sentry boxes either side, yellow.
    const { P, u } = along(a, b)
    for (const d of [-5.2, 5.2]) {
      const p = P(c + d, 0, 1.8)
      const r = rect(p[0] - 1.0, p[1] - 1.0, p[0] + 1.0, p[1] + 1.0)
      walls(yellow, r, 0, 3.2)
      pyramid(yellow, r, 3.2, [p[0], p[1], 4.4])
    }
    void u
  }
  {
    const TX = -55.8, TY = 44.2, h = 2.0
    const r = rect(TX - h, TY - h, TX + h, TY + h)
    walls(brick, r, WALL - 0.4, 14.4)
    band(stone, r, 14, 14.5, 0.25)
    const r2 = rect(TX - h + 0.15, TY - h + 0.15, TX + h - 0.15, TY + h - 0.15)
    walls(brick, r2, 14.5, 16.6)
    for (const [a, b] of edges(r2)) archOn(win, a, b, h - 0.15, 0.7, 14.8, 15.9, 0.06, 6)
    for (const [a, b] of edges(r)) archOn(win, a, b, h, 0.45, 11.4, 12.6, 0.06, 6)
    band(stone, r2, 16.4, 16.9, 0.3)
    lathe(roof, TX, TY, [[2.0, 16.9], [1.95, 17.4], [1.55, 18], [0.85, 18.45], [0.3, 18.6], [0, 18.65]], 12)
    lathe(stone, TX, TY, [[0.35, 18.55], [0.35, 19.1], [0, 19.1]], 6)
    ball(stone, TX, TY, 19.35, 0.25, 6)
    lathe(roof, TX, TY, [[0.08, 19.5], [0.08, 20.4], [0, 20.4]], 4)
    face(roof, [[TX - 0.6, TY, 19.85], [TX + 0.6, TY, 19.85], [TX + 0.6, TY, 20], [TX - 0.6, TY, 20]], [0, -1, 0])
  }

  const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.7)
  return [
    { part: stone, material: { ...finish('castle-shale', 0x8f8d86), floodlight: flood } },
    { part: brick, material: { ...finish('castle-brick', 0xa8705c), floodlight: flood } },
    { part: yellow, material: finish('castle-ochre', 0xe3c97e) },
    { part: green, material: finish('castle-rampart-grass', 0xa3b38e) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('cpt-castle-of-good-hope', 'Castle of Good Hope', [-33.9258792, 18.4277155], 0, build(), 6500)
