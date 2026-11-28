/**
 * Weston Centre, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-weston-centre.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is OSM's
 * outline centroid (way/153735913: -98.4923359, 29.4284243), which the
 * lidar grid was centred on. y = 0 is the lowest street beside the tower
 * (4.4 m above the 2017 lidar's lowest return, on the south; the north
 * street is 1 m higher).
 *
 * Opened 1989 (3D/International; the city's tallest office tower). A
 * 32-storey slab of rose-tan granite with a grid of punched windows. Its
 * north face is sheer to the top; on the west, east and south the tower
 * steps back in four tiers of about two storeys each, and its southern
 * corners are notched in a sawtooth of 4 m steps, so the whole top reads
 * as a stepped ziggurat. An open steel frame stands on the roof.
 *
 * Published: 135.2 m (444 ft), 32 storeys (Wikipedia, "List of tallest
 * buildings in San Antonio").
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the tower's plan: north face y 19.5, west x -32.5, east x 23.5, south
 *   y -15.5 between sawtooth corners of four 4 m steps;
 * - the tiers: 106.6 m (full plan), 114.6 (in 4 m on the west, east and
 *   south), 122.6 (in 8 m, 7 m on the south), the roof 130.1 m (in 12.5 m
 *   on the west, 10.5 m on the east, 7 m on the south);
 * - the frame on the roof to 138.6 m, about 19 by 15 m;
 * - the podium round the south and east (the rest of OSM's outline) about
 *   15.6 m.
 * From photos: the granite's colour, the window grid (drawn as broad
 * panels three storeys high, per STYLE.md, not single windows), the stepped shoulders on the long faces, the open frame.
 * Estimated: storey height (4.06 m), window bay widths, the frame's member
 * size (1.2 m) and the podium's facade.
 *
 * OSM: way/153735913 (outline, 32 levels, no parts). The model draws the
 * tower and its podium over the whole outline, so only it is replaced.
 * OSM's outline is turned about 2 degrees from the lidar's and runs a
 * step further east and south than the tower: that is the podium.
 *
 * Night: the office windows are `window`; the frame on the roof is not lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "San Antonio Weston Centre.jpg", Tenticle, CC BY 3.0
 * - "WestonCentersantx.JPG", Sahmeditor, public domain (the stepped top and frame)
 * - "Downtown San Antonio, Texas, with the prominent Weston Centre office
 *   building ... LCCN2014632649.tif" and "...2650.tif", Carol M. Highsmith,
 *   public domain (from the Tower of the Americas)
 * - "Sunset between Weston Centre and the former Wyndham San Antonio River
 *   Walk.jpg", Corey Leopold, CC BY 2.0
 * No look-only sources used.
 *
 * Doubts: the podium's facade (photos show little of it); the tiers'
 * insets on the east are read from one lidar profile.
 */
import { Part, writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, offset, bayPanels, box, type XY } from './sat-frost-tower'

const granite = new Part()
const win = new Part()
const roofP = new Part()
const steel = new Part()
const podium = new Part()

/**
 * The tower's plan at a tier: north face fixed, west, east and south edges
 * moved in, the two southern corners notched in four 4 m steps.
 */
function plan(xw: number, xe: number, ys: number, yn = 19.5): XY[] {
  // offsets of the sawtooth from the south-west corner: four 4 m steps
  const steps: XY[] = [[0, 15.5], [4, 15.5], [4, 11.5], [8, 11.5], [8, 7.5], [12, 7.5], [12, 3.5], [16, 3.5], [16, 0]]
  const sw = steps.map(([u, v]): XY => [xw + u, ys + v])
  const se = steps.slice().reverse().map(([u, v]): XY => [xe - u, ys + v])
  return ring([[xw, yn], ...sw, ...se, [xe, yn]])
}

const TIERS: { xw: number; xe: number; ys: number; z0: number; z1: number }[] = [
  { xw: -32.5, xe: 23.5, ys: -15.5, z0: 15.6, z1: 106.6 },
  { xw: -28.5, xe: 19.5, ys: -11.5, z0: 106.6, z1: 114.6 },
  { xw: -24.5, xe: 15.5, ys: -8.5, z0: 114.6, z1: 122.6 },
  { xw: -20.0, xe: 13.0, ys: -8.5, z0: 122.6, z1: 130.1 },
]
const FL = 4.06
for (const [k, t] of TIERS.entries()) {
  const P = plan(t.xw, t.xe, t.ys)
  walls(granite, P, k === 0 ? 0 : t.z0, t.z1)
  // a slight parapet lip and the terrace roof
  capPoly(roofP, offset(P, -0.05), t.z1, true)
  // windows: three storeys a panel, broad bays of 3.4 m with 1.3 m piers
  // and a 1.9 m spandrel between groups
  const bands: [number, number][] = []
  const zStart = k === 0 ? 19.5 : t.z0 + 1.0
  for (let z = zStart; z + 3 * FL - 1.9 <= t.z1 - 0.8; z += 3 * FL) bands.push([z, z + 3 * FL - 1.9])
  if (k > 0 && !bands.length) bands.push([t.z0 + 1.0, t.z1 - 1.2])
  bayPanels(win, P, bands, 3.4, 1.3, 3.5)
}
// The podium: the rest of OSM's outline, moved into this frame.
{
  const OUT = ring([
    [31.3, 15.8], [22.5, 15.4], [22.3, 19.8], [-5.5, 18.6], [-33.8, 17.5], [-33.0, -1.4], [-28.4, -1.2], [-28.1, -6.3],
    [-23.5, -6.1], [-23.3, -10.6], [-18.7, -10.4], [-18.5, -14.9], [-13.9, -14.7], [-13.7, -19.4], [-8.8, -19.2],
    [-8.6, -23.8], [-3.8, -23.6], [-3.6, -27.9], [10.2, -27.3], [10.0, -22.8], [14.6, -22.6], [14.4, -17.9],
    [19.2, -17.7], [19.0, -13.1], [23.2, -12.9], [23.0, -8.4], [27.4, -8.2], [27.2, -3.5], [32.1, -3.3],
  ])
  walls(podium, OUT, 0, 15.6)
  capPoly(roofP, OUT, 15.6, true)
  bayPanels(win, OUT, [[4.2, 7.6], [9.0, 13.6]], 2.4, 1.6, 3.5)
}
// The open frame on the roof: four corner posts and a ring of beams.
{
  const x0 = -14, x1 = 5, y0 = -1, y1 = 14, T = 0.6, Z0 = 130.1, Z1 = 138.6
  for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) box(steel, x, y, T, T, Z0, Z1)
  box(steel, (x0 + x1) / 2, y0, (x1 - x0) / 2 + T, T, Z1 - 1.4, Z1)
  box(steel, (x0 + x1) / 2, y1, (x1 - x0) / 2 + T, T, Z1 - 1.4, Z1)
  box(steel, x0, (y0 + y1) / 2, T, (y1 - y0) / 2, Z1 - 1.4, Z1)
  box(steel, x1, (y0 + y1) / 2, T, (y1 - y0) / 2, Z1 - 1.4, Z1)
}

// Colours from daylight photos, pulled to the palette's lightness: the
// granite a warm mauve-brown (it reads dark brown in two of the three
// photos, rose only in low sun), clearly darker than the Marriott's; dark
// glass; the podium a shade lighter; the frame grey steel.
const parts = [
  { part: granite, material: finish('weston-granite', 0xa8897d) },
  { part: podium, material: finish('weston-podium', 0xb89e91) },
  { part: win, material: { name: 'window', color: 0x58616d, roughness: 0.35 } },
  { part: roofP, material: PALETTE.roof },
  { part: steel, material: finish('weston-frame', 0x8e9399) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Weston Centre', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 138.6, anchor: [29.4284243, -98.4923359], replaces: ['way/153735913'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-weston-centre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
