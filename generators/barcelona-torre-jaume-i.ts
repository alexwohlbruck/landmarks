/**
 * Torre de Jaume I, Port Vell aerial tramway tower, Barcelona — original
 * procedural geometry, CC0-1.0. bun generators/barcelona-torre-jaume-i.ts
 *
 * Uses the kit exported by generators/barcelona-arc-de-triomf.ts.
 *
 * Frame: built turned to the tower's legs, BEARING 32: its four faces look
 * along +-x and +-y. z up, metres. Origin = the centroid of the OSM outline
 * way/646563774, the tower's axis.
 *
 * Evidence
 * - OSM way/646563774 (Torre de Jaume I, man_made=tower, aerialway=pylon,
 *   lattice, height 107, Carles Buigas, 1931, Q2736529), the building
 *   outline relation/8997201 (building=tower, the square of the legs and
 *   the 38 m gallery, +-10 m in this frame, its inner ring +-5.5) and
 *   way/646563787 (building=yes, the square under the lower deck).
 * - Published (ca.wikipedia "Torre de Jaume I"): 107 m, steel lattice, 1931,
 *   the intermediate station of the Port aerial tramway (1931) between the
 *   Torre de Sant Sebastia and Montjuic.
 * - Mapterhorn terrain (bun tools/terrain.ts grid): flat, within 0.3 m.
 * - Commons daylight photos (EVIDENCE):
 *   "Torre de Jaume I (Barcelona)1788.JPG" (Joao Carvalho, CC BY-SA 2.5; the
 *   whole tower square on, level from the quay: every height is measured
 *   from it, scaled to the published 107 m);
 *   "2017 Torre de Jaume I vista des del WTC.jpg" (Jordiferrer, CC BY-SA 4.0;
 *   the top from the World Trade Center: the octagonal restaurant deck with
 *   its white truss band, the open station house, its hipped roof and the
 *   mast frame);
 *   "Base de la Torre Jaume I.jpg" (Jordiferrer, CC BY-SA 4.0; the legs'
 *   box girders, the lower deck and the name beam);
 *   "Barcelona - Torre Jaume I del Teleferico del Puerto de Barcelona 1.jpg"
 *   (Zarateman, CC0); "Torre de Jaume I - panoramio.jpg" (Mister No, CC BY
 *   3.0).
 *
 * Measured from the photos (107 m): legs from a 20 m square at the ground
 * to 15.2 m at the gallery (38) and 13.6 m at the top of the shaft (77);
 * eight braced panels; the gallery ring 22 m across at 38; a light ring at
 * 57.5; the restaurant deck flaring from 77 to 79.5, glazed to 82.7, 19.8 m
 * across; the station house 13.4 m square to 91; its roof to 94.5; the mast
 * frame and mast to 107. The lower deck at 8.5 m. Members drawn bolder than
 * they are (legs 1.0 m, braces 0.45 m), at the real panel count.
 * Colours from the daylight photos, pulled to the palette's lightness: grey
 * steel, charcoal deck and cabin, white truss band and station frame, a
 * pale corrugated roof.
 *
 * Left out: the cable car, its cables and saddles; the stairs; the inner
 * lift shaft; railings (the gallery and deck carry solid low parapets).
 *
 * Night: the restaurant's glazing is lit; the steel takes a light wash.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { beam, ngon, prismN, quadN, save, turned, type XY } from './barcelona-arc-de-triomf'

const steel = new Part(), dark = new Part(), white = new Part(), roof = new Part(), win = new Part()

// --- the four legs: half-width h at height z ---
const H: [number, number][] = [[0, 10], [38, 7.6], [77, 6.8]]
const half = (z: number) => {
  for (let i = 0; i < H.length - 1; i++) if (z <= H[i + 1][0]) return H[i][1] + ((H[i + 1][1] - H[i][1]) * (z - H[i][0])) / (H[i + 1][0] - H[i][0])
  return H[H.length - 1][1]
}
const LEVELS = [0, 9.5, 19, 28.5, 38, 47.75, 57.5, 67.25, 77]
const C = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
const P = (k: number, z: number): V3 => [C[k][0] * half(z), C[k][1] * half(z), z]
for (let k = 0; k < 4; k++) for (let i = 0; i < LEVELS.length - 1; i++) beam(steel, P(k, Math.max(LEVELS[i], 0.6)), P(k, LEVELS[i + 1]), 1.0)
// the feet: a low steel shoe under each leg
for (let k = 0; k < 4; k++) { const [x, y] = [P(k, 0)[0], P(k, 0)[1]]; prismN(steel, [[x - 0.9, y - 0.9], [x + 0.9, y - 0.9], [x + 0.9, y + 0.9], [x - 0.9, y + 0.9]], 0, 0.9, steel) }
// ring beams and the big X of every panel, on each face
for (let i = 1; i < LEVELS.length; i++) for (let k = 0; k < 4; k++) beam(steel, P(k, LEVELS[i]), P((k + 1) % 4, LEVELS[i]), 0.6)
for (let i = 0; i < LEVELS.length - 1; i++)
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    beam(steel, P(k, Math.max(LEVELS[i], 0.6)), P(j, LEVELS[i + 1]), 0.45)
    beam(steel, P(j, Math.max(LEVELS[i], 0.6)), P(k, LEVELS[i + 1]), 0.45)
  }
// the central post the stairs climb round
beam(steel, [0, 0, 8.5], [0, 0, 77], 1.2)

// --- the lower deck and the name beam ---
prismN(dark, [[-5.5, -5.5], [5.5, -5.5], [5.5, 5.5], [-5.5, 5.5]], 8.3, 9.0, dark, dark)
for (const s of [1, -1]) beam(white, [-half(6.2), s * half(6.2), 6.2], [half(6.2), s * half(6.2), 6.2], 1.1, [0, 0, 1])

// --- the gallery at 38 m and the light ring at 57.5 ---
{
  const ring = (r0: number, r1: number, z0: number, z1: number, p: Part) => {
    const o = ngon(0, 0, r1, 8, Math.PI / 8), i = ngon(0, 0, r0, 8, Math.PI / 8)
    prismN(p, o, z0, z1, null)
    for (let k = 0; k < 8; k++) {
      const a = o[k], b = o[(k + 1) % 8], c = i[(k + 1) % 8], d = i[k]
      quadN(p, [a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1], [d[0], d[1], z1], [0, 0, 1])
      quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [c[0], c[1], z0], [d[0], d[1], z0], [0, 0, -1])
    }
  }
  ring(6.2, 11.6, 37.4, 38.2, dark)
  ring(11.2, 11.6, 38.2, 39.4, steel) // the parapet
  // the dished underside, from the legs out to the rim
  {
    const lo = ngon(0, 0, 7.4, 8, Math.PI / 8), hi = ngon(0, 0, 11.6, 8, Math.PI / 8)
    for (let k = 0; k < 8; k++) {
      const j = (k + 1) % 8, tm = Math.PI / 8 + ((k + 0.5) * Math.PI) / 4
      quadN(dark, [lo[k][0], lo[k][1], 35.6], [lo[j][0], lo[j][1], 35.6], [hi[j][0], hi[j][1], 37.4], [hi[k][0], hi[k][1], 37.4], [Math.cos(tm) * 0.4, Math.sin(tm) * 0.4, -0.9])
    }
  }
  // its brackets: struts from the legs out under the rim
  for (let k = 0; k < 8; k++) {
    const t = Math.PI / 8 + (k * Math.PI) / 4
    beam(steel, [7.0 * Math.cos(t), 7.0 * Math.sin(t), 33.5], [11.0 * Math.cos(t), 11.0 * Math.sin(t), 37.4], 0.4)
  }
  ring(6.6, 8.6, 57.2, 57.8, steel)
}

// --- the restaurant deck: an octagon flaring out over the shaft ---
{
  const lo = ngon(0, 0, 7.3, 8, Math.PI / 8), mid = ngon(0, 0, 10.4, 8, Math.PI / 8), top = ngon(0, 0, 10.8, 8, Math.PI / 8)
  for (let k = 0; k < 8; k++) {
    const j = (k + 1) % 8
    const A: V3 = [lo[k][0], lo[k][1], 77], B: V3 = [lo[j][0], lo[j][1], 77], Cc: V3 = [mid[j][0], mid[j][1], 79.4], D: V3 = [mid[k][0], mid[k][1], 79.4]
    const tm = Math.PI / 8 + ((k + 0.5) * Math.PI) / 4
    quadN(dark, A, B, Cc, D, [Math.cos(tm) * 0.6, Math.sin(tm) * 0.6, -0.8])
  }
  // the white truss band and the glazed walls leaning out, the roof deck
  prismN(white, mid, 79.4, 80.2, null)
  for (let k = 0; k < 8; k++) {
    const j = (k + 1) % 8
    const A: V3 = [mid[k][0], mid[k][1], 80.2], B: V3 = [mid[j][0], mid[j][1], 80.2], Cc: V3 = [top[j][0], top[j][1], 82.7], D: V3 = [top[k][0], top[k][1], 82.7]
    const tm = Math.PI / 8 + ((k + 0.5) * Math.PI) / 4
    quadN(dark, A, B, Cc, D, [Math.cos(tm), Math.sin(tm), -0.15])
    // the windows: one broad panel a side, set on the leaning wall
    const f = (u: number, v: number): V3 => {
      const lx = A[0] + (B[0] - A[0]) * u, ly = A[1] + (B[1] - A[1]) * u, hx = D[0] + (Cc[0] - D[0]) * u, hy = D[1] + (Cc[1] - D[1]) * u
      return [lx + (hx - lx) * v + Math.cos(tm) * 0.05, ly + (hy - ly) * v + Math.sin(tm) * 0.05, 80.2 + 2.5 * v]
    }
    quadN(win, f(0.08, 0.2), f(0.92, 0.2), f(0.92, 0.85), f(0.08, 0.85), [Math.cos(tm), Math.sin(tm), -0.15])
  }
  prismN(dark, top, 82.7, 82.95, dark)
}

// --- the station house: an open white frame round a dark machine room ---
{
  const h = 6.7, z0 = 82.95, z1 = 91
  prismN(dark, [[-5.9, -5.9], [5.9, -5.9], [5.9, 5.9], [-5.9, 5.9]], z0, z1 - 0.6, null)
  for (const [x, y] of C) beam(white, [x * h, y * h, z0], [x * h, y * h, z1], 0.7)
  for (let k = 0; k < 4; k++) {
    const a = C[k], b = C[(k + 1) % 4]
    beam(white, [a[0] * h, a[1] * h, z1 - 0.4], [b[0] * h, b[1] * h, z1 - 0.4], 0.8)
    beam(white, [a[0] * h, a[1] * h, z0 + 0.4], [b[0] * h, b[1] * h, z0 + 0.4], 0.6)
    // one diagonal brace a face, as the photo shows
    beam(white, [a[0] * h, a[1] * h, z0 + 0.4], [(a[0] + b[0]) * h * 0.5, (a[1] + b[1]) * h * 0.5, z1 - 0.4], 0.35)
  }
  // the hipped corrugated roof, a railed platform on it, the mast frame and mast
  turned(roof, 0, 0, [[0.01, z1], [7.3 * Math.SQRT2, z1], [7.3 * Math.SQRT2, z1 + 0.2], [3.3 * Math.SQRT2, 94.5], [0, 94.5]], 4, Math.PI / 4)
  prismN(steel, [[-3.0, -3.0], [3.0, -3.0], [3.0, 3.0], [-3.0, 3.0]], 94.5, 95.4, null)
  for (const [x, y] of C) beam(steel, [x * 2.3, y * 2.3, 94.5], [x * 0.35, y * 0.35, 101.5], 0.32)
  beam(steel, [0, 0, 94.5], [0, 0, 107], 0.38)
}

const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : 0.5)
await save('barcelona-torre-jaume-i', 'Torre de Jaume I', [41.372075, 2.18011], 32, [
  { part: steel, material: { ...finish('jaume-steel', 0x7a8086), floodlight: lit } as Swatch },
  { part: dark, material: finish('jaume-cabin', 0x4d535b) },
  { part: white, material: finish('jaume-white', 0xe6e5e0) },
  { part: roof, material: finish('jaume-roof', 0xbab6ad) },
  { part: win, material: PALETTE.window },
])
