/**
 * BMW-Vierzylinder (BMW headquarters), Munich: procedural, CC0-1.0.
 * bun generators/munich-bmw-vierzylinder.ts
 *
 * Uses the geometry kit exported by generators/munich-olympiaturm.ts.
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (the cylinders sit on
 * the diagonals, the core's faces look N, E, S, W). Origin: the centroid of
 * OSM way/146381661; the building's own centre is 0.3 m south of it (OSM's
 * core tubes and lobes).
 *
 * Karl Schwanzer, 1968-73 (engineer Helmut Bomhard); renovated 2004-06.
 * Four cylinders round a core of four concrete tubes; the floors hang from
 * cantilever arms at the top and are split by a recessed technical floor
 * above mid-height. Silver cast-aluminium facade, BMW-blue technical band,
 * roundels on the core at the top.
 *
 * Published (de.wikipedia "BMW-Vierzylinder"): 101 m high, 22 storeys
 * (18 office), four cylinders, the set-back "above the midpoint".
 * OSM (heights tagged by mappers): the four lobes as one outline
 * (way/146381661, 47 m across the axes, 56.6 m across the diagonals); lower
 * block 11-56 m and upper block 60-89 m (relations 2785005, 2785006); the
 * recessed ring 56-60 m (way/193654798, lobes of r 8.8); core tubes r 4.45
 * at the diagonals to 101 m (ways 193654789/90/91/94); the blue core square
 * 18 m to 100 m (way/193654797); hanger tops r 2 at (+-12, +-12) to 98 m;
 * the two-storey podium, 8 m (way/310279165).
 * Measured in OSM's plan: lobe centres at (+-11.6, +-11.6), r 11.9 (the
 * outline's diagonal reach 28.3 m and its 23.5 m reach along the axes).
 * From photos (Herzog 2014 from the north, scaled on the published 101 m):
 * cylinders from 11 m, the blue band 54.6-61.6 m, roofs at 91 m (OSM's
 * 89 m reads low against the photo; 91 is between the two), roundels 7.6 m
 * across centred at 95 m, the arms' two struts (upper level, lower raking).
 * Estimated: the facade as wide horizontal window bands about two storeys
 * each (six below the technical storey, four above) between broad bright
 * aluminium spandrels, with thin fins every fourth of 24 bays; the slots
 * between the cylinders drawn as a deep dark recess (8 m); the arms'
 * sections; the podium's glazing height.
 *
 * Photos (Wikimedia Commons, EVIDENCE):
 * - "BMW Vierzylinder Tower Munich 2014 01.jpg", Julian Herzog, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:BMW_Vierzylinder_Tower_Munich_2014_01.jpg
 * - "BMW tower seen from Olympic tower on a sunny November afternoon.jpg",
 *   Markus Matern, CC BY-SA 3.0 (from the south-west, above: the cap,
 *   arms, blue band and the museum bowl)
 *   https://commons.wikimedia.org/wiki/File:BMW_tower_seen_from_Olympic_tower_on_a_sunny_November_afternoon.jpg
 * - "BMW Museum und BMW AG Vierzylindergebäude.jpg", Herokk,
 *   CC BY-SA 4.0 (dusk, from the north-west)
 *   https://commons.wikimedia.org/wiki/File:BMW_Museum_und_BMW_AG_Vierzylinderge%C3%A4ude.jpg
 * - "BMW tower seen from the West in Munich.jpg", Alex Sirac, CC BY 4.0
 *   https://commons.wikimedia.org/wiki/File:BMW_tower_seen_from_the_West_in_Munich.jpg
 *
 * Left out: the roundels' "BMW" lettering (too small at map scale), roof
 * plant.
 * Doubts: roof height (89 vs 91 m); the roundels are drawn on all four
 * faces, photos show the south and west ones.
 *
 * Night: the facade panels are `window` and glow; the roundels are
 * `neon-bmw-*`, lit in their own colours as the real ones are.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { TAU, add, box, face, flat, lathe, mul, tube, unit } from './munich-olympiaturm'

const silver = new Part()
const win = new Part()
const blue = new Part()
const dark = new Part()
const neonBlue = new Part()
const neonWhite = new Part()

const C: V3 = [0, -0.3, 0] // the building's centre in the model frame
const D = 11.4, R = 10.8, PINCH = 8.2
const lobes: V3[] = [[D, D, 0], [-D, D, 0], [-D, -D, 0], [D, -D, 0]].map((p) => add(C, p as V3))
const K = 24

/** Is the point (x, y) inside a lobe other than `self`, by more than `m`? */
const insideOther = (x: number, y: number, self: number, r: number, m = 0.15) =>
  lobes.some((c, i) => i !== self && Math.hypot(x - c[0], y - c[1]) < r - m)

/**
 * One lobe as a surface of revolution about its own axis, dropping the
 * facets buried in a neighbour (tested at each band's own radius).
 */
function lobe(i: number, profile: [number, number][], pick: (b: number) => Part) {
  const c = lobes[i]
  for (let b = 0; b < profile.length - 1; b++) {
    const [r0, z0] = profile[b], [r1, z1] = profile[b + 1]
    const er = r1 - r0, ez = z1 - z0, l = Math.hypot(er, ez) || 1
    const n2 = [ez / l, -er / l]
    const rTest = Math.max(r0, r1)
    for (let s = 0; s < K; s++) {
      const a0 = (s / K) * TAU, a1 = ((s + 1) / K) * TAU, am = (a0 + a1) / 2
      if (rTest > 1 && insideOther(c[0] + rTest * Math.cos(am) * 0.98, c[1] + rTest * Math.sin(am) * 0.98, i, rTest)) continue
      const P = (r: number, a: number, z: number): V3 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z]
      const N = (a: number): V3 => unit([n2[0] * Math.cos(a), n2[0] * Math.sin(a), n2[1]])
      const q = [P(r0, a0, z0), P(r0, a1, z0), P(r1, a1, z1), P(r1, a0, z1)]
      if (r1 === 0) pick(b).tri(q[0], q[1], q[2], undefined, undefined, undefined, [N(a0), N(a1), N(a1)])
      else face(pick(b), q, [N(a0), N(a1), N(a1), N(a0)])
    }
  }
}

const Z_BOT = 11.0, Z_BAND0 = 54.6, Z_BAND1 = 61.6, Z_TOP = 91.0
for (let i = 0; i < 4; i++) {
  // underside and lower wall
  lobe(i, [[0, Z_BOT], [R - 0.6, Z_BOT], [R, Z_BOT + 0.6], [R, Z_BAND0], [R - 0.35, Z_BAND0 + 0.3]], () => silver)
  // the blue technical band: a chamfer in, the recessed storey, a flare out
  lobe(i, [[R - 0.35, Z_BAND0 + 0.3], [PINCH, 56.0], [PINCH, 60.0], [R - 0.35, Z_BAND1 - 0.3]], () => blue)
  // upper wall and the roof
  lobe(i, [[R - 0.35, Z_BAND1 - 0.3], [R, Z_BAND1], [R, Z_TOP], [R - 0.35, Z_TOP + 0.35], [R - 0.6, Z_TOP + 0.35]], () => silver)
  lobe(i, [[R - 0.6, Z_TOP + 0.35], [0, Z_TOP + 0.35]], () => dark)
}
// The slots between the lobes: a deep, dark recessed cross joining them
// (the shadowed glazed joints), blue through the technical storey.
for (const [hx, hy] of [[2.0, 13.5], [13.5, 2.0]]) {
  box(dark, C, [1, 0, 0], [0, 1, 0], hx, hy, Z_BOT, Z_BAND0)
  box(blue, C, [1, 0, 0], [0, 1, 0], hx - 0.3, hy - 0.3, Z_BAND0, Z_BAND1)
  box(dark, C, [1, 0, 0], [0, 1, 0], hx, hy, Z_BAND1, Z_TOP + 0.3)
}

// The facade: wide horizontal window bands, each about two storeys, round
// the bright aluminium cylinders, with broad aluminium spandrels between
// them (six bands below the technical storey, four above), and only a few
// thin vertical fins (every fourth bay, about 11 m apart).
{
  const groups: [number, number][] = []
  const lo = (Z_BAND0 - 0.4) - (Z_BOT + 0.6), up = (Z_TOP - 0.4) - Z_BAND1
  for (let g = 0; g < 6; g++) { const p = lo / 6, z = Z_BOT + 0.6 + g * p; groups.push([z + 2.0, z + p - 1.7]) }
  for (let g = 0; g < 4; g++) { const p = up / 4, z = Z_BAND1 + g * p; groups.push([z + 2.0, z + p - 1.7]) }
  const rr = R + 0.05
  for (let i = 0; i < 4; i++) {
    const c = lobes[i]
    const P = (t: number, z: number, r = rr): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
    const N = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
    for (let s = 0; s < K; s++) {
      const t0 = (s / K) * TAU, t1 = ((s + 1) / K) * TAU, am = (t0 + t1) / 2
      if (insideOther(c[0] + (R + 0.6) * Math.cos(am), c[1] + (R + 0.6) * Math.sin(am), i, R, -0.6)) continue
      for (const [z0, z1] of groups) face(win, [P(t0, z0), P(t1, z0), P(t1, z1), P(t0, z1)], [N(t0), N(t1), N(t1), N(t0)])
      if (s % 4 === 0) {
        // a thin fin across the bands at this bay's edge
        const w = 0.14 / R, n = N(t0)
        for (const [z0, z1] of groups) {
          const q = [P(t0 - w, z0 - 0.05, R + 0.12), P(t0 + w, z0 - 0.05, R + 0.12), P(t0 + w, z1 + 0.05, R + 0.12), P(t0 - w, z1 + 0.05, R + 0.12)]
          flat(silver, q, n)
        }
      }
    }
  }
}

// The core: four tubes at the diagonals from the podium to 101 m, a blue
// square between them at the top, silver between the podium and the lobes.
const TUBE_D = 5.65, TUBE_R = 4.45
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const c = add(C, [sx * TUBE_D, sy * TUBE_D, 0])
  lathe([[TUBE_R, 8.0], [TUBE_R, Z_BOT]], () => silver, 16, 40, c)
  lathe([[TUBE_R, Z_TOP + 0.35], [TUBE_R, 100.6], [TUBE_R - 0.4, 101.0], [0, 101.0]], (b) => (b < 2 ? silver : dark), 16, 40, c)
}
box(silver, C, [1, 0, 0], [0, 1, 0], 7.0, 7.0, 8.0, Z_BOT)
box(blue, C, [1, 0, 0], [0, 1, 0], 8.9, 8.9, Z_TOP + 0.35, 99.6)

// Cantilever arms: from each tube out to a hanger over its lobe's centre,
// an upper level strut and a lower raking strut, as a lying "Y".
for (let i = 0; i < 4; i++) {
  const dir = unit([lobes[i][0] - C[0], lobes[i][1] - C[1], 0])
  const hub = add(C, mul(dir, Math.SQRT2 * TUBE_D))
  const hang = add(C, mul(dir, Math.SQRT2 * D))
  // hanger: a short cylinder with a cone below, standing on the roof
  lathe([[0, 92.4], [1.0, 93.4], [1.9, 94.4], [1.9, 98.3], [1.6, 98.6], [0, 98.6]], () => silver, 12, 40, hang)
  const up0 = add(hub, mul(dir, TUBE_R - 0.4)), lo0 = add(hub, mul(dir, TUBE_R - 0.4))
  tube(silver, add(up0, [0, 0, 97.6]), add(hang, add(mul(dir, -1.4), [0, 0, 97.4])), 0.75, 0.65, 6)
  tube(silver, add(lo0, [0, 0, 92.0]), add(hang, add(mul(dir, -1.5), [0, 0, 95.0])), 0.7, 0.6, 6)
}

// Roundels on the four faces, in front of the tubes: a dark ring and the
// blue-and-white quarters (blue top-left and bottom-right, as on the badge).
function roundel(n: V3, e: V3, d: number, zc: number) {
  const c = add(add(C, mul(n, d)), [0, 0, zc])
  const at = (r: number, a: number, off: number): V3 => add(add(c, mul(n, off)), add(mul(e, r * Math.cos(a)), [0, 0, r * Math.sin(a)]))
  const M = 32, R0 = 3.8, R1 = 2.75
  // a thin back disc so the badge has depth
  for (let k = 0; k < M; k++) {
    const a = (k / M) * TAU, b = ((k + 1) / M) * TAU
    flat(dark, [at(R1, a, 0.3), at(R0, a, 0.3), at(R0, b, 0.3), at(R1, b, 0.3)], n)
    flat(dark, [at(R0, a, 0.3), at(R0, a, 0), at(R0, b, 0), at(R0, b, 0.3)], unit(add(mul(e, Math.cos(a)), [0, 0, Math.sin(a)])))
    // quarters: angle measured from e toward up; blue where cos*sin < 0
    const am = (a + b) / 2
    const q = Math.cos(am) * Math.sin(am) > 0 ? neonWhite : neonBlue
    const ctr = add(c, mul(n, 0.32))
    const p1 = at(R1, a, 0.32), p2 = at(R1, b, 0.32)
    q.tri(ctr, p1, p2, undefined, undefined, undefined, [n, n, n])
  }
}
for (const [n, e] of [[[0, -1, 0], [1, 0, 0]], [[0, 1, 0], [-1, 0, 0]], [[1, 0, 0], [0, 1, 0]], [[-1, 0, 0], [0, -1, 0]]] as [V3, V3][]) {
  roundel(n, e, 10.25, 95.2)
}

// The podium (way/310279165): glazed ground floor, silver fascia, flat roof.
{
  const x0 = -23.0, x1 = 22.5, y0 = -23.0, y1 = 16.9
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = (x1 - x0) / 2, hy = (y1 - y0) / 2
  box(win, [cx, cy, 0], [1, 0, 0], [0, 1, 0], hx - 0.8, hy - 0.8, 0, 4.6)
  box(silver, [cx, cy, 0], [1, 0, 0], [0, 1, 0], hx, hy, 4.6, 7.6)
  box(dark, [cx, cy, 0], [1, 0, 0], [0, 1, 0], hx - 0.4, hy - 0.4, 7.6, 8.0)
}

const parts = [
  { part: silver, material: finish('bmw-aluminium', 0xeceae5) },
  { part: win, material: { ...PALETTE.window, color: 0x8a97a1 } },
  { part: blue, material: finish('bmw-blue', 0x3f72b3) },
  { part: dark, material: finish('bmw-charcoal', 0x50565e) },
  { part: neonBlue, material: finish('neon-bmw-blue', 0x2f86d1) },
  { part: neonWhite, material: finish('neon-bmw-white', 0xf4f6f8) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('BMW-Vierzylinder', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 101, osm: 'way/146381661',
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/munich-bmw-vierzylinder.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
