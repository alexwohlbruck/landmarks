/**
 * Custom House Tower, 3 McKinley Square, Boston: the Greek Revival custom
 * house (1837–47, Ammi B. Young) and the tower Peabody & Stearns built out
 * of it (1913–15) — original procedural geometry, CC0-1.0.
 * bun generators/bos-custom-house-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 345.3: the long axis of OSM way/29719177 (the old
 * custom house, "140 ft long north and south") runs at 345.3°, so y runs
 * along it and x across. Anchor = the outline's centroid, -71.0535673,
 * 42.3590452. In this frame the outline is x ±12.4 at the ends, ±13.5 at the
 * middle cross arms (y -10.1..9.8), y ±21.5.
 *
 * Identity (from the photos below):
 *  1. The tall pale granite shaft: grouped windows on the lower shaft, a
 *     giant order of engaged columns framing three tall window bays a face
 *     under a deep cornice.
 *  2. The setback crown: an attic with eagles at the corners, the clock
 *     stage with a giant clock dial on each face over a band of windows, a
 *     green copper cornice and balcony, a short open stage, and the steep
 *     stone pyramid with a pointed lantern.
 *  3. The low granite custom house at the foot: a gabled temple block with
 *     six-column Doric porticoes at both ends, engaged columns along the
 *     sides, a pale green copper roof.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read with tools/lidar_frame.py; the ground round the building is flat
 * (2.0 above the grid's ground_min), y = 0. Measured: the old building's
 * eaves 16.8 and ridge 19.8; the shaft's cornice 92.0, 23.5 × 21.2 m across
 * its projection (the shaft 22.0 × 19.8; the tower is not square); the
 * attic 96, the eagles 102; the copper balcony 122 (16 m across); the upper
 * stage 129 (14 m); the pyramid's apex about 147.5. Published: 496 ft
 * (151 m) to the top (Wikipedia, CTBUH), drawn as 151.0 at the lantern's
 * point (the lidar misses the thin point). Lidar and OSM agree within
 * 0.5 m; the tower is drawn centred on the outline.
 *
 * Estimated from the photos (Daderot DSC05443 and view 1, scaled from the
 * 14.6 m clock stage): the colonnade stage 73.5–89.5; the lower shaft's
 * paired windows (a panel per two storeys) and bays; the clock dials (6.8 m
 * across, centre 113); the window band under the dials; the upper stage's
 * openings; the old building's portico columns (OSM parts way/244559596…601
 * place six round columns 3.5–12 m at the south end; drawn 3.5–13.5 and
 * centred, with the same at the north end, as the published "opposite sides
 * and ends being alike").
 *
 * Ground: flat; elevation 0.
 *
 * Night: the clock dials are lit (a white `neon` dial); the crown's stone
 * is floodlit from the shaft's cornice up; the windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Custom House Tower, Boston - DSC05443.JPG, Daderot, CC0 (the crown and
 *    shaft) https://commons.wikimedia.org/wiki/File:Custom_House_Tower,_Boston_-_DSC05443.JPG
 *  - Custom House Tower, Boston, MA - view 1.JPG, Daderot, public domain
 *    (the crown) https://commons.wikimedia.org/wiki/File:Custom_House_Tower,_Boston,_MA_-_view_1.JPG
 *  - Custom House Tower from Rose Kennedy Greenway.jpg, Fletcher6, CC BY 3.0
 *    (the whole tower) https://commons.wikimedia.org/wiki/File:Custom_House_Tower_from_Rose_Kennedy_Greenway.jpg
 *  - Custom House Tower - Boston, MA.jpg, HTBFTBO, CC BY-SA 4.0 (aerial
 *    from the west, the old building's roof)
 *    https://commons.wikimedia.org/wiki/File:Custom_House_Tower_-_Boston,_MA.jpg
 *  - 2017 Custom House Tower from Government Center.jpg, Beyond My Ken,
 *    CC BY-SA 4.0 (the clock stage, the copper roof of the old building)
 *    https://commons.wikimedia.org/wiki/File:2017_Custom_House_Tower_from_Government_Center.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the old building's porticoes and side columns are hidden by
 * neighbours in every photo used; they are drawn from OSM's parts and the
 * published description. The eagles are drawn as plain blocks, the
 * pyramid's small windows and the balcony railing are left out.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, cornice, onWall, rectShape, revolve, save, type XY } from './atl-tech-tower'

const stone = new Part(), win = new Part(), copper = new Part(), dial = new Part(), roof = new Part(), bronze = new Part()

function poly(p: Part, pts: V3[], out: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
const rect = (hx: number, hy: number): XY[] => [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
type F = [XY, XY]
/** The four faces of a centred rectangle, each with the outside on its right. */
const faces = (hx: number, hy: number): F[] => [
  [[-hx, -hy], [hx, -hy]], [[hx, -hy], [hx, hy]], [[hx, hy], [-hx, hy]], [[-hx, hy], [-hx, -hy]],
]
const flen = (f: F) => Math.hypot(f[1][0] - f[0][0], f[1][1] - f[0][1])

// ── The 1847 custom house ──
const BX = 12.4, BY = 21.5, PORCH = 19.0, EAVE = 16.8, RIDGE = 19.8
box(stone, -BX, BX, -BY, BY, 0, 3.5, stone, 0.1) // the stylobate under the porticoes too
box(stone, -BX, BX, -PORCH, PORCH, 3.5, EAVE, null, 0)
box(stone, -14.0, 14.0, -10.0, 10.0, 0, EAVE + 0.6, roof, 0.2) // the cross arms
cornice(stone, rect(BX, PORCH), 13.5, 0.5, 0.15, null)
// entablature over the porticoes, and the roof with its end pediments
for (const s of [-1, 1]) box(stone, -BX, BX, Math.min(s * PORCH, s * BY), Math.max(s * PORCH, s * BY), 13.5, EAVE, null, 0)
{
  const o = 0.5, sl = (RIDGE - EAVE) / BX, lo = EAVE - o * sl
  const A: V3 = [-BX - o, -BY - 0.3, lo], B: V3 = [BX + o, -BY - 0.3, lo], C: V3 = [BX + o, BY + 0.3, lo], D: V3 = [-BX - o, BY + 0.3, lo]
  const R0: V3 = [0, -BY - 0.3, RIDGE], R1: V3 = [0, BY + 0.3, RIDGE]
  poly(roof, [B, C, R1, R0], [1, 0, 1])
  poly(roof, [D, A, R0, R1], [-1, 0, 1])
  poly(roof, [A, B, C, D], [0, 0, -1])
  for (const s of [-1, 1]) {
    poly(stone, [[-BX, s * BY, EAVE], [BX, s * BY, EAVE], [0, s * BY, RIDGE - 0.1]], [0, s, 0])
    // the raking cornices
    for (const k of [-1, 1]) {
      const sec = (x: number, z: number): V3[] => [[x, s * BY - 0.35 * s, z], [x, s * BY + 0.35 * s, z], [x, s * BY + 0.35 * s, z - 0.5], [x, s * BY - 0.35 * s, z - 0.5]]
      stone.sweep([sec(k * (BX + o), lo + 0.1), sec(0, RIDGE + 0.15)])
    }
  }
}
// six Doric columns in each portico, the doors behind
for (const s of [-1, 1]) {
  for (let k = 0; k < 6; k++) {
    const x = (k - 2.5) * 3.9
    revolve(stone, [x, s * 20.4], [[0.85, 3.5], [0.85, 3.8], [0.72, 3.8], [0.62, 13.0], [0.85, 13.1], [0.85, 13.5], [0, 13.5]], 10, 0, false, false)
  }
  const f: F = s < 0 ? [[-BX, -PORCH], [BX, -PORCH]] : [[BX, PORCH], [-BX, PORCH]]
  for (const d of [-5.85, 0, 5.85]) onWall(win, f[0], f[1], rectShape(BX + d - 1.1, BX + d + 1.1, 3.5, 9.5), 0.05)
}
// engaged columns and tall windows along the sides, either side of the arms
for (const sx of [-1, 1]) {
  const f: F = sx < 0 ? [[-BX, PORCH], [-BX, -PORCH]] : [[BX, -PORCH], [BX, PORCH]]
  for (const yc of [-17.2, -13.6, 13.6, 17.2]) {
    revolve(stone, [sx * (BX + 0.05), yc], [[0.75, 3.5], [0.62, 13.5], [0, 13.5]], 8, 0, false, false)
  }
  for (const yc of [-15.4, 15.4]) {
    const s = sx < 0 ? PORCH - yc : yc + PORCH
    onWall(win, f[0], f[1], rectShape(s - 0.9, s + 0.9, 4.3, 12.5), 0.05)
  }
  const fa: F = sx < 0 ? [[-14.0, 10.0], [-14.0, -10.0]] : [[14.0, -10.0], [14.0, 10.0]]
  for (const d of [-6, 0, 6]) onWall(win, fa[0], fa[1], rectShape(10 + d - 1.0, 10 + d + 1.0, 4.3, 12.5), 0.05)
}

// ── The tower ──
const TX = 11.0, TY = 9.9, SH0 = 16.0, COL0 = 73.5, COL1 = 89.5, CORN = 92.0
box(stone, -TX, TX, -TY, TY, SH0, COL1, null, 0)
cornice(stone, rect(TX, TY), COL0 - 0.6, 0.6, 0.2, null)
for (const f of faces(TX, TY)) {
  const L = flen(f), bay = L > 21 ? 6.0 : 5.4
  // lower shaft: three bays of paired windows, a panel per two storeys with
  // broad stone spandrels, so the shaft reads pale as it does
  for (let b = -1; b <= 1; b++) {
    const s = L / 2 + b * bay
    for (let g = 0; g < 7; g++) {
      const z0 = 21.4 + g * 7.4
      onWall(win, f[0], f[1], rectShape(s - 1.05, s + 1.05, z0, z0 + 4.4), 0.05)
    }
  }
  // the colonnade: four engaged columns, three tall bays between
  const w = L > 21 ? 4.6 : 4.2
  for (let b = -1; b <= 1; b++) {
    const s = L / 2 + b * w
    onWall(win, f[0], f[1], rectShape(s - 1.55, s + 1.55, COL0 + 0.6, 81.0), 0.05)
    onWall(win, f[0], f[1], rectShape(s - 1.55, s + 1.55, 82.0, COL1 - 1.2), 0.05)
  }
  const t: XY = [(f[1][0] - f[0][0]) / L, (f[1][1] - f[0][1]) / L], n: XY = [t[1], -t[0]]
  for (const b of [-1.5, -0.5, 0.5, 1.5]) {
    const s = L / 2 + b * w
    const c: XY = [f[0][0] + t[0] * s + n[0] * 0.1, f[0][1] + t[1] * s + n[1] * 0.1]
    revolve(stone, c, [[0.62, COL0], [0.55, COL1 - 0.6], [0.75, COL1 - 0.3], [0.75, COL1], [0, COL1]], 8, 0, false, false)
  }
}
cornice(stone, rect(TX, TY), COL1, CORN - COL1, 0.8, roof)

// ── The crown ──
const AX = 10.2, AY = 9.2, ATT = 96.0
box(stone, -AX, AX, -AY, AY, CORN, ATT, roof, 0.2)
for (const f of faces(AX, AY)) {
  const L = flen(f)
  for (let k = -2; k <= 2; k++) onWall(win, f[0], f[1], rectShape(L / 2 + k * 2.4 - 0.55, L / 2 + k * 2.4 + 0.55, 93.0, 95.0), 0.05)
}
// the eagles at the corners, as bold blocks
for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(stone, sx * AX - 1.0, sx * AX + 1.0, sy * AY - 1.0, sy * AY + 1.0, ATT, 101.5, stone, 0.5)
// the clock stage on its plinth
const CS = 7.3, CK0 = 99.0, CK1 = 120.5, DZ = 113.0
box(stone, -8.6, 8.6, -8.6, 8.6, ATT, CK0, stone, 0.3)
box(stone, -CS, CS, -CS, CS, CK0, CK1, null, 0)
for (const f of faces(CS, CS)) {
  const L = flen(f), s = L / 2
  const ring = (r: number, k = 20) => Array.from({ length: k }, (_, i) => [s + r * Math.cos((i / k) * Math.PI * 2), DZ + r * Math.sin((i / k) * Math.PI * 2)] as [number, number])
  onWall(stone, f[0], f[1], rectShape(s - 4.1, s + 4.1, DZ - 4.1, DZ + 4.1), 0.02) // the square stone frame
  onWall(bronze, f[0], f[1], ring(3.4), 0.05) // the dark bronze ring with its numerals
  onWall(dial, f[0], f[1], ring(2.6), 0.08)
  // hands, at about ten past ten
  onWall(bronze, f[0], f[1], [[s - 0.15, DZ], [s + 0.15, DZ], [s + 0.9 + 0.12, DZ + 1.6], [s + 0.9 - 0.12, DZ + 1.65]], 0.11)
  onWall(bronze, f[0], f[1], [[s - 0.12, DZ - 0.12], [s + 0.12, DZ + 0.12], [s - 1.9, DZ + 0.75], [s - 1.95, DZ + 0.5]], 0.11)
  onWall(win, f[0], f[1], rectShape(s - 2.6, s + 2.6, 105.2, 108.2), 0.05)
  for (const d of [-5.6, 5.6]) for (const z of [101.0, 104.0, 110.5, 114.0, 117.5]) onWall(win, f[0], f[1], rectShape(s + d - 0.3, s + d + 0.3, z, z + 1.3), 0.05)
}
// the green copper cornice and balcony
revolve(copper, [0, 0], [[CS * Math.SQRT2, CK1 - 0.8], [8.2 * Math.SQRT2, CK1 + 0.4], [8.2 * Math.SQRT2, 122.0], [0, 122.0]], 4, Math.PI / 4, true, false)
// the upper stage: openings between corner piers, a cornice and corner acroteria
const US = 6.6, U1 = 128.5
box(stone, -US, US, -US, US, 122.0, U1, null, 0)
for (const f of faces(US, US)) {
  const L = flen(f)
  for (const k of [-1, 0, 1]) onWall(win, f[0], f[1], rectShape(L / 2 + k * 3.8 - 1.4, L / 2 + k * 3.8 + 1.4, 123.0, 127.4), 0.05)
}
cornice(stone, rect(US, US), U1, 1.0, 0.6, null)
for (const sx of [-1, 1]) for (const sy of [-1, 1]) box(stone, sx * 6.6 - 0.9, sx * 6.6 + 0.9, sy * 6.6 - 0.9, sy * 6.6 + 0.9, U1 + 1.0, 131.2, stone, 0.4)
// the pyramid and its pointed lantern
revolve(stone, [0, 0], [[7.0 * Math.SQRT2, U1 + 1.0], [6.6 * Math.SQRT2, U1 + 1.6], [0.8 * Math.SQRT2, 146.6], [0, 146.6]], 4, Math.PI / 4, true, false)
box(stone, -0.8, 0.8, -0.8, 0.8, 146.4, 148.0, null, 0.1)
revolve(stone, [0, 0], [[0.95 * Math.SQRT2, 148.0], [0, 151.0]], 4, Math.PI / 4, true, true)

const lit = (p: V3) => (p[2] > COL1 - 1 ? 0.85 : 0)
await save('bos-custom-house-tower', 'Custom House Tower', [
  { part: stone, material: { ...finish('cht-granite', 0xe4e1d9), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: copper, material: { ...PALETTE.patina, floodlight: () => 0.7 } },
  { part: dial, material: finish('neon-cht-clock', 0xf3f1e8) },
  { part: roof, material: finish('cht-copper-roof', 0x9db5a6) },
  { part: bronze, material: finish('cht-bronze', 0x5d584c) },
], { height: 151, anchor: [42.3590452, -71.0535673], bearing: 345.3 })
