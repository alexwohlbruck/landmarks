/**
 * National Stadium, Singapore (Singapore Sports Hub): original procedural
 * geometry, CC0-1.0, no textures.  bun generators/singapore-national-stadium.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/singapore-national-stadium.glb, the low model (<= 6,500 triangles);
 * - models/singapore-national-stadium.detail.glb, drawn from zoom 16
 *   (<= 40,000): twice the dome's ribs, the secondary lattice between them,
 *   ring beams, the mouth's arch truss as an open truss, stepped tiers.
 *
 * Map frame: x east, y north, z up, metres, built turned to BEARING 50: the
 * model's +y runs along the pitch and the retractable roof's track to the
 * north-east, and the open "mouth" of the dome faces -y (south-west, towards
 * the Kallang Basin and the city). Anchor = the centre of the dome's rings
 * (circle fits to the 21 OSM dome parts, all within 0.5 m of one another;
 * the outline's area centroid is 5.7 m east of it because of the podium's
 * eastern bulge): lng 103.874296, lat 1.304421.
 *
 * Identity, in order: the 310 m shallow steel dome over the whole bowl; the
 * retractable roof, two shells that close over the crown as a raised white
 * pair of leaves (modelled closed, as in four of the seven exterior photos: p3, p5,
 * p7, p9; open in p1, p2, p10); the big white diagonal ribs crossing the dome
 * in a diagrid; the open lattice band round the dome's foot, white ribs over
 * the dark concourse behind; the great open mouth on the south-west end with
 * its arch truss; the dark screened podium; red seats.
 *
 * Evidence
 *  - OSM (measured in this frame): the outline way/182827369 (leisure=stadium,
 *    building, height 10, 2 levels, Q4201688) is the podium, a near circle of
 *    radius 154-165 m round the dome centre; 21 building:part rings
 *    (way/530727673 ... 530727727) step the dome from min_height 12 at radius
 *    148.8 m to 74-77 m at 55-63 m radius, two parts at 76-80 m being the
 *    parked roof shells. Every ring has a gap centred on compass 230: 24 deg
 *    (62 m) wide at the foot, widening to 41 deg (73 m) at radius 103 m: the
 *    mouth, and (open) the roof track. The dome profile (DOME below) is the
 *    rings' min_height at each ring's fitted outer radius.
 *  - Published: en.wikipedia "National Stadium, Singapore": 83 m tall steel
 *    dome, the largest dome structure; capacity 55,000; the lowest tier moves
 *    over the track; the retractable roof is insulated metal with LED
 *    lighting. Span 310 m (Sports Hub fact sheets, widely quoted).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - p1: Dietmar Rabich, "Singapore (SG), National Stadium -- 2019 --
 *      4721.jpg", CC BY-SA 4.0, from Marina Bay Sands (south-west), roof
 *      open. https://commons.wikimedia.org/wiki/File:Singapore_(SG),_National_Stadium_--_2019_--_4721.jpg
 *    - p2: Dietmar Rabich, "Singapore (SG), View from Marina Bay Sands,
 *      Singapore Flyer -- 2019 -- 4720.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Singapore_(SG),_View_from_Marina_Bay_Sands,_Singapore_Flyer_--_2019_--_4720.jpg
 *    - p3: CEphoto, Uwe Aranas, "Singapore Singapore-Sports-Hub-with-National-
 *      Stadium-01.jpg", CC BY-SA 3.0, from the south-west, roof closed: the
 *      pillow, mouth, ribs, lattice band, podium.
 *      https://commons.wikimedia.org/wiki/File:Singapore_Singapore-Sports-Hub-with-National-Stadium-01.jpg
 *    - p4: Robertsky, "Interior of National Stadium, Singapore, 2023.jpg",
 *      CC BY-SA 4.0: red seats with white flecks, the mouth from inside.
 *      https://commons.wikimedia.org/wiki/File:Interior_of_National_Stadium,_Singapore,_2023.jpg
 *    - p5: Exec8, "Singapore National Stadium from Kallang Footbridge.jpg",
 *      CC BY-SA 4.0: the side: podium, lattice band, ribs, raised shell.
 *      https://commons.wikimedia.org/wiki/File:Singapore_National_Stadium_from_Kallang_Footbridge.jpg
 *    - p6: Exec8, "Retractable Roof of Singapore National Stadium.jpg",
 *      CC BY-SA 4.0. https://commons.wikimedia.org/wiki/File:Retractable_Roof_of_Singapore_National_Stadium.jpg
 *    - p7: Mike Cartmell, "Bridge and stadium (27276460206).jpg", CC BY 2.0.
 *      https://commons.wikimedia.org/wiki/File:Bridge_and_stadium_(27276460206).jpg
 *    - p9: Deoma12, "New Singapore National Stadium.JPG", CC BY-SA 3.0, from
 *      across the basin, head on to the mouth.
 *      https://commons.wikimedia.org/wiki/File:New_Singapore_National_Stadium.JPG
 *    - p10: Exec8, "Inside the Singapore National Stadium.jpg", CC BY-SA 4.0:
 *      tiers, the roof slot along the pitch.
 *      https://commons.wikimedia.org/wiki/File:Inside_the_Singapore_National_Stadium.jpg
 *  No lidar or aerial orthophoto (outside the US); no commercial imagery.
 *
 * Numbers: dome profile measured: each OSM ring's height tag at its fitted
 * outer radius (the stepped rings' upper envelope), from 12 m at the foot to
 * a crown of 80.5 m; the leaves' lobes reach 83.8 m, against the published
 * 83 m. Podium 12 m (OSM says 10 m and 2 levels; p5 shows three storeys of
 * dark screens and the OSM rings start at 12 m). Estimated from p3, p5, p9:
 * the mouth 72 m wide (OSM's gap is 62-73 m), up to the leaves' front edge
 * 106 m from the centre (about 55 m up); the leaves' plan, 124 m across and
 * 180 m along the axis with 14 m corners, each a low barrel (3 m) along the
 * axis that follows the dome's curve, meeting the other at a seam, 0.4 m
 * proud of the shell; the shell's metal in 7.5 deg longitudinal panels with
 * dark seams; the open lattice band from the foot in to 118 m (about 44 m up),
 * with three louvre rings; rib count (12 per direction, low; plus 24 finer
 * ones, detail), their 36 deg sweep, and their broadening over the band; the
 * big screen's dark back (32 x 12 m) at the south-west end, seen through the
 * mouth (p3, p4). Bowl: the inner edge a superellipse 112 x 180 m round the
 * track, three tiers with two box bands, cut to stay 6 m under the dome;
 * seats and box fronts drawn in shadowed tones, since under the closed roof
 * they are only ever seen in shade (p3): estimated from p4, p10.
 *
 * Doubts: the shells' exact plan and the seam between them; the ribs' real
 * pattern is denser and curved in plan; the podium's real gates and ramps
 * are left out; seats one red (the real ones carry a white fleck pattern).
 * Mapterhorn is z12 here and shows the bowl as a mound (surface model);
 * the field is at street level (about 1.5 m), elevation 0.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { beam, face, rayHit, se, strip, vadd, vmul, vsub } from './seoul-world-cup-stadium'
import { RAD, bar, obox, writeLods } from './melbourne-mcg'

const BEARING = 50
type XY = [number, number]

/** OSM outline way/182827369 relative to the dome centre, east/north metres. */
const OUTLINE_EN: XY[] = [[6.0, 158.4], [30.5, 156.7], [41.3, 156.0], [53.2, 152.8], [81.5, 141.0], [106.5, 124.3], [117.8, 114.1], [122.9, 108.8], [127.9, 103.1], [145.5, 77.4], [159.2, 43.2], [163.4, 23.1], [164.7, -5.3], [161.9, -28.7], [151.0, -61.9], [144.0, -76.6], [130.9, -96.5], [106.2, -121.7], [74.7, -141.2], [38.7, -152.6], [-6.7, -154.1], [-52.5, -146.3], [-55.1, -144.9], [-90.8, -125.3], [-112.2, -106.1], [-144.3, -54.5], [-150.6, -29.6], [-153.4, -18.2], [-153.4, -9.5], [-153.5, 20.7], [-151.2, 31.6], [-149.9, 37.6], [-150.1, 41.2], [-147.2, 50.7], [-141.9, 63.8], [-132.1, 82.9], [-113.4, 108.1], [-102.1, 120.2], [-98.3, 123.1], [-94.2, 125.9], [-75.7, 138.6], [-44.3, 152.6], [-20.8, 158.2]]
const toModel = ([e, n]: XY): XY => {
  const b = BEARING * RAD
  return [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)]
}
const OUTLINE = OUTLINE_EN.map(toModel).reverse() // counter-clockwise

/** Dome height at radius r: each OSM ring's height tag at its outer radius (the stepped rings' upper envelope), crown 80.5 under the leaves. */
const DOME: XY[] = [[0, 80.5], [30, 80.2], [55, 78.6], [62.7, 77], [69.7, 75], [76.6, 73], [82.9, 69], [88.9, 65.5], [93.9, 62], [98.9, 58.5], [103.4, 55], [107.9, 51.5], [111.9, 48], [115.9, 44.5], [120.4, 41], [124.8, 37.5], [129.3, 34], [133.8, 30.5], [137.8, 27], [141.5, 23.5], [144.8, 20], [148.8, 16.5], [152, 12]]
const RB = 152 // the dome's foot, on the podium
function domeZ(r: number) {
  if (r <= 0) return DOME[0][1]
  for (let i = 1; i < DOME.length; i++) {
    if (r <= DOME[i][0]) {
      const [r0, z0] = DOME[i - 1], [r1, z1] = DOME[i]
      // smoothstep-free: a quadratic blend through the neighbours keeps the profile round
      const t = (r - r0) / (r1 - r0)
      return z0 + (z1 - z0) * t
    }
  }
  return DOME[DOME.length - 1][1]
}
const PODIUM = 12 // OSM says 10; p5 shows the dark screens three storeys tall and the dome's foot at 12 m (OSM ring min_height)
const MOUTH_HW = 36 // the mouth's half width
const CAP_FRONT = -106, CAP_BACK = 74, CAP_HW = 62, CAP_R = 14, CAP_RISE = 0.4, LOBE = 3.0
const SEAM = 7.5 * RAD
const BAND_R = 118 // the open lattice band runs from the foot in to here

/** The shells' plan: a rounded rectangle, counter-clockwise. */
function capPoly(): XY[] {
  const out: XY[] = []
  const corners: [number, number, number][] = [[CAP_HW - CAP_R, CAP_FRONT + CAP_R, -90], [CAP_HW - CAP_R, CAP_BACK - CAP_R, 0], [-CAP_HW + CAP_R, CAP_BACK - CAP_R, 90], [-CAP_HW + CAP_R, CAP_FRONT + CAP_R, 180]]
  for (const [cx, cy, a0] of corners) for (let k = 0; k <= 6; k++) {
    const a = (a0 + (k * 90) / 6) * RAD
    out.push([cx + CAP_R * Math.cos(a), cy + CAP_R * Math.sin(a)])
  }
  return out
}
const CAP = capPoly()
const rCap = (th: number) => rayHit(CAP, th)
/** Where a ray leaves the mouth (Infinity when it never enters it). */
function rMouth(th: number) {
  const s = Math.sin(th), c = Math.cos(th)
  if (s >= -0.05) return 0
  return Math.abs(c) < 1e-6 ? Infinity : MOUTH_HW / Math.abs(c)
}
/** Inner end of the fixed dome along a ray. */
const rStart = (th: number) => Math.min(RB, Math.max(rCap(th) - 4, rMouth(th) >= rCap(th) ? rMouth(th) : 0)) // runs 4 m under the leaves
const inMouth = (x: number, y: number) => Math.abs(x) < MOUTH_HW && y < CAP_FRONT + 1
function inCap(x: number, y: number) {
  const r = Math.hypot(x, y)
  return r < rCap(Math.atan2(y, x)) + 1.5
}
const P = (r: number, th: number, dz = 0): V3 => [r * Math.cos(th), r * Math.sin(th), domeZ(r) + dz]
/** Surface normal of the dome at radius r, direction th. */
function dn(r: number, th: number): V3 {
  const dz = (domeZ(r + 0.5) - domeZ(r - 0.5)) / 1
  const l = Math.hypot(dz, 1)
  return [(-dz / l) * Math.cos(th), (-dz / l) * Math.sin(th), 1 / l]
}

function angles(n: number): number[] {
  const out: number[] = []
  for (let i = 0; i < n; i++) out.push(-Math.PI + (i / n) * 2 * Math.PI)
  // the exact angles where the mouth's edges reach the foot, so the edge closes cleanly
  const e = Math.acos(MOUTH_HW / RB)
  out.push(-e, -Math.PI + e)
  return [...new Set(out.map((a) => +a.toFixed(6)))].sort((a, b) => a - b)
}

function build(detail: boolean) {
  const metal = new Part(), white = new Part(), dark = new Part(), seats = new Part(), band = new Part(), shell = new Part()

  // --- the fixed dome, from the shells' edge (or the mouth's edge) out to the foot
  const TH = angles(detail ? 160 : 56)
  const fr = detail ? [0, 0.08, 0.17, 0.27, 0.38, 0.5, 0.62, 0.74, 0.86, 1] : [0, 0.2, 0.42, 0.66, 1]
  for (let i = 0; i < TH.length; i++) {
    const a = TH[i], b = TH[(i + 1) % TH.length] + (i === TH.length - 1 ? 2 * Math.PI : 0)
    const ra = rStart(a), rb = rStart(b)
    if (ra >= RB - 0.01 && rb >= RB - 0.01) continue
    // split each ray at the band's top so the two materials meet on a circle
    const ring = (r0: number) => {
      const out: number[] = []
      const inner = Math.min(r0, BAND_R)
      for (const t of fr) out.push(inner + (BAND_R - inner) * t)
      for (const t of [0.34, 0.67, 1]) out.push(BAND_R + (RB - BAND_R) * t)
      return out.map((r, k) => (r < r0 ? r0 : r)).map((r, k, arr) => r)
    }
    const A = ring(ra), B = ring(rb)
    for (let k = 0; k < A.length - 1; k++) {
      const p = [P(A[k], a), P(B[k], b), P(B[k + 1], b), P(A[k + 1], a)]
      if (A[k + 1] - A[k] < 1e-3 && B[k + 1] - B[k] < 1e-3) continue
      const part = (A[k] + A[k + 1]) / 2 >= BAND_R - 0.01 ? band : metal
      // the shell's metal is drawn in longitudinal panels, 7.5 deg wide: flat across, smooth along,
      // so the seams between them read as creases (p3, p5)
      const q = part === metal ? (Math.floor(((a + b) / 2) / SEAM) + 0.5) * SEAM : NaN
      const ns = part === metal ? [dn(A[k], q), dn(B[k], q), dn(B[k + 1], q), dn(A[k + 1], q)] : [dn(A[k], a), dn(B[k], b), dn(B[k + 1], b), dn(A[k + 1], a)]
      part.tri(p[0], p[1], p[2], undefined, undefined, undefined, [ns[0], ns[1], ns[2]])
      part.tri(p[0], p[2], p[3], undefined, undefined, undefined, [ns[0], ns[2], ns[3]])
    }
  }

  // the panel seams: narrow dark strips down the solid shell, every 15 deg (7.5 in detail)
  {
    const step = detail ? SEAM : 2 * SEAM, w = detail ? 0.5 : 0.8
    for (let th = -Math.PI + step / 2; th < Math.PI; th += step) {
      const r0 = Math.max(rStart(th), 0) + 0.5
      if (r0 >= BAND_R - 1) continue
      const rs: number[] = []
      const n = detail ? 8 : 3
      for (let k = 0; k <= n; k++) rs.push(r0 + ((BAND_R - r0) * k) / n)
      const side: V3 = [-Math.sin(th) * w / 2, Math.cos(th) * w / 2, 0]
      for (let k = 0; k < n; k++) {
        const a = P(rs[k], th, 0.12), b = P(rs[k + 1], th, 0.12)
        const x0 = Math.cos(th) * rs[k], y0 = Math.sin(th) * rs[k]
        if (inCap(x0, y0) || inMouth(x0, y0)) continue
        face(dark, [vadd(a, side), vsub(a, side), vsub(b, side), vadd(b, side)], dn((rs[k] + rs[k + 1]) / 2, th))
      }
    }
  }

  // --- the dome's underside, dark, seen through the mouth: a coarse shell 1.5 m under
  const UT = angles(detail ? 72 : 28)
  const pieces = (th: number): number[] => {
    const s = Math.sin(th), rm = rMouth(th), re = s < -0.05 ? -CAP_FRONT / -s : Infinity
    const [r1, r2] = rm > re ? [Math.min(re, RB), Math.min(rm, RB)] : [RB, RB]
    return [...[0, 0.3, 0.55, 0.78, 1].map((t) => r1 * t), ...[0, 0.5, 1].map((t) => r2 + (RB - r2) * t)]
  }
  for (let i = 0; i < UT.length; i++) {
    const a = UT[i], b = UT[(i + 1) % UT.length] + (i === UT.length - 1 ? 2 * Math.PI : 0)
    const A = pieces(a), B = pieces(b)
    for (let k = 0; k < A.length - 1; k++) {
      if (k === 4) continue // between the two pieces: the mouth
      if (A[k + 1] - A[k] < 1e-3 && B[k + 1] - B[k] < 1e-3) continue
      const p = [P(A[k], a, -1.5), P(B[k], b, -1.5), P(B[k + 1], b, -1.5), P(A[k + 1], a, -1.5)]
      const down = vmul(dn((A[k] + A[k + 1]) / 2, a), -1)
      if (A[k] > 1e-3) face(dark, [p[0], p[1], p[2]], down)
      face(dark, [p[0], p[2], p[3]], down)
    }
  }
  // the dome's cut edge along the mouth: a white fascia from the skin down to the underside
  for (const sgn of [-1, 1]) {
    const pts: V3[] = []
    for (let y = -Math.sqrt(RB * RB - MOUTH_HW * MOUTH_HW); y <= CAP_FRONT + 0.01; y += detail ? 2 : 4.2) pts.push([sgn * MOUTH_HW, y, domeZ(Math.hypot(MOUTH_HW, y))])
    pts.push([sgn * MOUTH_HW, CAP_FRONT, domeZ(Math.hypot(MOUTH_HW, CAP_FRONT))])
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], b = pts[k + 1]
      face(white, [a, b, vadd(b, [0, 0, -1.6]), vadd(a, [0, 0, -1.6])], [-sgn, 0, 0])
    }
  }

  // --- the retractable roof, closed: two leaves, each a low barrel along the axis that follows the
  // dome's curve, meeting at a seam on the axis and standing just proud of the fixed shell (p3, p5, p9)
  {
    const hw = (y: number) => {
      const d = Math.max(CAP_FRONT + CAP_R - y, y - (CAP_BACK - CAP_R), 0)
      return CAP_HW - CAP_R + Math.sqrt(Math.max(0, CAP_R * CAP_R - d * d))
    }
    const H = (x: number, y: number) => {
      const u = Math.min(1, Math.abs(x) / Math.max(1e-3, hw(y)))
      return domeZ(Math.hypot(x, y)) + CAP_RISE + LOBE * Math.pow(Math.max(0, Math.sin(Math.PI * (0.2 + 0.8 * u))), 0.9)
    }
    const nrmAt = (x: number, y: number): V3 => {
      const e = 0.4, hx = (H(x + e, y) - H(x - e, y)) / (2 * e), hy = (H(x, y + e) - H(x, y - e)) / (2 * e)
      const l = Math.hypot(hx, hy, 1)
      return [-hx / l, -hy / l, 1 / l]
    }
    const NY = detail ? 36 : 12, NU = detail ? 12 : 5
    const Y = (j: number) => CAP_FRONT + ((CAP_BACK - CAP_FRONT) * j) / NY
    for (const sg of [-1, 1]) {
      const G = (i: number, j: number): V3 => {
        const y = Y(j), x = (sg * hw(y) * i) / NU
        return [x, y, H(x, y)]
      }
      for (let i = 0; i < NU; i++) for (let j = 0; j < NY; j++) {
        const a = G(i, j), b = G(i + 1, j), c = G(i + 1, j + 1), d = G(i, j + 1)
        const N = (p: V3) => nrmAt(p[0], p[1])
        shell.tri(a, b, c, undefined, undefined, undefined, [N(a), N(b), N(c)])
        shell.tri(a, c, d, undefined, undefined, undefined, [N(a), N(c), N(d)])
      }
      // the lip round the leaf's outer edge and ends: a shadowed band down to the fixed shell
      const edge: V3[] = []
      for (let i = 0; i <= NU; i++) edge.push(G(i, 0))
      for (let j = 1; j <= NY; j++) edge.push(G(NU, j))
      for (let i = NU - 1; i >= 0; i--) edge.push(G(i, NY))
      for (let k = 0; k < edge.length - 1; k++) {
        const p = edge[k], q2 = edge[k + 1]
        const front = Math.abs(p[1] - CAP_FRONT) < 1e-6 && Math.abs(q2[1] - CAP_FRONT) < 1e-6
        const drop = (v: V3): V3 => [v[0], v[1], domeZ(Math.hypot(v[0], v[1])) - (front ? 1.6 : 0.4)]
        const m: V3 = [(p[0] + q2[0]) / 2, (p[1] + q2[1]) / 2, 0]
        face(front ? white : dark, [p, drop(p), drop(q2), q2], m)
      }
    }
    // the seam: a narrow raised rib along the axis
    const seam: V3[] = []
    for (let j = 0; j <= NY; j += detail ? 1 : 2) seam.push([0, Y(j), H(0, Y(j)) + 0.35])
    beam(white, seam, 1.6, 1.0)
  }

  // --- the big screen at the south-west end, its dark back seen through the mouth (p3, p4)
  obox(dark, [0, -131, 0], [1, 0, 0], [0, 1, 0], -16, 16, -1.5, 1.5, 19, 31, true)
  for (const x of [-10, 10]) bar(dark, [x, -131, 10], [x, -131, 19], 1.4, 1.4)

  // --- the mouth's arch truss under the shells' front edge
  {
    const y = CAP_FRONT - 0.5
    const zt = (x: number) => domeZ(Math.hypot(x, y)) - 1.8
    const span = MOUTH_HW + 1
    const top: V3[] = [], bot: V3[] = []
    const N = detail ? 16 : 8
    for (let i = 0; i <= N; i++) {
      const x = -span + (2 * span * i) / N
      top.push([x, y, zt(x)])
      bot.push([x, y, zt(x) - 4.5 - 2.5 * Math.cos((x / span) * Math.PI / 2)])
    }
    if (!detail) {
      beam(white, top, 2.6, 2.2, [0, 1, 0])
      beam(white, bot, 2.6, 2.2, [0, 1, 0])
      for (let i = 0; i <= N; i += 2) bar(white, top[i], bot[i], 1.6, 1.6, [0, 1, 0], false)
    } else {
      for (const dy of [-1.5, 1.5]) {
        beam(white, top.map((p) => vadd(p, [0, dy, 0])), 1.2, 1.2, [0, 1, 0])
        beam(white, bot.map((p) => vadd(p, [0, dy, 0])), 1.2, 1.2, [0, 1, 0])
        for (let i = 0; i <= N; i++) bar(white, vadd(top[i], [0, dy, 0]), vadd(bot[i], [0, dy, 0]), 0.8, 0.8, [0, 1, 0], false)
        for (let i = 0; i < N; i++) bar(white, vadd(i % 2 ? top[i] : bot[i], [0, dy, 0]), vadd(i % 2 ? bot[i + 1] : top[i + 1], [0, dy, 0]), 0.7, 0.7, [0, 1, 0], false)
      }
    }
  }

  // --- the white diagonal ribs over the fixed dome, a diagrid
  const ribs = (count: number, sweep: number, w: number, h: number, rStop: number, steps: number, phase: number) => {
    const r1 = 62
    for (const s of [-1, 1]) for (let k = 0; k < count; k++) {
      const th0 = ((k + phase) / count) * 2 * Math.PI
      let run: V3[] = []
      const flush = () => { if (run.length > 1) beam(white, run, w, h); run = [] }
      for (let i = 0; i <= steps; i++) {
        const r = RB - 0.5 - (RB - 0.5 - rStop) * (i / steps)
        const t = (RB - 0.5 - r) / (RB - 0.5 - r1)
        const th = th0 + s * sweep * t
        const x = r * Math.cos(th), y = r * Math.sin(th)
        if (inCap(x, y) || inMouth(x, y) || (y < 0 && Math.abs(x) < MOUTH_HW + w)) { flush(); continue }
        run.push(vadd(P(r, th), vmul(dn(r, th), h / 2 - 0.1)))
      }
      flush()
    }
  }
  ribs(12, 36 * RAD, 2.8, 1.5, 62, detail ? 30 : 9, 0.5)
  ribs(12, 36 * RAD, 5, 2.2, BAND_R - 3, detail ? 8 : 3, 0.5) // the ribs stand out as broad struts over the open band (p5)
  if (detail) ribs(24, 36 * RAD, 1.4, 0.9, 62, 30, 0) // the secondary lattice between the main ribs
  // the band's top ring beam and, in detail, the rings across the dome
  const ringBeam = (r: number, w: number, h: number, nseg: number) => {
    let run: V3[] = []
    const flush = () => { if (run.length > 1) beam(white, run, w, h); run = [] }
    for (let i = 0; i <= nseg; i++) {
      const th = -Math.PI / 2 + (i / nseg) * 2 * Math.PI
      const x = r * Math.cos(th), y = r * Math.sin(th)
      if (inCap(x, y) || (y < 0 && Math.abs(x) < MOUTH_HW + 1)) { flush(); continue }
      run.push(vadd(P(r, th), vmul(dn(r, th), h / 2 - 0.1)))
    }
    flush()
  }
  ringBeam(BAND_R, 2.6, 1.4, detail ? 96 : 40)
  ringBeam(RB - 1.2, 2.4, 1.4, detail ? 96 : 40)
  // the louvre rings across the open band (p5), white over the dark concourse behind
  for (const r of [127, 136, 144]) ringBeam(r, detail ? 1.8 : 2.2, 1.2, detail ? 96 : 32)
  if (detail) ringBeam(95, 1.4, 0.9, 96)

  // --- the podium: dark screened concourse, from the OSM outline in to the stands
  {
    const N = detail ? 120 : 60
    const RI = 138
    const outer: V3[] = [], outerTop: V3[] = [], inner: V3[] = [], innerTop: V3[] = []
    for (let i = 0; i < N; i++) {
      const th = (i / N) * 2 * Math.PI
      const ro = rayHit(OUTLINE, th)
      outer.push([ro * Math.cos(th), ro * Math.sin(th), 0]); outerTop.push([ro * Math.cos(th), ro * Math.sin(th), PODIUM])
      inner.push([RI * Math.cos(th), RI * Math.sin(th), 0]); innerTop.push([RI * Math.cos(th), RI * Math.sin(th), PODIUM])
    }
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      const m: V3 = [(outer[i][0] + outer[j][0]) / 2, (outer[i][1] + outer[j][1]) / 2, 0]
      face(dark, [outer[i], outer[j], outerTop[j], outerTop[i]], m)
      face(dark, [inner[j], inner[i], innerTop[i], innerTop[j]], vmul(m, -1))
      face(dark, [outerTop[i], outerTop[j], innerTop[j], innerTop[i]], [0, 0, 1])
      // the light concrete plinth under the dark screens (p5)
      const o = vmul(m, 0.08 / Math.hypot(m[0], m[1]))
      face(metal, [vadd(outer[i], o), vadd(outer[j], o), vadd(outerTop[j], vadd(o, [0, 0, 1.4 - PODIUM])), vadd(outerTop[i], vadd(o, [0, 0, 1.4 - PODIUM]))], m)
    }
  }

  // --- the bowl: three tiers with two box bands, cut to keep under the dome
  {
    const N = detail ? 96 : 36
    for (let i = 0; i < N; i++) {
      const prof = (th: number) => {
        const ri = se(th, 56, 90, 2.6)
        const pts: [number, number, Part][] = []
        const tierPts = (r0: number, z0: number, r1: number, z1: number, rows: number) => {
          if (!detail) { pts.push([r0, z0, seats]); return }
          for (let s = 0; s < rows; s++) {
            const ra = r0 + ((r1 - r0) * s) / rows
            pts.push([ra, z0 + ((z1 - z0) * s) / rows, dark])
            pts.push([ra, z0 + ((z1 - z0) * (s + 1)) / rows, seats])
          }
        }
        pts.push([ri - 0.5, 0, dark])
        tierPts(ri - 0.5, 1.2, ri + 22, 11, 6)
        pts.push([ri + 22, 11, dark]); pts.push([ri + 22, 14, dark])
        tierPts(ri + 25, 14, ri + 40, 23.5, 5)
        pts.push([ri + 40, 23.5, dark]); pts.push([ri + 40, 27, dark])
        // the upper tier rises at 0.6 until it comes within 6 m of the dome's underside
        let r1 = ri + 43
        while (r1 < 140 && 27 + 0.6 * (r1 + 1 - ri - 43) < domeZ(r1 + 1) - 6) r1 += 1
        tierPts(ri + 43, 27, Math.max(r1, ri + 43.5), 27 + 0.6 * (Math.max(r1, ri + 43.5) - ri - 43), 5)
        const rt = Math.max(r1, ri + 43.5), zt = 27 + 0.6 * (rt - ri - 43)
        pts.push([rt, zt, dark]); pts.push([rt + 0.1, PODIUM, dark])
        return pts.map(([r, z, part]) => [r * Math.cos(th), r * Math.sin(th), z, part] as [number, number, number, Part])
      }
      const a = (i / N) * 2 * Math.PI, b = ((i + 1) / N) * 2 * Math.PI
      const A = prof(a), B = prof(b)
      for (let k = 0; k < A.length - 1; k++) {
        const part = A[k][3]
        const p0: V3 = [A[k][0], A[k][1], A[k][2]], p1: V3 = [B[k][0], B[k][1], B[k][2]], p2: V3 = [B[k + 1][0], B[k + 1][1], B[k + 1][2]], p3: V3 = [A[k + 1][0], A[k + 1][1], A[k + 1][2]]
        // the surface faces the field and up
        const c: V3 = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2, 0]
        const L = Math.hypot(c[0], c[1])
        const dz = p3[2] - p0[2], dr = Math.hypot(p3[0], p3[1]) - Math.hypot(p0[0], p0[1])
        const nn: V3 = [(-c[0] / L) * dz, (-c[1] / L) * dz, dr]
        if (Math.hypot(...nn) < 1e-6) continue
        face(part, [p0, p1, p2, p3], nn)
      }
    }
  }

  const lit = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.1 : 0.35)
  return [
    { part: metal, material: finish('sns-dome', 0xa9b1b6) },
    { part: white, material: { ...finish('sns-white', 0xf1f2ef), floodlight: lit } },
    { part: dark, material: finish('sns-podium', 0x5c6266) },
    { part: seats, material: finish('sns-seats', 0x87443f) },
    { part: band, material: { ...PALETTE.window, color: 0x93a0aa } },
    { part: shell, material: finish('sns-shell', 0xd2d7da) },
  ]
}

if (import.meta.main)
  await writeLods('National Stadium, Singapore', { bearing: BEARING, elevation: 0, height: 82.6 }, [
    { file: 'singapore-national-stadium.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'singapore-national-stadium.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
