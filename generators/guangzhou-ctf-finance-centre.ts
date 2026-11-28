/**
 * Guangzhou CTF Finance Centre (Chow Tai Fook, "East Tower"), Zhujiang New
 * Town, Guangzhou — original procedural geometry, CC0-1.0.
 * bun generators/guangzhou-ctf-finance-centre.ts   (writes the low model and the detail LOD)
 *
 * Also exports a small kit (`chamferSquare`, `vbar`, `loftZ`, `fanCap`) used
 * by guangzhou-citic-plaza.ts and dongguan-minying-itc-t2.ts: merge this file
 * first.
 *
 * Frame: BEARING 1 (the tower's square is turned about 1 deg clockwise from
 * north in OSM), model +y = compass 1. Origin = the centre of the tower's
 * OSM part way/511404889 (bounding-box centre, 113.3205608 E, 23.1202004 N),
 * so the symmetric tower is centred; y = 0 is the plaza; elevation 0.
 *
 * Form, as read from the photos:
 * - a square tower, 64 m across (OSM part extents), its faces flaring out a
 *   little at the foot (to 66.4 m at the plaza);
 * - setbacks at three heights, where the use changes (offices -> serviced
 *   apartments -> hotel -> crown, Wikipedia): at each one the faces step in
 *   and the corners are carved back further (bigger chamfers), and every
 *   setback line is angled: on each face it is highest at the face's
 *   counter-clockwise start (the west end of the south face, the north end of
 *   the west face...) and falls toward the other end, so the setbacks and
 *   the crown read as a pinwheel of sloped parapets ("angled parapets point
 *   at the tops of nearby tall buildings", Wikipedia);
 * - the facade: glass between projecting white glazed-terracotta piers
 *   (mullions), which make the tower read silver-white with fine vertical
 *   lines; drawn as bold piers every 4.5 m (low) or 1.9 m (detail), real
 *   3D (the low model: sparser, thinner piers tinted toward the glass, so
 *   it reads as grey-blue glass with fine lines), with faint bands at the
 *   mechanical floors in the detail model only;
 * - the crown: a bold slanted cut rising to the south-west corner (crown
 *   line ~496 -> 524 m), with the glass screen and the piers (as fins)
 *   standing 6 m above it, round a roof at 486 m;
 * - the podium (K11 mall): the OSM outline way/299687657 (4 levels) round
 *   the tower and its 12-level north part way/511404888.
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL), fetched 2026-11-27:
 *   outline way/299687657 "广州周大福金融中心" (4 levels, Q168575), tower part
 *   way/511404889 (530 m, 111 levels), podium part way/511404888 (12 levels).
 * - Published (Wikipedia "Guangzhou CTF Finance Centre"; CTBUH): 530 m
 *   architectural, roof 518 m, top floor 496 m, 111 floors; KPF, 2016;
 *   setbacks between offices / apartments / hotel / crown; white glazed
 *   terracotta mullions; LEDs light the terracotta at night; podium of
 *   eight floors.
 * - Photos (Wikimedia Commons):
 *   "Guangzhou CTF Finance Center 20241027.jpg", Tim Wu, CC BY-SA 4.0, from
 *   the south at 2.25 km (telephoto, near-orthographic): heights were scaled
 *   from it (64 m width -> 0.42 m/px); setbacks, sloped crown;
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_CTF_Finance_Center_20241027.jpg
 *   "Guangzhou CTF Finance Centre.jpg", Shujianyang, CC0, from the SSW
 *   (Huacheng Square): setbacks, crown, colour;
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_CTF_Finance_Centre.jpg
 *   "Guangzhou twin towers (4to3).jpg", Sergei Gussev, CC BY 2.0, from the SE
 *   (139 deg, 1.2 km): the angled setback lines, crown;
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_twin_towers_(4to3).jpg
 *   "ChowTaiFookFinanceCentreDecember2015.jpg", Brian Sterling, CC BY-SA
 *   2.0, from the NW (303 deg, 380 m): pinwheel steps, curved crown top;
 *   https://commons.wikimedia.org/wiki/File:ChowTaiFookFinanceCentreDecember2015.jpg
 *   "Guangzhou CTF Finance Centre 02-10-2018.jpg", Milkomède, CC BY-SA 4.0:
 *   colour, mechanical-floor bands;
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_CTF_Finance_Centre_02-10-2018.jpg
 *   "Guangzhou Chow Tai Fook Finance Center from Huacheng Square.jpg",
 *   そらみみ, CC BY-SA 4.0, from the SSW (204 deg);
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_Chow_Tai_Fook_Finance_Center_from_Huacheng_Square.jpg
 *   "TCF Centra Guangzhou.jpg", Topous, CC BY-SA 4.0, from the NW at the foot
 *   (318 deg): base flare, podium;
 *   https://commons.wikimedia.org/wiki/File:TCF_Centra_Guangzhou.jpg
 *   "The top of GZCTFFC 20210712-01.jpg", 中少, CC BY-SA 4.0: the terracotta
 *   piers and glass close up;
 *   https://commons.wikimedia.org/wiki/File:The_top_of_GZCTFFC_20210712-01.jpg
 *   "Guangzhou Night.jpg", Yli584, CC0: night (piers lit white).
 *   https://commons.wikimedia.org/wiki/File:Guangzhou_Night.jpg
 * - No lidar, NAIP or Mapillary in Guangzhou (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 530 m top, 111 floors.
 * - Measured (OSM): the 64 m square, the bearing, the podium outlines.
 * - Measured (photo, 2024 south view): the first setback at ~350 m, the
 *   second at ~455 m, the crown top sloping down from 530 m at the
 *   south-west; the slope is drawn bolder (~28 m across the diagonal) so it
 *   reads at phone size.
 * - Estimated: the setback depths (0.6 m on the south and west faces,
 *   3-6 m on the north and east) and chamfers (3 / 5 / 7.5 m), the slope of
 *   the setback lines, the base flare, the crown screen and fin height
 *   (6 m), the pier spacing (drawn sparser than the real ~1.5 m), the
 *   mechanical bands, the podium heights (22 m for the 4-level outline,
 *   50 m for the 12-level part).
 * - Colours sampled from the 2018, 2021 and 2024 photos: glass #61788c-
 *   #717d8c -> #6c7f94; terracotta piers sunlit #d8d6d0 -> #e2e1dc (detail),
 *   tinted #c4ccd3 in the low model where they are drawn wider than real.
 *
 * Doubts
 * - The setbacks are really a play of corner pieces of different heights,
 *   which the photos from different sides don't fully resolve; the model
 *   draws them as stepped tiers with progressively bigger chamfered corners
 *   and pinwheel-sloped tops, which matches the S, SE and NW views in
 *   outline but not every corner exactly.
 * - The podium's heights and facade are only seen at the foot of two
 *   photos; drawn plain.
 *
 * Night: the glass glows as windows; the terracotta piers and crown fins are
 * floodlit (white LEDs light them every night).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'
import { saveLods, type Layer } from './auckland-sky-tower'

// ============================================================ shared kit (Guangzhou / Dongguan towers)

/** A chamfered square, CCW from above: S face (running +x), E, N, W; two vertices a face. */
export function chamferSquare(h: number, c: number, cx = 0, cy = 0): P2[] {
  return [
    [-h + c, -h], [h - c, -h], [h, -h + c], [h, h - c], [h - c, h], [-h + c, h], [-h, h - c], [-h, -h + c],
  ].map(([x, y]) => [cx + x, cy + y] as P2)
}

/** Walls between two rings of equal length, each vertex at its own z. */
export function loftZ(p: Part, r0: P2[], z0: (i: number) => number, r1: P2[], z1: (i: number) => number) {
  K.loft(p, K.at(r0, z0), K.at(r1, z1))
}

/** A cap over a star-shaped ring (fan from its centroid), each vertex at its own z, facing up or down. */
export function fanCap(p: Part, r: P2[], z: (i: number) => number, up: boolean, zc?: number) {
  const n = r.length
  const cx = r.reduce((s, q) => s + q[0], 0) / n, cy = r.reduce((s, q) => s + q[1], 0) / n
  const c: V3 = [cx, cy, zc ?? r.reduce((s, _q, i) => s + z(i), 0) / n]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [r[i][0], r[i][1], z(i)], b: V3 = [r[j][0], r[j][1], z(j)]
    if (up) p.tri(c, a, b)
    else p.tri(c, b, a)
  }
}

/**
 * A vertical bar on a face: centre `o` on the face (x, y), along-face unit
 * `t`, outward normal `n`; width `w`, standing `d` proud, from z0 to z1;
 * `back` sinks it into the wall. Sides and top only (and bottom if asked).
 */
export function vbar(p: Part, o: P2, t: P2, n: P2, w: number, d: number, z0: number, z1: number, back = 0.15, bottom = false) {
  const pt = (u: number, v: number): P2 => [o[0] + t[0] * u + n[0] * v, o[1] + t[1] * u + n[1] * v]
  const r: P2[] = [pt(-w / 2, -back), pt(w / 2, -back), pt(w / 2, d), pt(-w / 2, d)]
  K.prism(p, r, z0, z1, true, bottom)
}

// ============================================================ the tower

const ID = 'guangzhou-ctf-finance-centre'
const BEARING = 1
const ANCHOR = { lng: 113.3205608, lat: 23.1202004 }
const TOP = 530

/**
 * Tier plans and setback heights (see header). Each tier is a chamfered
 * rectangle that keeps close to the south and west faces and steps in on
 * the north and east, and each setback line and the crown are planes that
 * rise toward the south-west corner: z = z0 + g * d, d = -(x + y) / sqrt 2.
 */
const TIERS = [
  { x0: -32.0, x1: 32.0, y0: -32.0, y1: 32.0, c: 3.0, z: 346, g: 0.12 }, // offices
  { x0: -31.4, x1: 28.8, y0: -31.4, y1: 28.8, c: 5.0, z: 452, g: 0.12 }, // serviced apartments
  { x0: -30.8, x1: 23.4, y0: -30.8, y1: 23.4, c: 7.5, z: 507.9, g: 0.42 }, // hotel; crown line ~496 (NE) -> 524 (SW corner)
]
const FIN = 6 // the crown screen and fins rise this far above the crown line: 530 at the south-west corner
const dOf = (x: number, y: number) => -(x + y) / Math.SQRT2

/** A chamfered rectangle, CCW from above: S face (running +x), E, N, W; two vertices a face. */
export function chamferRect(x0: number, x1: number, y0: number, y1: number, c: number): P2[] {
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

type Set = { glass: Part; pier: Part; roof: Part; band: Part; pod: Part; podWin: Part }
const mk = (): Set => ({ glass: new Part(), pier: new Part(), roof: new Part(), band: new Part(), pod: new Part(), podWin: new Part() })

function build(detail: boolean): Layer[] {
  const s = mk()
  // low: sparser, thinner piers tinted toward the glass, so the tower reads as glass with fine lines; detail: dense white piers
  const step = detail ? 1.9 : 6.4
  const pierW = detail ? 1.0 : 1.1, pierD = detail ? 0.8 : 0.8
  type T = (typeof TIERS)[number]
  const ring = (T: T, grow = 0) => chamferRect(T.x0 - grow, T.x1 + grow, T.y0 - grow, T.y1 + grow, T.c)
  const plane = (T: T, dz = 0) => (r: P2[]) => (i: number) => T.z + dz + T.g * dOf(r[i][0], r[i][1])

  // ---- tier walls -------------------------------------------------------------
  // tier 0: the faces flare out a little at the foot (three rings)
  const foot = [{ z: 0, e: 1.2 }, { z: 22, e: 0.6 }, { z: 55, e: 0.15 }, { z: 90, e: 0 }]
  const eAt = (z: number) => {
    for (let k = 0; k < foot.length - 1; k++) if (z <= foot[k + 1].z) return foot[k].e + ((foot[k + 1].e - foot[k].e) * (z - foot[k].z)) / (foot[k + 1].z - foot[k].z)
    return 0
  }
  for (let k = 0; k < foot.length - 1; k++) loftZ(s.glass, ring(TIERS[0], foot[k].e), () => foot[k].z, ring(TIERS[0], foot[k + 1].e), () => foot[k + 1].z)
  let zBottom: (i: number) => number = () => 90
  for (let t = 0; t < TIERS.length; t++) {
    const T = TIERS[t], last = t === TIERS.length - 1
    const r = ring(T), zTop = last ? plane(T, FIN)(r) : plane(T)(r)
    loftZ(s.glass, r, zBottom, r, zTop)
    if (!last) {
      // the setback terrace: an angled ledge in to the next tier, with a pale lip under its edge
      const N = TIERS[t + 1], rn = ring(N)
      const rr = r
      K.loft(s.band, K.at(K.offset(rr, 0.35), (i) => zTop(i) - 1.4), K.at(K.offset(rr, 0.35), zTop))
      K.loft(s.band, K.at(rr, (i) => zTop(i) - 1.4), K.at(K.offset(rr, 0.35), (i) => zTop(i) - 1.4))
      K.loft(s.band, K.at(K.offset(rr, 0.35), zTop), K.at(rr, zTop))
      const zn = (i: number) => T.z + 0.8 + T.g * dOf(rn[i][0], rn[i][1])
      K.loft(s.roof, K.at(r, zTop), K.at(rn, zn))
      zBottom = zn
    } else {
      // the crown parapet: the glass screen carried up to the sloped line, its inner face, and a flat roof below
      const ri = K.offset(r, -0.6), zr = 486, zi = (i: number) => T.z + FIN + T.g * dOf(ri[i][0], ri[i][1])
      K.loft(s.glass, K.at(ri, zi).reverse(), K.at(ri, zr).reverse())
      K.loft(s.roof, K.at(r, zTop), K.at(ri, zi))
      K.cap(s.roof, ri, zr, true)
    }
  }

  // ---- piers (white terracotta) and crown fins ------------------------------------
  for (let t = 0; t < TIERS.length; t++) {
    const T = TIERS[t], last = t === TIERS.length - 1, P = TIERS[t - 1]
    const faces: { a: P2; b: P2; n: P2 }[] = [
      { a: [T.x0, T.y0], b: [T.x1, T.y0], n: [0, -1] }, { a: [T.x1, T.y0], b: [T.x1, T.y1], n: [1, 0] },
      { a: [T.x1, T.y1], b: [T.x0, T.y1], n: [0, 1] }, { a: [T.x0, T.y1], b: [T.x0, T.y0], n: [-1, 0] },
    ]
    for (const F of faces) {
      const L = Math.hypot(F.b[0] - F.a[0], F.b[1] - F.a[1]), tt: P2 = [(F.b[0] - F.a[0]) / L, (F.b[1] - F.a[1]) / L]
      const m = T.c + 0.9, n = Math.max(1, Math.round((L - 2 * m) / step))
      for (let j = 0; j <= n; j++) {
        const u = m + ((L - 2 * m) * j) / n
        const o: P2 = [F.a[0] + tt[0] * u, F.a[1] + tt[1] * u]
        const zt = T.z + T.g * dOf(o[0], o[1]) - (last ? 0 : 1.4)
        if (t === 0) {
          // follow the flared foot: a section at each ring, lofted
          const zs = [0, 22, 55, 90]
          const sec = (z: number): V3[] => {
            const e = eAt(z), c: P2 = [o[0] + F.n[0] * e, o[1] + F.n[1] * e]
            const Q = (a: number, b: number): V3 => [c[0] + tt[0] * a + F.n[0] * b, c[1] + tt[1] * a + F.n[1] * b, z]
            return [Q(-pierW / 2, -0.15), Q(pierW / 2, -0.15), Q(pierW / 2, pierD), Q(-pierW / 2, pierD)]
          }
          for (let q = 0; q < zs.length - 1; q++) {
            const a = sec(zs[q]), b = sec(zs[q + 1])
            const ccw = K.area(a.map((v) => [v[0], v[1]] as P2)) > 0
            K.loft(s.pier, ccw ? a : [...a].reverse(), ccw ? b : [...b].reverse())
          }
          vbar(s.pier, o, tt, F.n, pierW, pierD, 90, zt)
        } else {
          const zb = P.z + 0.8 + P.g * dOf(o[0], o[1])
          vbar(s.pier, o, tt, F.n, pierW, pierD, zb, zt)
          // crown fin: the pier carried up above the parapet line, deeper
          if (last) vbar(s.pier, o, tt, F.n, pierW, pierD + 0.3, zt, zt + FIN, 0.6)
        }
      }
    }
  }

  // ---- mechanical-floor bands (pale, between the piers) --------------------------
  const bands = detail ? [118, 236, 398] : []
  for (const zb of bands) {
    const T = TIERS[zb < 340 ? 0 : zb < 445 ? 1 : 2]
    K.band(s.band, ring(T), zb, zb + 1.2, 0.25, 0)
  }
  // entrance canopies at the foot of the south and north faces
  for (const sy of [-1, 1]) K.box(s.band, [0, sy * 36, 9], 12, 3.2, 0.5)

  // ---- podium: the OSM outline (4 levels) and its north part (12 levels) --------------
  podium(s, detail)

  return [
    { part: s.glass, material: windowVariant(2, 0x6c7f94) },
    { part: s.pier, material: { ...finish('ctf-terracotta', detail ? 0xe2e1dc : 0xc4ccd3), floodlight: () => 0.6 } },
    { part: s.band, material: { ...PALETTE.trim, color: 0xd7dbdf } },
    { part: s.roof, material: PALETTE.roof },
    { part: s.pod, material: finish('ctf-podium', 0xd9cdb8) },
    { part: s.podWin, material: PALETTE.window },
  ]
}

// OSM rings in the model frame (bearing 1, metres, 0.1 m)
const OUTLINE: P2[] = [[-5.7, 60.5], [-9.7, 31.7], [-14.7, 31.1], [-30.6, 28.9], [-32.8, 10.9], [-23.2, 5.2], [-22.5, -12.7], [-19.8, -30.3], [-9.7, -31.5], [3.2, -31.7], [18.7, -31.0], [30.8, -28.6], [51.1, -23.2], [71.0, -23.2], [72.3, 47.4], [71.9, 71.1], [70.9, 93.6], [62.9, 97.6], [55.8, 99.8], [47.2, 101.9], [36.4, 104.0], [21.1, 103.5], [10.0, 102.5], [7.8, 97.9], [3.8, 88.6], [0.1, 77.5], [-2.2, 71.3], [-4.0, 67.4]]
const NORTH: P2[] = [[72.3, 47.4], [71.9, 71.1], [70.9, 93.6], [62.9, 97.6], [55.8, 99.8], [47.2, 101.9], [36.4, 104.0], [21.1, 103.5], [10.0, 102.5], [7.8, 97.9], [3.8, 88.6], [0.1, 77.5], [-2.2, 71.3], [-4.0, 67.4], [-5.7, 60.5], [16.2, 54.1], [42.9, 49.5]]

function podium(s: Set, detail: boolean) {
  // the low podium: the outline less the tower square (drawn as the outline; the tower stands in it)
  const low = K.ccw(OUTLINE), north = K.ccw(NORTH)
  const H0 = 22, H1 = 50
  // walls: glass base storey, stone above with window bands every two storeys
  K.loft(s.podWin, K.at(low, 0), K.at(low, 7))
  K.loft(s.pod, K.at(low, 7), K.at(low, H0))
  K.cap(s.roof, low, H0, true)
  K.loft(s.podWin, K.at(north, 0), K.at(north, 7))
  K.loft(s.pod, K.at(north, 7), K.at(north, H1))
  K.cap(s.roof, north, H1, true)
  // window bands set just proud of the stone
  const bandsZ = detail ? [10, 15, 26, 31, 36, 41] : [11, 30, 40]
  for (const z of bandsZ) {
    if (z < H0) K.band(s.podWin, low, z, z + 3, 0.05, 0)
    K.band(s.podWin, north, z, z + 3, 0.05, 0)
  }
  // a parapet lip on the north block
  K.band(s.pod, north, H1, H1 + 1.2, 0.2, 0.4)
}

if (import.meta.main) {
  await saveLods(ID, 'Guangzhou CTF Finance Centre', build(false), build(true), {
    frame: 'Y up, -Z north, +X east, metres; origin at the centre of the tower part way/511404889, on the plaza',
    bearing: BEARING, height: TOP, anchor: [ANCHOR.lat, ANCHOR.lng],
  }, 6500)
}
