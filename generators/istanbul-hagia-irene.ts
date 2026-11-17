/**
 * Hagia Irene (Aya İrini), Istanbul — the 4th-c. church rebuilt under
 * Justinian (532, 548) and again after the earthquake of 740; in the first
 * court of Topkapı Palace — original procedural geometry, CC0-1.0.
 * bun generators/istanbul-hagia-irene.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 40.6: the model's +x is the church's liturgical
 * east (the apse, compass 130.6°), its +y the north side (compass 40.6°).
 * 40.6 squares the long walls of the OSM outline (relation/4742554, edges at
 * 130.2–131.2° and 310.9°). Anchor = the centroid of the outline's outer
 * ring, 28.980963, 41.009835.
 *
 * Identity (from the photos below):
 *  1. The main dome on its tall drum over the eastern bay: a brick drum of
 *     twenty arched windows with a pale plastered band above, a shallow
 *     lead dome and a gilt finial.                  (gg1, halun16, ninara)
 *  2. The long side walls rising to two great round-arched tympana, one per
 *     bay, with three tiers of arched windows.        (ext, ninara, hs)
 *  3. The east end: the apse with its three big windows in front of the
 *     taller bema block, lower side chambers.          (gg1, gg2, halun15)
 *  4. The low elliptical dome over the western bay, the lower narthex, and
 *     the atrium courtyard west of it.                 (hs, ninara; OSM)
 *  5. Dark red-brown banded brick (pulled from gg1, hs, halun16 at the
 *     lead's review), pale stone at the base and on the upper drum, lead roofs.
 *
 * Plan: OSM (© OpenStreetMap contributors, ODbL) relation/4742554 (outer
 * ring = atrium + church + north annex; inner ring = the atrium courtyard,
 * x −36.6…−15.5, y −6.9…2.6) and its building:parts, turned to bearing
 * 40.6: way/776243843 (the church block, x −8.3…48.3, y −18.9…14.7, h 15),
 * way/776243841 and 776243842 (the two bays, x 0.8…19.2 and 19.2…37.6, h 22,
 * gabled, roof h 4), way/776243839 (west dome, Ø 18, h 24, min 18) and
 * way/776243840 (east dome, Ø 18, h 29, min 18). OSM draws both domes about
 * 2 m south of the church's axis; they are centred on the axis here, as in
 * the plan of the building.
 *
 * Heights. Published: the dome 15 m wide (inside) and 35 m high, with twenty
 * windows (Wikipedia "Hagia Irene", en). The crown is drawn at 32.7 m with
 * the finial to 34.8 m. OSM: aisle/narthex block 15 m, bays 18 m walls with
 * 22 m roofs, the west dome 24 m. Estimated from the photos (gg1, ninara,
 * halun16, scaled from the 18 m walls): the tympanum arches crowning at
 * 21 m (rise 4 m over the 18.4 m bays), the drum 20.6–26.4 m with the pale
 * band to 29.8 m and a 2.5 m dome rise, the bema block 19 m, side chambers 14 m, apse 13 m,
 * window sizes and tiers. The atrium wings (no outside photo shows them
 * whole) are drawn 7.5 m high with an arcade round the courtyard; the north
 * annex (Ottoman entrance and walls) 7 m. Both are estimates.
 *
 * Ground: no Mapterhorn z15 terrain here (tools/terrain.ts 404s) and no
 * lidar (Turkey). The church stands low: its floor is below the first court
 * on the west and south, where excavations and trenches run along the walls
 * (se2006, se2015, misterno), while the lawns on the east and north meet the
 * walls close to the floor (gg1, gg2, ninara). The walls run down to y = 0
 * everywhere and elevation stays 0: the map puts y = 0 on the lowest ground
 * under the footprint and the higher court side sinks into it (STYLE.md
 * "Ground"). No doors or windows are put in the bottom 3.5 m.
 *
 * Night: walls floodlit softly, windows glow.
 *
 * Photos (evidence, Wikimedia Commons):
 *  ext      "Hagia Irene exterior.JPG", Mattias Hill, CC BY-SA 4.0
 *  ninara   "Hagia Irene, Istanbul (52112279404).jpg", Ninara, CC BY 2.0
 *  halun16  "Hagia Irene, Istanbul, 20260605 1123 1116.jpg", Jakub Hałun, CC BY 4.0
 *  halun15  "Hagia Irene, Istanbul, 20260605 1123 1115.jpg", Jakub Hałun, CC BY 4.0
 *  hs       "Hagia Irene with Hagia Sophia at the back, İstanbul.JPG", Berkay0652, CC BY-SA 4.0
 *  j1, j2   "Hagia Irene (1).jpg", "Hagia Irene (2).jpg", Jaba1977, CC BY-SA 4.0
 *  church   "Hagia Irene church.JPG", Mattias Hill, CC BY-SA 4.0
 *  se2006   "Istanbul Hagia Eirene SE Side in 2006 13 7532.jpg", Dosseman, CC BY-SA 4.0
 *  se2015   "Istanbul Hagia Eirene SE Side in 2015 03 5534.jpg", Dosseman, CC BY-SA 4.0
 *  gg1, gg2 "Hagia Irene - Topkapı Palace, Cankurtaran, Fatih, İstanbul, Turkey -
 *           October 10, 2025 01.jpg" and "… 02.jpg", Giorgio Galeotti, CC BY-SA 4.0
 *  misterno "Aya İrini - panoramio.jpg", Mister No, CC BY 3.0
 * Look-only: none.
 *
 * Doubts: the atrium wings and the north annex are seen in no photo from
 * outside and are plain estimates; the apse projects only 2.6 m in OSM
 * though it looks deeper in gg1 (OSM kept); the drum's window count is
 * published, the window size estimated.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, box, capPoly, ccw, circle, prism, save, smoothWall, wall, type XY } from './atl-flatiron-building'
import { archShape, onWall, revolve } from './atl-tech-tower'

const brick = new Part(), stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part()

const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
/** A flat convex polygon, wound to face along n. */
function poly(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/**
 * A segmental barrel over x0…x1 (the arch spans x), running along y from y0
 * to y1, springing at z and rising `rise`. The barrel's top is `top`, its
 * end faces (the tympana) are `face`, with an eave lip `lip` metres out.
 */
function barrel(top: Part, face: Part, x0: number, x1: number, y0: number, y1: number, z: number, rise: number, seg = 10, lip = 0.5) {
  const half = (x1 - x0) / 2, xc = (x0 + x1) / 2
  const R = (half * half + rise * rise) / (2 * rise), zc = z + rise - R, a0 = Math.asin(half / R)
  const pts = Array.from({ length: seg + 1 }, (_, i) => { const a = -a0 + (2 * a0 * i) / seg; return [Math.sin(a), Math.cos(a)] })
  const P = (k: number, y: number, r = R): V3 => [xc + r * pts[k][0], y, zc + r * pts[k][1]]
  const N = (k: number): V3 => [pts[k][0], 0, pts[k][1]]
  // the lead skin, a little over the walls, with a thin edge
  const Y0 = y0 - lip, Y1 = y1 + lip, Ro = R + 0.35
  for (let i = 0; i < seg; i++) {
    top.tri(P(i, Y0, Ro), P(i + 1, Y0, Ro), P(i + 1, Y1, Ro), undefined, undefined, undefined, [N(i), N(i + 1), N(i + 1)])
    top.tri(P(i, Y0, Ro), P(i + 1, Y1, Ro), P(i, Y1, Ro), undefined, undefined, undefined, [N(i), N(i + 1), N(i)])
    for (const [y, s] of [[Y0, -1], [Y1, 1]] as [number, number][]) poly(top, [P(i, y, R), P(i + 1, y, R), P(i + 1, y, Ro), P(i, y, Ro)], [0, s, 0])
    poly(top, [P(i, Y0, R), P(i + 1, Y0, R), P(i + 1, Y1, R), P(i, Y1, R)], [0, 0, -1])
  }
  // tympana: the wall faces from z up to the arch, at y0 and y1
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    poly(face, [[x0, y, z], [x1, y, z], ...pts.map((_, k) => P(seg - k, y))].reverse() as V3[], [0, s, 0])
  }
}

/** A dome profile: radius R at z0 rising `rise` to the crown, elliptical. */
const domeProf = (R: number, z0: number, rise: number, k = 6, lip = 0): [number, number][] => {
  const pr: [number, number][] = lip ? [[R + lip, z0 - 0.3], [R + lip, z0]] : []
  for (let i = 0; i <= k; i++) { const t = (i / k) * (Math.PI / 2); pr.push([R * Math.cos(t), z0 + rise * Math.sin(t)]) }
  pr[pr.length - 1][0] = 0
  return pr
}

/** Arched window panels along a wall a→b (outside to the right), at s positions. */
function windows(a: XY, b: XY, ss: number[], w: number, z0: number, zs: number, out = 0.06) {
  for (const s of ss) onWall(win, a, b, archShape(s, w, z0, zs, 6), out)
}
const spread = (s0: number, s1: number, n: number) => Array.from({ length: n }, (_, i) => s0 + ((s1 - s0) * (i + 0.5)) / n)

// ───────────────────────────────── the plan ────────────────────────────────

const CY = -2.1 // the church's axis
const YS = -18.9, YN = 14.7 // south and north walls
const XW = -8.3, XE = 48.3 // narthex west wall, bema east wall
const B0 = 0.8, B1 = 19.2, B2 = 37.6 // bay divisions
const Z_AISLE = 15, Z_WALL = 17.5, RISE = 3.5

// 1. Narthex (west of the bays), lower, with a lead roof.
box(brick, XW, B0, YS, YN, 0, Z_AISLE, lead, 0.4)

// 2. The two bays, full width, walls to 17.5 with the arched tympana and
//    their barrel roofs running north–south.
for (const [x0, x1] of [[B0, B1], [B1, B2]]) {
  wall(brick, ccw([[x0, YS], [x1, YS], [x1, YN], [x0, YN]]), 0, Z_WALL)
  barrel(lead, brick, x0, x1, YS, YN, Z_WALL, RISE, 10)
}

// 3. The bema block east of the bays and the lower side chambers.
box(brick, B2, XE, CY - 7.2, CY + 7.2, 0, 19, lead, 0.4)
box(brick, B2, XE, YS, CY - 7.2, 0, 14, lead, 0.4)
box(brick, B2, XE, CY + 7.2, YN, 0, 14, lead, 0.4)
// the apse (OSM's three-sided bump)
const APSE: XY[] = [[XE, 3.7], [XE - 0.4, 3.7], [XE - 0.4, -8.7], [48.2, -8.7], [50.8, -6.5], [50.9, 0.8]]
prism(brick, ccw(APSE), 0, 13, lead, 0.35)

// 4. Pilaster buttresses on the long walls at the bay lines and the corners.
for (const x of [XW + 1.2, B0, B1, B2, XE - 1.2]) {
  for (const s of [-1, 1]) {
    const y = s < 0 ? YS : YN
    const z1 = x === XW + 1.2 || x === XE - 1.2 ? 14.6 : Z_WALL + 0.6
    box(brick, x - 1.2, x + 1.2, s < 0 ? y - 0.9 : y - 0.2, s < 0 ? y + 0.2 : y + 0.9, 0, z1, lead, 0.3)
  }
}
// the pale stone socle the photos show round the base (lower courses)
for (const s of [-1, 1]) {
  const y = s < 0 ? YS - 0.08 : YN + 0.08
  poly(stone, [[XW, y, 0], [XE, y, 0], [XE, y, 2.2], [XW, y, 2.2]], [0, s, 0])
}

// 5. The east dome: square base over the barrels, the drum, the pale band,
//    the lead dome and the finial.
const DX = (B1 + B2) / 2, DR = 8.6
box(brick, B1 + 1.5, B2 - 1.5, CY - 7.6, CY + 7.6, Z_WALL, 21.0, lead, 0.3)
smoothWall(brick, circle([DX, CY], DR, 24), 20.6, 26.4)
// twenty arched windows round the drum with brick piers between
for (let i = 0; i < 20; i++) {
  const a0 = (i / 20) * TAU, a1 = ((i + 1) / 20) * TAU
  const pA: XY = [DX + (DR + 0.02) * Math.cos(a0), CY + (DR + 0.02) * Math.sin(a0)]
  const pB: XY = [DX + (DR + 0.02) * Math.cos(a1), CY + (DR + 0.02) * Math.sin(a1)]
  const L = Math.hypot(pB[0] - pA[0], pB[1] - pA[1])
  onWall(win, pA, pB, archShape(L / 2, 1.6, 21.4, 25.0, 5), 0.06)
}
smoothWall(stone, circle([DX, CY], DR + 0.1, 24), 26.4, 29.8)
revolve(stone, [DX, CY], [[DR + 0.1, 29.8], [DR + 0.45, 29.85], [DR + 0.45, 30.15], [DR - 0.5, 30.2]], 24, 0, true, false)
revolve(lead, [DX, CY], domeProf(DR - 0.5, 30.2, 2.5, 5), 24)
// the finial: a ball and a spike
revolve(gilt, [DX, CY], [[0.2, 32.5], [0.5, 33.0], [0.2, 33.5], [0.32, 33.8], [0, 35.0]], 6)

// 6. The west bay's low elliptical dome.
{
  const X = (B0 + B1) / 2
  smoothWall(brick, circle([X, CY], 7.4, 20), Z_WALL + 1, 21.0)
  revolve(lead, [X, CY], domeProf(7.4, 21.0, 3.0, 4, 0.3), 20)
}

// 7. Windows. The long walls: per bay two tiers of five and three under the
//    arch; the narthex two tiers; the bema and side chambers.
for (const s of [-1, 1]) {
  const y = s < 0 ? YS : YN
  // wall a→b with the outside to the right: south runs east→west… no: for
  // the south wall (outside −y) a→b runs west→east; north east→west.
  const a: XY = s < 0 ? [XW, y] : [XE, y], b: XY = s < 0 ? [XE, y] : [XW, y]
  const S = (x: number) => (s < 0 ? x - XW : XE - x)
  for (const [x0, x1] of [[B0, B1], [B1, B2]]) {
    windows(a, b, spread(x0 + 1.6, x1 - 1.6, 5).map(S), 1.7, 4.4, 7.2)
    windows(a, b, spread(x0 + 1.6, x1 - 1.6, 5).map(S), 1.7, 9.3, 12.1)
    windows(a, b, spread(x0 + 4.2, x1 - 4.2, 3).map(S), 2.1, 14.3, 17.3)
  }
  windows(a, b, spread(XW + 2.4, B0 - 1.4, 2).map(S), 1.5, 4.4, 7.0)
  windows(a, b, spread(XW + 2.4, B0 - 1.4, 2).map(S), 1.5, 9.3, 11.9)
  windows(a, b, spread(B2 + 1.8, XE - 2.4, 2).map(S), 1.5, 5.0, 8.4)
}
// East end: the apse's three big windows, the bema's window over it, the
// side chambers' windows.
{
  const fa: XY[] = [[48.2, -8.7], [50.8, -6.5], [50.9, 0.8], [XE, 3.7]]
  for (let i = 0; i < 3; i++) {
    const L = Math.hypot(fa[i + 1][0] - fa[i][0], fa[i + 1][1] - fa[i][1])
    windows(fa[i], fa[i + 1], [L / 2], Math.min(2.2, L * 0.55), 4.6, 9.6)
  }
  const ea: XY = [XE, CY - 7.2], eb: XY = [XE, CY + 7.2]
  windows(ea, eb, [3.3, 7.2, 11.1], 1.8, 14.2, 16.8)
  for (const [y0, y1] of [[YS, CY - 7.2], [CY + 7.2, YN]]) windows([XE, y0], [XE, y1], [(y1 - y0) / 2], 2.0, 5.0, 9.2)
}
// The narthex's west face above the atrium roof.
windows([XW, YN], [XW, YS], spread(2, YN - YS - 2, 5), 1.6, 9.0, 11.8)
// The tympana: the arch reads as a pale brick-and-stone rim (ext, ninara).
for (const s of [-1, 1]) {
  const y = (s < 0 ? YS : YN) + s * 0.07
  for (const [x0, x1] of [[B0, B1], [B1, B2]]) {
    const half = (x1 - x0) / 2, xc = (x0 + x1) / 2, R = (half * half + RISE * RISE) / (2 * RISE), zc = Z_WALL + RISE - R, a0 = Math.asin(half / R)
    for (let i = 0; i < 10; i++) {
      const t0 = -a0 + (2 * a0 * i) / 10, t1 = -a0 + (2 * a0 * (i + 1)) / 10
      const q = (t: number, r: number): V3 => [xc + r * Math.sin(t), y, zc + r * Math.cos(t)]
      poly(stone, [q(t0, R - 0.7), q(t1, R - 0.7), q(t1, R - 0.05), q(t0, R - 0.05)], [0, s, 0])
    }
  }
}

// 8. The atrium: four wings round the courtyard (OSM's inner ring), with an
//    arcade of piers facing it, and the north annex.
{
  const ZA = 7.5, AZ = 4.6, D = 2.8 // wing height, arcade height, arcade depth
  const CX0 = -36.6, CX1 = -15.5, CY0 = -6.9, CY1 = 2.6
  const wx = (y: number) => -48.19 + (-3.52 * (y + 18.47)) / 32.49 // the slanted west edge
  // wings, set back D from the courtyard
  prism(stone, ccw([[wx(YS + 0.4), YS + 0.4], [XW, YS + 0.4], [XW, CY0 - D], [wx(CY0 - D), CY0 - D]]), 0, ZA, lead, 0.35)
  prism(stone, ccw([[wx(CY1 + D), CY1 + D], [XW, CY1 + D], [XW, 14.85], [wx(14.0), 14.0]]), 0, ZA, lead, 0.35)
  prism(stone, ccw([[wx(CY0 - D), CY0 - D], [CX0 - D, CY0 - D], [CX0 - D, CY1 + D], [wx(CY1 + D), CY1 + D]]), 0, ZA, lead, 0.35)
  prism(stone, ccw([[CX1 + D, CY0 - D], [XW, CY0 - D], [XW, CY1 + D], [CX1 + D, CY1 + D]]), 0, ZA, lead, 0.35)
  // the arcade: a band over the piers, round the courtyard
  const ring: XY[] = [[CX0, CY0], [CX1, CY0], [CX1, CY1], [CX0, CY1]]
  const outer: XY[] = [[CX0 - D, CY0 - D], [CX1 + D, CY0 - D], [CX1 + D, CY1 + D], [CX0 - D, CY1 + D]]
  for (let i = 0; i < 4; i++) {
    const a = ring[i], b = ring[(i + 1) % 4], A = outer[i], B = outer[(i + 1) % 4]
    // the band's outer (courtyard-facing) skin is the ring edge; it faces into the courtyard
    const n: V3 = nrm([-(b[1] - a[1]), b[0] - a[0], 0])
    poly(stone, [[a[0], a[1], AZ], [b[0], b[1], AZ], [b[0], b[1], ZA], [a[0], a[1], ZA]], n)
    poly(lead, [[a[0], a[1], ZA], [b[0], b[1], ZA], [B[0], B[1], ZA], [A[0], A[1], ZA]], [0, 0, 1])
    poly(stone, [[a[0], a[1], AZ], [b[0], b[1], AZ], [B[0], B[1], AZ], [A[0], A[1], AZ]], [0, 0, -1])
    // piers
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.round(L / 3.6)
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], o: XY = [-n[0], -n[1]]
    for (let j = 0; j <= k; j++) {
      const c: XY = [a[0] + t[0] * (L * j) / k + o[0] * 0.45, a[1] + t[1] * (L * j) / k + o[1] * 0.45]
      box(stone, c[0] - 0.45, c[0] + 0.45, c[1] - 0.45, c[1] + 0.45, 0, AZ, null, 0)
    }
  }
  // the north annex (Ottoman entrance court and walls)
  prism(stone, ccw([[-9.62, 14.85], [-9.87, 25.27], [-0.38, 25.36], [-0.44, 29.58], [8.70, 29.27], [8.64, 25.55], [16.15, 25.09], [16.07, 14.64]]), 0, 7, lead, 0.35)
}

const walls = (_p: V3, n: V3) => (n[2] < 0.6 ? 0.6 : 0.15)
await save('istanbul-hagia-irene', 'Hagia Irene', [
  { part: brick, material: { ...finish('irene-brick', 0xa0614c), floodlight: walls } },
  { part: stone, material: { ...PALETTE.stone, floodlight: walls } },
  { part: lead, material: finish('irene-lead', 0xa3acb5, 0.6) },
  { part: win, material: PALETTE.window },
  { part: gilt, material: finish('irene-gilt', 0xd8aa45, 0.5) },
], { height: 35, anchor: [41.009835, 28.980963], bearing: 40.6 }, 6500)
