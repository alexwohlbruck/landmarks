/**
 * Luzhniki Stadium (Grand Sports Arena), Moscow: original procedural
 * geometry, CC0-1.0, no textures.  bun generators/moscow-luzhniki.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/moscow-luzhniki.glb, the low model;
 * - models/moscow-luzhniki.detail.glb (zoom 16 up): every roof rib and
 *   bracket, two window panels and two arches per bay, column bases and
 *   capitals, stepped stands.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 136: model +y
 * runs along the pitch (south-east), +x across it. Anchor = the centre of
 * the pitch, OSM way/273655618 (110 x 66 m, long edges at 136 deg), lng
 * 37.5537595, lat 55.7157388; the building's centroid (relation/4112951)
 * is 1.3 m from it.
 *
 * Identity, in order: the 1956 facade kept round the new bowl: a ring of
 * 76 tall pale columns standing free in front of a light-sand wall with
 * its arched ground-floor openings and tall grouped windows, under a deep
 * bronze-beige frieze; the roof's edge as a ring of pale triangular
 * brackets with dark pockets between (the sawtooth); the pale polycarbonate
 * roof rising in a shallow dome of radial bays to the white ring round the
 * oval opening; red seats in two tiers seen through the opening.
 *
 * Evidence
 *  - OSM (drawn exactly, in this frame): the frieze ring relation/3646205
 *    (levels 7-8, x +-125, y +-157), the facade wall relation/3646204 (its
 *    outer ring 3.4-3.7 m inside), the columns relation/3646206 and
 *    3646234 (73 columns 1.6 m across, 1.4-2.1 m inside the frieze line;
 *    one more drawn in the 11 deg gap at the north-west end to keep the
 *    rhythm), the roof relation/3644276 (opening x +-46.5, y +-75),
 *    building relation/4112951, leisure=stadium relation/162802 (Q202163).
 *  - Published: ru.wikipedia "Лужники (стадион)": facade and roof kept in
 *    the 2013-2017 rebuild, "light sand" colour scheme, polycarbonate roof,
 *    pitch 105 x 68 m, the canopy extended 11.5 m.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - govm: Government of Moscow press centre, "LuzhnikiStadium.jpg", CC
 *      BY 4.0, a drone view of the south-east end: columns, windows,
 *      frieze, brackets, roof, opening; heights scaled from it.
 *      https://commons.wikimedia.org/wiki/File:LuzhnikiStadium.jpg
 *    - kgs26: Комплекс градостроительной политики и строительства города
 *      Москвы, "Стадион Лужники (29 марта 2017) · 26.jpg", CC BY 4.0, a
 *      drone view from the east: the roof's bays and brackets.
 *      https://commons.wikimedia.org/wiki/File:%D0%A1%D1%82%D0%B0%D0%B4%D0%B8%D0%BE%D0%BD_%D0%9B%D1%83%D0%B6%D0%BD%D0%B8%D0%BA%D0%B8_(29_%D0%BC%D0%B0%D1%80%D1%82%D0%B0_2017)_%C2%B7_26.jpg
 *    - jie1, jie2: Ji-Elle, "Moscow-Exterior of Luzhniki Stadium (1)/(2).jpg",
 *      CC BY-SA 4.0, from the Sparrow Hills (south-west): the long side,
 *      the roof's profile. https://commons.wikimedia.org/wiki/File:Moscow-Exterior_of_Luzhniki_Stadium_(1).jpg
 *    - mbh8: MBH, "Luzhniki Olympic Complex 08.jpg", CC BY 4.0, inside:
 *      red seats, the roof's soffit. https://commons.wikimedia.org/wiki/File:Luzhniki_Olympic_Complex_08.jpg
 *    - mbh2: MBH, "Luzhniki Olympic Complex 02.jpg", CC BY 4.0, a photo of
 *      the scale model on show: the roof's radial bays, the two tiers.
 *      https://commons.wikimedia.org/wiki/File:Luzhniki_Olympic_Complex_02.jpg
 *    - pres1: Presidential Press and Information Office, "Стадион Лужники
 *      2017 1.jpg", CC BY 4.0, inside: red seats, both tiers.
 *      https://commons.wikimedia.org/wiki/File:%D0%A1%D1%82%D0%B0%D0%B4%D0%B8%D0%BE%D0%BD_%D0%9B%D1%83%D0%B6%D0%BD%D0%B8%D0%BA%D0%B8_2017_1.jpg
 *    - argb: Vyacheslav Argenberg, "Luzhniki Stadium, Moscow, Russia.jpg",
 *      CC BY 4.0, from the Sparrow Hills. https://commons.wikimedia.org/wiki/File:Luzhniki_Stadium,_Moscow,_Russia.jpg
 *    - mosru: Mos.ru, "Luzhniki Stadium1.jpg", CC BY 4.0, at night from the
 *      north-east: the lit facade, frieze and roof edge.
 *      https://commons.wikimedia.org/wiki/File:Luzhniki_Stadium1.jpg
 *  No lidar or NAIP exists here (outside the US); no commercial imagery.
 *
 * Numbers (z above the field and the street, which are level: elevation 0;
 * the map's terrain here is z12 only and shows the stadium itself as a 52 m
 * hill, so it is no evidence for the base):
 *  - From govm (column spacing 11.7 m = 95 px in the zoom, verticals /0.9
 *    for the camera's tilt): columns 24.5 m; the shaded gallery under the
 *    frieze 24.5-27 m; frieze 27-32 m; the fascia 32-34.5 m; the brackets
 *    to 39 m. ESTIMATED to +-2 m. OSM gives 8 levels to the frieze's top.
 *  - Roof rising to 56 m at the opening's ring: ESTIMATED. In jie1 (from
 *    the Sparrow Hills, 2.6 deg down) the roof above the cornice is 0.76
 *    of the facade's height, and the drone views (govm, kgs26) show it as a
 *    dome whose near half hides most of the bowl; the map's z12 surface
 *    model peaks at 52 m over the roof, an average over 30 m pixels.
 *  - Window bays: per column bay two arched ground-floor openings and two
 *    window columns of three storeys (govm), drawn as one arch and one
 *    grouped panel per bay in the low model.
 *  - Stands: two tiers, red (mbh8, pres1); their radii are ESTIMATED from
 *    the scale-model photo (mbh2) and the opening.
 *
 * Doubts: the frieze's printed graphic is drawn as a plain bronze band; the
 * gate pavilions and the ramps at the ends are left to the map; the roof's
 * height is estimated; the field may sit a little below the street.
 * Terrain: Mapterhorn has only z12 here, a surface model with the stadium
 * in it as a 40 m hill. The map fills it under the model's plan, but the
 * field is open (no geometry), so `terrain.ts check` reports the lower
 * tier's front rows buried by up to 37 m under the hill left in the field:
 * the terrain is wrong for the site; the model is built to the photos.
 * Night (mosru): the windows and the brackets' pockets are `window` (lit);
 * the columns, frieze and roof edge are floodlit.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { band, ring, bar, cyl, writeLods, superellipse, type XY } from './milan-san-siro'
import { face, rayHit, vlerp } from './seoul-world-cup-stadium'

const BEARING = 136

// OSM rings and columns in this frame (see the header).
const OUT: XY[] = [[124.1, -13.4], [124.1, -0.5], [124.1, 5.4], [124.2, 17.2], [124.3, 30.2], [123.0, 42.6], [121.8, 55.1], [118.4, 67.7], [113.9, 80.4], [108.8, 90.7], [102.0, 101.6], [94.4, 112.4], [85.7, 121.9], [77.2, 129.1], [66.6, 137.0], [55.0, 144.2], [44.2, 149.1], [33.5, 153.3], [20.5, 157.2], [9.9, 158.9], [0.4, 159.5], [-13.9, 158.5], [-34.0, 154.0], [-46.2, 149.1], [-56.3, 143.9], [-67.5, 137.6], [-77.2, 129.4], [-85.6, 121.0], [-93.3, 111.7], [-99.4, 104.7], [-105.7, 94.1], [-111.0, 84.0], [-116.7, 69.7], [-120.6, 57.6], [-123.4, 43.6], [-125.6, 30.6], [-125.9, -21.3], [-124.5, -41.8], [-119.8, -61.9], [-109.4, -86.4], [-102.8, -97.8], [-94.5, -108.8], [-87.4, -117.0], [-78.0, -126.1], [-68.4, -134.8], [-57.3, -142.4], [-46.9, -147.2], [-34.9, -151.7], [-23.2, -154.2], [-11.0, -155.9], [-0.9, -156.3], [8.0, -155.9], [22.0, -153.0], [35.9, -150.3], [48.4, -144.6], [58.2, -139.7], [70.7, -131.5], [80.2, -124.1], [90.0, -115.4], [98.0, -104.6], [104.2, -94.4], [109.7, -82.6], [114.6, -72.0], [119.1, -59.0], [121.5, -47.6], [123.1, -36.8], [124.1, -22.6]]
const WALL: XY[] = [[120.6, -13.4], [120.6, -0.4], [120.6, 5.4], [120.7, 17.3], [120.8, 30.1], [119.5, 42.2], [118.3, 54.5], [115.0, 66.7], [110.6, 79.1], [105.7, 89.0], [99.1, 99.6], [91.7, 110.2], [83.3, 119.4], [75.1, 126.4], [64.7, 134.1], [53.4, 141.1], [42.8, 145.8], [32.4, 150.0], [19.7, 153.8], [9.5, 155.4], [0.5, 156.0], [-13.4, 155.1], [-32.9, 150.7], [-44.7, 145.9], [-54.6, 140.9], [-65.5, 134.8], [-74.8, 126.9], [-83.0, 118.6], [-90.6, 109.4], [-96.5, 102.7], [-102.7, 92.4], [-107.8, 82.6], [-113.4, 68.6], [-117.2, 56.7], [-119.9, 43.0], [-122.1, 30.3], [-122.4, -21.2], [-121.0, -41.3], [-116.5, -60.8], [-106.3, -84.9], [-99.8, -95.8], [-91.7, -106.7], [-84.9, -114.7], [-75.6, -123.6], [-66.2, -132.0], [-55.6, -139.4], [-45.6, -144.0], [-33.9, -148.4], [-22.6, -150.8], [-10.7, -152.5], [-1.0, -152.8], [7.6, -152.4], [21.3, -149.6], [34.8, -147.0], [46.9, -141.5], [56.5, -136.7], [68.7, -128.7], [78.0, -121.4], [87.4, -113.0], [95.1, -102.6], [101.1, -92.7], [106.5, -81.1], [111.4, -70.6], [115.7, -58.0], [118.0, -47.0], [119.6, -36.4], [120.6, -22.4]]
const OPEN: XY[] = [[46.5, 5.3], [45.9, 21.6], [43.5, 36.6], [39.8, 46.3], [34.9, 55.6], [28.6, 62.5], [21.8, 67.9], [15.1, 71.1], [7.4, 73.4], [0.8, 74.0], [-5.9, 74.1], [-11.8, 72.7], [-18.8, 69.6], [-25.7, 65.1], [-31.3, 60.7], [-35.1, 56.0], [-39.1, 49.4], [-43.5, 40.3], [-45.5, 30.3], [-46.4, 18.2], [-46.7, 2.6], [-46.3, -12.4], [-45.9, -23.8], [-45.0, -34.5], [-42.3, -43.9], [-39.8, -49.8], [-36.5, -55.8], [-30.6, -62.6], [-25.8, -67.4], [-20.0, -71.2], [-13.8, -73.7], [-7.1, -75.4], [-0.2, -76.2], [7.5, -75.2], [15.6, -73.1], [22.2, -69.5], [29.3, -64.0], [34.8, -57.2], [40.3, -48.0], [43.8, -39.3], [45.7, -30.4], [46.4, -14.3]]
const COLS: XY[] = [[-123.8, -3.3], [-124.1, -16.0], [-123.6, -29.0], [-122.4, -41.5], [-118.0, -61.3], [-107.7, -85.8], [-101.1, -96.9], [-93.0, -107.8], [-86.1, -115.9], [-76.6, -124.8], [-67.2, -133.3], [-56.2, -140.8], [-46.1, -145.5], [-34.1, -150.1], [-22.7, -152.6], [-10.5, -154.4], [-0.8, -154.8], [8.0, -153.8], [21.8, -151.2], [35.5, -148.7], [47.8, -143.1], [57.3, -138.2], [69.7, -130.1], [79.1, -122.6], [88.9, -114.0], [96.6, -103.6], [102.6, -93.5], [108.2, -82.0], [113.2, -71.3], [117.5, -58.6], [119.9, -47.5], [121.6, -36.5], [121.8, -29.3], [122.4, -22.5], [122.4, -13.4], [122.7, -0.2], [122.6, 5.4], [122.6, 17.3], [122.7, 30.2], [121.3, 42.6], [120.2, 54.9], [116.8, 67.2], [112.4, 79.8], [107.6, 90.0], [100.6, 100.7], [93.3, 111.3], [84.5, 120.7], [76.4, 127.8], [65.8, 135.6], [54.4, 142.7], [43.6, 147.6], [32.9, 151.9], [20.0, 155.8], [8.0, 157.4], [-1.4, 157.7], [-10.2, 157.2], [-22.8, 154.9], [-33.4, 152.3], [-45.6, 147.5], [-55.3, 142.4], [-66.3, 136.3], [-75.9, 128.0], [-84.3, 119.8], [-91.9, 110.5], [-97.7, 103.5], [-104.1, 93.2], [-109.4, 83.3], [-114.8, 69.1], [-118.7, 57.2], [-121.4, 43.3], [-123.8, 26.9], [-124.1, 15.4], [-124.0, 3.5]]

// Heights.
const COL_TOP = 24.5, GALLERY = 27, FRIEZE_TOP = 32, FASCIA_TOP = 34.5
const POCKET_Z = 39, OPEN_Z = 56

/** Column angles, with one added in any gap over 10 deg. */
function columnAngles(): number[] {
  const a = COLS.map(([x, y]) => Math.atan2(y, x)).sort((p, q) => p - q)
  const out: number[] = []
  for (let i = 0; i < a.length; i++) {
    out.push(a[i])
    const nxt = i + 1 < a.length ? a[i + 1] : a[0] + 2 * Math.PI
    const gap = nxt - a[i]
    if (gap > (10 * Math.PI) / 180) {
      const n = Math.round(gap / ((5.9 * Math.PI) / 180))
      for (let k = 1; k < n; k++) out.push(a[i] + (gap * k) / n)
    }
  }
  return out
}

function build(detail: boolean) {
  const sand = new Part(), pale = new Part(), frieze = new Part(), roof = new Part(), win = new Part(), seats = new Part()
  const CA = columnAngles()
  const NB = CA.length
  // angles: each column, plus the bay's middle (for the roof's sawtooth)
  const phis: number[] = []
  for (let i = 0; i < NB; i++) {
    const a = CA[i], b = i + 1 < NB ? CA[i + 1] : CA[0] + 2 * Math.PI
    phis.push(a, (a + b) / 2)
  }
  const OUTW = (q: V3): V3 => [q[0], q[1], 0]
  const INW = (q: V3): V3 => [-q[0], -q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]

  // --- The facade wall, on the column angles so each bay is one flat face.
  const W = (z: number, g = 0) => ring(WALL, CA, z, g)
  band(sand, W(0), W(GALLERY), OUTW, true, false)
  // the frieze over the colonnade, its soffit back to the wall, its top
  const O = (z: number, g = 0) => ring(OUT, phis, z, g)
  const Wf = (z: number, g = 0) => ring(WALL, phis, z, g)
  const Oc = (z: number, g = 0) => ring(OUT, CA, z, g)
  if (detail) {
    band(frieze, O(GALLERY), O(FRIEZE_TOP), OUTW)
    band(sand, Wf(GALLERY), O(GALLERY), DOWN)
  } else {
    band(frieze, Oc(GALLERY), Oc(FRIEZE_TOP), OUTW)
    band(sand, W(GALLERY), Oc(GALLERY), DOWN)
  }
  // the fascia, set back a little, then the roof's edge
  if (detail) {
    band(sand, O(FRIEZE_TOP), O(FRIEZE_TOP, -0.6), UP)
    band(sand, O(FRIEZE_TOP, -0.6), O(FASCIA_TOP, -0.6), OUTW)
  } else band(sand, Oc(FRIEZE_TOP), Oc(FASCIA_TOP, -0.6), OUTW)

  // --- Windows: per bay, arched openings at the ground and grouped
  // three-storey panels, set 0.05 m proud of the wall; the shaded gallery
  // band under the frieze.
  const Wc = W(0)
  for (let i = 0; i < NB; i++) {
    const A = Wc[i], B = Wc[(i + 1) % NB]
    const L = Math.hypot(B[0] - A[0], B[1] - A[1])
    const tx = (B[0] - A[0]) / L, ty = (B[1] - A[1]) / L
    const nx = ty, ny = -tx // outward (the ring is counter-clockwise)
    const P = (s: number, z: number): V3 => [A[0] + tx * s + nx * 0.05, A[1] + ty * s + ny * 0.05, z]
    const n: V3 = [nx, ny, 0]
    const quad = (s0: number, s1: number, z0: number, z1: number, p = win) => face(p, [P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1)], n)
    const arch = (s0: number, s1: number, z0: number, zs: number) => {
      const r = (s1 - s0) / 2, c = (s0 + s1) / 2, seg = detail ? 8 : 4
      quad(s0, s1, z0, zs)
      for (let k = 0; k < seg; k++) {
        const a0 = (Math.PI * k) / seg, a1 = (Math.PI * (k + 1)) / seg
        face(win, [P(c, zs), P(c + r * Math.cos(a0), zs + r * Math.sin(a0)), P(c + r * Math.cos(a1), zs + r * Math.sin(a1))], n)
      }
    }
    const pier = 1.6
    const span = L - 2 * pier
    if (span < 3) continue
    if (detail) {
      const w = (span - 1.4) / 2
      for (const s0 of [pier, pier + w + 1.4]) {
        arch(s0 + 0.5, s0 + w - 0.5, 0.6, 5.2)
        quad(s0 + w / 2 - 1.1, s0 + w / 2 + 1.1, 8.8, 21.4)
      }
    } else {
      const c = L / 2
      arch(c - 1.9, c + 1.9, 0.6, 5.2)
      quad(c - 3.4, c - 1.2, 8.8, 21.4)
      quad(c + 1.2, c + 3.4, 8.8, 21.4)
    }
    quad(0.3, L - 0.3, COL_TOP, GALLERY - 0.15) // the gallery band, shaded
  }

  // --- The columns, free-standing in front of the wall.
  for (const a of CA) {
    const r = rayHit(OUT, a) - 1.75
    const cx = r * Math.cos(a), cy = r * Math.sin(a)
    cyl(pale, cx, cy, 0.85, 0, detail ? COL_TOP : GALLERY, detail ? 10 : 6, false, 0.85, a)
    if (detail) {
      cyl(pale, cx, cy, 1.15, 0, 1.2, 10, true, 1.15, a) // base
      cyl(pale, cx, cy, 1.15, COL_TOP - 1.0, GALLERY, 10, false, 1.15, a) // capital up to the frieze
    }
  }

  // --- The roof's edge: the roof's lip at 39 m over a dark recess, and in
  // front of it a pale triangular bracket on each column line, its apex at
  // the lip where the roof's rib lands (the sawtooth: pale peaks, dark
  // pockets between), then the roof rising in a shallow dome to the ring.
  const pc = detail ? phis : CA
  const fascia = ring(OUT, pc, FASCIA_TOP, -0.6)
  const back = ring(OUT, pc, FASCIA_TOP, -3.2)
  const backTop = ring(OUT, pc, POCKET_Z, -3.2)
  const lip = ring(OUT, pc, POCKET_Z, -1.2)
  band(win, fascia, back, UP)
  band(win, back, backTop, OUTW)
  band(roof, backTop, lip, DOWN)
  const edge = ring(OUT, phis, POCKET_Z, -1.2)
  for (let i = 0; i < NB; i++) {
    const f = CA[i], b = i + 1 < NB ? CA[i + 1] : CA[0] + 2 * Math.PI, a0 = i > 0 ? CA[i - 1] : CA[NB - 1] - 2 * Math.PI
    const half = Math.min(b - f, f - a0) * 0.36
    const P = (g: number, r0: number, z: number): V3 => { const r = rayHit(OUT, g) + r0; return [r * Math.cos(g), r * Math.sin(g), z] }
    const L = P(f - half, -0.7, FASCIA_TOP), R = P(f + half, -0.7, FASCIA_TOP), T = P(f, -1.0, POCKET_Z)
    const Lb = P(f - half * 0.6, -3.2, FASCIA_TOP), Rb = P(f + half * 0.6, -3.2, FASCIA_TOP), Tb = P(f, -3.2, POCKET_Z)
    face(pale, [L, R, T], [Math.cos(f), Math.sin(f), 0.15])
    face(pale, [L, T, Tb, Lb], [Math.sin(f), -Math.cos(f), 0.3])
    face(pale, [R, Rb, Tb, T], [-Math.sin(f), Math.cos(f), 0.3])
  }
  // the roof surface: from the sawtooth up to the opening, convex
  const prof = detail ? [0, 0.1, 0.25, 0.45, 0.7, 1] : [0, 0.3, 1]
  const zAt = (t: number) => POCKET_Z + (OPEN_Z - POCKET_Z) * Math.sin((t * Math.PI) / 2)
  const rr = (t: number) => {
    const o = ring(OUT, phis, 0, -1.2), p = ring(OPEN, phis, 0, 1.5)
    return o.map((q, i) => { const v = vlerp(q, p[i], t); return [v[0], v[1], zAt(t)] as V3 })
  }
  band(roof, edge, rr(0.02), UP) // from the lip
  for (let k = 0; k < prof.length - 1; k++) band(roof, rr(Math.max(0.02, prof[k])), rr(prof[k + 1]), UP)
  // radial ribs over the roof's bays (every column line; every other in the low model)
  {
    const steps = detail ? 6 : 2
    for (let i = 0; i < phis.length; i += detail ? 2 : 8) {
      const pts: V3[] = []
      for (let k = 0; k <= steps; k++) {
        const t = 0.02 + (0.98 * k) / steps
        const q = rr(t)[i]
        pts.push([q[0], q[1], q[2] + 0.35])
      }
      for (let k = 0; k < steps; k++) bar(pale, pts[k], pts[k + 1], detail ? 0.7 : 1.0, 0.5, [0, 0, 1], false)
    }
  }
  // the ring round the opening: a white box ring, its inner face, the soffit
  const ph2 = detail ? phis : phis.filter((_, i) => i % 2 === 0)
  const Op = (z: number, g = 0) => ring(OPEN, ph2, z, g)
  band(pale, Op(OPEN_Z, 1.5), Op(OPEN_Z + 0.9, 1.5), (q) => [-q[0], -q[1], 0.2])
  if (detail) band(pale, Op(OPEN_Z + 0.9, 1.5), Op(OPEN_Z + 0.9, -0.2), UP)
  band(pale, Op(OPEN_Z + 0.9, -0.2), Op(OPEN_Z - 2.6, -0.2), INW)
  // the roof's soffit over the stands, back to the wall's top
  band(pale, Op(OPEN_Z - 2.6, -0.2), ring(WALL, ph2, 33, -6), DOWN)
  band(sand, ring(WALL, ph2, 33, -6), ring(WALL, ph2, 33, -0.1), DOWN)
  band(sand, ring(WALL, ph2, 26, -6), ring(WALL, ph2, 33, -6), INW)

  // --- The stands: two red tiers round the pitch, a box ring between.
  {
    const N = detail ? 128 : 56
    const sp = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
    const L0 = superellipse(39, 61, 3.6, 64), L1 = superellipse(74, 99, 2.5, 64)
    const U0 = superellipse(77, 102, 2.4, 64)
    const U1: XY[] = WALL.map(([x, y]) => [x * 0.955, y * 0.962])
    const rake = (a: XY[], b: XY[], z0: number, z1: number, steps: number) => {
      const A0 = ring(a, sp, 0), B0 = ring(b, sp, 0)
      for (let s = 0; s < steps; s++) {
        const t0 = s / steps, t1 = (s + 1) / steps
        const za = z0 + (z1 - z0) * t0, zb = z0 + (z1 - z0) * t1
        const A = A0.map((p, k) => { const v = vlerp(p, B0[k], t0); return [v[0], v[1], za] as V3 })
        const B = A0.map((p, k) => { const v = vlerp(p, B0[k], t1); return [v[0], v[1], zb] as V3 })
        if (steps === 1) { band(seats, A, B, (q) => [-q[0], -q[1], 60]); continue }
        const Ar = A.map((p) => [p[0], p[1], zb] as V3)
        band(seats, A, Ar, INW)
        band(seats, Ar, B, UP)
      }
    }
    band(sand, ring(L0, sp, 0), ring(L0, sp, 1.4), INW)
    rake(L0, L1, 1.4, 13, detail ? 6 : 1)
    band(sand, ring(L1, sp, 13), ring(U0, sp, 13), UP)
    band(win, ring(U0, sp, 13), ring(U0, sp, 15.5), INW) // the boxes
    rake(U0, U1, 15.5, 31, detail ? 6 : 1)
  }

  return [
    { part: sand, material: { ...finish('luzhniki-sand', 0xe4d6bb), floodlight: (_p: V3, n: V3) => (n[2] > 0.5 ? 0.2 : 0.7) } },
    { part: pale, material: { ...finish('luzhniki-column', 0xf2ebdd), floodlight: () => 0.85 } },
    { part: frieze, material: { ...finish('luzhniki-frieze', 0xb19d7a), floodlight: () => 0.8 } },
    { part: roof, material: finish('luzhniki-roof', 0xc5ccd1) },
    { part: win, material: { ...PALETTE.window, color: 0x5f6d7a } },
    { part: seats, material: finish('luzhniki-seats', 0xb4463f) },
  ]
}

if (import.meta.main)
  await writeLods('Luzhniki Stadium', { bearing: BEARING, elevation: 0, height: 57 }, [
    { file: 'moscow-luzhniki.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'moscow-luzhniki.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
