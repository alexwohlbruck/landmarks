/**
 * Candler Building, Atlanta (1906, George E. Murphy and Charles Stewart
 * Stewart for Asa G. Candler; now the Candler Hotel) — original procedural
 * geometry, CC0-1.0.
 * bun generators/atl-candler-building.ts
 *
 * Uses the B4 kit exported from generators/atl-flatiron-building.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0, the plan is OSM's
 * outline as drawn. Anchor = centroid of OSM way/270880829 ("Candler
 * Building", building=hotel, height 73.2, 17 levels), 33.756877,
 * -84.387852. The building:part way/536778094 has the same outline.
 *
 * Identity: a seventeen-storey block of pale Georgia marble and cream
 * terracotta on a wedge of a lot: its long west front follows Peachtree
 * Street on the diagonal, the north front is on John Wesley Dobbs Avenue,
 * the east side is straight, and a wedge-shaped light court opens to the
 * south. A tall two-storey marble base with carved piers under a cornice,
 * a rusticated two-storey band, ten plain storeys of paired windows, then
 * a richly carved three-storey top with arched windows under a heavy
 * projecting cornice.
 *
 * Evidence:
 *  - plan: OSM way/270880829 (and its part way/536778094). The lidar shows
 *    the same U plan with the south light court open down to a low roof
 *    at about 8 m (not modelled: it lies outside the OSM outline).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid, above ground_min 322.41 m; the streets round it are 0.6–1.9 m
 *    above that. Measured: main roof 65.0–66.3 m (64.5 used from the
 *    street, the cornice top), rooftop penthouses 70.1–71.1 m over the
 *    east wing and the middle (two boxes, about 6 m tall). OSM's 73.2 m
 *    is not borne out by the lidar; published: 17 storeys.
 *  - storey bands, scaled from Mike's north-front photo: base cornice
 *    about 12 m, the rusticated band to about 20 m, the top section from
 *    about 54 m. Five window bays on the north front, each a pair of
 *    windows.
 *  - ground: Mapterhorn is within 1.7 m across 60 m; elevation 0.
 *  - colour: pale cream-grey marble/terracotta (every photo), pulled to
 *    the palette's lightness.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Candler Building Atlanta.jpg, Mike, CC BY 2.0 (north front and the
 *    Peachtree front from the north-west)
 *    https://commons.wikimedia.org/wiki/File:Candler_Building_Atlanta.jpg
 *  - Candler Building and Georgia-Pacific Tower.jpg, JJonahJackalope,
 *    CC BY-SA 4.0 (the Peachtree front from the south-west)
 *    https://commons.wikimedia.org/wiki/File:Candler_Building_and_Georgia-Pacific_Tower.jpg
 *  - The Candler Building, Atlanta, GA (47474418301).jpg, Warren LeMay, CC0
 *    (the shaft and top looking up)
 *    https://commons.wikimedia.org/wiki/File:The_Candler_Building,_Atlanta,_GA_(47474418301).jpg
 *  - The Candler Building Atlanta, GA (40508265053).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:The_Candler_Building_Atlanta,_GA_(40508265053).jpg
 *  - Candler-Bldg-Atlanta-02.jpg, Eoghanacht, public domain (base detail)
 *    https://commons.wikimedia.org/wiki/File:Candler-Bldg-Atlanta-02.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south side and the light court are seen in no photo and are
 * drawn plain with the shaft's windows; the carved ornament, the arched
 * heads of the top windows and the base sculpture are left out.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { box, ccw, cornice, edgePanels, offset, prism, save, split, wall, type PanelOpts, type XY } from './atl-flatiron-building'

const marble = new Part(), trim = new Part(), win = new Part(), roof = new Part()

const R = ccw([[15.45, -23.29], [3.74, -24.89], [0.10, -24.51], [0.56, -8.29], [-4.16, -7.42], [-10.81, -19.93], [-24.50, -15.64], [-25.50, -15.48], [-6.69, 23.51], [16.62, 23.04]])

const BASE = 12, RUST = 20, TOPSEC = 54, ROOF = 64.5

// ── Massing ──
wall(marble, split(R, 5), 0, BASE)
prism(marble, R, BASE, ROOF, roof, 0.4)
// Cornices: the base, the rusticated band, under the top storeys, and the
// heavy crowning cornice.
cornice(trim, R, BASE - 0.4, 1.2, 0.5, trim)
cornice(trim, R, RUST - 0.2, 0.7, 0.3, trim)
cornice(trim, R, TOPSEC - 0.3, 1.0, 0.45, trim)
cornice(trim, R, ROOF - 1.8, 1.8, 1.2, roof)
// Rooftop penthouses (lidar 70–71 m), set well back from the fronts.
box(roof, 4.5, 10.5, 4, 16, ROOF, 70.5, roof, 0.4)
box(roof, -6, 0, -6, 2, ROOF, 70.5, roof, 0.4)

// ── Windows ──
// Each face: bays of a window pair (about 4.4 m) with piers between.
const shaft: PanelOpts = { group: 6.8, gap: 1.9, bay: 4.5, pier: 1.8, margin: 1.5, min: 3 }
for (let i = 0; i < R.length; i++) {
  const a = R[i], b = R[(i + 1) % R.length]
  // The base: tall two-storey openings between the carved piers.
  edgePanels(win, a, b, 1.0, BASE - 1.2, { ...shaft, group: 11, gap: 0, pier: 2.0 })
  // The rusticated band: one panel per bay over its two storeys.
  edgePanels(win, a, b, BASE + 1.4, RUST - 0.6, { ...shaft, group: 7, gap: 1.0 })
  // The shaft: ten storeys, two to a panel.
  edgePanels(win, a, b, RUST + 1.2, TOPSEC - 0.8, shaft)
  // The ornate top: one band across its three storeys.
  edgePanels(win, a, b, TOPSEC + 1.4, ROOF - 2.6, { ...shaft, group: 9, gap: 1.2 })
}
void offset

// Night: the windows glow; no licensed night photo shows floodlighting.
await save('atl-candler-building', 'Candler Building', [
  { part: marble, material: finish('candler-marble', 0xe7ddcc) },
  { part: trim, material: finish('candler-terracotta', 0xefe6d6) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], { height: 70.5, anchor: [33.756877, -84.387852], bearing: 0 })
