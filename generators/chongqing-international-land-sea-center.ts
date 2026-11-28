/**
 * International Land-Sea Center (陆海国际中心), Hualongqiao, Yuzhong, Chongqing —
 * original procedural geometry, CC0-1.0.
 * bun generators/chongqing-international-land-sea-center.ts   (low model and detail LOD)
 *
 * Frame: bearing 10 (model +y points 10 degrees east of north, along the long
 * axis of the OSM outline way/1379102418). Origin = the centroid of that
 * outline (106.5132279 E, 29.5534317 N), on the ground; y = 0 is the plaza;
 * elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - an egg-shaped plan, 60 x 81 m (OSM), the envelope straight to ~200 m and
 *   then tapering;
 * - split by a deep groove into two volumes: a main body on the north side and
 *   a lower shoulder on the south side. The groove runs diagonally up the
 *   facade: at the foot it lies a fifth of the way north of the centre, at the
 *   shoulder's flat top (~372 m) half way to the south end, so the main body
 *   widens as it rises and the shoulder thins out;
 * - above the shoulder the main body alone rises, still tapering, to a flat
 *   top at 458.2 m with a light parapet;
 * - the curtain wall is pale, silvery and reflective, its panels in shingled
 *   tiers ~18 m high: drawn as soft horizontal steps (a 0.35 m set-back at the
 *   foot of each tier; every second tier in the low model).
 *
 * Evidence
 * - OSM (API map call, fetched 2026-11-27): outline way/1379102418
 *   (building=office, height 458.2, 98 levels, name 陆海国际中心). Wikidata
 *   Q1666430 (zh 陆海国际中心, 458 m; its English label "International
 *   Commerce Center 1" is the old project name; coordinates on the outline).
 *   The surrounding mall 重庆印象城 (way/1379102420) and T2 (way/1379102419,
 *   181 m) are separate buildings and are left to the map.
 * - Published: 458 m (CTBUH; completed 2024–2025).
 * - Photos (Wikimedia Commons):
 *   "Chongqing International Land-Sea Center 20251028.jpg", DvTor8303, CC0,
 *   daylight, camera 1.96 km east (Commons camera location, Liziba viewing
 *   platform), finished tower: the profile (measured row by row), the groove,
 *   the shoulder top, the colour;
 *   https://commons.wikimedia.org/wiki/File:Chongqing_International_Land-Sea_Center_20251028.jpg
 *   "陆海国际中心2024.5.jpg", 重庆轨交18, CC BY-SA 4.0, from Fotuguan park to the
 *   south-east (May 2024, crown still being clad): the groove and the shoulder
 *   on the south side;
 *   https://commons.wikimedia.org/wiki/File:%E9%99%86%E6%B5%B7%E5%9B%BD%E9%99%85%E4%B8%AD%E5%BF%832024.5.jpg
 *   "陆海国际中心印象城.jpg", 虹色分子, CC BY-SA 4.0: the curtain wall's panel
 *   tiers at the foot; https://commons.wikimedia.org/wiki/File:%E9%99%86%E6%B5%B7%E5%9B%BD%E9%99%85%E4%B8%AD%E5%BF%83%E5%8D%B0%E8%B1%A1%E5%9F%8E.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 458 m (OSM 458.2, used).
 * - Measured (OSM): the plan.
 * - Measured (photo DvTor8303, from the east, scaled so the widest N–S extent
 *   is OSM's 81 m): envelope width 1.0 up to ~200 m, 0.957 at 267, 0.91 at
 *   320, 0.845 at 372; the main body above the shoulder 54 m at 390, 47.5 m at
 *   442; the shoulder top at ~372 m; the groove at 40 % of the width from the
 *   north edge at the foot and 77 % at 380 m.
 * - Estimated: the groove 1.4 m wide (bolder than the real one so it reads);
 *   the foot (hidden behind a viaduct; the photo's scale is taken from OSM);
 *   tier steps; colours sampled from the DvTor8303 photo (#abb3c7–#b2c3dd
 *   glass in light, pulled to #9fb0c3).
 *
 * Doubts
 * - The groove is drawn as a plane square to the long axis; its real plan
 *   direction is only seen from the east and south-east.
 * - The base is hidden in every finished-tower photo; the podium links to the
 *   mall are not modelled.
 * - The crown: the finished photo shows a flat top with a thin rim; whatever
 *   plant sits behind it is not visible.
 *
 * Night: the curtain wall glows as windows; the rims are lightly floodlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { face, saveLods, type Layer } from './auckland-sky-tower'
import { gridSurface } from './shanghai-tower'
import { capRing, centroidXY, interp, smoothInterp, type XY } from './wuhan-greenland-center'

const TOP = 458.2
const SHOULDER = 372
const GAP = 0.7 // half the groove
const OSM: XY[] = [[-1.9, 40.2], [-10.6, 37.2], [-17.2, 31.4], [-22.1, 24.3], [-25.8, 16.4], [-28.3, 8.5], [-29.7, 1.1], [-30.0, -7.1], [-29.2, -15.2], [-26.6, -23.7], [-22.8, -30.0], [-18.3, -34.8], [-13.0, -38.2], [-6.4, -40.3], [1.3, -40.1], [7.3, -38.4], [13.0, -35.1], [18.5, -30.2], [23.5, -22.8], [26.7, -15.3], [28.8, -7.3], [29.6, 0.1], [29.6, 8.5], [28.4, 17.1], [25.7, 25.2], [21.1, 32.7], [13.7, 38.1], [6.6, 40.6]]
const ENV: [number, number][] = [[0, 1], [200, 1], [267, 0.957], [320, 0.91], [372, 0.845]]
const MAIN: [number, number][] = [[SHOULDER, 1], [390, 0.985], [442, 0.875], [TOP, 0.84]]
const L0 = 40.4 // half-length of the plan

// polar radius of the OSM outline at angle t (ray from the origin)
function radius(t: number): number {
  const d: XY = [Math.cos(t), Math.sin(t)]
  let best = 0
  for (let i = 0; i < OSM.length; i++) {
    const a = OSM[i], b = OSM[(i + 1) % OSM.length]
    const e: XY = [b[0] - a[0], b[1] - a[1]]
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const s = (a[0] * e[1] - a[1] * e[0]) / den, u = (a[0] * d[1] - a[1] * d[0]) / den
    if (s > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.max(best, s)
  }
  return best
}
// smooth the polar radius a little
const RN = 720
const RAD = (() => {
  const raw = Array.from({ length: RN }, (_, i) => radius((i / RN) * 2 * Math.PI))
  return raw.map((_, i) => { let s = 0; for (let k = -6; k <= 6; k++) s += raw[(i + k + RN) % RN]; return s / 13 })
})()
const rAt = (t: number) => { const u = ((((t / (2 * Math.PI)) % 1) + 1) % 1) * RN, i = Math.floor(u), f = u - i; return RAD[i % RN] * (1 - f) + RAD[(i + 1) % RN] * f }
const env = (t: number, k: number): XY => { const r = rAt(t) * k; return [r * Math.cos(t), r * Math.sin(t)] }

/** angle on the envelope (scale k) where y = yc, on the east (east=true) or west side */
function cut(yc: number, k: number, east: boolean): number {
  let lo = east ? -Math.PI / 2 : Math.PI / 2, hi = east ? Math.PI / 2 : (3 * Math.PI) / 2
  for (let it = 0; it < 50; it++) {
    const m = (lo + hi) / 2, y = env(m, k)[1]
    if (east ? y < yc : y > yc) lo = m; else hi = m
  }
  return (lo + hi) / 2
}

/** groove position (y, frame) at height z, as a fraction of the half-length */
const grooveF = (z: number) => interp([[0, 0.2], [SHOULDER, -0.54]], z)

/** a ring of n arc points + the chord: the part of the envelope north (main) or south (shoulder) of y = yc */
function part(yc: number, k: number, n: number, north: boolean): XY[] {
  const te = cut(yc, k, true), tw = cut(yc, k, false)
  const [t0, t1] = north ? [te, tw] : [tw, te + 2 * Math.PI]
  const out: XY[] = []
  for (let i = 0; i < n; i++) out.push(env(t0 + ((t1 - t0) * i) / (n - 1), k))
  return out // CCW; the chord closes from the last point back to the first
}

type Set = { glass: Part; groove: Part; rim: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), groove: new Part(), rim: new Part(), roof: new Part() })

function build(s: Set, d: boolean) {
  const n = d ? 64 : 30
  const tier = d ? 18 : 36
  // heights: tier steps (a set-back row just above each tier line)
  const zsAll: number[] = [0]
  for (let z = tier; z < TOP - 4; z += tier) zsAll.push(z - 0.01, z)
  zsAll.push(SHOULDER, TOP - 1.6) // the rim's 1.6 m brings the top to TOP
  const zs = [...new Set(zsAll.map((z) => +z.toFixed(2)))].sort((a, b) => a - b)
  const stepIn = (z: number) => (z > 0 && z < TOP - 1 && Math.abs(z / tier - Math.round(z / tier)) < 1e-6 ? 0.6 : 0)
  const envK = (z: number) => smoothInterp(ENV, Math.min(z, SHOULDER))

  // the main body's plan at the shoulder: kept and scaled about its centroid above it
  const yS = grooveF(SHOULDER) * L0 * envK(SHOULDER)
  const mainS = part(yS + GAP, envK(SHOULDER), n, true)
  const cS = centroidXY(mainS)
  const mainRing = (z: number): XY[] => {
    if (z <= SHOULDER) { const k = envK(z); return part(grooveF(z) * L0 * k + GAP, k, n, true) }
    const m = smoothInterp(MAIN, z)
    return mainS.map((p) => [cS[0] + (p[0] - cS[0]) * m, cS[1] + (p[1] - cS[1]) * m] as XY)
  }
  const shoulderRing = (z: number): XY[] => { const k = envK(z); return part(grooveF(z) * L0 * k - GAP, k, n, false) }

  const inset = (r: XY[], c: XY, by: number): XY[] => r.map((p) => { const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; return [p[0] - (dx / l) * by, p[1] - (dy / l) * by] as XY })
  const body = (ringAt: (z: number) => XY[], z0: number, z1: number, cap: 'rim' | 'roof', closed = false) => {
    const rows: V3[][] = []
    for (const z of zs) {
      if (z < z0 - 1e-6 || z > z1 + 1e-6) continue
      let r = ringAt(z)
      const st = stepIn(z)
      if (st) r = inset(r, centroidXY(r), st)
      rows.push(r.map((p) => [p[0], p[1], z] as V3))
    }
    // arc surface (open: the chord is drawn separately)
    gridSurface(rows, closed, () => s.glass)
    // the chord face, into the groove
    if (!closed) for (let k = 0; k < rows.length - 1; k++) {
      const a = rows[k], b = rows[k + 1]
      const A0 = a[n - 1], A1 = a[0], B0 = b[n - 1], B1 = b[0]
      const e: V3 = [A1[0] - A0[0], A1[1] - A0[1], 0]
      face(s.groove, [A0, A1, B1, B0], [e[1], -e[0], 0])
    }
    if (cap === 'roof') capRing(s.roof, rows[rows.length - 1].map((p) => [p[0], p[1], p[2]] as V3), true)
    if (cap === 'rim') {
      const top = rows[rows.length - 1]
      // rim: a parapet 1.6 m tall, 0.8 m thick, round the arc and chord; roof inside
      const c = centroidXY(top.map((p) => [p[0], p[1]] as XY))
      const zt = top[0][2]
      const inner = inset(top.map((p) => [p[0], p[1]] as XY), c, 0.9)
      const outer = top
      const nn0 = top.length
      for (let i = 0; i < nn0; i++) {
        const j = (i + 1) % nn0
        const o0 = outer[i], o1 = outer[j]
        const i0: V3 = [inner[i][0], inner[i][1], zt], i1: V3 = [inner[j][0], inner[j][1], zt]
        const nn: V3 = [o1[1] - o0[1], -(o1[0] - o0[0]), 0]
        face(s.rim, [o0, o1, [o1[0], o1[1], zt + 1.6], [o0[0], o0[1], zt + 1.6]], nn)
        face(s.rim, [[o0[0], o0[1], zt + 1.6], [o1[0], o1[1], zt + 1.6], [i1[0], i1[1], zt + 1.6], [i0[0], i0[1], zt + 1.6]], [0, 0, 1])
        face(s.rim, [[i0[0], i0[1], zt + 1.6], [i1[0], i1[1], zt + 1.6], i1, i0], [-nn[0], -nn[1], 0])
      }
      capRing(s.roof, inner.map((p) => [p[0], p[1], zt + 0.2] as V3), true)
    }
  }
  body(mainRing, 0, SHOULDER, 'roof')
  body(shoulderRing, 0, SHOULDER, 'rim')
  // above the shoulder the main body is a whole rounded tower again: the egg, scaled
  // (x to the envelope's width at the shoulder, y to the measured 54 m) and tapering
  const nU = d ? 96 : 40
  const yc = L0 * envK(SHOULDER) - 0.665 * L0
  const upper = (z: number): XY[] => {
    const m = smoothInterp(MAIN, z), kx = envK(SHOULDER) * m, ky = 0.665 * m
    return Array.from({ length: nU }, (_, i) => { const p = env((i / nU) * 2 * Math.PI, 1); return [p[0] * kx, yc + p[1] * ky] as XY })
  }
  body(upper, SHOULDER, TOP - 1.6, 'rim', true)
}

// ---- Materials and output ----------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x9fb0c3 }
const GROOVE: MaterialSpec = finish('land-sea-groove', 0x56657a, 0.5)
const RIM: MaterialSpec = { ...finish('land-sea-rim', 0xd6dce2, 0.45), floodlight: () => 0.6 }
const ROOFM: MaterialSpec = PALETTE.roof

const low = mk(), det = mk()
build(low, false)
build(det, true)
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.groove, material: GROOVE },
  { part: s.rim, material: RIM },
  { part: s.roof, material: ROOFM },
]

if (import.meta.main) {
  await saveLods('chongqing-international-land-sea-center', 'International Land-Sea Center', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres, turned to bearing 10; origin at the centroid of the OSM outline, on the plaza',
    bearing: 10, height: TOP,
  }, 5000)
}
