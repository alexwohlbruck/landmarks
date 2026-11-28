/**
 * Charles Evans Whittaker U.S. Courthouse (1998, Ellerbe Becket), 400 East
 * 9th Street, Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-whittaker-courthouse.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/118650973, -94.5777719 39.1039224.
 * The building is round in plan and symmetric about a north-south line, so
 * the bearing is 0. Elevation 0.
 *
 * Identity, in order: a great drum of pale stone, round in plan (R 46.8 m)
 * with its east and west sides flattened; the curved glass wall across the
 * north, toward the river; the two massive stone wings flanking a slot open
 * to the south, with the stepped glass entrance bay at the back of the slot
 * between stone pylons and the low round entrance pavilion in front of it;
 * the roof sloping down from the north rim to the slot; the comb of stone
 * fins on the wings' outer tops; narrow slit windows in the stone.
 *
 * Evidence
 * - OSM way/118650973 (11 levels, no height): the outline. It leaves out a
 *   round court (r ~17) where the slot is; lidar shows the tall walls only
 *   18 m apart there (x -11..7), so the slot is built from the lidar. The
 *   canopy way/466563343 (building=roof) stands inside the slot over the
 *   entrance pavilion; the model covers it.
 * - USGS 3DEP lidar MO_FEMANRCS_1_2020 (2020 flight), 1 m; it sits on the
 *   OSM outline. Heights above y = 0 (lowest ground under the footprint,
 *   the north-west corner; heights here are lidar - 0.3, and the map's
 *   lowest ground came out 1.3 m above the lidar's lowest return, so the
 *   model may stand ~1 m tall; the south side is ~6 m higher than the
 *   north), measured: north rim 80; the roof
 *   falling from 79 at the rim to 72 at the slot; wings 66-69 with a lower
 *   (61) comb strip on their outer edges; the pylons beside the glass bay
 *   72, its top 63; the entrance pavilion 22-25; the plaza before it ~8-9 (ground; the steps climb from it to the doors).
 *   Plan circle fitted to the lidar edge: centre (-1.5, -9.6), R 46.8,
 *   flat sides at x -44 and 41.
 * - Photos: "Charles Evans Whittaker Courthouse.jpeg" (Voidxor, CC BY-SA
 *   3.0; from the south: the wings, the glass bay, the pavilion, the stone
 *   colour); "Whittaker Federal Courthouse-south view-KCMO.jpg" (User:
 *   Charvex, public domain; south); Flickr 53575083001 (bjwhite66212,
 *   CC BY-SA 2.0; south, frontal: the comb fins on the wings' outer
 *   corners, slit windows, proportions of slot to wings ~ 0.27 of the
 *   width); Flickr 49743774103, 49744319876 and 44898528984 (Steam Pipe
 *   Trunk Distribution Venue, CC BY 2.0; the entrance pavilion and the
 *   glass bay; the curved east wall of stone with slit windows and its fin
 *   crown); "Kansas City Downtown Aerial (12448426133).jpg" (formulanone,
 *   CC BY-SA 2.0; from the north-east, high: the round plan, the sloping
 *   ribbed roof, the dark curved glass wall across the north).
 * - Assignment note checked: the curved glass faces north (aerial); the
 *   east and west curves and the wings are stone, and the entrance glass
 *   faces south.
 * - Estimated: the glass wall's extent (about 25°..155° round the centre,
 *   from the aerial); storeys (~6.4 m courtroom floors, 11 levels);
 *   fin pitch and size; the slit window positions.
 * - Doubts: no ground photo of the north glass wall; the plaza and steps
 *   before the entrance are simplified to a stepped block.
 *
 * Colours: the stone reads warm pale pinkish beige (#d9cbbb in sun,
 * Voidxor); glass a mid grey-blue (window-2), slits and doors slate; roof
 * `roof`. Night: the curtain walls glow (window-2); the stone is not lit.
 */
import { Part } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, cap, panel, rect, save, walls, type XY } from './chi-aon-center'

const C: XY = [-1.5, -9.6], R = 46.8, XW = -44, XE = 41
const at = (deg: number): XY => {
  const t = deg * Math.PI / 180
  return [Math.min(XE, Math.max(XW, C[0] + R * Math.cos(t))), C[1] + R * Math.sin(t)]
}

function build() {
  const stone = new Part(), roof = new Part(), win = new Part(), glass = new Part(), trim = new Part(), door = new Part()
  const STEP = 4
  const YS = -7 // the slot's back wall
  // where the slot's diagonal sides meet the outline
  const meet = (p: XY, d: XY): XY => {
    let q = p
    for (let t = 0; t < 80; t += 0.1) {
      q = [p[0] + d[0] * t, p[1] + d[1] * t]
      if (Math.hypot(q[0] - C[0], q[1] - C[1]) > R) break
    }
    return q
  }
  const dW: XY = [-0.766, -0.642], dE: XY = [0.745, -0.667]
  const sw = meet([-11, -30], dW), se = meet([7, -30], dE)
  const thW = Math.atan2(sw[1] - C[1], sw[0] - C[0]) * 180 / Math.PI + 360 // ~228°
  const thE = Math.atan2(se[1] - C[1], se[0] - C[0]) * 180 / Math.PI // ~-48°
  const thY = (side: number) => { const a = Math.asin((YS - C[1]) / R) * 180 / Math.PI; return side > 0 ? a : 180 - a } // where y = YS

  // ----- the north body: walls round the arc to 80.5, roof falling to the slot
  const arc: XY[] = []
  for (let th = thY(1); th <= thY(-1) + 1e-6; th += STEP) arc.push(at(th))
  arc[arc.length - 1] = at(thY(-1))
  arc[0] = [XE, YS]; arc[arc.length - 1] = [XW, YS]
  const O: XY = [-2, YS], RIM = 80.5, ROOF = 79, LOW = 72
  for (let i = 0; i < arc.length - 1; i++) {
    const a = arc[i], b = arc[i + 1]
    stone.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], RIM], [a[0], a[1], RIM])
    // parapet: inner face and top, then the sloping roof to the slot
    const ia: XY = [a[0] + (O[0] - a[0]) * 0.03, a[1] + (O[1] - a[1]) * 0.03], ib: XY = [b[0] + (O[0] - b[0]) * 0.03, b[1] + (O[1] - b[1]) * 0.03]
    stone.quad([a[0], a[1], RIM], [b[0], b[1], RIM], [ib[0], ib[1], RIM], [ia[0], ia[1], RIM])
    stone.quad([ib[0], ib[1], RIM], [ib[0], ib[1], ROOF], [ia[0], ia[1], ROOF], [ia[0], ia[1], RIM])
    roof.tri([O[0], O[1], LOW], [ia[0], ia[1], ROOF], [ib[0], ib[1], ROOF])
  }
  // the body's south face along y = YS: down to the wings' roofs, and to the ground in the slot
  const iw: XY = [arc[arc.length - 1][0] + (O[0] - XW) * 0.03, YS], ie: XY = [XE + (O[0] - XE) * 0.03, YS]
  stone.quad([XW, YS, 60], [O[0], YS, 60], [O[0], YS, LOW], [iw[0], YS, ROOF])
  stone.quad([O[0], YS, 60], [XE, YS, 60], [ie[0], YS, ROOF], [O[0], YS, LOW])
  stone.quad([-11, YS, 0], [7, YS, 0], [7, YS, 60], [-11, YS, 60])

  // ----- the wings, 68 high, and their comb of fins
  const WING = 68
  const wingW: XY[] = [[XW, YS]]
  for (let th = Math.ceil(thY(-1) / STEP) * STEP; th < thW; th += STEP) wingW.push(at(th))
  wingW.push(sw, [-11, -30], [-11, YS])
  const wingE: XY[] = [[7, -30], se]
  for (let th = Math.ceil(thE / STEP) * STEP; th < thY(1); th += STEP) wingE.push(at(th))
  wingE.push([XE, YS], [7, YS])
  for (const r of [wingW, wingE]) { walls(stone, r, 0, WING); cap(roof, r, WING) }
  // comb: radial stone fins along the wings' outer curve, on the roof's edge
  for (const [t0, t1] of [[thY(-1) + 6, thW - 1], [thE + 1, thY(1) - 6]]) {
    for (let th = t0; th <= t1; th += 2.6) {
      const p = at(th), q = at(th + 1.1)
      const n: XY = [(p[0] - C[0]) / R, (p[1] - C[1]) / R]
      const fin: XY[] = [[p[0] + n[0] * 0.4, p[1] + n[1] * 0.4], [q[0] + n[0] * 0.4, q[1] + n[1] * 0.4], [q[0] - n[0] * 3, q[1] - n[1] * 3], [p[0] - n[0] * 3, p[1] - n[1] * 3]]
      block(stone, stone, fin, WING - 0.2, WING + 5.5, 0.15)
    }
  }

  // ----- the slot: pylons, glass bay, entrance pavilion, steps
  for (const x of [-11, 5]) block(stone, stone, rect(x, -9, x + 2, YS), 0, 72, 0.3)
  // the glass bay: back wall and the slot's side walls, glazed from the pavilion's roof up to 62
  const bay: [XY, XY][] = [[[-9, YS - 0.02], [5, YS - 0.02]], [[7, YS], [7, -30]], [[-11, -30], [-11, YS]]]
  void bay
  panel(glass, [-9, YS], [5, YS], 0, 14, 22, 62.5, 0.06)
  for (const z of [33, 46, 59]) panel(trim, [-9, YS], [5, YS], 0, 14, z, z + 0.7, 0.1)
  // the slot's side walls are the wings' inner faces: glass on them too
  panel(glass, [7, -9], [7, -30], 0.4, 20.6, 22, 62.5, 0.06)
  for (const z of [33, 46, 59]) {
    panel(trim, [7, -9], [7, -30], 0.4, 20.6, z, z + 0.7, 0.1)
    panel(trim, [-11, -30], [-11, -9], 0.4, 20.6, z, z + 0.7, 0.1)
  }
  panel(glass, [-11, -30], [-11, -9], 0.4, 20.6, 22, 62.5, 0.06)
  // the entrance pavilion: a shallow drum filling the slot's foot, 22 high, glass roof rising back
  const cv: XY[] = Array.from({ length: 9 }, (_, k) => { const t = Math.PI + (k / 8) * Math.PI; return [-2 + 9 * Math.cos(t), -24 + 7 * Math.sin(t)] as XY })
  const pav: XY[] = [[-11, YS], ...cv, [7, YS]]
  walls(stone, pav, 0, 22)
  cap(roof, pav, 22)
  block(trim, glass, rect(-9, -20, 5, YS), 22, 24.5, 0.6)
  // the pavilion's front: three tall grilled windows, doors under them, the lettered band
  for (const k of [1, 3, 4, 6]) {
    const a = cv[k], b = cv[k + 1]
    panel(win, a, b, 0.3, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.3, 12, 18.5, 0.06)
    panel(door, a, b, 0.5, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.5, 8.5, 11.5, 0.06)
  }
  // the plaza steps before it
  for (let i = 0; i < 6; i++) block(stone, roof, rect(-12 + i * 0.3, -33 - (6 - i) * 0.8, 8 - i * 0.3, -29), 0, 6.1 + 0.45 * i, 0.05)

  // ----- facades: the north curtain wall, slit windows in the stone
  for (let i = 0; i < arc.length - 1; i++) {
    const a = arc[i], b = arc[i + 1]
    const th = Math.atan2((a[1] + b[1]) / 2 - C[1], (a[0] + b[0]) / 2 - C[0]) * 180 / Math.PI
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (th > 25 && th < 155) {
      panel(glass, a, b, 0, L, 9, 76, 0.06)
      for (const z of [21.8, 34.6, 47.4, 60.2]) panel(trim, a, b, 0, L, z, z + 0.6, 0.1)
      if (i % 2 === 0) panel(trim, a, b, 0, 0.35, 9, 76, 0.1)
    } else if (i % 3 === 1 && Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) > 1) {
      for (let z = 14; z < 70; z += 12.8) panel(win, a, b, L / 2 - 0.5, L / 2 + 0.5, z, z + 9.6, 0.06)
    }
  }
  for (const r of [wingW, wingE]) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 2.5 || L > 12 || i % 3 !== 1) continue // outer curve segments only
      for (let z = 8; z < 62; z += 12.8) panel(win, a, b, L / 2 - 0.5, L / 2 + 0.5, z, z + 9.6, 0.06)
    }
    // the slot-facing diagonals: a column of slits near the outer end
    const k = r === wingW ? r.length - 3 : 0
    const a = r[k], b = r[k + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let z = 8; z < 62; z += 12.8) panel(win, a, b, r === wingW ? 3 : L - 4, r === wingW ? 4 : L - 3, z, z + 9.6, 0.06)
  }

  return [
    { part: stone, material: finish('kcwc-stone', 0xe2d6c8) },
    { part: roof, material: PALETTE.roof },
    { part: win, material: PALETTE.window },
    { part: glass, material: windowVariant(2, 0x8ea5b8) },
    { part: trim, material: PALETTE.trim },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) await save('kc-whittaker-courthouse', 'Charles Evans Whittaker U.S. Courthouse', [39.1039224, -94.5777719], 0, build(), 6500)
