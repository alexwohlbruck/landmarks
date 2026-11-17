/**
 * Newark Liberty International Airport (EWR): the new Terminal A (opened
 * December 2022 / January 2023; 33 gates). Procedural, CC0-1.0.
 *   bun generators/nyc-ewr-terminal-a.ts
 *
 * A long headhouse along the curb on the west, under one great flat roof
 * that cantilevers far out over the departures roadway on a thin white
 * edge, its soffit dark and ribbed, over a tall glass front; on the roof, a
 * row of large diamond skylights (the faceted, folded-plate ceiling of the
 * check-in hall seen from outside). Behind it a triangular core with three
 * more diamonds, and three concourses as plain two-storey massing: north,
 * east and south.
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Origin at the
 * centroid of OSM way/802991914 (aeroway=terminal, "Terminal A",
 * start_date 2021), which outlines headhouse and concourses together; it
 * is split here along its own vertices into hall, core and the three
 * concourses. (OSM way/435384598, "Former Terminal A", is the 1973
 * terminal and is not modelled.)
 *
 * Sources:
 * - Plan: the OSM outline. USGS NAIP (usgs.py naip, 0.76 m) confirms it and
 *   shows the roof: the headhouse's row of twelve diamond skylights about
 *   30 x 17 m each, centred 33 m in from the glass front, and three on the
 *   core; the roof light grey.
 * - Photo a5 "Airtrain near new terminal A.jpg", Schvaxet, CC BY-SA 4.0,
 *   from the south-west across the AirTrain: the cantilevered roof, its
 *   white edge and dark soffit, the glass front.
 *   https://commons.wikimedia.org/wiki/File:Airtrain_near_new_terminal_A.jpg
 * - Photos a1 "New terminal A EWR.jpg", a2 "New terminal A EWR 2.jpg"
 *   (Schvaxet, CC BY-SA 4.0): the check-in hall inside, the faceted ceiling
 *   and its diamond skylights, the full-height glass wall.
 *   https://commons.wikimedia.org/wiki/File:New_terminal_A_EWR.jpg
 *   https://commons.wikimedia.org/wiki/File:New_terminal_A_EWR_2.jpg
 * - Photo a4 "Newark Airport Terminal A 2023.jpg", Antony-22, CC BY-SA 4.0:
 *   a concourse inside, clerestory glazing.
 *   https://commons.wikimedia.org/wiki/File:Newark_Airport_Terminal_A_2023.jpg
 * - Published: opened 2022-23, 33 gates (Wikipedia, "Newark Liberty
 *   International Airport").
 *
 * Heights are estimated, not measured: the only lidar (NJ 2014) predates
 * the terminal. From a5, scaled to an upper roadway about 7.5 m up and a
 * departures canopy about 6 m over it: the headhouse roof edge about 26 m,
 * the overhang about 15 m deep. The core (18 m) and concourses (14 m) are
 * estimated from typical two-level concourses and NAIP shadows, which fall
 * short of the headhouse's. The roof is drawn flat: the photos show a
 * straight roof edge, not a wave; the "wave" is the folded ceiling inside.
 * The lower departures canopy on V-columns over the roadway (a5) is left
 * to the map's roads and not drawn; jet bridges and aprons are not drawn.
 *
 * Doubts: only one licensed exterior photo (a5); the airside faces of the
 * headhouse and the concourse facades are not photographed and are drawn
 * plainly with window bands.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panels, clean, inset, cap, walls, type XY } from './clt-terminal'

const roof = new Part(), trim = new Part(), win = new Part(), glass = new Part(), panel = new Part(), soffit = new Part()

const HALL: XY[] = [[-144.6, -125.0], [-90.1, -101.8], [-71.0, 115.6], [-120.9, 147.4]]
const CORE: XY[] = [[-90.1, -101.8], [-68.1, -98.8], [-52.7, -71.8], [0.6, -49.9], [69.3, -21.7], [76.6, -22.1], [79.4, 8.7],
  [71.9, 9.3], [13.6, 46.1], [-32.1, 75.0], [-39.8, 79.8], [-49.7, 108.8], [-71.0, 115.6]]
const NORTH: XY[] = [[-71.0, 115.6], [-49.7, 108.8], [-53.0, 177.8], [-55.1, 222.9], [-55.8, 238.0], [-58.3, 290.1], [-59.7, 319.3],
  [-59.9, 323.9], [-60.6, 337.9], [-82.1, 325.2]]
const EAST: XY[] = [[76.6, -22.1], [85.8, -22.9], [126.6, -26.5], [167.5, -30.1], [209.7, -33.8], [257.7, -38.1], [286.1, -40.6],
  [290.1, -54.2], [307.9, -55.8], [337.5, -58.3], [356.1, -59.9], [357.6, -56.8], [363.0, -46.0], [366.6, -39.0], [368.0, -23.6],
  [365.3, -14.9], [362.0, -4.3], [361.3, -2.3], [342.5, -0.7], [312.5, 1.9], [295.3, 3.4], [288.8, -9.7], [254.3, -6.7],
  [224.9, -4.1], [184.0, -0.5], [145.3, 2.9], [79.4, 8.7]]
const SOUTH: XY[] = [[-90.1, -101.8], [-137.2, -306.5], [-128.4, -313.8], [-117.8, -322.6], [-104.2, -261.4], [-85.4, -174.2], [-68.1, -98.8]]

const H_HALL = 26, H_CORE = 18, H_CONC = 14

// ------------------------------------------------------------ concourses and core
for (const ring of [NORTH, EAST, SOUTH]) {
  const r = block(panel, roof, ring, 0, H_CONC, 0.4)
  panels(win, r, 4.0, 6.8, { bay: 10, gap: 1.4, end: 2, minLen: 8 })
  panels(win, r, 8.6, 12.2, { bay: 10, gap: 1.4, end: 2, minLen: 8 })
}
{
  const r = block(panel, roof, CORE, 0, H_CORE, 0.4)
  panels(win, r, 4.0, 15.5, { bay: 12, gap: 2.0, end: 3, minLen: 10 })
}

// ------------------------------------------------------------ the headhouse hall
const hall = clean(HALL)
walls(panel, hall, 0, H_HALL - 1.2)
// the glass front on the west face, and glazing on the north and south ends
for (let i = 0; i < hall.length; i++) {
  const a = hall[i], b = hall[(i + 1) % hall.length]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const west = n[0] < -0.9
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * 0.06, a[1] + u[1] * s + n[1] * 0.06, z]
  if (west) {
    // full-height glass between pale columns 18 m apart
    const k = Math.round(L / 18), w = L / k
    for (let q = 0; q < k; q++) win.quad(P(q * w + 0.7, 0.5), P((q + 1) * w - 0.7, 0.5), P((q + 1) * w - 0.7, H_HALL - 2.2), P(q * w + 0.7, H_HALL - 2.2))
  } else if (n[1] > 0.5 || n[1] < -0.5) {
    win.quad(P(4, 9), P(L - 4, 9), P(L - 4, H_HALL - 3), P(4, H_HALL - 3))
  }
}
// the roof: a slab cantilevered 15 m beyond the glass front (and 3 m at the ends)
const OVER = 15
function grow(r: XY[], west: number, other: number): XY[] {
  // push each edge out by its own amount, then re-intersect neighbouring edges
  const n = r.length
  const lines = r.map((a, i) => {
    const b = r[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [u[1], -u[0]]
    const d = nn[0] < -0.9 ? west : other
    return { p: [a[0] + nn[0] * d, a[1] + nn[1] * d] as XY, u }
  })
  return lines.map((l1, i) => {
    const l0 = lines[(i - 1 + n) % n]
    const den = l0.u[0] * l1.u[1] - l0.u[1] * l1.u[0]
    const t = ((l1.p[0] - l0.p[0]) * l1.u[1] - (l1.p[1] - l0.p[1]) * l1.u[0]) / den
    return [l0.p[0] + l0.u[0] * t, l0.p[1] + l0.u[1] * t] as XY
  })
}
const slab = grow(hall, OVER, 3)
const Z0 = H_HALL - 1.3
walls(trim, slab, Z0, H_HALL + 0.4) // the thin white edge
cap(soffit, slab, Z0, false) // the dark underside
cap(roof, slab, H_HALL + 0.4)
// the skylights: a row of diamonds 33 m in from the glass, flush on the roof
const diamond = (c: XY, w: number, h: number, z: number) => {
  const d: XY[] = [[c[0], c[1] - h / 2], [c[0] + w / 2, c[1]], [c[0], c[1] + h / 2], [c[0] - w / 2, c[1]]]
  cap(glass, d, z + 0.5)
}
{
  const a = hall[0], b = hall[3] // the west front, south to north (after clean, ring starts at SW)
  const wf = hall.find(([x, y]) => x < -140)!, wn = hall.find(([x, y]) => y > 140)!
  const L = Math.hypot(wn[0] - wf[0], wn[1] - wf[1]), u: XY = [(wn[0] - wf[0]) / L, (wn[1] - wf[1]) / L], n: XY = [u[1], -u[0]]
  void a; void b
  for (let k = 0; k < 12; k++) {
    const s = 64 + k * 14.6
    diamond([wf[0] + u[0] * s + n[0] * 30, wf[1] + u[1] * s + n[1] * 30], 30, 14.6, H_HALL)
  }
}
for (const y of [27, 4, -19]) diamond([-30, y], 26, 16, H_CORE - 0.1)

const parts = [
  { part: roof, material: finish('terminal-roof', 0xd5d9db) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: panel, material: finish('terminal-panel', 0xc4cacf) },
  { part: soffit, material: finish('soffit-dark', 0x52585f) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Newark Liberty Terminal A', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: H_HALL + 0.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/802991914'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-ewr-terminal-a.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
