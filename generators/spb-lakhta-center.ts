/**
 * Lakhta Center, Lakhta, Saint Petersburg — original procedural geometry, CC0-1.0.
 * bun generators/spb-lakhta-center.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (model +y = north). Origin = the centre of the OSM tower
 * outline relation/18102137 (30.178102 E, 59.987032 N), on the ground; the
 * tower axis stands on it. y = 0 is the plaza; elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - a five-pointed star in plan: five wings whose tips stand at radius Rt and
 *   whose re-entrant valleys stand at 0.70 Rt (OSM outline and every OSM part
 *   keep that ratio), the faces between them straight in plan;
 * - the star turns counter-clockwise (seen from above) as it rises, 90 degrees
 *   from the foot to the tip, so each wing's ridge is a helix;
 * - the plan shrinks slowly to ~220 m, then faster, in one smooth curve that
 *   runs on into the spire: the glazed shaft ends at ~362 m and the open
 *   spire (steel lattice under glass and metal mesh) carries the five ridges
 *   on to a needle point at 462 m;
 * - pale silver ridges (the folds at the wing tips) and darker glass in the
 *   valleys, which is how the twist reads from afar; a silver band where the
 *   glass shaft meets the spire;
 * - the detail LOD draws the spire as it is: a translucent skin over a
 *   lattice of ridge ribs and rings, with the central mast inside.
 * - The low multifunctional building (OSM relation/18102141) is a separate
 *   building and is left to the map.
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline relation/18102137
 *   (height 462, 87 levels, Q4255374), its building relation
 *   relation/14667933, and the parts relation/18102140 (0-115 m),
 *   way/566178962 (115-231), way/566178964 (231-347), way/566178963
 *   (347-404), way/566178961 (404-433), way/566178960 (433-462).
 * - Published: 462 m, 87 floors, observatory at 357 m, completed 2018-2019;
 *   spire glass replaced with metal mesh against ice (Wikipedia "Lakhta
 *   Center"). Twist of 90 degrees: the architects' description (RMJM), as
 *   commonly cited; see doubts.
 * - Photos (Wikimedia Commons, daylight):
 *   "Saint Petersburg Lakhta center.jpg", Ad Meskens, CC BY-SA 4.0, from the
 *   gulf far off (~SSW): the silhouette, measured row by row (widths below);
 *   https://commons.wikimedia.org/wiki/File:Saint_Petersburg_Lakhta_center.jpg
 *   "Lakhta Center in 2018.jpg", Andrey Korzun, CC BY-SA 4.0, from the beach
 *   (~S): ridges, twist, spire, glass colour;
 *   https://commons.wikimedia.org/wiki/File:Lakhta_Center_in_2018.jpg
 *   "Lakhta Center July 2019.jpg" and "Lakhta Center July 2019 (2).jpg",
 *   Linus Folke Jensen, CC BY-SA 4.0: ridges and colour in low sun;
 *   https://commons.wikimedia.org/wiki/File:Lakhta_Center_July_2019.jpg
 *   https://commons.wikimedia.org/wiki/File:Lakhta_Center_July_2019_(2).jpg
 *   "Lakhta Center Airat.jpg", Ayratayrat, CC BY-SA 4.0;
 *   https://commons.wikimedia.org/wiki/File:Lakhta_Center_Airat.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 462 m top.
 * - Measured (OSM): tip radius 36 m and valley 25 m at the foot; the star's
 *   bearing at the foot (tips at -13 deg + 72k); the 0.70 valley ratio.
 * - Measured (photo, Ad Meskens, scaled to 462 m): projected width 66.6 m at
 *   60 m, 63 at 166, 56.8 at 220, 49.7 at 273, 44 at 309, 37.3 at 344, 33.7
 *   at 362, 25.3 at 397, 19.5 at 415, 13.3 at 433, 6.2 at 451; turned into
 *   tip radii with width = 1.87 Rt. These agree with the OSM parts.
 * - Measured (photo): the glazed shaft ends and the spire begins at ~356-371 m.
 * - Estimated: ridge size (1.4 m proud, 2.2 m wide: bolder than the real
 *   folds so they read at phone size); colours sampled from the 2018 and Ad
 *   Meskens photos (#61819a-#778c9b glass, #526d88 in shade; spire
 *   #909aa4-#abab97).
 * - Invented: none of the massing.
 *
 * Doubts
 * - The OSM parts turn only ~27 degrees by 420 m; the model follows the
 *   published 90 degrees, which the 2018 photo's ridge drift supports better.
 * - The wing faces are drawn straight in plan; the real ones are slightly
 *   curved. The base lobby and entrances are not modelled (no clear photo).
 *
 * Night: the glass shaft glows as windows; the silver ridges and the spire
 * are floodlit (the tower's ridges and spire are lit at night).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, saveLods, type Layer } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'

const TOP = 462
const SHAFT = 362 // glazed shaft ends, spire begins
const K = 0.7 // valley radius / tip radius
const PHASE0 = 103.2 // math angle (deg, ccw from east) of the first tip at the foot = bearing -13.2
const TWIST = 65 // degrees counter-clockwise, foot to tip (from the photos; see header)

// tip radius by height (photo widths / 1.87, OSM at the foot)
const PROFILE: [number, number][] = [[0, 36], [60, 35.6], [113, 34.6], [166, 33.4], [220, 30.6], [273, 26.8], [309, 23.6], [344, 20.2], [362, 18.0], [397, 13.6], [415, 10.5], [433, 7.2], [451, 3.4], [462, 0]]
function Rt(z: number): number {
  return 0.96 * Rt0(z)
}
function Rt0(z: number): number {
  const P = PROFILE
  if (z <= 0) return P[0][1]
  for (let i = 0; i < P.length - 1; i++) {
    const [z0, r0] = P[i], [z1, r1] = P[i + 1]
    if (z <= z1) {
      // Catmull-Rom on the table (uniform in index), for a smooth outline
      const rm = i > 0 ? P[i - 1][1] : r0 - (r1 - r0), rp = i + 2 < P.length ? P[i + 2][1] : r1 + (r1 - r0)
      const t = (z - z0) / (z1 - z0), t2 = t * t, t3 = t2 * t
      return 0.5 * (2 * r0 + (-rm + r1) * t + (2 * rm - 5 * r0 + 4 * r1 - rp) * t2 + (-rm + 3 * r0 - 3 * r1 + rp) * t3)
    }
  }
  return 0
}
const phase = (z: number) => PHASE0 + (TWIST * z) / TOP

/** Star ring at z: 10 corners (tip, valley, ...), `m` columns per facet, ccw from above. */
function starRing(z: number, m: number, out = 0, rScale = 1): V3[] {
  const R = Rt(z) * rScale, a0 = phase(z) // Rt already includes the 0.96 width fit
  const pts: V3[] = []
  for (let j = 0; j < 10; j++) {
    const aA = ((a0 + 36 * j) * Math.PI) / 180, aB = ((a0 + 36 * (j + 1)) * Math.PI) / 180
    const rA = (j % 2 === 0 ? R : K * R) + out, rB = (j % 2 === 0 ? K * R : R) + out
    const A = [rA * Math.cos(aA), rA * Math.sin(aA)], B = [rB * Math.cos(aB), rB * Math.sin(aB)]
    for (let s = 0; s < m; s++) {
      const t = s / m
      pts.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z])
    }
  }
  return pts
}

type Set = { glass: Part; dark: Part; silver: Part; spire: Part; mast: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), dark: new Part(), silver: new Part(), spire: new Part(), mast: new Part(), roof: new Part() })

const nrm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/**
 * A proud rib along a curve on the surface: `pts` with outward horizontal
 * directions `out`; `w` wide (tangential), `d` proud. Draws the two sides and
 * the outer face, smooth along the length.
 */
function rib(p: Part, pts: V3[], out: V3[], w: number | ((k: number) => number), d: number | ((k: number) => number)) {
  const W = typeof w === 'number' ? () => w : w, D = typeof d === 'number' ? () => d : d
  const sec = pts.map((c, k) => {
    const u = nrm([out[k][0], out[k][1], 0]), t: V3 = [-u[1], u[0], 0]
    const h = W(k) / 2, dd = D(k)
    const back = -0.6 // start a little inside the surface so no gap shows
    return {
      l0: [c[0] - t[0] * h + u[0] * back, c[1] - t[1] * h + u[1] * back, c[2]] as V3,
      l1: [c[0] - t[0] * h + u[0] * dd, c[1] - t[1] * h + u[1] * dd, c[2]] as V3,
      r1: [c[0] + t[0] * h + u[0] * dd, c[1] + t[1] * h + u[1] * dd, c[2]] as V3,
      r0: [c[0] + t[0] * h + u[0] * back, c[1] + t[1] * h + u[1] * back, c[2]] as V3,
      u, t,
    }
  })
  for (let k = 0; k < sec.length - 1; k++) {
    const a = sec[k], b = sec[k + 1]
    const nl = nrm([-a.t[0] - b.t[0], -a.t[1] - b.t[1], 0]), nr = nrm([a.t[0] + b.t[0], a.t[1] + b.t[1], 0])
    face(p, [a.l0, a.l1, b.l1, b.l0], nl)
    face(p, [a.r1, a.r0, b.r0, b.r1], nr)
    p.tri(a.l1, a.r1, b.r1, undefined, undefined, undefined, [a.u, a.u, b.u])
    p.tri(a.l1, b.r1, b.l1, undefined, undefined, undefined, [a.u, b.u, b.u])
  }
}

function build(s: Set, d: boolean) {
  const m = d ? 4 : 2 // columns per facet
  const N = 10 * m
  // levels: shaft and spire
  const levels: number[] = []
  const shaftStep = d ? 4 : 11
  for (let z = 0; z < SHAFT; z += shaftStep) levels.push(z)
  levels.push(SHAFT)
  const spireLevels: number[] = [SHAFT]
  const spStep = d ? 4 : 8
  for (let z = SHAFT + spStep; z < TOP - 2; z += spStep) spireLevels.push(z)
  spireLevels.push(TOP - 2)

  // column i belongs to facet floor(i/m); the column just before or after a valley is dark glass
  const valleyCol = (i: number) => {
    const f = Math.floor(i / m), s0 = i % m
    return (f % 2 === 0 && s0 === m - 1) || (f % 2 === 1 && s0 === 0)
  }
  const crease = (i: number) => i % m === 0 // tips and valleys
  gridSurface(levels.map((z) => starRing(z, m)), true, (i) => (valleyCol(i) ? s.dark : s.glass), crease)

  // the band where the shaft meets the spire: a proud silver collar
  const C0 = SHAFT - 2.5, C1 = SHAFT + 1.0
  gridSurface([starRing(C0, m, 0), starRing(C0, m, 0.9), starRing(C1, m, 0.9), starRing(C1, m, 0)], true, () => s.silver, (i) => i % m === 0, () => true)

  // the spire skin
  const spRings = spireLevels.map((z) => starRing(z, m))
  gridSurface(spRings, true, () => s.spire, crease)
  // its needle point
  const last = spRings[spRings.length - 1]
  for (let i = 0; i < N; i++) face(s.silver, [last[i], last[(i + 1) % N], [0, 0, TOP]], nrm([last[i][0] + last[(i + 1) % N][0], last[i][1] + last[(i + 1) % N][1], 0.6]))
  if (d) {
    // inside the open spire: its rings and the mast, seen through the skin
    for (let z = SHAFT + 10; z < TOP - 12; z += 12) {
      const r = starRing(z, 1, -0.4), r1 = starRing(z + 0.9, 1, -0.4), ri = starRing(z, 1, -1.4), ri1 = starRing(z + 0.9, 1, -1.4)
      for (let i = 0; i < 10; i++) {
        const j = (i + 1) % 10
        face(s.mast, [ri[i], ri[j], r[j], r[i]], [0, 0, -1])
        face(s.mast, [r1[i], r1[j], ri1[j], ri1[i]], [0, 0, 1])
        face(s.mast, [ri1[i], ri1[j], ri[j], ri[i]], nrm([-(ri[i][0] + ri[j][0]), -(ri[i][1] + ri[j][1]), 0]))
      }
    }
    // the mast
    const mr = (z: number) => Math.max(0.5, 3.2 * (1 - (z - SHAFT) / (TOP - SHAFT)))
    const ms: V3[][] = []
    for (let z = SHAFT; z <= TOP - 4; z += 8) {
      const ring: V3[] = []
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; ring.push([mr(z) * Math.cos(a), mr(z) * Math.sin(a), z]) }
      ms.push(ring)
    }
    gridSurface(ms, true, () => s.mast)
    // the shaft's roof under the spire
    const top = starRing(SHAFT, 1)
    for (let i = 0; i < 10; i++) face(s.roof, [[0, 0, SHAFT], top[i], top[(i + 1) % 10]], [0, 0, 1])
  }

  // ridges at the five tips, foot to needle
  const all = [...levels.filter((z) => z < SHAFT), ...spireLevels]
  const rz = d ? all : all.filter((_, k) => k % 1 === 0)
  for (let j = 0; j < 5; j++) {
    const pts: V3[] = [], out: V3[] = []
    for (const z of rz) {
      const a = ((phase(z) + 72 * j) * Math.PI) / 180, R = Rt(z)
      pts.push([R * Math.cos(a), R * Math.sin(a), z])
      out.push([Math.cos(a), Math.sin(a), 0])
    }
    const sc = (k: number) => Math.max(0.35, Math.min(1, Rt(rz[k]) / 18))
    rib(s.silver, pts, out, (k) => (d ? 1.8 : 2.2) * sc(k), (k) => (d ? 1.2 : 1.4) * sc(k))
  }
  // detail: thin silver lines in the valleys (the folds between wings), shaft only
  if (d) {
    for (let j = 0; j < 5; j++) {
      const pts: V3[] = [], out: V3[] = []
      for (const z of levels) {
        const a = ((phase(z) + 72 * j + 36) * Math.PI) / 180, R = K * Rt(z)
        pts.push([R * Math.cos(a), R * Math.sin(a), z])
        out.push([Math.cos(a), Math.sin(a), 0])
      }
      rib(s.silver, pts, out, 0.9, 0.5)
    }
  }
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x7f9ab1 }
const DARK: MaterialSpec = windowVariant(2, 0x657f98)
const SILVER: MaterialSpec = { ...finish('lk-silver', 0xc9d1d6, 0.45), floodlight: (p, n) => (n[2] > 0.8 ? 0.2 : 0.85) }
const SPIRE_LOW: MaterialSpec = { ...finish('lk-spire', 0x96a1aa, 0.5), floodlight: () => 0.7 }
const SPIRE_DET: MaterialSpec = { name: 'glass', color: 0x8fa5b6, roughness: 0.3, opacity: 0.55, doubleSided: true }
const MAST: MaterialSpec = { ...finish('lk-spire', 0x96a1aa, 0.5), floodlight: () => 0.7 }
const ROOF: MaterialSpec = PALETTE.roof

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set, d: boolean): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.dark, material: DARK },
  { part: s.silver, material: SILVER },
  { part: s.spire, material: d ? SPIRE_DET : SPIRE_LOW },
  { part: s.mast, material: MAST },
  { part: s.roof, material: ROOF },
]

if (import.meta.main) {
  await saveLods('spb-lakhta-center', 'Lakhta Center', layers(low, false), layers(det, true), {
    frame: 'Y up, -Z north, +X east, metres; origin at the centre of the OSM tower outline, on the plaza',
    bearing: 0, height: TOP,
  }, 5000)
}
