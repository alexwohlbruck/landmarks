/**
 * London Heathrow Terminal 5, the main building 5A (Richard Rogers
 * Partnership with Pascall+Watson, engineers Arup; opened 14 March 2008) —
 * procedural, CC0-1.0, no textures.
 * bun generators/london-heathrow-terminal-5.ts
 *
 * Writes models/london-heathrow-terminal-5.glb (low) and
 * models/london-heathrow-terminal-5.detail.glb (detail: the whole landmark
 * again, with the roof's section joints as ribs, finer mullions, rooftop
 * vents and glazed jet-bridge links).
 *
 * Also the small kit the other Heathrow models of this batch import
 * (`arcRoof`, `band`, `leanWall`, `LHR` colours); the model itself is only
 * written when this file is run directly.
 *
 * Map frame: x = model east, y = model north, z up, metres. Bearing −0.35°:
 * the outline's long walls run 0.35° west of north. Anchor: area centroid of
 * OSM way/23231957 (jet bridges included). The airside apron is +x (east),
 * the landside forecourt −x (west).
 *
 * Identifying features (photos): one huge shed, 396 × 176 m, under a single
 * shallow curved roof spanning east–west across the building's width, so the
 * north and south glass end walls are arch-topped and the long sides have a
 * low, straight eave; silver-grey metal roof with transverse section joints
 * and rows of small rooftop vents; fully glazed walls, the long ones leaning
 * out 6.5°; the raking steel "legs" (22 pairs a side) just inside the long
 * glass walls, seen through it as big diagonals; a low white apron-level
 * strip along the airside with jet bridges to the stands.
 *
 * Evidence
 * - OSM: way/23231957 (Heathrow Terminal 5, building=airport_terminal,
 *   height 40, start_date 2008-03-27; the outline draws every fixed jet-bridge
 *   link and cab, which `despur` cuts off and draws as bridges). No
 *   building:parts. Body after despur: x −87.5…81.4, y −195.5…194.4 (169 ×
 *   390 m).
 * - Published: 396 m long, 176 m wide, 40 m high; glass facades angled 6.5°
 *   to the vertical; four storeys (Wikipedia, "Heathrow Terminal 5"). Roof a
 *   156 m single span, 396 m long, on 22 pairs of 914 mm steel legs reaching
 *   down to apron level just inside the facades (Ingenia, "T5 goes live",
 *   https://ingenia.org.uk/articles/t5-goes-live/). Bow-string arch, 22
 *   repeated abutments (Structures and Buildings 161(2), "T5A roof").
 * - Photos (Wikimedia Commons):
 *   https://commons.wikimedia.org/wiki/File:Terminal_5_at_London_Heathrow_Airport,_2008.jpg
 *     (Warren Rohner, CC BY-SA 2.0) from the south-east on the apron: the
 *     arch-topped south end wall, the long airside facade, the white strip
 *     and jet bridges; the roof profile was read from it;
 *   https://commons.wikimedia.org/wiki/File:Heathrow,Terminal_5,_from_above_-_geograph.org.uk_-_3013192.jpg
 *     (M J Richardson, CC BY-SA 2.0) aerial from the south-west: plan, roof
 *     colour, section joints, rooftop vents, the overhanging eaves;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_Terminal_5_from_the_air.jpg
 *     (Thomas Nugent, CC BY-SA 2.0) aerial from the north: the north end
 *     wall, vents in rows;
 *   https://commons.wikimedia.org/wiki/File:London_Heathrow_Terminal_5_-_geograph.org.uk_-_5327180.jpg
 *     (James Emmans, CC BY-SA 2.0) the landside facade close up: the
 *     leaning glass, the raking legs behind it, the eave soffit;
 *   https://commons.wikimedia.org/wiki/File:Heathrow_airport_Terminal_5.jpg
 *     and https://commons.wikimedia.org/wiki/File:Heathrow_Airport_Terminal_5.jpg
 *     (CedarGlen86, CC0) interiors: the legs and the roof's arched beams;
 *   https://commons.wikimedia.org/wiki/File:London_Heathrow_Terminal_5_-_geograph.org.uk_-_3196264.jpg
 *     (Richard Cooke, CC BY-SA 2.0) the north-east corner from the apron.
 * - Terrain: Mapterhorn flat to ±0.5 m under the building.
 * - No lidar (England's Environment Agency lidar was not used; no repo tool).
 *
 * Numbers: roof 176 × 394 m (published width; length from the outline plus a
 * 2.5 m overhang at each end), crown 40 m (published, OSM), eave 20 m at the
 * roof edge (estimated from Rohner's photo: the end wall's corner is about
 * half the crown's height); the arch profile z = 20 + 20·(1 − u²)^0.7 across
 * the width (fitted to the end wall's outline in Rohner's photo, which is
 * steeper at the eaves than a circle); roof 2.2 m deep; the long walls lean
 * out 6.5° (published) from the outline; the end walls stand 3 m in from
 * the roof's ends; the legs as V pairs every 17.8 m (22 a side, published)
 * drawn as pale bands on the glass (they stand just inside it); the
 * airside strip 7 m deep, 8 m high (estimated from Rohner's photo); jet
 * bridges at 4.5–8 m (estimated). Vents: placed from the aerials, sizes
 * estimated.
 * Doubts: whether the OSM outline is the roof's edge or the glass line (it
 * is taken as the glass line at the foot of the walls); the eave height; the
 * landside forecourt structures (drop-off canopy, lift drums, the bridges to
 * the car park and hotel) stand outside the outline and are left out.
 */
import { Part, type V3, type MaterialSpec } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, quadN, unit } from './nyc-570-lexington'
import { despur, simplify, jetBridges, prismRing, newMats, writeLod, type Mats } from './tokyo-haneda-terminal-1'

// ===========================================================================
// Kit (shared with the other Heathrow models)
// ===========================================================================

/** Heathrow colours, from daylight photos, pulled to the palette's lightness. */
export const LHR = {
  /** T5's silver-grey standing-seam roof. */
  roof: finish('lhr-silver-roof', 0xc3c8cc),
  /** Light, reflective curtain-wall glass, grey-blue by day; lit at night. */
  window: { name: 'window', color: 0x8fa5b6, roughness: 0.35 } as MaterialSpec,
  /** White steel and mullions. */
  white: finish('lhr-white', 0xeceeee),
  /** Light grey cladding panels. */
  panel: finish('lhr-panel', 0xdcdfe1),
  /** Jet bridges. */
  bridge: finish('lhr-jet-bridge', 0xd0d4d7),
}

/**
 * A roof curved across x (spanning x0…x1) and straight along y (y0…y1):
 * the top at z(x) = zEdge + rise·(1 − u²)^pow, u the distance from the
 * middle over the half-span; `depth` thick, with fascias on all four sides
 * and the soffit underneath. Returns the top's height function and the
 * soffit's.
 */
export function arcRoof(top: Part, edge: Part, o: { x0: number; x1: number; y0: number; y1: number; zEdge: number; rise: number; pow: number; depth: number; n: number; ribs?: { every: number; part: Part; w: number; h: number } }) {
  const { x0, x1, y0, y1, zEdge, rise, pow, depth, n } = o
  const xc = (x0 + x1) / 2, hw = (x1 - x0) / 2
  const zTop = (x: number) => { const u = Math.min(1, Math.abs((x - xc) / hw)); return zEdge + rise * Math.pow(1 - u * u, pow) }
  const zBot = (x: number) => zTop(x) - depth
  // sample points spaced more densely near the steep eaves
  const xs: number[] = []
  for (let i = 0; i <= n; i++) { const t = i / n; const s = Math.sin((t - 0.5) * Math.PI) * 0.5 + 0.5; xs.push(x0 + (x1 - x0) * (0.35 * t + 0.65 * s)) }
  const slope = (x: number) => { const e = 0.05; return (zTop(Math.min(x1, x + e)) - zTop(Math.max(x0, x - e))) / (Math.min(x1, x + e) - Math.max(x0, x - e)) }
  const nTop = (x: number): V3 => unit([-slope(x), 0, 1])
  for (let i = 0; i < n; i++) {
    const a = xs[i], b = xs[i + 1]
    const na = nTop(a), nb = nTop(b)
    quadN(top, [a, y0, zTop(a)], [b, y0, zTop(b)], [b, y1, zTop(b)], [a, y1, zTop(a)], [na, nb, nb, na])
    const ma: V3 = [-na[0], 0, -na[2]], mb: V3 = [-nb[0], 0, -nb[2]]
    quadN(edge, [a, y0, zBot(a)], [a, y1, zBot(a)], [b, y1, zBot(b)], [b, y0, zBot(b)], [ma, ma, mb, mb])
    // end fascias
    const s: V3 = [0, -1, 0], N: V3 = [0, 1, 0]
    quadN(edge, [a, y0, zBot(a)], [b, y0, zBot(b)], [b, y0, zTop(b)], [a, y0, zTop(a)], [s, s, s, s])
    quadN(edge, [b, y1, zBot(b)], [a, y1, zBot(a)], [a, y1, zTop(a)], [b, y1, zTop(b)], [N, N, N, N])
    if (o.ribs) for (let y = y0 + o.ribs.every; y < y1 - 1; y += o.ribs.every) {
      const { w, h, part } = o.ribs
      quadN(part, [a, y - w / 2, zTop(a) + h], [b, y - w / 2, zTop(b) + h], [b, y + w / 2, zTop(b) + h], [a, y + w / 2, zTop(a) + h], [na, nb, nb, na])
      quadN(part, [a, y - w / 2, zTop(a) - 0.05], [b, y - w / 2, zTop(b) - 0.05], [b, y - w / 2, zTop(b) + h], [a, y - w / 2, zTop(a) + h], [s, s, s, s])
      quadN(part, [b, y + w / 2, zTop(b) - 0.05], [a, y + w / 2, zTop(a) - 0.05], [a, y + w / 2, zTop(a) + h], [b, y + w / 2, zTop(b) + h], [N, N, N, N])
    }
  }
  // long fascias at the eaves
  quadN(edge, [x0, y1, zBot(x0)], [x0, y0, zBot(x0)], [x0, y0, zTop(x0)], [x0, y1, zTop(x0)], [[-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0]])
  quadN(edge, [x1, y0, zBot(x1)], [x1, y1, zBot(x1)], [x1, y1, zTop(x1)], [x1, y0, zTop(x1)], [[1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0]])
  return { zTop, zBot, xs }
}

/**
 * A plane wall given by an origin `o`, an along-wall unit `u` (horizontal)
 * and an up-the-wall vector `v` (unit, may lean); `n` is its outward normal.
 * `band` lays a flat strip on it, 0.06 m proud, between two (s, t) points
 * (s along u, t along v) with width w.
 */
export type WallPlane = { o: V3; u: V3; v: V3; n: V3 }
export const onWall = (W: WallPlane, s: number, t: number, d = 0): V3 => [W.o[0] + W.u[0] * s + W.v[0] * t + W.n[0] * d, W.o[1] + W.u[1] * s + W.v[1] * t + W.n[1] * d, W.o[2] + W.u[2] * s + W.v[2] * t + W.n[2] * d]
export function band(p: Part, W: WallPlane, a: [number, number], b: [number, number], w: number, d = 0.06) {
  const ds = b[0] - a[0], dt = b[1] - a[1], L = Math.hypot(ds, dt)
  if (L < 1e-6) return
  const ps = (-dt / L) * (w / 2), pt = (ds / L) * (w / 2)
  const n = W.n
  quadN(p, onWall(W, a[0] - ps, a[1] - pt, d), onWall(W, b[0] - ps, b[1] - pt, d), onWall(W, b[0] + ps, b[1] + pt, d), onWall(W, a[0] + ps, a[1] + pt, d), [n, n, n, n])
}

/** A wall from a…b on the ground, leaning out by `lean` degrees, `h` tall measured up the wall. */
export function leanWall(p: Part, a: XY, b: XY, h: number, lean: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0]
  const out: V3 = [u[1], -u[0], 0], r = (lean * Math.PI) / 180
  const v: V3 = [out[0] * Math.sin(r), out[1] * Math.sin(r), Math.cos(r)]
  const n: V3 = [out[0] * Math.cos(r), out[1] * Math.cos(r), -Math.sin(r)]
  const W: WallPlane = { o: [a[0], a[1], 0], u, v, n }
  quadN(p, onWall(W, 0, 0), onWall(W, L, 0), onWall(W, L, h), onWall(W, 0, h), [n, n, n, n])
  return { W, L }
}

// ===========================================================================
// OSM data, in this frame (bearing −0.35, anchor −0.4879054, 51.4716115)
// ===========================================================================

/** OSM way/23231957 */
const T5_OUTLINE: XY[] = [[-14.4,-195.5],[33.2,-229.5],[33.3,-232.0],[33.2,-249.0],[30.2,-249.0],[30.2,-242.6],[25.6,-242.6],[25.6,-232.0],[30.0,-232.0],[29.5,-230.9],[-18.3,-195.5],[-31.2,-195.5],[-16.9,-231.9],[-16.9,-249.1],[-20.0,-249.1],[-20.0,-243.0],[-24.2,-243.0],[-24.2,-231.9],[-20.2,-231.9],[-33.6,-195.4],[-46.5,-195.4],[-72.1,-238.3],[-72.1,-239.5],[-72.1,-253.4],[-75.2,-253.4],[-75.2,-250.1],[-79.1,-250.1],[-79.1,-239.5],[-75.4,-239.5],[-49.5,-195.4],[-87.3,-195.2],[-87.6,-129.3],[-87.6,-56.3],[-87.6,15.4],[-87.6,83.1],[-87.6,101.9],[-87.7,123.9],[-87.7,194.4],[-50.2,194.4],[-101.5,255.7],[-101.4,258.8],[-103.3,258.8],[-103.3,260.9],[-103.2,267.3],[-103.1,273.2],[-99.9,273.0],[-99.9,269.9],[-96.4,269.7],[-96.4,258.6],[-98.7,258.7],[-98.7,256.7],[-49.1,197.0],[-47.1,194.4],[-31.9,194.4],[-58.8,240.5],[-58.8,243.0],[-60.5,243.0],[-60.5,244.8],[-60.4,251.2],[-60.2,259.5],[-57.8,259.4],[-57.7,261.4],[-56.0,261.2],[-52.9,255.8],[-52.5,254.1],[-53.5,254.1],[-53.5,242.8],[-55.8,242.9],[-55.8,240.8],[-29.0,194.4],[-13.9,194.4],[-15.5,242.7],[-17.3,242.8],[-17.3,244.8],[-17.2,251.4],[-17.1,259.5],[-14.6,259.5],[-14.6,261.3],[-13.0,261.4],[-10.1,256.2],[-10.3,242.6],[-12.7,242.7],[-11.6,194.4],[21.2,194.4],[40.5,237.0],[40.6,239.3],[38.8,239.3],[38.8,241.2],[38.9,247.8],[39.0,256.4],[41.6,256.4],[41.7,257.8],[43.1,257.8],[46.1,252.2],[45.7,239.2],[43.4,239.2],[43.3,237.2],[24.4,194.4],[38.5,194.4],[102.5,253.4],[103.6,253.4],[103.6,254.2],[105.7,254.1],[117.7,253.9],[117.5,250.7],[114.7,250.7],[114.6,247.2],[103.4,247.3],[103.5,250.3],[41.7,194.4],[57.3,194.4],[57.8,196.0],[103.7,210.3],[103.7,211.1],[105.4,211.1],[120.5,211.0],[120.6,208.3],[122.0,208.2],[122.0,206.5],[116.2,203.9],[103.6,204.3],[103.6,207.4],[60.3,194.4],[81.4,194.4],[81.4,134.9],[81.4,134.2],[102.0,153.9],[103.5,153.6],[103.5,155.2],[105.6,155.2],[113.8,155.1],[120.5,155.1],[120.5,152.4],[121.9,152.3],[121.8,150.6],[116.6,147.7],[103.4,148.1],[103.4,151.1],[81.4,131.0],[81.4,84.8],[102.0,110.8],[103.4,110.7],[103.5,111.7],[105.5,111.6],[120.4,111.4],[120.4,108.6],[121.8,108.6],[121.8,107.1],[116.3,104.2],[103.3,104.9],[103.4,107.4],[81.4,80.8],[81.5,61.3],[102.5,67.5],[103.4,67.0],[103.5,68.4],[105.3,68.4],[120.4,68.3],[120.4,65.8],[121.8,65.7],[121.8,64.0],[115.9,61.2],[103.3,61.6],[103.4,64.4],[102.5,64.5],[81.5,58.8],[81.5,10.7],[103.4,10.5],[103.5,12.3],[105.3,12.3],[120.5,12.2],[120.4,9.6],[121.8,9.5],[121.8,7.9],[115.9,4.8],[103.5,5.2],[103.4,8.4],[81.5,8.3],[81.5,-61.6],[103.3,-64.9],[103.3,-63.0],[109.5,-63.2],[120.4,-63.4],[120.4,-65.8],[121.8,-65.8],[121.7,-67.4],[115.4,-70.5],[103.2,-70.3],[103.2,-67.5],[81.5,-64.0],[81.6,-83.3],[102.4,-91.4],[102.4,-93.8],[81.6,-86.2],[81.4,-134.0],[103.3,-139.9],[103.3,-138.5],[105.4,-138.5],[120.3,-138.6],[120.2,-141.2],[121.9,-141.3],[121.8,-142.9],[116.0,-145.8],[103.2,-145.5],[103.2,-143.0],[81.4,-136.4],[81.0,-195.6],[57.4,-195.7],[103.2,-213.8],[103.2,-212.0],[109.5,-212.1],[124.0,-212.3],[126.0,-214.8],[128.0,-215.0],[130.2,-217.7],[129.6,-218.1],[128.3,-218.2],[128.2,-219.6],[103.1,-219.2],[103.2,-217.1],[52.6,-195.6],[52.2,-195.6],[30.1,-195.5],[103.4,-235.2],[127.7,-235.1],[127.7,-237.3],[127.7,-252.0],[124.4,-252.0],[124.5,-247.8],[120.9,-247.8],[120.9,-237.2],[102.8,-237.6],[25.2,-195.5],[1.6,-195.3],[80.1,-229.6],[80.4,-232.0],[80.4,-246.8],[77.1,-246.8],[77.2,-242.7],[73.6,-242.7],[73.6,-232.0],[77.1,-232.0],[76.7,-231.2],[-2.6,-195.4]]

// ===========================================================================
// Terminal 5A
// ===========================================================================

/** The glass line at the foot of the walls (the despurred outline, squared up). */
const XW = -87.6, XE = 81.4, YS = -195.5, YN = 194.4
/** The roof: 176 m wide (published), overhanging the ends by 2.5 m. */
const RX0 = -91.5, RX1 = 84.5, RY0 = YS - 2.5, RY1 = YN + 2.5
const Z_EDGE = 25, CROWN = 40, DEPTH = 2.2, LEAN = 6.5
/** The end walls, set in under the roof. */
const YSW = YS + 0.5, YNW = YN - 0.5

function buildT5(detail: boolean) {
  const M: Mats = newMats(['roof', 'win', 'trim', 'wall', 'bridge', 'glass'])
  const { spurs } = despur(T5_OUTLINE)

  // --- the roof ---
  const { zBot, xs } = arcRoof(M.roof, M.roof, {
    x0: RX0, x1: RX1, y0: RY0, y1: RY1, zEdge: Z_EDGE, rise: CROWN - Z_EDGE, pow: 1, depth: DEPTH, n: detail ? 40 : 22,
    // the section joints: 22 sections, a pale rib at each joint
    ribs: { every: (RY1 - RY0) / (detail ? 22 : 11), part: M.trim, w: detail ? 0.6 : 0.9, h: 0.25 },
  })

  // --- the long glass walls, leaning out 6.5°, up to the soffit ---
  const r = (LEAN * Math.PI) / 180
  const reach = (x: number, out: number) => { // height up the wall where it meets the soffit
    let t = 10
    for (let k = 0; k < 30; k++) { const xt = x + out * t * Math.sin(r); t = (zBot(xt) - 0.2) / Math.cos(r) }
    return t
  }
  const legs: number[] = Array.from({ length: 22 }, (_, k) => YS + 8.9 + k * ((YN - YS - 17.8) / 21))
  for (const [a, b, out] of [[[XW, YN], [XW, YS], -1], [[XE, YS], [XE, YN], 1]] as [XY, XY, number][]) {
    const h = reach(a[0], out)
    const { W, L } = leanWall(M.win, a, b, h, LEAN)
    const s0 = (y: number) => Math.abs(y - a[1])
    // vertical mullions every bay and a half, horizontal transoms at the floors
    const step = detail ? 6 : 9
    for (let s = step; s < L - 1; s += step) band(M.trim, W, [s, 0.2], [s, h - 0.2], detail ? 0.35 : 0.5)
    for (const t of detail ? [5.5, 10.5, 15.5] : [7, 14]) band(M.trim, W, [0.4, t], [L - 0.4, t], detail ? 0.35 : 0.55)
    // the raking legs behind the glass: a V pair at each abutment
    for (const y of legs) {
      const s = s0(y)
      band(M.trim, W, [s, 0.3], [s - 4.2, h - 0.4], detail ? 1.0 : 1.4, 0.09)
      band(M.trim, W, [s, 0.3], [s + 4.2, h - 0.4], detail ? 1.0 : 1.4, 0.09)
    }
    // the wall's bottom edge and sides: a pale sill
    band(M.trim, W, [0, 0.5], [L, 0.5], 0.8)
  }

  // --- the arch-topped end walls under the roof's ends ---
  for (const [y, sgn] of [[YSW, -1], [YNW, 1]] as [number, number][]) {
    const nE: V3 = [0, sgn, 0]
    // the wall's foot runs between the long walls' feet; its top follows the soffit out to the leaning walls
    const xa = XW, xb = XE
    const pts = [xa, ...xs.filter((x) => x > xa + 0.5 && x < xb - 0.5), xb]
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1]
      quadN(M.win, [p, y, 0], [q, y, 0], [q, y, zBot(q) - 0.2], [p, y, zBot(p) - 0.2], [nE, nE, nE, nE])
    }
    // the leaning long walls leave a triangle at each end: close it
    for (const [x, out] of [[XW, -1], [XE, 1]] as [number, number][]) {
      const h = reach(x, out), xt = x + out * h * Math.sin(r), zt = h * Math.cos(r)
      M.win.tri([x, y, 0], [xt, y, zt], [x, y, zt], undefined, undefined, undefined, [nE, nE, nE])
    }
    // mullions: bold verticals every 12.6 m (the end wall's big bays), transoms at the floors
    const W: WallPlane = { o: [0, y, 0], u: [sgn < 0 ? 1 : -1, 0, 0], v: [0, 0, 1], n: nE }
    const sOf = (x: number) => (sgn < 0 ? x : -x)
    const bays = 16
    for (let k = 1; k < bays; k++) {
      const x = xa + ((xb - xa) * k) / bays
      band(M.trim, W, [sOf(x), 0.3], [sOf(x), zBot(x) - 0.4], detail ? 0.5 : 0.7)
      if (detail) { const x2 = x - (xb - xa) / bays / 2; band(M.trim, W, [sOf(x2), 0.3], [sOf(x2), zBot(x2) - 0.4], 0.25) }
    }
    for (const t of detail ? [5, 10, 15, 20, 25, 30] : [8, 16, 24]) {
      // a transom only where the wall is that tall
      const inside = xs.filter((x) => x > xa && x < xb && zBot(x) - 0.6 > t)
      if (inside.length < 2) continue
      band(M.trim, W, [sOf(inside[0]), t], [sOf(inside[inside.length - 1]), t], detail ? 0.35 : 0.5)
    }
    band(M.trim, W, [sOf(xa), 0.4], [sOf(xb), 0.4], 0.8)
  }

  // --- the soffit closes the space between the walls' tops and the roof: the roof's own underside does that ---

  // --- the airside strip: a low white apron-level block along the east wall, with the jet bridges' service cores ---
  const SX0 = XE + 0.1, SX1 = XE + 7, SZ = 8
  prismRing(M.wall, [[SX0, YS + 6], [SX1, YS + 6], [SX1, YN - 6], [SX0, YN - 6]], 0, SZ, M.wall)
  // a glazed band along it (the gate lounges at apron level)
  {
    const W: WallPlane = { o: [SX1, YS + 6, 0], u: [0, 1, 0], v: [0, 0, 1], n: [1, 0, 0] }
    const L = YN - YS - 12
    band(M.win, W, [1, 4.6], [L - 1, 4.6], 2.6, 0.05)
  }
  // service cores where the bridges leave: white boxes a little taller than the strip
  const roots = spurs.map((s) => { const a = s[0], b = s[s.length - 1]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as XY })
  for (const [x, y] of roots) {
    if (x < XE - 1) continue
    prismRing(M.wall, [[SX1 - 0.5, y - 4], [SX1 + 5, y - 4], [SX1 + 5, y + 4], [SX1 - 0.5, y + 4]], 0, 12, M.wall)
  }

  // --- rooftop smoke vents: three staggered columns of glazed boxes (Nugent's and Richardson's aerials) ---
  for (const [x, off] of [[-43, 0], [-3, 0.5], [37, 0]] as [number, number][]) {
    for (let k = 0; k < 11; k++) {
      const y = RY0 + 10 + (RY1 - RY0 - 20) * ((k + off) / 10.5)
      const zt = zBot(x) + DEPTH
      const w = 7, d = 5
      prismRing(M.wall, [[x - w / 2, y - d / 2], [x + w / 2, y - d / 2], [x + w / 2, y + d / 2], [x - w / 2, y + d / 2]], zt - 0.6, zt + 1.6, M.glass)
    }
  }

  // --- jet bridges: the fixed links OSM draws ---
  jetBridges({ ...M, win: M.win, roof: M.wall }, spurs, { z0: 4.6, z1: 8.0, detail })

  return [
    { part: M.roof, material: LHR.roof },
    { part: M.win, material: LHR.window },
    { part: M.trim, material: LHR.white },
    { part: M.wall, material: LHR.panel },
    { part: M.bridge, material: LHR.bridge },
    { part: M.glass, material: PALETTE.glass },
  ]
}

if (import.meta.main) {
  const extras = { bearing: -0.35, osm: 'way/23231957', height: CROWN + 2.6 }
  writeLod('Heathrow Terminal 5', 'london-heathrow-terminal-5.glb', buildT5(false), extras, 8000, 250_000)
  writeLod('Heathrow Terminal 5', 'london-heathrow-terminal-5.detail.glb', buildT5(true), extras, 40_000, 1_500_000)
}

export { simplify }
