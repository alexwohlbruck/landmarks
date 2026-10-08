/**
 * TRON Lightcycle / Run, Tomorrowland, Magic Kingdom: the undulating canopy
 * over the outdoor run, the track and the show building. Procedural, CC0-1.0.
 * bun generators/wdw-tron-lightcycle-run.ts   (REPORT=1 for the element table)
 *
 * Map frame: x east, y north, z up, metres; bearing 0. The park frame is
 * equirectangular about 28.4195 N, 81.5800 W (`origin`); the model's origin
 * is the anchor below, on the ground. Built with ./coaster-kit.ts.
 *
 * Plan. OSM draws only the outdoor run, oneway in ride order: the launch
 * straight way/1283031001 (63 m) out of the show building's south-west wall,
 * then way/1283031000 (174 m), the loop under the canopy's west lobe and back
 * east along its north arm into the building. Laid over the USGS NAIP
 * orthophoto (public domain) both sit where the track shows through the
 * canopy's open hook. The indoor run (the rest of the published 966 m) is
 * not mapped and can't be seen: a short stand-in loop at ground level closes
 * the circuit inside the show building, hidden by its walls.
 *
 * Canopy. OSM's outline (way/1089770163, building=roof) is offset and rough
 * against NAIP, so the outline here is traced over NAIP: a sock-shaped shell,
 * a broad west lobe round an open hook, and an arm east to the building. The
 * shell is a height field over that outline: high in the middle, its edge
 * rising in arches between feet that come down to short legs, as the photos
 * show; the arches are kept clear of the track where it runs out under them.
 * Shallow diagonal cushions follow NAIP's rib pattern. It is drawn as the
 * pale panelled roof it reads as by day (it is translucent ETFE), with the
 * dark teal band along its edge.
 *
 * Profile: Vekoma, LSM launch (RCDB 15286), 3,169 ft (966 m) of track, 78 ft
 * (23.8 m) high, 59.3 mph (95 km/h). Wikipedia's layout: a right turn out of
 * the station to the launch, out of the building under the canopy, back into
 * the building for the indoor grid. Positions are metres along the OSM
 * polyline from the building wall (237 m outdoors):
 *
 *   launch straight, climbing out of the building over the walkways   s 0-63
 *   out through the canopy's hook, under the west lobe                 s 63-110
 *   the hairpin round the west end, cresting at about 15 m             s 110-150
 *   down the north arm and back into the show building                 s 150-237
 *
 * Published: length, height, speed, the launch and the order. Estimated: every
 * height (the track runs over the elevated walkways, OSM layer 2 over their
 * layer 1; the crest from the photos), the canopy's heights (crown about 22 m
 * over the west lobe, from the photos against the track and people), the
 * show building's 22 m (no height in OSM). Invented: the indoor loop.
 *
 * Photos: "Tron Lightcycle Run" (Paigeboyd02, CC BY-SA 4.0) for the
 * Florida canopy from the Tomorrowland side; "Tron Lightcycle Power Run
 * (Magic Kingdom) 3" and "4" (Wacky Windjammer, CC BY-SA 4.0) for the show
 * building and the track and structure; "Guests riding TRON Lightcycle Run"
 * (BallofyaRn, CC0). The Shanghai twin, same canopy design: "TRON Lightcycle
 * Power Run, attraction exterior" (Jedi94, CC BY-SA 4.0) and "Tron
 * Lightcycles Power Run (29510933592)", "(29586661836)" and others (Jeremy
 * Thompson, CC BY 2.0). Plan: USGS NAIP (public domain).
 *
 * Style: the show building is drawn dark slate, as briefed (in daylight its
 * panels are mid grey with darker bands); the track white, its columns grey.
 */
import { buildCoaster } from './coaster-kit'
import { Part, type V3 } from './mesh'
import { finish } from './palette'

type XY = [number, number]

// Outdoor run from OSM (launch straight, then the loop), then the indoor stand-in.
const CHAIN: XY[] = [
  [302.3, 63.1], [241.7, 46.1], [235.5, 44.4], [226.6, 42.7], [218.9, 41.8], [212.4, 41.9], [206.0, 43.6], [198.8, 47.1],
  [193.7, 53.4], [190.8, 60.9], [189.9, 67.3], [190.4, 72.8], [192.8, 76.5], [198.3, 79.3], [203.8, 80.4], [208.3, 80.4],
  [215.2, 80.1], [220.2, 78.8], [226.1, 76.0], [233.1, 71.8], [238.9, 68.3], [244.3, 65.9], [249.7, 63.8], [256.2, 62.3],
  [263.8, 62.1], [271.3, 63.0], [284.4, 66.8],
  // Inside the show building (invented, hidden).
  [296, 74], [310, 84], [326, 92], [341, 90], [348, 80], [342, 70], [328, 65], [314, 64],
]
// The show building (way/804994339).
const BUILDING: XY[] = [
  [360.6, 146.1], [356.4, 143.9], [347.9, 160.8], [341.7, 158.0], [334.8, 171.3], [263.8, 135.8], [267.3, 128.5], [256.3, 122.8],
  [279.2, 77.1], [284.4, 66.8], [285.8, 64.0], [287.0, 64.5], [299.9, 70.6], [302.3, 63.1], [305.7, 52.9], [320.9, 56.9],
  [321.1, 56.0], [329.4, 58.7], [329.1, 60.4], [351.7, 67.4], [381.6, 82.9], [385.9, 95.9],
]
// The canopy's outline, traced over NAIP, clockwise from the west tip.
const CANOPY: XY[] = [
  [180.5, 63.7], [184.3, 72.3], [190.8, 85.3], [194.1, 91.3], [200.6, 92.9], [212.5, 91.3], [225.5, 89.1], [236.3, 85.3],
  [243.9, 79.9], [249.3, 77.8], [258.0, 79.9], [266.7, 82.1], [274.2, 82.6], [281.8, 81.0], [290.5, 74.5], [299.2, 66.9],
  [304.6, 61.5], [305.7, 55.0], [302.4, 50.7], [293.8, 50.7], [282.9, 52.3], [272.1, 52.8], [261.2, 54.5], [250.4, 55.5],
  [240.7, 58.2], [234.2, 62.6], [228.8, 68.0], [223.3, 71.2], [215.8, 73.4], [209.2, 74.0], [206.0, 71.2], [206.0, 65.8],
  [209.2, 59.3], [215.8, 52.8], [223.3, 49.6], [230.9, 50.7], [240.7, 51.7], [248.2, 49.6], [250.4, 46.3], [247.2, 43.1],
  [238.5, 39.8], [228.8, 37.7], [217.9, 35.0], [209.2, 36.0], [199.5, 39.8], [190.8, 46.3], [184.3, 52.8], [181.1, 57.2],
]

const CANOPY_MAT = finish('tron-canopy', 0xeef0f1)
const EDGE_MAT = finish('tron-edge', 0x3d7f99)

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subv = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossv = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** Point in polygon (even-odd). */
function inside(p: XY, poly: XY[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** Bowyer–Watson Delaunay triangulation; returns index triples. */
function delaunay(P: XY[]): [number, number, number][] {
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1])
  const mx = Math.min(...xs), my = Math.min(...ys), d = Math.max(Math.max(...xs) - mx, Math.max(...ys) - my) * 20
  const pts: XY[] = [...P, [mx - d, my - d], [mx + 2 * d, my - d], [mx - d, my + 2 * d]]
  const n = P.length
  type T = { a: number; b: number; c: number; x: number; y: number; r2: number }
  const circ = (a: number, b: number, c: number): T => {
    const [ax, ay] = pts[a], [bx, by] = pts[b], [cx, cy] = pts[c]
    const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D
    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D
    return { a, b, c, x: ux, y: uy, r2: (ax - ux) ** 2 + (ay - uy) ** 2 }
  }
  let tris: T[] = [circ(n, n + 1, n + 2)]
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[i]
    const bad: T[] = [], keep: T[] = []
    for (const t of tris) ((px - t.x) ** 2 + (py - t.y) ** 2 < t.r2 ? bad : keep).push(t)
    const edges = new Map<string, [number, number]>()
    for (const t of bad) for (const [u, v] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
      const k = u < v ? `${u},${v}` : `${v},${u}`
      if (edges.has(k)) edges.delete(k)
      else edges.set(k, [u, v])
    }
    for (const [u, v] of edges.values()) keep.push(circ(u, v, i))
    tris = keep
  }
  return tris.filter((t) => t.a < n && t.b < n && t.c < n).map((t) => [t.a, t.b, t.c])
}

await buildCoaster({
  name: 'TRON Lightcycle / Run',
  out: '../models/wdw-tron-lightcycle-run.glb',
  origin: [-81.58, 28.4195],
  chain: CHAIN,
  anchor: [280, 98],
  // Magic Kingdom's grade is level here.
  ground: { x0: 150, y0: 0, step: 50, rows: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], base: 30 },
  profile: [
    { name: 'leaving the building, launching', s: 0, z: 5.5, r: 40 },
    { name: 'launch straight, over the walkways', s: 40, z: 8.5 },
    { name: 'out through the hook', s: 66, z: 9 },
    { name: 'under the west lobe', s: 100, z: 12 },
    { name: 'crest round the west end', s: 130, z: 15 },
    { name: 'north arm', s: 175, z: 10 },
    { name: 'into the show building', s: 237, z: 7 },
    { name: 'indoor, down to the floor', s: 262, z: 1 },
    { name: 'indoor stand-in, station', s: 318, z: 1 },
    { name: 'launch, in', s: 335, z: 1.2 },
  ],
  lift: [318, 338],
  liftHead: 1,
  launches: [{ from: 338, to: 30, z: 8, head: 36, name: 'launch' }],
  brakes: [{ from: 280, to: 318, z: 1, head: 0.5 }],
  banks: [{ from: 340, to: 50, deg: 0, name: 'launch straight' }],
  losses: [0.008, 0.0006],
  track: { W: 2.2, RAIL: 0.45, DEPTH: 1.3, SPINE: 1.0 },
  station: { ring: BUILDING, posts: [], roofZ: 22 },
  stationWalls: true,
  colours: {
    deck: ['tron-track', 0xe8eaec], spine: 'deck', supports: ['tron-steel', 0xa7afb8],
    station: ['tron-show-building', 0x535c68],
  },
  supportR: [0.45, 0.55, 0.65],
  meta: { height: 23.8, trackLength: 966 },
  extras: (kit) => {
    const shell = new Part(), edge = new Part()
    const ring = CANOPY.map((q) => kit.toModel(q))
    const n = ring.length
    // Densified outline, with arclength.
    const B: { p: XY; t: number; nrm: XY }[] = []
    let T = 0
    for (let i = 0; i < n; i++) {
      const a = ring[i], b = ring[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / 2.2))
      for (let j = 0; j < k; j++) B.push({ p: [a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k], t: T + (L * j) / k, nrm: [0, 0] })
      T += L
    }
    // Outward normals (the ring runs clockwise, so outward is to the left of travel).
    B.forEach((q, i) => {
      const a = B[(i - 1 + B.length) % B.length].p, b = B[(i + 1) % B.length].p
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
      q.nrm = [-dy / l, dx / l]
    })
    // The track in plan with its height, to keep the arches clear of it.
    const track: V3[] = []
    for (let s = 0; s < 250; s += 1.5) track.push(kit.at(s).p)
    // Edge height along the outline: feet every ~30 m, arches between.
    // A foot never stands where the track passes under the edge.
    const nearTrack = (p: XY) => track.reduce((m, q) => Math.min(m, Math.hypot(q[0] - p[0], q[1] - p[1])), Infinity)
    const feet: number[] = []
    const FOOT = 48
    for (let t = 6; t < T; t += 1) {
      if (feet.length && t - feet[feet.length - 1] < FOOT) continue
      const q = B.reduce((m, b) => (Math.abs(b.t - t) < Math.abs(m.t - t) ? b : m))
      if (nearTrack(q.p) < 4.5) continue
      feet.push(t)
    }
    if (T - feet[feet.length - 1] + feet[0] < FOOT * 0.6) feet.pop()
    const EF = 1.2, EA = 16
    const edgeZ = (t: number) => {
      let a = feet[feet.length - 1] - T, b = feet[0]
      for (let i = 0; i < feet.length; i++) {
        const f0 = feet[i], f1 = i + 1 < feet.length ? feet[i + 1] : feet[0] + T
        if (t >= f0 && t < f1) { a = f0; b = f1 }
      }
      if (t < feet[0]) { a = feet[feet.length - 1] - T; b = feet[0] }
      const u = (t - a) / (b - a), span = b - a
      return EF + (Math.min(EA, 2 + span * 0.42) - EF) * (4 * u * (1 - u)) ** 0.45
    }
    // Clearance over the track where it passes under the edge.
    const need = B.map((q) => {
      let z = 0
      for (const p of track) if (Math.hypot(p[0] - q.p[0], p[1] - q.p[1]) < 3.5) z = Math.max(z, p[2] + 4.5)
      return z
    })
    // Each crossing lifts the edge in a smooth parabola either side of it (2.2 m per sample).
    const edgeS = B.map((q, i) => {
      let z = edgeZ(q.t)
      for (let k = -8; k <= 8; k++) { const r = need[(i + k + B.length) % B.length]; if (r) z = Math.max(z, r - 0.09 * (k * 2.2) ** 2) }
      return z
    })
    // Interior points on a 3 m grid, clear of the outline.
    const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1])
    const P: XY[] = B.map((b) => b.p)
    const distB = (p: XY) => {
      let best = Infinity, bi = 0
      for (let i = 0; i < B.length; i++) {
        const a = B[i].p, b = B[(i + 1) % B.length].p
        const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1
        const u = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2))
        const d = Math.hypot(a[0] + dx * u - p[0], a[1] + dy * u - p[1])
        if (d < best) { best = d; bi = i + u }
      }
      return { d: best, i: bi }
    }
    const G = 2.4
    for (let x = Math.min(...xs) + 1; x < Math.max(...xs); x += G)
      for (let y = Math.min(...ys) + 1; y < Math.max(...ys); y += G) {
        const p: XY = [x + ((Math.round(y / G) % 2) * G) / 2, y]
        if (inside(p, ring) && distB(p).d > 1.6) P.push(p)
      }
    const info = P.map((p, k) => (k < B.length ? { d: 0, i: k } : distB(p)))
    // Local half-width: the largest boundary distance near each point.
    let Dloc = P.map((p) => {
      let m = 3
      P.forEach((q, k) => { if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 13) m = Math.max(m, info[k].d) })
      return m
    })
    // Smoothed, so the shell has no creases where the local width changes.
    for (let pass = 0; pass < 2; pass++) Dloc = P.map((p) => {
      let s = 0, w = 0
      P.forEach((q, k) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < 7) { s += Dloc[k] * (7 - d); w += 7 - d } })
      return s / w
    })
    // Crown: highest over the west lobe, lower along the arm to the building.
    const [wx] = kit.toModel([215, 0]), [ex] = kit.toModel([300, 0])
    const crown = (p: XY) => { const u = Math.max(0, Math.min(1, (p[0] - wx) / (ex - wx))); return 28 - 7 * u * u }
    // Cushions: pillows between ribs that cross the band, as NAIP shows them. The
    // ribs run across the loop's track, so a point's place along the band is
    // the distance along the loop of the nearest track point.
    const loop: { p: XY; s: number }[] = []
    for (let s = 63; s <= 237; s += 1) { const f = kit.at(s); loop.push({ p: [f.p[0], f.p[1]], s }) }
    const along = (p: XY) => loop.reduce((m, q) => (Math.hypot(q.p[0] - p[0], q.p[1] - p[1]) < Math.hypot(m.p[0] - p[0], m.p[1] - p[1]) ? q : m)).s
    const rib = (p: XY) => 0.5 * Math.sin((Math.PI * along(p)) / 7.5) ** 2
    // Each arch carries its own dome: the crown dips towards the feet, so the shell reads as a row of cushions.
    const eAvg = (p: XY) => { let s = 0, w = 0; B.forEach((b, i) => { const d = Math.hypot(b.p[0] - p[0], b.p[1] - p[1]); if (d < 18) { const wk = 1 / (d + 3); s += edgeS[i] * wk; w += wk } }); return w ? s / w : EA }
    const dome = (p: XY) => crown(p) - 0.45 * Math.max(0, EA - eAvg(p)) + 2.5 * Math.cos((2 * Math.PI * (along(p) - 95)) / 56)
    // Cushions: shallow pillows between diagonal ribs, as NAIP shows them.
    const edgeAt = (i: number) => { const a = Math.floor(i) % B.length, f = i - Math.floor(i); return edgeS[a] * (1 - f) + edgeS[(a + 1) % B.length] * f }
    const Z = P.map((p, k) => {
      // The rim height seen from here: a blend of the nearby rim, so the two
      // sides of a narrow arm (or a hook) don't meet in a crease.
      let E = edgeAt(info[k].i)
      if (k >= B.length) {
        let sw = 0, ws = 0
        B.forEach((b, i) => { const d = Math.hypot(b.p[0] - P[k][0], b.p[1] - P[k][1]); const w = Math.exp(-(d - info[k].d) / 2); if (w > 1e-3) { sw += edgeS[i] * w; ws += w } })
        E = sw / ws
      }
      const u = Math.min(1, info[k].d / Dloc[k])
      const C = Math.max(E + 2, dome(p))
      return E + (C - E) * (1 - (1 - u) ** 2.2) + rib(p) * Math.min(1, info[k].d / 3)
    })
    const V: V3[] = P.map((p, k) => [p[0], p[1], Z[k]])
    const tris = delaunay(P).filter(([a, b, c]) => {
      const cx = (P[a][0] + P[b][0] + P[c][0]) / 3, cy = (P[a][1] + P[b][1] + P[c][1]) / 3
      return inside([cx, cy], ring)
    })
    // Smooth normals.
    const N: V3[] = V.map(() => [0, 0, 0])
    const up = (a: number, b: number, c: number) => { const f = crossv(subv(V[b], V[a]), subv(V[c], V[a])); return f[2] >= 0 ? [a, b, c] : [a, c, b] }
    const T3 = tris.map(([a, b, c]) => up(a, b, c))
    for (const [a, b, c] of T3) { const f = crossv(subv(V[b], V[a]), subv(V[c], V[a])); for (const k of [a, b, c]) N[k] = add(N[k], f) }
    const Nn = N.map(unit), Nd = Nn.map((v) => [-v[0], -v[1], -v[2]] as V3)
    for (const [a, b, c] of T3) {
      shell.tri(V[a], V[b], V[c], undefined, undefined, undefined, [Nn[a], Nn[b], Nn[c]])
      shell.tri(V[a], V[c], V[b], undefined, undefined, undefined, [Nd[a], Nd[c], Nd[b]])
    }
    // The edge band: a fascia hanging 1.1 m from the rim, both faces, and a lip
    // on top running 1.2 m in from the rim.
    for (let i = 0; i < B.length; i++) {
      const j = (i + 1) % B.length, a = B[i], b = B[j]
      const za = edgeS[i], zb = edgeS[j]
      const A0: V3 = [a.p[0], a.p[1], za + 0.08], B0: V3 = [b.p[0], b.p[1], zb + 0.08]
      const A1: V3 = [a.p[0], a.p[1], za - 0.6], B1: V3 = [b.p[0], b.p[1], zb - 0.6]
      edge.quad(A1, B1, B0, A0)
      edge.quad(A0, B0, B1, A1)
      const inA: XY = [a.p[0] - a.nrm[0] * 0.9, a.p[1] - a.nrm[1] * 0.9], inB: XY = [b.p[0] - b.nrm[0] * 0.9, b.p[1] - b.nrm[1] * 0.9]
      const zIn = (q: XY, k: number) => {
        const E = edgeS[k], d = 0.9, D = Math.max(3, Dloc[k] ?? 6)
        const u = Math.min(1, d / D)
        return E + (Math.max(E + 2, dome(q)) - E) * (1 - (1 - u) ** 2.2) + 0.12
      }
      const Ai: V3 = [inA[0], inA[1], zIn(inA, i)], Bi: V3 = [inB[0], inB[1], zIn(inB, j)]
      const f = crossv(subv(B0, A0), subv(Ai, A0))
      if (f[2] >= 0) { edge.tri(A0, B0, Bi); edge.tri(A0, Bi, Ai) } else { edge.tri(A0, Bi, B0); edge.tri(A0, Ai, Bi) }
    }
    // A leg under each foot: a tapered column in the edge colour.
    for (const t of feet) {
      const k = B.reduce((m, b, i) => (Math.abs(b.t - t) < Math.abs(B[m].t - t) ? i : m), 0)
      const q = B[k], top: V3 = [q.p[0] - q.nrm[0] * 0.8, q.p[1] - q.nrm[1] * 0.8, edgeS[k] - 0.6]
      const foot: V3 = [q.p[0] + q.nrm[0] * 1.2, q.p[1] + q.nrm[1] * 1.2, -0.5]
      const ax = unit(subv(top, foot)), ref: V3 = [0, 0, 1]
      const u = unit(crossv(ax, Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : ref)), v = crossv(ax, u)
      const R0 = 0.55, R1 = 0.9, S = 8
      for (let s = 0; s < S; s++) {
        const a0 = (s / S) * 2 * Math.PI, a1 = ((s + 1) / S) * 2 * Math.PI
        const r = (c: V3, R: number, a: number): V3 => add(c, add([u[0] * Math.cos(a) * R, u[1] * Math.cos(a) * R, u[2] * Math.cos(a) * R], [v[0] * Math.sin(a) * R, v[1] * Math.sin(a) * R, v[2] * Math.sin(a) * R]))
        const nA = unit(add([u[0] * Math.cos(a0), u[1] * Math.cos(a0), u[2] * Math.cos(a0)], [v[0] * Math.sin(a0), v[1] * Math.sin(a0), v[2] * Math.sin(a0)]))
        const nB = unit(add([u[0] * Math.cos(a1), u[1] * Math.cos(a1), u[2] * Math.cos(a1)], [v[0] * Math.sin(a1), v[1] * Math.sin(a1), v[2] * Math.sin(a1)]))
        edge.tri(r(foot, R0, a0), r(foot, R0, a1), r(top, R1, a1), undefined, undefined, undefined, [nA, nB, nB])
        edge.tri(r(foot, R0, a0), r(top, R1, a1), r(top, R1, a0), undefined, undefined, undefined, [nA, nB, nA])
      }
    }
    if (process.env.REPORT) console.log(`canopy: z ${Math.min(...Z).toFixed(1)}-${Math.max(...Z).toFixed(1)}, Dloc max ${Math.max(...Dloc).toFixed(1)}, d max ${Math.max(...info.map((q) => q.d)).toFixed(1)}, edge ${Math.min(...edgeS).toFixed(1)}-${Math.max(...edgeS).toFixed(1)}; ${P.length} points, ${tris.length} cells, ${feet.length} feet, outline ${T.toFixed(0)} m`)
    return [{ part: shell, material: CANOPY_MAT }, { part: edge, material: EDGE_MAT }]
  },
})
