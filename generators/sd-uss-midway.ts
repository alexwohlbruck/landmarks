/**
 * USS Midway (CV-41) Museum, Navy Pier, San Diego (aircraft carrier,
 * commissioned 1945, museum ship here since 2004) — original procedural
 * geometry, CC0-1.0.
 * bun generators/sd-uss-midway.ts
 *
 * Map frame: x to starboard, y toward the bow, z up, metres; placed at
 * bearing 270.6 (bow to the west, toward the bay; stern to Harbor Drive;
 * the starboard side and the island face Navy Pier to the north). Origin
 * at the area centroid of the OSM outline way/25965018, 32.713761,
 * -117.175114. z = 0 is the waterline: the lidar's water returns sit at
 * -0.07 m all round the hull, and the map's terrain there is the bay.
 * Nothing below the waterline is modelled; no water is modelled.
 *
 * Identity, in order: the huge flat flight deck with its angled landing
 * area overhanging the port side, the yellow angled centreline and its
 * white boundary lines; the island on the starboard edge with its tall
 * lattice mast and the square radar tower aft; the haze-grey hull with the
 * dark shadowed band of galleries and catwalks under the deck edge; the
 * three deck-edge elevators, all lowered to the hangar deck as displayed;
 * and the aircraft parked all over the deck, drawn as bold simple
 * silhouettes (jets, an E-2 with its rotodome, helicopters).
 *
 * Evidence:
 *  - plan: OSM way/25965018 (the flight deck: 307 m from the stern to the
 *    bow bridle horns, 78 m wide), its island part way/1158219106; NAIP
 *    (USGS, public domain) for the deck markings, the elevators (dark,
 *    lowered) and the aircraft positions. The axis is 270.6 (the outline's
 *    long port edge and its square bow end).
 *  - published: length 1,001 ft (305 m) as modernised; beam 121 ft (37 m)
 *    at the hull; flight deck 238 ft (73 m) (Wikipedia, "USS Midway
 *    (CV-41)"); angled deck 13.5° (same; the NAIP centreline measures
 *    12.9°). The brief's 972 ft is the 1945 length.
 *  - heights: USGS lidar CA_SanDiegoQL2_2014 (flown 2014; the ship has
 *    been at this berth since 2004), 1 m grid, above the water returns:
 *    flight deck 16.8 m (16.4 aft to 17.1 forward); the three lowered
 *    elevators 8.8 m (starboard x 21–38, y 49–67 and y -45 to -25; port
 *    x -35 to -19, y -91 to -73); island body 26–27 m aft and forward,
 *    33–35 m in the middle (funnel and bridge), the platform on the mast
 *    40 m, the mast top 61 m (OSM height_ft 215 = 65.5 m, above the
 *    keel); the aft radar tower 37–43 m; parked aircraft 18–21 m.
 *  - hull below the deck: beam from the published 37 m, centred on the
 *    deck's bow end; the hangar deck at the elevators' 8.8 m; the
 *    hurricane bow flaring up to the flight deck, the transom and the
 *    deck's overhang aft, and the shadowed gallery band: from the photos.
 *    Estimated: the hull's waterline curves fore and aft.
 *  - aircraft: positions, headings and rough sizes from NAIP; the jets
 *    and helicopters are generic (the real collection is ~30 types, most
 *    painted light grey or white, the helicopters dark grey).
 *  - colours: haze-grey hull and island, darker non-skid deck, yellow and
 *    white deck lines, white/light grey aircraft, dark grey helicopters,
 *    mast and shadowed galleries: from the daylight photos.
 *  - night: the island carries a floodlight wash and its bridge windows
 *    glow; the rest stays dark.
 *  - elevation 0: the ship floats on the bay, which the map draws as
 *    water at the waterline.
 *
 * Photos (Wikimedia Commons):
 *  - USS_Midway_(CV-41)_museum_ship,_panorama,_San_Diego,_California.jpg
 *    (Christian David, CC BY-SA 4.0): the port side, from the south.
 *  - USS_Midway,_port_stern_view,_Mar_2023.jpg (Mys 721tx, CC BY-SA 3.0).
 *  - San_Diego_(California,_USA),_USS_Midway_Museum_--_2012_--_5365.jpg
 *    and _5368.jpg (Dietmar Rabich, CC BY-SA 4.0): the stern quarter and
 *    the overhanging fantail.
 *  - Front_view_of_the_USS_Midway_(CV-41)_as_a_museum_in_San_Diego,_CA.jpg
 *    (Shawnnielsen, CC BY-SA 3.0): the transom.
 *  - USSMidwayByPhilKonstantin.jpg (Phil Konstantin, CC BY-SA 3.0): an
 *    aerial of the whole deck, island and parked aircraft.
 *  - US_Navy_040110-N-5362A-015 and -004 (U.S. Navy, public domain): the
 *    ship from the air on her arrival, port bow quarter.
 *  - USS_Midway_Museum,_San_Diego_(…).jpg series (Clemens Vasters, CC BY
 *    2.0) and E-2_Hawkeye_USS_Midway_Museum-1.jpg (Balon Greyjoy, CC0):
 *    aircraft colours.
 *  No commercial imagery.
 *
 * Left out: catwalk railings and safety nets, gun sponsons and boats,
 * antennas other than the mast and the radar tower, the bow "41" and
 * other deck lettering, the event tents, the gangways and the pier.
 *
 * Doubts: no licensed photo of the starboard side was found; the island's
 * starboard face, the starboard galleries and elevators rest on the lidar
 * and the aerials. The aircraft change from time to time.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, save, walls, type XY } from './chi-aon-center'
import { face } from './phl-independence-hall'

const XC = 2.1 // hull centreline
const DECK = 16.8, SLAB = 15.3, HANGAR = 8.8, SKIRT = 12.2

/** Piecewise-linear lookup. */
const pl = (t: [number, number][]) => (y: number) => {
  if (y <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (y <= t[i][0]) {
    const [y0, v0] = t[i - 1], [y1, v1] = t[i]
    return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0)
  }
  return t[t.length - 1][1]
}

// The flight deck, from the OSM outline (bow → starboard → stern → port,
// clockwise from above), with the three lowered elevators cut out.
const DECK_CW: XY[] = [
  [-10.9, 156.6], [15.2, 156.6], [19.9, 79.5], [30.4, 73.6], [36.0, 70.4], [36.0, 67.0],
  [21.0, 67.0], [21.0, 49.0], [36.0, 49.0], [36.0, 44.4], [25.3, 38.9], [27.7, 35.7], [28.0, 23.6],
  [30.6, 23.6], [30.7, 20.6], [32.5, 20.7], [32.6, 14.1], [35.6, 14.2], [35.8, 9.5], [28.5, 9.2],
  [28.8, 0.7], [31.0, 0.8], [31.2, -11.8], [36.3, -20.5], [36.3, -25.0], [21.0, -25.0], [21.0, -45.0],
  [36.1, -45.0], [36.1, -49.7], [28.2, -53.1], [28.4, -82.5], [23.4, -86.9], [23.6, -101.3],
  [31.8, -135.1], [20.4, -137.4], [-9.1, -143.1], [-10.4, -135.3], [-12.2, -131.4], [-13.6, -128.9],
  [-15.8, -123.4], [-16.0, -119.7], [-16.5, -109.7], [-17.7, -101.6], [-33.6, -96.4], [-33.6, -91.0],
  [-19.0, -91.0], [-19.0, -73.0], [-33.6, -73.0], [-33.6, -66.5], [-23.9, -47.3], [-41.7, 35.1],
  [-42.1, 60.2], [-14.3, 87.3],
]
const DECK_RING: XY[] = [...DECK_CW].reverse()

// Hull half-breadths about XC: at the waterline, at the hangar deck, and
// at the top of the hull sides under the flight deck (flaring out to the
// deck's own width in the hurricane bow).
const STEM_WL = 150
const hw = pl([[-127, 13], [-118, 16.5], [-100, 18.5], [85, 18.5], [105, 16.5], [120, 13.5], [135, 9], [145, 4.5], [150, 0.4]])
const ht = pl([[-127, 14.5], [-118, 17.5], [-100, 18.5], [85, 18.5], [105, 17.6], [120, 15.5], [135, 12.5], [148, 8], [156.5, 3]])
const hu = pl([[-127, 14.0], [-118, 17.0], [-100, 18.0], [85, 18.0], [100, 17.6], [120, 16.4], [140, 14.8], [156.5, 13]])

function build() {
  const hull = new Part(), deck = new Part(), shade = new Part(), white = new Part(), yellow = new Part(), win = new Part()

  // ------------------------------------------------------------- hull
  const ys = [-127, -120, -110, -100, -60, -20, 20, 60, 85, 100, 112, 124, 134, 142, 149, 156.5]
  type St = { pw: V3; pt: V3; pu: V3; sw: V3; st: V3; su: V3 }
  const st: St[] = ys.map((y) => {
    const yw = Math.min(STEM_WL, y), a = hw(yw), b = ht(y), c = hu(y)
    return {
      pw: [XC - a, yw, 0], sw: [XC + a, yw, 0],
      pt: [XC - b, y, HANGAR], st: [XC + b, y, HANGAR],
      pu: [XC - c, y, SLAB], su: [XC + c, y, SLAB],
    }
  })
  for (let i = 0; i < st.length - 1; i++) {
    const a = st[i], b = st[i + 1]
    face(hull, [a.pw, b.pw, b.pt, a.pt], [-1, 0, 0])
    face(hull, [a.pt, b.pt, b.pu, a.pu], [-1, 0, 0.1])
    face(hull, [a.sw, b.sw, b.st, a.st], [1, 0, 0])
    face(hull, [a.st, b.st, b.su, a.su], [1, 0, 0.1])
  }
  {
    const s = st[0]
    face(hull, [s.pw, s.sw, s.st, s.pt], [0, -1, 0]) // the transom
    face(shade, [s.pt, s.st, s.su, s.pu], [0, -1, 0]) // the open fantail under the overhang
    const e = st[st.length - 1]
    face(hull, [e.pw, e.pt, e.pu, e.su, e.st, e.sw], [0, 1, 0])
  }
  // Elevator openings into the hangar, behind the lowered platforms.
  const opening = (side: -1 | 1, y0: number, y1: number) => {
    const w = 18.5 + 0.08
    face(shade, [[XC + side * w, y0, HANGAR], [XC + side * w, y1, HANGAR], [XC + side * w, y1, SKIRT], [XC + side * w, y0, SKIRT]], [side, 0, 0])
  }
  opening(1, 50, 66); opening(1, -44, -26); opening(-1, -90, -74)

  // ----------------------------------------------------------- the deck
  // The deck edge: a grey lip over a deep dark band, the catwalks, gun
  // sponsons and galleries hung under the overhang (the dark stripe every
  // side photo shows), down to SKIRT; the non-skid top.
  walls(shade, DECK_RING, SKIRT, DECK - 0.55)
  walls(hull, DECK_RING, DECK - 0.55, DECK)
  cap(deck, DECK_RING, DECK)
  cap(shade, DECK_RING, SKIRT, false)
  // The bow's two bridle-catcher horns.
  for (const [x0, x1] of [[-6.9, -4.1], [8.4, 11.0]]) {
    walls(hull, [[x0, 156.4], [x1, 156.4], [x1, 163.9], [x0, 163.9]], DECK - 1.6, DECK - 0.4)
    cap(hull, [[x0, 156.4], [x1, 156.4], [x1, 163.9], [x0, 163.9]], DECK - 0.4)
    cap(shade, [[x0, 156.4], [x1, 156.4], [x1, 163.9], [x0, 163.9]], DECK - 1.6, false)
  }
  // Elevator platforms, lowered to the hangar deck.
  const slab = (p: Part, top: Part, r: XY[], z0: number, z1: number) => { walls(p, r, z0, z1); cap(top, r, z1); cap(p, r, z0, false) }
  slab(hull, deck, [[20.7, 49.3], [37.8, 49.3], [37.8, 66.7], [20.7, 66.7]], HANGAR - 0.6, HANGAR)
  slab(hull, deck, [[20.7, -44.7], [37.8, -44.7], [37.8, -25.3], [20.7, -25.3]], HANGAR - 0.6, HANGAR)
  slab(hull, deck, [[-35.0, -90.7], [-16.7, -90.7], [-16.7, -73.3], [-35.0, -73.3]], HANGAR - 0.6, HANGAR)

  // ----------------------------------------------------- deck markings
  const Z = DECK + 0.04
  const stripe = (p: Part, a: XY, b: XY, w: number) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2
    face(p, [[a[0] - nx, a[1] - ny, Z], [b[0] - nx, b[1] - ny, Z], [b[0] + nx, b[1] + ny, Z], [a[0] + nx, a[1] + ny, Z]], [0, 0, 1])
  }
  // Angled deck: centreline 12.9° to port (NAIP), from the round-down aft
  // to the forward end of the landing area; white edge lines either side.
  const ang = (y: number): XY => [-17.7 - 0.2296 * (y - 14.2), y]
  const nrm = (d: number, p: XY): XY => [p[0] + d * 0.9744, p[1] + d * 0.2238]
  // Dashed yellow centreline (broad dashes so it reads, not shimmers).
  for (let y = -116; y < 66; y += 18) stripe(yellow, ang(y), ang(y + 12), 1.3)
  stripe(white, nrm(11, ang(-116)), nrm(11, ang(36)), 1.0)
  stripe(white, nrm(-11, ang(-112)), nrm(-11, ang(62)), 1.0)
  // The bow's catapult lines and the deck-edge foul line forward.
  stripe(white, [-4, 150], [-4, 92], 0.8)
  stripe(white, [9.5, 150], [12.5, 92], 0.8)
  // Stern round-down marking.
  stripe(white, [-6, -136.0], [26, -130.0], 2.2)

  // ---------------------------------------------------------- the island
  const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) => {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    walls(p, r, z0, z1)
    if (top) cap(top, r, z1)
  }
  const isl = new Part()
  // Lower island, the length of the structure.
  box(isl, 19.2, 29.2, -21, 38, DECK, 26.8)
  // Bridge and funnel block, stepped: 33 m, the bridge to 35.
  box(isl, 19.6, 29.0, -7, 24, 26.8, 31.2)
  box(isl, 20.2, 28.4, -5, 15, 31.2, 33.6)
  box(isl, 20.8, 27.4, 0, 12.5, 33.6, 35.3)
  // Bridge wings to starboard, over the water.
  box(isl, 29.0, 33.4, 7, 14, 29.6, 31.2)
  // Shadowed decks under each step (thin dark bands) and bridge windows.
  const band = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, out = 0.06) => {
    face(p, [[x0 - out, y0, z0], [x0 - out, y1, z0], [x0 - out, y1, z1], [x0 - out, y0, z1]], [-1, 0, 0])
    face(p, [[x1 + out, y0, z0], [x1 + out, y1, z0], [x1 + out, y1, z1], [x1 + out, y0, z1]], [1, 0, 0])
    face(p, [[x0, y1 + out, z0], [x1, y1 + out, z0], [x1, y1 + out, z1], [x0, y1 + out, z1]], [0, 1, 0])
    face(p, [[x0, y0 - out, z0], [x1, y0 - out, z0], [x1, y0 - out, z1], [x0, y0 - out, z1]], [0, -1, 0])
  }
  band(win, 19.6, 29.0, -7, 24, 29.4, 30.6)
  band(win, 20.8, 27.4, 0, 12.5, 34.0, 34.9)
  band(shade, 19.2, 29.2, -21, 38, 24.6, 25.8)
  // Funnel cap on the stack (dark).
  box(shade, 21.6, 26.6, 2, 10, 35.3, 36.2)

  // The lattice mast: a dark tapering column to the platform, the pole to
  // the top with two yards.
  const mast = (x: number, y: number) => {
    walls(shade, [[x - 2.0, y - 2.0], [x + 2.0, y - 2.0], [x + 2.0, y + 2.0], [x - 2.0, y + 2.0]], 33.6, 40.2, [[x - 1.2, y - 1.2], [x + 1.2, y - 1.2], [x + 1.2, y + 1.2], [x - 1.2, y + 1.2]])
    box(shade, x - 2.6, x + 2.6, y - 3.2, y + 3.2, 40.2, 41.2)
    walls(shade, [[x - 1.1, y - 1.1], [x + 1.1, y - 1.1], [x + 1.1, y + 1.1], [x - 1.1, y + 1.1]], 41.2, 53.0, [[x - 0.6, y - 0.6], [x + 0.6, y - 0.6], [x + 0.6, y + 0.6], [x - 0.6, y + 0.6]])
    walls(shade, [[x - 0.6, y - 0.6], [x + 0.6, y - 0.6], [x + 0.6, y + 0.6], [x - 0.6, y + 0.6]], 53.0, 61.0, [[x - 0.25, y - 0.25], [x + 0.25, y - 0.25], [x + 0.25, y + 0.25], [x - 0.25, y + 0.25]])
    box(shade, x - 6.0, x + 6.0, y - 0.3, y + 0.3, 47.6, 48.2)
    box(shade, x - 4.0, x + 4.0, y - 0.25, y + 0.25, 52.0, 52.5)
    // the radar antenna on the platform's forward edge
    box(shade, x - 3.6, x + 3.6, y + 2.6, y + 3.4, 41.2, 44.4)
  }
  mast(23.8, 19.5)
  // The square radar tower aft, with its big box antenna facing abeam.
  {
    const x = 24.6, y = -16.5
    walls(shade, [[x - 2.4, y - 2.4], [x + 2.4, y - 2.4], [x + 2.4, y + 2.4], [x - 2.4, y + 2.4]], 26.8, 37.4, [[x - 1.6, y - 1.6], [x + 1.6, y - 1.6], [x + 1.6, y + 1.6], [x - 1.6, y + 1.6]])
    box(shade, x - 2.2, x + 2.2, y - 2.2, y + 2.2, 37.4, 38.0)
    box(shade, x - 0.6, x + 0.6, y - 3.6, y + 3.6, 38.0, 43.0)
  }

  // ------------------------------------------------------------ aircraft
  /** A parked plane or helicopter at (x, y), nose toward heading h (deg, 0 = bow, 90 = starboard). */
  const place = (x: number, y: number, h: number) => {
    const c = Math.cos((h * Math.PI) / 180), s = Math.sin((h * Math.PI) / 180)
    // local u forward (nose), v to the right
    return (u: number, v: number, z: number): V3 => [x + u * s + v * c, y + u * c - v * s, z]
  }
  const prism = (p: Part, P: (u: number, v: number, z: number) => V3, outline: [number, number][], z0: number, z1: number) => {
    // outline in (u, v), counter-clockwise seen from above in (v, u)... take
    // any order and let face() orient by normal.
    const n = outline.length
    const bot = outline.map(([u, v]) => P(u, v, z0)), top = outline.map(([u, v]) => P(u, v, z1))
    face(p, top, [0, 0, 1])
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const a = bot[i], b = bot[j]
      const cx = (top.reduce((s, q) => s + q[0], 0)) / n, cy = (top.reduce((s, q) => s + q[1], 0)) / n
      const mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy
      const ex = b[0] - a[0], ey = b[1] - a[1]
      let nx = ey, ny = -ex
      if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny }
      face(p, [a, b, top[j], top[i]], [nx, ny, 0])
    }
  }
  const fin = (p: Part, P: (u: number, v: number, z: number) => V3, u0: number, u1: number, z0: number, z1: number, t = 0.25) => {
    // a swept vertical tail: a trapezoid in (u, z), t thick
    const pts = (v: number): V3[] => [P(u0, v, z0), P(u1, v, z0), P(u0 + (u1 - u0) * 0.45, v, z1), P(u0, v, z1)]
    const L = pts(-t), R = pts(t)
    const side = (q: V3[], sgn: number) => face(p, q, (() => { const a = P(0, sgn, 0), o = P(0, 0, 0); return [a[0] - o[0], a[1] - o[1], 0] as V3 })())
    side(L, -1); side(R, 1)
    face(p, [L[2], L[3], R[3], R[2]], [0, 0, 1])
    face(p, [L[1], L[2], R[2], R[1]], (() => { const a = P(1, 0, 0), o = P(0, 0, 0); return [a[0] - o[0], a[1] - o[1], 0.6] as V3 })())
    face(p, [L[3], L[0], R[0], R[3]], (() => { const a = P(-1, 0, 0), o = P(0, 0, 0); return [a[0] - o[0], a[1] - o[1], 0] as V3 })())
  }
  /** A jet: L long, S span. */
  const jet = (p: Part, x: number, y: number, h: number, L = 16, S = 10) => {
    const P = place(x, y, h), z0 = DECK + 1.0, z1 = DECK + 2.6, hl = L / 2, fw = Math.max(0.8, L * 0.07)
    // fuselage with a pointed nose
    prism(p, P, [[-hl, -fw], [hl * 0.6, -fw], [hl, 0], [hl * 0.6, fw], [-hl, fw]], z0, z1)
    // swept wings
    prism(p, P, [[hl * 0.25, 0], [-hl * 0.35, S / 2], [-hl * 0.55, S / 2], [-hl * 0.45, 0], [-hl * 0.55, -S / 2], [-hl * 0.35, -S / 2]], z0 + 0.5, z0 + 0.8)
    // tailplane
    prism(p, P, [[-hl * 0.7, 0], [-hl * 0.95, S * 0.22], [-hl, S * 0.22], [-hl, -S * 0.22], [-hl * 0.95, -S * 0.22]], z0 + 0.6, z0 + 0.85)
    fin(p, P, -hl, -hl * 0.55, z1, z1 + L * 0.2)
  }
  /** An E-2 Hawkeye: straight wings and the rotodome. */
  const hawkeye = (x: number, y: number, h: number) => {
    const P = place(x, y, h), z0 = DECK + 1.2, z1 = DECK + 3.4
    prism(white, P, [[-8.8, -1.0], [6.5, -1.3], [8.8, 0], [6.5, 1.3], [-8.8, 1.0]], z0, z1)
    prism(white, P, [[1.8, -12.3], [1.8, 12.3], [-1.0, 12.3], [-1.0, -12.3]], z1 - 0.5, z1 - 0.2)
    prism(white, P, [[-7.8, -4], [-7.8, 4], [-8.8, 4], [-8.8, -4]], z1, z1 + 0.3)
    fin(white, P, -8.8, -7.0, z1, z1 + 2.4, 0.2)
    // rotodome on its pylon
    const ring: [number, number][] = Array.from({ length: 12 }, (_, k) => [-3.5 + 3.65 * Math.cos((k / 12) * 2 * Math.PI), 3.65 * Math.sin((k / 12) * 2 * Math.PI)])
    prism(shade, P, [[-3.2, -0.3], [-3.2, 0.3], [-3.8, 0.3], [-3.8, -0.3]], z1, z1 + 1.3)
    prism(white, P, ring, z1 + 1.3, z1 + 2.1)
  }
  /** A helicopter: cabin, tail boom, two crossed rotor blades. */
  const heli = (p: Part, x: number, y: number, h: number, L = 15) => {
    const P = place(x, y, h), z0 = DECK + 0.5, hl = L / 2
    prism(p, P, [[-hl * 0.15, -1.4], [hl * 0.75, -1.4], [hl, -0.6], [hl, 0.6], [hl * 0.75, 1.4], [-hl * 0.15, 1.4]], z0, z0 + 3.4)
    prism(p, P, [[-hl, -0.4], [-hl * 0.15, -0.7], [-hl * 0.15, 0.7], [-hl, 0.4]], z0 + 2.0, z0 + 3.0)
    fin(p, P, -hl, -hl * 0.8, z0 + 3.0, z0 + 4.6, 0.2)
    const R = hl * 1.0
    for (const a of [45, 135]) {
      const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180)
      prism(p, P, [[hl * 0.3 + R * c - 0.35 * s, R * s + 0.35 * c], [hl * 0.3 - R * c - 0.35 * s, -R * s + 0.35 * c], [hl * 0.3 - R * c + 0.35 * s, -R * s - 0.35 * c], [hl * 0.3 + R * c + 0.35 * s, R * s - 0.35 * c]], z0 + 3.9, z0 + 4.1)
    }
    prism(p, P, [[hl * 0.3 + 0.4, 0], [hl * 0.3, 0.4], [hl * 0.3 - 0.4, 0], [hl * 0.3, -0.4]], z0 + 3.4, z0 + 3.9)
  }
  // Positions, headings and rough sizes from NAIP.
  jet(white, 14.9, 66.0, 0, 15, 10)
  hawkeye(8.5, 44.6, -90)
  jet(white, -9.2, 70.9, 0, 17, 11)
  jet(white, -14.5, 82.0, 0, 13, 8)
  heli(shade, -32.0, 33.0, 75, 16)
  heli(shade, -27.0, 16.0, 75, 16)
  heli(white, -24.0, -11.0, 70, 15)
  heli(shade, -20.0, -26.0, 70, 13)
  jet(white, 21.0, -62.5, 45, 19, 12)
  jet(white, 18.0, -77.0, 45, 14, 8)
  jet(shade, 14.5, -95.0, 45, 15, 10)
  jet(white, 12.5, -121.0, 0, 20, 17)
  jet(white, 14.0, -18.0, -90, 15, 9)
  jet(white, 6.5, -51.5, 120, 18, 12)
  jet(white, 7.0, -64.0, 180, 12, 8)
  jet(white, -10.5, -88.0, 150, 13, 8)
  jet(shade, -5.0, -100.0, 0, 15, 10)
  jet(white, -9.5, -110.0, 180, 14, 9)
  jet(white, -20.5, -60.0, 200, 18, 13)
  jet(white, -2.0, 110.0, 0, 15, 10)

  const islandLit = (p: V3, n: V3) => (p[2] > DECK + 0.5 && p[0] > 18.5 && p[0] < 34 && p[1] > -22 && p[1] < 39 ? (n[2] > 0.7 ? 0.25 : 0.85) : 0)
  // The island is the hull's colour; merge it in after building so the
  // floodlight covers just it.
  hull.pos.push(...isl.pos); hull.nrm.push(...isl.nrm); hull.uv.push(...isl.uv)
  return [
    { part: hull, material: { ...finish('midway-haze-grey', 0xa6acb2), floodlight: islandLit } },
    { part: deck, material: finish('midway-deck-grey', 0x7c8187) },
    { part: shade, material: finish('midway-shadow-grey', 0x4f555c) },
    { part: white, material: finish('midway-aircraft-white', 0xe4e5e1) },
    { part: yellow, material: finish('midway-deck-yellow', 0xd9b548) },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) await save('sd-uss-midway', 'USS Midway Museum', [32.713761, -117.175114], 270.6, build(), 6500)
