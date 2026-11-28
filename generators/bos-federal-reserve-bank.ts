/**
 * Federal Reserve Bank of Boston (600 Atlantic Avenue): original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-federal-reserve-bank.ts
 *
 * Hugh Stubbins and Associates, completed 1977; 32 floors. An aluminium-clad
 * office slab hung between two solid end towers (piers) that rise past its
 * top, over an open gap about 30 m high; the slab's broad faces are a
 * "washboard" of deep horizontal sun-shade fins between a solid band at the
 * bottom and a solid band (over a recessed glazed floor) at the top. A low
 * white podium with strip windows and a planted roof (the auditorium and
 * operations wing) fills the block to the east and north.
 *
 * Frame: map frame turned to BEARING 28.5: +y runs along the slab's length
 * (compass 28.5°, NNE), +x across it (compass 118.5°, ESE, towards Fort Point
 * Channel), z up, metres. Origin = the anchor, the centroid of OSM outline
 * way/139974603.
 *
 * Evidence
 * - OSM way/139974603 (outline, 32 levels, height 187, "stone", #EEEEDD);
 *   parts way/240446157 (slab, 30-180 m), way/240446159 (slab core, 182),
 *   way/240446161 and way/240446162 (the two piers, 187), way/240446158
 *   (podium, 15 m), way/240446163 (podium, 10 m), way/240446160 (the low
 *   strip along Atlantic Avenue, 4 m). The OSM outlines sit 2-4 m off the
 *   lidar edges and draw the tower 33 m deep; the lidar is used for the plan.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 1 m grid read in
 *   this frame with tools/lidar_frame.py; the streets round the block are
 *   6.0 m above the box's ground_min (a loading ramp on the south side goes
 *   down to ground_min). Heights below are above the street:
 *   - tower plan x -59..-29 (30 m deep), y -55..7 (62 m long); piers
 *     y -55..-44.5 and -3..7;
 *   - pier roofs 178.2, parapets 179.0 (small objects to 181.2 left out);
 *   - slab parapet 168.2, roof 165.4, a central penthouse to 170.8;
 *   - podium main roof 22.0 (x -15..33), east wing 16.7 (x 33..54), the
 *     strip along Atlantic Avenue 8.0 (x 54..66); trees on the main roof
 *     to ~27; a 22.5 m block on the tower's west side (x -65..-59,
 *     y -37..-19).
 *   The published height (Wikipedia, CTBUH: 614 ft, 187 m) and the OSM 187
 *   are not borne out: the lidar puts the pier parapets 179 m above the
 *   street (antennas to 185). The lidar value is used.
 * - Commons photos, all EVIDENCE:
 *   - "Federal Reserve Bank Building (36344p).jpg", Rhododendrites,
 *     CC BY-SA 4.0: the east face across Fort Point Channel, near-orthographic.
 *     Heights read from it at 5.08 px/m (pier 179 m = 910 px): slab soffit
 *     29.5, bottom band 29.5-41.3, fins 43.3-153.5, glazed floor
 *     153.5-157.5, top band 157.5-168.2; podium 22 m with two window strips;
 *     https://commons.wikimedia.org/wiki/File:Federal_Reserve_Bank_Building_(36344p).jpg
 *   - "Federal Reserve Bank Building (Boston) (54959754982).jpg", ajay_suresh,
 *     CC BY 4.0: the west face from Dewey Square, straight on; the fins, the
 *     two recessed glazed floors under the top band, the open gap with the
 *     podium seen through it;
 *     https://commons.wikimedia.org/wiki/File:Federal_Reserve_Bank_Building_(Boston)_(54959754982).jpg
 *   - "2017 Federal Reserve Bank of Boston Building.jpg", Beyond My Ken,
 *     CC BY-SA 4.0: from the south-west below; the slab hung over the gap, the
 *     pier's blank end face, the fins' depth;
 *     https://commons.wikimedia.org/wiki/File:2017_Federal_Reserve_Bank_of_Boston_Building.jpg
 *   - "Federal Reserve from South Boston.jpg", Beland, public domain: from the
 *     south-east, the podium and its roof garden.
 *     https://commons.wikimedia.org/wiki/File:Federal_Reserve_from_South_Boston.jpg
 *
 * - Published (Wikipedia "Federal Reserve Bank Building (Boston)"): 32 floors,
 *   completed 1977, Hugh Stubbins; office floors rise from a 140 ft bridge;
 *   a four-storey wing; gardens above street level.
 * - Mapterhorn terrain: the streets round the block are flat, but the
 *   terrain dips 4-5 m inside the podium's south half (a loading ramp on
 *   the south side, interpolated under the building). The map puts y = 0
 *   at that low point, so the street is at y = 4.4 (B) and every wall runs
 *   down to y = 0 (terrain check: ok, ok).
 *
 * Estimated: fins drawn one per two floors (13 over the fin zone; the real
 * building has one per floor) so they read at phone size without
 * shimmering, each 1.5 m deep; the lobby block under the slab (0-12 m, set
 * in 3 m), from the Dewey Square photo; the podium's window strips from the
 * channel photo; the roof garden's extent from the lidar's tree returns.
 * Doubts: no photo of the north side of the podium; the space between the
 * tower and the podium (lidar has no returns there) is left open as plaza.
 * No look-only sources were used.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 28.5
const ANCHOR = { lng: -71.053596, lat: 42.352655 }
/** Street level above y = 0 (see the terrain note in the header). */
const B = 4.4

type P2 = [number, number]
const alu = new Part(), win = new Part(), roof = new Part(), garden = new Part(), lobby = new Part()

// ---------- helpers ----------
const area2 = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
function earcut(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), out: [number, number, number][] = []
  let guard = 0
  while (idx.length > 3 && guard++ < 2000) {
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (area2(poly[a], poly[b], poly[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c &&
        area2(poly[a], poly[b], poly[j]) >= 0 && area2(poly[b], poly[c], poly[j]) >= 0 && area2(poly[c], poly[a], poly[j]) >= 0)) continue
      out.push([a, b, c]); idx.splice(k, 1); break
    }
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
function ccw(poly: P2[]): P2[] {
  let A = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; A += a[0] * b[1] - b[0] * a[1] }
  return A < 0 ? [...poly].reverse() : poly
}
function cap(p: Part, poly: P2[], z: number, up = true) {
  for (const [a, b, c] of earcut(poly)) {
    const A: V3 = [...poly[a], z], Bv: V3 = [...poly[b], z], C: V3 = [...poly[c], z]
    if (up) p.tri(A, Bv, C); else p.tri(A, C, Bv)
  }
}
/** Cut every convex corner of an anticlockwise polygon by c. */
function chamfer(poly: P2[], c: number): P2[] {
  const out: P2[] = [], n = poly.length
  for (let i = 0; i < n; i++) {
    const p = poly[(i + n - 1) % n], q = poly[i], r = poly[(i + 1) % n]
    if (area2(p, q, r) > 0 && c > 0) {
      const d1 = Math.hypot(q[0] - p[0], q[1] - p[1]), d2 = Math.hypot(r[0] - q[0], r[1] - q[1])
      out.push([q[0] + ((p[0] - q[0]) * c) / d1, q[1] + ((p[1] - q[1]) * c) / d1])
      out.push([q[0] + ((r[0] - q[0]) * c) / d2, q[1] + ((r[1] - q[1]) * c) / d2])
    } else out.push(q)
  }
  return out
}
/** A prism: walls (each edge to `pick(k)`) and a top cap. */
function prism(poly: P2[], z0: number, z1: number, wall: Part | ((k: number) => Part), top: Part | null, ch = 0.4) {
  const pts = chamfer(ccw(poly), ch)
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length]
    const p = typeof wall === 'function' ? wall(k) : wall
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) cap(top, pts, z1)
  return pts
}
const rect = (x0: number, x1: number, y0: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
/** A flat panel on the wall a→b (anticlockwise order, outside to the right), s0..s1 along it, set out by d. */
function panel(p: Part, a: P2, b: P2, s0: number, s1: number, z0: number, z1: number, d = 0.06) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: P2 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: P2 = [t[1], -t[0]]
  const q = (s: number, z: number): V3 => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z]
  p.quad(q(s0, z0), q(s1, z0), q(s1, z1), q(s0, z1))
}

// ---------- dimensions (header gives the source of each) ----------
const XW = -59, XE = -29 // slab faces (lidar)
const YS0 = -55, YS1 = -44.5, YN0 = -3, YN1 = 7 // piers (lidar)
const PIER = 179.0
const SOFFIT = 29.5, BOT_BAND = 41.3, FIN0 = 43.3, FIN1 = 153.5, GLAZED = 157.5, PARAPET = 168.2, SLAB_ROOF = 165.4
const REC = 1.5 // glass set back behind the face
const NFIN = 13

// ---------- piers ----------
for (const [y0, y1] of [[YS0, YS1], [YN0, YN1]]) prism(rect(XW, XE, y0, y1), 0, B + PIER, alu, roof, 0.5)

// ---------- slab ----------
const SY0 = YS1, SY1 = YN0
// solid bands: full-face boxes (ends meet the piers)
function slabBox(z0: number, z1: number, inset = 0, wall: Part = alu) {
  const xa = XW + inset, xb = XE - inset
  wall.quad([xa, SY1, z0], [xa, SY0, z0], [xa, SY0, z1], [xa, SY1, z1]) // west face (faces -x)
  wall.quad([xb, SY0, z0], [xb, SY1, z0], [xb, SY1, z1], [xb, SY0, z1]) // east face (faces +x)
}
slabBox(B + SOFFIT, B + BOT_BAND)
cap(alu, rect(XW, XE, SY0, SY1), B + SOFFIT, false) // the soffit over the gap
slabBox(B + BOT_BAND, B + FIN0, REC, win)
slabBox(B + FIN1, B + GLAZED, REC, win)
slabBox(B + GLAZED, B + PARAPET)
// ledges where the face steps back to the glass
for (const [z, up] of [[B + BOT_BAND, true], [B + GLAZED, false]] as [number, boolean][]) {
  cap(alu, rect(XW, XW + REC, SY0, SY1), z, up)
  cap(alu, rect(XE - REC, XE, SY0, SY1), z, up)
}
// parapet and roof
{
  const t = 0.8
  alu.quad([XW + t, SY0, B + SLAB_ROOF], [XW + t, SY1, B + SLAB_ROOF], [XW + t, SY1, B + PARAPET], [XW + t, SY0, B + PARAPET])
  alu.quad([XE - t, SY1, B + SLAB_ROOF], [XE - t, SY0, B + SLAB_ROOF], [XE - t, SY0, B + PARAPET], [XE - t, SY1, B + PARAPET])
  cap(alu, rect(XW, XW + t, SY0, SY1), B + PARAPET)
  cap(alu, rect(XE - t, XE, SY0, SY1), B + PARAPET)
  cap(roof, rect(XW + t, XE - t, SY0, SY1), B + SLAB_ROOF)
  prism(rect(-48, -40, -35, -14), B + SLAB_ROOF, B + 170.8, roof, roof, 0.3)
}
// the fin zone: glass set back, one sloped sun-shade per band
{
  const band = (FIN1 - FIN0) / NFIN
  for (const [xf, s] of [[XW, -1], [XE, 1]] as [number, number][]) {
    const xg = xf - s * REC // glass plane
    const face = (x: number, z0: number, z1: number, p: Part) => {
      if (s > 0) p.quad([x, SY0, z0], [x, SY1, z0], [x, SY1, z1], [x, SY0, z1])
      else p.quad([x, SY1, z0], [x, SY0, z0], [x, SY0, z1], [x, SY1, z1])
    }
    for (let i = 0; i < NFIN; i++) {
      const zb = B + FIN0 + i * band, zt = zb + band
      const zs = zb + band * 0.45 // fin soffit: glass shows below it
      face(xg, zb, zs, win)
      // soffit, facing down
      const S0: V3 = [xg, SY0, zs], S1: V3 = [xg, SY1, zs], F0: V3 = [xf, SY0, zs], F1: V3 = [xf, SY1, zs]
      if (s > 0) alu.quad(S0, F0, F1, S1); else alu.quad(S1, F1, F0, S0)
      // short vertical nose, then the sloped top running back to the glass
      const zn = zs + 0.9
      face(xf, zs, zn, alu)
      const N0: V3 = [xf, SY0, zn], N1: V3 = [xf, SY1, zn], T0: V3 = [xg, SY0, zt], T1: V3 = [xg, SY1, zt]
      if (s > 0) alu.quad(N0, N1, T1, T0); else alu.quad(N1, N0, T0, T1)
    }
  }
}

// ---------- lobby under the slab: glazed, with the doors on the Dewey Square side ----------
prism(rect(XW + 3, XE - 3, SY0, SY1), 0, B + 12, win, roof, 0)
slabBox(B + 9.5, B + 12, 3.1, alu)
panel(lobby, [XW + 3, SY1], [XW + 3, SY0], 14, 27.5, B + 0.0, B + 4.5, 0.08)

// ---------- podium ----------
function block(poly: P2[], top: number, strips: [number, number][], skip: (a: P2, b: P2) => boolean = () => false) {
  const pts = prism(poly, 0, B + top, alu, null, 0.4)
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4 || skip(a, b)) continue
    for (const [z0, z1] of strips) panel(win, a, b, 1.2, L - 1.2, B + z0, B + z1)
  }
  return pts
}
const MAIN: P2[] = [[-15, -42], [33, -42], [33, 40], [2, 56], [-26, 64.5], [-46, 70], [-46, 35], [-19, 23], [-15, 21]]
const EAST: P2[] = [[33, -42], [54, -42], [54, 30], [33, 40]]
const STRIP: P2[] = [[54, -36.5], [66, -36.5], [66, 23], [54, 30]]
const WEST: P2[] = [[-65, -37], [XW, -37], [XW, -19], [-65, -19]]
const onTower = (a: P2, b: P2) => Math.abs(a[0] - XW) < 0.6 && Math.abs(b[0] - XW) < 0.6
const shared = (x: number) => (a: P2, b: P2) => Math.abs(a[0] - x) < 0.6 && Math.abs(b[0] - x) < 0.6
for (const [poly, top, strips, skip] of [
  [MAIN, 22.0, [[16.7, 19.6], [11.8, 14.2], [1.0, 7.0]], shared(33)],
  [EAST, 16.7, [[11.8, 14.2], [1.0, 7.0]], (a: P2, b: P2) => shared(54)(a, b)],
  [STRIP, 8.0, [[1.0, 6.2]], () => false],
  [WEST, 22.5, [[16.7, 19.6], [11.8, 14.2]], onTower],
] as [P2[], number, [number, number][], (a: P2, b: P2) => boolean][]) {
  cap(roof, block(poly, top, strips, skip), B + top)
}
// roof garden on the main podium (lidar tree returns), as a raised planted bed
prism([[-22, 22], [6, 14], [8, 42], [-20, 58], [-40, 63], [-42, 40]], B + 22.0, B + 23.2, garden, garden, 0.6)
prism(rect(-10, 28, -36, -20), B + 22.0, B + 22.9, garden, garden, 0.6)

const parts = [
  { part: alu, material: finish('fed-aluminium', 0xd9dcdc) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: garden, material: finish('roof-garden', 0x8a9f7c) },
  { part: lobby, material: PALETTE.entrance },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Federal Reserve Bank of Boston', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: B + PIER,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/139974603', 'way/240446157', 'way/240446158', 'way/240446159', 'way/240446160', 'way/240446161', 'way/240446162', 'way/240446163'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/bos-federal-reserve-bank.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
