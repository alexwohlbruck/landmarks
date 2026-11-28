/**
 * Ningbo Central Plaza (宁波中心大厦, Ningbo Center), Eastern New Town, Yinzhou,
 * Ningbo — original procedural geometry, CC0-1.0.
 * bun generators/ningbo-central-plaza.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0; the plan is turned -15.9 deg (counter-clockwise from east)
 * to OSM's outline. Origin = the centre of the OSM outline way/1347205434
 * (121.6089394 E, 29.8637965 N), on the ground. Elevation 0.
 *
 * Form, as read from OSM and the one licensed photo of the finished tower
 * (KPF, completed 2024):
 * - a rounded-rectangle plan (a superellipse inscribed in OSM's 34 x 29 m box);
 * - a cigar profile: straight for the lower third, then easing in to a
 *   rounded bullet top at 409 m;
 * - 16 silver ribs on the deep-blue glass, each swaying left and right so
 *   neighbours meet in long pointed arches (apexes at ~0.63 H, a meeting
 *   with the other neighbour at ~0.30 H) and cross in Xs at the foot, all
 *   gathering at the top;
 * - five dark bands at the refuge floors.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/1347205434
 *   (宁波中心大厦, height 409, 80 levels, no Wikidata id on the way). A crude
 *   four-node box; its size is kept (see Doubts).
 * - Published: 409 m, 80 floors, KPF, completed 2024 (Wikipedia "Ningbo
 *   Central Plaza"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons):
 *   "Ningbo Center 2025-07-20.jpg", Cz4523, CC BY-SA 4.0, from the plaza to the
 *   east-north-east (the Hankyu mall in front, right), finished: the profile, the rib pattern, the bands, colours;
 *   https://commons.wikimedia.org/wiki/File:Ningbo_Center_2025-07-20.jpg
 *   "20230521建设中的宁波中心.jpg", Cz4523, CC BY-SA 4.0, the same viewpoint,
 *   topped out but unclad: used only to confirm the profile.
 *   https://commons.wikimedia.org/wiki/File:20230521%E5%BB%BA%E8%AE%BE%E4%B8%AD%E7%9A%84%E5%AE%81%E6%B3%A2%E4%B8%AD%E5%BF%83.jpg
 * - No other licensed photo of the finished tower on Commons, Openverse or
 *   Mapillary (no token). No lidar, NAIP. Look-only references: none.
 *
 * Numbers
 * - Published: 409 m.
 * - Measured (OSM): the box (33.9 x 28.8 m, turned 15.9 deg).
 * - Measured (photo, one view from below, so only roughly): the profile
 *   (width 1.0 to 0.35 H, 0.92 at 0.65 H, 0.66 at 0.88 H, 0.48 at 0.95 H),
 *   the arch apexes and the band heights.
 * - Estimated: rib size (1.0 m wide, 0.9 m proud), superellipse exponent,
 *   colours sampled (glass #3e5d81-#647e9c, bands #4a6a8d), pulled to the palette.
 *
 * Doubts
 * - Only one viewpoint: the other sides are drawn the same.
 * - The OSM outline is a rough box with a small area (981 m2) for a 409 m
 *   tower; the real plan is probably larger. It was not enlarged, as only one
 *   photo (from below) bears on it.
 * - No Wikidata id is set (none on the OSM way, and none checked).
 *
 * Night: the glass glows as windows (`window`, the bands `window-2`); the
 * silver ribs are floodlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { saveLods, type Layer, type XY } from './auckland-sky-tower'
import { grid, rib, pwl } from './shenzhen-ping-an-finance-centre'
import { cyl } from './nanjing-zifeng-tower'

const H = 409
const A = 16.95, B = 14.4, EXP = 3.2
const ROT = (-15.9 * Math.PI) / 180
const prof = (z: number) => pwl([[0, 1.0], [0.35, 1.0], [0.5, 0.975], [0.65, 0.92], [0.78, 0.82], [0.88, 0.66], [0.95, 0.48], [0.985, 0.27], [1, 0.04]], z / H)
const sp = (c: number, e: number) => Math.sign(c) * Math.pow(Math.abs(c), 2 / e)
/** A point on the plan at parameter t (radians), scaled by s, and its outward normal. */
const plan = (t: number, s: number): { p: XY; n: XY } => {
  const x = A * s * sp(Math.cos(t), EXP), y = B * s * sp(Math.sin(t), EXP)
  // normal of |x/a|^e + |y/b|^e = 1
  const nx = Math.sign(x) * Math.pow(Math.abs(x / (A * s)) + 1e-9, EXP - 1) / A, ny = Math.sign(y) * Math.pow(Math.abs(y / (B * s)) + 1e-9, EXP - 1) / B
  const l = Math.hypot(nx, ny) || 1
  const c = Math.cos(ROT), sn = Math.sin(ROT)
  return { p: [x * c - y * sn, x * sn + y * c], n: [(nx * c - ny * sn) / l, (nx * sn + ny * c) / l] }
}
const BANDS = [0.13, 0.27, 0.43, 0.6, 0.76].map((f) => f * H), BAND_H = 4.5

type Set = { glass: Part; band: Part; rib: Part }
const mk = (): Set => ({ glass: new Part(), band: new Part(), rib: new Part() })

function build(s: Set, d: boolean) {
  const NS = d ? 64 : 32
  const ts = Array.from({ length: NS }, (_, i) => (i / NS) * 2 * Math.PI)
  // ---- the body: rows, the bands inset 0.3 m
  const lv: [number, number, boolean][] = [[0, 0, false]]
  for (const b of BANDS) lv.push([b, 0, true], [b, -0.3, true], [b + BAND_H, -0.3, true], [b + BAND_H, 0, false])
  const upper = d ? [0.8, 0.84, 0.88, 0.91, 0.94, 0.96, 0.975, 0.988, 0.996, 1] : [0.82, 0.88, 0.93, 0.965, 0.988, 1]
  for (const f of upper) lv.push([f * H, 0, false])
  // fill the long glass stretches with a few more rows so the profile curves
  const rows: [number, number, boolean][] = []
  for (let k = 0; k < lv.length; k++) {
    rows.push(lv[k])
    if (k < lv.length - 1 && lv[k + 1][0] - lv[k][0] > (d ? 20 : 45)) {
      const m = Math.ceil((lv[k + 1][0] - lv[k][0]) / (d ? 20 : 45))
      for (let j = 1; j < m; j++) rows.push([lv[k][0] + ((lv[k + 1][0] - lv[k][0]) * j) / m, 0, false])
    }
  }
  const g: V3[][] = rows.map(([z, o]) => ts.map((t) => {
    const { p, n } = plan(t, prof(z))
    return [p[0] + n[0] * o, p[1] + n[1] * o, z] as V3
  }))
  grid(g, true, (_i, k) => (rows[k][2] && rows[k + 1] && rows[k + 1][2] ? s.band : s.glass), () => true)
  // the very top: a small cap
  cyl(s.rib, [0, 0], 0.9, H - 2, H + 1.5, 8, true, 0.3)

  // ---- the ribs: 16, swaying so that neighbours meet in pointed arches
  const N = 16, D = (2 * Math.PI) / N
  const zs: number[] = []
  const nz = d ? 70 : 26
  for (let k = 0; k <= nz; k++) zs.push(Math.min(H - 3, (H - 3) * (k / nz)))
  const sway = (z: number) => {
    const f = Math.cos((Math.PI * (z - 0.63 * H)) / (0.33 * H))
    // at the foot the ribs cross in Xs: the sway overshoots
    const amp = z < 0.1 * H ? 1 + 0.35 * (1 - z / (0.1 * H)) : 1
    return f * amp
  }
  for (let i = 0; i < N; i++) {
    const sgn = i % 2 ? -1 : 1
    const path: V3[] = [], out: V3[] = []
    for (const z of zs) {
      const t = i * D + D / 4 + sgn * sway(z) * (D / 2)
      const { p, n } = plan(t, prof(z))
      path.push([p[0], p[1], z]); out.push([n[0], n[1], 0])
    }
    const f = (k: number) => Math.max(0.35, Math.min(1, prof(zs[k]) / 0.5))
    rib(s.rib, path, out, (k) => (d ? 0.8 : 1.1) * f(k), (k) => (d ? 0.8 : 1.0) * f(k), 0.15, true)
  }
}

// ---- Materials and output ----------------------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x58789c }
const BAND: MaterialSpec = windowVariant(2, 0x4b6380)
const RIB: MaterialSpec = { ...finish('nbc-silver', 0xccd2da, 0.5), floodlight: () => 0.8 }
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.band, material: BAND },
  { part: s.rib, material: RIB },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('ningbo-central-plaza', 'Ningbo Central Plaza', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centre, on the ground',
    bearing: 0, height: H + 1.5,
  }, 5000)
}
