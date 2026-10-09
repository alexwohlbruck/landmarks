/**
 * The Riverside Church, 490 Riverside Drive — procedural, CC0-1.0, no textures.
 * bun generators/nyc-riverside-church.ts
 *
 * Also a small Gothic kit (pointed and lancet panels, gables, pinnacles)
 * shared with nyc-st-john-the-divine.ts; the model is only built when this
 * file is run.
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north is
 * up the nave, the chancel end, towards 122nd Street; the tower stands at
 * the south end of the nave, its portal on Riverside Drive (model west).
 * Placed at bearing 29.4°, the outline's long edges. Anchor: area centroid
 * of the OSM building way/274986253 (the church, tower and the wings inside
 * that outline). The place_of_worship area way/137341515 is a site polygon,
 * not a building, so it is not replaced.
 *
 * Evidence
 * - OSM way/274986253: church outline, 120.1 m; the 1959 south wing
 *   (way/274986259, 39.8 m) and the east building (way/274986258) are
 *   separate and left as they are.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017), 1 m, read in the model frame.
 *   y = 0 is the sunken court on the east side (33.9 m NAVD88, the lowest
 *   ground under the outline); Riverside Drive along the west front stands
 *   5.5 m higher. Heights above y = 0: nave eaves 38.5 m both sides, ridge
 *   51 m over u = −4, the roof hipped down over the chancel from v = 42;
 *   the tower's lower stage 29 × 30 m to 45–52 m, its shaft ~21 m square
 *   with angle buttresses stepping up to 84–97 m, the upper stage 19.5 m
 *   square to a parapet at ~118 m, corner pinnacles 123 m, the central
 *   lantern 126.6 m (the lidar's highest return); the block south of the
 *   tower 28–33 m; the low east wing 9–11 m.
 * - Published: 1930, Allen & Collens with Henry C. Pelton, French Gothic
 *   after Chartres, Indiana limestone; tower 392 ft (119 m) above Riverside
 *   Drive, the 74-bell Laura Spelman Rockefeller carillon at its top
 *   (Wikipedia; NYC LPC designation 2000).
 * - Photos (Wikimedia Commons), credits in
 *   /tmp/city/nyc/work/nyc-riverside-church/photos/credits.txt: from the
 *   Hudson (Acroterion: the west elevation beside Grant's Tomb), the tower
 *   from the south-east (Ad Meskens), the tower's west face and the nave
 *   from the north on the Grant's Tomb plaza (Epicgenius, March 2026; the
 *   same set's views of the clerestory bays, two lancets under a rose,
 *   were looked at for the bay pattern).
 *
 * Estimated: the tower's stage heights and openings from the photos scaled
 * to the lidar's levels (paired lancets 62–84 m, three arched openings per
 * face at 87–98 m and 102–115 m); the crown as four corner pinnacles, four
 * face pinnacles and a central lantern standing for its cluster of spirelets;
 * the nave's seven bays (two lancets under a rose in the clerestory, a
 * triplet in the aisle); the west portal's arch and rose; the south and
 * east wings drawn as plain limestone blocks with window panels.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, chamferRect, circle, type XY, type Facade } from './nyc-570-lexington'
import { block, wallFrame, discPanel } from './nyc-city-hall'

// ===========================================================================
// Gothic kit
// ===========================================================================

/** A flat pointed-arch panel on a wall a→b (centre s, width w, top zTop), two true arcs of radius w. */
export function pointed(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.05, segs = 5) {
  const f = wallFrame(a, b, d), h = w * Math.sqrt(3) / 2, spring = zTop - h
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, spring]]
  for (let i = 1; i <= segs; i++) { const t = (i / segs) * (Math.PI / 3); pts.push([s - w / 2 + w * Math.cos(t), spring + w * Math.sin(t)]) }
  for (let i = segs - 1; i >= 0; i--) { const t = (i / segs) * (Math.PI / 3); pts.push([s + w / 2 - w * Math.cos(t), spring + w * Math.sin(t)]) }
  const c: [number, number] = [s, (z0 + spring) / 2]
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(c[0], c[1]), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** A flat round-arched panel (semicircular head). */
export function roundArch(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.05, segs = 8) {
  const f = wallFrame(a, b, d), r = w / 2, spring = zTop - r
  const pts: [number, number][] = [[s - r, z0], [s + r, z0]]
  for (let i = 0; i <= segs; i++) { const t = (i / segs) * Math.PI; pts.push([s + r * Math.cos(t), spring + r * Math.sin(t)]) }
  const c: [number, number] = [s, Math.max(z0, spring - r * 0.3)]
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(c[0], c[1]), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** A square pinnacle: shaft z0..z1, pyramid to tip. */
export function pinnacle(p: Part, x: number, y: number, r: number, z0: number, z1: number, tip: number) {
  block(p, x - r, y - r, x + r, y + r, z0, z1)
  const k = r * 1.08
  const q: V3[] = [[x - k, y - k, z1], [x + k, y - k, z1], [x + k, y + k, z1], [x - k, y + k, z1]]
  for (let i = 0; i < 4; i++) p.tri(q[i], q[(i + 1) % 4], [x, y, tip])
}

/** A pyramid (any convex ring, counter-clockwise) from z0 to an apex at (cx, cy, tip). */
export function pyramid(p: Part, ring: XY[], z0: number, cx: number, cy: number, tip: number) {
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    p.tri([a[0], a[1], z0], [b[0], b[1], z0], [cx, cy, tip])
  }
}

/** Gabled roof over a rectangle, ridge along y, eaves at z0, ridge at z1, with end gables in `wall`; `hipN`/`hipS` hip an end instead. */
export function gableY(roof: Part, wall: Part, x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, o = 0.4, hipN = 0, hipS = 0) {
  const cx = (x0 + x1) / 2
  const ry0 = y0 + hipS, ry1 = y1 - hipN
  roof.quad([x1 + o, y0 - o, z0], [x1 + o, y1 + o, z0], [cx, ry1 + (hipN ? 0 : o), z1], [cx, ry0 - (hipS ? 0 : o), z1])
  roof.quad([x0 - o, y1 + o, z0], [x0 - o, y0 - o, z0], [cx, ry0 - (hipS ? 0 : o), z1], [cx, ry1 + (hipN ? 0 : o), z1])
  if (hipN) roof.tri([x1 + o, y1 + o, z0], [x0 - o, y1 + o, z0], [cx, ry1, z1])
  else wall.tri([x1, y1, z0], [x0, y1, z0], [cx, y1, z1])
  if (hipS) roof.tri([x0 - o, y0 - o, z0], [x1 + o, y0 - o, z0], [cx, ry0, z1])
  else wall.tri([x0, y0, z0], [x1, y0, z0], [cx, y0, z1])
}

/** Two lancets and a rose over them, centred at s on a wall a→b (the Chartres clerestory bay). */
export function lancetPairRose(win: Part, a: XY, b: XY, s: number, w: number, gap: number, z0: number, z1: number, roseR: number, roseZ: number) {
  pointed(win, a, b, s - (w + gap) / 2, w, z0, z1)
  pointed(win, a, b, s + (w + gap) / 2, w, z0, z1)
  if (roseR > 0) discPanel(win, a, b, s, roseZ, roseR, 0.05, 12)
}

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// ===========================================================================
// The Riverside Church
// ===========================================================================

function build() {
  const stone = new Part(), win = new Part(), roof = new Part(), dark = new Part()

  // --- Nave: one wide gabled hall between buttresses, u −16.6..8.6 ---
  const X0 = -16.6, X1 = 8.6, NV0 = 0.5, NV1 = 48.2, EAVE = 38.5, RIDGE = 51.0
  prism({ wall: stone, win: null, roof: null, ring: rect(X0, NV0, X1, NV1), z0: 0, z1: EAVE, facade: null, bevel: 0.3 })
  // parapets along the eaves
  for (const [x0, x1] of [[X0 - 0.2, X0 + 0.5], [X1 - 0.5, X1 + 0.2]]) block(stone, x0, NV0, x1, NV1, EAVE - 0.6, EAVE + 0.6)
  // roof, hipped over the chancel (lidar: ridge ends ~v 42)
  gableY(roof, stone, X0, NV0, X1, NV1, EAVE, RIDGE, 0.2, 6.0, 0)
  // seven bays: buttresses with pinnacles, clerestory lancets under a rose, an aisle triplet
  const bays = 7, pitch = (NV1 - 2 - NV0) / bays
  const west: [XY, XY] = [[X0, NV1], [X0, NV0]], east: [XY, XY] = [[X1, NV0], [X1, NV1]]
  for (let i = 0; i <= bays; i++) {
    const y = NV0 + 1 + i * pitch
    for (const [x0, x1, xo] of [[X0 - 1.0, X0, X0 - 0.5], [X1, X1 + 1.0, X1 + 0.5]]) {
      block(stone, x0, y - 0.6, x1, y + 0.6, 0, EAVE - 1.5)
      pinnacle(stone, xo, y, 0.55, EAVE - 1.5, EAVE + 1.2, EAVE + 4.0)
    }
  }
  for (let i = 0; i < bays; i++) {
    const yc = NV0 + 1 + (i + 0.5) * pitch
    for (const [a, b] of [west, east]) {
      const s = a[1] > b[1] ? a[1] - yc : yc - a[1]
      lancetPairRose(win, a, b, s, 1.6, 0.6, 20.5, 31.5, 1.5, 34.0)
      for (const k of [-1, 0, 1]) pointed(win, a, b, s + k * 1.3, 0.9, 8.5, 14.5)
    }
  }
  // north (chancel) end: three tall lancets
  for (const k of [-1, 0, 1]) pointed(win, [X1, NV1], [X0, NV1], (X1 - X0) / 2 + k * 3.2, 2.0, 14, 30)

  // --- The tower ---
  const TX = -4.0, TY = -14.0
  // Lower stage, 29 × 30 m to 46 m, with the west portal.
  const L0: XY[] = rect(-17.6, -28.7, 10.4, 0.5)
  prism({ wall: stone, win: null, roof, ring: L0, z0: 0, z1: 46, facade: null, bevel: 0.4 })
  block(stone, -17.7, -28.8, 10.5, 0.6, 44.8, 46.6)
  {
    const a: XY = [-17.6, 0.5], b: XY = [-17.6, -28.7], s = 0.5 - TY
    pointed(stone, a, b, s, 13.0, 5.5, 36.0, 0.25) // the great arch, a recessed order drawn as a raised ring
    pointed(dark, a, b, s, 11.0, 5.5, 34.5, 0.3)
    discPanel(win, a, b, s, 24.5, 3.6, 0.35, 16)
    pointed(stone, a, b, s, 5.0, 5.5, 15.5, 0.35) // tympanum over the doors
    pointed(dark, a, b, s, 3.6, 5.5, 13.5, 0.4)
  }
  // Shaft: 22 m square with the angle buttresses filling its corners to 86 m.
  const S1 = 11.0, Z1 = 86, Z2 = 100, Z3 = 118
  prism({ wall: stone, win: null, roof, ring: chamferRect(TX - S1, TY - S1, TX + S1, TY + S1, 1.2), z0: 46, z1: Z1, facade: null, bevel: 0.3 })
  // Upper shaft and belfry: chamfered, stepping in.
  prism({ wall: stone, win: null, roof, ring: chamferRect(TX - 10.4, TY - 10.4, TX + 10.4, TY + 10.4, 2.6), z0: Z1, z1: Z2, facade: null, bevel: 0.3 })
  prism({ wall: stone, win: null, roof, ring: chamferRect(TX - 9.75, TY - 9.75, TX + 9.75, TY + 9.75, 3.2), z0: Z2, z1: Z3, facade: null, bevel: 0.3 })
  // corner turrets at the foot of the shaft (octagonal, balconied, ~46–62 m)
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const cx = TX + sx * 11.4, cy = TY + sy * 11.4
    prism({ wall: stone, win: null, roof: null, ring: circle(cx, cy, 2.2, 8, Math.PI / 8), z0: 46, z1: 60, facade: null, bevel: 0.1 })
    pyramid(stone, circle(cx, cy, 2.35, 8, Math.PI / 8), 60, cx, cy, 65)
    // stepped angle buttress up the shaft's corner, capped with a pinnacle
    pinnacle(stone, TX + sx * 9.9, TY + sy * 9.9, 1.6, Z1 - 0.5, Z1 + 3.0, Z1 + 9.0)
    pinnacle(stone, TX + sx * 8.5, TY + sy * 8.5, 1.4, Z2 - 0.5, Z2 + 2.5, Z2 + 8.0)
    // crown: the tall corner pinnacles
    pinnacle(stone, TX + sx * 7.9, TY + sy * 7.9, 1.5, Z3 - 0.5, Z3 + 3.5, 126.0)
    pinnacle(stone, TX + sx * 7.9, TY + sy * 4.6, 0.8, Z3 - 0.5, Z3 + 2.2, 123.0)
    pinnacle(stone, TX + sx * 4.6, TY + sy * 7.9, 0.8, Z3 - 0.5, Z3 + 2.2, 123.0)
  }
  // the lower stage's free faces (south and east): tall pointed windows
  for (const [a, b] of [[[-17.6, -28.7], [10.4, -28.7]], [[10.4, -28.7], [10.4, 0.5]]] as [XY, XY][]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (const k of [-1, 0, 1]) pointed(win, a, b, L / 2 + k * 7.5, 2.6, 33, 43)
  }
  // Faces: tall paired lancets (two pairs) in the shaft, three arched openings above, three in the belfry.
  const faces: [XY, XY][] = [
    [[TX - S1, TY + S1], [TX - S1, TY - S1]], // west
    [[TX - S1, TY - S1], [TX + S1, TY - S1]], // south
    [[TX + S1, TY - S1], [TX + S1, TY + S1]], // east
    [[TX + S1, TY + S1], [TX - S1, TY + S1]], // north
  ]
  faces.forEach(([a, b], i) => {
    for (const k of [-1, 1]) for (const j of [-1, 1]) pointed(win, a, b, S1 + k * 4.2 + j * 1.15, 1.8, 62, 83.5)
    // a balconied pair at the shaft's foot
    if (i !== 3) for (const k of [-1, 1]) roundArch(win, a, b, S1 + k * 4.2, 3.0, 50, 57)
    const shrink = (r: number): [XY, XY] => {
      const d = S1 - r, ux = (b[0] - a[0]) / (2 * S1), uy = (b[1] - a[1]) / (2 * S1), nx = uy, ny = -ux
      return [[a[0] + ux * d - nx * d, a[1] + uy * d - ny * d], [b[0] - ux * d - nx * d, b[1] - uy * d - ny * d]]
    }
    const [a2, b2] = shrink(10.4), [a3, b3] = shrink(9.75)
    for (const k of [-1, 0, 1]) roundArch(win, a2, b2, 10.4 + k * 3.6, 2.6, 88, 98)
    for (const k of [-1, 0, 1]) pointed(win, a3, b3, 9.75 + k * 3.3, 2.4, 102.5, 115.5)
    // face-centre crown pinnacles
    const mx = (a3[0] + b3[0]) / 2, my = (a3[1] + b3[1]) / 2
    const ix = mx + (TX - mx) * 0.08, iy = my + (TY - my) * 0.08
    pinnacle(stone, ix, iy, 1.0, Z3 - 0.5, Z3 + 2.5, 123.5)
  })
  // Crown parapet and the central lantern.
  {
    const r: XY[] = chamferRect(TX - 9.75, TY - 9.75, TX + 9.75, TY + 9.75, 3.2)
    for (let i = 0; i < r.length; i++) {
      const p0 = r[i], p1 = r[(i + 1) % r.length]
      const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), ux = (p1[0] - p0[0]) / L, uy = (p1[1] - p0[1]) / L
      const q: XY[] = [p0, p1, [p1[0] - uy * 0.6 + 0, p1[1] + ux * 0.6], [p0[0] - uy * 0.6, p0[1] + ux * 0.6]]
      prism({ wall: stone, win: null, roof: stone, ring: q, z0: Z3, z1: Z3 + 1.8, facade: null, bevel: 0.05 })
    }
    const lr = circle(TX, TY, 3.4, 8, Math.PI / 8)
    prism({ wall: stone, win: null, roof: null, ring: lr, z0: Z3, z1: 122.5, facade: null, bevel: 0.1 })
    pyramid(stone, circle(TX, TY, 3.6, 8, Math.PI / 8), 122.5, TX, TY, 126.6)
  }

  // --- South block (28–33 m) and the low east wings, plain limestone with windows ---
  const wing: Facade = { bay: 3.4, ratio: 0.5, floor: 3.4, group: 2, spandrel: 1.4, sill: 1.2, head: 2.0, ground: 6.5, minLength: 4 }
  prism({ wall: stone, win, roof, ring: [[-16.0, -40.6], [10.6, -40.6], [10.6, -28.7], [-16.0, -28.7]], z0: 0, z1: 31, facade: wing, bevel: 0.3 })
  prism({ wall: stone, win, roof, ring: [[10.6, -44.2], [18.8, -44.2], [18.8, -22.7], [10.4, -22.7]], z0: 0, z1: 14, facade: wing, bevel: 0.3 })
  prism({ wall: stone, win, roof, ring: [[10.4, -17.1], [22.8, -17.1], [22.8, -8.2], [10.4, -8.2]], z0: 0, z1: 9, facade: wing, bevel: 0.3 })
  prism({ wall: stone, win, roof, ring: [[18.8, -22.7], [40.4, -22.6], [40.4, -17.1], [18.8, -17.1]], z0: 0, z1: 11, facade: wing, bevel: 0.3 })
  prism({ wall: stone, win: null, roof, ring: [[10.4, -22.7], [18.8, -22.7], [18.8, -17.1], [10.4, -17.1]], z0: 0, z1: 11, facade: null, bevel: 0.2 })

  finishModel('The Riverside Church', 'nyc-riverside-church', [
    { part: stone, material: finish('riverside-limestone', 0xe6e1d7) },
    { part: win, material: PALETTE.window },
    { part: roof, material: PALETTE.roof },
    { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x5d6a74 } },
  ], { bearing: 29.4, osm: 'way/274986253', height: 126.6 }, 6500)
}

if (import.meta.main) build()
