/**
 * Melbourne Cricket Ground (MCG): original procedural geometry, CC0-1.0, no
 * textures.  bun generators/melbourne-mcg.ts
 *
 * Writes two levels of detail in the same frame:
 * - models/melbourne-mcg.glb, the low model (<= 6,500 triangles);
 * - models/melbourne-mcg.detail.glb, drawn from zoom 16 (<= 40,000): the
 *   tiers stepped, the light towers' heads as open frames full of lamps,
 *   the Great Southern Stand's teal roof trusses and the Northern Stand's
 *   masts and ties as box members.
 *
 * This file also exports a small kit (profile lofts round a bowl, bars,
 * cylinders, beads, writeLods) used by this builder's london-lords and
 * paris-court-philippe-chatrier; its own build runs only under
 * `import.meta.main`.
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Anchor = the area
 * centroid of the arena (OSM way/8037539, leisure=pitch, australian
 * football: 174.5 x 146.8 m, long axis 88 deg), lng 144.9834560, lat
 * -37.8199836. The arena is an ellipse, half-axes 87.2 (x) and 73.4 m (y),
 * fitted to that way within 0.5 m.
 *
 * Identity, in order: the huge round bowl of three-tier stands closed all
 * round; the six tall white light towers standing outside the stands, each
 * a tapered tube with a big trapezoidal head tilted at the arena; the Great
 * Southern (Shane Warne) Stand's ribbed roof with its row of teal steel
 * trusses along the back; the Northern Stand (Ponsford, MCC Members
 * Reserve, Olympic, 2006) with its higher roof held by masts and ties; the
 * two big black video screens at the two junctions of the stands; pale blue
 * seats; pale precast and grey concrete outside with glazed concourses.
 *
 * Evidence
 *  - OSM (measured in this frame): Shane Warne Stand way/32000530
 *    (old_name Great Southern Stand, height 45, 4 levels) round the south
 *    and east, from math angle 215 deg through 0 to 22 deg; Olympic Stand
 *    way/131709273 (h 50), MCC Members Reserve way/131709272 (h 50),
 *    Ponsford Stand way/131709274 (h 50) round the north and west. Each
 *    stand polygon runs from the arena edge to the outside wall; the outer
 *    radius was read every 5 deg (polar.py in the work folder) and smoothed
 *    over the gate notches (table RO). Six light towers, man_made=tower,
 *    tower:type=lighting, height 85: nodes 418537251, 418537978, 418538160,
 *    1564400218, 1564400222, 1564400229, drawn exactly there.
 *    leisure=stadium way/210337258 (Q330136) is the site outline round
 *    them, not a building.
 *  - Published (en.wikipedia "Melbourne Cricket Ground"): Great Southern
 *    Stand 1992, Northern Stand 2006 replacing the Ponsford, Olympic and
 *    Members stands; capacity 100,024; arena about 171 x 146 m.
 *  - Heights: stand roofs 45 m (south) and 50 m (north) from OSM; light
 *    towers 85 m from OSM (the heads' top). Tier splits (lower tier to 0.29
 *    of the height, boxes, middle tier, boxes, upper tier to 0.92) are
 *    ESTIMATED from p26, p32 and p24 (three tiers, two dark box bands).
 *    Roof depth (the roof ring covers the outer 58 % of the stand's plan
 *    depth, the whole upper tier) ESTIMATED; its colour, a pale green-grey
 *    for both the translucent north sheeting and the grey south metal, from the aerials p1 and p23. Light heads
 *    about 8 m wide at the foot, 15 m at the top, 10 m tall, tilted 18 deg:
 *    ESTIMATED from p15, p19 (head against the column), drawn 11 m and 20 m wide, 12.5 m tall, so they read at phone size, their lamp faces one window panel in a white frame (lit at night); column 5.6 m across at its foot, 3.6 m at the top (drawn bold). The teal
 *    trusses rise about 8 m above the south roof (p1, p14, p15, p28); the
 *    north masts about 15 m (p1, p23, p33). Screens about 34 x 15 m
 *    (estimated, p1, p32).
 *  - Photos (Wikimedia Commons, all EVIDENCE):
 *    - p1: Alexander Sheko, "AFL Grand Final 2010 on the Melbourne Cricket
 *      Ground.jpg", CC BY-SA 2.0: aerial from the east, the plan, both
 *      roofs, the trusses, masts, screens, towers.
 *      https://commons.wikimedia.org/wiki/File:AFL_Grand_Final_2010_on_the_Melbourne_Cricket_Ground.jpg
 *    - p23: Dietmar Rabich, "Melbourne (AU), View from Eureka Tower,
 *      Melbourne Cricket Ground -- 2019 -- 1450.jpg", CC BY-SA 4.0: from the
 *      south-west, high. https://commons.wikimedia.org/wiki/File:Melbourne_(AU),_View_from_Eureka_Tower,_Melbourne_Cricket_Ground_--_2019_--_1450.jpg
 *    - p18: SuperJew, "MCG from Eureka Skydeck.jpg", CC BY-SA 4.0, from the
 *      south-west. https://commons.wikimedia.org/wiki/File:MCG_from_Eureka_Skydeck.jpg
 *    - p25: Telluride749, "Melbourne Cricket Ground PD.jpg", CC BY-SA 4.0.
 *      https://commons.wikimedia.org/wiki/File:Melbourne_Cricket_Ground_PD.jpg
 *    - p12: Donaldytong, "MCG (Melbourne Cricket Ground).jpg", Public domain.
 *      https://commons.wikimedia.org/wiki/File:MCG_(Melbourne_Cricket_Ground).jpg
 *    - p13: AussieNickuss, "MCG August 2007.jpg", Public domain.
 *      https://commons.wikimedia.org/wiki/File:MCG_August_2007.jpg
 *    - p33: DXR, "Melbourne Cricket Ground, west remote view 20230219 1.jpg",
 *      CC BY-SA 4.0, from across the Yarra: masts over the roof line.
 *      https://commons.wikimedia.org/wiki/File:Melbourne_Cricket_Ground,_west_remote_view_20230219_1.jpg
 *    - p15: Rexness, "MCG Light towers (6077748020).jpg", CC BY-SA 2.0.
 *      https://commons.wikimedia.org/wiki/File:MCG_Light_towers_(6077748020).jpg
 *    - p19: Jimmy Harris, "MCG light tower.jpg", CC BY 2.0.
 *      https://commons.wikimedia.org/wiki/File:MCG_light_tower.jpg
 *    - p14: Simon Yeo, "MCG Light Tower, Richmond vs. Essendon 2013-05-05
 *      (8837957002).jpg", CC BY 2.0, the tower and the south stand at dusk.
 *      https://commons.wikimedia.org/wiki/File:MCG_Light_Tower,_Richmond_vs._Essendon_2013-05-05_(8837957002).jpg
 *    - p28: Joanna Holman, "Melbourne Cricket Ground exterior.jpg", CC BY-SA
 *      4.0: concrete stair towers, teal truss over the back.
 *      https://commons.wikimedia.org/wiki/File:Melbourne_Cricket_Ground_exterior.jpg
 *    - p26: richardmu (Flickr), "Melbourne Cricket Ground Panorama.jpg",
 *      CC BY 2.0, inside: pale blue seats, three tiers, screens.
 *      https://commons.wikimedia.org/wiki/File:Melbourne_Cricket_Ground_Panorama.jpg
 *    - p32: Abhishek050592, "Melbourne Cricket Ground, Melbourne,
 *      Victoria.jpg", CC BY-SA 4.0, inside, a screen at a junction.
 *      https://commons.wikimedia.org/wiki/File:Melbourne_Cricket_Ground,_Melbourne,_Victoria.jpg
 *    - p24: Jason L, "Melbourne Cricket Club Member's Reserve Dec 2022.jpg",
 *      CC BY-SA 4.0. https://commons.wikimedia.org/wiki/File:Melbourne_Cricket_Club_Member%27s_Reserve_Dec_2022.jpg
 *    - p17 (night): David Chau, "MCG at night from Eureka Tower.jpg", CC BY
 *      2.0. https://commons.wikimedia.org/wiki/File:MCG_at_night_from_Eureka_Tower.jpg
 *  No lidar or NAIP here (outside the US); no commercial imagery.
 *
 * Elevation 0, y = 0 at the arena. Mapterhorn (z14 only here) shows the
 * arena about 3.5 m above datum, Yarra Park on the north about 9-10 m and
 * the rail yards on the south-west about 2 m: the bowl is cut into the
 * slope, so the north stands sink into the park. No published arena level
 * below the streets; doubt.
 *
 * Invented or simplified, and doubts:
 *  - The stands are one profile swept round the bowl; the real Members
 *    Reserve's pavilion front, the gate notches and the stair towers are
 *    left out. One seat colour for the whole bowl.
 *  - The roof is drawn continuous round each stand and stops at the
 *    screens; its exact leading edge line is estimated.
 *  - The facade: glazed bands in two levels between concrete stair towers
 *    every 30 deg, each with a glazed slot, and a dark gate recess in
 *    each bay; the real towers and gates are not evenly spaced (estimated).
 *  - Truss and mast counts: about every 10 deg (low) / 5 deg (detail).
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { crs, dot, face, nrm3, strip, vadd, vlerp, vmul, vsub } from './seoul-world-cup-stadium'

// ---------------------------------------------------------------------------
// The kit, shared with london-lords and paris-court-philippe-chatrier.

export const RAD = Math.PI / 180

/** A point of a stand's cross-section: radius (or offset) r, height z, and the part the segment to the next point goes to. */
export type Sec = { r: number; z: number; part: Part | null }

/**
 * Loft cross-sections round (or along) a line. `frames[i]` gives the
 * section's origin on the ground and its unit outward direction; `secs[i]`
 * the section's points, all of the same length. The profile is walked so
 * that the outside is on its left (up for a tread going out, towards the
 * inside for a riser going up). Segment k uses secs[i][k].part, taken from
 * the section at the segment's start.
 */
export function loftSections(frames: { o: [number, number]; d: [number, number] }[], secs: Sec[][], closed: boolean, skip?: (i: number) => boolean) {
  const n = frames.length, m = secs[0].length
  const P = (i: number, k: number): V3 => {
    const { o, d } = frames[i], s = secs[i][k]
    return [o[0] + d[0] * s.r, o[1] + d[1] * s.r, s.z]
  }
  for (let k = 0; k < m - 1; k++) {
    // runs of consecutive frames sharing a part, so normals stay smooth along each run
    const segs = closed ? n : n - 1
    let start = 0
    const partOf = (i: number) => (skip && skip(i) ? null : secs[i][k].part)
    while (start < segs) {
      const part = partOf(start)
      let end = start
      while (end + 1 < segs && partOf(end + 1) === part) end++
      if (part) {
        const idx = Array.from({ length: end - start + 2 }, (_, t) => (start + t) % n)
        const r0 = idx.map((i) => P(i, k)), r1 = idx.map((i) => P(i, k + 1))
        const hint = (q: V3): V3 => {
          // nearest frame's profile normal
          let bi = idx[0], bd = 1e18
          for (const i of idx) { const p = P(i, k); const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2; if (dd < bd) { bd = dd; bi = i } }
          const a = secs[bi][k], b = secs[bi][k + 1], dr = b.r - a.r, dz = b.z - a.z
          const { d } = frames[bi]
          return [d[0] * -dz, d[1] * -dz, dr]
        }
        strip(part, r0, r1, hint, false, Math.abs(secs[idx[0]][k].r - secs[idx[0]][k + 1].r) < 1e-6 && false)
      }
      start = end + 1
    }
  }
}

/** Stepped seating from (r0, z0) to (r1, z1): n risers and treads (or one slope when n = 0). */
export function tier(part: Part, r0: number, z0: number, r1: number, z1: number, n: number, riser: Part = part): Sec[] {
  if (n <= 0) return [{ r: r0, z: z0, part }]
  const out: Sec[] = []
  for (let s = 0; s < n; s++) {
    const ra = r0 + ((r1 - r0) * s) / n, za = z0 + ((z1 - z0) * (s + 1)) / n
    out.push({ r: ra, z: z0 + ((z1 - z0) * s) / n, part: riser })
    out.push({ r: ra, z: za, part })
  }
  return out
}

/** A box bar from A to B, w wide (sideways) and h deep (along `up`), ends capped. */
export function bar(p: Part, A: V3, B: V3, w: number, h = w, up: V3 = [0, 0, 1], caps = true) {
  const t = nrm3(vsub(B, A))
  let s = crs(t, up)
  if (Math.hypot(...s) < 1e-6) s = crs(t, [1, 0, 0])
  s = nrm3(s)
  const u = crs(s, t)
  const c = (P: V3, a: number, b: number): V3 => vadd(P, vadd(vmul(s, (a * w) / 2), vmul(u, (b * h) / 2)))
  const q = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  const SA = q.map(([a, b]) => c(A, a, b)), SB = q.map(([a, b]) => c(B, a, b))
  for (let k = 0; k < 4; k++) {
    const j = (k + 1) % 4
    const out = vadd(vmul(s, q[k][0] + q[j][0]), vmul(u, q[k][1] + q[j][1]))
    face(p, [SA[k], SA[j], SB[j], SB[k]], out)
  }
  if (caps) { face(p, SA, vmul(t, -1)); face(p, SB, t) }
}

/** An upright tapered cylinder (smooth sides), optionally capped on top. */
export function cyl(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = 12, top = false, r1 = r, rot = 0) {
  const A: V3[] = [], B: V3[] = []
  for (let k = 0; k < n; k++) {
    const a = rot + (k / n) * 2 * Math.PI
    A.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z0])
    B.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1])
  }
  strip(p, A, B, (q) => [q[0] - cx, q[1] - cy, 0])
  if (top) face(p, B, [0, 0, 1])
}

/** A small octahedral bead (a lamp), radius r. */
export function bead(p: Part, c: V3, r: number) {
  const X: V3[] = [[r, 0, 0], [0, r, 0], [-r, 0, 0], [0, -r, 0]]
  for (let k = 0; k < 4; k++) {
    const a = vadd(c, X[k]), b = vadd(c, X[(k + 1) % 4])
    face(p, [a, b, vadd(c, [0, 0, r])], vsub(vlerp(a, b, 0.5), vadd(c, [0, 0, -r])))
    face(p, [b, a, vadd(c, [0, 0, -r])], vsub(vlerp(a, b, 0.5), vadd(c, [0, 0, r])))
  }
}

/** A box between corners, axis-aligned to a local frame (o origin, ex, ey horizontal unit vectors). */
export function obox(p: Part, o: V3, ex: V3, ey: V3, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, bottom = false) {
  const P = (x: number, y: number, z: number): V3 => vadd(o, vadd(vadd(vmul(ex, x), vmul(ey, y)), [0, 0, z]))
  const c = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  for (let k = 0; k < 4; k++) {
    const [ax, ay] = c[k], [bx, by] = c[(k + 1) % 4]
    const out = vsub(P((ax + bx) / 2, (ay + by) / 2, 0), P((x0 + x1) / 2, (y0 + y1) / 2, 0))
    face(p, [P(ax, ay, z0), P(bx, by, z0), P(bx, by, z1), P(ax, ay, z1)], out)
  }
  face(p, c.map(([x, y]) => P(x, y, z1)), [0, 0, 1])
  if (bottom) face(p, c.map(([x, y]) => P(x, y, z0)), [0, 0, -1])
}

export type Lod = { file: string; parts: Array<{ part: Part; material: MaterialSpec }>; maxTris: number; maxBytes: number }

/** Check each level's budget and write models/<file>. */
export async function writeLods(name: string, extras: Record<string, unknown>, lods: Lod[]) {
  for (const l of lods) {
    const used = l.parts.filter((x) => x.part.triangles > 0)
    const tris = used.reduce((s, x) => s + x.part.triangles, 0)
    if (used.length > 6) throw new Error(`${l.file}: ${used.length} materials`)
    console.log(l.file, used.map((x) => `${x.material.name}:${x.part.triangles}`).join(' '))
    if (tris > l.maxTris) throw new Error(`${l.file}: ${tris} triangles > ${l.maxTris}`)
    const glb = writeGlb(name, used, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; ground anchor', ...extras })
    if (glb.length > l.maxBytes) throw new Error(`${l.file}: ${glb.length} bytes > ${l.maxBytes}`)
    const out = new URL(`../models/${l.file}`, import.meta.url).pathname
    await Bun.write(out, glb)
    console.log(`${out}: ${tris} triangles, ${glb.length} bytes`)
  }
}

// ---------------------------------------------------------------------------
// The MCG

const BEARING = 0
const A_FIELD = 87.2, B_FIELD = 73.4
/** Outer wall radius every 5 deg from east, counter-clockwise (OSM, smoothed over the gate notches). */
const RO = [145.8, 144.5, 142.9, 141.2, 140.0, 140.0, 145.5, 151.9, 157.4, 156.5, 155.3, 153.5, 152.4, 151.5, 151.1, 151.0, 146.1, 141.3, 140.5, 144.6, 148.7, 148.7, 148.9, 149.7, 150.6, 151.9, 152.6, 153.2, 150.8, 153.0, 155.3, 160.0, 159.9, 159.9, 160.1, 160.4, 160.7, 160.6, 155.7, 150.1, 144.5, 139.2, 134.0, 128.7, 127.2, 125.7, 125.7, 126.4, 127.5, 127.4, 128.0, 128.6, 129.3, 129.4, 129.4, 129.5, 129.0, 128.5, 129.5, 130.9, 132.4, 132.6, 134.1, 135.6, 136.8, 137.0, 137.4, 139.2, 140.9, 142.3, 143.5, 144.7]
/** The two junctions of the Great Southern and Northern stands, math angles (deg): the screens stand there. */
const J1 = 22, J2 = 213
/** Light towers (OSM nodes, this frame). */
const TOWERS: [number, number][] = [[5.6, 138.9], [-5.1, -133.6], [-125.0, -51.3], [-116.7, 84.1], [127.6, 61.9], [119.9, -73.9]]

const wrap = (d: number) => ((d % 360) + 360) % 360
const rField = (f: number) => 1 / Math.sqrt((Math.cos(f) / A_FIELD) ** 2 + (Math.sin(f) / B_FIELD) ** 2)
const rOuter = (f: number) => {
  const d = wrap(f / RAD) / 5, i = Math.floor(d), t = d - i
  return RO[i % 72] * (1 - t) + RO[(i + 1) % 72] * t
}
/** 0 on the Great Southern Stand, 1 on the Northern Stand, blended over 6 deg at the junctions. */
const north = (f: number) => {
  const d = wrap(f / RAD)
  const s = (x: number) => Math.min(1, Math.max(0, x / 6 + 0.5))
  return Math.min(s(d - J1), s(J2 - d))
}
const nearJunction = (f: number, w: number) => [J1, J2].some((j) => Math.abs(((wrap(f / RAD) - j + 540) % 360) - 180) < w)

function build(detail: boolean) {
  const concrete = new Part(), white = new Part(), teal = new Part(), seats = new Part(), win = new Part(), roofp = new Part()
  const N = detail ? 144 : 72
  const phis = Array.from({ length: N }, (_, k) => (k / N) * 2 * Math.PI)
  const frames = phis.map((f) => ({ o: [0, 0] as [number, number], d: [Math.cos(f), Math.sin(f)] as [number, number] }))
  const H = (f: number) => 45 + 5 * north(f)
  const steps = detail ? 6 : 0

  // --- The bowl: one cross-section swept round, arena wall to outside wall.
  const secs = phis.map((f) => {
    const rf = rField(f), ro = rOuter(f), D = ro - rf, h = H(f)
    const a = rf + 0.3 * D, b = rf + 0.56 * D, c = rf + 0.86 * D
    return [
      { r: rf + 0.5, z: 0, part: concrete }, // arena wall
      { r: rf + 0.5, z: 2.2, part: concrete },
      { r: rf + 2.5, z: 2.2, part: null },
      ...tier(seats, rf + 2.5, 2.2, a, 0.29 * h, steps),
      { r: a, z: 0.29 * h, part: win }, // the first box band
      { r: a, z: 0.37 * h, part: concrete },
      { r: a + 1.2, z: 0.37 * h, part: seats },
      ...tier(seats, a + 1.2, 0.37 * h, b, 0.58 * h, steps).slice(1),
      { r: b, z: 0.58 * h, part: win }, // the second box band
      { r: b, z: 0.66 * h, part: concrete },
      { r: b + 1.2, z: 0.66 * h, part: seats },
      ...tier(seats, b + 1.2, 0.66 * h, c, 0.92 * h, steps).slice(1),
      { r: c, z: 0.92 * h, part: concrete },
      { r: c, z: 0.95 * h, part: concrete },
      { r: ro, z: 0.95 * h, part: concrete }, // the outside wall
      { r: ro, z: 0, part: null },
    ] as Sec[]
  })
  // tier() with steps = 0 gives one point; make every section the same length
  loftSections(frames, secs, true)

  // The facade: broad glazed bands running between concrete stair towers
  // (every 30 deg), each tower with a tall glazed slot, and a dark gate
  // recess in each bay between them.
  const T = detail ? 12 : 6
  for (let i = 0; i < N; i++) {
    const f0 = phis[i], f1 = phis[(i + 1) % N] + (i === N - 1 ? 2 * Math.PI : 0)
    const nb = north((f0 + f1) / 2)
    const r0 = rOuter(f0), r1 = rOuter(f1)
    const E0: V3 = [r0 * Math.cos(f0), r0 * Math.sin(f0), 0], E1: V3 = [r1 * Math.cos(f1), r1 * Math.sin(f1), 0]
    const nx = E1[1] - E0[1], ny = E0[0] - E1[0], nl = Math.hypot(nx, ny)
    const P = (t: number, z: number): V3 => {
      const q = vlerp(E0, E1, t)
      return [q[0] + (nx / nl) * 0.06, q[1] + (ny / nl) * 0.06, z]
    }
    const bands: [number, number][] = nb > 0.5 ? [[7, 13.5], [21, 31]] : [[8, 14], [22, 30]]
    const t0 = i % T === 0 ? 0.5 : 0, t1 = i % T === T - 1 ? 0.5 : 1
    for (const [z0, z1] of bands) face(win, [P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1)], [nx, ny, 0])
    // the gate in the middle of each bay
    if (i % T === T / 2) face(win, [P(0.2, 0), P(0.8, 0), P(0.8, 5.5), P(0.2, 5.5)], [nx, ny, 0])
  }
  for (let i = 0; i < N; i += T) {
    const f = phis[i], ro = rOuter(f), h = H(f)
    if (nearJunction(f, 4)) continue
    const d: V3 = [Math.cos(f), Math.sin(f), 0], sd: V3 = [-Math.sin(f), Math.cos(f), 0]
    const o: V3 = [d[0] * ro, d[1] * ro, 0]
    obox(concrete, o, d, sd, -1.5, 5, -5.5, 5.5, 0, 0.86 * h)
    face(win, [vadd(o, vadd(vmul(d, 5.06), vmul(sd, -1.6))), vadd(o, vadd(vmul(d, 5.06), vmul(sd, 1.6))), vadd(vadd(o, vadd(vmul(d, 5.06), vmul(sd, 1.6))), [0, 0, 0.8 * h]), vadd(vadd(o, vadd(vmul(d, 5.06), vmul(sd, -1.6))), [0, 0, 0.8 * h])].map((q, k) => (k < 2 ? vadd(q, [0, 0, 3]) : q)), d)
  }

  // --- The roofs: white top, dark underside, a fascia at the front.
  {
    const rsecs = phis.map((f) => {
      const rf = rField(f), ro = rOuter(f), D = ro - rf, h = H(f)
      const front = rf + 0.42 * D
      return [
        { r: front, z: h - 3.2, part: white },
        { r: front, z: h - 1.4, part: roofp },
        { r: ro + 1, z: h, part: white },
        { r: ro + 1, z: h - 1.4, part: win },
        { r: front, z: h - 3.2, part: null },
      ] as Sec[]
    })
    const gap = (i: number) => nearJunction(phis[i] + Math.PI / N, 4)
    loftSections(frames, rsecs, true, gap)
    // detail: the roof sheeting's radial ribs
    if (detail) for (let i = 0; i < N; i += 2) {
      if (gap(i) || gap((i + N - 1) % N)) continue
      const f = phis[i], s = rsecs[i], d: V3 = [Math.cos(f), Math.sin(f), 0]
      bar(concrete, [d[0] * s[1].r, d[1] * s[1].r, s[1].z + 0.35], [d[0] * s[2].r, d[1] * s[2].r, s[2].z + 0.35], 0.9, 0.7, [0, 0, 1], false)
    }
    // close the roof's ends at the screens
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      if (gap(i) === gap(j) || false) continue
      const k = gap(i) ? j : i
      const f = phis[k], s = rsecs[k]
      const pts = s.slice(0, 4).map((q) => [q.r * Math.cos(f), q.r * Math.sin(f), q.z] as V3)
      const side: V3 = [-Math.sin(f), Math.cos(f), 0]
      face(white, pts, gap(i) ? vmul(side, -1) : side)
    }
  }

  // --- The Great Southern Stand's teal trusses along the back of its roof.
  {
    const every = detail ? 1 : 2
    const apexes: V3[] = []
    for (let i = 0; i < N; i += every) {
      const f = phis[i]
      if (north(f) > 0.01 || nearJunction(f, 5)) { apexes.push([NaN, NaN, NaN]); continue }
      const ro = rOuter(f), h = H(f)
      const d: V3 = [Math.cos(f), Math.sin(f), 0], s: V3 = [-Math.sin(f), Math.cos(f), 0]
      const at = (r: number, side: number, z: number): V3 => [d[0] * r + s[0] * side, d[1] * r + s[1] * side, z]
      const apex = at(ro - 3, 0, h + 8.5)
      apexes.push(apex)
      const w = detail ? 0.75 : 1.1
      for (const [r, side] of [[ro - 9, -3], [ro - 9, 3], [ro + 1, -3], [ro + 1, 3]] as [number, number][]) bar(teal, at(r, side, h - 0.2), apex, w, w, [0, 0, 1], false)
      // the back leg down over the outside wall
      bar(teal, apex, at(ro + 2.5, 0, h - 9), w, w, [0, 0, 1], false)
      if (detail) {
        bar(teal, at(ro - 9, -3, h + 0.3), at(ro + 1, -3, h + 0.3), 0.5, 0.5, [0, 0, 1], false)
        bar(teal, at(ro - 9, 3, h + 0.3), at(ro + 1, 3, h + 0.3), 0.5, 0.5, [0, 0, 1], false)
      }
    }
    // the top chord linking the apexes
    for (let k = 0; k < apexes.length; k++) {
      const a = apexes[k], b = apexes[(k + 1) % apexes.length]
      if (Number.isNaN(a[0]) || Number.isNaN(b[0])) continue
      bar(teal, a, b, detail ? 0.8 : 1.2, detail ? 0.8 : 1.2, [0, 0, 1], false)
    }
  }

  // --- The Northern Stand's masts and ties.
  {
    const every = detail ? 4 : 3
    for (let i = 0; i < N; i += every) {
      const f = phis[i]
      if (north(f) < 0.99 || nearJunction(f, 7)) continue
      const rf = rField(f), ro = rOuter(f), D = ro - rf, h = H(f)
      const d: V3 = [Math.cos(f), Math.sin(f), 0]
      const at = (r: number, z: number): V3 => [d[0] * r, d[1] * r, z]
      const front = rf + 0.52 * D
      // raked outwards, rising about 24 m over the roof (p33, p23)
      const foot = at(rf + 0.74 * D, h - 0.6), top = at(rf + 0.74 * D + 7, h + 24)
      const w = detail ? 1.4 : 2.2
      bar(white, foot, top, w, w, [0, 0, 1], true)
      const t = detail ? 0.55 : 0.8
      bar(white, top, at(front + 1.5, h - 1.3), t, t, [0, 0, 1], false) // forestay to the roof's front
      bar(white, top, at(ro + 0.5, h - 0.2), t, t, [0, 0, 1], false) // backstay
      if (detail) {
        bar(white, top, at(rf + 0.63 * D, h - 0.6), t, t, [0, 0, 1], false)
        bar(white, at(rf + 0.74 * D + 3.5, h + 12), at(rf + 0.58 * D, h - 0.8), t * 0.8, t * 0.8, [0, 0, 1], false)
      }
    }
  }

  // --- The two video screens at the junctions.
  for (const j of [J1, J2]) {
    const f = j * RAD, rf = rField(f), ro = rOuter(f), D = ro - rf, h = 47.5
    const d: V3 = [Math.cos(f), Math.sin(f), 0], s: V3 = [-Math.sin(f), Math.cos(f), 0]
    const o: V3 = [d[0] * (rf + 0.74 * D), d[1] * (rf + 0.74 * D), 0]
    obox(win, o, d, s, 0, 6, -17, 17, 0.62 * h, h + 4)
    obox(concrete, o, d, s, 6, Math.max(7, ro - (rf + 0.74 * D)), -14, 14, 0.62 * h, h - 1)
  }

  // --- The six light towers: tapered tubes, trapezoidal heads whose lamp
  // faces are drawn as one panel (window: dark slate by day, lit at night).
  for (const [tx, ty] of TOWERS) {
    const L = Math.hypot(tx, ty)
    const fdir: V3 = [-tx / L, -ty / L, 0] // towards the arena
    const s: V3 = [-fdir[1], fdir[0], 0]
    const COL = 72.5
    cyl(white, tx, ty, 2.8, 0, COL, detail ? 16 : 10, true, 1.8)
    // the head: 11 m wide at its foot, 20 m at its top, 13 m tall, tilted 18 deg at the arena
    const HB = 5.5, HT = 10, HH = 12.5
    const tilt = 18 * RAD
    const up: V3 = vadd(vmul([0, 0, 1], Math.cos(tilt)), vmul(fdir, Math.sin(tilt)))
    const nrm: V3 = vadd(vmul(fdir, Math.cos(tilt)), vmul([0, 0, -1], Math.sin(tilt)))
    const base: V3 = [tx + fdir[0] * 0.6, ty + fdir[1] * 0.6, COL - 0.6]
    const Q = (x: number, y: number, dn = 0): V3 => vadd(base, vadd(vadd(vmul(s, x), vmul(up, y)), vmul(nrm, dn)))
    const half = (y: number) => HB + ((HT - HB) * y) / HH
    const DEP = 2
    const corners = (dn: number) => [Q(-HB, 0, dn), Q(HB, 0, dn), Q(HT, HH, dn), Q(-HT, HH, dn)]
    if (!detail) {
      const front = corners(0.2), back = corners(-DEP)
      face(white, back, vmul(nrm, -1))
      for (let k = 0; k < 4; k++) {
        const j = (k + 1) % 4
        const out = vsub(vlerp(front[k], front[j], 0.5), Q(0, HH / 2, 0.2))
        face(white, [front[k], front[j], back[j], back[k]], out)
      }
      // the white frame round the lamp panel, and the panel itself
      face(white, front, nrm)
      const inner = [Q(-HB + 1, 1, 0.26), Q(HB - 1, 1, 0.26), Q(HT - 1.2, HH - 1, 0.26), Q(-HT + 1.2, HH - 1, 0.26)]
      face(win, inner, nrm)
      bar(white, [tx, ty, COL - 10], Q(0, 7, -DEP), 1.4, 1.4, [0, 0, 1], false)
      continue
    }
    // detail: an open frame of bold box members, a dark back plate and rows of lamps
    const m = 0.85
    const rail = (y: number, dn: number) => bar(white, Q(-half(y), y, dn), Q(half(y), y, dn), m, m, nrm, false)
    for (const dn of [0, -DEP]) {
      for (const y of [0, HH / 4, HH / 2, (3 * HH) / 4, HH]) rail(y, dn)
      bar(white, Q(-HB, 0, dn), Q(-HT, HH, dn), m, m, nrm, false)
      bar(white, Q(HB, 0, dn), Q(HT, HH, dn), m, m, nrm, false)
      for (const x of [-0.5, 0.5]) bar(white, Q(HB * x, 0, dn), Q(HT * x, HH, dn), m * 0.8, m * 0.8, nrm, false)
    }
    for (const [x, y] of [[-HB, 0], [HB, 0], [-HT, HH], [HT, HH]] as [number, number][]) bar(white, Q(x, y, 0), Q(x, y, -DEP), m, m, up, false)
    const back = corners(-DEP - 0.3)
    face(white, back, vmul(nrm, -1))
    face(concrete, back, nrm) // the grey inside of the cage, behind the lamps
    for (let row = 0; row < 4; row++) for (let col = 0; col < 6; col++) {
      const y = HH / 8 + (row * HH) / 4, hw = half(y) - 1.1
      obox(win, Q(-hw + (2 * hw * col) / 5, y - 0.9, -0.9), s, up, -1.1, 1.1, -0, 1.8, 0, 0.9)
    }
    bar(white, [tx, ty, COL - 10], Q(0, 7, -DEP), 1.1, 1.1, [0, 0, 1], false)
    bar(white, [tx, ty, COL - 0.5], Q(0, 0, -0.8), 1.4, 1.4, [0, 0, 1], false)
  }

  const lit = (_p: V3, n: V3) => (n[2] < 0.3 ? 0.4 : 0.15)
  return [
    { part: concrete, material: { ...finish('mcg-concrete', 0xcdd0cc), floodlight: lit } },
    { part: white, material: finish('mcg-white', 0xeceeec) },
    { part: teal, material: finish('mcg-teal', 0x3f8c96) },
    { part: seats, material: finish('mcg-seats', 0x6f859c) },
    { part: win, material: PALETTE.window },
    { part: roofp, material: { ...finish('mcg-roof', 0xb3c0ba), floodlight: () => 0.2 } },
  ]
}

if (import.meta.main)
  await writeLods('Melbourne Cricket Ground', { bearing: BEARING, elevation: 0, height: 85 }, [
    { file: 'melbourne-mcg.glb', parts: build(false), maxTris: 6500, maxBytes: 250_000 },
    { file: 'melbourne-mcg.detail.glb', parts: build(true), maxTris: 40_000, maxBytes: 1536 * 1024 },
  ])
