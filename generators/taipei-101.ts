/**
 * Taipei 101, Taipei — original procedural geometry, CC0-1.0.
 * bun generators/taipei-101.ts   (writes the low model and the detail model)
 *
 * Also exports the small geometry kit (`K`) used by the batch's Hong Kong
 * towers (hk-international-commerce-centre.ts, hk-ifc.ts): merge this file
 * first.
 *
 * Frame: BEARING 1.2 (the tower's square is turned 1.2 deg clockwise from
 * north in OSM), model +x = compass 91.2, +y = compass 1.2. Origin = the
 * area centroid of the tower's OSM part way/198637969 (the anchor is on the
 * tower, not the centroid of the whole tower-and-mall outline way/1159328965,
 * so the symmetric tower is centred). y = 0 is the street at the foot of the
 * tower; elevation 0.
 *
 * What is modelled (OSM makes the mall part of the same building: the
 * outline way/1159328965 "台北101" covers tower and mall, so both are here):
 * - the base, a truncated pyramid 0-97 m (half-width 30.6 m at the street,
 *   25.3 m at the top), and the coin band 97-110 m with one big disc ("coin")
 *   on each face;
 * - eight stacked segments of eight floors, 110-389 m, each flaring OUT as it
 *   rises (half-width 25.0 -> 27.0 m), each topped by an eave whose corners
 *   turn up like a pagoda roof, as real 3D geometry (every face leans out);
 * - the notched corners of the plan (a double re-entrant step at each corner,
 *   from OSM way/198637969), which give the paired vertical lines at the
 *   corners in every photo;
 * - ruyi (cloud-head) ornaments under every segment's eave, at the middle of
 *   each face and at each corner, and four big ruyi at the corners of the
 *   shoulder;
 * - the shoulder roof 389-399 m, the top section 399-440 m (five small flared
 *   tiers, floors 91-101), its cap, the dark pinnacle drum with its saucer
 *   ring (440-461 m) and the spire to 508 m;
 * - the Taipei 101 Mall: OSM part way/64566862 (30 m, the big block west and
 *   north of the tower), the 25 m wings way/1159328963 and way/1159328964
 *   that join it to the tower, the arched glass vault way/615183624 (30-42 m)
 *   and the entrance canopies (1-level roof parts).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors, ODbL): outline way/1159328965
 *   (height 508, 101 levels, wikidata Q83101); tower parts way/198637969 (to
 *   386 m), way/615183621 (deck, 386-390.6 m), way/615183622 (top section,
 *   390.6-439 m, a 21 m square), way/615184269 (pinnacle drum, 439-448 m,
 *   14.4 m across), way/615183623 (spire, 448-508 m); mall parts
 *   way/64566862, way/1159328963, way/1159328964, way/615183624 and the
 *   level-only parts way/1339487717-1339487738 (no heights).
 * - Published (Wikipedia "Taipei 101", CTBUH): architectural height 508 m;
 *   roof 449.2 m; top floor 438 m; 101 floors; "eight segments of eight
 *   floors each"; observatories at 383.4 m (88-89F) and 391.8 m (91F);
 *   exterior ruyi "at least 8 m tall"; a coin disc on each face where the
 *   pedestal meets the tower; blue-green glass.
 * - Photos (Wikimedia Commons):
 *   "Taipei 101 2009 amk.jpg", AngMoKio, CC BY-SA 3.0, from Sun Yat-sen
 *   Memorial Hall (NNW): profile, segment flare, coins, spire;
 *   https://commons.wikimedia.org/wiki/File:Taipei_101_2009_amk.jpg
 *   "Taipei, November 25, 2024 - 008.jpg", Another Believer, CC BY-SA 4.0,
 *   from Elephant Mountain (ESE), corner-on: all heights below were scaled
 *   from it; https://commons.wikimedia.org/wiki/File:Taipei,_November_25,_2024_-_008.jpg
 *   "Taipei Taiwan Taipei-101-Tower-01.jpg", CEphoto, Uwe Aranas, CC BY-SA
 *   3.0, from the east at dusk; https://commons.wikimedia.org/wiki/File:Taipei_Taiwan_Taipei-101-Tower-01.jpg
 *   "Taipei 101 from Xinyi.jpg", Rutger van der Maar, CC BY 2.0;
 *   https://commons.wikimedia.org/wiki/File:Taipei_101_from_Xinyi.jpg
 *   "Taipei 101, toppen.jpg", Johan Jönsson (Julle), CC BY-SA 4.0, looking
 *   up the top section: its tiers and the big corner ruyi;
 *   https://commons.wikimedia.org/wiki/File:Taipei_101,_toppen.jpg
 *   "Taipei 101 at night.jpg", Meow, CC BY-SA 3.0, night: lit eaves and
 *   spire light; https://commons.wikimedia.org/wiki/File:Taipei_101_at_night.jpg
 *   "2010-12-27 Taipei 101 with its mall and Taipei WTC Hall 3.jpg", Bernard
 *   McManus, CC BY 2.0: the base, coin band and the mall's arched roof;
 *   https://commons.wikimedia.org/wiki/File:2010-12-27_Taipei_101_with_its_mall_and_Taipei_WTC_Hall_3.jpg
 *   "Taipei 101 Mall 20120405.jpg", xiquinhosilva, CC BY 2.0: the mall's
 *   green glass walls, grey frieze and louvred attic;
 *   https://commons.wikimedia.org/wiki/File:Taipei_101_Mall_20120405.jpg
 *   "Taipei 101 Mall and Dog Off-Leash Area 20240204.jpg", 玄史生, CC0;
 *   https://commons.wikimedia.org/wiki/File:Taipei_101_Mall_and_Dog_Off-Leash_Area_20240204.jpg
 * - No lidar (none open over Taiwan), no NAIP, no Mapillary token.
 * - Look-only references: none.
 *
 * Numbers
 * - Published: 508 m to the spire tip; roof 449 m (the cap of the top
 *   section is put at 440-446 m); 8 x 8 floors.
 * - Measured (OSM): the plan (54 m across the faces at the segment tops, the
 *   notch 3.2 m deep and 6 m wide at each corner), the bearing, the top
 *   section's 21 m square, the pinnacle drum's 14 m, the mall outlines and
 *   heights (30 m, 25 m, the vault 30-42 m).
 * - Measured (photo, Elephant Mountain view scaled to 508 m): base top 97 m,
 *   coin band 97-110 m, coin ~12 m across, segment height ~35 m (eave top
 *   at 389 m), shoulder to ~399 m, top section ~399-440 m, drum to ~461 m;
 *   the base's half-width at the street (30.6 m, also OSM's 25 m podium
 *   parts round the foot) and the segments' flare (about 8 % of the width).
 * - Estimated: the eave upturn (1.6 m at the corners), the eave overhang
 *   (0.9 m), ruyi size (6.5 x 7 m, from the photo) and the tiers of the top
 *   section; the mall's frieze and attic heights (from the 2012 mall photo);
 *   canopy heights (5.5 m).
 * - Glass colour sampled from the 2009 and 2024 photos (sunlit #82aeae-
 *   #90bdbb, shaded #2f4863), pulled to the palette's lightness: #6f9e9b.
 *
 * Doubts
 * - The level-only OSM parts way/1339487717-1339487738 (levels 1-92, no
 *   heights) were mapped separately and disagree with the other parts; they
 *   are listed in `replaces` but not used for heights.
 * - The round 20-level part way/1339487731 and the 12-level part
 *   way/1339487733 by the mall's vault are drawn at the mall's 30 m: no photo
 *   shows them.
 * - The south and east sides of the mall are seen only in the 2012 photo.
 *
 * Night: the curtain walls glow as windows; the eaves, ruyi and coins are
 * `neon-taipei-trim` (the eave lines are lit every night, white or the day's
 * colour); a `lamp` bead at the spire's tip; the mall vault is dark `glass`.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { polyTris } from './berlin-oberbaum-bridge'

// ============================================================ shared kit
export type P2 = [number, number]
const TAU = Math.PI * 2
export const K = {
  /** OSM lon/lat → model metres, turned into a frame whose north is `bearing`. */
  projector(lng0: number, lat0: number, bearing: number) {
    const b = (bearing * Math.PI) / 180, kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110574
    return ([lon, lat]: P2): P2 => {
      const e = (lon - lng0) * kx, n = (lat - lat0) * ky
      return [e * Math.cos(b) - n * Math.sin(b), e * Math.sin(b) + n * Math.cos(b)]
    }
  },
  area(r: P2[]) {
    let a = 0
    for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] }
    return a / 2
  },
  ccw(r: P2[]): P2[] {
    const q = r.length > 2 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1] ? r.slice(0, -1) : r
    return K.area(q) < 0 ? [...q].reverse() : q
  },
  /** Miter offset of a CCW ring (positive = outward). */
  offset(r: P2[], d: number): P2[] {
    const n = r.length
    return r.map((b, i) => {
      const a = r[(i - 1 + n) % n], c = r[(i + 1) % n]
      const t1 = norm2([b[0] - a[0], b[1] - a[1]]), t2 = norm2([c[0] - b[0], c[1] - b[1]])
      const n1: P2 = [t1[1], -t1[0]], n2: P2 = [t2[1], -t2[0]]
      const m = norm2([n1[0] + n2[0], n1[1] + n2[1]])
      const k = Math.max(0.35, m[0] * n1[0] + m[1] * n1[1])
      return [b[0] + (m[0] * d) / k, b[1] + (m[1] * d) / k] as P2
    })
  },
  scale(r: P2[], s: number, c: P2 = [0, 0]): P2[] {
    return r.map(([x, y]) => [c[0] + (x - c[0]) * s, c[1] + (y - c[1]) * s] as P2)
  },
  /** Walls between two rings of the same length (CCW from above), each vertex with its own z. */
  loft(p: Part, lo: V3[], hi: V3[]) {
    const n = lo.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.quad(lo[i], lo[j], hi[j], hi[i])
    }
  },
  at(r: P2[], z: number | ((i: number) => number)): V3[] {
    return r.map((q, i) => [q[0], q[1], typeof z === 'number' ? z : z(i)] as V3)
  },
  /** Flat cap over a simple polygon (any winding), optionally with holes. */
  cap(p: Part, r: P2[], z: number, up: boolean, holes: P2[][] = []) {
    for (const [a, b, c] of polyTris(r as any, holes as any) as unknown as [P2, P2, P2][]) {
      const A: V3 = [a[0], a[1], z], B: V3 = [b[0], b[1], z], C: V3 = [c[0], c[1], z]
      const g = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])
      if ((g > 0) === up) p.tri(A, B, C)
      else p.tri(A, C, B)
    }
  },
  /** A vertical prism over a polygon, z0..z1. */
  prism(p: Part, r0: P2[], z0: number, z1: number, top = true, bottom = false, topPart?: Part) {
    const r = K.ccw(r0)
    K.loft(p, K.at(r, z0), K.at(r, z1))
    if (top) K.cap(topPart ?? p, r, z1, true)
    if (bottom) K.cap(p, r, z0, false)
  },
  /** A horizontal band hugging a ring: outer face, top and soffit. */
  band(p: Part, r: P2[], z0: number, z1: number, out: number, inn = 0.3) {
    const o = K.offset(r, out), i = K.offset(r, -inn)
    K.loft(p, K.at(o, z0), K.at(o, z1))
    K.loft(p, K.at(o, z1), K.at(i, z1))
    K.loft(p, K.at(i, z0), K.at(o, z0))
  },
  /** Circle points. */
  circle(cx: number, cy: number, r: number, n: number, a0 = 0): P2[] {
    return Array.from({ length: n }, (_, k) => [cx + r * Math.cos(a0 + (k * TAU) / n), cy + r * Math.sin(a0 + (k * TAU) / n)] as P2)
  },
  /** A frustum about a vertical axis, smooth-shaded sides. */
  cyl(p: Part, cx: number, cy: number, z0: number, z1: number, r0: number, r1: number, n: number, top = true, bottom = false) {
    const dr = r0 - r1, h = z1 - z0, L = Math.hypot(dr, h) || 1
    for (let k = 0; k < n; k++) {
      const a = (k * TAU) / n, b = ((k + 1) * TAU) / n
      const na: V3 = [(Math.cos(a) * h) / L, (Math.sin(a) * h) / L, dr / L], nb: V3 = [(Math.cos(b) * h) / L, (Math.sin(b) * h) / L, dr / L]
      const A0: V3 = [cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), z0], B0: V3 = [cx + r0 * Math.cos(b), cy + r0 * Math.sin(b), z0]
      const A1: V3 = [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1], B1: V3 = [cx + r1 * Math.cos(b), cy + r1 * Math.sin(b), z1]
      if (r0 > 1e-6) p.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
      if (r1 > 1e-6) p.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
    }
    if (top && r1 > 1e-6) K.cap(p, K.circle(cx, cy, r1, n), z1, true)
    if (bottom && r0 > 1e-6) K.cap(p, K.circle(cx, cy, r0, n), z0, false)
  },
  /**
   * A flat plate standing on a vertical face: outline `shape` in (u, v)
   * metres, u along the face (unit `t`), v up, set at `o` (a point on the
   * face) and pushed out along the face's outward normal `nrm` by `depth`.
   */
  plate(p: Part, shape: P2[], o: V3, t: P2, nrm: P2, depth: number, back = 0, backFace = false) {
    const s = K.ccw(shape)
    const P = (q: P2, d: number): V3 => [o[0] + t[0] * q[0] + nrm[0] * d, o[1] + t[1] * q[0] + nrm[1] * d, o[2] + q[1]]
    const n = s.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      p.quad(P(s[i], -back), P(s[j], -back), P(s[j], depth), P(s[i], depth))
    }
    // front face: triangulate in (u, v), map to 3D, and wind it to face nrm
    for (const [a, b, c] of polyTris(s as any) as unknown as [P2, P2, P2][]) {
      const A = P(a, depth), B = P(b, depth), C = P(c, depth)
      const g = cross3(sub3(B, A), sub3(C, A))
      if (g[0] * nrm[0] + g[1] * nrm[1] > 0) p.tri(A, B, C)
      else p.tri(A, C, B)
      if (backFace) {
        const A2 = P(a, -back), B2 = P(b, -back), C2 = P(c, -back)
        if (g[0] * nrm[0] + g[1] * nrm[1] > 0) p.tri(A2, C2, B2)
        else p.tri(A2, B2, C2)
      }
    }
  },
  /** A box from its centre, half sizes and a turn about z. */
  box(p: Part, c: V3, hx: number, hy: number, hz: number, turn = 0) {
    const co = Math.cos(turn), si = Math.sin(turn)
    const r: P2[] = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]].map(([x, y]) => [c[0] + x * co - y * si, c[1] + x * si + y * co] as P2)
    K.prism(p, r, c[2] - hz, c[2] + hz, true, true)
  },
}
function norm2(v: P2): P2 { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// ============================================================ Taipei 101
const BEARING = 1.2
const ANCHOR = { lng: 121.56481, lat: 25.0336682 } // area centroid of way/198637969
const TOP = 508

// heights (see header)
const BASE_TOP = 97, COIN_TOP = 110
const SEG_H = 34.875 // 8 segments, 110 -> 389
const EAVE = 1.25 // eave band at the top of each segment, part of its 34.875 m
const SEG_LO = 24.4, SEG_HI = 27.2 // half-width at the foot and top of a segment
const UP = 1.6 // eave upturn at the corners
const SHOULDER = 393, TIER0 = 397, TIER_H = 5.5, TIERS = 8, CAP0 = TIER0 + TIERS * TIER_H // 440
const DRUM0 = 444, DRUM1 = 460

/**
 * The plan at half-width h, CCW: a square with a double step at each corner
 * (OSM way/198637969: 3.2 m deep, 6 m wide at h = 27). `m` face samples
 * between the notches. Returns points and, per point, its eave lift share
 * (0 at a face's middle, 1 at the notch).
 */
function plan(h: number, m: number): { r: P2[]; lift: number[] } {
  const w = 0.205 * h, d = 0.119 * h, a = h - w
  const q: P2[] = [], l: number[] = []
  // face x = +h, from y = -a to y = +a (exclusive of the ends, which the notches own)
  for (let k = 1; k <= m; k++) {
    const y = -a + (2 * a * k) / (m + 1)
    q.push([h, y]); l.push((y / a) ** 2)
  }
  // corner (+,+)
  const c: P2[] = [[h, a], [h - d, a], [h - d, h - d], [a, h - d], [a, h]]
  const cl = [1, 1, 1.12, 1, 1]
  const rot = (p: P2, k: number): P2 => { let [x, y] = p; for (let i = 0; i < k; i++) [x, y] = [-y, x]; return [x, y] }
  const r: P2[] = [], lift: number[] = []
  for (let k = 0; k < 4; k++) {
    q.forEach((p, i) => { r.push(rot(p, k)); lift.push(l[i]) })
    c.forEach((p, i) => { r.push(rot(p, k)); lift.push(cl[i]) })
  }
  return { r, lift }
}

export function build(detail: boolean) {
  const glassP = new Part(), trim = new Part(), dark = new Part(), roof = new Part(), vault = new Part(), lamp = new Part()
  const M = detail ? 5 : 1 // face samples between the notches

  // ---------------------------------------------------------- base and coin band
  {
    const b0 = plan(30.6, M).r, b1 = plan(25.3, M).r
    K.loft(glassP, K.at(b0, 0), K.at(b1, BASE_TOP))
    // coin band: a dark band, set 0.3 m in, with a lip above and below
    const c0 = plan(25.0, M).r
    K.loft(roof, K.at(b1, BASE_TOP), K.at(c0, BASE_TOP)) // the small ledge
    K.loft(dark, K.at(c0, BASE_TOP), K.at(c0, COIN_TOP))
    K.band(trim, plan(25.3, M).r, COIN_TOP - 0.9, COIN_TOP, 0.25)
    K.loft(roof, K.at(c0, COIN_TOP), K.at(plan(SEG_LO, M).r, COIN_TOP))
    // the coins: one disc on each face's middle, ~12 m across, standing 2.2 m proud
    const n = detail ? 24 : 14
    for (let k = 0; k < 4; k++) {
      const ang = (k * Math.PI) / 2, nx = Math.cos(ang), ny = Math.sin(ang), t: P2 = [-ny, nx]
      const o: V3 = [nx * 25.0, ny * 25.0, 0]
      const disc = K.circle(0, 103.5, 5.9, n)
      K.plate(trim, disc, o, t, [nx, ny], 2.2)
      if (detail) {
        // rim ring and the square hole of an old coin, as a dark inset
        K.plate(dark, [[-1.5, 102], [1.5, 102], [1.5, 105], [-1.5, 105]], o, t, [nx, ny], 2.3)
        K.plate(trim, K.circle(0, 103.5, 6.4, n), o, t, [nx, ny], 1.2)
      }
    }
  }

  // ---------------------------------------------------------- the eight segments
  let z = COIN_TOP
  for (let s = 0; s < 8; s++) {
    const zb = z, zt = z + SEG_H - EAVE
    const lo = plan(SEG_LO, M), hi = plan(SEG_HI, M)
    const lift = (i: number) => UP * hi.lift[i]
    K.loft(glassP, K.at(lo.r, zb), K.at(hi.r, (i) => zt + lift(i)))
    // the eave: soffit out, fascia up, roof back in to the next segment's foot
    const eo = plan(SEG_HI + 0.9, M).r
    const ztop = zb + SEG_H
    K.loft(trim, K.at(hi.r, (i) => zt + lift(i)), K.at(eo, (i) => zt + lift(i)))
    K.loft(trim, K.at(eo, (i) => zt + lift(i)), K.at(eo, (i) => ztop + lift(i)))
    const next = s < 7 ? plan(SEG_LO, M).r : plan(24.0, M).r
    K.loft(s < 7 ? trim : roof, K.at(eo, (i) => ztop + lift(i)), K.at(next, ztop + (s < 7 ? 0 : 1.2)))
    if (detail) {
      // floor lines every two floors (three per segment) and mullion ridges, pale, set on the glass
      for (const f of [0.25, 0.5, 0.75]) {
        const zz = zb + f * (zt - zb), hh = SEG_LO + f * (SEG_HI - SEG_LO)
        K.band(trim, plan(hh, M).r, zz - 0.18, zz + 0.18, 0.12, 0.05)
      }
    }
    // ruyi under the eave: face middles and corners
    for (let k = 0; k < 4; k++) {
      const ang = (k * Math.PI) / 2, nx = Math.cos(ang), ny = Math.sin(ang), t: P2 = [-ny, nx]
      const zr = zt - 7.2
      const hz = SEG_LO + ((zr + 3.6 - zb) / (zt - zb)) * (SEG_HI - SEG_LO)
      ruyi(trim, [nx * hz, ny * hz, zr], t, [nx, ny], 1.0, detail)
      // the salient corner of each notch, facing diagonally out
      const ca = ang + Math.PI / 4, dx = Math.cos(ca), dy = Math.sin(ca)
      const cz = zt - 5.2, hc = (SEG_LO + ((cz + 2.5 - zb) / (zt - zb)) * (SEG_HI - SEG_LO)) * (1 - 0.118)
      ruyi(trim, [dx * hc * Math.SQRT2, dy * hc * Math.SQRT2, cz], [-dy, dx], [dx, dy], 0.62, detail)
    }
    z = ztop
  }

  // ---------------------------------------------------------- shoulder, top section, pinnacle
  const z8 = z // 389
  const sq = (h: number): P2[] => [[h, -h], [h, h], [-h, h], [-h, -h]]
  {
    // shoulder: a hipped roof from the last eave up to the top section
    const r24 = plan(24.0, M).r, r14 = plan(13.0, M).r
    K.loft(roof, K.at(r24, z8 + 1.2), K.at(r14, SHOULDER))
    K.cap(roof, r14, SHOULDER, true)
    // the deck storey under the top section (91F, the outdoor observatory)
    K.prism(dark, sq(11.6), SHOULDER, TIER0, false)
    K.loft(roof, K.at(sq(11.6), TIER0), K.at(sq(8.4), TIER0))
    // the four big ruyi on the corners of the top section
    for (let k = 0; k < 4; k++) {
      const ca = (k * Math.PI) / 2 + Math.PI / 4, dx = Math.cos(ca), dy = Math.sin(ca)
      ruyi(trim, [dx * 9.4 * Math.SQRT2, dy * 9.4 * Math.SQRT2, 414], [-dy, dx], [dx, dy], 1.15, detail)
    }
    // top section: five small flared tiers with eaves
    for (let t = 0; t < TIERS; t++) {
      const zb = TIER0 + t * TIER_H, zt = zb + TIER_H - 0.9
      const h0 = 8.4 + t * 0.22, h1 = h0 + 0.55
      K.loft(glassP, K.at(sq(h0), zb), K.at(sq(h1), zt))
      K.loft(trim, K.at(sq(h1), zt), K.at(sq(h1 + 0.5), zt))
      K.loft(trim, K.at(sq(h1 + 0.5), zt), K.at(sq(h1 + 0.5), zb + TIER_H))
      const nh = t < TIERS - 1 ? 8.4 + (t + 1) * 0.22 : 8.4
      K.loft(trim, K.at(sq(h1 + 0.5), zb + TIER_H), K.at(sq(nh), zb + TIER_H))
    }
    // cap: slopes in to the pinnacle drum
    K.loft(dark, K.at(sq(8.4), CAP0), K.at(sq(7.2), DRUM0))
    K.cap(dark, sq(7.2), DRUM0, true)
    const n = detail ? 24 : 14
    // pinnacle drum, dark, then the saucer ring
    K.cyl(dark, 0, 0, DRUM0, DRUM1 - 3, 6.9, 6.3, n, false)
    K.cyl(dark, 0, 0, DRUM1 - 3, DRUM1 - 1.4, 6.3, 8.6, n, false)
    K.cyl(dark, 0, 0, DRUM1 - 1.4, DRUM1, 8.6, 3.0, n, true)
    // spire with its rings
    const sn = detail ? 12 : 8
    K.cyl(dark, 0, 0, DRUM1, TOP - 2, 2.0, 0.55, sn, false)
    const rings = detail ? [484, 488, 492, 496, 500, 503.5] : [487, 494, 501]
    for (const zr of rings) {
      const r = 2.0 + ((0.55 - 2.0) * (zr - DRUM1)) / (TOP - 2 - DRUM1)
      K.cyl(trim, 0, 0, zr, zr + 1.1, r + 0.45, r + 0.45, sn, true, true)
    }
    K.cyl(dark, 0, 0, TOP - 2, TOP, 0.55, 0.15, sn, true)
    K.cyl(lamp, 0, 0, TOP - 3.2, TOP - 1.6, 0.9, 0.9, 8, true, true)
  }

  // ---------------------------------------------------------- the mall
  mall(glassP, trim, roof, vault, detail)

  return [
    { part: glassP, material: windowVariant(2, 0x5e9895) },
    { part: trim, material: { ...finish('neon-taipei-trim', 0xdde3e1) } },
    { part: dark, material: finish('taipei-pinnacle', 0x5a6168) },
    { part: roof, material: PALETTE.roof },
    { part: vault, material: PALETTE.glass },
    { part: lamp, material: finish('lamp-spire', 0xc9c2a8) },
  ]
}

/**
 * A ruyi (cloud head) plate on a face: three round lobes over a pointed
 * chin and a short stem. Low LOD: an eight-sided shield of the same size.
 */
function ruyi(p: Part, o: V3, t: P2, n: P2, s: number, detail: boolean) {
  const W = 3.3 * s, H = 7 * s
  if (!detail) {
    const sh: P2[] = [[0, 0], [W * 0.35, H * 0.35], [W, H * 0.62], [W * 0.8, H], [-W * 0.8, H], [-W, H * 0.62], [-W * 0.35, H * 0.35]]
    K.plate(p, sh, o, t, n, 0.9 * s + 0.3)
    return
  }
  // outline: chin at the bottom, two side lobes, a top lobe
  const pts: P2[] = [[0, 0], [W * 0.18, H * 0.3], [W * 0.18, H * 0.42]]
  const lobe = (cx: number, cy: number, r: number, a0: number, a1: number, m: number) => {
    for (let k = 0; k <= m; k++) { const a = a0 + ((a1 - a0) * k) / m; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  }
  lobe(W * 0.62, H * 0.66, W * 0.38, -Math.PI * 0.75, Math.PI * 0.55, 6)
  lobe(0, H * 0.8, W * 0.42, Math.PI * 0.05, Math.PI * 0.95, 6)
  lobe(-W * 0.62, H * 0.66, W * 0.38, Math.PI * 0.45, Math.PI * 1.75, 6)
  pts.push([-W * 0.18, H * 0.42], [-W * 0.18, H * 0.3])
  K.plate(p, pts, o, t, n, 0.9 * s + 0.3)
  // the boss in the middle of the head
  K.plate(p, K.circle(0, H * 0.66, W * 0.22, 10), o, t, n, 1.3 * s + 0.3)
}

// The mall, from OSM, projected into the model frame (metres, rounded to 0.1).
const MALL_M = {
  blocks: [
    // way/64566862, 30 m, 6 levels: the big block west and north of the tower
    { h: 30, r: [[-83.5, -24.2], [-56.5, -24.2], [-56.5, 12.4], [-26.9, 12.4], [-26.9, 21.3], [-23.7, 21.3], [-23.7, 22.9], [-25.5, 24.7], [-24.7, 25.4], [-22.9, 23.6], [-21.4, 23.6], [-21.4, 26.8], [-12.5, 26.8], [-12.5, 56.5], [24.2, 56.5], [24.2, 95.2], [-95.5, 95.2], [-95.5, -24.2]] as P2[] },
    // way/1159328963, 25 m, 5 levels: the west wing and the podium ring round the tower's foot
    { h: 25, r: [[-56.5, -14.9], [-56.5, 12.4], [-28.8, 12.4], [-28.8, -29.2], [29.3, -29.2], [29.3, 29.1], [14.9, 29.1], [14.9, 32.1], [32.1, 32.1], [32.1, -32.0], [9.5, -32.0], [9.5, -29.9], [-9.4, -29.9], [-9.4, -32.0], [-32.3, -32.1], [-32.3, -14.9]] as P2[] },
    // way/1159328964, 25 m, 5 levels: the north wing (its ring round the tower is drawn by the tower itself)
    { h: 25, r: [[-12.5, 26.8], [-12.5, 56.5], [14.9, 56.5], [14.9, 26.8]] as P2[] },
  ],
  // way/615183624 (30-42 m): the outer and inner edges of the arched vault, paired end to end
  vaultA: [[-85.0, 71.2], [-78.6, 61.7], [-71.5, 52.7], [-63.8, 44.3], [-55.4, 36.5], [-46.5, 29.3], [-40.1, 24.8]] as P2[],
  vaultB: [[-71.6, 84.4], [-68.3, 82.3], [-65.1, 80.0], [-56.1, 73.1], [-47.5, 65.6], [-39.6, 57.6], [-32.1, 49.0], [-25.4, 39.9]] as P2[],
  // 1-level roof parts: entrance canopies (way/1339487734 .. 1339487738)
  canopies: [
    [[32.1, -6.1], [42.8, -6.1], [42.8, 6.2], [32.1, 6.2]],
    [[-5.9, -42.8], [6.1, -42.8], [6.1, -32.9], [-5.9, -32.9]],
    [[-48.1, 95.2], [-23.8, 95.2], [-23.8, 103.2], [-48.1, 103.2]],
    [[24.2, 68.5], [31.0, 68.5], [31.0, 83.7], [24.2, 83.7]],
    [[-83.5, -31.2], [-69.1, -31.2], [-69.1, -24.2], [-83.5, -24.2]],
  ] as P2[][],
}

/** Resample a polyline to n points evenly by length. */
function resample(l: P2[], n: number): P2[] {
  const d = [0]
  for (let i = 1; i < l.length; i++) d.push(d[i - 1] + Math.hypot(l[i][0] - l[i - 1][0], l[i][1] - l[i - 1][1]))
  const L = d[d.length - 1]
  return Array.from({ length: n }, (_, k) => {
    const s = (L * k) / (n - 1)
    let i = 1
    while (i < l.length - 1 && d[i] < s) i++
    const t = (s - d[i - 1]) / (d[i] - d[i - 1] || 1)
    return [l[i - 1][0] + (l[i][0] - l[i - 1][0]) * t, l[i - 1][1] + (l[i][1] - l[i - 1][1]) * t] as P2
  })
}

function mall(glassP: Part, trim: Part, roof: Part, vault: Part, detail: boolean) {
  // Mall polygons in model metres are filled in by main() from osm data (see MALL_M).
  for (const { r, h } of MALL_M.blocks) {
    const rr = K.ccw(r)
    const g = Math.min(h - 8, 21.5) // glass walls up to the frieze
    K.loft(glassP, K.at(rr, 0), K.at(rr, g))
    K.loft(roof, K.at(rr, g), K.at(rr, g + 3.2)) // the grey frieze band
    if (detail) K.band(trim, rr, g + 3.2, g + 3.8, 0.35, 0.1)
    const inner = K.offset(rr, -1.6)
    K.loft(roof, K.at(rr, g + 3.2), K.at(inner, g + 3.2))
    K.loft(roof, K.at(inner, g + 3.2), K.at(inner, h))
    K.cap(roof, inner, h, true)
  }
  // arched glass vault along way/615183624, 30 -> 42 m
  const nv = detail ? 12 : 7
  const a = resample(MALL_M.vaultA, nv), b = resample(MALL_M.vaultB, nv)
  const n = detail ? 10 : 6
  for (let i = 0; i < a.length - 1; i++) {
    for (let k = 0; k < n; k++) {
      const P = (j: number, t: number): V3 => {
        const x = a[j][0] + (b[j][0] - a[j][0]) * t, y = a[j][1] + (b[j][1] - a[j][1]) * t
        return [x, y, 30 + 12 * Math.sin(Math.PI * t)]
      }
      const t0 = k / n, t1 = (k + 1) / n
      vault.quad(P(i, t0), P(i + 1, t0), P(i + 1, t1), P(i, t1))
    }
  }
  // gable ends of the vault
  for (const j of [0, a.length - 1]) {
    const ring: P2[] = [], zs: number[] = []
    for (let k = 0; k <= n; k++) { const t = k / n; ring.push([a[j][0] + (b[j][0] - a[j][0]) * t, a[j][1] + (b[j][1] - a[j][1]) * t]); zs.push(30 + 12 * Math.sin(Math.PI * t)) }
    for (let k = 1; k < n - 0; k++) {
      const A: V3 = [ring[0][0], ring[0][1], 30], B: V3 = [ring[k][0], ring[k][1], zs[k]], C: V3 = [ring[k + 1][0], ring[k + 1][1], zs[k + 1]]
      const dir: P2 = j === 0 ? [a[0][0] - a[1][0], a[0][1] - a[1][1]] : [a[j][0] - a[j - 1][0], a[j][1] - a[j - 1][1]]
      const g = cross3(sub3(B, A), sub3(C, A))
      if (g[0] * dir[0] + g[1] * dir[1] > 0) vault.tri(A, B, C)
      else vault.tri(A, C, B)
    }
  }
  // entrance canopies (1-level roof parts): slabs at 5.5 m on two posts
  for (const r of MALL_M.canopies) {
    K.prism(roof, r, 5.0, 5.8, true, true)
    if (detail) {
      const c = r.reduce((s, q) => [s[0] + q[0] / r.length, s[1] + q[1] / r.length], [0, 0])
      for (const q of [r[0], r[Math.floor(r.length / 2)]]) {
        const x = c[0] + (q[0] - c[0]) * 0.7, y = c[1] + (q[1] - c[1]) * 0.7
        K.box(trim, [x, y, 2.5], 0.3, 0.3, 2.5)
      }
    }
  }
}

// ============================================================ write
const REPLACES = [
  'way/1159328965', // the outline: tower and mall
  'way/198637969', 'way/615183621', 'way/615183622', 'way/615184269', 'way/615183623', // tower
  'way/64566862', 'way/615183624', 'way/1159328963', 'way/1159328964', // mall
  'way/1339487717', 'way/1339487718', 'way/1339487719', 'way/1339487720', 'way/1339487721', 'way/1339487722',
  'way/1339487723', 'way/1339487724', 'way/1339487725', 'way/1339487726', 'way/1339487727', 'way/1339487728',
  'way/1339487729', 'way/1339487730', 'way/1339487731', 'way/1339487732', 'way/1339487733',
  'way/1339487734', 'way/1339487735', 'way/1339487736', 'way/1339487737', 'way/1339487738', // canopies
]

if (import.meta.main) {
  for (const [file, detail, maxTris, maxBytes] of [
    ['taipei-101.glb', false, 6500, 250 * 1024],
    ['taipei-101.detail.glb', true, 40000, 1536 * 1024],
  ] as const) {
    const parts = build(detail)
    const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
    if (process.env.COUNTS) console.log(parts.map(({ part, material }) => material.name + ' ' + part.triangles).join(', '))
    if (triangles > maxTris) throw new Error(`${file}: triangle budget exceeded: ${triangles}`)
    const glb = writeGlb('Taipei 101', parts, {
      license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: TOP,
      frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
      replaces: REPLACES,
    } as any)
    if (glb.length > maxBytes) throw new Error(`${file}: file budget exceeded: ${glb.length}`)
    const out = new URL(`../models/${file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
  }
}
