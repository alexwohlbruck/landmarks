/**
 * JPMorgan Chase Tower (600 Travis Street, 1982, I. M. Pei & Partners with
 * 3D/International; built as Texas Commerce Tower), Houston — original
 * procedural geometry, CC0-1.0.
 * bun generators/hou-jpmorgan-chase-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/44130644,
 * 29.760399,-95.364005. Its walls run at 34.9° / 124.9° (the downtown
 * grid), so the catalog bearing is 34.9 and the plan is square to the frame:
 * model +y faces north-east (Travis/Capitol side), +x south-east.
 *
 * Identity, in order: the plain five-sided prism, a 49 m square with one
 * corner (west, facing Travis and Capitol) sheared off at 45° from the middle
 * of one face to the middle of the next; that sheared face all glass in
 * horizontal ribbons, against the four grey granite faces with their even
 * grid of punched square windows; the three other corners chamfered; the
 * flat top; the tall glazed lobby at the foot of the sheared face.
 *
 * Evidence:
 *  - plan: OSM outline way/44130644, read in the turned frame: a square
 *    48.9 x 48.5 m (drawn 48.9 m square, centre 2.2 m south-west of the
 *    centroid), three corners chamfered 3.2-3.85 m along each leg (drawn
 *    3.5 m), and the cut running from (-0.2, -H) to (-H, -0.6): the middle of
 *    the two faces, drawn exactly at the midpoints. USGS NAIP and the lidar
 *    surface (below) show the same outline, no offset.
 *  - corners: the three plain corners are flat chamfers, solid granite with
 *    no windows: Jim Evans's photo shows the near corner as one flat granite
 *    face at 45°, and the 0.5 m lidar roof edge cuts each corner on a
 *    straight diagonal (3-4 m legs), not an L. The dark vertical line in
 *    Highsmith's and Agsftw's photos is at the end of the sheared face: a
 *    recessed slot, about 1.2 m wide and 1 m deep (estimate, below lidar
 *    resolution), with one column of windows, between the granite face and
 *    the granite pier that frames the glass. Drawn at both ends, mirrored.
 *  - height: 305 m to the roof, published (1,002 ft, 75 storeys;
 *    Wikipedia / CTBUH). Lidar: the parapet stands 307.5 m above ground_min,
 *    the street round the tower 3.5-4 m above that, so 304 m above the
 *    street; mechanical items on the roof reach ~2 m higher. OSM height=305.
 *  - lidar: USGS 3DEP TX_Coastal_B1_2018 (flown 2018), 1 m and 0.5 m grids.
 *  - granite grid: counted on Jim Evans's and Highsmith's photos, about 12
 *    square windows across a full face, one per floor. Drawn at half that
 *    density in both directions (6 panels a full face, 2 storeys a panel),
 *    so the square punched grid reads without a per-floor dot grid: panel
 *    4.2 m wide on a 7 m pitch, 5.0 m tall on an 8.1 m pitch (estimate).
 *  - sheared face: horizontal glass ribbons with thin granite spandrels
 *    (Agsftw's Dec 2013 photo from the Jones Hall side; Highsmith's high
 *    view). Drawn as one ribbon per two storeys with a 3.3 m band between,
 *    a 3 m granite pier framing each edge (Agsftw photo, scaled against
 *    the 34.6 m face: estimate).
 *  - lobby: the glazed entrance at the foot of the sheared face (WhisperToMe,
 *    CC0), about five storeys, drawn 0-19 m as one window panel, lit at
 *    night (estimate).
 *  - colours: the granite samples #9ea4a8 in Highsmith's photo, #85909e in
 *    shade in Agsftw's and #cdcdca in full sun in Jim Evans's: a mid
 *    neutral grey, darker than the pale spandrels of the sheared face.
 *    Drawn #c0bfba, pulled only to the palette's lightness, and the spandrel
 *    bands #e2e1dc. Windows and ribbons the palette window.
 *  - night: office windows and the lobby lit (window); the
 *    skyline night photo (UED77) shows the tower as a scattered lit window
 *    grid with a white light line along the roof edge, drawn as a 1.1 m
 *    neon band under the coping, granite-coloured by day.
 *
 * Ground: Houston is flat here; elevation 0. The plaza and the separate JPMorgan
 * Chase Center (way/44130646, across Capitol) are not part of the model.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - JPMorgan_Chase_Tower_(Houston).jpg, Jim Evans, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower_(Houston).jpg
 *  - JPMorgan_Chase_Tower,_Houston,_TX_(cropped).jpg, Carol M. Highsmith, PD
 *    https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower,_Houston,_TX_(cropped).jpg
 *  - JP_Morgan_Chase_Tower_in_Houston_2_-_Dec_2013.JPG, Agsftw, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:JP_Morgan_Chase_Tower_in_Houston_2_-_Dec_2013.JPG
 *  - JPMorgan_Chase_Tower_in_Houston_4.JPG, Agsftw, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower_in_Houston_4.JPG
 *  - JPMorgan_Chase_Tower_0.jpg, WhisperToMe, CC0
 *    https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower_0.jpg
 *  - JPMorgan_Chase_Tower_with_Houston_Skyline_at_night.jpg, Gabor Eszes
 *    (UED77), CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower_with_Houston_Skyline_at_night.jpg
 * Aerial: USGS NAIP (public domain). No look-only sources; no commercial imagery.
 *
 * Doubts: the punched windows are drawn at half the real density (real
 * pitch about 3 m, one per floor), coarser than the photos up close. The
 * slot size beside the sheared face is estimated from two photos. The
 * lobby's sloped glass is drawn flat. Roof mechanical items and antennas
 * left out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, panel, parapetRoof, save, walls, type XY } from './chi-aon-center'

const granite = new Part(), spandrel = new Part(), win = new Part(), roof = new Part(), crown = new Part()

const CX = -2.2, CY = -2.15 // the square's centre in the anchor frame
const H = 24.45, C = 3.5 // half-side, corner chamfer leg
const SW = 1.2, SD = 1.0 // the slot at each end of the sheared face: width along the granite face, depth
const TOP = 305
const P = (x: number, y: number): XY => [CX + x, CY + y]

// Counter-clockwise from the end of the south-west face (model -y) at the
// slot beside the sheared face. Each slot is a recessed inside corner: the
// granite face stops SW short of the cut line, steps in SD, and its back wall
// runs to the cut line. The two are mirror images about the plan's diagonal.
const ring: XY[] = [
  P(SW, -H), P(H - C, -H), P(H, -H + C), P(H, H - C), P(H - C, H), P(-H + C, H), P(-H, H - C),
  P(-H, SW), P(-H + SD, SW), P(-H + SD, -SD), // west slot
  P(-SD, -H + SD), P(SW, -H + SD), // south slot
]

// Body with a bevelled top edge, a parapet and a flat roof.
const top = block(granite, null, ring, 0, TOP, 0.5)
parapetRoof(granite, roof, top, TOP, 0.6, 1.0)

// Granite faces: panels on a 7 m pitch measured from each chamfer.
const PITCH = 7.0, PW = 3.4
const rowsOf = (z0: number, z1: number, pitch: number, h: number): [number, number][] => {
  const out: [number, number][] = []
  for (let z = z0; z + h <= z1 + 1e-6; z += pitch) out.push([z, z + h])
  return out
}
const grid = rowsOf(9.5, 302, 8.1, 4.2)
/** n panels on wall a→b, centres PITCH apart starting `first` from a. */
function columns(a: XY, b: XY, centres: number[], rows: [number, number][]) {
  for (const s of centres) for (const [z0, z1] of rows) panel(win, a, b, s - PW / 2, s + PW / 2, z0, z1)
}
const full = Array.from({ length: 6 }, (_, i) => 3.5 + i * PITCH) // on a 42 m face
const half = (L: number, fromEnd: boolean) =>
  [3.5, 3.5 + PITCH, 3.5 + 2 * PITCH].map(s => (fromEnd ? L - s : s))
const seg = (i: number): [XY, XY] => [ring[i], ring[(i + 1) % ring.length]]
const L = (i: number) => { const [a, b] = seg(i); return Math.hypot(b[0] - a[0], b[1] - a[1]) }

columns(...seg(0), half(L(0), true), grid) // south-west half face, counted from its chamfer
columns(...seg(2), full, grid) // south-east
columns(...seg(4), full, grid) // north-east
columns(...seg(6), half(L(6), false), grid) // north-west half face
// The chamfers are plain granite (Jim Evans's close view). The slots' back
// walls carry one column of windows, which reads as the dark line beside the
// sheared face in Highsmith's and Agsftw's photos.
for (const i of [8, 10]) for (const [z0, z1] of grid) panel(win, ...seg(i), 0.3, L(i) - 0.3, z0, z1)

// The sheared face: horizontal glass ribbons between pale spandrels, a granite
// pier at each edge, lobby at the foot.
{
  const [a, b] = seg(9), Lc = L(9), M = 3.0
  panel(spandrel, a, b, M, Lc - M, 19.0, 302, 0.02)
  for (const [z0, z1] of rowsOf(21.5, 302, 8.1, 4.8)) panel(win, a, b, M, Lc - M, z0, z1)
  panel(win, a, b, M, Lc - M, 0, 19.0)
}

// The white light line along the roof edge at night (UED77's night photo):
// a band just under the coping, granite-coloured by day.
for (let i = 0; i < ring.length; i++) { const [a, b] = seg(i); panel(crown, a, b, 0, L(i), TOP - 1.7, TOP - 0.6, 0.05) }

await save('hou-jpmorgan-chase-tower', 'JPMorgan Chase Tower', [29.760399, -95.364005], 34.9, [
  { part: granite, material: finish('chase-granite', 0xc0bfba) },
  { part: spandrel, material: finish('chase-spandrel', 0xe2e1dc) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: crown, material: finish('neon-chase-crown', 0xcfcec9) },
])
