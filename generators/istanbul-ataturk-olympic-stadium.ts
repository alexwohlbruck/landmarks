/**
 * Atatürk Olympic Stadium, Başakşehir, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-ataturk-olympic-stadium.ts
 *
 * Opened 2002 (Turkey's 2008 Olympic bid), 77,563 seats, an athletics
 * bowl. The identity is the west main stand: a tall three-tier grandstand
 * under a great white crescent roof, cantilevered over the seats and hung
 * from two tall white masts with cable stays behind the stand. The east
 * stand has a second, lower crescent roof on raking concrete buttresses
 * (OSM maps both roofs; the photos p02 and p03 show both); the curved ends
 * are open, lower stands. The whole sits on a broad concourse podium (the
 * OSM building outline). The track and pitch are the map's.
 *
 * Note for the lead: the brief described a single roof; the evidence shows
 * two (the east one smaller and lower), so both are modelled.
 *
 * Frame: x east, y north, z up; placed with bearing 0, origin at the
 * centroid of the outline (relation/1661301, outer way/121462312),
 * 28.765662, 41.074474. The bowl is slightly askew in OSM (the stands'
 * front edge is a rotated oval); the model follows OSM's coordinates
 * directly. The site is flat (made ground). Elevation 0. The terrain check
 * could not run (no Mapterhorn z15 here).
 *
 * OSM (ODbL), fetched 2026-11: relation/1661301 building=yes, 4 levels
 * (outer way/121462312, a 269 m near-circle, carrying name and wikidata
 * Q221122; inner way/121462313, the stands' front edge round the track,
 * 147 x 187 m); way/35875788 building=roof (the west crescent, 70 m deep,
 * 270 m long); way/35875800 building=roof (the east crescent, 40 m deep).
 * No heights. Wikidata Q221122 checked: "Atatürk Olympic Stadium".
 *
 * Estimated from photos (no published heights found): the west stand to
 * 44 m, its roof's front edge at 49 m rising to 56 m at the back, the
 * crescent's tips lifted 9 m (p01, p02: the wing-like front lip); the
 * masts 85 m, about a fifth of the way in from each end of the roof's back
 * edge (p01, an aerial from the east); the east stand to 24 m with its
 * roof 26-30 m, tips lifted 6 m (p03 from the east: the buttresses lean out about 8 m); the
 * end stands to 16 m; the concourse podium 6 m.
 * Invented: the stands as one rake each, the cable layout (three stays
 * and a back-stay per mast), the buttress count.
 *
 * Colours: pale concrete (#dcd8d0), grey seats (#9fa5ab; p04-p06 show grey
 * seats), white roofs and masts (#eef0ee), dark glazing on the west
 * stand's back. Night: the roofs are floodlit from below; the glazing
 * glows.
 *
 * Photos (EVIDENCE, Wikimedia Commons):
 * - p01 "Istanbul Ataturk Olympic Stadium.JPG", Bjørn Christian Tørrissen,
 *   CC BY-SA 3.0 (aerial from the east: both roofs, the masts)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Ataturk_Olympic_Stadium.JPG
 * - p02 "Atatürk Olympic Stadium view from east 2026.jpg", Zach1055,
 *   CC BY-SA 4.0 (the east roof and buttresses, the west roof and a mast)
 *   https://commons.wikimedia.org/wiki/File:Atat%C3%BCrk_Olympic_Stadium_view_from_east_2026.jpg
 * - p03 "Atatürk Olimpiyat Stadyumu'14 1.JPG", Ultraslansi, CC BY-SA 3.0
 *   (the west stand's underside and stair)
 *   https://commons.wikimedia.org/wiki/File:Atat%C3%BCrk_Olimpiyat_Stadyumu%2714_1.JPG
 * - p04 "Istanbul Atatürk Olympic Stadium 1.jpg", Валерий Дед, CC BY 3.0
 *   (from the west stand: the east stand and its roof)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Atat%C3%BCrk_Olympic_Stadium_1.jpg
 * - p05 "Istanbul Atatürk Olympic Stadium 4.jpg", Валерий Дед, CC BY 3.0
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Atat%C3%BCrk_Olympic_Stadium_4.jpg
 * - p06 "Istanbul Atatürk Olympic Stadium 5.jpg", Валерий Дед, CC BY 3.0
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Atat%C3%BCrk_Olympic_Stadium_5.jpg
 * Look-only: none.
 *
 * Doubts: every height is estimated from photos without a ruler; the
 * masts' positions are read from one aerial.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]
const SITE: XY[] = [[-38.8,128.1],[-46.6,125.5],[-56.8,121.3],[-63.9,117.7],[-69.8,114.4],[-74.4,111.5],[-77.7,109.3],[-84.4,104.2],[-93.3,96.4],[-101.7,87.7],[-108.7,78.9],[-113.4,72.1],[-120.4,60.0],[-124.1,52.0],[-127.5,43.3],[-129.4,37.3],[-130.9,31.7],[-133.4,18.8],[-134.0,14.4],[-134.6,5.0],[-134.6,-5.6],[-133.9,-15.3],[-132.7,-23.2],[-130.5,-33.4],[-127.7,-42.7],[-126.4,-46.5],[-122.0,-56.7],[-117.0,-66.4],[-116.3,-67.5],[-113.0,-72.9],[-107.4,-80.8],[-101.0,-88.5],[-93.6,-96.2],[-84.5,-104.2],[-74.4,-111.5],[-64.4,-117.4],[-51.6,-123.5],[-39.0,-128.0],[-26.2,-131.2],[-18.3,-132.6],[-12.7,-133.2],[-1.4,-133.8],[11.0,-133.3],[19.0,-132.5],[28.0,-130.9],[36.7,-128.7],[46.7,-125.4],[59.9,-119.8],[68.5,-115.2],[74.9,-111.2],[84.2,-104.3],[89.4,-100.1],[96.4,-93.4],[103.4,-85.8],[106.6,-81.7],[109.7,-77.5],[117.7,-65.0],[120.7,-59.2],[123.5,-53.2],[127.0,-44.5],[128.7,-39.2],[130.8,-31.6],[133.2,-19.2],[134.1,-11.5],[134.5,-5.1],[134.3,8.5],[133.9,13.8],[132.8,21.9],[130.5,32.9],[127.4,43.2],[125.7,47.9],[122.5,55.5],[117.8,64.7],[112.5,73.5],[111.6,74.9],[105.2,83.4],[99.1,90.5],[93.7,96.0],[92.1,97.6],[87.0,102.0],[76.9,109.8],[73.4,112.1],[67.8,115.5],[55.7,121.7],[47.0,125.3],[37.0,128.5],[28.4,130.7],[16.1,132.7],[4.8,133.6],[-4.3,133.7],[-14.2,133.0],[-23.7,131.7],[-32.6,129.8]]
const INNER: XY[] = [[-33.9,78.9],[-39.6,72.9],[-44.1,67.4],[-48.0,61.7],[-62.6,13.9],[-71.2,-30.1],[-71.6,-38.1],[-70.9,-46.1],[-69.1,-53.3],[-66.5,-60.0],[-62.9,-66.7],[-58.3,-72.7],[-52.2,-78.2],[-45.4,-82.3],[-36.2,-86.6],[-27.2,-89.8],[-17.9,-92.2],[-12.6,-93.1],[-9.5,-93.4],[-1.1,-93.8],[8.1,-93.5],[13.3,-93.0],[19.6,-91.8],[25.0,-90.1],[30.5,-87.1],[35.9,-83.3],[40.6,-79.3],[45.7,-73.6],[49.3,-68.0],[52.0,-62.1],[65.1,-17.3],[73.1,19.8],[74.6,30.0],[73.8,39.0],[72.2,46.1],[69.6,52.6],[66.4,59.2],[62.2,66.2],[56.7,72.9],[52.1,77.3],[48.1,80.7],[38.8,85.5],[33.0,87.9],[25.9,90.2],[20.2,91.6],[11.3,92.9],[1.9,92.7],[-6.7,91.2],[-14.1,89.4],[-21.3,86.5],[-28.1,82.9]]
const WROOF: XY[] = [[-117.9,-78.4],[-109.5,-88.8],[-100.8,-97.7],[-91.3,-105.5],[-79.8,-114.3],[-69.3,-120.9],[-74.0,-99.9],[-76.5,-82.6],[-77.6,-65.3],[-77.9,-49.2],[-78.0,-34.9],[-77.6,-22.0],[-76.5,-8.1],[-74.5,6.1],[-71.7,19.0],[-68.7,31.9],[-64.2,45.8],[-58.9,58.3],[-53.8,70.3],[-48.5,81.4],[-42.3,93.8],[-36.6,104.4],[-30.4,113.4],[-22.7,124.2],[-5.7,145.8],[-17.6,145.2],[-30.3,143.5],[-42.4,140.8],[-52.9,137.9],[-63.1,133.7],[-71.3,129.6],[-80.3,124.4],[-89.7,117.3],[-98.6,109.9],[-106.8,101.7],[-113.7,93.9],[-120.7,84.0],[-127.9,72.0],[-133.6,60.1],[-138.5,48.0],[-141.6,36.2],[-144.1,22.3],[-145.4,9.8],[-145.6,-1.1],[-144.2,-14.8],[-142.1,-26.9],[-138.3,-39.9],[-134.2,-49.4],[-124.4,-68.5]]
const EROOF: XY[] = [[26.2,-111.4],[35.0,-132.6],[50.0,-127.4],[62.7,-121.7],[72.9,-115.7],[81.9,-109.3],[91.1,-101.2],[101.3,-90.2],[110.5,-78.5],[118.6,-64.9],[124.6,-52.8],[129.0,-42.0],[132.2,-28.7],[134.5,-17.0],[135.8,-0.7],[135.5,13.2],[134.2,26.8],[131.5,39.5],[127.7,50.9],[122.1,63.3],[116.1,74.2],[109.2,84.3],[102.1,93.5],[92.6,104.0],[76.5,90.1],[84.0,79.4],[89.3,68.9],[92.6,58.7],[94.4,47.6],[95.2,36.8],[94.2,26.3],[77.0,-47.7],[73.3,-61.1],[68.6,-72.0],[63.4,-82.0],[57.4,-90.2],[51.0,-97.0],[44.1,-102.5],[34.4,-107.7]]

function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[0], b = pts[i], c = pts[i + 1]
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const g = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    if (g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0) p.tri(a, b, c)
    else p.tri(a, c, b)
  }
}

/** Distance from the origin along angle t to the polygon's edge. */
function rayHit(poly: XY[], t: number): number {
  const dx = Math.cos(t), dy = Math.sin(t)
  let best = Infinity
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const ex = b[0] - a[0], ey = b[1] - a[1]
    const den = dx * ey - dy * ex
    if (Math.abs(den) < 1e-9) continue
    const s = (a[0] * ey - a[1] * ex) / den, u = (a[0] * dy - a[1] * dx) / den
    if (s > 0 && u >= 0 && u <= 1) best = Math.min(best, s)
  }
  return best
}

/** Resample an open chain to n points by arc length. */
function chain(c: XY[], n: number): XY[] {
  const seg = c.slice(0, -1).map((p, i) => Math.hypot(c[i + 1][0] - p[0], c[i + 1][1] - p[1]))
  const L = seg.reduce((a, b) => a + b, 0)
  const out: XY[] = []
  for (let k = 0; k < n; k++) {
    let d = (L * k) / (n - 1), i = 0
    while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++ }
    const t = Math.min(1, d / seg[i])
    out.push([c[i][0] + (c[i + 1][0] - c[i][0]) * t, c[i][1] + (c[i + 1][1] - c[i][1]) * t])
  }
  return out
}

function prism(p: Part, c: XY, hw: number, z0: number, z1: number, n = 6, top = true) {
  const r = Array.from({ length: n }, (_, k) => [c[0] + hw * Math.cos((k * 2 * Math.PI) / n), c[1] + hw * Math.sin((k * 2 * Math.PI) / n)] as XY)
  p.loft([r.map(([x, y]) => [x, y, z0] as V3), r.map(([x, y]) => [x, y, z1] as V3)])
  if (top) p.cap(r.map(([x, y]) => [x, y, z1] as V3), true)
}

/** A straight strut of square section between two points. */
function strut(p: Part, a: V3, b: V3, w: number) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(d[0], d[1], d[2])
  const u = d.map((v) => v / l)
  let s = [u[1], -u[0], 0]
  if (Math.hypot(s[0], s[1]) < 1e-6) s = [1, 0, 0]
  const sl = Math.hypot(s[0], s[1], s[2]); s = s.map((v) => v / sl)
  const t = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]]
  const off = (q: V3, i: number): V3 => {
    const a1 = (i === 0 || i === 3 ? -1 : 1) * w / 2, b1 = (i < 2 ? -1 : 1) * w / 2
    return [q[0] + s[0] * a1 + t[0] * b1, q[1] + s[1] * a1 + t[1] * b1, q[2] + s[2] * a1 + t[2] * b1]
  }
  const ra = [0, 1, 2, 3].map((i) => off(a, i)), rb = [0, 1, 2, 3].map((i) => off(b, i))
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const mid: V3 = [(ra[i][0] + ra[j][0]) / 2 - a[0], (ra[i][1] + ra[j][1]) / 2 - a[1], (ra[i][2] + ra[j][2]) / 2 - a[2]]
    face(p, [ra[i], ra[j], rb[j], rb[i]], mid)
  }
}

export function build() {
  const conc = new Part(), seats = new Part(), white = new Part(), win = new Part(), flood = new Part()
  void flood

  const N = 72, POD = 6
  // stand heights by direction: west main stand, east stand, low ends
  const height = (t: number) => {
    const c = Math.cos(t - 0.42) // the bowl is turned: the stands' centres are a little off the x axis
    return 16 + 28 * Math.pow(Math.max(0, -c), 1.6) + 8 * Math.pow(Math.max(0, c), 1.6)
  }
  const ang = Array.from({ length: N }, (_, k) => (k * 2 * Math.PI) / N)
  const inn = ang.map((t) => { const r = rayHit(INNER, t); return [r * Math.cos(t), r * Math.sin(t)] as XY })
  const site = ang.map((t) => { const r = rayHit(SITE, t); return [r * Math.cos(t), r * Math.sin(t)] as XY })
  const back = ang.map((t, k) => { const r = rayHit(SITE, t) - 9; return [r * Math.cos(t), r * Math.sin(t)] as XY })
  const H = ang.map(height)
  const P = (r: XY[], k: number, z: number): V3 => [r[k % N][0], r[k % N][1], z]
  const out = (r: XY[], k: number): V3 => {
    const a = r[k % N], b = r[(k + 1) % N], l = Math.hypot(b[0] - a[0], b[1] - a[1])
    return [(b[1] - a[1]) / l, -(b[0] - a[0]) / l, 0]
  }

  for (let k = 0; k < N; k++) {
    const k1 = k + 1
    // the rake
    face(seats, [P(inn, k, 1.2), P(inn, k1, 1.2), P(back, k1, H[(k + 1) % N]), P(back, k, H[k])], [-out(inn, k)[0] * 0.6, -out(inn, k)[1] * 0.6, 1])
    face(conc, [P(inn, k, 0), P(inn, k1, 0), P(inn, k1, 1.2), P(inn, k, 1.2)], [-out(inn, k)[0], -out(inn, k)[1], 0])
    // the back wall, its parapet and the concourse podium
    face(conc, [P(back, k, POD), P(back, k1, POD), P(back, k1, H[(k + 1) % N] + 1), P(back, k, H[k] + 1)], out(back, k))
    face(conc, [P(back, k, H[k] + 1), P(back, k1, H[(k + 1) % N] + 1), P(back, k1, H[(k + 1) % N]), P(back, k, H[k])], [0, 0, 1])
    face(conc, [P(back, k, POD), P(site, k, POD), P(site, k1, POD), P(back, k1, POD)], [0, 0, 1])
    face(conc, [P(site, k, 0), P(site, k1, 0), P(site, k1, POD), P(site, k, POD)], out(site, k))
    // glazing on the high back walls (the stands' concourses)
    if (H[k] > 26) {
      const o = out(back, k), e = 0.06
      const A = P(back, k, 0), B = P(back, k1, 0)
      face(win, [[A[0] + o[0] * e, A[1] + o[1] * e, POD + 3], [B[0] + o[0] * e, B[1] + o[1] * e, POD + 3], [B[0] + o[0] * e, B[1] + o[1] * e, Math.min(H[k], H[(k + 1) % N]) - 14], [A[0] + o[0] * e, A[1] + o[1] * e, Math.min(H[k], H[(k + 1) % N]) - 14]], o)
    }
  }

  // Roofs: crescents between OSM's inner and outer edges.
  const roof = (inner: XY[], outer: XY[], zi0: number, zo0: number, th: number, rise: number) => {
    const n = inner.length
    const lift = (k: number) => rise * Math.pow(Math.abs((2 * k) / (n - 1) - 1), 2)
    const ZI = (k: number) => zi0 + lift(k), ZO = (k: number) => zo0 + lift(k) * 0.6
    for (let k = 0; k < n - 1; k++) {
      const a: V3 = [inner[k][0], inner[k][1], ZI(k)], b: V3 = [inner[k + 1][0], inner[k + 1][1], ZI(k + 1)]
      const c: V3 = [outer[k + 1][0], outer[k + 1][1], ZO(k + 1)], d: V3 = [outer[k][0], outer[k][1], ZO(k)]
      face(white, [a, b, c, d], [0, 0, 1])
      const dn = (v: V3): V3 => [v[0], v[1], v[2] - th]
      face(white, [dn(a), dn(b), dn(c), dn(d)], [0, 0, -1])
      // front fascia (towards the pitch)
      const f = [-(b[1] - a[1]), b[0] - a[0], 0] as V3
      const toward = (inner[k][0] - outer[k][0]) * f[0] + (inner[k][1] - outer[k][1]) * f[1] > 0 ? f : [-f[0], -f[1], 0] as V3
      face(white, [a, b, dn(b), dn(a)], toward)
      face(white, [d, c, dn(c), dn(d)], [-toward[0], -toward[1], 0])
    }
    // end caps
    for (const k of [0, n - 1]) {
      const a: V3 = [inner[k][0], inner[k][1], ZI(k)], d: V3 = [outer[k][0], outer[k][1], ZO(k)]
      const t = [d[1] - a[1], -(d[0] - a[0]), 0] as V3
      face(white, [a, d, [d[0], d[1], ZO(k) - th], [a[0], a[1], ZI(k) - th]], k === 0 ? t : [-t[0], -t[1], 0])
      face(white, [a, d, [d[0], d[1], ZO(k) - th], [a[0], a[1], ZI(k) - th]], k === 0 ? [-t[0], -t[1], 0] : t)
    }
  }
  // west: inner chain WROOF[5..24] (south to north), outer chain WROOF[24..] + [0] reversed
  const M = 26
  const wIn = chain(WROOF.slice(5, 25), M)
  const wOut = chain([...WROOF.slice(24), WROOF[0]].reverse(), M)
  roof(wIn, wOut, 49, 56, 2.6, 9)
  // east: outer chain EROOF[1..23] (south to north), inner chain EROOF[24..] + [0] reversed
  const eOut = chain(EROOF.slice(1, 24), M)
  const eIn = chain([...EROOF.slice(24), EROOF[0]].reverse(), M)
  roof(eIn, eOut, 26, 30, 1.6, 6)

  // Columns under the west roof's back edge, and the east stand's raking buttresses.
  for (let k = 2; k < M - 2; k += 3) prism(conc, wOut[k], 0.9, 40, 56, 6, false)
  for (let k = 1; k < M - 1; k += 2) {
    const o = eOut[k], i2 = eIn[k]
    const dx = o[0] - i2[0], dy = o[1] - i2[1], l = Math.hypot(dx, dy)
    const foot: V3 = [o[0] - (dx / l) * 14, o[1] - (dy / l) * 14, POD]
    strut(conc, foot, [o[0], o[1], 30], 1.6)
  }

  // The masts and their stays.
  for (const k of [5, 20]) {
    const o = wOut[k], i2 = wIn[k]
    const dx = o[0] - i2[0], dy = o[1] - i2[1], l = Math.hypot(dx, dy)
    const m: XY = [o[0] + (dx / l) * 8, o[1] + (dy / l) * 8]
    prism(white, m, 2.2, 0, 85, 8, true)
    const top: V3 = [m[0], m[1], 85]
    for (const j of [k - 3, k, k + 3]) {
      const q = wIn[Math.max(0, Math.min(M - 1, j))], r = wOut[Math.max(0, Math.min(M - 1, j))]
      strut(white, top, [q[0] * 0.6 + r[0] * 0.4, q[1] * 0.6 + r[1] * 0.4, 52.5], 0.45)
    }
    strut(white, top, [m[0] + (dx / l) * 12, m[1] + (dy / l) * 12, 0], 0.5)
  }

  return [
    { part: conc, material: { ...finish('concrete', 0xdcd8d0), floodlight: (_p: V3, n: V3) => (n[2] > 0.8 ? 0.2 : 0.6) } },
    { part: seats, material: finish('seats', 0x9fa5ab) },
    { part: white, material: { ...finish('roof-white', 0xeef0ee), floodlight: (_p: V3, n: V3) => (n[2] < -0.5 ? 0.9 : 0.4) } },
    { part: win, material: PALETTE.window },
  ]
}

if (import.meta.main) {
  const parts = build()
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  for (const { part, material } of parts) console.log(material.name, part.triangles)
  if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
  const glb = writeGlb('Atatürk Olympic Stadium', parts, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing: 0, elevation: 0, height: 85,
  })
  if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
  const out = new URL('../models/istanbul-ataturk-olympic-stadium.glb', import.meta.url).pathname
  await Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
}
