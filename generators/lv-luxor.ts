/**
 * Luxor Las Vegas: the pyramid, its two ziggurat hotel towers, the sphinx
 * and the obelisk. Procedural, CC0-1.0.
 * bun generators/lv-luxor.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the pyramid's OSM
 * outline (way/27858544) runs within 0.4° of true north. The origin is that
 * outline's area centroid, the middle of the pyramid's base.
 *
 * Published (Wikipedia, "Luxor Las Vegas"; architect Veldon Simpson):
 * - the pyramid is 30 storeys and 357 ft (109 m) tall, clad in black glass;
 *   the top three storeys are the lamp room under the Sky Beam;
 * - the two hotel towers (1997, Klai Juba) are 22-storey ziggurats just
 *   north of the pyramid, in the same black glass;
 * - the sphinx is 32 m high, 24 m wide and 80 m long, facing the Strip,
 *   with the porte-cochère in its body; an obelisk stands in front of it,
 *   about 140 ft (43 m) by secondary sources, which agrees with its height
 *   against the sphinx in the Highsmith aerials below. OSM's 62 m is not used.
 *
 * Measured, from OSM: the pyramid base, 183.7 x 181.6 m (modelled as a
 * 183 m square); the towers, each an 80 m north-south spine 21.4 x 94 m with
 * an east-west arm 20 m deep stepping down 70, 60, 50, 40, 30 m in 9.3 m bays
 * on both sides (the building:parts of way/136520122); the podium outline
 * (way/136520122); the sphinx (way/118344867, head way/118344869) and the
 * obelisk (way/399368723). The USGS NAIP orthophoto (public domain) confirms
 * the pyramid square, the head over the chest and the two paws running east.
 *
 * Photos (Wikimedia Commons):
 * - "Aerial view showing the Luxor Hotel Sphynx and Pyramid" and "Aerial view
 *   of Las Vegas ... Luxor Hotel pyramid", Carol M. Highsmith, public domain:
 *   massing, the towers' stepped arms with white terraces, sphinx, obelisk;
 * - "Luxor pyramid Las Vegas.jpg" and "Luxor hotel Las Vegas.jpg", ArticCynda,
 *   CC BY-SA 4.0: the glass, the pale hip edges, the east tower's steps;
 * - "Las Vegas - Luxor Hotel.jpg", P. Hughes, CC BY 4.0: the sphinx's nemes
 *   in blue and gold bands, the face, the pale grey capstone;
 * - "Luxor Pyramid & Sphinx in Las Vegas (Day)", Rob Young, CC BY 2.0: the
 *   head and nemes from the front;
 * - "2012.10.05.182704 Nightfall Luxor Hotel", Hermann Luyken, CC0: at night
 *   the faces stay dark and only the hip edges and the tip are lit, so the
 *   faces are an unlit finish and the hips and capstone are `window-3`.
 *
 * Estimated: the white podium's height, 14 m from the photos rather than
 * OSM's 20 (the dark glass runs down to a two- or three-storey colonnade);
 * the sphinx's body, chest and head proportions inside the published
 * envelope; the obelisk's plinth and taper. The tower podium's own shape is
 * OSM's. Left out: the Sky Beam (light, not geometry), the advertising on the
 * pyramid, the avenue of small sphinxes, the vent slot under the tip.
 *
 * The dark glass is identity, so it stays dark, held at the charcoal limit.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

export type XY = [number, number]

// ---------------------------------------------------------------- helpers

/** Ear-clipping triangulation of a simple counter-clockwise polygon. */
export function triangulate(poly: XY[]): [number, number, number][] {
  const idx = poly.map((_, i) => i)
  const out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = poly[i0], b = poly[i1], c = poly[i2]
      if (cr(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(poly[j], a, b, c))) continue
      out.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) throw new Error('triangulation stuck')
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}

const signedArea = (poly: XY[]) => poly.reduce((s, p, i) => {
  const q = poly[(i + 1) % poly.length]
  return s + p[0] * q[1] - q[0] * p[1]
}, 0) / 2

/** A polygon extruded from z0 to z1, walls in `wall`, top in `top`. */
export function prism(wall: Part, top: Part, poly: XY[], z0: number, z1: number) {
  const ring = signedArea(poly) < 0 ? [...poly].reverse() : poly
  wall.loft([ring.map(([x, y]): V3 => [x, y, z0]), ring.map(([x, y]): V3 => [x, y, z1])])
  for (const [a, b, c] of triangulate(ring)) top.tri([...ring[a], z1], [...ring[b], z1], [...ring[c], z1])
}

/** A box with chamfered vertical edges: walls in `wall`, roof in `top`. */
export function block(wall: Part, top: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, c = 0.5) {
  const ring: XY[] = [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
  wall.loft([ring.map(([x, y]): V3 => [x, y, z0]), ring.map(([x, y]): V3 => [x, y, z1])])
  top.cap(ring.map(([x, y]): V3 => [x, y, z1]), true)
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A quad turned to face away from `centre`, whichever order it came in. */
export function quadOut(p: Part, a: V3, b: V3, c: V3, d: V3, centre: V3) {
  const n: V3 = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const m: V3 = [(a[0] + c[0]) / 2 - centre[0], (a[1] + c[1]) / 2 - centre[1], (a[2] + c[2]) / 2 - centre[2]]
  if (dot(n, m) >= 0) p.quad(a, b, c, d)
  else p.quad(d, c, b, a)
}

/** A triangle turned to face away from `centre`. */
export function triOut(p: Part, a: V3, b: V3, c: V3, centre: V3) {
  const n: V3 = [
    (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
    (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
  ]
  const m: V3 = [(a[0] + b[0] + c[0]) / 3 - centre[0], (a[1] + b[1] + c[1]) / 3 - centre[1], (a[2] + b[2] + c[2]) / 3 - centre[2]]
  if (dot(n, m) >= 0) p.tri(a, b, c)
  else p.tri(c, b, a)
}

/**
 * A closed solid lofted through rings (same point count, any order round),
 * each face turned outward from its ring's centre; both ends capped.
 */
export function solid(p: Part, rings: V3[][], caps = true) {
  const centreOf = (r: V3[]): V3 => r.reduce((s, q) => [s[0] + q[0] / r.length, s[1] + q[1] / r.length, s[2] + q[2] / r.length], [0, 0, 0] as V3)
  for (let k = 0; k < rings.length - 1; k++) {
    const c0 = centreOf(rings[k]), c1 = centreOf(rings[k + 1])
    const c: V3 = [(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2, (c0[2] + c1[2]) / 2]
    const n = rings[k].length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      quadOut(p, rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i], c)
    }
  }
  if (!caps) return
  for (const [r, other] of [[rings[0], rings[1]], [rings[rings.length - 1], rings[rings.length - 2]]]) {
    const c = centreOf(r), o = centreOf(other)
    // Push the reference point away from the cap so it faces outward.
    const ref: V3 = [2 * o[0] - c[0], 2 * o[1] - c[1], 2 * o[2] - c[2]]
    for (let i = 0; i < r.length; i++) {
      const j = (i + 1) % r.length
      triOut(p, c, r[i], r[j], ref)
    }
  }
}

/** A flat panel on an axis-aligned wall. `side` is the wall's outward normal. */
export function panel(p: Part, side: 'N' | 'S' | 'E' | 'W', at: number, s0: number, s1: number, z0: number, z1: number, d = 0.05) {
  if (side === 'S') p.quad([s0, at - d, z0], [s1, at - d, z0], [s1, at - d, z1], [s0, at - d, z1])
  if (side === 'N') p.quad([s1, at + d, z0], [s0, at + d, z0], [s0, at + d, z1], [s1, at + d, z1])
  if (side === 'E') p.quad([at + d, s0, z0], [at + d, s1, z0], [at + d, s1, z1], [at + d, s0, z1])
  if (side === 'W') p.quad([at - d, s1, z0], [at - d, s0, z0], [at - d, s0, z1], [at - d, s1, z1])
}

// ---------------------------------------------------------------- model

if (import.meta.main) {
  const glass = new Part() // the black glass: pyramid faces, tower walls
  const win = new Part() // tower window bays, a shade lighter; lit at night
  const edge = new Part() // the pyramid's hips and capstone; lit at night
  const stone = new Part() // podium, terraces, sphinx, obelisk
  const blue = new Part() // the nemes' blue bands
  const gold = new Part() // the nemes' gold bands, the cobra, the pyramidion

  // OSM is given relative to 36.0959 N, 115.1758 W; the origin is the
  // pyramid outline's centroid, (-0.4, -47.5) from there.
  const O: XY = [-0.4, -47.5]
  const L = ([x, y]: XY): XY => [x - O[0], y - O[1]]

  // ----- the pyramid: a 183 m square, 109 m high, hips chamfered in a pale
  // strip and a pale capstone over the top three storeys.
  {
    const H = 109, half = 91.5, cap = 101, c = 1.6 // chamfer half-width at the base
    const at = (z: number) => half * (1 - z / H)
    // The chamfer narrows with the pyramid so it meets at the capstone.
    const ring = (z: number): V3[] => {
      const h = at(z), k = (c * h) / half
      return [[-h + k, -h, z], [h - k, -h, z], [h, -h + k, z], [h, h - k, z], [h - k, h, z], [-h + k, h, z], [-h, h - k, z], [-h, -h + k, z]]
    }
    const r0 = ring(0), r1 = ring(cap)
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8
      ;(i % 2 === 0 ? glass : edge).quad(r0[i], r0[j], r1[j], r1[i])
    }
    // Capstone: a small pyramid continuing the slopes, in the edge colour.
    const top: V3 = [0, 0, H]
    for (let i = 0; i < 8; i++) edge.tri(r1[i], r1[(i + 1) % 8], top)
  }

  // ----- the hotel towers
  const PODIUM = 14
  const podiumPoly: XY[] = ([
    [-136.3, 108.3], [-136.4, 88.1], [-136.7, 68.5], [-80.7, 68.6], [-80.6, 50.1], [-59.7, 50.2], [-59.8, 42.6], [-1.9, 43.0],
    [57.4, 43.4], [57.4, 50.9], [78.3, 51.1], [78.0, 89.5], [132.3, 89.4], [132.1, 109.9], [78.0, 109.6], [77.8, 145.2],
    [56.9, 145.2], [57.1, 109.4], [21.7, 109.3], [21.8, 142.6], [-26.4, 142.2], [-26.4, 108.9], [-60.0, 108.7],
    [-60.2, 144.4], [-81.1, 144.3], [-80.9, 108.6],
  ] as XY[]).map(L)
  prism(stone, stone, podiumPoly, 0, PODIUM)

  const FLOOR = 3.1
  /** Window bays on one face of a tower block: one per 9.3 m bay, three floors tall. */
  const bays = (side: 'N' | 'S' | 'E' | 'W', at: number, s0: number, s1: number, z0: number, z1: number) => {
    const n = Math.max(1, Math.round((s1 - s0) / 4.65)), w = (s1 - s0) / n
    for (let z = z0 + 0.8; z + FLOOR * 2 < z1; z += FLOOR * 3) {
      const t = Math.min(z + FLOOR * 3 - 0.8, z1 - 0.8)
      for (let i = 0; i < n; i++) panel(win, side, at, s0 + i * w + 0.5, s0 + (i + 1) * w - 0.5, z, t)
    }
  }
  /** A dark glass block with white roof and window bays on its open faces. */
  const towerBlock = (x0: number, x1: number, y0: number, y1: number, h: number, faces: ('N' | 'S' | 'E' | 'W')[]) => {
    block(glass, stone, x0, x1, y0, y1, PODIUM, h, 0.5)
    for (const f of faces) {
      if (f === 'N') bays('N', y1, x0 + 0.6, x1 - 0.6, PODIUM, h)
      if (f === 'S') bays('S', y0, x0 + 0.6, x1 - 0.6, PODIUM, h)
      if (f === 'E') bays('E', x1, y0 + 0.6, y1 - 0.6, PODIUM, h)
      if (f === 'W') bays('W', x0, y0 + 0.6, y1 - 0.6, PODIUM, h)
    }
  }
  // Each tower is mirror-symmetric about its spine: the spine, then the arm
  // stepping down 65, 56, 47, 38, 29 m outward on both sides.
  const tower = (sx0: number, sx1: number) => {
    const [ax0] = L([sx0, 0]), [ax1] = L([sx1, 0])
    const [, y0] = L([0, 50.5]), [, y1] = L([0, 144.8]), [, a0] = L([0, 88.8]), [, a1] = L([0, 109.2])
    towerBlock(ax0, ax1, y0, y1, 74, ['N', 'S', 'E', 'W'])
    const step = 9.3
    ;[65, 56, 47, 38, 29].forEach((h, i) => {
      towerBlock(ax1 + i * step, ax1 + (i + 1) * step, a0, a1, h, ['N', 'S', 'E'])
      towerBlock(ax0 - (i + 1) * step, ax0 - i * step, a0, a1, h, ['N', 'S', 'W'])
    })
  }
  tower(-81.1, -59.7)
  tower(56.9, 78.3)

  // ----- the sphinx, facing east along y = 0, rump at the pyramid, on the
  // low base that holds the porte-cochère.
  {
    const X = 99.6 // rump
    const B = 3.5 // base height
    const sx = (u: number) => X + u
    block(stone, stone, sx(-0.5), sx(79), -13, 13, 0, B, 0.6)
    // A loaf section: flat back, rounded flanks, standing on the base.
    const section = (u: number, w: number, h: number, y0 = 0): V3[] => {
      const pts: V3[] = []
      const n = 8
      for (let i = 0; i <= n; i++) {
        const a = (Math.PI * i) / n
        const cx = Math.cos(a), sz = Math.sin(a)
        pts.push([sx(u), y0 + Math.sign(cx) * Math.pow(Math.abs(cx), 0.6) * (w / 2), B + Math.pow(sz, 0.6) * h])
      }
      return pts
    }
    // Body: haunch at the rump, a long back, rising to the shoulders.
    const body: [number, number, number][] = [
      [0, 16, 0.5], [2, 20, 7], [6, 22, 10], [14, 22, 10.5], [26, 22, 11], [34, 22.5, 12.5], [40, 23, 14],
    ]
    solid(stone, body.map(([u, w, h]) => section(u, w, h)))
    // Chest under the head, its front at u = 51.
    solid(stone, [section(38, 23, 15), section(46, 21, 15.5), section(50, 17, 13), section(51.5, 12, 9)])
    // Forelegs and paws, broad and rounded, running east to the Strip end.
    for (const s of [-1, 1]) {
      const paw = (u: number, w: number, h: number) => section(u, w, h, s * 7.6)
      solid(stone, [paw(42, 7.6, 8), paw(52, 7.6, 6.6), paw(74, 7.6, 6), paw(77.4, 6.6, 4.6), paw(79, 4.4, 2.2)])
    }

    // Nemes: stacked bands, blue and gold, flaring from the crown down to
    // the shoulders, set back behind the face.
    const hu = 45 // the head's centre line, over the chest
    const nemes: [number, number, number][] = [ // z, width, depth
      [12.5, 24, 11], [15.5, 23, 12], [18.5, 21, 12.4], [21.5, 18.6, 12.4], [24.5, 16, 12], [27, 13.4, 11.2], [29, 11, 10], [30.6, 8.4, 8.4],
    ]
    const ringAt = (z: number, w: number, d: number): V3[] => {
      const c = Math.min(1.6, w / 5)
      return [[sx(hu) - d / 2 + c, -w / 2, z], [sx(hu) + d / 2, -w / 2, z], [sx(hu) + d / 2, w / 2, z], [sx(hu) - d / 2 + c, w / 2, z], [sx(hu) - d / 2, w / 2 - c, z], [sx(hu) - d / 2, -w / 2 + c, z]]
    }
    for (let k = 0; k < nemes.length - 1; k++) {
      const [z0, w0, d0] = nemes[k], [z1, w1, d1] = nemes[k + 1]
      solid(k % 2 === 0 ? blue : gold, [ringAt(z0, w0, d0), ringAt(z1, w1, d1)], k === 0 || k === nemes.length - 2)
    }
    // The face, proud of the nemes front, and the blue beard on the chest.
    const fx = sx(hu) + 6
    block(stone, stone, fx - 2.5, fx + 2.4, -5, 5, 17.5, 28.6, 1.4)
    block(stone, stone, fx + 2.3, fx + 3.3, -1, 1, 21, 25, 0.4) // nose
    block(blue, blue, fx + 0.4, fx + 2, -1.4, 1.4, 11.5, 17.6, 0.4)
    // The cobra on the brow.
    block(gold, gold, fx - 0.4, fx + 1.4, -1, 1, 28.6, 32, 0.4)
  }

  // ----- the obelisk on its plinth: 43 m, east of the sphinx.
  {
    const [ox, oy] = L([223.4, -46.0])
    block(stone, stone, ox - 5, ox + 5, oy - 5, oy + 5, 0, 2.2, 0.5)
    block(stone, stone, ox - 3.6, ox + 3.6, oy - 3.6, oy + 3.6, 2.2, 5.5, 0.4)
    const sq = (h: number, z: number): V3[] => [[ox - h, oy - h, z], [ox + h, oy - h, z], [ox + h, oy + h, z], [ox - h, oy + h, z]]
    stone.loft([sq(2.4, 5.5), sq(1.6, 39.5)])
    const tip: V3 = [ox, oy, 43]
    const r = sq(1.6, 39.5)
    for (let i = 0; i < 4; i++) gold.tri(r[i], r[(i + 1) % 4], tip)
  }

  const parts = [
    { part: glass, material: finish('luxor-glass', 0x4b5160) },
    { part: win, material: windowVariant(2, 0x58606f) },
    { part: edge, material: windowVariant(3, 0xc9ccd1) },
    { part: stone, material: PALETTE.stone },
    { part: blue, material: finish('luxor-nemes-blue', 0x86a6c6) },
    { part: gold, material: finish('luxor-nemes-gold', 0xcfae72) },
  ]
  const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Luxor Las Vegas', parts, {
    license: 'CC0-1.0',
    height: 109,
    frame: 'Y up, -Z north, +X east, metres; origin at the pyramid outline centroid; bearing 0',
  })
  if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL('../models/lv-luxor.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
