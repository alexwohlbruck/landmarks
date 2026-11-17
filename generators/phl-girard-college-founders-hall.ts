/**
 * Founder's Hall, Girard College, Philadelphia — procedural, CC0-1.0, no textures.
 * bun generators/phl-girard-college-founders-hall.ts
 *
 * Map frame: x across the temple (east-south-east), y along it (north-
 * north-east), z up, metres. Placed at bearing 9 (the OSM outline's long
 * side, 8.96 degrees). The anchor is the centre of the roof as the lidar
 * draws it (lng -75.170093, lat 39.974061), 1.7 m from the OSM centroid.
 * z = 0 is the lawn round the podium (it is level to within 0.3 m). The
 * front, with its door, faces south-south-west towards Girard Avenue (-y).
 *
 * What it is: Thomas U. Walter's Founder's Hall (1833-47), built under
 * Stephen Girard's will for his college for orphans: a white marble Greek
 * Revival temple, peripteral with 34 Corinthian columns (8 by 11), 55 ft
 * tall, under a very low pediment and a pale roof with skylights, on a
 * stepped podium. It holds Girard's sarcophagus.
 *
 * Replaces: way/49891387 (Founder's Hall; no building parts).
 *
 * Evidence
 * - USGS 3DEP lidar, USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 0.5 m, in this frame: roof edge x -18.5..31.5, y -38.5..29.5
 *   (50 x 68 m, centred here), eaves 24.2, ridge 30.2 above the lawn, the
 *   outer step 1.3 at the roof's drip line.
 * - OSM way/49891387 (outline 49 x 70 m, the bearing).
 * - USGS NAIP orthophoto (public domain): the pale grey roof and its six
 *   skylights in three pairs.
 * - Photos (Wikimedia Commons): HABS PA-1731 / PA,51-PHILA,459A (public
 *   domain): "Front (south) elevation" (459A-3: proportions of podium,
 *   columns, entablature and pediment; the door), "General view, looking
 *   northwest" (459A-1), and the colour view 459A-48 (CT); "Greek Revival -
 *   Philadelphia, PA - Girard College (Founder's Hall) (1)" and "(2)"
 *   (Bmzuckerman, CC BY 4.0: the side colonnade, the cella's windows and
 *   the shade behind the columns, the marble's colour).
 * - Published: Wikipedia "Girard College" and the NHL nomination (34
 *   Corinthian columns, 55 ft (16.8 m) tall, 6 ft (1.8 m) across; marble;
 *   1833-47).
 * - Estimated from the photos: the podium's three step tiers (3.6 m to the
 *   stylobate), the entablature (3.8 m with its cornice), the cella's
 *   inset (6 m behind the column line), window and door sizes, the column
 *   capital (2.0 m), the marble and shade colours.
 *
 * Doubts
 * - Fluting, the capitals' acanthus and the frieze are drawn plain.
 * - The cella's rear (north) door and windows are assumed to mirror the
 *   front; few photos show the north end.
 *
 * Night: the cella's door and windows glow; the marble is lightly floodlit
 * on its vertical faces (estimated; no licensed night photo was found).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, panel, qf, rect, tf } from './dc-white-house'
import { roundColumn, saveModel } from './dc-nga-west'

const marble = new Part(), shade = new Part(), roof = new Part(), win = new Part(), glass = new Part()

const HX = 23.8, HY = 32.6 // stylobate / entablature half sizes
const STY = 3.6, CAP = 20.4, CORN = 23.6, EAVE = 24.2, RIDGE = 30.2

// The podium: three tiers of steps to the stylobate.
cbox(marble, rect(-HX - 2.0, HX + 2.0, -HY - 2.0, HY + 2.0), 0, 0.9, { b: 0.1 })
cbox(marble, rect(-HX - 1.0, HX + 1.0, -HY - 1.0, HY + 1.0), 0.9, 2.0, { b: 0.1 })
cbox(marble, rect(-HX, HX, -HY, HY), 2.0, STY, { b: 0.1 })

// The peristyle: 8 by 11 columns, 34 in all.
const CX = 22.6, CY = 31.4, R = 0.9
const xs = Array.from({ length: 8 }, (_, k) => -CX + (2 * CX * k) / 7)
const ys = Array.from({ length: 11 }, (_, k) => -CY + (2 * CY * k) / 10)
for (const x of xs) for (const y of [-CY, CY]) roundColumn(marble, x, y, R, STY, CAP, 10, 2.0)
for (const y of ys.slice(1, -1)) for (const x of [-CX, CX]) roundColumn(marble, x, y, R, STY, CAP, 10, 2.0)

// The cella, in the shade of the peristyle: a darker wall and ceiling so the
// columns read against it.
const cella = rect(-16.6, 16.6, -25.6, 25.6)
cbox(shade, cella, STY, CAP, { top: false })
qf(shade, [-HX, -HY, CAP - 0.02], [HX, -HY, CAP - 0.02], [HX, HY, CAP - 0.02], [-HX, HY, CAP - 0.02], [0, 0, -1])
// doors at both ends, two tiers of windows down the sides
for (const [s, y] of [['s', cella.y0], ['n', cella.y1]] as const) panel(win, s, y, -1.9, 1.9, STY, STY + 8.6, 0.05)
for (let k = 0; k < 6; k++) {
  const y = cella.y0 + 5 + (k * (cella.y1 - cella.y0 - 10)) / 5
  for (const [s, x] of [['w', cella.x0], ['e', cella.x1]] as const) {
    panel(win, s, x, y - 1.0, y + 1.0, 6.4, 10.6, 0.05)
    panel(win, s, x, y - 1.0, y + 1.0, 13.0, 17.4, 0.05)
  }
}

// The entablature and cornice.
cbox(marble, rect(-HX, HX, -HY, HY), CAP, CORN, { top: false })
cbox(marble, rect(-HX - 0.5, HX + 0.5, -HY - 0.5, HY + 0.5), CORN, EAVE, { top: false, bottom: true })

// The roof: a very low gable along y, pediments at both ends.
{
  const g = rect(-HX - 0.7, HX + 0.7, -HY - 0.5, HY + 0.5)
  for (const s of [-1, 1]) {
    const xe = s < 0 ? g.x0 : g.x1
    qf(roof, [xe, g.y0, EAVE], [xe, g.y1, EAVE], [0, g.y1, RIDGE], [0, g.y0, RIDGE], [s * (RIDGE - EAVE), 0, Math.abs(xe)])
  }
  const k = (RIDGE - EAVE) / (HX + 0.7)
  for (const [y, s] of [[-HY - 0.5, -1], [HY + 0.5, 1]] as const) {
    // the raking cornice stands a little proud of the recessed tympanum
    const yi = y - s * 0.35, t = 0.7
    tf(marble, [-HX - 0.5, yi, EAVE], [HX + 0.5, yi, EAVE], [0, yi, RIDGE - 0.1], [0, s, 0])
    for (const side of [-1, 1]) {
      const xo = side * (HX + 0.7)
      qf(marble, [xo, y, EAVE], [0, y, RIDGE], [0, y, RIDGE - t], [xo - side * (t / k), y, EAVE], [0, s, 0])
      // the underside of the raking cornice
      qf(marble, [xo, y, EAVE], [0, y, RIDGE], [0, yi, RIDGE], [xo, yi, EAVE], [0, 0, -1])
    }
    qf(marble, [-HX - 0.5, y, EAVE - 0.6], [HX + 0.5, y, EAVE - 0.6], [HX + 0.5, y, EAVE], [-HX - 0.5, y, EAVE], [0, s, 0])
  }
  // six skylights in three pairs (NAIP)
  for (const y of [-15, 0, 15]) for (const s of [-1, 1]) {
    const x0 = s * 5.5, x1 = s * 8.5, z = (x: number) => RIDGE - (Math.abs(x) * (RIDGE - EAVE)) / (HX + 0.7) + 0.06
    qf(glass, [x0, y - 1.6, z(x0)], [x1, y - 1.6, z(x1)], [x1, y + 1.6, z(x1)], [x0, y + 1.6, z(x0)], [s * 0.25, 0, 1])
  }
}

const lit = (_p: V3, n: V3) => (Math.abs(n[2]) > 0.6 ? 0.1 : 0.55)
const MARBLE = { ...finish('gch-marble', 0xefe9dc), floodlight: lit }
if (import.meta.main) {
  await saveModel('phl-girard-college-founders-hall', "Founder's Hall, Girard College", [
    { part: marble, material: MARBLE },
    { part: shade, material: finish('gch-shade', 0xaca493) },
    { part: roof, material: finish('gch-roof', 0xc2c5c3) },
    { part: win, material: PALETTE.window },
    { part: glass, material: PALETTE.glass },
  ], { source: 'generators/phl-girard-college-founders-hall.ts', bearing: 9, osm: 'way/49891387', footprint: [51.6, 69.2], height: RIDGE }, 5000)
}
