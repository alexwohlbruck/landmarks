/**
 * Hollywood Bowl: the band shell (2004, Hodgetts + Fung) and its stage
 * buildings, Los Angeles — original procedural geometry, CC0-1.0.
 * bun generators/la-hollywood-bowl.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the centroid of OSM
 * way/427527131 (the shell and stage building), on the lowest ground under
 * it (168.8 m, in front of the stage). Placed at bearing 24.5°, so +y runs
 * back through the shell (north-north-east) and the shell opens to −y,
 * towards the seats. The ground is flat to within a metre and a half.
 *
 * What makes it the Bowl: the white shell, a semicircular arch of
 * concentric rings stepping smaller towards the back, with three white
 * pylons standing on its face (one at each shoulder, one on the crown),
 * between two plain white wings carrying the video screens. The seating
 * bowl is ground and isn't modelled.
 *
 * Sources:
 * - Plan: OSM way/427527131 (building, LARIAC 2020 footprint
 *   459084863554, 24.2 m): the shell, the wings and the stage house in one
 *   outline, 65 × 28 m; the three notches on its front are the pylons
 *   (2.8–3.1 m wide, 11.8 m apart), so the shell's axis is 4.4 m east of
 *   the centroid. OSM way/133701914 is the whole amphitheatre
 *   (amenity=theatre, the seats included), not a building, so it isn't
 *   replaced. The building:parts 297126803–297126808 inside the outline
 *   (bits of the shell and stage roofs, 4–10 m) are covered by the model and
 *   replaced with it.
 * - Heights: LA County 2006 lidar surface model (layer 8, 2 m grid in this
 *   frame) over USGS 3DEP bare earth 168.8–170.3 m: shell crown 189 m at the
 *   front (20 m), falling to 183 m at the back (14.5 m); pylon tops 193 m
 *   (24 m); the wings 4–11 m, the stage house behind the shell 9 m.
 * - Proportions: photos (Wikimedia Commons), all from the seats, south-west
 *   of the shell — "Hollywood Bowl - panoramio (1)" (Grant Berg, CC BY-SA
 *   3.0; square on, used for the ring and pylon proportions: outer arch a
 *   semicircle, opening 0.79 of it, pylons 3.5 m wide), "Hollywood bowl and
 *   sign" (Matthew Field, CC BY-SA 2.5), "Hollywood Bowl 2016" (CC BY 2.0),
 *   "Hollywood Bowl 2024" (Edwardrhodes06, CC BY-SA 4.0); "HOLLYWOOD BOWL
 *   OVERLOOK" (Jerrye and Roy Klotz, CC BY-SA 3.0; from above, the back).
 * - Estimated: six rings (the lidar gives the taper, not the count), the
 *   ring depths, the screens' size; the stage's dark back wall.
 * - Left out: the lighting truss and rigging in the shell, the speaker
 *   stacks, the green sound towers out in the seats, the stage platform.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

const shell = new Part(), wall = new Part(), roof = new Part(), screen = new Part()

const BEARING = 24.5
const AX = 4.4 // the shell's axis
const PROUD = 0.05
const SEG = 16 // per semicircle

/** An axis-aligned block from z0 to z1, with a bevelled top lip. */
function box(part: Part, u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, top = roof, lip = 0.4) {
  const r: [number, number][] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const ri: [number, number][] = [[u0 + lip, v0 + lip], [u1 - lip, v0 + lip], [u1 - lip, v1 - lip], [u0 + lip, v1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ai = ri[i], bi = ri[(i + 1) % 4]
    part.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip])
    part.quad([a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], [bi[0], bi[1], z1], [ai[0], ai[1], z1])
  }
  top.quad([ri[0][0], ri[0][1], z1], [ri[1][0], ri[1][1], z1], [ri[2][0], ri[2][1], z1], [ri[3][0], ri[3][1], z1])
}

/** A point on the arch of radius r at angle a (0 = east foot, π = west foot), at depth v. */
const arc = (r: number, a: number, v: number): V3 => [AX + r * Math.cos(a), v, r * Math.sin(a)]

/**
 * One ring of the shell: a half-annulus between radii ri and ro, from depth
 * v0 (front) to v1, smooth-shaded on its curved faces.
 */
function ringArch(ri: number, ro: number, v0: number, v1: number) {
  for (let i = 0; i < SEG; i++) {
    const a0 = (i / SEG) * Math.PI, a1 = ((i + 1) / SEG) * Math.PI
    const n = (a: number, s: number): V3 => [s * Math.cos(a), 0, s * Math.sin(a)]
    // outer surface, facing out
    shell.tri(arc(ro, a0, v0), arc(ro, a0, v1), arc(ro, a1, v1), undefined, undefined, undefined, [n(a0, 1), n(a0, 1), n(a1, 1)])
    shell.tri(arc(ro, a0, v0), arc(ro, a1, v1), arc(ro, a1, v0), undefined, undefined, undefined, [n(a0, 1), n(a1, 1), n(a1, 1)])
    // inner surface (the ceiling), facing the axis
    shell.tri(arc(ri, a0, v0), arc(ri, a1, v1), arc(ri, a0, v1), undefined, undefined, undefined, [n(a0, -1), n(a1, -1), n(a0, -1)])
    shell.tri(arc(ri, a0, v0), arc(ri, a1, v0), arc(ri, a1, v1), undefined, undefined, undefined, [n(a0, -1), n(a1, -1), n(a1, -1)])
    // front face (towards −v) and back face
    shell.quad(arc(ri, a0, v0), arc(ro, a0, v0), arc(ro, a1, v0), arc(ri, a1, v0))
    shell.quad(arc(ri, a1, v1), arc(ro, a1, v1), arc(ro, a0, v1), arc(ri, a0, v1))
  }
}

// ---------- the shell: six rings, stepping in towards the back ----------
const FRONT = -12, BACK = 10, N = 6
const RO = [20, 18.9, 17.8, 16.7, 15.6, 14.5] // lidar crown 20 m at the front, 14.5 m at the back
const RI = [15.8, 14.9, 14.0, 13.1, 12.2, 11.3] // the opening is 0.79 of the arch (photo)
for (let k = 0; k < N; k++) {
  const v0 = FRONT + ((BACK - FRONT) * k) / N, v1 = FRONT + ((BACK - FRONT) * (k + 1)) / N
  ringArch(RI[k], RO[k], v0, v1)
}
// the dark back of the stage, closing the last ring
for (let i = 0; i < SEG; i++) {
  const a0 = (i / SEG) * Math.PI, a1 = ((i + 1) / SEG) * Math.PI
  screen.tri([AX, BACK - PROUD, 0], arc(RI[N - 1], a0, BACK - PROUD), arc(RI[N - 1], a1, BACK - PROUD))
}

// ---------- the three pylons on the shell's face ----------
for (const du of [-11.85, 0, 11.85]) {
  const u = AX + du
  const z0 = du === 0 ? RO[0] - 2.5 : 0
  box(shell, u - 1.5, u + 1.5, -14.5, FRONT + 0.5, z0, 20.6, shell, 0.3)
  box(shell, u - 1.8, u + 1.8, -14.8, FRONT + 0.8, 20.6, 24.0, shell, 0.4)
}

// ---------- the wings either side, with their screens; the stage house ----------
const SL = AX - 20 - 0.2, SR = AX + 20 + 0.2
box(wall, -30.9, SL, -13.6, -6, 0, 11)
box(wall, -30.9, SL, -6, 11.7, 0, 7)
box(wall, SR, 33.8, -13.5, -6, 0, 11)
box(wall, SR, 33.8, -6, 10.5, 0, 6)
box(wall, SL, SR, BACK, 13.4, 0, 9)
for (const c of [(-30.9 + SL) / 2, (SR + 33.8) / 2]) {
  const v = -13.6 - PROUD
  screen.quad([c - 3.4, v, 4.2], [c + 3.4, v, 4.2], [c + 3.4, v, 9.7], [c - 3.4, v, 9.7])
}

// ---------- write ----------
const parts = [
  { part: shell, material: PALETTE.trim },
  { part: wall, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
  { part: screen, material: finish('bowl-screen', 0x5d6266) },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Hollywood Bowl', parts, {
  license: 'CC0-1.0', bearing: BEARING, elevation: 0, height: 24.0,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/427527131', 'way/297126803', 'way/297126804', 'way/297126805', 'way/297126806', 'way/297126807', 'way/297126808'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-hollywood-bowl.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
