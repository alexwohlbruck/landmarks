/**
 * 121 West Trade (1990, built as the Interstate Tower; Kohn Pedersen Fox),
 * Charlotte — original procedural geometry, CC0-1.0.
 * bun generators/clt-121-west-trade.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the
 * centroid of the OSM outline way/397369786) on the lowest ground. Placed at
 * bearing 47.97, square to Uptown's grid: +x faces North Tryon Street, -y
 * faces Trade Street, the Square is off the south-east corner.
 *
 * Identity:
 *  - a pale stone tower, punched windows, a tall recessed blue glass bay up
 *    the middle of each face (Kiran891's photo from the Square);
 *  - the crown: a two-tier green glass drum under a ribbed pale-green cone
 *    with a mast on top, framed by the stone corner blocks and the bays'
 *    stone fins (James Willamor's photo of the crown);
 *  - the barrel-vaulted glass bay rising up the Trade Street face.
 *
 * Evidence:
 *  - OSM way/397369786 (commercial, height=75), parts way/766641154
 *    (dome, 90 m: the drum's plan) and way/766641155 (roof:shape=round,
 *    87 m: the Trade Street vault's plan). All three heights are too low;
 *    lidar is used instead.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 0.5 m
 *    grid. Street 4.8 m (Trade) to 6.1 m (north side) above the box's
 *    lowest return; heights here from Trade. Shaft and notch tops 98.9 m;
 *    stone corners' parapet 114.8 m; the drum's rim 120 m; the cone rises
 *    about 1.15 m per metre inward to ~134 m; the mast's top 143.4 m. The
 *    vault bay: walls to ~111 m, crown 117.4 m. The south-east block
 *    beside the vault 110.5 m. Lidar's west face sits at x -15.3, 1.2 m
 *    inside OSM's; OSM's extra strip is not drawn.
 *  - Published: completed 1990-91, KPF, 32 floors, 462 ft / 140.8 m to
 *    the spire (Wikipedia "121 West Trade", citing CTBUH); lidar's mast top,
 *    143.4 m above Trade Street's low end, agrees within the slope.
 *  - Photos: "121 West Trade.jpg" (Kiran891, CC BY-SA 4.0, Wikimedia
 *    Commons, from the Square,
 *    https://commons.wikimedia.org/wiki/File:121_West_Trade.jpg);
 *    "Interstate Tower, Charlotte" (James Willamor, CC BY-SA 2.0, Flickr,
 *    the crown, https://www.flickr.com/photos/81464596@N00/2946926253).
 *    No commercial imagery or 3D tiles.
 *  - Look-only, not relied on: krazeeboi's "Interstatecrown" and
 *    "Interstate_1stCitizens" (Flickr, CC BY-NC-ND 2.0).
 *
 * Estimated: the glass bays' widths (10-12 m, photos and lidar notches),
 * their 1.5 m recess; punched windows narrowed to 1.5 m of each 3.4 m
 * bay so the stone dominates, as in Kiran891's photo; the drum's two tiers (13.5 and 11.8 m radius, the
 * lower to 120 m, the upper 4.5 m tall), the cone's 8.5 m rise to its
 * apex at 133 m, from Willamor's near-level photo scaled to the drum's
 * 27 m width; lidar's 120 m "rim" is the lower tier's top, and its
 * slope reading from there to ~134 m takes in the upper tier and cone; the
 * fins; window panels two storeys high at 3.6 m a storey; the stone's
 * colour, a warm beige from the daylight photos.
 *
 * Doubts: the photos show a darker granite base about two storeys high;
 * it is drawn in the shaft's stone to stay within six materials. The back (north-west) faces are seen in no photo and are drawn
 * like the Tryon face. The two-storey base and its entrance are drawn
 * plainly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { bays, cap, lathe, panel, parapetRoof, rect, rows, save, walls, type XY } from './chi-aon-center'

const BEARING = 47.97
const ANCHOR: [number, number] = [35.22743, -80.8439483]

const stone = new Part(), win = new Part(), bay = new Part(), roof = new Part(), drum = new Part(), cone = new Part()

const SHAFT = 98.9, PARAPET = 114.8, BASE = 10, FLOOR = 3.6
const X0 = -15.3, X1 = 18.1, Y0 = -28.3, Y1 = 25.6, D = 1.5
const CX = 1.3, CY = 9

// Plan with the recessed bays on the east, north and west faces.
const plan: XY[] = [
  [X0, Y0], [8.3, Y0], [8.3, -17], [X1, -17],
  [X1, 2], [X1 - D, 2], [X1 - D, 14], [X1, 14],
  [X1, Y1], [6, Y1], [6, Y1 - D], [-4, Y1 - D], [-4, Y1],
  [X0, Y1], [X0, 14], [X0 + D, 14], [X0 + D, 2], [X0, 2],
]
const isBay = (a: XY, b: XY) => {
  // the three recessed faces, and the Trade face's vault bay
  if (Math.abs(a[0] - (X1 - D)) < 1e-6 && Math.abs(b[0] - (X1 - D)) < 1e-6) return true
  if (Math.abs(a[0] - (X0 + D)) < 1e-6 && Math.abs(b[0] - (X0 + D)) < 1e-6) return true
  if (Math.abs(a[1] - (Y1 - D)) < 1e-6 && Math.abs(b[1] - (Y1 - D)) < 1e-6) return true
  return false
}

// --- The shaft.
walls(stone, plan, 0, SHAFT)
cap(roof, plan, SHAFT)
const groupsOf = (z0: number, z1: number) => rows(z0, z1, Math.max(1, Math.round((z1 - z0) / (2 * FLOOR))), 1.2)
for (let i = 0; i < plan.length; i++) {
  const a = plan[i], b = plan[(i + 1) % plan.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (isBay(a, b)) {
    // a full glass bay, framed by thin stone mullions every 3.4 m
    const n = Math.round(L / 3.4), w = L / n
    for (let k = 0; k < n; k++) panel(bay, a, b, k * w + 0.2, (k + 1) * w - 0.2, BASE, SHAFT - 0.6)
    continue
  }
  if (L < 3) continue
  // Trade face (y = Y0): skip the vault bay's strip, which is glass
  const segs: [number, number][] = Math.abs(a[1] - Y0) < 1e-6 && Math.abs(b[1] - Y0) < 1e-6
    ? [[0, -4.5 - X0], [7.5 - X0, L]] : [[0, L]]
  for (const [s0, s1] of segs) {
    const len = s1 - s0, n = Math.max(1, Math.round(len / 3.4)), w = len / n
    for (let k = 0; k < n; k++) {
      for (const [z0, z1] of groupsOf(BASE, SHAFT)) panel(win, a, b, s0 + k * w + 0.95, s0 + (k + 1) * w - 0.95, z0, z1)
      // base: tall openings, one per bay
      panel(win, a, b, s0 + k * w + 0.6, s0 + (k + 1) * w - 0.6, 0.2, BASE - 1.6)
    }
  }
}
// the vault bay's glass up the Trade face, to the vault
for (let k = 0; k < 4; k++) panel(bay, [X0, Y0], [8.3, Y0], -4.5 - X0 + k * 3 + 0.15, -4.5 - X0 + (k + 1) * 3 - 0.15, BASE, 111)

// --- The upper block: the stone corners up to the parapet.
const upper: XY[] = [
  [X0, -9], [X1, -9],
  [X1, 2], [X1 - D, 2], [X1 - D, 14], [X1, 14],
  [X1, Y1], [6, Y1], [6, Y1 - D], [-4, Y1 - D], [-4, Y1],
  [X0, Y1], [X0, 14], [X0 + D, 14], [X0 + D, 2], [X0, 2],
]
walls(stone, upper, SHAFT, PARAPET - 0.6)
parapetRoof(stone, roof, upper, PARAPET - 0.6, 0.5, 1.2)
for (let i = 0; i < upper.length; i++) {
  const a = upper[i], b = upper[(i + 1) % upper.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 3 || Math.abs(a[1] + 9) < 1e-6 && Math.abs(b[1] + 9) < 1e-6) continue
  const n = Math.max(1, Math.round(L / 3.4)), w = L / n
  for (let k = 0; k < n; k++) panel(win, a, b, k * w + 0.95, (k + 1) * w - 0.95, SHAFT + 1.2, PARAPET - 3)
}

// --- The Trade Street vault bay: glass walls and a barrel roof.
{
  const VX0 = -4.5, VX1 = 7.5, R = (VX1 - VX0) / 2, VC = (VX0 + VX1) / 2, SPRING = 111.4
  const V: XY[] = rect(VX0, Y0, VX1, -9)
  walls(stone, V, SHAFT, SPRING)
  for (const s of [VX0, VX1]) {
    const a: XY = s === VX0 ? [VX0, -9] : [VX1, Y0], b: XY = s === VX0 ? [VX0, Y0] : [VX1, -9]
    panel(bay, a, b, 0.4, 19.3 - 0.4, SHAFT + 0.6, SPRING - 0.6)
  }
  const N = 10
  for (let k = 0; k < N; k++) {
    const t0 = Math.PI * k / N, t1 = Math.PI * (k + 1) / N
    const p = (t: number, y: number): V3 => [VC + R * Math.cos(t), y, SPRING + R * Math.sin(t)]
    const n0: V3 = [Math.cos(t0), 0, Math.sin(t0)], n1: V3 = [Math.cos(t1), 0, Math.sin(t1)]
    bay.tri(p(t0, Y0), p(t0, -9), p(t1, -9), undefined, undefined, undefined, [n0, n0, n1])
    bay.tri(p(t0, Y0), p(t1, -9), p(t1, Y0), undefined, undefined, undefined, [n0, n1, n1])
    // the half-disc closing the vault on the Trade face, glass
    bay.tri([VC, Y0, SPRING], p(t0, Y0), p(t1, Y0))
  }
  // the vault's glass end wall between the walls' tops and the arch
  panel(bay, [VX0, Y0], [VX1, Y0], 0, VX1 - VX0, SHAFT, SPRING)
}

// --- The block beside the vault, south-east.
{
  const E: XY[] = rect(8.3, -17, X1, -9)
  walls(stone, E, SHAFT, 110.5)
  cap(roof, E, 110.5)
}

// --- The crown: the two-tier drum, the ribbed cone and the mast.
const RIM = 120, TIER2 = 124.5, APEX = 133
lathe(drum, CX, CY, [[0, PARAPET - 1.5], [13.5, PARAPET - 1.5], [13.5, RIM], [11.8, RIM], [11.8, TIER2]], 16)
// pale bands: a sill under each tier's glass
lathe(stone, CX, CY, [[13.55, RIM - 0.5], [13.55, RIM]], 16)
lathe(stone, CX, CY, [[11.85, TIER2 - 0.5], [11.85, TIER2]], 16)
lathe(cone, CX, CY, [[12.2, TIER2], [0.01, APEX]], 16)
// four ribs down the cone, on the frame's axes
for (const a of [0, Math.PI / 2, Math.PI, 1.5 * Math.PI]) {
  const u: XY = [Math.cos(a), Math.sin(a)], v: XY = [-u[1], u[0]], w = 0.35
  const P = (r: number, z: number, s: number): V3 => [CX + u[0] * r + v[0] * s, CY + u[1] * r + v[1] * s, z]
  const lift = 0.25, zr = (r: number) => APEX - (APEX - TIER2) * r / 12.2
  cone.quad(P(12.4, zr(12.4) + lift, -w), P(12.4, zr(12.4) + lift, w), P(0.6, zr(0.6) + lift, w), P(0.6, zr(0.6) + lift, -w))
}
{
  const M: XY[] = rect(CX - 0.35, CY - 0.35, CX + 0.35, CY + 0.35)
  walls(roof, M, APEX - 1, 143.4)
  cap(roof, M, 143.4)
}
// the stone fins framing the drum on each axis
for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
  const r0 = 11.8, r1 = 14.0, t = 0.6
  const F: XY[] = dx ? rect(CX + dx * r0 - (dx < 0 ? r1 - r0 : 0), CY - t, CX + dx * r0 + (dx > 0 ? r1 - r0 : 0), CY + t)
    : rect(CX - t, CY + dy * r0 - (dy < 0 ? r1 - r0 : 0), CX + t, CY + dy * r0 + (dy > 0 ? r1 - r0 : 0))
  walls(stone, F, PARAPET - 1.5, TIER2)
  cap(stone, F, TIER2)
}

if (import.meta.main) {
  await save('clt-121-west-trade', '121 West Trade', ANCHOR, BEARING, [
    { part: stone, material: finish('interstate-stone', 0xe6dccb) },
    { part: win, material: { ...PALETTE.window, color: 0x6b87a2 } },
    { part: bay, material: windowVariant(2, 0x84a3c1) },
    { part: roof, material: PALETTE.roof },
    { part: drum, material: windowVariant(3, 0x8fb3a6) },
    { part: cone, material: finish('interstate-cone', 0xa9c2b2) },
  ], 6500)
}
