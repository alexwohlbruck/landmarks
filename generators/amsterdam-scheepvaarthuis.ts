/**
 * Scheepvaarthuis, Amsterdam — procedural, CC0-1.0, no textures.
 * bun generators/amsterdam-scheepvaarthuis.ts
 *
 * The shipping companies' office (1913–1916, enlarged 1926–1928), J.M. van
 * der Mey with the brothers Van Gendt and Michel de Klerk and Piet Kramer:
 * the first Amsterdam School building. A wedge-shaped block of dark brown
 * brick, six storeys of windows grouped between heavy vertical piers, a
 * steep slate mansard full of dormers with pale zinc crests, and the sharp
 * prow at the north corner carrying a round grey stone tower with a
 * balcony ring and a low dome. Now the Grand Hotel Amrâth.
 *
 * Map frame: x = east, y = north, z up, metres; bearing 0. Anchor: the OSM
 * outline's area centroid.
 *
 * Evidence
 * - OSM way/57863677 (building=yes, height 30, building:material=brick,
 *   ref:bag 0363100012244270, ref:rce 4158, wikidata Q2078885): the
 *   outline, a wedge between the Prins Hendrikkade (north-east, 70 m), the
 *   Waalseilandsgracht front (west, 75 m in two runs) and the 1926–28 south
 *   wing, with a deep light court opening to the south-west.
 * - 3D BAG (3dbag.nl, CC BY 4.0, TU Delft / 3DGI), NL.IMBAG.Pand.
 *   0363100012244270, LoD2.2 from AHN lidar, sampled on a 3 m grid (ground
 *   NAP +1.67). Measured: the mansard's flat top 25.8 everywhere, falling to
 *   20.0–21.3 at the street walls (the slopes); the prow tower 30.9–32.6 at
 *   (−16, 42); dormer and stair heads 27.9–30.6 here and there; the light
 *   court 7.1 (glass roof) and 2.5. The south wing (y < −27) has no LoD2
 *   roof in 3D BAG; drawn like the rest, as the photos show it (Lloyd's
 *   photo p7 below, the west front, is uniform end to end).
 * - Published: built 1913–1916, extended along the Binnenkant 1926–1928,
 *   rijksmonument 4158; converted to the Grand Hotel Amrâth 2007
 *   (nl.wikipedia "Scheepvaarthuis").
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - Enrique Munoz, "20111020 foto 791.jpg", CC BY-SA 4.0 — the prow and
 *     tower from the north-west, the west front receding.
 *     https://commons.wikimedia.org/wiki/File:20111020_foto_791.jpg
 *   - Gillfoto, "2024 Grand Hotel Amrâth Amsterdam 42.jpg", CC BY-SA 4.0 —
 *     the Prins Hendrikkade front level from across the water, tower at its
 *     north-west end; the scale for heights (eave 21 against 3D BAG).
 *     https://commons.wikimedia.org/wiki/File:2024_Grand_Hotel_Amr%C3%A2th_Amsterdam_42.jpg
 *   - Gillfoto, "2024 Grand Hotel Amrâth gf71.jpg", CC BY-SA 4.0 — the prow
 *     from the north. https://commons.wikimedia.org/wiki/File:2024_Grand_Hotel_Amr%C3%A2th_gf71.jpg
 *   - Janericloebe, "Amsterdam Scheepvaarthuis 001.JPG" and "002.JPG",
 *     CC BY 3.0 — the west front across the Waalseilandsgracht: piers,
 *     window groups, the dormer crests.
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Scheepvaarthuis_001.JPG
 *     https://commons.wikimedia.org/wiki/File:Amsterdam_Scheepvaarthuis_002.JPG
 *   - Lyn Gateley, "DSC00344, Canal Cruise, Amsterdam, Netherlands
 *     (339017945).jpg", CC BY 2.0 — the west front from the water.
 *     https://commons.wikimedia.org/wiki/File:DSC00344,_Canal_Cruise,_Amsterdam,_Netherlands_(339017945).jpg
 *   - Hanno Lans, "Exterieur Scheepvaarthuis 02.jpg", CC BY 4.0 — the light
 *     court, rendered white. https://commons.wikimedia.org/wiki/File:Exterieur_Scheepvaarthuis_02.jpg
 *   - Gerard Dukker, "'t Scheepvaarthuis - Amsterdam - 20011111 - RCE.jpg",
 *     CC BY-SA 4.0 (1963). https://commons.wikimedia.org/wiki/File:%27t_Scheepvaarthuis_-_Amsterdam_-_20011111_-_RCE.jpg
 *
 * Estimated from the photos, scaled to 3D BAG: the eave 21.0 (the mansard's
 * foot); piers 0.7 m wide, 0.35 m proud, about 3.4 m apart; window groups
 * 1.0–3.9, 5.0–10.8, 11.6–17.2, 18.0–20.1 (six storeys), 1.7 m wide; dormers 2.7 m wide
 * in every bay with pale zinc crests to about 27.5; the prow's brick
 * block to 23.6, the tower drum r 3.6 to 28.3, balcony ring 28.3–28.8, upper
 * drum r 3.2 to 31.4, dome to 33.2, lantern to 35.0 (Gillfoto 42: the tower rises 8 m over the 25.8 roof; 3D BAG reads 32.6 on the narrow dome). Flagpoles and
 * the sculpture on the piers are left out.
 *
 * Doubts: the court's inner walls are drawn plain (white render, photo);
 * the court's glass roof is not modelled. Night: the brick and tower are
 * lightly floodlit, the windows lit (hotel).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, capPoly, type XY, unit, circle } from './nyc-570-lexington'
import { rectPanel, block, band } from './nyc-city-hall'

const brick = new Part(), slate = new Part(), zinc = new Part(), win = new Part(), stone = new Part()

// OSM outline (way/57863677), clockwise as mapped, small kinks merged.
const cw: XY[] = [
  [-14.01, -29.17], [-27.27, 3.48], [-27.49, 6.52], [-18.11, 45.94], [-14.97, 46.22], [37.49, -0.43], [23.93, -15.07],
  [26.95, -17.81], [-4.21, -51.94], [-11.26, -35.33],
  // the light court, open to the south-west
  [-0.62, -30.86], [0.34, -33.12], [3.85, -29.27], [2.26, -27.83], [4.09, -25.83], [-0.1, -16.01], [13.55, -9.43], [16.11, -11.74],
  [18.14, -9.6], [16.07, -7.66], [15.34, -8.46], [13.95, -7.2], [14.67, -6.4], [13.9, -5.71], [-3.94, -14.29], [-0.15, -23.55], [-2.66, -24.57],
]
const N = cw.length
// court edges: from vertex 9 (−11.26, −35.33) round to vertex 0, in clockwise order
const courtCW = (i: number) => i >= 9
// Counter-clockwise ring; edge k runs ring[k] → ring[k+1].
const ring: XY[] = cw.slice().reverse()
const isCourt = (k: number) => courtCW(N - 2 - k < 0 ? N - 2 - k + N : N - 2 - k)

const EAVE = 21.0, TOP = 25.8, MANSARD = 4.6

/** Offset each edge inward by its own distance; vertices at the lines' intersections. */
function offsetRing(r: XY[], d: (k: number) => number): XY[] {
  const n = r.length
  const line = (k: number) => {
    const a = r[k], b = r[(k + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nIn: XY = [-u[1], u[0]]
    return { p: [a[0] + nIn[0] * d(k), a[1] + nIn[1] * d(k)] as XY, u }
  }
  return r.map((v, k) => {
    const A = line((k + n - 1) % n), B = line(k)
    const den = A.u[0] * B.u[1] - A.u[1] * B.u[0]
    if (Math.abs(den) < 1e-3) return B.p
    const t = ((B.p[0] - A.p[0]) * B.u[1] - (B.p[1] - A.p[1]) * B.u[0]) / den
    return [A.p[0] + A.u[0] * t, A.p[1] + A.u[1] * t] as XY
  })
}
const top = offsetRing(ring, (k) => (isCourt(k) ? 0 : MANSARD))

// ---------------------------------------------------------------- walls, mansard, roof
for (let k = 0; k < N; k++) {
  const j = (k + 1) % N, a = ring[k], b = ring[j], ta = top[k], tb = top[j]
  if (isCourt(k)) {
    // court wall: in the edge's own plane, up to the flat roof
    const P = (q: XY, z: number): V3 => [q[0], q[1], z]
    const f: V3[] = [P(a, 0), P(b, 0), P(b, EAVE), P(tb, TOP), P(ta, TOP), P(a, EAVE)]
    for (let i = 1; i < f.length - 1; i++) zinc.tri(f[0], f[i], f[i + 1])
  } else {
    brick.quad([a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], EAVE], [a[0], a[1], EAVE])
    slate.quad([a[0], a[1], EAVE], [b[0], b[1], EAVE], [tb[0], tb[1], TOP], [ta[0], ta[1], TOP])
  }
}
capPoly(slate, top, TOP)
// a brick cornice course at the eave
{
  for (let k = 0; k < N; k++) {
    if (isCourt(k)) continue
    const a = ring[k], b = ring[(k + 1) % N], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    rectPanel(brick, a, b, L / 2, L, EAVE - 0.7, EAVE, 0.25)
  }
}

// ---------------------------------------------------------------- piers, windows, dormers
for (let k = 0; k < N; k++) {
  if (isCourt(k)) continue
  const a = ring[k], b = ring[(k + 1) % N], L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 5) continue
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
  const at = (s: number, d: number, z: number): V3 => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d, z]
  const n = Math.max(1, Math.round((L - 1.0) / 3.4)), pitch = (L - 1.0) / n
  // piers at bay boundaries (a box 0.7 wide, 0.35 proud)
  for (let i = 0; i <= n; i++) {
    const s = 0.5 + pitch * i, w = 0.35
    const q = [at(s - w, 0, 0), at(s + w, 0, 0), at(s + w, 0.35, 0), at(s - w, 0.35, 0)]
    const zt = EAVE + 0.3
    brick.quad(q[1], q[2], [q[2][0], q[2][1], zt], [q[1][0], q[1][1], zt])
    brick.quad(q[2], q[3], [q[3][0], q[3][1], zt], [q[2][0], q[2][1], zt])
    brick.quad(q[3], q[0], [q[0][0], q[0][1], zt], [q[3][0], q[3][1], zt])
    brick.quad([q[0][0], q[0][1], zt], [q[1][0], q[1][1], zt], [q[2][0], q[2][1], zt], [q[3][0], q[3][1], zt])
  }
  // window groups between the piers
  for (let i = 0; i < n; i++) {
    const s = 0.5 + pitch * (i + 0.5), w = Math.min(1.7, pitch - 1.4)
    for (const [z0, z1] of [[1.0, 3.9], [5.0, 10.8], [11.6, 17.2], [18.0, 20.1]]) rectPanel(win, a, b, s, w, z0, z1)
  }
  // dormers on the mansard, one per bay, with pale zinc crests
  const slope = MANSARD / (TOP - EAVE)
  for (let i = 0; i < n; i += 1) {
    const s = 0.5 + pitch * (i + 0.5)
    if (s < 3 || s > L - 3) continue
    const hw = 1.35, d0 = 0.9, z0 = EAVE + d0 / slope, z1 = z0 + 2.6, dz = (z1 - EAVE) * slope + 0.3
    const F = (ss: number, z: number) => at(ss, -d0, z), B = (ss: number, z: number) => at(ss, -dz, z)
    slate.quad(F(s - hw, z0), F(s + hw, z0), F(s + hw, z1), F(s - hw, z1))
    slate.quad(F(s + hw, z0), B(s + hw, z1), F(s + hw, z1), F(s + hw, z0))
    slate.tri(F(s + hw, z0), B(s + hw, z1), F(s + hw, z1))
    slate.tri(F(s - hw, z0), F(s - hw, z1), B(s - hw, z1))
    slate.quad(F(s - hw, z1), F(s + hw, z1), B(s + hw, z1), B(s - hw, z1))
    win.quad(at(s - hw + 0.35, -d0 + 0.05, z0 + 0.35), at(s + hw - 0.35, -d0 + 0.05, z0 + 0.35), at(s + hw - 0.35, -d0 + 0.05, z1 - 0.4), at(s - hw + 0.35, -d0 + 0.05, z1 - 0.4))
    // the stepped zinc crest standing on the dormer's front
    const c0 = z1, cw2 = hw + 0.15
    const crest: [number, number][] = [[-cw2, c0], [cw2, c0], [cw2, c0 + 0.9], [0.75, c0 + 0.9], [0.75, c0 + 1.8], [0.3, c0 + 1.8], [0.0, c0 + 2.8], [-0.3, c0 + 1.8], [-0.75, c0 + 1.8], [-0.75, c0 + 0.9], [-cw2, c0 + 0.9]]
    for (const [dd, flip] of [[-d0 + 0.02, false], [-d0 - 0.4, true]] as [number, boolean][]) {
      const P = (q: [number, number]) => at(s + q[0], dd, q[1])
      const tris: [number, number, number][] = [[0, 1, 2], [0, 2, 10], [9, 3, 4], [9, 4, 8], [7, 5, 6]]
      for (const [i0, i1, i2] of tris) {
        // orient each so it faces outward (front) or inward (back)
        const A = P(crest[i0]), Bq = P(crest[i1]), C = P(crest[i2])
        const g = [(Bq[1] - A[1]) * (C[2] - A[2]) - (Bq[2] - A[2]) * (C[1] - A[1]), (Bq[2] - A[2]) * (C[0] - A[0]) - (Bq[0] - A[0]) * (C[2] - A[2])]
        const out = g[0] * nx + g[1] * ny > 0
        if (out !== flip) zinc.tri(A, Bq, C); else zinc.tri(A, C, Bq)
      }
    }
    // the crest's top edges (a thin roof between front and back plates), facing out of the outline
    for (let q = 0; q < crest.length; q++) {
      const A = crest[q], Cc = crest[(q + 1) % crest.length]
      if (A[1] === c0 && Cc[1] === c0) continue
      const ds = Cc[0] - A[0], dzz = Cc[1] - A[1]
      const want: V3 = [ux * dzz, uy * dzz, -ds] // outward (s, z) normal (dz, −ds) in the map frame
      const q4 = [at(s + A[0], -d0 + 0.02, A[1]), at(s + Cc[0], -d0 + 0.02, Cc[1]), at(s + Cc[0], -d0 - 0.4, Cc[1]), at(s + A[0], -d0 - 0.4, A[1])]
      const e1 = [q4[1][0] - q4[0][0], q4[1][1] - q4[0][1], q4[1][2] - q4[0][2]], e2 = [q4[3][0] - q4[0][0], q4[3][1] - q4[0][1], q4[3][2] - q4[0][2]]
      const g = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
      const dot = -(g[0] * want[0] + g[1] * want[1] + g[2] * want[2])
      if (dot < 0) zinc.quad(q4[0], q4[1], q4[2], q4[3]); else zinc.quad(q4[3], q4[2], q4[1], q4[0])
    }
  }
}

// ---------------------------------------------------------------- the prow and its tower
{
  const v5: XY = [-18.11, 45.94], v8: XY = [-14.97, 46.22]
  const uw: XY = [-0.232, -0.973], une: XY = [0.748, -0.664], bis = unit([0.30, -0.954, 0])
  const C: XY = [-16.54 + bis[0] * 6.6, 46.08 + bis[1] * 6.6]
  const Pw: XY = [v5[0] + uw[0] * 9.5, v5[1] + uw[1] * 9.5], Pne: XY = [v8[0] + une[0] * 9.5, v8[1] + une[1] * 9.5]
  const back: XY = [C[0] + bis[0] * 4.5, C[1] + bis[1] * 4.5]
  const prow: XY[] = [v5, Pw, back, Pne, v8]
  prism({ wall: brick, win: null, roof: slate, ring: prow, z0: EAVE - 0.5, z1: 23.6, facade: null, bevel: 0.2 })
  band(brick, prow.slice().reverse(), 23.0, 23.6, 0.2)
  const drum = (r: number, z0: number, z1: number, p: Part, n = 14, capTop = false) => {
    const lo = circle(C[0], C[1], r, n).map(([x, y]) => [x, y, z0] as V3), hi = circle(C[0], C[1], r, n).map(([x, y]) => [x, y, z1] as V3)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const na = unit([lo[i][0] - C[0], lo[i][1] - C[1], 0]), nb = unit([lo[j][0] - C[0], lo[j][1] - C[1], 0])
      p.tri(lo[i], lo[j], hi[j], undefined, undefined, undefined, [na, nb, nb])
      p.tri(lo[i], hi[j], hi[i], undefined, undefined, undefined, [na, nb, na])
    }
    if (capTop) p.cap(hi, true)
  }
  drum(3.6, 23.3, 28.3, stone)
  // tall windows round the lower drum
  for (let i = 0; i < 7; i++) {
    const t = (i / 7) * 2 * Math.PI + 0.2, c = Math.cos(t), s = Math.sin(t), r = 3.64, w = 0.5
    const P = (dw: number, z: number): V3 => [C[0] + r * c - s * dw, C[1] + r * s + c * dw, z]
    win.quad(P(-w, 24.2), P(w, 24.2), P(w, 27.4), P(-w, 27.4))
  }
  drum(4.1, 28.3, 28.8, zinc, 14, true)
  drum(3.2, 28.8, 31.4, stone)
  drum(3.45, 31.4, 31.8, zinc, 14, false)
  // the low dome: slate, from the cornice to 32.6, and a small lantern
  {
    const n = 14, rings: V3[][] = []
    for (let k = 0; k <= 4; k++) {
      const t = (k / 4) * (Math.PI / 2), r = 3.45 * Math.cos(t)
      rings.push(circle(C[0], C[1], Math.max(r, 0.6), n).map(([x, y]) => [x, y, 31.8 + 1.4 * Math.sin(t)] as V3))
    }
    for (let k = 0; k < 4; k++) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, nm = (q: V3): V3 => unit([(q[0] - C[0]) / 3.45, (q[1] - C[1]) / 3.45, (q[2] - 31.8) / 1.4])
      const A = rings[k][i], Bq = rings[k][j], Cq = rings[k + 1][j], D = rings[k + 1][i]
      slate.tri(A, Bq, Cq, undefined, undefined, undefined, [nm(A), nm(Bq), nm(Cq)])
      slate.tri(A, Cq, D, undefined, undefined, undefined, [nm(A), nm(Cq), nm(D)])
    }
    drum(0.65, 33.1, 34.0, stone, 8, false)
    const lt = circle(C[0], C[1], 0.75, 8).map(([x, y]) => [x, y, 34.0] as V3)
    for (let i = 0; i < 8; i++) zinc.tri(lt[i], lt[(i + 1) % 8], [C[0], C[1], 35.0])
  }
  // small pinnacles standing round the balcony
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * 2 * Math.PI + 0.5, x = C[0] + 3.7 * Math.cos(t), y = C[1] + 3.7 * Math.sin(t)
    block(stone, x - 0.25, y - 0.25, x + 0.25, y + 0.25, 28.8, 29.9)
    const b4: V3[] = [[x - 0.3, y - 0.3, 29.9], [x + 0.3, y - 0.3, 29.9], [x + 0.3, y + 0.3, 29.9], [x - 0.3, y + 0.3, 29.9]]
    for (let q = 0; q < 4; q++) zinc.tri(b4[q], b4[(q + 1) % 4], [x, y, 29.9])
  }
}

// ---------------------------------------------------------------- write
const lit = (p: V3, n: V3): number => (n[2] > 0.7 ? 0.1 : p[2] > 23 ? 0.9 : 0.5)
finishModel('Scheepvaarthuis', 'amsterdam-scheepvaarthuis', [
  { part: brick, material: { ...finish('scheepvaarthuis-brick', 0x74564d), floodlight: lit } },
  { part: slate, material: { ...PALETTE.roof, color: 0x878d94 } },
  { part: zinc, material: { ...finish('scheepvaarthuis-zinc', 0xe4e1da), floodlight: lit } },
  { part: win, material: PALETTE.window },
  { part: stone, material: { ...finish('scheepvaarthuis-stone', 0xb6b1a7), floodlight: lit } },
], { bearing: 0, osm: 'way/57863677', height: 35.0 }, 6500)
