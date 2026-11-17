/**
 * Petco Park, San Diego: the Padres' ballpark in East Village (HOK Sport with
 * Antoine Predock, opened 2004). An open bowl of navy seats under a thin
 * white steel canopy, wrapped in sandstone-clad buildings and towers with
 * staggered slot windows; white lattice light towers on the canopy and on
 * the two tall sandstone towers at the foul-line corners; the 1909 brick
 * Western Metal Supply Co. building built into the left-field corner, with
 * the left-field video board beside it; the right-field board and its light
 * tower on the back of the right-field stand. Original procedural geometry,
 * CC0-1.0.  bun generators/sd-petco-park.ts
 *
 * Stadium rule (STYLE.md "Ground"): the model is the stands, roofs, towers
 * and the buildings round them. The field is the map's; nothing is drawn
 * inside the field ring.
 *
 * Frame: bearing 0 (the park sits square on the downtown street grid: 7th
 * Avenue on the west, K Street on the north, Park Boulevard on the east,
 * Imperial Avenue and the rail line on the south). x east, y north, z up,
 * metres. Origin = the lead's anchor -117.15687, 32.70718 (inside the field,
 * 10 m from the centroid of the outline's outer way). Home plate is at the
 * south (-17.5, -30), centre field to the north; the bowl is symmetric about
 * x = -16.5.
 *
 * Ground and elevation: y = 0 is the lowest ground under the outline, about
 * 3.4 m NAVD88 at the south-west corner (7th and Imperial), from the lidar
 * ground and the map's Mapterhorn terrain (which agree within 0.2 m). Every
 * lidar height below is "above ground_min" (2.52 m NAVD88) minus DZ = 0.9.
 * The field is at 4.7 m NAVD88, so 1.3 m above y = 0: it is level with the
 * streets on the south and west and about 4 m below K Street on the north.
 * It is not a sunken bowl (the site slopes up to the north-east), so
 * elevation stays 0 and the stands' outer walls on the K Street and Park
 * Boulevard sides simply run down into the slope.
 *
 * Evidence
 * - OSM: relation/1779874 (building=stadium; outer way/24616919 "Petco Park",
 *   leisure=stadium; inner way/37121669, the field, used here as the line
 *   where the lower bowl stops); way/613165145 (building:part, the stands,
 *   6 levels, stone, mapped from imagery); way/769800588 (Western Metal
 *   Supply Co. Building, 4 levels, brick; its height=8 tag is wrong, the
 *   lidar roof is 24 m).
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014, ten years after the
 *   park opened), 1 m grid, sampled in this frame
 *   (~/landmarks-scratch/sd/work/sd-petco-park/lidar.json). Measured:
 *   the canopy's outer edge all round (the BACK polyline, radial sections
 *   every 10 degrees from (-16.5, 10)), canopy top 41.7, canopy depth 12;
 *   upper deck seats 29.6 at the back to 22.4 at the front, 24 m from the
 *   back edge; club ledge 13.3 at 24-28 m; lower bowl 5.6 down to 1.7 at
 *   the field ring; the canopy light banks on the west and east (26 m long,
 *   tops 55.3) and the two diagonal ones behind home (15 m, 55.3); the two
 *   foul-corner sandstone towers, square plans turned 45 degrees about
 *   (-84.2, -29.5) and (51.2, -28), sandstone tops 47.1, lattice to 60,
 *   lamp banks to 64.5; the tall south tower (a 10.5 x 8.7 m plan turned
 *   -31 degrees) to 43.6 with its lattice crown; the sandstone wings at 23.6
 *   (outer strips) and 14 (inner decks), stair blocks 32-34; Western Metal
 *   roof 24.1 with its rooftop shade to 29.5; the left-field video board,
 *   34 m long on the diagonal (-90.5, 93.5)-(-67.5, 117.5), top 43.1, lamp
 *   bank to 62; the right-field stand (rake 3.4 to 9.1, step, 16.1 to 25.1)
 *   and its board on the diagonal at v = 124, top 37.1, light tower 57.8.
 * - Published (Wikipedia, "Petco Park"; Padres): opened 2004; architects
 *   HOK Sport and Antoine Predock; sandstone from India; the Western Metal
 *   Supply Co. building (1909) kept as the left-field corner with seats on
 *   its roof; 2015 left-field video board 61.6 x 123.7 ft (18.8 x 37.7 m).
 * - USGS NAIP orthophoto (plan, roof colours, seat colour).
 * - Photos (Wikimedia Commons), all EVIDENCE:
 *   "Petco Park, San Diego.jpg" (Bernard Gagnon, CC BY-SA 3.0; from the
 *     rail line on the south: the tall south tower and its lattice crown,
 *     the white steel frame and canopy, the corner towers with their light
 *     rigs, the sandstone wings and slot windows);
 *   "PetcoPark.jpg" (Aude, CC BY 2.0, 2004; from the convention centre on
 *     the south-west);
 *   "East Village, San Diego, CA, USA - panoramio (2).jpg" and "(3).jpg"
 *     (Mountain Mike Johans..., CC BY 3.0; from above the north-west: the
 *     Western Metal building, its painted SUPPLY CO. band and rooftop deck,
 *     the left-field board and the sandstone stair tower);
 *   "East Village, San Diego, CA, USA - panoramio (19).jpg" (Roman
 *     Eugeniusz, CC BY-SA 3.0; the left-field board and sandstone base from
 *     the street);
 *   "Petco Park altitude.jpg" (CC BY 2.0, Flickr), "PetcoBallParkByPhil
 *     Konstantin.jpg" (Phil Konstantin, CC BY-SA 3.0; aerial from the
 *     north-east), "Petco Park from above.jpg" (thegordons, CC BY-SA 2.0;
 *     from the north-east over the right-field board);
 *   "Petco Park dbj.jpg" (Luciof, CC BY-SA 3.0), "Petco-Park.jpg" (Allan
 *     Ferguson, CC BY 2.0; the steel frame and lettering on the east);
 *   "Petco Park San Diego 02.jpg" and "04.jpg" (GualdimG, CC BY-SA 4.0;
 *     inside, the canopy, decks and corner towers), "Petco park.jpg"
 *     (Lahti213, CC BY-SA 4.0), "Petco Park 2024.jpg" (IvanL04, CC0);
 *   "WCNA16 - San Diego Public Library 88.jpg" and "91.jpg" (Mitchazenia,
 *     CC BY-SA 4.0; the right-field board and light tower from behind);
 *   "PetcoParkNight.jpg" (Jamie Lantzy, CC BY-SA 3.0; night).
 *
 * Estimated from the photos: the outer face of the stands as a dark recess
 * behind white columns, concourse floor bands and chevron braces; the
 * canopy fascia depth; the light rigs as A-frames under white-framed lamp
 * banks, the lamps a grid of grey `window` panels that glow at night; the
 * corner towers' lattice cages; the slot windows' size and staggered
 * pattern; the sandstone colour (a warm, mid brown-tan averaged from the
 * variegated stone in the Gagnon and Aude photos); Western Metal's window bays and its black sign band (drawn as a
 * plain dark band, no lettering); the boards' screen extents. The
 * right-field stand's ends and the outfield bleachers are simplified.
 *
 * Doubts: the lidar is from 2014; later changes (the 2015 left-field board
 * replaced an older one in the same place; seating changes in the outfield
 * since) are drawn from the post-2015 photos. The east (Park Boulevard)
 * side has fewer photos than the south and west.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { beam, box, ccw, earcut, prism, report, type XY } from './sf-de-young'
import { panel } from './sf-opera-house'

const DZ = 0.9 // lidar "above ground_min" to model z
const L = (h: number) => h - DZ

const sand = new Part(), white = new Part(), seats = new Part(), brick = new Part(), win = new Part(), shade = new Part()

const sub2 = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
const nrm2 = (a: XY): XY => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l] }
const add2 = (a: XY, b: XY, s = 1): XY => [a[0] + b[0] * s, a[1] + b[1] * s]
const R2 = Math.SQRT1_2

/** Left-hand (inward, for a counter-clockwise path) normals, mitred. */
function mitres(B: XY[]): XY[] {
  const segN = (a: XY, b: XY): XY => { const d = nrm2(sub2(b, a)); return [-d[1], d[0]] }
  return B.map((p, i) => {
    if (i === 0) return segN(B[0], B[1])
    if (i === B.length - 1) return segN(B[i - 1], B[i])
    const n1 = segN(B[i - 1], p), n2 = segN(p, B[i + 1])
    const m = nrm2([n1[0] + n2[0], n1[1] + n2[1]]), c = m[0] * n1[0] + m[1] * n1[1]
    return [m[0] / c, m[1] / c]
  })
}

function rayHit(p: XY, d: XY, F: XY[], tmin: number): number | null {
  let best: number | null = null
  for (let i = 0; i < F.length; i++) {
    const a = F[i], b = F[(i + 1) % F.length], e = sub2(b, a)
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const w = sub2(a, p), t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * d[1] - w[1] * d[0]) / den
    if (s >= 0 && s <= 1 && t > tmin && (best === null || t < best)) best = t
  }
  return best
}

/** A box between two plan points, `t` thick across the line, z0..z1 (bottom/top may tilt along it). */
function slab(part: Part, a: XY, b: XY, t: number, z0: number, z1: number, za1 = z0, zb1 = z1, top: Part = part) {
  const u = nrm2(sub2(b, a)), n: XY = [-u[1] * t / 2, u[0] * t / 2]
  const ring: XY[] = [add2(a, n, -1), add2(b, n, -1), add2(b, n), add2(a, n)]
  const bot = [z0, za1, za1, z0], tp = [z1, zb1, zb1, z1]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    part.quad([ring[i][0], ring[i][1], bot[i]], [ring[j][0], ring[j][1], bot[j]], [ring[j][0], ring[j][1], tp[j]], [ring[i][0], ring[i][1], tp[i]])
  }
  top.quad([ring[0][0], ring[0][1], tp[0]], [ring[1][0], ring[1][1], tp[1]], [ring[2][0], ring[2][1], tp[2]], [ring[3][0], ring[3][1], tp[3]])
  part.quad([ring[3][0], ring[3][1], bot[3]], [ring[2][0], ring[2][1], bot[2]], [ring[1][0], ring[1][1], bot[1]], [ring[0][0], ring[0][1], bot[0]])
}

/** A thin steel member from a to b: four sides, no end caps (they are never seen). */
function rod(p: Part, a: V3, b: V3, w: number) {
  beam(p, a, b, w, w)
  // drop the two end caps (the last four triangles beam() writes)
  p.pos.length -= 36; p.nrm.length -= 36; p.uv.length -= 24
}

/** A face-on quad on the vertical plane through A-B, pushed `o` towards n (wound to face n). */
function face(p: Part, A: XY, B: XY, n: XY, z0: number, z1: number, o = 0.06) {
  panel(p, A, B, n, z0, z1, o)
}

// ---------------------------------------------------------------------------
// The field ring (OSM inner way/37121669), where the lower bowl stops.
const FIELD: XY[] = [
  [-17.5, -29.8], [-11.4, -28.4], [-3.6, -21.8], [15.1, -2.2], [29.9, 24.6], [51.2, 45.8], [51.2, 53.4], [47.5, 58.1], [47.5, 65.0],
  [50.7, 67.8], [50.6, 69.8], [20.1, 99.9], [-3.1, 104.0], [-29.4, 104.1], [-29.4, 102.0], [-48.8, 102.0], [-90.0, 60.2], [-90.0, 55.4],
  [-90.4, 51.6], [-67.7, 29.3], [-67.6, 24.1], [-47.8, -5.2], [-33.0, -20.5], [-26.2, -27.2],
]

// ---------------------------------------------------------------------------
// The grandstand: one profile swept along the canopy's outer edge, from the
// left-field end (west, against Western Metal) round home plate to the
// right-field end (east). Measured from the lidar, radially from (-16.5, 10).
const BACK: XY[] = [
  [-120, 54], [-119, 47], [-119, 28], [-118.5, 10], [-109, -6.3], [-99.2, -20.1], [-90, -32], [-80.8, -44], [-70.5, -54.3],
  [-60, -65.3], [-47, -73.6], [-32.1, -78.6], [-16.5, -81], [-0.7, -79.6], [13.9, -73.6], [26.5, -64.5], [37.5, -54.3],
  [47.8, -44], [56.5, -32], [65.3, -19.8], [73.1, -5.8], [81.5, 10], [85.9, 28], [86.9, 47.6], [87, 54],
]
const M = mitres(BACK)
type Prof = { d: number; h: number; m: Part }
const CAN = L(42.6), CANLIP = L(40.6)
const PROFILE: Prof[] = [
  { d: 1.4, h: 0, m: shade },
  { d: 1.4, h: CANLIP - 0.2, m: shade }, // the open concourses behind the steel frame
  { d: 0, h: CANLIP - 0.2, m: white }, // canopy's outer lip, underside
  { d: 0, h: CAN, m: white }, // fascia
  { d: 12, h: CAN, m: white }, // canopy roof
  { d: 12, h: CANLIP, m: white }, // its front fascia
  { d: 4, h: CANLIP, m: shade }, // underside
  { d: 4, h: L(31.3), m: shade }, // the upper concourse's back wall
  { d: 11.5, h: L(31), m: shade }, // walkway behind the top row
  { d: 24, h: L(23.3), m: seats }, // upper deck
  { d: 24, h: L(20.7), m: white }, // upper deck fascia
  { d: 24, h: L(14.6), m: win }, // the suites
  { d: 28, h: L(14.2), m: white }, // club ledge
  { d: 28, h: L(6.8), m: shade }, // the lower concourse under it
  { d: -1, h: L(2.7), m: seats }, // lower bowl, down to the field wall
  { d: -1, h: L(2.2), m: shade }, // the wall
]
const DEPTH = BACK.map((p, i) => {
  const ml = Math.hypot(M[i][0], M[i][1]), dir = nrm2(M[i])
  const t = rayHit(p, dir, FIELD, 30)
  return Math.min(64, Math.max(34, t === null ? 45 : t)) / ml
})
const rings: V3[][] = PROFILE.map((q) => BACK.map((p, i) => {
  const d = q.d < 0 ? DEPTH[i] : q.d
  return [p[0] + M[i][0] * d, p[1] + M[i][1] * d, q.h] as V3
}))
for (let k = 0; k < PROFILE.length - 1; k++) {
  const A = rings[k], Bq = rings[k + 1], part = PROFILE[k + 1].m
  for (let i = 0; i < BACK.length - 1; i++) part.quad(A[i], A[i + 1], Bq[i + 1], Bq[i])
}
// End caps: the cross-section at each end of the sweep.
for (const [i, toward] of [[0, 1], [BACK.length - 1, BACK.length - 2]] as [number, number][]) {
  const pts = rings.map((r) => r[i])
  const along = nrm2(sub2(BACK[i], BACK[toward])) // outward along the sweep
  const n2 = nrm2(M[i])
  const flat2: XY[] = pts.map((p) => [(p[0] - BACK[i][0]) * n2[0] + (p[1] - BACK[i][1]) * n2[1], p[2]])
  const ring = ccw(flat2), rev = ring !== flat2
  for (const [a, b, c] of earcut(ring)) {
    const ia = rev ? pts.length - 1 - a : a, ib = rev ? pts.length - 1 - b : b, ic = rev ? pts.length - 1 - c : c
    const P = pts[ia], Q = pts[ib], Rr = pts[ic]
    const cx = (Q[1] - P[1]) * (Rr[2] - P[2]) - (Q[2] - P[2]) * (Rr[1] - P[1])
    const cy = (Q[2] - P[2]) * (Rr[0] - P[0]) - (Q[0] - P[0]) * (Rr[2] - P[2])
    if (cx * along[0] + cy * along[1] > 0) white.tri(P, Q, Rr)
    else white.tri(P, Rr, Q)
  }
}

// The white steel frame on the outer face: a column every bay, concourse
// floor bands, and chevron braces in the top storey. Below `cover` the face
// is hidden by the sandstone wings, so the frame starts there.
const COVER = [0, 0, 0, 23.6, 23.6, 23.6, 23.6, 23.6, 23.6, 23.6, 23.6, 23.6, 0, 0, 0, 23.6, 23.6, 23.6, 23.6, 23.6, 23.6, 11, 11, 11]
for (let i = 0; i < BACK.length - 1; i++) {
  const a = BACK[i], b = BACK[i + 1], ma = M[i], mb = M[i + 1]
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const bays = Math.max(1, Math.round(len / 9.5))
  const at = (s: number, d: number, z: number): V3 => {
    const t = s / len, p = add2(a, sub2(b, a), t), m = add2(ma, sub2(mb, ma), t)
    return [p[0] + m[0] * d, p[1] + m[1] * d, z]
  }
  const z0 = COVER[i]
  for (let k = 0; k <= bays; k++) {
    if (k === bays && i < BACK.length - 2) continue
    const s = (k * len) / bays
    rod(white, at(s, 0.7, z0), at(s, 0.7, CANLIP - 0.2), 0.9)
  }
  for (const zf of [9.2, 17.8, 26.4]) {
    if (zf < z0) continue
    const A2 = at(0, 0.2, 0), B2 = at(len, 0.2, 0), A3 = at(0, 1.4, 0), B3 = at(len, 1.4, 0)
    white.quad([A2[0], A2[1], zf - 0.7], [B2[0], B2[1], zf - 0.7], [B2[0], B2[1], zf], [A2[0], A2[1], zf])
  }
  for (let k = 0; k < bays; k++) {
    const s0 = (k * len) / bays, s1 = ((k + 1) * len) / bays, sm = (s0 + s1) / 2
    rod(white, at(s0 + 0.4, 0.5, 27), at(sm, 0.5, CANLIP - 0.6), 0.6)
    rod(white, at(s1 - 0.4, 0.5, 27), at(sm, 0.5, CANLIP - 0.6), 0.6)
  }
}

// ---------------------------------------------------------------------------
// Light rigs: a lamp bank (slate face to the field, glowing at night) on an
// A-frame of white legs.
function lampBank(a: XY, b: XY, zb: number, zt: number, toward: XY, zLeg: number, legs = 2) {
  slab(white, a, b, 1.8, zb, zt)
  const u = nrm2(sub2(b, a)), n = nrm2(toward), lenAB = Math.hypot(b[0] - a[0], b[1] - a[1])
  // the lamps: a grid of small grey panels in the white frame (they glow at night)
  const cols = Math.max(2, Math.round((lenAB - 1) / 2.6)), cw = (lenAB - 1) / cols
  for (let i = 0; i < cols; i++) for (let r = 0; r < 2; r++) {
    const z0 = zb + 0.7 + (r * (zt - zb - 1.2)) / 2, z1 = z0 + (zt - zb - 1.2) / 2 - 0.6
    face(win, add2(add2(a, u, 0.5 + i * cw + 0.35), n, 0.9), add2(add2(a, u, 0.5 + (i + 1) * cw - 0.35), n, 0.9), n, z0, z1, 0.02)
  }
  for (let k = 0; k < legs; k++) {
    const s = legs === 1 ? lenAB / 2 : 1 + (k * (lenAB - 2)) / (legs - 1)
    const top = add2(a, u, s)
    const back = add2(top, n, -4.5)
    rod(white, [top[0], top[1], zLeg], [top[0], top[1], zb], 0.9)
    rod(white, [back[0], back[1], zLeg], [top[0], top[1], zb - 0.3], 0.7)
  }
  if (legs >= 2) {
    const p0 = add2(a, u, 1), p1 = add2(b, u, -1)
    rod(white, [p0[0], p0[1], zLeg + 0.6], [p1[0], p1[1], zb - 0.4], 0.5)
    rod(white, [p1[0], p1[1], zLeg + 0.6], [p0[0], p0[1], zb - 0.4], 0.5)
  }
}
// West and east canopy rigs, 26 m long; the two diagonal ones behind home.
lampBank([-115.5, 49.5], [-115.5, 23.5], L(50), L(56.2), [1, 0], CAN, 3)
lampBank([83, 24.5], [83, 50.5], L(50), L(56.2), [-1, 0], CAN, 3)
lampBank([-76, -45], [-66, -55.5], L(50), L(56.2), [R2, R2], CAN, 2)
lampBank([33, -55.5], [43.5, -45], L(50), L(56.2), [-R2, R2], CAN, 2)

// ---------------------------------------------------------------------------
// The two foul-corner towers: sandstone shafts turned 45 degrees, a white
// lattice cage on top and a lamp bank on the field side.
function cornerTower(c: XY, toward: XY) {
  const h = 5.2, rot = Math.PI / 4, top = L(61)
  box(sand, [c[0], c[1], top / 2], h, h, top / 2, rot, sand)
  // the open well in its top (the lidar reads 48 inside a 61 rim)
  box(shade, [c[0], c[1], top + 0.01], h - 1.2, h - 1.2, 0.01, rot, shade)
  // slot windows, staggered, on all four faces
  const corners: XY[] = [0, 1, 2, 3].map((k) => [c[0] + Math.cos(rot + (k * Math.PI) / 2) * h * Math.SQRT2, c[1] + Math.sin(rot + (k * Math.PI) / 2) * h * Math.SQRT2])
  for (let k = 0; k < 4; k++) {
    const A = corners[k], B = corners[(k + 1) % 4], m: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
    const n = nrm2(sub2(m, c)), u = nrm2(sub2(B, A))
    for (let j = 0; j < 5; j++) {
      const off = ((j * 37 + k * 11) % 5) - 2
      const p = add2(m, u, off * 0.9)
      face(win, add2(p, u, -1.7), add2(p, u, 1.7), n, 26 + j * 6.5, 27.1 + j * 6.5)
    }
  }
  // the light rig on its field face: a white truss mast from the canopy up
  // to a lamp bank level with the tower's top
  const n = nrm2(toward), u: XY = [-n[1], n[0]], fc = add2(c, n, h * Math.SQRT2 / 1.41 + 1.6)
  const l0 = add2(fc, u, -3), l1 = add2(fc, u, 3), zt = L(59.5)
  rod(white, [l0[0], l0[1], CAN], [l0[0], l0[1], zt], 0.9)
  rod(white, [l1[0], l1[1], CAN], [l1[0], l1[1], zt], 0.9)
  for (let z = CAN; z < zt - 2; z += 6) {
    rod(white, [l0[0], l0[1], z], [l1[0], l1[1], z + 6], 0.45)
    rod(white, [l1[0], l1[1], z], [l0[0], l0[1], z + 6], 0.45)
  }
  lampBank(add2(add2(fc, n, 0.6), u, -6), add2(add2(fc, n, 0.6), u, 6), zt, L(65.5), n, zt, 0)
}
cornerTower([-85, -29.7], [R2, R2])
cornerTower([51.5, -28.3], [-R2, R2])

// ---------------------------------------------------------------------------
// Sandstone buildings round the bowl, with staggered slot windows on their
// street faces.
let seed = 7
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed % 1000) / 1000 }
function slots(ring0: XY[], z0: number, z1: number, skip: (a: XY, b: XY) => boolean = () => false) {
  const r = ccw(ring0)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    if (skip(a, b)) continue
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 6) continue
    const u = nrm2(sub2(b, a)), n: XY = [u[1], -u[0]]
    const rows = Math.max(1, Math.floor((z1 - z0) / 5.5))
    for (let j = 0; j < rows; j++) {
      const z = z0 + 2.5 + j * 5.5
      const k = Math.floor((len - 4) / 8)
      for (let q = 0; q < k; q++) {
        if (rnd() < 0.3) continue
        const s = 2 + q * 8 + rnd() * 3, w = 2.4 + rnd() * 2.2
        if (s + w > len - 1.5) continue
        face(win, add2(a, u, s), add2(a, u, s + w), n, z, z + 1.3)
      }
    }
  }
}
function block(ring: XY[], z1: number, withSlots = true, skip?: (a: XY, b: XY) => boolean) {
  prism(sand, ring, 0, z1, sand)
  if (withSlots && z1 > 8) slots(ring, 2, z1 - 2, skip)
}
const onBack = (a: XY, b: XY) => {
  // edges that lie on the stands' back (hidden), not on a street
  const m: XY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return Math.hypot(m[0] + 16.5, m[1] - 10) < 104
}

// West: the block south of the west stand, along 7th Avenue.
block([[-121, 12], [-118.5, 10], [-109, -6.3], [-99.2, -20.1], [-94.2, -36.9], [-110.8, -37.1], [-110.9, -52.1], [-120.5, -52]], L(25), true, onBack)
// South-west wing: an inner deck and the outer sandstone strip.
const SW_WING: XY[] = [
  [-90, -32], [-94.2, -36.9], [-80.9, -50.1], [-98.3, -66.4], [-92.2, -76.1], [-85.6, -85.4], [-69.1, -108.8], [-51.9, -119.7],
  [-33.9, -131.3], [-29.1, -123.9], [-20.9, -125.5], [-15.4, -116.8], [-31.2, -106.8], [-22.7, -94], [-18.3, -87.2], [-16.5, -81],
  [-32.1, -78.6], [-47, -73.6], [-60, -65.3], [-70.5, -54.3], [-80.8, -44],
]
prism(sand, SW_WING, 0, L(15), shade)
block([[-98.3, -66.4], [-92.2, -76.1], [-85.6, -85.4], [-69.1, -108.8], [-51.9, -119.7], [-33.9, -131.3], [-29.1, -123.9], [-35, -112], [-50, -104], [-62, -96], [-76, -80], [-86, -63]], L(24.5), true, onBack)
block([[-31.2, -106.8], [-15.4, -116.8], [-20.9, -125.5], [-29.1, -123.9]], L(28))
block([[-25, -104], [-19, -104], [-16.5, -82], [-22, -82]], L(26))
box(sand, [-87, -78, L(34.4) / 2], 4, 8.5, L(34.4) / 2, Math.atan2(-14, 10) + Math.PI / 2, shade)
box(sand, [-32.5, -115, L(33) / 2], 3.6, 4, L(33) / 2, 0, shade)
// The tall south tower at the gate: the park's signature from the street.
// A rectangle turned -31 degrees (lidar: corners about (-27, -114.5),
// (-18, -120), (-22.5, -127.5), (-32, -121); 10.5 x 8.7 m, drawn 11.8 x
// 10 to its lidar edge cells so it stays bold at phone size), sandstone to
// 35.5 with dark horizontal slots, and its open dark lattice crown box with
// a dark core to 43.6 (lidar 44.5).
{
  const c: XY = [-25, -121], hx = 5.9, hy = 5.0, rot = Math.atan2(-5.5, 9), top = L(36.4), crownTop = L(44.5)
  box(sand, [c[0], c[1], top / 2], hx, hy, top / 2, rot, shade)
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const P = (x: number, y: number): XY => [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs]
  const corners = (ex: number, ey: number): XY[] => [P(-ex, -ey), P(ex, -ey), P(ex, ey), P(-ex, ey)]
  const cr = corners(hx, hy)
  // staggered dark slots, two or three a face, as in the photos
  for (let k = 0; k < 4; k++) {
    const A = cr[k], B = cr[(k + 1) % 4], m: XY = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], n = nrm2(sub2(m, c)), u = nrm2(sub2(B, A))
    const w = Math.hypot(B[0] - A[0], B[1] - A[1])
    for (let j = 0; j < 5; j++) {
      const off = (((j * 3 + k) % 3) - 1) * w * 0.18
      face(seats, add2(m, u, off - 1.7), add2(m, u, off + 1.7), n, 9 + j * 5.2, 10.1 + j * 5.2)
    }
  }
  // the crown: an open lattice box, a little proud of the shaft: four
  // corner posts, three rings and crossed diagonals on each face
  const cc = corners(hx + 0.5, hy + 0.5)
  for (let k = 0; k < 4; k++) {
    const A = cc[k], B = cc[(k + 1) % 4]
    rod(seats, [A[0], A[1], top], [A[0], A[1], crownTop], 0.6)
    for (const z of [top + 0.3, (top + crownTop) / 2, crownTop - 0.3]) rod(seats, [A[0], A[1], z], [B[0], B[1], z], 0.5)
    rod(seats, [A[0], A[1], top + 0.3], [B[0], B[1], crownTop - 0.3], 0.35)
    rod(seats, [B[0], B[1], top + 0.3], [A[0], A[1], crownTop - 0.3], 0.35)
  }
  // a dark core inside the lattice so the crown reads as a dark box at 200 px
  box(seats, [c[0], c[1], (top + crownTop - 1.5) / 2], hx - 0.6, hy - 0.6, (crownTop - 1.5 - top) / 2, rot, seats)
}

// South-east wing, the Park Boulevard block, and the low deck north of it.
const SE_WING: XY[] = [
  [22.7, -74.6], [26.5, -64.5], [37.5, -54.3], [47.8, -44], [56.5, -32], [65.3, -19.8], [73.1, -5.8], [81.5, 10], [109.2, 10],
  [109.2, 2.9], [121.7, -4.1], [115.5, -16.4], [101.8, -9.1], [92, -25.4], [83.1, -40.2], [87.8, -45.3], [64.1, -69.4],
  [57.3, -76.4], [52.7, -72.1], [36.5, -87.7],
]
block(SE_WING, L(24.5), true, onBack)
block([[81, -27], [108, -9.1], [109.2, 10], [81.5, 10], [73.1, -5.8]], L(29), false)
box(sand, [64.5, -55.5, L(34.4) / 2], 4.5, 10, L(34.4) / 2, -Math.PI / 4, shade)
box(sand, [39, -79.5, L(36) / 2], 3.5, 4.5, L(36) / 2, -Math.PI / 4, shade)
block([[81.5, 10], [113.5, 10], [117.8, 17.9], [102.3, 26], [101.8, 54.9], [87, 54], [86.9, 47.6], [85.9, 28]], L(12), false)

// ---------------------------------------------------------------------------
// Western Metal Supply Co. (1909): four storeys of red brick in the
// left-field corner, windows in bays, its black painted sign band under the
// parapet, seats and a white shade on the roof.
{
  const x0 = -121, x1 = -90, y0 = 55.3, y1 = 87.2, H = L(25)
  prism(brick, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0, H, shade)
  // parapet cap
  for (const [a, b] of [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]] as [XY, XY][]) slab(brick, a, b, 0.5, H, H + 0.9)
  const bays = (A: XY, B: XY, n: XY, k: number) => {
    const u = nrm2(sub2(B, A)), len = Math.hypot(B[0] - A[0], B[1] - A[1]), w = len / k
    for (let i = 0; i < k; i++) {
      const s0 = i * w + 1.1, s1 = (i + 1) * w - 1.1
      face(win, add2(A, u, s0), add2(A, u, s1), n, 1.4, 5.0) // ground floor
      face(win, add2(A, u, s0), add2(A, u, s1), n, 6.6, 15.6) // second and third
      face(win, add2(A, u, s0), add2(A, u, s1), n, 17.2, 20.8) // fourth
    }
    face(seats, A, B, n, 21.7, H - 0.3, 0.08) // the painted sign band
  }
  bays([x0, y1], [x1, y1], [0, 1], 6) // north (K Street side)
  bays([x0, y0], [x0, y1], [-1, 0], 6) // west (7th Avenue)
  bays([x1, y0], [x1, y1], [1, 0], 6) // east, to the field
  // the balcony seats down the field side
  prism(seats, [[x1, 57], [x1 + 3.6, 57], [x1 + 3.6, 87], [x1, 87]], 0, L(19.5), white)
  // rooftop: bleachers to the field, the white shade structure over the deck
  slab(seats, [-104, 72], [-104, 58], 12, H, H + 3.5, H, H + 3.5)
  for (const p of [[-111, 61], [-99, 61], [-111, 76], [-99, 76]] as XY[]) rod(white, [p[0], p[1], H], [p[0], p[1], L(29.8)], 0.5)
  prism(white, [[-112, 60], [-98, 60], [-98, 77], [-112, 77]], L(29.5), L(30.3), white)
}
// The sandstone stair tower and its base north of Western Metal.
block([[-109, 87.2], [-104.4, 87.2], [-104.4, 104.5], [-109.3, 104.5]], L(33.5))
block([[-104.4, 87.2], [-90, 87.2], [-90.8, 97.3], [-96.4, 97.8], [-104.4, 97.8]], L(26), false)

// ---------------------------------------------------------------------------
// Left field: the bleachers between Western Metal and the board, and the
// video board on its white truss with the lamp bank on top.
{
  const LF: XY[] = [[-88.5, 57.5], [-48.8, 102], [-60, 113], [-68, 117], [-90, 94], [-88.5, 88]]
  const zOf = (p: XY) => L(2.7) + Math.max(0, (p[1] - p[0]) * R2 - 106.4) * 0.55
  const r = ccw(LF)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    shade.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], zOf(b)], [a[0], a[1], zOf(a)])
  }
  for (const [i, j, k] of earcut(r)) seats.tri([r[i][0], r[i][1], zOf(r[i])], [r[j][0], r[j][1], zOf(r[j])], [r[k][0], r[k][1], zOf(r[k])])
  const A: XY = [-90.5, 93.5], B: XY = [-67.5, 117.5], n: XY = [R2, -R2], u = nrm2(sub2(B, A))
  const zb = L(22), zt = L(44)
  slab(white, A, B, 3, zb, zt)
  face(win, add2(add2(A, u, 1.4), n, 1.5), add2(add2(B, u, -1.4), n, 1.5), n, zb + 2, zt - 1.2)
  for (const s of [2, 16.5, 31]) {
    const p = add2(A, u, s)
    rod(white, [p[0], p[1], 0], [p[0], p[1], zb], 1.6)
  }
  const c = add2(A, u, 20)
  lampBank(add2(c, u, -6), add2(c, u, 6), L(56.5), L(62.5), n, zt, 2)
}

// ---------------------------------------------------------------------------
// Right field: the stand on the diagonal (rake lines run north-west to
// south-east), its board and light tower at the back, and the concourse
// building behind the right-field corner. (u, v) = (x - y, x + y) / sqrt 2.
{
  const P = (u: number, v: number, z: number): V3 => [(u + v) * R2, (v - u) * R2, z]
  const prof: [number, number, Part][] = [
    [84, L(2.2), shade], [84, L(3.4), shade], [102, L(9.6), seats], [102.6, L(16.8), white], [121, L(26), seats], [129, L(25), shade], [129, 0, shade],
  ]
  const u0 = -58, u1 = 2
  for (let k = 0; k < prof.length - 1; k++) {
    const [va, za] = prof[k], [vb, zb, m] = prof[k + 1]
    m.quad(P(u0, va, za), P(u1, va, za), P(u1, vb, zb), P(u0, vb, zb))
  }
  // end walls
  const sec: XY[] = [[84, 0], ...prof.map(([v, z]) => [v, z] as XY)]
  for (const [uu, sgn] of [[u0, -1], [u1, 1]] as [number, number][]) {
    const r = ccw(sec)
    for (const [i, j, k] of earcut(r)) {
      const a = P(uu, r[i][0], r[i][1]), b = P(uu, r[j][0], r[j][1]), c = P(uu, r[k][0], r[k][1])
      // outward is -u for u0, +u for u1; (v, z) ccw seen from +u
      if (sgn > 0) white.tri(a, c, b)
      else white.tri(a, b, c)
    }
  }
  // white columns on the open back
  for (let uu = u0 + 3; uu < u1; uu += 9.5) rod(white, P(uu, 129.6, 0), P(uu, 129.6, L(25)), 0.9)
  slab(white, [P(u0, 129.4, 0)[0], P(u0, 129.4, 0)[1]], [P(u1, 129.4, 0)[0], P(u1, 129.4, 0)[1]], 1, L(25), L(26.2))
  // the board, facing the field (-v), on the back of the stand
  const zb = L(24), zt = L(38)
  const A: XY = [P(-41, 125, 0)[0], P(-41, 125, 0)[1]], B: XY = [P(-6, 125, 0)[0], P(-6, 125, 0)[1]]
  const n: XY = [-R2, -R2], u = nrm2(sub2(B, A))
  slab(white, A, B, 2.6, zb, zt)
  face(win, add2(add2(A, u, 1.3), n, 1.3), add2(add2(B, u, -1.3), n, 1.3), n, zb + 1.2, zt - 1)
  const c = add2(A, u, 16)
  lampBank(add2(c, u, -5.5), add2(c, u, 5.5), L(52.5), L(58.7), n, zt, 2)
  // the concourse deck and building behind the right-field corner
  block([[51, 54], [87, 54], [101.8, 54.9], [102.3, 76.8], [101.9, 81.2], [92.6, 91.4], [59.4, 59.4]], L(20.5), false)
  block([[66, 55.5], [117, 55.6], [116.6, 65.6], [66, 65.6]], L(25.5))
}

// ---------------------------------------------------------------------------
// Centre field: low bleachers between the field wall and the outfield
// promenade, and the dark batter's eye.
{
  const ring: XY[] = [[-48.8, 102], [-29.4, 102], [-29.4, 104.1], [-3.1, 104], [20.1, 99.9], [27, 107], [28, 112], [-56, 112]]
  prism(shade, ring, 0, L(4.6), seats)
  prism(seats, [[-29, 117], [-6.5, 117], [-6.5, 128], [-29, 128]], 0, L(15), shade)
}

// ---------------------------------------------------------------------------
const lit = (amount: number) => (p: V3, n: V3) => (n[2] > 0.7 ? 0.15 : amount)
const parts = [
  { part: sand, material: { ...finish('petco-sandstone', 0xc9a172), floodlight: lit(0.35) } },
  { part: white, material: { ...finish('petco-white-steel', 0xf0efea), floodlight: lit(0.55) } },
  { part: seats, material: finish('petco-navy-seats', 0x56637a) },
  { part: brick, material: { ...finish('western-metal-brick', 0xa9624d), floodlight: lit(0.3) } },
  { part: win, material: PALETTE.window },
  { part: shade, material: PALETTE.roof },
]
const REPLACES = ['relation/1779874', 'way/613165145', 'way/769800588']
const glb = writeGlb('Petco Park', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, anchor: [32.70718, -117.15687], height: L(66.2),
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: REPLACES,
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(" "))
const tris = report('Petco Park', parts, glb, 6500)
const out = new URL('../models/sd-petco-park.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
