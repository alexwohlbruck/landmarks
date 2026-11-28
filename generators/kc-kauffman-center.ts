/**
 * Kauffman Center for the Performing Arts (Moshe Safdie, 2011), 1601
 * Broadway, Kansas City, Missouri — original procedural geometry, CC0-1.0.
 * bun generators/kc-kauffman-center.ts
 *
 * Map frame: x east, y north, z up, metres, bearing 0. Origin: the OSM
 * outline's centroid (-94.5874227, 39.0941188), on the lowest ground under
 * the footprint (the street along the south front: lidar 272.9 m, map
 * terrain ≈ 273.0 m). The site falls about 8 m from the north plaza to the
 * south street; the north feet of the shells stand on the plaza at +8 m and
 * their walls run on down to z = 0 inside the hill.
 *
 * Identity, from the photos:
 *  1. two halls — the Muriel Kauffman Theatre (west, larger) and Helzberg
 *     Hall (east) — each a stack of nested arched shells: parallel vertical
 *     north–south slices, tallest in the middle of the hall and stepping
 *     down both ways, each slice's curved back in stainless steel and the
 *     step between it and the next smaller one a pale precast face shaped
 *     like an arch (Little Mountain 5; Rex Hughes; Antony-22; Gascoigne);
 *  2. the arches lean: steep, almost vertical at the north foot on the
 *     plaza, a long gentler slope to the south where the lobby roof meets
 *     them (lidar);
 *  3. the outermost faces are big pale walls with groups of vertical vent
 *     slits — the theatre's west wall, cut on the diagonal of the outline,
 *     and Helzberg's east end (Stephen Edmonds; Antony-22);
 *  4. the Brandmeyer Great Hall: a glass lobby along the whole south side,
 *     a 20 m glass wall with leaning mullions on a pale arcaded base, under
 *     a glass roof sloping up to the shells (Jeff Julian, from the south;
 *     Stephen Edmonds, from the south-west). The lobby faces south, toward
 *     the Crossroads and Liberty Memorial; the shells' backs face downtown.
 *
 * Evidence:
 *  - OSM way/175514558 (building=yes, levels 5, "Kauffman Center for
 *    Performing Arts", wikidata Q6378664): the outline. Its north edge steps
 *    once per shell, which gives every slice's x range and north foot here.
 *    way/1117627944 is a separate small building 50 m south; untouched.
 *  - Lidar, measured: USGS 3DEP MO_FEMANRCS_1_2020 (2020 flight), 1 m grid
 *    (lidar.py grid, half 75 m). Heights below are above the south street
 *    (ground_min + 3.0 m). The steel returns almost nothing (specular), so
 *    crests come from the rim of returns around each hall: theatre crest
 *    50.7 at x −30, y 12–15, falling to 46.6 (x −12), 39 (x −6) and, to the
 *    west, 47 (x −42), 41 (x −48), 33 (x −55); Helzberg 44 at x 33, y 18,
 *    falling to 36–37 at x 21 and x 51. North profile at x −30: 48 at y 24,
 *    plaza (+8) at y 38. Lobby roof: 20 at the south wall, rising about
 *    0.35 m per metre north (23 → 32 m over y −42 … −16 at x −30); between
 *    the halls it peaks at ≈32 near y 6 and comes down north to ≈11 at
 *    y 30. The west wall's top: 23–25 at the south-west corner, 30–33 at
 *    y −20 … −10, down to 22 at y 18.
 *  - Terrain: Mapterhorn z15 (terrain.ts grid): 273.0 m at the south-east
 *    corner, about 5.5 m higher along the north edge (lidar says 8: the
 *    terrain is smoothed across the plaza wall).
 *  - Estimated: the arch shapes between the measured points (a quarter
 *    ellipse to the north foot, a parabola to the south); the slice
 *    boundaries in the lobby; the arcade base (4 m) and mullion spacing,
 *    from Stephen Edmonds's photo.
 *  - Simplified: the steel panel joints, the rims of the pale faces, the
 *    cable fans at the lobby's ends, the balconies seen through the glass.
 *
 * Night: the lobby's glass walls glow (the hall is lit and open to the
 * south at night: Jeff Julian's photo), as `window`; the lobby roof is
 * `glass` and stays dark; the shells are unlit.
 *
 * Photos (evidence):
 *  - Kauffman Center for the Performing Arts.jpg, Little Mountain 5,
 *    CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Kauffman_Center_for_the_Performing_Arts.jpg
 *  - Kauffman Center.jpg, Hayden Gascoigne, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Kauffman_Center.jpg
 *  - Kauffman and the Crossroads (15856169773).jpg, Jeff Julian, CC BY 2.0,
 *    https://commons.wikimedia.org/wiki/File:Kauffman_and_the_Crossroads_(15856169773).jpg
 *  - Kauffman Center Kansas City 2025.jpg, Antony-22, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Kauffman_Center_Kansas_City_2025.jpg
 *  - Kauffman Center for Performing Arts 2.jpg, Rex Hughes, CC BY-SA 4.0,
 *    https://commons.wikimedia.org/wiki/File:Kauffman_Center_for_Performing_Arts_2.jpg
 *  - Kauffman Center for the Performing Arts - panoramio.jpg, Stephen
 *    Edmonds, CC BY-SA 3.0,
 *    https://commons.wikimedia.org/wiki/File:Kauffman_Center_for_the_Performing_Arts_-_panoramio.jpg
 *  - Kauffman center for the performing arts (16852146719).jpg, Dean
 *    Hochman, CC BY 2.0 (close-up of the steel and precast faces),
 *    https://commons.wikimedia.org/wiki/File:Kauffman_center_for_the_performing_arts_(16852146719).jpg
 *  - USGS NAIP orthophoto (public domain) for the plan. No commercial
 *    imagery.
 *
 * Doubts: the slices are drawn parallel (north–south); the theatre's
 * western slices may fan a little in reality. Inside the lobby the shells
 * are cut off under the roof, which hides them; with an opaque roof that
 * is never seen.
 */
import { Part, writeGlb, cross, sub, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const PLAZA = 8 // north plaza above the south street (lidar)
const EAVE = 20 // lobby glass wall height (lidar)
const ROOF_SLOPE = 0.35 // lobby roof rise per metre north (lidar)
const ROOF_MAX = 33 // the lobby roof's top, between the halls (lidar 33–34)
const LEAN = 2.5 // the glass front leans out this far at the eave (lidar: roof returns ≈2–4 m south of the OSM base line; Edmonds's photo)

/**
 * One slice: x range; crest height h at y = yc; north foot at y = yn on
 * the plaza; k, the south fall of the arch (z = h − k·(yc − y)²).
 */
type Shell = { x0: number; x1: number; h: number; yc: number; yn: number; k: number }

// Muriel Kauffman Theatre, west to east. Crest heights and their y from the
// rim of lidar returns over each slice; x ranges where the crest steps;
// north feet from the OSM outline's steps; k so the arch meets the west
// wall's measured top or the lobby roof where the lidar shows.
const THEATRE: Shell[] = [
  { x0: -60, x1: -58, h: 22, yc: 10, yn: 17, k: 0.05 },
  { x0: -58, x1: -55, h: 30, yc: 3, yn: 21, k: 0.03 },
  { x0: -55, x1: -51.5, h: 36.5, yc: 4, yn: 25, k: 0.025 },
  { x0: -51.5, x1: -47.5, h: 42, yc: 4, yn: 29, k: 0.021 },
  { x0: -47.5, x1: -43.5, h: 45.5, yc: 7, yn: 32.5, k: 0.018 },
  { x0: -43.5, x1: -40, h: 47.5, yc: 8, yn: 35, k: 0.0125 },
  { x0: -40, x1: -36.5, h: 49, yc: 9, yn: 37, k: 0.03 },
  { x0: -36.5, x1: -32.5, h: 50.2, yc: 11, yn: 37.5, k: 0.03 },
  { x0: -32.5, x1: -27.5, h: 50.9, yc: 13.5, yn: 37.5, k: 0.03 },
  { x0: -27.5, x1: -22.5, h: 50.4, yc: 14, yn: 37.5, k: 0.03 },
  { x0: -22.5, x1: -17.5, h: 49, yc: 14, yn: 36.5, k: 0.03 },
  { x0: -17.5, x1: -13.5, h: 46.8, yc: 13, yn: 36, k: 0.03 },
  { x0: -13.5, x1: -8.5, h: 43.6, yc: 11, yn: 34.5, k: 0.03 },
  { x0: -8.5, x1: -3.5, h: 39.3, yc: 7, yn: 33.5, k: 0.03 },
  { x0: -3.5, x1: 4, h: 33.9, yc: 2, yn: 30, k: 0.03 },
  { x0: 4, x1: 10, h: 33.4, yc: 2, yn: 25, k: 0.03 },
]
// Helzberg Hall, west to east.
const HELZBERG: Shell[] = [
  { x0: 15.5, x1: 19.5, h: 33, yc: 6, yn: 31, k: 0.06 },
  { x0: 19.5, x1: 23.5, h: 38, yc: 10, yn: 33, k: 0.06 },
  { x0: 23.5, x1: 27.5, h: 41.2, yc: 14, yn: 35.5, k: 0.06 },
  { x0: 27.5, x1: 32.5, h: 44, yc: 17, yn: 37.5, k: 0.06 },
  { x0: 32.5, x1: 38.5, h: 44.3, yc: 18.5, yn: 38.5, k: 0.064 },
  { x0: 38.5, x1: 42.5, h: 43.4, yc: 18, yn: 37.5, k: 0.06 },
  { x0: 42.5, x1: 46.5, h: 41.4, yc: 15, yn: 36.5, k: 0.06 },
  { x0: 46.5, x1: 51.5, h: 38.2, yc: 11, yn: 35, k: 0.06 },
  { x0: 51.5, x1: 55, h: 33.1, yc: 4, yn: 34, k: 0.06 },
]
const SHELLS = [...THEATRE, ...HELZBERG]
const GAP: [number, number] = [10, 15.5] // open between the halls north of the lobby
const GAP_N = 0 // the lobby's north wall in the gap (lidar)

// The south front (OSM), west to east.
const FRONT: [number, number][] = [[-40, -38], [-28, -39], [-15, -39], [-4, -40], [7, -38], [18, -36], [29, -32], [42, -28], [54, -21], [55, -21]]
const LOBBY_X0 = -40, LOBBY_X1 = 55
const frontY = (x: number) => {
  for (let i = 0; i < FRONT.length - 1; i++) {
    const [ax, ay] = FRONT[i], [bx, by] = FRONT[i + 1]
    if (x <= bx || i === FRONT.length - 2) return ay + ((Math.min(Math.max(x, ax), bx) - ax) / (bx - ax)) * (by - ay)
  }
  return FRONT[0][1]
}
/** The theatre's west wall: OSM's diagonal from (−60, 14) to (−40, −38). */
const westWallY = (x: number) => 14 - 2.6 * (x + 60)
/** The lobby roof: up from the south eave, flat on top between the halls. */
const eaveY = (x: number) => frontY(x) - LEAN
const roofZ = (x: number, y: number) => Math.min(EAVE + ROOF_SLOPE * (y - eaveY(x)), ROOF_MAX)

/** A shell's arch height at y. */
function shellZ(s: Shell, y: number) {
  if (y >= s.yc) {
    const u = (y - s.yc) / (s.yn - s.yc)
    return u >= 1 ? PLAZA : PLAZA + (s.h - PLAZA) * Math.sqrt(Math.max(0, 1 - u * u))
  }
  return Math.max(0, s.h - s.k * (s.yc - y) ** 2)
}

/** Where a slice ends to the south on the plane x: the west wall, or where it dives under the lobby roof. */
function southCut(s: Shell, x: number, lobby: boolean) {
  if (!lobby) return westWallY(x)
  for (let y = s.yc; y > frontY(x); y -= 0.25) if (shellZ(s, y) < roofZ(x, y)) return y
  return frontY(x)
}
const inLobby = (s: Shell) => (s.x0 + s.x1) / 2 > LOBBY_X0

const N_S = 8, N_N = 10 // arch samples south and north of the crest
/** The profile of a slice on the plane x: arch points (y, z, ny, nz) from the south cut to the north foot. */
function profile(s: Shell, x: number) {
  const ys = southCut(s, x, inLobby(s))
  const pts: [number, number, number, number][] = []
  const yc = Math.max(ys, s.yc)
  for (let i = 0; i < N_S; i++) {
    const y = ys + ((yc - ys) * i) / N_S
    const dz = 2 * s.k * (s.yc - y) // dz/dy on the south side
    const l = Math.hypot(1, dz)
    pts.push([y, shellZ(s, y), -dz / l, 1 / l])
  }
  const a = s.yn - s.yc, b = s.h - PLAZA
  const t0 = Math.asin(Math.min(1, Math.max(0, (yc - s.yc) / a)))
  for (let i = 0; i <= N_N; i++) {
    const t = t0 + ((Math.PI / 2 - t0) * i) / N_N
    const ny = b * Math.sin(t), nz = a * Math.cos(t), l = Math.hypot(ny, nz) || 1
    pts.push([s.yc + a * Math.sin(t), PLAZA + b * Math.cos(t), ny / l, nz / l])
  }
  return { ys, pts }
}

// --- geometry -----------------------------------------------------------------
const steel = new Part(), precast = new Part(), roof = new Part(), wall = new Part(), louvre = new Part()

const area = (a: V3, b: V3, c: V3) => { const n = cross(sub(b, a), sub(c, a)); return Math.hypot(n[0], n[1], n[2]) }
/** A triangle, skipped when degenerate; with smooth normals when given. */
function tri(p: Part, a: V3, b: V3, c: V3, n?: V3[]) {
  if (area(a, b, c) < 1e-6) return
  p.tri(a, b, c, undefined, undefined, undefined, n)
}
function quad(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  tri(p, a, b, c, n && [n[0], n[1], n[2]])
  tri(p, a, c, d, n && [n[0], n[2], n[3]])
}

// Each slice's steel back is rounded across as well as along: toward its
// lower neighbour it curves down to a narrow pale rim (RIM) above that
// neighbour's back, so the halls read as nested steel shells with thin
// stepped edges (Little Mountain 5; Rex Hughes), not as a stack of arches.
// The outermost faces (the theatre's west end, Helzberg's east end) stay
// full pale walls.
const RIM = 0.8, M = 3
for (const hall of [THEATRE, HELZBERG]) {
  const crest = hall.reduce((c, s, k) => (s.h > hall[c].h ? k : c), 0)
  hall.forEach((s, k) => {
    const west = k <= crest && k > 0 ? hall[k - 1] : null // lower neighbour on that side
    const east = k >= crest && k < hall.length - 1 ? hall[k + 1] : null
    const W = s.x1 - s.x0
    const span = west && east ? W / 2 : W
    /** How far down toward the neighbour the back has come at x (0 = full, 1 = rim). */
    const drop = (x: number): [number, Shell | null] => {
      if (west && x - s.x0 <= span + 1e-9) return [1 - Math.sin(((x - s.x0) / span) * (Math.PI / 2)), west]
      if (east && s.x1 - x <= span + 1e-9) return [1 - Math.sin(((s.x1 - x) / span) * (Math.PI / 2)), east]
      return [0, null]
    }
    const xs = Array.from({ length: M + 1 }, (_, c) => s.x0 + (W * c) / M)
    const cols = xs.map((x) => {
      const P = profile(s, x), [f, nb] = drop(x)
      const pts = P.pts.map(([y, z]): V3 => {
        const low = nb ? Math.min(z, shellZ(nb, y) + RIM) : z
        return [x, y, z - f * (z - low)]
      })
      return { ys: P.ys, pts }
    })
    const V = (c: number, i: number) => cols[Math.max(0, Math.min(M, c))].pts[Math.max(0, Math.min(cols[0].pts.length - 1, i))]
    const nrm = (c: number, i: number): V3 => {
      const n = cross(sub(V(c + 1, i), V(c - 1, i)), sub(V(c, i + 1), V(c, i - 1)))
      const l = Math.hypot(n[0], n[1], n[2]) || 1
      return n[2] < 0 ? [-n[0] / l, -n[1] / l, -n[2] / l] : [n[0] / l, n[1] / l, n[2] / l]
    }
    const n = cols[0].pts.length
    for (let c = 0; c < M; c++) {
      for (let i = 0; i < n - 1; i++)
        quad(steel, V(c, i), V(c + 1, i), V(c + 1, i + 1), V(c, i + 1), [nrm(c, i), nrm(c + 1, i), nrm(c + 1, i + 1), nrm(c, i + 1)])
      // the north foot, down from the plaza into the hill
      quad(steel, [xs[c], s.yn, PLAZA], [xs[c + 1], s.yn, PLAZA], [xs[c + 1], s.yn, 0], [xs[c], s.yn, 0])
      // the south cut: the west wall, or hidden under the lobby roof
      const a = cols[c], b = cols[c + 1]
      quad(precast, [xs[c], a.ys, 0], [xs[c + 1], b.ys, 0], [xs[c + 1], b.ys, b.pts[0][2]], [xs[c], a.ys, a.pts[0][2]])
    }
    // The side faces: a narrow rim where the back has come down, a full
    // pale wall at the ends of each hall.
    for (const [c, isEast] of [[0, false], [M, true]] as const) {
      const P = cols[c], x = xs[c]
      const ring: V3[] = [[x, P.ys, 0], ...P.pts, [x, s.yn, 0]]
      for (let i = 1; i < ring.length - 1; i++)
        if (isEast) tri(precast, ring[0], ring[i + 1], ring[i])
        else tri(precast, ring[0], ring[i], ring[i + 1])
    }
  })
}

// The lobby roof, a ruled surface over each slice's column from the front
// to just inside the shells, and over the gap between the halls.
const ROWS = 6
const columns: [number, number, (x: number) => number][] = [
  ...SHELLS.filter(inLobby).map((s): [number, number, (x: number) => number] =>
    [s.x0, s.x1, (x: number) => southCut(s, x, true) + 1.0]),
  [GAP[0], GAP[1], () => GAP_N],
]
for (const [x0, x1, north] of columns) {
  const xs = [x0, ...FRONT.map(([x]) => x).filter((x) => x > x0 && x < x1), x1]
  for (let c = 0; c < xs.length - 1; c++) {
    const xa = xs[c], xb = xs[c + 1]
    const at = (x: number, r: number): V3 => {
      const y = eaveY(x) + ((north(x) - eaveY(x)) * r) / ROWS
      return [x, y, roofZ(x, y)]
    }
    for (let r = 0; r < ROWS; r++) quad(roof, at(xa, r), at(xb, r), at(xb, r + 1), at(xa, r + 1))
  }
}
// The lobby's north wall in the gap, glazed onto the court between the halls.
{
  const za = roofZ(GAP[0], GAP_N), zb = roofZ(GAP[1], GAP_N)
  quad(wall, [GAP[1], GAP_N, 0], [GAP[0], GAP_N, 0], [GAP[0], GAP_N, za], [GAP[1], GAP_N, zb])
}
// The glass front, along the OSM south edge, and the east end.
for (let i = 0; i < FRONT.length - 1; i++) {
  const [ax, ay] = FRONT[i], [bx, by] = FRONT[i + 1]
  quad(wall, [ax, ay, 0], [bx, by, 0], [bx, by - LEAN, EAVE], [ax, ay - LEAN, EAVE])
}
{
  const last = HELZBERG[HELZBERG.length - 1], yN = southCut(last, LOBBY_X1, true)
  const y0 = frontY(LOBBY_X1)
  quad(wall, [LOBBY_X1, y0, 0], [LOBBY_X1, yN, 0], [LOBBY_X1, yN, roofZ(LOBBY_X1, yN)], [LOBBY_X1, y0 - LEAN, EAVE])
}

/** A box from a to b (its axis), w wide along `side` and d deep along `out`, centred on the axis. */
function beam(p: Part, a: V3, b: V3, side: V3, out: V3, w: number, d: number) {
  const corner = (o: V3, i: number): V3 => {
    const sw = (i === 1 || i === 2 ? 1 : -1) * (w / 2), sd = (i >= 2 ? 1 : -1) * (d / 2)
    return [o[0] + side[0] * sw + out[0] * sd, o[1] + side[1] * sw + out[1] * sd, o[2] + side[2] * sw + out[2] * sd]
  }
  const ra = [0, 1, 2, 3].map((i) => corner(a, i)), rb = [0, 1, 2, 3].map((i) => corner(b, i))
  const c: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
  const face = (q: V3[]) => {
    const n = cross(sub(q[1], q[0]), sub(q[2], q[0])), o = sub(q[0], c)
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] >= 0) quad(p, q[0], q[1], q[2], q[3])
    else quad(p, q[3], q[2], q[1], q[0])
  }
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; face([ra[i], ra[j], rb[j], rb[i]]) }
  face(ra); face(rb)
}

// The pale arcaded base under the glass (≈4.5 m, Stephen Edmonds's photo):
// a lintel band and piers every ≈6 m, standing just proud of the glass.
const BASE = 4.6
for (let i = 0; i < FRONT.length - 1; i++) {
  const [ax, ay] = FRONT[i], [bx, by] = FRONT[i + 1]
  const L = Math.hypot(bx - ax, by - ay)
  if (L < 2) continue
  const t: V3 = [(bx - ax) / L, (by - ay) / L, 0], o: V3 = [t[1], -t[0], 0]
  const P = (u: number, z: number, d: number): V3 => [ax + t[0] * u + o[0] * d, ay + t[1] * u + o[1] * d, z]
  beam(precast, P(0, BASE - 1.1, 0.6), P(L, BASE - 1.1, 0.6), [0, 0, 1], o, 1.1 * 2, 1.2)
  const n = Math.max(1, Math.round(L / 6))
  for (let k = 0; k <= n; k++) {
    if (k === 0 && i > 0) continue
    const u = Math.min(L - 0.7, Math.max(0.7, (L * k) / n))
    beam(precast, P(u, 0, 0.6), P(u, BASE - 1.1, 0.6), t, o, 1.4, 1.2)
  }
}

// Leaning steel mullions over the glass, every ≈6.5 m, tops a little east.
{
  const total = FRONT.slice(1).reduce((a, [x, y], i) => a + Math.hypot(x - FRONT[i][0], y - FRONT[i][1]), 0)
  const at = (u: number): [V3, V3] => { // point on the front and its tangent at arc length u
    let acc = 0
    for (let i = 0; i < FRONT.length - 1; i++) {
      const [ax, ay] = FRONT[i], [bx, by] = FRONT[i + 1], L = Math.hypot(bx - ax, by - ay)
      if (u <= acc + L || i === FRONT.length - 2) {
        const f = (u - acc) / L
        return [[ax + (bx - ax) * f, ay + (by - ay) * f, 0], [(bx - ax) / L, (by - ay) / L, 0]]
      }
      acc += L
    }
    throw new Error('unreachable')
  }
  const n = Math.round(total / 6.5)
  for (let k = 1; k < n; k++) {
    const u = (total * k) / n
    const [p0, t] = at(u - 1.2), [p1] = at(u + 1.2)
    const o: V3 = [t[1], -t[0], 0]
    const a: V3 = [p0[0] + o[0] * 0.35, p0[1] + o[1] * 0.35 - (LEAN * BASE) / EAVE, BASE]
    const b: V3 = [p1[0] + o[0] * 0.35, p1[1] + o[1] * 0.35 - LEAN, EAVE - 0.2]
    beam(steel, a, b, t, o, 0.45, 0.5)
  }
  // The eave: a steel band along the top of the glass.
  for (let i = 0; i < FRONT.length - 1; i++) {
    const [ax, ay] = FRONT[i], [bx, by] = FRONT[i + 1], L = Math.hypot(bx - ax, by - ay)
    const t: V3 = [(bx - ax) / L, (by - ay) / L, 0], o: V3 = [t[1], -t[0], 0]
    beam(steel, [ax - t[0] * 0.3, ay - t[1] * 0.3 - LEAN, EAVE - 0.4], [bx + t[0] * 0.3, by + t[1] * 0.3 - LEAN, EAVE - 0.4], [0, 0, 1], o, 1.0, 1.0)
  }
}

// Vent slits in the pale end walls: two groups on the theatre's west wall
// (Stephen Edmonds) and two on Helzberg's east end (Rex Hughes; Antony-22).
{
  const wt: V3 = (() => { const l = Math.hypot(1, -2.6); return [1 / l, -2.6 / l, 0] })()
  const wo: V3 = [wt[1], -wt[0], 0] // outward, west-south-west
  const slits = (cx: number, z0: number, z1: number, n: number) => {
    for (let k = 0; k < n; k++) {
      const x = cx + (k - (n - 1) / 2) * 1.0 * wt[0]
      const y = westWallY(x)
      const p: V3 = [x + wo[0] * 0.06, y + wo[1] * 0.06, 0]
      const a: V3 = [p[0] - wt[0] * 0.25, p[1] - wt[1] * 0.25, 0], b: V3 = [p[0] + wt[0] * 0.25, p[1] + wt[1] * 0.25, 0]
      quad(louvre, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    }
  }
  slits(-51, 14, 20, 4)
  slits(-45.5, 15, 22, 5)
  for (const [yc, n] of [[4, 4], [11, 4]] as const)
    for (let k = 0; k < n; k++) {
      const y = yc + (k - (n - 1) / 2) * 0.9, x = LOBBY_X1 + 0.06
      quad(louvre, [x, y - 0.25, 21], [x, y + 0.25, 21], [x, y + 0.25, 27], [x, y - 0.25, 27])
    }
}

// --- write ------------------------------------------------------------------
const lit = (p: V3, n: V3) => (n[2] > 0.8 ? 0.1 : 0.55) // the shells are floodlit from the ground
const parts: Array<{ part: Part; material: MaterialSpec }> = [
  { part: steel, material: { ...finish('stainless-steel', 0xb8c2cb, 0.4), floodlight: lit } },
  { part: precast, material: { ...finish('precast', 0xebe2d1), floodlight: lit } },
  { part: roof, material: PALETTE.glass },
  { part: wall, material: { ...PALETTE.window, color: 0x93abbd } },
  { part: louvre, material: finish('louvre', 0x4a4f57) },
]
const triangles = parts.reduce((a, { part }) => a + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const height = Math.max(...SHELLS.map((s) => s.h))
const glb = writeGlb('Kauffman Center for the Performing Arts', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height, bearing: 0,
})
await Bun.write(new URL('../models/kc-kauffman-center.glb', import.meta.url), glb)
console.log(`kc-kauffman-center.glb: ${triangles} triangles, ${glb.length} bytes`)
