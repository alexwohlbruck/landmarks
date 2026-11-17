/**
 * The Rady Shell at Jacobs Park, San Diego: the San Diego Symphony's
 * outdoor concert shell on Embarcadero Marina Park South (Tucker Sadler
 * Architects; shell by Soundforms, London; opened August 2021). A white
 * hood of overlapping petals, open to the lawn on the south-east, its thick
 * outer rim an oval leaning towards the audience; two low white-roofed
 * backstage wings with glass walls wrap its back on either side. Original
 * procedural geometry, CC0-1.0.  bun generators/sd-rady-shell.ts
 *
 * Frame: bearing 132, the direction the shell opens (the normal of the
 * rim's chord in OSM's shell part): +y runs from the back of the shell
 * out to the lawn (south-east), +x is 90 degrees clockwise from it (south-
 * west), the audience's left as they face the stage. x, y, z metres.
 * Origin = the area centroid of the outline,
 * way/1075932489 (-117.165881, 32.704786).
 *
 * Ground: the map's terrain (Mapterhorn) under the outline varies by about
 * 1.3 m, lowest at the tips of the wings (the park's edge), highest under
 * the stage; y = 0 is the lowest. The lawn at the rim's feet is about 1 m
 * above that, so the published height is taken from there: the rim's top
 * is at 18.4. Elevation 0.
 *
 * Evidence
 * - OSM: way/1075932489 (building=yes, amenity=theatre, the whole outline:
 *   shell and both wings), way/1156170543 (building:part, roof:shape=round,
 *   roof:direction=135, the shell itself; its height_ft=40 tag is below the
 *   published 57 ft, see doubts). The part's plan gives the rim's chord
 *   (40 m between its feet), how far the rim's top leans forward (its plan
 *   bows 4.8 m out from the chord), and the taper of the hood to 13 m wide
 *   at the back, 30 m behind the rim.
 * - NOT in the lidar: the shell was built in 2019-21, after the 2014
 *   CA_SanDiegoQL2 flight. USGS NAIP (2022 or later; it shows the shell)
 *   gives the plan: the hood's overlapping petals stepping down towards the
 *   back, the two wings' white roofs.
 * - Published: 57 ft (17.4 m) tall, 92 ft (28 m) wide at the front of the
 *   stage, a steel frame under 33,000 sq ft of fabric (newswire.com, "San
 *   Diego's New Iconic Landmark, The Rady Shell at Jacobs Park Set To Open
 *   August 6, 2021"; Lighting & Sound America, September 2021,
 *   lightingandsoundamerica.com/reprint/RadyShell.pdf); stage 3,865 sq ft
 *   (359 m²) (Wikipedia, "The Rady Shell at Jacobs Park").
 * - Photos (Wikimedia Commons), EVIDENCE:
 *   "Eric Lu performing at the Rady Shell, San Diego.jpg" (atramos, CC BY
 *     2.0; dusk, square on from the lawn: the oval rim about 2.2 times as
 *     wide as tall, the inner rings at about 0.86, 0.73, 0.6 of it, the
 *     stage opening at the back about 0.4 wide and 0.5 high; lit blue);
 *   "Symphony in Rady Shell at Jacobs Park 2.png" (RL0919, CC BY-SA 4.0;
 *     night, from the lawn's left: the rim's oblique oval, the hood's outer
 *     back on the right, the glass wing; lit red);
 *   "Symphony in Rady Shell at Jacobs Park 1.png" (RL0919, CC BY-SA 4.0;
 *     inside: the petals' edges as rings, the curved stage apron);
 *   "The Rady Shell at Jacobs Park.jpg" (BethViola, CC BY-SA 4.0; night,
 *     square on, lit violet);
 *   "Rady Shell Concert.jpg" (Use.gar11, CC BY-SA 4.0; inside, the rings).
 *   No licensed daylight exterior photo was found (Commons category, Commons
 *   search, geosearch; Openverse was down); every photo is of a concert at
 *   dusk or night, from the lawn.
 *
 * Estimated: the side profile of the hood (the rim's oval, its centre 42%
 * of its height up, from the published 92 ft between its feet and OSM's
 * 40 m width, checked against the photo square on; the hood falling to 8.7
 * at the back), the number of petals (four, from the aerial and the rings
 * inside, the first deepest) and their overlap; the rim's thickness (1.6 m)
 * and the petals' (0.45 m); the stage height (1.2 m above the lawn) and its
 * front curve;
 * the wings' height (6.5 m glass with a white vault to 9 m, scaled from
 * the photos against the rim). Invented: nothing beyond those simplifying
 * shapes.
 *
 * Night: the inside of the hood is washed in coloured light at every
 * concert (blue, violet, red in the photos). It carries a strong
 * _FLOODLIGHT inside and a weaker one on the outer rim, so it glows white
 * at night on the map; the wings' glass is `window`.
 *
 * Doubts: no daylight exterior photo, so the hood's outer back (seen from
 * the bay side) rests on the aerial alone; OSM's 40 ft against the
 * published 57 ft (the model follows the published height, which also fits
 * the rim's 2.2 width-to-height ratio over its 40 m chord in the photos).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, earcut, prism, report, type XY } from './sf-de-young'

const shell = new Part(), inner = new Part(), wingWhite = new Part(), glass = new Part(), deck = new Part()

const XC = -1 // the hood's axis
// The rim: an oval 40 m wide, its top 17.4 m (57 ft) above the lawn, which
// lies 1 m above y = 0; its centre stands 7.7 m up, so its sides bulge out
// past its feet, 28 m (92 ft, published) apart, as in the photos; its plane
// leans 7.6 m towards the lawn at the top.
const H0 = 18.4, A0 = 20, R0 = 0.714, Y0 = 13.5, LEAN0 = 7.6
const YB = -13.5 // the back
const HB = 8.7, AB = 6.5, RB = 0.15
const EDGES = [0, 0.4, 0.62, 0.82, 1], PETALS = EDGES.length - 1, GROW = 0.085, OVER = 0.03
const NPHI = 18, NT = 3

/** The hood's base family of oval arches, t = 0 at the rim, 1 at the back; u runs 0-1 from foot to foot. */
function arch(t0: number, u: number, scale = 1): V3 {
  const t = Math.min(1.2, Math.max(0, t0))
  const a = A0 - (A0 - AB) * Math.pow(t, 1.15), H = H0 - (H0 - HB) * Math.pow(t, 1.3)
  const r = R0 + (RB - R0) * t, b = H / (1 + r), zc = r * b
  const f0 = Math.asin(r), phi = -f0 + u * (Math.PI + 2 * f0)
  const z = zc + b * Math.sin(phi)
  const lean = LEAN0 * Math.pow(1 - Math.min(1, t), 0.8), y = Y0 + (YB - Y0) * t
  return [XC + a * scale * Math.cos(phi), y + (lean * z) / H, Math.max(0, z * scale)]
}
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** Outward normal of the surface S(t, phi) at a point. */
function normalAt(f: (t: number, p: number) => V3, t: number, p: number): V3 {
  const e = 1e-3
  const dt = sub(f(t + e, p), f(t - e, p)), dp = sub(f(t, p + e), f(t, p - e))
  let n = unit(crs(dp, dt))
  const P = f(t, p), out: V3 = [P[0] - XC, 0, P[2] - 4]
  if (n[0] * out[0] + n[2] * out[2] < 0) n = [-n[0], -n[1], -n[2]]
  return n
}

// Each petal is a shingle: from its front edge (scale 1 of the base arch)
// it flares to 1 + GROW at its back edge, which laps over the next petal's
// front edge. The rim petal is thicker.
for (let k = 0; k < PETALS; k++) {
  const t0 = k === 0 ? 0 : EDGES[k] - OVER, t1 = EDGES[k + 1]
  const thick = k === 0 ? 1.6 : 0.45
  const sc = (t: number) => 1 + (GROW * (t - t0)) / (t1 - t0)
  const outer = (t: number, p: number) => arch(t, p, sc(t))
  const innerS = (t: number, p: number): V3 => {
    const P = outer(t, p), n = normalAt(outer, t, p)
    return [P[0] - n[0] * thick, P[1] - n[1] * thick, Math.max(0, P[2] - n[2] * thick)]
  }
  const T = (j: number) => t0 + ((t1 - t0) * j) / NT
  const PH = (i: number) => i / NPHI
  for (let j = 0; j < NT; j++) for (let i = 0; i < NPHI; i++) {
    const q = [[j, i], [j, i + 1], [j + 1, i + 1], [j + 1, i]] as [number, number][]
    const po = q.map(([a, b]) => outer(T(a), PH(b))), no = q.map(([a, b]) => normalAt(outer, T(a), PH(b)))
    shell.tri(po[0], po[1], po[2], undefined, undefined, undefined, [no[0], no[1], no[2]])
    shell.tri(po[0], po[2], po[3], undefined, undefined, undefined, [no[0], no[2], no[3]])
    const pi = q.map(([a, b]) => innerS(T(a), PH(b))), ni = no.map((n) => [-n[0], -n[1], -n[2]] as V3)
    inner.tri(pi[0], pi[2], pi[1], undefined, undefined, undefined, [ni[0], ni[2], ni[1]])
    inner.tri(pi[0], pi[3], pi[2], undefined, undefined, undefined, [ni[0], ni[3], ni[2]])
  }
  // the feet: close the gap between outer and inner surfaces at the ground
  for (const u of [0, 1]) for (let j = 0; j < NT; j++) {
    const a = outer(T(j), u), b = outer(T(j + 1), u), c = innerS(T(j + 1), u), d = innerS(T(j), u)
    inner.quad(a, b, c, d); inner.quad(d, c, b, a)
  }
  // the front edge (facing the lawn)
  for (let i = 0; i < NPHI; i++) {
    const a = outer(t0, PH(i)), b = outer(t0, PH(i + 1)), c = innerS(t0, PH(i + 1)), d = innerS(t0, PH(i))
    const n: V3 = [0, 1, 0]
    inner.tri(a, b, c, undefined, undefined, undefined, [n, n, n])
    inner.tri(a, c, d, undefined, undefined, undefined, [n, n, n])
  }
  // the back lip: a step from this petal's back edge down onto the next
  // petal's surface (or the back wall), closing the gap between them
  const nextScale = k < PETALS - 1 ? 1 + (GROW * (t1 - (EDGES[k + 1] - OVER))) / (EDGES[k + 2] - (EDGES[k + 1] - OVER)) : 1 + GROW
  for (let i = 0; i < NPHI; i++) {
    const a = outer(t1, PH(i)), b = outer(t1, PH(i + 1)), c = arch(t1, PH(i + 1), nextScale), d = arch(t1, PH(i), nextScale)
    const n: V3 = [0, -1, 0]
    shell.tri(a, c, b, undefined, undefined, undefined, [n, n, n])
    shell.tri(a, d, c, undefined, undefined, undefined, [n, n, n])
  }
}
// The back wall closing the hood behind the stage.
{
  const n: V3 = [0, -1, 0]
  const pts = Array.from({ length: NPHI + 1 }, (_, i) => arch(1, i / NPHI, 1 + GROW))
  const c: V3 = [XC, pts[0][1], 0]
  for (let i = 0; i < NPHI; i++) {
    const a = pts[i], b = pts[i + 1]
    shell.tri(c, a, b, undefined, undefined, undefined, [n, n, n])
    const ai: V3 = [a[0], a[1] + 0.3, a[2]], bi: V3 = [b[0], b[1] + 0.3, b[2]], ci: V3 = [c[0], c[1] + 0.3, c[2]]
    deck.tri(ci, bi, ai, undefined, undefined, undefined, [[0, 1, 0], [0, 1, 0], [0, 1, 0]])
  }
}

// The stage: a deck 1.2 m above the lawn inside the hood, its apron curving
// out between the rim's feet.
{
  const z = 2.2, ring: XY[] = []
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI * (1 - i / 12)
    ring.push([XC + 14.5 * Math.cos(a), 7 + 5 * Math.sin(a)])
  }
  ring.push([XC + 8, -8], [XC - 8, -8])
  const r = ccw(ring)
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length]
    inner.quad([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], z], [p[0], p[1], z])
  }
  for (const [i, j, k] of earcut(r)) deck.tri([r[i][0], r[i][1], z], [r[j][0], r[j][1], z], [r[k][0], r[k][1], z])
}

// The backstage wings: glass walls under a white parapet and roof, with a
// low white vault along each, echoing the hood.
/** Wing walls against the hood get no glass: they are inside its skirt. */
function backsOnHood(p: XY, q: XY) {
  const m: XY = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const nx = q[1] - p[1], ny = p[0] - q[0] // outward normal of a ccw ring's edge
  if (nx * (XC - m[0]) <= 0 || Math.abs(nx) < Math.abs(ny)) return false // only walls facing the hood's axis
  const t = (Y0 - m[1]) / (Y0 - YB)
  if (t < 0 || t > 1.1) return false
  const a = A0 - (A0 - AB) * Math.pow(Math.min(1, t), 1.15)
  return Math.abs(m[0] - XC) < a * 1.12 + 2.5
}
function wing(ring0: XY[], spine: XY[]) {
  const r = ccw(ring0), H = 6.2
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length]
    wingWhite.quad([p[0], p[1], 0], [q[0], q[1], 0], [q[0], q[1], H], [p[0], p[1], H])
    // glass in bays between white mullions
    const len = Math.hypot(q[0] - p[0], q[1] - p[1])
    if (len < 3 || backsOnHood(p, q)) continue
    const ux = (q[0] - p[0]) / len, uy = (q[1] - p[1]) / len, nx = uy * 0.05, ny = -ux * 0.05
    const k = Math.max(1, Math.round(len / 3.6)), w = len / k
    for (let j = 0; j < k; j++) {
      const s0 = j * w + 0.35, s1 = (j + 1) * w - 0.35
      const A: V3 = [p[0] + ux * s0 + nx, p[1] + uy * s0 + ny, 0.5], B: V3 = [p[0] + ux * s1 + nx, p[1] + uy * s1 + ny, 0.5]
      glass.quad(A, B, [B[0], B[1], H - 1.1], [A[0], A[1], H - 1.1])
    }
  }
  for (const [i, j, k] of earcut(r)) wingWhite.tri([r[i][0], r[i][1], H], [r[j][0], r[j][1], H], [r[k][0], r[k][1], H])
  // vault: half-ellipse section 9 m wide, 2.8 m tall, swept along the spine
  const W = 4.5, VH = 2.8, N = 8
  const sec = (p: XY, d: XY, a: number): V3 => { const nx = -d[1], ny = d[0]; return [p[0] + nx * W * Math.cos(a), p[1] + ny * W * Math.cos(a), H + VH * Math.sin(a)] }
  const dirs = spine.map((p, i) => {
    const a = spine[Math.max(0, i - 1)], b = spine[Math.min(spine.length - 1, i + 1)]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] as XY
  })
  for (let s = 0; s < spine.length - 1; s++) for (let i = 0; i < N; i++) {
    const a0 = (Math.PI * i) / N, a1 = (Math.PI * (i + 1)) / N
    const A = sec(spine[s], dirs[s], a0), B = sec(spine[s], dirs[s], a1), C = sec(spine[s + 1], dirs[s + 1], a1), D = sec(spine[s + 1], dirs[s + 1], a0)
    const g = crs(sub(B, A), sub(D, A)), mid: V3 = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2, (A[2] + C[2]) / 2]
    const sp: V3 = [(spine[s][0] + spine[s + 1][0]) / 2, (spine[s][1] + spine[s + 1][1]) / 2, H]
    if (g[0] * (mid[0] - sp[0]) + g[1] * (mid[1] - sp[1]) + g[2] * (mid[2] - sp[2]) > 0) { wingWhite.tri(A, B, C); wingWhite.tri(A, C, D) } else { wingWhite.tri(A, C, B); wingWhite.tri(A, D, C) }
  }
  for (const [s, sgn] of [[0, -1], [spine.length - 1, 1]] as [number, number][]) {
    const c: V3 = [spine[s][0], spine[s][1], H], n: V3 = [dirs[s][0] * sgn, dirs[s][1] * sgn, 0]
    for (let i = 0; i < N; i++) {
      const A = sec(spine[s], dirs[s], (Math.PI * i) / N), B = sec(spine[s], dirs[s], (Math.PI * (i + 1)) / N)
      wingWhite.tri(c, A, B, undefined, undefined, undefined, [n, n, n])
    }
  }
}
wing(
  [[-31.5, 5.5], [-29, -4.7], [-24.7, -12], [-17.9, -20.3], [-12.1, -25.4], [-9.5, -15], [-14.5, -3], [-20.5, 8.6], [-27.4, 8.5], [-26.2, 6.4]],
  [[-24.5, 5], [-21.5, -4], [-16.5, -12.5], [-11.5, -19]],
)
wing(
  [[14, -24.2], [19, -19.3], [23.5, -14.3], [27.8, -6.6], [30.5, 0.6], [31.1, 7.8], [25.8, 8.4], [25.8, 11.3], [17.1, 10.5], [13.5, -2.5], [8.5, -14]],
  [[11.5, -17.5], [17, -9.5], [21, -1], [23.5, 7.5]],
)

const inside = (p: V3, n: V3) => {
  // inner faces look towards the axis: lit strongly; the rest a little
  const toAxis = -(n[0] * (p[0] - XC) + n[2] * p[2])
  return toAxis > 0 ? 0.95 : 0.6
}
const parts = [
  { part: shell, material: { ...finish('rady-shell-white', 0xf3f2ee), floodlight: (p: V3, n: V3) => (n[1] > 0.5 ? 0.8 : 0.3) } },
  { part: inner, material: { ...finish('rady-shell-inner', 0xf8f6f1), floodlight: inside } },
  { part: wingWhite, material: finish('rady-wing-white', 0xeeede8) },
  { part: glass, material: PALETTE.window },
  { part: deck, material: PALETTE.roof },
]
const glb = writeGlb('The Rady Shell at Jacobs Park', parts, {
  license: 'CC0-1.0', bearing: 132, elevation: 0, anchor: [32.704786, -117.165881], height: H0,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/1075932489', 'way/1156170543'],
})
console.log(parts.map((p) => `${p.material.name}:${p.part.triangles}`).join(' '))
const tris = report('Rady Shell', parts, glb, 5000)
const out = new URL('../models/sd-rady-shell.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${tris} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
