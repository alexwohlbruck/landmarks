/**
 * 311 South Wacker Drive (1990, Kohn Pedersen Fox), Chicago — original
 * procedural geometry, CC0-1.0.
 * bun generators/chi-311-south-wacker.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/147350208,
 * 41.877462,-87.635751. Its walls run at 358.9° / 88.9°, so the catalog
 * bearing is 358.9 and the model is square to its own frame.
 *
 * Identity, in order: the glass cylinder crown, 32 m tall, ringed by four
 * small glass turrets on square piers at the points of the shaft; the shaft
 * itself, a square whose corners step in so each face reads as a broad
 * arm, in rose granite with window bays; the lower wings on its east side,
 * north and south, to about 51 storeys, crenellated at the top; the low podium and the winter garden's glass roof on Wacker.
 *
 * Evidence:
 *  - plan: OSM. The tower part way/686318733 gives the west faces at 45°
 *    and the tips: the shaft's west flat at x −8.4 (±9.6), the wings' east
 *    face at x 33 and their ends at y ±34. The crown parts give the centre
 *    (11.3, 0.2), the big cylinder r 9.3 (way/1188678576) and the turrets
 *    r 3.2 at 16 m from it (way/1188678581–84); so the shaft's flats sit at
 *    x −8.4 / 31.0, y ±19.7 (symmetric about the crown). Ingvar-fed's photo
 *    straight down from the Willis Tower shows the broad flat faces, the
 *    corners stepping in (OSM draws the steps as its 45° lines), a turret
 *    over the middle of each face and the north wing on the east side.
 *  - heights: 293 m (961 ft) to the top of the crown, published; the
 *    crown cylinder is 105 ft (32 m), published, so it starts at ~261 m.
 *    Turret piers to ~275 m and turrets to ~284 m, and the wings' top at
 *    ~205 m, measured on Hyperion924's view from the north against the
 *    shaft's 39 m width (estimates).
 *  - podium: OSM way/686318734, three levels (~13 m); the winter garden is
 *    85 ft (26 m) tall, one level below ground (published), so its glass
 *    roof is drawn to ~20 m over the west arm (estimate).
 *  - colour: rose granite, pulled light (finish); the crown glass.
 *
 * Photos (Wikimedia Commons): 311_South_Wacker_Drive_(Chicago,_IL)_from_
 * the_top_of_the_Willis_Tower_29Nov2007.JPG (Ingvar-fed, CC BY-SA 3.0);
 * 311_S_Wacker_Dr_081307.jpg (Hyperion924, public domain);
 * 311_South_Wacker_Drive.jpg (Potro, CC BY-SA 4.0); 311_South_Wacker_Drive,
 * _Chicago,_Illinois_(9179394139).jpg and ..._from_Willis_Tower_Skydeck_
 * (9181595420).jpg (Ken Lund, CC BY-SA 2.0); 311_South_Wacker_20190106_
 * 123753.jpg (SecretName101, CC BY 4.0); Sears_(Willis)_Tower_and_311_
 * South_Wacker,_2013-09-21.jpg (Cbaile19, CC0). No commercial imagery.
 *
 * Left out: the vertical notches in the shaft's faces, mullions, the crown's
 * lantern mast, the podium's detail.
 */
import { Part } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, panel, rect, rows, save, walls, type XY } from './chi-aon-center'
import { box, hipRoof } from './chi-board-of-trade'

const granite = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part()

const CX = 11.3, CY = 0.2 // crown centre
const ROOF = 261, PIER = 275, TURRET = 284, TOP = 293, WING = 205, POD = 13

// The shaft: a square 39.4 m across (flats at x −8.4 / 31.0 and y ±19.7
// about the crown) whose corners step in, three steps each, to 19.2 m wide
// arms; OSM simplifies the steps to the 45° lines of its outline.
const F = 19.7, T = 9.6, STEPS = 3
const shaft: XY[] = []
for (let q = 0; q < 4; q++) {
  // One corner, from the end of the south flat round to the start of the
  // east flat, then turned for the others.
  const pts: XY[] = [[T, -F]]
  const d = (F - T) / STEPS
  for (let k = 1; k <= STEPS; k++) pts.push([T + (k - 1) * d, -F + k * d], [T + k * d, -F + k * d])
  const c = Math.cos(q * Math.PI / 2), s = Math.sin(q * Math.PI / 2)
  for (const [x, y] of pts) shaft.push([CX + x * c - y * s, CY + x * s + y * c])
}
// The lower block: the wings on the east side, to y ±34 and x 33, their
// west sides stepping down to the shaft's west face on OSM's 45° lines,
// in the same steps as the shaft's corners.
/** Steps from a to b: each step moves inward (the first axis) then along. */
function stair(a: XY, b: XY, n: number, yFirst: boolean): XY[] {
  const dx = (b[0] - a[0]) / n, dy = (b[1] - a[1]) / n, out: XY[] = []
  for (let k = 0; k < n; k++) {
    const x = a[0] + k * dx, y = a[1] + k * dy
    out.push(yFirst ? [x, y + dy] : [x + dx, y])
    if (k < n - 1) out.push([x + dx, y + dy])
  }
  return out
}
const W0: XY = [CX - F, CY + T], W1: XY = [CX - F, CY - T]
const low: XY[] = [
  [15.5, -34.1], [33, -34.1], [33, 34], [15.5, 34],
  ...stair([15.5, 34], W0, 7, true), W0, W1,
  ...stair(W1, [15.5, -34.1], 7, false),
]

// Podium: the whole outline, three storeys.
const outline: XY[] = [
  [15.5, -34.2], [15.5, -37.0], [17.0, -37.1], [17.0, -44.4], [9.4, -44.4], [9.4, -41.5], [6.3, -38.1], [-17.9, -14.5],
  [-17.8, -10.5], [-58.4, -10.5], [-58.2, 10.5], [-17.9, 10.6], [-17.8, 14.8], [9.3, 41.6], [9.4, 44.5], [16.6, 44.3],
  [16.6, 37.0], [15.4, 37.0], [15.4, 33.8], [33, 33.9], [33, -34.1],
].reverse() as XY[] // OSM's order is clockwise
walls(granite, outline, 0, POD - 0.4)
walls(trim, outline, POD - 0.4, POD, inset(outline, 0.3))
cap(roof, inset(outline, 0.3), POD)
// The winter garden's glass roof over the arm reaching out to Wacker.
hipRoof(glass, -58, -10.1, -18.3, 10.1, POD, POD + 7)
panel(win, [-58.4, 10.5], [-58.4, -10.5], 1.5, 19.5, 1.0, POD - 1.5)

// The lower block to the wings' top, with crenellated corners.
walls(granite, low, POD, WING - 1)
walls(trim, low, WING - 1, WING, inset(low, 0.4))
cap(roof, inset(low, 0.4), WING)
for (const [x, y] of [[30.5, 31.5], [30.5, -31.6], [18, 31.5], [18, -31.6]] as XY[]) box(granite, trim, x - 2.5, y - 2.5, x + 2.5, y + 2.5, WING, WING + 6, 0.3)

// The shaft from the wings' top to the roof, its parapet stepping up at
// the tips into the turret piers.
walls(granite, shaft, POD, ROOF - 1)
walls(trim, shaft, ROOF - 1, ROOF, inset(shaft, 0.4))
cap(roof, inset(shaft, 0.4), ROOF)
const tips: XY[] = [[CX, CY - 15.5], [CX + 15.5, CY], [CX, CY + 15.5], [CX - 15.5, CY]]
for (const [x, y] of tips) {
  box(granite, trim, x - 4.2, y - 4.2, x + 4.2, y + 4.2, ROOF - 2, PIER, 0.4)
  // The small glass turret on its pier, a capping ring.
  lathe(glass, x, y, [[0, PIER], [3.2, PIER], [3.2, TURRET - 1], [0, TURRET - 1]], 16)
  lathe(trim, x, y, [[3.35, TURRET - 1], [3.35, TURRET], [2.9, TURRET]], 16)
  lathe(roof, x, y, [[2.9, TURRET - 0.3], [0, TURRET - 0.3]], 16)
}
// The crown: the glass cylinder, a ring at its top.
lathe(glass, CX, CY, [[0, ROOF], [9.3, ROOF], [9.3, TOP - 1.2], [0, TOP - 1.2]], 16)
lathe(trim, CX, CY, [[9.5, TOP - 1.2], [9.5, TOP], [8.8, TOP]], 16)
lathe(roof, CX, CY, [[8.8, TOP - 0.6], [0, TOP - 0.6]], 16)

// Windows: bays in four-storey groups (~4 m floors).
function bandBays(r: XY[], z0: number, z1: number, bay = 1.5, gap = 2.4, end = 0.6) {
  const groups = rows(z0, z1, Math.max(1, Math.round((z1 - z0) / 16)), 1.2)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < bay + 2 * end) continue
    const use = L - 2 * end, k = Math.max(1, Math.round((use + gap) / (bay + gap))), w = (use - (k - 1) * gap) / k
    for (let q = 0; q < k; q++) for (const [g0, g1] of groups) panel(win, a, b, end + q * (w + gap), end + q * (w + gap) + w, g0, g1)
  }
}
bandBays(low, POD + 1, WING - 2)
bandBays(shaft, POD + 1, ROOF - 2)
bandBays(outline, 2.5, POD - 2, 3.0, 2.0, 1.2)

await save('chi-311-south-wacker', '311 South Wacker Drive', [41.877462, -87.635751], 358.9, [
  { part: granite, material: finish('wacker-rose-granite', 0xd8bcae) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: glass, material: PALETTE.glass },
], 6500)
