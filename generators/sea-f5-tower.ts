/**
 * F5 Tower (2017, Zimmer Gunsul Frasca), Seattle — original procedural
 * geometry, CC0-1.0.
 * bun generators/sea-f5-tower.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor (the OSM
 * outline's area centroid) on the lowest ground under the footprint, on the
 * alley side towards 4th Avenue (40.1 m NAVD88; 5th Avenue is ~13 m higher).
 * Placed at bearing 0, straight from OSM's local coordinates.
 *
 * Form: a light glass prism on a near-square plan set diagonally to the
 * street grid, folded like a crystal. Each corner bends outward once: the
 * west and east corners low down, the north and south corners just above
 * mid-height, so every face breaks into four triangles and the folds between
 * them, marked by bright stainless creases, run diagonally across the faces:
 * from the west and east roof corners down to the north and south bends,
 * across between the bends, and from the low bends down to the base. The
 * roof is two planes meeting on a ridge that rises to a peak at the west
 * corner. The body stands on a narrower glazed lobby with white columns.
 *
 * Sources
 * - OSM way/333212849 (outline; no parts): the plan, 39 x 37 m.
 * - Lidar (measured): USGS 3DEP WA_KingCo_1_2021, heights above the lowest
 *   ground under the footprint: roof corners west 211 m, south 196 m, east
 *   197.5 m, north 195 m; the centre of the roof (on the west–east ridge)
 *   204 m; the roof outline matches OSM's outline within ~1.5 m all round,
 *   which caps how far the bends may stand out.
 * - Published: 201 m, 44 storeys (Wikipedia, "F5 Tower").
 * - Photos (Wikimedia Commons): the crease pattern and the peak are read from
 *   photos from the west (two, past the Rainier Club), the south-east and
 *   from Elliott Bay; credits in the batch report.
 * Estimated: the heights of the bends (62 m and 108 m) and how far they
 *   stand out (1.2 m); the base inset (4 m) and the lobby height (30 m),
 *   counted from a street photo; floor lines every eight storeys.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishGlb } from './sea-columbia-center'

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A triangle wound to face `out`. */
function tri(part: Part, a: V3, b: V3, c: V3, out: V3) {
  if (dot(crs(sub(b, a), sub(c, a)), out) < 0) part.tri(a, c, b)
  else part.tri(a, b, c)
}

function build() {
  // Plan corners, local metres about the anchor (-122.3310654, 47.6052122).
  const CORNERS: Record<string, [number, number]> = { W: [-26.5, 5.8], S: [-7.0, -26.1], E: [26.5, -5.9], N: [6.9, 26.1] }
  const ROOF = { W: 211, S: 196, E: 197.5, N: 195 } as Record<string, number>
  // Bends: west and east low, north and south high.
  const BEND = { W: 62, E: 62, S: 108, N: 108 } as Record<string, number>
  const OUT = 1.2, BASE_IN = 4, ZB = 30, LOBBY_IN = 2.5
  const order = ['W', 'S', 'E', 'N'] // counter-clockwise from above
  const c0 = order.reduce((s, k) => [s[0] + CORNERS[k][0] / 4, s[1] + CORNERS[k][1] / 4], [0, 0])
  const radial = (k: string, d: number): [number, number] => {
    const [x, y] = CORNERS[k], v = unit([x - c0[0], y - c0[1], 0])
    return [x + v[0] * d, y + v[1] * d]
  }
  const top = (k: string): V3 => [...CORNERS[k], ROOF[k]] as V3
  const bend = (k: string): V3 => [...radial(k, OUT), BEND[k]] as V3
  const base = (k: string): V3 => [...radial(k, -BASE_IN), ZB] as V3

  const glass = new Part(), steel = new Part(), roof = new Part(), white = new Part(), floors = new Part()
  type Facet = [V3, V3, V3]
  const facets: { f: Facet; out: V3 }[] = []
  const creases: [V3, V3][] = []

  for (let i = 0; i < 4; i++) {
    const a = order[i], b = order[(i + 1) % 4]
    const L = BEND[a] < BEND[b] ? a : b, H = L === a ? b : a
    const mid: [number, number] = [(CORNERS[a][0] + CORNERS[b][0]) / 2, (CORNERS[a][1] + CORNERS[b][1]) / 2]
    const out = unit([mid[0] - c0[0], mid[1] - c0[1], 0])
    const fs: Facet[] = [
      [top(L), top(H), bend(H)],
      [top(L), bend(H), bend(L)],
      [bend(L), bend(H), base(H)],
      [bend(L), base(H), base(L)],
    ]
    for (const f of fs) { tri(glass, f[0], f[1], f[2], out); facets.push({ f, out }) }
    creases.push([top(L), bend(H)], [bend(L), bend(H)], [bend(L), base(H)])
  }

  // Bright creases: a strip each side of the fold, lying on its facet.
  const W = 0.6, LIFT = 0.07
  const onFacet = (e: [V3, V3]) => facets.filter(({ f }) => e.every((p) => f.some((q) => Math.hypot(...sub(p, q)) < 1e-6)))
  const strip = (e: [V3, V3], f: Facet, out: V3, width: number) => {
    const [p, q] = e, o = f.find((v) => Math.hypot(...sub(v, p)) > 1e-6 && Math.hypot(...sub(v, q)) > 1e-6)!
    const n0 = unit(crs(sub(f[1], f[0]), sub(f[2], f[0]))), n = dot(n0, out) < 0 ? ([-n0[0], -n0[1], -n0[2]] as V3) : n0
    const t = unit(sub(q, p)), toO = sub(o, p), d = unit(sub(toO, [t[0] * dot(toO, t), t[1] * dot(toO, t), t[2] * dot(toO, t)]))
    const P = add(p, n, LIFT), Q = add(q, n, LIFT)
    tri(steel, P, Q, add(Q, d, width), n)
    tri(steel, P, add(Q, d, width), add(P, d, width), n)
  }
  for (const e of creases) for (const { f, out } of onFacet(e)) strip(e, f, out, W)
  // the roof edge: a steel band down the top of each face
  for (let i = 0; i < 4; i++) {
    const e: [V3, V3] = [top(order[i]), top(order[(i + 1) % 4])]
    for (const { f, out } of onFacet(e)) strip(e, f, out, 0.9)
  }

  // A few faint floor lines, every eight storeys (~4.3 m each): where each facet crosses
  // the level, a pale band lying on the facet.
  const FLOOR = 4.3, EVERY = 8, BAND = 0.6
  for (let z = ZB + EVERY * FLOOR; z < 190; z += EVERY * FLOOR) {
    for (const { f, out } of facets) {
      const pts: V3[] = []
      for (let k = 0; k < 3; k++) {
        const p = f[k], q = f[(k + 1) % 3]
        if ((p[2] - z) * (q[2] - z) < 0) { const t = (z - p[2]) / (q[2] - p[2]); pts.push(add(p, sub(q, p), t)) }
      }
      if (pts.length !== 2) continue
      const n0 = unit(crs(sub(f[1], f[0]), sub(f[2], f[0]))), n = dot(n0, out) < 0 ? ([-n0[0], -n0[1], -n0[2]] as V3) : n0
      // the band's up direction within the facet
      const t = unit(sub(pts[1], pts[0])), up = unit(crs(n, t)), u = up[2] < 0 ? ([-up[0], -up[1], -up[2]] as V3) : up
      const k = BAND / 2 / Math.max(0.3, u[2])
      const [P, Q] = pts.map((p) => add(p, n, LIFT * 0.8))
      tri(floors, add(P, u, -k), add(Q, u, -k), add(Q, u, k), n)
      tri(floors, add(P, u, -k), add(Q, u, k), add(P, u, k), n)
    }
  }

  // Roof: two planes on the west–east ridge.
  tri(roof, top('W'), top('S'), top('E'), [0, 0, 1])
  tri(roof, top('W'), top('E'), top('N'), [0, 0, 1])
  // Soffit under the body, round the lobby.
  const ring = order.map(base)
  tri(white, ring[0], ring[1], ring[2], [0, 0, -1])
  tri(white, ring[0], ring[2], ring[3], [0, 0, -1])

  // Lobby: light glazing inset under the body, with white piers along each
  // face and a white column under each corner of the body.
  const lob = order.map((k) => radial(k, -BASE_IN - LOBBY_IN))
  const box = (cx: number, cy: number, ux: [number, number], hw: number, hd: number, z1: number) => {
    const vx: [number, number] = [-ux[1], ux[0]]
    const sq: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [cx + ux[0] * s * hw + vx[0] * t * hd, cy + ux[1] * s * hw + vx[1] * t * hd])
    for (let i = 0; i < 4; i++) {
      const a = sq[i], b = sq[(i + 1) % 4], out = unit([b[1] - a[1], a[0] - b[0], 0])
      tri(white, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], z1], out)
      tri(white, [a[0], a[1], 0], [b[0], b[1], z1], [a[0], a[1], z1], out)
    }
  }
  for (let i = 0; i < 4; i++) {
    const a = lob[i], b = lob[(i + 1) % 4], out = unit([b[1] - a[1], a[0] - b[0], 0])
    tri(glass, [a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], ZB], out)
    tri(glass, [a[0], a[1], 0], [b[0], b[1], ZB], [a[0], a[1], ZB], out)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: [number, number] = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    for (let k = 1; k < 3; k++) {
      const f = k / 3
      box(a[0] + (b[0] - a[0]) * f + out[0] * 0.4, a[1] + (b[1] - a[1]) * f + out[1] * 0.4, t, 0.8, 0.4, ZB)
    }
  }
  for (const k of order) {
    const [x, y] = radial(k, -BASE_IN - 1.3)
    box(x, y, [1, 0], 1.1, 1.1, ZB)
  }

  return finishGlb('sea-f5-tower', 'F5 Tower', [
    { part: glass, material: { ...PALETTE.window, color: 0xa7bdcf } },
    { part: steel, material: finish('f5-steel', 0xe8ecee, 0.45) },
    { part: roof, material: PALETTE.roof },
    // floor lines: barely paler than the glass, so the creases stay the only bold lines
    { part: floors, material: { name: 'window-2', color: 0xb7c8d6, roughness: 0.35 } },
    { part: white, material: PALETTE.trim },
  ], { bearing: 0, height: ROOF.W, replaces: ['way/333212849'] })
}

if (import.meta.main) {
  const { glb, triangles } = build()
  const out = process.argv[2] ?? new URL('../models/sea-f5-tower.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}
