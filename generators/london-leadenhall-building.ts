/**
 * The Leadenhall Building (122 Leadenhall Street, "the Cheesegrater"), City of
 * London — original procedural geometry, CC0-1.0.
 * bun generators/london-leadenhall-building.ts
 *
 * Map frame, unturned: the building's faces run within 0.3° of the compass, so
 * BEARING 0; +x east, +y north, z up, metres. Origin = centroid of the OSM
 * outline way/309413981.
 *
 * Evidence
 * - OSM way/309413981 (outline, 48 levels, height 224.5) and its parts, read in
 *   this frame (bin/frame.py):
 *     way/309413982  main wedge, x ±24.3, y -27.6..9.6, 28.5–224.5 m;
 *     way/309415710  north slab, x ±24.3, y 9.6..17.7, ground–224.5 m;
 *     way/309415707  service core, x -21.5..21.3, y 17.5..30 with a notch
 *                    x -7.8..8.4 at y < 20.8, 196 m;
 *     way/1138764582 lift shafts, x -21.5..-5.5, y 27..30, 130 m;
 *     way/1138764583 lift shafts, x -5.5..5.4, y 27..30, 65 m;
 *     way/717955963–65 the reception floors in the undercroft: y 1.2..9.6 from
 *                    4 m, and x ±20.4, y -23.5..9.6 from 20.5 to 28.5 m.
 *   So the inclined south face runs from y = -27.6 at 28.5 m to y = 9.6 at the
 *   top: 37.2 m over 196 m, 10.7° off vertical (published: about 10°).
 * - Environment Agency LIDAR Composite DSM/DTM 1 m, Open Government Licence
 *   v3.0. The composite here predates the finished tower over the wedge (the
 *   inclined face reads as ground), but it catches the top: 222–227 m above
 *   the lowest ground over y 10..17 (the flat roof strip), and the core at
 *   197–207 m. Ground falls ~3 m from the north-east to the south-west corner.
 * - Published (Wikipedia, CTBUH): 225 m (224.5 to the roof), 52 storeys,
 *   Rogers Stirk Harbour + Partners, 2014; perimeter braced "megaframe" with
 *   mega-levels every seven storeys (28 m); a 28 m (seven-storey) open public
 *   undercroft; the service core with exposed yellow steel and the lifts on
 *   the north side.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   "Cheesegrater and Gherkin.jpg", Colin, CC BY-SA 4.0 — the south face from
 *     the south and above: seven tiers, X bracing in four bays, dark
 *     mega-level bands, the dark edge truss and the core strip on the north;
 *   "London MMB »2B1 122 Leadenhall Street.jpg", mattbuck, CC BY-SA 4.0 — from
 *     the south-east: the chevron edge truss along the north edge of the east
 *     face, the lower core beside it, yellow steel at its foot;
 *   "22 Bishopsgate and 122 Leadenhall Street from Bloomberg London.jpg",
 *     The wub, CC BY-SA 4.0 — the wedge in profile from the west;
 *   "The Leadenhall and Lloyd's Buildings.jpg", Maksim Sokolov, CC BY-SA 4.0 —
 *     the undercroft's great diagonals from below;
 *   "London 122 Leadenhall Street lifts 1.jpg", Ymblanter, CC BY-SA 4.0 — the
 *     core's yellow steel and orange lift cars behind glass;
 *   "City of London as seen from The Shard, 2026.jpg", ThatsTheBoss, CC0.
 *
 * Measured: plan and heights (OSM parts; top and core heights checked against
 * lidar). Published: 225 m, 28 m tiers, the 10° slope. Estimated from photos:
 * four X bays a tier on the south face and one on each side face (members
 * drawn 1.25 m wide, 0.9 m proud of the glass), the edge truss (3.6 m wide,
 * a chevron every 9.3 m), the mega-level bands (1.4 m, charcoal), the core's
 * yellow frame on a 7 m × 12 m grid on its north face (east and west faces
 * read as dark glass from the street; only corner columns are drawn). The undercroft's members are simplified to
 * X braces on its south, east and west sides. Not modelled: the lift cars, the
 * rooftop gantry crane, the escalators.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, windowVariant, PALETTE } from './palette'

const BEARING = 0
const ANCHOR = { lng: -0.0822949, lat: 51.51387 }

const glass = new Part() // the wedge's curtain wall
const coreGlass = new Part()
const steel = new Part() // megaframe, edge trusses
const dark = new Part() // mega-level bands, soffit, roof
const yellow = new Part()
const lobby = new Part()

type Vec = V3
const add = (a: Vec, b: Vec, s = 1): Vec => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossV = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: Vec): Vec => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A quad wound so its normal points away from `inside`. */
function quadOut(p: Part, q: Vec[], inside: Vec) {
  const n = crossV(sub(q[1], q[0]), sub(q[2], q[0]))
  const m: Vec = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, (q[0][2] + q[2][2]) / 2]
  if (dot(n, sub(m, inside)) >= 0) p.quad(q[0], q[1], q[2], q[3])
  else p.quad(q[0], q[3], q[2], q[1])
}

/** A rectangular member from a to b: w across, d deep along `out`; ends left open (they meet other members). */
function beam(p: Part, a: Vec, b: Vec, out: Vec, w: number, d: number, caps = false) {
  const dir = unit(sub(b, a))
  const s = unit(crossV(dir, out))
  const n = unit(crossV(s, dir))
  const c = (o: Vec, i: number, j: number): Vec => { const q = add(add(o, s, (i * w) / 2), n, (j * d) / 2); return [q[0], q[1], Math.max(0, q[2])] } // nothing below the ground
  const ring = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  const mid: Vec = add(a, sub(b, a), 0.5)
  for (let k = 0; k < 4; k++) {
    const [i0, j0] = ring[k], [i1, j1] = ring[(k + 1) % 4]
    // inside point: the axis, near this face's middle
    quadOut(p, [c(a, i0, j0), c(a, i1, j1), c(b, i1, j1), c(b, i0, j0)], mid)
  }
  if (caps) for (const [o, sgn] of [[a, -1], [b, 1]] as [Vec, number][]) {
    const q = ring.map(([i, j]) => c(o, i, j))
    quadOut(p, q, add(o, dir, -sgn))
  }
}

/** An axis-aligned box, all six faces. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, skipBottom = true) {
  const P = (x: number, y: number, z: number): Vec => [x, y, z]
  const c: Vec = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  const faces: Vec[][] = [
    [P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)],
    [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)],
    [P(x1, y1, z0), P(x0, y1, z0), P(x0, y1, z1), P(x1, y1, z1)],
    [P(x0, y1, z0), P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1)],
    [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)],
  ]
  if (!skipBottom) faces.push([P(x0, y0, z0), P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0)])
  for (const f of faces) quadOut(p, f, c)
}

// --- Dimensions (OSM, see header) ---
const HX = 24.3 // half-width east-west
const YN = 17.7 // north face of the wedge (and its north slab)
const Z0 = 28.5 // underside of the office floors: top of the undercroft
const TOP = 224.5
const YS0 = -27.6, YS1 = 9.6 // the inclined south face at Z0 and at the top
const ys = (z: number) => YS0 + ((YS1 - YS0) * (z - Z0)) / (TOP - Z0)
const TIER = (TOP - Z0) / 7 // 28 m mega-levels
const tierZ = Array.from({ length: 8 }, (_, k) => Z0 + k * TIER)

// --- The wedge: glass box with the inclined south face ---
{
  const r0: Vec[] = [[-HX, YS0, Z0], [HX, YS0, Z0], [HX, YN, Z0], [-HX, YN, Z0]]
  const r1: Vec[] = [[-HX, YS1, TOP], [HX, YS1, TOP], [HX, YN, TOP], [-HX, YN, TOP]]
  glass.loft([r0, r1])
  dark.cap(r1, true) // the flat roof strip
  dark.cap(r0, false) // soffit over the undercroft
  // The north slab runs down to the ground behind the undercroft.
  const n0: Vec[] = [[-HX, 9.6, 0], [HX, 9.6, 0], [HX, YN, 0], [-HX, YN, 0]]
  const n1: Vec[] = n0.map(([x, y]) => [x, y, Z0] as Vec)
  lobby.loft([n0, n1])
  // Roof parapet: a low dark rim.
  box(dark, -HX, HX, YS1 - 0.3, YS1 + 1.2, TOP - 0.2, TOP + 1.5)
  box(dark, -HX, HX, YN - 1.2, YN + 0.3, TOP - 0.2, TOP + 1.5)
}

// --- Undercroft: reception floors and the open braced base ---
box(lobby, -20.4, 20.4, 1.2, 9.6, 0, 20.5)
box(glass, -20.4, 20.4, -23.5, 9.6, 20.5, Z0 - 0.01)
{
  const W = 2.0, D = 1.6
  // corner columns, and X braces on the south, east and west sides
  for (const x of [-HX, HX]) {
    beam(steel, [x, YS0, 0], [x, YS0, Z0], [0, -1, 0], W + 0.4, D + 0.4)
    beam(steel, [x, 9.6, 0], [x, 9.6, Z0], [x > 0 ? 1 : -1, 0, 0], W, D)
  }
  for (let j = 0; j < 4; j++) {
    const xa = -HX + (2 * HX * j) / 4, xb = -HX + (2 * HX * (j + 1)) / 4
    beam(steel, [xa, YS0, 0], [xb, YS0, Z0], [0, -1, 0], W, D)
    beam(steel, [xb, YS0, 0], [xa, YS0, Z0], [0, -1, 0], W, D)
  }
  for (const x of [-HX, HX]) {
    const o: Vec = [x > 0 ? 1 : -1, 0, 0]
    for (let j = 0; j < 2; j++) {
      const ya = YS0 + ((9.6 - YS0) * j) / 2, yb = YS0 + ((9.6 - YS0) * (j + 1)) / 2
      beam(steel, [x, ya, 0], [x, yb, Z0], o, W, D)
      beam(steel, [x, yb, 0], [x, ya, Z0], o, W, D)
    }
  }
}

// --- Megaframe on the wedge: X bracing per tier, proud of the glass ---
{
  const W = 1.25, D = 0.9, OFF = 0.55 // centre line this far out from the glass
  const sn = unit([0, -(TOP - Z0), YS1 - YS0]) // south face normal (tilted up)
  const onSouth = (x: number, z: number): Vec => add([x, ys(z), z], sn, OFF)
  const onSide = (x: number, y: number, z: number): Vec => [x + Math.sign(x) * OFF, y, z]
  for (let k = 0; k < 7; k++) {
    const za = tierZ[k], zb = tierZ[k + 1]
    for (let j = 0; j < 4; j++) {
      const xa = -HX + 0.9 + ((2 * HX - 1.8) * j) / 4, xb = -HX + 0.9 + ((2 * HX - 1.8) * (j + 1)) / 4
      beam(steel, onSouth(xa, za), onSouth(xb, zb), sn, W, D)
      beam(steel, onSouth(xb, za), onSouth(xa, zb), sn, W, D)
    }
    // east and west faces: one X between the edge truss and the inclined edge
    for (const x of [-HX, HX]) {
      const o: Vec = [Math.sign(x), 0, 0]
      const yn = YN - 3.8
      beam(steel, onSide(x, ys(za) + 0.9, za), onSide(x, yn, zb), o, W, D)
      beam(steel, onSide(x, yn, za), onSide(x, ys(zb) + 0.9, zb), o, W, D)
    }
  }
  // Mega-level bands: dark rings at every tier line, all round the wedge.
  for (let k = 1; k < 7; k++) {
    const z = tierZ[k], h = 0.7, o = 1.0
    const y = ys(z)
    beam(dark, [-HX - o, y, z], [HX + o, y, z], sn, 2 * h, 2 * o + 0.3, true)
    for (const x of [-HX, HX]) beam(dark, [x, y, z], [x, YN, z], [Math.sign(x), 0, 0], 2 * h, 2 * o + 0.3)
  }
  // Edge trusses: chevron ladders along the north edge of the east and west faces, full height.
  for (const x of [-HX, HX]) {
    const o: Vec = [Math.sign(x), 0, 0]
    const ya = YN - 3.6, yb = YN - 0.2
    const at = (y: number, z: number): Vec => [x + Math.sign(x) * 0.6, y, z]
    beam(steel, at(ya, 0), at(ya, TOP), o, 1.0, 1.1)
    beam(steel, at(yb, 0), at(yb, TOP), o, 1.2, 1.1)
    const step = TIER / 3
    for (let z = Z0 - 2 * step; z + step <= TOP + 0.1; z += step) {
      beam(steel, at(ya, z), at(yb, z + step / 2), o, 0.7, 0.8)
      beam(steel, at(yb, z + step / 2), at(ya, z + step), o, 0.7, 0.8)
    }
  }
  // Corner columns along the inclined edges.
  for (const x of [-HX, HX]) beam(steel, add([x, YS0, Z0], sn, 0.3), add([x, YS1, TOP], sn, 0.3), sn, 1.4, 1.2)
}

// --- Service core: glass boxes on a bold yellow steel frame ---
{
  const boxes: [number, number, number, number, number][] = [
    [-21.5, 21.3, 20.8, 27.1, 196],
    [-21.5, -7.8, YN, 20.8, 196],
    [8.4, 21.3, YN, 20.8, 196],
    [5.4, 21.3, 27.1, 30.0, 196],
    [-21.5, -5.5, 27.1, 30.0, 130],
    [-5.5, 5.4, 27.1, 30.0, 65],
  ]
  for (const [x0, x1, y0, y1, h] of boxes) box(coreGlass, x0, x1, y0, y1, 0, h)
  // Yellow frame on the visible faces: columns and girders standing just proud.
  const grid = (face: 'N' | 'E' | 'W', a0: number, a1: number, c: number, h: number) => {
    const out: Vec = face === 'N' ? [0, 1, 0] : face === 'E' ? [1, 0, 0] : [-1, 0, 0]
    const P = (a: number, z: number): Vec => (face === 'N' ? [a, c + 0.35, z] : [c + out[0] * 0.35, a, z])
    const n = Math.max(1, Math.round((a1 - a0) / 7))
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n
      beam(yellow, P(a, 0), P(a, h), out, i === 0 || i === n ? 1.2 : 0.8, 0.7)
    }
    for (let z = 12; z < h - 1; z += 12) beam(yellow, P(a0, z), P(a1, z), out, 0.9, 0.7)
    beam(yellow, P(a0, h - 0.5), P(a1, h - 0.5), out, 1.0, 0.7)
  }
  grid('N', 5.4, 21.3, 30.0, 196)
  grid('N', -21.5, -5.5, 30.0, 130)
  grid('N', -5.5, 5.4, 30.0, 65)
  // above the lift shafts, the core's own north face
  {
    const out: Vec = [0, 1, 0]
    for (const x of [-21.5, -13.5, -5.5, 5.4]) beam(yellow, [x, 27.45, 65], [x, 27.45, 196], out, 1.0, 0.7)
    for (let z = 72; z < 196; z += 12) beam(yellow, [-21.5, 27.45, z], [5.4, 27.45, z], out, 0.9, 0.7)
  }
  // East and west: the yellow steel shows only at the corners and the foot; the rest reads as dark glass.
  for (const [x, o] of [[21.3, 1], [-21.5, -1]] as [number, number][]) {
    const out: Vec = [o, 0, 0]
    for (const y of [YN + 0.6, 29.4]) beam(yellow, [x + o * 0.35, y, 0], [x + o * 0.35, y, x > 0 ? 196 : 130], out, 1.2, 0.7)
    beam(yellow, [x + o * 0.35, YN, 12], [x + o * 0.35, 30, 12], out, 1.0, 0.7)
  }
}

const parts = [
  { part: glass, material: windowVariant(2, 0xa7bccb) },
  { part: coreGlass, material: PALETTE.window },
  { part: steel, material: finish('megaframe-steel', 0xc9cccd, 0.6) },
  { part: dark, material: finish('mega-level', 0x4f555c) },
  { part: yellow, material: finish('core-yellow', 0xe2b13c) },
  { part: lobby, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log('triangles', triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('The Leadenhall Building', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP + 1.5,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/309413981', 'way/309413982', 'way/309415707', 'way/309415710', 'way/717955963', 'way/717955964', 'way/717955965', 'way/1138764582', 'way/1138764583'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/london-leadenhall-building.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
