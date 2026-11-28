/**
 * Tower 185, Frankfurt am Main: procedural, CC0-1.0.
 * bun generators/frankfurt-tower-185.ts   (writes the low and the detail model)
 *
 * Christoph Mäckler, 2008-2011: a 200 m office tower (55 storeys, PwC's
 * German headquarters) at the Friedrich-Ebert-Anlage, on a horseshoe-shaped
 * six-storey podium. The tower is two slab halves, each about 15 x 41 m,
 * splayed apart like an open book around a glazed round middle part; the
 * halves are clad in pale champagne stone and aluminium with close
 * vertical piers, the middle in blue glass. The podium wraps the tower on
 * three sides and opens to the north-north-east in a U-shaped forecourt
 * whose curved end stands in front of the tower's glass middle.
 *
 * Identity, in order: the two pale stone halves with the glass slot / drum
 * between them, the drum rising a little above the halves; the close
 * vertical piers of the halves; the long low pale podium with its curved
 * U-shaped forecourt; the dark top storeys of the drum.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of the tower outline OSM way/86762038 (50.110148, 8.655874).
 * y = 0 is the lowest ground under the footprint (the site is flat).
 *
 * Plan (from OSM): the tower outline way/86762038 simplified to 0.3 m; the
 * west half is the rectangle (-23.6,-16.7) (-8.6,-17.3) (-6.7,26.0)
 * (-21.7,26.6), the north-east half (-2.8,-19.0) (9.9,-27.0) (33.1,9.4)
 * (20.5,17.3); the rest of the outline is the glazed middle: a drum about
 * 15 m in radius bulging north into the forecourt, and a narrow curved slot
 * on the south side. The podium is the multipolygon relation/1462975
 * (outer way/86762026, two courtyards way/103145723 and way/103145724),
 * simplified to 0.4 m.
 *
 * Heights:
 * - 200 m including the plant storeys: published (de/en.wikipedia "Tower
 *   185"); OSM 200 m, 55 levels. The glazed middle runs to 200 m; the
 *   stone halves to 192 m, from a and e (the drum stands about 4 per cent
 *   above the halves), with their top two storeys (186-192) dark (a).
 * - podium: 30 m (OSM height, 6 levels plus a roof storey); a 2 m parapet
 *   band; the ground storey 0-7 m glazed (b, d).
 * - storeys 3.5 m (192 m over 55 levels); window bands grouped by three
 *   storeys on the tower (one in the detail model).
 * - piers: on the halves every 2.8 m (detail 1.4 m), 0.85 m wide and 0.5 m
 *   deep (a, c, e: close vertical piers); on the podium every 3.2 m (detail
 *   1.6 m), 0.9 m wide, with a window band a storey (3.3 m; b: a low
 *   building of seven storeys, one window per bay and storey).
 *
 * Evidence (Wikimedia Commons):
 * - a https://commons.wikimedia.org/wiki/File:Tower_185,_Frankfurt,_South_view_20170325_1.jpg
 *   DXR, CC BY-SA 4.0: a half and the drum's top with the logo.
 * - b https://commons.wikimedia.org/wiki/File:Tower_185.jpg
 *   Thomas Wolf (Der Wolf im Wald), CC BY-SA 3.0: from the forecourt, the
 *   U-shaped podium and the drum between the halves.
 * - c https://commons.wikimedia.org/wiki/File:Tower_185_Frankfurt_am_Main.jpg
 *   Choinowski, CC BY-SA 4.0: down a street, the dark top.
 * - d https://commons.wikimedia.org/wiki/File:Tower_185_-_Frankf%C3%BCrt.jpg
 *   Edison McCullen, CC BY-SA 4.0: the podium and the blue drum.
 * - e https://commons.wikimedia.org/wiki/File:Frankfurt_Tower_185.S%C3%BCden.20140508.jpg
 *   Epizentrum, CC BY-SA 3.0: from the south, the slot between the halves.
 * - g https://commons.wikimedia.org/wiki/File:Tower_185_(220937975).jpeg
 *   A Krebs60, CC BY 3.0: the forecourt.
 * - h https://commons.wikimedia.org/wiki/File:Tower-185-2010-ffm-059-t.jpg
 *   Dontworry, CC BY-SA 3.0: under construction with the podium.
 * - OSM (API, 2026-11): way/86762038, relation/1462975.
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours: the halves' stone and aluminium champagne #ddd1ba (a, e; pulled
 * light from about #c9b996); their windows a grey-green slate #5f6d74; the
 * glazed middle a light blue #6b93ab (b, d, e; pulled from #3d6f9a); the podium stone
 * a paler grey-beige #e6e0d4 (b, d); the roofs grey.
 *
 * Night: the halves' and podium's windows are `window`, the drum
 * `window-2` (offices behind it); the podium's glazed ground storey is
 * `entrance`.
 *
 * Detail model: piers at their real 1.4 m spacing on the halves, the
 * podium's piers doubled, window bands a storey each on the halves.
 *
 * Doubts: the podium's roof storey and the inside of its courtyards are not
 * seen (drawn plain); the colonnade on the forecourt's ground storey is
 * drawn as a glazed band without the free columns; the PwC logo near the
 * top of the drum is left out (not a famous sign).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, prism, capRing, capHoles, smoothWall, bevelTop, ccw, saveLods, type XY, type Layer } from './frankfurt-westhafen-tower'

const ID = 'frankfurt-tower-185'
const WEST: XY[] = [[-23.6, -16.7], [-8.6, -17.3], [-6.7, 26.0], [-21.7, 26.6]]
const EAST: XY[] = [[-2.8, -19.0], [9.9, -27.0], [33.1, 9.4], [20.5, 17.3]]
// the glazed middle: the south slot, up the east half's inner side, the
// north drum (west-going), down the west half's inner side
const DRUM_ARC: XY[] = [[13.5, 5.9], [12.1, 9.3], [10.0, 11.6], [6.5, 13.9], [4.0, 14.9], [1.3, 15.3], [-2.6, 15.0], [-5.0, 14.3], [-7.4, 12.4]]
const SLOT_ARC: XY[] = [[-8.4, -15.8], [-4.9, -16.2], [-2.3, -17.6]]
const MIDDLE: XY[] = [...SLOT_ARC, ...DRUM_ARC]
const PODIUM: XY[] = [[50.8, 23.3], [38.8, 27.4], [28.7, 12.0], [20.5, 17.3], [13.5, 5.9], [12.1, 9.3], [10.0, 11.6], [4.0, 14.9], [-2.6, 15.0], [-5.0, 14.3], [-7.6, 12.4], [-6.7, 26.0], [-14.1, 26.0], [-12.8, 54.1], [-18.8, 58.4], [-52.5, 9.8], [-50.1, 5.4], [-22.5, 4.5], [-23.0, -7.6], [-66.3, -6.9], [-73.3, 7.2], [-42.4, 51.6], [-42.8, 51.9], [-29.0, 71.9], [-28.6, 71.6], [-17.9, 87.1], [-18.4, 87.4], [-4.7, 107.2], [-4.3, 107.0], [4.1, 119.2], [23.7, 105.7], [26.1, 109.1], [32.3, 104.8], [-1.6, 55.6], [-3.1, 52.5], [-4.1, 47.1], [-3.4, 41.7], [-1.0, 36.9], [2.7, 33.1], [9.4, 30.2], [15.7, 30.2], [21.3, 32.3], [26.3, 36.9], [28.4, 40.9], [45.5, 95.8], [51.8, 91.5], [49.5, 88.1], [64.6, 76.9], [78.1, 68.6], [76.4, 61.2], [75.8, 61.4], [67.7, 35.6], [68.2, 35.5], [65.3, 25.8], [61.9, 26.9], [60.7, 23.0], [64.2, 22.0], [61.1, 12.5], [60.6, 12.6], [47.9, -29.3], [37.9, -32.9], [15.6, -17.5], [23.0, -6.2], [33.9, -13.8], [39.5, -11.6]]
const COURTS: XY[][] = [[[54.1, 33.7], [62.4, 60.3], [48.6, 70.1], [38.8, 38.4]], [[-14.3, 64.8], [-7.7, 60.2], [15.4, 92.8], [8.6, 97.5]]]
const TOP = 200, HALF_TOP = 192, DARK_TOP = 186, ST = HALF_TOP / 55
const POD = 30, POD_GROUND = 7

type Set = { stone: Part; win: Part; drum: Part; pod: Part; roof: Part; lobby: Part }
const mk = (): Set => ({ stone: new Part(), win: new Part(), drum: new Part(), pod: new Part(), roof: new Part(), lobby: new Part() })

/** Points every `bay` metres along a ring's edges, skipping those within `clear` of a corner, with each edge's outward normal. */
function along(r: XY[], bay: number, clear: number, skipEdge?: (a: XY, b: XY) => boolean) {
  const out: { p: XY; t: XY; n: XY }[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (skipEdge?.(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [t[1], -t[0]]
    const k = Math.max(1, Math.round(L / bay))
    for (let j = 0; j <= k; j++) {
      const s = (L * j) / k
      if (s < clear && j > 0) continue
      if (L - s < clear && j < k) continue
      if (j === k) continue // the next edge's start
      out.push({ p: [a[0] + t[0] * s, a[1] + t[1] * s], t, n })
    }
  }
  return out
}

/** A pier: a box w wide and d deep standing on the wall at p, z0..z1, front and sides only. */
function pier(part: Part, p: XY, t: XY, n: XY, w: number, d: number, z0: number, z1: number) {
  const q = (u: number, v: number): V3 => [p[0] + t[0] * u + n[0] * v, p[1] + t[1] * u + n[1] * v, 0]
  const at = (v: V3, z: number): V3 => [v[0], v[1], z]
  const A = q(-w / 2, 0), B = q(w / 2, 0), C = q(w / 2, d), D = q(-w / 2, d)
  const N3 = (x: XY): V3 => [x[0], x[1], 0]
  face(part, [at(D, z0), at(C, z0), at(C, z1), at(D, z1)], N3(n))
  face(part, [at(C, z0), at(B, z0), at(B, z1), at(C, z1)], N3(t))
  face(part, [at(A, z0), at(D, z0), at(D, z1), at(A, z1)], [-t[0], -t[1], 0])
  face(part, [at(D, z1), at(C, z1), at(B, z1), at(A, z1)], [0, 0, 1])
}

/** Window bands on every edge of ring r, rows of `per` storeys, `sill` short top and bottom. */
function bands(part: Part, r: XY[], z0: number, z1: number, rowH: number, sill: number, skipEdge?: (a: XY, b: XY) => boolean, endClear = 0.5) {
  const rows = Math.max(1, Math.round((z1 - z0) / rowH)), h = (z1 - z0) / rows
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (skipEdge?.(a, b)) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 2 * endClear + 0.5) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [t[1], -t[0], 0], o = 0.05
    const P = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * o, a[1] + t[1] * s + n[1] * o, z]
    for (let k = 0; k < rows; k++) {
      const za = z0 + k * h + sill, zb = z0 + (k + 1) * h - sill
      face(part, [P(endClear, za), P(L - endClear, za), P(L - endClear, zb), P(endClear, zb)], n)
    }
  }
}

const near = (p: XY, ring: XY[]) => ring.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.3)
/** Distance from p to the segment ab. */
const segDist = (p: XY, a: XY, b: XY) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2))
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}
/** Whether the edge ab lies along one of the tower's own walls. */
const towerEdges: [XY, XY][] = [WEST, EAST, MIDDLE].flatMap((r) => r.map((a, i) => [a, r[(i + 1) % r.length]] as [XY, XY]))
const onTower = (a: XY, b: XY) => {
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return towerEdges.some(([c, d]) => segDist(m, c, d) < 0.6 && segDist(a, c, d) < 1.2 && segDist(b, c, d) < 1.2)
}

function build(s: Set, detail: boolean) {
  // ── the glazed middle: drum and slot, to 200 m ──
  smoothWall(s.drum, DRUM_ARC, 0, TOP - 0.5)
  smoothWall(s.drum, SLOT_ARC, 0, TOP - 0.5)
  // above the halves, the middle shows on all sides
  prism(s.drum, MIDDLE, HALF_TOP - 1, TOP - 0.5, { top: null })
  bevelTop(s.drum, s.roof, MIDDLE, TOP, 0.5)

  // ── the two stone halves ──
  const pierBay = detail ? 1.4 : 2.8, rowH = (detail ? 1 : 3) * ST
  for (const half of [WEST, EAST]) {
    const r = ccw(half)
    // the inner long side faces the middle and, below 30 m, the podium: its
    // facade starts over the podium
    const isInner = (a: XY, b: XY) => near(a, [[-8.6, -17.3], [-6.7, 26.0], [-2.8, -19.0], [20.5, 17.3]]) && near(b, [[-8.6, -17.3], [-6.7, 26.0], [-2.8, -19.0], [20.5, 17.3]])
    const outer = (a: XY, b: XY) => isInner(a, b)
    const innerOnly = (a: XY, b: XY) => !isInner(a, b)
    prism(s.stone, r, 0, HALF_TOP - 0.5, { top: null })
    bevelTop(s.stone, s.roof, r, HALF_TOP, 0.5)
    bands(s.win, r, 0, DARK_TOP, rowH, 0.7, outer, 0.4)
    bands(s.win, r, POD, DARK_TOP, rowH, 0.7, innerOnly, 0.4)
    // the top two storeys: dark glass, full bays (a)
    bands(s.drum, r, DARK_TOP, HALF_TOP - 0.8, HALF_TOP - DARK_TOP, 0.4, undefined, 0.4)
    for (const { p, t, n } of along(r, pierBay, 0.2, outer)) pier(s.stone, p, t, n, 0.85, 0.5, 0, HALF_TOP - 0.5)
    for (const { p, t, n } of along(r, pierBay, 0.2, innerOnly)) pier(s.stone, p, t, n, 0.85, 0.5, POD, HALF_TOP - 0.5)
  }

  // ── the podium: 30 m, around the tower, with two courtyards ──
  {
    const r = ccw(PODIUM)
    prism(s.pod, r, 0, POD - 0.4, { top: null, skip: (i) => onTower(r[i], r[(i + 1) % r.length]) })
    for (const c of COURTS) prism(s.pod, c, POD_GROUND, POD, { inward: true })
    capHoles(s.roof, r, COURTS, POD)
    // parapet chamfer around the outer edge
    bands(s.lobby, r, 0, POD_GROUND, POD_GROUND, 0.4, onTower, 0.3)
    bands(s.win, r, POD_GROUND + 0.8, POD - 2.2, 3.3, 0.85, onTower, 0.3)
    for (const c of COURTS) bands(s.win, [...ccw(c)].reverse(), POD_GROUND + 1, POD - 2.2, 7.2, 0.8)
    for (const { p, t, n } of along(r, detail ? 1.6 : 3.2, 0.3, onTower)) pier(s.pod, p, t, n, 0.9, 0.45, 0, POD - 2)
  }
}

const mats = (s: Set): Layer[] => [
  { part: s.stone, material: finish('tower-185-stone', 0xddd1ba) },
  { part: s.win, material: { ...PALETTE.window, color: 0x5f6d74 } },
  { part: s.drum, material: windowVariant(2, 0x6b93ab) },
  { part: s.pod, material: finish('tower-185-podium', 0xe6e0d4) },
  { part: s.roof, material: PALETTE.roof },
  { part: s.lobby, material: { ...PALETTE.entrance, color: 0x6a7c86 } },
]

const low = mk(), det = mk()
build(low, false)
build(det, true)
await saveLods(ID, 'Tower 185', mats(low), mats(det), { anchor: [50.110148, 8.655874], bearing: 0, elevation: 0, height: TOP })
