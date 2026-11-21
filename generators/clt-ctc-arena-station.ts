/**
 * CTC/Arena station (LYNX Blue Line, opened 2007), Charlotte — original
 * procedural geometry, CC0-1.0.
 * bun generators/clt-ctc-arena-station.ts
 *
 * Map frame: x across the tracks (toward the south-east), y along them
 * (toward the north-east, bearing 45.98), z up, metres; origin at the
 * anchor (the centroid of the OSM station outline way/1186330002) on the
 * lowest ground, the floor of the Trade Street underpass.
 *
 * What is modelled: the Blue Line station only, as far as its OSM outline
 * reaches: the bridge deck carrying the two tracks over Trade Street, its
 * median pier and its abutments, the two side platforms, and their two
 * vaulted canopies of white arched ribs and pale translucent glazing. The
 * Charlotte Transportation Center bus terminal beside it (way/48908467)
 * and the Gold Line stop on Trade Street under it are left out.
 *
 * Identity:
 *  - the two long canopies over the side platforms: white steel ribs
 *    every ~4.3 m that rise from a post at the platform's outer edge and
 *    arch over toward the tracks, carrying pale glazing (every platform
 *    photo); one canopy arches high and steeply, the other slopes gently
 *    up toward the tracks (City Dweller 2's photos; lidar);
 *  - the station stands on a bridge: Trade Street dips under it, with a
 *    round pier in the street's median (Mark Clifton's photo from Trade
 *    Street, the bus coming out from under the deck), and the CTC's
 *    second-floor landing opens onto the platform (City Dweller 2).
 *    So the platforms are elevated over Trade Street, not over 4th Street
 *    or the bus concourse.
 *
 * Evidence:
 *  - OSM: station way/1186330002 (man_made=bridge, railway=station,
 *    layer 1); platforms way/535123114 (x 3.5..10.3) and way/535123116
 *    (x -10.3..-3.4), both y -26.1..26.2; Blue Line tracks way/55208165
 *    and way/906691498 at x ±1.9. None of them is a building, and the model
 *    covers no OSM building or building:part, so `replaces` is empty.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 0.5 m
 *    grid, read in this frame. The underpass floor is the lowest ground
 *    (0.8 m above the box's lowest return; heights here from it). Track
 *    and ballast 6.0 m; the ground meets the track's level just past both
 *    ends of the outline. Canopy tops: north-west canopy 8.8 m at its outer
 *    edge (x -10), 13.2 m at x -8, 14.0 m at x -6, 13.4 m at x -2; south-
 *    east canopy 10.6 m at x 10, 11.5 at x 8, 11.9 at x 6, 12.3 at x 4,
 *    its ribs (alternate lidar rows) reaching 12.9 m over the tracks.
 *  - The map's terrain (Mapterhorn) shows the underpass too: about 0.7 m
 *    under the middle of the station, 6.5-7 m on the trackway at the ends.
 *  - Photos (Wikimedia Commons, daylight): "Charlotte Transportation Center
 *    Light Rail Station February 2024.jpg", "Light Rail Train Entering
 *    Charlotte Transportation Center Station March 2024.jpg", "Charlotte
 *    Transportation Center Light Rail Platform March 2024.jpg" and
 *    "Charlotte Transportation Center Second Floor Landing March 2024.jpg"
 *    (all City Dweller 2, CC BY-SA 4.0); "Charlotte Transportation Center
 *    01.jpg" (Mark Clifton, CC BY-SA 2.0, from Trade Street: the bridge,
 *    the pier, the canopy); "Charlotte Transportation Center Arena (LYNX
 *    station).jpg" (Patriarca12, CC BY 3.0, the canopy ribs). URLs in the
 *    catalog references. No commercial imagery or 3D tiles.
 *
 * Estimated: the deck's depth (1.4 m) and its underside at 4.6 m (the
 * Trade Street photo); the platforms 0.35 m above the rails; the pier
 * (two round columns on a cap beam, at the deck's middle: the photo shows
 * one column in the median, the other side is hidden) and the abutments
 * from |y| 17 m (where the underpass's walls rise, map terrain and lidar);
 * the rib spacing (4.3 m, photos), the posts' height at the outer edges;
 * colours from the photos: pale concrete, red-grey brick pavers, white
 * steel, frosted glazing. The glazing is translucent (opacity 0.45,
 * double-sided, named glass so it stays dark at night): seeing the ribs,
 * platforms and trains through the canopies is how the station reads from
 * Trade Street, and 0.45 keeps the frosted panels reading as a roof.
 *
 * Left out: railings, the fence between the tracks, signs, lamps and
 * benches (too fine for the map); the overhead line.
 *
 * Doubts: the pier's form and position along the deck are read from one
 * distant photo; the canopy ends are drawn open.
 *
 * Terrain check: the ballast at the two very ends of the outline (|y| > 25
 * m, about 15 m²) sits 0.3-0.75 m under the map's terrain. That is the
 * footprint-edge case: the trackway continues at grade beyond the station,
 * and the map's 2 m terrain rounds its fill up over the track. Lidar puts
 * the track there at 6.0 m, level with the deck, so the model keeps it.
 */
import { Part, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'
import { cap, rect, save, walls, type XY } from './chi-aon-center'

const BEARING = 45.98
const ANCHOR: [number, number] = [35.2253235, -80.8408876]

const concrete = new Part(), ballast = new Part(), paving = new Part(), glass = new Part(), steel = new Part()

const Y0 = -26.1, Y1 = 26.2, XO = 10.3, PL_IN = 3.45
const DECK = 6.0, SOFFIT = 4.6, PLAT = DECK + 0.35, ABUT = 17

/** A quad given with an explicit normal; Part.tri winds to agree with it. */
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) {
  p.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
  p.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
}
/** A box from its plan ring (counter-clockwise) between z0 and z1. */
function box(p: Part, r: XY[], z0: number, z1: number) {
  walls(p, r, z0, z1)
  cap(p, r, z1)
  cap(p, r, z0, false)
}

// --- The bridge deck: a slab over the underpass, ballast between the
// platforms, the platforms raised on it.
// Tops are split into 4.35 m lengths so the map, which lifts each vertex by
// the ground under it, keeps them level where the trackway's fill rises at
// both ends.
const NSEG = 12, ySeg = (k: number) => Y0 + (Y1 - Y0) * k / NSEG
{
  const D: XY[] = rect(-XO, Y0, XO, Y1)
  walls(concrete, D, SOFFIT, DECK - 0.05)
  cap(concrete, D, SOFFIT, false)
}
for (let k = 0; k < NSEG; k++) {
  const a = ySeg(k), b = ySeg(k + 1)
  cap(ballast, rect(-PL_IN, a, PL_IN, b), DECK)
  for (const s of [-1, 1]) cap(paving, s < 0 ? rect(-XO, a, -PL_IN, b) : rect(PL_IN, a, XO, b), PLAT)
}
for (const s of [-1, 1]) walls(paving, s < 0 ? rect(-XO, Y0, -PL_IN, Y1) : rect(PL_IN, Y0, XO, Y1), DECK - 0.05, PLAT)
// the abutments where the trackway's fill meets the bridge (their tops are
// under the deck, so no cap)
for (const [a, b] of [[Y0, -ABUT], [ABUT, Y1]]) walls(concrete, rect(-XO, a, XO, b), 0, SOFFIT)

// --- The pier in Trade Street's median: a cap beam on two round columns,
// each on a wider base.
box(concrete, rect(-8.5, -0.9, 8.5, 0.9), SOFFIT - 1.0, SOFFIT)
for (const x of [-4.5, 4.5]) {
  const ring = (r: number, n = 12): XY[] => Array.from({ length: n }, (_, i) => [x + r * Math.cos(2 * Math.PI * i / n), r * Math.sin(2 * Math.PI * i / n)] as XY)
  box(concrete, ring(1.1), 0, 1.4)
  box(concrete, ring(0.7), 1.4, SOFFIT - 1.0)
}

// --- The canopies. Each profile runs in (x, z) with its outer/upper side
// on the left, so the normal (-dz, dx) points out of the glazing.
type P2 = [number, number]
const arcPts = (cx: number, cz: number, rx: number, rz: number, a0: number, a1: number, n: number): P2[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + rx * Math.cos(a), cz + rz * Math.sin(a)] as P2 })
// north-west: a post at the outer edge, a tight arc, then a beam easing
// down toward the tracks
const NW: P2[] = [[-XO, PLAT], [-XO, 8.6], ...arcPts(-6.3, 8.6, 4.0, 5.4, Math.PI, Math.PI / 2, 5).slice(1), [-4.0, 13.8], [-1.2, 13.3]]
// south-east: a short post, then a long gentle arc rising toward the tracks
// (listed from the track end outward, so its outer side stays on the left)
const SE: P2[] = [[0.4, 12.9], [3.0, 12.4], [5.0, 12.1], [7.0, 11.75], [8.6, 11.25], [9.7, 10.5], [XO, 9.6], [XO, PLAT]]
// the glazing starts at the posts' tops (the sides are open between the
// posts) and stops short of the ribs' ends over the tracks
const NW_GLASS = NW.slice(1, NW.length - 1).concat([[-1.6, 13.35]])
const SE_GLASS: P2[] = [[3.0, 12.4], ...SE.slice(2, SE.length - 1)]

const normal = (a: P2, b: P2): P2 => { const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz); return [-dz / l, dx / l] }

function glazing(prof: P2[]) {
  for (let i = 0; i < prof.length - 1; i++) {
    const a = prof[i], b = prof[i + 1], [nx, nz] = normal(a, b)
    const A0: V3 = [a[0], Y0, a[1]], A1: V3 = [a[0], Y1, a[1]], B0: V3 = [b[0], Y0, b[1]], B1: V3 = [b[0], Y1, b[1]]
    quad(glass, A0, B0, B1, A1, [nx, 0, nz])
  }
}
function rib(prof: P2[], y: number, w = 0.4, d = 0.45) {
  const off = (i: number): P2 => {
    // average the neighbouring segments' normals at a joint
    const n0 = i > 0 ? normal(prof[i - 1], prof[i]) : normal(prof[0], prof[1])
    const n1 = i < prof.length - 1 ? normal(prof[i], prof[i + 1]) : n0
    const nx = (n0[0] + n1[0]) / 2, nz = (n0[1] + n1[1]) / 2, l = Math.hypot(nx, nz)
    return [prof[i][0] + d * nx / l, prof[i][1] + d * nz / l]
  }
  const ya = y - w / 2, yb = y + w / 2
  for (let i = 0; i < prof.length - 1; i++) {
    const a = prof[i], b = prof[i + 1], oa = off(i), ob = off(i + 1), [nx, nz] = normal(a, b)
    quad(steel, [oa[0], ya, oa[1]], [ob[0], ya, ob[1]], [ob[0], yb, ob[1]], [oa[0], yb, oa[1]], [nx, 0, nz]) // top
    quad(steel, [a[0], ya, a[1] - 0.02], [b[0], ya, b[1] - 0.02], [b[0], yb, b[1] - 0.02], [a[0], yb, a[1] - 0.02], [-nx, 0, -nz]) // underside
    quad(steel, [a[0], ya, a[1]], [b[0], ya, b[1]], [ob[0], ya, ob[1]], [oa[0], ya, oa[1]], [0, -1, 0])
    quad(steel, [a[0], yb, a[1]], [b[0], yb, b[1]], [ob[0], yb, ob[1]], [oa[0], yb, oa[1]], [0, 1, 0])
  }
}
glazing(NW_GLASS)
glazing(SE_GLASS)
const NR = 12
for (let k = 0; k <= NR; k++) {
  const y = Y0 + 0.3 + (Y1 - Y0 - 0.6) * k / NR
  rib(NW, y)
  rib(SE, y)
}
// edge beams along the canopies' outer posts' tops and along their ends
// over the tracks, so the outline reads at map distance
for (const [x, z] of [[-XO, 8.6], [XO, 9.6], [-1.2, 13.3], [0.4, 12.9]] as P2[]) {
  box(steel, rect(x - 0.22, Y0, x + 0.22, Y1), z - 0.45, z + 0.05)
}

// translucent frosted glazing; save() passes the spec through to writeGlb
const CANOPY_GLASS: MaterialSpec = { ...PALETTE.glass, color: 0xa9cfe2, opacity: 0.45, doubleSided: true }

if (import.meta.main) {
  await save('clt-ctc-arena-station', 'CTC/Arena station', ANCHOR, BEARING, [
    { part: concrete, material: finish('ctc-concrete', 0xd4cfc6) },
    { part: ballast, material: PALETTE.roof },
    { part: paving, material: finish('ctc-pavers', 0xb8a99d) },
    { part: glass, material: CANOPY_GLASS as Swatch },
    { part: steel, material: finish('ctc-white-steel', 0xf1f2ef) },
  ])
}
