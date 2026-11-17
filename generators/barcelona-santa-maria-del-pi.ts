/**
 * Basilica of Santa Maria del Pi, Barcelona — original procedural geometry,
 * CC0-1.0. bun generators/barcelona-santa-maria-del-pi.ts
 *
 * Uses the Gothic kit exported by generators/barcelona-cathedral.ts.
 *
 * Frame: built turned to the church's axis, BEARING 308. +y is the axis
 * towards the main front with the rose window on the Plaça del Pi
 * (north-west), -y the polygonal apse; +x is the Plaça de Sant Josep Oriol
 * side (north-east). z up, metres. Origin = centroid of the OSM outline
 * way/625295824. The nave's axis runs at x = 13.85.
 *
 * Evidence
 * - OSM way/625295824 (Q2293331; the whole parish block, "building:levels 4",
 *   no height), its part way/821875781 (the church and the one-storey
 *   buildings west of it, "building:levels 1"), the other parish buildings
 *   round it (way/821875768, 821875746, 821875805, 951720246, 951720247 and
 *   others, 2 to 5 storeys, left to the map), and the bell tower way/625295823
 *   (man_made=tower, height 54; an octagon 13.1 m across, centre x -10.45,
 *   y -18.45 here). The OSM church sides are not quite parallel; the bearing
 *   splits the difference.
 * - Published (ca/es/en.wikipedia "Santa Maria del Pi"): a single nave 54 m
 *   long, 17.5 m wide and 27 m high inside, seven bays, polygonal apse,
 *   chapels between the buttresses; the octagonal bell tower, free-standing on
 *   the south side of the chevet, 54 m, walls 3.55 m thick at the base,
 *   1460-1497; the great rose window on the front (rebuilt after 1936).
 * - Mapterhorn terrain (bun tools/terrain.ts grid, bearing 308): flat, within
 *   1.5 m.
 * - Commons daylight photos (EVIDENCE):
 *   "Facade of Church of Santa Maria del Pi - Barcelona - Spain
 *   (14353201766).jpg" (Adam Jones,
 *   CC BY-SA 2.0, the front and rose from the Plaça del Pi);
 *   "Church of Santa Maria del Pi Barcelona (5832106071).jpg" (Tony Hisgett,
 *   CC BY 2.0, the apse, its buttresses and windows);
 *   "010 Església de Santa Maria del Pi (Barcelona), campanar i absis.jpg"
 *   (Enric, CC BY-SA 4.0, the apse and the tower beside it);
 *   "Barcelona - Santa María del Pi desde Ramblas 2017-12-27.jpg" (Rafa
 *   Esteve, CC BY-SA 4.0, the tower's belfry square on, level, from afar: the
 *   photo used to proportion the tower);
 *   "945 El campanar de Santa Maria del Pi (Barcelona), des del Palau Nou de
 *   la Rambla.jpg" (Enric, CC BY-SA 4.0, the tower in evening sun).
 *
 * Estimated from the photos (scaled to the published 54 m tower and 27 m
 * nave): the nave walls to 29.5 and a low roof to 31.5 behind a front to 31.8; the chapels' band to
 * 13 with one small window a chapel; the buttresses standing above them to
 * 28 with sloped tops; a tall lancet a bay in the upper walls; the front's
 * portal (to 12.5) and blind arcade over it (to 16), the rose (r 5.0 at
 * 21.6), the octagonal corner turrets; the tower's shaft to 38.5, the string
 * course, the belfry with one tall pointed opening a face (42-51.4), the
 * pierced parapet band to 54. Colours from the daylight photos pulled to the
 * palette's lightness: grey-buff sandstone, warmer on the tower.
 *
 * Doubts: the apse's exact polygon (OSM's is irregular where the sacristy
 * meets it); the south-west side, hidden by the parish buildings, is drawn as
 * the mirror of the north-east one; the one-storey buildings west of the
 * church are drawn as a plain block because OSM puts them in the same part.
 *
 * Night: the front and the tower are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { arc, arch, cap, chamfer, circle, course, edges, hall, onWall, pinnacle, prism, rect, rose, save, turned, walls, type XY } from './barcelona-cathedral'

const stone = new Part(), tower = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part()
const CX = 13.85, FY = 29.2, AY = -20
const XN = 9.8, XO = 11.85 // nave walls, chapels' outer face (half widths)
const CH = 13, EAVE = 29.5, RIDGE = 31.5
const X = (u: number) => CX + u
const BAYS = Array.from({ length: 8 }, (_, i) => AY + (i * (FY - 1.4 - AY)) / 7)

// --- The nave: chapels' band, upper walls, roof ---
prism(stone, rect(X(-XO), AY, X(XO), FY), 0, CH, roof)
course(trim, rect(X(-XO), AY, X(XO), FY), CH - 0.5, CH, 0.3)
hall(stone, roof, X(-XN), AY, X(XN), FY, EAVE, RIDGE, true, [false, false])
course(trim, rect(X(-XN), AY, X(XN), FY), EAVE - 0.6, EAVE, 0.3)

// --- The apse: five sides of a ten-sided polygon, buttresses at the angles ---
{
  const ring: XY[] = [[X(-XN), AY], ...arc(X(0), AY, XN, Math.PI, Math.PI, 5).slice(1, -1), [X(XN), AY]]
  walls(stone, ring, 0, EAVE)
  course(trim, ring, EAVE - 0.6, EAVE, 0.3)
  const r = arc(X(0), AY, XN + 0.5, Math.PI, Math.PI, 5), ez = EAVE - (0.5 * (RIDGE - EAVE)) / XN
  for (let k = 0; k < r.length - 1; k++) roof.tri([r[k][0], r[k][1], ez], [r[k + 1][0], r[k + 1][1], ez], [X(0), AY, RIDGE])
  edges(ring).forEach(([a, b], i) => {
    if (i === ring.length - 1) return
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    arch(win, a, b, L / 2, 2.6, 12.5, 26.5)
    rose(trim, a, b, L / 2, 8.8, 1.25, 0.95, 0.06, 10) // the round-arched niches of the lower band
  })
  for (let k = 1; k < 5; k++) {
    const t = Math.PI + (k / 5) * Math.PI, c = Math.cos(t), s = Math.sin(t)
    const at = (rr: number, w: number): XY => [X(0) + rr * c - w * s, AY + rr * s + w * c]
    prism(stone, chamfer([at(XN - 0.4, -1.1), at(XN + 2.6, -1.1), at(XN + 2.6, 1.1), at(XN - 0.4, 1.1)], 0.3), 0, 25.5, null)
    // the sloped top
    const A = at(XN - 0.4, -1.1), B = at(XN + 2.6, -1.1), C = at(XN + 2.6, 1.1), D = at(XN - 0.4, 1.1)
    roof.quad([B[0], B[1], 25.5], [C[0], C[1], 25.5], [D[0], D[1], 28.6], [A[0], A[1], 28.6])
    stone.tri([A[0], A[1], 25.5], [B[0], B[1], 25.5], [A[0], A[1], 28.6])
    stone.tri([C[0], C[1], 25.5], [D[0], D[1], 25.5], [D[0], D[1], 28.6])
    stone.quad([D[0], D[1], 25.5], [A[0], A[1], 25.5], [A[0], A[1], 28.6], [D[0], D[1], 28.6])
  }
}

// --- The long sides: buttresses rising over the chapels, a tall lancet a bay ---
for (const sd of [1, -1]) {
  const nv: [XY, XY] = sd > 0 ? [[X(XN), AY], [X(XN), FY]] : [[X(-XN), FY], [X(-XN), AY]]
  const ch: [XY, XY] = sd > 0 ? [[X(XO), AY], [X(XO), FY]] : [[X(-XO), FY], [X(-XO), AY]]
  const s = (y: number) => (sd > 0 ? y - AY : FY - y)
  for (let i = 0; i < BAYS.length; i++) {
    const yb = BAYS[i]
    if (i > 0 && i < BAYS.length - 1) {
      const x0 = sd > 0 ? X(XN) - 0.1 : X(-XO) - 0.4, x1 = sd > 0 ? X(XO) + 0.4 : X(-XN) + 0.1
      prism(stone, chamfer(rect(x0, yb - 0.9, x1, yb + 0.9), 0.25), 0, 25.5, null)
      const ox = sd > 0 ? x1 : x0, ix = sd > 0 ? x0 : x1
      // sloped top falling outward
      const q = (a: V3, b: V3, c: V3, d: V3) => (sd > 0 ? roof.quad(a, b, c, d) : roof.quad(b, a, d, c))
      q([ox, yb - 0.9, 25.5], [ox, yb + 0.9, 25.5], [ix, yb + 0.9, 28.4], [ix, yb - 0.9, 28.4])
      for (const e of [-0.9, 0.9]) {
        const t = (a: V3, b: V3, c: V3) => ((e > 0) === (sd > 0) ? stone.tri(a, c, b) : stone.tri(a, b, c))
        t([ix, yb + e, 25.5], [ox, yb + e, 25.5], [ix, yb + e, 28.4])
      }
    }
    if (i === BAYS.length - 1) continue
    const yc = (yb + BAYS[i + 1]) / 2
    arch(win, nv[0], nv[1], s(yc), 2.4, 15.5, 26.8)
    arch(win, ch[0], ch[1], s(yc), 1.2, 7.5, 11.4)
  }
  // a side portal on the Sant Josep Oriol side, a smaller one on the other
  const { P } = onWall(ch[0], ch[1])
  const sp = s(BAYS[4] - 3.4)
  arch(trim, ch[0], ch[1], sp, 5.0, 0, 9.0, 0.05)
  door.quad(P(sp - 1.5, 0, 0.1), P(sp + 1.5, 0, 0.1), P(sp + 1.5, 5.0, 0.1), P(sp - 1.5, 5.0, 0.1))
}

// --- The front: plain wall, the great rose, the portal and its blind arcade, corner turrets ---
{
  const fa: XY = [X(XO), FY], fb: XY = [X(-XO), FY], W = 2 * XO // outward +y
  prism(stone, rect(X(-XO), FY - 1.4, X(XO), FY), CH, 31.8, roof)
  // the rose: ring, glass, twelve spokes, hub
  rose(trim, fa, fb, W / 2, 21.6, 5.6, 5.0, 0.08, 20)
  rose(win, fa, fb, W / 2, 21.6, 5.0, 0, 0.08, 20)
  {
    const { P } = onWall(fa, fb)
    for (let k = 0; k < 12; k++) {
      const t = (k / 12) * 2 * Math.PI, c = Math.cos(t), sn = Math.sin(t), w = 0.2
      const at = (r: number, d: number): V3 => P(W / 2 + r * c - d * sn, 21.6 + r * sn + d * c, 0.11)
      trim.quad(at(1.0, -w), at(5.05, -w), at(5.05, w), at(1.0, w))
    }
    rose(trim, fa, fb, W / 2, 21.6, 1.0, 0, 0.12, 10)
    rose(win, fa, fb, W / 2, 21.6, 0.55, 0, 0.14, 8)
    // the blind arcade over the portal: a band of tall pointed niches
    trim.quad(P(2.2, 12.6, 0.08), P(W - 2.2, 12.6, 0.08), P(W - 2.2, 13.2, 0.08), P(2.2, 13.2, 0.08))
    for (let k = 0; k < 11; k++) {
      const sc = 3.3 + k * ((W - 6.6) / 10)
      if (Math.abs(sc - W / 2) < 3.2) continue
      arch(roof, fa, fb, sc, 1.15, 7.0, 12.4, 0.07)
    }
    for (let k = 0; k < 9; k++) arch(roof, fa, fb, W / 2 - 6 + k * 1.5, 1.05, 13.4, 16.2, 0.07)
    trim.quad(P(2.2, 16.2, 0.08), P(W - 2.2, 16.2, 0.08), P(W - 2.2, 16.7, 0.08), P(2.2, 16.7, 0.08))
  }
  // portal: archivolts, tympanum, doors
  arch(trim, fa, fb, W / 2, 7.6, 0, 12.4, 0.12)
  arch(roof, fa, fb, W / 2, 6.0, 0, 11.2, 0.16)
  {
    const { P } = onWall(fa, fb)
    door.quad(P(W / 2 - 2.0, 0, 0.2), P(W / 2 + 2.0, 0, 0.2), P(W / 2 + 2.0, 6.0, 0.2), P(W / 2 - 2.0, 6.0, 0.2))
  }
  // the octagonal turrets at the front's corners
  for (const sd of [1, -1]) {
    const tx = X(sd * (XO - 1.3)), ty = FY - 1.3
    turned(stone, tx, ty, [[1.6, 0], [1.6, 32.0], [1.8, 32.2], [1.8, 32.9], [1.25, 33.1], [1.25, 34.2], [0, 34.4]], 8)
  }
  course(trim, rect(X(-XO), FY - 1.4, X(XO), FY), 31.2, 31.8, 0.3)
}

// --- The bell tower: octagonal, free-standing, 54 m ---
{
  const tx = -10.45, ty = -18.45, R = 6.6, a0 = 0.14
  turned(tower, tx, ty, [[R, 0], [R, 37.9], [R + 0.35, 38.1], [R + 0.35, 38.8], [R, 39.0], [R, 52.4], [R + 0.3, 52.6], [R + 0.3, 54.0], [0, 54.0]], 8, a0)
  const ring = circle(tx, ty, R, 8, a0)
  edges(ring).forEach(([a, b], i) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    arch(win, a, b, L / 2, 1.9, 42.0, 51.4) // the belfry's opening
    if (i % 2 === 0) arch(win, a, b, L / 2, 0.6, 26, 29) // slit windows lighting the stair
    // the pierced parapet's band of little arches
    for (const d of [-1.35, 0, 1.35]) arch(trim, a, b, L / 2 + d, 0.9, 52.75, 53.7, 0.36)
  })
  // the flagpole
  turned(trim, tx, ty, [[0.15, 54], [0.15, 59], [0, 59.2]], 4)
}

// --- The one-storey buildings west of the church, in the same OSM part ---
{
  const annex: XY[] = [[2.4, 27.9], [2.3, 26.6], [2.5, 15.0], [2.6, 10.7], [-2.4, 10.6], [-5.3, 7.8], [-8.5, 7.9], [-10.2, 2.7], [-11.7, 3.3], [-15.3, -10.1], [-18.6, -8.5], [-20.2, -9.4], [-33.8, -3.0], [-34.8, -5.0], [-36.5, -4.2], [-38.0, -7.3], [-36.3, -8.1], [-38.0, -11.9], [-32.3, -15.8], [-28.6, -18.4], [-26.7, -19.2], [-22.5, -21.1], [-17.1, -22.2], [-15.3, -22.3], [-16.5, -20.4], [-17.0, -20.6], [-17.2, -19.9], [-16.6, -19.6], [-16.1, -15.5], [-16.5, -15.2], [-15.9, -14.5], [-15.6, -14.8], [-12.6, -13.0], [-12.7, -12.4], [-11.9, -12.3], [-11.8, -12.9], [-9.4, -13.0], [-9.5, -11.6], [-1.9, -11.3], [-1.8, -12.8], [3.1, -12.9], [3.2, -18.5], [4.3, -25.6], [5.0, -26.1], [3.3, -27.6], [3.1, -28.8], [7.1, -29.8], [7.6, -28.2], [7.9, -28.5], [14.7, -28.7], [18.9, -25.7], [20.0, -21.0], [25.0, -21.0], [25.6, -20.1], [24.5, 28.6], [23.1, 28.6], [22.5, 29.2], [1.4, 29.1]]
  prism(stone, annex, 0, 4.5, roof)
}

// Close the bottom so the shadow pass sees a solid.
cap(stone, rect(X(-XO), -30, X(XO), FY), 0, false)

const lit = (p: V3, n: V3): number => (p[1] > 24 || Math.hypot(p[0] + 10.45, p[1] + 18.45) < 7.5 ? (n[2] > 0.7 ? 0.3 : 1) : 0)
await save('barcelona-santa-maria-del-pi', 'Santa Maria del Pi', [41.382044, 2.173934], 308, [
  { part: stone, material: { ...finish('bcn-pi-stone', 0xd8ccb6), floodlight: lit } as Swatch },
  { part: tower, material: { ...finish('bcn-pi-tower', 0xdcc7a8), floodlight: lit } as Swatch },
  { part: trim, material: { ...finish('bcn-pi-trim', 0xe9dfcc), floodlight: lit } as Swatch },
  { part: roof, material: finish('bcn-pi-roof', 0xaea392) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
], 6500)
