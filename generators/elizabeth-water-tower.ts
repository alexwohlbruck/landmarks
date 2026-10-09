/**
 * Elizabeth water tower, E 8th St at Pecan Ave, Charlotte — procedural, CC0-1.0.
 * bun generators/elizabeth-water-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centre of the OSM outline (way/870467714, man_made=water_tower, a 25.3 m
 * circle). Round, so bearing 0.
 *
 * One of the towers Charlotte put up in 1937 when it rebuilt its water
 * system, at 422 Pecan Avenue: "a huge silver orb perched on steel stilts"
 * (Charlotte-Mecklenburg Historic Landmarks Commission, The Elizabeth
 * Neighborhood). Today the orb is painted white and the steel a navy so dark
 * it reads black. A multi-column tank: an ellipsoidal tank whose heads are
 * joined by a short cylindrical band with a walkway round its top, carried
 * on a ring of plain vertical columns that rise past the lower head to the
 * walkway, a wide central riser, two rings of struts (one across the lower
 * head, one below it) and crossed rods between the columns.
 *
 * Rework (2026): the form of the first model is kept; the heights, column
 * count, bracing and colours now follow the lidar and the photos.
 *
 * Evidence
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m DSM and ground;
 *    y = 0 is the lowest ground under the tower, 222.5 m NAVD88. The tank's
 *    disc is 25.5 m across (walkway included), centred 0.7 m south of the
 *    OSM circle's centre, which is kept; the shell's crown is 49.0 m, the
 *    finial 50.0 m, the shell falls to 47.0 m at r 6, 46.1 m at r 8 and
 *    45.0 m at r 10, and the walkway ring at r 11-14 is 39.9 m.
 *  - "Elizabeth Water Tower at 8th St and Pecan St Early August 2025", City
 *    Dweller 2, CC BY-SA 4.0, Wikimedia Commons: white tank, near-black
 *    columns, riser and strut rings, crossed rods over the lower head and
 *    below it (drawn below it only, see the bracing), a stair to the walkway.
 *  - "ProjectCLT - Elizabeth Water Tower", Carolinadoug, Flickr, CC BY-NC-ND
 *    2.0 (looked at, not copied): the tank's proportions; the columns' spacing
 *    across the front fits sixteen columns (a fit of the eight visible
 *    columns' positions gives 22.9 degrees between them; the first model had
 *    twelve).
 *
 * Massing changes from the first model, with their evidence: the tank sat
 * 1.5 to 4 m too high (crown 50.5 m, walkway 43.8 m) against the lidar's
 * 49.0 m crown and 39.9 m walkway, so it is lowered, its band shortened to
 * 2 m and its upper head made a little deeper (9 m) to follow the lidar's
 * profile; sixteen columns instead of twelve (the Flickr photo).
 *
 * Estimated: the lower head's depth (8.5 m, from the photos' proportions;
 * about 1.6 million US gallons at this size, none published), the strut
 * rings' heights (31.5 m across the lower head and 24.5 m, read off the
 * Commons photo; trees hide anything lower), the riser's width (2.2 m),
 * member sizes, thickened to read at phone size (columns 0.76 m, struts
 * 0.54 m, rods 0.36 m: sixteen columns any thicker hide the white bowl). The near-black navy is pulled to a navy charcoal,
 * per STYLE.md: dark enough to read as the defining dark frame under the
 * white tank, no darker than charcoal. No railings, ladders, stair or
 * lettering.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { finish } from './palette'

const TAU = Math.PI * 2
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const unit = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l] }

/** A triangle whose winding agrees with its normals, whatever order it came in. */
function tri(p: Part, a: V3, b: V3, c: V3, n: V3[]) {
  const f = cross(sub(b, a), sub(c, a))
  if (Math.hypot(...f) < 1e-9) return
  if (dot(f, add(add(n[0], n[1]), n[2])) >= 0) p.tri(a, b, c, undefined, undefined, undefined, n)
  else p.tri(a, c, b, undefined, undefined, undefined, [n[0], n[2], n[1]])
}

/**
 * Revolve a profile of [r, z] points about the z axis at (cx, cy). Each run
 * of the profile is smooth-shaded; a repeated point starts a new run, which
 * is how a crease (the eave, the walkway's edge) is made.
 */
function lathe(p: Part, profile: [number, number][], seg: number, cx = 0, cy = 0) {
  const runs: [number, number][][] = [[]]
  for (const q of profile) {
    const run = runs.at(-1)!
    const last = run.at(-1)
    if (last && last[0] === q[0] && last[1] === q[1]) runs.push([q])
    else run.push(q)
  }
  for (const run of runs) {
    if (run.length < 2) continue
    const segN = run.slice(1).map((q, i) => {
      const dr = q[0] - run[i][0], dz = q[1] - run[i][1]
      const l = Math.hypot(dr, dz) || 1
      return [dz / l, -dr / l]
    })
    const nrm = run.map((_, i) => {
      const a = segN[Math.max(0, i - 1)], b = segN[Math.min(segN.length - 1, i)]
      const l = Math.hypot(a[0] + b[0], a[1] + b[1]) || 1
      return [(a[0] + b[0]) / l, (a[1] + b[1]) / l]
    })
    for (let k = 0; k < run.length - 1; k++) {
      for (let s = 0; s < seg; s++) {
        const t0 = (s / seg) * TAU, t1 = ((s + 1) / seg) * TAU
        const P = (i: number, t: number): V3 => [cx + run[i][0] * Math.cos(t), cy + run[i][0] * Math.sin(t), run[i][1]]
        const N = (i: number, t: number): V3 => [nrm[i][0] * Math.cos(t), nrm[i][0] * Math.sin(t), nrm[i][1]]
        tri(p, P(k, t0), P(k, t1), P(k + 1, t1), [N(k, t0), N(k, t1), N(k + 1, t1)])
        tri(p, P(k, t0), P(k + 1, t1), P(k + 1, t0), [N(k, t0), N(k + 1, t1), N(k + 1, t0)])
      }
    }
  }
}

/** Points along an ellipse quadrant between the rim (r, zRim) and the axis. */
function head(r: number, depth: number, zRim: number, up: boolean, steps: number): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2)
    const t = up ? a : Math.PI / 2 - a
    out.push([r * Math.cos(t), zRim + (up ? 1 : -1) * depth * Math.sin(t)])
  }
  return out
}

/** A ball from z0 up to z0 + 2r, about (cx, cy). */
function ball(p: Part, r: number, z0: number, cx: number, cy: number) {
  const prof: [number, number][] = []
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI; prof.push([r * Math.cos(a), z0 + r + r * Math.sin(a)]) }
  lathe(p, prof, 10, cx, cy)
}

/**
 * A square-section member from a to b, flat-shaded, half-width w. Its sides
 * face the radial and tangential directions of the tower centred at c, so
 * columns read as square from the street rather than twisting with their slope.
 */
function beam(p: Part, a: V3, b: V3, w: number, caps = false, c: [number, number] = [0, 0]) {
  const t = unit(sub(b, a))
  const mid: V3 = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], 0]
  let u = Math.hypot(mid[0], mid[1]) > 0.01 ? unit(cross([0, 0, 1], mid)) : unit(cross(t, [1, 0, 0]))
  if (Math.abs(dot(u, t)) > 0.95) u = unit(cross(t, [0, 0, 1]))
  u = unit(sub(u, [t[0] * dot(u, t), t[1] * dot(u, t), t[2] * dot(u, t)]))
  const v = cross(t, u)
  const corner = (o: V3, i: number): V3 => {
    const su = i === 0 || i === 3 ? -w : w, sv = i < 2 ? -w : w
    return [o[0] + u[0] * su + v[0] * sv, o[1] + u[1] * su + v[1] * sv, o[2] + u[2] * su + v[2] * sv]
  }
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    const q = [corner(a, i), corner(a, j), corner(b, j), corner(b, i)]
    const ctr: V3 = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, (q[0][2] + q[2][2]) / 2]
    const n = unit(sub(ctr, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]))
    tri(p, q[0], q[1], q[2], [n, n, n])
    tri(p, q[0], q[2], q[3], [n, n, n])
  }
  if (caps) for (const [o, s] of [[a, -1], [b, 1]] as [V3, number][]) {
    const n: V3 = [t[0] * s, t[1] * s, t[2] * s]
    const q = [0, 1, 2, 3].map((i) => corner(o, i))
    tri(p, q[0], q[1], q[2], [n, n, n])
    tri(p, q[0], q[2], q[3], [n, n, n])
  }
}

// ---------------------------------------------------------------- the tower

const tank = new Part()   // white shell, walkway rail, finial
const steel = new Part()  // columns, struts, rods, riser, walkway floor

const C: [number, number] = [0, 0]
const R = 12.0            // tank radius; the lidar disc is 25.5 m with the walkway
const Z_BOT = 29.5        // underside of the lower head
const LOWER = 8.5         // lower head depth
const BAND = 2.0          // cylindrical band between the heads
const UPPER = 9.0         // upper head rise
const Z_EQ = Z_BOT + LOWER            // 38.0: lower head meets the band
const Z_WALK = Z_EQ + BAND            // 40.0: walkway, top of the band
const Z_TOP = Z_WALK + UPPER          // 49.0: crown
const SEG = 28
const LEGS = 16
const LEG = 0.38, STRUT = 0.27, ROD = 0.18        // half-widths
const R_LEG = R + 0.15                // columns stand just outside the band, vertical

// Tank: lower head up to the band, the band, then the upper head.
const lower = head(R, LOWER, Z_EQ, false, 8)
const upper = head(R, UPPER, Z_WALK, true, 8)
lathe(tank, [...lower, [R, Z_EQ], [R, Z_WALK], [R, Z_WALK], ...upper], SEG)
// Finial: a ball on a short neck.
lathe(tank, [[0.45, Z_TOP - 0.05], [0.45, Z_TOP + 0.35]], 10)
ball(tank, 0.35, Z_TOP + 0.3, ...C)

// Walkway: a dark floor slab and a pale band where the white rail is.
const W0 = R - 0.05, W1 = R + 0.9
lathe(steel, [[W0, Z_WALK - 0.4], [W1, Z_WALK - 0.4], [W1, Z_WALK - 0.4], [W1, Z_WALK], [W1, Z_WALK], [W0, Z_WALK]], SEG)
lathe(tank, [[W1, Z_WALK], [W1, Z_WALK + 1.0], [W1, Z_WALK + 1.0], [W1 - 0.25, Z_WALK + 1.0]], SEG)

// Central riser, 2.2 m across, from the ground into the lower head.
lathe(steel, [[1.1, 0], [1.1, Z_BOT + 0.6]], 14)

// Columns, ground to the walkway floor.
const legAt = (i: number, z: number): V3 => {
  const t = (i / LEGS) * TAU + TAU / (LEGS * 2)
  return [R_LEG * Math.cos(t), R_LEG * Math.sin(t), z]
}
for (let i = 0; i < LEGS; i++) beam(steel, legAt(i, 0), legAt(i, Z_WALK - 0.4), LEG, true)

// Strut rings, and crossed rods between them. The real rods also cross the
// panel over the lower head, but they are hairlines there against the white
// shell; drawn at a size that reads, they turned the bowl into a dark belt at
// phone size, so that panel keeps only its strut ring.
const TIERS = [24.5, 31.5]
for (const z of TIERS)
  for (let i = 0; i < LEGS; i++) beam(steel, legAt(i, z), legAt((i + 1) % LEGS, z), STRUT)
for (let k = 0; k < TIERS.length - 1; k++) {
  const z0 = TIERS[k] + 0.4, z1 = TIERS[k + 1] - 0.4
  for (let i = 0; i < LEGS; i++) {
    const j = (i + 1) % LEGS
    beam(steel, legAt(i, z0), legAt(j, z1), ROD)
    beam(steel, legAt(j, z0), legAt(i, z1), ROD)
  }
}

const parts = [
  { part: tank, material: finish('tank-white', 0xeceae4, 0.6) },
  { part: steel, material: finish('tower-navy', 0x4a5263, 0.7) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Elizabeth water tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: Z_TOP + 1.0, bearing: 0,
})
await Bun.write(new URL('../models/elizabeth-water-tower.glb', import.meta.url), glb)
console.log(`elizabeth-water-tower.glb: ${triangles} triangles, ${glb.length} bytes`)
