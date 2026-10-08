/**
 * Bahá'í House of Worship for North America, Wilmette (1953, Louis
 * Bourgeois) — original procedural geometry, CC0-1.0.
 * bun generators/chi-bahai-temple.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = centroid of OSM way/369160462, 42.074437, -87.684290.
 * Bearing 0: the nine faces are drawn at their real bearings.
 *
 * Identity: a white, nine-sided temple of lace-like cast concrete. From the
 * ground up: broad stairs on all sides to a raised floor; a nine-sided
 * ground storey with a great arched entrance in every face and a tall
 * pylon at every corner; a smaller nine-sided gallery storey of tall
 * tracery windows with its own nine pylons; a short clerestory drum; and
 * a tall, slightly pointed dome with nine ribs, crowned by a small finial.
 * White is the identity, so the body is a near-white finish; the dome's
 * lacework (glass behind pierced concrete) reads a shade greyer than the
 * ribs, which is how the photos show it.
 *
 * Abstraction: the ornament (tracery, the religious symbols on the pylons,
 * inscriptions) is left out. Each face's entrance is one arched `window`
 * panel (the entrances are glazed and lit at night); the gallery's tracery
 * windows are one tall arched panel per face; the clerestory has two small
 * arched windows per face. The stairs are one sloped nine-sided skirt.
 *
 * Evidence:
 *  - plan: OSM way/369160462, a nine-lobed outline ≈ 20–22 m in radius.
 *    The nine entrance nodes all lie 20.0–20.4 m from the centroid at
 *    bearings 4.8° + 40°·k (fitted), so the ground storey's faces are drawn
 *    with a 20.2 m apothem facing those bearings.
 *  - published: 58.2 m tall; floor to dome ceiling 42 m; interior dome 22 m
 *    across (Wikipedia); exterior dome ≈ 90 ft (27 m) across.
 *  - measured in the photos (Purpy Pupple's frontal view, scaled by the
 *    ground storey's 42.6 m width; the drone view for the dome's shape):
 *    raised floor ≈ 5 m, ground storey cornice ≈ 18 m, its pylons ≈ 23 m;
 *    gallery storey corner radius ≈ 13.5 m, to ≈ 31 m, its pylons ≈ 34
 *    m; drum to 36 m; dome 18.5 m high (1.37 × its radius), finial to 58.2
 *    m. Estimates, ± 2 m.
 *  - OSM height=14 is taken as the ground storey above its floor.
 *
 * Photos (Wikimedia Commons): Wilmette_Bahai_Temple.jpg (WikiTome, CC BY-SA
 * 3.0); Bahai_Temple_from_drone.jpg (Joshua Hoffman, CC BY-SA 4.0);
 * Bahai_House_of_Worship_Wilmette_SL15_05R04L_small.jpg (VasuVR, CC BY-SA
 * 4.0); Bahai_Wilmette_Alt.jpg (Purpy Pupple, CC BY 3.0); Bahai_Temple_
 * (20365734404).jpg (Ashley Frillman, CC BY-SA 2.0); The_Baháʼí_House_of_
 * Worship.jpg (Ritwik Chattopadhyay, CC BY-SA 4.0). USGS NAIP for the
 * plan. No commercial imagery.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { block, lathe, save, walls, cap, type XY } from './chi-museum-of-science-industry'

const white = new Part(), lace = new Part(), win = new Part(), stone = new Part()
const TAU = Math.PI * 2
const N = 9
const FACE0 = (4.8 * Math.PI) / 180 // bearing of the first face's centre

/** The nine-gon with apothem `a`: corners counter-clockwise, half a face either side of each face centre. */
function nonagon(a: number): XY[] {
  const rc = a / Math.cos(Math.PI / N)
  return Array.from({ length: N }, (_, k) => {
    // Corner k sits between face k and face k+1 (clockwise in bearing), so
    // walk the corners by decreasing bearing to go counter-clockwise.
    const b = FACE0 - (k + 0.5) * (TAU / N)
    return [rc * Math.sin(b), rc * Math.cos(b)] as XY
  })
}
/** Face k's centre bearing. */
const faceBearing = (k: number) => FACE0 - k * (TAU / N)

/**
 * An arched panel flush on face k of a nonagon with apothem `a`: width w,
 * from z0 to the springing zs, then a semicircular head.
 */
function arch(p: Part, a: number, k: number, w: number, z0: number, zs: number, out = 0.06) {
  const b = faceBearing(k)
  const n: XY = [Math.sin(b), Math.cos(b)], t: XY = [Math.cos(b), -Math.sin(b)] // t: along the face, clockwise
  const P = (u: number, z: number): V3 => [n[0] * (a + out) - t[0] * u, n[1] * (a + out) - t[1] * u, z]
  const h = w / 2
  p.quad(P(-h, z0), P(h, z0), P(h, zs), P(-h, zs))
  const SEG = 8
  for (let i = 0; i < SEG; i++) {
    const a0 = Math.PI * (i / SEG), a1 = Math.PI * ((i + 1) / SEG)
    p.tri(P(0, zs), P(h * Math.cos(a0), zs + h * Math.sin(a0)), P(h * Math.cos(a1), zs + h * Math.sin(a1)))
  }
}

/** A square pylon at (x, y) from z0 to z1, with a flared capital. */
function pylon(x: number, y: number, z0: number, z1: number, s: number) {
  const sq = (h: number): XY[] => [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]]
  walls(white, sq(s), z0, z1 - 1.6)
  walls(white, sq(s), z1 - 1.6, z1 - 0.5, sq(s * 1.55))
  block(white, white, sq(s * 1.55), z1 - 0.5, z1, 0.15)
}

// --- Stairs and raised floor -------------------------------------------------
const FLOOR = 5, G_TOP = 18, G_PYLON = 23
const A_G = 20.2                      // ground storey apothem (entrance nodes)
const A_S = A_G + 5.5                 // foot of the stairs
const ground = nonagon(A_G), skirt = nonagon(A_S)
walls(stone, skirt, 0, 1.0)
walls(stone, skirt, 1.0, FLOOR, nonagon(A_G + 0.6))
cap(stone, nonagon(A_G + 0.6), FLOOR)

// --- Ground storey -------------------------------------------------------------
walls(white, ground, FLOOR, G_TOP - 1.2)
// A projecting bevelled cornice and the roof terrace between storeys.
walls(white, ground, G_TOP - 1.2, G_TOP - 0.4, nonagon(A_G + 0.7))
walls(white, nonagon(A_G + 0.7), G_TOP - 0.4, G_TOP, nonagon(A_G + 0.3))
const A_U = 13.5 * Math.cos(Math.PI / N) // gallery storey apothem (corner radius 13.5)
{
  const o = nonagon(A_G + 0.3), i = nonagon(A_U)
  for (let k = 0; k < N; k++) {
    const l = (k + 1) % N
    white.quad([i[k][0], i[k][1], G_TOP], [o[k][0], o[k][1], G_TOP], [o[l][0], o[l][1], G_TOP], [i[l][0], i[l][1], G_TOP])
  }
}
// The great entrance arch in every face, with a narrow arched window
// either side of it.
for (let k = 0; k < N; k++) arch(win, A_G, k, 6.4, FLOOR, 12.6)
for (let k = 0; k < N; k++) {
  for (const du of [-5.6, 5.6]) {
    const b = faceBearing(k)
    const n: XY = [Math.sin(b), Math.cos(b)], t: XY = [Math.cos(b), -Math.sin(b)]
    const P = (u: number, z: number): V3 => [n[0] * (A_G + 0.06) - t[0] * (u + du), n[1] * (A_G + 0.06) - t[1] * (u + du), z]
    const h = 1.2, z0 = FLOOR + 1.2, zs = 11.4
    win.quad(P(-h, z0), P(h, z0), P(h, zs), P(-h, zs))
    for (let i = 0; i < 6; i++) {
      const a0 = Math.PI * (i / 6), a1 = Math.PI * ((i + 1) / 6)
      win.tri(P(0, zs), P(h * Math.cos(a0), zs + h * Math.sin(a0)), P(h * Math.cos(a1), zs + h * Math.sin(a1)))
    }
  }
}
for (const [x, y] of ground) pylon(x, y, FLOOR, G_PYLON, 1.15)

// --- Gallery storey ---------------------------------------------------------------
const U_TOP = 31, U_PYLON = 34
const upper = nonagon(A_U)
walls(white, upper, G_TOP, U_TOP - 1)
walls(white, upper, U_TOP - 1, U_TOP - 0.3, nonagon(A_U + 0.6))
walls(white, nonagon(A_U + 0.6), U_TOP - 0.3, U_TOP, nonagon(A_U + 0.2))
for (let k = 0; k < N; k++) arch(win, A_U, k, 5.2, G_TOP + 2.2, 25.8)
for (const [x, y] of upper) pylon(x, y, G_TOP, U_PYLON, 0.9)

// --- Clerestory drum, dome, ribs, finial ----------------------------------------
const R = 13.2, DRUM = 36, DOME_H = 18.5
lathe(white, 0, 0, [[A_U + 0.2, U_TOP], [R, U_TOP], [R, DRUM]], 18, FACE0)
for (let k = 0; k < 18; k++) {
  const b = FACE0 - (k + 0.5) * (TAU / 18)
  const n: XY = [Math.sin(b), Math.cos(b)], t: XY = [Math.cos(b), -Math.sin(b)]
  const P = (u: number, z: number): V3 => [n[0] * (R * Math.cos(Math.PI / 18) + 0.06) - t[0] * u, n[1] * (R * Math.cos(Math.PI / 18) + 0.06) - t[1] * u, z]
  win.quad(P(-0.8, 32), P(0.8, 32), P(0.8, 34.2), P(-0.8, 34.2))
}
// Dome profile: a slightly pointed curve, 1.37 × its radius tall.
const prof: XY[] = []
const STEPS = 9
for (let i = 0; i <= STEPS; i++) {
  const t = i / STEPS
  const r = R * Math.pow(Math.cos((t * Math.PI) / 2), 0.85)
  prof.push([Math.max(r, 0), DRUM + DOME_H * Math.sin((t * Math.PI) / 2)])
}
lathe(lace, 0, 0, prof, 18, FACE0)
/** A quad wound so its normal points away from `core`. */
function face(a: V3, b: V3, c: V3, d: V3, core: V3) {
  const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]
  const m = [(a[0] + c[0]) / 2 - core[0], (a[1] + c[1]) / 2 - core[1], (a[2] + c[2]) / 2 - core[2]]
  if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0) white.quad(a, b, c, d)
  else white.quad(d, c, b, a)
}
// Nine ribs over the corners of the gallery storey, standing 0.5 m proud.
for (let k = 0; k < N; k++) {
  const b = FACE0 - (k + 0.5) * (TAU / N)
  const n: XY = [Math.sin(b), Math.cos(b)], t: XY = [Math.cos(b), -Math.sin(b)]
  // Offsets follow the dome's surface normal, so the rib stands proud all
  // the way up rather than sinking where the dome flattens.
  const nrm = prof.map((_, i) => {
    const [ra, za] = prof[Math.max(0, i - 1)], [rb, zb] = prof[Math.min(prof.length - 1, i + 1)]
    const l = Math.hypot(zb - za, rb - ra) || 1
    return [(zb - za) / l, -(rb - ra) / l] as XY
  })
  const Q = (i: number, u: number, d: number): V3 => {
    const [r, z] = prof[i], [nr, nz] = nrm[i]
    return [n[0] * (r + d * nr) + t[0] * u, n[1] * (r + d * nr) + t[1] * u, z + d * nz]
  }
  const w = (i: number) => 0.75 * (prof[i][0] / R) + 0.25
  for (let i = 0; i < STEPS - 1; i++) {
    const j = i + 1
    // Outer face and two sides, each wound to face away from the rib's core.
    const core = Q(i, 0, 0)
    face(Q(i, w(i), 0.55), Q(i, -w(i), 0.55), Q(j, -w(j), 0.55), Q(j, w(j), 0.55), core)
    face(Q(i, -w(i), -0.2), Q(j, -w(j), -0.2), Q(j, -w(j), 0.55), Q(i, -w(i), 0.55), core)
    face(Q(i, w(i), 0.55), Q(j, w(j), 0.55), Q(j, w(j), -0.2), Q(i, w(i), -0.2), core)
  }
}
lathe(white, 0, 0, [[1.6, DRUM + DOME_H - 0.4], [1.2, DRUM + DOME_H + 0.6], [0.5, DRUM + DOME_H + 1.4], [0.25, 58.2], [0, 58.2]], 9, FACE0)

await save('chi-bahai-temple', "Bahá'í House of Worship", [
  { part: white, material: finish('lace-white', 0xf4f3ee) },
  { part: lace, material: finish('lace-dome', 0xdcddda) },
  { part: win, material: { ...PALETTE.window, color: 0x8e9caa } },
  { part: stone, material: PALETTE.stone },
], { height: 58.2 })
