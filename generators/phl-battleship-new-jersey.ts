/**
 * Battleship New Jersey (USS New Jersey, BB-62; Iowa class, launched 1942),
 * museum ship on the Camden waterfront, New Jersey, across the Delaware
 * from Philadelphia — original procedural geometry, CC0-1.0.
 * bun generators/phl-battleship-new-jersey.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * waterline. Anchor = area centroid of the OSM outline way/29667862
 * (building=ship), 39.939334,-75.133034. The hull's axis runs at 343.3°
 * (bow upstream, to the north-north-west; lidar and NAIP agree with OSM to
 * ~3 m), so the catalog bearing is 343.3: +y is the bow, +x starboard (the
 * pier side, east). The centroid sits aft of midships, so the hull runs
 * from y -118.7 (stern) to y +149.6 (stem), on the axis x = -1.5.
 *
 * Identity, in order: the very long, slim haze-grey hull with its sharply
 * flared clipper bow, sheer rising to the stem, and the black boot-topping
 * at the waterline; the three triple 16-inch turrets, two forward (No. 2
 * superfiring over No. 1) and one aft facing astern, their long barrels
 * raised; the tall stepped tower foremast with its black fire-control top
 * and black lattice mast; the two funnels with black caps; the stepped
 * superstructure with the twin 5-inch mounts along its sides; the teak
 * main deck. At night the superstructure is floodlit white and strings of
 * lights run along the deck edges (Sdwelch1031's night photo).
 *
 * Evidence:
 *  - plan: OSM outline way/29667862 (268 m from stern to stem, published
 *    LOA 270.4 m, beam 33.0 m); the half-beam at each station from the
 *    lidar's width (less 0.5 m each side for the 1 m cells): 16.5 m from
 *    y -74 to 45, narrowing to 7 m at the stern and to 5.5 m 20 m aft of
 *    the stem.
 *  - heights: lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *    2015; the ship has not moved berth since 2001 except the 2024 dry-
 *    docking), 1 m grid, above the water returns (y = 0 is the waterline):
 *    main deck 7.0 m aft rising to 9.9 at y 100, 12.1 at y 128 and 14.0 at
 *    the stem; turret roofs No. 1 12.4 (centre y 77), No. 2 14.8 (y 55),
 *    No. 3 11.6 (y -56); superstructure levels 10-11, 13-14, 15.5; bridge
 *    20-24 m (y 22-44); forward Mk 37 director 33-35 m (y 24-32); tower fire-control top 40-41 m (y 8-24); highest
 *    return 53.0 m (the foremast, y 8); funnels ~29 m (y -16..-6 and
 *    -30..-20); aft director ~25 m (y -40).
 *  - forms and proportions: the photos below; turret and barrel sizes from
 *    the published 16"/50 Mark 7 (barrel 20.3 m) and the lidar roofs.
 *    Barrels drawn raised 20° (No. 1, No. 3) and 25° (No. 2), as displayed.
 *  - colours: haze grey hull and superstructure, black boot-topping, black
 *    funnel caps, mast and fire-control top, teak deck: from the photos.
 *    The ship was dry-docked at Philadelphia Navy Yard March-June 2024 and
 *    repainted (RabidMangoes' dry-dock photos): the same haze grey over a
 *    black boot-topping, so the scheme is unchanged; no licensed photo
 *    after her return was found.
 *  - elevation: 0. OSM maps the ship as a building on the river with
 *    nothing under it; the map's terrain there is the river surface (flat,
 *    -1.25 m), and y = 0 is the waterline on it. Nothing is modelled below
 *    the waterline and no water is modelled.
 *  - night: `lamp` beads every 8 m along both deck edges for the deck
 *    light strings; the grey superstructure carries a floodlight wash; the
 *    bridge windows glow (window).
 *
 * Photos (Wikimedia Commons): March_21,_2024_moving_of_the_USS_New_Jersey_
 * 4_(cropped).jpg and _11.jpg (QuincyMorgan, CC0); USS_New_Jersey_Port_of_
 * Camden_(2018).jpg (Jason Zhang, CC0); USS_New_Jersey_BB-62_Museum_Camden.
 * JPG (Vladsinger, CC BY-SA 3.0); USS_New_Jersey_(BB-62)_10_March_2013.jpg
 * (Teemu008, CC BY-SA 2.0); Battleship_New_Jersey_moored_at_Camden_NJ.jpg
 * (Izzowiki, CC BY-SA 3.0); USS_New_Jersey_Drydock_Front_Port_Side.jpg and
 * _Bow.jpg (RabidMangoes, CC BY-SA 4.0, 2024); USS_New_Jersey_Night.jpg
 * (Sdwelch1031, CC BY 3.0). USGS NAIP for the plan and the teak deck. No
 * commercial imagery.
 *
 * Left out: the 1980s Tomahawk and Harpoon launchers as separate shapes
 * (a few boxes stand for the armoured box launchers), Phalanx mounts,
 * radars and antennas other than the masts and the Mk 37 directors' dishes, railings, boats, cranes, the
 * hull number (lettering), the event tent frame on the fantail and the
 * awnings (temporary), the gangways and the pier.
 *
 * Doubts: the superstructure is a simplification of many small decks;
 * its level heights and extents are from the lidar's 1-2 m samples and
 * the photos. The bow and stern below the deck (flare, rake, overhang)
 * are estimated from the photos. The barrels' elevation is as displayed in
 * 2013-2024 photos and may change.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, save, walls, lathe, type XY } from './chi-aon-center'
import { face, rectOn } from './phl-independence-hall'

const XC = -1.5

/** Piecewise-linear lookup. */
const pl = (t: [number, number][]) => (y: number) => {
  if (y <= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) if (y <= t[i][0]) {
    const [y0, v0] = t[i - 1], [y1, v1] = t[i]
    return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0)
  }
  return t[t.length - 1][1]
}
// Half-beam at the deck edge (lidar widths).
const beam = pl([[-118.7, 6.5], [-114, 7.6], [-108, 9.5], [-100, 11.5], [-92, 13.8], [-84, 15.0], [-74, 16.3], [-64, 16.5], [45, 16.5], [60, 15.8], [70, 15.0], [74, 13.2], [80, 11.2], [90, 9.5], [100, 7.6], [110, 6.2], [120, 5.6], [130, 5.2], [140, 4.0], [146, 2.6], [149.6, 0.3]])
// Main deck height above the waterline (lidar sheer).
const deck = pl([[-118.7, 7.0], [-60, 7.0], [-30, 7.2], [20, 7.6], [50, 8.2], [70, 8.8], [90, 9.5], [104, 10.1], [116, 11.0], [128, 12.0], [138, 13.2], [149.6, 14.0]])
// The waterline is narrower than the deck towards the bow (flare) and
// stops short of the stem (rake) and of the stern (overhang).
const WL_FWD = 143.5, WL_AFT = -115.0
const flare = pl([[-118.7, 0.85], [-100, 0.95], [-80, 1.0], [60, 1.0], [90, 0.88], [120, 0.72], [143.5, 0.0]])

function build() {
  const grey = new Part(), teak = new Part(), black = new Part(), win = new Part(), lamp = new Part(), shade = new Part()

  // ------------------------------------------------------------- hull
  const ys: number[] = []
  for (const y of [-118.7, -116, -112, -108, -104, -100, -96, -92, -88, -84, -78, -72, -64, -50, -30, -10, 10, 30, 45, 55, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116, 122, 128, 134, 139, 143.5, 146.5, 148.5, 149.6]) ys.push(y)
  const BOOT = 0.9
  type St = { d: V3; b: V3; w: V3; D: V3; B: V3; W: V3 } // port/starboard: deck, boot top, waterline
  const st: St[] = ys.map((y) => {
    const b = beam(y), h = deck(y)
    const yw = Math.min(WL_FWD, Math.max(WL_AFT, y))
    const wb = beam(yw) * flare(yw)
    const t = BOOT / h
    const w: V3 = [XC - wb, yw, 0], W: V3 = [XC + wb, yw, 0]
    const d: V3 = [XC - b, y, h], D: V3 = [XC + b, y, h]
    const at = (p: V3, q: V3): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, BOOT]
    return { d, b: at(w, d), w, D, B: at(W, D), W }
  })
  const quadN = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => face(p, [a, b, c, d].filter((v, i, arr) => arr.findIndex((u) => u[0] === v[0] && u[1] === v[1] && u[2] === v[2]) === i), n)
  for (let i = 0; i < st.length - 1; i++) {
    const s0 = st[i], s1 = st[i + 1]
    quadN(black, s0.w, s1.w, s1.b, s0.b, [-1, 0, 0])
    quadN(grey, s0.b, s1.b, s1.d, s0.d, [-1, 0, 0.2])
    quadN(black, s0.W, s1.W, s1.B, s0.B, [1, 0, 0])
    quadN(grey, s0.B, s1.B, s1.D, s0.D, [1, 0, 0.2])
    quadN(teak, s0.d, s1.d, s1.D, s0.D, [0, 0, 1])
  }
  {
    // The stern, a raked transom; the stem's last sliver.
    const s = st[0]
    face(black, [s.w, s.W, s.B, s.b], [0, -1, -0.3])
    face(grey, [s.b, s.B, s.D, s.d], [0, -1, -0.3])
    const e = st[st.length - 1]
    face(grey, [e.d, e.D, e.B, e.b], [0, 1, 0])
  }

  // ------------------------------------------------------------ helpers
  const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p, inset = 0) => {
    const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
    const t: XY[] = [[x0 + inset, y0 + inset], [x1 - inset, y0 + inset], [x1 - inset, y1 - inset], [x0 + inset, y1 - inset]]
    walls(p, r, z0, z1, t)
    if (top) cap(top, t, z1)
  }
  const cbox = (p: Part, hw: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p, inset = 0) => box(p, XC - hw, XC + hw, y0, y1, z0, z1, top, inset)
  /** A tube from A to B, n-sided, radius r0 tapering to r1, capped at B. */
  const tube = (p: Part, A: V3, B: V3, r0: number, r1: number, n = 6) => {
    const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d)
    const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
    let a: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    const c1: V3 = [u[1] * a[2] - u[2] * a[1], u[2] * a[0] - u[0] * a[2], u[0] * a[1] - u[1] * a[0]]
    const l1 = Math.hypot(...c1), e1: V3 = [c1[0] / l1, c1[1] / l1, c1[2] / l1]
    const e2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
    const ring = (C: V3, r: number) => Array.from({ length: n }, (_, k) => {
      const t = (k / n) * 2 * Math.PI
      return [C[0] + r * (Math.cos(t) * e1[0] + Math.sin(t) * e2[0]), C[1] + r * (Math.cos(t) * e1[1] + Math.sin(t) * e2[1]), C[2] + r * (Math.cos(t) * e1[2] + Math.sin(t) * e2[2])] as V3
    })
    const ra = ring(A, r0), rb = ring(B, r1)
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n, m: V3 = [ra[k][0] + ra[j][0] - 2 * A[0], ra[k][1] + ra[j][1] - 2 * A[1], ra[k][2] + ra[j][2] - 2 * A[2]]
      face(p, [ra[k], ra[j], rb[j], rb[k]], m)
    }
    face(p, rb, u)
  }

  // ----------------------------------------------------------- turrets
  /** A triple 16-inch turret at yc, facing +y (s = 1) or astern (s = -1). */
  const turret = (yc: number, s: 1 | -1, roof: number, elev: number) => {
    const L = (u: number, v: number): XY => [XC + v * s, yc + u * s]
    const fix = (r: XY[]) => r // a 180° turn keeps the winding
    const z0 = roof - 3.4, dz = deck(yc)
    lathe(grey, XC, yc, [[6.2, dz - 0.3], [6.2, z0]], 16)
    const base = fix([L(-10, -6.5), L(4.6, -6.0), L(6.8, -4.6), L(6.8, 4.6), L(4.6, 6.0), L(-10, 6.5)].reverse())
    const top = fix([L(-9.8, -6.3), L(3.6, -5.8), L(5.4, -4.4), L(5.4, 4.4), L(3.6, 5.8), L(-9.8, 6.3)].reverse())
    walls(grey, base, z0, roof, top)
    cap(grey, top, roof)
    cap(grey, base, z0, false)
    // Rangefinder hoods at the rear corners of the roof.
    for (const v of [-5.2, 5.2]) {
      const [x, y] = L(-6.5, v)
      box(grey, x - 0.7, x + 0.7, y - 0.7, y + 0.7, roof, roof + 0.7)
    }
    const e = (elev * Math.PI) / 180
    for (const v of [-3.1, 0, 3.1]) {
      const u0 = 5.0, zA = z0 + 1.7, Lb = 20.3
      const A = L(u0, v), B = L(u0 + Lb * Math.cos(e), v)
      tube(grey, [A[0], A[1], zA], [B[0], B[1], zA + Lb * Math.sin(e)], 0.75, 0.5)
    }
  }
  turret(77, 1, 12.4, 20)
  turret(55, 1, 14.8, 25)
  turret(-56, -1, 11.6, 20)

  // ------------------------------------------------------ superstructure
  const D01 = 10.8, D02 = 13.3, D03 = 15.6
  // Each level: walls set in under the deck above, a thin deck slab that
  // overhangs them, and a shadowed band of galleries and doors under it.
  const level = (hw: number, y0: number, y1: number, z0: number, z1: number, gallery = true) => {
    cbox(grey, hw - 0.7, y0 + 0.7, y1 - 0.7, z0, z1 - 0.3, null)
    const r: XY[] = [[XC - hw + 0.7, y0 + 0.7], [XC + hw - 0.7, y0 + 0.7], [XC + hw - 0.7, y1 - 0.7], [XC - hw + 0.7, y1 - 0.7]]
    for (let k = 0; k < 4 && gallery; k++) {
      const a = r[k], b = r[(k + 1) % 4], Lw = Math.hypot(b[0] - a[0], b[1] - a[1])
      // Broken into gallery openings with plating between them.
      const n = Math.max(1, Math.round((Lw - 2) / 9)), w = (Lw - 2) / n
      for (let q = 0; q < n; q++) rectOn(shade, a, b, 1 + (q + 0.5) * w, w / 2 - 0.9, z1 - 1.7, z1 - 0.45, 0.04)
    }
    cbox(grey, hw, y0, y1, z1 - 0.3, z1)
  }
  level(10.5, -43, 44, 7.0, D01)
  level(8.0, -40, 42, D01, D02, false)
  level(6.0, -36, 40, D02, D03, false)
  // Conning tower and bridge block, then the navigation bridge.
  level(7.0, 24, 44, D03, 20.4)
  cbox(grey, 5.6, 22, 40, 20.4, 23.6)
  cbox(grey, 6.4, 21.4, 40.8, 23.6, 23.9)
  {
    const r: XY[] = [[XC - 5.6, 22], [XC + 5.6, 22], [XC + 5.6, 40], [XC - 5.6, 40]]
    for (let k = 0; k < 4; k++) {
      const a = r[k], b = r[(k + 1) % 4], Lw = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (k === 0) continue // the back of the bridge faces the tower
      rectOn(win, a, b, Lw / 2, Lw / 2 - 0.6, 21.7, 22.9, 0.05)
    }
    const r2: XY[] = [[XC - 7, 24], [XC + 7, 24], [XC + 7, 44], [XC - 7, 44]]
    rectOn(win, r2[2], r2[3], 7, 5.5, 18.6, 19.5, 0.05)
  }
  // The tower foremast: a tapering, stepped tower to the fire-control top.
  walls(grey, [[XC - 4.2, 9], [XC + 4.2, 9], [XC + 4.2, 24], [XC - 4.2, 24]], D03, 34.5, [[XC - 3.0, 11], [XC + 3.0, 11], [XC + 3.0, 22], [XC - 3.0, 22]])
  for (const z of [27.2, 31.0]) cbox(grey, 5.0, 10, 23, z, z + 0.6)
  cbox(grey, 4.2, 10.5, 22.5, 34.5, 35.2)
  // Fire-control director (Mk 38) and its rangefinder arms, black.
  cbox(black, 3.0, 12.5, 20.5, 35.2, 39.0)
  box(black, XC - 5.2, XC + 5.2, 15.6, 17.4, 37.4, 38.6)
  cbox(black, 2.2, 13.5, 19.5, 39.0, 40.5)
  // The black lattice foremast: three legs from the tower top to a
  // platform, the pole above, the wide yard and the air-search radar.
  for (const [lx, ly] of [[XC - 3.2, 10.5], [XC + 3.2, 10.5], [XC, 22.5]] as XY[]) tube(black, [lx, ly, 34.8], [XC, 12.5, 46.5], 0.35, 0.3, 4)
  cbox(black, 1.6, 11.2, 13.8, 46.2, 46.8)
  tube(black, [XC, 12.5, 46.8], [XC, 12.5, 53], 0.3, 0.18, 4)
  box(black, XC - 6.0, XC + 6.0, 12.2, 12.8, 45.2, 45.7)
  box(black, XC - 2.8, XC + 2.8, 13.9, 14.3, 47.0, 49.6)
  // Funnels: rounded casings with black caps.
  for (const [y0, y1, h] of [[-16, -6, 29.0], [-30.5, -20.5, 28.6]] as [number, number, number][]) {
    const cy = (y0 + y1) / 2, ry = (y1 - y0) / 2, rx = 3.8
    const ring = (k: number): XY[] => Array.from({ length: 12 }, (_, i) => {
      const t = (i / 12) * 2 * Math.PI
      return [XC + rx * k * Math.cos(t), cy + ry * k * Math.sin(t)] as XY
    })
    walls(grey, ring(1), D03, h - 1.6, ring(0.96))
    walls(black, ring(0.96), h - 1.6, h, ring(0.9))
    cap(black, ring(0.9), h)
  }
  // Forward fire-control director (Mk 37) on its column over the bridge,
  // black, with its radar.
  cbox(grey, 2.4, 25.5, 30.5, 23.9, 30.6)
  walls(black, [[XC - 2.9, 25.1], [XC + 2.9, 25.1], [XC + 2.9, 30.9], [XC - 2.9, 30.9]], 30.6, 33.4, [[XC - 2.9, 25.1], [XC + 2.9, 25.1], [XC + 2.9, 30.9], [XC - 2.9, 30.9]])
  walls(black, [[XC - 2.9, 25.1], [XC + 2.9, 25.1], [XC + 2.9, 30.9], [XC - 2.9, 30.9]], 33.4, 34.6, [[XC - 1.9, 26.1], [XC + 1.9, 26.1], [XC + 1.9, 29.9], [XC - 1.9, 29.9]])
  cap(black, [[XC - 1.9, 26.1], [XC + 1.9, 26.1], [XC + 1.9, 29.9], [XC - 1.9, 29.9]], 34.6)
  box(black, XC - 2.2, XC + 2.2, 27.7, 28.1, 34.6, 36.4)
  // Aft director tower and director.
  walls(grey, [[XC - 3.2, -42], [XC + 3.2, -42], [XC + 3.2, -34], [XC - 3.2, -34]], D03, 21.5, [[XC - 2.2, -41], [XC + 2.2, -41], [XC + 2.2, -35], [XC - 2.2, -35]])
  cap(grey, [[XC - 2.2, -41], [XC + 2.2, -41], [XC + 2.2, -35], [XC - 2.2, -35]], 21.5)
  walls(black, [[XC - 2.9, -40.9], [XC + 2.9, -40.9], [XC + 2.9, -35.1], [XC - 2.9, -35.1]], 21.5, 24.2)
  walls(black, [[XC - 2.9, -40.9], [XC + 2.9, -40.9], [XC + 2.9, -35.1], [XC - 2.9, -35.1]], 24.2, 25.4, [[XC - 1.9, -39.9], [XC + 1.9, -39.9], [XC + 1.9, -36.1], [XC - 1.9, -36.1]])
  cap(black, [[XC - 1.9, -39.9], [XC + 1.9, -39.9], [XC + 1.9, -36.1], [XC - 1.9, -36.1]], 25.4)
  // Aft mast (kingpost) behind the aft funnel.
  tube(grey, [XC, -33.5, D03], [XC, -33.5, 25.5], 0.45, 0.3, 6)
  // Twin 5-inch mounts on the 01 level, three each side.
  for (const yc of [30, 17, 4]) for (const sx of [-1, 1]) {
    const xc = XC + sx * 8.6
    box(grey, xc - 1.9, xc + 1.9, yc - 2.6, yc + 2.2, D01, D01 + 2.4, grey, 0.4)
    for (const dv of [-0.6, 0.6]) tube(grey, [xc + dv, yc + 2.0, D01 + 1.3], [xc + dv, yc + 7.2, D01 + 1.5], 0.18, 0.14, 4)
  }
  // Armoured box launchers aft, beside the aft funnel.
  for (const yc of [-27, -19]) for (const sx of [-1, 1]) {
    const xc = XC + sx * 8.4
    box(grey, xc - 1.6, xc + 1.6, yc - 3.2, yc + 3.2, D01, D01 + 2.0)
  }

  // The museum's signal mast on the forecastle, with its yard.
  tube(grey, [XC, 131, deck(131)], [XC, 131, 25.0], 0.3, 0.18, 6)
  box(grey, XC - 5.0, XC + 5.0, 130.85, 131.15, 21.6, 21.9)

  // ------------------------------------------------------------- lights
  // Deck-edge light strings: small beads along both rails.
  const bead = (c: V3, r = 0.35) => {
    const P: V3[] = [[c[0] + r, c[1], c[2]], [c[0], c[1] + r, c[2]], [c[0] - r, c[1], c[2]], [c[0], c[1] - r, c[2]]]
    const T: V3 = [c[0], c[1], c[2] + r], B: V3 = [c[0], c[1], c[2] - r]
    for (let k = 0; k < 4; k++) {
      const a = P[k], b = P[(k + 1) % 4]
      lamp.tri(a, b, T)
      lamp.tri(b, a, B)
    }
  }
  for (let y = -114; y <= 146; y += 8) {
    const b = beam(y) - 0.3, h = deck(y) + 1.1
    bead([XC - b, y, h])
    bead([XC + b, y, h])
  }

  const supers = (p: V3, n: V3) => (p[2] > 8.5 && Math.abs(p[0] - XC) < 11 && p[1] > -46 && p[1] < 46 ? (n[2] > 0.7 ? 0.3 : 0.9) : 0)
  return [
    { part: grey, material: { ...finish('nj-haze-grey', 0xa9b0b7), floodlight: supers } },
    { part: teak, material: finish('nj-teak', 0xa99d8a) },
    { part: black, material: finish('nj-black', 0x4a4f57) },
    { part: win, material: PALETTE.window },
    { part: lamp, material: { name: 'lamp', color: 0x9aa1a8, roughness: 0.6 } },
    { part: shade, material: finish('nj-shadow-grey', 0x737a82) },
  ]
}

if (import.meta.main) await save('phl-battleship-new-jersey', 'Battleship New Jersey', [39.939334, -75.133034], 343.3, build(), 6500)
