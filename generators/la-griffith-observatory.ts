/**
 * Griffith Observatory (1935, John C. Austin and Frederick M. Ashley; 2006
 * renovation), Griffith Park, Los Angeles — original procedural geometry,
 * CC0-1.0.
 * bun generators/la-griffith-observatory.ts [out.glb]
 *
 * Map frame: x east, y north, z up, metres; origin at the OSM outline's
 * centroid, on the lowest ground under it (335.3 m, at the foot of the
 * planetarium drum on the south). Bearing 0: the building is square to the
 * compass. The entrance front faces north, onto the lawn and the
 * Astronomers Monument; the planetarium drum faces the city to the south.
 * The north lawn stands 11.8 m above y = 0, so the north half of the model
 * sinks into the hill (STYLE.md, Ground).
 *
 * What makes it the observatory: a white Art Deco block with three dark
 * bronze domes in a row seen from the lawn — the big planetarium dome in
 * the middle, the two telescope domes (each with its shutter slit) on round
 * towers at the ends of the front — and the green copper octagonal lantern
 * over the rotunda behind the GRIFFITH OBSERVATORY entrance block. From the
 * south and from the city: the tall white planetarium drum with its ring of
 * pilasters.
 *
 * Sources:
 * - Plan: OSM way/422130705 (the only building; no parts). From it: the
 *   symmetry axis x = −2.05 (entrance projection −12.2…8.5 and the two
 *   tower ends −38.0 / 33.5); the planetarium drum is the outline's
 *   south apse, a circle centred (−1.9, −15.9), radius 15.3; the telescope
 *   towers are the round ends, radius 5 centred 13 m north. The plan is not
 *   symmetric behind the front: the west wing is only 13 m deep (a terrace
 *   behind it), the east wing runs back 27 m.
 * - Heights: LA County 2006 lidar surface model (Elevation MapServer layer
 *   8, 2 m grid), over USGS 3DEP bare earth (low point 335.3 m on the
 *   footprint; north lawn 347.1 m): main roof 354.3 m (19.0), planetarium
 *   dome apex 370.1 m (34.8; LARIAC 2020 footprint 470757865499 gives the
 *   same top, 35.9 m over its own lower ground), telescope domes 363.5 and
 *   362.9 m (28.0), the lantern 361.1 m (25.8), the drum 357 m at r = 14 and
 *   350 m at r = 16 (the lower ring).
 * - Proportions and colours: photos (Wikimedia Commons) — "Griffith
 *   observatory 2006" (Matthew Field, CC BY 2.5; north front from above,
 *   square on: dome widths 24.4 m and 10.2 m against the 71.5 m front),
 *   "Griffith Observatory, Los Angeles2" (dconvertini, CC BY-SA 2.0; north
 *   front), "Griffith Observatory 2011" (Joe Mabel, CC BY-SA 3.0; the
 *   entrance), Carol M. Highsmith's aerials LCCN2013633239 (from the
 *   south-south-west) and LC-DIG-highsm-22255 (from the north-west), both
 *   public domain; "Griffith Observatory 2012 01" (Mike Peel, CC BY-SA 4.0).
 *   Dome colour sampled from the sunlit domes (#886752 … #8a7d6f) and the
 *   aerials (#7d8084): a bronze grey between the two.
 * - Estimated: the lettering block's and lantern's heights (from the 2006
 *   front photo, scaled by the lidar wing height); the window sizes and
 *   the drum's window rows; 20 pilasters round the drum (counted on the
 *   visible half); the step between the lower and upper drum.
 * - Left out: the Astronomers Monument, the Greek-key bands, the stairs to
 *   the roof terraces, the underground 2006 wing and its café terrace, the
 *   dome ribs.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'

type XY = [number, number]

// walls in a near-white finish: the building reads bright white in every photo,
// whiter than trim's warm cream
const wall = new Part(), roof = new Part(), win = new Part(), dome = new Part(), lantern = new Part()

const AX = -2.05 // symmetry axis of the front
const PROUD = 0.05
const LAWN = 11.8 // north lawn over y = 0
const ROOF = 19.0

type Box = [number, number, number, number, number, number]
const solids: Box[] = []

/** An axis-aligned block from the ground, with a bevelled top lip. */
function box(u0: number, u1: number, v0: number, v1: number, z0: number, z1: number, lip = 0.4) {
  solids.push([u0, u1, v0, v1, z0, z1])
  const r: XY[] = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
  const ri: XY[] = [[u0 + lip, v0 + lip], [u1 - lip, v0 + lip], [u1 - lip, v1 - lip], [u0 + lip, v1 - lip]]
  for (let i = 0; i < 4; i++) {
    const a = r[i], b = r[(i + 1) % 4], ai = ri[i], bi = ri[(i + 1) % 4]
    wall.quad([a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1 - lip], [a[0], a[1], z1 - lip])
    wall.quad([a[0], a[1], z1 - lip], [b[0], b[1], z1 - lip], [bi[0], bi[1], z1], [ai[0], ai[1], z1])
  }
  roof.quad([ri[0][0], ri[0][1], z1], [ri[1][0], ri[1][1], z1], [ri[2][0], ri[2][1], z1], [ri[3][0], ri[3][1], z1])
}
const inside = (x: number, y: number, z: number) =>
  solids.some(([u0, u1, v0, v1, z0, z1]) => x > u0 + 0.2 && x < u1 - 0.2 && y > v0 + 0.2 && y < v1 - 0.2 && z > z0 && z < z1)

/**
 * A surface of revolution about (c, z): `prof` is [r, z, nr, nz] from the
 * bottom up, with the profile normal per point, so it shades smooth.
 */
function lathe(part: Part, c: XY, prof: number[][], segs: number, a0 = 0, flat = false) {
  const at = (p: number[], t: number): V3 => [c[0] + p[0] * Math.cos(t), c[1] + p[0] * Math.sin(t), p[1]]
  const nm = (p: number[], t: number): V3 => [p[2] * Math.cos(t), p[2] * Math.sin(t), p[3]]
  for (let i = 0; i < segs; i++) {
    const t0 = a0 + (i / segs) * 2 * Math.PI, t1 = a0 + ((i + 1) / segs) * 2 * Math.PI
    for (let k = 0; k < prof.length - 1; k++) {
      const p = prof[k], q = prof[k + 1]
      const A = at(p, t0), B = at(p, t1), C = at(q, t1), D = at(q, t0)
      const nA = nm(p, t0), nB = nm(p, t1), nC = nm(q, t1), nD = nm(q, t0)
      if (Math.abs(p[0] - q[0]) < 1e-6 && Math.abs(p[1] - q[1]) < 1e-6) continue
      if (flat) {
        if (q[0] < 1e-6) part.tri(A, B, C)
        else part.quad(A, B, C, D)
      } else if (q[0] < 1e-6) part.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
      else {
        part.tri(A, B, C, undefined, undefined, undefined, [nA, nB, nC])
        part.tri(A, C, D, undefined, undefined, undefined, [nA, nC, nD])
      }
    }
  }
}
/** A plain vertical cylinder with a flat top. */
function cylinder(part: Part, top: Part, c: XY, r: number, z0: number, z1: number, segs: number) {
  lathe(part, c, [[r, z0, 1, 0], [r, z1, 1, 0]], segs)
  const ring: V3[] = []
  for (let i = 0; i < segs; i++) { const t = (i / segs) * 2 * Math.PI; ring.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z1]) }
  top.cap(ring, true)
}
/** A ring of flat-topped ledge between radii r0 < r1 at height z. */
function annulus(part: Part, c: XY, r0: number, r1: number, z: number, segs: number) {
  for (let i = 0; i < segs; i++) {
    const t0 = (i / segs) * 2 * Math.PI, t1 = ((i + 1) / segs) * 2 * Math.PI
    const p = (r: number, t: number): V3 => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]
    part.quad(p(r0, t0), p(r1, t0), p(r1, t1), p(r0, t1))
  }
}
/** A dome: a skirt of height `skirt`, then a half-ellipsoid `h` tall. */
function domeShape(part: Part, c: XY, r: number, z0: number, skirt: number, h: number, segs: number, rings: number) {
  const prof: number[][] = [[r, z0, 1, 0], [r, z0 + skirt, 1, 0]]
  for (let k = 1; k <= rings; k++) {
    const a = (k / rings) * Math.PI / 2
    const nr = Math.cos(a) / r, nz = Math.sin(a) / h, l = Math.hypot(nr, nz)
    prof.push([r * Math.cos(a), z0 + skirt + h * Math.sin(a), nr / l, nz / l])
  }
  lathe(part, c, prof, segs)
}
/** A radial box standing on a circle: a pilaster or a buttress. */
function radialBox(part: Part, c: XY, t: number, hw: number, r0: number, r1: number, z0: number, z1: number) {
  const u: XY = [Math.cos(t), Math.sin(t)], v: XY = [-Math.sin(t), Math.cos(t)]
  const P = (r: number, s: number, z: number): V3 => [c[0] + u[0] * r + v[0] * s, c[1] + u[1] * r + v[1] * s, z]
  const ring = (z: number) => [P(r0, -hw, z), P(r1, -hw, z), P(r1, hw, z), P(r0, hw, z)]
  part.loft([ring(z0), ring(z1)])
  part.cap(ring(z1), true)
}
/** A window panel tangent to a circle at angle t, just proud of radius r. */
function arcPanel(part: Part, c: XY, t: number, r: number, w: number, z0: number, z1: number) {
  const u: XY = [Math.cos(t), Math.sin(t)], v: XY = [-Math.sin(t), Math.cos(t)]
  const R = r + PROUD
  const P = (s: number, z: number): V3 => [c[0] + u[0] * R + v[0] * s, c[1] + u[1] * R + v[1] * s, z]
  part.quad(P(-w / 2, z0), P(w / 2, z0), P(w / 2, z1), P(-w / 2, z1))
}
/** Window panels across a flat face. face: 'n' | 's' | 'e' | 'w' at coordinate c. */
function bays(face: 'n' | 's' | 'e' | 'w', c: number, s0: number, s1: number, n: number, w: number, z0: number, z1: number, part = win) {
  const step = (s1 - s0) / n
  for (let i = 0; i < n; i++) {
    const m = s0 + (i + 0.5) * step, a = m - w / 2, b = m + w / 2
    if (face === 'n') part.quad([b, c + PROUD, z0], [a, c + PROUD, z0], [a, c + PROUD, z1], [b, c + PROUD, z1])
    if (face === 's') part.quad([a, c - PROUD, z0], [b, c - PROUD, z0], [b, c - PROUD, z1], [a, c - PROUD, z1])
    if (face === 'e') part.quad([c + PROUD, a, z0], [c + PROUD, b, z0], [c + PROUD, b, z1], [c + PROUD, a, z1])
    if (face === 'w') part.quad([c - PROUD, b, z0], [c - PROUD, a, z0], [c - PROUD, a, z1], [c - PROUD, b, z1])
  }
}

// ---------- the main block ----------
const FRONT = 19.2
box(-33, -17.9, 6.5, FRONT, 0, ROOF) // west wing, shallow, terrace behind it
box(-17.9, 27.9, -7.6, FRONT, 0, ROOF) // centre and the deep east wing
box(-19.8, -14, -17.3, -7.2, 0, 16.5) // the low blocks either side of the drum
box(10, 15.9, -17.3, -7.4, 0, 16.5)
// the entrance: two stepped pylons, the lettering block between and above
// them, and the rotunda behind it carrying the lantern
box(AX - 10.15, AX - 4.55, 16, 22.2, 0, 20.0)
box(AX + 4.55, AX + 10.15, 16, 22.2, 0, 20.0)
box(AX - 6.75, AX + 6.75, 6, 20.2, 0, 21.2)

// the north front: five tall bronze-grilled windows a wing, and the bronze
// doors, dark like the windows (so a window panel, lit at night too)
bays('n', FRONT, AX - 25.95, AX - 10.15, 5, 1.9, LAWN + 1.2, LAWN + 5.6)
bays('n', FRONT, AX + 10.15, AX + 25.95, 5, 1.9, LAWN + 1.2, LAWN + 5.6)
bays('n', 20.2, AX - 1.8, AX + 1.8, 1, 3.6, LAWN + 0.6, LAWN + 6.8)
// the west wing's back, over its terrace (12.7 m)
bays('s', 6.5, -28, -18.5, 4, 1.7, 14.0, 17.6)
// the east wing's south face, over the terrace east of the drum (10 m)
bays('s', -7.6, 16.4, 27.4, 3, 1.7, 12.4, 16.6)

// ---------- the telescope towers ----------
for (const sx of [-1, 1]) {
  const c: XY = [AX + sx * 30.95, 13]
  cylinder(wall, roof, c, 5.0, 0, 21.0, 20)
  domeShape(dome, c, 4.85, 21.0, 2.1, 4.85, 20, 6)
  // the shutter: a raised band over the dome from the north foot to just past the top
  const W = 0.75, T = 0.3
  const secs: V3[][] = []
  for (let k = 0; k <= 8; k++) {
    const a = (k / 8) * (Math.PI * 0.62) // elevation from the north side, past the zenith
    const rr = 4.85, z = 23.1 + rr * Math.sin(a), y = rr * Math.cos(a)
    const n: XY = [Math.cos(a), Math.sin(a)] // outward in the (y, z) plane
    const o = (d: number): [number, number] => [c[1] + y + n[0] * d, z + n[1] * d]
    const [y0, z0] = o(-0.05), [y1, z1] = o(T)
    secs.push([[c[0] - W, y0, z0], [c[0] + W, y0, z0], [c[0] + W, y1, z1], [c[0] - W, y1, z1]])
  }
  // the vertical part of the shutter on the skirt
  secs.unshift(secs[0].map(([x, y, z]) => [x, y, 21.05] as V3))
  dome.sweep(secs)
  // a small window low on the tower's north side
  arcPanel(win, c, Math.PI / 2 + sx * 0.5, 5.0, 1.0, LAWN + 2.2, LAWN + 4.0)
}

// ---------- the planetarium ----------
{
  const P: XY = [-1.9, -15.9]
  const SEG = 40
  // the lower drum, stepping in to the upper drum at 15 m
  cylinder(wall, roof, P, 15.0, 0, 15.0, SEG)
  cylinder(wall, roof, P, 13.6, 0, 22.6, SEG)
  // 20 pilasters, the full height of both drums, their caps standing round the dome's foot
  for (let k = 0; k < 20; k++) {
    const t = (k / 20) * 2 * Math.PI + Math.PI / 20
    radialBox(wall, P, t, 0.6, 14.9, 15.5, 0, 15.4)
    radialBox(wall, P, t, 0.55, 13.5, 14.1, 15.0, 23.6)
  }
  // windows between the pilasters, where the drum stands clear of the block
  for (let k = 0; k < 20; k++) {
    const t = (k / 20) * 2 * Math.PI
    const x = P[0] + 15.4 * Math.cos(t), y = P[1] + 15.4 * Math.sin(t)
    if (!inside(x, y, 10.5)) {
      arcPanel(win, P, t, 15.0, 1.5, 9.6, 12.8)
      arcPanel(win, P, t, 15.0, 1.5, 4.0, 6.2)
    }
    const xu = P[0] + 13.7 * Math.cos(t), yu = P[1] + 13.7 * Math.sin(t)
    if (!inside(xu, yu, ROOF + 0.5) && yu < -8) arcPanel(win, P, t, 13.6, 1.4, 17.2, 20.8)
  }
  // the dome: 12.6 m radius, springing at 22.6 m, its top at the lidar's 34.8 m
  domeShape(dome, P, 12.6, 22.6, 0, 12.2, SEG, 10)
}

// ---------- the lantern over the rotunda ----------
{
  const L: XY = [AX, 13.2], RC = 6.1, Z0 = 21.2
  lathe(lantern, L, [[RC, Z0, 1, 0], [RC, 23.8, 1, 0], [3.4, 25.0, 0, 0], [1.7, 25.0, 0, 0], [1.7, 25.8, 0, 0], [0, 25.8, 0, 0]], 8, Math.PI / 8, true)
}

// ---------- write ----------
const parts = [
  { part: wall, material: finish('griffith-white', 0xf7f5f0) },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
  { part: dome, material: finish('griffith-bronze', 0x847a6d) },
  { part: lantern, material: PALETTE.copper },
]
const triangles = parts.reduce((n, { part }) => n + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Griffith Observatory', parts, {
  license: 'CC0-1.0', bearing: 0, elevation: 0, height: 34.8,
  frame: 'Y up, -Z north, +X east, metres; origin at the anchor on the ground',
  replaces: ['way/422130705'],
})
if (glb.length > 256000) throw new Error(`File budget exceeded: ${glb.length}`)
const out = process.argv[2] ?? new URL('../models/la-griffith-observatory.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes (${(glb.length / 1024).toFixed(1)} KiB)`)
