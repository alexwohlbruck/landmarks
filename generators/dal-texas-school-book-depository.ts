/**
 * Texas School Book Depository (Dallas County Administration Building, The
 * Sixth Floor Museum), 411 Elm Street, Dallas, 1901: procedural, CC0-1.0.
 * bun generators/dal-texas-school-book-depository.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing 346 (the walls of OSM way/727595366 run at 76 / 166 deg), so the
 * Elm Street front is the -y face and Houston Street the +x face. The origin
 * is the centroid of the outline way/727595366; y = 0 is the street.
 *
 * Identity: a plain seven-storey box of orange-red brick on a pale stone
 * base; seven bays a side; a row of round-arched windows across the five
 * middle bays of the sixth floor (the end bays, the sniper's corner window
 * among them, keep square heads); a corbelled brick cornice under the
 * seventh floor's paired windows; and a deep buff parapet band on top. On
 * the north side a plain brick stair and elevator tower (1989) runs the full
 * height beside the one-storey visitor centre.
 *
 * Measured:
 * - plan: OSM way/727595366, 29.7 x 30.1 m; the elevator tower
 *   way/727595367 (5.4 x 8.6 m, out of the north wall);
 * - heights: USGS lidar TX_Pecos_Dallas_B3_2018 (2018 flight), street
 *   at 0.6 m above the box minimum: roof 27.0 m, parapet 28.0 m, the
 *   elevator tower 28.1 m. (OSM's height 24.384 is the roof of the
 *   seventh floor without the parapet band, and too low.)
 * Estimated from the photos (scaled from the 28 m parapet on Machnitzki's
 * square-on view of the Elm Street front): storey lines, window sizes,
 * the 4.0 m bay pitch, the 2.4 m parapet band, the arch row from 19.0 m
 * with 1.4 m radius, the cornice at 21.9-22.8 m.
 * Facade: one panel per window, as for a low building: the windows are
 * large (about 2.2 x 2 m on a 4 m pitch) and their grid is the building.
 * Colours from the daylight photos: orange-red brick pulled a little
 * lighter; the buff parapet and stone base.
 * Left out: the segmental brick heads of the windows, the round vents in
 * the parapet, signs, the fire escape.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Dallas July 2015 08 (Texas School Book Depository).jpg", "... 09 ...",
 *   Michael Barera, CC BY-SA 4.0
 * - "2017 Texas School Book Depository 01.jpg", "... 02.jpg", Farragutful,
 *   CC BY-SA 4.0
 * - "Texas School Book Depository in Dallas, Texas.jpg", and "View, in
 *   2014, of Dealey Plaza and the Texas School Book Depository ...",
 *   Carol M. Highsmith, public domain
 * - "Texas Schoolbook Depository 411 Elm St TX 2013-06-08 001.jpg" to
 *   "... 004.jpg", Thomas R. Machnitzki, CC BY 3.0
 * - "Dallas County Admin Building.jpg", Dakota L., CC BY-SA 4.0
 * - "Texas School Book Depository by sunset.jpg", Jim Bowen, CC BY 2.0
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the north and west faces are seen only obliquely (the west at
 * a distance in Highsmith's aerial, the north in Machnitzki 004), and are
 * drawn like the street fronts; the Houston Street entrance's bay is read
 * from Farragutful 01. The 1901 roof sign frames (the Hertz sign, gone
 * since the 1970s) are not drawn.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, block, cap, inset, panel, rect, save, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7797642, -96.8084493]
const BEARING = 346

const X0 = -14.85, X1 = 14.8, Y0 = -15.07, Y1 = 15.07
const ROOF = 27.0, TOP = 28.0, BUFF = 25.6
const PITCH = 4.0, WIN = 2.15

function build() {
  const brick = new Part(), buff = new Part(), win = new Part(), roof = new Part(), door = new Part()

  // --- Masses -------------------------------------------------------------
  const R = rect(X0, Y0, X1, Y1)
  block(buff, null, rect(X0 - 0.06, Y0 - 0.06, X1 + 0.06, Y1 + 0.06), 0, 1.1, 0) // stone base
  walls(brick, R, 1.1, BUFF)
  // Corbelled brick cornice under the seventh floor, a pale line on top.
  block(brick, null, rect(X0 - 0.22, Y0 - 0.22, X1 + 0.22, Y1 + 0.22), 21.9, 22.6, 0)
  cap(brick, rect(X0 - 0.22, Y0 - 0.22, X1 + 0.22, Y1 + 0.22), 21.9, false)
  block(buff, buff, rect(X0 - 0.28, Y0 - 0.28, X1 + 0.28, Y1 + 0.28), 22.6, 22.8, 0)
  cap(buff, rect(X0 - 0.28, Y0 - 0.28, X1 + 0.28, Y1 + 0.28), 22.6, false)
  // The buff band and its capping, round a parapet over the roof.
  walls(buff, R, BUFF, TOP - 0.45)
  const C = rect(X0 - 0.25, Y0 - 0.25, X1 + 0.25, Y1 + 0.25)
  walls(buff, C, TOP - 0.45, TOP)
  cap(buff, C, TOP - 0.45, false)
  const I = inset(R, 0.45)
  walls(buff, [...I].reverse(), ROOF, TOP)
  // parapet top: the ring between C and I
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    buff.quad([I[k][0], I[k][1], TOP], [C[k][0], C[k][1], TOP], [C[l][0], C[l][1], TOP], [I[l][0], I[l][1], TOP])
  }
  cap(roof, I, ROOF)
  // Pale band at the top of the ground floor.
  block(buff, buff, rect(X0 - 0.1, Y0 - 0.1, X1 + 0.1, Y1 + 0.1), 5.35, 5.75, 0)
  cap(buff, rect(X0 - 0.1, Y0 - 0.1, X1 + 0.1, Y1 + 0.1), 5.35, false)

  // Elevator and stair tower on the north side.
  block(brick, roof, rect(-2.0, Y1, 3.37, 23.57), 0, 28.1, 0.3)
  block(buff, null, rect(-2.06, Y1, 3.43, 23.63), 0, 1.1, 0)

  // --- Facades ------------------------------------------------------------
  const faces: [XY, XY][] = [
    [[X0, Y0], [X1, Y0]], // south, Elm Street
    [[X1, Y0], [X1, Y1]], // east, Houston Street
    [[X1, Y1], [X0, Y1]], // north
    [[X0, Y1], [X0, Y0]], // west
  ]
  const rowsMid: [number, number][] = [[6.55, 8.4], [9.7, 11.55], [12.85, 14.7], [16.0, 17.85]]
  faces.forEach(([a, b], f) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let k = 0; k < 7; k++) {
      const s = L / 2 + (k - 3) * PITCH
      const s0 = s - WIN / 2, s1 = s + WIN / 2
      // north face: the tower covers the middle bay
      if (f === 2) {
        const P = [a[0] - s, a[1]]
        if (P[0] > -2.6 && P[0] < 4.0) continue
      }
      const entrance = (f === 0 && k === 5) || (f === 1 && k === 3)
      if (entrance) {
        panel(buff, a, b, s - 1.9, s + 1.9, 0, 5.35, 0.3)
        panel(door, a, b, s - 1.2, s + 1.2, 0.6, 4.3, 0.34)
      } else {
        panel(win, a, b, s0, s1, 1.6, 4.9, 0.05)
      }
      for (const [z0, z1] of rowsMid) panel(win, a, b, s0 + 0.1, s1 - 0.1, z0, z1, 0.05)
      // sixth floor: round arches in the middle five bays
      if (k === 0 || k === 6) panel(win, a, b, s0 + 0.1, s1 - 0.1, 19.1, 21.2, 0.05)
      else {
        archPanel(brick, a, b, s - 1.75, s + 1.75, 18.9, 20.2, 0.03, 10)
        archPanel(win, a, b, s - 1.4, s + 1.4, 19.0, 20.2, 0.06, 10)
      }
      // seventh floor: a pair of windows per bay
      panel(win, a, b, s - 1.25, s - 0.2, 23.0, 25.2, 0.05)
      panel(win, a, b, s + 0.2, s + 1.25, 23.0, 25.2, 0.05)
    }
  })

  return [
    { part: brick, material: finish('tsbd-brick', 0xc8774f) },
    { part: buff, material: finish('tsbd-buff', 0xe6cfa6) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('dal-texas-school-book-depository', 'Texas School Book Depository', ANCHOR, BEARING, build())
