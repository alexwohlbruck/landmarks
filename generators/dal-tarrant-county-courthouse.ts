/**
 * Tarrant County Courthouse (1893-95, Gunn & Curtiss; Renaissance Revival in
 * pink Texas granite), 100 East Weatherford Street, Fort Worth: procedural,
 * CC0-1.0.  bun generators/dal-tarrant-county-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's bearing
 * 330 (the walls of OSM way/178593785 run at 60.4 and 150.1 deg), so -y is
 * the Main Street front (facing 150 deg, down Main Street) and +y the back
 * over the Trinity bluff. Origin: the centroid of way/178593785; z = 0 the
 * ground round the building (the lidar ground is flat within 0.5 m over the
 * footprint; the bluff drops beyond the north street).
 *
 * Identity, in order: pink granite throughout; the tall square clock tower at
 * the centre with its columned belfry, clock stage and dark bronze dome and
 * lantern (59 m, the city's tallest building until 1920); the two green
 * copper domes over the east and west end pavilions; the green copper hip
 * roofs; the pedimented centre pavilions, the north one flanked by two tall
 * chimneys; the two-storey columned porticoes on the south, east and west.
 *
 * Measured, USGS lidar TX_Pecos_Dallas_B3_2018 (2018 flight, after the 2012
 * tower restoration), heights over the street (1.8 m over the box minimum):
 * - plan: the cruciform is drawn from the lidar, which sits inside OSM's
 *   outline by up to 3 m (OSM takes in the steps on the north and west):
 *   centre range 25 m wide (x 0.9 +- 12.5) from y -24.3 to 22.6; link
 *   blocks to x +-18.8; wings to x +-35.2, y -18.2..12.4; end pavilions to
 *   x +-36.9, 8.8 m wide; porticoes 3.3 m deep, 17 m (south) and 10 m
 *   (east, west) wide; tower 9 m square on the cross axis (y -2.9);
 * - heights: wing balustrade 19.9; wing hip ridges 26.2 (two parallel hips
 *   per wing with a flat strip between, as in the lidar and NAIP); centre
 *   eave 25.5 and ridge 28.1; end domes 32.1 at the lantern; north chimneys
 *   32.5; portico decks 12.0-13.3; tower gallery 36.6, belfry cornice and
 *   pediments 44.5, clock stage top about 47-49 (the dome itself returned no
 *   points). The 10.5 m tower ring in the lidar takes in the gallery and
 *   corner columns; the stack is drawn slimmer (shaft 7.6 m, belfry 6.6 m,
 *   clock stage 5.2 m, dome 5.5 m across) to the proportions in Reed's and
 *   Fisher's photos.
 * Published: total height 194 ft (59 m) to the lantern (Wikipedia, citing the
 *   Fort Worth tallest-building lists); built 1893-95; pink Texas granite.
 * Estimated from the photos: the tower's stage split above the lidar (dome
 *   49-54.6, lantern to 57.4, finial to 59), the belfry's two arches a face
 *   and corner columns, the window rows and sizes, the portico column pairs,
 *   the pediments on the wing faces and pavilions, the end domes' drums.
 * Colours from daylight photos (Jruizalvarez, Mark Fisher, Renelibrary, Louis
 *   Reed): sunlit granite #c3a589 / #b79f70 / #b4a592, pulled up to palette
 *   lightness as a deeper weathered rose-brown #bf9a89 (lead review: the
 *   first pass, #d8b9a3, read pale salmon); dome and roof copper #a5a78f / #bec59d / #a4b7a2,
 *   pale sage; the tower's dome and clock stage copper-brown (#9c7d69 / #b5997f in sun,
 *   #58686b overcast), drawn a warm copper-brown #9a8372, darker than the granite but not heavy.
 * Night: the granite floodlit (Andrewnward's night views), the windows and
 *   clock dials lit.
 * Left out: carved tympana, balustrade detail, cresting on the hip roofs,
 *   steps, the iron lamp posts.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Tarrant County Courthouse, Fort Worth, TX.jpg", Jruizalvarez, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Tarrant_County_Courthouse,_Fort_Worth,_TX.jpg
 * - "0011Tarrant County Courthouse Full E Fort Worth Texas.jpg" and "... Dome
 *   NW ...", Mark Fisher, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:0011Tarrant_County_Courthouse_Full_E_Fort_Worth_Texas.jpg
 *   https://commons.wikimedia.org/wiki/File:0011Tarrant_County_Courthouse_Dome_NW_Fort_Worth_Texas.jpg
 * - "Tarrantcounty3.JPG", Renelibrary, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Tarrantcounty3.JPG
 * - "20070429 Tarrant County Courthouse.JPG", Louis Reed, CC BY-SA 3.0 (north)
 *   https://commons.wikimedia.org/wiki/File:20070429_Tarrant_County_Courthouse.JPG
 * - "Fort Worth June 2016 32/33 (Tarrant County Courthouse).jpg", Michael
 *   Barera, CC BY-SA 4.0 (north)
 *   https://commons.wikimedia.org/wiki/File:Fort_Worth_June_2016_32_(Tarrant_County_Courthouse).jpg
 * - "The Tarrant County Courthouse and adjacent buildings in Fort Worth,
 *   Texas", Carol M. Highsmith, public domain (north-west)
 *   https://commons.wikimedia.org/wiki/File:The_Tarrant_County_Courthouse_and_adjacent_buildings_in_Fort_Worth,_Texas_LCCN2014632931.tif
 * - "Fort Worth Courthouse.jpg", DerekAyala27, CC BY 4.0 (from the north
 *   bridge) https://commons.wikimedia.org/wiki/File:Fort_Worth_Courthouse.jpg
 * - "Tarrant County Courthouse viewed from the Paddock Viaduct at night.jpg",
 *   Andrewnward, CC BY-SA 4.0 (night)
 * Also USGS NAIP (public domain) for the roof colours. No look-only sources.
 * No commercial imagery.
 *
 * Terrain: the Mapterhorn ground varies 0.4 m over the footprint; the
 * building stands at y = 0 on it. Elevation 0.
 *
 * Doubts: the tower dome and lantern are above the lidar's returns and come
 * from photo ratios and the published 59 m; the wing faces' gables are
 * simplified to one pediment per end; the window rows are regularised.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { archPanel, cap, lathe, panel, rect, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7574803, -97.333193]
const BEARING = 330

const XC = 0.9, YC = -2.9 // the cross axis: tower, domes, end pavilions
const CW = 12.5, CY0 = -24.3, CY1 = 22.6, CEAVE = 25.5, CRIDGE = 28.1
const LX = 18.8, LY0 = -17.0, LY1 = 11.2
const WX = 35.2, WY0 = -18.2, WY1 = 12.4, WEAVE = 19.0, WPAR = 19.9, WRIDGE = 26.2
const PX0 = 28.2, PX = 36.9, PH = 4.4, PTOP = 24.5

/** A planar polygon, fanned, wound to face `hint`. */
function poly(p: Part, pts: V3[], hint: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
/** A closed box. */
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  if (top) cap(p, rect(x0, y0, x1, y1), z1)
}
/** A box with a bevelled top edge. */
function bbox(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, b = 0.3) {
  walls(p, rect(x0, y0, x1, y1), z0, z1 - b)
  walls(p, rect(x0, y0, x1, y1), z1 - b, z1, rect(x0 + b, y0 + b, x1 - b, y1 - b))
  cap(p, rect(x0 + b, y0 + b, x1 - b, y1 - b), z1)
}
/** A hip roof over a rectangle, ridge along its long side. */
function hip(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  const along = x1 - x0 >= y1 - y0
  const h = (along ? y1 - y0 : x1 - x0) / 2
  const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
  const r0: V3 = along ? [x0 + h, ym, z1] : [xm, y0 + h, z1]
  const r1: V3 = along ? [x1 - h, ym, z1] : [xm, y1 - h, z1]
  const A: V3 = [x0, y0, z0], B: V3 = [x1, y0, z0], C: V3 = [x1, y1, z0], D: V3 = [x0, y1, z0]
  if (along) {
    poly(p, [A, B, r1, r0], [0, -1, 1]); poly(p, [C, D, r0, r1], [0, 1, 1])
    poly(p, [B, C, r1], [1, 0, 1]); poly(p, [D, A, r0], [-1, 0, 1])
  } else {
    poly(p, [B, C, r1, r0], [1, 0, 1]); poly(p, [D, A, r0, r1], [-1, 0, 1])
    poly(p, [A, B, r0], [0, -1, 1]); poly(p, [C, D, r1], [0, 1, 1])
  }
}
/**
 * A pediment on a wall: a triangular gable `w` wide from z0 to apex z1,
 * standing `d` proud of the wall line through (cx, cy) facing direction n.
 */
function pediment(p: Part, cx: number, cy: number, n: XY, w: number, z0: number, z1: number, d = 0.6, back = 2.5) {
  const u: XY = [-n[1], n[0]]
  const P = (s: number, o: number, z: number): V3 => [cx + u[0] * s + n[0] * o, cy + u[1] * s + n[1] * o, z]
  const nn: V3 = [n[0], n[1], 0]
  const k = (z1 - z0) / (w / 2)
  poly(p, [P(-w / 2, d, z0), P(w / 2, d, z0), P(0, d, z1)], nn)
  poly(p, [P(-w / 2, -back, z0), P(w / 2, -back, z0), P(0, -back, z1)], [-n[0], -n[1], 0])
  poly(p, [P(-w / 2, d, z0), P(0, d, z1), P(0, -back, z1), P(-w / 2, -back, z0)], [-u[0] * k, -u[1] * k, 1])
  poly(p, [P(w / 2, d, z0), P(w / 2, -back, z0), P(0, -back, z1), P(0, d, z1)], [u[0] * k, u[1] * k, 1])
  // the cornice under it
  poly(p, [P(-w / 2 - 0.2, d + 0.2, z0 - 0.5), P(w / 2 + 0.2, d + 0.2, z0 - 0.5), P(w / 2 + 0.2, d + 0.2, z0), P(-w / 2 - 0.2, d + 0.2, z0)], nn)
  poly(p, [P(-w / 2 - 0.2, d + 0.2, z0), P(w / 2 + 0.2, d + 0.2, z0), P(w / 2 + 0.2, 0, z0), P(-w / 2 - 0.2, 0, z0)], [0, 0, 1])
}

function build() {
  const gran = new Part(), copper = new Part(), bronze = new Part(), roof = new Part(), win = new Part(), dial = new Part()

  // Walls with a projecting cornice band at z: a ring proud by d.
  const band = (r: XY[], z0: number, z1: number, d: number) => {
    const o = r.map(([x, y], i) => {
      const cx = r.reduce((s, q) => s + q[0], 0) / r.length, cy = r.reduce((s, q) => s + q[1], 0) / r.length
      return [x + Math.sign(x - cx) * d, y + Math.sign(y - cy) * d] as XY
    })
    walls(gran, o, z0, z1)
    cap(gran, o, z1)
    cap(gran, o, z0, false)
  }

  // --- Centre range -----------------------------------------------------------
  const centre = rect(XC - CW, CY0, XC + CW, CY1)
  walls(gran, centre, 0, CEAVE)
  band(rect(XC - CW, CY0, XC + CW, CY1), 19.4, 20.1, 0.25)
  band(rect(XC - CW, CY0, XC + CW, CY1), CEAVE - 0.8, CEAVE, 0.35)
  // Low copper gable over the middle 20 m (lidar slopes from x +-10), ridge
  // along y; flat parapeted strips either side; granite pediments at both
  // ends spanning the pavilion between the chimneys (Reed, Barera).
  {
    const G = 10.0, oh = 0.35
    cap(roof, rect(XC - CW, CY0, XC + CW, CY1), CEAVE - 0.2)
    poly(copper, [[XC - G, CY0 - oh, CEAVE], [XC, CY0 - oh, CRIDGE], [XC, CY1 + oh, CRIDGE], [XC - G, CY1 + oh, CEAVE]], [-1, 0, 4])
    poly(copper, [[XC + G, CY0 - oh, CEAVE], [XC + G, CY1 + oh, CEAVE], [XC, CY1 + oh, CRIDGE], [XC, CY0 - oh, CRIDGE]], [1, 0, 4])
    for (const [y, sy] of [[CY0, -1], [CY1, 1]] as [number, number][]) pediment(gran, XC, y, [0, sy], 2 * G + 0.8, CEAVE, CRIDGE + 0.3, 0.45, 2.0)
  }
  // the north pavilion's two chimneys flanking its pediment
  for (const sx of [-1, 1]) bbox(gran, XC + sx * 8.5 - 1.3, 13.6, XC + sx * 8.5 + 1.3, 16.4, CEAVE - 1, 32.5, 0.3)

  // --- Links and wings ----------------------------------------------------------
  for (const sx of [-1, 1]) {
    const lx0 = sx > 0 ? XC + CW : XC - LX, lx1 = sx > 0 ? XC + LX : XC - CW
    box(gran, lx0, LY0, lx1, LY1, 0, WPAR, false)
    cap(roof, rect(lx0, LY0, lx1, LY1), WPAR)
    band(rect(lx0, LY0, lx1, LY1), 18.4, 19.0, 0.2)

    const wx0 = sx > 0 ? XC + LX : XC - WX, wx1 = sx > 0 ? XC + WX : XC - LX
    walls(gran, rect(wx0, WY0, wx1, WY1), 0, WPAR)
    band(rect(wx0, WY0, wx1, WY1), 13.9, 14.4, 0.2)
    band(rect(wx0, WY0, wx1, WY1), WEAVE - 0.6, WEAVE, 0.35)
    // two green hips with a flat strip between (lidar)
    hip(copper, wx0 + 0.6, WY0 + 0.6, wx1 - 0.6, YC - 3.1, WPAR, WRIDGE)
    hip(copper, wx0 + 0.6, YC + 3.4, wx1 - 0.6, WY1 - 0.6, WPAR, WRIDGE)
    cap(roof, rect(wx0, WY0, wx1, WY1), WPAR - 0.3)

    // End pavilion, its pediment, the dome
    const ex = XC + sx * PX0, ox = XC + sx * PX
    const px0 = Math.min(ex, ox), px1 = Math.max(ex, ox)
    walls(gran, rect(px0, YC - PH, px1, YC + PH), 0, PTOP)
    band(rect(px0, YC - PH, px1, YC + PH), PTOP - 0.7, PTOP, 0.3)
    cap(roof, rect(px0, YC - PH, px1, YC + PH), PTOP)
    pediment(gran, ox, YC, [sx, 0], 2 * PH + 0.4, PTOP, 27.0, 0.3)
    const dx = XC + sx * 32.6
    lathe(gran, dx, YC, [[4.0, PTOP - 0.5], [4.0, 25.6], [4.25, 25.6], [4.25, 26.1]], 16)
    lathe(copper, dx, YC, [[4.25, 26.1], [4.2, 27.0], [3.8, 28.2], [3.1, 29.3], [2.1, 30.1], [1.05, 30.45]], 16)
    lathe(copper, dx, YC, [[1.05, 30.45], [1.05, 31.6], [1.3, 31.6], [1.3, 31.9], [0.6, 32.4], [0, 32.8]], 8)

    // Portico on the end: two-storey column pairs, entablature, deck.
    portico(gran, roof, ox, YC, [sx, 0], 10.0)

    // Pediments on the wing faces: by the end pavilion (both faces) and at
    // the inner end of the south face (Fisher, Renelibrary).
    for (const sy of [-1, 1]) {
      const y = sy > 0 ? WY1 : WY0
      pediment(gran, XC + sx * 31.6, y, [0, sy], 7.0, WPAR, 23.2, 0.4)
      if (sy < 0) pediment(gran, XC + sx * 22.0, y, [0, sy], 6.0, WPAR, 22.8, 0.4)
    }
  }
  // South portico, and the engaged colonnade of the two storeys above it.
  portico(gran, roof, XC, CY0, [0, -1], 17.0)
  for (const dx of [-9.4, -7.2, -2.4, 2.4, 7.2, 9.4]) lathe(gran, XC + dx, CY0 - 0.45, [[0.6, 13.3], [0.45, 13.7], [0.45, 23.9], [0.62, 24.4]], 8)

  // --- Tower -------------------------------------------------------------------
  const TX = XC, TY = YC
  const sq = (h: number, z0: number, z1: number, p = gran, b = 0) => (b ? bbox(p, TX - h, TY - h, TX + h, TY + h, z0, z1, b) : box(p, TX - h, TY - h, TX + h, TY + h, z0, z1))
  // Slimmed to the photos (Reed, Fisher): the tower stack is clearly narrower
  // than the centre pavilion; the lidar's 10.5 m ring is the gallery.
  sq(3.8, 20, 34.6)
  sq(4.25, 34.6, 35.4) // cornice
  sq(4.05, 35.4, 36.6) // balustrade
  sq(3.3, 36.6, 42.6)
  sq(3.85, 42.6, 43.4) // belfry cornice
  // corner columns of the shaft and belfry
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    lathe(gran, TX + sx * 3.45, TY + sy * 3.45, [[0.5, 36.6], [0.45, 36.9], [0.45, 42.2], [0.6, 42.6]], 8)
    lathe(gran, TX + sx * 3.9, TY + sy * 3.9, [[0.45, 27.0], [0.45, 34.6]], 8)
  }
  const faces = (h: number): [XY, XY][] => [[[TX - h, TY - h], [TX + h, TY - h]], [[TX + h, TY - h], [TX + h, TY + h]], [[TX + h, TY + h], [TX - h, TY + h]], [[TX - h, TY + h], [TX - h, TY - h]]]
  for (const [a, b] of faces(3.3)) {
    archPanel(win, a, b, 0.95, 3.0, 37.4, 40.9, 0.05, 8)
    archPanel(win, a, b, 3.6, 5.65, 37.4, 40.9, 0.05, 8)
  }
  for (const [a, b] of faces(3.8)) {
    archPanel(win, a, b, 2.6, 5.0, 28.6, 31.6, 0.05, 8)
    pediment(gran, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, [(b[1] - a[1]) / 7.6, -(b[0] - a[0]) / 7.6], 7.4, 43.4, 44.9, 0.2, 1.5)
  }
  // Clock stage, bronze, with a dial on each face under an arched hood.
  sq(2.6, 43.4, 48.6, bronze)
  sq(2.85, 48.6, 49.2, bronze)
  for (const [a, b] of faces(2.6)) {
    const L = 5.2, u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
    const P = (s: number, z: number, o: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
    const R = 1.55, zc = 46.1
    for (let i = 0; i < 16; i++) {
      const t0 = (i / 16) * 2 * Math.PI, t1 = ((i + 1) / 16) * 2 * Math.PI
      dial.tri(P(2.6, zc, 0.12), P(2.6 + R * Math.cos(t0), zc + R * Math.sin(t0), 0.12), P(2.6 + R * Math.cos(t1), zc + R * Math.sin(t1), 0.12))
    }
    // the hood: a half-ring over the dial
    for (let i = 0; i < 8; i++) {
      const t0 = (i / 8) * Math.PI, t1 = ((i + 1) / 8) * Math.PI
      const r0 = R + 0.05, r1 = R + 0.55
      poly(bronze, [P(2.6 + r0 * Math.cos(t0), zc + r0 * Math.sin(t0), 0.35), P(2.6 + r1 * Math.cos(t0), zc + r1 * Math.sin(t0), 0.35), P(2.6 + r1 * Math.cos(t1), zc + r1 * Math.sin(t1), 0.35), P(2.6 + r0 * Math.cos(t1), zc + r0 * Math.sin(t1), 0.35)], [n[0], n[1], 0])
    }
  }
  // Dome, lantern and finial (published 59 m top).
  lathe(bronze, TX, TY, [[2.75, 49.2], [2.72, 50.4], [2.5, 51.7], [2.05, 52.9], [1.4, 53.9], [0.8, 54.6]], 16)
  lathe(bronze, TX, TY, [[0.8, 54.6], [0.8, 57.0], [1.05, 57.0], [1.05, 57.5], [0.45, 58.2], [0.15, 58.4], [0.15, 59.0], [0, 59.0]], 8)

  // --- Windows -------------------------------------------------------------------
  const ROWS: [number, number][] = [[1.3, 3.4], [5.0, 8.4], [9.9, 13.2], [15.0, 18.0]]
  const run = (a: XY, b: XY, pitch: number, w: number, rows: [number, number][], arch: boolean[] = [], end = 0.9) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), use = L - 2 * end
    const n = Math.max(1, Math.round(use / pitch)), pt = use / n
    for (let k = 0; k < n; k++) {
      const s = end + (k + 0.5) * pt
      rows.forEach(([z0, z1], i) => (arch[i] ? archPanel(win, a, b, s - w / 2, s + w / 2, z0, z1 - w / 2, 0.05, 8) : panel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.05)))
    }
  }
  const ARCH = [false, false, false, true]
  for (const sx of [-1, 1]) {
    const w0 = XC + sx * LX, w1 = XC + sx * WX
    // wing south and north faces, leaving the pediment bays plain above
    const [s0, s1] = sx > 0 ? [w0, w1] : [w1, w0]
    run([s0, WY0], [s1, WY0], 3.2, 1.7, ROWS, ARCH)
    run([s1, WY1], [s0, WY1], 3.2, 1.7, ROWS, ARCH)
    // wing ends either side of the pavilion
    const xe = XC + sx * WX
    const ends: [XY, XY][] = sx > 0 ? [[[xe, WY0], [xe, YC - PH]], [[xe, YC + PH], [xe, WY1]]] : [[[xe, YC - PH], [xe, WY0]], [[xe, WY1], [xe, YC + PH]]]
    for (const [a, b] of ends) run(a, b, 3.2, 1.6, ROWS, ARCH, 0.8)
    // pavilion end face above the portico: an arched pair and a rectangle row
    const ox = XC + sx * PX
    const [pa, pb]: XY[] = sx > 0 ? [[ox, YC - PH], [ox, YC + PH]] : [[ox, YC + PH], [ox, YC - PH]]
    run(pa, pb, 3.6, 2.0, [[14.4, 18.4], [19.6, 22.6]], [true, false], 0.6)
    // the pavilion's side faces over the wing roof (round windows read as panels)
    // link faces
    const l0 = XC + sx * CW, l1 = XC + sx * LX
    const [la, lb] = sx > 0 ? [l0, l1] : [l1, l0]
    run([la, LY0], [lb, LY0], 3.0, 1.5, ROWS, ARCH, 0.6)
    run([lb, LY1], [la, LY1], 3.0, 1.5, ROWS, ARCH, 0.6)
    // centre range side faces beyond the links
    const xc = XC + sx * CW
    const sides: [XY, XY][] = sx > 0 ? [[[xc, CY0], [xc, LY0]], [[xc, LY1], [xc, CY1]]] : [[[xc, LY0], [xc, CY0]], [[xc, CY1], [xc, LY1]]]
    for (const [a, b] of sides) run(a, b, 3.2, 1.6, [...ROWS, [20.8, 23.6]], [...ARCH, false], 0.8)
  }
  // Centre pavilion fronts: three broad windows a row, narrow ones at the ends.
  for (const sy of [-1, 1]) {
    const y = sy > 0 ? CY1 : CY0
    const a: XY = sy > 0 ? [XC + CW, y] : [XC - CW, y], b: XY = sy > 0 ? [XC - CW, y] : [XC + CW, y]
    for (const s of [CW - 4.8, CW, CW + 4.8]) {
      const rows: [number, number][] = sy > 0 ? [[1.4, 4.4], [5.4, 8.6], [10.0, 13.2], [14.6, 18.6]] : [[14.6, 18.6]]
      rows.forEach(([z0, z1], i) => (sy > 0 && i === 0 ? archPanel(win, a, b, s - 1.4, s + 1.4, z0, z1 - 1.4 + 1.4, 0.05, 8) : panel(win, a, b, s - 1.4, s + 1.4, z0, z1, 0.05)))
      // the blind arches (lunettes) under the pediment, in window slate
      archPanel(win, a, b, s - 1.8, s + 1.8, 20.6, 21.0, 0.05, 8)
    }
    for (const s of [1.6, 2 * CW - 1.6]) for (const [z0, z1] of [...ROWS, [20.8, 23.6]] as [number, number][]) panel(win, a, b, s - 0.7, s + 0.7, z0, z1, 0.05)
    if (sy < 0) {
      // behind the south portico: the doors and the arched first-floor row
      for (const s of [CW - 4.8, CW, CW + 4.8]) {
        panel(win, a, b, s - 1.1, s + 1.1, 1.6, 5.4, 0.05)
        archPanel(win, a, b, s - 1.4, s + 1.4, 6.6, 10.6, 0.05, 8)
      }
    }
  }

  const lit = (p: V3, n: V3) => (Math.abs(n[2]) > 0.6 ? 0.1 : Math.max(0.15, 0.6 - 0.008 * p[2]))
  return [
    { part: gran, material: { ...finish('tarrant-granite', 0xbf9a89), floodlight: lit } },
    { part: copper, material: finish('tarrant-copper', 0xa8bba2) },
    { part: bronze, material: { ...finish('tarrant-bronze', 0x9a8372), floodlight: (p: V3, n: V3) => (Math.abs(n[2]) > 0.8 ? 0 : 0.35) } },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: dial, material: windowVariant(2, 0xf2ead8) },
  ]
}

/**
 * A two-storey portico `w` wide in front of the wall line through (cx, cy),
 * facing n: a podium, paired columns, entablature and a balustraded deck.
 */
function portico(gran: Part, roof: Part, cx: number, cy: number, n: XY, w: number) {
  const D = 3.3, u: XY = [-n[1], n[0]]
  const P = (s: number, o: number): XY => [cx + u[0] * s + n[0] * o, cy + u[1] * s + n[1] * o]
  const r = (s0: number, o0: number, s1: number, o1: number): XY[] => {
    const pts = [P(s0, o0), P(s1, o0), P(s1, o1), P(s0, o1)]
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    return rect(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys))
  }
  const podium = r(-w / 2, 0, w / 2, D + 0.3)
  walls(gran, podium, 0, 1.4); cap(gran, podium, 1.4)
  const pairs = w > 12 ? [-w / 2 + 0.9, -2.6, 2.6, w / 2 - 0.9] : [-w / 2 + 0.9, w / 2 - 0.9]
  for (const s of pairs) for (const ds of [-0.6, 0.6]) {
    const ss = s + (s < 0 ? ds : -ds) * (w > 12 && Math.abs(s) < 3 ? 1 : 1)
    const [x, y] = P(ss, D - 0.55)
    lathe(gran, x, y, [[0.55, 1.4], [0.45, 1.8], [0.42, 10.9], [0.6, 11.3]], 8)
  }
  const ent = r(-w / 2, 0, w / 2, D)
  walls(gran, ent, 11.3, 12.4); cap(gran, ent, 11.3, false)
  cap(roof, ent, 12.4)
  // balustrade: a low parapet round the outer three sides
  const bal = r(-w / 2, D - 0.35, w / 2, D)
  walls(gran, bal, 12.4, 13.3); cap(gran, bal, 13.3)
  for (const s of [-w / 2, w / 2 - 0.35]) {
    const side = r(s, 0, s + 0.35, D)
    walls(gran, side, 12.4, 13.3); cap(gran, side, 13.3)
  }
}

if (import.meta.main) await save('dal-tarrant-county-courthouse', 'Tarrant County Courthouse', ANCHOR, BEARING, build(), 6500)
