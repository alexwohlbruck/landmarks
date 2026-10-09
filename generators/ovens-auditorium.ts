/**
 * Ovens Auditorium, Charlotte (1955, A. G. Odell Jr. & Associates) — procedural, CC0-1.0.
 * bun generators/ovens-auditorium.ts
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 42°: the model's
 * +y runs north-east along the building's axis, from the stage house at the
 * back to the lobby on the entrance plaza facing Independence Boulevard. The
 * anchor is the centroid of the OSM outline (way/836535412). The BOplex
 * Connector (way/918754955) that joins it to the coliseum is left out; the
 * neighbouring `bojangles-coliseum` model stands for the dome.
 *
 * Read from front to back:
 * - the lobby: a long two-storey box whose upper floor is a continuous band
 *   of tall glass between a thin cream floor slab and a thin cream fascia,
 *   floating over a recessed glazed ground floor. A flat canopy on four
 *   square columns projects over the doors in the middle. The south-east end
 *   of the upper floor is a solid wall of turquoise glazed tile, with a low
 *   cream box beside it;
 * - the auditorium: a tall, windowless block of buff precast panels whose
 *   front wall bows out in plan over the lobby, whose roof rises towards the
 *   front over the balcony, and whose south-east side swells out in plan;
 * - the stage house: the tallest block, plain panels, with a smoke-vent hatch
 *   on its roof, low back-of-house wings round it and a lobby-height wing
 *   down the north-west side.
 *
 * Rework (2026). Forms kept from the first model: the lobby (glass band,
 * slab, fascia, canopy, tile end, cream box), the bowed hall, the stage house
 * and its hatch, the wings. Heights and the hall's plan are now lidar (USGS
 * 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m DSM, sampled in this frame). y = 0
 * is the lowest ground at the back (4.3 m over the tile's lowest return); the
 * plaza is 1.8 m higher. Measured, each changed from the first model:
 * - stage house 22.6 m (was 28), hatch +2.2 m; it sits 2.5 m further
 *   south-east, x -14.5..18.5 (was -16..16), matching the hatch's centre;
 * - hall roof slopes from 15.4 m at the back to 20.3 m at the front (was a
 *   flat 21 m): the roof rises over the balcony;
 * - the hall's bowed front: apex at y 28.7, ends at 25.5 (was 33.5 and 27),
 *   so the bow is shallower and 5 m further back than first drawn;
 * - the hall's east side reaches x 25 near mid-depth and only x 21 at the
 *   front; the OSM outline's front-east corner (x 25, y 27) is a 4.9 m skirt,
 *   not hall;
 * - lobby 10.8 m (was 12.9), x -14.5..18.5; canopy 5.4 m, x -8.5..12.5;
 * - north-west wing 10.8 m from y -2 forward (was 7.5 m), 4.9 m behind;
 *   back of house 4.9 m (was 10); south-east loading annex 7.7 m (was 9).
 *
 * References: lidar as above; USGS NAIP orthoimagery (public domain) for the
 * plan and roof; James Willamor's 2007 aerial on Commons ("Ovens Auditorium,
 * Charlotte, NC - panoramio (cropped)", CC BY-SA 3.0) for the buff panels
 * and the stage house; and, as visual reference only, the venue's own photos
 * of the front and south-east corner and its 1955 opening photograph
 * (boplex.com), which are the only evidence for the lobby's glass band and
 * the turquoise tile. No licensed street photo of the front was found
 * (Mapillary covers only Independence Boulevard, behind the sound wall).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const panel = new Part(), trim = new Part(), roof = new Part()
const tile = new Part(), win = new Part(), glassUp = new Part()

type XY = [number, number]
const G = 1.8 // plaza level above the model's y = 0 (lidar ground)

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

// ---------------------------------------------------------------------------
// Polygon helpers: rings are counter-clockwise from above.

function area(r: XY[]) { let a = 0; r.forEach((p, i) => { const q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] }); return a / 2 }
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 2000) {
    for (let i = 0; i < idx.length; i++) {
      const a = idx[(i + idx.length - 1) % idx.length], b = idx[i], c = idx[(i + 1) % idx.length]
      if (cr(r[a], r[b], r[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c && inside(r[j], r[a], r[b], r[c]))) continue
      out.push([a, b, c]); idx.splice(i, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
function offset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = unit([n1[0] + n2[0], n1[1] + n2[1], 0]), cos = m[0] * n1[0] + m[1] * n1[1]
    const k = d / Math.max(cos, 0.3)
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
const edgeN = (a: XY, b: XY): V3 => unit([b[1] - a[1], -(b[0] - a[0]), 0])
/** Vertex normals: averaged where the turn is gentle (a curve), per edge at corners. */
function vertexNormals(r: XY[], smooth: boolean[]) {
  const n = r.length
  return r.map((p, i) => {
    const a = edgeN(r[(i + n - 1) % n], p), b = edgeN(p, r[(i + 1) % n])
    return smooth[i] ? unit([a[0] + b[0], a[1] + b[1], 0]) : null
  })
}
function walls(p: Part, r: XY[], z0: number, z1: number, smooth?: boolean[]) {
  const n = r.length, vn = smooth ? vertexNormals(r, smooth) : r.map(() => null)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = r[i], b = r[j], E = edgeN(a, b)
    const na = vn[i] ?? E, nb = vn[j] ?? E
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [na, nb, nb, na])
  }
}
function cap(p: Part, r: XY[], z: number, up = true) {
  const N: V3 = [0, 0, up ? 1 : -1]
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C, undefined, undefined, undefined, [N, N, N])
    else p.tri(A, C, B, undefined, undefined, undefined, [N, N, N])
  }
}
/** A solid with a bevelled top edge of size b; the roof goes to `top`. */
function prism(p: Part, r: XY[], z0: number, z1: number, b: number, top: Part | null = roof, smooth?: boolean[]) {
  if (area(r) <= 0) throw new Error('rings must be counter-clockwise')
  walls(p, r, z0, z1 - b, smooth)
  if (b <= 0) { if (top) cap(top, r, z1); return }
  const r2 = offset(r, -b), n = r.length, vn = smooth ? vertexNormals(r, smooth) : r.map(() => null)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, E = edgeN(r[i], r[j])
    const Ma = unit([(vn[i] ?? E)[0], (vn[i] ?? E)[1], 1]), Mb = unit([(vn[j] ?? E)[0], (vn[j] ?? E)[1], 1])
    quadN(p, [r[i][0], r[i][1], z1 - b], [r[j][0], r[j][1], z1 - b], [r2[j][0], r2[j][1], z1], [r2[i][0], r2[i][1], z1], [Ma, Mb, Mb, Ma])
  }
  if (top) cap(top, r2, z1)
}
const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A flat rectangle on a wall plane: x = const (facing ±x) or y = const (facing ±y). */
function panelX(p: Part, x: number, y0: number, y1: number, z0: number, z1: number, dir: 1 | -1) {
  const N: V3 = [dir, 0, 0]
  if (dir > 0) quadN(p, [x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1], [N, N, N, N])
  else quadN(p, [x, y1, z0], [x, y0, z0], [x, y0, z1], [x, y1, z1], [N, N, N, N])
}
function panelY(p: Part, y: number, x0: number, x1: number, z0: number, z1: number, dir: 1 | -1) {
  const N: V3 = [0, dir, 0]
  if (dir > 0) quadN(p, [x1, y, z0], [x0, y, z0], [x0, y, z1], [x1, y, z1], [N, N, N, N])
  else quadN(p, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [N, N, N, N])
}

// ---------------------------------------------------------------------------
// The auditorium: a fan in plan, bowed front, roof rising towards the front.

/** The roof plane: 15.4 m at y = -13, 20.3 m at y = 26 (lidar). */
const hallRoof = (y: number) => 15.4 + ((y + 13) * (20.3 - 15.4)) / 39
const HALL_X0 = -17, HALL_X1 = 21
/** The bowed front: a circular arc, apex y = 28.7 at x = 2, ends y = 25.5. */
const ARC = { cx: 2, cy: -29.3, r: 58 }
const arcY = (x: number) => ARC.cy + Math.sqrt(ARC.r ** 2 - (x - ARC.cx) ** 2)
const hall: XY[] = [[HALL_X0, -12.6], [13.5, -12.6], [17.6, -9.6], [21.4, -6], [23.9, -2], [24.8, 2.5], [24.3, 7], [22.8, 11.5], [21.5, 16], [HALL_X1, 21], [HALL_X1, arcY(HALL_X1)]]
const hallSmooth: boolean[] = [false, true, true, true, true, true, true, true, true, true, false]
for (let i = 1; i < 12; i++) { const x = HALL_X1 - ((HALL_X1 - HALL_X0) * i) / 12; hall.push([x, arcY(x)]); hallSmooth.push(true) }
hall.push([HALL_X0, arcY(HALL_X0)]); hallSmooth.push(false)

/** A solid whose top follows z = top(y), with a bevelled top edge of size b. */
function slopedPrism(p: Part, r: XY[], z0: number, top: (y: number) => number, b: number, cap0: Part, smooth?: boolean[]) {
  if (area(r) <= 0) throw new Error('rings must be counter-clockwise')
  const n = r.length, vn = smooth ? vertexNormals(r, smooth) : r.map(() => null), r2 = offset(r, -b)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a = r[i], c = r[j], E = edgeN(a, c)
    const na = vn[i] ?? E, nb = vn[j] ?? E
    quadN(p, [a[0], a[1], z0], [c[0], c[1], z0], [c[0], c[1], top(c[1]) - b], [a[0], a[1], top(a[1]) - b], [na, nb, nb, na])
    const Ma = unit([na[0], na[1], 1]), Mb = unit([nb[0], nb[1], 1])
    quadN(p, [a[0], a[1], top(a[1]) - b], [c[0], c[1], top(c[1]) - b], [r2[j][0], r2[j][1], top(r2[j][1])], [r2[i][0], r2[i][1], top(r2[i][1])], [Ma, Mb, Mb, Ma])
  }
  const k = (5.0 / 39), N = unit([0, -k, 1])
  for (const [a, b2, c] of triangulate(r2)) {
    const A: V3 = [r2[a][0], r2[a][1], top(r2[a][1])], B: V3 = [r2[b2][0], r2[b2][1], top(r2[b2][1])], C: V3 = [r2[c][0], r2[c][1], top(r2[c][1])]
    cap0.tri(A, B, C, undefined, undefined, undefined, [N, N, N])
  }
}
// The top edge is a broad chamfer, which catches the light in the aerials.
slopedPrism(panel, hall, 0, hallRoof, 0.9, roof, hallSmooth)
// The low skirt filling the OSM outline's front-east corner beside the hall.
prism(panel, [[20.5, 10], [24.2, 12.6], [24.8, 21], [25, 27], [20.5, 27]], 0, 4.9, 0.3)

// ---------------------------------------------------------------------------
// The stage house and the low wings behind and beside it.

const Z_FLY = 22.6
const STAGE = rect(-14.5, -32.5, 18.5, -12.4)
prism(panel, STAGE, 0, Z_FLY - 0.9, 0.0, null)
// A cream coping band round the top, as the aerial shows.
prism(trim, offset(STAGE, 0.12), Z_FLY - 0.9, Z_FLY, 0.45)
// The long smoke-vent hatch on its roof.
prism(roof, rect(-7.5, -26, 11.5, -21), Z_FLY, Z_FLY + 2.2, 0.35)
// Back of house, the south-east loading annex, and the north-west wing.
prism(panel, rect(-17, -42.5, 16.8, -30.8), 0, 4.9, 0.35)
prism(panel, [[16.6, -38.3], [27.5, -38.3], [27.5, -17.2], [16.6, -17.2]], 0, 7.7, 0.35)
prism(panel, [[16.6, -17.2], [27.5, -17.2], [27.5, -13.4], [16.6, -12.8]], 0, 4.9, 0.3)
prism(panel, [[-25.9, -41.7], [-16.8, -41.7], [-16.8, -14], [-20, -14], [-20, -2], [-25.9, -2]], 0, 4.9, 0.35)
prism(panel, [[-27, -2], [-16.5, -2], [-16.5, 33], [-27, 33]], 0, 10.8, 0.4)

// ---------------------------------------------------------------------------
// The lobby.

const LX0 = -14.5, LX1 = 18.5, LY0 = 26, LY1 = 41.8 // upper-floor box
const GF = 40.1                                   // ground-floor glass line, set back
const Z_SLAB0 = G + 4.0, Z_SLAB1 = G + 4.8        // cream floor slab
const Z_FAS0 = 10.0, Z_TOP = 10.8                 // cream fascia (lidar roof 10.8)

// Ground floor: a glazed box set back under the upper floor, on a plinth that
// the plaza buries at the front.
prism(trim, rect(LX0 + 0.6, LY0, LX1 - 0.4, GF), 0, G, 0.0, null)
walls(win, rect(LX0 + 0.6, LY0, LX1 - 0.4, GF), G, Z_SLAB0)
// Upper floor: slab, glass band, fascia; the slab and fascia stand a little
// proud of the glass.
const upper = rect(LX0, LY0, LX1, LY1)
prism(trim, offset(upper, 0.25), Z_SLAB0, Z_SLAB1, 0.15, null)
cap(trim, offset(upper, 0.25), Z_SLAB0, false)
walls(glassUp, upper, Z_SLAB1, Z_FAS0)
prism(trim, offset(upper, 0.25), Z_FAS0, Z_TOP, 0.2, roof)
cap(trim, offset(upper, 0.25), Z_FAS0, false)
// Mullions: pale lines every ~2.5 m on the front, so it reads as a glass wall.
{
  const n = 13, w = 0.11, y = LY1 + 0.06
  for (let i = 1; i < n; i++) {
    const x = LX0 + ((LX1 - LX0) * i) / n
    panelY(trim, y, x - w, x + w, Z_SLAB1, Z_FAS0, 1)
  }
  // and on the north-west end, in front of the wing
  for (const yy of [35.5, 38.6]) panelX(trim, LX0 - 0.06, yy - w, yy + w, Z_SLAB1, Z_FAS0, -1)
}
// The south-east end of the upper floor: turquoise glazed tile, flush on the glass.
panelX(tile, LX1 + 0.05, LY0 + 0.4, LY1 - 0.9, Z_SLAB1, Z_FAS0, 1)

// The entrance canopy: a thin flat slab on four square columns (lidar 5.4 m).
{
  const C0 = -8.5, C1 = 12.5, CY = 48.4, Z0 = 4.6, Z1 = 5.4
  const slab: XY[] = rect(C0, LY1, C1, CY)
  prism(trim, slab, Z0, Z1, 0.15, roof)
  cap(trim, slab, Z0, false)
  for (const x of [-7.4, -0.8, 5.8, 11.4]) prism(trim, rect(x - 0.35, CY - 1.05, x + 0.35, CY - 0.35), 0, Z0, 0.0, null)
}
// The low cream box beside the south-east end (lidar 6 m).
prism(trim, rect(18.5, 21, 27.2, 35.2), 0, 6.0, 0.3)

// ---------------------------------------------------------------------------

// Colours from the daylight photos. The precast panels are a warm buff, pulled
// to the palette's lightness; cream trim; the roofs are pale gravel and
// concrete in the Willamor aerial and NAIP, so a light warm grey rather than
// the palette's darker roof; the lobby's upper glass reads light blue-grey,
// the recessed ground floor darker; the tile is turquoise, kept muted.
const parts = [
  { part: panel, material: finish('ovens-panel', 0xdfd0b4) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: finish('ovens-roof', 0xcfcdc6) },
  { part: tile, material: finish('ovens-tile', 0x5fb3cc) },
  { part: win, material: PALETTE.window },
  { part: glassUp, material: windowVariant(2, 0x93abbe) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Ovens Auditorium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 42, osm: 'way/836535412', height: Z_FLY + 2.2,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/ovens-auditorium.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
