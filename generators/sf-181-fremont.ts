/**
 * 181 Fremont, San Francisco — original procedural geometry, CC0-1.0.
 * bun generators/sf-181-fremont.ts
 *
 * Map frame, rotated to the building: +x (u) is the south-east face's outward
 * normal, +y (v) the north-east face's, z up, metres. BEARING 45 (the SoMa
 * grid). Origin = the centre of the tower as the lidar draws it, 3.6 m
 * south-west of the OSM outline's centroid (the OSM outline, way/445566153,
 * sits ~3 m north-east of the lidar's walls and adds an L-shaped notch the
 * tower does not have above the street).
 *
 * Evidence
 * - OSM way/445566153: outline, height 244.4, 57 levels. No parts.
 * - USGS 3DEP lidar (CA_SanFrancisco_1_B23, 2023) at 0.5 m, in the building
 *   frame (/tmp/city/sf/lidar.py): street flat to 1.6 m. Walls (less ~0.4 m
 *   for the max-per-cell bias): u -17.8..22.4, v -21.7..16.0 up to ~150 m;
 *   the south-east and north-east faces lean in above ~100 m, by
 *   2.6 and 3 m at the roof (the other two faces are plumb). Roof a diagonal ridge from the west corner (~231 m) to
 *   the east corner (~225 m), falling to ~216 m at the north and south
 *   corners. Spire tip 250.8 m, ~5 m in from the west corner along its
 *   diagonal; the photos show it as the corner column carried up, so it is
 *   drawn as a blade on the column leaning 1.6 m inward (a compromise).
 * - Published (Wikipedia): 245 m with spire, 56-57 storeys, Heller Manus,
 *   2018; diagonal mega-braces on every face. The lidar tip is ~6 m higher
 *   than the published height; the lidar is used.
 * - Commons photos (daylight): "181 Fremont from Folsom and Fremont.jpg",
 *   "181 Fremont from Salesforce Park.jpg", "181 Fremont Street from Mission
 *   Street.jpg", "181 Fremont.jpg", "181 Fremont 2.jpg" (all Dead.rabbit,
 *   CC BY-SA 4.0), "Salesforce Tower alongside 181 Fremont.jpg" (Yair92002,
 *   CC BY-SA 4.0, from the west, the white frame at distance).
 *
 * The frame, read from those photos: white corner columns full height; a
 * belt at ~72 m and a double belt at ~156-163 m with a shallow V between its two
 * chords; on each face one diagonal per tier zig-zagging between opposite
 * corners, mirrored on neighbouring faces so the diagonals meet in chevrons
 * at the corners. Estimated: the belt heights (from photo proportions,
 * from two photos: ~0.3 and ~0.7 of the height), the member sizes, the glass
 * colour (teal glass pulled light), the 9 m lobby.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const BEARING = 45
// OSM centroid (-122.3953326, 37.7897653) moved by (u 2, v -3) in the building frame.
const ANCHOR = { lng: -122.3953407, lat: 37.7897333 }
// Model coordinates are relative to that centre.
const OU = 2, OV = -3

const glass = new Part(), frame = new Part(), roof = new Part(), lobby = new Part()

// Plan by height. The south-west (-v) and north-west (-u) faces are plumb; the
// south-east (+u) and north-east (+v) faces lean in from ~100 m (lidar).
const U0 = -17.8 - OU, V0 = -21.7 - OV
const BELT1 = 72, BELT2 = 163, BELT2B = 156 // the double belt's lower chord
const LEAN0 = 100 // where the south-east and north-east faces start to lean in
const LOBBY = 9
const ZW = 231, ZE = 225, ZNS = 216 // roof: ridge from the west corner to the east corner
const lean = (z: number, a: number, b: number) => (z <= LEAN0 ? a : a + ((b - a) * (z - LEAN0)) / (ZE - LEAN0))
const U1 = (z: number) => lean(z, 22.4 - OU, 19.8 - OU)
const V1 = (z: number) => lean(z, 16.0 - OV, 13.0 - OV)
// Corners counter-clockwise: 0 W, 1 S, 2 E, 3 N.
const TOPZ = [ZW, ZNS, ZE, ZNS]
const corner = (k: number, z: number): V3 =>
  [[U0, V0], [U1(z), V0], [U1(z), V1(z)], [U0, V1(z)]].map(([u, v]) => [u, v, z] as V3)[k]
const NORMALS: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]] // face k runs corner k -> k+1
/** Face k, fraction f from its left corner, height z, pushed out by o. */
function pt(k: number, f: number, z: number, o = 0): V3 {
  const a = corner(k, z), b = corner((k + 1) % 4, z), n = NORMALS[k]
  return [a[0] + (b[0] - a[0]) * f + n[0] * o, a[1] + (b[1] - a[1]) * f + n[1] * o, z]
}
const width = (k: number, z: number) => { const a = corner(k, z), b = corner((k + 1) % 4, z); return Math.hypot(b[0] - a[0], b[1] - a[1]) }

// --- Walls: lobby, then glass from the lobby to the sloped top. ---
for (let k = 0; k < 4; k++) {
  const l = (k + 1) % 4
  lobby.quad(pt(k, 0, 0), pt(k, 1, 0), pt(k, 1, LOBBY), pt(k, 0, LOBBY))
  glass.quad(pt(k, 0, LOBBY), pt(k, 1, LOBBY), pt(k, 1, LEAN0), pt(k, 0, LEAN0))
  glass.quad(pt(k, 0, LEAN0), pt(k, 1, LEAN0), corner(l, TOPZ[l]), corner(k, TOPZ[k]))
}
// Roof: two planes either side of the west-east ridge, just below the parapet.
{
  const c = [0, 1, 2, 3].map((k) => { const p = corner(k, TOPZ[k]); return [p[0], p[1], p[2] - 0.9] as V3 })
  roof.tri(c[0], c[1], c[2])
  roof.tri(c[0], c[2], c[3])
}

// --- The white frame. ---
/** A flat member on face k from A to B (points on the wall), width w, standing d proud. */
function member(k: number, A: V3, B: V3, w: number, d = 0.45) {
  const n: V3 = [NORMALS[k][0], NORMALS[k][1], 0]
  const D = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]
  // side direction in the wall plane: n x D, normalised
  let sd: V3 = [n[1] * D[2] - n[2] * D[1], n[2] * D[0] - n[0] * D[2], n[0] * D[1] - n[1] * D[0]]
  const sl = Math.hypot(...sd) || 1
  sd = [(sd[0] / sl) * (w / 2), (sd[1] / sl) * (w / 2), (sd[2] / sl) * (w / 2)]
  const at = (p: V3, s: number, o: number): V3 => [p[0] + sd[0] * s + n[0] * o, p[1] + sd[1] * s + n[1] * o, p[2] + sd[2] * s]
  const a0 = at(A, -1, d), b0 = at(B, -1, d), b1 = at(B, 1, d), a1 = at(A, 1, d)
  const A0 = at(A, -1, -0.05), B0 = at(B, -1, -0.05), B1 = at(B, 1, -0.05), A1 = at(A, 1, -0.05)
  // outer face: wind it to face along n
  const e1 = [b0[0] - a0[0], b0[1] - a0[1], b0[2] - a0[2]], e2 = [b1[0] - a0[0], b1[1] - a0[1], b1[2] - a0[2]]
  const fn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  if (fn[0] * n[0] + fn[1] * n[1] >= 0) frame.quad(a0, b0, b1, a1)
  else frame.quad(a0, a1, b1, b0)
  // sides and ends, both windings so a thin member never shows a hole
  for (const [p, q, r, s] of [[A0, B0, b0, a0], [a1, b1, B1, A1], [A0, a0, a1, A1], [b0, B0, B1, b1]] as V3[][]) {
    frame.quad(p, q, r, s)
    frame.quad(p, s, r, q)
  }
}

/** A member given in face coordinates (fraction, height), split where the face bends at LEAN0. */
function memberF(k: number, f0: number, z0: number, f1: number, z1: number, w: number, d = 0.45) {
  if ((z0 - LEAN0) * (z1 - LEAN0) < 0) {
    const t = (LEAN0 - z0) / (z1 - z0), fm = f0 + (f1 - f0) * t
    member(k, pt(k, f0, z0), pt(k, fm, LEAN0), w, d)
    member(k, pt(k, fm, LEAN0), pt(k, f1, z1), w, d)
  } else member(k, pt(k, f0, z0), pt(k, f1, z1), w, d)
}

const COL = 2.6 // corner column width on each face
const DIAG = 2.0, BELT = 1.8
for (let k = 0; k < 4; k++) {
  const l = (k + 1) % 4
  const cf = (z: number) => COL / 2 / width(k, z) // the column's centreline as a fraction of the face
  // Corner columns, full height to the roof line.
  memberF(k, cf(LOBBY - 3), LOBBY - 3, cf(TOPZ[k]), TOPZ[k] - 0.5, COL, 0.6)
  memberF(k, 1 - cf(LOBBY - 3), LOBBY - 3, 1 - cf(TOPZ[l]), TOPZ[l] - 0.5, COL, 0.6)
  // Belts: the lower belt, the double belt with its shallow V, and a band over the lobby.
  for (const [z, w] of [[LOBBY + 0.4, 1.2], [BELT1, BELT], [BELT2B, BELT], [BELT2, BELT * 0.8]] as [number, number][]) {
    member(k, pt(k, 0, z), pt(k, 1, z), w, 0.5)
  }
  member(k, pt(k, cf(BELT2), BELT2 - 0.3), pt(k, 0.5, BELT2B + 0.6), 1.3, 0.45)
  member(k, pt(k, 0.5, BELT2B + 0.6), pt(k, 1 - cf(BELT2), BELT2 - 0.3), 1.3, 0.45)
  // Diagonals: one a tier, zig-zagging so their nodes sit at the west and east corners at the
  // top and at the lower belt, and at the north and south corners at the upper belt and the base.
  // Faces 0 and 2 start at their left corner (W, E); faces 1 and 3 at their right (E, W).
  const hi = (f: number) => (k % 2 === 0 ? f : 1 - f) // fraction measured from the high corner
  const topHi = k % 2 === 0 ? TOPZ[k] : TOPZ[l]
  member(k, pt(k, hi(cf(topHi)), topHi - 1.5), pt(k, hi(1 - cf(BELT2)), BELT2), DIAG)
  memberF(k, hi(1 - cf(BELT2B)), BELT2B, hi(cf(BELT1)), BELT1, DIAG)
  member(k, pt(k, hi(cf(BELT1)), BELT1), pt(k, hi(1 - cf(LOBBY)), LOBBY + 0.4), DIAG)
  // Parapet along the sloped top.
  member(k, pt(k, 0, TOPZ[k] - 0.7), pt(k, 1, TOPZ[l] - 0.7), 1.4, 0.4)
}

// --- Spire: the west corner column carried up as a tapering blade. ---
{
  const x0 = U0 - 0.6, y0 = V0 - 0.6, x1 = U0 + 2.6, y1 = V0 + 2.6, z0 = ZW - 4, z1 = 250.8
  const base: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]
  const tip: V3 = [U0 + 1.6, V0 + 1.6, z1] // a little in from the corner, towards where the lidar puts the tip
  for (let i = 0; i < 4; i++) frame.tri(base[i], base[(i + 1) % 4], tip)
}

const parts = [
  { part: glass, material: windowVariant(2, 0x98b6bb) },
  { part: frame, material: finish('frame-white', 0xf1f1ec) },
  { part: roof, material: PALETTE.roof },
  { part: lobby, material: { ...PALETTE.entrance, color: 0x7f8e95 } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('181 Fremont', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: 250.8,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/445566153'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-181-fremont.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
