/**
 * Fenway Park, Boston (1912, James E. McLaughlin) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-fenway-park.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor, y = 0 at
 * the field. Bearing 0: the plan is drawn north-up. Anchor = the centroid
 * of OSM relation/11188464 (leisure=stadium), -71.0972720, 42.3464607.
 * Home plate is to the south-west, the Green Monster runs along Lansdowne
 * Street on the north, the bleachers are to the east and north-east.
 *
 * Identity (from the photos below):
 *  1. The Green Monster: the 11.3 m (37 ft, published) left-field wall,
 *     dead straight along Lansdowne Street, painted Fenway green, with the
 *     big dark manual scoreboard low on its face, the Monster seats on top
 *     and light standards above them.
 *  2. The irregular grandstand that follows the streets round the field
 *     from left field past home to right field, its red seats under a long
 *     flat dark roof on green steel, with the glazed roof boxes and press
 *     level on the roof behind home plate.
 *  3. The steep uncovered right-field bleachers, with the video board over
 *     them.
 *  4. The tall green lattice light towers with their white lamp banks.
 *  5. Red-brick street fronts (Jersey Street, Van Ness Street, Lansdowne
 *     Street) with green steel above.
 *
 * How it is built: the stands are a ring between the field's edge (the
 * front row, traced from the lidar) and the OSM outline. Rays from the
 * field's centre (0, 5) pair each point on the front row with the outline;
 * along each ray a section is drawn from a profile set per stretch of the
 * front row (front wall, seating rake, the grandstand's back wall, its
 * roof, the roof boxes, and the lower buildings out to the street), and
 * the profiles are blended along the front row.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid, read
 * with tools/lidar_frame.py; y = 0 is the field (1.7 above the grid's
 * ground_min). Measured: the grandstand roof 25 (3B side, home, 1B side to
 * x 30); the roof boxes behind home 29.5; the uncovered stands in the
 * corners 17–18; the bleachers rising to 12.5; the Monster seats about 14,
 * their back structure 16, Monster light standards about 19; the buildings
 * behind: Jersey Street 13, the south-west corner 15.5, Van Ness Street
 * 9–10, east of the bleachers 21.3; the six light towers about 40 at
 * (-68, 50), (-84, -6), (-28, -70), (44, -54), (100, -6), (84, 66); the
 * video board to about 29. Published: the Monster 37 ft (11.3 m), also
 * OSM's height on way/813683146.
 *
 * Estimated from the photos: the scoreboard's size and place on the wall
 * (about 22 × 5 m), where the roof starts over the stands, the lamp banks
 * (7 × 4 m), the video board's width (25 m), the street-front windows.
 *
 * Elevation: 0. The field is 1–3 m below the streets round it (lidar:
 * Lansdowne and Jersey Streets about 3 m up on the west, Van Ness Street
 * 0.7–1 m), which is within the slope the map handles; the lowest ground
 * under the footprint (Van Ness Street) is within 1 m of the field.
 *
 * Colours (lead review): Fenway green for the Monster, its seats, the
 * bleachers and the steel; a dark green-grey for the grandstand roof and
 * the low roofs round the ring; brick street walls with a green band at
 * the top (Jersey Street photo); red seats only in the grandstand. The
 * stands next to the Monster are kept below it (8.5) so the wall reads as
 * the tallest flat face on that side.
 *
 * Not modelled: the field, its grass and dirt, the bullpens (all the
 * map's ground), the advertising signs, the CITGO sign (not part of the
 * park), the lettering on Jersey Street.
 *
 * Night: the lamp banks are `neon` (lit white), the roof boxes' glass, the
 * video board and the street windows glow.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Fenway Park seen from Prudential Skywalk.jpg, Melikamp, CC BY-SA 3.0
 *    (from the east, above) https://commons.wikimedia.org/wiki/File:Fenway_Park_seen_from_Prudential_Skywalk.jpg
 *  - Fenway Park from Prudential Tower, November 2012.jpg, clry2, CC BY-SA
 *    2.0 https://commons.wikimedia.org/wiki/File:Fenway_Park_from_Prudential_Tower,_November_2012.jpg
 *  - Green Monster.jpg, Aidan Siegel, CC BY-SA 3.0 (the wall, scoreboard
 *    and Monster seats) https://commons.wikimedia.org/wiki/File:Green_Monster.jpg
 *  - Fenway Park 20-April-2021.jpg, Dmoore5556, CC BY-SA 4.0 (the
 *    grandstand from right field, at night)
 *    https://commons.wikimedia.org/wiki/File:Fenway_Park_20-April-2021.jpg
 *  - Fenway Park - Lansdowne Street (54954428668).jpg, ajay_suresh, CC BY
 *    4.0 https://commons.wikimedia.org/wiki/File:Fenway_Park_-_Lansdowne_Street_(54954428668).jpg
 *  - Fenway park 20060619.jpg, Jared C. Benedict, CC BY-SA 3.0 (aerial)
 *    https://commons.wikimedia.org/wiki/File:Fenway_park_20060619.jpg
 *  - Fenway red sox stadium.JPG, WonderWhy, CC BY-SA 3.0 (aerial, east)
 *    https://commons.wikimedia.org/wiki/File:Fenway_red_sox_stadium.JPG
 *  - Fenway Park01.jpg, Bernard Gagnon, CC BY-SA 3.0 (Jersey St front)
 *    https://commons.wikimedia.org/wiki/File:Fenway_Park01.jpg
 *  - USGS NAIP orthophoto (public domain), for the plan.
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the profile of the stands under the roof is simplified to one
 * rake; the roof's columns are drawn every ~20 m; the street buildings in
 * the outline (offices, the Jersey Street concourse, the right-field
 * buildings) are plain blocks at their lidar heights.
 */
import { Part, type V3, cross, sub } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save, type XY } from './atl-tech-tower'

const seats = new Part(), green = new Part(), brick = new Part(), roof = new Part(), win = new Part(), lamp = new Part()

/** A planar convex face, wound to face `want`. */
function face(p: Part, pts: V3[], want: V3) {
  const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const q = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < q.length - 1; i++) p.tri(q[0], q[i], q[i + 1])
}
const both = (p: Part, pts: V3[]) => { face(p, pts, [0, 0, 1]); face(p, [...pts].reverse(), [0, 0, -1]) }

// The OSM outline (relation/11188464), north-up about the anchor.
const OUT: XY[] = [[-45.6, 73.0], [-47.5, 72.9], [-64.1, 72.9], [-64.1, 70.6], [-85.3, 70.4], [-102.7, 70.2], [-124.5, 43.3], [-126.4, 37.9], [-106.7, -15.2], [-81.7, -81.4], [-80.3, -84.9], [-77.4, -92.9], [-76.5, -95.4], [-74.5, -100.5], [-72.7, -105.3], [-11.8, -83.2], [101.6, -42.6], [122.2, -34.6], [133.8, -30.4], [137.7, -25.5], [139.0, -23.9], [146.5, -14.2], [134.8, 14.3], [132.1, 21.0], [117.3, 16.1], [96.9, 70.5], [66.5, 70.5], [66.5, 73.3], [64.8, 73.3], [38.9, 73.1], [33.3, 73.0], [33.3, 74.2], [33.3, 77.1], [-42.3, 76.8], [-45.5, 76.8], [-45.6, 75.2], [-45.6, 74.1]]
const C: XY = [0, 5]

/** First crossing of the ray from C through p with the outline, beyond p. */
function toOutline(p: XY): XY {
  const d: XY = [p[0] - C[0], p[1] - C[1]]
  let best = Infinity
  for (let i = 0; i < OUT.length; i++) {
    const a = OUT[i], b = OUT[(i + 1) % OUT.length], e: XY = [b[0] - a[0], b[1] - a[1]]
    const den = d[0] * e[1] - d[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const t = ((a[0] - C[0]) * e[1] - (a[1] - C[1]) * e[0]) / den, u = ((a[0] - C[0]) * d[1] - (a[1] - C[1]) * d[0]) / den
    if (u >= 0 && u <= 1 && t > 1.02 && t < best) best = t
  }
  return [C[0] + d[0] * best, C[1] + d[1] * best]
}

// ── Profiles along the front row ──
type Prof = { front: number; rake: number; rf: number; stand: number; roof: number; rf0: number; back: number; box: number }
const MON: Prof = { front: 11.3, rake: 13.0, rf: 0.55, stand: 13.0, roof: 0, rf0: 0, back: 18.5, box: 0 }
const LFC: Prof = { front: 1.2, rake: 8.5, rf: 0.6, stand: 8.5, roof: 0, rf0: 0, back: 10, box: 0 }
const GS: Prof = { front: 1.2, rake: 12, rf: 0.42, stand: 25, roof: 25, rf0: 0.1, back: 13, box: 0 }
const HOME: Prof = { front: 1.2, rake: 12, rf: 0.5, stand: 25, roof: 25, rf0: 0.12, back: 15.5, box: 29.5 }
const B1: Prof = { front: 1.2, rake: 12, rf: 0.55, stand: 25, roof: 25, rf0: 0.1, back: 10, box: 0 }
const RF1: Prof = { front: 1.2, rake: 17, rf: 0.6, stand: 17, roof: 0, rf0: 0, back: 9, box: 0 }
const BLE: Prof = { front: 1.5, rake: 12.5, rf: 0.5, stand: 12.5, roof: 0, rf0: 0, back: 21.3, box: 0 }

// The front row, counter-clockwise from the Monster's west end (lidar).
const FRONT: [XY, Prof][] = [
  [[-44, 70], MON], [[-45.5, 69], LFC], [[-48, 58], LFC], [[-55, 44], LFC], [[-57, 42], GS], [[-64, 34], GS],
  [[-70, 24], GS], [[-73, 8], GS], [[-74, -10], GS], [[-74, -26], HOME], [[-70, -40], HOME], [[-62, -48], HOME],
  [[-50, -55], HOME], [[-36, -58], HOME], [[-14, -58], B1], [[16, -55], B1], [[28, -52], B1], [[31, -51], RF1],
  [[40, -48], RF1], [[62, -40], RF1], [[84, -28], RF1], [[94, -14], RF1], [[96, 0], RF1], [[84, 5], BLE],
  [[72, 10], BLE], [[52, 40], BLE], [[35, 68], BLE], [[32, 70], MON],
]
const lerp2 = (a: XY, b: XY, t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const mixP = (a: Prof, b: Prof, t: number): Prof => {
  const o = {} as Prof
  for (const k of Object.keys(a) as (keyof Prof)[]) o[k] = a[k] + (b[k] - a[k]) * t
  // Roof and roof boxes are on or off: kept only where both ends have them.
  o.roof = a.roof && b.roof ? a.roof : 0
  o.box = a.box && b.box ? a.box : 0
  return o
}
type Sec = { p: XY; q: XY; f: Prof }
const secs: Sec[] = []
for (let i = 0; i < FRONT.length; i++) {
  const [a, pa] = FRONT[i], [b, pb] = FRONT[(i + 1) % FRONT.length]
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4.5))
  for (let k = 0; k < n; k++) {
    const t = k / n, p = lerp2(a, b, t)
    // the blended profile; roof flags from the stretch's own ends
    const f = mixP(pa, pb, t)
    secs.push({ p, q: toOutline(p), f })
  }
}

const P3 = (xy: XY, z: number): V3 => [xy[0], xy[1], z]
const IN = (a: XY): V3 => { const d = [C[0] - a[0], C[1] - a[1]], l = Math.hypot(d[0], d[1]); return [d[0] / l, d[1] / l, 0] }
const OUTN = (a: XY): V3 => { const v = IN(a); return [-v[0], -v[1], 0] }
const UP: V3 = [0, 0, 1], DOWN: V3 = [0, 0, -1]

for (let i = 0; i < secs.length; i++) {
  const A = secs[i], B = secs[(i + 1) % secs.length]
  const fa = A.f, fb = B.f
  const m: XY = lerp2(A.p, B.p, 0.5)
  const ra = lerp2(A.p, A.q, fa.rf), rb = lerp2(B.p, B.q, fb.rf)
  // front wall
  face(fa.front > 5 ? green : green, [P3(A.p, 0), P3(B.p, 0), P3(B.p, fb.front), P3(A.p, fa.front)], IN(m))
  // the seating rake
  // red seats in the grandstand; the bleachers' and the Monster seats are green (photos)
  face((fa.rake === BLE.rake && fb.rake === BLE.rake) || (fa.front > 5 && fb.front > 5) ? green : seats, [P3(A.p, fa.front), P3(B.p, fb.front), P3(rb, fb.rake), P3(ra, fa.rake)], UP)
  // the grandstand's back wall under the roof, facing the field
  if (fa.stand > fa.rake + 0.1 || fb.stand > fb.rake + 0.1)
    face(green, [P3(ra, fa.rake), P3(rb, fb.rake), P3(rb, fb.stand), P3(ra, fa.stand)], IN(m))
  // the buildings out to the street: their top, the outer wall, and the
  // back of the grandstand standing above them
  const top = (f: Prof) => (f.back > f.stand ? f.back : f.back)
  face(roof, [P3(ra, top(fa)), P3(rb, top(fb)), P3(B.q, top(fb)), P3(A.q, top(fa))], UP)
  if (fa.stand > fa.back + 0.1 || fb.stand > fb.back + 0.1)
    face(green, [P3(ra, fa.back), P3(rb, fb.back), P3(rb, fb.stand), P3(ra, fa.stand)], OUTN(m))
  if (fa.back > fa.stand + 0.1 || fb.back > fb.stand + 0.1)
    face(green, [P3(ra, fa.stand), P3(rb, fb.stand), P3(rb, fb.back), P3(ra, fa.back)], IN(m))
  const qm = lerp2(A.q, B.q, 0.5), L = Math.hypot(B.q[0] - A.q[0], B.q[1] - A.q[1])
  // brick street walls with a green steel band along the top
  const bA = Math.min(fa.back, 12) - 0.9, bB = Math.min(fb.back, 12) - 0.9
  face(brick, [P3(A.q, 0), P3(B.q, 0), P3(B.q, bB), P3(A.q, bA)], OUTN(qm))
  face(green, [P3(A.q, bA), P3(B.q, bB), P3(B.q, fb.back), P3(A.q, fa.back)], OUTN(qm))
  // street windows in the brick, one a section
  if (L > 3 && Math.min(fa.back, fb.back) > 8) {
    const t0 = 0.6 / L, n = OUTN(qm), o = 0.06
    const w = (t: number, z: number): V3 => { const xy = lerp2(A.q, B.q, t); return [xy[0] + n[0] * o, xy[1] + n[1] * o, z] }
    face(win, [w(t0, 3.5), w(1 - t0, 3.5), w(1 - t0, 6.8), w(t0, 6.8)], n)
  }
  // the roof over the back of the grandstand
  if (fa.roof && fb.roof) {
    const sa = lerp2(A.p, A.q, fa.rf0), sb = lerp2(B.p, B.q, fb.rf0), ea = lerp2(A.p, A.q, fa.rf + 0.02), eb = lerp2(B.p, B.q, fb.rf + 0.02)
    const z1 = fa.roof, z0 = z1 - 3.4
    face(roof, [P3(sa, z1), P3(sb, z1), P3(eb, z1), P3(ea, z1)], UP)
    face(green, [P3(sa, z0), P3(sb, z0), P3(eb, z0), P3(ea, z0)], DOWN)
    // the roof's deep front: green fascia over the glazed band of the roof-level boxes
    face(green, [P3(sa, z0), P3(sb, z0), P3(sb, z1), P3(sa, z1)], IN(m))
    const g = (xy: XY, z: number): V3 => { const n = IN(m); return [xy[0] + n[0] * 0.06, xy[1] + n[1] * 0.06, z] }
    face(win, [g(sa, z0 + 0.5), g(sb, z0 + 0.5), g(sb, z1 - 0.7), g(sa, z1 - 0.7)], IN(m))
    // roof ends
    const prevRoof = secs[(i - 1 + secs.length) % secs.length].f.roof, nextRoof = B.f.roof && secs[(i + 2) % secs.length].f.roof
    if (!prevRoof) both(green, [P3(sa, z0), P3(ea, z0), P3(ea, z1), P3(sa, z1)])
    if (!nextRoof) both(green, [P3(sb, z0), P3(eb, z0), P3(eb, z1), P3(sb, z1)])
    // a column under the roof's front every few sections
    if (i % 5 === 0) {
      const c = lerp2(sa, ea, 0.15)
      box(green, c[0] - 0.4, c[0] + 0.4, c[1] - 0.4, c[1] + 0.4, 0, z0, null, 0.1)
    }
    // the roof boxes and press level behind home
    if (fa.box && fb.box) {
      const ba = lerp2(A.p, A.q, fa.rf0 + 0.1), bb = lerp2(B.p, B.q, fb.rf0 + 0.1), ka = lerp2(A.p, A.q, fa.rf - 0.04), kb = lerp2(B.p, B.q, fb.rf - 0.04)
      const zt = fa.box
      face(win, [P3(ba, z1), P3(bb, z1), P3(bb, zt - 0.6), P3(ba, zt - 0.6)], IN(m))
      face(green, [P3(ba, zt - 0.6), P3(bb, zt - 0.6), P3(bb, zt), P3(ba, zt)], IN(m))
      face(roof, [P3(ba, zt), P3(bb, zt), P3(kb, zt), P3(ka, zt)], UP)
      face(green, [P3(ka, z1), P3(kb, z1), P3(kb, zt), P3(ka, zt)], OUTN(m))
      const pb2 = secs[(i - 1 + secs.length) % secs.length].f.box, nb2 = secs[(i + 2) % secs.length].f.box
      if (!pb2) both(green, [P3(ba, z1), P3(ka, z1), P3(ka, zt), P3(ba, zt)])
      if (!nb2) both(green, [P3(bb, z1), P3(kb, z1), P3(kb, zt), P3(bb, zt)])
    }
  }
}

// ── The Monster: a coping along its top, so the wall reads as one flat slab ──
box(green, -44, 32, 69.6, 70.8, 10.9, 11.6, green, 0.15)
// ── The Monster's scoreboard, low on the wall's face ──
face(roof, [[-20, 69.93, 0.8], [2, 69.93, 0.8], [2, 69.93, 5.8], [-20, 69.93, 5.8]], [0, -1, 0])
for (const [x0, x1] of [[-18.5, -12], [-10.5, -3], [-1.5, 0.8]]) face(lamp, [[x0, 69.9, 4.4], [x1, 69.9, 4.4], [x1, 69.9, 5.2], [x0, 69.9, 5.2]], [0, -1, 0])

// ── Light towers and lamp banks ──
/** A box of half-sizes (w, d) about c, its local x turned to `dir`, from z0 to z1. */
function obox(p: Part, c: XY, dir: XY, w: number, d: number, z0: number, z1: number, frontP?: Part) {
  const l = Math.hypot(dir[0], dir[1]), u: XY = [dir[0] / l, dir[1] / l], v: XY = [-u[1], u[0]]
  const pt = (a: number, b: number, z: number): V3 => [c[0] + v[0] * a + u[0] * b, c[1] + v[1] * a + u[1] * b, z]
  const ring = [pt(-w, -d, 0), pt(w, -d, 0), pt(w, d, 0), pt(-w, d, 0)]
  const at = (z: number) => ring.map(([x, y]): V3 => [x, y, z])
  const b0 = at(z0), b1 = at(z1)
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4, mid: XY = [(b0[k][0] + b0[j][0]) / 2 - c[0], (b0[k][1] + b0[j][1]) / 2 - c[1]]
    const isFront = k === 2 // the +d side faces `dir`
    face(isFront && frontP ? frontP : p, [b0[k], b0[j], b1[j], b1[k]], [mid[0], mid[1], 0])
  }
  face(p, b1, UP); face(p, b0, DOWN)
}
const TOWERS: [XY, number][] = [[[-68, 50], 40], [[-84, -6], 40], [[-28, -70], 40], [[44, -54], 41], [[100, -6], 40.5], [[84, 66], 37]]
for (const [c, h] of TOWERS) {
  const dir: XY = [C[0] - c[0], C[1] - c[1]]
  obox(green, c, dir, 0.8, 0.8, 0, h - 4.5)
  obox(green, c, dir, 4.6, 0.7, h - 5.2, h, lamp)
}
// the Monster's light standards
for (const x of [-30, -4, 20]) {
  obox(green, [x, 74.5], [0, -1], 0.3, 0.3, 14, 18)
  obox(green, [x, 74.5], [0, -1], 2.2, 0.35, 17.6, 19.6, lamp)
}
// the video board over the bleachers
obox(green, [97, 52], [C[0] - 97, C[1] - 52], 12.5, 0.8, 16, 29, win)

await save('bos-fenway-park', 'Fenway Park', [
  { part: seats, material: finish('fenway-seat-red', 0xa8524a) },
  { part: green, material: finish('fenway-green', 0x41705a) },
  { part: brick, material: finish('fenway-brick', 0xa8614c) },
  { part: roof, material: finish('fenway-roof', 0x4f5c56) },
  { part: win, material: PALETTE.window },
  { part: lamp, material: finish('neon-fenway-lamps', 0xf0efe8) },
], { height: 41, anchor: [42.3464607, -71.097272], bearing: 0 }, 6500)
