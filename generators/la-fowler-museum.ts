/**
 * Fowler Museum at UCLA (1992, Arthur Erickson with Fred Fisher), Westwood
 * — original procedural geometry, CC0-1.0.
 *
 *   bun generators/la-fowler-museum.ts
 *
 * Uses the kit in la-kerckhoff-hall.ts (arcades, discs) and la-getty-center.ts.
 *
 * Frame: x east, y north, z up, metres; bearing 0 (the outline is square to
 * the compass within 0.2°). Origin at the area centroid of the OSM outer ring
 * (-118.443193, 34.072951), on the lowest ground under the footprint:
 * 119.9 m NAVD88, the sunken court at the south-west corner (USGS 3DEP).
 * The entrance walk on the west is 4.0 m higher (123.9 m), and the ground
 * along the south front rises from 4.3 m at its west end to 12.3 m at its
 * east end, so most of the south and east walls stand in the slope.
 *
 * A 1990s museum in UCLA's Romanesque idiom: flat-roofed red brick blocks
 * with cast-stone copings, string courses and quoins; a square entrance
 * tower with paired round-arched belfry openings under a low tile pyramid;
 * a second tower on the north; four small tile-capped towers at the corners
 * of a raised ring round a courtyard of two storeys of round arches; and a
 * west terrace wing with arcaded screens on its roof. The entrance tower,
 * the courtyard towers and the brick-and-stone quoined walls are the
 * identity.
 *
 * Evidence
 * - Plan: OSM relation/6287586 (building=yes, height 16.8, outer
 *   way/422876496, courtyard inner way/422876504; LA County bld_id
 *   427437849244).
 * - Heights: USGS_LPC_CA_LosAngeles_2016_LAS_2018 (2016 flight), 0.5 m
 *   grid, over the 119.9 m ground: main roof 14.0, the raised ring round
 *   the courtyard 15.2, the courtyard towers 17.6–18.1 (caps), the entrance
 *   and north towers 17.6–18.2, the west terrace wing 9.5 with screens to
 *   13.6 (two north–south lines at x -30 and -23), the courtyard floor 4.3.
 * - Photos (Wikimedia Commons), compared with renders from the same side:
 *   f1 "Fowler Museum UCLA.JPG" (Josh Lee, CC BY-SA 3.0) and
 *   f2 "Fowler.JPG" (Fuzzy901, CC BY-SA 3.0) — the entrance tower, the
 *      west wing's banner wall and roof arches, the quoined south wing with
 *      its recessed top-floor loggia, from the south-west;
 *   f3 "Fowler courtyard.jpg" (Caterpillar84, CC BY-SA 4.0) — the
 *      courtyard's two storeys of stone-framed round arches;
 *   f4 "Fowler front.jpg" (Caterpillar84, CC BY-SA 4.0) — the entrance:
 *      round-arched door, round window, lettering panel, the tower beside;
 *   f5 "UCLA tower.jpg" (Alboychenko08, CC BY-SA 4.0) — a courtyard
 *      tower: paired round arches in a stone frame, tile pyramid;
 *   USGS NAIP for the plan, the pinkish flat roofs, the four tile caps
 *      round the courtyard and the west wing's pergola terrace.
 * - Colour: sampled from f2 (sunlit brick #ab8577, #a67a68; cast stone
 *   #c7c7ba in shade) and NAIP (flat roof #b59b8a), pulled to the palette's
 *   lightness beside Royce Hall's brick and stone.
 *
 * Entrance tower: lidar shows its tile cap 7.4 × 5 m peaking at 18.3 m, 4.1 m
 * over the 14.2 m main roof; the walls are drawn 5.6 × 4.5 m inside a 0.8 m
 * eave, so the cap overhangs. Roof colour: NAIP samples #b59b8a (pinkish);
 * drawn a neutral #b8b0a6 so the roof separates from the brick.
 * The top storey of the south-west block is a glazed band set 1.5 m back
 * under the cornice, wrapping the corner, with a railing (f1, f2).
 * Estimated: tower plans and opening sizes (from f2, f4, f5 against the
 * lidar heights), the courtyard towers' positions (on the corners of the
 * raised ring, as NAIP shows; lidar puts the east pair up to 2 m further
 * east), the quoin and band heights, the west wing's screens (three arches
 * each). Doubts: no licensed photo shows the north and east sides: they
 * carry the coping, bands and quoins the photographed sides show, with few
 * windows. The banners on the tower are temporary and left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, rect, prism, cap, panel, pyramid, walls, clipHalf, save, wallLen, ccw } from './la-getty-center'
import { arcade, proudArcade, disc, archRing, faces, block, tracery, bar } from './la-kerckhoff-hall'

const brick = new Part(), stone = new Part(), tile = new Part(), roofP = new Part(), win = new Part(), door = new Part()

const MAIN = 14.0, RING = 15.2, PLAZA = 4.0, CF = 4.3

/** Stone quoins on the corner at the end of wall a→b, onto wall b→c. */
function quoins(a: XY, b: XY, c: XY, z0: number, z1: number) {
  const L = wallLen(a, b)
  let k = 0
  for (let z = z0; z + 0.5 <= z1; z += 0.95, k++) {
    const w0 = k % 2 ? 0.55 : 1.0, w1 = k % 2 ? 1.0 : 0.55
    panel(stone, a, b, L - w0, L + 0.04, z, z + 0.5, 0.04)
    panel(stone, b, c, -0.04, w1, z, z + 0.5, 0.04)
  }
}

/** Quoins on every convex corner of a counter-clockwise ring. */
function ringQuoins(r0: XY[], z0: number, z1: number, minLen = 2.0) {
  const r = ccw(r0)
  for (let i = 0; i < r.length; i++) {
    const a = r[(i + r.length - 1) % r.length], b = r[i], c = r[(i + 1) % r.length]
    const turn = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
    if (turn > 1e-6 && wallLen(a, b) > minLen && wallLen(b, c) > minLen) quoins(a, b, c, z0, z1)
  }
}

/** A flat cap over a ring with an axis-aligned rectangular hole, split down the hole's middle. */
function capWithHole(p: Part, outer: XY[], hx0: number, hy0: number, hx1: number, hy1: number, z: number) {
  const xm = (hx0 + hx1) / 2, R = ccw(outer)
  for (const side of [-1, 1]) {
    const half = clipHalf(R, [xm, 0], [side, 0])
    // the edge lying on x = xm: splice the hole's half into it
    const i = half.findIndex((q, k) => Math.abs(q[0] - xm) < 1e-6 && Math.abs(half[(k + 1) % half.length][0] - xm) < 1e-6)
    if (i < 0) { cap(p, half, z); continue }
    const hx = side < 0 ? hx0 : hx1
    const goingUp = half[(i + 1) % half.length][1] > half[i][1]
    const notch: XY[] = goingUp ? [[xm, hy0], [hx, hy0], [hx, hy1], [xm, hy1]] : [[xm, hy1], [hx, hy1], [hx, hy0], [xm, hy0]]
    const ring = [...half.slice(0, i + 1), ...notch, ...half.slice(i + 1)]
    cap(p, ring, z)
  }
}

// ---------- plan ----------
const MB: XY[] = [[-10.8, -31.2], [26.9, -31.3], [26.4, 22.2], [13.7, 22.4], [13.7, 24.6], [14.9, 24.6], [14.9, 25.4], [10.1, 25.4], [10.1, 32.2], [-15.6, 32.1], [-15.5, 19.1], [-18.8, 19.1], [-18.8, -9.35], [-16.0, -9.35], [-16.0, -17.3], [-14.3, -17.3], [-14.3, -24.2], [-10.8, -24.1]]
/** the same, with the south wing's top-floor loggia notched in */
const LZ = 10.4, LT = 13.4, GX = -9.3, GY = -29.7, GE = 10.0
const MB_UP: XY[] = [...MB.slice(1), [-10.8, -25.2], [GX, -25.2], [GX, GY], [GE, GY], [GE, -31.25]]
const CX0 = -4.1, CY0 = -8.1, CX1 = 8.1, CY1 = 4.2, RW = 2.4

// main block: walls to the roof, the courtyard's walls up to the ring, a pink-tan roof with the courtyard open
prism(brick, null, MB, 0, LZ, { corner: 0.2, bevel: 0 })
prism(brick, null, MB_UP, LZ, LT, { corner: 0.2, bevel: 0 })
prism(brick, null, MB, LT, MAIN, { corner: 0.2, bevel: 0, bottom: stone })
capWithHole(roofP, MB, CX0 - RW, CY0 - RW, CX1 + RW, CY1 + RW, MAIN)
// the raised ring round the courtyard
{
  const o = rect(CX0 - RW, CY0 - RW, CX1 + RW, CY1 + RW), i = rect(CX0, CY0, CX1, CY1)
  walls(brick, o, MAIN, RING)
  walls(brick, i, CF + 8.6, RING, true)
  for (let k = 0; k < 4; k++) {
    const a = o[k], b = o[(k + 1) % 4], c = i[(k + 1) % 4], d = i[k]
    roofP.quad([a[0], a[1], RING], [b[0], b[1], RING], [c[0], c[1], RING], [d[0], d[1], RING])
  }
  // a stone coping on the ring's outside
  for (let k = 0; k < 4; k++) panel(stone, o[k], o[(k + 1) % 4], 0, wallLen(o[k], o[(k + 1) % 4]), RING - 0.5, RING, 0.05)
}
// coping and string course round the main block
{
  const r = ccw(MB)
  for (let k = 0; k < r.length; k++) {
    const a = r[k], b = r[(k + 1) % r.length], L = wallLen(a, b)
    if (L < 0.5) continue
    panel(stone, a, b, -0.05, L + 0.05, MAIN - 0.6, MAIN, 0.07)
    panel(stone, a, b, -0.05, L + 0.05, 9.7, 10.15, 0.05)
  }
  ringQuoins(MB, PLAZA + 0.2, MAIN - 0.7, 3.0)
}

// ---------- the courtyard: two storeys of stone-framed round arches ----------
{
  const f = faces(CX0, CY0, CX1, CY1)
  for (const k of ['S', 'E', 'N', 'W'] as const) {
    // the courtyard's walls face inward: run each side backwards
    const [b, a] = f[k], L = wallLen(a, b)
    arcade(stone, a, b, { s0: 0, s1: L, n: 3, w: 2.6, z0: CF - 0.6, zs: CF, crown: CF + 4.0, z1: CF + 4.3, kind: 'round', t: 0.35, back: win, seg: 6 })
    arcade(brick, a, b, { s0: 0, s1: L, n: 3, w: 2.4, z0: CF + 4.3, zs: CF + 5.3, crown: CF + 8.4, z1: CF + 8.6, kind: 'round', t: 0.3, back: win, seg: 6 })
    for (let j = 0; j < 3; j++) {
      const c = (L / 3) * (j + 0.5)
      archRing(stone, a, b, c, 1.2, 1.45, CF + 7.2, 0.04, 8)
    }
    panel(stone, a, b, 0, L, CF + 4.3, CF + 4.7, 0.05)
  }
  // the panels and piers above stand on the plain wall from 4.3 to the ring top
}

// ---------- towers ----------
/** A brick tower with a stone cornice, paired round-arched openings near the top and a low tile pyramid. */
function tower(x0: number, y0: number, x1: number, y1: number, z1: number, open: [number, number], cap1: number, o: { quoin?: number; seg?: number; eave?: number } = {}) {
  block(brick, null, rect(x0, y0, x1, y1), 0, z1, 0.15, 0)
  prism(stone, stone, rect(x0 - 0.25, y0 - 0.25, x1 + 0.25, y1 + 0.25), z1, z1 + 0.5, { corner: 0.12, bevel: 0.12 })
  // a wide-eaved tile cap: a tile fascia slab overhanging the cornice, then the pyramid
  const e = o.eave ?? 0.5
  prism(tile, null, rect(x0 - e, y0 - e, x1 + e, y1 + e), z1 + 0.5, z1 + 0.72, { corner: 0.05, bevel: 0, bottom: tile })
  pyramid(tile, rect(x0 - e, y0 - e, x1 + e, y1 + e), z1 + 0.72, cap1)
  const f = faces(x0, y0, x1, y1)
  for (const k of ['S', 'E', 'N', 'W'] as const) {
    const [a, b] = f[k], L = wallLen(a, b), w = Math.min(1.1, L * 0.24)
    proudArcade(stone, a, b, { s0: L / 2 - w - 0.3, s1: L / 2 + w + 0.3, n: 2, w, z0: open[0] - 0.35, zs: open[0], crown: open[1], z1: open[1] + 0.3, kind: 'round', t: 0.3, back: win, seg: o.seg ?? 6 })
  }
  if (o.quoin) ringQuoins(rect(x0, y0, x1, y1), o.quoin, z1 - 0.3, 1)
}
// the entrance tower (south-west) and the north tower
tower(-18.5, -21.9, -12.9, -17.4, 16.4, [13.6, 15.8], 1.2, { quoin: PLAZA + 0.2, seg: 6, eave: 0.8 })
tower(10.2, 25.4, 14.9, 31.8, 16.4, [13.6, 15.8], 1.1, { quoin: PLAZA + 0.2, seg: 6, eave: 0.9 })
// the entrance tower's tall stone panel (f2) and its lower stone base
{
  const [a, b] = faces(-18.5, -21.9, -12.9, -17.4).S, L = wallLen(a, b)
  panel(stone, a, b, L / 2 - 1.3, L / 2 + 1.3, PLAZA + 1.2, PLAZA + 6.4, 0.05)
  const [c, d] = faces(-18.5, -21.9, -12.9, -17.4).W, M = wallLen(c, d)
  panel(stone, c, d, M / 2 - 1.0, M / 2 + 1.0, PLAZA + 1.2, PLAZA + 5.4, 0.05)
}
// the four courtyard towers, on the ring's corners
for (const [cx, cy] of [[CX0 - RW / 2, CY1 + RW / 2], [CX1 + RW / 2, CY1 + RW / 2], [CX0 - RW / 2, CY0 - RW / 2], [CX1 + RW / 2, CY0 - RW / 2]] as XY[]) {
  const h = 2.0
  tower(cx - h, cy - h, cx + h, cy + h, 16.4, [14.8, 16.1], 0.9, { seg: 4, eave: 0.55 })
}

// ---------- the west terrace wing and its arcaded screens ----------
{
  const WB: XY[] = [[-34.0, -9.4], [-18.8, -9.4], [-18.8, 19.1], [-22.8, 19.1], [-22.8, 16.2], [-34.0, 16.2]]
  prism(brick, roofP, WB, 0, 9.5, { corner: 0.2, bevel: 0 })
  const r = ccw(WB)
  for (let k = 0; k < r.length; k++) {
    const a = r[k], b = r[(k + 1) % r.length], L = wallLen(a, b)
    panel(stone, a, b, -0.05, L + 0.05, 8.9, 9.5, 0.07)
  }
  ringQuoins(WB, PLAZA + 0.2, 8.8, 3.0)
  for (const x of [-30.0, -23.2]) {
    const a: XY = [x, -0.5], b: XY = [x, 10.5] // east face of a free-standing screen
    arcade(stone, a, b, { s0: 0, s1: 11.0, n: 3, w: 2.6, z0: 9.5, zs: 9.5, crown: 12.6, z1: 13.6, kind: 'round', t: 0.6, through: true, top: stone, seg: 8 })
  }
  // the banner wall over the sunken court: tall blind niches (f2)
  const [a, b] = [[-34.0, -9.4], [-18.8, -9.4]] as [XY, XY]
  // a row of slot windows under the banners, and the lower floor's glazing (below the walk, mostly buried)
  for (const s of [1.6, 3.6, 5.6, 7.6, 9.6, 11.6, 13.6]) {
    panel(stone, a, b, s - 0.45, s + 0.45, PLAZA + 0.9, PLAZA + 3.9, 0.03)
    panel(win, a, b, s - 0.3, s + 0.3, PLAZA + 1.1, PLAZA + 3.7, 0.06)
  }
  panel(win, a, b, 1.0, 14.2, 0.4, 3.0, 0.05)
  tracery(stone, a, b, 1.0, 14.2, 0.4, 3.0, { lights: 7, every: 9, bar: 0.18, frame: false })
}

// ---------- the entrance: a round-arched door, a round window, a lettering panel ----------
{
  const a: XY = [-17.35, -9.35], b: XY = [-17.35, -17.3] // west-facing face between the wing and the tower
  arcade(brick, a, b, { s0: 0, s1: 7.95, n: 1, w: 3.0, z0: 0, zs: PLAZA, crown: PLAZA + 4.6, z1: PLAZA + 5.0, kind: 'round', t: 0.5, L: 1.35, back: door, seg: 10 })
  archRing(stone, a, b, 3.975, 1.5, 2.0, PLAZA + 3.1, 0.04, 10)
  prism(brick, null, rect(-17.35, -17.3, -16.0, -9.35), PLAZA + 5.0, MAIN, { corner: 0, bevel: 0 })
  cap(roofP, rect(-17.35, -17.3, -16.0, -9.35), MAIN)
  panel(stone, a, b, 0.4, 7.55, PLAZA + 5.2, PLAZA + 7.0, 0.04)
  panel(stone, a, b, -0.02, 7.97, MAIN - 0.6, MAIN, 0.07)
  disc(stone, a, b, 3.975, PLAZA + 8.7, 1.1, 0.04, 12)
  disc(win, a, b, 3.975, PLAZA + 8.7, 0.82, 0.07, 12)
}

// ---------- the south wing: recessed top-floor loggia, windows ----------
{
  const a: XY = [-10.8, -31.2], b: XY = [26.9, -31.3]
  // the top storey is a glazed band set 1.5 m back under the cornice, wrapping the corner, with a railing
  cap(roofP, rect(-10.8, -31.25, GE, GY), LZ)
  cap(roofP, rect(-10.8, GY, GX, -25.2), LZ)
  const ga: XY = [GX, GY], gb: XY = [GE, GY], wa: XY = [GX, -25.2], wb: XY = [GX, GY]
  panel(win, ga, gb, 0, GE - GX, LZ + 0.2, LT - 0.2, 0.04)
  panel(win, wa, wb, 0, 4.5, LZ + 0.2, LT - 0.2, 0.04)
  tracery(stone, ga, gb, 0.2, GE - GX - 0.2, LZ + 0.2, LT - 0.2, { lights: 8, every: 9, bar: 0.18, frame: false })
  tracery(stone, wa, wb, 0.2, 4.3, LZ + 0.2, LT - 0.2, { lights: 2, every: 9, bar: 0.18, frame: false })
  block(brick, null, rect(-10.8, -31.25, -9.6, -30.05), LZ, LT, 0, 0)
  ringQuoins(rect(-10.8, -31.25, -9.6, -30.05), LZ, LT - 0.2, 0.5)
  bar(stone, a, [GE, -31.25], 1.2, GE + 10.8, LZ, LZ + 1.0, 0.12, -0.3)
  bar(stone, [-10.8, -25.2], [-10.8, -31.2], 0.1, 4.8, LZ, LZ + 1.0, 0.12, -0.3)
  for (const s of [17.0, 21.0]) panel(win, a, b, s - 0.6, s + 0.6, 10.8, 12.8, 0.05)
  // the short west face of the wing and the piece by the tower
  const c: XY = [-10.8, -24.1], d: XY = [-10.8, -31.2]
  panel(stone, c, d, 1.4, 5.7, PLAZA + 1.0, PLAZA + 5.0, 0.04)
}
// ---------- north and east sides: few windows ----------
{
  const N: [XY, XY] = [[10.1, 32.2], [-15.6, 32.1]]
  for (const s of [4.0, 8.5, 13.0, 17.5, 22.0]) panel(win, N[0], N[1], s - 0.6, s + 0.6, 10.8, 12.8, 0.05)
  for (const s of [6.2, 12.8, 19.4]) {
    proudArcade(stone, N[0], N[1], { s0: s - 1.4, s1: s + 1.4, n: 1, w: 2.0, z0: PLAZA + 0.4, zs: PLAZA + 0.7, crown: PLAZA + 4.4, z1: PLAZA + 4.8, kind: 'round', t: 0.3, back: win, seg: 8 })
  }
  const E: [XY, XY] = [[26.9, -31.3], [26.4, 22.2]]
  for (const s of [8, 16, 24, 32, 40, 48]) panel(win, E[0], E[1], s - 0.6, s + 0.6, 11.0, 12.8, 0.05)
}

void ([] as V3[])
save('la-fowler-museum', 'Fowler Museum', [
  { part: brick, material: finish('fowler-brick', 0xc08878) },
  { part: stone, material: finish('fowler-stone', 0xe6dfcf) },
  { part: tile, material: PALETTE.terracotta },
  { part: roofP, material: finish('fowler-roof', 0xb8b0a6) },
  { part: win, material: { ...PALETTE.window, color: 0x5f6870 } },
  { part: door, material: PALETTE.entrance },
], { bearing: 0, elevation: 0, height: 18.3, replaces: ['relation/6287586'] }, 6500)
