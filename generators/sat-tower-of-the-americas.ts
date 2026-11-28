/**
 * Tower of the Americas, Hemisfair, San Antonio: procedural, CC0-1.0.
 * bun generators/sat-tower-of-the-americas.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. The origin is the centre of OSM's round parts (the shaft,
 * the top house and the glass base share it: -98.4835734, 29.4190402);
 * the 2017 lidar's top-house returns centre 1 m south-east of it, within
 * the cell and imagery error. y = 0 is the plaza around the base, which
 * is flat (lidar ground 198.2 m NAVD88 everywhere within 30 m; Mapterhorn
 * the same within 0.3 m).
 *
 * O'Neil Ford (Ford, Powell & Carson), for HemisFair '68. A slip-formed
 * concrete shaft, fluted with broad pilasters and the deep channels of
 * its three exterior elevators, carries a top house hoisted up it in
 * 1968: an upturned truncated cone of two glass bands (restaurant and
 * observation levels) between slatted fascia bands, a ribbed underside,
 * a shallow roof with a central drum, and a red-and-white FM mast.
 *
 * Published (Wikipedia, "Tower of the Americas", tower heights):
 * - 750 ft (229 m) to the antenna tip; 622 ft (190 m) to the roof;
 * - upper indoor observation deck 579 ft (176 m), lower 560 ft (171 m),
 *   revolving restaurant 550 ft (168 m);
 * - a 30 m tapered steel mast on the roof since 1970.
 *
 * Measured, lidar (USGS_LPC_TX_Central_B2_2017_LAS_2019, flown 2017;
 * heights above the plaza):
 * - mast tip 228.1 m (the model uses 228.6, between it and the published
 *   229); a raised centre on the roof, 188.5-189 m within r 7 (drawn, after
 *   review, as a low domed cap to 189.0 m rather than a drum: from the street
 *   it hides behind the rim and its equipment); the roof flat at
 *   184.3 m from r 7.5 to r 11, falling to 181.5 m at the rim;
 * - the top house's rim r 18.6 m (returns to r 18.8-19, less half a cell);
 * - the base pavilion: a round conical roof, eave about 3.6 m at r 24
 *   rising inward (5 m at r 18, where the top house hides it); the
 *   north-west wing's flat roof 6.6 m.
 * Measured from photos, scaled from the rim's 37.2 m (Barera's 2018
 * telephoto from the north-north-west, read at the silhouette's sides,
 * where depth does not shift heights; checked against the published deck
 * levels): the top house tapers straight from r 18.6 at the rim to r 15.0
 * at its foot, 164.3 m; lower fascia to 168.3, lower glass (restaurant
 * and lower deck) to 173.6, fascia to 176.6, upper glass to 180.3, then
 * the rim lip; the ribbed underside a saucer sloping down and in to the
 * shaft (the side silhouette drops 2.8 m from r 15 to r 7; after review it
 * is drawn 3.9 m deep, meeting the shaft at 160.4 m, so the saucer reads); the shaft 13.8 m across under the top house and
 * 14.6 m at the foot (Jcutrer's night photo, a clean silhouette); about
 * twelve pilasters round it (five or six show across any view).
 * Estimated: the flute and channel widths and depths (V grooves 13 and 17
 *   degrees wide, 0.9 and 1.5 m deep, deeper than they look so the ribbing
 *   reads by shading at map distance), the
 * elevators' bearings (0, 120, 240; one channel faces the camera in both
 * north-west views), the underside's 40 ribs, the mast's section (1.6 m
 * at the foot, 0.5 m at the tip) and band spacing, the glass drum over
 * the pavilion (OSM way/351672058: 10 m; drawn to 9.4 m) and how the
 * pavilion roof meets it.
 * Left out: the elevator cars, railings and antennas on the roof, the
 * mullions, the pools and waterfall round the base.
 *
 * OSM: way/78485919 (outline: the base pavilion and wing) and its parts
 * way/351672055 (mast), /351672056 (north-west wing; tagged 20 m, lidar
 * 6.6 m), /351672057 (shaft), /351672058 (glass base drum), /351672059
 * (top house), /351672060 (pavilion ring; tagged 20 m pyramidal, lidar
 * shows a 3.6-6 m cone). The model draws all of them, so all are replaced.
 *
 * Night: both glass bands are `window` (lit restaurant and decks); the
 * shaft is floodlit evenly to the top and the underside is washed bright
 * (Jcutrer's night photo; it is sometimes lit in colours, kept neutral
 * here); a ring of `lamp` beads on the rim, as the photo shows.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "San Antonio May 2018 8 (Tower of the Americas).jpg", Michael Barera,
 *   CC BY-SA 4.0 (telephoto from the north-north-west; top-house profile)
 * - "Tower of the americas 2013.jpg", Larry D. Moore, CC BY 4.0 (from below; underside ribs, flutes)
 * - "Tower of Americas at Night.jpg", jcutrer, CC BY-SA 4.0 (night; shaft widths)
 * - "Kusch House & Tower of the Americas - Hemisfair (2025-12-12).jpg", Adrianna Chavez, CC BY-SA 4.0 (south-west)
 * - "Tower of the Americas San Antonio elevator.jpg", Runner1928, CC BY-SA 3.0 (elevator channel)
 * - "Entrance to Tower of the Americas IMG 4576.JPG", Billy Hathorn, CC BY 3.0 (base pavilion)
 * - "HemisFair Park May 2018 04 / 07 / 11 (Tower of the Americas).jpg", Michael Barera, CC BY-SA 4.0
 * - "Top of tower of americas.JPG", J.Paylor, CC BY-SA 4.0 (mast tip)
 * No look-only sources used.
 *
 * Doubts: the shaft's exact section (pilaster count, channel bearings) is
 * read from elevations, not a plan; the base pavilion under the top house
 * and its north-west wing have no clear photo, so they are kept plain.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

const concrete = new Part() // shaft, underside, wing walls
const fascia = new Part()   // slatted bands, rim lip, drum
const win = new Part()      // glass bands (lit)
const roof = new Part()     // top-house roof, pavilion roof
const mast = new Part()     // red mast
const lamp = new Part()     // rim lights

/** A quad wound to face the side its normals point to. */
function face(p: Part, P: V3[], N: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const flat = (p: Part, P: V3[], n: V3) => face(p, P, [n, n, n, n])
/** Point at radius r, compass bearing `az` (radians, clockwise from north), height z. */
const P = (r: number, az: number, z: number): V3 => [r * Math.sin(az), r * Math.cos(az), z]

/**
 * A surface of revolution from a profile of [r, z] points, its left-hand
 * side the outside (walls go up, roofs go inward, undersides go outward),
 * smooth across joints under `smooth` degrees, over bearings a0..a1.
 */
function lathe(profile: [number, number][], pick: (band: number) => Part | null, k: number, smooth = 40, a0 = 0, a1 = TAU) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos((smooth * Math.PI) / 180)
  const vn = (b: number, end: 0 | 1): [number, number] => {
    const own = bandN[b], other = bandN[b + (end ? 1 : -1)]
    if (!other || own[0] * other[0] + own[1] * other[1] < cosLim) return own
    const s = [own[0] + other[0], own[1] + other[1]], l = Math.hypot(s[0], s[1])
    return [s[0] / l, s[1] / l]
  }
  for (let b = 0; b < profile.length - 1; b++) {
    const part = pick(b)
    if (!part) continue
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    if (r0 === 0 && r1 === 0) continue
    const n0 = vn(b, 0), n1 = vn(b, 1)
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.sin(a), n[0] * Math.cos(a), n[1]])
    for (let s = 0; s < k; s++) {
      const aa = a0 + (s / k) * (a1 - a0), ab = a0 + ((s + 1) / k) * (a1 - a0)
      const q = [P(r0, aa, z0), P(r0, ab, z0), P(r1, ab, z1), P(r1, aa, z1)]
      const nn = [N(n0, aa), N(n0, ab), N(n1, ab), N(n1, aa)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

// ------------------------------------------------------------- the shaft ---
/**
 * Twelve pilasters with shallow flutes between them; three of the flutes
 * are the elevators' deep channels (bearings 0, 120, 240). The shaft
 * tapers straight from 14.6 m at the foot to 13.8 m under the top house.
 */
const SHAFT_TOP = 160.4
const R0 = 7.3, R1 = 6.9
{
  const N = 12, FLUTE = (13 / 360) * TAU, CHAN = (17 / 360) * TAU
  const pitch = TAU / N
  for (let i = 0; i < N; i++) {
    const c = i * pitch                // flute (or channel) centre
    const isChan = i % 4 === 0
    const half = (isChan ? CHAN : FLUTE) / 2
    const depth = isChan ? 1.5 : 0.9
    const pa = c + half, pb = c + pitch - (((i + 1) % 4 === 0 ? CHAN : FLUTE) / 2)
    // Each pilaster is rounded: chamfered edges and a slight bulge, with
    // normals splayed so the flutes read as light and shade at map distance.
    const CH = 0.3, dA = (pb - pa) * 0.14, mA = (pa + pb) / 2
    const AZ = [pa, pa + dA, mA, pb - dA, pb]
    const RO = [-CH, 0, 0.12, 0, -CH]
    const SPLAY = [-55, -18, 0, 18, 55].map((d) => (d * Math.PI) / 180)
    const ring = (r: number, z: number) => ({
      f: AZ.map((az, k) => P(r + RO[k], az, z)),
      // groove bottom of this flute: a V, so its two faces take light
      // and shade from any side and the ribbing reads by shading alone
      g: [P(r - depth, c, z)],
      e0: P(r - CH, c - half, z), e1: P(r - CH, c + half, z),
    })
    const lo = ring(R0, 0), hi = ring(R1, SHAFT_TOP)
    const nrm = (az: number): V3 => [Math.sin(az), Math.cos(az), 0]
    for (let k = 0; k < 4; k++) {
      const nA = nrm(AZ[k] + SPLAY[k]), nB = nrm(AZ[k + 1] + SPLAY[k + 1])
      face(concrete, [lo.f[k], lo.f[k + 1], hi.f[k + 1], hi.f[k]], [nA, nB, nB, nA])
    }
    // the groove: two faces meeting in a V (channels too: their depth
    // shades them, no dark stripe)
    const vn = (e: V3, g: V3, sgn: number): V3 => {
      const t = unit(sub(e, g)), up: V3 = [0, 0, 1]
      const n = unit(cross(t, up))
      return dot(n, nrm(c + sgn * Math.PI / 2)) > 0 ? n : mul(n, -1)
    }
    flat(concrete, [lo.e0, lo.g[0], hi.g[0], hi.e0], vn(lo.e0, lo.g[0], 1))
    flat(concrete, [lo.g[0], lo.e1, hi.e1, hi.g[0]], vn(lo.e1, lo.g[0], -1))
  }
}

// --------------------------------------------------------- the top house ---
const K = 48
lathe([
  [R1 - 0.4, SHAFT_TOP], [9.0, 161.3], [12.0, 162.7],         // the ribbed saucer underside
  [15.0, 164.3],
  [15.5, 168.3],                                              // lower fascia
  [16.6, 173.6],                                              // restaurant / lower deck glass
  [17.3, 176.6],                                              // mid fascia
  [18.1, 180.3],                                              // upper deck glass
  [18.6, 180.6], [18.6, 181.3], [18.3, 181.5],                // rim lip
  [11.5, 184.2], [7.4, 184.4],                                // roof
  [5.8, 186.6], [3.6, 188.3], [0, 189.0],                     // the low domed cap
], (b) => [fascia, fascia, fascia, fascia, win, fascia, win, fascia, fascia, fascia, roof, roof, roof, roof, roof][b], K, 30)

/** Radial ribs under the top house: the sunburst seen from the plaza. */
{
  const N_RIB = 40, T = 0.18
  const DISH: [number, number][] = [[R1 - 0.4, SHAFT_TOP], [9.0, 161.3], [12.0, 162.7], [15.0, 164.3]]
  const under = (r: number) => {
    for (let k = 0; k < DISH.length - 1; k++) {
      const [ra, za] = DISH[k], [rb, zb] = DISH[k + 1]
      if (r <= rb) return za + ((r - ra) / (rb - ra)) * (zb - za)
    }
    return DISH[DISH.length - 1][1]
  }
  for (let i = 0; i < N_RIB; i++) {
    const a = ((i + 0.5) / N_RIB) * TAU
    const d: V3 = [Math.sin(a), Math.cos(a), 0], e: V3 = [Math.cos(a), -Math.sin(a), 0]
    const A = (r: number, z: number, s: number): V3 => add(add(mul(d, r), mul(e, s * T)), [0, 0, z])
    const r0 = R1 - 0.1, r1 = 14.9, h = 0.4
    const t0 = under(r0) + 0.05, t1 = under(r1) + 0.05, b0 = under(r0) - h, b1 = under(r1) - 0.15
    flat(concrete, [A(r0, b0, 1), A(r1, b1, 1), A(r1, t1, 1), A(r0, t0, 1)], e)
    flat(concrete, [A(r0, b0, -1), A(r0, t0, -1), A(r1, t1, -1), A(r1, b1, -1)], mul(e, -1))
    const nb = unit(cross(sub(A(r1, b1, 1), A(r0, b0, 1)), e))
    flat(concrete, [A(r0, b0, -1), A(r1, b1, -1), A(r1, b1, 1), A(r0, b0, 1)], nb[2] < 0 ? nb : mul(nb, -1))
  }
}

// Lights round the rim (beads, about every 2.4 m).
{
  const N_L = 48
  for (let i = 0; i < N_L; i++) {
    const a = (i / N_L) * TAU, c = P(18.35, a, 181.75), s = 0.3
    const d: V3 = [Math.sin(a), Math.cos(a), 0], e: V3 = [Math.cos(a), -Math.sin(a), 0]
    const q = (u: number, v: number, z: number) => add(add(add(c, mul(d, u)), mul(e, v)), [0, 0, z])
    const ring = (z: number) => [q(-s, -s, z), q(s, -s, z), q(s, s, z), q(-s, s, z)]
    const lo = ring(-0.3), hi = ring(0.3)
    for (let j = 0; j < 4; j++) {
      const j2 = (j + 1) % 4
      const n = unit(sub(add(lo[j], lo[j2]), mul(c, 2)))
      flat(lamp, [lo[j], lo[j2], hi[j2], hi[j]], [n[0], n[1], 0])
    }
    flat(lamp, hi, [0, 0, 1])
  }
}

// --------------------------------------------------------------- the mast ---
/** A tapered square mast, red with white bands, 189.4 to 228.6 m. */
{
  const Z0 = 188.8, Z1 = 228.6, W0 = 0.8, W1 = 0.25
  const bands = 9
  for (let i = 0; i < bands; i++) {
    const za = Z0 + ((Z1 - Z0) * i) / bands, zb = Z0 + ((Z1 - Z0) * (i + 1)) / bands
    const wa = W0 + ((W1 - W0) * i) / bands, wb = W0 + ((W1 - W0) * (i + 1)) / bands
    const part = i % 2 === 0 ? mast : concrete
    const sq = (w: number, z: number): V3[] => [[-w, -w, z], [w, -w, z], [w, w, z], [-w, w, z]]
    const a = sq(wa, za), b = sq(wb, zb)
    const ns: V3[] = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]]
    for (let j = 0; j < 4; j++) flat(part, [a[j], a[(j + 1) % 4], b[(j + 1) % 4], b[j]], ns[j])
    if (i === bands - 1) flat(part, b, [0, 0, 1])
  }
}

// ---------------------------------------------------------------- the base ---
// The pavilion ring (OSM way/351672060): glass walls under a deep eave and
// a low cone of standing-seam roof, round from bearing 2 to 326 degrees;
// the north-west wing fills the rest.
const DEG = Math.PI / 180
const B0 = 2 * DEG, B1 = 326 * DEG
lathe([[23.4, 0], [23.4, 3.2]], () => win, 36, 30, B0, B1)
lathe([[23.4, 3.2], [24.3, 3.45], [24.3, 3.65], [14.0, 6.4]], (b) => (b === 2 ? roof : fascia), 36, 30, B0, B1)
// Ends of the ring against the wing: plain walls.
for (const [az, sgn] of [[B0, -1], [B1, 1]] as const) {
  const n: V3 = [Math.cos(az) * sgn, -Math.sin(az) * sgn, 0]
  flat(concrete, [P(14.0, az, 0), P(24.3, az, 0), P(24.3, az, 3.65), P(14.0, az, 6.4)], n)
}
// The glass drum over it (way/351672058), and its flat roof to the shaft.
lathe([[14.0, 6.4], [14.0, 8.9], [14.2, 9.0], [14.2, 9.4], [R0 - 0.3, 9.4]], (b) => (b === 0 ? win : b === 3 ? roof : fascia), 36, 30)

// The north-west wing (way/351672056): flat roof at 6.6 m (lidar).
{
  const ll: [number, number][] = [
    [0.2, 16.4], [0.7, 23.9], [1.1, 29.4], [-0.8, 29.4], [-0.7, 30.6], [-2.7, 30.6], [-5.5, 30.3], [-8.7, 29.5],
    [-11.5, 28.6], [-14.3, 27.3], [-15.6, 26.4], [-15.0, 25.4], [-16.3, 24.6], [-13.3, 20.0], [-9.3, 13.7],
    [-8.0, 11.6], [-6.1, 12.7], [-3.4, 13.6], [-0.7, 14.0], [0.1, 14.0],
  ]
  // counter-clockwise from above
  let s = 0
  for (let i = 0; i < ll.length; i++) { const a = ll[i], b = ll[(i + 1) % ll.length]; s += a[0] * b[1] - b[0] * a[1] }
  const ring = s > 0 ? ll : [...ll].reverse()
  const H = 6.6
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const n = unit([b[1] - a[1], -(b[0] - a[0]), 0])
    flat(concrete, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H], [a[0], a[1], H]], n)
  }
  // a parapet-free flat roof, fanned from a point inside the wing
  const c: V3 = [-6.5, 22.0, H]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    roof.tri(c, [a[0], a[1], H], [b[0], b[1], H])
  }
  // a glass band along the wing's outer curve
  for (let i = 4; i < 11; i++) {
    const a = ll[i], b = ll[i + 1]
    const n = unit(s > 0 ? [b[1] - a[1], -(b[0] - a[0]), 0] : [-(b[1] - a[1]), b[0] - a[0], 0])
    const o = (p: [number, number], z: number): V3 => [p[0] + n[0] * 0.05, p[1] + n[1] * 0.05, z]
    flat(win, [o(a, 0.6), o(b, 0.6), o(b, 3.0), o(a, 3.0)], n)
  }
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos, pulled to the palette's lightness: the
// shaft's warm tan concrete; the top house dark, as every photo shows it
// (near-black glass drawn as a dark slate window, the slatted fascia and
// the underside a dark bronze-grey, the ribs pale concrete); the mast's red.
// Night: the shaft is floodlit evenly to the top (faces looking up barely),
// and the underside washed bright; the base buildings are not.
const shaftLit = (p: V3, n: V3): number =>
  (p[2] < 9.5 && Math.hypot(p[0], p[1]) > R0 + 0.5) || p[2] > 186 ? 0 : n[2] > 0.7 ? 0.15 : n[2] < -0.5 ? 0.85 : 0.9
const parts = [
  { part: concrete, material: { ...finish('tower-concrete', 0xd6c3a2), floodlight: shaftLit } },
  { part: fascia, material: finish('tower-fascia', 0x6c635a) },
  { part: win, material: { name: 'window', color: 0x505b66, roughness: 0.35 } },
  { part: roof, material: PALETTE.roof },
  { part: mast, material: finish('tower-mast-red', 0xc8453a) },
  { part: lamp, material: finish('lamp', 0xd8d2c4) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Tower of the Americas', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 228.6, anchor: [29.4190402, -98.4835734],
  replaces: ['way/78485919', 'way/351672055', 'way/351672056', 'way/351672057', 'way/351672058', 'way/351672059', 'way/351672060'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-tower-of-the-americas.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
