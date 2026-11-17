/**
 * Unconditional Surrender (Seward Johnson; the painted bronze cast
 * installed here in 2013 replaced the 2007 foam-and-aluminium original),
 * Tuna Harbor Park beside the USS Midway, San Diego — original procedural
 * geometry, CC0-1.0.
 * bun generators/sd-unconditional-surrender.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the OSM node
 * node/3138121800 (tourism=artwork), 32.71290, -117.17517, on the ground
 * of the promenade; bearing 0.
 *
 * Identity, in order: the kiss — a giant sailor in navy blues leaning in
 * over a nurse in a white dress who is dipped back across his arm, her
 * left leg kicked up behind her, his white cap on top; her right arm hangs
 * with a clenched fist, her left fist is raised beside his head; the
 * colours (navy, white, skin); the low round plinth.
 *
 * Evidence:
 *  - size: published 25 ft (7.6 m) tall (Port of San Diego; Wikipedia
 *    "Unconditional Surrender (sculpture)"). Lidar CA_SanDiegoQL2_2014
 *    (0.5 m, flown after the bronze went up) reads the top 7.3 m above
 *    the promenade, the plinth ~0.45 m; the figure is drawn 6.8 m above
 *    the plinth, 7.25 m in all.
 *  - pose and orientation: the sailor stands on the west side and the
 *    nurse in front of him on the east, both facing east; she is dipped
 *    back into his arms and to the north with her face turned up, he
 *    bends over her north shoulder (NAIP at 0.15 m: the dark sailor west
 *    of the white nurse; allyndon's photo from the south shows him on the
 *    left, her on the right; Roman Eugeniusz's from the east shows her
 *    front with him behind, the heads to the north). Limb positions are
 *    estimated from the photos against the figures' height; every part
 *    is a simple tapered mass.
 *  - plinth: round, ~6 m across and 0.45 m high (photos, lidar).
 *  - colours: from the daylight photos — navy-black uniform (pulled to
 *    the palette), white cap and dress, skin, black shoes, the nurse's
 *    white shoes, auburn hair, a concrete-grey plinth.
 *  - night: the figures are floodlit from ground lights around the
 *    plinth: a floodlight wash, strongest low on the figures.
 *
 * Photos (Wikimedia Commons): ...the_historic_kiss_-_Flickr_-_allyndon.jpg
 * (allyndon, CC0); Marina,_San_Diego,_CA,_USA_-_panoramio_(41).jpg and
 * (21).jpg (Roman Eugeniusz, CC BY-SA 3.0); The_"Unconditional_Surrender,"
 * _-_panoramio.jpg (rosalynn carmen, CC BY-SA 3.0); Embracing_Peace.jpg
 * (Agnese Pellino, CC BY-SA 4.0); The_Unconditional_Surrender_Statue.jpg
 * (Seankimstyle, CC BY-SA 4.0); USMC-100510-M-5451B-043.jpg (public
 * domain). Kissing_couple_-_panoramio.jpg (Alen Ištoković, CC BY 3.0)
 * shows the earlier foam statue on its square base, not this one.
 * No commercial imagery.
 *
 * Left out: faces, fingers, the roses, the dress's buttons and pockets,
 * the sailor's collar stripes, the plaque.
 *
 * Doubts: the orientation is from a 0.15 m aerial and photos with no
 * precise viewpoint; the axis could be turned 10–20°. The limb geometry
 * is estimated.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './chi-aon-center'
import { face } from './phl-independence-hall'

const P0 = 0.45 // plinth top

/** An n-sided tapering tube from A to B, elliptical (r0 along e1 by k). */
function tube(p: Part, A: V3, B: V3, r0: number, r1: number, n = 8, k = 1, caps = true) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0]
  let e1: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
  const l1 = Math.hypot(...e1); e1 = [e1[0] / l1, e1[1] / l1, e1[2] / l1]
  const e2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
  const ring = (C: V3, r: number) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * 2 * Math.PI, c = Math.cos(t) * r * k, s = Math.sin(t) * r
    return [C[0] + c * e1[0] + s * e2[0], C[1] + c * e1[1] + s * e2[1], C[2] + c * e1[2] + s * e2[2]] as V3
  })
  const ra = ring(A, r0), rb = ring(B, r1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const m: V3 = [(ra[i][0] + ra[j][0]) / 2 - A[0], (ra[i][1] + ra[j][1]) / 2 - A[1], (ra[i][2] + ra[j][2]) / 2 - A[2]]
    face(p, [ra[i], ra[j], rb[j], rb[i]], m)
  }
  if (caps) { face(p, rb, u); face(p, ra, [-u[0], -u[1], -u[2]]) }
}

/** A loft through rings given as (centre, half-width along y, half-depth along x). */
function loft(p: Part, rings: [V3, number, number][], n = 10, capTop = true, capBottom = true) {
  const R = rings.map(([c, ry, rx]) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * 2 * Math.PI
    return [c[0] + rx * Math.cos(t), c[1] + ry * Math.sin(t), c[2]] as V3
  }))
  for (let k = 0; k < R.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, c = rings[k][0]
    const m: V3 = [(R[k][i][0] + R[k][j][0]) / 2 - c[0], (R[k][i][1] + R[k][j][1]) / 2 - c[1], 0]
    face(p, [R[k][i], R[k][j], R[k + 1][j], R[k + 1][i]], m)
  }
  if (capTop) face(p, R[R.length - 1], [0, 0, 1])
  if (capBottom) face(p, R[0], [0, 0, -1])
}

/** A blob (low-poly ellipsoid) at C with radii (rx, ry, rz). */
function blob(p: Part, C: V3, rx: number, ry: number, rz: number, n = 8, m = 5) {
  const pt = (i: number, j: number): V3 => {
    const th = (i / n) * 2 * Math.PI, ph = (j / m) * Math.PI - Math.PI / 2
    return [C[0] + rx * Math.cos(ph) * Math.cos(th), C[1] + ry * Math.cos(ph) * Math.sin(th), C[2] + rz * Math.sin(ph)]
  }
  for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) {
    const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
    const mid: V3 = [(a[0] + c[0]) / 2 - C[0], (a[1] + c[1]) / 2 - C[1], (a[2] + c[2]) / 2 - C[2]]
    const pts = j === 0 ? [a, c, d] : j === m - 1 ? [a, b, c] : [a, b, c, d]
    face(p, pts, mid)
  }
}

function build() {
  const navy = new Part(), white = new Part(), skin = new Part(), black = new Part(), plinth = new Part(), hair = new Part()
  const z = (h: number) => P0 + h

  // ---------------------------------------------------------- plinth
  loft(plinth, [[[0.1, 0, 0], 3.0, 3.0], [[0.1, 0, P0 - 0.08], 3.0, 3.0], [[0.1, 0, P0], 2.92, 2.92]], 24, true, false)

  // ----------------------------------------------------------- sailor
  // Stands on the west side, facing east, bent forward over her and to
  // the north to reach her upturned face.
  tube(navy, [-0.5, 0.3, z(3.35)], [-0.35, 0.36, z(0.25)], 0.42, 0.37)
  tube(navy, [-0.6, -0.3, z(3.35)], [-0.95, -0.36, z(0.25)], 0.42, 0.37)
  for (const [x, y] of [[-0.25, 0.36], [-0.85, -0.36]]) {
    loft(black, [[[x + 0.1, y, z(0)], 0.24, 0.5], [[x + 0.08, y, z(0.28)], 0.22, 0.44]], 8)
  }
  // Torso (jumper), hips to shoulders.
  loft(navy, [
    [[-0.58, 0, z(3.1)], 0.82, 0.5],
    [[-0.5, 0.03, z(4.1)], 0.86, 0.52],
    [[-0.38, 0.15, z(5.1)], 0.98, 0.52],
    [[-0.28, 0.28, z(5.62)], 0.88, 0.45],
  ], 10)
  // Neck and head, bowed to her face; the white cap.
  tube(skin, [-0.25, 0.3, z(5.58)], [-0.05, 0.6, z(5.92)], 0.24, 0.22, 6)
  blob(skin, [0.08, 0.78, z(6.05)], 0.44, 0.38, 0.44)
  blob(black, [-0.1, 0.72, z(6.25)], 0.38, 0.38, 0.32, 8, 4)
  tube(white, [-0.06, 0.72, z(6.3)], [-0.18, 0.66, z(6.8)], 0.47, 0.55, 10)
  // Arms: right (south) round her waist, left (north) behind her shoulders.
  tube(navy, [-0.3, -0.85, z(5.4)], [0.15, -0.95, z(4.55)], 0.27, 0.23)
  tube(navy, [0.15, -0.95, z(4.55)], [0.75, -0.45, z(4.15)], 0.23, 0.2)
  blob(skin, [0.86, -0.32, z(4.12)], 0.22, 0.2, 0.22, 6, 4)
  tube(navy, [-0.2, 1.05, z(5.45)], [0.3, 1.35, z(4.85)], 0.27, 0.23)
  tube(navy, [0.3, 1.35, z(4.85)], [0.6, 0.95, z(4.8)], 0.23, 0.2)
  blob(skin, [0.68, 0.82, z(4.82)], 0.22, 0.2, 0.22, 6, 4)

  // ------------------------------------------------------------ nurse
  // In front of him on the east, facing east, dipped back into his arms
  // and to the north, her face turned up to his.
  // Legs: right (south) planted; left (north) bent, the heel kicked up.
  tube(skin, [0.58, -0.3, z(3.0)], [0.62, -0.38, z(0.25)], 0.31, 0.17)
  loft(white, [[[0.68, -0.38, z(0)], 0.2, 0.42], [[0.66, -0.38, z(0.3)], 0.18, 0.32]], 8)
  tube(skin, [0.62, 0.25, z(2.9)], [1.05, 0.5, z(1.5)], 0.31, 0.2)
  tube(skin, [1.05, 0.5, z(1.5)], [1.0, 0.95, z(0.62)], 0.2, 0.15)
  tube(white, [0.95, 0.95, z(0.62)], [1.35, 1.1, z(0.3)], 0.2, 0.17, 6)
  // Skirt, flaring from the waist to the hem, swung east.
  loft(white, [
    [[0.85, -0.05, z(2.4)], 0.82, 0.78],
    [[0.7, -0.07, z(2.95)], 0.66, 0.6],
    [[0.58, -0.08, z(3.45)], 0.56, 0.46],
  ], 10)
  // Bodice, arched back (west and north) to her shoulders.
  loft(white, [
    [[0.58, -0.08, z(3.4)], 0.56, 0.46],
    [[0.52, 0.2, z(4.15)], 0.64, 0.46],
    [[0.42, 0.62, z(4.75)], 0.7, 0.42],
    [[0.38, 0.82, z(4.98)], 0.52, 0.35],
  ], 10)
  // Neck and head thrown back, face up to his; her auburn hair behind.
  tube(skin, [0.38, 0.85, z(4.95)], [0.42, 1.0, z(5.3)], 0.19, 0.18, 6)
  blob(skin, [0.45, 1.08, z(5.55)], 0.33, 0.3, 0.36)
  blob(hair, [0.3, 1.32, z(5.45)], 0.34, 0.32, 0.38, 8, 4)
  // Arms: right (south) hanging to a fist, left (north) raised by his head.
  tube(white, [0.45, -0.05, z(4.75)], [0.8, -0.42, z(3.95)], 0.2, 0.18, 6)
  tube(skin, [0.8, -0.42, z(3.95)], [0.95, -0.48, z(3.3)], 0.14, 0.12, 6)
  blob(skin, [0.98, -0.48, z(3.18)], 0.17, 0.16, 0.19, 6, 4)
  tube(white, [0.4, 1.3, z(4.85)], [0.85, 1.55, z(5.35)], 0.2, 0.18, 6)
  tube(skin, [0.85, 1.55, z(5.35)], [0.7, 1.3, z(6.0)], 0.14, 0.12, 6)
  blob(skin, [0.68, 1.25, z(6.14)], 0.17, 0.16, 0.19, 6, 4)

  // Ground lights wash the figures; the wash fades up the statue.
  const lit = (p: V3, n: V3) => (p[2] > P0 + 0.1 ? Math.max(0.35, 0.95 - (p[2] - P0) * 0.08) * (n[2] > 0.8 ? 0.4 : 1) : 0)
  return [
    { part: navy, material: { ...finish('us-navy-blue', 0x414b60), floodlight: lit } },
    { part: white, material: { ...finish('us-white', 0xf2efe8), floodlight: lit } },
    { part: skin, material: { ...finish('us-skin', 0xe3bfa2), floodlight: lit } },
    { part: black, material: finish('us-shoe-black', 0x4a4f57) },
    { part: hair, material: { ...finish('us-hair', 0x8a5a3c), floodlight: lit } },
    { part: plinth, material: finish('us-plinth', 0xb9b6ae) },
  ]
}

if (import.meta.main) await save('sd-unconditional-surrender', 'Unconditional Surrender', [32.7129, -117.17517], 0, build(), 5000)
