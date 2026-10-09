/**
 * American Museum of Natural History, Central Park West at 79th Street —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-amnh.ts
 *
 * Map frame: x = model east (Central Park West), y = model north (81st
 * Street), z up, metres. Placed at bearing 29°, the Manhattan grid. Anchor:
 * area centroid of the OSM outline way/388436810. y = 0 is the street at
 * the lowest corner (81st Street); Central Park West runs 2–3 m higher.
 *
 * Identifying features (from the photos):
 * 1. The Theodore Roosevelt Memorial on Central Park West: a pale granite
 *    triumphal arch, the round-arched entrance between four giant
 *    free-standing Ionic columns on pedestals, the entablature breaking
 *    forward over each column with a statue (Boone, Audubon, Clark, Lewis)
 *    in front of a high attic; a terrace and steps in front.
 * 2. The 77th Street front: pink granite Romanesque Revival, round corner
 *    towers with conical red-tile roofs, slender turrets on the central
 *    pavilion, an arcade of round arches over the arched carriage entrance
 *    and its twin stairs, and a red hipped roof the length of the wing.
 * 3. The Rose Center's glass cube on 81st Street with the white Hayden
 *    Sphere inside it.
 * 4. The Gilder Center (2023) on Columbus Avenue: a pale granite front of
 *    flowing horizontal strata, bulging and pinched like a canyon wall,
 *    with ribbon windows in the grooves and a tall glass entrance slot.
 *
 * Evidence
 * - OSM way/388436810 (the whole complex as one outline, 220 × 192 m,
 *   height 46; no building parts). Its curving west edge is the Gilder
 *   Center's front.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), resampled in the model frame
 *   (/tmp/city/nyc/work/nyc-amnh/rot.png). The streets stand 5–8 m above
 *   the window's lowest return (an areaway), so heights here are taken
 *   above 81st Street (25.0 m NAVD88): the memorial's attic 36 m, Central
 *   Park West at +3.4; the 77th Street wing's eaves ~31 m and ridges
 *   38–40 m; the Central Park West corner tower to 48.7 m, the towers
 *   flanking the central pavilion 38.7 m; the Rose Center cube 34 m; the
 *   central halls 36–45 m; the courts and low wings 6–17 m. The flight
 *   predates the Gilder Center, so its height is estimated (28 m, five
 *   strata, scaled from the photo against the Columbus Avenue wing).
 * - NAIP orthophoto (USGS, public domain): the plan of the wings, the red
 *   tile roofs along 77th Street, the glass roof of the cube.
 * - Published: corner towers 150 ft (46 m) tall; the main entrance arch
 *   60 ft (18 m) high; the Rose Center a six-storey glass cube round the
 *   87 ft (27 m) Hayden Sphere (Wikipedia).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-amnh/photos/credits.txt: the memorial head-on
 *   (Ajay Suresh, CC BY 2.0) and close (Joyofmuseums, CC BY-SA 4.0;
 *   Ingfbruno, CC BY-SA 3.0), the 77th Street front (Danceqtpie9, CC BY-SA
 *   4.0; Suicasmo, CC BY-SA 4.0; Antigng, CC BY-SA 4.0; Farrah Ross, CC
 *   BY-SA 3.0), the Rose Center (Ryan Schwark, CC0), the Gilder Center
 *   (AMartin 4532, CC BY-SA 4.0).
 *
 * Estimated: the memorial's storeys (the head-on photo scaled to the
 * lidar: pedestals to 9.4 m, columns to 25.4 m, entablature to 31 m), the
 * rear wings' plan as boxes read off the lidar, window rhythms, the Gilder
 * Center's strata and depth behind its OSM front, the cube's frame (the
 * real cube is glass on a fine steel grid; the map draws no transparency,
 * so the glass is left out and the cube is drawn as an open white frame,
 * five bays a side, with the sphere inside it; the model therefore has no
 * `glass` material, and the Gilder Center's glazed entrance slot is
 * `window`), the sphere's legs. The memorial's order (columns,
 * entablature, statues) is a lighter granite finish than its wall so it
 * reads in shadow. The Columbus Avenue and 81st Street fronts of the older
 * wings are drawn from the lidar with a plain window rhythm.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, massing, prism, capPoly, area, circle, unit, type XY, type Facade } from './nyc-570-lexington'
import { column, rectPanel, archPanel, wallFrame, dome, band } from './nyc-city-hall'
import { onWall, cube, roofOn, statue, stair } from './nyc-nypl'

const pink = new Part(), pale = new Part(), tile = new Part(), roof = new Part(), win = new Part(), light = new Part()

const romanesque: Facade = { bay: 6.0, ratio: 0.45, floor: 5.0, group: 2, spandrel: 2.6, sill: 1.6, head: 2.2, ground: 2.2, minLength: 8, margin: 1.5 }
const plain: Facade = { ...romanesque, bay: 6.5, ratio: 0.4 }

// --- Massing: the pink granite wings and the later wings (lidar, minus
// 5 m to the 81st Street datum) ---
massing({
  wall: pink, win, roof, facade: romanesque, bevel: 0.4,
  boxes: [
    [-104.4, -56, 60, -10.7, 13], [-50, -10.7, 60, 47, 13], // low halls and courts
    [-104.4, -53, -80, -10.7, 28], [-80, -53, -43, -10.7, 24], // Columbus wing
    [-19, -53, 5, 1, 28], [8, -17, 29, 25, 37], [23, -11, 60, 43, 30], // the central halls
    [-48, 47, 25, 94, 15], // 81st Street wing
    [-83.3, 47, -48, 79, 26], [-68, 79, -48.7, 93, 20], // north-west wing
    [25, 47, 65, 52, 13], // the Rose Center's link
    [-107.8, -82, 92.1, -56, 31], [-24.1, -87.6, 8.1, -82, 31], [17, -56, 60, -44, 31], // 77th Street wing
  ],
})
massing({
  wall: pale, win, roof, facade: plain, bevel: 0.4,
  boxes: [
    [60, -56, 88.2, 47, 30], [65, 47, 88.5, 92, 32], // Central Park West wings
    [88.2, -11.9, 93.6, -1.9, 26], [88.2, 35.2, 94.3, 45.4, 26], // the memorial's side bays
  ],
})

// --- 77th Street: red hipped roofs, towers, turrets, the arcade ---
roofOn(tile, null, -107.8, -82, 92.1, -56, 31, 39, 'hip')
roofOn(tile, null, -24.1, -87.6, 8.1, -66, 31, 39.5, 'hip')
/** A round tower: a granite drum, a cornice and a conical tile roof. */
function tower(cx: number, cy: number, r: number, eave: number, tip: number, wall: Part = pink) {
  const n = 14
  const ring = (rr: number, z: number): V3[] => circle(cx, cy, rr, n).map(([x, y]) => [x, y, z] as V3)
  wall.loft([ring(r, 0), ring(r, eave)])
  wall.loft([ring(r, eave), ring(r + 0.5, eave + 0.3), ring(r + 0.5, eave + 1.0)])
  for (let i = 0; i < n; i++) {
    const a = ring(r + 0.5, eave + 1.0), j = (i + 1) % n
    const ap: V3 = [cx, cy, tip]
    const na = unit([a[i][0] - cx, a[i][1] - cy, r * 0.8]), nb = unit([a[j][0] - cx, a[j][1] - cy, r * 0.8])
    tile.tri(a[i], a[j], ap, undefined, undefined, undefined, [na, nb, unit([na[0] + nb[0], na[1] + nb[1], na[2] + nb[2]])])
  }
  // Windows round the drum, two rows.
  for (let k = 0; k < 6; k++) {
    const t0 = (k / 6) * 2 * Math.PI + 0.3, t1 = t0 + 0.32
    const p0: XY = [cx + r * Math.cos(t0), cy + r * Math.sin(t0)], p1: XY = [cx + r * Math.cos(t1), cy + r * Math.sin(t1)]
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    for (const [z0, z1] of [[eave - 6.5, eave - 2.5], [eave - 13, eave - 9]]) rectPanel(win, p0, p1, L / 2, L * 0.8, z0, z1, 0.12)
  }
}
tower(-29.5, -88.2, 5.5, 34, 41.5)
tower(13.5, -88.2, 5.5, 34, 41.5)
tower(94, -87, 7, 36, 48.7) // Central Park West corner (published 46 m)
tower(-110, -87, 7, 36, 46)
// The central pavilion: slender turrets, a balustrade, the arcade of seven
// round arches over the carriage arch and its stairs.
{
  const a: XY = [-24.1, -87.6], b: XY = [8.1, -87.6], L = 32.2
  for (const s of [L / 3, (2 * L) / 3]) {
    const p = wallFrame(a, b, 0).at(s, 0, 0.9)
    column(pink, p[0], p[1], 1.2, 0, 33, { n: 10, base: 1.0, cap: 0.8, taper: 1 })
    dome(pink, p[0], p[1], 1.5, 33, 3.2, 10, 3)
  }
  onWall(pink, a, b, 0, L, -0.05, 0.7, 12.4, 13.6) // the balustrade over the arcade
  for (let k = 0; k < 7; k++) archPanel(win, a, b, 1.7 + ((L - 3.4) * (k + 0.5)) / 7, 3.4, 7.2, 11.6, 0.08)
  // The stair block, the carriage arch through it, the twin flights.
  onWall(pink, a, b, 2, L - 2, -0.05, 6, 0, 7)
  archPanel(win, a, b, L / 2, 10, 0, 5.6, 6.05)
  for (const [s0, s1] of [[-6, 2], [L - 2, L + 6]]) stair(pink, a, b, s0, s1, -0.05, 6, 0, 7, 7)
}

// --- Central Park West: the Theodore Roosevelt Memorial ---
{
  const CPW = 3.4, PED = 9.4, COL = 25.4, ENT = 31, ATT = 36.4
  const Y0 = -1.9, Y1 = 35.2, F = 101.5, cy = (Y0 + Y1) / 2
  prism({ wall: pale, win: null, roof, ring: [[88.2, Y0], [F, Y0], [F, Y1], [88.2, Y1]], z0: 0, z1: ATT, facade: null, bevel: 0.4 })
  const a: XY = [F, Y0], b: XY = [F, Y1], L = Y1 - Y0, sc = cy - Y0
  // Terrace and steps in front, from the sidewalk.
  onWall(pale, [F, -12], [F, 45.4], -0.5, 58, -0.05, 7.5, 0, CPW + 2.5)
  stair(pale, a, b, sc - 7, sc + 7, 7.45, 4, CPW, CPW + 2.5, 5)
  // The arch, the tallest element of the front: rising from the terrace
  // to just under the capitals (published 18 m), its moulding, the dark
  // grille of the entrance.
  archPanel(light, a, b, sc, 13.4, 14, 25.2, 0.08, 12)
  archPanel(win, a, b, sc, 11.4, CPW + 2.5, 24.2, 0.14, 12)
  // Side windows under small pediments.
  for (const d of [-11.4, 11.4]) {
    rectPanel(win, a, b, sc + d, 2.6, 11.5, 17.5, 0.08)
    onWall(pale, a, b, sc + d - 2.2, sc + d + 2.2, -0.05, 0.6, 18, 19.2)
  }
  // Four free-standing Ionic columns on pedestals, standing well proud of
  // the wall; the entablature breaking forward over each, and the statues
  // on it in front of the attic. The order is a lighter stone than the wall
  // behind, so it reads in shadow.
  for (const d of [-15.6, -8.2, 8.2, 15.6]) {
    const s = sc + d, c = wallFrame(a, b, 0).at(s, 0, 3.1)
    onWall(light, a, b, s - 2.3, s + 2.3, -0.05, 5.4, CPW, PED)
    column(light, c[0], c[1], 1.45, PED, COL, { n: 12, base: 0.8, cap: 1.3, taper: 0.9 })
    onWall(light, a, b, s - 2.3, s + 2.3, -0.05, 5.0, COL, ENT)
    onWall(light, a, b, s - 2.7, s + 2.7, 3.8, 5.6, ENT - 1.0, ENT)
    const st = wallFrame(a, b, 0).at(s, 0, 3.2)
    cube(light, st[0] - 1.2, st[1] - 1.2, st[0] + 1.2, st[1] + 1.2, ENT, ENT + 1.0)
    statue(light, st[0], st[1], ENT + 1.0, 4.6)
  }
  onWall(light, a, b, -0.4, L + 0.4, -0.05, 1.2, COL, ENT) // entablature
  onWall(light, a, b, -0.6, L + 0.6, -0.05, 1.8, ENT - 1.0, ENT) // its cornice
  onWall(pale, a, b, -0.3, L + 0.3, -0.05, 0.6, ATT - 0.8, ATT) // attic cornice
}

// --- The Rose Center: the cube as an open white frame (the map draws no
// transparency, so its glass walls and roof are left open), and the
// Hayden Sphere filling it ---
{
  const X0 = 25, X1 = 63, Y0 = 52, Y1 = 90, H = 34.5, t = 1.6
  // Bold corner posts and edge beams at the top, a lighter band at the
  // foot and at the 12 m floor.
  for (const [x, y] of [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]] as XY[]) cube(light, x - t / 2, y - t / 2, x + t / 2, y + t / 2, 0, H)
  const ring = (z: number, h: number, w: number) => {
    cube(light, X0, Y0 - w / 2, X1, Y0 + w / 2, z, z + h, true); cube(light, X0, Y1 - w / 2, X1, Y1 + w / 2, z, z + h, true)
    cube(light, X0 - w / 2, Y0, X0 + w / 2, Y1, z, z + h, true); cube(light, X1 - w / 2, Y0, X1 + w / 2, Y1, z, z + h, true)
  }
  ring(H - 1.8, 1.8, t)
  ring(12, 0.9, 0.9)
  ring(0, 1.2, 0.9)
  // The open roof grid: five bays each way.
  for (let k = 1; k < 5; k++) {
    const x = X0 + ((X1 - X0) * k) / 5, y = Y0 + ((Y1 - Y0) * k) / 5
    cube(light, x - 0.45, Y0, x + 0.45, Y1, H - 1.2, H - 0.2, true)
    cube(light, X0, y - 0.45, X1, y + 0.45, H - 1.2, H - 0.2, true)
  }
  // Mid-height mullions on each face, so the walls read as a cage.
  for (let k = 1; k < 5; k++) {
    const x = X0 + ((X1 - X0) * k) / 5, y = Y0 + ((Y1 - Y0) * k) / 5
    for (const yy of [Y0, Y1]) cube(light, x - 0.3, yy - 0.3, x + 0.3, yy + 0.3, 0, H - 1.8)
    for (const xx of [X0, X1]) cube(light, xx - 0.3, y - 0.3, xx + 0.3, y + 0.3, 0, H - 1.8)
  }
  // The sphere: 27 m across, standing on three legs.
  const cx = (X0 + X1) / 2, cyy = (Y0 + Y1) / 2, R = 13.25, zc = 19.0 // 87 ft across, raised on legs
  dome(pale, cx, cyy, R, zc, R, 16, 6)
  const lower: V3[][] = []
  for (let k = 0; k <= 5; k++) { const th = (k / 5) * (Math.PI / 2); lower.push(circle(cx, cyy, Math.max(R * Math.cos(th), 0.01), 16).map(([x, y]) => [x, y, zc - R * Math.sin(th)] as V3)) }
  for (let k = 0; k < 5; k++) for (let i = 0; i < 16; i++) {
    const j = (i + 1) % 16, A = lower[k][i], B = lower[k][j], C = lower[k + 1][j], D = lower[k + 1][i]
    const nm = (q: V3): V3 => unit([q[0] - cx, q[1] - cyy, q[2] - zc])
    pale.tri(A, C, B, undefined, undefined, undefined, [nm(A), nm(C), nm(B)])
    if (k < 4) pale.tri(A, D, C, undefined, undefined, undefined, [nm(A), nm(D), nm(C)])
  }
  for (let k = 0; k < 3; k++) {
    const th = (k / 3) * 2 * Math.PI + 0.5
    const fx = cx + 9 * Math.cos(th), fy = cyy + 9 * Math.sin(th)
    column(light, fx, fy, 0.9, 0, zc - R + 3.2, { n: 8, base: 0.4, cap: 0.3, taper: 0.8 })
  }
}

// --- The Gilder Center: pale granite strata along its curving front ---
{
  const curve: XY[] = [[-102.1, -10.6], [-102.3, -7.6], [-103.3, -5], [-103.8, -1.7], [-103.7, 3.5], [-100.6, 5.6], [-98.1, 7.6], [-95.5, 12.2], [-93.1, 13.2], [-89.1, 13.5], [-86.7, 14.6], [-84.6, 16.1], [-83.2, 19.1], [-84.6, 23.8], [-85, 26.8], [-85, 30.3], [-84.1, 32.7], [-80.5, 34.7], [-77.6, 37.2], [-73.1, 39.1], [-70.2, 39.9], [-68.2, 41.4], [-67.8, 47.2]]
  let ring: XY[] = [...curve, [-50, 47.2], [-50, -10.7]]
  const front = ring.map((_, i) => i < curve.length)
  if (area(ring) < 0) { ring = ring.reverse(); front.reverse() }
  // Outward normals per vertex (bisectors).
  const nrm = ring.map((b, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    return unit([u[0] + v[0], u[1] + v[1], 0])
  })
  // Running length along the ring, to vary the bulge along the front.
  const sAt: number[] = [0]
  for (let i = 1; i < ring.length; i++) sAt.push(sAt[i - 1] + Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]))
  const at = (i: number, d: number, z: number): V3 => front[i] ? [ring[i][0] + nrm[i][0] * d, ring[i][1] + nrm[i][1] * d, z] : [ring[i][0], ring[i][1], z]
  const n = ring.length, BAND = 5.6, TOP = 28
  for (let k = 0; k < 5; k++) {
    const z0 = k * BAND, z1 = z0 + BAND, zw = z0 + 1.4, zm = z0 + 3.3
    const bulge = (i: number) => 1.4 + 1.3 * Math.sin(sAt[i] / 11 + k * 1.7)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, f = front[i] && front[j]
      // Ribbon window in the groove (stone on the back walls).
      const P = f && k > 0 ? win : pale
      const q = (ii: number, d: number, z: number) => at(ii, d, z)
      P.quad(q(i, -0.6, z0), q(j, -0.6, z0), q(j, -0.6, zw), q(i, -0.6, zw))
      pale.quad(q(i, -0.6, zw), q(j, -0.6, zw), q(j, bulge(j), zm), q(i, bulge(i), zm))
      pale.quad(q(i, bulge(i), zm), q(j, bulge(j), zm), q(j, -0.6, z1), q(i, -0.6, z1))
    }
  }
  capPoly(roof, ring.map((p, i) => [at(i, -0.6, TOP)[0], at(i, -0.6, TOP)[1]] as XY), TOP)
  // The tall glass entrance slot in the middle of the front.
  const m = 12, p0 = ring[m - 1], p1 = ring[m + 1]
  void p0; void p1
  const e0 = at(front.indexOf(true) + 10, 2.0, 0), e1 = at(front.indexOf(true) + 13, 2.0, 0)
  rectPanel(win, [e0[0], e0[1]], [e1[0], e1[1]], Math.hypot(e1[0] - e0[0], e1[1] - e0[1]) / 2, Math.hypot(e1[0] - e0[0], e1[1] - e0[1]) * 0.9, 0, TOP - 2, -0.3)
}
void band

finishModel('American Museum of Natural History', 'nyc-amnh', [
  { part: pink, material: finish('amnh-granite', 0xdcb9a9) },
  { part: pale, material: finish('amnh-pale-granite', 0xe2dbcd) },
  { part: tile, material: PALETTE.terracotta },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: light, material: finish('amnh-light-granite', 0xf6f2ea) },
], { bearing: 29, osm: 'way/388436810', height: 48.7 }, 6500)
