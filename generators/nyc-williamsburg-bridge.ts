/**
 * Williamsburg Bridge towers (1903; Leffert L. Buck, Henry Hornbostel) —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-williamsburg-bridge.ts
 *
 * One tower, placed twice (Manhattan and Brooklyn; OSM maps both with the
 * same 36.6 x 12.2 m rectangle). Map frame: x across the bridge, y along it,
 * z up, metres; origin at the tower's centre on the water. Placed at bearing
 * 291.8°, the line from the Brooklyn tower's centroid to the Manhattan one's
 * (487.3 m apart; the published main span is 1,600 ft, 488 m). Only the
 * tower and its piers: no cables, and a deck stub no longer than the tower
 * is deep.
 *
 * What makes it the Williamsburg Bridge: an all-steel tower of two separate
 * lattice shafts, each a four-post tower braced with X panels on every
 * face, the outer faces leaning in toward the top; one tall slim X between
 * the shafts above the deck and an arched brace below it; a flared cap on
 * each shaft carrying two cable saddles, a girder across the top; each
 * shaft on its own masonry pier. Plain grey paint.
 *
 * Sources:
 * - OSM: way/1016434034 (Manhattan tower) and way/1016434035 (Brooklyn),
 *   bridge:support=pylon, height 94, material metal: 36.6 x 12.2 m, which
 *   is the shafts' footprint at the deck and below.
 * - Lidar (USGS 3DEP NY_NewYorkCity 2017, 0.5 m, Manhattan tower; heights
 *   above the river at about 0 m NAVD88): four cable saddles at |x| 6.75 and
 *   13.75, 104–105 m, about 13 m long; cross girder top 102 m, 35 m across
 *   and 7.5 m deep; bracing planes at |y| 3.5 between the shafts; deck top
 *   38–40 m.
 * - Published: towers 335 ft (102 m) above mean high water, 135 ft (41 m)
 *   clearance (Wikipedia "Williamsburg Bridge"; NYC DOT). OSM's 94 m is the
 *   older 310 ft figure measured from the roadway's datum; the lidar agrees
 *   with 102.
 * - Photos (Wikimedia Commons): "Williamsburg Bridge, New York City,
 *   20231001 1053 0976" and "... 1054 0984" (Jakub Hałun, CC BY 4.0; side
 *   view and the Manhattan tower three-quarter from the river); "Williamsburg
 *   Bridge NY2" (Acroterion, CC BY-SA 4.0; Brooklyn tower three-quarter,
 *   piers, arch under the deck); "Williamsburg Bridge east tower" (Beyond My
 *   Ken, CC BY-SA 4.0; end-on: tapering shafts, caps, the X between them);
 *   "Williamsburg Bridge tower (3933002966)" (Patrick Nielsen Hayden, CC BY
 *   2.0; a Manhattan pier at the base); "East River Park td (2025-10-25) 115"
 *   (Tdorante10, CC BY-SA 4.0) and "View from Domino Park 027" (Kidfly182,
 *   CC BY 4.0), for the current paint.
 * - Colour: every photo from 2016 to 2026 shows plain mid grey paint with a
 *   faint blue cast (#7d8590 to #8e959c in sun); the brief's red/terracotta
 *   isn't the current colour. The red seen on the bridge is the pedestrian
 *   path's railing and the trains. Pulled to the palette's lightness.
 * - Estimated from photos: the shafts' taper (outer faces lean from |x| 18.3
 *   at the deck to 15.5 at the top; inner faces plumb at 5.0; depth from
 *   12.2 to 8 m), five X panels per face above the deck and two below, the
 *   piers (5 m) and the arch under the deck, the flared caps.
 * - y = 0 is the river. The Manhattan tower's piers stand at the bulkhead,
 *   whose ground is about 2.3 m up, so that copy sinks its piers by that
 *   much: not worth a second model.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { box, beam, archWall, loftSolid, rim, countParts, norm } from './nyc-manhattan-bridge'

const steel = new Part()  // posts, caps, girder
const brace = new Part()  // X panels and struts, a shade deeper
const pier = new Part()   // masonry piers
const road = new Part()   // deck stub's top

// Heights (m above the river).
const PIER = 5.0
const DECK0 = 30.0, DECK = 39.5
const CAP0 = 98.0, CAP = 101.5, GIRDER = 102.0, SADDLE = 104.6

// Shaft plan: inner face plumb, outer face and depth tapering above the deck.
const XI = 5.0
const xo = (z: number) => (z <= DECK ? 18.3 : 18.3 - (2.8 * (z - DECK)) / (CAP0 - DECK))
const yd = (z: number) => (z <= DECK ? 6.1 : 6.1 - (2.1 * (z - DECK)) / (CAP0 - DECK))
const PW = 1.0 // post half-size

/** The four corners of shaft `s` (+1 east of the axis, -1 west) at height z, CCW from above. */
function corners(s: number, z: number): V3[] {
  const a = s * XI, b = s * xo(z), y = yd(z)
  const [x0, x1] = s > 0 ? [a, b] : [b, a]
  return [[x0, -y, z], [x1, -y, z], [x1, y, z], [x0, y, z]]
}
/** The same corners pulled in by d, so posts sit inside the outline. */
const inset = (c: V3[], d: number): V3[] => {
  const cx = (c[0][0] + c[1][0]) / 2
  return c.map(([x, y, z]) => [x - Math.sign(x - cx) * d, y - Math.sign(y) * d, z] as V3)
}

// Piers, one per shaft.
for (const s of [-1, 1]) {
  const [x0, x1] = s > 0 ? [XI - 1.2, 19.5] : [-19.5, -XI + 1.2]
  box(pier, x0, x1, -7.3, 7.3, 0, PIER - 0.6, { r: 0.6, bottom: false })
  box(pier, x0 + 0.4, x1 - 0.4, -6.9, 6.9, PIER - 0.6, PIER, { r: 0.4, top: 0.25, bottom: false })
}

// Shafts: four posts, struts at every panel line, X panels on all four faces.
const levels = [PIER, PIER + (DECK0 - PIER) / 2, DECK0, DECK,
  ...[1, 2, 3, 4].map(k => DECK + (k * (CAP0 - DECK)) / 5), CAP0]
for (const s of [-1, 1]) {
  // Posts: lofted through the levels so they bend at the deck.
  for (let i = 0; i < 4; i++) {
    const rings = levels.map(z => {
      const c = inset(corners(s, z), PW)[i]
      return rim(c[0] - PW, c[0] + PW, c[1] - PW, c[1] + PW, 0.25, z)
    })
    loftSolid(steel, rings, [false, false])
  }
  for (let k = 0; k < levels.length; k++) {
    const z = levels[k]
    if (z > DECK0 && z < DECK + 0.1) continue // hidden in the deck
    const c = inset(corners(s, z), PW)
    // Struts round the shaft at each panel line.
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4]
      const n: V3 = norm(cross(sub(b, a), [0, 0, 1]))
      beam(brace, [a[0], a[1], z], [b[0], b[1], z], 1.3, 0.7, n)
    }
    if (k === levels.length - 1 || levels[k + 1] - z < 1) continue
    const zt = levels[k + 1], ct = inset(corners(s, zt), PW)
    if (z >= DECK0 && zt <= DECK) continue
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const n: V3 = norm(cross(sub(c[j], c[i]), [0, 0, 1]))
      beam(brace, c[i], ct[j], 1.6, 0.6, n)
      beam(brace, c[j], ct[i], 1.6, 0.6, n)
    }
  }
}

// Between the shafts above the deck: one tall slim X in each bracing plane.
for (const y of [-3.5, 3.5]) {
  beam(brace, [-XI, y, DECK + 1], [XI, y, CAP0 - 1], 1.2, 0.6, [0, 1, 0])
  beam(brace, [XI, y, DECK + 1], [-XI, y, CAP0 - 1], 1.2, 0.6, [0, 1, 0])
}
// Below the deck: an arched brace closing the gap between the shafts.
archWall(brace, brace, -XI, XI, -3.9, 3.9, 0, DECK0 - 9, XI, DECK0, 10)

// Deck stub through the tower.
box(brace, -18.6, 18.6, -6.6, 6.6, DECK0, DECK, { r: 0.3, bottom: true, lid: road })

// Caps: each shaft's top flares out into a bowl carrying two saddles.
for (const s of [-1, 1]) {
  const c0 = corners(s, CAP0), c1 = corners(s, CAP - 0.6)
  const grow = (c: V3[], d: number, z: number): V3[] => {
    const cx = (c[0][0] + c[1][0]) / 2
    return c.map(([x, y]) => [x + Math.sign(x - cx) * d, y + Math.sign(y) * d, z] as V3)
  }
  loftSolid(steel, [grow(c0, 0, CAP0), grow(c1, 1.0, CAP - 0.6), grow(c1, 1.0, CAP)], [false, true])
  for (const cx of [6.75, 13.75]) {
    const x = s * cx
    box(steel, x - 1.5, x + 1.5, -5.5, 5.5, CAP, SADDLE, { r: 0.4, top: 0.8, bottom: false })
  }
}
// The girder across the top, between the caps.
box(steel, -XI - 0.5, XI + 0.5, -3.7, 3.7, CAP0 - 3.5, GIRDER, { r: 0.3, top: 0.2, bottom: true })

const STEEL: Swatch = finish('bridge-grey', 0x9aa2aa)
const BRACE: Swatch = finish('bridge-grey-shade', 0x838c95)
const PIERS: Swatch = finish('granite', 0xcdc6b9)
const ROAD: Swatch = finish('deck', 0x7f8489)
const parts = [
  { part: steel, material: STEEL }, { part: brace, material: BRACE },
  { part: pier, material: PIERS }, { part: road, material: ROAD },
]
const triangles = countParts(parts)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Williamsburg Bridge tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the tower centre on the water',
  height: SADDLE, bearing: 291.8, elevation: 0,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
await Bun.write(new URL('../models/nyc-williamsburg-bridge.glb', import.meta.url), glb)
console.log(`nyc-williamsburg-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
