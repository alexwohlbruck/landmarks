/**
 * New York-New York Hotel and Casino, Las Vegas: procedural, CC0-1.0.
 *   bun generators/lv-new-york-new-york.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0. Coordinates are written
 * in a park frame about lon -115.1745, lat 36.1021 (the same frame as
 * lv-big-apple-coaster.ts) and shifted at the end so the origin is the
 * centroid of the casino outline (way/115661793), on the ground. The Strip
 * is flat here.
 *
 * What it draws: the skyline replica of about a dozen towers at roughly a
 * third of the size of their New York originals, standing on the two-storey
 * casino; the replica Statue of Liberty at the Strip-Tropicana corner, the
 * Brooklyn Bridge walkway along the Strip, the brick "Ellis Island" front
 * with its two teal domes, the columned main entrance, the white rotunda, and
 * the 222 ft sign pylon. The Big Apple Coaster is a separate model
 * (lv-big-apple-coaster); nothing here stands where its track runs: the casino
 * roof under the track on the Strip side is 11 m up and the track never comes
 * below 13 m over it, and every front building is checked against the
 * coaster's centreline.
 *
 * Evidence.
 * - OSM: the casino outline way/115661793 and its building:parts, which are
 *   the tower footprints used here as drawn (way/115661791 … 115661807).
 *   Only the Empire State replica has a height tag (161 m); the others carry
 *   building:levels, which at 3.3 m a floor agree with the photos to within a
 *   few metres, and were adjusted to the photos where they did not.
 * - Published: Wikipedia (New York-New York Hotel and Casino): the Empire
 *   State replica is 47 storeys and 529 ft (161 m); the Statue of Liberty
 *   replica is 150 ft (46 m); the Brooklyn Bridge replica is 300 ft long; the
 *   sign rises 222 ft (68 m); the skyline is about a third of real size.
 * - Photos (Wikimedia Commons), used for every tower's colour, crown and
 *   relative height: "Las Vegas New York New York 2013" (Tuxyso, CC BY-SA
 *   3.0) and "New York New York Hotel and Casino in Las Vegas" (Jbro1186,
 *   CC BY-SA 4.0), from the south-east corner; "New York New York Las Vegas
 *   December 2013" (King of Hearts, CC BY-SA 3.0) and "NewYork-NewYork.JPG"
 *   (Kris Ziel, CC BY 3.0), from the west; "Las Vegas Hotel New York, New
 *   York 01" (Miguel Hermoso Cuesta, CC BY-SA 3.0), from the south-west;
 *   "New York, New York hotel, Las Vegas" (Clément Bardot, CC BY-SA 4.0),
 *   from the Strip; "Big Apple Coaster 1" (Jeremy Thompson, CC BY 2.0), from
 *   the north-east; "New York New York Hotel - Las Vegas (9227754702)" (Joao
 *   Carlos Medau, CC BY 2.0), the bridge.
 * - USGS NAIP orthophoto (public domain) for the plan of the front and the
 *   pale roofs; the towers lean too far in it to measure.
 *
 * Which tower is which, matched between the south-east and west photos:
 *   802 teal glass slab (south-west end), 105 m
 *   796 Empire State: shaft to 132 m, three setbacks, mast to 161 m
 *   805 magenta-maroon curtain wall, 114 m
 *   798 salmon tower with a stepped crown, 128 m
 *   801 blue-and-white banded tower, 106 m
 *   795 dark glass tower, 100 m;  797 green glass slab, 84 m
 *   799 tan tower with a stepped top, 120 m
 *   791 dark bronze slab (the Seagram), 100 m
 *   792 + 807 Chrysler: shaft to 98 m, the cross-plan stage to 110 m, five
 *     arched tiers to 129 m and the needle to 143 m (estimated; the photos
 *     put its tip a little under nine-tenths of the Empire State's)
 *   800 tan slab at the north end, 96 m
 * Estimated, not in OSM: the white Municipal Building replica (12 m square,
 * 78 m to its cupola) east of the tan tower, placed from the south-east and
 * west photos; the rotunda on part 803 (the 6-level part); the front
 * buildings' depths; the bridge towers' positions (a third and two-thirds of
 * the OSM bridge way/1419902125) and height (22 m, from the bridge photo);
 * the statue's pedestal (about a third of its 46 m, from the photos). The
 * yellow gabled tower seen only from the west, and the low facades of the
 * Strip front, are left out.
 *
 * Style: six materials. Towers in stone or a salmon-tan finish carry slate
 * window panels, one per bay over five or six floors; the curtain-wall towers
 * are their glass colour (maroon, teal, dark slate) with pale floor bands.
 * The statue is a simple bold figure in patina, which also covers the domes
 * and the main entrance roof.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const stone = new Part() // ESB, Chrysler, Municipal, casino, pedestals, roofs
const rose = new Part() // salmon/tan towers, the brick front, the bridge
const win = new Part() // slate windows, dark glass towers, the sign's screens
const maroon = new Part() // the magenta-maroon curtain wall (window-2)
const teal = new Part() // teal and green glass, blue bands (window-3)
const patina = new Part() // the statue, domes, the entrance roof

// The casino outline's centroid, the model origin (park frame).
const ANCHOR: XY = [4.97, 13.43]

// ------------------------------------------------------------------ OSM ----
const OUTLINE: XY[] = [
  [55.8, -106.6], [55.7, -84.6], [51.8, -84.5], [51.8, -78.0], [55.6, -78.0], [62.5, -84.3], [59.4, -87.7], [64.6, -93.1], [90.3, -67.1],
  [95.7, -67.2], [95.7, -56.2], [95.8, -46.2], [89.0, -46.1], [89.0, -26.5], [82.1, -26.4], [81.9, -2.6], [79.9, -2.6], [79.9, 7.5],
  [78.6, 7.5], [78.9, 33.1], [83.7, 33.1], [83.7, 37.3], [85.6, 37.4], [85.6, 49.8], [84.1, 49.8], [84.2, 60.5], [82.8, 60.5],
  [82.7, 69.7], [80.8, 69.8], [80.8, 85.2], [83.9, 85.2], [83.9, 91.5], [84.0, 115.3], [62.7, 115.5], [19.5, 115.6], [14.8, 115.6],
  [11.4, 115.6], [11.4, 118.5], [-3.3, 118.6], [-3.4, 115.7], [-6.9, 115.7], [-21.2, 115.8], [-93.6, 44.8], [-86.1, 37.2], [-89.4, 34.0],
  [-96.6, 27.0], [-91.6, 21.9], [-93.2, 20.4], [-86.6, 14.0], [-85.3, 15.3], [-83.5, 13.5], [-78.3, 18.7], [-74.3, 14.7], [-70.2, 18.7],
  [-67.6, 16.0], [-81.6, 2.1], [-74.4, -5.8], [-90.3, -21.2], [-87.3, -24.5], [-112.4, -48.7], [-104.2, -57.0], [-101.8, -59.2], [-68.2, -59.9],
  [-60.0, -51.6], [-31.7, -51.8], [-31.7, -62.2], [-31.7, -70.0], [-31.9, -82.0], [-27.9, -82.0], [-27.9, -86.2], [-28.0, -94.9], [-5.7, -94.9],
  [-5.7, -86.4], [-5.7, -82.4], [-1.5, -82.3], [-1.4, -69.2], [-1.4, -62.1], [-1.4, -59.1], [-3.1, -59.1], [-3.0, -51.7], [15.8, -51.8],
  [19.0, -54.5], [14.8, -58.9], [37.4, -82.3], [37.4, -84.5], [37.3, -106.7], [45.9, -106.7],
]
const P: Record<string, XY[]> = {
  '791': [[-16.9, 61.7], [-7.8, 61.6], [4.7, 61.5], [4.9, 76.4], [-1.8, 76.5], [-1.8, 83.5], [-13.4, 83.5], [-16.6, 83.6]],
  '792': [[-13.3, 99.6], [-13.4, 83.5], [-1.8, 83.5], [8.0, 83.4], [8.1, 99.5], [-7.2, 99.6]],
  '795': [[-19.0, 45.5], [-19.1, 37.3], [-24.2, 31.7], [-34.8, 42.1], [-35.9, 43.2], [-36.0, 45.6]],
  '796': [[-80.0, -21.3], [-64.0, -37.6], [-45.6, -19.7], [-62.3, -3.5]],
  '797': [[-7.9, 45.5], [-7.9, 33.3], [-16.9, 24.5], [-19.6, 27.2], [-24.2, 31.7], [-19.1, 37.3], [-19.0, 45.5]],
  '798': [[-36.6, 26.8], [-38.9, 24.5], [-49.9, 13.6], [-36.4, 0.2], [-34.4, -1.8], [-20.9, 11.6], [-28.2, 18.8], [-25.1, 21.8], [-28.2, 24.9], [-31.4, 21.7]],
  '799': [[-35.9, 61.8], [-36.0, 45.6], [-19.0, 45.5], [-7.9, 45.5], [-7.8, 61.6], [-16.9, 61.7]],
  '800': [[14.7, 99.5], [14.8, 115.6], [11.4, 115.6], [11.4, 118.5], [-3.3, 118.6], [-3.4, 115.7], [-6.9, 115.7], [-7.2, 99.6], [8.1, 99.5]],
  '801': [[-34.8, 42.1], [-46.0, 31.4], [-38.9, 24.5], [-36.6, 26.8], [-31.4, 21.7], [-28.2, 24.9], [-25.1, 21.8], [-19.6, 27.2], [-24.2, 31.7]],
  '802': [[-70.5, -31.3], [-80.8, -41.7], [-76.1, -46.4], [-78.7, -49.0], [-68.2, -59.3], [-60.2, -51.3], [-54.3, -45.3], [-63.1, -36.6], [-64.0, -37.6]],
  '803': [[-21.6, -51.4], [-21.7, -61.0], [-11.8, -61.1], [-11.8, -51.5]],
  '804': [[84.0, 115.3], [83.9, 91.5], [83.9, 85.2], [88.0, 85.3], [88.0, 115.4]],
  '805': [[-52.3, 15.9], [-66.9, 1.0], [-62.3, -3.5], [-51.0, -14.5], [-36.4, 0.2], [-49.9, 13.6]],
  '807': [[0.6, 95.9], [0.6, 98.4], [-5.8, 98.4], [-5.9, 96.0], [-7.1, 96.0], [-7.2, 94.8], [-11.2, 94.8], [-11.2, 88.2], [-7.2, 88.2], [-7.2, 86.8], [-5.9, 86.8], [-5.9, 84.7], [0.6, 84.6], [0.6, 86.7], [1.8, 86.7], [1.9, 88.1], [6.0, 88.1], [6.0, 94.6], [1.9, 94.7], [1.9, 95.9]],
}

// ------------------------------------------------------------- helpers ----
const area = (p: XY[]) => p.reduce((s, a, i) => s + a[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * a[1], 0) / 2
const ccw = (p: XY[]) => (area(p) < 0 ? [...p].reverse() : p)
const centroid = (p: XY[]): XY => {
  let A = 0, x = 0, y = 0
  p.forEach((a, i) => {
    const b = p[(i + 1) % p.length], c = a[0] * b[1] - b[0] * a[1]
    A += c; x += (a[0] + b[0]) * c; y += (a[1] + b[1]) * c
  })
  return [x / (3 * A), y / (3 * A)]
}
/** The polygon scaled about its centroid (a setback). */
const shrink = (p: XY[], k: number, c = centroid(p)): XY[] => p.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k])

/** Ear clipping, for the concave casino outline and the towers' plans. */
function earcut(poly: XY[]): [XY, XY, XY][] {
  const p = ccw(poly)
  const idx = p.map((_, i) => i)
  const out: [XY, XY, XY][] = []
  const cz = (o: XY, a: XY, b: XY) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  let guard = 0
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length]
      const A = p[ia], B = p[ib], C = p[ic]
      if (cz(A, B, C) <= 1e-9) continue
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && cz(A, B, p[j]) >= 0 && cz(B, C, p[j]) >= 0 && cz(C, A, p[j]) >= 0)) continue
      out.push([A, B, C])
      idx.splice(i, 1)
      cut = true
      break
    }
    if (!cut) idx.splice(0, 1) // degenerate (collinear) vertex
  }
  out.push([p[idx[0]], p[idx[1]], p[idx[2]]])
  return out
}

/** Walls and a flat roof (and, with `bottom`, a floor) of a plan between z0 and z1. */
function prism(part: Part, poly: XY[], z0: number, z1: number, { top = true, bottom = false, roof = part } = {}) {
  const p = ccw(poly)
  p.forEach((a, i) => {
    const b = p[(i + 1) % p.length]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1])
  })
  for (const [a, b, c] of earcut(p)) {
    if (top) roof.tri([a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1])
    if (bottom) part.tri([a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0])
  }
}

/** A regular n-gon around (cx, cy). */
const ngon = (cx: number, cy: number, r: number, n: number, rot = 0): XY[] =>
  Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + (i / n) * 2 * Math.PI), cy + r * Math.sin(rot + (i / n) * 2 * Math.PI)])

/** A solid of revolution: rings of [radius, z] about (cx, cy), smooth-shaded, closed at a zero radius. */
function lathe(part: Part, cx: number, cy: number, prof: [number, number][], n = 14) {
  const ring = (r: number, z: number) => Array.from({ length: n }, (_, i): V3 => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI), z])
  for (let k = 0; k + 1 < prof.length; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const A = ring(r0, z0), B = ring(r1, z1)
    // Normals from the profile's slope, so a dome reads round.
    const dz = z1 - z0, dr = r1 - r0, L = Math.hypot(dz, dr) || 1
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      const nrm = (q: number): V3 => {
        const a = (q / n) * 2 * Math.PI
        return [Math.cos(a) * (dz / L), Math.sin(a) * (dz / L), -dr / L]
      }
      if (r0 > 1e-6) part.tri(A[i], A[j], B[j], undefined, undefined, undefined, [nrm(i), nrm(j), nrm(j)])
      if (r1 > 1e-6) part.tri(A[i], B[j], B[i], undefined, undefined, undefined, [nrm(i), nrm(j), nrm(i)])
    }
  }
  const [rl, zl] = prof[prof.length - 1]
  if (rl > 1e-6) {
    const R = ring(rl, zl)
    for (let i = 1; i + 1 < n; i++) part.tri(R[0], R[i], R[i + 1])
  }
}

// Every tower's plan and height, so window panels start above a neighbour.
const towers: { poly: XY[]; h: number }[] = []
const distSeg = (p: XY, a: XY, b: XY) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)))
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
}
/** The height of whatever stands against a wall at plan point m, other than `self`. */
function cover(m: XY, self: XY[]) {
  let h = 11 // the casino roof
  for (const t of towers) {
    if (t.poly === self) continue
    if (t.poly.some((a, i) => distSeg(m, a, t.poly[(i + 1) % t.poly.length]) < 0.8)) h = Math.max(h, t.h)
  }
  return h
}

/**
 * Slate window panels on each wall of a plan, one per bay of about `bay` m,
 * in storey groups of about `group` m, set 0.05 m proud of the wall, with
 * piers and spandrels of the wall showing between them. Walls shorter than
 * `minWall`, and the part of a wall a neighbour covers, get none.
 */
function panels(part: Part, poly: XY[], z0: number, z1: number, { bay = 5, group = 10, pier = 1.8, gap = 2.6, minWall = 5, self = poly, out = 0.05 } = {}) {
  const p = ccw(poly)
  p.forEach((a, i) => {
    const b = p[(i + 1) % p.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < minWall) return
    const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = uy, ny = -ux
    const zb = Math.max(z0, cover([(a[0] + b[0]) / 2 + nx * 0.3, (a[1] + b[1]) / 2 + ny * 0.3], self) + 2)
    if (z1 - zb < 6) return
    const nb = Math.max(1, Math.round(L / bay)), ng = Math.max(1, Math.round((z1 - zb) / group))
    const bw = L / nb, gh = (z1 - zb) / ng
    for (let k = 0; k < nb; k++) {
      const s0 = k * bw + pier / 2, s1 = (k + 1) * bw - pier / 2
      for (let g = 0; g < ng; g++) {
        const za = zb + g * gh + gap / 2, zc = zb + (g + 1) * gh - gap / 2
        const at = (s: number, z: number): V3 => [a[0] + ux * s + nx * out, a[1] + uy * s + ny * out, z]
        part.quad(at(s0, za), at(s1, za), at(s1, zc), at(s0, zc))
      }
    }
  })
}

/** Pale horizontal bands round a curtain-wall tower, every `step` m, `h` tall. */
function bands(part: Part, poly: XY[], z0: number, z1: number, step: number, h: number, self = poly) {
  const p = ccw(poly)
  p.forEach((a, i) => {
    const b = p[(i + 1) % p.length]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L < 3) return
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const zb = Math.max(z0, cover([(a[0] + b[0]) / 2 + nx * 0.3, (a[1] + b[1]) / 2 + ny * 0.3], self))
    for (let z = z0 + step; z + h < z1 - 1; z += step) {
      if (z < zb) continue
      const o = 0.05
      part.quad([a[0] + nx * o, a[1] + ny * o, z], [b[0] + nx * o, b[1] + ny * o, z], [b[0] + nx * o, b[1] + ny * o, z + h], [a[0] + nx * o, a[1] + ny * o, z + h])
    }
  })
}

// ------------------------------------------------------------ casino ----
// The two-storey casino under everything, its roof pale as in the aerial.
const CASINO = 11
prism(stone, OUTLINE, 0, CASINO)
prism(stone, P['804'], 0, CASINO)

// ------------------------------------------------------------ towers ----
// Register every tower first, so panels know their neighbours' heights.
const H = { '802': 105, '796': 132, '805': 114, '798': 128, '801': 106, '795': 100, '797': 84, '799': 120, '791': 100, '792': 98, '800': 96 }
for (const [k, h] of Object.entries(H)) towers.push({ poly: P[k], h })
const MUNI: XY[] = ngon(6, 30, 8.5, 4, Math.PI / 4)
towers.push({ poly: MUNI, h: 58 })

// 802: the teal glass slab, plain, with a pale crown band.
prism(teal, P['802'], 0, 105)
bands(stone, P['802'], 0, 105, 26, 0.9)

// 796: the Empire State replica. Shaft, three setbacks with their own
// windows, the mast in three diminishing stages to 161 m.
{
  const base = P['796'], c = centroid(base)
  prism(stone, base, 0, 132)
  panels(win, base, 0, 130, { bay: 3.8, group: 10, pier: 1.7 })
  const tiers: [number, number, number][] = [[0.78, 132, 137], [0.6, 137, 141.5], [0.42, 141.5, 145]]
  for (const [k, z0, z1] of tiers) {
    const t = shrink(base, k, c)
    prism(stone, t, z0, z1)
    if (z1 - z0 > 4) panels(win, t, z0, z1, { bay: 3.4, group: 6, pier: 1.0, gap: 1.4, minWall: 4 })
  }
  // The mast: an octagonal drum, a narrower lantern, a cone and the needle.
  lathe(stone, c[0], c[1], [[3.2, 145], [3.2, 151], [2.4, 151], [2.4, 155], [1.6, 155], [0.9, 158.5], [0.25, 161], [0, 161]], 8)
}

// 805: the magenta-maroon curtain wall, with pale floor bands.
prism(maroon, P['805'], 0, 114)
bands(stone, P['805'], 0, 114, 13, 1.0)

// 798: the salmon tower, two stepped setbacks at its crown.
{
  const p = P['798'], c = centroid(p)
  prism(rose, p, 0, 118)
  panels(win, p, 0, 116, { bay: 5 })
  const t1 = shrink(p, 0.72, c), t2 = shrink(p, 0.45, c)
  prism(rose, t1, 118, 124)
  prism(rose, t2, 124, 128)
}

// 801: white with blue window bands.
prism(stone, P['801'], 0, 106)
bands(teal, P['801'], 0, 106, 7.5, 3.6)

// 795: dark glass; 797: the short green glass slab.
prism(win, P['795'], 0, 100)
bands(stone, P['795'], 0, 100, 25, 0.9)
prism(teal, P['797'], 0, 84)
bands(stone, P['797'], 0, 84, 21, 0.9)

// 799: the tan tower with a stepped top.
{
  const p = P['799'], c = centroid(p)
  prism(rose, p, 0, 108)
  panels(win, p, 0, 106, { bay: 5 })
  prism(rose, shrink(p, 0.8, c), 108, 114)
  prism(rose, shrink(p, 0.58, c), 114, 120)
}

// 791: the dark bronze slab, pale crown band.
prism(win, P['791'], 0, 100)
bands(stone, P['791'], 0, 100, 33, 1.0)

// 800: the tan slab at the north end.
prism(rose, P['800'], 0, 96)
panels(win, P['800'], 0, 94, { bay: 5 })

// 792 + 807: the Chrysler replica.
{
  prism(stone, P['792'], 0, 98)
  panels(win, P['792'], 0, 96, { bay: 3.8, group: 10, pier: 1.7 })
  const cross = P['807'], c = centroid(cross)
  prism(stone, cross, 98, 110)
  panels(win, cross, 98, 110, { bay: 3, group: 12, pier: 0.9, minWall: 3.5, self: cross })
  // Five arched tiers. Each face of a tier is a wall with a semicircular top,
  // and the tier is roofed by fans from its centre at the arch's apex, so the
  // stack reads as the stepped arches; a slate triangle sits in each arch.
  const tiers = [[7.6, 110], [6.3, 114.4], [5.0, 118.2], [3.8, 121.4], [2.6, 124.2]]
  for (const [hw, z] of tiers) {
    const rise = hw * 0.95, spring = z + 1.2
    const corners: XY[] = [[c[0] - hw, c[1] - hw], [c[0] + hw, c[1] - hw], [c[0] + hw, c[1] + hw], [c[0] - hw, c[1] + hw]]
    const apex: V3 = [c[0], c[1], spring + rise]
    for (let f = 0; f < 4; f++) {
      const a = corners[f], b = corners[(f + 1) % 4]
      const nx = (b[1] - a[1]) / (2 * hw), ny = -(b[0] - a[0]) / (2 * hw)
      const arch: V3[] = []
      const N = 8
      for (let i = 0; i <= N; i++) {
        const t = Math.PI - (i / N) * Math.PI // left to right along the face
        const u = (Math.cos(t) + 1) / 2
        arch.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, spring + rise * Math.sin(t)])
      }
      stone.quad([a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], spring], [a[0], a[1], spring])
      const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, spring]
      for (let i = 0; i < N; i++) {
        stone.tri(mid, arch[i + 1], arch[i])
        stone.tri(arch[i], arch[i + 1], apex)
      }
      // The sunburst window: a slate triangle in the arch, flush.
      const o = 0.06, w = hw * 0.45
      win.tri([mid[0] - (b[0] - a[0]) / (2 * hw) * w + nx * o, mid[1] - (b[1] - a[1]) / (2 * hw) * w + ny * o, spring + 0.2],
        [mid[0] + (b[0] - a[0]) / (2 * hw) * w + nx * o, mid[1] + (b[1] - a[1]) / (2 * hw) * w + ny * o, spring + 0.2],
        [mid[0] + nx * o, mid[1] + ny * o, spring + rise * 0.8])
    }
  }
  lathe(stone, c[0], c[1], [[1.2, 126], [0.5, 134], [0.12, 143], [0, 143]], 8)
}

// The Municipal Building replica: a white square tower, a setback, a
// colonnaded drum and its cupola.
{
  prism(stone, MUNI, 0, 58)
  panels(win, MUNI, 0, 56, { bay: 3.6, group: 9, pier: 1.6 })
  const c: XY = [6, 30]
  prism(stone, ngon(6, 30, 6, 4, Math.PI / 4), 58, 65)
  lathe(stone, c[0], c[1], [[3.6, 65], [3.6, 70], [2.8, 70.5], [2.8, 73], [1.6, 76], [0.4, 77], [0.2, 78], [0, 78]], 10)
}

// The rotunda on part 803: a drum, a colonnade drawn as a slate band behind
// its columns' line, a stepped dome and a lantern.
{
  const c = centroid(P['803'])
  lathe(stone, c[0], c[1], [[5.6, 0], [5.6, 14], [4.8, 14]], 14)
  lathe(win, c[0], c[1], [[4.75, 14], [4.75, 18.5]], 14)
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * 2 * Math.PI
    lathe(stone, c[0] + 4.95 * Math.cos(a), c[1] + 4.95 * Math.sin(a), [[0.45, 14], [0.45, 18.5], [0, 18.5]], 5)
  }
  lathe(stone, c[0], c[1], [[5.4, 18.5], [5.4, 19.5], [4.6, 19.8], [4.2, 22], [3.4, 24.2], [2.0, 25.6], [1.0, 26], [1.0, 27.5], [0.5, 28], [0, 28.2]], 14)
}

// ------------------------------------------------------ the front ----
// The brick front behind the statue, along the casino's diagonal corner
// wall (64.6,-93.1)-(90.3,-67.1): a 10 m deep block, gabled, with a teal
// domed tower at each end.
{
  const a: XY = [64.6, -93.1], b: XY = [90.3, -67.1]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L
  const nx = -uy, ny = ux // inwards
  const at = (s: number, d: number): XY => [a[0] + ux * s + nx * d, a[1] + uy * s + ny * d]
  const block: XY[] = [at(2, 0.5), at(L - 2, 0.5), at(L - 2, 10), at(2, 10)]
  prism(rose, block, 0, 19)
  // A low hipped roof, slate-coloured as in the photos.
  const r0 = at(2, 0.5), r1 = at(L - 2, 0.5), r2 = at(L - 2, 12), r3 = at(2, 12), m0 = at(7, 5.25), m1 = at(L - 7, 5.25)
  const z = 19, zr = 23
  win.quad([r0[0], r0[1], z], [r1[0], r1[1], z], [m1[0], m1[1], zr], [m0[0], m0[1], zr])
  win.quad([r2[0], r2[1], z], [r3[0], r3[1], z], [m0[0], m0[1], zr], [m1[0], m1[1], zr])
  win.tri([r1[0], r1[1], z], [r2[0], r2[1], z], [m1[0], m1[1], zr])
  win.tri([r3[0], r3[1], z], [r0[0], r0[1], z], [m0[0], m0[1], zr])
  // The pale stone bands of the brick face and its tall arched windows.
  bands(stone, [r0, r1, r2, r3], 0, 19, 6.2, 0.9)
  for (const s of [0.27, 0.5, 0.73]) {
    const p = at(L * s, -0.06), w = 2.2
    win.quad([p[0] - ux * w, p[1] - uy * w, 3], [p[0] + ux * w, p[1] + uy * w, 3], [p[0] + ux * w, p[1] + uy * w, 11], [p[0] - ux * w, p[1] - uy * w, 11])
  }
  for (const s of [3.5, L - 3.5]) {
    const t = at(s, 4)
    prism(rose, ngon(t[0], t[1], 3.4, 4, Math.atan2(uy, ux) + Math.PI / 4), 0, 27)
    lathe(patina, t[0], t[1], [[2.9, 27], [2.9, 28.5], [2.5, 30.5], [1.4, 32], [0.4, 32.8], [0.3, 34], [0, 34.2]], 12)
  }
}

// The columned main entrance on the Strip, (82, -66) to (95.7, -47): pale
// stone with a patina roof.
{
  const e: XY[] = [[83, -66.5], [95.4, -66.5], [95.4, -47], [83, -47]]
  prism(stone, e, 0, 20)
  panels(win, e, 0, 18, { bay: 3.2, group: 15, pier: 1.2 })
  const z = 20, zr = 25
  patina.quad([83, -66.5, z], [95.4, -66.5, z], [92, -60, zr], [86.4, -60, zr])
  patina.quad([95.4, -47, z], [83, -47, z], [86.4, -53.5, zr], [92, -53.5, zr])
  patina.quad([95.4, -66.5, z], [95.4, -47, z], [92, -53.5, zr], [92, -60, zr])
  patina.quad([83, -47, z], [83, -66.5, z], [86.4, -60, zr], [86.4, -53.5, zr])
  patina.quad([86.4, -60, zr], [92, -60, zr], [92, -53.5, zr], [86.4, -53.5, zr])
}

// The sign pylon (222 ft) at the north end of the Strip front: a stone
// frame round its two screens.
{
  const s: XY[] = [[85, 96], [90, 96], [90, 104], [85, 104]]
  prism(stone, s, 0, 68)
  for (const [ax, ay, bx, by, nx] of [[90.05, 96.5, 90.05, 103.5, 1], [84.95, 103.5, 84.95, 96.5, -1]] as const) {
    void nx
    win.quad([ax, ay, 24], [bx, by, 24], [bx, by, 58], [ax, ay, 58])
  }
}

// --------------------------------------------- the Brooklyn Bridge ----
// The walkway along the Strip (OSM way/1419902125), its two stone towers with
// paired pointed arches, and the main cables.
{
  const path: XY[] = [[93, 11], [97, 46], [101, 88]]
  const DECK = 4, W = 5
  for (let i = 0; i + 1 < path.length; i++) {
    const [a, b] = [path[i], path[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L
    const q: XY[] = [[a[0] + nx * W / 2, a[1] + ny * W / 2], [b[0] + nx * W / 2, b[1] + ny * W / 2], [b[0] - nx * W / 2, b[1] - ny * W / 2], [a[0] - nx * W / 2, a[1] - ny * W / 2]]
    prism(stone, q, DECK - 0.8, DECK, { bottom: true })
  }
  const along = (t: number): { p: XY; u: XY } => {
    const segs = path.slice(1).map((b, i) => Math.hypot(b[0] - path[i][0], b[1] - path[i][1]))
    let d = t * segs.reduce((x, y) => x + y)
    for (let i = 0; i < segs.length; i++) {
      if (d <= segs[i] || i === segs.length - 1) {
        const a = path[i], b = path[i + 1], u: XY = [(b[0] - a[0]) / segs[i], (b[1] - a[1]) / segs[i]]
        return { p: [a[0] + u[0] * d, a[1] + u[1] * d], u }
      }
      d -= segs[i]
    }
    throw new Error('unreachable')
  }
  const TOP = 22
  const towerAt = [0.3, 0.7].map(along)
  for (const { p, u } of towerAt) {
    const n: XY = [u[1], -u[0]]
    const box = (d0: number, d1: number, z0: number, z1: number) => {
      const t = 1.8
      const q: XY[] = [
        [p[0] + n[0] * d0 - u[0] * t, p[1] + n[1] * d0 - u[1] * t], [p[0] + n[0] * d1 - u[0] * t, p[1] + n[1] * d1 - u[1] * t],
        [p[0] + n[0] * d1 + u[0] * t, p[1] + n[1] * d1 + u[1] * t], [p[0] + n[0] * d0 + u[0] * t, p[1] + n[1] * d0 + u[1] * t],
      ]
      prism(rose, q, z0, z1)
    }
    // Three piers either side of and between the two arches, then the top.
    box(-5, -3.2, 0, TOP - 5)
    box(-0.7, 0.7, 0, TOP - 5)
    box(3.2, 5, 0, TOP - 5)
    box(-5.2, 5.2, TOP - 5, TOP)
    box(-5.5, 5.5, TOP, TOP + 0.8)
    // Pointed arch heads: triangles filling the spandrels on both faces.
    for (const side of [-1, 1]) {
      const f = (d: number, z: number): V3 => [p[0] + n[0] * d + u[0] * 1.8 * side, p[1] + n[1] * d + u[1] * 1.8 * side, z]
      for (const [l, r] of [[-3.2, -0.7], [0.7, 3.2]]) {
        const m = (l + r) / 2, zs = TOP - 9, zt = TOP - 5
        const tri = side > 0 ? [f(l, zs), f(l, zt), f(m, zt)] : [f(l, zs), f(m, zt), f(l, zt)]
        rose.tri(tri[0], tri[1], tri[2])
        const tri2 = side > 0 ? [f(r, zs), f(m, zt), f(r, zt)] : [f(r, zs), f(r, zt), f(m, zt)]
        rose.tri(tri2[0], tri2[1], tri2[2])
      }
    }
  }
  // Main cables: from the bridge ends up to each tower top and sagging between.
  const ends = [along(0.02), along(0.98)]
  for (const side of [-1, 1]) {
    const pts: V3[] = []
    const add = (t: number, z: number) => {
      const { p, u } = along(t)
      pts.push([p[0] + u[1] * 4 * side, p[1] - u[0] * 4 * side, z])
    }
    void ends
    for (let k = 0; k <= 3; k++) add(0.02 + (0.28 * k) / 3, DECK + 0.5 + (TOP - DECK - 0.5) * (k / 3) ** 1.6)
    for (let k = 1; k <= 6; k++) {
      const t = k / 6
      add(0.3 + 0.4 * t, TOP - (TOP - DECK - 2.5) * 4 * t * (1 - t))
    }
    for (let k = 1; k <= 3; k++) add(0.7 + (0.28 * k) / 3, TOP - (TOP - DECK - 0.5) * (k / 3) ** 0.6)
    const r = 0.45
    const secs = pts.map((q, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
      const t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(t[0], t[1]) || 1
      const s: V3 = [t[1] / l * r, -t[0] / l * r, 0]
      return [[q[0] + s[0], q[1] + s[1], q[2] - r], [q[0] - s[0], q[1] - s[1], q[2] - r], [q[0] - s[0], q[1] - s[1], q[2] + r], [q[0] + s[0], q[1] + s[1], q[2] + r]] as V3[]
    })
    for (let k = 0; k + 1 < secs.length; k++) {
      const A = secs[k], B = secs[k + 1]
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        rose.quad(A[i], A[j], B[j], B[i])
      }
    }
  }
}

// --------------------------------------------- the Statue of Liberty ----
// 150 ft (46 m) on the corner (OSM way/115663314, centre (85.0, -88.8)),
// facing the Strip-Tropicana intersection to the south-east. Built facing
// south (−y), torch in her right hand (west), then turned 45°.
{
  const C: XY = [85.0, -88.8], ROT = Math.PI / 4
  const tf = (p: V3): V3 => [C[0] + p[0] * Math.cos(ROT) - p[1] * Math.sin(ROT), C[1] + p[0] * Math.sin(ROT) + p[1] * Math.cos(ROT), p[2]]
  const local = new Part(), localStone = new Part()
  // Pedestal: a broad plinth, the battered body, the cornice and the parapet.
  prism(localStone, ngon(0, 0, 8.5, 4, Math.PI / 4), 0, 3.5)
  prism(localStone, ngon(0, 0, 6.6, 4, Math.PI / 4), 3.5, 12.5)
  prism(localStone, ngon(0, 0, 7.2, 4, Math.PI / 4), 12.5, 14)
  prism(localStone, ngon(0, 0, 6.0, 4, Math.PI / 4), 14, 16.5)
  // The figure, heel 16.5 m to torch tip 46 m: the robe as a lofted oval,
  // shoulders, head and crown, the raised right arm and torch, the tablet.
  const loft = (rings: [number, number, number, number, number][]) => {
    // [cx, cy, rx, ry, z]
    const n = 12
    const R = rings.map(([cx, cy, rx, ry, z]) => Array.from({ length: n }, (_, i): V3 => [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI), z]))
    local.loft(R)
    const top = R[R.length - 1]
    for (let i = 1; i + 1 < n; i++) local.tri(top[0], top[i], top[i + 1])
  }
  loft([[0, 0, 3.4, 3.0, 16.5], [0, 0.1, 3.1, 2.6, 22], [0, 0.2, 2.7, 2.1, 29], [0, 0.2, 2.6, 1.9, 33.5], [0, 0.2, 2.2, 1.6, 35.2], [0, 0.2, 1.0, 0.9, 36.2]])
  lathe(local, 0, 0.1, [[0, 36.0], [0.9, 36.4], [1.3, 37.4], [1.25, 38.6], [0.8, 39.4], [0, 39.6]], 10)
  // The crown's seven rays: flat spikes out from the head.
  for (let k = 0; k < 7; k++) {
    const a = -Math.PI / 2 + ((k - 3) / 3) * (Math.PI * 0.55)
    const d: XY = [Math.cos(a), Math.sin(a)]
    const base: V3 = [d[0] * 1.2, 0.1 + d[1] * 1.2, 38.7]
    const tip: V3 = [d[0] * 3.0, 0.1 + d[1] * 3.0, 39.9]
    const side: V3 = [-d[1] * 0.35, d[0] * 0.35, 0]
    local.tri([base[0] - side[0], base[1] - side[1], base[2]], [base[0] + side[0], base[1] + side[1], base[2]], tip)
    local.tri([base[0] + side[0], base[1] + side[1], base[2]], [base[0] - side[0], base[1] - side[1], base[2]], tip)
  }
  // Raised right arm (her right is west, −x, facing south) and the torch.
  const arm = (a: V3, b: V3, r: number) => {
    const n = 6
    const ax = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...ax)
    const t = ax.map((v) => v / l) as V3
    const ref: V3 = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    const u: V3 = [t[1] * ref[2] - t[2] * ref[1], t[2] * ref[0] - t[0] * ref[2], t[0] * ref[1] - t[1] * ref[0]]
    const ul = Math.hypot(...u); u[0] /= ul; u[1] /= ul; u[2] /= ul
    const v: V3 = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
    const ring = (c: V3) => Array.from({ length: n }, (_, i): V3 => {
      const q = (i / n) * 2 * Math.PI
      return [c[0] + r * (u[0] * Math.cos(q) + v[0] * Math.sin(q)), c[1] + r * (u[1] * Math.cos(q) + v[1] * Math.sin(q)), c[2] + r * (u[2] * Math.cos(q) + v[2] * Math.sin(q))]
    })
    local.loft([ring(a), ring(b)])
  }
  arm([-1.8, 0.2, 34.8], [-2.5, 0.4, 43.2], 0.75)
  lathe(local, -2.55, 0.4, [[0.5, 43.0], [0.95, 44.2], [0.9, 44.6], [0.5, 45.2], [0, 46]], 8)
  // The tablet in the left arm, held against her side.
  prism(local, [[1.9, -1.4], [3.0, -1.1], [3.0, 1.0], [1.9, 0.7]], 29, 34.5)
  arm([1.9, 0.0, 34.6], [2.4, -0.6, 31.5], 0.65)
  for (const [src, dst] of [[local, patina], [localStone, stone]] as const) {
    for (let i = 0; i < src.pos.length; i += 9) {
      const p = [0, 3, 6].map((o): V3 => [src.pos[i + o], -src.pos[i + o + 2], src.pos[i + o + 1]])
      const n = [0, 3, 6].map((o): V3 => [src.nrm[i + o], -src.nrm[i + o + 2], src.nrm[i + o + 1]])
      const rot = (q: V3): V3 => [q[0] * Math.cos(ROT) - q[1] * Math.sin(ROT), q[0] * Math.sin(ROT) + q[1] * Math.cos(ROT), q[2]]
      dst.tri(tf(p[0]), tf(p[1]), tf(p[2]), undefined, undefined, undefined, n.map(rot))
    }
  }
}

// ------------------------------------------------------------- output ----
const parts = [
  { part: stone, material: PALETTE.stone },
  { part: rose, material: finish('nyny-sandstone', 0xdcae94) },
  { part: win, material: PALETTE.window },
  { part: maroon, material: windowVariant(2, 0xa04a68) },
  { part: teal, material: windowVariant(3, 0x5b97ab) },
  { part: patina, material: finish('nyny-verdigris', 0x8fc0a6) },
]
// Shift from the park frame to the anchor: Part stores glTF (x, z, -y).
for (const { part } of parts) {
  for (let i = 0; i < part.pos.length; i += 3) {
    part.pos[i] -= ANCHOR[0]
    part.pos[i + 2] += ANCHOR[1]
  }
}
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
const glb = writeGlb('New York-New York', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor', bearing: 0, elevation: 0, height: 161,
})
const out = new URL('../models/lv-new-york-new-york.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
if (triangles > 6500) throw new Error(`triangle budget exceeded: ${triangles}`)
