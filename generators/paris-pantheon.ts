/**
 * Panthéon, Paris (Soufflot, 1758–90) — procedural, CC0-1.0, no textures.
 * bun generators/paris-pantheon.ts
 *
 * Map frame: x along the church's axis from the portico towards the east end
 * (compass 108.3°), y to its left (compass 18.3°), z up, metres. Placement
 * bearing 18.3. Anchor: the area centroid of the OSM outline way/16407465
 * (lng 2.3461018, lat 48.8461987). The axis sits at y = 0; the dome's
 * centre at x = 3.2.
 *
 * Evidence
 * - OSM (measured, in this frame; outline and 76 building:parts): portico
 *   x −57.5…−42.1, y ±20.9, its 16 free columns (2.2 m footprints) in rows at
 *   x −56.2, −53.1 and −47.4; steps 1.8 m; nave arm x −42.1…−14.5, y ±17.3;
 *   crossing x −14.5…21.2, y ±20.8; transept arms to y ±39.3 with their end
 *   pavilions (x −6.7…13.5) to ±42.2; east arm to x 49.7, y ±17.9, with the
 *   two bell towers x 37.1…47.0 to y ±25.5 (27.1 m) and the low east annex to
 *   x 54.6 (10.7 m); wall tops 23.8 m, entablature to 25.4 m, balustrade
 *   26.6 m; the arms' low roofs (23.8 → 32.4 m) over y ±12.4 and x −8.2…15.6;
 *   the square drum base x −14…20.3 to 35–37 m; 32 drum columns on a ring
 *   of radius 16.3 m about (3.2, 0), 37–48 m.
 * - Published (Wikipedia FR/EN "Panthéon (Paris)"): 83 m to the lantern's
 *   top (OSM 90 m to the cross); 22 Corinthian columns in the portico
 *   (16 free, as OSM maps them; the other six drawn as engaged columns on
 *   the portico's back wall); 32 columns round the drum.
 * - Photos (Wikimedia Commons, evidence):
 *   "Panthéon de Paris in July 2022.jpg" (Maksim Sokolov (maxergon.com), CC BY-SA 4.0;
 *   the portico and the north flank from the north-west: column, entablature
 *   and pediment proportions, the blind walls with their garland frieze and
 *   balustrade);
 *   "Le tambour et le dôme du Panthéon, Paris 2021.jpg" (Jean-Pierre
 *   Dalbéra, CC BY 2.0; the drum and dome nearly level from the west, used
 *   row by row against the 32.6 m colonnade (OSM ring) and the dome's own
 *   24 m width, then checked by the lead against the same photo: the
 *   colonnade with its entablature 0.62 of the dome's width (columns
 *   37–49 m, entablature to 51.2 m, balustrade to 53.0 m at r 17.3), the
 *   attic with its 16 arched windows 0.32 (r 12.7 m, to 59.8 m, cornice to
 *   60.6 m), the dome shell 0.56 (r 12.0 m rising to 73.8 m, a little
 *   taller than a hemisphere), the open lantern on its small cup 0.5
 *   (lantern r 2.5 m with eight arched openings to 80.9 m, cup to 83 m,
 *   the published height), ball and cross to ~88 m (OSM 90 m).
 * - Mapterhorn terrain (bearing 18.3): the parvis and the streets round the
 *   church lie 2.2–2.5 m above the lowest ground under the footprint (a
 *   0 m pit the terrain shows inside the east arm, where OSM has light
 *   wells), so the church's ground is z = 2.4 and every height is measured
 *   from there; the walls run down to z = 0. If the map's terrain is later
 *   corrected there, the model will stand 2.4 m too low.
 * - Estimated: portico columns 19.2 m (1.9 m diameter) on the 1.8 m steps,
 *   from the photo against the OSM 25.4 m entablature top; pediment apex
 *   31 m (OSM); the garland frieze 21.6–23.2 m; doors.
 * - Simplified: the pediment's sculpture is a flat relief panel; capitals
 *   are plain blocks; the light wells inside the arms (OSM 19.5 m parts) are
 *   drawn as flat roof at the balustrade level.
 * - Look-only references: none.
 * - Doubts: the south and east sides were not compared with a photo.
 *
 * Night: floodlit — the portico and drum strongly, the walls less.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cbox, grow, hip, qf, rect, save, tf, type Rect } from './dc-white-house'
import { ngon, ngonPrism, spire } from './dc-smithsonian-castle'
import { face, faceAB, holePanel, type XY } from './london-westminster-abbey'

const stone = new Part(), trim = new Part(), roof = new Part(), win = new Part(), door = new Part(), relief = new Part()
const Z0 = 2.4
const H = (h: number) => Z0 + h
const CX = 3.2 // dome centre

// ---- The Greek-cross body: blind walls, frieze, cornice and balustrade.
const blocks: Rect[] = [
  rect(-42.1, -14.5, -17.3, 17.3), // nave arm
  rect(-14.5, 21.2, -20.8, 20.8), // crossing
  rect(-14.4, 21.3, -33.7, 33.7), // transept arms
  rect(-15.5, 22.4, -39.3, -33.7), rect(-15.5, 22.4, 33.7, 39.3), // their ends
  rect(21.2, 49.7, -17.9, 17.9), // east arm
]
for (const r of blocks) {
  cbox(stone, r, 0, H(21.6), { top: false })
  cbox(relief, grow(r, 0.08), H(21.6), H(23.2), { top: false })
  cbox(trim, grow(r, 0.2), H(23.2), H(23.8), { top: false, bottom: true })
  cbox(trim, grow(r, 0.7), H(23.8), H(25.4), { b: 0.35, bottom: true, top: roof })
  cbox(trim, grow(r, 0.1), H(25.4), H(26.6), { top: false })
}
// End pavilions of the transepts and the east arm's bell towers and annex.
for (const s of [-1, 1]) {
  const r = rect(-6.7, 13.5, Math.min(s * 39.3, s * 42.2), Math.max(s * 39.3, s * 42.2))
  cbox(stone, r, 0, H(23.8), { top: false })
  cbox(trim, grow(r, 0.5), H(23.8), H(25.4), { b: 0.3, bottom: true, top: false })
  // A low pediment across the pavilion.
  const yo = s * 42.7
  tf(stone, [-7.2, yo, H(25.4)], [14.0, yo, H(25.4)], [3.4, yo, H(29.9)], [0, s, 0])
  tf(stone, [-7.2, s * 39.3, H(25.4)], [14.0, s * 39.3, H(25.4)], [3.4, s * 39.3, H(29.9)], [0, -s, 0])
  qf(roof, [-7.2, s * 39.3, H(25.4)], [-7.2, yo, H(25.4)], [3.4, yo, H(29.9)], [3.4, s * 39.3, H(29.9)], [-1, 0, 2])
  qf(roof, [14.0, s * 39.3, H(25.4)], [14.0, yo, H(25.4)], [3.4, yo, H(29.9)], [3.4, s * 39.3, H(29.9)], [1, 0, 2])
  holePanel(door, face(s > 0 ? 'n' : 's', s * 42.2), { a0: 1.6, a1: 5.2, zb: H(0), zs: H(6.5), head: 'flat' }, 0.06)
  // Bell towers at the east corners.
  const t = rect(37.1, 47.0, Math.min(s * 17.9, s * 25.5), Math.max(s * 17.9, s * 25.5))
  cbox(stone, t, 0, H(23.8), { top: false })
  cbox(trim, grow(t, 0.4), H(23.8), H(25.0), { b: 0.3, bottom: true, top: false })
  hip(roof, grow(t, 0.2), H(25.0), H(27.4), 4.8)
}
{
  const a = rect(49.7, 54.6, -16.0, 16.3)
  cbox(stone, a, 0, H(9.4), { top: false })
  cbox(trim, grow(a, 0.3), H(9.4), H(10.2), { b: 0.2, bottom: true, top: roof })
  // The east gable over the apse wall.
  tf(stone, [49.7, -9.2, H(26.6)], [49.7, 9.9, H(26.6)], [49.7, 0.35, H(28.6)], [1, 0, 0])
}
// The arms' low roofs.
hip(roof, rect(-42.1, 47.3, -12.4, 12.4), H(26.6), H(32.4), 9.0, roof, 11.5)
hip(roof, rect(-8.2, 15.6, -34.7, 34.7), H(26.6), H(32.4), 11.0, roof, 9.0)
// Corner pilasters, paired at each outer corner of the arms.
for (const [x, y] of [[-42.1, -17.3], [-42.1, 17.3], [-14.5, -20.8], [-14.5, 20.8], [21.2, -20.8], [21.2, 20.8], [-15.5, -39.3], [-15.5, 39.3], [22.4, -39.3], [22.4, 39.3], [49.7, -17.9], [49.7, 17.9]] as XY[]) {
  const sx = Math.sign(x - CX), sy = Math.sign(y)
  cbox(trim, rect(Math.min(x, x + sx * 0.4), Math.max(x, x + sx * 0.4), Math.min(y - sy * 2.4, y), Math.max(y - sy * 2.4, y)), 0, H(21.6), { top: false })
  cbox(trim, rect(Math.min(x - sx * 2.4, x), Math.max(x - sx * 2.4, x), Math.min(y, y + sy * 0.4), Math.max(y, y + sy * 0.4)), 0, H(21.6), { top: false })
}

// ---- The portico: steps, 16 free columns, entablature, pediment.
const PX0 = -57.5, PX1 = -42.1, PW = 20.9
cbox(trim, rect(PX0 - 2.2, PX1, -PW - 1.0, PW + 1.0), 0, H(0.9), { top: true })
cbox(trim, rect(PX0 - 1.0, PX1, -PW - 0.4, PW + 0.4), H(0.9), H(1.8), { top: true })
const cols: XY[] = []
for (const y of [-16.6, -10.4, -3.6, 3.6, 10.4, 16.6]) cols.push([-56.2, y])
for (const y of [-19.5, -16.7, -10.3, 10.3, 16.7, 19.5]) cols.push([-53.1, y])
for (const y of [-19.4, -16.9, 16.9, 19.4]) cols.push([-47.4, y])
const column = (x: number, y: number, z0: number, z1: number, r: number, n = 10, base = true) => {
  if (base) cbox(trim, rect(x - r * 1.15, x + r * 1.15, y - r * 1.15, y + r * 1.15), z0, z0 + 0.5, { top: false })
  ngonPrism(stone, x, y, r, n, z0 + (base ? 0.5 : 0), z1 - r * 1.1, { top: false, r1: r * 0.88 })
  cbox(trim, rect(x - r * 1.2, x + r * 1.2, y - r * 1.2, y + r * 1.2), z1 - r * 1.1, z1, { b: base ? 0.1 : 0, bottom: true, top: false })
}
for (const [x, y] of cols) column(x, y, H(1.8), H(21.0), 0.95)
// Engaged columns on the back wall, and the doors between them.
for (const y of [-16.8, -10.4, -3.6, 3.6, 10.4, 16.8]) cbox(stone, rect(PX1 - 0.8, PX1, y - 0.9, y + 0.9), H(1.8), H(21.0), { top: false })
for (const [y, w, h] of [[0, 4.4, 10.5], [-7.0, 3.0, 7.5], [7.0, 3.0, 7.5]]) {
  holePanel(door, face('w', PX1), { a0: y - w / 2, a1: y + w / 2, zb: H(1.8), zs: H(1.8 + h), head: 'flat' }, 0.06)
  holePanel(relief, face('w', PX1), { a0: y - w / 2 - 0.3, a1: y + w / 2 + 0.3, zb: H(2.2 + h), zs: H(4.2 + h), head: 'flat' }, 0.06)
}
// Entablature: a box over the colonnade, its frieze lettered band in relief.
{
  const r = rect(PX0, PX1, -PW, PW)
  cbox(stone, r, H(21.0), H(23.0), { top: false, bottom: true })
  cbox(relief, grow(r, 0.06, 0.06), H(22.2), H(23.0), { top: false })
  cbox(trim, grow(r, 0.6), H(23.0), H(25.4), { b: 0.35, bottom: true, top: false })
  // Pediment: front and back triangles, raking cornice, roof.
  const ZP = H(25.4), ZA = H(31.0), xf = PX0 - 0.6
  tf(stone, [xf + 0.2, -PW, ZP], [xf + 0.2, PW, ZP], [xf + 0.2, 0, ZA], [-1, 0, 0])
  // The tympanum's sculpture, set in the pediment.
  tf(relief, [xf + 0.1, -PW + 3.2, ZP + 0.55], [xf + 0.1, PW - 3.2, ZP + 0.55], [xf + 0.1, 0, ZA - 1.1], [-1, 0, 0])
  for (const s of [-1, 1]) {
    const sl = Math.hypot(PW + 0.6, ZA - ZP)
    qf(trim, [xf - 0.4, s * (PW + 0.6), ZP], [xf - 0.4, 0, ZA + 0.5], [xf + 1.4, 0, ZA + 0.5], [xf + 1.4, s * (PW + 0.6), ZP], [-0.2, s * (ZA - ZP) / sl, (PW + 0.6) / sl])
    qf(roof, [xf + 1.4, s * (PW + 0.6), ZP + 0.2], [xf + 1.4, 0, ZA + 0.5], [PX1, 0, ZA + 0.5], [PX1, s * (PW + 0.6), ZP + 0.2], [0, s * (ZA - ZP), PW])
    qf(trim, [xf - 0.4, s * (PW + 0.6), ZP], [xf - 0.4, 0, ZA + 0.5], [xf - 0.4, 0, ZA - 0.2], [xf - 0.4, s * (PW - 0.1), ZP], [-1, 0, 0])
  }
}

// ---- The drum, colonnade, attic and dome.
cbox(stone, rect(-14.0, 20.3, -17.4, 16.6), H(25.4), H(33.6), { top: false })
cbox(trim, rect(-14.6, 20.9, -18.0, 17.2), H(33.6), H(35.0), { b: 0.4, bottom: true, top: roof })
const ring = (r: number, z0: number, z1: number, p: Part, n = 32, top: Part | false = false, r1 = r) => ngonPrism(p, CX, 0, r, n, z0, z1, { top, r1 })
ring(17.6, H(35.0), H(36.4), trim, 32, roof)
ring(14.0, H(36.4), H(49.0), stone)
for (let k = 0; k < 32; k++) {
  const t = (2 * Math.PI * (k + 0.5)) / 32
  column(CX + 16.3 * Math.cos(t), 16.3 * Math.sin(t), H(36.4), H(49.0), 0.6, 8, false)
  // Tall windows in the drum wall between the columns.
  if (k % 2 === 0) {
    const a: XY = [CX + 14.0 * Math.cos(t - 0.09), 14.0 * Math.sin(t - 0.09)], b: XY = [CX + 14.0 * Math.cos(t + 0.09), 14.0 * Math.sin(t + 0.09)]
    holePanel(win, faceAB(a, b), { a0: 0, a1: Math.hypot(b[0] - a[0], b[1] - a[1]), zb: H(39.0), zs: H(46.0), head: 'flat' }, 0.05)
  }
}
// Entablature over the colonnade and the balustrade.
{
  const n = 32
  const rr = ngon(CX, 0, 17.3, n, H(49.0)), ri = ngon(CX, 0, 13.0, n, H(51.2))
  ring(17.3, H(49.0), H(51.2), trim)
  for (let k = 0; k < n; k++) qf(trim, rr[k], rr[(k + 1) % n], [ri[(k + 1) % n][0], ri[(k + 1) % n][1], H(49.0)], [ri[k][0], ri[k][1], H(49.0)], [0, 0, -1])
  ring(17.3, H(51.2), H(53.0), trim, 32)
  const top = ngon(CX, 0, 17.3, n, H(53.0)), inner = ngon(CX, 0, 12.7, n, H(53.0))
  for (let k = 0; k < n; k++) qf(roof, top[k], top[(k + 1) % n], inner[(k + 1) % n], inner[k], [0, 0, 1])
}
ring(12.7, H(53.0), H(59.8), stone)
for (let k = 0; k < 16; k++) {
  const t0 = (2 * Math.PI * k) / 16 + Math.PI / 16 - 0.063, t1 = t0 + 0.126
  const a: XY = [CX + 12.7 * Math.cos(t0), 12.7 * Math.sin(t0)], b: XY = [CX + 12.7 * Math.cos(t1), 12.7 * Math.sin(t1)]
  holePanel(win, faceAB(a, b), { a0: 0, a1: Math.hypot(b[0] - a[0], b[1] - a[1]), zb: H(54.6), zs: H(57.6), head: 'round', seg: 6 }, 0.05)
}
ring(13.1, H(59.8), H(60.6), trim, 32, false)
{
  // The dome: a profile a little taller than a hemisphere, 12 bold ribs as trim lines.
  const N = 32, rows = 7
  const prof: Array<[number, number]> = []
  for (let i = 0; i <= rows; i++) {
    const a = (Math.PI / 2) * (i / rows)
    prof.push([12.0 * Math.cos(a), H(60.6) + 13.2 * Math.sin(a)])
  }
  prof[rows] = [3.6, prof[rows][1]]
  for (let i = 0; i < rows; i++) if (prof[i][0] < 3.6) prof[i][0] = 3.6
  const top = 13.2 * Math.sqrt(1 - (3.6 / 12) ** 2)
  prof[rows] = [3.6, H(60.6) + top]
  const rings = prof.map(([r, z]) => ngon(CX, 0, r, N, z))
  roof.loft(rings)
  ngonPrism(trim, CX, 0, 13.0, N, H(60.6), H(60.6) + 0.01, { top: false })
  for (let k = 0; k < 12; k++) {
    const t = (2 * Math.PI * k) / 12
    for (let i = 0; i < rows; i++) {
      const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
      const P = (r: number, z: number, o: number, d: number): V3 => [CX + (r + d) * Math.cos(t) - o * Math.sin(t), (r + d) * Math.sin(t) + o * Math.cos(t), z]
      const w = 0.2
      qf(trim, P(r0, z0, -w, 0.12), P(r0, z0, w, 0.12), P(r1, z1, w, 0.12), P(r1, z1, -w, 0.12), [Math.cos(t), Math.sin(t), (r0 - r1) / (z1 - z0 + 1e-6)])
    }
  }
  // Lantern: ring, columned drum, cupola, cross.
  const zl = H(60.6) + top
  ngonPrism(trim, CX, 0, 3.4, 16, zl - 0.2, zl + 0.8, { top: roof })
  ngonPrism(stone, CX, 0, 2.5, 16, zl + 0.8, H(80.9), { top: false })
  for (let k = 0; k < 8; k++) {
    const t0 = (2 * Math.PI * k) / 8 + 0.12, t1 = t0 + 0.55
    const a: XY = [CX + 2.5 * Math.cos(t0), 2.5 * Math.sin(t0)], b: XY = [CX + 2.5 * Math.cos(t1), 2.5 * Math.sin(t1)]
    holePanel(win, faceAB(a, b), { a0: 0, a1: Math.hypot(b[0] - a[0], b[1] - a[1]), zb: zl + 1.6, zs: zl + 5.6, head: 'round', seg: 4 }, 0.05)
  }
  ngonPrism(trim, CX, 0, 2.8, 12, H(80.9), H(81.5), { top: false, bottom: true })
  const cup = [ngon(CX, 0, 2.4, 12, H(81.5)), ngon(CX, 0, 1.7, 12, H(82.4)), ngon(CX, 0, 0.8, 12, H(83.0))]
  roof.loft(cup)
  spire(roof, cup[2], [CX, 0, H(83.4)])
  cbox(trim, rect(CX - 0.15, CX + 0.15, -0.15, 0.15), H(83.2), H(88.0), {})
  cbox(trim, rect(CX - 0.15, CX + 0.15, -1.0, 1.0), H(86.4), H(86.75), {})
}

// Floodlight: portico and drum strongly, the walls more softly.
const lit = (q: V3, n: V3) => (n[2] > 0.8 ? 0.15 : q[2] > H(35) || q[0] < -42 ? 0.95 : 0.6)
await save('paris-pantheon', 'Panthéon', [
  { part: stone, material: { ...finish('pantheon-stone', 0xece0c8), floodlight: lit } },
  { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
  { part: relief, material: { ...finish('pantheon-relief', 0xd2c5ad), floodlight: lit } },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: door, material: finish('pantheon-bronze', 0x7d6f5d) },
], { source: 'generators/paris-pantheon.ts' }, 6500)
