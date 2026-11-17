/**
 * Myeongdong Cathedral (명동대성당, Cathedral Church of the Virgin Mary of
 * the Immaculate Conception), Seoul, 1898 (Eugène Coste): procedural,
 * CC0-1.0.
 * bun generators/seoul-myeongdong-cathedral.ts
 *
 * Frame: bearing 150, the church's axis: model -y points to compass 330,
 * where the tower and the west front stand; +y runs down the nave to the
 * apse; +x is compass 240 (the side with the tower's stair turret). Origin
 * at the area centroid of the OSM outline (way/210335697). y = 0 is the
 * forecourt in front of the tower. Elevation 0. Terrain could not be
 * checked (no z15 tiles over Seoul); the cathedral stands on the levelled
 * top of Myeongdong hill and its walls run down to the forecourt level.
 *
 * OSM: way/210335697 (building=cathedral, height 23: the nave ridge), the
 * whole plan: nave and aisles 30.6 m across, 33 m from the front to the
 * apse's springing, the apse a half-circle of 15.3 m radius; the tower
 * way/1139745172 (height 47; used for the plan, see below), 11 m square.
 * Published: the spire 45 m, the nave 23 m high, 69 m long and 28 m wide
 * (Wikipedia, "Myeongdong Cathedral"; Korean Historic Site 258).
 *
 * From the photos, scaled to the 45 m spire and the 23 m ridge:
 * - a basilica: aisle walls 9.5 m with lean-to roofs up to 13 m against the
 *   clerestory, clerestory walls to 17.5 m, the nave roof steep to 23 m;
 *   ten bays of 3.3 m from the tower to the apse (c13, from above);
 * - transepts as high as the nave, flush with the aisle walls (none in the
 *   OSM outline), two bays wide, three bays from the apse, each gable end
 *   with a rose over twin lancets between pinnacled buttresses (c13, c10);
 * - small gablets on the aisle roofs over every other bay (c13);
 * - the apse: a lower ambulatory round a higher polygonal apse (c13);
 * - the tower: grey brick corner buttresses stepping in twice, red brick
 *   between, the portal under a gabled hood, a tall twin lancet with a
 *   roundel, the clock, the belfry's twin louvred lancets, then four
 *   corner pinnacles, four gabled dormers and the green octagonal spire
 *   (c1); its round stair turret with a conical cap on the +x side (c1);
 * - red brick walls with grey brick buttresses, quoins and bands; green
 *   copper roofs and spire (c1, c13).
 * Estimated: every height but the ridge and the spire, the bay and window
 * sizes, the tower's stages (27.5 m to the belfry cornice), the turret.
 * Also drawn: the gablets on the aisle roofs, the pinnacled buttresses, the
 * pierced parapet of the tower's crown, the lucarnes on the spire; in 3D
 * stone bars, the transept window's pointed frame, mullion and rose ring
 * and the belfry openings' jambs, mullions, hoods and louvres; crockets on
 * the larger pinnacles (c1, c10, c12, c13).
 * Colour: the brick sampled from c1 and c13 (about #8a6659 in overcast
 * light), pulled up to the palette's lightness as #9c6656.
 * Left out: the crosses on the pinnacles, the side porches, the brick
 * tracery and the stained glass.
 *
 * Night: the brick and grey brick are floodlit from below, most strongly
 * on the front and the tower, and the spire is lit (_FLOODLIGHT, c14);
 * windows are `window`, the clock face `entrance`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - c1 "Myeongdong Cathedral front.jpg", Tristan Surtel, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Myeongdong_Cathedral_front.jpg
 * - c13 "Myeongdong Cathedral 01 (cropped).jpg", Asacyan, CC BY-SA 4.0 (from above, south-west side)
 *   https://commons.wikimedia.org/wiki/File:Myeongdong_Cathedral_01_(cropped).jpg
 * - c12 "Korea Myeongdong Cathedral 08.jpg", korea.net, CC BY-SA 2.0 (front three-quarter)
 *   https://commons.wikimedia.org/wiki/File:Korea_Myeongdong_Cathedral_08.jpg
 * - c10 "Korea Myeongdong Cathedral 02.jpg", korea.net, CC BY-SA 2.0 (transept gable)
 *   https://commons.wikimedia.org/wiki/File:Korea_Myeongdong_Cathedral_02.jpg
 * - c7 "Myeongdong Cathedral 6.jpg", kallerna, CC BY-SA 4.0 (distant, from the north-west)
 *   https://commons.wikimedia.org/wiki/File:Myeongdong_Cathedral_6.jpg
 * - c14 "Myeongdong Cathedral at night 20231223.jpg", Nat4Eben, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Myeongdong_Cathedral_at_night_20231223.jpg
 * No look-only references used.
 * Doubts: no licensed photo of the apse end or the north-east side; the
 * apse is drawn from the OSM plan and the one oblique view from above. The
 * transepts are inferred from c13 and c10 although OSM maps none.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { abox, disc, pediment, save, type P2 } from './seoul-city-hall'
import { beam, face, flat, flatTri, lathe } from './seoul-n-seoul-tower'
import { box as kbox } from './seoul-geunjeongjeon'

const brick = new Part(), grey = new Part(), roof = new Part(), win = new Part(), lit = new Part()

const AX = -0.2 // the axis
const XO = 15.3, XN = 6.8 // outer aisle wall, clerestory wall (half-widths)
const YF = -20.4, BAY = 3.3 // front wall, bay
const T0 = YF + 9 * BAY, T1 = T0 + 3 * BAY // the transept
const YA = 16 // the centre of the apse's curves
const RA = 12.2 // the ambulatory's radius (OSM: the apse reaches y = 28.2)
const ZA = 8.5, ZL = 12.8, ZC = 17.6, ZR = 23

/** A pointed (lancet) window panel on a wall facing n (axis-aligned), centre u along the wall. */
function lancet(p: Part, n: V3, at: number, u: number, w: number, z0: number, zs: number) {
  const h = w / 2
  const P = (du: number, z: number): V3 => (n[0] !== 0 ? [at + n[0] * 0.07, u + du, z] : [u + du, at + n[1] * 0.07, z])
  flat(p, [P(-h, z0), P(h, z0), P(h, zs), P(-h, zs)], n)
  flatTri(p, P(-h, zs), P(h, zs), P(0, zs + w * 0.85), n)
}

/** Half a surface of revolution about (cx, cy), on the +y side: profile [r, z]. */
function halfLathe(p: Part, cx: number, cy: number, profile: P2[], k = 8) {
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * Math.PI, a1 = ((s + 1) / k) * Math.PI, am = (a0 + a1) / 2
      const P = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
      const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez)
      const nr = ez / l, nz = -er / l
      const n: V3 = [nr * Math.cos(am), nr * Math.sin(am), nz]
      if (r1 === 0) flatTri(p, P(r0, a0, z0), P(r0, a1, z0), P(0, a0, z1), n)
      else face(p, [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)], [n, n, n, n])
    }
  }
}

/** A square pinnacle: shaft and pyramid. */
function pinnacle(x: number, y: number, z0: number, z1: number, w: number, top: number, crockets = false) {
  abox(grey, x - w / 2, x + w / 2, y - w / 2, y + w / 2, z0, z1, null)
  lathe([x, y], [[w / 2 * Math.SQRT2, z1], [0, z1 + top]], () => roof, 4, 10, Math.PI / 4)
  if (!crockets) return
  // crockets: small knobs up each arris of the pyramid, and a knob at the tip
  const k = 0.17
  for (const t of [0.28, 0.58]) for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const h = (w / 2) * (1 - t) + 0.08, cx = x + sx * h, cy = y + sy * h, cz = z1 + top * t
    kbox(roof, cx - k, cy - k, cz - k, cx + k, cy + k, cz + k, 'b', true)
  }
  kbox(roof, x - 0.2, y - 0.2, z1 + top - 0.05, x + 0.2, y + 0.2, z1 + top + 0.35, 'b', true)
}

/** Stone tracery: 3D bars along polylines drawn in a wall's plane; P maps (u along the wall, z) to 3D. */
function tracery(P: (u: number, z: number) => V3, lines: [number, number][][], w: number) {
  for (const line of lines) for (let i = 0; i < line.length - 1; i++) beam(grey, P(...line[i]), P(...line[i + 1]), w)
}
/** A pointed (equilateral) arch's outline from the left springing to the right, centre u, half-width h, springing z. */
function pointedArch(u: number, h: number, z: number, n = 6): [number, number][] {
  const r = 2 * h, pts: [number, number][] = []
  for (let i = 0; i <= n; i++) { const a = Math.PI - (i / n) * (Math.PI / 3); pts.push([u + h + r * Math.cos(a), z + r * Math.sin(a)]) }
  for (let i = 1; i <= n; i++) { const a = Math.PI / 3 - (i / n) * (Math.PI / 3); pts.push([u - h + r * Math.cos(a), z + r * Math.sin(a)]) }
  return pts
}
const circle = (u: number, z: number, r: number, n = 12): [number, number][] => Array.from({ length: n + 1 }, (_, i) => [u + r * Math.cos((i / n) * 2 * Math.PI), z + r * Math.sin((i / n) * 2 * Math.PI)])

function build() {
  const X = (d: number) => AX + d
  const mirror = (f: (s: 1 | -1) => void) => { f(1); f(-1) }

  // ---- aisles: walls, lean-to roofs, buttresses, windows, gablets
  mirror((s) => {
    const xo = X(s * XO), xn = X(s * XN)
    const [x0, x1] = s > 0 ? [xn, xo] : [xo, xn]
    abox(brick, x0, x1, YF, T0, 0, ZA, null)
    // lean-to roof from the outer eave up to the clerestory
    const e = s * 0.5
    flat(roof, [[xo + e, YF, ZA - 0.3], [xo + e, T0, ZA - 0.3], [xn, T0, ZL], [xn, YF, ZL]], [s * (ZL - ZA), 0, XO - XN])
    for (let k = 0; k < 9; k++) {
      const y = YF + k * BAY
      if (k > 0) {
        abox(grey, s > 0 ? xo : xo - 0.9, s > 0 ? xo + 0.9 : xo, y - 0.45, y + 0.45, 0, ZA + 0.6, null)
        lathe([xo + s * 0.45, y], [[0.64, ZA + 0.6], [0, ZA + 2.0]], () => grey, 4, 10, Math.PI / 4)
      }
      lancet(win, [s, 0, 0], xo, y + BAY / 2, 1.8, 2.0, 6.3)
    }
    // gablets over every other bay
    for (const k of [1, 3, 5, 7]) {
      const yc = YF + (k + 0.5) * BAY, gx = xo - s * 1.6
      // a small gable facing out: triangle front and two roof slopes, ridge running in
      const zb = ZA + (ZL - ZA) * (1.6 / (XO - XN)) - 0.2
      flatTri(brick, [gx, yc - 1.1, zb], [gx, yc + 1.1, zb], [gx, yc, zb + 1.6], [s, 0, 0])
      const xi = gx - s * 2.2
      flat(roof, [[gx + s * 0.2, yc - 1.25, zb - 0.1], [gx + s * 0.2, yc, zb + 1.75], [xi, yc, zb + 1.75], [xi, yc - 1.25, zb + 0.4]], [0, -1.6, 1.25])
      flat(roof, [[gx + s * 0.2, yc + 1.25, zb - 0.1], [xi, yc + 1.25, zb + 0.4], [xi, yc, zb + 1.75], [gx + s * 0.2, yc, zb + 1.75]], [0, 1.6, 1.25])
    }
  })
  // the nave's west wall below the clerestory, between the aisles (behind the tower)
  abox(brick, X(-XN), X(XN), YF, YF + 0.6, 0, ZA, null)
  // ---- clerestory and nave roof
  abox(brick, X(-XN), X(XN), YF, YA, ZA, ZC, null)
  abox(grey, X(-XN) - 0.25, X(XN) + 0.25, YF, YA, ZC - 0.5, ZC, null)
  mirror((s) => {
    for (let k = 0; k < 9; k++) {
      // paired lancets under a roundel, as in every clerestory bay
      const y = YF + (k + 0.5) * BAY
      for (const d of [-0.5, 0.5]) lancet(win, [s, 0, 0], X(s * XN), y + d, 0.8, ZL + 0.5, ZC - 2.6)
      disc(win, [X(s * XN) + s * 0.07, y, ZC - 1.25], [s, 0, 0], 0.42, 8)
      if (k > 0) abox(grey, s > 0 ? X(XN) : X(-XN) - 0.5, s > 0 ? X(XN) + 0.5 : X(-XN), y - BAY / 2 - 0.3, y - BAY / 2 + 0.3, ZL - 0.4, ZC - 0.5, null)
    }
  })
  pediment(brick, roof, X(-XN - 0.5), X(XN + 0.5), YF - 0.3, YA, ZC, ZR - ZC + 0.4)

  // ---- transepts: nave-high, gable ends flush with the aisle walls
  abox(brick, X(-XO), X(XO), T0, T1, 0, ZC, null)
  abox(grey, X(-XO) - 0.25, X(XO) + 0.25, T0 - 0.25, T1 + 0.25, ZC - 0.5, ZC, null)
  pediment(brick, roof, T0 - 0.4, T1 + 0.4, X(-XO) - 0.3, X(XO) + 0.3, ZC, ZR - ZC + 0.4, false)
  mirror((s) => {
    const xo = X(s * XO), yc = (T0 + T1) / 2
    // twin lancets, the rose over them
    lancet(win, [s, 0, 0], xo, yc - 1.4, 1.9, 3.0, 8.4)
    lancet(win, [s, 0, 0], xo, yc + 1.4, 1.9, 3.0, 8.4)
    disc(win, [xo + s * 0.08, yc, 11.6], [s, 0, 0], 1.45, 12)
    // the great pointed window's stone frame, its mullion and the rose's ring and spokes, in 3D
    const TP = (u: number, z: number): V3 => [xo + s * 0.22, u, z]
    tracery(TP, [[[yc - 2.8, 2.9], [yc - 2.8, 8.6], ...pointedArch(yc, 2.8, 8.6), [yc + 2.8, 8.6], [yc + 2.8, 2.9]], [[yc, 2.9], [yc, 9.9]], circle(yc, 11.6, 1.5), [[yc - 1.5, 11.6], [yc + 1.5, 11.6]], [[yc, 10.1], [yc, 13.1]]], 0.36)
    lancet(win, [s, 0, 0], xo, yc - 3.4, 1.2, 2.4, 6.4)
    lancet(win, [s, 0, 0], xo, yc + 3.4, 1.2, 2.4, 6.4)
    // the side walls of the transept above the aisle roofs: windows
    for (const y of [T0, T1]) {
      const n: V3 = [0, y === T0 ? -1 : 1, 0]
      lancet(win, n, y, X(s * (XO + XN) / 2), 1.4, ZL + 0.3, ZC - 2.0)
    }
    // pinnacled buttresses at the gable corners
    for (const y of [T0 - 0.3, T1 + 0.3]) pinnacle(xo - s * 0.1, y, 0, ZC + 1.2, 1.2, 2.4, true)
  })

  // grey copings on the transept gables, a cross-topped finial at each apex
  mirror((s) => {
    const xo = X(s * XO) + s * 0.35, zt = ZR + 0.4, h = (T1 - T0) / 2 + 0.4, yc = (T0 + T1) / 2
    const rise = zt - ZC
    for (const t of [-1, 1]) {
      const n: V3 = [0, t * rise, h]
      flat(grey, [[xo, yc + t * (h + 0.1), ZC - 0.1], [xo, yc, zt + 0.3], [xo - s * 1.2, yc, zt + 0.3], [xo - s * 1.2, yc + t * (h + 0.1), ZC - 0.1]], n)
    }
    flatTri(grey, [xo, yc - h - 0.1, ZC - 0.1], [xo, yc + h + 0.1, ZC - 0.1], [xo, yc, zt + 0.3], [s, 0, 0])
    pinnacle(xo - s * 0.3, yc, zt, zt + 0.9, 0.6, 1.4)
  })
  // grey eave cornices on the aisle walls
  mirror((s) => abox(grey, s > 0 ? X(XO) - 0.1 : X(-XO) - 0.35, s > 0 ? X(XO) + 0.35 : X(-XO) + 0.1, YF, T0, ZA - 0.5, ZA, null))

  // ---- the apse: a low ambulatory round a high polygonal apse
  halfLathe(brick, AX, YA, [[RA, 0], [RA, ZA]], 8)
  halfLathe(roof, AX, YA, [[RA + 0.5, ZA - 0.3], [XN, ZL]], 8)
  halfLathe(brick, AX, YA, [[XN, ZL - 0.5], [XN, ZC]], 6)
  halfLathe(grey, AX, YA, [[XN + 0.25, ZC - 0.5], [XN + 0.25, ZC]], 6)
  halfLathe(roof, AX, YA, [[XN + 0.5, ZC], [0, ZR + 0.4]], 6)
  for (let k = 0; k < 8; k++) {
    const a = ((k + 0.5) / 8) * Math.PI, ca = Math.cos(a), sa = Math.sin(a)
    // ambulatory lancets and buttresses
    const r = RA * Math.cos(Math.PI / 16) + 0.07
    const c: V3 = [AX + r * ca, YA + r * sa, 0]
    const t: V3 = [-sa, ca, 0], h = 0.75
    flat(win, [[c[0] - t[0] * h, c[1] - t[1] * h, 2.2], [c[0] + t[0] * h, c[1] + t[1] * h, 2.2], [c[0] + t[0] * h, c[1] + t[1] * h, 6.6], [c[0] - t[0] * h, c[1] - t[1] * h, 6.6]], [ca, sa, 0])
    flatTri(win, [c[0] - t[0] * h, c[1] - t[1] * h, 6.6], [c[0] + t[0] * h, c[1] + t[1] * h, 6.6], [c[0], c[1], 7.9], [ca, sa, 0])
    if (k > 0) {
      const b = (k / 8) * Math.PI
      const bx = AX + (RA + 0.4) * Math.cos(b), by = YA + (RA + 0.4) * Math.sin(b)
      abox(grey, bx - 0.45, bx + 0.45, by - 0.45, by + 0.45, 0, ZA + 0.6, grey)
    }
  }
  for (let k = 1; k < 6; k++) {
    // the upper apse's buttresses, each with a pinnacle
    const b = (k / 6) * Math.PI, bx = AX + (XN + 0.3) * Math.cos(b), by = YA + (XN + 0.3) * Math.sin(b)
    pinnacle(bx, by, ZL - 0.5, ZC + 0.6, 0.6, 1.6)
  }
  for (let k = 0; k < 6; k++) {
    const a = ((k + 0.5) / 6) * Math.PI, ca = Math.cos(a), sa = Math.sin(a)
    const r = XN * Math.cos(Math.PI / 12) + 0.07
    const c: V3 = [AX + r * ca, YA + r * sa, 0], t: V3 = [-sa, ca, 0], h = 0.6
    flat(win, [[c[0] - t[0] * h, c[1] - t[1] * h, ZL + 0.6], [c[0] + t[0] * h, c[1] + t[1] * h, ZL + 0.6], [c[0] + t[0] * h, c[1] + t[1] * h, ZC - 2.0], [c[0] - t[0] * h, c[1] - t[1] * h, ZC - 2.0]], [ca, sa, 0])
  }

  // ---- the west front of the aisles: lean-to gables, corner pinnacles, doors
  mirror((s) => {
    const xo = X(s * XO), xn = X(s * XN)
    // the aisle's front: a screen wall rising above its roof, raking up to the tower
    const zo = ZA + 2.6, zi = ZL + 3.2, yb = YF + 0.5
    flat(brick, [[xo, YF, ZA], [xn, YF, ZA], [xn, YF, zi], [xo, YF, zo]], [0, -1, 0])
    flat(brick, [[xn, yb, ZA], [xo, yb, ZA], [xo, yb, zo], [xn, yb, zi]], [0, 1, 0])
    flat(brick, s > 0 ? [[xo, YF, ZA], [xo, YF, zo], [xo, yb, zo], [xo, yb, ZA]] : [[xo, YF, ZA], [xo, yb, ZA], [xo, yb, zo], [xo, YF, zo]], [s, 0, 0])
    // a grey coping on the rake
    const n: V3 = [s * (zi - zo), 0, XO - XN]
    flat(grey, [[xo, YF - 0.3, zo], [xn, YF - 0.3, zi], [xn, yb + 0.1, zi], [xo, yb + 0.1, zo]], n)
    flat(grey, [[xo, YF - 0.3, zo - 0.35], [xn, YF - 0.3, zi - 0.35], [xn, YF - 0.3, zi], [xo, YF - 0.3, zo]], [0, -1, 0])
    pinnacle(xo - s * 0.4, YF + 0.2, 0, zo + 0.8, 1.5, 2.6, true)
    // the side door and a lancet over it
    lancet(win, [0, -1, 0], YF, X(s * 11.2), 1.8, 0, 3.2)
    lancet(win, [0, -1, 0], YF, X(s * 11.2), 1.4, 5.6, 9.6)
  })

  // ---- the tower
  const TC: P2 = [AX, -25.2], H = 4.5, TZ = 29.5
  abox(brick, TC[0] - H, TC[0] + H, TC[1] - H, TC[1] + H, 0, TZ, null)
  // corner buttresses: grey, stepping in at 12 and 21 m
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const cx = TC[0] + sx * H, cy = TC[1] + sy * H
    for (const [z0, z1, w] of [[0, 12, 2.2], [12, 21, 1.9], [21, TZ, 1.6]]) {
      const xa = cx - sx * (w - 0.35), xb = cx + sx * 0.35, ya = cy - sy * (w - 0.35), yb = cy + sy * 0.35
      abox(grey, Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), z0, z1, grey)
    }
  }
  abox(grey, TC[0] - H - 0.3, TC[0] + H + 0.3, TC[1] - H - 0.3, TC[1] + H + 0.3, TZ - 0.8, TZ, grey)
  abox(grey, TC[0] - H - 0.15, TC[0] + H + 0.15, TC[1] - H - 0.15, TC[1] + H + 0.15, 22.4, 22.9, null)
  const FT = TC[1] - H
  // the portal: dark doorway under a grey gabled hood
  lancet(win, [0, -1, 0], FT - 0.45, AX, 3.0, 0, 4.2)
  abox(grey, AX - 2.6, AX + 2.6, FT - 0.4, FT, 0, 5.8, null)
  flatTri(grey, [AX - 2.9, FT - 0.4, 5.8], [AX + 2.9, FT - 0.4, 5.8], [AX, FT - 0.4, 8.6], [0, -1, 0])
  flat(grey, [[AX - 2.9, FT - 0.4, 5.8], [AX, FT - 0.4, 8.6], [AX, FT, 8.6], [AX - 2.9, FT, 5.8]], [-1, 0, 1])
  flat(grey, [[AX, FT - 0.4, 8.6], [AX + 2.9, FT - 0.4, 5.8], [AX + 2.9, FT, 5.8], [AX, FT, 8.6]], [1, 0, 1])
  // the great twin lancet with its roundel, the clock, the belfry
  for (const d of [-0.75, 0.75]) lancet(win, [0, -1, 0], FT, AX + d, 1.1, 9.8, 16.0)
  disc(win, [AX, FT - 0.07, 17.8], [0, -1, 0], 0.75, 10)
  disc(grey, [AX, FT - 0.06, 20.7], [0, -1, 0], 1.45, 14)
  disc(lit, [AX, FT - 0.12, 20.7], [0, -1, 0], 1.15, 14)
  const faces: [V3, number, (d: number) => number][] = [[[0, -1, 0], FT, (d) => AX + d], [[0, 1, 0], TC[1] + H, (d) => AX + d], [[-1, 0, 0], TC[0] - H, (d) => TC[1] + d], [[1, 0, 0], TC[0] + H, (d) => TC[1] + d]]
  for (const [n, at, u] of faces) {
    for (const d of [-0.85, 0.85]) lancet(win, n, at, u(d), 1.15, 23.6, 27.2)
    // the belfry's tracery: jambs, the central mullion, the hood over the pair, louvre bars
    const o = n[0] !== 0, off = 0.2
    const BP = (du: number, z: number): V3 => (o ? [at + n[0] * off, u(du), z] : [u(du), at + n[1] * off, z])
    tracery(BP, [[[-1.55, 23.4], [-1.55, 27.4], ...pointedArch(0, 1.55, 27.4, 4), [1.55, 27.4], [1.55, 23.4]], [[0, 23.4], [0, 28.2]], [[-1.5, 23.4], [1.5, 23.4]]], 0.26)
    for (const z of [24.6, 25.8]) tracery(BP, [[[-1.4, z], [1.4, z]]], 0.14)
  }
  // the crown: corner pinnacles, dormers, the spire
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) pinnacle(TC[0] + sx * (H - 0.8), TC[1] + sy * (H - 0.8), TZ, TZ + 3.4, 1.5, 3.4, true)
  for (const [n, at, u] of faces) {
    // a gabled dormer at the foot of each spire face, ridge running out
    const c = u(0), o = n[0] !== 0
    const P = (du: number, out: number, z: number): V3 => (o ? [at - n[0] * (1.6 - out), c + du, z] : [c + du, at - n[1] * (1.6 - out), z])
    const z0 = TZ, z1 = TZ + 2.6, zt = TZ + 4.4
    flat(grey, [P(-1.1, 0.4, z0), P(1.1, 0.4, z0), P(1.1, 0.4, z1), P(-1.1, 0.4, z1)], n)
    flatTri(grey, P(-1.1, 0.4, z1), P(1.1, 0.4, z1), P(0, 0.4, zt), n)
    lancet(win, n, o ? at - n[0] * 1.15 : at - n[1] * 1.15, c, 0.9, z0 + 0.4, z1 - 0.1)
    const side = (sg: number): V3 => (o ? [0, sg, 0] : [sg, 0, 0])
    flat(grey, [P(-1.1, 0.4, z0), P(-1.1, -2.0, z0), P(-1.1, -2.0, z1), P(-1.1, 0.4, z1)], side(-1))
    flat(grey, [P(1.1, 0.4, z0), P(1.1, 0.4, z1), P(1.1, -2.0, z1), P(1.1, -2.0, z0)], side(1))
    const sl = (sg: number): V3 => (o ? [0, sg * 1.8, 1.1] : [sg * 1.8, 0, 1.1])
    flat(roof, [P(-1.3, 0.6, z1 - 0.15), P(0, 0.6, zt + 0.1), P(0, -2.2, zt + 0.1), P(-1.3, -2.2, z1 - 0.15)], sl(-1))
    flat(roof, [P(0, 0.6, zt + 0.1), P(1.3, 0.6, z1 - 0.15), P(1.3, -2.2, z1 - 0.15), P(0, -2.2, zt + 0.1)], sl(1))
  }
  lathe(TC, [[H - 0.5, TZ], [3.1, TZ + 1.8], [0.22, 44.4], [0, 44.6]], () => roof, 8, 20, Math.PI / 8)
  // lucarnes on the spire's diagonal faces: small gabled windows
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2, ca = Math.cos(a), sa = Math.sin(a)
    const zb = 34.2, r = 3.1 - ((zb - TZ - 1.8) / (44.4 - TZ - 1.8)) * 2.88 + 0.35
    const c: V3 = [TC[0] + r * ca, TC[1] + r * sa, zb], t: V3 = [-sa, ca, 0], h = 0.55
    const P = (u: number, out: number, z: number): V3 => [c[0] + t[0] * u + ca * out, c[1] + t[1] * u + sa * out, z]
    flat(grey, [P(-h, 0, zb), P(h, 0, zb), P(h, 0, zb + 1.3), P(-h, 0, zb + 1.3)], [ca, sa, 0])
    flatTri(grey, P(-h, 0, zb + 1.3), P(h, 0, zb + 1.3), P(0, 0, zb + 2.2), [ca, sa, 0])
    flat(win, [P(-0.25, 0.04, zb + 0.2), P(0.25, 0.04, zb + 0.2), P(0.25, 0.04, zb + 1.1), P(-0.25, 0.04, zb + 1.1)], [ca, sa, 0])
    flat(roof, [P(-h - 0.1, 0.1, zb + 1.2), P(0, 0.1, zb + 2.3), P(0, -1.2, zb + 2.3), P(-h - 0.1, -1.2, zb + 1.2)], [-t[0] + ca * 0.2, -t[1] + sa * 0.2, 0.9])
    flat(roof, [P(0, 0.1, zb + 2.3), P(h + 0.1, 0.1, zb + 1.2), P(h + 0.1, -1.2, zb + 1.2), P(0, -1.2, zb + 2.3)], [t[0] + ca * 0.2, t[1] + sa * 0.2, 0.9])
  }
  // a pierced parapet between the crown's pinnacles: small lancets in a grey band
  for (const [n, at, u] of faces) {
    const o = n[0] !== 0
    for (const d of [-2.6, 2.6]) {
      const P = (du: number, z: number): V3 => (o ? [at + n[0] * 0.05, u(d) + du, z] : [u(d) + du, at + n[1] * 0.05, z])
      flat(grey, [P(-1.2, TZ), P(1.2, TZ), P(1.2, TZ + 1.3), P(-1.2, TZ + 1.3)], n)
      for (const e of [-0.6, 0, 0.6]) lancet(win, n, o ? at + n[0] * 0.05 : at + n[1] * 0.05, u(d) + e, 0.32, TZ + 0.25, TZ + 0.85)
    }
  }
  // the cross
  abox(grey, TC[0] - 0.14, TC[0] + 0.14, TC[1] - 0.14, TC[1] + 0.14, 44.4, 46.2, grey)
  abox(grey, TC[0] - 0.6, TC[0] + 0.6, TC[1] - 0.14, TC[1] + 0.14, 45.3, 45.6, grey)
  // the stair turret on the +x side, by the aisle front
  const SC: P2 = [AX + 6.6, YF - 1.4]
  lathe(SC, [[1.7, 0], [1.7, 19.6]], () => grey, 8, 50, Math.PI / 8)
  lathe(SC, [[1.95, 19.6], [1.95, 20.2]], () => grey, 8, 50, Math.PI / 8)
  lathe(SC, [[2.0, 20.2], [0, 24.6]], () => roof, 8, 20, Math.PI / 8)

  const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0.15 : p[1] < YF + 0.5 ? Math.max(0.35, 1 - p[2] / 50) : Math.max(0.15, 0.6 - p[2] / 30))
  save('seoul-myeongdong-cathedral', 'Myeongdong Cathedral', [
    { part: brick, material: { ...finish('myeongdong-brick', 0x9c6656), floodlight: flood } },
    { part: grey, material: { ...finish('myeongdong-grey-brick', 0xa9a8a2), floodlight: flood } },
    { part: roof, material: { ...PALETTE.copper, color: 0x95b2a1, floodlight: (p: V3) => (p[2] > 29 ? 0.6 : 0) } },
    { part: win, material: PALETTE.window },
    { part: lit, material: { ...PALETTE.entrance, color: 0xf4f1e8 } },
  ], 150, 46.2)
}

if (import.meta.main) build()
