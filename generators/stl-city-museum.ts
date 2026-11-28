/**
 * City Museum, 750 N 16th St, St. Louis (the International Shoe Company
 * warehouse of 1909; the museum by Bob and Gail Cassilly since 1997) —
 * original procedural geometry, CC0-1.0.  bun generators/stl-city-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 14.9, the street grid. Anchor = the centroid of OSM
 * way/202269269, -90.2004459, 38.6336076.
 *
 * Identity (from the photos below), each a bold, simple mass:
 *  1. The ten-storey tan-brick warehouse block with rows of dark punched
 *     windows.                                                (p1, p3)
 *  2. On the roof: the white dome with the mantis on top, the Ferris wheel, the red water tank with its cone, the
 *     praying-mantis sculpture, and the school bus hanging out over the
 *     roof's edge.                                         (p1, p3; lidar)
 *  3. MonstroCity beside the building: a rusted deck on posts, bold teal
 *     wire tunnels climbing between lattice towers, two aeroplane fuselages
 *     high on towers, a castle turret with a domed cage, a fire engine.
 *                                                           (p2; lidar, OSM)
 *
 * Note on the brief: it places MonstroCity on the north side. The lidar's
 * returns from the climbing structures (8–18 m) and OSM's canopy
 * (way/1357830053, x -48..-30) put it along the west-north-west wall
 * (x < -30 in this frame), so it is drawn there.
 *
 * Plan: OSM way/202269269 turned to bearing 14.9: a rectangle 60.8 x 94.9 m.
 *
 * Heights: USGS 3DEP lidar USGS_LPC_MO_StLouis_2017_LAS_2018 (flown 2017),
 * 1 m grid with class 18 kept; y = 0 is the lowest ground (the east side,
 * 1 m over the box's ground_min; the west is 1 m higher). Measured: the
 * roof 39 (parapets 40–41); the white rooftop dome (p1) 22 m across at
 * (x -14, y -2), 48–49 high, the mantis on its crown to 55; the tank 55
 * at (x -1.5, y -20); the wheel's top 55, its rim spanning x -6..6 at
 * y -32; MonstroCity's structures 8–18 m, x -50..-30, y -46..10. A tall
 * narrow return at (x 0, y -46) is not identified and left out.
 * Estimated from the photos: the wheel (15 m across, 16 cars), the tank
 * (6 m across, 11 m to its cone), the mantis (a tall bent body and arms),
 * the bus (11 x 2.5 x 3 m, 4 m out over the edge at y -8), the planes
 * (fuselages 14 m, 2.8 m across, on lattice towers at 15–17 m), the
 * turret (7 m across, cage to 19 m), the tunnels (2.4 m tubes), the deck
 * (at 7.5 m), the fire engine; the window bays (~4 m, two storeys a panel).
 * Left out: the slinky slides, the many smaller tunnels and cages, the
 * rooftop slide, the pool, the signs; the wire mesh is never drawn as mesh.
 *
 * Review round 1: the walls in the photo's tan brick (#c9a77a), dark windows
 * grouped two storeys a panel between brick piers (bays ~5.6 m); the rusted
 * steel and the red tank, cars and engine now share one rust-red finish
 * (the material budget).
 *
 * Night: windows glow; the wheel's cars are lit.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  p1  "St. Louis City Museum (building outside).jpg", Atomicdragon136, CC BY 3.0
 *  p2  "City Museum outdoor structures.jpg", Chris857, CC BY-SA 3.0 (MonstroCity, the plane, the turret)
 *  p3  "City Museum, St. Louis (8133090734).jpg", Jon DeJong, CC BY 2.0 (the rooftop wheel and the tank)
 *  p4  "City Museum, St Louis MO 988773 1280.jpg", stefib230, CC0
 * Look-only (not used for shape): Flickr rooftop photos by issafly (CC BY-NC-SA),
 * yooperann and reallyboring (CC BY-NC-ND).
 * No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { box, cornice, revolve, save, type XY } from './atl-tech-tower'
import { edgePanels } from './atl-flatiron-building'

const cream = new Part(), win = new Part(), brick = new Part(), teal = new Part(), yellow = new Part(), red = new Part()
const rust = red // the rusted steel and the red pieces share one rust-red finish
const roofDeck = brick
const tri = (p: Part, a: V3, b: V3, c: V3, out: V3) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] >= 0) p.tri(a, b, c); else p.tri(a, c, b)
}
/** A straight tube of radius r from a to b, `n` sides, capped. */
function tube(p: Part, a: V3, b: V3, r: number, n = 6) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), t: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u0: V3 = [t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]], ul = Math.hypot(...u0)
  const u: V3 = [u0[0] / ul, u0[1] / ul, u0[2] / ul], w: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
  const ring = (c: V3) => Array.from({ length: n }, (_, i) => { const q = (i / n) * Math.PI * 2; return [c[0] + r * (Math.cos(q) * u[0] + Math.sin(q) * w[0]), c[1] + r * (Math.cos(q) * u[1] + Math.sin(q) * w[1]), c[2] + r * (Math.cos(q) * u[2] + Math.sin(q) * w[2])] as V3 })
  const A = ring(a), B = ring(b)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, m: V3 = [(A[i][0] + A[j][0]) / 2 - a[0], (A[i][1] + A[j][1]) / 2 - a[1], (A[i][2] + A[j][2]) / 2 - a[2]]
    tri(p, A[i], A[j], B[j], m); tri(p, A[i], B[j], B[i], m)
    if (i > 0 && i < n - 1) { tri(p, A[0], A[i], A[i + 1], [-t[0], -t[1], -t[2]]); tri(p, B[0], B[i], B[i + 1], t) }
  }
}

// ── The warehouse ──
const X = 30.4, Y = 47.4, ROOF = 39
box(brick, -X, X, -Y, Y, 0, ROOF, null, 0)
cornice(brick, [[-X, -Y], [X, -Y], [X, Y], [-X, Y]], ROOF - 0.8, 1.6, 0.35, brick) // the parapet band
box(brick, -X + 0.4, X - 0.4, -Y + 0.4, Y - 0.4, ROOF, ROOF + 0.4, roofDeck, 0) // the roof deck
for (const [a, b] of [[[-X, -Y], [X, -Y]], [[X, -Y], [X, Y]], [[X, Y], [-X, Y]], [[-X, Y], [-X, -Y]]] as [XY, XY][]) {
  // dark punched windows grouped two storeys a panel between brick piers, at the
  // warehouse's bay rhythm (~5.6 m, p1): wide panels, piers and spandrels showing
  edgePanels(win, a, b, 3.4, ROOF - 2.4, { group: 7.6, gap: 2.2, bay: 5.6, pier: 1.3, margin: 1.6, out: 0.06 })
}

// ── On the roof ──
// the Ferris wheel: a rim in the x–z plane on an A-frame, 16 cars
{
  const c: V3 = [0, -32, ROOF + 9.0], R = 6.6, N = 16
  for (let k = 0; k < N; k++) {
    const q0 = (k / N) * Math.PI * 2, q1 = ((k + 1) / N) * Math.PI * 2
    const P = (q: number, rr: number, dy = 0): V3 => [c[0] + rr * Math.cos(q), c[1] + dy, c[2] + rr * Math.sin(q)]
    tube(cream, P(q0, R), P(q1, R), 0.25, 4)
    if (k % 2 === 0) tube(cream, c, P(q0, R), 0.12, 4) // spokes
    box(red, P(q0, R)[0] - 0.7, P(q0, R)[0] + 0.7, c[1] - 0.8, c[1] + 0.8, P(q0, R)[2] - 1.6, P(q0, R)[2] - 0.4, red, 0) // a car hanging from the rim
  }
  for (const dx of [-3.5, 3.5]) for (const dy of [-1.2, 1.2]) tube(cream, [c[0] + dx, c[1] + dy, ROOF + 0.4], [c[0], c[1] + dy * 0.6, c[2]], 0.2, 4) // A-frame legs
}
// the red water tank on its frame, its cone roof
revolve(red, [-1.5, -20], [[2.8, ROOF + 5.0], [2.8, ROOF + 12.0], [0.05, ROOF + 16.0]], 10, 0, false, true)
for (const [dx, dy] of [[-2, -2], [2, -2], [2, 2], [-2, 2]]) tube(rust, [-1.5 + dx, -20 + dy, ROOF + 0.4], [-1.5 + dx * 0.9, -20 + dy * 0.9, ROOF + 5.0], 0.25, 4)
// the white rooftop dome, the mantis standing on its crown
revolve(cream, [-14, -2], [[11.0, ROOF + 0.4], [10.6, ROOF + 3.0], [8.4, ROOF + 6.6], [4.6, ROOF + 9.0], [0.05, ROOF + 9.6]], 16, 0, false, false)
revolve(teal, [-14, -2], [[11.3, ROOF + 2.6], [11.3, ROOF + 3.4], [10.8, ROOF + 3.5]], 16, 0, false, false) // the band round it
// the praying mantis: a tall bent body on four legs, raised forelegs (abstracted)
{
  const b: V3 = [-14, -2, ROOF + 9.4]
  for (const [dx, dy] of [[-2, -1.5], [2, -1.5], [-2, 1.5], [2, 1.5]]) tube(teal, [b[0] + dx, b[1] + dy, b[2] - 0.6], [b[0], b[1], b[2] + 2.5], 0.2, 4)
  tube(teal, [b[0], b[1] + 1.5, b[2] + 2.5], [b[0], b[1] - 1.5, b[2] + 6.5], 0.6, 6) // the thorax rising
  tube(teal, [b[0], b[1] + 1.5, b[2] + 2.5], [b[0], b[1] + 5, b[2] + 2.0], 0.7, 6) // the abdomen
  tube(teal, [b[0], b[1] - 1.5, b[2] + 6.5], [b[0], b[1] - 2.5, b[2] + 7.8], 0.4, 6) // neck and head
  for (const s of [-1, 1]) tube(teal, [b[0] + s * 0.4, b[1] - 1.3, b[2] + 6.0], [b[0] + s * 0.9, b[1] - 4, b[2] + 4.6], 0.25, 4) // raised forelegs
}
// the school bus hanging out over the south edge
box(yellow, 3.5, 6.0, -Y - 4.0, -Y + 7.0, ROOF + 0.4, ROOF + 3.4, yellow, 0.15)
box(win, 3.45, 6.05, -Y - 3.6, -Y + 6.6, ROOF + 2.0, ROOF + 2.9, null, 0)

// ── MonstroCity along the west-north-west wall ──
// the rusted deck on posts
box(rust, -48.0, -X, -40.0, 8.0, 7.0, 7.8, rust, 0, true)
for (let y = -38; y <= 8; y += 6) for (const x of [-47, -40]) tube(rust, [x, y, 0], [x, y, 7.0], 0.35, 4)
// lattice towers (bold teal columns) carrying the planes
for (const [x, y, h] of [[-44, 2, 15.0], [-38, -36, 16.0], [-34, -14, 18.0]] as [number, number, number][]) box(teal, x - 0.9, x + 0.9, y - 0.9, y + 0.9, 0, h, teal, 0)
// the two aeroplane fuselages, wings and tails
for (const [x, y, z] of [[-44, 2, 16.6], [-38, -36, 17.6]] as [number, number, number][]) {
  tube(cream, [x, y - 7, z], [x, y + 7, z], 1.4, 8)
  box(cream, x - 7, x + 7, y - 1.5, y + 1.5, z - 0.3, z + 0.1, cream, 0) // wings
  box(cream, x - 0.15, x + 0.15, y - 7, y - 4.5, z, z + 3.2, cream, 0) // the fin
}
// the bold wire tunnels: a few tubes climbing from the building to the towers and planes
for (const [a, b] of [
  [[-X, -20, 24], [-34, -14, 18]], [[-34, -14, 18], [-38, -36, 17]], [[-34, -14, 18], [-44, 2, 16]],
  [[-X, 5, 12], [-44, 2, 8]], [[-44, -30, 8], [-38, -36, 15]], [[-X, -40, 30], [-38, -36, 18]],
] as [V3, V3][]) tube(teal, a, b, 1.2, 6)
// the castle turret with its domed cage
revolve(rust, [-42, -24], [[3.5, 0], [3.5, 12.5], [4.2, 13.0], [4.2, 13.6], [0.05, 13.6]], 12, 0, false, false)
revolve(rust, [-42, -24], [[3.2, 13.6], [2.6, 16.5], [1.2, 18.6], [0.05, 19.0]], 10, 0, false, false)
// the fire engine at the foot of the structures
box(red, -49.5, -46.5, 10.0, 19.0, 0, 3.2, red, 0.2)

await save('stl-city-museum', 'City Museum', [
  { part: cream, material: finish('stl-citymuseum-cream', 0xe6dcc4) },
  { part: brick, material: finish('stl-citymuseum-brick', 0xd4bd92) },
  { part: win, material: windowVariant(2, 0x4f5a63) },
  { part: teal, material: finish('stl-citymuseum-teal', 0x4f8f86) },
  { part: yellow, material: finish('stl-citymuseum-bus', 0xd8a93a) },
  { part: red, material: finish('stl-citymuseum-red', 0xa95540) },
], { height: ROOF + 15.5, anchor: [38.6336076, -90.2004459], bearing: 14.9 }, 6500)
