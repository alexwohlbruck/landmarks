/**
 * Tacoma Union Station (1911, Reed & Stem), now the United States
 * Courthouse, Tacoma: procedural, CC0-1.0.
 * bun generators/sea-tacoma-union-station.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; built in the station's own frame,
 * whose y axis runs along Pacific Avenue (bearing 351°, the OSM walls run
 * 350.9°). The origin is the area centroid of OSM way/24656596
 * (-122.4362869, 47.2463690); y = 0 is the lowest ground the outline
 * touches (6.9 m NAVD88), on the east side, where the site falls away from
 * Pacific Avenue towards the old track level. Pacific Avenue, along the west
 * front, is 9.5 m higher, so the street front is one tall storey and the
 * east side has a stone basement under it.
 *
 * Form: a square domed hall on Pacific Avenue with a big semicircular brick
 * gable on each face (the four barrel vaults of a Greek cross), the west and
 * east ones holding the great arched portal with its white stone archivolt;
 * on the crossing, a dark copper dome with a flat crown ring, four segmental
 * fan lunettes over the vaults and four green cartouches on the diagonals.
 * Long, flat-roofed brick wings with tall arched windows run north and south
 * from the hall. Behind, the 1992 courthouse addition: a three-storey brick
 * block with a stone base around a courtyard, joined to the station's east
 * front by a glazed atrium.
 *
 * Sources
 * - OSM: way/24656596 (the whole complex, one outline, no parts). Its plan
 *   sits 2-3 m west of the lidar, so the walls here follow the lidar.
 * - Lidar (measured, USGS 3DEP WA_PierceCounty_1_2020, 1 m surface model,
 *   heights above y = 0): hall x -31.5..9.5, y -61..-26; wings x -27.5..6.5,
 *   y -74.5..-61 and -25..-12.5, flat at 19.0-19.5; hall corners 22; the
 *   gables' crowns 26.3-26.5, falling to 22.5 at 10 m either side (a
 *   semicircle of 15.5 m radius); dome base radius 13.5, profile
 *   (r, z) = (12.5, 28.5), (11, 31.5), (9, 33), (7, 35.5), crown ring
 *   radius ~5 at 37.5, top 37.9; Pacific Avenue 9.5; addition flat at 14.5
 *   (13.5 on its south part), two raised roof panels at 17.5; atrium 13.5.
 * - Published: opened 1 May 1911, Reed & Stem; renovated for the federal
 *   courts 1989-92 with a three-storey addition (Wikipedia, "Union Station
 *   (Tacoma, Washington)"; Q7886107).
 * - Photos (Wikimedia Commons; credits in
 *   /tmp/city/sea/work/sea-tacoma-union-station/credits.txt): Bmzuckerman
 *   2021 (west front from the south-west; the portal), Steve Morgan 2008
 *   (south-west), David Ackerman 2002 (north-west), Tomincal (from the
 *   north along Pacific Avenue, above), Loco Steve (from the south-east,
 *   above), Keith D. Tyler (east front with the addition), ZhengZhou (east,
 *   from the Bridge of Glass), Kira Picabo (the dome).
 * From photos: the portal (inner radius 7, stone band 1.5, springing 4.4 m
 *   above the street), the lunettes' size (12.5 m chord, 4.2 m rise; they
 *   are segmental, not semicircles), the cartouches on the diagonals, the
 *   wings' window rhythm, the stone basement on the east, colours: red-brown
 *   brick, white stone, a dark grey copper dome (photos since the 1990s
 *   restoration show it dark grey-bronze, not green; only the ornaments and
 *   the lunette ribs are green).
 * Estimated: the vault roofs' extent behind the gables, the dome's surface
 *   between the lidar rings (an ellipse through them), the addition's
 *   windows (one panel per bay and storey pair), the atrium's glazing.
 * Left out: the dome's fine ribs, portholes and crown ornaments, the
 *   "UNION STATION" letters (signage), the entrance canopy, lamps, fences,
 *   the addition's stairs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ================================================================ helpers
// Shared by my Tacoma/Olympia models (union station, museum of glass,
// tacoma dome, state capitol). Ring and face helpers copied from
// sea-st-james-cathedral.ts (another builder's).

export type XY = [number, number]

export const area2 = (r: XY[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
export function ccw(r: XY[]): XY[] {
  let pts = r.slice()
  const a = pts[0], z = pts[pts.length - 1]
  if (Math.hypot(a[0] - z[0], a[1] - z[1]) < 1e-6) pts.pop()
  pts = pts.filter((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.02 })
  return area2(pts) < 0 ? pts.reverse() : pts
}
const nrm2 = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
export const outward = (a: XY, b: XY): XY => nrm2([b[1] - a[1], a[0] - b[0]])
export function turn(r: XY[], i: number) {
  const p = r[(i - 1 + r.length) % r.length], q = r[i], s = r[(i + 1) % r.length]
  const a = Math.atan2(q[1] - p[1], q[0] - p[0]), b = Math.atan2(s[1] - q[1], s[0] - q[0])
  let d = ((b - a) * 180) / Math.PI
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}
export function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = r[i0], b = r[i1], c = r[i2]
      if (cr(a, b, c) <= 1e-9) continue
      let ok = true
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue
        const p = r[j]
        if (cr(a, b, p) >= -1e-9 && cr(b, c, p) >= -1e-9 && cr(c, a, p) >= -1e-9) { ok = false; break }
      }
      if (!ok) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true
      break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
export function capRing(part: Part, r: XY[], z: number, up = true) {
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) part.tri(A, B, C)
    else part.tri(A, C, B)
  }
}
/** Cut every convex corner sharper than `minTurn` with a chamfer of `c`. */
export function chamfer(r: XY[], c: number, minTurn = 35): XY[] {
  const out: XY[] = []
  r.forEach((q, i) => {
    const t = turn(r, i)
    if (t < minTurn) { out.push(q); return }
    const p = r[(i - 1 + r.length) % r.length], s = r[(i + 1) % r.length]
    const lp = Math.hypot(p[0] - q[0], p[1] - q[1]), ls = Math.hypot(s[0] - q[0], s[1] - q[1])
    const k1 = Math.min(c, lp / 3), k2 = Math.min(c, ls / 3)
    out.push([q[0] + ((p[0] - q[0]) / lp) * k1, q[1] + ((p[1] - q[1]) / lp) * k1])
    out.push([q[0] + ((s[0] - q[0]) / ls) * k2, q[1] + ((s[1] - q[1]) / ls) * k2])
  })
  return out
}
export function vertexNormal(r: XY[], i: number, smooth = 35): XY | undefined {
  if (Math.abs(turn(r, i)) >= smooth) return undefined
  const p = r[(i - 1 + r.length) % r.length], q = r[i], s = r[(i + 1) % r.length]
  const a = outward(p, q), b = outward(q, s)
  return nrm2([a[0] + b[0], a[1] + b[1]])
}
/** A wall quad over edge i of ring r, smooth-shaded across gentle turns. */
export function wallEdge(part: Part, r: XY[], i: number, z0: number, z1: number, smooth = 35) {
  const a = r[i], b = r[(i + 1) % r.length], n = outward(a, b)
  const na = vertexNormal(r, i, smooth) ?? n, nb = vertexNormal(r, (i + 1) % r.length, smooth) ?? n
  const A0: V3 = [a[0], a[1], z0], B0: V3 = [b[0], b[1], z0], B1: V3 = [b[0], b[1], z1], A1: V3 = [a[0], a[1], z1]
  const N = (v: XY): V3 => [v[0], v[1], 0]
  part.tri(A0, B0, B1, undefined, undefined, undefined, [N(na), N(nb), N(nb)])
  part.tri(A0, B1, A1, undefined, undefined, undefined, [N(na), N(nb), N(na)])
}
/** A closed prism: walls on every edge, a roof cap. */
export function prism(wall: Part, roof: Part | null, r: XY[], z0: number, z1: number, smooth = 35) {
  for (let i = 0; i < r.length; i++) wallEdge(wall, r, i, z0, z1, smooth)
  if (roof) capRing(roof, r, z1)
}
export const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** Points on a circular arc, angles in degrees, inclusive. */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number, n: number): XY[] {
  const out: XY[] = []
  for (let k = 0; k <= n; k++) {
    const a = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return out
}
/** A face frame: origin `o` on a wall, outward normal `n`; s runs along the wall (right, seen from outside), z up. */
export type Face = { o: V3; n: XY }
const faceT = (n: XY): XY => [-n[1], n[0]]
export function onFace(f: Face, s: number, z: number, d = 0): V3 {
  const t = faceT(f.n)
  return [f.o[0] + t[0] * s + f.n[0] * d, f.o[1] + t[1] * s + f.n[1] * d, f.o[2] + z]
}
/** A flat shape (s, z) on a face, `d` metres out from it, facing out. */
export function flatShape(part: Part, f: Face, poly: XY[], d = 0.05) {
  const p = ccw(poly)
  for (const [a, b, c] of triangulate(p)) part.tri(onFace(f, p[a][0], p[a][1], d), onFace(f, p[b][0], p[b][1], d), onFace(f, p[c][0], p[c][1], d))
}
/** A shape (s, z) on a face extruded outward from d0 to d1: front plus sides. */
export function extrudeShape(part: Part, f: Face, poly: XY[], d0: number, d1: number, sides = true) {
  const p = ccw(poly)
  flatShape(part, f, p, d1)
  if (!sides) return
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    part.quad(onFace(f, a[0], a[1], d0), onFace(f, b[0], b[1], d0), onFace(f, b[0], b[1], d1), onFace(f, a[0], a[1], d1))
  }
}
/** An arch-headed opening's outline: jambs from z0, a semicircle on top springing at zs. */
export function archShape(sc: number, w: number, z0: number, zs: number, segs = 10): XY[] {
  const r = w / 2
  return [[sc - r, z0], [sc + r, z0], ...arc(sc, zs, r, 0, 180, segs)]
}
/** A band following a semicircular arch (and its jambs down to z0): radii r0..r1 about (sc, zs). */
export function archBand(sc: number, zs: number, r0: number, r1: number, z0: number, segs = 12): XY[] {
  return [[sc - r1, z0], [sc - r0, z0], ...arc(sc, zs, r0, 180, 0, segs), [sc + r0, z0], [sc + r1, z0], ...arc(sc, zs, r1, 0, 180, segs)]
}
/** A surface of revolution about a vertical axis from (r, z) profile points, bottom to top; smooth normals. */
export function lathe(part: Part, cx: number, cy: number, prof: [number, number][], segs: number, a0 = 0, a1 = 360) {
  const ring = (r: number, z: number): V3[] => arc(cx, cy, r, a0, a1, segs).map((p) => [p[0], p[1], z])
  // vertex normals from the neighbouring segments, so a dome shades smoothly
  const segN = prof.slice(0, -1).map(([r0, z0], k) => { const [r1, z1] = prof[k + 1]; const L = Math.hypot(r1 - r0, z1 - z0) || 1; return [(z1 - z0) / L, -(r1 - r0) / L] as XY })
  const nAt = (k: number, side: 0 | 1): XY => {
    // side 0: the lower end of segment k, side 1: its upper end
    const j = side === 0 ? k - 1 : k + 1
    const a = segN[k], b = segN[j]
    if (!b) return a
    const cos = a[0] * b[0] + a[1] * b[1]
    if (cos < Math.cos((40 * Math.PI) / 180)) return a // a crease: keep it sharp
    return nrm2([a[0] + b[0], a[1] + b[1]])
  }
  for (let k = 0; k + 1 < prof.length; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const b = ring(r0, z0), t = ring(r1, z1)
    const lo = nAt(k, 0), hi = nAt(k, 1)
    for (let i = 0; i < segs; i++) {
      const aA = ((a0 + ((a1 - a0) * i) / segs) * Math.PI) / 180, aB = ((a0 + ((a1 - a0) * (i + 1)) / segs) * Math.PI) / 180
      const N = (n: XY, a: number): V3 => [Math.cos(a) * n[0], Math.sin(a) * n[0], n[1]]
      if (r1 > 1e-6 && r0 > 1e-6) {
        part.tri(b[i], b[i + 1], t[i + 1], undefined, undefined, undefined, [N(lo, aA), N(lo, aB), N(hi, aB)])
        part.tri(b[i], t[i + 1], t[i], undefined, undefined, undefined, [N(lo, aA), N(hi, aB), N(hi, aA)])
      } else if (r1 <= 1e-6) part.tri(b[i], b[i + 1], t[i], undefined, undefined, undefined, [N(lo, aA), N(lo, aB), [0, 0, 1]])
      else part.tri(b[i], t[i + 1], t[i], undefined, undefined, undefined, [[0, 0, -1], N(hi, aB), N(hi, aA)])
    }
  }
}
/** A disc cap at height z (up or down). */
export function disc(part: Part, cx: number, cy: number, r: number, z: number, segs: number, up = true) {
  const ring = arc(cx, cy, r, 0, 360, segs).slice(0, -1)
  for (let i = 0; i < segs; i++) {
    const a: V3 = [ring[i][0], ring[i][1], z], b: V3 = [ring[(i + 1) % segs][0], ring[(i + 1) % segs][1], z]
    if (up) part.tri([cx, cy, z], a, b)
    else part.tri([cx, cy, z], b, a)
  }
}
export function finishGlb(name: string, parts: { part: Part; material: Swatch }[], extras: Record<string, unknown>, maxTri = 5000) {
  const live = parts.filter((p) => p.part.triangles)
  if (live.length > 6) throw new Error(`Too many materials: ${live.length}`)
  const triangles = live.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, live, { license: 'CC0-1.0', elevation: 0, frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}
export async function writeModel(id: string, built: { glb: Uint8Array; triangles: number }) {
  const out = process.argv[2] ?? new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, built.glb)
  console.log(`${out}: ${built.triangles} triangles, ${built.glb.length} bytes (${(built.glb.length / 1024).toFixed(1)} KiB)`)
}

// ================================================================ the model

// The hall and its dome
const HX0 = -31.5, HX1 = 9.5, HY0 = -61, HY1 = -26
const CX = -11, CY = -43.5
const STREET = 9.5 // Pacific Avenue above y = 0
const CORN0 = 20.4, CORN = 21.6 // the hall's main cornice
const GR = 15.5, GZ = 11 // gables and vaults: radius and centre height (crown 26.5)
// Wings
const WX0 = -27.5, WX1 = 6.5, WTOP = 19.3, WCORN = 18.2
const BASE = 9.5 // top of the stone basement

/** Rough ground height (above y = 0) by x: Pacific Avenue on the west, the old track level on the east. */
const ground = (x: number) => (x < -27 ? STREET : x < -21 ? 5 + ((-21 - x) / 6) * 4.5 : x < 0 ? 1 + (-x / 21) * 4 : 0.5)

function build() {
  const brick = new Part(), trim = new Part(), dome = new Part(), green = new Part(), win = new Part(), roof = new Part()
  const W = (f: Face, poly: XY[], d = 0.06) => flatShape(win, f, poly, d)

  // ------------------------------------------------------------ the hall
  const hall = rect(HX0, HY0, HX1, HY1)
  prism(trim, null, hall, 0, BASE)
  prism(brick, null, hall, BASE, CORN0)
  prism(trim, roof, chamfer(rect(HX0 - 0.35, HY0 - 0.35, HX1 + 0.35, HY1 + 0.35), 0.4), CORN0, CORN)

  // Gables: the part of the vault circle above the cornice, brick, on each face,
  // with a white stone rim; the barrel vault behind is a dark metal roof.
  const zc = CORN, sCut = Math.sqrt(GR * GR - (zc - GZ) ** 2)
  const a0 = (Math.asin((zc - GZ) / GR) * 180) / Math.PI
  const gableShape: XY[] = arc(0, GZ, GR, a0, 180 - a0, 20)
  const rimShape: XY[] = [...arc(0, GZ, GR + 0.25, a0 - 0.4, 180 - a0 + 0.4, 20), ...arc(0, GZ, GR - 1.1, 180 - a0 - 1.8, a0 + 1.8, 20)]
  const faces: { f: Face; half: number; axis: 'x' | 'y' }[] = [
    { f: { o: [HX0, CY, 0], n: [-1, 0] }, half: (HX1 - HX0) / 2, axis: 'x' },
    { f: { o: [HX1, CY, 0], n: [1, 0] }, half: (HX1 - HX0) / 2, axis: 'x' },
    { f: { o: [CX, HY0, 0], n: [0, -1] }, half: (HY1 - HY0) / 2, axis: 'y' },
    { f: { o: [CX, HY1, 0], n: [0, 1] }, half: (HY1 - HY0) / 2, axis: 'y' },
  ]
  for (const { f } of faces) {
    flatShape(brick, f, gableShape, 0)
    extrudeShape(trim, f, rimShape, 0, 0.35)
  }
  // The two barrel vaults, above the cornice, running face to face.
  const vault = (along: 'x' | 'y') => {
    const n = 20
    for (let k = 0; k < n; k++) {
      const t0 = ((a0 + ((180 - 2 * a0) * k) / n) * Math.PI) / 180, t1 = ((a0 + ((180 - 2 * a0) * (k + 1)) / n) * Math.PI) / 180
      const P = (t: number, u: number): V3 => (along === 'x' ? [u, CY + GR * Math.cos(t), GZ + GR * Math.sin(t)] : [CX - GR * Math.cos(t), u, GZ + GR * Math.sin(t)])
      const Nn = (t: number): V3 => (along === 'x' ? [0, Math.cos(t), Math.sin(t)] : [-Math.cos(t), 0, Math.sin(t)])
      const [u0, u1] = along === 'x' ? [HX0 + 0.02, HX1 - 0.02] : [HY0 + 0.02, HY1 - 0.02]
      const A = P(t0, u0), B = P(t0, u1), C = P(t1, u1), D = P(t1, u0)
      if (along === 'x') {
        roof.tri(A, B, C, undefined, undefined, undefined, [Nn(t0), Nn(t0), Nn(t1)])
        roof.tri(A, C, D, undefined, undefined, undefined, [Nn(t0), Nn(t1), Nn(t1)])
      } else {
        roof.tri(A, C, B, undefined, undefined, undefined, [Nn(t0), Nn(t1), Nn(t0)])
        roof.tri(A, D, C, undefined, undefined, undefined, [Nn(t0), Nn(t1), Nn(t1)])
      }
    }
  }
  vault('x')
  vault('y')

  // The great portals, west on Pacific Avenue and east over the atrium:
  // a white stone archivolt, the glazed lunette and doors inside it.
  const PR = 7.2, PS = STREET + 4.4
  for (const f of [faces[0].f, faces[1].f]) {
    extrudeShape(trim, f, archBand(0, PS, PR, PR + 2.0, STREET, 14), 0, 0.4)
    W(f, archShape(0, 2 * PR, STREET, PS, 14))
    // the transom over the doors
    extrudeShape(trim, f, [[-PR, PS - 0.5], [PR, PS - 0.5], [PR, PS + 0.3], [-PR, PS + 0.3]], 0.06, 0.2)
    // a tall slit window in each pier
    for (const s of [-14.6, 14.6]) W(f, archShape(s, 1.3, STREET + 4.5, STREET + 8.5, 6))
  }

  // The dome: an ellipse through the lidar rings, from a short drum, with a
  // flat crown ring.
  const DR = 13.6, DZ = 24.0, DH = 12.4, RING = 5.3
  const prof: [number, number][] = [[DR, CORN - 0.5], [DR, DZ]]
  const tEnd = Math.acos(RING / DR)
  for (let k = 1; k <= 9; k++) {
    const t = (tEnd * k) / 9
    prof.push([DR * Math.cos(t), DZ + DH * Math.sin(t)])
  }
  const zTop = DZ + DH * Math.sin(tEnd)
  lathe(dome, CX, CY, prof, 32)
  lathe(dome, CX, CY, [[RING + 0.35, zTop - 0.1], [RING + 0.35, zTop + 1.6], [RING, zTop + 1.6], [RING - 0.6, zTop + 2.0]], 24)
  disc(dome, CX, CY, RING - 0.6, zTop + 2.0, 24)

  // Lunettes over the four vaults: segmental fan windows standing on the
  // vault crowns, rimmed in white stone, with green ribs.
  const LH = 6.25, LRISE = 4.2, LZ = 25.6, LD = 13.9
  const LR = (LH * LH + LRISE * LRISE) / (2 * LRISE), Lzc = LZ + LRISE - LR
  const la = (Math.asin(LH / LR) * 180) / Math.PI
  const lunArc = arc(0, Lzc, LR, 90 - la, 90 + la, 10) // right to left along the top
  for (const n of [[-1, 0], [1, 0], [0, -1], [0, 1]] as XY[]) {
    const f: Face = { o: [CX + n[0] * LD, CY + n[1] * LD, 0], n }
    // the hood: the arc swept back into the dome
    for (let i = 0; i < lunArc.length - 1; i++) {
      const [s0, z0] = lunArc[i], [s1, z1] = lunArc[i + 1]
      trim.quad(onFace(f, s0, z0, 0.3), onFace(f, s1, z1, 0.3), onFace(f, s1, z1, -6), onFace(f, s0, z0, -6))
    }
    flatShape(trim, f, [[LH, LZ], ...lunArc.slice(1, -1), [-LH, LZ]], 0.3)
    // the fan: window wedges between green ribs, set just in front
    const fan = 7
    for (let k = 0; k < fan; k++) {
      const i0 = Math.round((k * 10) / fan), i1 = Math.round(((k + 1) * 10) / fan)
      const pts: XY[] = [[0, LZ], ...arc(0, Lzc, LR - 0.8, 90 - la + ((2 * la) * k) / fan, 90 - la + ((2 * la) * (k + 1)) / fan, Math.max(1, i1 - i0))]
      flatShape(k % 2 ? win : green, f, pts, 0.36)
    }
  }
  // Green cartouches on the diagonals, flat on the dome's flank.
  for (const ang of [45, 135, 225, 315]) {
    const a = (ang * Math.PI) / 180, t = 0.62 // ellipse parameter, about a third of the way up
    const r = DR * Math.cos(t) + 0.12, z = DZ + DH * Math.sin(t)
    const n: XY = [Math.cos(a), Math.sin(a)]
    // lean the plate onto the surface: N is the ellipse's normal, T runs up it
    const NL = Math.hypot(DH * Math.cos(t), DR * Math.sin(t))
    const Nn = (DH * Math.cos(t)) / NL, Nz = (DR * Math.sin(t)) / NL
    const f: Face = { o: [CX + n[0] * r, CY + n[1] * r, z], n }
    const shape: XY[] = [[-3.5, -0.3], [-1.6, -1.8], [1.6, -1.8], [3.5, -0.3], [3.5, 0.5], [1.5, 2.0], [-1.5, 2.0], [-3.5, 0.5]]
    const P = (s: number, h: number, d: number): V3 => onFace(f, s, h * Nn + d * Nz, -h * Nz + d * Nn)
    const p = ccw(shape)
    for (const [i, j, k] of triangulate(p)) green.tri(P(p[i][0], p[i][1], 0.45), P(p[j][0], p[j][1], 0.45), P(p[k][0], p[k][1], 0.45))
    for (let i = 0; i < p.length; i++) {
      const A = p[i], B = p[(i + 1) % p.length]
      green.quad(P(A[0], A[1], -0.4), P(B[0], B[1], -0.4), P(B[0], B[1], 0.45), P(A[0], A[1], 0.45))
    }
  }

  // ------------------------------------------------------------ wings
  for (const [y0, y1] of [[-74.5, HY0], [HY1, -12.5]] as [number, number][]) {
    const r = rect(WX0, y0, WX1, y1)
    prism(trim, null, r, 0, BASE)
    prism(brick, null, r, BASE, WCORN)
    prism(trim, roof, chamfer(rect(WX0 - 0.3, y0 - (y0 < HY0 ? 0.3 : 0), WX1 + 0.3, y1 + (y1 > HY1 ? 0.3 : 0)), 0.35), WCORN, WTOP)
    // the long outer face: six tall arched windows over the basement
    const outer = y0 < HY0 ? y0 : y1, n: XY = [0, y0 < HY0 ? -1 : 1]
    const f: Face = { o: [(WX0 + WX1) / 2, outer, 0], n }
    const L = WX1 - WX0
    for (let k = 0; k < 6; k++) {
      const s = -L / 2 + (k + 0.5) * (L / 6)
      W(f, archShape(s, 2.6, STREET + 1.4, STREET + 6.4, 8))
      // the basement's windows, where the ground has fallen away
      const x = f.o[0] + -n[1] * s
      if (ground(x) < 1.5) W(f, [[s - 0.9, 2.2], [s + 0.9, 2.2], [s + 0.9, 7.8], [s - 0.9, 7.8]])
    }
    // the short ends: two windows each
    const yc = (y0 + y1) / 2
    for (const [x, nx] of [[WX0, -1], [WX1, 1]] as [number, number][]) {
      const fe: Face = { o: [x, yc, 0], n: [nx, 0] }
      for (const s of [-4.2, 0, 4.2]) {
        W(fe, archShape(s, 2.4, STREET + 1.4, STREET + 6.4, 8))
        if (nx > 0) W(fe, [[s - 0.9, 2.2], [s + 0.9, 2.2], [s + 0.9, 7.8], [s - 0.9, 7.8]])
      }
    }
  }

  // ------------------------------------------------------------ the 1992 addition
  // The glazed atrium across the station's east front.
  const atrium = rect(HX1, -50, 22, -10.5)
  prism(trim, null, atrium, 0, 12.3)
  prism(trim, roof, chamfer(rect(HX1, -50.3, 22.3, -10.5), 0.3), 12.3, 13.5)
  // its glazing: a clerestory band under the roof, tall panels between piers below
  for (const { f, len } of [{ f: { o: [22, -30.25, 0], n: [1, 0] } as Face, len: 39.5 }, { f: { o: [15.75, -50, 0], n: [0, -1] } as Face, len: 12.5 }]) {
    W(f, [[-len / 2 + 0.8, 9.4], [len / 2 - 0.8, 9.4], [len / 2 - 0.8, 11.8], [-len / 2 + 0.8, 11.8]])
    const k = Math.round(len / 4.4)
    for (let j = 0; j < k; j++) {
      const s = -len / 2 + (j + 0.5) * (len / k)
      W(f, [[s - 1.3, 1.2], [s + 1.3, 1.2], [s + 1.3, 7.8], [s - 1.3, 7.8]])
    }
  }
  // The courthouse block: a stone base, brick above, around the courtyard.
  const southBlock = ccw([[2, -10.5], [22, -10.5], ...arc(22, 2, 12.5, -90, 0, 6).slice(1), [34.5, 14], [2, 14]])
  const mainBlock = rect(-21, 14, 37, 63)
  const blocks: [XY[], number][] = [[southBlock, 13.5], [mainBlock, 14.5]]
  for (const [r, top] of blocks) {
    prism(trim, null, r, 0, 8.0, 25)
    prism(brick, null, r, 8.0, top - 1.0, 25)
    prism(trim, roof, r, top - 1.0, top, 25)
  }
  // raised roof panels (lidar)
  for (const r of [rect(12, 24, 30, 52), rect(-15, 24, 0, 52)]) {
    prism(trim, null, r, 14.5, 15.5)
    prism(win, null, r, 15.5, 16.8)
    prism(trim, roof, r, 16.8, 17.5)
  }
  // windows: a panel per bay, the base storeys and the brick storey above
  const bays = (f: Face, len: number, step: number, xOf: (s: number) => number) => {
    const k = Math.max(1, Math.round(len / step))
    for (let j = 0; j < k; j++) {
      const s = -len / 2 + (j + 0.5) * (len / k)
      const g = ground(xOf(s))
      if (g < 2) W(f, [[s - 1.1, 2.0], [s + 1.1, 2.0], [s + 1.1, 6.6], [s - 1.1, 6.6]])
      if (g < 8.5) W(f, [[s - 1.1, Math.max(9.2, g + 1.0)], [s + 1.1, Math.max(9.2, g + 1.0)], [s + 1.1, 12.4], [s - 1.1, 12.4]])
    }
  }
  bays({ o: [37, 38.5, 0], n: [1, 0] }, 49, 5, () => 37)
  bays({ o: [8, 63, 0], n: [0, 1] }, 58, 5, (s) => 8 - s)
  bays({ o: [-21, 38.5, 0], n: [-1, 0] }, 49, 5, () => -21)
  bays({ o: [-9.5, 14, 0], n: [0, -1] }, 23, 5, (s) => -9.5 + s)
  bays({ o: [2, 1.75, 0], n: [-1, 0] }, 24.5, 5, () => 2)
  bays({ o: [12, -10.5, 0], n: [0, -1] }, 20, 5, (s) => 12 + s)
  bays({ o: [34.5, 8, 0], n: [1, 0] }, 12, 5, () => 34.5)

  return finishGlb('Tacoma Union Station', [
    { part: brick, material: finish('tus-brick', 0xa9665a) },
    { part: trim, material: PALETTE.trim },
    { part: dome, material: finish('tus-dome', 0x6a706d, 0.6) },
    { part: green, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 351, height: zTop + 2.0, replaces: ['way/24656596'] })
}

if (import.meta.main) await writeModel('sea-tacoma-union-station', build())
