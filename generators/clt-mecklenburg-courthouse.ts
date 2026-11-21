/**
 * Mecklenburg County Courthouse, 832 E 4th St, Charlotte (2006).
 *
 * A pale stone block on a triangular plan: a straight west face on S
 * Alexander St side, two long faces on E 4th St and E Trade/E 3rd side that
 * meet at the corner entrance on 4th and McDowell. The outer band is
 * crowned by an open stone frame storey; a higher V-shaped block rides
 * inside it, reaching the corner entrance; a higher spine stands on the west
 * face; and a semicircular court steps down inside the west side.
 *
 * The 1928 courthouse (700 E Trade St) is a separate building and OSM
 * outline, not part of relation/9916859; it is not modelled here.
 *
 * Frame: bearing 0, +y north.
 *
 * Sources
 * - OSM relation/9916859 (multipolygon: outer way/380090205, inner
 *   way/713417660 - the court), height 54.
 * - USGS lidar USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid:
 *   outer band 52.1 (frame top 52.5) above the box's lowest ground; the inner
 *   V block 57.9 (parapet 58.4); the corner crown 59.6-59.9; the west spine
 *   55.5; the court's tiers 46.1, 36.2 and 22.5 from the rim down to its
 *   floor; street ground 2.3-3.5 on the south and east, about 7 on the west.
 * - USGS NAIP: the plan, the court and the wings.
 * - Photos, City Dweller 2, CC BY-SA 4.0 (EVIDENCE):
 *   https://commons.wikimedia.org/wiki/File:Mecklenburg_County_Courthouse_along_4th_St_Mid-March_2024.jpg
 *     (the 4th St face, the open frame at the top, the corners)
 *   https://commons.wikimedia.org/wiki/File:Mecklenburg_County_Courthouse_Entrance_from_across_the_street_Mid-March_2024.jpg
 *     (the corner entrance at 4th and McDowell, the stone grid, the granite base)
 *
 * Numbers (y = 0 is the street at the south-west, lidar 2.5)
 * - Outer band: solid to 44.0, open frame storey to 50.1: measured top
 *   (lidar 52.5); the frame's height (one storey and a half) from the photos.
 * - Inner V block 55.4, crown 57.3, spine 53.0: measured (lidar).
 * - Court tiers 43.7 (= the outer band's roof), 33.7, 20.0, radii 16 and 10 m
 *   around the middle of the west spine: measured (lidar, 4 m blocks).
 * - The inner block's plan: inset 9 m from the long faces, ends trimmed by
 *   lidar: measured to about 2 m.
 * - Facade: one window panel per 4.5 m bay and per two floors; the real
 *   building has punched windows in a deep stone grid.
 *
 * Doubts
 * - The west (Alexander St) face and the north-east face are not
 *   photographed; drawn like the 4th St face.
 * - The court's tiers are read from 4 m lidar blocks; their exact radii are
 *   estimates.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, panel, save, walls, onWall, type XY } from './chi-aon-center'

const BEARING = 0
const ANCHOR: [number, number] = [35.2195992, -80.8370377]
// lidar/OSM frame origin -80.83675, 35.2196; the outline's centroid is at (-26.16, -0.09) in it
const OX = 26.16, OY = 0.09
const S = (r: XY[]): XY[] => r.map(([x, y]) => [x + OX, y + OY] as XY)
const P3 = (x: number, y: number, z: number): V3 => [x + OX, y + OY, z]

const stone = new Part(), base = new Part(), win = new Part(), roof = new Part(), door = new Part()

const SOLID = 44.0, FRAME = 50.1, INNER = 55.4, CROWN = 57.3, SPINE = 53.0, BASE_TOP = 9.0
const CX = -42, CY = 0, R_RIM = 16, R_FLOOR = 10, Z_MID = 33.7, Z_FLOOR = 20.0

// OSM outer ring, counter-clockwise
const OUT: XY[] = S([[-55.2, -57.2], [-45.1, -68.1], [13.2, -15.1], [16.5, -18.7], [29.3, -6.6], [29.6, 1.1], [17.8, 13.3], [13.6, 9.1], [-44.7, 68.4], [-57.3, 56.3], [-58.3, 16.1], [-54.3, 16.0]])

const arc = (r: number, a0: number, a1: number, n: number): XY[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as XY })

// ---------------------------------------------------------------- the outer band
walls(stone, OUT, 0, SOLID)
// its roof, notched on the west for the spine and the court
{
  const notch: XY[] = [[-54.6, -20], [CX, -20], ...arc(R_RIM, -90, 90, 8), [CX, 16], [-54.3, 16.0]]
  const ring: XY[] = S([[-55.2, -57.2], [-45.1, -68.1], [13.2, -15.1], [16.5, -18.7], [29.3, -6.6], [29.6, 1.1], [17.8, 13.3], [13.6, 9.1], [-44.7, 68.4], [-57.3, 56.3], [-58.3, 16.1]]).concat(S(notch.slice().reverse()))
  cap(roof, ring, SOLID)
}
// the open frame storey along the faces (not on the spine's stretch)
{
  const lip = inset(OUT, 0.9)
  for (let i = 0; i < OUT.length; i++) {
    const j = (i + 1) % OUT.length, a = OUT[i], b = OUT[j]
    const onSpine = Math.abs(a[0] - (-54.3 + OX)) < 0.01 && Math.abs(b[0] - (-55.2 + OX)) < 0.01
    if (onSpine) continue
    // the beam: outer face, underside, inner face, top
    const la = lip[i], lb = lip[j]
    stone.quad([a[0], a[1], FRAME - 1.2], [b[0], b[1], FRAME - 1.2], [b[0], b[1], FRAME], [a[0], a[1], FRAME])
    stone.quad([a[0], a[1], FRAME], [b[0], b[1], FRAME], [lb[0], lb[1], FRAME], [la[0], la[1], FRAME])
    stone.quad([lb[0], lb[1], FRAME - 1.2], [la[0], la[1], FRAME - 1.2], [la[0], la[1], FRAME], [lb[0], lb[1], FRAME])
    stone.quad([b[0], b[1], FRAME - 1.2], [a[0], a[1], FRAME - 1.2], [la[0], la[1], FRAME - 1.2], [lb[0], lb[1], FRAME - 1.2])
    // posts every ~4.5 m
    const { L, P } = onWall(a, b)
    const n = Math.max(1, Math.round(L / 4.5))
    for (let k = 0; k <= n; k++) {
      const s = Math.min(L - 0.45, Math.max(0.45, (k * L) / n))
      const q = [P(s - 0.6, 0, 0), P(s + 0.6, 0, 0), P(s + 0.6, 0, -0.9), P(s - 0.6, 0, -0.9)].map(p => [p[0], p[1]] as XY)
      walls(stone, q, SOLID, FRAME - 1.2)
    }
    // a mid rail across the frame (the photos' grid)
    {
      const la2 = lip[i], lb2 = lip[j], zr = SOLID + 2.4
      stone.quad([a[0], a[1], zr], [b[0], b[1], zr], [b[0], b[1], zr + 0.8], [a[0], a[1], zr + 0.8])
      stone.quad([a[0], a[1], zr + 0.8], [b[0], b[1], zr + 0.8], [lb2[0], lb2[1], zr + 0.8], [la2[0], la2[1], zr + 0.8])
    }
  }
}
// facade: the granite base with glazing, then window panels, a bay per 4.5 m and two floors per panel
for (let i = 0; i < OUT.length; i++) {
  const a = OUT[i], b = OUT[(i + 1) % OUT.length], { L } = onWall(a, b)
  if (L < 4) continue
  const isEntrance = Math.abs(a[0] - (29.3 + OX)) < 0.01
  panel(base, a, b, 0, L, 0, BASE_TOP, 0.03)
  if (isEntrance) { panel(door, a, b, 1.2, L - 1.2, 0.3, 12.5, 0.06); continue }
  const n = Math.max(1, Math.round(L / 4.5)), w = L / n
  for (let k = 0; k < n; k++) {
    panel(win, a, b, k * w + 0.9, (k + 1) * w - 0.9, 1.2, BASE_TOP - 1.4, 0.06)
    for (const [z0, z1] of [[10.4, 16.6], [19.2, 25.4], [28.0, 34.2], [36.8, 42.6]]) panel(win, a, b, k * w + 0.9, (k + 1) * w - 0.9, z0, z1, 0.05)
  }
}

// ---------------------------------------------------------------- the inner V block
{
  const B: XY[] = S([[-42, -32], [-30, -41], [12, -12], [24, -7], [24, 4], [12, 10], [-29.4, 40], [-42, 32], [-42, 20], ...arc(20, 90, -90, 8).slice(1, -1), [-42, -20]])
  walls(stone, B, SOLID, INNER)
  cap(roof, B, INNER)
  for (let i = 0; i < B.length; i++) {
    const a = B[i], b = B[(i + 1) % B.length], { L } = onWall(a, b)
    if (L < 6) continue
    const n = Math.round(L / 4.5), w = L / n
    for (let k = 0; k < n; k++) panel(win, a, b, k * w + 0.9, (k + 1) * w - 0.9, SOLID + 1.6, INNER - 1.4, 0.05)
  }
  // the corner crown over the entrance
  const c: XY[] = S([[2, -9], [20, -9], [20, 1], [2, 1]])
  walls(stone, c, INNER, CROWN)
  cap(roof, c, CROWN)
}

// ---------------------------------------------------------------- the west spine
{
  const sp: XY[] = S([[-54.6, -20], [CX, -20], [CX, 16], [-54.3, 16.0]])
  walls(stone, sp, SOLID, SPINE)
  cap(roof, sp, SPINE)
}

// ---------------------------------------------------------------- the stepped court
{
  // the spine's east face down into the court
  const wy = (y0: number, y1: number, z0: number, z1: number) => stone.quad(P3(CX, y1, z0), P3(CX, y0, z0), P3(CX, y0, z1), P3(CX, y1, z1))
  wy(R_FLOOR, -R_FLOOR, Z_FLOOR, SOLID)
  wy(R_RIM, R_FLOOR, Z_MID, SOLID)
  wy(-R_FLOOR, -R_RIM, Z_MID, SOLID)
  panel(win, S([[CX, R_FLOOR]])[0], S([[CX, -R_FLOOR]])[0], 1.5, 2 * R_FLOOR - 1.5, Z_FLOOR + 1.5, SOLID - 1.5, 0.05)
  // the tiers' walls, facing the court's centre
  for (const [r, z0, z1] of [[R_RIM, Z_MID, SOLID], [R_FLOOR, Z_FLOOR, Z_MID]] as const) {
    const pts = arc(r, 90, -90, 8)
    for (let k = 0; k < pts.length - 1; k++) {
      const p0 = pts[k], p1 = pts[k + 1]
      stone.quad(P3(p0[0], p0[1], z0), P3(p1[0], p1[1], z0), P3(p1[0], p1[1], z1), P3(p0[0], p0[1], z1))
    }
  }
  // the tiers' floors
  const mid: XY[] = S([[CX, R_RIM], [CX, R_FLOOR], ...arc(R_FLOOR, 90, -90, 8).slice(1, -1), [CX, -R_FLOOR], [CX, -R_RIM], ...arc(R_RIM, -90, 90, 8).slice(1, -1)])
  cap(roof, mid, Z_MID)
  cap(roof, S([[CX, -R_FLOOR], ...arc(R_FLOOR, -90, 90, 8).slice(1, -1), [CX, R_FLOOR]]), Z_FLOOR)
}

if (import.meta.main) {
  await save('clt-mecklenburg-courthouse', 'Mecklenburg County Courthouse', ANCHOR, BEARING, [
    { part: stone, material: finish('courthouse-stone', 0xe6e0d8) },
    { part: base, material: finish('courthouse-granite', 0xcdb7ad) },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
    { part: roof, material: PALETTE.roof },
  ])
}
