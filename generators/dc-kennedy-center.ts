/**
 * John F. Kennedy Center for the Performing Arts — procedural, CC0-1.0, no
 * textures.
 * bun generators/dc-kennedy-center.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the outline's long
 * walls running due north–south (OSM: 0.2°). The anchor is the area centroid
 * of the OSM outline way/66418634 (lng -77.0557579, lat 38.8959012). The
 * building itself is symmetrical about x = 7.35, the line the column ring and
 * the marble box share; the outline reaches further west for the river
 * terrace.
 *
 * What it is: Edward Durell Stone's white Carrara-marble box (1971), 630 ×
 * 300 ft, standing on a podium above the Potomac, ringed by tall, slender
 * bronze-gold square columns that carry a flat overhanging roof slab; a
 * set-back roof-terrace storey and a second, thinner slab above. The ring of
 * gold columns in front of the shaded marble wall is the identity, so the
 * columns are drawn as broad gold piers (2 m against the real ~1 m) that
 * read at 200 px, and the wall under the overhang is a shaded marble tone,
 * standing in for the deep shadow the slab throws in every photo.
 *
 * Covers and replaces: the outline way/66418634 and every building:part
 * inside it — the marble box (427085634), the roof slab (427085628), the
 * terrace storey (427085626) and its slab (427085602), the rooftop structure
 * (427085647), the river terrace (1375362774) and the 66 one-metre column
 * parts. Not replaced: the REACH (way/736679519 and its pavilions
 * 1019782779–81), the 2019 extension to the south, which is its own
 * building outside the outline.
 *
 * Evidence
 * - OSM (measured): outline 125.6 × 210.4 m. Box 91.0 × 190.7 m (x −38.2 to
 *   52.9), h 21; roof slab 111 × 210 m, 21–22 m; terrace storey 69.5 ×
 *   169.8 m, 22–29 m; its slab 81.4 × 181.6 m, 29–30 m; rooftop block 21.7 ×
 *   37.7 m, 30–32 m; column parts 1 × 1 m on a ring 4.8 m out from the box,
 *   23 to a long side at 9.12 m and 12 to a short side at 9.15 m (66 in
 *   all); river terrace strip x −62.8 to −47.3. Outline height 32.
 * - Published (Wikipedia; Kennedy Center): 630 × 300 ft (192 × 91 m), 100 ft
 *   (30 m) high; Grand Foyer 630 ft long and 60 ft high along the river
 *   front; Hall of States and Hall of Nations crossing the building between
 *   the three main theatres; architect Edward Durell Stone, opened 1971.
 * - Photos (Wikimedia Commons): "Kennedy Center seen from the Potomac
 *   River, June 2010.jpg" (Tom, CC BY 3.0), west front; "Kennedy Center for
 *   the Performing Arts, Washington, D.C., LCCN2011632175.jpg" (Carol M.
 *   Highsmith, public domain), from the south-west; "Kennedy Center -
 *   panoramio.jpg" (jiazi, CC BY-SA 3.0), from the north-west at dusk;
 *   "KennedyCtr.jpg" (NOAA, public domain), west front; "Kennedy Center
 *   (53844537746).jpg" (ajay_suresh, CC BY 2.0) and "Kennedy Center name
 *   covered 2026-06-26 10-22-04.jpg" (G. Edward Johnson, CC BY 4.0), east
 *   front; "Aerial view of The Reach at the Kennedy Center, July 2024.jpg"
 *   (Sdkb, CC BY-SA 4.0), roof from the south-east.
 * - USGS NAIP orthophoto (public domain): the white slab rim, the pale
 *   terrace and the darker roof inside it, the halls' roof breaks at about
 *   y = ±31 m.
 * - Estimated from the photos against the 32 m outline height: the podium
 *   to 6 m above the river parkway (a dark recessed band along its foot on
 *   the river side), columns 6–21.2 m, slab 21.2–22.4 m, terrace storey to
 *   29 m, upper slab to 30.2 m. The Grand Foyer's tall window pairs are in
 *   alternate bays of the west front (the real rhythm is irregular); the
 *   east front's two entrances are drawn as tall glazed bays at the halls,
 *   y = ±31 m; the terrace storey's windows at about 8.5 m pitch.
 * - Simplified: the river terrace's willows and planters, the lettering,
 *   the flagpoles and the east front's slot windows are left out; the plaza
 *   in front of the east entrances is the map's, so the podium is drawn on
 *   all four sides.
 * - Name: OSM still carries the 1971 name; the 2025–26 renaming dispute is
 *   left to the catalogue.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, cbox, grow, panel, rect, save, type Rect } from './dc-white-house'

const marble = new Part(), shade = new Part(), gold = new Part(), win = new Part(), roof = new Part(), door = new Part()

// ---- Plan (OSM).
const CX = 7.35 // the column ring's and the box's centre line
const BOX = rect(-38.2, 52.9, -95.4, 95.4)
const SLAB = rect(-48.1, 62.8, -105.2, 105.2)
const PODIUM = rect(-62.8, 62.8, -105.2, 105.2)
const UPPER = rect(-27.3, 42.0, -85.0, 85.0)
const UPPER_SLAB = rect(-33.3, 48.0, -90.8, 90.8)
const TOP_BLOCK = rect(19.0, 40.8, -18.9, 18.8)
// Column ring: x from −43.0 to 57.7 (12 columns), y ±100.3 (23 columns).
const COL_X0 = CX - 50.35, COL_X1 = CX + 50.35, COL_Y = 100.3

// ---- Heights.
const PODIUM_TOP = 6.0, RECESS = 2.0
const SLAB_BOT = 21.2, SLAB_TOP = 22.4
const UPPER_TOP = 29.0, UPPER_SLAB_TOP = 30.2, TOP = 32.0

// ---- Podium: white marble wall, a dark recessed band along its foot on the
// river side, a coping, and the terrace deck on top.
{
  const west = PODIUM.x0
  cbox(marble, rect(west + 1.6, PODIUM.x1, PODIUM.y0, PODIUM.y1), 0, RECESS, { top: false })
  cbox(marble, rect(PODIUM.x0, PODIUM.x1, PODIUM.y0, PODIUM.y1), RECESS, PODIUM_TOP - 0.5, { top: false, bottom: true })
  cbox(marble, grow(PODIUM, 0.25), PODIUM_TOP - 0.5, PODIUM_TOP, { b: 0.25, bottom: true, top: marble })
  // The recess under the river terrace reads as a dark band.
  panel(roof, 'w', west + 1.6, PODIUM.y0 + 1.6, PODIUM.y1 - 1.6, 0, RECESS)
}

// ---- The box: shaded marble walls under the overhang.
cbox(shade, BOX, PODIUM_TOP, SLAB_BOT, { top: false, c: 0.5 })

// West front, the Grand Foyer: tall window pairs in alternate bays.
const BAY_Y = (2 * COL_Y) / 22
for (let k = 1; k < 21; k++) {
  if (k % 2 === 0) continue
  const y0 = -COL_Y + k * BAY_Y, y1 = y0 + BAY_Y
  // Inside the box's length only.
  if (y0 < BOX.y0 + 1 || y1 > BOX.y1 - 1) continue
  const m = (y0 + y1) / 2
  for (const s of [-1, 1]) {
    const a = m + s * 1.55
    panel(win, 'w', BOX.x0, a - 1.15, a + 1.15, PODIUM_TOP + 1.2, SLAB_BOT - 2.2)
  }
  // A gold frame round the pair, as the real bronze window frames read.
  block(gold, 'w', BOX.x0, m - 3.1, m + 3.1, SLAB_BOT - 2.2, SLAB_BOT - 1.6, 0.12)
}

// East front: the entrances to the Hall of States and Hall of Nations.
for (const yc of [-31, 31]) {
  block(door, 'e', BOX.x1, yc - 8, yc + 8, PODIUM_TOP, PODIUM_TOP + 11, 0.05, false, true)
  // Bronze frame across the head of the opening.
  block(gold, 'e', BOX.x1, yc - 8.4, yc + 8.4, PODIUM_TOP + 11, PODIUM_TOP + 11.8, 0.15)
}

// ---- The ring of gold columns, broad enough to read at phone size.
const COL = 1.0 // half width
function column(x: number, y: number) {
  cbox(gold, rect(x - COL, x + COL, y - COL, y + COL), PODIUM_TOP, SLAB_BOT, { c: 0.3, top: false })
}
for (let k = 0; k <= 22; k++) {
  const y = -COL_Y + k * BAY_Y
  column(COL_X0, y)
  column(COL_X1, y)
}
const BAY_X = (COL_X1 - COL_X0) / 11
for (let k = 1; k < 11; k++) {
  const x = COL_X0 + k * BAY_X
  column(x, -COL_Y)
  column(x, COL_Y)
}

// ---- Roof slab: a bright, bevelled fascia with its underside closed.
cbox(marble, SLAB, SLAB_BOT, SLAB_TOP, { b: 0.35, bottom: true, top: marble })

// ---- Terrace storey: white walls with a row of windows, then its slab.
cbox(marble, UPPER, SLAB_TOP, UPPER_TOP, { top: false, c: 0.4 })
function windows(side: 'n' | 's' | 'e' | 'w', at: number, a0: number, a1: number) {
  const n = Math.max(1, Math.round((a1 - a0) / 8.5)), step = (a1 - a0) / n
  for (let k = 0; k < n; k++) {
    const c = a0 + step * (k + 0.5)
    panel(win, side, at, c - 2.2, c + 2.2, SLAB_TOP + 2.0, UPPER_TOP - 0.9)
  }
}
windows('w', UPPER.x0, UPPER.y0 + 2, UPPER.y1 - 2)
windows('e', UPPER.x1, UPPER.y0 + 2, UPPER.y1 - 2)
windows('n', UPPER.y1, UPPER.x0 + 2, UPPER.x1 - 2)
windows('s', UPPER.y0, UPPER.x0 + 2, UPPER.x1 - 2)
cbox(marble, UPPER_SLAB, UPPER_TOP, UPPER_SLAB_TOP, { b: 0.3, bottom: true, top: marble })
// The roof proper, over the terrace storey; the slab's overhang stays white.
cbox(roof, grow(UPPER, -0.5), UPPER_SLAB_TOP, UPPER_SLAB_TOP + 0.06, { top: true })

// ---- Rooftop block (mechanical and the roof restaurants' plant).
cbox(marble, TOP_BLOCK, UPPER_SLAB_TOP, TOP, { b: 0.2, top: roof, c: 0.3 })

await save('dc-kennedy-center', 'John F. Kennedy Center for the Performing Arts', [
  { part: marble, material: finish('kc-marble', 0xf6f3ec) },
  { part: shade, material: finish('kc-marble-shaded', 0xd9d5cd) },
  { part: gold, material: finish('kc-bronze-gold', 0xbf9145) },
  { part: win, material: PALETTE.window },
  { part: roof, material: finish('kc-roof', 0xb8b2a6) },
  { part: door, material: PALETTE.entrance },
], { bearing: 0, osm: 'way/66418634', footprint: [125.6, 210.4], height: TOP })
