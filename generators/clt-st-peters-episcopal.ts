/**
 * St. Peter's Episcopal Church (115 W 7th St at North Tryon, 1893-95),
 * Charlotte. Original procedural geometry, CC0-1.0.
 * bun generators/clt-st-peters-episcopal.ts
 *
 * Map frame: x, y, z up, metres, turned to bearing 46: +x faces North
 * Tryon Street (south-east), +y faces West 7th Street (north-east), -y the
 * garden beside Discovery Place, -x the Church St end. Origin: centroid of
 * OSM way/397369783 on the ground.
 *
 * Identity, in order:
 *  - the brick gable on Tryon with its big rose window in a ring of orange
 *    brick, a stone string course, and six lancets under a row of stone
 *    hood arches;
 *  - the short square tower at the 7th St corner, brownstone buttresses
 *    at its corners, the red door under a pointed brick arch;
 *  - the round bay with a conical slate roof at the gable's garden corner;
 *  - behind, the larger slate-roofed church and parish house down the
 *    block, its roofs cross-gabled.
 *
 * Evidence:
 *  - OSM way/397369783 (building church, height 15), the whole complex's
 *    outline, read in this frame; no building:parts.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *    read with tools/lidar_frame.py at bearing 46; ground 5.3 m over the
 *    box minimum, nearly level. Measured above it: the Tryon block's ridge
 *    13.4 m along y = 0, its eaves 5.5-6.5 m on the low side parts; the
 *    tower 12 m; the rear block's ridge 14.7 m along y = 0 from x = -34 to
 *    -7, with cross ridges about x = -31, -5 and +3.5; its eaves near 9.5
 *    m. Trees stand over parts of the garden side.
 *  - NAIP (USGS, public domain): dark slate roofs, cross-gabled, over the
 *    whole complex; a small court at the Church St end.
 *  - Photo: "St. Peter's Episcopal Church, Charlotte, North Carolina.jpg"
 *    (Jason Trommetter, CC BY-SA 2.0,
 *    https://commons.wikimedia.org/wiki/File:St._Peter%27s_Episcopal_Church,_Charlotte,_North_Carolina.jpg):
 *    the Tryon gable and tower from the south-east. Proportions, colours
 *    and the front's features come from it.
 *    "Door of St. Peter's Episcopal Church" (Wesley Fryer, CC BY 2.0,
 *    https://commons.wikimedia.org/wiki/File:Door_of_St._Peter%27s_Episcopal_Church,_Charlotte,_North_Carolina.jpg):
 *    the red door and its brick arch. No Mapillary token was available.
 *    No commercial imagery.
 *  - Published: built 1893-95 (Wikipedia "St. Peter's Episcopal Church
 *    (Charlotte, North Carolina)").
 *
 * Estimated from the photo: the gable 10.2 m wide (OSM) with eaves at
 * 7 m; the rose window 1.8 m radius at 8.6 m, its orange ring 2.3 m; the
 * lancets 0.9 m by 3 m; the tower's buttresses; the round bay's 4.2 m wall
 * and cone.
 *
 * Doubts: only the Tryon front is photographed. The rear block (the larger
 * slate roof) is drawn from lidar and NAIP as brick under a cross-gabled
 * roof with plain lancet windows; its real openings and exact roof shape
 * are unknown, and trees confuse the lidar on the garden side.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { panel, save, type XY } from './chi-aon-center'
import { wallsF, capF, prism, edgeLen, ccw } from './clt-imaginon'

const BEARING = 46
const ANCHOR: [number, number] = [35.2298431, -80.8404837]

const brick = new Part(), stone = new Part(), roof = new Part(), glass = new Part(), door = new Part(), orange = new Part()

const RING: XY[] = ccw([[-36.4, -13.9], [-35.9, 15.2], [-28.8, 15.1], [-28.7, 14.0], [-28.2, 12.6], [-27.5, 11.6], [-26.6, 10.5], [-25.7, 9.8], [-24.5, 9.0], [-23.5, 8.7], [-22.5, 8.7], [-22.4, 14.4], [-16.5, 14.4], [-16.6, 8.4], [-15.1, 8.5], [-13.6, 9.3], [-12.1, 10.5], [-10.9, 11.8], [-10.0, 13.2], [-9.3, 14.4], [17.4, 14.7], [17.4, 10.1], [23.2, 10.1], [23.2, 7.0], [41.2, 7.2], [41.2, 8.9], [46.1, 8.9], [46.1, 3.8], [45.1, 3.8], [45.1, -2.0], [45.9, -2.2], [46.7, -2.8], [47.1, -3.4], [47.2, -4.2], [47.0, -5.1], [46.4, -5.9], [45.7, -6.4], [44.8, -6.4], [44.8, -8.6], [40.8, -8.6], [40.8, -6.1], [23.7, -5.9], [23.7, -8.6], [17.8, -8.6], [17.7, -11.8], [13.0, -11.7], [13.0, -14.5], [-18.8, -14.2], [-18.8, -11.0], [-20.3, -11.0], [-20.4, -14.0]])

/** Clip a ring to x <= c (keep = 'lo') or x >= c ('hi'). */
function clipX(r: XY[], c: number, keep: 'lo' | 'hi'): XY[] {
  const inside = (p: XY) => (keep === 'lo' ? p[0] <= c : p[0] >= c)
  const out: XY[] = []
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) {
      const t = (c - a[0]) / (b[0] - a[0])
      out.push([c, a[1] + t * (b[1] - a[1])])
    }
  }
  return out
}

/** A gable roof over a rectangle, ridge along x at yr; its gable-end triangles in `ends`. */
function gableX(x0: number, x1: number, y0: number, y1: number, yr: number, ze: number, zr: number, ends: Part) {
  roof.quad([x0, y0, ze], [x1, y0, ze], [x1, yr, zr], [x0, yr, zr])
  roof.quad([x1, y1, ze], [x0, y1, ze], [x0, yr, zr], [x1, yr, zr])
  ends.tri([x1, y0, ze], [x1, y1, ze], [x1, yr, zr])
  ends.tri([x0, y1, ze], [x0, y0, ze], [x0, yr, zr])
}
/** A gable roof over a rectangle, ridge along y at xr. */
function gableY(x0: number, x1: number, y0: number, y1: number, xr: number, ze: number, zr: number, ends: Part) {
  roof.quad([x1, y0, ze], [x1, y1, ze], [xr, y1, zr], [xr, y0, zr])
  roof.quad([x0, y1, ze], [x0, y0, ze], [xr, y0, zr], [xr, y1, zr])
  ends.tri([x0, y0, ze], [x1, y0, ze], [xr, y0, zr])
  ends.tri([x1, y1, ze], [x0, y1, ze], [xr, y1, zr])
}
/** A disc (ring of n points) standing on the front wall plane x = X, facing +x. */
function discX(p: Part, X: number, cy: number, cz: number, r0: number, r1: number, n = 20) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, b = ((i + 1) / n) * 2 * Math.PI
    const P = (r: number, t: number): V3 => [X, cy + r * Math.cos(t), cz + r * Math.sin(t)]
    if (r0 > 0) p.quad(P(r0, a), P(r1, a), P(r1, b), P(r0, b))
    else p.tri([X, cy, cz], P(r1, a), P(r1, b))
  }
}

const SPLIT = 23.4 // between the rear block and the Tryon church
const FRONT = 45.1

// --- the rear block: brick to 9.5 m under a cross-gabled slate roof (lidar)
{
  const R = clipX(RING, SPLIT, 'lo')
  const EAVE = 9.0, RIDGE = 14.7
  wallsF(brick, R, () => 0, () => EAVE)
  capF(roof, R, () => EAVE)
  // the main ridge over the block's core, clear of the courts and bays on 7th St and the garden;
  // its east end stops where the lidar roof drops (x = 13)
  gableX(-35.9, 13.0, -11.0, 8.4, -1.3, EAVE, RIDGE, brick)
  gableY(-8.5, -1.5, -14.2, 14.5, -5, EAVE, RIDGE, brick)
  gableY(0.5, 6.5, -14.2, 14.7, 3.5, EAVE, RIDGE, brick)
  // lancets, paired, and a stone band at the sill line
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length], L = edgeLen(a, b)
    if (L < 6 || (Math.abs(a[0] - SPLIT) < 0.01 && Math.abs(b[0] - SPLIT) < 0.01)) continue
    panel(stone, a, b, 0, L, 2.0, 2.4)
    const n = Math.floor(L / 4.5)
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * L / n
      panel(glass, a, b, c - 1.3, c - 0.3, 2.4, 6.8)
      panel(glass, a, b, c + 0.3, c + 1.3, 2.4, 6.8)
    }
  }
}

// --- the Tryon church: low side parts, the gabled nave, the tower and the round bay
{
  const R = clipX(RING, SPLIT, 'hi').filter(q => !(q[0] > FRONT + 0.05 && q[1] < -1.9 && q[1] > -6.5)) // the round bay is drawn on its own
  const LOW = 6.0, EAVE = 7.0, RIDGE = 13.4, Y0 = -6.4, Y1 = 3.8, YR = (Y0 + Y1) / 2
  wallsF(brick, R, () => 0, () => LOW)
  capF(roof, R, () => LOW)
  // the nave above the side parts
  wallsF(brick, ccw([[SPLIT, Y0], [FRONT, Y0], [FRONT, Y1], [SPLIT, Y1]]), () => LOW, () => EAVE)
  gableX(SPLIT, FRONT, Y0, Y1, YR, EAVE, RIDGE, brick)
  // stone coping on the Tryon gable's rakes
  const cope = (ya: number, yb: number) => {
    const za = ya === YR ? RIDGE : EAVE, zb = yb === YR ? RIDGE : EAVE
    stone.quad([FRONT + 0.15, ya, za - 0.45], [FRONT + 0.15, yb, zb - 0.45], [FRONT + 0.15, yb, zb + 0.1], [FRONT + 0.15, ya, za + 0.1])
  }
  cope(Y0, YR); cope(YR, Y1)
  // the front: the rose window in its orange ring, a stone string course, six lancets under stone hoods
  const fa: XY = [FRONT, Y0], fb: XY = [FRONT, Y1]
  discX(orange, FRONT + 0.06, YR, 8.6, 1.8, 2.3)
  discX(glass, FRONT + 0.06, YR, 8.6, 0, 1.8)
  discX(stone, FRONT + 0.1, YR, 8.6, 0, 0.35, 10)
  // the rose's tracery: twelve stone spokes
  for (let k = 0; k < 12; k++) {
    const t = (k / 12) * 2 * Math.PI, w = 0.09
    const P = (r: number, d: number): V3 => [FRONT + 0.1, YR + r * Math.cos(t) - d * Math.sin(t), 8.6 + r * Math.sin(t) + d * Math.cos(t)]
    stone.quad(P(0.3, -w), P(1.8, -w), P(1.8, w), P(0.3, w))
  }
  panel(stone, fa, fb, 1.4, 8.8, 5.6, 5.9)
  panel(stone, fa, fb, 0.6, 9.6, 4.1, 4.6)
  for (let k = 0; k < 6; k++) {
    const c = 2.3 + k * 1.15
    panel(glass, fa, fb, c - 0.42, c + 0.42, 1.3, 4.0, 0.06)
  }
  panel(stone, fa, fb, 0, 10.2, 0, 0.9)
  // the round bay at the garden corner, under a slate cone
  const cx = 45.0, cy = -4.2, r = 2.2, n = 14, H = 4.2, APEX = 6.8
  const ring: XY[] = Array.from({ length: n }, (_, i) => [cx + r * Math.cos(i / n * 2 * Math.PI), cy + r * Math.sin(i / n * 2 * Math.PI)] as XY)
  wallsF(brick, ring, () => 0, () => H)
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n]
    const o = (q: XY): V3 => [cx + (q[0] - cx) * 1.15, cy + (q[1] - cy) * 1.15, H]
    roof.tri(o(a), o(b), [cx, cy, APEX])
    roof.tri(o(b), o(a), [a[0], a[1], H - 0.01]) // the cone's eave underside
    if (a[0] > cx + 0.3 && b[0] > cx + 0.3) panel(glass, a, b, 0.15, edgeLen(a, b) - 0.15, 1.0, 3.4, 0.05)
  }
  // the tower: brick to 12 m with a stone cornice, brownstone corner buttresses, the red door
  const T: XY[] = ccw([[41.2, Y1], [46.1, Y1], [46.1, 8.9], [41.2, 8.9]]), TOP = 12.0
  wallsF(brick, T, () => 0, () => TOP - 0.7)
  wallsF(stone, T, () => TOP - 0.7, () => TOP)
  capF(roof, T, () => TOP)
  for (const [bx, by] of [[46.1, Y1], [46.1, 8.9]] as XY[]) {
    const sy = by === Y1 ? 1 : -1
    // a buttress stepping in twice, in brownstone
    prism(stone, stone, ccw([[bx - 0.9, by - sy * 0.0], [bx + 0.7, by], [bx + 0.7, by + sy * 0.9], [bx - 0.9, by + sy * 0.9]]), 0, 4.2)
    prism(stone, stone, ccw([[bx - 0.7, by], [bx + 0.45, by], [bx + 0.45, by + sy * 0.7], [bx - 0.7, by + sy * 0.7]]), 4.2, 8.0)
  }
  const ta: XY = [46.1, Y1], tb: XY = [46.1, 8.9]
  panel(door, ta, tb, 1.8, 3.3, 0.6, 3.0)
  panel(brick, ta, tb, 1.5, 3.6, 3.0, 4.4, 0.03)
  panel(glass, ta, tb, 2.25, 2.85, 6.6, 9.4)
  panel(stone, ta, tb, 0.9, 4.2, 5.4, 5.8)
}

if (import.meta.main) {
  await save('clt-st-peters-episcopal', "St. Peter's Episcopal Church", ANCHOR, BEARING, [
    { part: brick, material: finish('stpeters-brick', 0x9a5a4a) },
    { part: stone, material: finish('stpeters-brownstone', 0xb48c62) },
    { part: roof, material: finish('stpeters-slate', 0x5e6268) },
    { part: glass, material: { ...PALETTE.window } },
    { part: orange, material: finish('stpeters-orange-brick', 0xc8714c) },
    { part: door, material: { ...PALETTE.entrance, color: 0xc8342c } },
  ])
}
