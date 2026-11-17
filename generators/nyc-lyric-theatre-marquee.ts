/**
 * The Lyric Theatre's 42nd Street marquee and show sign (theatre 1903 by
 * V. Hugh Thomas; rebuilt behind its two historic facades as the Ford
 * Center for the Performing Arts in 1998; the Lyric again since 2014),
 * 213 West 42nd Street, Times Square, Manhattan. Signage only.
 * Procedural, CC0-1.0.
 *   bun generators/nyc-lyric-theatre-marquee.ts
 *
 * What makes it itself (photos below): the narrow ornate 42nd Street
 * portal of the old Lyric (the map's extrusion) carries
 * 1. a flat black marquee box, a little wider than the portal, edged above
 *    and below with rows of bulbs (p1, p2);
 * 2. a big gilded show title standing on top of it, lit gold at night
 *    (p1, p2, and the Ford Center's "42ND STREET" sign of 2003 in p3 stood
 *    in the same place);
 * 3. a show line along the marquee face (p2: "AND THE CURSED CHILD" in
 *    orange) between the bulb rows.
 * The title and the show line change with the production (Harry Potter and
 * the Cursed Child since 2018), so STYLE.md's lettering exception does not
 * apply: the title and its subtitle are each one gold band the size of the
 * real letters' line,
 * the show line one orange band, no letters, no imagery. The 2018 wings and
 * nest sculpture (p1) were gone by 2021 (p2) and are left out.
 *
 * Night: the title glows gold (`neon-lyric-gold`), the show line orange
 * (`neon-lyric-orange`); the bulbs are `lamp-lyric-bulb` beads, about
 * 0.45 m apart (p1 counts roughly that); the box, the frame and the doors
 * are dark.
 *
 * Frame: authored x, y, z with z up (mesh.ts converts to glTF). The model
 * is built facing -y with the reader's right along +x; bearing 28.55 turns
 * the face to 208.55 (SSW, across 42nd Street) and +x to 118.55 (ESE). The
 * origin is on the theatre's 42nd Street wall, at the middle of its
 * frontage: OSM way/266034050 (Lyric Theatre, height 23.6), whose 42nd
 * Street edge runs 6.37 m between the Times Square Theater (way/266034046,
 * west) and the New Victory Theater (way/266034047, east). Host outline in
 * the model frame: the wall from (-3.19, +0.02) to (+3.19, -0.02); the
 * theatre at y > 0. The neighbours' walls continue the line (+0.03 to
 * +0.3 m west, -0.03 m east). Every back plane here sits at y = -0.3, 0.27
 * m or more in front of the wall. 42nd Street is flat; y = 0 is the
 * sidewalk. OSM maps no marquee here, so the model replaces nothing.
 *
 * Measured from p1, straight on, scaled by the portal's width (the OSM
 * frontage, 6.37 m = 595 px, 93 px/m):
 * - marquee 7.85 m wide, from 4.25 m west to 3.6 m east of the portal's
 *   middle; its face 4.2 to 5.6 m above the sidewalk;
 * - the title's field 6.2 m wide and 2.0 m tall, standing on the marquee:
 *   the title line 1.3 m tall, the subtitle 4.2 m wide and 0.5 m tall;
 * - doors 3.9 m wide and 3.3 m tall.
 * Estimated: the marquee's depth (3.0 m, from the soffit seen in p1 and the
 * oblique p2), the title's set-back (1.0 m) and its frame.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p1 "Lyric Theatre - Harry Potter and the Cursed Child (48296064337).jpg",
 *   Ajay Suresh, CC BY 2.0: straight on from across 42nd Street, 2018.
 *   https://commons.wikimedia.org/wiki/File:Lyric_Theatre_-_Harry_Potter_and_the_Cursed_Child_(48296064337).jpg
 * - p2 "Lyric Theatre Broadway-Harry Potter.jpg", Alberto-g-rovi, CC BY 3.0:
 *   from across the street, 2021; the title on its frame, the show line.
 *   https://commons.wikimedia.org/wiki/File:Lyric_Theatre_Broadway-Harry_Potter.jpg
 * - p3 "Hilton Theater (Ford Center) NYC 2003.jpg", Andreas Praefcke,
 *   CC BY 3.0: the same marquee position in 2003.
 *   https://commons.wikimedia.org/wiki/File:Hilton_Theater_(Ford_Center)_NYC_2003.jpg
 *
 * Doubts: no licensed photo after 2021, so the current title's exact size
 * and the marquee's face may differ; the depth is estimated. No night photo
 * of this marquee as it is now; the night look follows the 2018/2021 day
 * photos (gilded letters lit from within, bulbs) and p3 at dusk.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const dark = new Part(), gold = new Part(), orange = new Part(), bulbs = new Part()

/** An axis-aligned box. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  p.cap(r(z0), false)
}
/** A bulb: a small octahedron, a little larger than the real lamp. */
function bead(p: Part, c: V3, r = 0.11) {
  const [x, y, z] = c
  const X: V3 = [x + r, y, z], x_: V3 = [x - r, y, z], Y: V3 = [x, y + r, z], y_: V3 = [x, y - r, z], Z: V3 = [x, y, z + r], z_: V3 = [x, y, z - r]
  p.tri(X, Y, Z); p.tri(Y, x_, Z); p.tri(x_, y_, Z); p.tri(y_, X, Z)
  p.tri(Y, X, z_); p.tri(x_, Y, z_); p.tri(y_, x_, z_); p.tri(X, y_, z_)
}
function beadRow(p: Part, a: V3, b: V3, step: number, r?: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(1, Math.round(L / step))
  for (let i = 0; i <= n; i++) {
    const t = i / n
    bead(p, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], r)
  }
}
/** A flat quad on a plane, wound to face `want`. */
function face(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

// ------------------------------------------------------------ marquee
const X0 = -4.25, X1 = 3.6 // west and east ends (p1)
const YB = -0.3, YF = -3.3 // back (0.3 m off the wall) and front
const Z0 = 4.05, Z1 = 5.75 // the box, a little taller than its face
box(dark, X0, X1, YF, YB, Z0, Z1)
// the show line: an orange band along the face and both ends (p2)
const B0 = 4.72, B1 = 5.1, OUT = 0.05
face(orange, [X0 + 0.3, YF - OUT, B0], [X1 - 0.3, YF - OUT, B0], [X1 - 0.3, YF - OUT, B1], [X0 + 0.3, YF - OUT, B1], [0, -1, 0])
for (const [x, s] of [[X0 - OUT, -1], [X1 + OUT, 1]] as [number, number][])
  face(orange, [x, YB - 0.3, B0], [x, YF + 0.3, B0], [x, YF + 0.3, B1], [x, YB - 0.3, B1], [s, 0, 0])
// bulb rows above and below the band, round the front and both ends (p1)
for (const z of [5.5, 4.3]) {
  const o = OUT + 0.06
  beadRow(bulbs, [X0 - o, YF - o, z], [X1 + o, YF - o, z], 0.45)
  beadRow(bulbs, [X0 - o, YB - 0.25, z], [X0 - o, YF - o + 0.45, z], 0.45)
  beadRow(bulbs, [X1 + o, YB - 0.25, z], [X1 + o, YF - o + 0.45, z], 0.45)
}
// downlights under the soffit
for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) bead(bulbs, [X0 + 0.9 + i * ((X1 - X0 - 1.8) / 4), YB - 0.9 - j * 1.4, Z0 - 0.08], 0.12)

// ------------------------------------------------------------ the show title
// A gilded field 6.2 x 2.0 m on a dark frame, standing on the marquee, set
// back 1.0 m from its face (p1, p2).
const TX0 = -3.2, TX1 = 3.0, TY = YF + 1.0, TZ0 = Z1 + 0.15, TZ1 = TZ0 + 2.0
box(dark, TX0 + 0.4, TX1 - 0.4, TY + 0.1, TY + 0.5, Z1, TZ1 - 0.2) // frame behind it
box(dark, TX0 + 0.4, TX1 - 0.4, TY - 0.1, TY + 0.5, Z1, TZ0) // its foot on the marquee
// the title line over a shorter, smaller subtitle line (p1, p2), each one
// gold band the height of its letters, with the dark frame showing between
box(gold, TX0, TX1, TY - 0.25, TY + 0.1, TZ1 - 1.3, TZ1)
box(gold, TX0 + 1.0, TX1 - 1.0, TY - 0.25, TY + 0.1, TZ0, TZ0 + 0.5)

// ------------------------------------------------------------ doors
// The dark bronze doors under the marquee (p1), which also carry the model
// down to the sidewalk, y = 0.
box(dark, -1.9, 2.0, -0.55, YB, 0, 3.3)

// ------------------------------------------------------------ write
const parts = [
  { part: dark, material: finish('lyric-marquee-black', 0x45474d) },
  { part: gold, material: finish('neon-lyric-gold', 0xe7b24a) },
  { part: orange, material: finish('neon-lyric-orange', 0xde7a3a) },
  { part: bulbs, material: finish('lamp-lyric-bulb', 0x8a7a5c) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, bottom = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); bottom = Math.min(bottom, part.pos[i]) }
const glb = writeGlb('Lyric Theatre Marquee', parts, {
  license: 'CC0-1.0', bearing: 28.55, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-lyric-theatre-marquee.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${bottom.toFixed(2)}..${top.toFixed(1)} m`)
