/**
 * Paris Las Vegas: the hotel tower, the Arc de Triomphe, the Montgolfier
 * balloon sign, the Opéra and Louvre fronts on the Strip and the casino
 * podium. Procedural, CC0-1.0.
 * bun generators/lv-paris-resort.ts
 *
 * The resort's Eiffel Tower is not here: it is its own placement of the
 * eiffel-tower model (paris-las-vegas-eiffel-tower, which replaces
 * way/27831699). This model draws no tower and does not list that way. The
 * Opéra and Louvre fronts stay outside the tower's footprint; the casino
 * podium runs under its legs, as the real casino does and as the plain
 * casino extrusion did before.
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the casino outline
 * runs true north-south. The origin is the area centroid of the resort's
 * outline, way/33974140.
 *
 * Published (Wikipedia, "Paris Las Vegas"; Joel Bergman, 1999): a
 * 34-storey hotel tower; replicas of the Arc de Triomphe at two-thirds
 * scale, the Louvre and the Paris Opera House on the Strip front; the
 * Montgolfier balloon sign, 23 m (75 ft) across. Two-thirds of the real
 * Arc (49.5 m high, 44.8 m wide, 22.2 m deep, central arch 29.2 m high)
 * gives 33 m high, 29.9 m wide, 14.8 m deep and a 19.5 m arch crown, which
 * OSM's footprint confirms; the model is built to those figures.
 *
 * Measured, from OSM: the casino outline; the tower's X plan and its 112 m
 * (way/27831697, mistagged "Le Boulevard At Paris"); the Arc's two piers
 * and attic (way/114697072, way/114697073, way/114697074), 29.3 m across
 * and 15.2 m deep with an 11.6 m opening; the balloon's position
 * (way/364846544) and its 46 m height (the OSM note); the Opéra block with
 * its rounded end to the Strip (way/114722037); the Louvre wing, the
 * outline's Strip-side arm north of the tower. The USGS NAIP orthophoto
 * (public domain) confirms the X, the Arc astride the drive, the Opéra's
 * rotunda and the Louvre wing's slate roof.
 *
 * Photos (Wikimedia Commons):
 * - "The hotel Paris Las Vegas as seen from the hotel The Bellagio.jpg",
 *   Jürgen Matern, CC BY-SA 3.0: the tower from the west, its cream walls
 *   and slate teal-blue mansards with taller end pavilions, the Opéra, the
 *   Louvre front, the Arc and the balloon;
 * - "LasVegas - ParisLasVegas.jpg", Jean-Christophe Benoist, CC BY 3.0:
 *   the Opéra's arcaded front, its raised centre and low dome, the slate
 *   mansard of the tower behind;
 * - "Paris Las Vegas (hotel and casino on the Las Vegas Strip).jpg",
 *   Roland Arhelger, CC BY-SA 4.0: the Opéra rotunda and its pavilions;
 * - "Hotel Paris with triumphal arch in Las Vegas 2013.jpg", Tuxyso,
 *   CC BY-SA 3.0: the Arc's east face and an arm end of the tower;
 * - "The Strip (2026)-L1000592.jpg", Frank Schulenburg, CC BY-SA 4.0, and
 *   "Paris Las Vegas. (30647833152).jpg", Bernard Spragg, CC0: the
 *   balloon, bright blue with gold bands, on its sign box.
 *
 * Estimated: the tower's cornice at 98 m with the mansards to 107 m and the
 * end pavilions to OSM's 112 m; the podium at 15 m, stepping down to an 8 m
 * terrace along the Strip so the fronts stand clear; the Opéra's cornice at
 * 20 m, its raised centre at 27 m and rotunda dome to 30.6 m; the Louvre
 * front's cornice at 19 m and pavilion at 26 m; the balloon's profile and
 * sign box. The slate is sampled from the sunlit mansard in the Matern
 * photo and pulled to the palette's lightness. Left out: statues, the
 * green-patina roof details, dormers, the porte-cochère canopy, signs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  type XY, type Facade, band, cap, ccw, chamfer, edgeFacade, edges, extrude, facade, hip, hipAt, lathe, offset, panel, prism, triangleCount, walls,
} from './lv-caesars-palace'

const stone = new Part() // cream walls
// Cornices, belts and the Arc's entablature share the stone: the balloon's
// blue needs the sixth material, and the bands read by their projection.
const trim = stone
const win = new Part() // window bays, the sign box's screens
const blue = new Part() // slate mansards, pavilion roofs and domes
const balloon = new Part() // the balloon's blue
const flat = new Part() // flat roofs
const gold = new Part() // the balloon's bands

// ---------------------------------------------------------- the casino
// way/33974140, simplified to 0.8 m. The casino is 15 m high, but along
// the Strip it drops to an 8 m terrace so that the Opéra and Louvre fronts
// stand clear of it, as they do in the photos; the two pieces together are
// exactly the outline.
const PODIUM = 15
const main: XY[] = [[-133.4, -43.3], [-139.3, -43.4], [-139.3, 35.7], [-167.5, 35.7], [-167.5, 78.7], [-64.2, 78.3], [-63.9, 83.5], [128.8, 83.4], [132.6, 79.6], [148.5, 79.8], [148.6, 72.9], [147.2, 72.9], [147.7, -97.0], [-14.1, -96.7], [-14.1, -101.8], [-56.0, -101.5], [-55.6, -68.8], [-56.5, -62.6], [-58.3, -56.6], [-64.4, -45.8], [-73.2, -37.0], [-84.1, -31.0], [-90.6, -29.1], [-104.1, -28.3], [-117.1, -31.6], [-128.6, -38.6]]
prism(stone, flat, main, 0, PODIUM)
const TERRACE = 8
prism(stone, flat, [[-139.3, -43.4], [-139.5, -54.3], [-174.5, -54.5], [-174.2, -1.4], [-167.5, -1.6], [-167.0, 35.7], [-139.3, 35.7]], 0, TERRACE)
prism(stone, flat, [[-167.5, 35.7], [-180.9, 35.9], [-181.7, 78.8], [-167.5, 78.7]], 0, TERRACE)

// ---------------------------------------------------------- the hotel tower
// An X of four 18.6 m arms (way/27831697), cream, with a blue mansard all
// round and taller pavilion roofs on the arm ends.
const X: XY[] = [[-60.8, 65.1], [-47.6, 78.0], [-4.8, 34.9], [5.0, 35.0], [49.5, 79.7], [64.2, 65.3], [21.0, 21.8], [21.2, 12.7], [64.1, -30.9], [49.4, -45.2], [6.7, -1.7], [-3.3, -1.7], [-46.2, -44.0], [-60.1, -30.1], [-17.2, 12.2], [-17.2, 21.1]]
const HC = 98, MANSARD = 9, PAVILION = 14
const ends: { c: XY; u: XY }[] = [
  { c: [-54.2, 71.55], u: [-0.7112, 0.7026] },
  { c: [56.85, 72.5], u: [0.7083, 0.7054] },
  { c: [56.75, -38.05], u: [0.7112, -0.7026] },
  { c: [-53.15, -37.05], u: [-0.7083, -0.7054] },
]
{
  const p = chamfer(X, 0.5)
  walls(stone, p, 0, HC - 1.6)
  const BAYS = { bay: 6.4, pier: 3.8, group: 13, spandrel: 1.6, minEdge: 7 }
  for (const e of edges(p)) {
    if (e.L < 7) continue
    const isEnd = e.L > 15 && e.L < 22
    // Arm ends: one window bay either side of the round bay in the middle.
    if (isEnd) edgeFacade(win, e.a, e.b, 17, 82, { bay: 9.3, pier: 6.6, group: 13, spandrel: 1.6 })
    else edgeFacade(win, e.a, e.b, 17, 82, BAYS)
    edgeFacade(win, e.a, e.b, 84.6, HC - 2.4, isEnd ? { bay: 9.3, pier: 6.6, group: 99, spandrel: 0, arch: 4 } : { ...BAYS, group: 99, spandrel: 0, arch: 4 })
  }
  band(trim, p, 0.4, 15.4, 16.4)
  band(trim, p, 0.4, 82.6, 83.6)
  band(trim, p, 0.7, HC - 1.6, HC, true)
  // Round full-height bays on the arm ends, capped with a small dome.
  for (const { c, u } of ends) {
    const r = 3.2, seg = 8, v: XY = [-u[1], u[0]]
    const pt = (i: number): XY => {
      const a = (Math.PI * i) / seg
      return [c[0] + u[0] * r * Math.sin(a) + v[0] * r * Math.cos(a), c[1] + u[1] * r * Math.sin(a) + v[1] * r * Math.cos(a)]
    }
    const half: XY[] = Array.from({ length: seg + 1 }, (_, i) => pt(i))
    for (let i = 0; i < seg; i++) {
      // half's points run from +v round the outside to -v: clockwise from above, so wind the wall the other way.
      const a = half[i + 1], b = half[i]
      stone.quad([...a, PODIUM], [...b, PODIUM], [...b, HC + 1.5], [...a, HC + 1.5])
    }
    cap(trim, half, HC + 1.5)
  }
  // Mansards on the two bars of the X, pavilion roofs on the four ends.
  for (const [m, u, a] of [[[1.28, 16.75], [0.7112, -0.7026], 78], [[1.85, 17.73], [0.7083, 0.7054], 77.6]] as [XY, XY, number][])
    hipAt(blue, flat, m, u, a - 0.2, 9.5, HC, MANSARD, 3.6)
  for (const { c, u } of ends) hipAt(blue, flat, [c[0] - u[0] * 9.4, c[1] - u[1] * 9.4], u, 9.6, 9.9, HC, PAVILION, 4.2)
}

// ---------------------------------------------------------- the Strip front
// The Opéra and the Louvre front: arcaded stone with a ground-floor arcade
// and tall round-headed windows above, a cornice, a slate mansard band in
// the tower's roof material, and a raised central pavilion with a hip roof.
// Both stay inside the casino outline and clear of the Eiffel Tower's
// footprint (way/27831699), which is that placement's, not this model's.
const ARCADE: Facade = { bay: 4.6, pier: 1.4, group: 99, spandrel: 0, minEdge: 3.5, arch: 6 }
const PIANO: Facade = { bay: 4.6, pier: 2.2, group: 99, spandrel: 0, minEdge: 3.5, arch: 6 }
/** An arcaded block to its cornice at z1, with a mansard band rising `m` above it. */
function frontBlock(plan: XY[], z1: number, m: number) {
  walls(stone, plan, 0, z1)
  facade(win, plan, 1, Math.min(8, z1 * 0.42), ARCADE)
  facade(win, plan, Math.min(8, z1 * 0.42) + 2, z1 - 2, PIANO)
  band(trim, plan, 0.5, z1 - 1.2, z1)
  const r = ccw(plan), o = offset(r, -2.8)
  blue.loft([r.map(([x, y]): V3 => [x, y, z1]), o.map(([x, y]): V3 => [x, y, z1 + m])])
  cap(flat, o, z1 + m)
}
/** A raised pavilion: taller walls to z1 and a hip roof `h` high. */
function pavilion(x0: number, x1: number, y0: number, y1: number, z1: number, h: number) {
  const r: XY[] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  walls(stone, r, 0, z1)
  facade(win, r, z1 - 9, z1 - 2, { ...PIANO, minEdge: 6 })
  band(trim, r, 0.5, z1 - 1.2, z1)
  hip(blue, null, x0, x1, y0, y1, z1, h)
}

// The Opéra, way/114722037: a 24 x 28 m block with its rotunda to the Strip.
{
  const opera: XY[] = [[-163.6, -41.9], [-163.6, -45.8], [-139.6, -45.8], [-139.5, -17.5], [-163.5, -17.4], [-163.5, -22.2], [-170.3, -25.5], [-172.1, -28.5], [-172.7, -33.0], [-169.7, -39.2]]
  frontBlock(opera, 20, 4.5)
  // the raised centre, across the block from the south front to the north
  pavilion(-156, -147, -46.6, -16.7, 27, 5)
  // the rotunda on the rounded end, with its low dome
  lathe([stone, trim, blue], [-163.5, -31.4], [[9.3, 0], [9.3, 23], [9.8, 24.2], [8.6, 24.6], [6.5, 28.6], [0, 30.6]].map(([r, z]) => [r, z]) as [number, number][], 16)
}
// The Louvre front, north of the tower's legs: the casino outline's Strip
// wing (x -181.7 to -167, y 36 to 78), kept to y >= 37 to stay clear of the
// Eiffel Tower's footprint, with a raised pavilion in its middle.
{
  frontBlock([[-181.3, 37], [-167.5, 37], [-167.5, 78.2], [-181.3, 78.2]], 19, 4.5)
  pavilion(-182, -166.8, 52.5, 62.5, 26, 6)
}

// ---------------------------------------------------------- the Arc de Triomphe
// A U-shaped profile across the drive, extruded 15.2 m east-west; the
// opening is a true semicircle. The entablature is a trim band; the side
// arches through the piers are drawn as recessed panels.
{
  const Y0 = -93.6, Y1 = -64.3, X0 = -106.1, X1 = -90.9, H = 33
  const CY = (Y0 + Y1) / 2, OW = 11.6, SPRING = 13.7, SEG = 10
  const prof: [number, number][] = [[0, 0], [CY - OW / 2 - Y0, 0], [CY - OW / 2 - Y0, SPRING]]
  for (let i = 1; i < SEG; i++) {
    const a = Math.PI - (Math.PI * i) / SEG
    prof.push([CY - Y0 + (OW / 2) * Math.cos(a), SPRING + (OW / 2) * Math.sin(a)])
  }
  prof.push([CY + OW / 2 - Y0, SPRING], [CY + OW / 2 - Y0, 0], [Y1 - Y0, 0], [Y1 - Y0, 24.4], [0, 24.4])
  // s runs north along the Arc from its south end; the solid extends east.
  // u = north, so the extrusion goes to the right of north: east.
  extrude(stone, stone, [X0, Y0], [0, 1], prof, X1 - X0)
  // entablature and attic
  const top: XY[] = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]]
  band(trim, top, 0.6, 24.4, 26)
  prism(stone, flat, top, 26, H - 1)
  band(trim, top, 0.4, H - 1, H, true)
  // The side arches through the piers, as round-headed panels in the
  // roof grey on the north and south faces (5.6 m wide, crown at 12.5 m).
  const mx = (X0 + X1) / 2
  panel(flat, [mx - 2.8, Y0 - 0.06], [mx + 2.8, Y0 - 0.06], 0, 12.5, 8)
  panel(flat, [mx + 2.8, Y1 + 0.06], [mx - 2.8, Y1 + 0.06], 0, 12.5, 8)
}

// ---------------------------------------------------------- the balloon sign
// On way/364846544: an 11 m pier, a 9 m sign box with screens on its four
// faces, and the balloon, blue with a gold band low on its belly, to 46 m.
{
  const C: XY = [-184.0, -99.7]
  lathe([stone], C, [[3.4, 0], [3.4, 10], [5.5, 11]], 12)
  const B = 8.2, Z0 = 11, Z1 = 20
  const box: XY[] = [[C[0] - B, C[1] - B], [C[0] + B, C[1] - B], [C[0] + B, C[1] + B], [C[0] - B, C[1] + B]]
  walls(trim, box, Z0, Z1)
  cap(trim, box, Z1)
  cap(trim, box, Z0, false)
  for (const e of edges(box)) edgeFacade(win, e.a, e.b, Z0 + 1, Z1 - 1, { bay: 99, pier: 2, group: 99, spandrel: 0 })
  // The balloon, from its neck on the box to the crown.
  lathe([gold, balloon, balloon, balloon, gold, balloon, balloon, gold, balloon, gold], C, [
    [3.0, 20], [3.6, 21.6], [7.1, 25], [9.4, 28.4], [10.5, 30.2], [11.3, 32.4], [11.5, 35.5], [10.8, 38.6], [9.7, 40.6], [7.0, 43.4], [0, 46],
  ], 16)
}

// ---------------------------------------------------------- write
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: win, material: PALETTE.window },
  { part: blue, material: finish('paris-slate', 0x65859b) },
  { part: flat, material: PALETTE.roof },
  { part: gold, material: finish('paris-gold', 0xd8b663) },
  { part: balloon, material: finish('paris-balloon', 0x5f8cc8) },
]
const triangles = triangleCount(parts)
console.log(parts.map((p) => `${p.material.name} ${p.part.triangles}`).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Paris Las Vegas', parts, {
  license: 'CC0-1.0',
  height: 112,
  frame: 'Y up, -Z north, +X east, metres; origin at the way/33974140 centroid; bearing 0',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/lv-paris-resort.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
