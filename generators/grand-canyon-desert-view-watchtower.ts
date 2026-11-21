/**
 * Desert View Watchtower, Desert View, Grand Canyon National Park, Arizona:
 * original procedural geometry, CC0-1.0.
 * bun generators/grand-canyon-desert-view-watchtower.ts
 *
 * Mary Colter's 1932 lookout for the Fred Harvey Company: a round,
 * slightly tapering tower of laid sandstone about 70 ft (21 m) high on the
 * rim's edge, standing out of a skirt of rough Kaibab limestone boulders,
 * with a pale stone course a little above half its height, small dark
 * windows scattered over the shaft and a ring of larger ones under the
 * irregular parapet. At its foot, the low round Kiva Room (the gift shop
 * and entrance), whose flat roof is an observation terrace, joined to the
 * tower by a low wing and a stepped rubble buttress on the canyon side.
 *
 * Map frame: x east, y north, z up, metres. Anchor: the tower's centre as
 * the 2019 lidar shows it, -111.826258, 36.044020. The OSM outlines
 * (way/171444052 tower, way/207657874 Kiva Room and wing) are drawn about
 * 4.5 m east and 1.1 m south of where the lidar and the NAIP shadows put
 * them; their shapes agree with the lidar, so they are used shifted onto
 * it. Bearing 0 (round building).
 *
 * Identity, in order: the tapered round tower; its rubble skirt; the pale
 * band; the scatter of small windows and the top ring of larger ones; the
 * irregular parapet; the round kiva at its foot.
 *
 * Evidence:
 *  - plan: OSM way/171444052 (tower circle r 3.9 m, as drawn at the roof)
 *    and way/207657874 (kiva circle r 7.6 m centred 10.5 m east, 12.4 m
 *    north of the tower, and the wing), shifted as above; checked against
 *    lidar (kiva centre 10.4 E, 12.1 N, r about 7.5).
 *  - lidar: USGS 3DEP AZ_GrandCanyonNP_1_2019, 0.5 m grid. Tower roof
 *    2291.2 m, parapet 2292.2 m; the ground at the tower's east foot about
 *    2271 m, so 21 m, as published (70 ft, NPS). Top about 8 m across
 *    (r 4.0). Kiva and wing roofs about 2275.7-2276.6 m (5 m over the
 *    plaza on the east, about 10 m over the slope on the north-west).
 *    Buttress north of the tower to about 2280.5 m.
 *  - the base radius (4.8 m) from the photos' taper: the shaft's top is
 *    about 0.78 of its width over the skirt (Quinn, Graham).
 *  - band height (about 10 m under the top), window sizes and positions
 *    estimated from the photos against the 21 m height; the window scatter
 *    is drawn in their spirit, not stone for stone.
 *  - colours from daylight photos: warm tan-brown laid sandstone (#97826c
 *    averaged in shade-free areas) pulled to the palette's lightness; the
 *    greyer limestone boulders of the skirt, buttress and kiva; a pale
 *    band; pale terrace paving on the kiva roof.
 *  - map terrain (Mapterhorn) read with tools/terrain.ts: the rim falls
 *    to the north-west, about 5 m across the tower and the kiva.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Desert View Watchtower, located on the South Rim ... LCCN2011633952
 *    (Carol M. Highsmith, public domain): from the south-west, rim side.
 *  - Grand-canyon-watchtower-D4325.JPG (NPS photo by Michael Quinn, public
 *    domain): from the rim side, the skirt, band and windows.
 *  - Desert View Watchtower, Grand Canyon 9-15 (21272245233).jpg (Don
 *    Graham, CC BY-SA 2.0): from the approach path, south-east, with the
 *    wing and kiva parapets.
 *  - Desert View Watchtower Grand Canyon 09 2017 5521.jpg (Mariordo,
 *    CC BY-SA 4.0): from the south-west.
 *  - Desert View Watchtower 2 (15549485392).jpg (Tony Hisgett, CC BY 2.0):
 *    close-up of the stonework.
 *  - Grand Canyon National Park- Desert View Point and Watchtower.jpg
 *    (Grand Canyon NPS, CC BY 2.0): 360 panorama from the kiva terrace.
 *  - 08477 Grand Canyon Historic- Model of Desert View Watchtower c.1932
 *    (Grand Canyon National Park, CC BY 2.0): Colter's massing model.
 *  - USGS NAIP orthophoto (public domain) for the plan and shadows.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the rooftop railing and antennas, the stair to the terrace,
 * the petroglyph stones set in the wall, the interior.
 *
 * Doubts: the kiva's canyon-side windows and the wing's doors are not in
 * any photo used; the kiva and wing are drawn plain with one door on the
 * plaza side. The buttress shape is from the lidar heights and the
 * Highsmith photo. The window scatter is representative.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { cap, inset, save, walls, type XY } from './chi-aon-center'

/** Map-terrain heights (m above 2241.48) are drawn this far above y = 0. */
const AREF = 27.0
const A = (h: number) => h - AREF

// A small seeded random, so the scatter is the same on every build.
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

const deg = (d: number) => (d * Math.PI) / 180
/** Compass bearing (clockwise from north) to a unit vector in x east, y north. */
const dir = (b: number): XY => [Math.sin(deg(b)), Math.cos(deg(b))]

const ROOF = A(49.1)
const R0 = 4.8, R1 = 3.95 // shaft radius at y = 0 and at the roof
const rAt = (z: number) => R0 + (R1 - R0) * (z / ROOF)
const SEG = 24

function build() {
  const sand = new Part(), rubble = new Part(), band = new Part(), deck = new Part(), win = new Part(), wood = new Part()

  // ------------------------------------------------------------ tower shaft
  const ring = (z: number, dr = 0): V3[] =>
    Array.from({ length: SEG }, (_, i) => { const [x, y] = dir(-(i / SEG) * 360); return [x * (rAt(z) + dr), y * (rAt(z) + dr), z] as V3 })
  // CCW from above: bearings decreasing = counter-clockwise.
  const levels = [0, 4, 8, 12, A(40.1), A(40.55), 17, 20, ROOF]
  for (let k = 0; k < levels.length - 1; k++) {
    const a = ring(levels[k]), b = ring(levels[k + 1])
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG
      sand.quad(a[i], a[j], b[j], b[i])
    }
  }
  // The pale course, a little proud of the wall.
  {
    const a = ring(A(40.1), 0.06), b = ring(A(40.55), 0.06)
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG
      band.quad(a[i], a[j], b[j], b[i])
    }
    const lo = ring(A(40.1)), hi = ring(A(40.55))
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG
      band.quad(lo[j], lo[i], a[i], a[j])
      band.quad(b[i], b[j], hi[j], hi[i])
    }
  }

  // ------------------------------------------------------- irregular parapet
  // Each of the 24 sectors gets its own top: mostly 1.1-1.5 m, a lower run
  // where the roof's railing is, a few stones standing higher.
  const PT = 0.5
  const tops = Array.from({ length: SEG }, (_, i) => {
    if (i >= 3 && i <= 5) return 0.6 // the low railed stretch (Quinn, Graham)
    return 1.15 + 0.35 * rnd() + (rnd() < 0.2 ? 0.3 : 0)
  })
  const rr = R1, ri = R1 - PT
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG
    const [ax, ay] = dir(-(i / SEG) * 360), [bx, by] = dir(-(j / SEG) * 360)
    const zt = ROOF + tops[i]
    const o0: V3 = [ax * rr, ay * rr, ROOF], o1: V3 = [bx * rr, by * rr, ROOF]
    const i0: V3 = [ax * ri, ay * ri, ROOF], i1: V3 = [bx * ri, by * ri, ROOF]
    const up = (p: V3): V3 => [p[0], p[1], zt]
    sand.quad(o0, o1, up(o1), up(o0))
    sand.quad(i1, i0, up(i0), up(i1))
    sand.quad(up(o0), up(o1), up(i1), up(i0))
    // Side faces where the next sector's top differs.
    const zn = ROOF + tops[j]
    if (Math.abs(zn - zt) > 1e-3) {
      const hiZ = Math.max(zt, zn), loZ = Math.min(zt, zn)
      const P = (r: number, z: number): V3 => [bx * r, by * r, z]
      if (zt > zn) sand.quad(P(rr, loZ), P(ri, loZ), P(ri, hiZ), P(rr, hiZ))
      else sand.quad(P(ri, loZ), P(rr, loZ), P(rr, hiZ), P(ri, hiZ))
    }
  }
  // Roof deck, and the stair hatch house on it.
  {
    const r = Array.from({ length: SEG }, (_, i) => dir(-(i / SEG) * 360).map((v) => v * ri) as XY)
    cap(deck, r, ROOF + 0.02)
    const hx = -1.0, hy = -0.6, hw = 0.9
    const box: XY[] = [[hx - hw, hy - hw], [hx + hw, hy - hw], [hx + hw, hy + hw], [hx - hw, hy + hw]]
    walls(sand, box, ROOF, ROOF + 1.3)
    cap(sand, box, ROOF + 1.3)
  }

  // ---------------------------------------------------- rubble skirt at the foot
  // Boulders flaring out to about 5.6 m, highest on the canyon (north-west)
  // side where the tower stands on the rim's outcrop.
  {
    const n = 16
    const pts = Array.from({ length: n }, (_, i) => {
      const b = -(i / n) * 360
      const canyon = Math.max(0, Math.cos(deg(b - 300)))
      const h = 3.2 + 3.0 * canyon + 1.4 * rnd()
      const rb = R0 + 0.7 + 0.4 * rnd()
      return { b, h, rb }
    })
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const P = (k: number, r: number, z: number): V3 => { const [x, y] = dir(pts[k].b); return [x * r, y * r, z] }
      const a0 = P(i, pts[i].rb, 0), b0 = P(j, pts[j].rb, 0)
      const am = P(i, rAt(pts[i].h * 0.7) + 0.55, pts[i].h * 0.7), bm = P(j, rAt(pts[j].h * 0.7) + 0.55, pts[j].h * 0.7)
      const a1 = P(i, rAt(pts[i].h) + 0.05, pts[i].h), b1 = P(j, rAt(pts[j].h) + 0.05, pts[j].h)
      rubble.quad(a0, b0, bm, am)
      rubble.quad(am, bm, b1, a1)
    }
  }

  // --------------------------------------------------------------- windows
  // A dark panel on the cone, following its curve: centre bearing b,
  // width w and height h in metres, centre at z.
  const windowAt = (b: number, z: number, w: number, h: number) => {
    const n = w > 0.8 ? 2 : 1
    const col = (t: number, zz: number): V3 => {
      const r = rAt(zz) + 0.05
      const [x, y] = dir(b + (t * w) / r * (180 / Math.PI))
      return [x * r, y * r, zz]
    }
    for (let k = 0; k < n; k++) {
      const t0 = -0.5 + k / n, t1 = -0.5 + (k + 1) / n
      // Bearings increase clockwise; the quad must be counter-clockwise seen from outside.
      win.quad(col(t1, z - h / 2), col(t0, z - h / 2), col(t0, z + h / 2), col(t1, z + h / 2))
    }
  }
  // The ring of larger windows under the parapet.
  for (const b of [8, 58, 105, 152, 200, 250, 300, 345]) windowAt(b + 6 * (rnd() - 0.5), ROOF - 1.25, 0.95 + 0.35 * rnd(), 1.45)
  // Wider low windows under the band, and a few beside it.
  for (const [b, w] of [[20, 1.1], [140, 0.9], [235, 1.2], [320, 0.9]]) windowAt(b, A(39.2), w, 0.65)
  // The scatter of small square windows up the shaft.
  for (let k = 0; k < 26; k++) {
    const b = rnd() * 360
    const z = A(33.5) + rnd() * (A(46.5) - A(33.5))
    if (z > A(39.6) && z < A(41.0)) continue
    const s = 0.45 + 0.25 * rnd()
    windowAt(b, z, s, s)
  }
  // Larger windows low on the shaft, over the skirt.
  for (const b of [75, 190, 290]) windowAt(b, A(35.2), 0.85, 0.8)

  // --------------------------------------------- kiva, wing and buttress
  // OSM way/207657874 shifted onto the lidar tower; reversed to run
  // counter-clockwise.
  const WING: XY[] = ([
    [11.0, 5.0], [9.2, 2.1], [11.6, 0.6], [8.6, -4.0], [3.9, -1.1], [4.1, 0.2], [3.7, 1.8], [2.9, 2.9], [1.8, 3.7],
    [-0.1, 4.1], [-1.4, 3.8], [-2.2, 6.2], [-1.5, 8.6], [0.3, 10.4], [3.2, 11.0], [3.2, 14.4], [4.7, 17.4], [7.3, 19.5],
    [10.6, 20.3], [13.9, 19.5], [16.5, 17.5], [18.0, 14.5], [18.1, 11.2], [16.7, 8.1], [14.1, 5.9],
  ] as XY[]).reverse()
  const WROOF = A(33.1), WPAR = A(33.8)
  // Walls in short pieces, so the map's drape can bend them over the slope.
  for (let i = 0; i < WING.length; i++) {
    const a = WING[i], b = WING[(i + 1) % WING.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.ceil(L / 4))
    for (let k = 0; k < n; k++) {
      const p = (t: number): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      const p0 = p(k / n), p1 = p((k + 1) / n)
      rubble.quad([p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], WPAR], [p0[0], p0[1], WPAR])
    }
  }
  // Coping and the sunk terrace.
  const WIN = inset(WING, 0.45)
  for (let i = 0; i < WING.length; i++) {
    const j = (i + 1) % WING.length
    rubble.quad([WING[i][0], WING[i][1], WPAR], [WING[j][0], WING[j][1], WPAR], [WIN[j][0], WIN[j][1], WPAR], [WIN[i][0], WIN[i][1], WPAR])
    rubble.quad([WIN[i][0], WIN[i][1], WPAR], [WIN[j][0], WIN[j][1], WPAR], [WIN[j][0], WIN[j][1], WROOF], [WIN[i][0], WIN[i][1], WROOF])
  }
  cap(deck, WIN, WROOF)

  // The kiva's own drum stands a little proud of the wing's line, with a
  // taller, ragged parapet.
  {
    const KX = 10.5, KY = 12.4, KR = 7.7, n = 20
    const t = Array.from({ length: n }, () => A(34.2) + 0.5 * rnd())
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const [ax, ay] = dir(-(i / n) * 360), [bx, by] = dir(-(j / n) * 360)
      // Only the part of the drum outside the wing's other walls: the arc
      // facing north-west through north to south-east.
      const mid = -((i + 0.5) / n) * 360
      const m = ((mid % 360) + 360) % 360
      // Where the drum is inside the wing, only its parapet shows.
      const z0 = m > 170 && m < 262 ? WROOF : 0
      const o0: V3 = [KX + ax * KR, KY + ay * KR, z0], o1: V3 = [KX + bx * KR, KY + by * KR, z0]
      const zt = t[i]
      const ri2 = KR - 0.5
      const i0: V3 = [KX + ax * ri2, KY + ay * ri2, zt], i1: V3 = [KX + bx * ri2, KY + by * ri2, zt]
      rubble.quad(o0, o1, [o1[0], o1[1], zt], [o0[0], o0[1], zt])
      rubble.quad([o0[0], o0[1], zt], [o1[0], o1[1], zt], i1, i0)
      rubble.quad(i1, i0, [i0[0], i0[1], WROOF], [i1[0], i1[1], WROOF])
      // Ends of the ragged steps.
      const zn = t[j]
      if (zn < zt) rubble.quad([KX + bx * KR, KY + by * KR, zn], [KX + bx * ri2, KY + by * ri2, zn], [KX + bx * ri2, KY + by * ri2, zt], [KX + bx * KR, KY + by * KR, zt])
      const zp = t[(i - 1 + n) % n]
      if (zp < zt) rubble.quad([KX + ax * ri2, KY + ay * ri2, zp], [KX + ax * KR, KY + ay * KR, zp], [KX + ax * KR, KY + ay * KR, zt], [KX + ax * ri2, KY + ay * ri2, zt])
    }
    // The roof hatch with its ladder poles, the kiva's sign.
    const hx = KX + 1.0, hy = KY + 0.5
    const hatch: XY[] = [[hx - 1.0, hy - 0.8], [hx + 1.0, hy - 0.8], [hx + 1.0, hy + 0.8], [hx - 1.0, hy + 0.8]]
    walls(rubble, hatch, WROOF, WROOF + 0.6)
    cap(wood, hatch, WROOF + 0.6)
    for (const dx of [-0.45, 0.45]) {
      const x = hx + dx, y0 = hy, z0 = WROOF + 0.6, z1 = WROOF + 3.6, lean = 0.6, s = 0.11
      const sq = (z: number, oy: number): V3[] => [[x - s, y0 + oy - s, z], [x + s, y0 + oy - s, z], [x + s, y0 + oy + s, z], [x - s, y0 + oy + s, z]]
      const lo = sq(z0, 0), hi = sq(z1, lean)
      for (let k = 0; k < 4; k++) wood.quad(lo[k], lo[(k + 1) % 4], hi[(k + 1) % 4], hi[k])
      wood.cap(hi, true)
    }
    // A few small windows on the drum's canyon side.
    for (const b of [-60, -25, 15, 50]) {
      const [nx, ny] = dir(b), r = KR + 0.05
      const right: XY = [-ny, nx] // seen from outside
      const c: XY = [KX + nx * r, KY + ny * r], z = A(31.2), w = 0.35, h = 0.3
      const P = (s: number, dz: number): V3 => [c[0] + right[0] * s, c[1] + right[1] * s, z + dz]
      win.quad(P(-w, -h), P(w, -h), P(w, h), P(-w, h))
    }
  }

  // The plaza door, on the wing's east face.
  {
    const a: XY = [8.6, -4.0], b: XY = [11.6, 0.6]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm: XY = [u[1], -u[0]]
    const P = (s: number, z: number): V3 => [a[0] + u[0] * s + nrm[0] * 0.05, a[1] + u[1] * s + nrm[1] * 0.05, z]
    const z0 = A(29.6), s0 = L / 2 - 0.8, s1 = L / 2 + 0.8
    wood.quad(P(s0, z0), P(s1, z0), P(s1, z0 + 2.3), P(s0, z0 + 2.3))
    win.quad(P(s0 - 1.6, z0 + 1.0), P(s0 - 0.5, z0 + 1.0), P(s0 - 0.5, z0 + 1.9), P(s0 - 1.6, z0 + 1.9))
  }

  // The stepped buttress on the tower's north side, over the canyon.
  {
    const lower: XY[] = [[-2.6, 3.9], [-0.5, 4.3], [1.8, 4.1], [3.6, 4.9], [3.6, 8.2], [1.6, 10.0], [-0.6, 9.6], [-2.4, 7.8]]
    const upper: XY[] = [[-1.6, 4.2], [0.6, 4.4], [2.6, 4.6], [2.5, 7.2], [0.4, 8.2], [-1.4, 6.9]]
    walls(rubble, lower, 0, A(35.6))
    cap(rubble, lower, A(35.6))
    walls(rubble, upper, A(35.6), A(37.4))
    cap(rubble, upper, A(37.4))
  }

  return [
    { part: sand, material: finish('dvw-sandstone', 0xc6ad92) },
    { part: rubble, material: finish('dvw-rubble', 0xb9ab98) },
    { part: band, material: { ...PALETTE.trim } },
    { part: deck, material: { ...PALETTE.stone } },
    { part: win, material: { ...PALETTE.window } },
    { part: wood, material: { ...PALETTE.metal } },
  ]
}

if (import.meta.main) await save('grand-canyon-desert-view-watchtower', 'Desert View Watchtower', [36.04402, -111.826258], 0, build(), 5000)
