/**
 * Magic Kingdom park entrance (Walt Disney World) — procedural, CC0-1.0.
 * bun generators/wdw-mk-entrance.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0. Origin at
 * (-81.5812, 28.416234), the middle of the turnstile line in front of Main
 * Street station, on the plaza (which is flat).
 *
 * The turnstile and ticket area between the ferry/monorail plaza and the
 * railway berm: two long, low, flat canopies over the turnstile rows, west
 * and east of the central flower bed, each curving back towards the berm at
 * its outer end; a ticket booth under each canopy's inner half, crowned by a
 * white Victorian pediment that stands above the roof; two small canopies at
 * the mouths of the tunnels under the station; and the white entrance
 * buildings closing the plaza's west and east corners (lockers, Guest
 * Relations). The canopies are white-topped with deep dark-green fascias on
 * green posts — Main Street's Victorian green.
 *
 * The Mickey floral display in the middle is flowers on the ground, so it is
 * the map's, not the model's. The station itself is wdw-main-street-station.
 *
 * Evidence:
 *  - OSM, measured: the canopies way/296122624 and way/296122627 (roof, 4 m),
 *    the tunnel-mouth roofs way/621686707 and way/621686708 (4 m), the west
 *    building way/296122623 with parts way/1107878395 (4 m) and
 *    way/1107878396 (5 m), the east building relation/9287955 with parts
 *    way/1107878397–400 (4–6 m), and barrier=toll_booth nodes at the two
 *    booths (node/9984457120, node/9984457121).
 *  - Photos: the plaza from the ferry's upper deck, 2015 (Mapillary
 *    218899782907088, riordan, CC BY-SA 4.0), the same from the monorail
 *    beam, 2025 (Mapillary 1530049898401850, Lanka6359, CC BY-SA 4.0), along
 *    the east canopy from the east, 2025 (Mapillary 1409526190133373,
 *    Lanka6359), the west end from the south-west, 2025 (Mapillary
 *    1470556090732845, Lanka6359), the plaza from the monorail station
 *    (Raman Patel, CC BY 3.0, Commons "Magic Kingdom, Disney World -
 *    panoramio (4)") and the turnstiles close up (Raman Patel, CC BY 3.0,
 *    "… panoramio (2)").
 *
 * Estimated: the canopy underside (3.3 m) and fascia depth from the
 * photos against people; the pediments' size and shape (two 2015/2025
 * distant views only); the post spacing. The entrance buildings' walls
 * are plain: no photo shows their plaza faces clearly, so their doors and
 * windows are left out rather than guessed. Readability: the canopies are
 * 4 m tall and only 4–7 m deep, so at z16 the entrance reads as two thin
 * white crescents with the two pediments and the corner buildings; the
 * posts and booth windows are below what reads and are kept only so the
 * roofs do not float in close views.
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

const white = new Part()   // canopy soffits, pediments, building walls
const green = new Part()   // fascias, posts, cornices
const roof = new Part()    // canopy and building roofs
const glazing = new Part() // booth windows

// OSM rings in metres from (-81.5812, 28.4158), shifted onto the anchor.
const O: XY = [0, 48]
const at = (q: XY[]) => shift(q, -O[0], -O[1])

const CANOPY_W = at([[-45.8, 43.5], [-41.1, 38.9], [-34.2, 36.1], [-25.3, 36.1], [-25.3, 33.1], [-15.2, 33.1], [-15.2, 36.2], [-7.1, 36.2], [-7.1, 40.4], [-33.6, 40.4], [-38.8, 42.6], [-42.3, 46.1]])
const CANOPY_E = at([[46.1, 43.4], [41.9, 39.2], [34.7, 36.2], [26.0, 36.2], [26.0, 33.2], [15.9, 33.2], [15.9, 36.2], [7.7, 36.2], [7.7, 40.3], [34.2, 40.5], [39.4, 42.6], [43.1, 46.2]])
const TUNNEL_E = at([[22.1, 59.3], [29.6, 59.4], [29.6, 60.1], [31.0, 60.2], [31.0, 62.7], [22.1, 62.5]])
const TUNNEL_W = at([[-22.1, 58.7], [-22.1, 62.6], [-30.3, 62.5], [-30.3, 58.6]])
const WEST = at([[-30.3, 62.5], [-30.3, 59.1], [-33.1, 58.9], [-39.1, 53.3], [-39.2, 49.3], [-42.3, 46.1], [-45.8, 43.5], [-52.5, 43.4], [-56.1, 47.2], [-59.9, 47.1], [-60.3, 62.5]])
const WEST_TALL = at([[-55.0, 60.9], [-51.2, 60.9], [-51.1, 48.7], [-54.9, 48.7]])
const EAST_LOW = at([[31.0, 62.7], [31.0, 59.5], [35.6, 59.6], [39.9, 55.3], [39.8, 49.5], [43.1, 46.2], [50.2, 39.1], [60.7, 39.2], [60.6, 42.6], [52.1, 42.7], [52.4, 62.0], [43.4, 62.1], [43.3, 62.8]])
const EAST_HIGH = at([[52.4, 62.0], [57.6, 62.0], [61.3, 57.2], [65.6, 57.3], [65.5, 49.6], [70.4, 49.6], [70.4, 40.4], [63.0, 40.1], [63.0, 39.2], [60.7, 39.2], [60.6, 42.6], [52.1, 42.7]])
const EAST_BOXES = [at([[57.6, 47.1], [61.6, 47.1], [61.6, 44.5], [57.6, 44.5]]), at([[54.1, 56.2], [55.9, 56.2], [55.9, 52.0], [54.1, 52.0]])]

const SOFFIT = 3.3, FASCIA = 4.1

/** A flat canopy: dark-green fascia round the edge, white soffit, pale roof. */
function canopy(poly: XY[], z0: number, z1: number) {
  walls(green, poly, z0, z1)
  cap(white, poly, z0, false)
  cap(roof, inset(poly, 0.25), z1 - 0.12, true)
  // A thin raised rim, so the fascia reads as a band from above as well.
  const rim = ccw(poly), inner = inset(rim, 0.25)
  for (let i = 0; i < rim.length; i++) {
    const j = (i + 1) % rim.length
    quad(green, [...rim[i], z1] as V3, [...rim[j], z1] as V3, [...inner[j], z1] as V3, [...inner[i], z1] as V3)
    quad(green, [...inner[i], z1] as V3, [...inner[j], z1] as V3, [...inner[j], z1 - 0.12] as V3, [...inner[i], z1 - 0.12] as V3)
  }
}

// --- The two turnstile canopies, with their booths and pediments ---------
for (const [poly, s] of [[CANOPY_W, -1], [CANOPY_E, 1]] as [XY[], number][]) {
  canopy(poly, SOFFIT, FASCIA)
  // Posts in two rows under the straight run, and out along the curve.
  const y0 = 36.6 - O[1], y1 = 39.9 - O[1]
  for (const y of [y0, y1]) for (const [x] of along([[s * 8.0, y], [s * 33.5, y]], 5.2, 0.2)) post(green, x, y, 0.28, 0, SOFFIT)
  for (const [x, y] of along(at([[s * 36.5, 38.9], [s * 41.5, 41.5], [s * 43.6, 44.2]]), 3.4, 0.3)) post(green, x, y, 0.28, 0, SOFFIT)

  // The ticket booth under the bulge on the canopy's plaza side.
  const bx0 = s < 0 ? -24.9 : 16.3, bx1 = s < 0 ? -15.6 : 25.6
  const booth: XY[] = at([[bx0, 33.5], [bx1, 33.5], [bx1, 37.2], [bx0, 37.2]])
  prism(white, booth, 0, SOFFIT, { top: false })
  for (let k = 0; k < 3; k++) {
    const u = 0.8 + k * 2.9
    panel(glazing, booth[0], booth[1], u, u + 2.1, 1.0, 2.6)
  }
  // The pediment: a white panel with a raised centre, standing on the
  // canopy's front edge over the booth.
  const cx = (bx0 + bx1) / 2, fy = 33.6 - O[1]
  prism(white, crect(cx, fy + 0.6, 7.4, 1.0, 0.25), FASCIA - 0.1, FASCIA + 1.5)
  prism(white, crect(cx, fy + 0.6, 3.2, 1.0, 0.25), FASCIA + 1.5, FASCIA + 2.2)
  prism(green, crect(cx, fy + 0.6, 7.7, 1.2, 0.3), FASCIA + 1.5, FASCIA + 1.68)
}

const quadR = (p: Part, a: V3, b: V3, c: V3, d: V3) => quad(p, d, c, b, a)

/**
 * A white semicircular arched crest, a flat band 0.35 m thick standing on a
 * roof edge, open underneath, with a small finial.
 */
function arch(cx: number, y: number, w: number, z: number) {
  const R = w / 2, r = R - 0.45, n = 10, t = 0.35
  const P = (a: number, rr: number, yy: number): V3 => [cx + rr * Math.cos(a), yy, z + 0.3 + rr * Math.sin(a)]
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * (1 - i / n), a1 = Math.PI * (1 - (i + 1) / n)
    quadR(white, P(a0, r, y - t / 2), P(a0, R, y - t / 2), P(a1, R, y - t / 2), P(a1, r, y - t / 2))
    quadR(white, P(a1, r, y + t / 2), P(a1, R, y + t / 2), P(a0, R, y + t / 2), P(a0, r, y + t / 2))
    quadR(white, P(a0, R, y - t / 2), P(a0, R, y + t / 2), P(a1, R, y + t / 2), P(a1, R, y - t / 2))
    quadR(white, P(a1, r, y - t / 2), P(a1, r, y + t / 2), P(a0, r, y + t / 2), P(a0, r, y - t / 2))
  }
  prism(white, rect(cx, y, w, t), z, z + 0.3)
  frustum(white, cx, y, 0.18, z + 0.3 + R, 0.0, z + 0.3 + R + 0.9, 6)
}

// --- The tunnel-mouth canopies against the berm ---------------------------
for (const poly of [TUNNEL_W, TUNNEL_E]) {
  canopy(poly, SOFFIT, FASCIA)
  const c = ccw(poly), ys = Math.min(...c.map((p) => p[1]))
  const xs = c.map((p) => p[0]), x0 = Math.min(...xs) + 0.4, x1 = Math.max(...xs) - 0.4
  for (const x of [x0, (x0 + x1) / 2, x1]) post(green, x, ys + 0.4, 0.28, 0, SOFFIT)
  // Three white arched crests along the plaza edge.
  const w = (x1 - x0) / 3
  for (let k = 0; k < 3; k++) arch(x0 + w * (k + 0.5), ys + 0.5, w * 0.92, FASCIA)
}

// --- The entrance buildings at the plaza's corners --------------------------
/** A white block with a green cornice and a pale flat roof. */
function block(poly: XY[], h: number) {
  walls(white, poly, 0, h - 0.45)
  walls(green, inset(poly, -0.12), h - 0.45, h)
  cap(green, inset(poly, -0.12), h, true)
  cap(roof, inset(poly, 0.4), h + 0.02, true)
  walls(green, inset(poly, -0.12), 0, 0.5)
}
block(WEST, 4.0)
block(WEST_TALL, 5.4)
block(EAST_LOW, 4.0)
block(EAST_HIGH, 5.0)
for (const b of EAST_BOXES) prism(roof, b, 5.0, 6.0)

// ---------------------------------------------------------------------------

// White and the palette's roof grey are the canopies' own colours; the
// fascias and posts are Main Street's dark Victorian green, kept as a finish
// because it is what marks these as Magic Kingdom's gates, and lifted from
// the real near-black green so it sits with the palette.
await finishModel('wdw-mk-entrance', 'Magic Kingdom Entrance', [
  { part: white, material: PALETTE.trim },
  { part: green, material: finish('mk-gate-green', 0x4f7560) },
  { part: roof, material: finish('mk-canopy-roof', 0xd7d9d6) },
  { part: glazing, material: PALETTE.window },
], FASCIA + 5.6, 0)
