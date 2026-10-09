/**
 * One Vanderbilt — procedural, CC0-1.0, no textures.
 * bun generators/nyc-one-vanderbilt.ts
 *
 * Map frame: x = model east (Vanderbilt Avenue, facing Grand Central), y =
 * model north (East 43rd Street), z up, metres. Placed at bearing 29°, the
 * Manhattan grid. Anchor: area centroid of the OSM outline way/265875648.
 * Kit from nyc-570-lexington.ts.
 *
 * Evidence
 * - OSM: outline way/265875648 and its 24 building:part ways
 *   (1470380430–53), which map the four interlocking volumes: each has a
 *   flat top (315, 330, 350 and 397 m) and skillion parts for its sloping
 *   outer faces, which run from the street line at the ground to the top's
 *   edge; a 75 m podium along Madison Avenue and 43rd Street; a 12 m corner
 *   block at 43rd and Vanderbilt; the spire part to 427 m. The volumes here
 *   are frustums between those base and top rectangles.
 * - Published: 427 m to the spire tip, 397 m roof, 73 floors, Kohn Pedersen
 *   Fox, completed 2020 (Wikipedia). Glass curtain wall with pale terracotta
 *   spandrels, warmer terracotta at the base, a glass crown and spire.
 * - No lidar: the 2017 USGS flight predates the tower. Heights are OSM's,
 *   which agree with the published ones.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-one-vanderbilt/photos/credits.txt
 *
 * Facade: broad glass bays between pale vertical piers, four storeys to a
 * panel, with terracotta-toned piers and spandrels on the lower ≈ 60 m; the
 * volumes' corners are notched (re-entrant steps up every corner, faced in
 * a darker glass), which is how the interlocking volumes show on the real
 * tower.
 *
 * Estimated: bay width (≈ 5.5 m), notch depth (2.6 m), the warm base height,
 * the crown's steps and the spire's thickness. The canopy and public hall at 42nd and Vanderbilt are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, prism, spire, circle, chamferRect, capPoly, type XY } from './nyc-570-lexington'

const glass = new Part(), notchGlass = new Part(), pier = new Part(), warm = new Part(), roof = new Part(), metal = new Part()
const WARM_TOP = 60, BAY = 5.5, ROW = 17.6, PIER = 1.9, BREAK = 1.8

type R = [number, number, number, number] // x0, y0, x1, y1

/** A rectangle with a square notch d deep at each corner, counter-clockwise. */
function notched(r: R, d: number): XY[] {
  const [x0, y0, x1, y1] = r
  if (d <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + d, y0], [x1 - d, y0], [x1 - d, y0 + d], [x1, y0 + d], [x1, y1 - d], [x1 - d, y1 - d],
    [x1 - d, y1], [x0 + d, y1], [x0 + d, y1 - d], [x0, y1 - d], [x0, y0 + d], [x0 + d, y0 + d]]
}

/**
 * One planar (possibly leaning) face from a0→b0 at z0 to a1→b1 at z1, seen
 * from outside. Backing in pale piers (terracotta below WARM_TOP), then glass
 * bays laid 0.06 m proud with piers between them and a pale break every four
 * storeys. `plain` faces get glass only (the notches), `hidden` faces backing only.
 */
function face(a0: XY, b0: XY, a1: XY, b1: XY, z0: number, z1: number, kind: 'bays' | 'plain' | 'hidden') {
  const P = (u: number, t: number, off = 0): V3 => {
    const a: XY = [a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t]
    const b: XY = [b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t]
    return [a[0] + (b[0] - a[0]) * u + n[0] * off, a[1] + (b[1] - a[1]) * u + n[1] * off, z0 + (z1 - z0) * t + n[2] * off]
  }
  // Outward normal.
  const e1: V3 = [b0[0] - a0[0], b0[1] - a0[1], 0], e2: V3 = [a1[0] - a0[0], a1[1] - a0[1], z1 - z0]
  let n: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
  const l = Math.hypot(...n) || 1; n = [n[0] / l, n[1] / l, n[2] / l]
  const quad = (p: Part, u0: number, u1: number, t0: number, t1: number, off = 0) => p.quad(P(u0, t0, off), P(u1, t0, off), P(u1, t1, off), P(u0, t1, off))
  if (kind === 'plain') { quad(notchGlass, 0, 1, 0, 1); return }
  const tw = z0 < WARM_TOP && z1 > WARM_TOP ? (WARM_TOP - z0) / (z1 - z0) : z1 <= WARM_TOP ? 1 : 0
  if (tw > 0) quad(warm, 0, 1, 0, tw)
  if (tw < 1) quad(pier, 0, 1, tw, 1)
  if (kind === 'hidden') return
  const wMid = Math.hypot((b0[0] + b1[0]) / 2 - (a0[0] + a1[0]) / 2, (b0[1] + b1[1]) / 2 - (a0[1] + a1[1]) / 2)
  const bays = Math.max(1, Math.round(wMid / BAY)), H = z1 - z0
  const rows = Math.max(1, Math.round(H / ROW))
  const pu = PIER / 2 / wMid, pt = BREAK / 2 / H
  for (let r = 0; r < rows; r++) {
    const t0 = r / rows + (r ? pt : 2 * pt), t1 = (r + 1) / rows - pt
    for (let k = 0; k < bays; k++) quad(glass, k / bays + pu, (k + 1) / bays - pu, t0, t1, 0.06)
  }
}

/**
 * A tapering, corner-notched volume from rectangle `lo` at z0 to `hi` at z1.
 * `show` lists the main faces drawn with bays (0 south, 1 east, 2 north,
 * 3 west); the others are inside neighbouring volumes.
 */
function volume(lo: R, hi: R, z0: number, z1: number, d: number, show: number[]) {
  const A = notched(lo, d), B = notched(hi, d)
  const main = d > 0 ? [0, 3, 6, 9] : [0, 1, 2, 3]
  for (let i = 0; i < A.length; i++) {
    const j = (i + 1) % A.length, m = main.indexOf(i)
    const kind = m < 0 ? 'plain' : show.includes(m) ? 'bays' : 'hidden'
    face(A[i], A[j], B[i], B[j], z0, z1, kind)
  }
  capPoly(roof, B, z1)
}

// Podium along Madison Avenue and 43rd Street (way/1470380430, 75 m) and the
// low corner block at 43rd and Vanderbilt (way/1470380438, 12 m).
const pod: XY[] = [[-32.2, -24.6], [-27.4, -24.6], [-27.4, 19.2], [16.5, 19.2], [16.5, 30.0], [-32.4, 29.6]]
for (let i = 0; i < pod.length; i++) {
  const a = pod[i], b = pod[(i + 1) % pod.length]
  face(a, b, a, b, 0, 75, i === 4 || i === 5 || i === 0 ? 'bays' : 'hidden')
}
capPoly(roof, pod, 75)
prism({ wall: warm, win: null, roof, ring: [[16.5, 24.7], [32.5, 24.7], [32.5, 30.2], [16.5, 30.2]], z0: 0, z1: 12, facade: null, bevel: 0.3 })

// The four volumes (base rectangle at the street, top rectangle from the
// flat roof part), lowest first.
volume([-29.6, -30.6, 29.0, 19.2], [-17.5, -18.0, 12.6, 15.5], 0, 315, 2.6, [0, 1, 3])      // A, south-west
volume([0.0, -20.9, 32.8, 24.8], [1.9, -15.2, 22.6, 17.6], 0, 330, 2.6, [0, 1, 2])          // B, east
volume([-17.4, -10.0, 23.2, 27.2], [-11.9, -8.2, 5.9, 21.0], 12, 350, 2.6, [0, 1, 2, 3])     // C, north
// D, the glass crown: nearly sheer from inside C up to 385 m, then a
// narrower glass lantern to the 397 m roof and the spire.
volume([-3.5, -3.8, 13.7, 13.6], [-2.2, -1.9, 12.4, 12.7], 300, 385, 1.8, [0, 1, 2, 3])
volume([-2.2, -1.9, 12.4, 12.7], [0.6, 1.0, 9.6, 9.8], 385, 397, 0, [0, 1, 2, 3])
// Spire (way/1470380434), offset towards the north-east like the real one.
const sx = 7.5, sy = 8.5
prism({ wall: metal, win: null, roof: metal, ring: chamferRect(sx - 1.6, sy - 1.6, sx + 1.6, sy + 1.6, 0.6), z0: 396, z1: 401, facade: null, bevel: 0.2 })
spire(metal, circle(sx, sy, 0.9, 8), 401, [sx, sy, 427], true)

finishModel('One Vanderbilt', 'nyc-one-vanderbilt', [
  { part: glass, material: { ...windowVariant(1, 0xb4c8d8), name: 'window' } },
  { part: notchGlass, material: windowVariant(2, 0x8fa6b8) },
  { part: pier, material: finish('vanderbilt-pier', 0xeee7dc) },
  { part: warm, material: finish('vanderbilt-terracotta', 0xd6a98c) },
  { part: roof, material: PALETTE.roof },
  { part: metal, material: finish('vanderbilt-spire', 0xc8cdd0) },
], { bearing: 29, osm: 'way/265875648', height: 427 })
