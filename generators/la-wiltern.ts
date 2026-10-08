/**
 * The Wiltern and the Pellissier Building (Morgan, Walls & Clements, 1931),
 * Wilshire Blvd at Western Ave, Los Angeles — original procedural geometry,
 * CC0-1.0.
 * bun generators/la-wiltern.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the area centroid of
 * OSM way/388772956 (-118.3085199, 34.061279), on the lowest ground under it
 * (lidar ~61 m). Bearing 0: the block is square to the grid.
 *
 * Blue-green terracotta art deco: the twelve-storey tower set diagonally on
 * the Wilshire/Western corner, its broad face to the corner, its top stepped
 * and notched; low wings along both streets; the theatre's plain mass
 * behind. Colour is the identity, then the diagonal tower and its crown.
 *
 * Sources:
 * - Plan: OSM way/388772956 (4,964 m2, height 57.3) and its parts
 *   way/1416423923 (the tower, a chamfered 26 × 15 m rectangle at 45°, 12
 *   levels) and way/1416423924 (the rest, 2 levels).
 * - Heights: LA County lidar DSM (LARIAC, 2 m grid, sampled 2026), above the
 *   ground: tower parapet ~53 m, crown peaks 57–59 m; the street wings
 *   13 m; the theatre 21–23 m with the stage house to 24 m; a 6 m corner
 *   entrance block; a 17 m round pavilion at the Wilshire/Oxford end.
 *   The brief's "12-storey office wings" is the tower only: the lidar shows
 *   the wings at about three storeys, as the photos do.
 * - Photos: w1 "Highsmithwilterntheater.jpg" (Carol M. Highsmith, public
 *   domain; from the corner, north-west: the tower's broad face, stepped
 *   sides, the notched crown, both wings); w8 "The corner of Western and
 *   Wilshire Aves – L. A." (Al Pavangkanan, CC BY 2.0; from the north-west,
 *   lower); x2 "Wilshire & Western, Los Angeles" (InSapphoWeTrust, Flickr,
 *   CC BY-SA 2.0; the corner entrance and the Wilshire wing); w7 "Wilshire
 *   Boulevard looking east to Western" (Downtowngal, CC BY-SA 4.0; the
 *   tower from the west along Wilshire).
 * - Overhead: USGS NAIP (public domain): the diagonal tower, the theatre
 *   roof, the green round pavilion at the east end.
 *
 * Estimated: the masses (rectangles fitted to the DSM), the tower's piers
 * and window bays (w1: one panel per bay, three floors tall), the crown's
 * notches, the colours (w1, pulled to palette lightness). Left out: the
 * vertical WILTERN signs, the marquee, the terracotta ornament.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, block, panel, ccw, offset, at, type XY } from './la-lacma-geffen'

const turq = new Part(), plain = new Part(), win = new Part(), roof = new Part(), trim = new Part()

/** Window bays on edge a→b of a CCW ring: panels `rows` high between zLo and zHi. */
function bays(a: XY, b: XY, zLo: number, zHi: number, rows: number, bay = 4.2, w = 2.3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor((L - 1.5) / bay)
  if (n < 1) return
  const m = (L - n * bay) / 2, h = (zHi - zLo) / rows
  for (let k = 0; k < n; k++) {
    const c = m + (k + 0.5) * bay
    for (let r = 0; r < rows; r++) panel(win, a, b, c - w / 2, c + w / 2, zLo + r * h + 0.5, zLo + (r + 1) * h - 0.5)
  }
}
const rect = (u0: number, u1: number, v0: number, v1: number): XY[] => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]

// ---------- the theatre (plain, behind) ----------
block(plain, roof, rect(-19, 37, -32, 3), 0, 21.5, 0.4)
block(plain, roof, rect(22, 36.5, -30, 1), 21.5, 24, 0.4)               // stage house

// ---------- the street wings (13 m, turquoise) ----------
const WIL = rect(-18, 49.8, 6, 29.4), WES = rect(-41, -19, -30.5, 6)
block(turq, roof, WIL, 0, 13, 0.45)
block(turq, roof, WES, 0, 13, 0.45)
// windows: the Wilshire face (north) and the Western face (west), one per
// window, two floors (x2, w1)
bays(WIL[2], WIL[3], 4.8, 12, 2)
bays(WES[3], WES[0], 4.8, 12, 2)
bays(WIL[1], WIL[2], 4.8, 12, 2)
// shopfronts at street level
panel(win, WIL[2], WIL[3], 3, 64, 0.6, 3.6, 0.1)
panel(win, WES[3], WES[0], 3, 33, 0.6, 3.6, 0.1)

// the round pavilion at the Wilshire/Oxford end (NAIP: a green dome)
{
  const C: XY = [44.6, 23.6], R = 5, N = 14, z1 = 15.5
  for (let i = 0; i < N; i++) {
    const t0 = (i / N) * 2 * Math.PI, t1 = ((i + 1) / N) * 2 * Math.PI
    const p = (t: number, r: number): XY => [C[0] + r * Math.cos(t), C[1] + r * Math.sin(t)]
    turq.quad(at(p(t0, R), 0), at(p(t1, R), 0), at(p(t1, R), z1), at(p(t0, R), z1))
    // a low dome in three rings
    for (let k = 0; k < 3; k++) {
      const a0 = (k / 3) * Math.PI / 2, a1 = ((k + 1) / 3) * Math.PI / 2
      const q = (t: number, a: number): V3 => [...p(t, R * Math.cos(a)), z1 + 3 * Math.sin(a)] as V3
      if (k < 2) trim.quad(q(t0, a0), q(t1, a0), q(t1, a1), q(t0, a1))
      else trim.tri(q(t0, a0), q(t1, a0), [C[0], C[1], z1 + 3])
    }
  }
}

// ---------- the corner entrance block (6 m) in front of the tower ----------
block(turq, roof, ccw([[-43.65, 19.3], [-43.65, 21.1], [-43.3, 23.3], [-42.5, 25.6], [-41.0, 27.7], [-39.3, 29.6], [-37.0, 31.0], [-35.0, 31.9], [-33.0, 32.3], [-31.0, 32.25], [-31.0, 28.4], [-26.7, 28.4], [-24.0, 27.9], [-37.4, 14.0], [-41.0, 17.3]]), 0, 6, 0.4)

// ---------- the tower ----------
// The OSM part: a 26 × 15 m rectangle at 45° (19.3 m broad faces, 9 m ends), its broad face to the corner
// (north-west), corners chamfered. Main parapet 53 m; the side bays step down
// near the top and the middle of each broad face rises in notched steps to
// 57–59 m (w1, DSM).
{
  const TOWER: XY[] = ccw([[-24.03, 27.89], [-37.39, 13.95], [-38.02, 9.76], [-31.56, 3.4], [-26.7, 3.85], [-13.34, 17.78], [-13.31, 21.68], [-19.79, 28.05]])
  const TOP = 53
  block(turq, roof, TOWER, 0, TOP, 0.45)
  // frame: centre c, along-face unit t (north-east), across n (north-west)
  const c: XY = [-25.4, 15.6], t: XY = [Math.SQRT1_2, Math.SQRT1_2], n: XY = [-Math.SQRT1_2, Math.SQRT1_2]
  const P = (s: number, d: number): XY => [c[0] + t[0] * s + n[0] * d, c[1] + t[1] * s + n[1] * d]
  // bays on the two broad faces (north-west and south-east), three floors a
  // panel, from the third floor up, with piers between (w1)
  for (let i = 0; i < TOWER.length; i++) {
    const A = TOWER[i], B = TOWER[(i + 1) % TOWER.length], L = Math.hypot(B[0] - A[0], B[1] - A[1])
    if (L > 15) bays(A, B, 8, TOP - 2.5, 4, 3.7, 2.3)          // broad faces
    else if (L > 7) bays(A, B, 8, TOP - 2.5, 4, 3.8, 2.2)      // the ends: two columns
  }
  // the crown: two stepped tiers over the middle of the slab, each with a
  // notched parapet of piers (w1: the crenellated top)
  const tier = (hs: number, hd: number, z0: number, z1: number) => {
    block(turq, roof, ccw([P(-hs, -hd), P(hs, -hd), P(hs, hd), P(-hs, hd)]), z0, z1, 0.35)
  }
  tier(9.0, 5.6, TOP, 55.5)
  tier(5.0, 4.0, 55.5, 57.5)
  // crenellations: short piers along both broad faces of each tier
  const piers = (hs: number, hd: number, z0: number, h: number, nP: number) => {
    for (let k = 0; k < nP; k++) {
      const s = -hs + 0.9 + (k * (2 * hs - 1.8)) / (nP - 1)
      for (const d of [-hd + 0.7, hd - 0.7]) {
        block(turq, turq, ccw([P(s - 0.8, d - 0.7), P(s + 0.8, d - 0.7), P(s + 0.8, d + 0.7), P(s - 0.8, d + 0.7)]), z0, z0 + h, 0.2)
      }
    }
  }
  piers(9.4, 7.0, TOP, 2.0, 5)
  piers(8.6, 5.2, 55.5, 1.8, 4)
  piers(4.6, 3.6, 57.5, 1.6, 2)
}

const parts = [
  { part: turq, material: finish('wiltern-turquoise', 0x8bbcb4) },
  { part: plain, material: finish('wiltern-plaster', 0xd9dcd5) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.patina },
]
if (import.meta.main) {
  const { glb, triangles } = finishModel('la-wiltern', 'The Wiltern', parts, {
    bearing: 0, height: 59, replaces: ['way/388772956', 'way/1416423923', 'way/1416423924'],
  })
  const out = process.argv[2] ?? new URL('../models/la-wiltern.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
void offset
