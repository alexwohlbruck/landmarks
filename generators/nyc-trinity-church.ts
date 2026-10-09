/**
 * Trinity Church, Broadway at Wall Street — procedural, CC0-1.0, no textures.
 * bun generators/nyc-trinity-church.ts
 *
 * Map frame: x = model east, y = model north, z up, metres. Model north is
 * the church's liturgical west: the tower stands at +y on Broadway, looking
 * down Wall Street; the chancel is at −y towards Trinity Place. Placed at
 * bearing 121.1°, the outline's long axis. Anchor: area centroid of the OSM
 * outline way/278039453. Kit from nyc-city-hall.ts and nyc-570-lexington.ts.
 *
 * Evidence
 * - OSM way/278039453 (outline) and its parts: the tower 276175149/146/143
 *   (13.6, 12 and 10.6 m squares to 20, 30 and 41 m), its corner pinnacles
 *   276175151/162/164/171 (41–55 m), the spire 276175159 (octagonal,
 *   41–86 m), nave and aisles 276175142/154, the clerestory pinnacles
 *   276175153…174 (to 27 m, every 5 m on both clerestory walls), the side
 *   chapels 276175147/148 (gabled, 17 m), the link 276175145, the tower
 *   porches 276175150/152 and their pinnacles 276175138/139/140/141/172/173.
 * - Lidar: USGS 3DEP NY_NewYorkCity (2017) in the model frame: spire tip
 *   88 m above the lowest ground under the outline (Trinity Place side,
 *   7.2 m NAVD88; Broadway stands ~4 m higher); the aisles 16–17 m, the
 *   clerestory pinnacles 30–32 m, the nave ridge 29–30 m.
 * - Published: 1846, Richard Upjohn, Gothic Revival in New Jersey brownstone;
 *   281 ft (86 m) spire, the tallest building in the US until 1869
 *   (Wikipedia; NRHP 76001252).
 * - Photos (Wikimedia Commons / Openverse): /tmp/city/nyc/work/nyc-trinity-church/photos/credits.txt.
 *   Broadway front (Cory Hartman; Kidfly182), the north side with tower,
 *   aisle and clerestory (Ken Lund), the All Saints chapel and the south side
 *   (DanielPenfield, two), down Wall Street (Lerxst15).
 *
 * Colour: the brownstone is a weathered red-brown, near black in shade and
 * a dull mauve-brown in sun (Penfield). Drawn as a readable mid brown-grey
 * with that red cast, as STYLE asks for a large dark surface.
 *
 * Estimated: the clerestory (wall to 24.5 m) and aisle (14.5 m + parapet)
 * heights between the lidar's roof returns, the window sizes, the tower's
 * openings (door, great window, clock, belfry) from the Broadway photo
 * scaled to the 41 m tower, the spire's lucarnes, the chancel block's
 * massing (lidar 11–20 m, partly hidden by trees). Crenellations are drawn
 * as plain parapets.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { finishModel, prism, circle, type XY } from './nyc-570-lexington'
import { block, wallFrame, discPanel } from './nyc-city-hall'

const stone = new Part(), win = new Part(), roof = new Part(), dark = new Part()

/** A pointed (equilateral) arch panel on a wall a→b: two true arcs over a rectangle. */
function pointed(p: Part, a: XY, b: XY, s: number, w: number, z0: number, zTop: number, d = 0.05, segs = 6) {
  const f = wallFrame(a, b, d), h = w * Math.sqrt(3) / 2, spring = zTop - h
  const pts: [number, number][] = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, spring]]
  // right arc: centre at the left springing point, radius w
  for (let i = 1; i <= segs; i++) { const t = (i / segs) * (Math.PI / 3); pts.push([s - w / 2 + w * Math.cos(t), spring + w * Math.sin(t)]) }
  for (let i = segs - 1; i >= 0; i--) { const t = (i / segs) * (Math.PI / 3); pts.push([s + w / 2 - w * Math.cos(t), spring + w * Math.sin(t)]) }
  const c: [number, number] = [s, (z0 + spring) / 2]
  for (let i = 0; i < pts.length; i++) {
    const A = pts[i], B = pts[(i + 1) % pts.length]
    if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 1e-6) continue
    p.tri(f.at(c[0], c[1]), f.at(A[0], A[1]), f.at(B[0], B[1]))
  }
}

/** A gabled roof over a rectangle, ridge along y (or x), with stone gable walls. */
function gable(x0: number, y0: number, x1: number, y1: number, z0: number, h: number, alongY = true, o = 0.3) {
  if (alongY) {
    const cx = (x0 + x1) / 2
    roof.quad([x1 + o, y0 - o, z0], [x1 + o, y1 + o, z0], [cx, y1 + o, z0 + h], [cx, y0 - o, z0 + h])
    roof.quad([x0 - o, y1 + o, z0], [x0 - o, y0 - o, z0], [cx, y0 - o, z0 + h], [cx, y1 + o, z0 + h])
    stone.tri([x0, y0, z0], [x1, y0, z0], [cx, y0, z0 + h])
    stone.tri([x1, y1, z0], [x0, y1, z0], [cx, y1, z0 + h])
  } else {
    const cy = (y0 + y1) / 2
    roof.quad([x0 - o, y0 - o, z0], [x1 + o, y0 - o, z0], [x1 + o, cy, z0 + h], [x0 - o, cy, z0 + h])
    roof.quad([x1 + o, y1 + o, z0], [x0 - o, y1 + o, z0], [x0 - o, cy, z0 + h], [x1 + o, cy, z0 + h])
    stone.tri([x1, y0, z0], [x1, y1, z0], [x1, cy, z0 + h])
    stone.tri([x0, y1, z0], [x0, y0, z0], [x0, cy, z0 + h])
  }
}

/** A square pinnacle: a shaft and a tall pyramid cap. */
function pinnacle(x: number, y: number, r: number, z0: number, z1: number, tip: number) {
  block(stone, x - r, y - r, x + r, y + r, z0, z1)
  const q: V3[] = [[x - r * 1.1, y - r * 1.1, z1], [x + r * 1.1, y - r * 1.1, z1], [x + r * 1.1, y + r * 1.1, z1], [x - r * 1.1, y + r * 1.1, z1]]
  for (let i = 0; i < 4; i++) stone.tri(q[i], q[(i + 1) % 4], [x, y, tip])
}

const rect = (x0: number, y0: number, x1: number, y1: number): XY[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

// --- Nave, aisles, clerestory ---
const NX0 = -9.0, NX1 = 4.9 // clerestory walls
const AX0 = -14.4, AX1 = 10.7 // aisle walls
const NY0 = -16.0, NY1 = 22.8 // west (chancel) and tower ends
const AISLE = 14.5, CLER = 24.5, RIDGE = 30.0
prism({ wall: stone, win: null, roof, ring: rect(AX0, NY0, AX1, NY1), z0: 0, z1: AISLE, facade: null, bevel: 0.3 })
// Aisle parapets.
for (const [x0, x1] of [[AX0, AX0 + 0.5], [AX1 - 0.5, AX1]]) block(stone, x0, NY0, x1, NY1, AISLE, AISLE + 1.3)
prism({ wall: stone, win: null, roof: null, ring: rect(NX0, NY0, NX1, NY1), z0: AISLE, z1: CLER, facade: null, bevel: 0.2 })
block(stone, NX0 - 0.15, NY0, NX0 + 0.4, NY1, CLER, CLER + 1.0)
block(stone, NX1 - 0.4, NY0, NX1 + 0.15, NY1, CLER, CLER + 1.0)
gable(NX0 + 0.3, NY0, NX1 - 0.3, NY1, CLER, RIDGE - CLER, true, 0.1)
// Bays: buttresses on the aisle walls, a tall pointed window per bay in the
// aisles, a pair of pointed clerestory lights above, pinnacles on the
// clerestory buttresses (OSM, every 5 m).
const bayY = [-13.0, -8.0, -3.0, 2.0, 7.0, 12.0, 17.0]
for (const y of bayY) {
  block(stone, AX0 - 0.8, y - 0.55, AX0, y + 0.55, 0, AISLE + 0.6)
  block(stone, AX1, y - 0.55, AX1 + 0.8, y + 0.55, 0, AISLE + 0.6)
  pinnacle(NX0 + 0.05, y, 0.45, CLER - 1, CLER + 1.6, 27.5)
  pinnacle(NX1 - 0.05, y, 0.45, CLER - 1, CLER + 1.6, 27.5)
}
for (let i = 0; i < bayY.length - 1; i++) {
  const yc = (bayY[i] + bayY[i + 1]) / 2
  // aisle windows (east wall runs +y, west wall −y)
  pointed(win, [AX1, NY0], [AX1, NY1], yc - NY0, 2.4, 3.2, 12.6)
  pointed(win, [AX0, NY1], [AX0, NY0], NY1 - yc, 2.4, 3.2, 12.6)
  pointed(win, [NX1, NY0], [NX1, NY1], yc - NY0, 2.2, AISLE + 2.6, CLER - 1.0)
  pointed(win, [NX0, NY1], [NX0, NY0], NY1 - yc, 2.2, AISLE + 2.6, CLER - 1.0)
}
// Aisle ends beside the tower, on Broadway.
for (const xc of [-11.6, 7.8]) pointed(win, [AX1, NY1], [AX0, NY1], AX1 - xc, 3.0, 6.0, 13.6)
// Chancel end: the great east window in the gable over the sacristy roof.
pointed(win, [NX0, NY0], [NX1, NY0], (NX1 - NX0) / 2, 7.0, 13.2, 25.5)
// The low chancel and sacristy block across the west end (lidar 11–20 m), and the Manning wing.
prism({ wall: stone, win: null, roof, ring: rect(AX0, -23.4, 13.0, NY0 + 0.05), z0: 0, z1: 11.5, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: rect(-14.2, -30.9, -7.7, -23.3), z0: 0, z1: 9.5, facade: null, bevel: 0.3 })
prism({ wall: stone, win: null, roof, ring: rect(-20.2, -31.0, -14.2, -23.5), z0: 0, z1: 9.5, facade: null, bevel: 0.3 })
for (const s of [3.5, 9.5, 15.5, 21.5]) pointed(win, [AX0, -23.4], [13.0, -23.4], s + 0.5, 2.0, 2.5, 8.5)

// --- Side chapels (gabled, crenellated eaves at 12 m, ridge 17 m) and the link ---
prism({ wall: stone, win: null, roof: null, ring: rect(-20.2, -23.5, AX0, 1.4), z0: 0, z1: 12, facade: null, bevel: 0.3 })
gable(-20.2, -23.5, AX0, 1.4, 12, 5, true)
prism({ wall: stone, win: null, roof: null, ring: rect(13.0, -25.5, 23.5, 0.4), z0: 0, z1: 12, facade: null, bevel: 0.3 })
gable(13.0, -25.5, 23.5, 0.4, 12, 5, true)
for (const [x0, x1] of [[13.0, 13.5], [23.0, 23.5]]) block(stone, x0, -25.5, x1, 0.4, 12, 13.1)
for (const [x0, x1] of [[-20.2, -19.7], [AX0 - 0.5, AX0]]) block(stone, x0, -23.5, x1, 1.4, 12, 13.1)
for (const [x, y] of [[13.4, 0.0], [23.1, 0.0], [13.4, -25.1], [23.1, -25.1]]) {
  prism({ wall: stone, win: null, roof: null, ring: circle(x, y, 1.1, 8), z0: 0, z1: 14, facade: null, bevel: 0.1 })
  for (let i = 0; i < 8; i++) { const r = circle(x, y, 1.15, 8); stone.tri([r[i][0], r[i][1], 14], [r[(i + 1) % 8][0], r[(i + 1) % 8][1], 14], [x, y, 17]) }
}
for (const s of [5, 12.5, 20]) {
  pointed(win, [23.5, -25.5], [23.5, 0.4], s, 2.6, 3.0, 10.5)
  pointed(win, [-20.2, 1.4], [-20.2, -23.5], s, 2.6, 3.0, 10.5)
}
prism({ wall: stone, win: null, roof, ring: rect(AX1, -16.1, 13.0, 0.4), z0: 0, z1: 12, facade: null, bevel: 0.2 })
// Porches beside the tower, with corner pinnacles.
for (const [x0, x1] of [[-19.8, AX0], [AX1, 16.2]]) {
  prism({ wall: stone, win: null, roof: null, ring: rect(x0, 16.0, x1, 23.0), z0: 0, z1: 5, facade: null, bevel: 0.2 })
  gable(x0, 16.0, x1, 23.0, 5, 2.2, false, 0.15)
  const xo = x0 < 0 ? x0 : x1
  pinnacle(xo, 16.3, 0.4, 0, 6, 8.5); pinnacle(xo, 22.7, 0.4, 0, 6, 8.5)
}

// --- The tower ---
const TX = -1.9, TY = 29.6 // centre (OSM 276175143)
const H1 = 20, H2 = 30, H3 = 41.5
prism({ wall: stone, win: null, roof: null, ring: rect(TX - 5.3, TY - 5.3, TX + 5.3, TY + 5.3), z0: 0, z1: H3, facade: null, bevel: 0.2 })
// Angle buttresses at the corners, stepping in at 20 and 30 m.
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  for (const [z0, z1, o, w] of [[0, H1, 6.8, 2.6], [H1, H2, 6.1, 2.2], [H2, H3, 5.5, 1.8]] as [number, number, number, number][]) {
    const cx = TX + sx * (o - w / 2), cy = TY + sy * (o - w / 2)
    block(stone, cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2, z0, z1)
    // weathering: a sloped cap on each stage
    const q: V3[] = [[cx - w / 2, cy - w / 2, z1], [cx + w / 2, cy - w / 2, z1], [cx + w / 2, cy + w / 2, z1], [cx - w / 2, cy + w / 2, z1]]
    for (let i = 0; i < 4; i++) stone.tri(q[i], q[(i + 1) % 4], [cx - sx * w * 0.3, cy - sy * w * 0.3, z1 + 0.9])
  }
  // Corner pinnacles, 41.5 → 55 m (OSM), octagonal shafts with tall caps.
  const px = TX + sx * 4.6, py = TY + sy * 4.6
  prism({ wall: stone, win: null, roof: null, ring: circle(px, py, 1.05, 8, Math.PI / 8), z0: H3, z1: 48, facade: null, bevel: 0.1 })
  const r = circle(px, py, 1.15, 8, Math.PI / 8)
  for (let i = 0; i < 8; i++) stone.tri([r[i][0], r[i][1], 48], [r[(i + 1) % 8][0], r[(i + 1) % 8][1], 48], [px, py, 55])
}
// Parapet round the top of the tower.
for (const [x0, y0, x1, y1] of [[-5.5, -5.5, 5.5, -4.9], [-5.5, 4.9, 5.5, 5.5], [-5.5, -5.5, -4.9, 5.5], [4.9, -5.5, 5.5, 5.5]]) block(stone, TX + x0, TY + y0, TX + x1, TY + y1, H3, H3 + 1.6)
// Openings on each face: on Broadway the door and the great window; on all
// four faces the clock (a diamond frame) and the paired belfry lancets.
const faces: [XY, XY][] = [
  [[TX + 5.3, TY + 5.3], [TX - 5.3, TY + 5.3]], // +y, Broadway
  [[TX - 5.3, TY - 5.3], [TX + 5.3, TY - 5.3]],
  [[TX + 5.3, TY - 5.3], [TX + 5.3, TY + 5.3]],
  [[TX - 5.3, TY + 5.3], [TX - 5.3, TY - 5.3]],
]
faces.forEach(([a, b], i) => {
  if (i === 0) {
    pointed(dark, a, b, 5.3, 4.0, 0.6, 9.0)
    pointed(win, a, b, 5.3, 5.4, 10.4, 22.5)
  }
  if (i >= 2) pointed(win, a, b, 5.3, 3.0, 10.5, 19.0)
  // Clock: a gilt-dark disc in a diamond frame.
  const f = wallFrame(a, b, 0.06), zc = 26.0, k = 2.5
  stone.quad(f.at(5.3, zc - k), f.at(5.3 + k, zc), f.at(5.3, zc + k), f.at(5.3 - k, zc))
  discPanel(dark, a, b, 5.3, zc, 1.6, 0.1, 12)
  pointed(win, a, b, 3.85, 2.3, 30.0, 39.3)
  pointed(win, a, b, 6.75, 2.3, 30.0, 39.3)
})
// The spire: an octagonal pyramid from 42 to 87 m (lidar 88), with four
// gabled lucarnes at its foot and a cross finial.
{
  const Z0 = 42.0, TOP = 86.5, R = 3.9
  const base = circle(TX, TY, R, 8, Math.PI / 8)
  prism({ wall: stone, win: null, roof: null, ring: base, z0: H3 - 0.5, z1: Z0, facade: null, bevel: 0.1 })
  for (let i = 0; i < 8; i++) {
    const a = base[i], b = base[(i + 1) % 8]
    const na = [a[0] - TX, a[1] - TY], nb = [b[0] - TX, b[1] - TY]
    const l = Math.hypot(na[0], na[1])
    const slope = R / (TOP - Z0)
    const n = (v: number[]): V3 => { const z = slope; const m = Math.hypot(v[0] / l, v[1] / l, z); return [v[0] / l / m, v[1] / l / m, z / m] }
    stone.tri([a[0], a[1], Z0], [b[0], b[1], Z0], [TX, TY, TOP], undefined, undefined, undefined, [n(na), n(nb), n([(na[0] + nb[0]) / 2, (na[1] + nb[1]) / 2])])
  }
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    // Lucarne: a small gabled box on the face, its front flush with the tower parapet line.
    const cx = TX + dx * 4.5, cy = TY + dy * 4.5, hw = 1.0
    const x0 = dx ? Math.min(cx, cx - dx * 2.2) : cx - hw, x1 = dx ? Math.max(cx, cx - dx * 2.2) : cx + hw
    const y0 = dy ? Math.min(cy, cy - dy * 2.2) : cy - hw, y1 = dy ? Math.max(cy, cy - dy * 2.2) : cy + hw
    block(stone, x0, y0, x1, y1, Z0, Z0 + 3.2)
    gable(x0, y0, x1, y1, Z0 + 3.2, 1.8, dx === 0, 0.05)
    const a: XY = dy > 0 ? [x1, y1] : dy < 0 ? [x0, y0] : dx > 0 ? [x1, y0] : [x0, y1]
    const b: XY = dy > 0 ? [x0, y1] : dy < 0 ? [x1, y0] : dx > 0 ? [x1, y1] : [x0, y0]
    pointed(win, a, b, hw, 0.9, Z0 + 0.6, Z0 + 3.4)
  }
  block(stone, TX - 0.12, TY - 0.12, TX + 0.12, TY + 0.12, TOP - 0.3, TOP + 1.6)
  block(stone, TX - 0.6, TY - 0.1, TX + 0.6, TY + 0.1, TOP + 0.8, TOP + 1.05)
}

finishModel('Trinity Church', 'nyc-trinity-church', [
  { part: stone, material: finish('trinity-brownstone', 0x927d73) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x57636d } },
], { bearing: 121.1, osm: 'way/278039453', height: 88 }, 5000)
