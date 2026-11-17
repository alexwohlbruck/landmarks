/**
 * San Ysidro Land Port of Entry, PedEast — the East Pedestrian Inspection
 * Building of the rebuilt port (GSA, 2014–2019), where most people walking
 * north from Tijuana enter the US.
 *
 * Identity: a long, tall box clad in dark grey horizontal metal planks over
 * a band of tan panels, a ribbon of windows between the two, and on its
 * north-east face a deep entrance recess under a big cantilevered canopy
 * with a pale fascia. The long west bar carries rows of solar panels on its
 * roof.
 *
 * Frame: bearing 314.6 (the building's long axis, north-west). Map frame
 * turned to that bearing: +y toward compass 314.6 (north-west), +x toward
 * compass 44.6 (north-east), z up, metres. Origin at the anchor
 * (−117.0297383, 32.5438157), the centroid of OSM way/795987984; y = 0 the
 * ground.
 *
 * Sources
 * - OSM way/795987984 (building=government, "East Pedestrian Inspection
 *   Building", CBP) © OSM contributors: a 20 m × 101 m bar along the west
 *   and a 30 m × 64 m block to its north-east, about 3,900 m². OSM
 *   way/1021258603 (building=roof, building:levels=2): the entrance canopy
 *   on the north-east face. No heights.
 * - USGS NAIP orthophoto: the plan, rows of solar panels on the bar's roof,
 *   a white roof with plant on the north-east block, the shadows.
 * - USGS lidar CA_SanDiegoQL2_2014: flown while the port was being rebuilt;
 *   it shows the old layout, so it is not used.
 * Photos (evidence)
 * - "PedEast San Ysidro LPOE August 2018.jpg", Balintawak, public domain,
 *   https://commons.wikimedia.org/wiki/File:PedEast_San_Ysidro_LPOE_August_2018.jpg
 *   — the entrance: dark grey plank cladding, tan panels below, the glazed
 *   entrance set deep under the canopy, its pale fascia.
 * - "General Terrence J O’Shaughnessy tours the San Ysidro Port of Entry
 *   (31949685228).jpg", CBP Photography, public domain,
 *   https://commons.wikimedia.org/wiki/File:General_Terrence_J_O%E2%80%99Shaughnessy_tours_the_San_Ysidro_Port_of_Entry_(31949685228).jpg
 *   (and others of that set) — the tan panel base with the "San Ysidro Land
 *   Port of Entry / East Pedestrian" lettering, the window ribbon above it,
 *   the plank cladding above that.
 * - "SY LPOE sign.jpg", Balintawak, CC BY-SA 4.0 — the lettering (not
 *   modelled: not a famous sign).
 *
 * Numbers (no lidar and no published heights: estimated)
 * - North-east block 14 m, bar 13 m: from the NAIP shadow of the north-east
 *   block's north-west wall (about 15 m), scaled by the McDonald's building
 *   600 m away whose lidar height and shadow are both known; ±2 m.
 * - Tan base to 4.4 m, window ribbon 4.7–5.9 m, entrance glass to 7.4 m,
 *   canopy 7.4–9.0 m deep, projecting 4.3 m past the face (OSM canopy
 *   outline) and 1.7 m wider than the recess each side:
 *   from the entrance photo, a door (2.4 m) as the scale.
 * - Colours from the daylight photos, pulled to the palette's lightness;
 *   solar panels from NAIP.
 *
 * Doubts
 * - Only the entrance and the plaza along the north-east face are
 *   photographed. The other faces repeat the base, ribbon and cladding by
 *   assumption; their real openings are unknown.
 * - The OSM outline's small jogs are kept; it was drawn over aerials after
 *   the rebuild.
 */
import { Part } from './mesh'
import { finish, PALETTE } from './palette'
import { cbox, rect, panel, save } from './dc-white-house'
import { pslab, ppanel, ccw, type XY } from './dc-nga-west'

const CLAD = finish('pedeast-cladding', 0x7d8186)
const TAN = finish('pedeast-tan-panel', 0xcdbfa6)
const FASCIA = { ...PALETTE.trim, color: 0xece9e2 }
const ROOF = finish('pedeast-roof', 0xd9dad6)
const SOLAR = finish('pedeast-solar', 0x58626e, 0.4)

const BAR_H = 13, NE_H = 14, BASE = 4.4

const BAR: XY[] = [
  [-20.7, -42.6], [-4.6, -42.6], [-4.6, -36.5], [-2.7, -36.5], [-2.7, 59.1], [-22.9, 59.1], [-22.5, -31.7], [-20.8, -31.7],
]
const NE: XY[] = [
  [-2.7, -36.5], [-2.1, -36.5], [-2.1, -39.8], [8.1, -39.8], [8.1, -41.0], [27.5, -41.0], [27.5, -23.0],
  [21.0, -23.0], [21.0, -13.3], [27.6, -13.3], [27.5, 23.1], [7.45, 23.1], [7.45, 19.6], [-2.7, 19.7],
]

function block(ring: XY[], h: number, clad: Part, tan: Part, win: Part, roof: Part, skip: (a: XY, b: XY) => boolean) {
  pslab(clad, ring, 0, h, 0.35, roof)
  // tan base band, a few centimetres proud of the cladding
  const R = ccw(ring)
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (skip(a, b)) continue
    ppanel(tan, a, b, 0, 1, 0, BASE, 0.06)
    if (L > 8) ppanel(win, a, b, 0.06, 0.94, 4.7, 5.9, 0.05)
  }
}

function build() {
  const clad = new Part(), tan = new Part(), win = new Part(), trim = new Part(), roof = new Part(), solar = new Part()

  // The bar's east wall is hidden behind the north-east block where they meet.
  const inner = (a: XY, b: XY) => Math.abs(a[0] + 2.7) < 0.05 && Math.abs(b[0] + 2.7) < 0.05 && Math.min(a[1], b[1]) < 19.8
  block(BAR, BAR_H, clad, tan, win, roof, inner)
  block(NE, NE_H, clad, tan, win, roof, (a, b) => [21, -2.7].some((x) => Math.abs(a[0] - x) < 0.05 && Math.abs(b[0] - x) < 0.05))

  // The entrance: tall glazing at the back of the recess, under the canopy.
  panel(win, 'e', 21.0, -22.6, -13.7, 0.0, 7.4, 0.05)
  // The canopy: a deep box with a pale fascia, wider than the recess.
  cbox(trim, rect(21.0, 31.8, -25.0, -11.3), 7.4, 9.0, { b: 0.15, bottom: true })

  // Solar arrays along the bar's roof (NAIP), and plant on the NE block.
  for (let y = -38; y + 8 <= 56; y += 10.5) cbox(solar, rect(-19.8, -5.6, y, y + 8), BAR_H, BAR_H + 0.45, { b: 0.1 })
  cbox(clad, rect(4, 16, -10, 6), NE_H, NE_H + 1.6, { b: 0.2 })

  return [
    { part: clad, material: CLAD },
    { part: tan, material: TAN },
    { part: win, material: PALETTE.window },
    { part: trim, material: FASCIA },
    { part: roof, material: ROOF },
    { part: solar, material: SOLAR },
  ]
}

if (import.meta.main) {
  await save('sd-san-ysidro-ped-east', 'San Ysidro Port of Entry, PedEast', build(), {})
}
