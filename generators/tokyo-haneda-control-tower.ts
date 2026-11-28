/**
 * Tokyo International Airport (Haneda) air traffic control tower, the 2010
 * tower — procedural, CC0-1.0, no textures.
 * bun generators/tokyo-haneda-control-tower.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing −30°, the grid of the airport's terminals and of the tower's base
 * building (OSM way/263025010's walls). Anchor: area centroid of that base
 * outline.
 *
 * Identifying features (photos): a tall, plain, pale grey shaft, slimmer
 * seen from the west than from the south (its plan is an elongated round,
 * long across the base building); at the top a stack of white discs, the
 * widest a ring of glass between two broad white bands, carried on tapering
 * fins that grow out of the shaft; above it a narrower drum and the glazed
 * cab, its glass leaning out, under a thin flared roof disc with a short
 * mast; a low white base building round the foot.
 *
 * Evidence
 * - OSM: way/263025010 (the base building, 23.0 × 38.4 m in this frame,
 *   no height) and way/319515856 (the shaft, a 13.4 m round, height 140,
 *   which is not the published height and is taken to include the masts).
 * - Published: in service from 12 January 2010; 115.7 m, the tallest control
 *   tower in Japan; reinforced concrete on base isolation (MLIT,
 *   https://www.mlit.go.jp/koku/haneda/archive/column/control.html and the
 *   press release https://www.mlit.go.jp/report/press/cab13_hh_000034.html).
 * - Photos:
 *   https://commons.wikimedia.org/wiki/File:Haneda-Airport-Terminal3---2025-06-15_034.jpg
 *     (RuinDig/Yuki Uchida, CC BY 4.0) telephoto from the Terminal 3
 *     deck, from the west-south-west: the whole stack, nearly orthographic;
 *     the cab's heights and widths are scaled from it;
 *   https://commons.wikimedia.org/wiki/File:Control_Tower_of_Haneda_Airport_%E7%BE%BD%E7%94%B0%E7%A9%BA%E6%B8%AF%E7%AE%A1%E5%88%B6%E5%A1%94_-_panoramio.jpg
 *     (AMANO Jun-ichi, CC BY 3.0) the whole tower and its base building;
 *   https://www.flickr.com/photos/36516818@N00/4281953012 (mrhayata,
 *     CC BY-SA 2.0) from the south, from Terminal 1's roof;
 *   https://www.flickr.com/photos/72396314@N00/4173626403 (OiMax, CC BY 2.0)
 *     the cab close up: bands, glass, fins;
 *   https://www.flickr.com/photos/45431488@N07/4981326365 (Atsushi Kase,
 *     CC BY-SA 2.0) the shaft from its foot;
 *   https://commons.wikimedia.org/wiki/File:Haneda_Airport_control_tower_(16262012210).jpg
 *     (Takayuki Suzuki, CC BY-SA 2.0) the cab in low sun;
 *   https://commons.wikimedia.org/wiki/File:Haneda_International_Airport,_Tokyo;_August_2009_(01).jpg
 *     (MIKI Yoshihito, CC BY 2.0) from the south-east, with the old tower.
 *
 * Measured from the photos (scale: the 2025 telephoto, 0.24 m a pixel, set by
 * the published height): the cab roof at 112 m and the mast to 115.7 m; the
 * widest ring 24 m across; the cab glass 14.6–16.8 m. The shaft's plan is the
 * main doubt: the ring is 2.15 shaft widths across from the west, but 1.3–1.5
 * from the south and from the road, so the shaft is drawn as a rounded oval
 * 17.5 m (model x) by 11 m (model y). OSM's 13.4 m round sits between the two.
 * Estimated: the base building's height (two storeys, 9.5 m, from the
 * panoramio photo and Kase's); the fins' depth; the dark soffit band.
 * Look-only: none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, capPoly, finishModel, facade, quadN, unit, type Facade } from './nyc-570-lexington'

const shaft = new Part(), white = new Part(), win = new Part(), dark = new Part(), roof = new Part()

const CX = 0.8, CY = 1.2 // the shaft's centre (OSM way/319515856)
const N = 32

/** A rounded oval (superellipse, exponent 2.6) of half-axes a, b round the shaft's centre. */
const oval = (a: number, b: number, n = N): XY[] => Array.from({ length: n }, (_, i) => {
  const t = (i / n) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t), e = 2 / 2.6
  return [CX + a * Math.sign(c) * Math.abs(c) ** e, CY + b * Math.sign(s) * Math.abs(s) ** e] as XY
})
const circ = (r: number, n = N): XY[] => Array.from({ length: n }, (_, i) => {
  const t = (i / n) * 2 * Math.PI
  return [CX + r * Math.cos(t), CY + r * Math.sin(t)] as XY
})

/** Smooth band between two rings of the same count; normals from the ring's shape and the band's slope. */
function band(p: Part, r0: XY[], z0: number, r1: XY[], z1: number) {
  const n = r0.length
  const nr = (r: XY[], i: number): XY => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; const l = Math.hypot(b[1] - a[1], a[0] - b[0]); return [(b[1] - a[1]) / l, (a[0] - b[0]) / l] }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const slope = (k: number) => { const d = Math.hypot(r0[k][0] - CX, r0[k][1] - CY) - Math.hypot(r1[k][0] - CX, r1[k][1] - CY); return d / Math.max(0.01, z1 - z0) }
    const nn = (k: number): V3 => { const h = nr(r0, k); return unit([h[0], h[1], slope(k)]) }
    quadN(p, [r0[i][0], r0[i][1], z0], [r0[j][0], r0[j][1], z0], [r1[j][0], r1[j][1], z1], [r1[i][0], r1[i][1], z1], [nn(i), nn(j), nn(j), nn(i)])
  }
}
/** A flat annulus (or disc with inner = null) at z, facing up or down. */
function annulus(p: Part, outer: XY[], inner: XY[] | null, z: number, up: boolean) {
  if (!inner) { capPoly(p, outer, z, up); return }
  const n = outer.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [inner[i][0], inner[i][1], z], b: V3 = [outer[i][0], outer[i][1], z], c: V3 = [outer[j][0], outer[j][1], z], d: V3 = [inner[j][0], inner[j][1], z]
    if (up) p.quad(a, b, c, d); else p.quad(a, d, c, b)
  }
}

// --- The base building: the OSM outline, two storeys, 9.5 m, a lip and a flat roof ---
const BASE: XY[] = [[-11.5, -19.1], [11.5, -19.3], [11.5, 19.1], [-11.5, 19.3]]
const baseFacade: Facade = { bay: 7.5, ratio: 0.55, floor: 3.6, group: 2, spandrel: 0, sill: 1.6, head: 1.9, ground: 1.2, minLength: 6 }
const H_BASE = 9.5
for (let i = 0; i < 4; i++) facade(white, win, BASE[i], BASE[(i + 1) % 4], 0, H_BASE - 0.6, baseFacade)
for (let i = 0; i < 4; i++) { // coping lip
  const a = BASE[i], b = BASE[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: XY = [(b[1] - a[1]) / L, (a[0] - b[0]) / L]
  const A: XY = [a[0] + n[0] * 0.15, a[1] + n[1] * 0.15], B: XY = [b[0] + n[0] * 0.15, b[1] + n[1] * 0.15]
  white.quad([A[0], A[1], H_BASE - 0.6], [B[0], B[1], H_BASE - 0.6], [B[0], B[1], H_BASE], [A[0], A[1], H_BASE])
  white.quad([A[0], A[1], H_BASE], [B[0], B[1], H_BASE], [b[0], b[1], H_BASE], [a[0], a[1], H_BASE])
}
capPoly(roof, BASE, H_BASE)

// --- The shaft: an elongated round, from the base roof to the fins ---
const SA = 8.75, SB = 5.5
const SH = oval(SA, SB)
band(shaft, SH, H_BASE - 0.5, SH, 92)
// A plinth ring where the shaft leaves the roof.
band(white, oval(SA + 0.6, SB + 0.6), H_BASE, oval(SA + 0.6, SB + 0.6), H_BASE + 1.2)
annulus(white, oval(SA + 0.6, SB + 0.6), SH, H_BASE + 1.2, true)

// --- The fins: six tapering brackets from the shaft (80 m) out under the lowest drum (91 m) ---
{
  const z0 = 80, z1 = 91
  for (const sy of [-1, 1]) for (const fx of [-4.6, 0, 4.6]) {
    // the shaft's surface at x = CX + fx on this side
    const t = Math.abs(fx) / SA, yOn = SB * (1 - t ** 2.6) ** (1 / 2.6)
    const base: XY = [CX + fx, CY + sy * yOn]
    const out = 10.2 - yOn // reach the drum's edge (r ≈ 10.2)
    const w = 0.9
    const P = (dx: number, dy: number, z: number): V3 => [base[0] + dx, base[1] + sy * dy, z]
    // a wedge: inner face on the shaft, outer face sloping from the shaft at z0 to `out` at z1
    const a = P(-w, -0.3, z0), b = P(w, -0.3, z0), c = P(w, out, z1), d = P(-w, out, z1), e = P(-w, -0.3, z1), f = P(w, -0.3, z1)
    const quad = (p: V3, q: V3, r: V3, s: V3) => { if (sy > 0) white.quad(p, q, r, s); else white.quad(s, r, q, p) }
    quad(a, b, c, d) // sloped underside (faces out and down)
    if (sy > 0) { white.tri(b, f, c); white.tri(a, d, e) } else { white.tri(b, c, f); white.tri(a, e, d) }
  }
}

// --- The cab stack (heights from the 2025 telephoto, cab roof at 112 m) ---
{
  // lowest drum 91–95 m, 19.6 m across, with its dark soffit band underneath
  const d0 = circ(9.8)
  annulus(dark, d0, SH, 91, false)
  band(dark, d0, 91, d0, 92.2)
  band(white, d0, 92.2, d0, 95)
  // ring 2: 95–97.7 m, 22 m across
  const r2 = circ(11)
  annulus(white, r2, d0, 95, false)
  band(white, r2, 95, r2, 97.7)
  // the glass band 97.7–99.5 m, set back to 21 m
  const g = circ(10.5)
  annulus(white, r2, g, 97.7, true)
  band(win, g, 97.7, g, 99.5)
  // the widest ring 99.5–102.2 m, 24 m across, its top sloping in
  const r1 = circ(12), r1t = circ(11.2)
  annulus(white, r1, g, 99.5, false)
  band(white, r1, 99.5, r1, 101.6)
  band(white, r1, 101.6, r1t, 102.2)
  // the drum under the cab 102.2–106 m, 15 m across
  const d1 = circ(7.5)
  annulus(roof, r1t, d1, 102.2, true)
  band(white, d1, 102.2, d1, 106)
  // the cab glass, leaning out: 14.6 m at the sill to 15.8 m under the roof
  const c0 = circ(7.3), c1 = circ(7.9)
  annulus(white, d1, c0, 106, true)
  band(win, c0, 106, c1, 110.6)
  // the roof disc, 16.8 m, with a flared edge and a low cap
  const rd = circ(8.4), rt = circ(8.0), cap = circ(3.2)
  annulus(white, rd, c1, 110.6, false)
  band(white, rd, 110.6, rt, 111.6)
  annulus(roof, rt, cap, 111.6, true)
  band(white, cap, 111.6, cap, 112)
  capPoly(roof, cap, 112)
  // the mast to 115.7 m
  const m = Array.from({ length: 6 }, (_, i) => [CX + 0.25 * Math.cos((i * Math.PI) / 3), CY + 0.25 * Math.sin((i * Math.PI) / 3)] as XY)
  band(white, m, 112, m, 115.7)
}

finishModel('Haneda Airport Control Tower', 'tokyo-haneda-control-tower', [
  { part: shaft, material: finish('hnd-tower-shaft', 0xd9dad6) },
  { part: white, material: finish('hnd-tower-white', 0xf0f0ec) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('hnd-tower-soffit', 0x6e737b) },
  { part: roof, material: PALETTE.roof },
], { bearing: -30, osm: 'way/263025010', height: 115.7 }, 5000)
