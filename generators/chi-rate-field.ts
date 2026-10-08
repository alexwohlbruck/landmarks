/**
 * Rate Field (Guaranteed Rate Field, the second Comiskey Park), Chicago —
 * procedural, CC0-1.0, no textures.
 * bun generators/chi-rate-field.ts
 *
 * Map frame: x across the diamond, y from centre field towards home plate,
 * z up, metres. Placed at bearing 308°, so +y points from centre field to
 * home plate (north-west). The anchor (-87.633696, 41.829874) is the area
 * centroid of the outer ring of the building multipolygon relation/8167350.
 * The park is symmetrical about the home-to-centre axis, so every ring is
 * measured along rays from a point on that axis and averaged with its
 * mirror image; the only asymmetric part is the long ramp building on the
 * Dan Ryan side (way/1285755804), drawn where it stands.
 *
 * Evidence
 * - OSM (measured): relation/8167350 (outer ring = the park's outline, inner
 *   ring = the field wall); way/1285778036 (the upper deck's flat roof, a
 *   15 m band from the left-field to the right-field end); the ramp and stair
 *   towers way/1285755804, way/1285755828, way/1285755829, way/1285778007,
 *   way/1285778008.
 * - Published (Wikipedia, ballparksofbaseball.com): opened 1991 (HOK); top
 *   row of the upper deck originally 130 ft (40 m) above the field; in 2004
 *   the top eight rows were removed and a flat roof put up 20 ft (6 m) over
 *   the seats, covering 13 of the remaining 21 rows, on black steel trusses,
 *   with a white-and-black screen wall behind the top row; seats forest
 *   green since 2006; centre-field board 60 x 134 ft (18 x 41 m, 2016) under
 *   the pinwheels of the "exploding scoreboard"; light towers in the
 *   outfield ("left-center", "far left" and two more).
 * - Photos (Wikimedia Commons): Another Believer (CC BY-SA 4.0) "Chicago,
 *   Illinois, U.S. (2023)" 053, 054, 056, 062, 066, 073; CosmicKanan (CC BY-SA
 *   4.0) "U.S. Cellular Field in Chicago, Illinois"; Zakarie Faibis (CC BY-SA
 *   4.0) "Chicago White Sox-New York Mets Guaranteed Rate Field 23"; Alfred
 *   Twu (CC0) "18-chicago-IIT-whitesox-stadium" (aerial); Mapillary street
 *   views from 35th Street and the south.
 * - USGS NAIP orthophoto (public domain): plan, the roof's grey, the shadows
 *   of the two light frames on the third-base roof.
 *
 * Estimated
 * - Section: facade 28 m, upper deck from 22 m at its front to 35 m at the
 *   top row (the published 40 m less the eight rows), roof underside 39.5 m;
 *   lower deck to 14 m; suite level 14 to 18 m. From the photos and the
 *   published heights.
 * - Roof light frames: four, two each side, placed from the NAIP shadows and
 *   mirrored; frames 18 x 9 m on 7 m legs, up to 57 m.
 * - Outfield light towers: four, 52 m, positions estimated from the photos
 *   (none shows all four together).
 * - Outfield stands to 10 m with the covered outer concourse at 15 m;
 *   scoreboard 15 to 35 m with the pinwheels to 42 m.
 * - Ramp towers 20 to 24 m.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { add, box, dot, fill, mul, prism, quad, rayHit, sweepSection, unit, type Ray, type XY } from './chi-wrigley-field'

const precast = new Part(), black = new Part(), seats = new Part(), roofg = new Part(), screen = new Part(), win = new Part()

// OSM rings in this frame.
const OUT: XY[] = [[-56.3,95.9],[-44.3,108.5],[-31.5,117.0],[-22.8,120.0],[-10.3,123.1],[-5.2,123.8],[1.6,123.2],[18.4,120.9],[30.7,116.4],[41.6,109.4],[53.3,98.3],[55.9,95.4],[58.8,92.2],[73.7,75.5],[84.9,61.4],[87.3,58.1],[89.7,54.8],[99.4,40.4],[108.9,24.4],[117.6,7.8],[121.1,-6.6],[121.0,-20.1],[117.1,-33.6],[113.3,-40.1],[110.6,-45.0],[113.1,-46.5],[112.4,-47.3],[110.0,-49.9],[106.7,-53.6],[86.8,-74.7],[84.8,-76.8],[74.0,-83.6],[71.8,-85.4],[61.1,-93.8],[58.6,-95.3],[52.0,-106.6],[44.3,-115.0],[30.5,-115.6],[15.1,-119.2],[9.5,-120],[5.5,-111.3],[-2.5,-111.3],[-13.6,-110.2],[-22.3,-108.6],[-34.2,-105.4],[-45.1,-101.2],[-55.9,-95.2],[-62.3,-90.8],[-66.8,-87.1],[-69.0,-85.4],[-69.7,-84.8],[-78.4,-77.0],[-81.0,-74.5],[-100.0,-55.8],[-107.2,-48.8],[-109.4,-45.2],[-114.2,-37.8],[-118.9,-24.0],[-119.7,-10.5],[-117.0,3.9],[-111.2,16.0],[-108.3,21.3],[-104.8,27.9],[-99.0,38.8],[-89.8,51.9],[-87.8,54.8],[-85.8,57.7],[-71.6,97.9],[-56.3,95.9]]
const INN: XY[] = [[-40.1,34.4],[-36.3,46.1],[-29.5,54.3],[-25.4,59.1],[-18.7,66.6],[-10.4,70.0],[-8.7,71.4],[-5.7,72.6],[-2.7,73.1],[-0.5,73.3],[3.0,72.7],[6.9,71.5],[8.9,70.1],[10.2,69.2],[17.5,66.9],[28.1,55.5],[39.3,42.8],[42.4,31.8],[51.9,18.5],[60.2,5.5],[65.5,-3.5],[71.2,-8.8],[71.6,-12.8],[74.9,-16.3],[78.3,-21.5],[67.0,-33.3],[63.8,-36.7],[56.5,-34.1],[48.6,-41.8],[44.2,-49.0],[40.0,-52.4],[34.6,-56.2],[28.5,-59.6],[19.6,-63.2],[16.0,-64.0],[14.0,-67.8],[5.0,-67.9],[-1.0,-68.1],[-10.1,-68.3],[-15.9,-63.6],[-25.0,-60.4],[-33.2,-56.1],[-41.2,-49.9],[-51.5,-49.1],[-62.0,-38.9],[-74.2,-19.3],[-72.0,-13.6],[-70.0,-11.7],[-63.6,-5.2],[-40.1,34.4]]
// The roof band (way/1285778036): its outer and inner edges, ends extended a
// little along their own line so the end rays find them.
const RO: XY[] = [[110,-50],[107.2,-43.5],[113.8,-31.8],[117.4,-19.3],[117.6,-5.8],[114.6,7.2],[101.7,29.7],[88.6,50.0],[71.9,72.0],[57.8,87.8],[48.0,98.1],[40.1,106.1],[29.2,113.3],[17.2,118.1],[3.8,120.3],[-8.0,119.9],[-20.2,117.5],[-31.9,112.5],[-41.9,105.4],[-50.7,96.2],[-68.8,75.0],[-79.8,60.5],[-88.4,46.7],[-102.2,25.3],[-112.9,2.8],[-115.6,-10.3],[-115.1,-23.2],[-111.3,-35.4],[-104.1,-47.3],[-108,-54]]
const RI: XY[] = [[-89,-45],[-91.8,-37.8],[-96.4,-29.8],[-100.3,-16.3],[-99.4,-6.4],[-96.6,2.9],[-91.2,13.3],[-76.3,38.8],[-65.6,54.4],[-59.3,63.3],[-43.7,81.4],[-35.8,89.9],[-31.5,93.4],[-28.2,96.3],[-24.0,99.0],[-19.8,101.5],[-11.2,104.3],[-1.8,105.4],[8.0,104.4],[17.3,101.8],[25.4,97.7],[32.9,91.9],[37.6,87.4],[57.5,65.7],[76.2,41.4],[88.7,22.4],[97.5,6.6],[100.8,-2.6],[102.3,-12.5],[101.2,-21.7],[97.4,-30.2],[94.1,-33.9],[91,-41]]

const C: XY = [0, 12]
const dirOf = (deg: number): XY => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
/** Distance from C to a ring along a bearing, averaged with its mirror image. */
const sym = (deg: number, poly: XY[], far = false) => {
  const a = rayHit(C, dirOf(deg), poly, far), b = rayHit(C, dirOf(180 - deg), poly, far)
  if (a == null || b == null) throw new Error(`miss at ${deg}`)
  return (a + b) / 2
}

// ---- Grandstand: the horseshoe under the roof, foul pole to foul pole -------
const G0 = -24, G1 = 204, NG = 46
const gRays: Ray[] = Array.from({ length: NG + 1 }, (_, i) => ({ o: C, d: dirOf(G0 + ((G1 - G0) * i) / NG) }))
const gT = gRays.map((_, i) => {
  const deg = G0 + ((G1 - G0) * i) / NG
  const tF = sym(deg, INN), tRi = sym(deg, RI), tRo = sym(deg, RO)
  return { tF, tRi, tRo, tO: tRo + 3 }
})
const FAC = 28, ROOF_U = 39.5, ROOF = 41.5
const secA = (k: number): XY[] => {
  const { tF, tRi, tO } = gT[k]
  const tUf = tRi - 7, tUb = tRi + 11, tLB = tRi - 4.5
  return [
    [tF, 0], [tO, 0], [tO, FAC - 0.5], [tO - 0.5, FAC], [tO - 2, FAC], [tO - 2, ROOF_U], [tUb, ROOF_U], [tUb, 35],
    [tUf, 22], [tUf, 18], [tLB, 18], [tLB, 14], [tF, 2.5],
  ]
}
// 0 bottom, 1 facade, 2 bevel, 3 ledge, 4 screen wall, 5 under the roof,
// 6 screen behind the top row, 7 upper deck, 8 deck fascia, 9 underside,
// 10 suites, 11 lower deck, 12 field wall.
const matA = [null, null, precast, precast, screen, black, screen, seats, black, black, win, seats, seats]
sweepSection(gRays, secA, (_, e) => matA[e], black)
const secB = (k: number): XY[] => {
  const { tRi, tO } = gT[k]
  return [[tRi, 37.6], [tRi + 1.2, 37.6], [tRi + 1.2, ROOF_U], [tO - 1, ROOF_U], [tO - 1, 38.6], [tO + 0.6, 38.6], [tO + 0.6, ROOF], [tRi, ROOF]]
}
sweepSection(gRays, secB, (_, e) => (e === 6 ? roofg : black), black)

// Facade bays: tall arched windows on the concourse levels, a band of
// windows under the 500 level, between precast piers.
const P = (r: Ray, t: number, z: number): V3 => [r.o[0] + r.d[0] * t, r.o[1] + r.d[1] * t, z]
for (let k = 0; k < NG; k++) {
  const a = P(gRays[k], gT[k].tO, 0), b = P(gRays[k + 1], gT[k + 1].tO, 0)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
  let out: V3 = [u[1], -u[0], 0]
  const mid: V3 = [(a[0] + b[0]) / 2 - C[0], (a[1] + b[1]) / 2 - C[1], 0]
  if (dot(out, mid) < 0) out = mul(out, -1)
  const v = (s: number, z: number): V3 => [a[0] + u[0] * s + out[0] * 0.05, a[1] + u[1] * s + out[1] * 0.05, z]
  quad(precast, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], FAC - 0.5], [a[0], a[1], FAC - 0.5]], out)
  // The screen wall's steel frame: a post at each bay line and a rail.
  {
    const c = P(gRays[k], gT[k].tO - 2, 0), e = P(gRays[k + 1], gT[k + 1].tO - 2, 0)
    const w = (f: number, z: number): V3 => [c[0] + (e[0] - c[0]) * f + out[0] * 0.06, c[1] + (e[1] - c[1]) * f + out[1] * 0.06, z]
    const pw = 0.9 / Math.hypot(e[0] - c[0], e[1] - c[1])
    quad(black, [w(0, FAC), w(pw, FAC), w(pw, ROOF_U), w(0, ROOF_U)], out)
    quad(black, [w(0, 33.4), w(1, 33.4), w(1, 34.2), w(0, 34.2)], out)
  }
  const deg = G0 + ((G1 - G0) * (k + 0.5)) / NG
  if (Math.abs(deg - 90) < 50) {
    // Behind home plate: the tall arched windows of the front facade.
    const r = L * 0.3, s0 = L / 2 - r, s1 = L / 2 + r, z0 = 4, z1 = 14
    quad(win, [v(s0, z0), v(s1, z0), v(s1, z1), v(s0, z1)], out)
    const seg = 8
    for (let j = 0; j < seg; j++) {
      const a0 = Math.PI - (j / seg) * Math.PI, a1 = Math.PI - ((j + 1) / seg) * Math.PI
      const p0 = v(L / 2 + r * Math.cos(a0), z1 + r * Math.sin(a0)), p1 = v(L / 2 + r * Math.cos(a1), z1 + r * Math.sin(a1))
      quad(win, [v(L / 2, z1), p0, p1, p1], out)
    }
    quad(win, [v(L * 0.14, 21.5), v(L * 0.86, 21.5), v(L * 0.86, 25.5), v(L * 0.14, 25.5)], out)
  } else {
    // Elsewhere the open ramp and concourse levels between the piers.
    for (const z0 of [5, 10.6, 16.2, 21.8]) quad(win, [v(L * 0.16, z0), v(L * 0.84, z0), v(L * 0.84, z0 + 3.8), v(L * 0.16, z0 + 3.8)], out)
  }
}

// ---- Outfield: lower stands, an open concourse, the covered outer concourse --
const O0 = G1, O1 = 360 + G0, NO = 30
const oRays: Ray[] = Array.from({ length: NO + 1 }, (_, i) => ({ o: C, d: dirOf(O0 + ((O1 - O0) * i) / NO) }))
const rawO = oRays.map((_, i) => sym(O0 + ((O1 - O0) * i) / NO, OUT, true))
const smO = rawO.map((_, i) => {
  let s = 0, n = 0
  for (let j = -2; j <= 2; j++) { const q = rawO[i + j]; if (q != null) { s += q; n++ } }
  return s / n
})
const oT = oRays.map((_, i) => ({ tF: sym(O0 + ((O1 - O0) * i) / NO, INN), tO: smO[i] }))
const OH = 10, OC = 15
const secC = (k: number): XY[] => {
  const { tF, tO } = oT[k]
  return [[tF, 0], [tO, 0], [tO, OC - 0.4], [tO - 0.4, OC], [tO - 12, OC], [tO - 12, OH], [tF + 16, OH], [tF, 3]]
}
// 0 bottom, 1 outer wall, 2 bevel, 3 concourse roof, 4 its inner face,
// 5 open concourse, 6 seats, 7 wall.
sweepSection(oRays, secC, (_, e) => [null, precast, precast, roofg, black, precast, seats, seats][e], precast)
for (let k = 0; k < NO; k++) {
  const a = P(oRays[k], oT[k].tO, 0), b = P(oRays[k + 1], oT[k + 1].tO, 0)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
  let out: V3 = [u[1], -u[0], 0]
  if (dot(out, [(a[0] + b[0]) / 2 - C[0], (a[1] + b[1]) / 2 - C[1], 0]) < 0) out = mul(out, -1)
  const v = (s: number, z: number): V3 => [a[0] + u[0] * s + out[0] * 0.05, a[1] + u[1] * s + out[1] * 0.05, z]
  if (L > 4) quad(win, [v(L * 0.18, 4.5), v(L * 0.82, 4.5), v(L * 0.82, 11.5), v(L * 0.18, 11.5)], out)
}

// ---- Ramp and stair towers ----------------------------------------------------
const towers: [XY[], number][] = [
  [[[-128.0,40.6],[-109.6,68.5],[-106.1,73.8],[-102.6,71.3],[-77.7,103.4],[-80.6,105.9],[-76.4,110.6],[-60.2,128.7],[-46.1,138.6],[-36.2,124.6],[-48.5,116.1],[-61.9,100.6],[-64.2,97.9],[-66.4,95.4],[-67.3,94.3],[-71.6,97.9],[-95.1,66.4],[-91.8,63.9],[-92.8,62.6],[-94.9,59.4],[-96.8,56.6],[-101.9,49.0],[-116.5,26.5],[-130.7,36.3]], 20],
  [[[121.1,-6.6],[138.3,-6.7],[138.2,-21.9],[133.4,-40.2],[128.0,-49.5],[125.9,-53.2],[113.1,-46.5],[110.6,-45.0],[113.3,-40.1],[117.1,-33.6],[121.0,-20.1]], 24],
  [[[-121.1,-6.6],[-121.0,-20.1],[-117.1,-33.6],[-113.3,-40.1],[-110.6,-45.0],[-113.1,-46.5],[-125.9,-53.2],[-128.0,-49.5],[-133.4,-40.2],[-138.2,-21.9],[-138.3,-6.7]], 24],
  [[[74.0,-83.6],[80.4,-92.4],[79.0,-93.5],[65.1,-104.2],[59.9,-96.4],[61.9,-94.8],[61.1,-93.8],[71.8,-85.4]], 16],
  [[[-74.0,-83.6],[-71.8,-85.4],[-61.1,-93.8],[-61.9,-94.8],[-59.9,-96.4],[-65.1,-104.2],[-79.0,-93.5],[-80.4,-92.4]], 16],
]
for (const [ring, h] of towers) {
  prism(precast, ring, 0, h - 0.6, null)
  // A soft lip, then the roof.
  const n = ring.length
  let cx = 0, cy = 0
  ring.forEach(([x, y]) => { cx += x / n; cy += y / n })
  const inset = ring.map(([x, y]) => { const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy); return [x - (dx / l) * 0.5, y - (dy / l) * 0.5] as XY })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const o: V3 = [(ring[i][0] + ring[j][0]) / 2 - cx, (ring[i][1] + ring[j][1]) / 2 - cy, 0.8]
    quad(precast, [[ring[i][0], ring[i][1], h - 0.6], [ring[j][0], ring[j][1], h - 0.6], [inset[j][0], inset[j][1], h], [inset[i][0], inset[i][1], h]], o)
  }
  fill(roofg, inset.map(([x, y]) => [x, y, h] as V3), inset, [0, 0, 1])
  // Window slots on the long faces.
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 12) continue
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    let o: V3 = [u[1], -u[0], 0]
    if (dot(o, [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]) < 0) o = mul(o, -1)
    const W = (s: number, z: number): V3 => [a[0] + u[0] * s + o[0] * 0.05, a[1] + u[1] * s + o[1] * 0.05, z]
    const m = Math.min(4, L * 0.15)
    for (const [z0, z1] of [[4, h * 0.45], [h * 0.55, h - 3]]) quad(win, [W(m, z0), W(L - m, z0), W(L - m, z1), W(m, z1)], o)
  }
}

// ---- Light frames ----------------------------------------------------------------
/** A black lattice light bank on legs, its lamp face (pale) turned to `aim`. */
function lights(base: XY, z0: number, zb: number, W: number, H: number, aim: XY) {
  const f = unit([aim[0] - base[0], aim[1] - base[1], 0])
  const s: V3 = [-f[1], f[0], 0]
  const tilt = (15 * Math.PI) / 180
  const fwd: V3 = add(mul(f, Math.cos(tilt)), [0, 0, -Math.sin(tilt)])
  const up: V3 = add(mul(f, Math.sin(tilt)), [0, 0, Math.cos(tilt)])
  const c: V3 = [base[0], base[1], zb + H / 2]
  box(black, c, [s, fwd, up], [W / 2, 0.6, H / 2])
  const F = (a: number, b: number): V3 => add(add(add(c, mul(fwd, 0.65)), mul(s, a)), mul(up, b))
  quad(precast, [F(-W / 2 + 0.6, -H / 2 + 0.6), F(W / 2 - 0.6, -H / 2 + 0.6), F(W / 2 - 0.6, H / 2 - 0.6), F(-W / 2 + 0.6, H / 2 - 0.6)], fwd)
  for (const e of [-1, 1]) box(black, [base[0] + s[0] * e * W * 0.3, base[1] + s[1] * e * W * 0.3, (z0 + zb + 0.5) / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.4, 0.4, (zb + 0.5 - z0) / 2], true)
}
const HOME: XY = [0, 55]
for (const sx of [-1, 1]) {
  lights([sx * 50.3, 92], ROOF, ROOF + 7, 18, 9, [0, 0])
  lights([sx * 88.2, 42.7], ROOF, ROOF + 7, 18, 9, [0, 0])
}
// Outfield towers: a tapering black mast with its bank turned to home plate.
for (const deg of [-52, -77, -103, -128]) {
  const i = Math.round(((deg + 360 - O0) / (O1 - O0)) * NO)
  const t = oT[i].tO - 5
  const p: XY = [C[0] + Math.cos((deg * Math.PI) / 180) * t, C[1] + Math.sin((deg * Math.PI) / 180) * t]
  const f = unit([HOME[0] - p[0], HOME[1] - p[1], 0]), s: V3 = [-f[1], f[0], 0]
  const ring = (h: number, z: number): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [p[0] + s[0] * a * h + f[0] * b * h, p[1] + s[1] * a * h + f[1] * b * h, z] as V3)
  const r0 = ring(1.3, OC), r1 = ring(0.75, 46)
  for (let e = 0; e < 4; e++) {
    const g = (e + 1) % 4
    const o = sub(add(r0[e], r0[g]), [2 * p[0], 2 * p[1], 2 * OC])
    quad(black, [r0[e], r0[g], r1[g], r1[e]], [o[0], o[1], 0])
  }
  lights(p, 46, 46.5, 10, 6, HOME)
}

// ---- Centre-field scoreboard with the pinwheels ------------------------------------
{
  const y = -90, W = 43, z0 = 15, z1 = 35, D = 3
  box(black, [0, y - D / 2, (z0 + z1) / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [W / 2, D / 2, (z1 - z0) / 2])
  const S = (x: number, z: number): V3 => [x, y + 0.06, z]
  quad(win, [S(-20.5, 16), S(20.5, 16), S(20.5, 34), S(-20.5, 34)], [0, 1, 0])
  for (const x of [-13, 13]) box(black, [x, y - D / 2, (OH + z0) / 2], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [1.2, 1.2, (z0 - OH) / 2], true)
  // Seven pinwheels on posts along the top.
  for (let i = 0; i < 7; i++) {
    const x = -18 + i * 6
    box(black, [x, y - D / 2, z1 + 2.5], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [0.35, 0.35, 2.5], true)
    const n = 12, R = 2.1, zc = z1 + 5.6
    const ring: XY[] = Array.from({ length: n }, (_, j) => [x + R * Math.cos((j * 2 * Math.PI) / n), zc + R * Math.sin((j * 2 * Math.PI) / n)])
    const yf = y - D / 2 + 0.4
    for (const [yy, hint] of [[yf, 1], [yf - 0.8, -1]] as [number, number][]) fill(win, ring.map(([a, b]) => [a, yy, b] as V3), ring, [0, hint, 0])
    for (let j = 0; j < n; j++) {
      const a = ring[j], b = ring[(j + 1) % n]
      quad(black, [[a[0], yf, a[1]], [b[0], yf, b[1]], [b[0], yf - 0.8, b[1]], [a[0], yf - 0.8, a[1]]], [(a[0] + b[0]) / 2 - x, 0, (a[1] + b[1]) / 2 - zc])
    }
  }
}

// ---- Write -------------------------------------------------------------------------
// Palette (STYLE.md): the precast is the park's warm pinkish tan, pulled to the
// palette's lightness; the black steel of the roof trusses, deck fascias and
// light towers stays at the charcoal floor because the black-and-green
// scheme is the 2004 renovation's whole look; forest-green seats, softened.
// The roof is `roof`, the translucent screen wall behind the upper deck,
// in its black steel frame, `glass`, suites, facade windows, the scoreboard screen and the pinwheels
// `window`.
const parts = [
  { part: precast, material: finish('sox-precast', 0xdcc7b3) },
  { part: black, material: finish('sox-black', 0x4a4f57) },
  { part: seats, material: finish('sox-green', 0x4f7c60) },
  { part: roofg, material: PALETTE.roof },
  { part: screen, material: PALETTE.glass },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(14), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Rate Field', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 308, osm: 'relation/8167350',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/chi-rate-field.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
void cross
