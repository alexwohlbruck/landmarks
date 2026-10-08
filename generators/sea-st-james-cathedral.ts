/**
 * St. James Cathedral (1907, Heins & LaFarge), First Hill, Seattle — original
 * procedural geometry, CC0-1.0.
 * bun generators/sea-st-james-cathedral.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid, -122.3258402, 47.6076789) on the lowest ground
 * under the footprint (97.0 m NAVD88, at the west front's terrace). Built in
 * the street grid's frame: the model's x axis runs along the nave from the
 * west front on 9th Avenue to the apse (ENE, 58.8°), y across it (NNW);
 * placement bearing 328.8°.
 *
 * Form: an Italian Renaissance revival basilica in buff brick and white
 * stone. Two square towers 7.8 m wide flank the west front, each face carved
 * into three tall blind arches, topped by a white belfry stage and a small
 * green copper dome and lantern. Between them the front's great arched
 * lunette window sits in a white stone arch under a cornice and pediment.
 * Behind, a gabled tile-roofed nave with low aisles, a flat-roofed crossing
 * (the dome that stood there fell in the snow of 1916 and was never rebuilt),
 * low rounded transept ends, a tall gabled choir and a big semicircular apse
 * with tall arched windows. Low flat-roofed wings flank the choir.
 *
 * Sources
 * - OSM: outline way/108384951 (cathedral, 22 m) and towers way/1363023932,
 *   way/1363023933 (50.2 m). The plan is OSM's, moved 1 m across the nave
 *   (-y) to sit on the lidar, which puts the nave's ridge and both towers
 *   symmetric about y = 0.
 * - Lidar (measured, USGS 3DEP WA_KingCo_1_2021, above 97.0 m): towers 7.8 m
 *   square, shaft cornice 37.5, belfry 42.5, dome 46.5, lantern 49.5; front
 *   parapet 19.5, pediment 22.5; nave eaves 17.5 and ridge 21.5, aisles 11.5;
 *   crossing flat at 21 (no returns over its central skylight); transept
 *   drums 18-19, 7 m radius; choir eaves 21.5, ridge 24.5; apse drum 8.5 m
 *   radius, 21 m; choir wings 8.5 m. The site is nearly level (1.5 m).
 * - USGS NAIP orthophoto (public domain): red-brown tile roofs on the nave and
 *   choir, the pale flat crossing roof, the apse's copper rim.
 * - Published: dedicated 1907; dome collapsed 2 Feb 1916 under snow, not
 *   rebuilt (Wikipedia, "St. James Cathedral (Seattle)").
 * - Photos (Wikimedia Commons, credits in the batch report): Joe Mabel (west
 *   front pano, 9th Ave), Farragutful 2019 (north side and apse; north tower),
 *   Patches.OHoulahan (towers from the east, roofs), Visitor7 (apse, towers),
 *   Another Believer 2023 (the lunette).
 * Estimated: the lunette's and doors' sizes (from the photos scaled to the
 * lidar parapet), the blind arches' widths, window counts on the sides no
 * photo shows square-on (south), the wings' facades (drawn plain).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, type Swatch } from './palette'

// ================================================================ helpers
// Shared by my sea- models (St. James, St. Mark's, Pacific Tower). The ring
// helpers are copied from sea-rainier-square-tower.ts (another builder's).

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
/** A closed prism: walls on every edge, a roof cap, optionally a floor. */
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
/**
 * A face frame: origin `o` on a wall (map frame), the wall's outward normal
 * `n` (horizontal). s runs along the wall (to the right seen from outside), z up.
 */
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
    // the side faces point away from the shape's interior in (s, z)
    part.quad(onFace(f, a[0], a[1], d0), onFace(f, b[0], b[1], d0), onFace(f, b[0], b[1], d1), onFace(f, a[0], a[1], d1))
  }
}
/** An arch-headed opening's outline: jambs from z0, a semicircle on top. */
export function archShape(sc: number, w: number, z0: number, zs: number, segs = 10): XY[] {
  const r = w / 2
  return [[sc - r, z0], [sc + r, z0], ...arc(sc, zs, r, 0, 180, segs)]
}
/** Face frame of edge i of a counter-clockwise ring, origin at the edge's middle. */
export function edgeFace(r: XY[], i: number, z = 0): { f: Face; len: number } {
  const a = r[i], b = r[(i + 1) % r.length]
  return { f: { o: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z], n: outward(a, b) }, len: Math.hypot(b[0] - a[0], b[1] - a[1]) }
}
/** A surface of revolution about a vertical axis from (r, z) profile points, bottom to top. */
export function lathe(part: Part, cx: number, cy: number, prof: [number, number][], segs: number, a0 = 0, a1 = 360) {
  const full = Math.abs(a1 - a0 - 360) < 1e-6
  const ring = (r: number, z: number): V3[] => arc(cx, cy, r, a0, a1, segs).map((p) => [p[0], p[1], z])
  for (let k = 0; k + 1 < prof.length; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const b = ring(r0, z0), t = ring(r1, z1)
    // smooth normals from the profile's slope
    const dz = z1 - z0, dr = r1 - r0, L = Math.hypot(dz, dr) || 1
    for (let i = 0; i < segs; i++) {
      const aA = ((a0 + ((a1 - a0) * i) / segs) * Math.PI) / 180, aB = ((a0 + ((a1 - a0) * (i + 1)) / segs) * Math.PI) / 180
      const nA: V3 = [(Math.cos(aA) * dz) / L, (Math.sin(aA) * dz) / L, -dr / L], nB: V3 = [(Math.cos(aB) * dz) / L, (Math.sin(aB) * dz) / L, -dr / L]
      if (r1 > 1e-6) {
        part.tri(b[i], b[i + 1], t[i + 1], undefined, undefined, undefined, [nA, nB, nB])
        part.tri(b[i], t[i + 1], t[i], undefined, undefined, undefined, [nA, nB, nA])
      } else part.tri(b[i], b[i + 1], t[i], undefined, undefined, undefined, [nA, nB, [0, 0, 1]])
    }
    void full
  }
}
/** A gable roof over the rectangle x0..x1, |y - yc| <= w, ridge along x, with gable-end walls. */
export function gableX(roof: Part, wall: Part, x0: number, x1: number, yc: number, w: number, ze: number, zr: number, ends: [boolean, boolean] = [true, true]) {
  roof.quad([x0, yc - w, ze], [x1, yc - w, ze], [x1, yc, zr], [x0, yc, zr])
  roof.quad([x1, yc + w, ze], [x0, yc + w, ze], [x0, yc, zr], [x1, yc, zr])
  if (ends[0]) wall.tri([x0, yc + w, ze], [x0, yc - w, ze], [x0, yc, zr])
  if (ends[1]) wall.tri([x1, yc - w, ze], [x1, yc + w, ze], [x1, yc, zr])
}
export function finishGlb(name: string, parts: { part: Part; material: Swatch }[], extras: Record<string, unknown>, maxTri = 5000) {
  const live = parts.filter((p) => p.part.triangles)
  const triangles = live.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb(name, live, { license: 'CC0-1.0', elevation: 0, frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground', ...extras })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  return { glb, triangles }
}

// ================================================================ the model

function build() {
  const brick = new Part(), trim = new Part(), tile = new Part(), copper = new Part(), win = new Part(), roof = new Part()
  const W = (f: Face, poly: XY[]) => flatShape(win, f, poly, 0.05)

  // ---- towers: 7.8 m square, x -33.4..-25.6, |y| 10.6..18.4
  const TW = 7.8, TH = TW / 2, REC = 0.45
  const H = { arch: 28.4, band0: 30.6, band1: 31.4, corn0: 36.3, corn: 37.5, belfry: 42.5 }
  for (const sy of [-1, 1]) {
    const cx = -29.5, cy = sy * 14.5
    // the core, recessed behind the blind arches, to the band
    const core = rect(cx - TH + REC, cy - TH + REC, cx + TH - REC, cy + TH - REC)
    prism(brick, null, core, 0, H.band0)
    // above the arches the shaft is full width up to the cornice
    prism(brick, null, rect(cx - TH, cy - TH, cx + TH, cy + TH), H.band0, H.corn0)
    // white band and cornice, standing a little proud
    prism(trim, null, chamfer(rect(cx - TH - 0.12, cy - TH - 0.12, cx + TH + 0.12, cy + TH + 0.12), 0.2), H.band0, H.band1)
    prism(trim, trim, chamfer(rect(cx - TH - 0.3, cy - TH - 0.3, cx + TH + 0.3, cy + TH + 0.3), 0.3), H.corn0, H.corn)
    // each face: corner piers and pilasters, the arch band with three semicircular heads
    const faces: { f: Face; half: number }[] = [
      { f: { o: [cx - TH + REC, cy, 0], n: [-1, 0] }, half: TH },
      { f: { o: [cx + TH - REC, cy, 0], n: [1, 0] }, half: TH },
      { f: { o: [cx, cy - TH + REC, 0], n: [0, -1] }, half: TH - REC },
      { f: { o: [cx, cy + TH - REC, 0], n: [0, 1] }, half: TH - REC },
    ]
    const bays = [-2.0, 0, 2.0], bw = 1.4
    for (const { f, half } of faces) {
      const piers: [number, number][] = [[-half, -2.7], [-1.3, -0.7], [0.7, 1.3], [2.7, half]]
      for (const [a, b] of piers) extrudeShape(brick, f, [[a, 0], [b, 0], [b, H.arch], [a, H.arch]], 0, REC)
      // the band over the arches: a solid strip with three semicircular notches
      const band: XY[] = [[half, H.arch], [half, H.band0], [-half, H.band0], [-half, H.arch]]
      for (const c of bays) band.push([c - bw / 2, H.arch], ...arc(c, H.arch, bw / 2, 180, 0, 8).slice(1, -1), [c + bw / 2, H.arch])
      extrudeShape(brick, f, band, 0, REC)
      // the white base course
      extrudeShape(trim, f, [[-half, 0], [half, 0], [half, 1.6], [-half, 1.6]], REC, REC + 0.06, false)
    }
    // belfry: white stone stage with an arched opening on each face
    const BH = 2.9
    prism(trim, null, chamfer(rect(cx - BH, cy - BH, cx + BH, cy + BH), 0.3), H.corn, H.belfry)
    prism(trim, trim, chamfer(rect(cx - BH - 0.25, cy - BH - 0.25, cx + BH + 0.25, cy + BH + 0.25), 0.25), H.belfry - 0.6, H.belfry)
    for (const n of [[-1, 0], [1, 0], [0, -1], [0, 1]] as XY[]) {
      W({ o: [cx + n[0] * BH, cy + n[1] * BH, 0], n }, archShape(0, 1.5, H.corn + 0.8, H.corn + 3.3))
    }
    // corner pedestals on the shaft's cornice
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = cx + dx * (TH - 0.55), py = cy + dy * (TH - 0.55)
      prism(trim, trim, chamfer(rect(px - 0.55, py - 0.55, px + 0.55, py + 0.55), 0.15), H.corn, H.corn + 2.0)
    }
    // copper dome and lantern
    lathe(copper, cx, cy, [[2.75, H.belfry], [2.7, 43.3], [2.45, 44.3], [1.95, 45.2], [1.25, 45.9], [0.55, 46.3]], 12)
    lathe(copper, cx, cy, [[0.55, 46.3], [0.55, 47.6], [0.75, 47.6], [0.3, 48.5], [0.18, 49.5], [0, 49.6]], 8)
  }

  // ---- the west front between the towers, x -33.0, |y| <= 10.6
  const FX = -33.0, FB = -31.6, FH = 19.5
  prism(brick, null, rect(FX, -10.6, FB, 10.6), 0, 15.8)
  prism(trim, trim, rect(FX - 0.3, -10.6, FB, 10.6), 15.8, 17.0) // main cornice
  prism(trim, trim, rect(FX, -10.6, FB, 10.6), 17.0, FH) // attic
  // pediment over the centre, with the gable's tympanum
  const ped: XY[] = [[-5.8, FH], [5.8, FH], [0, 22.5]]
  const front: Face = { o: [FX, 0, 0], n: [-1, 0] }
  extrudeShape(trim, front, ped.map(([s, z]) => [s, z] as XY), -1.4, 0)
  // the great arch: white stone surround, lunette, doors
  const AR = 3.8, AO = 5.3, AS = 7.9
  const surround: XY[] = [[-AO, 0], [-AR, 0], [-AR, AS], ...arc(0, AS, AR, 180, 0, 12).slice(1, -1), [AR, AS], [AR, 0], [AO, 0], [AO, AS], ...arc(0, AS, AO, 0, 180, 12).slice(1, -1), [-AO, AS]]
  extrudeShape(trim, front, surround, 0, 0.35)
  W(front, archShape(0, 2 * (AR - 0.3), 7.3, AS))
  extrudeShape(trim, front, [[-AR, 5.4], [AR, 5.4], [AR, 6.5], [-AR, 6.5]], 0, 0.12)
  W(front, [[-3.2, 0.6], [3.2, 0.6], [3.2, 5.2], [-3.2, 5.2]])
  // the side bays: an arched window each over a door
  for (const s of [-8.0, 8.0]) {
    W(front, archShape(s, 1.6, 8.6, 12.6))
    W(front, [[s - 1.0, 0.6], [s + 1.0, 0.6], [s + 1.0, 4.6], [s - 1.0, 4.6]])
  }

  // ---- nave and aisles, x -31.6..-10.5
  const NX0 = FB, NX1 = -10.5, NW = 9.0, NE = 17.5, NR = 21.5, AW = 11.8, AH = 11.5
  prism(brick, null, rect(NX0, -NW, NX1, NW), 0, NE)
  gableX(tile, brick, NX0, NX1, 0, NW, NE, NR, [false, false])
  prism(brick, roof, rect(NX0, -10.6, -25.6, 10.6), 0, NE)
  for (const sy of [-1, 1]) {
    const y0 = sy < 0 ? -AW : NW, y1 = sy < 0 ? -NW : AW
    prism(brick, roof, rect(-25.6, y0, NX1, y1), 0, AH)
    // aisle windows and the clerestory over them
    const af: Face = { o: [0, sy * AW, 0], n: [0, sy] }, cf: Face = { o: [0, sy * NW, 0], n: [0, sy] }
    for (const x of [-22.3, -17.8, -13.3]) {
      const s = -sy * x // s runs along t = (-n.y, n.x)
      W(af, archShape(s, 1.6, 3.6, 8.2))
      W(cf, archShape(s, 2.0, 12.0, 15.3))
    }
  }

  // ---- crossing, x -10.5..13, |y| <= 14.8, flat at 21
  const CX0 = -10.5, CX1 = 13.0, CW = 14.8, CH = 21.0
  prism(brick, roof, rect(CX0, -CW, CX1, CW), 0, CH - 0.8)
  prism(trim, roof, rect(CX0, -CW, CX1, CW), CH - 0.8, CH)
  // rounded transept ends, 7 m radius about (3, ±14)
  for (const sy of [-1, 1]) {
    const ring = ccw(sy < 0 ? arc(3, -14, 7, 180, 360, 10) : arc(3, 14, 7, 0, 180, 10))
    prism(brick, null, ring, 0, 17.2, 25)
    prism(trim, roof, ring, 17.2, 18.4, 25)
    for (let k = 3; k <= 6; k++) {
      // arc points k..k+1 form facet k of the arc (ring order may be reversed: find it by position)
      const a0 = sy < 0 ? 180 + k * 18 : k * 18, a1 = a0 + 18
      const p0: XY = [3 + 7 * Math.cos((a0 * Math.PI) / 180), sy * 14 + 7 * Math.sin((a0 * Math.PI) / 180) * 1]
      const p1: XY = [3 + 7 * Math.cos((a1 * Math.PI) / 180), sy * 14 + 7 * Math.sin((a1 * Math.PI) / 180)]
      const n = outward(p0, p1), m: V3 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, 0]
      // outward() assumes counter-clockwise; the arc runs counter-clockwise in both halves
      W({ o: m, n }, archShape(0, 1.5, 7.5, 13.5, 8))
    }
  }

  // ---- choir, x 13..25, |y| <= 8.5, and the apse about (25, 0), r 8.5
  const QW = 8.5, QE = 21.5, QR = 24.5, QX = 25.0
  prism(brick, null, rect(CX1, -QW, QX, QW), CH - 1, QE)
  gableX(tile, brick, CX1, QX, 0, QW, QE, QR, [true, false])
  prism(brick, null, rect(CX1, -QW, QX, QW), 0, CH - 1)
  const apse = ccw([...arc(QX, 0, QW, -90, 90, 9)])
  for (let i = 0; i < apse.length - 1; i++) {
    wallEdge(brick, apse, i, 0, 19.8, 25)
    wallEdge(trim, apse, i, 19.8, 21.0, 25)
  }
  // half-cone copper roof over the apse, rising to the choir's ridge
  for (let i = 0; i < apse.length - 1; i++) {
    const a = apse[i], b = apse[i + 1]
    copper.tri([a[0], a[1], 21.0], [b[0], b[1], 21.0], [QX, 0, QR - 0.1])
  }
  // the apse's tall windows, on its five middle facets
  for (const i of [1, 3, 5, 7]) {
    const { f } = edgeFace(apse, i)
    W(f, archShape(0, 2.3, 6.5, 15.6, 8))
  }
  // a tall window in each choir side wall
  for (const sy of [-1, 1]) W({ o: [19, sy * QW, 0], n: [0, sy] }, archShape(0, 2.0, 12.4, 17.6))

  // ---- low wings flanking the choir (OSM, moved 1 m to -y)
  const wings: XY[][] = [
    rect(9.0, QW, 29.3, 16.1),
    rect(22.3, -18.1, 29.4, -QW),
    rect(8.3, -24.1, 22.3, -QW),
  ]
  for (const r of wings) {
    prism(brick, null, r, 0, 7.6)
    prism(trim, roof, r, 7.6, 8.5)
    // a window per real opening along the long outer side
    const yOut = Math.abs(r[0][1]) > Math.abs(r[2][1]) ? r[0][1] : r[2][1], n: XY = [0, Math.sign(yOut)]
    const f: Face = { o: [(r[0][0] + r[1][0]) / 2, yOut, 0], n }
    const L = r[1][0] - r[0][0], k = Math.max(1, Math.round(L / 4.5))
    for (let j = 0; j < k; j++) {
      const s = -L / 2 + (j + 0.5) * (L / k)
      W(f, archShape(s, 1.4, 2.0, 5.6, 6))
    }
  }

  return finishGlb('St. James Cathedral', [
    { part: brick, material: finish('sjc-brick', 0xe0d0b2) },
    { part: trim, material: PALETTE.trim },
    { part: tile, material: finish('sjc-tile', 0xb98272) },
    { part: copper, material: PALETTE.copper },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
  ], { bearing: 328.8, height: 49.6, replaces: ['way/108384951', 'way/1363023932', 'way/1363023933'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-st-james-cathedral.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
