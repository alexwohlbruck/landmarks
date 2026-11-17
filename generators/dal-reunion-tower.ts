/**
 * Reunion Tower, Dallas: procedural, CC0-1.0.
 * bun generators/dal-reunion-tower.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation. The origin is the centroid of the OSM outline (way/1428779225,
 * the ball's 34 m circle), which is also the centre of OSM's core part.
 * y = 0 is the ground at the foot of the shaft.
 *
 * Opened 1978 (Welton Becket & Associates). Four slip-formed concrete
 * shafts, a central core and three outer cylinders, each outer one with a
 * glass-faced elevator run up its outward face, carry three round floors
 * inside an open geodesic sphere of aluminium struts with a light at every
 * joint.
 *
 * Published:
 * - 561 ft (171 m) to the top of the sphere (Wikipedia, "Reunion Tower");
 * - the sphere's 259 strut joints each carry a light, RGB LED since 2011
 *   (Wikipedia); a frequency-5 geodesic (252 joints) is drawn;
 * - GeO-Deck at about 470 ft (reuniontower.com, press).
 *
 * OSM: way/1428779225 (tower outline: the ball, min_height 137, height 170,
 * a dome part way/1491048358 on the same circle); the shafts as parts
 * way/1491048359 (core, 12 m circle, 160 m) and way/1491048355, -56, -57
 * (outer cylinders, 4.4 m circles about 9.5 m out, at bearings about 99,
 * 210 and 313).
 *
 * Measured from photos (scaled from the sphere's 34 m width, the OSM circle):
 * - the 2026 drone photo, taken from the east level with the ball and
 *   looking straight at one outer cylinder: shaft 17.3 m wide overall,
 *   outer cylinders 4.2 m across on a 7.5 m radius, the core about 9 m
 *   across between them, the glass strip 2 m wide on the cylinder's face;
 * - inside the ball, from the same photo and Kixmiller's 2017 close-up:
 *   machine drum r 8 to +12.5 m over the sphere's centre with a smaller
 *   cap, cornice r 14.8 at +8, glass restaurant level r 14.5 from -2.8 to
 *   +7.2, a ledge, the darker GeO-Deck band r 14.4 from -6 to -3.4, the
 *   white rim r 13.6 down to -7.8, and the saucer underside sweeping in to
 *   the shafts at -14.6 m (heights averaged between the drone photo, taken
 *   from a little above, and the close-ups from below);
 * - the open slots between cylinders and core (Highsmith 2013 photo and
 *   the drone photo): three groups, about 114-137, 79-92 and 40-52 m, with
 *   railed landings across them; concrete webs elsewhere.
 * Estimated: the cylinders' bearings (94, 214, 334: OSM's three points
 *   less their scatter, checked against the drone photo from the east),
 *   the core 9 m across (OSM maps 12 m, photos show it no wider than the
 *   gap between the cylinders allows), landing levels, web thickness,
 *   strut size (drawn 0.32 m, about twice the real tubes, so the lattice
 *   reads as a veil at map distance), lamp bead size (1.4 m).
 * Left out: the slip-form banding of the concrete, railings, the dark
 *   cable rings at the cylinder heads, mullions, the antennae on the drum,
 *   the round lobby building at the foot (OSM part way/1491048362, drawn by
 *   the map).
 * The 2018 USGS lidar (TX_Pecos_Dallas_B3_2018) has no returns on the
 *   shaft or the ball (classified out); it gives only the ground at the
 *   foot, 125 m NAVD88.
 *
 * Night: the joints (241 drawn; those under the saucer are cut) are `lamp` beads, the warm white of the original
 * fixtures (Highsmith's night photo; the LEDs now also run colour shows);
 * the GeO-Deck band is `window`, a lit ring under the ball; the restaurant
 * glass and the elevator strips are `glass` and stay dark, so the ball reads
 * as a sphere of points as in the night photos; the shafts are floodlit from
 * below.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Reunion Tower 2026.jpg", FeaturingDallas, CC BY-SA 4.0 (drone, east)
 * - "Reunion Tower Dallas Texas Closeup 2017.jpg", Robert Kixmiller, CC BY-SA 4.0
 * - "Reunion Tower, a 561-foot-high observation tower ... LCCN2014632137.tif",
 *   Carol M. Highsmith, public domain
 * - "Reunion-Tower-0244.jpg", "-0251", "-0259", "-0268", Loadmaster
 *   (David R. Tribble), CC BY-SA 3.0
 * - "Reunion Tower, Dallas, Texas.jpg", Texas Lane, CC BY-SA 4.0
 * - "Reunion Tower - Hyatt Regency.jpg", Farragutful, CC BY-SA 4.0
 * - "Reunion tower dallas.jpg", Batrak, CC BY-SA 2.0
 * - "Dallas reunion tower.jpg", Carol M. Highsmith, public domain (night)
 * - "Reunion Tower and the moon - Dallas, Texas.jpg", Shiva Shenoy, CC BY 4.0 (night)
 * No look-only sources used.
 *
 * Doubts: the shaft plan (cylinder bearings, core size, web thickness) is
 * read from photos, not drawings; the lidar has nothing above the podium.
 * The sphere diameter is OSM's circle (34 m), not a published figure. The
 * slot heights are scaled from two photos and may be a few metres off.
 * The real lattice is not exactly a frequency-5 icosahedral geodesic.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const TAU = Math.PI * 2
const RAD = Math.PI / 180
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

// ------------------------------------------------------------- materials ---
const concrete = new Part() // shafts, saucer, drum
const roof = new Part()     // flat roofs inside the ball
const lattice = new Part()  // the geodesic struts
const glazing = new Part()  // restaurant and elevator glass (light, reflective)
const dark = new Part()     // the GeO-Deck band, in shadow under the ledge
const lamps = new Part()    // a light at every joint

/** A quad facing `out` on average, with per-corner normals. */
function face(p: Part, P: V3[], N: V3[]) {
  const f = cross(sub(P[1], P[0]), sub(P[2], P[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(P[a], P[b], P[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(P[a], P[c], P[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const flat = (p: Part, P: V3[], n: V3) => face(p, P, [n, n, n, n])
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/**
 * A surface of revolution about the tower's axis from [r, z] points, left
 * side out; neighbouring bands under `smooth` degrees apart share normals.
 */
function lathe(profile: [number, number][], pick: (band: number) => Part | null, k: number, smooth = 40) {
  const bandN = profile.slice(0, -1).map(([r0, z0], b) => {
    const [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    return [ez / l, -er / l] as [number, number]
  })
  const cosLim = Math.cos(smooth * RAD)
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
    const N = (n: [number, number], a: number): V3 => unit([n[0] * Math.cos(a), n[0] * Math.sin(a), n[1]])
    for (let s = 0; s < k; s++) {
      const a0 = (s / k) * TAU, a1 = ((s + 1) / k) * TAU
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      const nn = [N(n0, a0), N(n0, a1), N(n1, a1), N(n1, a0)]
      if (r0 === 0) part.tri(q[0], q[2], q[3], undefined, undefined, undefined, [nn[0], nn[2], nn[3]])
      else if (r1 === 0) part.tri(q[0], q[1], q[2], undefined, undefined, undefined, [nn[0], nn[1], nn[2]])
      else face(part, q, nn)
    }
  }
}

/** A box in a horizontal (d, e) frame about centre c, from z0 to z1. */
function box(p: Part, c: V3, d: V3, e: V3, hd: number, he: number, z0: number, z1: number) {
  const at = (u: number, v: number, z: number): V3 => [c[0] + d[0] * u + e[0] * v, c[1] + d[1] * u + e[1] * v, z]
  const corners: [number, number][] = [[-hd, -he], [hd, -he], [hd, he], [-hd, he]]
  for (let i = 0; i < 4; i++) {
    const [u0, v0] = corners[i], [u1, v1] = corners[(i + 1) % 4]
    const mu = (u0 + u1) / 2, mv = (v0 + v1) / 2
    const n = unit([d[0] * mu / hd + e[0] * mv / he, d[1] * mu / hd + e[1] * mv / he, 0])
    flat(p, [at(u0, v0, z0), at(u1, v1, z0), at(u1, v1, z1), at(u0, v0, z1)], n)
  }
  flat(p, corners.map(([u, v]) => at(u, v, z1)), [0, 0, 1])
  flat(p, corners.map(([u, v]) => at(u, v, z0)), [0, 0, -1])
}

// ---------------------------------------------------------------- sphere ---
const R = 17          // OSM's 34 m circle; min_height 137 + 34 = 171 published
const CZ = 171 - R    // the sphere's centre, 154 m

// --------------------------------------------------------------- shafts ---
const CORE_R = 4.5
const COL_D = 7.5, COL_R = 2.1, GLASS_HALF = 1.0
const COL_BEARINGS = [94, 214, 334]
const COL_TOP = 142.2     // inside the saucer
const CORE_TOP = 162      // up through the ball to the roof
/** Open slots between each cylinder and the core, and the landings across them. */
const SLOTS: { z0: number; z1: number; landings: number[] }[] = [
  { z0: 40, z1: 52, landings: [45.5] },
  { z0: 79, z1: 92, landings: [85] },
  { z0: 114, z1: 137.5, landings: [120.5, 130] },
]

// The core: a plain cylinder, smooth-shaded.
lathe([[CORE_R, 0], [CORE_R, CORE_TOP]], () => concrete, 20)

for (const bd of COL_BEARINGS) {
  const b = bd * RAD
  const d: V3 = [Math.sin(b), Math.cos(b), 0]   // outward
  const e: V3 = [Math.cos(b), -Math.sin(b), 0]  // along the tangent
  const c: V3 = mul(d, COL_D)
  // The cylinder: an arc round the back, a flat chord on the outward face
  // carrying the elevator glass.
  const phi = Math.asin(GLASS_HALF / COL_R)
  const n = 14
  const ring: { p: [number, number]; n: [number, number] }[] = []
  for (let i = 0; i <= n; i++) {
    const a = phi + (i / n) * (TAU - 2 * phi)
    ring.push({ p: [COL_R * Math.cos(a), COL_R * Math.sin(a)], n: [Math.cos(a), Math.sin(a)] })
  }
  const W = (u: number, v: number, z: number): V3 => [c[0] + d[0] * u + e[0] * v, c[1] + d[1] * u + e[1] * v, z]
  const Wn = (u: number, v: number): V3 => unit([d[0] * u + e[0] * v, d[1] * u + e[1] * v, 0])
  for (let i = 0; i < n; i++) {
    const A = ring[i], B = ring[i + 1]
    face(concrete, [W(...A.p, 0), W(...B.p, 0), W(...B.p, COL_TOP), W(...A.p, COL_TOP)],
      [Wn(...A.n), Wn(...B.n), Wn(...B.n), Wn(...A.n)])
  }
  // The glass face, flush on the chord, the whole height of the shaft.
  const u0 = COL_R * Math.cos(phi)
  flat(glazing, [W(u0, -GLASS_HALF, 0), W(u0, GLASS_HALF, 0), W(u0, GLASS_HALF, COL_TOP), W(u0, -GLASS_HALF, COL_TOP)], d)
  // Webs tying the cylinder to the core, broken by the slots.
  const webC = mul(d, (CORE_R - 0.4 + COL_D) / 2), webHD = (COL_D - CORE_R + 0.4) / 2
  let z = 0
  for (const s of SLOTS) {
    box(concrete, webC, d, e, webHD, 0.6, z, s.z0)
    for (const zl of s.landings) box(concrete, webC, d, e, webHD, 1.1, zl - 0.5, zl + 0.5)
    z = s.z1
  }
  box(concrete, webC, d, e, webHD, 0.6, z, COL_TOP)
}

// ----------------------------------------------------------------- ball ---
// Radii and heights from the photos (see header), relative to CZ.
const K = 40
const Z = (dz: number) => CZ + dz
// Photos from below (Kixmiller, Highsmith) put each front edge a little
// high and the drone photo from above a little low; these are between.
lathe([
  [CORE_R - 0.1, Z(-14.6)], [7.5, Z(-14.0)], [10.0, Z(-12.6)], [12.0, Z(-10.6)], [13.3, Z(-8.2)], // saucer
  [13.6, Z(-7.8)], [13.6, Z(-6.0)], [14.4, Z(-6.0)], // the white rim, the deck floor
], () => concrete, K, 35)
lathe([[14.4, Z(-6.0)], [14.4, Z(-3.4)]], () => dark, K)           // GeO-Deck band
lathe([
  [14.4, Z(-3.4)], [15.0, Z(-3.4)], [15.0, Z(-2.8)], [14.5, Z(-2.8)], // ledge
], () => concrete, K)
lathe([[14.5, Z(-2.8)], [14.5, Z(7.2)]], () => glazing, K)        // restaurant glass
lathe([
  [14.5, Z(7.2)], [14.8, Z(7.3)], [14.8, Z(7.9)], [14.5, Z(8.0)], // cornice
], () => concrete, K)
lathe([[14.5, Z(8.0)], [8.0, Z(8.0)]], () => roof, K)
lathe([[8.0, Z(8.0)], [8.0, Z(12.5)]], () => concrete, 24)          // machine drum
lathe([[8.0, Z(12.5)], [4.0, Z(12.5)]], () => roof, 24)
lathe([[4.0, Z(12.5)], [4.0, Z(15.0)]], () => concrete, 16)         // cap
lathe([[4.0, Z(15.0)], [0, Z(15.0)]], () => roof, 16)

// ------------------------------------------------------------- geodesic ---
/**
 * A frequency-5 geodesic sphere (icosahedron, a joint at the top): 252
 * joints and 750 struts, against the real 259 joints. The joints below the
 * saucer, where the shafts come through, are left out.
 */
const FREQ = 5
const BOTTOM_CUT = -15.8  // no joints below this, relative to the centre
{
  const t = (1 + Math.sqrt(5)) / 2
  let ico: V3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
    [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map((v) => unit(v as V3))
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6],
    [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10],
    [8, 6, 7], [9, 8, 1],
  ]
  // Turn vertex 0 to the top (+z).
  const top = ico[0], axis = unit(cross(top, [0, 0, 1])), ang = Math.acos(top[2])
  const rot = (v: V3): V3 => {
    const c = Math.cos(ang), s = Math.sin(ang), k = axis
    const kv = cross(k, v), kd = dot(k, v)
    return add(add(mul(v, c), mul(kv, s)), mul(k, kd * (1 - c)))
  }
  ico = ico.map(rot)
  const verts: V3[] = [], index = new Map<string, number>()
  const vid = (v: V3) => {
    const u = unit(v), key = u.map((x) => x.toFixed(5)).join(',')
    let i = index.get(key)
    if (i === undefined) { i = verts.length; verts.push(u); index.set(key, i) }
    return i
  }
  const edges = new Set<string>()
  const edge = (a: number, b: number) => edges.add(a < b ? `${a},${b}` : `${b},${a}`)
  for (const [ia, ib, ic] of faces) {
    const A = ico[ia], B = ico[ib], C = ico[ic]
    const g = (i: number, j: number) => vid(add(add(mul(A, (FREQ - i - j) / FREQ), mul(B, i / FREQ)), mul(C, j / FREQ)))
    for (let i = 0; i < FREQ; i++) for (let j = 0; j < FREQ - i; j++) {
      const p = g(i, j), q = g(i + 1, j), r = g(i, j + 1)
      edge(p, q); edge(q, r); edge(r, p)
    }
  }
  const pos = (i: number, r = R): V3 => add([0, 0, CZ], mul(verts[i], r))
  const keep = (i: number) => verts[i][2] * R >= BOTTOM_CUT
  // Struts: a flat strap on the sphere with a keel behind it, so a strut
  // reads face-on and edge-on alike. Double-sided.
  const SW = 0.32 / 2, KEEL = 0.3
  let struts = 0
  for (const k of edges) {
    const [a, b] = k.split(',').map(Number)
    if (!keep(a) || !keep(b)) continue
    const pa = pos(a), pb = pos(b)
    const na = verts[a], nb = verts[b]
    const along = unit(sub(pb, pa))
    const side = (n: V3) => unit(cross(n, along))
    const sa = side(na), sb = side(nb)
    face(lattice, [add(pa, mul(sa, -SW)), add(pb, mul(sb, -SW)), add(pb, mul(sb, SW)), add(pa, mul(sa, SW))], [na, nb, nb, na])
    flat(lattice, [pa, pb, sub(pb, mul(nb, KEEL)), sub(pa, mul(na, KEEL))], sa)
    struts++
  }
  // Lamps: a flat bead over every joint, 1.4 m across (the real fixtures
  // are 16 in discs; drawn larger so the ball reads as points of light
  // from map distance).
  let joints = 0
  for (let i = 0; i < verts.length; i++) {
    if (!keep(i)) continue
    const n = verts[i], c = pos(i, R + 0.05)
    const u = unit(cross(n, Math.abs(n[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])), v = cross(n, u)
    const rim = [0, 1, 2].map((k) => add(c, add(mul(u, 0.8 * Math.cos((k * TAU) / 3)), mul(v, 0.8 * Math.sin((k * TAU) / 3)))))
    const out = add(c, mul(n, 0.3)), inn = sub(c, mul(n, 0.12))
    for (let k = 0; k < 3; k++) {
      const a = rim[k], b = rim[(k + 1) % 3]
      // One normal per bead, so its corners weld: it is a point of light.
      lamps.tri(a, b, out, undefined, undefined, undefined, [n, n, n])
      lamps.tri(b, a, inn, undefined, undefined, undefined, [mul(n, -1), mul(n, -1), mul(n, -1)])
    }
    joints++
  }
  console.log(`geodesic: ${joints} joints, ${struts} struts`)
}

// ---------------------------------------------------------------- output ---
// Concrete: the warm grey-beige of the slip-formed shafts (photos, sunlit
// between #c6bba9 and #d8cfc2), pulled to the palette's lightness. The
// lattice is bright aluminium. The restaurant glass reads light and sky-blue
// in daylight, as does the elevator glass; the deck band darker.
// At night floodlights at the foot wash the shafts, fading with height,
// kept moderate so the ball stays the brightest thing (night photos).
const shaftLit = (p: V3, n: V3): number =>
  p[2] > 137 ? 0 : n[2] > 0.7 ? 0.15 : 0.6 - 0.3 * Math.min(1, p[2] / 140)
const parts = [
  { part: concrete, material: { ...finish('reunion-concrete', 0xddd3c4), floodlight: shaftLit } },
  { part: roof, material: PALETTE.roof },
  { part: lattice, material: { ...finish('reunion-lattice', 0xd2d8de, 0.5), doubleSided: true } },
  // Named `glass` so it stays dark at night and the lamp beads carry the ball.
  { part: glazing, material: { name: 'glass', color: 0x86a9c9, roughness: 0.24 } },
  { part: dark, material: PALETTE.window },
  { part: lamps, material: finish('lamp', 0xd4d8db, 0.5) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Reunion Tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 171,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/dal-reunion-tower.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
