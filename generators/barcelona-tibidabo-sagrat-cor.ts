/**
 * Temple Expiatori del Sagrat Cor, Tibidabo, Barcelona — original procedural
 * geometry, CC0-1.0. bun generators/barcelona-tibidabo-sagrat-cor.ts
 *
 * Uses the Gothic kit exported by generators/barcelona-cathedral.ts.
 *
 * Frame: built turned to the temple's axis, BEARING 162. +y is the axis
 * towards the front (south-south-east, over the city), +x is west-south-west.
 * z up, metres. Origin = centroid of the OSM outline way/486759610. The upper
 * church is centred at x -4.0, y 0.75.
 *
 * Evidence
 * - OSM way/486759610 (Q1189293, height 70, "year_of_construction
 *   1902..1961"): the whole complex, the crypt with the terrace on its roof and
 *   the buildings behind; its part way/387589500 is the upper church (27 m
 *   square between the corner towers, with apse bulges to the back and the
 *   east). The front corners of the crypt and the node "entrada a la cripta"
 *   fix which way it faces.
 * - Published (en/ca/es.wikipedia "Temple Expiatori del Sagrat Cor"): crypt
 *   1903-1911 in Montjuïc stone, Romanesque-Byzantine, with three round
 *   arches under a great one on its front and two outdoor stairs up to the
 *   upper church; the upper church (1915-1951) neo-Gothic, square with three
 *   apses, a large central tower and four lower corner towers; the bronze
 *   Sacred Heart by Josep Miret on the central tower, 7.5 m, set up in 1961.
 *   OSM's 70 m is taken as the whole height from the plaza in front of the
 *   crypt to the statue's head.
 * - Mapterhorn terrain (bun tools/terrain.ts grid, bearing 162): the lowest
 *   ground under the outline is the plaza in front of the crypt and the back
 *   corner (both about 15.5 m in the table; terrain.ts check puts the lowest
 *   point under the footprint about 1.5 m lower, at the east corner); the
 *   summit rock under the upper church is 12-14 m above the plaza. So the
 *   crypt's terrace is at 14.5, its walls run down the slope to y = 0, and
 *   the arches of its front start 1.5 m up, at the plaza. Last check: ok.
 * - Commons daylight photos (EVIDENCE):
 *   "Temple Expiatori del Sagrat Cor 2013.jpg" (Felix König, CC BY 3.0, the
 *   front of the upper church square on: the photo used to proportion it);
 *   "Temple Expiatori del Sagrat Cor from atop Talaia del Tibidabo,
 *   Barcelona, 2023.jpg" (DimiTalen, CC0, the whole complex from above, south-east:
 *   crypt, stairs, terrace, the four corner spires and the central tower);
 *   "007 Temple expiatori del Sagrat Cor del Tibidabo (Barcelona), vista
 *   posterior.jpg" (Enric, CC BY-SA 4.0, the central tower and statue);
 *   "Mount Tibidabo, Barcelona (50933741101).jpg" (Mike McBey, CC BY 2.0, the
 *   temple on the summit from afar).
 *
 * Estimated from the photos (scaled to the 70 m total and the 7.5 m statue):
 * the crypt's front (big round arch to 11.5, corner turrets with domes);
 * the upper church above the terrace, narrowed to the Talaia and König
 * photos (its square 24 m between the corner towers' outer faces, against
 * OSM's 27 m part, whose edge takes in the stairs' landings; width about
 * half the height to the statue's feet): walls 21, front gable 25 with a
 * small rose, the arcaded loggia over the door; corner towers 7.2 m square to
 * 23, spires to 36, crosses to 38.2; three apses (radius 4.6, to 17.5); the
 * central tower clear above them, as in the photos (statue base 1.3 times
 * the spire tips): lantern octagon 12 m across, 18-30.4, shaft 8.2 m across
 * to 45.6 with gablets on each face, pedestal to 47.5, the figure 7.5 m
 * with arms spread about 5 m, made bolder for phone size. Colours from the
 * daylight photos, pulled to the palette: pale grey granite above, honey-brown
 * Montjuïc stone for the crypt, the statue's bronze-gold, the terrace's pale
 * paving drawn in the granite colour.
 *
 * Doubts: OSM shows no apse on the west side; the third apse is drawn there
 * for the symmetry the photos and Wikipedia describe. The buildings behind
 * the temple (x > 12.6, y < -9.6) are drawn as a plain block at 10 m with a
 * flat roof; no photo shows them clearly. The two outdoor
 * stairs are outside the outline and left to the map. Statues of the apostles
 * on the parapets are left out.
 *
 * Night: the upper church, the towers and the statue are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { arc, arch, cap, chamfer, circle, course, edges, onWall, pinnacle, prism, rect, rose, save, turned, walls, type XY } from './barcelona-cathedral'

const granite = new Part(), crypt = new Part(), roof = new Part(), win = new Part(), gold = new Part()
const T = 14.5 // the terrace on the crypt
const CX = -4.0, CY = 0.75, H = 12.0 // the upper church's square
const U = (u: number) => CX + u, V = (v: number) => CY + v
const ccw = (r: XY[]): XY[] => (r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) < 0 ? [...r].reverse() : r)

// --- The crypt and its terrace, from the outline; the buildings behind as a lower block ---
const platform = ccw([[-0.3, -19.7], [-3.7, -22.0], [-14.7, -18.3], [-21.5, -15.7], [-21.3, -14.3], [-28.7, -11.6], [-29.2, -1.1], [-29.0, 2.9], [-29.1, 6.2], [-22.7, 26.2], [-21.7, 26.1], [-21.8, 27.9], [-20.8, 29.1], [-19.6, 29.0], [-17.8, 30.3], [-15.8, 32.6], [-15.4, 34.9], [-14.0, 35.2], [-13.0, 34.4], [-6.1, 34.7], [1.8, 35.0], [2.8, 35.8], [4.4, 35.0], [4.7, 33.6], [9.4, 29.0], [10.8, 29.2], [11.5, 27.5], [13.6, 26.7], [22.7, 14.2], [20.6, 12.9], [14.7, 12.5], [14.6, 14.0], [10.0, 13.8], [10.4, 8.0], [16.5, 8.1], [17.3, -9.6], [12.6, -9.6], [12.6, -30.6], [-2.4, -25.5]])
prism(crypt, platform, 0, T - 0.9, null)
course(crypt, platform, T - 1.6, T - 0.9, 0.3)
// the balustrade: a low parapet round the terrace
{
  const inner = platform.map(([x, y], i) => {
    const n = platform.length, a = platform[(i - 1 + n) % n], b = platform[(i + 1) % n]
    const nrm = (p: XY, q: XY): XY => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[1] - p[1]) / l, -(q[0] - p[0]) / l] }
    const n1 = nrm(a, [x, y]), n2 = nrm([x, y], b), k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
    return [x - ((n1[0] + n2[0]) / Math.max(k, 0.3)) * 0.5, y - ((n1[1] + n2[1]) / Math.max(k, 0.3)) * 0.5] as XY
  })
  walls(crypt, platform, T - 0.9, T)
  walls(crypt, [...inner].reverse(), T - 0.9, T)
  for (let i = 0; i < platform.length; i++) {
    const j = (i + 1) % platform.length
    crypt.quad([inner[i][0], inner[i][1], T], [platform[i][0], platform[i][1], T], [platform[j][0], platform[j][1], T], [inner[j][0], inner[j][1], T])
  }
  cap(granite, inner, T - 0.9)
}
const annex = ccw([[17.3, -9.6], [35.0, -14.4], [30.0, -30.7], [20.4, -40.6], [17.0, -35.8], [12.0, -32.7], [12.6, -30.6], [12.6, -9.6]])
prism(crypt, annex, 0, 9.0, null)
cap(roof, annex, 10.0)
walls(crypt, annex, 9.0, 10.0)

// the crypt's front: a projecting bay with the great round arch, its mosaic, three arches under it
{
  const a: XY = [1.3, 35.15], b: XY = [-12.0, 34.75] // outward +y
  prism(crypt, ccw([[-12.0, 32.0], [1.3, 32.0], [1.3, 35.15], [-12.0, 34.75]]), 0, T + 1.2, roof)
  const { L } = onWall(a, b), m = L / 2
  arch(crypt, a, b, m, 11.0, 1.5, 12.8, 0.12, false) // the arch ring, a shade proud
  arch(gold, a, b, m, 9.0, 7.6, 11.8, 0.2, false) // the mosaic in the tympanum
  for (const d of [-3.0, 0, 3.0]) arch(win, a, b, m + d, 2.4, 1.7, 7.2, 0.22, false)
}
// round turrets with domes at the crypt's corners
for (const [x, y] of [[-14.6, 33.6], [3.8, 33.4], [-21.8, 26.0], [12.6, 25.6]] as XY[]) {
  turned(crypt, x, y, [[2.2, 0], [2.2, T + 3.2], [2.45, T + 3.4], [2.45, T + 4.0], [2.0, T + 4.1], [1.7, T + 5.2], [1.0, T + 6.0], [0.25, T + 6.4], [0.25, T + 7.0], [0, T + 7.2]], 10)
  edges(circle(x, y, 2.2, 10, Math.PI / 10)).forEach(([p, q], i) => { if (i % 2 === 0) arch(win, p, q, Math.hypot(q[0] - p[0], q[1] - p[1]) / 2, 0.6, T + 0.6, T + 2.8, 0.05, false) })
}
// arched windows down the crypt's long sides
for (const [p, q, n] of [[[-29.2, -1.1], [-29.1, 6.2], 2], [[-29.1, 6.2], [-22.7, 26.2], 4], [[13.6, 26.7], [22.7, 14.2], 3], [[4.7, 33.6], [9.4, 29.0], 1]] as [XY, XY, number][]) {
  const [A, B] = ccwEdge(p, q)
  const Lr = Math.hypot(B[0] - A[0], B[1] - A[1])
  for (let k = 0; k < n; k++) arch(win, A, B, ((k + 0.5) / n) * Lr, 1.4, 6.5, 10.2, 0.06, false)
}
/** An outline edge given in the outline's original (clockwise) order, as an outward-facing wall. */
function ccwEdge(p: XY, q: XY): [XY, XY] { return [q, p] }

// --- The upper church on the terrace ---
const Z = (z: number) => T + z
{
  const TW = 3.6, TC = H - TW // corner tower half-size and centre offset
  // the square between the towers, walls and a flat roof
  prism(granite, rect(U(-H + 0.6), V(-H + 0.6), U(H - 0.6), V(H - 0.6)), T, Z(21), roof)
  course(granite, rect(U(-H + 0.6), V(-H + 0.6), U(H - 0.6), V(H - 0.6)), Z(20.2), Z(21), 0.3)
  // three apses: west (+x, drawn for symmetry), east (-x) and back (-y)
  const apses: [number, number, number][] = [[H - 0.6, 0, 0], [-(H - 0.6), 0, Math.PI], [0, -(H - 0.6), -Math.PI / 2]]
  for (const [du, dv, dir] of apses) {
    const cx = U(du), cy = V(dv), r = 4.6
    const ring: XY[] = arc(cx, cy, r, dir - Math.PI / 2, Math.PI, 5)
    walls(granite, ring.slice(), T, Z(17.5))
    // close against the church (inside, unseen) and roof as a half cone
    const tip: V3 = [cx, cy, Z(20.5)]
    const rr = arc(cx, cy, r + 0.35, dir - Math.PI / 2, Math.PI, 5)
    for (let k = 0; k < 5; k++) roof.tri([rr[k][0], rr[k][1], Z(17.3)], [rr[k + 1][0], rr[k + 1][1], Z(17.3)], tip)
    for (let k = 0; k < 5; k++) {
      const [p, q] = [ring[k], ring[k + 1]]
      const Lr = Math.hypot(q[0] - p[0], q[1] - p[1])
      arch(win, p, q, Lr / 2, 1.3, Z(7.5), Z(14.5))
    }
  }
  // the corner towers: square, then gables and pinnacles, an octagonal spire, a cross
  for (const su of [1, -1]) for (const sv of [1, -1]) {
    const cx = U(su * TC), cy = V(sv * TC)
    const sq = chamfer(rect(cx - TW, cy - TW, cx + TW, cy + TW), 0.8)
    prism(granite, sq, T, Z(23), roof)
    course(granite, sq, Z(16.2), Z(16.8), 0.25)
    course(granite, sq, Z(22.4), Z(23.0), 0.3)
    // windows: a pair of lancets, then the belfry lancet, on every face
    edges(rect(cx - TW, cy - TW, cx + TW, cy + TW)).forEach(([p, q]) => {
      const Lr = 2 * TW
      for (const d of [-0.95, 0.95]) arch(win, p, q, Lr / 2 + d, 1.1, Z(9.0), Z(14.6), 0.06)
      arch(win, p, q, Lr / 2, 1.7, Z(17.6), Z(21.8), 0.06)
      // the gable over each face
      const { P } = onWall(p, q)
      granite.tri(P(Lr / 2 - 2.3, Z(23), 0), P(Lr / 2 + 2.3, Z(23), 0), P(Lr / 2, Z(26.2), 0))
    })
    for (const [px, py] of [[cx - TW + 0.5, cy - TW + 0.5], [cx + TW - 0.5, cy - TW + 0.5], [cx + TW - 0.5, cy + TW - 0.5], [cx - TW + 0.5, cy + TW - 0.5]] as XY[])
      pinnacle(granite, px, py, 0.42, Z(23), Z(25.0), Z(27.6))
    turned(granite, cx, cy, [[2.7, Z(23)], [2.7, Z(25.8)], [2.45, Z(26)], [0.28, Z(35.4)], [0.28, Z(36.0)], [0, Z(36.2)]], 8)
    // the cross
    turned(granite, cx, cy, [[0.22, Z(36.0)], [0.22, Z(38.2)], [0, Z(38.3)]], 4)
    granite.quad([cx - 0.9, cy - 0.12, Z(37.1)], [cx + 0.9, cy - 0.12, Z(37.1)], [cx + 0.9, cy - 0.12, Z(37.6)], [cx - 0.9, cy - 0.12, Z(37.6)])
    granite.quad([cx + 0.9, cy + 0.12, Z(37.1)], [cx - 0.9, cy + 0.12, Z(37.1)], [cx - 0.9, cy + 0.12, Z(37.6)], [cx + 0.9, cy + 0.12, Z(37.6)])
  }
  // the front between the towers: gable with a rose, the loggia, the door
  {
    const fx = H - 0.6, a: XY = [U(TC - TW), V(fx)], b: XY = [U(-(TC - TW)), V(fx)] // outward +y
    const Lf = 2 * (TC - TW), { P } = onWall(a, b)
    granite.tri(P(-0.4, Z(21), 0.2), P(Lf + 0.4, Z(21), 0.2), P(Lf / 2, Z(26.5), 0.2))
    granite.quad(P(Lf + 0.4, Z(21), 0.2), P(Lf + 0.4, Z(21), 0), P(Lf / 2, Z(26.5), 0), P(Lf / 2, Z(26.5), 0.2))
    granite.quad(P(Lf / 2, Z(26.5), 0.2), P(Lf / 2, Z(26.5), 0), P(-0.4, Z(21), 0), P(-0.4, Z(21), 0.2))
    pinnacle(granite, P(Lf / 2, 0, 0.3)[0], P(Lf / 2, 0, 0.3)[1], 0.35, Z(26.0), Z(26.6), Z(28.4))
    rose(granite, a, b, Lf / 2, Z(14.6), 2.6, 2.1, 0.08, 14)
    rose(win, a, b, Lf / 2, Z(14.6), 2.1, 0, 0.08, 14)
    arch(win, a, b, Lf / 2, 3.0, Z(17.8), Z(21.6), 0.25)
    // the loggia: five round-headed openings over the door
    for (let k = 0; k < 5; k++) arch(win, a, b, Lf / 2 + (k - 2) * 1.75, 1.2, Z(7.6), Z(11.0), 0.06, false)
    granite.quad(P(0.5, Z(7.0), 0.5), P(Lf - 0.5, Z(7.0), 0.5), P(Lf - 0.5, Z(7.4), 0.5), P(0.5, Z(7.4), 0.5))
    granite.quad(P(0.5, Z(7.4), 0.5), P(Lf - 0.5, Z(7.4), 0.5), P(Lf - 0.5, Z(7.4), 0), P(0.5, Z(7.4), 0))
    arch(win, a, b, Lf / 2, 3.4, T, Z(6.4), 0.06, false)
  }
  for (const [p, q] of [[[U(H - 0.6), V(-(TC - TW))], [U(H - 0.6), V(TC - TW)]], [[U(-(H - 0.6)), V(TC - TW)], [U(-(H - 0.6)), V(-(TC - TW))]], [[U(-(TC - TW)), V(-(H - 0.6))], [U(TC - TW), V(-(H - 0.6))]]] as [XY, XY][]) {
    const Lr = Math.hypot(q[0] - p[0], q[1] - p[1])
    arch(win, p, q, Lr / 2, 2.6, Z(17.8), Z(20.6), 0.06) // over the apse roof
  }

  // --- The central tower: a broad octagonal lantern, then the shaft with gablets, the pedestal ---
  const cx = U(0), cy = V(0)
  turned(granite, cx, cy, [[6.0, Z(18)], [6.0, Z(29.4)], [6.3, Z(29.6)], [6.3, Z(30.4)], [4.4, Z(30.4)]], 8)
  edges(circle(cx, cy, 6.0, 8, Math.PI / 8)).forEach(([p, q]) => {
    const Lr = Math.hypot(q[0] - p[0], q[1] - p[1])
    arch(win, p, q, Lr / 2, 1.8, Z(22.5), Z(28.8))
  })
  for (let k = 0; k < 8; k++) {
    const t = Math.PI / 8 + (k / 8) * 2 * Math.PI
    pinnacle(granite, cx + 6.1 * Math.cos(t), cy + 6.1 * Math.sin(t), 0.42, Z(30.4), Z(32.0), Z(34.6))
  }
  turned(granite, cx, cy, [[4.4, Z(30.4)], [4.4, Z(44.6)], [4.7, Z(44.8)], [4.7, Z(45.6)], [2.8, Z(45.6)], [2.8, Z(47.5)], [0, Z(47.5)]], 8)
  edges(circle(cx, cy, 4.4, 8, Math.PI / 8)).forEach(([p, q]) => {
    const Lr = Math.hypot(q[0] - p[0], q[1] - p[1])
    arch(win, p, q, Lr / 2, 1.4, Z(34.5), Z(41.4))
    const { P } = onWall(p, q)
    granite.tri(P(0.2, Z(41.8), 0.15), P(Lr - 0.2, Z(41.8), 0.15), P(Lr / 2, Z(44.6), 0.15))
  })
  for (let k = 0; k < 8; k++) {
    const t = Math.PI / 8 + (k / 8) * 2 * Math.PI
    pinnacle(granite, cx + 4.55 * Math.cos(t), cy + 4.55 * Math.sin(t), 0.33, Z(41.0), Z(44.8), Z(46.6))
  }

  // --- The Sacred Heart, 7.5 m, arms spread, facing the city (+y). Bolder than life for the map. ---
  const z0 = Z(47.5)
  turned(gold, cx, cy, [[1.35, z0], [1.2, z0 + 1.5], [0.95, z0 + 4.4], [0.8, z0 + 5.6], [0.5, z0 + 5.9], [0.5, z0 + 6.3]], 10)
  turned(gold, cx, cy, [[0.42, z0 + 6.2], [0.62, z0 + 6.6], [0.6, z0 + 7.2], [0.3, z0 + 7.5], [0, z0 + 7.55]], 8)
  // arms: two sloping bars out from the shoulders, hands a little lower
  for (const s of [1, -1]) {
    const sh: V3 = [cx + s * 0.6, cy, z0 + 5.5], hand: V3 = [cx + s * 3.0, cy + 0.25, z0 + 5.0]
    const w = 0.42, d = 0.5
    const c = (p: V3, dx: number, dz: number, dy: number): V3 => [p[0], p[1] + dy, p[2] + dz + dx * 0]
    const A = c(sh, 0, -w, -d), B = c(sh, 0, w, -d), C = c(sh, 0, w, d), D = c(sh, 0, -w, d)
    const A2 = c(hand, 0, -w * 0.8, -d * 0.8), B2 = c(hand, 0, w * 0.8, -d * 0.8), C2 = c(hand, 0, w * 0.8, d * 0.8), D2 = c(hand, 0, -w * 0.8, d * 0.8)
    const q = (p1: V3, p2: V3, p3: V3, p4: V3) => { gold.quad(p1, p2, p3, p4); gold.quad(p4, p3, p2, p1) }
    q(A, A2, B2, B); q(B, B2, C2, C); q(C, C2, D2, D); q(D, D2, A2, A); q(A2, D2, C2, B2)
  }
}

// Close the bottom so the shadow pass sees a solid.
cap(crypt, platform, 0, false)

const lit = (p: V3, n: V3): number => (p[2] > T - 0.5 ? (n[2] > 0.7 ? 0.35 : 1) : 0)
await save('barcelona-tibidabo-sagrat-cor', 'Temple Expiatori del Sagrat Cor', [41.4221, 2.118801], 162, [
  { part: granite, material: { ...finish('bcn-tibidabo-granite', 0xe2e1dc), floodlight: lit } as Swatch },
  { part: crypt, material: finish('bcn-tibidabo-crypt', 0xcfb594) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: gold, material: { ...finish('bcn-tibidabo-bronze', 0xc9a55a), floodlight: lit } as Swatch },
], 6500)
