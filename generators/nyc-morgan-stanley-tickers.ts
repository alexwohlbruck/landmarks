/**
 * The Morgan Stanley tickers and screens on 1585 Broadway, Times Square
 * (signage of 1995, the screens replaced in 2015). Procedural, CC0-1.0.
 *   bun generators/nyc-morgan-stanley-tickers.ts
 *
 * Signage only: the tower itself stays as the map's OSM extrusion, so this
 * replaces nothing. What it draws, all on the Broadway (east) front of the
 * podium between 47th and 48th Streets:
 * - the three long raked ticker bands stacked over the fourth-storey
 *   setback, 140 ft (43 m) wide and 10-12 ft high each (Wikipedia "1585
 *   Broadway"); lit blue as the 2015 screens show in p4, p6 (2019);
 * - the two tall corner screens, 30 x 60 ft (9.1 x 18.3 m), on the 47th and
 *   48th Street faces of the setback tier, beside the bands' ends (p1, p4,
 *   p6, p7);
 * - the two curved corner screens, 44 ft (13.4 m) tall, wrapping the
 *   Broadway corners over the shopfronts (p4, p6, p7, p8);
 * - the ten dark-glass fins over the Broadway sidewalk, each carrying one
 *   character of "1585.B'WAY" (Wikipedia; p4, p6, p8), with the blue light
 *   line up each fin's front edge (p6, p8).
 *
 * Lettering: "1585.B'WAY" on the fins is the building's own name sign since
 * 1990, so it is drawn (STYLE.md "Famous signs"): a bold condensed sans,
 * cap height 2.2 m, traced from p4 and p8 (night, the characters lit amber
 * on the fins' lower ends). The screens' content (logos, quotes, weather)
 * changes all day, so none is drawn: each screen is one colour block.
 * Night: the bands and tall screens are `neon-ms-blue` and the cylinders
 * `neon-ms-indigo`, as they glow in p4 (dusk) and p1; the fin characters
 * `neon-ms-amber` (p8). Cabinets, caps, fins and brackets are dark
 * `sign-frame`.
 *
 * Frame: x runs north along Broadway (bearing 16.7), y into the building
 * (west), z up; the bearing 286.7 turns the screens' faces (-y) to 106.7,
 * square to the Broadway front. The origin is on the Broadway front of OSM
 * way/42496284 (Morgan Stanley Building, 1585 Broadway), 12 m north of
 * its south end. That front is y = 0 from x = -24.0 (47th St corner) to
 * 19.8 (48th St corner). Host parts used (OSM building:part):
 * - way/259903122, 20 m, the podium strip along Broadway (y 0 to 4-5);
 * - way/259903124, 40 m, the setback tier: front face from (-22.7, 4.1) to
 *   (21.6, 5.0); its 47th St face from (-26.9, 7.1) toward (-20.5, 33.6),
 *   its 48th St face (way/259903124 and 259903125) from (26.0, 6.3) toward
 *   (29.6, 22.3).
 * Every sign's back stands 0.3 m outside the face it is fixed to (checked
 * by the scratch script `check.py`); the fins stand out over the sidewalk
 * from y = -0.3, as Wikipedia says they do.
 *
 * Lidar: USGS NY CMPG 2017 (via tools/lidar.py, 0.5 m), read in this
 * frame: podium roof 20.3 m above the sidewalk, the setback tier and the
 * tall screens' tops 38.6 m; the tall screens stand ~1.5-2 m proud of
 * their faces at y 8-14; the top band's top edge at ~38.5. The lidar puts
 * the setback face ~2.5 m further back than OSM; the bands are hung on the
 * OSM face so that they sit on the map's extrusion. Ground is flat.
 * Published (Wikipedia, "1585 Broadway"): band size, corner-screen size,
 * curved-screen height, ten fins.
 * Estimated: the bands' vertical spacing (the 18.3 m sign zone 20.3-38.6
 * shared by three bands, 3.6 m faces), their rake (1.2 m out at the top,
 * from p4 and p6), and their length: drawn 49.6 m, corner screen to corner
 * screen as p4 and p6 show them, against the published 43 m; the fins'
 * height (3.0-19.0 m), depth (2.3 m) and spacing (4.2 m) from p4 and p6;
 * the characters' baseline (3.6 m, p8); the drums' height 6.4-19.8 m (their
 * tops just under the podium roof and the lowest band, p4, p7), back radius
 * 4.3 m and face 0.5 m in front; their plan is fitted round the OSM corner
 * jogs (scratch `drumfit.py`) so their backs stay >= 0.25 m outside the
 * extrusion, which leaves arcs of 141 and 160 degrees.
 *
 * Photos (Wikimedia Commons; all EVIDENCE):
 * - p4 "Morgan Stanley Headquarters (48105951892).jpg", Ajay Suresh, CC BY
 *   2.0 (2019, dusk, from 47th St and Broadway): every sign, the fins.
 *   https://commons.wikimedia.org/wiki/File:Morgan_Stanley_Headquarters_(48105951892).jpg
 * - p6 "MorganStanley HQ TimesSquare May 2019.jpg", Icc1977, CC BY-SA 4.0:
 *   from the 48th St end, bands, cylinder, tall screen, fins.
 *   https://commons.wikimedia.org/wiki/File:MorganStanley_HQ_TimesSquare_May_2019.jpg
 * - p1 "Morgan Stanley Times Square.jpg", PLBechly, CC BY-SA 4.0: from
 *   48th St, the stack of three bands, tall screen and cylinder (purple).
 *   https://commons.wikimedia.org/wiki/File:Morgan_Stanley_Times_Square.jpg
 * - p7 "Times Sq Nov 2021 177.jpg", Epicgenius, CC BY-SA 4.0: the 47th St
 *   cylinder, its cap, the tall screen above.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Nov_2021_177.jpg
 * - p8 "The Morgan Stanley Building (WTM by official-ly cool 112).jpg",
 *   Wikipedia Takes Manhattan team, CC BY-SA 3.0 (night, before 2015): the
 *   amber tickers, the lit fin characters.
 *   https://commons.wikimedia.org/wiki/File:The_Morgan_Stanley_Building_(WTM_by_official-ly_cool_112).jpg
 * - p3 "Morgan Stanley on Times Square.JPG", Jenix89, public domain: the
 *   cylinder and the old amber ticker.
 *   https://commons.wikimedia.org/wiki/File:Morgan_Stanley_on_Times_Square.JPG
 * - p2 "1585 Broadway - Morgan Stanley Building (55283615766).jpg", Ajay
 *   Suresh, CC BY 4.0 (2025): the base under renovation, the old signs gone.
 *   https://commons.wikimedia.org/wiki/File:1585_Broadway_-_Morgan_Stanley_Building_(55283615766).jpg
 *
 * Doubts: this is the 2015-2024 sign set. Wikipedia says the 2015 displays
 * were removed in a Gensler renovation of the lower storeys due to finish in
 * the second half of 2026, and p2 (2025) shows new black, unlit bands
 * wrapping a rounded 47th St corner; the new screens' layout and colours
 * have no licensed photo yet. The screens' colour changes with their
 * content (blue in most photos, purple in p1; the bands were amber-on-black
 * tickers before 2015); blue is the 2015 house colour. The setback face is
 * ~2.5 m behind where OSM draws it, so on the map the bands sit a little
 * further forward than they really do. The 47th St lower podium's small
 * screens (p4) are left out.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { finish } from './palette'
import { Pen, strokes } from './lettering'

const blue = new Part(), indigo = new Part(), amber = new Part(), frame = new Part()

// ------------------------------------------------------------ helpers
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/**
 * A six-faced solid from its bottom ring b (4 corners, counter-clockwise from
 * above) and top ring t. `front` (a side index 0-3, side i runs b[i]→b[i+1])
 * gets a lit panel with a dark rim; every other face is frame.
 */
function hexa(b: V3[], t: V3[], front = -1, lit: Part = blue, rim = 0.22) {
  frame.quad(t[0], t[1], t[2], t[3])
  frame.quad(b[3], b[2], b[1], b[0])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    if (i === front) panel(b[i], b[j], t[j], t[i], lit, rim)
    else frame.quad(b[i], b[j], t[j], t[i])
  }
}
/** A lit quad a-b-c-d (counter-clockwise from the front) inside a dark rim. */
function panel(a: V3, b: V3, c: V3, d: V3, lit: Part, rim: number) {
  const w = Math.hypot(...(b.map((v, k) => v - a[k]) as V3)), h = Math.hypot(...(d.map((v, k) => v - a[k]) as V3))
  const su = rim / w, sv = rim / h
  const at = (u: number, v: number) => lerp3(lerp3(a, b, u), lerp3(d, c, u), v)
  const A = at(su, sv), B = at(1 - su, sv), C = at(1 - su, 1 - sv), D = at(su, 1 - sv)
  lit.quad(A, B, C, D)
  frame.quad(a, b, B, A)
  frame.quad(b, c, C, B)
  frame.quad(c, d, D, C)
  frame.quad(d, a, A, D)
}

// ------------------------------------------------------------ the three ticker bands
// The OSM front of the 40 m setback tier (way/259903124): y = F(x).
const F = (x: number) => 4.1 + (0.9 * (x + 22.7)) / 44.3
const GAP = 0.3 // sign back to host face
const RAKE = 1.2, LIP = 0.35 // the face leans out 1.2 m at its top; the bottom edge stands 0.35 m out
const BX0 = -25.0, BX1 = 24.6 // corner screen to corner screen, as p4 and p6 show (published 140 ft, 43 m)
const BH = 3.6
for (const top of [26.2, 32.3, 38.4]) {
  const z0 = top - BH
  const yb0 = F(BX0) - GAP, yb1 = F(BX1) - GAP
  // section: back-bottom, front-bottom, front-top, back-top
  const b: V3[] = [[BX0, yb0 - LIP, z0], [BX1, yb1 - LIP, z0], [BX1, yb1, z0], [BX0, yb0, z0]]
  const t: V3[] = [[BX0, yb0 - RAKE - LIP, top], [BX1, yb1 - RAKE - LIP, top], [BX1, yb1, top], [BX0, yb0, top]]
  hexa(b, t, 0, blue, 0.25)
}

// ------------------------------------------------------------ the tall corner screens
/** A 9.1 x 18.3 m screen cabinet on a host face from P0 along unit u; n is the face's outward normal. */
function tallScreen(P0: [number, number], P1: [number, number], s0: number, width: number, depth: number) {
  const L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1])
  const u: V3 = [(P1[0] - P0[0]) / L, (P1[1] - P0[1]) / L, 0]
  let n: V3 = [u[1], -u[0], 0] // right of the walking direction
  return { u, n, L, build: (outSign: number) => {
    n = scale(n, outSign)
    const base: V3 = [P0[0], P0[1], 0]
    const p = (s: number, off: number, z: number): V3 => add(add(base, scale(u, s)), add(scale(n, off), [0, 0, z]))
    const z0 = 20.3, z1 = 38.6
    const a = p(s0, GAP + depth, z0), b = p(s0 + width, GAP + depth, z0), c = p(s0 + width, GAP, z0), d = p(s0, GAP, z0)
    const ring = (z: number) => [a, b, c, d].map((q) => [q[0], q[1], z] as V3)
    // order the ring counter-clockwise from above
    const r0 = ring(z0), r1 = ring(z1)
    const ccw = (r: V3[]) => {
      const area = r.reduce((s, q, i) => s + q[0] * r[(i + 1) % 4][1] - r[(i + 1) % 4][0] * q[1], 0)
      return area > 0
    }
    if (ccw(r0)) hexa(r0, r1, 0, blue, 0.3)
    else hexa([r0[1], r0[0], r0[3], r0[2]], [r1[1], r1[0], r1[3], r1[2]], 0, blue, 0.3)
  } }
}
// 47th St face of the setback tier, walking north-west from its Broadway corner; out is -x-ish.
{
  const s = tallScreen([-26.9, 7.1], [-20.5, 33.6], 0.2, 9.1, 1.2)
  s.build(s.n[0] < 0 ? 1 : -1)
}
// 48th St face, from its Broadway corner; out is +x-ish.
{
  const s = tallScreen([26.0, 6.3], [29.6, 22.3], 0.2, 9.1, 1.2)
  s.build(s.n[0] > 0 ? 1 : -1)
}

// ------------------------------------------------------------ the curved corner screens
/**
 * A curved screen: a shell about c from a0 to a1 (degrees, counter-clockwise),
 * its back at radius r and its lit face at r + d, between z0 and z1, with a
 * dark cap ring on top and a pier under its middle.
 */
function drum(c: [number, number], r: number, a0: number, a1: number, z0: number, z1: number, d: number) {
  const N = 14, R = r + d, rim = 0.35, capT = 0.5, capO = 0.25
  const ang = (k: number) => ((a0 + ((a1 - a0) * k) / N) * Math.PI) / 180
  const P = (k: number, rr: number, z: number): V3 => [c[0] + rr * Math.cos(ang(k)), c[1] + rr * Math.sin(ang(k)), z]
  const Nm = (k: number): V3 => [Math.cos(ang(k)), Math.sin(ang(k)), 0]
  for (let k = 0; k < N; k++) {
    // lit face between dark rims, smooth-shaded
    const a = P(k, R, z0 + rim), b = P(k + 1, R, z0 + rim), cc = P(k + 1, R, z1 - rim), dd = P(k, R, z1 - rim)
    indigo.tri(a, b, cc, [0, 0], [0, 0], [0, 0], [Nm(k), Nm(k + 1), Nm(k + 1)])
    indigo.tri(a, cc, dd, [0, 0], [0, 0], [0, 0], [Nm(k), Nm(k + 1), Nm(k)])
    frame.quad(P(k, R, z0), P(k + 1, R, z0), P(k + 1, R, z0 + rim), P(k, R, z0 + rim))
    frame.quad(P(k, R, z1 - rim), P(k + 1, R, z1 - rim), P(k + 1, R, z1), P(k, R, z1))
    // the cap ring: outer band, top, underside of the overhang
    frame.quad(P(k, R + capO, z1), P(k + 1, R + capO, z1), P(k + 1, R + capO, z1 + capT), P(k, R + capO, z1 + capT))
    frame.quad(P(k, r, z1 + capT), P(k, R + capO, z1 + capT), P(k + 1, R + capO, z1 + capT), P(k + 1, r, z1 + capT))
    frame.quad(P(k, R + capO, z1), P(k, R, z1), P(k + 1, R, z1), P(k + 1, R + capO, z1))
    // soffit and back
    frame.quad(P(k, r, z0), P(k, R, z0), P(k + 1, R, z0), P(k + 1, r, z0))
    frame.quad(P(k + 1, r, z0), P(k + 1, r, z1 + capT), P(k, r, z1 + capT), P(k, r, z0))
  }
  // end caps
  const end = (k: number, flip: boolean) => {
    const a = P(k, r, z0), b = P(k, R + capO, z0), cc = P(k, R + capO, z1 + capT), dd = P(k, r, z1 + capT)
    if (flip) frame.quad(b, a, dd, cc)
    else frame.quad(a, b, cc, dd)
  }
  end(0, false)
  end(N, true)
  // the pier under the drum's middle, between the shopfronts (p4, p7)
  const m = (((a0 + a1) / 2) * Math.PI) / 180, q: [number, number] = [c[0] + (r + d / 2) * Math.cos(m), c[1] + (r + d / 2) * Math.sin(m)]
  const cs = Math.cos(m), sn = Math.sin(m), hw = 0.4
  const corner = (i: number, j: number): V3 => [q[0] + i * hw * cs - j * hw * sn, q[1] + i * hw * sn + j * hw * cs, 0]
  const b: V3[] = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)]
  hexa(b, b.map((p) => [p[0], p[1], z0] as V3))
}
// Fitted round the OSM corner jogs (scratch drumfit.py): each arc runs
// between the angles where its back stays >= 0.25 m outside the podium parts.
drum([-24.6, 4.0], 4.3, 141, 282, 6.4, 19.8, 0.5) // 47th St corner
drum([22.2, 3.0], 4.3, -132, 28, 6.4, 19.8, 0.5) // 48th St corner

// ------------------------------------------------------------ the fins and "1585.B'WAY"
const glyph: Record<string, Pen> = {}
{
  const g = (k: string) => (glyph[k] = new Pen())
  g('1').moveTo([0.3, 0]).lineTo([0.3, 1]).lineTo([0.1, 0.84])
  g('5').moveTo([0.5, 1]).lineTo([0.1, 1]).lineTo([0.08, 0.56]).cubicTo([0.22, 0.66], [0.54, 0.66], [0.54, 0.32], 4)
    .cubicTo([0.54, 0.0], [0.16, -0.04], [0.04, 0.12], 4)
  g('8').circle([0.28, 0.76], 0.2, 0.22, 10).circle([0.28, 0.27], 0.25, 0.27, 10)
  g('.').moveTo([0.28, 0.04]).lineTo([0.28, 0.22])
  g('B').moveTo([0.08, 0]).lineTo([0.08, 1]).lineTo([0.3, 1]).cubicTo([0.52, 1], [0.52, 0.54], [0.3, 0.54], 4).lineTo([0.08, 0.54])
    .moveTo([0.08, 0.54]).lineTo([0.32, 0.54]).cubicTo([0.58, 0.54], [0.58, 0], [0.32, 0], 4).lineTo([0.08, 0])
  g("'").moveTo([0.3, 1]).lineTo([0.26, 0.74])
  g('W').moveTo([0, 1]).lineTo([0.14, 0]).lineTo([0.28, 0.66]).lineTo([0.42, 0]).lineTo([0.56, 1])
  g('A').moveTo([0.02, 0]).lineTo([0.28, 1]).lineTo([0.54, 0]).moveTo([0.12, 0.34]).lineTo([0.44, 0.34])
  g('Y').moveTo([0.02, 1]).lineTo([0.28, 0.48]).lineTo([0.54, 1]).moveTo([0.28, 0.48]).lineTo([0.28, 0])
}
const TEXT = ['1', '5', '8', '5', '.', 'B', "'", 'W', 'A', 'Y'] // south to north (p4, p8)
const FIN_X0 = -19.6, FIN_STEP = 37.4 / 9
const FIN_T = 0.5, FIN_Y0 = -GAP, FIN_Y1 = -2.6, FIN_Z0 = 3.0, FIN_Z1 = 19.0
const CAP = 2.2, GZ = 3.6, GW = 0.28 // character height, baseline, stroke
for (let i = 0; i < 10; i++) {
  const x = FIN_X0 + i * FIN_STEP, h = FIN_T / 2
  const b: V3[] = [[x - h, FIN_Y1, FIN_Z0], [x + h, FIN_Y1, FIN_Z0], [x + h, FIN_Y0, FIN_Z0], [x - h, FIN_Y0, FIN_Z0]]
  const t = b.map((q) => [q[0], q[1], FIN_Z1] as V3)
  hexa(b, t)
  // the light line up the front edge
  const e = 0.09
  blue.quad([x - h + 0.08, FIN_Y1 - e, FIN_Z0 + 0.3], [x + h - 0.08, FIN_Y1 - e, FIN_Z0 + 0.3], [x + h - 0.08, FIN_Y1 - e, FIN_Z1 - 0.3], [x - h + 0.08, FIN_Y1 - e, FIN_Z1 - 0.3])
  // the character, on both faces, centred in the fin's depth
  const yc = (FIN_Y0 + FIN_Y1) / 2, u0 = 0.28
  const pen = glyph[TEXT[i]]
  const width = TEXT[i] === '.' ? 0.3 : TEXT[i] === "'" ? 0.32 : GW
  // south face (-x): the reader's right is toward the street (-y)
  strokes(amber, pen.paths, { width, depth: 0.08 / CAP, place: (u, v, w) => [x - h - w * CAP, yc - (u - u0) * CAP, GZ + v * CAP] })
  // north face (+x): the reader's right is toward the building (+y)
  strokes(amber, pen.paths, { width, depth: 0.08 / CAP, place: (u, v, w) => [x + h + w * CAP, yc + (u - u0) * CAP, GZ + v * CAP] })
}

// ------------------------------------------------------------ write
const parts = [
  { part: blue, material: finish('neon-ms-blue', 0x3a8ee2) },
  { part: indigo, material: finish('neon-ms-indigo', 0x5a63dd) },
  { part: amber, material: finish('neon-ms-amber', 0xf0b232) },
  { part: frame, material: finish('sign-frame', 0x4a4f57) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
let top = 0, low = Infinity
for (const { part } of parts) for (let i = 1; i < part.pos.length; i += 3) { top = Math.max(top, part.pos[i]); low = Math.min(low, part.pos[i]) }
const glb = writeGlb('Morgan Stanley Tickers', parts, {
  license: 'CC0-1.0', bearing: 286.7, elevation: 0, height: top,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: [],
})
if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/nyc-morgan-stanley-tickers.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${low.toFixed(2)}-${top.toFixed(1)} m`)
