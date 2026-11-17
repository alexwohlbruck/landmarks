/**
 * Ángel de la Independencia (Monumento / Columna de la Independencia),
 * Paseo de la Reforma, Mexico City (Antonio Rivas Mercado, 1910; sculpture
 * Enrique Alciati): procedural, CC0-1.0.
 *   bun generators/mexico-city-angel-de-la-independencia.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 65.3: the
 * model's +y is the monument's front, which faces east-north-east down
 * Reforma toward the city centre (es.wikipedia: the Hidalgo group and the
 * lion are "en el oriente del pedestal"; photos from Reforma's east side
 * show the lion and Hidalgo square on). The square base's sides in OSM run
 * 65.3 / 155.3 degrees. Origin: the column, OSM way/176477230 (lng
 * -99.1676677, lat 19.4270037), on the roundabout's paving. The monument
 * is symmetric about its front axis apart from the sculpture, and is
 * modelled that way.
 *
 * Form: the round-and-square stepped platform (1986 steps, about 3 m) with
 * the four obelisk lamp standards on its corners; the 1910 steps (1.5 m)
 * up to the base; the first body with its four corner pedestals carrying
 * the seated bronzes (Peace, War, Justice, Law) and the bronze lion led by
 * a child on its front landing; the mausoleum block with the white
 * inscription tablet; the attic with the four standing marble heroes at
 * its corners and the marble Hidalgo group (Hidalgo with the flag, two
 * allegorical figures) on the front; the 2.9 m column with its lion-head
 * ring, wreath band and rings; the Corinthian capital with corner eagles;
 * the viewing balcony with its railing; the small lantern house; and the
 * gilded Winged Victory, leaning forward, wings up in a V, right hand
 * raising the laurel crown, left hand down and back with the broken chain.
 *
 * Sources
 * - OSM (ODbL): way/176477230 (building=yes, height=45, the column, a
 *   3 m circle) and relation/19438330 (building=yes multipolygon, outer
 *   way/1420845669: the first body, 13.2 m square with 2.5 m corner
 *   pedestals standing out on the diagonals; inner: the column). Both
 *   are buildings and are replaced. way/1420845680 (historic=monument,
 *   not a building): the platform, a 15.3 m radius circle with the
 *   square's corners standing out to 17.7 m where the obelisks are, so a
 *   25 m square; measured from it.
 * - Published (es.wikipedia "Monumento a la Independencia (Ciudad de
 *   México)"): column with the Victory 45 m, plus 1.5 m of 1910 steps and
 *   3 m of 1986 steps, 49.5 m in all; column diameter 2.90 m; balcony
 *   terrace 0.80 m wide; capital of four eagles with spread wings; the
 *   Victory 6.7 m (widely published), right arm raised with the crown,
 *   left arm down and back with a three-link chain; the arrangement and
 *   placement of all the sculpture.
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 Sarumo74, "Vista ote a pte del Monumento a la Independencia DF
 *     MEX.JPG", CC BY 3.0 (front, square on and level from the plaza:
 *     the main calibration photo, scale 28.5 px/m checked on the column's
 *     2.9 m and the Victory's 6.7 m);
 *     https://commons.wikimedia.org/wiki/File:Vista_ote_a_pte_del_Monumento_a_la_Independencia_DF_MEX.JPG
 *   2 Diego Delso, "Monumento a la Independencia, México D.F., México,
 *     2014-10-13, DD 19.JPG" and "DD 22.JPG", CC BY-SA 3.0 (front at
 *     dusk, floodlit: night look, obelisks, balcony);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_Independencia,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_19.JPG
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_Independencia,_M%C3%A9xico_D.F.,_M%C3%A9xico,_2014-10-13,_DD_22.JPG
 *   3 ProtoplasmaKid, "Glorieta del Ángel de la Independencia desde el
 *     aire.jpg", CC BY-SA 4.0 (straight down: the plan, stairs, corner
 *     pedestals and the Victory's spread);
 *     https://commons.wikimedia.org/wiki/File:Glorieta_del_%C3%81ngel_de_la_Independencia_desde_el_aire.jpg
 *   4 Mariordo (Mario Roberto Durán Ortiz), "Monumento de la Independencia
 *     (El Angel) 03 2014 Mex 8107.JPG" and "8113.JPG", CC BY-SA 3.0
 *     (front down Reforma by day: colours);
 *     https://commons.wikimedia.org/wiki/File:Monumento_de_la_Independencia_(El_Angel)_03_2014_Mex_8107.JPG
 *     https://commons.wikimedia.org/wiki/File:Monumento_de_la_Independencia_(El_Angel)_03_2014_Mex_8113.JPG
 *   5 Sergio Estrada Flores, "Monumento a la Independencia, Ciudad de
 *     México.jpg", CC BY-SA 4.0 (three-quarter from the north-west,
 *     platform, lawns);
 *     https://commons.wikimedia.org/wiki/File:Monumento_a_la_Independencia,_Ciudad_de_M%C3%A9xico.jpg
 *   6 ChaneekPhotography, "Angel Dorado.jpg", CC BY-SA 4.0 (the attic
 *     statues, column and Victory from below, side on).
 *     https://commons.wikimedia.org/wiki/File:Angel_Dorado.jpg
 * - Terrain: Mapterhorn has no z15 terrain here (tools/terrain.ts 404s);
 *   the site is on the flat lake-bed basin (~2,240 m), so y = 0 is the
 *   roundabout paving and elevation is 0.
 * - Heights (estimated from photo 1, calibrated on the published 45 m and
 *   4.5 m of steps; base B = 4.5 m): first body to B+2.7, corner pedestals
 *   B+3.0, mausoleum block B+2.7 to B+9.4 with its cornice, attic to
 *   B+10.5; column shaft B+11.5 to B+32.6 with the wreath band at
 *   B+17.3 and rings at B+23, B+27.4 and B+31.8; capital to B+35.4;
 *   balcony B+35.5; lantern house to B+38.3; Victory B+38.3 to B+45
 *   (drawn 1.45 times life, as the brief asks, so it reads at 80 px: its
 *   wing tip is 53.2 m, 3.7 m over the real 49.5). Plan sizes: first body
 *   13.2 m (OSM), mausoleum 8.6 m, attic 7.4 m, obelisk standards 8.6 m
 *   tall, all from photo 1.
 * - Colours from photos 4-6, pulled to the palette: grey cantera (column
 *   and pedestal) #a49d92, the pale 1986 platform and obelisks in `stone`,
 *   white Carrara marble statues `trim`, dark bronze #6b6455, the gilding
 *   #d8b050.
 * - Invented / simplified: all the sculpture is bold blocks (figures as
 *   tubes and ellipsoids at the real size and pose); the column's flutes,
 *   garlands, the rosette windows, the reliefs, the balustrades and the
 *   chain are left out; the balcony railing is drawn as posts and a rail.
 *
 * Night: the column and pedestal are floodlit from below (the city lights
 *   it white, or in colours for occasions; photo 2), the marble statues and
 *   the gilded Victory are lit, so all carry `floodlight`; the obelisks'
 *   globes are `lamp`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { body, ellipsoid, extrude, plus, prism, rect, save, scale, tube, unit, type XY } from './dc-wwii-memorial'

const cantera = new Part()
const pale = new Part()
const marble = new Part()
const bronze = new Part()
const gold = new Part()
const lamps = new Part()

const TAU = Math.PI * 2
const circle = (r: number, n: number, rot = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [r * Math.cos(rot + (i / n) * TAU), r * Math.sin(rot + (i / n) * TAU)])
const sq = (h: number, b = 0) => rect(0, 0, h, h, 0, b)
/** A round column-ish piece from [z, r] rows. */
const lathe = (p: Part, c: XY, rows: [number, number][], n = 16) => body(p, rows.map(([z, r]) => [z, r, r, c[0], c[1]]), n)

// ---- platform: the 1986 steps and the 1910 steps --------------------------
// The 25 m square landing at 3.0 m; its faces step down as arcs of the 15.3 m
// circle (four flights, one per side, as the plan shows).
const LAND = 3.0
prism(pale, sq(12.5, 0.3), 0, LAND, 0.2)
const STEPS = 5
for (let k = 0; k < STEPS; k++) {
  const r = 15.3 - k * 0.6
  prism(pale, circle(r, 32, Math.PI / 32), 0, (k + 1) * (LAND / STEPS) - 0.001, 0)
}
// The 1910 steps up to the first body: three treads of 0.5 m.
const B = 4.5
for (let k = 0; k < 3; k++) prism(pale, sq(10.4 - k * 0.6, 0.2), LAND, LAND + (k + 1) * 0.5, 0.06)

// ---- obelisk lamp standards on the landing's corners ------------------------
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c: XY = [sx * 11.4, sy * 11.4]
  prism(pale, rect(c[0], c[1], 1.0, 1.0, 0, 0.15), LAND, LAND + 2.0, 0.12)
  // The vase stage, then the lamp ring and the obelisk.
  lathe(pale, c, [[LAND + 2.0, 0.85], [LAND + 2.6, 0.95], [LAND + 3.6, 0.7], [LAND + 4.2, 0.55], [LAND + 4.6, 0.75], [LAND + 4.8, 0.75]], 8)
  prism(pale, rect(c[0], c[1], 0.45, 0.45), LAND + 4.8, LAND + 5.0, 0.05)
  // Obelisk: a tapering square shaft with a pyramidion.
  const s0 = 0.42, s1 = 0.28, z0 = LAND + 5.0, z1 = LAND + 8.0, z2 = LAND + 8.6
  const ring = (h: number, z: number): V3[] => [[c[0] - h, c[1] - h, z], [c[0] + h, c[1] - h, z], [c[0] + h, c[1] + h, z], [c[0] - h, c[1] + h, z]]
  pale.loft([ring(s0, z0), ring(s1, z1)])
  const tip: V3 = [c[0], c[1], z2]
  const top = ring(s1, z1)
  for (let i = 0; i < 4; i++) pale.tri(top[i], top[(i + 1) % 4], tip)
  // Four globes round the lamp ring, on short arms.
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * TAU + Math.PI / 4
    ellipsoid(lamps, [c[0] + 0.95 * Math.cos(a), c[1] + 0.95 * Math.sin(a), LAND + 4.95], [0.28, 0.28, 0.3], 6, 3)
  }
}

// ---- first body, corner pedestals, lion ---------------------------------------
prism(cantera, sq(6.6, 0.3), B, B + 0.5, 0.1)
prism(cantera, sq(6.3, 0.3), B + 0.5, B + 2.7, 0.2)
// A dark door in the front, the mausoleum's entrance.
bronze.quad([-0.8, 6.31, B], [0.8, 6.31, B], [0.8, 6.31, B + 2.2], [-0.8, 6.31, B + 2.2])
const PED = 6.15
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  prism(cantera, rect(sx * PED, sy * PED, 1.35, 1.35, 0, 0.2), B, B + 3.0, 0.15)
  // The seated bronzes (3.3 m) face out to the front or the back.
  seated([sx * PED, sy * PED, B + 3.0], sy, sx)
}

/** A seated allegorical bronze: a draped lap block, torso, head, one arm raised for the front pair. */
function seated(base: V3, face: number, side: number) {
  const k = 1.25
  const f = (x: number, y: number, z: number): V3 => [base[0] + x * k, base[1] + y * face * k, base[2] + z * k]
  const w = (a: number[]) => a.map(v => v * k)
  // Seat and draped lap, knees toward the face.
  ellipsoid(bronze, f(0, 0.1, 0.55), w([0.8, 0.9, 0.6]) as V3, 6, 4)
  tube(bronze, [f(0, -0.2, 0.9), f(0, -0.1, 1.8), f(0, 0, 2.5)], w([0.55, 0.55, 0.42]), w([0.4, 0.42, 0.3]), 8)
  ellipsoid(bronze, f(0, 0.05, 2.85), w([0.27, 0.28, 0.33]) as V3, 6, 3)
  if (face > 0) {
    // The front pair raise an arm (Law's tablet, Peace's branch), on the outer side.
    tube(bronze, [f(side * 0.45, -0.05, 2.35), f(side * 0.75, 0.15, 3.0), f(side * 0.8, 0.25, 3.6)], w([0.2, 0.17, 0.15]), undefined, 6)
  } else {
    tube(bronze, [f(side * 0.45, -0.05, 2.35), f(side * 0.6, 0.45, 1.8)], w([0.2, 0.17]), undefined, 6)
  }
}

// The bronze lion, walking across the front landing, led by the child.
// Drawn 1.3 times its estimated size so it reads as the dark mass it is.
{
  const z = B + 2.7, y = 5.0, k = 1.3
  const L = (x: number, dy: number, dz: number): V3 => [x * k, y + dy * k, z + dz * k]
  const r = (a: number[]) => a.map(v => v * k)
  ellipsoid(bronze, L(0.2, 0, 1.35), r([1.45, 0.55, 0.6]) as V3, 10, 5) // body
  ellipsoid(bronze, L(1.45, 0, 1.75), r([0.55, 0.6, 0.6]) as V3, 8, 4) // mane
  ellipsoid(bronze, L(1.95, 0, 1.7), r([0.32, 0.3, 0.3]) as V3, 6, 3) // muzzle
  for (const [x, dy] of [[-0.9, -0.3], [-0.8, 0.3], [1.0, -0.3], [1.2, 0.3]] as const)
    tube(bronze, [L(x, dy, 1.2), L(x + 0.05, dy, 0)], r([0.2, 0.17]), undefined, 6)
  tube(bronze, [L(-1.5, 0, 1.5), L(-2.0, 0, 1.0), L(-2.2, 0, 0.5)], r([0.09, 0.09, 0.11]), undefined, 5) // tail
  // The child, standing at the lion's shoulder on the near side.
  tube(bronze, [L(1.0, 0.85, 0), L(1.0, 0.85, 1.0), L(1.0, 0.85, 1.6)], r([0.2, 0.25, 0.2]), undefined, 6)
  ellipsoid(bronze, L(1.0, 0.85, 1.85), r([0.2, 0.2, 0.22]) as V3, 6, 3)
}

// ---- the mausoleum block and attic ----------------------------------------------
const M0 = B + 2.7, M1 = B + 8.7, A0 = B + 9.4, A1 = B + 10.5
prism(cantera, sq(4.6, 0.3), M0, M0 + 0.4, 0.1)
prism(cantera, sq(4.3, 0.4), M0 + 0.4, M1, 0.1)
// Pilasters at the corners, standing a little proud.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) prism(cantera, rect(sx * 3.95, sy * 3.95, 0.55, 0.55, 0, 0.1), M0 + 0.4, M1, 0.05)
// Cornice and attic.
prism(cantera, sq(4.75, 0.3), M1, A0, 0.25)
prism(cantera, sq(3.7, 0.3), A0, A1, 0.15)
// The white inscription tablets, front and back.
for (const s of [-1, 1]) {
  const y = s * 4.32
  const q: V3[] = [[-1.5, y, M0 + 2.8], [1.5, y, M0 + 2.8], [1.5, y, M0 + 4.6], [-1.5, y, M0 + 4.6]]
  if (s > 0) marble.quad(q[0], q[1], q[2], q[3])
  else marble.quad(q[1], q[0], q[3], q[2])
}

// ---- the marble heroes ------------------------------------------------------------
/** A standing marble figure facing +y·face, `h` tall, on its own feet at base. */
function standing(p: Part, base: V3, h: number, face: number, lean = 0) {
  const k = h / 3.2, g = 1.2
  const f = (x: number, y: number, z: number): V3 => [base[0] + x * k, base[1] + (y + lean * z / 3) * face * k, base[2] + z * k]
  tube(p, [f(0, 0, 0), f(0, 0, 1.2), f(0, 0, 1.75)], [0.42, 0.42, 0.42].map(v => v * k * g), [0.3, 0.3, 0.3].map(v => v * k * g), 8)
  tube(p, [f(0, 0, 1.7), f(0, 0, 2.3), f(0, 0, 2.62)], [0.42, 0.45, 0.36].map(v => v * k * g), [0.28, 0.3, 0.24].map(v => v * k * g), 8)
  ellipsoid(p, f(0, 0.02, 2.88), [0.23 * k * g, 0.24 * k * g, 0.27 * k * g], 6, 3)
}
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  prism(cantera, rect(sx * 3.25, sy * 3.25, 0.5, 0.5, 0, 0.08), A1, A1 + 0.5, 0.06)
  standing(marble, [sx * 3.25, sy * 3.25, A1 + 0.5], 3.9, sy)
}
// Hidalgo on his rock with the flag, front centre, with the two seated
// figures at his feet.
{
  const y = 2.5
  prism(marble, rect(0, y, 1.3, 1.0, 0, 0.3), A1, A1 + 2.0, 0.3)
  standing(marble, [0, y, A1 + 2.0], 4.4, 1)
  tube(marble, [[0.7, y + 0.1, A1 + 3.0], [0.95, y - 0.05, A1 + 7.4]], [0.1, 0.1], undefined, 5)
  // The flag, hung from the staff, both faces.
  const fl: V3[] = [[0.95, y - 0.05, A1 + 7.3], [0.9, y - 0.1, A1 + 5.3], [1.8, y - 0.7, A1 + 5.6], [1.95, y - 0.6, A1 + 7.4]]
  marble.quad(fl[0], fl[1], fl[2], fl[3]); marble.quad(fl[0], fl[3], fl[2], fl[1])
  for (const s of [-1, 1]) {
    const c: V3 = [s * 1.6, y + 0.75, A1]
    ellipsoid(marble, plus(c, [0, 0, 0.45]), [0.8, 0.85, 0.6], 8, 4)
    tube(marble, [plus(c, [0, -0.1, 0.8]), plus(c, [0, 0, 1.8]), plus(c, [0, 0.05, 2.3])], [0.55, 0.52, 0.4], [0.4, 0.42, 0.32], 8)
    ellipsoid(marble, plus(c, [0, 0.05, 2.65]), [0.27, 0.28, 0.32], 6, 3)
  }
}

// ---- the column --------------------------------------------------------------------
const C0 = A1, CS = B + 11.5, CT = B + 32.6, CAP = B + 35.0
prism(cantera, sq(2.05, 0.2), C0, C0 + 0.6, 0.12)
lathe(cantera, [0, 0], [
  [C0 + 0.6, 1.9], [C0 + 0.95, 1.9], [C0 + 1.0, 1.62],
  // Lion-head ring at the foot of the shaft.
  [CS, 1.62], [CS + 1.3, 1.62], [CS + 1.35, 1.45],
  [B + 16.7, 1.43],
  // The wreath band, the boldest ring.
  [B + 16.75, 1.68], [B + 18.1, 1.68], [B + 18.15, 1.42],
  [B + 22.8, 1.38], [B + 22.85, 1.53], [B + 23.35, 1.53], [B + 23.4, 1.37],
  [B + 27.2, 1.34], [B + 27.25, 1.49], [B + 27.75, 1.49], [B + 27.8, 1.33],
  [B + 31.6, 1.3], [B + 31.65, 1.45], [B + 32.15, 1.45], [B + 32.2, 1.3],
  [CT, 1.29], [CT + 0.05, 1.44], [CT + 0.4, 1.44], [CT + 0.45, 1.3],
  // The capital's bell.
  [CT + 1.2, 1.45], [CAP - 0.5, 1.95], [CAP, 2.15],
], 16)
// Corner eagles under the abacus: bold wedges spreading out on the diagonals.
for (let k = 0; k < 4; k++) {
  const a = (k / 4) * TAU + Math.PI / 4, d: V3 = [Math.cos(a), Math.sin(a), 0]
  tube(cantera, [scale(d, 1.3).map((v, i) => v + (i === 2 ? CT + 1.0 : 0)) as V3, plus(scale(d, 2.45), [0, 0, CAP - 0.15])], [0.45, 0.6], [0.32, 0.42], 6)
}
// Abacus and balcony floor.
prism(cantera, sq(2.4, 0.35), CAP, CAP + 0.4, 0.12)
const BAL = CAP + 0.5
prism(cantera, sq(2.6, 0.4), CAP + 0.4, BAL, 0.08)
// Railing: posts and a top rail, in bronze.
{
  const h = 2.5, zt = BAL + 1.0
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * TAU
    const ux = Math.round(Math.cos(a)), uy = Math.round(Math.sin(a))
    const p0: V3 = [h * (ux - uy), h * (uy + ux), zt], p1: V3 = [h * (ux + uy), h * (uy - ux), zt]
    tube(bronze, [p0, p1], [0.07, 0.07], [0.07, 0.07], 4, { ref: [0, 0, 1] })
    for (const t of [0, 0.5]) {
      const q: V3 = [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, BAL]
      prism(bronze, rect(q[0], q[1], 0.07, 0.07), BAL, zt, 0)
    }
  }
}
// The lantern house and its dome.
const TOP = B + 38.3
lathe(cantera, [0, 0], [[BAL, 1.15], [TOP - 0.9, 1.15], [TOP - 0.85, 1.32], [TOP - 0.6, 1.32], [TOP - 0.55, 1.1], [TOP - 0.2, 0.85], [TOP, 0.55], [TOP + 0.05, 0.001]], 14)

// ---- the Winged Victory -----------------------------------------------------------------
// Drawn in its own frame (origin at its feet, +y its front, metres of the
// real 6.7 m statue) and scaled 1.45 onto the lantern, so it reads at 80 px.
{
  const S = 1.45
  const V = (p: V3): V3 => [p[0] * S, p[1] * S, TOP + p[2] * S]
  const T = (path: V3[], w: number[], d = w, n = 8) => tube(gold, path.map(V), w.map(v => v * S), d.map(v => v * S), n)
  const E = (c: V3, r: V3, n = 8, rows = 4) => ellipsoid(gold, V(c), r.map(v => v * S) as V3, n, rows)
  // The little sphere she alights on.
  E([0, 0, 0.35], [0.4, 0.4, 0.4])
  // Robe and legs: forward foot down on the sphere, drapery streaming back.
  T([[0, 0.05, 0.6], [0, 0.15, 1.8], [0, 0.3, 2.9]], [0.36, 0.48, 0.52], [0.36, 0.45, 0.4], 10)
  T([[0, 0.25, 2.6], [0, -0.5, 1.7], [0, -1.15, 1.15]], [0.34, 0.3, 0.2], [0.34, 0.26, 0.16])
  // Torso, leaning forward, and the head.
  T([[0, 0.3, 2.85], [0, 0.55, 4.0], [0, 0.72, 4.75]], [0.5, 0.55, 0.42], [0.36, 0.4, 0.32], 10)
  E([0, 0.85, 5.2], [0.3, 0.32, 0.36])
  // Right arm raised high with the laurel crown (on her right, +x).
  T([[0.42, 0.65, 4.55], [0.75, 0.95, 5.45], [0.72, 1.15, 6.3]], [0.17, 0.15, 0.13])
  {
    const c = V([0.72, 1.2, 6.65]), r0 = 0.3 * S, r1 = 0.45 * S, n = 10
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU
      // A thick ring in the x–z plane, facing forward.
      const P = (r: number, a: number, w: number): V3 => [c[0] + r * Math.cos(a), c[1] + w, c[2] + r * Math.sin(a)]
      gold.quad(P(r0, a0, 0.1), P(r0, a1, 0.1), P(r1, a1, 0.1), P(r1, a0, 0.1))
      gold.quad(P(r0, a1, -0.1), P(r0, a0, -0.1), P(r1, a0, -0.1), P(r1, a1, -0.1))
      gold.quad(P(r1, a0, 0.1), P(r1, a1, 0.1), P(r1, a1, -0.1), P(r1, a0, -0.1))
    }
  }
  // Left arm down and back with the chain.
  T([[-0.42, 0.6, 4.5], [-0.8, 0.35, 3.8], [-1.0, -0.05, 3.2]], [0.16, 0.14, 0.12])
  T([[-1.0, -0.05, 3.15], [-1.05, -0.15, 2.4]], [0.07, 0.07])
  // The wings: thick feathered blades rising from her shoulders in a V,
  // swept back. Her right wing a little higher, as in the photos.
  for (const s of [-1, 1]) {
    const root: V3 = [s * 0.25, 0.25, 4.6]
    const tip: V3 = [s * (s > 0 ? 2.7 : 2.5), -1.1, s > 0 ? 7.1 : 6.7]
    const e1 = unit([tip[0] - root[0], tip[1] - root[1], tip[2] - root[2]])
    // e2: across the wing, toward its trailing edge (back and down).
    const back: V3 = [0, -0.7, -0.7]
    const d = e1[0] * back[0] + e1[1] * back[1] + e1[2] * back[2]
    const e2 = unit([back[0] - e1[0] * d, back[1] - e1[1] * d, back[2] - e1[2] * d])
    const L = Math.hypot(tip[0] - root[0], tip[1] - root[1], tip[2] - root[2])
    const outline: XY[] = [[0, -0.2], [L, 0], [0.84 * L, 0.6], [0.66 * L, 1.05], [0.46 * L, 1.45], [0.26 * L, 1.5], [0.06 * L, 0.95]]
    const nrm: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
    extrude(gold, outline, -0.14, 0.14, (u, v, w) => V(plus(root, plus(scale(e1, u), plus(scale(e2, v), scale(nrm, w))))))
  }
}

// ---- night ------------------------------------------------------------------------------
// Floodlit from the landing and the balcony: full on walls and the shaft,
// a little less high up; faces looking up get little.
const flood = (p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 1) * (p[2] > B + 36 ? 0.85 : 1)
const lit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.5 : 1)

await save('mexico-city-angel-de-la-independencia', 'Ángel de la Independencia', [
  { part: cantera, material: { ...finish('cantera-grey', 0xa49d92), floodlight: flood } },
  { part: pale, material: PALETTE.stone },
  { part: marble, material: { ...finish('marble', 0xf4eee4), floodlight: lit } },
  { part: bronze, material: { ...finish('bronze', 0x6b6455), floodlight: lit } },
  { part: gold, material: { ...finish('victory-gold', 0xd8b050, 0.5), floodlight: lit } },
  { part: lamps, material: finish('lamp', 0xe9e4d8) },
], { bearing: 65.3 }, 6500)
