/**
 * Hanshin Koshien Stadium (阪神甲子園球場), Nishinomiya: original procedural
 * geometry, CC0-1.0, no textures.  bun generators/nishinomiya-koshien.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/nishinomiya-koshien.glb, the low model (<= 5,000 triangles);
 * - models/nishinomiya-koshien.detail.glb, drawn from zoom 16 (<= 40,000):
 *   stepped seating, the Ginsan's trusses, open lattice light towers.
 *
 * OSM site: relation/9845926 (leisure=stadium, Q959811), not a building.
 * Map frame: x east, y north, z up, metres, bearing 0. Home plate is at the
 * north, centre field at the south (the field's axis runs within 1 deg of
 * north-south). Anchor = the centre of the four stand outlines' bounding box:
 * lng 135.361636, lat 34.721376.
 *
 * Identity, in order: the ivy-covered brick outer wall (green) all round,
 * with its arched gates; the Ginsan ("silver umbrella"), the silver roof over
 * the infield stand with lights along its front; the big black scoreboard at
 * the back of centre field; the four lattice light towers; the open alps and
 * outfield stands of dark green seats; the field itself is the map's.
 *
 * Evidence
 *  - OSM (measured in this frame): four building=stadium ways, the infield
 *    stand way/707987397 (sport=baseball) round home plate from the first-
 *    to the third-base side, the alps stands way/707987399 (east) and
 *    way/707987401 (west), the outfield stand way/71400321. No height tags.
 *    The stands' inner edges outline the field: home plate's backstop 18 m
 *    inside the north apex, centre field fence 118 m south of home.
 *  - Published (ja.wikipedia 阪神甲子園球場): 95 m lines, 118 m centre; stands
 *    about 22,600 m2; four light towers 44 m tall plus two lights on the
 *    roof; main scoreboard 13 m tall x 31.6 m wide; the Ginsan of galvalume
 *    steel sheet; ivy planted 1924, about 430 plants; 1924 stand 14.3 m, 50
 *    tiers.
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - aer: 国土地理院 (GSI), "Koshien Stadium aerial photograph 2021.jpg",
 *      CC BY 4.0: plan, the Ginsan's extent over the infield stand, the
 *      scoreboard. https://commons.wikimedia.org/wiki/File:Koshien_Stadium_aerial_photograph_2021.jpg
 *    - zk: やねまか, "阪神甲子園球場 全景.jpg", CC0: outfield stands, scoreboard,
 *      two light towers. https://commons.wikimedia.org/wiki/File:%E9%98%AA%E7%A5%9E%E7%94%B2%E5%AD%90%E5%9C%92%E7%90%83%E5%A0%B4_%E5%85%A8%E6%99%AF.jpg
 *    - gin: Yasu, "Koshien Stadium Ginsan and Liner Vision.jpg", CC BY-SA 3.0:
 *      the Ginsan from the outfield, its lights, dark green seats.
 *      https://commons.wikimedia.org/wiki/File:Koshien_Stadium_Ginsan_and_Liner_Vision.jpg
 *    - g, c, d, e: 江戸村のとくぞう, "Hanshin Koshien Stadium 220809g.jpg" (and
 *      c, d, e), CC BY-SA 4.0: the ivy wall, windows, arched gates.
 *      https://commons.wikimedia.org/wiki/File:Hanshin_Koshien_Stadium_220809g.jpg
 *    - r1, r3: 掬茶, "Around the Koshien Stadium 20250901a.jpg" (and c),
 *      CC BY-SA 4.0: brick and ivy, the green glazed upper floors, the
 *      Ginsan's edge. https://commons.wikimedia.org/wiki/File:Around_the_Koshien_Stadium_20250901a.jpg
 *  No lidar (outside the US); no commercial imagery; no 3D city model.
 *
 * Numbers, estimated from the photos against the published 44 m towers and
 * 13 m scoreboard: infield stand back wall 22 m (ivy brick to 17 m, the
 * green glazed floors above), its seats rising from 1.2 m to 20 m; the
 * Ginsan from 31 m at the back to 28 m at its front edge, over the outer
 * 72 % of the infield stand's depth; alps stands to 15 m, outfield stands
 * to 12 m (fence 3 m, published); scoreboard on a 12 m base; light towers
 * at left-centre and right-centre behind the outfield and east and west of
 * the field behind the alps (estimated places).
 *
 * Doubts: no height in OSM, so every height is estimated; the towers' exact
 * places; the Ginsan's real outline (planned to be extended over the alps in
 * 2028, not drawn); the ivy wall is drawn all round, though the outfield's
 * is thinner; seats one dark green. Elevation 0: the field is at street level.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { face, rayHit, vadd, vmul, vsub } from './seoul-world-cup-stadium'
import { RAD, bar, bead, obox, writeLods } from './melbourne-mcg'

type XY = [number, number]
const ANCHOR: XY = [-15, 19.5] // in the OSM-local frame below
const L = (pts: number[][]): XY[] => pts.map(([x, y]) => [x - ANCHOR[0], y - ANCHOR[1]] as XY)
const OUTFIELD = L([[54.0, -14.5], [67.1, -16.3], [77.6, -12.9], [94.6, -7.4], [94.3, -11.0], [93.8, -16.9], [90.4, -27.4], [85.8, -36.5], [78.7, -50.0], [70.4, -58.9], [60.0, -67.3], [50.1, -73.8], [39.1, -79.2], [20.8, -86.3], [9.7, -89.3], [0.2, -90.8], [-27.5, -91.1], [-52.5, -87.4], [-77.4, -79.1], [-90.1, -71.9], [-105.9, -56.2], [-110.9, -50.1], [-116.1, -40.0], [-121.5, -24.6], [-107.3, -24.8], [-93.9, -27.9], [-82.1, -25.2], [-80.4, -28.7], [-76.1, -34.6], [-70.9, -40.6], [-57.8, -48.3], [-44.3, -52.5], [-34.7, -53.8], [-24.9, -54.7], [-14.9, -54.2], [0.9, -52.6], [17.1, -47.8], [25.3, -44.9], [32.6, -41.7], [38.5, -38.1], [45.6, -31.1], [49.5, -25.4], [51.9, -21.0], [53.1, -18.6]])
const INFIELD = L([[-112.0, 36.1], [-107.9, 47.3], [-116.0, 50.0], [-110.9, 62.8], [-102.6, 59.7], [-94.9, 78.7], [-86.4, 96.4], [-78.8, 108.0], [-63.8, 118.0], [-53.8, 121.7], [-53.7, 126.5], [-38.9, 127.1], [-38.8, 124.0], [-11.1, 125.5], [-11.2, 129.8], [-1.2, 130.0], [-1.2, 126.3], [4.7, 126.0], [15.4, 123.6], [22.8, 120.5], [30.3, 115.7], [36.4, 110.0], [41.8, 104.5], [63.6, 72.4], [70.0, 75.9], [74.8, 66.9], [68.8, 63.6], [70.1, 61.1], [71.3, 58.7], [75.6, 50.7], [74.6, 50.2], [52.5, 38.0], [50.2, 40.6], [32.1, 31.4], [24.2, 45.7], [22.5, 49.0], [19.5, 54.5], [13.4, 61.9], [6.9, 67.2], [-2.0, 75.4], [-3.6, 73.9], [-7.1, 76.4], [-6.2, 77.3], [-8.7, 79.0], [-15.6, 82.4], [-23.5, 81.9], [-29.0, 81.6], [-34.2, 80.0], [-35.9, 78.7], [-39.0, 76.5], [-43.4, 71.3], [-47.5, 65.7], [-56.8, 49.1], [-57.8, 49.4], [-60.0, 42.9], [-66.6, 23.9], [-86.1, 31.0], [-88.6, 27.9], [-111.0, 35.7]])
const ALPS_E = L([[97.9, -4.1], [94.1, 4.7], [91.2, 11.3], [81.2, 35.3], [74.6, 50.2], [52.5, 38.0], [34.5, 28.8], [36.0, 26.8], [48.4, 10.6], [54.2, -2.8], [54.6, -12.0], [66.7, -13.6], [77.0, -10.4], [93.9, -5.3]])
const ALPS_W = L([[-121.3, -22.0], [-127.1, -21.7], [-127.1, -18.7], [-113.7, 26.7], [-112.7, 30.1], [-111.0, 35.7], [-88.6, 27.9], [-69.0, 21.6], [-70.4, 18.9], [-80.1, -1.3], [-82.8, -9.7], [-83.2, -22.5], [-93.9, -25.2], [-107.2, -22.7]])

type Kind = 'infield' | 'alps' | 'outfield'
const STANDS: { kind: Kind; poly: XY[] }[] = [
  { kind: 'infield', poly: INFIELD }, { kind: 'alps', poly: ALPS_E }, { kind: 'alps', poly: ALPS_W }, { kind: 'outfield', poly: OUTFIELD },
]
/** The rays' origin, on the field's axis between the mound and second base. */
const C0: XY = [-17 - ANCHOR[0], 10 - ANCHOR[1]]
const HOME: XY = [-17 - ANCHOR[0], 64 - ANCHOR[1]]

function inside([x, y]: XY, poly: XY[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
/** Every crossing of the ray from C0 at angle th with the stands' outlines. */
function crossings(th: number): number[] {
  const dx = Math.cos(th), dy = Math.sin(th), out: number[] = []
  for (const { poly } of STANDS) for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = [poly[i][0] - C0[0], poly[i][1] - C0[1]], [x1, y1] = [poly[(i + 1) % poly.length][0] - C0[0], poly[(i + 1) % poly.length][1] - C0[1]]
    const ex = x1 - x0, ey = y1 - y0, den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const t = (x0 * ey - y0 * ex) / den, s = (x0 * dy - y0 * dx) / den
    if (t > 0 && s >= 0 && s <= 1) out.push(t)
  }
  return out.sort((a, b) => a - b)
}
type Ray = { th: number; r0: number; r1: number; kind: Kind }
function ray(th: number): Ray {
  const c = crossings(th)
  const r0 = c[0], r1 = c[c.length - 1]
  const m = (r0 + r1) / 2
  const p: XY = [C0[0] + Math.cos(th) * m, C0[1] + Math.sin(th) * m]
  let kind: Kind = 'outfield'
  for (const s of STANDS) if (inside(p, s.poly)) kind = s.kind
  return { th, r0, r1, kind }
}

/** Stand section by kind: [depth fraction, z, part] from the field edge out to the back wall's top. */
const H: Record<Kind, { front: number; top: number; wall: number }> = {
  infield: { front: 1.2, top: 20, wall: 22 },
  alps: { front: 1.2, top: 14, wall: 15 },
  outfield: { front: 3.0, top: 11, wall: 12 },
}

function build(detail: boolean) {
  const seats = new Part(), ivy = new Part(), brick = new Part(), silver = new Part(), dark = new Part(), lamp = new Part()
  const N = detail ? 240 : 96
  const rays: Ray[] = []
  for (let i = 0; i < N; i++) rays.push(ray(-Math.PI + (i / N) * 2 * Math.PI))
  // smooth the edges over the narrow gaps between OSM's stand outlines (a median of 5 rays), and drop single-ray kind flips
  const med = (f: (r: Ray) => number, i: number) => [-2, -1, 0, 1, 2].map((d) => f(rays[(i + d + N) % N])).sort((a, b) => a - b)[2]
  const sm = rays.map((r, i) => ({ ...r, r0: med((q) => q.r0, i), r1: med((q) => q.r1, i) }))
  for (let i = 0; i < N; i++) {
    const a = sm[(i - 1 + N) % N].kind, b = sm[(i + 1) % N].kind
    if (a === b && sm[i].kind !== a) sm[i].kind = a
  }
  rays.splice(0, N, ...sm)
  const at = (r: Ray, d: number, z: number): V3 => [C0[0] + Math.cos(r.th) * d, C0[1] + Math.sin(r.th) * d, z]
  const ROWS = detail ? 10 : 0
  /** The section of ray r drawn as kind k: points [d, z, part-of-segment-starting-here]. */
  const section = (r: Ray, k: Kind): [number, number, Part][] => {
    const h = H[k], D = r.r1 - r.r0
    const pts: [number, number, Part][] = [[r.r0, 0, silver]]
    const s0 = r.r0, s1 = r.r0 + D * 0.93
    if (ROWS === 0) pts.push([s0, h.front, seats])
    else for (let s = 0; s < ROWS; s++) {
      const d = s0 + ((s1 - s0) * s) / ROWS
      pts.push([d, h.front + ((h.top - h.front) * s) / ROWS, dark])
      pts.push([d, h.front + ((h.top - h.front) * (s + 1)) / ROWS, seats])
    }
    pts.push([s1, h.top, silver]) // the back walkway up to the parapet
    pts.push([s1, h.wall, silver])
    pts.push([r.r1, h.wall, silver])
    return pts
  }
  for (let i = 0; i < N; i++) {
    const A = rays[i], B = rays[(i + 1) % N]
    const k = A.kind
    const SA = section(A, k), SB = section(B, k)
    for (let j = 0; j < SA.length - 1; j++) {
      const p0 = at(A, SA[j][0], SA[j][1]), p1 = at(B, SB[j][0], SB[j][1]), p2 = at(B, SB[j + 1][0], SB[j + 1][1]), p3 = at(A, SA[j + 1][0], SA[j + 1][1])
      const dz = SA[j + 1][1] - SA[j][1], dr = SA[j + 1][0] - SA[j][0]
      const mth = (A.th + B.th) / 2 + (i === N - 1 ? Math.PI : 0)
      const nn: V3 = [-Math.cos(mth) * dz, -Math.sin(mth) * dz, dr]
      if (Math.hypot(...nn) < 1e-6) continue
      face(SA[j][2], [p0, p1, p2, p3], nn)
    }
    // the outer wall: brick base with its arched gates' dark recesses, ivy above, the green glazed top floors on the infield
    const o0 = at(A, A.r1, 0), o1 = at(B, B.r1, 0)
    const out: V3 = [o0[0] + o1[0] - 2 * C0[0], o0[1] + o1[1] - 2 * C0[1], 0]
    const wall = (part: Part, z0: number, z1: number, inset = 0) => {
      const d = vmul(out, -inset / Math.hypot(out[0], out[1]))
      face(part, [vadd([o0[0], o0[1], z0], d), vadd([o1[0], o1[1], z0], d), vadd([o1[0], o1[1], z1], d), vadd([o0[0], o0[1], z1], d)], out)
    }
    const hw = H[k].wall
    wall(brick, 0, 4.5)
    if (k === 'infield') { wall(ivy, 4.5, 17); wall(dark, 17, hw) } else wall(ivy, 4.5, hw)
    // gates: a dark arched recess every few bays at the foot of the wall (g, e)
    if (i % (detail ? 6 : 4) === 2) {
      const d = vmul(out, 0.08 / Math.hypot(out[0], out[1]))
      const m0 = vadd(vadd(o0, vmul(vsub(o1, o0), 0.2)), d), m1 = vadd(vadd(o0, vmul(vsub(o1, o0), 0.8)), d)
      const arch: V3[] = [vadd(m0, [0, 0, 0]), vadd(m1, [0, 0, 0]), vadd(m1, [0, 0, 2.8]), vadd(vadd(m0, vmul(vsub(m1, m0), 0.5)), [0, 0, 3.9]), vadd(m0, [0, 0, 2.8])]
      face(dark, arch, out)
    }
    // side walls where two kinds of stand meet
    if (B.kind !== k) {
      const SL = section(B, k), SR = section(B, B.kind)
      // fill between the taller and the lower profile with a two-sided wall
      const top = (S: [number, number, Part][], d: number) => {
        let z = 0
        for (let j = 0; j < S.length - 1; j++) if (d >= S[j][0] - 1e-6 && d <= S[j + 1][0] + 1e-6) z = Math.max(z, S[j][1], S[j + 1][1] === S[j][1] ? S[j][1] : S[j][1] + ((S[j + 1][1] - S[j][1]) * (d - S[j][0])) / Math.max(1e-6, S[j + 1][0] - S[j][0]))
        return z
      }
      const steps = detail ? 12 : 6
      for (let s = 0; s < steps; s++) {
        const d0 = B.r0 + ((B.r1 - B.r0) * s) / steps, d1 = B.r0 + ((B.r1 - B.r0) * (s + 1)) / steps
        const za0 = top(SL, d0), zb0 = top(SR, d0), za1 = top(SL, d1), zb1 = top(SR, d1)
        const lo0 = Math.min(za0, zb0), hi0 = Math.max(za0, zb0), lo1 = Math.min(za1, zb1), hi1 = Math.max(za1, zb1)
        if (hi0 - lo0 < 0.1 && hi1 - lo1 < 0.1) continue
        const q = [at(B, d0, lo0), at(B, d1, lo1), at(B, d1, hi1), at(B, d0, hi0)]
        const n: V3 = [-Math.sin(B.th), Math.cos(B.th), 0]
        face(silver, q, n)
        face(silver, q, vmul(n, -1))
      }
    }
  }

  // --- the Ginsan: a silver roof over the infield stand's outer 72 %, lights along its front
  {
    const inf = rays.filter((r) => r.kind === 'infield')
    // contiguous run of infield rays (they straddle home, at the north)
    const idx = rays.map((r, i) => (r.kind === 'infield' ? i : -1)).filter((i) => i >= 0)
    const start = idx.find((i) => rays[(i - 1 + N) % N].kind !== 'infield')!
    const run: Ray[] = []
    for (let k = 0; k < inf.length; k++) run.push(rays[(start + k) % N])
    const F = 0.28, Z_FRONT = 28, Z_BACK = 31, T = 1.4
    const pt = (r: Ray, f: number, dz = 0): V3 => at(r, r.r0 + (r.r1 - r.r0 + 1.5) * f, Z_FRONT + (Z_BACK - Z_FRONT) * ((f - F) / (1 - F)) + dz)
    for (let k = 0; k < run.length - 1; k++) {
      const A = run[k], B = run[k + 1]
      const a0 = pt(A, F), b0 = pt(B, F), a1 = pt(A, 1), b1 = pt(B, 1)
      face(silver, [a0, b0, b1, a1], [0, 0, 1])
      face(dark, [vadd(a0, [0, 0, -T]), vadd(a1, [0, 0, -T]), vadd(b1, [0, 0, -T]), vadd(b0, [0, 0, -T])], [0, 0, -1])
      const fo: V3 = [-Math.cos((A.th + B.th) / 2), -Math.sin((A.th + B.th) / 2), 0]
      face(dark, [a0, vadd(a0, [0, 0, -T - 1.6]), vadd(b0, [0, 0, -T - 1.6]), b0], fo) // the front fascia, the light racks
      face(silver, [a1, b1, vadd(b1, [0, 0, -T]), vadd(a1, [0, 0, -T])], vmul(fo, -1))
      if (k % (detail ? 2 : 3) === 0) bead(lamp, vadd(vadd(a0, vmul(fo, 0.6)), [0, 0, -1.6]), detail ? 0.9 : 1.3)
      // the trusses under the roof down to the back of the stand (detail), or a post per few bays (low)
      if (detail && k % 3 === 0) {
        bar(dark, vadd(pt(A, F), [0, 0, -T]), vadd(pt(A, 1), [0, 0, -T - 3.5]), 0.8, 0.8)
        bar(dark, vadd(pt(A, 0.55), [0, 0, -T]), at(A, A.r1 - 2, H.infield.wall), 0.7, 0.7)
      }
    }
    // the end walls of the roof slab
    for (const r of [run[0], run[run.length - 1]]) {
      const a0 = pt(r, F), a1 = pt(r, 1)
      const n: V3 = [-Math.sin(r.th), Math.cos(r.th), 0]
      const q = [a0, a1, vadd(a1, [0, 0, -T]), vadd(a0, [0, 0, -T])]
      face(silver, q, n); face(silver, q, vmul(n, -1))
    }
    // posts carrying the roof's back over the wall
    for (let k = 2; k < run.length; k += detail ? 4 : 8) {
      const r = run[k]
      bar(dark, at(r, r.r1 - 1.5, H.infield.wall), vadd(pt(r, 0.97), [0, 0, -T]), 1.2, 1.2)
    }
  }

  // --- the scoreboard at the back of centre field
  {
    const th = Math.atan2(-1, 0) // due south from C0, the field's axis
    const r = ray(th)
    const c = at(r, r.r1 - 8, 0)
    const ex: V3 = [1, 0, 0], ey: V3 = [0, 1, 0]
    obox(brick, c, ex, ey, -17, 17, -7, 7, 0, 12) // the scoreboard building (its face into the field is the board)
    obox(dark, c, ex, ey, -15.8, 15.8, 4.5, 6.2, 12, 25) // the board, 31.6 x 13 m
    obox(dark, c, ex, ey, -3.5, 3.5, 1, 5, 25, 29) // the clock housing on top (zk)
    obox(silver, c, ex, ey, -17, 17, -7, 7, 11.4, 12)
  }

  // --- four light towers, 44 m (published): behind left- and right-centre, and behind the alps
  {
    const towers: number[] = [-90 - 42, -90 + 42, 2, 178].map((d) => d * RAD)
    for (const th of towers) {
      const r = ray(th)
      const p = at(r, r.r1 + 4, 0)
      const toward: V3 = vsub([HOME[0], HOME[1], 0], [p[0], p[1], 0])
      const f = vmul(toward, 1 / Math.hypot(toward[0], toward[1]))
      const s: V3 = [-f[1], f[0], 0]
      const HT = 38
      if (detail) {
        // an open lattice shaft: four corner posts and braces
        const w = 1.6
        const cs: V3[] = [[-1, -1, 0], [1, -1, 0], [1, 1, 0], [-1, 1, 0]].map(([a, b]) => vadd(p, vadd(vmul(s, a * w), vmul(f, b * w))))
        for (const c of cs) bar(silver, vadd(c, [0, 0, 0.25]), vadd(c, [0, 0, HT]), 0.45, 0.45)
        for (let z = 0.4; z < HT - 1; z += 4) for (let k = 0; k < 4; k++) bar(silver, vadd(cs[k], [0, 0, z]), vadd(cs[(k + 1) % 4], [0, 0, z + 4]), 0.3, 0.3)
      } else bar(silver, p, vadd(p, [0, 0, HT]), 2.6, 2.6)
      // the head: a rack of lamps facing home, 12 x 7 m
      const hc = vadd(p, [0, 0, HT + 3])
      obox(silver, hc, s, f, -6.5, 6.5, -0.6, 0.6, -3.2, 3.6, true)
      for (let a = 0; a < (detail ? 6 : 3); a++) for (let b = 0; b < (detail ? 4 : 2); b++) {
        const x = -5.2 + (10.4 * a) / (detail ? 5 : 2), z = -2 + (5 * b) / (detail ? 3 : 1)
        bead(lamp, vadd(vadd(hc, vmul(s, x)), vadd(vmul(f, 0.9), [0, 0, z])), detail ? 0.6 : 0.9)
      }
    }
  }

  return [
    { part: seats, material: finish('kc-seats', 0x587a64) },
    { part: ivy, material: finish('kc-ivy', 0x6f8f52) },
    { part: brick, material: finish('kc-brick', 0xb59a7e) },
    { part: silver, material: { ...finish('kc-ginsan', 0xc8ccce), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0.05 : 0.2) } },
    { part: dark, material: finish('kc-dark', 0x4d5a55) },
    { part: lamp, material: finish('lamp', 0xd9dcd8) },
  ]
}

if (import.meta.main)
  await writeLods('Hanshin Koshien Stadium', { bearing: 0, elevation: 0, height: 44 }, [
    { file: 'nishinomiya-koshien.glb', parts: build(false), maxTris: 5000, maxBytes: 250_000 },
    { file: 'nishinomiya-koshien.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1_500_000 },
  ])
