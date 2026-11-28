/**
 * Alte Nikolaikirche, Römerberg, Frankfurt am Main: the Gothic court
 * chapel and council church of the 13th-15th centuries on the south side of
 * the Römerberg, with its roof gallery (Dachgalerie, 1467) and the tower on
 * the north side of the choir; restored 1843-47 and after 1945. Original
 * procedural geometry, CC0-1.0.
 * bun generators/frankfurt-alte-nikolaikirche.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/27769415,
 * 50.1099787, 8.6823425. The nave's walls run at 75.3 degrees (OSM), so the
 * catalog bearing is -14.7: +x the choir (east), +y the Römerberg (north).
 *
 * Identity, in order: the pale rendered hall church picked out in bright
 * red sandstone (quoins, window frames, wall strips, the corbel frieze),
 * its very steep hipped slate roof with rows of little dormers behind the
 * red openwork roof gallery, the small crenellated corner turrets at the
 * gallery's corners; the slender square tower beside the choir, white and
 * red in stages, with a projecting gallery, a short top stage and the
 * tall green copper spire; three tall pointed windows and the pointed north
 * door on the Römerberg side.
 *
 * Evidence:
 *  - plan: OSM outline way/27769415 and the tower way/174637354 (height
 *    48 m), read in the turned frame: nave x -11.2..8.6, y -8.1..8.9; choir
 *    x 8.6..15.5, y -6.2..1.5 with its polygonal east end; tower y 1.5..7.0
 *    (OSM), but 5.9 m wide east-west (x 7.1..13.0) from the measured
 *    elevation and the north photo, where OSM draws it 4.4 m.
 *  - heights: the measured north elevation (Städtische Hochbauinspektion,
 *    "Aufmass Nordseite", public domain), 1:200 with a 10 m scale bar
 *    (36.3 px/m on the 2047 px copy; the nave's 19.2 m length checks
 *    against OSM's 19.5): gallery top 12.8, the tower's gallery 30.5,
 *    its top stage to 34.5, spire to 46.5;
 *    windows 3.4-9.2 plus their heads; the north door. The present spire
 *    and top stage (post-war, copper) are from the photos, scaled to OSM's
 *    48 m to the cross. The roof is the post-war one in the photos: ridge
 *    20.2 m and 11.5 m long (DXR's photo, 1.58 times the gallery height;
 *    the 1890s elevation draws it 22 m and 9 m).
 *  - colours from the daylight photos: the off-white render, the bright red
 *    sandstone pulled to the palette's lightness, the dark slate, the green
 *    copper spire.
 *  - night: walls floodlit; windows lit.
 *  - elevation 0. The ground rises about 1.3 m from the south-west corner
 *    to the north-east (Mapterhorn terrain, `bun tools/terrain.ts grid`):
 *    the plinth follows it and the north and west doors stand on it.
 *
 * Photos and drawings (Wikimedia Commons, all evidence):
 *  - Alte Nikolaikirche, Frankfurt, North view 20191013 1.jpg (DXR, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Alte_Nikolaikirche,_Frankfurt,_North_view_20191013_1.jpg
 *  - Frankfurt Am Main-Alte Nikolaikirche-Aufmass-Nordseite.jpg (Städtische
 *    Hochbauinspektion II, public domain)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_Am_Main-Alte_Nikolaikirche-Aufmass-Nordseite.jpg
 *  - Frankfurt am Main, Nikolaikirche -- 2015 -- 6731.jpg (Dietmar Rabich, CC BY-SA 4.0)
 *    https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_Nikolaikirche_--_2015_--_6731.jpg
 *  - Alte Nikolaikirche Frankfurt am Main 2018-09-21 01.jpg (Leonhard Lenz, CC0)
 *    https://commons.wikimedia.org/wiki/File:Alte_Nikolaikirche_Frankfurt_am_Main_2018-09-21_01.jpg
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the frieze's foliage, the tracery cusps, the statue niche, the
 * gargoyles.
 *
 * Doubts: the south side and the choir's east end are seen in no photo I
 * used; they mirror the north side and follow the OSM polygon. The choir's
 * roof height is estimated.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { boxF, cap, ccw, face, fac, floodWalls, gothicWindow, pane, pinnacle, spire, surround, walls, writeLods, inset, lathe, type Fac, type XY } from './frankfurt-roemer'

const ID = 'frankfurt-alte-nikolaikirche'

/** A crenellated parapet (or openwork gallery rail) on facade F, z0..z1, with `n` merlons. */
function crenels(p: Part, F: Fac, z0: number, z1: number, n: number, o0: number, o1: number) {
  boxF(p, F, 0, F.L, z0, z0 + (z1 - z0) * 0.55, o0, o1)
  const w = F.L / (2 * n - 1)
  for (let k = 0; k < n; k++) boxF(p, F, 2 * k * w, (2 * k + 1) * w, z0 + (z1 - z0) * 0.55, z1, o0, o1, false)
}

/**
 * The ground under the church, metres above its lowest point (the south-
 * west corner), a plane fitted to the map's terrain (Mapterhorn z15): it
 * rises about 1.3 m to the north-east, toward the Römerberg.
 */
const ground = (x: number, y: number) => Math.max(0, 0.047 * (x + 11) + 0.022 * (y + 8))

/** A red plinth along facade F, `h` above the ground, its top following the slope. */
function plinth(p: Part, F: Fac, h: number) {
  const P = F.P, n = 6, d = 0.12
  for (let k = 0; k < n; k++) {
    const s0 = (k * F.L) / n, s1 = ((k + 1) * F.L) / n
    const g0 = ground(P(s0, 0)[0], P(s0, 0)[1]) + h, g1 = ground(P(s1, 0)[0], P(s1, 0)[1]) + h
    face(p, [P(s0, 0, d), P(s1, 0, d), P(s1, g1, d), P(s0, g0, d)], F.N)
    face(p, [P(s0, g0, 0), P(s0, g0, d), P(s1, g1, d), P(s1, g1, 0)], [0, 0, 1])
  }
}

function build(DETAIL: boolean) {
  const render = new Part(), red = new Part(), slate = new Part(), win = new Part(), copper = new Part(), door = new Part()

  const EAVE = 12.0, GAL = 12.8, RIDGE = 20.2
  // ---- Nave ----------------------------------------------------------------------
  const nave: XY[] = [[-11.25, -8.15], [8.55, -8.1], [8.62, 8.06], [-10.7, 8.88]]
  walls(render, nave, 0, EAVE)
  const sides = [0, 1, 2, 3].map((k) => fac(nave[k], nave[(k + 1) % 4])) // S, E, N, W
  const [nS, , nN, nW] = sides
  for (const F of [nS, nN, nW]) {
    // plinth, red quoins at the corners, the frieze and the gallery
    plinth(red, F, 0.6)
    for (const s of [0, F.L - 0.9]) boxF(red, F, s, s + 0.9, 0.9, EAVE - 1.1, 0, 0.1, false)
    boxF(red, F, -0.15, F.L + 0.15, EAVE - 1.1, EAVE, 0, 0.35)
    if (DETAIL) {
      // the corbel frieze under the gallery
      const n = Math.round(F.L / 0.85)
      for (let k = 0; k < n; k++) {
        const s = (k + 0.5) * (F.L / n)
        boxF(red, F, s - 0.16, s + 0.16, EAVE - 1.75, EAVE - 1.1, 0, 0.28)
      }
      // the openwork gallery rail: a rail with tracery posts
      boxF(red, F, -0.2, F.L + 0.2, EAVE, EAVE + 0.18, 0.05, 0.45)
      boxF(red, F, -0.2, F.L + 0.2, GAL - 0.16, GAL, 0.05, 0.45)
      const m = Math.round(F.L / 0.7)
      for (let k = 0; k <= m; k++) { const s = (k * F.L) / m; boxF(red, F, s - 0.09, s + 0.09, EAVE + 0.18, GAL - 0.16, 0.12, 0.38) }
    } else boxF(red, F, -0.2, F.L + 0.2, EAVE, GAL, 0.05, 0.45)
  }
  // The long sides: three bays of tall pointed windows between red wall strips.
  for (const F of [nN, nS]) {
    const L = F.L
    for (const f of [0.17, 0.5, 0.83]) {
      const c = L * f
      gothicWindow(win, red, F, c, 0.95, 3.3, 8.6, 'pointed', DETAIL ? { lights: 2, w: 0.38, d: 0.18, sill: 0.25 } : { w: 0.38, d: 0.18, n: 4 })
    }
    for (const f of [0.335, 0.665]) boxF(red, F, L * f - 0.55, L * f + 0.55, 0.9, EAVE - 1.1, 0, 0.3, false)
  }
  // The north door under the middle window, in a red pointed frame.
  const gN = ground(nN.P(nN.L / 2, 0)[0], nN.P(nN.L / 2, 0)[1])
  pane(door, nN, nN.L / 2, 0.75, gN, gN + 2.2, 'pointed', 0.06, 6)
  surround(red, nN, nN.L / 2, 0.75, gN, gN + 2.2, 'pointed', 0.32, 0.22, 6)
  // The west front: two windows and a door.
  gothicWindow(win, red, nW, nW.L * 0.3, 0.8, 3.5, 8.4, 'pointed', DETAIL ? { lights: 2, w: 0.35, d: 0.18 } : { w: 0.35, d: 0.18, n: 4 })
  gothicWindow(win, red, nW, nW.L * 0.7, 0.8, 3.5, 8.4, 'pointed', DETAIL ? { lights: 2, w: 0.35, d: 0.18 } : { w: 0.35, d: 0.18, n: 4 })
  const gW = ground(nW.P(nW.L / 2, 0)[0], nW.P(nW.L / 2, 0)[1])
  pane(door, nW, nW.L / 2, 0.7, gW, gW + 2.1, 'pointed', 0.06, 6)
  surround(red, nW, nW.L / 2, 0.7, gW, gW + 2.1, 'pointed', 0.3, 0.2, 6)

  // The steep hipped roof inside the gallery, with dormers.
  {
    const r = inset(ccw(nave), 0.45)
    const [a, b, c, d] = r // SW, SE, NE, NW
    const mid = (p: XY, q: XY): XY => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    const W0 = mid(a, d), E0 = mid(b, c)
    const len = Math.hypot(E0[0] - W0[0], E0[1] - W0[1]), k = (len - 11.5) / 2 / len
    const R0: V3 = [W0[0] + (E0[0] - W0[0]) * k, W0[1] + (E0[1] - W0[1]) * k, RIDGE]
    const R1: V3 = [E0[0] - (E0[0] - W0[0]) * k, E0[1] - (E0[1] - W0[1]) * k, RIDGE]
    const z = EAVE + 0.2
    const v = (p: XY): V3 => [p[0], p[1], z]
    face(slate, [v(a), v(b), R1, R0], [0, -1, 0.9])
    face(slate, [v(c), v(d), R0, R1], [0, 1, 0.9])
    face(slate, [v(d), v(a), R0], [-1, 0, 0.5])
    face(slate, [v(b), v(c), R1], [1, 0, 0.5])
    cap(slate, r, z, false)
    // Dormers: three rows on the long sides, as in the elevation.
    const rows: [number, number[]][] = [[0.22, [0.2, 0.4, 0.6, 0.8]], [0.47, [0.28, 0.44, 0.56, 0.72]], [0.7, [0.38, 0.5, 0.62]]]
    for (const [side, E1, E2, sg] of [[0, a, b, -1], [1, c, d, 1]] as [number, XY, XY, number][]) {
      for (const [t, xs] of rows) for (const f of (DETAIL ? xs : xs.filter((_, i) => i % 2 === 0))) {
        // a point on the roof plane at height fraction t, along fraction f
        const base: XY = [E1[0] + (E2[0] - E1[0]) * f, E1[1] + (E2[1] - E1[1]) * f]
        const ridgeP: XY = [R0[0] + (R1[0] - R0[0]) * (side ? 1 - f : f), R0[1] + (R1[1] - R0[1]) * (side ? 1 - f : f)]
        const P: XY = [base[0] + (ridgeP[0] - base[0]) * t, base[1] + (ridgeP[1] - base[1]) * t]
        const zz = z + (RIDGE - z) * t
        const u: XY = [(E2[0] - E1[0]) / Math.hypot(E2[0] - E1[0], E2[1] - E1[1]), (E2[1] - E1[1]) / Math.hypot(E2[0] - E1[0], E2[1] - E1[1])]
        const n: XY = [-sg * u[1] * (side ? -1 : 1), sg * u[0] * (side ? -1 : 1)]
        const nn: XY = sg < 0 ? [0, -1] : [0, 1]
        void n
        const w = 0.42, h = 0.75
        const Fd = fac([P[0] - u[0] * w * (side ? 1 : -1) * -1, P[1]] as XY, [P[0] + u[0] * w * (side ? 1 : -1) * -1, P[1]] as XY)
        void Fd
        // front face, two cheeks and a little gabled cap
        const A: V3 = [P[0] - w, P[1], zz], Bv: V3 = [P[0] + w, P[1], zz]
        const At: V3 = [P[0] - w, P[1], zz + h], Bt: V3 = [P[0] + w, P[1], zz + h], T: V3 = [P[0], P[1], zz + h + 0.45]
        const back = (q: V3, dz: number): V3 => [q[0], q[1] - nn[1] * dz / 1.15, q[2] + dz * 0]
        face(slate, [A, Bv, Bt, T, At], [0, nn[1], 0])
        pane(win, fac(sg < 0 ? [P[0] - w, P[1]] : [P[0] + w, P[1]], sg < 0 ? [P[0] + w, P[1]] : [P[0] - w, P[1]]), w, 0.22, zz + 0.12, zz + 0.62, 'flat', 0.03)
        const D = 1.0
        const A2 = back(At, D), B2 = back(Bt, D), T2 = back(T, D)
        face(slate, [At, T, T2, A2], [-1, 0, 1])
        face(slate, [T, Bt, B2, T2], [1, 0, 1])
        face(slate, [A, At, A2], [-1, 0, 0])
        face(slate, [Bv, Bt, B2], [1, 0, 0])
      }
    }
  }
  // Corner turrets at the gallery's four corners: square, crenellated, with openwork.
  for (const [x, y] of nave) {
    const r: XY[] = [[x - 1.0, y - 1.0], [x + 1.0, y - 1.0], [x + 1.0, y + 1.0], [x - 1.0, y + 1.0]]
    if (x > 8 && y > 0) continue // the north-east corner meets the tower
    walls(red, r, EAVE - 1.6, 15.0)
    cap(red, r, EAVE - 1.6, false)
    cap(red, inset(r, 0.25), 14.6)
    for (let k = 0; k < 4; k++) {
      const F = fac(r[k], r[(k + 1) % 4])
      crenels(red, F, 15.0, 15.9, 3, -0.25, 0)
      if (DETAIL) pane(win, F, 1.0, 0.32, 13.1, 14.2, 'pointed', 0.03, 4)
    }
  }

  // ---- Choir ---------------------------------------------------------------------
  {
    const ch: XY[] = ccw([[8.55, -6.2], [12.0, -6.2], [14.4, -3.6], [14.7, -0.6], [12.9, 1.5], [8.55, 1.5]])
    const CE = 11.0
    walls(render, ch, 0, CE)
    for (let k = 0; k < ch.length; k++) {
      const F = fac(ch[k], ch[(k + 1) % ch.length])
      if (F.L < 2.5 || (ch[k][0] < 9 && ch[(k + 1) % ch.length][0] < 9)) continue
      if (ch[k][1] > 1 && ch[(k + 1) % ch.length][1] > 1) continue
      gothicWindow(win, red, F, F.L / 2, Math.min(0.75, F.L / 2 - 0.5), 3.5, 8.2, 'pointed', DETAIL ? { lights: 2, w: 0.32, d: 0.16 } : { w: 0.32, d: 0.16, n: 4 })
      boxF(red, F, -0.1, F.L + 0.1, CE - 0.8, CE, 0, 0.3)
      boxF(red, F, 0, 0.6, 0, CE - 0.8, 0, 0.45)
    }
    // half-hipped roof round the apse
    const top: V3 = [10.0, -2.35, 17.0], top2: V3 = [8.6, -2.35, 17.0]
    for (let k = 0; k < ch.length; k++) {
      const a = ch[k], b = ch[(k + 1) % ch.length]
      if (a[0] < 9 && b[0] < 9) continue
      const ex = b[0] - a[0], ey = b[1] - a[1]
      const T = a[0] < 9 || b[0] < 9 ? null : top
      if (T) face(slate, [[a[0], a[1], CE], [b[0], b[1], CE], T], [ey, -ex, 1.2 * Math.hypot(ex, ey)])
      else face(slate, [[a[0], a[1], CE], [b[0], b[1], CE], b[0] < 9 ? top2 : top, a[0] < 9 ? top2 : top], [ey, -ex, 1.2 * Math.hypot(ex, ey)])
    }
  }

  // ---- Tower -------------------------------------------------------------------------
  {
    const T: XY[] = [[7.1, 1.5], [12.97, 1.5], [12.97, 7.0], [7.1, 7.0]]
    const cx = 10.03, cy = 4.25
    walls(render, T, 0, 23.8)
    walls(red, T, 23.8, 29.6)
    const sidesT = [0, 1, 2, 3].map((k) => fac(T[k], T[(k + 1) % 4]))
    for (const F of sidesT) {
      // red quoins and string courses on the white lower stages
      for (const s of [0, F.L - 0.6]) boxF(red, F, s, s + 0.6, 0, 23.8, 0, 0.1, false)
      for (const z of [16.7, 23.8]) boxF(red, F, -0.1, F.L + 0.1, z - 0.4, z, 0, 0.25)
      // the lower stage's small lancet, then two framed lancets in the white
      // stage and two tall louvred ones in the red belfry
      pane(win, F, F.L / 2, 0.35, 12.8, 15.0, 'pointed', 0.04, 4)
      surround(red, F, F.L / 2, 0.35, 12.8, 15.0, 'pointed', 0.25, 0.14, 4)
      for (const s of [F.L * 0.3, F.L * 0.7]) {
        pane(win, F, s, 0.45, 17.6, 21.6, 'pointed', 0.05, 6)
        surround(red, F, s, 0.45, 17.6, 21.6, 'pointed', 0.32, 0.2, DETAIL ? 6 : 4, 0.2)
        pane(win, F, s, 0.45, 24.4, 27.6, 'pointed', 0.05, 6)
        surround(red, F, s, 0.45, 24.4, 27.6, 'pointed', 0.22, 0.2, DETAIL ? 6 : 4, 0.2)
      }
    }
    // the projecting gallery with its openwork parapet
    const G = inset(T, -0.55)
    walls(red, G, 29.0, 29.6); cap(red, G, 29.0, false)
    const Gf = [0, 1, 2, 3].map((k) => fac(G[k], G[(k + 1) % 4]))
    for (const F of Gf) {
      boxF(red, F, 0, F.L, 29.6, 29.8, -0.3, 0)
      boxF(red, F, 0, F.L, 30.35, 30.55, -0.3, 0)
      const m = DETAIL ? 7 : 3
      for (let k = 0; k <= m; k++) { const s = 0.12 + (k * (F.L - 0.24)) / m; boxF(red, F, s - 0.12, s + 0.12, 29.8, 30.35, -0.28, -0.02, false) }
    }
    cap(red, inset(T, 0), 29.6)
    // the short top stage: white with red frames and small windows, then the spire
    const T2 = inset(T, 0.3)
    walls(render, T2, 29.6, 34.3)
    for (let k = 0; k < 4; k++) {
      const F = fac(T2[k], T2[(k + 1) % 4])
      for (const s of [0, F.L - 0.45]) boxF(red, F, s, s + 0.45, 29.6, 34.3, 0, 0.08, false)
      for (const s of (DETAIL ? [0.25, 0.5, 0.75] : [0.5])) {
        pane(win, F, F.L * s, 0.22, 31.3, 32.6, 'round', 0.05, 4)
        if (DETAIL) surround(red, F, F.L * s, 0.22, 31.3, 32.6, 'round', 0.14, 0.08, 4)
      }
      boxF(red, F, -0.1, F.L + 0.1, 34.0, 34.5, 0, 0.25)
    }
    // the copper spire: octagonal, from the top stage's square
    // flared foot: a short band then the spire
    const foot = inset(T2, -0.15)
    walls(copper, foot, 34.5, 34.9); cap(copper, foot, 34.5, false)
    cap(copper, foot, 34.9)
    const R8 = 2.55
    const oct8 = (r: number) => Array.from({ length: 8 }, (_, k) => [cx + r * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), cy + r * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)] as XY)
    // a short flared foot, then the spire
    const o0 = oct8(R8), o1 = oct8(R8 * 0.86)
    for (let k = 0; k < 8; k++) {
      const a = o0[k], b = o0[(k + 1) % 8], c = o1[(k + 1) % 8], d = o1[k]
      face(copper, [[a[0], a[1], 34.9], [b[0], b[1], 34.9], [c[0], c[1], 36.0], [d[0], d[1], 36.0]], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 2.2])
    }
    spire(copper, o1, 36.0, [cx, cy, 46.6])
    if (DETAIL) {
      // crockets: small knobs up the spire's arrises
      for (let k = 0; k < 8; k++) for (let j = 1; j <= 5; j++) {
        const t = j / 6.2
        const [x, y] = o1[k]
        const px = cx + (x - cx) * (1 - t) * 1.04, py = cy + (y - cy) * (1 - t) * 1.04
        lathe(copper, px, py, [[0, 36.0 + t * 10.6 - 0.15], [0.16, 36.0 + t * 10.6], [0, 36.0 + t * 10.6 + 0.22]], 4)
      }
      pinnacle(red, T2[0][0] + 0.25, T2[0][1] + 0.25, 0.18, 34.5, 35.2, 36.2)
      pinnacle(red, T2[1][0] - 0.25, T2[1][1] + 0.25, 0.18, 34.5, 35.2, 36.2)
      pinnacle(red, T2[2][0] - 0.25, T2[2][1] - 0.25, 0.18, 34.5, 35.2, 36.2)
      pinnacle(red, T2[3][0] + 0.25, T2[3][1] - 0.25, 0.18, 34.5, 35.2, 36.2)
    }
    // ball and cross
    lathe(copper, cx, cy, [[0, 46.4], [0.22, 46.6], [0.22, 46.8], [0, 47.0]], 6)
    walls(red, [[cx - 0.07, cy - 0.07], [cx + 0.07, cy - 0.07], [cx + 0.07, cy + 0.07], [cx - 0.07, cy + 0.07]], 47.0, 48.0)
    const arm: XY[] = [[cx - 0.4, cy - 0.06], [cx + 0.4, cy - 0.06], [cx + 0.4, cy + 0.06], [cx - 0.4, cy + 0.06]]
    walls(red, arm, 47.5, 47.65); cap(red, arm, 47.65)
  }

  const parts: { part: Part; material: MaterialSpec }[] = [
    { part: render, material: { ...finish('nikolai-render', 0xf0e6dc), floodlight: floodWalls } },
    { part: red, material: { ...finish('nikolai-sandstone', 0xc26a5c), floodlight: floodWalls } },
    { part: slate, material: finish('nikolai-slate', 0x6b7179) },
    { part: win, material: PALETTE.window },
    { part: copper, material: finish('nikolai-copper', 0x7aa891) },
    { part: door, material: finish('nikolai-door', 0x7a6a5a) },
  ]
  return parts
}

if (import.meta.main) await writeLods(ID, 'Alte Nikolaikirche', [50.1099787, 8.6823425], -14.7, build(false), build(true))
