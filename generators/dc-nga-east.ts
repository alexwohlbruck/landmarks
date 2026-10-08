/**
 * National Gallery of Art, East Building — procedural, CC0-1.0, no textures.
 * bun generators/dc-nga-east.ts
 *
 * Map frame: x east, y north, z up, metres. The anchor is the area centroid
 * of the OSM outline way/66418590 (lng -77.0166233, lat 38.8912353). Its
 * 4th Street, Madison Drive and 3rd Street walls sit 0.5° anticlockwise of
 * the compass, so the model is placed at bearing 359.5 and built square to
 * them.
 *
 * What it is: I. M. Pei's building of 1974–78 on the trapezoid left over
 * between 4th Street, Madison Drive, 3rd Street and Pennsylvania Avenue,
 * cut by a diagonal into two triangles. The isosceles triangle, its base on
 * 4th Street facing the West Building and its axis on the West Building's,
 * holds the galleries: a flat-topped parallelogram tower at each of its
 * three corners, a lower bridge between the two west towers over the
 * recessed entrance (the H of the west front), a lower range along
 * Pennsylvania Avenue with a roof terrace, and the atrium in the middle under
 * a glass space frame of tetrahedral pyramids. The right triangle holds the
 * study centre (CASVA): a full-height bar along the diagonal that ends in
 * the 19° knife-edge corner at 4th Street and Madison Drive, a tower at the
 * 3rd Street end, and lower, glazed office floors with terraces between
 * them on Madison Drive. A slot about 9 m wide separates the two triangles
 * at both ends. All of it is clad in the West Building's pink Tennessee
 * marble, almost windowless.
 *
 * Covers and replaces: the outline way/66418590 and all ten building:parts
 * (relation/6345236's parts: the three towers, the two bridges, the atrium
 * body, the CASVA bar and tower, its lower floors and the high slab). The
 * plaza's glass pyramids and fountain (over the underground concourse, not
 * buildings in OSM) and the separate buildings way/910190978 and
 * way/916497458 are not modelled.
 *
 * Evidence
 * - OSM (measured): outline 117 × 83 m; the west face (x -51.5) 83 m long,
 *   the south face (y -33.5) 117 m; the towers' parallelograms (west towers
 *   x -51.5 to -25.65, 19 m deep along 4th Street; the apex tower a rhombus
 *   from x 2 to 53.4 on the axis y 13.3); the bridges at 9.5–18 m; the
 *   slots; heights: towers, bar and CASVA tower 33, bridges and atrium body
 *   18, the CASVA's west block 28–30, its lower floors (OSM 30) see below.
 * - Published: Wikipedia, "National Gallery of Art" and "East Building"
 *   pages; NGA: Pei, 1978; the atrium of 16,000 sq ft under a skylight of
 *   tetrahedral glass pyramids on a space frame, on the West Building's
 *   axis; the same Tennessee marble; the two hexagonal Tower Galleries
 *   (2016) under skylights; a rooftop terrace; the knife-edge corner at
 *   19°.
 * - Photos (Wikimedia Commons): "National Gallery of Art - East Building
 *   (55255091092).jpg" (ajay_suresh, CC BY 4.0) and "East Building of the
 *   National Gallery of Art, 2019.jpg" (Difference engine, CC BY-SA 4.0),
 *   the west front square on; "National-Gallery-of-Art-East-Building-I-M-
 *   Pei-National-Mall-Washington-DC-Apr-2014.jpg" (Gunnar Klack, CC BY-SA
 *   4.0), from 4th Street and Madison Drive, the knife edge; "NGA-
 *   EastBldg.jpg" (David Monack, CC BY-SA 3.0 US), the Pennsylvania Avenue
 *   front from above, with the atrium skylight seen through the gap;
 *   "National Gallery of Art - East Building.JPG" and "East Building -
 *   National Gallery of Art.JPG" (AgnosticPreachersKid, CC BY-SA 3.0), the
 *   Madison Drive side and the CASVA's glazed floors and terraces; "View of
 *   landmarks - Newseum terrace.JPG" (same), from the north-west, high.
 * - USGS NAIP orthophoto (public domain): the plan of the atrium's space
 *   frame, the towers' hexagonal skylights, the roof terrace.
 * - Measured from the west-front photo against the towers' 33 m: the
 *   bridge between 9.5 and 18 m (as OSM); from the Pennsylvania Avenue photo,
 *   the north range's wall top at about 19.5 m and the space frame's peaks at
 *   about 24 m.
 * - Estimated: the CASVA's lower floors (OSM tags them 30 m; the photos show
 *   them about 17 m with a terrace, a balcony slab and a glass band), the
 *   atrium frame's lattice (9.5 m) and pyramid height (3 m), the skylights'
 *   sizes, the recess of the ground-floor glazing under the north range.
 *   The two triangles' long edges are drawn parallel (19.3° and 19.8° in
 *   OSM) and the isosceles one exactly symmetrical about its axis.
 * - Simplified: the atrium's frame members, the west entrance's sculpture,
 *   the CASVA tower's recessed loggia (drawn as a window band) and the
 *   rooftop sculpture garden's planting are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE } from './palette'
import { NGA_MARBLE, type XY, ccw, orient, pcap, poffset, ppanel, pslab, pwalls, saveModel } from './dc-nga-west'

const stone = new Part(), roof = new Part(), glass = new Part(), win = new Part(), door = new Part()

// ---- Plan.
const X0 = -51.5, XI = -25.65, X1 = 65.6, Y0 = -33.45 // 4th St, the towers' inner face, 3rd St, Madison Dr
const AX = 13.3, HALF = 36.75, AXX = 53.4 // the isosceles triangle: axis, half base, apex x
const S = HALF / (AXX - X0) // its edges' slope, 19.3°
const top = (x: number) => AX + HALF - S * (x - X0) // its north edge (Pennsylvania Avenue)
const bot = (x: number) => AX - HALF + S * (x - X0) // its south edge
const TS = 0.36 // the CASVA diagonal's slope, 19.8°
const ltop = (x: number) => Y0 + TS * (x - X0) // the bar's north face, from the knife edge
const BAR = 8.0 // the bar's thickness, north–south
const lbot = (x: number) => ltop(x) - BAR
const DEPTH = 18.95 // the west towers' length along 4th Street

// ---- Heights.
const H = 33.0, BRIDGE0 = 9.5, BRIDGE1 = 18.0, FRAME = 21.0, PEAK = 24.0

// The three gallery towers: parallelograms at the triangle's corners.
const nw: XY[] = [[X0, top(X0)], [X0, top(X0) - DEPTH], [XI, top(XI) - DEPTH], [XI, top(XI)]]
const sw: XY[] = [[X0, bot(X0)], [XI, bot(XI)], [XI, bot(XI) + DEPTH], [X0, bot(X0) + DEPTH]]
const AW = 2.1, AM = (AW + AXX) / 2
const apex: XY[] = [[AW, AX], [AM, AX - S * (AXX - AM)], [AXX, AX], [AM, AX + S * (AXX - AM)]]
// The north range along Pennsylvania Avenue, between the NW and apex towers.
const north: XY[] = [[XI, top(XI)], [XI, top(XI) - DEPTH], [AW, AX], [apex[3][0], apex[3][1]]]
// The west bridge over the entrance, and the lobby behind it.
const XB = -40.15
const westLink: XY[] = [[X0, bot(X0) + DEPTH], [XI, bot(XI) + DEPTH], [XI, top(XI) - DEPTH], [X0, top(X0) - DEPTH]]
// The atrium, under the space frame.
const atrium: XY[] = [[XI, ltop(XI)], [40.7, ltop(40.7)], [apex[1][0], apex[1][1]], [AW, AX], [XI, top(XI) - DEPTH]]
// The CASVA: the bar from the knife edge to 3rd Street with the tower at
// its east end; its west block; its lower floors.
// The bar and its west block make one full-height wall along Madison Drive
// from the knife edge to x = 8 (OSM has the block's roof at 28–30 m; the
// photos from 4th Street show no step at the top, so it is drawn at 33).
const XT = 44.1, XW = 8.0
const casva: XY[] = [[X0, Y0], [XW, Y0], [XW, lbot(XW)], [XT, lbot(XT)], [XT, -25.3], [X1, Y0], [X1, ltop(X1)]]
const casvaLow: XY[] = [[XW, Y0], [XT, Y0], [XT, lbot(XT)], [XW, lbot(XW)]]

// ---- The masses.
/** A marble prism with a soft top edge and a flat roof. */
const mass = (ring: XY[], z0: number, z1: number, cap: Part | boolean = roof, bottom = false) => pslab(stone, ring, z0, z1, 0.3, cap, bottom)
mass(nw, 0, H)
mass(sw, 0, H)
mass(apex, 0, H)
mass(casva, 0, H)

// The bridges: 9.5–18 m, with the glazing set back under them.
{
  mass(westLink.map(([x, y]) => [x, y] as XY), BRIDGE0, BRIDGE1, roof, true)
  // the lobby behind the entrance: solid from the ground east of the recess
  const lobby: XY[] = [[XB, bot(XB) + DEPTH], [XI, bot(XI) + DEPTH], [XI, top(XI) - DEPTH], [XB, top(XB) - DEPTH]]
  pwalls(stone, lobby, 0, BRIDGE0)
  // the entrance: a glazed wall at the back of the deep, shaded recess, and
  // the doors in the middle of it, lit at night
  ppanel(win, [XB, top(XB) - DEPTH], [XB, bot(XB) + DEPTH], 0.04, 0.96, 0, BRIDGE0 - 1.4, 0.05)
  ppanel(door, [XB, top(XB) - DEPTH], [XB, bot(XB) + DEPTH], 0.36, 0.64, 0, 3.6, 0.09)
  mass(north, BRIDGE0, BRIDGE1, roof, true)
  // under the north range, a glass wall 2.5 m behind its face
  const inner = poffset(north, -2.5)
  pwalls(win, [inner[0], inner[1], inner[2], inner[3]].map(([x, y]) => [x, y] as XY), 0, BRIDGE0)
}

// ---- The atrium: walls to the frame's springing, then the glass space
// frame, a lattice of tetrahedral pyramids along the triangle's own lines.
pslab(stone, atrium, 0, FRAME, 0.0, false)
pcap(glass, atrium, FRAME, true)
{
  const a = 9.5, b = a * S
  const inside = (p: XY) => {
    const R = ccw(atrium)
    for (let i = 0; i < R.length; i++) {
      const u = R[i], v = R[(i + 1) % R.length]
      if ((v[0] - u[0]) * (p[1] - u[1]) - (v[1] - u[1]) * (p[0] - u[0]) < -0.3) return false
    }
    return true
  }
  // P(i, j) = O + i·(a, b) + j·(a, -b): lines along both diagonals; the
  // third side of each cell is north–south, like the west wall.
  const O: XY = [XI, AX]
  const P = (i: number, j: number): XY => [O[0] + a * (i + j), O[1] + b * (i - j)]
  for (let i = -6; i < 20; i++) for (let j = -6; j < 20; j++) {
    for (const tri of [[P(i, j), P(i + 1, j), P(i, j + 1)], [P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)]] as XY[][]) {
      if (!tri.every(inside)) continue
      const c: V3 = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3, PEAK]
      for (let k = 0; k < 3; k++) {
        const p = tri[k], q = tri[(k + 1) % 3]
        const mx = (p[0] + q[0]) / 2 - c[0], my = (p[1] + q[1]) / 2 - c[1]
        orient(glass, [[p[0], p[1], FRAME + 0.05], [q[0], q[1], FRAME + 0.05], c], [mx, my, 1])
      }
    }
  }
}

// ---- Skylights on the three gallery towers: low glass hexagons.
function hexLight(par: XY[], acute: [number, number]) {
  const inset = poffset(par, -3.2)
  const R = ccw(inset)
  // chop each acute corner at a third of its two edges
  const hex: XY[] = []
  R.forEach((p, i) => {
    const isAcute = acute.some((k) => {
      const q = ccw(par)[k]
      return Math.hypot(q[0] - p[0], q[1] - p[1]) < 12
    })
    if (!isAcute) { hex.push(p); return }
    const prev = R[(i + R.length - 1) % R.length], next = R[(i + 1) % R.length]
    hex.push([p[0] + (prev[0] - p[0]) / 3, p[1] + (prev[1] - p[1]) / 3])
    hex.push([p[0] + (next[0] - p[0]) / 3, p[1] + (next[1] - p[1]) / 3])
  })
  const z0 = H + 0.02, z1 = H + 0.9
  const cx = hex.reduce((s, p) => s + p[0], 0) / hex.length, cy = hex.reduce((s, p) => s + p[1], 0) / hex.length
  const upper = hex.map(([x, y]) => [cx + (x - cx) * 0.62, cy + (y - cy) * 0.62] as XY)
  glass.loft([hex.map(([x, y]) => [x, y, z0] as V3), upper.map(([x, y]) => [x, y, z1] as V3)])
  pcap(glass, upper, z1, true)
}
/** Indices (in counter-clockwise order) of a ring's acute corners. */
function acuteCorners(par: XY[]): [number, number] {
  const R = ccw(par), out: number[] = []
  R.forEach((p, i) => {
    const a = R[(i + R.length - 1) % R.length], b = R[(i + 1) % R.length]
    const u = [a[0] - p[0], a[1] - p[1]], v = [b[0] - p[0], b[1] - p[1]]
    if (u[0] * v[0] + u[1] * v[1] > 0) out.push(i)
  })
  return [out[0], out[1]]
}
for (const par of [nw, sw, apex]) hexLight(par, acuteCorners(par))

// ---- The CASVA's lower floors on Madison Drive: a broad glass band, a
// balcony slab over it, a set-back glazed storey and a terrace on top.
{
  const LOW = 13.0, UP = 17.0
  mass(casvaLow, 0, LOW)
  const back = casvaLow.map(([x, y]) => [x, y] as XY)
  const set: XY[] = [[XW, Y0 + 3], [XT, Y0 + 3], back[2], back[3]]
  mass(set, LOW, UP)
  // glass: ground to the balcony on Madison Drive, then the upper band
  ppanel(win, [XW, Y0], [XT, Y0], 0.06, 0.97, 1.6, LOW - 1.8, 0.05)
  ppanel(win, [XW, Y0 + 3], [XT, Y0 + 3], 0.04, 0.97, LOW + 0.7, UP - 1.2, 0.05)
  // the balcony slab, standing out over the glass
  const slab: XY[] = [[XW + 1.0, Y0 - 1.4], [XT - 0.4, Y0 - 1.4], [XT - 0.4, Y0 + 0.01], [XW + 1.0, Y0 + 0.01]]
  pslab(stone, slab, LOW - 1.6, LOW - 0.6, 0.2, true, true)
}
// The CASVA tower's loggia, a recessed window band high on its east face.
ppanel(win, [X1, Y0], [X1, ltop(X1)], 0.18, 0.82, 23.5, 28.5, 0.05)

await saveModel('dc-nga-east', 'National Gallery of Art, East Building', [
  { part: stone, material: NGA_MARBLE },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], { source: 'generators/dc-nga-east.ts', bearing: 359.5, osm: 'way/66418590', footprint: [117.1, 83.3], height: H }, 6500)
