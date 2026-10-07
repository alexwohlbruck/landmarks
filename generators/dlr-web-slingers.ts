/**
 * The WEB building (Worldwide Engineering Brigade, home of WEB SLINGERS: A
 * Spider-Man Adventure), Avengers Campus, Disney California Adventure
 * (Anaheim): procedural, CC0-1.0.
 * bun generators/dlr-web-slingers.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, so the frame is true
 * north. The origin is the area centroid of the OSM outline (way/721810397),
 * on the ground (the park is flat).
 *
 * What it is. The old A Bug's Life theatre, a big plain show box, given a new
 * front on the campus side:
 *   - the show box itself, light grey under a pale roof (OSM part
 *     way/49824622), standing a little above the rest;
 *   - a two-storey brick front along the south and south-east sides, with
 *     the painted "Stark Motors" sign on the south wall and window bands;
 *     Spider-Man's rooftop stunts happen on its parapet;
 *   - the WEB module, a tall red box with rounded top edges, white
 *     pinstripes and the WEB spider emblem, over the queue on the south-east
 *     face;
 *   - a tall pale "mechanical module" at the south-east corner;
 *   - the mast on the roof between them, with its red crane head;
 *   - the blue entrance canopies in front of the south-east face (OSM's
 *     building=roof ways).
 * The red module, the mast and the brick front are what people know; the
 * show box behind is what the map sees from above.
 *
 * Evidence.
 *   Measured: the plan of the outline, the show box and the canopies from
 *     OSM (ways 721810397, 49824622, 980768332–980768335), checked against
 *     USGS NAIP (public domain) and the CC BY-SA aerial "Avengers Campus
 *     Progress at Disneyland Park California", which shows the show box,
 *     the walled front, the canopies and the mechanical module going up.
 *   Published: nothing dimensional; OSM tags the outline 9 m and the show
 *     box 9.8 m (unsourced), used as given.
 *   Estimated: the positions of the red module, the mechanical module and
 *     the mast, from where they stand against each other in the ground
 *     photos (front view from the south-east, the Stark Motors wall from the
 *     south) and the aerial, to within a few metres; their heights (red
 *     module 14.5 m, mechanical module 15.5 m, mast 20.5 m) from the brick front
 *     beside them; the canopies' heights (4–6 m) from their OSM layers; the
 *     show box's 1 m rounded crown, from the hump seen over the parapet.
 *   Invented: the north and west sides, which no photo shows, are plain
 *     grey walls; the window bands' exact runs.
 *
 * Photos: Wikimedia Commons, Jeremy Thompson, CC BY 2.0: "Disney California
 * Adventure (51242306845)" (the entrance gantry), "(51240543512)" (Stark
 * Motors wall); "Spider-Man in Avengers Campus, Disney California Adventure"
 * (Contributor19, CC BY 4.0). Flickr via Openverse, CC BY 2.0: Roller Coaster
 * Philosophy, "Disney California Adventure" 51541265813 (the south-east
 * front with the mast and the red module), 51541953165 (Stark Motors wall,
 * mast and mechanical module), 52155518628 (the red module), 51540231987
 * (the entrance under the module); milst1, "Avengers Campus" 52554122357.
 * Plan: OSM, USGS NAIP, and "Avengers Campus Progress at Disneyland Park
 * California" (Michaelestigoy, CC BY-SA 4.0). Disney's own media was not
 * used.
 *
 * Style: the red brick and the WEB red are identity finishes, muted to the
 * palette's lightness; the canopy blue likewise. The emblem is a flat white
 * hexagon outline on the red module, the STYLE.md exception for a sign that
 * is the landmark.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

// ------------------------------------------------------------------ plan ----
const REF = { lon: -117.9186, lat: 33.8068 }
const MX = 111320 * Math.cos((REF.lat * Math.PI) / 180), MY = 110946
const M = ([lon, lat]: XY): XY => [(lon - REF.lon) * MX, (lat - REF.lat) * MY]

// way/721810397, the whole building.
const OUTLINE: XY[] = ([
  [-117.9183003, 33.8068903], [-117.9182975, 33.8068872], [-117.9184575, 33.8067632], [-117.9184484, 33.8067551], [-117.9184339, 33.8067421],
  [-117.9184115, 33.806722], [-117.9184125, 33.8067154], [-117.9184221, 33.8066562], [-117.918412, 33.8066552], [-117.9184129, 33.8066502],
  [-117.9184138, 33.8066447], [-117.9184147, 33.8066397], [-117.9184156, 33.8066345], [-117.9184167, 33.8066284], [-117.9184184, 33.8066185],
  [-117.9184277, 33.8065974], [-117.9184301, 33.8065924], [-117.918435, 33.8065812], [-117.9184705, 33.8065847], [-117.9184715, 33.8065776],
  [-117.9184722, 33.8065728], [-117.918511, 33.8065755], [-117.9186079, 33.806584], [-117.9186398, 33.8065882], [-117.9186623, 33.8065952],
  [-117.9186603, 33.8065985], [-117.9187456, 33.8066742], [-117.9187582, 33.8066721], [-117.9187969, 33.8067051], [-117.9187999, 33.806703],
  [-117.9188178, 33.8067182], [-117.9188182, 33.8067209], [-117.9189458, 33.8068333], [-117.9190104, 33.8068873], [-117.9190128, 33.8068893],
  [-117.9190022, 33.8068975], [-117.9190722, 33.80696], [-117.9189924, 33.8070234], [-117.9189556, 33.8070529], [-117.9189482, 33.8070973],
  [-117.9187695, 33.8072196], [-117.9186942, 33.807156], [-117.9186565, 33.8071871], [-117.9186158, 33.8071533], [-117.9186078, 33.8071603],
  [-117.918439, 33.8070177], [-117.918382, 33.8069695], [-117.9183664, 33.8069794], [-117.9183253, 33.8069445], [-117.9183443, 33.8069299],
] as XY[]).map(M)
// way/49824622, the show box (the old theatre).
const SHOW: XY[] = ([
  [-117.9187695, 33.8072196], [-117.9189482, 33.8070973], [-117.9189556, 33.8070529], [-117.9189924, 33.8070234], [-117.9189189, 33.8069633],
  [-117.9188519, 33.8069067], [-117.9188389, 33.8068957], [-117.9188596, 33.8068788], [-117.9187617, 33.806796], [-117.9186713, 33.8067196],
  [-117.9186018, 33.8067764], [-117.91861, 33.8067833], [-117.9185298, 33.8068488], [-117.9185145, 33.8068614], [-117.918382, 33.8069695],
  [-117.918439, 33.8070177], [-117.9186078, 33.8071603], [-117.9186158, 33.8071533], [-117.9186565, 33.8071871], [-117.9186942, 33.807156],
] as XY[]).map(M)
// The entrance canopies, building=roof, with their OSM layers.
const CANOPIES: [string, number, XY[]][] = [
  ['way/980768333', 1, [[-117.9183135, 33.8067108], [-117.9183974, 33.8067115], [-117.9183987, 33.8066997], [-117.9184125, 33.8067154], [-117.9184115, 33.806722], [-117.9184339, 33.8067421], [-117.9184295, 33.8067739], [-117.9184126, 33.8067856], [-117.9184011, 33.8067846], [-117.9183828, 33.8067831], [-117.9183528, 33.8067563], [-117.9183448, 33.8067492], [-117.9183113, 33.8067194]]],
  ['way/980768334', 1.5, [[-117.9183528, 33.8067563], [-117.9183828, 33.8067831], [-117.9184011, 33.8067846], [-117.9183977, 33.8067991], [-117.9183656, 33.8068229], [-117.9183524, 33.8068231], [-117.9183085, 33.8068167], [-117.9183156, 33.8067781], [-117.9183195, 33.8067755], [-117.9183314, 33.8067673], [-117.9183327, 33.8067561], [-117.9183345, 33.8067564], [-117.9183503, 33.8067586]]],
  ['way/980768332', 2, [[-117.9183053, 33.8066369], [-117.9183027, 33.8066502], [-117.9182771, 33.8066687], [-117.9182739, 33.8066712], [-117.9182709, 33.8066866], [-117.9182971, 33.8067093], [-117.9183135, 33.8067108], [-117.9183974, 33.8067115], [-117.9183987, 33.8066997], [-117.9184077, 33.8066443], [-117.9184095, 33.8066342], [-117.9184008, 33.8066338], [-117.9183753, 33.8066326], [-117.9183408, 33.8066316], [-117.9183251, 33.8066303], [-117.9183216, 33.80663]]],
  ['way/980768335', 2.75, [[-117.9182771, 33.8066687], [-117.9182396, 33.8066374], [-117.9182351, 33.8066281], [-117.918232, 33.806621], [-117.9182511, 33.8066043], [-117.9182588, 33.8066048], [-117.918266, 33.8066053], [-117.9182891, 33.806607], [-117.9183167, 33.8066257], [-117.9183216, 33.80663], [-117.9183053, 33.8066369], [-117.9183027, 33.8066502]]],
].map(([id, layer, pts]) => [id as string, layer as number, (pts as XY[]).map(M)])

const signedArea = (p: XY[]) => p.reduce((s, a, i) => s + a[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * a[1], 0) / 2
const ccw = (p: XY[]) => (signedArea(p) < 0 ? [...p].reverse() : p)
const ANCHOR = (() => {
  let a = 0, cx = 0, cy = 0
  for (let i = 0; i < OUTLINE.length; i++) {
    const [x0, y0] = OUTLINE[i], [x1, y1] = OUTLINE[(i + 1) % OUTLINE.length], k = x0 * y1 - x1 * y0
    a += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k
  }
  return [cx / (3 * a), cy / (3 * a)] as XY
})()

// ------------------------------------------------------------- helpers ----
function earClip(poly: XY[]): [XY, XY, XY][] {
  const p = ccw(poly), idx = p.map((_, i) => i), out: [XY, XY, XY][] = []
  const cr = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const A = p[ia], B = p[ib], C = p[ic]
      if (cr(A, B, C) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && cr(A, B, p[j]) >= -1e-9 && cr(B, C, p[j]) >= -1e-9 && cr(C, A, p[j]) >= -1e-9)) continue
      out.push([A, B, C]); idx.splice(i, 1); cut = true
      break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([p[idx[0]], p[idx[1]], p[idx[2]]])
  return out
}
function cap(part: Part, poly: XY[], z: number, up = true) {
  for (const [a, b, c] of earClip(poly)) {
    if (up) part.tri([a[0], a[1], z], [b[0], b[1], z], [c[0], c[1], z])
    else part.tri([a[0], a[1], z], [c[0], c[1], z], [b[0], b[1], z])
  }
}
/** Walls of a polygon; `pick` chooses each edge's part from its outward normal's bearing. */
function walls(poly: XY[], z0: number, z1: number, pick: (bearing: number) => Part) {
  const p = ccw(poly)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    const brg = ((Math.atan2(b[1] - a[1], -(b[0] - a[0])) * 180) / Math.PI + 360) % 360 // outward normal (dy, -dx)
    pick(brg).quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** Shrink a polygon towards its centroid by `d` metres (enough for a roof crown on a near-convex box). */
function inset(poly: XY[], d: number): XY[] {
  const cx = poly.reduce((s, q) => s + q[0], 0) / poly.length, cy = poly.reduce((s, q) => s + q[1], 0) / poly.length
  return poly.map(([x, y]) => { const l = Math.hypot(cx - x, cy - y) || 1; return [x + ((cx - x) / l) * d, y + ((cy - y) / l) * d] as XY })
}
function face(part: Part, q: V3[], n: V3) {
  const a = q[0], b = q[1], c = q[2]
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const cx = u[1] * v[2] - u[2] * v[1], cy = u[2] * v[0] - u[0] * v[2], cz = u[0] * v[1] - u[1] * v[0]
  const pts = cx * n[0] + cy * n[1] + cz * n[2] < 0 ? [...q].reverse() : q
  for (let i = 1; i < pts.length - 1; i++) part.tri(pts[0], pts[i], pts[i + 1])
}
/** An oriented box with an optional chamfered top: centre, unit axis u, half-sizes. */
function box(part: Part, c: XY, u: XY, hu: number, hv: number, z0: number, z1: number, top: Part | null = part, chamfer = 0) {
  const v: XY = [-u[1], u[0]]
  const ring = (s: number, z: number): V3[] => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) =>
    [c[0] + u[0] * (hu - s) * a + v[0] * (hv - s) * b, c[1] + u[1] * (hu - s) * a + v[1] * (hv - s) * b, z] as V3)
  part.loft(chamfer ? [ring(0, z0), ring(0, z1 - chamfer), ring(chamfer, z1)] : [ring(0, z0), ring(0, z1)])
  if (top) { const r = ring(chamfer, z1); top.cap(r, true) }
}

// ----------------------------------------------------------- materials ----
const brick = new Part(), grey = new Part(), roof = new Part(), glazing = new Part(), red = new Part(), blue = new Part(), white = grey

// ---------------------------------------------------------- the block ----
// Brick on the faces turned to the campus (south round to south-east), grey
// on the back.
const FRONT = 9.0
const isFront = (b: number) => b >= 95 && b <= 235
walls(OUTLINE, 0, FRONT, (b) => (isFront(b) ? brick : grey))
cap(roof, OUTLINE, FRONT)

// The show box: walls up to 9.8 m (OSM), then a 1 m rounded crown.
{
  const crown = inset(SHOW, 1.4)
  walls(SHOW, FRONT, 9.8, () => grey)
  const p = ccw(SHOW), q = ccw(crown)
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length
    grey.quad([p[i][0], p[i][1], 9.8], [p[j][0], p[j][1], 9.8], [q[j][0], q[j][1], 10.8], [q[i][0], q[i][1], 10.8])
  }
  cap(roof, crown, 10.8)
}

// Window bands on the brick front, between ground-floor piers.
{
  const p = ccw(OUTLINE)
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    const brg = ((Math.atan2(b[1] - a[1], -(b[0] - a[0])) * 180) / Math.PI + 360) % 360
    if (!isFront(brg) || l < 6 || (brg > 170 && brg < 195)) continue // the Stark Motors wall has no windows
    const n: XY = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]
    const P = (t: number, z: number): V3 => [a[0] + ((b[0] - a[0]) * t) / l + n[0] * 0.06, a[1] + ((b[1] - a[1]) * t) / l + n[1] * 0.06, z]
    for (let t = 1.2; t + 3.2 < l - 1; t += 4.2) face(glazing, [P(t, 3.6), P(t + 3.2, 3.6), P(t + 3.2, 6.4), P(t, 6.4)], [n[0], n[1], 0])
  }
}

// The entrance canopies, blue slabs at their OSM layers.
for (const [, layer, pts] of CANOPIES) {
  const z = 3.0 + layer * 1.1
  walls(pts, z - 0.8, z, () => blue)
  cap(blue, pts, z)
  cap(blue, pts, z - 0.8, false)
  // Chunky steel posts at a few corners (the real frames are lattice gantries).
  for (let k = 0; k < pts.length; k += 4) {
    const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length
    const [x, y] = pts[k], l = Math.hypot(cx - x, cy - y) || 1
    box(grey, [x + ((cx - x) / l) * 0.6, y + ((cy - y) / l) * 0.6], [1, 0], 0.22, 0.22, 0, z - 0.8, null)
  }
}

// ------------------------------------------------- the mechanical module ----
// A tall box at the east end of the south wall: a louvred grey body, then a
// pale band with rounded (here chamfered) top edges.
box(roof, [12.0, -20.3], [1, 0], 3.2, 3.4, 0, 11.0, null)
box(grey, [12.0, -20.3], [1, 0], 3.2, 3.4, 11.0, 15.5, roof, 0.8)

// The painted "Stark Motors" panel on the south wall: a big blue-grey field.
face(roof, [[0.6, -24.16, 3.2], [7.8, -24.92, 3.2], [7.8, -24.92, 7.6], [0.6, -24.16, 7.6]], [0, -1, 0])

// --------------------------------------------------------- the mast ----
{
  const c: XY = [7.5, -9.0], r = 0.75, seg = 10
  const ring = (z: number, rr: number): V3[] => Array.from({ length: seg }, (_, k) => [c[0] + rr * Math.cos((k / seg) * Math.PI * 2), c[1] + rr * Math.sin((k / seg) * Math.PI * 2), z] as V3)
  grey.loft([ring(FRONT, r), ring(17.5, r * 0.8)])
  // The red crane head, angled out over the front.
  box(red, [c[0] + 0.9, c[1] - 0.9], [0.71, -0.71], 2.2, 0.9, 17.0, 20.5)
}

// --------------------------------------------------- the WEB module ----
// A red box over the queue on the south-east face, its top edges rounded:
// a profile across the face (depth v, height z) swept along the face (u).
{
  const A = OUTLINE[2], B = OUTLINE[1] // the south-east face runs from A (south-west) to B (north-east)
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: XY = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], out: XY = [u[1], -u[0]]
  const mid: XY = [A[0] + u[0] * L * 0.62, A[1] + u[1] * L * 0.62]
  const HW = 5.5, D0 = -0.8, D1 = 7.5, H = 14.5, R = 2.4
  // Profile: from the front at the foot, up, over the rounded top, down the back.
  const prof: [number, number][] = [[D0, 0], [D0, H - R]]
  for (let k = 1; k <= 4; k++) { const a = Math.PI - (k / 4) * (Math.PI / 2); prof.push([D0 + R + R * Math.cos(a), H - R + R * Math.sin(a)]) }
  for (let k = 1; k <= 4; k++) { const a = Math.PI / 2 - (k / 4) * (Math.PI / 2); prof.push([D1 - R + R * Math.cos(a), H - R + R * Math.sin(a)]) }
  prof.push([D1, 0])
  // v measured inward from the face: point = mid + u*s - out*v.
  const P = (s: number, v: number, z: number): V3 => [mid[0] + u[0] * s - out[0] * v, mid[1] + u[1] * s - out[1] * v, z]
  for (let k = 0; k + 1 < prof.length; k++) {
    const [v0, z0] = prof[k], [v1, z1] = prof[k + 1]
    const nv = -(z1 - z0), nz = v1 - v0 // outward normal of the profile edge (in v,z)
    face(red, [P(-HW, v0, z0), P(HW, v0, z0), P(HW, v1, z1), P(-HW, v1, z1)], [-out[0] * nv, -out[1] * nv, nz])
  }
  // End caps.
  for (const s of [-HW, HW]) {
    const pts = prof.map(([v, z]) => P(s, v, z))
    face(red, pts, [u[0] * Math.sign(s), u[1] * Math.sign(s), 0])
  }
  // White pinstripes round the front and top, and the spider emblem on the face.
  const fz = (z: number) => z
  for (const z of [9.6]) face(white, [P(-HW - 0.04, D0 - 0.05, fz(z)), P(HW + 0.04, D0 - 0.05, fz(z)), P(HW + 0.04, D0 - 0.05, z + 0.35), P(-HW - 0.04, D0 - 0.05, z + 0.35)], [out[0], out[1], 0])
  const ec: [number, number] = [2.4, 5.4], ro = 1.9, ri = 1.45
  const hex = (r: number, k: number): [number, number] => [ec[0] + r * Math.cos((k * Math.PI) / 3 + Math.PI / 6) * 0.8, ec[1] + r * Math.sin((k * Math.PI) / 3 + Math.PI / 6)]
  for (let k = 0; k < 6; k++) {
    const o0 = hex(ro, k), o1 = hex(ro, k + 1), i0 = hex(ri, k), i1 = hex(ri, k + 1)
    face(white, [P(o0[0], D0 - 0.05, o0[1]), P(o1[0], D0 - 0.05, o1[1]), P(i1[0], D0 - 0.05, i1[1]), P(i0[0], D0 - 0.05, i0[1])], [out[0], out[1], 0])
  }
  // The spider's body: a diamond in the hexagon.
  face(white, [P(ec[0], D0 - 0.05, ec[1] - 0.8), P(ec[0] + 0.55, D0 - 0.05, ec[1]), P(ec[0], D0 - 0.05, ec[1] + 0.8), P(ec[0] - 0.55, D0 - 0.05, ec[1])], [out[0], out[1], 0])
}

// --------------------------------------------------------------- write ----
const parts = [
  { part: brick, material: finish('web-brick', 0xb97c66) },
  { part: grey, material: finish('web-grey', 0xdcdcd8) },
  { part: roof, material: PALETTE.roof },
  { part: glazing, material: PALETTE.window },
  { part: red, material: finish('web-red', 0xbf4d4a) },
  { part: blue, material: finish('web-blue', 0x86a4cc) },
]
for (const { part } of parts)
  for (let i = 0; i < part.pos.length; i += 3) { part.pos[i] -= ANCHOR[0]; part.pos[i + 2] += ANCHOR[1] }
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('WEB SLINGERS: A Spider-Man Adventure', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/dlr-web-slingers.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes`)
console.log(`anchor ${(REF.lon + ANCHOR[0] / MX).toFixed(7)}, ${(REF.lat + ANCHOR[1] / MY).toFixed(7)}`)
