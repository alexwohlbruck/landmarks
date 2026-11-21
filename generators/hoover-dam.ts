/**
 * Hoover Dam, Black Canyon of the Colorado River, on the Nevada–Arizona line.
 *
 * The concrete arch-gravity dam with its curved downstream face, the crest
 * road with its parapet pilasters and the four Art Deco elevator pylons, the
 * four intake towers on the Lake Mead side with their bridges, and the
 * U-shaped powerhouse at the toe: the base across the river and the Nevada
 * and Arizona wings. The Mike O'Callaghan–Pat Tillman bridge downstream, the
 * visitor centre, the spillways and the transmission towers are not part of it.
 *
 * Frame: origin at the centre of the crest arc (-114.738427, 36.015320), the
 * dam's axis turned to bearing 49.5°, so the model's north is upstream (Lake
 * Mead) and +x is the Arizona side. y = 0 is the river below the dam, 196.46 m,
 * the lowest ground under the model.
 *
 * Standing in a canyon. The map's terrain (Mapterhorn, from USGS 3DEP lidar)
 * keeps the dam's face, its crest and the base of the powerhouse as ground,
 * and the canyon walls rise in front of the face's ends. So the model is built
 * on that terrain, as a bridge's terrain-footed walls are (docs/reference.md,
 * Bridges): every foot stands on the DEM in `hoover-dam-terrain.ts`, 0.2 m
 * under it. The map then finds the model following its terrain, rather than
 * flat, and stands it where it was built instead of lifting it by the mean
 * height of the canyon. The downstream face is one continuous wall from
 * abutment to abutment: each ring of it spans the line where the DEM's canyon
 * wall rises 4 m above the profile (smoothed; above r 120, where the 4 m DEM
 * smears the near-vertical top, run straight to the crest's measured ends),
 * carried 1.5° on into the rock and ended 0.2 m under it, so the canyon wall
 * clips the face along a clean line. Inside that, the face follows the
 * profile, or stands 1.5 m proud of the DEM's own copy of it where that is
 * higher, so the terrain never shows through it.
 *
 * The placement's `elevation` is 0.1 m, which makes it rigid. The map's drape
 * reads the ground on a 7 × 7 grid, about 50 × 70 m here, and lets every
 * vertex near the model's own ground follow the fill under it: on a face that
 * is itself the DEM, that pulled the face's flanks down by up to 23 m
 * (tools/terrain.ts, scratch checks). Rigid, the model stays where it was
 * built on the terrain: every foot within -0.7..+0.5 m of the drawn ground,
 * and nothing visible buried (checked over the whole upward area, not only
 * the lowest 25 m `terrain.ts check` covers). With the terrain off, the
 * face and towers are shells hanging over the flat map, as a canyon bridge's
 * approaches are.
 *
 * Sources
 * - OSM: way/49938932 (the dam, height 221.4), the intake towers
 *   way/242824653, 120468644, 120468643, 120468642 (14–15 m outlines: the top
 *   houses), the crest pylons way/328945751, 328945759, 328945750, 328945758
 *   (7.4 × 6.8 m each), the powerhouse way/743151512 with its parts
 *   way/743741968 (Nevada) and 743741969 (Arizona).
 * - USGS 3DEP lidar AZ_LowerColoradoRiver_B1_2018 (tools/lidar.py, 1 m), heights
 *   NAVD88: crest road 376.4–376.6 m; upstream face an arc of radius 152.1 m
 *   about the origin (OSM nodes fit to 0.7 m), crest top from r = 137 to 154.5 m;
 *   downstream face profile (below); pylons at 386.3–387.5 m on bearings
 *   -49.5°, -22°, +13.5°, +41° from the axis, r 133–139.5; tower decks 376.6 m,
 *   21 m across, top houses 15 m across with roofs at 389.5 m and lanterns to
 *   393 m; powerhouse base roof 237 m, wing roofs 230.5 m, the river-side bays
 *   239–240 m, the tailrace decks 206–207 m, the river 196.5 m, Lake Mead
 *   329.6 m in 2018.
 * - Mapterhorn z15 (the map's own terrain, from the same 3DEP): the river at
 *   196.46 m = y 0; every foot. See hoover-dam-terrain.ts.
 * - USGS NAIP (public domain): the plan, roof colours.
 * - Published (USBR, Wikipedia "Hoover Dam"): 221.4 m (726.4 ft) from
 *   bedrock, crest 379 m (1,244 ft) long and 13.7 m (45 ft) thick, base 200 m
 *   (660 ft) thick, crest elevation 1,232 ft; intake towers 120 m (395 ft)
 *   from their footings; powerhouse wings 198 m (650 ft) long.
 * - Photos (Wikimedia Commons), each checked against a render from its side:
 *   "Hoover Dam from Memorial Bridge.jpg", Noah Wulf, CC BY-SA 4.0 (downstream);
 *   "2017 Aerial view Hoover Dam 4774.jpg", Mariordo, CC BY-SA 4.0 (from the
 *   south-west, above); "Hoover Dam 2015.jpg", Kate Headley, public domain
 *   (from the Nevada side); "Hoover Dam, Nevada (Arizona-Nevada, USA) -- 2012
 *   -- 6125.jpg" and "-- 6099.jpg", Dietmar Rabich, CC BY-SA 4.0 (towers,
 *   crest); "Water intake towers and Hoover Dam.jpg" and "Water intake tower
 *   Hoover Dam.jpg", APK, CC BY-SA 4.0 (towers); "Hoover Dam at Night
 *   (3437289262).jpg", Ken Lund, CC BY-SA 2.0, and "Hoover Dam At Night.jpg",
 *   Macheath48, CC BY-SA 4.0 (night).
 *
 * Measured: everything above marked lidar or Mapterhorn. Published: the crest
 * thickness, checked against lidar. Estimated: the pilasters' size and spacing
 * (photos, about 3° = 7 m apart), the pylons' extent down the face (photos,
 * about 25 m), the towers' 12 sides and fins (photos), the trash racks' extent
 * (to 4 m under the tower decks), the powerhouse bays' count and size (photos,
 * lidar shows their height), the window panels, the tailrace decks' plan, the
 * transformer yards on the wing roofs (photo: Wulf, and NAIP: a dark band
 * about 14 m wide along each wing's river edge, two transformers a bay). The
 * base roof is drawn at 238.3 m, 1.3 m over the lidar, to clear the DEM's
 * copy of it. The face below the lake line
 * and the dam's buried heel are not drawn: the lake hides them.
 */
import { Part, cross, sub, type MaterialSpec, type V3, writeGlb } from './mesh'
import { PALETTE, finish } from './palette'
import { bead, footedLoft } from './bridge-kit'
import { TERRAIN } from './hoover-dam-terrain'

// ---- terrain ---------------------------------------------------------------

const ROWS = TERRAIN.rows.map(r => r.split(' ').map(v => Number(v) / 10))
/** The map's ground (Mapterhorn), metres above the river, at plan point x east, y north. */
function dem(x: number, y: number): number {
  const fx = Math.min(Math.max((x - TERRAIN.x0) / TERRAIN.step, 0), ROWS[0].length - 1.0001)
  const fz = Math.min(Math.max((-y - TERRAIN.z0) / TERRAIN.step, 0), ROWS.length - 1.0001)
  const c = Math.floor(fx), r = Math.floor(fz), tx = fx - c, tz = fz - r
  const at = (rr: number, cc: number) => ROWS[rr][cc]
  return (at(r, c) * (1 - tx) + at(r, c + 1) * tx) * (1 - tz) + (at(r + 1, c) * (1 - tx) + at(r + 1, c + 1) * tx) * tz
}
/** How far the model's feet stand under the map's ground. */
const FOOT = 0.2
/** How far the face stands proud of the terrain's own copy of it, so the terrain never shows through. */
const FACE_LIFT = 1.5
const ground = (x: number, y: number) => Math.max(0, dem(x, y) - FOOT)

/** Lake Mead in the DEM (lidar 2018), and the lake side's feet just under it. */
const LAKE = 133.1
const LAKE_FOOT = LAKE - 0.5

// ---- the dam's plan ----------------------------------------------------------

const DEG = Math.PI / 180
/** A plan point at radius r from the arc centre, θ degrees from the axis toward Arizona. */
const polar = (r: number, th: number): [number, number] => [r * Math.sin(th * DEG), r * Math.cos(th * DEG)]

/** Upstream face and crest edges, radius from the arc centre (lidar). */
const R_UP = 154.5
const R_DOWN = 137
/** The crest's top: the walks and parapets, and the road between them (lidar 376.5 m). */
const CREST = 180.1
const PARAPET = 181.3
/** Where the crest meets the canyon walls (lidar: lake against rock past these). */
const TH_NV = -66, TH_AZ = 69

/**
 * The downstream face's profile, height against radius, read from the lidar
 * along the axis and averaged over ±30°: a slope of about 1.3 in 1 from the
 * toe, steepening into a near-vertical top under the crest.
 */
const PROFILE: [number, number][] = [
  [48, 41], [56, 47], [64, 57], [72, 67.5], [80, 78], [88, 89], [96, 99], [104, 109], [112, 120],
  [120, 131], [126, 141], [130, 149], [133, 157], [135, 165], [136.5, 172], [137, CREST],
]
function profile(r: number): number {
  if (r <= PROFILE[0][0]) return PROFILE[0][1]
  for (let i = 1; i < PROFILE.length; i++) {
    const [r0, y0] = PROFILE[i - 1], [r1, y1] = PROFILE[i]
    if (r <= r1) return y0 + ((y1 - y0) * (r - r0)) / (r1 - r0)
  }
  return CREST
}

// ---- materials ----------------------------------------------------------------

/** Floodlit at night: the face and crest brightest, the towers' top houses, less on the powerhouse. */
function flood(p: V3, n: V3): number {
  const [x, y, z] = p
  const r = Math.hypot(x, y)
  if (r > R_UP + 2) return z > 176 ? 0.9 : 0.35 // intake towers: the top houses lit
  if (y < 30 && z < 45) return 0.35 // powerhouse
  return n[2] > 0.8 ? 0.45 : 0.9 // the face, the crest and its pylons
}
const CONCRETE: MaterialSpec = { ...finish('hoover-concrete', 0xe9dfcd), floodlight: flood }
const ROOFDECK: MaterialSpec = { ...finish('hoover-roof-deck', 0xe4e0d8), floodlight: (p) => (p[2] < 45 ? 0.3 : 0) }
const ROAD: MaterialSpec = { ...PALETTE.roof, color: 0x8f969c }
const RACK: MaterialSpec = PALETTE.metal
const WINDOW: MaterialSpec = PALETTE.window
const LAMP: MaterialSpec = { ...finish('lamp', 0x8a8478) }
/** The transformer yards on the powerhouse roofs: grey steel and oil tanks. */
const GEAR: MaterialSpec = { ...finish('hoover-transformers', 0x6f706c) }

const conc = new Part(), deck = new Part(), gear = new Part(), road = new Part(), rack = new Part(), win = new Part(), lamp = new Part()

// ---- helpers ------------------------------------------------------------------

type P2 = [number, number]
const area = (pts: P2[]) => pts.reduce((s, [x, y], i) => { const [u, v] = pts[(i + 1) % pts.length]; return s + x * v - u * y }, 0) / 2
const ccw = (pts: P2[]) => (area(pts) < 0 ? [...pts].reverse() : pts)

/** A flat-sided prism over a convex plan, z0 to z1, with its top (and bottom) capped. */
function prism(p: Part, plan: P2[], z0: number, z1: number, bottom = false) {
  const pts = ccw(plan)
  const lo = pts.map(([x, y]): V3 => [x, y, z0]), hi = pts.map(([x, y]): V3 => [x, y, z1])
  p.loft([lo, hi])
  p.cap(hi, true)
  if (bottom) p.cap(lo, false)
}

/**
 * The seen sides of a small block set against a wall: every side but the one
 * facing `back` (a plan direction), from a foot at `z0(x, y)` to z1, and its
 * top if `top`. The block's back and its top under a deck are never seen.
 */
function block(p: Part, plan: P2[], z0: (x: number, y: number) => number, z1: number, back: P2, top = true) {
  const pts = ccw(plan)
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const nx = b[1] - a[1], ny = a[0] - b[0]
    if ((nx * back[0] + ny * back[1]) / Math.hypot(nx, ny) / Math.hypot(...back) > 0.7) continue
    p.quad([a[0], a[1], z0(...a)], [b[0], b[1], z0(...b)], [b[0], b[1], z1], [a[0], a[1], z1])
  }
  if (top) p.cap(pts.map(([x, y]): V3 => [x, y, z1]), true)
}

/** A box `w` wide (across θ) by `d` deep (along r) centred at radius r, θ degrees. */
function radialBox(r: number, th: number, w: number, d: number): P2[] {
  const t: P2 = [Math.cos(th * DEG), -Math.sin(th * DEG)], u: P2 = [Math.sin(th * DEG), Math.cos(th * DEG)]
  const [cx, cy] = polar(r, th)
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [cx + (a * w * t[0]) / 2 + (b * d * u[0]) / 2, cy + (a * w * t[1]) / 2 + (b * d * u[1]) / 2] as P2)
}

/** A regular n-gon of circumradius r about (cx, cy), a flat side facing `rot` degrees. */
const ngon = (cx: number, cy: number, r: number, n: number, rot = 0): P2[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos((rot + (360 * (i + 0.5)) / n) * DEG), cy + r * Math.sin((rot + (360 * (i + 0.5)) / n) * DEG)] as P2)

// ---- the downstream face --------------------------------------------------------

/**
 * Where a ring of the face meets the canyon wall on each side: the first
 * angle out from the axis where the ground stands clearly above the face.
 * The DEM's rock is noisy at 4 m, so the lines are smoothed down the face.
 */
function abutments(rings: number[]): [number, number][] {
  const scan = (r: number): [number, number] => {
    const f = profile(r)
    const edge = (dir: number, limit: number) => {
      for (let t = 0; Math.abs(t) <= Math.abs(limit); t += dir * 0.5) {
        const [x, y] = polar(r, t)
        if (dem(x, y) > f + ROCK) return t
      }
      return limit
    }
    return [edge(-1, TH_NV), edge(1, TH_AZ)]
  }
  // Above r 120 the 4 m DEM smears the near-vertical top into a slope, so
  // the line runs straight from there to the crest's measured ends.
  const low = scan(TOP_SCAN)
  const raw = rings.map((r): [number, number] => {
    if (r <= TOP_SCAN) return scan(r)
    const t = (r - TOP_SCAN) / (R_DOWN - TOP_SCAN)
    return [low[0] + (TH_NV - low[0]) * t, low[1] + (TH_AZ - low[1]) * t]
  })
  // Widening upward: a ring never reaches past the one above it.
  for (let i = raw.length - 2; i >= 0; i--) {
    raw[i][0] = Math.max(raw[i][0], raw[i + 1][0])
    raw[i][1] = Math.min(raw[i][1], raw[i + 1][1])
  }
  return raw.map((_, i) => {
    const near = [raw[i - 1] ?? raw[i], raw[i], raw[i + 1] ?? raw[i]]
    return [0, 1].map(k => (near[0][k] + 2 * near[1][k] + near[2][k]) / 4) as [number, number]
  })
}
/** The highest ring whose abutments are read from the DEM. */
const TOP_SCAN = 120
/** How far above the face the ground must stand to count as the canyon wall. */
const ROCK = 4
/** How far past the abutment line the face runs into the rock, in degrees. */
const KEY = 1.5

/**
 * One continuous wall from abutment to abutment, ring by ring from the toe
 * to the crest. Each ring spans its own abutments (above), run KEY degrees
 * into the rock and ended just under the ground there, so the canyon wall
 * clips the face along a clean line. Inside, the face follows the profile,
 * or stands FACE_LIFT proud of the DEM where the DEM's own copy of the face
 * is higher, so the terrain never shows through it.
 */
function downstreamFace() {
  const rings = [52, 58, 64, 72, 80, 88, 96, 104, 112, 120, 126, 130, 133, 135, 136.5, 137]
  const edges = abutments(rings)
  const COLS = 36
  type Vx = { p: V3; n: V3 }
  const grid: Vx[][] = rings.map((r, i) => {
    const [a, b] = [edges[i][0] - KEY, edges[i][1] + KEY]
    const f = profile(r)
    return Array.from({ length: COLS + 1 }, (_, j) => {
      const th = a + ((b - a) * j) / COLS
      const [x, y] = polar(r, th)
      const g = dem(x, y)
      const end = j === 0 || j === COLS
      const z = end ? Math.min(Math.max(f, g + FACE_LIFT), Math.max(g - FOOT, 0)) : Math.min(Math.max(f, g + FACE_LIFT), CREST)
      return { p: [x, y, z] as V3, n: [0, 0, 0] as V3 }
    })
  })
  const ths = grid[0]
  // Smooth normals from the grid's own triangles.
  const tris: [Vx, Vx, Vx][] = []
  for (let i = 0; i + 1 < rings.length; i++)
    for (let j = 0; j + 1 < ths.length; j++) {
      const a = grid[i][j], b = grid[i][j + 1], c = grid[i + 1][j + 1], d = grid[i + 1][j]
      // Facing downstream and up: toward the arc centre.
      tris.push([a, b, c], [a, c, d])
    }
  for (const t of tris) {
    const n = cross(sub(t[1].p, t[0].p), sub(t[2].p, t[0].p))
    for (const v of t) for (let k = 0; k < 3; k++) v.n[k] += n[k]
  }
  for (const t of tris) {
    const ns = t.map(v => { const l = Math.hypot(...v.n) || 1; return v.n.map(c => c / l) as V3 })
    conc.tri(t[0].p, t[1].p, t[2].p, undefined, undefined, undefined, ns)
  }
}

// ---- the crest -------------------------------------------------------------------

const crestTh: number[] = []
for (let t = TH_NV; t < TH_AZ; t += 3) crestTh.push(t)
crestTh.push(TH_AZ)

function crest() {
  const R_WALK_D = 139.6, R_WALK_U = 152.2
  for (let i = 0; i + 1 < crestTh.length; i++) {
    const a = crestTh[i], b = crestTh[i + 1]
    const at = (r: number, th: number, z: number): V3 => [...polar(r, th), z]
    // Road between the walks.
    road.quad(at(R_WALK_D, a, CREST), at(R_WALK_D, b, CREST), at(R_WALK_U, b, CREST), at(R_WALK_U, a, CREST))
    // Downstream walk and parapet as one raised band, its inner side down to the road.
    conc.quad(at(R_DOWN, a, PARAPET), at(R_DOWN, b, PARAPET), at(R_WALK_D, b, PARAPET), at(R_WALK_D, a, PARAPET))
    conc.quad(at(R_WALK_D, a, PARAPET), at(R_WALK_D, b, PARAPET), at(R_WALK_D, b, CREST), at(R_WALK_D, a, CREST))
    conc.quad(at(R_DOWN, b, PARAPET), at(R_DOWN, a, PARAPET), at(R_DOWN, a, CREST - 0.5), at(R_DOWN, b, CREST - 0.5))
    // Upstream walk and parapet, and the upstream face down to the lake or the canyon wall.
    conc.quad(at(R_WALK_U, a, PARAPET), at(R_WALK_U, b, PARAPET), at(R_UP, b, PARAPET), at(R_UP, a, PARAPET))
    conc.quad(at(R_WALK_U, b, PARAPET), at(R_WALK_U, a, PARAPET), at(R_WALK_U, a, CREST), at(R_WALK_U, b, CREST))
    // The face is battered 2 m out at the waterline, so its foot is read on the lake, not the crest.
    const foot = (th: number): V3 => {
      const [x, y] = polar(R_UP + 2, th)
      const g = dem(x, y)
      return [x, y, g > LAKE + 1 ? Math.min(g - FOOT, PARAPET) : LAKE_FOOT]
    }
    conc.quad(foot(a), foot(b), at(R_UP, b, PARAPET), at(R_UP, a, PARAPET))
  }
  // The crest's ends, closed down to the canyon wall.
  for (const [th, sign] of [[TH_NV, -1], [TH_AZ, 1]] as const) {
    const pts = [R_DOWN, R_UP].map(r => polar(r, th))
    const g = pts.map(([x, y]) => Math.min(ground(x, y), CREST - 0.5))
    const a: V3 = [...pts[0], g[0]], b: V3 = [...pts[1], g[1]], c: V3 = [...pts[1], PARAPET], d: V3 = [...pts[0], PARAPET]
    if (sign > 0) conc.quad(a, b, c, d)
    else conc.quad(b, a, d, c)
  }
}

/** Pilasters along the downstream parapet, about 7 m apart, running down the face's steep top. */
function pilasters() {
  for (let th = TH_NV + 4.5; th < TH_AZ - 3; th += 3) {
    if (PYLONS.some(p => Math.abs(p - th) < 3)) continue
    const plan = radialBox(R_DOWN - 0.4, th, 2.4, 2.4)
    block(conc, plan, ground, PARAPET + 0.25, polar(1, th))
  }
}

/** The four Art Deco elevator pylons standing above the crest (lidar, OSM). */
const PYLONS = [-49.5, -22, 13.5, 41]
function pylons() {
  for (const th of PYLONS) {
    const plan = ccw(radialBox(135.2, th, 7.4, 6.6))
    footedLoft(conc, ground, [{ plan, z: "ground" }, { plan, z: 187.6 }], 3)
    prism(conc, radialBox(135.2, th, 6.0, 5.2), 187.6, 190.3)
  }
}

// ---- intake towers ---------------------------------------------------------------

/** Tower centres (OSM outlines) in the model's plan. */
const TOWERS: P2[] = [[-101.9, 166.7], [-101.1, 221.2], [98.8, 162.3], [100.9, 217.6]]
const DECK = 180.1

function tower([cx, cy]: P2) {
  const SIDES = 12
  // Shaft: trash racks between concrete fins, from the lake to under the deck.
  prism(rack, ngon(cx, cy, 9.2, SIDES), LAKE_FOOT, DECK - 7)
  // The open gallery band and the deck over it.
  prism(conc, ngon(cx, cy, 9.6, SIDES), DECK - 7, DECK - 1.6)
  prism(conc, ngon(cx, cy, 10.6, SIDES), DECK - 1.6, DECK)
  // Fins at the corners, from the water to the deck.
  for (let i = 0; i < SIDES; i++) {
    const a = (360 * i) / SIDES
    const r = 9.6, w = 2.0, d = 1.4
    const ux = Math.cos(a * DEG), uy = Math.sin(a * DEG), tx = -uy, ty = ux
    const c: P2 = [cx + ux * r, cy + uy * r]
    const box: P2[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [c[0] + (s * d * ux) / 2 + (t * w * tx) / 2, c[1] + (s * d * uy) / 2 + (t * w * ty) / 2] as P2)
    block(conc, box, () => LAKE_FOOT, DECK - 1.6, [-ux, -uy], false)
  }
  // The top house: twelve sides, tall windows on alternate faces, a lantern on top.
  const TOP = 193
  const house = ngon(cx, cy, 7.5, SIDES)
  prism(conc, house, DECK, TOP)
  prism(conc, ngon(cx, cy, 7.8, SIDES), TOP - 1.0, TOP + 0.3)
  prism(conc, ngon(cx, cy, 1.4, 8), TOP + 0.3, TOP + 3.5)
  for (let i = 0; i < SIDES; i += 2) {
    const a = house[i], b = house[(i + 1) % SIDES]
    const m: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const out: P2 = [m[0] - cx, m[1] - cy], l = Math.hypot(...out)
    const o: P2 = [(out[0] / l) * 0.05, (out[1] / l) * 0.05]
    const half = 0.32
    const p0: P2 = [m[0] + (a[0] - m[0]) * half * 2 + o[0], m[1] + (a[1] - m[1]) * half * 2 + o[1]]
    const p1: P2 = [m[0] + (b[0] - m[0]) * half * 2 + o[0], m[1] + (b[1] - m[1]) * half * 2 + o[1]]
    win.quad([p1[0], p1[1], DECK + 2.6], [p0[0], p0[1], DECK + 2.6], [p0[0], p0[1], TOP - 2.4], [p1[0], p1[1], TOP - 2.4])
  }
}

/** A bridge beam `w` wide from plan point a to b, its deck level with the crest. */
function beam(a: P2, b: P2, w = 5.2) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
  const nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2)
  prism(conc, [[a[0] + nx, a[1] + ny], [a[0] - nx, a[1] - ny], [b[0] - nx, b[1] - ny], [b[0] + nx, b[1] + ny]], DECK - 2.8, DECK + 0.9, true)
}

function towers() {
  for (const t of TOWERS) tower(t)
  for (const [inner, outer] of [[TOWERS[0], TOWERS[1]], [TOWERS[2], TOWERS[3]]]) {
    // From the crest to the inner tower, along its bearing from the arc centre.
    const th = Math.atan2(inner[0], inner[1]) / DEG
    beam(polar(R_UP - 1, th), polar(Math.hypot(...inner) - 9.6, th))
    // Between the two towers.
    const dx = outer[0] - inner[0], dy = outer[1] - inner[1], l = Math.hypot(dx, dy)
    beam([inner[0] + (dx / l) * 9.6, inner[1] + (dy / l) * 9.6], [outer[0] - (dx / l) * 9.6, outer[1] - (dy / l) * 9.6], 4.2)
  }
}

// ---- the powerhouse ----------------------------------------------------------------

/** The base across the river at the dam's toe (lidar roof 237 m), and its two wings (230.5 m). */
const BASE_ROOF = 41.8, WING_ROOF = 34.1, BAY_TOP = 43, STEP_TOP = 20, TAILRACE = 11.6

function powerhouse() {
  // The base: the toe's arc to the downstream wall over the river.
  const arc: P2[] = []
  for (let th = 54; th >= -62; th -= 8) arc.push(polar(52, th))
  const base: P2[] = [[58, -1], ...arc, [-69, -1]]
  footedLoft(conc, ground, [{ plan: ccw(base), z: 'ground' }, { plan: ccw(base), z: BASE_ROOF }], 6, false)
  roofOver(base, BASE_ROOF)
  // Nevada wing (OSM way/743741968; lidar for the river edge) and its river-side step.
  wing([[-67, -1], [-36, -1], [-38, -176], [-71, -176], [-73, -130], [-73, -80], [-69, -40]], [[-36, -1], [-31, -1], [-33, -176], [-38, -176]], -1)
  // Arizona wing (OSM way/743741969).
  wing([[39, -1], [58, -1], [64, -40], [70, -60], [71, -110], [80, -128], [82, -166], [50, -166]], [[33, -1], [39, -1], [50, -166], [45, -166]], 1)
  // The tailrace decks along the river (DEM 9–11 m), their river walls down to the water.
  for (const plan of [[[-31, -1], [-15, -1], [-17, -176], [-33, -176]], [[25, -1], [33, -1], [45, -166], [31, -166]]] as P2[][])
    footedLoft(conc, ground, [{ plan: ccw(plan), z: 'ground' }, { plan: ccw(plan), z: TAILRACE }], 6, true)
  // The base's downstream wall over the river: six tall windows in its centre (photo: Wulf).
  for (let i = 0; i < 6; i++) {
    const x0 = -9 + i * 4.2, w = 1.8, y = -1.06
    win.quad([x0, y, 21], [x0 + w, y, 21], [x0 + w, y, 37], [x0, y, 37])
  }
}

function roofOver(plan: P2[], z: number) {
  const pts = ccw(plan).map(([x, y]): V3 => [x, y, z + 0.02])
  const c: V3 = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length, z + 0.02]
  for (let i = 0; i < pts.length; i++) deck.tri(c, pts[i], pts[(i + 1) % pts.length])
}

function wing(main: P2[], step: P2[], side: number) {
  footedLoft(conc, ground, [{ plan: ccw(main), z: 'ground' }, { plan: ccw(main), z: WING_ROOF }], 6, false)
  roofOver(main, WING_ROOF)
  footedLoft(conc, ground, [{ plan: ccw(step), z: 'ground' }, { plan: ccw(step), z: STEP_TOP }], 6, true)
  // The generator bays along the river side (Nevada N1–N8, Arizona A1–A9).
  const [a, b] = [step[0], step[3]]
  const n = side < 0 ? 8 : 9
  for (let i = 0; i < n; i++) {
    const t0 = (i + 0.2) / n, t1 = (i + 0.8) / n
    const at = (t: number, dx: number): P2 => [a[0] + (b[0] - a[0]) * t + dx, a[1] + (b[1] - a[1]) * t]
    const inner = side < 0 ? -9 : 9
    const box: P2[] = [at(t0, 0), at(t1, 0), at(t1, inner), at(t0, inner)]
    footedLoft(conc, ground, [{ plan: ccw(box), z: 'ground' }, { plan: ccw(box), z: BAY_TOP }], 6, true)
  }
  // The transformer yard on the roof, along its river edge (photo: Wulf;
  // NAIP): a dark deck 14 m wide and a row of transformers, two per bay.
  const [e0, e1] = side < 0 ? [step[0], step[3]] : [step[1], step[2]]
  const along = (t: number, dx: number): P2 => [e0[0] + (e1[0] - e0[0]) * t - side * dx, e0[1] + (e1[1] - e0[1]) * t]
  const t0 = 0.04, t1 = 0.96
  const yard = [along(t0, 2), along(t1, 2), along(t1, 16), along(t0, 16)]
  const z = WING_ROOF + 0.06
  gear.cap(ccw(yard).map(([x, y]): V3 => [x, y, z]), true)
  for (let i = 0; i < n * 2; i++) {
    const t = t0 + ((t1 - t0) * (i + 0.5)) / (n * 2)
    const box = [along(t - 0.014, 5), along(t + 0.014, 5), along(t + 0.014, 12), along(t - 0.014, 12)]
    block(gear, box, () => z, z + 3.2, [0, 0])
  }
}

// ---- lamps ---------------------------------------------------------------------------

function lamps() {
  for (let th = TH_NV + 3; th < TH_AZ; th += 6) {
    bead(lamp, [...polar(R_UP - 1.2, th), PARAPET + 2.6], 0.5, true)
    bead(lamp, [...polar(R_DOWN + 1.2, th + 3), PARAPET + 2.6], 0.5, true)
  }
}

// ---- build ---------------------------------------------------------------------------

downstreamFace()
crest()
pilasters()
pylons()
towers()
powerhouse()
lamps()

const parts = [
  { part: conc, material: CONCRETE },
  { part: deck, material: ROOFDECK },
  { part: gear, material: GEAR },
  { part: road, material: ROAD },
  { part: rack, material: RACK },
  { part: win, material: WINDOW },
  { part: lamp, material: LAMP },
].filter(({ part }) => part.triangles)

console.log(parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(", "))
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 8000) throw new Error(`hoover-dam: ${triangles} triangles`)
const glb = writeGlb('Hoover Dam', parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
if (glb.length > 250 * 1024) throw new Error(`hoover-dam: ${glb.length} bytes`)
await Bun.write(new URL('../models/hoover-dam.glb', import.meta.url).pathname, glb)
console.log(`models/hoover-dam.glb: ${triangles} triangles, ${(glb.length / 1024).toFixed(1)} KiB`)
