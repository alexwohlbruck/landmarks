/**
 * Mission San Francisco de la Espada, the chapel (c. 1756) and the convento
 * range with its portales, San Antonio Missions National Historical Park
 * (UNESCO World Heritage), Texas. A small flat-roofed rubble-limestone
 * (mottled grey-buff) chapel facing EAST, its front rising in stepped shoulders to the
 * espadaña: a stone tier with two bell arches and an upper brick tier with
 * one, finials and a cross; the "broken arch" doorway, whose arch stones do
 * not meet at the top. Behind it to the south-west runs the low convento
 * range with its arcade of brick-edged arches facing east.
 * The bell wall is a thin pierced wall (see-through openings); its helper,
 * `piercedWall`, is exported here for sat-mission-san-juan.ts (this file's
 * own build runs only under import.meta.main), so merge this file first.
 * Original procedural geometry, CC0-1.0.   bun generators/sat-mission-espada.ts
 *
 * OSM maps the chapel and the convento as one building (way/120248309), so
 * the model draws both. OSM's node/356740636 (amenity=place_of_worship) sits
 * in it.
 *
 * Frame: bearing 5.1 (the outline is square to 0.1 m in it). x east, y
 * north, z up, metres. Drawn about the lidar grid's centre (-98.45122,
 * 29.31807), shifted by (1.78, -0.47) so the origin is the outline's area
 * centroid (-98.451238, 29.318076).
 *
 * Ground: lidar ground 1.6-2.4 over its ground_min; heights below are lidar
 * less 1.8. Elevation 0.
 *
 * Evidence
 * - OSM way/120248309 (building): the chapel x -9.0..11.8, y 13.8..20.5 (and
 *   a small room on its north side to y 22.6); the convento range x
 *   -8.9..1.3 from y -23.4, with rooms east to x 8.9 at its south end.
 * - USGS 3DEP lidar USGS_LPC_TX_Central_B2_2017_LAS_2019 (2017), 0.5 m grid
 *   (~/landmarks-scratch/satx/work/sat-mission-espada/lidar.json), less 1.8:
 *   the chapel's roof 4.8-5.2; the espadaña across the east end, x
 *   11.2..12.2, its top read at 9.4 (thin; the photo gives more); the
 *   convento 3.3-4.0.
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Mission Espada in San Antonio, Texas.jpg" (Michaelluckey, CC BY 4.0):
 *     the east front square on, scaled from the door at 65 px/m: the front
 *     7.9 m wide, its shoulders to 6.4, the lower tier 4.75 m wide to 8.6,
 *     the brick upper tier 2.7 m wide to 10.6, the cross to 12.1; the broken
 *     arch round the door; a small grilled window; the portales to the left;
 *   "Mission San Francisco de la Espada Including Portales at Sunrise.jpg"
 *     (Carlos Noriega, CC BY-SA 4.0): the same front and the arcade.
 *   Heights are the photo's, raised by the lidar: tiers to 9.0 and 11.0.
 *
 * Estimated: the chapel's sides and west end, the convento's rooms behind
 * the arcade, drawn as a plain low range.
 *
 * Night: the front floodlit softly.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { prism, bandTris, inside, report, writeGlb, type XY } from './sf-de-young'
import { shift } from './sf-opera-house'
import { onWall, rectPts, roundPts, block, pyramid, cross3 } from './sat-san-fernando-cathedral'

// ---------------------------------------------------------------------------
// Shared helpers (also used by sat-mission-san-juan.ts): a pierced bell wall

function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const n = cross(sub(b, a), sub(c, a))
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
/**
 * A slab between x0 and x1 (its faces look along -x and +x) whose outline and
 * holes are rings of (y, z) points. The holes are open: you see through them.
 */
export function piercedWall(p: Part, x0: number, x1: number, outline: XY[], holes: XY[][] = []) {
  const rings = [outline, ...holes]
  const inPoly = (q: XY) => inside(q, outline) && !holes.some((h) => inside(q, h))
  for (const [a, b, c] of bandTris(rings)) {
    const ar = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    const A1: V3 = [x1, a[0], a[1]], B1: V3 = [x1, b[0], b[1]], C1: V3 = [x1, c[0], c[1]]
    const A0: V3 = [x0, a[0], a[1]], B0: V3 = [x0, b[0], b[1]], C0: V3 = [x0, c[0], c[1]]
    if (ar > 0) { p.tri(A1, B1, C1); p.tri(A0, C0, B0) } else { p.tri(A1, C1, B1); p.tri(A0, B0, C0) }
  }
  for (const r of rings) {
    for (let i = 0; i < r.length; i++) {
      const u = r[i], v = r[(i + 1) % r.length]
      const dy = v[0] - u[0], dz = v[1] - u[1], l = Math.hypot(dy, dz) || 1
      let n: XY = [dz / l, -dy / l]
      const m: XY = [(u[0] + v[0]) / 2 + n[0] * 0.01, (u[1] + v[1]) / 2 + n[1] * 0.01]
      if (inPoly(m)) n = [-n[0], -n[1]]
      qf(p, [x0, u[0], u[1]], [x1, u[0], u[1]], [x1, v[0], v[1]], [x0, v[0], v[1]], [0, n[0], n[1]])
    }
  }
}
/** A round-headed opening ring, `w` wide centred at y, from z0 to its crown zt. */
export function archRing(y: number, w: number, z0: number, zt: number, seg = 8): XY[] {
  const r = w / 2, zs = zt - r, pts: XY[] = [[y - r, z0], [y + r, z0]]
  for (let i = 1; i < seg; i++) { const a = (Math.PI * i) / seg; pts.push([y + r * Math.cos(a), zs + r * Math.sin(a)]) }
  pts.splice(2, 0, [y + r, zs])
  pts.push([y - r, zs])
  return pts
}
/** Mirror a right-half profile (bottom to top, ending on the centre line) into a closed outline about y = c. */
export function mirrorOutline(half: XY[], c: number): XY[] {
  const right = half.map(([y, z]) => [c + y, z] as XY)
  const left = [...half].reverse().slice(1).map(([y, z]) => [c - y, z] as XY)
  return [...right, ...left]
}

// ---------------------------------------------------------------------------
if (import.meta.main) {
  const stone = new Part(), brick = new Part(), trim = new Part(), roof = new Part(), wood = new Part(), dark = new Part()
  const E: XY = [1, 0]
  const sE = (y: number) => y

  // the chapel and its small north room
  block(stone, -9.0, 11.2, 13.8, 20.5, 0, 5.0, 0.12, roof)
  block(stone, -3.8, -0.1, 20.5, 22.6, 0, 4.2, 0.1, roof)
  // the convento range (the OSM outline south of the chapel), low and flat-roofed
  const CONV: XY[] = [[-8.9, -23.4], [-2.8, -23.4], [-2.8, -20.7], [2.4, -20.7], [2.4, -15.9], [8.9, -15.9], [8.9, -9.5], [1.3, -9.5], [1.3, 13.8], [-9.0, 13.8]]
  prism(stone, CONV, 0, 3.7, roof, 0.1)
  // the portales: brick-edged arches along its east face
  for (let k = 0; k < 7; k++) {
    const y = -7.4 + k * 3.0
    onWall(brick, [1.3, 0], E, roundPts(sE(y), 2.5, 0, 3.0, 8), 0.03)
    onWall(dark, [1.3, 0], E, roundPts(sE(y), 2.0, 0, 2.7, 8), 0.06)
  }

  // the east front: a 1 m wall, its stepped and scrolled outline rising to
  // the espadaña; the stone lower stage with two bell openings, the brick
  // upper stage with one, all cut through; heights from the photo (65 px/m)
  // raised 4% to the lidar
  {
    const X0 = 11.2, X1 = 12.2, YC = 17.15
    block(stone, X0, X1, YC - 3.95, YC + 3.95, 0, 4.6, 0, null)
    const lower: XY[] = [
      [3.95, 4.6], [3.95, 6.65], [3.7, 6.75], [3.5, 6.95], [3.15, 7.0], [2.9, 7.25], [2.75, 7.4], [2.45, 7.45],
      [2.45, 8.95], [2.6, 8.95], [2.6, 9.25], [0, 9.25],
    ]
    piercedWall(stone, X0, X1, mirrorOutline(lower, YC), [archRing(YC - 1.0, 1.25, 5.9, 8.2, 6), archRing(YC + 1.0, 1.25, 5.9, 8.2, 6)])
    const upper: XY[] = [[1.35, 9.25], [1.35, 11.1], [0, 11.1]]
    piercedWall(brick, X0 + 0.1, X1 - 0.1, mirrorOutline(upper, YC), [archRing(YC, 1.1, 9.45, 10.85, 6)])
    for (const s of [-1, 1]) {
      // finials on the lower stage's corners and the upper stage's
      block(stone, X0 + 0.15, X1 - 0.15, YC + s * 2.15 - 0.3, YC + s * 2.15 + 0.3, 9.25, 9.8, 0.05)
      pyramid(stone, X0 + 0.15, X1 - 0.15, YC + s * 2.15 - 0.3, YC + s * 2.15 + 0.3, 9.8, 10.6)
      block(brick, X0 + 0.2, X1 - 0.2, YC + s * 1.0 - 0.3, YC + s * 1.0 + 0.3, 11.1, 11.5, 0.04)
    }
    cross3(dark, (X0 + X1) / 2, YC, 11.1, 1.5, 0.14)
    // a bell in each opening, seen through
    for (const [d, zt] of [[-0.95, 8.0], [0.95, 8.0], [0, 10.75]]) block(dark, X0 + 0.25, X1 - 0.25, YC + d - 0.25, YC + d + 0.25, zt - 1.2, zt - 0.6, 0.05)
    onWall(dark, [X1, 0], E, rectPts(sE(YC) - 0.4, sE(YC) + 0.4, 4.2, 5.3), 0.04)
    // the broken-arch doorway: jambs and two arc pieces that stop short of the top
    onWall(trim, [X1, 0], E, rectPts(sE(YC) - 1.5, sE(YC) - 1.0, 0, 2.7), 0.06)
    onWall(trim, [X1, 0], E, rectPts(sE(YC) + 1.0, sE(YC) + 1.5, 0, 2.7), 0.06)
    for (const s of [-1, 1]) {
      const pts: XY[] = [], seg = 5, r0 = 1.0, r1 = 1.55, zc = 2.7
      for (let i = 0; i <= seg; i++) { const a = (Math.PI * 0.42 * i) / seg; pts.push([sE(YC) + s * r1 * Math.cos(a), zc + r1 * Math.sin(a)]) }
      for (let i = seg; i >= 0; i--) { const a = (Math.PI * 0.42 * i) / seg; pts.push([sE(YC) + s * r0 * Math.cos(a), zc + r0 * Math.sin(a)]) }
      onWall(trim, [X1, 0], E, s > 0 ? pts : pts.reverse(), 0.06)
    }
    onWall(wood, [X1, 0], E, roundPts(sE(YC), 2.0, 0, 3.5, 8), 0.04)
  }

  // ---------------------------------------------------------------------------
  const all = [stone, brick, trim, roof, wood, dark]
  shift(all, 1.78, -0.47)
  const lit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.05 : n[0] > 0.5 && p[0] > 12 ? 0.8 : 0.2)
  const parts = [
    { part: stone, material: { ...finish('espada-rubble-stone', 0xbdb199), floodlight: lit } },
    { part: brick, material: { ...finish('espada-brick', 0xb9806a), floodlight: lit } },
    { part: trim, material: { ...finish('espada-dressed-stone', 0xddd6c8), floodlight: lit } },
    { part: roof, material: { ...PALETTE.roof, color: 0xb3b2aa } },
    { part: wood, material: finish('espada-door', 0x6a5444) },
    { part: dark, material: finish('espada-bell-bronze', 0x56514b) },
  ]
  const glb = writeGlb('Mission Espada', parts, {
    license: 'CC0-1.0', bearing: 5.1, elevation: 0, anchor: [29.318076, -98.451238],
    frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
    replaces: ['way/120248309'],
  })
  console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
  const tris = report('Mission Espada', parts, glb, 5000)
  const out = new URL('../models/sat-mission-espada.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
}
