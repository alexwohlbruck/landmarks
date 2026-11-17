/**
 * Modern Art Museum of Fort Worth, 3200 Darnell Street, 2002, Tadao Ando —
 * original procedural geometry, CC0-1.0.
 * bun generators/dal-modern-art-museum.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/141506526
 * ("Modern Art Museum of Fort Worth", building=yes), 32.749266, -97.363118.
 * The pavilions run 0.8° off east-west (lidar roof edges; OSM edges 0.75°),
 * so the bearing is 0.8.
 *
 * Identity, in order: five long flat-roofed pavilions side by side, three
 * short ones on the north whose glass ends stand in the pond and two long
 * ones on the south; the thin concrete roof slabs, knife-edged and
 * overhanging the glass by about 3 m, each its own slab with a slot of sky
 * between; the tall Y-shaped concrete columns in front of the glass ends;
 * glass boxes with aluminium mullions round concrete galleries, silver
 * aluminium panel walls on the west and the ends; the round café on the
 * pond. The pond itself is the map's.
 *
 * Plan (lidar frame, turned to the bearing; the generator adds the anchor
 * offset). USGS 3DEP lidar TX_Pecos_Dallas_B3_2018 (2018 flight, 0.5 m):
 *  - roof slabs, measured: S2 y -47.4..-30.0, S1 -28.6..-10.6, N3
 *    -9.0..9.2, N2 10.8..29.2, N1 30.4..48.2; all from x -69.0, the three
 *    north ones to x -4.5, the two south ones to 56.5. Roof tops 12.5 m
 *    above y = 0 (lidar 18.2 above the box minimum; y = 0 is the street and
 *    pond level, lidar 5.7, Mapterhorn 173.5 m, flat across the site).
 *    Published: "40-foot" Y columns, five pavilions (Wikipedia, the Modern).
 *  - the slots between the slabs are open over the pond courts east of
 *    x -24 and roofed at 10.75 (lidar 16.4) west of it, where low links
 *    join the pavilions; the S1/S2 link runs the whole length.
 *  - roof monitors, measured (lidar humps 0.9 m, NAIP dark strips): on the
 *    centre lines of N1 (x -53..-17), N2 (-47..-30), N3 (-53..-18) and S1
 *    (-60..-25), 2.5 m wide. Drawn as glass.
 *  - the café: lidar 4.4 m tall over x 13..30, y -10..+2, a D-shaped glass
 *    room on S1's pond side with a disc roof (photos Joe Mabel 05, 08).
 *  - estimated from the photos (Joe Mabel 02..04, 09): the glass walls set
 *    2.8 m in from the slab edges (1.5 m at the west ends), the slabs
 *    0.3 m thick at the edge, the top level and the
 *    soffit alone rising to the edge from 0.8 m thick over the glass; glass
 *    full height to the soffit at 11.7 m; dark concrete walls set 5 m back
 *    between the north glass ends, 8.2 m tall; the glass
 *    ends 12.6 m wide; the Y columns 0.9 m out from the glass, 1.2 m stems
 *    and 1.0 m arms (bold for phone size), forked at 6.4 m (the photos
 *    show the fork a little above half height), their arms meeting the slab 3.7 m either side; mullions about
 *    3 m apart with transoms every 3.6 m (drawn sparser than the real
 *    ~1.5 m so they don't shimmer); the south entrance a 16 m recess between square columns
 *    centred on S2 (Highsmith, Barera 21); aluminium panels
 *    with a ribbon window on the west (Praefcke 2003).
 *  - colours from daylight photos, pulled to the palette's lightness:
 *    Ando's smooth concrete #c9c6bf, aluminium #b9bfc3, the glass a light
 *    sky grey-blue `window` (#7d93a5) as it reads reflecting the sky, the
 *    roof monitors `glass`.
 *  - ground: Mapterhorn is flat under the site (5.4..5.7 m above the
 *    table minimum), the pond drawn as its water level. elevation 0.
 *
 * Photos (all EVIDENCE):
 *  - Ft Worth Modern 01..16.jpg, Joe Mabel, CC BY-SA 3.0 (pond side: the
 *    north pavilion ends, Y columns, café, slab soffits)
 *  - The Modern Art Museum of Fort Worth, Texas ... LCCN2013650779.tif and
 *    Dusk view of the Modern Art Museum of Fort Worth ... LCCN2014632780.tif,
 *    Carol M. Highsmith, public domain (south entrance front; the north
 *    side from the lawn at dusk)
 *  - Fort Worth Cultural District June 2016 21, 22 (Modern Art Museum of
 *    Fort Worth).jpg, Michael Barera, CC BY-SA 4.0 (south entrance front;
 *    N1's north side from the west)
 *  - Fort Worth Texas Modern Art Museum 2003.jpg, Andreas Praefcke, public
 *    domain (south-west corner, aluminium wall)
 *  - Courtyard of the Modern Art Museum of Fort Worth.jpg, Andrewnward,
 *    CC BY-SA 4.0 (pavilion ends over the water)
 * Aerial: USGS NAIP (public domain), plan and roof monitors; it sits ~8 m
 * west of the lidar, which was followed. OSM's outline is a coarse L,
 * 2..4 m off the lidar roofs; the model follows the lidar.
 * No look-only sources. No commercial imagery or 3D tiles.
 *
 * Doubts: the east ends of the two long south pavilions are not
 * photographed and are drawn as glass like the other ends; the exact length of glass along
 * each pavilion is read from oblique photos (glass from x -50 eastward on
 * the pond sides); Y columns are drawn only where photographed, at the
 * three north pavilion ends; the slab taper is estimated.
 * Left out: the pond and its walls, the concrete frame wall and beam on the
 * café terrace, the lawn, sculpture, rooftop plant.
 */
import { Part, cross, sub, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save } from './chi-merchandise-mart'

const ANCHOR: [number, number] = [32.749266, -97.363118]
const BEARING = 0.8

// Lidar frame (turned to the bearing) → model frame.
const OX = 15.64, OY = 9.61
const P = (x: number, y: number, z: number): V3 => [x + OX, y + OY, z]

const TOP = 12.5, EDGE = 0.3, UNDER = 11.7 // level slab top, edge thickness, soffit at the glass
const OV = 2.8, OVW = 1.5 // overhang at the sides and pond ends, at the west ends
const LINK = 10.75, LINK_E = -24
const XW = -69.0
type Pav = { name: string; y0: number; y1: number; x1: number; sky?: [number, number] }
const PAVS: Pav[] = [
  { name: 'S2', y0: -47.4, y1: -30.0, x1: 56.5 },
  { name: 'S1', y0: -28.6, y1: -10.6, x1: 56.5, sky: [-60, -25] },
  { name: 'N3', y0: -9.0, y1: 9.2, x1: -4.5, sky: [-53, -18] },
  { name: 'N2', y0: 10.8, y1: 29.2, x1: -4.5, sky: [-47, -30] },
  { name: 'N1', y0: 30.4, y1: 48.2, x1: -4.5, sky: [-53, -17] },
]
const GLASS_FROM = -50 // glass along the pond sides from here eastward

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
function face(p: Part, pts: V3[], n: V3) {
  const g = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))
  const s = dot(g, n) < 0 ? [...pts].reverse() : pts
  for (let i = 1; i < s.length - 1; i++) p.tri(s[0], s[i], s[i + 1])
}
/** A vertical wall a→b facing n, split every 5 m where it meets the ground. */
function wall(p: Part, ax: number, ay: number, bx: number, by: number, z0: number, z1: number, n: [number, number], out = 0) {
  const L = Math.hypot(bx - ax, by - ay)
  if (L < 1e-6 || z1 <= z0) return
  const k = z0 < 1 ? Math.max(1, Math.ceil(L / 5)) : 1
  for (let i = 0; i < k; i++) {
    const t0 = i / k, t1 = (i + 1) / k
    const x0 = ax + (bx - ax) * t0 + n[0] * out, y0 = ay + (by - ay) * t0 + n[1] * out
    const x1 = ax + (bx - ax) * t1 + n[0] * out, y1 = ay + (by - ay) * t1 + n[1] * out
    face(p, [P(x0, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y0, z1)], [n[0], n[1], 0])
  }
}
function flat(p: Part, x0: number, y0: number, x1: number, y1: number, z: number, up = true) {
  face(p, [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)], [0, 0, up ? 1 : -1])
}
function box(side: Part, top: Part | null, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  wall(side, x0, y0, x1, y0, z0, z1, [0, -1])
  wall(side, x1, y1, x0, y1, z0, z1, [0, 1])
  wall(side, x0, y1, x0, y0, z0, z1, [-1, 0])
  wall(side, x1, y0, x1, y1, z0, z1, [1, 0])
  if (top) flat(top, x0, y0, x1, y1, z1)
}
/** A square strut of width w from a to b (lidar-frame points), four sides. */
function strut(p: Part, a: V3, b: V3, w: number) {
  const d = norm(sub(b, a))
  const u = Math.abs(d[2]) > 0.99 ? ([1, 0, 0] as V3) : norm(cross(d, [0, 0, 1]))
  const v = norm(cross(u, d))
  const c = (q: V3, su: number, sv: number): V3 => P(q[0] + (u[0] * su + v[0] * sv) * w / 2, q[1] + (u[1] * su + v[1] * sv) * w / 2, q[2] + (u[2] * su + v[2] * sv) * w / 2)
  const sides: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]]
  for (let i = 0; i < 4; i++) {
    const [s0, t0] = sides[i], [s1, t1] = sides[(i + 1) % 4]
    const mid: V3 = [u[0] * (s0 + s1) + v[0] * (t0 + t1), u[1] * (s0 + s1) + v[1] * (t0 + t1), u[2] * (s0 + s1) + v[2] * (t0 + t1)]
    face(p, [c(a, s0, t0), c(a, s1, t1), c(b, s1, t1), c(b, s0, t0)], mid)
  }
}

function build() {
  const conc = new Part(), alu = new Part(), win = new Part(), sky = new Part(), roof = new Part(), dark = new Part()

  /** A glass wall a→b with aluminium mullions and transoms laid on it. */
  function glassWall(ax: number, ay: number, bx: number, by: number, z0: number, z1: number, n: [number, number]) {
    wall(win, ax, ay, bx, by, z0, z1, n)
    const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L
    const bays = Math.max(1, Math.round(L / 3))
    for (let i = 0; i <= bays; i++) {
      const s = (L * i) / bays, w = i === 0 || i === bays ? 0.3 : 0.16
      const s0 = Math.max(0, s - w / 2), s1 = Math.min(L, s + w / 2)
      wall(alu, ax + ux * s0, ay + uy * s0, ax + ux * s1, ay + uy * s1, z0, z1, n, 0.04)
    }
    for (let z = z0 + 3.6; z < z1 - 1; z += 3.6) wall(alu, ax, ay, bx, by, z - 0.08, z + 0.08, n, 0.04)
  }

  /** The slab: flat top, thin edge, soffit sloping up to the edge from the glass line. */
  function slab(x0: number, y0: number, x1: number, y1: number, ix0: number, iy0: number, ix1: number, iy1: number) {
    flat(conc, x0, y0, x1, y1, TOP)
    const e = TOP - EDGE
    wall(conc, x0, y0, x1, y0, e, TOP, [0, -1])
    wall(conc, x1, y1, x0, y1, e, TOP, [0, 1])
    wall(conc, x0, y1, x0, y0, e, TOP, [-1, 0])
    wall(conc, x1, y0, x1, y1, e, TOP, [1, 0])
    const O = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], I = [[ix0, iy0], [ix1, iy0], [ix1, iy1], [ix0, iy1]]
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4
      const pts = [P(O[i][0], O[i][1], e), P(O[j][0], O[j][1], e), P(I[j][0], I[j][1], UNDER), P(I[i][0], I[i][1], UNDER)]
      const out: V3 = i === 0 ? [0, -1, 0] : i === 1 ? [1, 0, 0] : i === 2 ? [0, 1, 0] : [-1, 0, 0]
      face(conc, pts, [out[0] * 0.4, out[1] * 0.4, -1])
    }
  }

  const body = (p: Pav) => ({ x0: XW + OVW, x1: p.x1 - OV, y0: p.y0 + OV, y1: p.y1 - OV })

  for (const p of PAVS) {
    const b = body(p)
    slab(XW, p.y0, p.x1, p.y1, b.x0, b.y0, b.x1, b.y1)
    if (p.sky) {
      const c = (p.y0 + p.y1) / 2
      box(sky, sky, p.sky[0], c - 1.25, TOP, p.sky[1], c + 1.25, TOP + 0.9)
    }
  }

  // --- Walls ---------------------------------------------------------------
  const [S2, S1, N3, N2, N1] = PAVS.map(body)
  const north = PAVS.slice(2).map(body)
  // West ends: aluminium with a ribbon window, all five.
  for (const b of [S2, S1, N3, N2, N1]) {
    wall(alu, b.x0, b.y1, b.x0, b.y0, 0, UNDER, [-1, 0])
    wall(win, b.x0, b.y1 - 1, b.x0, b.y0 + 1, 6.6, 7.4, [-1, 0], 0.04)
  }
  // The north pavilions: glass on the pond end and along the open slots, aluminium to the west.
  for (const b of north) {
    glassWall(b.x1, b.y0, b.x1, b.y1, 0, UNDER, [1, 0])
    // south side
    wall(alu, b.x0, b.y0, GLASS_FROM, b.y0, 0, UNDER, [0, -1])
    glassWall(GLASS_FROM, b.y0, b.x1, b.y0, 0, UNDER, [0, -1])
    // north side
    wall(alu, GLASS_FROM, b.y1, b.x0, b.y1, 0, UNDER, [0, 1])
    glassWall(b.x1, b.y1, GLASS_FROM, b.y1, 0, UNDER, [0, 1])
  }
  // S1: glass on its pond side, aluminium to the west and at the east end.
  wall(alu, S1.x0, S1.y1, GLASS_FROM, S1.y1, 0, UNDER, [0, 1])
  glassWall(S1.x1, S1.y1, GLASS_FROM, S1.y1, 0, UNDER, [0, 1])
  // east ends (not photographed): glass like the other pavilion ends
  glassWall(S1.x1, S1.y0, S1.x1, S1.y1, 0, UNDER, [1, 0])
  glassWall(S2.x1, S2.y0, S2.x1, S2.y1, 0, UNDER, [1, 0])
  // S2's south front: aluminium ends, two glass walls and the recessed entrance between.
  {
    const c = -7, n: [number, number] = [0, -1], y = S2.y0, r = 4
    wall(alu, S2.x0, y, c - 32, y, 0, UNDER, n)
    wall(win, S2.x0 + 2, y, c - 34, y, 6.6, 7.4, n, 0.04)
    glassWall(c - 32, y, c - 8, y, 0, UNDER, n)
    glassWall(c + 8, y, c + 32, y, 0, UNDER, n)
    wall(alu, c + 32, y, S2.x1, y, 0, UNDER, n)
    wall(win, c + 34, y, S2.x1 - 2, y, 6.6, 7.4, n, 0.04)
    // the recess: glass at the back, concrete returns and soffit, four square columns
    glassWall(c - 8, y + r, c + 8, y + r, 0, UNDER, n)
    wall(conc, c - 8, y, c - 8, y + r, 0, UNDER, [1, 0])
    wall(conc, c + 8, y + r, c + 8, y, 0, UNDER, [-1, 0])
    flat(conc, c - 8, y, c + 8, y + r, UNDER, false)
    for (const x of [-6, -2, 2, 6]) box(conc, null, c + x - 0.5, y - 0.5, 0, c + x + 0.5, y + 0.5, UNDER)
  }
  // Links between the pavilions west of x -24 (S1/S2 the whole length).
  const links: [number, number, number][] = [[S2.y1, S1.y0, S1.x1], [S1.y1, N3.y0, LINK_E], [N3.y1, N2.y0, LINK_E], [N2.y1, N1.y0, LINK_E]]
  for (const [ya, yb, xe] of links) {
    flat(roof, XW + OVW, ya, xe, yb, LINK)
    wall(alu, XW + OVW, yb, XW + OVW, ya, 0, LINK, [-1, 0])
    wall(dark, xe, ya, xe, yb, 0, LINK, [1, 0])
    // the link's side walls above the pavilions' soffit line are hidden; none needed
  }

  // Dark concrete walls set back between the pond-end glass boxes, 8.2 m tall (Joe Mabel 03).
  for (const [lo, hi] of [[S1, N3], [N3, N2], [N2, N1]]) {
    const xd = lo === S1 ? hi.x1 - 5 : lo.x1 - 5
    wall(dark, xd, lo.y1, xd, hi.y0, 0, 8.2, [1, 0])
    flat(dark, xd - 0.6, lo.y1, xd, hi.y0, 8.2)
  }

  // --- Y columns at the north pavilions' pond ends ------------------------------
  for (const p of PAVS.slice(2)) {
    const b = body(p), c = (p.y0 + p.y1) / 2, x = b.x1 + 0.9
    const fork = 6.4, spread = 4.0
    // the soffit's height above x (it rises from UNDER at the glass to the edge)
    const zs = UNDER + ((TOP - EDGE - UNDER) * (x - b.x1)) / OV
    box(conc, null, x - 0.6, c - 0.6, 0, x + 0.6, c + 0.6, fork)
    strut(conc, [x, c - 0.2, fork - 0.4], [x, c - spread, zs + 0.1], 1.0)
    strut(conc, [x, c + 0.2, fork - 0.4], [x, c + spread, zs + 0.1], 1.0)
  }

  // --- The café ---------------------------------------------------------------
  {
    const cx = 21.5, cy = -6.5, r = 8.5, yb = S1.y1, seg = 12
    const ring: [number, number][] = []
    for (let i = 0; i <= seg; i++) { const a = (Math.PI * i) / seg; ring.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
    // glass drum: straight returns to S1, then the half round
    const pts: [number, number][] = [[cx + r, yb], ...ring, [cx - r, yb]]
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1]
      const n = norm([by - ay, -(bx - ax), 0])
      wall(win, ax, ay, bx, by, 0, 3.9, [n[0], n[1]])
    }
    // the disc roof, 1.2 m out over the glass
    const R2 = r + 1.2
    const top: V3[] = [P(cx + R2, yb, 4.4)], bot: V3[] = [P(cx + R2, yb, 3.9)]
    for (let i = 0; i <= seg; i++) {
      const a = (Math.PI * i) / seg
      top.push(P(cx + R2 * Math.cos(a), cy + R2 * Math.sin(a), 4.4)); bot.push(P(cx + R2 * Math.cos(a), cy + R2 * Math.sin(a), 3.9))
    }
    top.push(P(cx - R2, yb, 4.4)); bot.push(P(cx - R2, yb, 3.9))
    face(conc, top, [0, 0, 1])
    face(conc, bot, [0, 0, -1])
    for (let i = 0; i < top.length - 1; i++) {
      const m = sub(top[i + 1], top[i])
      face(conc, [bot[i], bot[i + 1], top[i + 1], top[i]], [m[1], -m[0], 0])
    }
  }

  return [
    { part: conc, material: finish('modern-concrete', 0xc9c6bf) },
    { part: alu, material: finish('modern-aluminium', 0xb9bfc3, 0.5) },
    { part: win, material: { ...PALETTE.window, color: 0x7d93a5 } },
    { part: sky, material: PALETTE.glass },
    { part: roof, material: PALETTE.roof },
    { part: dark, material: finish('modern-concrete-dark', 0x9a9b97) },
  ]
}

if (import.meta.main) await save('dal-modern-art-museum', 'Modern Art Museum of Fort Worth', ANCHOR, BEARING, build(), 6500)
