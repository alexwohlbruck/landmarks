/**
 * Pinky's Westside Grill, 1600 W. Morehead St, Wesley Heights (Gold
 * District), Charlotte — procedural, CC0-1.0.
 * bun generators/clt-pinkys-westside.ts
 *
 * A one-storey former service station turned burger joint: a flat-roofed
 * dark grey block with a glazed storefront to the parking lot, a covered
 * patio under a single-pitch metal roof on its north side, and the thing
 * everyone knows it by — a Volkswagen Beetle painted in stars and stripes
 * parked on the roof over the front door.
 *
 * Evidence:
 *  - OSM: way/324418138, one outline covering the block and the patio.
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m: ground 1.6 m above
 *    ground_min (flat lot; base = that). The block's roof 4.6 m above base,
 *    the patio roof falling from ~5.0 m on the block side to ~2.9 m at its
 *    east edge, and a 1.2–1.6 m bump over the block's middle (the car).
 *    OSM's outline agrees with the lidar to within a metre.
 *  - USGS NAIP: white roofs on both block and patio.
 *  - Photos: MikeKalasnik, "Pinkys Westside Grill Charlotte, NC", Flickr
 *    8081989530, 2012, CC BY-SA 2.0 (the storefront face from Morehead St:
 *    the dark grey block, the glazing, the patio's metal roof, the striped
 *    Beetle on the roof); City Dweller 2, "Pinky's sign along West Morehead
 *    Mid-April 2024", CC BY-SA 4.0 (the sign only); Mapillary dashcam
 *    frames, March 2026 (aftcpics471, ids 1501856311284257,
 *    2449118402203368: the block from Morehead at distance, still grey).
 *
 * Estimated: the storefront's panel count and the car's livery split
 * (stripes on the body, blue over the front of the roof), its heading (side-on to the
 * storefront in the 2012 photo), the patio's posts and half wall, rooftop
 * units. No licensed photo after 2012 shows the car clearly; the 2026
 * dashcam frames are too far away to confirm it is still there.
 *
 * Model frame: bearing 10 (model +y runs along the block, 10° east of
 * north); origin at -80.86741, 35.22916; metres above the base.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type Built, type XY, cap, centroid, prism, quad, rect, softBox, tri, window, write } from './clt-highland-park-mill-3'

/** The block's dark grey paint, pulled lighter (photo: ~#55595c). */
const PAINT = finish('pinkys-grey', 0x6e7275)
const RED = finish('pinkys-red', 0xc0453f)
const BLUE = finish('pinkys-blue', 0x3d5a9a)

/** way/324418138 in the model frame. */
const OUTLINE: XY[] = [[3.55, -13.79], [-5.72, -14.21], [-5.68, 2.86], [-0.66, 12.98], [6.53, 10.19], [3.44, 2.94]]
const BLOCK: XY[] = [[3.55, -13.9], [3.5, 1.0], [-5.7, 1.0], [-5.72, -14.21]]
const PATIO: XY[] = [[-5.7, 1.0], [3.5, 1.0], [3.44, 2.94], [6.53, 10.19], [-0.66, 12.98], [-5.68, 2.86]]
const TOP = 4.6
/** Patio roof: 5.0 m on the block side down to ~2.9 m at the east edge. */
const patioZ = (q: XY) => 5.0 - 0.17 * (q[0] + 5.7)

/** A flat-roofed block with a coped parapet. */
function parapetBlock(wall: Part, trim: Part, roof: Part, R: XY[], top: number) {
  prism(wall, R, -0.4, top, null)
  const n = R.length, c = centroid(R)
  const I = R.map((p): XY => { const dx = c[0] - p[0], dy = c[1] - p[1], L = Math.hypot(dx, dy); return [p[0] + dx / L * 0.4, p[1] + dy / L * 0.4] })
  cap(roof, I, top - 0.5)
  R.forEach((A, i) => {
    const B = R[(i + 1) % n], a = I[i], b = I[(i + 1) % n]
    quad(trim, [A[0], A[1], top], [B[0], B[1], top], [b[0], b[1], top], [a[0], a[1], top], [0, 0, 1])
    quad(wall, [a[0], a[1], top], [b[0], b[1], top], [b[0], b[1], top - 0.5], [a[0], a[1], top - 0.5], [a[1] - b[1], b[0] - a[0], 0])
  })
}

/**
 * The Beetle: a loft of rounded sections along +y, its side profile the
 * familiar single arch; quads coloured by height in flag stripes, the roof
 * blue. Wheels are short dark cylinders.
 */
function beetle(red: Part, white: Part, blue: Part, tyre: Part, c: XY, z0: number) {
  const L = 4.1, W = 1.6, seg = 14, st = 16
  // Body top height and half-width along the car (t from rear 0 to front 1).
  const top = (t: number) => {
    const body = 0.95 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.5) / 0.52, 4)))
    const cabin = 1.5 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.47) / 0.36, 2)))
    return Math.max(body, cabin, 0.35)
  }
  const half = (t: number) => (W / 2) * (0.82 + 0.18 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.5) / 0.55, 2))))
  const bottom = 0.3
  const ring = (t: number): V3[] => {
    const h = top(t), w = half(t), y = c[1] - L / 2 + t * L
    return Array.from({ length: seg + 1 }, (_, i) => {
      const a = (i / seg) * Math.PI // 0 = right side bottom, PI = left side bottom, over the top
      const s = Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), 0.6), u = Math.pow(Math.sin(a), 0.6)
      return [c[0] + s * w, y, z0 + bottom + u * (h - bottom)] as V3
    })
  }
  const rings = Array.from({ length: st + 1 }, (_, k) => ring(0.02 + (k / st) * 0.96))
  const pick = (z: number, y: number) => {
    const h = z - z0
    if (h > 1.1 && y > c[1] - 0.3) return blue
    return Math.floor((h - bottom) / 0.3) % 2 === 0 ? red : white
  }
  for (let k = 0; k < st; k++) {
    const A = rings[k], B = rings[k + 1]
    for (let i = 0; i < seg; i++) {
      const zm = (A[i][2] + A[i + 1][2] + B[i][2] + B[i + 1][2]) / 4, ym = (A[i][1] + B[i][1]) / 2
      const p = pick(zm, ym), mx = (A[i][0] + A[i + 1][0]) / 2 - c[0]
      quad(p, A[i], B[i], B[i + 1], A[i + 1], [mx, 0, zm - z0 - 0.6])
    }
  }
  // End caps and the flat underside.
  for (const [R, ny] of [[rings[0], -1], [rings[st], 1]] as [V3[], number][]) {
    for (let i = 0; i < seg; i++) tri(red, R[0], R[i], R[i + 1], [0, ny, 0])
  }
  for (let k = 0; k < st; k++) quad(tyre, rings[k][0], rings[k + 1][0], rings[k + 1][seg], rings[k][seg], [0, 0, -1])
  // Wheels.
  for (const ty of [0.2, 0.8]) for (const sx of [-1, 1]) {
    const y = c[1] - L / 2 + ty * L, x = c[0] + sx * (half(ty) - 0.05), r = 0.34, n = 10
    const P = (a: number, dx: number): V3 => [x + dx, y + Math.cos(a) * r, z0 + r + Math.sin(a) * r]
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI
      quad(tyre, P(a0, -0.12), P(a1, -0.12), P(a1, 0.12), P(a0, 0.12), [0, Math.cos(a0), Math.sin(a0)])
      tri(tyre, [x + sx * 0.12, y, z0 + r], P(a0, sx * 0.12), P(a1, sx * 0.12), [sx, 0, 0])
    }
  }
}

export function buildPinkys(): Built {
  const grey = new Part(), win = new Part(), trim = new Part(), roof = new Part(), red = new Part(), blue = new Part()

  parapetBlock(grey, trim, roof, BLOCK, TOP)
  // Storefront glazing on the east face (to the parking lot): four big
  // panels between white pilasters; two on the south face, one door-width
  // panel on the west.
  {
    const A = BLOCK[0], B = BLOCK[1], Lf = Math.hypot(B[0] - A[0], B[1] - A[1])
    const u: XY = [(B[0] - A[0]) / Lf, (B[1] - A[1]) / Lf], o: XY = [u[1], -u[0]]
    const at = (s: number): XY => [A[0] + u[0] * s, A[1] + u[1] * s]
    for (const s of [2.4, 5.6, 8.8, 12.0]) {
      window(win, at(s), u, o, { z0: 0.5, z1: 3.3, w: 2.7 }, trim)
    }
    // Sign band over the glazing.
    const a = at(1.0), b = at(13.4)
    prism(trim, [a, b, [b[0] + o[0] * 0.15, b[1] + o[1] * 0.15], [a[0] + o[0] * 0.15, a[1] + o[1] * 0.15]], 3.6, 4.2)
  }
  {
    const A = BLOCK[3], B = BLOCK[0], Lf = Math.hypot(B[0] - A[0], B[1] - A[1])
    const u: XY = [(B[0] - A[0]) / Lf, (B[1] - A[1]) / Lf], o: XY = [u[1], -u[0]]
    for (const s of [2.6, 6.6]) window(win, [A[0] + u[0] * s, A[1] + u[1] * s], u, o, { z0: 0.9, z1: 3.1, w: 2.4 }, trim)
  }
  // Rooftop units (pale boxes) behind the car.
  softBox(trim, rect(-4.4, -12.6, -2.2, -10.4), TOP - 0.5, TOP + 0.6, 0.15, trim)
  softBox(trim, rect(-4.6, -8.6, -2.6, -6.8), TOP - 0.5, TOP + 0.4, 0.12, trim)

  // The car, on a low plinth over the front door.
  softBox(grey, rect(0.8, -4.6, 3.0, 0.6), TOP - 0.5, TOP + 0.1, 0.1, roof)
  beetle(red, trim, blue, grey, [1.9, -2.0], TOP + 0.1)

  // The patio: a single-pitch metal roof with a fascia, on posts, a low
  // half wall round the open sides, the block's grey wall at its back.
  {
    const R = PATIO, n = R.length
    // Roof slab 0.25 thick with a fascia edge.
    const Z = patioZ
    cap(roof, R, (q) => Z(q) + 0.25)
    cap(trim, R, (q) => Z(q), false)
    R.forEach((A, i) => {
      const B = R[(i + 1) % n]
      quad(trim, [A[0], A[1], Z(A)], [B[0], B[1], Z(B)], [B[0], B[1], Z(B) + 0.25], [A[0], A[1], Z(A) + 0.25], [B[1] - A[1], A[0] - B[0], 0])
    })
    // Posts at the outer corners and half walls between them.
    for (const p of R.slice(2)) {
      const c = centroid(R), dx = c[0] - p[0], dy = c[1] - p[1], L = Math.hypot(dx, dy)
      const q: XY = [p[0] + dx / L * 0.3, p[1] + dy / L * 0.3]
      prism(grey, rect(q[0] - 0.15, q[1] - 0.15, q[0] + 0.15, q[1] + 0.15), -0.4, Z(q), null)
    }
    for (let i = 2; i < n; i++) {
      const A = R[i], B = R[(i + 1) % n]
      const o: XY = [B[1] - A[1], A[0] - B[0]], Lo = Math.hypot(o[0], o[1])
      const a2: XY = [A[0] - o[0] / Lo * 0.25, A[1] - o[1] / Lo * 0.25], b2: XY = [B[0] - o[0] / Lo * 0.25, B[1] - o[1] / Lo * 0.25]
      prism(grey, [A, B, b2, a2], -0.4, 1.0, trim)
    }
    // The east side between the block and the first post.
    prism(grey, [R[1], R[2], [R[2][0] - 0.25, R[2][1]], [R[1][0] - 0.25, R[1][1]]], -0.4, 1.0, trim)
  }

  return {
    id: 'clt-pinkys-westside', name: "Pinky's Westside Grill", anchor: centroid(OUTLINE), height: TOP + 0.1 + 1.5,
    parts: [
      { part: grey, material: PAINT },
      { part: roof, material: PALETTE.roof },
      { part: win, material: PALETTE.window },
      { part: trim, material: PALETTE.trim },
      { part: red, material: RED },
      { part: blue, material: BLUE },
    ],
  }
}

if (import.meta.main) await write(buildPinkys())
