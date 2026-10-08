/**
 * Westin Bonaventure Hotel (1976, John Portman), Los Angeles — original
 * procedural geometry, CC0-1.0.
 * bun generators/la-bonaventure.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the outline's centroid
 * on the lowest ground under it. Placed at bearing 38°, so the square
 * podium is square to this frame: +x faces Flower St, −x Figueroa St, +y
 * 4th St, −y 5th St.
 *
 * What makes it the Bonaventure: five mirrored-glass cylinders — four
 * around a taller central one — joined by slim concrete stair and service
 * cores that rise past the glass, all on a blank concrete podium filling
 * the block.
 *
 * Sources:
 * - Plan: OSM way/33528271 (the podium, ≈ 90 × 90 m), its parts
 *   way/328826533 (the five cylinders and their cores: outer radius 13.5 m
 *   centred ±26 m on the diagonals, central radius 17.5 m) and
 *   way/328826159 (the helipad on the central cylinder).
 * - Heights: LA County LARIAC 2006 lidar surface model (Elevation MapServer
 *   layer 8, 2 m grid in this frame), over the lowest ground 88.6 m:
 *   podium 26 m, outer cylinders' roofs 97–98 m, their cores 100–102 m,
 *   central cylinder 117 m with its cores at 120 m. LARIAC 2020 footprint
 *   484237841691: 117.4 m; published 112 m / 35 floors (Wikipedia), which is
 *   over 5th St, a few metres above this origin.
 * - Look: photos (Wikimedia Commons) — "Westin Bonaventure towers.gk"
 *   (Grendelkhan, CC BY-SA 3.0), "Westin Bonaventure Hotel" (Geographer, CC
 *   BY 2.5), "Westin Bonaventure Hotel (6801556011)" (Prayitno, CC BY 2.0),
 *   "The Westin (51097134112)" (Chris Yarzab, CC BY 2.0, the podium),
 *   "Bonaventure Hotel" (Calliopejen1, CC BY-SA 3.0, from above),
 *   "Los Angeles (California, USA), Westin Bonaventure Hotel -- 2012 --
 *   5255" (Dietmar Rabich, CC BY-SA 4.0).
 * - Glass colour: the mirrored glass reads bronze to dark mirror in most
 *   photos; drawn as a bronze-grey pulled to the palette's lightness
 *   (windowVariant). Its grid is drawn as pale trim lines: a floor line every
 *   three floors and a mullion every 22.5°. The external lifts are left out.
 * - Estimated: the cores' size (4.5 m square) and exact places at the
 *   junctions, from the OSM outline's notches and the photos.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish, windowVariant } from './palette'

type XY = [number, number]

const conc = new Part(), glass = new Part(), roof = new Part(), trim = new Part()

const BEARING = 38

function box(u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, wall = conc, top = roof, lip = 0.5) {
  const r: XY[] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const ri: XY[] = [[u0 + lip, v0 + lip], [u1 - lip, v0 + lip], [u1 - lip, v1 - lip], [u0 + lip, v1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ai = ri[i], bi = ri[(i + 1) % 4]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip])
    wall.quad([a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], [bi[0], bi[1], z1], [ai[0], ai[1], z1])
  }
  top.quad([ri[0][0], ri[0][1], z1], [ri[1][0], ri[1][1], z1], [ri[2][0], ri[2][1], z1], [ri[3][0], ri[3][1], z1])
}

/**
 * A mirrored-glass cylinder: smooth glass with a few pale trim lines over it,
 * as a curtain wall is drawn here — a floor line every three floors (9.3 m)
 * and a mullion every 22.5° — a pale rim band, and a flat roof.
 */
function cylinder(c: XY, r: number, z0: number, z1: number, N = 32) {
  const ang = (i: number) => (i / N) * 2 * Math.PI
  const P = (i: number, z: number, rr = r): V3 => [c[0] + rr * Math.cos(ang(i)), c[1] + rr * Math.sin(ang(i)), z]
  const nrm = (i: number): V3 => [Math.cos(ang(i)), Math.sin(ang(i)), 0]
  const rim = z1 - 1.6, out = r + 0.06
  for (let i = 0; i < N; i++) {
    const j = i + 1
    glass.tri(P(i, z0), P(j, z0), P(j, rim), undefined, undefined, undefined, [nrm(i), nrm(j), nrm(j)])
    glass.tri(P(i, z0), P(j, rim), P(i, rim), undefined, undefined, undefined, [nrm(i), nrm(j), nrm(i)])
    trim.tri(P(i, rim), P(j, rim), P(j, z1), undefined, undefined, undefined, [nrm(i), nrm(j), nrm(j)])
    trim.tri(P(i, rim), P(j, z1), P(i, z1), undefined, undefined, undefined, [nrm(i), nrm(j), nrm(i)])
    roof.tri(P(i, z1), P(j, z1), [c[0], c[1], z1])
    // floor lines
    for (let z = z0 + 9.3; z < rim - 3; z += 9.3) {
      trim.tri(P(i, z - 0.35, out), P(j, z - 0.35, out), P(j, z + 0.35, out), undefined, undefined, undefined, [nrm(i), nrm(j), nrm(j)])
      trim.tri(P(i, z - 0.35, out), P(j, z + 0.35, out), P(i, z + 0.35, out), undefined, undefined, undefined, [nrm(i), nrm(j), nrm(i)])
    }
    // mullions on every other facet edge
    if (i % 2 === 0) {
      const w = 0.4 / r // half-width as an angle
      const Q = (da: number, z: number): V3 => [c[0] + out * Math.cos(ang(i) + da), c[1] + out * Math.sin(ang(i) + da), z]
      trim.quad(Q(-w, z0), Q(w, z0), Q(w, rim), Q(-w, rim))
    }
  }
}

// the podium, filling the block
box(-45, 45, -45, 45, 0, 26, conc, conc)

// the five towers
const OUT = 26, R_OUT = 13.5, R_MID = 17.5
for (const [su, sv] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) cylinder([su * OUT, sv * OUT], R_OUT, 26, 97.5)
cylinder([0, 0], R_MID, 26, 117)

// the concrete cores where the outer towers meet the central one: one each
// side of every junction, rising past the glass
for (const [su, sv] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  for (const [a, b] of [[17.5, 11.5], [11.5, 17.5]]) {
    const cu = su * a, cv = sv * b
    box(cu - 2.25, cu + 2.25, cv - 2.25, cv + 2.25, 26, 101, conc, conc, 0.6)
  }
  // and the central tower's own cores, taller, where its glass meets them
  const cu = su * 12.6, cv = sv * 12.6
  box(cu - 2.25, cu + 2.25, cv - 2.25, cv + 2.25, 26, 120, conc, conc, 0.6)
}

// the helipad ring on the central roof
{
  const N = 16, r0 = 7.4, r1 = 6.4, z = 117.15
  for (let i = 0; i < N; i++) {
    const a = (i / N) * 2 * Math.PI, b = ((i + 1) / N) * 2 * Math.PI
    trim.quad([r0 * Math.cos(a), r0 * Math.sin(a), z], [r0 * Math.cos(b), r0 * Math.sin(b), z], [r1 * Math.cos(b), r1 * Math.sin(b), z], [r1 * Math.cos(a), r1 * Math.sin(a), z])
  }
}

// ---------- write ----------
const parts = [
  { part: conc, material: finish('bonaventure-concrete', 0xe3dccd) },
  { part: glass, material: windowVariant(2, 0x9a9488) },
  { part: roof, material: PALETTE.roof },
  { part: trim, material: PALETTE.trim },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Westin Bonaventure Hotel', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 120,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/33528271', 'way/328826533', 'way/328826159'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-bonaventure.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
