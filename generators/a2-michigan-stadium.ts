/**
 * Michigan Stadium, "the Big House" (1927, Bernard L. Green for the Osborn
 * Engineering Co.; 2010 renovation by HNTB with Workshop Architects), Ann
 * Arbor, Michigan — original procedural geometry, CC0-1.0, no textures.
 *   bun generators/a2-michigan-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the field runs
 * north-south). The anchor is the area centroid of the outline, OSM
 * way/40976130 (outer of relation/1637002), 42.2658778, -83.7487018. The
 * field's centre is 1.76 m east and 0.62 m north of it.
 *
 * z = 0 is the field. The bowl is dug into the ground: the street outside
 * stands 13 m above the field on the west (Main Street), 10.5 m on the east
 * and 15-16 m at the two ends (lidar ground returns just outside the
 * outline). The 2016 lidar and Mapterhorn both show the pit, so the map's
 * terrain already holds the field at the bottom of the bowl and the model
 * needs no `elevation`: the map puts y = 0 on the lowest ground under the
 * model, which is the field. (Checked: `terrain.ts check --elevation -13`,
 * the street's depth, buries 95% of the model's tops by up to 13 m.) The outer walls run down to z = 0 and sink into
 * the berm, as STYLE.md asks of uphill walls.
 *
 * What makes it the Big House, from the photos:
 *  1. One huge, shallow, unbroken bowl of blue bleachers, round-ended, with
 *     no upper deck (Lectrician2 aerial; Ken Lund, field level).
 *  2. The 2010 side structures: a long block of navy suites and press box
 *     along each sideline, held at each end by tall red-brick towers with
 *     tall arched windows (aerial; Dwight Burdette from the south-west;
 *     Michael Barera 251, the west face on Main Street).
 *  3. The south scoreboard: a navy board with the maize block M on its back,
 *     standing on six tall grey columns over the south rim (Ken Lund;
 *     Barera 248; Ajay Suresh). The north board, without the M, on the
 *     north rim.
 *  4. The low navy fascia ringing the rim at the two ends, over the open
 *     steel concourse, the bowl barely rising above the street outside
 *     (Barera 248; Ken Lund).
 *  5. Brick: the outer arcade on Main Street, the east wing's big arched
 *     windows (Barera 251; Bgirardot) and the low brick wall round the
 *     field (Ken Lund, field level).
 *
 * Sources:
 * - Plan: OSM relation/1637002 (outer way/40976130, inner field
 *   way/118928958), the bowl part relation/21070731 (outer
 *   way/1535859829), the side structures way/560433245 (west) and
 *   way/560433244 (east), the boards way/560433246 (south) and
 *   way/560433247 (north). The bowl is drawn in 64 steps about the field's
 *   centre: RF the field edge (OSM inner), RR the bowl's outer edge (OSM
 *   part), RO the outline (OSM).
 * - Heights: USGS 3DEP lidar, USGS_LPC_MI_31Co_Washtenaw_2016_LAS_2019
 *   (flight 2016, after the 2010 renovation), 1 m grid. Measured: the field
 *   (z 0); the rake (a near-straight profile, z = top * t^p, p 1.1
 *   along the sides, 1.0 at the north end, 1.15 at the south); the top row
 *   per step (HT0: 21-22 m along the sidelines, 23-26 m at the ends, where
 *   the fascia rises over it; drawn level at 21.5 and 24.5 m); the
 *   west and east main blocks 40.5-40.7 m with a raised middle to 43.3 m
 *   on the west; the four brick end towers 45.2-45.9 m; the west arcade
 *   35.4-36.7 m; the east brick wing 35.3-36.7 m; the east stair tower
 *   45.8 m; both boards' tops 45.5 m, 30 m (south) and 33 m (north) wide.
 *   The suites' field faces from OSM, checked against the lidar edge.
 * - Published: opened 1927; capacity 107,601 (OSM, Wikipedia); the 2010
 *   renovation added the two side structures (Wikipedia, "Michigan
 *   Stadium").
 * - Estimated: the boards' height (16 m: Ken Lund's photo from below gives
 *   board 0.41 of its width, the columns' visible length 0.37, which with
 *   the 30 m lidar width and the 45.5 m top brings the columns' foot to the
 *   15.5 m street; the aerial agrees) and the columns (2.2 m across, six on
 *   each board, from the same photo); the fascia's depth (4 m) and the concourse
 *   recess under it (2.5 m); the suite glazing bands (three, from the
 *   aerial); the arched windows' pitch and sizes (Barera 251, Bgirardot);
 *   the field wall (1.5 m, Ken Lund, lidar). The block M's letterform is traced
 *   from Ken Lund's photo of the south board.
 * - Left out: the field and the ground (the map's), aisles and rails, the
 *   painted maize M in the east stands, the "MICHIGAN STADIUM" lettering on
 *   the north board, flags, rooftop plant, the Circle of Champions
 *   colonnade and the brick gate piers outside the outline.
 *
 * Photos (Wikimedia Commons; EVIDENCE):
 * - Lectrician2, "Michigan Stadium Aerial.jpg", CC BY-SA 4.0 (drone, from
 *   the south).
 * - Chris Cafiero, "My experience of flying my drone around Michigan
 *   Stadium aka The Big House - 03.05.22 - was not good.webm", CC BY 3.0
 *   (drone, over the south-east tower looking north).
 * - Dwight Burdette, "Michigan Stadium and Crisler Arena, Ann Arbor,
 *   Michigan.JPG", CC BY 3.0 (from the south-west, far).
 * - Dwight Burdette, "Michigan Stadium at Night, University of Michigan,
 *   Ann Arbor, Michigan - panoramio.jpg", CC BY 3.0 (night, south-east).
 * - Michael Barera, "University of Michigan August 2013 248 (Michigan
 *   Stadium).jpg" and "... 251 (Michigan Stadium).jpg", CC BY-SA 4.0 (the
 *   south end and board; the west face on Main Street).
 * - Ken Lund, "Michigan Stadium, University of Michigan, Ann Arbor,
 *   Michigan (21556601710).jpg" and "(21718534636).jpg", CC BY-SA 2.0 (the
 *   south board from below; the bowl from field level).
 * - Bgirardot, "Michigan Stadium and Chrysler Arena, Ann Arbor, MI,
 *   January 6, 2014.JPG", CC0 (the east wing's arched windows).
 * - Ajay Suresh, "Michigan Stadium Entry (8295130075).jpg", CC BY 2.0.
 *
 * Doubts: the outer faces of the north-east and north-west towers are
 * seen only far off in the aerial; their windows are carried round from
 * the photographed faces. The board heights are from a photo, not lidar
 * (lidar gives only their tops).
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const seats = new Part(), stone = new Part(), brick = new Part(), navy = new Part(), win = new Part(), maize = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]

/** A triangle wound to face `hint`. */
function tri(p: Part, A: V3, B: V3, C: V3, hint: V3) {
  const n = cross(sub(B, A), sub(C, A))
  if (Math.hypot(...n) < 1e-9) return
  if (dot(n, hint) >= 0) p.tri(A, B, C)
  else p.tri(A, C, B)
}
/** A planar quad wound to face `hint`. */
function quad(p: Part, P: V3[], hint: V3) {
  tri(p, P[0], P[1], P[2], hint)
  tri(p, P[0], P[2], P[3], hint)
}

type P2 = [number, number]
const area2 = (r: P2[]) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2
const ccw = (r: P2[]) => (area2(r) < 0 ? [...r].reverse() : r)

/** Ear clipping for a simple polygon, counter-clockwise. */
function earcut(ring: P2[]): [number, number, number][] {
  const idx = ring.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const a = ring[ia], b = ring[ib], c = ring[ic]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(ring[j], a, b, c))) continue
      out.push([ia, ib, ic])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (cut) continue
    // what is left may be collinear points with no area: that is done
    if (Math.abs(area2(idx.map((i) => ring[i]))) < 1e-9) return out
    throw new Error(`earcut: no ear left with ${idx.length} vertices`)
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}

/** A flat polygon at height z, facing up or down. */
function flat(p: Part, ring: P2[], z: number, up = true) {
  const r = ccw(ring)
  for (const [a, b, c] of earcut(r)) tri(p, [...r[a], z] as V3, [...r[b], z] as V3, [...r[c], z] as V3, [0, 0, up ? 1 : -1])
}

/** A vertical prism on a plan ring; `top` takes the roof; `under` closes the bottom too. */
function prism(side: Part, ring: P2[], z0: number, z1: number, top: Part = side, under = false) {
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const n: V3 = [b[1] - a[1], a[0] - b[0], 0]
    quad(side, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], n)
  }
  flat(top, r, z1)
  if (under) flat(side, r, z0, false)
}

/** The outward edges of a ring (counter-clockwise), with their outward normals. */
function edges(ring: P2[]) {
  const r = ccw(ring)
  return r.map((a, i) => {
    const b = r[(i + 1) % r.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    return { a, b, L, n: [(b[1] - a[1]) / L, (a[0] - b[0]) / L] as P2 }
  })
}

/** A flat panel on a wall from a to b (plan), set 0.06 m proud along n. */
function panel(p: Part, a: P2, b: P2, n: P2, z0: number, z1: number) {
  const o = 0.06
  const A: V3 = [a[0] + n[0] * o, a[1] + n[1] * o, z0], B: V3 = [b[0] + n[0] * o, b[1] + n[1] * o, z0]
  quad(p, [A, B, [B[0], B[1], z1], [A[0], A[1], z1]], [n[0], n[1], 0])
}

/** A round-headed window: a panel of width w centred at c on the wall, jambs z0..z1, a semicircle on top. */
function arched(p: Part, c: P2, u: P2, n: P2, w: number, z0: number, z1: number) {
  const h = w / 2, o = 0.06
  const at = (s: number, z: number): V3 => [c[0] + u[0] * s + n[0] * o, c[1] + u[1] * s + n[1] * o, z]
  const hint: V3 = [n[0], n[1], 0]
  quad(p, [at(-h, z0), at(h, z0), at(h, z1), at(-h, z1)], hint)
  const seg = 8, ctr = at(0, z1)
  for (let i = 0; i < seg; i++) {
    const t0 = (i / seg) * Math.PI, t1 = ((i + 1) / seg) * Math.PI
    tri(p, ctr, at(h * Math.cos(t0), z1 + h * Math.sin(t0)), at(h * Math.cos(t1), z1 + h * Math.sin(t1)), hint)
  }
}

/** A vertical cylinder of `seg` sides. */
function column(p: Part, x: number, y: number, r: number, z0: number, z1: number, seg = 12) {
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2
    const A: P2 = [x + r * Math.cos(a0), y + r * Math.sin(a0)], B: P2 = [x + r * Math.cos(a1), y + r * Math.sin(a1)]
    const m = (a0 + a1) / 2
    quad(p, [[A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1]], [Math.cos(m), Math.sin(m), 0])
  }
}

// ---------------------------------------------------------------------------
// The bowl, about the field's centre, in 64 steps of 5.625 degrees
// counter-clockwise from east. RF the field edge, RR the bowl's outer edge,
// RO the outline (all OSM); HT the top of the stands (lidar).
const CX = 1.76, CY = 0.62
const RF = [30.0, 30.1, 30.5, 31.2, 32.3, 33.7, 35.7, 38.3, 41.8, 46.5, 52.8, 59.5, 62.3, 63.2, 62.3, 61.4, 60.9, 61.1, 61.8, 63.2, 65.3, 66.5, 65.7, 61.7, 55.7, 50.8, 47.1, 44.3, 42.2, 40.7, 39.6, 39.0, 38.7, 38.8, 39.3, 40.2, 41.6, 43.5, 46.0, 49.4, 53.8, 59.7, 64.6, 66.3, 65.8, 63.8, 62.2, 61.2, 60.8, 61.0, 61.8, 62.9, 62.9, 60.6, 55.4, 48.5, 43.1, 39.2, 36.4, 34.2, 32.6, 31.5, 30.6, 30.2]
const RR = [87.6, 87.9, 89.0, 91.1, 94.3, 98.5, 102.6, 107.2, 110.2, 118.4, 121.2, 122.4, 123.4, 123.7, 122.8, 122.4, 121.6, 122.0, 123.6, 125.1, 126.7, 127.1, 126.6, 126.1, 123.9, 115.5, 112.5, 108.2, 104.4, 100.5, 97.8, 96.2, 95.6, 95.9, 97.2, 100.3, 103.8, 107.8, 110.7, 113.9, 123.6, 125.9, 127.1, 128.4, 127.6, 126.8, 125.2, 123.8, 123.0, 123.5, 123.9, 125.2, 124.5, 123.9, 122.3, 120.0, 111.6, 107.8, 104.3, 99.8, 95.3, 91.9, 89.5, 88.1]
const RO = [110.5, 110.9, 112.4, 116.1, 118.9, 124.4, 127.6, 133.3, 133.9, 118.4, 121.2, 122.4, 123.4, 123.7, 122.8, 122.4, 121.6, 122.0, 123.6, 125.1, 126.7, 127.1, 126.6, 126.1, 123.9, 142.7, 138.0, 132.4, 118.9, 114.5, 112.3, 111.8, 111.1, 111.6, 111.9, 113.4, 117.4, 130.7, 137.0, 141.8, 123.6, 125.9, 127.1, 128.4, 127.6, 126.8, 125.2, 123.8, 123.0, 123.5, 123.9, 125.2, 124.5, 123.9, 122.3, 120.0, 118.1, 134.9, 129.5, 125.0, 120.4, 116.0, 113.0, 111.2]
const N = RF.length
const wrap = (k: number) => ((k % N) + N) % N
// the rim at the ends (where the bowl is the outline) and along the sides (under the suites)
const isEnd = (k: number) => RO[wrap(k)] - RR[wrap(k)] < 1
// one rim height for the ends and one for the sides, the lidar's medians
// (per step 21.0-22.0 m along the sides, 23.1-25.9 m at the ends): the top
// row is level all round, and the scatter is rails, flags and people
const HT = Array.from({ length: N }, (_, k) => (isEnd(k) ? 24.5 : 21.5))
const ang = (k: number) => (wrap(k) / N) * Math.PI * 2
const at = (k: number, r: number, z: number): V3 => [CX + r * Math.cos(ang(k)), CY + r * Math.sin(ang(k)), z]
const out = (k: number): V3 => [Math.cos(ang(k) + Math.PI / N), Math.sin(ang(k) + Math.PI / N), 0]
const inw = (k: number): V3 => mul(out(k), -1)

const WALL = 1.5 // the brick wall round the field (Ken Lund; lidar 1.7-2.0 m at the first row)
const FASCIA = 4.0, RECESS = 2.5 // the navy fascia at the ends, and the concourse under it
const BANDS = [0, 0.25, 0.5, 0.75, 1]
// the rake's curve, z = top * t^p, fitted to the lidar: near straight along
// the sides and at the north end, whose low rows stand ~0.9 m higher than
// the south end's
const rake = (kk: number) => (Math.sin(ang(kk)) > 0.5 ? 1.0 : Math.sin(ang(kk)) < -0.5 ? 1.15 : 1.1)
for (let k = 0; k < N; k++) {
  const k1 = k + 1, end = isEnd(k) && isEnd(k1)
  const top = (kk: number) => (isEnd(kk) ? HT[wrap(kk)] - 2.0 : HT[wrap(kk)]) // the top row
  const rt = (kk: number) => (isEnd(kk) ? RR[wrap(kk)] - 3.0 : RR[wrap(kk)]) // where it stands
  const rf = (kk: number) => RF[wrap(kk)]
  // the field wall
  quad(brick, [at(k, rf(k), 0), at(k1, rf(k1), 0), at(k1, rf(k1), WALL), at(k, rf(k), WALL)], inw(k))
  // the rake, in four bands
  const p = (kk: number, t: number): V3 => at(kk, rf(kk) + 0.6 + (rt(kk) - rf(kk) - 0.6) * t, WALL + (top(kk) - WALL) * Math.pow(t, rake(kk)))
  quad(seats, [at(k, rf(k), WALL), at(k1, rf(k1), WALL), p(k1, 0), p(k, 0)], [0, 0, 1])
  for (let i = 0; i < BANDS.length - 1; i++) {
    quad(seats, [p(k, BANDS[i]), p(k1, BANDS[i]), p(k1, BANDS[i + 1]), p(k, BANDS[i + 1])], add(inw(k), [0, 0, 2.5]))
  }
  if (end) {
    const RRk = RR[wrap(k)], RRk1 = RR[wrap(k1)], hk = HT[wrap(k)], hk1 = HT[wrap(k1)]
    // the walkway behind the top row, the fascia's inner face, its top, its outer face
    const ta = top(k), tb = top(k1)
    quad(stone, [p(k, 1), p(k1, 1), at(k1, RRk1 - 0.8, tb), at(k, RRk - 0.8, ta)], [0, 0, 1])
    quad(navy, [at(k, RRk - 0.8, ta), at(k1, RRk1 - 0.8, tb), at(k1, RRk1 - 0.8, hk1), at(k, RRk - 0.8, hk)], inw(k))
    quad(navy, [at(k, RRk - 0.8, hk), at(k1, RRk1 - 0.8, hk1), at(k1, RRk1, hk1), at(k, RRk, hk)], [0, 0, 1])
    quad(navy, [at(k, RRk, hk - FASCIA), at(k1, RRk1, hk1 - FASCIA), at(k1, RRk1, hk1), at(k, RRk, hk)], out(k))
    // the concourse under it, recessed into shadow, down into the berm
    quad(navy, [at(k, RRk, hk - FASCIA), at(k1, RRk1, hk1 - FASCIA), at(k1, RRk1 - RECESS, hk1 - FASCIA), at(k, RRk - RECESS, hk - FASCIA)], [0, 0, -1])
    quad(navy, [at(k, RRk - RECESS, 0), at(k1, RRk1 - RECESS, 0), at(k1, RRk1 - RECESS, hk1 - FASCIA), at(k, RRk - RECESS, hk - FASCIA)], out(k))
  } else {
    // along the sides the top row meets the suites: a low back wall, run down
    // to the field level so no gap shows between the stands and the towers.
    // It stands on the top row's own edge, so where a side step meets an end
    // (the end's top row is 3 m in from the rim) there is no gap either.
    const ta = top(k), tb = top(k1), ra = rt(k), rb = rt(k1)
    quad(navy, [at(k, ra, ta), at(k1, rb, tb), at(k1, rb, tb + 1.2), at(k, ra, ta + 1.2)], inw(k))
    quad(navy, [at(k, ra, ta + 1.2), at(k1, rb, tb + 1.2), at(k1, rb + 0.6, tb + 1.2), at(k, ra + 0.6, ta + 1.2)], [0, 0, 1])
    quad(navy, [at(k, ra + 0.6, 0), at(k1, rb + 0.6, 0), at(k1, rb + 0.6, tb + 1.2), at(k, ra + 0.6, ta + 1.2)], out(k))
  }
}
// close the ends of each end's fascia and concourse: an end starts on ray
// k + 1 when the step k -> k + 1 enters it, and stops on ray k when it leaves
for (let k = 0; k < N; k++) {
  if (isEnd(k) === isEnd(k + 1)) continue
  const starts = isEnd(k + 1), kk = starts ? k + 1 : k
  const r = RR[wrap(kk)], h = HT[wrap(kk)]
  const t: V3 = [-Math.sin(ang(kk)), Math.cos(ang(kk)), 0] // counter-clockwise along the rim
  quad(navy, [at(kk, r - 3.0, 0), at(kk, r, 0), at(kk, r, h), at(kk, r - 3.0, h)], starts ? mul(t, -1) : t)
}

// ---------------------------------------------------------------------------
// The side structures (2010): OSM way/560433245 (west) and way/560433244
// (east), split by the lidar into brick towers, a navy suite block and brick
// outer wings. Heights above the field, lidar.
type Block = { ring: P2[]; h: number; mat: Part; base: number }
const W_ST = 13, E_ST = 10.5 // the street outside, above the field
const blocks: Record<string, Block> = {
  wArcade: { ring: [[-115.1, -56.5], [-108.5, -56.5], [-108.5, 55.0], [-115.1, 55.0]], h: 36.0, mat: brick, base: W_ST },
  wMain: { ring: [[-108.5, -57.0], [-93.6, -57.0], [-94.0, -17.8], [-94.6, 44.7], [-94.6, 55.0], [-108.5, 55.0]], h: 40.6, mat: navy, base: W_ST },
  wMid: { ring: [[-107.5, -17.0], [-94.2, -17.0], [-94.4, 14.0], [-107.5, 14.0]], h: 43.4, mat: navy, base: W_ST },
  swTower: { ring: [[-113.5, -56.5], [-113.6, -63.4], [-112.5, -73.7], [-110.9, -82.3], [-108.7, -87.3], [-104.7, -97.3], [-97.6, -92.7], [-98.4, -56.5]], h: 45.5, mat: brick, base: W_ST },
  swWedge: { ring: [[-98.4, -57.0], [-97.6, -92.7], [-91.7, -88.9], [-82.2, -82.6], [-91.8, -56.7]], h: 41.0, mat: navy, base: W_ST },
  nwTower: { ring: [[-115.0, 55.0], [-115.1, 61.8], [-114.5, 68.7], [-113.4, 76.0], [-112.2, 80.6], [-111.1, 84.4], [-107.4, 94.2], [-98.0, 89.3], [-98.5, 55.0]], h: 45.5, mat: brick, base: W_ST },
  nwWedge: { ring: [[-98.5, 55.0], [-98.0, 89.3], [-95.1, 85.5], [-89.4, 82.4], [-84.9, 80.2], [-91.7, 63.6], [-94.6, 55.0]], h: 41.0, mat: navy, base: W_ST },
  eWing: { ring: [[103.0, -56.0], [112.8, -56.0], [112.8, 32.5], [103.0, 32.5]], h: 35.5, mat: brick, base: E_ST },
  eWing2: { ring: [[103.0, 43.7], [112.3, 43.7], [112.3, 58.0], [103.0, 58.0]], h: 35.5, mat: brick, base: E_ST },
  eStair: { ring: [[100.0, 32.5], [112.9, 32.5], [112.9, 43.7], [100.0, 43.7]], h: 45.8, mat: brick, base: E_ST },
  eMain: { ring: [[89.9, -56.0], [103.0, -56.0], [103.0, 58.0], [88.5, 58.0], [88.7, 46.2], [89.9, -44.7]], h: 40.5, mat: navy, base: E_ST },
  neTower: { ring: [[93.0, 58.0], [111.4, 58.0], [111.4, 62.2], [108.0, 71.0], [106.8, 77.4], [105.2, 83.7], [104.0, 87.6], [99.9, 97.3], [92.0, 92.7]], h: 45.5, mat: brick, base: E_ST },
  neWedge: { ring: [[88.5, 58.0], [93.0, 58.0], [92.0, 92.7], [90.9, 90.0], [86.7, 87.6], [82.5, 85.2], [77.7, 82.5], [85.9, 66.0]], h: 41.0, mat: navy, base: E_ST },
  seTower: { ring: [[93.0, -56.0], [110.6, -56.0], [110.4, -61.9], [110.1, -66.6], [109.4, -71.2], [107.7, -80.3], [106.4, -84.2], [102.4, -93.8], [93.5, -88.6]], h: 45.5, mat: brick, base: E_ST },
  seWedge: { ring: [[89.9, -56.0], [93.0, -56.0], [93.5, -88.6], [89.1, -85.1], [85.0, -82.7], [80.0, -79.8], [88.1, -60.7]], h: 41.0, mat: navy, base: E_ST },
}
for (const b of Object.values(blocks)) prism(b.mat, b.ring, 0, b.h, stone)
// a stone coping round the brick towers' tops
for (const key of ['swTower', 'nwTower', 'neTower', 'seTower', 'eStair']) {
  const b = blocks[key]
  for (const e of edges(b.ring)) panel(stone, e.a, e.b, e.n, b.h - 1.0, b.h)
}

/** Window bands on the field faces of the suites: three levels over the top rows. */
const fieldFace = (b: Block, inward: (n: P2) => boolean, levels: [number, number][]) => {
  for (const e of edges(b.ring)) {
    if (!inward(e.n) || e.L < 4) continue
    for (const [z0, z1] of levels) panel(win, e.a, e.b, e.n, z0, Math.min(z1, b.h - 0.8))
  }
}
const SUITES: [number, number][] = [[23.5, 27.5], [29.0, 32.8], [34.5, 39.4]]
// a face looks at the field when its normal points back towards the centre
const towardsField = (b: Block) => (n: P2) => {
  const r = ccw(b.ring), cx = r.reduce((s, p) => s + p[0], 0) / r.length, cy = r.reduce((s, p) => s + p[1], 0) / r.length
  return n[0] * (CX - cx) + n[1] * (CY - cy) > 0.5 * Math.hypot(CX - cx, CY - cy)
}
for (const key of ['wMain', 'swWedge', 'nwWedge', 'eMain', 'neWedge', 'seWedge']) fieldFace(blocks[key], towardsField(blocks[key]), SUITES)
fieldFace(blocks.wMid, towardsField(blocks.wMid), [[40.6 + 0.6, 43.4]])

/** Tall round-headed windows on the towers' outer faces, one per long face. */
for (const key of ['swTower', 'nwTower', 'neTower', 'seTower', 'eStair']) {
  const b = blocks[key], facing = towardsField(b)
  for (const e of edges(b.ring)) {
    if (e.L < 6.5 || facing(e.n)) continue
    const mid: P2 = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], u: P2 = [(e.b[0] - e.a[0]) / e.L, (e.b[1] - e.a[1]) / e.L]
    // facing a neighbour block (the wings) the face is hidden below their roofs
    const z0 = key === 'eStair' ? 36.5 : b.base + 3.5
    const pair = e.L > 14 ? [-e.L / 4, e.L / 4] : [0]
    for (const s of pair) arched(win, [mid[0] + u[0] * s, mid[1] + u[1] * s], u, e.n, 2.6, z0, b.h - 4.6)
  }
}
// the west arcade on Main Street: two storeys of round-headed arches
{
  const x = -115.1, n: P2 = [-1, 0], u: P2 = [0, -1]
  for (let y = -51.5; y <= 51; y += 6.4) {
    arched(win, [x, y], u, n, 3.6, W_ST + 2.0, W_ST + 8.0)
    arched(win, [x, y], u, n, 3.6, W_ST + 12.5, W_ST + 18.5)
  }
}
// the east wing: one storey of big arched windows, a glazed band over them
{
  const n: P2 = [1, 0], u: P2 = [0, 1]
  for (const [x, y0, y1] of [[112.8, -51, 28], [112.3, 47.5, 54]]) {
    for (let y = y0; y <= y1; y += 7.0) arched(win, [x, y], u, n, 4.2, 22.0, 28.5)
  }
  for (const [x, y0, y1] of [[112.8, -55, 32], [112.3, 44.2, 57.5]]) panel(win, [x, y0], [x, y1], n, 32.0, 34.6)
}

// ---------------------------------------------------------------------------
// The scoreboards on the end rims (OSM way/560433246, way/560433247; lidar
// tops 45.5 m): navy boards on six grey columns; the block M on the back
// of the south board.
const BOARD_TOP = 45.5, BOARD_H = 16.0, BOARD_D = 2.6
function board(x0: number, x1: number, y: number, back: number) {
  const z0 = BOARD_TOP - BOARD_H, yb = y + back * BOARD_D / 2, yf = y - back * BOARD_D / 2
  prism(navy, [[x0, yf], [x1, yf], [x1, yb], [x0, yb]], z0, BOARD_TOP, navy, true)
  // the dark frame under it, set in
  prism(navy, [[x0 + 0.8, y - 0.9], [x1 - 0.8, y - 0.9], [x1 - 0.8, y + 0.9], [x0 + 0.8, y + 0.9]], z0 - 2.0, z0, navy, true)
  const w = x1 - x0
  for (let i = 0; i < 6; i++) column(stone, x0 + w * (0.07 + (0.86 * i) / 5), y, 1.1, 0, z0 - 1.9)
}
board(-17.0, 13.0, -124.0, -1)
board(-21.0, 12.0, 124.0, 1)

// The block M, traced from Ken Lund's photo of the south board: its width
// to height 1 : 0.76 (the photo's 1 : 0.6, corrected for looking up by the
// board's own foreshortening), about half the board's width.
{
  const M: P2[] = [[0, 0], [0.38, 0], [0.38, 0.16], [0.31, 0.16], [0.31, 0.33], [0.5, 0.04], [0.69, 0.33], [0.69, 0.16], [0.62, 0.16], [0.62, 0], [1, 0], [1, 0.16], [0.94, 0.16], [0.94, 0.6], [0.7, 0.6], [0.5, 0.24], [0.3, 0.6], [0.06, 0.6], [0.06, 0.16], [0, 0.16]]
  const W = 14.6, H = 0.76, cx = -2.0, zc = BOARD_TOP - BOARD_H / 2, y = -124.0 - BOARD_D / 2 - 0.06
  // seen from the south, west is on the left, so u runs east (the M is symmetric anyway)
  const ring = ccw(M)
  const P = ring.map(([u, v]): V3 => [cx - W / 2 + u * W, y, zc - (H * W) / 2 + (v / 0.6) * H * W])
  for (const [a, b, c] of earcut(ring)) tri(maize, P[a], P[b], P[c], [0, -1, 0])
}

// ---------------------------------------------------------------------------
// Palette, from the daylight photos, pulled to the palette's lightness: the
// bleachers a slate blue; the concrete walkways, the columns and the roofs
// `stone`; the 2010 brick a warm red; the suites, fascia and boards Michigan
// navy (a dark identity colour, kept at charcoal's lightness); the glazing
// `window`; the M maize, lit at night.
const parts = [
  { part: seats, material: finish('big-house-seat-blue', 0x8193b2) },
  { part: stone, material: PALETTE.stone },
  { part: brick, material: finish('big-house-brick', 0xb8735b) },
  { part: navy, material: finish('big-house-navy', 0x46536f) },
  { part: win, material: PALETTE.window },
  { part: maize, material: finish('neon-big-house-maize', 0xeac13a) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(24), part.triangles)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Michigan Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 0, osm: 'relation/1637002',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outPath = new URL('../models/a2-michigan-stadium.glb', import.meta.url).pathname
await Bun.write(outPath, glb)
console.log(`${outPath}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
