/**
 * Cathedral Basilica of Saints Peter and Paul, Philadelphia — procedural,
 * CC0-1.0, no textures.  bun generators/phl-cathedral-basilica.ts
 *
 * What it is: the brownstone Italian Renaissance cathedral on Logan Square
 * (Napoleon LeBrun and John Notman, 1846-64). A Palladian temple front to
 * the west: four giant fluted Corinthian columns standing before the nave's
 * end wall, a deep entablature and a pediment; low pavilions either side,
 * each with a rounded outer corner, a ring of engaged columns and a
 * rounded attic (the "two small towers" seen from the square); the nave
 * with clerestory and copper-roofed aisles; a short transept with a hipped
 * slate roof; over the crossing a dark lead-grey drum and the big green
 * copper dome with a ring of dormer windows, a bell-shaped lantern and a
 * gold ball and cross; a round stair turret on the south flank; a half-round
 * apse to the east; the lower clergy house (north) and offices (south)
 * that share the OSM outline.
 *
 * Map frame: x along bearing 100 (east, the nave's axis; the facade faces
 * -x, west, onto 18th Street and Logan Square), y along bearing 10 (north),
 * z up, metres; placed at bearing 10.0, the walls (OSM edges 9.5-10.5°).
 * Anchor: the area centroid of the outline way/252221811, -75.168507
 * 39.957427. z = 0 is the ground along the west front and the south lawn
 * (lidar 1.4 m over the box's ground_min).
 *
 * Covers and replaces: way/252221811 (outline) and its building:parts
 * way/333931827 (dome), way/346450366 (south block), way/349876630
 * (transept), way/349876631 (portico), way/349876632 (nave).
 *
 * Evidence
 * - OSM (2026-11), in this frame: portico x -41.7..-35.3, y -10..11.9;
 *   nave x -41.6..25, y -8.1..9.7; transept x -5.4..12.7, y -19.8..21.9;
 *   dome r 10.4 about (3.9, 1.1); apse semicircle to x 35.9; front
 *   pavilions' quarter-round corners r ~5.5 about (-33, +-15.6); south
 *   turret r 4.5 about (-24.4, -19.8); clergy house x -24..25, y 20..35.7;
 *   south block x 1.8..29.2, y -41.7..-27.8.
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 1 m grid read in this frame with tools/lidar_frame.py
 *   (measured, above z = 0): nave cornice 26.4, ridge 30.5; pediment apex
 *   ~31; aisles' lean-to roofs 16.1 -> 14.9; front pavilions' attic 17.4;
 *   turret 15.5; transept eaves 26.4, ridge 30.5; drum and dome, read
 *   radially: drum cornice r 11.2 at ~34.8, dome surface 41.2 at r 10,
 *   45.1 at r 8, 47.3 at r 6, 49.4 at r 4, lantern from r 2.5 at ~51,
 *   top of the cross 63.1; apse eaves 26.4, its cupola 32.5; clergy house
 *   eaves 11.6, ridge 14.1 (y 28), its east end 8.4; south block 15.7;
 *   annexes 5.3.
 * - Photos (Wikimedia Commons):
 *   "2013 Cathedral Basilica of Saints Peter and Paul front facade.jpg",
 *     "...from side.jpg", "...from across the Benjamin Franklin
 *     Parkway.jpg" (Beyond My Ken, CC BY-SA 4.0): the front square on,
 *     scaled to the lidar (0.0356 m a pixel): column centres +-3.3 and
 *     +-8.8, 2.1 m across, pedestals to 2.0, capitals' tops at 21.4,
 *     entablature 21.4-26.1, the arched window over the door (13.5-18.5),
 *     three bronze doors (to 8.0); the pavilions' order to 12.1, its
 *     entablature to 13.6, the rounded attic; the side: the rough grey-pink
 *     ashlar of the aisles, the turret, the clerestory's arched windows,
 *     the transept's arched window;
 *   "Cathedral Basilica of Saints Peter and Paul, Philadelphia, PA.JPG"
 *     (Ngilmour3, CC BY-SA 3.0): the front and both pavilions;
 *   "Cathedral Basilica of Saints Peter and Paul dome - Philadelphia
 *     01.jpg" (Farragutful, CC BY-SA 4.0): the drum (dark lead-grey with
 *     glazed panels, two bands), the dome's dormers and ribs, the lantern,
 *     the gilt ball and cross.
 * - USGS NAIP (public domain): the roofs: slate-grey nave and transept
 *   hips, green copper on the aisles, pavilions and turret, the dome.
 * - Estimated: portico depth (columns 2.3 m before the wall), the
 *   pavilions' columns, window sizes, the dormers' count (12) and size,
 *   the lantern's profile (from Farragutful's photo against the lidar).
 * - Simplified: capitals are a flared bell; the fluting, niches and
 *   statues, the frieze's ornament and the pavilions' small pediments are
 *   left out; the ribs of the dome are not drawn.
 *
 * Doubts
 * - The north (clergy house) side and the east end are seen in no licensed
 *   photo; drawn plain from the lidar.
 * - The lidar's dome centre sits 0.5 m off OSM's; OSM's is used.
 *
 * Night: the west front is floodlit (`_FLOODLIGHT` on the stone, brightest
 * on the front), as is the dome; the windows are dark recesses on a
 * non-glowing material.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { cbox, rect, cylinder, panel, qf, tf, hip } from './dc-white-house'
import { saveModel, lathe, pslab, pwalls, pcap, circle, type XY } from './dc-nga-west'

const stone = new Part(), ashlar = new Part(), shade = new Part(), slate = new Part(), copper = new Part(), gold = new Part()

// ---- Heights (lidar, above the west front's ground).
const CORN = 26.4, RIDGE = 30.5 // nave and transept
const PAV = 17.4, PAV_ORDER = 12.1, PAV_ENT = 13.6 // front pavilions
const AISLE_IN = 16.1, AISLE_OUT = 14.9

// ---------------------------------------------------------------------------
// Nave: x -35.3..25, y -10..10, gable along x.
const NY = 10
cbox(ashlar, rect(-35.3, 25, -NY, NY), 0, CORN - 1.0, { top: false })
cbox(stone, rect(-35.6, 25, -NY - 0.4, NY + 0.4), CORN - 1.0, CORN, { b: 0.3, top: false, bottom: true })
for (const s of [-1, 1]) qf(slate, [-41.7, s * (NY + 0.4), CORN], [25, s * (NY + 0.4), CORN], [25, 0, RIDGE], [-41.7, 0, RIDGE], [0, s * (RIDGE - CORN), NY])
// clerestory: arched windows over the aisles, between the pavilions and the transept and east of it
for (const s of [-1, 1]) {
  for (const x of [-27, -20, -13, 16.5, 21.5]) panel(shade, s > 0 ? 'n' : 's', s * NY, x - 1.3, x + 1.3, AISLE_IN + 1.2, AISLE_IN + 5.6, 0.05)
}

// ---------------------------------------------------------------------------
// The temple front: x -41.7..-35.3, y -11..11.
{
  const X0 = -41.7, WALL = -38.0, W = 11.0, BASE = 1.1, CAPTOP = 21.4
  // podium and steps
  cbox(stone, rect(X0 - 0.3, -35.3, -W - 0.3, W + 0.3), 0, BASE, { b: 0.1 })
  for (let k = 0; k < 4; k++) {
    const x = X0 - 0.3 - 0.45 * (4 - k)
    cbox(stone, rect(x, X0 - 0.3, -8.0, 8.0), 0, (BASE * (k + 1)) / 5, { top: true })
  }
  // end wall behind the columns, in the porch's shade, and antae
  cbox(stone, rect(WALL, -35.3, -W, W), BASE, CORN - 1.0, { top: false })
  panel(ashlar, 'w', WALL, -W + 1.6, W - 1.6, BASE, CAPTOP, 0.03) // the wall in the porch's shade, a greyer tone
  for (const s of [-1, 1]) cbox(stone, rect(X0 + 0.5, WALL, s > 0 ? W - 1.6 : -W, s > 0 ? W : -W + 1.6), BASE, CAPTOP, { top: false })
  // doors and the arched window
  for (const [y, w, h] of [[0, 2.6, 8.0], [-6.0, 2.2, 6.8], [6.0, 2.2, 6.8]] as [number, number, number][]) panel(stone, 'w', WALL - 0.04, y - w / 2 - 0.3, y + w / 2 + 0.3, BASE, BASE + h + 0.3, 0.04)
  for (const [y, w, h] of [[0, 2.6, 8.0], [-6.0, 2.2, 6.8], [6.0, 2.2, 6.8]] as [number, number, number][]) panel(slate, 'w', WALL - 0.04, y - w / 2, y + w / 2, BASE, BASE + h, 0.09)
  panel(slate, 'w', WALL, -1.2, 1.2, 13.5, 17.3, 0.08)
  // the round head of the window
  for (let k = 0; k < 8; k++) {
    const a0 = (Math.PI * k) / 8, a1 = (Math.PI * (k + 1)) / 8
    tf(slate, [WALL - 0.08, 0, 17.3], [WALL - 0.08, 1.2 * Math.cos(a0), 17.3 + 1.2 * Math.sin(a0)], [WALL - 0.08, 1.2 * Math.cos(a1), 17.3 + 1.2 * Math.sin(a1)], [-1, 0, 0])
  }
  // four giant columns on pedestals
  for (const y of [-8.8, -3.3, 3.3, 8.8]) {
    const x = X0 + 1.4, r = 1.05
    cbox(stone, rect(x - 1.4, x + 1.4, y - 1.4, y + 1.4), BASE, 2.6, { b: 0.15 })
    cylinder(stone, x, y, r, 2.6, CAPTOP - 2.2, 12, r * 0.88)
    cylinder(stone, x, y, r * 0.88, CAPTOP - 2.2, CAPTOP - 0.45, 12, r * 1.3)
    cbox(stone, rect(x - 1.45, x + 1.45, y - 1.45, y + 1.45), CAPTOP - 0.45, CAPTOP, { bottom: true, top: false })
  }
  // porch ceiling, entablature, cornice
  qf(shade, [X0 + 0.2, -W, CAPTOP - 0.02], [WALL, -W, CAPTOP - 0.02], [WALL, W, CAPTOP - 0.02], [X0 + 0.2, W, CAPTOP - 0.02], [0, 0, -1])
  cbox(stone, rect(X0, WALL, -W, W), CAPTOP, CORN - 0.8, { bottom: true, top: false })
  cbox(stone, rect(X0 - 0.5, WALL, -W - 0.5, W + 0.5), CORN - 0.8, CORN, { b: 0.35, bottom: true, top: false })
  // the pediment: a raking frame round a recessed tympanum
  const A = RIDGE + 0.4, Wp = W + 0.5, k = (A - CORN) / Wp
  for (const s of [-1, 1]) qf(slate, [X0 - 0.5, s * Wp, CORN], [WALL, s * Wp, CORN], [WALL, 0, A], [X0 - 0.5, 0, A], [0, s * (A - CORN), Wp])
  const Wi = Wp - 1.4, Ai = A - 0.9, base = CORN + 0.15
  qf(stone, [X0 - 0.5, -Wp, CORN], [X0 - 0.5, Wp, CORN], [X0 - 0.5, Wi, base], [X0 - 0.5, -Wi, base], [-1, 0, 0])
  for (const s of [-1, 1]) qf(stone, [X0 - 0.5, s * Wp, CORN], [X0 - 0.5, s * Wi, base], [X0 - 0.5, 0, Ai], [X0 - 0.5, 0, A], [-1, 0, 0])
  qf(stone, [X0 - 0.5, -Wi, base], [X0 - 0.5, Wi, base], [X0, Wi, base], [X0, -Wi, base], [0, 0, 1])
  for (const s of [-1, 1]) qf(stone, [X0 - 0.5, s * Wi, base], [X0 - 0.5, 0, Ai], [X0, 0, Ai], [X0, s * Wi, base], [0, -s * k, 1])
  tf(stone, [X0, -Wi, base], [X0, Wi, base], [X0, 0, Ai], [-1, 0, 0])
  void k
  // the gilt cross on the apex
  cbox(gold, rect(X0 - 0.2, X0 + 0.4, -0.15, 0.15), A, A + 2.4)
  cbox(gold, rect(X0 - 0.2, X0 + 0.4, -0.8, 0.8), A + 1.4, A + 1.8)
}

// ---------------------------------------------------------------------------
// The front pavilions, each with a quarter-round outer corner, a ring of
// engaged columns, an entablature and a rounded attic. North: y 11..20.5,
// x -38.5..-24; south: y -11..-20.9, x -38.5..-31 (the aisle continues).
function pavilion(s: number) {
  const x0 = -38.5, x1 = s > 0 ? -24 : -29.5, yin = s * 11, yout = s * 20.7, rc = 5.5
  const cxr = -33.0, cyr = s * (20.7 - rc)
  const ring: XY[] = [[x1, yin], [x1, yout]]
  for (let k = 0; k <= 6; k++) {
    const a = s > 0 ? Math.PI / 2 + (k * Math.PI) / 12 : -Math.PI / 2 - (k * Math.PI) / 12
    ring.push([cxr + rc * Math.cos(a), cyr + rc * Math.sin(a)])
  }
  ring.push([x0, yin])
  const grownRing = (d: number): XY[] => ring.map(([x, y]) => {
    // push the outer faces out by d (front, side and the round corner)
    const onArc = x < cxr - 1e-6 && Math.abs(y) > Math.abs(cyr) + 1e-6
    if (onArc) { const dx = x - cxr, dy = y - cyr, l = Math.hypot(dx, dy); return [x + (dx / l) * d, y + (dy / l) * d] }
    return [Math.abs(x - x0) < 1e-6 ? x - d : x, Math.abs(y - yout) < 1e-6 ? y + s * d : y]
  })
  pslab(stone, ring, 0, PAV_ORDER, 0, false)
  pslab(stone, grownRing(0.35), PAV_ORDER, PAV_ENT, 0.25, false)
  pcap(stone, grownRing(0.35), PAV_ORDER, false)
  pslab(stone, ring, PAV_ENT, PAV - 0.6, 0, false)
  pslab(stone, grownRing(0.15), PAV - 0.6, PAV, 0.45, copper)
  // engaged columns round the corner and along the front and side
  const cols: XY[] = []
  for (let k = 0; k <= 3; k++) {
    const a = s > 0 ? Math.PI / 2 + (k * Math.PI) / 6 : -Math.PI / 2 - (k * Math.PI) / 6
    cols.push([cxr + (rc + 0.25) * Math.cos(a), cyr + (rc + 0.25) * Math.sin(a)])
  }
  cols.push([x0 - 0.25, s * 12.0], [x0 - 0.25, s * 13.6])
  for (const [x, y] of cols) {
    cylinder(stone, x, y, 0.55, 0.6, PAV_ORDER - 0.9, 8, 0.5)
    cylinder(stone, x, y, 0.5, PAV_ORDER - 0.9, PAV_ORDER, 8, 0.72)
  }
  // a niche on the front, one on the side
  panel(shade, 'w', x0, s > 0 ? 11.8 : -13.4, s > 0 ? 13.4 : -11.8, 2.4, 7.4, 0.04)
  panel(shade, s > 0 ? 'n' : 's', yout, -27.5, -26, 2.4, 7.4, 0.04)
}
pavilion(1)
pavilion(-1)

// ---------------------------------------------------------------------------
// Aisles (lean-to copper roofs) between the pavilions, the transept and the
// apse; the south turret.
function aisle(xa: number, xb: number, s: number, yo = 20.2) {
  const yi = s * NY, y2 = s * yo
  cbox(ashlar, rect(xa, xb, Math.min(yi, y2), Math.max(yi, y2)), 0, AISLE_OUT, { top: false })
  qf(copper, [xa, yi, AISLE_IN], [xb, yi, AISLE_IN], [xb, y2 + s * 0.3, AISLE_OUT], [xa, y2 + s * 0.3, AISLE_OUT], [0, s * (AISLE_IN - AISLE_OUT), yo - NY])
  qf(copper, [xa, y2 + s * 0.3, AISLE_OUT], [xb, y2 + s * 0.3, AISLE_OUT], [xb, y2 + s * 0.3, AISLE_OUT - 0.4], [xa, y2 + s * 0.3, AISLE_OUT - 0.4], [0, s, 0])
  for (const x of [xa, xb]) {
    const n: V3 = [x === xa ? -1 : 1, 0, 0]
    tf(ashlar, [x, yi, AISLE_OUT], [x, y2, AISLE_OUT], [x, yi, AISLE_IN], n)
  }
}
aisle(-29.5, -5.4, -1, 19.8)
aisle(12.7, 25, -1, 19.8)
aisle(12.7, 25, 1, 20.2)
{
  // turret, r 4.5 about (-24.4, -19.8), with a low copper cap
  const cx = -24.4, cy = -19.8
  lathe(ashlar, cx, cy, [[4.5, 0], [4.5, 14.6]], 16, false)
  lathe(copper, cx, cy, [[4.75, 14.6], [4.75, 15.0], [4.3, 15.3], [0, 15.9]], 16, false)
  for (const a of [-110, -60]) {
    const t = (a * Math.PI) / 180
    const p: XY = [cx + 4.52 * Math.cos(t), cy + 4.52 * Math.sin(t)]
    const tg: XY = [-Math.sin(t), Math.cos(t)]
    qf(shade, [p[0] - tg[0] * 0.7, p[1] - tg[1] * 0.7, 6], [p[0] + tg[0] * 0.7, p[1] + tg[1] * 0.7, 6], [p[0] + tg[0] * 0.7, p[1] + tg[1] * 0.7, 11.5], [p[0] - tg[0] * 0.7, p[1] - tg[1] * 0.7, 11.5], [Math.cos(t), Math.sin(t), 0])
  }
}

// ---------------------------------------------------------------------------
// Transept: x -5.4..12.7, y -19.8..21.9, hipped slate roof.
{
  const r = rect(-5.4, 12.7, -19.8, 21.9)
  cbox(ashlar, r, 0, CORN - 1.0, { top: false })
  cbox(stone, rect(r.x0 - 0.4, r.x1 + 0.4, r.y0 - 0.4, r.y1 + 0.4), CORN - 1.0, CORN, { b: 0.3, top: false, bottom: true })
  hip(slate, rect(r.x0 - 0.4, r.x1 + 0.4, r.y0 - 0.4, r.y1 + 0.4), CORN, RIDGE, 9.0, slate, 6.0)
  // a tall arched window in each end and two high on the sides
  for (const s of [-1, 1]) {
    panel(shade, s > 0 ? 'n' : 's', s > 0 ? r.y1 : r.y0, 1.8, 5.5, 12.0, 21.0, 0.05)
    panel(shade, s > 0 ? 'n' : 's', s > 0 ? r.y1 : r.y0, 2.2, 5.1, 21.0, 22.4, 0.05)
  }
}

// ---------------------------------------------------------------------------
// The drum and dome over the crossing.
{
  const cx = 3.9, cy = 1.1, N = 20
  lathe(slate, cx, cy, [[10.5, RIDGE - 3.0], [10.5, 31.8], [10.9, 31.9], [10.9, 32.4], [10.5, 32.5], [10.5, 33.9]], N, false)
  lathe(copper, cx, cy, [[11.3, 33.9], [11.3, 34.8], [10.5, 35.1], [10.5, 38.0], [10.0, 41.2], [9.0, 43.4], [8.0, 45.1], [6.0, 47.3], [4.0, 49.1], [2.6, 50.3],
    [2.3, 50.5], [2.2, 53.0], [2.6, 54.0], [2.2, 55.3], [1.0, 56.2], [0.7, 58.2], [0.5, 59.0]], N, false)
  // lit panels of the drum: dark glazing on the lead
  for (let k = 0; k < N; k++) {
    const a = ((k + 0.5) * 2 * Math.PI) / N
    const p: XY = [cx + 10.55 * Math.cos(a), cy + 10.55 * Math.sin(a)], tg: XY = [-Math.sin(a), Math.cos(a)]
    for (const [z0, z1] of [[RIDGE - 1.2, 31.6], [32.7, 33.7]]) qf(shade, [p[0] - tg[0] * 1.2, p[1] - tg[1] * 1.2, z0], [p[0] + tg[0] * 1.2, p[1] + tg[1] * 1.2, z0], [p[0] + tg[0] * 1.2, p[1] + tg[1] * 1.2, z1], [p[0] - tg[0] * 1.2, p[1] - tg[1] * 1.2, z1], [Math.cos(a), Math.sin(a), 0])
  }
  // twelve dormers: a copper hood round an arched dark window
  for (let k = 0; k < 12; k++) {
    const a = ((k + 0.5) * 2 * Math.PI) / 12
    const u: XY = [Math.cos(a), Math.sin(a)], tg: XY = [-u[1], u[0]]
    const R0 = 10.7, z0 = 35.1, z1 = 39.2, hw = 1.05, dep = 1.3
    const P = (r: number, t: number, z: number): V3 => [cx + u[0] * r + tg[0] * t, cy + u[1] * r + tg[1] * t, z]
    // front face with the window, cheeks, a round-ish hood
    qf(copper, P(R0, -hw - 0.3, z0), P(R0, hw + 0.3, z0), P(R0, hw + 0.3, z1), P(R0, -hw - 0.3, z1), [u[0], u[1], 0])
    qf(shade, P(R0 + 0.05, -hw, z0 + 0.3), P(R0 + 0.05, hw, z0 + 0.3), P(R0 + 0.05, hw, z1 - 0.2), P(R0 + 0.05, -hw, z1 - 0.2), [u[0], u[1], 0])
    for (const sd of [-1, 1]) qf(copper, P(R0 - dep, sd * (hw + 0.3), z0), P(R0, sd * (hw + 0.3), z0), P(R0, sd * (hw + 0.3), z1), P(R0 - dep, sd * (hw + 0.3), z1 + 0.3), [tg[0] * sd, tg[1] * sd, 0])
    qf(copper, P(R0, -hw - 0.3, z1), P(R0, hw + 0.3, z1), P(R0 - dep, hw + 0.3, z1 + 0.9), P(R0 - dep, -hw - 0.3, z1 + 0.9), [u[0], u[1], 1.2])
  }
  // gilt ball and cross
  lathe(gold, cx, cy, [[0.01, 59.0], [0.55, 59.2], [0.85, 59.8], [0.55, 60.4], [0.01, 60.6]], 10, false)
  cbox(gold, rect(cx - 0.15, cx + 0.15, cy - 0.15, cy + 0.15), 60.5, 63.1)
  cbox(gold, rect(cx - 0.15, cx + 0.15, cy - 0.8, cy + 0.8), 61.9, 62.3)
}

// ---------------------------------------------------------------------------
// The apse: half round about (25, 1), r 10.5; a half-cone slate roof and a
// small copper cupola.
{
  const cx = 25, cy = 0.8, R = 10.0, N = 10
  const arcPts: XY[] = []
  for (let k = 0; k <= N; k++) { const a = -Math.PI / 2 + (Math.PI * k) / N; arcPts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]) }
  for (let k = 0; k < N; k++) {
    const [a, b] = [arcPts[k], arcPts[k + 1]]
    const n: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    qf(ashlar, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], CORN - 1.0], [a[0], a[1], CORN - 1.0], n)
    qf(stone, [a[0], a[1], CORN - 1.0], [b[0], b[1], CORN - 1.0], [b[0], b[1], CORN], [a[0], a[1], CORN], n)
    tf(slate, [a[0], a[1], CORN], [b[0], b[1], CORN], [cx, cy, RIDGE - 0.3], [n[0], n[1], R])
    if (k % 3 === 1) {
      const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], l = Math.hypot(n[0], n[1])
      const tg: XY = [-n[1] / l, n[0] / l], o = 0.05 / l
      qf(shade, [m[0] - tg[0] * 1.0 + n[0] * o, m[1] - tg[1] * 1.0 + n[1] * o, 12], [m[0] + tg[0] * 1.0 + n[0] * o, m[1] + tg[1] * 1.0 + n[1] * o, 12], [m[0] + tg[0] * 1.0 + n[0] * o, m[1] + tg[1] * 1.0 + n[1] * o, 19], [m[0] - tg[0] * 1.0 + n[0] * o, m[1] - tg[1] * 1.0 + n[1] * o, 19], n)
    }
  }
  lathe(copper, 30.5, cy, [[1.6, 27.0], [1.6, 30.2], [1.8, 30.4], [1.2, 31.6], [0.01, 32.5]], 10, false)
}

// ---------------------------------------------------------------------------
// The clergy house (north) and the south block and annexes.
{
  const h = rect(-24, 14, 20.2, 35.7)
  cbox(ashlar, h, 0, 11.6, { top: false })
  qf(slate, [h.x0, h.y0, 11.6], [h.x1, h.y0, 11.6], [h.x1, 28, 14.1], [h.x0, 28, 14.1], [0, -2.5, 7.8])
  qf(slate, [h.x0, h.y1, 11.6], [h.x1, h.y1, 11.6], [h.x1, 28, 14.1], [h.x0, 28, 14.1], [0, 2.5, 7.7])
  for (const x of [h.x0, h.x1]) tf(ashlar, [x, h.y0, 11.6], [x, h.y1, 11.6], [x, 28, 14.1], [x === h.x0 ? -1 : 1, 0, 0])
  cbox(ashlar, rect(14, 25, 20.2, 35.7), 0, 8.4, { b: 0.2, top: slate })
  for (let k = 0; k < 9; k++) {
    const x = -21 + k * 4.2
    for (const z of [3.0, 7.0]) panel(shade, 'n', h.y1, x - 0.7, x + 0.7, z, z + 2.2, 0.05)
  }
  const sb = rect(1.8, 29.2, -41.7, -27.8)
  cbox(ashlar, sb, 0, 15.7, { b: 0.3, top: slate })
  for (let k = 0; k < 6; k++) {
    const x = 4.2 + k * 4.5
    for (const z of [2.5, 7.0, 11.5]) panel(shade, 's', sb.y0, x - 0.8, x + 0.8, z, z + 2.4, 0.05)
  }
  cbox(ashlar, rect(2.9, 34.1, -27.8, -19.8), 0, 5.3, { b: 0.2, top: slate })
  cbox(ashlar, rect(25, 37.8, -21.0, -9.2), 0, 5.3, { b: 0.2, top: slate })
}

// Floodlight: the west front and the dome; the rest only faintly.
const lit = (p: V3, n: V3): number => {
  if (n[2] > 0.7) return 0.1
  return p[0] < -35 ? (n[0] < -0.3 ? 1 : 0.7) : 0.25
}
const domeLit = (p: V3, n: V3) => (p[2] > 33 ? 0.7 : 0)
/** A material with its night floodlighting (written as `_FLOODLIGHT`). */
function withFlood<T extends object>(m: T, floodlight: (p: V3, n: V3) => number) {
  return { ...m, floodlight }
}
if (import.meta.main) {
  await saveModel('phl-cathedral-basilica', 'Cathedral Basilica of Saints Peter and Paul', [
    { part: stone, material: withFlood(finish('cathedral-brownstone', 0x9a6556), lit) },
    { part: ashlar, material: withFlood(finish('cathedral-ashlar', 0x8f756d), lit) },
    { part: shade, material: finish("cathedral-recess", 0x45413f, 0.6) },
    { part: slate, material: finish('cathedral-slate', 0x646d70) },
    { part: copper, material: withFlood(finish('cathedral-copper', 0x7fb3a2), domeLit) },
    { part: gold, material: finish('cathedral-gilt', 0xd8b04a, 0.4) },
  ], { source: 'generators/phl-cathedral-basilica.ts', bearing: 10, osm: 'way/252221811', height: 63.1 }, 6500)
}
void pwalls; void circle
