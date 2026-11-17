/**
 * Santa Maria del Mar, Barcelona — original procedural geometry, CC0-1.0.
 * bun generators/barcelona-santa-maria-del-mar.ts
 *
 * Uses the Gothic kit exported by generators/barcelona-cathedral.ts.
 *
 * Frame: built turned to the church's axis, BEARING 209.5. +y is the axis
 * towards the main front on the Plaça de Santa Maria (south-south-west), -y
 * the apse on the Passeig del Born; +x is the Carrer de Santa Maria side
 * (west-north-west), -x the Fossar de les Moreres side. z up, metres. Origin
 * = centroid of the OSM outline way/51260215.
 *
 * Evidence
 * - OSM way/51260215 (Q908802; its "height=13 m" is the chapels' band, not
 *   the church) and its building:parts: way/337762290 aisles and ambulatory
 *   27 m; the nave in bays, way/337762583, 337762683, 337801171, 337801172,
 *   337801173, 337856621 (32 m, gabled) and the apse's segments
 *   way/337857086, 337857336, 337857339, 337858088, 337858090, 337858093,
 *   337858235, 337858236, 337858237 (32 m); the two octagonal towers
 *   way/337762059 and way/337762061 (42 m); way/337762060 the corner under
 *   the west tower (13 m). The nave parts' joints (y = 34, 22, 8.7, -4.9,
 *   -18.3) are the bay lines the buttresses stand on.
 * - Published (en/ca/es.wikipedia "Santa Maria del Mar"): built 1329-1383;
 *   three naves, the aisles almost as high as the nave; the church laid out
 *   in the 33 cm medieval foot, 100 feet (33 m) wide and as high; plain
 *   walls, flat roofs, massive buttresses; the front framed by two octagonal
 *   towers and the two buttresses round the rose window (rebuilt 1459 after
 *   the 1428 earthquake); the west tower finished 1496, the east one crowned
 *   only in 1902. Tower heights from OSM (42 m), checked against the photos.
 * - Mapterhorn terrain (bun tools/terrain.ts grid, bearing 209.5): flat,
 *   within a metre under the whole church.
 * - Commons daylight photos (EVIDENCE):
 *   "057 Santa Maria del Mar (Barcelona), des del c. Argenteria.jpg" (Enric,
 *   CC BY-SA 4.0, the front and both towers from the south-west);
 *   "Fossar de les Moreres and Basilica de Santa Maria del Mar - Barcelona
 *   2014.jpg"
 *   (José Luiz, CC BY-SA 3.0, the whole south-east side, level and square on:
 *   the photo used to proportion the side);
 *   "Església de Santa Maria del Mar vista des del Passeig del Born.jpg"
 *   (Kippelboy, CC BY-SA 3.0, the apse end and its buttresses);
 *   "335 Santa Maria del Mar (Barcelona), façana sud, i peveter del Fossar de
 *   les Moreres.jpg"
 *   (Enric, CC BY-SA 4.0); "006 Santa Maria del Mar (Barcelona), absis, des
 *   del passeig del Born.jpg" (Enric, CC BY-SA 4.0).
 *
 * Estimated from the photos (scaled to OSM's 27, 32 and 42 m): the chapels'
 * band to 17.5 m, plain to 8 and two lancets a bay above; the aisle walls to 27
 * with one great window a bay; the buttresses standing out over the chapels
 * to 28.6; the nave's low roof (eaves 31, ridge 32) behind a front to 32.4; the front: portal and
 * gable to 18, the rose (r 5 at 23), the flanking lancets, the two front
 * buttresses; the towers' octagonal shafts to 29 and three open stages with
 * galleries to 42 (the openings drawn as dark lancets). Colours from the
 * daylight photos, pulled to the palette's lightness: honey-grey Montjuïc
 * sandstone, grey-brown stone terraces.
 *
 * Doubts: the tower diameter (OSM draws the octagons 4.8 m across; the
 * photos read wider, about 6 m, which is used); the north-west side (Carrer
 * de Santa Maria) is drawn as the mirror of the photographed south-east one.
 *
 * Night: the front and towers are floodlit on the Plaça de Santa Maria.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { arc, arch, cap, chamfer, circle, course, edges, hall, onWall, pinnacle, prism, rect, rose, save, turned, walls, type XY } from './barcelona-cathedral'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), iron = new Part(), door = new Part()
const FY = 39.05 // the front
const CH = 17.5, AISLE = 27, EAVE = 31, RIDGE = 32
const XC = 12.8, XN = 7.25, XO = 17.6 // aisle walls, nave walls, chapels' outer face
const AY = -25.3 // apse centre
const BAYS = [34.1, 22, 8.7, -4.9, -18.3]

// --- Body: chapels band, aisles, nave ---
prism(stone, rect(-XO, AY, XO, FY), 0, CH, roof)
course(trim, rect(-XO, AY, XO, FY), CH - 0.5, CH, 0.3)
prism(stone, rect(-XC, AY, XC, FY), CH, AISLE, roof)
course(trim, rect(-XC, AY, XC, FY), AISLE - 0.5, AISLE, 0.3)
hall(stone, roof, -XN, AY, XN, FY - 1.2, AISLE, EAVE, true, [false, false])

// --- Chevet: chapels ring, ambulatory, apse (seven sides of a 12-gon) ---
const chevet = (r: number, z0: number, z1: number, top: boolean, n = 7) => {
  const ring: XY[] = [[-r, AY], ...arc(0, AY, r, Math.PI, Math.PI, n).slice(1, -1), [r, AY]]
  walls(stone, ring.slice(), z0, z1)
  if (top) cap(roof, ring, z1)
  return ring
}
// the ring edges run from (-r, AY) round the end to (r, AY); the closing edge is inside the body
const chapR = chevet(17.6, 0, CH, true)
course(trim, chapR, CH - 0.5, CH, 0.3)
const ambR = chevet(12.8, CH, AISLE, true)
course(trim, ambR, AISLE - 0.5, AISLE, 0.3)
const apR = chevet(7.25, AISLE, EAVE, false)
{
  const tip: V3 = [0, AY, RIDGE]
  const r = arc(0, AY, 7.6, Math.PI, Math.PI, 7)
  for (let k = 0; k < r.length - 1; k++) roof.tri([r[k][0], r[k][1], EAVE - 0.1], [r[k + 1][0], r[k + 1][1], EAVE - 0.1], tip)
}
// windows round the chevet: a lancet a face in the chapels, a tall one in the ambulatory
edges(chapR).forEach(([a, b], i) => {
  if (i === chapR.length - 1) return
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  arch(win, a, b, L / 2, 2.0, 8.5, 15.8)
})
edges(ambR).forEach(([a, b], i) => {
  if (i === ambR.length - 1) return
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  arch(win, a, b, L / 2, 2.4, 18.5, 25.4)
})
edges(apR).forEach(([a, b], i) => {
  if (i === apR.length - 1) return
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  rose(win, a, b, L / 2, 28.8, 0.8, 0, 0.06, 10)
})
// radial buttresses round the chevet, standing out over the chapels
for (let k = 1; k < 7; k++) {
  const t = Math.PI + (k / 7) * Math.PI, c = Math.cos(t), s = Math.sin(t)
  const at = (r: number, w: number): XY => [r * c - w * s, AY + r * s + w * c]
  const ring: XY[] = [at(12.5, -1.2), at(17.9, -1.2), at(17.9, 1.2), at(12.5, 1.2)]
  prism(stone, chamfer(ring, 0.3), 0, AISLE + 1.6, stone)
}

// --- The long sides: buttresses over the chapels, two lancets a chapel bay, one great window a bay ---
for (const sd of [1, -1]) {
  const chap: [XY, XY] = sd > 0 ? [[XO, AY], [XO, FY]] : [[-XO, FY], [-XO, AY]]
  const ais: [XY, XY] = sd > 0 ? [[XC, AY], [XC, FY]] : [[-XC, FY], [-XC, AY]]
  const s = (y: number) => (sd > 0 ? y - AY : FY - y)
  const lines = [...BAYS, AY]
  for (const yb of BAYS.slice(1)) {
    const x0 = sd > 0 ? XC - 0.2 : -XO - 0.3, x1 = sd > 0 ? XO + 0.3 : -XC + 0.2
    prism(stone, chamfer(rect(x0, yb - 1.25, x1, yb + 1.25), 0.3), 0, AISLE + 1.6, stone)
  }
  for (let i = 0; i < lines.length - 1; i++) {
    const y0 = lines[i + 1], y1 = lines[i], yc = (y0 + y1) / 2, w = y1 - y0
    if (i > 0) for (const f of [-0.23, 0.23]) arch(win, chap[0], chap[1], s(yc + f * w), 2.4, 8.5, 16.2)
    arch(win, ais[0], ais[1], s(yc), i === 0 ? 2.6 : 3.4, 19.6, 26.0)
  }
  // a side portal in the first bay (the Sombrerers door on the -x side, the Santa Maria door on +x)
  const { P } = onWall(chap[0], chap[1])
  const sp = s((BAYS[0] + BAYS[1]) / 2)
  door.quad(P(sp - 1.4, 0, 0.08), P(sp + 1.4, 0, 0.08), P(sp + 1.4, 4.6, 0.08), P(sp - 1.4, 4.6, 0.08))
  arch(trim, chap[0], chap[1], sp, 4.4, 0, 8.4, 0.05)
}

// --- The front: buttresses round the rose, portal and gable, lancets, towers ---
{
  // front buttresses, proud of the face between them
  for (const sd of [1, -1]) {
    const x0 = sd > 0 ? 5.6 : -8.2, x1 = sd > 0 ? 8.2 : -5.6
    prism(stone, chamfer(rect(x0, FY - 1.5, x1, FY + 0.9), 0.3), 0, RIDGE + 1.0, stone)
    course(trim, chamfer(rect(x0, FY - 1.5, x1, FY + 0.9), 0.3), CH - 0.6, CH, 0.25)
  }
  prism(stone, rect(-XN, FY - 1.2, XN, FY), AISLE, RIDGE + 0.4, roof)
  const fa: XY = [5.6, FY], fb: XY = [-5.6, FY] // the face between the buttresses, outward +y
  // rose window with its ring and a hub
  rose(trim, fa, fb, 5.6, 23.2, 5.3, 4.6, 0.08, 16)
  rose(win, fa, fb, 5.6, 23.2, 4.6, 0, 0.08, 16)
  rose(trim, fa, fb, 5.6, 23.2, 1.1, 0, 0.12, 10)
  {
    // the rose's tracery: twelve spokes
    const { P } = onWall(fa, fb)
    for (let k = 0; k < 12; k++) {
      const t = (k / 12) * 2 * Math.PI, c = Math.cos(t), sn = Math.sin(t), w = 0.22
      const at = (r: number, d: number): V3 => P(5.6 + r * c - d * sn, 23.2 + r * sn + d * c, 0.11)
      trim.quad(at(1.0, -w), at(4.7, -w), at(4.7, w), at(1.0, w))
    }
  }
  // the portal: archivolt and gable, doors under the tympanum
  arch(trim, fa, fb, 5.6, 7.2, 0, 13.4, 0.12)
  arch(roof, fa, fb, 5.6, 5.4, 0, 11.8, 0.18)
  door.quad(...([[3.6, 0], [7.6, 0], [7.6, 5.4], [3.6, 5.4]] as XY[]).map(([s, z]) => onWall(fa, fb).P(s, z, 0.24)) as [V3, V3, V3, V3])
  {
    const { P } = onWall(fa, fb)
    trim.tri(P(1.6, 12.0, 0.3), P(9.6, 12.0, 0.3), P(5.6, 18.4, 0.3))
    trim.quad(P(9.6, 12.0, 0.3), P(9.6, 12.0, 0.05), P(5.6, 18.4, 0.05), P(5.6, 18.4, 0.3))
    trim.quad(P(5.6, 18.4, 0.3), P(5.6, 18.4, 0.05), P(1.6, 12.0, 0.05), P(1.6, 12.0, 0.3))
    for (const sx of [1.6, 9.6]) pinnacle(trim, P(sx, 0, 0.6)[0], P(sx, 0, 0.6)[1], 0.35, 0, 15.8, 18.6)
  }
    // the lancets between the buttresses and the towers
  for (const sd of [1, -1]) {
    const a: XY = sd > 0 ? [11.9, FY] : [-8.2, FY], b: XY = sd > 0 ? [8.2, FY] : [-11.9, FY]
    arch(win, a, b, 1.85, 2.4, 8.0, 19.5)
    arch(win, a, b, 1.85, 1.6, 21.5, 25.6)
  }
  // the towers: octagonal shafts from the ground, three open stages with galleries
  for (const sd of [1, -1]) {
    const cx = sd * 14.6, cy = 35.95, R = 3.0
    turned(stone, cx, cy, [[R, 0], [R, 28.6], [R + 0.35, 28.8], [R + 0.35, 29.6], [R - 0.15, 29.8], [R - 0.15, 33.6], [R + 0.25, 33.8], [R + 0.25, 34.4],
      [R - 0.3, 34.6], [R - 0.3, 38.0], [R + 0.1, 38.2], [R + 0.1, 38.8], [R - 0.45, 39.0], [R - 0.45, 41.2], [R - 0.15, 41.4], [R - 0.15, 42.0], [0, 42.0]], 8)
    const ring = (r: number) => circle(cx, cy, r, 8, Math.PI / 8)
    for (const [r, z0, z1, w] of [[R - 0.15, 30.2, 33.4, 1.0], [R - 0.3, 34.9, 37.8, 0.95], [R - 0.45, 39.2, 41.0, 0.8]] as [number, number, number, number][])
      edges(ring(r)).forEach(([a, b]) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); arch(win, a, b, L / 2, w, z0, z1) })
    // slit windows up the shaft on the outer faces
    edges(ring(R)).forEach(([a, b], i) => {
      if (i % 2) return
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      for (const z of [12, 20]) arch(win, a, b, L / 2, 0.55, z, z + 2.2)
    })
    // the 1902 tower's iron finial on the east (-x) tower; a small cap on the other
    if (sd < 0) turned(iron, cx, cy, [[0.5, 42], [0.5, 43.2], [0.12, 43.4], [0.12, 46.0], [0, 46.4]], 6)
    else turned(trim, cx, cy, [[1.2, 42], [0, 43.4]], 8)
  }
  // the corner bases under the towers, filling to the front and the side
}

// Close the bottom so the shadow pass sees a solid.
cap(stone, rect(-XO, -43, XO, FY), 0, false)

const lit = (p: V3, n: V3): number => (p[1] > 30 ? (n[2] > 0.7 ? 0.3 : 1) : 0)
await save('barcelona-santa-maria-del-mar', 'Santa Maria del Mar', [41.383813, 2.182031], 209.5, [
  { part: stone, material: { ...finish('bcn-mar-stone', 0xddcdb0), floodlight: lit } as Swatch },
  { part: trim, material: { ...finish('bcn-mar-trim', 0xeadcc2), floodlight: lit } as Swatch },
  { part: roof, material: finish('bcn-mar-roof', 0xb3a693) },
  { part: win, material: PALETTE.window },
  { part: iron, material: finish('bcn-mar-iron', 0x5d5a55) },
  { part: door, material: PALETTE.entrance },
], 6500)
