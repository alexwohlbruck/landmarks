/**
 * Mausoleum of Mohammed V, Rabat (Eric Vo Toan, 1961-71), with its mosque:
 * procedural, CC0-1.0.
 * bun generators/rabat-mausoleum-mohammed-v.ts
 *
 * Uses the Moroccan kit exported from casablanca-hassan-ii-mosque.ts.
 *
 * Frame: the Hassan Tower esplanade's grid, x along bearing 65.6, y along
 * 335.6 (toward the Hassan Tower), z up, metres. Placed at bearing 335.6:
 * every OSM edge here runs 65.6 / 155.6 degrees. Anchor: the area centroid
 * of the mausoleum's outline way/278577671, -6.821425, 34.02266.
 *
 * What is included: the mausoleum (outline way/278577671 and its parts),
 * the terrace it stands on (way/485022662), and the royal mosque that
 * adjoins the terrace on the west (relation/7150024 with its gallery roofs
 * and gate frames). The mosque is a separate OSM building, not part of the
 * mausoleum's outline, but it is built against the terrace as one
 * ensemble, so it is drawn and replaced here. The open marble pavilion
 * some photos show beside the mausoleum is not mapped and is left out.
 *
 * Evidence
 * - OSM (ODbL), fetched 2026-11: mausoleum way/278577671 (min 6, h 20)
 *   with parts way/486655925 (6-18), way/485144561 (18-24),
 *   way/485659368 (22-28), the green pyramidal roof way/484636436 (28-32)
 *   and the finial way/485144564 (32-33); the terrace way/485022662 (h 6);
 *   the mosque relation/7150024 (outer way/278577672, courtyard
 *   way/474159843, h 10) with its green gallery roofs way/484842415,
 *   /416, way/485144562, /563, way/486584471, /476, /479 (10-12) and the gate
 *   frames way/485017195-197 (h 11).
 * - Photos (Wikimedia Commons):
 *   hughes: File:Morocco_-_Mausoleum_of_Mohammed_V.jpg, P. Hughes, CC BY 4.0 (three-quarter view: every stage)
 *   umaima: File:Rabat_-_Mausoleum_of_Mohammed_V_-_2024-10-14.jpg, UmaimaJM, CC BY-SA 4.0 (the north front)
 *   mi01: File:Mausoleum_of_Mohammed_V_01.jpg, IssamBarhoumi, CC BY-SA 4.0
 *   photo2023: File:Mausoleo_di_Mohammed_V_2.jpg, Photo2023, CC BY 4.0 (the loggia arches and sebka)
 *   roofline: File:Mausoleum_of_Mohammed_V,_Rabat_-_roofline.jpg, Aemazy, CC BY-SA 4.0
 *   milos: File:Rabat,_old_and_new_(Mausoleum_of_Mohammed_V_and_new_Mohammed_VI_Tower_behind;_...).jpg, Petar Milošević, CC BY-SA 4.0
 *   both: File:Hassan_Mosque_&_Mausoleum_of_Mohammed_V,_Rabat.jpg, Aemazy, CC BY-SA 4.0 (the mosque's north wall)
 *   s_2: File:"Ein_architektonisches_Meisterwerk"_Mausoleum_of_Mohamed_V_2.jpg, Holger Uwe Schmitt, CC BY-SA 4.0
 * - Map terrain (Mapterhorn z12): 25-26 m at the terrace, rising to 28 m
 *   at the mosque's south side; it falls to the river east.
 *
 * Numbers
 * - Footprints: OSM. Heights: the terrace 6 m and the main walls to 16.8 m
 *   with merlons to 18 (OSM); the upper storey's walls 21.5 with merlons
 *   to 22.7, the pyramid 24-30.6 and the finial to 32.5, scaled from the
 *   hughes and umaima photos (upper storey about 0.4 of the main wall,
 *   pyramid about 0.6 of its base); OSM puts the roof at 28-32 and the
 *   finial at 33, a metre or two higher.
 * - Loggias: three lobed arches on the north and south fronts, the middle
 *   one wider (photos); three on each long side's projecting middle.
 *   Sebka panels over the arches, from photo2023.
 * - Mosque: walls 10 m (OSM) with stepped merlons, green gallery roofs to
 *   12; its gates and courtyard arcade bays estimated from the photos.
 * - Look-only references: none.
 * - Doubts: the terrace's 6 m (OSM) reads as 3-4 m on the esplanade side
 *   in the photos; the model keeps OSM's figure, which the falling ground
 *   east of the site bears out. The mosque's south and west sides have no
 *   good photo and repeat the north wall's treatment.
 *
 * Night: the marble is floodlit (`_FLOODLIGHT`); the loggias glow
 * (`window`).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { writeModel } from './london-buckingham-palace'
import { PALETTE, finish } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'
import {
  arch, ball, block, ccw, edgeFace, flood, fquad, ftri, inlay, lathe, merlons, prism, pyramid, rectRing, rectST, sebka, wall,
  type Niche, type XY,
} from './casablanca-hassan-ii-mosque'

export const ID = 'rabat-mausoleum-mohammed-v'
export const BEARING = 335.6


/**
 * The map's ground above the model's base round the mosque, read from the
 * Mapterhorn z12 grid (stored by z = -y, south positive, as the terrain tool prints it), so its doors and arcades start at the ground they open onto: the
 * site rises some 3 m from the mosque's north wall to its south wall.
 */
const GX = [-80, -70, -60, -50, -40, -30, -20], GZ = [-30, -20, -10, 0, 10, 20, 30]
const GT = [
  [25.7, 25.5, 24.8, 24.3, 24.4, 24.5, 24.8], [26.4, 26.2, 25.6, 25.2, 25.1, 25.4, 25.6], [27.2, 26.8, 26.3, 25.9, 25.8, 26.0, 26.0],
  [27.5, 27.4, 27.1, 26.5, 26.4, 26.4, 26.5], [27.8, 27.7, 27.2, 26.9, 26.8, 26.8, 27.0], [28.1, 27.8, 27.4, 27.2, 27.1, 27.2, 27.2],
  [28.2, 28.0, 27.6, 27.3, 27.3, 27.3, 27.2],
]
function ground(x: number, y: number) {
  const z = -y, cl = (v: number, n: number) => Math.max(0, Math.min(n - 1.001, v))
  const i = cl((x - GX[0]) / 10, GX.length), j = cl((z - GZ[0]) / 10, GZ.length)
  const i0 = Math.floor(i), j0 = Math.floor(j), tx = i - i0, tz = j - j0
  const v = GT[j0][i0] * (1 - tx) * (1 - tz) + GT[j0][i0 + 1] * tx * (1 - tz) + GT[j0 + 1][i0] * (1 - tx) * tz + GT[j0 + 1][i0 + 1] * tx * tz
  return Math.max(0, v - 24.77)
}

type M = { marble: Part; shade: Part; ochre: Part; roof: Part; win: Part; gold: Part }

/** A hipped roof over a quadrilateral: the ridge joins its short sides' midpoints, pulled in. */
function quadHip(p: Part, q: XY[], z0: number, z1: number) {
  const L = (i: number) => Math.hypot(q[(i + 1) % 4][0] - q[i][0], q[(i + 1) % 4][1] - q[i][1])
  const k = L(0) + L(2) < L(1) + L(3) ? 0 : 1 // edges k and k+2 are the short ones
  const mid = (i: number): XY => [(q[i][0] + q[(i + 1) % 4][0]) / 2, (q[i][1] + q[(i + 1) % 4][1]) / 2]
  const m0 = mid(k), m1 = mid(k + 2), len = Math.hypot(m1[0] - m0[0], m1[1] - m0[1])
  const inset = Math.min(len / 2, (L(k) + L(k + 2)) / 4)
  const dir: XY = [(m1[0] - m0[0]) / len, (m1[1] - m0[1]) / len]
  const r0: V3 = [m0[0] + dir[0] * inset, m0[1] + dir[1] * inset, z1], r1: V3 = [m1[0] - dir[0] * inset, m1[1] - dir[1] * inset, z1]
  const c: XY = [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4]
  const P = (i: number): V3 => [q[i % 4][0], q[i % 4][1], z0]
  const up = (a: V3, b: V3): V3 => { const mx = (a[0] + b[0]) / 2 - c[0], my = (a[1] + b[1]) / 2 - c[1]; return [mx, my, Math.hypot(mx, my) + 0.01] }
  // short edge k: triangle to r0; long edge k+1: to r0,r1; short k+2: r1; long k+3: r1,r0
  ftri(p, P(k), P(k + 1), r0, up(P(k), P(k + 1)))
  fquad(p, P(k + 1), P(k + 2), r1, r0, up(P(k + 1), P(k + 2)))
  ftri(p, P(k + 2), P(k + 3), r1, up(P(k + 2), P(k + 3)))
  fquad(p, P(k + 3), P(k + 4), r0, r1, up(P(k + 3), P(k + 4)))
}

function build(): M {
  const m: M = { marble: new Part(), shade: new Part(), ochre: new Part(), roof: new Part(), win: new Part(), gold: new Part() }

  // ── The terrace (ochre stone, a white balustrade along its edge).
  const TERRACE: XY[] = ccw([[-17.85, 7.11], [-13.7, 7.12], [-13.58, -7.61], [-17.49, -7.63], [-17.39, -19.47], [0.64, -19.41], [15.93, -19.36], [15.88, -12.91], [17.01, -12.91], [19.29, -12.9], [19.18, -0.38], [19.08, 12.54], [16.06, 12.53], [16.01, 19.36], [9.25, 19.34], [9.2, 26.69], [6.53, 26.68], [1.59, 26.66], [0.25, 26.65], [-5.27, 26.65], [-9.32, 26.62], [-9.25, 19.1], [-14.38, 19.08], [-17.95, 19.07]])
  const TT = 6
  TERRACE.forEach((a, i) => {
    const b = TERRACE[(i + 1) % TERRACE.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 0.05) return
    const n: Niche[] = []
    wall(m.ochre, edgeFace(a, b, 0), rectST(0, L, 0, TT), n)
    // balustrade, flush with the terrace edge, not over the north steps
    const f = edgeFace(a, b, TT), nrm: V3 = [f.u[1], -f.u[0], 0]
    if (Math.min(a[1], b[1]) > 26) return
    const Q = (s: number, t: number, d: number): V3 => [a[0] + f.u[0] * s + nrm[0] * d, a[1] + f.u[1] * s + nrm[1] * d, TT + t]
    fquad(m.marble, Q(0, 0, 0), Q(L, 0, 0), Q(L, 1.0, 0), Q(0, 1.0, 0), nrm)
    fquad(m.marble, Q(0, 1.0, 0), Q(L, 1.0, 0), Q(L, 1.0, -0.35), Q(0, 1.0, -0.35), [0, 0, 1])
    fquad(m.marble, Q(L, 0, -0.35), Q(0, 0, -0.35), Q(0, 1.0, -0.35), Q(L, 1.0, -0.35), [-nrm[0], -nrm[1], 0])
  })
  for (const [a, b, c] of polyTris(TERRACE)) ftri(m.marble, [a[0], a[1], TT], [b[0], b[1], TT], [c[0], c[1], TT], [0, 0, 1])

  // ── The mausoleum: a white marble block with loggias, sebka, merlons.
  const OUT: XY[] = ccw([[7.51, 12.52], [7.51, 7.09], [8.42, 7.08], [8.42, -7.45], [7.68, -7.45], [7.67, -12.57], [-7.47, -12.46], [-7.47, -7.32], [-8.49, -7.31], [-8.48, 7.08], [-7.53, 7.08], [-7.52, 12.62]])
  const W0 = TT, W1 = 16.8
  OUT.forEach((a, i) => {
    const b = OUT[(i + 1) % OUT.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), f = edgeFace(a, b, W0)
    const n: Niche[] = []
    if (L > 10) {
      // three lobed arches: the middle one wider and taller
      const arches: [number, number, number][] = [[L / 2, 2.1, 3.6], [L / 2 - 4.5, 1.5, 3.0], [L / 2 + 4.5, 1.5, 3.0]]
      for (const [s, hw, ts] of arches) n.push({ poly: arch(s - hw, s + hw, 0.05, ts, 'horseshoe', 6), depth: 1.8, back: m.win, reveal: m.marble })
      n.push({ poly: rectST(L / 2 - 6.2, L / 2 + 6.2, 6.8, 9.8), depth: 0.2, back: m.marble, reveal: m.marble,
        kids: sebka(m.shade, L / 2 - 6.05, L / 2 + 6.05, 6.85, 9.75, 1.75, 1.45, 0).map((d) => inlay(d.poly, m.shade)) })
    } else if (L > 4) {
      n.push({ poly: rectST(0.7, L - 0.7, 1.0, 9.8), depth: 0.2, back: m.marble, reveal: m.marble,
        kids: [{ poly: arch(L / 2 - 1.0, L / 2 + 1.0, 1.1, 3.4, 'horseshoe', 4), depth: 0.8, back: m.win },
          ...sebka(m.shade, 0.85, L - 0.85, 6.8, 9.7, 1.4, 1.45, 0).map((d) => inlay(d.poly, m.shade))] })
    }
    wall(m.marble, f, rectST(0, L, 0, W1 - W0), n)
    if (L > 1.5) merlons(m.marble, f, 0, L, W1 - W0, Math.max(1, Math.round(L / 1.75)), 1.05, 1.2, 0.5, 2)
  })
  for (const [a, b, c] of polyTris(OUT)) ftri(m.marble, [a[0], a[1], W1], [b[0], b[1], W1], [c[0], c[1], W1], [0, 0, 1])
  // the carved frieze under the merlons
  block(m.shade, -8.55, -7.5, 8.55, 7.15, W1 - 0.9, W1 - 0.6, 0)
  // Upper storey, set back, merlons; the drum and the green pyramid.
  const U = rectRing(-6.0, -9.0, 6.1, 10.6)
  U.forEach((a, i) => {
    const b = U[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), f = edgeFace(a, b, W1)
    wall(m.marble, f, rectST(0, L, 0, 21.5 - W1), [{ poly: rectST(0.8, L - 0.8, 1.0, 4.0), depth: 0.15, back: m.marble, reveal: m.marble,
      kids: sebka(m.shade, 0.9, L - 0.9, 1.1, 3.9, 1.3, 1.4, 0).map((d) => inlay(d.poly, m.shade)) }])
    merlons(m.marble, f, 0, L, 21.5 - W1, Math.round(L / 1.9), 1.0, 1.2, 0.45, 2)
  })
  prism(m.marble, rectRing(-5.0, -6.7, 5.1, 8.9), 21.5, 24.0, true)
  pyramid(m.roof, rectRing(-5.3, -7.0, 5.4, 9.2), 24.0, [0.05, 1.1, 30.6])
  lathe(m.gold, 0.05, 1.1, [[0.12, 30.2], [0.1, 32.4], [0, 32.5]], 6)
  ball(m.gold, [0.05, 1.1, 31.2], 0.42, 8)
  ball(m.gold, [0.05, 1.1, 31.9], 0.3, 6)

  // ── The mosque: ochre walls with merlons, green gallery roofs round its court.
  const MOS: XY[] = ccw([[-73.66, 18.86], [-73.66, 19.38], [-64.25, 19.5], [-59.91, 19.56], [-47.66, 19.71], [-42.86, 19.77], [-30.95, 19.91], [-26.16, 19.96], [-18.03, 20.06], [-17.95, 19.07], [-17.85, 7.11], [-17.49, -7.63], [-17.39, -19.47], [-38.1, -19.7], [-38.07, -21.18], [-50.5, -21.33], [-50.54, -19.66], [-72.98, -19.94], [-73.19, -7.72], [-73.43, 6.0]])
  const COURT: XY[] = ccw([[-64.1, 12.78], [-26.86, 12.72], [-26.82, 2.07], [-64.05, 2.12]])
  const MH = 10
  const merged = MOS.filter((p, i) => { const q = MOS[(i + MOS.length - 1) % MOS.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.8 })
  merged.forEach((a, i) => {
    const b = merged[(i + 1) % merged.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (a[0] > -18.2 && b[0] > -18.2) return // against the terrace
    const f = edgeFace(a, b, 0), n: Niche[] = []
    if (L > 6) {
      const cnt = Math.max(1, Math.round(L / 9))
      for (let k = 0; k < cnt; k++) {
        const s = (L * (k + 0.5)) / cnt
        const g = ground(a[0] + f.u[0] * s, a[1] + f.u[1] * s) + 0.25
        n.push({ poly: arch(s - 1.5, s + 1.5, g, g + 4.4, 'horseshoe', 4), depth: 0.9, back: m.shade, reveal: m.ochre })
      }
    }
    wall(m.ochre, f, rectST(0, L, 0, MH), n)
    merlons(m.ochre, f, 0, L, MH, Math.max(1, Math.round(L / 3.2)), 1.6, 1.3, 0.6, 1)
  })
  const cw = [...COURT].reverse()
  cw.forEach((a, i) => {
    const b = cw[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n: Niche[] = []
    const cnt = Math.max(1, Math.round(L / 5))
    for (let k = 0; k < cnt; k++) {
      const s = (L * (k + 0.5)) / cnt, g = ground(a[0] + (b[0] - a[0]) * (s / L), a[1] + (b[1] - a[1]) * (s / L)) + 0.25
      n.push({ poly: arch(s - 1.6, s + 1.6, g, g + 4.4, 'horseshoe', 4), depth: 1.6, back: m.shade, reveal: m.ochre })
    }
    wall(m.ochre, edgeFace(a, b, 0), rectST(0, L, 0, MH), n)
  })
  for (const [a, b, c] of polyTris(merged, [COURT])) ftri(m.ochre, [a[0], a[1], MH - 0.4], [b[0], b[1], MH - 0.4], [c[0], c[1], MH - 0.4], [0, 0, 1])
  for (const q of [
    [[-22.12, -7.04], [-68.31, -7.25], [-68.35, -3.16], [-22.16, -2.96]],
    [[-26.86, 12.72], [-22.35, 18.39], [-68.57, 18.25], [-64.1, 12.78]],
    [[-21.99, -10.58], [-22.12, -7.04], [-68.31, -7.25], [-68.17, -11.2]],
    [[-68.2, -11.17], [-68.1, -15.1], [-21.84, -13.97], [-22.02, -10.54]],
    [[-26.82, 2.07], [-64.05, 2.12], [-68.35, -3.16], [-22.16, -2.96]],
    [[-64.1, 12.78], [-68.57, 18.25], [-68.35, -3.16], [-64.05, 2.12]],
    [[-22.16, -2.96], [-22.35, 18.39], [-26.86, 12.72], [-26.82, 2.07]],
  ] as XY[][]) quadHip(m.roof, ccw(q), MH - 0.4, 12)
  // the three gate frames on the north wall, proud of it
  for (const [x0, x1] of [[-30.96, -26.16], [-64.25, -59.91], [-47.66, -42.86]]) {
    const y = 19.75 + (x0 + 73) * 0.0034
    block(m.ochre, x0, y, x1, y + 0.75, 0, 11, 0)
    const f = edgeFace([x1, y + 0.8], [x0, y + 0.8], 0), L = x1 - x0
    wall(m.ochre, { ...f, o: [f.o[0], f.o[1], 0] }, rectST(0, L, 0.2, 10.8), [{ poly: rectST(0.5, L - 0.5, 1.2, 9.4), depth: 0.25, back: m.ochre, reveal: m.ochre,
      kids: [{ poly: arch(L / 2 - 1.4, L / 2 + 1.4, Math.max(1.3, ground((x0 + x1) / 2, y + 1) + 0.25), 5.6, 'horseshoe', 6), depth: 1.0, back: m.shade },
        ...sebka(m.shade, 0.8, L - 0.8, 7.4, 9.2, 1.0, 0.9, 0).map((d) => inlay(d.poly, m.shade))] }])
  }
  return m
}

function materials(m: M): Array<{ part: Part; material: MaterialSpec }> {
  const lit = flood()
  return [
    { part: m.marble, material: { ...finish('mohammed-v-marble', 0xf2ece2), floodlight: lit } },
    { part: m.shade, material: { ...finish('mohammed-v-relief', 0xcdc0aa), floodlight: (p: V3, n: V3) => lit(p, n) * 0.7 } },
    { part: m.ochre, material: { ...finish('mohammed-v-ochre', 0xcf9f72), floodlight: lit } },
    { part: m.roof, material: finish('mohammed-v-green-tile', 0x4f7f5d, 0.55) },
    { part: m.win, material: PALETTE.window },
    { part: m.gold, material: { ...finish('mohammed-v-gold', 0xc9a24a, 0.45), floodlight: () => 0.6 } },
  ].filter(({ part }) => part.triangles > 0)
}

if (import.meta.main) {
  writeModel('Mausoleum of Mohammed V', ID, materials(build()), { bearing: BEARING, elevation: 0, height: 32.5 }, 6500)
}
