/**
 * Westendstrasse 1 (Westend Tower, "Kronenhochhaus"), Frankfurt am Main:
 * procedural, CC0-1.0.
 * bun generators/frankfurt-westend-1.ts   (writes the low model and the detail model)
 *
 * Kohn Pedersen Fox with Nägele Hofmann Tiedemann, 1990-1993, for DZ Bank:
 * 208 m, 53 storeys. A fan of pale glass, a quarter circle and more in
 * plan, facing south-east, held on its north-west side by a pale granite
 * slab; the slab's lower part runs on round the fan's west side to about
 * 145 m, and its stone core rises alone to the top. At the top of the
 * fan, eleven steel rays in a semicircle cantilever 11 m out past the
 * facade to a ring: the "crown".
 *
 * Identity, in order: the crown, an open half-ring of radial steel rays
 * and its rim, standing out past the glass on both sides; the glass fan
 * with its pale bands; the stone core rising above the crown; the lower
 * stone block to about 145 m with its small projecting cornice.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the area
 * centroid of OSM way/183069536, the tower's outline (50.110574, 8.662376).
 * y = 0 is the lowest ground under the footprint.
 *
 * Plan (measured from the OSM nodes): OSM's outline is the crown's
 * footprint, not the shaft's. The glass fan is centred at (-10, -0.5),
 * radius 18.3 (the inner edge of OSM 1177171890, building:part=roof, whose
 * ring out to radius 29.5 is the crown's overhang; a fan of 18.3 m gives
 * the published ~950 m² floor, and p2 shows the shaft about 33 m across),
 * from due south round to 68° north of east. The slab is OSM 1177171891
 * (10 x 26 m, its long side 21° west of north); the stone strip down the
 * west side OSM 1177171892 (light grey).
 *
 * Heights:
 * - 208 m to the top of the stone core, 53 storeys of 3.6 m: published
 *   (de.wikipedia "Westendstraße 1"; OSM tags 198).
 * - the crown: eleven rays from the top drum (radius 11) to the rim at
 *   radius 29.5 (11 m past the facade: published), their top at 190 m,
 *   their depth 11 m at the drum, 8 m at the facade, 4 m at the rim, the
 *   rim 4 m deep (p4: the crown about a third as tall as the shaft is
 *   wide); the glass fan to 183 m and the drum to 190 m: measured on p3
 *   and p4 (scaled from the 208 m top) and p5. Above the lower block only
 *   the fan's part south of the core rises (p1, p3).
 * - the lower stone block 145 m: measured on p2, p3, p4.
 * - the stone core: the slab's south-east 11 m (p1, p3: about half the
 *   lower block's width, next to the glass).
 *
 * Evidence:
 * - p1 https://commons.wikimedia.org/wiki/File:Westendstra%C3%9Fe_1,_Frankfurt,_West_view_20200516_1.jpg
 *   DXR, CC BY-SA 4.0: from the west: the lower block, the core with the
 *   logo, the crown edge-on.
 * - p2 https://commons.wikimedia.org/wiki/File:Frankfurt_Am_Main-Westend_Tower-Ansicht_vom_Maintower.jpg
 *   Mylius, CC BY-SA 3.0: from the Main Tower (east-south-east), the fan,
 *   the lower block, the crown from above its level.
 * - p3 https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main_-_Westend_Tower.jpg
 *   Dr. Thomas Liptak, CC BY-SA 4.0: from the west at a distance.
 * - p4 https://commons.wikimedia.org/wiki/File:Westend_Tower_01.jpg
 *   Immanuel Giel, CC BY-SA 4.0: from the south-east: the fan, the crown's
 *   rays and rim, the lower block's cornices either side.
 * - p5 https://commons.wikimedia.org/wiki/File:Frankfurt_Westend_Tower_dk2489.jpg
 *   DrKssn, CC BY-SA 3.0: from below on Mainzer Landstrasse: the rays seen
 *   from under the crown, the drum inside it.
 * - p6 https://commons.wikimedia.org/wiki/File:Westendstra%C3%9Fe_1,_Frankfurt,_West_view_20170226_1.jpg
 *   DXR, CC BY-SA 4.0.
 * - OSM (API, 2026-11): the outline and parts in `replaces`.
 * - Published: 208 m, 53 storeys of 3.6 m, crown of eleven rays in a
 *   semicircle projecting 11 m, light granite (de.wikipedia).
 * - No lidar (none in Germany). Look-only: none.
 *
 * Colours from the daylight photos: granite #e2ddd3 (p1, p4); the fan's
 * glass a pale sky grey-blue #a9bfd1 with granite bands every two storeys
 * (p4); the punched windows #7d90a2; the crown's steel white #f4f5f5. The low
 * model's rays are 2.5 m wide plates and its rim 2.2 m wide and 4 m deep, bolder than
 * the real members so the crown reads at phone size (lead review).
 *
 * Night: the glass and windows are `window*`; the crown carries
 * `_FLOODLIGHT` (it is lit at night).
 *
 * Detail model (models/frankfurt-westend-1.detail.glb): the rays as open
 * trusses (top and bottom chords, posts and diagonals), two purlin rings
 * between the rays and the rim, a finer fan.
 *
 * Doubts: the OSM way the batch named, way/42367719 ("Westend 1", 12
 * levels), is the separate perimeter building north of the tower; the
 * tower itself is way/183069536, which this model is placed on and
 * replaces. The DZ Bank logo on the core is left out. The rounded glazed
 * bay on the lower block (p1, p3) is not drawn: its plan is not in OSM.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, face, saveLods, ccw, arc, beam, smoothWall, capRing, type XY, type Layer } from './frankfurt-commerzbank-tower'

const ID = 'frankfurt-westend-1'
const DEG = Math.PI / 180
const C: XY = [-10, -0.5], R = 18.3, R_DRUM = 11, R_RIM = 29.5
const GLASS_TOP = 183, CROWN_TOP = 190, LOW_TOP = 145, CORE_TOP = 208
const STOREY = 3.6

type Set = { stone: Part; glass: Part; win: Part; steel: Part; roof: Part }
const mk = (): Set => ({ stone: new Part(), glass: new Part(), win: new Part(), steel: new Part(), roof: new Part() })

const SLAB: XY[] = [[-10.1, -0.3], [-0.6, 3.5], [-9.0, 25.1], [-18.7, 21.3], [-15.5, 13.2]]
const STRIP: XY[] = [[-21.8, 10.7], [-15.5, 13.2], [-10.1, -0.3], [-9.8, -17.9], [-9.7, -22.8]]
// the slab's long axis, from its south-east end to its north-west end
const AX: XY = [(-18.7 + -9.0) / 2 - (-10.1 + -0.6) / 2, (21.3 + 25.1) / 2 - (-0.3 + 3.5) / 2]
const AXL = Math.hypot(...AX), AXU: XY = [AX[0] / AXL, AX[1] / AXL]
const at = (p: XY, s: number): XY => [p[0] + AXU[0] * s, p[1] + AXU[1] * s]
const CORE: XY[] = [[-10.1, -0.3], [-0.6, 3.5], at([-0.6, 3.5], 11), at([-10.1, -0.3], 11)]

function build(s: Set, detail: boolean) {
  const seg = detail ? 40 : 20
  // ── the glass fan, to 183 m, with the drum to 190 inside the crown ──
  const fan = arc(C, R, -90 * DEG, 68 * DEG, seg)
  const GLASS: XY[] = [[-10.1, -0.3], ...fan, [-0.6, 3.5]]
  // the whole fan to the lower block's top; above it only the part south of
  // the core (p1, p3: no glass north of the core above the block)
  prism(s.glass, GLASS, 0, LOW_TOP, { top: null })
  const upFan = arc(C, R, -90 * DEG, 40 * DEG, Math.round(seg * 0.8))
  const UPPER: XY[] = [[-10.1, -0.3], ...upFan, at([-0.6, 3.5], 11), [-0.6, 3.5]]
  capRing(s.roof, GLASS, LOW_TOP)
  prism(s.glass, UPPER, LOW_TOP, GLASS_TOP, { top: null })
  // the terrace roof under the crown and the drum
  capRing(s.roof, UPPER, GLASS_TOP)
  const drum = arc(C, R_DRUM, -90 * DEG, 60 * DEG, Math.round(seg * 0.6))
  smoothWall(s.glass, drum, GLASS_TOP, CROWN_TOP)
  capRing(s.roof, [C, ...drum], CROWN_TOP)
  // pale granite bands on the fan every two storeys
  for (let z = 2 * STOREY + 4; z < GLASS_TOP - 2; z += 2 * STOREY) smoothWall(s.stone, z < LOW_TOP ? fan : upFan, z - 0.55, z + 0.55, 0.06)
  smoothWall(s.stone, upFan, GLASS_TOP - 1.6, GLASS_TOP, 0.06)
  smoothWall(s.stone, fan, LOW_TOP - 1.6, LOW_TOP, 0.06)
  // stone pilasters where the fan meets the stone, both ends
  for (const [p, top] of [[fan[0], GLASS_TOP], [fan[fan.length - 1], LOW_TOP], [upFan[upFan.length - 1], GLASS_TOP]] as [XY, number][]) {
    const d: XY = [p[0] - C[0], p[1] - C[1]], l = Math.hypot(...d), n: XY = [d[0] / l, d[1] / l], t: XY = [-n[1], n[0]]
    const q = (a: number, b: number): XY => [p[0] + t[0] * a + n[0] * b, p[1] + t[1] * a + n[1] * b]
    prism(s.stone, [q(-1.2, -1), q(1.2, -1), q(1.2, 0.5), q(-1.2, 0.5)], p === upFan[upFan.length - 1] ? LOW_TOP : 0, top)
  }

  // ── the stone block: strip and slab to 145 m, the core to 208 ──
  for (const r of [STRIP, SLAB]) prism(s.stone, r, 0, LOW_TOP)
  prism(s.stone, CORE, LOW_TOP, CORE_TOP - 0.6, { top: null })
  {
    const q = ccw(CORE), c = q.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4] as XY, [0, 0] as XY)
    const ins = q.map(([x, y]) => [x + (c[0] - x) * 0.08, y + (c[1] - y) * 0.08] as XY)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      s.stone.quad([q[i][0], q[i][1], CORE_TOP - 0.6], [q[j][0], q[j][1], CORE_TOP - 0.6], [ins[j][0], ins[j][1], CORE_TOP], [ins[i][0], ins[i][1], CORE_TOP])
    }
    capRing(s.roof, ins, CORE_TOP)
  }
  // the lower block's projecting cornice: a thin plate 2.5 m out
  for (const r of [STRIP, SLAB]) {
    const q = ccw(r)
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length]
      const L = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (L < 6) continue
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      // only on the outside walls (not where the strip and slab meet the glass)
      const mx = (a[0] + b[0]) / 2 + n[0] * 3, my = (a[1] + b[1]) / 2 + n[1] * 3
      if (Math.hypot(mx - C[0], my - C[1]) < R + 1 && mx > -10.5) continue
      const P = (s0: number, d: number): XY => [a[0] + u[0] * s0 + n[0] * d, a[1] + u[1] * s0 + n[1] * d]
      prism(s.steel, [P(0, 0), P(L, 0), P(L, 2.5), P(0, 2.5)], LOW_TOP - 0.9, LOW_TOP, { bottom: s.steel })
      // punched windows: two-storey panels in 3.2 m bays
      const nb = Math.max(1, Math.round((L - 1.6) / 3.2)), w = (L - 1.6) / nb
      const N: V3 = [n[0], n[1], 0]
      for (let k = 0; k < nb; k++) {
        const sa = 0.8 + k * w + 0.8, sb = 0.8 + (k + 1) * w - 0.8
        for (let z = 6; z < LOW_TOP - 4; z += (detail ? 1 : 2) * STOREY) {
          const za = z + 0.8, zb = z + (detail ? 1 : 2) * STOREY - 0.8
          face(s.win, [[...P(sa, 0.05), za], [...P(sb, 0.05), za], [...P(sb, 0.05), zb], [...P(sa, 0.05), zb]] as V3[], N)
        }
      }
    }
  }
  // the core's own windows above the block: a slot of glass on its long faces
  {
    const q = ccw(CORE)
    for (let i = 0; i < 4; i++) {
      const a = q[i], b = q[(i + 1) % 4], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: XY = [u[1], -u[0]]
      const P = (s0: number, z: number): V3 => [a[0] + u[0] * s0 + n[0] * 0.05, a[1] + u[1] * s0 + n[1] * 0.05, z]
      const nb = Math.max(1, Math.round(L / 3.4)), w = L / nb
      for (let k = 0; k < nb; k++) for (let z = LOW_TOP + 2; z < CORE_TOP - 6; z += 2 * STOREY)
        face(s.win, [P(k * w + 0.9, z + 0.8), P((k + 1) * w - 0.9, z + 0.8), P((k + 1) * w - 0.9, z + 2 * STOREY - 0.8), P(k * w + 0.9, z + 2 * STOREY - 0.8)], [n[0], n[1], 0])
    }
  }

  // ── the crown: eleven rays in a semicircle and the rim ──
  const rays = 11
  const depth = (r: number) => (r <= R ? 11 - (3 * (r - R_DRUM)) / (R - R_DRUM) : 8 - (4 * (r - R)) / (R_RIM - R))
  for (let k = 0; k < rays; k++) {
    const a = (-90 + (180 * k) / (rays - 1)) * DEG
    const d: XY = [Math.cos(a), Math.sin(a)], t: XY = [-d[1], d[0]]
    const P = (r: number, z: number, off = 0): V3 => [C[0] + d[0] * r + t[0] * off, C[1] + d[1] * r + t[1] * off, z]
    if (!detail) {
      // a solid tapered plate, 2.5 m thick (bolder than real, to read at 200 px)
      const rs = [R_DRUM, R, R_RIM]
      const th = 1.25
      for (const side of [1, -1]) {
        const ring = rs.map((r) => [P(r, CROWN_TOP, side * th), P(r, CROWN_TOP - depth(r), side * th)])
        for (let i = 0; i < rs.length - 1; i++) face(s.steel, [ring[i][0], ring[i + 1][0], ring[i + 1][1], ring[i][1]], [t[0] * side, t[1] * side, 0])
      }
      // the underside and the top, as strips
      for (let i = 0; i < rs.length - 1; i++) {
        const r0 = rs[i], r1 = rs[i + 1]
        face(s.steel, [P(r0, CROWN_TOP, -th), P(r1, CROWN_TOP, -th), P(r1, CROWN_TOP, th), P(r0, CROWN_TOP, th)], [0, 0, 1])
        const z0 = CROWN_TOP - depth(r0), z1 = CROWN_TOP - depth(r1)
        const dz = z1 - z0, dr = r1 - r0, l = Math.hypot(dz, dr)
        face(s.steel, [P(r0, z0, th), P(r1, z1, th), P(r1, z1, -th), P(r0, z0, -th)], [d[0] * (dz / l), d[1] * (dz / l), -dr / l])
      }
      face(s.steel, [P(R_RIM, CROWN_TOP - depth(R_RIM), -th), P(R_RIM, CROWN_TOP - depth(R_RIM), th), P(R_RIM, CROWN_TOP, th), P(R_RIM, CROWN_TOP, -th)], [d[0], d[1], 0])
    } else {
      // an open truss: top and bottom chords, posts and diagonals
      const n = 6
      const rr = Array.from({ length: n + 1 }, (_, i) => R_DRUM + ((R_RIM - R_DRUM) * i) / n)
      for (let i = 0; i < n; i++) {
        beam(s.steel, P(rr[i], CROWN_TOP - 0.3), P(rr[i + 1], CROWN_TOP - 0.3), 0.6)
        beam(s.steel, P(rr[i], CROWN_TOP - depth(rr[i]) + 0.3), P(rr[i + 1], CROWN_TOP - depth(rr[i + 1]) + 0.3), 0.6)
        beam(s.steel, P(rr[i], CROWN_TOP - depth(rr[i]) + 0.3), P(rr[i + 1], CROWN_TOP - 0.3), 0.4)
      }
      for (const r of rr) beam(s.steel, P(r, CROWN_TOP - depth(r) + 0.3), P(r, CROWN_TOP - 0.3), 0.45)
    }
  }
  // the rim: a box ring on the semicircle, and (detail) two purlin rings
  const rim = (r: number, z0: number, z1: number, w: number, segs: number) => {
    const o = arc(C, r + w / 2, -90 * DEG, 90 * DEG, segs), i = arc(C, r - w / 2, -90 * DEG, 90 * DEG, segs)
    smoothWall(s.steel, o, z0, z1)
    smoothWall(s.steel, [...i].reverse(), z0, z1)
    for (let k = 0; k < segs; k++) {
      s.steel.quad([i[k][0], i[k][1], z1], [i[k + 1][0], i[k + 1][1], z1], [o[k + 1][0], o[k + 1][1], z1], [o[k][0], o[k][1], z1])
      s.steel.quad([o[k][0], o[k][1], z0], [o[k + 1][0], o[k + 1][1], z0], [i[k + 1][0], i[k + 1][1], z0], [i[k][0], i[k][1], z0])
    }
    // end caps
    for (const k of [0, segs]) {
      const sgn = k === 0 ? 1 : -1
      const A = i[k], B = o[k]
      const nn: V3 = k === 0 ? [0, -1, 0] : [0, 1, 0]
      void sgn
      face(s.steel, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], nn)
    }
  }
  rim(R_RIM, CROWN_TOP - 4, CROWN_TOP, detail ? 1.6 : 2.2, detail ? 40 : 20)
  if (detail) for (const r of [22, 25.8]) rim(r, CROWN_TOP - 0.9, CROWN_TOP - 0.2, 0.5, 30)
}

const low = mk(), det = mk()
build(low, false)
build(det, true)
const mats = (s: Set): Layer[] => [
  { part: s.stone, material: finish('westend-granite', 0xe2ddd3) },
  { part: s.glass, material: windowVariant(2, 0xa9bfd1) },
  { part: s.win, material: { ...PALETTE.window, color: 0x7d90a2 } },
  { part: s.steel, material: { ...finish('westend-crown-steel', 0xf4f5f5, 0.5), floodlight: (p: V3) => (p[2] > 180 ? 1 : 0) } },
  { part: s.roof, material: PALETTE.roof },
]
await saveLods(ID, 'Westendstrasse 1', mats(low), mats(det), { anchor: [50.110574, 8.662376], bearing: 0, elevation: 0, height: CORE_TOP })
