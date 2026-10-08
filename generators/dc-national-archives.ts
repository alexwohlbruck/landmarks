/**
 * National Archives Building — procedural, CC0-1.0, no textures.
 * bun generators/dc-national-archives.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°: the OSM outline's
 * walls fit the compass to 0.1°. The anchor is the area centroid of the
 * outline way/66418953 (lng -77.0229196, lat 38.8928207).
 *
 * What it is: John Russell Pope's temple of the archives (1931–37), in
 * Indiana limestone on a granite base. A giant Corinthian order stands on a
 * podium all round: a colonnade along every front, a deep pedimented portico
 * on Constitution Avenue (south) over its flight of steps and a shallow
 * pedimented portico on Pennsylvania Avenue (north), with blank, stepped
 * corner pavilions between. Over the colonnades' cornice a tall, plain attic
 * rises as one big rectangular block, with its own cornice and a lower
 * stepped top storey. Tall windows fill the bays behind the columns.
 *
 * Covers and replaces: the outline way/66418953 and its six building:parts
 * (the two colonnade wings, the attic, its top storey and both porticos).
 * The guard booth way/912464965 outside it is left alone.
 *
 * Evidence
 * - OSM (measured): outline 110.9 × 86.4 m, stepped at each corner (5 and
 *   10 m); attic part 86.2 × 50.4 m, top storey 77.3 × 41.1 m; porticos
 *   35.5 m wide and 8.1 m deep (south), 32.6 m wide and 3.4 m proud (north).
 *   Heights: colonnades 28, attic 41, top storey 41–46, porticos 35 (7 m
 *   gabled roof).
 * - Published: NARA, "The National Archives Building" and the NHL
 *   nomination: 72 Corinthian columns, each 53 ft (16.2 m) high and 5 ft
 *   8 in (1.73 m) across; limestone superstructure on a granite base
 *   (Wikipedia, "National Archives Building"); statues 25 ft (7.6 m) with
 *   their pedestals at both entrances.
 * - Photos (Wikimedia Commons): "National Archives Building north side,
 *   Washington, D.C. 2011.jpg" and "... south side ..." (Wknight94, CC BY-SA
 *   3.0), the two fronts square on; "National Archives Building 2.jpg",
 *   "... 3.jpg" and "... 4.jpg" (Kurt Kaiser, CC0), the south portico, its
 *   steps and the west end; "2014-04-04-National-Archives-Building-
 *   Washington-DC.jpg" (Gunnar Klack, CC BY-SA 4.0), a corner pavilion
 *   between two colonnades; "National Archives Building, Washington, D.C.,
 *   2014-09-22.jpg" (Kazuhisa Otsubo, CC BY 2.0). Aerials, public domain:
 *   "Photograph of an Aerial View of the National Archives Building,
 *   Constitution Avenue and 9th Street ..." and "... Pennsylvania Avenue
 *   and 9th Street ..." and "... Constitution Avenue and 7th Street ..."
 *   (U.S. National Archives), which show the attic, its stepped top storey,
 *   the portico roofs running back to it and the flat roofs over the
 *   colonnades.
 * - USGS NAIP orthophoto (public domain): roof plan and colour.
 * - Measured from the north photo against the colonnade's OSM width (80 m):
 *   podium 4.8 m, columns to 21.5, entablature and cornice to 28 (OSM),
 *   pediment apex about 36 (OSM 35; the photos put it a little higher).
 * - Estimated: the wall line behind each colonnade (3.3 m back), the column
 *   spacing on each front (8 on each portico, 5 either side of them, 10 on
 *   each end, and a second row of 6 in the south portico: 64 of the 72;
 *   the rest are in the portico's depth and are not seen), the steps (7 m
 *   deep, 48 m wide) and the four statue pedestals, drawn as plain blocks.
 * - Simplified: the Corinthian capitals are a flared bell and abacus, the
 *   pediment sculpture and roundels are left out, the windows are one tall
 *   panel per bay.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, cylinder, gable, grow, panel, qf, rect, type Side } from './dc-white-house'
import { type XY, pslab, poffset, saveModel } from './dc-nga-west'

const stone = new Part(), shade = new Part(), roof = new Part(), win = new Part(), door = new Part()

// ---- Heights.
const BASE = 4.8, COL = 21.5, ENT = 26.9, CORNICE = 28.0
const ATTIC = 41.0, TOP = 46.0, APEX = 36.0
const R = 0.86

// ---- Plan (OSM, made symmetrical east–west).
const XN = 40.0, YN = 38.4, YNP = 41.7, XNP = 16.6 // north colonnade face, portico
const XS = 39.7, YS = -36.5, YSP = -44.6, XSP = 17.7 // south colonnade face, portico
const XE = 55.4, YE0 = -21.15, YE1 = 22.7 // east/west colonnades
const BACK = 3.3 // the wall behind a colonnade
const outline: XY[] = [
  [-XN, YN], [-XN, 33.45], [-50.7, 33.45], [-50.7, YE1], [-XE, YE1], [-XE, YE0], [-50.5, YE0], [-50.5, -31.7], [-XS, -31.7], [-XS, YS],
  [XS, YS], [XS, -31.7], [50.5, -31.7], [50.5, YE0], [XE, YE0], [XE, YE1], [50.7, YE1], [50.7, 33.45], [XN, 33.45], [XN, YN],
]
// The walls: the outline with each colonnade's face pulled back to its wall.
const core: XY[] = outline.map(([x, y]) => {
  if (y === YN) return [x, YN - BACK]
  if (y === YS) return [x, YS + BACK]
  if (Math.abs(x) === XE) return [Math.sign(x) * (XE - BACK), y]
  return [x, y]
}) as XY[]
const attic = rect(-43.2, 43.2, -24.5, 25.9)
const top = rect(-38.65, 38.65, -19.8, 21.25)

// ---- Podium, walls, entablature, cornice, the flat roof over the colonnades.
pslab(stone, outline, 0, BASE, 0.25, true)
pslab(shade, core, BASE, COL, 0, false)
pslab(stone, outline, COL, ENT, 0, false, true)
{
  // the cornice: a projecting band, its soffit closed
  const out = poffset(outline, 0.7)
  pslab(stone, out, ENT, CORNICE, 0.35, roof, true)
}
// The blank corner pavilions are in the stone colour, not the shade, so
// they read as solid masonry beside the dark colonnades: overlay their faces.
{
  const faces: Array<[Side, number, number, number]> = []
  for (const s of [-1, 1]) {
    faces.push(['n', 33.45, Math.min(s * XN, s * 50.7), Math.max(s * XN, s * 50.7)])
    faces.push(['n', YE1, Math.min(s * 50.7, s * (XE - BACK)), Math.max(s * 50.7, s * (XE - BACK))])
    faces.push(['s', YE0, Math.min(s * 50.5, s * (XE - BACK)), Math.max(s * 50.5, s * (XE - BACK))])
    faces.push(['s', -31.7, Math.min(s * XS, s * 50.5), Math.max(s * XS, s * 50.5)])
    faces.push([s < 0 ? 'w' : 'e', s * 50.7, YE1, 33.45])
    faces.push([s < 0 ? 'w' : 'e', s * 50.5, -31.7, YE0])
    faces.push([s < 0 ? 'w' : 'e', s * XN, 33.45, YN - BACK])
    faces.push([s < 0 ? 'w' : 'e', s * XS, YS + BACK, -31.7])
  }
  for (const [side, at, a0, a1] of faces) panel(stone, side, at, a0, a1, BASE, COL, 0.03)
  // a niche window with a hood on each big pavilion face
  for (const s of [-1, 1]) {
    const mx = s * (XN + 50.7) / 2
    for (const [side, at] of [['n', 33.45], ['s', -31.7]] as Array<[Side, number]>) {
      panel(win, side, at, mx - 1.3, mx + 1.3, 9.5, 14.5, 0.07)
      cbox(stone, rect(mx - 2.0, mx + 2.0, side === 'n' ? at : at - 0.5, side === 'n' ? at + 0.5 : at), 14.6, 15.4, { b: 0.15, bottom: true })
    }
  }
}

/** A Corinthian column: shaft, a flared bell for the capital, an abacus. */
function column(x: number, y: number, z0 = BASE, z1 = COL) {
  const seg = 8, bell = 1.7
  cylinder(stone, x, y, R, z0, z1 - bell, seg, R * 0.88)
  cylinder(stone, x, y, R * 0.88, z1 - bell, z1 - 0.45, seg, R * 1.22)
  cbox(stone, rect(x - R * 1.3, x + R * 1.3, y - R * 1.3, y + R * 1.3), z1 - 0.45, z1, { bottom: true, top: false })
}
/** Columns evenly from a0 to a1 along a front, and a tall window in each bay between. */
function colonnade(side: Side, face: number, a0: number, a1: number, n: number, wall: number, windows = true) {
  const ns = side === 'n' || side === 's', sgn = side === 'n' || side === 'e' ? 1 : -1
  const line = face - sgn * (R + 0.6)
  const pos = Array.from({ length: n }, (_, k) => a0 + ((a1 - a0) * k) / (n - 1))
  for (const a of pos) ns ? column(a, line) : column(line, a)
  if (!windows) return
  for (let k = 0; k < n - 1; k++) {
    const c = (pos[k] + pos[k + 1]) / 2, w = Math.min(2.4, (pos[k + 1] - pos[k]) * 0.5)
    // a tall window over two storeys, and a short one over the podium
    panel(win, side, wall, c - w / 2, c + w / 2, 9.2, COL - 2.2, 0.04)
    panel(win, side, wall, c - w / 2, c + w / 2, BASE + 1.0, 7.8, 0.04)
  }
}
// North: five either side of the portico.
for (const s of [-1, 1]) {
  const [a0, a1] = s < 0 ? [-XN + 1.6, -XNP - 2.6] : [XNP + 2.6, XN - 1.6]
  colonnade('n', YN, a0, a1, 5, YN - BACK)
  const [b0, b1] = s < 0 ? [-XS + 1.6, -XSP - 2.6] : [XSP + 2.6, XS - 1.6]
  colonnade('s', YS, b0, b1, 5, YS + BACK)
  colonnade(s < 0 ? 'w' : 'e', s * XE, YE0 + 1.6, YE1 - 1.6, 10, s * (XE - BACK))
}

// ---- The attic and its stepped top storey.
{
  cbox(stone, attic, CORNICE - 0.1, ATTIC - 1.4, { top: false })
  cbox(stone, grow(attic, 0.25), 35.2, 35.8, { b: 0.15, bottom: true, top: false }) // the fascia band
  cbox(stone, grow(attic, 0.7), ATTIC - 1.4, ATTIC, { b: 0.35, bottom: true, top: roof })
  cbox(stone, top, ATTIC, TOP - 0.6, { top: false })
  cbox(stone, grow(top, 0.35), TOP - 0.6, TOP, { b: 0.25, bottom: true, top: roof })
}

// ---- Porticos.
/** A pediment roof from the front back to the attic, with its raking cornice. */
function pediment(front: number, back: number, x: number, sgn: number) {
  const y0 = Math.min(front, back), y1 = Math.max(front, back)
  gable(roof, stone, rect(-x, x, y0, y1), CORNICE, APEX, true, sgn < 0 ? [true, false] : [false, true])
  const f = front + sgn * 0.35
  for (const sx of [-1, 1]) {
    qf(stone, [sx * x, f, CORNICE - 0.05], [0, f, APEX + 0.05], [0, f, APEX - 0.6], [sx * x, f, CORNICE - 0.6], [0, sgn, 0])
    qf(stone, [sx * x, f, CORNICE - 0.6], [0, f, APEX - 0.6], [0, front, APEX - 0.6], [sx * x, front, CORNICE - 0.6], [0, 0, -1])
  }
}
{
  // South, on Constitution Avenue: deep, two rows, over the steps.
  const pr = rect(-XSP, XSP, YSP, YS + BACK)
  cbox(stone, pr, 0, BASE, { b: 0.2, top: true })
  cbox(stone, pr, COL, ENT, { bottom: true, top: false })
  cbox(stone, grow(rect(-XSP, XSP, YSP, YS), 0.7, 0.7), ENT, CORNICE, { b: 0.35, bottom: true, top: false })
  pediment(YSP - 0.7, attic.y0, XSP + 0.7, -1)
  const front = YSP + R + 0.6
  for (let k = 0; k < 8; k++) column(-XSP + 1.6 + ((2 * XSP - 3.2) * k) / 7, front)
  for (let k = 1; k < 7; k++) column(-XSP + 1.6 + ((2 * XSP - 3.2) * k) / 7, front + 4.4)
  for (const sx of [-1, 1]) column(sx * (XSP - 1.6), front + 4.4)
  panel(shade, 's', YS + BACK, -XSP, XSP, BASE, COL, 0.02)
  panel(door, 's', YS + BACK, -2.2, 2.2, BASE, BASE + 11.5, 0.06)
  // The steps: a broad flight down to the avenue, between two pedestals.
  const N = 7, RUN = 7.0, W = 24
  for (let k = 0; k < N; k++) cbox(stone, rect(-W + 2, W - 2, YSP - RUN + (k * RUN) / N, YSP), 0, ((k + 1) * BASE) / N, { top: true })
  for (const sx of [-1, 1]) {
    cbox(stone, rect(sx < 0 ? -W - 3 : W - 2, sx < 0 ? -W + 2 : W + 3, YSP - RUN, YS - 1), 0, BASE + 0.6, { b: 0.2 })
    cbox(stone, rect(sx * (W - 0.5) - 2.2, sx * (W - 0.5) + 2.2, YSP - RUN + 0.8, YSP - RUN + 6), BASE + 0.6, BASE + 4.2, { b: 0.25 })
  }
}
{
  // North, on Pennsylvania Avenue: shallow, one row, a door in the podium.
  const pr = rect(-XNP, XNP, YN - BACK, YNP)
  cbox(stone, pr, 0, BASE, { b: 0.2, top: true })
  cbox(stone, pr, COL, ENT, { bottom: true, top: false })
  cbox(stone, grow(rect(-XNP, XNP, YN, YNP), 0.7, 0.7), ENT, CORNICE, { b: 0.35, bottom: true, top: false })
  pediment(YNP + 0.7, attic.y1, XNP + 0.7, 1)
  const n = 8, front = YNP - R - 0.6
  const xs = Array.from({ length: n }, (_, k) => -XNP + 1.5 + ((2 * XNP - 3) * k) / (n - 1))
  for (const x of xs) column(x, front)
  for (let k = 0; k < n - 1; k++) {
    const c = (xs[k] + xs[k + 1]) / 2
    panel(win, 'n', YN - BACK, c - 1.2, c + 1.2, 9.2, COL - 2.2, 0.04)
    panel(win, 'n', YN - BACK, c - 1.2, c + 1.2, BASE + 1.0, 7.8, 0.04)
  }
  panel(door, 'n', YNP, -1.6, 1.6, 0, 3.8, 0.04)
  for (const sx of [-1, 1]) cbox(stone, rect(sx * 22 - 2.2, sx * 22 + 2.2, YN + 0.5, YN + 5.5), 0, 4.0, { b: 0.25 })
}

await saveModel('dc-national-archives', 'National Archives Building', [
  { part: stone, material: finish('archives-limestone', 0xece3d3) },
  { part: shade, material: finish('archives-limestone-shade', 0xcfc5b6) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { source: 'generators/dc-national-archives.ts', bearing: 0, osm: 'way/66418953', footprint: [110.9, 86.4], height: TOP }, 6500)
