/**
 * Vest Station water towers, Beatties Ford Road at Patton Ave, Charlotte —
 * procedural, CC0-1.0.
 * bun generators/beatties-ford-water-tower.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground midway
 * between the two towers' OSM outlines (way/869290547, a 19.7 m circle, and
 * way/869290548, 13.5 m), which stand 40 m apart on a north-south line at
 * the south end of the Vest Water Treatment Plant. Bearing 0.
 *
 * The plant on Beatties Ford Road is Vest Station (Charlotte Water Works,
 * 1924, a designated Charlotte-Mecklenburg historic landmark); the landmark
 * report (Loken, 1990) singles out "its two towering water tanks".
 *
 * The south one, Charlotte Water's "Patton Avenue water tank", is a tall
 * cylinder with a hemi-ellipsoidal bottom, a conical roof with a rolled eave
 * and a ball finial, a walkway where cylinder meets bowl, eight near-vertical
 * columns, a wide riser, and rings of struts with crossed rods. The north one
 * is a squat saucer on six short columns: a shallow bowl, a short band with
 * a walkway, a low dome and a ball finial. Both pale grey on near-black
 * steel since the 2022 repaint.
 *
 * Rework (2026): the forms of the first model are kept; heights, sizes,
 * positions and colours now follow the lidar and the photos.
 *
 * Evidence
 *  - Lidar, USGS 3DEP NC Phase 4 Mecklenburg 2016, 0.5 m DSM and ground.
 *    y = 0 is the lowest ground under the two towers, 225.2 m NAVD88.
 *    South tank: a disc 20.6 m across (eave lip included), centred at
 *    (3.5, -21.2), 1.3 m south of the OSM circle; eave 47.6 m at r 10 m, the
 *    roof falling 0.53 m per metre from the finial, ball top 54.4 m.
 *    North tank: a disc 13 m across centred at (-5.7, 20.2), 2.1 m west of
 *    its OSM circle; rim 14.4 m at r 6.5 m, dome 16.6 m, finial top 17.8 m.
 *    The OSM circles were most likely traced off tank tops leaning in
 *    off-nadir imagery; the lidar sees each tank straight above its legs,
 *    so the towers stand at the lidar centres.
 *  - Mapillary street frames (CC BY-SA 4.0) from Brookshire Freeway, April
 *    2022 (ids 582383733235380, 5292041420848463, 537280747751815), 170-380 m
 *    west: the pale grey tank, its cylinder about 0.6 of its width tall, the
 *    bowl about half, the black columns and riser, two strut rings showing
 *    between the trees; the north saucer's dome, rim railing and finial over
 *    the trees. Beatties Ford Road frames, August 2018 (806619373392749,
 *    4132372766823868).
 *  - Published: Historic Landmarks Commission survey, "elevated 1,000,000
 *    gallon storage tank" (1924).
 *
 * Massing changes from the first model, with their evidence: the south tank
 * was 16 m wide with its walkway at 24.4 m and apex at 40 m, scaled off an
 * undated photo; the lidar gives a 20.6 m disc and a 54.4 m top, so the tank
 * is now 18.8 m wide (19.8 m over the eave), walkway at 36 m, eave 47.6 m.
 * The north saucer was topped at 12.6 m; the lidar puts its rim at 14.4 m
 * and its finial at 17.8 m, so it is raised 4.6 m. Both moved to the lidar
 * centres (above). The columns, now under a wider tank, stay near vertical
 * as the 2022 frames show them.
 *
 * Estimated: the cylinder and bowl split of the south tank (photo ratios; at
 * this size it holds about 1.25 million gallons, above the published
 * million, which may be a nominal or earlier figure), the strut-ring
 * heights, the north saucer's bowl and band (mostly hidden by trees in every
 * frame), member sizes, thickened to read at phone size (columns 1.1 m, struts
 * 0.64 m, rods 0.4 m). The near-black steel is pulled to charcoal, per STYLE.md.
 *
 * The plant building itself is not modelled.
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

// ---------------------------------------------------------------- the towers

const tank = new Part()   // pale grey shells, roofs and finials
const steel = new Part()  // columns, struts, rods, risers, walkways, eave

const SOUTH: [number, number] = [3.46, -21.22]   // lidar centres
const NORTH: [number, number] = [-5.69, 20.18]

const LEG = 0.55, STRUT = 0.32, ROD = 0.2          // half-widths: bold columns, lighter bracing so the tank leads

type Tower = {
  c: [number, number]
  legs: number
  rFoot: number          // column radius at the ground
  rTop: number           // and where it meets the walkway
  zTop: number           // top of the columns
  tiers: number[]        // strut rings; crossed rods brace the panels between
  riser: number          // riser radius
  zRiser: number         // riser top, inside the tank
}

function frame(t: Tower) {
  const at = (i: number, z: number): V3 => {
    const a = (i / t.legs) * TAU + TAU / (t.legs * 2)
    const r = t.rFoot + (t.rTop - t.rFoot) * (z / t.zTop)
    return [t.c[0] + r * Math.cos(a), t.c[1] + r * Math.sin(a), z]
  }
  for (let i = 0; i < t.legs; i++) beam(steel, at(i, 0), at(i, t.zTop), LEG, true, t.c)
  for (let k = 1; k < t.tiers.length; k++)
    for (let i = 0; i < t.legs; i++) beam(steel, at(i, t.tiers[k]), at((i + 1) % t.legs, t.tiers[k]), STRUT, false, t.c)
  for (let k = 0; k < t.tiers.length - 1; k++) {
    const z0 = t.tiers[k] + 0.5, z1 = t.tiers[k + 1] - 0.5
    for (let i = 0; i < t.legs; i++) {
      const j = (i + 1) % t.legs
      beam(steel, at(i, z0), at(j, z1), ROD, false, t.c)
      beam(steel, at(j, z0), at(i, z1), ROD, false, t.c)
    }
  }
  lathe(steel, [[t.riser, 0], [t.riser, t.zRiser]], 12, t.c[0], t.c[1])
}

/**
 * A walkway: a dark floor slab under a pale band where the railing is, which
 * is how the white-painted rail reads from the street.
 */
function walkway(c: [number, number], r0: number, r1: number, z: number, seg: number) {
  lathe(steel, [[r0, z - 0.35], [r1, z - 0.35], [r1, z - 0.35], [r1, z + 0.05], [r1, z + 0.05], [r0, z + 0.05]], seg, c[0], c[1])
  lathe(tank, [[r1, z + 0.05], [r1, z + 1.0], [r1, z + 1.0], [r1 - 0.25, z + 1.0]], seg, c[0], c[1])
}

// South: the 1924 tank.
{
  const R = 9.4, Z_CYL = 36.0, Z_BOT = 27.5, Z_EAVE = 47.6, Z_APEX = 52.8, SEG = 24
  const bowl = head(R, Z_CYL - Z_BOT, Z_CYL, false, 7)
  lathe(tank, [...bowl, [R, Z_CYL], [R, Z_CYL], [R, Z_EAVE - 0.35]], SEG, ...SOUTH)
  // Roof: a cone of 0.53 m per metre (lidar), slightly rounded at the top.
  lathe(tank, [[9.85, Z_EAVE + 0.2], [6.5, Z_EAVE + 2.0], [3.0, Z_EAVE + 3.85], [1.0, Z_APEX - 0.15], [0, Z_APEX]], SEG, ...SOUTH)
  // The rolled eave, pale like the roof (2022 frames).
  lathe(tank, [[R - 0.05, Z_EAVE - 0.6], [R + 0.35, Z_EAVE - 0.5], [R + 0.55, Z_EAVE - 0.15], [R + 0.5, Z_EAVE + 0.15], [R + 0.4, Z_EAVE + 0.3]], SEG, ...SOUTH)
  ball(tank, 0.8, Z_APEX - 0.2, ...SOUTH)
  walkway(SOUTH, R - 0.05, R + 0.9, Z_CYL, SEG)
  frame({ c: SOUTH, legs: 8, rFoot: 9.9, rTop: R + 0.3, zTop: Z_CYL + 0.3, tiers: [0, 9.0, 18.0, 26.5], riser: 1.2, zRiser: Z_BOT + 0.6 })
}

// North: the squat saucer: a shallow lower head, a narrow band carrying the
// walkway, a low dome and a ball finial.
{
  const R = 6.3, Z_BOT = 10.8, LOWER = 2.4, BAND = 1.2, UPPER = 2.2, SEG = 20
  const Z_EQ = Z_BOT + LOWER, Z_TOP = Z_EQ + BAND + UPPER          // 13.2, 16.6
  const lower = head(R, LOWER, Z_EQ, false, 5)
  const upper = head(R, UPPER, Z_EQ + BAND, true, 6)
  lathe(tank, [...lower, [R, Z_EQ], [R, Z_EQ + BAND], [R, Z_EQ + BAND], ...upper], SEG, ...NORTH)
  ball(tank, 0.6, Z_TOP - 0.05, ...NORTH)
  walkway(NORTH, R - 0.05, R + 0.7, Z_EQ + BAND, SEG)
  frame({ c: NORTH, legs: 6, rFoot: 6.6, rTop: R + 0.2, zTop: Z_EQ + 0.3, tiers: [0, 5.2, Z_BOT - 0.6], riser: 0.9, zRiser: Z_BOT + 0.4 })
}

const parts = [
  { part: tank, material: finish('tank-grey', 0xdcdfdd, 0.6) },
  { part: steel, material: finish('tower-steel', 0x4a4f57, 0.7) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
console.log(parts.map(({ part, material }) => `${material.name}: ${part.triangles}`).join('\n'))
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Vest Station water towers', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres, origin at ground', height: 54.4, bearing: 0,
})
await Bun.write(new URL('../models/beatties-ford-water-tower.glb', import.meta.url), glb)
console.log(`beatties-ford-water-tower.glb: ${triangles} triangles, ${glb.length} bytes`)
