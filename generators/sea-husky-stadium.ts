/**
 * Husky Stadium (1920; rebuilt 2011-13 by 360 Architecture), University of
 * Washington, Seattle: procedural, CC0-1.0.
 * bun generators/sea-husky-stadium.ts
 *
 * Map frame: x along the field towards the open east end and Union Bay, y
 * across it towards the north stand, z up, metres; bearing 16 (the field and
 * both roofs' edges run at 106 degrees in the lidar). The origin is the
 * middle of the field; y = 0 is the field, the lowest ground the stadium
 * touches (9.7 m NAVD88). The ground outside stands 5-12 m higher on the
 * north, south and west, so the outer walls sink into it there.
 *
 * Form: a horseshoe of pale aluminium benches round the field, open to the
 * east; a tall stand along each sideline, each under a big flat cantilevered
 * roof 55-60 m up, held on deep steel trusses that show under the roof and
 * in the open band above each stand's back wall; a band of suites between
 * the lower bowl and each upper deck; a concourse rim round the west end;
 * low east end-zone seats and the video board beyond them.
 *
 * Measured (USGS 3DEP WA_KingCo_1_2021, 1 m surface model):
 * - the field 120 x 71 m; the lower bowl rising to 7 m (south), 10 m
 *   (north) and 17-19 m (west end), the west rim 25-28 m and 25-28 m deep;
 * - the south roof: inner edge 58.5 m south of the centre line at mid-field
 *   and 52 m at its ends, outer edge 109.5 / 103 m (a gentle bow), x -73..71;
 *   56.2 m high at the inner edge rising to 59.7 m at the back, the back
 *   rounding down to about 52 m;
 * - the north roof: inner edge 72 m north (67 m at the ends), outer edge
 *   122 / 117 m, x -62..70; 54.5 m at the inner edge rising to 58.7 m;
 * - the corner blocks 19-23 m; the east seats rising 4 to 13 m over
 *   x 62..88; the video board 36 m wide, top 26.5 m, at x 95-99.
 * Published: capacity 70,138 (OSM, Wikipedia "Husky Stadium"); the 2013
 * rebuild kept the 1987 north upper deck and its roof.
 * From photos: the roofs' pale fascia and dark trussed undersides, the
 * truss band above the south stand's back wall, the suites band, the pale
 * benches, the grey concrete.
 * Estimated: everything under the roofs (upper deck rakes from 20-22 m up
 * to 44-47 m, back walls to 42-46 m, the suites band), the truss spacing
 * (16 m) and their depth, the board's base.
 * Left out: the field and track (the map's), lettering and the purple seat
 * blocks (signage/colour detail), light towers, stairs and the steel frame
 * of the south stand's east end, which is drawn as a closed end.
 * OSM: relation/3389103 (building=stadium) is the stands' outline, sharing
 * its outer ways with relation/5636648 (leisure=stadium, not a building) and
 * with the field as its inner ring; the model covers it. No other building
 * or building:part lies inside.
 *
 * Photos: /tmp/city/sea/work/sea-husky-stadium/credits.txt.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

const concrete = new Part(), seats = new Part(), roof = new Part(), fascia = new Part(), steel = new Part(), win = new Part()

/** A planar polygon facing `n`, fanned (convex only). */
function poly(p: Part, P: V3[], n: V3) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const Q = dot(f, n) >= 0 ? P : [...P].reverse()
  for (let i = 1; i < Q.length - 1; i++) p.tri(Q[0], Q[i], Q[i + 1])
}
/** Ear-clip a simple 2D polygon; returns index triples, counter-clockwise. */
function earcut(P: XY[]): number[][] {
  const area = P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0)
  const idx = P.map((_, i) => i)
  if (area < 0) idx.reverse()
  const out: number[][] = []
  const crs = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let k = 0; k < idx.length; k++) {
      const a = idx[(k + idx.length - 1) % idx.length], b = idx[k], c = idx[(k + 1) % idx.length]
      if (crs(P[a], P[b], P[c]) <= 1e-9) continue
      const inside = idx.some((o) => o !== a && o !== b && o !== c &&
        crs(P[a], P[b], P[o]) >= 0 && crs(P[b], P[c], P[o]) >= 0 && crs(P[c], P[a], P[o]) >= 0)
      if (inside) continue
      out.push([a, b, c]); idx.splice(k, 1); cut = true; break
    }
    if (!cut) break
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]])
  return out
}
/** A vertical prism over any simple ring. */
function prism(p: Part, ring: XY[], z0: number, z1: number, top = true) {
  const area = ring.reduce((s, a, i) => { const b = ring[(i + 1) % ring.length]; return s + a[0] * b[1] - b[0] * a[1] }, 0)
  const R = area < 0 ? [...ring].reverse() : ring
  for (let i = 0; i < R.length; i++) {
    const a = R[i], b = R[(i + 1) % R.length]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) for (const [a, b, c] of earcut(R)) p.tri([R[a][0], R[a][1], z1], [R[b][0], R[b][1], z1], [R[c][0], R[c][1], z1])
}

// ------------------------------------------------------------------ plan ---
const FX = 60, FY = 35.5                   // the field's half sizes
const bowS = (x: number) => 0.0016 * x * x // the south stand bows outward
const bowN = (x: number) => -0.0012 * x * x

// The lower bowl: a strip from the field's edge up to its top edge, round
// the north side, the west end and the south side. The west end's top is a
// rounded curve about C; along the sides it meets the stands' front faces.
const C: XY = [-55, 0]
const H_S = 7, H_N = 10, H_W = 18
const Y_S = -56, Y_N = 67
{
  type Row = { f: V3; t: V3 }
  const rows: Row[] = []
  const edgeHit = (phi: number): XY => {
    // the ray from C at angle phi to the field's rectangle (x >= -FX)
    const dx = Math.cos(phi), dy = Math.sin(phi)
    const tx = (-FX - C[0]) / dx
    const ty = (Math.sign(dy) * FY) / (dy || 1e-9)
    const t = Math.min(tx > 0 ? tx : Infinity, ty > 0 ? ty : Infinity)
    return [C[0] + dx * t, C[1] + dy * t]
  }
  const topHit = (phi: number): XY => {
    const ay = Math.sin(phi) > 0 ? Y_N : -Y_S, ax = 50, n = 3
    const c = Math.cos(phi), s = Math.sin(phi)
    return [C[0] + ax * Math.sign(c) * Math.abs(c) ** (2 / n), C[1] + ay * Math.sign(s) * Math.abs(s) ** (2 / n)]
  }
  // north side, east to west
  for (let x = 68; x > C[0] + 0.1; x -= 12.3) rows.push({ f: [x, FY, 0.3], t: [x, Y_N + bowN(x), H_N] })
  // west end
  const NW = 18
  for (let k = 0; k <= NW; k++) {
    const phi = Math.PI / 2 + (k / NW) * Math.PI
    const w = Math.cos(phi) ** 2
    const h = (Math.sin(phi) > 0 ? H_N : H_S) * (1 - w) + H_W * w
    const f = edgeHit(phi), t = topHit(phi)
    const tb: XY = [t[0], t[1] + (Math.sin(phi) > 0 ? bowN(t[0]) : bowS(t[0])) * (1 - w)]
    rows.push({ f: [f[0], f[1], 0.3], t: [tb[0], tb[1], h] })
  }
  for (let x = C[0] + 12.3; x <= 68.1; x += 12.3) rows.push({ f: [x, -FY, 0.3], t: [x, Y_S + bowS(x), H_S] })
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i], b = rows[i + 1]
    const mid: V3 = [(a.f[0] + b.f[0]) / 2, (a.f[1] + b.f[1]) / 2, 0]
    const out: V3 = [(a.t[0] + b.t[0]) / 2 - mid[0], (a.t[1] + b.t[1]) / 2 - mid[1], 0]
    // seats face the field: up and inward
    poly(seats, [a.f, b.f, b.t, a.t], [-out[0], -out[1], 40])
    // the low wall at the field's edge
    poly(concrete, [[a.f[0], a.f[1], 0], [b.f[0], b.f[1], 0], b.f, a.f], [-out[0], -out[1], 0])
  }
  // The open ends of the side strips at the east.
  for (const s of [1, -1]) {
    const x = 68, yT = s > 0 ? Y_N + bowN(x) : Y_S + bowS(x), h = s > 0 ? H_N : H_S
    poly(concrete, [[x, s * FY, 0], [x, yT, 0], [x, yT, h], [x, s * FY, 0.3]], [1, 0, 0])
  }

  // The west rim: a concourse ring from the bowl's top out to its outer
  // wall, its roof at 27 m, between the two stands.
  const ring = (phi: number, ax: number, ayN: number, ayS: number): XY => {
    const c = Math.cos(phi), s = Math.sin(phi), n = 3
    const ay = s > 0 ? ayN : ayS
    return [C[0] + ax * Math.sign(c) * Math.abs(c) ** (2 / n), C[1] + ay * Math.sign(s) * Math.abs(s) ** (2 / n)]
  }
  const RZ = 27
  const NR = 16, PH0 = Math.PI * 0.62, PH1 = Math.PI * 1.38
  for (let k = 0; k < NR; k++) {
    const p0 = PH0 + ((PH1 - PH0) * k) / NR, p1 = PH0 + ((PH1 - PH0) * (k + 1)) / NR
    const w0 = Math.cos(p0) ** 2, w1 = Math.cos(p1) ** 2
    const i0 = ring(p0, 50, Y_N, -Y_S), i1 = ring(p1, 50, Y_N, -Y_S)
    const o0 = ring(p0, 78, 82, 80), o1 = ring(p1, 78, 82, 80)
    const h0 = H_N * (1 - w0) + H_W * w0, h1 = H_N * (1 - w1) + H_W * w1
    // roof
    poly(concrete, [[i0[0], i0[1], RZ], [o0[0], o0[1], RZ], [o1[0], o1[1], RZ], [i1[0], i1[1], RZ]], [0, 0, 1])
    // outer wall, down to the field's level
    poly(concrete, [[o0[0], o0[1], 0], [o1[0], o1[1], 0], [o1[0], o1[1], RZ], [o0[0], o0[1], RZ]], [o0[0] - C[0], o0[1], 0])
    // a glazed concourse band on the outer wall, above the hill outside
    {
      const off = (p: XY, k: number): V3 => {
        const d = Math.hypot(p[0] - C[0], p[1]) || 1
        return [p[0] + ((p[0] - C[0]) / d) * 0.07, p[1] + (p[1] / d) * 0.07, k]
      }
      const a = [o0[0] + (o1[0] - o0[0]) * 0.08, o0[1] + (o1[1] - o0[1]) * 0.08] as XY
      const b = [o0[0] + (o1[0] - o0[0]) * 0.92, o0[1] + (o1[1] - o0[1]) * 0.92] as XY
      poly(win, [off(a, 16.5), off(b, 16.5), off(b, 24), off(a, 24)], [o0[0] - C[0], o0[1], 0])
    }
    // inner face over the bowl's top: the concourse's glazed front
    poly(concrete, [[i0[0], i0[1], h0 - 0.5], [i1[0], i1[1], h1 - 0.5], [i1[0], i1[1], RZ], [i0[0], i0[1], RZ]], [C[0] - i0[0], -i0[1], 0])
    poly(win, [[i0[0] + 0.0, i0[1], h0 + 1.5], [i1[0], i1[1], h1 + 1.5], [i1[0], i1[1], RZ - 2], [i0[0], i0[1], RZ - 2]].map(
      (p) => [p[0] + (C[0] - p[0]) * 0.002, p[1] - p[1] * 0.002, p[2]] as V3), [C[0] - i0[0], -i0[1], 0])
  }
  // ends of the rim
  for (const ph of [PH0, PH1]) {
    const i = ring(ph, 50, Y_N, -Y_S), o = ring(ph, 78, 82, 80)
    const s = Math.sin(ph) > 0 ? 1 : -1
    poly(concrete, [[i[0], i[1], 0], [o[0], o[1], 0], [o[0], o[1], RZ], [i[0], i[1], RZ]], [0, s, 0])
  }
}

// ------------------------------------------------------- the two stands ---
type Stand = {
  s: 1 | -1                 // +1 north, -1 south
  x0: number; x1: number    // the body's ends
  rx0: number; rx1: number  // the roof's ends
  yFront: number; zBowl: number; zDeck0: number
  yDeckTop: number; zDeckTop: number
  yBack: number; zBack: number; bands: XY[]
  yIn: number; yOut: number; zIn: number; zOut: number
  bow: (x: number) => number
}
const stands: Stand[] = [
  { s: -1, x0: -71, x1: 68, rx0: -76, rx1: 71, yFront: Y_S, zBowl: H_S, zDeck0: 20, yDeckTop: -99, zDeckTop: 45,
    yBack: -104, zBack: 38, bands: [[13, 21], [26, 34]], yIn: -58.5, yOut: -109.5, zIn: 56.2, zOut: 59.7, bow: bowS },
  { s: 1, x0: -60, x1: 68, rx0: -62, rx1: 71, yFront: Y_N, zBowl: H_N, zDeck0: 22, yDeckTop: 112, zDeckTop: 47,
    yBack: 117, zBack: 24, bands: [[9, 19]], yIn: 72, yOut: 122, zIn: 54.5, zOut: 58.7, bow: bowN },
]
for (const st of stands) {
  const { s } = st
  // The body's section in (y, z), extruded along x and bent to the bow.
  // Front: the suites band; the upper deck's rake; the back wall.
  const yS = st.yFront, ySu = st.yFront + s * 2.5
  const NSEG = 10
  const xs = Array.from({ length: NSEG + 1 }, (_, k) => st.x0 + ((st.x1 - st.x0) * k) / NSEG)
  const at = (x: number, y: number, z: number): V3 => [x, y + st.bow(x), z]
  const strip = (p: Part, ya: number, za: number, yb: number, zb: number, n: (x: number) => V3) => {
    for (let k = 0; k < NSEG; k++) {
      const xa = xs[k], xb = xs[k + 1]
      poly(p, [at(xa, ya, za), at(xb, ya, za), at(xb, yb, zb), at(xa, yb, zb)], n((xa + xb) / 2))
    }
  }
  const inward = (): V3 => [0, -s, 0]
  // suites band: a vertical concrete face with a broad glazed band
  strip(concrete, yS, st.zBowl - 0.5, yS, st.zDeck0, inward)
  for (let k = 0; k < NSEG; k++) {
    const xa = xs[k] + 0.8, xb = xs[k + 1] - 0.8
    poly(win, [at(xa, yS - s * 0.06, st.zBowl + 1.4), at(xb, yS - s * 0.06, st.zBowl + 1.4), at(xb, yS - s * 0.06, st.zDeck0 - 2.2), at(xa, yS - s * 0.06, st.zDeck0 - 2.2)], inward())
  }
  // a ledge over it, then the upper deck's rake
  strip(concrete, yS, st.zDeck0, ySu, st.zDeck0, () => [0, 0, 1])
  strip(seats, ySu, st.zDeck0, st.yDeckTop, st.zDeckTop, () => [0, -s * 25, 40])
  // the top of the deck to the back wall
  strip(concrete, st.yDeckTop, st.zDeckTop, st.yBack, st.zDeckTop, () => [0, 0, 1])
  // back wall: concrete with storey-grouped glazing up to zBack; above it
  // the glazed truss band, set back, up to the roof
  strip(concrete, st.yBack, 0, st.yBack, st.zBack, () => [0, s, 0])
  strip(concrete, st.yBack, st.zBack, st.yBack - s * 2, st.zBack, () => [0, 0, 1])
  strip(win, st.yBack - s * 2, st.zBack, st.yBack - s * 2, st.zOut - 4.5, () => [0, s, 0])
  for (let k = 0; k < NSEG; k++) {
    const xa = xs[k] + 1.2, xb = xs[k + 1] - 1.2
    for (const [z0, z1] of st.bands)
      poly(win, [at(xa, st.yBack + s * 0.06, z0), at(xb, st.yBack + s * 0.06, z0), at(xb, st.yBack + s * 0.06, z1), at(xa, st.yBack + s * 0.06, z1)], [0, s, 0])
  }
  // ends of the body
  for (const [x, dir] of [[st.x0, -1], [st.x1, 1]] as XY[]) {
    const yb2 = st.yBack - s * 2
    const sec: XY[] = [[yS, 0], [st.yBack, 0], [st.yBack, st.zBack], [yb2, st.zBack], [yb2, st.zDeckTop], [st.yDeckTop, st.zDeckTop], [ySu, st.zDeck0], [yS, st.zDeck0]]
    for (const [a, b, c] of earcut(sec)) {
      poly(concrete, [at(x, ...sec[a]), at(x, ...sec[b]), at(x, ...sec[c])], [dir, 0, 0])
    }
    // the open steel under the upper deck's rake, dark
    const o = dir * 0.08
    poly(steel, [at(x + o, ySu + s * 4, st.zDeck0 + 1.5), at(x + o, yb2 - s * 2, st.zDeck0 + 1.5), at(x + o, yb2 - s * 2, st.zDeckTop - 3)], [dir, 0, 0])
  }

  // The roof: a slab bowed in plan, rising from the inner edge to the back,
  // its back edge rounding down; pale on top and at the fascia, the dark
  // trussed underside below.
  const NR = 14, T = 1.6
  const rxs = Array.from({ length: NR + 1 }, (_, k) => st.rx0 + ((st.rx1 - st.rx0) * k) / NR)
  // across the roof: inner edge to the back, then the rounded back edge
  const across: [number, number][] = [] // (y offset from inner edge, z)
  const depth = Math.abs(st.yOut - st.yIn) - 5
  for (let j = 0; j <= 4; j++) across.push([depth * (j / 4), st.zIn + (st.zOut - st.zIn) * (j / 4)])
  // the back edge: a deep pale fascia, rounded over at the top
  const R = 4, DROP = 9
  for (let j = 1; j <= 4; j++) {
    const a = (j / 4) * (Math.PI / 2)
    across.push([depth + R * Math.sin(a), st.zOut - R + R * Math.cos(a)])
  }
  across.push([depth + R, st.zOut - DROP])
  const P = (x: number, j: number, dz = 0): V3 => at(x, st.yIn + s * across[j][0], across[j][1] + dz)
  for (let k = 0; k < NR; k++) {
    const xa = rxs[k], xb = rxs[k + 1]
    for (let j = 0; j < across.length - 1; j++) {
      const top = j < 4 ? roof : fascia
      poly(top, [P(xa, j), P(xb, j), P(xb, j + 1), P(xa, j + 1)], j < 4 ? [0, 0, 1] : [0, s, 0.3])
    }
    // underside, flat at the inner edge's height less the slab, to the back
    const yi = st.yIn, yo = st.yIn + s * (depth + R)
    poly(steel, [at(xa, yi, st.zIn - T), at(xb, yi, st.zIn - T), at(xb, yo, st.zOut - DROP), at(xa, yo, st.zOut - DROP)], [0, 0, -1])
    // fascia along the inner edge
    poly(fascia, [at(xa, yi, st.zIn - T), at(xb, yi, st.zIn - T), at(xb, yi, st.zIn + 0.2), at(xa, yi, st.zIn + 0.2)], [0, -s, 0])
  }
  // the roof's ends
  for (const [x, dir] of [[st.rx0, -1], [st.rx1, 1]] as XY[]) {
    const sec: XY[] = [[st.yIn, st.zIn - T], ...across.map(([d, z]) => [st.yIn + s * d, z] as XY)]
    // fan from the underside's back corner
    const ring = sec.slice(0, -1)
    const ctr = sec[sec.length - 1]
    for (let i = 0; i < ring.length - 1; i++) poly(fascia, [at(x, ...ctr), at(x, ...ring[i]), at(x, ...ring[i + 1])], [dir, 0, 0])
    poly(fascia, [at(x, ...ctr), at(x, ...ring[ring.length - 1]), at(x, ...ring[0])], [dir, 0, 0])
  }
  // The trusses: deep steel fins under the roof, every 16 m, from the top
  // of the back wall out to the inner edge.
  const NT = Math.round((st.rx1 - st.rx0 - 8) / 16)
  for (let k = 0; k <= NT; k++) {
    const x = st.rx0 + 4 + ((st.rx1 - st.rx0 - 8) * k) / NT
    const yb = st.yBack, yi = st.yIn + s * 1
    const zt = (y: number) => st.zIn - T + (st.zOut - DROP - st.zIn + T) * Math.abs(y - st.yIn) / (depth + R) - 0.2
    const tri: XY[] = [[yb, st.zBack], [yb, zt(yb)], [yi, zt(yi)]]
    const w = 1.1
    for (const side of [-1, 1]) poly(steel, tri.map(([y, z]) => at(x + side * w, y, z)), [side, 0, 0])
    // the fin's lower chord and back
    for (let i = 0; i < 3; i++) {
      const a = tri[i], b = tri[(i + 1) % 3]
      const n: V3 = [0, -(b[1] - a[1]) * s, (b[0] - a[0]) * s]
      poly(steel, [at(x - w, ...a), at(x + w, ...a), at(x + w, ...b), at(x - w, ...b)], i === 0 ? [0, s, 0] : n)
    }
  }
}

// --------------------------------------------- corner blocks (19-23 m) ---
prism(concrete, [[-100, 64], [-60, 68], [-60, 100], [-92, 100]], 0, 21)
prism(concrete, [[-102, -60], [-71, -57], [-71, -100], [-95, -100]], 0, 21)

// ------------------------------------------------- the east end ---
{
  // low seats rising away from the field
  const x0 = 62, x1 = 88, y0 = -34, y1 = 30
  poly(seats, [[x0, y0, 3.5], [x0, y1, 3.5], [x1, y1, 13], [x1, y0, 13]], [-1, 0, 3])
  poly(concrete, [[x0, y0, 0], [x0, y1, 0], [x0, y1, 3.5], [x0, y0, 3.5]], [-1, 0, 0])
  poly(concrete, [[x1, y0, 0], [x1, y1, 0], [x1, y1, 13], [x1, y0, 13]], [1, 0, 0])
  for (const [y, n] of [[y0, -1], [y1, 1]]) poly(concrete, [[x0, y, 0], [x1, y, 0], [x1, y, 13], [x0, y, 3.5]], [0, n, 0])
  // the video board on its base block
  prism(concrete, [[93, -18], [99, -18], [99, 10], [93, 10]], 0, 13)
  prism(concrete, [[95, -22], [98.5, -22], [98.5, 14], [95, 14]], 13, 26.5)
  poly(steel, [[94.94, -21, 14], [94.94, 13, 14], [94.94, 13, 25.5], [94.94, -21, 25.5]], [-1, 0, 0])
}

// ---------------------------------------------------------------- output ---
const parts = [
  { part: concrete, material: finish('husky-concrete', 0xd9d5cc) },
  { part: seats, material: finish('husky-seats', 0xbcc1c6) },
  { part: roof, material: PALETTE.roof },
  { part: fascia, material: PALETTE.trim },
  { part: steel, material: finish('husky-steel', 0x4f555d) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Husky Stadium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 16, elevation: 0, height: 60,
})
await Bun.write(new URL('../models/sea-husky-stadium.glb', import.meta.url), glb)
console.log(`sea-husky-stadium.glb: ${triangles} triangles, ${glb.length} bytes`)
