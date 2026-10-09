/**
 * The air traffic control tower at Harry Reid International Airport, Las
 * Vegas (FAA, completed 2016): a fluted sandstone shaft whose four ribs
 * flare out under a pale faceted bulb of equipment floors, topped by the
 * glass cab and its roof. Procedural, CC0-1.0.
 * bun generators/lv-las-tower.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0 (the shaft's ribs
 * stand at the corners, the flutes face the compass). The origin is the
 * centroid of the OSM outline, way/340018195, a 16 m circle.
 *
 * Measured, from OSM: the shaft's 16 m footprint; height 109 m
 * (way/340018195, building:levels 28).
 *
 * Measured, from photos, scaled by the 109 m total and the 16 m shaft:
 * - p2 "LAS LAS VEGAS TOWER CONTROL (10509713443).jpg", Eric Salard, CC
 *   BY-SA 2.0 (from the south-west across the apron): the shaft to 78 m,
 *   flaring over its top 8 m; the bulb about 23 m across from 78 to 102 m, with
 *   window bands at its foot and two thirds of the way up; the cab;
 * - p3 "LAS ATC & Viewing Tower.jpg", Noah Wulf, CC BY-SA 4.0 (from the
 *   east): the four ribs and the flutes between them, the bulb's facets
 *   narrowing in to the cab, and the cab's roof;
 * - p1 "LAS Control Tower (5997073831).jpg" and p4 "New LAS Control Tower
 *   under construction... (6890232105)", Tomás Del Coro, CC BY-SA 2.0: the
 *   shaft's warm sandstone against the pale bulb.
 *
 * Estimated: the flutes' width and depth (5.2 m, 2 m), the bulb's octagon
 * and its exact profile, the cab's size (13 m across, 4.5 m of glass), the
 * window bands' heights. The lower buildings round the base
 * (way/340018196, way/340018197) are left to the map.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, save, type XY } from './lv-wynn'

const shaft = new Part()
const flute = new Part()
const bulb = new Part()
const band = new Part() // window bands on the bulb, and the cab glass
const roof = new Part()

/** The shaft's plan at scale s: a 16 m square with chamfered rib corners and a flute in each face. */
function shaftRing(s: number): XY[] {
  const h = 8 * s, c = 1.6 * s, f = 2.6 * s, d = 2
  // One quarter, from the middle of the east face round to the middle of the north face.
  const q: XY[] = [[h - d, 0], [h - d, f], [h, f], [h, h - c], [h - c, h], [f, h], [f, h - d], [0, h - d]]
  const out: XY[] = []
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, ca = Math.cos(a), sa = Math.sin(a)
    for (const [x, y] of q.slice(0, -1)) out.push([x * ca - y * sa, x * sa + y * ca])
  }
  return out
}
const lift = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])
/** Loft rings (all the same length, ccw) into a part, wound outward. */
function loft(p: Part, rings: V3[][]) {
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < rings[k].length; i++) {
      const j = (i + 1) % rings[k].length
      p.quad(rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i])
    }
}

// The shaft: a slight flare at the foot, straight to 70 m, then the ribs
// spreading out under the bulb.
const SHAFT_TOP = 78
// The flutes' backs are a shade darker, as the shadowed recesses read in
// every photo; the ribs and the flutes' side walls are the plain sandstone.
{
  const levels = [[1.06, 0], [1.0, 8], [1.0, 70], [1.06, 74], [1.12, SHAFT_TOP]]
  const rings = levels.map(([s, z]) => lift(shaftRing(s), z))
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) {
    const back = 8 * levels[k][0] - 2 // a flute back's distance from the axis
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, a = rings[k][i], b = rings[k][j]
      const onBack = (q: V3) => Math.abs(Math.max(Math.abs(q[0]), Math.abs(q[1])) - back) < 0.01
      ;(onBack(a) && onBack(b) ? flute : shaft).quad(a, b, rings[k + 1][j], rings[k + 1][i])
    }
  }
}
// Its top, under the bulb's floor.
cap(shaft, shaftRing(1.12), SHAFT_TOP)

/** A regular octagon of circumradius r, flat faces on the compass. */
const oct = (r: number): XY[] => Array.from({ length: 8 }, (_, i) => {
  const a = ((i + 0.5) * Math.PI) / 4
  return [Math.cos(a) * r, Math.sin(a) * r] as XY
})

// The bulb, as stacked octagonal frusta: [circumradius, z0, z1, part].
const R = 12.6
const tiers: [number, number, number, number, Part][] = [
  [12.4, R, SHAFT_TOP, 81, bulb], // flaring out
  [R, R, 81, 83, band], // the lower window band
  [R, R, 83, 93, bulb],
  [R, R, 93, 94.6, band], // the upper window band
  [R, R, 94.6, 98, bulb],
  [R, 10, 98, 102, bulb], // narrowing in to the cab
]
for (const [r0, r1, z0, z1, p] of tiers) loft(p, [lift(oct(r0), z0), lift(oct(r1), z1)])
// The bulb's underside, from the shaft out to its foot.
// A flat soffit is enough: the shaft covers its middle.
cap(bulb, oct(12.4), SHAFT_TOP - 0.01, false)
cap(roof, oct(10), 102)

// The cab: glass, with its overhanging roof and a small plant room on top.
loft(band, [lift(oct(7), 102), lift(oct(7.6), 106.5)])
loft(roof, [lift(oct(8.4), 106.5), lift(oct(8.4), 107.6)])
cap(roof, oct(8.4), 106.5, false)
cap(roof, oct(8.4), 107.6)
loft(bulb, [lift(oct(4), 107.6), lift(oct(4), 109)])
cap(roof, oct(4), 109)

await save('lv-las-tower', 'Harry Reid International Airport control tower', [
  { part: shaft, material: finish('las-sandstone', 0xc4917a) },
  { part: flute, material: finish('las-sandstone-shade', 0xb07d66) },
  { part: bulb, material: PALETTE.stone },
  { part: band, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
], 109, 'Y up, -Z north, +X east, metres; origin at the way/340018195 centroid; bearing 0')
