/**
 * National Building Museum (the Pension Building) — procedural, CC0-1.0, no
 * textures. bun generators/dc-national-building-museum.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0°, the long fronts on
 * F Street (south) and G Street (north) running due east–west. The anchor is
 * the area centroid of the OSM outline way/48040795 (lng -77.0175512,
 * lat 38.8977548).
 *
 * What it is: Montgomery C. Meigs's red-brick Renaissance block (1882–87):
 * a three-storey office range all round the Great Hall, and above it the
 * hall's own raised roofs. The identifying features: the long low red range
 * with its continuous terracotta frieze between the first and second
 * storeys and heavy cornice; the hall's walls rising behind the range with a
 * row of small arched windows; over the hall's two outer thirds, gabled
 * roofs with a long glazed monitor and a pedimented gable at each end (east
 * and west); over the middle third, the higher central clerestory with seven
 * great arched windows on each long side and a pediment full of stepped
 * lunettes facing north and south, a glazed lantern on its ridge; and the
 * tall brick chimneys.
 *
 * Covers and replaces: way/48040795 (the outline). OSM has no parts inside
 * it.
 *
 * Evidence
 * - OSM (measured): the outline, 123.7 × 62.9 m, square to the compass.
 *   OSM height 18.1 m (dcgis), lower than the photos' cornice; not used.
 * - Published (Wikipedia "National Building Museum"): the hall 316 × 116 ft
 *   (96 × 35 m); the terracotta frieze by Caspar Buberl, 1,200 ft round the
 *   building; 15 million bricks. HABS DC-76, sheet 1 (the west entrance,
 *   measured drawing, public domain): the frieze 5.8–6.6 m above the step,
 *   the entrance's cornice 7.3 m.
 * - Photos (Wikimedia Commons), heights read off the frontal HABS photo
 *   "South facade - Pension Building … HABS DC,WASH,152-58.tif" (Jack E.
 *   Boucher, public domain), scaled by the 123.7 m front: range cornice
 *   22.6 m; the hall's arched-window wall from the range roof to 26.6 m;
 *   the monitors 30–32.4 m, x ±19.7…38.6 m; the central clerestory's cornice
 *   34.3 m, its arched windows 26.8–32.6 m, its pediment to 42.5 m, 37 m
 *   wide. "SOUTH AND EAST FACADES … HABS DC,WASH,152-6.tif" (HABS, public
 *   domain): the east-end pediment, the lantern on the central ridge, the
 *   chimney. "National Building Museum - November 2023 - 2.jpg" and "… - 5.jpg"
 *   (APK, CC BY 4.0, the long fronts head on); "National Building Museum in
 *   Washington D.C. (Tony Webster).jpg" (Tony Webster, CC BY 2.0, from the
 *   south-west); aerial "Aerial view of National Building Museum and
 *   historic D.C. Courthouse … LCCN2010630889.tif" (Carol M. Highsmith,
 *   public domain): the roof plan, the pale metal roofs, the monitors.
 * - Estimated: the side roofs' ridge (31.6 m) and the monitors' width
 *   (10 m); the chimneys' places and height (31 m); window sizes; 28 bays on
 *   the long fronts and 14 on the ends.
 * - Simplified: the windows' pediments and the frieze's figures are left
 *   out (the frieze is a plain terracotta band); the dozens of small
 *   chimneys on the range roof are left out; the cornices are single bands.
 *   The brick is pulled lighter than the real dark red, to the palette's
 *   lightness; the terracotta trim a shade darker.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, orient, save, slab, walls } from './dc-nmaahc'
import { band, bayCentres, edgeArch, edgePanel, edges, hipRect, onEdge, type Edge } from './dc-old-post-office'

const rectRing = (x0: number, x1: number, y0: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
const lenOf = (e: Edge) => Math.hypot(e[1][0] - e[0][0], e[1][1] - e[0][1])

function build() {
  const brick = new Part(), trim = new Part(), win = new Part(), roof = new Part(), glass = new Part(), door = new Part()

  const X = 61.85, Y = 31.4 // the range
  const HX = 49.0, HY = 18.5 // the hall's walls
  const CX = 18.5 // the central clerestory's half-width
  const CORNICE = 22.6, RANGE_ROOF = 23.3
  const HALL = 26.6, SIDE_RIDGE = 31.6
  const CLER = 34.3, PED = 42.5

  // ---- The range.
  const R = rectRing(-X, X, -Y, Y)
  walls(brick, R, 0, CORNICE)
  band(trim, R, 0, 0.9, 0.15) // the base course
  band(trim, R, 5.8, 7.0, 0.22, 0.1) // the terracotta frieze
  band(trim, R, 13.4, 13.8, 0.15) // the second storey's sill course
  band(trim, R, CORNICE - 1.2, CORNICE, 0.85, 0.3) // the cornice
  // The range roof: low slopes from the cornice up to the hall's walls.
  roof.loft([R.map(([x, y]) => [x, y, CORNICE] as V3), rectRing(-HX, HX, -HY, HY).map(([x, y]) => [x, y, RANGE_ROOF] as V3)])

  // Windows: one per bay and storey; the doors in the middle of each front.
  for (const e of edges(R)) {
    const l = lenOf(e), n = l > 100 ? 28 : 14
    const centres = bayCentres(1.0, l - 1.0, (l - 2) / n)
    centres.forEach((c, k) => {
      const middle = k === Math.floor(n / 2)
      if (middle) edgeArch(door, e, c - 1.3, c + 1.3, 0, 4.6, 4)
      else edgePanel(win, e, c - 0.75, c + 0.75, 1.8, 4.9)
      edgePanel(win, e, c - 0.75, c + 0.75, 8.4, 12.3)
      edgePanel(win, e, c - 0.75, c + 0.75, 15.0, 19.0)
      void k
    })
  }

  // ---- The hall's walls above the range roof, with their row of small
  // arched windows.
  const H = rectRing(-HX, HX, -HY, HY)
  walls(brick, H, CORNICE, HALL)
  band(trim, H, HALL - 0.5, HALL, 0.4, 0.15)
  for (const e of edges(H)) {
    const l = lenOf(e)
    for (const c of bayCentres(0.8, l - 0.8, 3.0)) {
      const p = onEdge(e, c, 0, 0)
      if (Math.abs(p[0]) < CX - 0.5 && Math.abs(p[1]) > HY - 0.1) continue // the central clerestory's own front
      edgeArch(win, e, c - 0.6, c + 0.6, 24.6, 26.0, 3)
    }
  }

  // ---- The side roofs: gabled, ridge east–west, a glazed monitor along
  // each, a pediment at the outer end.
  for (const s of [-1, 1]) {
    const xi = s * CX, xo = s * HX
    const [x0, x1] = s < 0 ? [xo, xi] : [xi, xo]
    orient(roof, [[x0, -HY - 0.3, HALL], [x1, -HY - 0.3, HALL], [x1, 0, SIDE_RIDGE], [x0, 0, SIDE_RIDGE]], [0, -1, 2])
    orient(roof, [[x0, HY + 0.3, HALL], [x1, HY + 0.3, HALL], [x1, 0, SIDE_RIDGE], [x0, 0, SIDE_RIDGE]], [0, 1, 2])
    // The end pediment, brick, with a cornice line and stepped lunettes.
    orient(brick, [[xo, -HY, HALL], [xo, HY, HALL], [xo, 0, SIDE_RIDGE]], [s, 0, 0])
    const pe: Edge = s > 0 ? [[xo, -HY], [xo, HY]] : [[xo, HY], [xo, -HY]]
    for (const [c, h] of [[-9, 1.4], [-4.5, 2.5], [0, 3.1], [4.5, 2.5], [9, 1.4]] as Array<[number, number]>) {
      edgeArch(win, pe, HY + c - 1.2, HY + c + 1.2, HALL + 0.4, HALL + 0.4 + h + 0.6, 3)
    }
    // The monitor.
    const mx0 = s < 0 ? -38.6 : 19.7, mx1 = s < 0 ? -19.7 : 38.6, MY = 5.0, M0 = 29.6, M1 = 32.6
    slab(roof, rectRing(mx0, mx1, -MY, MY), M0, M1, 0.2, roof)
    for (const e of edges(rectRing(mx0, mx1, -MY, MY))) {
      const l = lenOf(e)
      if (l < 12) continue
      edgePanel(win, e, 0.6, l - 0.6, 30.3, 32.0)
    }
  }

  // ---- The central clerestory: walls to 34.3 m, seven great arched
  // windows on each long side, pediments north and south, the lantern.
  {
    const C = rectRing(-CX, CX, -HY, HY)
    walls(brick, C, HALL, CLER)
    band(trim, C, CLER - 0.9, CLER, 0.6, 0.25)
    for (const e of edges(C)) {
      const l = lenOf(e)
      const ns = Math.abs(e[0][1] - e[1][1]) < 0.01
      if (!ns) continue
      for (const c of bayCentres(1.5, l - 1.5, (l - 3) / 7)) edgeArch(win, e, c - 1.55, c + 1.55, 27.0, 32.6, 4)
      // The pediment and its lunettes, stepped to follow the rake.
      const ym = e[0][1], sy = Math.sign(ym)
      orient(brick, [[-CX, ym, CLER], [CX, ym, CLER], [0, ym, PED]], [0, sy, 0])
      for (const [c, h] of [[-12, 1.2], [-8, 2.3], [-4, 3.3], [0, 4.0], [4, 3.3], [8, 2.3], [12, 1.2]] as Array<[number, number]>) {
        edgeArch(win, e, l / 2 + c - 1.1, l / 2 + c + 1.1, CLER + 0.5, CLER + 0.5 + h + 0.5, 3)
      }
    }
    // Roof: ridge north–south, its slopes over the pediments' rakes.
    orient(roof, [[-CX - 0.4, -HY - 0.4, CLER], [-CX - 0.4, HY + 0.4, CLER], [0, HY + 0.4, PED], [0, -HY - 0.4, PED]], [-1, 0, 2])
    orient(roof, [[CX + 0.4, -HY - 0.4, CLER], [CX + 0.4, HY + 0.4, CLER], [0, HY + 0.4, PED], [0, -HY - 0.4, PED]], [1, 0, 2])
    // The glazed lantern on the ridge.
    const LY = 12, LW = 2.6, L0 = PED - 2.2, L1 = PED + 1.0
    orient(glass, [[-LW, -LY, L0], [-LW, LY, L0], [0, LY, L1], [0, -LY, L1]], [-1, 0, 1])
    orient(glass, [[LW, -LY, L0], [LW, LY, L0], [0, LY, L1], [0, -LY, L1]], [1, 0, 1])
    orient(glass, [[-LW, -LY, L0], [LW, -LY, L0], [0, -LY, L1]], [0, -1, 0])
    orient(glass, [[-LW, LY, L0], [LW, LY, L0], [0, LY, L1]], [0, 1, 0])
  }

  // ---- The tall chimneys at the hall's corners.
  for (const [x, y] of [[-44, -21.5], [44, -21.5], [-44, 21.5], [44, 21.5]] as XY[]) {
    slab(brick, rectRing(x - 1.2, x + 1.2, y - 1.2, y + 1.2), CORNICE, 31.0, 0, false)
    hipRect(trim, x - 1.5, x + 1.5, y - 1.5, y + 1.5, 31.0, 31.6, 0.4)
  }

  return [
    { part: brick, material: finish('nbm-brick', 0xc98872) },
    { part: trim, material: finish('nbm-terracotta', 0xb06e5a) },
    { part: win, material: PALETTE.window },
    { part: roof, material: finish('nbm-roof', 0xa3b1b3) },
    { part: glass, material: PALETTE.glass },
    { part: door, material: PALETTE.entrance },
  ]
}

if (import.meta.main) {
  await save('dc-national-building-museum', 'National Building Museum', build(), {
    bearing: 0, osm: 'way/48040795', footprint: [123.7, 62.9], height: 43.5,
  })
}
