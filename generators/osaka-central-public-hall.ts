/**
 * Osaka City Central Public Hall (大阪市中央公会堂), Nakanoshima, Osaka:
 * procedural, CC0-1.0.
 * bun generators/osaka-central-public-hall.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/osaka-central-public-hall.glb, the low model;
 * - models/osaka-central-public-hall.detail.glb, drawn from zoom 16: rounder
 *   columns, domes and vault, finer voussoirs, dormers and window surrounds.
 *
 * Map frame: x east, y north, z up, metres. Built square to the building,
 * its long axis along x with the main front to the east (+x); the
 * placement's bearing (1.8) turns it to OSM's outline. The origin is the
 * area centroid of OSM's outline (way/162382613); y = 0 is the plaza
 * (flat; Nakanoshima is a river island a few metres above the water).
 *
 * Shinichiro Okada (design, competition 1912), Kingo Tatsuno (adviser);
 * built 1913-1918; Important Cultural Property. Steel-framed brick:
 * red brick with white granite banding, a great semicircular arch on the
 * east front, the end of a copper-clad barrel vault over the main hall,
 * flanked by two domed towers and a porch of four giant columns; long
 * brick sides with slate mansards and domed pavilions.
 *
 * OSM: way/162382613 (3 levels, start_date 1918): its area 2,354 m^2
 * matches the published building area 2,330 m^2. In this frame the body runs
 * x -31..32 by y -28..28 (measured): the front towers at x 25.8-31.8, the
 * porch recess at x 29.4, side pavilions projecting to y +-28 at x 10-17
 * and x -20..-12 (measured).
 * Published (ja.wikipedia): 3 storeys above ground, 1-2 below, building
 * area 2,330 m^2, steel-framed brick, completed 1918. No heights found.
 *
 * Estimated from photos (dllu's square-on east front scaled to its 44 m
 * width, 12.95 px/m; the side views scaled to it):
 * - the main cornice and balustrade 14.8-17 m; slate mansards to 21.5 m;
 * - the front towers 8.9 m wide, cornice 21.5-22.3 m, an octagonal lantern
 *   23.2-25.6 m, copper domes to 28.6 m and finials to ~31 m; an oculus in
 *   each tower's front at 18.8 m;
 * - the great arch: springing at 17.4 m, outer radius 8.4 m (crown ~25.8 m),
 *   a 1.9 m ring of red voussoirs with thin white ones between, under a
 *   copper hood that runs back as the barrel vault, ~34 m long; the
 *   lunette glazed in three lights;
 * - the porch: four columns 1.5 m thick at y -7.7, -3.0, 1.7, 6.3, from a
 *   1.5 m podium to 12.7 m, under an entablature to 15 m; three doors
 *   with copper canopies; the steps (outside OSM's outline);
 * - the side pavilions' towers lower (cornice ~19.8 m, domes to ~24.3 m);
 * - granite: a striped base to ~5 m (white bands across the brick),
 *   quoins at the corners, window surrounds, string course and cornice;
 * - colours from Sakai Yayoi, dllu, Zhizhou Deng and Kakidai in sun: brick
 *   #c4583c-#d06a4a, drawn #c4623f; granite #e4e2dc, drawn #e9e6df;
 *   copper verdigris #5f9c80-#7cb39a, drawn #74a68f; slate #4d545e-#5b626c,
 *   drawn #5c6370.
 * Invented: the window rhythm on the rear (west) front and the number of
 * dormers; the sculpture group on the arch's crown is left out.
 * Terrain: see the report; elevation 0.
 *
 * Night: the hall is floodlit (Oilstreet, "OSAKA Hikari-Renaissance"), so
 * brick and granite carry a warm `floodlight` wash; windows glow.
 *
 * Photos (Wikimedia Commons, evidence):
 * - "Osaka City Central Public Hall main facade 2026 dllu.jpg", Daniel Lu, CC BY-SA 4.0 (east front, square on)
 * - "2020 大阪市中央公会堂.jpg", Zhizhou Deng, CC BY 2.0 (south-east)
 * - "Osaka Central Public Hall in 201504 001.JPG", Mc681, CC BY-SA 4.0 (north-west)
 * - "Osaka City Central Public Hall ao.jpg" and "Osaka City Central Public Hall 2026.jpg", Sakai Yayoi, CC0
 * - "Osaka Nakanoshima Public Hall.jpg", Sakai Yayoi, CC0
 * - "Osaka Central Public Hall 02.jpg", Kakidai, CC BY-SA 4.0
 * - "Osaka City Central Public Hall.jpg", DoctorAB, CC BY-SA 4.0
 * - "Osaka Central Public Hall 2010.jpg", Wiiii, CC BY-SA 3.0
 * - "中之島公会堂(Nakanoshima Kokaido) - panoramio.jpg", yukisuke, CC BY 3.0 (east front, close)
 * Look-only: none.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { triangulate } from './chi-aon-center'
import { TAU, beam, box, fquad, ftri, wallDisc, writeLods, type Mat, type XY } from './osaka-umeda-sky-building'

// The outline in this frame (OSM, clockwise as drawn), reversed to counter-clockwise.
const OUTLINE: XY[] = ([[-17.6, 28.2], [-12.1, 28.2], [-12.1, 22.9], [-11.6, 22.9], [-11.6, 14.8], [10.8, 14.7], [10.8, 22.6], [11.9, 22.6], [12.0, 27.6], [17.9, 27.6], [17.9, 21.3], [27.6, 21.3], [27.6, 12.7], [31.8, 12.7], [31.8, 7.2], [29.4, 7.2], [29.3, -8.8], [31.8, -8.8], [31.8, -14.8], [25.7, -14.8], [25.7, -21.9], [16.2, -21.9], [16.2, -28.4], [10.1, -28.4], [10.2, -14.4], [-12.8, -14.3], [-12.8, -27.2], [-19.9, -27.1], [-19.9, -20.9], [-29.7, -20.9], [-29.7, -12.1], [-31.2, -12.1], [-31.2, -5.9], [-28.8, -5.9], [-28.7, 9.7], [-30.6, 9.7], [-30.6, 15.4], [-26.5, 15.4], [-26.5, 22.6], [-17.6, 22.6]] as XY[]).reverse()

const YC = -0.6 // the east front's axis
const CORNICE = 14.8, PARAPET = 17, MANSARD = 21.5
const ST = 4.6 // storey

type Parts = { brick: Part; granite: Part; copper: Part; slate: Part; win: Part; door: Part }
let FLAT = false // low model: banding and surrounds as flush panels, not proud blocks

/** A flat panel on wall a→b (counter-clockwise ring: the outside is on the right), s0..s1 along, z0..z1. */
function onWall(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, out = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, z: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, z]
  fquad(p, P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1), [n[0], n[1], 0])
}
/** A proud block on wall a→b: s0..s1 along, z0..z1, from the wall out `d`. */
function proud(p: Part, a: XY, b: XY, s0: number, s1: number, z0: number, z1: number, d: number, top = true, bottom = false, force = false) {
  if (FLAT && !force) { onWall(p, a, b, s0, s1, z0, z1, Math.min(d, 0.05)); return }
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
  const P = (s: number, o: number, z: number): V3 => [a[0] + u[0] * s + n[0] * o, a[1] + u[1] * s + n[1] * o, z]
  fquad(p, P(s0, d, z0), P(s1, d, z0), P(s1, d, z1), P(s0, d, z1), [n[0], n[1], 0])
  fquad(p, P(s0, 0, z0), P(s0, d, z0), P(s0, d, z1), P(s0, 0, z1), [-u[0], -u[1], 0])
  fquad(p, P(s1, d, z0), P(s1, 0, z0), P(s1, 0, z1), P(s1, d, z1), [u[0], u[1], 0])
  if (top) fquad(p, P(s0, 0, z1), P(s0, d, z1), P(s1, d, z1), P(s1, 0, z1), [0, 0, 1])
  if (bottom) fquad(p, P(s1, 0, z0), P(s1, d, z0), P(s0, d, z0), P(s0, 0, z0), [0, 0, -1])
}

/** A window with a granite surround, flush-set: surround proud 0.12, glass 0.16. */
function windowAt(P: Parts, a: XY, b: XY, s: number, w: number, z0: number, z1: number, arched = false, detail = false) {
  proud(P.granite, a, b, s - w / 2 - 0.35, s + w / 2 + 0.35, z0 - 0.35, z1 + (arched ? 0.2 : 0.35), 0.12, true, true)
  onWall(P.win, a, b, s - w / 2, s + w / 2, z0, z1, 0.14)
  if (detail) proud(P.granite, a, b, s - w / 2 - 0.55, s + w / 2 + 0.55, z0 - 0.55, z0 - 0.35, 0.3, true, true) // the sill
}

/** A copper dome and lantern on a tower: an octagonal granite drum, a bell-shaped dome, a finial. */
function domedLantern(P: Parts, cx: number, cy: number, z0: number, rDrum: number, hDrum: number, hDome: number, finial: number, detail: boolean) {
  const k = detail ? 16 : 8
  const ring = (r: number, z: number, i: number): V3 => { const a = (i / k) * TAU + Math.PI / k; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] }
  // drum, with tall window slots on every other face
  for (let i = 0; i < k; i++) {
    const am = ((i + 0.5) / k) * TAU + Math.PI / k
    fquad(P.granite, ring(rDrum, z0, i), ring(rDrum, z0, i + 1), ring(rDrum, z0 + hDrum, i + 1), ring(rDrum, z0 + hDrum, i), [Math.cos(am), Math.sin(am), 0])
    if (i % 2 === 0 || !detail) {
      const t0 = 0.3, t1 = 0.7, A = ring(rDrum + 0.05, 0, i), B = ring(rDrum + 0.05, 0, i + 1)
      const L = (t: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z]
      fquad(P.win, L(t0, z0 + hDrum * 0.25), L(t1, z0 + hDrum * 0.25), L(t1, z0 + hDrum * 0.8), L(t0, z0 + hDrum * 0.8), [Math.cos(am), Math.sin(am), 0])
    }
  }
  // cornice ring, then the dome: a bell profile
  const prof: Array<[number, number]> = [[rDrum + 0.35, z0 + hDrum], [rDrum + 0.35, z0 + hDrum + 0.35], [rDrum * 1.0, z0 + hDrum + 0.4]]
  const nb = detail ? 8 : 4
  for (let j = 1; j <= nb; j++) {
    const t = j / nb, a = (t * Math.PI) / 2
    prof.push([rDrum * Math.cos(a) * (1 - 0.12 * Math.sin(2 * a)), z0 + hDrum + 0.4 + hDome * Math.sin(a) ** 1.15])
  }
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, za] = prof[j], [r1, zb] = prof[j + 1], part = j < 2 ? P.granite : P.copper
    for (let i = 0; i < k; i++) {
      const am = ((i + 0.5) / k) * TAU + Math.PI / k, e = Math.atan2(r0 - r1, zb - za)
      const N: V3 = [Math.cos(am) * Math.cos(e), Math.sin(am) * Math.cos(e), Math.sin(e)]
      if (r1 < 0.05) ftri(part, ring(r0, za, i), ring(r0, za, i + 1), [cx, cy, zb], N)
      else fquad(part, ring(r0, za, i), ring(r0, za, i + 1), ring(r1, zb, i + 1), ring(r1, zb, i), N)
    }
  }
  // ribs on the dome (detail): raised copper strips along the meridians
  if (detail) for (let i = 0; i < k; i += 2) {
    for (let j = 2; j < prof.length - 1; j++) {
      const a = (i / k) * TAU + Math.PI / k
      const p0: V3 = [cx + (prof[j][0] + 0.06) * Math.cos(a), cy + (prof[j][0] + 0.06) * Math.sin(a), prof[j][1]]
      const p1: V3 = [cx + (prof[j + 1][0] + 0.06) * Math.cos(a), cy + (prof[j + 1][0] + 0.06) * Math.sin(a), prof[j + 1][1]]
      beam(P.copper, p0, p1, 0.18, 0.12)
    }
  }
  const top = prof[prof.length - 1][1]
  beam(P.copper, [cx, cy, top - 0.1], [cx, cy, finial], 0.22, 0.22, [1, 0, 0], true)
  box(P.copper, cx - 0.35, cy - 0.35, cx + 0.35, cy + 0.35, top - 0.1, top + 0.5)
}

/** A square tower block over a footprint, granite, with a projecting cornice and an attic. */
function towerTop(P: Parts, x0: number, y0: number, x1: number, y1: number, z0: number, zc: number, attic: number) {
  box(P.granite, x0, y0, x1, y1, z0, zc, { top: false })
  box(P.granite, x0 - 0.45, y0 - 0.45, x1 + 0.45, y1 + 0.45, zc, zc + 0.8, { bottom: true, bevel: 0.25 })
  box(P.granite, x0 + 0.9, y0 + 0.9, x1 - 0.9, y1 - 0.9, zc + 0.8, attic, { bevel: 0.2 })
}

function build(detail: boolean): Mat[] {
  FLAT = !detail
  const P: Parts = { brick: new Part(), granite: new Part(), copper: new Part(), slate: new Part(), win: new Part(), door: new Part() }
  const R = OUTLINE

  // --- The body: brick walls to the cornice, granite above, a flat roof. --
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) continue
    onWall(P.brick, a, b, 0, L, 0, CORNICE, 0)
    onWall(P.granite, a, b, 0, L, CORNICE, PARAPET, 0)
    // cornice and balustrade cap, proud
    proud(P.granite, a, b, -0.4, L + 0.4, CORNICE - 0.2, CORNICE + 0.6, 0.55, true, true, true)
    proud(P.granite, a, b, 0, L, PARAPET - 0.25, PARAPET, 0.2)
    // the striped granite base: a plinth and four white bands
    if (L < 1.5) continue
    proud(P.granite, a, b, 0, L, 0, 1.0, 0.1)
    for (const z of [1.7, 2.75, 3.8, 4.85]) proud(P.granite, a, b, 0, L, z, z + 0.5, 0.07)
    // string course over the ground floor
    proud(P.granite, a, b, 0, L, 5.6, 5.95, 0.12)
    // quoins: granite strips at both ends of every edge
    if (L > 3) for (const [s0, s1] of [[0, 1.1], [L - 1.1, L]]) proud(P.granite, a, b, s0, s1, 1.0, CORNICE - 0.2, 0.09, false)
    // windows: a bay every ~4.6 m on edges long enough, three storeys
    if (L >= 5.5 && !(Math.abs(a[0] - 29.35) < 0.3 && Math.abs(b[0] - 29.35) < 0.3)) {
      const n = Math.max(1, Math.round((L - 2.4) / 4.6)), pitch = (L - 2.2) / n
      for (let k = 0; k < n; k++) {
        const s = 1.1 + pitch * (k + 0.5)
        windowAt(P, a, b, s, 1.3, 2.2, 4.4, false, detail)
        windowAt(P, a, b, s, 1.7, 7.0, 9.9, false, detail)
        windowAt(P, a, b, s, 1.7, 11.0, 13.4, false, detail)
        if (detail) proud(P.granite, a, b, s - 1.3, s + 1.3, 10.0, 10.35, 0.22) // a pediment ledge over the main floor
      }
    }
  }
  // flat roof under the mansards
  for (const [i, j, k] of triangulate(R)) ftri(P.slate, [R[i][0], R[i][1], PARAPET - 0.3], [R[j][0], R[j][1], PARAPET - 0.3], [R[k][0], R[k][1], PARAPET - 0.3], [0, 0, 1])

  // --- Mansards: over the main body and over each side wing. -------------
  const mansard = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, inset: number, dormers: boolean) => {
    const r0: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
    const r1: V3[] = [[x0 + inset, y0 + inset, z1], [x1 - inset, y0 + inset, z1], [x1 - inset, y1 - inset, z1], [x0 + inset, y1 - inset, z1]]
    const outN: V3[] = [[0, -1, 0.6], [1, 0, 0.6], [0, 1, 0.6], [-1, 0, 0.6]]
    for (let k = 0; k < 4; k++) fquad(P.slate, r0[k], r0[(k + 1) % 4], r1[(k + 1) % 4], r1[k], outN[k])
    fquad(P.slate, r1[0], r1[1], r1[2], r1[3], [0, 0, 1])
    // a copper ridge rim
    {
      const a0 = x0 + inset - 0.15, b0 = y0 + inset - 0.15, a1 = x1 - inset + 0.15, b1 = y1 - inset + 0.15, t = 0.5
      for (const [p0, q0, p1, q1] of [[a0, b0, a1, b0 + t], [a0, b1 - t, a1, b1], [a0, b0, a0 + t, b1], [a1 - t, b0, a1, b1]]) box(P.copper, p0, q0, p1, q1, z1 - 0.05, z1 + 0.3)
    }
    if (!dormers) return
    // dormers on the long sides: a small upright window with a round copper hood
    for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
      const n = Math.max(1, Math.round((x1 - x0 - 6) / (detail ? 6.5 : 9)))
      for (let k = 0; k < n; k++) {
        const x = x0 + 3 + ((x1 - x0 - 6) * (k + 0.5)) / n, yy = y - s * inset * 0.45, zd = z0 + (z1 - z0) * 0.45
        box(P.granite, x - 0.9, Math.min(yy, yy + s * 1.4), x + 0.9, Math.max(yy, yy + s * 1.4), z0 + 0.4, zd + 1.6, { top: false, sides: s < 0 ? 'sew' : 'new' })
        const yf = yy + s * 1.45
        fquad(P.win, [x - 0.55, yf, zd - 0.2], [x + 0.55, yf, zd - 0.2], [x + 0.55, yf, zd + 1.3], [x - 0.55, yf, zd + 1.3], [0, s, 0])
        // hood: a half cylinder along y
        const m = detail ? 6 : 3
        for (let q = 0; q < m; q++) {
          const a0 = (q / m) * Math.PI, a1 = ((q + 1) / m) * Math.PI, r = 1.05
          const Q = (a: number, yv: number): V3 => [x + r * Math.cos(a), yv, zd + 1.6 + r * Math.sin(a)]
          fquad(P.copper, Q(a0, yy), Q(a1, yy), Q(a1, yy + s * 1.6), Q(a0, yy + s * 1.6), [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)])
        }
        for (let q = 0; q < m; q++) {
          const a0 = (q / m) * Math.PI, a1 = ((q + 1) / m) * Math.PI, r = 1.05, yv = yy + s * 1.6
          ftri(P.copper, [x, yv, zd + 1.6], [x + r * Math.cos(a0), yv, zd + 1.6 + r * Math.sin(a0)], [x + r * Math.cos(a1), yv, zd + 1.6 + r * Math.sin(a1)], [0, s, 0])
        }
      }
    }
  }
  mansard(-28.2, -13.8, 25.2, 14.2, PARAPET - 0.3, MANSARD, 3.2, true)
  mansard(16.8, -21.3, 25.2, -14.6, PARAPET - 0.3, MANSARD - 1.5, 1.8, false)
  mansard(18.4, 14.6, 27.0, 20.7, PARAPET - 0.3, MANSARD - 1.5, 1.8, false)
  mansard(-29.1, -20.3, -20.5, -14.6, PARAPET - 0.3, MANSARD - 1.5, 1.8, false)
  mansard(-26.0, 14.6, -18.2, 22.0, PARAPET - 0.3, MANSARD - 1.5, 1.8, false)

  // --- The front towers, with domed lanterns. ----------------------------
  const TW = 8.9, CB = 8.1 // tower width (y), half the central bay
  const fronts: Array<[number, number]> = [[YC + CB, YC + CB + TW], [YC - CB - TW, YC - CB]]
  for (const [y0, y1] of fronts) {
    const x0 = 25.8, x1 = 31.8
    box(P.brick, x0, y0, x1, y1, 0, PARAPET, { top: false })
    // quoins, striped base, cornice band on the tower's front and sides
    const faces: Array<[XY, XY]> = [[[x1, y0], [x1, y1]], [[x0, y0], [x1, y0]], [[x1, y1], [x0, y1]]]
    for (const [a, b] of faces) {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      proud(P.granite, a, b, 0, L, 0, 1.0, 0.1)
      for (const z of [1.7, 2.75, 3.8, 4.85]) proud(P.granite, a, b, 0, L, z, z + 0.5, 0.07)
      for (const [s0, s1] of [[0, 1.3], [L - 1.3, L]]) proud(P.granite, a, b, s0, s1, 1.0, PARAPET, 0.14, false)
      proud(P.granite, a, b, -0.4, L + 0.4, CORNICE - 0.2, CORNICE + 0.6, 0.55, true, true, true)
      if (L > 7) {
        windowAt(P, a, b, L / 2, 1.5, 7.0, 9.9, false, detail)
        windowAt(P, a, b, L / 2, 1.5, 11.0, 13.4, false, detail)
        windowAt(P, a, b, L / 2, 1.3, 2.2, 4.4, true, detail)
      }
    }
    towerTop(P, x0, y0, x1, y1, PARAPET, 21.5, 23.2)
    // the upper stage's front: a brick panel in a granite frame round the oculus
    box(P.brick, x1, y0 + 1.5, x1 + 0.08, y1 - 1.5, PARAPET + 0.4, 21.0, { top: false, sides: 'e' })
    // the oculus on the tower's front (and on its outer side)
    wallDisc(P.granite, [x1 + 0.08, (y0 + y1) / 2, 19.2], [1, 0, 0], 1.6, detail ? 16 : 10)
    wallDisc(P.win, [x1 + 0.14, (y0 + y1) / 2, 19.2], [1, 0, 0], 1.05, detail ? 16 : 10)
    domedLantern(P, (x0 + x1) / 2, (y0 + y1) / 2, 23.2, 2.3, 2.4, 3.0, 31, detail)
  }

  // --- Side pavilion towers, lower, with smaller domes. ------------------
  const pav: Array<[number, number, number, number]> = [[10.4, 21.6, 17.6, 27.4], [10.4, -28.2, 16.0, -22.1], [-19.6, -26.9, -13.0, -21.1], [-17.4, 22.8, -12.3, 28.0]]
  for (const [x0, y0, x1, y1] of pav) {
    towerTop(P, x0, y0, x1, y1, PARAPET, 19.8, 20.9)
    domedLantern(P, (x0 + x1) / 2, (y0 + y1) / 2, 20.9, 1.8, 1.6, 2.2, 25.6, detail)
  }

  // --- The porch: podium, steps, four columns, entablature. --------------
  const XW = 29.35, XC = 31.1
  box(P.granite, XW, YC - CB, 32.2, YC + CB, 0, 1.5, { sides: 'nes' })
  const nSteps = 6
  for (let k = 0; k < nSteps; k++) {
    const xa = 32.2 + (k * 3.6) / nSteps, z = 1.5 - (k * 1.05) / (nSteps - 1)
    box(P.granite, xa, YC - 6.2, xa + 3.6 / nSteps + 0.01, YC + 6.2, 0, z, { sides: 'nes' })
  }
  const colY = [-7.1, -2.4, 2.3, 6.9].map((d) => YC + d)
  const kc = detail ? 16 : 8
  for (const y of colY) {
    // shaft (slight entasis), base and capital
    const prof: Array<[number, number]> = [[1.0, 1.5], [1.0, 2.0], [0.78, 2.2], [0.75, 6.5], [0.66, 11.9], [0.7, 12.0], [1.05, 12.7]]
    for (let j = 0; j < prof.length - 1; j++) {
      const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
      for (let i = 0; i < kc; i++) {
        const a0 = (i / kc) * TAU, a1 = ((i + 1) / kc) * TAU, e = Math.atan2(r0 - r1, z1 - z0)
        const N = (a: number): V3 => [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)]
        const Q = (r: number, a: number, z: number): V3 => [XC + r * Math.cos(a), y + r * Math.sin(a), z]
        P.granite.tri(Q(r0, a0, z0), Q(r0, a1, z0), Q(r1, a1, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
        P.granite.tri(Q(r0, a0, z0), Q(r1, a1, z1), Q(r1, a0, z1), undefined, undefined, undefined, [N(a0), N(a1), N(a0)])
      }
    }
    box(P.granite, XC - 1.15, y - 1.15, XC + 1.15, y + 1.15, 12.7, 13.1, { bottom: true }) // abacus
  }
  box(P.granite, XW, YC - CB, 32.1, YC + CB, 13.1, 15.0, { bottom: true, sides: 'nes' }) // entablature
  box(P.granite, XW, YC - CB, 32.5, YC + CB, 15.0, 15.6, { bottom: true, sides: 'nes' }) // its cornice
  // the recessed wall behind the columns: brick panels between granite, three doors, windows
  const wa: XY = [XW, YC - CB], wb: XY = [XW, YC + CB] // wall a→b facing +x (outside on the right)
  // walking from YC+CB to YC-CB keeps the outside (+x) on the right
  const fa: XY = [XW, YC - CB], fb: XY = [XW, YC + CB]
  void wa; void wb
  onWall(P.granite, fa, fb, 0, 2 * CB, 1.5, 17.4, 0.02)
  for (const d of [-4.75, 0, 4.75]) {
    const s = CB + d
    onWall(P.brick, fa, fb, s - 1.9, s + 1.9, 6.2, 12.4, 0.05)
    // door with a round head and a copper canopy
    onWall(P.door, fa, fb, s - 1.0, s + 1.0, 1.5, 4.6, 0.08)
    const m = detail ? 8 : 4
    for (let q = 0; q < m; q++) {
      const a0 = (q / m) * Math.PI, a1 = ((q + 1) / m) * Math.PI
      ftri(P.door, [XW + 0.08, YC + d, 4.6], [XW + 0.08, YC + d + 1.0 * Math.cos(a0), 4.6 + 1.0 * Math.sin(a0)], [XW + 0.08, YC + d + 1.0 * Math.cos(a1), 4.6 + 1.0 * Math.sin(a1)], [1, 0, 0])
    }
    box(P.copper, XW, YC + d - 1.7, XW + 1.6, YC + d + 1.7, 5.9, 6.15, { bottom: true })
    onWall(P.win, fa, fb, s - 0.8, s + 0.8, 7.2, 9.6, 0.09)
    onWall(P.win, fa, fb, s - 0.8, s + 0.8, 10.6, 12.0, 0.09)
  }

  // --- The great arch and the copper barrel vault behind it. --------------
  const ZS = 17.4, RI = 6.5, RO = 8.4, RH = 9.0, XF = 30.2, XB = 19
  // wall of the arch's face between the towers, up to the springing
  box(P.granite, XW - 0.2, YC - CB, XF, YC + CB, 15.6, ZS, { sides: 'e' })
  const nv = detail ? 27 : 15, nRed = (nv + 1) / 2, nWhite = (nv - 1) / 2, unitA = Math.PI / (nRed * 2 + nWhite)
  const edges: number[] = [0]
  for (let k = 0; k < nv; k++) edges.push(edges[k] + unitA * (k % 2 === 1 ? 1 : 2))
  for (let k = 0; k < nv; k++) {
    const a0 = edges[k], a1 = edges[k + 1]
    // alternate: red voussoirs and white ones, the white a third as wide
    const white = k % 2 === 1
    const part = white ? P.granite : P.brick
    const C = (r: number, a: number, x: number): V3 => [x, YC + r * Math.cos(a), ZS + r * Math.sin(a)]
    const am = (a0 + a1) / 2
    fquad(part, C(RI, a1, XF), C(RI, a0, XF), C(RO, a0, XF), C(RO, a1, XF), [1, 0, 0])
    // the soffit of the ring (facing in) down to the lunette's plane
    fquad(part, C(RI, a0, XF), C(RI, a1, XF), C(RI, a1, XF - 1.0), C(RI, a0, XF - 1.0), [0, -Math.cos(am), -Math.sin(am)])
  }
  // lunette: glass, divided into three lights by granite bars and a transom
  {
    const m = detail ? 24 : 12, xg = XF - 1.0
    for (let q = 0; q < m; q++) {
      const a0 = (q / m) * Math.PI, a1 = ((q + 1) / m) * Math.PI
      ftri(P.win, [xg, YC, ZS], [xg, YC + RI * Math.cos(a0), ZS + RI * Math.sin(a0)], [xg, YC + RI * Math.cos(a1), ZS + RI * Math.sin(a1)], [1, 0, 0])
    }
    for (const d of [-2.2, 2.2]) {
      const top = ZS + Math.sqrt(RI * RI - d * d)
      box(P.granite, xg, YC + d - 0.4, xg + 0.35, YC + d + 0.4, ZS, top, { top: false })
    }
    if (!detail) for (const d of [-4.3, 0, 4.3]) box(P.granite, xg, YC + d - 0.15, xg + 0.25, YC + d + 0.15, ZS + 0.4, ZS + Math.sqrt(RI * RI - d * d) - 0.2, { top: false })
    box(P.granite, xg, YC - RI, xg + 0.3, YC + RI, ZS - 0.1, ZS + 0.4)
    if (detail) {
      // the central light's round-headed mullion pair and the side lights' bars
      for (const d of [-0.8, 0.8]) box(P.granite, xg, YC + d - 0.12, xg + 0.25, YC + d + 0.12, ZS + 0.4, ZS + 5.6, { top: false })
      for (const d of [-4.3, 4.3]) box(P.granite, xg, YC + d - 0.15, xg + 0.25, YC + d + 0.15, ZS + 0.4, ZS + Math.sqrt(RI * RI - d * d) - 0.2, { top: false })
    }
  }
  // the copper hood over the ring and the barrel vault running back
  {
    const m = detail ? 28 : 14
    for (let q = 0; q < m; q++) {
      const a0 = (q / m) * Math.PI, a1 = ((q + 1) / m) * Math.PI, am = (a0 + a1) / 2
      const C = (r: number, a: number, x: number): V3 => [x, YC + r * Math.cos(a), ZS + r * Math.sin(a)]
      // the vault's outer skin
      P.copper.tri(C(RH, a0, XF + 0.5), C(RH, a1, XF + 0.5), C(RH, a1, XB), undefined, undefined, undefined, [[0, Math.cos(a0), Math.sin(a0)], [0, Math.cos(a1), Math.sin(a1)], [0, Math.cos(a1), Math.sin(a1)]])
      P.copper.tri(C(RH, a0, XF + 0.5), C(RH, a1, XB), C(RH, a0, XB), undefined, undefined, undefined, [[0, Math.cos(a0), Math.sin(a0)], [0, Math.cos(a1), Math.sin(a1)], [0, Math.cos(a0), Math.sin(a0)]])
      // the hood's front face, from the voussoirs out to the skin, proud of the ring
      fquad(P.copper, C(RO, a1, XF + 0.5), C(RO, a0, XF + 0.5), C(RH, a0, XF + 0.5), C(RH, a1, XF + 0.5), [1, 0, 0])
      fquad(P.copper, C(RO, a0, XF), C(RO, a1, XF), C(RO, a1, XF + 0.5), C(RO, a0, XF + 0.5), [0, -Math.cos(am), -Math.sin(am)])
      // the vault's back end: a granite half-disc
      ftri(P.granite, C(0, 0, XB), C(RH, a1, XB), C(RH, a0, XB), [-1, 0, 0])
    }
    // the hood's feet on the towers
    for (const s of [-1, 1]) box(P.copper, XF - 1, YC + s * RH - 0.6, XF + 0.6, YC + s * RH + 0.6, ZS - 0.6, ZS + 0.1)
  }

  const warm = (_p: V3, n: V3) => (n[2] > 0.6 ? 0.25 : 0.8)
  const mats: Array<[Part, MaterialSpec]> = [
    [P.brick, { ...finish('kokaido-brick', 0xc4623f), floodlight: warm }],
    [P.granite, { ...finish('kokaido-granite', 0xe9e6df), floodlight: warm }],
    [P.copper, finish('kokaido-verdigris', 0x74a68f)],
    [P.slate, finish('kokaido-slate', 0x5c6370)],
    [P.win, PALETTE.window],
    [P.door, { ...PALETTE.entrance, color: 0x55605d }],
  ]
  return mats.map(([part, material]) => ({ part, material }))
}

if (import.meta.main) {
  await writeLods('osaka-central-public-hall', 'Osaka City Central Public Hall', { bearing: 1.8, elevation: 0, height: 31 }, [
    { file: 'osaka-central-public-hall.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'osaka-central-public-hall.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
}
