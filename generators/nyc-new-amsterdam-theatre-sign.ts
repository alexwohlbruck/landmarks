/**
 * The New Amsterdam Theatre's vertical sign and marquee (theatre 1903; the
 * Art Deco "NEW AMSTERDAM" pylon and clock from its 1937 conversion,
 * restored with the theatre by Disney in 1997), 214 West 42nd Street,
 * Times Square, Manhattan. Signage only. Procedural, CC0-1.0.
 *   bun generators/nyc-new-amsterdam-theatre-sign.ts
 *
 * What makes it itself (photos below):
 * 1. a tall cream pylon standing on the marquee, square on the wall side and
 *    rounded at its street end, ringed by nine bright bands (p1, p2, n1);
 * 2. "AMSTERDAM" stacked down both faces in red neon, with a small white
 *    "NEW" beside the A on the wall side (n1, n2, p2);
 * 3. a two-faced clock on top (p1, p2, n1);
 * 4. the marquee under it: a box 7.4 m wide, its faces lit (an LED screen and
 *    a ticker since the 2010s), edged and lined underneath with bulbs (n2, p2).
 *
 * Lettering: STYLE.md's "Famous signs" exception. The pylon carries the
 * theatre's name, so "AMSTERDAM" and "NEW" are geometry, traced from the
 * night photos n1 and n2 with `lettering.ts`: a condensed Deco sans, the A
 * pointed with a low bar, the M with upright sides and a V to mid height,
 * the S, R and D round-shouldered. Even strokes at 0.2 of the cap height
 * (the real letters are double neon tubes on a white channel; drawn as one
 * bold stroke so the word survives at 200 px). Cap height 0.80 m, pitch
 * 1.05 m, read from n1 against the pylon's depth.
 *
 * Night (n1, n2): the letters glow red (`neon-nat-red`); NEW, the clock
 * faces, the rings and the marquee's ticker band glow warm white
 * (`neon-nat-white`); the marquee's faces are a lit screen
 * (`neon-nat-marquee`, the orange of the current Lion King/Aladdin screen,
 * n2); its bulbs are `lamp-nat-bulb` beads. The cream pylon is floodlit
 * (n1, n2 show it bright against the dark facade), so `nat-pylon` carries
 * `_FLOODLIGHT`. Frames, the marquee's top and soffit stay dark.
 *
 * Frame: authored x, y, z with z up (mesh.ts converts to glTF). The model
 * is built facing -y with the reader's right along +x; bearing 208.55
 * turns the face to 28.55 (NNE, across 42nd Street) and +x to 298.55
 * (WNW). The origin is on the theatre's 42nd Street wall (OSM way/266143344,
 * New Amsterdam Theatre, height 38.2, its frontage a straight edge 14.95 m
 * long at bearing 118.55), at the middle of the marquee. Host outline in
 * the model frame: the wall is the plane y = 0 from x = -3.7 (east end,
 * the corner with 5 Times Square) to x = +11.3 (the Aldo building, way/
 * 266143307); the theatre is at y > 0. Every back plane here sits at
 * y = -0.3, 0.3 m in front of the wall.
 * OSM maps the marquee itself as a `building=roof` way, way/591988931
 * (7.4 x 5.2 m, building:levels 1), which this model draws, so the model
 * replaces it; the theatre building stays the map's extrusion. 42nd Street
 * is flat here; y = 0 is the sidewalk.
 *
 * Measured / published / estimated:
 * - marquee plan 7.4 x 5.2 m: OSM way/591988931 (measured, mapped);
 * - marquee 4.4 to 7.0 m above the sidewalk: estimated from p2 against
 *   people at the doors, its face 2.6 m tall from the end face in n2
 *   against its 5.2 m depth (+-0.5 m);
 * - pylon 1.4 m thick and 2.7 m deep (wall band 0.55, letter strip 0.8,
 *   rounded body 1.35), 7.0 to 17.6 m; the clock box 1.6 x 2.0 x 2.1 m on
 *   top: estimated from the ratios in n1 and p2 (letter pitch 1.05 m),
 *   checked against the tower's floors in p1 (the clock at about the
 *   fourth floor);
 * - nine rings, one per letter gap, as in n1 (counted).
 * Invented: the marquee's soffit bulb grid density, the clock hands' time.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "New Amsterdam Theatre.jpg", Beyond My Ken, CC BY-SA 4.0: from
 *   above across 42nd Street; the pylon, rings, clock and marquee in plan.
 *   https://commons.wikimedia.org/wiki/File:New_Amsterdam_Theatre.jpg
 * - p2 "New Amsterdam Theatre Mary Poppins 2007 NYC.jpg", Andreas
 *   Praefcke, CC BY 3.0: from the north-west; proportions, marquee.
 *   https://commons.wikimedia.org/wiki/File:New_Amsterdam_Theatre_Mary_Poppins_2007_NYC.jpg
 * - n1 "Times Square after dark sign 3.jpg", The All-Nite Images, CC BY-SA
 *   2.0: the pylon at night from the east; the letters, NEW and the clock.
 *   https://commons.wikimedia.org/wiki/File:Times_Square_after_dark_sign_3.jpg
 * - n2 "The New Amsterdam (52766994176).jpg", Eden, Janine and Jim, CC BY
 *   2.0: at night from the west on the sidewalk (2023); the marquee screen,
 *   ticker and bulbs, the letters on the west face.
 *   https://commons.wikimedia.org/wiki/File:The_New_Amsterdam_(52766994176).jpg
 *
 * Doubts: no photo shows the marquee from directly in front, so its height
 * and the pylon's height rest on estimates (+-10%); the pylon's thickness
 * (1.4 m) is from the oblique p1 only. The marquee's screen colour changes
 * with the show and its ads (drawn as one warm orange block, no imagery).
 * The big show billboards on the low building to the west (Aldo, 218 W
 * 42nd) are a separate host and rotating ads, so they are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes } from './lettering'

const red = new Part(), white = new Part(), pylon = new Part(), dark = new Part(), screen = new Part(), bulbs = new Part()

// ------------------------------------------------------------ helpers
/** An axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}
/** A convex prism from a plan ring (counter-clockwise from above). */
function prism(p: Part, ring: [number, number][], z0: number, z1: number, top = true, bottom = true) {
  const at = (z: number) => ring.map(([x, y]) => [x, y, z] as V3)
  p.loft([at(z0), at(z1)])
  if (top) p.cap(at(z1), true)
  if (bottom) p.cap(at(z0), false)
}
/** A bulb: a small octahedron, a little larger than the real lamp. */
function bead(p: Part, c: V3, r = 0.11) {
  const [x, y, z] = c
  const X: V3 = [x + r, y, z], x_: V3 = [x - r, y, z], Y: V3 = [x, y + r, z], y_: V3 = [x, y - r, z], Z: V3 = [x, y, z + r], z_: V3 = [x, y, z - r]
  p.tri(X, Y, Z); p.tri(Y, x_, Z); p.tri(x_, y_, Z); p.tri(y_, X, Z)
  p.tri(Y, X, z_); p.tri(x_, Y, z_); p.tri(y_, x_, z_); p.tri(X, y_, z_)
}
/** Beads along a straight run, from a to b inclusive, about `step` apart. */
function beadRow(p: Part, a: V3, b: V3, step: number, r?: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(1, Math.round(L / step))
  for (let i = 0; i <= n; i++) {
    const t = i / n
    bead(p, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], r)
  }
}

// ------------------------------------------------------------ marquee
// OSM way/591988931: 7.4 m along the wall, 5.2 m out. Back 0.3 m off the wall.
const MX = 3.7, MB = -0.3, MF = -5.2
const Z0 = 4.4, Z1 = 7.0
box(dark, -MX, MX, MF, MB, Z0, Z1)
// the lit faces: front and both ends, a screen above a ticker band
const SCR0 = 5.35, SCR1 = 6.6, TK0 = 4.75, TK1 = 5.15, OUT = 0.06
// front (faces -y)
screen.quad([-MX + 0.15, MF - OUT, SCR0], [MX - 0.15, MF - OUT, SCR0], [MX - 0.15, MF - OUT, SCR1], [-MX + 0.15, MF - OUT, SCR1])
white.quad([-MX + 0.15, MF - OUT, TK0], [MX - 0.15, MF - OUT, TK0], [MX - 0.15, MF - OUT, TK1], [-MX + 0.15, MF - OUT, TK1])
// ends (east end faces -x, west end +x)
for (const s of [-1, 1]) {
  const x = s * (MX + OUT)
  const q = (y0: number, y1: number, z0: number, z1: number): V3[] => [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]]
  for (const [part, z0, z1] of [[screen, SCR0, SCR1], [white, TK0, TK1]] as [Part, number, number][]) {
    const [a, b, c, d] = q(MB - 0.25, MF + 0.15, z0, z1)
    if (s > 0) part.quad(d, c, b, a); else part.quad(a, b, c, d)
  }
}
// bulbs: a row above and below the screen and round the top edge, front and ends
for (const z of [SCR1 + 0.2, SCR0 - 0.12, Z1 - 0.05, Z0 + 0.05]) {
  const o = OUT + 0.08
  beadRow(bulbs, [-MX - o, MF - o, z], [MX + o, MF - o, z], 0.42)
  beadRow(bulbs, [-MX - o, MB - 0.2, z], [-MX - o, MF - o + 0.42, z], 0.42)
  beadRow(bulbs, [MX + o, MB - 0.2, z], [MX + o, MF - o + 0.42, z], 0.42)
}
// soffit bulbs, in rows under the canopy (n2)
for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) bead(bulbs, [-MX + 0.7 + i * ((2 * MX - 1.4) / 6), MB - 0.9 - j * 1.2, Z0 - 0.08], 0.12)
// the dark entrance under the marquee, against the wall (p2: the bronze door
// surround, doors and poster cases); it also carries the model down to the
// sidewalk, y = 0
box(dark, -MX + 0.2, MX - 0.2, -0.55, MB, 0, Z0)

// ------------------------------------------------------------ pylon
// Plan: 1.4 m thick (x), from y = -0.3 at the wall to -3.0 at its rounded street end.
const T = 0.7 // half thickness
// The pylon stands toward the marquee's east end, by the wall (p1, p2, n2).
const PX = -1.6
const YW = -0.3, YS0 = -0.85, YS1 = -1.65, YR = -2.3 // wall band | letter strip | body | round end centre
const P0 = Z1, P1 = 17.6 // pylon bottom (on the marquee) and top
const ROUND = 12
const stadium = (o: number, yCut: number): [number, number][] => {
  // the pylon outline grown by o, from the wall plane yCut round the street end
  const r: [number, number][] = [[PX - T - o, yCut], [PX - T - o, YR]]
  for (let i = 1; i < ROUND; i++) {
    const a = Math.PI + (i / ROUND) * Math.PI // west round to east, through -y
    r.push([PX + (T + o) * Math.cos(a), YR + (T + o) * Math.sin(a)])
  }
  r.push([PX + T + o, YR], [PX + T + o, yCut])
  return r // counter-clockwise from above: down the east side, round the street end, up the west
}
prism(pylon, stadium(0, YW), P0, P1)
// a stepped plinth where it stands on the marquee (n1)
prism(pylon, stadium(0.18, YW), P0, P0 + 0.55)
// nine bright rings round the rounded body, one at each letter gap (n1)
const CAP = 0.8, PITCH = 1.05, LTOP = 17.0 // letters: cap height, pitch, top of the A
for (let i = 0; i < 9; i++) {
  const z = LTOP - CAP - 0.12 - i * PITCH
  prism(white, stadium(0.05, YS1 - 0.05), z - 0.07, z + 0.07)
}
// clock: a box over the wall band and the strip, faces east and west (p1, n1)
const CY0 = -0.3, CY1 = -2.3, CZ0 = P1, CZ1 = P1 + 2.1
box(pylon, PX - 0.8, PX + 0.8, CY1, CY0, CZ0, CZ1)
for (const s of [-1, 1]) {
  const x = PX + s * 0.83, cy = (CY0 + CY1) / 2, cz = (CZ0 + CZ1) / 2, h = 0.82
  const q: V3[] = [[x, cy - h, cz - h], [x, cy + h, cz - h], [x, cy + h, cz + h], [x, cy - h, cz + h]]
  if (s > 0) white.quad(q[0], q[1], q[2], q[3]); else white.quad(q[3], q[2], q[1], q[0])
  // a dark rim round the dial (n1: the clock's dark bezel)
  const xr = PX + s * 0.815, hr = 0.94
  const r: V3[] = [[xr, cy - hr, cz - hr], [xr, cy + hr, cz - hr], [xr, cy + hr, cz + hr], [xr, cy - hr, cz + hr]]
  if (s > 0) dark.quad(r[0], r[1], r[2], r[3]); else dark.quad(r[3], r[2], r[1], r[0])
  // hands (about 5:57, as in n1): minute hand up, hour hand toward six
  const hx = PX + s * 0.88
  box(dark, hx - 0.04, hx + 0.04, cy - 0.06, cy + 0.06, cz, cz + 0.7)
  box(dark, hx - 0.04, hx + 0.04, cy - 0.08, cy + 0.08, cz - 0.5, cz)
}

// ------------------------------------------------------------ lettering
// Letter units: cap height 1, u to the reader's right, v up.
const G: Record<string, { w: number; draw: (p: Pen) => void }> = {
  A: { w: 0.62, draw: (p) => { p.moveTo([0, 0]).lineTo([0.31, 1]).lineTo([0.62, 0]); p.moveTo([0.14, 0.34]).lineTo([0.48, 0.34]) } },
  M: { w: 0.72, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.36, 0.38]).lineTo([0.72, 1]).lineTo([0.72, 0]) } },
  S: { w: 0.6, draw: (p) => { p.moveTo([0.57, 0.83]).cubicTo([0.5, 1.02], [0.04, 1.02], [0.05, 0.75], 6).cubicTo([0.06, 0.5], [0.58, 0.54], [0.58, 0.25], 6).cubicTo([0.58, -0.03], [0.07, -0.03], [0.02, 0.17], 6) } },
  T: { w: 0.6, draw: (p) => { p.moveTo([0, 1]).lineTo([0.6, 1]); p.moveTo([0.3, 1]).lineTo([0.3, 0]) } },
  E: { w: 0.54, draw: (p) => { p.moveTo([0.54, 1]).lineTo([0, 1]).lineTo([0, 0]).lineTo([0.54, 0]); p.moveTo([0, 0.52]).lineTo([0.44, 0.52]) } },
  R: { w: 0.6, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.32, 1]).cubicTo([0.64, 1], [0.64, 0.5], [0.32, 0.5], 6).lineTo([0, 0.5]); p.moveTo([0.3, 0.5]).lineTo([0.6, 0]) } },
  D: { w: 0.62, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.24, 1]).cubicTo([0.66, 1], [0.66, 0], [0.24, 0], 8).lineTo([0, 0]) } },
  N: { w: 0.55, draw: (p) => { p.moveTo([0, 0]).lineTo([0, 1]).lineTo([0.55, 0]).lineTo([0.55, 1]) } },
  W: { w: 0.8, draw: (p) => { p.moveTo([0, 1]).lineTo([0.2, 0]).lineTo([0.4, 0.62]).lineTo([0.6, 0]).lineTo([0.8, 1]) } },
}
const glyph = (c: string) => { const p = new Pen(); G[c].draw(p); return p }
/**
 * Letters on one side face of the pylon. side -1 is the east face (x = -T,
 * read from the east: u runs toward the street, -y); side +1 the west face
 * (u runs toward the wall, +y). yc is the letter's centre across the face,
 * zb its baseline.
 */
function letter(part: Part, c: string, side: number, yc: number, zb: number, h: number, width: number, depth: number) {
  const g = G[c], pen = glyph(c)
  const place = (u: number, v: number, w: number): V3 => [PX + side * (T + w), yc + side * (u - g.w / 2) * h, zb + v * h]
  strokes(part, pen.paths, { width, depth, place })
}
const word = 'AMSTERDAM'
const ystrip = (YS0 + YS1) / 2
for (const side of [-1, 1]) {
  for (let i = 0; i < word.length; i++) letter(red, word[i], side, ystrip, LTOP - CAP - i * PITCH, CAP, 0.2, 0.14)
  // NEW: small white letters beside the A, on the wall band (n1, n2)
  const h = 0.2, gap = 0.05
  const ws = ['N', 'E', 'W'].map((c) => G[c].w * h)
  const total = ws.reduce((a, b) => a + b, 0) + 2 * gap
  // the word reads left to right; its centre on the wall band
  let u0 = -total / 2
  for (const [i, c] of ['N', 'E', 'W'].entries()) {
    const uc = u0 + ws[i] / 2 // centre of this letter along the word, metres
    // on the east face reading runs toward the street (-y); on the west face toward the wall (+y)
    const yc = (YW + YS0) / 2 + side * uc
    letter(white, c, side, yc, LTOP - 0.36, h, 0.24, 0.08)
    u0 += ws[i] + gap
  }
}

// ------------------------------------------------------------ write
const pylonLit = (_p: V3, n: V3) => (n[2] > 0.7 ? 0.35 : 0.9)
const parts = [
  { part: red, material: finish('neon-nat-red', 0xe2453a) },
  { part: white, material: finish('neon-nat-white', 0xf4ead6) },
  { part: pylon, material: { ...finish('nat-pylon', 0xeee6d6), floodlight: pylonLit } },
  { part: dark, material: finish('nat-marquee-frame', 0x4a4f57) },
  { part: screen, material: finish('neon-nat-marquee', 0xe0803c) },
  { part: bulbs, material: finish('lamp-nat-bulb', 0x8a7a5c) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, bottom = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); bottom = Math.min(bottom, part.pos[i]) }
const glb = writeGlb('New Amsterdam Theatre Sign', parts, {
  license: 'CC0-1.0', bearing: 208.55, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/591988931'],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-new-amsterdam-theatre-sign.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${bottom.toFixed(2)}..${top.toFixed(1)} m`)
