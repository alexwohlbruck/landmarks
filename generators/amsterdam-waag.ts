/**
 * De Waag (Sint Antoniespoort), Nieuwmarkt 4, Amsterdam: original
 * procedural geometry, CC0-1.0.
 * bun generators/amsterdam-waag.ts
 *
 * A fifteenth-century city gate, a weigh house since 1617: the main gate
 * block under a tall slate pyramid, two big round towers with dark slate
 * cones beside it, the forward gate (voorpoort) on the Nieuwmarkt with two
 * slim round corner towers under pale lead cones, and two octagonal stair
 * turrets at the back corners; dark brick banded with white sandstone.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/57857390,
 * 52.372771, 4.900323. Bearing 64: the outline's long walls run at 64 and
 * 154 degrees; in this frame the building's axis lies along x, the
 * voorpoort at +x (it faces 154 degrees, south-south-east, onto the
 * Nieuwmarkt) and the back gate at -x.
 *
 * Identity, in order: the cluster of pointed roofs of different sizes and
 * colours (the tall central pyramid, the dark cones of the big towers,
 * the pale lead cones of the small ones); the round brick towers with
 * their white bands; the voorpoort's front between its two corner towers.
 *
 * Evidence:
 *  - plan and parts: OSM outline way/57857390 and its parts, read in the
 *    turned frame: big round towers 749066949 and 749066950 (r 3.4 m at
 *    x 1.6, y +-7.9; 20 m with a 7 m roof), voorpoort 749066948 (x 3.2..11.2,
 *    y -6.1..6.2; 17 m, gabled), its corner towers 749066946 and 749066947
 *    (r 1.7 m at x 11.2, y 6.3 and -6.15; 17 m with a 7 m roof), stair
 *    turrets 749066944 and 749066945 (r 1.65 m at x -11.5, y 6.65 and
 *    -7.25; 15 m with a 4 m roof), the back block 749066940 (x -11.2..-7.2),
 *    the side lean-tos 749066939 and 749066942 (15 m, 4 m skillion roofs
 *    sloping outwards), the central body 749066938 and its pyramid
 *    749066943 (a chamfered square 10.2 m across, 13-26 m), and the
 *    canopy 749066941 (6 m) in front of the voorpoort.
 *  - heights: OSM's part heights (no source tag), checked against the
 *    photos: big tower walls 12.5 m and cones to 20.5 m (Zairon's level
 *    photo from the west and his view from the Oude Kerk, where the cones
 *    are steeper than half their width); stair turret walls 11.5 m, cones to 15.2 m
 *    (same photo); back eaves 11 m (the 1890s RCE photo from the south-
 *    west, 28 px/m on the 20 m cones); the gate block's walls to 14.4 m (its
 *    white cornice in Zairon's photo), a balustrade with balls round its
 *    flat west end (Zairon's view from the Oude Kerk), and the pyramid,
 *    9.8 m across, to OSM's 26 m (the RCE photo gives about 24 m); voorpoort walls 10.5 m, its towers 11 m
 *    with cones to 17 m (C messier's and Gouwenaar's photos of the front).
 *  - colours from the daylight photos: dark red-brown brick (OSM's
 *    building:colour #573c2d, pulled to the palette's lightness as a
 *    purplish brown, #7a5650), white
 *    sandstone bands and window frames, dark slate on the pyramid and the
 *    big cones, pale lead on the small cones and the canopy.
 *  - night: floodlit (the dusk photos show it lit).
 *  - elevation 0 (flat square). No lidar.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Amsterdam_(NL),_Waag_--_2015_--_7258.jpg (Dietmar Rabich,
 *    CC BY-SA 4.0): from the south-west across the market.
 *  - Amsterdam_Oude_Kerk_Blick_vom_Turm_auf_De_Waag.jpg (Zairon,
 *    CC BY-SA 4.0): the roofs from above, from the west.
 *  - Amsterdam_De_Waag_2.jpg (Zairon, CC BY-SA 4.0): the back gate, a big
 *    tower and a stair turret, level.
 *  - Amsterdam_Waag_2107.jpg and Amsterdam_Waag_2115.jpg (C messier,
 *    CC BY-SA 4.0): the side and the voorpoort's front at dusk.
 *  - De_Waag_Nieuwmarkt_Amsterdam.jpg (Gouwenaar, CC0): the voorpoort's
 *    front, sunlit.
 *  - Uit_het_zuid-westen_-_Amsterdam_-_20011129_-_RCE.jpg (unknown author,
 *    Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0): the back gate
 *    and the roofs from an upper floor, about 1890.
 *  - Amsterdam_(NL),_Waag_--_2015_--_7261.jpg (Dietmar Rabich,
 *    CC BY-SA 4.0): the brick and sandstone banding up close.
 * No commercial imagery. No look-only sources.
 *
 * Sandstone bands: two bold ones on each tower at the heights of the main
 * banding in the photos, not every course. Left out: the red shutters, the gable stones and guild doorways, the
 * small finials and the chimneys, the café's umbrellas.
 *
 * Doubts: the roofs between the lean-tos and the pyramid are simplified;
 * OSM's heights carry no source; the north stair turret is seen only from
 * above.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archOn, ball, band, cap, face, floodAll, lathe, ngonF, prism, rect, rectOn, save, segs, walls, type XY } from './amsterdam-munttoren'

/** A round brick tower with white bands, a corbel frieze and a cornice. */
function tower(brick: Part, trim: Part, slate: Part, cx: number, cy: number, r: number, wall: number, bands: number[], n = 14) {
  const ring = ngonF(cx, cy, r, n)
  walls(brick, ring, 0, wall - 1.1)
  // corbelled top: the wall steps out under the cornice
  walls(brick, ring, wall - 1.1, wall - 0.75, ngonF(cx, cy, r + 0.18, n))
  walls(brick, ngonF(cx, cy, r + 0.18, n), wall - 0.75, wall - 0.25)
  for (const z of bands) band(trim, ring, z, z + 0.5, 0.04, 0.03, false, false)
  // the arch frieze: little dark arches under the step
  for (const [a, b] of segs(ring)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    archOn(slate, a, b, L / 2, L * 0.3, wall - 1.6, wall - 1.5, 0.03, 4)
  }
  band(trim, ngonF(cx, cy, r + 0.18, n), wall - 0.3, wall, 0.12, 0.08)
  return ring
}

/** A cone from radius r at z0 to an apex, smooth, with a ball on top. */
function cone(p: Part, knob: Part, cx: number, cy: number, r: number, z0: number, apex: number, n = 14, kr = 0.22) {
  lathe(p, cx, cy, [[r, z0], [r * 0.9, z0 + 0.25], [0.05, apex], [0, apex]], n)
  cap(p, ngonF(cx, cy, r, n).map(([x, y]) => [x, y] as XY), z0, false)
  lathe(knob, cx, cy, [[0.06, apex - 0.1], [0.06, apex + 0.7], [0, apex + 0.75]], 4)
  ball(knob, cx, cy, apex + 0.35, kr, 6)
}

/** A dormer standing on a roof slope, facing out along (nx, ny). */
function dormer(slate: Part, trim: Part, win: Part, x: number, y: number, z: number, nx: number, ny: number, hw = 0.7, h = 1.5, d = 1.6) {
  const ux = -ny, uy = nx
  const P = (s: number, o: number, zz: number): V3 => [x + ux * s + nx * o, y + uy * s + ny * o, zz]
  face(trim, [P(-hw, 0, z), P(hw, 0, z), P(hw, 0, z + h), P(-hw, 0, z + h)], [nx, ny, 0])
  face(win, [P(-hw + 0.22, 0.05, z + 0.2), P(hw - 0.22, 0.05, z + 0.2), P(hw - 0.22, 0.05, z + h - 0.2), P(-hw + 0.22, 0.05, z + h - 0.2)], [nx, ny, 0])
  face(slate, [P(-hw - 0.1, 0.02, z + h), P(hw + 0.1, 0.02, z + h), P(0, 0.02, z + h + 0.8)], [nx, ny, 0])
  face(slate, [P(-hw - 0.1, 0.02, z + h), P(0, 0.02, z + h + 0.8), P(0, -d, z + h + 0.8), P(-hw - 0.1, -d, z + h)], [-ux * 0.8, -uy * 0.8, hw])
  face(slate, [P(hw + 0.1, 0.02, z + h), P(hw + 0.1, -d, z + h), P(0, -d, z + h + 0.8), P(0, 0.02, z + h + 0.8)], [ux * 0.8, uy * 0.8, hw])
  face(slate, [P(-hw, 0, z), P(-hw, 0, z + h), P(-hw, -d, z + h), P(-hw, -d, z)], [-ux, -uy, 0])
  face(slate, [P(hw, 0, z + h), P(hw, 0, z), P(hw, -d, z), P(hw, -d, z + h)], [ux, uy, 0])
}

function build() {
  const brick = new Part(), trim = new Part(), slate = new Part(), lead = new Part(), win = new Part()

  // ------------------------------------------------ the back body
  const EAVE = 11, MID = 14.4
  const XB0 = -11.2, XB1 = 3.2, YB0 = -7.1, YB1 = 6.9
  prism(brick, rect(XB0, YB0, XB1, YB1), 0, EAVE, false)
  band(trim, rect(XB0, YB0, XB1, YB1), EAVE - 0.3, EAVE + 0.05, 0.18, 0.08, false)
  band(trim, rect(XB0, YB0, XB1, YB1), 0, 0.6, 0.04, 0.03, false, false)
  // the gate block (back gate to voorpoort) rising to the pyramid's eave,
  // with a balustrade round its flat-roofed west end
  const CX0 = XB0, CX1 = 3.2, CY0 = -3.6, CY1 = 3.4
  prism(brick, rect(CX0, CY0, CX1, CY1), EAVE, MID, false)
  band(trim, rect(CX0, CY0, CX1, CY1), MID - 0.35, MID, 0.2, 0.1, false)
  {
    const r = rect(CX0 - 0.1, CY0 - 0.1, -6.6, CY1 + 0.1)
    cap(slate, rect(CX0, CY0, -6.6, CY1), MID - 0.2)
    walls(brick, r, MID, MID + 0.9)
    walls(brick, [...rect(CX0 + 0.25, CY0 + 0.15, -6.6, CY1 - 0.15)].reverse(), MID, MID + 0.9)
    const ri = rect(CX0 + 0.25, CY0 + 0.15, -6.6, CY1 - 0.15)
    for (let k = 0; k < 4; k++) {
      const l = (k + 1) % 4
      brick.quad([r[k][0], r[k][1], MID + 0.9], [r[l][0], r[l][1], MID + 0.9], [ri[l][0], ri[l][1], MID + 0.9], [ri[k][0], ri[k][1], MID + 0.9])
    }
    for (const [x, y] of [[CX0, CY0], [CX0, CY1], [CX0, (CY0 + CY1) / 2 - 1.2], [CX0, (CY0 + CY1) / 2 + 1.2], [-8.9, CY0], [-8.9, CY1]] as XY[]) ball(trim, x, y, MID + 1.35, 0.22, 6)
  }
  // lean-to roofs on the sides, sloping out, lead-covered
  const LT = 13.4
  const lean = (x0: number, x1: number, yo: number, yi: number) => {
    const s = Math.sign(yo - yi), o = 0.3
    face(lead, [[x0, yo + s * o, EAVE - 0.1], [x1, yo + s * o, EAVE - 0.1], [x1, yi, LT], [x0, yi, LT]], [0, s, Math.abs(yo - yi) / (LT - EAVE)])
    face(brick, [[x0 + 0.3, yo, EAVE], [x0 + 0.3, yi, LT], [x0 + 0.3, yi, EAVE]], [-1, 0, 0])
  }
  lean(XB0 - 0.3, CX1, YB1, CY1)
  lean(XB0 - 0.3, CX1, YB0, CY0)
  // windows in the strip over the lean-tos and in the gate block's west end
  for (const [a, b] of segs(rect(CX0, CY0, CX1, CY1))) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const cs = L > 10 ? [L * 0.18, L * 0.34] : [L * 0.25, L * 0.5, L * 0.75]
    const z0 = L > 10 ? LT + 0.1 : 11.4
    for (const c of cs) { rectOn(trim, a, b, c, 0.55, z0, MID - 0.45, 0.04); rectOn(win, a, b, c, 0.4, z0 + 0.1, MID - 0.55, 0.07) }
  }
  {
    // the back gate: a white stone arch in the -x face, windows over it
    const a: XY = [XB0, YB1], b: XY = [XB0, YB0]
    const L = YB1 - YB0, c = L / 2 + 0.3
    archOn(trim, a, b, c, 1.9, 0, 3.0, 0.05, 10)
    archOn(win, a, b, c, 1.5, 0, 3.0, 0.09, 10)
    for (const d of [-2.2, 0, 2.2]) { rectOn(trim, a, b, c + d, 0.7, 6.4, 8.9, 0.04); rectOn(win, a, b, c + d, 0.55, 6.55, 8.75, 0.08) }
  }
  // side windows of the back body, between the towers
  for (const [a, b] of [[[XB1, YB1], [XB0, YB1]], [[XB0, YB0], [XB1, YB0]]] as [XY, XY][]) {
    for (const x of [-3.6, -6.6]) {
      const c = Math.abs(x - a[0])
      rectOn(trim, a, b, c, 0.7, 6.4, 8.9, 0.04); rectOn(win, a, b, c, 0.55, 6.55, 8.75, 0.08)
    }
  }

  // --------------------------------------------- the central pyramid
  const PCX = -2.0, PCY = -0.15, PH = 4.9, PAPEX = 26
  const pring: XY[] = [[PCX - PH + 1.5, PCY - PH], [PCX + PH - 1.5, PCY - PH], [PCX + PH, PCY - PH + 1.5], [PCX + PH, PCY + PH - 1.5], [PCX + PH - 1.5, PCY + PH], [PCX - PH + 1.5, PCY + PH], [PCX - PH, PCY + PH - 1.5], [PCX - PH, PCY - PH + 1.5]]
  const pr2 = pring.map(([x, y]) => [PCX + (x - PCX) * 1.06, PCY + (y - PCY) * 1.06] as XY)
  for (let k = 0; k < 8; k++) {
    const p = pr2[k], q = pr2[(k + 1) % 8]
    slate.tri([p[0], p[1], MID - 0.1], [q[0], q[1], MID - 0.1], [PCX, PCY, PAPEX])
  }
  cap(slate, pr2, MID - 0.1, false)
  // dormers on the pyramid, front and back, and the hips' lead ribs
  dormer(slate, trim, win, PCX + PH * 0.62, PCY, 17.3, 1, 0, 0.75, 1.7, 1.6)
  dormer(slate, trim, win, PCX - PH * 0.62, PCY, 17.3, -1, 0, 0.75, 1.7, 1.6)
  dormer(slate, trim, win, PCX + 0.0, PCY + PH * 0.6, 17.6, 0, 1, 0.55, 1.3, 1.4)
  dormer(slate, trim, win, PCX + 0.0, PCY - PH * 0.6, 17.6, 0, -1, 0.55, 1.3, 1.4)
  lathe(lead, PCX, PCY, [[0.1, PAPEX - 0.3], [0.08, PAPEX + 1.8], [0, PAPEX + 1.85]], 4)
  {
    const z = PAPEX + 1.0
    const v: V3[] = [[PCX, PCY, z], [PCX + 1.0, PCY, z], [PCX + 1.0, PCY, z + 0.6], [PCX, PCY, z + 0.6]]
    face(lead, v, [0, -1, 0]); face(lead, v, [0, 1, 0])
  }

  // -------------------------------------------------- the big towers
  for (const sy of [1, -1]) {
    const cx = 1.6, cy = 7.9 * sy
    tower(brick, trim, slate, cx, cy, 3.4, 12.5, [2.4, 5.0], 14)
    cone(slate, lead, cx, cy, 3.65, 12.5, 20.5, 14, 0.25)
    dormer(slate, trim, win, cx + 2.2 * 0.5, cy + sy * 2.2 * 0.85, 13.4, 0.5, sy * 0.85, 0.45, 1.1, 1.2)
    // windows
    for (const [ang, z0, z1] of [[0, 9.2, 10.6], [90 * sy, 9.2, 10.6], [150 * sy, 9.2, 10.6], [45 * sy, 3.6, 5.6], [-40 * sy, 6.0, 7.6]] as [number, number, number][]) {
      const t = (ang * Math.PI) / 180, r = 3.4
      const c: XY = [cx + r * Math.cos(t), cy + r * Math.sin(t)]
      const a: XY = [c[0] + Math.sin(t) * 0.8, c[1] - Math.cos(t) * 0.8], b: XY = [c[0] - Math.sin(t) * 0.8, c[1] + Math.cos(t) * 0.8]
      rectOn(trim, a, b, 0.8, 0.6, z0 - 0.12, z1 + 0.12, 0.08); rectOn(win, a, b, 0.8, 0.46, z0, z1, 0.12)
    }
  }

  // ------------------------------------------------ the stair turrets
  for (const [cx, cy] of [[-11.5, 6.65], [-11.45, -7.25]] as [number, number][]) {
    const o = ngonF(cx, cy, 1.65, 8)
    prism(brick, o, 0, 11.5, false)
    for (const z of [4.2]) band(trim, o, z, z + 0.5, 0.04, 0.03, false, false)
    band(trim, o, 11.2, 11.6, 0.15, 0.08)
    segs(o).forEach(([a, b], k) => { if (k % 2 === 0) { archOn(trim, a, b, 0.67, 0.36, 8.6, 9.5, 0.04, 6); archOn(win, a, b, 0.67, 0.25, 8.7, 9.5, 0.07, 6) } })
    lathe(lead, cx, cy, [[1.95, 11.6], [1.7, 11.85], [0.05, 15.2], [0, 15.2]], 8, Math.PI / 8)
    lathe(lead, cx, cy, [[0.06, 15.1], [0.06, 16.0], [0, 16.05]], 4)
    ball(lead, cx, cy, 15.55, 0.18, 6)
  }

  // ------------------------------------------------ the voorpoort
  const VX0 = 3.2, VX1 = 11.2, VY0 = -6.1, VY1 = 6.2, VE = 10.5, VR = 17
  prism(brick, rect(VX0, VY0, VX1, VY1), 0, VE, false)
  band(trim, rect(VX0, VY0, VX1, VY1), VE - 0.35, VE + 0.05, 0.2, 0.1, false)
  for (const z of [3.0]) band(trim, rect(VX0, VY0, VX1, VY1), z, z + 0.5, 0.04, 0.03, false, false)
  {
    // a hipped roof: the hip at the front (+x), running back into the pyramid
    const hw = (VY1 - VY0) / 2, ym = (VY0 + VY1) / 2, o = 0.3, s = (VR - VE) / hw
    const xr = VX1 - hw * 0.95, lo = VE - o * s, xb = -0.5
    face(slate, [[xb, VY0 - o, lo], [VX1 + o, VY0 - o, lo], [xr, ym, VR], [xb, ym, VR]], [0, -1, 1 / s])
    face(slate, [[VX1 + o, VY1 + o, lo], [xb, VY1 + o, lo], [xb, ym, VR], [xr, ym, VR]], [0, 1, 1 / s])
    face(slate, [[VX1 + o, VY0 - o, lo], [VX1 + o, VY1 + o, lo], [xr, ym, VR]], [1, 0, 1 / s])
    dormer(slate, trim, win, VX1 - 2.4, ym, 12.2, 1, 0, 0.75, 1.6, 1.6)
  }
  // front windows: three tall white-framed ones under the cornice
  {
    const a: XY = [VX1, VY0], b: XY = [VX1, VY1], L = VY1 - VY0
    for (const d of [-2.3, 0, 2.3]) {
      rectOn(trim, a, b, L / 2 + d, 0.82, 6.4, 8.9, 0.04)
      rectOn(win, a, b, L / 2 + d, 0.66, 6.55, 8.75, 0.08)
    }
    // the gate arch behind the canopy
    archOn(trim, a, b, L / 2, 1.7, 0, 2.6, 0.04, 10)
    archOn(win, a, b, L / 2, 1.35, 0, 2.6, 0.08, 10)
  }
  for (const sy of [1, -1]) {
    const cx = 11.2, cy = sy > 0 ? 6.3 : -6.15
    tower(brick, trim, slate, cx, cy, 1.7, 11, [3.0, 6.6], 12)
    cone(lead, lead, cx, cy, 2.0, 11, 17, 12, 0.24)
    for (const [ang, z0, z1] of [[0, 7.0, 8.2], [90 * sy, 7.0, 8.2]] as [number, number, number][]) {
      const t = (ang * Math.PI) / 180, r = 1.7
      const c: XY = [cx + r * Math.cos(t), cy + r * Math.sin(t)]
      const a: XY = [c[0] + Math.sin(t) * 0.5, c[1] - Math.cos(t) * 0.5], b: XY = [c[0] - Math.sin(t) * 0.5, c[1] + Math.cos(t) * 0.5]
      archOn(trim, a, b, 0.5, 0.34, z0, z1, 0.08, 6); archOn(win, a, b, 0.5, 0.24, z0 + 0.1, z1, 0.12, 6)
    }
  }
  // the café's canopy between the corner towers (OSM 749066941)
  {
    const x0 = VX1, x1 = 12.9, y0 = -4.5, y1 = 4.6, z0 = 5.9, z1 = 4.9
    face(lead, [[x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0]], [z0 - z1, 0, x1 - x0])
    face(lead, [[x0, y0, z0 - 0.15], [x0, y1, z0 - 0.15], [x1, y1, z1 - 0.15], [x1, y0, z1 - 0.15]], [0, 0, -1])
    face(trim, [[x1, y0, z1 - 0.7], [x1, y1, z1 - 0.7], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
    for (const y of [y0, y1]) face(trim, [[x0, y, z0], [x1, y, z1], [x1, y, z1 - 0.7]], [0, Math.sign(y), 0])
    for (const y of [y0 + 0.2, 0, y1 - 0.2]) lathe(lead, x1 - 0.15, y, [[0.08, 0], [0.08, z1 - 0.7], [0, z1 - 0.7]], 4)
  }

  return [
    { part: brick, material: { ...finish('waag-brick', 0x7a5650), floodlight: floodAll } },
    { part: trim, material: { ...finish('waag-sandstone', 0xece4d4), floodlight: floodAll } },
    { part: slate, material: { ...finish('waag-slate', 0x5d646c), floodlight: floodAll } },
    { part: lead, material: { ...finish('waag-lead', 0xb3b9bd), floodlight: floodAll } },
    { part: win, material: { ...PALETTE.window } },
  ]
}

if (import.meta.main) await save('amsterdam-waag', 'De Waag', [52.372771, 4.900323], 64, build(), 6500)
