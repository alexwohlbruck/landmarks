/**
 * Old Town House (Burgerwachthuis, 1755-61), Greenmarket Square, Cape Town:
 * original procedural geometry, CC0-1.0.
 * bun generators/cpt-old-town-house.ts
 *
 * Also holds the small kit (boxOn, band, sash) used by this builder's other
 * cpt- models (City Hall, Groote Kerk, Castle of Good Hope): merge it first.
 * The Old Town House model is only written when this file runs itself.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/609226195,
 * lng 18.4198823, lat -33.9231258. Its walls run at 41.6 / 131.6 degrees;
 * the catalog bearing is 41.6, so in the model +y is the front on
 * Greenmarket Square (facing north-east), +x the long south-east side.
 *
 * What it is: the old burgher watch house, built 1755-61, later the town
 * hall (until City Hall opened in 1905), now the Iziko Michaelis Collection.
 * A two-storey Cape Rococo block: cream walls with white pilasters,
 * cornices and window surrounds; a projecting three-arch loggia in the
 * middle of the front with a balustraded balcony on its roof and a
 * round-headed door behind it; the medallion of the city arms above; a flat
 * roof behind a white parapet, and in the middle of the front the small
 * square white bell turret with arched openings and a little dome.
 *
 * Evidence:
 *  - plan: OSM way/609226195 (measured): front 17.4 m wide (x -8.4..9.0),
 *    21.3 m deep, a 5.3 x 3.2 m notch in the back south corner. No parts.
 *  - heights: no published height and no lidar here (USGS covers only the
 *    US). Estimated from the straight-on front photos (Ossewa, Rabich)
 *    scaled to the 17.4 m front: raised ground floor on a 1.3 m plinth,
 *    first-floor band at 7.3-7.9 m, cornice 11.7-12.3 m, parapet 12.9 m,
 *    turret 2.9 m wide with its cornice at 15.4 m and the dome's top at
 *    16.7 m. Bays: five to the front (windows at the ends, three arches of
 *    the loggia, the middle one wider and higher), centres read from
 *    Ossewa's photo at 1.4, 4.0, 8.0, 11.9 and 15.4 m from the west corner;
 *    the loggia projects about 1 m (Georgio's corner view). Eight bays down
 *    the south-east side (Georgio), assumed the same on the north-west.
 *  - colours from the daylight photos: walls the pale cream of Rabich's
 *    2024 photos (older photos show a stronger yellow), white trim, the
 *    windows' dark green frames and shutters as dark green panels, the
 *    small panes as slate window panels.
 *  - map terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s),
 *    so the ground was not read; the square is nearly flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Cape_Town_(ZA),_Iziko_Old_Town_House_Museum_--_2024_--_3524.jpg and
 *    --_3519.jpg (Dietmar Rabich, CC BY-SA 4.0): the front, straight on and
 *    from the north.
 *  - Old_Town_House,_Greenmarket_Square,_Cape_Town.JPG (Ossewa, CC BY-SA
 *    3.0): the front, straight on.
 *  - 800px-Old_Town_House_-_Le_Cap.jpg (Georgio, CC BY-SA 3.0): front and
 *    the south-east side from the east.
 *  - Old_Town_House_Greenmarket_Square,_Cape_Town.JPG (NegativeC, CC BY-SA
 *    3.0) and 9_2_018_0092-Greenmarket-Old_Town_House-The_Cape-s.jpg (Janek
 *    Szymanowski, CC BY-SA 3.0): front and side.
 *  - Old_Town_House,_Greenmarket_Square,_Cape_Town_WLM_2013_v1.JPG
 *    (Discott, CC BY-SA 3.0): the front from the north.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the steps and the brick stoep (ground), the scrolls, masks and
 * urn finials on the pilasters, the glazing bars, the lamps, the clock's
 * hands, the turret's bell.
 *
 * Doubts: the north-west side and the back are not in any photo used; they
 * are drawn like the south-east side. The turret's position (just behind
 * the front wall, on the centre line) is from the front photos.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { arcade } from './phl-independence-hall'
import { save, rect, lathe, walls, cap, inset, archOn, rectOn, discOn, face, along, ball, type XY } from './amsterdam-westerkerk'

// ---------------------------------------------------------------------------
// Kit for this builder's cpt- models.

/**
 * A box standing out from wall a→b (counter-clockwise ring): from s0 to s1
 * along it, z0 to z1 up it, d0 to d1 outside it. Bottom face optional.
 */
export function boxOn(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d0: number, d1: number, bottom = false) {
  const { P, n, u } = along(a, b)
  const N: V3 = [n[0], n[1], 0], U: V3 = [u[0], u[1], 0]
  face(p, [P(s0, z0, d1), P(s1, z0, d1), P(s1, z1, d1), P(s0, z1, d1)], N)
  face(p, [P(s0, z1, d0), P(s1, z1, d0), P(s1, z1, d1), P(s0, z1, d1)], [0, 0, 1])
  face(p, [P(s0, z0, d0), P(s0, z0, d1), P(s0, z1, d1), P(s0, z1, d0)], [-U[0], -U[1], 0])
  face(p, [P(s1, z0, d0), P(s1, z0, d1), P(s1, z1, d1), P(s1, z1, d0)], U)
  if (bottom) face(p, [P(s0, z0, d0), P(s1, z0, d0), P(s1, z0, d1), P(s0, z0, d1)], [0, 0, -1])
}

/** A moulded band round a ring (counter-clockwise), standing `out` proud, both edges chamfered. */
export function band(p: Part, r: XY[], z0: number, z1: number, out: number, b = Math.min(0.15, (z1 - z0) / 3, out)) {
  const o = inset(r, -out), i = inset(r, -(out - b))
  walls(p, i, z0, z0 + b, o)
  walls(p, o, z0 + b, z1 - b)
  walls(p, o, z1 - b, z1, i)
  // Top and underside: rings between the band's edge and the wall line.
  for (let k = 0; k < r.length; k++) {
    const l = (k + 1) % r.length
    p.quad([r[k][0], r[k][1], z1], [i[k][0], i[k][1], z1], [i[l][0], i[l][1], z1], [r[l][0], r[l][1], z1])
    p.quad([r[k][0], r[k][1], z0], [r[l][0], r[l][1], z0], [i[l][0], i[l][1], z0], [i[k][0], i[k][1], z0])
  }
}

/** A window with a flat white surround: frame in `trim`, glazing in `win`. */
export function sash(trim: Part | null, win: Part, a: XY, b: XY, c: number, hw: number, z0: number, z1: number, f = 0.18) {
  if (trim) rectOn(trim, a, b, c, hw + f, z0 - f, z1 + f, 0.05)
  rectOn(win, a, b, c, hw, z0, z1, 0.09)
}

/** Sides of a counter-clockwise ring as [a, b] pairs. */
export const edges = (r: XY[]): [XY, XY][] => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY])

/** Evenly spaced centres along a wall of length L, n of them, `end` from each end. */
export const spaced = (L: number, n: number, end: number) => Array.from({ length: n }, (_, i) => (n === 1 ? L / 2 : end + (i * (L - 2 * end)) / (n - 1)))

export const floodWalls = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.25 : 0.85)

export const CPT_CREDITS = 'OnlyHudson (creator), Claude (Claude Opus 5.5, procedural modeling)'

// ---------------------------------------------------------------------------
// Old Town House

function build() {
  const wall = new Part(), trim = new Part(), roof = new Part(), win = new Part(), green = new Part(), shade = new Part()

  const X0 = -8.4, X1 = 9.0, YB = -11.1, YF = 9.0, YP = 10.2, YR = 7.0 // main front wall; the loggia's front on OSM's line; the loggia's back wall
  const NX = 3.6, NY = -7.9 // the notch in the back corner
  const C = 0.3 // centre line of the front
  const PL = 1.3, BELT0 = 7.3, BELT1 = 7.9, COR0 = 11.7, COR1 = 12.3, PAR = 12.9
  const ring: XY[] = [[X0, YB], [NX, YB], [NX, NY], [X1, NY], [X1, YF], [X0, YF]]

  const LX0 = C - 5.9, LX1 = C + 5.9, LZ = BELT1
  const LI0 = LX0 + 0.8, LI1 = LX1 - 0.8 // the loggia's inside
  const ringG: XY[] = [[X0, YB], [NX, YB], [NX, NY], [X1, NY], [X1, YF], [LI1, YF], [LI1, YR], [LI0, YR], [LI0, YF], [X0, YF]]
  // Body (the ground floor with the loggia cut into it), plinth,
  // first-floor band, cornice, parapet, roof.
  walls(wall, ringG, 0, BELT0)
  walls(wall, ring, BELT0, COR0)
  cap(wall, rect(LI0, YR, LI1, YF), BELT0, false)
  band(trim, ring, 0, PL, 0.08, 0.06)
  band(trim, ring, BELT0, BELT1, 0.14)
  band(trim, ring, COR0, COR1, 0.32)
  {
    const pi = inset(ring, 0.35)
    walls(trim, ring, COR1, PAR)
    walls(trim, [...pi].reverse(), COR1 - 0.4, PAR)
    for (let k = 0; k < ring.length; k++) {
      const l = (k + 1) % ring.length
      trim.quad([ring[k][0], ring[k][1], PAR], [ring[l][0], ring[l][1], PAR], [pi[l][0], pi[l][1], PAR], [pi[k][0], pi[k][1], PAR])
    }
    cap(roof, pi, COR1 - 0.4)
  }

  const [S, E, N2, E2, F, W] = edges(ring) // back, notch side, notch back, south-east side, front, north-west side
  void N2
  // Front: a point at x on the front wall a→b runs from x = X1 to X0.
  const fx = (x: number) => X1 - x
  const fa = F[0], fb = F[1]

  // Pilasters (white strips) on the front: corners and either side of the
  // middle window upstairs.
  for (const x of [X0 + 0.45, X1 - 0.45]) {
    boxOn(trim, fa, fb, fx(x) - 0.4, fx(x) + 0.4, PL, COR0, 0, 0.18)
  }
  for (const d of [-1.85, 1.85, -5.6, 5.6]) boxOn(trim, fa, fb, fx(C + d) - 0.32, fx(C + d) + 0.32, BELT1, COR0, 0, 0.15)
  // Upstairs windows with hoods, and the round-headed door to the balcony.
  for (const d of [-3.95, 3.95, -7.15, 7.15]) {
    sash(trim, win, fa, fb, fx(C + d), 0.82, 8.5, 11.05)
    boxOn(trim, fa, fb, fx(C + d) - 1.1, fx(C + d) + 1.1, 11.2, 11.5, 0, 0.22)
  }
  archOn(trim, fa, fb, fx(C), 1.05, 8.3, 9.9, 0.05, 10)
  archOn(win, fa, fb, fx(C), 0.85, 8.4, 9.9, 0.09, 10)
  // The medallion with the city arms between the cornice and the door.
  discOn(trim, fa, fb, fx(C), 11.2, 0.62, 0.12, 12)
  discOn(green, fa, fb, fx(C), 11.2, 0.38, 0.16, 10)
  // Ground floor end bays: windows over dark green shutters.
  for (const d of [-7.15, 7.15]) {
    sash(trim, win, fa, fb, fx(C + d), 0.7, 4.0, 6.0)
    rectOn(green, fa, fb, fx(C + d), 0.7, PL + 0.2, 3.9, 0.09)
  }

  // The loggia: an arcade standing 1.2 m out from the front, three arches
  // (the middle one wider and higher), the balcony on its roof; behind the
  // arches the recessed loggia with the doors.
  const lr = rect(LX0, YF, LX1, YP)
  const arches = [{ c: C, hw: 1.9, zs: 4.75 }, { c: C - 3.95, hw: 1.3, zs: 4.45 }, { c: C + 3.95, hw: 1.3, zs: 4.45 }]
  arcade(wall, (u, w, z) => [u, YP - w, z], LX0, LX1, YP - YF, PL, BELT0, arches, 10, true)
  walls(wall, lr, 0, PL)
  band(trim, lr, 0, PL, 0.08, 0.06)
  band(trim, lr, BELT0, LZ, 0.16)
  cap(roof, inset(lr, 0.3), LZ)
  const LF = edges(lr)[2] // front of the loggia, a→b from x1 to x0
  const lx = (x: number) => LX1 - x
  for (const { c, hw, zs } of arches) {
    // White archivolt round each opening, and its imposts.
    const { P, n } = along(LF[0], LF[1]), N: V3 = [n[0], n[1], 0]
    const s0 = lx(c), seg = 10
    for (let k = 0; k < seg; k++) {
      const t0 = (k / seg) * Math.PI, t1 = ((k + 1) / seg) * Math.PI
      const q = (t: number, r: number) => P(s0 + r * Math.cos(t), zs + r * Math.sin(t), 0.06)
      face(trim, [q(t0, hw), q(t0, hw + 0.38), q(t1, hw + 0.38), q(t1, hw)], N)
    }
    boxOn(trim, LF[0], LF[1], s0 - hw - 0.3, s0 - hw + 0.02, zs - 0.3, zs, 0, 0.1)
    boxOn(trim, LF[0], LF[1], s0 + hw - 0.02, s0 + hw + 0.3, zs - 0.3, zs, 0, 0.1)
  }
  for (const x of [LX0 + 0.42, LX1 - 0.42, C - 2.45, C + 2.45]) boxOn(trim, LF[0], LF[1], lx(x) - 0.36, lx(x) + 0.36, PL, BELT0, 0, 0.2)
  // Doors in the loggia's back wall: the arched main door, windows over
  // green doors either side.
  {
    const bw: [XY, XY] = [[LI1, YR], [LI0, YR]]
    const bx = (x: number) => LI1 - x
    // The loggia's inside reads shaded in every photo: its walls and ceiling
    // are a darker cream.
    rectOn(shade, bw[0], bw[1], (LI1 - LI0) / 2, (LI1 - LI0) / 2, 0, BELT0, 0.02)
    rectOn(shade, [LI0, YR], [LI0, YF], (YF - YR) / 2, (YF - YR) / 2, 0, BELT0, 0.02)
    rectOn(shade, [LI1, YF], [LI1, YR], (YF - YR) / 2, (YF - YR) / 2, 0, BELT0, 0.02)
    cap(shade, rect(LI0, YR, LI1, YP - 0.3), BELT0 - 0.02, false)
    archOn(trim, bw[0], bw[1], bx(C), 1.15, PL, 3.9, 0.05, 10)
    archOn(green, bw[0], bw[1], bx(C), 0.9, PL, 3.9, 0.09, 10)
    for (const d of [-3.95, 3.95]) {
      sash(trim, win, bw[0], bw[1], bx(C + d), 0.65, 3.9, 5.4)
      rectOn(green, bw[0], bw[1], bx(C + d), 0.65, PL, 3.8, 0.09)
    }
  }
  // Balcony on the loggia's roof: balustrade round its three open sides,
  // pedestals at the corners and either side of the middle.
  {
    const E3 = edges(lr)
    for (const k of [1, 2, 3]) {
      const [a, b] = E3[k], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      boxOn(trim, a, b, 0, L, LZ, LZ + 0.9, -0.28, 0)
    }
    for (const x of [LX0 + 0.35, LX1 - 0.35, C - 1.7, C + 1.7]) boxOn(trim, LF[0], LF[1], lx(x) - 0.33, lx(x) + 0.33, LZ, LZ + 1.15, -0.4, 0.04)
  }

  // Sides: eight bays down the south-east side and the north-west side,
  // windows upstairs, windows over shutters downstairs, pilasters at the
  // corners and every second bay.
  for (const [a, b] of [E2, W]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.round((L - 2.0) / 2.3)
    const cs = spaced(L, n, 1.6)
    cs.forEach((s, i) => {
      sash(trim, win, a, b, s, 0.62, 8.7, 10.9)
      sash(trim, win, a, b, s, 0.62, 4.1, 6.0)
      rectOn(green, a, b, s, 0.62, PL + 0.2, 4.0, 0.09)
      boxOn(trim, a, b, s - 0.85, s + 0.85, 11.05, 11.32, 0, 0.18)
      if (i < cs.length - 1 && i % 2 === 1) boxOn(trim, a, b, (s + cs[i + 1]) / 2 - 0.28, (s + cs[i + 1]) / 2 + 0.28, PL, COR0, 0, 0.14)
    })
    boxOn(trim, a, b, 0.05, 0.75, PL, COR0, 0, 0.16)
    boxOn(trim, a, b, L - 0.75, L - 0.05, PL, COR0, 0, 0.16)
  }
  // Back and the notch: a few plain windows.
  for (const [a, b] of [S, E]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    for (const s of spaced(L, Math.max(1, Math.round(L / 3.2)), 1.8)) {
      sash(trim, win, a, b, s, 0.6, 8.7, 10.9)
      sash(trim, win, a, b, s, 0.6, 4.1, 6.0)
    }
  }

  // The bell turret on the parapet, centred on the front: a pedestal, a
  // square shaft with cut corners and an arched opening each way, a flared
  // cornice and the dome with a small finial.
  const TX = C, TY = YF - 1.9, TH = 1.55
  const sqr = (h: number, ch: number): XY[] => [
    [TX + h - ch, TY - h], [TX + h, TY - h + ch], [TX + h, TY + h - ch], [TX + h - ch, TY + h],
    [TX - h + ch, TY + h], [TX - h, TY + h - ch], [TX - h, TY - h + ch], [TX - h + ch, TY - h],
  ]
  const ped = sqr(TH + 0.25, 0.35)
  walls(trim, ped, COR1 - 0.4, PAR + 0.5)
  cap(trim, ped, PAR + 0.5)
  const shaft = sqr(TH, 0.4)
  walls(trim, shaft, PAR + 0.5, 15.0)
  for (const [a, b] of edges(shaft)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1.5) continue
    archOn(win, a, b, L / 2, 0.42, 13.5, 14.35, 0.04, 8)
  }
  band(trim, sqr(TH, 0.4), 15.0, 15.45, 0.3, 0.12)
  lathe(trim, TX, TY, [[1.25, 15.45], [1.3, 15.6], [1.22, 15.95], [1.0, 16.3], [0.6, 16.6], [0, 16.72]], 16)
  ball(trim, TX, TY, 16.85, 0.13, 6)
  // Two urn-like finials on the parapet either side of the turret.
  for (const d of [-2.4, 2.4]) {
    boxOn(trim, fa, fb, fx(C + d) - 0.3, fx(C + d) + 0.3, PAR - 0.2, PAR + 0.35, -0.6, 0)
    ball(trim, C + d, YF - 0.3, PAR + 0.6, 0.27, 6)
  }

  return [
    { part: wall, material: { ...finish('oth-cream', 0xeedfae), floodlight: floodWalls } },
    { part: trim, material: { ...finish('oth-white', 0xf7f2e8), floodlight: floodWalls } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: green, material: finish('oth-green', 0x4d6b5c) },
    { part: shade, material: finish('oth-loggia', 0xb8a87e) },
  ]
}

if (import.meta.main) await save('cpt-old-town-house', 'Old Town House', [-33.9231258, 18.4198823], 41.6, build())
