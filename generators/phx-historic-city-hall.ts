/**
 * Historic City Hall and County Courthouse (the Maricopa County Courthouse
 * and Old Phoenix City Hall, 1928–29, Edward Neild with Lescher & Mahoney;
 * Spanish Colonial Revival with Art Deco detail) — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-historic-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * anchor. Bearing 0: the OSM walls run north–south and east–west. Anchor
 * -112.0757719, 33.4477435, the centroid of OSM way/37057860 ("Historic
 * City Hall", 125 W Washington Street, wikidata Q18154104). Its building
 * parts way/209950205, way/209950206 and way/209950211 lie inside it and
 * are drawn by this model.
 *
 * Identity (from the photos below):
 *  1. A tall central block of warm pink-tan stone under a red tile hip
 *     roof, a row of round-arched windows high up and stubby piers rising
 *     through the cornice like battlements.           (rear, both, habs)
 *  2. Two lower four-storey wings, east (the county courthouse) and west
 *     (the old city hall), standing forward of the centre on both fronts,
 *     joined to it by low links.                          (rear, tony, habs)
 *  3. Windows grouped in tall vertical bays between flat stone piers, the
 *     wings' top storey round-arched on the ends.        (both, tony, rear)
 *  4. The arched entrance on Washington Street, in a low front block
 *     between the wings.                                       (habs, v1)
 *
 * Plan: OSM way/37057860, simplified to its main rectangles: the wings
 * x -32.6..-17.9 and 21.1..36.5, y -20.1..20.8; the centre x -16..20,
 * y -10..10; the front link to y 15.8 and its entrance block to y 17; the
 * rear link; the low one-storey annexe south of the west wing (y -28.5..-20)
 * and the stair bay on the west face.
 *
 * Heights: USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (2020 flight), 0.5 m
 * grid; ground 0.8 m above ground_min 330.64 is y = 0. Measured (model
 * metres): wing roofs 19.3, their parapets 20.6, a raised flat roof over
 * the west wing 22.1; the centre's parapet 31.8, its piers' tops and the
 * corner steps (24), the tile hip roof from 31.6, its ridge at 36.3 (lidar); the
 * links 8.6; the entrance block 11.3; the annexe 4; the stair bay 10.
 * Estimated from rear and both scaled to the lidar: the storeys (a 4.4 m
 * ground storey, 3.8 m above), the bay widths, the arched storey heights.
 *
 * Photos (evidence, Wikimedia Commons):
 *  rear  "Maricopa County Courthouse October 6 2013 Phoenix Arizona
 *        2816x2112 Rear.JPG", Zeb Micelli, CC0: the south front
 *        https://commons.wikimedia.org/wiki/File:Maricopa_County_Courthouse_October_6_2013_Phoenix_Arizona_2816x2112_Rear.JPG
 *  both  "Maricopa County Courthouse and Old City Hall.jpg", Visitor7,
 *        CC BY-SA 3.0: the centre and west wing, colour
 *        https://commons.wikimedia.org/wiki/File:Maricopa_County_Courthouse_and_Old_City_Hall.jpg
 *  tony  "Maricopa County Courthouse.jpg", Tony the Marine, CC BY-SA 3.0:
 *        from the south-east corner at Jefferson
 *        https://commons.wikimedia.org/wiki/File:Maricopa_County_Courthouse.jpg
 *  v1    "Maricopa County Courthouse-1.jpg", Visitor7, CC BY-SA 3.0: the
 *        Washington Street entrance
 *        https://commons.wikimedia.org/wiki/File:Maricopa_County_Courthouse-1.jpg
 *  habs  HABS AZ-71-1, "City Hall elevation - County-City Administration
 *        Building, Washington Street, Phoenix", public domain (Library of
 *        Congress via Commons): the north front with the lawn
 *        https://commons.wikimedia.org/wiki/File:City_Hall_elevation_-_County-City_Administration_Building,_Washington_Street,_Phoenix,_Maricopa_County,_AZ_HABS_ARIZ,7-PHEN,11-1.tif
 * No look-only sources. No commercial imagery.
 *
 * Name: OSM says "Historic City Hall"; the building holds both the old
 * city hall and the county courthouse, so the display name is the
 * assignment's "Historic City Hall and County Courthouse".
 *
 * Doubts: the terracotta ornament, the entrance's carved surround and the
 * scrolled parapet details are left out. The west face is seen in no
 * photo. The raised roof over the west wing is drawn flat.
 *
 * Night: the windows glow; the lower stone is lightly floodlit.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, box, cornice, hipRoof, onWall, prism, rectShape, save, split, type XY } from './atl-tech-tower'
import { edges, wallLen } from './phx-st-marys-basilica'

const stone = new Part(), trim = new Part(), tile = new Part(), win = new Part(), door = new Part(), roof = new Part()

/** A box's outer faces as a counter-clockwise ring. */
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

/** Tall window bays: per bay one panel per group of storeys, the top storey arched if asked. */
function bays(a: XY, b: XY, o: { bay: number; margin: number; z0: number; groups: Array<[number, number]>; arch?: [number, number]; w?: number }) {
  const L = wallLen(a, b), use = L - 2 * o.margin
  if (use < 1.2) return
  const n = Math.max(1, Math.round(use / o.bay)), step = use / n, w = o.w ?? Math.min(1.9, step * 0.55)
  for (let k = 0; k < n; k++) {
    const s = o.margin + (k + 0.5) * step
    for (const [za, zb] of o.groups) onWall(win, a, b, rectShape(s - w / 2, s + w / 2, za, zb))
    if (o.arch) onWall(win, a, b, archShape(s, w, o.arch[0], o.arch[1], 8))
  }
}

// ── The two wings ──
for (const [x0, x1] of [[-32.6, -17.9], [21.1, 36.5]]) {
  const R = rect(x0, x1, -20.1, 20.8)
  box(stone, x0, x1, -20.1, 20.8, 0, 19.3, roof, 0)
  cornice(trim, R, 18.2, 0.8, 0.35, null)
  // the parapet round the roof
  box(stone, x0, x1, -20.1, -19.6, 19.3, 20.6, trim, 0.1)
  box(stone, x0, x1, 20.3, 20.8, 19.3, 20.6, trim, 0.1)
  box(stone, x0, x0 + 0.5, -19.6, 20.3, 19.3, 20.6, trim, 0.1)
  box(stone, x1 - 0.5, x1, -19.6, 20.3, 19.3, 20.6, trim, 0.1)
  box(trim, x0 - 0.15, x1 + 0.15, -20.25, 20.95, 4.0, 4.4, trim, 0.05) // the base's string course
  edges(R, (a, b) => {
    const end = Math.abs(a[1] - b[1]) < 0.1 // the north and south ends
    bays(a, b, {
      bay: end ? 3.0 : 3.4, margin: 1.2, z0: 0,
      groups: [[1.3, 3.4], [5.2, 9.9], [11.0, 13.8]],
      arch: end ? [14.9, 16.7] : undefined,
    })
    if (!end) bays(a, b, { bay: 3.4, margin: 1.2, z0: 0, groups: [[14.9, 17.3]] })
  })
}
// the raised flat roof over the west wing, the stair bay on its west face
box(stone, -30.5, -20, -10, 14, 19.3, 21.9, roof, 0.2)
box(stone, -35.9, -32.6, -3.8, 3.2, 0, 10, stone, 0.25)
onWall(win, [-35.9, 3.2], [-35.9, -3.8], rectShape(2.4, 4.6, 2, 8.6))
// the one-storey annexe behind the west wing
box(stone, -32.1, -17.8, -28.5, -20.1, 0, 4, stone, 0.2)

// ── The links and the entrance block ──
box(stone, -17.9, 21.1, 10, 15.8, 0, 8.6, roof, 0.25)
box(stone, -17.9, 21.1, -11.5, -10, 0, 8.6, roof, 0.25)
box(stone, -3.5, 6.3, 15.8, 17, 0, 11.3, trim, 0.3)
cornice(trim, rect(-3.5, 6.3, 15.8, 17), 10.2, 0.6, 0.3, null)
// the arched entrance with its pale surround, windows either side
onWall(trim, [6.3, 17], [-3.5, 17], archShape(4.9, 3.6, 0, 4.6, 10), 0.03)
onWall(door, [6.3, 17], [-3.5, 17], archShape(4.9, 2.6, 0, 4.4, 10), 0.07)
onWall(win, [6.3, 17], [-3.5, 17], rectShape(2.6, 7.2, 7.4, 9.6))
for (const [a, b] of [[[21.1, 15.8], [6.3, 15.8]], [[-3.5, 15.8], [-17.9, 15.8]]] as Array<[XY, XY]>)
  bays(a, b, { bay: 3.2, margin: 0.8, z0: 0, groups: [[1.3, 3.4], [4.8, 7.6]] })

// windows on the links' outer faces
bays([-17.9, -11.5], [21.1, -11.5], { bay: 3.2, margin: 0.8, z0: 0, groups: [[1.3, 3.4], [4.8, 7.6]] })
// a plinth course round every block, standing a little proud (the photos' darker base)
for (const [x0, x1, y0, y1] of [[-32.6, -17.9, -20.1, 20.8], [21.1, 36.5, -20.1, 20.8], [-17.9, 21.1, 10, 15.8], [-17.9, 21.1, -11.5, -10], [-3.5, 6.3, 15.8, 17], [-35.9, -32.6, -3.8, 3.2], [-32.1, -17.8, -28.5, -20.1]])
  prism(stone, split(rect(x0 - 0.12, x1 + 0.12, y0 - 0.12, y1 + 0.12), 3), 0, 1.1, stone, 0) // split, so its foot has vertices all along

// ── The centre block ──
const CX0 = -16, CX1 = 20, CY0 = -10, CY1 = 10
const C = rect(CX0, CX1, CY0, CY1)
box(stone, CX0, CX1, CY0, CY1, 0, 30.6, stone, 0)
cornice(trim, C, 29.6, 1.0, 0.45, null)
box(stone, CX0 + 0.3, CX1 - 0.3, CY0 + 0.3, CY1 - 0.3, 30.6, 31.8, stone, 0.15)
// the piers standing through the cornice like battlements
edges(C, (a, b) => {
  const L = wallLen(a, b), n = Math.round(L / 3.3)
  for (let k = 0; k <= n; k++) {
    const s = (k / n) * L
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: XY = [t[1], -t[0]]
    const px = a[0] + t[0] * s - nn[0] * 0.2, py = a[1] + t[1] * s - nn[1] * 0.2
    box(trim, px - 0.45, px + 0.45, py - 0.45, py + 0.45, 29.6, 33.0, trim, 0.15)
  }
  // windows: the grouped bays, the arched storey, the attic storey
  bays(a, b, { bay: 3.3, margin: 1.4, z0: 0, groups: [[1.3, 3.6], [4.9, 8.4], [9.6, 13.9], [15.2, 19.5]], arch: [20.6, 23.4], w: 1.7 })
  bays(a, b, { bay: 3.3, margin: 1.4, z0: 0, groups: [[25.6, 28.2]], w: 1.5 })
})
// the red tile hip roof
hipRoof(tile, CX0 + 1.2, CX1 - 1.2, CY0 + 1.2, CY1 - 1.2, 31.6, 36.3, 0.1)

await save('phx-historic-city-hall', 'Historic City Hall and County Courthouse', [
  { part: stone, material: { ...finish('courthouse-stone', 0xe2c3a6), floodlight: (p, n) => (n[2] < 0.5 && p[2] < 9 ? 0.4 : 0) } },
  { part: trim, material: finish('courthouse-trim', 0xf2dfca) },
  { part: tile, material: PALETTE.terracotta },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('courthouse-door', 0x4f5b4c) },
  { part: roof, material: PALETTE.roof },
], { height: 36.3, anchor: [33.4477435, -112.0757719], bearing: 0 })
