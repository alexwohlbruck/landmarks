/**
 * Verrazzano-Narrows Bridge towers (1964; Othmar Ammann) — procedural,
 * CC0-1.0, no textures.
 * bun generators/nyc-verrazzano-narrows-bridge.ts
 *
 * One tower, placed twice (Brooklyn and Staten Island). Map frame: x across
 * the bridge, y along it (toward Staten Island), z up, metres; origin at the
 * tower's centre on the water. Placed at bearing 247.1°, the line from the
 * Brooklyn tower's centroid to the Staten Island one's (1,296 m apart; the
 * published main span is 4,260 ft, 1,298 m). Only the tower and its pier: no
 * cables, and the deck is a stub no longer than the tower is deep.
 *
 * What makes it the Verrazzano: two tall, plain, slightly tapering steel
 * legs; a deep solid head across the top with a tall round-headed opening cut
 * up into it, so the tower reads as one slender portal; a strut under the
 * double deck; pale grey-green paint; a concrete block in the water under
 * each leg.
 *
 * Sources:
 * - OSM: tower outlines way/1016642058 (Staten Island) and way/1016642060
 *   (Brooklyn), bridge:support=pylon, building=bridge, height 211; piers
 *   way/1016642057 and way/1016642059 (man_made=pier, 57.5 x 23 m): the
 *   pier box follows them. They aren't buildings, so `replaces` lists only
 *   the tower outlines.
 * - Lidar (USGS 3DEP NY_NewYorkCity 2017, point cloud cropped to each tower;
 *   heights above the water at about -0.9 m NAVD88): top 211–212 m; head
 *   46–47 m across at the top, 10 m deep; legs about 10.5 m wide, inner faces
 *   14.5 m either side of the centre, outer faces 25 m out at the deck and
 *   about 23.5 m at the top; the arch's underside rising to about 170 m; the
 *   upper roadway's top 70 m; a separate concrete block under each leg, its
 *   top about 10.5 m, |x| 11–29 by 23 m, with water between the two. OSM's outlines are
 *   narrower (40 m) than the lidar's legs (49 m) and sit about 1 m off the
 *   lidar centre across the bridge; the placements use the lidar centres.
 * - Published: towers 693 ft (211 m) above the water; 228 ft (69.5 m)
 *   clearance at mid-span (Wikipedia "Verrazzano-Narrows Bridge"; MTA Bridges
 *   and Tunnels).
 * - Photos (Wikimedia Commons): "Verrazano-Narrows Bridge (10109726386)"
 *   (Shannon from Huntsville, CC BY-SA 2.0; the Brooklyn tower from the
 *   Staten Island side's beach: legs, head and arch, the strut under the
 *   deck); "Verrazano-Narrows Bridge 0039" (LawrenceFung, CC BY 2.0; the
 *   Brooklyn tower close from the Brooklyn shore, the pier, the far tower
 *   face-on); "Verrazzano-Narrows Bridge from the Brooklyn shore, New York
 *   City" (Allen Lubitz, CC BY 4.0; the Staten Island tower side-on);
 *   "NYC-verrazano-narrows-bridge" (Balou46, CC BY-SA 4.0; both towers from
 *   afar, for proportion).
 * - Estimated from photos: the arch's spring (about 158 m: a semicircle on
 *   the 29 m opening, crown 172 m); the strut under the deck (45–55 m); the
 *   deck stub (57–70 m).
 *   Only two cross members show in photos (the head and the strut under the
 *   deck); any others are inside the deck and aren't drawn.
 * - Colour: the paint reads #aaaead to #b0b2af in hazy daylight, a pale grey
 *   with a green cast, a little bluer in shade; kept at that lightness.
 */
import { Part, writeGlb } from './mesh'
import { finish, type Swatch } from './palette'
import { box, loftSolid, rim, archWall, countParts } from './nyc-manhattan-bridge'

const steel = new Part()  // legs, head, strut
const seam = new Part()   // the arch's soffit and the deck stub's sides, a shade deeper
const pier = new Part()   // concrete pier
const road = new Part()   // deck stub's roadway

// Heights (m above the water).
const PIER = 10.5
const STRUT0 = 45, STRUT1 = 55
const DECK0 = 57, DECK = 70
const SPRING = 157.5, TOP = 211

// Plan (lidar).
const XI = 14.5                                        // legs' inner faces, |x|
const xo = (z: number) => 25 - (1.5 * (z - PIER)) / (TOP - PIER) // outer faces lean in
const yd = (z: number) => 6 - (1.0 * (z - PIER)) / (TOP - PIER)  // half depth along the bridge
const CH = 0.9                                         // corner chamfer

// Piers: one concrete block under each leg, water between them (lidar), the
// pair filling OSM's outline.
for (const s of [-1, 1]) {
  const [a, b] = s > 0 ? [11, 28.7] : [-28.7, -11]
  box(pier, a, b, -11.5, 11.5, 0, PIER - 1.2, { r: 1.2, bottom: false })
  box(pier, a + 0.9, b - 0.9, -10.6, 10.6, PIER - 1.2, PIER, { r: 0.9, top: 0.4, bottom: false })
}

// Legs: tapering prisms, chamfered corners.
for (const s of [-1, 1]) {
  const ring = (z: number) => {
    const a = s * XI, b = s * xo(z)
    return rim(Math.min(a, b), Math.max(a, b), -yd(z), yd(z), CH, z)
  }
  loftSolid(steel, [ring(PIER), ring(STRUT0), ring(SPRING), ring(TOP)], [false, true])
}

// The head: a solid band between the legs with the round-headed opening cut
// up into it; its faces just inside the legs'.
const HD = yd(SPRING) - 0.15
archWall(steel, seam, -XI - 0.2, XI + 0.2, -HD, HD, 0, SPRING, XI, TOP, 12)
// Its top, flush with the legs'.
box(steel, -XI - 0.2, XI + 0.2, -HD, HD, TOP - 0.01, TOP, { r: 0, bottom: false })

// The strut under the deck, and the deck stub through the portal.
box(steel, -XI - 0.2, XI + 0.2, -yd(STRUT0) + 0.4, yd(STRUT0) - 0.4, STRUT0, STRUT1, { r: 0.4, bot: 0.3, top: 0.3, bottom: true })
box(seam, -XI, XI, -yd(DECK) + 0.2, yd(DECK) - 0.2, DECK0, DECK - 0.5, { r: 0.2, bottom: true, lid: road })
box(road, -XI + 0.4, XI - 0.4, -yd(DECK) + 0.2, yd(DECK) - 0.2, DECK - 0.5, DECK, { r: 0, bottom: false })

const STEEL: Swatch = finish('verrazzano-grey-green', 0xb6bdb8)
const SEAM: Swatch = finish('verrazzano-grey-green-shade', 0x9aa39f)
const PIER_S: Swatch = finish('pier-concrete', 0xcbc3b4)
const ROAD: Swatch = finish('deck', 0x7f8489)
const parts = [
  { part: steel, material: STEEL }, { part: seam, material: SEAM },
  { part: pier, material: PIER_S }, { part: road, material: ROAD },
]
const triangles = countParts(parts)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Verrazzano-Narrows Bridge tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the tower centre on the water',
  height: TOP, bearing: 247.1, elevation: 0,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/nyc-verrazzano-narrows-bridge.glb', import.meta.url), glb)
console.log(`nyc-verrazzano-narrows-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
