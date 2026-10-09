/**
 * TWA Flight Center (the TWA Hotel's lobby), JFK Airport, Queens — procedural, CC0-1.0, no textures.
 * bun generators/nyc-twa-flight-center.ts
 *
 * Map frame: x = model east (the airside, towards Terminal 5), y = model north,
 * z up, metres. Placed at bearing −3.5°, the headhouse's axis of symmetry
 * (lidar: the roof's outline is mirror-symmetric about a line 4.5 m north of
 * the anchor, running 3.5° south of east). Anchor: area centroid of the OSM
 * outline way/284907419, which takes in the headhouse and the low wings
 * that run off its north and south ends.
 *
 * Identifying features (from the photos): the white concrete shell roof of
 * four shells meeting at the centre, the two side shells rising outward to
 * pointed wing tips, the front shell dipping to a beak over the entrance;
 * the sculptural Y-shaped piers at the knees; the tall glass walls leaning
 * out under the raised wing tips and round the back; the white elliptical
 * flight tubes on piers; the low curved white wings with arched bays.
 *
 * Evidence
 * - OSM way/284907419 (headhouse and low wings, one outline, tagged 13.6 m),
 *   way/1556624966 and way/1556624967 (the two flight tubes, layer 1).
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), heights above the apron
 *   (3.6 m NAVD88). The roof is drawn straight from it: its edge found along
 *   48 rays from the centre (where the surface drops away), its height
 *   sampled on 8 rings out to 95% of the edge (3 × 3 m median, mirrored for
 *   symmetry; /tmp/city/nyc/work/nyc-twa-flight-center/table.py). Measured:
 *   centre 12 m, wing tips 15.5–17 m (cells at 1 m reach 17 m), the beak
 *   5–6 m, the back edge 10–11 m; the low wings 5–6 m; the tubes' tops
 *   7–8 m.
 * - Published: 1962, Eero Saarinen; four concrete shells on four Y-shaped
 *   piers; headhouse 46 × 70 m at ground; Flight Tube 1 about 71 m, Flight
 *   Tube 2 about 83 m, elliptical in section, rising 1.8 m to the far end;
 *   green-tinted glass walls (Wikipedia; NRHP 2005). Wikipedia gives the wing
 *   tips as 23 m high; the lidar and the photos agree on ~17 m, used here.
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-twa-flight-center/photos/credits.txt: the front
 *   from the AirTrain (Acroterion CC BY-SA 4.0; Epicgenius CC BY-SA 4.0), a
 *   pier and the north end (Acroterion), under the front shell
 *   (Rainerkruckenberg CC0), the back and its eye window (Rich Gallo; Kathleen
 *   Gulley; CC BY-SA 4.0), a flight tube (Andre Carrotflower CC BY-SA 4.0).
 *
 * Estimated: the pier positions (front pair from OSM's notches, back pair
 * where the outline narrows) and their shapes; the glass walls' footprint
 * (published 46 × 70 m, drawn as a ring at 78% of the roof's reach, leaning
 * out to the roof's underside); the shell thickness at the edge (0.7 m); the
 * skylight seams' course (centre to each pier); the tubes' section (5.0 ×
 * 4.0 m) and supports; the low wings' arched bays.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, prism, finishModel } from './nyc-570-lexington'
import { archPanel, spread } from './nyc-city-hall'

const conc = new Part(), win = new Part()

// --- The roof, from lidar: edge radius per ray, heights per ring ---
const C: XY = [6.75, 4.5] // centre of the roof, on its axis of symmetry
const R = [34.5, 33.8, 33.0, 33.8, 34.0, 35.2, 35.8, 36.8, 38.0, 39.2, 40.8, 42.8, 45.2, 47.2, 47.0, 42.5, 37.5, 34.2, 30.8, 28.8, 27.0, 28.2, 30.5, 31.8, 34.5, 31.8, 30.5, 28.2, 27.0, 28.8, 30.8, 34.2, 37.5, 42.5, 47.0, 47.2, 45.2, 42.8, 40.8, 39.2, 38.0, 36.8, 35.8, 35.2, 34.0, 33.8, 33.0, 33.8]
const N0 = 48
const TS = [0, 0.18, 0.36, 0.52, 0.66, 0.78, 0.88, 0.95]
const Z = [
  [11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9, 11.9],
  [12.6, 12.6, 12.6, 12.7, 12.8, 12.9, 13.1, 13.2, 13.3, 13.2, 13.4, 13.2, 13.2, 12.9, 12.5, 12.4, 12.5, 12.2, 11.2, 11.2, 11.3, 11.4, 11.6, 11.6, 11.6, 11.6, 11.6, 11.4, 11.3, 11.2, 11.2, 12.2, 12.5, 12.4, 12.5, 12.9, 13.2, 13.2, 13.4, 13.2, 13.3, 13.2, 13.1, 12.9, 12.8, 12.7, 12.6, 12.6],
  [12.9, 12.8, 12.5, 12.6, 12.8, 12.7, 12.8, 13.2, 13.6, 14.2, 14.7, 15.1, 15.3, 15.0, 14.3, 13.2, 12.4, 11.5, 11.9, 10.4, 10.5, 10.6, 10.7, 11.0, 11.1, 11.0, 10.7, 10.6, 10.5, 10.4, 11.9, 11.5, 12.4, 13.2, 14.3, 15.0, 15.3, 15.1, 14.7, 14.2, 13.6, 13.2, 12.8, 12.7, 12.8, 12.6, 12.5, 12.8],
  [13.3, 13.1, 12.7, 12.4, 12.0, 11.6, 12.2, 12.0, 12.7, 13.5, 14.6, 15.3, 16.0, 16.0, 15.3, 14.0, 12.6, 11.2, 10.5, 10.8, 9.4, 9.6, 9.6, 9.9, 10.0, 9.9, 9.6, 9.6, 9.4, 10.8, 10.5, 11.2, 12.6, 14.0, 15.3, 16.0, 16.0, 15.3, 14.6, 13.5, 12.7, 12.0, 12.2, 11.6, 12.0, 12.4, 12.7, 13.1],
  [13.1, 12.8, 12.5, 11.9, 11.2, 10.4, 10.2, 11.1, 11.1, 12.8, 13.7, 14.8, 15.9, 16.5, 15.8, 14.5, 12.5, 10.5, 9.5, 10.1, 8.5, 8.4, 8.5, 8.7, 8.6, 8.7, 8.5, 8.4, 8.5, 10.1, 9.5, 10.5, 12.5, 14.5, 15.8, 16.5, 15.9, 14.8, 13.7, 12.8, 11.1, 11.1, 10.2, 10.4, 11.2, 11.9, 12.5, 12.8],
  [12.3, 12.3, 11.8, 11.1, 10.6, 9.6, 8.8, 9.7, 9.8, 11.1, 12.7, 14.3, 15.2, 16.2, 15.7, 14.1, 12.4, 10.3, 8.2, 8.8, 7.4, 7.0, 7.2, 7.5, 7.0, 7.5, 7.2, 7.0, 7.4, 8.8, 8.2, 10.3, 12.4, 14.1, 15.7, 16.2, 15.2, 14.3, 12.7, 11.1, 9.8, 9.7, 8.8, 9.6, 10.6, 11.1, 11.8, 12.3],
  [11.6, 11.3, 11.0, 10.3, 9.5, 8.6, 7.7, 8.0, 8.4, 9.2, 11.3, 13.0, 14.5, 15.7, 15.5, 14.2, 12.1, 9.9, 8.2, 7.8, 6.9, 6.1, 6.1, 6.0, 5.6, 6.0, 6.1, 6.1, 6.9, 7.8, 8.2, 9.9, 12.1, 14.2, 15.5, 15.7, 14.5, 13.0, 11.3, 9.2, 8.4, 8.0, 7.7, 8.6, 9.5, 10.3, 11.0, 11.3],
  [10.9, 10.7, 10.4, 10.0, 9.6, 9.3, 8.1, 7.7, 7.7, 9.0, 10.7, 12.4, 14.2, 15.4, 15.6, 14.2, 12.0, 10.4, 9.0, 7.6, 6.9, 6.4, 6.0, 5.5, 4.7, 5.5, 6.0, 6.4, 6.9, 7.6, 9.0, 10.4, 12.0, 14.2, 15.6, 15.4, 14.2, 12.4, 10.7, 9.0, 7.7, 7.7, 8.1, 9.3, 9.6, 10.0, 10.4, 10.7],
]
const N = R.length, EDGE = TS[TS.length - 1]
// The 3 m median and the 95% reach flatten the shell's edge: the 1 m cells put the wing
// tips at 17 m and the photos bring the edges down to the piers' tops. Stretch the two
// outer rings away from the centre's 11 m by 40% and 60%, except over the front shell's
// beak. The tips come out at 18.5 m, between the lidar's 17 m and the published 23 m.
for (const [k, f] of [[TS.length - 2, 0.4], [TS.length - 1, 0.6]]) for (let i = 0; i < R.length; i++) {
  if (i >= 21 && i <= 27) continue
  Z[k][i] = Math.round((Z[k][i] + (Z[k][i] - 11) * f) * 10) / 10
}
// Light 1-2-1 smoothing round each ring, which takes out lidar speckle (lamps, rooftop kit).
for (let k = 1; k < TS.length; k++) {
  const r = Z[k].slice()
  Z[k] = r.map((z, i) => Math.round(((r[(i + N0 - 1) % N0] + 2 * z + r[(i + 1) % N0]) / 4) * 10) / 10)
}
// The ray threshold rounds the wing tips off; the photos show them pointed.
for (const [i, r] of [[12, 44.2], [13, 49.5], [14, 45.5], [15, 40.5]]) { R[i] = r; R[N0 - i] = r }
const SHELL = 0.7 // edge thickness

/** Point on ray i (fractional) at ring fraction t (0 centre … EDGE at the roof's edge). */
function at(i: number, t: number): XY {
  const i0 = Math.floor(i), f = i - i0, a = (2 * Math.PI * i) / N
  const r = R[((i0 % N) + N) % N] * (1 - f) + R[(((i0 + 1) % N) + N) % N] * f
  return [C[0] + Math.cos(a) * r * (t / EDGE), C[1] + Math.sin(a) * r * (t / EDGE)]
}
/** Roof height on ray i (fractional) at fraction t, bilinear in the lidar table. */
function zAt(i: number, t: number) {
  const tt = Math.min(Math.max(t, 0), EDGE)
  let k = 0
  while (k < TS.length - 2 && TS[k + 1] < tt) k++
  const g = (tt - TS[k]) / (TS[k + 1] - TS[k])
  const i0 = Math.floor(i), f = i - i0, a = ((i0 % N) + N) % N, b = (a + 1) % N
  const row = (r: number[]) => r[a] * (1 - f) + r[b] * f
  return row(Z[k]) * (1 - g) + row(Z[k + 1]) * g
}

// The four shells, each smooth-shaded on its own so they meet in creases along the
// skylight seams. Drawn on 72 rays (5°) so the seams, which run from the centre to the
// four piers (at 50°, 140°, 220° and 310°), fall on rays; heights from the lidar table.
const M = 72, SEAMS = [10, 28, 44, 62]
const q = (m: number) => (m * N) / M // 72-ray index → lidar-table ray index
function zRoof(m: number, t: number) {
  // the seams sit in a shallow valley between the shells
  const d = Math.min(...SEAMS.map((sm) => { const e = Math.abs(m - sm) % M; return Math.min(e, M - e) }))
  return zAt(q(m), t) - (t > 0.05 ? 0.5 * Math.max(0, 1 - d) : 0)
}
{
  const K = TS.length
  const P = (k: number, m: number, dz = 0): V3 => { const [x, y] = at(q(m), TS[k]); return [x, y, zRoof(m, TS[k]) + dz] }
  const UP: V3 = [0, 0, 1]
  const shells: [number, number][] = [[10, 28], [28, 44], [44, 62], [62, 82]]
  for (const [m0, m1] of shells) {
    const nrm = (k: number, m: number): V3 => {
      const ka = Math.max(k - 1, 1), kb = Math.min(k + 1, K - 1)
      const a = P(ka, m), b = P(kb, m), c = P(k, Math.max(m - 1, m0)), d = P(k, Math.min(m + 1, m1))
      const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v: V3 = [d[0] - c[0], d[1] - c[1], d[2] - c[2]]
      let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
      if (n[2] < 0) n = [-n[0], -n[1], -n[2]]
      const l = Math.hypot(...n) || 1
      return [n[0] / l, n[1] / l, n[2] / l]
    }
    const th = (k: number) => -SHELL - 0.8 * (1 - TS[k] / EDGE) // thicker towards the centre
    for (let m = m0; m < m1; m++) {
      const j = m + 1
      conc.tri(P(0, 0), P(1, m), P(1, j), undefined, undefined, undefined, [UP, nrm(1, m), nrm(1, j)])
      conc.tri(P(0, 0, -SHELL - 1.5), P(1, j, th(1)), P(1, m, th(1)))
      for (let k = 1; k < K - 1; k++) {
        const n = [nrm(k, m), nrm(k, j), nrm(k + 1, j), nrm(k + 1, m)]
        conc.tri(P(k, m), P(k + 1, m), P(k + 1, j), undefined, undefined, undefined, [n[0], n[3], n[2]])
        conc.tri(P(k, m), P(k + 1, j), P(k, j), undefined, undefined, undefined, [n[0], n[2], n[1]])
        conc.tri(P(k, m, th(k)), P(k + 1, j, th(k + 1)), P(k + 1, m, th(k + 1)))
        conc.tri(P(k, m, th(k)), P(k, j, th(k)), P(k + 1, j, th(k + 1)))
      }
      const a = P(K - 1, m), b = P(K - 1, j)
      conc.quad([a[0], a[1], a[2] - SHELL], [b[0], b[1], b[2] - SHELL], b, a)
    }
  }
}

// --- Skylight seams between the four shells: centre to each pier ---
const PIERS = [{ i: 18.7, t: 0.9 }, { i: 29.3, t: 0.9 }, { i: 6.7, t: 0.9 }, { i: 41.3, t: 0.9 }]
for (const p of PIERS) {
  const w = 0.9 // half-width, metres
  const steps = 8
  for (let s = 0; s < steps; s++) {
    const t0 = 0.1 + ((p.t + 0.04 - 0.1) * s) / steps, t1 = 0.1 + ((p.t + 0.04 - 0.1) * (s + 1)) / steps
    const pt = (t: number, side: number): V3 => {
      const [x, y] = at(p.i, t), a = (2 * Math.PI * p.i) / N
      const px = -Math.sin(a) * side * w, py = Math.cos(a) * side * w
      return [x + px, y + py, zRoof((p.i * M) / N, t) + 0.1]
    }
    win.quad(pt(t0, 1), pt(t0, -1), pt(t1, -1), pt(t1, 1)) // they read dark in the photos and light the lobby below
  }
}

// --- The glass walls: a ring at 78% of the roof's reach, leaning out to its underside ---
{
  const lo = 0.78 * EDGE, hi = 0.95 * EDGE
  // Round the back (±40° of the axis) the wall is concrete with one long elliptical
  // window, the "eye" facing the apron; elsewhere glass over a 1 m upstand.
  const sill = (i: number) => { const th = (((i + N / 2) % N) - N / 2) * (360 / N); return Math.abs(th) < 40 ? 1.8 + 4.5 * (th / 40) ** 4 : 1.0 }
  const head = (i: number, top: number) => { const th = (((i + N / 2) % N) - N / 2) * (360 / N); return Math.abs(th) < 40 ? Math.max(sill(i), top - 0.9 - 3.5 * (th / 40) ** 4) : top }
  for (let i = 0; i < N; i++) {
    const j = i + 1
    const A = at(i, lo), B = at(j, lo), Ct = at(j, hi), D = at(i, hi)
    const za = zAt(i, hi) - SHELL - 0.3, zb = zAt(j, hi) - SHELL - 0.3
    const pa = (z: number): V3 => [A[0] + (D[0] - A[0]) * (z / za), A[1] + (D[1] - A[1]) * (z / za), z]
    const pb = (z: number): V3 => [B[0] + (Ct[0] - B[0]) * (z / zb), B[1] + (Ct[1] - B[1]) * (z / zb), z]
    const sa = sill(i), sb = sill(j), ha = head(i, za), hb = head(j, zb)
    conc.quad(pa(0), pb(0), pb(sb), pa(sa))
    if (ha > sa + 0.05 || hb > sb + 0.05) win.quad(pa(sa), pb(sb), pb(hb), pa(ha))
    if (za - ha > 0.05 || zb - hb > 0.05) conc.quad(pa(ha), pb(hb), pb(zb), pa(za))
  }
}

// --- The Y-shaped piers: a flared stem splitting into two arms that take the shell edges ---
function slab(p: Part, a: V3[], b: V3[]) {
  p.loft([a, b]); p.cap(b, true); p.cap(a, false)
}
const rectAt = (c: V3, ux: number, uy: number, hw: number, hd: number): V3[] => {
  const vx = -uy, vy = ux
  return [[c[0] - ux * hw - vx * hd, c[1] - uy * hw - vy * hd, c[2]], [c[0] + ux * hw - vx * hd, c[1] + uy * hw - vy * hd, c[2]], [c[0] + ux * hw + vx * hd, c[1] + uy * hw + vy * hd, c[2]], [c[0] - ux * hw + vx * hd, c[1] - uy * hw + vy * hd, c[2]]]
}
for (const p of PIERS) {
  const a = (2 * Math.PI * p.i) / N
  const out: XY = [Math.cos(a), Math.sin(a)], tang: XY = [-out[1], out[0]]
  const base = at(p.i, 0.8 * EDGE), split = at(p.i, 0.86 * EDGE)
  const zs = 4.0
  const foot: V3 = [base[0], base[1], 0], knee: V3 = [split[0], split[1], zs]
  slab(conc, rectAt(foot, tang[0], tang[1], 1.8, 1.6), rectAt(knee, tang[0], tang[1], 3.2, 2.0))
  for (const side of [-1, 1]) {
    const ti = p.i + side * 1.6, tt = 0.93 * EDGE
    const [hx, hy] = at(ti, tt), hz = zAt(ti, tt) - SHELL - 0.1
    const kc: V3 = [knee[0] + tang[0] * side * 1.6, knee[1] + tang[1] * side * 1.6, zs]
    slab(conc, rectAt(kc, tang[0], tang[1], 1.6, 1.9), rectAt([hx, hy, hz + 0.3], tang[0], tang[1], 2.2, 1.5))
  }
}

// --- The low wings north and south: the outline beyond the headhouse, 6 m, arched bays ---
const OUTLINE: XY[] = [[29.2, 33.5], [32.1, 29.1], [35.0, 24.0], [37.2, 18.9], [39.2, 12.9], [40.5, 8.1], [40.5, 4.0], [39.2, -1.1], [37.6, -7.2], [35.3, -12.9], [32.9, -17.3], [30.8, -21.3], [29.5, -23.2], [27.7, -25.6], [23.9, -28.4], [20.2, -31.8], [18.0, -33.7], [31.9, -45.5], [28.1, -49.8], [22.6, -55.0], [17.3, -59.2], [11.8, -62.5], [7.8, -64.7], [2.5, -61.9], [0.0, -66.6], [-3.6, -65.0], [-8.0, -72.1], [-13.1, -69.7], [-14.2, -71.9], [-20.8, -68.5], [-22.3, -69.9], [-25.6, -71.2], [-29.6, -72.0], [-32.7, -72.5], [-36.4, -72.4], [-40.6, -71.5], [-40.7, -70.0], [-39.0, -68.4], [-35.2, -63.2], [-31.2, -56.6], [-27.8, -49.5], [-24.5, -42.1], [-22.2, -35.7], [-20.1, -28.6], [-18.6, -22.0], [-17.8, -19.1], [-16.1, -16.4], [-14.9, -15.1], [-15.5, -10.7], [-18.4, -7.3], [-21.7, -3.3], [-24.6, 1.0], [-27.0, 4.5], [-24.5, 9.4], [-21.2, 14.0], [-19.2, 17.0], [-16.4, 19.8], [-16.2, 25.7], [-18.0, 27.0], [-19.4, 29.3], [-20.4, 31.9], [-22.3, 38.4], [-24.7, 45.3], [-28.1, 52.6], [-30.9, 58.3], [-33.7, 63.2], [-36.8, 68.1], [-40.1, 72.8], [-43.7, 77.5], [-44.3, 77.6], [-45.1, 79.2], [-42.6, 80.3], [-38.5, 80.9], [-34.1, 80.7], [-29.3, 79.9], [-24.9, 78.8], [-19.7, 76.5], [-14.7, 74.0], [-10.3, 71.0], [-5.7, 67.3], [-1.4, 63.2], [3.5, 58.1], [8.0, 52.9], [11.1, 48.9], [13.4, 47.0], [15.6, 45.2], [18.5, 43.5], [21.2, 41.4], [23.8, 39.5], [25.7, 37.9], [27.9, 35.6]]
/** Sutherland–Hodgman clip of a ring to y·sign > y0·sign. */
function clipY(ring: XY[], y0: number, sign: number): XY[] {
  const inside = (p: XY) => (p[1] - y0) * sign > 0
  const out: XY[] = []
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k], b = ring[(k + 1) % ring.length]
    if (inside(a)) out.push(a)
    if (inside(a) !== inside(b)) { const f = (y0 - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * f, y0]) }
  }
  return out
}
const WING_H = 6
for (const sign of [1, -1]) {
  const ring = clipY(OUTLINE, C[1] + sign * 33, sign)
  prism({ wall: conc, win: null, roof: conc, ring, z0: 0, z1: WING_H, facade: null, bevel: 0.35 })
  // Arched bays along the outer (street and apron) walls, not the cut against the headhouse.
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k], b = ring[(k + 1) % ring.length]
    if (Math.abs(a[1] - b[1]) < 1e-6 && Math.abs(a[1] - (C[1] + sign * 33)) < 1e-6) continue
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 4.5) continue
    // prism rewinds rings counter-clockwise; walls face out when a→b runs that way
    const ccw = ringArea(ring) > 0
    const [p, q] = ccw ? [a, b] : [b, a]
    for (const s of spread(1.2, L - 1.2, Math.max(1, Math.round((L - 2.4) / 6)))) archPanel(win, p, q, s, 3.4, 0.6, 4.6, 0.06, 6)
  }
}
function ringArea(r: XY[]) { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] } return s / 2 }

// --- The flight tubes: white elliptical tubes on piers, rising 1.8 m to the far end ---
function tube(a: XY, b: XY, hw: number, hh: number, z0: number, z1: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = -uy, ny = ux, M = 12, S = 6
  const rings: V3[][] = []
  for (let s = 0; s <= S; s++) {
    const f = s / S, cx = a[0] + ux * L * f, cy = a[1] + uy * L * f, cz = z0 + (z1 - z0) * f
    rings.push(Array.from({ length: M }, (_, m) => {
      const t = (2 * Math.PI * m) / M
      return [cx + nx * hw * Math.cos(t), cy + ny * hw * Math.cos(t), cz + hh * Math.sin(t)] as V3
    }))
  }
  // smooth normals round the ellipse
  for (let s = 0; s < S; s++) for (let m = 0; m < M; m++) {
    const m2 = (m + 1) % M
    const nm = (mm: number): V3 => { const t = (2 * Math.PI * mm) / M, x = Math.cos(t) / hw, z = Math.sin(t) / hh, l = Math.hypot(x, z); return [nx * x / l, ny * x / l, z / l] }
    const A = rings[s][m], B = rings[s + 1][m], Cc = rings[s + 1][m2], D = rings[s][m2]
    conc.tri(A, B, Cc, undefined, undefined, undefined, [nm(m), nm(m), nm(m2)])
    conc.tri(A, Cc, D, undefined, undefined, undefined, [nm(m), nm(m2), nm(m2)])
  }
  conc.cap(rings[S].slice().reverse(), false)
  // piers every ~16 m, clear of the headhouse
  for (const f of spread(0.25, 1, Math.max(2, Math.round(L / 16)))) {
    const cx = a[0] + ux * L * f, cy = a[1] + uy * L * f, top = z0 + (z1 - z0) * f - hh + 0.2
    slab(conc, rectAt([cx, cy, 0], ux, uy, 0.9, 1.3), rectAt([cx, cy, top], ux, uy, 0.9, 1.9))
  }
}
// OSM centrelines, started inside the glass wall so they meet the building.
tube([18.5, 22.0], [74.6, 66.2], 2.5, 2.0, 5.0, 6.8) // way/1556624966, Flight Tube 1 (north-east)
tube([19.5, -15.0], [82.8, -70.0], 2.5, 2.0, 5.0, 6.8) // way/1556624967, Flight Tube 2 (south-east)

finishModel('TWA Flight Center', 'nyc-twa-flight-center', [
  { part: conc, material: finish('twa-concrete', 0xf0ebe1) },
  { part: win, material: PALETTE.window },
], { bearing: -3.5, osm: 'way/284907419', height: 16.5 }, 5000)
