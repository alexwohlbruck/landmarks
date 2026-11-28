/**
 * KLIA Satellite Building A (Kisho Kurokawa, opened 1998) — procedural,
 * CC0-1.0, no textures.
 * bun generators/kl-klia-satellite-a.ts
 *
 * Writes models/kl-klia-satellite-a.glb (low) and
 * models/kl-klia-satellite-a.detail.glb (detail: finer roofs, mullions).
 *
 * Map frame: x = east, y = north, z up, metres, turned to bearing 325.9
 * (the airport grid, as for kl-klia-terminal-1: the satellite's arms run
 * along x and y). Anchor: area centroid of the OSM outline relation/4504617
 * (101.7135996, 2.7479883).
 *
 * The satellite is an X of four long piers, 50 m wide and 310–350 m long,
 * meeting at a central hall whose outline sweeps round in big concave
 * curves between the arms. In the middle of the hall the open-air
 * rainforest atrium ("Rimba"), a round garden 44 m across behind a
 * cone-shaped steel-and-glass wall. The arms have the contact pier's
 * section: a grey-panelled apron level with the gate stubs, a tall glass
 * gate level and a broad, shallow green-grey vault with deep eaves; the
 * central hall rises a little higher under a smooth domed roof that runs
 * into the arms.
 *
 * Evidence
 * - OSM: relation/4504617 "KLIA Terminal 1 (Satellite Building)"
 *   (outer way 431514864 and way 570097104; the atrium inner way
 *   323392836, leisure=park "Rimba"; three small light wells; start_date
 *   1998; no height). Read in this frame.
 * - Published: 27 contact gates, prefix C (English Wikipedia); 176,000 m²
 *   (Wikipedia; 143,404 m² in its table).
 * - Photos (Wikimedia Commons):
 *   • "KLIA pier&satellite.jpg", Pizzaboy1, public domain — the satellite
 *     from the air, far off: the four arms with smooth green-grey roofs and
 *     the curved hall between them.
 *   • "KLIA MTB+Pier buildings.jpg", Craig, public domain — an arm from the
 *     apron, the glazed gate level over grey panels, the gate stubs, and the
 *     central roof rising behind it in one smooth curve.
 *   • "KLIA-satellite building-LANDSCAPE.jpg" (Commons, see references) —
 *     the atrium's cone-shaped steel and glass wall from inside.
 *   • "KUL-Satellite2.jpg" (Commons) — the hall inside, timber ceiling.
 * - "Aerial photograph of Malaysia on 15 January 2026 - 01.jpg", Yu Chu Chin,
 *   CC BY-SA 4.0 — the satellite from the south at a low angle: the arm
 *   roofs light grey with two rows of solar panels along each, the arm
 *   ends rolled down like the contact pier's, the centre behind.
 * - Terrain: flat apron, Mapterhorn z12 only.
 *
 * Numbers (estimated: no lidar, no published heights)
 * - Arms: apron level 0–6 m, glass to the eave at 17 m, vault crown 21.5 m,
 *   as the contact pier (kl-klia-terminal-1); the satellite panorama shows
 *   the same section.
 * - Central roof: eave 20 m, crown 28 m, from "KLIA MTB+Pier buildings.jpg"
 *   (the hall rises about a fifth above the arms).
 * - Atrium wall: a cone from r 22 m (OSM) at the floor to r 19 m at the roof.
 *
 * Look-only: none used.
 *
 * Doubts
 * - No licensed close photo of the central roof: its dome shape and height
 *   rest on one distant panorama and a distant aerial. The assignment
 *   mentions hypar roofs on the satellite; no open photo shows any, so none
 *   are drawn.
 * - The gate stubs are drawn as solid boxes at the apron level.
 * - Mapterhorn here is z12 only (a surface model): terrain.ts check --zoom 12
 *   puts a few gate-stub tops (6 m) up to 1 m under its hump. The terrain
 *   is wrong for the site; the model keeps the real heights.
 * - The 2026 aerial (- 01) shows the arms' roofs lighter grey than the MTB's
 *   in haze; the terminal's green-grey is kept for one KLIA palette.
 */
import { type V3 } from './mesh'
import { type XY, quadN, unit, capPoly } from './nyc-570-lexington'
import { writeLod, newMats } from './tokyo-haneda-terminal-1'
import { finish } from './palette'
import { KL, MATS, materials, capStubs, glassWalls, ringWalls, holeWalls, capHoles, pierVault, bands } from './kl-klia-terminal-1'

export const ANCHOR: [number, number] = [101.7135996, 2.7479883]
export const BEARING = 325.9

/** OSM relation/4504617 outer ring, this frame, simplified to 0.25 m. */
const OUTLINE: XY[] = [[-18.5, -340.2], [-19.4, -340.2], [-19.7, -330.6], [-18.4, -330.6], [-18.6, -324.5], [-16.9, -314.9], [-35.3, -314.2], [-35.1, -293.8], [-44.2, -293.8], [-44.1, -296.0], [-54.1, -296.1], [-54.2, -277.3], [-44.0, -277.2], [-43.9, -285.4], [-35.4, -285.4], [-35.0, -262.6], [-30.1, -262.6], [-29.9, -218.7], [-43.6, -218.8], [-43.6, -220.9], [-53.5, -221.0], [-53.7, -202.2], [-43.5, -202.1], [-43.4, -210.4], [-30.2, -210.2], [-29.5, -144.1], [-43.2, -144.3], [-43.2, -146.4], [-53.1, -146.5], [-53.3, -127.7], [-43.0, -127.6], [-43.0, -135.9], [-29.6, -135.8], [-29.1, -83.1], [-31.2, -71.2], [-35.7, -61.2], [-42.5, -51.9], [-49.9, -44.2], [-58.2, -37.9], [-69.2, -32.8], [-79.7, -30.1], [-98.8, -29.9], [-98.9, -33.0], [-147.3, -32.5], [-147.2, -29.3], [-187.8, -29.3], [-187.8, -43.0], [-185.7, -43.0], [-185.7, -52.9], [-204.5, -52.9], [-204.4, -42.6], [-196.2, -42.6], [-196.1, -29.2], [-262.8, -29.4], [-262.8, -43.1], [-260.7, -43.2], [-260.7, -53.1], [-279.5, -53.0], [-279.5, -42.8], [-271.2, -42.8], [-271.2, -29.4], [-309.3, -29.0], [-309.2, -23.1], [-311.5, -23.0], [-311.2, 20.3], [-308.0, 20.2], [-308.1, 24.1], [-289.0, 24.0], [-288.9, 37.7], [-291.1, 37.7], [-291.1, 47.6], [-272.3, 47.6], [-272.3, 37.3], [-280.6, 37.4], [-280.6, 24.0], [-222.5, 24.5], [-222.5, 38.3], [-224.6, 38.3], [-224.6, 48.2], [-205.8, 48.1], [-205.8, 37.9], [-214.1, 37.9], [-214.1, 24.5], [-148.2, 24.4], [-148.2, 38.2], [-150.3, 38.2], [-150.3, 48.1], [-131.5, 48.0], [-131.5, 37.8], [-139.8, 37.8], [-139.8, 24.4], [-92.6, 23.4], [-77.2, 24.8], [-65.5, 27.2], [-56.7, 31.2], [-46.3, 38.8], [-40.0, 46.6], [-33.8, 55.9], [-30.1, 65.5], [-28.3, 75.3], [-28.1, 161.7], [-41.9, 161.8], [-41.9, 159.6], [-51.8, 159.7], [-51.7, 178.4], [-41.5, 178.4], [-41.5, 170.2], [-28.1, 170.1], [-27.5, 217.7], [-41.2, 217.8], [-41.2, 215.6], [-51.2, 215.7], [-51.1, 234.4], [-40.8, 234.4], [-40.9, 226.2], [-27.5, 226.1], [-27.7, 265.4], [-32.4, 265.0], [-31.8, 291.0], [-41.1, 291.0], [-41.1, 288.9], [-51.0, 288.9], [-50.9, 307.7], [-40.7, 307.7], [-40.7, 299.4], [-32.2, 299.4], [-32.1, 316.5], [-16.6, 316.6], [-16.8, 327.3], [-19.0, 327.3], [-18.9, 336.5], [1.0, 336.2], [1.1, 351.4], [6.3, 351.4], [6.2, 336.3], [7.9, 336.3], [8.1, 327.6], [5.2, 327.5], [5.5, 316.8], [28.2, 316.5], [27.7, 296.0], [37.6, 295.9], [37.6, 298.1], [47.5, 298.0], [47.4, 279.2], [37.1, 279.3], [37.2, 287.5], [28.3, 287.6], [27.8, 265.1], [22.8, 265.1], [23.4, 220.8], [37.2, 220.8], [37.2, 222.9], [47.1, 222.9], [47.0, 204.1], [36.7, 204.1], [36.8, 212.4], [23.4, 212.4], [22.7, 144.7], [36.4, 144.7], [36.4, 146.8], [46.4, 146.8], [46.3, 128.0], [36.0, 128.1], [36.0, 136.3], [22.6, 136.4], [21.8, 74.1], [23.6, 68.2], [38.2, 78.6], [42.3, 77.8], [48.4, 72.9], [68.8, 52.0], [74.1, 45.5], [75.9, 40.9], [65.4, 27.1], [78.1, 23.9], [159.1, 24.2], [159.0, 38.0], [156.8, 38.0], [156.8, 47.9], [175.6, 48.0], [175.6, 37.7], [167.4, 37.7], [167.4, 24.3], [213.1, 24.5], [213.1, 38.3], [210.9, 38.3], [210.9, 48.2], [229.7, 48.3], [229.7, 38.0], [221.4, 38.0], [221.5, 24.6], [256.3, 24.3], [256.2, 28.2], [285.4, 28.5], [285.4, 38.6], [283.2, 38.6], [283.2, 48.5], [302.0, 48.5], [302.0, 38.3], [293.7, 38.2], [293.8, 28.2], [307.9, 28.8], [307.8, 24.5], [311.0, 24.8], [309.8, 10.7], [320.1, 10.5], [320.0, 13.2], [329.4, 13.5], [330.0, -6.3], [343.1, -6.6], [343.3, -12.0], [330.1, -11.4], [330.1, -13.2], [321.4, -13.5], [321.4, -11.3], [309.8, -11.5], [310.5, -28.9], [290.4, -28.8], [290.4, -40.9], [292.6, -40.9], [292.6, -50.8], [273.9, -50.9], [273.8, -40.6], [282.1, -40.6], [282.0, -28.9], [259.4, -28.6], [259.4, -22.9], [215.4, -23.0], [215.5, -41.0], [217.6, -41.0], [217.7, -50.9], [198.9, -51.0], [198.8, -40.8], [207.1, -40.7], [207.2, -23.0], [139.3, -23.5], [139.4, -41.7], [141.5, -41.7], [141.6, -51.6], [122.8, -51.7], [122.7, -41.4], [131.0, -41.4], [131.2, -23.6], [72.4, -24.2], [61.5, -28.1], [52.1, -32.7], [43.8, -39.0], [37.1, -45.4], [30.1, -53.8], [25.4, -63.0], [21.7, -72.5], [21.4, -162.3], [35.1, -162.2], [35.1, -160.1], [45.0, -160.0], [45.2, -178.8], [34.9, -178.9], [34.8, -170.6], [21.4, -170.7], [21.1, -216.4], [34.8, -216.3], [34.8, -214.1], [44.7, -214.0], [44.9, -232.8], [34.6, -232.9], [34.6, -224.7], [21.2, -224.8], [20.9, -262.7], [24.9, -262.5], [24.8, -288.6], [34.9, -288.5], [34.8, -286.4], [44.8, -286.3], [44.9, -305.1], [34.7, -305.2], [34.6, -296.9], [24.9, -296.9], [24.7, -314.4], [16.3, -316.8], [16.3, -319.8], [3.0, -319.9], [3.2, -330.6], [5.1, -330.5], [5.3, -340.1], [-13.9, -340.2], [-13.4, -353.1], [-18.3, -353.4]]
/** The rainforest atrium (inner way 323392836). */
const ATRIUM: XY[] = [[-18.5, -12.3], [-13.4, -18.1], [-6.7, -21.8], [0.9, -22.9], [8.5, -21.4], [15.1, -17.3], [21.2, -8.5], [22.6, -0.9], [21.3, 6.7], [17.5, 13.4], [11.6, 18.4], [5.6, 20.8], [-2.1, 21.3], [-9.5, 19.1], [-15.7, 14.6], [-19.9, 8.1], [-21.8, 0.6], [-20.9, -7.0]]
const AC: XY = [0.4, -0.8], AR = 22

const BASE = 6, EAVE = 17, CROWN = 21.5
const HUB = { eave: 20, crown: 28, reach: 100 }

/** Distance from the atrium centre to the outline along direction a, capped at `reach`. */
function edgeR(a: number): number {
  const d: XY = [Math.cos(a), Math.sin(a)]
  let best = HUB.reach
  for (let i = 0; i < OUTLINE.length; i++) {
    const p = OUTLINE[i], q = OUTLINE[(i + 1) % OUTLINE.length]
    const e: XY = [q[0] - p[0], q[1] - p[1]], w: XY = [p[0] - AC[0], p[1] - AC[1]]
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * d[1] - w[1] * d[0]) / den
    if (t > 1 && s >= 0 && s <= 1) best = Math.min(best, t)
  }
  return best
}

function build(detail: boolean) {
  const M = newMats([...MATS, 'solar'])
  // --- the apron level of the whole outline, with the gate stubs
  ringWalls(M.panel, OUTLINE, 0, BASE)
  const inArm = (q: XY) => (Math.abs(q[1] - (q[0] < 0 ? -2.65 : 2.75)) < (q[0] < 0 ? 27.3 : 26.4) && Math.abs(q[0]) > 60) || (Math.abs(q[0] - (q[1] > 0 ? -2.6 : -4.2)) < 25.8 && Math.abs(q[1]) > 60) || Math.hypot(q[0] - AC[0], q[1] - AC[1]) < 102
  capStubs(M.roof, OUTLINE, BASE, inArm)
  bands(M.win, OUTLINE, 1.4, 4.6, 12, 4)

  // --- the four arms: glass gate level under the pier vault
  type Arm = { a0: number; a1: number; b0: number; b1: number; swap: boolean; ends: [boolean, boolean] }
  const arms: Arm[] = [
    { a0: -311.2, a1: -70, b0: -29.3, b1: 24.0, swap: false, ends: [true, false] },
    { a0: 70, a1: 309.8, b0: -23.0, b1: 28.5, swap: false, ends: [false, true] },
    { a0: 70, a1: 316.5, b0: -28.0, b1: 22.8, swap: true, ends: [false, true] },
    { a0: -315.0, a1: -70, b0: -29.6, b1: 21.2, swap: true, ends: [true, false] },
  ]
  for (const A of arms) {
    const frame = (q: V3): V3 => (A.swap ? [q[1], q[0], q[2]] : q)
    const P = (a: number, b: number): XY => (A.swap ? [b, a] : [a, b])
    const ring: XY[] = [P(A.a0, A.b0), P(A.a1, A.b0), P(A.a1, A.b1), P(A.a0, A.b1)]
    glassWalls(M, ring, BASE, () => EAVE - 0.9, detail ? 6 : 60, detail ? 6.4 : 0)
    const Z = pierVault(M, A.a0, A.a1, A.b0, A.b1, EAVE, CROWN, 4.5, detail ? 12 : 6, frame, A.ends, 22)
    // the solar arrays laid along the arm roofs (2026 aerial): two dark rows
    const bm = (A.b0 + A.b1) / 2, s0 = A.ends[0] ? A.a0 + 30 : A.a0 + 40, s1 = A.ends[1] ? A.a1 - 30 : A.a1 - 40
    for (const [c0, c1] of [[bm - 15, bm - 4], [bm + 4, bm + 15]]) {
      const segs = detail ? 3 : 1
      for (let i = 0; i < segs; i++) {
        const ya = c0 + ((c1 - c0) * i) / segs, yb = c0 + ((c1 - c0) * (i + 1)) / segs
        const n = unit([0, -(Z(yb) - Z(ya)) / (yb - ya), 1])
        const fn = (v: V3): V3 => (A.swap ? [v[1], v[0], v[2]] : v)
        quadN(M.solar, frame([s0, ya, Z(ya) + 0.3]), frame([s1, ya, Z(ya) + 0.3]), frame([s1, yb, Z(yb) + 0.3]), frame([s0, yb, Z(yb) + 0.3]), [fn(n), fn(n), fn(n), fn(n)])
      }
    }
  }

  // --- the central hall: glass walls round its curved outline, a domed roof
  const S = detail ? 96 : 48, R = detail ? 8 : 4
  const ang = Array.from({ length: S }, (_, k) => (2 * Math.PI * (k + 0.5)) / S)
  const re = ang.map(edgeR)
  const zAt = (rho: number) => HUB.eave + (HUB.crown - HUB.eave) * (1 - rho * rho)
  const pt = (k: number, r: number): XY => [AC[0] + r * Math.cos(ang[k % S]), AC[1] + r * Math.sin(ang[k % S])]
  const rho0 = (k: number) => (AR - 2.5) / re[k % S]
  const nrm = (k: number, rho: number): V3 => {
    const a = ang[k % S], dz = (-2 * rho * (HUB.crown - HUB.eave)) / re[k % S]
    return unit([-dz * Math.cos(a), -dz * Math.sin(a), 1])
  }
  for (let k = 0; k < S; k++) {
    for (let i = 0; i < R; i++) {
      const t0 = i / R, t1 = (i + 1) / R
      const r0a = rho0(k) + (1 - rho0(k)) * t0, r1a = rho0(k) + (1 - rho0(k)) * t1
      const r0b = rho0(k + 1) + (1 - rho0(k + 1)) * t0, r1b = rho0(k + 1) + (1 - rho0(k + 1)) * t1
      const A = pt(k, r0a * re[k]), B = pt(k + 1, r0b * re[(k + 1) % S]), C = pt(k + 1, r1b * re[(k + 1) % S]), D = pt(k, r1a * re[k])
      quadN(M.roof, [A[0], A[1], zAt(r0a)], [B[0], B[1], zAt(r0b)], [C[0], C[1], zAt(r1b)], [D[0], D[1], zAt(r1a)], [nrm(k, r0a), nrm(k + 1, r0b), nrm(k + 1, r1b), nrm(k, r1a)])
    }
    // fascia at the eave and the rim round the atrium
    const E0 = pt(k, re[k] + 2.5), E1 = pt(k + 1, re[(k + 1) % S] + 2.5), I0 = pt(k, re[k]), I1 = pt(k + 1, re[(k + 1) % S])
    const am = ang[k] + Math.PI / S, o: V3 = [Math.cos(am), Math.sin(am), 0]
    // overhang: continue the roof 2.5 m past the wall, then a lip
    quadN(M.roof, [I0[0], I0[1], zAt(1)], [I1[0], I1[1], zAt(1)], [E1[0], E1[1], zAt(1) - 0.6], [E0[0], E0[1], zAt(1) - 0.6], [nrm(k, 1), nrm(k + 1, 1), nrm(k + 1, 1), nrm(k, 1)])
    quadN(M.roof, [E0[0], E0[1], zAt(1) - 1.5], [E1[0], E1[1], zAt(1) - 1.5], [E1[0], E1[1], zAt(1) - 0.6], [E0[0], E0[1], zAt(1) - 0.6], [o, o, o, o])
    quadN(M.soffit, [E0[0], E0[1], zAt(1) - 1.5], [I0[0], I0[1], zAt(1) - 1.5], [I1[0], I1[1], zAt(1) - 1.5], [E1[0], E1[1], zAt(1) - 1.5], [[0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]])
    const J0 = pt(k, AR - 2.5), J1 = pt(k + 1, AR - 2.5), zi = zAt(rho0(k))
    const oi: V3 = [-o[0], -o[1], 0]
    quadN(M.roof, [J0[0], J0[1], zi - 1.2], [J1[0], J1[1], zi - 1.2], [J1[0], J1[1], zi], [J0[0], J0[1], zi], [oi, oi, oi, oi])
  }
  const hub: XY[] = ang.map((_, k) => pt(k, re[k]))
  glassWalls(M, hub.slice().reverse(), BASE, () => HUB.eave - 1.6, detail ? 6 : 30, detail ? 6.4 : 0)

  // --- the atrium: a cone of steel and glass round the open-air garden
  const n = detail ? 32 : 16
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n, b = (2 * Math.PI * (k + 1)) / n
    const P = (ang: number, r: number, z: number): V3 => [AC[0] + r * Math.cos(ang), AC[1] + r * Math.sin(ang), z]
    const zt = zAt((AR - 2.5) / HUB.reach) - 1.2
    const ni = (t: number): V3 => unit([-Math.cos(t), -Math.sin(t), -0.15])
    quadN(M.glass, P(a, AR, BASE), P(b, AR, BASE), P(b, AR - 3, zt), P(a, AR - 3, zt), [ni(a), ni(b), ni(b), ni(a)])
  }
  holeWalls(M.panel, ATRIUM, 0, BASE)

  // no columns here: the sixth material is the solar arrays
  return [...materials(M, !detail).filter((m) => m.material.name !== KL.stone.name), { part: M.solar, material: finish('klia-solar', 0x6f7a86) }]
}

if (import.meta.main) {
  const extras = { bearing: BEARING, osm: 'relation/4504617', height: HUB.crown }
  writeLod('KLIA Satellite Building A', 'kl-klia-satellite-a.glb', build(false), extras, 8000, 250_000)
  writeLod('KLIA Satellite Building A', 'kl-klia-satellite-a.detail.glb', build(true), extras, 40_000, 1_500_000)
}
