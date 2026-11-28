/**
 * Abeno Harukas (あべのハルカス), Abeno, Osaka: procedural, CC0-1.0.
 * bun generators/osaka-abeno-harukas.ts
 *
 * Map frame: x east, y north, z up, metres, origin on the ground at the
 * centroid of OSM way/187296989 (the whole building: the tower, the 9-storey
 * Wing and the low east and south parts). Bearing 0: the OSM parts are drawn
 * at their own coordinates, and the tower is built in its own grid, turned
 * 15 degrees clockwise (the tower part's sides run at 12-18 degrees).
 *
 * Kintetsu's 300 m tower over Osaka-Abenobashi station (2014, Takenaka /
 * Cesar Pelli): a glass tower in three blocks that step back in three
 * stages, the department store in its base, offices in the middle block, the
 * Marriott and the Harukas 300 observatory in the top block, white V-truss
 * bands at the transfer floors and open frames on the setback roofs.
 *
 * Published (ja.wikipedia "あべのハルカス"):
 * - 300.0 m to the roof (the heliport and EDGE THE HARUKAS on it), 60
 *   floors; 60F at 288 m, the 58F open-air garden 天空庭園 at 278 m, the
 *   16F museum at 81 m; truss and plant floors at 15F, 37F and 56F;
 * - a three-stage setback; a tubular atrium up the top block;
 * - the tower wing's footprint 6,124 m^2; offices about 2,400 m^2 a floor.
 *
 * OSM (all replaced): way/187296989 (the outline, height 300), parts
 * way/488467176 タワー館 (60 levels, 300 m: the tower's base polygon),
 * way/602589263 ウイング館 (9 levels), way/187896585 ウイング館 (2 levels,
 * the east low wing), way/977755844 (2 levels, the south strip).
 *
 * From photos (heights scaled from Guilhem Vellut's view from Tsutenkaku, a
 * near-level view 1.2 km away, on the 300 m roof and the truss floors):
 * - the blocks: the base (0-76 m) under the middle block (76-170 m), which
 *   overhangs it on the north, east and south on a white V-truss (15F); the
 *   top block (170-300 m) set back on the north, east and south over a
 *   second V-truss band (37F); the west face rises flush from the ground to
 *   the roof (Oilstreet from the north-west; Mr.ちゅらさん from the south;
 *   Vellut from the west-north-west);
 * - the top: a plant/truss band at 56F (263-268 m), the sky garden's dark
 *   louvred band, then an open frame round the roof 278-300 m through which
 *   the sky shows (Oilstreet, Mr.ちゅらさん);
 * - the setback roofs ringed by open frames about two storeys high;
 * - the department-store block east of the tower, grey louvred, about 60 m
 *   (Kamo-gawa's 加茂川 view; Oilstreet); the Wing's white horizontal bands.
 * Plan sizes are estimated from the width ratios in those photos (top block
 *   to middle block 0.62-0.75; the overhangs 4-10 m), held to the published
 *   footprint and floor areas: base 56 x 60 m, middle 66 x 68 m, top 46 x
 *   52 m (±5 m).
 *
 * The setbacks: the brief said "open-frame setbacks on the west side"; every
 * photo shows the west face flush and the steps on the north, east and south,
 * so the model follows the photos.
 *
 * Facade (re-sampled after the lead's review): a blue-green glass curtain
 * wall (window-2, #7896a3; sunlit #7f9eab-#6d8e9b on Oilstreet and Vellut),
 * grouped in panels two bays by three floors with white-silver frame lines
 * between (#e6eaec); the truss bands dark glass behind white V members; the
 * white glass blade at the middle block's north-west corner, a plate 0.8 m
 * thick in the west face's plane standing 4 m proud of the north face, its
 * foot and head cut on a slant, rising 4-12 m past the middle block's roof
 * (Oilstreet; 加茂川; size estimated); the crown a cage: a white frame of
 * piers, mullions, two rails and a ring beam round 278-300 m, over a skin of
 * glass 0.9 m inside it; the store's louvres a silver grey (#b9c0c6, sunlit #c5ccd3 on
 * Oilstreet); the Wing's bands white (stone) over window panels.
 *
 * Night: the curtain wall glows as windows (offices and hotel are lit); the
 * truss bands and the sky-garden band stay dark (glass).
 *
 * Estimated: every plan size above, the base block's 60 m, the Wing's 46 m
 * (9 store floors), the low parts' 11 m (2 floors), the open frames.
 * Left out: the station canopies, the pedestrian decks, signs, the
 * heliport's markings.
 *
 * Photos (Wikimedia Commons):
 * - "Abeno Harukas Osaka Japan01-r.jpg", Oilstreet, CC BY 2.5 (blocks, overhangs, trusses; from the north-west)
 * - "Abeno Harukas 2021-03.jpg", Mr.ちゅらさん, CC BY-SA 4.0 (blocks, open frames, top; from the south)
 * - "Abeno Harukas from Tsutenkaku Tower @ Shinsekai @ Osaka (13382473483).jpg", Guilhem Vellut, CC BY 2.0 (heights; from the west-north-west)
 * - "あべのハルカス.jpg", 加茂川, CC0 (store block, Wing, corner; from below)
 * - "Abeno Harukas.jpg", Kimiwind1184, CC BY-SA 3.0 (from the north, in cloud)
 * - "Illuminated Tennōji Park and Abeno Harukas, November 2015, Osaka.jpg", Laitche, CC BY-SA 4.0 (night)
 * Look-only: none.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { walls, cap, area, type XY } from './chi-aon-center'

const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
/** A quad wound to face n. */
function oq(p: Part, Q: V3[], n: V3) {
  const g = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.quad(Q[0], Q[1], Q[2], Q[3])
  else p.quad(Q[0], Q[3], Q[2], Q[1])
}
const lerpV = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** OSM rings in the model frame (metres from the outline's centroid). */
const TOWER_PART: XY[] = [[-18.0, 51.5], [-22.0, 52.6], [-70.8, 68.5], [-74.5, 69.7], [-78.4, 70.9], [-96.1, 76.6], [-99.0, 74.6], [-102.7, 72.2], [-104.0, 71.4], [-104.6, 71.4], [-107.1, 61.0], [-121.8, -6.8], [-88.8, -14.5], [-86.3, -6.1], [-38.6, -19.0]]
const WING9: XY[] = [[-18.0, 51.5], [-38.6, -19.0], [19.6, -35.8], [21.1, -31.4], [38.9, -36.8], [49.5, -8.1], [55.4, 8.1], [62.4, 27.4], [56.2, 29.4]]
const WING2: XY[] = [[35.6, -47.2], [44.4, -49.6], [97.6, -63.7], [136.0, -80.8], [141.0, -65.2], [147.5, -45.4], [104.0, -16.3], [99.7, -13.8], [55.4, 8.1], [49.5, -8.1], [38.9, -36.8], [36.5, -44.1], [36.0, -45.7]]
const SOUTH2: XY[] = [[-86.3, -6.1], [-88.8, -14.5], [-83.7, -15.8], [-48.6, -25.1], [-44.1, -26.2], [31.9, -46.1], [32.9, -42.9], [36.5, -44.1], [38.9, -36.8], [21.1, -31.4], [19.6, -35.8], [-38.6, -19.0]]
const ccw = (r: XY[]) => (area(r) < 0 ? [...r].reverse() : r)

/** The tower's grid: u along 105 degrees, v along 15 degrees. */
const C15 = Math.cos((15 * Math.PI) / 180), S15 = Math.sin((15 * Math.PI) / 180)
const T = (u: number, v: number): XY => [u * C15 + v * S15, -u * S15 + v * C15]
const TU: V3 = [C15, -S15, 0], TV: V3 = [S15, C15, 0]

// Tower blocks in (u, v): [u0, u1, v0, v1, z0, z1]
const WEST = -117.5
type Block = { u0: number; u1: number; v0: number; v1: number; z0: number; z1: number }
const BASE: Block = { u0: WEST, u1: WEST + 62, v0: -11, v1: 31, z0: 0, z1: 76 }
const MID: Block = { u0: WEST, u1: WEST + 70, v0: -15, v1: 35, z0: 76, z1: 170 }
const TOP: Block = { u0: WEST, u1: WEST + 56, v0: -13, v1: 29, z0: 170, z1: 300 }
const STORE_TOP = 60, WING_TOP = 46, LOW_TOP = 11

function build() {
  const frame = new Part() // white frames, trusses, open frames (trim)
  const glaze = new Part() // the curtain wall (window-2)
  const dark = new Part()  // truss bands and the sky garden (glass, stays dark)
  const roof = new Part()  // roofs (roof)
  const louvre = new Part() // the store's louvred walls
  const band = new Part()  // the Wing's white bands (stone)
  const win = glaze

  const ring = (b: Block, inset = 0): XY[] => [T(b.u0 + inset, b.v0 + inset), T(b.u1 - inset, b.v0 + inset), T(b.u1 - inset, b.v1 - inset), T(b.u0 + inset, b.v1 - inset)]

  /**
   * A curtain wall on a block's four faces between z0 and z1: frame-coloured
   * wall with light glass panels, `bay` wide, `rise` tall, set 0.05 m proud.
   */
  const curtain = (r: XY[], z0: number, z1: number, bay: number, rise: number, pier: number, sill: number, wall: Part, glassPart: Part, faces = [0, 1, 2, 3]) => {
    walls(wall, r, z0, z1)
    for (const f of faces) {
      const a = r[f], b = r[(f + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      const nb = Math.max(1, Math.round(len / bay)), nr = Math.max(1, Math.round((z1 - z0) / rise))
      for (let i = 0; i < nb; i++)
        for (let k = 0; k < nr; k++) {
          const u0 = (i + pier / 2 / (len / nb)) / nb, u1 = (i + 1 - pier / 2 / (len / nb)) / nb
          const za = z0 + ((z1 - z0) * k) / nr + sill / 2, zb = z0 + ((z1 - z0) * (k + 1)) / nr - sill / 2
          const P = (u: number, z: number): V3 => add([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, z], mul(n, 0.05))
          glassPart.quad(P(u0, za), P(u1, za), P(u1, zb), P(u0, zb))
        }
    }
  }

  /** A truss band: a dark recessed band and white V members on the given faces. */
  const truss = (b: Block, z0: number, z1: number, faces: number[], step = 9) => {
    const r = ring(b, 0)
    walls(dark, ring(b, 0.6), z0, z1)
    for (const f of faces) {
      const a = r[f], c = r[(f + 1) % 4]
      const len = Math.hypot(c[0] - a[0], c[1] - a[1])
      const n: V3 = unit([c[1] - a[1], a[0] - c[0], 0])
      const P = (u: number, z: number): V3 => add([a[0] + ((c[0] - a[0]) * u) / len, a[1] + ((c[1] - a[1]) * u) / len, z], mul(n, -0.1))
      const nv = Math.max(2, Math.round(len / step))
      const s = len / nv
      for (let i = 0; i < nv; i++) {
        bar(P(i * s + 0.4, z1 - 0.3), P((i + 0.5) * s, z0 + 0.3), 0.45, n)
        bar(P((i + 1) * s - 0.4, z1 - 0.3), P((i + 0.5) * s, z0 + 0.3), 0.45, n)
      }
      bar(P(0, z1 - 0.4), P(len, z1 - 0.4), 0.4, n)
      bar(P(0, z0 + 0.4), P(len, z0 + 0.4), 0.4, n)
    }
  }
  /** A flat bar of half-width w in the plane facing n, from p to q, 0.5 m deep. */
  const bar = (p: V3, q: V3, w: number, n: V3) => {
    const d = unit(sub(q, p))
    const s = unit(cross(n, d))
    const o = mul(s, w), dd = mul(n, 0.5)
    const A = add(p, o), B = add(q, o), C = add(q, mul(o, -1)), D = add(p, mul(o, -1))
    oq(frame, [add(A, dd), add(B, dd), add(C, dd), add(D, dd)], n)
    oq(frame, [A, B, add(B, dd), add(A, dd)], s)
    oq(frame, [C, D, add(D, dd), add(C, dd)], mul(s, -1))
  }

  /** An open frame round some edges of a roof: posts and two rails, height h. */
  const openFrame = (r: XY[], z: number, h: number, edges: number[], post = 3.2) => {
    for (const f of edges) {
      const a = r[f], c = r[(f + 1) % r.length]
      const len = Math.hypot(c[0] - a[0], c[1] - a[1])
      const n: V3 = unit([c[1] - a[1], a[0] - c[0], 0])
      const P = (u: number, zz: number): V3 => add([a[0] + ((c[0] - a[0]) * u) / len, a[1] + ((c[1] - a[1]) * u) / len, zz], mul(n, -0.5))
      const np = Math.round(len / post)
      for (let i = 0; i <= np; i++) bar(P((i * len) / np, z), P((i * len) / np, z + h), 0.18, n)
      for (const zz of [z + h * 0.5, z + h - 0.3]) bar(P(0, zz), P(len, zz), 0.22, n)
    }
  }

  // --- The low parts and the Wing (OSM outlines).
  for (const r of [WING2, SOUTH2].map(ccw)) {
    walls(band, r, 0, LOW_TOP)
    cap(roof, r, LOW_TOP)
    // a glazed ground floor on the street sides
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 12) continue
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      const P = (u: number, z: number): V3 => add([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, z], mul(n, 0.05))
      const m = 2 / len
      win.quad(P(m, 1.2), P(1 - m, 1.2), P(1 - m, 5.2), P(m, 5.2))
    }
  }
  {
    const r = ccw(WING9)
    walls(band, r, 0, WING_TOP)
    cap(roof, r, WING_TOP)
    // two-storey window bands broken by piers every bay (the white bands between)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 8) continue
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      const nb = Math.max(1, Math.round(len / 10))
      for (let k = 0; k < nb; k++)
        for (const [z0, z1] of [[6, 15], [16.5, 25.5], [27, 36], [37.5, 44]]) {
          const u0 = (k + 0.06) / nb, u1 = (k + 0.94) / nb
          const P = (u: number, z: number): V3 => add([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, z], mul(n, 0.05))
          win.quad(P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1))
        }
    }
  }

  // --- The department store block: the tower part's whole plan, louvred, to 60 m.
  {
    const r = ccw(TOWER_PART)
    walls(louvre, r, 0, STORE_TOP)
    cap(roof, r, STORE_TOP)
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 10) continue
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      const nb = Math.max(1, Math.round(len / 12))
      for (let k = 0; k < nb; k++)
        for (const [z0, z1] of [[1.5, 7], [9, 24], [26, 41], [43, 57]]) {
          const u0 = (k + 0.08) / nb, u1 = (k + 0.92) / nb
          const P = (u: number, z: number): V3 => add([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, z], mul(n, 0.05))
          win.quad(P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1))
        }
    }
    // the open frame round the store roof's east and north edges, beyond the tower
    openFrame(r, STORE_TOP, 7, r.map((_, i) => i).filter((i) => {
      const a = r[i], b = r[(i + 1) % r.length]
      return Math.hypot(b[0] - a[0], b[1] - a[1]) > 30 && (a[1] + b[1]) / 2 > 55
    }))
  }

  // --- The tower: base, middle and top blocks.
  const baseR = ring(BASE)
  // the west face stands 0.3 m proud of the store's west wall, so they don't fight
  const shiftW = (r: XY[]): XY[] => r.map(([x, y], i) => (i === 0 || i === 3 ? [x - 0.3 * C15, y + 0.3 * S15] as XY : [x, y]))
  curtain(shiftW(baseR), 0, BASE.z1, 7.2, 13.5, 0.7, 0.7, frame, glaze)
  // the middle block, over the 15F V-truss band (overhanging north, east, south)
  const mid = ring(MID)
  cap(frame, mid, MID.z0, false)
  truss({ ...MID }, MID.z0, MID.z0 + 5.5, [0, 1, 2, 3])
  curtain(mid, MID.z0 + 5.5, MID.z1, 7.2, 13.5, 0.7, 0.7, frame, glaze)
  cap(roof, mid, MID.z1)
  // the setback roof's open frames
  openFrame(mid, MID.z1, 8, [0, 1, 2])
  // the white glass blade at the middle block's north-west corner: a tall
  // plate in the west face's plane, standing 4 m proud of the north face,
  // its foot and head cut on a slant, rising past the roof as a screen
  // (Oilstreet; 加茂川)
  {
    const u = WEST - 0.2, v0 = MID.v1 - 16, v1 = MID.v1 + 4
    const Q = (v: number, z: number, du: number): V3 => {
      const [x, y] = T(u + du, v)
      return [x, y, z]
    }
    const out: Array<[number, number]> = [[v0, MID.z0 + 3], [v1, MID.z0 - 5], [v1, MID.z1 + 12], [v0, MID.z1 + 4]]
    const nW: V3 = mul(TU, -1)
    oq(frame, out.map(([v, z]) => Q(v, z, 0)), nW)
    oq(frame, out.map(([v, z]) => Q(v, z, 0.8)), TU)
    for (let i = 0; i < 4; i++) {
      const [va, za] = out[i], [vb, zb] = out[(i + 1) % 4]
      const e = unit(sub(Q(vb, zb, 0), Q(va, za, 0)))
      const n = unit(cross(e, TU))
      const c = Q((va + vb) / 2, (za + zb) / 2, 0), mid = Q((v0 + v1) / 2, (MID.z0 + MID.z1) / 2, 0)
      const outward = (c[0] - mid[0]) * n[0] + (c[1] - mid[1]) * n[1] + (c[2] - mid[2]) * n[2] > 0 ? n : mul(n, -1)
      oq(frame, [Q(va, za, 0), Q(vb, zb, 0), Q(vb, zb, 0.8), Q(va, za, 0.8)], outward)
    }
  }
  // the top block over the 37F V-truss band
  const top = ring(TOP)
  truss({ ...TOP }, TOP.z0, TOP.z0 + 5.5, [0, 1, 2, 3])
  curtain(top, TOP.z0 + 5.5, 263, 7.2, 13.0, 0.7, 0.7, frame, glaze)
  // 56F truss and plant band, the sky garden's dark louvred band
  truss({ ...TOP }, 263, 268.5, [0, 1, 2, 3])
  walls(dark, ring(TOP, 0.4), 268.5, 278)
  // the 58F garden floor and the 60F gallery round the atrium, inside the open frame
  cap(roof, ring(TOP, 0.4), 278)
  // the cage's glass skin, 0.9 m inside the white frame (the sky garden is
  // open behind it; drawn as structural glass, which stays dark at night)
  walls(dark, ring(TOP, 0.9), 278, 299.2)
  cap(roof, ring(TOP, 0.9), 299.2)
  // the open frame round the roof 278-300 m: corner piers, mullions, a roof ring beam
  {
    const r = top
    for (let f = 0; f < 4; f++) {
      const a = r[f], c = r[(f + 1) % 4]
      const len = Math.hypot(c[0] - a[0], c[1] - a[1])
      const n: V3 = unit([c[1] - a[1], a[0] - c[0], 0])
      const P = (u: number, z: number): V3 => add([a[0] + ((c[0] - a[0]) * u) / len, a[1] + ((c[1] - a[1]) * u) / len, z], mul(n, -0.6))
      const np = Math.round(len / 4.6)
      for (let i = 0; i <= np; i++) bar(P((i * len) / np, 278), P((i * len) / np, 299.2), i === 0 || i === np ? 0.7 : 0.22, n)
      for (const z of [285.5, 292.5]) bar(P(0, z), P(len, z), 0.18, n)
      bar(P(0, 299.2), P(len, 299.2), 0.8, n)
    }
    // the roof's heliport deck, a ring beam's inner lip
    const rimIn = ring(TOP, 2.2)
    const rimOut = ring(TOP, 0.1)
    for (let f = 0; f < 4; f++) {
      const g = (f + 1) % 4
      const A: V3 = [rimOut[f][0], rimOut[f][1], 300], B: V3 = [rimOut[g][0], rimOut[g][1], 300], C: V3 = [rimIn[g][0], rimIn[g][1], 300], D: V3 = [rimIn[f][0], rimIn[f][1], 300]
      frame.quad(A, B, C, D)
      const A0: V3 = [A[0], A[1], 298.4], B0: V3 = [B[0], B[1], 298.4], C0: V3 = [C[0], C[1], 298.4], D0: V3 = [D[0], D[1], 298.4]
      frame.quad(B0, A0, D0, C0)
      frame.quad(C0, D0, D, C) // inner face of the rim
    }
  }

  const parts: Array<{ part: Part; material: MaterialSpec }> = [
    { part: frame, material: finish('harukas-white', 0xe6eaec) },
    { part: glaze, material: windowVariant(2, 0x7896a3) },
    { part: dark, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
    { part: louvre, material: finish('harukas-louvre', 0xb9c0c6) },
    { part: band, material: PALETTE.stone },
  ]
  return parts
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((t, { part }) => t + part.triangles, 0)
  if (triangles > 6500) throw new Error(`triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Abeno Harukas', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 300,
  })
  const out = new URL('../models/osaka-abeno-harukas.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
