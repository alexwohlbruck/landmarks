/**
 * The Oculus (World Trade Center Transportation Hub) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-oculus.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. The long axis
 * runs along y; placed at bearing 128.0°, the axis of the outline (model
 * north points down Dey Street's line towards Church Street's south-east).
 * Anchor: area centroid of the OSM outline way/278033606. y = 0 is the
 * plaza the building stands on.
 *
 * Evidence
 * - OSM way/278033606: the eye-shaped outline, 33 × 110 m, tagged
 *   height 47, roof dome, colour #f0efed. No building:parts.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) in the model frame, against the
 *   plaza (~6 m NAVD88): the top surface 36–39 m high at mid-length,
 *   falling to 15–20 m at the two ends; the spine slot along x ≈ 0 open to
 *   the hall floor (returns ~22 m below the plaza); the outer edge of the
 *   ribs at |x| 13–16 m at mid-length. Two construction-crane booms cross
 *   the cloud and were ignored.
 * - Published: Santiago Calatrava, opened 2016; white-painted steel ribs
 *   rising from the hall into two wing-like canopies either side of a
 *   central operable skylight along the spine; glazed arched ends
 *   (Wikipedia).
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-oculus/photos/credits.txt
 *   (Kidfly182's set round the building and from the end, AramilFeraxa,
 *   Matt Rice from the memorial plaza, Anthony Quintano along the side).
 *
 * Drawn as: an eye-shaped drum of dark glass between broad white ribs that
 * run down to the plaza, a white band and a white shell curving in to the
 * spine, a raised glass skylight with white rims along the spine (pinched at
 * the ends), and two wings, each a continuous white sheet sweeping from the
 * spine rim up and out to the tips with a ridge for every rib (29 a side on
 * a 3.4 m pitch), so each wing reads as one white mass at map scale. The
 * real ribs are finer and more numerous and stand apart against the sky.
 *
 * Estimated: the rib count and size (abstracted, see above), the drum's
 * glazing height (9 m) and white band, the spine's height profile (27 m at
 * mid-length from the lidar's slot rim, 10 m at the ends), the tips' 40 m
 * (lidar 39; thin rib tips may be under-sampled), the curve of
 * each rib between the lidar's top heights, the end treatment (the ribs
 * simply shorten; the real end ribs also lean out along the axis).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel } from './nyc-570-lexington'

const steel = new Part(), wall = new Part(), sky = new Part()

const LY = 50 // rib span along y
const W = (y: number) => 16 * Math.sqrt(Math.max(0, 1 - (y / 55) ** 2)) // wing tip half-width
const B = (y: number) => 11.5 * Math.sqrt(Math.max(0, 1 - (y / 54) ** 2)) // base half-width
const H = (y: number) => 15 + 25 * (1 - (y / LY) ** 2) // wing tip height: 40 m at mid-length (lidar 39)
const ZS = (y: number) => 10 + 17 * (1 - (y / LY) ** 2) // spine height
const Sy = (y: number) => 0.6 + 2.2 * Math.sqrt(Math.max(0, 1 - (y / 53) ** 2)) // spine half-width, pinched at the ends
const GLAZE = 9

const bez = (a: number[], c: number[], b: number[], t: number) => [0, 1].map((i) => (1 - t) ** 2 * a[i] + 2 * (1 - t) * t * c[i] + t * t * b[i])

// --- The body: glazed base wall, white band, the shell curving in to the spine ---
// One profile per station along y (x ≥ 0 half; mirrored), lofted.
const NY = 26
const ys = Array.from({ length: NY + 1 }, (_, i) => -LY - 2 + ((2 * LY + 4) * i) / NY)
function profile(y: number): [number, number][] {
  const b = B(y), zs = ZS(Math.max(-LY, Math.min(LY, y)))
  const pts: [number, number][] = [[b, 0], [b, GLAZE], [b - 0.1, GLAZE + 1.2]]
  // shell from the band up and in to the spine rim
  for (const t of [0.25, 0.5, 0.75, 1]) {
    const p = bez([b - 0.1, GLAZE + 1.2], [b + 0.3, zs - 1], [Sy(y), zs], t)
    pts.push([p[0], p[1]])
  }
  return pts
}
for (const side of [1, -1]) {
  for (let i = 0; i < NY; i++) {
    const p0 = profile(ys[i]), p1 = profile(ys[i + 1])
    for (let k = 0; k < p0.length - 1; k++) {
      const part = k === 0 ? wall : steel // glazing between the drum ribs; white band and shell above
      const a: V3 = [side * p0[k][0], ys[i], p0[k][1]], b: V3 = [side * p1[k][0], ys[i + 1], p1[k][1]]
      const c: V3 = [side * p1[k + 1][0], ys[i + 1], p1[k + 1][1]], d: V3 = [side * p0[k + 1][0], ys[i], p0[k + 1][1]]
      if (side > 0) part.quad(a, b, c, d); else part.quad(b, a, d, c)
    }
  }
}
// The ends: closed in white steel, the prow the wings spring from (photo from the end).
for (const [yi, f] of [[0, -1], [NY, 1]] as [number, number][]) {
  const y = ys[yi], p = profile(y)
  const ring: V3[] = [...p.map(([x, z]) => [x, y, z] as V3), ...p.slice().reverse().map(([x, z]) => [-x, y, z] as V3)]
  const c: V3 = [0, y, ZS(Math.sign(y) * LY) * 0.5]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (f < 0) steel.tri(c, b, a); else steel.tri(c, a, b)
  }
}
// Spine skylight: a low glass vault between white rims.
for (let i = 0; i < NY; i++) {
  const y0 = ys[i], y1 = ys[i + 1]
  const z0 = ZS(Math.max(-LY, Math.min(LY, y0))), z1 = ZS(Math.max(-LY, Math.min(LY, y1)))
  const sa = Sy(y0), sb = Sy(y1), f = [-1, -0.5, 0, 0.5, 1], lift = [0, 0.9, 1.2, 0.9, 0]
  for (let k = 0; k < 4; k++) sky.quad([f[k + 1] * sa, y0, z0 + lift[k + 1]], [f[k] * sa, y0, z0 + lift[k]], [f[k] * sb, y1, z1 + lift[k]], [f[k + 1] * sb, y1, z1 + lift[k + 1]])
  for (const sx of [-1, 1]) {
    // rim: a raised white lip along each edge of the slot
    const a0 = sx * sa, b0 = sx * sb, a1 = sx * (sa + 0.8), b1 = sx * (sb + 0.8)
    const q: V3[] = [[a0, y0, z0 + 1.6], [a1, y0, z0 + 1.6], [b1, y1, z1 + 1.6], [b0, y1, z1 + 1.6]]
    if (sx > 0) steel.quad(q[0], q[1], q[2], q[3]); else steel.quad(q[1], q[0], q[3], q[2])
    const o: V3[] = [[a1, y0, z0 - 0.5], [b1, y1, z1 - 0.5], [b1, y1, z1 + 1.6], [a1, y0, z0 + 1.6]]
    if (sx > 0) steel.quad(o[0], o[1], o[2], o[3]); else steel.quad(o[1], o[0], o[3], o[2])
    const n: V3[] = [[b0, y1, z1 - 0.2], [a0, y0, z0 - 0.2], [a0, y0, z0 + 1.6], [b0, y1, z1 + 1.6]]
    if (sx > 0) steel.quad(n[0], n[1], n[2], n[3]); else steel.quad(n[1], n[0], n[3], n[2])
  }
}

// --- The wings: each a continuous white sheet sweeping from the spine rim up
// and out to the tips, its upper face ridged with the ribs (a ridge per rib,
// a shallow valley between), so it reads as one white mass with rib relief ---
const PITCH = 3.4, T = 2.7
const SEG = 4
const ribYs: number[] = []
for (let y = -LY + 1; y <= LY - 1 + 1e-6; y += PITCH) ribYs.push(y)
const wingY = (y: number) => Math.max(-LY + 1, Math.min(LY - 1, y))
function centre(y: number) {
  const yy = wingY(y), zs = ZS(yy), h = H(yy), w = W(yy)
  const a = [Sy(yy) + 0.6, zs + 0.4], c = [Sy(yy) + 2.2, zs + (h - zs) * 0.6], b = [w, h]
  const pts = Array.from({ length: SEG + 1 }, (_, i) => bez(a, c, b, i / SEG))
  return pts.map((p, i) => {
    const q = pts[Math.min(SEG, i + 1)], r = pts[Math.max(0, i - 1)]
    let tx = q[0] - r[0], tz = q[1] - r[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l
    return { x: p[0], z: p[1], nx: -tz, nz: tx }
  })
}
function facing(p: Part, a: V3, b: V3, c: V3, d: V3, want: V3) {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]]
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  if (n[0] * want[0] + n[1] * want[1] + n[2] * want[2] >= 0) p.quad(a, b, c, d); else p.quad(a, d, c, b)
}
const stations: { y: number; ridge: boolean }[] = []
for (let k = 0; k < ribYs.length; k++) {
  if (k) stations.push({ y: (ribYs[k - 1] + ribYs[k]) / 2, ridge: false })
  stations.push({ y: ribYs[k], ridge: true })
}
for (const side of [1, -1]) {
  const top = stations.map(({ y, ridge }) => centre(y).map((c) => [side * (c.x + c.nx * (ridge ? 0.5 : -0.1)), y, c.z + c.nz * (ridge ? 0.5 : -0.1)] as V3))
  const under = (y: number) => centre(y).map((c) => [side * (c.x - c.nx * 0.45), y, c.z - c.nz * 0.45] as V3)
  const bot = stations.map(({ y }) => under(y))
  const bys = [stations[0].y, ...ribYs.slice(1, -1), stations[stations.length - 1].y]
  const botc = bys.map(under)
  for (let k = 0; k < stations.length - 1; k++) {
    for (let i = 0; i < SEG; i++) {
      const c = centre((stations[k].y + stations[k + 1].y) / 2)[i]
      const up: V3 = [side * c.nx, 0, c.nz]
      facing(steel, top[k][i], top[k + 1][i], top[k + 1][i + 1], top[k][i + 1], up)
    }
    // the tip edge
    const c = centre(stations[k].y)[SEG]
    const out: V3 = [side * (c.z > 0 ? 1 : 1), 0, 0.3]
    facing(steel, top[k][SEG], top[k + 1][SEG], bot[k + 1][SEG], bot[k][SEG], out)
  }
  // the underside, on a coarser grid (it is smooth)
  for (let k = 0; k < botc.length - 1; k++) for (let i = 0; i < SEG; i++) {
    const c = centre((bys[k] + bys[k + 1]) / 2)[i]
    facing(steel, botc[k][i], botc[k + 1][i], botc[k + 1][i + 1], botc[k][i + 1], [-side * c.nx, 0, -c.nz])
  }
  // the two end edges of the sheet
  for (const k of [0, stations.length - 1]) {
    const want: V3 = [0, k ? 1 : -1, 0]
    for (let i = 0; i < SEG; i++) facing(steel, top[k][i], top[k][i + 1], bot[k][i + 1], bot[k][i], want)
  }
  for (const y of ribYs) {
    const zs = ZS(y)
    // The rib's lower run: down the glazed shell to the plaza, 0.5 m proud (outer face and sides only).
    {
      const prof = profile(y), idx = [0, 2], m = idx.length - 1
      // offset each profile point 0.5 m outward along the profile's normal
      const low: [number, number][] = idx.map((ii) => {
        const q = prof[Math.min(prof.length - 1, ii + 1)], r = prof[Math.max(0, ii - 1)]
        let tx = q[0] - r[0], tz = q[1] - r[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l
        return [prof[ii][0] + tz * 0.5, prof[ii][1] - tx * 0.5] as [number, number]
      })
      for (let k = 0; k < m; k++) {
        const [xa, za] = low[k], [xb, zb] = low[k + 1]
        const o = (x: number, z: number, dy: number): V3 => [side * x, y + dy * 0.8, z]
        const ia = [xa - 0.6, za], ib = [xb - 0.6, zb]
        const quads: V3[][] = [
          [o(xa, za, -T / 2), o(xa, za, T / 2), o(xb, zb, T / 2), o(xb, zb, -T / 2)],
          [o(ia[0], ia[1], -T / 2), o(xa, za, -T / 2), o(xb, zb, -T / 2), o(ib[0], ib[1], -T / 2)],
          [o(xa, za, T / 2), o(ia[0], ia[1], T / 2), o(ib[0], ib[1], T / 2), o(xb, zb, T / 2)],
        ]
        for (const q of quads) { if (side < 0) steel.quad(q[0], q[3], q[2], q[1]); else steel.quad(q[0], q[1], q[2], q[3]) }
      }
    }
  }
}

finishModel('The Oculus', 'nyc-oculus', [
  { part: steel, material: finish('oculus-steel', 0xf3f1ec) },
  { part: wall, material: windowVariant(2, 0x8fa1b0) },
  { part: sky, material: PALETTE.glass },
], { bearing: 128.0, osm: 'way/278033606', height: 39 }, 6500)
