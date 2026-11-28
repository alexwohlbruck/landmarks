/**
 * USS Constitution ("Old Ironsides"), Pier 1, Charlestown Navy Yard, Boston
 * (launched 1797, Joshua Humphreys) — original procedural geometry, CC0-1.0.
 * bun generators/bos-uss-constitution.ts
 *
 * Map frame: x east, y north, z up, metres; y = 0 is the waterline. Bearing
 * 122.5: +y runs along the keel toward the bow (she lies bow to the
 * south-east at Pier 1), +x to starboard, which faces the harbour; her port
 * side lies along the pier. The bearing is the line through the three masts
 * and the bowsprit in the lidar (OSM's outline, way/166151194, runs at
 * 119.5° and is a rough sketch). Anchor = the hull's middle on that line,
 * -71.0565311, 42.3724353; the hull's centreline is at x = 0.5.
 *
 * Identity (from the photos below):
 *  1. A long low black hull with the broad white stripe along the gun deck,
 *     its row of black gunports, the copper bottom just showing at the
 *     waterline, and the white-banded transom with its stern windows.
 *  2. Three tall square-rigged masts (fore, main, mizzen), each in stages
 *     (lower mast, top, topmast, topgallant and royal pole) with black yards
 *     crossed at every stage, sails furled, the lower masts pale.
 *  3. The long bowsprit and jibboom angled up from the bow, the spanker boom
 *     over the stern, the white boats in davits at the quarters and stern.
 *  4. Rigging: only the bold lines (lower and topmast shrouds, fore-and-aft
 *     stays, backstays), drawn thick enough to read.
 *
 * Dimensions:
 *  - Published (Wikipedia, citing the USS Constitution Museum and the US
 *    Navy fact file): 207 ft (63 m) billet head to taffrail, 175 ft at the
 *    waterline, 304 ft (92.7 m) bowsprit to spanker, beam 43 ft 6 in
 *    (13.26 m); masts fore 198 ft, main 220 ft, mizzen 172.5 ft (60.4, 67.1,
 *    52.6 m), which, from their sum with the 21–23 ft draft, are taken to be
 *    from the keel.
 *  - Lidar: USGS 3DEP MA_CentralEastern_1_2021 (2021), 0.5 m grid, read in
 *    this frame (lidar_frame.py). Water 0.2 above the grid's ground_min (=
 *    y 0 here). Measured: hull from y -32 (taffrail) to the stem at 28,
 *    13 m wide; spar deck 4.6; bulwark rail 6.4 amidships, 7–8 at the ends;
 *    masts at y -21 (mizzen), -9 (main), 16 (fore); the main yard and tops
 *    at 21–26; topmast heads 37–41 (the thin topgallant and royal poles
 *    above leave few returns); the bowsprit rises from 8 at y 28 to 16 at
 *    y 44, about 20°.
 *  - Photo-scaled (USS Constitution sets sail (1), against the 6.4 m rail
 *    and the 22–26 m main top): the white stripe 2.6–4.1 over the waterline,
 *    the gunports, the main truck at about 53–55. The published heights
 *    less the draft give the main truck 60 m over the waterline; the model
 *    takes 57, between the two, and fore 51, mizzen 44 in the published
 *    ratios. Yard spans and stage heights are estimated from the same photo
 *    and the long view (53825931403).
 *
 * Elevation 0: the map's terrain over the water is flat (Mapterhorn 0.0 to
 * within 0.2 under the whole footprint, the pier deck 4.6 beyond x -10), so
 * the waterline, the model's lowest point, sits on it. Nothing is built
 * below the waterline.
 *
 * Night: she is floodlit at her pier; the hull and the white work carry
 * _FLOODLIGHT, the stern windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Flickr - Official U.S. Navy Imagery - USS Constitution sets sail. (1).jpg,
 *    U.S. Navy, public domain (starboard quarter, all masts, the hull bands)
 *    https://commons.wikimedia.org/wiki/File:Flickr_-_Official_U.S._Navy_Imagery_-_USS_Constitution_sets_sail._(1).jpg
 *  - USS Constitution at Charlestown Navy Yard (53825931403).jpg, Ethan
 *    Long, CC BY-SA 2.0 (at Pier 1 from the harbour, bow left)
 *    https://commons.wikimedia.org/wiki/File:USS_Constitution_at_Charlestown_Navy_Yard_(53825931403).jpg
 *  - USS Constitution wm.jpg, Pbohnhof, CC BY-SA 3.0 (the stern, boats and
 *    davits) https://commons.wikimedia.org/wiki/File:USS_Constitution_wm.jpg
 *  - USS Constitution, Charlestown, MA, 2023-02-20 01.jpg, Crisco 1492,
 *    CC BY-SA 4.0 (from the pier, bow quarter)
 *    https://commons.wikimedia.org/wiki/File:USS_Constitution,_Charlestown,_MA,_2023-02-20_01.jpg
 *  - Boston Navy Week 2012 120630-N-WX378-031.jpg, U.S. Navy, public domain
 *    (the pale lower masts, tops and yards from the pier)
 *    https://commons.wikimedia.org/wiki/File:Boston_Navy_Week_2012_120630-N-WX378-031.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the topgallant and royal heights (see above); the hull's lines
 * are a smooth estimate from the plan and the photos, not from drawings;
 * the head rails, figure and quarter galleries are left out; she is turned
 * end for end now and then, and this is how she lay in 2021.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './atl-flatiron-building'

const hull = new Part(), white = new Part(), copper = new Part(), wood = new Part(), win = new Part(), canvas = new Part()

const XC = 0.5, YS = -32, YB = 28, BEAM = 6.65, DECK = 4.6
const tOf = (y: number) => (y - YS) / (YB - YS)
/** Half-breadth at its widest (z 2.5), along the hull. */
function hb(y: number) {
  const t = tOf(y)
  if (t <= 0.3) return 4.7 + (BEAM - 4.7) * Math.sin((Math.PI / 2) * (t / 0.3))
  if (t <= 0.58) return BEAM
  const u = (t - 0.58) / 0.42
  return BEAM * Math.sqrt(Math.max(0, 1 - u ** 1.7))
}
const rail = (y: number) => 6.4 + 1.3 * Math.max(0, (tOf(y) - 0.5) / 0.5) ** 2 + 0.9 * Math.max(0, (0.25 - tOf(y)) / 0.25) ** 2
/** Half-width at height z: finer at the waterline (more so at the bow), tumbling home to the rail. */
function w(y: number, z: number) {
  const m = hb(y), t = tOf(y), r = rail(y)
  const w0 = m * (t > 0.6 ? 0.93 - 0.35 * ((t - 0.6) / 0.4) : 0.93)
  if (z <= 2.5) return w0 + (m - w0) * (z / 2.5)
  return m - m * 0.12 * ((z - 2.5) / (r - 2.5))
}

// ── Hull: bands from the waterline up ──
const ys: number[] = []
for (let y = YS; y < YB - 6; y += 2.5) ys.push(y)
for (let y = YB - 6; y < YB - 0.01; y += 1.2) ys.push(y)
ys.push(YB)
const bands: Array<[number, number, Part]> = [[0, 0.4, copper], [0.4, 2.6, hull], [2.6, 4.1, white], [4.1, -1, hull]]
const zl = (y: number, z: number) => (z < 0 ? rail(y) : z)
const P = (y: number, z: number, s: number): V3 => [XC + s * w(y, z), y, z]
for (let i = 0; i < ys.length - 1; i++) {
  const a = ys[i], b = ys[i + 1]
  for (const [z0, z1, part] of bands) {
    for (const s of [1, -1]) {
      const A = P(a, zl(a, z0), s), B = P(b, zl(b, z0), s), C = P(b, zl(b, z1), s), D = P(a, zl(a, z1), s)
      if (s > 0) part.quad(A, B, C, D)
      else part.quad(B, A, D, C)
    }
  }
  // bulwarks inside, rail cap and deck
  for (const s of [1, -1]) {
    const ia = Math.max(0, w(a, rail(a)) - 0.35), ib = Math.max(0, w(b, rail(b)) - 0.35)
    const A: V3 = [XC + s * ia, a, DECK], B: V3 = [XC + s * ib, b, DECK], C: V3 = [XC + s * ib, b, rail(b)], D: V3 = [XC + s * ia, a, rail(a)]
    if (s > 0) hull.quad(B, A, D, C)
    else hull.quad(A, B, C, D)
    const E: V3 = P(a, rail(a), s), F: V3 = P(b, rail(b), s)
    if (s > 0) hull.quad(C, D, E, F)
    else hull.quad(D, C, F, E)
  }
  const ia = Math.max(0, w(a, rail(a)) - 0.35), ib = Math.max(0, w(b, rail(b)) - 0.35)
  wood.quad([XC - ia, a, DECK], [XC + ia, a, DECK], [XC + ib, b, DECK], [XC - ib, b, DECK])
}
// the transom: bands across the stern, and its windows
{
  const y = YS, fan = (z0: number, z1: number, part: Part) => {
    const a: V3 = [XC - w(y, z0), y, z0], b: V3 = [XC + w(y, z0), y, z0], c: V3 = [XC + w(y, z1), y, z1], d: V3 = [XC - w(y, z1), y, z1]
    part.quad(a, b, c, d)
  }
  fan(0, 0.4, copper); fan(0.4, 2.6, hull); fan(2.6, 4.1, white); fan(4.1, 4.9, hull); fan(4.9, 5.2, white); fan(5.2, 6.6, hull); fan(6.6, 6.9, white); fan(6.9, rail(y), hull)
  for (let k = -2; k <= 2; k++) {
    const x = XC + k * 1.55
    white.quad([x - 0.6, y - 0.04, 5.3], [x + 0.6, y - 0.04, 5.3], [x + 0.6, y - 0.04, 6.5], [x - 0.6, y - 0.04, 6.5])
    win.quad([x - 0.42, y - 0.08, 5.45], [x + 0.42, y - 0.08, 5.45], [x + 0.42, y - 0.08, 6.35], [x - 0.42, y - 0.08, 6.35])
  }
}
// gunports: fifteen a side in the white stripe, black squares
for (let k = 0; k < 15; k++) {
  const yc = -24.5 + k * 3.05, h = 0.45
  for (const s of [1, -1]) {
    const pt = (y: number, z: number): V3 => [XC + s * (w(y, z) + 0.06), y, z]
    const A = pt(yc - h, 2.9), B = pt(yc + h, 2.9), C = pt(yc + h, 3.85), D = pt(yc - h, 3.85)
    if (s > 0) hull.quad(A, B, C, D)
    else hull.quad(B, A, D, C)
  }
}

// ── Spars ──
/** A tapered round spar from a to b, radii r0 → r1, closed at both ends. */
function spar(p: Part, a: V3, b: V3, r0: number, r1: number, n = 6) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const e1n: V3 = [u[1] * ref[2] - u[2] * ref[1], u[2] * ref[0] - u[0] * ref[2], u[0] * ref[1] - u[1] * ref[0]]
  const l1 = Math.hypot(...e1n), e1: V3 = [e1n[0] / l1, e1n[1] / l1, e1n[2] / l1]
  const e2: V3 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]]
  const ring = (c: V3, r: number) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, cs = Math.cos(t) * r, sn = Math.sin(t) * r
    return [c[0] + e1[0] * cs + e2[0] * sn, c[1] + e1[1] * cs + e2[1] * sn, c[2] + e1[2] * cs + e2[2] * sn] as V3
  })
  const A = ring(a, r0), B = ring(b, r1)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad(A[i], A[j], B[j], B[i])
  }
  for (let i = 1; i < n - 1; i++) {
    p.tri(A[0], A[i + 1], A[i])
    p.tri(B[0], B[i], B[i + 1])
  }
}
const line = (a: V3, b: V3, r = 0.13) => spar(hull, a, b, r, r, 4)
function plate(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  p.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
  p.quad([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0])
  p.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1])
  p.quad([x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1])
  p.quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1])
  p.quad([x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1])
}

type Mast = { y: number; k: number }
/** One square-rigged mast; k scales its heights and spans from the main's. */
function mast({ y, k }: Mast) {
  const X = XC, H = (z: number) => DECK + (z - DECK) * k
  const top = H(25), tmHead = H(39.5), truck = H(57)
  // lower mast (pale), its top, the topmast and the topgallant/royal pole (wood)
  spar(white, [X, y, DECK - 0.1], [X, y, top + 1.6], 0.55 * k, 0.45 * k, 8)
  plate(hull, X - 2.4 * k, X + 2.4 * k, y - 1.7 * k, y + 1.4 * k, top, top + 0.35)
  spar(hull, [X, y + 0.75 * k, top - 0.5], [X, y + 0.75 * k, top + 1.8], 0.5 * k, 0.5 * k, 6) // the cap's doubling
  spar(wood, [X, y + 0.75 * k, top], [X, y + 0.75 * k, tmHead + 1.2], 0.36 * k, 0.28 * k, 6)
  plate(hull, X - 1.4 * k, X + 1.4 * k, y + 0.1, y + 1.4 * k, tmHead, tmHead + 0.25) // crosstrees
  spar(wood, [X, y + 1.3 * k, tmHead - 1], [X, y + 1.3 * k, truck], 0.22 * k, 0.1, 6)
  spar(hull, [X, y + 1.3 * k, truck], [X, y + 1.3 * k, truck + 0.45], 0.26, 0.26, 6) // the truck
  // yards: course, topsail, topgallant, royal; furled sails on the first three
  const yards: Array<[number, number, number, boolean]> = [
    [H(22.5), 14.5, 0.36, true], [H(33), 11.5, 0.3, true], [H(43.5), 7.6, 0.22, true], [H(49.5), 5.0, 0.16, false],
  ]
  for (const [z, half, r, furled] of yards) {
    const hk = half * k, yy = y + (z > tmHead ? 1.3 * k : z > top ? 0.75 * k : 0) - 0.6
    spar(hull, [X, yy, z], [X + hk, yy, z], r * 1.1, r * 0.5, 6)
    spar(hull, [X, yy, z], [X - hk, yy, z], r * 1.1, r * 0.5, 6)
    if (furled) {
      spar(canvas, [X + 0.3, yy, z + r + 0.12], [X + hk * 0.82, yy, z + r + 0.08], r * 1.0, r * 0.6, 5)
      spar(canvas, [X - 0.3, yy, z + r + 0.12], [X - hk * 0.82, yy, z + r + 0.08], r * 1.0, r * 0.6, 5)
    }
  }
  // shrouds: three a side to the top, two a side from the top's rim to the topmast head
  for (const s of [1, -1]) {
    for (const dy of [-2.6, -1.0, 0.6].map((v) => v * k)) {
      const yh = y + dy
      line([X + s * (w(yh, rail(yh)) + 0.25), yh, rail(yh) - 0.3], [X + s * 0.6 * k, y, top - 0.4])
    }
    for (const dy of [-1.2, 0.3].map((v) => v * k)) line([X + s * 2.3 * k, y + dy, top + 0.3], [X + s * 0.3, y + 0.75 * k, tmHead], 0.1)
    // a backstay from the topgallant head down to the side, aft of the mast
    const yb = y - 6 * k
    line([X + s * (w(yb, rail(yb)) + 0.2), yb, rail(yb) - 0.3], [X + s * 0.2, y + 1.3 * k, H(46)], 0.1)
  }
  return { top, tmHead, tg: H(46), truck }
}
const fore = mast({ y: 16, k: 0.9 }), main = mast({ y: -9, k: 1 }), miz = mast({ y: -21, k: 0.79 })

// bowsprit and jibboom, rising about 20° from the stem
const BS0: V3 = [XC, YB - 4, DECK + 1.6], BS1: V3 = [XC, YB + 15, 14.0], JB1: V3 = [XC, YB + 26, 18.4]
spar(white, BS0, BS1, 0.5, 0.36, 8)
spar(wood, [XC, YB + 12, 13.0], JB1, 0.26, 0.12, 6)
spar(hull, [XC, YB + 15, 14.2], [XC, YB + 15, 10.6], 0.15, 0.12, 4) // dolphin striker
// stays: forestays to the bowsprit and jibboom, the main and mizzen stays forward
line([XC, 16, fore.top], [XC, YB + 12, 13.0])
line([XC, 16.7, fore.tmHead], [XC, YB + 22, 16.9], 0.11)
line([XC, 17.2, fore.tg], JB1, 0.09)
line([XC, -9, main.top], [XC, 15.4, DECK + 1.2])
line([XC, -8.2, main.tmHead], [XC, 16, fore.top + 0.5], 0.11)
line([XC, -21, miz.top], [XC, -9.6, DECK + 5])
line([XC, -20.4, miz.tmHead], [XC, -9, main.top + 0.6], 0.1)
// the bob-stay and the spanker boom and gaff over the stern
line([XC, YB + 15, 10.6], [XC, YB, 1.2], 0.12)
spar(wood, [XC, -21.5, DECK + 3.2], [XC, YS - 7.5, DECK + 3.6], 0.26, 0.2, 6)
spar(wood, [XC, -21.5, miz.top - 2.5], [XC, YS - 1, miz.top + 1.5], 0.2, 0.14, 6)
spar(canvas, [XC, -22.5, DECK + 3.65], [XC, YS - 5.5, DECK + 3.95], 0.34, 0.26, 5)

// ── Boats in davits: two at the quarters, one over the stern ──
function boat(cx: number, cy: number, z: number, L: number, alongX = false) {
  const half = L / 2, bw = L * 0.13
  const prof = [-1, -0.7, 0, 0.7, 1].map((t) => [t * half, bw * Math.sqrt(1 - Math.min(0.97, t * t))] as [number, number])
  const pt = (a: number, b: number, zz: number): V3 => (alongX ? [cx + a, cy + b, zz] : [cx + b, cy + a, zz])
  for (let i = 0; i < prof.length - 1; i++) {
    const [a0, b0] = prof[i], [a1, b1] = prof[i + 1]
    for (const s of [1, -1]) {
      const A = pt(a0, s * b0, z + 1.0), B = pt(a1, s * b1, z + 1.0), C = pt(a1, s * b1 * 0.6, z), D = pt(a0, s * b0 * 0.6, z)
      const g = (s > 0) !== alongX
      if (g) white.quad(D, C, B, A)
      else white.quad(A, B, C, D)
    }
    const T = [pt(a0, -b0, z + 1.0), pt(a0, b0, z + 1.0), pt(a1, b1, z + 1.0), pt(a1, -b1, z + 1.0)]
    if (alongX) white.quad(T[1], T[0], T[3], T[2])
    else white.quad(T[0], T[1], T[2], T[3])
  }
}
for (const s of [1, -1]) {
  const x = XC + s * (w(-26, rail(-26)) + 1.3)
  boat(x, -26, 6.6, 7.5)
  line([XC + s * (w(-28.5, rail(-28.5)) - 0.1), -28.5, rail(-28.5)], [x, -28.5, 8.6], 0.12)
  line([XC + s * (w(-23.5, rail(-23.5)) - 0.1), -23.5, rail(-23.5)], [x, -23.5, 8.6], 0.12)
}
boat(XC, YS - 2.0, 7.0, 8.5, true)
for (const s of [1, -1]) line([XC + s * 3.2, YS + 0.3, rail(YS)], [XC + s * 3.4, YS - 2.0, 9.0], 0.12)

const lit = (p: V3, n: V3) => (p[2] < 8 && Math.abs(n[2]) < 0.7 ? 0.7 : 0.2)
await save('bos-uss-constitution', 'USS Constitution', [
  { part: hull, material: { ...finish('uc-black', 0x4a4f57), floodlight: lit } },
  { part: white, material: { ...finish('uc-white', 0xf1ece2), floodlight: lit } },
  { part: copper, material: finish('uc-copper', 0xa05a43) },
  { part: wood, material: finish('uc-wood', 0xb09d7e) },
  { part: canvas, material: finish('uc-canvas', 0xe9dfcb) },
  { part: win, material: PALETTE.window },
], { height: 57.5, anchor: [42.3724353, -71.0565311], bearing: 122.5 }, 6500)
