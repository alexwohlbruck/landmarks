/**
 * KK100 (Kingkey 100), Luohu, Shenzhen — original procedural geometry, CC0-1.0.
 * bun generators/shenzhen-kk100.ts   (writes the low model and the detail LOD)
 *
 * Frame: bearing 0 (the long faces look north and south). Origin = area
 * centroid of the OSM tower part way/781166572 (114.101581 E, 22.545734 N),
 * on the ground; the tower axis is at the origin. Elevation 0.
 *
 * Form, as read from OSM and the photos:
 * - plan: a long rounded slab, 59 m east-west by 43 m north-south: flat end
 *   faces east and west (about 85% of the depth) and broad, gently bowed
 *   north and south faces meeting them at sharp edges;
 * - the "fountain" profile: the broad faces stand almost vertical, then from
 *   about 320 m they curve over toward each other, so from the east or west
 *   the tower is a tall pointed arch (the glazed end face is that arch) and
 *   from the north or south its top is nearly flat, a low arc that rounds
 *   down at the corners; the roof ridge (441.8 m) runs east-west;
 * - the faces: dark blue-teal glass behind dense silver vertical mullions,
 *   drawn as grouped silver fins; dark refuge bands at ~87, 167, 248, 327 and
 *   399 m;
 * - the south foot: the curved glass skirt (OSM roof part way/781166573,
 *   44 m) flaring out from the south face to an arc 9 m out, with its fins;
 * - the top: the crown garden under the glazed top of the arch (the end faces
 *   above the last band in pale glass), a narrow roof with its parapet.
 *
 * Evidence
 * - OSM, fetched 2026-11-27 with tools/osm.py: tower part way/781166572
 *   (441.8 m, 100 levels, gambrel), the skirt roof part way/781166573
 *   (24-44 m) and the outline way/164033632 (京基100, Q1470046).
 * - Published: 441.8 m, 100 floors, TFP Farrells and Arup, completed 2011
 *   (Wikipedia "KK100"; CTBUH Skyscraper Center).
 * - Photos (Wikimedia Commons, daylight):
 *   "KK100 exterior southeast.jpg", Charlie fong, CC BY-SA 4.0, drone from the
 *   SE (148 deg, 380 m): whole profile, bands, south skirt, colour;
 *   https://commons.wikimedia.org/wiki/File:KK100_exterior_southeast.jpg
 *   "Skyline KK101&Shun Hing Square2021.jpg", Charlie fong, CC BY-SA 4.0, from
 *   the SW (220 deg, 980 m): plan proportions (end : broad face 1 : 1.66),
 *   bands, top; https://commons.wikimedia.org/wiki/File:Skyline_KK101%26Shun_Hing_Square2021.jpg
 *   "KINGKEY 100 (67).jpg", Dinkun Chen, CC BY-SA 4.0, from the WNW (289 deg,
 *   1.1 km): the pointed-arch end face; https://commons.wikimedia.org/wiki/File:KINGKEY_100_(67).jpg
 *   "KINGKEY 100 (33).jpg" and "(64).jpg", Dinkun Chen, CC BY-SA 4.0, from the
 *   south (195/201 deg): the flat arched top of the broad face;
 *   https://commons.wikimedia.org/wiki/File:KINGKEY_100_(33).jpg
 *   https://commons.wikimedia.org/wiki/File:KINGKEY_100_(64).jpg
 *   "KINGKEY 100 (30).jpg", Dinkun Chen, CC BY-SA 4.0, from the NE (51 deg):
 *   both faces and the top; https://commons.wikimedia.org/wiki/File:KINGKEY_100_(30).jpg
 *   "京基100 - panoramio.jpg", ken93110, CC BY-SA 3.0, from the SE: the skirt
 *   flare; https://commons.wikimedia.org/wiki/File:%E4%BA%AC%E5%9F%BA100_-_panoramio.jpg
 * - No lidar, NAIP or Mapillary used. Look-only references: none.
 *
 * Numbers
 * - Published: 441.8 m top.
 * - Measured (OSM): 59 m east-west; the skirt's arc (9.4 m out at the middle)
 *   and 44 m top.
 * - Measured (photo): the end : broad face ratio (1 : 1.66, from the SW and WNW
 *   photos); the depth (~40-43 m, from the drone and SW photos' widths scaled
 *   to the height; OSM's rectangle says 47 m, drawn 43 m); the arch: the
 *   depth falls to 96% at 117 m below the top, 68% at 54 m, 42% at 18 m,
 *   20% at 4 m (WNW photo); the band heights (SW and drone photos).
 * - Estimated: the bow of the broad faces (3 m), the top's corner rounding,
 *   the fin count and size, colours sampled from the drone, SW and south
 *   photos (glass #546f82-#8da1b8, bands #505d60), pulled to the palette.
 *
 * Doubts
 * - OSM's tower part is a plain rectangle (47 m deep); the plan here follows
 *   the photos. Its exact curvature is not measured.
 * - The north foot and the podium (KK Mall, a separate OSM building) are not
 *   modelled.
 * - The two roof cranes (BMU "dragons") are left out.
 *
 * Night: the glass glows as windows (`window`, `window-2` for the bands); the
 * end faces' glazed top glows too (the sky lobby); the skirt is `glass`.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { face, saveLods, type Layer, type XY } from './auckland-sky-tower'
import { grid, rib, flat, pwl, nrm3 } from './shenzhen-ping-an-finance-centre'

const H = 441.8
const A = 29.5, B = 21.5, EF = 0.85 // half-length, half-depth, end-face share of the depth
const BANDS = [87, 167, 248, 327, 399]
const BAND_H = 5

/** Depth factor at z (the pointed arch seen from the ends). */
const depthF = (z: number) => {
  const t = H - z
  return pwl([[0, 0.08], [1.5, 0.14], [4, 0.21], [10, 0.32], [18, 0.43], [33, 0.56], [54, 0.69], [80, 0.82], [117, 0.95], [150, 0.995], [200, 1]], t) * (z < 40 ? 0.985 + 0.015 * (z / 40) : 1)
}
/** Length factor at z (the top's corners round down, seen from the long sides). */
const lenF = (z: number) => pwl([[0, 0.9], [2, 0.95], [6, 0.98], [12, 1]], H - z)

/** The plan ring at z, counter-clockwise from the SE corner; `nArc` points on each bowed face. */
function ring(z: number, nArc: number, out = 0): V3[] {
  const a = A * lenF(z) + out, b = B * depthF(z) + out, e = b * EF
  const pts: V3[] = []
  // east end face: SE corner -> NE corner
  pts.push([a, -e, z], [a, e, z])
  // north face: from NE to NW, bowed out to b at the middle
  for (let i = 1; i < nArc; i++) {
    const x = a - (2 * a * i) / nArc
    pts.push([x, e + (b - e) * (1 - (x / a) ** 2), z])
  }
  // west end face
  pts.push([-a, e, z], [-a, -e, z])
  // south face: NW... SW -> SE
  for (let i = 1; i < nArc; i++) {
    const x = -a + (2 * a * i) / nArc
    pts.push([x, -(e + (b - e) * (1 - (x / a) ** 2)), z])
  }
  return pts
}

type Set = { glass: Part; band: Part; fin: Part; top: Part; roof: Part; skirt: Part }
const mk = (): Set => ({ glass: new Part(), band: new Part(), fin: new Part(), top: new Part(), roof: new Part(), skirt: new Part() })

function build(s: Set, d: boolean) {
  const nArc = d ? 16 : 8
  const lv = new Set<number>([0, 20, 40])
  for (const b of BANDS) { lv.add(b - BAND_H / 2); lv.add(b + BAND_H / 2) }
  const step = d ? 6 : 14
  for (let z = 60; z < H - 150; z += d ? 40 : 80) lv.add(z)
  for (let t = 150; t > 0; t -= t > 40 ? step * 2 : step) lv.add(H - t)
  for (const t of [4, 2, 0.8, 0]) lv.add(H - t)
  const levels = [...lv].filter((z) => z >= 0 && z <= H).sort((a, b) => a - b)
  const inBand = (z0: number, z1: number) => BANDS.some((b) => z0 >= b - BAND_H / 2 - 0.01 && z1 <= b + BAND_H / 2 + 0.01)
  const N = 2 + (nArc - 1) + 2 + (nArc - 1)
  // column index -> which side: 0 = east end, 1..nArc = north face, nArc+1 = west end, then south face
  const isEnd = (i: number) => i === 0 || i === nArc + 1
  const crease = (vi: number) => vi === 0 || vi === 1 || vi === nArc + 1 || vi === nArc + 2

  const rings = levels.map((z) => ring(z, nArc))
  grid(rings, true, (i, k) => {
    const z0 = levels[k], z1 = levels[k + 1]
    if (inBand(z0, z1)) return s.band
    if (isEnd(i) && z0 >= BANDS[BANDS.length - 1]) return s.top
    return s.glass
  }, (vi) => !crease(vi))
  // the roof: the narrow top, flat, with a low parapet rim
  const top = ring(H, nArc)
  flat(s.roof, top.map((q) => [q[0], q[1]] as XY), H)

  // ---- the silver edges between the end faces and the broad faces: bold ribs up the arch
  const edgeCols = [0, 1, nArc + 1, nArc + 2]
  const edgeLv = levels.filter((z, k) => k % (d ? 1 : 2) === 0 || z > H - 60)
  if (edgeLv[edgeLv.length - 1] !== levels[levels.length - 1]) edgeLv.push(levels[levels.length - 1])
  for (const c of edgeCols) {
    const path = edgeLv.map((z) => ring(z, nArc)[c])
    const out = path.map((q) => nrm3([q[0] / A, q[1] / B, 0]))
    rib(s.fin, path, out, d ? 1.2 : 1.6, d ? 0.7 : 0.9, 0.15, true)
  }

  // ---- vertical mullion fins on the broad faces (grouped), following the curve over the top
  const NF = d ? 15 : 7
  for (const side of [1, -1]) for (let j = 1; j <= NF; j++) {
    const u = -1 + (2 * j) / (NF + 1) // -1..1 along the face
    const finLv = levels.filter((z, k) => k % (d ? 1 : 2) === 0 || z > H - 40)
    if (finLv[finLv.length - 1] !== H) finLv.push(H)
    const path = finLv.map((z) => {
      const a = A * lenF(z), b = B * depthF(z), e = b * EF
      const x = u * a * 0.97
      return [x, side * (e + (b - e) * (1 - (x / a) ** 2)), z] as V3
    })
    const out = finLv.map((z, k) => {
      // outward normal of the surface at the fin: from the plan bow and the arch's lean
      const zA = finLv[Math.max(0, k - 1)], zB = finLv[Math.min(finLv.length - 1, k + 1)]
      const dy = Math.abs(path[Math.min(finLv.length - 1, k + 1)][1]) - Math.abs(path[Math.max(0, k - 1)][1])
      const slope = dy / Math.max(0.1, zB - zA)
      const a = A * lenF(z), b = B * depthF(z), e = b * EF
      const dydx = -2 * (b - e) * (path[k][0] / (a * a))
      return nrm3([-dydx, side, 0 * slope])
    })
    rib(s.fin, path, out, d ? 0.5 : 0.8, (k) => (finLv[k] > H - 3 ? 0.2 : d ? 0.55 : 0.75), 0.15, false)
  }

  // ---- the south skirt: a flared glass foot from the south face out to an arc 9.4 m out, up to 44 m
  const SK = 44, OUT = 9.4
  const skLv = d ? [0, 4, 9, 15, 22, 30, 37, 44] : [0, 8, 18, 30, 44]
  const nS = d ? 16 : 8
  const skRows = skLv.map((z) => {
    const f = (1 - z / SK) ** 2
    const row: V3[] = []
    for (let i = 0; i <= nS; i++) {
      const x = A * 0.97 * (1 - (2 * i) / nS) * -1 // west to east
      const a = A * lenF(z), b = B * depthF(z), e = b * EF
      const y0 = -(e + (b - e) * (1 - (x / a) ** 2))
      const reach = OUT * (1 - (x / (A * 0.97)) ** 2)
      row.push([x, y0 - reach * f - 0.05, z])
    }
    return row
  })
  // columns run west -> east on the south side: counter-clockwise seen from the south
  grid(skRows, false, () => s.skirt, () => true)
  // its end walls are where it meets the corners (reach 0 there), so nothing to close
  // fins on the skirt (they continue the face's mullions down)
  for (let j = 1; j <= (d ? 11 : 5); j++) {
    const i = Math.round((j * nS) / ((d ? 11 : 5) + 1))
    const path = skRows.map((r) => r[i])
    const out = path.map(() => [0, -1, 0] as V3)
    rib(s.fin, path, out, d ? 0.4 : 0.7, 0.5, 0.1, false)
  }
}

// ---- Materials and output ----------------------------------------------------------------------------------

const GLASS: MaterialSpec = { ...PALETTE.window, color: 0x6f889b }
const BAND: MaterialSpec = windowVariant(2, 0x56636e)
const TOPG: MaterialSpec = windowVariant(3, 0x87a0b2)
const FIN: MaterialSpec = finish('kk-silver', 0xc3cbd2, 0.5)
const ROOF: MaterialSpec = PALETTE.roof
const SKIRT: MaterialSpec = { ...PALETTE.glass, color: 0xa9bfcf }
const layers = (s: Set): Layer[] => [
  { part: s.glass, material: GLASS },
  { part: s.band, material: BAND },
  { part: s.top, material: TOPG },
  { part: s.fin, material: FIN },
  { part: s.roof, material: ROOF },
  { part: s.skirt, material: SKIRT },
]

if (import.meta.main) {
  const low = mk(), det = mk()
  build(low, false)
  build(det, true)
  await saveLods('shenzhen-kk100', 'KK100', layers(low), layers(det), {
    frame: 'Y up, -Z north, +X east, metres; origin at the OSM tower part centroid, on the ground',
    bearing: 0, height: H,
  }, 5000)
}
