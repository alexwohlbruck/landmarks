/**
 * Pasadena City Hall (1927, John Bakewell Jr. and Arthur Brown Jr.),
 * Pasadena — procedural, CC0-1.0.
 * bun generators/la-pasadena-city-hall.ts
 *
 * Map frame: x east, y north, z up, metres; placed at bearing 0, since the
 * building is square to the compass. The anchor is the area centroid of OSM
 * way/37741479, on the lowest ground under the footprint (260.3 m, the north
 * and south walks; the west front stands on 263 m and the raised courtyard
 * on 264 m, LA County lidar).
 *
 * What makes it Pasadena City Hall: the domed tower over the main entrance
 * in the middle of the WEST front (on the Garfield Avenue plaza; the brief
 * said east, but the orthophoto, the lidar and HABS's "West elevation
 * (main)" all put it on the west), stacked as an entrance pavilion with a
 * great arch, a square belfry stage with a big open arch on each face, a
 * round drum ringed with arched windows, a red tile dome and a green copper
 * lantern; the long cream wings of four storeys under red tile hipped roofs
 * round a courtyard open to the east, closed by a low arcade; the four small
 * domed cupolas at the courtyard's corners.
 *
 * Sources:
 * - Plan: OSM way/37741479 (the U of wings) and way/1106661997 (the east
 *   arcade); USGS NAIP orthophoto for the roofs, the courtyard galleries and
 *   the four cupolas (at x -7 and 28, y +-35).
 * - Heights: LA County 2020 lidar surface model, a 2 m grid over the whole
 *   building and a 1 m grid over the tower, in this frame: wing eaves 18.7 m
 *   and ridges 21 m, courtyard galleries 14.7 m, east arcade 10.5 m, the
 *   entrance pavilion 21.5 m, the belfry stage's corners 36-40 m (39.5 m
 *   used, which the HABS elevation's proportions also give) and 20-21 m
 *   square centred at x -20.5, the drum's balustrade 46-48 m, the dome
 *   springing about 50 m and 14-15 m across at the lidar's plateau (15.8 m
 *   used: the photos show it a little wider than the drum's top), lantern
 *   61 m, finial 64.7 m. Published: the tower
 *   is 206 ft (62.8 m) above the front steps (Wikipedia), which the lidar
 *   matches (front ground 2.7 m above the anchor's).
 * - Photos (front, west): HABS CAL,19-PASA,2-1 and 2-2 (West elevation,
 *   public domain), "Pasadena City Hall Day" (RBerteig, CC BY 2.0),
 *   "Pasadena City Hall David Wakely" (CC BY-SA 2.5), "Pasadena City Hall
 *   2013" (Mike Peel, CC BY-SA 4.0; the tower from the south-west). East
 *   and courtyard: HABS 2-5 and 2-7 (public domain), Carol M. Highsmith
 *   LCCN2013633110 (public domain; the east arcade). The wings: Ken Lund's
 *   2014 series (CC BY-SA 2.0).
 * - Estimated: the belfry's and drum's openings and their sizes (from the
 *   photos, scaled by the lidar heights), the cupolas' stages, the window
 *   bays (5.2 m, two panels a bay, each over two storeys), the obelisks'
 *   height.
 * - Left out: the sculpture over the entrance, balustrades, urns, the
 *   columns' fluting, lamps, the fountain and garden (ground).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stone = new Part(), trim = new Part(), tile = new Part(), copper = new Part(), win = new Part(), shade = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const TAU = Math.PI * 2

/** A quad wound to face `hint`, optionally smooth-shaded. */
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  if (dot(cross(sub(B, A), sub(C, A)), hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}

/** A box with a bevelled cornice lip in trim. */
function block(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, wall = stone, top: Part | null = stone, lip = 0.4) {
  const c: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ci: [number, number][] = [[x0 + lip, y0 + lip], [x1 - lip, y0 + lip], [x1 - lip, y1 - lip], [x0 + lip, y1 - lip]]
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4], ai = ci[i], bi = ci[(i + 1) % 4]
    const o: V3 = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0]
    quad(wall, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip]], o)
    quad(trim, [[a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], [bi[0], bi[1], z1], [ai[0], ai[1], z1]], add(unit(o), [0, 0, 1]))
  }
  if (top) quad(top, ci.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
}

/** A hipped tile roof over a rectangle, eaves overhanging by `o`, with a soffit. */
function hip(x0: number, x1: number, y0: number, y1: number, zE: number, zR: number, o = 0.6) {
  x0 -= o; x1 += o; y0 -= o; y1 += o
  const along = x1 - x0 >= y1 - y0
  const h = (along ? y1 - y0 : x1 - x0) / 2
  const e = zE - 0.25
  const A: V3 = [x0, y0, e], B: V3 = [x1, y0, e], C: V3 = [x1, y1, e], D: V3 = [x0, y1, e]
  let R0: V3, R1: V3
  if (along) { R0 = [x0 + h, (y0 + y1) / 2, zR]; R1 = [x1 - h, (y0 + y1) / 2, zR] }
  else { R0 = [(x0 + x1) / 2, y0 + h, zR]; R1 = [(x0 + x1) / 2, y1 - h, zR] }
  if (along) {
    quad(tile, [A, B, R1, R0], [0, -1, 1]); quad(tile, [C, D, R0, R1], [0, 1, 1])
    tri(tile, D, A, R0, [-1, 0, 1]); tri(tile, B, C, R1, [1, 0, 1])
  } else {
    quad(tile, [B, C, R1, R0], [1, 0, 1]); quad(tile, [D, A, R0, R1], [-1, 0, 1])
    tri(tile, A, B, R0, [0, -1, 1]); tri(tile, C, D, R1, [0, 1, 1])
  }
  quad(trim, [A, B, C, D], [0, 0, -1])
  // a thin fascia so the eave has an edge
  const F = 0.25
  for (const [p, q, n] of [[A, B, [0, -1, 0]], [B, C, [1, 0, 0]], [C, D, [0, 1, 0]], [D, A, [-1, 0, 0]]] as [V3, V3, V3][]) {
    quad(tile, [p, q, [q[0], q[1], q[2] + F], [p[0], p[1], p[2] + F]], n)
  }
}

/** A lean-to tile roof against a wall: low edge on `side`. */
function shed(x0: number, x1: number, y0: number, y1: number, zLow: number, zHigh: number, side: 'n' | 's' | 'e' | 'w') {
  const z = (x: number, y: number) => {
    const t = side === 'n' ? (y1 - y) / (y1 - y0) : side === 's' ? (y - y0) / (y1 - y0) : side === 'e' ? (x1 - x) / (x1 - x0) : (x - x0) / (x1 - x0)
    return zLow + (zHigh - zLow) * t
  }
  const o = 0.5
  const ox0 = side === 'w' ? x0 - o : x0, ox1 = side === 'e' ? x1 + o : x1, oy0 = side === 's' ? y0 - o : y0, oy1 = side === 'n' ? y1 + o : y1
  const P: V3[] = [[ox0, oy0, z(x0, y0)], [ox1, oy0, z(x1, y0)], [ox1, oy1, z(x1, y1)], [ox0, oy1, z(x0, y1)]]
  quad(tile, P, [0, 0, 1])
  quad(trim, P.map(([x, y, zz]) => [x, y, zz - 0.3] as V3), [0, 0, -1])
}

/** A surface of revolution about (cx, cy): profile [radius, z] bottom to top, smooth-shaded. */
function revolve(p: Part, cx: number, cy: number, prof: [number, number][], segs: number, phase = 0) {
  const pt = (a: number, r: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
    const dr = r1 - r0, dz = z1 - z0
    for (let i = 0; i < segs; i++) {
      const a0 = phase + (i / segs) * TAU, a1 = phase + ((i + 1) / segs) * TAU
      const nn = (a: number): V3 => unit([Math.cos(a) * dz, Math.sin(a) * dz, -dr])
      quad(p, [pt(a0, r0, z0), pt(a1, r0, z0), pt(a1, r1, z1), pt(a0, r1, z1)], add(nn(a0), nn(a1)), [nn(a0), nn(a1), nn(a1), nn(a0)])
    }
  }
  const top = prof[prof.length - 1]
  if (top[0] > 0.01) for (let i = 0; i < segs; i++) {
    const a0 = phase + (i / segs) * TAU, a1 = phase + ((i + 1) / segs) * TAU
    tri(p, [cx, cy, top[1]], pt(a0, top[0], top[1]), pt(a1, top[0], top[1]), [0, 0, 1])
  }
}

/** A prism over a convex polygon (counter-clockwise), flat-shaded, with a top. */
function prism(p: Part, poly: [number, number][], z0: number, z1: number, top: Part | null = p) {
  const n = poly.length
  const cx = poly.reduce((s, q) => s + q[0], 0) / n, cy = poly.reduce((s, q) => s + q[1], 0) / n
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    quad(p, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy, 0])
  }
  if (top) for (let i = 1; i < n - 1; i++) tri(top, [poly[0][0], poly[0][1], z1], [poly[i][0], poly[i][1], z1], [poly[i + 1][0], poly[i + 1][1], z1], [0, 0, 1])
}
const ngon = (cx: number, cy: number, r: number, n: number, phase = 0): [number, number][] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (i / n) * TAU), cy + r * Math.sin(phase + (i / n) * TAU)] as [number, number])

/** A wall plane for panels: origin, run direction, outward normal. */
type Wall = { at: (s: number, z: number) => V3; n: V3 }
const wallX = (x: number, sign: 1 | -1): Wall => ({ at: (s, z) => [x + sign * 0.06, s, z], n: [sign, 0, 0] })
const wallY = (y: number, sign: 1 | -1): Wall => ({ at: (s, z) => [s, y + sign * 0.06, z], n: [0, sign, 0] })

function panel(p: Part, w: Wall, s: number, width: number, z0: number, z1: number) {
  const r = width / 2
  quad(p, [w.at(s - r, z0), w.at(s + r, z0), w.at(s + r, z1), w.at(s - r, z1)], w.n)
}
/** A round-headed panel: a true semicircle on top. */
function arch(p: Part, w: Wall, s: number, width: number, z0: number, z1: number, segs = 8) {
  const r = width / 2, zs = z1 - r
  quad(p, [w.at(s - r, z0), w.at(s + r, z0), w.at(s + r, zs), w.at(s - r, zs)], w.n)
  const c = w.at(s, zs)
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI, a1 = ((i + 1) / segs) * Math.PI
    tri(p, c, w.at(s + r * Math.cos(a0), zs + r * Math.sin(a0)), w.at(s + r * Math.cos(a1), zs + r * Math.sin(a1)), w.n)
  }
}
/** A pilaster or column face standing proud of a wall, in trim. */
function pilaster(w: Wall, s: number, width: number, z0: number, z1: number, depth = 0.5) {
  const r = width / 2
  const o = (k: number): V3 => mul(w.n, k)
  const p0 = add(w.at(s - r, z0), o(-0.06)), p1 = add(w.at(s + r, z0), o(-0.06))
  const q0 = add(p0, o(depth)), q1 = add(p1, o(depth))
  const up = (v: V3, dz: number): V3 => [v[0], v[1], v[2] + dz]
  const H = z1 - z0
  quad(trim, [q0, q1, up(q1, H), up(q0, H)], w.n)
  quad(trim, [p0, q0, up(q0, H), up(p0, H)], sub(p0, p1))
  quad(trim, [q1, p1, up(p1, H), up(q1, H)], sub(p1, p0))
  quad(trim, [up(p0, H), up(q0, H), up(q1, H), up(p1, H)], [0, 0, 1])
}

/** One window bay pattern along a wall: two panels a bay, each spanning two storeys. */
function bays(w: Wall, s0: number, s1: number, pitch: number, skip: (s: number) => boolean = () => false, zBase = 3.2) {
  const n = Math.max(1, Math.round((s1 - s0) / pitch))
  for (let i = 0; i < n; i++) {
    const s = s0 + ((s1 - s0) * (i + 0.5)) / n
    if (skip(s)) continue
    panel(win, w, s, 2.4, zBase, zBase + 5.8)
    panel(win, w, s, 2.4, zBase + 7.8, 16.8)
  }
}

// ---------------------------------------------------------------------------
// Wings. Ground under the anchor's frame is 0; the west front ground is 2.7.
const EAVE = 18.7, RIDGE = 21.2, GAL = 13.7
const WX0 = -26, WX1 = -14.5 // west wing, outer and courtyard walls
const NY0 = 41, NY1 = 53 // north wing (south wing mirrored)
const EX0 = 31, EX1 = 45.4 // east pavilions of the north and south wings

// west wing
block(WX0, WX1, -NY1, NY1, 0, EAVE, stone, null)
hip(WX0, WX1, -NY1, NY1, EAVE, RIDGE)
for (const s of [1, -1] as const) {
  // north and south wings
  const y0 = s > 0 ? NY0 : -NY1, y1 = s > 0 ? NY1 : -NY0
  block(WX1 - 0.5, EX0 + 0.5, y0, y1, 0, EAVE, stone, null)
  hip(WX0, EX0 + 2, y0, y1, EAVE, RIDGE)
  // the east pavilions, deeper toward the courtyard
  const py0 = s > 0 ? 35.1 : -NY1, py1 = s > 0 ? NY1 : -35.1
  block(EX0, EX1, py0, py1, 0, EAVE, stone, null)
  hip(EX0, EX1, py0, py1, EAVE, RIDGE + 0.4)
  // courtyard galleries along the north and south wings
  const g0 = s > 0 ? 37 : -NY0, g1 = s > 0 ? NY0 : -37
  block(-10, EX0, g0, g1, 0, GAL, stone, null, 0.3)
  shed(-10, EX0, g0, g1, GAL, GAL + 1.6, s > 0 ? 's' : 'n')
  const gw = wallY(s > 0 ? 37 : -37, s > 0 ? -1 : 1)
  for (let i = 0; i < 8; i++) arch(shade, gw, -4 + i * 4.4, 2.8, 3.8, 9.2, 6)
  for (let i = 0; i < 8; i++) panel(win, gw, -4 + i * 4.4, 1.6, 10.2, 12.6)
}
// west courtyard gallery
block(WX1 - 0.5, -10, -NY0, NY0, 0, GAL, stone, null, 0.3)
shed(WX1, -10, -NY0, NY0, GAL, GAL + 1.6, 'e')
{
  const gw = wallX(-10, 1)
  for (let i = 0; i < 12; i++) {
    const s = -33 + i * 6
    if (Math.abs(s) < 10) continue
    arch(shade, gw, s, 3, 3.8, 9.4, 6)
    panel(win, gw, s, 1.6, 10.2, 12.6)
  }
}

// facades: west, north, south, east ends; the windows skip the tower
bays(wallX(WX0, -1), -NY1 + 2, NY1 - 2, 5.2, (s) => Math.abs(s) < 13.5, 3.6)
for (const s of [1, -1] as const) {
  const outer = wallY(s * NY1, s)
  bays(outer, WX0 + 2, EX1 - 2, 5.2, () => false, 1.4)
  // the east ends of the wings, and the pavilions' courtyard faces
  bays(wallX(EX1, 1), s > 0 ? 36.5 : -NY1 + 1.5, s > 0 ? NY1 - 1.5 : -36.5, 4.4, () => false, 2)
  bays(wallY(s * 35.1, (-s) as 1 | -1), EX0 + 1, EX1 - 1, 4.4, () => false, 4)
  bays(wallX(EX0, -1), s > 0 ? 35.5 : -36.6, s > 0 ? 36.6 : -35.5, 4.4, () => false, 4)
  // the wings' upper courtyard walls, above the galleries
  const inner = wallY(s * NY0, (-s) as 1 | -1)
  for (let i = 0; i < 9; i++) panel(win, inner, -6 + i * 4.4, 1.7, 15.2, 17.6)
}
for (let i = 0; i < 17; i++) {
  const s = -36 + i * 4.5
  if (Math.abs(s) < 12) continue
  panel(win, wallX(WX1, 1), s, 1.7, 15.2, 17.6)
}

// ---------------------------------------------------------------------------
// The east arcade closing the courtyard: one storey of round arches, a
// taller gate in the middle.
{
  const x0 = 30, x1 = 34.6, y0 = -35.1, y1 = 35.1, H = 10.5
  block(x0, x1, y0, y1, 0, H, stone, stone, 0.35)
  for (const [w, zb] of [[wallX(x1, 1), 1.8], [wallX(x0, -1), 3.8]] as [Wall, number][]) {
    const n = 12, pitch = (y1 - y0 - 4) / n
    for (let i = 0; i < n; i++) {
      const s = y0 + 2 + pitch * (i + 0.5)
      if (Math.abs(s) < pitch * 0.6) arch(shade, w, s, 4.6, zb, 9.6, 8)
      else arch(shade, w, s, 3.6, zb, 8.6, 8)
    }
  }
}

// ---------------------------------------------------------------------------
// The four small cupolas at the courtyard's corners: a square shaft through
// the roof, a square belfry with an arch on each face, a lead-green dome and
// a spike, all four alike (lidar).
function cupola(cx: number, cy: number) {
  // lidar (1 m): shaft and belfry 7 m square to 24.5 m, crown 31-32 m
  const S = 3.8, top = 20.4, B = 3.3, BT = 24.8
  block(cx - S, cx + S, cy - S, cy + S, 0, top, stone, stone, 0.4)
  block(cx - B, cx + B, cy - B, cy + B, top, BT, stone, stone, 0.35)
  const faces: Wall[] = [wallX(cx + B, 1), wallX(cx - B, -1)]
  for (const w of faces) arch(shade, { at: (s, z) => w.at(cy + s, z), n: w.n }, 0, 2.0, top + 0.6, BT - 0.7, 6)
  for (const w of [wallY(cy + B, 1), wallY(cy - B, -1)]) arch(shade, { at: (s, z) => w.at(cx + s, z), n: w.n }, 0, 2.0, top + 0.6, BT - 0.7, 6)
  const R = 3.0, Z1 = BT
  revolve(copper, cx, cy, [[R, Z1], [R * 0.97, Z1 + 1.4], [R * 0.78, Z1 + 2.8], [R * 0.42, Z1 + 3.9], [0.5, Z1 + 4.3]], 12)
  revolve(copper, cx, cy, [[0.6, Z1 + 4.3], [0.6, Z1 + 5.2], [0.7, Z1 + 5.5], [0.05, Z1 + 7.2]], 6)
}
cupola(-7.5, 34.6)
cupola(-7.5, -34.6)
cupola(27.2, 34.6)
cupola(27.2, -34.6)

// ---------------------------------------------------------------------------
// The tower. Entrance pavilion on the west front, the belfry stage, the
// drum, the dome and the lantern, on the axis y = 0 at x = -20.5.
const TX = -20.5
const PAV = 21.5
{
  const x0 = -34, x1 = -12, y0 = -13.6, y1 = 13.6
  block(x0, x1, y0, y1, 0, PAV, stone, stone, 0.5)
  const w = wallX(x0, -1)
  // the great arch, two storeys, between paired columns
  arch(shade, w, 0, 6.6, 2.7, 15.4, 10)
  for (const s of [-1, 1]) {
    pilaster(w, s * 4.4, 1.1, 2.7, 15.8, 0.8)
    pilaster(w, s * 5.9, 1.1, 2.7, 15.8, 0.8)
    // side doors and the windows over them
    panel(shade, w, s * 8.6, 2.0, 2.7, 6.6)
    panel(win, w, s * 8.6, 1.7, 8.4, 14.6)
    pilaster(w, s * 12.4, 1.6, 0.5, 20.8, 0.5)
    panel(win, w, s * 10.6, 1.4, 8.4, 14.6)
  }
  // entablature over the columns and a pediment over the arch
  {
    const z0 = 15.8, z1 = 17.2, o = 0.9
    quad(trim, [[x0 - o, -7, z0], [x0 - o, 7, z0], [x0 - o, 7, z1], [x0 - o, -7, z1]], [-1, 0, 0])
    quad(trim, [[x0 - o, -7, z1], [x0 - o, 7, z1], [x0, 7, z1], [x0, -7, z1]], [0, 0, 1])
    quad(trim, [[x0 - o, -7, z0], [x0 - o, 7, z0], [x0, 7, z0], [x0, -7, z0]], [0, 0, -1])
    quad(trim, [[x0 - o, -7, z0], [x0, -7, z0], [x0, -7, z1], [x0 - o, -7, z1]], [0, -1, 0])
    quad(trim, [[x0 - o, 7, z0], [x0, 7, z0], [x0, 7, z1], [x0 - o, 7, z1]], [0, 1, 0])
    const A: V3 = [x0 - 0.7, -6.2, z1], B: V3 = [x0 - 0.7, 6.2, z1], C: V3 = [x0 - 0.7, 0, z1 + 2.6]
    tri(trim, A, B, C, [-1, 0, 0])
    quad(trim, [A, C, [x0, 0, z1 + 2.6], [x0, -6.2, z1]], [0, -1, 1])
    quad(trim, [C, B, [x0, 6.2, z1], [x0, 0, z1 + 2.6]], [0, 1, 1])
  }
  // the courtyard side: an arched door under the tower
  arch(shade, wallX(x1, 1), 0, 4.4, 3.8, 11, 8)
  for (const s of [-1, 1]) panel(win, wallX(x1, 1), s * 6.5, 1.7, 13, 18.5)
  // obelisks on the pavilion's outer piers
  for (const s of [-1, 1]) {
    const cx = -33.0, cy = s * 12.7, b = 1.15
    const ring = (r: number, z: number): V3[] => [[cx - r, cy - r, z], [cx + r, cy - r, z], [cx + r, cy + r, z], [cx - r, cy + r, z]]
    trim.loft([ring(b * 1.25, PAV), ring(b * 1.25, PAV + 1.2), ring(b, PAV + 1.2), ring(b * 0.55, PAV + 10.4)])
    const t = ring(b * 0.55, PAV + 10.4)
    for (let i = 0; i < 4; i++) trim.tri(t[i], t[(i + 1) % 4], [cx, cy, PAV + 12])
  }
}

// Belfry stage: 21 m square with chamfered corners, a great open arch on
// each face between paired columns, a smaller arch either side.
const ST0 = PAV, ST1 = 39.5, SH = 10.2, CH = 3.2
{
  const poly: [number, number][] = [
    [TX - SH + CH, -SH], [TX + SH - CH, -SH], [TX + SH, -SH + CH], [TX + SH, SH - CH],
    [TX + SH - CH, SH], [TX - SH + CH, SH], [TX - SH, SH - CH], [TX - SH, -SH + CH],
  ]
  prism(stone, poly, ST0, ST1 - 0.6, null)
  // cornice: a bevelled lip all round, and the terrace inside it
  const grow = (d: number) => poly.map(([x, y]) => [TX + (x - TX) * (1 + d / SH), y * (1 + d / SH)] as [number, number])
  const lo = grow(0), hi = grow(0.5)
  for (let i = 0; i < 8; i++) {
    const a = lo[i], b = lo[(i + 1) % 8], c = hi[(i + 1) % 8], d = hi[i]
    const o: V3 = [(a[0] + b[0]) / 2 - TX, (a[1] + b[1]) / 2, 0]
    quad(trim, [[a[0], a[1], ST1 - 0.6], [b[0], b[1], ST1 - 0.6], [c[0], c[1], ST1], [d[0], d[1], ST1]], add(unit(o), [0, 0, 0.6]))
  }
  for (let i = 1; i < 7; i++) tri(stone, [hi[0][0], hi[0][1], ST1], [hi[i][0], hi[i][1], ST1], [hi[i + 1][0], hi[i + 1][1], ST1], [0, 0, 1])
  // the four faces
  const faces: Wall[] = [
    { at: (s, z) => [TX - SH - 0.06, -s, z], n: [-1, 0, 0] },
    { at: (s, z) => [TX + SH + 0.06, s, z], n: [1, 0, 0] },
    { at: (s, z) => [TX + s, -SH - 0.06, z], n: [0, -1, 0] },
    { at: (s, z) => [TX - s, SH + 0.06, z], n: [0, 1, 0] },
  ]
  for (const w of faces) {
    arch(shade, w, 0, 6.2, 26, 37.6, 10)
    for (const s of [-1, 1]) {
      pilaster(w, s * 4.1, 0.9, 23.4, 38.1, 0.7)
      pilaster(w, s * 5.2, 0.9, 23.4, 38.1, 0.7)
      arch(shade, w, s * 7.0, 1.9, 28.2, 35.6, 6)
    }
  }
  // urns on the chamfered corners
  for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const cx = TX + sx * (SH - 0.9), cy = sy * (SH - 0.9)
    revolve(trim, cx, cy, [[0.8, ST1], [0.8, ST1 + 0.5], [0.5, ST1 + 0.8], [0.75, ST1 + 1.8], [0.05, ST1 + 3.4]], 6)
  }
}

// Drum: round, 16.8 m across, eight arched windows, a cornice.
const DR = 8.4, DZ0 = ST1, DZ1 = 49.4
{
  revolve(stone, TX, 0, [[DR + 0.6, DZ0], [DR + 0.6, DZ0 + 1.6], [DR, DZ0 + 1.6], [DR, DZ1 - 0.6]], 16)
  revolve(trim, TX, 0, [[DR, DZ1 - 0.6], [DR + 0.55, DZ1 - 0.3], [DR + 0.55, DZ1], [DR - 0.4, DZ1 + 0.3]], 16)
  for (let k = 0; k < 8; k++) {
    // on a facet's middle, not a vertex of the 16-sided drum
    const a = ((2 * k + 0.5) / 16) * TAU, ap = DR * Math.cos(Math.PI / 16) + 0.06
    const w: Wall = { at: (s, z) => [TX + ap * Math.cos(a) - s * Math.sin(a), ap * Math.sin(a) + s * Math.cos(a), z], n: [Math.cos(a), Math.sin(a), 0] }
    arch(shade, w, 0, 2.3, 42.4, 47.8, 6)
    // paired pilasters between the windows
    const ap2 = DR * Math.cos(Math.PI / 16)
    const b = a + Math.PI / 8
    const w2: Wall = { at: (s, z) => [TX + ap2 * Math.cos(b) - s * Math.sin(b), ap2 * Math.sin(b) + s * Math.cos(b), z], n: [Math.cos(b), Math.sin(b), 0] }
    pilaster(w2, 0, 1.0, DZ0 + 1.6, DZ1 - 0.6, 0.45)
  }
}
// Dome: red tile, about a hemisphere, 15.8 m across.
const DOME_R = 7.9, DOME_Z = DZ1 + 0.3, DOME_TOP = 58
{
  const prof: [number, number][] = []
  for (let i = 0; i <= 7; i++) {
    const t = (i / 7) * (Math.PI / 2) * 0.9
    prof.push([DOME_R * Math.cos(t), DOME_Z + (DOME_TOP - DOME_Z) * Math.sin(t) / Math.sin((Math.PI / 2) * 0.9)])
  }
  revolve(tile, TX, 0, prof, 16)
}
// Lantern: green copper, eight-sided, with openings, a cap and a finial.
{
  const LR = 2.5, L0 = DOME_TOP - 0.4, L1 = 61.4
  revolve(trim, TX, 0, [[LR + 0.4, L0], [LR + 0.4, L0 + 0.5], [LR, L0 + 0.5]], 8, Math.PI / 8)
  prism(copper, ngon(TX, 0, LR, 8, Math.PI / 8), L0 + 0.5, L1, null)
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * TAU, ap = LR * Math.cos(Math.PI / 8) + 0.06
    const w: Wall = { at: (s, z) => [TX + ap * Math.cos(a) - s * Math.sin(a), ap * Math.sin(a) + s * Math.cos(a), z], n: [Math.cos(a), Math.sin(a), 0] }
    arch(shade, w, 0, 0.9, L0 + 1.0, L1 - 0.5, 4)
  }
  revolve(copper, TX, 0, [[LR + 0.35, L1], [LR + 0.1, L1 + 0.6], [LR * 0.6, L1 + 1.4], [0.35, L1 + 2.0]], 8, Math.PI / 8)
  revolve(copper, TX, 0, [[0.45, L1 + 2.0], [0.5, L1 + 2.6], [0.06, 64.7]], 6)
}

// ---------------------------------------------------------------------------
// Palette, from daylight photos: cream render and stone (`stone`, `trim`),
// red clay tile on the roofs and the dome (`terracotta`), green copper on
// the lantern and the cupolas (`patina`), windows `window`; open arches and
// loggias are a shadowed recess, a light warm grey so they read as openings
// without going dark.
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: tile, material: PALETTE.terracotta },
  { part: copper, material: PALETTE.patina },
  { part: win, material: PALETTE.window },
  { part: shade, material: finish('pch-arch-shade', 0x8f8a80) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Pasadena City Hall', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/37741479',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-pasadena-city-hall.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
