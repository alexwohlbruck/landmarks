/**
 * Cathedral of Saint Mary of the Assumption, San Francisco — original
 * procedural geometry, CC0-1.0.
 * bun generators/sf-st-marys-cathedral.ts
 *
 * Frame: built turned to the Western Addition street grid, BEARING 351. x
 * east-ish (+x = the Gough Street side), y north-ish (+y = the Geary
 * Boulevard side), z up, metres. Origin = the centre of the shells (lidar),
 * which is the building's centre of symmetry; the OSM outline's centroid lies
 * 20 m south of it because the outline takes in the annex.
 *
 * Evidence
 * - OSM relation/7814696 (multipolygon, height 18.9): outer way/256900649 is
 *   the cathedral's square base (77 x 87 m) plus the two-storey annex to its
 *   south (106 x 37 m), with courtyards way/547205110-113. The shells are
 *   building:parts way/435831007 (77.7 m), 436473546 and 436473547 (60 m).
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m and 1 m, in this
 *   frame (/tmp/city/sf/work/sf-st-marys-cathedral). y = 0 is 55.2 m NAVD88,
 *   the lowest ground under the outline (the annex's south-east corner). The
 *   plaza deck and the annex roof are at 11.3-11.5; the base's roof slab is a
 *   75 m square (±37.6) at 24.6, rising gently to 27.6 at ±21, where the
 *   shells start. The shells rise from that 42 m square to a cross of ridges
 *   at 70.7 (59 m above the plaza: published 190 ft, 58 m) whose arms run
 *   right out to ±21 and end in sheer vertical faces. The surface between
 *   them fits a ruled surface from each arm's edge down to half a side of the
 *   square to within 1-3 m (e.g. lidar 48 vs model 48.5 at (11, 11), 38 vs 39
 *   at (19, 5)). The cross on top reads to 95 (24 m above the ridges).
 * - Published (Wikipedia; SF Planning): 1971, Pietro Belluschi and Pier
 *   Luigi Nervi with McSweeney, Ryan and Lee; eight hyperbolic-paraboloid
 *   shell segments rising from a square to a cross; base 255 ft square; the
 *   Gyorgy Kepes stained glass runs up the four sides and across the top as a
 *   cross; Italian travertine cladding.
 * - Commons daylight photos: "The Cathedral of Saint Mary of the Assumption,
 *   San Francisco, CA, USA (9482870704).jpg" (l0da_ralta, CC BY 2.0, the
 *   shells from a corner), "Cathedral of Saint Mary of the Assumption and the
 *   moon, San Francisco, California, USA.jpg" (Semiautonomous, CC BY-SA 4.0,
 *   the entrance front), "Saint Mary of the Assumption - San Francisco, CA -
 *   05.jpg", "- 06.jpg", "- 11.jpg" and "- 13.jpg" (Daderot, CC0, the fronts
 *   head-on and the slot close up), "St Mary's Cathedral - San Francisco.jpg"
 *   (Gndawydiak, public domain, from the side), "Cathedral of Saint Mary of
 *   the Assumption.jpg" (Fred Hsu, CC BY-SA 3.0). NAIP 2022 (public domain)
 *   for the plan: white base roof, the shells, the annex and its courtyards.
 *
 * Estimated: the arms' width (4.6 m, from the lidar's ridge), the shells'
 * concave flare (a ruled surface whose height runs t + 0.9 t²(1 - t) down each
 * ruling, fitted to the lidar), the base's walls set 4 m in under the slab,
 * the glass walls and dark entrance panels on each side (the four sides are
 * drawn alike), the annex's window bays, the cross's crossbar (at 88, 7 m
 * across).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 351
const ANCHOR = { lng: -122.42537, lat: 37.78423 }
const stone = new Part(), shell = new Part(), win = new Part(), glass = new Part(), roof = new Part(), metal = new Part()

// --- Dimensions (m above the lowest ground) ---
const DECK = 11.4 // plaza deck and annex roof
const SLAB = 37.6, SLAB0 = 22.6, SLAB1 = 24.6, WALL = 33.6 // the base
const R = 21, H = 2.3, ZB = 27.6, ZT = 70.7 // the shells: base half-size, arm half-width, base and ridge heights
const CROSS = 94.5

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

/** An axis-aligned box with chamfered vertical edges. */
function block(part: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = part, bottom: Part | null = null) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  for (let i = 1; i < 7; i++) {
    if (top) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
    if (bottom) bottom.tri([r[0][0], r[0][1], z0], [r[i + 1][0], r[i + 1][1], z0], [r[i][0], r[i][1], z0])
  }
}
/** The four quarter-turns of the plan, for the building's fourfold symmetry. */
const turn = (k: number) => ([x, y, z]: V3): V3 => {
  const c = Math.round(Math.cos((k * Math.PI) / 2)), s = Math.round(Math.sin((k * Math.PI) / 2))
  return [c * x - s * y, s * x + c * y, z]
}
/** A flat panel on the face x = `x` (facing +x) of the unturned plan, turned by k. */
function panel(part: Part, k: number, x: number, y0: number, y1: number, z0: number, z1: number) {
  const T = turn(k)
  part.quad(T([x, y0, z0]), T([x, y1, z0]), T([x, y1, z1]), T([x, y0, z1]))
}

// ---------------------------------------------------------------------------
// The shells: eight ruled (hyperbolic-paraboloid-like) segments. Segment
// (arm along +x, the +y side): rulings run from the arm's edge, (H..R, H) at
// the ridge, down to half the base square's side, (R, R..H) at ZB. Its last
// ruling is the vertical edge of the slot at the arm's end; its first, the
// crease from (H, H) to the corner (R, R) it shares with its neighbour.
const NS = 10, NT = 12
const g = (t: number) => t + 0.9 * t * t * (1 - t) // the flare toward the base, fitted to the lidar
function shellPoint(s: number, t: number): V3 {
  const top: XY = [H + (R - H) * s, H], bot: XY = [R, R - (R - H) * s]
  return [top[0] + (bot[0] - top[0]) * t, top[1] + (bot[1] - top[1]) * t, ZT - (ZT - ZB) * g(t)]
}
function shellNormal(s: number, t: number): V3 {
  const e = 1e-4
  const ds = sub(shellPoint(Math.min(1, s + e), t), shellPoint(Math.max(0, s - e), t))
  const dt = sub(shellPoint(s, Math.min(1, t + e)), shellPoint(s, Math.max(0, t - e)))
  const n = unit(crs(ds, dt))
  const p = shellPoint(s, t)
  // outward: away from a point inside the shell, under its centre
  return dot(n, sub(p, [0, 0, ZB - 10])) < 0 ? [-n[0], -n[1], -n[2]] : n
}
for (let k = 0; k < 4; k++) for (const mirror of [1, -1]) {
  const T = turn(k)
  const M = ([x, y, z]: V3): V3 => T([x, y * mirror, z])
  for (let i = 0; i < NS; i++) for (let j = 0; j < NT; j++) {
    const st: [number, number][] = [[i / NS, j / NT], [(i + 1) / NS, j / NT], [(i + 1) / NS, (j + 1) / NT], [i / NS, (j + 1) / NT]]
    const pts = st.map(([s, t]) => M(shellPoint(s, t)))
    const nrm = st.map(([s, t]) => M(shellNormal(s, t)))
    // wind each triangle to face the way its normals point
    for (const [a, b, c] of [[0, 1, 2], [0, 2, 3]]) {
      const n = crs(sub(pts[b], pts[a]), sub(pts[c], pts[a]))
      if (dot(n, nrm[a]) >= 0) shell.tri(pts[a], pts[b], pts[c], undefined, undefined, undefined, [nrm[a], nrm[b], nrm[c]])
      else shell.tri(pts[a], pts[c], pts[b], undefined, undefined, undefined, [nrm[a], nrm[c], nrm[b]])
    }
  }
}
// The stained glass: a slot up each arm's end, and the cross along the ridges.
for (let k = 0; k < 4; k++) {
  panel(win, k, R + 0.04, -H, H, ZB, ZT)
  const T = turn(k)
  glass.quad(T([H, -H, ZT + 0.03]), T([R, -H, ZT + 0.03]), T([R, H, ZT + 0.03]), T([H, H, ZT + 0.03]))
  // pale fins framing the slot
  for (const y of [-H, H]) {
    const o = Math.sign(y) * 0.35
    shell.quad(T([R, y, ZB]), T([R, y + o, ZB]), T([R, y + o, ZT + 0.4]), T([R, y, ZT + 0.4]))
    shell.quad(T([R, y + o, ZB]), T([R + 0.5, y + o, ZB]), T([R + 0.5, y + o, ZT + 0.4]), T([R, y + o, ZT + 0.4]))
    shell.quad(T([R + 0.5, y + o, ZB]), T([R + 0.5, y, ZB]), T([R + 0.5, y, ZT + 0.4]), T([R + 0.5, y + o, ZT + 0.4]))
    const a = T([R, y, ZT + 0.4]), b = T([R, y + o, ZT + 0.4]), c = T([R + 0.5, y + o, ZT + 0.4]), d = T([R + 0.5, y, ZT + 0.4])
    shell.quad(a, b, c, d); shell.quad(a, d, c, b)
  }
}
glass.quad([-H, -H, ZT + 0.03], [H, -H, ZT + 0.03], [H, H, ZT + 0.03], [-H, H, ZT + 0.03])

// The cross: a slim shaft and crossbar.
block(metal, -0.4, 0.4, -0.4, 0.4, ZT, CROSS, 0.1)
block(metal, -3.5, 3.5, -0.35, 0.35, 87.4, 88.6, 0.1, metal, metal)

// ---------------------------------------------------------------------------
// The base: travertine walls set in under a thick white roof slab, with
// glass walls and a dark entrance panel on each side; the slab's roof rises
// gently to the shells.
block(stone, -WALL, WALL, -WALL, WALL, DECK - 0.2, SLAB0, 0.6, null)
block(shell, -SLAB, SLAB, -SLAB, SLAB, SLAB0, SLAB1, 0.6, null, shell)
for (let k = 0; k < 4; k++) {
  const T = turn(k)
  shell.quad(T([SLAB, -SLAB + 0.6, SLAB1]), T([SLAB, SLAB - 0.6, SLAB1]), T([R, R, ZB]), T([R, -R, ZB]))
  shell.tri(T([SLAB, SLAB - 0.6, SLAB1]), T([SLAB - 0.6, SLAB, SLAB1]), T([R, R, ZB]))
  panel(win, k, WALL + 0.05, -4.2, 4.2, DECK + 0.3, SLAB0 - 0.6)
  for (const sgn of [-1, 1]) {
    const y0 = sgn * 11, y1 = sgn * 27.5
    panel(win, k, WALL + 0.05, Math.min(y0, y1), Math.max(y0, y1), DECK + 0.3, SLAB0 - 0.3)
  }
}

// ---------------------------------------------------------------------------
// The podium and annex: the OSM outline with its two courtyards, to the deck.
{
  const xs = [-54, -46.7, -39, -35.6, 34.3, 37.6, 45.6, 52.4]
  const ys = [-85.3, -73.2, -58.5, -48.5, 38.7]
  const inRect = (x: number, y: number, r: number[]) => x > r[0] && x < r[1] && y > r[2] && y < r[3]
  const solid = (x: number, y: number) =>
    (inRect(x, y, [-39, 37.6, -48.5, 38.7]) || inRect(x, y, [-54, 52.4, -85.3, -48.5])) &&
    !inRect(x, y, [-46.7, -35.6, -73.2, -58.5]) && !inRect(x, y, [34.3, 45.6, -73.2, -58.5])
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const x0 = xs[i], x1 = xs[i + 1], y0 = ys[j], y1 = ys[j + 1], cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    if (!solid(cx, cy)) continue
    roof.quad([x0, y0, DECK], [x1, y0, DECK], [x1, y1, DECK], [x0, y1, DECK])
    stone.quad([x0, y1, 0], [x1, y1, 0], [x1, y0, 0], [x0, y0, 0])
    // walls where the neighbouring cell is open, facing out of this one
    const edges: [V3, V3, boolean][] = [
      [[x0, y0, 0], [x1, y0, 0], !solid(cx, y0 - 0.1)],
      [[x1, y0, 0], [x1, y1, 0], !solid(x1 + 0.1, cy)],
      [[x1, y1, 0], [x0, y1, 0], !solid(cx, y1 + 0.1)],
      [[x0, y1, 0], [x0, y0, 0], !solid(x0 - 0.1, cy)],
    ]
    for (const [a, b, open] of edges) {
      if (!open) continue
      stone.quad(a, b, [b[0], b[1], DECK], [a[0], a[1], DECK])
      // the annex's two storeys of windows, a panel per ~6.5 m bay on the outside walls
      if (cy > -48.5) continue
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 6.5)), w = L / n
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy * 0.05, ny = -ux * 0.05
      for (let q = 0; q < n; q++) for (const [z0, z1] of [[2.6, 5.0], [6.8, 9.6]]) {
        const s0 = q * w + 1.0, s1 = (q + 1) * w - 1.0
        const P = (s: number, z: number): V3 => [a[0] + ux * s + nx, a[1] + uy * s + ny, z]
        win.quad(P(s0, z0), P(s1, z0), P(s1, z1), P(s0, z1))
      }
    }
  }
  // a parapet line round the deck's edge would be ledge-scale detail; left out
}

const parts = [
  { part: stone, material: PALETTE.stone },
  { part: shell, material: finish('stmary-travertine', 0xf1efe9) },
  { part: win, material: PALETTE.window },
  { part: glass, material: PALETTE.glass },
  { part: roof, material: PALETTE.roof },
  { part: metal, material: PALETTE.metal },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Cathedral of Saint Mary of the Assumption', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: CROSS,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['relation/7814696', 'way/435831007', 'way/436473546', 'way/436473547'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-st-marys-cathedral.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
