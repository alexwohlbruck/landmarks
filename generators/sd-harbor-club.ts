/**
 * Harbor Club, San Diego (100 Harbor Drive; two 41-storey residential towers,
 * 1992) — original procedural geometry, CC0-1.0.
 *   bun generators/sd-harbor-club.ts
 *
 * Identity, in order: two slim near-black glass towers side by side on the
 * bayfront behind the Convention Center; each a rounded slab whose long sides
 * step in a zigzag of balconies striped with cream slab edges, while the
 * rounded ends are sheer dark glass; the tops cut at a slant, high at the
 * north end and falling to the south, outlined by a cream rim; a cream
 * podium of drums and terraces between them.
 *
 * Frame: x east, y north, z up (map frame), metres; bearing 0. Origin at the
 * centroid of the podium outline way/305664248 (-117.16255, 32.70898).
 * y = 0 the ground (flat bayfront fill; lidar ground within 0.5 m).
 *
 * Sources
 * - OSM (© OpenStreetMap contributors): podium way/305664248 (building=
 *   apartments, 4 levels, wikidata Q955149); towers way/429353144 (East
 *   Tower) and way/429353147 (West Tower), building:part, 41 levels, height
 *   129.2 m, building:colour black, glass. Plans used as mapped (simplified
 *   to 0.25 m / podium 0.8 m).
 * - USGS 3DEP lidar CA_SanDiegoQL2_2014 (flown 2014), 0.5 m grid on the
 *   anchor.
 * Photos (evidence):
 * - "The San Diego Harbor Club Towers (8727179956).jpg", vxla from Chicago,
 *   CC BY 2.0, https://commons.wikimedia.org/wiki/File:The_San_Diego_Harbor_Club_Towers_(8727179956).jpg
 *   (from the marina, south-west: both towers whole, the slanted crowns).
 * - "San Diego, Oct. 2016 13.jpg" and "14", Another Believer, CC BY-SA 4.0,
 *   https://commons.wikimedia.org/wiki/File:San_Diego,_Oct._2016_13.jpg
 *   (from Harbor Drive: balcony stripes, rounded dark glass ends, podium).
 * - "Gaslamp Quarter, San Diego, CA 92101, USA - panoramio (2).jpg", Roman
 *   Eugeniusz, CC BY-SA 3.0 (from the north-east, up 4th/5th Avenue).
 * - "San Diego, 2016 - 042.jpg", "- 139", Another Believer, CC BY-SA 4.0.
 * - "East Harbor Drive pj.jpg", Luciof, CC BY-SA 3.0; "Looking West on East
 *   Harbor Drive.jpg", Visitor7, CC BY-SA 3.0; "San Diego, CA, USA -
 *   panoramio (20)/(21).jpg", MARELBU, CC BY 3.0 (distant views).
 *
 * Numbers
 * - Tower tops (lidar, measured): flat at 132 m over the north part of each
 *   tower, falling in a plane to 116 m at the south end (East Tower from
 *   y = -27 to its south end at -44; West Tower along its own axis, from
 *   y ~ 7 to its south end at -6). OSM's 129.2 m is the mean of the slant.
 * - Podium: 21 m (lidar 20-24 m over most of it; lower terraces at 14 m
 *   are drawn at the same height) (measured, simplified).
 * - Balcony bands: one cream band every two storeys (6.3 m),
 *   2.2 m deep, on the stepped long faces (estimated from the photos; the real slab
 *   edges are one a storey).
 * - Cream rim at the top, 1.8 m (estimated).
 * - Colours: glass near-black blue held at the palette's darkest allowed
 *   charcoal, cream from the slab edges and podium in sunny photos.
 *
 * Night: the glass walls are the residences' windows (lit); the slanted
 * crowns are glass and stay dark.
 *
 * Doubts
 * - Few close photos of the crowns: the slant's exact shape between the
 *   flat roof and the rim is from lidar and the distant vxla photo only.
 * - The podium's drums, glass dome entrance and terraces are drawn as one
 *   block at 21 m.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { save, cap, inset, walls, panel, type XY } from './chi-aon-center'

const GLASS_WALL = { name: 'window', color: 0x4c5562, roughness: 0.3 } // the towers' near-black glass
const CREAM = finish('harbor-club-cream', 0xeadcc2)
const CROWN = { name: 'glass', color: 0x4f5864, roughness: 0.25 } // the slanted glass tops
const ROOF = PALETTE.roof

const wall = new Part(), cream = new Part(), crown = new Part(), roof = new Part()

const PODIUM: XY[] = [[-33.85, 30.84], [-47.11, 30.86], [-47.01, 27.80], [-47.97, 28.22], [-48.85, 26.66], [-53.42, 27.25], [-57.27, 24.24], [-57.81, 21.04], [-56.27, 18.17], [-50.00, 16.19], [-50.07, 14.30], [-54.66, 13.16], [-56.15, 10.19], [-55.62, 6.99], [-52.05, 4.32], [-52.95, -1.88], [-51.27, -1.88], [-49.16, -6.66], [-46.84, -8.23], [-40.14, -8.92], [-39.63, -10.56], [-34.19, -6.80], [-32.17, -1.84], [-29.77, -1.99], [-29.25, -14.25], [-26.94, -16.39], [-24.32, -16.46], [-21.28, -20.72], [-18.45, -20.63], [-17.00, -24.65], [-10.09, -25.11], [-9.23, -29.38], [-5.46, -31.49], [-1.56, -30.24], [-0.46, -27.83], [5.72, -27.12], [7.54, -27.95], [6.43, -31.36], [8.81, -32.51], [7.31, -39.45], [9.17, -39.29], [11.54, -44.19], [15.09, -46.37], [20.09, -46.24], [20.89, -48.09], [25.38, -45.57], [27.88, -39.14], [32.17, -39.09], [34.77, -36.19], [34.56, -31.65], [30.53, -29.08], [29.61, -26.76], [37.79, -29.63], [41.39, -28.59], [43.08, -26.26], [42.51, -21.81], [37.81, -19.58], [37.85, -12.17], [42.23, -11.08], [43.15, -8.39], [42.04, -5.82], [37.90, -5.15], [37.93, -0.96], [41.27, 1.76], [43.84, 1.84], [43.87, 8.82], [45.14, 8.87], [44.81, 25.68], [38.57, 25.69], [38.37, 31.39], [9.29, 29.87], [9.31, 28.19], [-11.17, 28.16], [-11.17, 26.76], [-33.86, 26.79]]
const EAST: XY[] = [[12.15, -13.91], [11.93, -15.71], [9.01, -14.71], [6.17, -22.77], [7.22, -23.07], [5.72, -27.12], [7.54, -27.95], [6.43, -31.36], [12.15, -34.10], [12.35, -38.92], [13.09, -41.09], [14.13, -42.42], [15.54, -43.32], [17.17, -43.72], [18.88, -43.58], [20.76, -42.64], [22.41, -40.30], [22.82, -33.77], [28.49, -31.14], [27.07, -27.58], [29.20, -26.81], [27.73, -23.15], [28.78, -22.73], [25.47, -14.56], [22.54, -15.69], [22.06, -13.24], [21.36, -12.12], [19.38, -10.62], [17.35, -10.16], [15.23, -10.55], [13.07, -12.16]]
const WEST: XY[] = [[-24.63, 18.86], [-25.38, 20.48], [-26.64, 21.85], [-29.66, 22.72], [-32.30, 21.98], [-34.18, 20.24], [-35.30, 18.37], [-37.34, 21.17], [-41.81, 17.14], [-41.22, 16.21], [-44.05, 13.88], [-43.52, 13.05], [-47.64, 9.38], [-43.96, 5.33], [-46.99, 0.76], [-46.99, -2.10], [-45.86, -4.35], [-43.85, -5.97], [-41.34, -6.23], [-39.08, -5.47], [-37.68, -3.97], [-34.53, 0.91], [-29.26, -0.74], [-27.61, 4.51], [-26.63, 4.38], [-25.66, 7.89], [-24.57, 7.75], [-22.73, 13.48], [-25.93, 14.10], [-24.62, 16.31]]

const PZ = 21
// Podium, bevelled, roofed.
{
  const ins = inset(PODIUM, 0.4)
  walls(cream, PODIUM, 0, PZ - 0.4)
  walls(cream, PODIUM, PZ - 0.4, PZ, ins)
  cap(roof, ins, PZ)
  // dark glass bands on the podium's long straight faces
  PODIUM.forEach((a, i) => {
    const b = PODIUM[(i + 1) % PODIUM.length], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 6) for (const [z0, z1] of [[3, 7.5], [10, 14.5]] as [number, number][]) panel(wall, a, b, 1.0, L - 1.0, z0, z1, 0.05)
  })
}

/** Split a counter-clockwise ring by the line dot(p, u) = k; returns [the part with dot >= k, the part with dot <= k]. */
function split(r: XY[], u: XY, k: number): [XY[], XY[]] {
  const hi: XY[] = [], lo: XY[] = []
  const s = (p: XY) => p[0] * u[0] + p[1] * u[1] - k
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], sa = s(a), sb = s(b)
    if (sa >= 0) hi.push(a)
    if (sa <= 0) lo.push(a)
    if ((sa > 0 && sb < 0) || (sa < 0 && sb > 0)) {
      const t = sa / (sa - sb), m: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      hi.push(m); lo.push(m)
    }
  })
  return [hi, lo]
}
/** The ring with its crossings of the kink line inserted, so every edge lies in one roof plane. */
function withKink(r: XY[], u: XY, k: number): XY[] {
  const out: XY[] = []
  const s = (p: XY) => p[0] * u[0] + p[1] * u[1] - k
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length], sa = s(a), sb = s(b)
    out.push(a)
    if ((sa > 0 && sb < 0) || (sa < 0 && sb > 0)) {
      const t = sa / (sa - sb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  })
  return out
}

/**
 * A tower: dark glass walls from the podium to a top that is flat (zHi) on
 * the north side of the kink and falls in a plane to zLo at the south end.
 */
function tower(ring: XY[], u: XY, kAt: XY, zHi: number, zLo: number) {
  const k = kAt[0] * u[0] + kAt[1] * u[1]
  const sMin = Math.min(...ring.map((p) => p[0] * u[0] + p[1] * u[1]))
  const slope = (zHi - zLo) / (k - sMin)
  const top = (p: XY) => {
    const s = p[0] * u[0] + p[1] * u[1]
    return s >= k ? zHi : zHi - (k - s) * slope
  }
  const r = withKink(ring, u, k)
  const RIM = 1.8
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length]
    const ta = top(a), tb = top(b)
    const A0: V3 = [a[0], a[1], PZ - 0.5], B0: V3 = [b[0], b[1], PZ - 0.5]
    const A1: V3 = [a[0], a[1], ta - RIM], B1: V3 = [b[0], b[1], tb - RIM]
    const A2: V3 = [a[0], a[1], ta], B2: V3 = [b[0], b[1], tb]
    wall.quad(A0, B0, B1, A1)
    cream.quad(A1, B1, B2, A2)
    // cream balcony bands on the stepped faces, every two storeys
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L >= 2.1) {
      const zTop = Math.min(ta, tb) - RIM - 2.0
      for (let z = PZ + 3.5; z + 2.2 < zTop; z += 6.3) panel(cream, a, b, 0.05, L - 0.05, z, z + 2.2, 0.1)
    }
  })
  // the top: the flat roof and the slanted glass crown
  const [hi, lo] = split(r, u, k)
  const lift = (pts: XY[], part: Part) => {
    // fan-free: ear-clip in 2D, then lift each corner to its roof plane
    const tmp = new Part()
    cap(tmp, pts, 0)
    for (let i = 0; i < tmp.pos.length; i += 9) {
      const c = [0, 1, 2].map((j) => {
        const x = tmp.pos[i + j * 3], y = -tmp.pos[i + j * 3 + 2]
        return [x, y, top([x, y])] as V3
      })
      part.tri(c[0], c[1], c[2])
    }
  }
  if (hi.length >= 3) lift(hi, roof)
  if (lo.length >= 3) lift(lo, crown)
}

// East Tower: axis due north; flat north of y = -27, 116 m at the south end.
tower(EAST, [0, 1], [17.3, -27], 132, 116)
// West Tower: its axis runs at ~28 degrees east of north (OSM plan); the
// lidar flat ends near y = 7.
const uW: XY = [Math.sin((28 * Math.PI) / 180), Math.cos((28 * Math.PI) / 180)]
tower(WEST, uW, [-36.5, 7], 132, 116)

if (import.meta.main) {
  await save('sd-harbor-club', 'Harbor Club', [-117.16255, 32.70898], 0, [
    { part: wall, material: GLASS_WALL },
    { part: cream, material: CREAM },
    { part: crown, material: CROWN },
    { part: roof, material: ROOF },
  ], 5000)
}
