/**
 * Belvedere Castle, Vista Rock, Central Park (Calvert Vaux and Jacob Wrey
 * Mould, 1867–69; restored 1983 and 2019) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-belvedere-castle.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Placed at
 * bearing 30°, the castle's walls (the long faces of OSM way/278363023 run at
 * 120°), so model +y is NNE, toward Turtle Pond, and +x is ESE. Anchor: the
 * centroid of the OSM outline way/278363023 (building=public,
 * historic=castle), which this model replaces with its building:parts
 * way/1317000456 (the square tower), way/1317000457 (the lower block),
 * way/1317000458 (the round turret) and way/1317000451 (the lookout on the
 * tower roof). The terrace, its walls and the two timber pavilions
 * (building=roof way/1317000449, 1317000448, 1317000450) are left to the map.
 *
 * Plan (OSM parts, model frame): lower block x −7.8..0.85, y −0.8..4.6;
 * tower x 0.8..6.0, y −5.2..1.7; turret centred (6.45, −4.15); lookout
 * x 0.9..2.9, y −0.7..1.7 on the tower's north-west corner.
 *
 * Heights. y = 0 is the rock at the foot of the pond-side (NNE) wall, about
 * 38.0 m NAVD88; the terrace on Vista Rock is 42.55 m (+4.55). The walls run
 * down to y = 0 on every side and sink into the rock on the terrace side.
 * - Lidar, USGS 3DEP NY_NewYorkCity (2017), 0.5 m grid, read in this frame:
 *   terrace 42.55 m; lower block roof 46.15, parapet 46.95 (+8.95); tower
 *   roof 50.25, parapet 51.15 (+13.15); lookout roof 53.45 (+15.45); turret
 *   top 58.25 (+20.25, sparse, taken as the finial); rock at the pond-side
 *   foot 36.5–38 m and under the tower's NNE face 38.5–39 m.
 * - Estimated from the photos against those heights: the turret's shaft
 *   (2.3 m across, ~2.5 m clear of the tower parapet), its corbelled top
 *   stage and bell roof (eave +16.3, apex +19.7), window sizes and heights,
 *   the corner bartizans, the bands at terrace and deck level.
 * - Published (Central Park Conservancy; Wikipedia "Belvedere Castle"):
 *   Manhattan schist walls with granite trim, built as a lookout folly on
 *   Vista Rock, the second-highest point in the park; slate roofs; houses a
 *   weather station since 1919.
 *
 * Photos (Wikimedia Commons; local copies and credits in
 * landmarks-scratch/nyc-parks/work/nyc-belvedere-castle/photos):
 * - Christian David, "Belvedere Castle and Turtle Pond…", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Belvedere_Castle_and_Turtle_Pond,_Central_Park,_Manhattan,_New_York.jpg
 *   (from the pond, NNE: turret, tower, lookout, lower block, terrace walls)
 * - Stig Nygaard, "Belvedere Castle, Central Park.jpg", CC BY 2.0,
 *   https://commons.wikimedia.org/wiki/File:Belvedere_Castle,_Central_Park.jpg
 *   (from the pond, closer: window rhythm of the NNE faces)
 * - Plantsmushrooms, "Belvedere Castle in Summer.jpg", CC0,
 *   https://commons.wikimedia.org/wiki/File:Belvedere_Castle_in_Summer.jpg
 *   (the terrace face: two arched windows between corner bartizans)
 * - Epicgenius, "Central Park Apr 2026 23.jpg", CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:Central_Park_Apr_2026_23.jpg
 *   (from the terrace, WSW: the arcaded west face, lookout, turret dormer)
 *
 * Doubts: the tower's ESE face and the turret's foot (toward the 79th Street
 * Transverse) are seen in no photo and are drawn plain. The flagpole, the
 * parapet's small arched openings, the window tracery, the cresting on the
 * turret and the dragon reliefs are left out. On the map the castle is
 * draped over the rock: its base follows the terrain and its upper parts
 * are lifted by the mean rise under the plan, so it may draw a little high.
 */
import { Part, type V3 } from './mesh'
import { finishModel, prism, insetRing, capPoly, area, type XY } from './nyc-570-lexington'
import { lathe, smooth, block } from './nyc-columbus-monument'

const schist = new Part(), granite = new Part(), slate = new Part(), win = new Part(), wood = new Part(), door = new Part()

const T = 4.55 // terrace
const LB = { deck: 8.15, top: 8.95 }
const TW = { deck: 12.25, top: 13.15 }

/** A flat convex polygon facing `n`, fanned from its first point. */
function flat(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) p.tri(pts[0], pts[i], pts[i + 1], undefined, undefined, undefined, [n, n, n])
}
/** A round-headed panel on a wall: centre (cx, cy) on the wall line, outward normal (nx, ny). */
function arch(p: Part, cx: number, cy: number, nx: number, ny: number, w: number, z0: number, z1: number, off = 0.06) {
  const tx = -ny, ty = nx, r = w / 2, zs = z1 - r
  const at = (u: number, z: number): V3 => [cx + tx * u + nx * off, cy + ty * u + ny * off, z]
  const pts: V3[] = [at(0, (z0 + zs) / 2), at(-r, z0), at(r, z0)]
  for (let i = 0; i <= 8; i++) { const a = (i * Math.PI) / 8; pts.push(at(r * Math.cos(a), zs + r * Math.sin(a))) }
  pts.push(at(-r, z0))
  flat(p, pts, [nx, ny, 0])
}
/** A window with a granite surround. */
function windowAt(cx: number, cy: number, nx: number, ny: number, w: number, z0: number, z1: number, part = win) {
  arch(granite, cx, cy, nx, ny, w + 0.36, z0 - 0.12, z1 + 0.18, 0.03)
  arch(part, cx, cy, nx, ny, w, z0, z1, 0.06)
}
/** A pair of narrow round-headed lights. */
function pairAt(cx: number, cy: number, nx: number, ny: number, z0: number, z1: number) {
  const tx = -ny, ty = nx
  arch(granite, cx, cy, nx, ny, 1.65, z0 - 0.12, z1 + 0.2, 0.03)
  for (const s of [-0.38, 0.38]) arch(win, cx + tx * s, cy + ty * s, nx, ny, 0.55, z0, z1, 0.06)
}
/** A projecting band round a counter-clockwise ring. */
function band(p: Part, ring: XY[], z0: number, z1: number, out: number) {
  const o = insetRing(ring, -out)
  for (let i = 0; i < o.length; i++) {
    const j = (i + 1) % o.length
    const a = o[i], b = o[j], ia = ring[i], ib = ring[j]
    p.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
    p.quad([a[0], a[1], z1], [b[0], b[1], z1], [ib[0], ib[1], z1], [ia[0], ia[1], z1])
    p.quad([ia[0], ia[1], z0], [ib[0], ib[1], z0], [b[0], b[1], z0], [a[0], a[1], z0])
  }
}
/** A stone mass with a parapet round a sunken roof deck. */
function keep(ring: XY[], deck: number, top: number) {
  const pts = prism({ wall: schist, win: null, roof: null, ring, z0: 0, z1: top, facade: null, bevel: 0.2 })!
  const ccw = area(pts) < 0 ? [...pts].reverse() : pts
  const inner = insetRing(ccw, 0.4)
  for (let i = 0; i < ccw.length; i++) {
    const j = (i + 1) % ccw.length
    const a = ccw[i], b = ccw[j], ia = inner[i], ib = inner[j]
    granite.quad([a[0], a[1], top], [b[0], b[1], top], [ib[0], ib[1], top], [ia[0], ia[1], top])
    schist.quad([ib[0], ib[1], deck], [ia[0], ia[1], deck], [ia[0], ia[1], top], [ib[0], ib[1], top])
  }
  capPoly(schist, inner, deck)
}
/** A hipped roof over x0..x1 × y0..y1 at the eave, ridge along the longer side; with a soffit. */
function hipRoof(p: Part, x0: number, y0: number, x1: number, y1: number, ze: number, zr: number) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, alongY = y1 - y0 >= x1 - x0
  const h = Math.min(x1 - x0, y1 - y0) / 2
  const r0: V3 = alongY ? [cx, y0 + h, zr] : [x0 + h, cy, zr], r1: V3 = alongY ? [cx, y1 - h, zr] : [x1 - h, cy, zr]
  const A: V3 = [x0, y0, ze], B: V3 = [x1, y0, ze], C: V3 = [x1, y1, ze], D: V3 = [x0, y1, ze]
  if (alongY) { p.quad(B, C, r1, r0); p.quad(D, A, r0, r1); p.tri(A, B, r0); p.tri(C, D, r1) }
  else { p.quad(A, B, r1, r0); p.quad(C, D, r0, r1); p.tri(B, C, r1); p.tri(D, A, r0) }
  p.quad(A, D, C, B)
}

// --- The lower block: a storey over the terrace, its parapet round a viewing deck. ---
const lower: XY[] = [[-7.8, -0.8], [0.85, -0.8], [0.85, 4.6], [-7.8, 4.6]]
keep(lower, LB.deck, LB.top)
band(granite, lower, T - 0.15, T + 0.15, 0.12)
band(granite, lower, LB.deck - 0.35, LB.deck - 0.05, 0.12)

// --- The square tower: two storeys over the terrace, its own parapet and deck. ---
const tower: XY[] = [[0.8, -5.2], [6.0, -5.2], [6.0, 1.7], [0.8, 1.7]]
keep(tower, TW.deck, TW.top)
band(granite, tower, T - 0.15, T + 0.15, 0.12)
band(granite, tower, TW.deck - 0.4, TW.deck - 0.05, 0.16)

// --- Corner bartizans: corbelled octagonal turrets of granite at the lower block's corners. ---
for (const [x, y] of [[-7.8, -0.8], [-7.8, 4.6], [0.85, 4.6], [0.85, -0.8]] as XY[]) {
  const dx = x < 0 ? -0.12 : 0.12, dy = y < 2 ? -0.12 : 0.12
  smooth(granite, q => lathe(q, [[0.12, T + 2.3], [0.35, T + 2.9], [0.58, T + 3.4], [0.58, LB.top + 0.35], [0.66, LB.top + 0.45], [0.66, LB.top + 0.6]], 8, x + dx, y + dy, true), 50)
}

// --- Windows. Lower block: three on the pond face, two broad ones on the
// terrace face, a three-arched loggia on the west face. ---
for (const x of [-5.75, -3.5, -1.25]) windowAt(x, 4.6, 0, 1, 1.05, T + 1.0, T + 3.1)
for (const x of [-5.0, -1.75]) windowAt(x, -0.8, 0, -1, 1.5, T + 0.45, T + 3.35)
for (const y of [0.25, 1.9, 3.55]) windowAt(-7.8, y, -1, 0, 1.05, T + 0.25, T + 3.2)
// Tower: two arched windows and a paired light above on the pond face, the
// door and a pair on the terrace face, a window and a pair on the others.
for (const x of [2.2, 4.5]) windowAt(x, 1.7, 0, 1, 0.9, T + 1.0, T + 3.1)
pairAt(3.4, 1.7, 0, 1, T + 5.4, T + 7.3)
windowAt(3.4, -5.2, 0, -1, 1.4, T, T + 2.9, door)
pairAt(3.4, -5.2, 0, -1, T + 5.4, T + 7.3)
windowAt(6.0, 0.0, 1, 0, 0.9, T + 1.0, T + 3.1)
pairAt(6.0, -0.4, 1, 0, T + 5.4, T + 7.3)
windowAt(0.8, -3.2, -1, 0, 0.9, T + 1.0, T + 3.1)
pairAt(0.8, -3.0, -1, 0, T + 5.4, T + 7.3)
// Below the terrace on the pond side, small arched openings in the base.
for (const x of [-3.5]) windowAt(x, 4.6, 0, 1, 0.8, 1.6, 3.1)

// --- The round turret at the tower's south-east corner: shaft, corbelled
// top stage, cornice, and a slate bell roof with a finial. ---
const TX = 6.45, TY = -4.15
smooth(schist, q => lathe(q, [[1.15, 0], [1.15, 15.3], [1.3, 15.65], [1.3, 16.15]], 12, TX, TY, false), 40)
smooth(granite, q => lathe(q, [[1.3, 16.15], [1.42, 16.2], [1.42, 16.35], [1.1, 16.35]], 12, TX, TY, false), 40)
smooth(slate, q => lathe(q, [[1.36, 16.35], [1.18, 16.8], [0.92, 17.5], [0.6, 18.3], [0.27, 19.2], [0.05, 19.7]], 12, TX, TY, true), 60)
smooth(granite, q => lathe(q, [[0.12, 19.6], [0.16, 19.9], [0.06, 20.4]], 6, TX, TY, true), 60)
// Turret windows: slits up the shaft and a ring in the top stage.
for (const a of [0.5, 1.2, -0.3]) {
  const nx = Math.cos(a), ny = Math.sin(a) * 1
  for (const [z0, z1] of [[T + 2.0, T + 3.4], [T + 5.6, T + 7.0], [T + 9.0, T + 10.3]] as [number, number][]) arch(win, TX + 1.15 * nx, TY + 1.15 * ny, nx, ny, 0.45, z0, z1, 0.05)
}
for (let k = 0; k < 6; k++) {
  const a = (k * Math.PI) / 3 + Math.PI / 6, nx = Math.cos(a), ny = Math.sin(a)
  arch(win, TX + 1.3 * nx, TY + 1.3 * ny, nx, ny, 0.42, 15.72, 16.08, 0.05)
}
// Two gabled dormers on the roof, toward the pond and the terrace.
for (const s of [1, -1]) {
  const cy = TY + s * 1.0
  block(slate, TX - 0.35, cy - 0.3, TX + 0.35, cy + 0.3, 16.5, 17.2, 0.05, 0.04)
  const f = cy + s * 0.32
  win.tri([TX - 0.25, f, 16.6], [TX + 0.25, f, 16.6], [TX, f, 17.1], undefined, undefined, undefined, [[0, s, 0], [0, s, 0], [0, s, 0]])
  slate.tri([TX - 0.42, f + s * 0.02, 17.15], [TX + 0.42, f + s * 0.02, 17.15], [TX, f + s * 0.02, 17.65], undefined, undefined, undefined, [[0, s, 0], [0, s, 0], [0, s, 0]])
  slate.quad([TX - 0.42, f, 17.15], [TX, f, 17.65], [TX, cy - s * 0.3, 17.65], [TX - 0.42, cy - s * 0.3, 17.15])
  slate.quad([TX + 0.42, f, 17.15], [TX + 0.42, cy - s * 0.3, 17.15], [TX, cy - s * 0.3, 17.65], [TX, f, 17.65])
}

// --- The timber lookout on the tower roof: four posts and a slate hipped roof. ---
for (const [x, y] of [[1.05, -0.55], [2.75, -0.55], [2.75, 1.45], [1.05, 1.45]] as XY[]) block(wood, x - 0.11, y - 0.11, x + 0.11, y + 0.11, TW.deck, 14.3, 0.03, 0.02)
block(wood, 0.8, -0.8, 3.0, 1.7, 14.05, 14.3, 0.04, 0.03)
hipRoof(slate, 0.65, -0.95, 3.15, 1.85, 14.3, 15.45)

const flood = (p: V3, n: V3) => (n[2] > 0.6 ? 0.15 : p[2] < 1 ? 0.3 : 0.85)
finishModel('Belvedere Castle', 'nyc-belvedere-castle', [
  { part: schist, material: { name: 'schist', color: 0x98958f, roughness: 0.9, floodlight: flood } },
  { part: granite, material: { name: 'granite', color: 0xcdc8bf, roughness: 0.85, floodlight: flood } },
  { part: slate, material: { name: 'slate', color: 0x646a73, roughness: 0.8 } },
  { part: win, material: { name: 'window', color: 0x64798a, roughness: 0.35 } },
  { part: wood, material: { name: 'wood', color: 0x9c6c56, roughness: 0.8 } },
  { part: door, material: { name: 'entrance', color: 0x6d7378, roughness: 0.85 } },
], { bearing: 30, osm: 'way/278363023', height: 20.4 }, 5000)
