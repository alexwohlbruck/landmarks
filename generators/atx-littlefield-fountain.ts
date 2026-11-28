/**
 * Littlefield Fountain (1933, Pompeo Coppini), the head of the South Mall,
 * University of Texas at Austin — procedural, CC0-1.0, no textures.
 *   bun generators/atx-littlefield-fountain.ts
 *
 * A small famous sculpture group, so it spends more of its budget on bold
 * figure masses (STYLE.md, "Small, famous objects"); no water is modelled.
 *
 * Map frame: x east, y north, z up, metres; bearing 4.3 (the campus grid,
 * the edges of the fountain's upper pool), so +y looks up the mall to the
 * Main Building. Anchor = area centroid of OSM way/201514442 (the fountain's
 * water, natural=water), -97.739618, 30.283904. z = 0 is the lowest ground
 * at the fountain, the plaza at the south rim; the ground rises about
 * 1.1 m to the sculpture and 2.7 m to the terrace behind the screen wall.
 *
 * Identity: the bronze prow of a ship driving south out of the upper pool,
 * the winged Columbia standing on its deck with both arms raised, a soldier
 * and a sailor at her sides, and three sea horses with their tritons
 * leaping out in front; the tiered granite basin with its cascade walls
 * stepping down to the south; and the limestone screen wall with its two
 * pylons behind.
 *
 * Numbers (lidar = USGS 3DEP USGS_LPC_TX_Central_B1_2017_LAS_2019, flown
 * 2017, 0.5 m grid read in this frame, heights above the south plaza at
 * 0.7 m over the box's ground_min; the water returns nothing):
 *  - the basin: the OSM water outline; the upper pool's side curbs at
 *    x -5.2 and 5.7, top 1.5 (lidar 2.2); the three tiers' plan and
 *    heights (0.35, 0.85, 1.5, their tops rising with the plaza to the
 *    north: 0.9 at the outer rim's ends, 2.3 by the wall) estimated from "p7" (straight on from the
 *    south: the tier walls are 0.57 and 0.38 of the outer rim's width) and
 *    "p11";
 *  - the screen wall at y 18.3, top 4.2 (lidar 4.9), 12.6 m between its
 *    pylons (lidar and "p7"); the pylons 1.6 m square, their top 5.0
 *    (estimated from "p7" and "p9");
 *  - the sculpture: Columbia's raised hands at 7.0 (lidar 7.6 over the
 *    group, the highest return); the ship 6.5 m long, 2.9 m beam, its deck
 *    3.5 (lidar 4.0 to 4.3 over the deck); the horses' heads at 4.1 (lidar
 *    3.3 to 4.3), all three within 6 m across: estimated from the lidar
 *    and the photos; the figures' poses simplified to bold masses;
 *  - colours from "p9" and "p7", pulled to the palette's lightness: the
 *    bronze, brown with a green-grey patina, #6e6658 (kept dark, it is the
 *    landmark); the granite basin #cdb9ab; the limestone the palette's
 *    stone.
 *
 * Sources (all EVIDENCE):
 *  p7   "University of Texas at Austin August 2019 30 (Littlefield Fountain
 *       and Main Building).jpg", Michael Barera, CC BY-SA 4.0
 *       https://commons.wikimedia.org/wiki/File:University_of_Texas_at_Austin_August_2019_30_(Littlefield_Fountain_and_Main_Building).jpg
 *  p9   "Littlefield Fountain, a monument by Italian-born sculptor Pompeo
 *       Coppini ..." (from the south-west), Carol M. Highsmith, public domain
 *       https://commons.wikimedia.org/wiki/File:Littlefield_Fountain%2C_a_monument_by_Italian-born_sculptor_Pompeo_Coppini_located_on_the_main_campus_of_The_University_of_Texas_at_Austin_in_Austin%2C_Texas_LCCN2014632361.tif
 *  p11  "Littlefield Fountain, a monument by Italian-born sculptor Pompeo
 *       Coppini ..." (the tiers from the south-west), Carol M. Highsmith,
 *       public domain
 *       https://commons.wikimedia.org/wiki/File:Littlefield_Fountain%2C_a_monument_by_Italian-born_sculptor_Pompeo_Coppini_located_on_the_main_campus_of_The_University_of_Texas_at_Austin_in_Austin%2C_Texas_LCCN2014632058.tif
 *  p2   "Littlefield fountain UT.JPG", Alisonnitsche, CC0
 *       https://commons.wikimedia.org/wiki/File:Littlefield_fountain_UT.JPG
 *  p6   "Littlefield Fountain at the University of Texas at Austin
 *       LCCN2014632050", Carol M. Highsmith, public domain (the sea horses)
 *       https://commons.wikimedia.org/wiki/File:Littlefield_Fountain_at_the_University_of_Texas_at_Austin_LCCN2014632050.tif
 * Also OSM (ODbL) and the lidar above. No look-only sources, no commercial
 * imagery.
 *
 * Replaces nothing: OSM maps the fountain only as water (way/201514442,
 * natural=water), no building.
 *
 * Doubts: the tier plan is estimated from oblique photos; the screen
 * wall's balustraded wings and the urns either side are left to the map's
 * plaza (not modelled); no flagpoles stand at the fountain in any photo.
 * The figures are bold simplified masses, not portraits: the eagle at the
 * prow and the shield and oar are left out or simplified.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save, type XY } from './atl-flatiron-building'

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

/** A quad wound to face away from `inside`. */
function qOut(p: Part, a: V3, b: V3, c: V3, d: V3, inside: V3) {
  const n = cross(sub(b, a), sub(c, a)), m: V3 = [(a[0] + c[0]) / 2 - inside[0], (a[1] + c[1]) / 2 - inside[1], (a[2] + c[2]) / 2 - inside[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** A closed tube through `path`, each point with its half width and half height; capped at both ends. */
function tube(p: Part, path: { c: V3; w: number; h: number }[]) {
  const secs: V3[][] = path.map((q, i) => {
    const a = path[Math.max(0, i - 1)].c, b = path[Math.min(path.length - 1, i + 1)].c
    const t = norm(sub(b, a))
    let s = cross(t, [0, 0, 1])
    if (Math.hypot(...s) < 0.1) s = [1, 0, 0]
    s = norm(s)
    const u = norm(cross(s, t))
    const P = (ks: number, ku: number): V3 => [q.c[0] + s[0] * ks * q.w + u[0] * ku * q.h, q.c[1] + s[1] * ks * q.w + u[1] * ku * q.h, q.c[2] + s[2] * ks * q.w + u[2] * ku * q.h]
    return [P(-1, -1), P(1, -1), P(1, 1), P(-1, 1)]
  })
  for (let k = 0; k < secs.length - 1; k++) {
    const r0 = secs[k], r1 = secs[k + 1], mid: V3 = [(path[k].c[0] + path[k + 1].c[0]) / 2, (path[k].c[1] + path[k + 1].c[1]) / 2, (path[k].c[2] + path[k + 1].c[2]) / 2]
    for (let i = 0; i < 4; i++) qOut(p, r0[i], r0[(i + 1) % 4], r1[(i + 1) % 4], r1[i], mid)
  }
  for (const [k, o] of [[0, 1], [secs.length - 1, secs.length - 2]]) {
    const r = secs[k], inside = path[o].c
    qOut(p, r[0], r[1], r[2], r[3], inside)
  }
}

/** A thin flat plate over a polygon (both faces), for wings. */
function plate(p: Part, pts: V3[], th = 0.12) {
  const n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))
  const A = pts.map((q) => [q[0] + n[0] * th / 2, q[1] + n[1] * th / 2, q[2] + n[2] * th / 2] as V3)
  const B = pts.map((q) => [q[0] - n[0] * th / 2, q[1] - n[1] * th / 2, q[2] - n[2] * th / 2] as V3)
  for (let i = 1; i < pts.length - 1; i++) {
    p.tri(A[0], A[i], A[i + 1])
    p.tri(B[0], B[i + 1], B[i])
  }
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    p.quad(A[i], B[i], B[j], A[j])
    p.quad(A[j], B[j], B[i], A[i])
  }
}

/** A standing robed figure: a tapered eight-sided body and a head. */
function figure(p: Part, x: number, y: number, z0: number, h: number, r: number) {
  const ring = (rr: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [x + rr * Math.cos((i * Math.PI) / 4), y + rr * 0.8 * Math.sin((i * Math.PI) / 4), z])
  p.loft([ring(r * 1.15, z0), ring(r, z0 + h * 0.45), ring(r * 0.95, z0 + h * 0.8), ring(r * 0.45, z0 + h * 0.84)])
  p.cap(ring(r * 0.45, z0 + h * 0.84), true)
  const hr = r * 0.5, hz = z0 + h * 0.84
  const head = (rr: number, z: number): V3[] => Array.from({ length: 8 }, (_, i) => [x + rr * Math.cos((i * Math.PI) / 4), y + rr * Math.sin((i * Math.PI) / 4), z])
  p.loft([head(hr * 0.6, hz), head(hr, hz + h * 0.06), head(hr, hz + h * 0.12), head(hr * 0.5, z0 + h)])
  p.cap(head(hr * 0.5, z0 + h), true)
}

/**
 * A solid curb of width w along an open polyline, from z0 up to a top that
 * may follow the ground (`top(x, y)`), with flat-shaded sides and ends.
 */
function curb(p: Part, line: XY[], w: number, z0: number, top: (x: number, y: number) => number) {
  const n = line.length
  const nrm = line.map((q, i) => {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    return [dy / l, -dx / l] as XY
  })
  const L = line.map((q, i) => [q[0] - nrm[i][0] * w / 2, q[1] - nrm[i][1] * w / 2] as XY)
  const R = line.map((q, i) => [q[0] + nrm[i][0] * w / 2, q[1] + nrm[i][1] * w / 2] as XY)
  const T = line.map(([x, y]) => top(x, y))
  for (let i = 0; i < n - 1; i++) {
    const c: V3 = [(line[i][0] + line[i + 1][0]) / 2, (line[i][1] + line[i + 1][1]) / 2, (z0 + T[i]) / 2]
    const lo = (q: XY): V3 => [q[0], q[1], z0], hi = (q: XY, k: number): V3 => [q[0], q[1], T[k]]
    qOut(p, lo(L[i]), lo(L[i + 1]), hi(L[i + 1], i + 1), hi(L[i], i), c)
    qOut(p, lo(R[i]), lo(R[i + 1]), hi(R[i + 1], i + 1), hi(R[i], i), c)
    qOut(p, hi(L[i], i), hi(L[i + 1], i + 1), hi(R[i + 1], i + 1), hi(R[i], i), [c[0], c[1], z0 - 10])
  }
  for (const [k, o] of [[0, 1], [n - 1, n - 2]]) qOut(p, [L[k][0], L[k][1], z0], [R[k][0], R[k][1], z0], [R[k][0], R[k][1], T[k]], [L[k][0], L[k][1], T[k]], [line[o][0], line[o][1], z0])
}

const arc = (c: XY, a: number, b: number, t0: number, t1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = ((t0 + ((t1 - t0) * i) / n) * Math.PI) / 180
    return [c[0] + a * Math.cos(t), c[1] + b * Math.sin(t)] as XY
  })

if (import.meta.main) {
  const bronze = new Part(), stone = new Part(), granite = new Part()
  const CX = 0.25 // the axis of the upper pool and the ship

  // ── the basin: the outer rim along the OSM water edge, two cascade tiers, the upper pool's curbs ──
  const rim: XY[] = [[5.61, 4.57], [7.15, 5.12], [8.54, 4.75], [9.68, 3.62], [10.26, 2.01], [11.96, 0.9], [13.52, -1.73], [14.34, -4.65], [13.28, -7.2], [12.1, -8.99], [9.83, -10.91], [6.43, -12.5], [3.0, -13.34], [-1.35, -13.63], [-4.7, -12.98], [-8.09, -11.92], [-11.25, -10.12], [-13.38, -7.32], [-14.03, -3.91], [-13.12, -0.5], [-11.45, 1.8], [-9.54, 3.48], [-8.72, 5.09], [-7.0, 5.86], [-5.04, 5.5]]
  // the tops follow the plaza where it rises to the north (lidar: the outer rim's ends 0.9, the upper pool's curbs 1.5 at y 10 and 2.3 by the wall)
  const up = (base: number, y0: number, k: number) => (x: number, y: number) => base + Math.max(0, y - y0) * k
  curb(granite, rim, 1.1, 0, up(0.35, -1, 0.11))
  curb(granite, [[CX + 8, 4.2], ...arc([CX, 1.8], 8, 6.6, 0, -180, 14), [CX - 8, 4.2]], 0.9, 0, up(0.85, 1.8, 0.08))
  curb(granite, [[CX + 5.4, 18.2], [CX + 5.4, 11], ...arc([CX, 4.6], 5.4, 5.0, 0, -180, 12), [CX - 5.4, 11], [CX - 5.4, 18.2]], 0.8, 0, up(1.5, 10, 0.11))

  // ── the screen wall and its two pylons ──
  box(stone, CX - 6.3, CX + 6.3, 18.2, 19.0, 0, 4.2, stone, 0.15)
  box(stone, CX - 6.6, CX + 6.6, 18.1, 19.1, 3.95, 4.3, stone, 0.1)
  for (const s of [-1, 1]) {
    box(stone, CX + s * 7.1 - 0.8, CX + s * 7.1 + 0.8, 17.9, 19.5, 0, 4.7, stone, 0.15)
    box(stone, CX + s * 7.1 - 0.95, CX + s * 7.1 + 0.95, 17.75, 19.65, 4.6, 5.0, stone, 0.12)
  }

  // ── the ship: a granite plinth in the pool and the bronze hull, prow to the south ──
  box(granite, CX - 1.5, CX + 1.5, 12.6, 17.6, 0, 2.1, granite, 0.1) // to the pool's water line by the wall (the map's terrain bridges the pool)
  {
    const secs: [number, number, number, number][] = [[17.6, 1.35, 1.5, 3.4], [16.2, 1.45, 1.5, 3.5], [14.4, 1.4, 1.5, 3.5], [12.8, 1.05, 1.6, 3.6], [11.9, 0.55, 1.9, 3.8], [11.1, 0.08, 2.5, 4.2]]
    const ring = ([y, hw, zb, zt]: [number, number, number, number]): V3[] => {
      const zm = zb + (zt - zb) * 0.45
      return [[CX - hw * 0.55, y, zb], [CX + hw * 0.55, y, zb], [CX + hw, y, zm], [CX + hw, y, zt], [CX - hw, y, zt], [CX - hw, y, zm]]
    }
    for (let k = 0; k < secs.length - 1; k++) {
      const a = ring(secs[k]), b = ring(secs[k + 1]), mid: V3 = [CX, (secs[k][0] + secs[k + 1][0]) / 2, 2.5]
      for (let i = 0; i < 6; i++) qOut(bronze, a[i], a[(i + 1) % 6], b[(i + 1) % 6], b[i], mid)
    }
    const st = ring(secs[0])
    for (let i = 1; i < 5; i++) {
      const n = cross(sub(st[i], st[0]), sub(st[i + 1], st[0]))
      if (n[1] > 0) bronze.tri(st[0], st[i], st[i + 1])
      else bronze.tri(st[0], st[i + 1], st[i])
    }
    // the scroll at the stern
    tube(bronze, [{ c: [CX, 17.4, 3.4], w: 0.9, h: 0.35 }, { c: [CX, 17.8, 4.0], w: 0.9, h: 0.4 }, { c: [CX, 17.5, 4.5], w: 0.9, h: 0.3 }])
  }

  // ── Columbia, winged, both arms raised; the soldier and the sailor at her sides ──
  {
    const Y = 14.6, Z = 3.5
    figure(bronze, CX, Y, Z, 2.55, 0.42)
    // arms: from the shoulders up and out to the raised hands (torch and wreath)
    tube(bronze, [{ c: [CX - 0.3, Y, Z + 2.0], w: 0.1, h: 0.1 }, { c: [CX - 0.55, Y - 0.1, Z + 2.75], w: 0.09, h: 0.09 }, { c: [CX - 0.62, Y - 0.15, Z + 3.35], w: 0.13, h: 0.13 }])
    tube(bronze, [{ c: [CX + 0.3, Y, Z + 2.0], w: 0.1, h: 0.1 }, { c: [CX + 0.6, Y - 0.1, Z + 2.7], w: 0.09, h: 0.09 }, { c: [CX + 0.7, Y - 0.15, Z + 3.3], w: 0.15, h: 0.15 }])
    // the wings, spread back and out from the shoulders
    for (const s of [-1, 1]) plate(bronze, [[CX + s * 0.2, Y + 0.3, Z + 2.15], [CX + s * 1.3, Y + 1.0, Z + 2.75], [CX + s * 1.45, Y + 1.2, Z + 2.35], [CX + s * 0.95, Y + 1.15, Z + 1.2], [CX + s * 0.3, Y + 0.5, Z + 1.3]], 0.16)
    figure(bronze, CX - 1.0, 16.4, Z, 1.9, 0.3) // the soldier
    figure(bronze, CX + 1.0, 16.4, Z, 1.9, 0.3) // the sailor
    tube(bronze, [{ c: [CX - 1.45, 16.1, Z - 0.6], w: 0.05, h: 0.05 }, { c: [CX - 1.35, 16.2, Z + 2.3], w: 0.05, h: 0.05 }]) // his oar
  }

  // ── three sea horses with their tritons, leaping south out of the lower pool ──
  for (const [x, yh, yaw] of [[CX - 2.2, 8.4, -0.35], [CX, 7.4, 0], [CX + 2.2, 8.4, 0.35]] as [number, number, number][]) {
    // the published group is about life-and-a-half size: the horse drawn 1.25x its first guess, heads at 4.1 (lidar 3.3 to 4.3 plus the water's dropouts)
    const K = 1.25, P = (dy: number, z: number, dx = 0): V3 => [x + K * dx + 0.4 * yaw * dy * K, yh + K * dy, 0.5 + (z - 0.5) * 1.2]
    tube(bronze, [
      { c: P(4.0, 1.6, yaw * 1.2), w: 0.15, h: 0.1 }, // the fish tail's end
      { c: P(3.0, 1.3), w: 0.35, h: 0.275 },
      { c: P(2.0, 1.4), w: 0.525, h: 0.5 },
      { c: P(1.1, 2.1), w: 0.6, h: 0.688 },
      { c: P(0.55, 2.9), w: 0.375, h: 0.45 }, // the neck
      { c: P(0.15, 3.45), w: 0.3, h: 0.325 },
      { c: P(-0.45, 3.6), w: 0.225, h: 0.225 }, // the muzzle
    ])
    // the forelegs, flung forward
    for (const s of [-1, 1]) tube(bronze, [{ c: P(0.9, 1.9, s * 0.3), w: 0.138, h: 0.138 }, { c: P(0.1, 2.1, s * 0.32), w: 0.125, h: 0.125 }, { c: P(-0.6, 1.4, s * 0.34), w: 0.15, h: 0.15 }])
    // the triton astride, leaning back on the reins
    tube(bronze, [{ c: P(1.9, 1.6), w: 0.375, h: 0.275 }, { c: P(2.1, 2.5), w: 0.325, h: 0.25 }, { c: P(2.2, 2.95), w: 0.188, h: 0.188 }, { c: P(2.15, 3.25), w: 0.188, h: 0.188 }])
  }

  const flood = (p: V3, n: V3) => (n[1] < 0.3 ? 0.65 : 0.3)
  await save('atx-littlefield-fountain', 'Littlefield Fountain', [
    { part: bronze, material: { ...finish('littlefield-bronze', 0x6e6658), floodlight: flood } },
    { part: stone, material: PALETTE.stone },
    { part: granite, material: finish('littlefield-granite', 0xcdb9ab) },
  ], { bearing: 4.3, replaces: [] }, 6500)
}
