/**
 * Belk Theater, Blumenthal Performing Arts Center, Charlotte (Cesar Pelli,
 * 1992) — procedural, CC0-1.0.
 * bun generators/belk-theater.ts
 *
 * Map frame: x east, y north, z up, metres, placed at bearing 317°: the
 * model's +y runs north-west along the outline's long side (way/502718738)
 * toward the plaza off North Tryon Street, so the curved glass lobby is the
 * model's north end, East 5th Street runs along its east face and North
 * College Street along its south face. The anchor is the outline's centroid.
 * Founders Hall and the Bank of America tower to the west are left to the map.
 *
 * What makes it the Belk: a low curved wall of glass between silver mullions
 * under a silver band, a glass canopy over the doors and a small glass dome on
 * the lobby roof; behind it the auditorium's buff brick drum, its front a
 * shallow arc banded in pale stone; then the stepped buff brick mass of the
 * stage end with its fly tower; and a red-brown brick arcade along 5th and
 * College Streets.
 *
 * Evidence (2026 rework):
 *  - Lidar: USGS 3DEP NC Phase 4 Mecklenburg 2016, 1 m DSM resampled into
 *    this frame. z=0 is the lowest ground, at the College Street end; the
 *    plaza by the lobby is 4.6 m higher. Measured: lobby roof 17.5 with the
 *    dome to 23 centred at (3, 49); the auditorium drum 23 (parapet 24),
 *    x −12…16, its front an arc of radius 17 reaching y 40.5; its aisles
 *    17.5; a 30 m block over x ±15, y −19…1, with 22.5 m wings; the stage end
 *    21 with the fly tower 35, x −5…11, back to y −25; the building's south
 *    face at y −51.5, 2 m beyond the OSM outline.
 *  - OSM: way/502718738 for the outline's east, west and lobby edges.
 *  - Photos: BroadwayTour.net, "Blumenthal Performing Arts Center in
 *    Charlotte, NC" (Flickr 7043851939 and 7043851891, CC BY-SA 2.0: the
 *    lobby glass, mullions, band and canopy); James Willamor, "Blumenthal
 *    Performing Arts, Charlotte" (Flickr 2947782874, CC BY-SA 2.0: the roof,
 *    dome and drum from above); Mapillary street view on 5th Street
 *    (CC BY-SA 4.0: the arcade and the buff brick east wall).
 *  - Estimated: the arcade's height and pier spacing, window rows, the bands.
 *
 * The old model had a single 31 m hall over the whole south end and the dome
 * 6 m south of where the lidar puts it; this one follows the lidar.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const tan = new Part(), brick = new Part(), alu = new Part(), steel = alu
const win = new Part(), glass = new Part(), roof = new Part()

type XY = [number, number]
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: V3[]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

// ---------------------------------------------------------------------------
// Polygon helpers: rings are counter-clockwise from above.

function area(r: XY[]) { let a = 0; r.forEach((p, i) => { const q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] }); return a / 2 }
function triangulate(r: XY[]): [number, number, number][] {
  const idx = r.map((_, i) => i), out: [number, number, number][] = []
  const cr = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: XY, a: XY, b: XY, c: XY) => cr(a, b, p) > 1e-9 && cr(b, c, p) > 1e-9 && cr(c, a, p) > 1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    for (let i = 0; i < idx.length; i++) {
      const a = idx[(i + idx.length - 1) % idx.length], b = idx[i], c = idx[(i + 1) % idx.length]
      if (cr(r[a], r[b], r[c]) <= 1e-9) continue
      if (idx.some((j) => j !== a && j !== b && j !== c && inside(r[j], r[a], r[b], r[c]))) continue
      out.push([a, b, c]); idx.splice(i, 1); break
    }
  }
  out.push([idx[0], idx[1], idx[2]])
  return out
}
function offset(r: XY[], d: number): XY[] {
  const n = r.length
  return r.map((p, i) => {
    const a = r[(i + n - 1) % n], b = r[(i + 1) % n]
    const e1 = unit([p[0] - a[0], p[1] - a[1], 0]), e2 = unit([b[0] - p[0], b[1] - p[1], 0])
    const n1: XY = [e1[1], -e1[0]], n2: XY = [e2[1], -e2[0]]
    const m = unit([n1[0] + n2[0], n1[1] + n2[1], 0]), cos = m[0] * n1[0] + m[1] * n1[1]
    const k = d / Math.max(cos, 0.3)
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
const edgeN = (a: XY, b: XY): V3 => unit([b[1] - a[1], -(b[0] - a[0]), 0])
/** Per-vertex normals: averaged across gentle bends (curves), split at corners. */
function vertexNormals(r: XY[], i: number, j: number): [V3, V3] {
  const n = r.length, N = edgeN(r[i], r[j])
  const prev = edgeN(r[(i + n - 1) % n], r[i]), next = edgeN(r[j], r[(j + 1) % n])
  const smooth = (a: V3, b: V3) => (a[0] * b[0] + a[1] * b[1] > Math.cos(Math.PI / 7) ? unit([a[0] + b[0], a[1] + b[1], 0]) : a)
  return [smooth(N, prev), smooth(N, next)]
}
function walls(p: Part, r: XY[], z0: number, z1: number) {
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length, a = r[i], b = r[j], [na, nb] = vertexNormals(r, i, j)
    quadN(p, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [na, nb, nb, na])
  }
}
function cap(p: Part, r: XY[], z: number, up = true) {
  const N: V3 = [0, 0, up ? 1 : -1]
  for (const [a, b, c] of triangulate(r)) {
    const A: V3 = [r[a][0], r[a][1], z], B: V3 = [r[b][0], r[b][1], z], C: V3 = [r[c][0], r[c][1], z]
    if (up) p.tri(A, B, C, undefined, undefined, undefined, [N, N, N])
    else p.tri(A, C, B, undefined, undefined, undefined, [N, N, N])
  }
}
/** A solid with a chamfered top edge of size b; the top goes to `top`. */
function prism(p: Part, r: XY[], z0: number, z1: number, b: number, top: Part = p) {
  walls(p, r, z0, z1 - b)
  const r2 = offset(r, -b)
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length, [na, nb] = vertexNormals(r, i, j)
    const ma = unit([na[0], na[1], 1]), mb = unit([nb[0], nb[1], 1])
    quadN(p, [r[i][0], r[i][1], z1 - b], [r[j][0], r[j][1], z1 - b], [r2[j][0], r2[j][1], z1], [r2[i][0], r2[i][1], z1], [ma, mb, mb, ma])
  }
  cap(top, r2, z1)
}
/** A quarter arc of radius R about c, from angle a0 to a1 (degrees), n segments. */
function arc(c: XY, R: number, a0: number, a1: number, n: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i <= n; i++) { const t = (a0 + (a1 - a0) * i / n) * Math.PI / 180; out.push([c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)]) }
  return out
}
/** A flat panel lying on a vertical wall, from p to q along it, z0 to z1, pushed out by o. */
function panel(part: Part, p: XY, q: XY, z0: number, z1: number, o = 0.04) {
  const N = edgeN(p, q), a: XY = [p[0] + N[0] * o, p[1] + N[1] * o], b: XY = [q[0] + N[0] * o, q[1] + N[1] * o]
  quadN(part, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1], [N, N, N, N])
}


// ---------------------------------------------------------------------------
// Dimensions, in the model frame (lidar and OSM).

const XW = -22.0, XE = 19.4      // Founders Hall side, 5th Street side
const YS = -51.5                 // College Street face (lidar)
const YN = 40                    // where the lobby meets the hall
const G_LOBBY = 4.6              // lobby floor above the College Street end
const Z_LOBBY = 17.5             // lobby roof (lidar)
const BAND = 4                   // the brushed-steel band round the lobby's top: a quarter of its height
const Z_ARC = 10                 // top of the arcade, level along the slope
const Z_AISLE = 17.5, Z_DRUM = 23, Z_WING = 22.5, Z_MID = 30, Z_STAGE = 21, Z_FLY = 35

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
// The auditorium drum: x −12…16, its front an arc about (2, 23.5), R 17.
const DRUM: XY[] = (() => {
  const c: XY = [2, 23.5], R = 17, a0 = Math.atan2(Math.sqrt(R * R - 14 * 14), 14) * 180 / Math.PI
  const ring: XY[] = [[-12, 1], [16, 1], ...arc(c, R, a0, 180 - a0, 12)]
  return ring
})()
// The lobby: the OSM curve, smoothed, from the 5th Street side round to the plaza.
const bez = (p0: XY, c: XY, p2: XY, n: number): XY[] => Array.from({ length: n + 1 }, (_, i) => {
  const t = i / n, s = 1 - t
  return [s * s * p0[0] + 2 * s * t * c[0] + t * t * p2[0], s * s * p0[1] + 2 * s * t * c[1] + t * t * p2[1]] as XY
})
const CURVE = bez([16.6, 60.9], [-8.5, 60.2], [-10.2, 46.5], 18)
const LOBBY: XY[] = [[XW, YN], [XE, YN], [18.8, 49.2], [16.6, 49.1], ...CURVE, [-21.1, 46.7]]
for (const r of [DRUM, LOBBY]) if (area(r) <= 0) throw new Error('rings must be counter-clockwise')

// ---------------------------------------------------------------------------
// The ground storey. Along 5th Street (east) and College Street (south) it is
// an arcade: red-brown brick piers on the building line carrying a brick
// beam, in front of a buff wall set 2.5 m back, with shopfront glass between.
const FOOT = rect(XW, YS, XE, YN)
const AR = 2.5, Z_BEAM = Z_ARC - 1.6
prism(tan, rect(XW, YS + AR, XE - AR, YN), 0, Z_BEAM, 0, tan)
panel(brick, [XW, YN], [XW, YS + AR], 0, Z_BEAM, 0.03) // no arcade on the Founders Hall side
walls(brick, FOOT, Z_BEAM, Z_ARC)
cap(brick, FOOT, Z_BEAM, false)
{
  // Broad bays with stout piers: a fine comb of piers reads as stripes at map scale.
  const PW = 2.0
  const pier = (x0: number, x1: number, y0: number, y1: number) => prism(brick, rect(x0, y0, x1, y1), 0, Z_BEAM, 0, brick)
  const n = 10, ys = Array.from({ length: n + 1 }, (_, i) => YS + PW / 2 + (YN - PW - YS) * i / n)
  ys.forEach((y, i) => {
    pier(XE - AR, XE, y - PW / 2, y + PW / 2)
    if (i < n) panel(win, [XE - AR, y + PW / 2 + 0.8], [XE - AR, ys[i + 1] - PW / 2 - 0.8], 0, Z_BEAM - 2.2)
  })
  const m = 5, xs = Array.from({ length: m + 1 }, (_, i) => XW + PW / 2 + (XE - XW - PW) * i / m)
  xs.forEach((x, i) => {
    if (i < m) pier(x - PW / 2, x + PW / 2, YS, YS + AR)
    if (i < m) panel(win, [xs[i + 1] - PW / 2 - 0.8, YS + AR], [x + PW / 2 + 0.8, YS + AR], 0, Z_BEAM - 2.2)
  })
}

// ---------------------------------------------------------------------------
// The masses above the arcade, south to north, each buff brick with a pale
// coping. A pale stone string course runs round them over the arcade beam.
const COPE = 0.8
function mass(r: XY[], z0: number, z1: number) {
  prism(tan, r, z0, z1 - COPE, 0, tan)
  prism(alu, offset(r, 0.12), z1 - COPE, z1, 0.12, roof)
}
prism(alu, offset(FOOT, 0.12), Z_ARC, Z_ARC + 0.8, 0.12, tan)
mass(rect(XW, YS, XE, -19), Z_ARC + 0.8, Z_STAGE)          // the stage end
mass(rect(-5, YS + 0.5, 11, -25), Z_STAGE, Z_FLY)           // its fly tower
mass(rect(XW, -19, XE, 1), Z_ARC + 0.8, Z_WING)             // wings either side of…
mass(rect(-15, -19, 15, 1), Z_WING, Z_MID)                  // …the block over the proscenium
mass(rect(XW, 1, XE, YN), Z_ARC + 0.8, Z_AISLE)             // the auditorium's aisles
mass(rect(XW, 1, -12, 18), Z_AISLE, Z_WING)                 // a higher wing on the west
mass(DRUM, Z_AISLE, Z_DRUM + 1)                             // the drum
// Pale stone bands round the drum, as in Willamor's photo from above.
for (const z of [Z_AISLE + 1.6, Z_AISLE + 3.4]) walls(alu, offset(DRUM, 0.05), z, z + 0.45)

// Windows: rows of broad panels under the coping on the street faces, two
// floors tall with brick piers between (the 5th Street view).
function windowRow(p: XY, q: XY, z0: number, z1: number, bay = 4.2, pier = 1.6) {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.max(1, Math.round(L / bay)), t: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
  for (let i = 0; i < n; i++) {
    const a: XY = [p[0] + t[0] * (L * i / n + pier / 2), p[1] + t[1] * (L * i / n + pier / 2)]
    const b: XY = [p[0] + t[0] * (L * (i + 1) / n - pier / 2), p[1] + t[1] * (L * (i + 1) / n - pier / 2)]
    panel(win, a, b, z0, z1)
  }
}
windowRow([XE, 1.5], [XE, YN - 1], 12.5, 15.8)           // 5th Street, along the aisles
windowRow([XE, -18.5], [XE, 0.5], 14.5, 20.5)            // 5th Street, the wings
windowRow([XE, YS + 1], [XE, -19.5], 13.5, 19.5)         // 5th Street, the stage end
windowRow([XW + 1, YS], [XE - 1, YS], 13.5, 19.5)        // College Street

// The lobby: a curved glass wall under a silver band, on the higher ground.
{
  const front = [[18.8, 49.2] as XY, [16.6, 49.1] as XY, ...CURVE, [-21.1, 46.7] as XY]
  // The solid behind the glass, then the glass itself just outside it.
  prism(tan, LOBBY, 0, Z_LOBBY - BAND, 0, roof)
  for (let i = 0; i < front.length - 1; i++) {
    const a = front[i], b = front[i + 1], [na, nb] = vertexNormals(LOBBY, (i + 2) % LOBBY.length, (i + 3) % LOBBY.length)
    const o = 0.04, A: XY = [a[0] + na[0] * o, a[1] + na[1] * o], B: XY = [b[0] + nb[0] * o, b[1] + nb[1] * o]
    quadN(win, [A[0], A[1], 0], [B[0], B[1], 0], [B[0], B[1], Z_LOBBY - BAND], [A[0], A[1], Z_LOBBY - BAND], [na, nb, nb, na])
  }
  // The straight run along 5th Street to the hall, glazed too.
  panel(win, [XE, YN + 0.5], [18.8, 49.2], 0, Z_LOBBY - BAND)
  // Its mullions, and those of the short straight face to the plaza.
  for (const [p, q] of [[[XE, YN], [18.8, 49.2]], [[-10.2, 46.5], [-21.1, 46.7]]] as [XY, XY][]) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), k = Math.max(1, Math.round(L / 3.4)), N = edgeN(p, q)
    const t: XY = [(q[0] - p[0]) / L, (q[1] - p[1]) / L]
    for (let i = 1; i < k; i++) {
      const c: XY = [p[0] + t[0] * L * i / k + N[0] * 0.05, p[1] + t[1] * L * i / k + N[1] * 0.05], w = 0.22, d = 0.35
      const r: XY[] = [[c[0] - t[0] * w, c[1] - t[1] * w], [c[0] + t[0] * w, c[1] + t[1] * w], [c[0] + t[0] * w + N[0] * d, c[1] + t[1] * w + N[1] * d], [c[0] - t[0] * w + N[0] * d, c[1] - t[1] * w + N[1] * d]]
      prism(alu, area(r) > 0 ? r : r.reverse(), G_LOBBY - 1, Z_LOBBY - BAND, 0, alu)
    }
  }
  // The silver band, bevelled.
  prism(steel, offset(LOBBY, 0.05), Z_LOBBY - BAND, Z_LOBBY, 0.2, roof)
  // Silver mullions: one at every other vertex of the curve, full height.
  // one broad silver pier for every two of the real mullions
  for (let i = 0; i < CURVE.length; i += 2) {
    const p = CURVE[i], n = vertexNormals(CURVE, Math.max(i - 1, 0), i)[1]
    const t: XY = [-n[1], n[0]], w = 0.4, o = 0.05, d = 0.4
    const r: XY[] = [
      [p[0] + t[0] * w + n[0] * o, p[1] + t[1] * w + n[1] * o], [p[0] - t[0] * w + n[0] * o, p[1] - t[1] * w + n[1] * o],
      [p[0] - t[0] * w + n[0] * (o + d), p[1] - t[1] * w + n[1] * (o + d)], [p[0] + t[0] * w + n[0] * (o + d), p[1] + t[1] * w + n[1] * (o + d)],
    ]
    prism(alu, area(r) > 0 ? r : r.reverse(), G_LOBBY - 1, Z_LOBBY - BAND, 0, alu)
  }
  // A transom line across the glass, where the canopy meets it.
  for (let i = 0; i < CURVE.length - 1; i++) {
    const a = CURVE[i], b = CURVE[i + 1], N = edgeN(a, b), o = 0.08
    quadN(alu, [a[0] + N[0] * o, a[1] + N[1] * o, G_LOBBY + 4.3], [b[0] + N[0] * o, b[1] + N[1] * o, G_LOBBY + 4.3], [b[0] + N[0] * o, b[1] + N[1] * o, G_LOBBY + 4.8], [a[0] + N[0] * o, a[1] + N[1] * o, G_LOBBY + 4.8], [N, N, N, N])
  }
  // The glass canopy, a thin slab 2.6 m out from the curve.
  const out = CURVE.map((p, i) => {
    const n = i === 0 ? edgeN(p, CURVE[1]) : i === CURVE.length - 1 ? edgeN(CURVE[i - 1], p) : unit([...((a, b) => [a[0] + b[0], a[1] + b[1]])(edgeN(CURVE[i - 1], p), edgeN(p, CURVE[i + 1])), 0] as V3)
    return [p[0] + n[0] * 2.2, p[1] + n[1] * 2.2] as XY
  })
  const ring: XY[] = [...CURVE.slice(1, -1), ...out.slice(1, -1).reverse()]
  const zc = G_LOBBY + 4.6
  prism(glass, area(ring) > 0 ? ring : ring.reverse(), zc - 0.25, zc, 0, glass)
  // Underside of the canopy.
  cap(glass, area(ring) > 0 ? ring : ring.reverse(), zc - 0.25, false)
}

// The glass dome on the lobby roof, on a short silver drum.
{
  const c: XY = [3, 49], R = 5.8, z0 = Z_LOBBY, seg = 16, rings = 5
  const drum = Array.from({ length: seg }, (_, i) => [c[0] + R * Math.cos(i / seg * 2 * Math.PI), c[1] + R * Math.sin(i / seg * 2 * Math.PI)] as XY)
  prism(alu, drum, z0 - 0.5, z0 + 0.7, 0.15, alu)
  const zb = z0 + 0.7, Rd = R - 0.15
  const pt = (i: number, k: number): V3 => {
    const ph = (k / rings) * Math.PI / 2, th = (i / seg) * 2 * Math.PI
    return [c[0] + Rd * Math.cos(ph) * Math.cos(th), c[1] + Rd * Math.cos(ph) * Math.sin(th), zb + Rd * 0.85 * Math.sin(ph)]
  }
  const nrm = (i: number, k: number): V3 => {
    const ph = (k / rings) * Math.PI / 2, th = (i / seg) * 2 * Math.PI
    return unit([Math.cos(ph) * Math.cos(th), Math.cos(ph) * Math.sin(th), Math.sin(ph) / 0.85])
  }
  for (let k = 0; k < rings; k++) for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg
    if (k === rings - 1) glass.tri(pt(i, k), pt(j, k), pt(i, k + 1), undefined, undefined, undefined, [nrm(i, k), nrm(j, k), nrm(i, k + 1)])
    else quadN(glass, pt(i, k), pt(j, k), pt(j, k + 1), pt(i, k + 1), [nrm(i, k), nrm(j, k), nrm(j, k + 1), nrm(i, k + 1)])
  }
  // Ribs: eight meridians and one ring of silver, lifted off the glass.
  const lift = (i: number, k: number, d = 0.08): V3 => { const p = pt(i, k), n = nrm(i, k); return [p[0] + n[0] * d, p[1] + n[1] * d, p[2] + n[2] * d] }
  const dw = 0.22 / Rd * seg / (2 * Math.PI)
  for (let i = 0; i < seg; i += 2) for (let k = 0; k < rings - 1; k++)
    quadN(alu, lift(i - dw, k), lift(i + dw, k), lift(i + dw, k + 1), lift(i - dw, k + 1), [nrm(i, k), nrm(i, k), nrm(i, k + 1), nrm(i, k + 1)])
  for (let i = 0; i < seg; i++) {
    const k = 2, dk = 0.22 / Rd * rings * 2 / Math.PI
    quadN(alu, lift(i, k - dk), lift(i + 1, k - dk), lift(i + 1, k + dk), lift(i, k + dk), [nrm(i, k), nrm(i + 1, k), nrm(i + 1, k), nrm(i, k)])
  }
}



// ---------------------------------------------------------------------------

// Colours from the daylight photos: the buff brick, a red-brown base pulled
// light, brushed aluminium, light slate glass, the pale dome.
const parts = [
  { part: tan, material: finish('buff-brick', 0xe3d2b6) },
  { part: brick, material: finish('red-brick', 0xb98a78) },
  // brushed steel and aluminium, bright as in the lobby photos
  { part: alu, material: finish('aluminium', 0xe4e8ea, 0.45) },
  // The glass reads light and silvery by day, so a lighter slate than the default.
  { part: win, material: { ...PALETTE.window, color: 0xa9bfd1 } },
  // the dome and canopy: pale glass
  { part: glass, material: { ...PALETTE.glass, color: 0xc4d7e4 } },
  { part: roof, material: PALETTE.roof },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join(', '))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Belk Theater', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 317, osm: 'way/502718738', height: Z_FLY,
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const outFile = process.argv[2] ?? new URL('../models/belk-theater.glb', import.meta.url).pathname
await Bun.write(outFile, glb)
console.log(`${outFile}: ${triangles} triangles, ${glb.length} bytes`)
