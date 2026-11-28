/**
 * Mestalla, Valencia: original procedural geometry, CC0-1.0, no textures.
 * bun generators/valencia-mestalla.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/valencia-mestalla.glb, the low model;
 * - models/valencia-mestalla.detail.glb (zoom 16 up): stepped stands, every
 *   bracket and balcony rail, the lattice panels in the screen, more
 *   Tribuna girders, the floodlight gantries as frames.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 11.4: model
 * +y runs along the pitch (north-north-east), +x across it. Anchor = the
 * centre of the pitch, OSM way/24044927 (104.6 x 68 m, long edges at 11.4
 * deg), lng -0.3582370, lat 39.4746135.
 *
 * Identity, in order: the very steep, closed bowl of stands rising straight
 * from the pitch's edge in three tiers, orange below and white at the top;
 * the black outer facades of stacked, deeply cantilevered balcony slabs
 * with orange-red undersides and white rails (black since at least 2014:
 * vcf, ff, vys),
 * and above them the upper tier's back as a black lattice screen between
 * bold brackets under a thin cornice; the Tribuna's (west) big cantilever
 * roof; the round ramp towers at three corners; the floodlight gantries on
 * the rim.
 *
 * Evidence
 *  - OSM: building=stadium relation/7886308 (height=40), outer way/8082830
 *    (leisure=stadium, Q202762), inner way/551678845 (the pitch's edge,
 *    x +-39, y +-58: the stands start there); building=roof way/1122832534
 *    (the Tribuna's roof, x -77..-35, y -53..54) and way/1239685453 (a U
 *    over the other three stands' upper parts; no roof there in any photo,
 *    so it is read as the upper tiers' outline). The outline's three round
 *    bulges are the ramp towers: (-73.5, -59) r 10.5, (74, -90) r 13,
 *    (100, 55) r 11. No building:part is mapped (the brief's "37 parts"
 *    are not in OSM today).
 *  - Published: es.wikipedia "Estadio de Mestalla": opened 1923, the
 *    steepest stands in Spain, pitch 105 x 68 m; OSM height 40 m.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - vys: Vysotsky, "MestallaValencia2024.jpg", CC BY-SA 4.0, the east
 *      facade (Avinguda de Suècia) in its current black and orange-red.
 *      https://commons.wikimedia.org/wiki/File:MestallaValencia2024.jpg
 *    - ff: Francesc Fort, "Camp de Mestalla 2023.jpg", CC BY-SA 4.0, the
 *      same facade from the corner. https://commons.wikimedia.org/wiki/File:Camp_de_Mestalla_2023.jpg
 *    - vcf: Valencia CF, "CAMP DE MESTALLA 2014.jpg", CC BY-SA 4.0, a curved
 *      facade with the balconies. https://commons.wikimedia.org/wiki/File:CAMP_DE_MESTALLA_2014.jpg
 *    - d5, d6, d1: Dorieo, "Mestalla 05/06/01.JPG", CC BY-SA 4.0, the
 *      facades before the repaint: the lattice screen, brackets, slabs, a
 *      ramp tower, a floodlight gantry. https://commons.wikimedia.org/wiki/File:Mestalla_05.JPG
 *    - byx6: Byxelized, "Mestalla Stadium Valencia vs Villarreal 2026.6.jpg",
 *      CC BY-SA 4.0, inside: the steep tiers, orange below, white above,
 *      the Tribuna's roof. https://commons.wikimedia.org/wiki/File:Mestalla_Stadium_Valencia_vs_Villarreal_2026.6.jpg
 *    - mn10, mn7: Mister No, "Mestalla - panoramio (10)/(7).jpg", CC BY 3.0,
 *      inside: the end with "VCF", the tiers, the roof's underside, the
 *      gantries. https://commons.wikimedia.org/wiki/File:Mestalla_-_panoramio_(10).jpg
 *    - anid: Anidae, "Mestalla antes del partido Valencia-Barcelona LaLiga
 *      2023-2024.jpg", CC BY-SA 4.0, at night: floodlights on the rim.
 *      https://commons.wikimedia.org/wiki/File:Mestalla_antes_del_partido_Valencia-Barcelona_LaLiga_2023-2024.jpg
 *  No lidar or NAIP exists here; no aerial photo was found on Commons; no
 *  commercial imagery.
 *
 * Numbers (z above the pitch and street, which are level: elevation 0):
 *  - Rim 40 m (OSM height). Tiers ESTIMATED from byx6 and mn10: lower to
 *    12 m, a box band, middle to 25 m, a band, upper to 40 m; the stands
 *    rise from the pitch's edge (OSM inner way) to the outline, which is
 *    drawn as a rounded rectangle fitted to OSM (x -71..89, y -95..94,
 *    corners r 28).
 *  - Facade (review round 1): five slabs at 5, 9.5, 14, 18.5 and 23 m in
 *    both models, 4.9 m deep, each with an orange-red underside falling to
 *    a 1.3 m orange-red front fascia (vys, ff: the slab fronts are painted
 *    too) and a white rail; the screen and brackets charcoal. The ramp
 *    towers carry the same slabs at the same levels. The upper
 *    screen 24-39 m leaning out 3 m; the cornice to 40.5 m; brackets every
 *    7 m: ESTIMATED from vys and d5 (five storeys of balconies).
 *  - Tribuna roof: OSM plan; a thin dark cantilever, 0.8 m thick, 43 m at
 *    the back falling to 40.5 m at the front, with a 1.8 m fascia and a
 *    white lip, on girders from a 10 m back frame over the stand's rear:
 *    ESTIMATED (byx6, mn7).
 *  - Ramp towers 20 m: ESTIMATED from d5 (to the fourth slab).
 *  - Gantries: 6, at the corners and the ends' middles, 7 m frames
 *    (mn10, d5).
 *
 * Doubts: the west facade under the Tribuna is drawn like the others (no
 * open photo of it today); no fourth ramp tower is mapped at the north-west
 * corner; the black lettering in the seats is left out; the stands' depths
 * follow the outline (the east stand is the deepest).
 * Night: the gantries' lamps are `lamp`; the slabs' undersides and the
 * facade are floodlit; the ground-floor glazing and the upper
 * lattice screen (lit from the concourses behind it) are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { band, ring, bar, cyl, annulus, rrect, writeLods, type XY } from './milan-san-siro'
import { face, rayHit, vlerp } from './seoul-world-cup-stadium'

const BEARING = 11.4
const R_IN = rrect(39, 39, 58, 58, 4)
const R_OUT = rrect(71, 89, 95, 94, 28)
const TOWERS: [number, number, number][] = [[-73.5, -59, 10.5], [74, -90, 13], [100, 55, 11]]
const RIM = 40

function build(detail: boolean) {
  const black = new Part(), orange = new Part(), white = new Part(), roof = new Part(), win = new Part(), lamp = new Part()
  const N = detail ? 160 : 56
  const phis = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const OUTW = (q: V3): V3 => [q[0], q[1], 0]
  const INW = (q: V3): V3 => [-q[0], -q[1], 0]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 80]
  const rIn = ring(R_IN, phis, 0), rOut = ring(R_OUT, phis, 0)
  // a ring at fraction s from the pitch's edge to the outer wall, at z
  const S = (s: number, z: number, g = 0) => rIn.map((p, k) => {
    const v = vlerp(p, rOut[k], s)
    const l = Math.hypot(v[0], v[1]) || 1
    return [v[0] + (v[0] / l) * g, v[1] + (v[1] / l) * g, z] as V3
  })

  // --- The stands: three steep tiers with box bands between.
  const rake = (p: Part, s0: number, z0: number, s1: number, z1: number, steps: number) => {
    if (steps <= 1) { band(p, S(s0, z0), S(s1, z1), SEAT); return }
    for (let k = 0; k < steps; k++) {
      const a = s0 + ((s1 - s0) * k) / steps, b = s0 + ((s1 - s0) * (k + 1)) / steps
      const za = z0 + ((z1 - z0) * k) / steps, zb = z0 + ((z1 - z0) * (k + 1)) / steps
      band(p, S(a, za), S(a, zb), INW)
      band(p, S(a, zb), S(b, zb), UP)
    }
  }
  band(black, S(0, 0), S(0, 1.6), INW) // the pitch wall
  rake(orange, 0, 1.6, 0.33, 12, detail ? 8 : 1)
  band(black, S(0.33, 12), S(0.35, 12), UP)
  band(win, S(0.35, 12), S(0.35, 14.5), INW) // the box band
  rake(orange, 0.35, 14.5, 0.64, 25, detail ? 8 : 1)
  band(black, S(0.64, 25), S(0.66, 25), UP)
  band(black, S(0.66, 25), S(0.66, 27), INW)
  rake(white, 0.66, 27, 0.97, RIM - 1, detail ? 8 : 1)
  band(black, S(0.97, RIM - 1), S(1, RIM - 1, 3), UP)
  band(black, S(1, RIM - 1, 3), S(1, RIM + 0.5, 3), OUTW) // the cornice
  band(black, S(0.97, RIM - 1), S(0.97, RIM + 0.5), INW)
  band(black, S(0.97, RIM + 0.5), S(1, RIM + 0.5, 3), UP)

  // --- The facade: ground storey set back, five stacked balcony slabs,
  // each with an orange-red underside and an orange-red front fascia, a
  // white rail on top; above them the black lattice screen leaning out.
  band(win, S(1, 0, -2.5), S(1, 4.5, -2.5), OUTW) // ground-floor doors and glazing
  band(black, S(1, 4.5, -2.5), S(1, 24, -2.5), OUTW)
  const SLABS = [5, 9.5, 14, 18.5, 23]
  for (const z of SLABS) {
    band(orange, S(1, z - 0.6, -2.5), S(1, z - 1.5, 2.4), (q) => [q[0] * 0.02, q[1] * 0.02, -1]) // underside, falling to the front
    band(orange, S(1, z - 1.5, 2.4), S(1, z - 0.2, 2.4), OUTW) // the slab's front fascia
    band(black, S(1, z - 0.2, 2.4), S(1, z - 0.2, -2.5), UP) // the slab's top
    band(white, S(1, z - 0.2, 2.2), S(1, z + 1.0, 2.2), OUTW) // the rail, white
    if (detail) band(white, S(1, z + 1.0, 2.2), S(1, z - 0.2, 2.2), INW)
  }
  // the upper screen: the tier's back, leaning out, black
  band(black, S(1, 24, -2.5), S(1, 24, 0), DOWN)
  band(black, S(1, 24, 0), S(1, RIM - 1, 3), OUTW)
  if (detail) {
    // the lattice: shallow dark panels set in the screen between the brackets
    const n = 3
    for (let r = 0; r < n; r++) {
      const z0 = 25.5 + r * 4.3, z1 = z0 + 3.4
      const g = (z: number) => (3 * (z - 24)) / (RIM - 1 - 24) + 0.05
      band(win, S(1, z0, g(z0)), S(1, z1, g(z1)), OUTW)
    }
  }
  // brackets every ~7 m: bold black fins from the slab line to the cornice
  {
    const per = detail ? 1 : 2
    for (let k = 0; k < N; k += per) {
      const a = S(1, 24, 0)[k], b = S(1, RIM - 1, 3)[k]
      const o = S(1, 24, 1.4)[k], ob = S(1, RIM - 1, 4.2)[k]
      bar(black, vlerp(a, o, 0.5), vlerp(b, ob, 0.5), 1.4, 2.8, [0, 0, 1], true)
      // the diagonal prop under the cornice
      if (detail) bar(black, S(1, RIM - 7, 0.6)[k], S(1, RIM - 1, 3.6)[k], 0.6, 0.6, [0, 0, 1], false)
    }
  }

  // --- The Tribuna's roof (west): OSM plan; a thin dark cantilever springing
  // from a back frame on the stand's rear, its front a fascia.
  {
    const x0 = -77, x1 = -35, y0 = -53, y1 = 54
    const zb = RIM + 3, zf = RIM + 0.5, th = 0.8
    const P = (x: number, y: number, dz = 0): V3 => [x, y, zb + ((zf - zb) * (x - x0)) / (x1 - x0) + dz]
    face(roof, [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)], [0.05, 0, 1])
    face(roof, [P(x0, y0, -th), P(x0, y1, -th), P(x1, y1, -th), P(x1, y0, -th)], [0, 0, -1])
    for (const y of [y0, y1]) face(roof, [P(x0, y, -th), P(x1, y, -th), P(x1, y), P(x0, y)], [0, y > 0 ? 1 : -1, 0])
    // the front fascia: a deeper dark edge beam with a white lip
    face(roof, [P(x1, y0, -1.8), P(x1, y1, -1.8), P(x1, y1), P(x1, y0)], [1, 0, 0])
    face(roof, [P(x1 - 1, y0, -1.8), P(x1, y0, -1.8), P(x1, y1, -1.8), P(x1 - 1, y1, -1.8)], [0, 0, -1])
    bar(white, P(x1 + 0.1, y0, 0.15), P(x1 + 0.1, y1, 0.15), 0.3, 0.45, [0, 0, 1], true)
    // the back frame: a dark wall from the roof down onto the stand's rear
    face(black, [P(x0, y0, -th), P(x0, y0, -th - 10), P(x0, y1, -th - 10), P(x0, y1, -th)].map((p) => [p[0], p[1], p[2]] as V3), [-1, 0, 0])
    face(black, [P(x0, y0, -th - 10), P(x0 + 6, y0, -th - 10), P(x0 + 6, y1, -th - 10), P(x0, y1, -th - 10)], [0, 0, -1])
    for (const y of [y0, y1]) face(black, [P(x0, y, -th - 10), P(x0 + 6, y, -th - 10), P(x0 + 6, y, -th), P(x0, y, -th)], [0, y > 0 ? 1 : -1, 0])
    // the cantilever girders under it, deep at the back, thin at the front
    const n = detail ? 13 : 7
    for (let i = 0; i <= n; i++) {
      const y = y0 + 1 + ((y1 - y0 - 2) * i) / n
      bar(roof, P(x0 + 0.5, y, -th - 0.3), P(x1 - 0.5, y, -th - 0.3), 0.7, 0.8, [0, 0, 1], false)
      bar(roof, P(x0 + 0.5, y, -th - 6), P(x1 - 14, y, -th - 0.6), 0.7, 0.7, [0, 0, 1], false)
    }
  }

  // --- The ramp towers at three corners, in the facade's dress: a black
  // core, and at each slab level an orange-red ramp edge and a white rail.
  for (const [cx, cy, r] of TOWERS) {
    const TN = detail ? 20 : 12
    cyl(black, cx, cy, r - 2.4, 0, 24, TN, true)
    for (const z of SLABS) {
      cyl(orange, cx, cy, r, z - 1.5, z - 0.2, TN, false)
      annulus(orange, cx, cy, r - 2.4, r, z - 1.5, TN, false)
      annulus(black, cx, cy, r - 2.4, r, z - 0.2, TN, true)
      cyl(white, cx, cy, r - 0.2, z - 0.2, z + 1.0, TN, false)
    }
  }

  // --- Floodlight gantries on the rim: corners and the ends' middles.
  {
    const spots: number[] = []
    for (const a of [45, 135, 225, 315, 90, 270]) {
      const f = (a * Math.PI) / 180
      // aim at the corner of the rounded rectangle along this ray
      spots.push(Math.atan2(Math.sin(f) * 94, Math.cos(f) * (f < Math.PI / 2 || f > 1.5 * Math.PI ? 89 : 71)))
    }
    for (const f of spots) {
      const R = rayHit(R_OUT, f) - 2
      const c: XY = [R * Math.cos(f), R * Math.sin(f)]
      const t: V3 = [-Math.sin(f), Math.cos(f), 0]
      const P = (w: number, d: number, z: number): V3 => [c[0] + t[0] * w + Math.cos(f) * d, c[1] + t[1] * w + Math.sin(f) * d, z]
      const z0 = RIM + 0.5, z1 = RIM + 8.5, W = 4.5
      for (const w of [-W, W]) for (const d of [-1.2, 1.2]) bar(white, P(w, d, z0), P(w, d, z1 - 2.5), detail ? 0.45 : 0.9, detail ? 0.45 : 0.9, [1, 0, 0], false)
      if (detail) for (const w of [-W, W]) bar(white, P(w, -1.2, z0), P(w, 1.2, z1 - 2.5), 0.25, 0.25, [1, 0, 0], false)
      // the lamp panel: a box tilted toward the pitch
      const A = P(-W - 0.5, 0.6, z1 - 2.6), B = P(W + 0.5, 0.6, z1 - 2.6), C = P(W + 0.5, -0.8, z1), D = P(-W - 0.5, -0.8, z1)
      face(lamp, [A, B, C, D], [-Math.cos(f), -Math.sin(f), 0.5])
      face(black, [A, D, C, B], [Math.cos(f), Math.sin(f), -0.5])
    }
  }

  const lit = (_p: V3, n: V3) => (n[2] < -0.5 ? 0.9 : 0.45)
  return [
    { part: black, material: { ...finish('mestalla-black', 0x4a4f57), floodlight: lit } },
    { part: orange, material: { ...finish('mestalla-orange', 0xd65a36), floodlight: lit } },
    { part: white, material: finish('mestalla-white', 0xeeeeea) },
    { part: roof, material: finish('mestalla-roof', 0x5c6168) },
    { part: win, material: { ...PALETTE.window, color: 0x6c7782 } },
    { part: lamp, material: finish('lamp-floodlight', 0xd9dde0) },
  ]
}

if (import.meta.main)
  await writeLods('Mestalla', { bearing: BEARING, elevation: 0, height: 47.5 }, [
    { file: 'valencia-mestalla.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'valencia-mestalla.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
