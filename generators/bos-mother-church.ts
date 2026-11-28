/**
 * The First Church of Christ, Scientist (the Mother Church), Christian
 * Science Plaza, Boston: the Original Mother Church (1894, Franklin I.
 * Welch; New Hampshire granite, Romanesque) and the Mother Church Extension
 * (1904–06, Charles Brigham and S. S. Beman; Bedford limestone, Italian
 * Renaissance / Byzantine, with the great dome), and the extension's
 * semicircular Massachusetts Avenue portico (1975, Araldo Cossutta) —
 * original procedural geometry, CC0-1.0.
 * bun generators/bos-mother-church.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Anchor = the centre of OSM way/240255388, -71.08499,
 * 42.34444. Bearing 340: +x runs ENE (compass 70) from the extension's
 * portico on Massachusetts Avenue (-x) through the dome to the original
 * church's tower (+x); +y is NNW (the Publishing House side), -y the plaza
 * and the reflecting pool. The extension's walls and the original church's
 * gables run square to this frame.
 *
 * Identity (from the photos below):
 *  1. The great limestone dome: a ribbed, pale tiled dome on a tall drum
 *     ringed with arched windows and a balustrade, and the open lantern
 *     with its small dome and finial.
 *  2. The square limestone block under it: corner towers with triple
 *     arched windows, an attic with balustrade, pedimented west and east
 *     arms, and two curved bays (north and south) each with a small ribbed
 *     dome.
 *  3. The 1975 semicircular colonnade on Massachusetts Avenue: giant
 *     Corinthian columns round a curved glass wall, entablature and
 *     balustrade, on a ring of steps, the west pediment above it.
 *  4. The original church in grey granite at the east tip of the lot: a
 *     cross-gabled slate roof with the rose window facing the plaza, and the
 *     square bell tower with its triple belfry arches and steep slate
 *     pyramid, a round turret at its foot.
 *
 * Plan: OSM way/240255388 and its building:part ways, turned to bearing 340,
 * checked against the lidar (OSM's outline is drawn 2–4 m off the lidar in
 * places; the lidar wins). Dome centre (-1, -2); core block x -20.5..17.5,
 * y -21..17; corner towers ~7 x 6.5 at its corners; west arm x -31..-20.5,
 * y -13..10; portico a half ring of radius 10.5 about (-31, -1.5); south
 * lobe the OSM polygon (-17,-21) (-17,-37) (-10,-37.5) (19.5,-22) and its
 * curved bay about (-1, -24); north lobe from OSM (-15.6,17) (-13.4,30.7)
 * (-6.3,34.3) (21.3,15.7), its bay about (-1, 21); original church gable
 * x 21..33, y -17..11, the rest of the wedge to x 41; tower x 41..48,
 * y -7.5..-0.5 (lidar; OSM has it 2–3 m further west); turret about
 * (49.3, -4).
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 0.5 m
 * grid, read with tools/lidar_frame.py at bearing 340; y = 0 is the plaza,
 * 3.2 m above the grid's ground_min (the site is flat: lidar ground 3.1–3.3,
 * Mapterhorn 1.2–2.7 over 100 m). Measured: finial 66.2 (lidar maximum),
 * lantern 60–63, dome crown 55.3 at the lantern's base, dome springing
 * about 42.5 with a radius of 12.8, drum balustrade 43.8, attic 31.3,
 * corner towers 34.6 (south-east 33), west and east pediments' ridges 30.8,
 * eaves 26; the curved bays' domes 27.8 (south) and 27.1 (north); the lobes
 * and the portico 18.8; original church ridge 19.1, eaves 11.6, the hip
 * toward the tower 16.5; tower walls 27.3, pyramid surface 34.2 near the
 * apex (apex drawn 34.6, cross to 37; published steeple 126 ft, Wikipedia
 * citing Ivey, Prayers in Stone, 1999); turret 9.3.
 *
 * Estimated from the photos: the drum's 24 arched windows (Farragutful 02,
 * Daderot DSC03995: about 1.7 m wide from 35.2 to 39.4); the dome's 16 ribs
 * (Karlunun); the lantern's stages (Karlunun, Farragutful 02); the portico's
 * ten columns (Cryptic C62 (1): eight across the front) and its glass wall;
 * the corner towers' triple windows (anonymous Commons photo from the
 * south-west, Daderot DSC03995); the pediments' lunettes; the small domes'
 * drums; the original church's rose window, paired arches and doors
 * (Daderot DSC03992), the belfry's triple arches and the turret
 * (Farragutful 01).
 *
 * Night: the dome, the drum and the lantern are floodlit (Sarah Nichols's
 * night view from the reflecting pool), the extension's upper walls and
 * the original tower dimly; windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - The First Church of Christ, Scientist, Boston, aerial shot (2), 19 July
 *    2011.jpg, Sarah Nichols, CC BY-SA 2.0 (from 177 Huntington, NE: plan,
 *    roofs, the bays' domes, the original church)
 *    https://commons.wikimedia.org/wiki/File:The_First_Church_of_Christ,_Scientist,_Boston,_aerial_shot_(2),_19_July_2011.jpg
 *  - 2024 The First Church of Christ, Scientist - Boston 01.jpg and 02.jpg,
 *    Farragutful, CC BY-SA 4.0 (original church and tower from the north-east;
 *    the dome and lantern)
 *    https://commons.wikimedia.org/wiki/File:2024_The_First_Church_of_Christ,_Scientist_-_Boston_01.jpg
 *    https://commons.wikimedia.org/wiki/File:2024_The_First_Church_of_Christ,_Scientist_-_Boston_02.jpg
 *  - The First Church of Christ, Scientist, Boston, 17 April 2011 (1).jpg and
 *    (2).jpg, Cryptic C62, CC BY-SA 3.0 (the portico from the west; the
 *    north-west)
 *    https://commons.wikimedia.org/wiki/File:The_First_Church_of_Christ,_Scientist,_Boston,_17_April_2011_(1).jpg
 *  - Christian Science Mother Church, Boston, Massachusetts.JPG, CC BY-SA 3.0
 *    (from the south-west: portico, south-west tower, south bay)
 *    https://commons.wikimedia.org/wiki/File:Christian_Science_Mother_Church,_Boston,_Massachusetts.JPG
 *  - The First Church of Christ, Scientist - Boston, MA - DSC03992.JPG and
 *    DSC03995.JPG, Daderot, CC0 (the plaza side; the south bay and dome)
 *    https://commons.wikimedia.org/wiki/File:The_First_Church_of_Christ,_Scientist_-_Boston,_MA_-_DSC03992.JPG
 *  - Boston First Church of Christ Scientist Kuppel S 9484 20190430.jpg,
 *    Karlunun, CC BY-SA 4.0 (dome and lantern close up)
 *    https://commons.wikimedia.org/wiki/File:Boston_First_Church_of_Christ_Scientist_Kuppel_S_9484_20190430.jpg
 *  - The First Church of Christ, Scientist, Boston, 4 November 2014 (1).jpg,
 *    Sarah Nichols, CC BY-SA 2.0 (night, from the pool)
 *    https://commons.wikimedia.org/wiki/File:The_First_Church_of_Christ,_Scientist,_Boston,_4_November_2014_(1).jpg
 * No commercial imagery. NAIP was unavailable (USGS server timing out).
 *
 * Doubts: the north lobe and the north side of the original church are
 * seen only from above and obliquely; their windows are drawn plainly. The
 * lobes' outer blocks (south-west and north-west of the bays) are read
 * from the lidar and drawn as plain flat-topped blocks. The columns pairs
 * on the drum, the carved friezes, the volutes beside the west pediment,
 * the small domes' dormers and the original church's chimneys and
 * pinnacles are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, band, box, gableRoof, hipRoof, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'
import { capPoly, ccw, circle, prism, smoothWall } from './atl-flatiron-building'

const lime = new Part(), dome = new Part(), granite = new Part(), slate = new Part(), win = new Part()
const TAU = Math.PI * 2

type F = [XY, XY]
const faces = (x0: number, x1: number, y0: number, y1: number) => ({
  W: [[x0, y1], [x0, y0]] as F, E: [[x1, y0], [x1, y1]] as F,
  S: [[x0, y0], [x1, y0]] as F, N: [[x1, y1], [x0, y1]] as F,
})
const flen = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])
const arc = (c: XY, r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as XY
  })
/** Arched windows along every edge of a ring longer than `min`, at `step` spacing. */
function ringWindows(p: Part, ring: XY[], tiers: [number, number][], w: number, step: number, min = 4, skip?: (m: XY) => boolean, out = 0.06) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < min) continue
    const n = Math.max(1, Math.floor((L - 1.5) / step)), sp = L / n
    for (let k = 0; k < n; k++) {
      const s = sp * (k + 0.5)
      const m: XY = [a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L]
      if (skip?.(m)) continue
      for (const [z0, z1] of tiers) onWall(p, a, b, archShape(s, w, z0, z1 - w / 2, 4), out)
    }
  }
}
/** A curved wall (open arc, outside facing away from c) with arched windows on each chord. */
function curvedBay(c: XY, r: number, a0: number, a1: number, n: number, z1: number, tiers: [number, number][], w: number) {
  const pts = arc(c, r, a0, a1, n)
  smoothWall(lime, pts, 0, z1, false)
  // the granite ground storey with its arcade
  const gp = arc(c, r + 0.1, a0, a1, n)
  smoothWall(granite, gp, 0, 5.2, false)
  for (let i = 0; i < n; i++) {
    const a = gp[i], b = gp[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(slate, a, b, archShape(L / 2, 1.9, 0, 3.4, 6), 0.06)
  }
  // the roof over the half disc, and a cornice
  capPoly(dome, ccw([...pts, c]), z1, true)
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const [z0, zt] of tiers) onWall(win, a, b, archShape(L / 2, w, z0, zt - w / 2, 4), 0.06)
    // cornice under the balustrade, a little proud
    onWall(lime, a, b, rectShape(-0.05, L + 0.05, z1 - 2.2, z1 - 1.5), 0.25)
  }
}
/** A ribbed dome: a smooth shell and n raised ribs from the springing to the top ring. */
function ribbedDome(c: XY, r: number, z0: number, h: number, top: number, n: number, seg = 16, ribW = 0.35, ribH = 0.18, steps = 7) {
  const th1 = Math.acos(top / r)
  // an ellipse in section, its top ring (radius `top`) at z0 + h
  const prof2: [number, number][] = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (th1 * i) / steps
    return [r * Math.cos(t), z0 + (h * Math.sin(t)) / Math.sin(th1)] as [number, number]
  })
  revolve(dome, c, prof2, seg, 0, false, false)
  // ribs: a raised strip (two sides and a face) along each meridian
  for (let k = 0; k < n; k++) {
    const a = (k / n) * TAU + Math.PI / n, ca = Math.cos(a), sa = Math.sin(a), tx = -sa, ty = ca
    const P = (rr: number, z: number, d: number, side: number): V3 => [c[0] + ca * (rr + d) + tx * side, c[1] + sa * (rr + d) + ty * side, z]
    for (let i = 0; i < prof2.length - 1; i++) {
      const [r0, z0_] = prof2[i], [r1, z1_] = prof2[i + 1]
      // outward offset along the surface normal, approximated radially/up
      const nr0 = r0 / r, nz0 = Math.sqrt(Math.max(0, 1 - nr0 * nr0)), nr1 = r1 / r, nz1 = Math.sqrt(Math.max(0, 1 - nr1 * nr1))
      const o0: [number, number] = [r0 + nr0 * ribH, z0_ + nz0 * ribH], o1: [number, number] = [r1 + nr1 * ribH, z1_ + nz1 * ribH]
      const A = P(r0, z0_, 0, -ribW / 2), B = P(r0, z0_, 0, ribW / 2), C = P(r1, z1_, 0, ribW / 2), D = P(r1, z1_, 0, -ribW / 2)
      const A2 = P(o0[0], o0[1], 0, -ribW / 2), B2 = P(o0[0], o0[1], 0, ribW / 2), C2 = P(o1[0], o1[1], 0, ribW / 2), D2 = P(o1[0], o1[1], 0, -ribW / 2)
      lime.quad(A2, B2, C2, D2)
      lime.quad(B, C, C2, B2)
      lime.quad(D, A, A2, D2)
    }
  }
}

// ═══════════════════════ The Extension ═══════════════════════
const DC: XY = [-1, -2] // dome centre
const CX0 = -20.5, CX1 = 17.5, CY0 = -21, CY1 = 17, ATTIC = 31.3

// ── Core block with its main cornice and attic balustrade ──
box(lime, CX0, CX1, CY0, CY1, 0, ATTIC, dome, 0.3)
{
  const ring: XY[] = [[CX0, CY0], [CX1, CY0], [CX1, CY1], [CX0, CY1]]
  band(lime, ring, 26.6, 0.9, 0.45)
  band(lime, ring, ATTIC - 1.4, 0.35, 0.12, null)
}

// ── Corner towers ──
const towers: [number, number, number, number, number][] = [
  [-25.5, -18, 10.8, 17.6, 34.6], // north-west
  [-26, -18.5, -21.6, -14.6, 34.6], // south-west
  [10.8, 18.2, 12.2, 19.2, 34.6], // north-east
  [10.8, 18.2, -21.8, -14.6, 33.0], // south-east
]
for (const [x0, x1, y0, y1, top] of towers) {
  box(lime, x0, x1, y0, y1, 0, top, dome, 0.35)
  band(lime, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], top - 6.4, 0.7, 0.3)
  band(lime, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], top - 0.9, 0.5, 0.25, null)
  const f = faces(x0, x1, y0, y1)
  for (const g of [f.W, f.E, f.S, f.N]) {
    const L = flen(g), m = L / 2
    // the triple arched windows of the top stage
    for (const d of [-1.45, 0, 1.45]) onWall(win, g[0], g[1], archShape(m + d, 1.05, top - 5.3, top - 2.6, 6), 0.06)
    // a tall arched window on the middle stage and a square one under it
    onWall(win, g[0], g[1], archShape(m, 1.6, 19.6, 23.2, 6), 0.06)
    onWall(win, g[0], g[1], rectShape(m - 0.7, m + 0.7, 13.8, 16.2), 0.06)
  }
}

// ── West arm with its pediment, and the east pediment over the old church ──
for (const [x0, x1] of [[-31, CX0], [CX1, 20.6]]) {
  box(lime, x0, x1, -13, 10, 0, 26, null, 0)
  band(lime, [[x0, -13], [x1, -13], [x1, 10], [x0, 10]], 25.0, 1.0, 0.45, null)
  gableRoof(dome, lime, x0, x1, -13, 10, 26, 30.8, 'x', 0.5, 0.45)
  const f = faces(x0, x1, -13, 10), g = x0 < 0 ? f.W : f.E, L = flen(g)
  // the lunette in the pediment
  onWall(win, g[0], g[1], archShape(L / 2, 3.6, 26.2, 26.2, 8), 0.5)
  if (x0 > 0) {
    // the big arched window of the east face over the old church's roof
    onWall(lime, g[0], g[1], archShape(L / 2, 10.6, 18.5, 19.5, 10), 0.05)
    onWall(win, g[0], g[1], archShape(L / 2, 8.8, 19.2, 19.5, 10), 0.1)
  } else {
    // the west face above the portico: three arched windows
    for (const d of [-4, 0, 4]) onWall(win, g[0], g[1], archShape(L / 2 + d, 1.8, 19.8, 23.2, 6), 0.06)
  }
}

// ── The Massachusetts Avenue portico (1975): a half ring of columns ──
{
  const C: XY = [-31, -1.5], a0 = Math.PI / 2, a1 = (3 * Math.PI) / 2
  const R = 10.5, RO = 11.3, RI = 9.1, RG = 7.2, ZC = 14.6, ZE = 17.4, ZB = 18.8
  // steps: a half disc
  const step = (r: number, z0: number, z1: number) => {
    const pts = arc(C, r, a0, a1, 12)
    smoothWall(lime, pts, z0, z1, false)
    capPoly(lime, ccw([...pts]), z1, true)
  }
  step(12.6, 0, 0.6)
  step(11.9, 0.6, 1.2)
  // the curved glass wall behind the columns
  const glassRing = arc(C, RG, a0, a1, 12)
  smoothWall(win, glassRing, 1.2, ZC, false)
  // columns
  for (let k = 0; k < 10; k++) {
    const a = a0 + ((k + 0.5) / 10) * Math.PI
    const c: XY = [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)]
    smoothWall(lime, circle(c, 0.72, 8), 1.2, ZC - 1.0)
    revolve(lime, c, [[0.72, ZC - 1.0], [1.0, ZC]], 8, 0, false, false)
  }
  // entablature: outer face, soffit, inner face; flat roof; balustrade
  const out = arc(C, RO, a0, a1, 16), inn = arc(C, RG, a0, a1, 16)
  smoothWall(lime, out, ZC, ZE, false)
  for (let i = 0; i < 16; i++) {
    const p = out[i], q = out[i + 1], pi = inn[i], qi = inn[i + 1]
    lime.quad([pi[0], pi[1], ZC], [qi[0], qi[1], ZC], [q[0], q[1], ZC], [p[0], p[1], ZC]) // soffit
  }
  capPoly(dome, ccw([...arc(C, RO - 0.6, a0, a1, 16)]), ZB - 0.2, true)
  const bal = arc(C, RO - 0.25, a0, a1, 16)
  smoothWall(lime, bal, ZE, ZB, false)
  const bin = arc(C, RO - 0.6, a0, a1, 16)
  for (let i = 0; i < 16; i++) lime.quad([bin[i][0], bin[i][1], ZB], [bal[i][0], bal[i][1], ZB], [bal[i + 1][0], bal[i + 1][1], ZB], [bin[i + 1][0], bin[i + 1][1], ZB])
  void RI
}

// ── North and south lobes with their curved bays and small domes ──
const LOBE = 18.8
const lobes: { poly: XY[]; c: XY; face: number; top: number }[] = [
  { poly: [[-17, -21], [-17, -37], [-10, -37.5], [19.5, -22], [17.5, -21]], c: [-1, -24], face: Math.atan2(-0.886, 0.465), top: 27.8 },
  { poly: [[17.5, 17], [21.3, 15.7], [-6.3, 34.3], [-11, 33.8], [-13.4, 30.7], [-15.6, 17]], c: [-1, 21], face: Math.atan2(0.829, 0.559), top: 27.1 },
]
for (const L of lobes) {
  const ring = ccw(L.poly)
  prism(lime, ring, 0, LOBE, dome, 0.3)
  band(lime, ring, LOBE - 2.2, 0.7, 0.3, null)
  band(granite, ring, 0, 5.2, 0.1, null)
  const rb = 9.4
  ringWindows(slate, ring, [[0.0, 4.3]], 2.0, 3.2, 4, (m) => Math.hypot(m[0] - L.c[0], m[1] - L.c[1]) < rb + 1, 0.16)
  ringWindows(win, ring, [[6.4, 9.8], [11.4, 14.8]], 1.4, 3.2, 4, (m) => Math.hypot(m[0] - L.c[0], m[1] - L.c[1]) < rb + 1)
  // the bay: a half cylinder bulging from the lobe's diagonal face
  curvedBay(L.c, rb, L.face - Math.PI / 2, L.face + Math.PI / 2, 10, LOBE + 0.2, [[6.4, 9.8], [11.4, 14.8]], 1.25)
  // its drum and ribbed dome
  smoothWall(lime, circle(L.c, 8.2, 16), LOBE, LOBE + 1.3)
  ribbedDome(L.c, 7.9, LOBE + 1.3, L.top - LOBE - 1.6, 1.0, 8, 16, 0.4, 0.2, 5)
  revolve(lime, L.c, [[1.0, L.top - 0.3], [1.0, L.top], [0, L.top + 0.6]], 8, 0, false, true)
}

// ── Drum, dome and lantern ──
{
  const RD = 14.8, Z0 = ATTIC, Z1 = 42.3, N = 24
  const ring = circle(DC, RD, N, Math.PI / N)
  smoothWall(lime, ring, Z0, Z1)
  band(lime, circle(DC, RD, N, Math.PI / N), Z1 - 0.9, 0.9, 0.5, null)
  band(lime, circle(DC, RD, N, Math.PI / N), 34.3, 0.4, 0.15, null)
  for (let i = 0; i < N; i++) {
    const a = ring[i], b = ring[(i + 1) % N], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, archShape(L / 2, 2.3, 34.9, 38.9, 6), 0.06)
  }
  // the balustrade ring round the dome's foot
  const bal = circle(DC, RD - 0.3, N, Math.PI / N), inner = circle(DC, 12.8, N, Math.PI / N)
  smoothWall(lime, bal, Z1, 43.8)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    lime.quad([inner[i][0], inner[i][1], 43.8], [bal[i][0], bal[i][1], 43.8], [bal[j][0], bal[j][1], 43.8], [inner[j][0], inner[j][1], 43.8])
  }
  ribbedDome(DC, 12.8, 43.8, 55.3 - 43.8, 2.4, 16, 24, 0.45, 0.22)
  // lantern: base ring, open drum with arched lights, cornice, cap and finial
  revolve(lime, DC, [[3.1, 55.0], [3.1, 56.0], [2.4, 56.0]], 12, 0, false, false)
  const lr = circle(DC, 2.35, 8, Math.PI / 8)
  smoothWall(lime, lr, 56.0, 59.8)
  for (let i = 0; i < 8; i++) {
    const a = lr[i], b = lr[(i + 1) % 8], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    onWall(win, a, b, archShape(L / 2, 0.9, 56.6, 58.7, 5), 0.05)
  }
  revolve(lime, DC, [[2.85, 59.8], [2.85, 60.4], [2.1, 60.4], [2.1, 61.0], [1.9, 61.0]], 12, 0, false, false)
  revolve(dome, DC, [[1.9, 61.0], [1.6, 62.0], [0.9, 62.7], [0.35, 63.0]], 12, 0, false, false)
  revolve(lime, DC, [[0.35, 63.0], [0.35, 63.8], [0.55, 64.3], [0.2, 65.0], [0.12, 66.2], [0, 66.25]], 8, 0, false, true)
}

// ═══════════════════════ The Original Mother Church ═══════════════════════
{
  const E = 11.6
  // the wedge of the lot, from the extension to the tower
  const body = ccw([[20.6, -17.5], [23, -17.3], [31.1, -15], [38.7, -11], [41, -9.5], [41, 1.5], [39.3, 3.9], [36.2, 6.1], [32, 9], [21.3, 15.7], [20.6, 15.7]])
  prism(granite, body, 0, E, slate, 0.25)
  band(granite, body, E - 0.6, 0.6, 0.25, null)
  ringWindows(win, body, [[2.4, 4.6], [6.0, 9.0]], 1.15, 3.0, 3.5, (m) => m[1] < -14 && m[0] < 33.5)
  // the cross gable with the rose window to the plaza
  const GX0 = 21, GX1 = 33, GY0 = -17.6, GY1 = 11
  box(granite, GX0, GX1, GY0, GY1, 0, E, null, 0)
  gableRoof(slate, granite, GX0, GX1, GY0, GY1, E, 19.1, 'y', 0.4, 0.3)
  const S = faces(GX0, GX1, GY0, GY1).S, Lg = flen(S), m = Lg / 2
  const ring = (r: number, z: number, n = 16) => Array.from({ length: n }, (_, i) => [m + r * Math.cos((i / n) * TAU), z + r * Math.sin((i / n) * TAU)] as [number, number])
  onWall(lime, S[0], S[1], ring(2.75, 14.0), 0.05)
  onWall(win, S[0], S[1], ring(2.25, 14.0), 0.1)
  for (const d of [-3.9, -1.3, 1.3, 3.9]) onWall(win, S[0], S[1], archShape(m + d, 1.2, 6.4, 9.6, 6), 0.06)
  for (const d of [-3.0, 0, 3.0]) {
    onWall(lime, S[0], S[1], archShape(m + d, 2.2, 0, 2.7, 8), 0.05)
    onWall(slate, S[0], S[1], archShape(m + d, 1.6, 0, 2.6, 8), 0.1)
  }
  // the north gable: a pair of tall arched windows
  const N = faces(GX0, GX1, GY0, GY1).N
  for (const d of [-1.6, 1.6]) onWall(win, N[0], N[1], archShape(m + d, 1.5, 12.0, 15.6, 6), 0.06)
  // the hip running down toward the tower, and a low roof against the extension
  hipRoof(slate, 31, 41, -11, 3.5, E, 16.5, 0.35)
  // the tower
  const TX0 = 41, TX1 = 48, TY0 = -7.5, TY1 = -0.5, TT = 27.3
  box(granite, TX0, TX1, TY0, TY1, 0, TT, null, 0)
  const tr: XY[] = [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]]
  band(granite, tr, 20.6, 0.5, 0.2, null)
  band(granite, tr, TT - 0.7, 0.7, 0.3, null)
  const T = faces(TX0, TX1, TY0, TY1)
  for (const g of [T.W, T.E, T.S, T.N]) {
    const L = flen(g)
    for (const d of [-1.7, 0, 1.7]) onWall(slate, g[0], g[1], archShape(L / 2 + d, 1.15, 21.6, 24.9, 6), 0.06)
    onWall(win, g[0], g[1], rectShape(L / 2 - 0.35, L / 2 + 0.35, 13.5, 15.6), 0.06)
    onWall(win, g[0], g[1], rectShape(L / 2 - 0.35, L / 2 + 0.35, 16.8, 18.6), 0.06)
  }
  // the steep slate pyramid, small corner pinnacles, the cross
  const o = 0.55, base: V3[] = [[TX0 - o, TY0 - o, TT], [TX1 + o, TY0 - o, TT], [TX1 + o, TY1 + o, TT], [TX0 - o, TY1 + o, TT]]
  const apex: V3 = [(TX0 + TX1) / 2, (TY0 + TY1) / 2, 34.6]
  for (let i = 0; i < 4; i++) slate.tri(base[i], base[(i + 1) % 4], apex)
  slate.cap(base, false)
  for (const [x, y] of [[TX0, TY0], [TX1, TY0], [TX1, TY1], [TX0, TY1]] as XY[]) revolve(granite, [x, y], [[0.45, TT - 0.4], [0.45, TT + 0.8], [0, TT + 2.2]], 6, 0, true, true)
  const ax = apex[0], ay = apex[1]
  box(slate, ax - 0.09, ax + 0.09, ay - 0.09, ay + 0.09, 34.3, 37.0, slate, 0)
  box(slate, ax - 0.09, ax + 0.09, ay - 0.6, ay + 0.6, 35.8, 36.1, slate, 0)
  // the round turret at the tip
  const tc: XY = [49.3, -4.0]
  smoothWall(granite, circle(tc, 2.3, 12), 0, 8.4)
  band(granite, circle(tc, 2.3, 12), 7.6, 0.5, 0.15, null)
  revolve(slate, tc, [[2.6, 8.3], [2.6, 8.6], [0, 11.2]], 12, 0, false, true)
  for (const a of [-1.2, 0, 1.2]) {
    const p0: XY = [tc[0] + 2.3 * Math.cos(a - 0.2), tc[1] + 2.3 * Math.sin(a - 0.2)], p1: XY = [tc[0] + 2.3 * Math.cos(a + 0.2), tc[1] + 2.3 * Math.sin(a + 0.2)]
    onWall(win, p0, p1, archShape(0.46, 0.6, 4.2, 6.0, 5), 0.06)
  }
}

// ── Night: the dome, drum and lantern floodlit, the stone above the lobes dimly ──
const lit = (p: V3, n: V3) => {
  const dc = Math.hypot(p[0] - DC[0], p[1] - DC[1])
  if (p[2] > ATTIC - 0.5 && dc < 16) return n[2] > 0.85 ? 0.3 : 0.9
  if (p[0] > 40 && p[2] > 18) return 0.55
  if (p[2] > 14) return n[2] > 0.7 ? 0.1 : 0.45
  return 0.15
}
await save('bos-mother-church', 'The First Church of Christ, Scientist', [
  { part: lime, material: { ...finish('mother-limestone', 0xe9dcc4), floodlight: lit } },
  { part: dome, material: { ...finish('mother-dome-tile', 0xd2cec4), floodlight: lit } },
  { part: granite, material: { ...finish('mother-granite', 0xb3b1aa), floodlight: lit } },
  { part: slate, material: finish('mother-slate', 0x6f777e) },
  { part: win, material: PALETTE.window },
], { height: 66.25, anchor: [42.34444, -71.08499], bearing: 340 }, 6500)
