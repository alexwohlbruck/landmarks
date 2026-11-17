/**
 * Westminster Cathedral (the Metropolitan Cathedral of the Most Precious
 * Blood), London — procedural, CC0-1.0, no textures.
 * bun generators/london-westminster-cathedral.ts
 *
 * Built with the London church kit in london-westminster-abbey.ts (merge
 * that generator first).
 *
 * Map frame: x along the church's axis from the west front towards the
 * apse (compass 148°), y to its left (liturgical north, compass 58°), z up,
 * metres. Placement bearing 58. Anchor: the area centroid of the OSM
 * outline way/10810446 (lng -0.1394625, lat 51.4958499). The axis sits at
 * y = −1.
 *
 * What it is: John Francis Bentley's Byzantine-revival cathedral (1895–
 * 1903): red brick banded with Portland stone, a nave of three shallow
 * copper domes and a fourth over the sanctuary on a flat roof terrace,
 * side chapels under slate, a west front of a great round arch, stair
 * turrets and lead-domed octagons, and the 87 m campanile (St Edward's
 * Tower) with its open loggia, octagonal lantern and dome.
 *
 * Covers and replaces the outline way/10810446 and its building:parts
 * (the four domes way/316505886, way/1149738194, way/1149738195,
 * way/1149738196, the campanile way/316505885, and way/450215204, 450215205,
 * 450215208, 450215210, 450215212, 450215213, 450215218, 450215219,
 * 450215222, 1436670422, 1436670424). The building way/776978738 that
 * straddles the south edge (the cathedral hall range) is a separate
 * building and is left to the map.
 *
 * Evidence
 * - OSM (measured): outline in this frame: west front x −50…−53.5 (the
 *   porch y −9.1…8.6), body to x 38, apse and east end to x 56; chapels to
 *   y 24.8 (north) and −22.2 (south); the campanile x −41…−31.5,
 *   y 15…24.6; domes centred x −33.6, −13.4, 7.1, 27.4.
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0 (measured above the lowest ground, 2.4 m AOD at the east end; the
 *   west piazza is 1.5 m higher): campanile 86 m to the dome (87–88 m with
 *   the cross); nave domes peak 36.5 m on a flat roof terrace at 31 m,
 *   between parapets y ±11.5; aisle and gallery roofs 26.8 m to y ±15.5;
 *   transept arms x −1.5…18.5 to y ±23 at 25 m; side chapels 12 m; apse
 *   21.5 m; east turrets 36.7 m; west porch 15.3 m, its octagonal domed
 *   towers 23.4 m, the west stair turrets 36.2 m, the gable wall 29.8 m.
 *   Mapterhorn terrain: falls 1.9 m from the west piazza to the east end.
 * - Published: campanile 284 ft (87 m) (Wikipedia, "Westminster
 *   Cathedral"); Grade I, Historic England list entry 1066500 (from the
 *   OSM heritage:website tag).
 * - Photos (Wikimedia Commons): "Westminster Cathedral at Dusk, London, UK
 *   - Diliff.jpg" (Diliff, CC BY-SA 3.0; west front and campanile, the
 *   night look); "Catedral de Westminster, Londres, Inglaterra, 2022-11-23,
 *   DD 22-24 HDR.jpg" (Diego Delso, CC BY-SA 4.0; west front square on);
 *   "Westminster Cathedral London, 4th May 2024 - 53708806889.jpg" (Frank
 *   Kovalchek, CC BY 2.0; west front by day, the colours); "Roofs of
 *   Westminster Cathedral 2011 01.jpg" and "... 02.jpg" (Andreas Praefcke,
 *   CC BY 3.0; from the campanile: the green copper domes on the pale
 *   roof terrace, slate chapel roofs, turrets); "London - Ambrosden Avenue
 *   - View South on Westminster Cathedral ... 87 m high.jpg" (Txllxt
 *   TxllxT, CC BY-SA 4.0; campanile stages, north side); "Westminster
 *   Cathedral - east side - geograph.org.uk - 2353924.jpg" (Mike Quinn,
 *   CC BY-SA 2.0; apse and east turrets); "Westminster Cathedral -
 *   geograph.org.uk - 2958684.jpg" (John Salmon, CC BY-SA 2.0; portal);
 *   "Westminster Cathedral - geograph.org.uk - 3370447.jpg" (Jonathan
 *   Billinger, CC BY-SA 2.0).
 * - Read off the photos (estimated, scaled to the lidar): porch arch 10.6 m
 *   across springing at 8 m; campanile shaft cornice 72.7 m, open loggia to
 *   76.6 m, octagonal lantern to 81 m, dome to 85.8 m; belfry openings
 *   63–67 m; white bands about every 1.2 m in reality.
 * - Simplified: the stone bands are drawn 3.4 m apart and a
 *   metre deep, broader and fewer than the real courses; mosaics,
 *   balustrades and carving are left out; the sanctuary dome's scalloped
 *   drum is a plain drum with windows.
 * - Look-only references: none.
 *
 * Night: the west front and the campanile are floodlit; the rest softly.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  cbox, cylinder, disc, face, faceAB, fp, gable, grow, holePanel, ngon, ngonPrism, polyPrism, qf, rect, saveLod, spire, tf, wallHoles,
  type Hole, type Rect, type Side, type XY,
} from './london-westminster-abbey'

/** White bands round a box, `period` apart and `h` deep, standing `out` proud. */
function bandsBox(p: Part, r: Rect, z0: number, z1: number, period: number, h: number, out = 0.05, first = period) {
  for (let z = z0 + first; z + h <= z1 + 1e-6; z += period) cbox(p, grow(r, out), z, z + h, { top: false })
}
/** White bands round a round tower. */
function bandsCyl(p: Part, cx: number, cy: number, r: number, n: number, z0: number, z1: number, period: number, h: number, first = period) {
  for (let z = z0 + first; z + h <= z1 + 1e-6; z += period) cylinder(p, cx, cy, r + 0.05, z, z + h, n)
}
/** A spherical cap (dome) of base radius r at z rising h, smooth, closed at the top. */
function dome(p: Part, cx: number, cy: number, r: number, z: number, h: number, n = 16, rings = 4) {
  // Sphere through the base circle and the apex.
  const R = (r * r + h * h) / (2 * h), zc = z + h - R
  const a0 = Math.asin(Math.min(1, r / R))
  const pts = Array.from({ length: rings + 1 }, (_, k) => {
    const a = a0 * (1 - k / rings)
    return [R * Math.sin(a), zc + R * Math.cos(a), a] as [number, number, number]
  })
  for (let k = 0; k < rings; k++) {
    const [r0, z0, a0k] = pts[k], [r1, z1, a1k] = pts[k + 1]
    for (let i = 0; i < n; i++) {
      const t0 = (2 * Math.PI * i) / n, t1 = (2 * Math.PI * (i + 1)) / n
      const P = (rr: number, zz: number, t: number): V3 => [cx + rr * Math.cos(t), cy + rr * Math.sin(t), zz]
      const N = (a: number, t: number): V3 => [Math.sin(a) * Math.cos(t), Math.sin(a) * Math.sin(t), Math.cos(a)]
      if (r1 < 1e-6) p.tri(P(r0, z0, t0), P(r0, z0, t1), P(0, z1, 0), undefined, undefined, undefined, [N(a0k, t0), N(a0k, t1), [0, 0, 1]])
      else {
        p.tri(P(r0, z0, t0), P(r0, z0, t1), P(r1, z1, t1), undefined, undefined, undefined, [N(a0k, t0), N(a0k, t1), N(a1k, t1)])
        p.tri(P(r0, z0, t0), P(r1, z1, t1), P(r1, z1, t0), undefined, undefined, undefined, [N(a0k, t0), N(a1k, t1), N(a1k, t0)])
      }
    }
  }
}
/** The upper half of a ring on a face: an arch's banded voussoirs. */
function archRing(p: Part, f: ReturnType<typeof face>, a: number, z: number, r0: number, r1: number, seg = 8, d = 0.08) {
  for (let k = 0; k < seg; k++) {
    const t0 = (Math.PI * k) / seg, t1 = (Math.PI * (k + 1)) / seg
    const P = (r: number, t: number) => fp(f, a + r * Math.cos(t), z + r * Math.sin(t), d)
    qf(p, P(r0, t0), P(r1, t0), P(r1, t1), P(r0, t1), f.n)
  }
}

export function build(lo = true) {
  const brick = new Part(), trim = new Part(), roof = new Part(), copper = new Part(), win = new Part(), door = new Part()
  const YC = -1.0
  const Y = (v: number) => YC + v
  const P = 3.4, BH = 1.0 // band period and depth
  const NX0 = -42, NX1 = 38

  // ---- Nave block: aisles and galleries to 26.8 m, the clerestory and
  // dome terrace to 31 m, a crenellated brick parapet.
  const lower = rect(NX0, NX1, Y(-15.5), Y(15.5)), upper = rect(NX0, NX1, Y(-11.5), Y(11.5))
  cbox(roof, lower, 0, 1.8, { top: false })
  cbox(brick, lower, 1.8, 26.8, { top: false })
  bandsBox(trim, lower, 1.8, 26.0, P, BH)
  cbox(trim, grow(lower, 0.2), 26.0, 26.9, { b: 0.15, bottom: true, top: false })
  // Slate lean-to roofs over the galleries, up to the clerestory.
  for (const sg of [-1, 1]) {
    const yo = sg > 0 ? lower.y1 + 0.2 : lower.y0 - 0.2, yi = sg > 0 ? upper.y1 : upper.y0
    qf(roof, [NX0, yo, 26.9], [NX1, yo, 26.9], [NX1, yi, 29.0], [NX0, yi, 29.0], [0, sg, 2])
  }
  // The clerestory and the pale roof terrace the domes stand on.
  cbox(brick, upper, 26.8, 31.0, { top: trim })
  cbox(trim, grow(upper, 0.05), 28.4, 29.3, { top: false })
  // The terrace parapet: a brick wall ring with white coping.
  for (const [r, side] of [[rect(NX0, NX1, upper.y1 - 0.5, upper.y1), 'n'], [rect(NX0, NX1, upper.y0, upper.y0 + 0.5), 's']] as Array<[Rect, Side]>) {
    cbox(brick, r, 31.0, 32.0, { top: trim }); void side
  }
  // Clerestory: big round-headed windows between the dome piers, both sides.
  const DX = [-33.3, -12.7, 7.8, 28.0]
  for (const c of DX) for (const k of [-1, 1]) {
    const a = c + k * 4.6
    holePanel(win, face('n', upper.y1), { a0: a - 1.6, a1: a + 1.6, zb: 27.4, zs: 29.0, head: 'round' })
    holePanel(win, face('s', upper.y0), { a0: a - 1.6, a1: a + 1.6, zb: 27.4, zs: 29.0, head: 'round' })
  }
  // Gallery windows on the aisle walls, in pairs per bay.
  for (const c of DX.slice(0, 2)) for (const k of [-1.6, 1.6]) {
    holePanel(win, face('n', lower.y1), { a0: c + k * 2.3 - 1.0, a1: c + k * 2.3 + 1.0, zb: 17.5, zs: 21.0, head: 'round' })
    holePanel(win, face('s', lower.y0), { a0: c + k * 2.3 - 1.0, a1: c + k * 2.3 + 1.0, zb: 17.5, zs: 21.0, head: 'round' })
  }

  // ---- The domes: three over the nave, one over the sanctuary on a drum.
  for (const [i, c] of DX.entries()) {
    const r = i === 3 ? 9.2 : 10.0
    const z0 = 31.0, drum = i === 3 ? 2.2 : 1.6, top = i === 3 ? 35.4 : 37.5
    cylinder(copper, c, YC, r, z0, z0 + drum, lo ? 14 : 20)
    if (i === 3) {
      // The sanctuary drum's ring of windows.
      for (let k = 0; k < (lo ? 8 : 12); k++) {
        const t = (2 * Math.PI * (k + 0.5)) / (lo ? 8 : 12)
        const a: XY = [c + (r + 0.02) * Math.cos(t - 0.12), YC + (r + 0.02) * Math.sin(t - 0.12)]
        const b: XY = [c + (r + 0.02) * Math.cos(t + 0.12), YC + (r + 0.02) * Math.sin(t + 0.12)]
        holePanel(win, faceAB(b, a), { a0: 0, a1: Math.hypot(b[0] - a[0], b[1] - a[1]), zb: z0 + 0.5, zs: z0 + 1.4, head: 'flat' }, 0.05)
      }
    }
    dome(copper, c, YC, r, z0 + drum, top - z0 - drum, lo ? 14 : 20, lo ? 3 : 4)
    cylinder(copper, c, YC, 1.0, top - 0.3, top + 0.6, 8)
    dome(copper, c, YC, 1.0, top + 0.6, 0.6, 8, 2)
  }

  // ---- Transept arms, flat-roofed, with great round windows in their ends.
  for (const [y0, y1, side, at] of [[Y(15.5), 23.0, 'n', 23.0], [-22.2, Y(-15.5), 's', -22.2]] as Array<[number, number, Side, number]>) {
    const r = rect(-1.5, 18.5, y0, y1)
    cbox(roof, r, 0, 1.8, { top: false })
    cbox(brick, r, 1.8, 25.0, { top: roof })
    bandsBox(trim, r, 1.8, 24.2, P, BH)
    cbox(trim, grow(r, 0.2), 24.2, 25.1, { b: 0.15, bottom: true, top: false })
    const F = face(side, at)
    holePanel(win, F, { a0: 8.5 - 5.0, a1: 8.5 + 5.0, zb: 14.0, zs: 17.5, head: 'round' }, 0.08)
    for (const k of [-1, 0, 1]) holePanel(win, F, { a0: 8.5 + k * 3.0 - 1.0, a1: 8.5 + k * 3.0 + 1.0, zb: 4.0, zs: 9.0, head: 'round' })
    // A square stair turret at the outer east corner under a slate pyramid.
    const ty = side === 'n' ? 23.0 : -21.4
    cbox(brick, rect(17.2, 20.6, ty - 1.7, ty + 1.7), 0, 25.6, { top: false })
    bandsBox(trim, rect(17.2, 20.6, ty - 1.7, ty + 1.7), 1.8, 25.0, P, BH)
    spire(roof, [[16.9, ty - 2.0, 25.6], [20.9, ty - 2.0, 25.6], [20.9, ty + 2.0, 25.6], [16.9, ty + 2.0, 25.6]], [18.9, ty, 29.6])
  }

  // ---- Side chapels under slate: north and south, either side of the transepts.
  const chapels: Array<[Rect, boolean]> = [
    [rect(-40, -1.5, Y(15.5), 24.8), true], [rect(18.5, 37.0, Y(15.5), 24.0), true],
    [rect(-42, -1.5, -22.2, Y(-15.5)), false], [rect(18.5, 38.0, -22.2, Y(-15.5)), false],
  ]
  for (const [r, north] of chapels) {
    cbox(roof, r, 0, 1.8, { top: false })
    cbox(brick, r, 1.8, 10.5, { top: false })
    bandsBox(trim, r, 1.8, 10.0, P, BH)
    // A lean-to slate roof falling away from the nave.
    const zi = 13.2, zo = 10.5, yin = north ? r.y0 : r.y1, yout = north ? r.y1 + 0.3 : r.y0 - 0.3
    qf(roof, [r.x0 - 0.3, yout, zo], [r.x1 + 0.3, yout, zo], [r.x1 + 0.3, yin, zi], [r.x0 - 0.3, yin, zi], [0, north ? 1 : -1, 2])
    for (const x of [r.x0 - 0.3, r.x1 + 0.3]) tf(brick, [x, yout, zo], [x, yin, zo], [x, yin, zi], [x < 0 ? -1 : 1, 0, 0])
    tf(brick, [r.x0 - 0.3, yout, zo], [r.x0 - 0.3, yin, zi], [r.x0 - 0.3, yin, zo], [-1, 0, 0])
    const at = north ? r.y1 : r.y0, side: Side = north ? 'n' : 's'
    const n = Math.floor((r.x1 - r.x0) / 5.2)
    for (let k = 0; k < n; k++) {
      const c = r.x0 + ((r.x1 - r.x0) * (k + 0.5)) / n
      holePanel(win, face(side, at), { a0: c - 1.1, a1: c + 1.1, zb: 3.5, zs: 7.4, head: 'round' })
    }
  }

  // ---- The apse, the east turrets and the low ranges to the east.
  {
    const AC = 41.0, AR = 8.0
    const ring: XY[] = [[NX1 - 0.5, Y(-AR)], ...Array.from({ length: 9 }, (_, k) => { const t = -Math.PI / 2 + (Math.PI * k) / 8; return [AC + AR * Math.cos(t), YC + AR * Math.sin(t)] as XY }), [NX1 - 0.5, Y(AR)]]
    polyPrism(roof, ring, 0, 1.8)
    polyPrism(brick, ring, 1.8, 21.5)
    for (let z = 1.8 + P; z + BH <= 21.0; z += P) polyPrism(trim, ring.map(([x, y]) => [x + (x > AC ? (x - AC) / AR * 0.05 : 0), y + Math.sign(y - YC) * 0.05] as XY), z, z + BH)
    // A flat lead roof behind a white coping.
    polyPrism(trim, ring.map(([x, y]) => [x + (x > AC ? (x - AC) / AR * 0.2 : -0.2), y + Math.sign(y - YC) * 0.2] as XY), 21.5, 22.3, roof)
    // The sanctuary's east wall over the apse: a great lunette.
    holePanel(win, face('e', NX1), { a0: YC - 4.6, a1: YC + 4.6, zb: 24.6, zs: 24.6, head: 'round', seg: lo ? 6 : 8 }, 0.06)
    archRing(trim, face('e', NX1), YC, 24.6, 4.6, 5.3, lo ? 6 : 8, 0.1)
    for (let k = 1; k < 8; k += 2) {
      const a = ring[k], b = ring[k + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      holePanel(win, faceAB(a, b), { a0: L / 2 - 1.2, a1: L / 2 + 1.2, zb: 12.5, zs: 16.5, head: 'round' })
    }
    // The low retrochoir and the hall range on the south-east.
    cbox(brick, rect(48.0, 55.6, Y(-6), Y(6)), 0, 11.5, { top: roof })
    bandsBox(trim, rect(48.0, 55.6, Y(-6), Y(6)), 1.8, 11.0, P, BH)
    const hall = rect(42.4, 55.8, -25.8, -6.5)
    cbox(roof, hall, 0, 1.8, { top: false })
    cbox(brick, hall, 1.8, 12.5, { top: false })
    bandsBox(trim, hall, 1.8, 12.0, P, BH)
    gable(roof, brick, rect(42.4, 55.8, -25.9, -6.4), 12.5, 16.0, false)
    // Round stair turrets flanking the sanctuary, lead-domed.
    for (const s of [-1, 1]) {
      const ty = Y(s * 10.8)
      cylinder(brick, 39.5, ty, 1.9, 0, 33.0, lo ? 8 : 14)
      bandsCyl(trim, 39.5, ty, 1.9, lo ? 8 : 14, 1.8, 32.4, P, BH)
      cylinder(trim, 39.5, ty, 2.15, 32.2, 33.0, lo ? 8 : 14)
      dome(roof, 39.5, ty, 2.0, 33.0, 2.8, lo ? 8 : 14, 3)
      cylinder(trim, 39.5, ty, 0.25, 35.6, 36.7, 6)
    }
  }

  // ---- The west front.
  const XF = -53.5
  {
    // The porch: the great banded arch over the white stone portal.
    const porch = rect(XF, -48.0, -9.1, 8.6), F = face('w', XF), AC = -0.25
    const tym: Hole = { a0: AC - 5.3, a1: AC + 5.3, zb: 8.0, zs: 8.0, head: 'round', seg: lo ? 6 : 8 }
    wallHoles(brick, F, porch.y0, porch.y1, 1.8, 15.3, [tym], { depth: 1.6, back: door, reveal: trim })
    cbox(roof, porch, 0, 1.8, { top: false })
    for (const side of ['n', 's'] as Side[]) {
      const at = side === 'n' ? porch.y1 : porch.y0
      qf(brick, [XF, at, 1.8], [-48, at, 1.8], [-48, at, 15.3], [XF, at, 15.3], side === 'n' ? [0, 1, 0] : [0, -1, 0])
    }
    roof.cap([[XF, porch.y0, 15.3], [-48, porch.y0, 15.3], [-48, porch.y1, 15.3], [XF, porch.y1, 15.3]], true)
    archRing(trim, F, AC, 8.0, 5.3, 6.1, lo ? 6 : 10, 0.1)
    // The white portal screen below the arch, with three doors.
    qf(trim, fp(F, AC - 7.2, 1.8, 0.12), fp(F, AC + 7.2, 1.8, 0.12), fp(F, AC + 7.2, 8.0, 0.12), fp(F, AC - 7.2, 8.0, 0.12), F.n)
    cbox(trim, rect(XF - 0.4, XF + 0.2, porch.y0 - 0.1, porch.y1 + 0.1), 12.8, 15.5, { b: 0.15 })
    for (const [c, w, h] of [[AC, 2.6, 6.6], [AC - 4.2, 1.5, 5.0], [AC + 4.2, 1.5, 5.0]] as Array<[number, number, number]>) {
      holePanel(door, F, { a0: c - w / 2, a1: c + w / 2, zb: 1.8, zs: 1.8 + h, head: 'flat' }, 0.16)
    }
    for (const k of [-6.3, -2.6, 2.6, 6.3]) cbox(trim, rect(XF - 0.6, XF - 0.12, AC + k - 0.3, AC + k + 0.3), 1.8, 8.0, {})
    // Loggias either side of the arch at the top of the porch: real open arches.
    for (const s of [-1, 1]) {
      const c = AC + s * 7.4
      holePanel(door, F, { a0: c - 0.8, a1: c + 0.8, zb: 9.4, zs: 11.4, head: 'round' }, 0.06)
    }
    // White bands on the porch's flanks.
    for (let z = 1.8 + P; z + BH <= 12.5; z += P) {
      qf(trim, [XF, porch.y1 + 0.05, z], [-48, porch.y1 + 0.05, z], [-48, porch.y1 + 0.05, z + BH], [XF, porch.y1 + 0.05, z + BH], [0, 1, 0])
      qf(trim, [XF, porch.y0 - 0.05, z], [-48, porch.y0 - 0.05, z], [-48, porch.y0 - 0.05, z + BH], [XF, porch.y0 - 0.05, z + BH], [0, -1, 0])
    }

    // The upper front wall with three round-headed windows.
    const up = rect(-48.0, -45.5, Y(-10.5), Y(10.5))
    cbox(brick, up, 1.8, 23.0, { top: roof })
    bandsBox(trim, up, 15.3, 22.4, P, BH, 0.05, 1.2)
    for (const k of [-3.6, 0, 3.6]) holePanel(win, face('w', up.x0), { a0: YC + k - 1.2, a1: YC + k + 1.2, zb: 17.0, zs: 19.3, head: 'round' })
    // The west wall of the nave rising behind it, with its great lunette.
    const gw = rect(-44.4, NX0 + 0.5, Y(-7.6), Y(7.6))
    cbox(brick, gw, 1.8, 31.0, { top: roof })
    bandsBox(trim, gw, 23.0, 30.2, P, BH, 0.05, 1.0)
    cbox(trim, grow(gw, 0.2), 30.2, 31.2, { b: 0.15, bottom: true })
    holePanel(win, face('w', gw.x0), { a0: YC - 4.8, a1: YC + 4.8, zb: 24.0, zs: 24.0, head: 'round', seg: lo ? 6 : 8 }, 0.06)
    archRing(trim, face('w', gw.x0), YC, 24.0, 4.8, 5.5, lo ? 6 : 8, 0.1)

    // The twin stair turrets: round, banded, with an open stage and a lead dome.
    for (const s of [-1, 1]) {
      const ty = Y(s * 8.6), tx = -45.6, n = lo ? 8 : 14
      cylinder(roof, tx, ty, 2.1, 0, 1.8, n)
      cylinder(brick, tx, ty, 2.1, 1.8, 30.6, n)
      bandsCyl(trim, tx, ty, 2.1, n, 15.3, 30.0, P, BH, 0.9)
      cylinder(trim, tx, ty, 2.35, 30.6, 31.2, n)
      // The little belvedere: four piers round an open ring.
      for (let k = 0; k < 4; k++) {
        const t = (Math.PI / 2) * k + Math.PI / 4
        cylinder(brick, tx + 1.7 * Math.cos(t), ty + 1.7 * Math.sin(t), 0.45, 31.2, 33.0, 6)
      }
      cylinder(brick, tx, ty, 1.1, 31.2, 33.0, 8)
      cylinder(trim, tx, ty, 2.3, 33.0, 33.6, n)
      dome(roof, tx, ty, 2.15, 33.6, 2.4, n, 3)
      cylinder(trim, tx, ty, 0.2, 35.8, 36.6, 6)
    }
    // The octagonal towers at the porch's corners, under scaled lead domes.
    for (const s of [-1, 1]) {
      const ty = Y(s * 12.3), tx = -50.5
      ngonPrism(roof, tx, ty, 3.0, 8, 0, 1.8, { top: false })
      ngonPrism(brick, tx, ty, 3.0, 8, 1.8, 16.4, { top: false })
      for (let z = 1.8 + P; z + BH <= 16; z += P) ngonPrism(trim, tx, ty, 3.06, 8, z, z + BH, { top: false })
      // An arcaded stage under the dome: an arch in each face.
      const oc = ngon(tx, ty, 3.0, 8, 0)
      for (let k = 0; k < 8; k++) {
        const a: XY = [oc[k][0], oc[k][1]], b: XY = [oc[(k + 1) % 8][0], oc[(k + 1) % 8][1]], L = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (lo && k % 2) continue
        holePanel(door, faceAB(a, b), { a0: L / 2 - 0.6, a1: L / 2 + 0.6, zb: 16.6, zs: 18.0, head: 'round' }, 0.05)
      }
      ngonPrism(brick, tx, ty, 3.0, 8, 16.4, 19.0, { top: false })
      ngonPrism(trim, tx, ty, 3.3, 8, 19.0, 19.6, { top: false, bottom: true })
      dome(roof, tx, ty, 3.1, 19.6, 3.8, lo ? 10 : 16, 3)
      cylinder(trim, tx, ty, 0.25, 23.2, 24.2, 6)
    }
    // The wings: north towards the campanile, south with its arcade and lunette.
    const wN = rect(-50.0, NX0, Y(15.5), 24.8), wS = rect(-50.3, NX0, -23.0, Y(-15.5))
    for (const [r, h] of [[wN, 14.5], [wS, 15.0]] as Array<[Rect, number]>) {
      cbox(roof, r, 0, 1.8, { top: false })
      cbox(brick, r, 1.8, h, { top: roof })
      bandsBox(trim, r, 1.8, h - 0.6, P, BH)
      cbox(trim, grow(r, 0.15), h - 0.6, h + 0.2, { b: 0.12, bottom: true, top: false })
    }
    {
      const Fs = face('w', wS.x0), c = (wS.y0 + wS.y1) / 2
      holePanel(win, Fs, { a0: c - 3.2, a1: c + 3.2, zb: 4.5, zs: 6.5, head: 'round' }, 0.06)
      archRing(trim, Fs, c, 6.5, 3.2, 3.8, lo ? 6 : 8, 0.1)
      // The arcade along the top: real open arches with a back wall.
      const holes: Hole[] = [-2, -1, 0, 1, 2].map((k) => ({ a0: c + k * 1.6 - 0.55, a1: c + k * 1.6 + 0.55, zb: 11.0, zs: 13.0, head: 'round' as const }))
      wallHoles(brick, face('w', wS.x0 - 0.02), wS.y0 + 0.6, wS.y1 - 0.6, 10.6, 14.0, holes, { depth: 0.9, back: door, reveal: trim })
      const Fn = face('w', wN.x0), cn = (wN.y0 + wN.y1) / 2
      for (const k of [-2.3, 2.3]) holePanel(win, Fn, { a0: cn + k - 1.0, a1: cn + k + 1.0, zb: 4.0, zs: 7.6, head: 'round' })
    }
  }

  // ---- The campanile (St Edward's Tower): banded shaft, belfry, open
  // loggia, octagonal lantern and dome.
  {
    const cx = -36.3, cy = 19.8, h = 4.8, n = lo ? 10 : 12
    const r = rect(cx - h, cx + h, cy - h, cy + h)
    const SHAFT = 72.7, LOG = 77.2, LAN = 81.4, DOME = 85.8
    cbox(roof, r, 0, 1.8, { top: false })
    cbox(brick, r, 1.8, SHAFT - 1.2, { top: false })
    bandsBox(trim, r, 1.8, SHAFT - 2.0, P, BH)
    // Small arched windows up each face and the paired belfry openings.
    for (const [side, at, c] of [['n', r.y1, cx], ['s', r.y0, cx], ['e', r.x1, cy], ['w', r.x0, cy]] as Array<[Side, number, number]>) {
      const F = face(side, at)
      if (!lo) for (const z of [24, 33, 42, 51]) holePanel(win, F, { a0: c - 0.55, a1: c + 0.55, zb: z, zs: z + 1.8, head: 'round' }, 0.07)
      for (const k of [-1, 1]) holePanel(win, F, { a0: c + k * 1.15 - 0.85, a1: c + k * 1.15 + 0.85, zb: 63.0, zs: 66.0, head: 'round' }, 0.07)
    }
    // The cornice and balcony floor.
    cbox(trim, grow(r, 0.45), SHAFT - 1.2, SHAFT, { b: 0.2, bottom: true, top: false })
    roof.cap([[r.x0 - 0.45, r.y0 - 0.45, SHAFT], [r.x1 + 0.45, r.y0 - 0.45, SHAFT], [r.x1 + 0.45, r.y1 + 0.45, SHAFT], [r.x0 - 0.45, r.y1 + 0.45, SHAFT]], true)
    // The loggia: each face an open arcade of three round arches, a slab
    // thick, with the sky showing through to the lantern's core.
    const lr = grow(r, 0.2)
    const arch = (c: number): Hole => ({ a0: c - 1.05, a1: c + 1.05, zb: SHAFT, zs: SHAFT + 2.6, head: 'round', seg: lo ? 4 : 6 })
    for (const [side, at, c] of [['n', lr.y1, cx], ['s', lr.y0, cx], ['e', lr.x1, cy], ['w', lr.x0, cy]] as Array<[Side, number, number]>) {
      const a0 = side === 'n' || side === 's' ? lr.x0 : lr.y0, a1 = side === 'n' || side === 's' ? lr.x1 : lr.y1
      wallHoles(brick, face(side, at), a0, a1, SHAFT, LOG - 0.6, [arch(c - 3.0), arch(c), arch(c + 3.0)], { depth: 0.8, through: true, reveal: trim })
    }
    cbox(trim, grow(lr, 0.15), LOG - 0.6, LOG, { b: 0.12, bottom: true, top: false })
    // Its roof: a square ring round the lantern.
    {
      const o = grow(lr, 0.15), z = LOG
      const oc: V3[] = [[o.x0, o.y0, z], [o.x1, o.y0, z], [o.x1, o.y1, z], [o.x0, o.y1, z]]
      const ic = ngon(cx, cy, 3.0, 4, z, Math.PI / 4).map(([x, y]) => [x, y, z] as V3)
      // ngon with 4 sides at 45°: corners at (±2.12, ±2.12); match order to oc.
      const ord = [2, 3, 0, 1].map((k) => ic[k])
      for (let k = 0; k < 4; k++) qf(roof, oc[k], oc[(k + 1) % 4], ord[(k + 1) % 4], ord[k], [0, 0, 1])
    }
    // Corner turrets on the balcony.
    for (const [x, y] of [[lr.x0, lr.y0], [lr.x1, lr.y0], [lr.x1, lr.y1], [lr.x0, lr.y1]] as XY[]) {
      cylinder(brick, x, y, 0.75, LOG, LOG + 1.8, 8)
      dome(trim, x, y, 0.85, LOG + 1.8, 0.9, 8, 2)
    }
    // The octagonal lantern core rising through the loggia, with arched lights.
    ngonPrism(brick, cx, cy, 3.0, 8, SHAFT, LOG, { top: false })
    ngonPrism(trim, cx, cy, 3.0, 8, LOG, LAN - 0.6, { top: false })
    for (let z = LOG + 1.2; z + 0.6 <= LAN - 0.6; z += 2.0) ngonPrism(brick, cx, cy, 3.05, 8, z, z + 0.6, { top: false })
    const oc = ngon(cx, cy, 3.0, 8, 0)
    for (let k = 0; k < 8; k++) {
      const a: XY = [oc[k][0], oc[k][1]], b: XY = [oc[(k + 1) % 8][0], oc[(k + 1) % 8][1]], L = Math.hypot(b[0] - a[0], b[1] - a[1])
      holePanel(win, faceAB(a, b), { a0: L / 2 - 0.5, a1: L / 2 + 0.5, zb: LOG + 0.5, zs: LOG + 1.9, head: 'round' }, 0.08)
    }
    ngonPrism(trim, cx, cy, 3.35, 8, LAN - 0.6, LAN, { top: false, bottom: true })
    // The dome, dark lead, with a lantern and the cross.
    dome(roof, cx, cy, 3.2, LAN, DOME - LAN, lo ? 12 : 16, 4)
    cylinder(trim, cx, cy, 0.55, DOME - 0.2, DOME + 0.7, 8)
    dome(trim, cx, cy, 0.6, DOME + 0.7, 0.45, 8, 2)
    cbox(trim, rect(cx - 0.12, cx + 0.12, cy - 0.12, cy + 0.12), DOME + 1.1, 88.0, {})
    cbox(trim, rect(cx - 0.12, cx + 0.12, cy - 0.6, cy + 0.6), 87.0, 87.25, {})
  }

  // At night the west front and the campanile are floodlit; the rest softly.
  const lit = (q: V3, nn: V3): number => (nn[2] > 0.8 ? 0.2 : q[0] < -40 || (q[0] < -30 && q[1] > 13) ? 0.95 : 0.35)
  return [
    { part: brick, material: { ...finish('cathedral-brick', 0xc0745c), floodlight: lit } },
    { part: trim, material: { ...PALETTE.trim, floodlight: lit } },
    { part: roof, material: PALETTE.roof },
    { part: copper, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  const extras = { source: 'generators/london-westminster-cathedral.ts' }
  await saveLod('london-westminster-cathedral', 'Westminster Cathedral', build(true), extras, false, 6500)
}
