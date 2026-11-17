/**
 * The Pepsi-Cola sign (1940; rebuilt 1993-94 by Artkraft Strauss), Gantry
 * Plaza State Park, Long Island City, Queens. Procedural, CC0-1.0.
 *   bun generators/nyc-pepsi-cola-sign.ts
 *
 * Lettering: STYLE.md's "Famous signs" exception. The sign is the landmark,
 * so it carries "Pepsi:Cola" as geometry, traced letter by letter from a
 * straight-on licensed photo (p8) with `lettering.ts`: the Spencerian
 * script P with its top flag, bowl and big lower scroll whose tail runs
 * under "epsi" into the C; the C with its top flag swash, its top curl and
 * its looped foot; the small slanted "epsi", the colon and "ola" with the
 * flared script A. Centre-lines are traced in the photo's pixels (a 1600 px
 * crop of p8, 29.1 px per metre) and stroked at the letters' real weights:
 * the P and C stems 2.0 m, the swashes 1.65 m, the small letters 1.3 m.
 * Each stroke is one solid 0.6 m ribbon (a local `ribbon`, in place of
 * lettering.ts's even `strokes`): its face orange-red, its sides and back
 * aluminium, the painted returns seen in the oblique photos. Flag tips,
 * curl ends, spurs and the A's horn and tail taper to a point over about
 * 1.8 stroke widths, and tight bends are held from folding, so no rim or
 * second layer shows past a face. Colour: the sunlit face in p8, about
 * #e8642c; drawn #e4642e.
 * Night: the red letters are `neon-pepsi-red`, so the script glows red
 * after dark as the sign's red neon does (night photo "New York Pepsi sign
 * at night from Empire state building.jpg", Muhammad, CC BY 2.0). The
 * bottle's white body is `neon-pepsi-bottle`, as it shows lit white in
 * that photo; the frame and aluminium are
 * dark.
 *
 * Map frame: x east, y north, z up, metres. The model is built with the
 * sign facing -y and read left to right along +x; bearing 110.7 turns the
 * face to 290.7 (west-north-west, toward the UN, as Wikipedia says) and the
 * reading direction to 200.7, the long axis of OSM way/238974585 (a
 * 50 x 1.6 m tourism=attraction strip, the sign's footprint). The origin is
 * that way's centroid; the letters' front plane is 0.8 m in front of it.
 * There is no OSM building for the sign, so it replaces nothing. The
 * park's lawn is flat; y = 0 is grade.
 *
 * Published (Wikipedia "Pepsi-Cola sign", and the LPC designation report,
 * http://s-media.nyc.gov/agencies/lpc/lp/1653.pdf):
 * - steel grid 49 ft (15 m) tall and 150 ft (46 m) wide;
 * - letters at least 20 ft (6.1 m) above grade, reaching nearly 70 ft (21 m);
 * - the P and C 44 ft (13.4 m) tall: this sets the scale of the trace;
 * - the bottle 50 ft (15 m) tall, painted aluminium, 9.5 in deep;
 * - letters painted red and aluminium, with neon at their edges.
 * Measured from p8 at that scale: the letters span 38.1 m and the bottle
 * reaches 48 m from the P's scroll; the bottle leans 20.5 degrees right.
 * Lowest letter edge 7.3 m and the P's flag top 20.7 m (published: >= 6.1
 * and ~21 m). The row of columns and the big pipe beam at 5.8 m under the
 * letters, from p8 and p6.
 * Estimated: the steel frame's depth (3 m, from p1 and p6, oblique), the
 * number of columns (ten) and of rails; the frame is drawn as square
 * members much simplified, and its lattice of diagonals is left out except
 * a raking strut at each column. The "TRADE MARK" plate is a plain dark
 * board. The bottle is pale painted glass with its streaky brown cola as one
 * brown panel inset inside the outline; its label a
 * red-and-blue disc with no lettering.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p8 "Pepsi-Colas Sign (DSC04457).jpg", Polibil, CC BY-SA 4.0: straight
 *   on from the river, the letter trace and the bottle.
 *   https://commons.wikimedia.org/wiki/File:Pepsi-Colas_Sign_(DSC04457).jpg
 * - p1 "Long Island City Pepsi Cola Sign - May 2026.jpg", Anonymouscarrots,
 *   CC BY-SA 4.0: from the north-west in the park; the aluminium returns,
 *   columns and frame depth.
 *   https://commons.wikimedia.org/wiki/File:Long_Island_City_Pepsi_Cola_Sign_-_May_2026.jpg
 * - p6 "PepsiCola sign, Gantry Plaza State Park Long Island City 01
 *   (9431665809).jpg", Joe Mabel, CC BY-SA 2.0: from below, south-west; the
 *   frame, bottle label.
 *   https://commons.wikimedia.org/wiki/File:PepsiCola_sign,_Gantry_Plaza_State_Park_Long_Island_City_01_(9431665809).jpg
 * - p4 "Pepsi-Cola sign in Gantry Plaza State Park, Long Island City, New
 *   York.jpg", MusikAnimal, CC BY-SA 4.0: across the river from the west,
 *   the sign against the towers.
 *   https://commons.wikimedia.org/wiki/File:Pepsi-Cola_sign_in_Gantry_Plaza_State_Park,_Long_Island_City,_New_York.jpg
 * - p3 "Pepsi-Cola sign SWW.jpg", Solowomanwalks, CC BY-SA 3.0: from the
 *   park, south-west, the full frame and bottle.
 *   https://commons.wikimedia.org/wiki/File:Pepsi-Cola_sign_SWW.jpg
 *
 * Doubts: the strokes are of even width, so the script's swelling and
 * tapering weight is only approximated (heavier stems and swashes, lighter
 * small letters); the A's narrow counter closes up at this weight. The
 * back of the sign (east) is drawn as the frame behind the
 * letters' aluminium backs; no licensed photo shows it squarely. Colours
 * pulled to the palette's lightness from the sunlit red (photos range from
 * orange to crimson with the light).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish, PALETTE } from './palette'
import { Pen, type Pt } from './lettering'

const bottle = new Part(), red = new Part(), alu = new Part(), steel = new Part(), brown = new Part(), blue = new Part()

// ------------------------------------------------------------ the trace
// Letter units are p8 crop pixels: u right, v DOWN (as read off the photo).
const S = 29.1 // px per metre
const U0 = 775 // the sign's horizontal middle, px
const V0 = 440, Z0 = 7.3 // the lowest letter edge: px row and height (m)
const FRONT = -0.8 // the letters' front plane, model y
const toM = (u: number, v: number): [number, number] => [(u - U0) / S, Z0 + (V0 - v) / S]
/** w in metres out of the letter plane, toward the reader (-y). */
const place = (u: number, v: number, w: number): V3 => {
  const [x, z] = toM(u, v)
  return [x, FRONT - w, z]
}

// Swashes and the two big capitals: the heavy strokes.
const heavy = new Pen()
// P: top flag from its left point, over the top into the bowl, closing back in a curl.
heavy.moveTo([142, 140]).lineTo([152, 132]).cubicTo([200, 82], [262, 46], [330, 48]).cubicTo([392, 52], [414, 92], [408, 130])
  .cubicTo([402, 172], [356, 192], [312, 188]).quadTo([282, 184], [286, 160]).quadTo([290, 146], [306, 150], 3)
// P stem: a hooked top, down and a little left.
const stem = new Pen()
stem.moveTo([214, 150]).quadTo([226, 126], [262, 124], 4).cubicTo([270, 160], [258, 240], [246, 312]).quadTo([238, 352], [244, 384], 4)
// P scroll: the curl inside, round the left, along the bottom and away under "epsi" into the C.
heavy.moveTo([146, 332]).quadTo([186, 300], [152, 282], 4).cubicTo([100, 270], [66, 326], [84, 374])
  .cubicTo([100, 422], [176, 424], [244, 410]).cubicTo([400, 402], [600, 412], [700, 356]).quadTo([738, 336], [770, 322], 4)
// C: the flag swash from its left point, hooking down, then rising right into the top curl.
heavy.moveTo([438, 44]).lineTo([446, 54]).cubicTo([480, 80], [468, 128], [508, 128], 8)
  .cubicTo([610, 126], [700, 112], [790, 64]).cubicTo([834, 38], [920, 30], [924, 76])
  .cubicTo([928, 112], [878, 124], [862, 104]).quadTo([852, 84], [880, 84], 3)
// C stem: from the top loop down round to the looped foot.
stem.moveTo([842, 62]).cubicTo([790, 110], [756, 240], [772, 330])
  .cubicTo([790, 424], [904, 432], [958, 400]).cubicTo([992, 380], [978, 318], [922, 306])
  .cubicTo([872, 296], [830, 320], [838, 348])

// The small letters, the colon and "ola".
const light = new Pen()
// e: a slanted stem with three flared arms (the script E of the sign).
light.moveTo([336, 226]).lineTo([304, 352])
light.moveTo([334, 226]).lineTo([378, 222]).lineTo([384, 236])
light.moveTo([318, 290]).lineTo([358, 292])
light.moveTo([302, 350]).lineTo([352, 348]).lineTo([376, 336])
// p: stem and bowl, a foot serif.
light.moveTo([444, 222]).lineTo([414, 354])
light.moveTo([440, 228]).cubicTo([500, 216], [506, 290], [436, 292], 6)
light.moveTo([396, 356]).lineTo([438, 356])
// s
light.moveTo([586, 238]).cubicTo([566, 210], [512, 222], [526, 266], 6).cubicTo([538, 300], [588, 290], [580, 330], 6)
  .cubicTo([574, 362], [528, 364], [514, 338], 6)
// i: a tall stem with a flared top and foot.
light.moveTo([652, 196]).lineTo([620, 330])
light.moveTo([636, 196]).lineTo([668, 192])
light.moveTo([604, 332]).lineTo([636, 330])
// o: a slanted oval ring.
const oval = (cx: number, cy: number, rx: number, ry: number, slant: number) => {
  const path: Pt[] = []
  for (let i = 0; i <= 16; i++) {
    const t = (2 * Math.PI * i) / 16, y = ry * Math.sin(t)
    path.push([cx + rx * Math.cos(t) - y * slant, cy + y])
  }
  light.paths.push(path)
}
oval(893, 213, 38, 60, 0.18)
// l: stem curling into a flared foot.
light.moveTo([992, 152]).lineTo([966, 270]).lineTo([1042, 264])
// a: the serif capital A, as wide as the O and its tail (p8 at 3x): a thick
// left leg leaning right from a flared foot, a thinner right leg running
// down into a long swash tail, a short crossbar below the small counter
// ending in a flare past the right leg, a horn curling off the apex to the
// right, and a spur on the left leg.
heavy.moveTo([1058, 310]).quadTo([1078, 244], [1102, 178], 4)
light.moveTo([1040, 318]).lineTo([1076, 314])
light.moveTo([1120, 180]).quadTo([1140, 236], [1146, 298], 4).quadTo([1152, 346], [1178, 384], 4).lineTo([1184, 392])
light.moveTo([1076, 266]).lineTo([1150, 268]).lineTo([1190, 276])
light.moveTo([1100, 170]).quadTo([1140, 160], [1160, 200], 4)
light.moveTo([1050, 226]).lineTo([1088, 234])
// The colon: two short slanted dashes.
light.moveTo([708, 190]).lineTo([702, 212])
light.moveTo([700, 252]).lineTo([694, 274])

const STEM = 2.0 * S, HEAVY = 1.65 * S, LIGHT = 1.3 * S
// Ends that come to a point (flags, curl ends, spurs, the A's horn and tail):
// the stroke narrows to a tip over about 1.8 stroke widths.
const TIPS: Pt[] = [[142, 140], [306, 150], [146, 332], [214, 150], [438, 44], [880, 84], [838, 348], [384, 236], [376, 336],
  [586, 238], [514, 338], [1184, 392], [1190, 276], [1100, 170], [1160, 200], [1050, 226], [1042, 264], [1040, 318]]
const isTip = (p: Pt) => TIPS.some(t => Math.hypot(t[0] - p[0], t[1] - p[1]) < 4)
const O = place(0, 0, 0)
const dir = (u: number, v: number, w: number): V3 => { const q = place(u, v, w); return [q[0] - O[0], q[1] - O[1], q[2] - O[2]] }
/**
 * One stroke as a solid ribbon: its face red, its sides and back aluminium
 * (the painted returns), tapering to a point at a tip end. One piece of
 * geometry per stroke, so no rim or second layer can show past the face.
 */
function ribbon(raw: Pt[], width: number, depth: number) {
  const pts = raw.filter((q, i) => i === 0 || Math.hypot(q[0] - raw[i - 1][0], q[1] - raw[i - 1][1]) > 1e-6)
  if (pts.length < 2) return
  const closed = pts.length > 2 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 1e-6
  const ring = closed ? pts.slice(0, -1) : pts
  const n = ring.length
  const acc = [0]
  for (let i = 1; i < n; i++) acc.push(acc[i - 1] + Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]))
  const total = acc[n - 1], T = 1.8 * width
  const tA = !closed && isTip(ring[0]), tB = !closed && isTip(ring[n - 1])
  const L: Pt[] = [], R: Pt[] = [], N: Pt[] = []
  for (let i = 0; i < n; i++) {
    const prev = closed ? ring[(i + n - 1) % n] : ring[Math.max(0, i - 1)]
    const next = closed ? ring[(i + 1) % n] : ring[Math.min(n - 1, i + 1)]
    const un = (v: Pt): Pt => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
    const d0 = un(i === 0 && !closed ? [next[0] - ring[i][0], next[1] - ring[i][1]] : [ring[i][0] - prev[0], ring[i][1] - prev[1]])
    const d1 = un(i === n - 1 && !closed ? [ring[i][0] - prev[0], ring[i][1] - prev[1]] : [next[0] - ring[i][0], next[1] - ring[i][1]])
    const t = un([d0[0] + d1[0], d0[1] + d1[1]]), nl: Pt = [-t[1], t[0]]
    const k = Math.min(2, 1 / Math.max(0.5, nl[0] * -d0[1] + nl[1] * d0[0]))
    let f = 1
    if (tA) f = Math.min(f, acc[i] / T)
    if (tB) f = Math.min(f, (total - acc[i]) / T)
    let h = (width / 2) * k * Math.max(0.04, Math.min(1, f)) ** 0.85
    // on a tight bend keep the inner edge from folding back over itself
    const cosT = d0[0] * d1[0] + d0[1] * d1[1]
    if (cosT < 0.999 && (closed || (i > 0 && i < n - 1))) {
      const half = Math.acos(Math.max(-1, Math.min(1, cosT))) / 2
      const lp = Math.hypot(ring[i][0] - prev[0], ring[i][1] - prev[1]), ln = Math.hypot(next[0] - ring[i][0], next[1] - ring[i][1])
      h = Math.min(h, (0.95 * Math.min(lp, ln)) / Math.max(1e-6, Math.sin(half)))
    }
    L.push([ring[i][0] + nl[0] * h, ring[i][1] + nl[1] * h]); R.push([ring[i][0] - nl[0] * h, ring[i][1] - nl[1] * h]); N.push(nl)
  }
  // where an edge would run backwards round a tight bend (a bow-tie face),
  // hold it at its last point instead
  for (let i = 1; i < n; i++) {
    const c: Pt = [ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]]
    for (const E of [L, R]) if ((E[i][0] - E[i - 1][0]) * c[0] + (E[i][1] - E[i - 1][1]) * c[1] < 0) E[i] = [E[i - 1][0], E[i - 1][1]]
  }
  const P = (q: Pt, w: number) => place(q[0], q[1], w)
  const front = dir(0, 0, 1), back = dir(0, 0, -1)
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % n
    qf(red, P(R[i], depth), P(R[j], depth), P(L[j], depth), P(L[i], depth), front)
    qf(alu, P(R[i], 0), P(R[j], 0), P(L[j], 0), P(L[i], 0), back)
    const nl: Pt = [(N[i][0] + N[j][0]) / 2, (N[i][1] + N[j][1]) / 2]
    qf(alu, P(L[i], 0), P(L[j], 0), P(L[j], depth), P(L[i], depth), dir(nl[0], nl[1], 0))
    qf(alu, P(R[i], 0), P(R[j], 0), P(R[j], depth), P(R[i], depth), dir(-nl[0], -nl[1], 0))
  }
  if (!closed) for (const [i, j] of [[0, 1], [n - 1, n - 2]]) {
    const d = dir(ring[i][0] - ring[j][0], ring[i][1] - ring[j][1], 0)
    qf(alu, P(L[i], 0), P(R[i], 0), P(R[i], depth), P(L[i], depth), d)
  }
}
for (const [pen, w] of [[stem, STEM], [heavy, HEAVY], [light, LIGHT]] as [Pen, number][])
  for (const path of pen.paths) ribbon(path, w, 0.6)

// ------------------------------------------------------------ the bottle
/** A quad (or a triangle, with d = c) wound to face `want`. */
function qf(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const ok = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0
  if (c === d) { if (ok) p.tri(a, b, c); else p.tri(a, c, b); return }
  if (ok) p.quad(a, b, c, d); else p.quad(d, c, b, a)
}
// Axis from the bottom middle (p8 px 1345, 438) to the lip (1488, 48);
// half-widths along it, metres, from p8.
{
  const a = toM(1345, 438), b = toM(1488, 48)
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ax: [number, number] = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nx: [number, number] = [ax[1], -ax[0]]
  const prof: [number, number][] = [[0, 1.55], [0.03, 1.72], [0.56, 1.72], [0.66, 1.45], [0.76, 0.78], [0.83, 0.62], [0.95, 0.62], [0.96, 0.72], [1, 0.72]]
  const at = (t: number, s: number, y: number): V3 => [a[0] + ax[0] * t * L + nx[0] * s, y, a[1] + ax[1] * t * L + nx[1] * s]
  const y0 = FRONT + 0.2, y1 = FRONT - 0.05
  // the white body: a slab, segment by segment (each piece convex)
  for (let i = 0; i < prof.length - 1; i++) {
    const [t0, h0] = prof[i], [t1, h1] = prof[i + 1]
    const q = (s0: number, s1: number, y: number): V3[] => [at(t0, -h0, y), at(t0, h0, y), at(t1, h1, y), at(t1, -h1, y)]
    const f = q(0, 0, y1), k = q(0, 0, y0)
    const F: V3 = [0, -1, 0], B: V3 = [0, 1, 0]
    qf(bottle, f[0], f[1], f[2], f[3], F)
    qf(bottle, k[0], k[1], k[2], k[3], B)
    qf(bottle, k[1], f[1], f[2], k[2], [nx[0], 0, nx[1]])
    qf(bottle, f[0], k[0], k[3], f[3], [-nx[0], 0, -nx[1]])
    if (i === 0) qf(bottle, k[0], f[0], f[1], k[1], [-ax[0], 0, -ax[1]])
    if (i === prof.length - 2) qf(bottle, f[3], k[3], k[2], f[2], [ax[0], 0, ax[1]])
  }
  // the brown cola, a panel on the face from the base to the label
  const yb = y1 - 0.04
  qf(brown, at(0.07, 1.12, yb), at(0.07, -1.12, yb), at(0.53, -1.2, yb), at(0.53, 1.2, yb), [0, -1, 0])
  qf(brown, at(0.53, 1.2, yb), at(0.53, -1.2, yb), at(0.56, -1.0, yb), at(0.56, 1.0, yb), [0, -1, 0])
  // the label: a disc, red over blue, on a pale band
  const c = 0.66 * L, r = 1.05, ys = y1 - 0.06
  for (let i = 0; i < 16; i++) {
    const t0 = (i / 16) * 2 * Math.PI, t1 = ((i + 1) / 16) * 2 * Math.PI
    const P = (t: number): V3 => at(c / L + (r * Math.sin(t)) / L, r * Math.cos(t), ys)
    const part = Math.sin((t0 + t1) / 2) > 0 ? red : blue
    const q0 = P(t0)
    qf(part, at(c / L, 0, ys), P(t1), q0, q0, [0, -1, 0])
  }
}

// ------------------------------------------------------------ the frame
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
  const ref: V3 = Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  const cr = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  let s = cr(u, ref); const ls = Math.hypot(...s); s = [s[0] / ls, s[1] / ls, s[2] / ls]
  const t = cr(u, s)
  const ring = (P: V3) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a, b]) => [P[0] + (s[0] * a + t[0] * b) * h, P[1] + (s[1] * a + t[1] * b) * h, P[2] + (s[2] * a + t[2] * b) * h] as V3)
  p.loft([ring(A), ring(B)])
}
const COLS = Array.from({ length: 10 }, (_, i) => -21 + (i * 42) / 9)
const YB = FRONT + 1.2, YK = FRONT + 3.8 // the frame's front and back planes
for (const x of COLS) {
  // round columns under the beam (one row, p1 and p3)
  for (const y of [YB]) {
    const ring = (z: number): V3[] => Array.from({ length: 8 }, (_, k) => [x + 0.38 * Math.cos((k / 8) * 2 * Math.PI), y + 0.38 * Math.sin((k / 8) * 2 * Math.PI), z] as V3)
    steel.loft([ring(0), ring(6.2)])
  }
  // upright behind the letters, and a raking strut back to the rear beam
  box(steel, x - 0.18, YB - 0.18, 6.2, x + 0.18, YB + 0.18, 20.6)
  strut(steel, [x, YB, 19.6], [x, YK, 6.4], 0.13)
  box(steel, x - 0.15, YB, 6.1, x + 0.15, YK, 6.5) // tie
}
// the big pipe beams along the front and back, and the rails
box(steel, -23, YB - 0.35, 5.6, 23, YB + 0.35, 6.3)
box(steel, -23, YK - 0.2, 6.0, 23, YK + 0.2, 6.4)
for (const z of [10.6, 15.2, 20.2]) box(steel, -22.2, YB - 0.14, z, 22.2, YB + 0.14, z + 0.3)
// the bottle's own back frame stands up behind it to its height
box(steel, 19.6, YB - 0.15, 20.4, 22.6, YB + 0.15, 21.2)
// TRADE MARK plate under the tail of the P (p8: px 655-800, 444-482)
{
  const [x0, z1] = toM(655, 444), [x1, z0] = toM(800, 482)
  box(steel, x0, FRONT + 0.3, z0, x1, FRONT + 0.5, z1)
}

const parts = [
  { part: red, material: finish('neon-pepsi-red', 0xe4642e) },
  { part: alu, material: PALETTE.trim },
  { part: steel, material: finish('sign-steel', 0x4a4f57) },
  { part: bottle, material: finish('neon-pepsi-bottle', 0xefe9df) },
  { part: brown, material: finish('cola-brown', 0x9a6d55) },
  { part: blue, material: finish('pepsi-blue', 0x5d79a8) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) top = Math.max(top, part.pos[i])
const glb = writeGlb('Pepsi-Cola Sign', parts, {
  license: 'CC0-1.0', bearing: 110.7, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-pepsi-cola-sign.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m`)
