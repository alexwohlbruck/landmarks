/**
 * San Antonio Museum of Art (the Lone Star Brewery), San Antonio:
 * procedural, CC0-1.0.
 * bun generators/sat-museum-of-art.ts
 *
 * Map frame: built turned to bearing 137, the complex's long axis (OSM's
 * outline, checked on the lidar), so local +y runs south-east along it and
 * +x to the south-west; metres, z up. The origin is the lidar grid's
 * centre (OSM's outline centroid, way/78602493: -98.4820781, 29.4373424).
 * y = 0 is the street level round the complex (2017 lidar ground, flat
 * within a metre; the River Walk on the east is lower and outside it).
 *
 * The Lone Star Brewery, 1895-1904 (E. Jungenfeld & Co.), converted to the
 * museum in 1981 (Cambridge Seven Associates): a long run of buff brick
 * brewery buildings with round-arched windows, castle-like, rising to two
 * towers with crenellated parapets and corner turrets, the south-east one
 * crowned by a lookout turret, joined high up by a glass skybridge.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0), in the local frame:
 * - the north-west tower (y 15..33): roof 21.5 m, parapet 26.5 m;
 * - the south-east tower (y -33..-12): roof 29 m, parapet 32 m, its
 *   lookout turret to 35.5 m;
 * - the skybridge between them at about 22 m (y -9..12, on x 0);
 * - the halls between and beyond: 11 m (the link under the skybridge),
 *   15.5-18.7 m (the blocks next to the towers), 8-12 m at the south-east
 *   end, 13 m for the north-west wing and 7 m for the west wing.
 * From photos: the buff brick, the arched windows, the parapets and
 * turrets, the skybridge.
 * Estimated: the plan of each block (rectangles fitted to the lidar in the
 * turned frame, inside OSM's outline), turret sizes (2.6 m), the window
 * rhythm (two storeys a panel).
 * Left out: the red brick arch trim, the crenellation's merlons (too fine;
 * the parapet is drawn as a band), the glass atrium addition, signs.
 *
 * OSM: way/78602493 (outline, no parts), replaced. The building north-east
 * of it (way/78603594) and the one to the south-west (way/296801781) are
 * separate and left to the map; the lidar block north-west of the
 * outline's end belongs to the former is not drawn.
 *
 * Night: windows `window`; the towers' brick is floodlit; the skybridge
 * glass is dark.
 *
 * Photos (all EVIDENCE):
 * - "SAMA (1).JPG", Zereshk, CC BY-SA 3.0 (Commons)
 * - "San Antonio Museum of Art (16652192717).jpg", Nan Palmero, CC BY 2.0 (Commons; the tower)
 * - "San Antonio Museum of Art (2015-03-12 18.38.28 by Nan Palmero).jpg", CC BY 2.0 (Commons)
 * - "FirstLoneStarBrewery.JPG", public domain (Commons; both towers and the skybridge)
 *
 * Doubts: the blocks' plans are read from the lidar only; which tower
 * carries the lookout turret is read from the lidar's highest returns.
 */
import { Part, writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, box, bayPanels, type XY } from './sat-frost-tower'

const brick = new Part()
const win = new Part()
const roofP = new Part()
const glass = new Part()
const trim = new Part()

const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const FL = 4.2
function block(x0: number, x1: number, y0: number, y1: number, h: number, wins = true) {
  const P = rect(x0, x1, y0, y1)
  walls(brick, P, 0, h - 0.8)
  walls(trim, P, h - 0.8, h)
  capPoly(roofP, P, h, true)
  if (!wins) return
  const bands: [number, number][] = []
  for (let z = 1.5; z + 2 * FL - 1.6 <= h - 1.6; z += 2 * FL) bands.push([z, z + 2 * FL - 1.6])
  bayPanels(win, P, bands, 1.6, 2.2, 4)
}
/** A castle tower: brick shaft, a parapet band, corner turrets. */
function tower(x0: number, x1: number, y0: number, y1: number, roof: number, parapet: number) {
  block(x0, x1, y0, y1, roof)
  const P = rect(x0, x1, y0, y1)
  walls(brick, P, roof, parapet - 0.6)
  walls(trim, P, parapet - 0.6, parapet)
  walls(brick, [...rect(x0 + 0.5, x1 - 0.5, y0 + 0.5, y1 - 0.5)].reverse(), roof, parapet)
  for (const [x, y] of P) box(brick, x, y, 1.3, 1.3, roof, parapet + 2.6)
  for (const [x, y] of P) box(trim, x, y, 1.5, 1.5, parapet + 2.6, parapet + 3.1)
}

// north-west end and its wing
block(-6, 18, 63, 93, 15.5)
block(-33, -1, 49, 63, 13.0)
block(-3, 12, 42, 63, 15.5)
// the north-west tower and the hall south of it
tower(-6, 15, 15, 33, 21.5, 26.5)
block(-9, 15, 33, 42, 16.0)
// the link under the skybridge
block(-3, 15, -9, 15, 11.0)
// the south-east tower with its lookout turret
tower(0, 18, -33, -12, 29.0, 32.0)
box(brick, 14.5, -24, 2.4, 2.4, 32.0, 35.5)
box(trim, 14.5, -24, 2.8, 2.8, 35.5, 36.1)
// the south-east halls
block(0, 18, -60, -33, 18.7)
block(0, 20, -90, -60, 11.5)
// the west wing and its taller south end
block(-28, -11, -30, 8, 7.0)
block(-25, -11, -42, -30, 13.0)

// the skybridge: a glass gallery high between the towers
{
  const x0 = -1.6, x1 = 1.6, y0 = -12, y1 = 15, z0 = 19.5, z1 = 22.5
  const P = rect(x0, x1, y0, y1)
  walls(glass, P, z0, z1)
  capPoly(trim, P, z1, true)
  capPoly(trim, P, z0, false)
}

// Colours from daylight photos, pulled to the palette's lightness.
const lit = (p: [number, number, number], n: [number, number, number]) => (n[2] > 0.7 ? 0.1 : p[2] > 14 ? 0.7 : 0.25)
const parts = [
  { part: brick, material: { ...finish('sama-brick', 0xdecca2), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: roofP, material: PALETTE.roof },
  { part: glass, material: { name: 'glass', color: 0x6f8aa0, roughness: 0.24 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('San Antonio Museum of Art', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 137, elevation: 0, height: 36.1, anchor: [29.4373424, -98.4820781], replaces: ['way/78602493'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-museum-of-art.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
