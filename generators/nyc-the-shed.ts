/**
 * The Shed (Bloomberg Building) — procedural, CC0-1.0, no textures.
 * bun generators/nyc-the-shed.ts
 *
 * Map frame: x = model east (the Shed Plaza), y = model north, z up,
 * metres. Placed at bearing 29°, the Manhattan grid. Anchor: area centroid
 * of the OSM outline way/681503639, which takes in both the fixed building
 * and the plaza the shell rolls out over.
 *
 * Drawn with the shell deployed over the plaza, as the photos, the NAIP
 * orthophoto and OSM all show it: the fixed eight-storey glass building at
 * the west end of the lot against 15 Hudson Yards, and the telescoping
 * shell beside it to the east. The shell is a long vault with strongly
 * rounded shoulders, clad in broad diamond-quilted pillows of ETFE (drawn
 * as leaning diamonds, each a shallow pyramid so the flat-shaded facets
 * read as pillows), its gable ends framed by a rounded steel rim; its skin
 * pinches down to the bogies at the corners and mid-sides over a glazed
 * ground floor.
 *
 * Evidence
 * - OSM way/681503639 (outline, 40 m) and parts 1220655932 (40–48 m, the
 *   shell's roof over the plaza: x −3.2…44.8, y −17…27 here, the shell's
 *   plan) and 1220614724 (5.5 m, the low strip on the south side under the
 *   High Line spur). The fixed building is the rest of the outline,
 *   x −38…−3.
 * - USGS NAIP orthophoto (/tmp/city/nyc/work/nyc-the-shed/naip.png): the
 *   pale shell roof over the plaza, about 46 × 43 m, rounded at its edges.
 * - Published: eight storeys; shell of exposed steel clad in ETFE, rolling
 *   on eight bogies along rails onto the plaza to enclose the McCourt;
 *   Diller Scofidio + Renfro with Rockwell Group, 2019 (Wikipedia).
 * - The 2017 USGS lidar predates the building (the lot reads as
 *   construction).
 * - Photos (Wikimedia Commons, daylight; from the plaza to the north-east
 *   and north, from the High Line to the south-east, close-ups of the
 *   pillows): /tmp/city/nyc/work/nyc-the-shed/photos/credits.txt.
 *
 * Estimated: the shell's height (35 m, from the photos' length-to-height
 * ratio; OSM's 40–48 m reads too tall against them), its 8 m shoulder
 * radius, the diamond size and lean, the pillow depth, the 8 m opening
 * under the shell and the legs; the fixed building's height (28 m: in the
 * photos from the plaza it stands well below the shell) and its glazing.
 * The gable ends' pinwheel quilting is drawn as a plain diamond quilt.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'
import { finishModel, capPoly, type XY } from './nyc-570-lexington'
import { volume, at, wall, type Bays } from './nyc-30-hudson-yards'

const shell = new Part(), frame = new Part(), glass = new Part(), roof = new Part(), base = new Part()

// Shell extents.
const X0 = -3.2, X1 = 44.8, Y0 = -17.2, Y1 = 27.0, H = 35, R = 8, ZB = 8
const W = Y1 - Y0

/** The shell's profile, a rounded rectangle in (y, z) from the south foot over the top to the north foot. */
const profile: XY[] = (() => {
  const pts: XY[] = [[Y0, ZB]]
  const arc = (cy: number, cz: number, a0: number, a1: number) => {
    for (let i = 0; i <= 6; i++) { const a = a0 + (a1 - a0) * i / 6; pts.push([cy + R * Math.cos(a), cz + R * Math.sin(a)]) }
  }
  arc(Y0 + R, H - R, Math.PI, Math.PI / 2)
  arc(Y1 - R, H - R, Math.PI / 2, 0)
  pts.push([Y1, ZB])
  return pts
})()
// Arc length along the profile.
const sLen: number[] = [0]
for (let i = 1; i < profile.length; i++) sLen.push(sLen[i - 1] + Math.hypot(profile[i][0] - profile[i - 1][0], profile[i][1] - profile[i - 1][1]))
const S = sLen[sLen.length - 1]
/** Point and outward normal on the profile at arc length s. */
function prof(s: number): { p: XY; n: XY } {
  let i = 1
  while (i < profile.length - 1 && sLen[i] < s) i++
  const a = profile[i - 1], b = profile[i], t = (s - sLen[i - 1]) / (sLen[i] - sLen[i - 1] || 1)
  const p: XY = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const cy = (Y0 + Y1) / 2
  // Outward normal: the segment's perpendicular pointing away from the vault's inside.
  let n: XY = [b[1] - a[1], -(b[0] - a[0])]
  const l = Math.hypot(n[0], n[1]) || 1; n = [n[0] / l, n[1] / l]
  if ((p[0] - cy) * n[0] + (p[1] - H / 2) * n[1] < 0) n = [-n[0], -n[1]]
  return { p, n }
}

type P2 = [number, number]
/** Clip a convex polygon to a convex polygon (Sutherland–Hodgman), both counter-clockwise. */
function clip(poly: P2[], by: P2[]): P2[] {
  let out = poly
  for (let i = 0; i < by.length && out.length; i++) {
    const a = by[i], b = by[(i + 1) % by.length], inp = out
    out = []
    const side = (p: P2) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
    for (let k = 0; k < inp.length; k++) {
      const p = inp[k], q = inp[(k + 1) % inp.length], sp = side(p), sq = side(q)
      if (sp >= 0) out.push(p)
      if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]) }
    }
  }
  return out
}

/**
 * Diamond quilt over a region of a parametric surface: diamonds dw wide and
 * dh tall on a lattice in (u, v), clipped to `region` (convex, in (u, v)),
 * each a fan to its centre pushed out by `puff` along the surface normal so
 * the flat-shaded facets read as pillows. Edges are split in two so they
 * follow a curved surface.
 */
function quilt(region0: P2[], dw: number, dh: number, puff: number, map0: (u: number, v: number) => { p: V3; n: V3 }, phase = 0, shear = 0) {
  // Work in a sheared lattice space (u − shear·v, v) so the diamonds lean like the real panels.
  const region: P2[] = region0.map(([u, v]) => [u - shear * v, v])
  const map = (u: number, v: number) => map0(u + shear * v, v)
  const us = region.map((p) => p[0]), vs = region.map((p) => p[1])
  const u0 = Math.min(...us), u1 = Math.max(...us), v0 = Math.min(...vs), v1 = Math.max(...vs)
  for (let j = Math.floor(v0 / (dh / 2)) - 1; j <= Math.ceil(v1 / (dh / 2)) + 1; j++) {
    for (let i = Math.floor((u0 - phase) / (dw / 2)) - 1; i <= Math.ceil((u1 - phase) / (dw / 2)) + 1; i++) {
      if ((i + j) % 2 === 0) continue
      const cu = phase + i * dw / 2, cv = j * dh / 2
      const d: P2[] = [[cu, cv - dh / 2], [cu + dw / 2, cv], [cu, cv + dh / 2], [cu - dw / 2, cv]]
      const c = clip(d, region)
      if (c.length < 3) continue
      let area = 0
      for (let k = 0; k < c.length; k++) { const a = c[k], b = c[(k + 1) % c.length]; area += a[0] * b[1] - b[0] * a[1] }
      if (Math.abs(area) < 0.5) continue
      // Centroid of the clipped piece, pushed out by a share of the puff.
      const mu = c.reduce((s, p) => s + p[0], 0) / c.length, mv = c.reduce((s, p) => s + p[1], 0) / c.length
      const share = Math.min(1, Math.abs(area) / 2 / (dw * dh / 2))
      const m = map(mu, mv), top: V3 = [m.p[0] + m.n[0] * puff * share, m.p[1] + m.n[1] * puff * share, m.p[2] + m.n[2] * puff * share]
      const ring: P2[] = []
      for (let k = 0; k < c.length; k++) { const a = c[k], b = c[(k + 1) % c.length]; ring.push(a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]) }
      for (let k = 0; k < ring.length; k++) {
        const a = map(...ring[k]).p, b = map(...ring[(k + 1) % ring.length]).p
        shell.tri(a, b, top)
      }
    }
  }
}

// The vault: u = x along the shell, v = arc length round the profile from
// the south foot. Counter-clockwise in (u, v) maps to an outward face.
quilt([[X0, 0], [X1, 0], [X1, S], [X0, S]], 9.6, 14, 1.4, (u, v) => {
  const { p, n } = prof(v)
  return { p: [u, p[0], p[1]], n: [0, n[0], n[1]] }
}, 4.8, 0.55)

// The gable ends: the profile's area, quilted, each framed by a steel rim.
const gable: P2[] = profile.map(([y, z]) => [y, z] as P2)
for (const [x, sgn] of [[X1, 1], [X0, -1]] as [number, number][]) {
  // East end faces +x: (u, v) = (y, z) is counter-clockwise seen from +x
  // when u runs north; the west end mirrors u.
  const region: P2[] = (sgn > 0 ? gable : gable.map(([y, z]) => [-y, z] as P2)).slice()
  // The profile runs clockwise in (y, z) seen from +x (south foot, up, over, down); reverse to counter-clockwise.
  let a = 0
  for (let k = 0; k < region.length; k++) { const p = region[k], q = region[(k + 1) % region.length]; a += p[0] * q[1] - q[0] * p[1] }
  const reg = a < 0 ? region.reverse() : region
  quilt(reg, 9, 9, 1.1, (u, v) => ({ p: [x, sgn > 0 ? u : -u, v], n: [sgn, 0, 0] }))
  // Rim: a band 1.4 m wide standing 0.9 m proud round the gable's top and sides.
  for (let k = 0; k < profile.length - 1; k++) {
    const [ya, za] = profile[k], [yb, zb] = profile[k + 1]
    const pa = prof(sLen[k] + 0.01).n, pb = prof(sLen[k + 1] - 0.01).n
    const o = (y: number, z: number, n: XY, d: number, dx: number): V3 => [x + dx, y + n[0] * d, z + n[1] * d]
    const out = 0.9 * sgn, ins = -0.6 * sgn
    // Outer face of the rim (continuing the vault surface outwards), front face, and inner lip.
    const A = o(ya, za, pa, 0.5, out), B = o(yb, zb, pb, 0.5, out), C = o(yb, zb, pb, 0.5, ins), D = o(ya, za, pa, 0.5, ins)
    const E = o(ya, za, pa, -1.4, out), F = o(yb, zb, pb, -1.4, out)
    if (sgn > 0) { frame.quad(D, C, B, A); frame.quad(A, B, F, E) } else { frame.quad(A, B, C, D); frame.quad(E, F, B, A) }
  }
}
// Rim along the vault's feet (the bottom chord of each long side).
for (const y of [Y0, Y1]) {
  const s = y === Y0 ? -1 : 1
  const a: V3 = [X0, y + s * 0.5, ZB], b: V3 = [X1, y + s * 0.5, ZB]
  const lo = (p: V3, dz: number, dy = 0): V3 => [p[0], p[1] + dy, p[2] + dz]
  if (s < 0) { frame.quad(lo(a, -1.2), lo(b, -1.2), b, a); frame.quad(lo(b, -1.2, -s * 1.2), lo(a, -1.2, -s * 1.2), lo(a, -1.2), lo(b, -1.2)) }
  else { frame.quad(lo(b, -1.2), lo(a, -1.2), a, b); frame.quad(lo(a, -1.2, -s * 1.2), lo(b, -1.2, -s * 1.2), lo(b, -1.2), lo(a, -1.2)) }
}

// Legs: the shell's skin pinches down to the bogies at each corner and at
// the middle of each long side, leaving wide inverted-V openings between.
const twoSided = (a: V3, b: V3, c: V3) => { shell.tri(a, b, c); shell.tri(a, c, b) }
for (const y of [Y0, Y1]) {
  const xm = (X0 + X1) / 2
  twoSided([X0, y, 0], [X0 + 11, y, ZB], [X0, y, ZB])
  twoSided([X1, y, 0], [X1, y, ZB], [X1 - 11, y, ZB])
  twoSided([xm, y, 0], [xm - 8, y, ZB], [xm + 8, y, ZB])
  const yi = y === Y0 ? Y0 + 8 : Y1 - 8
  for (const x of [X0, X1]) twoSided([x, y, 0], [x, yi, ZB], [x, y, ZB])
}

// The fixed building's glazed ground floor under the shell, set back 1.5 m,
// and its roof inside the vault.
const fb: XY[] = [[X0 + 1.5, Y0 + 1.5], [X1 - 1.5, Y0 + 1.5], [X1 - 1.5, Y1 - 1.5], [X0 + 1.5, Y1 - 1.5]]
const gl: Bays = { bay: 4.5, pier: 0.5, row: 5.4, brk: 0.4, foot: 0.3, head: 0.3 }
volume([at(fb, 0), at(fb, ZB - 1.2)], base, () => [glass, gl], null)
// A soffit closing the vault over the ground floor.
capPoly(roof, fb, ZB - 1.2, false)

// The fixed building west of the shell: eight storeys of glass, its east
// face hidden against the shell's west end.
const FIXED_H = 28
const fixed: XY[] = [[-38.2, -17.3], [-3.2, -17.1], [-3.2, 26.7], [-37.7, 26.3]]
const fx: Bays = { bay: 5, pier: 0.7, row: 8.2, brk: 1.2, foot: 1.5, head: 2.2 }
volume([at(fixed, 0), at(fixed, FIXED_H)], base, (_, i) => (i === 1 ? null : [glass, fx]), null)
capPoly(roof, fixed, FIXED_H)

// The low strip on the south side (OSM 5.5 m).
const strip: XY[] = [[-38.2, -34.5], [1.5, -34.3], [1.6, -17.4], [-38.2, -17.3]]
volume([at(strip, 0), at(strip, 5.5)], base, (_, i) => (i === 0 || i === 1 ? [glass, { ...gl, row: 4.6 }] : null), null)
capPoly(roof, strip, 5.5)
void wall

finishModel('The Shed', 'nyc-the-shed', [
  { part: shell, material: finish('shed-etfe', 0xe3e6e8) },
  { part: frame, material: finish('shed-steel', 0xc9c8c2) },
  { part: glass, material: { ...windowVariant(1, 0xa9bfd1), name: 'window' } },
  { part: base, material: finish('shed-mullion', 0xd8d9d6) },
  { part: roof, material: PALETTE.roof },
], { bearing: 29, osm: 'way/681503639', height: H + 1 })
