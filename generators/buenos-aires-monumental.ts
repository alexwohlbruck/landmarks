/**
 * Estadio Mâs Monumental (Estadio Monumental Antonio Vespucio Liberti,
 * Club Atlético River Plate, Núñez, Buenos Aires; opened 1938, horseshoe
 * closed 1958, rebuilt for the 1978 World Cup; 2020-21 the athletics track
 * was removed and the field lowered; 2023-25 the lower tiers were carried
 * down to the pitch and the seats replaced) — procedural, CC0-1.0, no
 * textures.  bun generators/buenos-aires-monumental.ts
 *
 * Map frame: x across the pitch (+x the San Martín side, east-south-east),
 * y along it (+y the Sívori end), z up, metres. Placed at bearing 10.5: the
 * pitch's long side (OSM leisure=pitch way/23242896, 104.8 x 68.2 m, runs at
 * 10.5 deg). Anchor -58.449733, -34.545302: the pitch centre, which is also
 * the centre of the stadium outline (OSM building=stadium relation/17609324,
 * x -104..104, y -125..125 about it, plus the San Martín footbridge deck).
 * The bowl is drawn symmetric about both axes.
 *
 * Plan. The stands are a family of superellipse rings about the centre,
 * half-axes (45 + d, 64 + d), d out from the seat front, the exponent
 * easing from 4 at the front (the rounded-rectangle field edge of the OSM
 * stadium inner ring, 90 x 128 m) to 2.3 at the back, which gives the OSM
 * outline (sides 104, ends 125, diagonals 113-124 m). The section:
 *   d 0-27   lower tier (Baja), z 0.5-11.5, charcoal seats;
 *   d 27-28  the band under the upper tier, z 11.5-15.5, red and white;
 *   d 28-58  upper tier (Alta), z 15.5-32.5, charcoal seats;
 *   d 58-60  the rear parapet, z 33;
 *   d 40-60  the upper tier's raked underside, exposed above the outer wall;
 *   d 57     the outer wall, z 0-12, with its red band and gates;
 *   d 50-60  the light gantry round the rim, z 35.6-36.2, on raking arms,
 *            its LED floodlight banks as lamps.
 * Around it, from OSM: the stair towers T1-T3 (relation/17471710, 17471707,
 * 17471702; 8 levels, drawn 24 m) and T4 (relation/17608102), the curved
 * hospitality wings at the Centenario corners (relation/17471697, 3
 * levels, 11 m; 17471698 and 17471699, 2 levels, 7.5 m) and the raised
 * pedestrian deck over to the San Martín side (relation/17471701, layer 1,
 * drawn as a 1.2 m slab at 6 m on columns).
 *
 * Heights: OSM stadium relation/1646999 height=33 for the rim. ESTIMATED
 * from the photos, scaled to that: the tier break (11.5-15.5 m), the outer
 * wall (12 m), the gantry (36 m, 10 m deep). Published (Wikipedia; Página
 * Millonaria / Ámbito, 2020-21): the field lowered 1.5 m (reports range
 * 1.5-1.9 m) when the track was removed. The map's terrain (Mapterhorn,
 * z12 only here) already reads the bowl's centre 1.5-3 m under the ground
 * round it, so `elevation` is 0, as for Nippert Stadium (doubt: z12 is
 * too coarse to tell the 1.5 m dig from the stands).
 *
 * The roof announced in January 2026 (sbp, translucent membrane on about 100
 * new perimeter columns, due 2029) is NOT drawn: it is not built yet, and no
 * licensed photo shows it. The giant welcome sign on its two red masts
 * (OSM way/1272613124-26) is left out: it stands apart from the stadium and
 * was being dismantled for the roof works in 2026.
 *
 * Evidence (all EVIDENCE):
 *  - OSM: stadium relation/1646999 (h 33) and building relation/17609324;
 *    stands relation/17471695, 17471711-17471715; parts above; pitch.
 *  - Photos, Wikimedia Commons:
 *    - aerial: Py4nf, "Aerial view of Estadio Monumental (Buenos Aires).jpg",
 *      CC BY 4.0: from the south-east, before 2023 (plan, outer wall, towers).
 *      https://commons.wikimedia.org/wiki/File:Aerial_view_of_Estadio_Monumental_(Buenos_Aires).jpg
 *    - cielo: Elemaki, "002.Buenos Aires desde el cielo (Estadio de
 *      River).JPG", CC BY 3.0: aerial from the east (tiers, gantry, towers).
 *      https://commons.wikimedia.org/wiki/File:002.Buenos_Aires_desde_el_cielo_(Estadio_de_River).JPG
 *    - dibu: Dibumartinez23, "Estadio mas monumental.jpg", CC0: inside
 *      after 2023: charcoal seats, white and red end blocks, rim gantry.
 *      https://commons.wikimedia.org/wiki/File:Estadio_mas_monumental.jpg
 *    - jm1, jm2: Just a Man, "Estadio Mâs Monumental (Noviembre de 2025) -
 *      (1), (2).jpg", CC BY 4.0: the tiers and the band under the upper tier.
 *      https://commons.wikimedia.org/wiki/File:Estadio_M%C3%A2s_Monumental_(Noviembre_de_2025)_-_(1).jpg
 *    - logo: Fernando Martello, "Estadio mas monumental logo exterior.jpg",
 *      CC BY-SA 4.0: the grey outer wall, the stepped underside of the upper tier.
 *      https://commons.wikimedia.org/wiki/File:Estadio_mas_monumental_logo_exterior.jpg
 *    - lugones: Horacio Cambeiro, "Estadio de River Plate visto desde Avenida
 *      Leopoldo Lugones ...", CC BY 3.0: from the north-east, the rim arms
 *      and the red band. https://commons.wikimedia.org/wiki/Category:Estadio_Monumental_Antonio_Vespucio_Liberti
 *    - kieffer: Matt Kieffer, "Estadio Antonio Vespucio Liberti, Buenos Aires,
 *      Argentina (46511339261).jpg", CC BY-SA 2.0: from the south.
 *      https://commons.wikimedia.org/wiki/File:Estadio_Antonio_Vespucio_Liberti,_Buenos_Aires,_Argentina_(46511339261).jpg
 *  - Published: en/es.wikipedia "Estadio Monumental"; the 2026 roof news
 *    (El Gráfico, Buenos Aires Times) for what is NOT built yet.
 *  - No lidar, NAIP or Mapterhorn z13-15 tiles here. No commercial imagery.
 *
 * Round 2 (review): seat colour kept a slate grey (#6a707a), because the
 * 2024-25 licensed photos (dibu, jm1, jm2) show dark grey seats all round
 * the upper tier and the side lower tiers, white end blocks with red
 * lettering (the red/white upper seats are the pre-2023 layout of cielo);
 * the aisles are raised concrete stair strips with a white vomitory box at
 * the cross aisle (dibu), not painted lines; the stair towers are drawn as
 * open cores (a central core with four round landings, sky between), as
 * the aerials show them.
 *
 * Invented or simplified: the seat patterns (the 1901 and CARP lettering at
 * the ends) are reduced to white end blocks with a red band; the stair
 * cores, vomitories and boxes are left out; the upper tier underside is one
 * raked surface with a frame per bay (48 bays, from the aerials' rhythm);
 * the gantry is a continuous ring, which the 2025 photos show on the ends
 * and sides alike. Doubts: the tier break heights, the field depth.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish } from './palette'
import { face, strip, beam, tube } from './seoul-world-cup-stadium'

type XY = [number, number]
const A0 = 45, B0 = 64
const ex = (d: number) => 4 - (1.7 * Math.min(60, Math.max(0, d))) / 60
const rad = (t: number, d: number) => {
  const a = A0 + d, b = B0 + d, e = ex(d)
  return Math.pow(Math.pow(Math.abs(Math.cos(t) / a), e) + Math.pow(Math.abs(Math.sin(t) / b), e), -1 / e)
}
const P = (d: number, t: number, z: number): V3 => { const r = rad(t, d); return [r * Math.cos(t), r * Math.sin(t), z] }
const BAYS = 48

function loftProfile(p: Part, n: number, prof: [number, number][], side: 1 | -1, flat = false, range?: [number, number]) {
  const closed = !range
  const [ta, tb] = range ?? [0, 2 * Math.PI]
  const ts = Array.from({ length: closed ? n : n + 1 }, (_, k) => ta + ((tb - ta) * k) / n)
  for (let i = 0; i < prof.length - 1; i++) {
    const [d0, z0] = prof[i], [d1, z1] = prof[i + 1]
    const nd = -(z1 - z0) * side, nz = (d1 - d0) * side
    strip(p, ts.map((t) => P(d0, t, z0)), ts.map((t) => P(d1, t, z1)), (q) => {
      const l = Math.hypot(q[0], q[1]) || 1
      return [(q[0] / l) * nd, (q[1] / l) * nd, nz]
    }, closed, flat)
  }
}

const area = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 20000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (cr(r[ia], r[ib], r[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(r[j], r[ia], r[ib], r[ic]))) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function prismPoly(wall: Part, top: Part, poly: XY[], z0: number, z1: number, bottom = false) {
  const r = ccw(poly)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    face(wall, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [b[1] - a[1], -(b[0] - a[0]), 0])
  }
  for (const [i, j, k] of triangulate(r)) {
    face(top, [[r[i][0], r[i][1], z1], [r[j][0], r[j][1], z1], [r[k][0], r[k][1], z1]], [0, 0, 1])
    if (bottom) face(wall, [[r[i][0], r[i][1], z0], [r[j][0], r[j][1], z0], [r[k][0], r[k][1], z0]], [0, 0, -1])
  }
}

// OSM, in this frame (pitch centre, bearing 10.5).
const T1: XY[] = [[-57.7, 108.0], [-54.3, 110.4], [-53.0, 112.8], [-53.1, 114.8], [-53.9, 116.7], [-55.4, 118.1], [-57.3, 118.8], [-59.8, 118.1], [-63.1, 115.7], [-64.5, 113.6], [-64.4, 111.6], [-63.7, 109.7], [-62.2, 108.3], [-60.3, 107.5]]
const T2: XY[] = [[-2.5, 130.2], [1.7, 130.1], [4.2, 131.2], [5.3, 132.9], [5.8, 134.9], [5.4, 136.9], [4.3, 138.6], [1.9, 139.5], [-2.2, 139.6], [-4.6, 138.7], [-5.8, 137.1], [-6.2, 135.1], [-5.9, 133.1], [-4.9, 131.3]]
const T3: XY[] = [[54.2, 111.8], [57.8, 109.5], [60.7, 109.1], [62.6, 110.0], [64.1, 111.6], [64.8, 113.5], [64.7, 115.6], [63.1, 117.7], [59.6, 119.9], [57.0, 120.4], [55.0, 119.6], [53.6, 118.1], [52.7, 116.1], [52.7, 114.0]]
const T4: XY[] = [[104.2, 39.8], [97.9, 38.2], [95.5, 46.5], [107.3, 49.2], [109.1, 48.8], [110.6, 47.6], [111.4, 46.0], [111.5, 44.5], [111.2, 43.1], [110.3, 41.9], [109.1, 41.1]]
const WING_S: XY[] = [[18.9, -122.8], [35.6, -122.9], [40.8, -123.0], [49.5, -121.4], [57.1, -117.7], [65.7, -111.8], [73.8, -104.6], [75.2, -103.5], [78.4, -100.1], [84.7, -92.2], [88.7, -86.3], [79.1, -80.6], [73.8, -88.3], [67.6, -95.5], [60.8, -102.1], [53.4, -107.9], [45.4, -112.9], [36.9, -117.1], [28.1, -120.4]]
const WING_E: XY[] = [[107.0, -48.5], [95.9, -45.1], [92.2, -55.4], [87.5, -65.8], [82.0, -75.8], [91.8, -81.5], [95.6, -75.2], [99.9, -66.5], [103.7, -57.6]]
const WING_W: XY[] = [[-18.8, -123.0], [-40.5, -123.3], [-50.4, -121.9], [-54.5, -119.7], [-63.6, -113.9], [-71.8, -107.1], [-77.5, -101.2], [-83.2, -94.5], [-88.8, -86.8], [-79.5, -80.7], [-74.1, -88.5], [-67.9, -95.8], [-61.1, -102.3], [-53.6, -108.1], [-45.5, -113.2], [-37.0, -117.3], [-28.0, -120.6]]
const DECK: XY[] = [[103.0, -18.5], [137.8, -12.8], [137.9, 13.6], [103.0, 18.9]]

type Lod = { n: number; detail: boolean }

function build(L: Lod) {
  const concrete = new Part(), white = new Part(), seats = new Part(), red = new Part(), glazing = new Part(), lamps = new Part()
  const n = L.n

  // --- The bowl.
  loftProfile(concrete, n, [[0, 0], [0, 0.5]], 1)
  // lower tier; the ends (behind the goals) carry white blocks
  const endRange = 0.62 // half-angle of the end blocks about +-y, radians
  const lowerProf: [number, number][] = [[0, 0.5], [27, 11.5]]
  if (!L.detail) {
    // charcoal sides, white ends, a red band at the front of the ends
    for (const [a, b, part] of [[Math.PI / 2 + endRange, 1.5 * Math.PI - endRange, seats], [1.5 * Math.PI + endRange, 2.5 * Math.PI - endRange, seats]] as [number, number, Part][]) {
      loftProfile(part, n / 4, lowerProf, 1, false, [a, b])
    }
  }
  const steps = L.detail ? 12 : 0
  const tiers: Array<{ a: [number, number]; b: [number, number]; ends: boolean }> = [
    { a: [0, 0.5], b: [27, 11.5], ends: true },
    { a: [28, 15.5], b: [58, 32.5], ends: false },
  ]
  for (const T of tiers) {
    if (!L.detail) {
      if (T.ends) continue
      // the upper tier with its cross aisle (a light walkway a third of the way up, dibu)
      const [da, za] = T.a, [db, zb] = T.b, f = (d: number) => za + ((zb - za) * (d - da)) / (db - da)
      loftProfile(seats, n, [T.a, [38, f(38)]], 1)
      loftProfile(concrete, n, [[38, f(38)], [39.6, f(38)]], 1)
      loftProfile(seats, n, [[39.6, f(38)], T.b], 1)
      // stair aisles down it: raised concrete strips (dibu: pale stairs between
      // the seat blocks), and at the cross aisle a vomitory box with a white frame
      for (let k = 0; k < BAYS / 2; k++) {
        const t = ((k + 0.25) / (BAYS / 2)) * 2 * Math.PI, w = 0.0055, h = 0.35
        for (const [d0, d1] of [[da, 38], [39.6, db]]) {
          const a = P(d0, t - w, f(d0)), b = P(d0, t + w, f(d0)), c = P(d1, t + w, f(d1)), d = P(d1, t - w, f(d1))
          const up = (q: V3): V3 => [q[0], q[1], q[2] + h]
          face(concrete, [up(a), up(b), up(c), up(d)], [0, 0, 1])
          face(concrete, [a, d, up(d), up(a)], [-Math.sin(t), Math.cos(t), 0])
          face(concrete, [b, c, up(c), up(b)], [Math.sin(t), -Math.cos(t), 0])
        }
        // vomitory: a white-framed box breaking the rake just above the cross aisle
        const v0 = P(39.6, t - 0.016, f(39.6)), v1 = P(39.6, t + 0.016, f(39.6))
        const v2 = P(43.5, t + 0.016, f(39.6) + 2.4), v3 = P(43.5, t - 0.016, f(39.6) + 2.4)
        face(white, [v0, v1, [v1[0], v1[1], v1[2] + 2.4], [v0[0], v0[1], v0[2] + 2.4]], [-Math.cos(t), -Math.sin(t), 0])
        face(white, [[v0[0], v0[1], v0[2] + 2.4], [v1[0], v1[1], v1[2] + 2.4], v2, v3], [0, 0, 1])
      }
      continue
    }
    const [da, za] = T.a, [db, zb] = T.b
    const dd = (db - da) / steps, dz = (zb - za) / steps
    for (let s = 0; s < steps; s++) {
      const d0 = da + s * dd, z0 = za + s * dz
      const segs: Array<[number, number, Part]> = T.ends
        ? [[Math.PI / 2 - endRange, Math.PI / 2 + endRange, s < 3 ? red : white], [Math.PI / 2 + endRange, 1.5 * Math.PI - endRange, seats], [1.5 * Math.PI - endRange, 1.5 * Math.PI + endRange, s < 3 ? red : white], [1.5 * Math.PI + endRange, 2.5 * Math.PI - endRange, seats]]
        : [[0, 2 * Math.PI, seats]]
      for (const [a, b, part] of segs) {
        const m = Math.max(4, Math.round((n * (b - a)) / (2 * Math.PI)))
        loftProfile(part, m, [[d0, z0], [d0, z0 + dz]], 1, true, [a, b])
        loftProfile(part, m, [[d0, z0 + dz], [d0 + dd, z0 + dz]], 1, true, [a, b])
      }
    }
    // white aisles down the upper tier, one per bay pair (dibu)
    if (!T.ends) for (let k = 0; k < BAYS / 2; k++) {
      const t = ((k + 0.25) / (BAYS / 2)) * 2 * Math.PI
      beam(white, [P(da + 0.3, t, za + 0.35), P(db - 0.3, t, zb + 0.35)], 1.4, 0.5, [0, 0, 1])
    }
  }
  if (!L.detail) {
    // low model: the white end blocks of the lower tier, with a red front band
    for (const c of [Math.PI / 2, 1.5 * Math.PI]) {
      loftProfile(red, n / 4, [[0, 0.5], [8, 3.75]], 1, false, [c - endRange, c + endRange])
      loftProfile(white, n / 4, [[8, 3.75], [27, 11.5]], 1, false, [c - endRange, c + endRange])
    }
  }
  // the band under the upper tier: red, with the glazed boxes on the sides
  loftProfile(concrete, n, [[27, 11.5], [27.4, 11.5]], 1)
  loftProfile(red, n, [[27.4, 11.5], [27.4, 13.4]], 1)
  loftProfile(glazing, n, [[27.4, 13.4], [27.4, 15.0]], 1)
  loftProfile(white, n, [[27.4, 15.0], [27.4, 15.5], [28, 15.5]], 1)
  // rear parapet
  loftProfile(white, n, [[58, 32.5], [58, 33.2], [59.6, 33.2], [59.6, 31.8]], 1)

  // --- Outside: a tall concourse facade (aerial, cielo): glazing and open
  // concourses set back behind slab bands and one pier per bay, a red band
  // under the rim, the gates at the foot.
  loftProfile(glazing, n, [[57.6, 0], [57.6, 30.2]], -1)
  for (const z of [6.5, 12.5, 18.5]) loftProfile(concrete, n, [[57.6, z + 0.8], [59.6, z + 0.8], [59.6, z - 0.9]].concat(L.detail ? [[57.6, z - 0.9]] : []) as [number, number][], 1)
  loftProfile(concrete, n, [[57.6, 24.2], [59.6, 24.2], [59.6, 25.2]], -1)
  loftProfile(red, n, [[59.6, 25.2], [59.6, 28.6]], -1)
  loftProfile(white, n, [[59.6, 28.6], [59.6, 31.8]], -1)
  for (let k = 0; k < BAYS; k++) {
    const t = ((k + 0.5) / BAYS) * 2 * Math.PI
    const o: V3 = [Math.cos(t), Math.sin(t), 0]
    const pier = P(59.4, t, 0)
    beam(concrete, [pier, [pier[0], pier[1], 25.2]], 1.2, 1.2, o)
    // the gantry arm: from the rim up and in, over the top rows
    const arm = L.detail ? [P(59.4, t, 33.2), P(56, t, 36.4), P(54, t, 36.2)] : [P(59.4, t, 33.2), P(54.5, t, 36.3)]
    beam(white, arm, 0.7, 0.9, [0, 0, 1])
    // floodlight banks under the gantry's inner edge
    if (L.detail || k % 2 === 0) {
      const lp = P(54.6, t, 35.0)
      tube(lamps, [lp[0], lp[1], lp[2] - 0.6], [lp[0], lp[1], lp[2] + 0.6], 0.9, 0.9, 4, true, true)
    }
  }
  // the gantry: a light canopy ring round the rim
  loftProfile(white, n, [[54, 36.0], [59.6, 36.0]], 1)
  if (L.detail) {
    loftProfile(white, n, [[54, 35.5], [54, 36.0]], 1)
    loftProfile(white, n, [[59.6, 36.0], [59.6, 35.5]], 1)
  }
  loftProfile(white, n, [[59.6, 35.5], [54, 35.5]], 1)

  // --- Around it: stair towers, the hospitality wings, the raised deck.
  // The stair towers are open concrete stair cores (cielo, aer): stacked
  // landings round a central core, the sky showing between them.
  for (const tw of [T1, T2, T3, T4]) {
    let cx = 0, cy = 0
    for (const [x, y] of tw) { cx += x / tw.length; cy += y / tw.length }
    const core: XY[] = [[cx - 1.6, cy - 1.6], [cx + 1.6, cy - 1.6], [cx + 1.6, cy + 1.6], [cx - 1.6, cy + 1.6]]
    prismPoly(concrete, concrete, core, 0, 25)
    const ring = tw.filter((_, i) => i % 2 === 0) // the round landings, 7 sides
    for (const z of [5, 11, 17, 23]) prismPoly(concrete, concrete, ring, z, z + 1.1, true)
  }
  for (const tw of [T1, T2, T3, T4]) {
    // the towers' stair openings: a dark band each storey pair, set on the wall
    if (!L.detail) continue
    const r = ccw(tw)
    for (let i = 0; i < r.length; i += 2) {
      const a = r[i], b = r[(i + 1) % r.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      const nx = (b[1] - a[1]) / l, ny = -(b[0] - a[0]) / l
      for (let z = 3; z < 22; z += 6) face(glazing, [[a[0] + nx * 0.05, a[1] + ny * 0.05, z], [b[0] + nx * 0.05, b[1] + ny * 0.05, z], [b[0] + nx * 0.05, b[1] + ny * 0.05, z + 2.4], [a[0] + nx * 0.05, a[1] + ny * 0.05, z + 2.4]], [nx, ny, 0])
    }
  }
  prismPoly(concrete, concrete, WING_S, 0, 11)
  prismPoly(concrete, concrete, WING_E, 0, 7.5)
  prismPoly(concrete, concrete, WING_W, 0, 7.5)
  prismPoly(concrete, concrete, DECK, 4.8, 6, true)
  for (const [x, y] of [[112, -10], [112, 10], [124, -9], [124, 9], [136, -9], [136, 9]] as XY[]) tube(concrete, [x, y, 0], [x, y, 4.8], 0.5, 0.5, 4, false, false)

  const lit = (_p: V3, nn: V3) => (nn[2] > 0.6 ? 0.1 : 0.7)
  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: concrete, material: { ...finish('monumental-concrete', 0xcfccc6), floodlight: lit } },
    { part: white, material: finish('monumental-white', 0xf2f0ea) },
    { part: seats, material: finish('monumental-seats', 0x6a707a) },
    { part: red, material: finish('monumental-red', 0xc9545a) },
    { part: glazing, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
    { part: lamps, material: { name: 'lamp', color: 0xe8e6e0, roughness: 0.5 } },
  ]
  return parts
}

async function write(file: string, parts: Array<{ part: Part; material: MaterialSpec }>, maxTris: number, maxBytes: number) {
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (process.env.DEBUG) console.log(file, parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
  if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Estadio Mâs Monumental', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 10.5, elevation: 0, height: 36.6,
  })
  if (glb.length > maxBytes) throw new Error(`${file}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${file}`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

if (import.meta.main) {
  await write('buenos-aires-monumental.glb', build({ n: 64, detail: false }), 6500, 250_000)
}
