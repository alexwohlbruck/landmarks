/**
 * James R. Mills Building, San Diego — MTS headquarters, 1255 Imperial
 * Avenue (opened 3 January 1989), over the 12th & Imperial Transit Center.
 * OSM names it "MTS Center Building". The free-standing clock tower in the
 * plaza in front is its own model (sd-12th-imperial-clock-tower); this file
 * takes its finishes and `beam` helper from that generator.
 *
 * Identity: a plain grey precast box, a deep square grid of blue windows on
 * every face; a two-storey base of big red X braces between the precast
 * columns; one row of wide windows above it; a solid band at the top. The
 * trolley tracks run through the east end of the building at ground level.
 *
 * Frame: bearing 334.3 (the long faces run 64.3°/244.3°): +x is the long
 * axis toward the east-north-east end, +y the front (north-north-west, the
 * plaza and clock tower). Map frame z up, metres; origin at the anchor
 * (−117.1533954, 32.7057002), the centroid of OSM way/31819765; y = 0 the
 * plaza.
 *
 * Sources
 * - OSM way/31819765 (building=transportation, 10 levels, grey concrete):
 *   a 58.9 × 32.6 m rectangle (measured from the outline). © OSM
 *   contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid, read in
 *   this frame: parapet 44.7 m above the plaza (ground 0.5 m above the box's
 *   ground_min); mechanical penthouses 46.6 m (x −10…+10, y −15…+1) and
 *   50.2 m (x −16…−6, y −9…+1). The lidar outline matches OSM.
 * - USGS NAIP orthophoto: plan, the penthouses, and the trolley platforms
 *   (yellow edges) that run under the east end from the north-north-west
 *   face to the south-south-east one.
 * - Wikipedia, "James R. Mills Building": 10 floors, 37 m, 1989, trains
 *   through its lobby. The published 37 m is under every lidar return on
 *   the roof; the lidar is followed.
 * Photos (evidence):
 * - "James R. Mills Building.jpg", "San Diego, 2016 - 568.jpg", Another
 *   Believer, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:James_R._Mills_Building.jpg
 *   (front and east end from high up; storey heights scaled from it).
 * - "James R. Mills Building IMG 0308.jpg", Balintawak, public domain,
 *   https://commons.wikimedia.org/wiki/File:James_R._Mills_Building_IMG_0308.jpg
 *   (the base braces, the wide third-floor windows, the window grid).
 * - "East Village, San Diego, CA, USA - panoramio (7).jpg", "(11)", Roman
 *   Eugeniusz, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:East_Village,_San_Diego,_CA,_USA_-_panoramio_(7).jpg
 *   (east end and front, sunny; colours; bay counts 16 × 9).
 * - "12th & Imperial Transit Center.JPG", Vrysxy, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:12th_%26_Imperial_Transit_Center.JPG
 *   and "12th & Imperial Station.JPG", Alex537, CC BY-SA 4.0 (the open
 *   trackway under the building).
 * - "12th & Imperial.jpg", Cloverof4, CC BY-SA 4.0 (from the west).
 *
 * Numbers
 * - 16 bays on the long faces and 9 on the ends (counted, Eugeniusz (7)),
 *   so ≈ 3.65 m a bay; piers 1.0 m (estimated).
 * - Base 0–9.6 m (two storeys), wide-window floor 9.6–13.5 m, seven
 *   floors of 3.9 m to 40.8 m, top band to 44.7 m — scaled from Another
 *   Believer's front view against the lidar height (estimated). Windows are
 *   grouped as panels of two bays by two storeys (floors 3–4 … 9–10), the
 *   facade's square grid at a scale that holds at 80 px; the third floor's
 *   wider windows are not drawn apart.
 * - Red X braces: one per pair of bays, spanning both base storeys
 *   (Another Believer, Balintawak).
 * - The trackway: the east four bays (x +14.7…+29.5) open through the
 *   building's depth for the ground storey, 0–5.2 m (estimated from NAIP and
 *   Vrysxy's photo).
 * - Colours from the sunny photos, pulled to the palette's lightness: warm
 *   grey precast, blue reflective glass, signal red.
 *
 * Doubts
 * - The base storeys' exact heights and the trackway's width and height are
 *   estimates; no photo looks straight through it.
 * - The windows' red mullions and the precast frame's depth are left out.
 * - The rear (south-south-east) face is drawn like the front; no photo shows
 *   it whole.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { qf, cbox, rect, save } from './dc-white-house'
import { MTS_CONCRETE, MTS_RED, MTS_DARK, beam } from './sd-12th-imperial-clock-tower'

const con = new Part(), win = new Part(), red = new Part(), roof = new Part(), dark = new Part()
const HX = 29.45, HY = 16.3
const B1 = 9.6, F3 = 13.5, F10 = 40.8, TOP = 44.7
const PASS_X = 14.7, PASS_Z = 5.2 // the trackway: x from PASS_X to the east end, up to PASS_Z
const SET = 0.8 // the base's glass wall stands this far behind the columns

type Face = { P: (u: number, z: number, d: number) => V3; L: number; bays: number; n: V3 }
// u runs left to right seen from outside, from 0 to L.
const FACES: Face[] = [
  { P: (u, z, d) => [-HX + u, -HY - d, z], L: 2 * HX, bays: 16, n: [0, -1, 0] }, // rear (SSE)
  { P: (u, z, d) => [HX + d, -HY + u, z], L: 2 * HY, bays: 9, n: [1, 0, 0] }, // east end
  { P: (u, z, d) => [HX - u, HY + d, z], L: 2 * HX, bays: 16, n: [0, 1, 0] }, // front (NNW)
  { P: (u, z, d) => [-HX - d, HY - u, z], L: 2 * HY, bays: 9, n: [-1, 0, 0] }, // west end
]
const PIER = 1.0

// Upper body: the walls from the base to the top, with a soft top edge.
cbox(con, rect(-HX, HX, -HY, HY), B1, TOP, { b: 0.4, top: false })
// Roof inside the parapet, the parapet's inner face, and the penthouses.
const IN = 0.7
qf(con, [-HX + 0.4, -HY + 0.4, TOP], [HX - 0.4, -HY + 0.4, TOP], [HX - IN, -HY + IN, TOP], [-HX + IN, -HY + IN, TOP], [0, 0, 1])
qf(con, [HX - 0.4, -HY + 0.4, TOP], [HX - 0.4, HY - 0.4, TOP], [HX - IN, HY - IN, TOP], [HX - IN, -HY + IN, TOP], [0, 0, 1])
qf(con, [HX - 0.4, HY - 0.4, TOP], [-HX + 0.4, HY - 0.4, TOP], [-HX + IN, HY - IN, TOP], [HX - IN, HY - IN, TOP], [0, 0, 1])
qf(con, [-HX + 0.4, HY - 0.4, TOP], [-HX + 0.4, -HY + 0.4, TOP], [-HX + IN, -HY + IN, TOP], [-HX + IN, HY - IN, TOP], [0, 0, 1])
const RZ = TOP - 1.0
for (const [a, b, c] of [
  [[-HX + IN, -HY + IN], [HX - IN, -HY + IN], [0, 1, 0]], [[HX - IN, -HY + IN], [HX - IN, HY - IN], [-1, 0, 0]],
  [[HX - IN, HY - IN], [-HX + IN, HY - IN], [0, -1, 0]], [[-HX + IN, HY - IN], [-HX + IN, -HY + IN], [1, 0, 0]],
] as [number[], number[], V3][]) qf(con, [a[0], a[1], RZ], [b[0], b[1], RZ], [b[0], b[1], TOP], [a[0], a[1], TOP], c as unknown as V3)
qf(roof, [-HX + IN, -HY + IN, RZ], [HX - IN, -HY + IN, RZ], [HX - IN, HY - IN, RZ], [-HX + IN, HY - IN, RZ], [0, 0, 1])
cbox(con, rect(-10, 10, -15, 1), RZ, 46.6, { b: 0.3, top: roof })
cbox(con, rect(-16, -6, -9, 1), RZ, 50.2, { b: 0.3, top: roof })

// Windows: panels of two bays by two storeys (floors 3–4, 5–6, 7–8,
// 9–10), so the facade keeps its grid of squares with piers and spandrels
// between; a nine-bay end puts its single bay in the middle.
const GROUPS: [number, number][] = [0, 1, 2, 3].map((k) => [B1 + k * 7.8, B1 + (k + 1) * 7.8])
for (const f of FACES) {
  const bay = f.L / f.bays
  const spans: [number, number][] = []
  if (f.bays % 2 === 0) for (let k = 0; k < f.bays; k += 2) spans.push([k, k + 2])
  else {
    const m = (f.bays - 1) / 2
    for (let k = 0; k < m; k += 2) spans.push([k, k + 2])
    spans.push([m, m + 1])
    for (let k = m + 1; k < f.bays; k += 2) spans.push([k, k + 2])
  }
  for (const [k0, k1] of spans) {
    const u0 = k0 * bay + 0.85, u1 = k1 * bay - 0.85
    for (const [z0, z1] of GROUPS) qf(win, f.P(u0, z0 + 0.85, 0.04), f.P(u1, z0 + 0.85, 0.04), f.P(u1, z1 - 0.85, 0.04), f.P(u0, z1 - 0.85, 0.04), f.n)
  }
}

// The base: precast columns every other bay, glass set back behind them,
// a red X across each pair of bays; the trackway open under the east end.
const inPass = (x: number) => x > PASS_X - 0.01
// Columns and the beam over the base storeys, on every face.
for (const f of FACES) {
  const bay = f.L / f.bays
  const cols: number[] = []
  for (let k = 0; k <= f.bays; k += 2) cols.push(k * bay)
  if (cols[cols.length - 1] < f.L - 0.01) cols.push(f.L)
  for (const c of cols) {
    const u0 = Math.max(0, c - PIER / 2), u1 = Math.min(f.L, c + PIER / 2)
    // A column: front and the two sides back to the glass.
    qf(con, f.P(u0, 0, 0), f.P(u1, 0, 0), f.P(u1, B1, 0), f.P(u0, B1, 0), f.n)
    const side = (u: number, s: number) => {
      const a = f.P(u, 0, 0), b = f.P(u, 0, -SET), dir = f.P(u + s, 0, 0)
      qf(con, a, b, f.P(u, B1, -SET), f.P(u, B1, 0), [dir[0] - a[0], dir[1] - a[1], 0])
    }
    if (u0 > 0) side(u0, -1)
    if (u1 < f.L) side(u1, 1)
  }
  // Floor-2 slab edge at 4.8 m and the beam under the wide windows.
  for (let i = 0; i + 1 < cols.length; i++) {
    const a = cols[i] + PIER / 2, b = cols[i + 1] - PIER / 2
    const pa = f.P(a, 0, 0), pb = f.P(b, 0, 0)
    const passBay = inPass(Math.min(pa[0], pb[0]) + 0.02) && f.n[0] === 0
    // Glass wall behind (above the trackway only on the open bays).
    const g0 = passBay ? PASS_Z : 0
    qf(win, f.P(a, g0, -SET), f.P(b, g0, -SET), f.P(b, B1, -SET), f.P(a, B1, -SET), f.n)
    // The red X, just in front of the glass.
    const m = (a + b) / 2
    if (passBay) {
      beam(red, f.P, a + 0.3, PASS_Z, m, B1 - 0.3, 0.6, -SET + 0.05, -SET + 0.45)
      beam(red, f.P, b - 0.3, PASS_Z, m, B1 - 0.3, 0.6, -SET + 0.05, -SET + 0.45)
    } else {
      beam(red, f.P, a + 0.3, 0.3, b - 0.3, B1 - 0.3, 0.6, -SET + 0.05, -SET + 0.45)
      beam(red, f.P, b - 0.3, 0.3, a + 0.3, B1 - 0.3, 0.6, -SET + 0.05, -SET + 0.45)
    }
  }
}
// The underside of the upper body over the set-back base.
for (const f of FACES) {
  qf(dark, f.P(0, B1, 0), f.P(f.L, B1, 0), f.P(f.L, B1, -SET), f.P(0, B1, -SET), [0, 0, -1])
}
// The trackway: open through the depth under the east bays. Its ceiling,
// its west wall, and the east end's wall (glass) stop at PASS_Z.
const X0 = PASS_X, X1 = HX - SET
qf(dark, [X0, -HY + SET, PASS_Z], [X1, -HY + SET, PASS_Z], [X1, HY - SET, PASS_Z], [X0, HY - SET, PASS_Z], [0, 0, -1])
qf(con, [X0, -HY + SET, 0], [X0, HY - SET, 0], [X0, HY - SET, PASS_Z], [X0, -HY + SET, PASS_Z], [1, 0, 0])
qf(con, [X1, -HY + SET, 0], [X1, HY - SET, 0], [X1, HY - SET, PASS_Z], [X1, -HY + SET, PASS_Z], [-1, 0, 0])
// The trackway's ceiling slab edge, on the long faces.
for (const s of [-1, 1]) qf(con, [X0, s * (HY - SET), PASS_Z - 0.01], [X1, s * (HY - SET), PASS_Z - 0.01], [X1, s * (HY - SET), PASS_Z + 0.6], [X0, s * (HY - SET), PASS_Z + 0.6], [0, s, 0])

await save('sd-james-r-mills-building', 'James R. Mills Building', [
  { part: con, material: MTS_CONCRETE },
  { part: win, material: finish('window', 0x6a86a8, 0.35) },
  { part: red, material: MTS_RED },
  { part: roof, material: finish('mts-roof', 0xa9adae) },
  { part: dark, material: MTS_DARK },
], { anchor: [-117.1533954, 32.7057002], bearing: 334.3 })
