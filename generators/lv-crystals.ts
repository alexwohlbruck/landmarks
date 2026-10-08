/**
 * The Shops at Crystals, CityCenter, Las Vegas (Daniel Libeskind, exterior;
 * David Rockwell, interior; 2009): a low mall roofed by a pile of shattered,
 * steel-clad prisms, its tallest shards along the Strip, where they stand
 * over the storefronts as leaning crystals: Prada's dark block at the
 * north corner, the dark horn cantilevered over the entrance, the Louis
 * Vuitton crystal, the Tiffany peak and the Gucci wedge at the south end.
 * Procedural, CC0-1.0.
 * bun generators/lv-crystals.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the plan has no one
 * main axis). The origin is the area centroid of OSM way/52134608.
 *
 * Published (Wikipedia, "The Shops at Crystals"): Libeskind's exterior of
 * sharp angles and glass, "19 separate roofs, uniquely shaped and
 * overlapping in some cases"; interior ceilings up to 120 ft. OSM gives
 * height=30 for the whole outline.
 *
 * Measured:
 * - OSM way/52134608: the plan. It wraps round the foot of Veer Towers East
 *   (way/52134834), which the model steps round, so the tower keeps its
 *   own base;
 * - USGS NAIP orthophoto (public domain): where the shards are, from their
 *   sunlit and shaded facets and the shadows of their ridges: the cluster
 *   of tall shards along the Strip, two more in the middle, a long ridged
 *   band across the north, a large steep facet in the west, and the broad
 *   plane south of the middle under Veer's shadow;
 * - photos, for heights (against the 6 m storefronts and the palms): the
 *   Strip-front shards stand 26 to 33 m, the back roofs 16 to 22 m.
 *
 * Photos (Wikimedia Commons):
 * - a1 "Part of CityCenter, Las Vegas.jpg", Supercarwaar, CC BY-SA 4.0:
 *   from across the Strip, Tom Ford, Louis Vuitton, the horn and Prada;
 * - p26 "The Shops at Crystals (from across the Strip).jpg", Coolcaesar,
 *   CC BY-SA 4.0: the south half, the Tiffany peak and Louis Vuitton;
 * - a3 "Project CityCenter (2).jpg", Tristan Surtel, CC BY-SA 4.0: from
 *   high in the east, the whole roofscape;
 * - p58 "Project CityCenter in Las Vegas.jpg", Tristan Surtel, CC BY-SA
 *   4.0: the same, wider;
 * - a7 "The Veer Nima.JPG", Zereshk, CC BY-SA 3.0: the Gucci wedge from the
 *   south-east;
 * - p29 "Las Vegas Strip at The Crystals.jpg", Tristan Surtel, CC BY-SA
 *   4.0: the front from the north.
 *
 * Estimated: every height and slope (no published dimensions), the shards'
 * outlines in plan (traced from the orthophoto's light and shade), the
 * 17 m podium the back crystals rise from, the 6 m storefront band, which
 * faces of the back crystals are glazed. The model draws a dozen bold
 * crystals for the real nineteen roofs; the steel cladding's seams, the
 * Louis Vuitton pattern and the storefronts' detail are left out. The
 * building=roof canopy north of the mall (way/1422113646, over the drive)
 * is left to the map.
 *
 * The horn, Prada's perforated front and the skylight faces are one dark
 * steel-grey finish; the glazed shop faces (Tiffany, Gucci, the storefront
 * band) are `window`.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, cap, ccw, type XY } from './lv-wynn'

const steel = new Part()
const roof = new Part()
const win = new Part()
const dark = new Part()

const lift = (r: XY[], z: number) => r.map(([x, y]): V3 => [x, y, z])

// ---------------------------------------------------------------- podium
// The OSM outline, stepped round Veer Towers East's foot.
const OUTLINE: XY[] = [[-83.3, 49.2], [-77.8, 46.5], [0.1, 54.7], [-3.6, 71.3], [9.6, 66.3], [26.0, 60.1], [34.4, 56.9], [46.4, 53.1], [47.2, 55.9], [54.1, 55.7], [60.5, 59.3], [65.4, 54.9], [76.6, 60.4], [81.4, 57.6], [83.5, 33.0], [71.9, 7.8], [86.2, -14.6], [78.3, -25.4], [84.7, -53.0], [83.7, -66.8], [76.5, -65.4], [79.6, -102.5], [38.6, -83.4], [39.7, -80.2], [32.1, -73.0], [21.6, -63.6], [22.4, -75.0], [11.7, -70.4], [9.5, -30.2], [-16.8, -21.1], [-59.5, -17.5], [-77.3, -10.7], [-80.0, -5.5], [-88.8, -1.7], [-88.5, -30.9], [-110.7, -14.6], [-103.6, 7.0], [-107.3, 37.1], [-115.0, 40.3], [-110.3, 42.9], [-118.0, 45.8], [-117.4, 59.0], [-106.6, 58.9], [-106.6, 86.3], [-92.5, 86.4], [-89.3, 75.5], [-88.7, 49.1]]
const PODIUM = 17
/** The part of a ring west of x = X (Sutherland–Hodgman against one line). */
function westOf(poly: XY[], X: number): XY[] {
  const out: XY[] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]
    const ain = a[0] <= X, bin = b[0] <= X
    if (ain) out.push(a)
    if (ain !== bin) {
      const t = (X - a[0]) / (b[0] - a[0])
      out.push([X, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}
{
  // The crystals along the Strip stand on their own; the podium is the mall
  // behind them.
  const r = ccw(westOf(OUTLINE, 50))
  steel.loft([lift(r, 0), lift(r, PODIUM)])
  cap(roof, r, PODIUM)
}

// ---------------------------------------------------------------- shards
/**
 * A crystal: the convex hull of a few points — its footprint on the ground
 * or the podium, and one to four points along its top. Each facet goes to
 * the part `pick` chooses from its outward normal, steel by default; so a
 * leaning face can be glazed or dark where the real one is.
 */
type Pick = (n: V3, c: V3) => Part | undefined
function crystal(pts: V3[], pick: Pick = () => undefined) {
  const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
  const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const n = pts.length
  const centre: V3 = pts.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n, s[2] + p[2] / n], [0, 0, 0] as V3)
  const seen = new Set<string>()
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
    let nn = cross3(sub3(pts[j], pts[i]), sub3(pts[k], pts[i]))
    const l = Math.hypot(...nn)
    if (l < 1e-6) continue
    nn = [nn[0] / l, nn[1] / l, nn[2] / l]
    if (dot3(nn, sub3(centre, pts[i])) > 0) nn = [-nn[0], -nn[1], -nn[2]]
    const d = dot3(nn, pts[i])
    if (pts.some((p) => dot3(nn, p) - d > 1e-4)) continue
    const key = nn.map((v) => v.toFixed(3)).join(',') + ':' + d.toFixed(2)
    if (seen.has(key)) continue
    seen.add(key)
    // every point on this plane, ordered round their middle
    const on = pts.filter((p) => Math.abs(dot3(nn, p) - d) < 1e-4)
    const m: V3 = on.reduce((s, p) => [s[0] + p[0] / on.length, s[1] + p[1] / on.length, s[2] + p[2] / on.length], [0, 0, 0] as V3)
    const ax = (Math.abs(nn[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]) as V3
    const u = cross3(nn, ax), w = cross3(nn, u)
    on.sort((a, b) => Math.atan2(dot3(sub3(a, m), w), dot3(sub3(a, m), u)) - Math.atan2(dot3(sub3(b, m), w), dot3(sub3(b, m), u)))
    const part = pick(nn, m) ?? steel
    for (let q = 1; q < on.length - 1; q++) {
      const a = on[0], b = on[q], c = on[q + 1]
      if (dot3(cross3(sub3(b, a), sub3(c, a)), nn) >= 0) part.tri(a, b, c)
      else part.tri(a, c, b)
    }
  }
}
const at = (r: XY[], z: number): V3[] => r.map(([x, y]) => [x, y, z])

// Along the Strip, north to south: a continuous wall of crystals 25 to 32 m
// tall. Each stands on a 6 m band of storefronts, then leans back in
// broad sloping facets to its ridge or peak.
const SHOP = 6
const front = (base: XY[], tops: V3[], pick?: Pick) => {
  crystal([...at(base, 0), ...at(base, SHOP), ...tops], pick)
  // the storefront glass on the band's street faces
  const r = ccw(base)
  for (let i = 0; i < r.length; i++) {
    const a = r[i], b = r[(i + 1) % r.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n: XY = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]
    if (n[0] < 0.35 && n[1] > -0.6) continue
    if (L < 5) continue
    const t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]
    const P = (u: number, z: number): V3 => [a[0] + t[0] * u + n[0] * 0.06, a[1] + t[1] * u + n[1] * 0.06, z]
    win.quad(P(1.2, 0.3), P(L - 1.2, 0.3), P(L - 1.2, SHOP - 0.6), P(1.2, SHOP - 0.6))
  }
}
// Prada: its dark perforated front upright to 15 m, then a steel slab
// leaning back to a tilted top.
front([[46.4, 53.1], [40, 35], [52, 12], [71.9, 7.8], [83.5, 33.0], [81.4, 57.6], [60.5, 59.3]],
  [[71.9, 7.8, 15], [83.5, 33.0, 15], [81.4, 57.6, 15], [76, 54, 26], [77, 33, 27.5], [67, 12, 26], [48, 50, 22], [43, 35, 22], [54, 15, 23]],
  (n) => (n[0] > 0.3 && Math.abs(n[2]) < 0.2 ? dark : undefined))
// The horn: a dark wedge over the entrance between Louis Vuitton and Prada,
// its underside lifting from 13 m by Louis Vuitton to a point 35 m up over
// Prada's corner, past the street face (a1).
crystal([[56, -4, 12], [78, -1, 12], [81, 6, 16], [82, 24, 35], [66, 24, 33], [52, 6, 22], [56, 14, 27]], () => dark)
// Louis Vuitton: the tallest crystal, at the street corner, its face
// standing nearly upright.
front([[55, -27], [78.3, -25.4], [86.2, -14.6], [71.9, 7.8], [56, 4]],
  [[84, -14.5, 32], [76, -23.5, 30], [69.5, 5, 28], [58, -24, 26], [58, 1, 25]])
// Tiffany's peak, and the slope down from it over Fendi and Tom Ford to
// Louis Vuitton's foot; glazed to the street at the peak.
front([[52, -64], [76.5, -65.4], [83.7, -66.8], [84.7, -53.0], [78.3, -25.4], [55, -30]],
  [[77, -59, 31], [70, -38, 23], [58, -33, 21], [57, -60, 23]],
  (n, c) => (n[0] > 0.4 && Math.abs(n[2]) < 0.75 && c[1] < -42 && c[2] > SHOP ? win : undefined))
// Gucci and Dolce & Gabbana: the wedge at the south corner, its top rising
// to the point at the street, its dark glazed face to the south-west leaning
// out over the pavement as it rises (a7).
front([[38.6, -83.4], [79.6, -102.5], [76.5, -65.4], [52, -62], [42, -70]],
  [[81, -105.5, 28.5], [72, -69, 26], [44.5, -87, 21], [52, -69, 19]],
  (n, c) => (n[1] < -0.55 && Math.abs(n[2]) < 0.6 && c[2] > SHOP ? win : undefined))

// Behind them the roof is a broad grey plain at the podium's height, with
// crystals rising from it: ridged prisms and peaks, some glazed as
// skylights on the faces to the south-west (dark, as they read by day).
const sky: Pick = (n) => (n[0] + n[1] < -0.55 && n[2] > 0.2 && n[2] < 0.9 ? dark : undefined)
const P0 = PODIUM - 0.5
crystal([...at([[-12, -16], [26, -22], [36, 12], [8, 30], [-18, 10]], P0), [12, 6, 31], [26, -12, 27]], sky)
crystal([...at([[8, 24], [44, 20], [55, 44], [28, 52], [6, 40]], P0), [32, 37, 29]], sky)
crystal([...at([[-60, -14], [-20, -18], [-14, 16], [-44, 28], [-62, 14]], P0), [-44, 6, 27], [-24, 0, 28]], sky)
crystal([...at([[28, -30], [52, -30], [52, 0], [38, 8]], P0), [45, -12, 29]], sky)
// The north band: a long prism, its ridge running east–west.
crystal([...at([[-78, 31], [-20, 26], [40, 40], [46.4, 53.1], [0.1, 54.7], [-77.8, 46.5]], P0), [-70, 42, 23], [0, 48, 26], [36, 46, 24]])
// The west: the large steep facet that catches the afternoon sun.
crystal([...at([[-104, -6], [-62, -14], [-55, 30], [-88, 40]], P0), [-80, 24, 29]])
// South of the middle, under Veer's shadow: a broad hipped roof.
crystal([...at([[11.7, -70.4], [22.4, -75.0], [32.1, -73.0], [38.6, -83.4], [50, -66], [55, -50], [55, -27], [9.5, -30.2]], P0), [35, -52, 27], [22, -40, 25]])

const parts = [
  { part: steel, material: finish('crystals-steel', 0xd6d9db) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: dark, material: finish('crystals-dark', 0x5a5f66) },
]
if (import.meta.main) {
  await save('lv-crystals', 'The Shops at Crystals', parts, 35, 'Y up, -Z north, +X east, metres, origin at ground')
}
