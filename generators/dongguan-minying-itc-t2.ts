/**
 * Minying International Trade Center T2 (民盈·国贸中心 T2, formerly Dongguan
 * International Trade Center T1), Dongcheng, Dongguan — original procedural
 * geometry, CC0-1.0.
 * bun generators/dongguan-minying-itc-t2.ts   (writes the low model and the detail LOD)
 *
 * Frame: BEARING 10 (the OSM square is turned about 10 deg clockwise from
 * north), model +y = compass 10. Origin = the centroid of the OSM outline
 * way/1287829518 (113.7581353 E, 23.0141904 N), on the plaza; elevation 0.
 *
 * Form, as read from the photos:
 * - a square glass tower whose corners are cut by chamfer facets that grow
 *   from almost nothing at the foot to a near-regular octagon at the top,
 *   along gently curved creases: each main face narrows as it rises while
 *   its corner facets widen, which gives the tower its tapering,
 *   twisted-looking silver crease lines (drawn as pale 3D trims);
 * - a slight entasis: the square swells a little to ~110 m, then narrows
 *   to 0.82 of the base width at the top of the glass (379 m);
 * - the crown: an open octagonal screen of vertical glass fins (379-411 m)
 *   round a glass roof that rises in a shallow pyramid inside, with four
 *   spikes leaning out from its corners to 422.6 m;
 * - darker bands at the mechanical floors (~97 m and ~245 m).
 *
 * Evidence
 * - OSM (© OpenStreetMap contributors, ODbL), fetched 2026-11-27: outline
 *   way/1287829518 "T2栋" (422.6 m, 96 levels, wikidata Q19458189,
 *   "Dongguan International Trade Center 1"); its neighbours T1
 *   way/1311436803 and T3 way/1311436804 (210 m) and the mall
 *   way/1311436810 are separate buildings.
 * - Published (Wikipedia "Minying International Trade Center T2"): 422.6 m,
 *   96 floors, 215,000 m2, 5+design; topped out January 2020, opened
 *   26 September 2021.
 * - Photos (Wikimedia Commons):
 *   "Minying International Trade Center T2 in 2021.jpg", David290, CC BY-SA
 *   4.0, from a hill at a distance (near face-on, telephoto): profile and
 *   widths (0.268 m/px), creases, crown, bands, colour;
 *   https://commons.wikimedia.org/wiki/File:Minying_International_Trade_Center_T2_in_2021.jpg
 *   "Minying International Trade Center, Dongguan-2022.jpg", David290,
 *   CC BY-SA 4.0: the same view, crown spikes;
 *   https://commons.wikimedia.org/wiki/File:Minying_International_Trade_Center,_Dongguan-2022.jpg
 *   "东莞民盈国贸大厦T2 13122024.jpg", TaiZiThee 832, CC BY 4.0, from the
 *   street: the octagonal crown, creases, colour;
 *   https://commons.wikimedia.org/wiki/File:%E4%B8%9C%E8%8E%9E%E6%B0%91%E7%9B%88%E5%9B%BD%E8%B4%B8%E5%A4%A7%E5%8E%A6T2_13122024.jpg
 *   "Dongguan, February 12, 2024 (2).jpg", メイド理世, CC BY-SA 4.0, from the
 *   west at the foot (281 deg): the crease sweeping up a face, the base;
 *   https://commons.wikimedia.org/wiki/File:Dongguan,_February_12,_2024_(2).jpg
 *   "東莞國際貿易中心.jpg", David290, CC BY-SA 4.0, from the ENE (73 deg,
 *   1.2 km), 2019 under construction: the floor plates' swell;
 *   https://commons.wikimedia.org/wiki/File:%E6%9D%B1%E8%8E%9E%E5%9C%8B%E9%9A%9B%E8%B2%BF%E6%98%93%E4%B8%AD%E5%BF%83.jpg
 * - No lidar, NAIP or Mapillary here (batch notes).
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 422.6 m to the spike tips.
 * - Measured (photo, 2021 view scaled to 422.6 m): the base width (~56 m),
 *   the top of the glass (379 m), the crown screen (to ~411 m), the widths
 *   up the tower (0.82 at the top, between the 2021 and 2022 views), the mechanical bands.
 * - Measured (OSM): the bearing.
 * - Estimated: the crease curve (chamfer = 1.5 m + 12.4 (z / 379)^2.6),
 *   the fin spacing, the inner glass roof, the spike lean.
 * - Colours sampled from the 2021, 2022 and 2024 photos: glass #5b8ac0 /
 *   #6d83a5 / #386d94 -> #557ba3; creases and fins pale silver #d5dde3.
 *
 * Doubts
 * - The OSM outline is a plain 45 m square; the photos (and the published
 *   floor area) give a wider tower, about 56 m at the foot, which is drawn,
 *   so the model reaches ~5 m past the outline on each side.
 * - Only one side is seen up close; the tower is drawn with fourfold
 *   symmetry, as the distant views suggest.
 *
 * Night: the glass glows as windows; the crown fins are floodlit (the crown
 * is lit at night).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { K, type P2 } from './taipei-101'
import { gridSurface } from './shanghai-tower'
import { saveLods, type Layer } from './auckland-sky-tower'
import { chamferSquare } from './guangzhou-ctf-finance-centre'

const ID = 'dongguan-minying-itc-t2'
const BEARING = 10
const TOP = 422.6, GLASS = 379, CROWN = 411

const PROF: [number, number][] = [[0, 28.0], [50, 28.25], [110, 28.35], [180, 28.1], [245, 27.0], [300, 25.8], [345, 24.4], [GLASS, 23.0]]
function hAt(z: number) {
  for (let k = 0; k < PROF.length - 1; k++) if (z <= PROF[k + 1][0]) {
    const [z0, h0] = PROF[k], [z1, h1] = PROF[k + 1], t = (z - z0) / (z1 - z0)
    return h0 + (h1 - h0) * (t * t * (3 - 2 * t) * 0.5 + t * 0.5)
  }
  return PROF[PROF.length - 1][1]
}
const cAt = (z: number) => 1.5 + 12.4 * Math.pow(Math.min(z, GLASS) / GLASS, 2.6)
const ring = (z: number, out = 0) => K.offset(chamferSquare(hAt(z), cAt(z)), out)

type Set = { glass: Part; trim: Part; band: Part; fin: Part; roof: Part; top: Part }
const mk = (): Set => ({ glass: new Part(), trim: new Part(), band: new Part(), fin: new Part(), roof: new Part(), top: new Part() })

function build(detail: boolean): Layer[] {
  const s = mk()
  const nz = detail ? 56 : 30
  const zs = Array.from({ length: nz + 1 }, (_, k) => (GLASS * k) / nz)
  // ---- glass skin: smooth up the tower, sharp at the creases
  const g = zs.map((z) => ring(z).map((q) => [q[0], q[1], z] as V3))
  gridSurface(g, true, () => s.glass, () => true)

  // ---- crease trims along the eight edges, mullions on the faces (pale, 3D)
  const bar = (pts: (z: number) => { c: P2; n: P2; t: P2 }, w: number, d: number, z0: number, z1: number, n: number, part: Part) => {
    let prev: V3[] | null = null
    for (let k = 0; k <= n; k++) {
      const z = z0 + ((z1 - z0) * k) / n, { c, n: nn, t } = pts(z)
      const Q = (a: number, b: number): V3 => [c[0] + t[0] * a + nn[0] * b, c[1] + t[1] * a + nn[1] * b, z]
      let sec = [Q(-w / 2, -0.1), Q(w / 2, -0.1), Q(w / 2, d), Q(-w / 2, d)]
      if (K.area(sec.map((q) => [q[0], q[1]] as P2)) < 0) sec = sec.reverse()
      if (prev) K.loft(part, prev, sec)
      prev = sec
    }
    // top cap
    if (prev) part.quad(prev[0], prev[1], prev[2], prev[3])
  }
  const nseg = detail ? 36 : 16
  for (let i = 0; i < 8; i++) {
    // the vertex i: between a main face and a chamfer facet; normal = bisector
    bar((z) => {
      const r = ring(z), a = r[(i + 7) % 8], b = r[i], c = r[(i + 1) % 8]
      const e1 = norm([b[0] - a[0], b[1] - a[1]]), e2 = norm([c[0] - b[0], c[1] - b[1]])
      const n1: P2 = [e1[1], -e1[0]], n2: P2 = [e2[1], -e2[0]]
      const nn = norm([n1[0] + n2[0], n1[1] + n2[1]])
      return { c: b, n: nn, t: [-nn[1], nn[0]] }
    }, detail ? 0.9 : 1.4, detail ? 0.45 : 0.6, 0, GLASS, nseg, s.trim)
  }
  // mullions on each main face, at fixed fractions of its width (they converge as the face narrows)
  const fr = detail ? [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6] : [1 / 2]
  for (let f = 0; f < 4; f++) for (const u of fr) {
    bar((z) => {
      const r = ring(z), a = r[2 * f], b = r[2 * f + 1]
      const t = norm([b[0] - a[0], b[1] - a[1]])
      return { c: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], n: [t[1], -t[0]], t }
    }, detail ? 0.5 : 0.8, detail ? 0.3 : 0.4, 0, GLASS, nseg, s.trim)
  }
  // mechanical-floor bands (darker glass, just proud) and the lobby band
  for (const [z0, z1] of [[95, 100], [242, 248], [4.5, 6]] as [number, number][]) {
    const rr = (z: number) => ring(z, 0.25)
    K.loft(s.band, K.at(rr(z0), z0), K.at(rr(z1), z1))
    K.loft(s.band, K.at(rr(z1), z1), K.at(ring(z1), z1))
    K.loft(s.band, K.at(ring(z0), z0), K.at(rr(z0), z0))
  }

  // ---- crown: roof, inner glass pyramid, the fin screen, rings, spikes
  const top = ring(GLASS)
  K.loft(s.trim, K.at(ring(GLASS, 0.5), GLASS - 1.2), K.at(ring(GLASS, 0.5), GLASS + 0.6))
  K.loft(s.trim, K.at(ring(GLASS, 0.5), GLASS + 0.6), K.at(top, GLASS + 0.6))
  K.cap(s.roof, top, GLASS, true)
  const inner = K.scale(top, 0.62)
  K.prism(s.top, inner, GLASS, GLASS + 6, false)
  const apex: V3 = [0, 0, 401]
  for (let i = 0; i < 8; i++) {
    const a = inner[i], b = inner[(i + 1) % 8]
    s.top.tri([a[0], a[1], GLASS + 6], [b[0], b[1], GLASS + 6], apex)
  }
  // fins round the octagon, standing on its edge (glass-white, lit at night)
  const fins = detail ? 6 : 4
  for (let i = 0; i < 8; i++) {
    const a = top[i], b = top[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
    for (let j = 0; j <= fins; j++) {
      if (j === 0 && i % 2 === 1) continue // the corner fin belongs to the previous side
      const u = (L * j) / fins
      const c: P2 = [a[0] + t[0] * u - n[0] * 0.3, a[1] + t[1] * u - n[1] * 0.3]
      // a fin: thin, deep (radial), set on the edge
      const r: P2[] = [[c[0] - t[0] * 0.25 - n[0] * 1.6, c[1] - t[1] * 0.25 - n[1] * 1.6], [c[0] + t[0] * 0.25 - n[0] * 1.6, c[1] + t[1] * 0.25 - n[1] * 1.6], [c[0] + t[0] * 0.25 + n[0] * 0.4, c[1] + t[1] * 0.25 + n[1] * 0.4], [c[0] - t[0] * 0.25 + n[0] * 0.4, c[1] - t[1] * 0.25 + n[1] * 0.4]]
      K.prism(s.fin, K.ccw(r), GLASS + 0.6, CROWN, true)
    }
  }
  // horizontal rings of the screen (open frame): two thin bands and the top rim
  const rim = (z0: number, z1: number) => {
    const o = K.offset(top, 0.4), i = K.offset(top, -1.4)
    K.loft(s.fin, K.at(o, z0), K.at(o, z1))
    K.loft(s.fin, K.at(o, z1), K.at(i, z1))
    K.loft(s.fin, K.at([...i].reverse(), z0), K.at([...i].reverse(), z1))
    K.loft(s.fin, K.at(i, z0), K.at(o, z0))
  }
  rim(CROWN - 1.4, CROWN)
  if (detail) { rim(390, 390.8); rim(400, 400.8) } else rim(395, 396)
  // four spikes at the corners of the main faces' tops, leaning out
  for (let f = 0; f < 4; f++) {
    const v = top[(2 * f + 1) % 8], w = top[(2 * f + 2) % 8]
    const c: P2 = [(v[0] + w[0]) / 2, (v[1] + w[1]) / 2], l = Math.hypot(c[0], c[1])
    const o: P2 = [c[0] / l, c[1] / l]
    const base: V3 = [c[0] - o[0] * 3, c[1] - o[1] * 3, CROWN - 2], tip: V3 = [c[0] + o[0] * 2.5, c[1] + o[1] * 2.5, TOP]
    spike(s.trim, base, tip, detail ? 0.8 : 1.1, detail ? 8 : 5)
  }

  return [
    { part: s.glass, material: windowVariant(2, 0x557ba3) },
    { part: s.band, material: windowVariant(3, 0x4b6584) },
    { part: s.trim, material: finish('minying-silver', 0xd5dde3) },
    { part: s.fin, material: { ...finish("minying-crown", 0xb4c3d0), floodlight: () => 0.7 } },
    { part: s.roof, material: PALETTE.roof },
    { part: s.top, material: PALETTE.glass },
  ]
}

function norm(v: P2): P2 { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A tapering n-sided rod from a to b (radius r at a, r/3 at b), closed at the tip. */
function spike(p: Part, a: V3, b: V3, r: number, n: number) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(d[0], d[1], d[2])
  const w: V3 = [d[0] / L, d[1] / L, d[2] / L]
  let u: V3 = [w[1], -w[0], 0]
  const ul = Math.hypot(u[0], u[1]) || 1
  u = [u[0] / ul, u[1] / ul, 0]
  const v: V3 = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]]
  const ringAt = (c: V3, rr: number) => Array.from({ length: n }, (_, k) => {
    const t = (k / n) * Math.PI * 2
    return [c[0] + (u[0] * Math.cos(t) + v[0] * Math.sin(t)) * rr, c[1] + (u[1] * Math.cos(t) + v[1] * Math.sin(t)) * rr, c[2] + (u[2] * Math.cos(t) + v[2] * Math.sin(t)) * rr] as V3
  })
  const A = ringAt(a, r), B = ringAt(b, r / 3)
  // orient so the loft faces out: K.loft expects CCW about the axis seen from b
  const g = (() => { const e1 = [A[1][0] - A[0][0], A[1][1] - A[0][1], A[1][2] - A[0][2]], e2 = [A[2][0] - A[0][0], A[2][1] - A[0][1], A[2][2] - A[0][2]]; return (e1[1] * e2[2] - e1[2] * e2[1]) * w[0] + (e1[2] * e2[0] - e1[0] * e2[2]) * w[1] + (e1[0] * e2[1] - e1[1] * e2[0]) * w[2] })()
  const AA = g > 0 ? A : [...A].reverse(), BB = g > 0 ? B : [...B].reverse()
  K.loft(p, AA, BB)
  for (let k = 1; k < n - 1; k++) p.tri(BB[0], BB[k], BB[k + 1])
}

if (import.meta.main) {
  await saveLods(ID, 'Minying International Trade Center T2', build(false), build(true), {
    frame: 'Y up, -Z north, +X east, metres; origin at the centroid of way/1287829518, on the plaza',
    bearing: BEARING, height: TOP, anchor: [23.0141904, 113.7581353],
  }, 6500)
}
