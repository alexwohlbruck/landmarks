/**
 * Paramount Theatre, Oakland — original procedural geometry, CC0-1.0.
 * bun generators/sf-paramount-theatre.ts
 *
 * Frame: built turned to the block, BEARING 27.3 (the block's long side runs
 * 27.3° east of north). x across the block (+x = east-south-east, the
 * Broadway front), y along it (+y = north-north-east, towards 21st Street),
 * z up, metres. Origin = the area centroid of the OSM outline way/666976181.
 *
 * Evidence
 * - OSM way/666976181 (outline, 33 m) with parts way/666976187 (the
 *   auditorium and lobby, 33 m), way/666974159, 666974169, 666976173 and
 *   666976174 (one-storey annexes). The outline's Broadway front sits at
 *   x = 52.1, 3 m behind the facade the lidar shows; the lidar wins there.
 * - USGS 3DEP lidar (CA_AlamedaCo_2_2021) at 0.5-1 m in the turned frame
 *   (/tmp/city/sf/work/oak/frame.py). y = 0 is the street level round the
 *   block, 5.9 m NAVD88 (the sidewalks read 5.9-6.7). The footprint's lowest
 *   return, 3.9 m, is a sunken areaway against the south wall, which the map's
 *   terrain cannot see; it is not used. Above street level: the auditorium,
 *   62 x 42 m, walls 26 m and a low vaulted roof to 30; the lobby wing
 *   (x 21.5..47.5, 17 m wide) 25.9 with parapets 27.6; the facade slab
 *   (x 47.5..55) 32, the mosaic's crown 36, and the blade sign, 4 m on plan
 *   at its top, 38 m and reaching 2.5 m out over the sidewalk; the marquee's
 *   top 7.6. Annexes 8-11.5 m.
 * - Published (Wikipedia; NRHP; National Historic Landmark): 1931, Timothy
 *   Pflueger; art deco; 3,040 seats; the facade's tile mosaic of two giant
 *   figures (by Gerald Fitzgerald) either side of the vertical PARAMOUNT sign.
 * - Commons daylight photos: "Paramount.jpg" and "Paramount front facade.jpg"
 *   (sierra jane, CC BY 2.0, the front and the blade from the street);
 *   "Paramount Theatre (Oakland, CA).JPG" (Sanfranman59, CC BY-SA 3.0, from
 *   the south-east: the auditorium box behind); "Paramount Theatre Building,
 *   Oakland, California LCCN2010630218" and "Paramount Theatre in Oakland,
 *   California LCCN2013635154/5" (Carol M. Highsmith, public domain);
 *   "Paramount Theater, Oakland (4582609961).jpg" (Sandra Cohen-Rose and Colin
 *   Rose, CC BY-SA 2.0); "Oakland Paramount Theatre exterior, 1975.jpg" and
 *   the HABS views from the north-east and south-east (Jack E. Boucher,
 *   public domain).
 *
 * Famous-sign exception (STYLE.md): the blade carries PARAMOUNT as extruded
 * block letters, upright and stacked, on both faces.
 *
 * The mosaic is drawn as two flat gold panels in a maroon tile frame, not as
 * figures. Estimated from the photos: the mosaic's extent, the frame's
 * margins, letter sizes (2.75 m tall), the marquee's depth and boards, the
 * entrance, the auditorium's shallow pilasters and the annexes' detail.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const BEARING = 27.3
const ANCHOR = { lng: -122.2685961, lat: 37.8098546 }
const stucco = new Part(), roof = new Part(), tile = new Part(), mosaic = new Part(), trim = new Part(), win = new Part()

function block(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, ch = 0.3, top: Part | null = p) {
  const r: XY[] = [[x0 + ch, y0], [x1 - ch, y0], [x1, y0 + ch], [x1, y1 - ch], [x1 - ch, y1], [x0 + ch, y1], [x0, y1 - ch], [x0, y0 + ch]]
  for (let i = 0; i < 8; i++) {
    const a = r[i], b = r[(i + 1) % 8]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (let i = 1; i < 7; i++) top.tri([r[0][0], r[0][1], z1], [r[i][0], r[i][1], z1], [r[i + 1][0], r[i + 1][1], z1])
}
/** A star-shaped plan polygon (anticlockwise) extruded from 0 to h; cap fanned from `c`. */
function prism(p: Part, poly: XY[], h: number, c: XY, top: Part = roof) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    p.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], h], [a[0], a[1], h])
    top.tri([c[0], c[1], h], [a[0], a[1], h], [b[0], b[1], h])
  }
}

type Face = { a: XY; t: XY; n: XY; len: number }
const face = (a: XY, b: XY): Face => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  return { a, t, n: [t[1], -t[0]], len }
}
const at = (f: Face, s: number, d: number, z: number): V3 => [f.a[0] + f.t[0] * s + f.n[0] * d, f.a[1] + f.t[1] * s + f.n[1] * d, z]
const facesOf = (x0: number, x1: number, y0: number, y1: number): Face[] =>
  [face([x0, y0], [x1, y0]), face([x1, y0], [x1, y1]), face([x1, y1], [x0, y1]), face([x0, y1], [x0, y0])]
const panel = (p: Part, f: Face, s0: number, s1: number, z0: number, z1: number, d = 0.05) =>
  p.quad(at(f, s0, d, z0), at(f, s1, d, z0), at(f, s1, d, z1), at(f, s0, d, z1))
function relief(p: Part, f: Face, s0: number, s1: number, d1: number, z0: number, z1: number, under = false) {
  p.quad(at(f, s0, d1, z0), at(f, s1, d1, z0), at(f, s1, d1, z1), at(f, s0, d1, z1))
  p.quad(at(f, s0, 0, z0), at(f, s0, d1, z0), at(f, s0, d1, z1), at(f, s0, 0, z1))
  p.quad(at(f, s1, d1, z0), at(f, s1, 0, z0), at(f, s1, 0, z1), at(f, s1, d1, z1))
  p.quad(at(f, s0, d1, z1), at(f, s1, d1, z1), at(f, s1, 0, z1), at(f, s0, 0, z1))
  if (under) p.quad(at(f, s0, 0, z0), at(f, s1, 0, z0), at(f, s1, d1, z0), at(f, s0, d1, z0))
}

// ---------------------------------------------------------------------------
// The auditorium: a plain cream box with shallow pilasters and a low vault.
const AUD: XY[] = [[-30.9, -23.4], [-16.4, -23.4], [-16.5, -19.2], [4.5, -20.8], [21.5, -19.9], [21.5, -10.3], [22.8, 5.2], [18.3, 19.4], [-10.5, 15.1], [-19, 13.2], [-26.2, 11], [-39.6, 10.4]]
const WALL = 26, CROWN = 30
{
  const c: XY = [-17, -5] // the plan is star-shaped about this point
  for (let i = 0; i < AUD.length; i++) {
    const a = AUD[i], b = AUD[(i + 1) % AUD.length]
    stucco.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], WALL], [a[0], a[1], WALL])
    roof.tri([c[0], c[1], WALL], [a[0], a[1], WALL], [b[0], b[1], WALL])
    // parapet coping
    const f = face(a, b)
    relief(stucco, f, 0, f.len, 0.25, WALL - 0.6, WALL + 0.5)
    // shallow pilasters every ~7 m on the long walls
    const n = Math.floor(f.len / 7)
    for (let k = 1; k < n; k++) relief(stucco, f, (f.len * k) / n - 0.7, (f.len * k) / n + 0.7, 0.3, 0, WALL - 0.6)
  }
}
// the low vault over the hall: a shallow hip rising 4 m to a ridge where the
// lidar peaks
{
  const r = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]
  roof.loft([r(-28, 20, -18.5, 11, WALL), r(-8, 13, -3.5, 1.5, CROWN)])
  roof.cap(r(-8, 13, -3.5, 1.5, CROWN), true)
}
// the stage house's raised roof at the back
block(stucco, -29, -22, -21, -11, WALL - 1, 28.5, 0.3, roof)

// Annexes (one-storey parts in OSM; the lidar reads them 8-11.5 m)
prism(stucco, [[1.2, 18.9], [17.6, 19.4], [13.1, 34.5], [0.5, 31.2], [1.7, 25.8], [0.7, 23.5]], 10.5, [8, 26])
prism(stucco, [[-10.5, 15.1], [1.2, 16.9], [1.2, 18.9], [-1.4, 18.5], [-1.9, 19.9], [-10.5, 18]], 3.5, [-5, 17.5])
prism(stucco, [[-39.6, 10.4], [-26.2, 11], [-26.6, 14.9], [-29, 22.7], [-42, 19.7]], 11.5, [-33, 16])
prism(stucco, [[-26.2, 11], [-19, 13.2], [-20.5, 16.7], [-26.6, 14.9]], 11.5, [-23, 14])
prism(stucco, [[5.1, -23.6], [4.5, -20.8], [-16.5, -19.2], [-16.4, -23.4]], 8, [-6, -22])
prism(stucco, [[12.4, -23.4], [18.6, -23.3], [18.9, -20.1], [11.7, -20.5]], 11, [15, -22])

// ---------------------------------------------------------------------------
// The lobby wing, between the auditorium and Broadway.
const LY0 = -11, LY1 = 6, LH = 25.9
block(stucco, 21.5, 47.5, LY0, LY1, 0, LH, 0.3, roof)
for (const f of facesOf(21.5, 47.5, LY0, LY1)) relief(stucco, f, 0, f.len, 0.2, LH - 0.4, LH + 1.7)
{
  // tall slot windows on the open north side, as in the HABS views
  const f = facesOf(21.5, 47.5, LY0, LY1)[2]
  for (let i = 0; i < 5; i++) { const sc = 4 + i * 4.2; panel(win, f, sc - 0.6, sc + 0.6, 12, 22) }
}

// ---------------------------------------------------------------------------
// The facade: a maroon tile slab, its front a frame round two gold mosaic
// panels that rise above it as a crown, split by the blade.
const SX0 = 47.5, SX1 = 55, SY0 = -11, SY1 = 6.5, SH = 32, CR = 36
const MY0 = -9.4, MY1 = 4.9, CX0 = 51 // the mosaic crown's extent
const BY = -2.5, BT = 0.7 // blade centre line and half thickness
block(tile, SX0, SX1, SY0, SY1, 0, SH, 0.25, tile)
block(tile, CX0, SX1, MY0, MY1, SH - 0.5, CR, 0.15, tile)
{
  const front = face([SX1, SY0], [SX1, SY1]) // s runs along +y
  const crown = face([SX1, MY0], [SX1, MY1])
  const sOf = (y: number) => y - SY0
  // the two mosaic panels, from above the marquee to the crown's top, and a
  // tile band near the top where the figures' heads sit in a gold field
  for (const [y0, y1] of [[MY0 + 0.9, BY - BT - 0.2], [BY + BT + 0.2, MY1 - 0.9]]) {
    panel(mosaic, front, sOf(y0), sOf(y1), 8.6, CR - 0.25, 0.06)
    panel(tile, front, sOf(y0), sOf(y1), 10.4, 11.0, 0.09) // the base band of the mosaic
  }
  void crown
  // the entrance under the marquee: glazed doors in a cream surround
  panel(trim, front, sOf(MY0), sOf(MY1), 0, 4.3, 0.04)
  panel(win, front, sOf(MY0) + 0.8, sOf(MY1) - 0.8, 0.2, 3.6, 0.08)
}
// The marquee: a cream box with dark letter boards on its three faces.
{
  const x0 = SX1, x1 = 58.6, y0 = SY0 + 0.6, y1 = SY1 - 0.6, z0 = 3.9, z1 = 7.8
  block(trim, x0, x1, y0, y1, z0, z1, 0.15, roof)
  trim.quad([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]) // soffit
  const F = facesOf(x0, x1, y0, y1)
  for (const f of [F[0], F[1], F[2]]) {
    panel(win, f, 0.3, f.len - 0.3, z0 + 0.3, z0 + 1.7, 0.04)
    panel(win, f, 0.3, f.len - 0.3, z0 + 2.0, z1 - 0.35, 0.04)
  }
}

// ---------------------------------------------------------------------------
// The blade: cream, rising from the marquee to above the crown, reaching
// 2.5 m out over the sidewalk, PARAMOUNT stacked on both faces.
const BX0 = CX0 + 0.5, BX1 = 57.5, BZ0 = 7.8, BZ1 = 38
block(trim, BX0, BX1, BY - BT, BY + BT, BZ0, BZ1, 0.2, trim)
// a stepped cap, as wide as the lidar's 4 m at the top
block(trim, BX0, BX1 - 0.4, BY - 1.6, BY + 1.6, BZ1 - 2.2, BZ1 - 0.6, 0.2, trim)
{
  const H = 2.75, W = 2.15, ST = 0.55, GAP = 0.3
  type Poly = [number, number][]
  const rect = (u0: number, v0: number, u1: number, v1: number): Poly => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const G: Record<string, Poly[]> = {
    P: [rect(0, 0, ST, H), rect(ST, H - ST, W, H), rect(ST, H / 2 - ST / 2, W, H / 2 + ST / 2), rect(W - ST, H / 2, W, H - ST)],
    A: [[[0, 0], [ST, 0], [W / 2 + ST / 4, H], [W / 2 - ST / 4 - 0.15, H]], [[W - ST, 0], [W, 0], [W / 2 + ST / 4 + 0.15, H], [W / 2 - ST / 4, H]], rect(0.45, 0.65, W - 0.45, 0.65 + ST * 0.9)],
    R: [rect(0, 0, ST, H), rect(ST, H - ST, W, H), rect(ST, H / 2 - ST / 2, W, H / 2 + ST / 2), rect(W - ST, H / 2, W, H - ST), [[W / 2 - 0.1, H / 2 - ST / 2], [W / 2 + ST - 0.1, H / 2 - ST / 2], [W, 0], [W - ST, 0]]],
    M: [rect(0, 0, ST, H), rect(W - ST, 0, W, H), [[ST, H], [ST, H - 0.9], [W / 2, H * 0.35], [W / 2, H * 0.35 + 0.8]], [[W - ST, H], [W / 2, H * 0.35 + 0.8], [W / 2, H * 0.35], [W - ST, H - 0.9]]],
    O: [rect(0, 0, ST, H), rect(W - ST, 0, W, H), rect(ST, 0, W - ST, ST), rect(ST, H - ST, W - ST, H)],
    U: [rect(0, 0, ST, H), rect(W - ST, 0, W, H), rect(ST, 0, W - ST, ST)],
    N: [rect(0, 0, ST, H), rect(W - ST, 0, W, H), [[ST, H], [ST, H - 0.9], [W - ST, 0], [W - ST, 0.9]]],
    T: [rect(0, H - ST, W, H), rect(W / 2 - ST / 2, 0, W / 2 + ST / 2, H - ST)],
  }
  const word = 'PARAMOUNT'
  // two faces of the blade: outward -y and +y
  const faces = [face([BX0, BY - BT], [BX1, BY - BT]), face([BX1, BY + BT], [BX0, BY + BT])]
  for (const f of faces) {
    // the letters sit on the part that projects past the facade
    const sMid = f.t[0] > 0 ? (SX1 - 0.15 + BX1) / 2 - BX0 : BX1 - (SX1 - 0.15 + BX1) / 2
    ;[...word].forEach((c, k) => {
      const z0 = BZ1 - 2.6 - (k + 1) * H - k * GAP
      for (const poly of G[c]) {
        const pts = poly.map(([pu, pv]) => [sMid - W / 2 + pu, z0 + pv] as [number, number])
        const d0 = 0.0, d1 = 0.16
        for (let i = 1; i < pts.length - 1; i++) tile.tri(at(f, pts[0][0], d1, pts[0][1]), at(f, pts[i][0], d1, pts[i][1]), at(f, pts[i + 1][0], d1, pts[i + 1][1]))
        for (let i = 0; i < pts.length; i++) {
          const A = pts[i], B = pts[(i + 1) % pts.length]
          tile.quad(at(f, A[0], d0, A[1]), at(f, B[0], d0, B[1]), at(f, B[0], d1, B[1]), at(f, A[0], d1, A[1]))
        }
      }
    })
  }
}

const parts = [
  { part: stucco, material: finish('paramount-stucco', 0xece0c8) },
  { part: roof, material: PALETTE.roof },
  { part: tile, material: finish('paramount-maroon', 0x9e5552) },
  { part: mosaic, material: finish('paramount-mosaic', 0xd39f66) },
  { part: trim, material: PALETTE.trim },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Paramount Theatre', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: BZ1,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/666976181', 'way/666976187', 'way/666974159', 'way/666974169', 'way/666976173', 'way/666976174'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/sf-paramount-theatre.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
