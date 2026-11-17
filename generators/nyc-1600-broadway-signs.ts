/**
 * The sign wall of 1600 Broadway (M&M's World), Broadway and 48th Street,
 * Times Square. Procedural, CC0-1.0.
 *   bun generators/nyc-1600-broadway-signs.ts
 *
 * Signage only: the store podium and the tower above it stay as the map's
 * OSM extrusions, so this replaces nothing. It draws:
 * - the big corner screen standing on the podium roof over the corner of
 *   48th Street and Seventh Avenue, turned to face down the square (b2, b7,
 *   b13; its plan and top from lidar), with its steel legs to the roof;
 * - the two M&M's candy-stack blade signs: five lit lenses, blue, green,
 *   orange, yellow and red from the top, each with its white "m", on a grey
 *   pipe with arms back to the wall; one at that corner, its pipe down to
 *   the sidewalk (b2, b5, b7), one on the Seventh Avenue front near the
 *   store's north end (b3, b8);
 * - the M&M's character light boxes on the 48th Street front by the
 *   Broadway corner (b2, b7), as one blue lit panel.
 *
 * Lettering: each lens carries the brand's lowercase "m", the candy's own
 * mark and the sign's identity, traced from b3 and b5 (a bold rounded
 * serif m with foot serifs), on both faces. The screen and light boxes show
 * changing advertising, so they are plain colour blocks: the screen red
 * (the red candies of b7, the brand's own colour), the light boxes blue
 * (their painted sky, b2, b7).
 * Night: every lit face is `neon-mm-*` in its colour (b1, b5 at night: the
 * lenses glow in their colours with white m's); the cabinet, legs, pipes
 * and lens rims are dark `sign-frame`.
 *
 * Frame: x east along 48th Street (bearing 118.9), y north up Seventh
 * Avenue, z up; bearing 28.9. The origin is the south-east corner of OSM
 * way/266151930 ("1600 Broadway on the Square", building:part, height 15 m,
 * the store podium): its 48th Street front is y = 0 from x = -31.7 (the
 * Broadway corner) to 0, its Seventh Avenue front x = 0 from y = 0 to
 * 32.2. The tower parts (way/289976677, -678, -679, -680, -681, -682;
 * 66-92.6 m) stand behind, the nearest corner at (-10.0, 1.8). Clearances
 * are checked with the scratch script `check.ts`: the light box and the
 * lens stacks stand >= 0.3 m outside the podium's outline; the screen and
 * its legs stand on the podium roof (15 m), above the extrusion, as the
 * real screen does, and >= 3.9 m clear of the tower parts.
 *
 * Lidar: USGS NY CMPG 2017 (via tools/lidar.py, 0.5 m), read in this frame:
 * podium roof 15.8-16.3 m; the screen's top 31.4-33.1 m, its front a
 * 45-degree line from about (-7.5, -5.5) to (-0.5, 2.5), its frame behind
 * filling back to (-8, 3) (1 m cells); a 13.3 m top at
 * (0-2, -4-0), the corner lens stack; a 13.6 m top at (2-4, 32-38), the
 * Seventh Avenue stack, a little north of OSM's corner. The lidar's
 * 48th Street front lies ~2 m south of OSM's; the signs are set on OSM's.
 * Estimated: the screen's width (13 m, from the lidar line; b2 shows it
 * taller than wide, b7 about as wide as the podium is high), its bottom (16.5 m, just over
 * the roof parapet in b7) and depth (1 m); the lenses (2.3 m wide, 1.95 m
 * tall, 0.7 m thick, from b5 and b3 against the 13.3 m top), the pipes and
 * arms; the light box (10 x 10 m, 4-14 m up, from b2 and b7).
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - b2 "M&M's World New York July 2019.jpg", TaurusEmerald, CC BY-SA 4.0:
 *   the corner at Seventh Avenue, the screen, the stack, the light boxes.
 *   https://commons.wikimedia.org/wiki/File:M%26M%27s_World_New_York_July_2019.jpg
 * - b7 "M&M's World (5367196170).jpg", Jorge Láscar, CC BY 2.0:
 *   the same corner squarely, the screen over the corner, stack on its pipe.
 *   https://commons.wikimedia.org/wiki/File:M%26M%27s_World_(5367196170).jpg
 * - b3 "M&M's World, New York City, outside (May 2023).JPG", Benoît Prieur, CC0:
 *   the Seventh Avenue stack close up, its pipe and arms, the m's.
 *   https://commons.wikimedia.org/wiki/File:M%26M%27s_World,_New_York_City,_outside_(May_2023).JPG
 * - b5 "M&M's World NYC Neon Sign.jpg", Richieman, public domain, night: the corner
 *   stack lit, looking east along 48th Street.
 *   https://commons.wikimedia.org/wiki/File:M%26M%27s_World_NYC_Neon_Sign.jpg
 * - b1 "M&M's World New York City.JPG", Steven Lek, CC BY-SA 4.0, night: the
 *   stack lit beside the store glass.
 *   https://commons.wikimedia.org/wiki/File:M%26M%27s_World_New_York_City.JPG
 * - b8 "NYC M&M'S Store Facade and Jumbotron.jpg", Mepatm, CC BY-SA 4.0
 *   (small): the screen at the corner and the second stack along the front.
 *   https://commons.wikimedia.org/wiki/File:NYC_M%26M%27S_Store_Facade_and_Jumbotron.jpg
 * - b13 "NYC - 1600 Broadway On the Square - m^m's - West 48th Street - West
 *   49th Street - panoramio.jpg", giggel, CC BY 3.0: the screen against
 *   the tower, and the tower's two upper billboards.
 *   https://commons.wikimedia.org/wiki/File:NYC_-_1600_Broadway_On_the_Square_%E2%80%93_m%5Em%27s_-_West_48th_Street_%E2%80%93_West_49th_Street_-_panoramio.jpg
 *
 * Doubts: the upper billboards on the tower (b13) and whatever stands on the
 * Broadway corner (the lidar shows something 22.8 m tall at the
 * Broadway/48th corner, and a 21 m edge along the Broadway front) are left
 * out: no licensed photo shows them squarely. The screen's exact width and
 * offset from the corner rest on 2 m lidar cells. The screen's colour is a
 * stand-in for changing content. b2 and b7 put the corner stack under the
 * screen's left part and the screen a little more over Seventh Avenue than
 * the lidar does; the lidar (2017) is followed, and the stack may sit 2-4 m
 * further west along 48th Street, under the screen's overhang, where the
 * lidar cannot see it. The corner stack's lenses face down the square (b7
 * sees them squarely), b3's Seventh Avenue stack is a blade across the
 * avenue. Lenses are drawn as domes on a flat rim; the orange lens is drawn
 * in the red neon.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes } from './lettering'

const red = new Part(), yellow = new Part(), green = new Part(), blue = new Part(), white = new Part(), frame = new Part()

// ------------------------------------------------------------ helpers
/** An axis-aligned box. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}
/** A square strut between two points, 2h across. */
function strut(p: Part, A: V3, B: V3, h: number) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]
  const L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  let s = cr(u, ref); const ls = Math.hypot(...s); s = [s[0] / ls, s[1] / ls, s[2] / ls]
  const t = cr(u, s)
  const ring = (P: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [P[0] + (s[0] * a + t[0] * b) * h, P[1] + (s[1] * a + t[1] * b) * h, P[2] + (s[2] * a + t[2] * b) * h] as V3)
  const r0 = ring(A), r1 = ring(B)
  p.loft([r0, r1])
  p.cap(r1, true)
  p.cap(r0, false)
}

// ------------------------------------------------------------ the corner screen
// Plan: n faces down the square (model south-east), t runs along the face.
const SQ = Math.SQRT1_2
const n: [number, number] = [SQ, -SQ], t: [number, number] = [SQ, SQ]
const C: [number, number] = [-4.35, -1.15] // the cabinet's middle, from the lidar (1 m cells)
const SW = 13.0, SD = 1.0, SZ0 = 16.5, SZ1 = 33.1, RIM = 0.4
const at = (s: number, o: number, z: number): V3 => [C[0] + t[0] * s + n[0] * o, C[1] + t[1] * s + n[1] * o, z]
{
  const h = SW / 2, f = SD / 2
  // face (lit inside a dark rim), counter-clockwise seen from the front
  const a = at(-h, f, SZ0), b = at(h, f, SZ0), c = at(h, f, SZ1), d = at(-h, f, SZ1)
  const A = at(-h + RIM, f, SZ0 + RIM), B = at(h - RIM, f, SZ0 + RIM), Cc = at(h - RIM, f, SZ1 - RIM), D = at(-h + RIM, f, SZ1 - RIM)
  red.quad(A, B, Cc, D)
  frame.quad(a, b, B, A); frame.quad(b, c, Cc, B); frame.quad(c, d, D, Cc); frame.quad(d, a, A, D)
  // back, ends, top, bottom
  frame.quad(at(h, -f, SZ0), at(-h, -f, SZ0), at(-h, -f, SZ1), at(h, -f, SZ1))
  frame.quad(at(h, f, SZ0), at(h, -f, SZ0), at(h, -f, SZ1), at(h, f, SZ1))
  frame.quad(at(-h, -f, SZ0), at(-h, f, SZ0), at(-h, f, SZ1), at(-h, -f, SZ1))
  frame.quad(at(-h, f, SZ1), at(h, f, SZ1), at(h, -f, SZ1), at(-h, -f, SZ1))
  frame.quad(at(-h, -f, SZ0), at(h, -f, SZ0), at(h, f, SZ0), at(-h, f, SZ0))
  // legs to the podium roof (15 m) where the cabinet stands over it, and raking
  // struts from the cabinet's back down to the roof behind; its south-west half
  // overhangs the 48th Street sidewalk (lidar, b7)
  for (const s of [2.4, 3.9, 5.4]) {
    const p = at(s, 0, 0)
    box(frame, p[0] - 0.22, p[1] - 0.22, 15.05, p[0] + 0.22, p[1] + 0.22, SZ0)
  }
  for (const [s, k] of [[-3, 6], [0, 4], [3, 2.5]]) strut(frame, at(s, -SD / 2, SZ0 + 5), at(s, -k, 15.3), 0.15)
}

// ------------------------------------------------------------ the candy stacks
const mPen = new Pen()
// x-height 1; the left stem with its top serif, two arches, three stems with foot serifs (b3, b5)
mPen.moveTo([-0.12, 0.96]).lineTo([0, 0.98]).lineTo([0, 0])
mPen.moveTo([0, 0.72]).cubicTo([0.06, 0.98], [0.45, 1.04], [0.46, 0.7], 5).lineTo([0.46, 0])
mPen.moveTo([0.46, 0.72]).cubicTo([0.52, 0.98], [0.92, 1.04], [0.92, 0.7], 5).lineTo([0.92, 0])
for (const u of [0, 0.46, 0.92]) mPen.moveTo([u - 0.13, 0]).lineTo([u + 0.13, 0])
const M_U0 = 0.4, M_V0 = 0.5, M_S = 0.78 // centre of the m in its units, metres per unit

const RX = 1.15, RZ = 0.98, HT = 0.35, DOME = 0.16, SEG = 16
/**
 * One lens: an oval standing in a vertical plane, its faces looking along
 * `face` degrees (counter-clockwise from +x) and the opposite way, faces lit,
 * rim dark, a white m on each face.
 */
function lens(cx: number, cy: number, cz: number, face: number, lit: Part) {
  // local frame: a = the face normal, b = along the blade (horizontal), z up
  const f = (face * Math.PI) / 180
  const A: V3 = [Math.cos(f), Math.sin(f), 0], Bv: V3 = [-Math.sin(f), Math.cos(f), 0]
  const P = (a: number, b: number, z: number): V3 => [cx + A[0] * a + Bv[0] * b, cy + A[1] * a + Bv[1] * b, cz + z]
  const ring = (k: number): [number, number] => [RX * Math.cos((2 * Math.PI * k) / SEG), RZ * Math.sin((2 * Math.PI * k) / SEG)]
  for (const side of [1, -1]) {
    const tip = P(side * (HT + DOME), 0, 0)
    for (let k = 0; k < SEG; k++) {
      const [b0, z0] = ring(k), [b1, z1] = ring(k + 1)
      const p0 = P(side * HT, b0, z0), p1 = P(side * HT, b1, z1)
      // dome normals: tilt outward toward the rim
      const nr = (b: number, z: number): V3 => {
        const o = 0.55
        const v: V3 = [A[0] * side + Bv[0] * (b / RX) * o, A[1] * side + Bv[1] * (b / RX) * o, (z / RZ) * o]
        const l = Math.hypot(...v)
        return [v[0] / l, v[1] / l, v[2] / l]
      }
      lit.tri(tip, p0, p1, [0, 0], [0, 0], [0, 0], [[A[0] * side, A[1] * side, 0], nr(b0, z0), nr(b1, z1)])
      // the rim band
      const q0 = P(-side * HT, b0, z0), q1 = P(-side * HT, b1, z1)
      if (side === 1) frame.tri(p0, q0, q1, [0, 0], [0, 0], [0, 0], [[Bv[0] * b0 / RX, Bv[1] * b0 / RX, z0 / RZ], [Bv[0] * b0 / RX, Bv[1] * b0 / RX, z0 / RZ], [Bv[0] * b1 / RX, Bv[1] * b1 / RX, z1 / RZ]])
      if (side === 1) frame.tri(p0, q1, p1, [0, 0], [0, 0], [0, 0], [[Bv[0] * b0 / RX, Bv[1] * b0 / RX, z0 / RZ], [Bv[0] * b1 / RX, Bv[1] * b1 / RX, z1 / RZ], [Bv[0] * b1 / RX, Bv[1] * b1 / RX, z1 / RZ]])
    }
    // the m: seen from the +a side the reader's right is +b, from the -a side -b
    const right = side
    strokes(white, mPen.paths, {
      width: 0.2, depth: 0.07 / M_S,
      place: (u, v, w) => P(side * (HT + 0.1 + w * M_S), right * (u - M_U0) * M_S, (v - M_V0) * M_S),
    })
  }
}
const LENSES: Part[] = [blue, green, red, yellow, red] // top to bottom (b3, b5, b7)
const PITCH = 1.95
/** A stack of five lenses on a pipe beside them; `top` the top lens's top. */
function stack(cx: number, cy: number, top: number, face: number, pipe: { x: number; y: number; z0: number }, wall: (z: number) => V3) {
  for (let i = 0; i < 5; i++) lens(cx, cy, top - RZ - i * PITCH, face, LENSES[i])
  const zb = top - 2 * RZ - 4 * PITCH
  box(frame, pipe.x - 0.17, pipe.y - 0.17, pipe.z0, pipe.x + 0.17, pipe.y + 0.17, top - 0.6)
  // arms back to the wall, and short stubs from the pipe to the lenses
  for (const z of [zb + 2.2, top - 2.6]) {
    strut(frame, [pipe.x, pipe.y, z], wall(z), 0.1)
  }
  for (let i = 0; i < 5; i++) {
    const z = top - RZ - i * PITCH
    strut(frame, [pipe.x, pipe.y, z], [cx, cy, z], 0.09)
  }
}
// The corner stack: its lenses face down the square like the screen (b7 sees them squarely from the
// south-east, b5 at a slant from 48th Street); its pipe on the building side, down to the sidewalk.
stack(1.5, -1.9, 13.3, -45, { x: 0.86, y: -1.26, z0: 0 }, (z) => [0.4, -0.5, z])
// The Seventh Avenue stack near the store's north end: a blade across the avenue, hung from the wall.
stack(2.0, 30.6, 13.6, 90, { x: 0.75, y: 30.6, z0: 3.0 }, (z) => [0.4, 30.6, z])

// ------------------------------------------------------------ the light boxes on 48th Street
{
  const x0 = -30.9, x1 = -20.9, z0 = 4.0, z1 = 14.0, y0 = -0.3, y1 = -0.9, r = 0.3
  box(frame, x0, y1 + 0.02, z0, x1, y0, z1)
  blue.quad([x0 + r, y1, z0 + r], [x1 - r, y1, z0 + r], [x1 - r, y1, z1 - r], [x0 + r, y1, z1 - r])
}

// ------------------------------------------------------------ write
const parts = [
  { part: red, material: finish('neon-mm-red', 0xd8322b) },
  { part: yellow, material: finish('neon-mm-yellow', 0xf2cc2a) },
  { part: green, material: finish('neon-mm-green', 0x3fae4a) },
  { part: blue, material: finish('neon-mm-blue', 0x2f6fd0) },
  { part: white, material: finish('neon-mm-white', 0xf4f1ea) },
  { part: frame, material: finish('sign-frame', 0x5a5f66) },
]
const triangles = parts.reduce((k, { part }) => k + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, low = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); low = Math.min(low, part.pos[i]) }
const glb = writeGlb("1600 Broadway Signs (M&M's World)", parts, {
  license: 'CC0-1.0', bearing: 28.9, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-1600-broadway-signs.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${low.toFixed(2)}-${top.toFixed(1)} m`)
