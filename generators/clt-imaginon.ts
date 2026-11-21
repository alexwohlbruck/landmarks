/**
 * ImaginOn: The Joe & Joan Martin Center (300 E 7th St, 2005; Holzman Moss
 * Bottino Architecture with Gantt Huberman Architects), Charlotte. The
 * children's library and Children's Theatre of Charlotte. Original
 * procedural geometry, CC0-1.0.
 * bun generators/clt-imaginon.ts
 *
 * This file also exports a few helpers (sloped walls and caps, columns)
 * that the other North Tryon models in this batch import, so it is merged
 * first. Its own model is written only when it runs itself.
 *
 * Map frame: x, y, z up, metres, turned to bearing 30.7: +y faces East 7th
 * Street (north-east), +x runs along 7th St to the south-east (Brevard St
 * end), -x is the north-west end on the Blue Line / Rail Trail, -y faces
 * 6th St. Origin: centroid of OSM way/322278769 on the ground.
 *
 * Identity, in order:
 *  - one great flat canopy roof, tilted so it rises from the north-west end
 *    to the south-east end, overhanging the 7th Street front on a row of
 *    tall round concrete columns with flared heads;
 *  - the two-storey glass curtain wall under it, with three tile-clad boxes
 *    standing in front of the glass: purple, blue and green;
 *  - the green tile wall at the south-east (Brevard) corner, glass with
 *    sun louvres above it;
 *  - the curved zinc roof of the theatre rising behind, its high flat wall
 *    to the north-west and its roof sweeping down to the south-east;
 *  - red-brown brick at the north-west end and round the theatre.
 *
 * Evidence:
 *  - OSM way/322278769 (building, height 27, amenity library, Q69857334):
 *    the outline, read in this frame; no building:parts. The 7th St edge of
 *    the outline is the canopy's edge (NAIP), so the glass wall is set 4 m
 *    back under it.
 *  - Lidar: USGS_LPC_NC_Phase4_Mecklenburg_2016 (flown 2016-17), 1 m grid,
 *    read with tools/lidar_frame.py at bearing 30.7. Ground beside the
 *    building 2.4 m (south-east) to 3.6 m (7th St) over the box minimum;
 *    y = 0 here is the 2.4 m ground. Measured: the canopy roof is a plane
 *    rising along x only, 11.0 m above that ground at x = -45 and 13.6 m at
 *    x = +50; the theatre roof crests at 25.6 m at x = 5..10, a high wall
 *    at x = 2, and falls in a curve to meet the main roof at x = 37 (24.8 m
 *    at x = 10, 21.9 at 20, 17.2 at 30), over y = -41..-9; the round
 *    court at the 7th St front north-west is an open ring wall 6-7 m high,
 *    hollow inside (0.5 m grid).
 *  - NAIP (USGS, public domain) for the plan: the theatre's pale curved roof
 *    to the south, the round brick court on 7th St.
 *  - Photos (all of the 7th St front from the north-east, across 7th St):
 *    "Imaginon.jpg" (Property of PLCMC, CC BY-SA 2.0,
 *    https://commons.wikimedia.org/wiki/File:Imaginon.jpg);
 *    "ImaginOn The Joe & Joan Martin Center.jpg" (Holzman Moss Bottino
 *    Architecture, CC BY-SA 4.0, dusk,
 *    https://commons.wikimedia.org/wiki/File:ImaginOn_The_Joe_%26_Joan_Martin_Center.jpg);
 *    "ImaginOn: The Joe & Joan Martin Center (PLCMC)" (Charlotte
 *    Mecklenburg Library, CC BY-SA 2.0,
 *    https://www.flickr.com/photos/21161052@N03/2568011403).
 *    No Mapillary token was available. No commercial imagery.
 *  - Published: opened 2005; architect Holzman Moss Bottino (Wikipedia
 *    "ImaginOn"). (The lead's note named Gwathmey Siegel; the sources and
 *    the photo's own credit say Holzman Moss Bottino.)
 *
 * Estimated from the photos: the glass wall 5 m behind the canopy edge; the
 * columns (1.6 m at the foot, tapering out to a 2.8 m flared head, drawn
 * bolder than life so they read at phone size; eight at about 12 m) just
 * inside the canopy's front line and clear in front of the tile boxes; the
 * boxes' widths and heights (purple 12 m, blue 12 m, green 10 m, 8-9.6 m
 * tall, about 2/3 of the glass, 2.4 m proud of it), placed by counting columns in the
 * photos; the floor line at 5.5 m; the canopy slab 0.9 m thick; the green
 * corner wall 9.5 m.
 *
 * Review round 1 (lead): the canopy was already one tilted plane; it is now
 * unclamped and fitted to the lidar along the whole front (10.3 m at
 * x = -36, 13.3 m at x = +54). The lead's note put the high corner at the
 * west; the lidar and both photos (the high corner is the green-tiled
 * corner nearest the camera, with the skyline to the right, i.e. looking
 * south-west) put it at the south-east (Brevard) corner, so it stays there.
 * The theatre hump is kept: the lidar shows a 25 m curved roof over
 * x = 5..37, y = -9..-41, and NAIP shows its pale curved roof; it is hidden
 * behind the canopy from 7th St, which is why the photos don't show it.
 * No open-licensed rear photo was found.
 *
 * Doubts: only the 7th St front is photographed under an open licence. The
 * Brevard end, the 6th St side and the rail-trail end are drawn from NAIP
 * and lidar as plain brick with a few window panels; their real openings
 * are unknown. The theatre's walls are drawn as brick. The tile boxes'
 * exact positions are counted from a perspective view (±2 m).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { panel, save, triangulate, onWall, type XY } from './chi-aon-center'

// ---------- shared helpers (exported for the other clt- North Tryon models)

/** Walls of a counter-clockwise ring whose bottom and top heights vary by point. */
export function wallsF(p: Part, r: XY[], z0: (q: XY) => number, z1: (q: XY) => number) {
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    p.quad([a[0], a[1], z0(a)], [b[0], b[1], z0(b)], [b[0], b[1], z1(b)], [a[0], a[1], z1(a)])
  }
}
/** A cap over a ring at a height that varies by point (a plane gives a flat tilted roof). */
export function capF(p: Part, r: XY[], z: (q: XY) => number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z(r[a])], B: V3 = [r[b][0], r[b][1], z(r[b])], C: V3 = [r[c][0], r[c][1], z(r[c])]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}
/** A round column, smooth-shaded, with a flared head of radius rTop from zFlare up. */
export function column(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, seg = 12, rTop = r, zFlare = z1, rMid = r) {
  const prof: [number, number][] = rTop > rMid ? [[r, z0], [rMid, zFlare], [rTop, z1]] : [[r, z0], [rMid, z1]]
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * 2 * Math.PI, b = ((k + 1) / seg) * 2 * Math.PI
    for (let i = 0; i < prof.length - 1; i++) {
      const [r0, h0] = prof[i], [r1, h1] = prof[i + 1]
      const P = (rr: number, h: number, t: number): V3 => [cx + rr * Math.cos(t), cy + rr * Math.sin(t), h]
      const N = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
      p.tri(P(r0, h0, a), P(r0, h0, b), P(r1, h1, b), undefined, undefined, undefined, [N(a), N(b), N(b)])
      p.tri(P(r0, h0, a), P(r1, h1, b), P(r1, h1, a), undefined, undefined, undefined, [N(a), N(b), N(a)])
    }
  }
}
/** A flat-topped box between z0 and z1 over a counter-clockwise ring (walls and a top). */
export function prism(wall: Part, top: Part, r: XY[], z0: number, z1: number) {
  wallsF(wall, r, () => z0, () => z1)
  capF(top, r, () => z1)
}
/** A wall's length. */
export const edgeLen = (a: XY, b: XY) => Math.hypot(b[0] - a[0], b[1] - a[1])
/** Signed area; positive when counter-clockwise. */
export const ringArea = (r: XY[]) => r.reduce((s, a, i) => { const b = r[(i + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
export const ccw = (r: XY[]) => (ringArea(r) < 0 ? [...r].reverse() : r)

// ---------- ImaginOn

const BEARING = 30.7
const ANCHOR: [number, number] = [35.226928, -80.8376938]

const concrete = new Part(), glass = new Part(), brick = new Part()
const purple = new Part(), blue = new Part(), green = new Part()

/** The canopy roof: one plane rising along x to the south-east (Brevard) corner (lidar: 10.3 m at x = -36, 13.3 m at x = +54). */
const roofZ = (q: XY) => 11.5 + 0.0335 * q[0]
const SLAB = 0.9

// The canopy's outline (OSM, simplified, without the rotunda and the theatre's bulge).
const CANOPY: XY[] = ccw([[-55.3, -27.2], [2.1, -27.1], [39.1, -26.2], [43.8, -11.9], [45.9, -12.4], [48.5, -5.1], [46.6, -4.8], [57.4, 29.0], [58.1, 31.3], [-37.0, 31.2], [-41.9, 22.0], [-39.3, 21.1], [-50.5, -2.9], [-47.2, -3.6]])
// The enclosed building under it: the 7th St glass 5 m back, the south-east end 3 m back.
const FRONT = 26.2
const BODY: XY[] = ccw([[-55.3, -27.2], [2.1, -27.1], [39.1, -26.2], [43.8, -11.9], [43.5, -4.8], [53.4, FRONT], [-38.4, FRONT], [-50.5, -2.9], [-47.2, -3.6]])

// --- the canopy slab: top, soffit and its thin edge.
capF(concrete, CANOPY, roofZ)
capF(concrete, CANOPY, q => roofZ(q) - SLAB, false)
wallsF(concrete, CANOPY, q => roofZ(q) - SLAB, roofZ)

// --- the body under it: brick on the back and ends, glass on 7th St.
{
  const under = (q: XY) => roofZ(q) - SLAB
  for (let i = 0; i < BODY.length; i++) {
    const a = BODY[i], b = BODY[(i + 1) % BODY.length]
    const front = Math.abs(a[1] - FRONT) < 0.01 && Math.abs(b[1] - FRONT) < 0.01
    const seEnd = a[0] === 43.5 && b[0] === 53.4
    const part = front ? concrete : seEnd ? green : brick
    part.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], under(b)], [a[0], a[1], under(a)])
    const L = edgeLen(a, b)
    if (front) {
      // the curtain wall: two tiers of glass between thin pale frames, one bay per column
      const n = Math.round(L / 6.2), w = L / n
      for (let k = 0; k < n; k++) {
        const s0 = k * w + 0.25, s1 = (k + 1) * w - 0.25
        const zt = Math.min(under(a), under(b)) - 0.5
        panel(glass, a, b, s0, s1, 0.4, 5.2)
        panel(glass, a, b, s0, s1, 5.9, zt)
      }
    } else if (seEnd) {
      // green tile to 9.5 m, then glass with louvres to the soffit
      const zt = Math.min(under(a), under(b)) - 0.4
      panel(glass, a, b, 0.5, L - 0.5, 9.9, zt)
    } else if (L > 14) {
      // the back and the ends: a few tall window bands in the brick
      const n = Math.floor(L / 12)
      for (let k = 0; k < n; k++) {
        const c = (k + 0.5) * L / n
        panel(glass, a, b, c - 2.4, c + 2.4, 1.0, 4.4)
        panel(glass, a, b, c - 2.4, c + 2.4, 6.0, 9.0)
      }
    }
  }
  // the green tile is on the south-east end's lower part only: cover its upper part in glass (above) and
  // give the green a ledge line at 9.5 m
  const a: XY = [43.5, -4.8], b: XY = [53.4, FRONT]
  panel(concrete, a, b, 0.2, edgeLen(a, b) - 0.2, 9.5, 9.9)
}

// --- the tile boxes in front of the glass, 2.4 m proud.
{
  const box = (p: Part, x0: number, x1: number, h: number) => {
    const D = FRONT + 2.4
    const r: XY[] = [[x0, FRONT - 0.5], [x1, FRONT - 0.5], [x1, D], [x0, D]]
    prism(p, p, r, 0, h)
    // a few deep-set square windows, as in the photos
    const f: [XY, XY] = [[x1, D], [x0, D]]
    const L = x1 - x0
    panel(glass, f[0], f[1], L * 0.18, L * 0.18 + 2.8, h - 4.4, h - 1.6)
    panel(glass, f[0], f[1], L * 0.6, L * 0.6 + 2.4, h - 4.4, h - 1.6)
    panel(glass, f[0], f[1], L * 0.35, L * 0.35 + 2.0, 1.4, 3.6)
  }
  box(purple, 31, 43, 9.6)
  box(blue, 10, 22, 8.8)
  box(green, -10, 0, 8.0)
}

// --- the columns on the canopy's front line, with flared heads.
for (let k = 0; k < 8; k++) {
  const x = 49 - k * 11.8
  if (Math.abs(x + 23.3) < 8.5) continue // the brick court stands there
  const top = roofZ([x, 0]) - SLAB
  // bold at phone size: 1.6 m at the foot, tapering out to 1.9 m, then a 2.8 m flared head;
  // they stand clear in front of the tile boxes, as in the photos
  column(concrete, x, 29.8, 0.8, 0, top, 12, 1.4, top - 1.6, 0.95)
}

// --- the round brick court on 7th St at the north-west: an open ring wall (lidar: 6-7 m, hollow).
{
  const cx = -23.3, cy = 31.0, r = 7.6, t = 0.7, h = 6.8, seg = 16
  const R = (rr: number) => Array.from({ length: seg }, (_, i) => [cx + rr * Math.cos(i / seg * 2 * Math.PI), cy + rr * Math.sin(i / seg * 2 * Math.PI)] as XY)
  const o = R(r), n = R(r - t)
  wallsF(brick, o, () => 0, () => h)
  wallsF(brick, [...n].reverse(), () => 0, () => h)
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    concrete.quad([n[i][0], n[i][1], h], [o[i][0], o[i][1], h], [o[j][0], o[j][1], h], [n[j][0], n[j][1], h])
  }
}

// --- the theatre: brick walls under a curved zinc roof, high to the north-west.
{
  const X0 = 2.5, X1 = 37, YN = -9, CREST = 25.6
  const zr = (x: number) => roofZ([X1, 0]) + (CREST - roofZ([X1, 0])) * Math.cos(((x - X0) / (X1 - X0)) * Math.PI / 2)
  /** The south wall follows the outline's curved bulge. */
  const ys = (x: number) => (x <= 14 ? -41 : -41 + (x - 14) * (14.5 / 23))
  const n = 10
  const xs = Array.from({ length: n + 1 }, (_, i) => X0 + (X1 - X0) * i / n)
  for (let i = 0; i < n; i++) {
    const xa = xs[i], xb = xs[i + 1], za = zr(xa), zb = zr(xb), ya = ys(xa), yb = ys(xb)
    concrete.quad([xa, ya, za], [xb, yb, zb], [xb, YN, zb], [xa, YN, za]) // roof
    brick.quad([xa, ya, 0], [xb, yb, 0], [xb, yb, zb], [xa, ya, za]) // south wall
    brick.quad([xb, YN, roofZ([xb, 0]) - 0.1], [xa, YN, roofZ([xa, 0]) - 0.1], [xa, YN, za], [xb, YN, zb]) // north wall above the main roof
  }
  // the high north-west wall
  brick.quad([X0, YN, 0], [X0, ys(X0), 0], [X0, ys(X0), CREST], [X0, YN, CREST])
  // a pale band under the roof's high edge
  panel(concrete, [X0, YN], [X0, ys(X0)], 0, YN - ys(X0), CREST - 1.2, CREST - 0.2)
  // the bulge's floor-level lobby glass on the south
  const a: XY = [14, ys(14)], b: XY = [X1, ys(X1)]
  panel(glass, a, b, 2, edgeLen(a, b) - 2, 1.0, 4.6)
}

if (import.meta.main) {
  await save('clt-imaginon', 'ImaginOn', ANCHOR, BEARING, [
    { part: concrete, material: finish('imaginon-concrete', 0xd9d8d2) },
    { part: glass, material: { ...PALETTE.window, color: 0x7f97a8 } },
    { part: brick, material: finish('imaginon-brick', 0xa86a55) },
    { part: purple, material: finish('imaginon-purple-tile', 0x6f63a3) },
    { part: blue, material: finish('imaginon-blue-tile', 0x4f8fab) },
    { part: green, material: finish('imaginon-green-tile', 0x4f9e6a) },
  ])
}
