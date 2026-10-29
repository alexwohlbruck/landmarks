/**
 * The Colgate Clock (1924; on the Hudson waterfront south of Exchange
 * Place since the 1980s, refurbished with LED lighting in 2013), Jersey
 * City, NJ. Procedural, CC0-1.0.
 *   bun generators/nyc-colgate-clock.ts
 *
 * What makes it itself, and the photo each comes from:
 * 1. a flat-topped black octagon round a 50 ft white louvred dial, facing
 *    Manhattan (n1, n10, h);
 * 2. twelve red elongated-hexagon hour marks (n1, h);
 * 3. black hands outlined in red, with silver lattice counterweights
 *    (n1, n10, h);
 * 4. the red "Colgate" sign under the octagon, on a galvanised deck of
 *    posts and beams (n1, n3, n10);
 * 5. the dark steel frame behind: three columns, raking struts back to the
 *    deck and the mechanism box behind the dial's centre (n23, s).
 *
 * Lettering: STYLE.md's "Famous signs" exception. The sign is part of the
 * landmark and the word reads from across the river, so "Colgate" is
 * geometry, its centre-lines traced from a straight-on licensed photo (n1)
 * with `lettering.ts`: the bold italic Colgate wordmark (open C with
 * slanted cuts, oval o, tall l, g with its hooked descender, single-storey
 * a, t with its curled foot, e) and the registered mark as a ring with an R.
 * Strokes even-width, so the wordmark's swelling is only approximated.
 *
 * Night (from h, a 2021 dusk photo of the clock as it is now, and the 2013
 * dusk photos y1/y2/y3): the hour marks glow solid red and the hands carry
 * red outlines, so the marks, the hands' red rims and the hub ring are
 * `neon-colgate-red`; the sign is a backlit box, red panel with white
 * letters, so its panel shares `neon-colgate-red` and the letters are
 * `neon-colgate-white`. The octagon is lined with white bulbs along its
 * outer edge and round the dial, drawn as `lamp-colgate-bulb` beads at
 * about 1.1 m spacing (the real bulbs are about twice as dense). The dial's
 * louvres, the black octagon, the hands' black bodies and the steel frame
 * are unlit and stay dark.
 *
 * Frame: authored x east, y north, z up, metres (mesh.ts converts). The
 * dial faces +x (east). Origin: on the ground under the centre of the dial,
 * in the dial's plane. The catalog anchor is that point: 4.5 m east and
 * 1.8 m north of the OSM clock node (node/2525734185), read from the NAIP
 * orthophoto, where the deck's posts and beams show as a 12.7 x 16.5 m grid
 * with the dial along its east edge. bearing 3 (the NAIP deck edges turn a
 * few degrees clockwise from the axes; estimated, +-3). OSM maps the clock
 * only as a node and no building, so the model replaces nothing. The lawn
 * is flat; y = 0 is grade.
 *
 * Published (New Jersey City University, "Colgate-Palmolive", Jersey City
 * history pages, citing the New York Times, 1955 and 1988; archived
 * https://web.archive.org/web/20141021151700/http://www.njcu.edu/programs/jchistory/pages/C_Pages/Colgate_Palmolive.htm,
 * and Wikipedia "Colgate Clock (Jersey City)"):
 * - dial 50 ft (15.24 m) in diameter, 1,963.5 sq ft (the area of the
 *   50 ft circle, so the 50 ft is the round dial, not the octagon);
 * - minute hand 25 ft 10 in (7.87 m), hour hand 20 ft (6.10 m).
 * Measured from photos, scaled by the dial:
 * - octagon 17.4 m across the flats (n1 at the dial's centre height, 1.13
 *   x the dial; n3 gives 1.15);
 * - hour marks 2.2 m long and 0.75-0.85 m wide, outer tips at the dial's edge (h);
 * - sign 18.6 x 3.9 m (n1: 4.75 : 1, 1.07 x the octagon), its top at the
 *   octagon's bottom flat;
 * - posts 3.0 m, deck 0.8 m deep (n3, n1); dial centre 16.4 m, octagon
 *   top 25.1 m.
 * Estimated: the rim's depth (1 m), the frame behind (column sizes, three
 * raking struts and two shorter ones, the mechanism box 2.5 x 3 x 3.5 m)
 * from n23 and s, oblique and partly hidden; the deck's posts as a 4 x 4
 * grid from the NAIP beams. The hands are set to 8:04, the time in h, so
 * the night render pairs with it; the real hands turn but are drawn still.
 * Left out: the louvre slats (a plain pale dial; slats would shimmer), the
 * two flagpoles on top, the catwalk and ladders, the floodlight arms, the
 * granite bench in front.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - n1 "9.30.22ColgateClockByLuigiNovi1.jpg", Luigi Novi, CC BY 4.0: front,
 *   from the walkway below; proportions, marks, hands, lettering trace.
 *   https://commons.wikimedia.org/wiki/File:9.30.22ColgateClockByLuigiNovi1.jpg
 * - n3 "9.30.22ColgateClockByLuigiNovi3.jpg", Luigi Novi, CC BY 4.0: from
 *   the south-east; heights of posts, deck, sign and octagon; struts.
 *   https://commons.wikimedia.org/wiki/File:9.30.22ColgateClockByLuigiNovi3.jpg
 * - n7 "9.30.22ColgateClockByLuigiNovi7.jpg", Luigi Novi, CC BY 4.0: from
 *   the south along the walkway; the struts' rake.
 *   https://commons.wikimedia.org/wiki/File:9.30.22ColgateClockByLuigiNovi7.jpg
 * - n10 "10.7.22ColgateClockByLuigiNovi10.jpg", Luigi Novi, CC BY 4.0:
 *   front, low; the deck, columns behind the octagon.
 *   https://commons.wikimedia.org/wiki/File:10.7.22ColgateClockByLuigiNovi10.jpg
 * - n23 "9.23.22ColgateClockByLuigiNovi2.jpg", Luigi Novi, CC BY 4.0: the
 *   back, from the north-west; the frame, struts, mechanism box, deck.
 *   https://commons.wikimedia.org/wiki/File:9.23.22ColgateClockByLuigiNovi2.jpg
 * - h "Colgate Clock Jersey City.jpg", Hij802, CC BY-SA 4.0: dusk, 2021,
 *   the lighting as it is now (red marks, red-rimmed hands, rim bulbs,
 *   backlit sign).
 *   https://commons.wikimedia.org/wiki/File:Colgate_Clock_Jersey_City.jpg
 * - s "Colgate Clock von hinten.JPG", Daniel Steffens, CC BY 3.0: the back
 *   from the south-west, 2010 (old frame; used only for the box behind).
 *   https://commons.wikimedia.org/wiki/File:Colgate_Clock_von_hinten.JPG
 * - y1, y2, y3 "Colgate Clock sunset.jpg", "Colgate Clock 01.jpg",
 *   "Colgate Clock 02.jpg", Youngking11, CC BY-SA 4.0: dusk, January 2013,
 *   before the refurbishment; red neon on the marks and hands.
 *   https://commons.wikimedia.org/wiki/File:Colgate_Clock_sunset.jpg
 * - b "Colgate Clock Jersey City from Battery Park City.jpg", Beyond My
 *   Ken, CC BY-SA 4.0: from across the river, the far view.
 *   https://commons.wikimedia.org/wiki/File:Colgate_Clock_Jersey_City_from_Battery_Park_City.jpg
 * - NAIP orthophoto (USGS NAIP Plus, public domain): the deck's plan and
 *   the dial's bearing.
 *
 * Doubts: the face's bearing (+-3 degrees) and the anchor (+-1.5 m) rest on
 * a 0.1 m NAIP image where the tall dial leans with relief displacement;
 * the frame behind the dial is simplified and its member count estimated;
 * the octagon's size is measured, not published.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes, type Pt } from './lettering'

const black = new Part(), face = new Part(), red = new Part(), white = new Part(), bulbs = new Part(), galv = new Part()

// ------------------------------------------------------------ dimensions
const R_DIAL = 7.62 // 50 ft dial
const APO = 8.7 // octagon apothem: 17.4 m across the flats
const ZC = 16.4 // dial centre height
const Z_SIGN0 = 3.8, Z_SIGN1 = ZC - APO // sign 3.8 to 7.7 m
const RIM_F = 0.4, RIM_B = -0.6 // rim front and back planes (x)
const FACE_F = 0.1, FACE_B = -0.3 // the dial's front and back
const N = 32 // segments round the dial (corners of the octagon fall on them)

/** A point in the dial plane: r from the centre at angle t (clockwise from 12 o'clock, as the viewer sees it). */
const yz = (r: number, t: number): [number, number] => [r * Math.sin(t), ZC + r * Math.cos(t)]
/** Distance from the centre to the octagon's edge at angle t (flat top). */
const octR = (t: number, a = APO) => {
  const k = Math.round(t / (Math.PI / 4)) * (Math.PI / 4)
  return a / Math.cos(t - k)
}

/** A quad (or triangle when c === d) wound to face `want`. */
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const ok = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0
  if (c === d) { if (ok) p.tri(a, b, c); else p.tri(a, c, b); return }
  if (ok) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}
/** A convex polygon in the dial plane (y, z), extruded from x0 to x1: front, back and walls. */
function prism(p: Part, poly: [number, number][], x0: number, x1: number, back = true) {
  const n = poly.length
  let cy = 0, cz = 0
  for (const [y, z] of poly) { cy += y / n; cz += z / n }
  for (let i = 1; i < n - 1; i++) {
    qf(p, [x1, ...poly[0]], [x1, ...poly[i]], [x1, ...poly[i + 1]], [x1, ...poly[i + 1]], [1, 0, 0])
    if (back) qf(p, [x0, ...poly[0]], [x0, ...poly[i]], [x0, ...poly[i + 1]], [x0, ...poly[i + 1]], [-1, 0, 0])
  }
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    const out: V3 = [0, (a[0] + b[0]) / 2 - cy, (a[1] + b[1]) / 2 - cz]
    qf(p, [x0, ...a], [x0, ...b], [x1, ...b], [x1, ...a], out)
  }
}
/** An axis-aligned box. */
function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, bottom = false) {
  const r = (z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  p.loft([r(z0), r(z1)])
  p.cap(r(z1), true)
  if (bottom) p.cap(r(z0), false)
}
/** A square member between two points, 2h across. */
function strut(p: Part, A: V3, B: V3, h: number) {
  const d: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]
  const L = Math.hypot(...d)
  const u: V3 = [d[0] / L, d[1] / L, d[2] / L]
  const ref: V3 = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  let s = cr(u, ref); const ls = Math.hypot(...s); s = [s[0] / ls, s[1] / ls, s[2] / ls]
  const t = cr(u, s)
  const ring = (P: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [P[0] + (s[0] * a + t[0] * b) * h, P[1] + (s[1] * a + t[1] * b) * h, P[2] + (s[2] * a + t[2] * b) * h] as V3)
  p.loft([ring(A), ring(B)])
}

// ------------------------------------------------------------ the octagon and dial
{
  const CH = 0.3 // bevel on the rim's outer front edge
  const ang = (i: number) => (2 * Math.PI * i) / N
  for (let i = 0; i < N; i++) {
    const t0 = ang(i), t1 = ang(i + 1)
    const P = (r: number, t: number, x: number): V3 => [x, ...yz(r, t)]
    const o0 = octR(t0), o1 = octR(t1), b0 = octR(t0, APO - CH), b1 = octR(t1, APO - CH)
    // rim front, between the dial and the bevel
    qf(black, P(R_DIAL, t0, RIM_F), P(R_DIAL, t1, RIM_F), P(b1, t1, RIM_F), P(b0, t0, RIM_F), [1, 0, 0])
    // the bevel
    qf(black, P(b0, t0, RIM_F), P(b1, t1, RIM_F), P(o1, t1, RIM_F - CH), P(o0, t0, RIM_F - CH), [1, 0, 0])
    // outer wall
    const mid = (t0 + t1) / 2
    qf(black, P(o0, t0, RIM_F - CH), P(o1, t1, RIM_F - CH), P(o1, t1, RIM_B), P(o0, t0, RIM_B), [0, Math.sin(mid), Math.cos(mid)])
    // rim back
    qf(black, P(R_DIAL, t0, RIM_B), P(R_DIAL, t1, RIM_B), P(o1, t1, RIM_B), P(o0, t0, RIM_B), [-1, 0, 0])
    // inner wall, facing the dial's centre, from the rim's front to the dial
    qf(black, P(R_DIAL, t0, RIM_F), P(R_DIAL, t1, RIM_F), P(R_DIAL, t1, FACE_F), P(R_DIAL, t0, FACE_F), [0, -Math.sin(mid), -Math.cos(mid)])
    qf(black, P(R_DIAL, t0, FACE_B), P(R_DIAL, t1, FACE_B), P(R_DIAL, t1, RIM_B), P(R_DIAL, t0, RIM_B), [0, -Math.sin(mid), -Math.cos(mid)])
    // the dial, front and back
    qf(face, P(0, 0, FACE_F), P(R_DIAL, t0, FACE_F), P(R_DIAL, t1, FACE_F), P(R_DIAL, t1, FACE_F), [1, 0, 0])
    qf(face, P(0, 0, FACE_B), P(R_DIAL, t0, FACE_B), P(R_DIAL, t1, FACE_B), P(R_DIAL, t1, FACE_B), [-1, 0, 0])
  }
}

// ------------------------------------------------------------ hour marks
for (let h = 0; h < 12; h++) {
  const t = (h / 12) * 2 * Math.PI
  const r0 = 5.2, r1 = 7.4, w = 0.42, tip = 0.45
  const rad = (r: number, s: number): [number, number] => {
    const [y, z] = yz(r, t)
    return [y + s * Math.cos(t), z - s * Math.sin(t)]
  }
  prism(red, [rad(r0, 0), rad(r0 + tip, -w), rad(r1 - tip, -w), rad(r1, 0), rad(r1 - tip, w), rad(r0 + tip, w)], FACE_F - 0.02, 0.38, false)
}

// ------------------------------------------------------------ hands (8:04, as in photo h)
/**
 * A hand as stations along its length (s from the pivot, half-width),
 * each pair of stations one convex slab: black body in front, a red rim
 * 0.16 m wider behind it (the outline that glows at night), and a silver
 * counterweight the other way.
 */
function hand(t: number, stations: [number, number][], tail: number, x0: number) {
  const at = (s: number, w: number): [number, number] => {
    const [y, z] = yz(s, t)
    return [y + w * Math.cos(t), z - w * Math.sin(t)]
  }
  const RIM = 0.16
  for (let i = 0; i < stations.length - 1; i++) {
    const [s0, w0] = stations[i], [s1, w1] = stations[i + 1]
    const red0 = w0 + RIM, red1 = w1 > 0 ? w1 + RIM : 0
    const sEnd = w1 > 0 ? s1 : s1 + RIM * 1.6
    prism(red, [at(s0, -red0), at(sEnd, -red1), at(sEnd, red1), at(s0, red0)].filter((p, k, a) => k === 0 || p[0] !== a[k - 1][0] || p[1] !== a[k - 1][1]), x0, x0 + 0.14, false)
    const body = w1 > 0 ? [at(s0, -w0), at(s1, -w1), at(s1, w1), at(s0, w0)] : [at(s0, -w0), at(s1, 0), at(s0, w0)]
    prism(black, body, x0 + 0.14, x0 + 0.36, false)
  }
  // counterweight: a tapered silver bar with a block at its end
  prism(galv, [at(-0.4, -0.16), at(-tail + 0.5, -0.24), at(-tail + 0.5, 0.24), at(-0.4, 0.16)], x0 + 0.04, x0 + 0.3, false)
  prism(galv, [at(-tail + 0.5, -0.36), at(-tail, -0.36), at(-tail, 0.36), at(-tail + 0.5, 0.36)], x0 + 0.04, x0 + 0.34, false)
}
const MIN = (4 / 60) * 2 * Math.PI, HOUR = ((8 + 4 / 60) / 12) * 2 * Math.PI
// hour hand: a narrow neck, then a broad leaf to its point (n1, h)
hand(HOUR, [[-0.5, 0.32], [0.9, 0.2], [3.6, 0.3], [4.9, 0.55], [5.5, 0.4], [6.1, 0]], 2.4, 0.42)
// minute hand: long and slender, swelling a little before the point
hand(MIN, [[-0.5, 0.3], [0.9, 0.18], [5.4, 0.3], [6.9, 0.38], [7.87, 0]], 2.8, 0.85)
// the hub: a red ring under a black cap
{
  const ring = (r: number) => Array.from({ length: 12 }, (_, k) => yz(r, (-k / 12) * 2 * Math.PI))
  prism(red, ring(0.75), 1.2, 1.32, false)
  prism(black, ring(0.55), 1.32, 1.5, false)
}

// ------------------------------------------------------------ bulbs round the octagon
/** A small octahedral bead, the bulb, standing on the rim's front. */
function bead(y: number, z: number) {
  const s = 0.17, x = RIM_F + 0.08
  const c: V3 = [x, y, z]
  const pts: V3[] = [[x, y + s, z], [x, y, z + s], [x, y - s, z], [x, y, z - s]]
  const tip: V3 = [x + s, y, z]
  for (let i = 0; i < 4; i++) {
    const a = pts[i], b = pts[(i + 1) % 4]
    qf(bulbs, a, b, tip, tip, [1, (a[1] + b[1]) / 2 - y, (a[2] + b[2]) / 2 - z])
  }
  void c
}
{
  // outer row, 0.35 m in from the octagon's edge: six a side, corners included
  const a = APO - 0.35
  const R = a / Math.cos(Math.PI / 8)
  for (let k = 0; k < 8; k++) {
    const t0 = Math.PI / 8 + (k * Math.PI) / 4, t1 = t0 + Math.PI / 4
    const [y0, z0] = yz(R, t0), [y1, z1] = yz(R, t1)
    for (let j = 0; j < 6; j++) bead(y0 + ((y1 - y0) * j) / 6, z0 + ((z1 - z0) * j) / 6)
  }
  // inner row round the dial
  for (let j = 0; j < 44; j++) {
    const [y, z] = yz(R_DIAL + 0.3, (j / 44) * 2 * Math.PI)
    bead(y, z)
  }
}

// ------------------------------------------------------------ the sign
const SIGN_W = 18.6, SIGN_X0 = -0.5, SIGN_X1 = 0.3
{
  const y0 = -SIGN_W / 2, y1 = SIGN_W / 2
  qf(red, [SIGN_X1, y0, Z_SIGN0], [SIGN_X1, y1, Z_SIGN0], [SIGN_X1, y1, Z_SIGN1], [SIGN_X1, y0, Z_SIGN1], [1, 0, 0])
  for (const [y, n] of [[y0, -1], [y1, 1]] as [number, number][])
    qf(red, [SIGN_X0, y, Z_SIGN0], [SIGN_X1, y, Z_SIGN0], [SIGN_X1, y, Z_SIGN1], [SIGN_X0, y, Z_SIGN1], [0, n, 0])
  qf(red, [SIGN_X0, y0, Z_SIGN1], [SIGN_X1, y0, Z_SIGN1], [SIGN_X1, y1, Z_SIGN1], [SIGN_X0, y1, Z_SIGN1], [0, 0, 1])
  qf(black, [SIGN_X0, y0, Z_SIGN0], [SIGN_X0, y1, Z_SIGN0], [SIGN_X0, y1, Z_SIGN1], [SIGN_X0, y0, Z_SIGN1], [-1, 0, 0])
}
// Lettering. Trace units: a 2000 x 447 enlargement of n1's sign, u right,
// v DOWN as read off the photo; the panel runs u 25-1950, v 20-425.
{
  const pen = new Pen(), bold = new Pen()
  const oval = (p: Pen, cx: number, cy: number, rx: number, ry: number, slant = 0.22, n = 16) => {
    const path: Pt[] = []
    for (let i = 0; i <= n; i++) {
      const a = (2 * Math.PI * i) / n, dy = ry * Math.sin(a)
      path.push([cx + rx * Math.cos(a) - dy * slant, cy + dy])
    }
    p.paths.push(path)
  }
  // C: open, its cuts slanted
  bold.moveTo([418, 92]).cubicTo([340, 40], [200, 66], [170, 180]).cubicTo([146, 282], [262, 322], [348, 272])
  // o
  oval(pen, 512, 214, 100, 80)
  // l
  bold.moveTo([800, 52]).lineTo([694, 306])
  // g: bowl, then the stem down into the hooked descender
  oval(pen, 900, 200, 72, 80)
  pen.moveTo([1008, 112]).lineTo([966, 318]).cubicTo([950, 388], [860, 398], [774, 368])
  // a: the hook over the top into the stem, and the bowl
  pen.moveTo([1112, 134]).cubicTo([1170, 96], [1290, 100], [1272, 172]).lineTo([1246, 300])
  oval(pen, 1160, 252, 66, 40, 0.15)
  // t: stem with a curled foot, and the crossbar
  pen.moveTo([1452, 64]).lineTo([1406, 250]).quadTo([1394, 304], [1472, 300])
  pen.moveTo([1326, 124]).lineTo([1500, 116])
  // e: the bar, round over the top and back, and the open tail
  pen.moveTo([1556, 200]).lineTo([1730, 186]).cubicTo([1742, 112], [1640, 108], [1590, 140]).cubicTo([1520, 190], [1520, 290], [1600, 296]).lineTo([1736, 286])
  // the registered mark: a ring and an R
  const reg = new Pen()
  reg.circle([1792, 86], 44, 44, 16)
  reg.moveTo([1777, 108]).lineTo([1777, 62]).lineTo([1798, 62]).quadTo([1816, 74], [1798, 86]).lineTo([1777, 86])
  reg.moveTo([1796, 86]).lineTo([1812, 108])

  const K = SIGN_W / 1925
  const flip = (p: Pen) => { p.paths = p.paths.map((path) => path.map(([u, v]) => [u, 447 - v] as Pt)); return p }
  // u to the reader's right (north, +y), v up, w toward the reader (east, +x)
  const place = (u: number, v: number, w: number): V3 => [SIGN_X1 + w, (u - 987.5) * K, Z_SIGN0 + (v - 22) * K]
  strokes(white, flip(bold).paths, { width: 72, depth: 0.14, place })
  strokes(white, flip(pen).paths, { width: 60, depth: 0.14, place })
  strokes(white, flip(reg).paths, { width: 13, depth: 0.14, place })
}

// ------------------------------------------------------------ frame and deck
const DECK_X = [0.0, -4.2, -8.5, -12.7], DECK_Y = [-8.25, -2.75, 2.75, 8.25]
const Z_POST = 3.0
for (const x of DECK_X) for (const y of DECK_Y) box(galv, x - 0.25, y - 0.25, 0, x + 0.25, y + 0.25, Z_POST)
// two layers of beams: east-west on top of north-south
for (const x of DECK_X) box(galv, x - 0.28, -8.6, Z_POST, x + 0.28, 8.6, Z_POST + 0.4, true)
for (const y of DECK_Y) box(galv, -13.0, y - 0.25, Z_POST + 0.4, 0.3, y + 0.25, Z_SIGN0, true)
// columns behind the dial, and the ties across
const COL_X = -1.2, COL_Y = [-7.8, 0, 7.8]
for (const y of COL_Y) box(black, COL_X - 0.32, y - 0.32, Z_SIGN0, COL_X + 0.32, y + 0.32, y === 0 ? ZC + APO - 0.2 : ZC + 3.2)
for (const z of [Z_SIGN1 + 0.2, ZC, ZC + 3.0]) box(black, COL_X - 0.25, -7.8, z - 0.25, COL_X + 0.25, 7.8, z + 0.25, true)
box(black, SIGN_X0 - 0.01, -7.8, Z_SIGN1 - 0.3, COL_X, 7.8, Z_SIGN1, true) // the sign's top rail into the columns
// raking struts back to the deck's rear, and shorter ones to the middle row
for (const y of COL_Y) strut(black, [COL_X - 0.3, y, y === 0 ? ZC + 6.5 : ZC + 2.8], [DECK_X[3] + 0.3, y, Z_SIGN0], 0.24)
for (const y of [-7.8, 7.8]) strut(black, [COL_X - 0.3, y, ZC - 1.0], [DECK_X[2], y, Z_SIGN0], 0.2)
// the mechanism box behind the dial's centre
box(galv, -4.0, -1.25, ZC - 2.0, COL_X - 0.3, 1.25, ZC + 1.5, true)

// ------------------------------------------------------------ write
const parts = [
  { part: black, material: finish('colgate-black', 0x4a4f57) },
  { part: face, material: finish('colgate-dial', 0xf1f2f1) },
  { part: red, material: finish('neon-colgate-red', 0xcf3a33) },
  { part: white, material: finish('neon-colgate-white', 0xf4f1ec) },
  { part: bulbs, material: finish('lamp-colgate-bulb', 0x5a5f66) },
  { part: galv, material: finish('galvanized-steel', 0xa9aeb2) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('Colgate Clock', parts, {
  license: 'CC0-1.0', bearing: 3, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-colgate-clock.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
