/**
 * Rio Las Vegas: the Masquerade Tower, a crescent of blue glass whose faces
 * carry the Rio's red sweeping bands, stepping up in the middle to the
 * VooDoo lounge; the red-glass Ipanema Tower, a Y of three wings; and the
 * casino podium. Procedural, CC0-1.0.
 * bun generators/lv-rio.ts
 *
 * Map frame: x east, y north, z up, metres. Bearing 0: drawn in OSM's own
 * orientation. The origin is the area centroid of the resort outline,
 * way/116876230.
 *
 * Published (Wikipedia, "Rio Las Vegas", "List of tallest buildings in Las
 * Vegas"): the Masquerade Tower, 41 storeys, 423 ft (129 m), 1997; the
 * original hotel tower of 1990, extended into its Y in the early 1990s.
 *
 * Measured, from OSM: the resort outline; the Ipanema Tower (way/27998220,
 * 74 m, 20 levels): wings to the north-west, north-east and south, each
 * about 20 m wide; the Masquerade Tower (way/27998223, tagged 129 m and
 * 41 levels): a crescent 123 m long, convex to the south, concave to the
 * north, with round ends, and its stepped crown (way/134938481, 120 m;
 * way/134938477, 130 m; way/134938479, 140 m, the VooDoo rooftop), nested
 * in the middle of the plan. USGS NAIP (public domain) confirms the plan
 * and the flat pale podium roofs.
 *
 * Photos (Wikimedia Commons):
 * - p12 "Rio Hotel and Casino new tower.jpg", Amadscientist, CC BY-SA 4.0:
 *   the Masquerade's concave north face: blue glass, a blue middle column
 *   rising into the crown, and red bands either side that run straight up
 *   for about half the height, then sweep out to the top corners, with a
 *   red band along the wing tops;
 * - p10 "Rio Hotel Vegas (7980421069).jpg", Sean MacEntee, CC BY 2.0: the
 *   convex south face with the same pattern, the stepped crown, and the
 *   red Ipanema wings either side;
 * - p1 "Rio All-Suite Hotel & Casino Las Vegas.jpg", Tomás Del Coro,
 *   CC BY-SA 2.0: the Masquerade's east end (blue, the red sweeping over
 *   its top) and the Ipanema's red glass with its frame lines;
 * - p11 "Rio Vegas.JPG", Ypsilon from Finland, CC0: the same from the east.
 *
 * Estimated: the podium at 12 m; the Masquerade's wings at the published
 * and OSM-tagged 129 m (41 storeys of about 3.05 m), and the crown steps at
 * 132, 136 and 140 m, topping out at OSM's 140 m for the VooDoo rooftop
 * (OSM's 120 m on way/134938481 would sit below the wings, so it is not
 * used; the steps' proportions are from p10); the band geometry on each
 * face, from p12 and p10; the trim lines on the Ipanema every five floors.
 * Which face p12 and p10 show is read from their curvature (p12 concave,
 * p10 convex), not from a landmark in view. Left out: the Rio sign, the
 * lettering, the VooDoo deck's railings, the pool.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, windowVariant } from './palette'
import { ccw, offset, prism, save, type XY } from './lv-venetian'

const blue = new Part()
const red = new Part()
const trim = new Part()
const roof = new Part()
const base = new Part()

const OUTLINE: XY[] = [
  [147.3, -31.4], [197.1, -30.9], [197.0, -43.6], [191.1, -50.3], [191.0, -62.1], [173.3, -80.3], [173.4, -92.2], [160.7, -105.0],
  [157.5, -101.9], [149.7, -109.9], [149.4, -113.5], [148.3, -116.3], [145.9, -118.8], [139.4, -123.4], [131.5, -127.4], [122.5, -131.1],
  [109.0, -134.9], [99.4, -136.4], [91.6, -138.7], [85.8, -138.9], [78.2, -136.8], [69.4, -135.5], [56.8, -132.3], [48.3, -129.0],
  [38.8, -124.1], [30.1, -118.9], [28.1, -116.8], [27.1, -114.7], [26.8, -112.2], [27.1, -109.8], [22.8, -105.0], [23.8, -103.9],
  [9.3, -89.0], [-38.8, -87.1], [-61.8, -87.5], [-66.5, -89.6], [-74.2, -89.6], [-78.7, -93.9], [-112.8, -94.5], [-140.3, -66.9],
  [-127.7, -54.1], [-125.6, -52.0], [-142.9, -35.0], [-144.3, -36.2], [-153.9, -36.1], [-161.3, -29.0], [-161.4, 20.9], [-143.5, 39.2],
  [-143.9, 87.5], [-137.4, 87.8], [-137.1, 98.2], [-123.4, 98.5], [-120.9, 96.1], [-115.4, 101.2], [-109.4, 95.5], [-109.4, 88.4],
  [-107.2, 86.7], [-106.9, 99.4], [-93.6, 99.5], [-87.6, 93.4], [-63.5, 93.4], [-58.1, 88.1], [-52.0, 94.2], [-29.2, 71.9],
  [-22.8, 78.4], [-12.1, 67.2], [7.1, 86.5], [-1.3, 94.7], [2.2, 98.0], [2.3, 107.2], [8.3, 107.3], [8.5, 123.7], [4.0, 123.7],
  [4.0, 146.2], [-2.4, 146.1], [-2.2, 169.7], [9.1, 169.8], [9.4, 178.9], [56.7, 178.9], [56.6, 152.9], [85.2, 152.8], [85.1, 144.0],
  [88.9, 144.0], [88.7, 124.7], [85.1, 124.6], [85.1, 74.4], [103.7, 74.4], [103.6, 55.4], [88.6, 55.4], [88.5, 47.2], [80.3, 47.2],
  [79.2, 46.1], [83.8, 41.5], [79.5, 37.1], [82.3, 34.5], [74.7, 27.0], [72.0, 29.7], [67.8, 25.6], [60.2, 33.2], [57.0, 29.7],
  [42.7, 26.1], [35.1, 18.8], [30.6, 23.1], [25.5, 17.9], [29.8, 13.6], [4.0, -13.0], [16.4, -24.8], [22.6, -24.6], [27.9, -29.7],
  [30.5, -27.2], [37.5, -34.0], [45.2, -26.5], [44.1, -25.4], [51.7, -18.0], [52.6, -18.9], [55.2, -18.0], [57.6, -17.6],
  [60.8, -18.2], [62.3, -19.3], [63.4, -18.2], [83.9, -35.9], [87.8, -39.4], [90.8, -43.0], [93.1, -47.2], [93.9, -49.2],
  [99.8, -49.3], [102.9, -46.1], [105.7, -43.8], [108.7, -42.5], [111.7, -41.8], [114.8, -41.7], [117.7, -42.4], [120.7, -43.5],
  [147.2, -43.1],
]
const IPANEMA: XY[] = [
  [-123.8, 101.1], [-51.1, 30.1], [19.5, 101.4], [35.3, 86.0], [-28.3, 21.8], [-40.4, 9.5], [-40.5, -71.2], [-60.7, -71.2],
  [-60.6, 7.4], [-139.9, 84.8],
]
// way/27998223: the Masquerade's crescent.
const LENS: XY[] = [
  [54.8, -110.7], [63.7, -113.7], [73.5, -115.6], [80.3, -116.6], [88.6, -117.0], [97.6, -116.9], [105.6, -115.2], [109.0, -114.5],
  [118.9, -111.1], [128.0, -107.0], [137.5, -101.8], [141.9, -101.5], [144.9, -103.0], [147.0, -104.8], [148.6, -107.0],
  [149.7, -109.9], [149.4, -113.5], [148.3, -116.3], [145.9, -118.8], [139.4, -123.4], [131.5, -127.4], [122.5, -131.1],
  [109.0, -134.9], [99.4, -136.4], [91.6, -138.7], [85.8, -138.9], [78.0, -136.8], [69.4, -135.5], [56.8, -132.3], [48.3, -129.0],
  [38.8, -124.1], [30.1, -118.9], [28.1, -116.8], [27.1, -114.7], [26.8, -112.2], [27.1, -109.8], [27.7, -107.3], [29.1, -105.3],
  [30.8, -103.7], [32.9, -102.7], [35.8, -102.1], [37.9, -102.2], [39.9, -102.7], [48.0, -107.5],
]
// The crown steps, way/134938481, 134938477 and 134938479.
const STEP1: XY[] = [
  [129.7, -113.6], [131.3, -115.7], [132.4, -118.7], [132.1, -122.3], [131.0, -125.1], [128.7, -127.5], [126.4, -129.5],
  [122.5, -131.1], [109.0, -134.9], [99.4, -136.4], [91.6, -138.7], [85.8, -138.9], [78.0, -136.8], [69.4, -135.5],
  [56.8, -132.3], [50.9, -130.1], [47.1, -127.7], [45.1, -125.6], [44.1, -123.4], [43.8, -120.9], [44.1, -118.5], [44.7, -116.1],
  [46.1, -114.1], [47.8, -112.4], [49.9, -111.5], [52.8, -110.8], [57.1, -111.5], [63.7, -113.7], [73.5, -115.6], [80.3, -116.6],
  [88.6, -117.0], [97.6, -116.9], [105.6, -115.2], [109.0, -114.5], [120.4, -110.4], [124.7, -110.2], [127.7, -111.8],
]
const STEP2: XY[] = [
  [69.4, -135.5], [66.3, -134.7], [63.5, -132.8], [61.5, -130.6], [60.5, -128.5], [60.1, -126.0], [60.4, -123.5], [61.0, -121.0],
  [62.5, -119.0], [64.2, -117.4], [66.3, -116.4], [69.2, -115.8], [73.5, -115.6], [80.3, -116.6], [88.6, -117.0], [97.6, -116.9],
  [105.6, -115.2], [108.4, -115.1], [111.5, -116.6], [113.5, -118.4], [115.1, -120.6], [116.2, -123.6], [115.9, -127.2],
  [114.8, -130.0], [112.4, -132.5], [109.0, -134.9], [99.4, -136.4], [91.6, -138.7], [85.8, -138.9], [78.0, -136.8],
]
const STEP3: XY[] = [
  [79.2, -117.5], [80.3, -116.6], [88.6, -117.0], [96.9, -116.9], [98.1, -117.7], [100.5, -134.0], [99.4, -136.4], [91.6, -138.7],
  [85.8, -138.9], [78.2, -136.8], [76.6, -134.4],
]

const PODIUM = 12

// ---- podium
prism(base, roof, offset(OUTLINE, -0.3), 0, PODIUM)

// ---- Ipanema: red glass, a few trim floor lines, a trim crown.
const IP_TOP = 74
prism(red, roof, IPANEMA, PODIUM, IP_TOP)
for (let z = PODIUM + 16; z < IP_TOP - 8; z += 16) prism(trim, null, offset(IPANEMA, 0.08), z, z + 0.5)
prism(trim, roof, offset(IPANEMA, 0.3), IP_TOP - 1.2, IP_TOP + 0.4)

// ---- Masquerade: the wings carry the pattern; the crown steps are blue.
const WING = 129
const XC = 88.3, HALF = 61.5 // the crescent's middle and half-length, along x
/** A band edge: at u0 up to h0, then a quarter ellipse out to u1 at h1. */
const sweep = (u0: number, u1: number, h0: number, h1: number, h: number) => {
  if (h <= h0) return u0
  const t = Math.min(1, (h - h0) / (h1 - h0))
  return u0 + (u1 - u0) * (1 - Math.sqrt(1 - t * t))
}
/**
 * Red or blue at (u, h): u from the middle (0) to the ends (1), h up the
 * wing. On the concave north face (p12) both edges of each red band sweep
 * out, so the blue middle widens toward the top and a thin red band runs
 * along the wing tops. On the convex south face (p10) the blue middle stays
 * straight, and the red rises beside it and arches over a blue "door" on
 * each wing under a deep red top band.
 */
const isRed = (u: number, h: number, north: boolean) => {
  if (north) {
    if (u < 0.22) return false
    if (h >= 0.9) return u > 0.62
    return u >= sweep(0.22, 0.62, 0.42, 0.9, h) && u <= sweep(0.45, 1.04, 0.42, 0.9, h)
  }
  if (u < 0.25) return false
  if (h >= 0.88) return true
  return u <= sweep(0.45, 0.72, 0.5, 0.88, h)
}

// Walk the crescent in short columns and stack runs of one colour on each.
{
  const ring: XY[] = []
  const lens = ccw(LENS)
  for (let i = 0; i < lens.length; i++) {
    const a = lens[i], b = lens[(i + 1) % lens.length]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 3))
    for (let k = 0; k < n; k++) ring.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  const z0 = PODIUM, z1 = WING
  const steps = 80
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const u = Math.min(1, Math.abs((a[0] + b[0]) / 2 - XC) / HALF)
    // outward normal of a counter-clockwise ring is (dy, -dx): north if dx < 0
    const north = b[0] - a[0] < 0
    const isRedHere = (h: number) => isRed(u, h, north)
    let start = 0, cur = isRedHere(0)
    const emit = (h0: number, h1: number, r: boolean) => {
      const za = z0 + (z1 - z0) * h0, zb = z0 + (z1 - z0) * h1
      ;(r ? red : blue).quad([...a, za] as V3, [...b, za] as V3, [...b, zb] as V3, [...a, zb] as V3)
    }
    for (let s = 1; s <= steps; s++) {
      const h = s / steps
      const c = isRedHere(h)
      if (c === cur && s < steps) continue
      if (c === cur) { emit(start, 1, cur); break }
      // refine the change between the last two samples
      let lo = (s - 1) / steps, hi = h
      for (let k = 0; k < 10; k++) {
        const m = (lo + hi) / 2
        if (isRedHere(m) === cur) lo = m
        else hi = m
      }
      emit(start, hi, cur)
      start = hi
      cur = c
      if (s === steps) emit(start, 1, cur)
    }
  }
  prism(new Part(), roof, LENS, WING - 0.01, WING)
  prism(trim, null, offset(LENS, 0.3), WING - 1, WING + 0.4)
}
for (const [poly, top] of [[STEP1, 132], [STEP2, 136], [STEP3, 140]] as [XY[], number][]) {
  prism(blue, roof, offset(poly, -0.4), WING, top)
  prism(trim, null, offset(poly, -0.1), top - 0.8, top + 0.3)
}

await save('lv-rio', 'Rio', [
  { part: base, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
  { part: blue, material: { ...PALETTE.window, color: 0x5470b4 } },
  { part: red, material: windowVariant(2, 0xbc5a5e) },
], 140, 'Y up, -Z north, +X east, metres; origin at the way/116876230 centroid; bearing 0')
