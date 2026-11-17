/**
 * Seoul City Hall (서울특별시청, 2012, Yoo Kerl / iArc) and, in front of it,
 * the old City Hall (경성부청, 1926, now the Seoul Metropolitan Library):
 * procedural, CC0-1.0.
 * bun generators/seoul-city-hall.ts
 *
 * Frame: bearing 0, model +x east, +y north. Origin at the area centroid of
 * the new hall's outline (OSM way/198561926); y = 0 is Seoul Plaza's level,
 * which both buildings stand on. Elevation 0. Terrain could not be checked
 * (Mapterhorn has no z15 tiles over Seoul); the site is flat in every photo.
 * Both OSM outlines run within 1 degree of east-west and are used
 * axis-aligned.
 *
 * Also exports a small kit (boxes, edge panels, columns, saving) used by the
 * other Seoul landmarks of this builder: seoul-seokjojeon,
 * seoul-myeongdong-cathedral, seoul-culture-station-284, seoul-sejong-center.
 *
 * OSM (used as tagged):
 * - new hall: way/198561926 (12 levels, glass, round roof), 106 x 49 m;
 *   way/768398467 (building=roof, its glass roof) lies inside it;
 * - old hall: the building relation/18722760 with outline relation/10757525
 *   (height 30 = the tower; outer way/198561929), the main roof
 *   relation/10757526 (18 m) and its parapet ring relation/18722759 (19.5 m),
 *   the attic block way/1203368741 (22 m), the tower way/1203368740 (30 m,
 *   pyramidal roof 3 m) and the lantern ways/1415361891 and 1415361892 (to
 *   33.9 m);
 * - the bridge between them, way/1275728634 (4 to 7 m).
 *
 * Published: 13 storeys above ground (Seoul Metropolitan Government press
 * release, 2012, news.seoul.go.kr/citybuild/archives/205773); the design
 * reads the upper front as the deep curved eave of a hanok (Wikipedia,
 * "Seoul City Hall"). No height in metres is published.
 *
 * Estimated from the photos below (scaled to the old hall's 19.5 m parapet
 * and the new hall's 106 m width, all from the plaza):
 * - the new hall's front lip at 41 m (its glass front is 2.6 times as wide
 *   as it is tall in p1 and p5), the roof rising to 42.6 m behind it, two
 *   dark rooftop blocks to 45.6 m (p2); the glass roof in OSM's comb plan;
 * - the wave: the lip overhangs the glass at its foot by about 8 m (the
 *   outline is taken as the roof's edge, so the foot is set back 8 m from
 *   it), the front concave over the upper half, a waist at about 18 m, and
 *   the ends flaring 3 m outward toward the top (p1, Mortel's east end);
 * - the pale faceted lower glass ("skirt") bulging up to 3 m forward, from
 *   x = -8 to the east end, its top an arc up to 26 m (p1, p2);
 * - the old hall: rusticated ground floor to 4.6 m, a bay about 3.3 m with
 *   one window per storey, pilaster strips between, cornice at 17 m; the
 *   smooth central frontispiece 17 m wide under the clock attic; the tower
 *   set back 6 m with a row of windows and a low square dome (q7, q1).
 * Invented: the rear (north) facade of the new hall, which no licensed photo
 * shows: drawn as a curtain wall in three-storey panels between grey piers.
 * Left out: the banner on the old hall, the flags, trees, the plaza.
 *
 * Night: the old hall's granite is floodlit from below (_FLOODLIGHT, "Seoul
 * City Hall At Night"); its windows and the new hall's pale lower glass and
 * rear windows are `window*`; the dark upper glass stays dark (`glass`).
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - p1 "Seoul City Hall from Plaza.jpg", Tristan Surtel, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Seoul_City_Hall_from_Plaza.jpg
 * - p2 "Seoul Metropolitan Library and Seoul City Hall during Seoul Spring Festa in May 2025.jpg", DtSeoul, CC0
 *   https://commons.wikimedia.org/wiki/File:Seoul_Metropolitan_Library_and_Seoul_City_Hall_during_Seoul_Spring_Festa_in_May_2025.jpg
 * - p3 "Seoul City Hall 20190608 001.jpg", Mobius6, CC BY-SA 4.0
 *   https://commons.wikimedia.org/wiki/File:Seoul_City_Hall_20190608_001.jpg
 * - p5 "Seoul City Hall (39321822950).jpg", Richard Mortel, CC BY 2.0
 *   https://commons.wikimedia.org/wiki/File:Seoul_City_Hall_(39321822950).jpg
 * - p7 "Seoul City Hall A01.JPG", 분당선M, CC BY-SA 3.0
 *   https://commons.wikimedia.org/wiki/File:Seoul_City_Hall_A01.JPG
 * - q7 "Seoul-City.Hall-02.jpg", ddol-mang, public domain (old hall, 2006)
 *   https://commons.wikimedia.org/wiki/File:Seoul-City.Hall-02.jpg
 * - q1 "Seoul Metropolitan Library 20191221 01.jpg", Ahmed, CC0 (old hall front)
 *   https://commons.wikimedia.org/wiki/File:Seoul_Metropolitan_Library_20191221_01.jpg
 * - q9 "Seoul City Hall At Night.jpg", jungwon seo, CC BY 2.0
 *   https://commons.wikimedia.org/wiki/File:Seoul_City_Hall_At_Night.jpg
 * No look-only references used.
 * Doubts: no licensed photo of the new hall's sides, rear or roof, so the
 * wave's section is read from the end silhouettes seen from the plaza, and
 * the rear is invented. The lip height (41 m) is from photo scaling only.
 */
import { Part, cross, sub, writeGlb, type MaterialSpec, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { earcut, flat, flatTri, lathe, offsetRing, polyCap, prism as polyPrism, unit } from './seoul-n-seoul-tower'

export type P2 = [number, number]

/** An axis-aligned box; `top` gets the lid (null: none), bottom optional. */
export function abox(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part | null = p, bottom = false) {
  polyPrism(p, top, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, bottom)
}

/** An oriented box: centre (cx, cy), half-lengths along the unit vector d and its left normal, z0..z1. */
export function obox(p: Part, cx: number, cy: number, d: P2, hd: number, he: number, z0: number, z1: number, top: Part | null = p) {
  const e: P2 = [-d[1], d[0]]
  const at = (u: number, v: number): P2 => [cx + d[0] * u + e[0] * v, cy + d[1] * u + e[1] * v]
  polyPrism(p, top, [at(-hd, -he), at(hd, -he), at(hd, he), at(-hd, he)], z0, z1)
}

/**
 * A flat panel on the outside of the wall edge a→b (ring counter-clockwise,
 * so outside is to the right), from fraction t0 to t1 along it, z0..z1,
 * standing `off` proud of the wall.
 */
export function edgePanel(p: Part, a: P2, b: P2, t0: number, t1: number, z0: number, z1: number, off = 0.06) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const n: V3 = [dy / l, -dx / l, 0]
  const P = (t: number, z: number): V3 => [a[0] + dx * t + n[0] * off, a[1] + dy * t + n[1] * off, z]
  flat(p, [P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1)], n)
}

/** A small box standing out of the wall edge a→b at fraction t: w wide, d deep, z0..z1. */
export function edgeBox(p: Part, a: P2, b: P2, t: number, w: number, d: number, z0: number, z1: number, top: Part | null = p) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const u: P2 = [dx / l, dy / l], n: P2 = [dy / l, -dx / l]
  const c: P2 = [a[0] + dx * t + n[0] * d / 2, a[1] + dy * t + n[1] * d / 2]
  // obox's second axis is the left normal of d; ours points right, so it is symmetric anyway
  obox(p, c[0], c[1], u, w / 2, d / 2 + 0.02, z0, z1, top)
}

/** A round column, smooth-shaded, `n` sides, radius r0 at z0 to r1 at z1, no caps. */
export function column(p: Part, x: number, y: number, z0: number, z1: number, r0: number, r1 = r0, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI, b = ((i + 1) / n) * 2 * Math.PI
    const A0: V3 = [x + r0 * Math.cos(a), y + r0 * Math.sin(a), z0], B0: V3 = [x + r0 * Math.cos(b), y + r0 * Math.sin(b), z0]
    const A1: V3 = [x + r1 * Math.cos(a), y + r1 * Math.sin(a), z1], B1: V3 = [x + r1 * Math.cos(b), y + r1 * Math.sin(b), z1]
    const na: V3 = [Math.cos(a), Math.sin(a), 0], nb: V3 = [Math.cos(b), Math.sin(b), 0]
    p.tri(A0, B0, B1, undefined, undefined, undefined, [na, nb, nb])
    p.tri(A0, B1, A1, undefined, undefined, undefined, [na, nb, na])
  }
}

/** A disc facing `n` (horizontal unit normal) centred at c, radius r. */
export function disc(p: Part, c: V3, n: V3, r: number, seg = 16) {
  const u: V3 = [-n[1], n[0], 0], v: V3 = [0, 0, 1]
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * 2 * Math.PI, b = ((i + 1) / seg) * 2 * Math.PI
    const A: V3 = [c[0] + r * (u[0] * Math.cos(a)), c[1] + r * (u[1] * Math.cos(a)), c[2] + r * Math.sin(a)]
    const B: V3 = [c[0] + r * (u[0] * Math.cos(b)), c[1] + r * (u[1] * Math.cos(b)), c[2] + r * Math.sin(b)]
    flatTri(p, c, A, B, n)
  }
  void v
}

/**
 * A pediment: a triangular prism whose base spans xa..xb (across the front),
 * y0..y1 deep, its apex `rise` above z0; faces in `p`, slopes in `roofPart`.
 * With alongX false the roles of x and y swap (a pediment facing west/east).
 */
export function pediment(p: Part, roofPart: Part, xa: number, xb: number, y0: number, y1: number, z0: number, rise: number, alongX = true) {
  const m = (xa + xb) / 2
  const P = (x: number, y: number, z: number): V3 => (alongX ? [x, y, z] : [y, x, z])
  const nf: V3 = alongX ? [0, -1, 0] : [-1, 0, 0], nb: V3 = alongX ? [0, 1, 0] : [1, 0, 0]
  flatTri(p, P(xa, y0, z0), P(xb, y0, z0), P(m, y0, z0 + rise), nf)
  flatTri(p, P(xa, y1, z0), P(xb, y1, z0), P(m, y1, z0 + rise), nb)
  const s = rise / ((xb - xa) / 2)
  const nl = unit(alongX ? [-s, 0, 1] : [0, -s, 1]), nr = unit(alongX ? [s, 0, 1] : [0, s, 1])
  const fix = (n: V3): V3 => (alongX ? n : [n[1], n[0], n[2]])
  flat(roofPart, [P(xa, y0, z0), P(m, y0, z0 + rise), P(m, y1, z0 + rise), P(xa, y1, z0)], fix(nl))
  flat(roofPart, [P(m, y0, z0 + rise), P(xb, y0, z0), P(xb, y1, z0), P(m, y1, z0 + rise)], fix(nr))
}

/** Write a model to models/<id>.glb within budget. */
export function save(id: string, name: string, parts: Array<{ part: Part; material: MaterialSpec }>, bearing: number, height: number, maxTri = 6500) {
  const used = parts.filter((q) => q.part.triangles > 0)
  const triangles = used.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTri) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (used.length > 6) throw new Error(`${id}: ${used.length} materials`)
  const glb = writeGlb(name, used, {
    license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
    bearing, elevation: 0, height,
  })
  if (glb.length > 250_000) throw new Error(`${id}: size budget exceeded: ${glb.length} bytes`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes, ${used.length} materials`)
}

// ===========================================================================

function build() {
  const granite = new Part(), win = new Part(), dark = new Part(), skirt = new Part(), dome = new Part(), roof = new Part()

  // ------------------------------------------------------------------ the wave
  const LIP = 41, YF = -24.2, YR = 25, OVER = 8, ROOF = 42.6
  // the front's forward offset from its foot line, by height: a slight
  // bulge low down, a waist at 18 m, then the concave sweep out to the lip
  const key: P2[] = [[0, 0], [0.3, 4], [0.4, 8], [0.2, 12.5], [0, 17], [0.5, 22], [1.4, 26], [2.8, 29.8], [4.5, 33.6], [6.1, 36.9], [7.3, 39.1], [8, 41]]
  const fAt = (z: number) => {
    for (let k = 0; k < key.length - 1; k++) if (z <= key[k + 1][1]) { const t = (z - key[k][1]) / (key[k + 1][1] - key[k][1]); return key[k][0] + (key[k + 1][0] - key[k][0]) * t }
    return key[key.length - 1][0]
  }
  const yFoot = YF + OVER
  // the pale faceted skirt: its top, an arc along x (0 where there is none)
  const skirtTop = (x: number) => (x < -8 ? 0 : x < 14 ? 26 * Math.sin(((x + 8) / 22) * Math.PI / 2) : x < 38 ? 26 : 26 - (x - 38) * 0.3)
  const bulge = (x: number, z: number) => {
    const t = skirtTop(x)
    if (t <= 0 || z >= t) return 0
    return 3.2 * Math.pow(Math.sin((z / t) * Math.PI), 0.7) * Math.min(1, t / 12)
  }
  // rows: NL rows up to the skirt's top (collapsing where there is none),
  // then NUP rows to the lip, closer together near the top where it curls
  const NL = 6, NUP = 9
  const rowZ = (x: number, j: number) => {
    const t = skirtTop(x)
    if (j <= NL) return (t * j) / NL
    const s = (j - NL) / NUP
    return t + (LIP - t) * Math.sin((s * Math.PI) / 2) ** 0.8
  }
  const NF = NL + NUP + 1
  // lip, roof and rear: [y, z]
  const top: P2[] = [[YF + 0.3, LIP + 1.0], [YF + 1.4, LIP + 1.5], [YF + 4, ROOF - 0.1], [-6, ROOF], [YR - 1, ROOF], [YR, ROOF - 0.5]]
  const NT = top.length
  const halfW = (f: number) => 50.3 + 3 * (f / OVER) // flaring 3 m with the overhang
  const NU = 28
  const xs = Array.from({ length: NU + 1 }, (_, i) => -1 + (2 * i) / NU)
  const G: V3[][] = xs.map((u, i) => {
    const col: V3[] = []
    const x0 = u * 53.3
    for (let j = 0; j < NF; j++) {
      const z = rowZ(x0, j), f = fAt(z), x = u * halfW(f)
      let y = yFoot - f - bulge(x0, z)
      // diamond facets: interior points pushed in and out alternately
      const h = j < NL ? skirtTop(x0) / NL : 4
      if (j > 0 && j < NF - 1 && i > 0 && i < NU) y += ((i + j) % 2 ? 1 : -1) * Math.min(0.35, h / 8)
      col.push([x, y, z])
    }
    for (const [y, z] of top) col.push([u * 53.3, y, z])
    return col
  })
  const area = (a: V3, b: V3, c: V3) => Math.hypot(...cross(sub(b, a), sub(c, a)))
  for (let i = 0; i < NU; i++) {
    for (let j = 0; j < NF + NT - 1; j++) {
      const a = G[i][j], b = G[i + 1][j], c = G[i + 1][j + 1], d = G[i][j + 1]
      const part = j >= NF - 1 ? roof : j < NL ? skirt : dark
      // alternate the diagonal so the facets read as diamonds
      const tris: [V3, V3, V3][] = (i + j) % 2 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]
      for (const [p, q, r] of tris) if (area(p, q, r) > 1e-4) part.tri(p, q, r)
    }
  }
  // the lip: a pale metal rim along the front edge
  for (let i = 0; i < NU; i++) {
    const a = G[i][NF - 1], b = G[i + 1][NF - 1], c = G[i + 1][NF], d = G[i][NF]
    const n = unit(cross(sub(b, a), sub(d, a)))
    const o = (p: V3): V3 => [p[0] + n[0] * 0.25, p[1] + n[1] * 0.25, p[2] + n[2] * 0.25]
    flat(roof, [o(a), o(b), o(c), o(d)], n)
  }
  // end walls: the section's outline at each end, dark glass down to the rear
  for (const [i, sx] of [[0, -1], [NU, 1]] as [number, number][]) {
    const pts = [...G[i], [G[i][G[i].length - 1][0], YR, 0] as V3]
    const ring = pts.map((p) => [p[1], p[2]] as P2)
    for (const [a, b, c] of earcut(ring)) {
      const A = pts[a], B = pts[b], C = pts[c]
      if (area(A, B, C) < 1e-4) continue
      const nn = cross(sub(B, A), sub(C, A))
      if (nn[0] * sx >= 0) dark.tri(A, B, C)
      else dark.tri(A, C, B)
    }
  }
  // rear wall: grey piers and three-storey window panels (invented: no photo)
  const RW = 53.3
  abox(roof, -RW, RW, YR - 0.5, YR, 0, ROOF - 0.5, null)
  for (let k = 0; k < 12; k++) {
    const x0 = -RW + 1.2 + k * ((2 * RW - 1.2) / 12), x1 = x0 + (2 * RW - 1.2) / 12 - 1.2
    for (const [z0, z1] of [[1, 6], [7.2, 17.0], [18.2, 28.0], [29.2, 39.0]]) flat(win, [[x1, YR + 0.06, z0], [x0, YR + 0.06, z0], [x0, YR + 0.06, z1], [x1, YR + 0.06, z1]], [0, 1, 0])
  }
  // rooftop: the two dark blocks behind the lip
  abox(dark, -43, -3, 6, 20, ROOF, ROOF + 3, roof)
  abox(dark, 3, 44, 6, 20, ROOF, ROOF + 3, roof)
  // the glass roof (OSM way/768398467, building=roof, glass), its comb plan
  const comb: P2[] = [[-49.4, 8.8], [-49.4, -8.8], [-40.7, -8.8], [-40.7, -14.1], [-31.6, -14.1], [-31.6, -26.0], [-11.0, -26.0], [-11.0, -14.9], [-9.4, -14.9], [-9.4, -27.8], [18.8, -27.7], [18.8, -15.3], [25.4, -15.3], [25.4, -27.6], [48.7, -27.6], [48.6, 9.6], [24.4, 9.5], [24.4, -1.5], [19.6, -1.5], [19.6, 10.7], [-7.5, 10.6], [-7.5, -0.6], [-10.8, -0.6], [-10.8, 11.7], [-40.2, 11.7], [-40.2, 8.8]]
  polyCap(dark, comb.map(([x, y]) => [x - 0.2, y + 11] as P2), ROOF + 0.06, true)
  // ----------------------------------------------------------- the old hall
  const OLD: P2[] = [[-88.5, -15.3], [-88.1, -43.0], [-84.5, -49.6], [-77.0, -55.8], [-21.5, -56.6], [-14.0, -50.0], [-7.8, -41.2], [-20.0, -31.3], [-27.0, -39.0], [-34.8, -39.2], [-34.8, -33.3], [-60.3, -33.5], [-60.3, -39.5], [-67.8, -39.4], [-72.2, -35.2], [-72.5, -15.2]]
  const R = OLD // counter-clockwise? check below
  const ccw = (() => { let s = 0; for (let i = 0; i < R.length; i++) { const a = R[i], b = R[(i + 1) % R.length]; s += a[0] * b[1] - b[0] * a[1] } return s > 0 })()
  const ring = ccw ? R : [...R].reverse()
  const PAR = 19.5, CORN = 17
  // walls to the parapet, roof inside it
  const { polyWalls } = { polyWalls: (p: Part, r: P2[], z0: number, z1: number) => polyPrism(p, null, r, z0, z1) }
  polyWalls(granite, ring, 4.6, PAR)
  polyPrism(granite, granite, offsetRing(ring, -0.35), 0, 4.6) // rusticated base, proud
  const inner = offsetRing(ring, 0.9)
  polyCap(roof, inner, 18, true)
  // parapet inner faces and top
  for (let i = 0; i < inner.length; i++) {
    const a = inner[i], b = inner[(i + 1) % inner.length]
    const n = unit([-(b[1] - a[1]), b[0] - a[0], 0])
    flat(granite, [[a[0], a[1], 18], [b[0], b[1], 18], [b[0], b[1], PAR], [a[0], a[1], PAR]], n)
    const A = ring[i], B = ring[(i + 1) % ring.length]
    flat(granite, [[A[0], A[1], PAR], [B[0], B[1], PAR], [b[0], b[1], PAR], [a[0], a[1], PAR]], [0, 0, 1])
  }
  // cornice band
  const cr = offsetRing(ring, -0.6)
  polyPrism(granite, null, cr, CORN, CORN + 0.8)
  for (let i = 0; i < cr.length; i++) {
    const a = cr[i], b = cr[(i + 1) % cr.length], A = ring[i], B = ring[(i + 1) % ring.length]
    flat(granite, [[A[0], A[1], CORN + 0.8], [B[0], B[1], CORN + 0.8], [b[0], b[1], CORN + 0.8], [a[0], a[1], CORN + 0.8]], [0, 0, 1])
    flat(granite, [[A[0], A[1], CORN], [B[0], B[1], CORN], [b[0], b[1], CORN], [a[0], a[1], CORN]], [0, 0, -1])
  }
  // windows and pilasters along every outer edge
  const FX0 = -57.6, FX1 = -37.4 // the frontispiece on the front edge
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 5) continue
    const nb = Math.round(L / 3.3)
    // edges facing into the gap behind (toward the new hall) get the same treatment
    for (let k = 0; k < nb; k++) {
      const t0 = k / nb, t1 = (k + 1) / nb, tm = (t0 + t1) / 2
      const xm = a[0] + (b[0] - a[0]) * tm, ym = a[1] + (b[1] - a[1]) * tm
      if (ym < -55 && xm > FX0 - 0.5 && xm < FX1 + 0.5) continue
      const h = 0.6 / L // half a window, 1.2 m wide
      edgePanel(win, a, b, tm - h, tm + h, 1.4, 3.6, 0.41)
      edgePanel(win, a, b, tm - h, tm + h, 5.6, 8.5)
      edgePanel(win, a, b, tm - h, tm + h, 9.5, 12.4)
      edgePanel(win, a, b, tm - h, tm + h, 13.4, 16.0)
      if (k > 0) edgeBox(granite, a, b, t0, 0.8, 0.32, 4.6, CORN, null)
    }
  }
  // the attic block (22 m) and its frontispiece
  const FY = -56.6
  abox(granite, -57.2, -37.9, FY, -34.2, PAR, 22, roof)
  abox(granite, -56.2, -38.9, FY - 0.9, FY + 0.2, 0, 22.6, granite) // frontispiece, proud and smooth
  // its openings: the doorway, three bays of windows above, side windows
  flat(win, [[-50.6, FY - 0.96, 0], [-44.4, FY - 0.96, 0], [-44.4, FY - 0.96, 4.4], [-50.6, FY - 0.96, 4.4]], [0, -1, 0])
  abox(granite, -52, -43, FY - 1.5, FY - 0.9, 4.4, 5.6, granite) // door lintel frame
  for (const xc of [-50.6, -47.5, -44.4]) for (const [z0, z1] of [[6.2, 9.4], [10.4, 13.4], [14.4, 16.8]]) flat(win, [[xc - 0.7, FY - 0.96, z0], [xc + 0.7, FY - 0.96, z0], [xc + 0.7, FY - 0.96, z1], [xc - 0.7, FY - 0.96, z1]], [0, -1, 0])
  for (const xc of [-54.4, -40.7]) for (const [z0, z1] of [[1.2, 3.8], [6.2, 16.8]]) flat(win, [[xc - 0.5, FY - 0.96, z0], [xc + 0.5, FY - 0.96, z0], [xc + 0.5, FY - 0.96, z1], [xc - 0.5, FY - 0.96, z1]], [0, -1, 0])
  // the clock: dark bezel, pale face
  disc(win, [-47.5, FY - 0.96, 20.3], [0, -1, 0], 1.6)
  disc(skirt, [-47.5, FY - 1.02, 20.3], [0, -1, 0], 1.3)
  // the tower: windows band, cornice, low square dome, lantern
  const TX0 = -52.5, TX1 = -42.6, TY0 = -50.6, TY1 = -40.7, TC: P2 = [(TX0 + TX1) / 2, (TY0 + TY1) / 2]
  abox(granite, TX0, TX1, TY0, TY1, 22, 27, null)
  abox(granite, TX0 - 0.5, TX1 + 0.5, TY0 - 0.5, TY1 + 0.5, 26.6, 27.4, roof)
  for (const [a, b] of [[[TX0, TY0], [TX1, TY0]], [[TX1, TY0], [TX1, TY1]], [[TX1, TY1], [TX0, TY1]], [[TX0, TY1], [TX0, TY0]]] as [P2, P2][])
    for (let k = 0; k < 5; k++) edgePanel(win, a, b, (k + 0.25) / 5, (k + 0.75) / 5, 23.4, 25.6)
  const H = (TX1 - TX0) / 2 + 0.4, S2 = Math.SQRT2
  lathe(TC, [[H * S2, 27.4], [H * 0.86 * S2, 28.7], [H * 0.6 * S2, 29.7], [H * 0.25 * S2, 30.3], [0, 30.4]], () => dome, 4, 50, Math.PI / 4)
  abox(dome, TC[0] - 1, TC[0] + 1, TC[1] - 1, TC[1] + 1, 30.2, 31.8, null)
  lathe(TC, [[1.25 * S2, 31.8], [0, 34.4]], () => dome, 4, 20, Math.PI / 4)
  // the bridge to the new hall
  abox(granite, -48.1, -43.4, -33.3, yFoot, 4, 7, roof, true)

  const lit = (p: V3, n: V3) => (p[1] > -14 ? 0 : n[2] > 0.6 ? 0.15 : Math.max(0.25, 1 - p[2] / 26))
  save('seoul-city-hall', 'Seoul City Hall', [
    { part: granite, material: { ...finish('old-hall-granite', 0xd3ccbd), floodlight: lit } },
    { part: win, material: PALETTE.window },
    { part: dark, material: { ...PALETTE.glass, color: 0x5d7c7f } },
    { part: skirt, material: windowVariant(2, 0xaec4cc) },
    { part: dome, material: { ...PALETTE.patina, color: 0x8fadaa } },
    { part: roof, material: { ...PALETTE.roof, color: 0xa4abb0 } },
  ], 0, 45.6)
}

if (import.meta.main) build()
