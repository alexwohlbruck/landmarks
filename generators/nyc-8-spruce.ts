/**
 * 8 Spruce Street (New York by Gehry) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-8-spruce.ts
 *
 * Map frame: x = model east, y = model north (Spruce Street is the south
 * side), z up, metres. Placed at bearing 51°, the axis of the tower's walls.
 * Anchor: area centroid of the OSM outline way/109473848.
 *
 * Evidence
 * - OSM way/109473848 (outline) and its parts: the tower (274750647, a T in
 *   plan: a 37 m wide slab along Spruce Street and an 18 m wing to the
 *   north), its stepped ends (274750635–274750646) and the school podium
 *   (1089406290–1089406294); plans used as drawn.
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame: main roof 263–266 m (mechanical to ~270), the slab's ends
 *   stepping 176/139/85 m on the east and 139/85 m on the west, the north
 *   wing's end 176/139 m, the podium 26–30 m with a ~38 m east block.
 * - Published: 265 m, 76 floors, Frank Gehry, 2011 (Wikipedia). Rippled
 *   stainless-steel cladding on the east, west and north faces; the south
 *   face is flat; a five-storey brick public school (PS 397) at the base.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-8-spruce/photos/credits.txt
 *
 * The ripples are drawn as broad vertical folds about 6 m apart that bulge
 * up to 2 m out of the wall plane, their phase drifting with height so the
 * folds wander and drape as in the photos; they fade to the plane at every
 * corner so nothing sticks past an edge. The fold crests are bare steel and
 * the glass in the troughs a mid slate, so the folds read as wandering
 * light and dark streaks, banded by steel every five floors; the flat south
 * face is pale steel and light glass, as it reads in daylight.
 *
 * Estimated: the fold spacing, depth and drift (photos); the floor-band
 * rhythm; the podium's window pattern.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, prism, facade, finishModel, quadN, unit } from './nyc-570-lexington'
import type { Box } from './nyc-70-pine'

const steel = new Part(), glass = new Part(), brick = new Part(), win = new Part(), roof = new Part()

// --- The tower as a height field of boxes (OSM plans, lidar heights). ---
const PODIUM = 27
const TOWER: Box[] = [
  [-22.2, -20.0, 14.7, -0.7, 265], // the slab on Spruce Street
  [-12.8, -0.7, 5.5, 20.9, 265], // the north wing
  [14.7, -20.0, 18.2, -0.7, 176], [18.2, -20.0, 21.1, -0.7, 139], [21.1, -20.0, 25.9, -0.7, 85],
  [-24.2, -20.0, -22.2, 0.4, 139], [-26.4, -20.0, -24.2, 0.4, 85],
  [-12.8, 20.9, 5.5, 23.0, 176], [-12.8, 23.0, 5.5, 24.5, 139],
]

type Wall = { a: XY; b: XY; lo: number; hi: number }
/** Exposed walls (counter-clockwise, facing out) and roof rectangles of a union of boxes. */
function heightField(boxes: Box[], floor: number) {
  const xs = [...new Set(boxes.flatMap((b) => [b[0], b[2]]))].sort((a, b) => a - b)
  const ys = [...new Set(boxes.flatMap((b) => [b[1], b[3]]))].sort((a, b) => a - b)
  const nx = xs.length - 1, ny = ys.length - 1
  const H = Array.from({ length: ny }, (_, j) => Array.from({ length: nx }, (_, i) => {
    const x = (xs[i] + xs[i + 1]) / 2, y = (ys[j] + ys[j + 1]) / 2
    return Math.max(0, ...boxes.map((b) => (x > b[0] && x < b[2] && y > b[1] && y < b[3] ? b[4] : 0)))
  }))
  const h = (i: number, j: number) => Math.max(floor, H[j]?.[i] ?? 0)
  const walls: Wall[] = []
  const add = (a: XY, b: XY, lo: number, hi: number) => {
    if (hi <= lo + 1e-6) return
    const prev = walls.find((w) => w.lo === lo && w.hi === hi && w.b[0] === a[0] && w.b[1] === a[1] &&
      Math.abs((w.b[0] - w.a[0]) * (b[1] - a[1]) - (w.b[1] - w.a[1]) * (b[0] - a[0])) < 1e-9)
    if (prev) prev.b = b; else walls.push({ a, b, lo, hi })
  }
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) add([xs[i], ys[j]], [xs[i + 1], ys[j]], h(i, j - 1), h(i, j))
  for (let j = ny - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) add([xs[i + 1], ys[j + 1]], [xs[i], ys[j + 1]], h(i, j + 1), h(i, j))
  for (let i = nx - 1; i >= 0; i--) for (let j = 0; j < ny; j++) add([xs[i + 1], ys[j]], [xs[i + 1], ys[j + 1]], h(i + 1, j), h(i, j))
  for (let i = 0; i < nx; i++) for (let j = ny - 1; j >= 0; j--) add([xs[i], ys[j + 1]], [xs[i], ys[j]], h(i - 1, j), h(i, j))
  const roofs: Box[] = []
  const used = new Set<string>()
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const z = H[j][i]
    if (!z || used.has(`${i},${j}`)) continue
    let e = i + 1
    while (e < nx && H[j][e] === z && !used.has(`${e},${j}`)) e++
    let r = j + 1
    while (r < ny && Array.from({ length: e - i }, (_, k) => i + k).every((k) => H[r][k] === z && !used.has(`${k},${r}`))) r++
    for (let yy = j; yy < r; yy++) for (let xx = i; xx < e; xx++) used.add(`${xx},${yy}`)
    roofs.push([xs[i], ys[j], xs[e], ys[r], z])
  }
  return { walls, roofs }
}

// --- Rippled wall: broad folds that flow diagonally up the face. ---
// Each fold is about 9.5 m across and 2.5 m deep (1.1 m in, 1.4 m out of the
// wall plane); its phase climbs steadily with height, with a slow wobble, so
// the folds run up the face on a diagonal and drape, as in the photos. The
// surface is a smooth sheet (normals from the surface itself), so the light
// catches each fold; crests are bare steel, the glass sits in the troughs.
const DEPTH_IN = 1.1, DEPTH_OUT = 1.4, FOLD = 9.5, ROW = 7.5, FACETS = 4
function rippled(w: Wall, seed: number) {
  const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1])
  const ux = (w.b[0] - w.a[0]) / L, uy = (w.b[1] - w.a[1]) / L
  const n: V3 = [uy, -ux, 0]
  const folds = Math.max(1, Math.round(L / FOLD))
  const cols = folds * FACETS
  const rows = Math.max(1, Math.round((w.hi - w.lo) / ROW))
  const zs = Array.from({ length: rows + 1 }, (_, r) => w.lo + ((w.hi - w.lo) * r) / rows)
  const env = (k: number) => Math.sin((Math.PI * k) / cols) ** 0.5 // flat at the corners
  const wave = (k: number, z: number) => {
    const phase = z / 85 + 0.18 * Math.sin(z / 31 + seed) + seed * 0.37
    return Math.sin((k / FACETS + phase) * 2 * Math.PI) // −1 … 1
  }
  const depth = (k: number, z: number) => { const v = wave(k, z); return env(k) * (v > 0 ? v * DEPTH_OUT : v * DEPTH_IN) }
  const pos = (k: number, z: number): V3 => {
    const sv = (k / cols) * L, d = depth(k, z)
    return [w.a[0] + ux * sv + n[0] * d, w.a[1] + uy * sv + n[1] * d, z]
  }
  const nrm = (k: number, z: number): V3 => {
    const e = 0.2, k0 = Math.max(0, k - e), k1 = Math.min(cols, k + e)
    const ds = (depth(k1, z) - depth(k0, z)) / ((k1 - k0) * L / cols)
    const dz = (depth(k, z + 1) - depth(k, z - 1)) / 2
    return unit([n[0] - ux * ds, n[1] - uy * ds, -dz])
  }
  for (let r = 0; r < rows; r++) {
    const z0 = zs[r], z1 = zs[r + 1], zm = (z0 + z1) / 2
    for (let k = 0; k < cols; k++) {
      const part = wave(k + 0.5, zm) > 0.15 ? steel : glass
      quadN(part, pos(k, z0), pos(k + 1, z0), pos(k + 1, z1), pos(k, z1), [nrm(k, z0), nrm(k + 1, z0), nrm(k + 1, z1), nrm(k, z1)])
    }
  }
  // Steel caps closing the folds against the plane, top (facing up) and
  // bottom (facing up, over the trough floors).
  for (const z of [w.hi, w.lo]) {
    for (let k = 0; k < cols; k++) {
      const p = pos(k, z), q = pos(k + 1, z)
      const pp: V3 = [w.a[0] + ux * (k / cols) * L, w.a[1] + uy * (k / cols) * L, z]
      const qq: V3 = [w.a[0] + ux * ((k + 1) / cols) * L, w.a[1] + uy * ((k + 1) / cols) * L, z]
      const out = depth(k + 0.5, z) > 0
      if (out) { steel.tri(pp, q, p); steel.tri(pp, qq, q) } else { steel.tri(pp, p, q); steel.tri(pp, q, qq) }
    }
  }
}

// --- Flat south face: steel with a regular window grid. ---
const flatFacade: Facade = { bay: 3.6, ratio: 0.55, floor: 2.95, group: 4, spandrel: 1.4, sill: 1.2, head: 1.2, minLength: 2.5, margin: 0.3 }

const { walls, roofs } = heightField(TOWER, PODIUM)
let seed = 0
for (const w of walls) {
  const south = Math.abs(w.a[1] - w.b[1]) < 1e-6 && w.b[0] > w.a[0] // runs +x: faces −y
  if (south) facade(steel, glass, w.a, w.b, w.lo, w.hi, flatFacade)
  else rippled(w, (seed += 1.7))
}
for (const [x0, y0, x1, y1, z] of roofs) roof.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z])
// A mechanical penthouse on the main roof (lidar ~270 m).
prism({ wall: steel, win: null, roof, ring: [[-15, -15], [8, -15], [8, -4], [-6, -4], [-6, 12], [-15, 12]].map(([x, y]) => [x, y] as XY), z0: 265, z1: 269, facade: null, bevel: 0.3 })

// --- The school podium: five storeys of brick under the tower. ---
const OUTLINE: XY[] = [[-25.4, 28.8], [-27.0, -26.0], [33.5, -26.2], [18.2, 29.6]]
const EAST: XY[] = [[5.5, -19.6], [31.7, -19.3], [19.6, 24.6], [5.5, 24.5]]
const school: Facade = { bay: 4.4, ratio: 0.55, floor: 4.2, group: 2, spandrel: 1.8, sill: 1.4, head: 2.2, ground: 1.2, minLength: 3 }
const ccw = (r: XY[]) => { let s = 0; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; s += a[0] * b[1] - b[0] * a[1] } return s > 0 ? r : r.slice().reverse() }
prism({ wall: brick, win, roof, ring: ccw(OUTLINE), z0: 0, z1: PODIUM, facade: school, bevel: 0.4 })
prism({ wall: brick, win, roof, ring: ccw(EAST), z0: PODIUM, z1: 37, facade: { ...school, ground: undefined }, bevel: 0.4 })

finishModel('8 Spruce Street', 'nyc-8-spruce', [
  { part: steel, material: finish('spruce-steel', 0xe3e6e8) },
  { part: glass, material: { ...PALETTE.window, color: 0xa9bccb } },
  { part: roof, material: PALETTE.roof },
  { part: brick, material: finish('spruce-brick', 0xc99c86) },
  { part: win, material: { ...PALETTE.window, name: 'window-2' } },
], { bearing: 51, osm: 'way/109473848', height: 269 }, 6500)
