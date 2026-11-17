/**
 * The Crescent (1985-86, Johnson/Burgee Architects for Caroline Rose Hunt's
 * Rosewood Corporation), Cedar Springs Road at McKinney Avenue, Uptown
 * Dallas: original procedural geometry, CC0-1.0.
 * bun generators/dal-the-crescent.ts [out.glb]
 *
 * The model covers the whole complex as one placement: the three office
 * towers (100, 200 and 300 Crescent Court) that bend in a shallow crescent
 * along Cedar Springs Road, the glass bays at their joints, and the low hotel and shops block north of the motor court
 * (Hotel Crescent Court, now the Rosewood, and the Crescent shops with
 * Stanley Korshak), all in Indiana limestone under slate mansards.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor
 * (-96.804225 32.794243), the area centroid of everything the model
 * replaces, on the lowest ground under the footprint. Placed at bearing 0:
 * the complex has no single axis (the towers turn through 25 degrees along
 * the crescent and the shops block is a triangle), so every part is drawn
 * in the north-up frame at its OSM position and angle.
 *
 * Form: three limestone slabs, 18, 19 and 18 storeys, about 65 x 35 m each,
 * set end to end and each turned about 12 degrees from the last. Each wears
 * a tall slate mansard, about three storeys, with a row of limestone
 * dormers and a row of small windows above them, its corners cut back
 * where the towers meet. In the middle of each long face a 17 m bay stands
 * 3 m proud and runs from the ground up into the mansard, with a tall
 * arched window of pale glass up its centre. Where the towers meet,
 * full-height rounds of grey-green glass, banded at every other floor,
 * stand in the notched corners and end in glass and iron cage domes. The
 * outer end faces of the side towers carry a narrow glass strip instead. North of
 * the motor court the hotel's five-storey crescent wing, with a taller
 * central pavilion, wraps around to the triangular shops building, three
 * storeys of limestone under slate mansards with steep pavilion roofs at
 * its corners, round an open courtyard.
 *
 * Identifying features, in order: the three slate mansards with dormers in
 * a row on a curve; the arched glass bays in the middle of each tower; the
 * glass rounds and cage domes at the joints; pale limestone against grey
 * slate; the lower mansard-roofed hotel and shops in front.
 *
 * Sources
 * - OSM: way/619505674 (300 Crescent Court, 18 levels), way/28544759 (200,
 *   18 levels), way/619505673 (100, 18 levels): the towers, drawn from
 *   these rings as they are. way/619505672, way/619505671, way/619505670
 *   (building=roof, layer 1): the low segments at the joints, under the
 *   glass rounds. relation/6941686 (500 Crescent Court, building=commercial,
 *   outer way/471559071, inners way/471559070 and way/471559069): the hotel
 *   and shops as one multipolygon. Hotel Crescent Court is node/8529954190
 *   inside it. way/619505669 east of 100 Crescent Court is a separate
 *   building and is left to the map.
 * - Lidar (measured): USGS 3DEP TX_Pecos_Dallas_B3_2018 (2018 flight), 1 m
 *   grid. The towers return nothing above about 52 m, so they are footprint
 *   only. The low block returns well (heights above the street, about
 *   2.4 m over ground_min): shops roofs 17.6 m with corner pavilions
 *   25-28 m; hotel wings 18.4 m, its end pavilions 24-27 m and its central
 *   pavilion 37.6 m; the plan of every wing and the open courtyards.
 * - Mapterhorn terrain: falls about 2.5 m from the south-east to the
 *   north-west corner of the site; no plaza or podium in it.
 * - NAIP (USGS) orthophoto: the towers' flat roofs inside the mansards and
 *   their cut corners, the round domes at the joints, the low block's plan.
 * - Published: roof 76.05 m (249.5 ft); a 19-storey centre tower and two
 *   18-storey side towers in a crescent; a 5-storey hotel; low triangular
 *   retail building; Indiana limestone, cut-slate roofs, cast-aluminium
 *   balconies, trellises and railings; Johnson/Burgee, 1982-86 (Wikipedia,
 *   "The Crescent (Dallas)").
 * - Photos (Wikimedia Commons; shapes and colours come from these):
 *   - "The Crescent 2016.jpg", Dallasedits, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Crescent_2016.jpg
 *     (from the north-east: shops pavilions in front, all three towers,
 *     limestone and slate colours, the arched bays and dormers)
 *   - "The Crescent, Dallas.jpg", André Corboz, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Crescent,_Dallas.jpg
 *     (from the south: the three towers end to end, the arched bays, the
 *     glass rounds at the joints, the mansards' proportion)
 *   - "The Crescent Uptown Dallas.jpg", Dallasedits, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:The_Crescent_Uptown_Dallas.jpg
 *     (aerial from the north: hotel and shops plan, the hotel's central
 *     pavilion, the crescent of towers behind)
 *   - "Crescent Atrium.jpg", Dallasedits, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Crescent_Atrium.jpg
 *     (towers' mansards from the north: two dormer rows, arched windows in
 *     the mansards, cage domes at the joints)
 *   - "Dallas Rosewood Crescent Hotel courtyard.jpg", Kari Sullivan, CC BY
 *     2.0, https://commons.wikimedia.org/wiki/File:Dallas_Rosewood_Crescent_Hotel_courtyard.jpg
 *     (the shops courtyard; open to the sky)
 * - Look-only: none used.
 *
 * Numbers
 * - Tower plans: OSM. Centre tower top 76 m: published. The three share
 *   one cornice at 60 m; the side towers' mansards are 11 m (top 71 m),
 *   the centre tower's 16 m (slopes inset 5.5 and 7 m): measured on the Corboz photo (about
 *   0.15 m/px on the face, from the OSM width of the limestone between the
 *   notches), scaled to the published top.
 * - Arched bays (3 m proud, 17 m wide from OSM; glass 6.5 m wide, rising
 *   to 5 m above the cornice), dormers (3 x 4.6 m, every 5 m), glass rounds
 *   at the joints (radius 6.5 m, set 2.5 m into the notches so they stand
 *   about 4 m proud, banded every 8 m), domes (radius 6.5 m), the outer
 *   end faces' glass strips (4.8 m wide): estimated from the photos.
 * - Colours from the Corboz photo, pulled to palette lightness: limestone
 *   near-white #ede7dd, slate cool dark grey #6c747b, joint glass grey-green
 *   #9fb3b8.
 * - Low block: wing centre-lines and widths traced from the lidar and OSM;
 *   eaves 13-14 m and every roof height from the lidar.
 * - Tower windows: one small panel (1.6 x 2.1 m) a window, a storey of
 *   4.0 m, to match the photos' dense grid of punched windows; the bay
 *   fronts beside the arched glass are plain stone, as in the photos; the low block's windows
 *   are one panel a bay over the three storeys (13.2 m).
 *
 * Doubts
 * - The notches at the joints are read as glass rounds standing in them
 *   (no photo shows rounds at the outer ends, so those notches stay bare
 *   stone with a flush strip on the end face); how far the glass stands out past the face is
 *   estimated.
 * - The towers' outer end faces are slanted in OSM (the crescent fans); the
 *   mansards are drawn square to each tower and slightly overhang the
 *   ring at the slanted ends.
 * - Left out: the iron cresting along the mansards' tops, the cast-
 *   aluminium balconies on the glass rounds, the second row of small
 *   dormers drawn as flush windows, the motor court's canopies and
 *   fountains, the shops' glass-roofed galleries, the entrance arches.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { prism, panels, poly, type PanelOpts } from './dal-chase-tower'
import { finishGlb, type XY } from './sea-columbia-center'

type T = (u: number, v: number) => XY
/** A local frame: u along `deg` (counter-clockwise from east), v to its left. */
const frame = (cx: number, cy: number, deg: number): T => {
  const c = Math.cos((deg * Math.PI) / 180), s = Math.sin((deg * Math.PI) / 180)
  return (u, v) => [cx + u * c - v * s, cy + u * s + v * c]
}
/** A frame from a to b, origin at a. */
const along = (a: XY, b: XY): [T, number] => [frame(a[0], a[1], (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI), Math.hypot(b[0] - a[0], b[1] - a[1])]

const rectL = (t: T, u0: number, u1: number, v0: number, v1: number): XY[] => [t(u0, v0), t(u1, v0), t(u1, v1), t(u0, v1)]

/** Inset a convex counter-clockwise ring by d. */
function inset(r: XY[], d: number): XY[] {
  const n = r.length
  const lines = r.map((a, i) => {
    const b = r[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    const nx = -dy / l, ny = dx / l // left = inward
    return { p: [a[0] + nx * d, a[1] + ny * d] as XY, d: [dx / l, dy / l] as XY }
  })
  return r.map((_, i) => {
    const A = lines[(i - 1 + n) % n], B = lines[i]
    const den = A.d[0] * B.d[1] - A.d[1] * B.d[0]
    const t = ((B.p[0] - A.p[0]) * B.d[1] - (B.p[1] - A.p[1]) * B.d[0]) / den
    return [A.p[0] + A.d[0] * t, A.p[1] + A.d[1] * t] as XY
  })
}

/** Sloped mansard from ring at z0 to the ring inset by d at z1, with a flat top. */
function mansard(slate: Part, ring: XY[], z0: number, z1: number, d: number, flat: Part = slate) {
  const top = inset(ring, d), n = ring.length
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], c = top[(i + 1) % n], e = top[i]
    const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey)
    const N: V3 = [(ey / l) * (z1 - z0), (-ex / l) * (z1 - z0), d]
    poly(slate, [[a[0], a[1], z0], [b[0], b[1], z0], [c[0], c[1], z1], [e[0], e[1], z1]], N)
  }
  for (let i = 1; i < n - 1; i++) poly(flat, [[top[0][0], top[0][1], z1], [top[i][0], top[i][1], z1], [top[i + 1][0], top[i + 1][1], z1]], [0, 0, 1])
}

/** Limestone walls to the eave and a slate mansard over a local rectangle. */
function block(stone: Part, slate: Part, t: T, u0: number, u1: number, v0: number, v1: number, z0: number, eave: number, top: number, d: number, flat: Part = slate) {
  const r = rectL(t, u0, u1, v0, v1)
  prism(stone, null, r, z0, eave, 0.4)
  mansard(slate, r, eave, top, d, flat)
}

/** Window panels on a local face. side: 'S' faces -v at v = c, 'N' +v, 'E' +u at u = c, 'W' -u. */
function face(part: Part, t: T, side: 'N' | 'S' | 'E' | 'W', c: number, s0: number, s1: number, z0: number, z1: number, g: PanelOpts, edge = 0.8) {
  const L = s1 - s0
  if (L < 2) return
  const [a, b]: [XY, XY] =
    side === 'S' ? [t(s0, c), t(s1, c)] : side === 'N' ? [t(s1, c), t(s0, c)] : side === 'W' ? [t(c, s1), t(c, s0)] : [t(c, s0), t(c, s1)]
  panels(part, a, b, z0, z1, [[edge, L - edge]], g)
}

/** A flat shape on a local face at v = c (sign sg: -1 faces -v), points as [u, z], proud by p. */
function onFace(part: Part, t: T, c: number, sg: number, pts: [number, number][], p = 0.08) {
  const n0 = t(0, 0), n1 = t(0, sg)
  const N: V3 = [n1[0] - n0[0], n1[1] - n0[1], 0]
  poly(part, pts.map(([u, z]) => { const q = t(u, c + sg * p); return [q[0], q[1], z] as V3 }), N)
}

/** Flush windows on a mansard slope over local face v = c (sg -1 faces -v), at u positions. */
function slopeWins(part: Part, t: T, c: number, sg: number, us: number[], w: number, eave: number, top: number, d: number, z0: number, z1: number) {
  const at = (z: number) => c - sg * (d * (z - eave)) / (top - eave) + sg * 0.1
  const n0 = t(0, 0), n1 = t(0, sg)
  const N: V3 = [(n1[0] - n0[0]) * (top - eave), (n1[1] - n0[1]) * (top - eave), d]
  for (const u of us) {
    const p = (uu: number, z: number): V3 => { const q = t(uu, at(z)); return [q[0], q[1], z] }
    poly(part, [p(u - w / 2, z0), p(u + w / 2, z0), p(u + w / 2, z1), p(u - w / 2, z1)], N)
  }
}

/** Evenly spaced positions in [a, b], about `step` apart. */
const spread = (a: number, b: number, step: number): number[] => {
  const n = Math.max(1, Math.round((b - a) / step))
  return Array.from({ length: n }, (_, k) => a + ((k + 0.5) * (b - a)) / n)
}

/** A cylinder wall, or the arc of it from a0 through `span` radians. */
function cylinder(part: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg: number, a0 = 0, span = 2 * Math.PI) {
  for (let k = 0; k < seg; k++) {
    const a = a0 + (span * k) / seg, b = a0 + (span * (k + 1)) / seg
    const A: V3 = [cx + r * Math.cos(a), cy + r * Math.sin(a), 0], B: V3 = [cx + r * Math.cos(b), cy + r * Math.sin(b), 0]
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    part.tri([A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], undefined, undefined, undefined, [na, nb, nb])
    part.tri([A[0], A[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], undefined, undefined, undefined, [na, nb, na])
  }
}

function dome(part: Part, cx: number, cy: number, r: number, z0: number, seg: number, rings: number) {
  const P = (k: number, j: number): [V3, V3] => {
    const a = (2 * Math.PI * k) / seg, e = ((Math.PI / 2) * j) / rings
    const n: V3 = [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)]
    return [[cx + r * n[0], cy + r * n[1], z0 + r * n[2]], n]
  }
  for (let j = 0; j < rings; j++) for (let k = 0; k < seg; k++) {
    const [a, na] = P(k, j), [b, nb] = P(k + 1, j), [c, nc] = P(k + 1, j + 1), [d, nd] = P(k, j + 1)
    part.tri(a, b, c, undefined, undefined, undefined, [na, nb, nc])
    if (j < rings - 1) part.tri(a, c, d, undefined, undefined, undefined, [na, nc, nd])
  }
}

function build() {
  const stone = new Part(), slate = new Part(), win = new Part(), bay = new Part(), glass = new Part(), roof = new Part()

  // ------------------------------------------------------------ the towers
  // OSM rings in the model frame.
  const R300: XY[] = [[-0.2, -91.3], [-2.5, -92.6], [-4.2, -94.5], [-5.2, -96.9], [-5.3, -99.5], [-4.8, -101.1], [-10.6, -102.6], [-22.0, -105.1], [-21.5, -107.9], [-39.5, -111.4], [-40.2, -108.1], [-42.2, -108.4], [-56.2, -109.7], [-56.3, -108.5], [-57.3, -106.1], [-59.1, -104.3], [-61.4, -103.1], [-64.0, -102.8], [-64.8, -84.2], [-62.3, -83.7], [-60.1, -82.3], [-58.5, -80.3], [-57.7, -77.8], [-57.8, -75.3], [-57.8, -74.6], [-45.8, -73.4], [-46.2, -71.0], [-29.4, -67.7], [-28.9, -70.5], [-17.4, -68.0], [-15.4, -67.5], [-15.1, -68.4], [-14.2, -70.8], [-12.5, -72.8], [-10.3, -74.1], [-7.8, -74.6], [-5.2, -74.2]]
  const R200: XY[] = [[15.3, -57.3], [14.1, -54.6], [28.7, -48.2], [29.9, -50.9], [35.9, -48.0], [44.8, -43.2], [46.1, -45.3], [48.1, -46.9], [50.5, -47.7], [53.1, -47.7], [55.5, -46.9], [64.5, -62.6], [62.5, -64.3], [61.2, -66.5], [60.8, -69.1], [61.2, -71.6], [62.3, -73.5], [48.8, -80.7], [44.1, -83.0], [45.1, -85.3], [30.5, -91.6], [29.5, -89.5], [20.2, -93.2], [9.6, -96.8], [8.8, -94.6], [7.1, -92.7], [4.9, -91.4], [2.3, -90.9], [-0.2, -91.3], [-5.2, -74.2], [-2.9, -73.0], [-1.2, -71.1], [-0.2, -68.7], [-0.1, -66.1], [-0.8, -63.7], [-1.0, -63.2], [9.7, -59.6]]
  const R100: XY[] = [[55.5, -46.9], [57.5, -45.2], [58.9, -43.0], [59.4, -40.5], [59.0, -38.0], [57.8, -35.7], [57.6, -35.5], [60.9, -33.4], [70.1, -26.9], [68.0, -24.1], [78.3, -16.7], [80.1, -19.2], [83.9, -16.1], [93.8, -7.3], [94.7, -8.2], [97.1, -9.2], [99.7, -9.4], [102.1, -8.7], [104.3, -7.2], [117.5, -20.4], [116.0, -22.5], [115.3, -24.9], [115.5, -27.5], [116.6, -29.9], [117.7, -31.1], [111.0, -37.6], [103.3, -44.3], [106.2, -48.2], [92.7, -58.0], [90.4, -54.7], [87.6, -56.9], [75.2, -65.5], [75.0, -65.6], [74.0, -64.0], [71.9, -62.4], [69.5, -61.6], [66.9, -61.7], [64.5, -62.6]]
  // Each tower in its own frame (from the minimum-area rectangle of its ring).
  const towers = [
    { ring: R300, t: frame(-33.6, -89.4, 11.1), u0: -31.5, u1: 32.4, v0: -17.2, v1: 17.9, b0: -9.5, b1: 8.4, eave: 60, top: 71, md: 5.5, outer: 'W' },
    { ring: R200, t: frame(29.1, -70.1, 23.6), u0: -34.4, u1: 34.4, v0: -17.4, v1: 17.9, b0: -7.5, b1: 8.5, eave: 60, top: 76, md: 7, outer: '' },
    { ring: R100, t: frame(87.1, -36.2, 35.7), u0: -32.9, u1: 32.4, v0: -16.9, v1: 18.3, b0: -8.4, b1: 4.2, eave: 60, top: 71, md: 5.5, outer: 'E' },
  ]
  const CUT = 10.5, BAYD = 3, GW = 3.25
  const g: PanelOpts = { group: 4.0, spandrel: 1.9, bayW: 1.6, pier: 2.2, zMin: 5 }

  for (const tw of towers) {
    const { t, u0, u1, v0, v1, b0, b1, eave, top, md: MD } = tw
    prism(stone, null, tw.ring, 0, eave, 0.4)
    // the mansard, its corners cut back past the notches
    const oct: XY[] = [t(u0 + CUT, v0), t(u1 - CUT, v0), t(u1, v0 + CUT), t(u1, v1 - CUT), t(u1 - CUT, v1), t(u0 + CUT, v1), t(u0, v1 - CUT), t(u0, v0 + CUT)]
    prism(stone, null, oct, eave - 0.5, eave + 0.6, 0) // the cornice lip
    mansard(slate, oct, eave + 0.6, top, MD, roof)
    const bc = (b0 + b1) / 2
    for (const sg of [-1, 1]) {
      const fv = sg < 0 ? v0 : v1, side = sg < 0 ? 'S' : 'N'
      // the central bay, proud, rising into the mansard under a small hip
      const bv0 = sg < 0 ? v0 - BAYD : v1 - 1, bv1 = sg < 0 ? v0 + 1 : v1 + BAYD
      block(stone, slate, t, b0, b1, bv0, bv1, 0, eave + 6, eave + 9.5, 2.5)
      const bf = sg < 0 ? v0 - BAYD : v1 + BAYD
      // its arched window, pale glass, banded every three storeys
      const arch: [number, number][] = [[bc - GW, 3], [bc + GW, 3]]
      for (let k = 0; k <= 10; k++) { const a = (Math.PI * k) / 10; arch.push([bc + GW * Math.cos(a), eave + 2 + GW * Math.sin(a)]) }
      onFace(bay, t, bf, sg, arch)
      for (let z = 12; z < eave; z += 12) onFace(stone, t, bf, sg, [[bc - GW - 0.1, z - 0.6], [bc + GW + 0.1, z - 0.6], [bc + GW + 0.1, z + 0.6], [bc - GW - 0.1, z + 0.6]], 0.16)
      // punched windows either side of the bay
      face(win, t, side, fv, u0 + 7.8, b0, 0, eave, g, 0.9)
      face(win, t, side, fv, b1, u1 - 7.8, 0, eave, g, 0.9)
      // dormers: limestone boxes standing on the slope, and a row of small
      // windows above them
      const us = [...spread(u0 + CUT + 1, b0 - 1.5, 5), ...spread(b1 + 1.5, u1 - CUT - 1, 5)]
      const DZ0 = eave + 1.0, DZ1 = eave + 5.6, DD = (MD * (DZ1 - eave - 0.6)) / (top - eave - 0.6) + 0.6
      for (const u of us) {
        const dv0 = sg < 0 ? fv + 0.1 : fv - DD, dv1 = sg < 0 ? fv + DD : fv - 0.1
        prism(stone, slate, rectL(t, u - 1.5, u + 1.5, dv0, dv1), DZ0, DZ1, 0)
        onFace(win, t, sg < 0 ? dv0 : dv1, sg, [[u - 0.9, DZ0 + 0.5], [u + 0.9, DZ0 + 0.5], [u + 0.9, DZ1 - 0.6], [u - 0.9, DZ1 - 0.6]], 0.06)
      }
      slopeWins(win, t, fv, sg, us, 1.3, eave + 0.6, top, MD, eave + 7, eave + 9.2)
    }
    // the outer end face
    if (tw.outer) {
      // a tall narrow glass strip centred on it, banded like the bays'
      const fu = tw.outer === 'W' ? u0 : u1, su = tw.outer === 'W' ? -1 : 1, vc = (v0 + v1) / 2
      const n0 = t(0, 0), n1 = t(su, 0), N: V3 = [n1[0] - n0[0], n1[1] - n0[1], 0]
      const endPoly = (part: Part, pts: [number, number][], p: number) => poly(part, pts.map(([v, z]) => { const q = t(fu + su * p, v); return [q[0], q[1], z] as V3 }), N)
      endPoly(bay, [[vc - 2.4, 3], [vc + 2.4, 3], [vc + 2.4, eave - 1.5], [vc - 2.4, eave - 1.5]], 0.08)
      for (let z = 12; z < eave - 2; z += 12) endPoly(stone, [[vc - 2.5, z - 0.6], [vc + 2.5, z - 0.6], [vc + 2.5, z + 0.6], [vc - 2.5, z + 0.6]], 0.16)
      face(win, t, tw.outer as 'W' | 'E', fu, v0 + 7.8, vc - 2.4, 0, eave, g, 0.9)
      face(win, t, tw.outer as 'W' | 'E', fu, vc + 2.4, v1 - 7.8, 0, eave, g, 0.9)
    }
  }

  // glass rounds in the notches at the joints, under domes
  const RR = 6.5, IN = 2.5
  const rounds: { at: XY; z: number; dome: boolean; dir: XY; span: number }[] = []
  const out = (t: T, du: number, dv: number): XY => { const o = t(0, 0), p = t(du, dv); return [p[0] - o[0], p[1] - o[1]] }
  const [A, B, C] = towers
  for (const sg of [-1, 1]) {
    rounds.push({ at: A.t(A.u1, sg < 0 ? A.v0 + IN : A.v1 - IN), z: 60, dome: true, dir: out(A.t, 0, sg), span: 1.25 * Math.PI })
    rounds.push({ at: C.t(C.u0, sg < 0 ? C.v0 + IN : C.v1 - IN), z: 60, dome: true, dir: out(C.t, 0, sg), span: 1.25 * Math.PI })
  }
  void B
  for (const r of rounds) {
    const a0 = Math.atan2(r.dir[1], r.dir[0]) - r.span / 2, n = Math.round((12 * r.span) / (2 * Math.PI))
    cylinder(bay, r.at[0], r.at[1], RR, 0, r.z, n, a0, r.span)
    for (let z = 8; z < r.z - 2; z += 8) cylinder(stone, r.at[0], r.at[1], RR + 0.2, z - 0.7, z + 0.7, n, a0, r.span)
    cylinder(stone, r.at[0], r.at[1], RR + 0.3, r.z - 0.8, r.z + 0.5, n, a0, r.span)
    if (r.dome) dome(glass, r.at[0], r.at[1], RR, r.z + 0.5, 12, 3)
    else poly(slate, Array.from({ length: 12 }, (_, k) => [r.at[0] + (RR + 0.3) * Math.cos((2 * Math.PI * k) / 12), r.at[1] + (RR + 0.3) * Math.sin((2 * Math.PI * k) / 12), r.z + 0.5] as V3), [0, 0, 1])
  }

  // ------------------------------------------------- hotel and shops (low)
  // Centre-lines traced from the lidar and OSM, in the model frame.
  const S = (x: number, y: number): XY => [x + 21.1, y - 26.9] // from the survey frame (-96.8040, 32.7940)
  const gl: PanelOpts = { group: 13.2, spandrel: 3.4, bayW: 2.0, pier: 5.5, zMin: 1.5 }
  const wings: { a: XY; b: XY; w: number; eave: number; top: number }[] = [
    { a: S(-72, 40), b: S(-72, 140), w: 24, eave: 13, top: 17.6 }, // shops, west
    { a: S(-66.6, 140.5), b: S(40.7, 41.3), w: 24, eave: 13, top: 17.6 }, // shops, north-east
    { a: S(-84, 46), b: S(-28, 46), w: 16, eave: 13, top: 17.6 }, // shops, south
    { a: S(-89, 9), b: S(-20, 11), w: 20, eave: 14, top: 18.4 }, // hotel, west arm
    { a: S(-20, 11), b: S(30, 55), w: 18, eave: 14, top: 18.4 }, // hotel, east arm
  ]
  for (const wg of wings) {
    const [t, L] = along(wg.a, wg.b)
    const h = wg.w / 2
    block(stone, slate, t, 0, L, -h, h, 0, wg.eave, wg.top, 4.2, roof)
    for (const sg of [-1, 1]) {
      face(win, t, sg < 0 ? 'S' : 'N', sg * h, 2, L - 2, 0, wg.eave, gl, 1)
      slopeWins(win, t, sg * h, sg, spread(3, L - 3, 5), 1.4, wg.eave, wg.top, 4.2, wg.eave + 0.8, wg.eave + 2.8)
    }
  }
  // pavilions: steep slate roofs over square limestone blocks
  const pav: { at: XY; s: number; eave: number; top: number; deg: number }[] = [
    { at: S(-21, 18), s: 10, eave: 24, top: 37.6, deg: 20 }, // hotel centre
    { at: S(-80, 6), s: 6, eave: 18, top: 26.5, deg: 0 }, // hotel, west end
    { at: S(27, 54), s: 6.5, eave: 18, top: 26.5, deg: 42 }, // hotel, east end
    { at: S(-78, 45), s: 8, eave: 15, top: 28, deg: 0 }, // shops corners and mid-points
    { at: S(-77, 86), s: 8, eave: 15, top: 27, deg: 0 },
    { at: S(-73, 136), s: 8, eave: 15, top: 28, deg: 0 },
    { at: S(-27, 107), s: 8, eave: 15, top: 27, deg: -43 },
    { at: S(8, 75), s: 8, eave: 15, top: 27, deg: -43 },
  ]
  for (const p of pav) {
    const t = frame(p.at[0], p.at[1], p.deg)
    block(stone, slate, t, -p.s, p.s, -p.s, p.s, 0, p.eave, p.top, p.s * 0.62)
    for (const [side, c] of [['S', -p.s], ['N', p.s]] as ['S' | 'N', number][]) face(win, t, side, c, -p.s, p.s, 0, p.eave, gl, 1.2)
    for (const [side, c] of [['W', -p.s], ['E', p.s]] as ['W' | 'E', number][]) face(win, t, side, c, -p.s, p.s, 0, p.eave, gl, 1.2)
  }

  const LIME = finish('crescent-limestone', 0xede7dd)
  const SLATE = finish('crescent-slate', 0x6c747b)
  const BAY = windowVariant(2, 0x9fb3b8)
  return finishGlb('dal-the-crescent', 'The Crescent', [
    { part: stone, material: LIME },
    { part: slate, material: SLATE },
    { part: win, material: PALETTE.window },
    { part: bay, material: BAY },
    { part: glass, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
  ], {
    bearing: 0, height: 76,
    replaces: ['way/619505674', 'way/28544759', 'way/619505673', 'way/619505672', 'way/619505671', 'way/619505670', 'relation/6941686'],
  }, 6500)
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/dal-the-crescent.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
