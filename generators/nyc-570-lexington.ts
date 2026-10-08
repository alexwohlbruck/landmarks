/**
 * General Electric Building (570 Lexington Avenue) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-570-lexington.ts
 *
 * Also the shared kit for the Grand Central group of the New York batch
 * (nyc-one-vanderbilt, nyc-metlife-building, nyc-helmsley-building,
 * nyc-chanin-building import `massing`, `prism`, `facade` and friends from
 * here). The model itself is only written when this file is run directly.
 *
 * Map frame: x = model east, y = model north (Lexington Avenue is +x, East
 * 51st Street is +y), z up, metres. Placed at bearing 29°, the Manhattan
 * grid. Anchor: area centroid of the OSM outline way/137885993.
 *
 * Evidence
 * - OSM way/137885993 (outline, 53.4 × 33.7 m) and its parts 137887333,
 *   137887335, 137887345, 137887870, 137887871, 137889011 (crown circle,
 *   195 m), 668481028 (the ground-floor food hall).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame (/tmp/city/nyc/work/g2/rot.py). Measured: tower shaft u −10…+8,
 *   v −12…+8, parapet 182 m, crown tracery to 193–195 m; the base steps back
 *   towards 51st Street and Lexington in 11 m stages (47, 58, 69, 80, 91 m);
 *   the west wing stands at 90 m; a low 11 m strip along the west edge.
 * - Published: 195 m, 50 floors, Cross & Cross, 1931 (Wikipedia; NRHP
 *   03001515). Orange-brown brick and terracotta, crown of Gothic tracery
 *   with a radio-wave/lightning sculpture.
 * - Photos (Wikimedia Commons, daylight, several sides): see
 *   /tmp/city/nyc/work/nyc-570-lexington/photos/credits.txt.
 *
 * Estimated: the chamfer of the tower's corners (photos: broad bevelled
 * corners reading as an elongated octagon near the top), the crown's spike
 * count and heights, the panel rhythm (3 floors per panel). The zigzag
 * chevron piers of the base are drawn as the stepped setbacks only.
 */
import { Part, writeGlb, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'

// ===========================================================================
// Shared kit
// ===========================================================================

export type XY = [number, number]
export const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l] }
const UP: V3 = [0, 0, 1]

export function quadN(p: Part, a: V3, b: V3, c: V3, d: V3, n?: [V3, V3, V3, V3]) {
  p.tri(a, b, c, undefined, undefined, undefined, n && [n[0], n[1], n[2]])
  p.tri(a, c, d, undefined, undefined, undefined, n && [n[0], n[2], n[3]])
}

/** Signed area, positive for counter-clockwise. */
export function area(r: XY[]) {
  let s = 0
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] }
  return s / 2
}

/** Ear-clipping triangulation of a simple polygon (any winding); emits up-facing (or down) triangles. */
export function capPoly(p: Part, ring: XY[], z: number, up = true) {
  let pts = ring.slice()
  if (area(pts) < 0) pts.reverse()
  const idx = pts.map((_, i) => i)
  const tris: [number, number, number][] = []
  const cross = (a: XY, b: XY, c: XY) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const inTri = (p: XY, a: XY, b: XY, c: XY) => cross(a, b, p) >= -1e-9 && cross(b, c, p) >= -1e-9 && cross(c, a, p) >= -1e-9
  let guard = 0
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length]
      const a = pts[i0], b = pts[i1], c = pts[i2]
      if (cross(a, b, c) <= 1e-9) continue
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inTri(pts[j], a, b, c))) continue
      tris.push([i0, i1, i2]); idx.splice(k, 1); clipped = true; break
    }
    if (!clipped) { // degenerate leftovers: drop a collinear point
      idx.splice(0, 1)
    }
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]])
  for (const [a, b, c] of tris) {
    const A: V3 = [pts[a][0], pts[a][1], z], B: V3 = [pts[b][0], pts[b][1], z], C: V3 = [pts[c][0], pts[c][1], z]
    if (up) p.tri(A, B, C); else p.tri(A, C, B)
  }
}

/** Offset a counter-clockwise ring inward by d (both convex and concave corners on the bisector). */
export function insetRing(ring: XY[], d: number): XY[] {
  return ring.map((b, i) => {
    const a = ring[(i + ring.length - 1) % ring.length], c = ring[(i + 1) % ring.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] - (u[0] + v[0]) * d / k, b[1] - (u[1] + v[1]) * d / k]
  })
}

/** A regular-ish polygon: rectangle with 45° chamfered corners, counter-clockwise. */
export function chamferRect(x0: number, y0: number, x1: number, y1: number, c: number): XY[] {
  if (c <= 0) return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  return [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]]
}

export type Facade = {
  /** Target bay pitch along the wall, metres. */
  bay: number
  /** Window panel width as a share of the bay. */
  ratio: number
  /** Storey height and storeys per panel. */
  floor: number
  group: number
  /** Solid band between stacked panels (spandrel), metres. */
  spandrel: number
  /** Solid wall left at the bottom (over a setback roof) and under the parapet. */
  sill: number
  head: number
  /** First window line above ground for walls that start at z = 0. */
  ground?: number
  /** Walls shorter than this get no windows. */
  minLength?: number
  /** Solid margin at each wall end. */
  margin?: number
}

/**
 * One wall plane from a to b (counter-clockwise ring order, so it faces out),
 * z0…z1, with slate window panels laid 0.05 m proud of it in bays and storey
 * groups. `na`/`nb` are optional smooth normals at its ends.
 */
export function facade(wall: Part, win: Part | null, a: XY, b: XY, z0: number, z1: number, f: Facade | null, na?: V3, nb?: V3) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (L < 1e-6 || z1 - z0 < 1e-6) return
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n: V3 = [uy, -ux, 0]
  const v = (s: number, z: number, d = 0): V3 => [a[0] + ux * s + n[0] * d, a[1] + uy * s + n[1] * d, z]
  const A = na ?? n, B = nb ?? n
  quadN(wall, v(0, z0), v(L, z0), v(L, z1), v(0, z1), [A, B, B, A])
  if (!win || !f) return
  const margin = f.margin ?? 0
  const usable = L - 2 * margin
  if (L < (f.minLength ?? 4) || usable < f.bay * 0.6) return
  const count = Math.max(1, Math.round(usable / f.bay)), pitch = usable / count, w = pitch * f.ratio
  const bottom = z0 + (z0 < 0.01 ? (f.ground ?? f.sill) : f.sill), top = z1 - f.head
  if (top - bottom < f.floor) return
  const rowH = f.floor * f.group
  const rows = Math.max(1, Math.round((top - bottom) / rowH)), rh = (top - bottom) / rows
  for (let r = 0; r < rows; r++) {
    const lo = bottom + r * rh + (r ? f.spandrel / 2 : 0), hi = bottom + (r + 1) * rh - (r < rows - 1 ? f.spandrel / 2 : 0)
    for (let k = 0; k < count; k++) {
      const c = margin + pitch * (k + 0.5)
      win.quad(v(c - w / 2, lo, 0.05), v(c + w / 2, lo, 0.05), v(c + w / 2, hi, 0.05), v(c - w / 2, hi, 0.05))
    }
  }
}

/**
 * A vertical prism on a counter-clockwise ring, z0…z1: facades on every edge,
 * convex corners softened with a small smooth chamfer, a bevelled coping and
 * a flat roof (skipped with roof = null). `faceFacade` can vary the facade per edge.
 */
export function prism(o: {
  wall: Part; win: Part | null; roof: Part | null; coping?: Part
  ring: XY[]; z0: number; z1: number; facade: Facade | null
  bevel?: number; faceFacade?: (i: number, a: XY, b: XY) => Facade | null
}) {
  let ring = o.ring.slice()
  if (area(ring) < 0) ring.reverse()
  const bevel = o.bevel ?? 0.45
  // Soften convex corners: each becomes two points with the faces' normals.
  const pts: XY[] = [], nrm: V3[] = [], src: number[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[(i + ring.length - 1) % ring.length], b = ring[i], c = ring[(i + 1) % ring.length]
    const l0 = Math.hypot(b[0] - a[0], b[1] - a[1]), l1 = Math.hypot(c[0] - b[0], c[1] - b[1])
    const u: XY = [(b[0] - a[0]) / l0, (b[1] - a[1]) / l0], w: XY = [(c[0] - b[0]) / l1, (c[1] - b[1]) / l1]
    const cr = u[0] * w[1] - u[1] * w[0]
    const r = Math.min(bevel, l0 * 0.25, l1 * 0.25)
    if (cr > 1e-4 && r > 0.05) {
      pts.push([b[0] - u[0] * r, b[1] - u[1] * r], [b[0] + w[0] * r, b[1] + w[1] * r])
      nrm.push([u[1], -u[0], 0], [w[1], -w[0], 0]); src.push(-1, i)
    } else {
      pts.push(b); nrm.push(unit([u[1] + w[1], -u[0] - w[0], 0])); src.push(i)
    }
  }
  const topWall = o.z1 - (o.roof ? bevel : 0)
  for (let k = 0; k < pts.length; k++) {
    const j = (k + 1) % pts.length, a = pts[k], b = pts[j]
    // A segment starting at the first point of a softened corner is the chamfer itself.
    const chamfer = src[k] === -1
    const edgeIndex = src[k]
    const f = chamfer ? null : o.faceFacade ? o.faceFacade(edgeIndex, a, b) : o.facade
    if (chamfer) facade(o.wall, null, a, b, o.z0, topWall, null, nrm[k], nrm[j])
    else {
      const n: V3 = unit([b[1] - a[1], a[0] - b[0], 0])
      facade(o.wall, o.win, a, b, o.z0, topWall, f, n, n)
    }
  }
  if (!o.roof) return pts
  // Coping: a rounded lip from the wall face up and in onto the roof.
  const coping = o.coping ?? o.wall
  const inner = insetRing(pts, bevel)
  for (let k = 0; k < pts.length; k++) {
    const j = (k + 1) % pts.length
    const a: V3 = [pts[k][0], pts[k][1], topWall], b: V3 = [pts[j][0], pts[j][1], topWall]
    const c: V3 = [inner[j][0], inner[j][1], o.z1], d: V3 = [inner[k][0], inner[k][1], o.z1]
    const na = unit([nrm[k][0], nrm[k][1], 0.2]), nb = unit([nrm[j][0], nrm[j][1], 0.2])
    quadN(coping, a, b, c, d, [na, nb, UP, UP])
  }
  capPoly(o.roof, inner, o.z1)
  return pts
}

/**
 * A stepped mass from axis-aligned boxes [x0, y0, x1, y1, height], unioned as
 * a height field so only exposed walls are drawn. Walls get facades, the
 * stage tops a coping lip and a flat roof.
 */
export function massing(o: {
  wall: Part; win: Part | null; roof: Part; coping?: Part
  boxes?: [number, number, number, number, number][]
  /** Or polygons [height, ring] — the cell height is the highest polygon over its centre. */
  polys?: [number, XY[]][]
  facade: Facade | null; bevel?: number
}) {
  const bevel = o.bevel ?? 0.45
  const boxes = o.boxes ?? []
  const polys = o.polys ?? []
  const xs = [...new Set([...boxes.flatMap((b) => [b[0], b[2]]), ...polys.flatMap(([, r]) => r.map((p) => p[0]))])].sort((a, b) => a - b)
  const ys = [...new Set([...boxes.flatMap((b) => [b[1], b[3]]), ...polys.flatMap(([, r]) => r.map((p) => p[1]))])].sort((a, b) => a - b)
  const H = ys.slice(1).map((_, j) => xs.slice(1).map((_, i) => {
    const x = (xs[i] + xs[i + 1]) / 2, y = (ys[j] + ys[j + 1]) / 2
    return Math.max(0, ...boxes.map((b) => (x > b[0] && x < b[2] && y > b[1] && y < b[3] ? b[4] : 0)),
      ...polys.map(([z, r]) => (inside([x, y], r) ? z : 0)))
  }))
  const h = (i: number, j: number) => H[j]?.[i] ?? 0
  type W = { a: XY; b: XY; lo: number; hi: number }
  const walls: W[] = []
  const add = (a: XY, b: XY, lo: number, hi: number) => {
    if (hi <= lo + 1e-6) return
    const prev = walls.find((w) => w.lo === lo && w.hi === hi && w.b[0] === a[0] && w.b[1] === a[1] &&
      Math.abs((w.b[0] - w.a[0]) * (b[1] - a[1]) - (w.b[1] - w.a[1]) * (b[0] - a[0])) < 1e-9)
    if (prev) prev.b = b; else walls.push({ a, b, lo, hi })
  }
  const nx = xs.length - 1, ny = ys.length - 1
  // South faces (−y), run +x; north faces run −x; east faces run +y; west faces run −y.
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) add([xs[i], ys[j]], [xs[i + 1], ys[j]], h(i, j - 1), h(i, j))
  for (let j = ny - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) add([xs[i + 1], ys[j + 1]], [xs[i], ys[j + 1]], h(i, j + 1), h(i, j))
  for (let i = nx - 1; i >= 0; i--) for (let j = 0; j < ny; j++) add([xs[i + 1], ys[j]], [xs[i + 1], ys[j + 1]], h(i + 1, j), h(i, j))
  for (let i = 0; i < nx; i++) for (let j = ny - 1; j >= 0; j--) add([xs[i], ys[j + 1]], [xs[i], ys[j]], h(i - 1, j), h(i, j))
  // Walls whose low edge is above ground but whose neighbour is lower still need the full
  // run down to the neighbour; `add` already does lo = neighbour height.
  const coping = o.coping ?? o.wall
  for (const w of walls) {
    const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]), ux = (w.b[0] - w.a[0]) / L, uy = (w.b[1] - w.a[1]) / L
    const n: V3 = [uy, -ux, 0]
    facade(o.wall, o.win, w.a, w.b, w.lo, w.hi - bevel, o.facade, n, n)
    // Coping lip: from the face at hi − bevel up and in to hi.
    const nu = unit([n[0], n[1], 0.2])
    quadN(coping, [w.a[0], w.a[1], w.hi - bevel], [w.b[0], w.b[1], w.hi - bevel],
      [w.b[0] - n[0] * bevel, w.b[1] - n[1] * bevel, w.hi], [w.a[0] - n[0] * bevel, w.a[1] - n[1] * bevel, w.hi], [nu, nu, UP, UP])
  }
  // Roofs: greedy rectangles of equal height, a little below the lip so they never fight it.
  const used = new Set<string>()
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const z = h(i, j)
    if (!z || used.has(`${i},${j}`)) continue
    let e = i + 1
    while (e < nx && h(e, j) === z && !used.has(`${e},${j}`)) e++
    let r = j + 1
    while (r < ny && Array.from({ length: e - i }, (_, k) => i + k).every((k) => h(k, r) === z && !used.has(`${k},${r}`))) r++
    for (let yy = j; yy < r; yy++) for (let xx = i; xx < e; xx++) used.add(`${xx},${yy}`)
    o.roof.quad([xs[i], ys[j], z - 0.04], [xs[e], ys[j], z - 0.04], [xs[e], ys[r], z - 0.04], [xs[i], ys[r], z - 0.04])
  }
  return { xs, ys, H }
}

export function inside(pt: XY, poly: XY[]) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit
  }
  return hit
}

/** A pyramid / spike on a ring from z0 to an apex. */
export function spire(p: Part, ring: XY[], z0: number, apex: V3, smooth = false) {
  let r = ring.slice(); if (area(r) < 0) r.reverse()
  for (let i = 0; i < r.length; i++) {
    const j = (i + 1) % r.length
    const a: V3 = [r[i][0], r[i][1], z0], b: V3 = [r[j][0], r[j][1], z0]
    if (!smooth) p.tri(a, b, apex)
    else {
      const ca = unit([r[i][0] - apex[0], r[i][1] - apex[1], 0.4]), cb = unit([r[j][0] - apex[0], r[j][1] - apex[1], 0.4])
      p.tri(a, b, apex, undefined, undefined, undefined, [ca, cb, unit([ca[0] + cb[0], ca[1] + cb[1], ca[2] + cb[2]])])
    }
  }
}

/** A closed loft between rings (same point count), with optional caps. */
export function loftRings(p: Part, rings: V3[][], capTop = true, capBottom = false) {
  p.loft(rings)
  if (capTop) p.cap(rings[rings.length - 1], true)
  if (capBottom) p.cap(rings[0], false)
}

export const ring3 = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])

export function circle(cx: number, cy: number, r: number, n: number, phase = 0): XY[] {
  return Array.from({ length: n }, (_, i) => [cx + r * Math.cos(phase + (i * 2 * Math.PI) / n), cy + r * Math.sin(phase + (i * 2 * Math.PI) / n)] as XY)
}

/**
 * Tall lancet window panels across a wall a→b (counter-clockwise ring order):
 * `count` panels, each a rectangle with a pointed top, 0.05 m proud.
 */
export function lancets(win: Part, a: XY, b: XY, z0: number, z1: number, count: number, ratio: number, point: number, margin = 0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n: XY = [uy, -ux]
  const v = (s: number, z: number): V3 => [a[0] + ux * s + n[0] * 0.05, a[1] + uy * s + n[1] * 0.05, z]
  const pitch = (L - 2 * margin) / count, w = pitch * ratio
  for (let k = 0; k < count; k++) {
    const c = margin + pitch * (k + 0.5)
    win.quad(v(c - w / 2, z0), v(c + w / 2, z0), v(c + w / 2, z1 - point), v(c - w / 2, z1 - point))
    win.tri(v(c - w / 2, z1 - point), v(c + w / 2, z1 - point), v(c, z1))
  }
}

export function finishModel(name: string, id: string, parts: { part: Part; material: MaterialSpec }[], extras: Record<string, unknown>, maxTris = 5000) {
  const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
  if (triangles > maxTris) throw new Error(`${id}: triangle budget exceeded: ${triangles}`)
  if (parts.length > 6) throw new Error(`${id}: too many materials: ${parts.length}`)
  const glb = writeGlb(name, parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor', ...extras })
  if (glb.length > 250000) throw new Error(`${id}: file budget exceeded: ${glb.length}`)
  const out = new URL(`../models/${id}.glb`, import.meta.url).pathname
  Bun.write(out, glb)
  console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
}

// ===========================================================================
// The General Electric Building
// ===========================================================================

function build() {
  const brick = new Part(), win = new Part(), roof = new Part(), crown = new Part(), tip = new Part()

  const baseFacade: Facade = { bay: 4.4, ratio: 0.5, floor: 3.65, group: 3, spandrel: 2.2, sill: 1.6, head: 1.6, ground: 6, minLength: 3.5 }
  const towerFacade: Facade = { bay: 4.2, ratio: 0.5, floor: 3.65, group: 3, spandrel: 2.2, sill: 1.6, head: 8, margin: 1.0 }

  // Low strip along the west edge (lidar 9–11 m) and the stepped base.
  // Steps measured on the lidar: towards 51st Street (north, +y) and
  // Lexington (east, +x) in 11 m stages; the west wing rises to 90 m.
  const N = 16.2, S = -17.2, E = 26.2, Wb = -22.2
  massing({
    wall: brick, win, roof, facade: baseFacade,
    boxes: [
      [-27.1, S, Wb, N, 11],
      [Wb, S, E, N, 47],
      [Wb, S, E - 2.4, N - 2.2, 58],
      [Wb, S, E - 4.6, N - 4.4, 69],
      [Wb, S, E - 7.6, N - 7, 80],
      [Wb, S, E - 10.2, N - 9.4, 91],
    ],
  })

  // The tower shaft: an elongated octagon (broad chamfered corners) rising
  // from the 91 m roof. Brick to 174 m (the lancets start a little below); above that the crown storeys turn
  // pale terracotta, with tall pointed lancets on every face.
  const T = { x0: -10.4, x1: 8.4, y0: -12.4, y1: 8.4 }
  const shaft = chamferRect(T.x0, T.y0, T.x1, T.y1, 2.6)
  const pts = prism({ wall: brick, win, roof: null, ring: shaft, z0: 91, z1: 174, facade: towerFacade, bevel: 0.5 })
  prism({ wall: crown, win: null, roof, ring: shaft, z0: 174, z1: 182, facade: null, bevel: 0.5 })
  for (let i = 0; i < shaft.length; i++) {
    const a = shaft[i], b = shaft[(i + 1) % shaft.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) continue // the chamfered corners stay solid
    lancets(win, a, b, 167.5, 180.5, L > 12 ? 4 : 3, 0.4, 2.4, 1.6)
  }
  void pts

  // Crown: a ring of Gothic pinnacles on the parapet, paired at each
  // chamfered corner and tallest at the middle of each face, round a stepped
  // tracery core that carries the radio-wave finial.
  const cx = (T.x0 + T.x1) / 2, cy = (T.y0 + T.y1) / 2
  const pr = insetRing(shaft, 1.1)
  const pin = (x: number, y: number, s: number, z: number, h: number) =>
    spire(crown, [[x - s, y - s], [x + s, y - s], [x + s, y + s], [x - s, y + s]], z, [x, y, z + h])
  for (let i = 0; i < pr.length; i++) {
    const a = pr[i], b = pr[(i + 1) % pr.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 6) { // corner: a pair of tall pinnacles
      for (const t of [0.2, 0.8]) pin(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.75, 182, 9)
      continue
    }
    const n = 5
    for (let k = 1; k < n; k++) {
      const t = k / n, mid = 1 - Math.abs(t - 0.5) * 2
      pin(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.6, 182, 4 + 4 * mid)
    }
  }
  const core1 = chamferRect(cx - 6, cy - 6.6, cx + 6, cy + 6.6, 2.2)
  prism({ wall: crown, win: null, roof: crown, ring: core1, z0: 182, z1: 187.5, facade: null, bevel: 0.35 })
  const c1 = insetRing(core1, 0.9)
  for (let i = 0; i < c1.length; i++) {
    const a = c1[i], b = c1[(i + 1) % c1.length]
    for (const t of [0.25, 0.75]) pin(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.55, 187.5, 6)
  }
  const core2 = chamferRect(cx - 3.4, cy - 3.8, cx + 3.4, cy + 3.8, 1.3)
  prism({ wall: crown, win: null, roof: crown, ring: core2, z0: 187.5, z1: 191, facade: null, bevel: 0.3 })
  // Radio waves: four flaring blades round a central spike.
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as XY[]) {
    const px = -dy, py = dx
    const base = (s: number, d: number, z: number): V3 => [cx + dx * d + px * s, cy + dy * d + py * s, z]
    const blade: V3[] = [base(-0.6, 0.8, 191), base(0.6, 0.8, 191), base(0, 3.4, 195)]
    tip.tri(blade[0], blade[1], blade[2]); tip.tri(blade[1], blade[0], blade[2])
  }
  spire(tip, chamferRect(cx - 1.1, cy - 1.1, cx + 1.1, cy + 1.1, 0.35), 191, [cx, cy, 196])

  finishModel('General Electric Building', 'nyc-570-lexington', [
    { part: brick, material: finish('ge-brick', 0xd09a7c) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: crown, material: finish('ge-terracotta', 0xe2cfb4) },
    { part: tip, material: finish('ge-crown-metal', 0xb9b2a6) },
  ], { bearing: 29, osm: 'way/137885993', height: 196 })
}

if (import.meta.main) build()
