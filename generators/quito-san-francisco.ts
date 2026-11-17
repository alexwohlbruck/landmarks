/**
 * Church and Monastery of San Francisco, Quito — procedural, CC0-1.0, no
 * textures. bun generators/quito-san-francisco.ts
 *
 * Uses the Quito church kit in quito-la-compania.ts.
 *
 * Map frame: x east, y north, z up, metres, turned to the church's axis. The
 * long walls in OSM run at 120° / 300°; the front faces the plaza to the
 * east-south-east, so the placement bearing is 300 and the front faces the
 * model's south (y = −44.7). The anchor is the area centroid of the church
 * outline way/159408371 (lng −78.5154722, lat −0.2203084).
 *
 * What it is: the plaza front of the Franciscan complex (church 1550–1605,
 * atrium stair after Bramante's convex-concave Belvedere design). A raised
 * atrium of dark stone runs the whole length of the front, its wall pierced
 * by doors at plaza level, with the great staircase in the middle: a lower
 * flight of convex round steps spreading into the plaza and an upper concave
 * flight cut into the atrium. On the atrium: the church's white Mannerist
 * front, a stone frontispiece of two orders (arched portal between paired
 * columns below, a window and a segmental pediment above, obelisks on the
 * cornice), the white screen with clocks and a merlon cornice between two
 * white bell towers with open arched belfries and pointed glazed-tile caps
 * carrying statues; and the two long white two-storey convent wings under
 * clay-tile roofs, the Capilla de Cantuña's stone portal in the left one.
 * Behind: the three-aisled church under grey roofs, the transept and
 * presbytery with the crossing dome, and two small chapel domes in
 * checkered green-and-ochre glazed tile on white drums.
 *
 * Replaces the church outline way/159408371 and the buildings mapped over
 * it: way/673212786 (nave), way/673869400 (transept and presbytery),
 * way/673212785 (crossing dome), way/673479943 (its lantern), way/673212783
 * and way/673212784 (chapel domes), way/673212790 and way/673212791 (the
 * towers); and the two plaza-front convent wings way/673212787 ("Convento y
 * Museo San Francisco") and way/673212788 (the south range with the Capilla
 * de Cantuña). The deeper cloister ranges (way/673212776, …777, …779, …782)
 * are left to the map: no licensed photo shows them beyond the aerial.
 *
 * Evidence
 * - OSM (measured, turned 300°): church front x −11.7…14.1 at y −44.7,
 *   towers 8.7 × 7.6 and 7.4 × 7.6 m (drawn 8.0 m square, symmetric about
 *   x 1.5); nave block to y 13.4; transept/presbytery y 13.3…42.1; crossing
 *   dome centre (−0.8, 19.7), 12 m across; chapel domes at (9.1, 30.8) and
 *   (−11.7, 30.7), 6.8 m across. Wings: x 14.1…60 (y −44.9…−29.8) and an L
 *   from x −57.7 to −11.7 (y −44.8…1.2). OSM heights (towers 30, nave 17,
 *   dome 20, lantern 24) are used as a check only.
 * - Photo-scaled (estimated) from photo 1 (square on; towers 8 m = 172 px at
 *   the church, 40 px/m at the atrium wall by the people on it): atrium 4.0 m
 *   above the plaza at the stair; above the atrium: stone lower order to
 *   9.4 (cornice and obelisk pedestals to 10.8, obelisks to 14.3), upper
 *   order to 17.0, pediment 19.2; white screen and tower bodies to 21.7
 *   with merlons; belfries 21.7–27.6 with one arched opening a face;
 *   cap stage to 29.2; caps to 33.9; statues and crosses to 36.7 (40.7
 *   above the plaza; OSM 30). Wings' eaves 12.6 above the atrium,
 *   hipped roofs. Stair: six convex steps out to r 7.5 m in front of the
 *   atrium wall, six concave steps in a 10.4 m notch.
 * - Church body behind (estimated, aerial photo 2): see review round 1
 *   below for the heights. Grey roofs over the church as in the aerial (OSM
 *   tags them red), clay tile over the wings.
 * - Terrain: Mapterhorn z12 only. Across the footprint it climbs about 9 m
 *   from the plaza at the stair foot to the back of the presbytery; y = 0 is
 *   the plaza at the stair, the atrium and stair are built (the terrain
 *   shows them only as a smooth rise), and the back of the church sinks into
 *   the slope. elevation 0. The plaza falls along the front, so the real
 *   atrium wall is taller at one end; drawn level (doubt).
 * - Photos (Wikimedia Commons, EVIDENCE):
 *   1 "Iglesia de San Francisco, Quito, Ecuador, 2015-07-22, DD 153.JPG",
 *     Diego Delso, CC BY-SA 4.0 — the front square on.
 *   2 "Monasterio de San Francisco desde arriba - panoramio.jpg", Quito
 *     magnífico, CC BY-SA 3.0 — aerial: atrium, wings, roofs, towers.
 *   3 "Iglesia de San Francisco, Quito 01.jpg", Bernard Gagnon, CC BY-SA 3.0
 *     — the front from the plaza in sun, colours.
 *   4 "Iglesia de San Francisco, Quito 07.jpg", Bernard Gagnon, CC BY-SA 3.0
 *     — chapel domes, checkered tile, white drums.
 *   5 "Iglesia de San Francisco, Quito, Ecuador, 2015-07-22, DD 217-219 HDR.JPG",
 *     Diego Delso, CC BY-SA 4.0 — the front floodlit at night.
 *   6 "Iglesia de San Francisco, Quito 03.jpg", Bernard Gagnon, CC BY-SA 3.0
 *     — a tower cap and belfry.
 * - Look-only: none.
 * - Colours: white-wash #f0ede6; frontispiece, atrium, the church's grey
 *   metal roofs and the tower caps one neutral grey-brown #8a8075, nudged warm so the frontispiece reads as stone beside photo 1 (photos
 *   1 and 3, aerial); clay tile #8e5f4c (aerial); wooden doors and window
 *   frames dark wood #6e4b33 (photo 1); windows dark #4a4643; the crossing
 *   and chapel domes and the Cantuña cap glazed tile #9fa08a, the mean of
 *   the green and ochre checker (photo 4). The bell caps read brown-grey in
 *   photo 1, so they take the stone colour.
 * - Review round 2 (lead): doors and frames in their own dark wood colour;
 *   to stay at six materials the church roofs share the stone's grey-brown.
 *   Bell caps narrowed 15 % and a small white lantern stage with a cupola
 *   added above each (photo 1).
 * - Review round 1 (lead): belfries 5.9 m with 2.1 × 4.6 m openings; corner
 *   pinnacles on the tower balustrades; tall bell caps in dark tile with
 *   white ribs and base ring (photo 1: 4.4 m); brown doors; the church body
 *   behind lowered (aisles 15, nave 18.5, ridge 21.5, transept 16, crossing
 *   dome to 23.7, chapel domes to 19.1 above the plaza) so that, as in
 *   photo 1, nothing shows over the front's merlon band from the plaza.
 *   These rear heights are therefore estimates fitted to the plaza view,
 *   not to OSM (nave 17, dome 20 above their local ground).
 * - Doubts: the church's flanks and back are hidden by the convent and
 *   drawn plain; the aisle and transept heights and the roof shapes behind
 *   the front rest on one low-resolution aerial.
 * - Night: the whole front, wings, towers and atrium, is floodlit (photo
 *   5); the church behind is not.
 */
import { Part, type V3 } from './mesh'
import { finish, windowVariant } from './palette'
import { lathe } from './dc-nmaahc'
import { hip } from './dc-white-house'
import { cbox, earcut, ccw, gable, grow, ngon, ngonPrism, qf, rect, roundArch, spire, tf, type Side } from './dc-national-cathedral'
import { domeProfile, domeRibs, ironCross, merlonRow, pierced, proud, ringWindows, saveModel, screen, wallPt, type AZ, type Op } from './quito-la-compania'

/** Walls and a flat top over a polygon (for blocks that get a roof on top). */
function polyBlock(p: Part, poly: AZ[], z0: number, z1: number, top: Part | false) {
  const ring = ccw(poly) as AZ[]
  for (let i = 0; i < ring.length; i++) {
    const A = ring[i], B = ring[(i + 1) % ring.length]
    qf(p, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], [B[1] - A[1], -(B[0] - A[0]), 0])
  }
  if (top) for (const [i, j, k] of earcut(ring)) tf(top, [...ring[i], z1] as V3, [...ring[j], z1] as V3, [...ring[k], z1] as V3, [0, 0, 1])
}

/** A step: a top polygon at z1 with walls down to z0 (no bottom). */
function step(p: Part, poly: AZ[], z0: number, z1: number) {
  polyBlock(p, poly, z0, z1, p)
}

function build() {
  const white = new Part(), stone = new Part(), clay = new Part(), tile = new Part(), wood = new Part(), win = new Part()
  // Six materials: the church's grey metal roofs and the tower caps share the
  // neutral grey-brown of the stone, so the doors keep their own dark wood.
  const roofP = stone
  const A = 4.0 // the atrium above the plaza
  const FY = -44.7, XC = 1.5
  const xs = (d: number) => XC + d
  const TW = [xs(-8.9), xs(8.9)] // tower centres
  const TH = 4.0 // tower half-width

  // ===================================================================
  // The atrium: a dark stone platform the length of the front.
  const AY0 = -56.0, AX0 = -57.7, AX1 = 60.0
  const NOTCH = 5.2, NY = -50.5 // the upper flight's notch
  cbox(stone, rect(AX0, xs(-NOTCH), AY0, FY), 0, A, { top: stone })
  cbox(stone, rect(xs(NOTCH), AX1, AY0, FY), 0, A, { top: stone })
  cbox(stone, rect(xs(-NOTCH), xs(NOTCH), NY, FY), 0, A, { top: stone })
  // Parapet along the front with ball posts, and cheek walls by the stair.
  for (const [a0, a1] of [[AX0, xs(-NOTCH)], [xs(NOTCH), AX1]]) {
    cbox(stone, rect(a0, a1, AY0, AY0 + 0.6), A, A + 1.0, { b: 0.15 })
    const n = Math.round((a1 - a0) / 9)
    for (let k = 0; k <= n; k++) {
      const x = a0 + ((a1 - a0) * k) / n
      cbox(stone, rect(x - 0.4, x + 0.4, AY0, AY0 + 0.6), A + 1.0, A + 1.6, { b: 0.1 })
      lathe(stone, x, AY0 + 0.3, [[0.3, A + 1.6], [0.36, A + 1.9], [0.2, A + 2.2], [0, A + 2.25]], 6, false)
    }
  }
  for (const s of [-1, 1]) {
    const x0 = xs(s * NOTCH), x1 = xs(s * (NOTCH + 0.6))
    cbox(stone, rect(Math.min(x0, x1), Math.max(x0, x1), AY0, NY), 0, A + 1.0, { b: 0.15 })
    // Tall obelisk posts and gates at the head of the stair.
    const px = xs(s * (NOTCH + 0.3))
    cbox(stone, rect(px - 0.5, px + 0.5, NY - 0.8, NY + 0.2), A, A + 1.6, { b: 0.1 })
    ngonPrism(stone, px, NY - 0.3, 0.42, 4, A + 1.6, A + 3.4, { top: false, r1: 0.25 })
    spire(stone, ngon(px, NY - 0.3, 0.25, 4, A + 3.4), [px, NY - 0.3, A + 3.8])
  }
  // Doors in the atrium wall at plaza level, with small pediments.
  for (const x of [-48, -36, -24, -15, 18, 27, 39, 51]) {
    roundArch(wood, 's', AY0, x - 0.9, x + 0.9, 0, 3.4, 0.05, 4)
    proud(stone, 's', AY0, x - 1.4, x + 1.4, 3.5, 3.8, 0.3, true)
  }

  // ---- The stair: six convex steps into the plaza, six concave ones up
  // through the notch.
  const H = A / 12
  for (let k = 0; k < 6; k++) {
    const r = 7.5 - k * 0.65, poly: AZ[] = [[xs(-r), AY0]]
    for (let j = 1; j < 10; j++) { const t = Math.PI + (Math.PI * j) / 10; poly.push([xs(r * Math.cos(t)), AY0 + r * Math.sin(t) * 0.75]) }
    poly.push([xs(r), AY0])
    step(stone, poly, 0, (k + 1) * H)
  }
  for (let k = 0; k < 6; k++) {
    const y0 = AY0 + k * 0.95, poly: AZ[] = []
    for (let j = 0; j <= 8; j++) { const u = -1 + (2 * j) / 8; poly.push([xs(u * NOTCH), y0 + 0.9 * (1 - u * u)]) }
    poly.push([xs(NOTCH), NY], [xs(-NOTCH), NY])
    step(stone, poly.reverse(), 0, (k + 7) * H)
  }

  // ===================================================================
  // The convent wings: white two-storey ranges under hipped clay roofs.
  const WE = A + 12.6
  const wingN: AZ[] = [[14.1, -44.7], [58.1, -44.9], [59.9, -44.9], [60.2, -31.3], [54.1, -31.1], [14.1, -29.8]]
  const wingS: AZ[] = [[-55.9, 0.5], [-40.1, 1.2], [-41.1, -21.5], [-11.8, -22.7], [-11.7, -44.8], [-57.7, -43.1]]
  polyBlock(white, wingN, 0, WE, false)
  polyBlock(white, wingS, 0, WE, false)
  hip(clay, grow(rect(14.1, 60.0, -44.9, -30.0), 0.5), WE, WE + 2.0, 7.4)
  hip(clay, grow(rect(-57.6, -11.7, -44.6, -22.3), 0.5), WE, WE + 2.2, 11.0)
  hip(clay, grow(rect(-56.0, -40.6, -22.3, 1.0), 0.5), WE, WE + 2.0, 7.6)
  // Eave cornices and upper windows on the plaza fronts.
  cbox(white, rect(14.1, 60.1, -45.3, -44.5), WE - 0.7, WE, { bottom: true, top: false })
  cbox(white, rect(-57.7, -11.7, -45.3, -44.5), WE - 0.7, WE, { bottom: true, top: false })
  const framedWin = (x: number, y: number) => {
    // A dark window in a brown wooden frame.
    qf(wood, [x - 0.95, y, A + 7.45], [x + 0.95, y, A + 7.45], [x + 0.95, y, A + 9.75], [x - 0.95, y, A + 9.75], [0, -1, 0])
    qf(win, [x - 0.75, y - 0.03, A + 7.65], [x + 0.75, y - 0.03, A + 7.65], [x + 0.75, y - 0.03, A + 9.55], [x - 0.75, y - 0.03, A + 9.55], [0, -1, 0])
  }
  for (let x = 19; x < 58; x += 6.2) framedWin(x, -44.96)
  for (let x = -17; x > -56; x -= 6.2) {
    const y = -44.8 + ((x + 11.7) / -46) * 1.7 - 0.08
    framedWin(x, y + 0.02)
  }
  // The small bell tower at the south wing's far corner (photos 2 and 3).
  {
    const tx = -54.2, ty = -41.0, h = 1.9, z0 = WE + 0.4, z1 = WE + 4.6
    const r = rect(tx - h, tx + h, ty - h, ty + h)
    cbox(white, r, WE - 1, z0, { top: false })
    const op = (c: number): Op[] => [{ a0: c - 0.6, a1: c + 0.6, zb: z0 + 0.6, zt: z0 + 3.2, arch: true, seg: 4 }]
    pierced(white, win, 's', r.y0, r.x0, r.x1, z0, z1, op(tx), 0.5)
    pierced(white, win, 'n', r.y1, r.x0, r.x1, z0, z1, op(tx), 0.5)
    pierced(white, win, 'w', r.x0, r.y0, r.y1, z0, z1, op(ty), 0.5)
    pierced(white, win, 'e', r.x1, r.y0, r.y1, z0, z1, op(ty), 0.5)
    cbox(white, grow(r, 0.3), z1, z1 + 0.4, { b: 0.1, bottom: true })
    lathe(tile, tx, ty, [[1.6, z1 + 0.4], [1.45, z1 + 1.2], [0.8, z1 + 2.0], [0.2, z1 + 2.5], [0, z1 + 2.6]], 8, false)
  }
  // The Capilla de Cantuña's stone portal on the south wing.
  {
    const c = -23.4, y = -44.4
    proud(stone, 's', y, c - 3.6, c + 3.6, A, A + 6.4, 0.5)
    roundArch(wood, 's', y - 0.5, c - 1.3, c + 1.3, A, A + 4.6, 0.05, 6)
    const ped: AZ[] = [[c - 3.9, A + 6.4], [c + 3.9, A + 6.4], [c, A + 8.0]]
    screen(stone, 's', y - 0.6, ped, 0.6)
  }

  // ===================================================================
  // The church behind the front: aisles, nave, transept, domes.
  const NX0 = xs(-6.5), NX1 = xs(6.5)
  // Kept low enough that nothing but the lantern tip shows over the front's
  // merlon band from the plaza (photo 1).
  cbox(white, rect(-11.8, NX0, -37.1, 13.4), 0, 15, { top: false })
  cbox(white, rect(NX1, 14.1, -37.1, 13.4), 0, 15, { top: false })
  qf(roofP, [-11.8, -37.1, 15], [-11.8, 13.4, 15], [NX0, 13.4, 17.0], [NX0, -37.1, 17.0], [-2.0, 0, 5.3])
  qf(roofP, [14.1, -37.1, 15], [14.1, 13.4, 15], [NX1, 13.4, 17.0], [NX1, -37.1, 17.0], [2.0, 0, 7.6])
  cbox(white, rect(NX0, NX1, -37.1, 13.4), 0, 18.5, { top: false })
  gable(roofP, white, rect(NX0 - 0.3, NX1 + 0.3, -37.1, 13.4), 18.5, 21.5, true, [false, false])
  const TRANS: AZ[] = [[-16.5, 13.4], [13.9, 13.3], [13.7, 33.6], [13.9, 41.3], [-15.2, 42.1]]
  polyBlock(white, TRANS, 0, 16, false) // chapel domes sit on it at 15–16.4 (sunk into the roof)
  hip(roofP, rect(-16.6, 14.0, 13.3, 42.1), 16, 17.6, 4.5)
  // Crossing dome: white octagonal drum, tiled dome, lantern.
  {
    const cx = -0.8, cy = 19.7
    ngonPrism(white, cx, cy, 6.0, 8, 16, 20.4, { top: false })
    ringWindows(win, cx, cy, 6.0 * Math.cos(Math.PI / 8), 8, 18.2, 20.0, 0.6, 0, 2)
    lathe(white, cx, cy, [[6.3, 20.4], [6.3, 20.8], [5.6, 20.8]], 8, false)
    const prof = domeProfile(5.6, 20.8, 2.9, 1.3, 4)
    lathe(tile, cx, cy, prof, 12, false)
    const lz = prof[prof.length - 1][1]
    ngonPrism(white, cx, cy, 1.3, 8, lz - 0.1, lz + 1.6, { top: false })
    spire(tile, ngon(cx, cy, 1.5, 8, lz + 1.6), [cx, cy, lz + 2.6])
  }
  // Two chapel domes: checkered tile on white drums with arched openings.
  for (const [cx, cy] of [[9.1, 30.8], [-11.7, 30.7]]) {
    ngonPrism(white, cx, cy, 3.4, 8, 15, 16.4, { top: false })
    ringWindows(win, cx, cy, 3.4 * Math.cos(Math.PI / 8), 8, 15.2, 16.1, 0.45, 0, 2)
    lathe(white, cx, cy, [[3.65, 16.4], [3.65, 16.7], [3.3, 16.7]], 8, false)
    lathe(tile, cx, cy, domeProfile(3.3, 16.7, 1.8, 0.4, 3), 12, false)
    lathe(tile, cx, cy, [[0.4, 18.3], [0.55, 18.7], [0.3, 19.0], [0, 19.1]], 6, false)
  }

  // ===================================================================
  // The church front on the atrium.
  {
    const S: Side = 's'
    // The white body: screen between the towers and the tower shafts, with
    // clocks, to the merlon cornice at A + 21.7.
    const BZ = A + 21.7
    cbox(white, rect(TW[0] - TH, TW[1] + TH, FY + 1.3, -37.1), A, BZ, { top: white })
    cbox(white, rect(TW[0] - TH - 0.35, TW[1] + TH + 0.35, FY - 0.35, -36.8), BZ - 1.0, BZ, { b: 0.15, bottom: true, top: white })
    merlonRow(white, [TW[0] - TH - 0.3, FY - 0.3], [TW[1] + TH + 0.3, FY - 0.3], BZ, 1.25, 0.6, 0.4, 0.7, 0.2)
    for (const tx of TW) {
      // Clock faces.
      const n = 12, r = 0.75, cz = A + 18.0
      for (let k = 0; k < n; k++) {
        const t0 = (2 * Math.PI * k) / n, t1 = (2 * Math.PI * (k + 1)) / n
        tf(stone, [tx, FY - 0.05, cz], [tx + r * Math.cos(t0), FY - 0.05, cz + r * Math.sin(t0)], [tx + r * Math.cos(t1), FY - 0.05, cz + r * Math.sin(t1)], [0, -1, 0])
      }
      // Small pediments over the clocks.
      screen(white, S, FY - 0.3, [[tx - 2.6, A + 19.3], [tx + 2.6, A + 19.3], [tx, A + 20.4]], 0.3)
    }

    // Lower order of the stone frontispiece: full width, arched portal
    // between paired columns, two grilled windows.
    const L0 = A, L1 = A + 9.4
    const ops: Op[] = [{ a0: xs(-1.7), a1: xs(1.7), zb: A, zt: A + 6.3, arch: true, seg: 6 }]
    for (const s of [-1, 1]) ops.push({ a0: xs(s * 8.9) - 0.75, a1: xs(s * 8.9) + 0.75, zb: A + 3.4, zt: A + 5.0 })
    pierced(stone, wood, S, FY, xs(-13.2), xs(13.2), L0, L1, ops, 1.1, 6)
    // The portal's back is the brown wooden door; the two windows are dark.
    for (const s of [-1, 1]) qf(win, [xs(s * 8.9) - 0.75, FY + 1.07, A + 3.4], [xs(s * 8.9) + 0.75, FY + 1.07, A + 3.4], [xs(s * 8.9) + 0.75, FY + 1.07, A + 5.0], [xs(s * 8.9) - 0.75, FY + 1.07, A + 5.0], [0, -1, 0])
    for (const s of [-1, 1]) qf(stone, [xs(s * 13.2), FY, L0], [xs(s * 13.2), FY + 1.3, L0], [xs(s * 13.2), FY + 1.3, L1], [xs(s * 13.2), FY, L1], [s, 0, 0])
    cbox(stone, rect(xs(-13.5), xs(13.5), FY - 0.4, FY + 1.3), L1, L1 + 0.8, { b: 0.2, bottom: true })
    cbox(stone, rect(xs(-13.2), xs(13.2), FY - 0.1, FY + 1.3), L1 + 0.8, A + 10.8, { b: 0.1 })
    for (const s of [-1, 1]) {
      for (const d of [2.6, 3.8]) {
        lathe(stone, xs(s * d), FY - 0.3, [[0.5, A], [0.5, A + 0.6], [0.36, A + 0.6], [0.32, L1 - 0.4], [0.5, L1 - 0.4], [0.5, L1]], 8, false)
      }
      for (const d of [6.4, 11.4]) proud(stone, S, FY, xs(s * d) - 0.45, xs(s * d) + 0.45, A, L1, 0.3)
      // Obelisks on the cornice.
      for (const d of [5.6, 10.0]) {
        const x = xs(s * d)
        cbox(stone, rect(x - 0.5, x + 0.5, FY - 0.1, FY + 0.9), A + 10.8, A + 11.6, { b: 0.1 })
        ngonPrism(stone, x, FY + 0.4, 0.42, 4, A + 11.6, A + 13.6, { top: false, r1: 0.18 })
        spire(stone, ngon(x, FY + 0.4, 0.18, 4, A + 13.6), [x, FY + 0.4, A + 14.3])
      }
    }
    // Upper order: window, paired columns, segmental pediment.
    const U0 = A + 10.8, U1 = A + 17.0
    pierced(stone, win, S, FY + 0.1, xs(-5.9), xs(5.9), U0, U1, [{ a0: xs(-0.75), a1: xs(0.75), zb: A + 11.8, zt: A + 13.6 }], 0.9)
    for (const s of [-1, 1]) {
      qf(stone, [xs(s * 5.9), FY + 0.1, U0], [xs(s * 5.9), FY + 1.3, U0], [xs(s * 5.9), FY + 1.3, U1], [xs(s * 5.9), FY + 0.1, U1], [s, 0, 0])
      for (const d of [1.9, 3.0]) lathe(stone, xs(s * d), FY - 0.15, [[0.3, U0], [0.3, U1 - 0.4], [0.42, U1 - 0.4], [0.42, U1]], 8, false)
      // Scroll wings at the upper order's foot.
      screen(stone, S, FY + 0.2, [[xs(s * 5.9), U0], [xs(s * 8.0), U0], [xs(s * 5.9), U0 + 2.6]], 0.4)
    }
    proud(stone, S, FY + 0.1, xs(-1.0), xs(1.0), A + 14.2, A + 16.2, 0.3, true)
    cbox(stone, rect(xs(-6.2), xs(6.2), FY - 0.3, FY + 1.3), U1, U1 + 0.6, { b: 0.2, bottom: true })
    const ped: AZ[] = []
    for (let k = 0; k <= 8; k++) { const t = Math.PI * (k / 8); ped.push([xs(-6.0 * Math.cos(t)), U1 + 0.6 + 1.6 * Math.sin(t)]) }
    screen(stone, S, FY - 0.1, ped, 0.7)

    // ---- The towers: open belfries, cornice, cap stage, tile cap, statue.
    for (const tx of TW) {
      const cy = FY + TH, z0 = BZ, z1 = A + 27.6
      const r0 = rect(tx - TH, tx + TH, cy - TH, cy + TH)
      cbox(white, r0, A + 10.8, BZ, { top: false }) // below, the stone frontispiece and the white body stand in front
      const r = grow(r0, -0.5) // the belfry stands back behind the merlon band
      const op = (c: number): Op[] => [{ a0: c - 1.05, a1: c + 1.05, zb: z0 + 0.5, zt: z0 + 5.1, arch: true, seg: 4 }]
      pierced(white, win, 's', r.y0, r.x0, r.x1, z0, z1, op(tx), 0.8)
      pierced(white, win, 'n', r.y1, r.x0, r.x1, z0, z1, op(tx), 0.8)
      pierced(white, win, 'w', r.x0, r.y0, r.y1, z0, z1, op(cy), 0.8)
      pierced(white, win, 'e', r.x1, r.y0, r.y1, z0, z1, op(cy), 0.8)
      // Corner pilasters and the cornice.
      for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]]) cbox(white, rect(x - 0.35, x + 0.35, y - 0.35, y + 0.35), z0, z1, { top: false })
      cbox(white, grow(r, 0.55), z1, z1 + 0.6, { b: 0.2, bottom: true, top: white })
      // Corner pinnacles and mid-side balls on the cornice balustrade.
      for (const [x, y] of [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]]) {
        cbox(white, rect(x - 0.35, x + 0.35, y - 0.35, y + 0.35), z1 + 0.6, z1 + 1.2, { b: 0.08 })
        ngonPrism(stone, x, y, 0.28, 4, z1 + 1.2, z1 + 2.3, { top: false, r1: 0.12 })
        spire(stone, ngon(x, y, 0.12, 4, z1 + 2.3), [x, y, z1 + 2.6])
      }
      for (const [x, y] of [[tx, r.y0], [tx, r.y1], [r.x0, cy], [r.x1, cy]]) lathe(stone, x, y, [[0.25, z1 + 0.6], [0.32, z1 + 0.9], [0.22, z1 + 1.2], [0, z1 + 1.25]], 6, false)
      // Cap stage, then the tall bell-shaped cap in dark tile with white ribs
      // and a white base ring, and the statue.
      const zc = z1 + 0.6, zt = zc + 1.0
      ngonPrism(white, tx, cy, 2.15, 8, zc, zt, { top: false })
      lathe(white, tx, cy, [[2.35, zt], [2.35, zt + 0.3], [2.1, zt + 0.3]], 8, false)
      const cap: [number, number][] = [[2.1, zt + 0.3], [2.15, zt + 1.0], [1.85, zt + 2.0], [1.2, zt + 3.0], [0.6, zt + 3.7]]
      lathe(roofP, tx, cy, cap, 8, false)
      domeRibs(white, tx, cy, [cap[0], cap[2], cap[4]], 8, 0.12, 0.12)
      // The small white lantern stage over the cap, a little tile cupola.
      const zl = zt + 3.7
      ngonPrism(white, tx, cy, 0.6, 8, zl - 0.05, zl + 0.9, { top: false })
      lathe(white, tx, cy, [[0.75, zl + 0.9], [0.75, zl + 1.05], [0.6, zl + 1.05]], 8, false)
      lathe(roofP, tx, cy, [[0.6, zl + 1.05], [0.45, zl + 1.4], [0.2, zl + 1.6], [0, zl + 1.65]], 8, false)
      const zs = zl + 1.55
      ngonPrism(stone, tx, cy, 0.38, 6, zs, zs + 1.4, { top: false, r1: 0.26 })
      lathe(stone, tx, cy, [[0.3, zs + 1.4], [0.2, zs + 1.8], [0, zs + 2.0]], 6, false)
      ironCross(stone, tx, cy, zs + 1.9, 0.9, 0.55, 0.12)
    }
  }

  // Night: the plaza front is floodlit; the church behind is not.
  const front = (p: V3, n: V3) => (p[1] < -36 ? 1 : 0.15) * (n[2] > 0.8 ? 0.35 : 1)
  return [
    { part: white, material: { ...finish('whitewash', 0xf0ede6), floodlight: front } },
    { part: stone, material: { ...finish('quito-stone', 0x8a8075), floodlight: front } },
    { part: clay, material: { ...finish('clay-tile', 0x8e5f4c, 0.9), floodlight: front } },
    { part: tile, material: { ...finish('glazed-tile-checker', 0x9fa08a, 0.45), floodlight: front } },
    { part: wood, material: { ...finish('dark-wood', 0x6e4b33, 0.7), floodlight: front } },
    { part: win, material: windowVariant(2, 0x4a4643) },
  ]
}

if (import.meta.main) {
  await saveModel('quito-san-francisco', 'Church and Monastery of San Francisco, Quito', build())
}
