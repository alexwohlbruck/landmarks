/**
 * Chicago Water Tower (1869, W. W. Boyington) — original procedural
 * geometry, CC0-1.0.
 * bun generators/chi-water-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of the OSM outline way/130147025,
 * 41.897171,-87.624437. The outline's edges run at 88.5° / 178.5°, so the
 * catalog bearing is 358.5 and the tower is square to this frame.
 *
 * Identity: the castellated square base with an octagonal turret at each
 * corner; the second stage with its round corner turrets and a steep gable
 * on every face; the corbelled, crenellated band with corner bartizans where
 * the square turns octagonal; the tall tapering octagonal shaft; the
 * crenellated crown with its pinnacles; the lantern and the dark bell dome.
 *
 * Evidence:
 *  - Every dimension is from the HABS measured drawings, IL-1041 (Paul
 *    Berry, 1994, public domain; Wikimedia Commons, sheets 2 and 3):
 *    structure 51 ft (15.5 m) square over the corner turrets, building
 *    43 ft (13.1 m), corner turrets 8 ft octagons centred 21.4 ft from the
 *    axis; second stage 20 ft with corner towers to 25 ft; octagon 15'6" at
 *    92 ft; observation floor 151'6", cupola base 161'6", cupola top 173'6",
 *    mast 182'6" (55.6 m overall; OSM height 55.4 agrees, Wikipedia 56 m).
 *    Heights not dimensioned on the sheet (parapets, turret tops, the
 *    stage-2 gable, the bartizan band, the crown) were measured off the
 *    south elevation against its own scale bar, to about ±0.3 m.
 *  - OSM building:parts (way/1283005798-804) agree with the HABS plan: the
 *    base, the four corner turrets, the stage-2 block and the shaft.
 *  - Portals: N, S and W have the gabled entrance bay (HABS plan A-A); the
 *    east front lost its steps when Michigan Avenue was widened in 1920 and
 *    shows a window (Daniel Schwen's photo), so it is drawn plain.
 *  - Colour: buff Joliet limestone, cream-grey in every photo, a warm
 *    finish near `stone`; the dome reads dark grey (all photos; OSM's
 *    roof:colour #9db8a2 is not borne out), drawn at charcoal.
 *
 * Photos (Wikimedia Commons): Chicago_Water_Tower_2.jpg (Daniel Schwen,
 * CC BY-SA 4.0); Chicago_Water_Tower_view_from_west.jpeg (Dough4872,
 * CC BY-SA 4.0); Chicago_Water_Tower,_Michigan_Avenue,_Streeterville (w_lemay,
 * CC0); Chicago_water_tower_as_seen_from_Hancock_Tower.jpg (NoTalentHack,
 * CC BY-SA 3.0). No commercial imagery.
 *
 * Left out: the rusticated stonework, the small pinnacles beside the
 * portals, the finial poles on the gables, the corner beads of the shaft.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), win = new Part(), door = new Part(), dome = new Part(), roof = new Part()

type XY = [number, number]
const ringAt = (pts: XY[], z: number): V3[] => pts.map(([x, y]) => [x, y, z])
/** A closed prism over a convex counter-clockwise ring. */
function prism(p: Part, pts: XY[], z0: number, z1: number, top: Part | null = p, bottom = false) {
  p.loft([ringAt(pts, z0), ringAt(pts, z1)])
  if (top) top.cap(ringAt(pts, z1), true)
  if (bottom) p.cap(ringAt(pts, z0), false)
}
/** Regular octagon, flats facing the axes; r is the apothem. */
function oct(cx: number, cy: number, r: number): XY[] {
  const R = r / Math.cos(Math.PI / 8)
  return Array.from({ length: 8 }, (_, i) => {
    const a = Math.PI / 8 + i * Math.PI / 4
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as XY
  })
}
/** A rectangle with chamfered corners. */
function rect(cx: number, cy: number, hx: number, hy: number, c = .25): XY[] {
  return [[cx - hx + c, cy - hy], [cx + hx - c, cy - hy], [cx + hx, cy - hy + c], [cx + hx, cy + hy - c],
    [cx + hx - c, cy + hy], [cx - hx + c, cy + hy], [cx - hx, cy + hy - c], [cx - hx, cy - hy + c]]
}
const box = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
  prism(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1)

/** Merlons round a convex ring: n per edge, on the ring, `t` deep inward. */
function crenels(p: Part, pts: XY[], z: number, h: number, n: number, t = .45, fill = .55) {
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
    const nx = uy, ny = -ux // outward for a counter-clockwise ring
    for (let k = 0; k < n; k++) {
      const s0 = L * (k + .5 - fill / 2) / n, s1 = L * (k + .5 + fill / 2) / n
      const q = (s: number, d: number): XY => [a[0] + ux * s - nx * d, a[1] + uy * s - ny * d]
      prism(p, [q(s0, 0), q(s1, 0), q(s1, t), q(s0, t)], z, z + h)
    }
  }
}

/** A face of a square of half-size h: s across (left to right from outside), z up, d out. */
function face(dir: number, h: number) {
  const n: XY = [[0, -1], [1, 0], [0, 1], [-1, 0]][dir] as XY
  const t: XY = [-n[1], n[0]]
  return (s: number, z: number, d = 0): V3 => [n[0] * (h + d) + t[0] * s, n[1] * (h + d) + t[1] * s, z]
}
/** A flat pointed-arch panel on a face. */
function lancet(p: Part, f: (s: number, z: number, d?: number) => V3, s: number, w: number, z0: number, z1: number, d = .05) {
  const spring = z1 - w * .55, pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, spring]]
  for (let k = 1; k <= 3; k++) {
    const a = k / 4 * Math.PI / 2 // right flank, rising to the point
    pts.push([s + w / 2 - w / 2 * (1 - Math.cos(a)) * 1.0, spring + (z1 - spring) * Math.sin(a)])
  }
  pts.push([s, z1])
  for (let k = 3; k >= 1; k--) {
    const a = k / 4 * Math.PI / 2
    pts.push([s - w / 2 + w / 2 * (1 - Math.cos(a)), spring + (z1 - spring) * Math.sin(a)])
  }
  pts.push([s - w / 2, spring])
  const v = pts.map(([a, b]) => f(a, b, d))
  for (let i = 1; i < v.length - 1; i++) p.tri(v[0], v[i], v[i + 1])
}

// Stage 1: the base block, parapet and crenels (HABS: 43 ft square).
const B = 6.55
prism(stone, rect(0, 0, B, B, .3), 0, 6.1, null)
prism(stone, rect(0, 0, B + .15, B + .15, .3), 6.1, 6.7, roof)
crenels(stone, [[-B, -B], [B, -B], [B, B], [-B, B]], 6.7, .7, 6)
// Portals on N, S, W; windows on every face, the east one in the middle.
for (let dir = 0; dir < 4; dir++) {
  const f = face(dir, B)
  const portal = dir !== 1
  for (const s of portal ? [-3.6, 3.6] : [-3.6, 0, 3.6]) lancet(win, f, s, 1.35, 1.4, 4.3)
  if (!portal) continue
  // A proud bay with a steep gable, the door in a pointed arch.
  const D = .8, W = 2.1
  const q = (s: number, z: number, d: number) => f(s, z, d)
  stone.quad(q(-W, 0, D), q(W, 0, D), q(W, 6.4, D), q(-W, 6.4, D))
  stone.quad(q(W, 0, D), q(W, 0, 0), q(W, 6.4, 0), q(W, 6.4, D))
  stone.quad(q(-W, 0, 0), q(-W, 0, D), q(-W, 6.4, D), q(-W, 6.4, 0))
  stone.tri(q(-W, 6.4, D), q(W, 6.4, D), q(0, 8.6, D))
  // Gable coping, sloping back to the wall.
  stone.quad(q(W, 6.4, D), q(W, 6.4, 0), q(0, 8.6, 0), q(0, 8.6, D))
  stone.quad(q(-W, 6.4, 0), q(-W, 6.4, D), q(0, 8.6, D), q(0, 8.6, 0))
  lancet(door, (s, z, d = 0) => q(s, z, D + d), 0, 1.9, .5, 4.6)
}
// Corner turrets: 8 ft octagons, a corbelled ring, a crenellated cap.
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const cx = sx * 6.5, cy = sy * 6.5
  prism(stone, oct(cx, cy, 1.22), 0, 11.5, null)
  prism(stone, oct(cx, cy, 1.45), 8.7, 9.5)
  stone.loft([ringAt(oct(cx, cy, 1.22), 10.9), ringAt(oct(cx, cy, 1.55), 11.5)])
  prism(stone, oct(cx, cy, 1.55), 11.5, 12.3, roof)
  crenels(stone, oct(cx, cy, 1.55), 12.3, .6, 1, .35, .5)
}

// Stage 2: 20 ft block with round corner turrets and a gable on each face.
const S2 = 3.05
prism(stone, rect(0, 0, S2, S2, .2), 6.1, 15.4, roof)
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const cx = sx * 3.05, cy = sy * 3.05
  prism(stone, oct(cx, cy, .78), 6.7, 15.0, null)
  stone.loft([ringAt(oct(cx, cy, .78), 14.6), ringAt(oct(cx, cy, .98), 15.0)])
  prism(stone, oct(cx, cy, .98), 15.0, 15.5, roof)
  crenels(stone, oct(cx, cy, .98), 15.5, .5, 1, .3, .5)
}
for (let dir = 0; dir < 4; dir++) {
  const f = face(dir, S2), D = .45, W = 2.25
  stone.tri(f(-W, 11.6, D), f(W, 11.6, D), f(0, 16.0, D))
  stone.quad(f(W, 11.6, D), f(W, 11.6, 0), f(0, 16.0, 0), f(0, 16.0, D))
  stone.quad(f(-W, 11.6, 0), f(-W, 11.6, D), f(0, 16.0, D), f(0, 16.0, 0))
  stone.quad(f(-W, 11.6, 0), f(W, 11.6, 0), f(W, 11.6, D), f(-W, 11.6, D))
  for (const s of [-.75, 0, .75]) lancet(win, f, s, .5, 8.0, s ? 10.6 : 11.2)
}

// Stage 3: the square shaft, the corbelled crenellated band and bartizans.
const S3 = 2.85
prism(stone, rect(0, 0, S3, S3, .2), 15.4, 19.6, null)
stone.loft([ringAt(rect(0, 0, S3, S3, .2), 19.6), ringAt(rect(0, 0, 3.2, 3.2, .2), 20.0)])
prism(stone, rect(0, 0, 3.2, 3.2, .2), 20.0, 21.2, roof)
crenels(stone, [[-3.2, -3.2], [3.2, -3.2], [3.2, 3.2], [-3.2, 3.2]], 21.2, .6, 5, .35)
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const cx = sx * 3.0, cy = sy * 3.0, r = .72
  const ring = oct(cx, cy, r)
  // Corbelled to a point below, a cap and crenels above.
  for (let i = 0; i < 8; i++) stone.tri([cx, cy, 17.4], ringAt(ring, 18.6)[(i + 1) % 8], ringAt(ring, 18.6)[i])
  prism(stone, ring, 18.6, 22.0, null)
  prism(stone, oct(cx, cy, .86), 22.0, 22.4, roof)
  crenels(stone, oct(cx, cy, .86), 22.4, .45, 1, .28, .5)
}
for (let dir = 0; dir < 4; dir++) {
  const f = face(dir, S3)
  for (const s of [-1.2, 1.2]) lancet(win, f, s, .45, 16.4, 17.8)
}

// The octagonal shaft: 5.1 m across flats at its foot, 3.5 m under the
// crown (15'6" at 92 ft, HABS), with slit windows staggered up the faces.
const Z0 = 21.2, Z1 = 43.5, R0 = 2.55, R1 = 1.75
const rAt = (z: number) => R0 + (R1 - R0) * (z - Z0) / (Z1 - Z0)
stone.loft([ringAt(oct(0, 0, R0), Z0), ringAt(oct(0, 0, R1), Z1)])
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4
  const n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
  for (const z of i % 2 ? [27, 39] : [33]) {
    const pt = (s: number, zz: number): V3 => [n[0] * (rAt(zz) + .05) + t[0] * s, n[1] * (rAt(zz) + .05) + t[1] * s, zz]
    win.quad(pt(-.3, z), pt(.3, z), pt(.3, z + 2.2), pt(-.3, z + 2.2))
  }
}
// Crown: corbelled out, a crenellated band, pinnacles at the eight corners.
stone.loft([ringAt(oct(0, 0, R1), Z1), ringAt(oct(0, 0, 2.3), 44.4)])
prism(stone, oct(0, 0, 2.3), 44.4, 46.5, roof)
crenels(stone, oct(0, 0, 2.3), 46.5, .6, 1, .35, .45)
for (const [x, y] of oct(0, 0, 2.3)) {
  const k = Math.hypot(x, y), cx = x / k * 2.2, cy = y / k * 2.2
  prism(stone, oct(cx, cy, .32), 44.4, 47.6, null)
  const top = ringAt(oct(cx, cy, .32), 47.6)
  for (let i = 0; i < 8; i++) stone.tri(top[i], top[(i + 1) % 8], [cx, cy, 48.3])
}

// Lantern, glazed on all eight faces, a cornice, the bell dome and finial.
const LR = 1.65
prism(stone, oct(0, 0, LR), 46.5, 49.6, null)
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4, n: XY = [Math.cos(a), Math.sin(a)], t: XY = [-n[1], n[0]]
  const pt = (s: number, z: number): V3 => [n[0] * (LR + .05) + t[0] * s, n[1] * (LR + .05) + t[1] * s, z]
  win.quad(pt(-.48, 47.3), pt(.48, 47.3), pt(.48, 49.1), pt(-.48, 49.1))
}
prism(stone, oct(0, 0, 1.9), 49.6, 50.0, null)
{
  const prof: [number, number][] = [[50.0, 1.9], [50.0, 1.78], [50.9, 1.76], [51.6, 1.55], [52.2, 1.1], [52.65, .55], [52.9, .15]]
  const N = 16
  const rings = prof.map(([z, r]) => Array.from({ length: N }, (_, i): V3 => [r * Math.cos(2 * Math.PI * i / N), r * Math.sin(2 * Math.PI * i / N), z]))
  dome.loft(rings)
  const last = rings[rings.length - 1]
  for (let i = 0; i < N; i++) dome.tri(last[i], last[(i + 1) % N], [0, 0, 53.0])
  const spike = Array.from({ length: 6 }, (_, i): V3 => [.14 * Math.cos(i * Math.PI / 3), .14 * Math.sin(i * Math.PI / 3), 52.9])
  for (let i = 0; i < 6; i++) dome.tri(spike[i], spike[(i + 1) % 6], [0, 0, 55.6])
}

const parts = [
  { part: stone, material: finish('joliet-limestone', 0xe6dcc4) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
  { part: roof, material: PALETTE.roof },
  { part: dome, material: finish('dome-slate', 0x5a6068, .6) },
]
const triangles = parts.reduce((s, p) => s + p.part.triangles, 0)
const glb = writeGlb('Chicago Water Tower', parts, {
  frame: 'Y up, -Z north, +X east; metres; ground anchor', anchor: [41.897171, -87.624437], bearing: 358.5,
})
if (triangles > 5000 || glb.length > 250000) throw new Error(`Budget exceeded: ${triangles} triangles / ${glb.length} bytes`)
const out = process.argv[2] ?? new URL('../models/chi-water-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
