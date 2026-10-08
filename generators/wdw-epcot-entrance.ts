/**
 * EPCOT main entrance (Walt Disney World) — procedural, CC0-1.0.
 * bun generators/wdw-epcot-entrance.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0. Origin at
 * (-81.5494, 28.3758835), the middle of the entrance plaza between the
 * turnstiles and Spaceship Earth, on the flat ground.
 *
 * The 1982 entrance as it stands since the 2019–2021 rebuild of the plaza:
 * the two crescent ticket-booth canopies facing the parking lot, linked by
 * small roofs to the long crescent turnstile canopy, and inside it the
 * white colonnaded walkways that wrap the entry plaza down both sides to
 * Spaceship Earth. All of it is flat white-edged roof on white columns, the
 * ticket canopies with their ochre soffits. In the middle of the plaza stands
 * the 2021 entrance fountain: a dark faceted basin with three tall clear
 * pylons carrying the original EPCOT Center logo.
 *
 * Leave a Legacy: the granite monoliths that stood in the plaza (2000–2019)
 * are gone. OSM maps the plaza's 2021 garden beds and no monoliths, and the
 * 2021 photo (Jedi94) and the 2021–2023 fountain photos show the plaza open
 * to the sphere. They are not modelled.
 *
 * International Gateway: left out. It is a separate entrance 1 km away
 * between France and the UK, a cluster of low green barrel-vaulted
 * turnstile awnings beside the Skyliner station (photo: Jedi94, CC BY-SA
 * 4.0). At 4 m tall it would read at z16 as a green smear, and it would need
 * its own placement.
 *
 * Evidence:
 *  - OSM, measured: the turnstile canopy way/295176249 (roof), the ticket
 *    booths way/295174214 and way/295174215, the connecting roofs
 *    way/295176514 and way/295176518, the plaza walkways way/295174216 and
 *    way/689241903, the fountain way/114503911 (water, so only its basin
 *    and pylons are modelled; it is not in `replaces`).
 *  - Photos: the plaza and sphere, 2021 (Jedi94, CC BY-SA 4.0, Commons
 *    "Spaceship Earth and entry plaza 2021"); the turnstile canopy head-on,
 *    2010 (fdenardo1, CC BY 2.0, Flickr 4532175905); a ticket booth with its
 *    soffit and columns (Michael Rivera, CC BY-SA 4.0, Commons "Epcot ticket
 *    booth"); the walkway roofs from the monorail, 2015 (Mapillary
 *    164948838767269 and 332905721538604, riordan, CC BY-SA 4.0); the
 *    fountain pylons (milst1, CC BY 2.0, Flickr 51687509747; Sam Howzit,
 *    CC BY 2.0, Flickr 52289546765; noah brenn, CC BY-SA 2.0, Flickr
 *    52870251426).
 *
 * Estimated: all heights (OSM has none): canopy fascias at 5.2 m (ticket
 * booths), 5.6 m (turnstiles) and 4.6 m (walkways), from people in the
 * photos; the pylons at 6.6 and 5.4 m and the basin from the fountain photos;
 * column spacing. The walkways are drawn as open colonnades; their shops are
 * not modelled. Readability: everything but the pylons is 5 m tall and the
 * pylons are thin, so at z16 this reads as a white crescent ring opening
 * towards the sphere.
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

const white = new Part()   // fascias, columns, booth fronts
const roof = new Part()
const soffit = new Part()  // the ticket canopies' ochre undersides
const glass = new Part()   // the fountain pylons
const bronze = new Part()  // the fountain basin
const glazing = new Part() // ticket windows

// OSM rings in metres from (-81.5494, 28.3762), shifted onto the anchor.
const O: XY = [0, -35]
const at = (q: XY[]) => shift(q, -O[0], -O[1])

const TURNSTILES = at([[59.1, -19.6], [59.0, -18.4], [58.2, -17.5], [44.6, -11.1], [33.7, -7.2], [29.1, -6.0], [25.2, -5.0], [19.8, -4.0], [13.2, -3.0], [2.4, -2.4], [-6.2, -2.6], [-16.6, -3.7], [-24.1, -5.1], [-29.3, -6.0], [-31.3, -6.7], [-42.2, -10.4], [-50.7, -14.0], [-57.8, -17.6], [-58.6, -18.4], [-58.7, -19.4], [-61.9, -14.4], [-64.4, -9.7], [-63.0, -10.0], [-59.1, -7.8], [-53.2, -4.7], [-43.4, -0.8], [-34.6, 2.1], [-28.1, 3.7], [-19.7, 5.3], [-11.7, 6.3], [-2.7, 6.9], [5.2, 6.8], [12.3, 6.3], [17.2, 5.8], [26.5, 4.2], [35.0, 2.0], [40.3, 0.5], [48.6, -2.5], [56.4, -5.9], [63.3, -9.6], [64.4, -9.9], [64.8, -9.6], [62.5, -14.4]])
const BOOTHS_W = at([[-12.5, 32.2], [-12.3, 15.9], [-12.4, 15.0], [-13.4, 14.6], [-24.4, 13.7], [-30.3, 12.9], [-37.6, 11.7], [-48.2, 9.6], [-60.5, 6.5], [-64.5, 5.4], [-65.5, 5.5], [-66.0, 6.3], [-70.2, 20.3], [-69.9, 21.2], [-69.0, 21.7], [-55.8, 25.2], [-47.2, 27.1], [-33.5, 29.3], [-29.3, 29.9], [-28.6, 30.6], [-28.4, 32.3], [-21.8, 32.3]])
const BOOTHS_E = at([[70.5, 20.2], [66.3, 6.5], [65.6, 5.7], [64.7, 5.7], [49.2, 9.7], [37.8, 12.0], [30.7, 13.2], [22.8, 13.9], [14.0, 14.7], [13.1, 15.0], [12.8, 15.7], [12.9, 30.3], [13.3, 31.1], [14.3, 31.3], [27.0, 30.3], [38.7, 28.6], [49.3, 26.7], [59.0, 24.5], [69.6, 21.7], [70.4, 21.0]])
const LINK_W = at([[-37.6, 11.7], [-35.9, 6.1], [-34.6, 2.1], [-32.3, 2.8], [-28.1, 3.7], [-29.1, 8.1], [-30.3, 12.9]])
const LINK_E = at([[30.7, 13.2], [29.7, 8.9], [28.5, 3.6], [31.7, 2.8], [35.0, 2.0], [35.6, 4.3], [36.5, 7.4], [37.8, 12.0]])
const WALK_W = at([[-90.8, 12.7], [-91.7, 11.7], [-93.2, 6.3], [-95.6, -2.6], [-96.5, -6.6], [-96.2, -7.1], [-82.5, -30.4], [-79.1, -28.6], [-72.2, -40.5], [-58.2, -44.2], [-55.9, -36.4], [-64.4, -21.7], [-63.0, -21.9], [-54.8, -35.9], [-46.9, -49.3], [-49.5, -58.1], [-46.3, -63.5], [-47.5, -67.3], [-41.0, -73.4], [-37.7, -76.8], [-45.2, -87.5], [-51.5, -96.6], [-55.2, -102.1], [-55.1, -102.8], [-49.0, -109.8], [-47.6, -110.3], [-40.3, -109.0], [-39.6, -108.6], [-34.6, -101.6], [-33.1, -99.4], [-30.8, -100.8], [-29.9, -100.8], [-26.2, -98.7], [-26.0, -97.4], [-27.9, -96.1], [-27.5, -95.5], [-19.3, -99.7], [-10.4, -83.6], [-21.8, -77.2], [-27.2, -74.2], [-31.0, -75.1], [-28.9, -71.7], [-18.1, -78.3], [-15.2, -79.5], [-14.4, -78.4], [-14.7, -74.3], [-15.1, -73.8], [-20.4, -70.9], [-27.2, -66.7], [-33.2, -61.4], [-36.0, -57.8], [-38.7, -53.7], [-58.7, -19.4], [-61.9, -14.4], [-64.4, -9.7], [-75.0, 8.4], [-75.5, 8.9]])
const WALK_E = at([[29.8, -100.5], [30.9, -100.9], [31.8, -100.5], [34.0, -99.3], [40.2, -108.2], [41.3, -109.0], [48.8, -110.2], [49.8, -109.7], [55.1, -103.4], [55.6, -101.7], [55.3, -100.6], [51.2, -94.8], [44.3, -85.0], [47.2, -82.2], [54.7, -74.8], [52.1, -65.5], [48.1, -50.8], [43.7, -58.3], [44.8, -62.2], [41.2, -59.8], [46.9, -50.2], [63.4, -22.0], [64.8, -21.8], [56.3, -36.4], [60.8, -53.2], [65.6, -52.0], [81.6, -24.3], [95.3, -0.5], [94.1, 5.4], [92.4, 12.2], [91.3, 13.5], [90.4, 13.4], [76.2, 9.6], [75.4, 9.0], [64.8, -9.6], [62.5, -14.4], [59.1, -19.6], [45.1, -43.4], [39.8, -52.8], [37.3, -56.7], [34.2, -61.1], [30.3, -64.7], [27.4, -67.1], [22.0, -70.2], [15.3, -74.0], [15.1, -78.5], [16.3, -79.5], [20.8, -76.9], [29.5, -71.8], [31.8, -75.1], [27.9, -74.2], [12.9, -82.5], [15.2, -86.4], [17.0, -85.4], [21.6, -93.4], [19.8, -94.6], [22.3, -98.7], [28.0, -95.4], [28.5, -96.3], [26.8, -97.4], [26.7, -98.4]])
const FOUNTAIN: XY = [0.4 - O[0], -60.1 - O[1]]

/** A flat roof: white fascia band, a soffit underneath, grey top. */
function canopy(poly: XY[], z0: number, z1: number, under: Part) {
  walls(white, poly, z0, z1)
  cap(under, poly, z0, false)
  cap(roof, poly, z1, true)
  // A raised white coping round the edge, so the outline reads white from
  // above as it does in the monorail views.
  const o = ccw(poly), i = inset(o, 0.7)
  for (let k = 0; k < o.length; k++) {
    const j = (k + 1) % o.length
    quad(white, [...o[k], z1 + 0.25] as V3, [...o[j], z1 + 0.25] as V3, [...i[j], z1 + 0.25] as V3, [...i[k], z1 + 0.25] as V3)
    quad(white, [...i[k], z1 + 0.25] as V3, [...i[j], z1 + 0.25] as V3, [...i[j], z1] as V3, [...i[k], z1] as V3)
  }
  walls(white, poly, z1, z1 + 0.25)
}
/** White columns on a grid, kept to those well inside the roof. */
function columns(poly: XY[], step: number, z: number, w = 0.5) {
  const P = ccw(poly), xs = P.map((p) => p[0]), ys = P.map((p) => p[1])
  const inside = (x: number, y: number) => {
    let c = false
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i], [xj, yj] = P[j]
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
    }
    return c
  }
  const deep = (x: number, y: number) => inside(x, y) && [[1.6, 0], [-1.6, 0], [0, 1.6], [0, -1.6]].every(([dx, dy]) => inside(x + dx, y + dy))
  for (let x = Math.min(...xs) + step / 2; x < Math.max(...xs); x += step)
    for (let y = Math.min(...ys) + step / 2; y < Math.max(...ys); y += step)
      if (deep(x, y)) frustum(white, x, y, w * 0.5, 0, w * 0.75, z, 8)
}

// --- Ticket booths: crescent canopies with booths along the parking side ---
for (const poly of [BOOTHS_W, BOOTHS_E]) {
  canopy(poly, 4.3, 5.2, soffit)
  columns(poly, 9, 4.3, 0.7)
}
// The booths themselves: white kiosks with dark ticket windows, a row under
// each canopy's outer (north) side.
for (const s of [-1, 1]) {
  for (let k = 0; k < 4; k++) {
    const x = s * (20 + k * 11), y = 24.5 - Math.pow(Math.abs(x) / 72, 2) * 14 - O[1]
    const rot = -s * Math.atan((2 * 14 * Math.abs(x)) / (72 * 72))
    const b = crect(x, y, 6.5, 3.0, 0.6, rot)
    prism(white, b, 0, 4.3, { top: false })
    // Two windows on the north face (b[5] → b[4] seen from the north).
    panel(glazing, b[5], b[4], 0.6, 2.4, 1.0, 2.4)
    panel(glazing, b[5], b[4], 2.9, 4.7, 1.0, 2.4)
  }
}
for (const poly of [LINK_W, LINK_E]) canopy(poly, 4.3, 5.2, white)

// --- The turnstile crescent ------------------------------------------------
canopy(TURNSTILES, 4.4, 5.6, white)
columns(TURNSTILES, 7, 4.4, 0.6)

// --- The walkways round the plaza ------------------------------------------
for (const poly of [WALK_W, WALK_E]) {
  canopy(poly, 3.8, 4.6, white)
  columns(poly, 8, 3.8, 0.55)
}

// --- The 2021 fountain -------------------------------------------------------
{
  const [fx, fy] = FOUNTAIN, R = 7.0, n = 16
  // The basin wall, and the faceted dome rising from it towards the pylons.
  frustum(bronze, fx, fy, R, 0, R, 0.7, n, { top: false })
  frustum(bronze, fx, fy, R - 0.4, 0.7, R - 0.4, 0.5, n, { top: false })
  frustum(bronze, fx, fy, R - 0.4, 0.5, 2.0, 1.5, n)
  frustum(bronze, fx, fy, 2.0, 1.5, 1.7, 1.9, n, { top: true })
  // Three clear pylons in a row across the axis, the middle one tallest,
  // each a tapering slab with a sloped top.
  for (const [dx, h] of [[-1.4, 5.4], [0, 6.6], [1.4, 5.4]] as [number, number][]) {
    const x = fx + dx, w0 = 1.1, w1 = 0.8, d = 0.7
    const lo: V3[] = [[x - w0 / 2, fy - d / 2, 1.9], [x + w0 / 2, fy - d / 2, 1.9], [x + w0 / 2, fy + d / 2, 1.9], [x - w0 / 2, fy + d / 2, 1.9]]
    const tilt = dx === 0 ? 0 : (dx > 0 ? 0.5 : -0.5)
    const hi: V3[] = [[x - w1 / 2, fy - d / 2, h - tilt], [x + w1 / 2, fy - d / 2, h + tilt], [x + w1 / 2, fy + d / 2, h + tilt], [x - w1 / 2, fy + d / 2, h - tilt]]
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; quad(glass, lo[i], lo[j], hi[j], hi[i]) }
    quad(glass, hi[0], hi[1], hi[2], hi[3])
  }
}

// ---------------------------------------------------------------------------

// White and the palette's roof grey are the entrance's own colours. The
// ticket canopies' ochre soffits and the fountain's dark bronze facets are
// finishes from the photos; the pylons are clear acrylic, drawn as glass.
await finishModel('wdw-epcot-entrance', 'EPCOT Entrance', [
  { part: white, material: PALETTE.trim },
  { part: roof, material: finish('epcot-canopy-roof', 0xc2c6c8) },
  { part: soffit, material: finish('epcot-soffit', 0xd8b878) },
  { part: glass, material: PALETTE.glass },
  { part: bronze, material: finish('epcot-fountain-bronze', 0x857a6e) },
  { part: glazing, material: PALETTE.window },
], 7.0, 0)
