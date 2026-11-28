/**
 * Suzhou International Finance Square (Suzhou IFS, 苏州国际金融中心), Jinji Lake,
 * Suzhou Industrial Park — original procedural geometry, CC0-1.0.
 * bun generators/suzhou-ifs.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0. Origin = area centroid of the OSM outline way/477238586
 * (120.7126653 E, 31.3241953 N), on the ground. Elevation 0.
 *
 * Form, as read from OSM and the photos (KPF, 2019):
 * - a square plan about 60 m a side, turned ~17 deg, with two opposite corners
 *   (north-west and south-east) rounded and the other two (north-east and
 *   south-west) sharp, each sharp corner carrying a silver fin the full height;
 * - the shaft tapers a little toward the top;
 * - the crown: the top is sliced by a curved, scooped surface that rises
 *   along the SW-NE diagonal, lowest at the sharp south-west corner (~90 m
 *   below the top) and highest at the north-east corner (450 m), dipping
 *   into a valley along the diagonal; so from the lake (west) the top reads as
 *   a level rim with a deep V between, and from the south as a blade rising to
 *   the right. The scoop is clad in pale louvres, edged by a silver rim and a
 *   rib down the valley;
 * - silver-grey glass with faint darker bands at the refuge floors (flush, colour only).
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: outline way/477238586
 *   (苏州国际金融中心, height 450, 95 levels, wikidata Q617082 on the way;
 *   English Wikipedia's coordinates were not used). The curved low building
 *   way/494186756 to the west is a separate building, left to the map.
 * - Published: 450 m, 95 floors, KPF, completed 2019 (Wikipedia "Suzhou IFS";
 *   CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons):
 *   "Suzhou IFS 2018.jpg", Milkomède, CC BY-SA 4.0, across the lake from the
 *   west: the shaft, the taper, the crown's V (depths scaled from 450 m);
 *   https://commons.wikimedia.org/wiki/File:Suzhou_IFS_2018.jpg
 *   "Suzhou IFS 27-10-2018.jpg", Milkomède, CC BY-SA 4.0, the same side: check;
 *   https://commons.wikimedia.org/wiki/File:Suzhou_IFS_27-10-2018.jpg
 *   "Suzhou ferris wheel and other buildings-20241004 (Suzhou IFS).jpg",
 *   Shwangtianyuan, CC BY 4.0, from the south: the blade-like crown profile,
 *   the louvred scoop, the colours;
 *   https://commons.wikimedia.org/wiki/File:Suzhou_ferris_wheel_and_other_buildings-20241004_(Suzhou_IFS).jpg
 *   "Suzhou IFS-20180829.jpg", Shwangtianyuan, CC BY-SA 4.0, from the
 *   south-west at street level: the V and its central rib;
 *   https://commons.wikimedia.org/wiki/File:Suzhou_IFS-20180829.jpg
 *   "Skylines of Jinji Lake.jpg", 钉钉, CC BY-SA 4.0: the silhouette in the skyline;
 *   https://commons.wikimedia.org/wiki/File:Skylines_of_Jinji_Lake.jpg
 * - Under-construction photos (2016-2017) were not used for the form.
 *   No lidar, NAIP or Mapillary. Look-only references: none.
 *
 * Numbers
 * - Published: 450 m.
 * - Measured (OSM): the plan.
 * - Measured (photo, scaled from 450 m): the crown's drop, ~90 m at the
 *   south-west corner and ~35 m at the rims of the rounded corners; the taper
 *   (~6% narrower at the top).
 * - Estimated: the shape of the scoop between those points, fin size (2.4 m
 *   proud, 1.2 m thick), band heights, colours sampled from the photos
 *   (glass #759aac-#829eaa sunlit, #757b88 in shade; louvres paler), pulled to
 *   the palette.
 *
 * Doubts
 * - The scoop's exact surface is a smooth guess fitted to the two photo
 *   profiles; the east and north sides have no close photo.
 * - The rotation sense of the crown (low at the SW corner) rests on the lake
 *   views and the one view from the south.
 *
 * Night: the glass glows as windows (`window`, the bands `window-2`); the
 * silver fins and crown rim are floodlit.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { saveLods, bar, face, type Layer, type XY } from './auckland-sky-tower'
import { grid } from './shenzhen-ping-an-finance-centre'
import { smoothAt } from './nanjing-zifeng-tower'

const H = 450
// OSM outline way/477238586, counter-clockwise, metres about its centroid
const OUT: XY[] = [[21.9, -15.3], [31.2, 14.3], [2.2, 28.0], [-5.2, 28.8], [-12.5, 27.7], [-19.4, 24.9], [-25.4, 20.5], [-30.1, 14.8], [-33.2, 8.2], [-36.2, -4.2], [-40.1, -21.4], [-9.4, -30.7], [-1.9, -30.9], [5.3, -29.4], [12.0, -26.1], [17.6, -21.3]]
const NE = 1, SW = 10 // the sharp corners
const A0 = OUT[SW], A1 = OUT[NE]
const L = Math.hypot(A1[0] - A0[0], A1[1] - A0[1])
const SU: XY = [(A1[0] - A0[0]) / L, (A1[1] - A0[1]) / L], TU: XY = [-SU[1], SU[0]]
const st = (p: XY) => [(p[0] - A0[0]) * SU[0] + (p[1] - A0[1]) * SU[1], (p[0] - A0[0]) * TU[0] + (p[1] - A0[1]) * TU[1]]
const T = Math.max(...OUT.map((p) => Math.abs(st(p)[1])))
const DMAX = 105, RIM = 0.33
/** The crown's cut surface over the plan. */
const zCut = (p: XY) => {
  const [s, t] = st(p)
  const D = DMAX * Math.pow(Math.max(0, 1 - s / L), 1.45)
  return H - D * (RIM + (1 - RIM) * (1 - Math.min(1, (t / T) ** 2)))
}
const taper = (z: number) => 1 - 0.06 * Math.pow(z / H, 1.3)
const tp = (p: XY, z: number): V3 => [p[0] * taper(z), p[1] * taper(z), z]

/** Resample the outline to about n points by arc length, keeping every original corner. */
function resample(poly: XY[], step: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const m = Math.max(1, Math.round(l / step))
    for (let k = 0; k < m; k++) out.push([a[0] + ((b[0] - a[0]) * k) / m, a[1] + ((b[1] - a[1]) * k) / m])
  }
  return out
}

type Set = { glass: Part; band: Part; louvre: Part; fin: Part; roof: Part }
const mk = (): Set => ({ glass: new Part(), band: new Part(), louvre: new Part(), fin: new Part(), roof: new Part() })

const BANDS = [72, 140, 208, 276, 336]
const BAND_H = 3.6, TOPROWS0 = 336 + BAND_H

function build(s: Set, d: boolean) {
  const ring = resample(OUT, d ? 3 : 5.5)
  const n = ring.length
  const sharp = (i: number) => ring[i] === OUT[NE] || ring[i] === OUT[SW] || (ring[i][0] === OUT[NE][0] && ring[i][1] === OUT[NE][1]) || (ring[i][0] === OUT[SW][0] && ring[i][1] === OUT[SW][1])
  const smooth = (i: number) => !sharp(i % n) && smoothAt(ring, 40)(i)
  const zc = ring.map(zCut)

  // ---- the shaft: straight rows to the last band; the bands flush, darker glass
  const rows: { z: number; inset: number; mat: Part }[] = []
  rows.push({ z: 0, inset: 0, mat: s.glass })
  for (const b of BANDS) {
    rows.push({ z: b, inset: 0, mat: s.band }, { z: b + BAND_H, inset: 0, mat: s.glass })
  }
  const at = (p: XY, zz: number, inset: number): V3 => {
    const q = tp(p, zz), r = Math.hypot(q[0], q[1]) || 1
    return [q[0] - (q[0] / r) * inset, q[1] - (q[1] / r) * inset, zz]
  }
  // rows with a material per row: glass between bands, band rows dark
  const g: V3[][] = []
  const mats: Part[] = []
  for (let k = 0; k < rows.length; k++) {
    g.push(ring.map((p) => at(p, rows[k].z, rows[k].inset)))
    mats.push(rows[k].mat)
  }
  // then up to the cut, per vertex
  const J = d ? 16 : 8
  for (let j = 1; j <= J; j++) {
    g.push(ring.map((p, i) => at(p, TOPROWS0 + ((zc[i] - TOPROWS0) * j) / J, 0)))
    mats.push(s.glass)
  }
  // a row takes the material of its bottom edge
  grid(g, true, (_i, k) => (rows[k] && rows[k].mat === s.band ? s.band : s.glass), smooth)

  // ---- the scoop: rings drawn in toward the centre, at the cut height, pale louvres
  const K = d ? 16 : 7
  const scoop: V3[][] = []
  const RIMW = 0.9
  for (let k = 0; k <= K; k++) {
    const f = k === 0 ? 1 : (1 - RIMW / 30) * (1 - (0.96 * (k - 1)) / K) // the first ring inside the rim
    scoop.push(ring.map((p) => { const q: XY = [p[0] * f, p[1] * f]; return tp(q, zCut(q)) }))
  }
  // the rim: a silver lip standing 1.2 m above the cut, 0.9 m thick
  const lip: V3[][] = [
    ring.map((p, i) => tp(p, zc[i])),
    ring.map((p, i) => tp(p, zc[i] + 1.4)),
    ring.map((p, i) => { const q: XY = [p[0] * (1 - RIMW / 30), p[1] * (1 - RIMW / 30)]; return tp(q, zc[i] + 1.4) }),
    ring.map((p) => { const q: XY = [p[0] * (1 - RIMW / 30), p[1] * (1 - RIMW / 30)]; return tp(q, zCut(q)) }),
  ]
  grid(lip, true, () => s.fin, smooth)
  grid(scoop.slice(1), true, () => s.louvre, () => true)
  face(s.louvre, scoop[K], [0, 0, 1])

  // the rib down the valley, from the south-west corner to the north-east
  {
    const m = d ? 30 : 12
    const path: V3[] = []
    for (let k = 0; k <= m; k++) {
      const u = 0.02 + (0.96 * k) / m
      const p: XY = [A0[0] + (A1[0] - A0[0]) * u, A0[1] + (A1[1] - A0[1]) * u]
      path.push(tp(p, zCut(p) + 0.5))
    }
    for (let k = 0; k < m; k++) bar(s.fin, path[k], path[k + 1], d ? 1.0 : 1.6, 1.4, [0, 0, 1])
  }

  // louvre slats across the scoop (detail): contour lines every 5 m
  if (d) {
    for (let h = H - DMAX + 4; h < H - 4; h += 5) {
      const pts: V3[] = []
      for (let k = 0; k <= 16; k++) {
        const t = -T + (2 * T * k) / 16
        // solve zCut(s, t) = h for s by bisection
        let lo = 0, hi = L
        const P = (s2: number): XY => [A0[0] + SU[0] * s2 + TU[0] * t, A0[1] + SU[1] * s2 + TU[1] * t]
        if (zCut(P(lo)) > h || zCut(P(hi)) < h) continue
        for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; if (zCut(P(m)) < h) lo = m; else hi = m }
        const q = P(lo)
        if (!inside(q, 0.94)) continue
        pts.push(tp(q, h + 0.35))
      }
      for (let k = 0; k < pts.length - 1; k++) bar(s.fin, pts[k], pts[k + 1], 0.35, 0.7, [0, 0, 1])
    }
  }

  // ---- the corner fins at the two sharp corners, full height
  for (const ci of [NE, SW]) {
    const c = OUT[ci], a = OUT[(ci - 1 + OUT.length) % OUT.length], b = OUT[(ci + 1) % OUT.length]
    const e0: XY = [c[0] - a[0], c[1] - a[1]], e1: XY = [c[0] - b[0], c[1] - b[1]]
    const l0 = Math.hypot(...e0), l1 = Math.hypot(...e1)
    const bis: XY = [e0[0] / l0 + e1[0] / l1, e0[1] / l0 + e1[1] / l1]
    const bl = Math.hypot(...bis), u: XY = [bis[0] / bl, bis[1] / bl], w: XY = [-u[1], u[0]]
    const top = zCut(c) + 1.4
    const levels = d ? [0, 60, 120, 180, 240, 300, top] : [0, 150, 300, top]
    const sec = (zz: number): V3[] => {
      const p = tp(c, zz), out = 1.7
      return [[p[0] - u[0] * 1 - w[0] * 0.6, p[1] - u[1] * 1 - w[1] * 0.6, zz], [p[0] + u[0] * out - w[0] * 0.6, p[1] + u[1] * out - w[1] * 0.6, zz],
        [p[0] + u[0] * out + w[0] * 0.6, p[1] + u[1] * out + w[1] * 0.6, zz], [p[0] - u[0] * 1 + w[0] * 0.6, p[1] - u[1] * 1 + w[1] * 0.6, zz]]
    }
    const gg = levels.map(sec)
    grid(gg, true, () => s.fin)
    face(s.fin, gg[gg.length - 1], [0, 0, 1])
  }
}

/** Whether a point lies inside the outline shrunk by factor f about the centroid. */
function inside(p: XY, f: number) {
  const q: XY = [p[0] / f, p[1] / f]
  let c = false
  for (let i = 0, j = OUT.length - 1; i < OUT.length; j = i++) {
    const a = OUT[i], b = OUT[j]
    if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < ((b[0] - a[0]) * (q[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

// ---- Materials and output ----------------------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x7d93a5 }
const BAND: MaterialSpec = windowVariant(2, 0x70879a)
const LOUVRE: MaterialSpec = finish('ifs-louvre', 0xaeb8c1, 0.6)
const FIN: MaterialSpec = { ...finish('ifs-silver', 0xc3cbd3, 0.5), floodlight: (p) => (p[2] > 300 ? 0.9 : 0.4) }
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.band, material: BAND },
  { part: s.louvre, material: LOUVRE },
  { part: s.fin, material: FIN },
  { part: s.roof, material: PALETTE.roof },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('suzhou-ifs', 'Suzhou IFS', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM outline centroid, on the ground',
    bearing: 0, height: H,
  }, 5000)
}
