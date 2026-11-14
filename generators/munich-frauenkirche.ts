/**
 * Frauenkirche (Dom zu Unserer Lieben Frau), Frauenplatz, Munich: Jörg von
 * Halsbach, 1468-94; the "welsche Hauben" on the towers 1525. Original
 * procedural geometry, CC0-1.0.
 * bun generators/munich-frauenkirche.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/225698612,
 * 48.138593, 11.573598. The church's walls run at 89 / 179 degrees, so the
 * catalog bearing is -1 and the church is square to this frame: +x is the
 * apse (east), -x the twin towers on the Frauenplatz (west), -y the south
 * side. The church is symmetric about y = YC = -2.15.
 *
 * Identity, in order: the two square brick towers, 98.5 m, tapering by the
 * steps of their corner piers, banded every ~7 m with pale tuff tracery,
 * turning octagonal at the height of the roof ridge, with clocks, tall
 * pointed belfry windows and a ring of small round-arched windows, and the
 * green copper "welsche Hauben" with their gilt balls; the enormous steep
 * orange tile roof with its rows of little shed dormers, gabled between the
 * towers and hipped round the polygonal choir, separated from the low
 * "Schleppdach" over the chapel ring by a long pale tuff frieze; the plain
 * brick hall below with tall pointed windows between flat pilaster strips;
 * the west portal between the towers.
 *
 * Evidence:
 *  - plan: OSM outline way/225698612 and its parts, read in the turned
 *    frame: towers 222512595 (north) and 222512594 (south) x -55.2..-38.7,
 *    15.2 m wide (y 2.2..17.5 and -21.8..-6.6), drawn as 15.2 m squares to
 *    x -39.9; central bay 222512597 between them; west porch 209452724
 *    (x -55.1..-51.5, 15 m, skillion); nave and choir 222512593 to the apse
 *    polygon (x 34.7..54.2, mirrored about YC; the north half of the OSM
 *    apse is hidden by the sacristy); sacristy 108429818 (22 m, skillion
 *    roof 7 m, falling north); side-portal parts 222512599..602 at x 9 and
 *    x -27.6 on both sides, drawn at the nearest bay centres. Published:
 *    109 x 40 m (de.wikipedia, Frauenkirche (München)).
 *  - heights: towers 98.57 / 98.45 m (de.wikipedia; OSM parts agree),
 *    drawn 98.5 to the top of the ball; "Mauerwerk des Kirchenschiffs etwa
 *    37 m" (de.wikipedia): the frieze top, 38.0 m. The rest are scaled from
 *    Diliff's photo from St Peter (south-east, near-orthographic at
 *    ~0.128 m per px at 1280 px, from the 98.5 m top and the 37 m frieze):
 *    octagon from 60.4 m, ridge 60.5 (de.wikipedia: the square bases taper
 *    "bis auf die Höhe des Dachfirsts"), clock tier to 72, belfry tier to
 *    83.2, round-arched tier to 87.6, dome 87.6-95.9 and 12.7 m across,
 *    stem and ball to 98.5; Schleppdach eave 32.4, frieze 35.7-38.0; tower
 *    bands at 8, 15.5, 22.8, 29.8, 36.7, 43.6, 51.7 and 59.5 m (the upper
 *    five measured, the lower three spaced to match). Chapel depth under the
 *    Schleppdach (3.6 m), window sizes, the porch and portal sizes: estimated
 *    from the photos.
 *  - colours from the daylight photos: the muted brown brick (review round 2:
 *    darker and browner than the roof, from Diliff's photo), the orange
 *    tile roof, the pale tuff friezes and tracery bands, the blue-green
 *    copper domes, the gilt balls and clock hands, black clock dials with
 *    white rings (drawn in `window`, so they glow, as they are lit at night).
 *  - night: Thomas Wolf's dusk photo: towers floodlit warm, the hall walls
 *    lit lower down, windows faintly lit, roof dark.
 *  - elevation 0 (flat Frauenplatz). No lidar (no USGS data in Germany); no
 *    Bavarian 3D city model used.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Frauenkirche_Munich_-_View_from_Peterskirche_Tower.jpg (Diliff,
 *    CC BY 2.5): south-east, from St Peter; the main height and detail
 *    reference (towers cropped at full resolution).
 *  - Frauenkirche_(Munich)_20150830.jpg (Suicasmo, CC BY-SA 4.0): south-east,
 *    the whole roof, frieze and choir hip.
 *  - Frauenkirche_Munich_March_2013.JPG (Martin Falbisoner, CC BY-SA 3.0):
 *    south-east, low sun.
 *  - Frauenkirche_Munich,_March_2018.jpg (Martin Falbisoner, CC BY-SA 4.0):
 *    from the north-east over the roofs.
 *  - Luftbild_Frauenkirche_Liebfrauendom_..._DSC07307.jpg (Wolfgang
 *    Pehlemann, CC BY-SA 3.0 de): aerial from the south; plan, south wall,
 *    the south porch.
 *  - West_facade_of_the_Frauenkirche_Munich.jpg (AuHaidhausen, CC BY 4.0)
 *    and Modell_der_Frauenkirche_vor_der_Frauenkirche.jpg (Ankermast, CC BY
 *    4.0): the west front, portal, central window and gable.
 *  - Frauenkirche_Munich_Tower_WLM_2015.jpg (Jebulon, CC0): a tower's bands
 *    and corner piers.
 *  - Frauenkirche_München_abends.jpg (Thomas Wolf, www.foto-tw.de, CC BY-SA
 *    3.0 de): night.
 * No commercial imagery, no 3D city models. No look-only sources.
 *
 * Left out: the tracery patterns of the friezes (drawn as plain pale
 * bands), the small slit windows of the tower shafts (one per stage kept),
 * the epitaphs, rain pipes, the dome's copper seams, the window tracery.
 *
 * Doubts: the east end and the sacristy are seen only from above and far
 * off; the sacristy roof is drawn from OSM's tags. The lowest three tower
 * bands are spaced, not measured. The dormers are drawn about half as dense
 * as the real ones.
 *
 * This file also holds the kit shared by the builder's other munich-
 * generators (st-peter, altes-rathaus, neues-rathaus); merge it first.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, lathe, rect, save, triangulate, walls, spire, area, type XY } from './chi-aon-center'
import { along, archOn, bbox, discOn, face, ngon, rectOn } from './phl-independence-hall'
import { ball, pointedOn, sidesOf, segsOf } from './amsterdam-westerkerk'

// ---------------------------------------------------------------------------
// Kit for this builder's Munich models.

export const MUNICH_CREDITS = 'OnlyHudson (creator), Claude (Claude Opus 5.5, procedural modeling)'

/** A ring made counter-clockwise. */
export const ccw = (r: XY[]): XY[] => (area(r) < 0 ? [...r].reverse() : r)

/** A square post about (cx, cy), turned by `ang`, from z0 to z1 with a pyramid cap of height `capH` (in `top`). */
export function post(p: Part, top: Part, cx: number, cy: number, half: number, z0: number, z1: number, ang = 0, capH = 0) {
  const r: XY[] = [0, 1, 2, 3].map((k) => {
    const a = ang + Math.PI / 4 + (k * Math.PI) / 2
    return [cx + half * Math.SQRT2 * Math.cos(a), cy + half * Math.SQRT2 * Math.sin(a)] as XY
  })
  walls(p, r, z0, z1)
  if (capH > 0) spire(top, r, z1, [cx, cy, z1 + capH])
  else cap(top, r, z1)
}

/**
 * A pilaster strip standing on a straight wall: from a to b along the wall
 * face, `d` proud on the side `sgn` (the wall's outward y or x sign is not
 * assumed: the strip projects along the wall's outward normal), z0..z1,
 * with a sloped top.
 */
export function strip(p: Part, a: XY, b: XY, sgn: number, d: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
  // outward normal: the perpendicular whose sign matches sgn on the larger axis
  let n: XY = [u[1], -u[0]]
  const big = Math.abs(n[0]) > Math.abs(n[1]) ? 0 : 1
  if (Math.sign(n[big]) !== Math.sign(sgn)) n = [-n[0], -n[1]]
  const o = (q: XY, k: number, z: number): V3 => [q[0] + n[0] * k, q[1] + n[1] * k, z]
  const N: V3 = [n[0], n[1], 0]
  face(p, [o(a, d, z0), o(b, d, z0), o(b, d, z1 - d), o(a, d, z1 - d)], N)
  face(p, [o(a, d, z1 - d), o(b, d, z1 - d), o(b, 0, z1), o(a, 0, z1)], [n[0], n[1], 1])
  face(p, [o(a, 0, z0), o(a, d, z0), o(a, d, z1 - d), o(a, 0, z1)], [-u[0], -u[1], 0])
  face(p, [o(b, 0, z0), o(b, d, z0), o(b, d, z1 - d), o(b, 0, z1)], [u[0], u[1], 0])
}

/**
 * A corner pier of a square tower: the corner (cx, cy) of the core, the
 * pier running `w` along both faces from it and standing `p` proud, z0..z1,
 * its top a sloped weathering. Only the faces that show are drawn.
 */
export function pier(q: Part, cx: number, cy: number, sx: number, sy: number, w: number, p: number, z0: number, z1: number) {
  const X = cx + sx * p, Y = cy + sy * p, xi = cx - sx * (w - p), yi = cy - sy * (w - p)
  const zt = z1 - Math.min(p, 0.35)
  // the face looking along x (normal sx) and the one looking along y (normal sy)
  face(q, [[X, yi, z0], [X, Y, z0], [X, Y, zt], [X, yi, zt]], [sx, 0, 0])
  face(q, [[xi, Y, z0], [X, Y, z0], [X, Y, zt], [xi, Y, zt]], [0, sy, 0])
  // returns at the pier's inner ends
  face(q, [[X, yi, z0], [cx, yi, z0], [cx, yi, z1], [X, yi, zt]], [0, -sy, 0])
  face(q, [[xi, Y, z0], [xi, cy, z0], [xi, cy, z1], [xi, Y, zt]], [-sx, 0, 0])
  // weathering: from the outer edges up to the core line
  face(q, [[X, yi, zt], [X, Y, zt], [cx, cy + sy * p, z1], [cx, yi, z1]], [sx, 0, 1])
  face(q, [[xi, Y, zt], [X, Y, zt], [cx + sx * p, cy, z1], [xi, cy, z1]], [0, sy, 1])
}

/** A band around a ring: walls from z0 to z1 offset `out` outside it, with a top. */
export function band(p: Part, ring: XY[], z0: number, z1: number, out = 0.15, bottom = true) {
  const r = inset(ring, -out)
  walls(p, r, z0, z1)
  cap(p, r, z1)
  if (bottom) cap(p, r, z0, false)
}

/**
 * A shed dormer ("Schleppgaube") on a sloped roof plane. The roof's eave line
 * passes through E with along-unit u and outward unit n (both horizontal);
 * the roof surface at inward distance t is at z0 + s t. The dormer sits at
 * along-position a and depth t0, half-width w, front height h.
 */
export function dormer(roof: Part, front: Part, E: XY, u: XY, n: XY, z0: number, s: number, a: number, t0: number, w: number, h: number) {
  const s2 = s * 0.3, t1 = t0 + h / (s - s2)
  const P = (aa: number, t: number, dz = 0): V3 => [E[0] + u[0] * aa - n[0] * t, E[1] + u[1] * aa - n[1] * t, z0 + s * t + dz]
  const N: V3 = [n[0], n[1], 0]
  face(front, [P(a - w, t0), P(a + w, t0), P(a + w, t0, h), P(a - w, t0, h)], N)
  face(roof, [P(a - w, t0, h), P(a + w, t0, h), P(a + w, t1), P(a - w, t1)], [n[0] * s2, n[1] * s2, 1])
  face(roof, [P(a - w, t0), P(a - w, t0, h), P(a - w, t1)], [-u[0], -u[1], 0])
  face(roof, [P(a + w, t0), P(a + w, t0, h), P(a + w, t1)], [u[0], u[1], 0])
}

/**
 * A roof over a counter-clockwise eave ring at height z0 whose every vertex
 * runs up to a target point on the ridge (`target(v)`), quads or triangles.
 * Edges listed in `skip` (by start index) are left open; `gable` gets the
 * vertical faces where both ends share one target (gable ends).
 */
export function ridgeRoof(roof: Part, gable: Part | null, ring: XY[], z0: number, target: (v: XY, i: number) => V3, skip: number[] = []) {
  const T = ring.map((v, i) => target(v, i))
  for (let i = 0; i < ring.length; i++) {
    if (skip.includes(i)) continue
    const j = (i + 1) % ring.length
    const a: V3 = [ring[i][0], ring[i][1], z0], b: V3 = [ring[j][0], ring[j][1], z0]
    const ti = T[i], tj = T[j]
    const same = Math.hypot(ti[0] - tj[0], ti[1] - tj[1]) < 1e-6
    // Outward-ish normal of this facet: up plus the edge's outward side.
    const ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey)
    const out: XY = [ey / L, -ex / L]
    const vertical = same && Math.abs(ti[0] - (a[0] + b[0]) / 2) < 1e-6 && Math.abs(ti[1] - (a[1] + b[1]) / 2) < 1e-6
    if (vertical) { if (gable) face(gable, [a, b, ti], [out[0], out[1], 0]); continue }
    if (same) face(roof, [a, b, ti], [out[0], out[1], 1])
    else {
      face(roof, [a, b, tj], [out[0], out[1], 1])
      face(roof, [a, tj, ti], [out[0], out[1], 1])
    }
  }
}

/**
 * A prism whose top follows per-vertex heights (a lean-to or sloped cap):
 * walls from z0 to tops[i] on every edge not in `skip`, the top triangulated.
 */
export function slopedPrism(wall: Part, top: Part, ring: XY[], z0: number, tops: number[], skip: number[] = []) {
  for (let i = 0; i < ring.length; i++) {
    if (skip.includes(i)) continue
    const j = (i + 1) % ring.length
    face(wall, [[ring[i][0], ring[i][1], z0], [ring[j][0], ring[j][1], z0], [ring[j][0], ring[j][1], tops[j]], [ring[i][0], ring[i][1], tops[i]]],
      [ring[j][1] - ring[i][1], -(ring[j][0] - ring[i][0]), 0])
  }
  for (const [a, b, c] of triangulate(ring)) face(top, [[ring[a][0], ring[a][1], tops[a]], [ring[b][0], ring[b][1], tops[b]], [ring[c][0], ring[c][1], tops[c]]], [0, 0, 1])
}

/** A clock on wall a→b: a pale ring, a dark dial (`dial`, glows) and gilt hands. */
export function clock(ring: Part, dial: Part, hands: Part, a: XY, b: XY, c: number, z: number, r: number, t1 = 2.2, t2 = 0.1) {
  discOn(ring, a, b, c, z, r, 0.06, 10)
  discOn(dial, a, b, c, z, r * 0.8, 0.1, 10)
  const { P } = along(a, b)
  const hand = (ang: number, Lh: number, w: number) => {
    const ux = Math.cos(ang), uz = Math.sin(ang), px = -uz, pz = ux
    hands.quad(P(c + px * w, z + pz * w, 0.14), P(c - px * w, z - pz * w, 0.14), P(c - px * w + ux * Lh, z - pz * w + uz * Lh, 0.14), P(c + px * w + ux * Lh, z + pz * w + uz * Lh, 0.14))
  }
  hand(Math.PI / 2 - t1, r * 0.72, r * 0.07)
  hand(Math.PI / 2 - t2, r * 0.55, r * 0.09)
}

export { save, rect, lathe, walls, cap, inset, spire, triangulate, area, along, archOn, bbox, discOn, face, ngon, rectOn, ball, pointedOn, sidesOf, segsOf }
export type { XY }

// ---------------------------------------------------------------------------
// Frauenkirche

const YC = -2.15 // the church's axis

function build() {
  const brick = new Part(), tile = new Part(), stone = new Part(), win = new Part(), copper = new Part(), gold = new Part()

  // ------------------------------------------------------------- the hall
  const EAVE = 30.6, FRIEZE0 = 34.2, FRIEZE1 = 36.4, RIDGE = 58.0, CHAPEL = 3.6
  const XW = -39.9 // the towers' east faces
  // Nave and choir, counter-clockwise from the south-west corner.
  const plan: XY[] = [[XW, -21.75], [34.7, -21.75], [48.1, -18.3], [54.15, -9.3], [54.15, 5.0], [48.1, 14.0], [34.7, 17.45], [XW, 17.45]]
  const W = 19.6 // half-width
  // Walls (all but the west edge, which is inside the towers and the
  // central bay), on a pale plinth.
  for (let i = 0; i < plan.length - 1; i++) {
    const a = plan[i], b = plan[i + 1]
    walls(brick, [a, b], 0, EAVE)
    const { P, n } = along(a, b)
    face(stone, [P(0, 0, 0.15), P(along(a, b).L, 0, 0.15), P(along(a, b).L, 1.3, 0.15), P(0, 1.3, 0.15)], [n[0], n[1], 0])
    face(stone, [P(0, 1.3, 0), P(along(a, b).L, 1.3, 0), P(along(a, b).L, 1.3, 0.15), P(0, 1.3, 0.15)], [0, 0, 1])
  }
  // Bays: 11 along each side between the towers and the choir, pilaster
  // strips between them, tall pointed windows; the side portals in bays 1
  // and 7 with the windows starting above them.
  const BAY = (34.7 - XW) / 11
  const S = sidesOf(rect(XW, -21.75, 34.7, 17.45))
  for (const side of ['S', 'N'] as const) {
    const [a, b] = S[side]
    const sgn = side === 'S' ? -1 : 1
    for (let k = 0; k <= 11; k++) {
      const x = XW + k * BAY
      if (k === 0) continue
      const y0 = side === 'S' ? -21.75 : 17.45
      strip(brick, [x - 0.5, y0], [x + 0.5, y0], sgn, 0.3, 1.3, EAVE - 0.6)
    }
    for (let k = 0; k < 11; k++) {
      const x = XW + (k + 0.5) * BAY
      const s = side === 'S' ? x - XW : 34.7 - x
      const portal = k === 1 || k === 7
      pointedOn(win, a, b, s, 1.25, portal ? 12.5 : 7.5, 27.0, 0.06, 4)
      if (k === 1) {
        // The flush Donatus / north-west portals: a pale pointed surround.
        pointedOn(stone, a, b, s, 1.9, 0, 6.2, 0.04, 5)
        pointedOn(brick, a, b, s, 1.4, 0, 6.2, 0.08, 5)
      } else if (portal) {
        // A pale stone porch with a small gabled hood.
        const y0 = side === 'S' ? -21.75 : 17.45, d = 0.9
        const ya = side === 'S' ? y0 - d : y0, yb = side === 'S' ? y0 : y0 + d
        bbox(stone, stone, x - 2.7, ya, x + 2.7, yb, 0, 8.6, 0.1)
        const yo = y0 + sgn * (d + 0.25)
        face(tile, [[x - 3.0, yo, 8.4], [x + 3.0, yo, 8.4], [x, yo, 10.6]], [0, sgn, 0])
        face(tile, [[x - 3.0, yo, 8.4], [x, yo, 10.6], [x, y0, 10.6], [x - 3.0, y0, 8.4]], [-1, 0, 1])
        face(tile, [[x + 3.0, yo, 8.4], [x + 3.0, y0, 8.4], [x, y0, 10.6], [x, yo, 10.6]], [1, 0, 1])
        const yf = y0 + sgn * d
        const P2: [XY, XY] = side === 'S' ? [[x - 3, yf], [x + 3, yf]] : [[x + 3, yf], [x - 3, yf]]
        pointedOn(brick, P2[0], P2[1], 3.0, 1.35, 0, 4.6, 0.04, 5)
      }
    }
  }
  // The choir: two windows per facet, pilasters at the corners.
  for (let i = 1; i <= 5; i++) {
    const a = plan[i], b = plan[i + 1], { L, P, n } = along(a, b)
    const k = Math.max(1, Math.round(L / BAY))
    for (let q = 0; q < k; q++) {
      const s = (L * (q + 0.5)) / k
      pointedOn(win, a, b, s, 1.2, 7.5, 27.0, 0.06, 4)
    }
    void P, n
  }
  for (let i = 1; i <= 6; i++) {
    const c = plan[i]
    bbox(brick, brick, c[0] - 0.55, c[1] - 0.55, c[0] + 0.55, c[1] + 0.55, 1.3, EAVE - 0.6, 0.15)
  }

  // Schleppdach over the chapel ring, the tuff frieze, the main roof.
  const ringOut = inset(plan, -0.6), ringIn = inset(plan, CHAPEL)
  for (let i = 0; i < plan.length - 1; i++) {
    const j = i + 1
    const a0: V3 = [ringOut[i][0], ringOut[i][1], EAVE - 0.45], b0: V3 = [ringOut[j][0], ringOut[j][1], EAVE - 0.45]
    const a1: V3 = [ringIn[i][0], ringIn[i][1], FRIEZE0], b1: V3 = [ringIn[j][0], ringIn[j][1], FRIEZE0]
    const { n } = along(plan[i], plan[j])
    face(tile, [a0, b0, b1, a1], [n[0], n[1], 1.2])
    face(tile, [a0, b0, [b0[0], b0[1], b0[2] + 0.3], [a0[0], a0[1], a0[2] + 0.3]], [n[0], n[1], 0])
    // The frieze: a pale band standing on the chapel line.
    face(stone, [[ringIn[i][0], ringIn[i][1], FRIEZE0 - 0.2], [ringIn[j][0], ringIn[j][1], FRIEZE0 - 0.2], [ringIn[j][0], ringIn[j][1], FRIEZE1], [ringIn[i][0], ringIn[i][1], FRIEZE1]], [n[0], n[1], 0])
  }
  // The Schleppdach's ends against the towers.
  for (const [o, ii] of [[ringOut[0], ringIn[0]], [ringOut[7], ringIn[7]]] as [XY, XY][]) {
    face(tile, [[XW, o[1], EAVE - 0.45], [XW, ii[1], FRIEZE0], [XW, ii[1], EAVE - 0.45]], [1, 0, 0])
  }
  // Main roof: gabled between the towers (its gable at x -46.8), hipped
  // round the choir. The eave overhangs the frieze by 0.4 m.
  const XG = -46.8
  const mainPlan: XY[] = [[XG, -21.75 + CHAPEL - 0.4], ...inset(plan, CHAPEL - 0.4).slice(1, 7), [XG, 17.45 - CHAPEL + 0.4]]
  const B = W - CHAPEL + 0.4, MZ = FRIEZE1 - 0.3, slope = (RIDGE - MZ) / B
  const XE = Math.max(...mainPlan.map((v) => v[0])) - B
  ridgeRoof(tile, null, mainPlan, MZ, (v, i) => {
    if (i === 0 || i === mainPlan.length - 1) return [XG, YC, RIDGE]
    if (i >= 2 && i <= 5) return [XE, YC, RIDGE]
    return [Math.min(Math.max(v[0], XG), XE), YC, RIDGE]
  })
  // The roof's eave lip, so its edge reads over the frieze.
  for (let i = 0; i < mainPlan.length - 1; i++) {
    const a = mainPlan[i], b = mainPlan[i + 1], { n } = along(a, b)
    face(tile, [[a[0], a[1], MZ - 0.35], [b[0], b[1], MZ - 0.35], [b[0], b[1], MZ], [a[0], a[1], MZ]], [n[0], n[1], 0])
  }
  // Dormers: four rows on each long side (staggered, about half as dense
  // as the real ones), one row on the Schleppdach, a few on the choir hip.
  const rows = [[3.0, 7.0, 0], [7.6, 7.0, 0.5], [12.2, 7.0, 0]]
  for (const side of [-1, 1]) {
    const E: XY = [XG, YC + side * B], u: XY = [side < 0 ? 1 : -1, 0], n: XY = [0, side]
    const x0 = -37.5, x1 = 32.0
    for (const [t, step, off] of rows) {
      for (let x = x0 + off * step; x <= x1; x += step) {
        const a = side < 0 ? x - XG : XG - x
        dormer(tile, brick, E, u, n, MZ, slope, a, t, 0.75, 0.75)
      }
    }
    // One row on the Schleppdach.
    const sSlope = (FRIEZE0 - (EAVE - 0.45)) / (CHAPEL + 0.6)
    const Es: XY = [XW, side < 0 ? -21.75 - 0.6 : 17.45 + 0.6]
    for (let x = -36.2; x <= 33; x += BAY) {
      const a = side < 0 ? x - XW : XW - x
      dormer(tile, brick, Es, u, n, EAVE - 0.45, sSlope, a, 1.8, 0.6, 0.55)
    }
  }
  {
    // The choir's east facet: two rows.
    const a = mainPlan[3], b = mainPlan[4], { u, n, L } = along(a, b)
    for (const [t, ss] of [[3.0, [L * 0.33, L * 0.67]], [8.0, [L * 0.5]]] as [number, number[]][])
      for (const s of ss) dormer(tile, brick, a, u, n, MZ, slope, s, t, 0.75, 0.75)
  }

  // ---------------------------------------------------- the west front
  // Central bay between the towers, the porch with the main portal, the
  // great west window, the roof's gable wall set back above.
  const YS = -6.55, YN = 2.25
  walls(brick, rect(-51.5, YS, XW, YN), 0, 34.0)
  cap(tile, rect(-51.5, YS, XG, YN), 34.0)
  bbox(stone, null, -51.75, YS, -51.5 + 0.2, YN, 33.4, 34.2, 0.1)
  face(brick, [[XG, YS, 34.0], [XG, YN, 34.0], [XG, YN, MZ + (B - (YN - YC)) * slope], [XG, YC, RIDGE], [XG, YS, MZ + (B - (YC - YS)) * slope]], [-1, 0, 0])
  const WF: [XY, XY] = [[-51.5, YN], [-51.5, YS]]
  pointedOn(stone, WF[0], WF[1], (YN - YS) / 2, 1.95, 16.6, 27.0, 0.03, 6)
  pointedOn(win, WF[0], WF[1], (YN - YS) / 2, 1.7, 16.9, 27.0, 0.06, 6)
  // Porch: 13 m, skillion roof rising to the wall.
  walls(brick, [[-51.5, YN], [-55.1, YN], [-55.1, YS], [-51.5, YS]], 0, 13.0)
  face(tile, [[-55.4, YS, 12.9], [-51.5, YS, 14.6], [-51.5, YN, 14.6], [-55.4, YN, 12.9]], [-0.4, 0, 1])
  face(brick, [[-55.1, YS, 13.0], [-51.5, YS, 13.0], [-51.5, YS, 14.6]], [0, 1, 0])
  face(brick, [[-55.1, YN, 13.0], [-51.5, YN, 13.0], [-51.5, YN, 14.6]], [0, -1, 0])
  const PF: [XY, XY] = [[-55.1, YN], [-55.1, YS]]
  pointedOn(stone, PF[0], PF[1], (YN - YS) / 2, 3.3, 0, 7.0, 0.04, 8)
  pointedOn(stone, PF[0], PF[1], (YN - YS) / 2, 2.9, 0, 7.0, 0.1, 8)
  rectOn(brick, PF[0], PF[1], (YN - YS) / 2, 1.5, 0, 4.6, 0.14)

  // ------------------------------------------------------------ the towers
  const BANDS = [7.5, 14.5, 21.2, 28.0, 35.0, 42.1, 50.2, 58.2]
  const PROJ = [0.8, 0.7, 0.6, 0.5, 0.42, 0.34, 0.26, 0.18]
  const H = 6.8, PIER = 3.2, ZS = 60.0
  const tower = (cx: number, cy: number, outer: 'S' | 'N', top: number) => {
    // Core shaft to the cornice.
    const core = rect(cx - H, cy - H, cx + H, cy + H)
    walls(brick, core, 0, ZS)
    bbox(stone, null, cx - H - 0.95, cy - H - 0.95, cx + H + 0.95, cy + H + 0.95, 0, 1.3, 0.1)
    // Corner piers, stepping in at every band, with pale tracery panels on
    // their faces under each band and a thin pale frieze across the core.
    let z = 1.3
    BANDS.forEach((zb, k) => {
      const p = PROJ[k]
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const xa = cx + sx * (H - PIER), xb = cx + sx * (H + p)
        const ya = cy + sy * (H - PIER), yb = cy + sy * (H + p)
        pier(brick, cx + sx * H, cy + sy * H, sx, sy, PIER, p, z, zb)
        // tracery panels on the two outer faces
        const zp0 = zb - 1.5, zp1 = zb - 0.35
        const X = cx + sx * (H + p + 0.04), Y = cy + sy * (H + p + 0.04)
        face(stone, [[X, Math.min(ya, yb) + 0.15, zp0], [X, Math.max(ya, yb) - 0.15, zp0], [X, Math.max(ya, yb) - 0.15, zp1], [X, Math.min(ya, yb) + 0.15, zp1]], [sx, 0, 0])
        face(stone, [[Math.min(xa, xb) + 0.15, Y, zp0], [Math.max(xa, xb) - 0.15, Y, zp0], [Math.max(xa, xb) - 0.15, Y, zp1], [Math.min(xa, xb) + 0.15, Y, zp1]], [0, sy, 0])
      }
      if (k < BANDS.length - 1) for (const [a, b] of segsOf(core)) rectOn(stone, a, b, H, H - PIER, zb - 0.9, zb - 0.35, 0.06)
      z = zb
    })
    // Openings: the great pointed windows of the lowest stage on the west
    // and outer faces (the small slit windows above are left out).
    const F = sidesOf(core)
    for (const k of ['W', 'S', 'N', 'E'] as const) {
      const [a, b] = F[k]
      if (k === 'W' || k === outer) {
        pointedOn(stone, a, b, H, 1.75, 4.6, 12.0, 0.04, 6)
        pointedOn(win, a, b, H, 1.45, 4.9, 12.0, 0.08, 6)
      }
    }
    // Cornice and the four corner pinnacles of the square top.
    bbox(stone, stone, cx - H - 0.4, cy - H - 0.4, cx + H + 0.4, cy + H + 0.4, 58.4, ZS, 0.15)
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) post(brick, stone, cx + sx * (H - 0.3), cy + sy * (H - 0.3), 0.45, ZS, 61.2, 0, 1.7)

    // The octagon.
    const FL = 5.95, R8 = FL / Math.cos(Math.PI / 8)
    const oct = (f: number) => ngon(cx, cy, f / Math.cos(Math.PI / 8), 8)
    const o = oct(FL)
    walls(brick, o, ZS, 87.4)
    // Corner buttresses with little pinnacles.
    for (let i = 0; i < 8; i++) {
      const ang = Math.PI / 8 + (i * Math.PI) / 4
      post(brick, stone, cx + (R8 - 0.1) * Math.cos(ang), cy + (R8 - 0.1) * Math.sin(ang), 0.62, ZS, 81.0, ang, 1.6)
    }
    band(stone, o, 70.2, 71.0, 0.18, false)
    band(stone, o, 81.0, 81.9, 0.12, false)
    // Cornice under the dome.
    walls(stone, oct(FL + 0.1), 86.6, 87.0)
    walls(stone, oct(FL + 0.1), 87.0, 87.4, oct(FL + 0.4))
    cap(stone, oct(FL + 0.4), 87.4)
    cap(stone, oct(FL + 0.1), 86.6, false)
    segsOf(o).forEach(([a, b], i) => {
      const L = along(a, b).L
      // Odd edges face the axes: clocks and the belfry windows.
      if (i % 2 === 1) {
        clock(stone, win, gold, a, b, L / 2, 65.3, 1.8, 2.3, 0.2)
        pointedOn(stone, a, b, L / 2, 1.05, 72.7, 77.4, 0.04, 5)
        pointedOn(win, a, b, L / 2, 0.83, 72.9, 77.4, 0.08, 5)
      }
      // The ring of small round-arched windows.
      for (const d of [-1.3, 0, 1.3]) archOn(win, a, b, L / 2 + d, 0.36, 83.0, 84.9, 0.06, 4)
    })
    // The welsche Haube: fuller than a hemisphere, widest low down.
    const z0 = 87.4
    lathe(copper, cx, cy, [[5.95, z0], [6.3, z0 + 1.2], [6.38, z0 + 2.5], [6.1, z0 + 4.1], [4.8, z0 + 5.75], [2.8, z0 + 7.05], [1.3, z0 + 7.7], [0.32, z0 + 8.15], [0, z0 + 8.2]], 16)
    // Stem, gilt ball, short spike.
    lathe(copper, cx, cy, [[0.3, z0 + 8.1], [0.2, z0 + 9.3], [0, z0 + 9.45]], 8)
    ball(gold, cx, cy, top - 0.95, 0.65, 10)
    lathe(gold, cx, cy, [[0.1, top - 0.35], [0, top]], 6)
  }
  tower(-47.5, -14.15, 'S', 98.45)
  tower(-47.5, 9.85, 'N', 98.57)

  // ------------------------------------------------------- the sacristy
  // North-east of the choir (OSM 108429818): walls to 15.5 m, a lean-to
  // roof rising to 21 m against the church.
  {
    const ring: XY[] = [[34.6, 17.45], [13.1, 17.45], [13.1, 23.7], [36.0, 23.9], [50.8, 18.8], [55.7, 13.6], [50.4, 9.0], [46.5, 13.6]]
    const inner = [true, true, false, false, false, false, true, true]
    const r = ccw(ring), inn = area(ring) < 0 ? [...inner].reverse() : inner
    const tops = inn.map((x) => (x ? 21.0 : 15.5))
    const skip = r.map((_, i) => (inn[i] && inn[(i + 1) % r.length] ? i : -1)).filter((i) => i >= 0)
    slopedPrism(brick, tile, r, 0, tops, skip)
    // Windows on the outer walls.
    r.forEach((a, i) => {
      if (skip.includes(i)) return
      const b = r[(i + 1) % r.length], L = along(a, b).L
      if (L < 6) return
      const k = Math.round(L / 6)
      for (let q = 0; q < k; q++) pointedOn(win, a, b, (L * (q + 0.5)) / k, 0.9, 4.5, 10.5, 0.06, 4)
    })
  }

  const tw = (p: V3) => p[0] < -38
  const floodBrick = (p: V3, n: V3) => (n[2] > 0.7 ? 0.2 : tw(p) ? 1 : p[2] < EAVE ? 0.55 : 0.2)
  const floodStone = (p: V3, n: V3) => (n[2] > 0.7 ? 0.3 : tw(p) ? 1 : 0.6)
  const floodDome = (p: V3, n: V3) => (n[2] > 0.85 ? 0.35 : 0.85)
  return [
    { part: brick, material: { ...finish('frauenkirche-brick', 0x97705b), floodlight: floodBrick } },
    { part: tile, material: finish('frauenkirche-tile', 0xcd7550) },
    { part: stone, material: { ...finish('frauenkirche-tuff', 0xeae0cf), floodlight: floodStone } },
    { part: win, material: { ...PALETTE.window } },
    { part: copper, material: { ...finish('frauenkirche-copper', 0x67a08c), floodlight: floodDome } },
    { part: gold, material: { ...finish('frauenkirche-gilt', 0xd8ad45, 0.45), floodlight: floodDome } },
  ]
}

if (import.meta.main) await save('munich-frauenkirche', 'Frauenkirche', [48.138593, 11.573598], -1, build(), 6500)
