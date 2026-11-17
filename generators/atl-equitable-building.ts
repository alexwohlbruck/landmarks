/**
 * Equitable Building (100 Peachtree), Atlanta (1968, Skidmore, Owings &
 * Merrill, Bruce Graham) — original procedural geometry, CC0-1.0.
 * bun generators/atl-equitable-building.ts
 *
 * Uses the B4 kit exported from generators/atl-flatiron-building.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing (49.5°: OSM's long sides run at 49.5° / 229.5°). Anchor =
 * centroid of OSM way/1389861153 ("Equitable Building", height 138, 35
 * levels), 33.756863, -84.388606. In the frame the outline is a 34.8 m ×
 * 51.1 m rectangle, the long sides along y.
 *
 * Identity: a plain 35-storey box over Five Points, sheathed in a dark
 * bronze-brown steel frame: columns at every bay, a spandrel at every floor,
 * reflective grey glass between. The frame runs straight down to the
 * street, where the glazing of the two-storey lobby is set back behind
 * the columns. The top two storeys are a solid louvred band of the same
 * bronze, carrying the EQUITABLE letters.
 *
 * Evidence:
 *  - plan: OSM way/1389861153. The 2018 lidar footprint matches it within
 *    about a metre (the lidar has few returns off the dark glass).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid, above ground_min 321.64 m; the streets round the building are
 *    1.2–2 m above that. Measured: roof 138.2–138.4 m (138 used from the
 *    street; published 138 m, 35 floors — Wikipedia, Emporis via OSM).
 *    A mechanical well in the roof (126–137 m) is not modelled.
 *  - bays: eight on the long faces and six on the short ones, counted on
 *    Merlin's panorama; the lobby (two storeys, about 8 m) and the top
 *    louvred band (about 7 m) are scaled from it.
 *  - ground: Mapterhorn rises about 1.4 m across 60 m; elevation 0.
 *  - colour: the frame is dark bronze-brown in every daylight photo; it is
 *    drawn as a bronze a touch lighter than STYLE's charcoal floor, so the
 *    building still reads as the dark one. The glass reads grey-blue.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Vertical panorama of the Equitable Building viewed from Woodruff Park
 *    in Atlanta, October 2015.jpg, Marc Merlin, CC BY-SA 4.0 (from the
 *    east: both faces, the base and the top band)
 *    https://commons.wikimedia.org/wiki/File:Vertical_panorama_of_the_Equitable_Building_viewed_from_Woodruff_Park_in_Atlanta,_October_2015.jpg
 *  - Equitable-building-atlanta-angle.jpg, Connor.carey, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Equitable-building-atlanta-angle.jpg
 *  - EquitableAtlanta.jpg, Tom Caiafa, CC BY 2.5
 *    https://commons.wikimedia.org/wiki/File:EquitableAtlanta.jpg
 *  - Equitable Building 12313.JPG, Michael Rivera, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:Equitable_Building_12313.JPG
 *  - Atlanta’s Flatiron Building viewed from Woodruff Park.jpg, Marc Merlin,
 *    CC BY-SA 4.0 (the top band and letters behind the Flatiron)
 *    https://commons.wikimedia.org/wiki/File:Atlanta%E2%80%99s_Flatiron_Building_viewed_from_Woodruff_Park.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the per-floor spandrels are grouped three storeys to a panel
 * (STYLE's rule), so the real fine horizontal banding is calmer here; the
 * EQUITABLE letters are left out (not a famous sign); the roof well is
 * left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, edgePanels, save, type XY } from './atl-flatiron-building'

const frame = new Part(), glass = new Part(), lobby = new Part(), roof = new Part()

const HX = 17.4, HY = 25.55 // half-sizes of the outline in the frame
const LOBBY = 8, BAND = 131, TOP = 138
const SET = 1.6 // how far the lobby glazing sits behind the columns
const NX = 6, NY = 8 // bays on the short (x) and long (y) faces
const COL = 1.3 // column width

// ── The lobby: glazing set back behind the columns. ──
box(lobby, -HX + SET, HX - SET, -HY + SET, HY - SET, 0, LOBBY, null, 0)
// The columns down to the street, one at every bay line round the box.
const cols: XY[] = []
for (let i = 0; i <= NX; i++) for (const y of [-HY, HY]) cols.push([-HX + (2 * HX * i) / NX, y])
for (let j = 1; j < NY; j++) for (const x of [-HX, HX]) cols.push([x, -HY + (2 * HY * j) / NY])
for (const [x, y] of cols) {
  const x0 = Math.max(-HX, x - COL / 2), x1 = Math.min(HX, x + COL / 2)
  const y0 = Math.max(-HY, y - COL / 2), y1 = Math.min(HY, y + COL / 2)
  // Each column runs back to the glazing line.
  const ax0 = x <= -HX + 0.01 ? -HX : x >= HX - 0.01 ? HX - SET : x0
  const ax1 = x <= -HX + 0.01 ? -HX + SET : x >= HX - 0.01 ? HX : x1
  const ay0 = y <= -HY + 0.01 ? -HY : y >= HY - 0.01 ? HY - SET : y0
  const ay1 = y <= -HY + 0.01 ? -HY + SET : y >= HY - 0.01 ? HY : y1
  box(frame, Math.min(ax0, x0), Math.max(ax1, x1), Math.min(ay0, y0), Math.max(ay1, y1), 0, LOBBY, null, 0)
}

// ── The shaft: one bronze box over the lobby, its soffit closed. ──
box(frame, -HX, HX, -HY, HY, LOBBY, TOP, roof, 0.5, true)

// Glass between the columns, grouped three storeys to a panel (35 storeys
// at about 3.9 m), from the lobby to the louvred top band.
const opts = { group: 11.7, gap: 2.4, pier: COL, margin: COL / 2, out: 0.06, min: 1 }
const faces: [XY, XY, number][] = [
  [[-HX, -HY], [HX, -HY], NX], [[HX, -HY], [HX, HY], NY],
  [[HX, HY], [-HX, HY], NX], [[-HX, HY], [-HX, -HY], NY],
]
for (const [a, b, n] of faces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  edgePanels(glass, a, b, LOBBY + 0.9, BAND, { ...opts, bay: (L - COL) / n })
}

// The roof: a plain bronze parapet ring round the flat roof.
const P = 0.8
box(frame, -HX, HX, -HY, -HY + P, TOP, TOP + 0.9, frame, 0.3)
box(frame, -HX, HX, HY - P, HY, TOP, TOP + 0.9, frame, 0.3)
box(frame, -HX, -HX + P, -HY + P, HY - P, TOP, TOP + 0.9, frame, 0.3)
box(frame, HX - P, HX, -HY + P, HY - P, TOP, TOP + 0.9, frame, 0.3)
void (null as unknown as V3)

await save('atl-equitable-building', 'Equitable Building', [
  { part: frame, material: finish('equitable-bronze', 0x5f534a) },
  { part: glass, material: { ...PALETTE.window, color: 0x67747e } },
  { part: lobby, material: { ...PALETTE.window, name: 'entrance', color: 0x6d7f8c } },
  { part: roof, material: PALETTE.roof },
], { height: TOP + 0.9, anchor: [33.756863, -84.388606], bearing: 49.5 })
