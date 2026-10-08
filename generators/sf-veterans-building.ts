/**
 * War Memorial Veterans Building (Herbst Theatre), San Francisco — original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-veterans-building.ts
 *
 * The Opera House's twin across the War Memorial Court, built from the same
 * kit (`warMemorial()` in sf-opera-house.ts) so the pair stays consistent:
 * the same colonnade, quadrant corners, pavilions, cornice, attic and
 * mansard, with the Veterans Building's own dimensions, round-headed loggia
 * windows, two-tier side windows and glazed roofs, and no fly tower.
 *
 * Frame: BEARING 350.7, as the Opera House. x across the block (+x = the Van
 * Ness front, east), y along it (+y north), z up, metres. Origin = area
 * centroid of the OSM outline way/32865757; the building is drawn symmetric
 * about y = VC. y = 0 is the lowest ground it touches (20.35 m NAVD88, the
 * west side); the Van Ness front stands ~0.4 m higher.
 *
 * Evidence
 * - OSM way/32865757 (civic, height 28, no building:parts).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 1 m in the turned frame
 *   (/tmp/city/sf/work/sf-opera-house/lid.json): colonnade front x = 44.3,
 *   its cornice 19.2 and ledge 20.5; attic 23.3; the roof climbing ~5.5 m
 *   inward to a flat top at ~29.3; side walls |y| = 28.8 from x = -43; corner
 *   pavilions to |y| = 37 between x = 19 and 37.2, joined to the colonnade by
 *   quadrant walls, their hipped roofs peaking at ~29; a raised glazed
 *   skylight in the middle of the roof to 33.8. The glass roofs scatter the
 *   lidar (spurious returns to 46 m along their ridges), so their shapes come
 *   from the photos and the median heights.
 * - Published (Wikipedia; SF War Memorial): 1932, Arthur Brown Jr.; the
 *   Herbst Theatre inside; the upper floors were the San Francisco Museum of
 *   Art's top-lit galleries until 1994.
 * - Photos (Wikimedia Commons): "War Memorial Veterans Building (San
 *   Francisco).JPG" (Sanfranman59, CC BY-SA 3.0, the Van Ness front: 8 column
 *   pairs, arched loggia windows, the glazed front mansard); "War Memorial
 *   Veterans Building side.jpg" (Andreas Praefcke, CC BY 3.0, from the
 *   south-east: the pavilion and the court side's two tiers of arched windows);
 *   "San Francisco (2018) - 151.jpg" (Another Believer, CC BY-SA 4.0, the court
 *   from the west); "Aerial view of the Beaux Arts Civic Center of SF.jpg"
 *   (Dllu, CC BY-SA 4.0: ten arched windows on the court side, the glowing
 *   skylight band along the roof, the pavilion hips); "San Francisco City Hall,
 *   War Memorial Opera House, War Memorial Veterans Building.jpg" (Yair Haklai,
 *   CC BY-SA 4.0).
 *
 * Estimated: the storey lines (the Opera House's scaled to the lower
 * cornice), the window sizes, the split of each mansard into metal below and
 * a skylight band above (from the aerial), and the west (Franklin Street)
 * face, which no photo shows: three rows of plain windows.
 */
import { Part, writeGlb } from './mesh'
import { PALETTE } from './palette'
import { warMemorial, hipRect, panel, shift, GRANITE, LIGHT, MANSARD, FLAT, type WarMemorialSpec, type WarMemorialParts } from './sf-opera-house'

const BEARING = 350.7
const ANCHOR = { lng: -122.4210207, lat: 37.7795458 }
const VC = 0.3

export const VETERANS: WarMemorialSpec = {
  front: 44.3, loggia: 41.3, colHalf: 25,
  pav: { x0: 19, x1: 37.2, half: 37, hA: 31.2 }, sag: 0.8,
  body: { x0: -43, half: 28.8 },
  z: { ground: 0.4, base: 9.4, colTop: 17.4, cornice: 19.2, ledge: 20.5, attic: 23.3, top: 29.3, pavTop: 29 },
  atticIn: 1.8, mansardIn: 5.5,
  pairs: 8, pairStep: 6.67, colR: 0.68, colGap: 1.8, loggiaArches: true,
  sides: [{ x0: -41.5, x1: 17.5, n: 10, half: 28.8 }],
  upper: { w: 2.8, z0: 9.8, zc: 17.0 },
  lower: { w: 2.0, z0: 1.0, zc: 6.0 },
  glassFrom: 26,
}

const P: WarMemorialParts = { granite: new Part(), light: new Part(), windows: new Part(), metal: new Part(), roof: new Part(), glass: new Part() }
const { granite, light, windows, metal, roof, glass } = P
warMemorial(VETERANS, P)

// The raised skylight over the middle of the roof.
hipRect(glass, roof, -15, 7, -11, 11, VETERANS.z.top, 33.8, 8.5)

// West (Franklin Street) face: three rows of plain windows.
const xw = VETERANS.body.x0
for (let i = 0; i < 7; i++) {
  const y = -24 + i * 8
  for (const [z0, z1] of [[2, 4.6], [8.2, 11], [13.6, 16.6]]) panel(windows, [xw, y - 0.8], [xw, y + 0.8], [-1, 0], z0, z1)
}

shift([granite, light, windows, metal, roof, glass], 0, VC)
const parts = [
  { part: granite, material: GRANITE },
  { part: light, material: LIGHT },
  { part: windows, material: PALETTE.window },
  { part: metal, material: MANSARD },
  { part: glass, material: { ...PALETTE.glass, color: 0xa9bbbd } }, // grey-green skylight glazing in the photos
  { part: roof, material: FLAT },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('War Memorial Veterans Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 33.8,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/32865757'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-veterans-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
