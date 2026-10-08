/**
 * Rose Bowl (1922, Myron Hunt; Terrace Suites and press box 2013),
 * Pasadena — procedural, CC0-1.0.
 * bun generators/la-rose-bowl.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the bowl's long axis
 * runs north-south to within a degree or two). The anchor is the area
 * centroid of OSM way/5208863.
 *
 * The bowl is sunk in the Arroyo Seco: the field is 245 m, the ground
 * outside 251 m on the south and west and 254 m on the north, the rim 264 m.
 * y = 0 is the lowest ground around it (251 m). As with the Coliseum, the
 * model draws the stands only from where they rise out of the ground up to
 * the rim, and leaves the lower bowl and the field to the map.
 *
 * What makes it the Rose Bowl: the long, round-ended oval, wider at the
 * ends than a plain ellipse; rose-coloured seats along the sides and pale
 * grey seats at the two ends; the cream rim and the outer wall of piers and
 * tall openings; the long, tall Terrace Suites and press box along the west
 * rim; the video board on the north rim and the white "Rose Bowl" sign over
 * the south tunnel.
 *
 * Sources:
 * - Plan: OSM way/5208863 (the outer wall; its west half replaced by the
 *   east half mirrored, since the outline there follows the press box);
 *   USGS NAIP orthophoto (seat colours and the angles where they change,
 *   the press box plan).
 * - Heights: LA County 2020 lidar surface model on a 3 m grid: the rim
 *   263-264 m all round (12.8 m above y = 0), the line where the seats come
 *   out of the ground (r_in below, per 5.6 degrees about the bowl's centre),
 *   the press box 28 m above y = 0 at its ends and 31 m over its middle,
 *   15 m deep, from 100 m south to 80 m north of the centre; its two outer
 *   stair blocks; the north video board 16 m wide, top 28 m; the south sign
 *   to 19-20 m.
 * - Photos: Ted Eytan, "2018.06.17 Over the Rose Bowl, Pasadena, CA USA"
 *   0031-0048 (CC BY-SA 2.0; drone views from the south, south-west and
 *   above, which show the seat colours, the rim, the outer wall's piers, the
 *   press box and the board); Ken Lund, "Rose Bowl Prior to BYU-UCLA Game"
 *   (CC BY-SA 2.0; the board).
 * - Estimated: the outer wall's openings (pitch and size from the south
 *   end, carried round), the press box's glazing bands, the rake's profile
 *   (straight), the rim walkway's width.
 * - Left out: the lower bowl and the field (the map's), tunnels, aisles,
 *   the light rigs, the rose mosaic and plaza, trees on the berm.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const concrete = new Part(), trim = new Part(), rose = new Part(), grey = new Part(), win = new Part(), dark = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
function quad(p: Part, P: V3[], hint: V3) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C)
  }
  t(0, 1, 2)
  t(0, 2, 3)
}
/** A box on an arbitrary footprint direction: centre, half-sizes along `ax` (unit, horizontal) and its normal. */
function box(p: Part, cx: number, cy: number, ax: [number, number], hu: number, hv: number, z0: number, z1: number, top: Part = p) {
  const [ux, uy] = ax, vx = -uy, vy = ux
  const c = (su: number, sv: number, z: number): V3 => [cx + su * hu * ux + sv * hv * vx, cy + su * hu * uy + sv * hv * vy, z]
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let i = 0; i < 4; i++) {
    const [a, b] = [corners[i], corners[(i + 1) % 4]]
    const m: V3 = [((a[0] + b[0]) / 2) * ux + ((a[1] + b[1]) / 2) * vx, ((a[0] + b[0]) / 2) * uy + ((a[1] + b[1]) / 2) * vy, 0]
    quad(p, [c(a[0], a[1], z0), c(b[0], b[1], z0), c(b[0], b[1], z1), c(a[0], a[1], z1)], m)
  }
  quad(top, corners.map(([a, b]) => c(a, b, z1)), [0, 0, 1])
}

// ---------------------------------------------------------------------------
// The bowl, about its centre, in 64 steps of 5.625 degrees counter-clockwise
// from east. Radii in metres from the centre: RO the outer wall (OSM, the
// east half mirrored west), RI where the seats rise out of the ground (lidar).
const CX = 0.51, CY = 1.26 // the bowl's centre from the anchor
const RO = [110.1, 109.6, 110.0, 110.5, 111.0, 112.0, 113.3, 115.5, 118.2, 120.5, 123.2, 126.2, 129.3, 131.5, 133.6, 135.1, 135.7, 135.1, 133.6, 131.5, 129.3, 126.2, 123.2, 120.5, 118.2, 115.5, 113.3, 112.0, 111.0, 110.5, 110.0, 109.6, 110.1, 110.7, 112.1, 113.6, 115.6, 118.1, 120.8, 123.6, 126.5, 129.6, 132.6, 135.3, 137.0, 137.9, 138.1, 136.8, 135.1, 136.8, 138.1, 137.9, 137.0, 135.3, 132.6, 129.6, 126.5, 123.6, 120.8, 118.1, 115.6, 113.6, 112.1, 110.7]
const RI = [70.3, 69.9, 69.6, 70.2, 71.3, 72.4, 73.7, 75.7, 78.2, 80.8, 83.4, 86.3, 89.3, 92.0, 94.3, 96.5, 97.7, 97.7, 96.9, 95.3, 92.8, 89.7, 86.3, 82.9, 79.4, 76.0, 73.1, 70.8, 68.7, 66.9, 65.4, 64.4, 63.9, 63.5, 63.2, 63.4, 64.2, 65.2, 66.6, 68.6, 70.8, 73.4, 76.3, 79.3, 82.7, 86.0, 89.0, 91.8, 94.2, 95.6, 95.8, 95.2, 94.0, 91.9, 89.3, 86.4, 83.8, 81.3, 78.9, 76.7, 74.8, 73.2, 71.7, 70.8]
const N = RO.length
const SEAT_TOP = 11.8, WALK = 12.0, PARAPET = 13.2, WALK_W = 5, PAR_W = 0.8
const ang = (k: number) => ((((k % N) + N) % N) / N) * Math.PI * 2
const at = (k: number, r: number, z: number): V3 => [CX + r * Math.cos(ang(k)), CY + r * Math.sin(ang(k)), z]
const ro = (k: number) => RO[((k % N) + N) % N]
const ri = (k: number) => RI[((k % N) + N) % N]
const out = (k: number): V3 => [Math.cos(ang(k)), Math.sin(ang(k)), 0]

// Seat colours by angle (NAIP): grey across the two ends, rose elsewhere.
const isEnd = (deg: number) => (deg > 55 && deg < 137) || (deg > 236 && deg < 315)

for (let k = 0; k < N; k++) {
  const deg = ((k + 0.5) / N) * 360
  const seat = isEnd(deg) ? grey : rose
  // the rake: straight from the ground line to the top row, in two bands
  const r0a = ri(k), r0b = ri(k + 1), rta = ro(k) - WALK_W, rtb = ro(k + 1) - WALK_W
  const m = 0.5
  const ring = (t: number, z: number): [V3, V3] => [at(k, r0a + (rta - r0a) * t, z), at(k + 1, r0b + (rtb - r0b) * t, z)]
  const [a0, b0] = ring(0, 0), [a1, b1] = ring(m, SEAT_TOP * 0.44), [a2, b2] = ring(1, SEAT_TOP)
  quad(seat, [a0, b0, b1, a1], add(mul(out(k), -1), [0, 0, 2]))
  quad(seat, [a1, b1, b2, a2], add(mul(out(k), -1), [0, 0, 1.5]))
  // the riser at the top row, the walkway, the parapet and the outer wall
  quad(concrete, [a2, b2, at(k + 1, rtb, WALK), at(k, rta, WALK)], mul(out(k), -1))
  quad(concrete, [at(k, rta, WALK), at(k + 1, rtb, WALK), at(k + 1, ro(k + 1) - PAR_W, WALK), at(k, ro(k) - PAR_W, WALK)], [0, 0, 1])
  quad(trim, [at(k, ro(k) - PAR_W, WALK), at(k + 1, ro(k + 1) - PAR_W, WALK), at(k + 1, ro(k + 1) - PAR_W, PARAPET - 0.3), at(k, ro(k) - PAR_W, PARAPET - 0.3)], mul(out(k), -1))
  quad(trim, [at(k, ro(k) - PAR_W, PARAPET - 0.3), at(k + 1, ro(k + 1) - PAR_W, PARAPET - 0.3), at(k + 1, ro(k + 1) - 0.25, PARAPET), at(k, ro(k) - 0.25, PARAPET)], add(mul(out(k), -0.5), [0, 0, 1]))
  quad(trim, [at(k, ro(k) - 0.25, PARAPET), at(k + 1, ro(k + 1) - 0.25, PARAPET), at(k + 1, ro(k + 1), PARAPET - 0.35), at(k, ro(k), PARAPET - 0.35)], add(out(k), [0, 0, 1]))
  quad(concrete, [at(k, ro(k), 0), at(k + 1, ro(k + 1), 0), at(k + 1, ro(k + 1), PARAPET - 0.35), at(k, ro(k), PARAPET - 0.35)], out(k))
}

// ---------------------------------------------------------------------------
// The Terrace Suites and press box along the west rim: 15 m deep, its outer
// face on the outer wall, the field half cantilevered over the top rows.
// Spans the segments whose wall lies between 100 m south and 80 m north of
// the centre; 31 m high over the middle (45 m south to 18 m north), 28 m at
// the ends.
const PB: number[] = []
for (let k = 0; k < N; k++) {
  const p = at(k, ro(k), 0), q = at(k + 1, ro(k + 1), 0)
  if (p[0] < CX && q[0] < CX && Math.min(p[1], q[1]) - CY > -101 && Math.max(p[1], q[1]) - CY < 81) PB.push(k)
}
const pbH = (k: number) => {
  const y = at(k, ro(k), 0)[1] - CY
  return y > -46 && y < 19 ? 31 : 28
}
{
  const D = 15, SOLID = 8, CANT = 14.2
  const k0 = PB[0], k1 = PB[PB.length - 1] + 1
  for (const k of PB) {
    const H = pbH(k) === 31 && pbH(k + 1) === 31 ? 31 : 28
    const o = (kk: number, r: number, z: number) => at(kk, ro(kk) + r, z)
    // outer face (on the wall line, a touch proud of it)
    quad(trim, [o(k, 0.3, 0), o(k + 1, 0.3, 0), o(k + 1, 0.3, H), o(k, 0.3, H)], out(k))
    // the solid back half's field face, below the cantilever
    quad(trim, [o(k, -SOLID, WALK), o(k + 1, -SOLID, WALK), o(k + 1, -SOLID, CANT), o(k, -SOLID, CANT)], mul(out(k), -1))
    // the cantilever: soffit and field face
    quad(concrete, [o(k, -SOLID, CANT), o(k + 1, -SOLID, CANT), o(k + 1, -D, CANT), o(k, -D, CANT)], [0, 0, -1])
    quad(trim, [o(k, -D, CANT), o(k + 1, -D, CANT), o(k + 1, -D, H), o(k, -D, H)], mul(out(k), -1))
    // roof
    quad(concrete, [o(k, -D, H), o(k + 1, -D, H), o(k + 1, 0.3, H), o(k, 0.3, H)], [0, 0, 1])
    // glazing: two broad bands on the field face (suites, press level)
    const g = (kk: number, z: number): V3 => at(kk, ro(kk) - D - 0.06, z)
    quad(win, [g(k, CANT + 1.0), g(k + 1, CANT + 1.0), g(k + 1, CANT + 6.4), g(k, CANT + 6.4)], mul(out(k), -1))
    quad(win, [g(k, CANT + 8.2), g(k + 1, CANT + 8.2), g(k + 1, H - 1.6), g(k, H - 1.6)], mul(out(k), -1))
    // and one on the outer face, at the concourse levels
    const gw = (kk: number, z: number): V3 => at(kk, ro(kk) + 0.36, z)
    quad(win, [gw(k, 15.5), gw(k + 1, 15.5), gw(k + 1, H - 2.4), gw(k, H - 2.4)], out(k))
  }
  // where the middle section steps up, and the two ends
  const cap = (k: number, H: number, sign: number) => {
    const n: V3 = [-Math.sin(ang(k)) * sign, Math.cos(ang(k)) * sign, 0]
    quad(trim, [at(k, ro(k) + 0.3, 0), at(k, ro(k) - SOLID, 0), at(k, ro(k) - SOLID, H), at(k, ro(k) + 0.3, H)], n)
    quad(trim, [at(k, ro(k) - SOLID, CANT), at(k, ro(k) - D, CANT), at(k, ro(k) - D, H), at(k, ro(k) - SOLID, H)], n)
  }
  cap(k0, 28, -1)
  cap(k1, 28, 1)
  for (const k of PB) {
    const h0 = pbH(k), h1 = pbH(k + 1)
    if (h0 !== h1) {
      const kk = k + 1
      const n: V3 = [-Math.sin(ang(kk)) * (h1 > h0 ? -1 : 1), Math.cos(ang(kk)) * (h1 > h0 ? -1 : 1), 0]
      quad(trim, [at(kk, ro(kk) + 0.3, 28), at(kk, ro(kk) - D, 28), at(kk, ro(kk) - D, 31), at(kk, ro(kk) + 0.3, 31)], n)
    }
  }
}
// The two stair and lift blocks on the press box's outer side (lidar, OSM).
box(trim, -119.0 + 0.51, -19.0 + 4.26, [Math.cos(0.12), Math.sin(0.12)], 10.0, 11.5, 0, 30)
box(trim, -115.5 + 0.51, 10.5 + 4.26, [1, 0], 5.0, 5.0, 0, 27)
for (const [x, y, hu, hv, h] of [[-119.0 + 0.51, -19.0 + 4.26, 10.0, 11.5, 30], [-115.5 + 0.51, 10.5 + 4.26, 5.0, 5.0, 27]]) {
  // a tall glazed strip on each block's west face
  const xw = x - hu - 0.06
  quad(win, [[xw, y - 2, 4], [xw, y + 2, 4], [xw, y + 2, h - 3], [xw, y - 2, h - 3]], [-1, 0, 0])
}

// ---------------------------------------------------------------------------
// The outer wall's piers and tall openings, all round except behind the
// press box: dark panels flush on the wall.
for (let k = 0; k < N; k++) {
  if (PB.includes(k)) continue
  const A = at(k, ro(k) + 0.06, 0), B = at(k + 1, ro(k + 1) + 0.06, 0)
  const L = Math.hypot(B[0] - A[0], B[1] - A[1])
  const n = Math.max(1, Math.round(L / 7.0))
  for (let i = 0; i < n; i++) {
    const w = (L / n - 1.8) / 2
    const t0 = (i + 0.5) / n - w / L, t1 = (i + 0.5) / n + w / L
    const P = (t: number, z: number): V3 => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, z]
    quad(dark, [P(t0, 0.8), P(t1, 0.8), P(t1, 10.2), P(t0, 10.2)], out(k))
  }
}

// ---------------------------------------------------------------------------
// The video board on the north rim, facing the field, and the white sign
// over the south tunnel with its red rose.
{
  const bx = -18 + 0.51, by = 131.5 + 4.26
  const a = Math.atan2(by - CY, bx - CX) + Math.PI / 2
  const ax: [number, number] = [Math.cos(a), Math.sin(a)]
  box(dark, bx, by, ax, 8.2, 1.0, WALK, 28)
  // its two legs' footing on the walkway, a lighter frame top
  box(trim, bx, by, ax, 8.5, 1.2, 27.6, 28.3)
}
{
  // lidar: a panel about 46 m wide over the tunnel, its top 20 m above
  // y = 0 (its foot from the photos), a crest in the middle carrying the rose
  // on the outer face of the south wall, over the tunnel mouth
  const th = (274.2 * Math.PI) / 180, rr = 135.9
  const sx = CX + rr * Math.cos(th), sy = CY + rr * Math.sin(th)
  const a = th + Math.PI / 2
  const ax: [number, number] = [Math.cos(a), Math.sin(a)]
  box(trim, sx, sy, ax, 23, 0.8, 7.6, 20.2)
  box(trim, sx, sy, ax, 4.5, 0.8, 20.2, 22.6)
  const nx = -ax[1], ny = ax[0]
  for (const s of [1, -1]) {
    const c: V3 = [sx + s * nx * 0.86, sy + s * ny * 0.86, 19.8]
    const R = 2.6, seg = 12
    for (let i = 0; i < seg; i++) {
      const t0 = (i / seg) * Math.PI * 2, t1 = ((i + 1) / seg) * Math.PI * 2
      const P = (t: number): V3 => [c[0] + ax[0] * R * Math.cos(t), c[1] + ax[1] * R * Math.cos(t), c[2] + R * Math.sin(t)]
      const A = P(t0), B = P(t1)
      if (dot(cross(sub(A, c), sub(B, c)), [s * nx, s * ny, 0]) >= 0) rose.tri(c, A, B)
      else rose.tri(c, B, A)
    }
  }
}

// ---------------------------------------------------------------------------
// Palette, from the drone photos and the orthophoto: the rim and walls pale
// concrete (`stone`), the press box white (`trim`), the side seats a muted
// rose and the end seats a warm pale grey (both pulled to palette
// lightness), the press box glazing `window`, and the board and the wall's
// openings a dark grey.
const parts = [
  { part: concrete, material: PALETTE.stone },
  { part: trim, material: PALETTE.trim },
  { part: rose, material: finish('rose-bowl-seat-rose', 0xc4888a) },
  { part: grey, material: finish('rose-bowl-seat-grey', 0xd3cec6) },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('rose-bowl-dark', 0x5b6068) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(22), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Rose Bowl', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'way/5208863',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/la-rose-bowl.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
