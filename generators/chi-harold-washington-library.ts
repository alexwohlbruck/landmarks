/**
 * Harold Washington Library Center (400 South State Street, 1991, Hammond,
 * Beeby and Babka; acroteria 1993, Kent Bloomer with owls by Raymond
 * Kaskey), Chicago — original procedural geometry, CC0-1.0.
 * bun generators/chi-harold-washington-library.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/28292694,
 * 41.8763227,-87.6282122. Its walls run at 359.1° / 89.1°, so the catalog
 * bearing is 359.1 and the block is square to this frame.
 *
 * Identity, in order: the seven big green acroteria — owls in foliage on the
 * four corners and the State Street (east) centre, seed pods at the centres
 * of the Van Buren (north) and Congress (south) sides — drawn as bold flat
 * palmettes; the steep green-ribbed glass "pediment" roof over a heavy
 * projecting green cornice; the red brick walls with five-storey arched
 * windows (three to the short sides, five to State Street) over a granite
 * base with arched entrances; the glass west wall on Plymouth Court.
 *
 * Evidence:
 *  - plan: OSM outline, 61.9 x 107.6 m. The roof from USGS NAIP: the glass
 *    slope round the edge, a pale vault running north-south down the middle
 *    (~24 m wide) and a glass crossing (~32 m square) at its centre with
 *    hipped glazing.
 *  - heights: OSM gives 10 levels. Measured on Beyond My Ken's view of the
 *    south side, scaled by its 61.9 m width: granite base ~12 m, cornice
 *    ~44 m, glass roof slope ~9 m. Corner acroteria ~19 m tall, from the
 *    same photo and Ken Lund's view of the south-east corner. All estimates
 *    within a few metres; no published height was found. Acroteria ~19 m
 *    tall including the fan's tip, ~17 m wide at the scrolls.
 *  - acroteria positions and subjects: Wikipedia (Exterior section) and the
 *    photos.
 *  - colour: red brick and pink granite, pulled to the palette's lightness;
 *    the cornice, ribs and acroteria in weathered green (patina).
 *
 * Photos (Wikimedia Commons): Harold_Washington_Library_from_southeast.jpg,
 * _from_southwest.jpg, _from_east.jpg, _southern_acroterion.jpg (Beyond My
 * Ken, CC BY-SA 4.0); Harold_Washington_Library,_Chicago,_Illinois_
 * (9181548762).jpg (Ken Lund, CC BY-SA 2.0); Harold_Washington_Library_
 * Chicago_Acroterion_2019-1533.jpg (Paul R. Burley, CC BY-SA 4.0). USGS
 * NAIP for the roof. No commercial imagery.
 *
 * Left out: the rope friezes, garlands and medallions, cornice brackets,
 * the window mullions, the arches' stepped reveals.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, block, cap, inset, panel, rect, save, triangulate, wallBays, walls, type XY } from './chi-merchandise-mart'

/** A flat silhouette extruded `t` thick, standing in a vertical plane through (cx, cy) facing `dir` (radians, 0 = east). */
function plume(p: Part, cx: number, cy: number, z0: number, dir: number, sil: XY[], t: number) {
  const n: XY = [Math.cos(dir), Math.sin(dir)], u: XY = [-n[1], n[0]] // u runs left→right seen from the front
  const P = ([s, h]: XY, o: number): V3 => [cx + u[0] * s + n[0] * o, cy + u[1] * s + n[1] * o, z0 + h]
  const tris = triangulate(sil)
  for (const [a, b, c] of tris) {
    p.tri(P(sil[a], t / 2), P(sil[b], t / 2), P(sil[c], t / 2))
    p.tri(P(sil[a], -t / 2), P(sil[c], -t / 2), P(sil[b], -t / 2))
  }
  for (let i = 0; i < sil.length; i++) {
    const a = sil[i], b = sil[(i + 1) % sil.length]
    p.quad(P(a, -t / 2), P(b, -t / 2), P(b, t / 2), P(a, t / 2))
  }
}

/** Mirror a half silhouette (right half, bottom to top) into a full counter-clockwise ring. */
const mirror = (half: XY[]): XY[] => [...half, ...[...half].reverse().map(([s, h]) => [-s, h] as XY)].filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1])

function build() {
  const brick = new Part(), granite = new Part(), win = new Part(), glass = new Part(), green = new Part(), roof = new Part()

  const X0 = -30.7, X1 = 31.2, Y0 = -54.0, Y1 = 53.6
  const BASE = 12, CORN = 44, SLOPE = 53, VAULT = 57.5
  const R = rect(X0, Y0, X1, Y1)

  walls(granite, R, 0, BASE)
  walls(brick, R, BASE, CORN - 0.2)
  // The heavy cornice: a green band projecting 1.4 m.
  const C = inset(R, -1.4)
  block(green, green, C, CORN - 2.4, CORN, 0.3)
  // Its underside, from the wall out to the lip.
  green.loft([inset(R, -0.05).map(([x, y]) => [x, y, CORN - 2.4] as V3), C.map(([x, y]) => [x, y, CORN - 2.4] as V3)])

  // Glass slope round the roof, then the flat top and the vaults.
  const S0 = inset(R, 0.6), S1 = inset(R, 4.2)
  walls(glass, S0, CORN, SLOPE, S1)
  // Green ribs up the slope.
  for (let i = 0; i < 4; i++) {
    const a0 = S0[i], b0 = S0[(i + 1) % 4], a1 = S1[i], b1 = S1[(i + 1) % 4]
    const L = Math.hypot(b0[0] - a0[0], b0[1] - a0[1]), n = Math.round(L / 3.2)
    for (let k = 1; k < n; k++) {
      const t0 = (k - 0.12) / n, t1 = (k + 0.12) / n
      const at = (a: XY, b: XY, t: number, z: number, o: number): V3 => {
        const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
        return [a[0] + dx * t + (dy / l) * o, a[1] + dy * t - (dx / l) * o, z]
      }
      green.quad(at(a0, b0, t0, CORN, 0.08), at(a0, b0, t1, CORN, 0.08), at(a1, b1, t1, SLOPE, 0.08), at(a1, b1, t0, SLOPE, 0.08))
    }
  }
  cap(roof, S1, SLOPE)

  // North-south vault (two arms) and the glazed crossing.
  const VX0 = -11.6, VX1 = 12.0, VC = (VX0 + VX1) / 2, CR = 16
  const seg = 8
  const arc = Array.from({ length: seg + 1 }, (_, i) => {
    const t = Math.PI * (i / seg)
    return [VC - Math.cos(t) * (VX1 - VX0) / 2, SLOPE + Math.sin(t) * (VAULT - SLOPE)] as XY
  })
  for (const [ya, yb] of [[S1[0][1], -CR], [CR, S1[2][1]]]) {
    for (let i = 0; i < seg; i++) {
      const [x0, z0] = arc[i], [x1, z1] = arc[i + 1]
      roof.quad([x0, ya, z0], [x1, ya, z1], [x1, yb, z1], [x0, yb, z0])
    }
    // Arched ends, the outer ones facing out over the north and south sides.
    for (const [y, s] of [[ya, -1], [yb, 1]] as [number, number][]) {
      for (let i = 0; i < seg; i++) {
        const [x0, z0] = arc[i], [x1, z1] = arc[i + 1], c: V3 = [VC, y, SLOPE]
        if (s < 0) green.tri(c, [x1, y, z1], [x0, y, z0])
        else green.tri(c, [x0, y, z0], [x1, y, z1])
      }
    }
  }
  {
    const apex: V3 = [VC, 0, 63]
    const sq = rect(VC - CR, -CR, VC + CR, CR)
    for (let i = 0; i < 4; i++) {
      const a = sq[i], b = sq[(i + 1) % 4]
      glass.tri([a[0], a[1], SLOPE], [b[0], b[1], SLOPE], apex)
    }
  }

  // Windows. Arched five-storey windows on the north, east and south; the
  // granite base's arched entrances and its row of small round-headed windows.
  const faces: { a: XY; b: XY; n: number }[] = [
    { a: [X0, Y0], b: [X1, Y0], n: 3 }, // south, Congress
    { a: [X1, Y0], b: [X1, Y1], n: 5 }, // east, State
    { a: [X1, Y1], b: [X0, Y1], n: 3 }, // north, Van Buren
  ]
  for (const { a, b, n } of faces) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), pitch = L / n
    for (let k = 0; k < n; k++) {
      const s = pitch * (k + 0.5)
      // The arch's brick reveal reads as a darker ring: a wider arch in
      // granite tone behind the window.
      archPanel(granite, a, b, s - 4.4, s + 4.4, BASE + 0.4, 36.5, 0.04, 10)
      archPanel(win, a, b, s - 3.2, s + 3.2, BASE + 0.6, 36.5, 0.08, 10)
      archPanel(win, a, b, s - 2.2, s + 2.2, 0.3, 5.2, 0.06, 8)
    }
    wallBays(win, a, b, [[7.2, 10.4]], { pitch: L / (n * 4), w: 1.2, end: 2, arch: true })
  }
  // West wall on Plymouth Court: a glass curtain over the granite base.
  panel(win, [X0, Y1], [X0, Y0], 2.5, Y1 - Y0 - 2.5, BASE + 0.5, CORN - 3, 0.08)

  // Acroteria: each a flat, upright palmette fan, thin in depth, facing out
  // from the face it crowns: narrow at the foot, opening to a broad crest
  // whose edges curl outward and down in scrolls, with a pointed tip. The
  // corner ones face out on the diagonal and carry an owl block at the foot.
  const fan = mirror([
    [0, 0], [1.6, 0], [1.8, 2.4], [3.4, 5.2], [5.2, 8.0], [6.6, 10.0],
    // the scroll: out, up, over and curling back down
    [7.8, 10.6], [8.4, 12.0], [8.0, 13.4], [6.9, 13.9], [6.0, 13.3], [6.1, 12.3], [6.9, 12.2],
    [5.6, 12.9], [4.6, 14.6], [3.0, 16.6], [1.4, 18.2], [0, 19.4],
  ])
  const T = 0.9
  const corners: [number, number, number][] = [[X1 - 4.6, Y1 - 4.6, Math.PI / 4], [X0 + 4.6, Y1 - 4.6, (3 * Math.PI) / 4], [X0 + 4.6, Y0 + 4.6, (5 * Math.PI) / 4], [X1 - 4.6, Y0 + 4.6, -Math.PI / 4]]
  for (const [x, y, d] of corners) {
    plume(green, x, y, CORN - 0.5, d, fan, T)
    // The owl: a stout body and a head block standing in front of the fan's foot.
    const o = (s: number, t: number): XY => [x + Math.cos(d) * t - Math.sin(d) * s, y + Math.sin(d) * t + Math.cos(d) * s]
    block(green, green, [o(-1.5, 0.5), o(1.5, 0.5), o(1.5, 2.9), o(-1.5, 2.9)].reverse(), CORN, CORN + 5.2, 0.5)
    block(green, green, [o(-1.2, 0.8), o(1.2, 0.8), o(1.2, 2.6), o(-1.2, 2.6)].reverse(), CORN + 5.2, CORN + 7.4, 0.5)
  }
  // State Street centre (east) and the Van Buren and Congress centres.
  plume(green, X1 - 2.2, 0, CORN - 0.5, 0, fan.map(([s, h]) => [s * 1.05, h * 1.05] as XY), T)
  for (const [y, d] of [[Y1 - 2.2, Math.PI / 2], [Y0 + 2.2, -Math.PI / 2]] as [number, number][]) {
    plume(green, VC, y, CORN - 0.5, d, fan.map(([s, h]) => [s * 1.1, h * 0.92] as XY), T)
  }
  // Green mullions on the west curtain wall.
  {
    const L = Y1 - Y0
    for (let s = 2.5; s <= L - 2.5 + 0.01; s += (L - 5) / 18) panel(green, [X0, Y1], [X0, Y0], s - 0.25, s + 0.25, BASE + 0.5, CORN - 3, 0.12)
    for (const z of [20, 28, 36]) panel(green, [X0, Y1], [X0, Y0], 2.5, L - 2.5, z, z + 0.5, 0.12)
  }

  return [
    { part: brick, material: finish('hwlc-brick', 0xc27c69) },
    { part: granite, material: finish('hwlc-granite', 0xd8b4a5) },
    { part: win, material: PALETTE.window },
    // The roof glass reads a dark green-blue in every photo; still `glass`
    // (structural glazing, unlit at night), darkened to match.
    { part: glass, material: { ...PALETTE.glass, color: 0x6f8f98 } },
    { part: green, material: PALETTE.patina },
    { part: roof, material: PALETTE.roof },
  ]
}

if (import.meta.main) await save('chi-harold-washington-library', 'Harold Washington Library Center', [41.8763227, -87.6282122], 359.1, build())
