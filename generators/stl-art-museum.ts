/**
 * Saint Louis Art Museum, Forest Park, St. Louis — Cass Gilbert's Palace of
 * Fine Arts (1904, the one permanent building of the Louisiana Purchase
 * Exposition), its rear additions, and David Chipperfield's East Building
 * (2013) — procedural, CC0-1.0, no textures.  bun generators/stl-art-museum.ts
 *
 * Map frame: x along the main front (east-south-east +x), y toward the front
 * (Art Hill, north-north-east), z up, metres. Bearing 37°: the front faces
 * 37°, the long walls of all three OSM outlines run at 127° (edges 126.3–127.5°).
 * Anchor -90.2946472, 38.6390722: the area-weighted centroid of the three
 * outlines the model draws.
 *
 * What it draws (OSM, all fetched with osm.py buildings, half 200 m):
 *   - relation/20743888 (building=yes, historic, 1904): the Palace — two long
 *     limestone wings either side of the tall central Sculpture Hall, which
 *     ends at the front in the entrance pavilion: six Corinthian columns in
 *     antis between two pylons, an entablature, and above it the attic with
 *     the great semicircular window under a pediment;
 *   - relation/20743890 (building=yes): the rear additions behind the west
 *     wing (plain limestone blocks, 2.5–15 m);
 *   - way/483555579 "East Building": Chipperfield's extension, joined to the
 *     Palace's east wing (OSM outlines share the nodes at x 27.5–47.3), so
 *     it is part of the museum and of this model: low, dark polished
 *     concrete, glass entrance walls under a thin projecting roof, the
 *     coffered roof with its grid of skylights.
 *   Left out: way/1481952810 (a 182 m² service shed 15 m west of the rear
 *   additions, separate) and the Apotheosis of St. Louis statue in front.
 *
 * Heights: USGS lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017–18, 1 m),
 * read in this frame with tools/lidar_frame.py, above the front plaza (G).
 * y = 0 of the model is 1.7 m under G: the lowest ground at the walls (the
 * service court between the Palace and the East Building, x 4–14, y 0).
 * Measured above G: wings' walls 11–13 (eaves 12.5), the central clerestory
 * band across both wings 16–19 (drawn 17.5), the front and back roof bays
 * 13–15; the Sculpture Hall 19 m wide (x -20 to -1) with eaves 24 and ridge
 * 27; the portico's entablature 15–18 (drawn 16.5); the pylons 16–18; the
 * pediment's apex about 28.5 (lidar 27 under it, the photo scaled from the
 * entablature); the rear bay of the hall 15–16; the rear additions 2.5,
 * 6–6.5, 9.5–11 and 15; the East Building 9.
 * Estimated from the photos (scaled from the 16.5 m entablature): the
 * columns (1.4 m across, 12 m tall), the attic window (11 m span, springing
 * 18 m), the steps (1.4 m), the end pavilions' arched windows, the East
 * Building's glass walls, roof overhang and coffer grid. The steps and the
 * portico floor (2 m over G) and the rear terrace (3.3 m) are raised to the
 * map's terrain, which stands up to 0.8 m over the lidar ground there.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   - "Saint Louis Art Museum (SLAM).jpg", Perpigfr, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Saint_Louis_Art_Museum_(SLAM).jpg
 *     (the front, straight on: portico, attic window, pediment, wings);
 *   - "Saint Louis Art Museum.jpg", Laraquelx, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Saint_Louis_Art_Museum.jpg
 *     (the front from the north-west with the west wing);
 *   - "St. Louis Art Museum in Forest Park.jpg", AmyBautz, CC BY-SA 3.0,
 *     https://commons.wikimedia.org/wiki/File:St._Louis_Art_Museum_in_Forest_Park.jpg
 *     (a wing's end pavilion: columns in antis, arched window, pediment);
 *   - "St louis Art Museum.jpg", public domain,
 *     https://commons.wikimedia.org/wiki/File:St_louis_Art_Museum.jpg
 *     (the Corinthian order and the yellow-buff attic brick behind);
 *   - "East Building, St. Louis Art Museum (SLAM).jpg", HOUYIMIN, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:East_Building,_St._Louis_Art_Museum_(SLAM).jpg
 *     (the East Building's glass entrance under the coffered roof, dusk).
 * Doubts: no photo shows the rear additions or the back of the Palace;
 * they follow the lidar massing in plain limestone. The East Building's
 * glass is drawn on its north and east entrance faces only. Statues, the
 * gilt eagles, the frieze grilles and the inscription are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, ccw, cornice, gableRoof, hipRoof, onWall, prism, rectShape, save, type XY } from './atl-tech-tower'
import { column } from './atl-flatiron-building'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), glass = new Part(), conc = new Part()
const OFF = 1.7 // the front plaza (G) above the model's y = 0
const H = (h: number) => h + OFF
const R = (x0: number, x1: number, y0: number, y1: number): XY[] => ccw([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])

// ── The Palace (relation/20743888) ─────────────────────────────────────────
// The body: the OSM outline, its front taken back to the portico's rear wall
// (y 51.2) so the columns stand free; the pylons fill out the front.
const PALACE = ccw([[-64.1, 42.7], [-64.1, 51.4], [-57.7, 51.4], [-57.7, 52.7], [-48.5, 52.6], [-48.5, 51.4], [-26.4, 51.3], [-21.6, 51.3], [-21.6, 49.6], [-0.2, 49.6], [-0.2, 51.2], [4.4, 51.2], [25.9, 51.1], [25.9, 52.2], [34.3, 52.1], [34.3, 51.1], [41.3, 51.1], [41.1, 34.1], [42.2, 34.1], [42.3, 32.2], [42.2, 21.6], [42.1, 19.9], [41.3, 19.9], [41.1, 0.4], [34.1, 0.3], [27.5, 0.3], [4.2, 0.5], [4.2, -2.9], [2.4, -2.9], [-1.3, -2.9], [-1.3, -5.4], [-9.6, -5.0], [-22.5, -5.4], [-25.1, -5.3], [-25.1, -2.2], [-28.5, -2.2], [-28.5, 0.8], [-64.2, 0.4], [-64.2, 0.8], [-64.4, 18.9], [-65.7, 18.9], [-65.7, 25.4], [-65.6, 32.9], [-64.2, 32.9], [-64.2, 34.4]])
const EAVE = H(12.5)
// The main body to the eaves, with a plinth band and the cornice.
prism(stone, PALACE, 0, EAVE, roof, 0)
cornice(trim, PALACE, EAVE - 0.9, 1.1, 0.6, roof)
cornice(trim, PALACE, H(2), 0.5, 0.25, null) // the plinth's top moulding (above the higher ground at the back)

// Wing roofs: low glass skylight roofs over the front and back bays, and the
// raised clerestory band across the middle (lidar 16–19).
for (const [x0, x1] of [[-62, -27.5], [5.5, 39.5]] as [number, number][]) {
  hipRoof(glass, x0, x1, 3, 18.5, EAVE + 0.2, H(15), 0)
  hipRoof(glass, x0, x1, 34, 49, EAVE + 0.2, H(15), 0)
  box(stone, x0, x1, 20, 32, EAVE, H(17.5), roof, 0.3)
  cornice(trim, R(x0, x1, 20, 32), H(17.5) - 0.6, 0.7, 0.35, roof)
  // the clerestory windows along both long faces, broad panels between piers
  const n = Math.round((x1 - x0) / 7)
  for (let i = 0; i < n; i++) {
    const s0 = (x1 - x0) * (i / n) + 0.9, s1 = (x1 - x0) * ((i + 1) / n) - 0.9
    onWall(win, [x1, 32], [x0, 32], rectShape(x1 - x0 - s1, x1 - x0 - s0, H(14), H(16.3)))
    onWall(win, [x0, 20], [x1, 20], rectShape(s0, s1, H(14), H(16.3)))
  }
}

// The end pavilions on the wings' outer ends: an arched window between two
// columns in antis under a pediment (AmyBautz photo), x = -65.7 and x = 42.2.
for (const [x, dir] of [[-65.7, -1], [42.3, 1]] as [number, number][]) {
  const y0 = 18.9, y1 = 32.9, ym = (y0 + y1) / 2
  const a: XY = dir < 0 ? [x, y1] : [x, y0], b: XY = dir < 0 ? [x, y0] : [x, y1]
  onWall(win, a, b, archShape(7, 3.6, H(2.5), H(8.5)), 0.06)
  for (const s of [-1, 1]) column(trim, [x + dir * 0.9, ym + s * 4.2], 0.65, H(1.2), H(11), 10)
  // the pediment over the pavilion, its gable facing out
  const xa = dir < 0 ? x - 0.2 : x - 6, xb = dir < 0 ? x + 6 : x + 0.2
  gableRoof(roof, stone, xa, xb, y0 - 0.5, y1 + 0.5, EAVE + 0.4, H(16), 'x', 0.3, 0.4)
}
// The band of square grille panels under the wings' cornice (photos), flush.
for (const [x0, x1] of [[-63.5, -27.5], [5.5, 40.5]] as [number, number][]) {
  const n = Math.round((x1 - x0) / 3.6)
  for (let i = 0; i < n; i++) {
    const xc = x0 + ((x1 - x0) * (i + 0.5)) / n
    const yf = xc > -57.7 && xc < -48.5 ? 52.6 : xc > 25.9 && xc < 34.3 ? 52.15 : xc > 0 ? 51.2 : 51.42 // the corner bays stand forward
    if (Math.abs(xc + 57.7) < 1 || Math.abs(xc + 48.5) < 1 || Math.abs(xc - 25.9) < 1 || Math.abs(xc - 34.3) < 1) continue
    onWall(roof, [xc + 0.8, yf], [xc - 0.8, yf], rectShape(0, 1.6, H(9.4), H(11.0)), 0.05)
  }
}
// Tall windows either side of the portico on the wings' fronts (photo).
for (const s of [-34, 12]) {
  onWall(win, [s + 1.5, 51.3], [s - 1.5, 51.3], rectShape(0, 3, H(3), H(9)))
}

// ── The Sculpture Hall and the entrance pavilion ───────────────────────────
const HX0 = -20, HX1 = -1, XM = (HX0 + HX1) / 2
box(stone, HX0, HX1, -5, 49.6, 0, H(24), null, 0)
cornice(trim, R(HX0, HX1, -5, 49.6), H(23.2), 0.9, 0.5, null)
gableRoof(roof, stone, HX0 - 0.3, HX1 + 0.3, -5.3, 49.6, H(24.1), H(27.3), 'y', 0.4, 0.2)
// The thermal windows along the hall's sides above the wings' roofs.
for (const [x, dir] of [[HX0, -1], [HX1, 1]] as [number, number][]) {
  for (const yc of [9, 26, 43]) {
    const a: XY = dir < 0 ? [x, yc + 5] : [x, yc - 5], b: XY = dir < 0 ? [x, yc - 5] : [x, yc + 5]
    onWall(win, a, b, archShape(5, 8, H(18.2), H(18.2), 8))
  }
}
// The rear bay behind the hall (lidar 15–16).
box(stone, -25.1, 4.2, -5.4, 0.5, 0, H(15.8), roof, 0.3)

// The attic: a block over the portico as wide as the hall, the great
// semicircular window in its face, a cornice, and the pediment above.
const AY0 = 49, AY1 = 54.2, AX0 = -21.6, AX1 = -0.2 // the attic spans the loggia (photo: about two thirds of the pavilion)
box(stone, AX0, AX1, AY0, AY1, H(16.5), H(25.4), roof, 0)
cornice(trim, R(AX0, AX1, AY0, AY1), H(24.6), 1.0, 0.6, null)
{
  const a: XY = [AX1, AY1], b: XY = [AX0, AY1], w = 14.2, s = (AX1 - AX0) / 2, zs = H(17.3)
  onWall(trim, a, b, archShape(s, w + 1.4, zs - 0.4, zs, 12), 0.05) // the stone surround
  onWall(win, a, b, archShape(s, w, zs, zs, 12), 0.1)
  for (const d of [-3.5, 0, 3.5]) onWall(trim, a, b, rectShape(s + d - 0.3, s + d + 0.3, zs, zs + Math.sqrt((w / 2) ** 2 - d * d) - 0.1), 0.16) // three bold mullions
  onWall(trim, a, b, rectShape(s - w / 2 + 0.3, s + w / 2 - 0.3, zs + 2.3, zs + 2.75), 0.16) // and a transom
}
// The pediment: a gable on the attic front, its raking cornice in roof.
gableRoof(trim, stone, AX0 - 0.6, AX1 + 0.6, AY0 + 0.4, AY1 + 0.3, H(25.6), H(29.0), 'y', 0.5, 0.25) // stone raking cornice

// The portico: two pylons, six Corinthian columns in antis between them, the
// entablature across the whole front, a recessed wall with three doors, steps.
const PY0 = 51.2, PY1 = 54.6, ENT0 = H(13.8), ENT1 = H(16.5)
box(stone, -26.4, AX0, PY0, PY1, 0, ENT1, roof, 0.3) // west pylon (5 m: the photo's 18% of the pavilion)
box(stone, AX1, 4.4, PY0, PY1, 0, ENT1, roof, 0.3) // east pylon
box(trim, AX0, AX1, 49.6, PY1, ENT0, ENT1, roof, 0.25, true) // entablature, roofing the loggia
cornice(trim, R(-26.4, 4.4, PY0, PY1), ENT1 - 0.8, 0.9, 0.55, roof)
for (let i = 0; i < 6; i++) {
  const x = AX0 + 1.5 + (i * (AX1 - AX0 - 3.0)) / 5 // spaced across the loggia (photo)
  column(trim, [x, PY1 - 0.95], 0.78, H(2), ENT0, 14)
  box(trim, x - 1.0, x + 1.0, PY1 - 1.95, PY1 + 0.05, ENT0 - 1.3, ENT0, null, 0.15) // capital
  box(stone, x - 0.45, x + 0.45, PY1 - 1.4, PY1 - 0.5, ENT1, ENT1 + 2.6, stone, 0.15) // a statue on the cornice
}
// the recessed front wall behind the columns with its three bronze doors
for (const x of [(AX0 + AX1) / 2 - 6, (AX0 + AX1) / 2, (AX0 + AX1) / 2 + 6]) {
  onWall(win, [x + 1.4, 49.6], [x - 1.4, 49.6], rectShape(0, 2.8, H(2), H(6.2)), 0.12)
}
// the portico floor and the steps up to it
box(stone, AX0, AX1, 49.6, PY1, 0, H(2), stone, 0.1)
// the dark recessed loggia wall behind the columns
onWall(conc, [AX1, 49.6], [AX0, 49.6], rectShape(0, AX1 - AX0, H(2), ENT0), 0.06)
for (let k = 0; k < 3; k++) box(stone, -24.5 + k * 0.3, 2.5 - k * 0.3, PY1, PY1 + 4.2 - k * 1.4, 0, H(1 + k * 0.45), stone, 0.1)

// ── The rear additions (relation/20743890) ─────────────────────────────────
const REAR = ccw([[-69.3, -23.2], [-69.3, -22.2], [-64.1, -21.9], [-64.2, 0.4], [-28.5, 0.8], [-28.5, -2.2], [-25.1, -2.2], [-25.1, -5.3], [-25.1, -14.8], [-20.8, -14.7], [-20.4, -75.9], [-36.6, -76.1], [-62.4, -76.3], [-62.4, -72.3], [-62.4, -71.5], [-71.4, -71.6], [-71.3, -79.0], [-76.6, -79.1], [-76.8, -43.8], [-67.4, -43.7], [-67.5, -28.8], [-69.3, -28.8], [-69.3, -27.9]])
prism(stone, REAR, 0, H(3.3), roof, 0.2) // a terrace roof over the higher ground on the west
prism(stone, ccw([[-69.3, -28.8], [-69.3, -22.2], [-64.1, -21.9], [-64.1, -14], [-25, -14], [-25, -14.8], [-20.8, -14.7], [-20.7, -29], [-67.5, -29]]), H(3.3) - 0.1, H(6.5), roof, 0.25)
prism(stone, ccw([[-76.8, -43.8], [-62.4, -43.8], [-62.4, -71.5], [-71.4, -71.6], [-71.3, -79.0], [-76.6, -79.1]]), H(3.3) - 0.1, H(6), roof, 0.25)
prism(stone, ccw([[-67.5, -43.7], [-67.5, -29], [-20.7, -29], [-20.6, -53], [-62.4, -53], [-62.4, -43.7]]), H(3.3) - 0.1, H(10), roof, 0.25)
prism(stone, R(-62.4, -20.5, -76, -53), H(3.3) - 0.1, H(15), roof, 0.3)
cornice(trim, R(-62.4, -20.5, -76, -53), H(14.3), 0.7, 0.35, null)

// ── The East Building (way/483555579) ──────────────────────────────────────
const EAST = ccw([[59.8, 40.0], [91.0, 40.0], [90.8, 9.5], [105.2, 9.5], [105.1, -11.8], [69.6, -11.8], [69.5, -37.2], [47.1, -37.2], [47.2, -25.1], [14.0, -25.1], [14.1, -4.7], [27.5, -4.7], [27.5, 0.3], [34.1, 0.3], [34.0, -4.4], [47.1, -4.4], [47.3, 21.6], [42.2, 21.6], [42.3, 32.2], [59.8, 32.2]])
const ET = H(9)
prism(conc, EAST, 0, ET - 0.9, null, 0)
// the thin roof slab, overhanging the entrance faces
const SLAB = ccw([[57.5, 43.2], [93.2, 43.2], [93.2, 11.5], [108.2, 11.5], [108.2, -11.8], [69.6, -11.8], [69.5, -37.2], [47.1, -37.2], [47.2, -25.1], [14.0, -25.1], [14.1, -4.7], [27.5, -4.7], [27.5, 0.3], [34.1, 0.3], [34.0, -4.4], [47.1, -4.4], [47.3, 21.6], [42.2, 21.6], [42.3, 32.2], [57.5, 32.2]])
prism(conc, SLAB, ET - 0.9, ET, roof, 0.1, true)
// glass entrance walls (north face toward the Palace's plaza, and the east end)
onWall(win, [91.0, 40.0], [59.8, 40.0], rectShape(3, 27.5, H(0.6), ET - 1.2), 0.06)
onWall(win, [105.1, -11.8], [105.2, 9.5], rectShape(2, 19.3, H(0.3), ET - 1.2), 0.06)
onWall(win, [59.8, 32.2], [42.3, 32.2], rectShape(2, 15.5, H(0.6), ET - 1.2), 0.06)
// the coffered roof: its deep coffers, each a skylight, about 9 m apart (NAIP)
const COFFERS: [number, number, number, number][] = [[49, 68, -35.5, -13.5], [49, 89, -10, 30.5], [61.5, 89, 32.5, 38.5], [16, 45.5, -23.5, -6.5], [91, 103.5, -10, 8]]
for (const [x0, x1, y0, y1] of COFFERS) {
  const nx = Math.max(1, Math.round((x1 - x0) / 9)), ny = Math.max(1, Math.round((y1 - y0) / 9))
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const a = x0 + ((x1 - x0) * i) / nx + 0.8, b = x0 + ((x1 - x0) * (i + 1)) / nx - 0.8
    const c = y0 + ((y1 - y0) * j) / ny + 0.8, d = y0 + ((y1 - y0) * (j + 1)) / ny - 0.8
    glass.quad([a, c, ET + 0.04], [b, c, ET + 0.04], [b, d, ET + 0.04], [a, d, ET + 0.04])
  }
}

// ── Night: the Palace's limestone fronts are floodlit, most at the portico.
const floodlit = (p: V3, n: V3) => {
  if (n[2] > 0.8) return 0.1
  if (p[0] > -27 && p[0] < 5 && p[1] > 45) return 1
  if (n[1] > 0.5) return 0.6
  return 0.3
}
await save('stl-art-museum', 'Saint Louis Art Museum', [
  { part: stone, material: { ...finish('slam-limestone', 0xe8e1d2), floodlight: floodlit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: floodlit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: glass, material: { ...PALETTE.glass, color: 0x93a6b5 } }, // the skylights, a muted grey-blue
  { part: conc, material: finish('slam-east-concrete', 0x7a7c7d) },
], { height: H(28.6), anchor: [38.6390722, -90.2946472], bearing: 37, osm: 'relation/20743888' }, 6500)
