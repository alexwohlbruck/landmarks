/**
 * Jay Pritzker Pavilion (Frank Gehry, 2004), Millennium Park, Chicago —
 * original procedural geometry, CC0-1.0.
 *
 *   bun generators/chi-pritzker-pavilion.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of the OSM
 * outline way/126978545 (41.883512, -87.621892), on the ground. The
 * outline's edges run at 89° / 179°, so the catalog bearing is 359. The stage
 * faces south (-y), over the seating bowl and the Great Lawn.
 *
 * Identity: the brushed-steel "headdress" — a crown of huge curled ribbons
 * peeling back from the stage opening and rising to about 40 m — over the
 * tall glass proscenium doors, with folded steel wings sweeping down to the
 * ground on either side, all in front of a plain, wide, flat-roofed stage
 * house.
 *
 * Form: each curl is a solid lobe wrapped by a thick peeling sheet (part of
 * a tilted cylinder, flaring and turning as it rises; outside bright, inside
 * a shade darker), the curls overlapping into one crown on a massed core,
 * over a concave canopy panel that frames the stage opening. The wings are
 * folded steel wedges. The stage house is the OSM outline as three blocks.
 *
 * Evidence:
 *  - Published (Wikipedia, "Jay Pritzker Pavilion"): proscenium framed by
 *    the steel headdress, about 120-139 ft (37-42 m) tall; glass proscenium
 *    doors about 50 ft (15 m) tall and 100 ft (30 m) wide; orchestra shell
 *    100 ft wide, 50 ft tall; trellis 600 x 300 ft of crossing pipes 12-20
 *    in across.
 *  - OSM way/126978545: the stage building, 93 x 21 m (NAIP shows the
 *    centre 34 m of roof distinct). OSM also traces the headdress in plan
 *    (way/764598205, silver metal roof, reaching 27-38 m south of the
 *    outline's centre) and the steel wings (764598206-209). Traced from
 *    imagery, those lean forward with height, so the model's headdress
 *    reaches about 28 m south and only the wings follow OSM closely.
 *  - USGS NAIP orthophoto: the stage house roof, the ribbons projecting
 *    south of it, the seating bowl and the trellis south of that.
 *  - Photos (Wikimedia Commons): Jay Pritzker Pavilion, Chicago ... DD 01,
 *    DD 02, DD 04 (Diego Delso, CC BY-SA 3.0; DD 04 is square-on from the
 *    seats); Jay_Pritzker_Pavilion_Oct_2022_1/2/3 (Sea Cow, CC BY-SA 4.0,
 *    aerials from the south); 2005-10-13 chicago above millennium park
 *    (J. Crocker, attribution; from above, showing the stage house roof and
 *    the ribbons' bracing behind); Jay_Pritzker_Pavilion_Chicago_HiRes.jpg
 *    (Andreborgeslopes, CC BY-SA 3.0). Ribbon sizes and positions are
 *    measured off DD 04 against the 30 m doors, and off the aerials.
 *
 * Estimated: the stage house heights (21 m centre, 7 m wings), every
 * curl's size, lean and turn (drawn as eight solid curls, each wrapped by
 * a peeling sheet, on a massed core over a concave canopy: far fewer than
 * the real crowd of panels), the wings' folds. Left out: the trellis over the
 * lawn — at 0.3-0.5 m its pipes vanish at map scale, and as bolder bands
 * across 180 m of lawn it would misdraw the park; the seating; the lawn; the
 * bracing behind the ribbons; the loudspeaker rig.
 */
import { Part, addGltfTriangles, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const STEEL = finish('stainless', 0xd9dee2, 0.4)
const STEEL_IN = finish('stainless-2', 0xb9c0c6, 0.4)
// The canopy's concave face over the stage, always in shade from the seats.
const SHADE = finish('stainless-3', 0x9ea4a9, 0.4)

const shade = new Part()
const steel = new Part(), steelIn = new Part(), stone = new Part(), roof = new Part(), win = new Part()

type XY = [number, number]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** A box with bevelled top edges, `top` taking the roof. */
function block(x0: number, x1: number, y0: number, y1: number, h: number, b = 0.5) {
  const ring = (i: number, z: number): V3[] => [[x0 + i, y0 + i, z], [x1 - i, y0 + i, z], [x1 - i, y1 - i, z], [x0 + i, y1 - i, z]]
  stone.loft([ring(0, 0), ring(0, h - b), ring(b, h)])
  roof.cap(ring(b, h), true)
}

// The stage house: the OSM outline as a tall centre and two low wings.
block(-17, 17, -10.6, 10.0, 21)
block(-46.4, -17.2, -9.4, 9.2, 7)
block(17.2, 46.8, -8.0, 10.2, 7)

// The proscenium: a deep stone frame round the 30 x 15 m glass doors.
const FRONT = -10.6
block(-19, 19, FRONT - 2.2, FRONT, 18, 0.4)
win.quad([-15, FRONT - 2.25, 0.8], [15, FRONT - 2.25, 0.8], [15, FRONT - 2.25, 15.5], [-15, FRONT - 2.25, 15.5])

/**
 * A curled ribbon: part of a cylinder of radius `r` about an axis rising from
 * `base` along `axis`, sweeping `sweep` radians from `a0`, flaring by `flare`
 * and turning by `twist` towards its top, `h` tall and `t` thick. The outside
 * of the curl is bright steel, the inside a shade darker.
 */
function ribbon(base: V3, axis: V3, r: number, a0: number, sweep: number, h: number,
  { flare = 0.25, twist = 0.5, t = 0.6, nu = 10, nv = 4, inside = steelIn } = {}) {
  const ax = unit(axis)
  const e1 = unit(crossv(ax, Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]))
  const e2 = crossv(ax, e1)
  const grid = (off: number) => Array.from({ length: nv + 1 }, (_, j) => {
    const v = j / nv
    const rr = r * (1 + flare * v) + off
    return Array.from({ length: nu + 1 }, (_, i) => {
      const a = a0 + sweep * (i / nu) + twist * v
      return add(add(base, mul(ax, h * v)), add(mul(e1, rr * Math.cos(a)), mul(e2, rr * Math.sin(a))))
    })
  })
  const outer = grid(t / 2), inner = grid(-t / 2)
  const out = new Part(), inn = new Part(), edge = new Part()
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      out.quad(outer[j][i], outer[j][i + 1], outer[j + 1][i + 1], outer[j + 1][i])
      inn.quad(inner[j][i + 1], inner[j][i], inner[j + 1][i], inner[j + 1][i + 1])
    }
  }
  // The four edges of the sheet.
  for (let i = 0; i < nu; i++) {
    edge.quad(outer[nv][i], outer[nv][i + 1], inner[nv][i + 1], inner[nv][i])
    edge.quad(inner[0][i], inner[0][i + 1], outer[0][i + 1], outer[0][i])
  }
  for (let j = 0; j < nv; j++) {
    edge.quad(outer[j][0], outer[j + 1][0], inner[j + 1][0], inner[j][0])
    edge.quad(inner[j][nu], inner[j + 1][nu], outer[j + 1][nu], outer[j][nu])
  }
  merge(steel, out, 50)
  merge(inside, inn, 50)
  merge(steel, edge, 30)
}

/** Smooth-shade `src` (crease in degrees) into `dst`. */
function merge(dst: Part, src: Part, crease: number) {
  const tmp = new Part()
  addGltfTriangles(tmp, new Float32Array(src.pos), Uint32Array.from({ length: src.pos.length / 3 }, (_, i) => i), { creaseDegrees: crease })
  dst.pos.push(...tmp.pos)
  dst.nrm.push(...tmp.nrm)
  dst.uv.push(...tmp.uv)
}

/** A thick flat plate over a convex quad (counter-clockwise from above or outside). */
function plate(a: V3, b: V3, c: V3, d: V3, t = 0.6) {
  const n = unit(crossv([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [d[0] - a[0], d[1] - a[1], d[2] - a[2]]))
  const top = [a, b, c, d], bot = top.map((p) => add(p, mul(n, -t)))
  steel.quad(top[0], top[1], top[2], top[3])
  steelIn.quad(bot[3], bot[2], bot[1], bot[0])
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    steel.quad(bot[k], bot[l], top[l], top[k])
  }
}

// The headdress: a packed row of solid, overlapping curls across the whole
// 70 m front, rising off the proscenium frame, tallest at the middle and
// leaning further out towards the ends. Each curl is a closed lobe (an
// elliptic section lofted up a leaning axis, flaring and turning as it rises,
// capped top and bottom) wrapped on its outer face by a peeling sheet whose
// top edge stands proud of the lobe and flares outward, as the real panels
// peel back from the stage. Mirrored about the stage's axis, as the massing
// nearly is (the panels themselves are not).
const Y0 = FRONT - 2.2

/** A closed lobe: elliptic sections up a leaning axis, capped both ends. */
function lobe(base: V3, axis: V3, rx: number, ry: number, h: number, spin: number, twist: number, flare = 0.2) {
  const ax = unit(axis), n = 12, levels = 5
  const rings: V3[][] = []
  for (let j = 0; j <= levels; j++) {
    const v = j / levels
    // Full at mid-height, drawn in a little at the base and rounded over at
    // the top, so it reads as a rolled sheet rather than a can.
    const k = (1 + flare * v) * (j === 0 ? 0.85 : j === levels ? 0.7 : 1)
    const c = add(base, mul(ax, h * (j === levels ? v - 0.04 : v)))
    const a0 = spin + twist * v
    rings.push(Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2
      const x = rx * k * Math.cos(a), y = ry * k * Math.sin(a)
      return [c[0] + x * Math.cos(a0) - y * Math.sin(a0), c[1] + x * Math.sin(a0) + y * Math.cos(a0), c[2]] as V3
    }))
  }
  const p = new Part()
  p.loft(rings)
  p.cap(rings[levels], true)
  p.cap(rings[0], false)
  merge(steel, p, 55)
}

type C = { x: number; y: number; z: number; h: number; rx: number; ry: number; spin: number; lean: XY; twist: number }
const half: C[] = [
  { x: 3.8, y: Y0 - 8, z: 26, h: 15, rx: 6.2, ry: 5.0, spin: 0.5, lean: [0.12, -0.16], twist: 0.5 },
  { x: 11.2, y: Y0 - 6.5, z: 24.5, h: 13.5, rx: 5.6, ry: 4.8, spin: -0.3, lean: [0.28, -0.14], twist: 0.6 },
  { x: 18.5, y: Y0 - 7.5, z: 21, h: 12.5, rx: 5.2, ry: 4.5, spin: 0.4, lean: [0.45, -0.12], twist: 0.5 },
  { x: 25.5, y: Y0 - 4.5, z: 15, h: 12, rx: 4.6, ry: 4.0, spin: -0.5, lean: [0.62, -0.06], twist: 0.4 },
]
for (const c of half) {
  for (const s of [1, -1]) {
    const base: V3 = [s * c.x, c.y, c.z], axis: V3 = [s * c.lean[0], c.lean[1], 1]
    lobe(base, axis, c.rx, c.ry, c.h, s * c.spin, s * c.twist)
    // The peeling sheet round the lobe's outer front: its plan direction is
    // out and forward, (s * 0.7, -0.7); ribbon angle a = φ - π/2.
    const phi = Math.atan2(-0.75, s * 0.65)
    const mid = phi - Math.PI / 2
    ribbon(add(base, [0, 0, -0.5]), axis, Math.max(c.rx, c.ry) * 0.95, mid - 1.15, 2.3, c.h + 2.5,
      { flare: 0.45, twist: s * 0.35, t: 0.5, nu: 8, nv: 4 })
  }
}
// The core the curls grow from: a broad, low dome of panels filling the
// crown, so it reads as one massed headdress rather than separate sheets.
{
  const rings: V3[][] = []
  const prof: [number, number, number][] = [[18.5, 0.55, 0.8], [22, 0.95, 1.0], [27, 1.0, 1.0], [32, 0.85, 0.85], [35.5, 0.45, 0.5]]
  for (const [z, kx, ky] of prof) {
    rings.push(Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      const c = Math.cos(a), sn = Math.sin(a)
      return [24 * kx * Math.sign(c) * Math.abs(c) ** 0.8, Y0 - 8 + 6 * ky * Math.sign(sn) * Math.abs(sn) ** 0.8, z] as V3
    }))
  }
  const core = new Part()
  core.loft(rings)
  core.cap(rings[rings.length - 1], true)
  core.cap(rings[0], false)
  merge(steelIn, core, 50)
}
// The canopy over the stage opening: one broad concave panel springing from
// the top of the frame and sweeping forward and up under the curls. Its
// concave face, towards the seats, is in shade (the darker steel), as in
// Delso's front photo. A quarter cylinder about an axis in front of and
// level with the frame top: a = π at the frame, 3π/2 at its forward top.
ribbon([-22, Y0 - 11, 17.5], [1, 0, 0], 11, Math.PI, Math.PI / 2, 44, { flare: 0, twist: 0, t: 0.7, nu: 7, nv: 4, inside: shade })
// The outer flags: flat plates flung up and out at each end.
for (const s of [-1, 1]) {
  const P = (x: number, y: number, z: number): V3 => [s * x, y, z]
  const pts: V3[] = [P(30, Y0 + 1, 11), P(40, Y0 - 1, 19), P(37, Y0 - 3, 27), P(29, Y0 - 3, 20)]
  if (s > 0) plate(pts[0], pts[1], pts[2], pts[3])
  else plate(pts[3], pts[2], pts[1], pts[0])
}

// The wings: folded steel sweeping from the proscenium's corners down and
// forward to the ground either side, over OSM's wing outlines (764598206-
// 209), which reach the seating at y = -30. Each is drawn as a wedge with a
// kinked ridge: a face turned to the seats and one turned outward.
function solid(points: V3[], faces: number[][], part: Part) {
  const c = points.reduce((acc, q) => add(acc, mul(q, 1 / points.length)), [0, 0, 0] as V3)
  for (const f of faces) {
    let [a, b, d] = f.map((i) => points[i])
    const n = crossv([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [d[0] - a[0], d[1] - a[1], d[2] - a[2]])
    const out = [a[0] - c[0], a[1] - c[1], a[2] - c[2]]
    if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0) [b, d] = [d, b]
    part.tri(a, b, d)
  }
}
for (const s of [-1, 1]) {
  const P = (x: number, y: number, z: number): V3 => [s * x, y, z]
  // 0 top at the proscenium, 1 the ridge's knee, 2 its foot far forward,
  // 3 the front edge's near foot, 4 the outer foot by the stage house.
  const pts = [P(19, Y0 + 0.2, 14), P(30, -19, 7.5), P(43, -29.5, 0), P(20, -21, 0), P(37, -8.5, 0)]
  solid(pts, [[0, 3, 1], [1, 3, 2], [0, 1, 4], [1, 2, 4], [0, 4, 3]], steel)
}

const parts = [
  { part: steel, material: STEEL },
  { part: steelIn, material: STEEL_IN },
  { part: shade, material: SHADE },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
]
const tris = parts.reduce((s, p) => s + p.part.triangles, 0)
if (tris > 6500) throw new Error(`over budget: ${tris} triangles`)
const glb = writeGlb('Jay Pritzker Pavilion', parts, {
  title: 'Jay Pritzker Pavilion',
  architect: 'Frank Gehry',
  license: 'CC0-1.0',
  source: 'generators/chi-pritzker-pavilion.ts',
})
const out = process.argv[2] ?? new URL('../models/chi-pritzker-pavilion.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
