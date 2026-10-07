/**
 * Excalibur Hotel & Casino, Las Vegas: the two L-shaped hotel towers and
 * the castle with its coloured turrets. Procedural, CC0-1.0.
 * bun generators/lv-excalibur.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: the tower wings run
 * true north-south and east-west in OSM. The origin is the area centroid of
 * the resort's multipolygon, relation/8086330.
 *
 * Published (Wikipedia, "Excalibur Hotel and Casino"; Veldon Simpson,
 * 1990): 3,981 rooms in four 28-storey towers built out in a square, with a
 * castle front inspired by Neuschwanstein, a moat and a drawbridge. Height
 * 79.5 m (261 ft) to the roof (Skyscraper Center / SkyscraperPage).
 *
 * Measured, from OSM: the casino outline (relation/8086330's outer way,
 * way/403190926, simplified to 1.5 m); the two L towers (way/114859870,
 * way/114857390); the two castle blocks (way/114870395 at the Strip front,
 * way/114870398 at the back); every turret's position and radius, and its
 * building:levels, from the building:parts listed in the placement. The
 * complex is near point-symmetric about its centre, and so is the turret
 * plan: each turret on the front has a twin on the back.
 *
 * Turret colours come from the USGS NAIP orthophoto (public domain), which
 * shows the cone colours from above, matched to the photos: two big blue
 * cones either side of a red square-pyramid roof, a tall red cone and a gold
 * one behind them, the pink-red "candle" with its two corbelled drums at
 * the north end, white crenellated drums at the south end. NAIP leans tall
 * things west by up to ~15 m, so the match is by arrangement, not by pixel.
 *
 * Photos (Wikimedia Commons):
 * - "Hotel Excalibur Las Vegas.jpg", ArticCynda, CC BY-SA 4.0: a tower
 *   corner, its two blue-roofed keeps and slim red-capped turrets, the
 *   beige base with its row of small red cones, the crenellated parapet;
 * - "Excalibur Hotel and Casino.jpg", Clément Bardot, CC BY-SA 4.0, and
 *   "Las Vegas - Excalibur Hotel 02.jpg", P. Hughes, CC BY 4.0: the castle
 *   front from the Strip side, its turrets in order;
 * - "Las Vegas. Excalibur Hotel visto dal New York New York Hotel.jpg",
 *   André Corboz, CC BY-SA 4.0: the north tower and castle from above;
 * - "Excalibur Hotel turrets", Carol M. Highsmith, public domain, and
 *   "Excalibur Hotel and Casino. Las Vegas.", Bernard Spragg, CC0: cone
 *   shapes and the corbelled drums.
 *
 * Estimated: turret heights, from OSM's levels at 3.5 m and the photos
 * (the tallest cone tip ~58 m); drum and cone proportions; the castle walls
 * at 20 m and the casino podium at 12 m; the keeps rising 6 m over the
 * parapet with 8 m blue roofs; the base band at 18 m. The cones are drawn a
 * little fuller than life so they read at phone size. Left out: the moat,
 * drawbridge, arcades, signs, finials and the merlons of the hotel parapet.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { block, panel, prism, solid, type XY } from './lv-luxor'

const white = new Part() // tower walls, turret drums
const beige = new Part() // podium, base band, castle walls, roofs
const win = new Part() // window bays
const red = new Part()
const blue = new Part()
const gold = new Part()

const SEG = 12
const ring = (cx: number, cy: number, r: number, z: number, n = SEG, a0 = 0): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (2 * Math.PI * i) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as V3
  })

/** The outward normal of a surface of revolution at angle a, sloping by (dr, dz). */
const radial = (a: number, dr: number, dz: number): V3 => {
  const l = Math.hypot(dz, dr) || 1
  return [(Math.cos(a) * dz) / l, (Math.sin(a) * dz) / l, -dr / l]
}
/** A round drum from z0 to z1, smooth-shaded, flat top in `top`. */
function drum(p: Part, top: Part | null, cx: number, cy: number, r: number, z0: number, z1: number, r1 = r, n = SEG) {
  const b = ring(cx, cy, r, z0, n), t = ring(cx, cy, r1, z1, n)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const na = radial((2 * Math.PI * i) / n, r1 - r, z1 - z0), nb = radial((2 * Math.PI * j) / n, r1 - r, z1 - z0)
    p.tri(b[i], b[j], t[j], undefined, undefined, undefined, [na, nb, nb])
    p.tri(b[i], t[j], t[i], undefined, undefined, undefined, [na, nb, na])
  }
  if (top) top.cap(t, true)
}
/** A cone from radius r at z0 to a point at z1, smooth-shaded, open below. */
function cone(p: Part, cx: number, cy: number, r: number, z0: number, z1: number, n = SEG) {
  const b = ring(cx, cy, r, z0, n), tip: V3 = [cx, cy, z1]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const na = radial((2 * Math.PI * i) / n, -r, z1 - z0), nb = radial((2 * Math.PI * j) / n, -r, z1 - z0)
    // One shared normal at the tip, straight up, as a smooth cone's apex has.
    const nt: V3 = [0, 0, 1]
    p.tri(b[i], b[j], tip, undefined, undefined, undefined, [na, nb, nt])
  }
}
/** An open-bottomed box: four walls and a top. */
function box(p: Part, q: V3[], h: number) {
  const t = q.map(([x, y, z]): V3 => [x, y, z + h])
  solid(p, [q, t], false)
  // Top only: the bottom sits on something.
  const c: V3 = [(t[0][0] + t[2][0]) / 2, (t[0][1] + t[2][1]) / 2, t[0][2] - 1]
  quadOutTop(p, t, c)
}
function quadOutTop(p: Part, t: V3[], below: V3) {
  const n = (t[1][0] - t[0][0]) * (t[2][1] - t[0][1]) - (t[1][1] - t[0][1]) * (t[2][0] - t[0][0])
  if (n > 0) p.quad(t[0], t[1], t[2], t[3])
  else p.quad(t[3], t[2], t[1], t[0])
}
/** Merlons round a drum's rim. */
function crenels(p: Part, cx: number, cy: number, r: number, z: number, n = 8, h = 1.8) {
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * (i + 0.25)) / n, w = (Math.PI * r) / n * 0.9
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a)
    const ux = -Math.sin(a), uy = Math.cos(a), nx = Math.cos(a), ny = Math.sin(a), d = 0.9
    const q: V3[] = [
      [x - ux * w / 2 - nx * d, y - uy * w / 2 - ny * d, z], [x + ux * w / 2 - nx * d, y + uy * w / 2 - ny * d, z],
      [x + ux * w / 2, y + uy * w / 2, z], [x - ux * w / 2, y - uy * w / 2, z],
    ]
    box(p, q, h)
  }
}

/** Turrets are drawn this much fuller than OSM's radii, to read on a phone. */
const BOLD = 1.15

type Kind = 'cone' | 'candle' | 'crenel' | 'crenel2' | 'small'
/**
 * A turret: white drum, a corbelled collar, and a top. `tip` is the
 * overall height; the drum takes what the top leaves.
 */
function turret([cx, cy]: XY, r0: number, tip: number, kind: Kind, cap: Part = red) {
  const r = r0 * BOLD
  if (kind === 'small') {
    const z = tip - r * 2.6
    drum(white, null, cx, cy, r, 0, z)
    drum(white, null, cx, cy, r, z, z + 0.6, r * 1.25)
    cone(cap, cx, cy, r * 1.3, z + 0.6, tip, 8)
    return
  }
  if (kind === 'crenel' || kind === 'crenel2') {
    const z1 = kind === 'crenel2' ? tip - 9 : tip - 1.8
    drum(white, null, cx, cy, r, 0, z1 - 2)
    drum(white, white, cx, cy, r, z1 - 2, z1, r * 1.15)
    crenels(white, cx, cy, r * 1.15, z1, 8)
    if (kind === 'crenel2') {
      drum(white, null, cx, cy, r * 0.7, z1, tip - 3.8)
      drum(white, white, cx, cy, r * 0.7, tip - 3.8, tip - 1.8, r * 0.82)
      crenels(white, cx, cy, r * 0.82, tip - 1.8, 6)
    }
    return
  }
  if (kind === 'candle') {
    // Two corbelled drums, the upper one narrower, under a shallow hat.
    const hat = r * 1.3
    const z2 = tip - hat, z1 = z2 - 9
    drum(white, null, cx, cy, r, 0, z1 - 2.4)
    drum(white, null, cx, cy, r, z1 - 2.4, z1, r * 1.25)
    drum(white, null, cx, cy, r * 0.85, z1, z2 - 2.2)
    drum(white, null, cx, cy, r * 0.85, z2 - 2.2, z2, r * 1.2)
    cone(cap, cx, cy, r * 1.25, z2, tip)
    return
  }
  // A tall cone over a corbelled collar.
  const h = r * 2.9
  const z = tip - h
  drum(white, null, cx, cy, r, 0, z - 2.6)
  drum(white, null, cx, cy, r, z - 2.6, z, r * 1.28)
  cone(cap, cx, cy, r * 1.3, z, tip)
}

/** A square block turned 45°, with a pyramid roof: the red square roofs. */
function squareRoof(poly: XY[], zWall: number, tip: number) {
  prism(white, white, poly, 0, zWall)
  const c: V3 = [poly.reduce((s, p) => s + p[0], 0) / 4, poly.reduce((s, p) => s + p[1], 0) / 4, tip]
  // Eaves a little proud of the walls.
  const e = poly.map(([x, y]): V3 => [c[0] + (x - c[0]) * 1.12, c[1] + (y - c[1]) * 1.12, zWall])
  for (let i = 0; i < 4; i++) {
    const a = e[i], b = e[(i + 1) % 4]
    // Wind so the face points out whichever way the ring turns.
    const n = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if (n > 0) red.tri(a, b, c)
    else red.tri(b, a, c)
  }
  red.cap(e, false)
}

// ---------------------------------------------------------------- podium

const OUTER: XY[] = [
  [-84.4, -65.0], [-66.1, -81.2], [-64.1, -92.9], [-66.5, -101.1], [-78.5, -112.8], [-86.7, -115.1], [-99.1, -113.8], [-100.3, -123.3],
  [-102.9, -125.1], [-101.1, -127.7], [-86.3, -128.1], [-73.9, -125.0], [-63.2, -118.1], [-55.4, -108.0], [-51.3, -96.0], [-46.3, -96.0],
  [-44.9, -73.3], [-39.4, -70.1], [-26.6, -74.6], [-19.9, -68.1], [-15.4, -72.3], [-15.1, -88.1], [-7.9, -88.0], [-5.8, -97.4],
  [82.3, -96.4], [82.3, -94.6], [89.6, -94.6], [98.4, -86.0], [98.4, -79.2], [100.4, -79.1], [99.3, 10.4], [94.5, 10.4],
  [94.4, 13.0], [84.0, 13.2], [84.0, 10.3], [78.5, 10.3], [67.0, 20.9], [70.9, 24.8], [75.2, 20.5], [86.7, 32.0],
  [86.7, 46.5], [94.0, 53.8], [94.0, 60.2], [89.3, 64.8], [107.1, 82.5], [111.6, 81.7], [115.4, 84.3], [115.9, 89.9],
  [111.6, 93.3], [107.0, 92.4], [91.1, 107.3], [90.6, 115.4], [84.3, 117.3], [79.6, 112.8], [80.0, 108.1], [63.2, 90.7],
  [59.0, 94.7], [52.2, 94.6], [45.0, 87.1], [45.1, 80.7], [39.3, 76.9], [24.7, 76.8], [18.7, 68.1], [16.4, 70.5],
  [17.9, 72.0], [9.3, 80.7], [9.3, 83.7], [13.1, 83.7], [13.1, 94.3], [9.6, 94.3], [9.6, 98.5], [-88.0, 98.5],
  [-96.5, 89.4], [-95.6, -8.7], [-89.0, -8.4], [-88.9, -23.1], [-78.3, -22.9], [-76.4, -24.7], [-74.2, -22.6], [-74.3, -14.8],
  [-67.4, -19.9], [-75.0, -27.4], [-87.3, -26.9], [-88.7, -51.5], [-100.6, -53.1], [-111.4, -58.3], [-120.1, -66.6], [-125.8, -77.1],
  [-127.9, -88.8], [-126.2, -103.9], [-116.4, -99.4], [-113.6, -100.8], [-111.9, -98.4], [-114.7, -87.8], [-108.0, -72.4], [-101.1, -67.2],
]
const PODIUM = 12
prism(beige, beige, OUTER, 0, PODIUM)

// ---------------------------------------------------------------- hotel towers

const H = 79.5, BASE = 18, FLOOR = 79.5 / 28

/**
 * Window bays on an axis-aligned face: one broad panel per 8 m bay, four
 * floors tall, with white piers between bays and white spandrels between
 * the storey bands. The punched windows read from a distance as a light
 * grey field on a white wall, so the panels are a pale glass colour.
 */
function bays(side: 'N' | 'S' | 'E' | 'W', at: number, s0: number, s1: number) {
  const n = Math.max(1, Math.round((s1 - s0) / 8)), w = (s1 - s0) / n
  const band = FLOOR * 4
  for (let z = BASE + 1.2; z + band * 0.6 < H - 3; z += band) {
    const t = Math.min(z + band - 1.5, H - 3.6)
    for (let i = 0; i < n; i++) panel(win, side, at, s0 + i * w + 1.1, s0 + (i + 1) * w - 1.1, z, t)
  }
}
/**
 * The row of red conical turret caps along the top of the base band: 4 m
 * across, 6 m tall, about 8.5 m apart, measured against the tower in the
 * ArticCynda photo. Each stands half into the wall on the band's top.
 */
function coneRow(side: 'N' | 'S' | 'E' | 'W', at: number, s0: number, s1: number) {
  const n = Math.max(1, Math.round((s1 - s0) / 8.5)), w = (s1 - s0) / n
  for (let i = 0; i < n; i++) {
    const s = s0 + (i + 0.5) * w
    const o = side === 'N' || side === 'E' ? 1.1 : -1.1
    const [x, y] = side === 'N' || side === 'S' ? [s, at + o] : [at + o, s]
    cone(red, x, y, 2, BASE - 0.4, BASE + 5.6, 8)
  }
}
/** One wing: base band in beige, white above, bays and cones on the given faces. */
function wing(x0: number, x1: number, y0: number, y1: number, faces: ('N' | 'S' | 'E' | 'W')[], cones: ('N' | 'S' | 'E' | 'W')[]) {
  block(beige, beige, x0, x1, y0, y1, PODIUM, BASE, 0.5)
  block(white, beige, x0, x1, y0, y1, BASE, H - 2.6, 0.5)
  block(beige, beige, x0, x1, y0, y1, H - 2.6, H, 0.5) // the crenellated parapet, as a band
  for (const f of faces) {
    if (f === 'N') bays('N', y1, x0 + 1, x1 - 1)
    if (f === 'S') bays('S', y0, x0 + 1, x1 - 1)
    if (f === 'E') bays('E', x1, y0 + 1, y1 - 1)
    if (f === 'W') bays('W', x0, y0 + 1, y1 - 1)
  }
  for (const f of cones) {
    if (f === 'N') coneRow('N', y1, x0 + 2, x1 - 2)
    if (f === 'S') coneRow('S', y0, x0 + 2, x1 - 2)
    if (f === 'E') coneRow('E', x1, y0 + 2, y1 - 2)
    if (f === 'W') coneRow('W', x0, y0 + 2, y1 - 2)
  }
}
/** A keep at an outer corner: 6 m over the parapet, under a truncated blue hip roof. */
function keep(x0: number, x1: number, y0: number, y1: number) {
  block(white, white, x0, x1, y0, y1, H - 1, H + 6, 0.5)
  const z = H + 6, t = z + 8, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  const e = 0.6, k = 0.45
  const b: V3[] = [[x0 - e, y0 - e, z], [x1 + e, y0 - e, z], [x1 + e, y1 + e, z], [x0 - e, y1 + e, z]]
  const u = b.map(([x, y]): V3 => [cx + (x - cx) * k, cy + (y - cy) * k, t])
  blue.loft([b, u])
  blue.cap(u, true)
  blue.cap(b, false)
}
/** A slim round turret standing at a tower corner, with a red cone over the parapet. */
const slim = (x: number, y: number, top = H + 5) => {
  drum(white, null, x, y, 2.2, BASE, top, 2.2)
  cone(red, x, y, 2.7, top, top + 6.5, 8)
}

// Each L: two wings, a windowless corner with a chamfered face between
// two keeps, and slim turrets at the face's ends and the inner wing ends.
// North-west L.
wing(-96.2, -74.4, -23, 81.8, ['E', 'W', 'S'], ['E', 'W'])
wing(-80.5, 11, 76.3, 98.7, ['N', 'S', 'E'], ['N', 'S'])
prism(white, beige, [[-96.2, 81.8], [-80.5, 81.8], [-80.5, 98.7], [-88, 98.7], [-96.2, 90.5]], PODIUM, H + 2)
keep(-96.2, -82.2, 67.8, 81.8)
keep(-80.5, -66.5, 84.7, 98.7)
slim(-88, 98.7, H + 9); slim(-96.2, 90.5, H + 9)
slim(11, 98.7); slim(11, 76.3); slim(-96.2, -23); slim(-74.4, -23)

// South-east L.
wing(78.5, 100, -79, 10.4, ['E', 'W', 'N'], ['E', 'W'])
wing(-13.5, 82.3, -97, -74.5, ['S', 'N', 'W'], ['S', 'N'])
prism(white, beige, [[82.3, -97], [92, -97], [100, -89], [100, -79], [82.3, -79]], PODIUM, H + 2)
keep(86, 100, -79, -65)
keep(68.3, 82.3, -97, -83)
slim(92, -97, H + 9); slim(100, -89, H + 9)
slim(-13.5, -97); slim(-13.5, -74.5); slim(100, 10.4); slim(78.5, 10.4)

// ---------------------------------------------------------------- the castle

const FRONT: XY[] = [
  [34.7, 59.5], [11.3, 36.1], [21.5, 26.0], [18.5, 23.0], [35.1, 6.6], [38.3, 9.9], [45.1, 3.2], [43.5, 1.6], [49.7, -4.5],
  [57.0, 2.8], [55.7, 4.0], [60.0, 8.4], [62.4, 6.0], [72.2, 15.7], [59.0, 28.8], [64.8, 34.6], [53.7, 45.5], [51.3, 43.1],
]
const BACK: XY[] = [
  [-49.7, 5.6], [-56.0, -0.7], [-54.3, -2.4], [-60.3, -8.2], [-64.3, -4.2], [-73.8, -13.6], [-59.7, -27.7], [-65.0, -32.9], [-54.2, -43.7],
  [-52.3, -41.9], [-35.6, -58.6], [-12.1, -35.4], [-22.9, -24.6], [-19.8, -21.5], [-35.6, -5.8], [-38.5, -8.7], [-44.2, -3.0], [-42.7, -1.4],
]
const WALL = 20
for (const poly of [FRONT, BACK]) {
  prism(beige, beige, poly, 0, WALL)
  // Merlons along the long outward walls only: the rest is hidden by turrets.
}

/** Merlons along a straight wall top from a to b. */
function merlons(a: XY, b: XY, z: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(L / 4.5)
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  for (let i = 0; i < n; i++) {
    const s = (i + 0.5) * (L / n), w = 1.4
    const x = a[0] + ux * s, y = a[1] + uy * s
    const q: V3[] = [
      [x - ux * w, y - uy * w, z], [x + ux * w, y + uy * w, z],
      [x + ux * w - uy * 1, y + uy * w + ux * 1, z], [x - ux * w - uy * 1, y - uy * w + ux * 1, z],
    ]
    box(beige, q, 2)
  }
}
// The long faces toward the Strip corner and toward the back drive.
merlons([34.7, 59.5], [11.3, 36.1], WALL)
merlons([64.8, 34.6], [53.7, 45.5], WALL)
merlons([72.2, 15.7], [59.0, 28.8], WALL)
merlons([-35.6, -58.6], [-12.1, -35.4], WALL)
merlons([-73.8, -13.6], [-59.7, -27.7], WALL)
merlons([-65.0, -32.9], [-54.2, -43.7], WALL)

// Front turrets (Strip side) and their twins at the back, by OSM part.
squareRoof([[57.6, 67.6], [48.3, 58.4], [57.6, 49.1], [67.0, 58.3]], 26, 41) // way/114857408
squareRoof([[-54.3, -45.6], [-63.7, -54.8], [-54.3, -64.2], [-44.9, -54.9]], 26, 41) // way/114866100
turret([46.0, 73.7], 7.5, 47, 'cone', blue) // way/114857399
turret([72.7, 46.9], 7.5, 47, 'cone', blue) // way/114857392
turret([-44.7, -67.4], 6.6, 41, 'cone', blue) // way/114866543
turret([-67.0, -44.9], 6.6, 41, 'cone', blue) // way/114866547
turret([30.2, 34.5], 5.7, 58, 'cone', red) // way/114857376, on its square base way/114857406
turret([-35.5, -51.1], 5.2, 50, 'cone', red) // way/114871424
turret([55.4, 34.3], 5.1, 54, 'cone', gold) // way/114857395, base way/114857387
turret([-54.2, -33.4], 5.1, 54, 'cone', gold) // way/114866102, base way/114866101
turret([14.5, 63.5], 6.2, 50, 'candle', red) // way/114857381, base way/114857385
turret([-15.0, -63.2], 6.1, 50, 'candle', red) // way/114866553, base way/114866542
turret([13.8, 36.2], 6.3, 40, 'crenel2') // way/114857396
turret([-14.0, -35.3], 6.3, 40, 'crenel2') // way/114866551
turret([63.8, 14.8], 5.8, 34, 'crenel') // way/114857393, base way/114857405
turret([-63.9, -13.9], 5.8, 34, 'crenel') // way/114866549, base way/114866546
// Square bases under the paired turrets, to the base part's levels.
for (const [c, r, h] of [
  [[30.2, 34.6], 7.6, 30], [[54.4, 35.2], 8.0, 30], [[15.3, 65.4], 7.4, 28], [[62.9, 15.2], 7.6, 26],
  [[-54.9, -33.7], 8.0, 30], [[-16.1, -64.2], 7.4, 28], [[-65.3, -14.0], 7.6, 26],
] as [XY, number, number][]) {
  const s = r * 0.8
  const q: XY[] = [[c[0], c[1] - s * 1.41], [c[0] + s * 1.41, c[1]], [c[0], c[1] + s * 1.41], [c[0] - s * 1.41, c[1]]]
  prism(beige, beige, q, 0, h)
}
// The drawbridge towers by the moat, and the small towers at the back drive.
turret([59.2, 84.2], 4.9, 20, 'crenel') // way/114857379
turret([84.0, 60.3], 4.8, 20, 'crenel') // way/114857388
turret([110.7, 87.0], 5.0, 27, 'small') // way/114857398
turret([85.9, 111.3], 5.0, 27, 'small') // way/114857401
for (const c of [[-73.8, -56.2], [-114.4, -98.6], [-82.2, -64.7], [-124.7, -102.2], [-97.4, -115.3], [-100.8, -125.5], [-55.5, -74.2], [-64.2, -82.3]] as XY[])
  turret(c, 2.3, 17, 'small')

// ---------------------------------------------------------------- write

const parts = [
  { part: white, material: PALETTE.trim },
  { part: beige, material: PALETTE.stone },
  { part: win, material: windowVariant(2, 0x9fb0be) },
  { part: red, material: finish('excalibur-red', 0xcf5a4c) },
  { part: blue, material: finish('excalibur-blue', 0x5a8bcb) },
  { part: gold, material: finish('excalibur-gold', 0xcfae62) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Excalibur Hotel & Casino', parts, {
  license: 'CC0-1.0',
  height: H + 14,
  frame: 'Y up, -Z north, +X east, metres; origin at the relation/8086330 centroid; bearing 0',
})
if (glb.length > 250000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/lv-excalibur.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
