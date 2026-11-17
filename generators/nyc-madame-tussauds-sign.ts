/**
 * Madame Tussauds New York's entrance and signs (opened 2000 in the Hilton
 * Times Square podium), 234 West 42nd Street, Times Square, Manhattan.
 * Signage only. Procedural, CC0-1.0.
 *   bun generators/nyc-madame-tussauds-sign.ts
 *
 * What makes it itself (photos below):
 * 1. the glass drum over the entrance: a cone widening upward, a segment of
 *    a circle in plan, clad in mirror glass between bright metal bands,
 *    its underside red (since the 2010s; white with yellow ribs in 2003)
 *    and studded with lights along radial ribs (p1, p2, p3, p4);
 * 2. two red piers either side of the doors carrying the drum's inner
 *    ring (p1, p3);
 * 3. the giant silver hand reaching out of a grey disc on the wall west of
 *    the doors, gripping a drum-shaped red, silver and gold "Madame
 *    Tussauds" medallion (p1, p2, p3, p4);
 * 4. the vertical "TUSSAUD'S" blade above the drum: gold serif letters on
 *    a dark violet box, standing out from the podium's blue glass column
 *    (p3, n1).
 *
 * Lettering: STYLE.md's "Famous signs" exception, for the blade only. It
 * carries the attraction's name, so "TUSSAUD'S" is geometry, traced from
 * n1 (stacked serif capitals with the apostrophe) and checked against p3,
 * with `lettering.ts`: bracketless slab serifs drawn as short cross
 * strokes, strokes 0.17 of the cap height, cap 1.15 m, pitch 1.45 m. The
 * script "Madame Tussauds" logos (on the medallion, inside the drum, on the
 * banners) are small and change, so they are left out.
 *
 * Night: the medallion's red face, the piers and the red soffit are
 * `neon-tussauds-red` (lit red under the drum's spots, p1 at dusk; the
 * medallion is backlit); the blade's letters and the medallion's band are
 * `neon-tussauds-gold`; the soffit spots are `lamp-tussauds-spot` beads.
 * The drum's mirror glass is `glass` and stays dark: in n1 it reads as dim
 * glass beside the bright blade (the small red "New York New York" neon
 * inside, p1, is too small to draw). The hand, the metal bands, the disc
 * and the blade box are unlit.
 *
 * Frame: authored x, y, z with z up (mesh.ts converts to glTF). The model
 * is built facing -y with the reader's right along +x; bearing 208.55
 * turns the face to 28.55 (NNE, across 42nd Street) and +x to 298.55
 * (WNW). The origin is on the podium's 42nd Street wall at the middle of
 * the doors. Host: OSM way/266143358 (building=yes + building:part=yes,
 * start_date 2000, no height; the Hilton Times Square podium, which also
 * holds AMC Empire 25 and the hotel tower parts above); its 42nd Street
 * edge is straight here, the plane y = 0 (offsets -0.02 to +0.01 m) from
 * x = -12.7 (the Candler Building, way/266143308, to the east) to x =
 * +12.7, the frontage of the museum (OSM way/586476446, tourism=museum,
 * 234 W 42nd St); the podium is at y > 0. Every back plane here sits at
 * y = -0.3, 0.3 m in front of the wall. 42nd Street is flat; y = 0 is the
 * sidewalk. OSM maps no roof for the drum, so the model replaces nothing.
 *
 * Measured from p1 (straight on, 2021), with the museum's OSM frontage
 * (25.4 m) as the scale and the drum's nearer face allowed about 1.2x for
 * perspective; checked against people in p2 and p3:
 * - drum 17 m across at the wall (centred 1.0 m east of the doors),
 *   projecting 6.5 m at the top (16.2 m) and 14.6 m / 5.5 m at its rim
 *   (9.0 m); the red soffit rising from the inner ring over the doors (7.2
 *   m across, 2.6 m out, at 6.6 m) to the rim;
 * - piers 1.3 m wide, 3.3 m either side of the doors' middle;
 * - disc 3.4 m across, its centre 7.9 m west of the doors and 6.5 m up;
 *   medallion 2.4 m across and 1.3 m long, centred 5.3 m west, 4.3 m up
 *   and 2.0 m out, its face turned 40 degrees east of straight out.
 * Estimated: the blade (1.8 m deep, 0.5 m thick, 17 to 30.5 m, 2.4 m west
 * of the doors' middle) from p3 and n1, both oblique; the hand's pose.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "Madame Tussauds New York (51494328416).jpg", Ajay Suresh, CC BY
 *   2.0: straight on, 2021.
 *   https://commons.wikimedia.org/wiki/File:Madame_Tussauds_New_York_(51494328416).jpg
 * - p2 "0480New York City Madame Tussauds.JPG", Laslovarga, CC BY-SA 3.0:
 *   from the north-east, the drum's depth, hand and medallion.
 *   https://commons.wikimedia.org/wiki/File:0480New_York_City_Madame_Tussauds.JPG
 * - p3 "42nd St 7th 8th Avs Mid td (2018-05-18) 07 - Madame Tussauds.jpg",
 *   Tdorante10, CC BY-SA 4.0: from across the street, the blade, its ring
 *   brackets and the signs above the drum.
 *   https://commons.wikimedia.org/wiki/File:42nd_St_7th_8th_Avs_Mid_td_(2018-05-18)_07_-_Madame_Tussauds.jpg
 * - p4 "Madame Tussauds NYC.jpg", Pccromeo, CC BY-SA 2.5: the drum and the
 *   hand from the north-east (2000s).
 *   https://commons.wikimedia.org/wiki/File:Madame_Tussauds_NYC.jpg
 * - n1 "42nd Street in New York.jpg", Robert Parma, CC BY-SA 3.0: 42nd
 *   Street at night from the east, the lit "TUSSAUD'S" blade.
 *   https://commons.wikimedia.org/wiki/File:42nd_Street_in_New_York.jpg
 *
 * Doubts: the blade is drawn as p3 (2018) shows it; p1 (2021) is cropped
 * above the drum, and no later licensed photo shows whether it is still
 * there. The host has no OSM height, so how high the map draws the podium
 * behind the blade is unknown. The drum's heights rest on perspective
 * corrections (+-1 m). The hand is a simplified pose (palm, four fingers,
 * thumb as tapered tubes), not a sculpture.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { Pen, strokes } from './lettering'

const glass = new Part(), red = new Part(), silver = new Part(), dark = new Part(), gold = new Part(), spots = new Part()

// ------------------------------------------------------------ helpers
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const nrm = (a: V3): V3 => mul3(a, 1 / Math.hypot(a[0], a[1], a[2]))
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}
function bead(p: Part, c: V3, r = 0.13) {
  const [x, y, z] = c
  const X: V3 = [x + r, y, z], x_: V3 = [x - r, y, z], Y: V3 = [x, y + r, z], y_: V3 = [x, y - r, z], Z: V3 = [x, y, z + r], z_: V3 = [x, y, z - r]
  p.tri(X, Y, Z); p.tri(Y, x_, Z); p.tri(x_, y_, Z); p.tri(y_, X, Z)
  p.tri(Y, X, z_); p.tri(x_, Y, z_); p.tri(y_, x_, z_); p.tri(X, y_, z_)
}
/** A closed tube from A to B, n-sided, radius r0 at A and r1 at B, capped. */
function tube(p: Part, A: V3, B: V3, r0: number, r1: number, n = 8) {
  const ax = nrm(sub3(B, A))
  const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const s = nrm(crs(ax, ref)), t = crs(ax, s)
  const ring = (C: V3, r: number) => Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n
    return add3(C, add3(mul3(s, r * Math.cos(a)), mul3(t, r * Math.sin(a))))
  })
  const a = ring(A, r0), b = ring(B, r1)
  // wind outward: the ring runs counter-clockwise about ax when s x t = ax
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    p.quad(a[i], a[j], b[j], b[i])
  }
  for (let i = 1; i < n - 1; i++) { p.tri(b[0], b[i], b[i + 1]); p.tri(a[0], a[i + 1], a[i]) }
}

// ------------------------------------------------------------ the drum
const YW = -0.3 // back plane, 0.3 m off the wall
const SEG = 16
const DRUM_X = -1.0 // the drum is centred 1.0 m east of the doors (p1)
/** A circular segment in plan, centre (0, yc) inside the wall, half-chord c at y = YW, sagitta s: points from east (x<0) round to west. */
function arc(c: number, s: number, z: number, x0 = DRUM_X): V3[] {
  const R = (c * c + s * s) / (2 * s), yc = YW - s + R
  const phi = Math.asin(c / R)
  return Array.from({ length: SEG + 1 }, (_, i) => {
    const a = -phi + (2 * phi * i) / SEG
    return [x0 + R * Math.sin(a), yc - R * Math.cos(a), z] as V3
  })
}
const Z_IN = 6.6, Z_RIM = 9.0, Z_BAND = 9.9, Z_TOP = 16.2, Z_LIP = 15.8
const inner = arc(3.6, 2.6, Z_IN, 0) // centred on the doors
const rim = arc(7.3, 5.5, Z_RIM)
const tb = (Z_BAND - Z_RIM) / (Z_TOP - Z_RIM) // where the band's top meets the flaring glass
const band = arc(7.3 + 1.2 * tb + 0.1, 5.5 + 1.0 * tb + 0.1, Z_BAND) // the bright fascia band, 0.1 m proud of the glass
const lip = arc(8.5 - 0.05, 6.5 - 0.05, Z_LIP)
const topR = arc(8.5, 6.5, Z_TOP)
// ring order: east end (x < 0) round the street side to the west end, then
// back along the wall plane: counter-clockwise from above, as loft wants
const ccw = (r: V3[]) => r
// glass between the band and the lip, flaring out
const lerpRing = (a: V3[], b: V3[], t: number) => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t, p[2] + (b[i][2] - p[2]) * t] as V3)
const glassBottom = lerpRing(rim, topR, (Z_BAND - Z_RIM) / (Z_TOP - Z_RIM))
glass.loft([ccw(glassBottom), ccw(lip)])
// the bright fascia band at the rim and the lip band at the top
silver.loft([ccw(rim), ccw(band)])
silver.loft([ccw(band), ccw(glassBottom)])
silver.loft([ccw(lip), ccw(topR)])
dark.cap(ccw(topR), true) // the drum's roof
// the red soffit, sloping from the inner ring out and up to the rim
red.loft([ccw(inner), ccw(rim)])
silver.cap(ccw(inner), false) // the pale ceiling over the doors
// spots along five radial ribs of the soffit (p1)
for (const k of [2, 5, 8, 11, 14]) for (let j = 0; j <= 3; j++) {
  const t = 0.12 + j * 0.26, a = inner[k], b = rim[k]
  bead(spots, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t - 0.15])
}

// ------------------------------------------------------------ piers
for (const s of [-1, 1]) box(red, s * 3.3 - 0.65, s * 3.3 + 0.65, -1.7, YW, 0, Z_IN + 0.5) // up into the soffit

// ------------------------------------------------------------ disc, hand, medallion
const DX = 7.9, DZ = 6.5, DR = 1.7
tube(dark, [DX, YW, DZ], [DX, YW - 0.35, DZ], DR, DR, 20)
// the medallion: a drum 2.1 m across and 1.3 m long, its face turned 40 degrees east of straight out
const MC: V3 = [5.3, -2.0, 4.3], MR = 1.2, ML = 1.3
const ang = (40 * Math.PI) / 180
const MA: V3 = [-Math.sin(ang), -Math.cos(ang), 0] // axis, toward the face (east of out; east is -x)
const mEnd = (k: number): V3 => add3(MC, mul3(MA, k * ML / 2))
tube(silver, mEnd(-1), mEnd(-0.25), MR, MR, 16) // silver body
tube(gold, mEnd(-0.25), mEnd(0.1), MR + 0.02, MR + 0.02, 16) // the gold band
tube(silver, mEnd(0.1), mEnd(0.92), MR, MR, 16)
tube(red, mEnd(0.92), mEnd(1), MR - 0.05, MR - 0.05, 16) // the red face
// the hand: out of the disc, its back to the street, the fingers fanned
// out east and a little down over the medallion, which hangs on a rod from
// the drum's soffit (p1, p2, p4)
const wrist: V3 = [DX - 0.2, YW - 0.75, DZ], knuckle: V3 = [6.3, -2.3, 6.5]
tube(silver, wrist, knuckle, 0.9, 0.85, 10)
const across = nrm([0.25, 0, 1]) // the fan of the fingers, nearly upright
for (let i = 0; i < 4; i++) {
  const f = (i - 1.5) * 0.5
  const k = add3(knuckle, mul3(across, f))
  const mid = add3(k, [-0.9, -0.35, 0.3 + f * 0.25])
  const tip = add3(mid, [-0.75, -0.1, -0.3])
  tube(silver, add3(k, [0.3, 0.1, 0]), mid, 0.3, 0.27, 8)
  tube(silver, mid, tip, 0.27, 0.2, 8)
}
const th: V3[] = [[6.9, -1.9, 5.7], [6.1, -2.6, 5.0], [5.6, -2.8, 5.15]] // the thumb
tube(silver, th[0], th[1], 0.34, 0.28, 8)
tube(silver, th[1], th[2], 0.28, 0.22, 8)
// the rod the medallion hangs from, up to the soffit (p1, p4: gold)
tube(gold, add3(MC, [0, 0, MR - 0.1]), [MC[0], MC[1], 9.0], 0.09, 0.09, 6)

// ------------------------------------------------------------ the blade
const BX = 2.4, BT = 0.25, BY0 = YW, BY1 = -2.1, BZ0 = 17.0, BZ1 = 30.5
box(dark, BX - BT, BX + BT, BY1, BY0, BZ0, BZ1)
// the ring brackets round the blue column beside it (p3): two bright hoops,
// one just over the drum, one beside the blade's foot
for (const z of [Z_TOP + 0.5, BZ0 + 3.0]) {
  const n = 12, r = 1.6, cx = BX - 1.0, cy = YW - 0.1
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI + (Math.PI * i) / n, a1 = Math.PI + (Math.PI * (i + 1)) / n
    const P = (a: number): V3 => [cx - r * Math.cos(a), cy + r * Math.sin(a), z]
    tube(silver, P(a0), P(a1), 0.1, 0.1, 4)
  }
}
// letters: serif capitals stacked down both faces
const G: Record<string, { w: number; draw: (p: Pen) => void }> = {
  T: { w: 0.7, draw: (p) => { p.moveTo([0, 0.84]).lineTo([0, 1]).lineTo([0.7, 1]).lineTo([0.7, 0.84]); p.moveTo([0.35, 1]).lineTo([0.35, 0]); p.moveTo([0.18, 0]).lineTo([0.52, 0]) } },
  U: { w: 0.7, draw: (p) => { p.moveTo([0.06, 1]).lineTo([0.06, 0.32]).cubicTo([0.06, -0.07], [0.64, -0.07], [0.64, 0.32], 6).lineTo([0.64, 1]); p.moveTo([-0.08, 1]).lineTo([0.2, 1]); p.moveTo([0.5, 1]).lineTo([0.78, 1]) } },
  S: { w: 0.62, draw: (p) => { p.moveTo([0.6, 0.78]).lineTo([0.6, 0.86]).cubicTo([0.5, 1.03], [0.04, 1.03], [0.05, 0.75], 6).cubicTo([0.06, 0.5], [0.6, 0.54], [0.6, 0.25], 6).cubicTo([0.6, -0.03], [0.07, -0.03], [0.02, 0.15], 6).lineTo([0.02, 0.24]) } },
  A: { w: 0.76, draw: (p) => { p.moveTo([0.04, 0]).lineTo([0.38, 1]).lineTo([0.72, 0]); p.moveTo([0.17, 0.36]).lineTo([0.59, 0.36]); p.moveTo([-0.08, 0]).lineTo([0.18, 0]); p.moveTo([0.58, 0]).lineTo([0.86, 0]) } },
  D: { w: 0.7, draw: (p) => { p.moveTo([0.08, 0]).lineTo([0.08, 1]).lineTo([0.3, 1]).cubicTo([0.76, 1], [0.76, 0], [0.3, 0], 8).lineTo([0.08, 0]); p.moveTo([-0.06, 1]).lineTo([0.1, 1]); p.moveTo([-0.06, 0]).lineTo([0.1, 0]) } },
  "'": { w: 0.2, draw: (p) => { p.moveTo([0.12, 1]).lineTo([0.07, 0.72]) } },
}
const CAP = 1.15, PITCH = 1.45, WORD = "TUSSAUD'S", LTOP = BZ1 - 0.5
for (const side of [-1, 1]) {
  let z = LTOP - CAP
  for (const c of WORD) {
    const g = G[c], pen = new Pen()
    g.draw(pen)
    const yc = (BY0 + BY1) / 2
    const place = (u: number, v: number, w: number): V3 => [BX + side * (BT + w), yc + side * (u - g.w / 2) * CAP, z + v * CAP]
    strokes(gold, pen.paths, { width: 0.17, depth: 0.1, place })
    z -= c === "'" ? PITCH * 0.55 : PITCH
  }
}

// ------------------------------------------------------------ write
const parts = [
  { part: glass, material: { ...PALETTE.glass, color: 0xb7c3cd } },
  { part: red, material: finish('neon-tussauds-red', 0xd2463c) },
  { part: silver, material: finish('tussauds-silver', 0xd0d3d7, 0.4) },
  { part: dark, material: finish('tussauds-dark', 0x55535f) },
  { part: gold, material: finish('neon-tussauds-gold', 0xe2b34e) },
  { part: spots, material: finish('lamp-tussauds-spot', 0x6a6d72) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, bottom = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); bottom = Math.min(bottom, part.pos[i]) }
const glb = writeGlb('Madame Tussauds New York Sign', parts, {
  license: 'CC0-1.0', bearing: 208.55, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-madame-tussauds-sign.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${bottom.toFixed(2)}..${top.toFixed(1)} m`)
