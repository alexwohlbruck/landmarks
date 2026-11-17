/**
 * The TSX Broadway screen (The Square, 1568 Broadway; screen lit January
 * 2023): the nine-storey LED wall that wraps the corner of Seventh Avenue
 * and West 47th Street above the Palace Theatre, facing the TKTS red steps,
 * and the cantilevered outdoor stage at its foot. Signage only, so it
 * replaces nothing: the tower stays the map's own OSM extrusion.
 * Procedural, CC0-1.0.
 *   bun generators/nyc-tsx-broadway-screen.ts
 *
 * Host: OSM way/266170615 (building=yes, wikipedia "en:TSX Broadway", no
 * height of its own) with its parts way/289975871 (podium, 0-20 m, its
 * Seventh Avenue corner drawn round), way/289975867 (20-35 m, the strip
 * behind the screen, with a square corner that stands 1.4 m out from the
 * podium's face) and the tower parts way/289975876 (146 m) and
 * way/289975868 (136 m). OSM's outline is a little odd at the corner: its
 * west face bends out by 1.4 m over its last 10 m.
 *
 * Map frame: x east, y north, z up, metres, turned by the bearing (29.0°,
 * the Manhattan grid, measured from the OSM edges): +y runs up Seventh
 * Avenue, +x along 47th Street toward Sixth. The anchor (-73.984604,
 * 40.758994) is on the avenue face, 10 m in front of where the outline is
 * measured from; the origin is that point on the ground. In this frame
 * the host's Seventh Avenue face is x = -8.78 (to y = 0.47, then out to
 * x = -10.14 at y = 10.66), its 47th Street face y = 11.33 (out to 12.75 at
 * the corner). The screen's back plane is the host outline offset 0.3 m
 * outward, so nothing sits inside the extrusion; its front is a clean
 * rounded corner 2.2-2.3 m off the main faces (0.9 m clear of OSM's
 * square corner).
 *
 * Elevation: the sign hangs on the facade, so y = 0 is its lowest point
 * (the stage's underside, 7.8 m up) and the placement's `elevation` is
 * 7.8, as the Silvercup sign stands on its roof. Times Square is flat.
 *
 * Published (SNA Displays project page, https://snadisplays.com/projects/tsx-broadway/;
 * Display Daily, https://displaydaily.com/tsxs-led-billboard-concert-stage-rocks-like-no-other-display-ever/;
 * Wikipedia "TSX Broadway"):
 * - main screen 18,000 sq ft, 3,480 x 7,440 px at 8 mm: 27.8 m by 59.5 m,
 *   "nine stories tall", wrapping the corner. SNA prints it as 91'4" wide
 *   by 195'3" tall; the photo below (c03) shows a screen about as tall as
 *   the avenue face is long, so 27.8 m is its height and 59.5 m the length
 *   of the wrap;
 * - the stage, 4,000 sq ft, cantilevered and suspended 30 ft (9.1 m) over
 *   Seventh Avenue, behind 86,000 lb LED doors that swing open: the doors
 *   are the lowest part of the wall, so the screen starts at the stage
 *   floor, 9.1 m, and reaches 36.9 m (1.9 m above OSM's 35 m part, with
 *   the tower behind it).
 * Estimated: how the 59.5 m divides between the avenue (29.5 m, all of
 *   the face OSM gives), the corner (3 m radius, kept tight because OSM
 *   draws the corner square and the screen must wrap outside it) and 47th
 *   Street (25.3 m); the stage apron's projection (3.5 m) and its length
 *   (24 m), its glass parapet (from p-f0); the 4 m rounding of the
 *   screen's top corners (from p-f0); the cabinet's dark frame (0.6 m).
 * Colours: rotating ads, so drawn as two bold blocks: the avenue face
 *   violet-blue (c03, March 2025) and the corner and 47th Street wing TSX
 *   magenta (the TSX brand pink, f1). Both are neon, so the wall glows in
 *   them at night.
 * Left out: the 15' x 132' LED crown at the roof (OSM's tower parts stop
 *   at 146 m against a published 162 m, so a crown would float), the
 *   68'6" x 44' mid-level south display (its neighbour way/266170843 is
 *   57 m tall and no licensed photo places it), the Palace marquee and the
 *   stage marquee (no photo places them).
 *
 * Photos (EVIDENCE):
 * - c03 "At New York City 2025 039.jpg", Mike Peel, CC BY-SA 4.0: from the
 *   Cohan statue looking north-east, the avenue face square on: its
 *   height (about 30 m from the iPhone's 26 mm field of view) and colour.
 *   https://commons.wikimedia.org/wiki/File:At_New_York_City_2025_039.jpg
 * - f0 "B08A4078", Elvert Barnes, CC BY-SA 2.0 (2023): the avenue face from
 *   Duffy Square, its rounded top corners and the stage's glass parapet.
 *   https://www.flickr.com/photos/95413346@N00/52999817685
 * - f1 "What to Wear", Newell Reinvention, CC BY-SA 2.0: the TSX magenta.
 *   https://www.flickr.com/photos/163484448@N03/53480326582
 * - c13 "View of Times Square (May 2023).JPG", Benoît Prieur, CC0: the
 *   wall's curved corner at the right edge, seen past 20 Times Square.
 *   https://commons.wikimedia.org/wiki/File:View_of_Times_Square_(May_2023).JPG
 * - "Times Square in May 2023 (1).JPG", Benoît Prieur, CC0: from the TKTS
 *   queue looking south, the stage's dark underside over the avenue.
 *   https://commons.wikimedia.org/wiki/File:Times_Square_in_May_2023_(1).JPG
 * - "Times Sq Sep 2022 01-13", Epicgenius, CC BY-SA 4.0: the podium's steel
 *   during construction, the curved corner frame.
 *   https://commons.wikimedia.org/wiki/File:Times_Sq_Sep_2022_07.jpg
 * Night: "Times Square, NYC at night - August 2025.jpg",
 *   Nielsoncaetanosalmeron, CC BY 4.0.
 *   https://commons.wikimedia.org/wiki/File:Times_Square,_NYC_at_night_-_August_2025.jpg
 *
 * No lidar: the 2017 NYC flight predates the screen.
 * Doubts: no licensed photo shows the 47th Street wing squarely, so its
 * length is the published total less the avenue face; the stage is drawn
 * as a fixed apron with its doors shut, its depth estimated; the real
 * corner may be rounder than the 3 m drawn.
 */
import { Part, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { finish, PALETTE } from './palette'

export type XY = [number, number]

/** A triangle with explicit normals; `Part.tri` winds it to face them. */
function triN(p: Part, a: V3, b: V3, c: V3, na: V3, nb: V3, nc: V3) {
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
}
export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n: V3 | V3[]) {
  const [na, nb, nc, nd] = Array.isArray(n[0]) ? (n as V3[]) : [n, n, n, n] as V3[]
  triN(p, a, b, c, na, nb, nc)
  triN(p, a, c, d, na, nc, nd)
}
/** An axis-aligned box with outward normals. */
export function box(p: Part, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  quadN(p, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0])
  quadN(p, [x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [0, 1, 0])
  quadN(p, [x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [-1, 0, 0])
  quadN(p, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0])
  quadN(p, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1])
  quadN(p, [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0], [0, 0, -1])
}

/** A polyline with each interior corner rounded to radius r (k segments). */
export function rounded(pts: XY[], r: number, k = 8): XY[] {
  const out: XY[] = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]]
    const u = norm([a[0] - b[0], a[1] - b[1]]), v = norm([c[0] - b[0], c[1] - b[1]])
    const half = Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) / 2
    const t = r / Math.tan(half) // tangent length
    const p0: XY = [b[0] + u[0] * t, b[1] + u[1] * t], p1: XY = [b[0] + v[0] * t, b[1] + v[1] * t]
    const bis = norm([u[0] + v[0], u[1] + v[1]]), dc = r / Math.sin(half)
    const ctr: XY = [b[0] + bis[0] * dc, b[1] + bis[1] * dc]
    const a0 = Math.atan2(p0[1] - ctr[1], p0[0] - ctr[0])
    let a1 = Math.atan2(p1[1] - ctr[1], p1[0] - ctr[0])
    while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI
    while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI
    for (let j = 0; j <= k; j++) {
      const t2 = a0 + ((a1 - a0) * j) / k
      out.push([ctr[0] + r * Math.cos(t2), ctr[1] + r * Math.sin(t2)])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}
const norm = (v: XY): XY => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** A polyline offset by d to its left (miter joins). */
export function offsetLeft(pts: XY[], d: number): XY[] {
  const n = pts.length
  return pts.map((p, i) => {
    const t0 = norm(i > 0 ? [p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]] : [pts[1][0] - p[0], pts[1][1] - p[1]])
    const t1 = norm(i < n - 1 ? [pts[i + 1][0] - p[0], pts[i + 1][1] - p[1]] : t0)
    const n0: XY = [-t0[1], t0[0]], n1: XY = [-t1[1], t1[0]]
    const m = norm([n0[0] + n1[0], n0[1] + n1[1]])
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1])
    return [p[0] + m[0] * k, p[1] + m[1] * k] as XY
  })
}

/** Nearest hit of the ray o + t·dir (t > 0) on polyline `poly`, as t. */
function rayHit(o: XY, dir: XY, poly: XY[]): number {
  let best = Infinity
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i], b = poly[i + 1]
    const e: XY = [b[0] - a[0], b[1] - a[1]]
    const den = dir[0] * -e[1] + dir[1] * e[0]
    if (Math.abs(den) < 1e-9) continue
    const w: XY = [a[0] - o[0], a[1] - o[1]]
    const t = (w[0] * -e[1] + w[1] * e[0]) / den
    const s = (dir[0] * w[1] - dir[1] * w[0]) / den
    if (t > 0 && s >= -1e-6 && s <= 1 + 1e-6) best = Math.min(best, t)
  }
  return best
}

export type Screen = {
  /** The screen's front line, outward to its left, already rounded. */
  front: XY[]
  /** The plane the cabinet backs onto (host outline offset outward). */
  back: XY[]
  /** Cabinet depth where `back` is out of reach. */
  maxDepth: number
  z0: number
  z1: number
  /** Radius of the rounded top corners at the two ends, in elevation. */
  topR: number
  /** The dark cabinet, and its frame round the lit face. */
  cabinet: Part
  margin: number
  /** Lit blocks along the developed length s (metres from the start). */
  faces: { part: Part; from: number; to: number }[]
}

/** A wrap-around LED wall: a dark cabinet with lit colour blocks on its face. */
export function wrapScreen(o: Screen) {
  const P = o.front
  const S = [0]
  for (let i = 1; i < P.length; i++) S.push(S[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
  const L = S[S.length - 1]
  // sample positions: every vertex, the top-corner roundings, every face boundary
  const extra: number[] = []
  for (let j = 0; j <= 6; j++) {
    const d = o.topR * (1 - Math.cos((Math.PI / 2) * (j / 6)))
    extra.push(d, L - d, o.margin + d * (1 - o.margin / o.topR), L - o.margin - d * (1 - o.margin / o.topR))
  }
  for (const f of o.faces) extra.push(f.from, f.to)
  const ss = [...new Set([...S, ...extra].map(v => Math.round(Math.min(L, Math.max(0, v)) * 1e4) / 1e4))].sort((a, b) => a - b)
  // vertex normals: average of the neighbouring segments' left normals
  const segN = (i: number): XY => { const t = norm([P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]]); return [-t[1], t[0]] }
  const at = (s: number): { p: XY; n: XY } => {
    let i = 0
    while (i < S.length - 2 && S[i + 1] < s) i++
    const f = (s - S[i]) / (S[i + 1] - S[i] || 1)
    const p: XY = [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f]
    const vn = (k: number): XY => k <= 0 ? segN(0) : k >= P.length - 1 ? segN(P.length - 2) : norm([segN(k - 1)[0] + segN(k)[0], segN(k - 1)[1] + segN(k)[1]])
    const n0 = vn(i), n1 = vn(i + 1)
    // straight runs keep their own normal; only arcs blend
    const straight = Math.abs(n0[0] - n1[0]) + Math.abs(n0[1] - n1[1]) < 1e-3
    const n = straight ? segN(i) : norm([n0[0] + (n1[0] - n0[0]) * f, n0[1] + (n1[1] - n0[1]) * f])
    return { p, n }
  }
  const top = (s: number, inset = 0) => {
    const r = o.topR - inset, d = Math.min(s, L - s) - inset
    const z1 = o.z1 - inset
    if (d >= r) return z1
    const q = r - Math.max(0, d)
    return z1 - r + Math.sqrt(Math.max(0, r * r - q * q))
  }
  const rows = ss.map(s => {
    const { p, n } = at(s)
    const depth = Math.min(o.maxDepth, rayHit(p, [-n[0], -n[1]], o.back))
    const b: XY = [p[0] - n[0] * depth, p[1] - n[1] * depth]
    return { s, p, n, b, zt: top(s) }
  })
  const C = o.cabinet
  const v3 = (q: XY, z: number): V3 => [q[0], q[1], z]
  for (let i = 0; i < rows.length - 1; i++) {
    const A = rows[i], B = rows[i + 1]
    const nA: V3 = [A.n[0], A.n[1], 0], nB: V3 = [B.n[0], B.n[1], 0]
    quadN(C, v3(A.p, o.z0), v3(B.p, o.z0), v3(B.p, B.zt), v3(A.p, A.zt), [nA, nB, nB, nA])
    quadN(C, v3(B.b, o.z0), v3(A.b, o.z0), v3(A.b, A.zt), v3(B.b, B.zt), [[-nB[0], -nB[1], 0], [-nA[0], -nA[1], 0], [-nA[0], -nA[1], 0], [-nB[0], -nB[1], 0]])
    // top: its normal tilts with the rounded ends
    const e1 = [B.p[0] - A.p[0], B.p[1] - A.p[1], B.zt - A.zt], e2 = [A.b[0] - A.p[0], A.b[1] - A.p[1], 0]
    let tn: V3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]
    if (tn[2] < 0) tn = [-tn[0], -tn[1], -tn[2]]
    quadN(C, v3(A.p, A.zt), v3(B.p, B.zt), v3(B.b, B.zt), v3(A.b, A.zt), tn)
    quadN(C, v3(A.p, o.z0), v3(A.b, o.z0), v3(B.b, o.z0), v3(B.p, o.z0), [0, 0, -1])
  }
  for (const [R, sign] of [[rows[0], -1], [rows[rows.length - 1], 1]] as const) {
    const t: V3 = [R.n[1] * sign, -R.n[0] * sign, 0] // along the path, outward at this end
    quadN(C, v3(R.p, o.z0), v3(R.b, o.z0), v3(R.b, R.zt), v3(R.p, R.zt), t)
  }
  // the lit faces, 0.06 m proud of the cabinet, inset by the frame margin
  for (const f of o.faces) {
    const lo = Math.max(f.from, o.margin), hi = Math.min(f.to, L - o.margin)
    const fr = rows.filter(r => r.s >= lo - 1e-6 && r.s <= hi + 1e-6)
    for (let i = 0; i < fr.length - 1; i++) {
      const A = fr[i], B = fr[i + 1]
      const pa: XY = [A.p[0] + A.n[0] * 0.06, A.p[1] + A.n[1] * 0.06], pb: XY = [B.p[0] + B.n[0] * 0.06, B.p[1] + B.n[1] * 0.06]
      const za = top(A.s, o.margin), zb = top(B.s, o.margin)
      const nA: V3 = [A.n[0], A.n[1], 0], nB: V3 = [B.n[0], B.n[1], 0]
      quadN(f.part, v3(pa, o.z0 + o.margin), v3(pb, o.z0 + o.margin), v3(pb, zb), v3(pa, za), [nA, nB, nB, nA])
    }
  }
  return { length: L, rows }
}

/** Shortest distance from point p to polyline `poly`, signed + outside (left of a clockwise outline). */
export function signedDist(p: XY, ring: XY[]): number {
  let best = Infinity
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i], b = ring[i + 1]
    const e: XY = [b[0] - a[0], b[1] - a[1]], l2 = e[0] * e[0] + e[1] * e[1]
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * e[0] + (p[1] - a[1]) * e[1]) / l2))
    best = Math.min(best, Math.hypot(p[0] - a[0] - e[0] * t, p[1] - a[1] - e[1] * t))
  }
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside ? -best : best
}

/** Move every vertex by (-ox, -oy) in the map frame (glTF x, -z). */
export function shift(parts: Part[], ox: number, oy: number) {
  for (const p of parts) for (let k = 0; k < p.pos.length; k += 3) { p.pos[k] -= ox; p.pos[k + 2] += oy }
}

export async function save(id: string, name: string, parts: { part: Part; material: MaterialSpec }[], bearing: number) {
  const used = parts.filter(p => p.part.triangles > 0)
  const triangles = used.reduce((n, { part }) => n + part.triangles, 0)
  if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
  // The sign hangs on the facade: y = 0 is its lowest point, and the
  // placement's `elevation` lifts it back to its real height (as the
  // Silvercup sign stands on its roof).
  let low = Infinity
  for (const { part } of used) for (let i = 1; i < part.pos.length; i += 3) low = Math.min(low, part.pos[i])
  const elevation = Math.round(low * 100) / 100
  let top = 0
  for (const { part } of used) for (let i = 1; i < part.pos.length; i += 3) { part.pos[i] -= elevation; top = Math.max(top, part.pos[i]) }
  const glb = writeGlb(name, used, {
    license: 'CC0-1.0', bearing, elevation, height: top,
    frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
    replaces: [],
  })
  if (glb.length > 250_000) throw new Error(`File budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${top.toFixed(1)} m tall, elevation ${elevation} m`)
}

if (import.meta.main) {
  // ---- the host, OSM way/266170615, in the turned frame (bearing 29.0), clockwise
  const HOST: XY[] = [[4.29, 11.32], [11.5, 11.33], [39.63, 11.36], [53.85, 11.38], [53.85, 9.59], [53.81, -15.63], [28.81, -15.66],
    [28.81, -19.07], [14.88, -19.1], [-4.0, -19.18], [-5.96, -19.16], [-8.78, -19.12], [-8.76, 0.47], [-10.14, 10.66], [3.63, 12.75], [4.29, 11.32]]
  // the faces the screen backs onto: the avenue face from the south corner, round to 47th Street
  const BACK = offsetLeft([[-8.78, -19.12], [-8.76, 0.47], [-10.14, 10.66], [3.63, 12.75], [4.29, 11.32], [11.5, 11.33], [39.63, 11.36]], 0.3)

  const cabinet = new Part(), violet = new Part(), magenta = new Part(), stage = new Part(), glass = new Part()
  const XF = -11.0, YF = 13.6, R = 3.0, Y0 = -18.9 // the screen's front lines and corner
  const WRAP = 59.5 // published developed length
  const westLen = YF - R - Y0, arc = (Math.PI * R) / 2
  const XE = XF + R + (WRAP - westLen - arc)
  const front = rounded([[XF, Y0], [XF, YF], [XE, YF]], R, 10)
  const Z0 = 9.1, Z1 = 9.1 + 27.8
  const { length, rows } = wrapScreen({
    front, back: BACK, maxDepth: 2.4, z0: Z0, z1: Z1, topR: 4, cabinet, margin: 0.6,
    faces: [{ part: violet, from: 0, to: westLen }, { part: magenta, from: westLen, to: WRAP }],
  })

  // ---- the stage apron, cantilevered over the avenue at the screen's foot
  const SX = 3.5, SY0 = -16.5, SY1 = 7.5
  box(stage, XF - SX, SY0, Z0 - 1.3, XF, SY1, Z0)
  // its glass parapet: front and the two ends
  const G = 1.1, T = 0.12
  box(glass, XF - SX, SY0, Z0, XF - SX + T, SY1, Z0 + G)
  box(glass, XF - SX + T, SY0, Z0, XF, SY0 + T, Z0 + G)
  box(glass, XF - SX + T, SY1 - T, Z0, XF, SY1, Z0 + G)

  // ---- clearance report: every back-plane sample against the host outline
  const OX = -10.0, OY = 0
  {
    const min = Math.min(...rows.map(r => signedDist(r.b, HOST)))
    const fmin = Math.min(...rows.map(r => signedDist(r.p, HOST)))
    console.log(`wrap ${length.toFixed(1)} m (west ${westLen.toFixed(1)}, arc ${arc.toFixed(1)}, 47th ${(WRAP - westLen - arc).toFixed(1)}); back plane >= ${min.toFixed(2)} m outside the host, front >= ${fmin.toFixed(2)} m`)
  }

  const parts = [
    { part: cabinet, material: finish('tsx-cabinet', 0x4a4f57) },
    { part: violet, material: finish('neon-tsx-violet', 0x5a4ee6) },
    { part: magenta, material: finish('neon-tsx-magenta', 0xe0479e) },
    { part: stage, material: finish('tsx-stage', 0x5b6068) },
    { part: glass, material: { ...PALETTE.glass, opacity: 0.35, doubleSided: true } },
  ]
  shift(parts.map(p => p.part), OX, OY)
  await save('nyc-tsx-broadway-screen', 'TSX Broadway Screen', parts, 29.0)
}
