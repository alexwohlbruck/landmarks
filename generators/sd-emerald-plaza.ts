/**
 * Emerald Plaza (Emerald-Shapery Center), San Diego — 400 West Broadway.
 *
 * C.W. Kim, 1990: a honeycomb of eight hexagonal towers on one podium, an
 * office cluster of five (north) and the Westin hotel's three (south).
 * Each tower is cream precast with ribbon windows, turning to all-glass
 * at the top where the cream corner piers end in stepped "crenellations";
 * each roof has a glass parapet ring and a small glass hexagonal pavilion,
 * and the rims are outlined in green neon at night — the emerald crowns.
 *
 * Frame: bearing 0. +x east, +y north, metres; origin at the anchor
 * (−117.16695, 32.71626), the podium outline's centroid; y = 0 the ground.
 *
 * Sources
 * - OSM: podium way/498796492 (building=commercial, 4 levels), hexagonal
 *   tower parts way/305926737, 305926738, 305926739, 305926740, 305926741,
 *   305926742, 305926743, 305927637, and the Westin outline way/608703250
 *   over the south three. © OSM contributors.
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 1 m grid; ground ≈
 *   1 m above the box's ground_min.
 * - USGS NAIP orthophoto.
 * Photos (evidence):
 * - "EmeraldPlazaSanDiegoApr09.jpg" and "EmeraldPlazaSDFeb2014.JPG",
 *   Nehrams2020, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:EmeraldPlazaSanDiegoApr09.jpg
 * - "EmeraldPlazaByPhilKonstantin.jpg", Phil Konstantin, CC BY-SA 3.0,
 *   https://commons.wikimedia.org/wiki/File:EmeraldPlazaByPhilKonstantin.jpg
 *   (from above: the hex rims, terraces and pavilions).
 * - "Westin Emerald Plaza San Diego west side 1–4.JPG", BrokenSphere,
 *   CC BY-SA 3.0 (podium and the hotel's base).
 * - "San Diego, 2016 - 255.jpg", Another Believer, CC BY-SA 4.0.
 * - "San Diego,California,USA. - panoramio (108)/(110).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0.
 * - "Downtown San Diego (1).jpg", "San Diego buildings high rise
 *   skyline.jpg", Jon Sullivan, public domain.
 *
 * Numbers
 * - Hexagons: regular, circumradius 11.65 m, pointy ends north and south,
 *   centres fitted to the OSM parts (measured).
 * - Rim heights (above ground), lidar: 737 116, 738 100, 739 97, 740 81,
 *   741 66, 742 71, 743 81, 637 61; pavilion tops 3–6 m higher (measured).
 *   OSM's heights (137/130/120/100/80…) are higher than the lidar; the
 *   building is from 1990, so the 2014 lidar is followed. The published
 *   137 m is not reached by any lidar return.
 * - Podium: 14.5 m (north), 10.5 m (south), the link block between the
 *   clusters 23 m and 31 m — lidar (measured).
 * - Glass tops ≈ 10% of each tower plus 6 m, with two 3.8 m steps at the
 *   corners — estimated from Nehrams2020 (2009).
 * - Window panels: two storeys (5.4 m) per panel on a 7.2 m pitch with a
 *   1.8 m cream spandrel; podium 4.6 m panels on 6.4 m — estimated.
 *
 * Doubts
 * - No licensed night photo was found; the green neon is drawn as a band
 *   on each rim, as described for the building.
 * - The Westin's two helipads are not drawn; its pavilions match the
 *   office towers'.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { qf, tf, cbox, rect } from './dc-white-house'
import { save, type XY } from './chi-aon-center'

const PRECAST = finish('emerald-precast', 0xebe5da)
const BAND = finish('window', 0x5b7894, 0.35)
const GLASS = windowVariant(2, 0x6385aa)
const NEON = finish('neon-emerald', 0x46b06c, 0.5)

const pre = new Part(), band = new Part(), glass = new Part(), neon = new Part(), roof = new Part(), terrace = new Part()
// The towers' roof terraces read tan from above (Konstantin's aerial).
const TERRACE = finish('emerald-terrace', 0xbfae94)

const R = 11.6 // circumradius (a hair under 11.65 so neighbours don't share faces)
type Hex = { c: XY; rim: number; top: number; base: number }
const HEX: Hex[] = [
  { c: [9.6, 27.9], rim: 116, top: 122, base: 14.5 }, // 737
  { c: [-10.6, 27.9], rim: 100, top: 103, base: 14.5 }, // 738
  { c: [19.7, 10.6], rim: 97, top: 100, base: 14.5 }, // 739
  { c: [-0.5, 10.6], rim: 81, top: 84.5, base: 14.5 }, // 740
  { c: [-20.0, 10.6], rim: 66, top: 68.5, base: 14.5 }, // 741
  { c: [19.8, -24.0], rim: 71, top: 73.5, base: 10.5 }, // 742
  { c: [-0.4, -24.0], rim: 81, top: 85, base: 10.5 }, // 743
  { c: [-20.2, -24.0], rim: 61, top: 64, base: 10.5 }, // 637
]

/** Hex corner k (0…5), pointy north: corner 0 at the top. */
const corner = (h: Hex, k: number, r = R): XY => {
  const a = Math.PI / 2 + (k * Math.PI) / 3
  return [h.c[0] + r * Math.cos(a), h.c[1] + r * Math.sin(a)]
}

function tower(h: Hex) {
  const H = h.rim
  const glassDepth = 0.1 * H + 6
  const ZG = H - glassDepth
  const STEP = 3.8
  for (let k = 0; k < 6; k++) {
    // Corners go clockwise from above as k rises (angle increases = CCW). Use k → k+1 CCW.
    const a = corner(h, k), b = corner(h, k + 1)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const n: XY = [t[1], -t[0]] // outward for a CCW ring
    const N3: V3 = [n[0], n[1], 0]
    const F = (s: number, z: number, d = 0): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
    // Wall: precast up to the glass, glass above.
    qf(pre, F(0, h.base), F(L, h.base), F(L, ZG), F(0, ZG), N3)
    qf(glass, F(0, ZG), F(L, ZG), F(L, H), F(0, H), N3)
    // Stepped crenellations: the glass reaches down the face's middle.
    const m = L / 2
    qf(glass, F(m - L * 0.36, ZG - STEP, 0.05), F(m + L * 0.36, ZG - STEP, 0.05), F(m + L * 0.36, ZG, 0.05), F(m - L * 0.36, ZG, 0.05), N3)
    qf(glass, F(m - L * 0.2, ZG - 2 * STEP, 0.05), F(m + L * 0.2, ZG - 2 * STEP, 0.05), F(m + L * 0.2, ZG - STEP, 0.05), F(m - L * 0.2, ZG - STEP, 0.05), N3)
    // Window panels two storeys tall (5.4 m of each 7.2 m pair), a 1.8 m
    // cream spandrel between, corner piers left solid.
    for (let z = h.base + 0.9; z + 5.4 < ZG - 2 * STEP - 0.4; z += 7.2) {
      const top = z + 5.4
      qf(band, F(0.9, z, 0.05), F(L - 0.9, z, 0.05), F(L - 0.9, top, 0.05), F(0.9, top, 0.05), N3)
    }
    // Bands beside the steps, between the piers and the glass notch.
    for (const [z0, z1, w] of [[ZG - 2 * STEP + 0.6, ZG - STEP - 0.6, 0.2], [ZG - STEP + 0.6, ZG - 0.6, 0.36]] as [number, number, number][]) {
      if (z1 - z0 < 1) continue
      qf(band, F(0.9, z0, 0.05), F(m - L * w - 0.5, z0, 0.05), F(m - L * w - 0.5, z1, 0.05), F(0.9, z1, 0.05), N3)
      qf(band, F(m + L * w + 0.5, z0, 0.05), F(L - 0.9, z0, 0.05), F(L - 0.9, z1, 0.05), F(m + L * w + 0.5, z1, 0.05), N3)
    }
    // Neon rim along the parapet's top edge.
    qf(neon, F(-0.05, H - 1.3, 0.08), F(L + 0.05, H - 1.3, 0.08), F(L + 0.05, H, 0.08), F(-0.05, H, 0.08), N3)
    // Parapet top and inner face; the roof terrace sits 2.4 m down.
    const ai = corner(h, k, R - 0.7), bi = corner(h, k + 1, R - 0.7)
    qf(glass, [a[0], a[1], H], [b[0], b[1], H], [bi[0], bi[1], H], [ai[0], ai[1], H], [0, 0, 1])
    qf(glass, [ai[0], ai[1], H], [bi[0], bi[1], H], [bi[0], bi[1], H - 2.4], [ai[0], ai[1], H - 2.4], [-n[0], -n[1], 0])
    tf(terrace, [h.c[0], h.c[1], H - 2.4], [ai[0], ai[1], H - 2.4], [bi[0], bi[1], H - 2.4], [0, 0, 1])
    // The pavilion: a smaller glass hexagon with a low green pyramid.
    const pr = R * 0.55, pz = h.top - 0.9
    const pa = corner(h, k, pr), pb = corner(h, k + 1, pr)
    qf(glass, [pa[0], pa[1], H - 2.4], [pb[0], pb[1], H - 2.4], [pb[0], pb[1], pz], [pa[0], pa[1], pz], N3)
    tf(glass, [pa[0], pa[1], pz], [pb[0], pb[1], pz], [h.c[0], h.c[1], h.top], [n[0], n[1], 1.5])
  }
}
HEX.forEach(tower)

// Podium (lidar heights), within the OSM outline x −29.5…29.9, y −39.3…39.7.
function block(x0: number, x1: number, y0: number, y1: number, z1: number) {
  cbox(pre, rect(x0, x1, y0, y1), 0, z1, { top: roof, b: 0.3 })
  for (const [side, at, a0, a1] of [['s', y0, x0, x1], ['n', y1, x0, x1], ['w', x0, y0, y1], ['e', x1, y0, y1]] as const) {
    if (a1 - a0 < 4) continue
    const n: V3 = side === 's' ? [0, -1, 0] : side === 'n' ? [0, 1, 0] : side === 'w' ? [-1, 0, 0] : [1, 0, 0]
    const P = (u: number, z: number): V3 => (side === 's' || side === 'n' ? [u, at + n[1] * 0.05, z] : [at + n[0] * 0.05, u, z])
    for (let z = 0.9; z + 4.6 < z1 - 0.6; z += 6.4) qf(band, P(a0 + 1, z), P(a1 - 1, z), P(a1 - 1, z + 4.6), P(a0 + 1, z + 4.6), n)
  }
}
block(-29.5, 29.9, 0, 39.7, 14.5)
block(-29.5, 29.9, -39.3, -12, 10.5)
block(-29.5, -21, -12, 0, 10.5)
block(21, 29.9, -12, 0, 10.5)
block(-21, -3, -12, 0, 23)
block(-3, 21, -12, 0, 31)

const parts = [
  { part: pre, material: { ...PRECAST, floodlight: (p: V3) => (p[2] > 40 ? 0.25 : 0) } },
  { part: band, material: BAND },
  { part: glass, material: GLASS },
  { part: neon, material: NEON },
  { part: roof, material: PALETTE.roof },
  { part: terrace, material: TERRACE },
]
await save('sd-emerald-plaza', 'Emerald Plaza', [-117.16695, 32.71626], 0, parts as any)
