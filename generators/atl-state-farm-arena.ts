/**
 * State Farm Arena (1999 as Philips Arena, HOK Sport with Arquitectonica;
 * renovated 2018) — original procedural geometry, CC0-1.0.
 * bun generators/atl-state-farm-arena.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Anchor = centroid
 * of OSM way/25312494, 33.757234, -84.396365. Only the arena is modelled:
 * the CNN Center / Omni hotel it adjoins on the east (way/40741532,
 * way/41439893 "The CTR", way/1522340326) stays the map's.
 *
 * Identity, from the photos and the aerial:
 *  - the front on the south-south-east street: a long, gently bowed glass
 *    wall behind giant white structural trusses that spell A-T-L-A-N-T-A
 *    across it, under a deep curved white canopy, with the red State Farm
 *    Arena sign on the canopy's west end;
 *  - the roof: a huge grey square slab turned 43° to the street grid and
 *    vaulted along one diagonal, sitting on the arena's rectangular box,
 *    its south-east edge rising over a lower wedge-shaped lobby roof that
 *    fills the space between it and the front;
 *  - the box itself: tan precast walls with a row of dark triangles near
 *    the top and tall glass bays at street level, and a glass corner on
 *    the south-west diagonal.
 *
 * Evidence:
 *  - plan: OSM way/25312494 (simplified). OSM draws the front as a
 *    straight line; the photos show it as a broad convex curve, so its
 *    ends are set 8 m back and its middle bows out to OSM's line; the slab from the NAIP aerial
 *    and the lidar (a rectangle u -58..60 m along 47°, v -44..48 m along
 *    317°, its corners on the box's north, east and west walls and at the
 *    front's west end).
 *  - heights: USGS 3DEP lidar GA_Statewide_B2_2018 (2018 flight), 1 m
 *    grid. Over ground_min (303.33 m): box roof 41, slab 42.8 at its
 *    south-west edge rising to a 51.8 m ridge at u ≈ +20 and 46 at its
 *    north-east edge (a barrel across u: 42.8, 46.8, 49.7, 51.4, 51.8,
 *    50.9 at u = -62, -42, -23, -3, 17, 36), lobby wedge 46 at the slab
 *    falling to 37-44 at the front, the street in front 22. The arena
 *    stands over the old rail gulch: Mapterhorn's lowest ground under the
 *    footprint is about 4.2 m over ground_min (its north-west corner), so
 *    here everything is 4.2 m lower: street 17.8, box 36.8, slab 38.6 to
 *    47.6. The map's terrain at the front is far below the street (the
 *    viaduct streets are not in it), so the precast podium under the front
 *    stands exposed down to y = 0. That band is drawn in
 *    darker grey and set 3 m back under the glass (a terrain artefact,
 *    kept true to the lidar but quiet).
 *  - the trusses: seven letters, about 13.9 m wide and 19.5 m tall, from
 *    the street to the canopy (estimated from the photos against the
 *    lidar's canopy height). Drawn as 2.7 m white box beams, a little bolder than the real ones.
 *  - colours: tan precast, white trusses and canopy, grey slab fascia,
 *    pale roof (NAIP), dark reflective glass.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - State Farm (Philips) Arena, Atlanta, GA (46558861525) - 2019.jpg,
 *    Warren LeMay, CC0 (the front from the west, State Farm sign)
 *    https://commons.wikimedia.org/wiki/File:State_Farm_(Philips)_Arena,_Atlanta,_GA_(46558861525)_-_2019.jpg
 *  - State Farm (Phillips) Arena, Atlanta, GA (33597622678).jpg, Warren
 *    LeMay, CC0 (the front from the east: "...ANTA")
 *    https://commons.wikimedia.org/wiki/File:State_Farm_(Phillips)_Arena,_Atlanta,_GA_(33597622678).jpg
 *  - State Farm (Phillips) Arena, Atlanta, GA (46558861605).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:State_Farm_(Phillips)_Arena,_Atlanta,_GA_(46558861605).jpg
 *  - State Farm (Phillips) Arena, Atlanta, GA (47474209661).jpg, Warren LeMay, CC0
 *    https://commons.wikimedia.org/wiki/File:State_Farm_(Phillips)_Arena,_Atlanta,_GA_(47474209661).jpg
 *  - Atlanta August 2016 34 (Philips Arena).jpg, Michael Barera, CC BY-SA
 *    4.0 (the west side: tan box, triangles, glass corner)
 *    https://commons.wikimedia.org/wiki/File:Atlanta_August_2016_34_(Philips_Arena).jpg
 *  - Atlanta August 2016 27 (Philips Arena).jpg, Michael Barera, CC BY-SA 4.0
 *    https://commons.wikimedia.org/wiki/File:Atlanta_August_2016_27_(Philips_Arena).jpg
 *  - Philips Arena-Atlanta.jpg, Priscilla, CC BY-SA 2.0 (canopy and slab
 *    edge) https://commons.wikimedia.org/wiki/File:Philips_Arena-Atlanta.jpg
 *  - NAIP orthophoto (USGS, public domain): plan, the slab, roof colour.
 * No look-only sources. No commercial imagery.
 *
 * Night: the front glass and the street-level bays are `window`; the
 * State Farm sign is `neon-sfa-red`; the white trusses carry floodlight.
 *
 * Doubts: the letters are drawn from the photos of the east half ("ANTA")
 * and the west end ("AT"); the "L" is inferred from the word. The roof's
 * painted State Farm logo, the Hawks sign pylon and the north side's
 * metal cladding are left out; the north and east walls are drawn plain
 * tan from the one west-side photo.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { capPoly, edgePanels, prism, save, wall, type XY } from './atl-westin-peachtree-plaza'

const precast = new Part(), glass = new Part(), white = new Part(), silver = new Part(), roof = new Part(), red = new Part()

const STREET = 17.8, BOX = 36.8
const D = Math.PI / 180

// ── Plan ──
const F0: XY = [-12, -88], F1: XY = [79.2, -54.2]       // the front's chord
// The front is a broad convex curve (photos): its ends are set 8 m back
// from OSM's straight front line and its middle bows out 8 m to it.
const BACK = 8, BULGE = 8
const L0: XY = [-12.4, -71.8], L1: XY = [72.2, 8.7]      // the slab's south-east edge
/** The front arc, west to east. */
const arc = (n: number, out = 0): XY[] => {
  const dx = F1[0] - F0[0], dy = F1[1] - F0[1], L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, b = BULGE * 4 * t * (1 - t)
    // Outward offset along the arc's own normal (approximately the chord's).
    const slope = BULGE * 4 * (1 - 2 * t) / L
    const tx = dx / L - nx * slope, ty = dy / L - ny * slope, tl = Math.hypot(tx, ty)
    const ox = ty / tl, oy = -tx / tl
    return [F0[0] + dx * t + nx * (b - BACK) + ox * out, F0[1] + dy * t + ny * (b - BACK) + oy * out] as XY
  })
}
const box: XY[] = [[-77, -47.2], [-44.1, -48.4], [-24.5, -77.7], L0, L1, [72.7, 65.1], [10, 68.3], [4.5, 73.4], [-1.8, 68.6], [-73.9, 70]]
const NA = 28
const FRONT = arc(NA)
const wedge: XY[] = [...FRONT, [70.5, -43.1], L1, L0]

/** Split long edges so low faces follow the terrain (≤ 5 m). */
const split = (ring: XY[], step = 5): XY[] => ring.flatMap((a, i) => {
  const b = ring[(i + 1) % ring.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / step))
  return Array.from({ length: k }, (_, j) => [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k] as XY)
})

// ── The box: tan precast to the box roof, the podium under the front. ──
prism(precast, split(box), 0, BOX, roof, 0.5)
// Under the front, below the street: the map's terrain here lacks the
// viaduct streets and lies up to 13 m below the real street, so the
// substructure the lidar shows stands exposed. It is drawn as a darker
// grey concrete band set 3 m back under the glass, with a soffit, so the
// glass-and-truss front above reads as the facade.
{
  const rec = arc(NA, -3)
  const pod: XY[] = [...rec, [68.5, -45], L1, L0]
  wall(silver, split(pod, 5), 0, STREET)
  const fr = arc(NA, 0)
  for (let i = 0; i < NA; i++) {
    const a = fr[i], b = fr[i + 1], c = rec[i + 1], d = rec[i]
    silver.quad([a[0], a[1], STREET], [d[0], d[1], STREET], [c[0], c[1], STREET], [b[0], b[1], STREET])
  }
}
const wedgeTop = (p: XY) => {
  // 41.8 m at the slab's edge, falling toward the front (lidar 46 → 38-40).
  const dx = L1[0] - L0[0], dy = L1[1] - L0[1], L = Math.hypot(dx, dy)
  const d = ((p[0] - L0[0]) * dy - (p[1] - L0[1]) * dx) / L
  return Math.max(39.5, 41.8 - 0.09 * d)
}
// Glass walls of the lobby wedge (the front and its east end).
for (let i = 0; i < wedge.length - 1; i++) {
  const a = wedge[i], b = wedge[i + 1]
  if (i > FRONT.length) continue
  const za = wedgeTop(a), zb = wedgeTop(b)
  glass.quad([a[0], a[1], STREET], [b[0], b[1], STREET], [b[0], b[1], zb], [a[0], a[1], za])
}
// Precast for the wedge's edge on the slab's line (hidden mostly) and its short ends.
for (const [a, b] of [[L1, L0], [L0, FRONT[0]]] as [XY, XY][]) {
  precast.quad([a[0], a[1], STREET], [b[0], b[1], STREET], [b[0], b[1], wedgeTop(b)], [a[0], a[1], wedgeTop(a)])
}
{
  // The wedge's roof, sloping, as a cap with per-vertex height.
  const tmp = new Part()
  capPoly(tmp, wedge, 0, true)
  for (let k = 0; k < tmp.pos.length; k += 9) {
    const v = [0, 3, 6].map((o) => {
      const x = tmp.pos[k + o], y = -tmp.pos[k + o + 2]
      return [x, y, wedgeTop([x, y])] as V3
    })
    roof.tri(v[0], v[1], v[2])
  }
}

// ── The canopy: a deep curved white band 6 m out from the glass. ──
{
  const inner = arc(NA, 0), outer = arc(NA, 6.5)
  const z1 = (p: XY) => wedgeTop(p) + 0.6, z0 = (p: XY) => wedgeTop(p) - 3.0
  for (let i = 0; i < inner.length - 1; i++) {
    const a = inner[i], b = inner[i + 1], c = outer[i + 1], d = outer[i]
    // top
    white.quad([a[0], a[1], z1(a)], [d[0], d[1], z1(a) - 0.3], [c[0], c[1], z1(b) - 0.3], [b[0], b[1], z1(b)])
    // soffit
    white.quad([a[0], a[1], z0(a)], [b[0], b[1], z0(b)], [c[0], c[1], z0(b) + 0.6], [d[0], d[1], z0(a) + 0.6])
    // fascia
    white.quad([d[0], d[1], z0(a) + 0.6], [c[0], c[1], z0(b) + 0.6], [c[0], c[1], z1(b) - 0.3], [d[0], d[1], z1(a) - 0.3])
  }
  // Ends.
  for (const [i, s] of [[0, 1], [inner.length - 1, -1]] as [number, number][]) {
    const a = inner[i], d = outer[i]
    const q: V3[] = [[a[0], a[1], z0(a)], [d[0], d[1], z0(a) + 0.6], [d[0], d[1], z1(a) - 0.3], [a[0], a[1], z1(a)]]
    if (s > 0) white.quad(q[0], q[1], q[2], q[3])
    else white.quad(q[3], q[2], q[1], q[0])
  }
  // The red State Farm Arena sign standing on the canopy's curved edge
  // over its west end (LeMay's view from the west): a red neon panel
  // following the curve, 6 m tall and 35 m long (STYLE.md: a plain panel for signs
  // that are not the landmark).
  const sg = arc(NA, 5.2)
  for (let i = 2; i < 13; i++) {
    const s0 = sg[i], s1 = sg[i + 1]
    const zb = z1(s0) - 0.4
    const dx = s1[0] - s0[0], dy = s1[1] - s0[1], L = Math.hypot(dx, dy), ex = dx / L * 0.05, ey = dy / L * 0.05, nx = dy / L * 0.35, ny = -dx / L * 0.35
    const ring: XY[] = [[s0[0] - nx - ex, s0[1] - ny - ey], [s1[0] - nx + ex, s1[1] - ny + ey], [s1[0] + nx + ex, s1[1] + ny + ey], [s0[0] + nx - ex, s0[1] + ny - ey]]
    prism(red, ring, zb, zb + 6, red, 0)
  }
}

// ── ATLANTA: the trusses, in front of the glass, west to east. ──
{
  const H0 = STREET, OUT = 3.4, B = 1.35, DEP = 0.9
  const letters = 'ATLANTA'
  const n = letters.length, A = arc(n * 4, OUT)
  type Seg = [[number, number], [number, number]]
  const shapes: Record<string, Seg[]> = {
    A: [[[0.06, 0], [0.5, 1]], [[0.94, 0], [0.5, 1]], [[0.28, 0.42], [0.72, 0.42]]],
    T: [[[0.5, 0], [0.5, 1]], [[0.08, 0.95], [0.92, 0.95]]],
    L: [[[0.22, 0], [0.22, 1]], [[0.22, 0.05], [0.86, 0.05]]],
    N: [[[0.12, 0], [0.12, 1]], [[0.12, 1], [0.88, 0]], [[0.88, 0], [0.88, 1]]],
  }
  letters.split('').forEach((ch, k) => {
    const p0 = A[k * 4], p1 = A[k * 4 + 4]
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy), tx = dx / w, ty = dy / w, ox = ty, oy = -tx
    const top = Math.min(wedgeTop(p0), wedgeTop(p1)) - 3.0 + 0.3
    const h = top - H0
    for (const [[s0, t0], [s1, t1]] of shapes[ch]) {
      const a = [p0[0] + tx * s0 * w, p0[1] + ty * s0 * w, H0 + t0 * h], b = [p0[0] + tx * s1 * w, p0[1] + ty * s1 * w, H0 + t1 * h]
      beam(a as V3, b as V3, [ox, oy, 0], B, DEP)
    }
  })
  /** A box beam from a to b, half-width hw in the letter's plane, half-depth hd along `o`. */
  function beam(a: V3, b: V3, o: V3, hw: number, hd: number) {
    const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), t: V3 = [d[0] / L, d[1] / L, d[2] / L]
    // Overlap at the joints.
    a = [a[0] - t[0] * hw, a[1] - t[1] * hw, Math.max(H0, a[2] - t[2] * hw)]
    b = [b[0] + t[0] * hw, b[1] + t[1] * hw, b[2] + t[2] * hw]
    // In-plane side: o × t.
    const s: V3 = [o[1] * t[2] - o[2] * t[1], o[2] * t[0] - o[0] * t[2], o[0] * t[1] - o[1] * t[0]]
    const c = (p: V3, i: number, j: number): V3 => [p[0] + s[0] * hw * i + o[0] * hd * j, p[1] + s[1] * hw * i + o[1] * hd * j, p[2] + s[2] * hw * i + o[2] * hd * j]
    const ring = (p: V3) => [c(p, -1, -1), c(p, 1, -1), c(p, 1, 1), c(p, -1, 1)]
    const ra = ring(a), rb = ring(b)
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const q = [ra[i], ra[j], rb[j], rb[i]]
      const m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
      const f = [(q[0][0] + q[2][0]) / 2 - m[0], (q[0][1] + q[2][1]) / 2 - m[1], (q[0][2] + q[2][2]) / 2 - m[2]]
      const nn = cross3(sub3(q[1], q[0]), sub3(q[3], q[0]))
      if (nn[0] * f[0] + nn[1] * f[1] + nn[2] * f[2] > 0) white.quad(q[0], q[1], q[2], q[3])
      else white.quad(q[3], q[2], q[1], q[0])
    }
    for (const [r, sgn] of [[ra, -1], [rb, 1]] as [V3[], number][]) {
      const nn = cross3(sub3(r[1], r[0]), sub3(r[2], r[0]))
      if ((nn[0] * t[0] + nn[1] * t[1] + nn[2] * t[2]) * sgn > 0) white.quad(r[0], r[1], r[2], r[3])
      else white.quad(r[3], r[2], r[1], r[0])
    }
  }
}
function sub3(a: V3, b: V3): V3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }
function cross3(a: V3, b: V3): V3 { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] }

// ── The turned slab: grey fascia, pale vaulted top. ──
{
  const ca = Math.cos(43 * D), sa = Math.sin(43 * D)
  const W = (u: number, v: number): XY => [u * ca - v * sa, u * sa + v * ca]
  const U0 = -58, U1 = 60, V0 = -44, V1 = 48, BOT = BOX - 1.5
  const top = (u: number) => 47.6 - 0.00148 * (u - 20) ** 2
  const us = Array.from({ length: 13 }, (_, i) => U0 + ((U1 - U0) * i) / 12)
  const P = (u: number, v: number, z: number): V3 => { const [x, y] = W(u, v); return [x, y, z] }
  const nTop = (u: number): V3 => {
    const g = -2 * 0.00148 * (u - 20), l = Math.hypot(g, 1)
    return [(-g * ca) / l, (-g * sa) / l, 1 / l]
  }
  for (let i = 0; i < us.length - 1; i++) {
    const u0 = us[i], u1 = us[i + 1]
    // Vaulted top, smooth across u. Lip 0.5 m in from the fascia edge.
    const a = P(u0, V0, top(u0)), b = P(u1, V0, top(u1)), c = P(u1, V1, top(u1)), d = P(u0, V1, top(u0))
    roof.tri(a, b, c, undefined, undefined, undefined, [nTop(u0), nTop(u1), nTop(u1)])
    roof.tri(a, c, d, undefined, undefined, undefined, [nTop(u0), nTop(u1), nTop(u0)])
    // South-east and north-west fascias.
    silver.quad(P(u0, V0, BOT), P(u1, V0, BOT), P(u1, V0, top(u1)), P(u0, V0, top(u0)))
    silver.quad(P(u1, V1, BOT), P(u0, V1, BOT), P(u0, V1, top(u0)), P(u1, V1, top(u1)))
  }
  // South-west and north-east fascias.
  silver.quad(P(U0, V1, BOT), P(U0, V0, BOT), P(U0, V0, top(U0)), P(U0, V1, top(U0)))
  silver.quad(P(U1, V0, BOT), P(U1, V1, BOT), P(U1, V1, top(U1)), P(U1, V0, top(U1)))
}

// ── Box facades: street-level glass bays, the dark triangles, the glass corner. ──
{
  const faces: [XY, XY][] = [[[-73.9, 70], [-77, -47.2]], [[-1.8, 68.6], [-73.9, 70]], [[72.7, 65.1], [10, 68.3]]]
  for (const [a, b] of faces) {
    edgePanels(glass, a, b, STREET + 0.6, STREET + 10, { group: 10, gap: 0, bay: 16, pier: 6, margin: 8 })
    // Triangles near the top, every ~16 m, flush.
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L, nx = ty * 0.06, ny = -tx * 0.06
    const k = Math.floor((L - 10) / 16)
    for (let i = 0; i <= k; i++) {
      const s = (L - k * 16) / 2 + i * 16
      const c: XY = [a[0] + tx * s + nx, a[1] + ty * s + ny]
      glass.tri([c[0] - tx * 2.6, c[1] - ty * 2.6, BOX - 6.2], [c[0] + tx * 2.6, c[1] + ty * 2.6, BOX - 6.2], [c[0], c[1], BOX - 2.4])
    }
  }
  // The glass corner on the south-west diagonal (Barera's west view).
  edgePanels(glass, [-44.1, -48.4], [-24.5, -77.7], STREET + 0.6, BOX - 1.2, { group: 17, gap: 0, bay: 34, pier: 0, margin: 1 })
  edgePanels(glass, [-77, -47.2], [-44.1, -48.4], STREET + 0.6, BOX - 1.2, { group: 17, gap: 0, bay: 30, pier: 0, margin: 8 })
}

const WHITE = { ...finish('sfa-white', 0xf0efea), floodlight: (p: V3, n: V3) => (p[2] > STREET && n[2] < 0.7 ? 0.75 : 0) }
await save('atl-state-farm-arena', 'State Farm Arena', [
  { part: precast, material: finish('sfa-precast', 0xcbb69d) },
  { part: glass, material: PALETTE.window },
  { part: white, material: WHITE },
  { part: silver, material: finish('sfa-grey', 0x8a9199) },
  { part: roof, material: finish('sfa-roof', 0xd2d5d7) },
  { part: red, material: finish('neon-sfa-red', 0xc4373a) },
], { height: 47.6, anchor: [33.757234, -84.396365], bearing: 0 })
