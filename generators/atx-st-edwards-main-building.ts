/**
 * St. Edward's University Main Building (1888, rebuilt 1903; Nicholas J.
 * Clayton, Gothic Revival), 3001 South Congress Avenue, Austin —
 * procedural, CC0-1.0, no textures.
 *   bun generators/atx-st-edwards-main-building.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 25.5 (the long axis of
 * the OSM outline), so +x runs along the building to the east-south-east
 * and the front with the tower faces -y (south-south-west). Anchor = area
 * centroid of OSM way/188589266, -97.755041, 30.229653. z = 0 is the
 * ground, flat across the site within 0.5 m (lidar and the map's terrain).
 *
 * Identity: the long four-storey rubble-limestone block with the tall
 * central clock and bell tower over the entrance (a gabled frontispiece,
 * the belfry with three pointed openings a side, a deep corbelled cornice
 * with corner pinnacles, and the steep red pyramidal spire with gablets
 * and a cross); the two end pavilions projecting front and back, with steep
 * red hipped roofs and front gables (a big pointed window on the west one,
 * a rose window on the east one); the round corner turrets with red cones;
 * the pointed-arch portal with its red doors up a flight of steps; rows of
 * pointed and square-headed windows by storey.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame; ground 4.2 m over ground_min):
 *  - plan: the OSM outline (the lidar edges agree within a metre);
 *  - the middle block's eaves 15.5 (lidar 19.6 to 20.0), its hipped ridge
 *    19.5 (lidar 23.6 to 23.8); the pavilions' eaves 16.5 (lidar 20.9 at
 *    their edges), their hipped ridges 24.2, running north-south (lidar
 *    28.2 to 28.6 at x ±23): measured;
 *  - the tower: the top of its corbelled cornice 29.6 (lidar 33.3 to 34.4
 *    round a 9 m square, which takes in the corbelling), the spire's apex
 *    38 (lidar 40 to 41.3 a metre off its axis) and the cross's top 42.5
 *    (lidar 46.8, the highest return): measured; the shaft 7.0 m and the
 *    cornice 7.9 m wide, the gablets a third of the way up the spire, the spire's base 6.0 m, the gable over the front
 *    to 23, the belfry openings 22 to 25.4 and the corner pinnacles:
 *    scaled from the close-up "mulder" (the frontispiece's 9.5 m from OSM
 *    = 205 px) and checked against "hens" and "lsm-b" (the spire 1.2 to
 *    1.4 times as tall as its base, as the lidar gives): estimated;
 *  - storeys: a raised basement and three floors (OSM building:levels 4);
 *    the windows' sizes and rhythm from "mulder" (about 1.85 m centres);
 *    the portal and its steps from "mulder"; the turrets and gables from
 *    "mulder-se" and "hens": estimated;
 *  - colours from "mulder-se" (sunlit) and "mulder", pulled to the
 *    palette's lightness: rubble limestone #c1b89f -> #e3dccb, the red
 *    roofs and doors #a96e6d (vivid in "lsm-b") -> #b8625b, the yellow
 *    brick #bda27a -> #dcc7a2, the pale trim the palette's trim.
 *
 * Sources (all EVIDENCE):
 *  mulder    "St Edwards Main Building.jpg", Mulder416 at English Wikipedia,
 *            public domain (the front, on the axis)
 *            https://commons.wikimedia.org/wiki/File:St_Edwards_Main_Building.jpg
 *  mulder-se "St Edwards main building SE.jpg", Mulder416 at English
 *            Wikipedia, public domain (the east pavilion from the south-east)
 *            https://commons.wikimedia.org/wiki/File:St_Edwards_main_building_SE.jpg
 *  lsm-b     "StEdwardsUniversity-April2008-b.JPG", LoneStarMike, CC BY-SA 3.0
 *            (the whole building from afar)
 *            https://commons.wikimedia.org/wiki/File:StEdwardsUniversity-April2008-b.JPG
 *  hens      "Neighborhood ATX-17.jpg", Hensbread, CC BY 4.0 (from the air,
 *            the front and roofs)
 *            https://commons.wikimedia.org/wiki/File:Neighborhood_ATX-17.jpg
 * Also OSM (ODbL) and the lidar above. No look-only sources, no commercial
 * imagery.
 *
 * Replaces the outline way/188589266 (no parts).
 *
 * Doubts: no photo shows the north (back) side, which gets the front's
 * window rows; the small dormers and gablets on the middle block's and the
 * pavilions' roofs are left out; the yellow brick is drawn on the east
 * pavilion's south face only, where "mulder-se" shows it (the aerial is
 * too pale to confirm). The west pavilion's end face is drawn without a
 * gable ("hens" shows a plain hip there); the east one's end gable follows
 * "mulder-se". The pinnacles on the gables are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, circle, save, type XY } from './atl-flatiron-building'
import { gableRoof, hipRoof, opening, flush } from './atx-governors-mansion'
import { drum } from './atx-bullock-museum'

if (import.meta.main) {
  const stone = new Part(), trim = new Part(), red = new Part(), win = new Part(), brick = new Part()

  const BX = 15.7, BS = -8.2, BN = 8.7, BEAVE = 15.5, BRIDGE = 19.5
  const PW0 = -32.2, PE1 = 32.3, PS = -12.8, PN = 13.2, PEAVE = 16.5, PRIDGE = 24.2
  const TX = -0.12, TY = -8.1, TS = -12.7

  // ── massing ──
  box(stone, -BX - 0.2, BX + 0.2, BS, BN, 0, BEAVE - 0.7, null, 0)
  box(trim, -BX - 0.2, BX + 0.2, BS - 0.3, BN + 0.3, BEAVE - 0.7, BEAVE, null, 0.15, true)
  hipRoof(red, -BX - 3, BX + 3, BS - 0.35, BN + 0.35, BEAVE, BRIDGE)
  for (const [x0, x1] of [[PW0, -15.6], [15.6, PE1]]) {
    box(stone, x0, x1, PS, PN, 0, PEAVE - 0.7, null, 0)
    box(trim, x0 - 0.3, x1 + 0.3, PS - 0.3, PN + 0.3, PEAVE - 0.7, PEAVE, null, 0.15, true)
    hipRoof(red, x0 - 0.35, x1 + 0.35, PS - 0.35, PN + 0.35, PEAVE, PRIDGE)
  }
  // the pavilions' gables: south fronts of both, the east one's end
  const GW = 4.6, GTOP = 23.5
  for (const xc of [(PW0 - 15.6) / 2, (15.6 + PE1) / 2]) {
    gableRoof(red, null, xc - GW - 0.3, xc + GW + 0.3, PS - 0.5, PS + 7, PEAVE, GTOP + 0.3, 'y', 0)
    // the gable wall, from the eaves to the apex
    for (const [y, dir] of [[PS - 0.2, -1], [PS + 1, 1]] as [number, number][]) {
      const A: V3 = [xc - GW, y, PEAVE - 0.7], B: V3 = [xc + GW, y, PEAVE - 0.7], C: V3 = [xc, y, GTOP]
      if (dir < 0) stone.tri(A, B, C)
      else stone.tri(B, A, C)
    }
  }
  {
    const yc = 0.2
    gableRoof(red, null, PE1 - 7, PE1 + 0.5, yc - GW - 0.3, yc + GW + 0.3, PEAVE, GTOP + 0.3, 'x', 0)
    stone.tri([PE1 + 0.2, yc - GW, PEAVE - 0.7], [PE1 + 0.2, yc + GW, PEAVE - 0.7], [PE1 + 0.2, yc, GTOP])
  }

  // ── the tower ──
  box(stone, TX - 4.72, TX + 4.72, TS, -3.5, 0, BEAVE + 0.4, null, 0)
  // the gable on its front, a stone wall with a pale coping, rising in front of the shaft
  {
    const y0 = TS - 0.05, y1 = TS + 1.2, z0 = BEAVE + 0.4, zt = 23.0, h = 4.72
    for (const [y, out] of [[y0, true], [y1, false]] as [number, boolean][]) {
      const A: V3 = [TX - h, y, z0], B: V3 = [TX + h, y, z0], C: V3 = [TX, y, zt]
      if (out) stone.tri(A, B, C)
      else stone.tri(B, A, C)
    }
    for (const s of [-1, 1]) {
      const a: V3 = [TX + s * h, y0, z0], b: V3 = [TX, y0, zt], c: V3 = [TX, y1, zt], d: V3 = [TX + s * h, y1, z0]
      // the coping on each rake, a little proud
      const up = 0.35
      const q: V3[] = [[a[0] + s * 0.2, a[1] - 0.1, a[2]], [b[0], b[1] - 0.1, b[2] + up], [c[0], c[1], c[2] + up], [a[0] + s * 0.2, d[1], a[2]]]
      trim.quad(q[0], q[1], q[2], q[3]) // both sides: a thin coping seen from above and below
      trim.quad(q[3], q[2], q[1], q[0])
    }
  }
  // the shaft, the belfry, the corbelled cornice
  box(stone, TX - 3.5, TX + 3.5, TY - 3.5, TY + 3.5, BEAVE, 27.0, null, 0)
  box(trim, TX - 3.65, TX + 3.65, TY - 3.65, TY + 3.65, 26.6, 27.1, null, 0.1, true)
  // the belfry: three pointed openings on each face
  {
    const q: XY[] = [[TX - 3.5, TY - 3.5], [TX + 3.5, TY - 3.5], [TX + 3.5, TY + 3.5], [TX - 3.5, TY + 3.5]]
    for (let i = 0; i < 4; i++) for (const s of [1.6, 3.5, 5.4]) opening(win, q[i], q[(i + 1) % 4], s, 1.25, 23.0, 25.4, 'pointed', 0.05)
  }
  box(stone, TX - 3.95, TX + 3.95, TY - 3.95, TY + 3.95, 27.1, 29.6, stone, 0.2, true)
  // the spire, four gablets at its foot, the cross
  {
    const b = 3.0, z0 = 29.6, apex = 38.0
    const c: V3[] = [[TX - b, TY - b, z0], [TX + b, TY - b, z0], [TX + b, TY + b, z0], [TX - b, TY + b, z0]], top: V3 = [TX, TY, apex]
    for (let i = 0; i < 4; i++) red.tri(c[i], c[(i + 1) % 4], top)
    // gablets: a pale vertical triangle a third of the way up each face ("mulder"), its little roof running back into the spire
    const gw = 0.8, gh = 1.9, gz = z0 + 2.2, gd = b * (1 - (gz - z0) / (apex - z0)) // the spire's half-width at the gablet's foot
    for (const [n, t] of [[[0, -1], [1, 0]], [[1, 0], [0, 1]], [[0, 1], [-1, 0]], [[-1, 0], [0, -1]]] as [XY, XY][]) {
      const F = (s: number, z: number, d: number): V3 => [TX + n[0] * (gd + 0.25 - d) + t[0] * s, TY + n[1] * (gd + 0.25 - d) + t[1] * s, z]
      trim.tri(F(-gw, gz, 0), F(gw, gz, 0), F(0, gz + gh, 0))
      const back = 1.6
      red.quad(F(gw, gz, 0), F(gw, gz, back), F(0, gz + gh, back), F(0, gz + gh, 0))
      red.quad(F(0, gz + gh, 0), F(0, gz + gh, back), F(-gw, gz, back), F(-gw, gz, 0))
      // the gablet's cheeks down to the spire
      red.tri(F(gw, gz, 0), F(gw, gz, back), F(gw, gz - 0.6, back))
    }
    // the corner pinnacles on the cornice
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const pc: XY = [TX + sx * 3.45, TY + sy * 3.45]
      drum(stone, pc, 0.45, z0, z0 + 1.2, 8, null)
      const ring = circle(pc, 0.5, 8)
      for (let i = 0; i < 8; i++) red.tri([ring[i][0], ring[i][1], z0 + 1.2], [ring[(i + 1) % 8][0], ring[(i + 1) % 8][1], z0 + 1.2], [pc[0], pc[1], z0 + 2.4])
    }
    box(trim, TX - 0.17, TX + 0.17, TY - 0.17, TY + 0.17, apex - 0.3, 42.5, trim, 0.05)
    box(trim, TX - 0.75, TX + 0.75, TY - 0.17, TY + 0.17, 40.6, 41.0, trim, 0.05)
  }

  // ── the round corner turrets with their cones ──
  for (const pc of [[PW0, PS], [PE1, PS]] as XY[]) {
    drum(stone, pc, 1.4, 0, 19.0, 12, null)
    drum(trim, pc, 1.55, 18.6, 19.1, 12, null)
    const ring = circle(pc, 1.6, 12)
    for (let i = 0; i < 12; i++) red.tri([ring[i][0], ring[i][1], 19.1], [ring[(i + 1) % 12][0], ring[(i + 1) % 12][1], 19.1], [pc[0], pc[1], 24.2])
  }

  // ── the yellow brick on the east pavilion's south face ──
  flush(brick, [15.6, PS], [PE1, PS], 1.4, PE1 - 15.6 - 0.05, 0, PEAVE - 0.7, 0.03)
  brick.tri([PE1 - 8.35 - GW, PS - 0.23, PEAVE - 0.7], [PE1 - 8.35 + GW, PS - 0.23, PEAVE - 0.7], [PE1 - 8.35, PS - 0.23, GTOP - 0.1])

  // ── windows: a raised basement and three floors, by storey ──
  type Face = [XY, XY]
  function rows(a: XY, b: XY, s0: number, s1: number, pitch: number, out = 0.07) {
    const L = s1 - s0, n = Math.max(1, Math.round(L / pitch)), p = L / n
    for (let k = 0; k < n; k++) {
      const s = s0 + (k + 0.5) * p
      opening(win, a, b, s, 0.8, 0.9, 1.9, 'flat', out) // the basement
      opening(win, a, b, s, 1.0, 3.4, 5.6, 'pointed', out) // the first floor's tall pointed windows
      opening(win, a, b, s, 1.0, 7.4, 9.9, 'flat', out) // the second floor
      opening(win, a, b, s, 0.8, 11.4, 13.0, 'pointed', out) // the third floor's small pointed windows
    }
  }
  const faces: Array<[Face, number, number, number]> = [
    // the middle block, front (left of the tower, right of it) and back
    [[[-15.6, BS], [TX - 4.72, BS]], 0.8, 0.6, 1.85],
    [[[TX + 4.72, BS], [15.6, BS]], 0.6, 0.8, 1.85],
    [[[15.6, BN], [-15.6, BN]], 0.8, 0.8, 1.85],
    // the pavilions: fronts, backs, ends, inner sides
    [[[PW0, PS], [-15.6, PS]], 2.2, 0.8, 2.3],
    [[[15.6, PS], [PE1, PS]], 0.8, 2.2, 2.3],
    [[[-15.6, PN], [PW0, PN]], 0.8, 0.8, 2.3],
    [[[PE1, PN], [15.6, PN]], 0.8, 0.8, 2.3],
    [[[PW0, PN], [PW0, PS]], 0.8, 2.2, 2.3],
    [[[PE1, PS], [PE1, PN]], 2.2, 0.8, 2.3],
    [[[-15.6, PS], [-15.6, BS]], 0.6, 0.6, 2.3],
    [[[15.6, BS], [15.6, PS]], 0.6, 0.6, 2.3],
  ]
  for (const [[a, b], m0, m1, pitch] of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L - m0 - m1 < 1.2) continue
    rows(a, b, m0, L - m1, pitch, a[1] === PS && a[0] > 0 && b[0] > 0 ? 0.08 : 0.07)
  }
  // the tower's front: three pointed windows under the gable, the portal, the windows over it
  const TA: XY = [TX - 4.72, TS], TB: XY = [TX + 4.72, TS]
  opening(win, TA, TB, 4.72, 1.4, 15.9, 18.3, 'pointed', 0.06)
  opening(win, TA, TB, 3.0, 0.9, 15.9, 17.6, 'pointed', 0.06)
  opening(win, TA, TB, 6.44, 0.9, 15.9, 17.6, 'pointed', 0.06)
  for (const s of [3.4, 4.72, 6.04]) opening(win, TA, TB, s, 0.9, 11.4, 13.2, 'flat', 0.06)
  // the porch: a gabled stone portal with the red doors under a pointed arch, up a flight of steps
  {
    const x0 = TX - 3.2, x1 = TX + 3.2, y0 = TS - 1.5, top = 8.6, apex = 10.9
    box(stone, x0, x1, y0, TS + 0.1, 0, top, null, 0)
    for (const [y, out] of [[y0, true], [TS + 0.1, false]] as [number, boolean][]) {
      const A: V3 = [x0, y, top], B: V3 = [x1, y, top], C: V3 = [TX, y, apex]
      if (out) stone.tri(A, B, C)
      else stone.tri(B, A, C)
    }
    gableRoof(trim, null, x0 - 0.15, x1 + 0.15, y0 - 0.1, TS + 0.1, top, apex + 0.15, 'y', 0)
    const PA: XY = [x0, y0], PB: XY = [x1, y0]
    opening(trim, PA, PB, 3.2, 3.6, 2.4, 5.0, 'pointed', 0.04) // the pale arch round the door
    opening(red, PA, PB, 3.2, 2.6, 2.4, 5.2, 'pointed', 0.08) // the red doors
    for (let k = 0; k < 5; k++) box(stone, TX - 2.4 - 0.4 * k, TX + 2.4 + 0.4 * k, y0 - 0.55 * (k + 1), y0, 0, 2.4 - 0.48 * k, stone, 0.03)
  }
  // the gables' windows: a tall pointed window on the west front, a rose on the east front, a pointed window on the east end
  {
    const xw = (PW0 - 15.6) / 2, xe = (15.6 + PE1) / 2
    opening(win, [xw - GW, PS - 0.2], [xw + GW, PS - 0.2], GW, 2.6, PEAVE + 0.2, 19.6, 'pointed', 0.06)
    const rc: V3 = [xe, PS - 0.28, 19.0]
    const ring = (r: number, d: number) => circle([rc[0], rc[2]], r, 16).map(([x, z]) => [x, rc[1] - d, z] as V3)
    const o = ring(2.0, 0), i = ring(1.55, 0.02)
    for (let k = 0; k < 16; k++) {
      const l = (k + 1) % 16
      trim.quad(o[k], i[k], i[l], o[l])
      win.tri([rc[0], rc[1] - 0.02, rc[2]], i[l], i[k])
    }
    opening(win, [PE1 + 0.2, 0.2 - GW], [PE1 + 0.2, 0.2 + GW], GW, 2.2, PEAVE + 0.2, 19.4, 'pointed', 0.06)
  }

  const front = (p: V3, n: V3) => (n[1] < -0.5 && Math.abs(p[0] - TX) < 5 ? 0.6 : 0)
  await save('atx-st-edwards-main-building', "St. Edward's University Main Building", [
    { part: stone, material: { ...finish('stedwards-limestone', 0xe3dccb), floodlight: front } },
    { part: trim, material: PALETTE.trim },
    { part: red, material: finish('stedwards-red', 0xb8625b) },
    { part: win, material: PALETTE.window },
    { part: brick, material: finish('stedwards-brick', 0xdcc7a2) },
  ], { bearing: 25.5, replaces: ['way/188589266'] }, 6500)
}
