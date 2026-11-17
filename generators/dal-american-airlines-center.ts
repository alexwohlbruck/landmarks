/**
 * American Airlines Center, Victory Park, Dallas (2001, David M. Schwarz
 * Architects with HKS) — procedural, CC0-1.0.
 * bun generators/dal-american-airlines-center.ts
 *
 * What makes it the AAC: a red-brown brick box on a limestone base, with a
 * great brick arch, glazed under it, in the middle of every face: on the
 * two ends a 28 m wing between two towers, and on the two long sides a
 * longer wing between two more; square brick corner towers with arched
 * windows; and over it all a white groin-vaulted roof, two crossing
 * barrels whose ribbed, pale end walls (lunettes) rise over each arch.
 *
 * Frame: built turned to bearing 325°, so +y runs along the long axis to
 * the north-west end and +x to the north-east side (the axis of the OSM
 * outline and parts). The anchor is the area centroid of OSM way/25312698,
 * -96.8102794 32.7904850. The site is flat (Mapterhorn varies 0.4 m over
 * the footprint), so y = 0 is the street and `elevation` is 0.
 *
 * Plan: OSM building:part ways (2026), all within a metre of the lidar's
 * edges: the main block way/1492851072 (112 by 142 m); the end wings
 * way/1492851075-76 (55 m wide, 17 m deep, 8 m proud of the main block);
 * the side wings way/1492851073-74 (83 m long, 12.5 m deep, 5 m proud); the
 * four corner towers (11.3 m square, relations 20375631-38 with their ways);
 * the two 14 m annexes at the south-east corners way/1492851058, -63; the
 * two crossing barrels way/1492851077 (across, 100 by 115 m) and
 * way/1492851078 (along, 85 by 129 m).
 *
 * Heights, measured from USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018
 * flight), 1 m grid, read in this frame with tools/lidar_frame.py, above the
 * street (1.7 m over the grid's ground_min): main block parapet 22.3 m;
 * corner towers 24.5 m (OSM 24-25); end and side wings 28.5 m; the towers
 * framing each wing 31 m; the barrel along the axis crowns at 35.5 m with a
 * radius of 73 m (fitted to the lidar profile across it); the barrel across
 * crowns at 37.0 m with a radius of 130 m; their ends carry a lip about
 * 1.3-2 m proud of the roof. The two barrels' intersection (the groin) is
 * where the lidar shows the roof's creases, as does the NAIP aerial.
 *
 * Estimated from the photos (scaled from the lidar widths): the arches,
 * semicircles of 18.6 m (end wings, nearly filling the 39 m between their
 * towers) and 21 m (side wings, about a third of the long wall), springing
 * 7.8 and 5.5 m up, so their crowns are at 26.4-26.5 m, just under the
 * 28.5 m parapet, as the photos show; their glazing a grid of light glass
 * (five stone mullions, two or three transoms) over a limestone entrance
 * 8 m high; the limestone base 4.5 m (a storey); brick up to the wings'
 * parapet; pale stone tops on the towers, 1.5-2 m; the tall window groups
 * beside the side arches and on the main block; the corner towers' arched
 * windows; the lunettes as pale roof ends with fine light louvres every
 * 2.8 m (the photos show narrow pale fins with glass between, no large
 * windows).
 *
 * Photos (Wikimedia Commons), compared against the renders:
 * - "American Airlines Center August 2015.jpg", Michael Barera, CC BY-SA
 *   4.0: a long side, its arch, wing towers, lunette and the barrels' ends;
 * - "Dallas November 2018 2 (American Airlines Center).jpg", Michael
 *   Barera, CC BY-SA 4.0: the south-east end from Victory Plaza at night;
 * - "American Airlines Center 01.jpg" and "... 02.jpg", Joe Mabel, CC BY-SA
 *   3.0: the north-west end from the Katy Trail, the corner towers' arched
 *   windows; the south-east end from the plaza;
 * - "American Airlines Center Dallas.JPG", NoTalkMan, CC0: an end and a
 *   side in low sun, the brick colour;
 * - "American Airlines Center West Entrance.jpg", The World's Signature,
 *   CC BY-SA 4.0: a long side at dusk, the lit arch;
 * - "American Airlines Center (6246886325).jpg", Jeff Attaway, CC BY 2.0:
 *   from above, the white roof, the lunettes, the towers;
 * - "20141012 American Airlines Center.jpg", peroloffor, CC BY 2.0: the arch
 *   and its glazing close up.
 * - Plan and roof: USGS NAIP orthophoto (public domain).
 *
 * Left out: the AA logos and lettering, the banners hung in the arches, the
 * flagpoles, the thin limestone pilaster strips on the brick, the plazas.
 *
 * Doubts: the arch radii and springing heights are scaled from perspective
 * photos (±2 m); the corner towers' arched windows and the window groups
 * are drawn to a regular rhythm, not counted; the side arches are taken as
 * the same on both long sides (both photographed, but not square on).
 * Terrain: `bun tools/terrain.ts check` (bearing 325, elevation 0) prints
 * "ok: no visible top above y 0.2 m is buried more than 0.15 m (16923.2 m²
 * checked)".
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const brick = new Part(), stone = new Part(), white = new Part(), win = new Part(), door = new Part(), glaze = new Part()
const flat = stone // the flat roofs: pale, as in the NAIP aerial, but apart from the white vault

// ---------------------------------------------------------------- helpers
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function face(p: Part, P: V3[], hint: V3, normals?: V3[]) {
  let n: V3 = [0, 0, 0]
  for (let i = 1; i < P.length - 1; i++) {
    const c = cross(sub(P[i], P[0]), sub(P[i + 1], P[0]))
    n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]
  }
  const flip = dot(n, hint) < 0
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[0], b = P[i], c = P[i + 1]
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-7) continue
    const na = normals && [normals[0], normals[i], normals[i + 1]]
    if (flip) p.tri(a, c, b, undefined, undefined, undefined, na && [na[0], na[2], na[1]])
    else p.tri(a, b, c, undefined, undefined, undefined, na)
  }
}
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p) {
  face(p, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [-1, 0, 0])
  face(p, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], [1, 0, 0])
  face(p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [0, -1, 0])
  face(p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0])
  if (top) face(top, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1])
}
/** A brick mass on a limestone base, with an optional stone cap and a stone coping. */
const BASE = 4.5
function mass(x0: number, x1: number, y0: number, y1: number, top: number, cap = 0, roofPart: Part = flat) {
  box(stone, x0 - 0.25, x1 + 0.25, y0 - 0.25, y1 + 0.25, 0, BASE, null)
  box(brick, x0, x1, y0, y1, BASE, top - cap - 0.6, null)
  if (cap) box(stone, x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15, top - cap - 0.6, top - 0.6, null)
  box(stone, x0 - 0.35, x1 + 0.35, y0 - 0.35, y1 + 0.35, top - 0.6, top, null)
  face(roofPart, [[x0 - 0.35, y0 - 0.35, top], [x1 + 0.35, y0 - 0.35, top], [x1 + 0.35, y1 + 0.35, top], [x0 - 0.35, y1 + 0.35, top]], [0, 0, 1])
}
/**
 * A wall frame on a vertical face: `o` a point on the face, `u` the unit
 * direction along it, `n` its outward normal (both horizontal). Points are
 * (along, z, out).
 */
type Frame = { o: XY; u: XY; n: XY }
const P = (f: Frame, a: number, z: number, out: number): V3 => [f.o[0] + f.u[0] * a + f.n[0] * out, f.o[1] + f.u[1] * a + f.n[1] * out, z]
const hintOf = (f: Frame): V3 => [f.n[0], f.n[1], 0]
function rect(p: Part, f: Frame, a0: number, a1: number, z0: number, z1: number, out = 0.06) {
  face(p, [P(f, a0, z0, out), P(f, a1, z0, out), P(f, a1, z1, out), P(f, a0, z1, out)], hintOf(f))
}
/** An arch-headed panel: width 2r centred at `a`, straight up to `zs`, a semicircle above. */
function archPanel(p: Part, f: Frame, a: number, r: number, z0: number, zs: number, out = 0.06, seg = 10) {
  if (zs > z0) rect(p, f, a - r, a + r, z0, zs, out)
  for (let k = 0; k < seg; k++) {
    const t0 = (Math.PI * k) / seg, t1 = (Math.PI * (k + 1)) / seg
    face(p, [P(f, a, zs, out), P(f, a + r * Math.cos(t0), zs + r * Math.sin(t0), out), P(f, a + r * Math.cos(t1), zs + r * Math.sin(t1), out)], hintOf(f))
  }
}
/** A semicircular ring (archivolt) standing `d` proud of the face, radii r0 < r1. */
function archRing(p: Part, f: Frame, a: number, r0: number, r1: number, zs: number, d: number, seg = 12) {
  const pt = (r: number, t: number, o: number) => P(f, a + r * Math.cos(t), zs + r * Math.sin(t), o)
  for (let k = 0; k < seg; k++) {
    const t0 = (Math.PI * k) / seg, t1 = (Math.PI * (k + 1)) / seg
    face(p, [pt(r0, t0, d), pt(r1, t0, d), pt(r1, t1, d), pt(r0, t1, d)], hintOf(f))
    const tm = (t0 + t1) / 2
    const outN: V3 = [f.u[0] * Math.cos(tm), f.u[1] * Math.cos(tm), Math.sin(tm)]
    face(p, [pt(r1, t0, 0), pt(r1, t1, 0), pt(r1, t1, d), pt(r1, t0, d)], outN)
    face(p, [pt(r0, t0, 0), pt(r0, t1, 0), pt(r0, t1, d), pt(r0, t0, d)], [-outN[0], -outN[1], -outN[2]])
  }
  // the ring's feet
  for (const s of [-1, 1]) {
    const lo = Math.min(a + s * r0, a + s * r1), hi = Math.max(a + s * r0, a + s * r1)
    face(p, [P(f, lo, zs, 0), P(f, hi, zs, 0), P(f, hi, zs, d), P(f, lo, zs, d)], [0, 0, -1])
  }
}

// ---------------------------------------------------------------- dimensions
const YC = 0.8 // the building's middle along its axis
const MX = 56, MY = 71.1, MH = 22.3 // main block half-sizes, parapet
const WH = 28.5, TH = 31 // wings, wing towers
const EW = 27.5, EY0 = 62.4, EY1 = 79.3 // end wings: half-width, from/to (about YC)
const SX0 = 48.4, SX1 = 60.8, SY = 41.5 // side wings
const ET0 = 19.5 // end-wing towers from |x| = 19.5 to 27.5
const ST0 = 33.5 // side-wing towers from |y - YC| = 33.5 to 41.5
const CT = { x0: 46.2, x1: 57.6, y0: 61, y1: 72.4, h: 24.5 } // corner towers (about YC, mirrored)

// ---------------------------------------------------------------- masses
mass(-MX, MX, YC - MY, YC + MY, MH)
for (const s of [1, -1]) {
  // end wings and their towers
  const ya = YC + s * EY0, yb = YC + s * EY1
  mass(-ET0, ET0, Math.min(ya, yb), Math.max(ya, yb), WH)
  for (const sx of [1, -1]) {
    const xa = sx * ET0, xb = sx * EW
    mass(Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb), Math.max(ya, yb), TH, 2)
  }
  // side wings and their towers
  const xa = s * SX0, xb = s * SX1
  mass(Math.min(xa, xb), Math.max(xa, xb), YC - ST0, YC + ST0, WH)
  for (const sy of [1, -1]) {
    const y0 = YC + sy * ST0, y1 = YC + sy * SY
    mass(Math.min(xa, xb), Math.max(xa, xb), Math.min(y0, y1), Math.max(y0, y1), TH, 2)
  }
  // corner towers
  for (const sy of [1, -1]) {
    const x0 = s * CT.x0, x1 = s * CT.x1, y0 = YC + sy * CT.y0, y1 = YC + sy * CT.y1
    mass(Math.min(x0, x1), Math.max(x0, x1), Math.min(y0, y1), Math.max(y0, y1), CT.h, 1.5)
  }
}
// the 14 m annexes at the south-east corners (OSM, lidar)
for (const [a, b] of [[-46, -27.5], [27.5, 46]]) mass(a, b, -74.8, YC - MY, 14)

// ---------------------------------------------------------------- facades
/** The arch, its glazing over a limestone entrance, and the window groups either side. */
function archFace(f: Frame, half: number, r: number, zs: number, top: number, towers: number) {
  const ri = r - 1.6, SZ = 8 // the glazing's radius; the stone entrance's top
  // light glazing under the arch, above the stone entrance
  archPanel(glaze, f, 0, ri, SZ, zs, 0.06, 14)
  // the limestone entrance front, its doors, and the glazing's stone mullions
  rect(stone, f, -ri, ri, BASE, SZ, 0.12)
  rect(door, f, -(ri - 2.5), ri - 2.5, 0.3, 4.8, 0.3)
  // a grid of stone mullions and transoms across the glazing
  for (const k of [-2, -1, 0, 1, 2]) {
    const a = (k * ri) / 3, zt = zs + Math.sqrt(ri * ri - a * a)
    rect(stone, f, a - 0.45, a + 0.45, SZ, zt, 0.14)
  }
  for (const q of [0.3, 0.62]) {
    const zm = zs + q * ri, am = Math.sqrt(ri * ri - (zm - zs) ** 2)
    rect(stone, f, -am, am, zm - 0.35, zm + 0.35, 0.14)
  }
  if (zs > SZ + 1) rect(stone, f, -ri, ri, (SZ + zs) / 2 - 0.35, (SZ + zs) / 2 + 0.35, 0.14)
  // the brick archivolt, proud of the wall
  archRing(brick, f, 0, ri, r, zs, 0.8)
  // tall window groups between the arch and the towers
  const free0 = r + 1.5, free1 = towers - 1.2
  const n = Math.floor((free1 - free0) / 4.2)
  const w = (free1 - free0) / n
  for (const s of [-1, 1])
    for (let k = 0; k < n; k++) {
      const a0 = free0 + k * w + 0.8, a1 = free0 + (k + 1) * w - 0.8
      rect(win, f, s > 0 ? a0 : -a1, s > 0 ? a1 : -a0, BASE + 2, top - 4)
    }
  // ground-floor windows in the base, either side of the doors
  if (towers - 1 - (r + 0.5) > 1.5) for (const s of [-1, 1]) rect(win, f, s > 0 ? r + 0.5 : -(towers - 1), s > 0 ? towers - 1 : -(r + 0.5), 1.5, 5, 0.31)
}
for (const s of [1, -1]) {
  // ends: the face at y = YC ± EY1, looking out along ±y
  archFace({ o: [0, YC + s * EY1], u: [-s, 0], n: [0, s] }, ET0, 18.6, 7.8, WH, ET0)
  // sides: the face at x = ±SX1
  archFace({ o: [s * SX1, YC], u: [0, s], n: [s, 0] }, ST0, 21, 5.5, WH, ST0)
}

// window groups on the main block's walls and the towers' arched windows
for (const s of [1, -1]) {
  // long walls, between the side wing towers and the corner towers
  const fL: Frame = { o: [s * MX, YC], u: [0, s], n: [s, 0] }
  for (const sy of [1, -1])
    for (let a = SY + 3; a < CT.y0 - 3; a += 5.6) rect(win, fL, sy > 0 ? a : -(a + 2.4), sy > 0 ? a + 2.4 : -a, BASE + 2, MH - 3.5)
  // end walls, between the end wings and the corner towers
  const fE: Frame = { o: [0, YC + s * MY], u: [-s, 0], n: [0, s] }
  for (const sx of [1, -1])
    for (let a = EW + 3; a < CT.x0 - 3; a += 5.6) rect(win, fE, sx > 0 ? a : -(a + 2.4), sx > 0 ? a + 2.4 : -a, BASE + 2, MH - 3.5)
  // wing towers and corner towers: one arched window on each outer face
  for (const sy of [1, -1]) {
    const cx = s * (CT.x0 + CT.x1) / 2, cy = YC + sy * (CT.y0 + CT.y1) / 2
    archPanel(win, { o: [s * CT.x1, cy], u: [0, s], n: [s, 0] }, 0, 2.2, 10, 16)
    archPanel(win, { o: [cx, YC + sy * CT.y1], u: [-sy, 0], n: [0, sy] }, 0, 2.2, 10, 16)
    // side wing towers: a tall slot on the face, as the photos' balconied window
    rect(win, { o: [s * SX1, YC + sy * (ST0 + SY) / 2], u: [0, s], n: [s, 0] }, -1.6, 1.6, BASE + 3, TH - 6)
  }
  for (const sx of [1, -1]) rect(win, { o: [sx * (ET0 + EW) / 2, YC + s * EY1], u: [-s, 0], n: [0, s] }, -1.6, 1.6, BASE + 3, TH - 6)
}

// ---------------------------------------------------------------- the roof
const LR = 73, LC = 35.5, LX = 42, LY = 64.5 // the barrel along the axis
const CR = 130, CC = 37.0, CX_ = 50, CY_ = 57.5 // the barrel across
const L = (x: number) => LC - (LR - Math.sqrt(LR * LR - x * x))
const C = (y: number) => CC - (CR - Math.sqrt(CR * CR - (y - YC) ** 2))
const nL = (x: number): V3 => [x / LR, 0, Math.sqrt(LR * LR - x * x) / LR]
const nC = (y: number): V3 => [0, (y - YC) / CR, Math.sqrt(CR * CR - (y - YC) ** 2) / CR]
/** |y - YC| where the across barrel drops to the height of the along barrel at x. */
const yCrease = (x: number) => { const d = CR - (CC - L(x)); return Math.sqrt(Math.max(0, CR * CR - d * d)) }
const xCrease = (y: number) => { const h = C(y); if (h >= LC) return 0; const d = LR - (LC - h); return Math.sqrt(Math.max(0, LR * LR - d * d)) }
{
  const nx = 16
  // along barrel: strips across x, from the crease out to each end
  for (let i = 0; i < nx; i++) {
    const x0 = -LX + (2 * LX * i) / nx, x1 = -LX + (2 * LX * (i + 1)) / nx
    for (const s of [1, -1]) {
      const a0 = YC + s * yCrease(x0), a1 = YC + s * yCrease(x1), e = YC + s * LY
      face(white, [[x0, a0, L(x0)], [x1, a1, L(x1)], [x1, e, L(x1)], [x0, e, L(x0)]], [0, 0, 1], [nL(x0), nL(x1), nL(x1), nL(x0)])
    }
  }
  // across barrel: strips along y, from the crease out to each end
  const ny = 18
  for (let j = 0; j < ny; j++) {
    const y0 = YC - CY_ + (2 * CY_ * j) / ny, y1 = YC - CY_ + (2 * CY_ * (j + 1)) / ny
    for (const s of [1, -1]) {
      const a0 = s * xCrease(y0), a1 = s * xCrease(y1), e = s * CX_
      face(white, [[a0, y0, C(y0)], [a1, y1, C(y1)], [e, y1, C(y1)], [e, y0, C(y0)]], [0, 0, 1], [nC(y0), nC(y1), nC(y1), nC(y0)])
    }
  }
  // the lunettes: pale ribbed end walls under each barrel's end, with a lip
  const lip = 1.2
  const lunette = (f: Frame, span: number, h: (a: number) => number, n: number, base: number) => {
    for (let k = 0; k < n; k++) {
      const a0 = -span + (2 * span * k) / n, a1 = -span + (2 * span * (k + 1)) / n
      face(white, [P(f, a0, MH, 0), P(f, a1, MH, 0), P(f, a1, h(a1) + lip, 0), P(f, a0, h(a0) + lip, 0)], hintOf(f))
      face(white, [P(f, a0, h(a0) + lip, 0), P(f, a1, h(a1) + lip, 0), P(f, a1, h(a1) + lip, -1.2), P(f, a0, h(a0) + lip, -1.2)], [0, 0, 1])
      face(white, [P(f, a0, h(a0), -1.2), P(f, a1, h(a1), -1.2), P(f, a1, h(a1) + lip, -1.2), P(f, a0, h(a0) + lip, -1.2)], [-f.n[0], -f.n[1], 0])
    }
    // fine light louvres between the pale ribs
    const pitch = 2.8, slots = Math.floor((2 * span - 4) / pitch)
    for (let k = 0; k < slots; k++) {
      const a0 = -span + 2 + k * pitch + 0.75, a1 = a0 + pitch - 1.5
      const top = Math.min(h(a0), h(a1)) - 0.6
      if (top > base + 1) rect(glaze, f, a0, a1, base + 0.4, top)
    }
  }
  for (const s of [1, -1]) {
    lunette({ o: [0, YC + s * LY], u: [-s, 0], n: [0, s] }, LX, (a) => L(a), 14, WH)
    lunette({ o: [s * CX_, YC], u: [0, s], n: [s, 0] }, CY_, (a) => C(YC + a), 18, WH)
  }
}

// ---------------------------------------------------------------- output
const parts = [
  { part: brick, material: finish('aac-brick', 0xb8673f) },
  { part: stone, material: PALETTE.stone },
  { part: white, material: finish('aac-roof', 0xe8eaea) },
  { part: glaze, material: windowVariant(2, 0xa9bccb) },
  { part: win, material: PALETTE.window },
  { part: door, material: PALETTE.entrance },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(12), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('American Airlines Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the way/25312698 centroid; bearing 325',
  bearing: 325, osm: 'way/25312698',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const file = new URL('../models/dal-american-airlines-center.glb', import.meta.url).pathname
await Bun.write(file, glb)
console.log(`${file}: ${triangles} triangles, ${glb.length} bytes`)
