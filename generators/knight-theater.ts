/**
 * Knight Theater, Levine Center for the Arts, Charlotte (2010) — procedural, CC0-1.0.
 * bun generators/knight-theater.ts
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 315°: the
 * model's +y runs north-west along the outline's long side (way/131139733,
 * 68 × 40 m), so the lobby on the forecourt off Levine Avenue of the Arts is
 * the model's south face. The anchor is the outline's centroid.
 *
 * What makes it the Knight is its lobby: a four-storey wall of glass waved
 * in plan into three convex bays meeting at sharp notches, glass the full
 * height between a low brushed-aluminium name band over the glazed ground
 * floor and a broad aluminium cornice band that follows the wave, with
 * slim vertical mullions. Behind it the theatre steps as the lidar shows: the
 * auditorium at 20.5 m (level with the lobby), the fly tower over the stage
 * at 27.5 m, and low back-of-house wings at 12.5 m to the east and along
 * Church Street, all in taupe brick with an aluminium coping. Between the
 * lobby and the Bechtler a dark glass block rises to the Bechtler's height
 * (25 m); only its west face shows from the forecourt.
 *
 * Evidence
 * - Measured, Mecklenburg County 2016 lidar (USGS 3DEP NC Phase 4, 1 m):
 *   every height above. OSM's single 27 m was the fly tower only.
 * - OSM: the plan (way/131139733, no building:parts). The lidar puts the west
 *   wall ~2.5 m further west than OSM; the model keeps OSM.
 * - Photos: Commons "North Carolina Blumenthal Performing Arts Center" 1-3
 *   (Knight Foundation, CC BY-SA 2.0), the lobby from the forecourt; Flickr
 *   James Willamor 4681876601 and 6964767914 (CC BY-SA 2.0), the lobby, the
 *   dark glass block and the Bechtler from the Tryon corner; Mapillary
 *   JordanAnderson 2022 (CC BY-SA 4.0) along Levine Avenue: the taupe brick
 *   flank with tall ground-floor glazing and poster cases.
 * - Estimated: the Church Street openings, the exact plan of the S-curve
 *   bays (from photos), the lobby ground 0.8 m above the lowest ground (DEM).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const brick = new Part(), alu = new Part(), lobbyGlass = new Part()
const win = new Part(), roof = new Part(), door = new Part()

type XY = [number, number]
const G = 0.8 // lobby ground above the model's y = 0

const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

// ---------------------------------------------------------------------------
// Polygon helpers: rings are counter-clockwise from above.

function area(r: XY[]) { let a = 0; r.forEach((p, i) => { const q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] }); return a / 2 }
/** Ear clipping, enough for the few small rings here. */
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 1000) {
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
/** The ring moved outward by d (inward if negative), mitred at the corners. */
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
/** Outward wall normals: per edge, or averaged at a vertex for smooth runs. */
function edgeN(a: XY, b: XY): V3 { return unit([b[1] - a[1], -(b[0] - a[0]), 0]) }
/** Vertical walls round a ring from z0 to z1. */
function walls(p: Part, r: XY[], z0: number, z1: number, open = false) {
  const n = r.length
  for (let i = 0; i < (open ? n - 1 : n); i++) {
    const a = r[i], b = r[(i + 1) % n], N = edgeN(a, b)
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [N, N, N, N])
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
/** A solid with a chamfered top edge of size b. */
function prism(p: Part, r: XY[], z0: number, z1: number, b: number, top: Part = p) {
  walls(p, r, z0, z1 - b)
  const r2 = offset(r, -b), n = r.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, N = edgeN(r[i], r[j]), M = unit([N[0], N[1], 1])
    quadN(p, [r[i][0], r[i][1], z1 - b], [r[j][0], r[j][1], z1 - b], [r2[j][0], r2[j][1], z1], [r2[i][0], r2[i][1], z1], [M, M, M, M])
  }
  cap(top, r2, z1)
}

// ---------------------------------------------------------------------------
// The theatre, in four brick masses at their lidar heights: the auditorium
// behind the lobby, the fly tower over the stage, and the low back-of-house
// wings to the east and along Church Street.

const Z_HALL = 20.5, Z_FLY = 27.5, Z_LOW = 12.5, Z_EAST = 25
const Y_FLY0 = 6.5, Y_FLY1 = 21.2, X_WING = 10.5
const HALL: XY[] = [[-19.7, -28], [X_WING, -28], [X_WING, Y_FLY0], [-19.7, Y_FLY0]]
const FLY: XY[] = [[-19.7, Y_FLY0], [X_WING, Y_FLY0], [X_WING, Y_FLY1], [-19.7, Y_FLY1]]
const REAR: XY[] = [[-19.7, Y_FLY1], [14.0, Y_FLY1], [14.4, 35.9], [-1.9, 36.1], [-2.2, 41.8], [-11.9, 42.2], [-19.7, 36.7]]
const EAST: XY[] = [[X_WING, -22], [20.6, -22], [21.1, Y_FLY1], [X_WING, Y_FLY1]]
// The lobby's east half behind the curved bays, up to the hall's height.
const LOBBY_E: XY[] = [[1.4, -31.2], [20.2, -31.2], [20.6, -22], [X_WING, -22], [X_WING, -28], [1.4, -28]]
for (const r of [HALL, FLY, REAR, EAST, LOBBY_E]) if (area(r) <= 0) throw new Error('rings must be counter-clockwise')
/** A brick mass with an aluminium coping, bevelled on top. */
function mass(r: XY[], z: number) {
  prism(brick, r, 0, z - 0.9, 0.35, roof)
  prism(alu, offset(r, -0.35), z - 0.9, z, 0.3, roof)
}
mass(HALL, Z_HALL)
mass(FLY, Z_FLY)
mass(REAR, Z_LOW)
mass(EAST, Z_LOW)
mass(LOBBY_E, Z_HALL)

// The dark glass block between the lobby and the Bechtler, as tall as the
// Bechtler: a `window` curtain wall with a few aluminium floor lines.
{
  const B: XY[] = [[1.4, -39.6], [20.0, -41.4], [20.2, -31.2], [1.4, -31.2]]
  if (area(B) <= 0) throw new Error('ring')
  walls(win, B, 0, Z_EAST - 1.0)
  prism(alu, B, Z_EAST - 1.0, Z_EAST, 0.3, roof)
  for (const z of [G + 6.2, 12.4, 18.6]) {
    const x = 1.4 - 0.06, N: V3 = [-1, 0, 0], E: V3 = [1, 0, 0], xe = 20.1 + 0.06
    quadN(alu, [x, -31.4, z], [x, -39.4, z], [x, -39.4, z + 0.8], [x, -31.4, z + 0.8], [N, N, N, N])
    quadN(alu, [xe, -41.2, z], [xe, -31.4, z], [xe, -31.4, z + 0.8], [xe, -41.2, z + 0.8], [E, E, E, E])
    // The south face, against the Bechtler: shown only where it stands clear.
    const S = unit([-1.8, -18.6, 0]), o = 0.06
    quadN(alu, [1.4 + S[0] * o, -39.6 + S[1] * o, z], [20.0 + S[0] * o, -41.4 + S[1] * o, z],
      [20.0 + S[0] * o, -41.4 + S[1] * o, z + 0.8], [1.4 + S[0] * o, -39.6 + S[1] * o, z + 0.8], [S, S, S, S])
  }
}

// Punched windows on the brick flanks: tall ground-floor openings and
// poster cases along Levine Avenue (west), and openings on Church Street
// (north), as in the street views.
{
  const W: V3 = [-1, 0, 0]
  for (let i = 0; i < 6; i++) {
    const y0 = -22.5 + i * 9, y1 = y0 + 5.6, x = -19.7 - 0.04
    quadN(win, [x, y1, G + 0.3], [x, y0, G + 0.3], [x, y0, G + 5.2], [x, y1, G + 5.2], [W, W, W, W])
  }
  const Nn = unit([0, 1, 0])
  for (const [x0, x1] of [[2, 6], [8, 12]] as XY[]) {
    const y = 36.05
    quadN(win, [x1, y, G + 0.6], [x0, y, G + 0.6], [x0, y, G + 4.2], [x1, y, G + 4.2], [Nn, Nn, Nn, Nn])
  }
}

// ---------------------------------------------------------------------------
// The lobby: an S-curve in plan, from the west corner to the east end.

const Y_BACK = -28
/** The lobby front, west to east, counter-clockwise round the bay's front. */
function lobbyFront(inset = 0): { p: XY; n: V3 }[] {
  const out: { p: XY; n: V3 }[] = []
  // West end: the glass wraps the corner off the block, then three convex
  // bays in a wave across the face, meeting at sharp notches.
  out.push({ p: [-19.7 + inset, Y_BACK], n: [-1, 0, 0] })
  const X0 = -19.7, X1 = 1.4, BASE = -33.2, SAG = 1.7, BAYS = 3, SEG = 8
  const h = (X1 - X0) / BAYS / 2, r = (h * h + SAG * SAG) / (2 * SAG), al = Math.asin(h / r)
  for (let k = 0; k < BAYS; k++) {
    const cx = X0 + h * (2 * k + 1), cy = BASE - SAG + r
    for (let i = 0; i <= SEG; i++) {
      const t = -Math.PI / 2 - al + (2 * al * i) / SEG
      const n: V3 = [Math.cos(t), Math.sin(t), 0]
      const q: XY = [cx + (r - inset) * n[0], cy + (r - inset) * n[1]]
      // Keep the end points on the block's faces.
      if (k === 0 && i === 0) q[0] = X0 + inset
      if (k === BAYS - 1 && i === SEG) q[0] = X1 - inset
      out.push({ p: q, n })
    }
  }
  return out
}

/** A curved band of the front between z0 and z1, pushed out by `d`. */
function frontBand(p: Part, z0: number, z1: number, inset: number) {
  const f = lobbyFront(inset)
  for (let i = 0; i < f.length - 1; i++) {
    const a = f[i], b = f[i + 1]
    // Sharp edges at the notch and the ends, smooth round the bays.
    const kink = Math.abs(a.n[0] * b.n[0] + a.n[1] * b.n[1]) < 0.75
    const nb = kink ? edgeN(a.p, b.p) : b.n, na = kink ? edgeN(a.p, b.p) : a.n
    quadN(p, [a.p[0], a.p[1], z0], [b.p[0], b.p[1], z0], [b.p[0], b.p[1], z1], [a.p[0], a.p[1], z1], [na, nb, nb, na])
  }
}
/** The flat top or underside of a band, between the front curve and the block. */
function frontLid(p: Part, z: number, inset: number, up: boolean) {
  const f = lobbyFront(inset).map((q) => q.p)
  // The front runs west to east; close it back along the block face.
  // f runs west → east along the south and starts on the block face, so
  // returning along y = -28 closes it counter-clockwise.
  const ring: XY[] = [...f, [1.4 - inset, Y_BACK]]
  cap(p, ring, z, up)
}

const Z_G1 = G + 5.0      // top of the glazed ground floor
const Z_BAND = G + 7.2    // top of the name band
const Z_TOP = Z_HALL       // the lobby's coping, level with the hall (lidar)
const Z_COPE0 = Z_TOP - 2.6 // bottom of the broad cornice band

// Ground floor: glazing set back under the band, doors in the middle.
frontBand(lobbyGlass, G, Z_G1, 0.9)
{
  const f = lobbyFront(0.85)
  // Doors: the flat run and the shoulder of the east bay.
  for (let i = 0; i < f.length - 1; i++) {
    const a = f[i], b = f[i + 1]
    if (a.p[0] < -11 || b.p[0] > 1.0) continue
    const N = edgeN(a.p, b.p)
    quadN(door, [a.p[0] + N[0] * 0.04, a.p[1] + N[1] * 0.04, G], [b.p[0] + N[0] * 0.04, b.p[1] + N[1] * 0.04, G],
      [b.p[0] + N[0] * 0.04, b.p[1] + N[1] * 0.04, G + 3.0], [a.p[0] + N[0] * 0.04, a.p[1] + N[1] * 0.04, G + 3.0], [N, N, N, N])
  }
}
// The name band: brushed aluminium, a little proud of the glass, chamfered.
frontBand(alu, Z_G1, Z_BAND - 0.3, 0)
{
  const a = lobbyFront(0), b = lobbyFront(0.3)
  for (let i = 0; i < a.length - 1; i++) {
    const n0 = unit([a[i].n[0], a[i].n[1], 1]), n1 = unit([a[i + 1].n[0], a[i + 1].n[1], 1])
    quadN(alu, [a[i].p[0], a[i].p[1], Z_BAND - 0.3], [a[i + 1].p[0], a[i + 1].p[1], Z_BAND - 0.3],
      [b[i + 1].p[0], b[i + 1].p[1], Z_BAND], [b[i].p[0], b[i].p[1], Z_BAND], [n0, n1, n1, n0])
  }
}
frontLid(alu, Z_G1, 0, false)

// The glass: one full-height tier between the name band and the cornice.
frontBand(lobbyGlass, Z_BAND, Z_COPE0, 0)
// Slim vertical mullions every ~3.9 m along the wave, two to a bay: a few pale lines, as the
// photos show, so the bay reads as a glass wall and not a solid drum.
{
  const f = lobbyFront(-0.06)
  let run = 0, next = 1.2
  for (let i = 0; i < f.length - 1; i++) {
    const a = f[i].p, b = f[i + 1].p, L = Math.hypot(b[0] - a[0], b[1] - a[1])
    while (next <= run + L) {
      const t = (next - run) / L, c: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const u: XY = [(b[0] - a[0]) / L * 0.1, (b[1] - a[1]) / L * 0.1], N = edgeN(a, b)
      quadN(alu, [c[0] - u[0], c[1] - u[1], Z_BAND], [c[0] + u[0], c[1] + u[1], Z_BAND],
        [c[0] + u[0], c[1] + u[1], Z_COPE0], [c[0] - u[0], c[1] - u[1], Z_COPE0], [N, N, N, N])
      next += 3.9
    }
    run += L
  }
}
// West end wall of the bay, glass too (it wraps round the corner).
// The coping: aluminium, proud and chamfered on top like the band.
frontBand(alu, Z_COPE0, Z_TOP - 0.3, 0)
{
  const a = lobbyFront(0), b = lobbyFront(0.3)
  for (let i = 0; i < a.length - 1; i++) {
    const n0 = unit([a[i].n[0], a[i].n[1], 1]), n1 = unit([a[i + 1].n[0], a[i + 1].n[1], 1])
    quadN(alu, [a[i].p[0], a[i].p[1], Z_TOP - 0.3], [a[i + 1].p[0], a[i + 1].p[1], Z_TOP - 0.3],
      [b[i + 1].p[0], b[i + 1].p[1], Z_TOP], [b[i].p[0], b[i].p[1], Z_TOP], [n0, n1, n1, n0])
  }
}
frontLid(alu, Z_COPE0, 0, false)
frontLid(roof, Z_TOP, 0.3, true)

// ---------------------------------------------------------------------------

// Colours from the daylight photos: taupe brick pulled to the palette's
// lightness; brushed aluminium a cool light grey; the lobby glass reads light
// blue-grey by day (a lighter window variant, so it still glows at night).
const parts = [
  { part: brick, material: finish('knight-brick', 0xd4c4b2) },
  { part: alu, material: finish('aluminium', 0xd3d6d8, 0.5) },
  { part: lobbyGlass, material: windowVariant(2, 0x9fb6c8) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Knight Theater', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 315, osm: 'way/131139733', height: Z_FLY,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/knight-theater.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
