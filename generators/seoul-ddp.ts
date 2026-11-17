/**
 * Dongdaemun Design Plaza (DDP), Seoul — original procedural geometry, CC0-1.0.
 * bun generators/seoul-ddp.ts
 *
 * Zaha Hadid's flowing aluminium-clad building (2014), drawn as one smooth
 * skin lofted from the OSM outline: every ring of the skin is the outline
 * inset by a few metres (iterated small inward steps with smoothing, loops
 * collapsed), so the walls, the rolled-over shoulders and the roof edge are
 * continuous curved surfaces with smooth normals, never boxes.
 *
 * Frame: x east, y north (BEARING 0; the plan is free-form), z up, metres.
 * Origin = area centroid of the OSM outline way/607932370. y = 0 is the
 * ground at the foot; elevation 0. Terrain could not be checked: Mapterhorn
 * has no z15 tiles over Seoul (city notes). The real site has sunken plazas
 * on the west; the model starts at street level and leaves them to the map.
 *
 * Form, as read from OSM and the photos:
 * - the plan is OSM's: the long north lobe (Design Museum / Lab), the waist,
 *   the Art Hall body to the south-west and the south arm running east to a
 *   rounded nose, with the wedge-shaped Eoullim plaza inlet between them;
 * - the section at every point of the outline: a glazed foot set back under
 *   the skin (5.5 m, much deeper under the overhangs), the aluminium skin
 *   flaring out to the outline at 68% of the height, then a broad rounded
 *   shoulder (~14 m across, ~9 m down) rolling onto the roof;
 * - the green (sedum) roofs sit just inside the shoulder; the three ends
 *   (the north head, the south arm's nose, the Art Hall's south-west corner)
 *   are bare metal domes, as in the roof plan and the distant photos, and
 *   two low metal walkways part the green roof as on the roof plan;
 * - heights: 29 m over the Art Hall and south arm, ~24 m over the north
 *   lobe, a saddle at the waist (two distinct masses from the side, as in
 *   the Forgemind and Eugene Lim photos), and the north head swelling to
 *   ~28 m as an overhanging nose over a deep glazed undercut (Brit in Seoul
 *   photos from the north-east);
 * - the long sweeping glazed slots in the skin, as lens-shaped window
 *   panels on the surface (within 5 cm), rising and falling along the wall.
 *
 * Evidence
 * - OSM relation/10647068 "동대문디자인플라자" (building=public, height 20,
 *   4 levels, architect Zaha Hadid, wikidata Q5295847), outer way/607932370,
 *   fetched 2026-11-13. No building:part inside it. The 20 m tag reads as
 *   a typical eave, not the crest of the skin.
 * - Published: floor area 86,574.7 m2, opened 2014, Zaha Hadid (en.wikipedia
 *   "Dongdaemun Design Plaza"). Wikipedia gives no height; the ~29 m crest
 *   is estimated from the photos against 4 storeys above ground.
 * - Photos (EVIDENCE):
 *   "Dongdaemun, Seoul (1).jpg" and "(2).jpg", Brit in Seoul, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Dongdaemun,_Seoul_(1).jpg
 *     https://commons.wikimedia.org/wiki/File:Dongdaemun,_Seoul_(2).jpg
 *     distant views from the north-east: the green roof panels inside thick
 *     silver rims, the bare metal nose with its dark undercut;
 *   "Dongdaemun Design Plaza grass.jpg", Tristan Surtel, CC BY-SA 4.0,
 *     https://commons.wikimedia.org/wiki/File:Dongdaemun_Design_Plaza_grass.jpg
 *     on the green roof: the rim rising past the grass, the glazed slot under
 *     the skin;
 *   "20240601 144028 Dongdaemun Design Plaza, Seoul 08.jpg", Dwxn, CC BY-SA
 *     4.0, https://commons.wikimedia.org/wiki/File:20240601_144028_Dongdaemun_Design_Plaza,_Seoul_08.jpg
 *     the undercut skin and its silver colour in sun;
 *   "Zaha Hadid - Dongdaemun Design Plaza & Park - Photo 13371251053" and
 *     "... 13371087825", Forgemind ArchiMedia (Flickr), CC BY 2.0,
 *     https://www.flickr.com/photos/44343967@N00/13371251053 (two masses in
 *     daylight), https://www.flickr.com/photos/44343967@N00/13371087825 (from
 *     above at dusk: green roofs, rims, the nose over the sunken plaza);
 *   Seoul Guide Korea (Flickr), CC BY 2.0, photos of the site model in the
 *     DDP information centre: https://www.flickr.com/photos/86137128@N07/8404096587
 *     and https://www.flickr.com/photos/86137128@N07/8405189774 (roof zones);
 *   "Dongdaemun Design Plaza at night, Seoul, Korea.jpg", Eugene Lim, CC BY
 *     2.0, https://commons.wikimedia.org/wiki/File:Dongdaemun_Design_Plaza_at_night,_Seoul,_Korea.jpg
 *     the two masses from the side and the night look.
 *   Colours: skin sampled ~#b4b9bd in daylight, drawn #c4c8cc; sedum muted
 *   to #95a97a.
 * - Look-only: Forgemind ArchiMedia's roof plan drawing (Flickr 13371322563,
 *   tagged CC BY 2.0 by the uploader but an architect's drawing): it shows
 *   the sedum zones and metal ends; the model's plan is OSM's, not traced.
 *
 * Estimated: every height (from photo proportions and the OSM levels);
 * the section (setback, flare, shoulder radius); the extent of the glazed
 * undercuts and slots; the green-roof zones. Doubts: which end carries the
 * highest nose was read from distant photos only; no Mapillary token was
 * available; no lidar for Korea.
 *
 * Night: the glazed feet and slots are `window*` and glow; the skin carries
 * a light `_FLOODLIGHT` wash (it is lit from below and glitters after dark).
 */
import { Part, writeGlb, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const BEARING = 0
const ANCHOR = { lng: 127.009646, lat: 37.566813 }

// OSM way/607932370 (outer of relation/10647068), local metres about its
// area centroid, x east, y north, counter-clockwise.
const OUTLINE: [number, number][] = [[2.8,135.5],[-15.6,68.9],[-19.4,54.9],[-19.9,52.5],[-20.3,50.3],[-20.3,48.0],[-20.0,45.8],[-19.6,43.7],[-18.6,41.7],[-17.4,39.8],[-15.9,38.3],[-6.4,30.9],[-6.1,30.4],[-5.8,29.8],[-5.7,29.3],[-5.8,28.8],[-6.0,28.4],[-6.3,28.0],[-6.7,27.7],[-7.2,27.4],[-10.4,26.4],[-28.5,22.0],[-36.9,18.4],[-44.8,13.9],[-52.3,7.4],[-59.1,0.3],[-75.3,-21.7],[-81.5,-31.3],[-86.7,-41.2],[-88.6,-46.1],[-89.9,-51.0],[-90.4,-56.0],[-90.4,-60.9],[-89.8,-64.1],[-89.5,-66.0],[-88.0,-70.8],[-85.8,-74.9],[-82.9,-78.7],[-72.1,-89.9],[-59.6,-99.4],[-55.6,-102.0],[-51.3,-104.2],[-46.8,-106.0],[-43.3,-107.1],[-42.2,-107.4],[-37.5,-108.4],[-32.8,-108.7],[-28.2,-108.9],[-23.5,-108.4],[-15.9,-107.2],[-8.2,-105.2],[6.3,-99.9],[18.8,-94.3],[75.4,-69.0],[83.1,-64.7],[90.3,-59.9],[91.4,-58.8],[92.5,-57.7],[93.4,-56.5],[94.2,-55.3],[94.8,-53.7],[95.1,-51.9],[95.0,-50.4],[94.6,-48.8],[93.6,-46.0],[89.1,-40.4],[88.3,-39.4],[87.3,-38.6],[86.1,-37.9],[85.0,-37.4],[83.9,-37.2],[82.7,-37.1],[80.2,-37.2],[-21.7,-46.9],[-22.7,-46.9],[-23.6,-46.6],[-24.2,-46.1],[-24.6,-45.3],[-24.6,-44.5],[-24.4,-43.7],[-24.0,-42.8],[-23.2,-42.2],[21.0,-19.1],[28.8,-14.7],[35.5,-8.9],[41.5,-1.0],[45.7,7.6],[47.3,12.4],[48.7,16.3],[50.6,25.5],[51.4,34.8],[51.6,44.3],[51.5,108.9],[51.5,113.1],[51.2,117.5],[50.1,121.8],[48.9,126.0],[41.5,151.3],[40.1,155.4],[38.4,159.2],[37.0,161.2],[35.2,162.9],[33.1,163.9],[30.8,164.7],[28.6,165.0],[26.3,164.9],[23.8,164.4],[21.7,163.4],[19.7,162.2],[18.0,160.8],[16.2,159.0],[14.8,157.1],[8.5,146.8]]

type P2 = [number, number]
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Resample a closed ring to n points evenly spaced along its length. */
function resample(ring: P2[], n: number): P2[] {
  const pts = [...ring, ring[0]]
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  const total = seg.reduce((a, b) => a + b, 0)
  const out: P2[] = []
  let k = 0, acc = 0
  for (let j = 0; j < n; j++) {
    const s = (j / n) * total
    while (acc + seg[k] < s) { acc += seg[k]; k++ }
    const t = (s - acc) / seg[k]
    out.push([lerp(pts[k][0], pts[k + 1][0], t), lerp(pts[k][1], pts[k + 1][1], t)])
  }
  return out
}
function smoothRing(r: P2[], a: number, iters: number): P2[] {
  let cur = r
  for (let it = 0; it < iters; it++) {
    const n = cur.length
    cur = cur.map((p, i) => {
      const q = cur[(i + n - 1) % n], s = cur[(i + 1) % n]
      return [p[0] + a * ((q[0] + s[0]) / 2 - p[0]), p[1] + a * ((q[1] + s[1]) / 2 - p[1])] as P2
    })
  }
  return cur
}
/** One small inward step along the ring's smoothed normals (the ring is counter-clockwise). */
function insetStep(r: P2[], d: number): P2[] {
  const n = r.length
  const moved = r.map((p, i) => {
    const q = r[(i + n - 1) % n], s = r[(i + 1) % n]
    const tx = s[0] - q[0], ty = s[1] - q[1], l = Math.hypot(tx, ty) || 1
    return [p[0] - (ty / l) * d, p[1] + (tx / l) * d] as P2
  })
  return untangle(smoothRing(moved, 0.35, 2))
}
/**
 * Collapse the small loops ("swallowtails") an inward offset makes where the
 * outline is tighter than the offset, so every ring stays simple and keeps its
 * vertex count: the loop's vertices all move to the crossing point.
 */
function untangle(r: P2[]): P2[] {
  const n = r.length
  const ccw = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  for (let i = 0; i < n; i++) {
    for (let span = 2; span < n / 4; span++) {
      const j = (i + span) % n
      const a = r[i], b = r[(i + 1) % n], c = r[j], d = r[(j + 1) % n]
      const d1 = ccw(a, b, c), d2 = ccw(a, b, d), d3 = ccw(c, d, a), d4 = ccw(c, d, b)
      if (d1 * d2 < 0 && d3 * d4 < 0) {
        const t = d3 / (d3 - d4)
        const x: P2 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
        for (let k = 1; k <= span; k++) r[(i + k) % n] = [x[0], x[1]]
      }
    }
  }
  return r
}

// ---------------------------------------------------------------- the plan
const N = 168
const outer = smoothRing(resample(OUTLINE, N), 0.3, 3)
const STEP = 0.5
const insets: P2[][] = [outer]
for (let k = 1; k <= 90; k++) insets.push(insetStep(insets[k - 1], STEP))
/** Vertex i of the ring inset by d metres. */
function at(i: number, d: number): P2 {
  const f = Math.min(insets.length - 1.001, Math.max(0, d / STEP)), k = Math.floor(f), t = f - k
  const a = insets[k][i], b = insets[k + 1][i]
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]
}

// Arc length along the outline, for features placed along it.
const arc: number[] = [0]
for (let i = 1; i < N; i++) arc.push(arc[i - 1] + Math.hypot(outer[i][0] - outer[i - 1][0], outer[i][1] - outer[i - 1][1]))
const nearest = (x: number, y: number) => {
  let best = 0, bd = Infinity
  outer.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = i } })
  return best
}

/** Roof height: the south body (Art Hall) highest, the north lobe lower, a saddle at the waist. */
function roofHeight(x: number, y: number) {
  let h = lerp(29, 24, smoothstep(5, 70, y))
  h -= 5.5 * Math.exp(-(((y - 24) / 15) ** 2)) * (1 - smoothstep(30, 55, x))
  h += 4 * smoothstep(95, 150, y) // the north head swells into the highest, overhanging nose
  return h
}

/** A smooth bump along the outline between arc positions s0..s1 (wrapping), easing over `ease` metres. */
const PER = arc[N - 1] + Math.hypot(outer[0][0] - outer[N - 1][0], outer[0][1] - outer[N - 1][1])
function bump(s: number, s0: number, s1: number, ease: number) {
  const len = (s1 - s0 + PER) % PER
  const u = (s - s0 + PER) % PER
  if (u > len + ease && u < PER - ease) return 0
  const v = u > len + ease ? u - PER : u
  return smoothstep(-ease, 0, v) * (1 - smoothstep(len, len + ease, v))
}

// Ground-floor glazing under the overhangs: [from vertex near, to vertex near, inset u, glass height c].
const openings: { a: P2; b: P2; u: number; c: number }[] = [
  { a: [84, -37], b: [88, -63], u: 10, c: 7.5 }, // the south arm's cantilevered nose over the sunken plaza
  { a: [70, -38], b: [-20, -46], u: 4.5, c: 6 }, // the inlet: Eoullim plaza side of the south arm
  { a: [-20, -40], b: [49, 20], u: 4.5, c: 6 }, // the inlet: the Art Hall's glazed foot
  { a: [51, 60], b: [51, 110], u: 3.5, c: 5 }, // the park front of the north lobe
  { a: [49, 125], b: [5, 140], u: 11, c: 7 }, // the north head floats over its glazed foot
  { a: [-58, 0], b: [-10, 26], u: 5, c: 6.5 }, // the west waist entrance
]
const U: number[] = Array(N).fill(5.5), C: number[] = Array(N).fill(0)
for (const o of openings) {
  let s0 = arc[nearest(...o.a)], s1 = arc[nearest(...o.b)]
  if ((s1 - s0 + PER) % PER > PER / 2) [s0, s1] = [s1, s0] // the short way round
  for (let i = 0; i < N; i++) {
    const w = bump(arc[i], s0, s1, 10)
    U[i] = Math.max(U[i], lerp(5.5, o.u, w))
    C[i] = Math.max(C[i], o.c * w)
  }
}
const H = outer.map(([x, y]) => roofHeight(x, y))
// Metal domes over the three ends (the roof plan's "metal finish"): the green
// roof stops well short of the north head, the south arm's nose and the Art
// Hall's south-west corner.
const ends: P2[] = [[28, 165], [95, -52], [-89, -62]]
const G = outer.map(([x, y]) => 16 + Math.max(
  ...ends.map(([ex, ey]) => 12 * Math.exp(-((Math.hypot(x - ex, y - ey) / 30) ** 2))),
  30 * Math.exp(-((Math.hypot(x - 30, y - 150) / 45) ** 2)), // the north head is a bare metal dome
))

/**
 * The section through the skin at vertex i, from the ground up and over onto
 * the roof: [inset from the outline, height]. Row 0-1 is the glazed foot; then
 * the metal skin flares out to its widest at 68% of the height, rolls back over
 * a broad rounded shoulder to the rim, and dips onto the green roof.
 */
function section(i: number): [number, number][] {
  const u = U[i], c = C[i], h = H[i], zb = 0.68 * h
  const rows: [number, number][] = [[u, 0], [u, c]]
  for (const t of [0.25, 0.5, 0.75, 1]) rows.push([u * (1 - t) ** 2, c + (zb - c) * t])
  for (const [d, f] of [[0.8, 0.8], [2.8, 0.895], [6, 0.957], [10, 0.99], [Math.min(14, G[i] - 2), 1]]) rows.push([d, f * h])
  rows.push([G[i], h - 0.3])
  return rows
}
const ROWS = section(0).length
const grid: V3[][] = [] // grid[row][i]
for (let r = 0; r < ROWS; r++) grid.push([])
for (let i = 0; i < N; i++) section(i).forEach(([d, z], r) => { const [x, y] = at(i, d); grid[r].push([x, y, z]) })

// Smooth normals from the grid, outward.
const normals: V3[][] = grid.map((row, r) => row.map((_, i) => {
  const along = sub(row[(i + 1) % N], row[(i + N - 1) % N])
  const up = sub(grid[Math.min(ROWS - 1, r + 1)][i], grid[Math.max(r === 1 ? 1 : 0, r - 1)][i])
  let n = cross(along, up)
  const l = Math.hypot(...n) || 1
  return [n[0] / l, n[1] / l, n[2] / l] as V3
}))

const metal = new Part(), glazing = new Part(), green = new Part(), slot = new Part()
const band = metal // the roof walkways are the same aluminium

function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, na: V3, nb: V3, nc: V3, nd: V3) {
  p.tri(a, b, c, [0, 0], [0, 0], [0, 0], [na, nb, nc])
  p.tri(a, c, d, [0, 0], [0, 0], [0, 0], [na, nc, nd])
}
for (let r = 0; r < ROWS - 1; r++) {
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    if (r === 0) {
      if (C[i] < 0.05 && C[j] < 0.05) continue
      // vertical glazing: flat normals facing out
      glazing.quad(grid[0][i], grid[0][j], grid[1][j], grid[1][i])
      continue
    }
    quadN(metal, grid[r][i], grid[r][j], grid[r + 1][j], grid[r + 1][i], normals[r][i], normals[r][j], normals[r + 1][j], normals[r + 1][i])
  }
}
// The soffit under each glazed overhang is the first metal band; close the gap
// at the glass head where the glass height falls to nothing (no hole: rows 0
// and 1 coincide there).

// ---------------------------------------------------------------- the roof
// The green roof inside the rim: ear-clipped, each vertex at its own height.
function earClip(poly: P2[]): [number, number, number][] {
  const idx = poly.map((_, i) => i), tris: [number, number, number][] = []
  const area = (a: P2, b: P2, c: P2) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inside = (p: P2, a: P2, b: P2, c: P2) => area(a, b, p) >= 0 && area(b, c, p) >= 0 && area(c, a, p) >= 0
  let guard = 0
  while (idx.length > 3 && guard++ < 100000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const ia = idx[(k + idx.length - 1) % idx.length], ib = idx[k], ic = idx[(k + 1) % idx.length]
      const a = poly[ia], b = poly[ib], c = poly[ic]
      if (area(a, b, c) <= 1e-9) continue
      if (idx.some((m) => m !== ia && m !== ib && m !== ic && inside(poly[m], a, b, c))) continue
      tris.push([ia, ib, ic]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) idx.splice(0, 1)
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  return tris
}
const top = grid[ROWS - 1].filter((p, i, all) => {
  const q = all[(i + 1) % all.length]
  return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05
})
for (const [a, b, c] of earClip(top.map((p) => [p[0], p[1]] as P2))) green.tri(top[a], top[b], top[c])

// Metal walkways crossing the green roof, as on the roof plan: a rounded
// ridge at the waist between the north lobe and the Art Hall, and one
// parting the Art Hall's sedum from the south arm's walkable roof.
function ridge(path: P2[], width: number, rise: number) {
  const pts: P2[] = []
  for (let k = 0; k < path.length - 1; k++) for (let t = 0; t < 1; t += 0.125) pts.push([lerp(path[k][0], path[k + 1][0], t), lerp(path[k][1], path[k + 1][1], t)])
  pts.push(path[path.length - 1])
  const inGreen = (p: P2) => {
    let c = false
    for (let i = 0, j = top.length - 1; i < top.length; j = i++) {
      const a = top[i], b = top[j]
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c
    }
    return c
  }
  const kept = pts.filter((p) => inGreen(p))
  pts.length = 0; pts.push(...kept)
  const prof = [[-1, 0], [-0.55, 0.75], [0, 1], [0.55, 0.75], [1, 0]]
  const secs = pts.map((p, k) => {
    const q = pts[Math.max(0, k - 1)], s = pts[Math.min(pts.length - 1, k + 1)]
    const tx = s[0] - q[0], ty = s[1] - q[1], l = Math.hypot(tx, ty)
    const nx = -ty / l, ny = tx / l, base = roofHeight(p[0], p[1]) - 0.35
    return prof.map(([o, h]) => [p[0] + nx * o * width / 2, p[1] + ny * o * width / 2, base + h * rise] as V3)
  })
  for (let k = 0; k < secs.length - 1; k++) for (let m = 0; m < prof.length - 1; m++) {
    const a = secs[k][m], b = secs[k + 1][m], c = secs[k + 1][m + 1], d = secs[k][m + 1]
    const up: V3 = [0, 0, 1]
    band.tri(a, b, c, [0, 0], [0, 0], [0, 0], [up, up, up])
    band.tri(a, c, d, [0, 0], [0, 0], [0, 0], [up, up, up])
  }
}
ridge([[-30, 12], [10, 22], [56, 30]], 7, 0.65)
ridge([[-90, -36], [-58, -60], [-26, -80]], 7, 0.65)

// ---------------------------------------------------------- curving slots
// The long sweeping glazed slots in the skin, drawn on the surface as lens
// shapes that rise along the wall (window panels within 5 cm of the skin).
function surf(i: number, r: number): { p: V3; n: V3 } {
  const k = Math.min(ROWS - 2, Math.floor(r)), t = r - k
  const a = grid[k][i], b = grid[k + 1][i], na = normals[k][i], nb = normals[k + 1][i]
  const n: V3 = [lerp(na[0], nb[0], t), lerp(na[1], nb[1], t), lerp(na[2], nb[2], t)]
  const l = Math.hypot(...n)
  return { p: [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)], n: [n[0] / l, n[1] / l, n[2] / l] }
}
function sweepSlot(from: P2, to: P2, r0: number, r1: number, half: number) {
  let i0 = nearest(...from), i1 = nearest(...to)
  if (i1 < i0) i1 += N
  const cnt = i1 - i0
  for (let k = 0; k < cnt; k++) {
    const e0 = Math.sin((Math.PI * k) / cnt), e1 = Math.sin((Math.PI * (k + 1)) / cnt)
    const c0 = lerp(r0, r1, k / cnt), c1 = lerp(r0, r1, (k + 1) / cnt)
    const ia = (i0 + k) % N, ib = (i0 + k + 1) % N
    const pts = [surf(ia, c0 - half * e0), surf(ib, c1 - half * e1), surf(ib, c1 + half * e1), surf(ia, c0 + half * e0)]
    const q = pts.map(({ p, n }) => [p[0] + n[0] * 0.05, p[1] + n[1] * 0.05, p[2] + n[2] * 0.05] as V3)
    slot.tri(q[0], q[1], q[2], [0, 0], [0, 0], [0, 0], [pts[0].n, pts[1].n, pts[2].n])
    slot.tri(q[0], q[2], q[3], [0, 0], [0, 0], [0, 0], [pts[0].n, pts[2].n, pts[3].n])
  }
}
sweepSlot([-88, -66], [-30, -108], 3.2, 5.8, 0.9) // Art Hall's south-west flank
sweepSlot([5, -99], [80, -66], 5.6, 3.0, 0.8) // the south arm, sloping down to the nose
sweepSlot([-14, 40], [-15, 70], 3.4, 5.4, 0.75) // the north lobe's west side
sweepSlot([51, 112], [36, 162], 3.3, 5.6, 0.75) // the north lobe's head

// ------------------------------------------------------------------ output
const skinFlood = (_p: V3, n: V3) => (n[2] > 0.8 ? 0 : 0.45)
const parts = [
  { part: metal, material: { ...finish('ddp-aluminium', 0xc4c8cc, 0.5), floodlight: skinFlood } },
  { part: green, material: finish('ddp-sedum', 0x95a97a) },
  { part: glazing, material: PALETTE.window },
  { part: slot, material: { ...PALETTE.window, name: 'window-2', color: 0x7d8f9e } },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Dongdaemun Design Plaza', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, anchor: [ANCHOR.lat, ANCHOR.lng], height: Math.max(...H),
  frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  replaces: ['relation/10647068'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/seoul-ddp.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
