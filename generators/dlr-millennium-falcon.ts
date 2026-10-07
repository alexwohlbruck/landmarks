/**
 * The Millennium Falcon, Star Wars: Galaxy's Edge, Disneyland Park, Anaheim
 * — procedural, CC0-1.0.
 * bun generators/dlr-millennium-falcon.ts
 *
 * Map frame: x to the ship's starboard, y forward along the mandibles, z up,
 * metres; the origin is the centre of the round hull on the ground. Placed at
 * bearing 139°: the mandibles point south-east into the land's courtyard,
 * the cockpit is on the south-west side, nearest the Smugglers Run entrance
 * tower, and the stern backs into the curved docking-bay wall of Smugglers
 * Run's show building (way/515673763). The same full-size replica as Walt
 * Disney World's, so the shape follows wdw-millennium-falcon.ts; the
 * position, heading and length are Anaheim's.
 *
 * Evidence
 * - OSM way/1329137052 (building=yes, "Millennium Falcon"): a hand trace.
 *   A circle fitted to its round side gives the hull centre (1.1 m west,
 *   3.8 m north of the trace's centroid) and radius 11.5 m; its two narrow
 *   prongs, 3.3 m apart, are the mandibles' inner edges and give the heading
 *   (139°) and the tips 18.6 m ahead of the centre; its bulge on the
 *   south-west side is the cockpit and the starboard docking port.
 * - USGS NAIP orthophoto (public domain): the disc, and the dark slot
 *   between the mandibles, which lies on the 139° axis.
 * - Published: Disney calls it full size (the screen ship is 34.75 m long);
 *   the trace and the aerial give 30 m, the same as WDW's (30.7 m).
 * - Photos, Commons: elisfkc (CC BY-SA 2.0; 48512021956, 48512181117,
 *   48512183242, 48511999506, 48511997671 and two panoramas), Laika ac
 *   (CC BY-SA 2.0; "Disneyland - Star Wars Galaxy's Edge (Disneyland) 01",
 *   "Star War Galaxy's Edge (Disneyland) 02"), .kit (CC BY 2.0; 48390063722,
 *   48389923561), Christopher Michel (CC BY 2.0; 48856991881), Tomás Del
 *   Coro (CC BY-SA 2.0; 48537418942, head-on between the mandibles), Jeremy
 *   Thompson (CC BY 2.0; 49590453018, the underside and gear),
 *   Univaded Fox (public domain; Phonetography 162, 163), Contributor19
 *   (CC BY 4.0; "Galaxy's Edge, Disneyland"); Mapillary 1582830536335484
 *   (DrivingRoundTown, CC BY-SA 4.0). They show the courtyard (south-west,
 *   south and east) sides: mandibles towards the courtyard, the cockpit and
 *   the big round starboard docking port beside it, the rectangular dish and
 *   the turret on top, and the gear standing in a sunken pit behind
 *   barriers. Heights are WDW's, which these photos agree with: underside
 *   about 2.3 m up, rim 3.2–4.7 m, top 6.1 m.
 *
 * Estimated: the underside (seen only in shadow), the leg positions and the
 * dish's exact place, which follow the screen ship; the north-east (port)
 * side and the stern, which only the Smugglers Run queue overlooks (two
 * photos of the top from there). The docking ports' size is scaled from the
 * cockpit tube beside it. The cockpit sits further forward than in
 * wdw-millennium-falcon.ts (canopy 11.4 m ahead of the hull centre, not
 * 6.6 m), following the trace's bulge and the courtyard photos, where the
 * docking port stands just behind the cockpit's tail. Invented: nothing, but the hull's greebles are
 * reduced to a darker machinery band round the rim and down the mandibles'
 * sides, and the panel work to a few darker patches. The docking-bay wall,
 * gantry and pit are Smugglers Run's building, not modelled here.
 */
import { Part, cross, len, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const hull = new Part()     // light grey plating
const patch = new Part()    // darker replacement panels on the upper hull, and the underside
const machine = new Part()  // the greebled trench round the rim, legs, gun barrels
const glass = new Part()    // cockpit canopy
const engine = new Part()   // the sublight engine grille across the stern

const TAU = Math.PI * 2
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const unit = (a: V3): V3 => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** A triangle whose winding agrees with its normals, whatever order it came in. */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3[]) {
  const f = cross(sub(b, a), sub(c, a))
  if (len(f) < 1e-10) return
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(a, b, c, undefined, undefined, undefined, n)
  else p.tri(a, c, b, undefined, undefined, undefined, [n[0], n[2], n[1]])
}
function face(p: Part, pts: V3[], n: V3) {
  for (let i = 1; i < pts.length - 1; i++) tri(p, pts[0], pts[i], pts[i + 1], [n, n, n])
}

// --- Hull -------------------------------------------------------------------
const R = 11.5
/**
 * The round hull, a lathe of (radius, height) points from the top centre
 * round the rim to the bottom centre. Each band is smooth around and flat
 * along the profile, which gives the soft-edged lens the photos show.
 * `pick` chooses the material of a band by its index and angle.
 */
const PROFILE: [number, number][] = [
  [0, 6.1], [3.9, 6.0], [4.2, 5.65], [6, 5.5], [9, 5.15], [10.7, 4.85], [R, 4.7],
  [R, 3.2], [10.8, 2.9], [7, 2.55], [3.5, 2.35], [0, 2.3],
]
const SEG = 40
function lathe(pick: (band: number, angle: number) => Part) {
  for (let k = 0; k < PROFILE.length - 1; k++) {
    const [r0, z0] = PROFILE[k], [r1, z1] = PROFILE[k + 1]
    // Outward normal of the band in the (r, z) plane, upper side first.
    const nr = z0 - z1, nz = r1 - r0
    const l = Math.hypot(nr, nz) || 1
    for (let i = 0; i < SEG; i++) {
      const a0 = (i / SEG) * TAU, a1 = ((i + 1) / SEG) * TAU
      const p = pick(k, (a0 + a1) / 2)
      const pt = (r: number, z: number, a: number): V3 => [r * Math.sin(a), r * Math.cos(a), z]
      const nn = (a: number): V3 => [(nr / l) * Math.sin(a), (nr / l) * Math.cos(a), nz / l]
      const q = [pt(r0, z0, a0), pt(r0, z0, a1), pt(r1, z1, a1), pt(r1, z1, a0)]
      const n = [nn(a0), nn(a1), nn(a1), nn(a0)]
      tri(p, q[0], q[1], q[2], [n[0], n[1], n[2]])
      tri(p, q[0], q[2], q[3], [n[0], n[2], n[3]])
    }
  }
}
// Angles run clockwise from the nose (0) seen from above, as bearings do.
const STERN = (a: number) => Math.abs(((a / TAU) * 360 + 180) % 360 - 180) > 118
lathe((band, a) => {
  if (band === 6) return STERN(a) ? engine : machine // the rim trench, and the engines astern
  if (band > 6) return patch // the underside, in shadow and mid-grey in every photo
  // A few darker replacement plates on the forward upper hull (the after half
  // carries the vent grilles), each one ring wide so
  // they read as panels rather than as a pie.
  const deg = (a / TAU) * 360
  for (const [b, c, w] of [[2, 40, 22], [3, 100, 18], [2, 285, 20], [3, 318, 14], [4, 62, 12]])
    if (band === b && Math.abs(((deg - c + 540) % 360) - 180) < w / 2) return patch
  return hull
})

// --- Mandibles --------------------------------------------------------------
/**
 * A convex plan polygon extruded from z0 to z1 with a chamfered top edge:
 * sides in `side`, top and bottom in `cap`.
 */
function prism(side: Part, cap: Part, plan: [number, number][], z0: number, z1: number, b = 0.25) {
  const cx = plan.reduce((s, p) => s + p[0], 0) / plan.length, cy = plan.reduce((s, p) => s + p[1], 0) / plan.length
  const inset = plan.map(([x, y]) => {
    const d = Math.hypot(x - cx, y - cy)
    return [x - ((x - cx) / d) * b, y - ((y - cy) / d) * b] as [number, number]
  })
  const n = plan.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const [ax, ay] = plan[i], [bx, by] = plan[j]
    let out: V3 = unit([by - ay, -(bx - ax), 0])
    if (dot(out, [(ax + bx) / 2 - cx, (ay + by) / 2 - cy, 0]) < 0) out = [-out[0], -out[1], 0]
    face(side, [[ax, ay, z0], [bx, by, z0], [bx, by, z1 - b], [ax, ay, z1 - b]], out)
    const [ix, iy] = inset[i], [jx, jy] = inset[j]
    face(cap, [[ax, ay, z1 - b], [bx, by, z1 - b], [jx, jy, z1], [ix, iy, z1]], unit(add(out, [0, 0, 1])))
  }
  face(cap, inset.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
  face(cap, plan.map(([x, y]) => [x, y, z0] as V3), [0, 0, -1])
}
const GAP = 1.7, MW = 4.3, TIP = 18.6
for (const s of [-1, 1]) {
  const xi = s * GAP, xo = s * (GAP + MW)
  // From inside the hull out to the squared-off tip; the outer edge runs
  // straight forward, slightly drawn in at the tip as on the screen ship.
  const plan: [number, number][] = [[xi, 6], [xo, 3.5], [xo * 0.97, TIP - 0.6], [xo * 0.9, TIP], [xi, TIP]]
  prism(machine, hull, plan, 3.15, 4.85, 0.3)
}

// --- Cockpit ------------------------------------------------------------------
/** A round section from a to b, radius r0 to r1, smooth along its side. */
function cyl(p: Part, a: V3, b: V3, r0: number, r1: number, seg: number, caps: [boolean, boolean] = [true, true], sel?: (i: number) => Part) {
  const T = unit(sub(b, a))
  const ref: V3 = Math.abs(T[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]
  const U = unit(cross(T, ref)), W = unit(cross(T, U))
  const dir = (i: number): V3 => { const t = (i / seg) * TAU; return unit(add(add([0, 0, 0], U, Math.cos(t)), W, Math.sin(t))) }
  const slope = (r0 - r1) / len(sub(b, a))
  for (let i = 0; i < seg; i++) {
    const q = sel ? sel(i) : p
    const d0 = dir(i), d1 = dir(i + 1)
    const n0 = unit(add(d0, T, slope)), n1 = unit(add(d1, T, slope))
    const p00 = add(a, d0, r0), p01 = add(a, d1, r0), p10 = add(b, d0, r1), p11 = add(b, d1, r1)
    tri(q, p00, p01, p11, [n0, n1, n1])
    tri(q, p00, p11, p10, [n0, n1, n0])
  }
  if (caps[0] && r0 > 0) face(p, Array.from({ length: seg }, (_, i) => add(a, dir(i), r0)), [-T[0], -T[1], -T[2]])
  if (caps[1] && r1 > 0) face(p, Array.from({ length: seg }, (_, i) => add(b, dir(i), r1)), T)
}
// The cockpit tube outside the starboard edge, level with the rim, its
// canopy facing forward a third of the way along the mandibles (the OSM
// trace's forward bulge); the passage back into the hull is its tail.
const CX = 11.0, CZ = 4.3, CR = 1.5
cyl(hull, [CX - 1.8, 2.2, CZ], [CX, 4.4, CZ], 0.95, CR, 16, [true, false])
cyl(hull, [CX, 4.4, CZ], [CX, 9.7, CZ], CR, CR, 16, [false, false])
// A dark ring where the canopy frame meets the tube.
cyl(machine, [CX, 9.7, CZ], [CX, 10.05, CZ], CR, CR * 0.98, 16, [false, false])
// The canopy: a cone whose upper half is glazed, and the round front window.
const UP_HALF = (i: number) => { const t = ((i + 0.5) / 16) * TAU; return Math.sin(t) > -0.15 ? glass : hull }
cyl(hull, [CX, 10.05, CZ], [CX, 11.35, CZ], CR * 0.98, 0.62, 16, [false, false], UP_HALF)
cyl(glass, [CX, 11.35, CZ], [CX, 11.42, CZ], 0.62, 0.6, 16, [false, true])
// A dark band round the tube's waist, as on the real ship.
cyl(machine, [CX, 5.4, CZ], [CX, 6.1, CZ], CR * 1.02, CR * 1.02, 16, [false, false])

// The docking ports: a short fat cylinder through each beam amidships, just
// aft of the cockpit (the trace's square bulge), standing just proud of
// the rim. The starboard one's machinery-
// filled end is what the courtyard sees left of the cockpit.
for (const s of [-1, 1]) {
  cyl(hull, [s * 9.0, 0.6, 3.95], [s * 11.6, 0.6, 3.95], 1.45, 1.45, 14, [false, false])
  cyl(machine, [s * 11.6, 0.6, 3.95], [s * 11.8, 0.6, 3.95], 1.45, 1.2, 14, [false, true])
}

// --- Topside -----------------------------------------------------------------
// The quad gun turret in the middle of the upper hull: a low dome with its
// twin barrels laid forward.
{
  const r = 1.45, z = 6.0, rings = 4, seg = 16
  for (let k = 0; k < rings; k++) {
    const t0 = (k / rings) * (Math.PI / 2), t1 = ((k + 1) / rings) * (Math.PI / 2)
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * TAU, a1 = ((i + 1) / seg) * TAU
      const P = (t: number, a: number): V3 => [r * Math.cos(t) * Math.cos(a), r * Math.cos(t) * Math.sin(a), z + 0.75 * Math.sin(t)]
      const N = (t: number, a: number): V3 => unit([Math.cos(t) * Math.cos(a) / r, Math.cos(t) * Math.sin(a) / r, Math.sin(t) / 0.75])
      tri(hull, P(t0, a0), P(t0, a1), P(t1, a1), [N(t0, a0), N(t0, a1), N(t1, a1)])
      tri(hull, P(t0, a0), P(t1, a1), P(t1, a0), [N(t0, a0), N(t1, a1), N(t1, a0)])
    }
  }
  for (const s of [-1, 1]) cyl(machine, [s * 0.35, 0.6, 6.45], [s * 0.35, 2.9, 6.45], 0.16, 0.13, 6)
}
// The rectangular sensor dish of the sequel-era ship on a short mast,
// forward of the turret towards the cockpit side, leaning back.
{
  const c: V3 = [5.2, 3.6, 6.9]
  cyl(machine, [c[0], c[1] - 0.2, 5.4], [c[0], c[1] - 0.2, c[2]], 0.22, 0.2, 8)
  const w = 1.15, h = 0.8, lean = 0.35
  const fwd: V3 = unit([0.45, 1, 0]), right: V3 = unit([1, -0.45, 0])
  const upv: V3 = unit(add([0, 0, 1], fwd, -lean))
  const nrm = unit(cross(right, upv))
  const corner = (u: number, v: number): V3 => add(add(c, right, u * w), upv, v * h)
  const front = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)]
  const back = front.map((p) => add(p, nrm, -0.22))
  face(hull, front, nrm)
  face(patch, back, [-nrm[0], -nrm[1], -nrm[2]])
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    face(machine, [front[i], back[i], back[j], front[j]], unit(sub(add(front[i], front[j]), add(c, c))))
  }
}

// The ring of round vent grilles on the after half of the upper hull, which
// the Smugglers Run queue looks down on: low drums with a dark grille face.
for (const [u, v] of [[-5.2, -3.2], [-2.0, -5.6], [2.0, -5.6], [5.2, -3.2], [-6.2, -7.0], [6.2, -7.0]] as [number, number][]) {
  const r0 = Math.hypot(u, v)
  // Sit each drum on the hull's sloping top: profile height at this radius.
  let z = 5.5
  for (let k = 0; k < PROFILE.length - 1; k++) {
    const [ra, za] = PROFILE[k], [rb, zb] = PROFILE[k + 1]
    if (r0 >= ra && r0 <= rb && rb > ra) z = za + ((r0 - ra) / (rb - ra)) * (zb - za)
  }
  cyl(hull, [u, v, z - 0.3], [u, v, z + 0.22], 1.55, 1.5, 14, [false, false])
  cyl(patch, [u, v, z + 0.22], [u, v, z + 0.25], 1.5, 1.3, 14, [false, true])
}

// --- Landing gear --------------------------------------------------------------
// Five legs as the screen ship has: a pair under the mandible roots, a pair
// aft of the beam and one under the stern; each a chunky strut on a pad.
for (const [x, y] of [[-4.1, 8.2], [4.1, 8.2], [-6.6, -4.8], [6.6, -4.8], [0, -8.4]] as [number, number][]) {
  cyl(machine, [x, y, 0.3], [x, y, 2.5], 0.42, 0.34, 10, [false, false])
  prism(machine, machine, [[x - 0.8, y - 0.8], [x + 0.8, y - 0.8], [x + 0.8, y + 0.8], [x - 0.8, y + 0.8]], 0, 0.35, 0.08)
}

const parts = [
  // Light grey plating, a touch warm, as it reads in daylight.
  { part: hull, material: finish('falcon-hull', 0xd3d2cc) },
  { part: patch, material: finish('falcon-panel', 0xa9aaa6) },
  // The greebled trench and the gear: dark machinery, kept above charcoal.
  { part: machine, material: finish('falcon-machinery', 0x7a7e82) },
  { part: glass, material: PALETTE.window },
  { part: engine, material: finish('falcon-engine', 0x9fb2bf) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join('\n'))
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Millennium Falcon', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', length: TIP + R, bearing: 139,
})
await Bun.write(new URL('../models/dlr-millennium-falcon.glb', import.meta.url), glb)
console.log(`dlr-millennium-falcon.glb: ${triangles} triangles, ${glb.length} bytes`)
