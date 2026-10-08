/**
 * Trump International Hotel Las Vegas (2008): a gold-glass slab with
 * stepped ends and a white crown. Procedural, CC0-1.0.
 * bun generators/lv-trump.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the slab runs east
 * to west within 0.5° in OSM, so the model is built square to north. The
 * origin is the area centroid of the hotel's outline, way/111380666
 * (36.129512, -115.172629).
 *
 * Published (Wikipedia, "Trump International Hotel Las Vegas"): 64
 * storeys, 622 ft (190 m), opened 2008; clad in glass with 24-carat gold
 * in it. OSM tags the tower part (way/111380664) 195 m, 64 levels,
 * building:colour=gold, material=mirror; the published 190 m is used.
 *
 * Measured, from OSM: the tower part, way/111380664, is symmetric about
 * its middle (−1.8, 8.1): 35.3 m deep at the middle, stepping in to 32.4 m
 * at ±20 m and 29.2 m at ±30 m out to the ends at ±40 m, and each end
 * face carries a bay 10.4 m wide and 2 m proud. The base, way/111380666,
 * is the outline round it: the pool deck to the south, the porte-cochère
 * block beyond it, the lobby wing to the east. The USGS NAIP orthophoto
 * (public domain) confirms the steps and the base.
 *
 * Photos (Wikimedia Commons):
 * - "Trump Hotel Las Vegas.jpg", Noah Wulf, CC BY-SA 4.0: the crown close
 *   up: white panels the full height of the top floors, following every
 *   step; gold glass with pale floor lines; the steps read as bright gold
 *   vertical lines;
 * - "Trump hotel Las Vegas 2009.jpg", ZooFari, public domain: from the
 *   east, the whole slab, proportions and crown;
 * - "Trump hotel, Las Vegas.jpg", Clément Bardot, CC BY-SA 4.0: from the
 *   south-east over Fashion Show, the long south face and its steps;
 * - "Trump International Hotel Las Vegas (21278515756).jpg", Tony Webster,
 *   CC BY 2.0: the south face from the Strip side, the crown;
 * - "Trump International Hotel Las Vegas (Paradise, Nevada).jpg", Raul
 *   Jusinto, CC BY-SA 2.0: the base, a pale two-storey lobby with tall
 *   glazing over it.
 *
 * Measured from the photos (scaled by the published height): the white
 * crown about 14 m. Estimated: the base at 12 m (with the porte-cochère
 * block at 8 m), its window band; the floor lines, drawn every 12 m (four
 * storeys; the real lines are every storey). The gold, a deep mirrored
 * gold, is pulled to the palette's lightness per STYLE.md and matches
 * Mandalay Bay's. The rooftop letters are signage and left out.
 */
import { Part } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { prism, save, strip, ccw, type XY } from './lv-wynn'

const gold = new Part() // gold glass
const line = new Part() // floor lines and the white crown
const white = new Part() // the base's walls
const roof = new Part()
const win = new Part() // the base's glazing

const H = 190, CROWN = 14
const C: XY = [-1.8, 8.1]

// The tower: steps in plan, symmetric about C. [x from, x to, half-depth]
const TIERS: [number, number, number][] = [[0, 20.1, 17.65], [20.1, 30, 16.2], [30, 40.05, 14.6]]
const BAY = { x: 42, h: 5.2 }
function towerPlan(): XY[] {
  const quarter: XY[] = [[BAY.x, 0], [BAY.x, BAY.h], [40.05, BAY.h]]
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const [x0, x1, h] = TIERS[i]
    quarter.push([x1, h], [x0, h])
  }
  // quarter runs from the east axis round to the north axis, ccw
  const full: XY[] = []
  const add = (pts: XY[]) => pts.forEach((p) => {
    const l = full[full.length - 1]
    if (!l || Math.hypot(l[0] - p[0], l[1] - p[1]) > 1e-6) full.push(p)
  })
  add(quarter)
  add([...quarter].reverse().map(([x, y]): XY => [-x, y]))
  add(quarter.map(([x, y]): XY => [-x, -y]))
  add([...quarter].reverse().map(([x, y]): XY => [x, -y]))
  if (Math.hypot(full[0][0] - full[full.length - 1][0], full[0][1] - full[full.length - 1][1]) < 1e-6) full.pop()
  return full.map(([x, y]): XY => [x + C[0], y + C[1]])
}
const TOWER = towerPlan()

prism(gold, null, TOWER, 0, H - CROWN, 0, 0.4)
prism(line, roof, TOWER, H - CROWN, H, 0.5, 0.4) // the crown is the white of the lines

// Pale floor lines on every face long enough to carry them, inset from
// the corners.
{
  const r = ccw(TOWER)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], k = 0.6
    const p: XY = [a[0] + t[0] * k, a[1] + t[1] * k], q: XY = [b[0] - t[0] * k, b[1] - t[1] * k]
    for (let z = 22; z < H - CROWN - 4; z += 12) strip(line, [p, q], z, z + 0.8)
  }
}

// The base, way/111380666: a pale block with a band of glazing; the
// porte-cochère block on the south a little lower. Split along y = −36.5
// from the outline's points, so the two together are the whole outline.
const PORTE: XY[] = [[29.6, -41.8], [17.5, -41.7], [17.4, -54.2], [-22.1, -53.9], [-22.0, -41.4], [-32.8, -41.3], [-32.8, -36.0], [29.6, -36.0]]
const MAIN: XY[] = [
  [41.5, 50.8], [40.9, -36.4], [29.6, -36.4], [-32.8, -36.4], [-32.8, -35.9], [-45.3, -35.8], [-44.8, 24.8], [-37.9, 24.7],
  [-37.9, 33.9], [-26.8, 33.8], [-26.8, 42.9], [-15.7, 42.8], [-15.7, 51.2],
]
prism(white, roof, MAIN, 0, 12, 0.4, 0.4)
prism(white, roof, PORTE, 0, 8, 0.4, 0.4)
for (const [ring, top] of [[MAIN, 12], [PORTE, 8]] as [XY[], number][]) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6 || (Math.abs(a[1] + 36.2) < 0.6 && Math.abs(b[1] + 36.2) < 0.6)) continue // the seam between the two blocks
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], k = 1.2
    strip(win, [[a[0] + t[0] * k, a[1] + t[1] * k], [b[0] - t[0] * k, b[1] - t[1] * k]], 3.5, top - 2)
  }
}

await save('lv-trump', 'Trump International Hotel Las Vegas', [
  { part: gold, material: windowVariant(2, 0xd6b46c) },
  { part: line, material: PALETTE.trim },
  { part: white, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], H, 'Y up, -Z north, +X east, metres; origin at the way/111380666 centroid; bearing 0')
