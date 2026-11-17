/**
 * World of Coca-Cola (2007, Atlanta) — original procedural geometry, CC0-1.0.
 * bun generators/atl-world-of-coca-cola.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Anchor = centroid
 * of OSM way/270358205, 33.762892, -84.392734.
 *
 * Identity, from the photos:
 *  - the frosted glass tower, a tall square shaft of pale green-white
 *    glass with a giant green contour bottle inside it, lit green at
 *    night, standing up out of the west wing;
 *  - the long, thin white canopy sweeping round the curved west front on
 *    Pemberton Place, with glass and cream piers under it;
 *  - above the canopy, the curved wall clad in brushed silver panels with
 *    the white Coca-Cola "dynamic ribbon" wave across it;
 *  - pale silver-grey metal-panel walls elsewhere, white roofs; on the
 *    east street front, a long pale blue-grey wall with the red "world of
 *    Coca-Cola" sign: lower-case "world", a red panel with the white
 *    bottle, and the Coca-Cola script.
 *
 * Evidence:
 *  - plan: OSM way/270358205 and the canopy roof way/810387778. The west
 *    front is an arc: circle centre (-6.0, 1.9), r 51.2, fitted to the
 *    outline, from 116° round to 239°.
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 0.5 m
 *    grid, over ground_min (294.22 m): most roofs 15, the canopy's edge
 *    15-16, the west wing's upper wall 20-22, the central hall 24 with a
 *    26 m straight parapet on its east edge, the east bar 22, the south
 *    block 18-19, the glass tower 34.9: a flat top 7.5 × 5.5 m
 *    over x -52.5..-45, y -0.5..5 (0.5 m cells), drawn 8 × 6 m.
 *    Mapterhorn's lowest ground under the outline (its
 *    north-east corner) is about 0.7 m over ground_min, so here: roofs
 *    14.3, canopy 15.3, wing 20.8, hall 23.3, parapet 25.3, east bar 21.3,
 *    south block 18, tower 34.2. The plaza on the west and north is about
 *    7 m up the slope; the entrance courtyard sits lower.
 *  - bottle: estimated from the photos, filling most of the shaft:
 *    18.5 m tall, its widest 5.4 m across the 6 m depth.
 *  - why the tower reads tall in the photos: the west plaza is about 7 m
 *    up the slope (lidar ground; Mapterhorn agrees), so from the park the
 *    canopy stands 8 m and the tower 27 m above the visitor, over 3 times
 *    as high. On the map the terrain covers the lower 7 m on that side.
 *    The upper silver wing (lidar 20-22 m) lies east of the tower, at
 *    radii 25-39 m on the front's arc, so the tower stands clear in front
 *    of it from the roof at 14.3 m to its top.
 *  - colours: pale silver-grey metal walls (Barera's east photo), white
 *    canopy and ribbon, frosted white-green glass, the green bottle, red
 *    sign (photos); white roofs (NAIP).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - The World of Coca-Cola, Atlanta, GA (32532265757).jpg, Warren LeMay,
 *    CC0 (canopy, silver ribbon wall and tower)
 *    https://commons.wikimedia.org/wiki/File:The_World_of_Coca-Cola,_Atlanta,_GA_(32532265757).jpg
 *  - The World of Coca-Cola, Atlanta, GA (32532265527).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:The_World_of_Coca-Cola,_Atlanta,_GA_(32532265527).jpg
 *  - The World of Coca-Cola, Atlanta, GA (32532266077).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:The_World_of_Coca-Cola,_Atlanta,_GA_(32532266077).jpg
 *  - Atlanta August 2016 02 (World of Coca-Cola).jpg, Michael Barera,
 *    CC BY-SA 4.0 (the east street front: white block, red sign)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_August_2016_02_(World_of_Coca-Cola).jpg
 *  - Atlanta August 2016 05 (World of Coca-Cola).jpg, Michael Barera,
 *    CC BY-SA 4.0 (from Pemberton Place's lawn)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_August_2016_05_(World_of_Coca-Cola).jpg
 *  - Atlanta August 2016 06 (World of Coca-Cola).jpg, Michael Barera,
 *    CC BY-SA 4.0 (from the lawn, north)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_August_2016_06_(World_of_Coca-Cola).jpg
 *  - WoCC-bouteille-Atlanta.JPG, Rundvald, public domain (the tower and
 *    its bottle)
 *    https://commons.wikimedia.org/wiki/File:WoCC-bouteille-Atlanta.JPG
 *  - World of Coca-Cola (8216394746).jpg, Aleksandr Zykov, CC BY-SA 2.0
 *    (dusk: the bottle lit green)
 *    https://commons.wikimedia.org/wiki/File:World_of_Coca-Cola_(8216394746).jpg
 *  - NAIP orthophoto (USGS, public domain): plan and roofs.
 * No look-only sources. No commercial imagery.
 *
 * Night: the bottle is `neon-coke-bottle`, glowing green as the real one
 * does behind the frosted glass; the sign's letters and panel are
 * `neon-coke-red`; the glass under the canopy is `window`; the
 * tower's frosted glass is translucent `glass` and stays dark.
 *
 * Trademark exception: the "world of Coca-Cola" lettering and the
 * Coca-Cola script are carried as geometry under STYLE.md "Famous signs":
 * the sign is the building's street identity. It is a trademark of The
 * Coca-Cola Company; the model's CC0 dedication covers the geometry only.
 *
 * Doubts: the ribbon wave is one bold band, not the real embossed swirl;
 * the script is traced from a small crop and simplified (the C's inner
 * curls are left off); where the silver swirl wall ends and the curved
 * blue glass wall above the canopy begins is unclear, so the whole wing is
 * silver; the glass rotunda at the north-east corner and the courtyard's
 * small pavilions are drawn as part of the base.
 */
import { Part, type V3 } from './mesh'
import { Pen, strokes } from './lettering'
import { PALETTE, type Swatch } from './palette'
import { area, capPoly, edgePanels, prism, save, smoothWall, wall, type XY } from './atl-westin-peachtree-plaza'

const cream = new Part(), win = new Part(), silver = new Part(), towerGlass = new Part(), bottle = new Part(), red = new Part()

const D = Math.PI / 180
const BASE = 14.3, CANOPY = 15.3, WING = 20.8, HALL = 23.3, PARAPET = 25.3, BAR = 21.3, SOUTH = 18, TOWER = 34.2
const C: XY = [-6.0, 1.9], RF = 51.2   // the west front's arc
/** A quad wound to face along `dir`. */
function qd(part: Part, a: V3, b: V3, c: V3, d: V3, dir: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2] >= 0) part.quad(a, b, c, d)
  else part.quad(d, c, b, a)
}
const pol = (r: number, a: number): XY => [C[0] + r * Math.cos(a * D), C[1] + r * Math.sin(a * D)]

// ── The base: the outline to the main roof line, with the west front's
// arc as glass under the canopy. ──
const outline: XY[] = [[-32.3, -42.1], [-35.9, -38.5], [-39.2, -34.7], [-42.3, -29.8], [-43.9, -26.9], [-45.6, -23.9], [-48.4, -25.3], [-51.4, -20.7], [-53.8, -15.5], [-55.5, -10.2], [-56.8, -3.3], [-57.2, 3.9], [-56.5, 10.3], [-55.2, 16.4], [-53.0, 21.8], [-50.3, 26.8], [-49.9, 27.6], [-45.7, 33.2], [-41.6, 37.9], [-37.1, 42.1], [-32.6, 45.6], [-30.2, 47.0], [-28.1, 48.1], [-20.4, 36.4], [-39.5, 15.7], [-31.3, 8.5], [-29.6, 10.0], [-22.4, 3.0], [-24.2, 1.3], [-17.6, -4.1], [-17.7, -0.0], [-17.3, 3.4], [-15.8, 8.2], [-13.5, 12.4], [-10.1, 16.3], [-7.4, 18.2], [-4.8, 19.8], [-6.8, 24.2], [-2.2, 25.9], [2.0, 26.8], [6.0, 27.2], [5.0, 29.5], [8.4, 30.7], [13.3, 31.6], [13.5, 37.9], [41.9, 38.3], [44.1, 39.4], [46.2, 39.9], [48.7, 39.4], [51.0, 38.2], [52.2, 36.1], [52.7, 34.0], [52.3, 31.5], [51.1, 29.3], [51.2, -27.1], [37.6, -27.0], [37.5, -30.7], [22.3, -30.6], [17.6, -21.1], [14.4, -22.4], [11.3, -23.6], [8.0, -24.2], [4.1, -24.3], [14.2, -33.7], [1.3, -47.2], [-18.4, -27.9]]
const ring = area(outline) < 0 ? [...outline].reverse() : outline
/** Split long edges to ≤ 5 m so low faces follow the terrain. */
const split = (r: XY[], step = 5): XY[] => r.flatMap((a, i) => {
  const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
  return Array.from({ length: k }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k] as XY)
})
prism(silver, split(ring), 0, BASE, cream, 0.4)
// Glass under the canopy on the west front, from the plaza (about 7 m up
// the slope, lidar) to the canopy: each outline edge within a
// metre of the arc gets broad glazed bays between cream piers.
const onArc = (p: XY) => Math.abs(Math.hypot(p[0] - C[0], p[1] - C[1]) - RF) < 1.2
for (let i = 0; i < ring.length; i++) {
  const a = ring[i], b = ring[(i + 1) % ring.length]
  if (onArc(a) && onArc(b)) edgePanels(win, a, b, 7.3, BASE - 1.0, { group: 11, gap: 0, bay: 6, pier: 1.2, margin: 0.6, min: 2 })
}

// ── The canopy: a thin white slab round the west front, out 5 m. ──
{
  const a0 = 112, a1 = 241, n = 26
  const inner = Array.from({ length: n + 1 }, (_, i) => pol(RF - 1.5, a0 + ((a1 - a0) * i) / n))
  // Wider over the north-west entrance (the roof way/810387778 reaches 7 m out).
  const out = (a: number) => 4.5 + 2.5 * Math.max(0, 1 - Math.abs(a - 135) / 25)
  const outer = Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return pol(RF + out(a), a) })
  const z0 = CANOPY - 1.1, z1 = CANOPY
  for (let i = 0; i < n; i++) {
    const p = inner[i], q = inner[i + 1], r = outer[i + 1], s = outer[i]
    const ox = (r[0] + s[0]) / 2 - C[0], oy = (r[1] + s[1]) / 2 - C[1]
    qd(cream, [p[0], p[1], z1], [q[0], q[1], z1], [r[0], r[1], z1], [s[0], s[1], z1], [0, 0, 1])
    qd(cream, [p[0], p[1], z0], [q[0], q[1], z0], [r[0], r[1], z0], [s[0], s[1], z0], [0, 0, -1])
    qd(cream, [s[0], s[1], z0], [r[0], r[1], z0], [r[0], r[1], z1], [s[0], s[1], z1], [ox, oy, 0])
  }
  for (const [i, f] of [[0, -1], [n, 1]] as [number, number][]) {
    const p = inner[i], s = outer[i], t = outer[i + (f > 0 ? -1 : 1)]
    qd(cream, [p[0], p[1], z0], [s[0], s[1], z0], [s[0], s[1], z1], [p[0], p[1], z1], [s[0] - t[0], s[1] - t[1], 0])
  }
}

// ── The west wing's upper wall: brushed silver, with the white ribbon. ──
{
  const a0 = 146, a1 = 214, n = 14, RO = RF - 12, RI = RF - 26
  const outer = Array.from({ length: n + 1 }, (_, i) => pol(RO, a0 + ((a1 - a0) * i) / n))
  const inner = Array.from({ length: n + 1 }, (_, i) => pol(RI, a0 + ((a1 - a0) * i) / n))
  // Closed band: outer arc (facing out), ends, inner arc, roof.
  const band: XY[] = [...inner, ...[...outer].reverse()]
  const bandCcw = area(band) < 0 ? [...band].reverse() : band
  prism(silver, bandCcw, BASE - 0.5, WING, cream, 0.4)
  // The ribbon: a bold white wave, 2.2 m deep, twice along the face.
  const m = 28, zc = (BASE + WING) / 2 + 0.3
  for (let i = 0; i < m; i++) {
    const t0 = i / m, t1 = (i + 1) / m
    const A = (t: number) => a0 + 2 + (a1 - a0 - 4) * t
    const w = (t: number) => zc + 1.5 * Math.sin(t * 2 * Math.PI * 1.5 + 0.6)
    const P = (t: number, z: number): V3 => { const [x, y] = pol(RO + 0.07, A(t)); return [x, y, z] }
    const q = [P(t0, w(t0) - 1.4), P(t1, w(t1) - 1.4), P(t1, w(t1) + 1.4), P(t0, w(t0) + 1.4)]
    // Face outward (away from C).
    const nx = (q[1][1] - q[0][1]), ny = -(q[1][0] - q[0][0]), mx = (q[0][0] + q[1][0]) / 2 - C[0], my = (q[0][1] + q[1][1]) / 2 - C[1]
    if (nx * mx + ny * my > 0) cream.quad(q[0], q[1], q[2], q[3])
    else cream.quad(q[3], q[2], q[1], q[0])
  }
}

// ── The central hall, its straight east parapet, the east bar, the south block. ──
const ccwP = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)
prism(silver, ccwP([[-17.6, -26], [23, -26], [-3, 24], [-7.4, 18.2], [-13.5, 12.4], [-17.3, 3.4]]), BASE - 0.5, HALL, cream, 0.4)
prism(silver, ccwP([[22.0, -26.5], [23.6, -25.7], [-2.4, 24.6], [-4.0, 23.8]]), HALL - 0.5, PARAPET, cream, 0.3)
prism(silver, ccwP([[12, -8], [49, -8], [49, 0], [10, 0]]), BASE - 0.5, BAR, cream, 0.4)
prism(cream, ccwP([[-18.4, -27.9], [1.3, -47.2], [14.2, -33.7], [4.1, -26], [-16, -26]]), BASE - 0.5, SOUTH, cream, 0.4)

// ── The "world of Coca-Cola" sign on the east street front. ──
// STYLE.md "Famous signs": the sign is the building's street identity, so
// its letters are traced from Barera's east photo (Atlanta August 2016
// 02) in photo pixels of a 1000 px crop and scaled at 0.05 m a pixel, so
// the sign is 31 m long and the red bottle panel 6.3 m tall: "world" in a
// bold rounded lower-case sans, a small "of" under it, the red panel with
// the white contour bottle, and "Coca-Cola" in its Spencerian script with
// the long swash under "oca". Strokes are a little heavier than the real
// ones so the word holds at phone size.
{
  const S = 0.05, X = 51.2 + 0.04, Y0 = -27, Z0 = 5.0
  const place = (u: number, v: number, w: number): V3 => [X + w, Y0 + (u - 15) * S, Z0 + (190 - v) * S]
  // world / of: px coordinates, v down.
  const sans = new Pen()
  sans.moveTo([20, 96]).lineTo([30, 124]).lineTo([40, 102]).lineTo([50, 124]).lineTo([60, 96])
  sans.circle([80, 110], 13, 13, 12)
  sans.moveTo([104, 125]).lineTo([104, 96]).moveTo([104, 108]).quadTo([108, 96], [120, 96], 4)
  sans.moveTo([132, 76]).lineTo([132, 125])
  sans.circle([155, 111], 13, 13, 12)
  sans.moveTo([170, 76]).lineTo([170, 125])
  sans.circle([178, 165], 9, 9, 10)
  sans.moveTo([198, 186]).lineTo([198, 152]).quadTo([198, 142], [208, 142], 3)
  sans.moveTo([191, 158]).lineTo([206, 158])
  strokes(red, sans.paths, { width: 13, depth: 0.35, place: (u, v, w) => place(u, v, w) })
  // The script.
  const sc = new Pen()
  sc.moveTo([330, 96]).cubicTo([312, 80], [282, 92], [282, 140]).cubicTo([282, 182], [322, 192], [348, 176])
  sc.moveTo([330, 96]).quadTo([326, 112], [312, 104], 4)
  sc.circle([358, 162], 12, 12, 12)
  sc.moveTo([402, 150]).cubicTo([388, 138], [372, 158], [380, 172]).cubicTo([386, 182], [398, 178], [404, 172])
  sc.circle([420, 164], 11, 11, 12)
  sc.moveTo([432, 150]).quadTo([430, 170], [438, 180], 4)
  sc.moveTo([440, 148]).lineTo([454, 146])
  sc.moveTo([508, 98]).cubicTo([488, 82], [458, 98], [458, 142]).cubicTo([458, 184], [498, 194], [522, 178])
  sc.circle([530, 164], 11, 11, 12)
  sc.moveTo([546, 180]).cubicTo([548, 140], [560, 98], [568, 104]).cubicTo([574, 110], [556, 150], [556, 180])
  sc.circle([586, 166], 11, 11, 12)
  sc.moveTo([598, 152]).quadTo([596, 172], [606, 182], 4)
  // The swash from the first C's foot under "oca".
  sc.moveTo([290, 182]).cubicTo([340, 204], [400, 168], [446, 192])
  strokes(red, sc.paths, { width: 12, depth: 0.35, place: (u, v, w) => place(u, v, w) })
  // The red panel and its white bottle.
  {
    const a = place(215, 190, 0), b = place(265, 65, 0)
    prism(red, ccwP([[X - 0.04, a[1]], [X + 0.35, a[1]], [X + 0.35, b[1]], [X - 0.04, b[1]]]), a[2], b[2], red, 0)
    // Bottle silhouette, flush on the panel's face.
    const bt: [number, number][] = [[240, 82], [236, 86], [236, 100], [231, 118], [232, 150], [236, 160], [233, 175], [247, 175], [244, 160], [248, 150], [249, 118], [244, 100], [244, 86]]
    const pts = bt.map(([u, v]) => place(u, v, 0.37 / 1))
    for (let k = 1; k < pts.length - 1; k++) cream.tri(pts[0], pts[k + 1], pts[k])
  }
  // The glazed entrance north of it (Barera's east view).
  edgePanels(win, [51.2, 6], [51.2, 18], 1.0, BASE - 1.5, { group: 12.3, gap: 0, bay: 5.5, pier: 1.2, margin: 0.5 })
}

// ── The glass tower and its bottle. ──
const TX = -49, TY = 2.0, THX = 4.0, THY = 3.0
{
  const sq: XY[] = [[TX - THX, TY - THY], [TX + THX, TY - THY], [TX + THX, TY + THY], [TX - THX, TY + THY]]
  wall(towerGlass, sq, BASE, TOWER - 0.6)
  capPoly(towerGlass, sq, TOWER - 0.6, true)
  // A thin white frame: corner posts and the top rim, so the glass has edges.
  for (const [cx, cy] of sq) {
    const sx = Math.sign(cx - TX), sy = Math.sign(cy - TY), x0 = Math.min(cx, cx - sx * 0.7), x1 = Math.max(cx, cx - sx * 0.7), y0 = Math.min(cy, cy - sy * 0.7), y1 = Math.max(cy, cy - sy * 0.7)
    prism(cream, [[x0 - 0.03, y0 - 0.03], [x1 + 0.03, y0 - 0.03], [x1 + 0.03, y1 + 0.03], [x0 - 0.03, y1 + 0.03]], BASE, TOWER - 0.6, cream, 0.1)
  }
  const rim: XY[] = sq, rimIn: XY[] = [[TX - THX + 0.7, TY - THY + 0.7], [TX + THX - 0.7, TY - THY + 0.7], [TX + THX - 0.7, TY + THY - 0.7], [TX - THX + 0.7, TY + THY - 0.7]]
  wall(cream, rim, TOWER - 0.6, TOWER)
  wall(cream, [...rimIn].reverse(), TOWER - 0.6, TOWER)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    cream.quad([rimIn[i][0], rimIn[i][1], TOWER], [rim[i][0], rim[i][1], TOWER], [rim[j][0], rim[j][1], TOWER], [rimIn[j][0], rimIn[j][1], TOWER])
  }
  // The contour bottle: a lathe of the classic profile (base, the fluted
  // body's waist and bulge, the shoulder, the neck), 18 m tall.
  const z0 = BASE + 0.4, H = TOWER - 1.4 - (BASE + 0.4)
  const prof: [number, number][] = [[0, 2.6], [0.04, 3.0], [0.16, 3.05], [0.28, 2.6], [0.40, 2.65], [0.52, 3.2], [0.62, 3.05], [0.72, 2.1], [0.80, 1.3], [0.90, 1.1], [0.96, 1.15], [1.0, 1.1]]
  const N = 14
  const pts = prof.map(([t, r]) => Array.from({ length: N }, (_, i) => {
    const a = (i / N) * 2 * Math.PI
    return [TX + 0.84 * r * Math.cos(a), TY + 0.84 * r * Math.sin(a), z0 + t * H] as V3
  }))
  const nrm = prof.map(([t, r], k) => {
    const [tp, rp] = prof[Math.max(0, k - 1)], [tn, rn] = prof[Math.min(prof.length - 1, k + 1)]
    const dr = (rn - rp), dz = (tn - tp) * H, l = Math.hypot(dr, dz) || 1
    return Array.from({ length: N }, (_, i) => { const a = (i / N) * 2 * Math.PI; return [Math.cos(a) * dz / l, Math.sin(a) * dz / l, -dr / l] as V3 })
  })
  for (let k = 0; k < prof.length - 1; k++) for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    bottle.tri(pts[k][i], pts[k][j], pts[k + 1][j], undefined, undefined, undefined, [nrm[k][i], nrm[k][j], nrm[k + 1][j]])
    bottle.tri(pts[k][i], pts[k + 1][j], pts[k + 1][i], undefined, undefined, undefined, [nrm[k][i], nrm[k + 1][j], nrm[k + 1][i]])
  }
  const top = pts[pts.length - 1]
  for (let i = 1; i < N - 1; i++) bottle.tri(top[0], top[i], top[i + 1])
}

const GLASS: Swatch & { opacity: number; doubleSided: boolean } = { name: 'glass', color: 0xb9e0cf, roughness: 0.24, opacity: 0.6, doubleSided: true }
await save('atl-world-of-coca-cola', 'World of Coca-Cola', [
  { part: cream, material: { name: 'trim', color: 0xf6f5f1, roughness: 0.85 } },
  { part: win, material: PALETTE.window },
  { part: silver, material: { name: 'coke-silver', color: 0xbcc4cc, roughness: 0.6 } },
  { part: towerGlass, material: GLASS },
  { part: bottle, material: { name: 'neon-coke-bottle', color: 0x2f7a55, roughness: 0.5 } },
  { part: red, material: { name: 'neon-coke-red', color: 0xc8333a, roughness: 0.6 } },
], { height: TOWER, anchor: [33.762892, -84.392734], bearing: 0 })
void smoothWall
