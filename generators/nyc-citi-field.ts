/**
 * Citi Field (2009), Queens: the Mets' ballpark. A red-brick and limestone
 * wall in the manner of Ebbets Field, two storeys of arches, swelling into the
 * curved front of the Jackie Robinson Rotunda behind home plate; behind it
 * the black steel stands with dark green seats under a thin canopy, the tall
 * black lattice light towers on the roof, the right-field porch and the big
 * centre-field scoreboard. Original procedural geometry, CC0-1.0.
 * bun generators/nyc-citi-field.ts
 *
 * Stadium rule (STYLE.md "Ground"): the stands, roofs, walls, towers and
 * boards only; the field, the bullpens' grass and the plazas are the map's.
 *
 * Frame: BEARING 0, x east, y north, z up, metres. Origin = area centroid of
 * the OSM outline way/604023701 (-73.845831, 40.757062). z = 0 is the street
 * and plaza round the ballpark, 3.1 m NAVD88 (lidar ground returns); the
 * field is about 1 m above it, so this is not a sunken bowl and elevation is 0.
 *
 * Evidence
 * - OSM way/604023701 (leisure=stadium, "Citi Field", Q1072882) and the
 *   buildings inside it: way/1445223372 (building=grandstand, the bowl),
 *   1445222220 (the rotunda block), 1445222222 (the third-base side),
 *   1445222221 and 604024892 (the right-field corner and porch), 1518492091
 *   (right-centre), 1553291644 (a shelter at the rotunda), and the parts
 *   1060517536 (Jackie Robinson Plaza) and 1553289790 (the Home Run Apple,
 *   inside the batter's-eye block). No heights in OSM.
 * - USGS 3DEP lidar NY_NewYorkCity (2017) at 1 m (/tmp/city/nyc/work/
 *   nyc-citi-field/lid.json), sampled on rays from (-5, 5) every 5 degrees.
 *   Heights above the street: the lower bowl from the field wall up to 4,
 *   a riser to 9 and a second tier to 11; the decks above from 16 at their
 *   front to 32; the canopy at 40, 9-10 m deep; the brick wall's top 28, the
 *   roofs behind it (widest at the rotunda) 25-28. The stands run from the
 *   left-field corner (100 degrees) round home plate (south-west) to right
 *   field (335). Right field: the porch stands rising from 13 to 22, the
 *   bullpens' roofs at 9, the buildings behind at 20-21 and 13. Centre field:
 *   the block round the batter's eye at 10, the scoreboard 53 m wide rising to
 *   54 (sign 56.5). Light towers to 57-60: one on each side of the rotunda,
 *   one in left field, a long one over the right-field porch (51-58).
 * - Published (Wikipedia): opened 2009, Populous (HOK Sport); exterior of
 *   brick, limestone, granite and cast stone recalling Ebbets Field; the
 *   rotunda honours Jackie Robinson; the 2016 video board is 175 by 60 ft
 *   (53 by 18 m).
 * - Photos (Wikimedia Commons, credits in /tmp/city/nyc/work/nyc-citi-field/
 *   photos/credits.txt): "Citi Field and Apple.JPG" (Richiek, CC BY-SA 3.0:
 *   the rotunda front, its two tiers of arches, the light towers either side);
 *   "Aerial Shot of Citi Field Opening Day April 13th 2009.jpg" (Malrite, CC
 *   BY-SA 3.0: the whole ballpark from the south, the pale roofs behind the
 *   brick, the black stands, the scoreboard and porch); "Citi Field August
 *   2021.jpg", "... 001.jpg", "... 003.jpg" (Kidfly182, CC BY-SA 4.0: the
 *   rotunda and the long brick sides, the right-field gate); "Citi Field
 *   facade.jpg" (lisatozzi, CC BY 2.0); "Etihad Park and Citi Field aerial
 *   view.jpg" and "... in September 2026.jpg" (Aude, CC BY-SA 4.0, from the
 *   east); "Citi Field NY Mets 202.jpg" (Zakarie Faibis, CC BY-SA 4.0, the
 *   back of the scoreboard). USGS NAIP for the plan.
 *
 * Estimated from the photos: the arch rhythm (7 m bays), the belt course and
 * cornice heights, the lower arcade only round the rotunda; the light towers
 * drawn as black frames with a lamp bank on top; the scoreboard as one slab
 * from the outfield roofs up. The lettering, flags, the Home Run Apple and
 * the Shea Bridge are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  type XY, add2, sub2, nrm2, len2, v3, ccw, capPoly, prism, rect, panel, arch, beam, rayHit, sweep, endCap, save, placeOnRun,
} from './nyc-yankee-stadium'

const brick = new Part(), stone = new Part(), steel = new Part(), green = new Part(), roof = new Part(), win = new Part()

const C: XY = [-5, 5]
const D2R = Math.PI / 180
const dir = (deg: number): XY => [Math.cos(deg * D2R), Math.sin(deg * D2R)]
const at = (deg: number, r: number): XY => add2(C, dir(deg), r)
const tang = (deg: number): XY => [-Math.sin(deg * D2R), Math.cos(deg * D2R)]

// OSM way/604023701, counter-clockwise, metres from the anchor.
const OUT: XY[] = ccw([
  [-123.9, 64.6], [-136.6, 59.7], [-114.2, -6.3], [-110.4, -16.6], [-94.5, -58.4], [-89.2, -72.1], [-85.1, -83.0],
  [-81.1, -93.5], [-72.2, -116.6], [-66.1, -132.8], [-61.2, -145.4], [-58.4, -150.5], [-53.6, -155.9], [-47.4, -160.2],
  [-43.0, -161.7], [-39.5, -162.2], [-36.4, -162.3], [-31.5, -161.5], [-21.5, -157.0], [-17.4, -153.4], [-11.3, -147.1],
  [-2.4, -139.2], [6.2, -131.3], [17.1, -121.5], [27.6, -111.6], [34.1, -105.5], [42.2, -98.8], [51.9, -90.1],
  [62.4, -81.1], [70.8, -73.7], [85.2, -61.2], [89.8, -57.2], [108.3, -41.4], [123.4, -27.7], [121.5, -21.7],
  [131.6, -17.6], [132.0, -15.8], [130.0, -11.1], [125.9, -1.6], [124.3, 2.1], [113.8, 28.7], [106.2, 47.6],
  [96.1, 72.7], [86.5, 96.5], [84.6, 101.3], [77.5, 118.9], [72.6, 133.9], [63.5, 156.8], [37.8, 146.9],
  [24.2, 141.7], [9.6, 135.9], [6.4, 134.7], [3.3, 142.4], [-16.6, 134.6], [-11.5, 121.5], [-14.5, 120.3],
  [-13.0, 116.1], [-3.4, 120.2], [-0.3, 111.9], [2.0, 105.8], [-10.4, 101.0], [-11.5, 103.7], [-85.4, 75.2],
  [-84.4, 72.5], [-90.8, 70.3], [-94.5, 63.7], [-119.5, 54.0],
])
const wallR = (deg: number) => rayHit(C, dir(deg), OUT)!

// Lidar radii every 5 degrees about C: r2 = the field wall, r14 = the second
// deck's front, r21 = the upper deck's front, r38 = the canopy's front,
// rcb = its back. Smoothed by hand.
const T: Record<number, number[]> = {
  100: [58, 66, 69, 83, 93], 105: [57, 65, 68, 82, 93], 110: [57, 65, 67, 82, 95], 115: [58, 65, 68, 82, 95],
  120: [59, 66, 68, 83, 95], 125: [60, 67, 69, 84, 94], 130: [62, 69, 71, 86, 97], 135: [65, 71, 73, 90, 99],
  140: [67, 73, 77, 95, 105], 145: [68, 78, 82, 99, 107], 150: [69, 81, 84, 98, 107], 155: [70, 82, 84, 99, 108],
  160: [67, 81, 81, 98, 106], 165: [61, 79, 79, 94, 104], 170: [57, 75, 77, 92, 101], 175: [57, 74, 75, 91, 100],
  180: [53, 73, 75, 91, 99], 185: [52, 73, 75, 90, 99], 190: [56, 74, 76, 91, 101], 195: [57, 76, 78, 93, 103],
  200: [58, 78, 80, 96, 104], 205: [62, 79, 82, 96, 105], 210: [62, 80, 82, 97, 106], 215: [63, 82, 83, 99, 108],
  220: [61, 83, 85, 102, 111], 225: [62, 86, 89, 106, 115], 230: [65, 90, 92, 109, 117], 235: [73, 93, 95, 111, 121],
  240: [76, 96, 97, 113, 122], 245: [79, 97, 99, 115, 124], 250: [81, 99, 101, 116, 126], 255: [83, 99, 101, 116, 126],
  260: [82, 101, 103, 118, 127], 265: [82, 100, 101, 116, 126], 270: [81, 99, 101, 117, 126], 275: [78, 98, 99, 115, 123],
  280: [73, 95, 97, 113, 123], 285: [66, 93, 95, 111, 120], 290: [63, 89, 91, 109, 118], 295: [62, 87, 89, 106, 114],
  300: [66, 84, 87, 102, 112], 305: [67, 83, 85, 100, 111], 310: [65, 83, 85, 100, 109], 315: [62, 82, 83, 99, 109],
  320: [61, 79, 82, 96, 106], 325: [60, 78, 80, 96, 105], 330: [60, 78, 80, 95, 104], 335: [60, 78, 80, 95, 105],
}
// the field wall's radius is noisy where low seats meet the warning track: smooth it twice
for (let pass = 0; pass < 2; pass++) {
  const ks = Object.keys(T).map(Number).sort((x, y) => x - y), v = ks.map((k) => T[k][0])
  ks.forEach((k, i) => { if (i > 0 && i < ks.length - 1) T[k][0] = (v[i - 1] + 2 * v[i] + v[i + 1]) / 4 })
}
const radii = (deg: number) => {
  const d = Math.min(335, Math.max(100, deg)), k0 = Math.min(330, Math.floor(d / 5) * 5), u = (d - k0) / 5
  return T[k0].map((v, i) => v + (T[k0 + 5][i] - v) * u)
}

const WALL_Z = 29, ROOF_Z = 27.5
const G0 = 100, G1 = 335

// ---------------------------------------------------------------------------
// The stands: one profile swept from left field round home plate to right field.
{
  const angles: number[] = []
  for (let d = G0; d <= G1; d += 5) angles.push(d)
  for (const d of [139, 153, 157, 186, 215, 241, 268, 294, 327]) if (!angles.includes(d)) angles.push(d)
  angles.sort((a, b) => a - b)
  const prof = (deg: number): [number, number][] => {
    const [r2, r14, r21, r38, rcb0] = radii(deg)
    const ro = wallR(deg) - 0.4
    const rcb = Math.min(rcb0, ro - 1.2)
    const rs = rcb + Math.min(9, Math.max(0, ro - rcb - 3) * 0.45)
    const rTier = (r2 + r14) / 2 + 3
    return [
      [r2, 0], [r2, 2.4], // field wall
      [rTier, 4.5], [rTier, 9], [r14 - 1, 11.5], // lower bowl, riser, second tier
      [r14 - 1, 16], // fascia under the decks
      [r21, 22], [r38 + 1.5, 33], // the upper deck
      [r38 + 1.5, 38.4], [r38, 38.4], [r38, 40], [rcb, 40], // canopy
      [rcb, 32], [rs, 32], [rs, ROOF_Z], // the steel back, stepping down over the suites
      [ro, ROOF_Z], // the roof deck behind the brick
    ]
  }
  const mats = [green, green, steel, green, steel, steel, green, steel, steel, steel, steel, steel, steel, steel, roof]
  const st = angles.map((d) => prof(d).map(([r, z]) => v3(at(d, r), z)))
  sweep(st, (i) => mats[i])
  endCap(steel, st[0], nrm2([Math.sin(G0 * D2R), -Math.cos(G0 * D2R)]))
  endCap(steel, st[st.length - 1], nrm2([-Math.sin(G1 * D2R), Math.cos(G1 * D2R)]))
}

// ---------------------------------------------------------------------------
// The outfield: right-field porch, bullpens and the block round the batter's eye.
{
  // porch: G1 → 385 (25°); stands from the wall up to 22, roofs behind at 13 then 21
  const pa: number[] = []
  for (let d = G1; d <= 385; d += 5) pa.push(d)
  const porch = pa.map((d) => {
    const rf = d < 360 ? 60 + (d - 335) * 0.3 : 68
    const front = d < 358 ? 80 : rf + 1
    const back = Math.min(100, wallR(d) - 6)
    const zb = d < 358 ? 13 : 21
    const ro = wallR(d) - 0.4
    return ([[rf, 0], [rf, 3], [front, 9], [front, 13], [back, 22], [back, zb], [ro, zb]] as [number, number][]).map(([r, z]) => v3(at(d, r), z))
  })
  sweep(porch, (i) => [green, green, steel, green, steel, roof][i])
  endCap(steel, porch[porch.length - 1], nrm2([-Math.sin(385 * D2R), Math.cos(385 * D2R)]))
  // bullpens: 385 → 412, roofs at 9 then the buildings behind at 20
  const ba = [385, 390, 395, 400, 405, 412]
  const pens = ba.map((d) => ([[66, 0], [66, 9], [97, 9], [97, 20], [wallR(d) - 0.4, 20]] as [number, number][]).map(([r, z]) => v3(at(d, r), z)))
  sweep(pens, (i) => [steel, roof, steel, roof][i])
  endCap(steel, pens[pens.length - 1], nrm2([-Math.sin(412 * D2R), Math.cos(412 * D2R)]))
  // centre: 412 → 460 (100°), the block round the batter's eye at 10
  const ca = [412, 420, 428, 436, 444, 452, 460]
  const ctr = ca.map((d) => ([[64, 0], [64, 10], [Math.min(104, wallR(d) - 0.4), 10], [Math.min(104, wallR(d) - 0.4), 0]] as [number, number][]).map(([r, z]) => v3(at(d, r), z)))
  sweep(ctr, (i) => [steel, roof, brick][i])
  endCap(steel, ctr[0], nrm2([Math.sin(412 * D2R), -Math.cos(412 * D2R)]))
}

// ---------------------------------------------------------------------------
// The brick wall: limestone base, belt course and cornice; tall arches above,
// and the lower arcade round the rotunda.
{
  const ang = (p: XY) => ((Math.atan2(p[1] - C[1], p[0] - C[0]) / D2R) + 360) % 360
  // wall heights by the angle of an edge's middle: the stands' wall, then the
  // right-field corner (13) and the right-field side (21); none on the plaza side
  const hOf = (d: number) => (d >= 97 && d <= 328 ? WALL_Z : d > 328 && d <= 359 ? 13 : d < 50 ? 21 : 0)
  // Re-cut the outline into facets about one bay (7 m) long, keeping its
  // sharp corners, so each arch sits flat in the middle of its own facet and
  // the rotunda's curve keeps its rhythm.
  const BAY = 7
  const n0 = OUT.length
  const turn = (i: number) => {
    const a = OUT[(i + n0 - 1) % n0], b = OUT[i], c = OUT[(i + 1) % n0]
    const u = nrm2(sub2(b, a)), v = nrm2(sub2(c, b))
    return Math.abs(Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1])) / D2R
  }
  const sharp = OUT.map((_, i) => turn(i) > 25)
  const first = sharp.indexOf(true)
  const facets: XY[] = []
  for (let k = 0; k < n0; k++) {
    const i0 = (first + k) % n0
    if (!sharp[i0]) continue
    // the stretch from this sharp corner to the next
    const pts: XY[] = [OUT[i0]]
    let j = (i0 + 1) % n0
    while (!sharp[j]) { pts.push(OUT[j]); j = (j + 1) % n0 }
    pts.push(OUT[j])
    const cum = [0]
    for (let m = 1; m < pts.length; m++) cum.push(cum[m - 1] + len2(sub2(pts[m], pts[m - 1])))
    const L = cum[cum.length - 1], nseg = Math.max(1, Math.round(L / BAY))
    for (let m = 0; m < nseg; m++) {
      const t = (L * m) / nseg
      let q = 0
      while (q < pts.length - 2 && cum[q + 1] < t) q++
      const u = nrm2(sub2(pts[q + 1], pts[q]))
      facets.push(add2(pts[q], u, t - cum[q]))
    }
  }
  const edges: [XY, XY, number][] = []
  for (let i = 0; i < facets.length; i++) {
    const a = facets[i], b = facets[(i + 1) % facets.length]
    const h = hOf(ang([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]))
    if (h > 0) edges.push([a, b, h])
  }
  // brick round the rotunda and the bays either side of it; above the belt
  // course the long sides are pale cast stone (the aerial), brick below
  const brickAbove = (d: number) => d > 215 && d < 295
  for (const [p, q, H] of edges) {
    const u = nrm2(sub2(q, p)), n: XY = [u[1], -u[0]]
    const d = ang(add2(p, u, len2(sub2(q, p)) / 2))
    stone.quad(v3(p, 0), v3(q, 0), v3(q, 1.2), v3(p, 1.2))
    if (H === WALL_Z) {
      brick.quad(v3(p, 1.2), v3(q, 1.2), v3(q, 7.6), v3(p, 7.6))
      ;(brickAbove(d) ? brick : stone).quad(v3(p, 8.6), v3(q, 8.6), v3(q, H - 1.3), v3(p, H - 1.3))
      const P1 = add2(p, n, 0.25), Q1 = add2(q, n, 0.25)
      stone.quad(v3(P1, 7.6), v3(Q1, 7.6), v3(Q1, 8.6), v3(P1, 8.6)) // belt course
      stone.quad(v3(p, 7.6), v3(q, 7.6), v3(Q1, 7.6), v3(P1, 7.6))
      stone.quad(v3(P1, 8.6), v3(Q1, 8.6), v3(q, 8.6), v3(p, 8.6))
    } else brick.quad(v3(p, 1.2), v3(q, 1.2), v3(q, H - 1.3), v3(p, H - 1.3))
    const P = add2(p, n, 0.45), Q = add2(q, n, 0.45)
    stone.quad(v3(P, H - 1.3), v3(Q, H - 1.3), v3(Q, H), v3(P, H))
    stone.quad(v3(p, H - 1.3), v3(q, H - 1.3), v3(Q, H - 1.3), v3(P, H - 1.3))
    stone.quad(v3(P, H), v3(Q, H), v3(q, H), v3(p, H))
  }
  // Openings, one bay to a facet. Round the rotunda and its brick wings: the
  // tall round-arched windows (two thirds of the wall), the arcade of small
  // arches below at the rotunda itself. Along the pale sides: two tall
  // windows a bay over a broad ground-floor opening.
  for (const [p, q, H] of edges) {
    if (H !== WALL_Z) continue
    const L = len2(sub2(q, p))
    if (L < 4.5) continue
    const u = nrm2(sub2(q, p)), n: XY = [u[1], -u[0]], m = add2(p, u, L / 2)
    const d = ang(m)
    if (brickAbove(d)) {
      const w = Math.min(5.2, L - 1.8)
      arch(win, add2(m, u, -w / 2), add2(m, u, w / 2), n, 9.6, 24 - w / 2)
      if (d > 236 && d < 274) arch(win, add2(m, u, -w / 2 + 0.3), add2(m, u, w / 2 - 0.3), n, 0.6, 6.6 - (w - 0.6) / 2)
      else panel(win, add2(m, u, -w / 2 + 0.3), add2(m, u, w / 2 - 0.3), n, 1.4, 6.4)
    } else {
      for (const o of [-1.7, 1.7]) panel(win, add2(m, u, o - 1.0), add2(m, u, o + 1.0), n, 9.8, 24.2)
      panel(win, add2(m, u, -2.2), add2(m, u, 2.2), n, 1.4, 6.4)
    }
  }
  // the low right-field walls: a window band a bay
  for (const H of [13, 21]) {
    const r = edges.filter((e) => e[2] === H)
    const tot = r.reduce((t, [p, q]) => t + len2(sub2(q, p)), 0)
    const m = Math.floor((tot - 4) / 9), t0 = (tot - m * 9) / 2
    for (let k = 0; k < m; k++) placeOnRun(r, t0 + (k + 0.5) * 9, 4, (a, b, n, off) => panel(win, a, b, n, H - 7, H - 3, off))
  }
}

// ---------------------------------------------------------------------------
// Light towers: black frames standing on the roof with a lamp bank on top,
// one each side of the rotunda, one in left field and a long one over the
// right-field porch. (end points, base, top, the side facing the field)
function tower(a: XY, b: XY, z0: number, z1: number) {
  const u = nrm2(sub2(b, a)), L = len2(sub2(b, a))
  const mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const tf: XY = nrm2(sub2(C, mid)) // towards the field
  const nIn: XY = (u[1] * tf[0] - u[0] * tf[1]) > 0 ? [u[1], -u[0]] : [-u[1], u[0]]
  // the lamp bank: a slab across the top, its lamp face pale towards the field
  const bank = rect(mid, u, L / 2, 1.0)
  prism(steel, steel, bank, z1 - 6, z1)
  capPoly(steel, bank, z1 - 6, false)
  panel(stone, add2(add2(mid, u, -L / 2 + 0.8), nIn, 1.0), add2(add2(mid, u, L / 2 - 0.8), nIn, 1.0), nIn, z1 - 5.4, z1 - 0.8, 0.06)
  // legs and braces
  const legs = Math.max(2, Math.round(L / 13) + 1)
  for (let i = 0; i < legs; i++) {
    const p = add2(a, u, (L * i) / (legs - 1) * 0.94 + L * 0.03)
    beam(steel, v3(p, z0), v3(p, z1 - 6), 1.3)
    if (i + 1 < legs) {
      const q = add2(a, u, (L * (i + 1)) / (legs - 1) * 0.94 + L * 0.03)
      beam(steel, v3(p, z0 + 1), v3(q, z1 - 6.5), 0.8)
      beam(steel, v3(q, z0 + 1), v3(p, z1 - 6.5), 0.8)
    }
  }
}
tower([-86, -68], [-103, -31], ROOF_Z, 59) // third-base side of the rotunda
tower([40, -99], [69, -72], ROOF_Z, 58) // first-base side
tower([-54, 80], [-22, 94], 40, 59) // left field
tower([94, 38], [71, 89], 21, 56) // over the right-field porch

// ---------------------------------------------------------------------------
// The scoreboard: a 53 m slab behind centre field, its screen facing home,
// the sign band on top.
{
  const a: XY = [1, 94], b: XY = [54, 77]
  const u = nrm2(sub2(b, a)), mid: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const tf = nrm2(sub2(C, mid)), n: XY = (u[1] * tf[0] - u[0] * tf[1]) > 0 ? [u[1], -u[0]] : [-u[1], u[0]]
  const L = len2(sub2(b, a))
  const body = rect(mid, u, L / 2, 1.6)
  prism(steel, roof, body, 10, 52)
  panel(win, add2(add2(mid, u, -L / 2 + 1.2), n, 1.6), add2(add2(mid, u, L / 2 - 1.2), n, 1.6), n, 33, 50.6, 0.06)
  const sign = rect(add2(mid, u, -L / 4), u, 11, 0.8)
  prism(steel, steel, sign, 52, 56.5)
}

await save('nyc-citi-field', 'Citi Field', [
  { part: brick, material: finish("citi-brick", 0xae6b59) },
  { part: stone, material: PALETTE.stone },
  { part: steel, material: finish('citi-steel', 0x4a4f57) },
  { part: green, material: finish('mets-green', 0x55715f) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], {
  bearing: 0, elevation: 0, anchor: [40.757062, -73.845831], height: 59,
  replaces: ['way/604023701', 'way/1445223372', 'way/1445222220', 'way/1445222221', 'way/1445222222', 'way/604024892', 'way/1518492091', 'way/1553291644', 'way/1060517536', 'way/1553289790'],
})
