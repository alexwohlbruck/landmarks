/**
 * Cape Town City Hall (1900-05, Harry Austin Reid and Frederick George
 * Green), Darling Street on the Grand Parade, Cape Town: original
 * procedural geometry, CC0-1.0.
 * bun generators/cpt-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/1524822758,
 * lng 18.4237319, lat -33.9253999. Its walls run at 40.3 / 130.3 degrees;
 * the catalog bearing is 40.3, so in the model +y is the main front on
 * Darling Street and the Grand Parade (facing north-east), +x the
 * south-east end, -x the Corporation Street end.
 *
 * Identity, in order: the clock tower rising from the middle of the
 * building behind the central pediment (a square shaft, a columned stage
 * with a balustrade, the clock stage with a dial and a small pediment on
 * each face and obelisks at its corners, and the octagonal ogee dome with
 * its lantern and spike); the long honey-coloured Bath-stone front of two
 * storeys of arched windows under a balustrade, with the pedimented and
 * columned centre block and its entrance porch; the end pavilions with
 * their tall dark slate roofs and curved Dutch gables; the slate mansard
 * roofs of the wings with their dormers; grey granite at the base. At night
 * the stone is floodlit and the dials glow.
 *
 * Evidence:
 *  - plan and heights: OSM (measured; a detailed 3D mapping of the
 *    building, ~200 building:parts with heights). Used, simplified to
 *    rectangles: the end pavilions 1524822820 / 1524822896 (17.28 m, slate
 *    roofs 1524822853 / 1524822894 to 25.28 m, Dutch gables 1524822852 /
 *    1524822890 and side gables 1525418610 / 1525418611 to 22.7 m); the
 *    wings 1524822834 / 1524822895 (17.28 m, balustrades to 18.58 m,
 *    gambrel roofs 1524822843 / 1524822869 to 22.6 m, eight dormers
 *    1524822835-1524822868 to 19.79 m); the centre block 1524822945 /
 *    1524822871 (16.36 / 20.3 m, pediment roof 1524822957 to 23.82 m,
 *    giant columns 1524822952-955 from 4.3 m); the entrance porch
 *    1524822956 (to 9.58 m, columns 1524822946-949, balustrade 10.77 m);
 *    the auditorium 1524822791 (18.16 m, hipped roof 1524822788 to 23.1 m),
 *    the north-west back range 1524822787 (14.62 m, roof 1524822792 to
 *    19.73 m), the lower ranges at 9.58 m and the Corporation Street porch
 *    1524822818 / 1524822900. The tower: shaft 1525826386 (0-28.44 m,
 *    10.2 x 9.7 m), its platform 1524822944 and balustrade 1525826378-385
 *    (to 30.24 m), the columned stage 1524822943 (8.3 x 7.8 m, to
 *    38.75 m), slab 1524822939, the clock stage 1524822940 (7.3 x 6.8 m,
 *    to 48.02 m), the octagonal drum 1524822936 / 1524822942 (to 49.6 m),
 *    the ogee dome rings 1524822911-935 (to 54.5 m), the lantern
 *    1524822767 and the spike 1524822766 to 59.61 m.
 *  - photos checked against OSM: the tower's top at about 59 m agrees with
 *    David Stanley's straight-on front photo scaled to the 85 m front
 *    (allowing for the tower standing 20 m behind it).
 *  - estimated from the photos: window bays (five to each wing, three to
 *    each pavilion and to the centre block), arched windows on both
 *    storeys, the dial (about 2.8 m across), the Dutch gables' outline,
 *    the obelisks on the clock stage, the pavilion roofs' finials.
 *  - colours from the daylight photos: honey sandstone, pulled to the
 *    palette's lightness; the grey granite of the base and the pavilions'
 *    ground storey; dark grey slate; white dials.
 *  - map terrain: Mapterhorn has no z15 tiles here (tools/terrain.ts 404s).
 *    The Grand Parade is nearly flat. Elevation 0.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Cape_Town_City_Hall_(16513659039).jpg (David Stanley, CC BY 2.0): the
 *    whole front straight on from the Grand Parade.
 *  - CapeTown_CityHall.jpg (Martinvl, CC BY-SA 4.0): the front from the
 *    north-east, from above.
 *  - Cape_Town_City_Hall_jeh.jpg (Jim.henderson, CC BY-SA 4.0): the front.
 *  - Cape_Town_City_Hall_2014.jpg and _2014_2.jpg (Mike Peel, CC BY-SA
 *    4.0): the south-east end and the front from the east.
 *  - CT_City_Hall_with_Drill_Hall.jpg (Magemu, CC BY-SA 4.0): from the
 *    north, from above.
 *  - Cape_Town,_assorted_-_CapeTown4059.jpg (lumoplank, CC0): from the east
 *    with the roofs.
 *  - City_Hall,_Cape_Town.jpg (Danie van der Merwe, CC BY 2.0): from the
 *    north, from above.
 *  - Cape_Town_City_Hall,_from_Korporasiestraat.JPG (Ossewa, CC BY-SA
 *    3.0): the Corporation Street porch.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the sculpture in the pediment, the carving, the balusters
 * (drawn as solid bands), the glazing bars, the chimneys, the flagpoles,
 * the Mandela statue and the steps (ground).
 *
 * Doubts: the back (south-west) side and the auditorium's roof are seen
 * only from far off; their windows are drawn plainly. OSM's small parts
 * (pilasters, steps, kerbs) are folded into the larger blocks.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, rect, lathe, walls, cap, inset, rectOn, discOn, face, along, ball, wallSlab, hipRoof, pyramid, archOn, sidesOf, column, type XY } from './amsterdam-westerkerk'
import { pedimentOn } from './phl-independence-hall'
import { boxOn, band, edges, spaced } from './cpt-old-town-house'

type Side = 'S' | 'E' | 'N' | 'W'

function build() {
  const stone = new Part(), trim = new Part(), slate = new Part(), win = new Part(), granite = new Part()

  /** A point along side k of rect r at world coordinate c (x for N/S, y for E/W). */
  const sideS = (r: XY[], k: Side, c: number) => {
    const s = sidesOf(r)[k]
    return { a: s[0], b: s[1], s: k === 'S' ? c - r[0][0] : k === 'N' ? r[2][0] - c : k === 'E' ? c - r[1][1] : r[3][1] - c }
  }
  const aw = (p: Part, r: XY[], k: Side, c: number, hw: number, z0: number, zs: number, out = 0.08) => {
    const { a, b, s } = sideS(r, k, c)
    archOn(p, a, b, s, hw, z0, zs, out, 6)
  }
  const box = (p: Part, r: XY[], k: Side, c0: number, c1: number, z0: number, z1: number, d0: number, d1: number) => {
    const A = sideS(r, k, c0), B = sideS(r, k, c1)
    boxOn(p, A.a, A.b, Math.min(A.s, B.s), Math.max(A.s, B.s), z0, z1, d0, d1)
  }
  /** A block: walls, granite plinth, cornice and a flat roof. */
  const block = (r: XY[], h: number, cornice = true, roofZ: number | null = h) => {
    walls(stone, r, 0, h)
    band(granite, r, 0, 1.2, 0.08, 0.05)
    if (cornice) band(trim, r, h - 0.55, h, 0.3)
    if (roofZ !== null) cap(slate, inset(r, 0.05), roofZ)
  }
  /** A solid balustrade on a rect's chosen sides. */
  const balustrade = (r: XY[], ks: Side[], z0: number, z1: number) => {
    for (const k of ks) {
      const [a, b] = sidesOf(r)[k]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      boxOn(trim, a, b, 0, L, z0, z1, -0.45, 0)
    }
  }
  /** A prism along x from a (y, z) profile (convex), with end caps. */
  const prismX = (p: Part, prof0: XY[], x0: number, x1: number) => {
    const ar = prof0.reduce((t, q, i) => { const r = prof0[(i + 1) % prof0.length]; return t + q[0] * r[1] - r[0] * q[1] }, 0)
    const prof = ar < 0 ? [...prof0].reverse() : prof0
    for (let i = 0; i < prof.length; i++) {
      const [y0, z0] = prof[i], [y1, z1] = prof[(i + 1) % prof.length]
      face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z1], [x0, y1, z1]], [0, z1 - z0, -(y1 - y0)])
    }
    face(p, prof.map(([y, z]) => [x0, y, z] as V3), [-1, 0, 0])
    face(p, prof.map(([y, z]) => [x1, y, z] as V3), [1, 0, 0])
  }

  // ------------------------------------------------------------ the front
  const H = 17.28, BAL = 18.58
  const SEP = rect(31.7, 0.9, 44.7, 27.0), NWP = rect(-40.5, 5.7, -27.4, 26.5)
  const SEW = rect(11.3, 9.5, 31.7, 21.3), NWW = rect(-27.4, 9.0, -7.0, 21.2), NWW2 = rect(-16.6, 1.0, -6.3, 9.05)
  const CEN = rect(-7.0, 13.3, 11.3, 24.0), CENB = rect(-7.0, 9.3, 11.3, 13.4)

  for (const r of [SEP, NWP]) {
    block(r, H, true, H)
    // The pavilions' rusticated granite ground storey.
    band(granite, r, 0, 7.6, 0.05, 0.04)
    band(trim, r, 7.4, 8.0, 0.15)
  }
  for (const r of [SEW, NWW]) {
    block(r, H, true, H)
    band(trim, r, 7.4, 8.0, 0.15)
  }
  block(NWW2, H, true, H)
  block(CENB, H, true, H)
  // Balustrades along the fronts and the pavilions' tops.
  balustrade(SEW, ['N'], H, BAL)
  balustrade(NWW, ['N'], H, BAL)
  balustrade(SEP, ['N', 'E'], H, BAL)
  balustrade(NWP, ['N', 'W'], H, BAL)

  // Gambrel slate roofs over the wings, with dormers.
  const gambrel = (x0: number, x1: number, y0: number, y1: number) => {
    const ym = (y0 + y1) / 2, k = 1.3
    prismX(slate, [[y0, H], [y1, H], [y1 - k, 21.0], [ym, 22.6], [y0 + k, 21.0]], x0, x1)
  }
  gambrel(11.3, 31.9, 9.5, 19.8)
  gambrel(-27.6, -7.0, 9.1, 19.5)
  for (const x of [15.0, 19.3, 23.7, 28.8, -11.3, -15.3, -19.5, -23.5]) {
    const r = rect(x - 1.15, 16.3, x + 1.15, 20.0)
    walls(stone, r, H, 19.8)
    pedimentOn(stone, sidesOf(r).N[0], sidesOf(r).N[1], 1.15, 1.15, 19.8, 21.0, 0.0001)
    cap(slate, inset(r, -0.1), 19.8)
    aw(win, r, 'N', x, 0.6, 17.9, 19.1)
  }
  // The pavilions' tall slate roofs, their finials and the Dutch gables.
  hipRoof(slate, 32.5, 6.8, 43.4, 25.8, H, 25.28, 0.3)
  hipRoof(slate, -39.7, 5.7, -28.0, 25.6, H, 25.28, 0.3)
  for (const [x, y] of [[38.0, 12.0], [38.0, 20.6], [-33.9, 11.7], [-33.9, 19.6]]) {
    pyramid(slate, rect(x - 0.45, y - 0.45, x + 0.45, y + 0.45), 25.0, [x, y, 28.2])
  }
  const dutch = (a: XY, b: XY, c: number, z0: number) => {
    const o: XY[] = [[c - 2.3, z0], [c + 2.3, z0], [c + 2.3, z0 + 0.8], [c + 1.6, z0 + 1.8], [c + 1.6, z0 + 3.4], [c + 1.1, z0 + 4.3], [c + 0.5, z0 + 4.85], [c, z0 + 5.0], [c - 0.5, z0 + 4.85], [c - 1.1, z0 + 4.3], [c - 1.6, z0 + 3.4], [c - 1.6, z0 + 1.8], [c - 2.3, z0 + 0.8]]
    wallSlab(stone, a, b, o, 0.6, -0.6)
    archOn(win, a, b, c, 0.75, z0 + 0.6, z0 + 2.4, 0.06, 8)
    const { P } = along(a, b)
    const t = P(c, z0 + 5.0, -0.3)
    ball(trim, t[0], t[1], t[2] + 0.35, 0.35, 6)
  }
  {
    const s = sideS(SEP, 'N', 38.3); dutch(s.a, s.b, s.s, H)
    const t = sideS(NWP, 'N', -33.9); dutch(t.a, t.b, t.s, H)
    const e = sideS(SEP, 'E', 16.4); dutch(e.a, e.b, e.s, H)
    const w = sideS(NWP, 'W', 15.9); dutch(w.a, w.b, w.s, H)
  }

  // Windows on the front range: arched, both storeys.
  const storeys = (r: XY[], k: Side, cs: number[], hw = 0.95) => {
    for (const c of cs) {
      aw(win, r, k, c, hw, 2.2, 5.2)
      aw(win, r, k, c, hw, 9.5, 12.6)
      box(trim, r, k, c - hw - 0.4, c + hw + 0.4, 8.9, 9.25, 0, 0.25) // sill / balcony ledge
    }
  }
  storeys(SEW, 'N', spaced(20.4, 5, 2.2).map((s) => 11.3 + s))
  storeys(NWW, 'N', spaced(20.4, 5, 2.2).map((s) => -27.4 + s))
  storeys(SEP, 'N', [34.7, 38.2, 41.7])
  storeys(NWP, 'N', [-37.4, -33.95, -30.5])
  storeys(SEP, 'E', spaced(26.1, 6, 2.8).map((s) => 0.9 + s))
  storeys(NWP, 'W', spaced(20.8, 5, 2.8).map((s) => 5.7 + s))
  storeys(SEP, 'S', [34.7, 38.2, 41.7])

  // The centre block: giant columns in pairs at its ends and single ones
  // either side of the middle bay, an attic, the pediment.
  walls(stone, CEN, 0, 20.3)
  band(granite, CEN, 0, 1.2, 0.08, 0.05)
  band(trim, CEN, 16.0, 16.6, 0.4)
  band(trim, CEN, 19.9, 20.3, 0.3)
  {
    const N = sidesOf(CEN).N
    // podium the columns stand on
    box(granite, CEN, 'N', -7.2, 11.5, 0, 4.3, 0, 0.75)
    for (const x of [-6.6, -5.1, -0.9, 5.2, 9.3, 10.75]) column(stone, x, 24.0 + 0.45, 4.3, 16.0, 0.48, 6)
    // the attic between cornice and pediment, with a balustrade either side
    for (const c of [-3.0, 2.15, 7.3]) {
      aw(win, CEN, 'N', c, 1.0, 5.4, 9.0)
      aw(win, CEN, 'N', c, 0.9, 10.4, 13.8)
    }
    void N
  }
  // Pediment roof, ridge running back from the front, the pediment wall in
  // stone with a trim cornice.
  {
    const x0 = -6.6, x1 = 10.9, y0 = 13.3, y1 = 24.0, z0 = 20.3, z1 = 23.82, xm = (x0 + x1) / 2, hw = (x1 - x0) / 2
    face(slate, [[x0 - 0.3, y0, z0], [xm, y0, z1], [xm, y1 + 0.3, z1], [x0 - 0.3, y1 + 0.3, z0]], [-1, 0, hw / (z1 - z0)])
    face(slate, [[x1 + 0.3, y0, z0], [x1 + 0.3, y1 + 0.3, z0], [xm, y1 + 0.3, z1], [xm, y0, z1]], [1, 0, hw / (z1 - z0)])
    face(stone, [[x0, y1, z0], [x1, y1, z0], [xm, y1, z1]], [0, 1, 0])
    face(stone, [[x0, y0, z0], [x1, y0, z0], [xm, y0, z1]], [0, -1, 0])
    const N = sidesOf(CEN).N
    const s = sideS(CEN, 'N', xm).s
    pedimentOn(trim, N[0], N[1], s, hw + 0.5, z0, z1 + 0.25, 0.45)
    pedimentOn(stone, N[0], N[1], s, hw - 0.4, z0 + 0.35, z1 - 0.3, 0.5)
  }
  // The entrance porch: a podium, four columns, a balustraded top.
  {
    const r = rect(-2.7, 24.0, 6.6, 26.7)
    walls(granite, r, 0, 2.0)
    cap(granite, r, 2.0)
    for (const x of [-2.1, 0.65, 3.35, 6.05]) column(stone, x, 26.2, 2.0, 8.9, 0.36, 6)
    const t = rect(-2.7, 24.0, 6.6, 26.75)
    walls(stone, t, 8.9, 9.58)
    cap(stone, t, 9.58)
    band(trim, t, 9.2, 9.58, 0.12)
    balustrade(t, ['N', 'E', 'W'], 9.58, 10.77)
  }

  // ------------------------------------------------------------ the back
  const AUD = rect(-14.9, -22.4, 34.3, -2.6)
  block(AUD, 18.16, true, 18.16)
  hipRoof(slate, -14.3, -21.8, 33.8, -3.2, 18.16, 23.1, 0.35)
  const MID = rect(-14.8, -2.8, 34.3, 1.6)
  block(MID, 9.58, true, 9.58)
  const COURT = rect(7.6, 1.5, 31.7, 9.5)
  block(COURT, 9.58, true, 9.58)
  const BACK = rect(-15.0, -25.9, 34.3, -22.35)
  block(BACK, 9.58, true, null)
  face(slate, [[-15.0, -25.9, 9.58], [34.3, -25.9, 9.58], [34.3, -22.35, 11.26], [-15.0, -22.35, 11.26]], [0, -1, 2])
  const SEB = rect(34.3, -18.9, 40.4, -5.7)
  block(SEB, 6.0, true, 6.0)
  const NWB = rect(-32.9, -25.9, -14.9, 3.8), NWB2 = rect(-39.9, -25.9, -32.9, -20.9)
  block(NWB, 14.62, true, 14.62)
  hipRoof(slate, -32.3, -25.6, -14.9, 3.3, 14.62, 19.73, 0.3)
  block(NWB2, 14.62, true, 14.62)
  const PORCH = rect(-39.9, -20.9, -32.9, 1.4)
  block(PORCH, 7.74, true, 7.74)
  {
    const r = rect(-43.7, -13.8, -39.85, -5.2)
    walls(stone, r, 0, 9.39)
    band(trim, r, 8.9, 9.39, 0.2)
    cap(stone, r, 9.39)
    for (const y of [-12.6, -9.5, -6.4]) aw(win, r, 'W', y, 1.0, 1.0, 5.5)
  }
  hipRoof(slate, -16.6, 1.2, -6.3, 15.1, H, 23.1, 0.2)
  // Windows round the back.
  for (const [r, k, z0, z1] of [[AUD, 'S', 0, 0], [MID, 'E', 2.0, 6.0], [BACK, 'S', 2.5, 6.6], [NWB, 'S', 2.5, 6.6], [NWB2, 'S', 2.5, 6.6], [PORCH, 'W', 2.0, 5.2]] as [XY[], Side, number, number][]) {
    if (z1 === 0) continue
    const [a, b] = sidesOf(r)[k], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const s of spaced(L, Math.max(1, Math.round(L / 3.6)), 1.8)) {
      archOn(win, a, b, s, 0.8, z0, z1, 0.08, 8)
      if (r === NWB || r === NWB2) archOn(win, a, b, s, 0.8, z0 + 6.0, z1 + 5.0, 0.08, 8)
    }
  }
  // The auditorium's clerestory: big round windows high on its long sides.
  for (const k of ['E'] as Side[]) {
    const [a, b] = sidesOf(SEB)[k]
    void a; void b
  }
  {
    const [a, b] = sidesOf(AUD).S, L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const s of spaced(L, 9, 3.5)) archOn(win, a, b, s, 1.1, 12.0, 15.2, 0.08, 8)
  }

  // ------------------------------------------------------------ the tower
  const TC: XY = [2.1, 5.15]
  const trect = (hx: number, hy: number) => rect(TC[0] - hx, TC[1] - hy, TC[0] + hx, TC[1] + hy)
  const T1 = trect(5.1, 4.85)
  walls(stone, T1, 0, 28.24)
  // Quoined corners and two tall slit windows up the shaft above the roofs.
  for (const k of ['N', 'S', 'E', 'W'] as Side[]) {
    const [a, b] = sidesOf(T1)[k], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    boxOn(stone, a, b, 0, 1.0, 17.0, 28.24, 0, 0.15)
    boxOn(stone, a, b, L - 1.0, L, 17.0, 28.24, 0, 0.15)
    for (const d of [-1.4, 1.4]) archOn(win, a, b, L / 2 + d, 0.55, 23.0, 26.3, 0.08, 6)
  }
  band(trim, T1, 27.7, 28.44, 0.35)
  balustrade(trect(5.45, 5.2), ['N', 'S', 'E', 'W'], 28.44, 30.0)
  // Columned stage: the core with tall arched openings, coupled columns at
  // each corner, a cornice and balustrade.
  const T2 = trect(4.15, 3.9)
  walls(stone, T2, 28.44, 38.2)
  for (const k of ['N', 'S', 'E', 'W'] as Side[]) {
    const [a, b] = sidesOf(T2)[k], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const d of [-1.45, 1.45]) {
      archOn(trim, a, b, L / 2 + d, 0.95, 30.4, 35.6, 0.04, 8)
      archOn(win, a, b, L / 2 + d, 0.72, 30.6, 35.6, 0.08, 8)
    }
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    for (const [dx, dy] of [[0, -0.6], [-0.6, 0]] as [number, number][]) {
      column(stone, TC[0] + sx * (4.35 + dx), TC[1] + sy * (4.1 + dy), 30.0, 38.2, 0.34, 6)
    }
  }
  band(trim, trect(4.6, 4.35), 38.2, 38.95, 0.35)
  balustrade(trect(4.95, 4.7), ['N', 'S', 'E', 'W'], 38.95, 40.0)
  // Clock stage: a dial and a little pediment on each face, obelisks at the
  // corners.
  const T3 = trect(3.65, 3.4)
  walls(stone, T3, 38.95, 46.0)
  band(trim, T3, 45.5, 46.1, 0.3)
  for (const k of ['N', 'S', 'E', 'W'] as Side[]) {
    const [a, b] = sidesOf(T3)[k], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    discOn(granite, a, b, L / 2, 42.5, 2.05, 0.12, 16)
    discOn(trim, a, b, L / 2, 42.5, 1.75, 0.2, 16)
    discOn(granite, a, b, L / 2, 42.5, 0.2, 0.24, 8)
    boxOn(stone, a, b, 0, 0.6, 38.95, 45.5, 0, 0.2)
    boxOn(stone, a, b, L - 0.6, L, 38.95, 45.5, 0, 0.2)
    pedimentOn(stone, a, b, L / 2, 2.6, 46.1, 47.7, 0.25)
  }
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = TC[0] + sx * 3.95, y = TC[1] + sy * 3.7
    const r = rect(x - 0.42, y - 0.42, x + 0.42, y + 0.42)
    walls(stone, r, 45.5, 46.6)
    cap(stone, r, 46.6)
    pyramid(stone, rect(x - 0.32, y - 0.32, x + 0.32, y + 0.32), 46.6, [x, y, 49.4])
  }
  // Octagonal drum, the ogee dome, the lantern and the spike.
  const oct = (r: number) => Array.from({ length: 8 }, (_, i) => [TC[0] + (r / Math.cos(Math.PI / 8)) * Math.cos(Math.PI / 8 + (i * Math.PI) / 4), TC[1] + (r / Math.cos(Math.PI / 8)) * Math.sin(Math.PI / 8 + (i * Math.PI) / 4)] as XY)
  walls(stone, oct(3.0), 45.8, 48.3)
  band(trim, oct(3.0), 48.2, 48.7, 0.35)
  {
    const R8 = 1 / Math.cos(Math.PI / 8)
    const prof: XY[] = [[3.0, 48.7], [3.05, 49.6], [2.85, 50.8], [2.35, 52.0], [1.6, 53.2], [1.15, 54.0], [1.2, 54.5]]
    lathe(stone, TC[0], TC[1], prof.map(([r, z]) => [r * R8, z] as XY), 8, Math.PI / 8)
    // gilt-free ribs: none; the lantern
    const lr = oct(1.05)
    walls(stone, lr, 54.5, 56.5)
    for (const [a, b] of edges(lr)) archOn(win, a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, 0.22, 54.9, 55.9, 0.05, 4)
    band(trim, lr, 56.3, 56.7, 0.2)
    lathe(stone, TC[0], TC[1], [[1.0 * R8, 56.7], [0.55, 57.4], [0.25, 58.4], [0.08, 59.61], [0, 59.61]], 8, Math.PI / 8)
    ball(stone, TC[0], TC[1], 59.8, 0.22, 6)
  }

  const flood = (p: V3, n: V3) => {
    if (n[2] > 0.7) return 0.2
    const d = Math.hypot(p[0] - TC[0], p[1] - TC[1])
    return d < 6 && p[2] > 20 ? 1 : 0.75
  }
  return [
    { part: stone, material: { ...finish('city-hall-sandstone', 0xe6d4a6), floodlight: flood } },
    { part: trim, material: finish('city-hall-dressing', 0xf3e6c6) },
    { part: slate, material: finish('city-hall-slate', 0x6d737b) },
    { part: win, material: PALETTE.window },
    { part: granite, material: finish('city-hall-granite', 0x9c9a94) },
  ]
}

if (import.meta.main) await save('cpt-city-hall', 'Cape Town City Hall', [-33.9253999, 18.4237319], 40.3, build(), 6500)
