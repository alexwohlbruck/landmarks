/**
 * San Ysidro Land Port of Entry, PedWest — the West Pedestrian Inspection
 * Building (opened 2016) at the Virginia Avenue transit centre, the second
 * pedestrian crossing into the US from Tijuana's El Chaparral.
 *
 * Identity: a tall inspection hall whose upper storey is a band of glazing
 * all round under a thin, wide roof slab that overhangs like a canopy (pale
 * fascia, its underside in shadow); in front, toward the transit plaza, a
 * low brown masonry wing with the "San Ysidro Land Port of Entry / West
 * Pedestrian Facility" lettering (left off: not a famous sign).
 *
 * Frame: bearing 354.3 (the building is squared about 6° west of north).
 * Map frame x east, y north, z up, turned to that bearing; metres; origin at
 * the anchor (−117.03604, 32.5423361), the centroid of OSM way/438083299;
 * y = 0 the ground.
 *
 * Sources
 * - OSM way/438083299 (building=government, "West Pedestrian Inspection
 *   Building", CBP) © OSM contributors: the hall (37.7 × 53.7 m) and the
 *   north wing (27 × 22 m), no heights.
 * - USGS NAIP orthophoto: plan, white membrane roofs, a raised strip of roof
 *   plant down the hall's middle, the shadow on the west (about 12 m wide).
 * - USGS lidar CA_SanDiegoQL2_2014 predates the building (2016): not used.
 * Photos (evidence)
 * - "PedWest US.jpg", Keizers, 2017, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:PedWest_US.jpg — from the
 *   plaza and bus bays to the north, looking south, evening (the "Outlets
 *   entrance" arrow points right, to the west): the brown wing's north face
 *   with its lettering, and to the right, set back, the taller hall: grey
 *   lower walls with glass doors, the glazed upper band and the overhanging
 *   roof slab with its pale fascia.
 * - "FPS traffic stop PedWest 2018-10-16.jpg", Balintawak, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:FPS_traffic_stop_PedWest_2018-10-16.jpg
 *   — the slab's edge over the bus bays (a corner only).
 * - CBP Photography, "PPE at the San Ysidro Port of Entry, PED WEST" (2020,
 *   public domain), https://commons.wikimedia.org/wiki/File:PPE_at_the_San_Ysidro_Port_of_Entry,_PED_WEST.jpg
 *   — the hall inside: a tall daylit space (confirms the clerestory).
 *
 * Numbers (no lidar and no published heights: all estimated)
 * - Brown wing 6.0 m: about two door heights in Keizers' photo.
 * - Hall: grey walls to 7.4 m, glazing 7.4–11.0 m, roof slab 11.0–11.8 m,
 *   overhanging 2.0 m: from the same photo, by perspective (the hall stands
 *   13 m behind the wing's face; eye level through the people's heads), and
 *   the NAIP shadow (about 12 m wide). Good to ±2 m.
 * - Colours: brown masonry, pale grey panels, a pale fascia, white roofs,
 *   from the photo, pulled to the palette's lightness.
 *
 * Doubts
 * - Only the west side and the plaza are photographed from outside. The
 *   hall's glazed band and overhang are carried round all four sides by
 *   assumption; the south (Mexico) side and the east side are unseen.
 * - The evening light in the one good photo makes the masonry look darker
 *   and warmer than it may be.
 * - A strip of lighter roof along the east side on NAIP (a skylight or a
 *   lower roof) is left out.
 * - Terrain: the map's ground under the footprint is 1.1–1.7 m above its
 *   lowest point, which sits at the south-east corner (toward the border
 *   fence), so most of the base sinks about 1.5 m on the map. `terrain.ts
 *   check` passes (no visible top buried).
 */
import { Part } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, rect, panel, block, save, type Rect } from './dc-white-house'

const BRICK = finish('pedwest-masonry', 0x9c8b7d)
const PANELS = finish('pedwest-panels', 0xc9ccc8)
const FASCIA = { ...PALETTE.trim, color: 0xeceae4 }
const ROOF = finish('pedwest-roof', 0xdcdedb)

const HALL = rect(-21.85, 15.75, -32.6, 21.1)
const WING = rect(-1.45, 25.65, 12.35, 34.5)
const WING_H = 6.0, BASE_H = 7.4, GLASS_TOP = 11.0, SLAB_TOP = 11.8, OVER = 2.0

function build() {
  const brick = new Part(), grey = new Part(), win = new Part(), trim = new Part(), roof = new Part()

  // The hall: grey panelled walls, the glazed band, a roof deck inside it.
  cbox(grey, HALL, 0, BASE_H, { top: false })
  cbox(win, HALL, BASE_H, GLASS_TOP, { top: false })
  // mullions every ~3.3 m round the band, standing just proud of the glass
  const sides: Array<['n' | 's' | 'e' | 'w', number, number, number]> = [
    ['s', HALL.y0, HALL.x0, HALL.x1], ['n', HALL.y1, HALL.x0, HALL.x1],
    ['w', HALL.x0, HALL.y0, HALL.y1], ['e', HALL.x1, HALL.y0, HALL.y1],
  ]
  for (const [side, at, a0, a1] of sides) {
    const n = Math.round((a1 - a0) / 3.3)
    for (let k = 1; k < n; k++) {
      const a = a0 + ((a1 - a0) * k) / n
      block(grey, side, at, a - 0.15, a + 0.15, BASE_H, GLASS_TOP, 0.08, false, false)
    }
  }
  // A grey sill band where the glazing starts.
  cbox(grey, { x0: HALL.x0 - 0.15, x1: HALL.x1 + 0.15, y0: HALL.y0 - 0.15, y1: HALL.y1 + 0.15 }, BASE_H - 0.1, BASE_H + 0.35, { b: 0.08, bottom: true, top: false })

  // The roof slab: a thin overhanging plate, pale fascia, roof on top.
  const slab: Rect = { x0: HALL.x0 - OVER, x1: HALL.x1 + OVER, y0: HALL.y0 - OVER, y1: HALL.y1 + OVER }
  cbox(trim, slab, GLASS_TOP, SLAB_TOP, { b: 0.12, top: false, bottom: true })
  cbox(roof, { x0: slab.x0 + 0.12, x1: slab.x1 - 0.12, y0: slab.y0 + 0.12, y1: slab.y1 - 0.12 }, SLAB_TOP - 0.05, SLAB_TOP + 0.02, { top: true })
  // Roof plant down the middle (NAIP).
  cbox(grey, rect(-5.5, 0.5, -20, 8), SLAB_TOP, SLAB_TOP + 0.9, { b: 0.15 })

  // Glass doors and a window band on the hall's north side, beside the
  // wing (photo); a grey band between storeys.
  panel(win, 'n', HALL.y1, -9.0, -2.0, 0.0, 3.6)
  panel(win, 'n', HALL.y1, -20.0, -10.5, 4.4, 6.6)
  panel(win, 'w', HALL.x0, -20.0, 18.0, 4.4, 6.6)

  // The brown masonry wing, with a cap course; a pale-framed glass door
  // bay at its south end on the plaza face (photo).
  cbox(brick, WING, 0, WING_H - 0.3, { top: false })
  cbox(brick, { x0: WING.x0 - 0.1, x1: WING.x1 + 0.1, y0: WING.y0 - 0.1, y1: WING.y1 + 0.1 }, WING_H - 0.3, WING_H, { b: 0.08, bottom: true, top: roof })
  block(grey, 'w', WING.x0, 21.3, 25.5, 0, 3.6, 0.1)
  panel(win, 'w', WING.x0 - 0.1, 21.6, 25.2, 0.0, 3.2)

  return [
    { part: brick, material: BRICK },
    { part: grey, material: PANELS },
    { part: win, material: PALETTE.window },
    { part: trim, material: FASCIA },
    { part: roof, material: ROOF },
  ]
}

if (import.meta.main) {
  await save('sd-san-ysidro-ped-west', 'San Ysidro Port of Entry, PedWest', build(), {})
}
