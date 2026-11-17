/**
 * IFC Seoul (International Finance Centre Seoul), Yeouido — original
 * procedural geometry, CC0-1.0.
 * bun generators/seoul-ifc.ts
 *
 * One model for the whole complex: One IFC, Two IFC, Three IFC, the Conrad
 * Seoul and the two glass pavilions over the underground IFC Mall.
 *
 * Map frame turned to the Yeouido grid: +y runs to compass 52 (north-east),
 * +x to compass 142 (south-east), z up, metres. BEARING 52 (every tower edge
 * in OSM runs at 52.0-52.5 or its perpendicular). Origin = centroid of the
 * complex's OSM landuse outline way/681056644 "IFC 서울".
 *
 * Evidence
 * - OSM building ways (outlines traced in plan, used as the plan at the
 *   ground and at the roof):
 *   way/621752528 Three IFC, height 283, 55 levels: 38 x 64 m rectangle with
 *     a 22 m chamfer on its north corner and a 3.5 m one on its south corner.
 *   way/621752526 One IFC, height 185, 32 levels, with parts 639943642 (185),
 *     639943641 (skillion, 185: the sloped crown over the west corner) and
 *     639943643 (a 5 m2 sliver, 120): 59 x 33 m with a 20 m chamfer on the
 *     east corner.
 *   way/621752527 Two IFC, height 176, 29 levels: 60 x 40 m with chamfers of
 *     26-29 m (west corner) and 17-20 m (east corner).
 *   way/500362301 Conrad Seoul, height 199, 38 levels, with parts 621752531
 *     (the 62 x 24.5 m hotel slab, 200) and 621752532 (the podium, 50).
 *   way/1465162037 "IFC mall (North Gate)" and way/1465162036 "IFC mall
 *     (South Gate)" (no height): the glass pavilions.
 * - Published: Three IFC 284 m, 55 storeys; One IFC 32 storeys; Conrad 199 m,
 *   38 storeys (Wikipedia "International Finance Centre Seoul", CTBUH Skyscraper
 *   Center); architects Arquitectonica, 2011-2013.
 * - Commons photos (daylight):
 *   "IFC Seoul 3.jpg" (Kimahrikku, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:IFC_Seoul_3.jpg): Three IFC and
 *     Two IFC: the folded chamfer facets (wide at the roof and the ground,
 *     pinched to a point part way up), the diagonal mullion lines, the
 *     helipad ring on Three IFC.
 *   "IFC Seoul 2.jpg" and "IFC Seoul.jpg" (Kimahrikku, CC BY-SA 4.0): from
 *     Yeouido Hangang Park: the dark-glass Conrad with its folded corner and
 *     "CONRAD" sign, the paler glass towers behind.
 *   "Yeouido 9.jpg", "Yeouido 1.jpg", "Yeouido 14.jpg" (kallerna, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Yeouido_9.jpg etc.): from
 *     Yeouido Park in the west: Two IFC's inverted-triangle facets in front of
 *     Three IFC, One IFC's sloped top beside Parc.1.
 *   "20260726 IFC몰 여의도 내부.jpg" (Striker9498, CC0): the pavilion's
 *     faceted glass roof from inside.
 *   Colours: glass sampled #6b7f90-#718ca5 (hazy day, Kimahrikku), pale and
 *   silvery in the kallerna photos: drawn #a3b8ca; Conrad #465159, pulled to
 *   #5b6670.
 *
 * Estimated: where each chamfer pinches (from the photos' fold lines, as a
 * fraction of the height), One IFC's crown slope (12 m drop over the west
 * corner), the helipad (37 m ring, 6-8.5 m above Three IFC's roof, scaled from
 * the tower's width in "IFC Seoul 3"), Two IFC's height (OSM 176; no
 * published figure found), the pavilions' heights (8 to 15 m, sloped roofs;
 * no exterior photo of them was found), the podium's glazing.
 * Invented: the floor-group lines (every four storeys) standing for the fine
 * glass grid. No lidar exists for Korea and the map's terrain (Mapterhorn)
 * has no tiles over Seoul; Yeouido is flat reclaimed land.
 *
 * Night: the office and hotel floors are lit (window-2, window-3); the
 * pavilions' structural glass stays dark (glass).
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'

const BEARING = 52
const ANCHOR = { lng: 126.925798, lat: 37.52529 }

const glassT = new Part(), glassF = new Part(), conrad = new Part(), trim = new Part(), roof = new Part(), pav = new Part()

type Tri = [V3, V3, V3]

/**
 * A rectangle x0..x1, y0..y1 with its corners cut: c = [sw, se, ne, nw],
 * each [along x, along y]. 8 points, counter-clockwise from above, starting
 * on the south (-y) edge. A zero chamfer is drawn as a 0.6 m bevel.
 */
function octo(x0: number, x1: number, y0: number, y1: number, c: [number, number][], z: number): V3[] {
  const k = c.map(([a, b]) => [Math.max(a, 0.6), Math.max(b, 0.6)])
  return [
    [x0 + k[0][0], y0, z], [x1 - k[1][0], y0, z],
    [x1, y0 + k[1][1], z], [x1, y1 - k[2][1], z],
    [x1 - k[2][0], y1, z], [x0 + k[3][0], y1, z],
    [x0, y1 - k[3][1], z], [x0, y0 + k[0][1], z],
  ]
}

/** Loft rings as flat triangles (folds show as facets); returns the triangles. */
function loftTris(p: Part, rings: V3[][]): Tri[] {
  const out: Tri[] = []
  const n = rings[0].length
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a = rings[k][i], b = rings[k][j], c = rings[k + 1][j], d = rings[k + 1][i]
    out.push([a, b, c], [a, c, d])
    // a folded quad: draw its fold (the a-c diagonal) as a pale mullion line
    const n1 = nrm(a, b, c), n2 = nrm(a, c, d)
    // the chamfer facets (normals off the plan axes, or tilted) take the
    // second, darker glass so the folded triangles read against the faces
    const off = (m: V3) => Math.abs(m[2]) > 0.02 || (Math.abs(m[0]) > 0.2 && Math.abs(m[1]) > 0.2)
    const pick = (m: V3) => (p === glassT && off(m) ? glassF : p)
    pick(n1).tri(a, b, c); pick(n2).tri(a, c, d)
    if (n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2] < 0.9995) foldLine(a, c, [(n1[0] + n2[0]) / 2, (n1[1] + n2[1]) / 2, (n1[2] + n2[2]) / 2])
    // a slanted corner edge (the side of a chamfer triangle): also a pale line
    if (Math.hypot(d[0] - a[0], d[1] - a[1]) > 2) foldLine(a, d, n1)
  }
  return out
}
function nrm(a: V3, b: V3, c: V3): V3 {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const l = Math.hypot(...n) || 1
  return [n[0] / l, n[1] / l, n[2] / l]
}
/** A pale strip along a fold, 1.6 m wide (bold, to read at 200 px), standing just off the surface. */
function foldLine(a: V3, c: V3, n: V3) {
  const d = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let w: V3 = [d[1] * n[2] - d[2] * n[1], d[2] * n[0] - d[0] * n[2], d[0] * n[1] - d[1] * n[0]]
  const l = Math.hypot(...w) || 1
  w = [(w[0] / l) * 0.8, (w[1] / l) * 0.8, (w[2] / l) * 0.8]
  const o = 0.12, sh = (q: V3, s: number): V3 => [q[0] + n[0] * o + w[0] * s, q[1] + n[1] * o + w[1] * s, Math.max(0, q[2] + n[2] * o + w[2] * s)]
  trim.tri(sh(a, -1), sh(c, -1), sh(c, 1), undefined, undefined, undefined, [n, n, n])
  trim.tri(sh(a, -1), sh(c, 1), sh(a, 1), undefined, undefined, undefined, [n, n, n])
}

/** Flat cap over a ring (fan; the rings here are convex). */
function capRing(p: Part, ring: V3[], up = true) { p.cap(ring, up) }

/** Thin lines lying on the faces of `tris` at height z (strip of height h, standing off `off`). */
function lines(p: Part, tris: Tri[], z: number, h: number, off = 0.08) {
  for (const t of tris) {
    const seg = (zz: number): V3[] | null => {
      const pts: V3[] = []
      for (let i = 0; i < 3; i++) {
        const a = t[i], b = t[(i + 1) % 3]
        if ((a[2] - zz) * (b[2] - zz) < 0 || (a[2] === zz && b[2] !== zz)) {
          const s = (zz - a[2]) / (b[2] - a[2])
          pts.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, zz])
        }
      }
      return pts.length >= 2 ? [pts[0], pts[1]] : null
    }
    const lo = seg(z - h / 2), hi = seg(z + h / 2)
    if (!lo || !hi) continue
    const u = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]], v = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]]
    let nx = u[1] * v[2] - u[2] * v[1], ny = u[2] * v[0] - u[0] * v[2], nz = u[0] * v[1] - u[1] * v[0]
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l
    const o = (q: V3): V3 => [q[0] + nx * off, q[1] + ny * off, q[2] + nz * off]
    // match the endpoints of the two segments by proximity
    let [a0, a1] = lo, [b0, b1] = hi
    if (Math.hypot(a0[0] - b0[0], a0[1] - b0[1]) > Math.hypot(a0[0] - b1[0], a0[1] - b1[1])) [b0, b1] = [b1, b0]
    // wind to face outward along the triangle normal
    const e = [a1[0] - a0[0], a1[1] - a0[1], 0], up = [0, 0, 1]
    const cr = [e[1] * up[2] - e[2] * up[1], e[2] * up[0] - e[0] * up[2], 0]
    if (cr[0] * nx + cr[1] * ny >= 0) p.quad(o(a0), o(a1), o(b1), o(b0))
    else p.quad(o(a1), o(a0), o(b0), o(b1))
  }
}

/**
 * A folded tower: OSM chamfers at the ground and the roof, each pinched to a
 * bevel at its own height `pinch` (fraction of the height) so the corner
 * facets read as the long triangles of the real facades.
 */
function tower(p: Part, x0: number, x1: number, y0: number, y1: number, c: [number, number][], pinch: number[], H: number, every: number) {
  const zs = [...new Set([0, ...pinch.filter((f) => f > 0 && f < 1).map((f) => f * H), H])].sort((a, b) => a - b)
  const rings = zs.map((z) => octo(x0, x1, y0, y1, c.map(([a, b], i) => {
    const f = pinch[i], zp = f * H
    if (f <= 0 || f >= 1) return [a, b] as [number, number]
    const s = z <= zp ? 1 - z / zp : (z - zp) / (H - zp)
    return [a * s, b * s] as [number, number]
  }), z))
  const tris = loftTris(p, rings)
  void every
  return rings[rings.length - 1]
}

/** Parapet ring + roof deck inside a top ring. */
function topOff(top: V3[], H: number) {
  const inner = top.map(([x, y]) => {
    const cx = top.reduce((s, q) => s + q[0], 0) / top.length, cy = top.reduce((s, q) => s + q[1], 0) / top.length
    const d = Math.hypot(x - cx, y - cy)
    return [x - ((x - cx) / d) * 0.9, y - ((y - cy) / d) * 0.9, H] as V3
  })
  const deck = inner.map(([x, y]) => [x, y, H - 1.2] as V3)
  const n = top.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    trim.quad(top[i], top[j], inner[j], inner[i])
    trim.quad(inner[i], inner[j], deck[j], deck[i])
  }
  capRing(roof, deck)
  return deck
}

// ---------------- Three IFC ----------------
const H3 = 284
{
  const top = tower(glassT, 5.7, 43.6, -45.9, 18.4, [[0, 0], [3.5, 3.5], [0, 0], [21.7, 22.5]], [0, 0.5, 0, 0.55], H3, 20)
  const deck = topOff(top, H3)
  // plant block and the helipad ring on its frame
  const cx = 24.6, cy = -14
  const sq = (h: number, z: number): V3[] => [[cx - h, cy - h, z], [cx + h, cy - h, z], [cx + h, cy + h, z], [cx - h, cy + h, z]]
  roof.loft([sq(7, H3 - 1.2), sq(7, H3 + 3.5)]); roof.cap(sq(7, H3 + 3.5), true)
  const N = 24, R0 = 18.5, R1 = 15, z0 = H3 + 6, z1 = H3 + 8.5
  const ringPt = (r: number, a: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let i = 0; i < N; i++) {
    const a = (2 * Math.PI * i) / N, b = (2 * Math.PI * (i + 1)) / N
    trim.quad(ringPt(R0, a, z0), ringPt(R0, b, z0), ringPt(R0, b, z1), ringPt(R0, a, z1)) // outer rim
    trim.quad(ringPt(R1, b, z0), ringPt(R1, a, z0), ringPt(R1, a, z1), ringPt(R1, b, z1)) // inner rim
    trim.quad(ringPt(R1, a, z1), ringPt(R0, a, z1), ringPt(R0, b, z1), ringPt(R1, b, z1)) // top
    trim.quad(ringPt(R0, a, z0), ringPt(R1, a, z0), ringPt(R1, b, z0), ringPt(R0, b, z0)) // underside
  }
  // deck disc inside the ring (the landing pad) and four struts down to the plant
  const pad: V3[] = []
  for (let i = 0; i < N; i++) pad.push(ringPt(R1, (2 * Math.PI * i) / N, z1 - 0.3))
  roof.cap(pad, true); roof.cap(pad, false)
  for (let q = 0; q < 8; q++) {
    const a = Math.PI / 8 + (q * Math.PI) / 4, w = 0.8
    const b0 = ringPt(6.5, a, H3 + 3.5), b1 = ringPt(R0 - 1, a, z0)
    const tx = -Math.sin(a) * w, ty = Math.cos(a) * w
    trim.sweep([
      [[b0[0] - tx, b0[1] - ty, b0[2]], [b0[0] + tx, b0[1] + ty, b0[2]], [b0[0] + tx, b0[1] + ty, b0[2] + 1.2], [b0[0] - tx, b0[1] - ty, b0[2] + 1.2]],
      [[b1[0] - tx, b1[1] - ty, b1[2] - 1.2], [b1[0] + tx, b1[1] + ty, b1[2] - 1.2], [b1[0] + tx, b1[1] + ty, b1[2]], [b1[0] - tx, b1[1] - ty, b1[2]]],
    ])
  }
  void deck
}

// ---------------- Two IFC ----------------
const H2 = 176
{
  const top = tower(glassT, -73.4, -13.4, -96.3, -56.3, [[25.8, 29.4], [0, 0], [17.1, 19.9], [0, 0]], [0.62, 0, 0.38, 0], H2, 20)
  topOff(top, H2)
  const deck = H2 - 1.2
  roof.loft([[[-50, -82, deck], [-36, -82, deck], [-36, -70, deck], [-50, -70, deck]], [[-50, -82, H2 + 3], [-36, -82, H2 + 3], [-36, -70, H2 + 3], [-50, -70, H2 + 3]]])
  roof.cap([[-50, -82, H2 + 3], [-36, -82, H2 + 3], [-36, -70, H2 + 3], [-50, -70, H2 + 3]], true)
}

// ---------------- One IFC (sloped crown over the west corner) ----------------
const H1 = 185
{
  const x0 = -72.2, x1 = -12.9, y0 = 48.5, y1 = 81.6
  const c: [number, number][] = [[0, 0], [14.7, 13.9], [0, 0], [0, 0]]
  // body to the crown's lowest point, then the crown: the west (-x,+y) corner dropped 12 m
  const LOW = H1 - 14
  const ringAt = (z: number) => octo(x0, x1, y0, y1, c.map(([a, b]) => {
    const zp = 0.5 * H1, s = z <= zp ? 1 - z / zp : (z - zp) / (H1 - zp)
    return [a * s, b * s] as [number, number]
  }), z)
  const r0 = ringAt(0), rp = ringAt(0.5 * H1), rl = ringAt(LOW)
  // sloped top: height falls linearly toward the west corner along the diagonal
  const topZ = (x: number, y: number) => {
    const t = Math.max(0, Math.min(1, ((x1 - x) / (x1 - x0) + (y - y0) / (y1 - y0)) - 1)) // 0 at the middle diagonal, 1 at the west corner
    return H1 - 12 * t
  }
  const rt = ringAt(H1).map(([x, y]) => [x, y, topZ(x, y)] as V3)
  const tris = loftTris(glassT, [r0, rp, rl, rt])
  void tris
  // the roof plane (non-planar ring: fan from its centre)
  const cxr = rt.reduce((s, q) => s + q[0], 0) / 8, cyr = rt.reduce((s, q) => s + q[1], 0) / 8
  const ctr: V3 = [cxr, cyr, topZ(cxr, cyr)]
  for (let i = 0; i < 8; i++) roof.tri(ctr, rt[i], rt[(i + 1) % 8])
  // a pale edge along the sloped crown
  for (let i = 0; i < 8; i++) {
    const a = rt[i], b = rt[(i + 1) % 8]
    trim.quad([a[0], a[1], a[2] - 1.2], [b[0], b[1], b[2] - 1.2], b, a)
  }
}

// ---------------- Conrad Seoul: 50 m podium and 199 m slab, dark glass ----------------
const HC = 199
{
  // podium (way/621752532 and the slab's footprint): 3.5..74 x 38.7..90.9
  const P = 50
  const box = (p: Part, xa: number, xb: number, ya: number, yb: number, za: number, zb: number) => {
    const r = (z: number): V3[] => [[xa, ya, z], [xb, ya, z], [xb, yb, z], [xa, yb, z]]
    p.loft([r(za), r(zb)]); p.cap(r(zb), true)
  }
  box(conrad, 3.5, 74, 38.7, 87.8, 0, P)
  roof.cap([[4.2, 39.4, P + 0.05], [73.3, 39.4, P + 0.05], [73.3, 66.4, P + 0.05], [4.2, 66.4, P + 0.05]], true)
  // slab with the folded north-west end: its west corner chamfer pinched mid-height
  const top = tower(conrad, 8.1, 70.1, 66.4, 90.9, [[0, 0], [0, 0], [0, 0], [9, 9]], [0, 0, 0, 0.45], HC, 20)
  topOff(top, HC)
  box(roof, 20, 58, 72, 86, HC - 1.2, HC + 4)
  // the CONRAD sign band (pale) high on the south-west face
  trim.quad([68, 90.95, HC - 9], [68, 90.95, HC - 6], [48, 90.95, HC - 6], [48, 90.95, HC - 9])
}

// ---------------- Mall pavilions (structural glass, sloped faceted roofs) ----------------
function pavilion(pts: [number, number][], zLow: number, zHigh: number, dir: [number, number]) {
  // roof height varies linearly along dir across the footprint
  const proj = pts.map(([x, y]) => x * dir[0] + y * dir[1])
  const mn = Math.min(...proj), mx = Math.max(...proj)
  const zOf = (i: number) => zLow + ((proj[i] - mn) / (mx - mn)) * (zHigh - zLow)
  const n = pts.length
  // ensure counter-clockwise
  let area = 0
  for (let i = 0; i < n; i++) { const [a, b] = pts[i], [c, d] = pts[(i + 1) % n]; area += a * d - c * b }
  const P = area > 0 ? pts : [...pts].reverse()
  const Z = area > 0 ? pts.map((_, i) => zOf(i)) : pts.map((_, i) => zOf(i)).reverse()
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const a: V3 = [P[i][0], P[i][1], 0], b: V3 = [P[j][0], P[j][1], 0]
    pav.quad(a, b, [b[0], b[1], Z[j]], [a[0], a[1], Z[i]])
    // frame: corner posts and roof edges
    const ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey), ux = ex / L, uy = ey / L, nx = uy, ny = -ux, w = 0.5
    trim.quad([a[0] + nx * 0.1, a[1] + ny * 0.1, Z[i] - 0.8], [b[0] + nx * 0.1, b[1] + ny * 0.1, Z[j] - 0.8], [b[0] + nx * 0.1, b[1] + ny * 0.1, Z[j]], [a[0] + nx * 0.1, a[1] + ny * 0.1, Z[i]])
    trim.quad([a[0] + nx * 0.1, a[1] + ny * 0.1, 0], [a[0] + nx * 0.1 + ux * w * 2, a[1] + ny * 0.1 + uy * w * 2, 0], [a[0] + nx * 0.1 + ux * w * 2, a[1] + ny * 0.1 + uy * w * 2, Z[i]], [a[0] + nx * 0.1, a[1] + ny * 0.1, Z[i]])
  }
  // roof: fan from the centroid (planar, since height is linear)
  const cx = P.reduce((s, q) => s + q[0], 0) / n, cy = P.reduce((s, q) => s + q[1], 0) / n
  const cz = zLow + ((cx * dir[0] + cy * dir[1] - mn) / (mx - mn)) * (zHigh - zLow)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    pav.tri([cx, cy, cz], [P[i][0], P[i][1], Z[i]], [P[j][0], P[j][1], Z[j]])
  }
  // roof ribs: a pale triangulated pattern of three ribs from the centre
  for (const i of [0, Math.floor(n / 3), Math.floor((2 * n) / 3)]) {
    const a: V3 = [cx, cy, cz + 0.12], b: V3 = [P[i][0], P[i][1], Z[i] + 0.12]
    const ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey), px = (-ey / L) * 0.5, py = (ex / L) * 0.5
    trim.quad([b[0] - px, b[1] - py, b[2]], [b[0] + px, b[1] + py, b[2]], [a[0] + px, a[1] + py, a[2]], [a[0] - px, a[1] - py, a[2]])
  }
}
pavilion([[-16.5, -21], [-41.5, -32.3], [-66.1, 23], [-41.1, 34.3]], 6, 15, [0, 1])
pavilion([[65.5, -78.9], [61, -92.3], [11.3, -91.8], [11.9, -74.8], [19.5, -74.9], [11, -68.7], [22.1, -53.1], [72.6, -73.7]], 5, 13, [-1, 1])

const parts = [
  { part: glassT, material: windowVariant(2, 0xa3b8ca) },
  { part: glassF, material: windowVariant(4, 0x7c93aa) },
  { part: conrad, material: windowVariant(3, 0x5b6670) },
  { part: trim, material: PALETTE.trim },
  { part: roof, material: PALETTE.roof },
  { part: pav, material: { ...PALETTE.glass, doubleSided: true } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('IFC Seoul', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: H3 + 7,
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['way/621752528', 'way/621752526', 'way/639943641', 'way/639943642', 'way/639943643', 'way/621752527',
    'way/500362301', 'way/621752531', 'way/621752532', 'way/1465162036', 'way/1465162037'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-ifc.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
