/**
 * Columbus Monument (Monument a Colom), Barcelona — original procedural
 * geometry, CC0-1.0. bun generators/barcelona-columbus-monument.ts
 *
 * Uses the kit exported by generators/barcelona-arc-de-triomf.ts.
 *
 * Frame: not turned (BEARING 0): +y north, +x east, z up, metres. Origin =
 * the centroid of the OSM outline way/126451774, the column's axis. The
 * statue faces the sea, south-south-east (compass 150), his right arm raised
 * and pointing out over the port.
 *
 * Evidence
 * - OSM way/126451774 (Monument a Colom, height 57, Q2288815, Gaieta Buigas,
 *   1888) and its parts: way/301766618 (the round stepped platform, r 14,
 *   1 m), way/301766623 (the lower base, r 9, 1-5 m), way/301766625 (the
 *   octagonal pedestal, corner radius 6.4, 5-13 m), way/301766620 (the
 *   column, r 2.3, 13-53 m).
 * - Published (ca/en.wikipedia "Monument a Colom"): 1888, 60 m to the top
 *   of the statue, a Corinthian cast-iron column on a stone base, eight
 *   bronze lions (Josep Carcasso), bronze Victories round the column's foot,
 *   a crown and a hemisphere under the 7.2 m bronze statue by Rafael Atche.
 * - Mapterhorn terrain (bun tools/terrain.ts grid): flat but for the 1.4 m
 *   platform itself, which the map fills away; the platform is modelled.
 * - Commons photos (EVIDENCE):
 *   "Monument a Colom, Barcelona, Spain - Jan 07.jpg" (Diliff, CC BY-SA 3.0;
 *   a level stitched elevation of the column, capital, crown and statue: the
 *   upper proportions are measured from it, scaled to a 2.7 m shaft);
 *   "Barcelona. Monument a Colom, GD008907.jpg" (Rafael Atche / Universite
 *   de Louvain lantern slide, public domain; the whole monument level from
 *   the square, steps and lions: the overall heights are measured from it,
 *   scaled to OSM's 57 m);
 *   "Barcelona - Monument a Colom (2).jpg" (Fred Romero, CC BY 2.0; the
 *   pedestal's top stage, the Victories and the column's foot);
 *   "Monument a Colom (Barcelona) 01.jpg" (Nicholas Gemini, CC BY-SA 4.0;
 *   the whole monument in evening sun from the Rambla, colours);
 *   "Monument a Colom i rambla de Mar.jpg" (Pere prlpz, CC BY-SA 3.0).
 *
 * Measured from the photos: a low, wide stepped platform to 0.9 (OSM's r 14);
 * a low plinth to 2.5; the tall, nearly vertical octagonal pedestal to 13.6
 * (about a fifth of the height), corbelled cornice to 14.9, upper stage to
 * 17.2; the column's foot
 * 17.2-19; shaft 19-41.5 (2.7 m across); capital to 45 (abacus 5 m); crown
 * and hemisphere to 50.6; statue to 57.2 (OSM 57). Estimated: the lions'
 * plinths at r 12 (paired, from the lantern slide), the four seated groups
 * on alternate pedestal faces, the Victories' size. Colours from the
 * daylight photos pulled to the palette's lightness: buff stone, the
 * cast-iron column painted dark bronze-grey, gilt bronze for the capital,
 * crown, statue, cartouche and band, grey-green bronze for the lions,
 * Victories and reliefs.
 *
 * Left out: the fluting, the reliefs, the griffins and shields, the lions'
 * detail (bold couchant blocks), the figures' detail; the statue is a bold
 * figure with a big pointing arm so it reads at 80 px.
 *
 * Night: the base and the column are floodlit.
 */
import { Part, type V3 } from './mesh'
import { finish, type Swatch } from './palette'
import { beam, lathe, ngon, prismN, quadN, relief, save, triN, turned, type XY } from './barcelona-arc-de-triomf'

const stone = new Part(), iron = new Part(), bronze = new Part(), gilt = new Part()

// --- the round stepped platform ---
turned(stone, 0, 0, [[14, 0], [14, 0.3], [13.0, 0.3], [13.0, 0.6], [12.0, 0.6], [12.0, 0.9], [0, 0.9]], 24)

// --- the lions, in pairs on plinths round the platform's edge ---
for (let k = 0; k < 8; k++) {
  const t = Math.PI / 4 + (Math.PI / 2) * Math.floor(k / 2) + (k % 2 ? 0.2 : -0.2)
  const cx = 12.2 * Math.cos(t), cy = 12.2 * Math.sin(t)
  const ux = Math.cos(t), uy = Math.sin(t), vx = -uy, vy = ux // u outward (the lion looks out), v across
  const P = (a: number, b: number): XY => [cx + ux * a + vx * b, cy + uy * a + vy * b]
  const box = (a0: number, a1: number, b0: number, b1: number): XY[] => [P(a0, b0), P(a1, b0), P(a1, b1), P(a0, b1)]
  prismN(stone, box(-1.7, 1.7, -0.9, 0.9), 0.9, 2.2, stone)
  // couchant body, raised chest, head and mane
  prismN(bronze, box(-1.5, 1.0, -0.55, 0.55), 2.2, 2.9, bronze)
  prismN(bronze, box(0.4, 1.3, -0.65, 0.65), 2.2, 3.6, bronze)
  prismN(bronze, box(1.0, 1.9, -0.45, 0.45), 3.1, 4.1, bronze)
}

// --- the low plinth at the platform's centre ---
const O8 = (r: number) => ngon(0, 0, r / Math.cos(Math.PI / 8), 8, Math.PI / 8 - 0.02)
prismN(stone, O8(7.4), 0.9, 2.4, stone)
prismN(stone, O8(7.7), 2.1, 2.5, stone)

// --- the tall octagonal pedestal: nearly vertical sides, seated groups at its foot, reliefs, cornice, upper stage ---
{
  const ring = ngon(0, 0, 6.2, 8, -0.02) // corners on the axes, as OSM maps it
  prismN(stone, ngon(0, 0, 6.35, 8, -0.02), 2.5, 3.2, null) // its base moulding
  prismN(stone, ring, 3.2, 13.6, null)
  prismN(stone, ngon(0, 0, 6.7, 8, -0.02), 13.6, 14.4, stone, stone)
  prismN(stone, ngon(0, 0, 6.4, 8, -0.02), 14.4, 14.9, stone)
  // the upper stage, in the same stone, with its corbel table
  prismN(stone, ngon(0, 0, 4.6, 8, -0.02), 14.9, 16.4, null)
  prismN(stone, ngon(0, 0, 5.0, 8, -0.02), 16.4, 17.2, stone, stone)
  for (let i = 0; i < 8; i++) {
    const a = ring[i], b = ring[(i + 1) % 8]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const tm = Math.atan2(a[1] + b[1], a[0] + b[0])
    // bronze reliefs and shields high on every face
    relief(bronze, a, b, [[L / 2 - 1.2, 9.8], [L / 2 + 1.2, 9.8], [L / 2 + 1.2, 12.4], [L / 2, 13.1], [L / 2 - 1.2, 12.4]], 0, 0.3)
    if (i % 2 === 0) {
      // a projecting plinth with a seated stone group
      const ux = Math.cos(tm), uy = Math.sin(tm), vx = -uy, vy = ux, ap = 6.2 * Math.cos(Math.PI / 8)
      const P = (s: number, w: number): XY => [ux * s + vx * w, uy * s + vy * w]
      const box = (s0: number, s1: number, w0: number, w1: number): XY[] => [P(s0, w0), P(s1, w0), P(s1, w1), P(s0, w1)]
      prismN(stone, box(ap - 0.2, ap + 2.2, -1.6, 1.6), 2.5, 4.4, stone)
      prismN(stone, box(ap - 0.2, ap + 1.4, -1.1, 1.1), 4.4, 5.8, stone) // seat and lap
      prismN(stone, box(ap - 0.2, ap + 0.9, -0.8, 0.8), 5.8, 7.4, stone) // torso
      turned(stone, ux * (ap + 0.35), uy * (ap + 0.35), [[0, 7.4], [0.42, 7.55], [0.45, 8.0], [0, 8.3]], 6)
    } else {
      // a bronze relief panel low on the other faces
      relief(bronze, a, b, [[L / 2 - 1.3, 4.2], [L / 2 + 1.3, 4.2], [L / 2 + 1.3, 6.4], [L / 2 - 1.3, 6.4]], 0, 0.12)
    }
  }
}

// --- the column: foot, Victories, shaft with its cartouche and band, capital ---
lathe(iron, 0, 0, [[2.75, 17.2], [2.75, 17.6], [2.35, 18.1], [2.0, 18.4], [2.25, 18.7], [1.7, 19.0], [1.4, 19.2]], 16)
lathe(iron, 0, 0, [[1.4, 19.2], [1.33, 30], [1.27, 41.2]], 16)
for (let k = 0; k < 4; k++) {
  // a winged Victory standing on the foot's rim, arms spread
  const t = Math.PI / 4 + (k * Math.PI) / 2, ux = Math.cos(t), uy = Math.sin(t)
  const cx = ux * 2.7, cy = uy * 2.7
  turned(bronze, cx, cy, [[0, 17.4], [0.45, 17.6], [0.55, 19.0], [0.38, 20.4], [0.3, 20.6], [0.28, 21.0], [0, 21.2]], 6)
  // wings: a plate behind her, rising in a V
  const vx = -uy, vy = ux
  const W = (a: number, s: number, z: number): V3 => [cx - ux * 0.35 + vx * s + ux * a, cy - uy * 0.35 + vy * s + uy * a, z]
  quadN(bronze, W(0, -0.3, 19.6), W(0, 0.3, 19.6), W(0, 1.3, 22.2), W(0, -1.3, 22.2), [ux, uy, 0])
  quadN(bronze, W(-0.12, 0.3, 19.6), W(-0.12, -0.3, 19.6), W(-0.12, -1.3, 22.2), W(-0.12, 1.3, 22.2), [-ux, -uy, 0])
  beam(bronze, [cx + vx * 0.2, cy + vy * 0.2, 20.3], [cx + vx * 1.3 + ux * 0.4, cy + vy * 1.3 + uy * 0.4, 21.0], 0.22)
  beam(bronze, [cx - vx * 0.2, cy - vy * 0.2, 20.3], [cx - vx * 1.3 + ux * 0.4, cy - vy * 1.3 + uy * 0.4, 21.0], 0.22)
}
// the cartouche ("Barcelona a Colon") and the band under the capital, gilt
lathe(gilt, 0, 0, [[1.34, 27.2], [1.5, 27.3], [1.5, 28.6], [1.34, 28.7]], 16)
lathe(gilt, 0, 0, [[1.27, 40.3], [1.42, 40.4], [1.42, 41.2], [1.27, 41.3]], 16)
// the Corinthian capital: a flaring bell of leaves under a square abacus
lathe(gilt, 0, 0, [[1.27, 41.2], [1.6, 41.6], [1.75, 42.6], [2.1, 43.5], [2.4, 44.1]], 12)
prismN(gilt, [[-2.4, -2.0], [-2.0, -2.4], [2.0, -2.4], [2.4, -2.0], [2.4, 2.0], [2.0, 2.4], [-2.0, 2.4], [-2.4, 2.0]], 44.1, 45.0, gilt, gilt)
// volutes: a bold scroll under each corner of the abacus
for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) turned(gilt, sx * 1.95, sy * 1.95, [[0, 43.3], [0.45, 43.4], [0.5, 44.1], [0, 44.15]], 6)

// --- the crown and hemisphere ---
lathe(gilt, 0, 0, [[0, 45.0], [1.55, 45.0], [1.7, 45.6], [1.75, 46.3], [2.15, 46.5], [2.2, 47.4], [2.0, 47.6]], 12)
// the crown's open rim round the hemisphere
lathe(gilt, 0, 0, [[2.0, 47.6], [2.2, 48.3], [1.95, 48.4]], 12)
lathe(gilt, 0, 0, [[1.9, 47.4], [1.85, 48.1], [1.6, 48.8], [1.15, 49.4], [0.7, 49.75], [0, 49.85]], 12)
turned(iron, 0, 0, [[0, 49.7], [0.75, 49.7], [0.8, 50.6], [0, 50.6]], 8)

// --- the statue: Columbus facing the sea, right arm raised and pointing ---
{
  const face = (150 * Math.PI) / 180 // compass bearing he faces
  const fx = Math.sin(face), fy = Math.cos(face) // forward
  const rx = Math.cos(face), ry = -Math.sin(face) // his right
  const Q = (f: number, r: number, z: number): V3 => [fx * f + rx * r, fy * f + ry * r, z]
  const z0 = 50.6
  // cloak and body: an elliptical, slightly tapering figure
  const ring = (z: number, a: number, b: number, n = 10): V3[] =>
    Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return Q(a * Math.cos(t), b * Math.sin(t), z) })
  const prof: [number, number, number][] = [[z0, 0.75, 0.95], [z0 + 1.6, 0.6, 0.85], [z0 + 3.6, 0.55, 0.8], [z0 + 4.5, 0.6, 0.85], [z0 + 4.9, 0.45, 0.6]]
  const rings = prof.map(([z, a, b]) => ring(z, a, b))
  for (let k = 0; k < rings.length - 1; k++)
    for (let i = 0; i < 10; i++) {
      const j = (i + 1) % 10, A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i]
      const m: V3 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 0], l = Math.hypot(m[0], m[1]) || 1
      quadN(gilt, A, B, C, D, [m[0] / l, m[1] / l, 0])
    }
  const top = rings[rings.length - 1]
  for (let i = 1; i < 9; i++) triN(gilt, top[0], top[i], top[i + 1], [0, 0, 1])
  // head
  lathe(gilt, fx * 0.05, fy * 0.05, [[0, z0 + 4.85], [0.32, z0 + 5.0], [0.4, z0 + 5.4], [0.33, z0 + 5.85], [0, z0 + 6.05]], 8)
  // the raised right arm, bold, pointing forward and out to sea
  beam(gilt, Q(0.05, 0.7, z0 + 4.45), Q(1.9, 1.05, z0 + 5.35), 0.42)
  beam(gilt, Q(1.9, 1.05, z0 + 5.35), Q(2.45, 1.15, z0 + 5.55), 0.28)
  // the left arm down, holding the chart
  beam(gilt, Q(0.1, -0.75, z0 + 4.4), Q(0.45, -0.95, z0 + 2.9), 0.38)
  beam(gilt, Q(0.45, -0.95, z0 + 2.9), Q(0.5, -0.95, z0 + 2.1), 0.3)
}

const lit = (p: V3, n: V3) => (p[2] < 45 ? (n[2] > 0.7 ? 0.3 : 1) : 0.5)
await save('barcelona-columbus-monument', 'Columbus Monument', [41.375803, 2.177774], 0, [
  { part: stone, material: { ...finish('colom-stone', 0xd9c7a8), floodlight: lit } as Swatch },
  { part: iron, material: { ...finish('colom-iron', 0x5e5a54), floodlight: lit } as Swatch },
  { part: bronze, material: { ...finish('colom-bronze', 0x6f7a68), floodlight: lit } as Swatch },
  { part: gilt, material: { ...finish('colom-gilt', 0xb39459), floodlight: lit } as Swatch },
])
