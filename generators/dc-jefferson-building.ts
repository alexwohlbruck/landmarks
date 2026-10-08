/**
 * Library of Congress, Thomas Jefferson Building, Washington DC —
 * procedural, CC0-1.0, no textures.
 * bun generators/dc-jefferson-building.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM multipolygon relation/1029374 (lng -77.0047094, lat
 * 38.8886833); its walls are turned 0.12° anticlockwise from the compass, so
 * the model is placed at bearing 359.88 and built square.
 *
 * What it is: Smithmeyer & Pelz's Italian Renaissance library of 1890–97,
 * finished by Casey and Green, in grey-white granite. A rectangle of ranges
 * round four quadrants, with a square pavilion at each corner under a
 * hipped slate roof; the west front, facing the Capitol, has a tall central
 * pavilion of paired Corinthian columns over a rusticated base, raised end
 * bays and an attic, reached by a grand double stair over the Court of
 * Neptune fountain. Cross ranges meet in the middle at the octagonal Main
 * Reading Room, whose drum carries the copper dome (gilded when new, dark
 * now, a charcoal grey with a green cast) and a lantern crowned by the gilded Torch of Learning, 195 ft up.
 * The two west quadrants are open courts; the east ones are built up with
 * later stacks under dark copper mansards. Light blue-grey slate roofs.
 *
 * Covers and replaces: relation/1029374 (one outer way, two inner courts).
 * No building:parts inside it. The stair and fountain terrace stand outside
 * the outline, as they do in reality.
 *
 * Evidence
 * - OSM (measured): outline 133.7 × 143.7 m; the original rectangle x -49.7
 *   to 46.4; corner pavilions to x -53.2 / 50.8 and y ±52–72; the west
 *   pavilion x -61.4 to -49.7, y ±21.7; the east additions to x 72.3; the
 *   west courts x -35.8 to -5, y -51 to -18 and 12 to 40. No heights.
 * - Published (Wikipedia, "Thomas Jefferson Building"; Library of Congress):
 *   1890–97, granite; the dome 195 ft (59.4 m) to the torch; the Main
 *   Reading Room an octagon under the dome; the copper dome originally
 *   gilded; the Court of Neptune fountain before the west front.
 * - Photos (Wikimedia Commons): "Thomas Jefferson Building-5.jpg" (Smash the
 *   Iron Cage, CC BY-SA 4.0), the west front square-on, used for every
 *   height below; "Thomas Jefferson Building Façade.jpg" (JSquish, CC BY-SA
 *   3.0) and "Thomas Jefferson Building-1.jpg" (Smash the Iron Cage, CC BY-SA
 *   4.0), the west front and stair; "Flickr - USCapitol - Library of Congress
 *   Thomas Jefferson Building (1).jpg" and "(2).jpg" (Architect of the
 *   Capitol, public domain), from the Capitol dome; "Aerial view from the
 *   south of the Library of Congress Thomas Jefferson Building ... LOC
 *   7562153778.jpg" (Carol M. Highsmith, no restrictions), the plan, roofs
 *   and drum; "Thomas Jefferson Building Aerial by Carol M. Highsmith.jpg"
 *   (CC BY-SA 3.0), from the south-west; "Exterior view. View of the roof,
 *   dome, and cupola ... LCCN2007684218.tif" (Carol M. Highsmith, public
 *   domain), the drum, dome and lantern close.
 * - USGS NAIP orthophoto (public domain): the roofs' plan and colours, the
 *   octagon (about 35 m across), the drum and dome (about 29 m), the built-up east
 *   quadrants.
 * - Measured from the square-on west photo against the pavilion's OSM width
 *   (43.3 m): the pavilion's rusticated base to 13.7 m, its columns to the
 *   cornice at 24.2 m, the attic to 29.8 m, the raised end bays to 32 m; the
 *   ranges' cornice 20.5 m, balustrade 23 m; the stair terrace 6.2 m.
 * - Estimated: the octagon's centre (x 2.5, from the OSM courts' corner
 *   cuts and the cross ranges' width) and size; the drum, dome and lantern
 *   profile (octagon to 33 m, drum to 40.4, a low ribbed saucer (a spherical cap
 *   7.5 m high) to 47.2, a dark lantern to 54,
 *   torch to 59.4 published); the corner pavilions' and ranges' hipped
 *   roofs; the east quadrants' blocks (18 m, under dark mansards); the east
 *   additions' heights; the window rows.
 * - Simplified: columns, pediments over the windows, sculpture, the
 *   balustrades' balusters, the dome's ribs and the lantern's colonnade
 *   (drawn as a drum with dark openings) are left out or flattened.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, grow, hip, panel, rect, type Rect, type Side } from './dc-white-house'
import { circle, lathe, pslab, saveModel } from './dc-nga-west'

const granite = new Part(), roof = new Part(), dome = new Part(), gold = new Part(), win = new Part(), door = new Part()

// ---- Heights.
const R_CORNICE = 20.5, R_BAL = 23.0, R_RIDGE = 26.0
const P_ROOF = 28.5 // corner pavilions' hip
const OCT = { x: 2.5, y: 0 }

/** Window rows on the ranges: basement, the arched ground floor, the main floor. */
const ROWS: Array<[number, number]> = [[4.2, 5.6], [7.0, 10.2], [13.0, 16.4]]
function windows(side: Side, at: number, a0: number, a1: number, pitch: number, rows = ROWS, w = 1.7) {
  const n = Math.max(1, Math.round((a1 - a0) / pitch)), step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    for (const [z0, z1] of rows) panel(win, side, at, c - w / 2, c + w / 2, z0, z1, 0.05)
  }
}

/** A range: walls to the cornice, a cornice, a balustrade-high parapet, a slate hip behind it. */
function range(r: Rect, cornice = R_CORNICE, bal = R_BAL, ridge = R_RIDGE) {
  cbox(granite, r, 0, cornice - 0.6, { top: false })
  cbox(granite, grow(r, 0.2), 0, 4.0, { b: 0.15, top: false }) // the rusticated base course
  cbox(granite, grow(r, 0.55), cornice - 0.6, cornice, { b: 0.3, bottom: true, top: false })
  cbox(granite, r, cornice, bal, { b: 0.2, top: false })
  hip(roof, grow(r, -0.5), bal, ridge, Math.min(r.x1 - r.x0, r.y1 - r.y0) / 2 - 0.6)
}

// ===========================================================================
// The ranges round the rectangle, and the four corner pavilions.
{
  const W = rect(-49.7, -35.0, -52.0, 52.0)
  const E = rect(32.0, 46.4, -52.0, 52.0)
  const N = rect(-33.0, 31.0, 56.5, 71.0), S = rect(-33.0, 31.0, -71.0, -56.5)
  for (const r of [W, E, N, S]) range(r)
  windows('w', W.x0, -50, -23, 4.1); windows('w', W.x0, 23, 50, 4.1)
  windows('e', E.x1, -50, -24, 4.1); windows('e', E.x1, 24, 50, 4.1)
  windows('n', N.y1, N.x0 + 1, N.x1 - 1, 4.1); windows('s', S.y0, S.x0 + 1, S.x1 - 1, 4.1)
  // The corner pavilions: a storey taller, under steep hipped slate roofs.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const [x0, x1] = sx < 0 ? [-53.2, -33.0] : [31.0, 50.8]
    const [y0, y1] = sy < 0 ? [-71.9, -51.8] : [51.8, 71.9]
    const p = rect(x0, x1, y0, y1)
    cbox(granite, p, 0, R_BAL + 0.4, { top: false })
    cbox(granite, grow(p, 0.2), 0, 4.0, { b: 0.15, top: false })
    cbox(granite, grow(p, 0.55), R_CORNICE - 0.6, R_CORNICE, { b: 0.3, bottom: true, top: false })
    cbox(granite, grow(p, 0.4), R_BAL + 0.4, R_BAL + 1.0, { b: 0.25, bottom: true, top: false })
    hip(roof, grow(p, -0.3), R_BAL + 1.0, P_ROOF, 5.5, roof)
    windows(sx < 0 ? 'w' : 'e', sx < 0 ? x0 : x1, y0 + 1, y1 - 1, 4.0)
    windows(sy < 0 ? 's' : 'n', sy < 0 ? y0 : y1, x0 + 1, x1 - 1, 4.0)
    // a tall window in the attic storey, under the cornice line
    panel(win, sy < 0 ? 's' : 'n', sy < 0 ? y0 : y1, (x0 + x1) / 2 - 1.2, (x0 + x1) / 2 + 1.2, 17.8, 19.4, 0.05)
  }
}

// ===========================================================================
// The cross ranges to the reading room, and the built-up east quadrants.
{
  range(rect(-35.0, 32.0, -15.0, 15.0))
  range(rect(OCT.x - 7.5, OCT.x + 7.5, -56.5, 56.5))
  for (const sy of [-1, 1]) {
    const q = sy < 0 ? rect(OCT.x + 7.5, 32.0, -56.5, -15.0) : rect(OCT.x + 7.5, 32.0, 15.0, 56.5)
    cbox(granite, q, 0, 17.4, { top: false })
    // the dark copper mansard with its dormer band
    hip(dome, q, 17.4, 21.0, 2.2, roof)
  }
  // the court-side windows of the west courts, so the courts aren't blank
  for (const sy of [-1, 1]) {
    windows(sy < 0 ? 's' : 'n', sy * 15.0, -34, -6, 4.1)
    windows('e', -35.0, sy < 0 ? -52 : 15, sy < 0 ? -15 : 52, 4.1)
  }
}

// ===========================================================================
// The east additions on Second Street.
{
  range(rect(46.4, 56.5, -22.8, 22.8))
  windows('e', 56.5, -22, -11, 4.0); windows('e', 56.5, 11, 22, 4.0)
  const low = rect(56.5, 72.3, -10.6, 10.6)
  cbox(granite, low, 0, 9.4, { top: false })
  cbox(granite, grow(low, 0.3), 9.4, 10.0, { b: 0.25, bottom: true, top: roof })
  windows('e', 72.3, -10, 10, 4.0, [[2.0, 4.2], [5.6, 7.8]])
  panel(door, 'e', 72.3, -1.6, 1.6, 0, 3.6, 0.08)
}

// ===========================================================================
// The west pavilion: a rusticated base, paired columns, the attic, raised
// end bays, and the stair terrace over the fountain.
{
  const X0 = -61.4, X1 = -35.0, Y = 21.7
  const BASE = 13.7, COLS = 23.6, CORN = 24.2, ATTIC = 29.8, BAYS = 32.0
  const pav = rect(X0, X1, -Y, Y)
  cbox(granite, pav, 0, CORN - 0.6, { top: false })
  cbox(granite, grow(pav, 0.35), BASE - 0.5, BASE, { b: 0.2, bottom: true, top: false })
  cbox(granite, grow(pav, 0.6), CORN - 0.6, CORN, { b: 0.3, bottom: true, top: false })
  cbox(granite, rect(X0, X1, -Y + 10.5, Y - 10.5), CORN, ATTIC, { top: false })
  cbox(granite, grow(rect(X0, X1, -Y + 10.5, Y - 10.5), 0.3), ATTIC - 0.4, ATTIC, { b: 0.2, bottom: true, top: false })
  hip(roof, rect(X0 + 1, X1, -Y + 10.7, Y - 10.7), ATTIC, 33.0, 4.0)
  for (const sy of [-1, 1]) {
    const bay = sy < 0 ? rect(X0, X1, -Y, -Y + 10.5) : rect(X0, X1, Y - 10.5, Y)
    cbox(granite, bay, CORN, BAYS - 0.5, { top: false })
    cbox(granite, grow(bay, 0.3), BAYS - 0.5, BAYS, { b: 0.25, bottom: true, top: false })
    hip(roof, grow(bay, -0.4), BAYS, 34.0, 3.0)
  }
  // Paired columns across the front, standing proud of the main storey.
  const R = 0.62
  const pairs = [-19.2, -13.5, -7.4, -2.4, 2.4, 7.4, 13.5, 19.2]
  for (const y of pairs) for (const d of [-0.8, 0.8]) {
    const yy = y + d, x = X0 - 1.0
    cbox(granite, rect(x - 0.85, x + 0.85, yy - 0.85, yy + 0.85), BASE, BASE + 0.6, { b: 0.1 })
    cylinder(granite, x, yy, R, BASE + 0.6, COLS - 1.0, 10, R * 0.88)
    cylinder(granite, x, yy, R * 0.88, COLS - 1.0, COLS - 0.3, 10, R * 1.2)
    cbox(granite, rect(x - 0.85, x + 0.85, yy - 0.85, yy + 0.85), COLS - 0.3, CORN - 0.6, { bottom: true, top: false })
  }
  // the entablature carried out over the columns
  cbox(granite, rect(X0 - 1.9, X0, -Y + 1, Y - 1), COLS - 0.3, CORN - 0.6, { bottom: true, top: false })
  // windows: between the column pairs on the main storey, the attic, the base
  for (let k = 0; k < pairs.length - 1; k++) {
    const c = (pairs[k] + pairs[k + 1]) / 2
    panel(win, 'w', X0, c - 1.0, c + 1.0, 15.2, 19.6, 0.05)
    panel(win, 'w', X0, c - 0.9, c + 0.9, 25.6, 27.8, 0.05)
  }
  for (const c of [-16.5, -11, 11, 16.5]) panel(win, 'w', X0, c - 1.1, c + 1.1, 7.2, 10.6, 0.05)
  for (const c of [-4.4, 0, 4.4]) panel(door, 'w', X0, c - 1.4, c + 1.4, 6.2, 10.8, 0.06)
  // The terrace: its front over the fountain, flights down each end.
  const T0 = X0 - 10.5, TY = 18.5, TH = 6.2
  cbox(granite, rect(T0, X0, -TY, TY), 0, TH, { b: 0.2 })
  cbox(granite, rect(T0 - 0.3, T0 + 1.2, -TY, TY), TH, TH + 1.0, { b: 0.15 }) // its parapet
  for (const y of [-7.5, 0, 7.5]) panel(win, 'w', T0, y - 2.2, y + 2.2, 0.6, 4.4, 0.05) // the fountain grottoes
  for (const sy of [-1, 1]) {
    const N = 10, y0 = sy * TY, y1 = sy * (TY + 12)
    for (let k = 0; k < N; k++) {
      const b = y0 + ((y1 - y0) * (k + 1)) / N
      cbox(granite, rect(T0 + 1.0, X0 - 0.5, Math.min(y0, b), Math.max(y0, b)), 0, (TH * (N - k)) / (N + 1), { top: true })
    }
  }
}

// ===========================================================================
// The Main Reading Room: octagon, drum, dome, lantern, torch.
{
  const { x, y } = OCT
  const k = 1 / Math.cos(Math.PI / 8)
  const oct = circle(x, y, 17.5 * k, 8, Math.PI / 8)
  pslab(granite, oct, 0, 31.6, 0.3, false)
  pslab(granite, circle(x, y, 18.1 * k, 8, Math.PI / 8), 31.6, 33.0, 0.35, roof)
  // the thermal (lunette) windows on each face of the octagon
  for (let f = 0; f < 8; f++) {
    const a = (f * Math.PI) / 4, n: V3 = [Math.cos(a), Math.sin(a), 0], t: V3 = [-Math.sin(a), Math.cos(a), 0]
    const c: V3 = [x + n[0] * 20.05, y + n[1] * 17.55, 0]
    const P = (s: number, z: number): V3 => [c[0] + t[0] * s, c[1] + t[1] * s, z]
    const seg = 6, r = 4.4, zs = 26.0
    win.quad(P(-r, 23.0), P(r, 23.0), P(r, zs), P(-r, zs))
    for (let j = 0; j < seg; j++) {
      const a0 = Math.PI - (j * Math.PI) / seg, a1 = Math.PI - ((j + 1) * Math.PI) / seg
      win.tri(P(0, zs), P(r * Math.cos(a1), zs + r * Math.sin(a1)), P(r * Math.cos(a0), zs + r * Math.sin(a0)))
    }
  }
  // the drum, a band of small windows, its cornice
  cylinder(granite, x, y, 14.8, 33.0, 39.5, 16)
  for (let f = 0; f < 16; f++) {
    const a = ((f + 0.5) * Math.PI) / 8, n = [Math.cos(a), Math.sin(a)], t = [-Math.sin(a), Math.cos(a)]
    const rr = 14.8 * Math.cos(Math.PI / 16) + 0.05
    const P = (s: number, z: number): V3 => [x + n[0] * rr + t[0] * s, y + n[1] * rr + t[1] * s, z]
    win.quad(P(-1.0, 34.6), P(1.0, 34.6), P(1.0, 38.0), P(-1.0, 38.0))
  }
  lathe(granite, x, y, [[14.8, 39.5], [15.4, 39.9], [15.4, 40.4], [14.4, 40.4]], 16, false)
  // The dome: a low ribbed saucer, a spherical cap 7.5 m high over its
  // 14.4 m radius, cut at the lantern's ring. Lofted as a flat-shaded
  // 16-gon so its facets read as the ribs.
  const R0 = 14.4, Z0 = 40.4, HC = 7.5, RS = (R0 * R0 + HC * HC) / (2 * HC)
  const zc = (r: number) => Z0 + Math.sqrt(RS * RS - r * r) - (RS - HC)
  const rings: V3[][] = []
  // a small eave, then the cap
  rings.push(circle(x, y, R0 + 0.5, 16, Math.PI / 16).map(([a, b]) => [a, b, Z0 - 0.3] as V3))
  for (const r of [R0, 12.4, 10.2, 7.8, 4.9]) rings.push(circle(x, y, r, 16, Math.PI / 16).map(([a, b]) => [a, b, zc(r)] as V3))
  dome.loft(rings)
  const rt = 4.9, zt = zc(4.9)
  lathe(dome, x, y, [[rt, zt], [4.9, zt + 0.6]], 16, false)
  dome.cap(circle(x, y, 4.9, 16, Math.PI / 16).map(([a, b]) => [a, b, zt + 0.6] as V3), true)
  // the lantern: a dark drum with its openings, a pale cornice, its little dome
  cylinder(dome, x, y, 4.2, zt + 0.6, zt + 5.6, 12)
  for (let f = 0; f < 8; f++) {
    const a = (f * Math.PI) / 4, rr = 4.2 * Math.cos(Math.PI / 12) + 0.06
    const n = [Math.cos(a), Math.sin(a)], t = [-Math.sin(a), Math.cos(a)]
    const P = (s: number, z: number): V3 => [x + n[0] * rr + t[0] * s, y + n[1] * rr + t[1] * s, z]
    win.quad(P(-0.8, zt + 1.4), P(0.8, zt + 1.4), P(0.8, zt + 4.9), P(-0.8, zt + 4.9))
  }
  lathe(granite, x, y, [[4.2, zt + 5.6], [4.7, zt + 6.0], [4.7, zt + 6.4], [4.2, zt + 6.4]], 12, false)
  lathe(dome, x, y, [[4.2, zt + 6.4], [3.4, zt + 7.6], [1.8, zt + 8.3], [0.5, zt + 8.5]], 12, true)
  lathe(gold, x, y, [[0.5, zt + 8.5], [0.8, zt + 8.9], [0.45, zt + 9.3], [0.9, zt + 9.8], [0.01, 59.4]], 8, false)
}

await saveModel('dc-jefferson-building', 'Library of Congress, Thomas Jefferson Building', [
  { part: granite, material: finish('loc-granite', 0xe9e5dc) },
  { part: roof, material: finish('loc-slate', 0x97a6b2) },
  { part: dome, material: finish('loc-dome-copper', 0x5b615c) },
  { part: gold, material: finish('loc-gilt', 0xd2b064) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { source: 'generators/dc-jefferson-building.ts', bearing: 359.88, osm: 'relation/1029374', footprint: [133.7, 143.7], height: 59.4 }, 6500)
