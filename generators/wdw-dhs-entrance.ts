/**
 * Disney's Hollywood Studios park entrance — procedural, CC0-1.0.
 * bun generators/wdw-dhs-entrance.ts
 *
 * Map frame: x along the gate (south-east), y out through its front towards
 * the entrance plaza (north-east), z up, metres. Bearing 45°: the gate's
 * front faces the plaza at 45°. Origin at (-81.5587705, 28.3583562), the
 * middle of the OSM footprint, on the flat plaza.
 *
 * The streamline-moderne gate modelled on the Pan-Pacific Auditorium: a long
 * flat canopy over a row of rounded aqua-and-teal ticket booths, a pale aqua
 * banded parapet along its front, and four finned towers rising behind it —
 * each a rounded pylon wrapped in stacked white fins with an aqua face,
 * capped by a white hood that curls forward, with a flagpole on top. A deeper
 * block behind the middle of the canopy covers the turnstiles, with an open
 * passage through its centre.
 *
 * Evidence:
 *  - OSM, measured: the ticket-booth roof relation/3919136 (outer
 *    way/294876144, the passage way/294876145 as its inner ring) and the four
 *    towers way/786082410, way/786082413, way/786082415, way/786082417 with
 *    their parts way/786082411, way/786082412, way/786082414, way/786082416
 *    (1.5 and 2.5 levels; their 7.4 m spacing and 4.7 m depth are used).
 *  - Photos: the gate head-on, May 2023 (Benoît Prieur, CC0), the towers
 *    from below (HarshLight, CC BY 2.0), the booths at night, 2008 (Micha L.
 *    Rieser, attribution), and the gate from the plaza (Paigeboyd02,
 *    CC BY-SA 4.0; elisfkc, CC BY-SA 2.0, Flickr 31293453350).
 *
 * Estimated: every height, from the 2023 photo scaled on people at the
 * booths — canopy underside 3.5 m, fascia 4.4 m, parapet 5.6 m, tower hoods
 * 12.6 m, flagpoles to 21 m. The towers are drawn 1.8 m wide (OSM says
 * about 1 m; the photos read wider). The fin count (seven) is from the
 * photos. The red "DISNEY'S HOLLYWOOD STUDIOS" letters and the pennants are
 * left off: they do not read at map distance. The brief mentions pale
 * yellow; current (2023) photos show the gate in aqua, teal and white only,
 * so no yellow is used.
 */
import { Part, len, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

// ---------------------------------------------------------------------------
// Kit (shared by the four park-entrance generators; each carries its own copy)

type XY = [number, number]
const TAU = Math.PI * 2
const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) { p.tri(a, b, c, undefined, undefined, undefined, n) }
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}
const area = (q: XY[]) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0) / 2
const ccw = (q: XY[]) => (area(q) < 0 ? [...q].reverse() : q)

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
function earcut(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  const cz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cz(a, b, p) > 1e-9 && cz(b, c, p) > 1e-9 && cz(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cz(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) idx.splice(0, 1)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** The vertical sides of a polygon between two heights, facing out. */
function walls(p: Part, poly: XY[], z0: number, z1: number) {
  poly = ccw(poly)
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue
    quad(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
}
/** A flat cap over a polygon, facing up or down. */
function cap(p: Part, poly: XY[], z: number, up: boolean) {
  poly = ccw(poly)
  for (const [i, j, k] of earcut(poly)) {
    const A: V3 = [...poly[i], z], B: V3 = [...poly[j], z], C: V3 = [...poly[k], z]
    if (up) tri(p, A, B, C); else tri(p, A, C, B)
  }
}
function prism(p: Part, poly: XY[], z0: number, z1: number, o: { top?: boolean; bottom?: boolean } = {}) {
  walls(p, poly, z0, z1)
  if (o.top !== false) cap(p, poly, z1, true)
  if (o.bottom) cap(p, poly, z0, false)
}
/** Offset a polygon inwards by d (outwards for d < 0), mitred. */
function inset(poly: XY[], d: number): XY[] {
  poly = ccw(poly)
  const n = poly.length
  return poly.map((p, i) => {
    const a = poly[(i + n - 1) % n], b = poly[(i + 1) % n]
    const e0 = unit([p[0] - a[0], p[1] - a[1], 0]), e1 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n0: XY = [-e0[1], e0[0]], n1: XY = [-e1[1], e1[0]]
    const m: XY = [n0[0] + n1[0], n0[1] + n1[1]]
    const ml = Math.hypot(m[0], m[1]) || 1
    const cos = (m[0] * n0[0] + m[1] * n0[1]) / ml
    const k = d / Math.max(cos, 0.35)
    return [p[0] + (m[0] / ml) * k, p[1] + (m[1] / ml) * k] as XY
  })
}
/** A rectangle centred at (cx, cy), w along the heading `rot` (radians from +x), d across it. */
function rect(cx: number, cy: number, w: number, d: number, rot = 0): XY[] {
  const c = Math.cos(rot), s = Math.sin(rot)
  return ([[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]] as XY[])
    .map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c] as XY)
}
/** A rectangle with its corners chamfered by c. */
function crect(cx: number, cy: number, w: number, d: number, c: number, rot = 0): XY[] {
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const pts: XY[] = [[-w / 2 + c, -d / 2], [w / 2 - c, -d / 2], [w / 2, -d / 2 + c], [w / 2, d / 2 - c],
    [w / 2 - c, d / 2], [-w / 2 + c, d / 2], [-w / 2, d / 2 - c], [-w / 2, -d / 2 + c]]
  return pts.map(([u, v]) => [cx + u * cs - v * sn, cy + u * sn + v * cs] as XY)
}
/** A smooth-shaded frustum about a vertical axis; r1 = 0 makes a cone. */
function frustum(p: Part, cx: number, cy: number, r0: number, z0: number, r1: number, z1: number,
  n: number, o: { top?: boolean; bottom?: boolean; phase?: number } = {}) {
  const ph = (o.phase ?? 0.5 / n) * TAU
  const k = (r0 - r1) / (z1 - z0)
  const at = (i: number, r: number, z: number): V3 => {
    const t = ph + (i / n) * TAU
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]
  }
  const nrm = (t: number): V3 => unit([Math.cos(t), Math.sin(t), k])
  for (let i = 0; i < n; i++) {
    const j = i + 1, ti = ph + (i / n) * TAU, tj = ph + (j / n) * TAU
    if (r1 <= 0) tri(p, at(i, r0, z0), at(j, r0, z0), [cx, cy, z1], [nrm(ti), nrm(tj), nrm((ti + tj) / 2)])
    else quad(p, at(i, r0, z0), at(j, r0, z0), at(j, r1, z1), at(i, r1, z1), [nrm(ti), nrm(tj), nrm(tj), nrm(ti)])
  }
  if (o.top && r1 > 0) for (let i = 1; i < n - 1; i++) tri(p, at(0, r1, z1), at(i, r1, z1), at(i + 1, r1, z1))
  if (o.bottom) for (let i = 1; i < n - 1; i++) tri(p, at(0, r0, z0), at(i + 1, r0, z0), at(i, r0, z0))
}
/** A square post. */
function post(p: Part, x: number, y: number, w: number, z0: number, z1: number) {
  prism(p, rect(x, y, w, w), z0, z1, { top: false })
}
/** Points every `step` metres along a polyline, inset from its ends by `end`. */
function along(line: XY[], step: number, end = 0.5): XY[] {
  const seg = line.slice(1).map((b, i) => Math.hypot(b[0] - line[i][0], b[1] - line[i][1]))
  const L = seg.reduce((s, l) => s + l, 0)
  const n = Math.max(1, Math.round((L - 2 * end) / step))
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    let s = end + (k * (L - 2 * end)) / n
    for (let i = 0; i < seg.length; i++) {
      if (s <= seg[i] || i === seg.length - 1) {
        const t = Math.min(1, s / seg[i])
        out.push([line[i][0] + (line[i + 1][0] - line[i][0]) * t, line[i][1] + (line[i + 1][1] - line[i][1]) * t])
        break
      }
      s -= seg[i]
    }
  }
  return out
}
/**
 * A flat window or panel on a vertical wall: the wall runs from a to b (seen
 * from outside, a on the left), the panel spans u0..u1 metres along it and
 * z0..z1, standing 0.05 m proud.
 */
function panel(p: Part, a: XY, b: XY, u0: number, u1: number, z0: number, z1: number, off = 0.05) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = uy, ny = -ux // outward for a wall seen from outside with a on the left
  const P = (u: number, z: number): V3 => [a[0] + ux * u + nx * off, a[1] + uy * u + ny * off, z]
  quad(p, P(u0, z0), P(u1, z0), P(u1, z1), P(u0, z1))
}
const shift = (poly: XY[], dx: number, dy: number): XY[] => poly.map(([x, y]) => [x + dx, y + dy] as XY)

async function finishModel(file: string, title: string, parts: Array<{ part: Part; material: any }>, height: number, bearing: number, cap = 5000) {
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > cap) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(title, parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing, elevation: 0, height,
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${file}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}

// ---------------------------------------------------------------------------

const white = new Part()   // fascia, soffit, fins, hoods
const teal = new Part()    // booth bases, tower cores
const aqua = new Part()    // booth uppers, parapet, tower faces
const roof = new Part()
const glazing = new Part() // ticket windows
const pole = new Part()

// OSM rings in the gate's frame, metres from (-81.5585, 28.3585), shifted
// onto the anchor.
const O: XY = [-7.5, -30]
const at = (q: XY[]) => shift(q, -O[0], -O[1])
const CANOPY = at([[24.7, -24.3], [23.2, -26.0], [20.4, -26.9], [4.2, -27.1], [4.4, -40.8], [6.0, -40.9], [7.0, -41.5], [7.8, -42.7], [7.8, -44.3], [7.1, -45.8], [5.9, -46.8], [3.5, -47.2], [-21.0, -46.7], [-22.7, -45.8], [-23.5, -44.5], [-23.6, -43.3], [-22.9, -41.9], [-21.4, -40.9], [-19.9, -40.6], [-19.9, -26.9], [-37.5, -26.9], [-39.1, -26.1], [-40.1, -24.5], [-40.2, -21.9], [-39.2, -20.3], [-37.9, -19.2], [-36.1, -18.8], [21.9, -18.8], [23.9, -20.1], [24.8, -22.1]])
const PASSAGE = at([[-10.8, -40.6], [-10.9, -27.3], [-4.6, -27.2], [-4.6, -40.6]])
const TOWERS_X = [3.7, -3.6, -11.5, -18.8].map((x) => x - O[0])
const FRONT = -18.8 - O[1]          // the canopy's front edge
const SOFFIT = 3.5, FASCIA = 4.4, PARAPET = 5.6

// --- The canopy: white fascia and soffit, grey roof ------------------------
// The passage through the rear block is open to the sky, so the canopy is
// drawn as the outer ring with the passage cut out (two halves).
const xL = PASSAGE[0][0], xR = PASSAGE[2][0]
function clipX(poly: XY[], keepLeftOf: number | null, keepRightOf: number | null): XY[] {
  let out = poly
  const cut = (q: XY[], f: (p: XY) => number) => {
    const r: XY[] = []
    for (let i = 0; i < q.length; i++) {
      const p = q[i], n = q[(i + 1) % q.length], fp = f(p), fn = f(n)
      if (fp >= 0) r.push(p)
      if ((fp >= 0) !== (fn >= 0)) { const t = fp / (fp - fn); r.push([p[0] + (n[0] - p[0]) * t, p[1] + (n[1] - p[1]) * t]) }
    }
    return r
  }
  if (keepLeftOf !== null) out = cut(out, (p) => keepLeftOf - p[0])
  if (keepRightOf !== null) out = cut(out, (p) => p[0] - keepRightOf)
  return out
}
// The rear block is split at the passage; the front bar spans it.
const yBar = -26.9 - O[1]
const pieces: XY[][] = [
  clipX(CANOPY, xL, null),
  clipX(CANOPY, null, xR),
  [[xL, yBar], [xR, yBar], [xR, FRONT], [xL, FRONT]],
]
for (const q of pieces) {
  cap(white, q, SOFFIT, false)
  cap(roof, q, FASCIA, true)
}
// Fascia only on the true outline and the passage's walls.
walls(white, CANOPY, SOFFIT, FASCIA)
// (The passage's own walls face inwards, so its ring runs clockwise.)
for (let i = 0; i < PASSAGE.length; i++) {
  const a = PASSAGE[i], b = PASSAGE[(i + 1) % PASSAGE.length]
  quad(white, [b[0], b[1], SOFFIT], [a[0], a[1], SOFFIT], [a[0], a[1], FASCIA], [b[0], b[1], FASCIA])
}

// --- The booths: rounded aqua kiosks on teal bases, under the front bar ----
/** A plan with bullnosed ends along x. */
function pill(x0: number, x1: number, y0: number, y1: number, r: number): XY[] {
  const pts: XY[] = []
  const n = 4
  for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i / n) * (Math.PI / 2); pts.push([x1 - r + r * Math.cos(a), y0 + r + r * Math.sin(a)]) }
  for (let i = 0; i <= n; i++) { const a = (i / n) * (Math.PI / 2); pts.push([x1 - r + r * Math.cos(a), y1 - r + r * Math.sin(a)]) }
  for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (i / n) * (Math.PI / 2); pts.push([x0 + r + r * Math.cos(a), y1 - r + r * Math.sin(a)]) }
  for (let i = 0; i <= n; i++) { const a = Math.PI + (i / n) * (Math.PI / 2); pts.push([x0 + r + r * Math.cos(a), y0 + r + r * Math.sin(a)]) }
  return pts
}
const by0 = FRONT - 6.6, by1 = FRONT - 1.6
const BOOTHS: [number, number][] = []
for (let x = -39.0 - O[0]; x < 23.5 - O[0]; x += 9.2) {
  const x0 = x, x1 = x + 5.8
  if (x1 > xL - 0.5 && x0 < xR + 0.5) continue // the central passage stays open
  BOOTHS.push([x0, x1])
}
for (const [x0, x1] of BOOTHS) {
  const p = pill(x0, x1, by0, by1, 0.9)
  prism(teal, inset(p, -0.1), 0, 1.1, { top: false })
  prism(aqua, p, 1.1, SOFFIT, { top: false })
  walls(teal, inset(p, -0.06), 2.2, 2.45)
  // Two ticket windows on the front.
  for (const u of [0.9, 3.1]) panel(glazing, [x0, by1], [x1, by1], u, u + 1.8, 1.25, 2.1)
}

// --- The parapet over the front: pale aqua with two white bands ------------
{
  const x0 = -38.6 - O[0], x1 = 23.4 - O[0], y1 = FRONT - 0.9, y0 = FRONT - 2.4
  const P = pill(x0, x1, y0, y1, 0.75)
  prism(aqua, P, FASCIA, PARAPET)
  for (const z of [4.75, 5.15]) walls(white, inset(P, -0.06), z, z + 0.14)
  cap(white, inset(P, -0.06), PARAPET, true)
}

// --- The four finned towers -------------------------------------------------
const BASE = FASCIA, CORE = 11.0, HOOD = 12.6
for (const tx of TOWERS_X) {
  const yF = -20.4 - O[1], yB = -25.1 - O[1], w = 1.8
  const C = pill(tx - w / 2, tx + w / 2, yB, yF, 0.9)
  prism(teal, C, BASE, CORE, { top: false })
  // The aqua face on the rounded front, above the fins and under the hood.
  prism(aqua, pill(tx - 0.8, tx + 0.8, yF - 1.0, yF + 0.08, 0.8), 9.3, CORE + 0.4)
  // Seven white fins round the body.
  for (let k = 0; k < 7; k++) {
    const z = 5.0 + k * 0.66
    prism(white, inset(C, -0.45), z, z + 0.16, { bottom: true })
  }
  // The hood: a white band that rises from the back of the tower, arches
  // over its top and curls down over the front, open at the sides.
  const yM = (yF + yB) / 2 + 0.2, Ry = (yF - yB) / 2 + 0.25, Rz = HOOD - CORE, t = 0.32
  const x0 = tx - w / 2 - 0.12, x1 = tx + w / 2 + 0.12, n = 10
  const P = (a: number, k: number, x: number): V3 => [x, yM - (Ry - k) * Math.cos(a), CORE + (Rz - k) * Math.sin(a)]
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 1.12 - 0.06, a1 = ((i + 1) / n) * Math.PI * 1.12 - 0.06
    quad(white, P(a0, 0, x1), P(a1, 0, x1), P(a1, 0, x0), P(a0, 0, x0))
    quad(white, P(a0, t, x0), P(a1, t, x0), P(a1, t, x1), P(a0, t, x1))
    quad(white, P(a0, 0, x0), P(a1, 0, x0), P(a1, t, x0), P(a0, t, x0))
    quad(white, P(a0, t, x1), P(a1, t, x1), P(a1, 0, x1), P(a0, 0, x1))
  }
  prism(aqua, pill(tx - w / 2 + 0.1, tx + w / 2 - 0.1, yB + 0.1, yF - 0.1, 0.8), CORE, CORE + 0.12)
  // The flagpole, from the top of the hood.
  frustum(pole, tx, yM, 0.09, HOOD - 0.1, 0.05, 21, 6, { top: true })
}

// ---------------------------------------------------------------------------

// Aqua and teal are the gate's identity, kept as finishes at the palette's
// lightness; white is the palette's trim.
await finishModel('wdw-dhs-entrance', "Disney's Hollywood Studios Entrance", [
  { part: white, material: PALETTE.trim },
  { part: teal, material: finish('dhs-gate-teal', 0x5ea8a3) },
  { part: aqua, material: finish('dhs-gate-aqua', 0xa8d9d0) },
  { part: roof, material: PALETTE.roof },
  { part: glazing, material: PALETTE.window },
  { part: pole, material: finish('dhs-flagpole', 0xc9ccd0) },
], 21, 45)
