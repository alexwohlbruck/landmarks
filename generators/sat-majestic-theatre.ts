/**
 * Majestic Theatre and Majestic Building, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-majestic-theatre.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * lidar grid's centre, OSM's outline centroid (way/100056523, "Towers at
 * the Majestic": -98.4907015, 29.4261583). y = 0 is the street, flat
 * round the block (2017 lidar ground).
 *
 * John Eberson, 1929: an atmospheric movie palace with a 15-storey office
 * building (now apartments) along East Houston Street in front of it, one
 * building in OSM. The street front: buff brick upper floors over a pale
 * terra-cotta base, a sidewalk arcade of dark green columns, and the
 * marquee: a red "MAJESTIC" panel under a stepped pediment, over a white
 * letter board, outlined in bulbs.
 *
 * Measured (lidar USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above y = 0):
 * - the office building along Houston Street (x -20..30, y 10..24.5):
 *   wings 50 m, the central section (x -6..14) 59.5 m;
 * - the theatre behind it (y -24..9) about 25 m; the west strip along the
 *   alley 14 m.
 * From photos (all of the street front; no licensed photo shows the
 * whole tower or its top): the arcade, the marquee and its colours, the
 * pale base and the brick.
 * Estimated: the marquee's size and place (20 m wide, 8.6 m tall with
 * its pediment, centred on the tower's middle section, scaled from the
 * arcade's bays in the photos), the arcade's depth, the floor heights (3.4 m), the base band
 * (to 12 m). The tile roof the brief mentions is not in the lidar (the
 * roofs are flat) nor in any licensed photo, so it is not drawn.
 * Left out: the marquee's lettering (a plain lit panel, per STYLE.md:
 * marquees are plain boxes unless the sign is the landmark), the bulbs,
 * the theatre's interior.
 *
 * OSM: way/100056523 (outline) and its part way/1225918339 (the tower,
 * 60 m), replaced. OSM's node/368162724 (the theatre) is a point.
 *
 * Night: the marquee's panel is `neon` in its red; windows `window`.
 *
 * Photos (all EVIDENCE):
 * - "Sign as seen in San Antonio, Texas.jpg", NVCStudent2021, CC BY-SA 4.0 (Commons)
 * - "Majestic Theater (1 of 1).jpg", Renelibrary, CC BY-SA 4.0 (Commons)
 * - "Majestic (12).JPG", Zereshk, CC BY 3.0 (Commons; night)
 * - "The Majestic Theatre - San Antonio", TravelingOtter, CC BY-SA 2.0,
 *   https://www.flickr.com/photos/14146962@N07/3059569759
 * - Carol M. Highsmith's photo via pingnews.com, public domain,
 *   https://www.flickr.com/photos/39735679@N00/481790635
 * No look-only sources used.
 *
 * Doubts: the tower's upper floors and top have no licensed photo; their
 * massing is the lidar's and the facade continues the brick of the lower
 * floors.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, capPoly, box, bayPanels, type XY } from './sat-frost-tower'

const brick = new Part()
const stone = new Part()
const win = new Part()
const roofP = new Part()
const neon = new Part()
const arcade = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const rect = (x0: number, x1: number, y0: number, y1: number): XY[] => ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
const FL = 3.4, BASE = 12

// the theatre and the alley strip (brick)
for (const [P, h] of [[rect(-30, 30, -24, 10), 25], [rect(-30, -20, 10, 24.5), 14]] as [XY[], number][]) {
  walls(brick, P, 0, h)
  capPoly(roofP, P, h, true)
}
// the office building: pale base, brick above, the higher middle section
for (const [x0, x1, h] of [[-20, -6, 50], [-6, 14, 59.5], [14, 30, 50]] as [number, number, number][]) {
  const P = rect(x0, x1, 10, 24.5)
  walls(stone, P, 0, BASE)
  walls(brick, P, BASE, h - 1.2)
  walls(stone, P, h - 1.2, h)
  capPoly(roofP, P, h, true)
  const bands: [number, number][] = []
  for (let z = BASE + 0.8; z + 2 * FL - 1.4 <= h - 1.6; z += 2 * FL) bands.push([z, z + 2 * FL - 1.4])
  bayPanels(win, P, bands, 1.8, 1.4, 3, (i) => {
    const a = P[i], b = P[(i + 1) % 4]
    return Math.abs(a[1] - b[1]) > 1 && Math.abs(a[0] - (-20)) > 0.1 && Math.abs(a[0] - 30) > 0.1 // no panels on the inner side walls
  })
}
// windows in the pale base, above the arcade
bayPanels(win, rect(-20, 30, 10, 24.5), [[6.6, 10.6]], 1.8, 1.4, 3, (i) => i !== 2)

// The sidewalk arcade: a dark recess along the Houston Street front and
// its columns.
{
  const y = 24.56
  const q = (x0: number, x1: number, z0: number, z1: number, yy: number) => {
    tf(arcade, [x0, yy, z0], [x1, yy, z0], [x1, yy, z1], [0, 1, 0])
    tf(arcade, [x0, yy, z0], [x1, yy, z1], [x0, yy, z1], [0, 1, 0])
  }
  q(-20, 30, 0, 5.2, y)
  for (let x = -18; x <= 28.1; x += 4.6) box(arcade, x, 24.9, 0.35, 0.35, 0, 5.4)
}
// The marquee: a red lit panel under a stepped pediment, the white letter
// board below it, standing out over the arcade.
{
  const x0 = -5, x1 = 15, y0 = 24.7, y1 = 26.5
  box(stone, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2, 5.6, 9.8)
  box(neon, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 - 1.6, (y1 - y0) / 2 + 0.05, 9.8, 12.4)
  // the pediment: a low gable over the red panel
  const cx = (x0 + x1) / 2, yf = y1 + 0.06, yb = y0
  tf(neon, [x0 + 1.6, yf, 12.4], [x1 - 1.6, yf, 12.4], [cx, yf, 14.2], [0, 1, 0])
  tf(neon, [x0 + 1.6, yb, 12.4], [cx, yb, 14.2], [x1 - 1.6, yb, 12.4], [0, -1, 0])
  tf(neon, [x0 + 1.6, yf, 12.4], [cx, yf, 14.2], [cx, yb, 14.2], [-1, 0, 1])
  tf(neon, [x0 + 1.6, yf, 12.4], [cx, yb, 14.2], [x0 + 1.6, yb, 12.4], [-1, 0, 1])
  tf(neon, [x1 - 1.6, yf, 12.4], [x1 - 1.6, yb, 12.4], [cx, yb, 14.2], [1, 0, 1])
  tf(neon, [x1 - 1.6, yf, 12.4], [cx, yb, 14.2], [cx, yf, 14.2], [1, 0, 1])
}

// Colours from daylight photos, pulled to the palette's lightness.
const parts = [
  { part: brick, material: finish('majestic-brick', 0xd8c09a) },
  { part: stone, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roofP, material: PALETTE.roof },
  { part: neon, material: finish('neon-majestic-red', 0xc8423c) },
  { part: arcade, material: finish('majestic-arcade', 0x66756f) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Majestic Theatre', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 59.5, anchor: [29.4261583, -98.4907015], replaces: ['way/100056523', 'way/1225918339'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-majestic-theatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
