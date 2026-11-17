/**
 * Nancy Lee and Perry R. Bass Performance Hall (1998, David M. Schwarz
 * Architectural Services), 525 Commerce Street, Fort Worth: procedural,
 * CC0-1.0.  bun generators/dal-bass-performance-hall.ts
 *
 * Map frame: x east, y north, z up, metres, turned to the placement's
 * bearing 330 (the block's walls run at 60.4 and 150.4 deg), so +y is the
 * Grand Facade with the angels (on the 4th Street end, facing 330 deg) and
 * the two chamfered corners of OSM way/483466355 hold the domed entrance
 * rotundas. Origin: the centroid of way/483466355. z = 0 is the lowest ground
 * under the footprint (the south-east corner); the ground rises 1.9-2.9 m to the
 * north front, so the facade detail starts at z 2.4.
 *
 * Identity, in order: the two 48 ft limestone angels with brass trumpets by
 * Marton Varo, high on the ends of the Grand Facade, drawn as bold relief
 * figures: a scalloped fan of wings, the robed body, the head, a raised arm
 * and the trumpet held straight out from the wall; the pale limestone; the
 * two corner rotundas with their two-tier grey metal domes (a wide lower
 * dome, a windowed drum and a small upper dome); the four tall arched windows
 * over the balcony between the angels and the open crown along the top; the
 * big plain stage house and hall behind.
 *
 * Measured, USGS lidar TX_Pecos_Dallas_B3_2018 (2018 flight; the hall opened
 * 1998), heights over z = 0:
 * - plan: main block x +-17.3 the full depth, y -31..30.5; side blocks to
 *   x +-30.2 from y -6 to 17; back wings beside the stage, y -31..-6; the
 *   rotundas centred near (+-20.5, 20.5), the lower dome ring 9 m in radius
 *   (it fills OSM's chamfered corners, which are 8.8 m from that centre);
 * - heights: Grand Facade crown 28.7, front block roof 30.0, the hall's slate
 *   hip to 33.7, stage house 32.3, side blocks 27.6, back wings 12.1, the
 *   rotundas' lower dome ring 13.6; the angels' wings to about 23 and their
 *   trumpets 5-6 m out from the wall at 18.5-20 (both trumpets show in the
 *   point cloud, at x +-12 to 13).
 * OSM tags height=80 and 8 levels; the lidar's highest roof is 33.7 m, so the
 *   tag is not used.
 * Published: angels 48 ft (14.6 m) tall, carved in Texas limestone by Marton
 *   Varo (Wikipedia; Bass Hall).
 * Estimated from the photos: the rotunda's drum and upper dome (16.8-21.5,
 *   from Barera's view, scaled on the lidar ring), the facade's openings, the
 *   balcony at 8.4-9.2, the arched windows 9.4-18.0, the crown's openings.
 * The angel figures are traced from Andrewnward's frontal close-up ("Statue
 *   on the outside of the Bass Performance Hall at sunset") for the outline
 *   of wings, robe, head and raised arm, and from Loadmaster's side view for
 *   the depth of the robe and the horizontal trumpet arm; mirrored for the
 *   second angel, whose trumpet the lidar shows turned a little outward.
 * Colours: limestone (#c1c1c0 lit, #9c958a in shade) drawn a pale cream
 *   #e4d9c6, the angels brighter (#fff6e8) so the relief reads at phone size;
 *   the flat roofs pale as in NAIP; the
 *   domes silver grey by day (#b2b1ad lit, #565a5c / #222223 against the
 *   light) drawn mid grey; the hall roof grey slate; brass trumpets.
 * Night: the stone floodlit (Phlyr's night photo: the angels and facade are
 *   lit from below), the windows and the rotunda drums lit, lights on the
 *   crown.
 * Left out: lettering on the frieze, the balcony railings, the entrance
 *   canopies' glazing and lamp posts, the carved panels under the angels.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Fort Worth June 2016 49 (Bass Performance Hall).jpg" and "... 55 ...",
 *   Michael Barera, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Fort_Worth_June_2016_49_(Bass_Performance_Hall).jpg
 * - "Statue on the outside of the Bass Performance Hall at sunset.jpg" and
 *   "View of Bass Performance Hall at sunset.jpg", Andrewnward, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Statue_on_the_outside_of_the_Bass_Performance_Hall_at_sunset.jpg
 *   https://commons.wikimedia.org/wiki/File:View_of_Bass_Performance_Hall_at_sunset.jpg
 * - "Bass-Hall-Ft-Worth-5389.jpg", Loadmaster (David R. Tribble), CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Bass-Hall-Ft-Worth-5389.jpg
 * - "Basshall.JPG", Phlyr at English Wikipedia, CC BY-SA 3.0 (night)
 *   https://commons.wikimedia.org/wiki/File:Basshall.JPG
 * - "Bass Performance Hall.jpg", Todd Porter, CC BY-SA 2.0 (from above, the
 *   roofs) https://commons.wikimedia.org/wiki/File:Bass_Performance_Hall.jpg
 * Also USGS NAIP (public domain) for the plan and roofs. No look-only
 * sources. No commercial imagery.
 *
 * Doubts: the angels are simplified to slabs and the second one is a mirror
 * (the real pair differ in pose); the back (south) and the side blocks' outer
 * faces are drawn from Porter's and Barera's distant views only; the upper
 * domes returned few lidar points.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archPanel, cap, lathe, panel, rect, save, triangulate, walls, type XY } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.7547781, -97.3297758]
const BEARING = 330

const MX = 17.3, SX = 30.2, YF = 30.5, YB = -31
const G = 2.4 // ground at the Grand Facade (lidar 1.9, the map draws 2.4-2.9)
const ANGEL_X = 13.2, ANGEL_Z = 8.4

/** A planar polygon, fanned, wound to face `hint`. */
function poly(p: Part, pts: V3[], hint: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}
function box(p: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, top = true) {
  walls(p, rect(x0, y0, x1, y1), z0, z1)
  if (top) cap(p, rect(x0, y0, x1, y1), z1)
}
/** A box with a bevelled top edge. */
function bbox(p: Part, top: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, b = 0.4) {
  walls(p, rect(x0, y0, x1, y1), z0, z1 - b)
  walls(p, rect(x0, y0, x1, y1), z1 - b, z1, rect(x0 + b, y0 + b, x1 - b, y1 - b))
  cap(top, rect(x0 + b, y0 + b, x1 - b, y1 - b), z1)
}

/**
 * A relief slab on the Grand Facade: a (u, v) outline (u across, v up from
 * the angel's base) extruded from d0 to d1 out of the wall. `su` mirrors u.
 */
function relief(p: Part, outline: XY[], d0: number, d1: number, cx: number, su: number) {
  const area = outline.reduce((s, a, i) => { const b = outline[(i + 1) % outline.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const ring = area < 0 ? [...outline].reverse() : outline
  const P = ([u, v]: XY, d: number): V3 => [cx + su * u, YF + d, ANGEL_Z + v]
  for (const [a, b, c] of triangulate(ring)) poly(p, [P(ring[a], d1), P(ring[b], d1), P(ring[c], d1)], [0, 1, 0])
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const nu = b[1] - a[1], nv = -(b[0] - a[0]) // outward for a CCW ring
    poly(p, [P(a, d0), P(b, d0), P(b, d1), P(a, d1)], [su * nu, 0, nv])
  }
}

/** A round bar from a to b, `r` thick, `n` sides (for arms and trumpets). */
function bar(p: Part, a: V3, b: V3, r0: number, r1: number, n = 6) {
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const L = Math.hypot(...d), w: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const t: V3 = Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const u0: V3 = [w[1] * t[2] - w[2] * t[1], w[2] * t[0] - w[0] * t[2], w[0] * t[1] - w[1] * t[0]]
  const lu = Math.hypot(...u0), u: V3 = [u0[0] / lu, u0[1] / lu, u0[2] / lu]
  const v: V3 = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]]
  const ring = (c: V3, r: number) => Array.from({ length: n }, (_, k) => {
    const t = (k / n) * 2 * Math.PI
    return [c[0] + r * (Math.cos(t) * u[0] + Math.sin(t) * v[0]), c[1] + r * (Math.cos(t) * u[1] + Math.sin(t) * v[1]), c[2] + r * (Math.cos(t) * u[2] + Math.sin(t) * v[2])] as V3
  })
  const A = ring(a, r0), B = ring(b, r1)
  for (let k = 0; k < n; k++) {
    const j = (k + 1) % n
    const mid: V3 = [(A[k][0] + A[j][0]) / 2 - a[0], (A[k][1] + A[j][1]) / 2 - a[1], (A[k][2] + A[j][2]) / 2 - a[2]]
    poly(p, [A[k], A[j], B[j], B[k]], mid)
  }
  poly(p, B, w)
  poly(p, A, [-w[0], -w[1], -w[2]])
}

/** One angel, centred at x = cx on the Grand Facade; su = +1 or -1 mirrors it. */
function angel(fig: Part, brass: Part, stone: Part, cx: number, su: number) {
  // Pedestal and corbel under her feet.
  relief(stone, [[-3.3, -1.3], [3.9, -1.3], [3.9, 0], [-3.3, 0]], 0, 2.6, cx, su)
  relief(stone, [[-2.6, -2.6], [3.2, -2.6], [3.6, -1.3], [-3.0, -1.3]], 0, 1.6, cx, su)
  // The wings: a scalloped fan behind her shoulders, split at the top.
  const fan: XY[] = [[0.2, 8.4]]
  const tips = 15
  for (let k = 0; k <= tips; k++) {
    const t = -0.42 + (k / tips) * (Math.PI + 0.84) // from lower right round to lower left
    if (k === Math.round(tips / 2)) { fan.push([0.0, 12.9]); continue } // the cleft between the wings
    const rx = 3.7, ry = 5.0
    fan.push([0.0 + rx * Math.cos(t), 9.4 + ry * Math.sin(t)])
    if (k < tips) {
      const tm = t + (Math.PI + 0.84) / tips / 2
      fan.push([0.0 + (rx - 0.55) * Math.cos(tm), 9.4 + (ry - 0.55) * Math.sin(tm)])
    }
  }
  relief(fig, fan, 0, 1.2, cx, su)
  // The robe: shoulders to the flaring hem, drapery swept to one side.
  const robe: XY[] = [[-2.5, 0.0], [1.4, 0.0], [3.9, 0.5], [3.6, 1.3], [2.0, 2.4], [1.6, 4.5], [1.3, 7.0], [1.6, 8.6], [1.4, 9.7], [0.5, 10.1], [-0.9, 10.1], [-1.7, 9.6], [-1.6, 8.0], [-1.7, 5.5], [-2.0, 3.0], [-2.9, 0.9]]
  relief(fig, robe, 0, 2.2, cx, su)
  // A second, narrower layer for the body's front, so the figure has depth.
  relief(fig, [[-1.3, 0.6], [1.2, 0.6], [1.0, 5.0], [0.9, 8.6], [-0.8, 9.6], [-1.2, 6.0]], 2.2, 2.9, cx, su)
  // Head and the hair behind it.
  const P = (u: number, v: number, d: number): V3 => [cx + su * u, YF + d, ANGEL_Z + v]
  const h = P(-0.35, 10.85, 1.5)
  lathe(fig, h[0], h[1], [[0, h[2] - 0.8], [0.55, h[2] - 0.6], [0.75, h[2]], [0.6, h[2] + 0.55], [0, h[2] + 0.85]], 8)
  // The raised arm, up and out to the side.
  bar(fig, P(-1.4, 9.4, 1.0), P(-2.7, 12.5, 0.9), 0.42, 0.32)
  // The trumpet arm, straight out from the shoulder to the mouthpiece.
  bar(fig, P(1.1, 9.6, 1.3), P(0.4, 10.3, 3.6), 0.5, 0.36)
  // The trumpet: a long brass tube with a flared bell, held level and turned
  // a little outward (lidar: tips 5.5 m out at about 18.5-20 m).
  const m = P(-0.2, 10.55, 2.1), e = P(-0.6, 10.9, 6.3), bell = P(-0.65, 10.95, 6.8)
  bar(brass, m, e, 0.22, 0.28, 6)
  bar(brass, e, bell, 0.3, 0.8, 8)
}

function build() {
  const stone = new Part(), fig = new Part(), win = new Part(), metal = new Part(), roof = new Part(), brass = new Part()

  // --- Blocks -------------------------------------------------------------------
  // Main block: the front (Grand Facade) block, the hall under its slate hip,
  // the stage house behind.
  bbox(stone, stone, -MX, 14, MX, YF, 0, 30.0, 0.3)
  walls(stone, rect(-MX, -12, MX, 14.2), 0, 30.0)
  walls(roof, rect(-MX, -12, MX, 14.2), 30.0, 33.7, rect(-12, -8, 12, 10))
  cap(roof, rect(-12, -8, 12, 10), 33.7)
  bbox(stone, stone, -MX, YB, MX, -11.8, 0, 32.3, 0.4)
  for (const s of [-1, 1]) {
    const [a, b] = s > 0 ? [MX, SX] : [-SX, -MX]
    bbox(stone, stone, a, -6, b, 17, 0, 27.6, 0.3) // side blocks
    bbox(stone, stone, a, YB, b, -5.8, 0, 12.1, 0.3) // back wings
  }

  // --- Grand Facade ----------------------------------------------------------
  // End piers carrying the angels stand a little proud; the crown along the top.
  for (const s of [-1, 1]) {
    const [a, b] = s > 0 ? [9.3, MX] : [-MX, -9.3]
    bbox(stone, stone, a, YF - 0.5, b, YF + 0.4, 0, 29.4, 0.3)
  }
  // Ground floor openings, balcony, the four tall arched windows.
  const front: [XY, XY] = [[MX, YF], [-MX, YF]] // wall a->b faces +y
  for (const x of [-7.2, -3.6, 0, 3.6, 7.2]) panel(win, front[0], front[1], MX - x - 1.1, MX - x + 1.1, G + 0.6, 7.6, 0.05)
  box(stone, -9.3, YF, 9.3, YF + 1.1, 8.4, 9.2)
  cap(stone, rect(-9.3, YF, 9.3, YF + 1.1), 8.4, false)
  for (const x of [-5.85, -1.95, 1.95, 5.85]) archPanel(win, front[0], front[1], MX - x - 1.25, MX - x + 1.25, 9.4, 16.75, 0.05, 10)
  // cornice over the arches, frieze, a row of small windows
  box(stone, -9.3, YF, 9.3, YF + 0.45, 19.2, 19.9)
  cap(stone, rect(-9.3, YF, 9.3, YF + 0.45), 19.2, false)
  for (const x of [-7.4, -4.4, -1.5, 1.5, 4.4, 7.4]) panel(win, front[0], front[1], MX - x - 0.55, MX - x + 0.55, 22.0, 23.4, 0.05)
  // The crown: piers and open bays with lanterns, lit at night.
  box(stone, -9.3, YF, 9.3, YF + 0.4, 24.6, 25.2)
  for (let k = 0; k < 8; k++) {
    const x = -8.1 + k * (16.2 / 7)
    if (k < 7) panel(win, front[0], front[1], MX - (x + 16.2 / 7 - 0.4), MX - (x + 0.4), 25.6, 28.0, 0.05)
    bbox(stone, stone, x - 0.4, YF - 0.1, x + 0.4, YF + 0.5, 25.2, 28.8, 0.15)
    box(fig, x - 0.25, YF + 0.05, x + 0.25, YF + 0.45, 28.8, 29.4) // lantern
  }
  box(stone, -9.3, YF - 0.1, 9.3, YF + 0.5, 28.0, 28.7)

  // The angels: the one at +x is Andrewnward's (drapery towards the arches).
  angel(fig, brass, stone, ANGEL_X, -1)
  angel(fig, brass, stone, -ANGEL_X, 1)

  // --- Rotundas -----------------------------------------------------------------
  for (const s of [-1, 1]) {
    const cx = s * 20.5, cy = 20.5
    lathe(stone, cx, cy, [[9.0, 0], [9.0, 12.8], [9.35, 12.8], [9.35, 13.6]], 16)
    lathe(metal, cx, cy, [[9.35, 13.6], [9.0, 14.5], [8.2, 15.5], [7.0, 16.3], [5.4, 16.8]], 16)
    lathe(stone, cx, cy, [[5.0, 16.6], [5.0, 18.4], [5.2, 18.4], [5.2, 18.8]], 16)
    lathe(metal, cx, cy, [[5.2, 18.8], [5.0, 19.7], [4.3, 20.5], [3.0, 21.2], [1.5, 21.5], [0, 21.6]], 16)
    // windows round the rotunda: the drum's clerestory, the big first-floor
    // windows and the ground-floor entrances, on the facets facing out.
    const dir = Math.atan2(1, s) // outward along the corner diagonal
    for (let k = -3; k <= 3; k++) {
      const t = dir + k * (Math.PI / 8)
      const ox = Math.cos(t), oy = Math.sin(t)
      // only facets clear of the blocks
      const P = (r: number, z: number, dt: number): V3 => [cx + r * Math.cos(t + dt), cy + r * Math.sin(t + dt), z]
      const hw = (Math.PI / 8) * 0.3
      if (Math.abs(k) <= 3) poly(win, [P(5.06, 17.0, -hw * 1.6), P(5.06, 17.0, hw * 1.6), P(5.06, 18.1, hw * 1.6), P(5.06, 18.1, -hw * 1.6)], [ox, oy, 0])
      if (Math.abs(k) <= 2) {
        poly(win, [P(9.06, 7.6, -hw), P(9.06, 7.6, hw), P(9.06, 11.6, hw), P(9.06, 11.6, -hw)], [ox, oy, 0])
        poly(win, [P(9.06, G + 0.4, -hw), P(9.06, G + 0.4, hw), P(9.06, 5.8, hw), P(9.06, 5.8, -hw)], [ox, oy, 0])
      }
    }
    // Entrance canopy on the corner.
    const ex = cx + 9.0 * Math.cos(dir), ey = cy + 9.0 * Math.sin(dir)
    const tx = -Math.sin(dir), ty = Math.cos(dir), nx = Math.cos(dir), ny = Math.sin(dir)
    const C = (a: number, b: number, z: number): V3 => [ex + tx * a + nx * b, ey + ty * a + ny * b, z]
    const can: V3[] = [C(-3.6, 0, 6.0), C(3.6, 0, 6.0), C(3.6, 2.2, 6.0), C(-3.6, 2.2, 6.0)]
    poly(metal, can, [0, 0, 1])
    poly(metal, can.map((p) => [p[0], p[1], 5.6] as V3), [0, 0, -1])
    poly(metal, [C(-3.6, 2.2, 5.6), C(3.6, 2.2, 5.6), C(3.6, 2.2, 6.0), C(-3.6, 2.2, 6.0)], [nx, ny, 0])
  }

  // --- Side and back windows ---------------------------------------------------------
  const col = (a: XY, b: XY, s: number, rows: [number, number][], w: number, arch = false) =>
    rows.forEach(([z0, z1]) => (arch ? archPanel(win, a, b, s - w / 2, s + w / 2, z0, z1 - w / 2, 0.05, 8) : panel(win, a, b, s - w / 2, s + w / 2, z0, z1, 0.05)))
  for (const s of [-1, 1]) {
    // side blocks' outer faces: columns of windows and a row of oculi
    const x = s * SX
    const [a, b]: XY[] = s > 0 ? [[x, -6], [x, 17]] : [[x, 17], [x, -6]]
    for (const t of [4.0, 11.5, 19.0]) col(a, b, t, [[2.4, 5.0], [7.2, 9.8], [12.4, 15.0], [17.6, 20.2]], 1.6)
    for (const t of [9.0, 11.5, 14.0]) {
      const { P } = { P: (u: number, z: number): V3 => (s > 0 ? [x + 0.06, -6 + u, z] : [x - 0.06, 17 - u, z]) }
      const pts: V3[] = Array.from({ length: 10 }, (_, k) => { const q = (k / 10) * 2 * Math.PI; return P(t + 0.55 * Math.cos(q), 23.6 + 0.55 * Math.sin(q)) })
      poly(win, pts, [s, 0, 0])
    }
    // side blocks' fronts beside the rotunda (y 17) above its dome
    // back wings' outer faces
    const [c, d]: XY[] = s > 0 ? [[x, YB], [x, -5.8]] : [[x, -5.8], [x, YB]]
    for (let t = 2.5; t < 24; t += 3.2) col(c, d, t, [[1.6, 3.8], [5.0, 7.2], [8.4, 10.6]], 1.4)
    // the main block's sides above the side blocks and wings
    const mx = s * MX
    const [e, f]: XY[] = s > 0 ? [[mx, -12], [mx, 14]] : [[mx, 14], [mx, -12]]
    for (let t = 3; t < 26; t += 4.4) col(e, f, t, [[28.0, 29.4]], 1.6)
  }
  // the stage house's back: a few tall panels
  for (const xx of [-12, -4, 4, 12]) panel(win, [-MX, YB], [MX, YB], MX + xx - 0.8, MX + xx + 0.8, 14.0, 17.0, 0.05)

  const lit = (p: V3, n: V3) => (Math.abs(n[2]) > 0.7 ? 0.05 : Math.max(0.2, 0.75 - 0.012 * p[2]))
  const front_lit = (p: V3, n: V3) => (p[1] > 28 ? 0.9 - 0.01 * p[2] : lit(p, n))
  return [
    { part: stone, material: { ...finish('bass-limestone', 0xe4d9c6), floodlight: front_lit } },
    { part: fig, material: { ...finish('bass-angel', 0xfff6e8), floodlight: () => 0.95 } },
    { part: win, material: PALETTE.window },
    { part: metal, material: finish('bass-dome-metal', 0x8b9194) },
    { part: roof, material: PALETTE.roof },
    { part: brass, material: finish('bass-brass', 0xc6a24e, 0.4) },
  ]
}

if (import.meta.main) await save('dal-bass-performance-hall', 'Bass Performance Hall', ANCHOR, BEARING, build(), 6500)
