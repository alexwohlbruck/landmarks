/**
 * Dolmabahçe Mosque (Bezm-i Âlem Valide Sultan Camii), Beşiktaş, Istanbul:
 * procedural, CC0-1.0.
 * bun generators/istanbul-dolmabahce-mosque.ts
 *
 * Begun 1853 for Bezm-i Âlem Valide Sultan, finished 1855 under Abdülmecid
 * (Garabet Balyan). A Baroque single-dome mosque on the shore: a square
 * prayer hall whose four faces each rise into a great semicircular arch with
 * a fan-shaped lunette window, tall arched windows in two storeys below, a
 * turret with a little domed lantern at every corner, and a lead dome on a
 * drum behind the arches; on the land side the two-storey sultan's pavilion
 * (hünkâr kasrı) wraps the hall, and at its two far corners stand the two
 * very slender minarets, each a fluted column with a single şerefe shaped
 * like a Corinthian capital and a tall lead cone.
 *
 * Frame: x across the axis (world 57.5), y along it towards the land (world
 * 327.5); z up. Placed with bearing 327.5 (OSM edges run 57.7 / 147.3). The
 * prayer hall is on the sea side (-y). Origin at the centroid of OSM
 * way/498861874 (28.995284, 41.036721). Flat shore fill: elevation 0. No
 * terrain check could run (Mapterhorn has no z15 terrain here).
 *
 * OSM (ODbL), fetched 2026-11: way/498861874 (building=mosque, height 16,
 * wikidata Q2086068, checked: "Dolmabahçe Mosque"), way/498861873 (the
 * dome, min_height 16, maxheight 28), way/498861875 and way/498861877 (the
 * minaret shafts, height 55, roof:height 12), way/498861876 and
 * way/498861878 (the minaret pedestals, height 12). Plan from the outline:
 * hall x -8.1..15.0, y -20.6..5.4; dome centre (3.45, -9.1); pavilion bar
 * x -23.7..30.6, y 5.3..13.6; its two forward blocks x -15.8..-4.8 and
 * 11.5..22.5 to y 20.9; minaret centres (-13.4, 18.4) and (20.1, 18.3).
 *
 * Estimated from the level view from the Bosphorus (Diego Delso, DD 22,
 * 19 px/m on the 1280 px file, against the 23.1 m hall front):
 * - hall wall to the arch springing 13.4 m (OSM height 16 is the roof
 *   behind the arches), great arches 15.6 m span (about 0.7 of the face)
 *   to 21.5 m;
 * - corner turrets to 18.6 m, lanterns and pinnacles to 22.6 m;
 * - drum to 22.3 m, dome 17 m across rising to 28.3 m (OSM maxheight 28
 *   agrees), gilt alem to 31.3 m;
 * - pavilion cornice 9.7 m, low roof to 10.8 m;
 * - minarets: şerefe at 29.5 m, cone from 35.2 m, tip 45.5 m. OSM's 55 m
 *   disagrees with this and with the Arild Vågen view; the photos are used.
 * Invented / simplified: window sizes and counts (one panel per real
 * window, grouped where small); the lunette's tracery as three fan panels;
 * the vaults behind the arches as short lead barrels; the minaret flutes and
 * the carved capital-balcony as a plain flared ring.
 *
 * Minarets drawn about 1.6 times their real diameter (2.6 m shaft) so they
 * survive at phone size.
 *
 * Colours from daylight photos, pulled to the palette: white-grey marble
 * (#e8e4dc), blue-grey lead (#98a3b0), gilt alem. Night: floodlit (marble
 * and lead carry _FLOODLIGHT), windows glow.
 *
 * Photos (EVIDENCE, all Wikimedia Commons):
 * - "Mezquita de Dolmabahçe, Estambul, Turquía, 2024-09-29, DD 22.jpg",
 *   Diego Delso, CC BY-SA 4.0 (from the Bosphorus, south-east: the ruler)
 *   https://commons.wikimedia.org/wiki/File:Mezquita_de_Dolmabah%C3%A7e,_Estambul,_Turqu%C3%ADa,_2024-09-29,_DD_22.jpg
 * - "Dolmabahçe Mosque Mars 2013.jpg", Arild Vågen, CC BY-SA 3.0 (from
 *   the south, the sea and south-west faces and both minarets)
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Mosque_Mars_2013.jpg
 * - "Mezquita de Dolmabahçe, Estambul, Turquía, 2024-09-28, DD 127.jpg",
 *   Diego Delso, CC BY-SA 4.0 (the pavilion front, land side)
 *   https://commons.wikimedia.org/wiki/File:Mezquita_de_Dolmabah%C3%A7e,_Estambul,_Turqu%C3%ADa,_2024-09-28,_DD_127.jpg
 * - "Istanbul Bosphorus Dolmabahçe Mosque IMG 7904 1920.jpg", Alexxx1979,
 *   CC BY-SA 4.0 (from the Bosphorus)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Bosphorus_Dolmabah%C3%A7e_Mosque_IMG_7904_1920.jpg
 * - "Dolmabahçe Mosque exterior in 2019 7190.jpg", Dosseman, CC BY-SA 4.0
 *   (land side, north-west minaret)
 *   https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Mosque_exterior_in_2019_7190.jpg
 * Look-only: none.
 *
 * Doubts: the pavilion's back (street) facade and roof are from one photo;
 * the minaret height disagrees with OSM; the hall's land face is assumed to
 * repeat the sea face above the pavilion roof.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part()

// ---------------------------------------------------------------------------
// Helpers (as in istanbul-blue-mosque.ts).

function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true, bottom = false) {
  p.loft([ring.map(([x, y]) => [x, y, z0] as V3), ring.map(([x, y]) => [x, y, z1] as V3)])
  if (top) poly(p, ring.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  if (bottom) poly(p, ring.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
function rect(x0: number, x1: number, y0: number, y1: number, c = 0): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}
function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(phase + (k * TAU) / n), cy + r * Math.sin(phase + (k * TAU) / n)] as XY)
}
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], n: number, a0 = 0, a1 = TAU, smooth: boolean | 'ring' = true) {
  const m = prof.length
  const nrm2 = prof.map((_, i) => {
    const pa = prof[Math.max(0, i - 1)], pb = prof[Math.min(m - 1, i + 1)]
    const dr = pb[0] - pa[0], dz = pb[1] - pa[1], l = Math.hypot(dr, dz) || 1
    return [dz / l, -dr / l] as [number, number]
  })
  for (let k = 0; k < n; k++) {
    const t0 = a0 + ((a1 - a0) * k) / n, t1 = a0 + ((a1 - a0) * (k + 1)) / n
    for (let i = 0; i < m - 1; i++) {
      const P = (j: number, t: number): V3 => [cx + prof[j][0] * Math.cos(t), cy + prof[j][0] * Math.sin(t), prof[j][1]]
      const N = (j: number, t: number): V3 => [nrm2[j][0] * Math.cos(t), nrm2[j][0] * Math.sin(t), nrm2[j][1]]
      const dr = prof[i + 1][0] - prof[i][0], dz = prof[i + 1][1] - prof[i][1], l = Math.hypot(dr, dz) || 1
      const S = (t: number): V3 => [(dz / l) * Math.cos(t), (dz / l) * Math.sin(t), -dr / l]
      const nA = smooth === 'ring' ? S(t0) : smooth ? N(i, t0) : S((t0 + t1) / 2), nB = smooth === 'ring' ? S(t1) : smooth ? N(i, t1) : S((t0 + t1) / 2)
      const nC = smooth === 'ring' ? S(t1) : smooth ? N(i + 1, t1) : S((t0 + t1) / 2), nD = smooth === 'ring' ? S(t0) : smooth ? N(i + 1, t0) : S((t0 + t1) / 2)
      const a = P(i, t0), b = P(i, t1), c = P(i + 1, t1), d = P(i + 1, t0)
      if (prof[i][0] > 1e-6) p.tri(a, b, c, undefined, undefined, undefined, [nA, nB, nC])
      if (prof[i + 1][0] > 1e-6) p.tri(a, c, d, undefined, undefined, undefined, [nA, nC, nD])
    }
  }
}
function domeProfile(r: number, z: number, h: number, rings: number): [number, number][] {
  const R = (r * r + h * h) / (2 * h), zc = z + h - R, top = Math.asin(r / R)
  return Array.from({ length: rings + 1 }, (_, k) => {
    const a = top * (1 - k / rings)
    return [R * Math.sin(a), zc + R * Math.cos(a)] as [number, number]
  })
}
function alem(cx: number, cy: number, z: number, h: number) {
  const w = Math.max(0.22, h * 0.07)
  revolve(gilt, cx, cy, [[w * 1.6, z - 0.2], [w * 2.6, z + h * 0.3], [w * 0.9, z + h * 0.55], [0, z + h]], 5)
}
/** A flat panel on a vertical wall from a to b (plan), offset out along n. */
function panel(p: Part, a: XY, b: XY, z0: number, z1: number, n: XY, arch = false, out = 0.05) {
  const o: XY = [n[0] * out, n[1] * out]
  const A: V3 = [a[0] + o[0], a[1] + o[1], z0], B: V3 = [b[0] + o[0], b[1] + o[1], z0]
  const N3: V3 = [n[0], n[1], 0]
  if (!arch) { poly(p, [A, B, [B[0], B[1], z1], [A[0], A[1], z1]], N3); return }
  const w = Math.hypot(b[0] - a[0], b[1] - a[1]), r = w / 2, zs = z1 - r
  poly(p, [A, B, [B[0], B[1], zs], [A[0], A[1], zs]], N3)
  const ux = (b[0] - a[0]) / w, uy = (b[1] - a[1]) / w, cx = (A[0] + B[0]) / 2, cy = (A[1] + B[1]) / 2
  const pts: V3[] = []
  for (let k = 0; k <= 6; k++) { const t = Math.PI - (Math.PI * k) / 6; pts.push([cx + ux * r * Math.cos(t), cy + uy * r * Math.cos(t), zs + r * Math.sin(t)]) }
  poly(p, pts, N3)
}

// ---------------------------------------------------------------------------
// Prayer hall.

const HX0 = -8.1, HX1 = 15.0, HY0 = -20.6, HY1 = 5.4 // OSM
const DC: XY = [3.45, -9.1] // dome centre (OSM dome part)
const WALL = 13.4 // arch springing / main cornice; photo-scaled
const ROOF = 16.0 // flat roof behind the arches (OSM height 16)
const ARCH_R = 7.8, ARCH_T = 1.0

prism(stone, rect(HX0, HX1, HY0, HY1, 0.5), 0, WALL, false)
prism(stone, rect(HX0 - 0.35, HX1 + 0.35, HY0 - 0.35, HY1 + 0.35, 0.7), WALL - 0.7, WALL + 0.25, false)
prism(stone, rect(HX0 + 0.6, HX1 - 0.6, HY0 + 0.6, HY1 - 0.6, 0.5), WALL + 0.25, ROOF, false)
poly(lead, rect(HX0 + 0.6, HX1 - 0.6, HY0 + 0.6, HY1 - 0.6, 0.5).map(([x, y]) => [x, y, ROOF] as V3), [0, 0, 1])
poly(stone, rect(HX0 - 0.35, HX1 + 0.35, HY0 - 0.35, HY1 + 0.35, 0.7).map(([x, y]) => [x, y, WALL + 0.25] as V3), [0, 0, 1])

// The four faces: centre point, outward normal, along-face unit (left to right seen from outside), half width.
type Face = { c: XY; n: XY; u: XY; hw: number }
const cx = (HX0 + HX1) / 2, cy = (HY0 + HY1) / 2
const facesH: Face[] = [
  { c: [DC[0], HY0], n: [0, -1], u: [1, 0], hw: (HX1 - HX0) / 2 }, // sea
  { c: [HX1, DC[1]], n: [1, 0], u: [0, 1], hw: 11.5 }, // north-east
  { c: [HX0, DC[1]], n: [-1, 0], u: [0, -1], hw: 11.5 }, // south-west
  { c: [DC[0], HY1], n: [0, 1], u: [-1, 0], hw: (HX1 - HX0) / 2 }, // land (above the pavilion)
]
void cx; void cy

/** A point on a face: s along the face from its centre line, w out of it, z up. */
const fp = (f: Face, s: number, w: number, z: number): V3 => [f.c[0] + f.u[0] * s + f.n[0] * w, f.c[1] + f.u[1] * s + f.n[1] * w, z]

for (const [i, f] of facesH.entries()) {
  const N3: V3 = [f.n[0], f.n[1], 0]
  // The great arch: a semicircular wall (tympanum) standing on the cornice,
  // ARCH_T thick, with a bold archivolt.
  const segs = 10
  const ring = (r: number, w: number) => Array.from({ length: segs + 1 }, (_, k) => {
    const t = Math.PI - (Math.PI * k) / segs
    return fp(f, r * Math.cos(t), w, WALL + 0.25 + r * Math.sin(t))
  })
  const front = ring(ARCH_R, 0.0), back = ring(ARCH_R, -ARCH_T)
  poly(stone, [fp(f, -ARCH_R, 0, WALL + 0.25), ...front.slice(1, -1), fp(f, ARCH_R, 0, WALL + 0.25)], N3)
  for (let k = 0; k < segs; k++) {
    const tm = Math.PI - (Math.PI * (k + 0.5)) / segs
    poly(stone, [front[k], front[k + 1], back[k + 1], back[k]], [f.u[0] * Math.cos(tm), f.u[1] * Math.cos(tm), Math.sin(tm)])
  }
  // archivolt: a raised band round the arch
  const ao = ring(ARCH_R + 0.05, 0.35), ai = ring(ARCH_R - 1.0, 0.35), ao0 = ring(ARCH_R + 0.05, 0), ai0 = ring(ARCH_R - 1.0, 0)
  for (let k = 0; k < segs; k++) {
    poly(stone, [ao[k], ao[k + 1], ai[k + 1], ai[k]], N3)
    const tm = Math.PI - (Math.PI * (k + 0.5)) / segs
    poly(stone, [ao0[k], ao0[k + 1], ao[k + 1], ao[k]], [f.u[0] * Math.cos(tm), f.u[1] * Math.cos(tm), Math.sin(tm)])
  }
  // the fan lunette: three window sectors round a stone hub
  for (const [t0, t1] of [[0.08, 0.3], [0.37, 0.63], [0.7, 0.92]]) {
    const pts: V3[] = []
    for (let k = 0; k <= 3; k++) { const t = Math.PI * (t0 + ((t1 - t0) * k) / 3); pts.push(fp(f, 5.9 * Math.cos(t), 0.08, WALL + 0.6 + 5.9 * Math.sin(t))) }
    for (let k = 3; k >= 0; k--) { const t = Math.PI * (t0 + ((t1 - t0) * k) / 3); pts.push(fp(f, 2.6 * Math.cos(t), 0.08, WALL + 0.6 + 2.6 * Math.sin(t))) }
    // a convex split: two halves
    poly(win, [pts[0], pts[1], pts[6], pts[7]], N3)
    poly(win, [pts[1], pts[2], pts[5], pts[6]], N3)
    poly(win, [pts[2], pts[3], pts[4], pts[5]], N3)
  }
  // Short lead barrel vault from the arch back to the drum.
  {
    const depth = 4.2, n = 8
    for (let k = 0; k < n; k++) {
      const a0 = Math.PI - (Math.PI * k) / n, a1 = Math.PI - (Math.PI * (k + 1)) / n
      const r = ARCH_R - 0.1
      const P = (a: number, w: number) => fp(f, r * Math.cos(a), w, WALL + 0.25 + r * Math.sin(a))
      const am = (a0 + a1) / 2
      poly(lead, [P(a0, -ARCH_T), P(a1, -ARCH_T), P(a1, -ARCH_T - depth), P(a0, -ARCH_T - depth)], [f.u[0] * Math.cos(am), f.u[1] * Math.cos(am), Math.sin(am)])
    }
  }
  if (i === 3) continue // the land face below the arch is the pavilion's
  // Upper storey: a tall arched centre window and two square-headed ones.
  const nn: XY = f.n
  const A = (s: number): XY => [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
  panel(win, A(-1.1), A(1.1), 8.4, 12.9, nn, true)
  panel(win, A(-5.2), A(-3.4), 9.0, 11.7, nn)
  panel(win, A(3.4), A(5.2), 9.0, 11.7, nn)
  // Ground storey: three tall arched windows.
  for (const s of i === 0 ? [-3.6, 3.6] : [-4.3, 0, 4.3]) panel(win, A(s - 1.05), A(s + 1.05), 1.4, 6.6, nn, true)
  // a string course between the storeys
  poly(stone, [fp(f, -f.hw + 1.4, 0.2, 7.5), fp(f, f.hw - 1.4, 0.2, 7.5), fp(f, f.hw - 1.4, 0.2, 8.0), fp(f, -f.hw + 1.4, 0.2, 8.0)], N3)
  poly(stone, [fp(f, -f.hw + 1.4, 0, 8.0), fp(f, f.hw - 1.4, 0, 8.0), fp(f, f.hw - 1.4, 0.2, 8.0), fp(f, -f.hw + 1.4, 0.2, 8.0)], [0, 0, 1])
}

// Corner turrets with domed lanterns and pinnacles.
for (const x of [HX0, HX1]) for (const y of [HY0, HY1]) {
  const c: XY = [x + (x < 0 ? 1.4 : -1.4), y + (y < 0 ? 1.4 : -1.4)]
  prism(stone, rect(c[0] - 1.4, c[0] + 1.4, c[1] - 1.4, c[1] + 1.4, 0.3), 0, 18.6)
  prism(stone, rect(c[0] - 1.6, c[0] + 1.6, c[1] - 1.6, c[1] + 1.6, 0.35), 18.0, 18.6)
  prism(stone, circle(c[0], c[1], 1.05, 8, Math.PI / 8), 18.6, 20.4)
  revolve(lead, c[0], c[1], [[1.15, 20.4], ...domeProfile(1.05, 20.6, 0.9, 2)], 8)
  revolve(stone, c[0], c[1], [[0.3, 21.5], [0.25, 22.2], [0, 22.6]], 5)
}

// Drum and dome. Dome 17 m across rising to 28.3 m (photo; OSM maxheight 28).
{
  const DR = 8.7
  revolve(stone, DC[0], DC[1], [[DR, ROOF], [DR, 21.6]], 20, 0, TAU, 'ring')
  // drum windows between the arches' crowns
  for (let k = 0; k < 20; k++) {
    const t = ((k + 0.5) * TAU) / 20
    const nx = Math.cos(t), ny = Math.sin(t)
    const A: XY = [DC[0] + DR * Math.cos(t - 0.09), DC[1] + DR * Math.sin(t - 0.09)]
    const B: XY = [DC[0] + DR * Math.cos(t + 0.09), DC[1] + DR * Math.sin(t + 0.09)]
    panel(win, A, B, 19.6, 21.2, [nx, ny], true)
  }
  // cornice ring
  revolve(stone, DC[0], DC[1], [[DR, 21.6], [DR + 0.55, 21.8], [DR + 0.55, 22.3], [DR, 22.4]], 20, 0, TAU, 'ring')
  revolve(lead, DC[0], DC[1], domeProfile(DR - 0.1, 22.4, 5.9, 6), 20)
  alem(DC[0], DC[1], 28.25, 3.0)
}

// ---------------------------------------------------------------------------
// The sultan's pavilion: a two-storey bar across the land side and two
// forward blocks holding the minarets. Low lead roofs.

const PH = 9.7, PR = 10.8
type Box = [number, number, number, number]
const pav: Box[] = [
  [-23.7, HX0, 5.3, 13.6], [HX1, 30.6, 5.3, 13.6], [HX0, HX1, HY1, 13.6], // the bar
  [-15.8, -4.8, 13.6, 20.9], [11.5, 22.5, 13.6, 20.9], // forward blocks
]
for (const [x0, x1, y0, y1] of pav) {
  prism(stone, rect(x0, x1, y0, y1), 0, PH, false)
  prism(stone, rect(x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3), PH - 0.5, PH, true, true)
}
// a low hipped roof over the whole pavilion as one ridge per block
function hip(x0: number, x1: number, y0: number, y1: number, z0: number, h: number) {
  const m = Math.min(x1 - x0, y1 - y0) / 2
  const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const top: V3[] = (x1 - x0) >= (y1 - y0)
    ? [[x0 + m, y0 + m, z0 + h], [x1 - m, y0 + m, z0 + h], [x1 - m, y1 - m, z0 + h], [x0 + m, y1 - m, z0 + h]]
    : [[x0 + m, y0 + m, z0 + h], [x1 - m, y0 + m, z0 + h], [x1 - m, y1 - m, z0 + h], [x0 + m, y1 - m, z0 + h]]
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    const e: XY = [r0[j][0] - r0[k][0], r0[j][1] - r0[k][1]]
    const out: V3 = [e[1], -e[0], 0]
    const L = Math.hypot(out[0], out[1])
    const n: V3 = [out[0] / L * h, out[1] / L * h, m]
    if (Math.hypot(top[j][0] - top[k][0], top[j][1] - top[k][1]) < 1e-6) poly(lead, [r0[k], r0[j], top[k]], n)
    else poly(lead, [r0[k], r0[j], top[j], top[k]], n)
  }
}
hip(-23.7, 30.6, 5.3, 13.6, PH, PR - PH)
hip(-15.8, -4.8, 13.6, 20.9, PH, PR - PH)
hip(11.5, 22.5, 13.6, 20.9, PH, PR - PH)

// Pavilion windows: two storeys, one panel per window.
function windowsAlong(a: XY, b: XY, n: XY, count: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const at = (d: number): XY => [a[0] + ux * d, a[1] + uy * d]
  for (let k = 0; k < count; k++) {
    const m = (L * (k + 0.5)) / count
    panel(win, at(m - 0.65), at(m + 0.65), 1.4, 3.9, n)
    panel(win, at(m - 0.65), at(m + 0.65), 5.6, 8.4, n)
  }
}
windowsAlong([-23.7, 5.3], [HX0, 5.3], [0, -1], 4) // sea side of the bar, west of the hall
windowsAlong([HX1, 5.3], [30.6, 5.3], [0, -1], 4)
windowsAlong([30.6, 5.3], [30.6, 13.6], [1, 0], 2)
windowsAlong([-23.7, 13.6], [-23.7, 5.3], [-1, 0], 2)
windowsAlong([22.5, 13.6], [22.5, 20.9], [1, 0], 2)
windowsAlong([-15.8, 20.9], [-15.8, 13.6], [-1, 0], 2)
windowsAlong([22.5, 20.9], [11.5, 20.9], [0, 1], 3)
windowsAlong([-4.8, 20.9], [-15.8, 20.9], [0, 1], 3)
windowsAlong([11.5, 13.6], [-4.8, 13.6], [0, 1], 4) // the court between the forward blocks
windowsAlong([-23.7 + 0.01, 13.6], [-15.8, 13.6], [0, 1], 2)
windowsAlong([22.5, 13.6], [30.6, 13.6], [0, 1], 2)

// ---------------------------------------------------------------------------
// Minarets: fluted column shafts with one capital-shaped şerefe and a tall
// lead cone. Shaft drawn 2.6 m across (about 1.6 times real).

function minaret(x: number, y: number) {
  const R = 1.3, n = 10
  prism(stone, rect(x - 1.85, x + 1.85, y - 1.85, y + 1.85, 0.3), 0, 12.0) // pedestal (OSM height 12)
  revolve(stone, x, y, [[1.75, 12.0], [1.6, 12.6], [R, 13.1]], n, 0, TAU, 'ring')
  revolve(stone, x, y, [[R, 13.1], [R * 0.9, 27.4]], n, 0, TAU, 'ring')
  // the şerefe: a flared capital, its parapet and the floor back to the shaft
  revolve(stone, x, y, [[R * 0.9, 27.4], [R + 0.4, 28.5], [R + 1.2, 29.3], [R + 1.2, 30.3], [R * 0.85, 30.4]], n, 0, TAU, 'ring')
  revolve(stone, x, y, [[R * 0.85, 30.4], [R * 0.75, 35.0], [R * 0.95, 35.2]], n, 0, TAU, 'ring')
  revolve(lead, x, y, [[R * 0.95, 35.2], [0.25, 44.4], [0, 44.6]], n)
  alem(x, y, 44.3, 1.4)
}
minaret(-13.4, 18.4)
minaret(20.1, 18.3)

// ---------------------------------------------------------------------------

const lit = (k: number) => (_p: V3, n: V3) => k * (n[2] > 0.9 ? 0.45 : 1)
const parts = [
  { part: stone, material: { ...finish('marble', 0xe8e4dc), floodlight: lit(0.9) } },
  { part: lead, material: { ...finish('lead', 0x98a3b0), floodlight: lit(0.8) } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Dolmabahçe Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 327.5, elevation: 0, height: 46,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-dolmabahce-mosque.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
