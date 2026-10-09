/**
 * Shrine Auditorium (Al Malaikah Temple, 1926, John C. Austin with A. M.
 * Edelman and G. Albert Lansburgh), Los Angeles — procedural, CC0-1.0.
 * bun generators/la-shrine-auditorium.ts
 *
 * Map frame: x across the building, y along it, z up, metres. Placed at
 * bearing 28°, the long sides of OSM way/407613039, so +y runs north-north-
 * east from Jefferson Boulevard and -x faces the parking lot on the
 * west-north-west, where the main front stands between its two domed
 * towers. The anchor is the outline's area centroid, on the lowest ground
 * under it (57.4 m, USGS 3DEP; the site is flat to a metre and a half).
 *
 * What makes it the Shrine: the Moorish Revival front, two square towers at
 * its corners stepping up to drums and gold domes, five great round arches
 * at the foot of the front and a long row of small arched windows over
 * them; the pale peach stucco; the wide, shallow dome of the auditorium roof
 * rising behind; the arcaded wing along Jefferson Boulevard.
 *
 * Sources:
 * - Plan: OSM way/407613039 (35.1 m) and LARIAC 2020 footprint
 *   476299831096 (35.06 m): the auditorium, the Jefferson wing, a low block
 *   to the north and the long gabled hall behind, which the outline takes in.
 * - Heights: LA County 2006 lidar surface model, 3 m grid in this frame:
 *   front 21.6 m, the hall's walls 24 m and its dome 34.6 m, the stage
 *   house 30 m, the domed towers 24 m to the shaft, the domes'
 *   crowns 36.5 m and finials 40 m (1 m lidar samples), the Jefferson wing and north block 11.6 m, the hall's eaves
 *   11.6 m and ridge 16.6 m. Dome positions from the NAIP orthophoto.
 * - Photos (Wikimedia Commons): "Al Malaikah Temple-Shrine Auditorium"
 *   and "Al Malaikah Temple - Shrine Auditorium" (Bruce Boehner, CC BY-SA
 *   3.0; the front square on and from the south-west), MikeJiroch's 2013
 *   series (CC BY-SA 3.0; the Jefferson arcade, the domes), "Shrine
 *   Auditorium spire" and "Shrine Auditorium side" (Dreamyshade, CC BY-SA
 *   3.0; the towers' steps and drums), "The Shrine Auditorium - Al Malaikah
 *   Temple" (Stephanie Kemna, CC BY-SA 3.0).
 * - Estimated: the towers' stages, drum and dome proportions (from photos),
 *   the arch and window counts, the wing's arcade.
 * - Left out: the crescent finials' detail, tile ornament, lamps, signs,
 *   the expo hall's skylights.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const stucco = new Part(), trim = new Part(), gold = new Part(), roof = new Part(), win = new Part()

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const unit = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1))
function quad(p: Part, P: V3[], hint: V3, ns?: V3[]) {
  const f = add(cross(sub(P[1], P[0]), sub(P[2], P[0])), cross(sub(P[2], P[0]), sub(P[3], P[0])))
  const ord = dot(f, hint) >= 0 ? [0, 1, 2, 3] : [0, 3, 2, 1]
  const n = ns?.map(unit)
  const t = (a: number, b: number, c: number) => {
    const A = P[ord[a]], B = P[ord[b]], C = P[ord[c]]
    if (Math.hypot(...cross(sub(B, A), sub(C, A))) < 1e-9) return
    p.tri(A, B, C, undefined, undefined, undefined, n && [n[ord[a]], n[ord[b]], n[ord[c]]])
  }
  t(0, 1, 2)
  t(0, 2, 3)
}

/** A box from z0 to z1 with a bevelled cornice lip; walls in `wall`, top in `top`. */
function block(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, wall = stucco, top = roof, lip = 0.5) {
  const c: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const ci: [number, number][] = [[x0 + lip, y0 + lip], [x1 - lip, y0 + lip], [x1 - lip, y1 - lip], [x0 + lip, y1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4], ai = ci[i], bi = ci[(i + 1) % 4]
    const o: V3 = [(a[0] + b[0]) / 2 - (x0 + x1) / 2, (a[1] + b[1]) / 2 - (y0 + y1) / 2, 0]
    quad(wall, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip]], o)
    quad(trim, [[a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], [bi[0], bi[1], z1], [ai[0], ai[1], z1]], add(unit(o), [0, 0, 1]))
  }
  quad(top, ci.map(([x, y]) => [x, y, z1] as V3), [0, 0, 1])
}

/**
 * A flat round-headed window panel on a wall plane: `at(s, z)` maps a
 * position along the wall and a height to a point just proud of it.
 */
function archWindow(p: Part, at: (s: number, z: number) => V3, s: number, w: number, z0: number, z1: number, n: V3, segs = 6) {
  const r = w / 2, zs = z1 - r
  quad(p, [at(s - r, z0), at(s + r, z0), at(s + r, zs), at(s - r, zs)], n)
  const c = at(s, zs)
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI, a1 = ((i + 1) / segs) * Math.PI
    const A = at(s + r * Math.cos(a0), zs + r * Math.sin(a0)), B = at(s + r * Math.cos(a1), zs + r * Math.sin(a1))
    if (dot(cross(sub(A, c), sub(B, c)), n) >= 0) p.tri(c, A, B)
    else p.tri(c, B, A)
  }
}

// ---------------------------------------------------------------------------
// Massing (lidar heights). The auditorium is a hall under a wide, shallow
// dome, with the flat-topped stage house at its east end.
const FRONT_X = -48, AUD_X0 = -40, STAGE_X = 15, AUD_X1 = 39, AUD_Y0 = -55, AUD_Y1 = 3
const FRONT_H = 21.6, WALL_H = 24, DOME_TOP = 34.6, STAGE_H = 30

block(AUD_X0, STAGE_X + 0.5, AUD_Y0, AUD_Y1, 0, WALL_H, stucco, roof)
block(STAGE_X, AUD_X1, AUD_Y0, AUD_Y1, 0, STAGE_H, stucco, roof)
{
  const cx = (AUD_X0 + STAGE_X) / 2 - 1, cy = (AUD_Y0 + AUD_Y1) / 2
  const ax = (STAGE_X - AUD_X0) / 2 - 1.5, ay = (AUD_Y1 - AUD_Y0) / 2 - 1.5
  const SEG = 28, RINGS = 5, RISE = DOME_TOP - WALL_H
  const e = 0.7 // superellipse exponent: a rounded-square plan
  const pt = (i: number, j: number): V3 => {
    const a = (i / SEG) * 2 * Math.PI, t = ((j / RINGS) * Math.PI) / 2
    const f = Math.cos(t)
    const c = Math.cos(a), s = Math.sin(a)
    return [cx + ax * f * Math.sign(c) * Math.abs(c) ** e, cy + ay * f * Math.sign(s) * Math.abs(s) ** e, WALL_H + RISE * Math.sin(t)]
  }
  const nrm = (i: number, j: number): V3 => {
    const a = (i / SEG) * 2 * Math.PI, t = ((j / RINGS) * Math.PI) / 2
    return unit([(Math.cos(a) * Math.cos(t) * RISE) / ax, (Math.sin(a) * Math.cos(t) * RISE) / ay, Math.sin(t) + 0.15])
  }
  for (let i = 0; i < SEG; i++) for (let j = 0; j < RINGS; j++) {
    quad(roof, [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)], [0, 0, 1], [nrm(i, j), nrm(i + 1, j), nrm(i + 1, j + 1), nrm(i, j + 1)])
  }
}

// The front: a 21.6 m block across the auditorium's west end.
block(FRONT_X, AUD_X0 + 0.5, AUD_Y0, AUD_Y1, 0, FRONT_H, stucco, roof)
// Jefferson Boulevard wing, the low north block and the long gabled hall.
block(-44.5, 41.7, -73.3, AUD_Y0 + 0.3, 0, 11.6, stucco, roof)
block(FRONT_X, -8, AUD_Y1 - 0.3, 38.3, 0, 11.6, stucco, roof)
{
  const x0 = -7.8, x1 = 36, y0 = AUD_Y1 - 0.3, y1 = 98, EAVE = 11.6, RIDGE = 16.6, xm = (x0 + x1) / 2
  quad(stucco, [[x0, y0, 0], [x0, y1, 0], [x0, y1, EAVE], [x0, y0, EAVE]], [-1, 0, 0])
  quad(stucco, [[x1, y0, 0], [x1, y1, 0], [x1, y1, EAVE], [x1, y0, EAVE]], [1, 0, 0])
  for (const [y, s] of [[y0, -1], [y1, 1]] as [number, number][]) {
    quad(stucco, [[x0, y, 0], [x1, y, 0], [x1, y, EAVE], [x0, y, EAVE]], [0, s, 0])
    const A: V3 = [x0, y, EAVE], B: V3 = [x1, y, EAVE], Cc: V3 = [xm, y, RIDGE]
    if (dot(cross(sub(B, A), sub(Cc, A)), [0, s, 0]) >= 0) stucco.tri(A, B, Cc)
    else stucco.tri(A, Cc, B)
  }
  quad(roof, [[x0 - 0.4, y0, EAVE - 0.2], [x0 - 0.4, y1, EAVE - 0.2], [xm, y1, RIDGE], [xm, y0, RIDGE]], [-1, 0, 2])
  quad(roof, [[x1 + 0.4, y0, EAVE - 0.2], [x1 + 0.4, y1, EAVE - 0.2], [xm, y1, RIDGE], [xm, y0, RIDGE]], [1, 0, 2])
  // a band of tall windows along the hall's sides, one per bay
  for (const [x, s] of [[x0, -1], [x1, 1]] as [number, number][]) {
    const at = (yy: number, z: number): V3 => [x + s * 0.05, yy, z]
    for (let yy = y0 + 8; yy < y1 - 4; yy += 8) archWindow(win, at, yy, 3.4, 4, 9.5, [s, 0, 0], 4)
  }
}

// ---------------------------------------------------------------------------
// The west front, square on (-x): five great round arches at its foot, a
// row of thirteen small arched windows above, between the towers.
{
  const x = FRONT_X - 0.06
  const at = (y: number, z: number): V3 => [x, y, z]
  const y0 = AUD_Y0 + 9.5, y1 = AUD_Y1 - 9.5, span = y1 - y0
  for (let i = 0; i < 5; i++) archWindow(win, at, y0 + (span * (i + 0.5)) / 5, 5.8, 1.2, 10.6, [-1, 0, 0], 8)
  for (let i = 0; i < 11; i++) archWindow(win, at, y0 + (span * (i + 0.5)) / 11, 2.2, 13, 17.8, [-1, 0, 0], 4)
}
// The Jefferson wing's arcade (-y face): tall round-headed openings.
{
  const y = -73.3 - 0.06
  const at = (s: number, z: number): V3 => [s, y, z]
  const x0 = -36, x1 = 36, n = 11
  for (let i = 0; i < n; i++) archWindow(win, at, x0 + ((x1 - x0) * (i + 0.5)) / n, 4, 1, 8.6, [0, -1, 0], 6)
}
// The auditorium's long sides above the wing: tall arched windows in pairs.
for (const [y, s] of [[AUD_Y0 - 0.06, -1], [AUD_Y1 + 0.06, 1]] as [number, number][]) {
  const at = (xx: number, z: number): V3 => [xx, y, z]
  for (let i = 0; i < 6; i++) archWindow(win, at, AUD_X0 + 5 + i * 8.6, 2.8, 13.5, 21, [0, s, 0], 4)
}
// The east end, above the hall.
{
  const at = (yy: number, z: number): V3 => [AUD_X1 + 0.06, yy, z]
  for (let i = 0; i < 5; i++) archWindow(win, at, AUD_Y0 + 8 + i * 10.5, 3, 14, 23, [1, 0, 0], 4)
}

// ---------------------------------------------------------------------------
// The domed towers at the front's corners: a square shaft, two stepped
// stages, a round drum ringed with small arched windows, a gold dome with a
// slight onion swell and a finial.
function tower(cx: number, cy: number) {
  // lidar (1 m samples): shaft and stages to 27 m, drum, dome widest at
  // 31 m and about 8 m across, its crown 36.5 m and the finial 40 m
  const SH = 24.2, HW = 4.6
  block(cx - HW, cx + HW, cy - HW, cy + HW, 0, SH, stucco, stucco, 0.5)
  block(cx - 4.0, cx + 4.0, cy - 4.0, cy + 4.0, SH, SH + 1.4, stucco, stucco, 0.35)
  block(cx - 3.5, cx + 3.5, cy - 3.5, cy + 3.5, SH + 1.4, SH + 2.6, stucco, stucco, 0.3)
  const R = 3.4, Z0 = SH + 2.6, Z1 = Z0 + 2.4, SEG = 16
  const p = (a: number, r: number, z: number): V3 => [cx + r * Math.cos(a), cy + r * Math.sin(a), z]
  for (let i = 0; i < SEG; i++) {
    const a0 = (i / SEG) * 2 * Math.PI, a1 = ((i + 1) / SEG) * 2 * Math.PI
    const n0: V3 = [Math.cos(a0), Math.sin(a0), 0], n1: V3 = [Math.cos(a1), Math.sin(a1), 0]
    quad(stucco, [p(a0, R, Z0), p(a1, R, Z0), p(a1, R, Z1), p(a0, R, Z1)], add(n0, n1), [n0, n1, n1, n0])
    if (i % 2 === 0) {
      const am = (a0 + a1) / 2
      const at = (s: number, z: number): V3 => [cx + (R + 0.05) * Math.cos(am) - s * Math.sin(am), cy + (R + 0.05) * Math.sin(am) + s * Math.cos(am), z]
      archWindow(win, at, 0, 0.8, Z0 + 0.6, Z1 - 0.5, [Math.cos(am), Math.sin(am), 0], 3)
    }
  }
  // dome profile: (radius, height) from the drum's top to the point; a
  // slight onion swell over the drum, as in the photos
  const prof: [number, number][] = [[R + 0.3, Z1], [R + 0.9, Z1 + 1.3], [R + 0.75, Z1 + 3.0], [R - 0.1, Z1 + 4.4], [R - 1.6, Z1 + 5.7], [0.45, Z1 + 6.4], [0.15, Z1 + 9.6]]
  for (let i = 0; i < SEG; i++) {
    const a0 = (i / SEG) * 2 * Math.PI, a1 = ((i + 1) / SEG) * 2 * Math.PI
    for (let j = 0; j < prof.length - 1; j++) {
      const [r0, z0] = prof[j], [r1, z1] = prof[j + 1]
      const sl = (r0 - r1) / (z1 - z0 || 1)
      const nn = (a: number): V3 => unit([Math.cos(a), Math.sin(a), sl])
      quad(gold, [p(a0, r0, z0), p(a1, r0, z0), p(a1, r1, z1), p(a0, r1, z1)], add(nn(a0), nn(a1)), [nn(a0), nn(a1), nn(a1), nn(a0)])
    }
  }
}
tower(-43.5, -53)
tower(-43.5, 1.5)

// ---------------------------------------------------------------------------
// Palette: the pale peach stucco and the gold domes are the Shrine's own, pulled
// to palette lightness from daylight photos; cornices `trim`; the roofs a
// light silver grey (the dome is pale metal), windows and arches `window`.
const parts = [
  { part: stucco, material: finish('shrine-stucco', 0xf0cdb6) },
  { part: trim, material: PALETTE.trim },
  { part: gold, material: finish('shrine-dome-gold', 0xdfb560) },
  { part: roof, material: finish('shrine-roof-silver', 0xc3c8cc) },
  { part: win, material: PALETTE.window },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
for (const { part, material } of parts) console.log(material.name.padEnd(20), part.triangles)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Shrine Auditorium', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor',
  bearing: 28, osm: 'way/407613039',
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = new URL('../models/la-shrine-auditorium.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
