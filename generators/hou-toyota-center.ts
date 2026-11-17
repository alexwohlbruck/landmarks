/**
 * Toyota Center, Houston (2003, HOK Sport with Morris Architects), home of
 * the Rockets — procedural, CC0-1.0. bun generators/hou-toyota-center.ts
 *
 * Map frame: x along the downtown grid's "east" (bearing 124.8°, Polk St),
 * y along its "north" (bearing 34.8°, La Branch St), z up, metres. Placed at
 * bearing 34.8, the street grid the outline follows. The anchor is the area
 * centroid of OSM way/25312761. The site is flat (Mapterhorn relief under
 * 1 m over the block), so z = 0 is the street and elevation is 0.
 *
 * What makes it read as itself: a squared-off oval drum walled in glass,
 * two and three storeys of curtain wall with pale floor lines, under a
 * silver curved roof edge that overhangs like a lid and a low silver dome;
 * at the corners, tall flat tan-stone portal frames with glazed openings
 * rising to the roof edge, beside stone towers carrying the red Toyota
 * emblem. A lower tan stone podium with tall narrow windows wraps three
 * sides; the middle of the south side is plain stone (t02).
 *
 * The brief described a "red/grey metal-clad box"; every photo found shows
 * tan stone, glass and a silver roof edge, so the photos are followed.
 *
 * Sources:
 * - OSM way/25312761 (building=yes, height 46): the podium outline, notched
 *   at the north-west and north-east entrances. Nothing else inside it (the
 *   skybridge part way/1245229087 lies outside).
 * - USGS 3DEP lidar TX_Coastal_B1_2018 (flight 2018), 1 m grid, read in
 *   this frame: the drum's roof edge at 29-31 m, x -59..73, y -73..73; the
 *   dome rising to 38-39 m at the centre (OSM's 46 m is not borne out); the
 *   podium 16-21 m on the west, north and east; corner towers about 25 m.
 * - USGS NAIP orthophoto (public domain): the oval dome inside the squared
 *   rim, near-white with the Toyota logo painted across it (not modelled:
 *   lettering and a sponsor mark), the corner entrances.
 * - Photos (Wikimedia Commons):
 *   - t01 "Toyota Center entr.jpg", Ed Uthman, CC BY 2.0: the main corner
 *     entrance: stone portal, curved glass, the corner tower and emblem, the
 *     silver roof edge;
 *   - t02 "Houston Toyota Center -.jpg", Atownballer, CC BY-SA 3.0: the long
 *     side from above, the drum, roof edge and dome, the podium's windows;
 *   - t03 "Toyota Center Downtown Houston TX - panoramio.jpg", Chanilim714,
 *     CC BY-SA 3.0, and t04 "Toyota Center nima.JPG", زرشک, CC BY-SA 3.0:
 *     the corner entrances from the street;
 *   - t05 "ToyotaCenter.jpg", WhisperToMe, public domain: at night, the
 *     glass lit warm, the emblem and name lit red;
 *   - t07 "Toyota Center satellite view.png", NASA, public domain: plan.
 *   Colours sampled from t01, t02 and t04, pulled to the palette.
 * Estimated: the drum's superellipse (exponent 2.5, from the lidar's 29 m
 * contour), the roof edge's profile and overhang, the dome's curve (fitted to
 * the lidar row through the centre), the portals' and towers' sizes and
 * places at every corner (photos show the north-west and one other; the
 * south corners are taken to match), the podium's window bays.
 * Left out: lettering, the video marquees, flagpoles, canopies.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const stone = new Part(), metal = new Part(), roof = new Part()
const win = new Part(), glass = new Part(), neon = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

function quad(p: Part, P: V3[], hint: V3) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const o = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    const A = P[o[a]], B = P[o[b]], C = P[o[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) > 1e-9) p.tri(A, B, C)
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  if (dot(cross(sub(B, A), sub(C, A)), hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
/** An oriented box: base centre c (z0), unit horizontal axes u (width) and n (depth). */
function obox(p: Part, c: XY, u: XY, n: XY, w: number, d: number, z0: number, z1: number) {
  const P = (a: number, b: number, z: number): V3 => [c[0] + u[0] * a + n[0] * b, c[1] + u[1] * a + n[1] * b, z]
  const hw = w / 2, hd = d / 2
  const faces: [number, number, V3][] = [[1, 0, [u[0], u[1], 0]], [-1, 0, [-u[0], -u[1], 0]], [0, 1, [n[0], n[1], 0]], [0, -1, [-n[0], -n[1], 0]]]
  for (const [su, sn, h] of faces) {
    if (su) quad(p, [P(su * hw, -hd, z0), P(su * hw, hd, z0), P(su * hw, hd, z1), P(su * hw, -hd, z1)], h)
    else quad(p, [P(-hw, sn * hd, z0), P(hw, sn * hd, z0), P(hw, sn * hd, z1), P(-hw, sn * hd, z1)], h)
  }
  quad(p, [P(-hw, -hd, z1), P(hw, -hd, z1), P(hw, hd, z1), P(-hw, hd, z1)], [0, 0, 1])
}

function earclip(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cz = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cz(a, b, p) > 1e-9 && cz(b, c, p) > 1e-9 && cz(c, a, p) > 1e-9
  while (idx.length > 3) {
    let done = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      if (cz(poly[i0], poly[i1], poly[i2]) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(poly[j], poly[i0], poly[i1], poly[i2]))) continue
      out.push([i0, i1, i2])
      idx.splice(k, 1)
      done = true
      break
    }
    if (!done) throw new Error('earclip stuck')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

// ---------------------------------------------------------------------------
// The podium: the OSM outline, stone to 16 m (lidar 16-21), with windows
// grouped in bays (t02).

let OUTLINE: XY[] = [[-47.8, 77.3], [-45.6, 70.8], [-44.7, 66.4], [-45.3, 62.3], [-46.8, 58.8], [-49.8, 55.9], [-53.4, 53.7], [-58.6, 52.7], [-64.2, 54.8], [-67.4, 33.2], [-69.7, 18.9], [-75.7, 18.9], [-78.4, 0.6], [-81.0, -22.8], [-81.2, -37.7], [-81.0, -51.8], [-79.8, -65.1], [-68.0, -64.5], [-67.5, -68.4], [-58.1, -68.4], [-59.0, -63.7], [-50.9, -63.6], [-48.1, -74.1], [-4.0, -76.9], [-3.4, -74.9], [2.7, -75.0], [6.6, -75.2], [9.0, -74.9], [19.0, -73.6], [19.5, -76.8], [64.7, -73.9], [68.6, -57.0], [70.6, -42.9], [77.2, -42.6], [77.3, -25.8], [77.8, -12.3], [76.0, 11.3], [73.7, 32.7], [69.9, 50.9], [63.9, 49.6], [63.0, 53.2], [59.1, 52.4], [50.2, 64.4], [53.1, 74.6], [48.8, 78.8], [49.5, 80.7], [39.9, 83.1], [32.6, 84.7], [16.9, 86.6], [3.2, 87.0], [-11.3, 86.0], [-28.3, 83.2], [-40.5, 79.5]]
{
  let a = 0
  for (let i = 0; i < OUTLINE.length; i++) a += OUTLINE[i][0] * OUTLINE[(i + 1) % OUTLINE.length][1] - OUTLINE[(i + 1) % OUTLINE.length][0] * OUTLINE[i][1]
  if (a < 0) OUTLINE = OUTLINE.reverse()
}
const POD = 16
// The two north corners are entrance plazas (the outline's notches; lidar
// 1-5 m there): their podium faces are glass to the ground, as in t01.
const NORTH_DOORS: XY[] = [[-46, 60], [56, 58]]
const atDoor = (x: number, y: number) => NORTH_DOORS.some(([dx, dy]) => Math.hypot(x - dx, y - dy) < 14)
for (let i = 0; i < OUTLINE.length; i++) {
  const [x1, y1] = OUTLINE[i], [x2, y2] = OUTLINE[(i + 1) % OUTLINE.length]
  const L = Math.hypot(x2 - x1, y2 - y1)
  const n: V3 = [(y2 - y1) / L, -(x2 - x1) / L, 0]
  if (atDoor((x1 + x2) / 2, (y1 + y2) / 2)) {
    quad(glass, [[x1, y1, 0], [x2, y2, 0], [x2, y2, POD], [x1, y1, POD]], n)
    continue
  }
  quad(stone, [[x1, y1, 0], [x2, y2, 0], [x2, y2, POD], [x1, y1, POD]], n)
  if (L >= 12) {
    // Tall narrow windows, two storeys high, about 6.5 m apart (t02).
    const bays = Math.max(1, Math.round(L / 6.5)), o = mul(n, 0.05)
    for (let k = 0; k < bays; k++) {
      const sm = ((k + 0.5) * L) / bays, s0 = sm - 1.2, s1 = sm + 1.2
      const P = (s: number, z: number): V3 => add([x1 + ((x2 - x1) * s) / L, y1 + ((y2 - y1) * s) / L, z], o)
      quad(win, [P(s0, 4.5), P(s1, 4.5), P(s1, 13), P(s0, 13)], n)
    }
  }
}
for (const [a, b, c] of earclip(OUTLINE)) {
  const A = OUTLINE[a], B = OUTLINE[b], C = OUTLINE[c]
  tri(roof, [A[0], A[1], POD], [B[0], B[1], POD], [C[0], C[1], POD], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The drum: a superellipse fitted to the lidar's 29 m contour.

const CX = 7, CY = 0, A = 66, B = 73, EXP = 2.5, N = 72
const WALL = 26, EDGE = 30
const sgnpow = (v: number, p: number) => Math.sign(v) * Math.pow(Math.abs(v), p)
const at = (t: number, s = 1): XY => [CX + A * s * sgnpow(Math.cos(t), 2 / EXP), CY + B * s * sgnpow(Math.sin(t), 2 / EXP)]
const T = (i: number) => (2 * Math.PI * i) / N
/** Outward unit normal at parameter t. */
const nrm = (t: number): XY => {
  const a = at(t - 1e-4), b = at(t + 1e-4)
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  return [dy / l, -dx / l]
}
// Corner entrances on the diagonals; HALF sets where the corner towers stand.
const CORNERS = [45, 135, 225, 315].map((d) => (d * Math.PI) / 180)
const HALF = (19 * Math.PI) / 180

// The drum is a glass curtain wall all round (t01, t03, t04), with pale
// floor lines and mullions grouping the panels, except the middle of the
// south (Clay St) side, which t02 shows as plain tan stone.
const SOUTH = (3 * Math.PI) / 2, SOUTH_HALF = (38 * Math.PI) / 180
const isStone = (t: number) => Math.abs(Math.atan2(Math.sin(t - SOUTH), Math.cos(t - SOUTH))) < SOUTH_HALF
for (let i = 0; i < N; i++) {
  const t0 = T(i), t1 = T(i + 1), tm = (t0 + t1) / 2
  const a = at(t0), b = at(t1), n = nrm(tm), h: V3 = [n[0], n[1], 0]
  if (isStone(tm)) {
    quad(stone, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WALL], [a[0], a[1], WALL]], h)
    continue
  }
  quad(glass, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WALL], [a[0], a[1], WALL]], h)
  const o = (p: XY, d = 0.15): XY => [p[0] + n[0] * d, p[1] + n[1] * d]
  const A2 = o(a), B2 = o(b)
  for (const z of [8.6, 17.2]) quad(metal, [[A2[0], A2[1], z], [B2[0], B2[1], z], [B2[0], B2[1], z + 0.9], [A2[0], A2[1], z + 0.9]], h)
  if (i % 3 === 0) {
    // A mullion every third facet, about 6 m apart.
    const u: XY = [(b[0] - a[0]), (b[1] - a[1])], l = Math.hypot(u[0], u[1]), e: XY = [u[0] / l * 0.45, u[1] / l * 0.45]
    quad(metal, [[A2[0] - e[0], A2[1] - e[1], 0], [A2[0] + e[0], A2[1] + e[1], 0], [A2[0] + e[0], A2[1] + e[1], WALL], [A2[0] - e[0], A2[1] - e[1], WALL]], h)
  }
}

// The silver roof edge: a lid that bulges out over the wall, with a dark
// shadowed underside reading as the overhang (t01, t02).
const LID: [number, number][] = [[0, WALL], [1.8, WALL + 0.6], [2.6, WALL + 2.0], [2.4, EDGE - 0.6], [1.4, EDGE]] // (outward offset, z)
for (let i = 0; i < N; i++) {
  const t0 = T(i), t1 = T(i + 1)
  const a = at(t0), b = at(t1), na = nrm(t0), nb = nrm(t1)
  const P = (p: XY, n: XY, [o, z]: [number, number]): V3 => [p[0] + n[0] * o, p[1] + n[1] * o, z]
  for (let k = 0; k < LID.length - 1; k++) {
    const nm = nrm((t0 + t1) / 2)
    const up = LID[k + 1][1] - LID[k][1], out = LID[k + 1][0] - LID[k][0]
    const h: V3 = [nm[0] * up, nm[1] * up, -out]
    quad(metal, [P(a, na, LID[k]), P(b, nb, LID[k]), P(b, nb, LID[k + 1]), P(a, na, LID[k + 1])], h)
  }
}

// The dome: rings from the lid's inner edge up to 39 m at the centre.
const RINGS = [1.02, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15]
const domeZ = (s: number) => EDGE + 9 * (1 - Math.pow(Math.min(s, 1), 1.5))
for (let k = 0; k < RINGS.length - 1; k++) {
  const s0 = RINGS[k], s1 = RINGS[k + 1]
  for (let i = 0; i < N; i++) {
    const a0 = at(T(i), s0), b0 = at(T(i + 1), s0), a1 = at(T(i), s1), b1 = at(T(i + 1), s1)
    quad(roof, [[a0[0], a0[1], domeZ(s0)], [b0[0], b0[1], domeZ(s0)], [b1[0], b1[1], domeZ(s1)], [a1[0], a1[1], domeZ(s1)]], [0, 0, 1])
  }
}
{
  const s = RINGS[RINGS.length - 1], top: V3 = [CX, CY, domeZ(0)]
  for (let i = 0; i < N; i++) {
    const a = at(T(i), s), b = at(T(i + 1), s)
    tri(roof, [a[0], a[1], domeZ(s)], [b[0], b[1], domeZ(s)], top, [0, 0, 1])
  }
}
// The lid's top, closing the gap between its rim and the dome.
for (let i = 0; i < N; i++) {
  const t0 = T(i), t1 = T(i + 1), a = at(t0), b = at(t1), na = nrm(t0), nb = nrm(t1)
  const ai = at(t0, RINGS[0]), bi = at(t1, RINGS[0])
  quad(metal, [[a[0] + na[0] * 1.4, a[1] + na[1] * 1.4, EDGE], [b[0] + nb[0] * 1.4, b[1] + nb[1] * 1.4, EDGE], [bi[0], bi[1], domeZ(RINGS[0])], [ai[0], ai[1], domeZ(RINGS[0])]], [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The corner entrances: a square stone portal in front of the glass, and a
// stone tower beside it carrying the red emblem, lit at night (t01, t05).

for (const c of CORNERS) {
  const p = at(c), n = nrm(c), u: XY = [-n[1], n[0]]
  // Portal: a tall flat stone frame on the plaza, two piers and a deep
  // lintel rising to the roof edge, with a glazed opening (t01, t03, t04).
  // The north portals are photographed; the south ones follow the lidar's
  // 25 m blocks at those corners.
  const north = Math.sin(c) > 0, top = north ? 29 : 25.5
  const fc: XY = [p[0] + n[0] * 12, p[1] + n[1] * 12]
  for (const s of [-1, 1]) obox(stone, [fc[0] + u[0] * s * 14, fc[1] + u[1] * s * 14], u, n, 6, 4, 0, top)
  obox(stone, fc, u, n, 34, 4, top - 5.5, top)
  {
    const g: XY = [fc[0] - n[0] * 1.2, fc[1] - n[1] * 1.2], h: V3 = [n[0], n[1], 0]
    const P = (s: number, z: number): V3 => [g[0] + u[0] * s, g[1] + u[1] * s, z]
    quad(glass, [P(-11, 0), P(11, 0), P(11, top - 5.5), P(-11, top - 5.5)], h)
    const f: XY = [g[0] + n[0] * 0.15, g[1] + n[1] * 0.15]
    const F = (s: number, z: number): V3 => [f[0] + u[0] * s, f[1] + u[1] * s, z]
    for (const z of [8.6, 17.2]) quad(metal, [F(-11, z), F(11, z), F(11, z + 0.9), F(-11, z + 0.9)], h)
    for (const sx of [-5.5, 0, 5.5]) quad(metal, [F(sx - 0.45, 0), F(sx + 0.45, 0), F(sx + 0.45, top - 5.5), F(sx - 0.45, top - 5.5)], h)
  }
  // Tower: at the sector's clockwise edge, from the ground to 25 m.
  const tt = c - HALF - 0.06, q = at(tt), m = nrm(tt), v: XY = [-m[1], m[0]]
  const tc: XY = [q[0] + m[0] * 3, q[1] + m[1] * 3]
  obox(stone, tc, v, m, 13, 12, 0, 25)
  // The emblem: three interlocking ovals as one bold ring and a cross bar,
  // on the tower's outward face.
  const f: XY = [tc[0] + m[0] * 6.08, tc[1] + m[1] * 6.08], h: V3 = [m[0], m[1], 0]
  const ring = (rx: number, rz: number, w: number, z: number) => {
    const S = 20
    for (let k = 0; k < S; k++) {
      const a0 = (2 * Math.PI * k) / S, a1 = (2 * Math.PI * (k + 1)) / S
      const P = (a: number, r: number): V3 => [f[0] + v[0] * Math.cos(a) * rx * r, f[1] + v[1] * Math.cos(a) * rx * r, z + Math.sin(a) * rz * r]
      const ri = 1 - w
      quad(neon, [P(a0, ri), P(a1, ri), P(a1, 1), P(a0, 1)], h)
    }
  }
  ring(3.2, 2.2, 0.28, 20)
  ring(1.0, 2.0, 0.4, 20)
}

// ---------------------------------------------------------------------------
// Palette: tan stone on the podium, portals, towers and the south side of
// the drum (t01, t02), the silver roof edge, the dome near
// white (NAIP) and silver (t02), the podium's windows, the curtain-wall glass in a light grey-blue
// (it reads light in t01 and t04), and the emblem's red, lit at night.
const parts = [
  { part: stone, material: finish('toyota-stone', 0xdcc6b0) },
  { part: metal, material: finish('toyota-silver', 0xbcc2c8) },
  { part: roof, material: finish('toyota-roof', 0xd9dde0) },
  { part: win, material: PALETTE.window },
  { part: glass, material: windowVariant(2, 0xa9bfd1) },
  { part: neon, material: finish('neon-toyota-red', 0xc8423c) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(16), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Toyota Center', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the street, at the outline centroid',
  bearing: 34.8, osm: 'way/25312761',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/hou-toyota-center.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
