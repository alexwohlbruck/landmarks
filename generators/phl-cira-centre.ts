/**
 * Cira Centre, Philadelphia (Pelli Clarke Pelli, 2005) — original
 * procedural geometry, CC0-1.0.
 * bun generators/phl-cira-centre.ts
 *
 * Map frame, turned to the building: +x runs along the tower's long axis
 * (east-south-east, along Arch Street), +y north-north-east, z up, metres.
 * BEARING 9.0: the long edges of the OSM outline run at 98.4 and 279.2
 * degrees and the west edge at 9.1. Origin = area centroid of the OSM outline
 * way/333367697 (-75.182432, 39.957332), on the ground.
 *
 * Form. A silver-blue glass prism, 78 x 38 m in plan, whose top and two
 * opposite corners are cut by sloping planes, so its outline changes from
 * every side:
 * - the roof is two sloping glass planes meeting at a ridge that climbs from
 *   the west end (126 m) to the apex over the east end (139 m);
 * - the north-west corner is cut by a triangular facet that runs from the
 *   roof down to a point at the foot of the corner (from the north the west
 *   end reads as a face wide at the top and tapering to the ground);
 * - the south-east corner is cut the same way, from the apex down to the
 *   foot of the south-east corner (from the south, a tall triangle wide at
 *   the top on the right; from the north-east, the east face narrows to the
 *   apex).
 * Everything else is vertical. The model is a convex solid: four vertical
 * faces, two corner facets and two roof planes.
 *
 * Evidence
 * - OSM way/333367697 (Cira Centre, height 133, 29 levels, glass walls and
 *   roof, wikidata Q5121334). Replaced. The OSM outline was traced at roof
 *   level: its north-west and south-east chamfers are the tops of the corner
 *   facets, not the ground plan (lidar below).
 * - USGS 3DEP lidar USGS_LPC_DE_DelawareValley_HD_2015_LAS_2017 (flown
 *   2015), 0.5 m grid read in this frame (tools/lidar_frame.py). z = 0 is
 *   the rail-cut ground on the west side (3.0 m above the box minimum), the
 *   lowest ground under the footprint; Arch Street on the east and south is
 *   6.5 m higher. Measured, above z = 0: plan W x -40, E x 37.8, S y -18.8,
 *   N y 19.2; apex 139.3 at (37.8, 1.5); ridge's west end 126 at (-40, -5);
 *   roof corners SW 117, NE 125, the north-west facet's top edge from
 *   (-40, -2.5, 125) to (-29.5, 19.2, 119), the south-east facet's from the
 *   apex to (20, -18.8, 128). Both facets fall to within a few metres of the
 *   ground at their corners (the lidar sees them as surfaces sloping out and
 *   down). Apex minus Arch Street = 132.8 m, against the published 133 m.
 * - Published: 437 ft (133 m), 29 storeys, Pelli Clarke Pelli, completed
 *   2005; LED lighting built into the curtain wall (Wikipedia, "Cira
 *   Centre").
 * - Mapterhorn terrain: the site falls about 8 m from Arch Street (east) to
 *   the rail cut (west). Ordinary sloped site, elevation 0: the east walls
 *   sink into the ground as the map stands the model on the lowest point.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "Cira Centre, Philadelphia-south.JPG", Jeffrey M. Vinocur, CC BY 2.5
 *   (south: the roof plane, the south face's sloping top, the SE facet)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre,_Philadelphia-south.JPG
 * - "Cira Centre, Philadelphia-north.JPG", Jeffrey M. Vinocur, CC BY 2.5
 *   (north: north face falling to the west, the NW facet tapering down)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre,_Philadelphia-north.JPG
 * - "Cira Centre, Philadelphia-east.JPG", Jeffrey M. Vinocur, CC BY 2.5
 *   (north-east: the east face narrowing to the apex)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre,_Philadelphia-east.JPG
 * - "Cira Centre a.jpg", "b.jpg", "c.jpg", "d.jpg", Wobbanight, CC0 (from
 *   the Schuylkill's east bank, glass colour)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre_c.jpg
 * - "Cira Centre, Philadelphia.jpg", AbhiramJuvvadi, CC BY-SA 4.0 (south)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre,_Philadelphia.jpg
 * - "Cira Centre (53590496644).jpg", ajay_suresh, CC BY 2.0 (sunlit glass)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre_(53590496644).jpg
 * - "30th Street Station and Cira Tower.jpg", Ii2nmd, CC BY-SA 4.0 (south)
 *   https://commons.wikimedia.org/wiki/File:30th_Street_Station_and_Cira_Tower.jpg
 * - "Cira Centre south elevation.png", Lucius Kwok, CC BY 2.5 (diagram)
 *   https://commons.wikimedia.org/wiki/File:Cira_Centre_south_elevation.png
 * - "Ciracentre atnight.jpg", michaelwm25, CC BY 2.0 (night: the blue LED
 *   grid on the curtain wall, lit office floors, the lit lobby)
 *   https://commons.wikimedia.org/wiki/File:Ciracentre_atnight.jpg
 *
 * Estimated: the curtain-wall lines (verticals about every 9.7 m, floor lines
 * every four storeys, 17.6 m) are drawn as faint lines a step lighter than
 * the glass, per the batch notes; the facets carry no lines; the corner
 * facets are taken to the ground at the corner (lidar loses them in the last
 * few metres).
 *
 * Colours (daylight photos, pulled to the palette's lightness): the curtain
 * wall a silver sky blue (window-2 #8aa5c4), between the deep blue of
 * overcast shots and the pale sky of sunlit ones; the glass roof pale (glass);
 * the roof edges a pale silver.
 *
 * Night: the curtain wall is office glazing and glows (window-2). The facade
 * carries a grid of LEDs (blue in the night photo, other colours for shows);
 * the faint lines are `neon-cira-led` in a pale LED blue (#9db3e4), so the tower reads as a
 * blue grid at night. The glass roof stays dark (glass).
 *
 * Doubts: the LED shows change colour; blue is the colour of the one licensed
 * night photo. The small glass pyramid at the Arch Street entrance and the
 * skybridge to the station (way/333367695) are not part of this model.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { facePanel, saveTower, type P2 } from './phl-comcast-center'

const BEARING = 9.0
const ANCHOR = { lng: -75.182432, lat: 39.957332 }

const wall = new Part()  // curtain wall (window-2)
const led = new Part()   // faint lines carrying the LED grid (neon)
const roof = new Part()  // glass roof planes (glass)
const edge = new Part()  // pale silver roof edges

// ---------- measured geometry (lidar, this frame) ----------
const W = -40, E = 37.8, S = -18.8, N = 19.2
const APEX: V3 = [E, 1.5, 139.3]
const RW: V3 = [W, -5, 126]       // ridge, west end
const SW: V3 = [W, S, 117]
const SC: V3 = [20, S, 128]       // top of the south-east facet on the south face
const NE: V3 = [E, N, 125]
const NC: V3 = [-29.5, N, 119]    // top of the north-west facet on the north face
const WC: V3 = [W, -2.5, 125]     // top of the north-west facet on the west face
const gSW: V3 = [W, S, 0], gSE: V3 = [E, S, 0], gNE: V3 = [E, N, 0], gNW: V3 = [W, N, 0]

const CENTRE: V3 = [0, 0, 60]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A flat convex face, fanned and wound to face away from the solid's centre. */
function face(part: Part, pts: V3[]) {
  const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length] as V3, [0, 0, 0] as V3)
  const n: V3 = [0, 0, 0] // Newell normal: robust for near-collinear first corners
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]) }
  const q = dot(n, sub(c, CENTRE)) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) part.tri(q[0], q[i], q[i + 1])
}

// ---------- the solid ----------
face(wall, [gSW, gSE, SC, SW])                 // south face
face(wall, [gSE, gNE, NE, APEX])               // east face
face(wall, [gNE, gNW, NC, NE])                 // north face
face(wall, [gNW, gSW, SW, RW, WC])             // west face
face(wall, [gSE, APEX, SC])                    // south-east facet
face(wall, [gNW, WC, NC])                      // north-west facet
face(roof, [RW, SW, SC, APEX])                 // south roof plane
face(roof, [WC, RW, APEX, NE, NC])             // north roof plane
face(wall, [gSW, gNW, gNE, gSE])               // underside (never seen; keeps the solid closed)

// ---------- roof edges: a thin pale lip round both roof planes and the ridge ----------
function rail(a: V3, b: V3, w = 0.7, h = 0.6) {
  // a small square-section bar from a to b, lying on the roof edge
  const d = sub(b, a), l = Math.hypot(...d)
  const t: V3 = [d[0] / l, d[1] / l, d[2] / l]
  let s = cross(t, [0, 0, 1]); const sl = Math.hypot(...s) || 1; s = [s[0] / sl, s[1] / sl, s[2] / sl]
  const u = cross(s, t)
  const ring = (p: V3): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) =>
    [p[0] + s[0] * i * w / 2 + u[0] * (j * h / 2 + h / 4), p[1] + s[1] * i * w / 2 + u[1] * (j * h / 2 + h / 4), p[2] + s[2] * i * w / 2 + u[2] * (j * h / 2 + h / 4)] as V3)
  const r0 = ring(a), r1 = ring(b)
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const pts = [r0[i], r0[j], r1[j], r1[i]]
    const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
    const mc: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
    const fc = pts.reduce((q, p) => [q[0] + p[0] / 4, q[1] + p[1] / 4, q[2] + p[2] / 4] as V3, [0, 0, 0] as V3)
    const q = dot(n, sub(fc, mc)) < 0 ? [...pts].reverse() : pts
    edge.tri(q[0], q[1], q[2]); edge.tri(q[0], q[2], q[3])
  }
}
for (const [a, b] of [[SW, SC], [SC, APEX], [APEX, NE], [NE, NC], [NC, WC], [WC, RW], [RW, SW], [RW, APEX]] as [V3, V3][]) rail(a, b)

// ---------- faint curtain-wall lines (the LED grid) on the four vertical faces ----------
type Q = [number, number] // (s along the face, z)
function interval(poly: Q[], axis: 0 | 1, v: number): [number, number] | null {
  // where the line {axis = v} crosses a convex polygon: returns the other coordinate's range
  const o = 1 - axis, hits: number[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if ((a[axis] - v) * (b[axis] - v) <= 0 && a[axis] !== b[axis]) hits.push(a[o] + (b[o] - a[o]) * (v - a[axis]) / (b[axis] - a[axis]))
  }
  return hits.length < 2 ? null : [Math.min(...hits), Math.max(...hits)]
}
const FLOOR = 4.4, LINE = 0.7, INSET = 1.2
function lines(a: P2, b: P2, poly: Q[], z0: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.round(L / 9.7)
  for (let i = 1; i < n; i++) {
    const s = (i * L) / n, r = interval(poly, 0, s)
    if (!r) continue
    facePanel(led, a, b, (s - LINE / 2) / L, (s + LINE / 2) / L, Math.max(r[0], z0), r[1] - INSET, 0.05)
  }
  for (let z = z0 + FLOOR * 4; z < 140; z += FLOOR * 4) {
    const r = interval(poly, 1, z)
    if (!r || r[1] - r[0] < 4) continue
    facePanel(led, a, b, (r[0] + INSET) / L, (r[1] - INSET) / L, z - LINE / 2, z + LINE / 2, 0.05)
  }
}
const lenEW = E - W, lenNS = N - S
lines([W, S], [E, S], [[0, 0], [lenEW, 0], [SC[0] - W, SC[2]], [0, SW[2]]], 6.5)
lines([E, S], [E, N], [[0, 0], [lenNS, 0], [lenNS, NE[2]], [APEX[1] - S, APEX[2]]], 6.5)
lines([E, N], [W, N], [[0, 0], [lenEW, 0], [E - NC[0], NC[2]], [0, NE[2]]], 6.5)
lines([W, N], [W, S], [[0, 0], [lenNS, 0], [lenNS, SW[2]], [N - RW[1], RW[2]], [N - WC[1], WC[2]]], 6.5)

await saveTower('phl-cira-centre', 'Cira Centre', [
  { part: wall, material: windowVariant(2, 0x8aa5c4) },
  { part: led, material: finish('neon-cira-led', 0x9db3e4) },
  { part: roof, material: PALETTE.glass },
  { part: edge, material: finish('cira-silver', 0xd6dbde) },
], { bearing: BEARING, anchor: ANCHOR, height: APEX[2], replaces: ['way/333367697'] })
