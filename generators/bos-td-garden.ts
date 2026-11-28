/**
 * TD Garden, Boston (1995, Ellerbe Becket) — original procedural geometry,
 * CC0-1.0.
 * bun generators/bos-td-garden.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * street. Bearing 325: the arena's long walls run at 55° (OSM way/25123637),
 * so x runs along the arena (+x toward the north-east end, which faces the
 * Charlestown bridge and I-93) and y across it (+y the north-west side over
 * the North Station tracks, -y Causeway Street, where The Hub on Causeway
 * (2019) now stands against the arena and is not part of this model).
 * Anchor = the outline's area centroid, -71.0621483, 42.3663149. OSM maps
 * North Station (way/474893799, building=train_station) on exactly the same
 * outline: the station concourse is under the arena, so both are replaced.
 *
 * Identity (from the photos below):
 *  1. A big box: a plain light grey-beige precast base about 34 m tall.
 *  2. Over it a dark recessed upper storey with, on both ends, a band of
 *     bold white vertical fins, under a shallow barrel-vaulted roof whose
 *     thick silver fascia overhangs and arches across each end.
 *  3. The north-east end: the big teal glass curtain wall with its slanted
 *     edge, the green "TD" and gold "GARDEN" sign over it, the black Bruins
 *     banner, and the glass stair tower with a tall mast at the north corner.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid, read
 * with tools/lidar_frame.py; the street round the arena is 3.0 m above the
 * grid's ground_min and is y = 0 here. Measured (model metres): the vault's
 * crown 49.1 at y = 1.5, its eaves 44 at the long sides (a parabola fits
 * the readings to 0.2 m); the precast base 34.5 (the strip in front of the
 * upper storey at the north-east end); the north corner 37–40; the stair
 * tower 56 at x 41–48, y 37–49 (its roof 53.5 with dishes and rails
 * above, drawn as a plain cap). The lidar matches the OSM outline to 1–2 m.
 * The vault runs out to the slanted east corner and, south of y = -8, to
 * the west end at x = -76; north of that the west end is at x = -65 as
 * OSM draws it.
 *
 * Estimated from the photos (TD Garden 2013, scaled from the 94 m end and
 * the 49 m crown): the glass wall (y -6..42, z 12–28.6), the Bruins banner
 * (y -37..-15), the sign (z 29.5–33), the fin band (y -8..33 on the
 * north-east end, the same middle stretch on the south-west end), the fin
 * pitch (drawn 2.3 m, real about 1.95 m, widened so it reads at phone
 * size), the fascia (2.2 m deep, 1.5 m overhang), the mast top (about 73 m,
 * scaled from the Charlestown photo against the tower and the crown), the
 * billboard on the north-west side.
 *
 * Signs: plain boxes (STYLE.md, Famous signs: only a sign that is itself
 * the landmark carries letters). The green TD square and the gold GARDEN
 * board are `neon-*`, lit at night as in the Zakim photo; the fins carry
 * _FLOODLIGHT (they are washed with light at night); the glass glows.
 *
 * Ground: Mapterhorn is flat round the arena (5 m ± 0.6 above its local
 * low). Elevation 0.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - TD Garden 2013.jpg, Kid Clutch from RAIN CITY USA, CC BY 2.0 (the
 *    north-east end, square on)
 *    https://commons.wikimedia.org/wiki/File:TD_Garden_2013.jpg
 *  - TD Garden from Charlestown bridge, Boston.jpg, Benoît Prieur, CC0 (the
 *    north-east end and north-west side)
 *    https://commons.wikimedia.org/wiki/File:TD_Garden_from_Charlestown_bridge,_Boston.jpg
 *  - TD Garden from Lechmere (8427797138).jpg, andrewjsan, CC BY 2.0 (the
 *    north-west side and south-west end, far)
 *    https://commons.wikimedia.org/wiki/File:TD_Garden_from_Lechmere_(8427797138).jpg
 *  - Zakim bridge and the TD Garden (9097726826).jpg, Robbie Shade, CC BY
 *    2.0 (the north-east end at dusk: the lit sign, glass and fins)
 *    https://commons.wikimedia.org/wiki/File:Zakim_bridge_and_the_TD_Garden_(9097726826).jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the south-east side is hidden by The Hub on Causeway and drawn
 * plain; the north corner's lower roofs (37–40) are drawn under the one
 * vault; the roof membrane's colour is assumed grey (NAIP was unreachable);
 * the billboard and banners change over the years.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, capPoly, ccw, cornice, prism, save, type XY } from './atl-flatiron-building'
import { onWall, rectShape } from './atl-tech-tower'

const pre = new Part(), dark = new Part(), roof = new Part(), glass = new Part(), green = new Part(), gold = new Part()

// ── The precast base: the OSM outline, lightly squared ──
const OUT: XY[] = ccw([
  [-59.6, 47.1], [-59.4, 41.6], [-65.3, 41.3], [-64.9, -7.0], [-76.6, -9.0], [-76.3, -44.2],
  [18.9, -43.4], [73.5, -43.1], [67.6, -12.1], [68.4, 44.4], [66.8, 44.5], [66.5, 48.0], [55.4, 49.0],
])
const BASE = 34.5
prism(pre, OUT, 0, BASE, roof, 0.4)
cornice(pre, OUT, BASE - 1.0, 1.0, 0.25, roof)

// ── The upper storey and the barrel vault ──
const YS = -42.6, YN = 46.6, YC = 1.5, EAVE = 44, CROWN = 49.1, OV = 1.5, FT = 2.2
const zr = (y: number) => CROWN - (CROWN - EAVE) * ((y - YC) / (YN - YC)) ** 2
// the vault's plan, per y: the west end steps at y = -8, the east corner is slanted
const xW = (y: number) => (y < -8 ? -75.2 : -64.2)
const xE = (y: number) => (y < -12 ? 63.5 + ((-12 - y) / 30.6) * 7.0 : 63.5)
// y stations: walls at YS..YN; the roof reaches OV further
const ys: number[] = [YS, -38, -30, -22, -12, -8, -2, 4, 10, 18, 26, 34, 42, YN]

/** End walls of the upper storey, under the arch, with the vault over them. */
function vault() {
  // upper walls along the long sides (dark), from the base to the fascia's underside
  const zs = zr(YS) - FT, zn = zr(YN) - FT
  dark.quad([xW(YS), YS, BASE], [xE(YS), YS, BASE], [xE(YS), YS, zs], [xW(YS), YS, zs])
  dark.quad([xE(YN), YN, BASE], [xW(YN), YN, BASE], [xW(YN), YN, zn], [xE(YN), YN, zn])
  for (let k = 0; k < ys.length - 1; k++) {
    const y0 = ys[k], y1 = ys[k + 1], ym = (y0 + y1) / 2
    const a = zr(y0) - FT, b = zr(y1) - FT
    // east end wall (faces +x, slanted south of -12)
    dark.quad([xE(y0), y0, BASE], [xE(y1 - 1e-6), y1, BASE], [xE(y1 - 1e-6), y1, b], [xE(y0), y0, a])
    // west end wall (faces -x)
    const w = xW(ym)
    dark.quad([w, y1, BASE], [w, y0, BASE], [w, y0, a], [w, y1, b])
  }
  // the step in the west end at y = -8
  dark.quad([-64.2, -8, BASE], [-75.2, -8, BASE], [-75.2, -8, zr(-8) - FT], [-64.2, -8, zr(-8) - FT])
  // the roof: one strip per station, overhanging OV all round, with a fascia FT deep
  const st = [YS - OV, ...ys.slice(1, -1), YN + OV]
  const xe = (y: number) => xE(y) + OV
  for (let k = 0; k < st.length - 1; k++) {
    const y0 = st[k], y1 = st[k + 1], ym = (y0 + y1) / 2
    const w = xW(ym) - OV
    const e0 = xe(y0), e1 = xe(y1)
    const t0 = zr(y0), t1 = zr(y1)
    roof.quad([w, y0, t0], [e0, y0, t0], [e1, y1, t1], [w, y1, t1])
    // underside
    roof.quad([w, y0, t0 - FT], [w, y1, t1 - FT], [e1, y1, t1 - FT], [e0, y0, t0 - FT])
    // fascias at the ends
    roof.quad([e0, y0, t0 - FT], [e1, y1, t1 - FT], [e1, y1, t1], [e0, y0, t0])
    roof.quad([w, y1, t1 - FT], [w, y0, t0 - FT], [w, y0, t0], [w, y1, t1])
  }
  // the fascia's step at the west end, and the long-side fascias
  const s = -8
  roof.quad([xW(-9) - OV, s, zr(s) - FT], [xW(-7) - OV, s, zr(s) - FT], [xW(-7) - OV, s, zr(s)], [xW(-9) - OV, s, zr(s)])
  roof.quad([xW(-9) - OV, s, zr(s)], [xW(-7) - OV, s, zr(s)], [xW(-7) - OV, s, zr(s) - FT], [xW(-9) - OV, s, zr(s) - FT])
  const y0 = YS - OV, y1 = YN + OV
  roof.quad([xW(y0) - OV, y0, zr(y0) - FT], [xe(y0), y0, zr(y0) - FT], [xe(y0), y0, zr(y0)], [xW(y0) - OV, y0, zr(y0)])
  roof.quad([xe(y1), y1, zr(y1) - FT], [xW(y1) - OV, y1, zr(y1) - FT], [xW(y1) - OV, y1, zr(y1)], [xe(y1), y1, zr(y1)])
}
vault()

// ── Fins on both ends: bold white uprights on the dark upper storey ──
function fins(x: number, out: number, y0: number, y1: number) {
  const n = Math.round((y1 - y0) / 2.3), p = (y1 - y0) / n
  for (let i = 0; i < n; i++) {
    const yc = y0 + (i + 0.5) * p, w = 1.2
    const top = Math.min(zr(yc - w / 2), zr(yc + w / 2)) - FT
    const xa = out > 0 ? x : x - 0.45, xb = out > 0 ? x + 0.45 : x
    box(pre, xa, xb, yc - w / 2, yc + w / 2, BASE + 1.2, top, null, 0)
  }
}
fins(63.5, 1, -8, 33)
fins(-64.2, -1, 2, 40)

// ── North corner: the glass stair tower and its mast ──
box(pre, 40.5, 48.5, 37.5, 48.8, BASE, 46, null, 0.2)
box(glass, 40.8, 48.2, 37.8, 48.5, 46, 51.5, null, 0)
box(pre, 40.4, 48.6, 37.4, 48.9, 51.5, 53.5, roof, 0.3)
box(roof, 45.6, 46.4, 44.6, 45.4, 53.5, 73, roof, 0)

// ── North-east end: glass wall, sign, Bruins banner ──
type F = [XY, XY]
const NE: F = [[67.6, -12.1], [68.4, 44.4]], NE2: F = [[73.5, -43.1], [67.6, -12.1]]
const L1 = Math.hypot(0.8, 56.5), L2 = Math.hypot(5.9, 31.0)
const s1 = (y: number) => ((y + 12.1) / 56.5) * L1, s2 = (y: number) => ((y + 43.1) / 31.0) * L2
// the glass curtain wall with its slanted north edge
onWall(glass, NE[0], NE[1], [[s1(-6), 12], [s1(39.5), 12], [s1(42.5), 28.6], [s1(-6), 28.6]], 0.08)
onWall(pre, NE[0], NE[1], [[s1(-6.6), 11.4], [s1(40.1), 11.4], [s1(43.2), 29.2], [s1(-6.6), 29.2]], 0.04)
// the sign over it: the green TD square and the gold GARDEN board
box(green, 67.7, 68.3, -6.0, -2.4, 29.6, 33.2, green, 0)
box(gold, 67.8, 68.3, -1.6, 13.0, 30.0, 32.9, gold, 0)
// the Bruins banner: black, with its gold ring
onWall(dark, NE2[0], NE2[1], rectShape(s2(-37.5), s2(-15), 13, 29.5), 0.06)
{
  const c = (s2(-37.5) + s2(-15)) / 2, zc = 23
  const ring = (r: number) => Array.from({ length: 16 }, (_, i) => [c + r * Math.cos((i / 16) * Math.PI * 2), zc + r * Math.sin((i / 16) * Math.PI * 2)] as [number, number])
  onWall(gold, NE2[0], NE2[1], ring(5.4), 0.1)
  onWall(dark, NE2[0], NE2[1], ring(4.6), 0.14)
}
// the teal glass strip at the east corner
onWall(glass, NE2[0], NE2[1], rectShape(s2(-43.1) + 0.6, s2(-38.5), 13.5, 29), 0.06)
// the glazed concourse along the street level of the north-east end
onWall(dark, NE[0], NE[1], rectShape(s1(-10), s1(42), 0.6, 4.6), 0.05)
for (let y = -8; y < 40; y += 6.5) onWall(glass, NE[0], NE[1], rectShape(s1(y), s1(y + 5), 1.4, 4.0), 0.09)

// ── North-west side: the big billboard, the street-level glazing ──
const NW: F = [[55.4, 49.0], [-59.6, 47.1]]
const sN = (x: number) => ((55.4 - x) / 115.0) * Math.hypot(115.0, 1.9)
onWall(dark, NW[0], NW[1], rectShape(sN(54), sN(30), 17, 28), 0.08)
for (let x = 20; x > -55; x -= 12) onWall(glass, NW[0], NW[1], rectShape(sN(x), sN(x - 8), 1.5, 4.5), 0.06)
// the south-west end: plain precast with a band of street glazing
const SW: F = [[-76.3, -44.2], [-76.6, -9.0]]
onWall(glass, SW[0], SW[1], rectShape(4, 31, 1.5, 4.5), 0.06)
// the Causeway Street side, now behind The Hub: grouped panels high up
const SE: F = [[-76.3, -44.2], [73.5, -43.1]]
void SE
void capPoly

const lit = (p: V3) => (p[2] > BASE + 1 ? 0.85 : 0)
await save('bos-td-garden', 'TD Garden', [
  { part: pre, material: { ...finish('tdg-precast', 0xd3ccc0), floodlight: lit } },
  { part: dark, material: finish('tdg-dark', 0x4f555c) },
  { part: roof, material: finish('tdg-silver', 0xaeb3b7) },
  { part: glass, material: { ...PALETTE.window, color: 0x4f8584 } },
  { part: green, material: finish('neon-tdg-green', 0x3f9a52) },
  { part: gold, material: finish('neon-tdg-gold', 0xe3b84a) },
], { height: 73, anchor: [42.3663149, -71.0621483], bearing: 325 })
