/**
 * Disney's Animal Kingdom park entrance — procedural, CC0-1.0.
 * bun generators/wdw-ak-entrance.ts
 *
 * Map frame: x along the row of ticket booths (east-north-east), y into the
 * park (north-north-west), z up, metres. Bearing 350°: the booths' row runs
 * at 80°. Origin at (-81.5900755, 28.3552589), between the booths and the
 * turnstiles, on the flat entrance plaza.
 *
 * The entrance plaza's three ticket booths and the turnstile canopy behind
 * them. Each booth is a dark-timber front on a river-rock base, its ticket
 * windows under a dark-timber pergola, with a carved sage-green relief
 * panel along its top; the middle booth's panel carries the elephant head and
 * the gold "Disney's" arch that are the park's sign. Rough rockwork piers
 * close the booths' ends. The turnstiles stand under a long dark-timber
 * pergola roof behind.
 *
 * Evidence:
 *  - OSM, measured: the booths way/295763702, way/295763703, way/295763704
 *    (shop=ticket) and the turnstile structure way/295763710.
 *  - Photos: the middle booth head-on (Sam Howzit, CC BY 2.0, Commons "Main
 *    Entrance (33395862323)"; Jennifer Lynn, CC BY 2.0, "Disney Animal
 *    Kingdom (27766103142)"; Michael Lowin, CC BY-SA 3.0, "AK Eingang"), from
 *    the south-west (Ivan Curra, CC BY-SA 3.0, "-DISNEY'S ANIMAL KINGDOM
 *    ENTRANCE- panoramio"), with the east booth's rockwork (UpstateNYer,
 *    CC BY-SA 3.0, "AnimalKingdomEntrance.JPG"), and the three booths across
 *    the plaza (elisfkc, CC BY-SA 2.0, "Animal Kingdom Front Entrance for the
 *    Holidays (31549495561)").
 *
 * Estimated: heights from the photos against the booth's OSM width — walls
 * 2.8 m, pergola 3.3 m, relief panel to 5.3 m, elephant to 6.1 m, the arch
 * to 7.1 m; the rock piers' size. The turnstile canopy and the booths'
 * side and rear faces are seen in no usable photo (the plaza has no
 * Mapillary coverage); the turnstile roof is drawn in the booths' timber
 * style, which the far photo supports but does not show closely. Thatch:
 * none of the photos shows a thatched roof at the entrance; the roofs are
 * timber pergolas, so no thatch is modelled. Entrance arch: no photo shows
 * an arch over the entrance, so none is modelled; the arched gold
 * "Disney's" crest over the middle booth is the only arch evidenced.
 * The gold "ANIMAL KINGDOM" letters are left off: at 1 m tall they do
 * not read at map distance, and the elephant and arch carry the sign.
 * Readability: the booths are 13 × 6 m and 5 m tall; at z16 they read as
 * three dark-edged blocks with green tops, the middle one crowned.
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

const rock = new Part()    // river-rock walls and rockwork piers
const timber = new Part()  // posts, pergolas, panel frames
const tiles = new Part()   // the roofs inside the pergolas
const relief = new Part()  // the carved sage panels and the elephant
const gold = new Part()    // the "Disney's" arch
const glazing = new Part() // ticket windows

// OSM rings in the entrance's frame, metres from (-81.5901, 28.3552),
// shifted onto the anchor.
const O: XY = [3.5, 6]
const B = (x0: number, x1: number, y0: number, y1: number) => ({ x0: x0 - O[0], x1: x1 - O[0], y0: y0 - O[1], y1: y1 - O[1] })
const BOOTHS = [B(-20.3, -7.4, -9.6, -3.8), B(-2.9, 10.5, -5.5, 0.1), B(14.0, 27.7, -9.8, -4.1)]
const GATE = B(-11.6, 26.3, 17.5, 22.3)

const WALL = 2.8, PERGOLA = 3.3, PANEL = 5.3

/** A dark-timber pergola: a slab with an overhang, on corner posts, and a roof inside. */
function pergola(b: { x0: number; x1: number; y0: number; y1: number }, z: number, over: number, posts: number) {
  const P: XY[] = crect((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, b.x1 - b.x0 + 2 * over, b.y1 - b.y0 + 2 * over, 0.3)
  prism(timber, P, z, z + 0.45, { bottom: true })
  // Rafter tails along the long sides, so the edge reads as beams.
  const n = Math.round((b.x1 - b.x0 + 2 * over) / 1.2)
  for (let k = 0; k <= n; k++) {
    const x = b.x0 - over + 0.2 + (k * (b.x1 - b.x0 + 2 * over - 0.4)) / n
    prism(timber, rect(x, (b.y0 + b.y1) / 2, 0.22, b.y1 - b.y0 + 2 * over + 0.6), z + 0.45, z + 0.7)
  }
  prism(tiles, inset(P, over + 0.2), z + 0.45, z + 0.62)
  for (let k = 0; k < posts; k++) {
    const x = b.x0 + 0.3 + (k * (b.x1 - b.x0 - 0.6)) / (posts - 1)
    for (const y of [b.y0 - over + 0.4, b.y1 + over - 0.4]) post(timber, x, y, 0.4, 0, z)
  }
}
/** A rough rockwork pier: two offset chunks, the upper one smaller. */
function pier(x: number, y: number, w: number, d: number, h: number, seed: number) {
  const j = (k: number) => Math.sin(seed * 12.9898 + k * 78.233) * 0.25
  prism(rock, crect(x, y, w, d, 0.45), 0, h * 0.7 + j(1))
  prism(rock, crect(x + j(2), y + j(3), w * 0.78, d * 0.82, 0.4), h * 0.7 + j(1), h + j(4))
}

BOOTHS.forEach((b, i) => {
  const w = b.x1 - b.x0
  // The booth: river-rock walls, three ticket windows on the plaza face.
  const body = rect((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, w, b.y1 - b.y0)
  prism(rock, inset(body, -0.12), 0, 0.95, { top: false })
  prism(timber, body, 0.95, WALL, { top: false })
  for (let k = 0; k < 3; k++) {
    const u = 0.9 + k * ((w - 1.8) / 3)
    panel(glazing, [b.x0, b.y0], [b.x1, b.y0], u + 0.3, u + (w - 1.8) / 3 - 0.3, 1.15, 2.6)
  }
  pergola(b, WALL, 1.3, 4)
  // The carved relief panel along the front, in a dark frame.
  const yP = b.y0 + 0.4
  prism(timber, rect((b.x0 + b.x1) / 2, yP, w + 0.4, 0.5), PERGOLA + 0.3, PERGOLA + 0.45)
  prism(relief, rect((b.x0 + b.x1) / 2, yP, w, 0.4), PERGOLA + 0.45, PANEL)
  prism(timber, rect((b.x0 + b.x1) / 2, yP, w + 0.4, 0.5), PANEL, PANEL + 0.12)
  for (const x of [b.x0 - 0.1, b.x1 + 0.1]) prism(timber, rect(x, yP, 0.2, 0.5), PERGOLA + 0.45, PANEL)
  // Rockwork piers at the outer ends.
  pier(b.x0 - 1.6, (b.y0 + b.y1) / 2 + 0.6, 2.2, 4.2, 4.3, i * 2 + 1)
  pier(b.x1 + 1.6, (b.y0 + b.y1) / 2 + 0.6, 2.2, 4.2, 4.3, i * 2 + 2)
})

// --- The elephant and the gold arch over the middle booth ---------------------
{
  const b = BOOTHS[1], cx = (b.x0 + b.x1) / 2, y = b.y0 + 0.1, zc = 4.9
  // Head: a squat rounded mass standing proud of the panel.
  frustum(relief, cx, y + 0.2, 0.8, zc - 0.8, 1.25, zc + 0.2, 10, { bottom: true })
  frustum(relief, cx, y + 0.2, 1.25, zc + 0.2, 0.7, zc + 1.15, 10, { top: true })
  // Ears: broad flat discs either side.
  for (const s of [-1, 1]) {
    const ex = cx + s * 1.6, n = 10, R = 1.05
    const ring = Array.from({ length: n }, (_, k) => [ex + R * 1.1 * Math.cos((k / n) * TAU), zc + 0.25 + R * Math.sin((k / n) * TAU)] as XY)
    for (let k = 0; k < n; k++) {
      const a = ring[k], c = ring[(k + 1) % n]
      quad(relief, [a[0], y - 0.05, a[1]], [c[0], y - 0.05, c[1]], [c[0], y + 0.25, c[1]], [a[0], y + 0.25, a[1]])
      tri(relief, [ex, y - 0.05, zc + 0.25], [a[0], y - 0.05, a[1]], [c[0], y - 0.05, c[1]])
    }
  }
  // Trunk: a tapering column hanging down the panel's face.
  frustum(relief, cx, y - 0.25, 0.34, zc - 2.0, 0.5, zc - 0.5, 8, { bottom: true })
  // The "Disney's" arch: a gold half-ring standing behind the head.
  const R = 2.0, r = 1.72, n = 12, yA = y + 0.55, t = 0.14
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * Math.PI, a1 = ((k + 1) / n) * Math.PI
    const P = (a: number, rr: number, yy: number): V3 => [cx + rr * Math.cos(a), yy, zc + 0.15 + rr * Math.sin(a)]
    quad(gold, P(a1, r, yA - t), P(a1, R, yA - t), P(a0, R, yA - t), P(a0, r, yA - t))
    quad(gold, P(a0, r, yA + t), P(a0, R, yA + t), P(a1, R, yA + t), P(a1, r, yA + t))
    quad(gold, P(a0, R, yA - t), P(a1, R, yA - t), P(a1, R, yA + t), P(a0, R, yA + t))
  }
}

// --- The turnstile canopy ------------------------------------------------------
pergola(GATE, 3.6, 0.8, 7)
pier(GATE.x0 - 1.4, (GATE.y0 + GATE.y1) / 2, 2.4, 5.6, 4.6, 9)
pier(GATE.x1 + 1.4, (GATE.y0 + GATE.y1) / 2, 2.4, 5.6, 4.6, 10)

// ---------------------------------------------------------------------------

// The entrance's own colours from the photos, muted: tan rockwork, dark
// timber (a defining dark, kept above charcoal), the carved panels' sage, the
// sign's gold and the roofs' red-brown seen across the plaza.
await finishModel('wdw-ak-entrance', "Disney's Animal Kingdom Entrance", [
  { part: rock, material: finish('ak-rockwork', 0xc2ad92) },
  { part: timber, material: finish('ak-timber', 0x6e5646) },
  { part: tiles, material: finish('ak-roof', 0xa5735e) },
  { part: relief, material: finish('ak-relief', 0x9fae94) },
  { part: gold, material: finish('ak-gold', 0xcfa94e) },
  { part: glazing, material: PALETTE.window },
], 7.1, 350)
