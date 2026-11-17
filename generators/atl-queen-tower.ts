/**
 * The Queen: Concourse Corporate Center V, Sandy Springs (Thompson, Ventulett,
 * Stainback & Associates; 34 storeys) — original procedural geometry, CC0-1.0.
 * bun generators/atl-queen-tower.ts [out.glb]
 *
 * Built with the King/Queen kit exported from generators/atl-king-tower.ts
 * (merge that file first). Its header holds the shared evidence: plan,
 * storeys, colours, and the identity check (the Queen is Corporate Center V,
 * the east tower, OSM way/64986738, loc_name "Queen tower"; Wikipedia: "the
 * round arcs of the 'queen' tower (Corporate Center V)").
 *
 * Map frame: x, y, z up, metres, origin at the anchor on the lowest ground.
 * Anchor = area centroid of OSM way/64986738, 33.917014, -84.354518.
 * Bearing 45.5, as the King (faces at 45.6° and 135.2° in OSM).
 *
 * What makes it the Queen: the King's blue banded ziggurat shaft, with a
 * white crown of four lattice corner towers, a low lattice ring, and two
 * crossed semicircular arches over the core carrying the spire; lit white
 * (or in colours) at night.
 *
 * Evidence (own measurements):
 *  - plan: OSM way/64986738 (a 50 m square, with a 6 m jog on the west corner
 *    that the lidar doesn't show: the plan is the King's).
 *  - heights: USGS 3DEP lidar GA_Statewide_B3_2018 (2018 flight), 0.5 m grid,
 *    above the lowest ground under the tower (287.05 m, the east corner; the
 *    site rises about 5.5 m to the west corner, Mapterhorn 287.1–292.9 m):
 *    corner notches floored at 32.4 m, prow tips 91.8 m, main square 111.5 m,
 *    diamond 123.4 m, core roof 135.4 m: every tier 5.3 m above the King's,
 *    at the same absolute levels (dz = 5.3). Crown ring 141–145 m, corner
 *    towers to 149 m, arches through 155–158 m at 8.5 m from the centre and
 *    crossing at about 160–162 m (lidar maximum 163.1 m, the spire's foot).
 *  - total height 173.7 m: OSM height (Wikipedia: 173.7 and 168.6 m to the
 *    spire tops).
 *  - crown layout: estimated from Thomson200's photos: a square ring beam
 *    9 m above the roof (the top of the lattice ring) on posts at ±11 m, with
 *    two semicircular arches (radius 15.6 m) springing from its corners along
 *    the diagonals, crossing at about 160 m as the lidar shows.
 *  - y = 0 is the lowest ground (east corner); elevation 0. The west corner
 *    stands in ground about 5.5 m higher, where the tower's granite base
 *    (drawn to the King's absolute level, 16.3 m here) sinks into the slope.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Concourse_Corporate_Center_V,_July_2017.jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_V,_July_2017.jpg
 *    (the crown and ziggurat top)
 *  - Concourse_Corporate_Center_V,_Sandy_Springs_July_2017.jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_V,_Sandy_Springs_July_2017.jpg
 *    (the shaft from below)
 *  - Concourse_Corporate_Center_V_and_VI_June_2024.jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_V_and_VI_June_2024.jpg
 *  - Concourse_Corporate_Center_VI_and_V,_July_2017_(cropped).jpg, Thomson200, CC0
 *    https://commons.wikimedia.org/wiki/File:Concourse_Corporate_Center_VI_and_V,_July_2017_(cropped).jpg
 *  - The_King_and_Queen_towers.jpg, Maksim Sundukov, CC BY-SA 3.0
 *    https://commons.wikimedia.org/wiki/File:The_King_and_Queen_towers.jpg (night)
 *  - Concourse_at_Landmark_Center,_Office_Buildings.jpg, Mitch Featherston,
 *    CC BY 2.0
 *    https://commons.wikimedia.org/wiki/File:Concourse_at_Landmark_Center,_Office_Buildings.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the lattice members are drawn as bold beams, about twice their real
 * thickness, and fewer of them; the arches are semicircles springing from the
 * corner towers, as the photos show, with their exact radius fitted to the
 * lidar. The low wing and the Westin beside the tower are other OSM buildings.
 */
import { concourseTower, writeConcourse } from './atl-king-tower'

if (import.meta.main) {
  await writeConcourse('atl-queen-tower', 'The Queen (Concourse Corporate Center V)', concourseTower({ crown: 'queen', dz: 5.3, tip: 173.7 }), {
    bearing: 45.5, elevation: 0, height: 173.7, replaces: ['way/64986738'],
  })
}
