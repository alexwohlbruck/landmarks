/**
 * Estádio da Luz (Estádio do Sport Lisboa e Benfica), Lisbon: original
 * procedural geometry, CC0-1.0, no textures.
 *   bun generators/lisbon-estadio-da-luz.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/lisbon-estadio-da-luz.glb, the low model (<= 6,500 triangles);
 * - models/lisbon-estadio-da-luz.detail.glb, drawn from zoom 16 (<= 40,000):
 *   the four arches as triangular trusses with their lacing, the hangers
 *   as a lattice of V's, finer red ribs on the roof, stepped tiers.
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 343.8 (the
 * principal axis of the outline): model +y runs along the pitch, +x across
 * it. Anchor = the centre of the outline (OSM way/71229178, leisure=
 * stadium, and way/657523802, outer of building relation/9143921, the
 * same ring), lng -9.1846895, lat 38.7526899. In this frame the outline is
 * an exact ellipse, 102.4 x 125.1 m half-axes (rms 0.1 m).
 *
 * Identity, in order: the four red steel arches over the roof, a long one
 * over each side and a shorter one over each end, springing from the four
 * corners and leaning in, with their red hangers; the grey roof with its
 * white membrane collar round the opening that flares out to the arches'
 * feet; the wavy line of the roof edge; red raked steel columns round the
 * dark facade; the three tiers of red seats.
 *
 * Evidence
 *  - OSM (measured in this frame): outline as above; relation/9143921
 *    building=stadium, height 43, 5 levels (3 underground), architect
 *    Damon Lavelle; the roof relation/16349886 (building=roof) between the
 *    arches' line (way/1209143790: corners at (+-63, +-94), sides bowed in
 *    to x +-57 and y +-80 at their middles) and the opening
 *    (way/657523805: x +-44, y +-66, superellipse exponent 4.9).
 *  - Published: pt/en.wikipedia "Estádio da Luz": opened 2003, 64,642
 *    seats, architect Damon Lavelle (HOK Sport); four arches carry the
 *    roof; the roof is translucent polycarbonate.
 *  - Heights: long arches' crowns 45 m and short 41 m, roof edge 28-31 m
 *    rising to 32 m at the opening, ESTIMATED from alves (the long side
 *    square on: the crown 1.55 times the roof edge's height) with OSM's
 *    43 m as the building's height; tiers ESTIMATED from w04, w05, w07.
 *  - Elevation 0: the map's Mapterhorn z15 terrain has the pitch at 1-2 m
 *    and the ground round the stadium 2-8 m (rising to the south-east);
 *    the facade runs down to the lowest ground.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - cism: Cismaciew, "Estadio da Luz, del equipo de Benfica en Lisboa
 *      Portugal.jpg", CC BY-SA 4.0: from a drone, the arches, the white
 *      collar and its flares, the grey roof and red ribs, the facade.
 *      https://commons.wikimedia.org/wiki/File:Estadio_da_Luz,_del_equipo_de_Benfica_en_Lisboa_Portugal.jpg
 *    - alves: Alvesgaspar, "Estadio Benfica April 2013-1.jpg", CC BY-SA
 *      3.0: the long side square on, the wavy roof edge, the facade.
 *      https://commons.wikimedia.org/wiki/File:Estadio_Benfica_April_2013-1.jpg
 *    - colombo13: Alvesgaspar, "Colombo May 2013-2.jpg", CC BY-SA 3.0.
 *      https://commons.wikimedia.org/wiki/File:Colombo_May_2013-2.jpg
 *    - w04, w05, w07, w10: Werner100359, "Estádio da Luz 04.jpg" etc., CC
 *      BY-SA 4.0: inside, the three tiers, red seats, the roof's underside
 *      and the arches over it; w10 the facade.
 *      https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_da_Luz_04.jpg
 *      https://commons.wikimedia.org/wiki/File:Est%C3%A1dio_da_Luz_10.jpg
 *    - luzliss: Massimo Catarinella, "LuzLissabon.jpg", CC BY 3.0: inside
 *      panorama. https://commons.wikimedia.org/wiki/File:LuzLissabon.jpg
 *  No lidar or NAIP exists here (outside the US); no commercial imagery.
 *
 * Invented or simplified, and doubts:
 *  - Arches are parabolas in inclined planes through the corner feet and
 *    the bowed crown line of OSM's roof part; their feet come down to the
 *    roof edge at the corners (29 m, cism), carried down to the ground by
 *    red corner legs (alves); their sections are drawn bold.
 *  - The hangers: verticals every 12 m (low) or V pairs (detail).
 *  - The roof edge's wave: 28 m at the middle of each side rising to 31 m
 *    towards the corners, as alves suggests; not measured.
 *  - Tiers are superellipse rakes; seats all red (the white lettering in
 *    the seats is left out).
 *  - The facade: 48 red columns, slightly raked outward, over a dark wall
 *    with two pale concourse slabs; the real columns, their braces and
 *    the stair cores vary.
 *  - Night: the roof underside floodlit, the concourse glazing `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { band, bar, writeLods } from './milan-san-siro'
import { se, face, vadd, vsub, vmul, vlerp, nrm3, crs } from './seoul-world-cup-stadium'

const BEARING = 343.8

type SE = [number, number, number]
const OUTER: SE = [102.4, 125.1, 2.0]
const OPEN: SE = [44, 66, 4.9]
const T1F: SE = [40, 60, 3.5]
const T1B: SE = [62, 84, 2.8]
const T2F: SE = [64, 86, 2.7]
const T2B: SE = [73, 95, 2.5]
const T3F: SE = [75, 97, 2.4]
const T3B: SE = [96, 118, 2.1]
const FEET: [number, number][] = [[65, 97], [-65, 97], [-65, -97], [65, -97]] // OSM's corners (+-63, +-94) pushed out to the edge
const SPRING = 29 // the arches spring from the roof edge at the corners

const edgeZ = (f: number) => 28 + 3 * (1 - Math.abs(Math.cos(2 * f)))
const OPEN_Z = 32

function build(detail: boolean) {
  const red = new Part(), roof = new Part(), white = new Part(), concrete = new Part(), win = new Part(), dark = new Part()
  const N = detail ? 160 : 64
  const phis = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
  const P = (s: SE, f: number, z: number, grow = 0): V3 => {
    const r = se(f, s[0], s[1], s[2]) + grow
    return [r * Math.cos(f), r * Math.sin(f), z]
  }
  const R = (s: SE, z: number | ((f: number) => number), grow = 0) => phis.map((f) => P(s, f, typeof z === 'number' ? z : z(f), grow))
  const IN = (q: V3): V3 => [-q[0], -q[1], 0]
  const OUT = (q: V3): V3 => [q[0], q[1], 0]
  const UP = (): V3 => [0, 0, 1]
  const DOWN = (): V3 => [0, 0, -1]
  const SEAT = (q: V3): V3 => [-q[0], -q[1], 140]

  // --- Three tiers of red seats with box bands between.
  const rake = (A: SE, za: number, B: SE, zb: number, steps: number) => {
    if (!detail) { band(red, R(A, za), R(B, zb), SEAT); return }
    for (let s = 0; s < steps; s++) {
      const a = phis.map((f) => vlerp(P(A, f, za), P(B, f, zb), s / steps)), b = phis.map((f) => vlerp(P(A, f, za), P(B, f, zb), (s + 1) / steps))
      const ar = a.map((q, k) => [q[0], q[1], b[k][2]] as V3)
      band(red, a, ar, IN)
      band(red, ar, b, UP)
    }
  }
  band(concrete, R(T1F, 0), R(T1F, 1.5), IN)
  rake(T1F, 1.5, T1B, 11, 9)
  band(win, R(T1B, 11), R(T1B, 13.5), IN)
  band(concrete, R(T1B, 13.5), R(T2F, 14), UP)
  rake(T2F, 14, T2B, 19, 5)
  band(win, R(T2B, 19), R(T2B, 21.5), IN)
  band(concrete, R(T2B, 21.5), R(T3F, 21.5), UP)
  rake(T3F, 21.5, T3B, 30, 8)

  // --- The facade: a dark wall, two pale concourse slabs, the red raked columns.
  band(dark, R(OUTER, 0, -4), R(OUTER, 26, -4), OUT)
  band(win, R(OUTER, 2, -3.95), R(OUTER, 8, -3.95), OUT)
  for (const z of [9, 18]) {
    band(concrete, R(OUTER, z - 1, -2.4), R(OUTER, z, -2.4), OUT)
    band(concrete, R(OUTER, z, -4), R(OUTER, z, -2.4), UP)
    if (detail) band(concrete, R(OUTER, z - 1, -4), R(OUTER, z - 1, -2.4), DOWN)
  }
  band(dark, R(OUTER, 26, -4), R(T3B, 30, 0.5), UP)
  {
    const NC = 48
    for (let c = 0; c < NC; c++) {
      const f0 = (c / NC) * 2 * Math.PI
      const a = P(OUTER, f0, 0, -1.6), b = P(OUTER, f0, edgeZ(f0) - 0.6, -0.2)
      bar(red, a, b, detail ? 1.0 : 1.4, detail ? 1.0 : 1.4, [Math.cos(f0), Math.sin(f0), 0], false)
    }
  }

  // --- The roof: grey from the wavy edge up to the opening, the white
  // membrane collar round the opening flaring to the arches' feet.
  {
    const footAng = FEET.map(([x, y]) => Math.atan2(y, x))
    const flare = (f: number) => {
      let best = 0
      for (const a of footAng) {
        const d = Math.abs(Math.atan2(Math.sin(f - a), Math.cos(f - a)))
        best = Math.max(best, Math.max(0, 1 - d / 0.2))
      }
      return Math.pow(best, 1.5)
    }
    const at = (f: number, t: number): V3 => {
      // t = 0 at the opening, 1 at the edge
      const a = P(OPEN, f, OPEN_Z), b = P(OUTER, f, edgeZ(f), 0.5)
      return vlerp(a, b, t)
    }
    const collar = (f: number) => {
      const ro = se(f, OPEN[0], OPEN[1], OPEN[2]), re = se(f, OUTER[0], OUTER[1], OUTER[2])
      const w = 10 + (re - ro - 14) * flare(f)
      return Math.min(0.92, w / (re - ro))
    }
    const K = detail ? 3 : 1
    const C = phis.map((f) => at(f, collar(f)))
    band(white, phis.map((f) => at(f, 0)), C, UP)
    for (let k = 0; k < K; k++) {
      const A = phis.map((f, i) => vlerp(C[i], at(f, 1), k / K)), B = phis.map((f, i) => vlerp(C[i], at(f, 1), (k + 1) / K))
      band(roof, A, B, UP)
    }
    // underside, edges
    band(concrete, phis.map((f) => vadd(at(f, 0), [0, 0, -1.2])), phis.map((f) => vadd(at(f, 1), [0, 0, -1.2])), DOWN)
    band(white, phis.map((f) => vadd(at(f, 0), [0, 0, -1.2])), phis.map((f) => at(f, 0)), IN)
    band(white, phis.map((f) => vadd(at(f, 1), [0, 0, -1.8])), phis.map((f) => vadd(at(f, 1), [0, 0, 0.3])), OUT) // the white fascia, the wavy line
    {
      // red ribs on the grey roof
      for (let i = 0; i < N; i += detail ? 4 : 2) {
        const f = phis[i]
        bar(red, vadd(at(f, collar(f)), [0, 0, 0.3]), vadd(at(f, 1), [0, 0, 0.3]), detail ? 0.5 : 0.9, 0.4, [0, 0, 1], false)
      }
    }
  }

  // --- The four arches and their hangers.
  {
    const arch = (A: [number, number], B: [number, number], bow: number, crown: number) => {
      // parabola from foot A to foot B (z = 0), its crown pushed in by `bow` towards the centre
      const M: [number, number] = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
      const ml = Math.hypot(M[0], M[1])
      const inward: [number, number] = [-M[0] / ml, -M[1] / ml]
      const S = detail ? 28 : 14
      const pt = (t: number): V3 => {
        const u = 4 * t * (1 - t)
        return [A[0] + (B[0] - A[0]) * t + inward[0] * bow * u, A[1] + (B[1] - A[1]) * t + inward[1] * bow * u, SPRING + (crown - SPRING) * u]
      }
      const pts = Array.from({ length: S + 1 }, (_, k) => pt(k / S))
      if (!detail) {
        for (let k = 0; k < S; k++) bar(red, pts[k], pts[k + 1], 2.6, 2.6, [0, 0, 1], false)
      } else {
        // triangular truss: two lower chords and one upper, laced
        const chords = (k: number) => {
          const p = pts[k], q = pts[Math.min(S, k + 1)], o = pts[Math.max(0, k - 1)]
          const t = nrm3(vsub(q, o))
          const side = nrm3(crs(t, [0, 0, 1]))
          const up = crs(side, t)
          return [vadd(p, vmul(up, 1.6)), vadd(p, vadd(vmul(side, 1.5), vmul(up, -1.0))), vadd(p, vadd(vmul(side, -1.5), vmul(up, -1.0)))]
        }
        const CH = pts.map((_, k) => chords(k))
        for (let k = 0; k < S; k++) {
          for (let c = 0; c < 3; c++) bar(red, CH[k][c], CH[k + 1][c], 0.9, 0.9, [0, 0, 1], false)
          for (let c = 0; c < 3; c++) bar(red, CH[k][c], CH[k + 1][(c + 1) % 3], 0.4, 0.4, [0, 0, 1], false)
        }
      }
      // hangers from the arch down to the roof below it
      const H = detail ? 22 : 11
      for (let h = 1; h < H; h++) {
        const t = h / H
        const p = pt(t)
        const f = Math.atan2(p[1], p[0])
        const rr = Math.hypot(p[0], p[1])
        const ro = se(f, OPEN[0], OPEN[1], OPEN[2]), re = se(f, OUTER[0], OUTER[1], OUTER[2]) + 0.5
        const tt = Math.min(1, Math.max(0, (rr - ro) / (re - ro)))
        const zr = OPEN_Z + (edgeZ(f) - OPEN_Z) * tt
        if (p[2] < zr + 2) continue
        if (!detail) bar(red, vadd(p, [0, 0, -1.3]), [p[0], p[1], zr], 0.9, 0.9, [Math.cos(f), Math.sin(f), 0], false)
        else for (const d of [-1, 1]) {
          const q = pt(Math.min(1, Math.max(0, t + d * 0.5 / H)))
          bar(red, vadd(p, [0, 0, -1.0]), [q[0], q[1], zr + 0.2], 0.45, 0.45, [Math.cos(f), Math.sin(f), 0], false)
        }
      }
    }
    // the corner legs: red columns from the ground up to the arches' feet
    for (const [x, y] of FEET) bar(red, [x, y, 0], [x, y, SPRING + 0.5], detail ? 2.4 : 2.6, detail ? 2.4 : 2.6, [x, y, 0], true)
    arch(FEET[3], FEET[0], 6, 45) // east (long)
    arch(FEET[1], FEET[2], 6, 45) // west (long)
    arch(FEET[0], FEET[1], 14, 42) // north (end)
    arch(FEET[2], FEET[3], 14, 42) // south (end)
  }

  const under = (_p: V3, n: V3) => (n[2] < -0.5 ? 0.8 : 0.2)
  return [
    { part: red, material: finish('luz-red', 0xc23f3c) },
    { part: roof, material: finish('luz-roof', 0xa9adb0) },
    { part: white, material: finish('luz-membrane', 0xf0eee9) },
    { part: concrete, material: { ...finish('luz-concrete', 0xcbc8c1), floodlight: under } },
    { part: win, material: { ...PALETTE.window, color: 0x5e6a75 } },
    { part: dark, material: finish('luz-dark', 0x5c6168) },
  ]
}

if (import.meta.main)
  await writeLods('Estádio da Luz', { bearing: BEARING, elevation: 0, height: 45 }, [
    { file: 'lisbon-estadio-da-luz.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'lisbon-estadio-da-luz.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
