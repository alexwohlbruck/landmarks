/**
 * Bayterek (Бәйтерек), Astana: procedural, CC0-1.0.
 * bun generators/astana-bayterek.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0, built in true
 * orientation (the tower is radially symmetric: 16 ribs, one due north).
 * The origin is the centre of OSM's orb part (way/230401644, a 22 m circle),
 * which sits within 0.3 m of the outline's centroid. y = 0 is the plaza.
 *
 * Built 1997-2002 (Akmurza Rustembekov, Suyerkhan Bazarbayev, Zhumabek
 * Aitbalayev; engineer Mark Vanshtein). A tree of white steel: a ribbed
 * trunk that tapers up to a lattice "crown" of branches flaring out round a
 * gold glass orb, the egg of the bird Samruk.
 *
 * Published (Russian Wikipedia, "Байтерек (монумент)"):
 * - 97 m structure (the year of the capital's move); 105 m overall;
 * - orb 22 m across, at 76.9 m (taken as its base, which puts its top at
 *   98.9 m, matching the 97 m figure within the photo's error);
 * - main entrance 4.8 m up an openwork concrete stair; lower level 4.5 m
 *   below ground (not modelled: below the map).
 *
 * OSM:
 * - way/230401645, the outline: a 16-pointed star, points at r 8.0-8.6 m on
 *   bearings 0, 22.5, ...; valleys at r 6.3-6.9 m. The ribs' plan.
 * - way/230401644, building:part, the orb: a circle r 11.0 m, colour
 *   #C3B391. Both are replaced.
 *
 * From photos (scaled from the orb's published 22 m). "DSC01482"
 * (thedakotakid), taken from a distance, gives the heights, since it has
 * little upward perspective. "Baiterek August", a close frontal view from
 * the boulevard, gives the widths:
 * - trunk width: 16.6 m at the foot (OSM's star), flaring in to ~13.5 m
 *   by 10 m, ~11 m at 38 m and ~10 m at 46-54 m (distant photo, and
 *   "Baiterek Tower" by Francisco Anzola). The close frontal photo
 *   overstates the lower widths, because the base is nearer the camera;
 * - pointed glazed slits between the ribs from the ground to about 19 m
 *   (drawn with flat tops);
 * - solid white ribbed trunk from 19 to ~34 m;
 * - a white grid with dark openings from ~34 m to the crown at ~54 m;
 * - the crown: branches leaving the trunk at ~52 m, r ~7 at 61 m, r ~13.7
 *   at the orb's base, the outer tips r ~19.4 at ~88 m; the inner branches
 *   hug the orb and end beside its upper half at ~94 m, not above it;
 * - a white platform ring under the orb (r ~11.5); the lift shaft (~7.4 m
 *   across) seen dark through the crown;
 * - a short antenna on the orb's crown, which makes up the published 105 m.
 *
 * Estimated: rib front width and valley depth (each a fifth of the radius),
 * the foot flare's height (5 m), grid band spacing (3.1 m), the branch curves between the photo
 * measurements, and two families of 16 branches with two bands of
 * bracing (the real crown has more, thinner tubes). Branches are drawn
 * ~1.2 m thick, thicker than real, so the crown reads at phone size.
 * The two lattice rings, and the antenna's height (5-6 m), are also estimates.
 * Left out: the entrance stair and canopy, the frame lines on the orb, most
 * of the crown's bracing.
 * Terrain: Mapterhorn has no z15 tile here (tools/terrain.ts check 404s);
 * the plaza is flat in every photo, so elevation stays 0.
 *
 * Night: the steel is floodlit white (a `floodlight` wash); the orb's
 * panoramic hall glows gold (window-2) below its equator; the lobby glazing
 * is `window`. CC0 night photo "Baiterek monument at night".
 *
 * Photos (Flickr, via Openverse):
 * - "DSC01482", thedakotakid, CC BY-SA 2.0, https://www.flickr.com/photos/86372598@N00/4469502769 (distant, heights)
 * - "Baiterek Tower", Francisco Anzola, CC BY 2.0, https://www.flickr.com/photos/10345599@N03/48884588892
 * Photos (Wikimedia Commons):
 * - "Baiterek August.jpg", Quarot, CC0 (frontal, from the boulevard; widths)
 * - "Baiterek monument at night.jpg", Dauren Nabijan, CC0 (night, crown)
 * - "Kazakhstan P9130283 (40053603082).jpg", t_y_l, CC BY-SA 2.0 (crown tubes from inside the orb)
 * - "Astana SAM 0096 (15120523675).jpg", Alex J. Butler, CC BY 2.0 (crown tubes from the orb, looking east)
 * - "Nurjol Boulevard, Astana.jpg", Bernard Gagnon, CC0 (view west from the orb)
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

const TAU = Math.PI * 2
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))

// ------------------------------------------------------------- materials ---
const white = new Part()  // painted steel: ribs, grid, crown, platform
const lobby = new Part()  // glazing between the ribs at the foot (lit)
const core = new Part()   // dark openings of the trunk's grid
const orbLit = new Part() // the orb's panoramic hall (glows at night)
const orb = new Part()    // the orb's gold glass above the hall

/** A quad whose winding is chosen so it faces `out`, with per-corner normals. */
function face(p: Part, Q: V3[], N: V3[]) {
  const f = cross(sub(Q[1], Q[0]), sub(Q[2], Q[0]))
  const avg = N.reduce(add, [0, 0, 0] as V3)
  const [a, b, c, d] = dot(f, avg) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  p.tri(Q[a], Q[b], Q[c], undefined, undefined, undefined, [N[a], N[b], N[c]])
  p.tri(Q[a], Q[c], Q[d], undefined, undefined, undefined, [N[a], N[c], N[d]])
}
const P = (r: number, a: number, z: number): V3 => [r * Math.cos(a), r * Math.sin(a), z]

/** Surface of revolution from [r, z]; left-hand side of the profile is outside. */
function lathe(profile: [number, number][], pick: (band: number, z: number) => Part | null, k: number, smooth = 40) {
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
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    const part = pick(b, (z0 + z1) / 2)
    if (!part || (r0 === 0 && r1 === 0)) continue
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

// ------------------------------------------------------------- the trunk ---
const RIBS = 16
const TRUNK_TOP = 54
/** Rib tips' radius: OSM's 8.3 m star at the foot, flaring in to 6.9 m by 5 m, then a straight taper. */
const rOut = (z: number) => (z < 5 ? 8.3 - 0.28 * z : 6.9 - 0.043 * (z - 5))
/** Valley depth, and rib front width, in proportion to the trunk. */
const depth = (z: number) => 0.2 * rOut(z)
const ribW = (z: number) => 0.2 * rOut(z)
/** The star section at height z: per rib, two front corners and a valley. */
function star(z: number): V3[] {
  const ro = rOut(z), rv = ro - depth(z), da = ribW(z) / 2 / ro
  const ring: V3[] = []
  for (let i = 0; i < RIBS; i++) {
    const a = (i / RIBS) * TAU
    ring.push(P(ro, a - da, z), P(ro, a + da, z), P(rv, a + TAU / RIBS / 2, z))
  }
  return ring
}
// Band boundaries, and what fills the flanks between ribs in each band.
const levels: number[] = [0, 5, 19, 34]
for (let z = 34; z < TRUNK_TOP - 0.01; ) {
  z = Math.min(TRUNK_TOP, z + 2.2); levels.push(z)
  if (z < TRUNK_TOP) { z = Math.min(TRUNK_TOP, z + 0.9); levels.push(z) }
}
const GRID_K = levels.indexOf(34)
const flankPart = (k: number, zMid: number) =>
  zMid < 19 ? lobby : zMid < 34 ? white : (k - GRID_K) % 2 === 0 ? core : white
{
  const rings = levels.map(star)
  for (let k = 0; k < rings.length - 1; k++) {
    const a = rings[k], b = rings[k + 1], n = a.length
    const zMid = (levels[k] + levels[k + 1]) / 2
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      // i % 3 === 0: the rib's front face; otherwise a flank into a valley.
      const part = i % 3 === 0 ? white : flankPart(k, zMid)
      part.quad(a[i], a[j], b[j], b[i])
    }
  }
  // The trunk's top, round the lift shaft.
  const top = rings[rings.length - 1]
  for (let i = 0; i < top.length; i++) white.tri([0, 0, TRUNK_TOP], top[i], top[(i + 1) % top.length])
}

// ------------------------------------------------------- shaft and orb ---
const ORB_R = 11, ORB_Z0 = 76.9, ORB_C = ORB_Z0 + ORB_R
lathe([[3.7, TRUNK_TOP], [3.7, ORB_Z0 - 0.8]], () => core, 16)
// The platform ring under the orb: a white disc with a bevelled rim.
lathe([[3.7, ORB_Z0 - 0.9], [11.0, ORB_Z0 - 0.9], [11.5, ORB_Z0 - 0.5], [11.5, ORB_Z0 - 0.1], [11.0, ORB_Z0 + 0.2], [8.0, ORB_Z0 + 0.4]], () => white, 32)
{
  const prof: [number, number][] = []
  const N = 12
  for (let s = 0; s <= N; s++) {
    const t = -Math.PI / 2 + (s / N) * Math.PI
    prof.push([s === 0 || s === N ? 0 : ORB_R * Math.cos(t), ORB_C + ORB_R * Math.sin(t)])
  }
  lathe(prof, (_b, z) => (z < ORB_C + 3 ? orbLit : orb), 24, 60)
  // The antenna on the orb's crown, to the published 105 m overall.
  lathe([[0.9, ORB_Z0 + 2 * ORB_R - 0.1], [0.9, ORB_Z0 + 2 * ORB_R + 0.5], [0.25, ORB_Z0 + 2 * ORB_R + 0.7], [0.12, 105], [0, 105]], () => white, 6)
}

// ------------------------------------------------------------- the crown ---
/** A tapering four-sided tube along a path, faces turned away from its axis. */
function tube(p: Part, path: V3[], r0: number, r1: number) {
  const secs = path.map((c, k) => {
    const t = unit(sub(path[Math.min(k + 1, path.length - 1)], path[Math.max(k - 1, 0)]))
    const radial = unit([c[0], c[1], 0])
    const u = unit(cross(t, radial)), v = unit(cross(u, t))
    const r = r0 + (r1 - r0) * (k / (path.length - 1))
    return [0, 1, 2, 3].map((q) => {
      const a = (q / 4) * TAU + Math.PI / 4
      return { pos: add(c, add(mul(u, r * Math.cos(a)), mul(v, r * Math.sin(a)))), n: unit(add(mul(u, Math.cos(a)), mul(v, Math.sin(a)))) }
    })
  })
  for (let k = 0; k < secs.length - 1; k++)
    for (let q = 0; q < 4; q++) {
      const w = (q + 1) % 4
      const A = secs[k][q], B = secs[k][w], C = secs[k + 1][w], D = secs[k + 1][q]
      face(p, [A.pos, B.pos, C.pos, D.pos], [A.n, B.n, C.n, D.n])
    }
  // Close the tip.
  const last = secs[secs.length - 1], tip = add(path[path.length - 1], mul(unit(sub(path[path.length - 1], path[path.length - 2])), 0.3))
  for (let q = 0; q < 4; q++) p.tri(last[q].pos, last[(q + 1) % 4].pos, tip)
}
/** Piecewise-linear [r, z] profile, resampled at the given z's. */
const along = (pts: [number, number][], a: number, zs: number[]): V3[] =>
  zs.map((z) => {
    let k = 0
    while (k < pts.length - 2 && z > pts[k + 1][1]) k++
    const [ra, za] = pts[k], [rb, zb] = pts[k + 1]
    return P(ra + ((rb - ra) * (z - za)) / (zb - za), a, z)
  })
// Outer branches, one off each rib: flaring to r 18 at ~91 m.
const OUTER: [number, number][] = [[rOut(52) - 0.3, 52], [5.4, 60], [7.6, 67], [11.2, 73], [14.4, 79], [17.0, 84], [19.3, 88.5]]
// Inner branches, between the ribs: hugging the orb and rising past it.
const INNER: [number, number][] = [[rOut(52) - 0.5, 52], [5.7, 60], [7.9, 67], [10.6, 72], [12.2, 77], [13.0, 82], [12.8, 87], [12.0, 91], [11.4, 94]]
for (let i = 0; i < RIBS; i++) {
  const a = (i / RIBS) * TAU
  tube(white, along(OUTER, a, [52, 60, 67, 73, 79, 84, 88.5]), 0.62, 0.26)
  tube(white, along(INNER, a + TAU / RIBS / 2, [52, 60, 67, 74, 82, 88, 94]), 0.55, 0.22)
}
// Diagonal bracing, so the crown reads as a web at phone size: crossed
// diagonals between neighbouring branches low in the crown, and a zigzag
// between the outer branches where they spread widest.
const branchAt = (j: number, z: number) =>
  along(j % 2 === 0 ? OUTER : INNER, (j / (2 * RIBS)) * TAU, [z])[0]
for (let k = 0; k < 2 * RIBS; k++) {
  tube(white, [branchAt(k, 61), branchAt(k + 1, 72)], 0.34, 0.34)
  tube(white, [branchAt(k + 1, 61), branchAt(k, 72)], 0.34, 0.34)
}
for (let i = 0; i < RIBS; i++) tube(white, [branchAt(2 * i, 78), branchAt(2 * i + 2, 86)], 0.32, 0.32)
// Two lattice rings tying the branches.
for (const [r, z] of [[5.9, 61], [12.8, 77.6]] as [number, number][]) {
  const h = 0.35
  lathe([[r + h, z - h], [r + h, z + h], [r - h, z + h], [r - h, z - h], [r + h, z - h]], () => white, 32, 10)
}

// ---------------------------------------------------------------- output ---
// Colours from daylight photos: the steel a clean white; the orb's mirror
// gold (OSM's #C3B391) pulled to the palette's lightness; the trunk's
// openings a dark grey-blue, at the style's darkest.
const steelLit = (_p: V3, n: V3) => (n[2] > 0.8 ? 0.35 : 0.9)
const parts = [
  { part: white, material: { ...PALETTE.trim, floodlight: steelLit } },
  { part: lobby, material: PALETTE.window },
  { part: core, material: finish('bayterek-core', 0x56626e) },
  { part: orbLit, material: windowVariant(2, 0xc9ae6c) },
  { part: orb, material: finish('bayterek-gold', 0xd3bd84, 0.4) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Bayterek', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 105,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/astana-bayterek.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
