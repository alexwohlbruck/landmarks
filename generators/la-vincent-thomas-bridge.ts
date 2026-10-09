/**
 * Vincent Thomas Bridge towers, San Pedro – Terminal Island (1963
 * suspension bridge, main span 457 m) — procedural, CC0-1.0.
 * bun generators/la-vincent-thomas-bridge.ts
 *
 * One tower, placed twice (east and west). Map frame: x across the bridge,
 * y along it, z up, metres; origin on the ground at the tower's centre.
 * Placed at bearing 100.2°, the deck's direction between the towers.
 * Only the towers: the deck, the main cables and the hangers are left to
 * the map, as the batch brief asks. (The cables would have to sag 50 m
 * over a deck the map draws on the ground, so they would float.)
 *
 * What makes it the Vincent Thomas Bridge: the two tall, slender green
 * steel towers, each two box legs tied by a deep strut at the top over a
 * double-X braced panel, another double-X panel two-thirds of the way up
 * above the deck, a strut under the deck, and two more X panels below it.
 *
 * Sources:
 * - Position: OSM has no tower nodes (way/1011852501 is the bridge's area,
 *   mistagged cable-stayed). Both towers from the LA County 2020 lidar
 *   surface model on a 1.5 m grid along the deck (bearing 280.2°): tower
 *   tops 229.2 m east-south-east and 227.0 m west-north-west of
 *   -118.2714, 33.7495, 456 m apart (published main span 1,500 ft, 457 m);
 *   the tops' cross strut spans 23 m, the deck's centre line 3 m to its
 *   south of that point. USGS NAIP orthophoto: both towers' bracing and
 *   the deck line (100.3° between the tower bases).
 * - One material: the towers are painted one green all over, saddles too.
 * - Heights (lidar): tower tops 111–112 m (east) and 107–111 m (west);
 *   deck at the towers 56–57 m. Ground (USGS 3DEP) 4.5–4.6 m at the east
 *   tower, 1.6–2.8 m at the west. One model serves both, so its top is
 *   108.5 m over its lowest ground: within a metre of each tower.
 * - Published: towers 365 ft (111 m) above the water (Wikipedia "Vincent
 *   Thomas Bridge"; Caltrans).
 * - Photos (Wikimedia Commons): "Vincent Thomas Bridge (2008) 01" and
 *   "(2008) 02" (Nandaro, CC BY-SA 3.0; the west tower from San Pedro, below
 *   the deck, and both towers); "The Vincent Thomas Bridge" (Busition, CC
 *   BY-SA 4.0); "Vincent Thomas Bridge 2026-08" (Jengod, CC BY-SA 4.0; both
 *   towers broadside from the south); "VTbridge2009" (Regular Daddy, CC
 *   BY-SA 3.0); "Vincent Thomas Bridge-2" (Nitro101, CC BY 2.0; a tower from
 *   the deck); "Vincent Thomas Bridge aerial view" (US Coast Guard, public
 *   domain; from above).
 * - Estimated from photos, scaled by the lidar: the legs' section (3.4 x
 *   4.0 m at the foot, 2.8 x 3.0 m at the top), every strut's and panel's
 *   height, members about a metre wide.
 * - Colour: the towers' green from daylight photos, pulled to the
 *   palette's lightness.
 */
import { Part, writeGlb } from './mesh'
import { finish } from './palette'
import { beam, countDrawn, rect } from './la-pacific-wheel'

const steel = new Part()
const X = 10.0        // leg centres either side of the deck's centre line
const TOP = 107.2     // leg tops, under the cable saddles
const H = 108.5       // saddle tops

// Legs: tapering box columns, chamfered.
for (const s of [-1, 1]) {
  beam(steel, [s * X, 0, 0], [s * X, 0, TOP], rect(2.0, 1.7, 0.35), rect(1.5, 1.4, 0.3), [1, 0, 0])
  // Cable saddle housing on each leg top.
  beam(steel, [s * X, -2.4, TOP + 0.65], [s * X, 2.4, TOP + 0.65], rect(1.3, 0.65, 0.2), rect(1.3, 0.65, 0.2), [0, 0, 1])
}
/** Leg centre at height z (the legs taper inward only in section, so x is fixed). */
const legX = (s: number) => s * X

/** A horizontal strut between the legs, depth d (z) and thickness t (y). */
const strut = (z0: number, z1: number, t = 1.6) =>
  beam(steel, [legX(-1) + 1.2, 0, (z0 + z1) / 2], [legX(1) - 1.2, 0, (z0 + z1) / 2], rect((z1 - z0) / 2, t / 2, 0.15), rect((z1 - z0) / 2, t / 2, 0.15), [0, 1, 0])

/** A double-X braced panel between z0 and z1: struts top and bottom, two Xs between. */
function panel(z0: number, z1: number) {
  strut(z0, z0 + 1.5)
  strut(z1 - 1.5, z1)
  const a = z0 + 1.1, b = z1 - 1.1, xl = legX(-1) + 1.1, xr = legX(1) - 1.1, xm = 0
  for (const [x0, x1] of [[xl, xm], [xm, xr]]) {
    beam(steel, [x0, 0, a], [x1, 0, b], rect(0.7, 0.7, 0.15), rect(0.7, 0.7, 0.15), [0, 1, 0])
    beam(steel, [x0, 0, b], [x1, 0, a], rect(0.7, 0.7, 0.15), rect(0.7, 0.7, 0.15), [0, 1, 0])
  }
}

// Top: a deep strut over a double-X panel.
strut(103.6, TOP, 2.2)
panel(96.8, 103.6)
// Above the deck, about two-thirds of the way up.
panel(75.5, 81.5)
// Under the deck: the strut it rests on.
strut(46.5, 49.5, 2.4)
// Below the deck: two more panels.
panel(26.5, 34.0)
panel(8.6, 16.0)

const GREEN = finish('bridge-green', 0x52a88c, 0.7)
const parts = [{ part: steel, material: GREEN }]
const triangles = countDrawn(parts)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Vincent Thomas Bridge tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: H, bearing: 100.2,
})
await Bun.write(new URL('../models/la-vincent-thomas-bridge.glb', import.meta.url), glb)
console.log(`la-vincent-thomas-bridge.glb: ${triangles} triangles, ${glb.length} bytes`)
