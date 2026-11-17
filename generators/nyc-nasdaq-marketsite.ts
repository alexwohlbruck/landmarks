/**
 * Nasdaq MarketSite (1999-2000), the cylindrical LED screen on the north-west
 * corner of 4 Times Square, Broadway at West 43rd Street, Times Square,
 * Manhattan. Procedural, CC0-1.0.
 *   bun generators/nyc-nasdaq-marketsite.ts
 *
 * Signage only. 4 Times Square stays the map's own OSM building: outline
 * way/86121620 (no height) and its parts, of which this corner is
 *   way/259054247  the drum, a circle of radius 8.44 m, min_height 10, height 40;
 *   way/259054246  the studio drum under it, radius about 7.2 m, height 10;
 *   way/259054245, way/259054248  the 35 m podium either side, hugging the drum;
 *   way/259051450  the 80 m block behind it.
 * The model replaces nothing. Its origin is the centre of the OSM drum
 * circle (-73.9859953, 40.7563467, fitted to way/86121620's rounded corner,
 * residuals under 0.06 m), bearing 0, so the frame is plain north-up.
 * Everything stands outside those parts: the screen's back face is at
 * radius 8.74 m, 0.30 m outside the drum (0.2 m or more outside the
 * parts beside it; work/nyc-nasdaq-marketsite/clearance.txt). The 40-48 m
 * crown and the studio glazing stand inside the outline way/86121620 but
 * clear of every part (the crown 0.18 m off the 80 m block's face; the map
 * draws parts, not an outline that has them).
 * The screen runs round the corner from bearing 275 to 39 degrees, where
 * its back meets the podium faces 0.2 m out. Above the drum part's 40 m the
 * real screen goes on to 48 m, so the model closes the drum from 40 to 48 m
 * itself (a dark wall round the back and a roof), as a sign's support.
 *
 * Map frame: x east, y north, z up, metres; y = 0 is the street (lidar
 * ground under the corner varies by 0.2 m).
 *
 * Measured (USGS 3DEP NY_NewYorkCity lidar, 2017 flight, 0.5 m grid):
 * - the drum's roof 48.1 m above the street at the corner, with a rim 0.4 m
 *   higher at the screen; the drum circle radius 8.34 m (OSM: 8.44 m).
 *   The lidar circle sits about 5.5 m south-east of OSM's, the same shift as
 *   the rest of the block's OSM outlines; the model follows OSM, which is
 *   what the map draws.
 * Published (Wikipedia "Nasdaq MarketSite" and "4 Times Square"):
 * - the display 120 ft (37 m) high above the studio: here 11.0 to 48.0 m;
 * - a 5 ft gap between the screen and the facade (the cabinet here is
 *   0.6 m deep, the gap left to the map's drum);
 * - office windows 5 x 7 ft (1.5 x 2.1 m), which pierce the screen.
 * Estimated from the photos (scaled by the drum's diameter, 18.7 m across
 * at the band in p4):
 * - the black band 5.2 m tall at the foot of the screen;
 * - the window holes: six staggered rows a storey (4.2 m) apart in the
 *   upper two thirds of the screen, 27 degrees apart in a row and offset by
 *   half that from row to row (p4, n3);
 * - the studio's glazing 0.5 to 9.6 m in two tiers.
 *
 * Lettering: STYLE.md's "Famous signs" exception. The Nasdaq logo, the
 * 2021 cyan ribbon "N" mark and the white "Nasdaq" wordmark, has stood in
 * the black band since the rebrand (p1, p3, p4, p6, n4), so it is drawn as
 * geometry, traced from p4 (straight on, public domain). Coordinates are
 * pixels of a 1300 px crop of p4's full file (x 1023-2750, y 3347-3874);
 * `place` unrolls the photo's cylinder (centre at thumb x 615, radius
 * 382 px) and takes out the photo's upward-looking sag of the baseline, so
 * the letters land on the drum at their real size: cap height 1.65 m,
 * stems 0.3 m (thickened a little from 0.27 m to hold at phone size), the
 * mark 3.6 m tall. The double-storey a's, the d and q, and the three-piece
 * mark (two leaning blades and the folded lozenge between them) follow the
 * trace. The logo is centred on the corner's bisector (bearing 338, up
 * Times Square), as it is in the photos taken from there.
 *
 * Night: the screen is `neon-nasdaq-blue`, the wordmark `neon-nasdaq-white`
 * and the mark `neon-nasdaq-teal`, so the drum glows Nasdaq blue with its
 * logo lit, as in n1, n3 and n4; the band, the window holes and the frame
 * are dark charcoal (#4a4f57, STYLE.md's darkest), as the band and holes
 * read black at night. The studio's glazing is `window` and glows, as the
 * studio's lit monitor wall does in n4. Screen content changes all day; a
 * single Nasdaq blue (p3, the Nasdaq's own content) stands for it rather
 * than any one advertisement.
 *
 * Photos (EVIDENCE):
 * - p1 "Nasdaq MarketSite (51494550508).jpg", Ajay Suresh, CC BY 2.0: from
 *   the north-west, the whole tower, band, holes and studio.
 *   https://commons.wikimedia.org/wiki/File:Nasdaq_MarketSite_(51494550508).jpg
 * - p3 "Nasdaq Tower May 2026.jpg", Nielsoncaetanosalmeron, CC BY 4.0: the
 *   tower in blue Nasdaq content, the drum's top against the tower.
 *   https://commons.wikimedia.org/wiki/File:Nasdaq_Tower_May_2026.jpg
 * - p4 "NASA Mars Perseverance on Nasdaq MarketSite (NHQ202102180119).jpg",
 *   NASA/Emma Howells, public domain: straight on, the logo trace.
 *   https://commons.wikimedia.org/wiki/File:NASA_Mars_Perseverance_on_Nasdaq_MarketSite_(NHQ202102180119).jpg
 * - p6 "NASA Mars Perseverance on Nasdaq MarketSite (NHQ202102180118).jpg",
 *   NASA/Emma Howells, public domain: from the north, with the Broadway face.
 *   https://commons.wikimedia.org/wiki/File:NASA_Mars_Perseverance_on_Nasdaq_MarketSite_(NHQ202102180118).jpg
 * - p5 "Times sqare Nasdaq.jpg", Kerrbenj, CC BY-SA 1.0: the older NASDAQ
 *   band, the holes, the drum's top.
 *   https://commons.wikimedia.org/wiki/File:Times_sqare_Nasdaq.jpg
 * - n1 "NASDAQ Times Square - panoramio.jpg", Roman SUZUKI, CC BY 3.0: dusk.
 *   https://commons.wikimedia.org/wiki/File:NASDAQ_Times_Square_-_panoramio.jpg
 * - n3 "Naava nasdaq times square.jpg", Aavikkovarpunen, CC BY-SA 4.0: dusk,
 *   the hole pattern clearest.
 *   https://commons.wikimedia.org/wiki/File:Naava_nasdaq_times_square.jpg
 * - n4 "4 & 1 Times Square", edenpictures (Flickr), CC BY 2.0: night, the
 *   current logo lit over the glowing studio.
 *   https://www.flickr.com/photos/10485077@N06/49575783063
 *
 * Doubts: the screen's arc ends where OSM's podium faces leave room for it
 * (275-39 degrees, 124 degrees); the real screen wraps a little further
 * (the lidar rim spans about 160 degrees), but OSM puts the podium there.
 * The window-hole pattern is regularised. The studio glazing's tiers and
 * mullion spacing are estimated from p1 and p4. Nothing of the screen's
 * back (inside the block) is visible, so it is plain.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { Pen, strokes, type Pt } from './lettering'

const frame = new Part(), screen = new Part(), white = new Part(), teal = new Part(), glazing = new Part()

const R_HOST = 8.44 // OSM drum (way/259054247)
const RB = R_HOST + 0.3 // screen back
const RF = RB + 0.6 // screen face
const Z0 = 11.0, ZB = 16.2, Z1 = 48.0 // screen foot, band top, screen top
const A0 = 275, A1 = 399 // screen arc, bearings (clockwise through north)
const MID = 338 // the corner's bisector, where the logo is centred
const SEG = 24

const rad = (d: number) => (d * Math.PI) / 180
/** A point at bearing b (degrees), radius r, height z. */
const at = (b: number, r: number, z: number): V3 => [r * Math.sin(rad(b)), r * Math.cos(rad(b)), z]
const radial = (b: number, s = 1): V3 => [s * Math.sin(rad(b)), s * Math.cos(rad(b)), 0]

/** A smooth cylindrical band, bearings b0..b1, facing out (s = 1) or in (s = -1). */
function band(p: Part, r: number, b0: number, b1: number, z0: number, z1: number, n: number, s = 1) {
  for (let i = 0; i < n; i++) {
    const c0 = b0 + ((b1 - b0) * i) / n, c1 = b0 + ((b1 - b0) * (i + 1)) / n
    const a = at(c0, r, z0), b = at(c1, r, z0), c = at(c1, r, z1), d = at(c0, r, z1)
    const N = [radial(c0, s), radial(c1, s), radial(c1, s), radial(c0, s)]
    p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [N[0], N[1], N[2]])
    p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [N[0], N[2], N[3]])
  }
}
/** A flat annulus sector at height z, facing up or down. */
function ring(p: Part, r0: number, r1: number, b0: number, b1: number, z: number, n: number, up: boolean) {
  for (let i = 0; i < n; i++) {
    const c0 = b0 + ((b1 - b0) * i) / n, c1 = b0 + ((b1 - b0) * (i + 1)) / n
    qf(p, at(c0, r0, z), at(c0, r1, z), at(c1, r1, z), at(c1, r0, z), [0, 0, up ? 1 : -1])
  }
}
/** A quad wound to face `want`. */
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}
/** A radial end face at bearing b, from r0 to r1, facing along the arc (+1 clockwise, -1 back). */
function end(p: Part, b: number, r0: number, r1: number, z0: number, z1: number, dir: number) {
  qf(p, at(b, r0, z0), at(b, r1, z0), at(b, r1, z1), at(b, r0, z1), [dir * Math.cos(rad(b)), -dir * Math.sin(rad(b)), 0])
}

// ------------------------------------------------------------ the screen
band(screen, RF, A0, A1, ZB, Z1 - 0.3, SEG) // the lit face
band(frame, RF, A0, A1, Z0 + 0.15, ZB, SEG) // the black band
band(frame, RB, A0, A1, Z0 - 0.15, Z1 + 0.35, SEG, -1) // the cabinet's back
// coping and foot: a lip 0.1 m proud of the face
const RL = RF + 0.1
band(frame, RL, A0, A1, Z1 - 0.3, Z1 + 0.35, SEG)
ring(frame, RF, RL, A0, A1, Z1 - 0.3, SEG, false)
band(frame, RL, A0, A1, Z0 - 0.15, Z0 + 0.15, SEG)
ring(frame, RF, RL, A0, A1, Z0 + 0.15, SEG, true)
ring(frame, RB, RL, A0, A1, Z0 - 0.15, SEG, false) // soffit
end(frame, A0, RB, RL, Z0 - 0.15, Z1 + 0.35, -1)
end(frame, A1, RB, RL, Z0 - 0.15, Z1 + 0.35, 1)

// ------------------------------------------------------------ the drum above the map's 40 m
// The drum part stops at 40 m; the real drum goes on to the screen's top.
// Close it round the back where the 80 m block (way/259051450) doesn't: its
// face crosses the circle at about 93 and 152 degrees, so the walls run 3
// degrees into it at each end and leave no slit. Then roof it over.
const ZT = Z1 + 0.35
band(frame, RB, A1, 456, 40, ZT, 6)
band(frame, RB, 149, A0, 40, ZT, 12)
ring(frame, RB, RL, A0, A1, ZT, SEG, true) // the cabinet's top
{
  const c: V3 = [0, 0, ZT]
  const n = 32
  for (let i = 0; i < n; i++) {
    const b0 = (360 * i) / n, b1 = (360 * (i + 1)) / n
    frame.tri(c, at(b1, RB, ZT), at(b0, RB, ZT)) // faces up (clockwise bearings)
  }
}

// ------------------------------------------------------------ the window holes
// Staggered rows of 1.5 x 2.1 m office windows piercing the screen, set
// just proud of the face so they read as dark squares.
{
  const RW = RF + 0.05, W = (1.5 / RF) * (180 / Math.PI), H = 2.1
  const rows = [45.4, 41.2, 37.0, 32.8, 28.6, 24.4]
  rows.forEach((zc, k) => {
    for (let j = -6; j <= 6; j++) {
      const b = MID + j * 27 + (k % 2 ? 13.5 : 0)
      if (b - W / 2 < A0 + 4 || b + W / 2 > A1 - 4) continue
      const q = [at(b - W / 2, RW, zc - H / 2), at(b + W / 2, RW, zc - H / 2), at(b + W / 2, RW, zc + H / 2), at(b - W / 2, RW, zc + H / 2)]
      frame.quad(q[1], q[0], q[3], q[2]) // faces out
    }
  })
}

// ------------------------------------------------------------ the logo (traced from p4)
// u, v: crop pixels, v down. Unroll the photo's cylinder and take out its sag.
const theta = (u: number) => Math.asin((330.1 + 0.4287 * u - 615) / 382)
const TC = (theta(33) + theta(1153)) / 2
const PX = 0.010456 // metres per crop pixel at the drum's face
const place = (u: number, v: number, w: number): V3 => {
  const vc = v - 9e-5 * (u - 650) ** 2
  const b = MID - ((theta(u) - TC) * 180) / Math.PI
  return at(b, RF + 0.06 + w, Z0 + 2.06 + (263 - vc) * PX)
}
// The wordmark, "Nasdaq": centre-lines.
const word = new Pen()
// N
word.moveTo([418, 267]).lineTo([418, 107])
word.moveTo([421, 112]).lineTo([520, 260])
word.moveTo([526, 262]).lineTo([526, 104])
// a (double-storey): the top arc into the stem, then the bowl
word.moveTo([570, 160]).cubicTo([590, 138], [652, 136], [655, 178], 6).lineTo([655, 264])
word.moveTo([653, 200]).lineTo([605, 198]).cubicTo([572, 202], [570, 258], [606, 259], 6).cubicTo([630, 260], [648, 252], [653, 240], 4)
// s
word.moveTo([781, 158]).cubicTo([760, 140], [708, 140], [710, 172], 6).cubicTo([712, 200], [776, 200], [776, 230], 6)
  .cubicTo([776, 262], [716, 266], [697, 247], 6)
// d
word.moveTo([900, 100]).lineTo([900, 268])
word.moveTo([898, 172]).cubicTo([880, 150], [818, 150], [817, 207], 6).cubicTo([818, 262], [880, 262], [898, 240], 6)
// a
word.moveTo([945, 166]).cubicTo([962, 150], [1018, 150], [1023, 190], 6).lineTo([1023, 278])
word.moveTo([1021, 212]).lineTo([975, 210]).cubicTo([945, 214], [944, 268], [978, 269], 6).cubicTo([1000, 270], [1016, 262], [1021, 250], 4)
// q
word.moveTo([1140, 174]).lineTo([1140, 340])
word.moveTo([1138, 196]).cubicTo([1120, 172], [1068, 170], [1067, 226], 6).cubicTo([1068, 282], [1120, 284], [1138, 258], 6)
strokes(white, word.paths, { width: 30, depth: 0.12, place })

/** A convex polygon (photo pixels, any winding) raised off the drum `depth`. */
function prism(p: Part, pts: Pt[], depth: number) {
  const area = pts.reduce((s, q, i) => { const r = pts[(i + 1) % pts.length]; return s + q[0] * r[1] - r[0] * q[1] }, 0)
  // v runs down and u maps to decreasing bearing, so on the drum (seen from
  // outside) the photo's clockwise order stays clockwise; make it ccw from outside.
  const P = area < 0 ? [...pts] : [...pts].reverse()
  const top = P.map(([u, v]) => place(u, v, depth)), bot = P.map(([u, v]) => place(u, v, 0))
  const n = P.length
  const out = (q: V3, a: V3, b: V3, c: V3) => { // choose winding facing away from the polygon's centre / drum
    const g = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
    return g[0] * q[0] + g[1] * q[1] + g[2] * q[2] >= 0
  }
  const cx = top.reduce((s, q) => [s[0] + q[0] / n, s[1] + q[1] / n, s[2] + q[2] / n], [0, 0, 0] as V3)
  const rOut: V3 = [cx[0], cx[1], 0]
  for (let i = 1; i < n - 1; i++) {
    if (out(rOut, top[0], top[i], top[i + 1])) p.tri(top[0], top[i], top[i + 1])
    else p.tri(top[0], top[i + 1], top[i])
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = bot[i], b = bot[j], c = top[j], d = top[i]
    const m: V3 = [(a[0] + b[0]) / 2 - cx[0], (a[1] + b[1]) / 2 - cx[1], (a[2] + b[2]) / 2 - cx[2]]
    if (out(m, a, b, c)) p.quad(a, b, c, d)
    else p.quad(d, c, b, a)
  }
}
// The mark: the left blade, the folded lozenge, the right blade.
prism(teal, [[33, 392], [110, 380], [203, 122], [123, 133]], 0.12)
prism(teal, [[200, 123], [223, 127], [240, 180], [207, 277], [183, 277], [168, 227]], 0.08)
prism(teal, [[202, 285], [297, 267], [388, 22], [302, 28]], 0.12)

// ------------------------------------------------------------ the studio glazing
// Two tiers of glass round the studio drum (way/259054246, r 7.2 m, 10 m),
// 0.3 m out from it, under the screen's overhang.
{
  const RS = 7.65, n = 10, g = 0.9 // panels, and the mullion gap in degrees
  for (let i = 0; i < n; i++) {
    const b0 = 266 + (i * 144) / n + g, b1 = 266 + ((i + 1) * 144) / n - g
    for (const [z0, z1] of [[0.5, 4.6], [5.4, 9.6]]) {
      band(glazing, RS, b0, b1, z0, z1, 2)
      band(glazing, RS - 0.12, b0, b1, z0, z1, 2, -1)
    }
  }
  // a dark transom and head between the tiers
  band(frame, RS + 0.02, 266, 410, 0, 0.5, 12) // sill
  band(frame, RS + 0.02, 266, 410, 4.6, 5.4, 12)
  band(frame, RS + 0.02, 266, 410, 9.6, 10.0, 12)
}

const parts = [
  { part: screen, material: finish('neon-nasdaq-blue', 0x3f6fd0) },
  { part: white, material: finish('neon-nasdaq-white', 0xf3f5f7) },
  { part: teal, material: finish('neon-nasdaq-teal', 0x2ec3e8) },
  { part: frame, material: finish('sign-frame', 0x4a4f57) },
  { part: glazing, material: PALETTE.window },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, low = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); low = Math.min(low, part.pos[i]) }
if (Math.abs(low) > 1e-6) throw new Error(`Lowest point must be 0: ${low}`)
const glb = writeGlb('Nasdaq MarketSite', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-nasdaq-marketsite.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m, lowest ${low.toFixed(2)} m`)
