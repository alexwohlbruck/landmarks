/**
 * America Plaza trolley station canopy, San Diego (MTS Blue/Green lines).
 *
 * Helmut Jahn, 1991, built with One America Plaza: a sweeping steel shelter
 * over the curve where the trolley turns from Kettner Boulevard onto
 * C Street. In plan it is a quarter-ring about 12–15 m wide; in section a
 * curved metal roof, highest along the outer (track) edge and rolling down
 * onto the tower's podium on the inner side, crossed by dark ribs.
 * Tall paired white steel columns carry the outer edge, tied by two
 * perforated ring beams. Its own model, so the tower (sd-one-america-plaza)
 * and the canopy can be placed and reviewed apart; both frames share
 * bearing 0 and their geometry meets without overlap.
 *
 * Frame: bearing 0, +x east, +y north, metres; origin at the anchor
 * (−117.16878, 32.71652), the OSM canopy's centroid; y = 0 the ground. The
 * geometry is laid out in One America Plaza's frame (anchor −117.16870,
 * 32.71614) and shifted by (−7.49, +42.02) m, so the two models line up.
 *
 * Sources
 * - OSM way/1078598878 (building:part=roof, shelter_type=public_transport,
 *   layer 1), inside One America Plaza's outline way/451287796. Its inner
 *   edge is shared with the podium part way/1078598879, which the tower
 *   model draws. © OSM contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 1 m grid: roof at
 *   17.3 m along the outer edge for ~8 m, falling to ~15.5 m and then
 *   onto the 12.3 m podium (measured; ground ≈ 2.0 m above ground_min).
 * - USGS NAIP orthophoto: the light roof panels and dark ribs.
 * Photos (evidence):
 * - "America Plaza MTS Station (14892278613).jpg" and "(14878684806)",
 *   Prayitno, CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:America_Plaza_MTS_Station_(14892278613).jpg
 * - "America Plaza station west side 1.JPG", BrokenSphere, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:America_Plaza_station_west_side_1.JPG
 * - "America Plaza Station.jpg", Allan Ferguson, CC BY 2.0.
 * - "America Plaza Trolley Station aqw.jpg", Luciof, CC BY-SA 3.0.
 * - "Core-Columbia, San Diego … panoramio (8/9/10).jpg", Roman Eugeniusz,
 *   CC BY-SA 3.0.
 * - "America Plaza station night 2019.jpg", Antony-22, CC BY-SA 4.0 (night:
 *   the soffit is washed in coloured light).
 *
 * Numbers
 * - Plan: OSM's outer and inner edges (measured).
 * - Roof heights: lidar (measured). The roof's last metres run down to
 *   13.2 m over the podium edge, so it meets the tower model's 12.3 m
 *   podium roof without a gap.
 * - Section: a vault rising from 15.2 m at the outer ring to a 17.45 m
 *   crown about a fifth of the way in, then down to 13.2 m at the podium —
 *   the crown and fall from lidar, the outer roll-down from Prayitno's photo.
 * - Roof top pale (#D9DCDC) between dark ribs, as on the NAIP aerial.
 * - Ring beams at 4.6–6.2 m and 9.8–11.4 m, column pairs every ~11 m —
 *   estimated from Prayitno's photo.
 *
 * Doubts
 * - The night lighting is coloured (magenta in 2019); it is drawn as a
 *   white floodlight on the soffit.
 * - The perforations in the ring beams are left out (too fine).
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { qf } from './dc-white-house'
import { save, type XY } from './chi-aon-center'

const STEEL = finish('aps-steel', 0xdfe2e4)
const ROOF = finish('aps-roof', 0xd9dcdc)
const SOFFIT = finish('aps-soffit', 0x5f666d)

const steel = new Part(), roof = new Part(), soffit = new Part()

// One America Plaza's frame → this model's frame.
const DX = -7.49, DY = 42.02
const S = (p: XY): XY => [p[0] + DX, p[1] - DY]

const OUTER: XY[] = [[-36.4, 1.8], [-27.5, 23.8], [-12.0, 59.3], [-9.0, 63.0], [-5.8, 66.4], [-1.8, 69.3], [1.8, 71.2], [4.3, 72.8], [8.0, 74.2], [12.2, 75.5], [17.5, 76.2], [24.7, 76.3]]
const INNER: XY[] = [[-21.5, 1.8], [-13.3, 16.2], [-9.1, 22.2], [1.8, 48.9], [4.8, 53.2], [8.3, 56.3], [12.2, 58.7], [16.4, 60.2], [21.2, 60.8], [24.9, 60.7]]

/** Resample a polyline to n points evenly by length. */
function resample(pl: XY[], n: number): XY[] {
  const seg = pl.slice(1).map((p, i) => Math.hypot(p[0] - pl[i][0], p[1] - pl[i][1]))
  const L = seg.reduce((a, b) => a + b, 0)
  const out: XY[] = []
  for (let k = 0; k < n; k++) {
    let d = (L * k) / (n - 1), i = 0
    while (i < seg.length - 1 && d > seg[i]) d -= seg[i++]
    const t = Math.min(1, d / seg[i])
    out.push([pl[i][0] + (pl[i + 1][0] - pl[i][0]) * t, pl[i][1] + (pl[i + 1][1] - pl[i][1]) * t])
  }
  return out
}

const N = 28
const out = resample(OUTER, N).map(S), inn = resample(INNER, N).map(S)

// Section: t = 0 at the outer edge, 1 at the inner edge.
const SEC: [number, number][] = [[-0.03, 14.6], [-0.03, 15.2], [0.03, 16.4], [0.1, 17.1], [0.2, 17.45], [0.34, 17.4], [0.5, 16.9], [0.66, 16.0], [0.8, 15.0], [0.92, 14.0], [1.0, 13.2]]
const at = (k: number, t: number, dz = 0): V3 => {
  const o = out[k], i = inn[k]
  return [o[0] + (i[0] - o[0]) * t, o[1] + (i[1] - o[1]) * t, 0 + dz]
}
const P = (k: number, j: number, dz = 0): V3 => { const p = at(k, SEC[j][0]); return [p[0], p[1], SEC[j][1] + dz] }

const THICK = 0.9
for (let k = 0; k < N - 1; k++) {
  // NAIP: pale panels between dark ribs; the ribs are the dark skylight
  // frames and share the soffit's grey.
  // A rib every second bay (~5 m), about NAIP's spacing.
  const SK = k % 2 === 1 ? 0.62 : 1
  const Pm = (j: number): V3 => { const a = P(k, j), b = P(k + 1, j); return [a[0] + (b[0] - a[0]) * SK, a[1] + (b[1] - a[1]) * SK, a[2] + (b[2] - a[2]) * SK] }
  const up = (j: number): V3 => { const a = P(k, j), b = P(k, j + 1); return [-(b[2] - a[2]) * 0, 0, 1] }
  for (let j = 1; j < SEC.length - 1; j++) {
    qf(roof, P(k, j), Pm(j), Pm(j + 1), P(k, j + 1), up(j))
    if (SK < 1) qf(soffit, Pm(j), P(k + 1, j), P(k + 1, j + 1), Pm(j + 1), up(j))
    qf(soffit, P(k, j, -THICK), P(k + 1, j, -THICK), P(k + 1, j + 1, -THICK), P(k, j + 1, -THICK), [0, 0, -1])
  }
  // Outer fascia: the roof's rolled edge.
  const o0 = P(k, 0), o1 = P(k + 1, 0)
  const n: V3 = [o0[1] - o1[1], o1[0] - o0[0], 0]
  // n points to the left of the run outer→, which is outward for this ring (its inside is to the right).
  const nd = [n, [-n[0], -n[1], 0] as V3].find((v) => {
    const i = inn[k]; return v[0] * (o0[0] - i[0]) + v[1] * (o0[1] - i[1]) > 0
  })!
  qf(steel, [o0[0], o0[1], 15.2 - THICK - 0.3], [o1[0], o1[1], 15.2 - THICK - 0.3], [o1[0], o1[1], 15.2], [o0[0], o0[1], 15.2], nd)
  // Ring beams along the outer edge, set 0.6 m in.
  for (const [z0, z1] of [[4.6, 6.2], [9.8, 11.4]]) {
    const a = at(k, 0.05), b = at(k + 1, 0.05)
    qf(steel, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], nd)
    qf(steel, [a[0], a[1], z1], [b[0], b[1], z1], [b[0] - nd[0] * 0.12, b[1] - nd[1] * 0.12, z1], [a[0] - nd[0] * 0.12, a[1] - nd[1] * 0.12, z1], [0, 0, 1])
    qf(steel, [a[0], a[1], z0], [b[0], b[1], z0], [b[0] - nd[0] * 0.12, b[1] - nd[1] * 0.12, z0], [a[0] - nd[0] * 0.12, a[1] - nd[1] * 0.12, z0], [0, 0, -1])
    // Back face, seen from under the canopy.
    qf(steel, [a[0] - nd[0] * 0.12, a[1] - nd[1] * 0.12, z0], [b[0] - nd[0] * 0.12, b[1] - nd[1] * 0.12, z0], [b[0] - nd[0] * 0.12, b[1] - nd[1] * 0.12, z1], [a[0] - nd[0] * 0.12, a[1] - nd[1] * 0.12, z1], [-nd[0], -nd[1], 0])
  }
}
// End walls of the roof (the section seen at each end).
for (const k of [0, N - 1]) {
  const dir = k === 0 ? -1 : 1
  const a = out[k], b = out[k === 0 ? 1 : N - 2]
  const e: V3 = [(a[0] - b[0]) * dir * -1, (a[1] - b[1]) * dir * -1, 0]
  const nE: V3 = k === 0 ? [a[0] - b[0], a[1] - b[1], 0] : [a[0] - b[0], a[1] - b[1], 0]
  void e
  for (let j = 1; j < SEC.length - 1; j++) qf(steel, P(k, j), P(k, j + 1), P(k, j + 1, -THICK), P(k, j, -THICK), nE)
}

/** A square steel post from p at z0 to z1. */
function post(p: XY, z0: number, z1: number, h = 0.22) {
  const r = (x0: number, y0: number): V3[] => [[x0 - h, y0 - h, 0], [x0 + h, y0 - h, 0], [x0 + h, y0 + h, 0], [x0 - h, y0 + h, 0]]
  const b = r(p[0], p[1]).map((v) => [v[0], v[1], z0] as V3), t = r(p[0], p[1]).map((v) => [v[0], v[1], z1] as V3)
  steel.loft([b, t])
}
// Column pairs along the outer edge, and lighter posts along the inner line.
for (let k = 0; k < N; k += 3) {
  const a = at(k, 0.04), b = at(Math.min(N - 1, k + 1), 0.04)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  for (const s of [-0.45, 0.45]) post([a[0] + u[0] * s, a[1] + u[1] * s], 0, 15.6 - THICK)
  const c = at(k, 0.62)
  post([c[0], c[1]], 0, 16.6 - THICK, 0.2)
}

const parts = [
  { part: steel, material: STEEL },
  { part: roof, material: ROOF },
  { part: soffit, material: { ...SOFFIT, floodlight: () => 0.7 } },
]
await save('sd-america-plaza-station', 'America Plaza station', [-117.16878, 32.71652], 0, parts as any)
