/**
 * Museum of the American Revolution (2017, Robert A.M. Stern Architects),
 * 101 South 3rd Street at Chestnut, Old City, Philadelphia — original
 * procedural geometry, CC0-1.0.
 * bun generators/phl-museum-american-revolution.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/705309586 (named
 * "American Revolution Center", the museum's corporate name; museum node
 * node/4150740083 inside it), 39.948174,-75.145657. Its walls run at
 * 10.3° / 100.3°, so the catalog bearing is 10.3 and the building is square
 * to this frame: +y is Chestnut Street (north), -x 3rd Street (west).
 *
 * Identity, in order: the tall red-brick entrance block facing the corner
 * plaza at 3rd and Chestnut, its west front carrying the great round-headed
 * arch with a white limestone tympanum, the bronze domed entrance vestibule
 * standing in front of it, the limestone entablature with the museum's name
 * and, over it, the open three-bay limestone loggia at the top of the
 * block; the lower brick wings along 3rd Street and round the back, with
 * limestone string courses and cornices and round-headed windows; the
 * Declaration of Independence panel on the wing facing the plaza; the
 * limestone-framed glazed penthouse over the 3rd Street wing.
 *
 * Note: the brief mentioned "a copper-roofed cupola/lantern over the
 * corner". None of the licensed photos (2017-2024) shows one: the copper
 * (bronze) element at the corner is the domed entrance vestibule, which
 * is what is modelled. The open loggia is the crown of the corner block.
 *
 * Evidence:
 *  - plan: the OSM outline, exactly rectilinear at 10.3°: 55 × 60 m with
 *    the plaza cut out of its north-west corner (13 × 18.6 m), a 2.3 m step
 *    on the plaza side, and a 9 × 13 m annex at the south-east corner.
 *    USGS NAIP (public domain) for the parts: the tall block along
 *    Chestnut (x -16.7..11.9, y 19..33.5; its loggia shows as three dark
 *    openings on the plaza front), the 3rd Street wing (x -29.9..-16.7), the
 *    green roofs and a raised white roof over the rest.
 *  - heights: the building is newer than the only lidar
 *    (USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 shows the old visitor
 *    center site), so every height is estimated by photo scaling, with the
 *    bronze vestibule taken as 7.5 m tall and 5.5 m wide (people beside it
 *    in GordonMakryllos' photos): entrance block cornice 22.0 m, name
 *    entablature 14.0-16.0, arch springing 8.4 m and tympanum ~4.8 m wide,
 *    loggia 16-22 m with three 2.3 m openings (ajay_suresh's and Kreuz und
 *    quer's frontal photos); 3rd Street wing 16.5 m at the plaza end and
 *    14.0 m beyond, penthouse to 20 m; the back wings 14 m (estimated,
 *    unphotographed); string course 5.2-5.6 m.
 *  - colours, from the daylight photos: the deep red Flemish-bond brick
 *    pulled to the palette's lightness; the pale limestone (trim); the dark
 *    bronze of the vestibule pulled light; the green roofs (NAIP) as a
 *    muted garden finish in three beds where NAIP shows them; flat roofs
 *    palette roof.
 *  - the map's terrain under the footprint still shows the 2015 excavation
 *    (0-2 m against 5-7 m on the streets round it); the map fills it from
 *    the street outside, and the model stands on the street.
 *  - night: windows and the vestibule glazing glow (window); no
 *    floodlighting is modelled.
 *
 * Photos (Wikimedia Commons): Museum_of_the_American_Revolution_(53590618560)
 * .jpg (ajay_suresh, CC BY 2.0); Museum_of_the_American_Revolution,
 * _Philadelphia_PA,_2022.jpg, _2022_2.jpg and _2022_3.jpg (Kreuz und quer,
 * CC0); Museum_of_the_American_Revolution_-_Joy_of_Museums_2.jpg and _3.jpg
 * (GordonMakryllos, CC BY-SA 4.0); Museum_of_the_American_Revolution_by_
 * Joy_of_Museums.jpg (Joyofmuseums, CC BY-SA 4.0); Museum_of_the_American_
 * Revolution.jpg (Frances 84 28, CC BY-SA 4.0). USGS NAIP. No commercial
 * imagery.
 *
 * Not the museum's: the white octagonal cupola with a small dome seen just
 * over the corner block's parapet in GordonMakryllos' Chestnut Street
 * photo (and the brick tower behind it in ajay_suresh's) is the lantern of
 * the United States Custom House (1934; OSM way/332786626, parts to 63.5
 * m), 200 Chestnut Street, about 75 m east across the alley, in line
 * behind the corner block from the plaza. NAIP shows the museum's roofs
 * flat with no dome or drum.
 *
 * Left out: the lettering, the stars in the tympanum, the bronze relief
 * and the second, small vestibule on Chestnut Street, banners, the cannon
 * and the plaza (the map's), rooftop plant.
 *
 * Doubts: all heights are photo estimates (no lidar since the building
 * went up). Only the plaza sides (the entrance front, the plaza face of
 * the 3rd Street wing and the near ends of the 3rd Street and Chestnut
 * fronts) are photographed; the window rhythm of the rest of 3rd Street,
 * the Chestnut front past the corner, the east and south sides and the
 * annex is carried round from the photographed bays and is invented in
 * detail. The partition of the roof into volumes is read from NAIP.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, save, walls, rect, inset, lathe, type XY } from './chi-aon-center'
import { archOn, rectOn, bbox, cube } from './phl-independence-hall'

type Seg = [XY, XY]
const edges = (r: XY[]): Seg[] => r.map((a, i) => [a, r[(i + 1) % r.length]] as Seg)
const segLen = ([a, b]: Seg) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** A projecting band round a ring: outer walls, top and bottom lips. */
function band(p: Part, ring: XY[], z0: number, z1: number, out = 0.12) {
  const o = inset(ring, -out)
  walls(p, o, z0, z1)
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length
    p.quad([ring[i][0], ring[i][1], z1], [o[i][0], o[i][1], z1], [o[j][0], o[j][1], z1], [ring[j][0], ring[j][1], z1])
    p.quad([ring[i][0], ring[i][1], z0], [ring[j][0], ring[j][1], z0], [o[j][0], o[j][1], z0], [o[i][0], o[i][1], z0])
  }
}

function build() {
  const brick = new Part(), trim = new Part(), roof = new Part(), win = new Part(), bronze = new Part(), garden = new Part()

  // ------------------------------------------------------------ volumes
  const T = rect(-16.67, 19, 11.94, 33.5) // tall entrance block on Chestnut
  const TH = 21.5
  const WN: XY[] = [[-29.95, 0], [-16.67, 0], [-16.67, 14.93], [-24.34, 14.93], [-24.34, 12.65], [-29.95, 12.65]]
  const WS = rect(-29.95, -26.0, -16.67, 0)
  const E: XY[] = [[-16.67, -26.3], [16.1, -26.6], [25.25, -26.6], [25.28, 29.38], [11.94, 29.38], [11.94, 19], [-16.67, 19]]
  const AX = rect(16.04, -40.02, 25.24, -26.6)
  const WNH = 14.0, WSH = 13.0, EH = 13.0, AXH = 9.0

  // The tall block: solid to the loggia floor, then notched for the loggia.
  const LY0 = 20.75, LY1 = 31.25, LX = -13.67, LZ = 13.6
  walls(brick, T, 0, LZ)
  const Tn: XY[] = [[-16.67, 19], [11.94, 19], [11.94, 33.5], [-16.67, 33.5], [-16.67, LY1], [LX, LY1], [LX, LY0], [-16.67, LY0]]
  walls(brick, Tn, LZ, TH)
  cap(roof, inset(Tn, 0.0), TH)
  cap(roof, rect(-16.67, LY0, LX, LY1), LZ)
  band(trim, T, TH - 0.7, TH, 0.3)
  band(trim, T, 5.2, 5.6, 0.08)
  band(trim, T, 0, 0.6, 0.06)

  for (const [r, h] of [[WN, WNH], [WS, WSH], [E, EH], [AX, AXH]] as [XY[], number][]) {
    walls(brick, r, 0, h)
    band(trim, r, h - 0.6, h, 0.25)
    band(trim, r, 5.2, Math.min(5.6, h), 0.08)
    band(trim, r, 0, 0.6, 0.06)
  }
  cap(roof, WN, WNH)
  cap(roof, WS, WSH)
  // The back wings' roof: membrane with three planted beds (NAIP).
  cap(roof, E, EH)
  for (const g of [rect(1, -12, 17, 16), rect(-15, -24, 1, -4), rect(13, 19.5, 24, 27.5)]) cap(garden, g, EH + 0.05)
  cap(roof, AX, AXH)
  // The raised white roof in the middle of the back wings (NAIP).
  bbox(brick, roof, -11, -1, -2, 13, EH, 16.0, 0.2)
  band(trim, rect(-11, -1, -2, 13), 15.5, 16.0, 0.15)

  // The penthouse over the plaza end of the 3rd Street wing: limestone
  // frame, a band of big windows.
  const PH = rect(-27.6, 1.0, -17.4, 13.6)
  bbox(trim, roof, -27.6, 1.0, -17.4, 13.6, WNH, 17.4, 0.25)
  for (const s of edges(PH)) {
    const L = segLen(s), n = Math.max(1, Math.round(L / 2.6)), w = L / n
    for (let k = 0; k < n; k++) rectOn(win, s[0], s[1], (k + 0.5) * w, w / 2 - 0.4, 14.4, 16.7, 0.05)
  }

  // ----------------------------------------------------- entrance front
  // The pavilion on the plaza (west) front of the tall block.
  cube(brick, -17.17, LY0, -16.67, LY1, 0, 11.6, false)
  // The name entablature.
  bbox(trim, trim, -17.6, LY0 - 0.4, -16.67, LY1 + 0.4, 11.6, 13.6, 0.15)
  // The loggia: four limestone piers under the cornice, the recess behind.
  const piers: [number, number][] = [[LY0, LY0 + 1.0], [LY0 + 3.3, LY0 + 4.1], [LY1 - 4.1, LY1 - 3.3], [LY1 - 1.0, LY1]]
  for (const [a, b] of piers) cube(trim, -17.17, a, -16.37, b, LZ, TH - 0.7, false)
  // Windows on the loggia's back wall, seen through the openings.
  for (const c of [LY0 + 2.15, (LY0 + LY1) / 2, LY1 - 2.15]) rectOn(win, [LX, LY1], [LX, LY0], LY1 - c, 0.85, 14.2, 20.2, 0.05)

  // The great arch: limestone tympanum and surround, imposts, keystone.
  const pa: XY = [-17.17, LY1], pb: XY = [-17.17, LY0], C = (LY1 - LY0) / 2
  archOn(trim, pa, pb, C, 2.3, 0.3, 8.1, 0.05, 12)
  rectOn(trim, pa, pb, C - 2.65, 0.5, 7.85, 8.35, 0.1)
  rectOn(trim, pa, pb, C + 2.65, 0.5, 7.85, 8.35, 0.1)
  rectOn(trim, pa, pb, C, 0.35, 10.2, 11.6, 0.1)

  // The bronze vestibule: half an octagon on the face, glazed, under a
  // ribbed dome.
  {
    const cx = -17.17, cy = (LY0 + LY1) / 2, R = 2.75
    const oct: XY[] = []
    for (let k = 0; k <= 4; k++) {
      const a = Math.PI / 2 + (k * Math.PI) / 4
      oct.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
    }
    const ring = [...oct].reverse() // counter-clockwise from above
    walls(bronze, ring, 0, 4.7)
    for (let k = 0; k < 4; k++) {
      const a = ring[k], b = ring[k + 1], L = segLen([a, b])
      rectOn(win, a, b, L / 2, L / 2 - 0.3, 0.1, 4.1, 0.04)
    }
    const big: XY[] = []
    for (let k = 0; k <= 4; k++) {
      const a = Math.PI / 2 + (k * Math.PI) / 4
      big.push([cx + (R + 0.3) * Math.cos(a), cy + (R + 0.3) * Math.sin(a)])
    }
    walls(bronze, [...big].reverse(), 4.7, 5.3)
    cap(bronze, [...big].reverse(), 4.7, false)
    lathe(bronze, cx, cy, [[R + 0.3, 5.3], [R + 0.05, 5.35], [R - 0.1, 6.2], [R - 0.6, 6.95], [R - 1.4, 7.4], [0, 7.6]], 16)
  }

  // Templeton Education Center door, in the corner south of the pavilion.
  rectOn(trim, [-16.67, 19], [-16.67, 14.93], 2.0, 1.35, 0.3, 4.8, 0.05)
  rectOn(win, [-16.67, 19], [-16.67, 14.93], 2.0, 0.95, 0.4, 4.3, 0.09)
  // The Declaration of Independence panel on the plaza face of the wing.
  rectOn(trim, [-16.67, 14.93], [-24.34, 14.93], 3.85, 2.5, 6.2, 12.6, 0.05)

  // ------------------------------------------------- window bays
  // A wing bay: a framed opening on the ground floor, a round-headed
  // window over the string course.
  const wingBay = (a: XY, b: XY, s: number, low = false) => {
    rectOn(trim, a, b, s, 1.45, 0.6, 4.8, 0.04)
    rectOn(win, a, b, s, 1.15, 0.7, 4.6, 0.08)
    if (low) return
    archOn(trim, a, b, s, 1.45, 5.75, 8.3, 0.04, 10)
    archOn(win, a, b, s, 1.15, 5.95, 8.3, 0.08, 10)
  }
  const wingFace = (a: XY, b: XY, pitch = 5.5, end = 2.5, low = false) => {
    const L = segLen([a, b]), n = Math.max(1, Math.floor((L - 2 * end) / pitch) + 1)
    const span = (n - 1) * pitch, s0 = (L - span) / 2
    for (let k = 0; k < n; k++) wingBay(a, b, s0 + k * pitch, low)
  }
  // 3rd Street (west) front, the whole wing.
  wingFace([-29.95, 12.65], [-29.95, -26.0], 5.4)
  // Back and sides of the wings.
  wingFace([-29.95, -26.0], [-16.67, -26.0])
  wingFace([-16.67, -26.3], [16.1, -26.6])
  wingFace([25.25, -26.6], [25.28, 29.38], 5.6)
  wingFace([25.28, 29.38], [11.94, 29.38])
  wingFace([16.04, -40.02], [25.24, -40.02], 5.5, 2.5, true)
  wingFace([25.24, -40.02], [25.24, -26.6], 5.5, 2.5, true)
  wingFace([16.04, -26.6], [16.04, -40.02], 5.5, 2.5, true)

  // The tall block's upper storeys: tall limestone-framed windows in
  // pairs of storeys above the wings' roofs; on Chestnut the full front.
  const tallBay = (a: XY, b: XY, s: number, z0 = 13.8) => {
    rectOn(trim, a, b, s, 1.05, z0 - 0.3, 20.2, 0.04)
    rectOn(win, a, b, s, 0.8, z0, 19.9, 0.08)
  }
  {
    const a: XY = [11.94, 33.5], b: XY = [-16.67, 33.5], L = segLen([a, b])
    for (let k = 0; k < 6; k++) {
      const s = 2.6 + (k * (L - 5.2)) / 5
      tallBay(a, b, s, 11.0)
      rectOn(trim, a, b, s, 1.25, 0.6, 4.8, 0.04)
      rectOn(win, a, b, s, 1.0, 0.7, 4.6, 0.08)
    }
  }
  {
    const a: XY = [-16.67, 19], b: XY = [11.94, 19], L = segLen([a, b])
    for (let k = 0; k < 6; k++) tallBay(a, b, 2.6 + (k * (L - 5.2)) / 5)
    const e0: XY = [11.94, 19], e1: XY = [11.94, 33.5]
    for (const s of [3.6, 10.9]) tallBay(e0, e1, s)
  }
  // The pavilion's flanks, a slim window each side of the arch above the
  // string course (Kreuz und quer's photo).
  for (const y of [19.85, 32.4]) rectOn(win, [-16.67, y + 0.6], [-16.67, y - 0.6], 0.6, 0.35, 6.2, 11.0, 0.06)

  return [
    { part: brick, material: finish('moar-brick', 0xa4523f) },
    { part: trim, material: PALETTE.trim },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: bronze, material: finish('moar-bronze', 0x7e6a56) },
    { part: garden, material: finish('moar-green-roof', 0x8e9c78) },
  ]
}

if (import.meta.main) await save('phl-museum-american-revolution', 'Museum of the American Revolution', [39.948174, -75.145657], 10.3, build())
