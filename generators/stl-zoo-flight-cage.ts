/**
 * The 1904 World's Fair Flight Cage, Saint Louis Zoo, Forest Park (built by
 * the Smithsonian Institution for the Louisiana Purchase Exposition; bought
 * by the city in 1905, the zoo's beginning) — procedural, CC0-1.0, no
 * textures.  bun generators/stl-zoo-flight-cage.ts
 *
 * Map frame: x across the cage, y along it (toward 109.8°, east-south-east),
 * z up, metres. Bearing 109.8°: the principal axis of the cage's fence in
 * OSM (barrier=fence zoo=aviary ways 1416451058, 1496130284, 1496130285,
 * which close round the cage's foot). Anchor -90.2874758, 38.6355517: the
 * fence's centre (the cage's attraction node/13016608733 is 1 m away).
 * The cage is not a building in OSM, so the model replaces nothing.
 *
 * The cage: a long barrel vault of black steel arches over a straight
 * middle, its two ends half-domes of ribs radiating from the last arch's
 * crown, purlins running round it, all clad in wire mesh. Inside, the
 * Cypress Swamp (its water is the map's) and its trees.
 *
 * Measured (OSM fence): 67.9 m long, 26.3 m wide; the ends semicircles of
 * 13.15 m. Published: 228 ft long, 84 ft wide, 50 ft (15.2 m) high (Saint
 * Louis Zoo). The USGS lidar (2017–18) passes through the mesh and shows
 * only the trees, so the height is the published one.
 * Estimated from the photo: the section, an upright half-ellipse (13.15 m
 * across the half, 15.2 m high), the eleven arches 4.2 m apart along the
 * straight, eight ribs in each half-dome, four purlins. The base rail is
 * left out: the ground rises 2.6 m across the cage and the map stands the
 * model rigidly, so the uphill feet sink up to 2 m.
 *
 * Mesh: translucent (STYLE.md, "Translucent glass"): named `glass` so it
 * stays dark at night, a light grey at 12% opacity, double-sided, nearly
 * see-through as in the photo; the arches,
 * ribs and purlins are bold charcoal steel (#4a4f57) strips crossed with
 * fins so they read edge-on and from inside; the trees show through.
 *
 * Photos:
 *   - "1904 Flight Cage.JPG", Robert Lawton, CC BY-SA 2.5,
 *     https://commons.wikimedia.org/wiki/File:1904_Flight_Cage.JPG
 *     (an end: the half-dome's radiating ribs, arches, purlins, mesh) — EVIDENCE;
 *   - "U.S. Government Bird Cage at the 1904 World's Fair.jpg", Official
 *     Photographic Company, public domain (the cage in 1904) — EVIDENCE.
 * Look-only (NC/ND): fotobydave, "1904 Worlds Fair Flight Cage" (Flickr).
 * Doubts: only one modern photo; the number of arches and purlins is
 * estimated, the inner posts and the entrance vestibules are left out.
 */
import { Part, type V3 } from './mesh'
import { finish } from './palette'
import { save } from './atl-tech-tower'

const mesh = new Part(), steel = new Part(), trees = new Part()
const A = 13.15, H = 15.2, HALF = 33.95 - A // the straight's half-length
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** A point on the cage's skin: t across (0 = one foot, π = the other) at y, or on an end dome. */
const arch = (t: number, y: number): V3 => [A * Math.cos(t), y, H * Math.sin(t)]
/** On an end half-dome: meridian angle φ (0 = along +x, π = along -x, through the end) and elevation t. */
const dome = (phi: number, t: number, sgn: 1 | -1): V3 => [A * Math.cos(t) * Math.cos(phi), sgn * (HALF + A * Math.cos(t) * Math.sin(phi)), H * Math.sin(t)]
/** The skin's outward normal at a point (an ellipsoid / elliptic cylinder). */
const nrm = (p: V3): V3 => {
  const yy = Math.abs(p[1]) > HALF ? (Math.abs(p[1]) - HALF) * Math.sign(p[1]) : 0
  return norm([p[0] / (A * A), yy / (A * A), p[2] / (H * H)])
}

/** A steel member: a strip on the skin crossed with a radial fin. */
function member(a: V3, b: V3, w = 0.45, d = 0.45) {
  const m = mul(add(a, b), 0.5), n = nrm(m), t = norm(sub(b, a)), s = norm(cross(t, n))
  const A2 = add(a, mul(nrm(a), 0.1)), B2 = add(b, mul(nrm(b), 0.1))
  steel.quad(add(A2, mul(s, -w / 2)), add(B2, mul(s, -w / 2)), add(B2, mul(s, w / 2)), add(A2, mul(s, w / 2)))
  steel.quad(add(A2, mul(n, -d / 2)), add(B2, mul(n, -d / 2)), add(B2, mul(n, d / 2)), add(A2, mul(n, d / 2)))
}

const SEG = 12 // segments over an arch
const ts = Array.from({ length: SEG + 1 }, (_, i) => (Math.PI * i) / SEG)
// the straight: eleven arches and the mesh between them
const BAYS = 10
const ys = Array.from({ length: BAYS + 1 }, (_, i) => -HALF + (2 * HALF * i) / BAYS)
for (const y of ys) for (let i = 0; i < SEG; i++) member(arch(ts[i], y), arch(ts[i + 1], y), 0.55, 0.3)
for (let j = 0; j < BAYS; j++) for (let i = 0; i < SEG; i++) mesh.quad(arch(ts[i], ys[j]), arch(ts[i + 1], ys[j]), arch(ts[i + 1], ys[j + 1]), arch(ts[i], ys[j + 1]))
// the end half-domes: eight ribs from the foot to the last arch's crown, mesh
const MER = 8, ROWS = 6
for (const sgn of [1, -1] as const) {
  const phis = Array.from({ length: MER + 1 }, (_, i) => (Math.PI * i) / MER)
  const es = Array.from({ length: ROWS + 1 }, (_, i) => (Math.PI / 2) * (i / ROWS))
  for (let i = 0; i <= MER; i++) for (let k = 0; k < ROWS; k++) {
    if (i > 0 && i < MER) member(dome(phis[i], es[k], sgn), dome(phis[i], es[k + 1], sgn), 0.65, 0.7) // the radiating ribs, bold
  }
  for (let i = 0; i < MER; i++) for (let k = 0; k < ROWS; k++) {
    const q = [dome(phis[i], es[k], sgn), dome(phis[i + 1], es[k], sgn), dome(phis[i + 1], es[k + 1], sgn), dome(phis[i], es[k + 1], sgn)]
    if (k === ROWS - 1) mesh.tri(q[0], q[1], q[2]) // the crown: the ribs meet
    else mesh.quad(q[0], q[1], q[2], q[3])
  }
  // purlins on the dome
  for (const k of [1, 2, 3, 4]) for (let i = 0; i < MER; i++) member(dome(phis[i], es[k], sgn), dome(phis[i + 1], es[k], sgn), 0.35, 0.35)
}
// purlins and base rails along the straight (the same elevations as the domes' rings)
for (const k of [1, 2, 3, 4]) for (const side of [0, 1]) {
  const t = side === 0 ? (Math.PI / 2) * (k / ROWS) : Math.PI - (Math.PI / 2) * (k / ROWS)
  for (let j = 0; j < BAYS; j++) member(arch(t, ys[j]), arch(t, ys[j + 1]), 0.35, 0.35)
}
// the ridge
for (let j = 0; j < BAYS; j++) member(arch(Math.PI / 2, ys[j]), arch(Math.PI / 2, ys[j + 1]), 0.45, 0.45)

// Inside: the swamp's trees (bald cypress and others), seen through the mesh.
function tree(x: number, y: number, h: number, r: number) {
  const n = 6, rings: [number, number][] = [[0.45, 0], [0.6, 0.9], [0.85, 0.75], [1.0, 0]]
  for (let i = 0; i < n; i++) { // trunk, a thin triangular prism
    const a0 = (i / 3) * 2 * Math.PI, a1 = ((i + 1) / 3) * 2 * Math.PI
    if (i >= 3) break
    const P = (a: number, z: number): V3 => [x + Math.cos(a) * 0.3, y + Math.sin(a) * 0.3, z]
    trees.quad(P(a0, 0), P(a1, 0), P(a1, h * 0.5), P(a0, h * 0.5))
  }
  for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < n; i++) {
    const P = (kk: number, ii: number): V3 => { const a = (ii / n) * 2 * Math.PI + kk * 0.4; return [x + Math.cos(a) * r * rings[kk][1], y + Math.sin(a) * r * rings[kk][1], h * rings[kk][0]] }
    const a = P(k, i), b = P(k, i + 1), c = P(k + 1, i + 1), d = P(k + 1, i)
    if (rings[k][1] > 0) trees.tri(a, b, c)
    if (rings[k + 1][1] > 0) trees.tri(a, c, d)
  }
}
const TREES: [number, number, number, number][] = [[-5, -24, 11, 3.5], [4, -14, 12.5, 4], [-6, -4, 10, 3.5], [5, 6, 12, 4], [-4, 15, 11, 3.5], [3, 25, 9.5, 3], [-7, 28, 8, 3], [7, -27, 8.5, 3]]
for (const [x, y, h, r] of TREES) tree(x, y, h, r)

await save('stl-zoo-flight-cage', "1904 World's Fair Flight Cage", [
  { part: mesh, material: { name: 'glass', color: 0x9aa1a6, roughness: 0.6, opacity: 0.12, doubleSided: true } },
  { part: steel, material: { ...finish('flight-cage-steel', 0x4a4f57), doubleSided: true } },
  { part: trees, material: finish('flight-cage-trees', 0x6f9a62) },
], { height: H, anchor: [38.6355517, -90.2874758], bearing: 109.8 }, 6500)
