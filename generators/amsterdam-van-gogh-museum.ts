/**
 * Van Gogh Museum, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-van-gogh-museum.ts
 *
 * Three parts: Gerrit Rietveld's building of 1973 on Paulus Potterstraat,
 * pale grey-beige brick blocks stepping up to 24 m, with a gridded glass
 * stair tower, a glazed ground floor under the cantilevered upper floors,
 * and low wings; Kisho Kurokawa's exhibition wing of 1999 on Museumplein,
 * a half-ellipse drum of grey granite under a thin, tilted titanium roof
 * that overhangs its wall; and Hans van Heeswijk's entrance hall of 2015,
 * a curved glass case filling the other half of the ellipse, its glass
 * leaning out. The underground link between them is not drawn.
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 66.3° (the Rietveld building's long walls and Museumplein):
 * +x (156.3°) faces Museumplein, −x Paulus Potterstraat. Anchor: the area
 * centroid of OSM relation/6577680 (its two outers: the Rietveld building
 * and the ellipse).
 *
 * Evidence
 * - OSM relation/6577680 (building, wikidata Q224124) and its parts:
 *   754324684 (main block, h18), 754324685 (raised block, h20), 754324682
 *   (south wing, h12), 754324683 (glass tower, h16), 754324679/680/681
 *   (low parts, h5–6); the ellipse way/441830027 split into 1230401241
 *   (glass hall, h8) and 1230401242 (the drum, metal roof, h10).
 * - 3D BAG (3dbag.nl, CC BY 4.0, 3D geoinformation group TU Delft /
 *   3DBAG), LoD2.2 from AHN lidar, panden NL.IMBAG.Pand.0363100012098679
 *   (Rietveld building) and 0363100012211564 (the ellipse), sampled on a
 *   2 m grid in this frame; street level NAP +0.5. Measured: main block
 *   21.1, raised block 24.0, south wing 13.1, glass tower 19.0–20.5, low
 *   parts 7.2; the drum's roof tilted, 14.9 at its west edge on the axis,
 *   13.0–13.5 at the far (east) rim, falling to 11 at the north tip; a
 *   strip at 11.4 along the hall's side of the drum.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Suicasmo, "Exterior of the Van Gogh Museum 20180702.jpg", CC BY-SA
 *     4.0 — the glass tower and Rietveld blocks.
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_the_Van_Gogh_Museum_20180702.jpg
 *   - C messier, "Van Gogh Museum 2537.jpg", CC BY-SA 4.0 — drum, hall and
 *     Rietveld from Museumplein. https://commons.wikimedia.org/wiki/File:Van_Gogh_Museum_2537.jpg
 *   - Alf van Beem, "Van Gogh Museum, Pedaalemmer foto 1/2/3.jpg", public
 *     domain — the drum from Museumplein, its roof rim.
 *     https://commons.wikimedia.org/wiki/File:Van_Gogh_Museum,_Pedaalemmer_foto_1.jpg
 *   - Sebastian Koppehel, "Van Gogh Museum, Kurokawa wing.jpg", CC BY 4.0 —
 *     the drum and the leaning glass of the hall.
 *     https://commons.wikimedia.org/wiki/File:Van_Gogh_Museum,_Kurokawa_wing.jpg
 *   - Alexander Migl, "Exterior of the Kurokawavleugel Van Gogh Museum IMG
 *     5159.jpg" and "Exterior of Rietveldgebouw Van Gogh Museum IMG
 *     5158.jpg", CC BY-SA 4.0.
 *     https://commons.wikimedia.org/wiki/File:Exterior_of_the_Kurokawavleugel_Van_Gogh_Museum_IMG_5159.jpg
 *   - Julien Chatelain, "Van Gogh Museum (42514015642).jpg" and
 *     "(41843540794).jpg", CC BY-SA 2.0 — the Rietveld building from
 *     Museumplein: glazed ground floor under the upper block.
 *     https://commons.wikimedia.org/wiki/File:Van_Gogh_Museum_(42514015642).jpg
 *   - Steven Lek, "Van Gogh Museum by night Amsterdam 2017.jpg", CC BY-SA
 *     4.0 — the night look: floodlit drum, glowing hall.
 *     https://commons.wikimedia.org/wiki/File:Van_Gogh_Museum_by_night_Amsterdam_2017.jpg
 *   - Calips, "Nederland Amsterdam 02.jpg", CC BY-SA 3.0 — across
 *     Museumplein. https://commons.wikimedia.org/wiki/File:Nederland_Amsterdam_02.jpg
 * - Published: Rietveld building opened 1973 (G. Rietveld, J. van Dillen,
 *   J. van Tricht); exhibition wing 1999 (K. Kurokawa); entrance hall 2015
 *   (Hans van Heeswijk) (nl/en.wikipedia "Van Gogh Museum").
 *
 * Estimated from the photos: the hall's glass leaning out 1.6 m over its
 * height, its glass 12.6 tall, its roof edge rising to 13.4 at the drum, steel ribs about every 3.5 m (photo from the SW); the drum's roof
 * overhang 1.2 m and rim thickness; the Rietveld ground floor recessed
 * 2 m under the upper floors; window bands and the tower's grid.
 *
 * Doubts: the lidar inside the glass hall reads 4–9 m (through the glass,
 * probably), so its roof follows the photos; the Paulus Potterstraat side
 * of the Rietveld building is drawn plainly from the outline; the black
 * name signs on the drum and the banners are left out.
 *
 * Night: the drum is floodlit from below; the hall and windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, insetRing, area, unit, type XY } from './nyc-570-lexington'
import { rectPanel } from './nyc-city-hall'

const brick = new Part(), granite = new Part(), roof = new Part(), win = new Part(), glass = new Part(), metal = new Part()
const trim = brick // pale copings and piers in the Rietveld grey

const cr = (a: V3, b: V3, c: V3): V3 => {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
}
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
const L = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
/** Edges of a counter-clockwise ring. */
const edges = (r: XY[]): [XY, XY][] => r.map((a, i) => [a, r[(i + 1) % r.length]])

/** Loft closed rings with normals smoothed across bends under 40°. */
function smoothLoft(p: Part, rings: V3[][]) {
  const n = rings[0].length, K = rings.length
  const fn: V3[][] = []
  for (let k = 0; k < K - 1; k++) fn.push(rings[k].map((_, i) => unit(cr(rings[k][i], rings[k][(i + 1) % n], rings[k + 1][(i + 1) % n]))))
  const cos = Math.cos((40 * Math.PI) / 180)
  const vn = (k: number, i: number, f0: V3): V3 => {
    let s: V3 = [0, 0, 0]
    for (const kk of [k - 1, k]) {
      if (kk < 0 || kk >= K - 1) continue
      for (const ii of [(i - 1 + n) % n, i]) {
        const f = fn[kk][ii]
        if (f[0] * f0[0] + f[1] * f0[1] + f[2] * f0[2] < cos) continue
        s = [s[0] + f[0], s[1] + f[1], s[2] + f[2]]
      }
    }
    return unit(s)
  }
  for (let k = 0; k < K - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, f0 = fn[k][i]
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    const na = vn(k, i, f0), nb = vn(k, j, f0), nc = vn(k + 1, j, f0), nd = vn(k + 1, i, f0)
    p.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    p.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}
/** A fan cap over a star-shaped ring with per-vertex heights, facing up (or down). */
function fanCap(p: Part, ring: V3[], up = true) {
  const c: V3 = [0, 0, 0]
  for (const q of ring) { c[0] += q[0] / ring.length; c[1] += q[1] / ring.length; c[2] += q[2] / ring.length }
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (up) p.tri(c, a, b); else p.tri(c, b, a)
  }
}

// ================================================================ Rietveld building (1973)
// OSM parts in this frame; heights from the 3D BAG.
const A: XY[] = [[-36.3, -10.3], [-36.2, 17.7], [-4.5, 17.6], [-4.7, -0.5], [-14.6, -0.2], [-14.6, -5.2], [-19.5, -5.2], [-19.5, -10.3]]
const B: XY[] = [[-19.5, -10.3], [-19.5, -5.2], [-14.6, -5.2], [-14.6, -0.2], [1.2, -0.7], [1.0, -10.8]]
const C: XY[] = [[-47.7, -24.4], [-47.7, -3.9], [-36.2, -3.9], [-36.3, -10.3], [-10.6, -10.6], [-10.8, -24.4]]
const D: XY[] = [[-10.8, -19.8], [-10.6, -10.6], [6.9, -10.5], [6.9, -19.8]]
const E1: XY[] = [[-41.5, 6.0], [-41.4, 23.5], [-31.0, 23.6], [-5.9, 29.0], [-6.1, 17.6], [-36.2, 17.7], [-36.2, 6.0]]
const E2: XY[] = [[-49.4, -5.7], [-49.4, 8.3], [-41.5, 8.3], [-41.5, -3.9], [-47.7, -3.9], [-47.8, -5.7]]
const F: XY[] = [[1.0, -10.6], [1.2, -0.7], [-4.7, -0.5], [-4.5, 17.6], [-6.1, 17.6], [-6.0, 26.1], [1.0, 26.1], [0.6, 29.6], [10.2, -14.2], [8.8, -10.5]]

const GF = 4.2 // ground floor height (glazed, under the upper floors)
/** A block: walls to `top`, coping and flat roof. */
function block(ring: XY[], z0: number, top: number, wall = brick) {
  prism({ wall, win: null, roof, coping: trim, ring: ccw(ring), z0, z1: top, facade: null, bevel: 0.35 })
}
/** The upper floors on a recessed glazed ground floor; the soffit faces down. */
function cantilevered(ring: XY[], top: number, recess = 2.0) {
  const r = ccw(ring)
  block(r, GF, top)
  capPoly(trim, r, GF, false)
  const g = insetRing(r, recess)
  prism({ wall: win, win: null, roof: null, ring: g, z0: 0, z1: GF, facade: null, bevel: 0.1 })
  // White piers along the glass.
  for (const [a, b] of edges(g)) {
    const len = L(a, b), n = Math.max(1, Math.round(len / 5.5))
    for (let k = 0; k <= n; k++) {
      const s = (len * k) / n, ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len
      const x = a[0] + ux * s + uy * 0.1, y = a[1] + uy * s - ux * 0.1
      prism({ wall: brick, win: null, roof: null, ring: [[x - 0.25, y - 0.25], [x + 0.25, y - 0.25], [x + 0.25, y + 0.25], [x - 0.25, y + 0.25]], z0: 0, z1: GF, facade: null, bevel: 0.05 })
    }
  }
}
cantilevered(A, 21.1)
cantilevered(B, 24.0)
block(C, 0, 13.1)
block(E1, 0, 7.2)
block(E2, 0, 7.3)
block(F, 0, 7.2)
// The glass stair tower: a window wall with pale floor and mullion lines.
{
  const r = ccw(D)
  prism({ wall: win, win: null, roof, coping: trim, ring: r, z0: 0, z1: 19.6, facade: null, bevel: 0.2 })
  for (const [a, b] of edges(r)) {
    const len = L(a, b)
    for (const z of [6.4, 12.8]) rectPanel(metal, a, b, len / 2, len - 0.2, z - 0.25, z + 0.25, 0.06)
    const n = Math.round(len / 3.6)
    for (let k = 1; k < n; k++) rectPanel(metal, a, b, (len * k) / n, 0.35, 0, 19.2, 0.06)
  }
}
// Window bands: a ground-floor band on the south wing and the low parts,
// and a band on the south wing's upper floor.
for (const [ring, z0, z1] of [[C, 0.8, 3.8], [E1, 0.8, 3.8], [E2, 0.8, 3.8], [F, 0.8, 4.4], [C, 8.6, 10.6]] as [XY[], number, number][]) {
  for (const [a, b] of edges(ccw(ring))) {
    const len = L(a, b)
    if (len < 4) continue
    const n = Math.max(1, Math.round(len / 4.5)), pitch = (len - 1.2) / n
    for (let k = 0; k < n; k++) rectPanel(win, a, b, 0.6 + pitch * (k + 0.5), pitch * 0.82, z0, z1)
  }
}
// ================================================================ The ellipse
// Its outline (OSM way/441830027): centre and semi-axes fitted to the
// ring; the straight split between hall and drum at x = 30.1.
const EC: XY = [32.7, -0.3], EA = 18.6, EB = 27.6 // semi-axes along x and y
const SPLIT = 30.1
const ell = (t: number, grow = 0): XY => [EC[0] + (EA + grow) * Math.cos(t), EC[1] + (EB + grow) * Math.sin(t)]
// Parameter where the ellipse crosses the split line.
const tS = Math.acos((SPLIT - EC[0]) / EA) // upper crossing; −tS the lower

// ---- The drum (Kurokawa wing): granite wall, tilted titanium roof.
const roofZ = (x: number, y: number) => 14.2 - 0.08 * (x - SPLIT) - 0.035 * y
{
  const N = 28
  const arc: XY[] = Array.from({ length: N + 1 }, (_, i) => ell(-tS + (2 * tS * i) / N))
  // Counter-clockwise: from the lower split crossing round the east, then down the split.
  const wall: XY[] = [...arc]
  const base: V3[] = wall.map(([x, y]) => [x, y, 0])
  const topZ = (x: number, y: number) => roofZ(x, y) - 0.75
  const top: V3[] = wall.map(([x, y]) => [x, y, topZ(x, y)])
  const mid: V3[] = wall.map(([x, y]) => [x, y, topZ(x, y) * 0.5])
  // Smooth curved wall (open ring: close it along the split with a flat face).
  const rings = [base, mid, top].map((r) => [...r])
  // The loft treats rings as closed; the closing segment is the split face (flat, stone).
  smoothLoft(granite, rings)
  // The roof: a thin titanium plate, 1.6 m proud of the wall on the curve,
  // with a dark metal edge band and a shadowed soffit.
  const rimArc: XY[] = Array.from({ length: N + 1 }, (_, i) => ell(-tS - 0.05 + ((2 * tS + 0.1) * i) / N, 1.6))
  const rim: XY[] = [...rimArc, [SPLIT - 0.4, rimArc[N][1]], [SPLIT - 0.4, rimArc[0][1]]]
  const r0: V3[] = rim.map(([x, y]) => [x, y, roofZ(x, y) - 0.8])
  const r1: V3[] = rim.map(([x, y]) => [x, y, roofZ(x, y)])
  smoothLoft(metal, [r0, r1])
  fanCap(roof, r1, true)
  fanCap(metal, r0, false)
}

// ---- The entrance hall (2015): a big glass case on the NW half of the
// ellipse (OSM 1230401241), its glass leaning out, nearly as tall as the
// drum (photo from the SW), framed by steel ribs and a top edge beam.
{
  const N = 22
  const t0 = tS, t1 = 2 * Math.PI - tS
  const tAt = (i: number) => t0 + ((t1 - t0) * i) / N
  const outer: XY[] = Array.from({ length: N + 1 }, (_, i) => ell(tAt(i)))
  const foot: XY[] = Array.from({ length: N + 1 }, (_, i) => ell(tAt(i), -1.8))
  const zEdge = 12.6, zDrum = 13.4
  const edgeZ = (x: number) => zEdge + ((x - (EC[0] - EA)) / (SPLIT - (EC[0] - EA))) * (zDrum - zEdge)
  const b: V3[] = foot.map(([x, y]) => [x, y, 0] as V3)
  const t: V3[] = outer.map(([x, y]) => [x, y, edgeZ(x)] as V3)
  // Glass panes.
  for (let i = 0; i < N; i++) glass.quad(b[i], b[i + 1], t[i + 1], t[i])
  // Outward horizontal normal at each joint.
  const nrm = (i: number): XY => { const [x, y] = outer[i]; const v = unit([(x - EC[0]) / (EA * EA), (y - EC[1]) / (EB * EB), 0]); return [v[0], v[1]] }
  /** A box rib from p to q (both on the glass), w wide along the wall, d deep outward. */
  const rib = (p: V3, q: V3, n: XY, w: number, d: number) => {
    const tg: XY = [-n[1], n[0]]
    const c = (o: V3, u: number, v: number): V3 => [o[0] + tg[0] * u + n[0] * v, o[1] + tg[1] * u + n[1] * v, o[2]]
    const P = [c(p, -w / 2, 0), c(p, w / 2, 0), c(p, w / 2, d), c(p, -w / 2, d)]
    const Q = [c(q, -w / 2, 0), c(q, w / 2, 0), c(q, w / 2, d), c(q, -w / 2, d)]
    metal.loft([[P[3], P[2], P[1], P[0]], [Q[3], Q[2], Q[1], Q[0]]])
  }
  for (let i = 0; i <= N; i++) rib(b[i], t[i], nrm(i), 0.35, 0.35)
  // Top edge beam and a transom, as real members.
  for (let i = 0; i < N; i++) {
    const n0 = nrm(i), n1 = nrm(i + 1)
    for (const [zt, h, d, f] of [[0, 0.8, 0.5, 1], [6.4, 0.3, 0.25, 0.5]] as [number, number, number, number][]) {
      const lift = (k: number) => (zt === 0 ? 0 : zt / ((t[k][2] + 1e-6)))
      const at = (k: number, dz: number, dd: number, nn: XY): V3 => {
        const s = zt === 0 ? 1 : lift(k)
        const x = b[k][0] + (t[k][0] - b[k][0]) * s, y = b[k][1] + (t[k][1] - b[k][1]) * s, z = zt === 0 ? t[k][2] : zt
        return [x + nn[0] * dd, y + nn[1] * dd, z + dz]
      }
      void f
      const A = at(i, -h, 0, n0), B = at(i + 1, -h, 0, n1), C = at(i + 1, 0, 0, n1), D = at(i, 0, 0, n0)
      const A2 = at(i, -h, d, n0), B2 = at(i + 1, -h, d, n1), C2 = at(i + 1, 0, d, n1), D2 = at(i, 0, d, n0)
      metal.quad(A2, B2, C2, D2) // outer face
      metal.quad(D2, C2, C, D) // top
      metal.quad(A, B, B2, A2) // bottom
    }
  }
  // Roof: solid, from the edge beam up to the drum.
  const roofRing: V3[] = [...t, [SPLIT, outer[N][1], zDrum], [SPLIT, outer[0][1], zDrum]]
  fanCap(roof, roofRing, true)
  fanCap(metal, roofRing.map(([x, y, z]) => [x, y, z - 0.6] as V3), false)
  // Seen through the glass: a mezzanine on columns and a stair up to it.
  const mez: XY[] = Array.from({ length: N + 1 }, (_, i) => ell(tAt(i), -8.0)).filter(([x]) => x < SPLIT - 0.5)
  const mr: XY[] = ccw([...mez, [SPLIT - 0.5, mez[mez.length - 1][1]], [SPLIT - 0.5, mez[0][1]]])
  prism({ wall: brick, win: null, roof: brick, ring: mr, z0: 5.2, z1: 5.9, facade: null, bevel: 0.1 })
  capPoly(brick, mr, 5.2, false)
  for (const [x, y] of [[20, -6], [20, 8], [24, -14], [24, 16]] as XY[]) prism({ wall: metal, win: null, roof: null, ring: [[x - 0.3, y - 0.3], [x + 0.3, y - 0.3], [x + 0.3, y + 0.3], [x - 0.3, y + 0.3]], z0: 0, z1: 5.2, facade: null, bevel: 0.05 })
  const s0: V3[] = [[16.6, -2, 0], [16.6, 1.6, 0], [22.6, 1.6, 5.2], [22.6, -2, 5.2]]
  brick.quad(s0[0], s0[3], s0[2], s0[1]); brick.quad(s0[0], s0[1], s0[2], s0[3])
}

// ---------------------------------------------------------------- write
const flood = (p: V3, n: V3) => (Math.abs(n[2]) < 0.5 ? Math.max(0, 0.75 - p[2] * 0.035) : 0)
finishModel('Van Gogh Museum', 'amsterdam-van-gogh-museum', [
  { part: brick, material: finish('vangogh-grey', 0xbfc1c2) },
  { part: granite, material: { ...finish('vangogh-granite', 0x9d9fa2), floodlight: flood } },
  { part: roof, material: { ...PALETTE.roof, color: 0xa7acb1 } },
  { part: win, material: PALETTE.window },
  { part: glass, material: { name: 'glass', color: 0x7fc4de, roughness: 0.2, opacity: 0.32, doubleSided: true } },
  { part: metal, material: finish('vangogh-steel', 0x5e656c) },
], { bearing: 66.3, osm: 'relation/6577680', height: 24.0 }, 6500)
