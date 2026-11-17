/**
 * Estadi Olímpic Lluís Companys, Montjuïc, Barcelona — original procedural
 * geometry, CC0-1.0.
 * bun generators/barcelona-olympic-stadium.ts
 * (uses the shared kit in barcelona-venetian-towers.ts)
 *
 * Map frame: +x east, +y north, z up, metres. BEARING 0 (the bowl's long
 * axis runs north–south). Origin = area centroid of OSM way/35764760 (the
 * stadium outline, which coincides with the building relation/155422),
 * lng 2.155652, lat 41.364758. y = 0 is the field.
 *
 * Evidence
 * - OSM way/35764760 (leisure=stadium, opened 1929-05-20, wikidata Q275715,
 *   checked: "Lluís Companys Olympic Stadium", 41.3647 2.1556) and the
 *   building relation/155422 (building=stadium, architect Pere Domènech i
 *   Roura): an outer ring 191 × 276 m with the east pavilions, the north
 *   gate block and the west tower notch, and an inner ring (the bowl's
 *   edge at the track). The main-stand roof is way/126784791 (x -94..-50,
 *   y -64..66). All measured from the OSM nodes.
 * - Published (Viquipèdia and Wikipedia es): rebuilt 1985–89 inside the
 *   1929 facades for the 1992 Games; the field was lowered 11 m; the
 *   marathon gate carries a pediment with a sculpture group by Vicenç
 *   Navarro.
 * - Mapterhorn terrain (terrain.ts grid 2.155652 41.364758 150 15): the
 *   tiles here show the bowl itself. The field reads 4.6 m above the
 *   table's lowest point; the street on the north (Av. de l'Estadi) about
 *   15.3 (10.7 m above the field, matching the published 11 m), the west
 *   street about 10 (5 m), the south 8–12, the Anella esplanade on the east
 *   about 21.7 (17 m). Because the map's terrain already holds the dig,
 *   `elevation` is left at 0: the map finds the field as the lowest ground
 *   and stands the model on it (checked with terrain.ts check).
 * - Commons photos (daylight, EVIDENCE):
 *   "Estadi Olímpic Lluís Companys - Barcelona, Spain - Jan 2007.jpg"
 *   (Diliff, CC BY-SA 3.0: the bowl from the west stand, the roof edge);
 *   "Estadi Olímpic Lluís Companys Mai 2013.jpg" (Felix König, CC BY 3.0,
 *   from the south-east above: the whole stadium, the roof truss, the
 *   tower, the low south end with its two screens);
 *   "202 Estadi Olímpic Lluís Companys (Barcelona), façana nord i
 *   peveter.jpg", "186 ... façana est.jpg", "211 ... façana oest i
 *   torre.jpg" (Enric, CC BY-SA 4.0, 2016: the north gate block with its
 *   great arch and relief, the east pavilions, the west front with the
 *   tower, the corner dome and the horse groups);
 *   "Barcelona - Montjuïc - Passeig Olimpic - Backside of Estadi Olímpic
 *   Lluís Companys ... 01.jpg" (Txllxt TxllxT, CC BY-SA 4.0).
 *
 * Heights above the field, estimated from the photos against the measured
 * street levels: facade cornice 26 m (about 15 m over the north street,
 * 18–20 over the west); east pavilions to 29.5 m with low hipped roofs;
 * north gate block to 34 m with its arch springing at 21 m; the tower 8 m
 * square to 41 m, a belfry stage to 45 m and a lantern to 49 m (about 2.4
 * times the west facade's height on the Enric photo); the corner dome on
 * the north-west to 35 m; the main-stand roof a slab from 30 m at the back
 * to 28.5 m at its front edge, with a white truss to 35.5 m. The stands are
 * lofted from the bowl's edge at the track up to the facade top.
 *
 * Doubts: the street levels round the bowl vary, so the facade's punched
 * windows are drawn from 14.5 m up only (below that the walls are in the
 * ground on most sides); the cauldron (peveter), the horse groups and the
 * floodlight masts are left out; the truss is simplified to a ridge with
 * diagonals.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { emit, block, smoothLoft, tube, archPanel, pyramid, rect, lathe, panel, type P2 } from './barcelona-venetian-towers'

const ANCHOR = { lng: 2.155652, lat: 41.364758 }
const OUTER: P2[] = [[-79, 111], [-81, 92], [-83, 66], [-90, 66], [-92, 43], [-93, 15], [-94, 2], [-94, -10], [-94, -36], [-92, -64], [-85, -64], [-82, -108], [-75, -113], [-66, -119], [-45, -128], [-33, -132], [-14, -135], [-4, -137], [7, -137], [26, -133], [34, -131], [47, -127], [60, -122], [71, -116], [78, -111], [82, -67], [89, -67], [90, -58], [92, -25], [92, -12], [93, 7], [93, 21], [93, 41], [92, 54], [92, 63], [84, 63], [82, 108], [68, 116], [56, 123], [49, 126], [36, 130], [27, 133], [16, 134], [6, 138], [-2, 138], [-12, 135], [-25, 133], [-41, 129], [-49, 126], [-57, 123], [-68, 117]]
const INNER: P2[] = [[-31, 80], [-42, 74], [-49, 66], [-51, 51], [-50, 39], [-51, 11], [-52, -10], [-51, -38], [-52, -58], [-50, -64], [-45, -74], [-37, -79], [-30, -83], [-25, -86], [-15, -90], [-5, -92], [0, -92], [10, -91], [21, -87], [30, -81], [37, -75], [42, -66], [46, -58], [48, -48], [49, 43], [49, 51], [47, 57], [44, 65], [40, 72], [33, 78], [28, 83], [20, 87], [11, 90], [3, 91], [-6, 91], [-15, 89], [-23, 85]]

/** The polygon's farthest (or nearest) hit along a ray from (0, cy) at angle t. */
function hit(poly: P2[], t: number, far: boolean, cy = 0): P2 {
  const d: P2 = [Math.cos(t), Math.sin(t)]
  let best = far ? -1 : 1e9
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const ex = b[0] - a[0], ey = b[1] - a[1]
    const den = d[0] * ey - d[1] * ex
    if (Math.abs(den) < 1e-9) continue
    const ax = a[0], ay = a[1] - cy
    const s = (ax * ey - ay * ex) / den, u = (ax * d[1] - ay * d[0]) / den
    if (s > 0 && u >= 0 && u <= 1 && (far ? s > best : s < best)) best = s
  }
  return [d[0] * best, cy + d[1] * best]
}

const N = 96
const ang = (k: number) => (k / N) * Math.PI * 2
const O = Array.from({ length: N }, (_, k) => hit(OUTER, ang(k), true))
const I = Array.from({ length: N }, (_, k) => hit(INNER, ang(k), false))
const mix = (a: P2, b: P2, f: number): P2 => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
const R = (pts: P2[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])

const facade = new Part(), seats = new Part(), roof = new Part(), trim = new Part(), win = new Part()
const TOP = 26
const S = O.map((o, k) => mix(I[k], o, 0.86)), T = O.map((o, k) => mix(I[k], o, 0.955))
const loft = (p: Part, a: V3[], b: V3[]) => {
  // flat-shaded per segment so the creases stay crisp
  p.loft([a, b])
}
loft(facade, R(O, 0), R(O, TOP))
loft(facade, R(O, TOP), R(T, TOP))
loft(facade, R(T, TOP), R(T, TOP - 1.4))
loft(seats, R(T, TOP - 1.4), R(S, 21.5))
loft(seats, R(S, 21.5), R(I, 1.6))
loft(facade, R(I, 1.6), R(I, 0))
// A cornice band round the top.
loft(trim, R(O.map((o) => [o[0] * 1.004, o[1] * 1.004] as P2), TOP - 1.2), R(O.map((o) => [o[0] * 1.004, o[1] * 1.004] as P2), TOP - 0.4))

// Punched windows, grouped two storeys, one per bay, on the facade.
for (let k = 0; k < N; k++) {
  const a = O[k], b = O[(k + 1) % N]
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (len < 4) continue
  const n: P2 = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len]
  const m = mix(a, b, 0.5), t: P2 = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  const w = Math.min(2.6, len * 0.4)
  const eastHigh = a[0] > 70 && Math.abs(a[1]) < 70 // east esplanade at 17 m
  if (!eastHigh) panel(win, [m[0] - t[0] * w / 2, m[1] - t[1] * w / 2], [m[0] + t[0] * w / 2, m[1] + t[1] * w / 2], 14.8, 17.6, n)
  panel(win, [m[0] - t[0] * w / 2, m[1] - t[1] * w / 2], [m[0] + t[0] * w / 2, m[1] + t[1] * w / 2], 19.6, 23.2, n)
}

// East pavilions with hipped roofs.
for (const [y0, y1] of [[-67, -45], [-25, -12], [7, 21], [41, 54]]) {
  const cy = (y0 + y1) / 2, hy = (y1 - y0) / 2
  block(facade, 91, cy, 5, hy, 0, 29.5, 0.35)
  pyramid(roof, rect(91, cy, 5.3, hy + 0.3), 29.5, [91, cy, 31.6])
  for (const s of [-0.5, 0, 0.5]) panel(win, [96.05, cy + s * hy * 1.2 - 1], [96.05, cy + s * hy * 1.2 + 1], 23.5, 27.5, [1, 0], 0.01)
}

// North gate block with the great arch and the relief panel.
{
  block(facade, 2, 131, 15.5, 7.5, 0, 34, 0.4)
  block(facade, 2, 131, 13, 6, 34, 35.2, 0.3)
  archPanel(win, [2, 138.55], [-1, 0], [0, 1], 9, 10.7, 21, 0.05, 12)
  panel(trim, [9, 138.55], [-5, 138.55], 26.5, 30, [0, 1], 0.08)
  for (const s of [-1, 1]) for (const z of [16, 24]) panel(win, [2 + s * 10 + 1.2, 138.55], [2 + s * 10 - 1.2, 138.55], z, z + 3.2, [0, 1], 0.05)
}

// Marathon tower on the west front, near the north end.
{
  const tx = -87, ty = 76
  block(facade, tx, ty, 4.2, 4.2, 0, 41, 0.35)
  block(facade, tx, ty, 3.4, 3.4, 41, 45, 0.3)
  for (let f = 0; f < 4; f++) {
    const a = (f * Math.PI) / 2, n: P2 = [Math.cos(a), Math.sin(a)], t: P2 = [-Math.sin(a), Math.cos(a)]
    archPanel(win, [tx + n[0] * 3.4, ty + n[1] * 3.4], t, n, 1.8, 41.6, 43.4, 0.05, 6)
    panel(win, [tx + n[0] * 4.2 - t[0] * 0.9, ty + n[1] * 4.2 - t[1] * 0.9], [tx + n[0] * 4.2 + t[0] * 0.9, ty + n[1] * 4.2 + t[1] * 0.9], 33, 38, n)
  }
  lathe(facade, [[1.9, 45], [1.9, 47.6], [2.2, 47.8], [2.2, 48.3], [1.0, 48.6], [0, 49]], 12, tx, ty)
}
// Corner dome on the north-west.
lathe(roof, [[4.2, 27], [4.2, 30], [3.6, 32.2], [2.2, 33.6], [0.6, 34.4], [0, 35]], 14, -74, 112)

// Main-stand roof: a slab sloping down to its front edge, and a white truss.
{
  const yS = -64, yN = 66, xb = -92, xf = -51
  const slab = (z: number, dz: number): V3[] => [[xf, yS, 28.5 + dz], [xb, yS, 30 + dz], [xb, yN, 30 + dz], [xf, yN, 28.5 + dz]].map(([x, y, zz]) => [x, y, zz + z * 0]) as V3[]
  const top = slab(0, 0.9), bot = slab(0, 0)
  roof.quad(top[0], top[3], top[2], top[1])
  roof.quad(bot[0], bot[1], bot[2], bot[3])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    roof.quad(bot[j], bot[i], top[i], top[j])
  }
  // fix winding of the sides by drawing both ways (thin edges)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    roof.quad(bot[i], bot[j], top[j], top[i])
  }
  const xr = -72, zr = 35.5
  tube(trim, [[xr, yS, zr], [xr, yN, zr]], 0.45, 6)
  for (let y = yS; y <= yN + 0.1; y += 13) {
    tube(trim, [[xf + 1, y, 29.6], [xr, y, zr]], 0.3, 5)
    tube(trim, [[xb - 1, y, 31], [xr, y, zr]], 0.3, 5)
  }
}

// The two screens on the south end.
for (const sx of [-30, 30]) block(trim, sx, -117, 6.5, 1.2, 24, 31, 0.2)

await emit('barcelona-olympic-stadium', 'Estadi Olímpic Lluís Companys', [
  { part: facade, material: { ...PALETTE.stone, floodlight: (q, n) => (n[2] > 0.7 ? 0.2 : q[2] > 12 ? 0.8 : 0.3) } },
  { part: seats, material: finish('stadium-seats', 0xc5c9cc) },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
], { bearing: 0, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 49, replaces: ['relation/155422', 'way/126784791', 'way/35764760'] }, 6500)
void smoothLoft
