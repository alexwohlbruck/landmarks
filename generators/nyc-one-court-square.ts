/**
 * One Court Square (the Citigroup / Citicorp Building), Long Island City,
 * Queens. Skidmore, Owings & Merrill (Raul de Armas), completed 1989-90.
 * Procedural, CC0-1.0.
 *   bun generators/nyc-one-court-square.ts
 *
 * A square 50-storey slab of blue-green glass whose corners are notched in
 * two 4.6 m steps the whole way up, so each face reads as three planes,
 * topped by a stepped pyramid: four 7.8 m tiers, each two storeys, stepping
 * in by a notch at a time to a square top. The facade is one glass curtain
 * wall: a teal `window` wall with pale floor lines every three storeys and
 * three mullion lines on each broad face (6 m bays).
 *
 * Map frame: x along 104 degrees, y along 14 degrees (the outline's axes),
 * z up, metres; placed at bearing 14. Origin at the centroid of OSM
 * way/281342538 (building=office, "Citigroup Building", alt_name One Court
 * Square).
 *
 * Plan and tiers (OSM): the outline, and 35 building:part ways laid on a
 * 7 x 7 grid of the notch lines (x -25.2, -20.6, -16.0, -11.4, 12.6, 17.1,
 * 21.7, 26.3; y -26.0, -21.2, -16.4, -11.7, 11.6, 16.3, 21.1, 25.8). Their
 * heights fall by 7.5 m per grid step from the 200 m core: the crown is a
 * diamond ziggurat in plan, 170 / 177.5 / 185 / 192.5 / 200. The SE corner
 * cell is chamfered (a triangle part), as OSM draws it.
 * Measured (USGS NY_NewYorkCity lidar, 2017, 1 m grid), above the street
 * (3.5-4.0 m over the box's lowest return): tiers at 169.7, 177.5, 185.3,
 * 193.3 and 200.8 m, so OSM's tiers stand within 0.5 m; used as measured.
 * A few returns to 205 m on the core are the rooftop sign (Optimum, before
 * that Altice and Citi), which is left out; Wikipedia gives 673 ft (205 m)
 * to its top. The low block on the west front (in the outline, no part)
 * is the entrance portal; lidar returns there reach about 21 m.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - o1 "Citicorp Building by David Shankbone.jpg", David Shankbone,
 *   CC BY 2.5: the whole tower from the south-west, notched corners.
 *   https://commons.wikimedia.org/wiki/File:Citicorp_Building_by_David_Shankbone.jpg
 * - o4 "One Court Square 018.jpg", Kidfly182, CC BY 4.0: the stepped crown.
 *   https://commons.wikimedia.org/wiki/File:One_Court_Square_018.jpg
 * - o5 "One Court Square 024.jpg" and o6 "One Court Square 047.jpg",
 *   Kidfly182, CC BY 4.0: the crown's notches and the glass colour.
 *   https://commons.wikimedia.org/wiki/File:One_Court_Square_024.jpg
 *   https://commons.wikimedia.org/wiki/File:One_Court_Square_047.jpg
 * - o3 "44th Dr Crescent St Hunter St td (2023-06-26) 12 - One Court
 *   Square.jpg", Tdorante10, CC BY-SA 4.0: the entrance portal's dark frame.
 *   https://commons.wikimedia.org/wiki/File:44th_Dr_Crescent_St_Hunter_St_td_(2023-06-26)_12_-_One_Court_Square.jpg
 * - o7 "Long Island City New York October 2016.jpg", King of Hearts,
 *   CC BY-SA 4.0: the tower over the LIC skyline from the river.
 *   https://commons.wikimedia.org/wiki/File:Long_Island_City_New_York_October_2016.jpg
 *
 * Estimated: floor lines every three storeys (3.4 m each, 169.7 m over 50
 * storeys); the portal's frame proportions (o3). Colours from the daylight
 * photos, the glass pulled lighter.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const glass = new Part(), roof = new Part(), trim = new Part(), frame = new Part(), door = new Part()

const XS = [-25.2, -20.6, -16.0, -11.4, 12.6, 17.1, 21.7, 26.3]
const YS = [-26.0, -21.2, -16.4, -11.7, 11.6, 16.3, 21.1, 25.8]
// lidar tiers above the street
const TIER = [169.7, 177.5, 185.3, 193.3, 200.8]
/** Height of cell (c, r), 0 for none: 200.8 at the centre, a tier lower per grid step. */
function H(c: number, r: number): number {
  if (c < 0 || r < 0 || c > 6 || r > 6) return 0
  const d = Math.abs(c - 3) + Math.abs(r - 3)
  return d <= 4 ? TIER[4 - d] : 0
}
type XY = [number, number]
/** A cell's ring, counter-clockwise; the SE corner cell is cut on the diagonal. */
function ring(c: number, r: number): XY[] {
  const x0 = XS[c], x1 = XS[c + 1], y0 = YS[r], y1 = YS[r + 1]
  if (c === 6 && r === 2) return [[x0, y0], [x1, y1], [x0, y1]]
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
}

const FLOOR = 169.7 / 50
/** A wall from a to b (outside on the right as seen from above) between z0 and z1, with floor lines. */
function wall(a: XY, b: XY, z0: number, z1: number) {
  if (z1 <= z0) return
  glass.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n: XY = [(b[1] - a[1]) / L * 0.06, -(b[0] - a[0]) / L * 0.06]
  for (let k = 3; k * FLOOR < 169; k += 3) {
    const z = k * FLOOR
    if (z < z0 + 0.5 || z + 0.55 > z1) continue
    trim.quad([a[0] + n[0], a[1] + n[1], z], [b[0] + n[0], b[1] + n[1], z], [b[0] + n[0], b[1] + n[1], z + 0.55], [a[0] + n[0], a[1] + n[1], z + 0.55])
  }
  // vertical mullion lines about 6 m apart on the broad middle faces
  if (L > 20) for (let k = 1; k < 4; k++) {
    const t = k / 4, m: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], u: XY = [(b[0] - a[0]) / L * 0.18, (b[1] - a[1]) / L * 0.18]
    trim.quad([m[0] - u[0] + n[0], m[1] - u[1] + n[1], z0], [m[0] + u[0] + n[0], m[1] + u[1] + n[1], z0], [m[0] + u[0] + n[0], m[1] + u[1] + n[1], z1], [m[0] - u[0] + n[0], m[1] - u[1] + n[1], z1])
  }
  // the crown tiers: a pale line at each step's foot, and a lip at the top
  if (z0 > 160) trim.quad([a[0] + n[0], a[1] + n[1], z0 + 0.0], [b[0] + n[0], b[1] + n[1], z0], [b[0] + n[0], b[1] + n[1], z0 + 0.6], [a[0] + n[0], a[1] + n[1], z0 + 0.6])
  trim.quad([a[0] + n[0], a[1] + n[1], z1 - 0.7], [b[0] + n[0], b[1] + n[1], z1 - 0.7], [b[0] + n[0], b[1] + n[1], z1], [a[0] + n[0], a[1] + n[1], z1])
}

for (let c = 0; c < 7; c++) for (let r = 0; r < 7; r++) {
  const h = H(c, r)
  if (!h) continue
  const R = ring(c, r)
  // top
  for (let i = 1; i < R.length - 1; i++) roof.tri([R[0][0], R[0][1], h], [R[i][0], R[i][1], h], [R[i + 1][0], R[i + 1][1], h])
  // walls: each edge against the neighbour across it
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    let nh = 0
    if (Math.abs(a[1] - b[1]) < 1e-6 && a[0] < b[0] && a[1] === YS[r]) nh = H(c, r - 1) // south
    else if (Math.abs(a[1] - b[1]) < 1e-6 && a[0] > b[0]) nh = H(c, r + 1) // north
    else if (Math.abs(a[0] - b[0]) < 1e-6 && a[1] < b[1]) nh = H(c + 1, r) // east
    else if (Math.abs(a[0] - b[0]) < 1e-6 && a[1] > b[1]) nh = H(c - 1, r) // west
    else nh = 0 // the chamfer
    if (c === 6 && r === 2 && nh) nh = nh // the chamfered cell's north edge meets its neighbour
    // walls are emitted counter-clockwise, so the outside is on the right
    wall(a, b, nh, h)
  }
}
// the chamfered cell's neighbours: the cells south and east of it are empty,
// and the cell west of it (5, 2) and north (6, 3) are taller, so nothing else.

// The entrance portal on the west front: a dark frame round a tall glass
// screen (o3), in the outline's bump (x -30.8 to -25.2, y -3.4 to 3.4).
{
  const x0 = -30.8, x1 = -25.2, y0 = -3.4, y1 = 3.4, top = 21
  const box = (p: Part, ax: number, ay: number, bx: number, by: number, z0: number, z1: number) => {
    const rr: V3[] = [[ax, ay, z0], [bx, ay, z0], [bx, by, z0], [ax, by, z0]]
    p.loft([rr, rr.map(([x, y]) => [x, y, z1] as V3)])
    p.cap(rr.map(([x, y]) => [x, y, z1] as V3), true)
  }
  box(frame, x0, y0, x1, y0 + 1.2, 0, top)
  box(frame, x0, y1 - 1.2, x1, y1, 0, top)
  box(frame, x0, y0, x1, y1, top - 2.2, top)
  // the glass screen and the doors, set back in the frame
  const xs = x0 + 0.8
  glass.quad([xs, y1 - 1.2, 4.2], [xs, y0 + 1.2, 4.2], [xs, y0 + 1.2, top - 2.2], [xs, y1 - 1.2, top - 2.2])
  door.quad([xs, y1 - 1.2, 0], [xs, y0 + 1.2, 0], [xs, y0 + 1.2, 4.2], [xs, y1 - 1.2, 4.2])
  // the sides of the recess
  for (const [ya, yb] of [[y0 + 1.2, y0 + 1.2], [y1 - 1.2, y1 - 1.2]]) {
    const s = ya < 0 ? 1 : -1
    if (s > 0) frame.quad([x0, ya, 0], [xs, ya, 0], [xs, yb, top - 2.2], [x0, yb, top - 2.2])
    else frame.quad([xs, ya, 0], [x0, ya, 0], [x0, yb, top - 2.2], [xs, yb, top - 2.2])
  }
  frame.quad([x0, y0 + 1.2, top - 2.2], [x0, y1 - 1.2, top - 2.2], [xs, y1 - 1.2, top - 2.2], [xs, y0 + 1.2, top - 2.2])
}

const parts = [
  { part: glass, material: { name: 'window', color: 0x5f9095, roughness: 0.35 } },
  { part: trim, material: finish('mullion', 0xd3dfdd) },
  { part: roof, material: PALETTE.roof },
  { part: frame, material: finish('portal-dark', 0x4a4f57) },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('One Court Square', parts, {
  license: 'CC0-1.0', bearing: 14, elevation: 0, height: 200.8,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/281342538'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-one-court-square.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
