/**
 * The Adolphus (Adolphus Hotel), 1321 Commerce Street, Dallas, 1912
 * (Barnett, Haynes & Barnett), with its 1916, 1926 and 1950 additions that
 * share its OSM outline — original procedural geometry, CC0-1.0.
 * bun generators/dal-adolphus-hotel.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/471953148,
 * -96.799951, 32.779958. Its walls run at 345.7° / 75.7°, so the catalog
 * bearing is 345.7: -y is the Commerce Street front, +x Akard Street.
 *
 * Identity, in order: the 1912 tower on the Commerce–Akard corner, dark red
 * brick banded in white stone over a three-storey stone base with five
 * great arched windows on Commerce; the round stone corner on Commerce and
 * Akard, carried up past the bracketed main cornice into a drum, dome and
 * lantern; the stone attic and the steep green mansard roof with dormers
 * behind it, with small domed cupolas on the other corners; the plainer,
 * pale annexes stepping down to the west along Commerce.
 *
 * Evidence:
 *  - plan: OSM outline way/471953148 (x -43.3..48, y -15.4..14 here, with
 *    the strip x 8.2..20 south of y -1.2 left out: a separate low building)
 *    and part way/964805583 (OSM names it "The Adolphus", but it is the
 *    west annex block: x -41.6..-5.6, y -6..12.5, with a light-court notch
 *    on its south side). The 1912 tower is the outline's east end, x 20..48
 *    (28 m on Commerce, ~26 m on Akard): the lidar has no returns there
 *    (taller than its ~52 m ceiling) and a wall at y ~ -15/-16, and the
 *    Commerce/Akard street sign in Joe Mabel's corner panorama is at that
 *    corner.
 *  - USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018; no returns above ~52 m
 *    over downtown), measured: the west annex's south half 46.5 m; the
 *    front blocks on Commerce 43 m (west) and 31.8 m (middle), the light
 *    court 15 m, the low parts east of x 2 at 15.5–17.8 m. North of the
 *    annex (y > 6.5) and x -5.6..40 behind the tower there are no returns:
 *    drawn at the outline's tagged 70 m (OSM height; estimate).
 *  - heights of the 1912 tower: published 22 storeys, 312 ft (95 m)
 *    (Wikipedia; NRHP), taken to the top of the corner lantern. The tiers
 *    are counted in storeys on Mabel's panorama and his frontal photo from
 *    the AT&T plaza: a 3-storey stone base (16 m, matching the 15.7 m lidar
 *    of the matching low annex), 12 brick storeys to the main cornice
 *    (~59–61 m), 2 storeys over it, the stone attic to ~74 m and the
 *    mansard over it to ~90 m (estimates at ~3.6 m a storey).
 *  - colour: dark chocolate red-brown brick (#7c473c: pulled up from the photos' ~#5e2a22 but kept dark, as it is identity and frames the cream stone), cream stone
 *    and terra cotta, green copper roof and domes, from the daylight photos.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Adolphus_Hotel_pano_01.jpg and Adolphus_Hotel_01.jpg, Joe Mabel, CC BY-SA 3.0
 *  - Hotel_Adolphus_Dallas_(1_of_1).jpg, Renelibrary, CC BY-SA 4.0; HotelAdolphus1.jpg, Renelibrary, CC BY-SA 3.0
 *  - Adolphus01.jpg, Dfwcre8tive, CC BY 3.0
 *  - Adolphus_Hotel.jpg, RadicalBender, CC BY-SA 3.0
 *  - The historic Adolphus Hotel in downtown Dallas (LCCN2014632085), Carol M. Highsmith, public domain
 * USGS NAIP, USGS 3DEP lidar. No commercial imagery.
 *
 * Doubts: the annexes' upper parts north of y 6.5 (no lidar, no clear
 * photo; 70 m from the OSM tag); the mansard's exact pitch and the dormer
 * count, seen only from the street below; the north and west faces of the
 * 1912 tower (no photo); the cupolas on the north corners are assumed to
 * match the south-west one.
 *
 * Left out: the sculpture, cartouches, brackets and balconies, the iron
 * window guards, the cresting, the curved gables at the attic's ends.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, rect, save, walls, type XY } from './chi-aon-center'
import { archPanel, bands, bayRow, box, course, prism, slab } from './dal-magnolia-hotel'

/** A ring with its corner `at` (index) replaced by a quarter round of radius r. */
function roundCorner(r0: XY[], at: number, r: number, seg = 6): XY[] {
  const n = r0.length, p = r0[(at - 1 + n) % n], c = r0[at], q = r0[(at + 1) % n]
  const u = (a: XY, b: XY): XY => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }
  const d1 = u(c, p), d2 = u(c, q)
  const ctr: XY = [c[0] + (d1[0] + d2[0]) * r, c[1] + (d1[1] + d2[1]) * r]
  const a0 = Math.atan2(-d2[1], -d2[0]), a1 = Math.atan2(-d1[1], -d1[0])
  let da = a1 - a0
  while (da > Math.PI) da -= 2 * Math.PI
  while (da < -Math.PI) da += 2 * Math.PI
  const arc: XY[] = []
  for (let i = 0; i <= seg; i++) { const t = a0 + (da * i) / seg; arc.push([ctr[0] + r * Math.cos(t), ctr[1] + r * Math.sin(t)]) }
  arc.reverse()
  return [...r0.slice(0, at), ...arc, ...r0.slice(at + 1)]
}

function build() {
  const stone = new Part(), brick = new Part(), trim = new Part()
  const win = new Part(), roof = new Part(), copper = new Part()
  const tstone = trim // the 1912 tower's white stone and terra cotta: the trim colour

  // ---- 1912 tower
  const X0 = 20, X1 = 48, Y0 = -14.6, Y1 = 12.5, RC = 3.2 // SE corner radius
  const BASE = 16, CORN = 59, UP = 61, ATT = 68, ATT1 = 69.4, ATTOP = 73.5
  const ring = roundCorner(rect(X0, Y0, X1, Y1), 1, RC)
  // base, stone
  walls(tstone, ring, 0, BASE - 1.0)
  course(trim, ring, BASE - 1.0, BASE, 0.4)
  // brick shaft with a stone band every two storeys
  walls(brick, ring, BASE, CORN)
  for (let z = BASE + 7.2; z < CORN - 2; z += 7.2) course(trim, ring, z - 0.6, z, 0.12)
  // the round corner stays stone all the way up: a stone sleeve over the arc
  {
    const c: XY = [X1 - RC, Y0 + RC]
    lathe(tstone, c[0], c[1], [[RC + 0.25, BASE], [RC + 0.25, CORN]], 16)
  }
  // main cornice: a heavy bracketed overhang
  course(trim, ring, CORN, UP, 1.3)
  // two storeys over the cornice: brick with stone, then the attic
  walls(brick, ring, UP, ATT)
  course(trim, ring, ATT, ATT1, 0.6)
  walls(tstone, ring, ATT1, ATTOP - 0.6)
  course(trim, ring, ATTOP - 0.6, ATTOP, 0.3)
  cap(roof, ring, ATTOP - 0.2)

  // The mansard: steep sides from inside the attic, then a low hip to the ridge.
  {
    const m0 = inset(rect(X0, Y0, X1, Y1), 1.2), m1 = inset(rect(X0, Y0, X1, Y1), 5.4), m2 = inset(rect(X0, Y0, X1, Y1), 9.5)
    // slate mansard (the roof grey) under a green copper cresting
    roof.loft([m0.map(([x, y]) => [x, y, ATTOP - 0.2] as V3), m1.map(([x, y]) => [x, y, 86.5] as V3)])
    copper.loft([m1.map(([x, y]) => [x, y, 86.5] as V3), inset(m1, -0.25).map(([x, y]) => [x, y, 87.3] as V3), inset(m1, 0.6).map(([x, y]) => [x, y, 88.2] as V3)])
    roof.loft([inset(m1, 0.6).map(([x, y]) => [x, y, 88.2] as V3), m2.map(([x, y]) => [x, y, 90] as V3)])
    roof.cap(m2.map(([x, y]) => [x, y, 90] as V3), true)
    // dormers on the steep slope, three to a face (stone fronts, copper tops)
    const dormer = (cx: number, cy: number, nx: number, ny: number) => {
      const w = 1.5, d = 2.6, z0 = ATTOP - 0.4, z1 = ATTOP + 6.4
      const ox = cx + nx * 0.2, oy = cy + ny * 0.2, tx = -ny, ty = nx
      const r: XY[] = [[ox - tx * w, oy - ty * w], [ox + tx * w, oy + ty * w], [ox + tx * w - nx * d, oy + ty * w - ny * d], [ox - tx * w - nx * d, oy - ty * w - ny * d]]
      const ccw = (r[1][0] - r[0][0]) * (r[2][1] - r[0][1]) - (r[1][1] - r[0][1]) * (r[2][0] - r[0][0]) > 0
      const rr = ccw ? r : [...r].reverse()
      prism(trim, copper, rr, z0, z1)
      const pw: XY = [ox + nx * 0.06, oy + ny * 0.06]
      win.quad(...([[-1, z0 + 0.8], [1, z0 + 0.8], [1, z1 - 1.0], [-1, z1 - 1.0]].map(([s, z]) => [pw[0] + tx * s * 0.8 * (ccw ? 1 : 1), pw[1] + ty * s * 0.8, z] as V3)) as [V3, V3, V3, V3])
    }
    const W = X1 - X0, D = Y1 - Y0
    for (const f of [0.36, 0.5, 0.64]) {
      dormer(X0 + W * f, Y0 + 1.2 + 1.0, 0, -1)
      dormer(X0 + W * f, Y1 - 1.2 - 1.0, 0, 1)
      dormer(X1 - 1.2 - 1.0, Y0 + D * f, 1, 0)
      dormer(X0 + 1.2 + 1.0, Y0 + D * f, -1, 0)
    }
  }

  // The corner turret on Commerce and Akard: drum, dome, lantern, finial.
  {
    const cx = X1 - RC, cy = Y0 + RC
    lathe(tstone, cx, cy, [[RC + 0.1, ATTOP - 0.6], [RC + 0.1, 79.5]], 16)
    lathe(trim, cx, cy, [[RC + 0.1, 79.5], [RC + 0.6, 80.1], [RC + 0.6, 80.9], [RC, 81.2]], 16)
    const dome: XY[] = [], tEnd = Math.acos(1.3 / RC)
    for (let i = 0; i <= 6; i++) { const t = tEnd * (i / 6); dome.push([RC * Math.cos(t), 81.2 + 4.6 * Math.sin(t)]) }
    lathe(copper, cx, cy, dome, 16)
    const lz = dome[dome.length - 1][1]
    lathe(trim, cx, cy, [[1.3, lz], [1.3, lz + 3.0], [1.6, lz + 3.3]], 12)
    lathe(copper, cx, cy, [[1.6, lz + 3.3], [1.2, lz + 4.3], [0.5, lz + 5.0], [0.25, 95], [0.001, 95.3]], 12)
  }
  // Copper balls on stone pedestals at the other three corners.
  for (const [cx, cy] of [[X0 + 1.8, Y0 + 1.8], [X0 + 1.8, Y1 - 1.8], [X1 - 1.8, Y1 - 1.8]] as XY[]) {
    box(tstone, tstone, cx - 1.1, cy - 1.1, cx + 1.1, cy + 1.1, ATTOP - 0.6, ATTOP + 1.4, 0.2)
    const ball: XY[] = Array.from({ length: 7 }, (_, i) => { const t = -Math.PI / 2 + (Math.PI * i) / 6; return [Math.max(0.001, 1.25 * Math.cos(t)), ATTOP + 2.65 + 1.25 * Math.sin(t)] as XY })
    lathe(copper, cx, cy, ball, 12)
  }
  // The round-topped stone gables with their oculi at the ends of the
  // Commerce and Akard faces, rising over the attic.
  {
    const gable = (a: XY, b: XY, sMid: number) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const r = 3.0, zs = ATTOP + 0.4
      const prof: [number, number][] = [[-r, ATT1], [r, ATT1], [r, zs]]
      for (let i = 1; i < 10; i++) { const t = (Math.PI * i) / 10; prof.push([r * Math.cos(t), zs + r * Math.sin(t)]) }
      prof.push([-r, zs])
      const place = (pu: number, pv: number, w: number): V3 => [a[0] + u[0] * (sMid + pu) + n[0] * (w - 1.4), a[1] + u[1] * (sMid + pu) + n[1] * (w - 1.4), pv]
      slab(tstone, prof, 0, 1.55, place)
      archPanel(win, [a[0] + n[0] * 0.15, a[1] + n[1] * 0.15], [b[0] + n[0] * 0.15, b[1] + n[1] * 0.15], sMid, 1.6, zs + 0.2, zs + 0.9, 0.05, 8)
    }
    gable([X0, Y0], [X1 - RC, Y0], 5.2)
    gable([X0, Y0], [X1 - RC, Y0], X1 - RC - X0 - 4.6)
    gable([X1, Y0 + RC], [X1, Y1], 4.6)
    gable([X1, Y0 + RC], [X1, Y1], Y1 - Y0 - RC - 5.2)
  }

  // Windows on the tower: seven bays a face, two storeys to a panel.
  const shaftRows = bands(BASE, CORN, 6, 2.8).map(([a, b]) => [a + 0.3, b + 0.3] as [number, number])
  const upRows: [number, number][] = [[UP + 0.9, ATT - 0.9]]
  const atRows: [number, number][] = [[ATT1 + 0.8, ATTOP - 1.4]]
  const faces: [XY, XY, number][] = [[[X0, Y0], [X1 - RC, Y0], 6], [[X1, Y0 + RC], [X1, Y1], 6], [[X1, Y1], [X0, Y1], 7], [[X0, Y1], [X0, Y0], 7]]
  for (const [a, b, n] of faces) {
    bayRow(win, a, b, n, shaftRows, { end: 1.6, fill: 0.42 })
    bayRow(win, a, b, n, upRows, { end: 1.6, fill: 0.42 })
    bayRow(win, a, b, Math.max(4, n - 2), atRows, { end: 2.4, fill: 0.4 })
  }
  // Base: five great arched windows on Commerce, two storeys tall; tall
  // windows on Akard and the others.
  for (let k = 0; k < 5; k++) archPanel(win, [X0, Y0], [X1 - RC, Y0], 3.0 + k * 4.7, 3.2, 4.6, 11.4)
  bayRow(win, [X1, Y0 + RC], [X1, Y1], 6, [[4.2, 8.4], [10.2, 13.6]], { end: 1.2, fill: 0.42 })
  bayRow(win, [X0, Y1], [X0, Y0], 6, [[10.2, 13.6]], { end: 1.2, fill: 0.42 })
  bayRow(win, [X1, Y1], [X0, Y1], 6, [[4.2, 8.4], [10.2, 13.6]], { end: 1.2, fill: 0.42 })

  // ---- the annexes to the west (pale stone and brick, stepped)
  const blocks: [XY[], number][] = [
    [rect(-43.3, -15.4, -23, -6), 43], // west front block
    [rect(-23, -15.4, -17, -1.8), 15], // light court floor
    [rect(-17, -15.4, 2, -6), 31.8], // middle front block
    [rect(2, -15.4, 8.2, -1.2), 16.5], // low east front block
    [[[-41.6, -6], [-27.8, -6], [-27.8, -1.8], [-19.1, -1.8], [-19.1, -6], [-5.6, -6], [-5.6, 6.5], [-41.6, 6.5]], 46.5], // west annex, south half
    [rect(-5.6, -6, 2, 6.5), 31.8], // filler east of the annex
    [rect(2, -1.2, X0, 6.5), 16.5], // link to the tower, low
    [[[-43.4, 6.5], [X0, 6.5], [X0, 13.9], [-43.4, 14]], 70], // north annex, behind
    [rect(-43.3, -6, -41.6, 6.5), 43],
  ]
  for (const [r, h] of blocks) {
    walls(stone, r, 0, h - 0.8)
    course(trim, r, h - 0.8, h, 0.25)
    cap(roof, r, h)
  }
  // annex windows, broad panels over two storeys
  const annexWin = (a: XY, b: XY, h: number, n: number) => bayRow(win, a, b, n, bands(10.5, h - 2.5, Math.max(1, Math.round((h - 13) / 7.2)), 2.4), { end: 1.4, fill: 0.5 })
  annexWin([-43.3, -15.4], [-23, -15.4], 43, 5)
  annexWin([-17, -15.4], [2, -15.4], 31.8, 5)
  annexWin([-43.3, -6], [-43.3, -15.4], 43, 2)
  annexWin([-43.4, 14], [-43.4, 6.5], 70, 2)
  annexWin([X0, 13.9], [-43.4, 14], 70, 14)
  bayRow(win, [-41.6, 6.5], [-5.6, 6.5], 7, bands(47, 67.5, 3, 2.4), { end: 1.4, fill: 0.5 })
  bayRow(win, [-5.6, 6.5], [X0, 6.5], 5, bands(17, 67.5, 7, 2.4), { end: 1.4, fill: 0.5 })
  annexWin([-43.3, 6.5], [-43.3, -6], 43, 3)
  annexWin([2, -15.4], [8.2, -15.4], 16.5, 1)
  // the matching stone base along Commerce: arched windows
  for (const [a, b, n] of [[-43.3, -23, 4], [-17, 2, 4]] as [number, number, number][]) {
    const w = (b - a) / n
    for (let k = 0; k < n; k++) archPanel(win, [-43.3, -15.4], [8.2, -15.4], a - -43.3 + (k + 0.5) * w, 2.6, 2.2, 7.4)
  }

  return [
    { part: brick, material: finish('adolphus-brick', 0x7c473c) },
    { part: stone, material: finish('adolphus-annex', 0xeadcb4) },
    { part: trim, material: PALETTE.trim },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: PALETTE.copper },
  ]
}

if (import.meta.main) await save('dal-adolphus-hotel', 'The Adolphus', [32.779958, -96.799951], 345.7, build())
