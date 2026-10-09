/**
 * Camp North End water tower, Statesville Ave, Charlotte — procedural, CC0-1.0.
 * bun generators/camp-north-end-water-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centre of the OSM outline (way/833631505, man_made=water_tower, historic,
 * height 35, a 9.9 m circle; not tagged as a building, so nothing to
 * replace). Round, so bearing 0.
 *
 * The 1924 water tower of Albert Kahn's Ford Motor Company assembly plant,
 * later the Charlotte Army Missile Plant and now Camp North End, where it
 * stands east of the Kahn Boilerhouse as the site's emblem. It is part of
 * the designated landmark (Charlotte-Mecklenburg Historic Landmarks
 * Commission, 2019) and held "more than 105,000 gallons" (Camp North End
 * history).
 *
 * A classic four-post riveted tank: a squat cylinder with a hemispherical
 * bottom and a conical roof under an overhanging lip, a walkway where
 * cylinder meets bowl, four battered columns on the diagonals, a slender
 * riser with a collar under the bowl, two square strut frames and crossed
 * rods. Unpainted and weathered to a dark brown-black with rust, the riser
 * a brighter rust.
 *
 * Rework (2026): the form of the first model is kept; its size, height,
 * spread of the legs and colours now follow the lidar and the photos.
 *
 * Evidence
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m DSM and ground
 *    (the tower predates the site's renovation and is unchanged); y = 0 is
 *    the lowest ground under the legs, 224.0 m NAVD88. The tank's disc,
 *    10.3 m across over the roof lip, is centred 0.9 m east and 0.5 m south
 *    of the OSM centre; its eave is 37.6 m, the roof rises about 0.5 m per
 *    metre to 39.6 m and a vent to 40.1 m. Two square strut frames show
 *    under it, at 11.3 m (about 10 m a side, centred on the tank) and
 *    22.5 m (about 8.8 m a side): the legs stand on the diagonals, battered
 *    0.055 m per metre each way, about 7.9 m from the axis at the ground.
 *  - "Camp North End, Charlotte, NC", AdamChandler86, Flickr, CC BY-NC-ND 2.0
 *    (looked at, not copied): the tank's shape from below, the lipped roof,
 *    walkway, four lattice columns, riser and collar, rod bracing. Toned
 *    sepia, so no colour from it.
 *  - Look-only: MacRostie Historic Advisors, May 2018, "Ford Motor Co.
 *    Boiler House and Water Tower, West Elevation, Facing East", in the
 *    Historic Landmarks Commission designation report: the colours, dark
 *    weathered brown-black steel with rust, the riser rust-orange.
 *  - No CC-licensed colour photo was found: Commons and Openverse have
 *    nothing else, and Mapillary has no coverage inside Camp North End.
 *
 * Massing changes from the first model, with their evidence: the top was
 * OSM's 35 m; the lidar gives 40.1 m, so the tank is raised (eave 34.3 m to
 * 37.6 m). The tank was 8.5 m across; the lidar disc gives 9.8 m (10.3 m
 * over the lip). The legs stood 4.85 m from the axis at the ground; the
 * lidar's strut frames put them 7.9 m out, a wider and more battered base.
 * The tower moves 1.0 m to the lidar centre. The Kahn Boilerhouse model's
 * east wall is about 9.5 m west of the nearest leg.
 *
 * Estimated: the cylinder and bowl split (photo proportions: cylinder 0.43,
 * bowl 0.5 of the width; about 150,000 gallons at this size, against "more
 * than 105,000"), the top strut frame under the bowl, the riser's collar,
 * member sizes, thickened to read at phone size (columns 0.9 m, struts
 * 0.56 m, rods 0.36 m). The dark brown is pulled to the palette's floor of
 * charcoal lightness so the tower reads as the dark one it is. No ladder,
 * railing or lettering.
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

const tank = new Part()   // weathered shell, roof, walkway
const steel = new Part()  // columns, struts, rods
const rust = new Part()   // riser and its collar

const C: [number, number] = [0.9, -0.47]   // lidar centre
const R = 4.9, LIP = 5.2
const Z_EAVE = 37.6, Z_APEX = 39.6
const Z_CYL = Z_EAVE - 4.2            // 33.4: cylinder meets bowl, walkway
const Z_BOT = Z_CYL - 4.9             // 28.5: bottom of the bowl
const SEG = 20, LEGS = 4
const LEG = 0.45, STRUT = 0.28, ROD = 0.18          // half-widths

const bowl = head(R, Z_CYL - Z_BOT, Z_CYL, false, 7)
lathe(tank, [...bowl, [R, Z_CYL], [R, Z_CYL], [R, Z_EAVE - 0.3]], SEG, ...C)
// The roof: an overhanging lip, then a cone to the vent.
lathe(tank, [[R - 0.05, Z_EAVE - 0.3], [LIP, Z_EAVE - 0.3], [LIP, Z_EAVE - 0.3], [LIP, Z_EAVE + 0.15], [LIP, Z_EAVE + 0.15], [0.4, Z_APEX - 0.05], [0, Z_APEX]], SEG, ...C)
lathe(tank, [[0.4, Z_APEX - 0.1], [0.4, Z_APEX + 0.3], [0.4, Z_APEX + 0.3], [0, Z_APEX + 0.5]], 8, ...C)

// Walkway at the bowl's rim: a floor and a deep fascia for its railing.
lathe(tank, [[R - 0.05, Z_CYL - 0.25], [R + 0.75, Z_CYL - 0.25], [R + 0.75, Z_CYL - 0.25], [R + 0.75, Z_CYL + 0.8], [R + 0.75, Z_CYL + 0.8], [R - 0.05, Z_CYL + 0.8]], SEG, ...C)

// Riser with its collar under the bowl.
lathe(rust, [[0.5, 0], [0.5, Z_BOT - 2.8], [0.5, Z_BOT - 2.8], [1.05, Z_BOT - 2.7], [1.05, Z_BOT - 1.9], [1.05, Z_BOT - 1.9], [0.5, Z_BOT - 1.8], [0.5, Z_BOT + 0.4]], 12, ...C)

// Four columns on the diagonals, battered 0.055 m per metre each way: half
// a side of 5.6 m at the ground (lidar frames at 11.3 and 22.5 m), meeting
// the walkway at the top.
const half = (z: number) => 5.6 - 0.055 * z
const at = (i: number, z: number): V3 => {
  const a = (i / LEGS) * TAU + TAU / (LEGS * 2)
  const r = half(z) * Math.SQRT2
  return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a), z]
}
for (let i = 0; i < LEGS; i++) beam(steel, at(i, 0), at(i, Z_CYL - 0.25), LEG, true, C)
const TIERS = [0, 11.3, 22.5, Z_BOT - 0.6]
for (let k = 1; k < TIERS.length; k++)
  for (let i = 0; i < LEGS; i++) beam(steel, at(i, TIERS[k]), at((i + 1) % LEGS, TIERS[k]), STRUT, false, C)
for (let k = 0; k < TIERS.length - 1; k++) {
  const z0 = TIERS[k] + 0.4, z1 = TIERS[k + 1] - 0.4
  for (let i = 0; i < LEGS; i++) {
    const j = (i + 1) % LEGS
    beam(steel, at(i, z0), at(j, z1), ROD, false, C)
    beam(steel, at(j, z0), at(i, z1), ROD, false, C)
  }
}

const parts = [
  { part: tank, material: finish('weathered-steel', 0x5f4d43, 0.85) },
  { part: steel, material: finish('weathered-frame', 0x4f4642, 0.85) },
  { part: rust, material: finish('rust', 0x9a6446, 0.85) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Camp North End water tower', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: Z_APEX + 0.5, bearing: 0,
})
await Bun.write(new URL('../models/camp-north-end-water-tower.glb', import.meta.url), glb)
console.log(`camp-north-end-water-tower.glb: ${triangles} triangles, ${glb.length} bytes`)
