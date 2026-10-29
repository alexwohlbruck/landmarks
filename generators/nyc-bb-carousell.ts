/**
 * B&B Carousell pavilion, Steeplechase Plaza, Coney Island: procedural, CC0-1.0.
 * bun generators/nyc-bb-carousell.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The origin is the
 * area centroid of the OSM outline way/230062419 (attraction=carousel,
 * building=yes), on the plaza. The plaza is level, so elevation 0.
 *
 * The building. The 1919 B&B Carousell (Wikipedia, "B&B Carousell"; Coney
 * Island's last traditional carousel, restored and reopened in 2013) turns
 * inside a round pavilion built in 2013 for Steeplechase Plaza, beside the
 * Parachute Jump. The pavilion is a drum: a ring of grey steel columns
 * with glass walls between them (roll-down grey shutters when closed), a
 * tall frieze band of perforated metal printed with pink and lilac carousel
 * horses on a pale ground, a flat roof with a small round lantern at the
 * centre carrying a carousel-horse figure, and the giant 3D CAROUSEL
 * letters standing round the south and east of the frieze, each its own
 * colour, rising a little above the roof line.
 *
 * Numbers:
 *   drum radius 13.3 m: measured, lidar (USGS NY_NewYorkCity, 2017; the
 *     building dates from 2013). Its centre is 1.3 m from the centre of a
 *     circle fitted to the OSM outline, and sits (1.5, -1.1) m from the
 *     outline's centroid, which the outline's small bumps on the north and
 *     west pull off-centre; NAIP agrees with the lidar.
 *   roof 7.7 m above the plaza: measured, lidar (11.8 m NAVD roof, 4.1 m
 *     plaza). Lantern top ~10 m and the horse to 11.7 m: lidar, the highest
 *     returns at the centre.
 *   glass/shutter band 3.2 m and frieze 4.5 m: estimated from the photo
 *     "B&B Carousel March jeh", scaled to the lidar height.
 *   letters 4.6 m tall, ~3.5 m wide, bottoms at 3.5 m, tops 0.4 m above the
 *     roof, with about 1 m between letters: estimated from the same photo.
 *     C A R O U run from south-south-west to east; their colours (yellow,
 *     mint, red, green, blue) are from the photos. S E L, round the east
 *     and north-east, aren't in any licensed photo found: their places
 *     follow the spacing and their colours (yellow, mint, red) are invented.
 *   12 columns: estimated (the photo shows bays of about 7 m).
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 *   "B&B Carousel March jeh", Jim.henderson, CC BY 3.0 (from the south)
 *   "Carousel at Coney Island", Gswaggy23, CC BY 4.0 (the letters, close)
 *   "Coney Is Beach td (2018-09-03) 01" and "02 - Steeplechase Plaza",
 *     Tdorante10, CC BY-SA 4.0 (from the west, the lantern and horse)
 *   "Coney Island Boardwalk with B&B Carousell", Nic shad, CC BY-SA 4.0
 *   "Steeplechase Plaza W16 carousel pavilion construction jeh",
 *     Jim.henderson, CC BY-SA 3.0 (the column ring and roof frame)
 *   "Coney Island Brooklyn Jul 2019 36" and "37", Epicgenius, CC BY-SA 4.0
 * Look-only: none.
 *
 * Style. STYLE.md allows a famous sign its lettering; the CAROUSEL letters
 * are what the pavilion is known by, so they are built with ./lettering.ts
 * from centre-lines traced off the photos (see the letters section), bent
 * round the drum. The printed horses are left out; the frieze is one pale
 * lilac colour. The yellow buildings and the curved canopy next to the
 * pavilion are separate OSM buildings and are not drawn.
 *
 * Doubts: the north and west of the drum (towards the yellow buildings) are
 * only seen from far off; the small bumps in the OSM outline there (an
 * entrance and the link to the yellow pavilions) are not modelled; the
 * letters S E L are inferred.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { Pen, strokes } from './lettering'

const TAU = Math.PI * 2
const C: [number, number] = [1.55, -1.12]    // drum centre, from the outline's centroid
const R = 13.3, ROOF = 7.7, BAND = 3.2, LANTERN_R = 2.3

const drum = new Part(), glass = new Part(), yellow = new Part(), mint = new Part(), red = new Part(), blue = new Part()

const at = (b: number, r: number, z: number): V3 => [C[0] + r * Math.sin(b), C[1] + r * Math.cos(b), z]

/** A smooth cylinder wall from bearing b0 to b1 (radians, clockwise from north), outward-facing. */
function wall(p: Part, r: number, z0: number, z1: number, n = 48, b0 = 0, b1 = TAU) {
  for (let k = 0; k < n; k++) {
    const a = b0 + ((b1 - b0) * k) / n, b = b0 + ((b1 - b0) * (k + 1)) / n
    const na: V3 = [Math.sin(a), Math.cos(a), 0], nb: V3 = [Math.sin(b), Math.cos(b), 0]
    p.tri(at(a, r, z0), at(b, r, z1), at(b, r, z0), undefined, undefined, undefined, [na, nb, nb])
    p.tri(at(a, r, z0), at(a, r, z1), at(b, r, z1), undefined, undefined, undefined, [na, na, nb])
  }
}
function disc(p: Part, r: number, z: number, n = 48) {
  const c: V3 = [C[0], C[1], z]
  for (let k = 0; k < n; k++) p.tri(c, at(((k + 1) / n) * TAU, r, z), at((k / n) * TAU, r, z))
}
/** A box in the tangent frame at bearing b: u along the drum (clockwise), v up, w out from it. */
function tbox(p: Part, b: number, r: number, u0: number, u1: number, v0: number, v1: number, w0: number, w1: number) {
  const o = at(b, 0, 0), out: V3 = [Math.sin(b), Math.cos(b), 0], tan: V3 = [Math.cos(b), -Math.sin(b), 0]
  const P = (u: number, v: number, w: number): V3 => [o[0] + out[0] * (r + w) + tan[0] * u, o[1] + out[1] * (r + w) + tan[1] * u, v]
  const q = (a: V3, bb: V3, c: V3, d: V3) => { p.tri(d, c, bb); p.tri(d, bb, a) }
  q(P(u0, v0, w1), P(u1, v0, w1), P(u1, v1, w1), P(u0, v1, w1)) // front
  q(P(u1, v0, w0), P(u0, v0, w0), P(u0, v1, w0), P(u1, v1, w0)) // back
  q(P(u0, v1, w0), P(u0, v1, w1), P(u1, v1, w1), P(u1, v1, w0)) // top
  q(P(u0, v0, w0), P(u1, v0, w0), P(u1, v0, w1), P(u0, v0, w1)) // bottom
  q(P(u1, v0, w0), P(u1, v1, w0), P(u1, v1, w1), P(u1, v0, w1)) // right (clockwise end)
  q(P(u0, v0, w0), P(u0, v0, w1), P(u0, v1, w1), P(u0, v1, w0)) // left
}

// ------------------------------------------------------------- the drum ---
// Glass band between columns, set 0.25 m in; the frieze above it; the roof.
wall(glass, R - 0.25, 0, BAND)
const COLS = 12
for (let k = 0; k < COLS; k++) tbox(drum, (k / COLS) * TAU, R - 0.3, -0.35, 0.35, 0, BAND, 0, 0.35)
// The soffit under the frieze where it overhangs the glass.
wall(drum, R, BAND, ROOF)
{
  const n = 48
  for (let k = 0; k < n; k++) { // underside ring from the glass line out to the frieze
    const a = (k / n) * TAU, b = ((k + 1) / n) * TAU
    drum.tri(at(a, R - 0.25, BAND), at(b, R, BAND), at(b, R - 0.25, BAND))
    drum.tri(at(a, R - 0.25, BAND), at(a, R, BAND), at(b, R, BAND))
  }
}
// A small parapet lip and the flat roof.
wall(drum, R + 0.12, ROOF - 0.35, ROOF + 0.15)
disc(drum, R + 0.12, ROOF + 0.15)
// The lantern at the centre, its cap, and the carousel-horse figure on a pole.
wall(glass, LANTERN_R, ROOF + 0.15, ROOF + 1.4, 16)
wall(drum, LANTERN_R + 0.25, ROOF + 1.4, ROOF + 1.9, 16)
disc(drum, LANTERN_R + 0.25, ROOF + 1.9, 16)
{
  const z = ROOF + 1.9, c: V3 = [C[0], C[1], 0]
  const post = (x: number, y: number, z0: number, z1: number, h: number, p: Part) => {
    const q = (a: V3, b: V3, cc: V3, d: V3) => { p.tri(a, b, cc); p.tri(a, cc, d) }
    const X0 = c[0] + x - h, X1 = c[0] + x + h, Y0 = c[1] + y - h, Y1 = c[1] + y + h
    q([X0, Y0, z1], [X1, Y0, z1], [X1, Y1, z1], [X0, Y1, z1])
    q([X0, Y0, z0], [X1, Y0, z0], [X1, Y0, z1], [X0, Y0, z1])
    q([X1, Y0, z0], [X1, Y1, z0], [X1, Y1, z1], [X1, Y0, z1])
    q([X1, Y1, z0], [X0, Y1, z0], [X0, Y1, z1], [X1, Y1, z1])
    q([X0, Y1, z0], [X0, Y0, z0], [X0, Y0, z1], [X0, Y1, z1])
  }
  post(0, 0, z, z + 1.0, 0.08, drum)
  // The horse, drawn bold: body, neck and head, legs as one block, facing east.
  tbox(red, Math.PI / 2, 0, -0.35, 0.35, z + 1.0, z + 1.55, -0.8, 0.6)   // body
  tbox(red, Math.PI / 2, 0, -0.25, 0.25, z + 1.4, z + 2.1, 0.35, 0.75)   // neck and head
  tbox(red, Math.PI / 2, 0, -0.3, 0.3, z + 0.7, z + 1.0, -0.7, 0.5)      // legs
}

// ---------------------------------------------------------- the letters ---
// The CAROUSEL letters, traced from "B&B Carousel March jeh" and "Carousel
// at Coney Island": a heavy italic display face with squared-off rounds and
// spur serifs (the C's arms end in spurs, the A has a flat apex, a heavy
// right stem and a lighter left diagonal, the R a round bowl and a straight
// leg with foot serifs, the O is a fat oval ring). Centre-lines in letter
// units (cap height 1), drawn upright and sheared to the real ~11° slant.
const H = 4.6, LB = 3.5, SLANT = 0.2, STROKE = 0.21, THIN = 0.15, DEPTH = 0.55, GAP = 0.22
type Glyph = { width: number; heavy: Pen; thin?: Pen }
const glyph = (width: number, heavy: (p: Pen) => void, thin?: (p: Pen) => void): Glyph => {
  const h = new Pen(); heavy(h)
  let t: Pen | undefined
  if (thin) { t = new Pen(); thin(t) }
  return { width, heavy: h, thin: t }
}
const GLYPHS: Record<string, Glyph> = {
  C: glyph(0.76, (p) => p.moveTo([0.7, 0.78]).lineTo([0.7, 0.89]).lineTo([0.27, 0.89]).quadTo([0.11, 0.89], [0.11, 0.73], 4)
    .lineTo([0.11, 0.27]).quadTo([0.11, 0.11], [0.27, 0.11], 4).lineTo([0.7, 0.11]).lineTo([0.7, 0.24])),
  A: glyph(0.8, (p) => {
    p.moveTo([0.64, 0.11]).lineTo([0.64, 0.89]).lineTo([0.44, 0.89])
    p.moveTo([0.27, 0.36]).lineTo([0.64, 0.36])
    p.moveTo([0.0, 0.11]).lineTo([0.27, 0.11])
  }, (p) => p.moveTo([0.47, 0.89]).lineTo([0.13, 0.11])),
  R: glyph(0.78, (p) => {
    p.moveTo([0.12, 0.11]).lineTo([0.12, 0.89]).lineTo([0.44, 0.89]).arc([0.44, 0.68], -Math.PI, 8).lineTo([0.12, 0.47])
    p.moveTo([0.38, 0.47]).lineTo([0.64, 0.11]).lineTo([0.76, 0.11])
    p.moveTo([0.0, 0.11]).lineTo([0.24, 0.11])
  }),
  O: glyph(0.84, (p) => p.circle([0.42, 0.5], 0.31, 0.39, 16)),
  U: glyph(0.76, (p) => p.moveTo([0.12, 0.89]).lineTo([0.12, 0.36]).arc([0.38, 0.36], Math.PI, 8).lineTo([0.64, 0.89])),
  S: glyph(0.74, (p) => p.moveTo([0.64, 0.8]).cubicTo([0.55, 0.93], [0.12, 0.95], [0.12, 0.7]).cubicTo([0.12, 0.47], [0.64, 0.55], [0.64, 0.3]).cubicTo([0.64, 0.05], [0.18, 0.06], [0.09, 0.2])),
  E: glyph(0.72, (p) => {
    p.moveTo([0.66, 0.79]).lineTo([0.66, 0.89]).lineTo([0.12, 0.89]).lineTo([0.12, 0.11]).lineTo([0.66, 0.11]).lineTo([0.66, 0.22])
    p.moveTo([0.12, 0.5]).lineTo([0.5, 0.5])
  }),
  L: glyph(0.7, (p) => p.moveTo([0.12, 0.89]).lineTo([0.12, 0.11]).lineTo([0.64, 0.11]).lineTo([0.64, 0.24])),
}
const LETTERS: [string, Part][] = [['C', yellow], ['A', mint], ['R', red], ['O', mint], ['U', blue], ['S', yellow], ['E', mint], ['L', red]]
// The word starts (the C's left edge) at bearing 214° and runs anticlockwise
// round the drum, as the reader's right is anticlockwise seen from outside.
const START = (214 * Math.PI) / 180, RL = R + 0.25
let pen = 0
for (const [ch, part] of LETTERS) {
  const g = GLYPHS[ch], u0 = pen
  const place = (u: number, v: number, w: number): V3 => {
    const b = START - ((u0 + u + SLANT * v) * H) / RL
    return [C[0] + (RL + w) * Math.sin(b), C[1] + (RL + w) * Math.cos(b), LB + v * H]
  }
  strokes(part, g.heavy.paths, { width: STROKE, depth: DEPTH, place })
  if (g.thin) strokes(part, g.thin.paths, { width: THIN, depth: DEPTH, place })
  pen += g.width + GAP
}

const parts = [
  { part: drum, material: finish('carousell-frieze', 0xd8ccd8) },
  { part: glass, material: PALETTE.window },
  { part: yellow, material: finish('neon-carousell-yellow', 0xe8c440) },
  { part: mint, material: finish('neon-carousell-mint', 0x72c9a0) },
  { part: red, material: finish('neon-carousell-red', 0xd9503f) },
  { part: blue, material: finish('neon-carousell-blue', 0x5d8fd0) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('B&B Carousell', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 11.7, osm: 'way/230062419',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-bb-carousell.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
console.log(parts.map(({ part, material }) => `  ${material.name}: ${part.triangles}`).join('\n'))
