/**
 * Old Point Loma Lighthouse (1855), Cabrillo National Monument, San Diego:
 * procedural, CC0-1.0.
 * bun generators/sd-old-point-loma-lighthouse.ts
 *
 * Frame: x across the house (east), y along it (north), z up, metres, turned
 * to the house: the placement bearing is 6.0, the compass direction of its
 * long east wall in OSM. Origin: the placement anchor (lon -117.24098, lat
 * 32.67199); the house's centre is 0.2 m east and 0.2 m south of it (OSM).
 * y = 0 (z here) is the lowest ground under the footprint; the hilltop is
 * flat within half a metre here (Mapterhorn), elevation 0.
 *
 * What it is: a Cape Cod-style keeper's house of whitewashed masonry, one
 * and a half storeys on a basement, with a gabled shingle roof, a chimney at
 * each gable, and the round white tower rising through the middle of the
 * ridge to a black iron gallery and lantern under a green copper dome; lit
 * 15 November 1855, put out 23 March 1891 (Wikipedia; NRHP 74000350).
 *
 * Dimensions: published, from HABS CA-41 (Library of Congress, call number
 * HABS CAL,37-POLO,1-, measured drawings sheet 1, east and north
 * elevations, scaled at 1/4" = 1'; public domain):
 *   house 36' 9" × 20' 1" (11.2 × 6.12 m); eaves 16' 6" (5.0 m) and ridge
 *   23' 4" (7.1 m) above grade; roof pitch about 34°;
 *   tower 9' 10" (3.0 m) across, its top 28' (8.6 m) up; gallery 13' 4"
 *   (4.06 m) across with a 4' 9" railing; lantern 8' 5" (2.56 m) across,
 *   ten-sided (sheet 9), glazing to 11' (3.35 m) above the gallery; dome to
 *   43' (13.1 m); the published tower height is 46 ft (14 m) with the vane
 *   rod (Wikipedia);
 *   first-floor windows 2' 11" wide, 7' to 12' 6" above grade, at ±2.43 m and
 *   ±4.22 m from the centre on both long walls, the door in the middle of
 *   the east wall; one window in each gable.
 * Measured: USGS 3DEP lidar USGS_LPC_CA_WestCoastElNinoUTM11_2016_LAS_2017
 * (2016 El Niño coastal survey; the 2014 San Diego flight stops short of the
 * point), 0.5 m grid: ridge 7 m and tower 13-14 m above the ground, agreeing
 * with HABS. The lidar sits about 1.5 m east of the OSM outline.
 * Plan: OSM way/90687227 (man_made=lighthouse): the house, and a small wing
 * on its west wall (3.1 × 4.3 m), the rebuilt lean-to the photos show, here
 * one storey with a gable roof (estimated: eaves 2.7 m, ridge 4.2 m).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *   "Old Point Loma Lighthouse 01.jpg", Bernard Gagnon, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Old_Point_Loma_Lighthouse_01.jpg
 *   "Old Point Loma Lighthouse 02.jpg", Bernard Gagnon, CC BY-SA 3.0 (lantern)
 *     https://commons.wikimedia.org/wiki/File:Old_Point_Loma_Lighthouse_02.jpg
 *   "Old Point Loma Light Station in 2019.jpg", Frank Schulenburg, CC BY-SA 4.0
 *     https://commons.wikimedia.org/wiki/File:Old_Point_Loma_Light_Station_in_2019.jpg
 *   "Old Point Loma Lighthouse (5322712442).jpg", Brandon, CC BY-SA 2.0
 *     https://commons.wikimedia.org/wiki/File:Old_Point_Loma_Lighthouse_(5322712442).jpg
 *   "Old Point Loma Lighthouse (14463265856).jpg", Pete Markham, CC BY-SA 2.0
 *     https://commons.wikimedia.org/wiki/File:Old_Point_Loma_Lighthouse_(14463265856).jpg
 *   "-The Old Point Loma Lighthouse - panoramio.jpg", Loco Steve, CC BY 3.0
 *     https://commons.wikimedia.org/wiki/File:-The_Old_Point_Loma_Lighthouse_-_panoramio.jpg
 *   "Old Point Loma lighthouse 01.JPG", Ctorbann, CC BY-SA 3.0
 *     https://commons.wikimedia.org/wiki/File:Old_Point_Loma_lighthouse_01.JPG
 *
 * Style: white walls; brown-grey shingle roof; windows as small dark
 * recesses in a charcoal neutral (the house is a museum, dark at night; the
 * light has been out since 1891, so nothing here glows); the gallery an open
 * black railing (top rail and posts); the lantern dark glass panes in black
 * frames (ten mullions and a transom); the dome patina green with its ball.
 *
 * Review, round 1, said the tower and lantern read about twice too big.
 * Re-checked: HABS sheet 1 gives the tower 9' 10" (3.0 m) across against the
 * 36' 9" front, 0.27 of it, and the 2019 photo (Schulenburg) measures 0.30
 * (tower 170 px against a 573 px front, gallery 0.40, lantern 0.26), so the
 * diameters stay at HABS. What read heavy was the solid black railing band
 * and the pale lantern glass; both are corrected (open railing, dark glass).
 *
 * Doubts: the wing's height is estimated from photos. The lantern's mullions,
 * the vane rod and the porch steps are left out (too thin or too small).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, rect, qf, tf, save, cylinder } from './dc-white-house'

const white = new Part(), roof = new Part(), black = new Part(), glass = new Part(), dome = new Part()

const CX = 0.2, CY = -0.2 // the house's centre from the anchor (OSM)
const HW = 6.12 / 2, HL = 11.2 / 2, EAVE = 5.0, RIDGE = 7.1, OH = 0.3

// ----------------------------------------------------------------- house ----
cbox(white, rect(CX - HW, CX + HW, CY - HL, CY + HL), 0, EAVE, { top: false })
// Gable ends, flush with the end walls.
for (const [y, s] of [[CY - HL, -1], [CY + HL, 1]] as const) tf(white, [CX - HW, y, EAVE], [CX + HW, y, EAVE], [CX, y, RIDGE], [0, s, 0])
// Roof: two slopes with an eave overhang and a small rake at the gables.
{
  const x0 = CX - HW - OH, x1 = CX + HW + OH, y0 = CY - HL - 0.2, y1 = CY + HL + 0.2
  const zE = EAVE - (OH * (RIDGE - EAVE)) / HW
  qf(roof, [x0, y0, zE], [x0, y1, zE], [CX, y1, RIDGE], [CX, y0, RIDGE], [-(RIDGE - EAVE), 0, HW])
  qf(roof, [x1, y0, zE], [x1, y1, zE], [CX, y1, RIDGE], [CX, y0, RIDGE], [RIDGE - EAVE, 0, HW])
  // Soffits, so the overhang has an underside.
  qf(roof, [x0, y0, zE], [x0, y1, zE], [CX - HW, y1, EAVE], [CX - HW, y0, EAVE], [0, 0, -1])
  qf(roof, [x1, y0, zE], [x1, y1, zE], [CX + HW, y1, EAVE], [CX + HW, y0, EAVE], [0, 0, -1])
}
// Chimneys: one at each gable, on the ridge line, to 0.7 m over the ridge.
for (const y of [CY - HL + 0.45, CY + HL - 0.45]) cbox(white, rect(CX - 0.4, CX + 0.4, y - 0.3, y + 0.3), RIDGE - 0.8, RIDGE + 0.7)

// Windows: small dark recess panels.
function win(side: 'e' | 'w', y: number, z0: number, z1: number, w = 0.89) {
  const x = side === 'e' ? CX + HW + 0.04 : CX - HW - 0.04, s = side === 'e' ? 1 : -1
  qf(black, [x, y - w / 2, z0], [x, y + w / 2, z0], [x, y + w / 2, z1], [x, y - w / 2, z1], [s, 0, 0])
}
for (const side of ['e', 'w'] as const) {
  for (const dy of [-4.22, -2.43, 2.43, 4.22]) {
    win(side, CY + dy, 2.13, 3.81)
    // Basement windows under the outer pairs.
    if (Math.abs(dy) > 4) win(side, CY + dy * 0.8, 0.45, 1.1)
  }
}
win('e', CY, 1.3, 3.85, 1.0) // the front door
for (const [y, s] of [[CY - HL - 0.04, -1], [CY + HL + 0.04, 1]] as const)
  qf(black, [CX - 0.43, y, 5.2], [CX + 0.43, y, 5.2], [CX + 0.43, y, 6.1], [CX - 0.43, y, 6.1], [0, s, 0])

// ------------------------------------------------------------------ wing ----
// The lean-to on the west wall (OSM): one storey, its shed roof falling west
// from the house wall (3.9 m) to its outer wall (2.6 m), as photos from the
// north show.
{
  const x0 = CX - HW - 3.1, x1 = CX - HW, y0 = CY - 1.2, y1 = CY + 3.1, lo = 2.6, hi = 3.9
  cbox(white, rect(x0, x1 + 0.1, y0, y1), 0, lo, { top: false })
  for (const [y, sg] of [[y0, -1], [y1, 1]] as const) tf(white, [x0, y, lo], [x1, y, lo], [x1, y, hi], [0, sg, 0])
  const oh = 0.25, zW = lo - (oh * (hi - lo)) / (x1 - x0)
  qf(roof, [x0 - oh, y0 - 0.15, zW], [x0 - oh, y1 + 0.15, zW], [x1, y1 + 0.15, hi], [x1, y0 - 0.15, hi], [-(hi - lo), 0, x1 - x0])
  qf(roof, [x0 - oh, y0 - 0.15, zW], [x0 - oh, y1 + 0.15, zW], [x0, y1 + 0.15, lo], [x0, y0 - 0.15, lo], [0, 0, -1])
  qf(black, [x0 - 0.04, (y0 + y1) / 2 - 0.45, 0.9], [x0 - 0.04, (y0 + y1) / 2 + 0.45, 0.9], [x0 - 0.04, (y0 + y1) / 2 + 0.45, 2.1], [x0 - 0.04, (y0 + y1) / 2 - 0.45, 2.1], [-1, 0, 0])
  qf(black, [x0 + 1.0, y1 + 0.04, 0.2], [x0 + 1.9, y1 + 0.04, 0.2], [x0 + 1.9, y1 + 0.04, 2.1], [x0 + 1.0, y1 + 0.04, 2.1], [0, 1, 0])
}

// ----------------------------------------------------------------- tower ----
const SEG = 16
const TOWER_R = 1.5, TOWER_TOP = 8.6
cylinder(white, CX, CY, TOWER_R, RIDGE - 1.2, TOWER_TOP - 0.25, SEG)
// The tower's small window over the ridge, east and west (HABS: 2' 8" × 3' 1").
for (const sg of [1, -1]) {
  const x = CX + sg * (TOWER_R + 0.03)
  qf(black, [x, CY - 0.41, 7.25], [x, CY + 0.41, 7.25], [x, CY + 0.41, 8.2], [x, CY - 0.41, 8.2], [sg, 0, 0])
}
// A cornice band under the gallery.
cylinder(white, CX, CY, TOWER_R + 0.15, TOWER_TOP - 0.25, TOWER_TOP, SEG)
/** A flat disc (or ring) at z, facing up or down. */
function disc(p: Part, r: number, z: number, up: boolean, r0 = 0, seg = SEG) {
  for (let k = 0; k < seg; k++) {
    const a0 = (2 * Math.PI * k) / seg, a1 = (2 * Math.PI * (k + 1)) / seg
    const o0: V3 = [CX + r * Math.cos(a0), CY + r * Math.sin(a0), z], o1: V3 = [CX + r * Math.cos(a1), CY + r * Math.sin(a1), z]
    if (r0 <= 0) tf(p, [CX, CY, z], o0, o1, [0, 0, up ? 1 : -1])
    else qf(p, [CX + r0 * Math.cos(a0), CY + r0 * Math.sin(a0), z], o0, o1, [CX + r0 * Math.cos(a1), CY + r0 * Math.sin(a1), z], [0, 0, up ? 1 : -1])
  }
}
disc(white, TOWER_R + 0.15, TOWER_TOP, false, TOWER_R)
// Gallery: a black deck 4.06 m across, and an open iron railing: a top rail
// and sixteen posts, so the sky shows through as in the photos.
const GAL_R = 2.03, RAIL_TOP = TOWER_TOP + 1.25
cylinder(black, CX, CY, GAL_R, TOWER_TOP, TOWER_TOP + 0.2, SEG)
disc(black, GAL_R, TOWER_TOP, false, TOWER_R + 0.15)
disc(black, GAL_R, TOWER_TOP + 0.2, true)
{
  // Top rail: a band 0.14 m deep, outer and inner faces and its top.
  cylinder(black, CX, CY, GAL_R, RAIL_TOP - 0.14, RAIL_TOP, SEG)
  for (let k = 0; k < SEG; k++) {
    const a0 = (2 * Math.PI * k) / SEG, a1 = (2 * Math.PI * (k + 1)) / SEG, r = GAL_R - 0.08
    const n0: V3 = [-Math.cos(a0), -Math.sin(a0), 0], n1: V3 = [-Math.cos(a1), -Math.sin(a1), 0]
    const P = (a: number, z: number): V3 => [CX + r * Math.cos(a), CY + r * Math.sin(a), z]
    black.tri(P(a0, RAIL_TOP - 0.14), P(a1, RAIL_TOP), P(a1, RAIL_TOP - 0.14), undefined, undefined, undefined, [n0, n1, n1])
    black.tri(P(a0, RAIL_TOP - 0.14), P(a0, RAIL_TOP), P(a1, RAIL_TOP), undefined, undefined, undefined, [n0, n0, n1])
  }
  disc(black, GAL_R, RAIL_TOP, true, GAL_R - 0.08)
  // Posts, drawn a little thicker than the real bars so they read.
  for (let k = 0; k < SEG; k++) {
    const a = (2 * Math.PI * (k + 0.5)) / SEG, r = GAL_R - 0.05
    const x = CX + r * Math.cos(a), y = CY + r * Math.sin(a)
    cbox(black, rect(x - 0.06, x + 0.06, y - 0.06, y + 0.06), TOWER_TOP + 0.2, RAIL_TOP - 0.14, { top: false })
  }
}
// Lantern: ten-sided, a black base, glazing, a black cornice; flat-shaded
// faces so the facets read.
const LR = 1.28, L0 = TOWER_TOP + 0.2, LB = L0 + 0.8, LG = L0 + 3.15, LC = LG + 0.25
function prism10(p: Part, r: number, z0: number, z1: number) {
  for (let k = 0; k < 10; k++) {
    const a0 = (2 * Math.PI * (k + 0.5)) / 10, a1 = (2 * Math.PI * (k + 1.5)) / 10, am = (a0 + a1) / 2
    qf(p, [CX + r * Math.cos(a0), CY + r * Math.sin(a0), z0], [CX + r * Math.cos(a1), CY + r * Math.sin(a1), z0],
      [CX + r * Math.cos(a1), CY + r * Math.sin(a1), z1], [CX + r * Math.cos(a0), CY + r * Math.sin(a0), z1], [Math.cos(am), Math.sin(am), 0])
  }
}
prism10(black, LR, L0, LB)
prism10(glass, LR, LB, LG)
// Black mullions at the lantern's ten corners, standing just proud.
for (let k = 0; k < 10; k++) {
  const a = (2 * Math.PI * (k + 0.5)) / 10, c: [number, number] = [CX + (LR + 0.03) * Math.cos(a), CY + (LR + 0.03) * Math.sin(a)]
  const t: [number, number] = [-Math.sin(a) * 0.09, Math.cos(a) * 0.09]
  qf(black, [c[0] - t[0], c[1] - t[1], LB], [c[0] + t[0], c[1] + t[1], LB], [c[0] + t[0], c[1] + t[1], LG], [c[0] - t[0], c[1] - t[1], LG], [Math.cos(a), Math.sin(a), 0])
}
// A transom bar round the glazing at mid height: the panes are two rows.
prism10(black, LR + 0.03, (LB + LG) / 2 - 0.07, (LB + LG) / 2 + 0.07)
prism10(black, LR + 0.12, LG, LC)
disc(black, LR + 0.12, LG, false, LR, 10)
// Dome: a hemisphere-ish cap of patina copper from the cornice, and the
// ventilator ball on top.
{
  const R0 = LR + 0.05, H = 1.15, rings = 4
  const ring = (i: number) => {
    const t = (i / rings) * (Math.PI / 2)
    return { r: R0 * Math.cos(t), z: LC + H * Math.sin(t), n: [Math.cos(t) / R0, Math.sin(t) / H] as [number, number] }
  }
  for (let i = 0; i < rings; i++) {
    const A = ring(i), B = ring(i + 1)
    for (let k = 0; k < SEG; k++) {
      const a0 = (2 * Math.PI * k) / SEG, a1 = (2 * Math.PI * (k + 1)) / SEG
      const P = (q: typeof A, a: number): V3 => [CX + q.r * Math.cos(a), CY + q.r * Math.sin(a), q.z]
      const N = (q: typeof A, a: number): V3 => { const l = Math.hypot(q.n[0], q.n[1]); return [(q.n[0] / l) * Math.cos(a), (q.n[0] / l) * Math.sin(a), q.n[1] / l] }
      if (B.r < 1e-3) dome.tri(P(A, a0), P(A, a1), P(B, a0), undefined, undefined, undefined, [N(A, a0), N(A, a1), [0, 0, 1]])
      else {
        dome.tri(P(A, a0), P(A, a1), P(B, a1), undefined, undefined, undefined, [N(A, a0), N(A, a1), N(B, a1)])
        dome.tri(P(A, a0), P(B, a1), P(B, a0), undefined, undefined, undefined, [N(A, a0), N(B, a1), N(B, a0)])
      }
    }
  }
  disc(dome, R0, LC, false, 0)
  // Ventilator ball: a small octahedron.
  const c: V3 = [CX, CY, LC + H + 0.25], r = 0.28
  const v: V3[] = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]].map((d) => [c[0] + d[0], c[1] + d[1], c[2] + d[2]] as V3)
  for (const [i, j, k] of [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]]) {
    const m: V3 = [0, 1, 2].map((q) => (v[i][q] + v[j][q] + v[k][q]) / 3 - c[q]) as V3
    dome.tri(v[i], v[j], v[k], undefined, undefined, undefined, [m, m, m])
  }
}

// ---------------------------------------------------------------- output ----
// Colours from the daylight photos, pulled to the palette's lightness.
await save('sd-old-point-loma-lighthouse', 'Old Point Loma Lighthouse', [
  { part: white, material: finish('opl-whitewash', 0xf2efe8) },
  { part: roof, material: finish('opl-shingle', 0x95877a) },
  { part: black, material: finish('opl-iron', 0x4a4f57) },
  { part: glass, material: finish('glass', 0x4f6271) },
  { part: dome, material: PALETTE.patina },
], { bearing: 6, elevation: 0 })
