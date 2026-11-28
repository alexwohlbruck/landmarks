/**
 * Stamford Bridge, Fulham, London: original procedural geometry, CC0-1.0,
 * no textures.  bun generators/london-stamford-bridge.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/london-stamford-bridge.glb, the low model (<= 6,500 triangles);
 * - models/london-stamford-bridge.detail.glb, drawn from zoom 16
 *   (<= 40,000): the East Stand's roof trusses as space trusses, the West
 *   Stand's roof beams, the masts' bracing.
 * Uses the stadium kit exported by manchester-old-trafford.ts (merge that
 * generator first).
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 324: model
 * +y runs along the pitch toward the Matthew Harding Stand (north-west),
 * +x across it toward the East Stand and the railway (north-east). Anchor =
 * area centroid of the leisure=stadium outline way/5986169, lng
 * -0.1910569, lat 51.4816645. Bearing 324 = the pitch's long edges (OSM
 * way/306370311, 101 x 66 m). y = 0 is the lowest ground under the
 * footprint; the pitch is built level 1.6 m above it (Mapterhorn shows
 * 2.75 m of relief, the pitch 1.3-1.9 m up), every outer wall running down
 * to y = 0 (`liftField`). Elevation 0.
 *
 * Identity, in order: four separate stands of different heights and ages
 * round the pitch with lower filled corners; the 1973 East Stand's three
 * tiers under a flat roof carrying white steel trusses, its bare grey
 * concrete back over the railway with a blue base, and the two blue and
 * white striped columns at its Shed End corner; the 2001 West Stand, the
 * largest, three tiers and a ring of boxes under a roof whose leading edge
 * arches up in the middle, edged in blue and hung from blue A-frame masts
 * at both ends; the two-tier Matthew Harding Stand with its masts; the
 * lower two-tier Shed End; blue seats; floodlight rows under the roofs.
 *
 * Evidence
 *  - OSM (measured in this frame): outline way/5986169 (leisure=stadium,
 *    Q171458) x -94.8..86.3, y -102.7..87.4; pitch x -23.3..42.6,
 *    y -49.5..52.1. Stands (building=grandstand, no heights): West Stand
 *    way/1312905893 (front x -28, back a bulging curve x -79..-95), East
 *    Stand way/1312905895 (front x 46.4, back x 85.3..86.3), Matthew
 *    Harding Stand way/1312905894 (front y 55, back y 81..87, wrapping the
 *    north corners), Shed End way/1312905892 (front y -54, back y -74,
 *    wrapping the south corners, with a block on to y -102.7 at
 *    x -27..-13). way/715157655 (building, levels 0, layer 2) is a
 *    walkway at the Matthew Harding Stand's back, under the model.
 *  - Published (Wikipedia, "Stamford Bridge (stadium)"): capacity 40,044;
 *    every stand at least two tiers; East Stand 1973, three-tiered
 *    cantilever; West Stand 1997-2001, three tiers and a row of boxes,
 *    13,500 seats, the largest; Matthew Harding Stand 1996-97; Shed End
 *    1997.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - "London Stamford Bridge.jpg", Arne Müseler, CC BY-SA 3.0 de, and
 *      "2023 09 09 arne mueseler 12 51 33 00728-Verbessert-RR
 *      (53284589160).jpg", Arne Müseler, CC BY-SA 2.0: aerials from the
 *      east: the East Stand's roof trusses and grey back, the striped
 *      columns, the West Stand's blue masts and curved roof, the Matthew
 *      Harding Stand's masts and stays, the corners, the hotels;
 *    - "Stamford Bridge - Home of Chelsea FC - geograph.org.uk - 5775784",
 *      Anthony Parkes, CC BY-SA 2.0: aerial from the north-west: the West
 *      Stand's back and roof, the Matthew Harding roof;
 *    - "Stamford Bridge Clear Skies.JPG", Lachlan Fearnley, CC BY-SA 3.0:
 *      inside: the West Stand's three tiers, boxes and arched blue roof
 *      edge, the translucent roof;
 *    - "Inside of Stamford Bridge Stadium.jpg", Kinkreet, CC BY-SA 3.0: the
 *      Shed End and the East Stand's upper tier and roof;
 *    - "The East Stand at Stamford Bridge - geograph.org.uk - 5661317",
 *      Steve Daniels, CC BY-SA 2.0: the East Stand by night: tiers, the
 *      truss over the roof, the floodlight row;
 *    - "Back of the East Stand - geograph.org.uk - 8037328", Mr Ignavy,
 *      CC BY-SA 2.0: the bare concrete back and the blue base.
 *  - Terrain (Mapterhorn, `terrain.ts check`): 2.75 m of relief.
 *
 * Measured (OSM): every plan line. Published: tiers, dates. Estimated from
 * the photos (no OSM or published heights): the West Stand's roof (leading
 * edge 29 m at the ends arching to 32 m, back 33 m) and its masts (47 m),
 * the East Stand's roof (30-31 m) and trusses (to 40 m), the striped columns
 * (38 m), the Matthew Harding Stand's roof (24-26 m) and masts (35 m), the
 * Shed End's roof (19-20 m), the corners (15 m), the tier profiles and the
 * facade bands.
 * Look-only: none.
 * Doubts: the hotels of Chelsea Village round the Shed End and the
 * south-west corner are separate OSM buildings and are left to the map;
 * the Matthew Harding Stand's yellow stays are drawn white (materials).
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import {
  add, at, bead, cap, capSlab, fan, lerp, liftField, nrm, oq, prism, rayOutline, rod, rods, sample, spaceTruss, sub, sweep, truss, writeLods,
  type PP, type St,
} from './manchester-old-trafford'

const ID = 'london-stamford-bridge'

/** OSM way/5986169 in this frame. */
const OUTLINE: [number, number][] = [[-13.2,-74.2],[-13.4,-102.7],[-27.2,-102.5],[-27.2,-91.5],[-32.4,-91.4],[-46.1,-85.3],[-50.9,-80.4],[-53.6,-83.1],[-77.6,-58.9],[-77.1,-50.6],[-79.2,-50.4],[-79.5,-43.0],[-83.1,-36.7],[-84.8,-33.4],[-86.5,-29.1],[-87.5,-25.8],[-88.5,-21.8],[-89.4,-15.7],[-89.4,-9.5],[-91.5,-9.1],[-91.6,-3.9],[-92.9,-3.8],[-94.8,1.2],[-94.7,4.7],[-93.9,6.9],[-92.5,8.1],[-92.2,12.1],[-88.6,11.9],[-87.7,22.1],[-86.8,27.9],[-85.0,33.5],[-83.3,37.9],[-80.5,43.6],[-79.6,45.5],[-79.3,54.7],[-62.3,55.3],[-62.3,60.0],[-56.3,60.2],[-51.2,72.1],[-42.1,81.2],[-30.7,85.9],[-29.8,82.2],[35.5,81.2],[38.2,81.2],[49.6,82.8],[49.3,87.4],[52.4,87.2],[63.5,82.6],[65.3,80.8],[66.9,81.4],[68.1,81.2],[69.4,80.4],[69.8,79.3],[69.9,78.1],[69.3,76.7],[71.6,74.3],[76.3,63.2],[76.3,60.6],[80.8,60.7],[81.3,49.9],[81.5,46.8],[86.3,46.7],[85.3,-53.0],[67.8,-52.8],[67.7,-66.6],[59.0,-75.2]]
const XW = -28, XE = 46.4, YS = -54, YN = 55.3
/** The pitch's height over the lowest ground under the footprint (Mapterhorn, `terrain.ts check`). */
const FIELD = 1.6

const M = {
  blue: finish('cfc-blue', 0x3f5fa8),
  concrete: { ...finish('concrete-grey', 0xc9c8c2), floodlight: (q: V3, n: V3) => (Math.abs(n[2]) < 0.4 && q[2] < 26 ? 0.3 : 0) } as MaterialSpec,
  white: finish('truss-white', 0xf2f2ee, 0.5),
  roof: { ...finish('roof-grey', 0xaeb5b9, 0.7), doubleSided: true } as MaterialSpec,
  window: PALETTE.window as MaterialSpec,
  lamp: finish('lamp-floodlight', 0xd9dad6, 0.5),
}

const line = (x0: number, y0: number, x1: number, y1: number, n: [number, number], count = 1): St[] =>
  Array.from({ length: count + 1 }, (_, i) => ({ o: [lerp(x0, x1, i / count), lerp(y0, y1, i / count), 0] as V3, n: [n[0], n[1], 0] as V3 }))

function build(detail: boolean) {
  const blue = new Part(), concrete = new Part(), white = new Part(), roof = new Part(), win = new Part(), lamp = new Part()
  const RS = detail ? 6 : 4
  const r = detail ? 0.45 : 0.8

  type Stand = {
    sts: St[]
    D: (i: number) => number
    seats: (i: number, under: (d: number) => number) => PP[]
    zF: (i: number) => number
    zB: (i: number) => number
    d0: number
    th: number
    roofPart?: Part
    bands: [number, number, Part, number?][]
  }
  const stand = (st: Stand) => {
    const { sts } = st
    const top = (i: number, d: number) => lerp(st.zF(i), st.zB(i), (d - st.d0) / (st.D(i) - st.d0))
    const under = (i: number) => (d: number) => top(i, d) - st.th
    sweep(sts, (i) => st.seats(i, under(i)))
    sweep(sts, (i) => [[st.d0, st.zF(i) - 2.2, blue], [st.d0, st.zF(i) + 0.2, st.roofPart ?? roof], [st.D(i), st.zB(i), null]])
    sweep(sts, (i) => [[st.d0, st.zF(i) - 2.2, roof], [st.D(i), st.zB(i) - st.th, null]], true)
    for (let i = 0; i < sts.length - 1; i++) {
      const a = sts[i], b = sts[i + 1], o = nrm(add(a.n, b.n))
      for (const [z0, z1, p, off] of st.bands) {
        const za0 = Math.min(z1, st.zB(i) - st.th), zb0 = Math.min(z1, st.zB(i + 1) - st.th)
        oq(p, at(a, st.D(i) + (off ?? 0), z0), at(b, st.D(i + 1) + (off ?? 0), z0), at(b, st.D(i + 1) + (off ?? 0), zb0), at(a, st.D(i) + (off ?? 0), za0), o)
      }
      // floodlights under the leading edge
      const A = at(a, st.d0 + 0.8, st.zF(i) - 2.8), B = at(b, st.d0 + 0.8, st.zF(i + 1) - 2.8)
      const n = Math.max(1, Math.round(Math.hypot(...sub(B, A)) / (detail ? 4.5 : 9)))
      for (let k = 0; k < n; k++) bead(lamp, [lerp(A[0], B[0], (k + 0.5) / n), lerp(A[1], B[1], (k + 0.5) / n), A[2]], detail ? 0.55 : 0.85)
    }
    for (const [i, j] of [[0, 1], [sts.length - 1, sts.length - 2]]) {
      const face = nrm(sub(sts[i].o, sts[j].o))
      const pr = st.seats(i, under(i)).slice(1).map(([d, z]) => [d, z] as [number, number])
      cap(concrete, sts[i], [...pr, [st.D(i), st.zB(i) - st.th]], face)
      capSlab(roof, sts[i], [[st.d0, st.zF(i) + 0.2], [st.D(i), st.zB(i)]], [[st.d0, st.zF(i) - 2.2], [st.D(i), st.zB(i) - st.th]], face)
    }
    return top
  }
  const Dray = (s: St, max: number) => Math.min(max, rayOutline(OUTLINE, [s.o[0], s.o[1]], s.n) - 0.3)

  // ------------------------------------------------------------ West Stand
  const wSts = line(XW, -50.5, XW, YN, [-1, 0], detail ? 12 : 8)
  const wD = wSts.map((s) => Dray(s, 67))
  const wF = (i: number) => 29 + 3 * Math.sin((Math.PI * i) / (wSts.length - 1))
  const wTop = stand({
    sts: wSts, D: (i) => wD[i], zF: wF, zB: () => 33, d0: -2.5, th: 1.2, roofPart: white,
    seats: (i, u) => [[0, 0, blue], [0, 1.2, blue], [17, 7.5, win], [17, 11, blue], [26, 15.5, win], [26, 19, blue], [44, 28.5, concrete], [44, u(44), null]],
    bands: [[0, 5, concrete], [5, 9, win, 0.05], [9, 22, concrete], [13, 17, win, 0.05], [22, 33, win]],
  })
  // the blue edge beam and roof beams
  {
    const edge = wSts.map((s, i) => at(s, -2.5, wF(i) + 0.4))
    rods(blue, edge, r * 1.1, RS)
    for (let i = 0; i < wSts.length; i += detail ? 1 : 2) rod(blue, at(wSts[i], -2.5, wF(i) + 0.4), at(wSts[i], wD[i], 33.3), r * 0.7, RS)
  }
  // the A-frame masts at both ends, stayed to the roof
  for (const [y, sy] of [[-56, -1], [61, 1]] as [number, number][]) {
    const apex: V3 = [-52, y + sy * 3, 47]
    const legs: V3[] = [[-40, y + sy * 4, r * 1.6], [-64, y + sy * 4, r * 1.6]]
    for (const l of legs) rod(blue, l, apex, r * 1.3, RS)
    rod(blue, sample(legs[0], apex, 3)[1], sample(legs[1], apex, 3)[1], r, RS)
    const iEnd = sy < 0 ? 0 : wSts.length - 1
    const iIn = sy < 0 ? 2 : wSts.length - 3
    for (const ii of [iEnd, iIn]) {
      rod(blue, apex, at(wSts[ii], -2, wF(ii) + 0.4), r * 0.5, RS)
      rod(blue, apex, at(wSts[ii], 25, wTop(ii, 25) + 0.3), r * 0.5, RS)
    }
  }

  // ------------------------------------------------------------ East Stand
  const eSts = line(XE, -50.5, XE, 49, [1, 0], detail ? 8 : 4)
  const eD = eSts.map((s) => Dray(s, 40))
  const eTop = stand({
    sts: eSts, D: (i) => eD[i], zF: () => 30, zB: () => 31, d0: -2, th: 1.2,
    seats: (i, u) => [[0, 0, blue], [0, 1.2, blue], [12, 5.5, win], [12, 9, blue], [19, 12, concrete], [16, 14, blue], [34, 25.5, concrete], [34, u(34), null]],
    bands: [[0, 4.5, blue], [4.5, 31, concrete], [11, 13.5, win, 0.05], [20, 22.5, win, 0.05]],
  })
  // the trusses: transverse triangular frames every bay over the roof, tied by
  // longitudinal warren trusses along their front and back top chords
  {
    const yA = -50, yB = 48
    const n = detail ? 14 : 7
    const zr = (d: number) => eTop(0, d) + 0.3
    const fr: V3[][] = []
    for (let k = 0; k <= n; k++) {
      const y = lerp(yA, yB, k / n)
      const P = (d: number, z: number): V3 => [XE + d, y, z]
      const f = [P(-1, zr(-1)), P(6, 37.5), P(18, 40), P(31, 38), P(37, zr(37))]
      rods(white, f, r, RS)
      rod(white, P(6, zr(6)), f[1], r * 0.8, RS)
      rod(white, P(31, zr(31)), f[3], r * 0.8, RS)
      rod(white, P(6, zr(6)), f[2], r * 0.7, RS)
      rod(white, P(31, zr(31)), f[2], r * 0.7, RS)
      if (detail) rod(white, P(18, zr(18)), f[2], r * 0.7, RS)
      fr.push(f)
    }
    for (let k = 0; k < n; k++) {
      const a = fr[k], b = fr[k + 1]
      for (const j of [1, 2, 3]) rod(white, a[j], b[j], r * 0.8, RS)
      // diagonals in the front and back faces, and plan bracing between the top chords
      for (const j of [1, 3]) rod(white, k % 2 ? a[j] : [a[j][0], a[j][1], zr(a[j][0] - XE)], k % 2 ? [b[j][0], b[j][1], zr(b[j][0] - XE)] : b[j], r * 0.7, RS)
      if (detail) { rod(white, a[1], b[2], r * 0.6, RS); rod(white, a[3], b[2], r * 0.6, RS) }
    }
  }
  // the two blue and white striped columns at the Shed End corner
  for (const [cx, cy] of [[60.5, -58.5], [65.5, -58.5]] as [number, number][]) {
    const n = 8, R = 1.6
    for (let k = 0; k < n; k++) {
      const a0 = (2 * Math.PI * k) / n, a1 = (2 * Math.PI * (k + 1)) / n
      const p0: V3 = [cx + R * Math.cos(a0), cy + R * Math.sin(a0), 0], p1: V3 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1), 0]
      oq(k % 2 ? white : blue, p0, p1, [p1[0], p1[1], 38], [p0[0], p0[1], 38], [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2), 0])
    }
    prism(white, Array.from({ length: n }, (_, k) => [cx + R * Math.cos((2 * Math.PI * k) / n), cy + R * Math.sin((2 * Math.PI * k) / n)] as [number, number]), 37.9, 38.2)
  }
  // the grey "CHELSEA FOOTBALL CLUB" block at the corner
  prism(concrete, [[56, -74], [70, -66], [70, -53], [56, -53]], 0, 22)

  // ------------------------------------------------- Matthew Harding Stand
  const mSts = line(XW + 1, YN, XE - 0.5, YN, [0, 1], detail ? 8 : 4)
  const mD = mSts.map((s) => Dray(s, 32))
  const mTop = stand({
    sts: mSts, D: (i) => mD[i], zF: () => 24, zB: () => 26, d0: -2, th: 1.1,
    seats: (i, u) => [[0, 0, blue], [0, 1.2, blue], [13, 6.5, win], [13, 10, blue], [26, 19, concrete], [26, u(26), null]],
    bands: [[0, 4, blue], [4, 26, concrete], [9, 12.5, win, 0.05], [16, 19.5, win, 0.05]],
  })
  for (const x of [XW - 6, XE + 5]) {
    const foot: V3 = [x, YN + 29, r * 1.6], apex: V3 = [x, YN + 29, 35]
    rod(white, foot, apex, r * 1.6, RS)
    for (const f of [0.2, 0.45]) {
      const xs = lerp(x < 0 ? XW + 1 : XE - 0.5, x < 0 ? XE - 0.5 : XW + 1, f)
      rod(white, apex, [xs, YN - 1.5, 24.4], r * 0.45, RS)
      rod(white, apex, [xs, YN + 14, mTop(0, 14) + 0.2], r * 0.45, RS)
    }
  }

  // ------------------------------------------------------------- Shed End
  const sSts = line(XE - 0.5, YS, XW + 1, YS, [0, -1], detail ? 8 : 4)
  const sD = sSts.map((s) => Dray(s, 21))
  stand({
    sts: sSts, D: (i) => sD[i], zF: () => 19, zB: () => 20.5, d0: -2, th: 1.0,
    seats: (i, u) => [[0, 0, blue], [0, 1.2, blue], [9, 5, win], [9, 8, blue], [17, 14, concrete], [17, u(17), null]],
    bands: [[0, 4, blue], [4, 20.5, concrete], [8, 11, win, 0.05]],
  })
  // the Shed End's block on to Fulham Road
  prism(concrete, [[-27.2, -102.5], [-13.4, -102.7], [-13.2, -74.2], [-27.2, -74.2]], 0, 16)
  prism(win, [[-27.15, -102.45], [-13.45, -102.65], [-13.45, -102.4], [-27.15, -102.2]], 6, 13)

  // ------------------------------------------------------------- corners
  for (const [c, a0, a1, max] of [
    [[XW, YS], 180, 270, 36], [[XW, YN], 270, 360, 32], [[XE, YN], 0, 90, 32], [[XE, YS], 90, 180, 22],
  ] as [[number, number], number, number, number][]) {
    const sts = fan(c, a0, a1, detail ? 8 : 4, 0.01)
    const D = sts.map((s) => Math.max(14, Math.min(max, rayOutline(OUTLINE, c, s.n) - 0.3)))
    stand({
      sts, D: (i) => D[i], zF: () => 16, zB: () => 16.5, d0: 2, th: 0.9,
      seats: (i, u) => [[0, 0, blue], [0, 1.2, blue], [12, 10.5, concrete], [12, u(12), null]],
      bands: [[0, 4, blue], [4, 16.5, concrete], [8, 11, win, 0.05]],
    })
  }

  const out = [
    { part: blue, material: M.blue },
    { part: concrete, material: M.concrete },
    { part: white, material: M.white },
    { part: roof, material: M.roof },
    { part: win, material: M.window },
    { part: lamp, material: M.lamp },
  ]
  liftField(out, FIELD)
  return out
}

if (import.meta.main) {
  writeLods('Stamford Bridge', [
    { file: `${ID}.glb`, parts: build(false) },
    { file: `${ID}.detail.glb`, parts: build(true) },
  ])
}
