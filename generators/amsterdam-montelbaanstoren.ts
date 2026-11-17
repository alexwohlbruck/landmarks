/**
 * Montelbaanstoren, Oudeschans 2, Amsterdam: original procedural geometry,
 * CC0-1.0.
 * bun generators/amsterdam-montelbaanstoren.ts
 *
 * A harbour defence tower of 1516, round below and octagonal above, given a
 * white wooden Renaissance top by Hendrick de Keyser in 1606: a dark clock
 * stage with four framed dials under pediments, a white open octagon with
 * a balustrade and pinnacles, a smaller white open octagon, and a cupola
 * with an onion finial, ball and vane.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/57864086,
 * 52.372036, 4.905661. Bearing 12: OSM's octagon parts and the Oudeschans
 * both run at about 12 degrees, so the octagons have a flat face to each
 * axis and the dials face up and down the canal.
 *
 * Identity, in order: the white stacked lantern over the dark clock stage
 * (the white top against the brick is what the tower is known by), the
 * framed dials, the balustrade and pinnacles between the two open
 * octagons, the onion finial; the stout brick shaft, round below and
 * octagonal above.
 *
 * Evidence:
 *  - plan: OSM outline way/57864086 read in the turned frame: a round
 *    tower 11 m across with a flat-faced block on its west side (the
 *    outline is drawn up to 10.5 m, as Chabe01's photo of that side shows
 *    the flat face ending about half way up the brick); parts 751647820
 *    (octagon 9.8 m across the flats, 22 m), 751647819 (the clock stage
 *    with its four projecting dial bays, 7.4 m across them, 20-24 m),
 *    751647818 (octagon 5 m, 24-30 m), 751647817 (octagon 2.8 m, 30-38 m,
 *    dome).
 *  - height: 48 m to the vane, published (nl.wikipedia, "Montelbaanstoren":
 *    "De Montelbaanstoren werd daarmee 48 meter hoog").
 *  - stage heights and widths estimated from C messier's distant level
 *    photos (11.5 px/m in Montelbaanstoren_7146 with the vane at 48 m):
 *    brick to 20.9 m (10.2 m wide); then, from C messier's sunlit
 *    Montelbaanstoren_1791 (13.6 px/m between the cornice at 21 m and the
 *    vane at 48 m): clock stage to 26.2 (7.9 m across), lower white
 *    octagon to 31.8 (5.4 m), balustrade and pinnacles to 34, upper white
 *    octagon to 39 (3 m), cupola to 41.5, onion to 44.3, ball, vane 48. The round shaft turns
 *    octagonal at about 11 m (Chabe01's photos).
 *  - colours from the daylight photos: brown-red brick pulled light; the
 *    top painted white (warm off-white), the clock stage dark slate
 *    (dark in every daylight photo), black dials with gilt rims in thin
 *    white square frames under white pediments; gilt ball.
 *  - night: the whole tower is floodlit (Chabe01's night photos).
 *  - elevation 0 (quay, about 0-2 m NAP). No lidar.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Montelbaanstoren_1791.jpg (C messier, CC BY-SA 4.0): from the south
 *    across the Oudeschans, distant, sunlit.
 *  - Montelbaanstoren_7146.jpg (C messier, CC BY-SA 4.0): from the south
 *    along the Oudeschans at dusk, distant and level.
 *  - Tour_Montelbaan_-_Amsterdam_(NL32)_-_2024-11-27_-_4.jpg (Chabe01,
 *    CC BY-SA 4.0): the shaft's round-to-octagon change, the clock stage
 *    and lanterns, close, at night.
 *  - Tour_Montelbaan_-_Amsterdam_(NL32)_-_2024-11-27_-_1.jpg (Chabe01,
 *    CC BY-SA 4.0): the land side with the flat-faced block, at night.
 *  - 4025_Montelbaanstoren.jpg (Johan Bakker, CC BY-SA 4.0): from the
 *    north along the Oudeschans, distant.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the scrolls on the clock stage's corners (drawn as white
 * pinnacles), balusters (a solid balustrade), the bells' frames, clock
 * hands, the stone dressings of the shaft's niches except as panels.
 *
 * Doubts: the north-east of the shaft is drawn like the south; the flat
 * west block's height is estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  archOn, ball, band, bbox, cap, ccw, dialOn, face, floodAll, grow, lathe, ngonF, openStage, pyramid, prism, rectOn, save, segs,
  vane, walls, along, type XY,
} from './amsterdam-munttoren'

const OUTLINE: XY[] = [
  [5.4, 1.8], [5.5, 1.3], [5.6, 0.7], [5.6, 0.4], [5.6, -0.2], [5.5, -0.8], [5.4, -1.1], [5.2, -2.0], [4.8, -2.7], [4.6, -3.0], [4.3, -3.5],
  [3.9, -3.9], [3.4, -4.3], [2.7, -4.8], [2.2, -5.1], [1.3, -5.4], [0.4, -5.6], [-0.4, -5.6], [-1.0, -5.6], [-1.6, -5.5], [-4.5, -4.7],
  [-5.2, -4.5], [-5.4, 0.7], [-4.8, 0.7], [-4.8, 3.9], [-1.2, 4.9], [-0.3, 5.0], [-0.2, 6.0], [0.7, 6.0], [1.2, 5.95], [1.9, 5.8],
  [2.3, 5.6], [2.8, 5.3], [3.6, 4.8], [4.0, 4.3], [4.6, 3.6], [4.9, 3.0], [5.0, 2.7], [5.3, 2.1],
]

function build() {
  const brick = new Part(), white = new Part(), slate = new Part(), win = new Part(), gold = new Part(), dark = new Part()
  const TX = 0.2, TY = -0.25

  // ------------------------------------------------- the brick shaft
  const R0 = 10.5, B1 = 20.9
  const base = ccw(OUTLINE)
  walls(brick, base, 0, R0)
  cap(brick, base, R0)
  walls(white, grow(base, 0.05), 0, 0.5)
  const o1 = ngonF(TX, TY, 4.85)
  // a sloped brick weathering where the round shaft meets the octagon
  prism(brick, o1, R0, B1, false)
  band(white, o1, R0 - 0.05, R0 + 0.3, 0.12, 0.08, false, false)
  segs(o1).forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    // small windows in stone frames (the niches around them are brick on brick)
    if (k % 2 === 0) {
      archOn(white, a, b, L / 2, 0.55, 17.2, 18.3, 0.05, 6)
      archOn(win, a, b, L / 2, 0.4, 17.35, 18.3, 0.09, 6)
      rectOn(white, a, b, L / 2, 0.55, 13.2, 14.7, 0.05)
      rectOn(win, a, b, L / 2, 0.4, 13.35, 14.55, 0.09)
    }
  })
  // windows on the round shaft, in stone frames
  for (const [ang, z] of [[-90, 2.0], [-90, 6.6], [-35, 4.2], [-145, 4.2], [0, 6.6], [40, 2.4], [180, 6.6]] as [number, number][]) {
    const t = (ang * Math.PI) / 180, r = 5.55
    const c: XY = [TX + r * Math.cos(t), TY + r * Math.sin(t)]
    const a: XY = [c[0] + Math.sin(t) * 0.8, c[1] - Math.cos(t) * 0.8], b: XY = [c[0] - Math.sin(t) * 0.8, c[1] + Math.cos(t) * 0.8]
    rectOn(white, a, b, 0.8, 0.62, z - 0.15, z + 1.85, 0.1)
    rectOn(win, a, b, 0.8, 0.45, z, z + 1.7, 0.14)
  }
  // quoins on the octagon's corners
  for (const c of o1) {
    const d = Math.hypot(c[0] - TX, c[1] - TY), ux = (c[0] - TX) / d, uy = (c[1] - TY) / d
    for (let z = R0 + 0.6, k = 0; z < B1 - 0.8; z += 1.3, k++) {
      const w = k % 2 ? 0.45 : 0.7
      const q: XY[] = [[c[0] + ux * 0.06, c[1] + uy * 0.06], [c[0] - ux * w - uy * w * 0.8, c[1] - uy * w + ux * w * 0.8], [c[0] - ux * w * 1.2, c[1] - uy * w * 1.2], [c[0] - ux * w + uy * w * 0.8, c[1] - uy * w - ux * w * 0.8]]
      prism(white, ccw(q), z, z + 0.65)
    }
  }
  band(white, o1, B1 - 0.2, B1 + 0.35, 0.3, 0.14)

  // ---------------------------------------------- the clock stage
  const C0 = B1 + 0.35, C1 = 25.8
  const o2 = ngonF(TX, TY, 3.3)
  cap(slate, grow(o1, 0.18), C0 + 0.01)
  prism(slate, o2, C0, C1, false)
  for (const c of o2) {
    const d = Math.hypot(c[0] - TX, c[1] - TY), ux = (c[0] - TX) / d, uy = (c[1] - TY) / d
    const q: XY[] = [[c[0] + ux * 0.2, c[1] + uy * 0.2], [c[0] - uy * 0.26, c[1] + ux * 0.26], [c[0] - ux * 0.3, c[1] - uy * 0.3], [c[0] + uy * 0.26, c[1] - ux * 0.26]]
    prism(white, ccw(q), C0, C1, false)
  }
  // The four dial bays, standing out on the axis faces under pediments.
  const BAY = 1.55, OUT = 3.9
  for (let k = 0; k < 4; k++) {
    const t = (k * Math.PI) / 2 - Math.PI / 2 // south, east, north, west
    const nx = Math.cos(t), ny = Math.sin(t), ux = -ny, uy = nx
    const P = (s: number, o: number): XY => [TX + nx * o + ux * s, TY + ny * o + uy * s]
    const r: XY[] = ccw([P(-BAY, 2.9), P(BAY, 2.9), P(BAY, OUT), P(-BAY, OUT)])
    prism(slate, r, C0, C1 - 0.3, false)
    const A = P(-BAY, OUT), B = P(BAY, OUT) // runs counter-clockwise: outside on the right
    rectOn(white, A, B, BAY, 1.4, 22.05, 24.95, 0.03)
    rectOn(slate, A, B, BAY, 1.22, 22.23, 24.77, 0.05)
    dialOn(dark, gold, A, B, BAY, 23.5, 1.15, 0.06, 0.12)
    // pediment: a triangular white slab with a slate roof behind
    const Lw = BAY + 0.25, Z = C1 - 0.3, Ztop = Z + 1.3
    const Q = (s: number, z: number, o: number): V3 => [TX + nx * o + ux * s, TY + ny * o + uy * s, z]
    face(white, [Q(-Lw, Z, OUT + 0.15), Q(Lw, Z, OUT + 0.15), Q(0, Ztop, OUT + 0.15)], [nx, ny, 0])
    face(slate, [Q(-Lw, Z, OUT + 0.15), Q(0, Ztop, OUT + 0.15), Q(0, Ztop, 2.7), Q(-Lw, Z, 2.7)], [nx * 0 - ux * 1.3, -uy * 1.3 + ny * 0, Lw])
    face(slate, [Q(Lw, Z, OUT + 0.15), Q(Lw, Z, 2.7), Q(0, Ztop, 2.7), Q(0, Ztop, OUT + 0.15)], [ux * 1.3, uy * 1.3, Lw])
    face(white, [Q(-Lw, Z, OUT + 0.15), Q(Lw, Z, OUT + 0.15), Q(Lw, Z, 2.9), Q(-Lw, Z, 2.9)], [0, 0, -1])
  }
  band(white, o2, C1, C1 + 0.4, 0.25, 0.12)
  // white pinnacles on the clock stage's diagonal corners
  for (let k = 0; k < 4; k++) {
    const t = (k * Math.PI) / 2 - Math.PI / 4
    const x = TX + 3.4 * Math.cos(t), y = TY + 3.4 * Math.sin(t)
    bbox(white, white, x - 0.3, y - 0.3, x + 0.3, y + 0.3, C0, C1 - 0.5, 0.08)
    lathe(white, x, y, [[0.28, C1 - 0.5], [0.12, C1 + 0.6], [0.18, C1 + 0.8], [0, C1 + 1.2]], 6)
  }

  // ----------------------------------------- the lower white lantern
  const L0 = C1 + 0.4, L1 = 31.2
  const o3 = ngonF(TX, TY, 2.7)
  frustum2(slate, grow(o2, 0.15), C1 + 0.4, grow(o3, 0.1), C1 + 0.7)
  openStage(white, o3, L0, L1, 29.4, 0.4, 0.3, 6)
  cap(white, o3, L0 + 0.32)
  bells(dark, TX, TY, L0 + 0.32, [0.75, 0.55])
  band(white, o3, L1, L1 + 0.55, 0.3, 0.14)
  // balustrade with pinnacles at its corners
  const ob = grow(o3, 0.22), Bz = L1 + 0.55
  walls(white, ob, Bz, Bz + 0.95)
  walls(white, [...grow(o3, -0.05)].reverse(), Bz, Bz + 0.95)
  ringTop(white, ob, grow(o3, -0.05), Bz + 0.95)
  for (const c of ob) lathe(white, c[0], c[1], [[0.2, Bz], [0.2, Bz + 1.05], [0.26, Bz + 1.2], [0.1, Bz + 2.1], [0, Bz + 2.35]], 5)
  cap(slate, grow(o3, -0.05), Bz + 0.15)

  // ----------------------------------------- the upper white lantern
  const U0 = Bz + 0.15, U1 = 38.4
  const o4 = ngonF(TX, TY, 1.6)
  openStage(white, o4, U0, U1, 36.7, 0.32, 0.26, 6)
  cap(white, o4, U0 + 0.02)
  bells(dark, TX, TY, U0 + 0.4, [0.5])
  band(white, o4, U1, U1 + 0.55, 0.28, 0.13)

  // ------------------------------- cupola, onion finial, ball and vane
  const K = U1 + 0.55
  lathe(white, TX, TY, [[1.7, K], [1.6, K + 0.4], [1.3, K + 1.2], [0.8, K + 1.9], [0.45, K + 2.3], [0.3, K + 2.5], [0, K + 2.55]], 8, Math.PI / 8)
  const O = K + 2.4
  lathe(white, TX, TY, [[0.25, O], [0.5, O + 0.3], [0.76, O + 0.85], [0.66, O + 1.4], [0.3, O + 1.95], [0.14, O + 2.4], [0.12, O + 2.9], [0, O + 2.95]], 8)
  ball(gold, TX, TY, 44.6, 0.38, 8)
  vane(dark, gold, TX, TY, 44.9, 48.0, 0.5, 0.07)

  return [
    { part: brick, material: { ...finish('montelbaanstoren-brick', 0x8f5444), floodlight: floodAll } },
    { part: white, material: { ...finish('montelbaanstoren-white', 0xeee8da), floodlight: floodAll } },
    { part: slate, material: { ...finish('montelbaanstoren-slate', 0x50565d), floodlight: floodAll } },
    { part: win, material: { ...PALETTE.window } },
    { part: gold, material: { ...finish('montelbaanstoren-gilt', 0xc9a24a, 0.45), floodlight: floodAll } },
    { part: dark, material: finish('montelbaanstoren-dark', 0x4a4f57) },
  ]
}

/** Sloped skirt between two rings of the same length. */
function frustum2(p: Part, r0: XY[], z0: number, r1: XY[], z1: number) {
  walls(p, r0, z0, z1, r1)
}
/** The flat top of a ring wall between an outer and an inner ring. */
function ringTop(p: Part, o: XY[], i: XY[], z: number) {
  for (let k = 0; k < o.length; k++) {
    const l = (k + 1) % o.length
    p.quad([o[k][0], o[k][1], z], [o[l][0], o[l][1], z], [i[l][0], i[l][1], z], [i[k][0], i[k][1], z])
  }
}
/** Bells hanging one above another inside a lantern. */
export function bells(p: Part, x: number, y: number, z0: number, radii: number[]) {
  let z = z0 + 0.3
  for (const r of radii) {
    lathe(p, x, y, [[r, z], [r * 0.95, z + 0.12], [r * 0.6, z + r * 0.9], [r * 0.5, z + r * 1.25], [0, z + r * 1.4]], 8)
    z += r * 1.4 + 0.25
  }
  lathe(p, x, y, [[0.1, z0], [0.1, z], [0, z]], 4)
}

void pyramid
if (import.meta.main) await save('amsterdam-montelbaanstoren', 'Montelbaanstoren', [52.372036, 4.905661], 12, build(), 6500)
