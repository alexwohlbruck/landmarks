/**
 * Ortaköy Mosque (Büyük Mecidiye Camii), Ortaköy, Istanbul: procedural,
 * CC0-1.0.
 * bun generators/istanbul-ortakoy-mosque.ts
 *
 * Built 1854-1856 for Abdülmecid (Nigoğayos Balyan), on the pier at
 * Ortaköy beside the Bosphorus Bridge. A neo-Baroque single-dome mosque: a
 * tall square prayer hall in white marble, each face in three bays between
 * clustered columns, two tiers of huge arched windows, and at the top a
 * wide segmental arch over a carved tympanum; a turret with a lantern and
 * pinnacle at every corner; a lead dome on a windowed drum. On the land side
 * the two-storey sultan's pavilion (hünkâr kasrı) wraps round a small court,
 * with low lead domes on its roof, and the two slender minarets stand at
 * the junction of hall and pavilion, each a tall stone shaft with one
 * şerefe shaped like a Corinthian capital (gilt band) and a pointed stone
 * cap.
 *
 * Frame: x across the axis (world 51), y along it towards the land (world
 * 321); z up. Placed with bearing 321 (OSM edges run 51.3 / 141). The hall
 * is on the pier's tip (-y). Origin at the centroid of OSM way/498861735
 * (29.026824, 41.047303). The pier is mapped ground: elevation 0. No terrain
 * check could run (Mapterhorn has no z15 terrain here).
 *
 * OSM (ODbL), fetched 2026-11: way/498861735 (building=mosque, no height,
 * wikidata Q176380, checked: "Ortaköy Mosque"); no building:parts. Plan from
 * the outline: hall x -11.5..9.6, y -21.1..-0.1 (21.1 m square); a link
 * zone x -15.9..14.0, y -0.1..5.8, whose two side notches hold the
 * minarets (centres about (-13.7, 2.8) and (11.8, 2.8), from the photos);
 * the pavilion x -18.6..16.6, y 5.8..19.3 round a court x -8.4..6.4,
 * y 9.3..19.3.
 *
 * Estimated from the level view from the Bosphorus by Eusebius (south-west
 * face, about 24.6 px/m on the 1280 px file against the 21.1 m hall face,
 * corrected for an 18 degree slant):
 * - string course 9.8 m, upper windows 10.4-16.3 m, cornice and arch
 *   springing 19.1 m, segmental arches rising to 22.2 m;
 * - corner turrets to 20 m, lanterns and pinnacles to 25.3 m;
 * - drum to 24.8 m, dome about 15.5 m across rising to 29.9 m, gilt alem to
 *   33 m;
 * - pavilion cornice 10.8 m;
 * - minarets: şerefe 34-36 m, shaft to 44 m, stone cap to 49 m, tip 50 m
 *   (the minarets stand a few metres behind the face, read about 4%
 *   small, corrected).
 * Invented / simplified: window counts on the pavilion (one panel per
 * window); the carved tympana as recessed stone with three small windows;
 * column clusters as flat pilasters; the pavilion's roof domes as three low
 * lead domes.
 *
 * Minarets: the lower shaft tapers from 2.2 to 1.8 m (photos read about
 * 2-2.4 m), a gilt collar and a bold cushion-shaped şerefe 4.5 m across at
 * 33-36.5 m, a slimmer upper shaft (1.4-1.3 m) to a small ring at 44 m and
 * the pointed stone cap to 48.8 m. A first version with a straight 2.6 m
 * shaft and a thin şerefe read as fat posts at review.
 *
 * Colours from daylight photos, pulled to the palette: white marble
 * (#ebe7df), blue-grey lead (#9aa5b1), gilt alem and şerefe bands. Night:
 * floodlit (marble and lead carry _FLOODLIGHT); windows glow.
 *
 * Photos (EVIDENCE, all Wikimedia Commons):
 * - "Büyük Mecidiye Camii - Ortaköy Mosque.jpg", Eusebius, CC BY 3.0
 *   (from the Bosphorus, south-west: the ruler)
 *   https://commons.wikimedia.org/wiki/File:B%C3%BCy%C3%BCk_Mecidiye_Camii_-_Ortak%C3%B6y_Mosque.jpg
 * - "Ortaköy Mosque, 2025.jpg", Pragdon, CC0 (from the south)
 *   https://commons.wikimedia.org/wiki/File:Ortak%C3%B6y_Mosque,_2025.jpg
 * - "Ortaköy Mosque, Istanbul 2019.jpg", Moataz1997, CC BY-SA 4.0 (from the
 *   west, along the quay)
 *   https://commons.wikimedia.org/wiki/File:Ortak%C3%B6y_Mosque,_Istanbul_2019.jpg
 * - "Ortaköy Mosque from the Bosporus, Istanbul, 20260606 1424 1504.jpg",
 *   Jakub Hałun, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:Ortak%C3%B6y_Mosque_from_the_Bosporus,_Istanbul,_20260606_1424_1504.jpg
 * - "Ortaköy Mosque in 2024.jpg", flowcomm, CC BY 2.0
 *   https://commons.wikimedia.org/wiki/File:Ortak%C3%B6y_Mosque_in_2024.jpg
 * Look-only: A. Savin's "Istanbul asv2020-02 img59-66" series (Free Art
 * License, tagged look-only by the photo tool) was not used.
 *
 * Doubts: the land side of the pavilion and its court are not photographed
 * here; the pavilion's render reads pink in some photos (Moataz1997) and
 * white in others, drawn white; minaret positions are from photos (OSM has
 * no minaret parts).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const TAU = Math.PI * 2

const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part()

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

const HX0 = -11.5, HX1 = 9.6, HY0 = -21.1, HY1 = -0.1 // OSM
const DC: XY = [(HX0 + HX1) / 2, (HY0 + HY1) / 2]
const HW = (HX1 - HX0) / 2
const WALL = 19.1 // cornice and arch springing; photo-scaled
const T = 2.6 // corner turret side
const SPAN = HW - T // half span of the arch between the turrets
const RISE = 3.1 // segmental arch rise; photo
const ARCH_T = 1.0

prism(stone, rect(HX0, HX1, HY0, HY1, 0.5), 0, WALL, false)
prism(stone, rect(HX0 - 0.35, HX1 + 0.35, HY0 - 0.35, HY1 + 0.35, 0.7), WALL - 0.8, WALL + 0.2, false)
poly(stone, rect(HX0 - 0.35, HX1 + 0.35, HY0 - 0.35, HY1 + 0.35, 0.7).map(([x, y]) => [x, y, WALL + 0.2] as V3), [0, 0, 1])
// the flat roof behind the arches
prism(stone, rect(HX0 + 0.8, HX1 - 0.8, HY0 + 0.8, HY1 - 0.8, 0.5), WALL + 0.2, WALL + 1.2, false)
poly(lead, rect(HX0 + 0.8, HX1 - 0.8, HY0 + 0.8, HY1 - 0.8, 0.5).map(([x, y]) => [x, y, WALL + 1.2] as V3), [0, 0, 1])

type Face = { c: XY; n: XY; u: XY }
const facesH: Face[] = [
  { c: [DC[0], HY0], n: [0, -1], u: [1, 0] },
  { c: [HX1, DC[1]], n: [1, 0], u: [0, 1] },
  { c: [DC[0], HY1], n: [0, 1], u: [-1, 0] },
  { c: [HX0, DC[1]], n: [-1, 0], u: [0, -1] },
]
const fp = (f: Face, s: number, w: number, z: number): V3 => [f.c[0] + f.u[0] * s + f.n[0] * w, f.c[1] + f.u[1] * s + f.n[1] * w, z]

// segmental arch: circle through (±SPAN, 0) and (0, RISE)
const AR = (SPAN * SPAN + RISE * RISE) / (2 * RISE), A0 = Math.asin(SPAN / AR)
const arcPt = (k: number, n: number, r: number) => { // k = 0..n left to right
  const a = -A0 + (2 * A0 * k) / n
  return [r * Math.sin(a), r * Math.cos(a) - (AR - RISE) - (AR - r) * 0] as [number, number]
}
for (const [i, f] of facesH.entries()) {
  const N3: V3 = [f.n[0], f.n[1], 0]
  const z0 = WALL + 0.2, segs = 8
  // tympanum: segmental wall on the cornice, recessed panel and archivolt
  const outer = Array.from({ length: segs + 1 }, (_, k) => { const [s, z] = arcPt(k, segs, AR + 0.9); return [s, z] as [number, number] })
  const front = outer.map(([s, z]) => fp(f, s, 0, z0 + z)), back = outer.map(([s, z]) => fp(f, s, -ARCH_T, z0 + z))
  poly(stone, [fp(f, -SPAN - 0.9, 0, z0), ...front.slice(0, segs + 1), fp(f, SPAN + 0.9, 0, z0)], N3)
  for (let k = 0; k < segs; k++) {
    const am = -A0 + (2 * A0 * (k + 0.5)) / segs
    poly(stone, [front[k], front[k + 1], back[k + 1], back[k]], [f.u[0] * Math.sin(am), f.u[1] * Math.sin(am), Math.cos(am)])
  }
  // the archivolt: a raised band
  const ao = Array.from({ length: segs + 1 }, (_, k) => arcPt(k, segs, AR + 0.9)), ai = Array.from({ length: segs + 1 }, (_, k) => arcPt(k, segs, AR))
  for (let k = 0; k < segs; k++) {
    poly(stone, [fp(f, ao[k][0], 0.35, z0 + ao[k][1]), fp(f, ao[k + 1][0], 0.35, z0 + ao[k + 1][1]), fp(f, ai[k + 1][0], 0.35, z0 + ai[k + 1][1]), fp(f, ai[k][0], 0.35, z0 + ai[k][1])], N3)
    const am = -A0 + (2 * A0 * (k + 0.5)) / segs
    poly(stone, [fp(f, ao[k][0], 0, z0 + ao[k][1]), fp(f, ao[k + 1][0], 0, z0 + ao[k + 1][1]), fp(f, ao[k + 1][0], 0.35, z0 + ao[k + 1][1]), fp(f, ao[k][0], 0.35, z0 + ao[k][1])], [f.u[0] * Math.sin(am), f.u[1] * Math.sin(am), Math.cos(am)])
  }
  // three small windows in the tympanum
  const A = (s: number): XY => [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
  for (const s of [-3.2, 0, 3.2]) panel(win, A(s - 0.6), A(s + 0.6), z0 + 0.4, z0 + (s === 0 ? 2.2 : 1.7), f.n, true)
  // lead barrel behind the arch, back to the drum
  for (let k = 0; k < segs; k++) {
    const p0 = arcPt(k, segs, AR - 0.1), p1 = arcPt(k + 1, segs, AR - 0.1)
    const am = -A0 + (2 * A0 * (k + 0.5)) / segs
    poly(lead, [fp(f, p0[0], -ARCH_T, z0 + p0[1]), fp(f, p1[0], -ARCH_T, z0 + p1[1]), fp(f, p1[0], -ARCH_T - 3.2, z0 + p1[1]), fp(f, p0[0], -ARCH_T - 3.2, z0 + p0[1])], [f.u[0] * Math.sin(am), f.u[1] * Math.sin(am), Math.cos(am)])
  }
  // pilasters: four per face (column clusters), base to cornice
  for (const s of [-SPAN + 0.1, -SPAN / 3, SPAN / 3, SPAN - 0.1]) {
    const a = A(s - 0.55), b = A(s + 0.55)
    const ring: XY[] = [[a[0], a[1]], [b[0], b[1]], [b[0] + f.n[0] * 0.4, b[1] + f.n[1] * 0.4], [a[0] + f.n[0] * 0.4, a[1] + f.n[1] * 0.4]]
    const area = ring.reduce((t, p, j) => { const q = ring[(j + 1) % 4]; return t + p[0] * q[1] - q[0] * p[1] }, 0)
    prism(stone, area > 0 ? ring : ring.slice().reverse(), 0.6, WALL - 0.8, false)
  }
  // string course
  poly(stone, [fp(f, -HW + T, 0.3, 9.4), fp(f, HW - T, 0.3, 9.4), fp(f, HW - T, 0.3, 10.0), fp(f, -HW + T, 0.3, 10.0)], N3)
  poly(stone, [fp(f, -HW + T, 0, 10.0), fp(f, HW - T, 0, 10.0), fp(f, HW - T, 0.3, 10.0), fp(f, -HW + T, 0.3, 10.0)], [0, 0, 1])
  if (i === 2) continue // the land face is behind the pavilion below its roof
  // two tiers of three great arched windows
  for (const s of [-2 * SPAN / 3, 0, 2 * SPAN / 3]) {
    panel(win, A(s - 1.15), A(s + 1.15), 10.6, 16.4, f.n, true, 0.06)
    panel(win, A(s - 1.15), A(s + 1.15), 2.0, 7.6, f.n, true, 0.06)
  }
}
// land face above the pavilion: the upper tier only
{
  const f = facesH[2], A = (s: number): XY => [f.c[0] + f.u[0] * s, f.c[1] + f.u[1] * s]
  for (const s of [-2 * SPAN / 3, 0, 2 * SPAN / 3]) panel(win, A(s - 1.15), A(s + 1.15), 12.0, 16.4, f.n, true, 0.06)
}

// Corner turrets with lanterns and pinnacles.
for (const x of [HX0, HX1]) for (const y of [HY0, HY1]) {
  const c: XY = [x + (x < 0 ? T / 2 : -T / 2), y + (y < 0 ? T / 2 : -T / 2)]
  prism(stone, rect(c[0] - T / 2, c[0] + T / 2, c[1] - T / 2, c[1] + T / 2, 0.3), 0, 20.0)
  prism(stone, rect(c[0] - T / 2 - 0.25, c[0] + T / 2 + 0.25, c[1] - T / 2 - 0.25, c[1] + T / 2 + 0.25, 0.35), 19.5, 20.1)
  prism(stone, circle(c[0], c[1], 1.0, 8, Math.PI / 8), 20.1, 22.6)
  revolve(stone, c[0], c[1], [[1.15, 22.6], [1.15, 22.9], [0.75, 23.6], [0.4, 24.2], [0.25, 24.8], [0, 25.3]], 8)
}

// Drum and dome.
{
  const DR = 7.4
  revolve(stone, DC[0], DC[1], [[DR, WALL + 1.2], [DR, 24.2]], 16, 0, TAU, 'ring')
  for (let k = 0; k < 16; k++) {
    const t = ((k + 0.5) * TAU) / 16
    const A: XY = [DC[0] + DR * Math.cos(t - 0.1), DC[1] + DR * Math.sin(t - 0.1)]
    const B: XY = [DC[0] + DR * Math.cos(t + 0.1), DC[1] + DR * Math.sin(t + 0.1)]
    panel(win, A, B, 22.2, 23.9, [Math.cos(t), Math.sin(t)], true)
  }
  revolve(stone, DC[0], DC[1], [[DR, 24.2], [DR + 0.5, 24.4], [DR + 0.5, 24.85], [DR, 24.9]], 16, 0, TAU, 'ring')
  revolve(lead, DC[0], DC[1], domeProfile(DR - 0.05, 24.9, 5.0, 6), 20)
  alem(DC[0], DC[1], 29.85, 3.2)
}

// ---------------------------------------------------------------------------
// The sultan's pavilion and the link: two storeys, a flat roof with low
// lead domes.

const PH = 10.8
type Box = [number, number, number, number]
const pav: Box[] = [
  [-15.9, 14.0, -0.1, 5.8], // link
  [-18.6, 16.6, 5.8, 9.3], // pavilion bar
  [-18.6, -8.4, 9.3, 19.3], [6.4, 16.6, 9.3, 19.3], // wings round the court
]
for (const [x0, x1, y0, y1] of pav) {
  prism(stone, rect(x0, x1, y0, y1), 0, PH - 0.6, false)
  prism(stone, rect(x0 - 0.3, x1 + 0.3, y0 - 0.3, y1 + 0.3), PH - 0.6, PH, true, true)
}
for (const [x, y] of [[-13.5, 14.3], [11.5, 14.3], [-1.0, 4.0]] as XY[]) {
  prism(stone, circle(x, y, 2.9, 12), PH, PH + 0.6)
  revolve(lead, x, y, [[3.0, PH + 0.6], ...domeProfile(2.8, PH + 0.8, 1.4, 2)], 12)
}

function windowsAlong(a: XY, b: XY, n: XY, count: number, z: [number, number][]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const at = (d: number): XY => [a[0] + ux * d, a[1] + uy * d]
  for (let k = 0; k < count; k++) {
    const m = (L * (k + 0.5)) / count
    for (const [z0, z1] of z) panel(win, at(m - 0.6), at(m + 0.6), z0, z1, n)
  }
}
const two: [number, number][] = [[1.6, 4.4], [6.2, 8.9]]
windowsAlong([-15.9, -0.1], [HX0, -0.1], [0, -1], 1, two) // sea side of the link, west of the hall
windowsAlong([HX1, -0.1], [14.0, -0.1], [0, -1], 1, two)
windowsAlong([-18.6, 5.8], [-15.9, 5.8], [0, -1], 1, two)
windowsAlong([14.0, 5.8], [16.6, 5.8], [0, -1], 1, two)
windowsAlong([16.6, 5.8], [16.6, 19.3], [1, 0], 5, two)
windowsAlong([-18.6, 19.3], [-18.6, 5.8], [-1, 0], 5, two)
windowsAlong([16.6, 19.3], [6.4, 19.3], [0, 1], 3, two)
windowsAlong([-8.4, 19.3], [-18.6, 19.3], [0, 1], 3, two)
windowsAlong([6.4, 9.3], [-8.4, 9.3], [0, 1], 4, two)
windowsAlong([-8.4, 9.3], [-8.4, 19.3], [1, 0], 3, two)
windowsAlong([6.4, 19.3], [6.4, 9.3], [-1, 0], 3, two)

// ---------------------------------------------------------------------------
// Minarets: stone shafts, one capital-shaped şerefe with a gilt band, a
// shaft above, and a pointed stone cap; the shafts taper.

function minaret(x: number, y: number) {
  const n = 10
  prism(stone, rect(x - 1.6, x + 1.6, y - 1.6, y + 1.6, 0.3), 0, PH + 0.8)
  revolve(stone, x, y, [[1.45, PH + 0.8], [1.3, PH + 1.3], [1.1, PH + 1.8]], n, 0, TAU, 'ring')
  // lower shaft: 2.2 m tapering to 1.8 m
  revolve(stone, x, y, [[1.1, PH + 1.8], [0.9, 32.6]], n, 0, TAU, 'ring')
  // the capital-shaped şerefe: a gilt collar, then a bold cushion ring
  revolve(gilt, x, y, [[0.9, 32.6], [1.15, 33.3]], n, 0, TAU, 'ring')
  revolve(stone, x, y, [[1.15, 33.3], [1.7, 33.9], [2.15, 34.6], [2.25, 35.3], [2.15, 36.0], [1.6, 36.4], [0.72, 36.5]], n, 0, TAU, 'ring')
  // slim upper shaft, a small ring, the pointed stone cap
  revolve(stone, x, y, [[0.72, 36.5], [0.64, 43.7], [0.85, 43.9], [0.85, 44.3], [0.66, 44.5]], n, 0, TAU, 'ring')
  revolve(stone, x, y, [[0.66, 44.5], [0.42, 46.6], [0.16, 48.5], [0, 48.8]], n)
  alem(x, y, 48.6, 1.4)
}
minaret(-13.7, 2.8)
minaret(11.8, 2.8)

// ---------------------------------------------------------------------------

const lit = (k: number) => (_p: V3, n: V3) => k * (n[2] > 0.9 ? 0.45 : 1)
const parts = [
  { part: stone, material: { ...finish('marble', 0xebe7df), floodlight: lit(0.9) } },
  { part: lead, material: { ...finish('lead', 0x9aa5b1), floodlight: lit(0.8) } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Ortaköy Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 321, elevation: 0, height: 50,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-ortakoy-mosque.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
