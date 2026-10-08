/**
 * David N. Dinkins Manhattan Municipal Building, 1 Centre Street —
 * procedural, CC0-1.0, no textures.
 * bun generators/nyc-municipal-building.ts
 *
 * Map frame: x = model east (Park Row / Brooklyn Bridge side), y = model
 * north, z up, metres. The court and the colonnade face model west, onto
 * Centre Street and City Hall. Placed at bearing 36°, the axis of the long
 * walls. Anchor: area centroid of the OSM multipolygon relation/13625437.
 *
 * Evidence
 * - OSM relation/13625437: the outer ring (a 54 × 119 m slab whose east
 *   side is cut back on two long diagonals) and the inner ring, the court;
 *   building:parts 214744070 (the slab), 1016693502 (the 25 m colonnade
 *   screen across the court's mouth), 1016693500/214744075 (tagged as
 *   pyramidal roofs on the wing ends; the photos show a flat roof with a
 *   balustrade, which is drawn), 214744073/074/071/072/081/077 (the tower's
 *   square stage, octagonal stage, colonnaded drum, lantern and statue) and
 *   214744080–090 (the four corner turrets and their spires).
 * - Lidar: USGS 3DEP NY_NewYorkCity, flown 2017, resampled into the model
 *   frame: the slab's roof 107–114 m (the middle higher than the wings; ~117 m
 *   spots on the wing ends, rooftop plant), the colonnade 24–25 m, the court open to
 *   the ground, the tower stages ~128–133, ~142–147 and ~162–163 m, the
 *   lantern to ~170 m and the statue's top ~179 m.
 * - Published: 177 m to the top of Civic Fame, 40 floors, McKim, Mead &
 *   White (William M. Kendall), 1914 (Wikipedia; NRHP 72000883). Granite
 *   and warm cream limestone; a Corinthian colonnade with a central arch over Chambers
 *   Street; the gilded copper statue Civic Fame by Adolph Weinman.
 * - Photos (Wikimedia Commons): /tmp/city/nyc/work/nyc-municipal-building/photos/credits.txt
 *
 * Estimated: the column count and spacing of the screen and the drum; the
 * arch's size (about four storeys, photos); the statue, drawn as a bold
 * gilded figure on a gilded plinth, its top at ~180.5 m (lidar ~179); the
 * panel rhythm (pairs of windows between pilasters, three floors a panel).
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, type Facade, prism, chamferRect, finishModel, spire, circle, quadN, unit } from './nyc-570-lexington'

const stone = new Part(), win = new Part(), roof = new Part(), gold = new Part(), dark = new Part()

const SLAB = 108, ATTIC = 113
const fac: Facade = { bay: 4.2, ratio: 0.52, floor: 3.3, group: 2, spandrel: 2.0, sill: 1.6, head: 17, ground: 7, minLength: 3.5, margin: 0.5 }

// The slab: the outline with the court cut out of its west side (a U).
const U: XY[] = [
  [-23.5, -60.0], [3.9, -59.9], [3.9, -58.2], [27.6, -24.2], [29.4, -24.1], [29.3, -12.0], [30.6, -11.9],
  [30.6, 2.6], [30.3, 16.9], [29.2, 16.9], [29.1, 29.5], [27.5, 29.5], [3.0, 57.7], [3.0, 58.8], [-23.8, 58.7],
  [-23.7, 31.6], [-13.5, 31.7], [-7.2, 23.6], [-7.1, -24.3], [-13.1, -32.8], [-23.5, -32.9],
]
prism({ wall: stone, win, roof, ring: U, z0: 0, z1: SLAB, facade: fac, bevel: 0.5 })
// Heavy cornice a storey under the roof, all round the outside.
{
  const ring = U.map(([x, y]) => [x, y] as XY)
  // Push each vertex out 0.6 m along its bisector (the ring is clockwise here; prism handles either).
  let s = 0
  for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; s += a[0] * b[1] - b[0] * a[1] }
  const ccw = s > 0 ? ring : ring.slice().reverse()
  const out = ccw.map((b, i) => {
    const a = ccw[(i + ccw.length - 1) % ccw.length], c = ccw[(i + 1) % ccw.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] + (u[0] + v[0]) * 0.6 / k, b[1] + (u[1] + v[1]) * 0.6 / k] as XY
  })
  prism({ wall: stone, win: null, roof: stone, ring: out, z0: SLAB - 6, z1: SLAB - 4.6, facade: null, bevel: 0.4 })
}
// The upper colonnade under the cornice: three storeys of tall dark
// openings between columns, one per bay, all round (the dark band in the
// Brooklyn Bridge photos); and a string course over the three-storey
// base.
{
  let s2 = 0
  for (let i = 0; i < U.length; i++) { const a = U[i], b = U[(i + 1) % U.length]; s2 += a[0] * b[1] - b[0] * a[1] }
  const ccw = s2 > 0 ? U : U.slice().reverse()
  for (let i = 0; i < ccw.length; i++) {
    const a = ccw[i], b = ccw[(i + 1) % ccw.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 6) continue
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const count = Math.round((L - 1.6) / 4.2), pitch = (L - 1.6) / count, w = pitch * 0.66
    const v = (sv: number, z: number): V3 => [a[0] + ux * sv + nx * 0.05, a[1] + uy * sv + ny * 0.05, z]
    for (let k = 0; k < count; k++) {
      const c = 0.8 + pitch * (k + 0.5)
      dark.quad(v(c - w / 2, SLAB - 15.5), v(c + w / 2, SLAB - 15.5), v(c + w / 2, SLAB - 7.2), v(c - w / 2, SLAB - 7.2))
    }
  }
  const band = ccw.map((b, i) => {
    const a = ccw[(i + ccw.length - 1) % ccw.length], c = ccw[(i + 1) % ccw.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] + (u[0] + v[0]) * 0.35 / k, b[1] + (u[1] + v[1]) * 0.35 / k] as XY
  })
  prism({ wall: stone, win: null, roof: stone, ring: band, z0: 18.6, z1: 19.6, facade: null, bevel: 0.3 })
  prism({ wall: stone, win: null, roof: stone, ring: band, z0: SLAB - 17, z1: SLAB - 16.2, facade: null, bevel: 0.3 })
}
// The roof is flat, its middle a little higher (lidar 113–114 m against
// 107–110 m on the wings), edged with a balustrade.
prism({ wall: stone, win: null, roof, ring: [[-6.5, -26], [26.5, -24], [26.5, 28], [-6.5, 26]], z0: SLAB, z1: ATTIC, facade: null, bevel: 0.4 })
{
  let s3 = 0
  for (let i = 0; i < U.length; i++) { const a = U[i], b = U[(i + 1) % U.length]; s3 += a[0] * b[1] - b[0] * a[1] }
  const ccw = s3 > 0 ? U : U.slice().reverse()
  const inset = (d: number) => ccw.map((b, i) => {
    const a = ccw[(i + ccw.length - 1) % ccw.length], c = ccw[(i + 1) % ccw.length]
    const u = unit([b[1] - a[1], a[0] - b[0], 0]), v = unit([c[1] - b[1], b[0] - c[0], 0])
    const k = 1 + u[0] * v[0] + u[1] * v[1]
    return [b[0] - (u[0] + v[0]) * d / k, b[1] - (u[1] + v[1]) * d / k] as XY
  })
  const o = inset(0.5), i2 = inset(1.0), zt = SLAB + 1.4
  for (let i = 0; i < o.length; i++) {
    const j = (i + 1) % o.length
    stone.quad([o[i][0], o[i][1], SLAB], [o[j][0], o[j][1], SLAB], [o[j][0], o[j][1], zt], [o[i][0], o[i][1], zt])
    stone.quad([i2[j][0], i2[j][1], SLAB], [i2[i][0], i2[i][1], SLAB], [i2[i][0], i2[i][1], zt], [i2[j][0], i2[j][1], zt])
    stone.quad([o[i][0], o[i][1], zt], [o[j][0], o[j][1], zt], [i2[j][0], i2[j][1], zt], [i2[i][0], i2[i][1], zt])
  }
}

// The colonnade screen across the court (way/1016693502, 25 m): Corinthian
// columns, an entablature, and at its middle, on the Centre Street front, the
// great arch through which Chambers Street passed: a tall semicircular arch
// (about four storeys) in a solid central bay.
{
  const x0 = -23.6, x1 = -20.8, y0 = -32.8, y1 = 31.6, H = 25
  const ym = (y0 + y1) / 2, BAY = 8.0
  prism({ wall: stone, win: null, roof: stone, ring: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0: 19, z1: H, facade: null, bevel: 0.35 })
  // Back wall of the screen, set behind the columns.
  prism({ wall: stone, win: null, roof: null, ring: [[x0 + 1.4, y0], [x1, y0], [x1, y1], [x0 + 1.4, y1]], z0: 0, z1: 19, facade: null, bevel: 0.2 })
  const n = 16, pitch = (y1 - y0) / n
  for (let k = 0; k <= n; k++) {
    const y = y0 + k * pitch
    if (Math.abs(y - ym) < BAY + 0.5) continue // the arch bay
    prism({ wall: stone, win: null, roof: null, ring: circle(x0 + 0.75, Math.min(y1 - 0.75, Math.max(y0 + 0.75, y)), 0.7, 8), z0: 0, z1: 19, facade: null, bevel: 0.1 })
  }
  // Dark openings between the columns on the back wall.
  for (let k = 0; k < n; k++) {
    const ya = y0 + k * pitch + 0.9, yb = y0 + (k + 1) * pitch - 0.9
    if (yb > ym - BAY - 0.5 && ya < ym + BAY + 0.5) continue
    dark.quad([x0 + 1.35, yb, 1], [x0 + 1.35, ya, 1], [x0 + 1.35, ya, 15], [x0 + 1.35, yb, 15])
  }
  // The arch bay: a solid block flush with the column fronts, rising into
  // the entablature, with the arch cut as a dark opening on its face.
  prism({ wall: stone, win: null, roof: stone, ring: [[x0 - 0.3, ym - BAY], [x1, ym - BAY], [x1, ym + BAY], [x0 - 0.3, ym + BAY]], z0: 0, z1: H + 2, facade: null, bevel: 0.35 })
  archOpening(x0 - 0.35, ym, 5.0, 19.5, -1)
}

/** A semicircular-headed dark opening on a wall facing ±x at x, centred on y. */
function archOpening(x: number, y: number, r: number, top: number, side: 1 | -1) {
  const spring = top - r, segs = 10
  const pts: XY[] = [[y - r, 0], [y + r, 0], [y + r, spring]]
  for (let i = 1; i < segs; i++) { const a = (i / segs) * Math.PI; pts.push([y + r * Math.cos(a), spring + r * Math.sin(a)]) }
  pts.push([y - r, spring])
  // Fan from the centre of the springing line.
  const c: XY = [y, spring * 0.6]
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const A: V3 = [x, a[0], a[1]], B: V3 = [x, b[0], b[1]], C: V3 = [x, c[0], c[1]]
    if (side > 0) dark.tri(C, A, B); else dark.tri(C, B, A)
  }
}

// --- The tower ---
const cx = 5.9, cy = 0.8
// Square stage (way/214744073, 107–123 m; lidar to ~128 with its parapet).
const T1 = 12.4
const tfac: Facade = { bay: 3.4, ratio: 0.5, floor: 3.4, group: 2, spandrel: 1.6, sill: 1.6, head: 2.2, minLength: 3, margin: 0.4 }
prism({ wall: stone, win, roof, ring: chamferRect(cx - T1, cy - T1 - 1, cx + T1, cy + T1 + 1, 3.6), z0: ATTIC, z1: 127, facade: tfac, bevel: 0.45 })
// Four corner turrets with spired caps (214744080–090).
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const px = cx + sx * 9.5, py = cy + sy * 10.3
  prism({ wall: stone, win, roof: stone, ring: circle(px, py, 2.9, 10, Math.PI / 10), z0: 127, z1: 137.5, facade: { ...tfac, bay: 2.2, ratio: 0.45, group: 2, floor: 3, minLength: 1.4, margin: 0.2 }, bevel: 0.25 })
  spire(stone, circle(px, py, 2.5, 10, Math.PI / 10), 137.5, [px, py, 145.5], true)
}
// Octagonal stage (214744074, 123–149 m) with tall arched openings.
const T2 = 9.2
const oct = chamferRect(cx - T2, cy - T2, cx + T2, cy + T2, 3.6)
prism({ wall: stone, win, roof, ring: oct, z0: 127, z1: 148, facade: { ...tfac, group: 3, bay: 3.0, ratio: 0.42, sill: 2.0, head: 2.5 }, bevel: 0.45 })
prism({ wall: stone, win: null, roof, ring: chamferRect(cx - T2 - 0.4, cy - T2 - 0.4, cx + T2 + 0.4, cy + T2 + 0.4, 3.75), z0: 148, z1: 149.5, facade: null, bevel: 0.35 })
// Pinnacles on the octagon's corners.
for (const p of oct) spire(stone, circle(p[0] + (p[0] > cx ? -0.6 : 0.6), p[1] + (p[1] > cy ? -0.6 : 0.6), 0.55, 4), 149.5, [p[0] + (p[0] > cx ? -0.6 : 0.6), p[1] + (p[1] > cy ? -0.6 : 0.6), 152.5])

// Colonnaded drum (214744071, 149–165 m): a dark-windowed core inside a ring
// of columns, a stylobate and an entablature with a balustrade.
const R = 6.6
prism({ wall: stone, win: null, roof: null, ring: circle(cx, cy, R + 0.3, 16), z0: 149.5, z1: 151, facade: null, bevel: 0.2 })
prism({ wall: stone, win: dark, roof: null, ring: circle(cx, cy, R - 1.6, 12), z0: 151, z1: 162, facade: { bay: 2.6, ratio: 0.5, floor: 3.6, group: 3, spandrel: 0, sill: 0.8, head: 0.8, minLength: 1.5 }, bevel: 0.1 })
for (let i = 0; i < 12; i++) {
  const a = (i + 0.5) * Math.PI / 6
  prism({ wall: stone, win: null, roof: null, ring: circle(cx + (R - 0.4) * Math.cos(a), cy + (R - 0.4) * Math.sin(a), 0.42, 6), z0: 151, z1: 162, facade: null, bevel: 0.05 })
}
prism({ wall: stone, win: null, roof, ring: circle(cx, cy, R + 0.2, 16), z0: 162, z1: 164.8, facade: null, bevel: 0.3 })
// Upper drum, cupola and the statue's plinth (214744072/081, to 176.8 m).
prism({ wall: stone, win, roof, ring: circle(cx, cy, 4.0, 12), z0: 164.8, z1: 168.8, facade: { bay: 2.1, ratio: 0.4, floor: 3.4, group: 1, spandrel: 0, sill: 1.0, head: 1.0, minLength: 1.2 }, bevel: 0.25 })
{
  const rings: V3[][] = [4.0, 3.6, 2.6, 1.4, 0.9].map((r, i) => circle(cx, cy, r, 12).map(([x, y]) => [x, y, [168.8, 169.8, 171.0, 171.9, 172.4][i]] as V3))
  stone.loft(rings)
  stone.cap(rings[rings.length - 1], true)
}

// Civic Fame: a gilded standing figure, arms raised holding a crown
// (published 25 ft, 7.6 m), on a gilded globe-like plinth, drawn as a bold
// gold mass so it reads on the map: a draped body, a head, raised arms and
// the crown.
{
  const z0 = 172.4
  prism({ wall: gold, win: null, roof: gold, ring: circle(cx, cy, 1.25, 10), z0, z1: z0 + 0.9, facade: null, bevel: 0.2 })
  const body: V3[][] = [[1.2, 0.9], [1.0, 2.6], [0.8, 4.4], [0.62, 5.6], [0.45, 6.0]].map(([r, z]) => circle(cx, cy, r, 10).map(([x, y]) => [x, y, z0 + z] as V3))
  gold.loft(body); gold.cap(body[body.length - 1], true)
  prism({ wall: gold, win: null, roof: gold, ring: circle(cx, cy, 0.42, 8), z0: z0 + 6.0, z1: z0 + 6.8, facade: null, bevel: 0.08 })
  for (const sgn of [-1, 1]) {
    const sh = (dz: number): V3 => [cx + sgn * 0.6, cy, z0 + 5.5 + dz]
    const hd = (dz: number): V3 => [cx + sgn * 0.45, cy, z0 + 7.6 + dz]
    const t = 0.22
    const ring0: V3[] = [[sh(0)[0] - t, cy - t, sh(0)[2]], [sh(0)[0] + t, cy - t, sh(0)[2]], [sh(0)[0] + t, cy + t, sh(0)[2]], [sh(0)[0] - t, cy + t, sh(0)[2]]]
    const ring1: V3[] = ring0.map(([x, y]) => [x - sh(0)[0] + hd(0)[0], y, hd(0)[2]] as V3)
    gold.loft([ring0, ring1]); gold.cap(ring1, true)
  }
  prism({ wall: gold, win: null, roof: gold, ring: circle(cx, cy, 0.75, 10), z0: z0 + 7.5, z1: z0 + 8.1, facade: null, bevel: 0.1 })
}

finishModel('Manhattan Municipal Building', 'nyc-municipal-building', [
  { part: stone, material: finish('municipal-limestone', 0xecdcc0) },
  { part: win, material: PALETTE.window },
  { part: roof, material: PALETTE.roof },
  { part: gold, material: finish('municipal-gilt', 0xd9b46c) },
  { part: dark, material: { ...PALETTE.window, name: 'window-2', color: 0x5f6f7c } },
], { bearing: 36, osm: 'relation/13625437', height: 180.5 }, 6500)
