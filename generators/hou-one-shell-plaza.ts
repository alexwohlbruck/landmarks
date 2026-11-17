/**
 * One Shell Plaza (910 Louisiana Street, 1971, Skidmore, Owings & Merrill:
 * Bruce Graham with Fazlur Khan's tube-in-tube structure), Houston —
 * original procedural geometry, CC0-1.0.
 * bun generators/hou-one-shell-plaza.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/44821986,
 * 29.759151,-95.367664. Its walls run at 34.9° / 124.9° (the downtown
 * grid), so the catalog bearing is 34.9 and the plan is square to the
 * frame: model +y faces north-east, +x south-east.
 *
 * Identity, in order: the plain cream travertine box, 42 x 58 m and 50
 * storeys, with no setback; the even grid of small punched windows over
 * every face; the tall white broadcast mast at the south-west end of the
 * roof, with its platform part-way up and a red-and-white banded top; the
 * low penthouse along the roof's long axis.
 *
 * Evidence:
 *  - plan: OSM outline way/44821986, read in the turned frame: 42.0 x
 *    58.3 m, square corners. The lidar roof edge lands within 0.7 m of it
 *    (x -20.5..21, y -30.5..29.7), no offset worth correcting.
 *  - heights (lidar, USGS 3DEP TX_Coastal_B1_2018, flown 2018, 0.5 m grid):
 *    the street round the tower is 5.9 m above ground_min (a sunken ramp
 *    sets ground_min). The roof and parapet read 214.5 m above ground_min,
 *    208.6 m above the street, drawn 208.6 m; the penthouse 222 m (216 m
 *    above the street), drawn 216.3 m. Published 217.6 m (CTBUH, 714 ft);
 *    OSM height=218, which matches the penthouse top. 50 storeys.
 *  - penthouse: lidar, x -8..9.5, y -18.5..18 in the turned frame (17.5 x
 *    36.5 m), drawn on the long axis. Its band of dark louvres from
 *    Jujutacular's photo (estimate: 2 m deep band).
 *  - mast: lidar finds it at (0.3, -17.8), at the south-west end of the
 *    penthouse; OSM part way/260365758 (height 304.8 m, 1,000 ft) puts it at
 *    (1.1, -15.3), drawn at the lidar point. A platform ring at 258 m above
 *    the street (lidar 264 m over a ~3 m radius), the top 299 m above the
 *    street in lidar (published / OSM 304.8 m from the plaza; drawn to
 *    300 m). Coolcaesar's 2022 and Zirkel's 2024 photos show it still
 *    there. Pale white below the platform (#dee9ec in Coolcaesar's), the
 *    top third banded aviation orange and white: Coolcaesar's 2022 photo at
 *    full resolution shows the bands clearly (#cc7f6e mixed with sky), as
 *    does Jujutacular's 2020. Bands drawn three orange, bolder than the
 *    real ones, and the mast thickened (2.8 m radius at the foot) so it
 *    reads at phone size.
 *  - facade (round 2, after the lead's review): what reads from a
 *    distance is the travertine piers with glass recessed between them.
 *    About 22 bays across the 42 m faces and 30 across the 58 m faces
 *    (counted on Coolcaesar's and OneShellPlaza.jpg); drawn at half that,
 *    11 and 15 bays, each a pier bevelled from 1.7 m at the glass to 1.0 m
 *    at its face, 0.7 m deep (estimate; Khan's undulating column profile
 *    drawn as that chamfer), 1.4 m square corner piers. One window panel
 *    per bay per three storeys, with a 1.8 m travertine spandrel band
 *    flush with the piers every three storeys (16 groups over the lobby).
 *    The ground floor is a tall glazed lobby behind the columns (Zirkel's
 *    ground-floor photo).
 *  - colours: the travertine samples #f3ebd3 in full sun and #cdc0a9 on the
 *    side in Jujutacular's photo, #c9c2bc in Coolcaesar's; drawn #e6dac0, a
 *    warm cream a step darker than the palette stone. Mast white (trim) and
 *    orange #d9734f.
 *  - night: office windows lit (window); the lobby too.
 *
 * Ground: Houston is flat; elevation 0. Mapterhorn reads the plaza round
 * the tower 2.3 m above the low street corner; the model starts at y = 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - One_Shell_Plaza.jpg, Coolcaesar, 2022, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:One_Shell_Plaza.jpg
 *  - One_Shell_Plaza_(OSP)_at_dusk.jpg, Kenneth C. Zirkel, 2024, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:One_Shell_Plaza_(OSP)_at_dusk.jpg
 *  - Ground_floor_of_One_Shell_Plaza_(OSP).jpg, Kenneth C. Zirkel, CC BY 4.0
 *    https://commons.wikimedia.org/wiki/File:Ground_floor_of_One_Shell_Plaza_(OSP).jpg
 *  - OneShellPlaza.jpg, uploader unnamed, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:OneShellPlaza.jpg
 *  - Houston_from_Sabine_Park_cropped4.jpg, Jujutacular, 2020, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Houston_from_Sabine_Park_cropped4.jpg
 *  - Gulfchasehouston.jpg, Reagan Rothenberger, 2010, CC BY 3.0 (mast)
 *    https://commons.wikimedia.org/wiki/File:Gulfchasehouston.jpg
 * Aerial: USGS NAIP not needed (lidar roof). No look-only sources; no
 * commercial imagery.
 *
 * Doubts: bays at half density; the small antennas on the penthouse
 * roof and the mast's crossarm whips are left out; the plaza and its
 * fountain are the map's.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cap, chamfer, lathe, onWall, panel, rect, save, type XY } from './chi-aon-center'

const stone = new Part(), win = new Part(), roof = new Part(), white = new Part(), red = new Part()

const X0 = -21.0, X1 = 21.0, Y0 = -29.2, Y1 = 29.1
const ROOF = 208.6, LOBBY = 7.5

// The box: corner piers, bevelled travertine piers in front of a recessed
// glass plane, and spandrel bands every three storeys.
const D = 0.7 // the glass plane sits this far behind the pier faces
const C0 = 1.4 // corner piers, square
const WB = 1.7, WF = 1.0 // pier width at the glass and at its face: the bevel
const BAND = 1.8 // spandrel band height
const faces: [XY, XY][] = [[[X0, Y0], [X1, Y0]], [[X1, Y0], [X1, Y1]], [[X1, Y1], [X0, Y1]], [[X0, Y1], [X0, Y0]]]
const BAYS = [11, 15, 11, 15] // half the real 22 / 30 bays a face
const STOREY3 = (ROOF - LOBBY - BAND) / 16 // sixteen three-storey groups over the lobby
const bandsZ = Array.from({ length: 17 }, (_, i) => LOBBY + i * STOREY3) // band bottoms
faces.forEach(([a, b], fi) => {
  const { L, P } = onWall(a, b), n = BAYS[fi], pitch = (L - 2 * C0) / n
  // Glass plane, travertine behind the windows.
  stone.quad(P(C0, 0, -D), P(L - C0, 0, -D), P(L - C0, ROOF, -D), P(C0, ROOF, -D))
  // Corner pier's side face looking into the recess, at both ends.
  stone.quad(P(C0, 0, -D), P(C0, ROOF, -D), P(C0, ROOF, 0), P(C0, 0, 0))
  stone.quad(P(L - C0, 0, 0), P(L - C0, ROOF, 0), P(L - C0, ROOF, -D), P(L - C0, 0, -D))
  // Corner pier fronts.
  stone.quad(P(0, 0, 0), P(C0, 0, 0), P(C0, ROOF, 0), P(0, ROOF, 0))
  stone.quad(P(L - C0, 0, 0), P(L, 0, 0), P(L, ROOF, 0), P(L - C0, ROOF, 0))
  // Intermediate piers: a trapezoid section, chamfered both sides.
  for (let k = 1; k < n; k++) {
    const s = C0 + k * pitch
    stone.quad(P(s - WF / 2, 0, 0), P(s + WF / 2, 0, 0), P(s + WF / 2, ROOF, 0), P(s - WF / 2, ROOF, 0))
    stone.quad(P(s - WB / 2, 0, -D), P(s - WF / 2, 0, 0), P(s - WF / 2, ROOF, 0), P(s - WB / 2, ROOF, -D))
    stone.quad(P(s + WF / 2, 0, 0), P(s + WB / 2, 0, -D), P(s + WB / 2, ROOF, -D), P(s + WF / 2, ROOF, 0))
  }
  // Spandrel bands across the recess, flush with the pier faces.
  for (const z of bandsZ) {
    const z1 = Math.min(z + BAND, ROOF)
    stone.quad(P(C0, z, 0), P(L - C0, z, 0), P(L - C0, z1, 0), P(C0, z1, 0))
    stone.quad(P(C0, z1, 0), P(L - C0, z1, 0), P(L - C0, z1, -D), P(C0, z1, -D))
    stone.quad(P(C0, z, -D), P(L - C0, z, -D), P(L - C0, z, 0), P(C0, z, 0))
  }
  // Glass: one panel per bay per three storeys, and the tall lobby.
  for (let k = 0; k < n; k++) {
    const s0 = C0 + k * pitch + (k === 0 ? 0.25 : WB / 2 + 0.15), s1 = C0 + (k + 1) * pitch - (k === n - 1 ? 0.25 : WB / 2 + 0.15)
    for (let g = 0; g < 16; g++) panel(win, a, b, s0, s1, bandsZ[g] + BAND + 0.3, bandsZ[g + 1] - 0.3, -D + 0.04)
    panel(win, a, b, s0, s1, 0.3, LOBBY - 0.3, -D + 0.04)
  }
})
cap(roof, rect(X0, Y0, X1, Y1), ROOF)

// Penthouse on the long axis, with its dark louvre band.
const PX0 = -8.2, PX1 = 9.3, PY0 = -18.2, PY1 = 18.3, PTOP = 216.3
const ph = chamfer(rect(PX0, PY0, PX1, PY1), 0.4)
block(stone, roof, ph, ROOF - 0.8, PTOP, 0.3)
for (const [a, b] of [[[PX0, PY0], [PX1, PY0]], [[PX1, PY0], [PX1, PY1]], [[PX1, PY1], [PX0, PY1]], [[PX0, PY1], [PX0, PY0]]] as [XY, XY][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  panel(win, a, b, 1.0, L - 1.0, PTOP - 3.2, PTOP - 1.0)
}

// Mast: a pale tube to the platform, then a thinner top banded orange and
// white (Coolcaesar 2022, full resolution).
const MX = 0.3, MY = -17.4, PLAT = 258, TOP = 300
lathe(white, MX, MY, [[2.8, PTOP - 0.2], [2.8, PTOP + 2], [2.2, PTOP + 3], [2.0, PLAT - 1]], 10)
lathe(white, MX, MY, [[2.0, PLAT - 1], [3.8, PLAT - 0.4], [3.8, PLAT + 0.6], [1.4, PLAT + 1.0]], 12)
const bands = [PLAT + 1, 266, 272, 278, 284, 290, TOP - 1.2]
for (let k = 0; k < bands.length - 1; k++) {
  const r0 = 1.4 - 0.5 * k / (bands.length - 1), r1 = 1.4 - 0.5 * (k + 1) / (bands.length - 1)
  lathe(k % 2 ? white : red, MX, MY, [[r0, bands[k]], [r1, bands[k + 1]]], 8)
}
lathe(red, MX, MY, [[0.9, TOP - 1.2], [0.5, TOP - 0.3], [0, TOP]], 8)

const out = [
  { part: stone, material: finish('shell-travertine', 0xe6dac0) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: white, material: PALETTE.trim },
  { part: red, material: finish('shell-mast-orange', 0xd9734f) },
]
if (import.meta.main) await save('hou-one-shell-plaza', 'One Shell Plaza', [29.759151, -95.367664], 34.9, out)
