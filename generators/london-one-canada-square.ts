/**
 * One Canada Square, Canary Wharf, London: procedural, CC0-1.0.
 * bun generators/london-one-canada-square.ts
 *
 * Map frame: x east, y north, z up, metres, turned to bearing 9.9 (the
 * tower's grid, from OSM's edges), so the faces are the model's north,
 * east, south and west. The origin is the lidar tower centre, near
 * the centroid of OSM's outline way/5986754 (see below); y = 0 is Canada Square's paving. Built 1988-91 (César
 * Pelli & Associates), 50 storeys.
 *
 * Published (Wikipedia "One Canada Square"; CTBUH): 235 m to the pyramid's
 * apex, 50 storeys; stainless steel cladding; the pyramid carries an
 * aircraft warning light at its apex.
 *
 * Measured, Environment Agency LIDAR Composite DSM/DTM 1 m (Open Government
 * Licence v3.0; heights above the square at 3.9 m over the box's lowest cell,
 * the dock edge):
 * - the plan: a 56 m square whose corners are notched; the 40 m wide central
 *   bay of each face stands out about 3 m and stops at 187.5 m; the core,
 *   50-53 m across, runs on to its parapet at 205.5 m;
 * - the pyramid: from about 206.5 m, its base about 41 m across (OSM's part
 *   way/432777466 is 37.7 m), apex 234.3 m (the published 235 m is used).
 * - the tower's centre is 3.7 m east and 0.8 m north (model frame) of OSM's
 *   outline centroid; OSM's outline (63 x 59 m) is wider than anything the
 *   lidar shows (the strip west of the tower is paving). The anchor is
 *   therefore the lidar tower centre: the OSM centroid moved 3.78 m east and
 *   0.15 m north (lng -0.0194693, lat 51.5049363), with the 56 m tower
 *   centred on it.
 *
 * From photos:
 * - each notched corner steps in twice (1.5 m and 3 m), full height;
 * - the facade: punched windows between continuous stainless-steel
 *   mullions, which read as vertical lines from a distance. Drawn as tall
 *   glass strips, one window column wide by four storeys, between steel
 *   piers, with a faint 0.5 m spandrel line every four storeys;
 * - the top storeys above the central bays read darker: a band of glazing
 *   on the core from 189 to 204 m;
 * - the base: a two-storey lobby behind a row of V-shaped columns on each
 *   face's central bay.
 *
 * Estimated: the step sizes at the corners (photos, lidar too coarse), window
 * columns (fourteen a central bay, as in the photos), the lobby's height and column count, storey
 * height (4.0 m).
 * Left out: the cladding's fine mullions, the plant louvres, the low
 * buildings round the base (Cabot Place, the DLR station; the map draws them).
 *
 * OSM: way/5986754 (outline), its parts way/432777467 (the shaft, 210 m)
 * and way/432777466 (the pyramid).
 *
 * Night: offices' windows glow (`window`), the lobby is `entrance`, the
 * apex light is `lamp-beacon`.
 *
 * Photos (Wikimedia Commons), EVIDENCE:
 * - "1 Canada Square From Cabot Square.jpg", Mark Gilbert, CC BY-SA 3.0 (from the west: the crown, pyramid, corners)
 * - "One Canada Square, Canary Wharf, London - geograph.org.uk - 2145747.jpg", Richard Humphrey, CC BY-SA 2.0 (the V-column base, face)
 * - "One Canada Square - Canary Wharf.jpg", Edison McCullen, CC BY-SA 4.0 (from the park, east face)
 * - "London MMB «B8 1 Canada Square.jpg", Mattbuck, CC BY-SA 3.0 (night, notched corners)
 * - "London MMB «K5 1 Canada Square.jpg", Mattbuck, CC BY-SA 4.0 (cladding close up)
 * - "London MMB «R6 River Thames and Canary Wharf.jpg", Mattbuck, CC BY-SA 4.0 (from the river, pyramid profile)
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type P2 = [number, number]
const steel = new Part()
const win = new Part()
const pyr = new Part()
const lobby = new Part()
const roof = new Part()
const lamp = new Part()

// ------------------------------------------------------------------- plan ---
const A = 28, B = 26.5, C = 23.5, BAY = 20 // face, first step, second step, central bay half-width
/** One quadrant's corner run, from the east face to the north face, rotated by k quarter turns. */
const rot = (p: P2, k: number): P2 => {
  let [x, y] = p
  for (let i = 0; i < k; i++) [x, y] = [-y, x]
  return [x, y]
}
const FULL: P2[] = [], CORE: P2[] = []
for (let k = 0; k < 4; k++) {
  for (const p of [[A, -BAY], [A, BAY], [B, BAY], [B, C], [C, C], [C, B], [BAY, B]] as P2[]) FULL.push(rot(p, k))
  for (const p of [[B, -C], [B, C], [C, C]] as P2[]) CORE.push(rot(p, k))
}
// Both rings are counter-clockwise from above; each quadrant ends where the next begins.

function earcut(pts: P2[]): [number, number, number][] {
  const idx = pts.map((_, i) => i), out: [number, number, number][] = []
  const ar = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])
  let guard = 0
  while (idx.length > 3 && guard++ < 4000) {
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      if (ar(pts[ia], pts[ib], pts[ic]) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && ar(pts[ia], pts[ib], pts[j]) >= 0 && ar(pts[ib], pts[ic], pts[j]) >= 0 && ar(pts[ic], pts[ia], pts[j]) >= 0)) continue
      out.push([ia, ib, ic]); idx.splice(i, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
function prism(p: Part, pts: P2[], z0: number, z1: number, top: Part | null, bottom: Part | null = null) {
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  const tris = earcut(pts)
  if (top) for (const [a, b, c] of tris) top.tri([pts[a][0], pts[a][1], z1], [pts[b][0], pts[b][1], z1], [pts[c][0], pts[c][1], z1])
  if (bottom) for (const [a, b, c] of tris) bottom.tri([pts[a][0], pts[a][1], z0], [pts[c][0], pts[c][1], z0], [pts[b][0], pts[b][1], z0])
}
/**
 * Window panels on every wall of a ring between z0 and z1: per wall, panels
 * of about `bay` metres between piers of `pier`, per storey group `gh`
 * tall with `sp` of spandrel. Walls under `minLen` get one narrow panel.
 */
function panels(ring: P2[], z0: number, z1: number, bay: number, pier: number, gh: number, sp: number) {
  const n = Math.round((z1 - z0) / gh), h = (z1 - z0) / n
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 1.2) continue
    const t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: P2 = [t[1], -t[0]]
    const m = Math.max(1, Math.round(L / bay)), w = L / m
    const P = (u: number, z: number): V3 => [a[0] + t[0] * u + nn[0] * 0.04, a[1] + t[1] * u + nn[1] * 0.04, z]
    const ins = Math.min(pier / 2, w * 0.2)
    for (let k = 0; k < m; k++) for (let g = 0; g < n; g++) {
      const u0 = k * w + ins, u1 = (k + 1) * w - ins, zb = z0 + g * h + sp / 2, zt = z0 + (g + 1) * h - sp / 2
      win.quad(P(u0, zb), P(u1, zb), P(u1, zt), P(u0, zt))
    }
  }
}

// ---------------------------------------------------------------- heights ---
const LOBBY = 9.0, BAYTOP = 187.5, CORETOP = 205.5, PYR0 = 206.5, APEX = 235

// ------------------------------------------------------------------- base ---
// The lobby: glazing set 2.5 m behind the central bays, flush at the corners.
{
  const inner = FULL.map(([x, y]): P2 => {
    const ax = Math.abs(x), ay = Math.abs(y)
    // pull only the central-bay walls (on |x| = A or |y| = A) back by 2.5 m
    return [ax === A ? Math.sign(x) * (A - 2.5) : x, ay === A ? Math.sign(y) * (A - 2.5) : y]
  })
  prism(lobby, inner, 0, LOBBY, null)
  // The soffit over the recess.
  for (let k = 0; k < 4; k++) {
    const q = [[A, -BAY], [A, BAY], [A - 2.5, BAY], [A - 2.5, -BAY]].map((p) => rot(p as P2, k))
    steel.quad([q[0][0], q[0][1], LOBBY], [q[3][0], q[3][1], LOBBY], [q[2][0], q[2][1], LOBBY], [q[1][0], q[1][1], LOBBY])
  }
  // V columns: seven a face, each a pair of struts from a foot at the
  // module's middle up to its edges under the soffit.
  const post = (p0: V3, p1: V3, w: number, d: P2) => {
    // A strut of square-ish section, faces flat-shaded.
    const e: V3 = [d[0], d[1], 0]
    const ax = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]] as V3
    const l = Math.hypot(...ax), u: V3 = [ax[0] / l, ax[1] / l, ax[2] / l]
    const s: V3 = [u[1] * e[2] - u[2] * e[1], u[2] * e[0] - u[0] * e[2], u[0] * e[1] - u[1] * e[0]] // across, in the face
    const c = (p: V3, i: number, j: number): V3 => [p[0] + s[0] * i * w + e[0] * j * w, p[1] + s[1] * i * w + e[1] * j * w, p[2] + s[2] * i * w + e[2] * j * w]
    const R = (p: V3) => [c(p, -1, -1), c(p, 1, -1), c(p, 1, 1), c(p, -1, 1)]
    const r0 = R(p0), r1 = R(p1)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      steel.tri(r0[i], r0[j], r1[j]); steel.tri(r0[i], r1[j], r1[i])
      steel.tri(r0[i], r1[j], r0[j]); steel.tri(r0[i], r1[i], r1[j]) // both windings: thin struts never show a hole
    }
  }
  const M = 7, mw = (2 * BAY) / M
  for (let k = 0; k < 4; k++) for (let m = 0; m < M; m++) {
    const u0 = -BAY + m * mw, um = u0 + mw / 2, u1 = u0 + mw
    const at = (u: number, z: number): V3 => { const p = rot([A - 0.5, u], k); return [p[0], p[1], z] }
    const n = rot([1, 0], k)
    post(at(um, 0.5), at(u0 + 0.4, LOBBY), 0.4, n)
    post(at(um, 0.5), at(u1 - 0.4, LOBBY), 0.4, n)
    const f = at(um, 0)
    prism(steel, [[f[0] - 0.5, f[1] - 0.5], [f[0] + 0.5, f[1] - 0.5], [f[0] + 0.5, f[1] + 0.5], [f[0] - 0.5, f[1] + 0.5]], 0, 0.7, steel) // the foot
  }
}
// ------------------------------------------------------------------ shaft ---
prism(steel, FULL, LOBBY, BAYTOP, null)
// The central bays' tops: a ledge from the face back to the core.
for (let k = 0; k < 4; k++) {
  const q = [[B, -BAY], [A, -BAY], [A, BAY], [B, BAY]].map((p) => rot(p as P2, k))
  steel.quad(...q.map((p): V3 => [p[0], p[1], BAYTOP]) as [V3, V3, V3, V3])
}
prism(steel, CORE, BAYTOP, CORETOP, null)
// Panels: tall glass strips, one window column wide and four storeys (16 m)
// tall, between continuous steel piers, with only a faint spandrel line
// every four storeys, so the shaft reads as vertical silver ribs.
panels(FULL, LOBBY + 0.5, BAYTOP - 1.0, 2.85, 1.4, 16.0, 0.5)
// The crown band: the top storeys read darker; glazing in two bands.
panels(CORE, BAYTOP + 1.5, CORETOP - 1.5, 2.65, 0.9, 15.0, 0.5)
// Parapet top and the roof terrace round the pyramid.
{
  const inner: P2[] = CORE.map(([x, y]) => [x - Math.sign(x) * 0.8, y - Math.sign(y) * 0.8])
  const rin = [...inner].reverse()
  prism(steel, rin, CORETOP - 1.2, CORETOP, null)
  for (let i = 0; i < CORE.length; i++) {
    const j = (i + 1) % CORE.length
    steel.quad([CORE[i][0], CORE[i][1], CORETOP], [CORE[j][0], CORE[j][1], CORETOP], [inner[j][0], inner[j][1], CORETOP], [inner[i][0], inner[i][1], CORETOP])
  }
  prism(roof, inner, CORETOP - 1.21, CORETOP - 1.2, roof)
}

// ---------------------------------------------------------------- pyramid ---
{
  const H = 20.5
  const base: P2[] = [[H, -H], [H, H], [-H, H], [-H, -H]]
  prism(pyr, base, CORETOP - 1.2, PYR0, null)
  const tip: V3 = [0, 0, APEX - 1.2]
  for (let i = 0; i < 4; i++) {
    const a = base[i], b = base[(i + 1) % 4]
    pyr.tri([a[0], a[1], PYR0], [b[0], b[1], PYR0], tip)
  }
  // The apex lantern and its warning light.
  prism(steel, [[0.7, -0.7], [0.7, 0.7], [-0.7, 0.7], [-0.7, -0.7]], APEX - 2.4, APEX - 0.6, steel)
  prism(lamp, [[0.45, -0.45], [0.45, 0.45], [-0.45, 0.45], [-0.45, -0.45]], APEX - 0.6, APEX, lamp)
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the stainless steel reads pale silver, a
// cool near-white; the glass a sky grey-blue; the pyramid a darker
// metallic grey, as in the river photo, so the cap separates from the body.
const parts = [
  { part: steel, material: finish('ocs-steel', 0xd8dcdf, 0.5) },
  { part: win, material: { ...PALETTE.window, color: 0xa0b3c3 } },
  { part: pyr, material: finish('ocs-pyramid', 0xa2a9af, 0.45) },
  { part: lobby, material: PALETTE.entrance },
  { part: roof, material: PALETTE.roof },
  { part: lamp, material: finish('lamp-beacon', 0xd9d4cc) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('One Canada Square', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 9.9, elevation: 0, height: APEX,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/london-one-canada-square.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
