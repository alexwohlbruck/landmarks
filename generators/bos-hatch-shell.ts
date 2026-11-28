/**
 * Edward A. Hatch Memorial Shell, Charles River Esplanade, Boston (1940,
 * Richard J. Shaw) — original procedural geometry, CC0-1.0.
 * bun generators/bos-hatch-shell.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lawn. Bearing 14: the shell opens to -y, toward the Oval lawn (south-
 * south-west), and its back faces the river. Anchor = the centre of OSM
 * way/832645690, -71.073677, 42.3573289.
 *
 * Identity (from the photos below):
 *  1. A great quarter-sphere shell, its back a smooth mauve-grey dome.
 *  2. Its open face: a pale rim under a thin grey lip, and inside it the
 *     stepped concentric semicircular arches of warm wood, telescoping back
 *     to a small arch at the rear wall of the stage.
 *  3. A low pale stone ring building wrapped round the back (dressing
 *     rooms, with skylights on its flat roof), and the raised stage and
 *     stone terrace in front.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 0.5 m grid,
 * read in this frame; the lawn round the shell is 0.6 above the grid's
 * ground_min and is y = 0 here. Measured: the shell's crown 14.0 just
 * behind its front; its back fits a sphere of radius 14 centred on
 * (0.5, -7.4) on the ground to 0.5 m (readings at x 0, 5, 8, 10, 12 and
 * y -8 to 5); the front edge at y -9.5; the ring building 3.3–3.4 out to
 * 16.4 m from the centre (6.5 m blocks at x ±13.5–17 are the black sound
 * towers seen in the aerial photo, left out); the stage
 * 1.6 (x -6..7, y -13..-10); the terrace in front 0.6. OSM's roof part
 * way/832387208 says 12.2, which is the shell's rim rather than its crown.
 *
 * Estimated from the photos: the rim's width (1.5 m), the eight wood arches
 * and their depths, the stage's extent across the opening, the skylights.
 *
 * Ground: flat (lidar 0.5–1.2 over the site); elevation 0.
 * Night: the inside of the shell is floodlit for concerts; the wood carries
 * _FLOODLIGHT.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Hatch Memorial Shell, photographed Nov. 14, 2026.jpg, Abzeronow,
 *    CC BY 4.0 (the open face, close)
 *    https://commons.wikimedia.org/wiki/File:Hatch_Memorial_Shell,_photographed_Nov._14,_2026.jpg
 *  - 2017 Prudential Skywalk - Hatch Shell (NNE).jpg, Beyond My Ken, CC BY-SA
 *    4.0 (the front from above)
 *    https://commons.wikimedia.org/wiki/File:2017_Prudential_Skywalk_-_Hatch_Shell_(NNE).jpg
 *  - Backside of DCR's Hatch Memorial Shell.jpg, AbhiSuryawanshi, CC BY-SA
 *    4.0 (the back and the ring building from the air)
 *    https://commons.wikimedia.org/wiki/File:Backside_of_DCR%27s_Hatch_Memorial_Shell.jpg
 *  - Hatch Memorial Shell 2023a.jpg, Antony-22, CC BY-SA 4.0 (at night)
 *    https://commons.wikimedia.org/wiki/File:Hatch_Memorial_Shell_2023a.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the ring building's doors and windows are left plain; the
 * terrace's steps and inscribed names are drawn as one low block.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, save } from './atl-flatiron-building'

const dome = new Part(), rimW = new Part(), wood = new Part(), wood2 = new Part(), stone = new Part(), roof = new Part()

const CX = 0.5, CY = -7.4, R = 14, FRONT = -9.5, RI = 12.5, NT = 16, NP = 8
const arc = (r: number, y: number, i: number, n = NT): V3 => {
  const t = (i / n) * Math.PI
  return [CX + r * Math.cos(t), y, r * Math.sin(t)]
}

// ── The shell's back: a quarter sphere, and the hood in front of it ──
const sph = (t: number, p: number): V3 => [CX + R * Math.cos(p) * Math.cos(t), CY + R * Math.cos(p) * Math.sin(t), R * Math.sin(p)]
for (let i = 0; i < NT; i++) {
  for (let j = 0; j < NP; j++) {
    const t0 = (i / NT) * Math.PI, t1 = ((i + 1) / NT) * Math.PI, p0 = (j / NP) * (Math.PI / 2), p1 = ((j + 1) / NP) * (Math.PI / 2)
    const n = (t: number, p: number): V3 => [Math.cos(p) * Math.cos(t), Math.cos(p) * Math.sin(t), Math.sin(p)]
    dome.tri(sph(t0, p0), sph(t1, p0), sph(t1, p1), undefined, undefined, undefined, [n(t0, p0), n(t1, p0), n(t1, p1)])
    if (j < NP - 1) dome.tri(sph(t0, p0), sph(t1, p1), sph(t0, p1), undefined, undefined, undefined, [n(t0, p0), n(t1, p1), n(t0, p1)])
  }
}
// the hood: a half cylinder from the sphere's front plane forward to the rim
for (let i = 0; i < NT; i++) {
  const a0 = arc(R, CY, i), a1 = arc(R, CY, i + 1), b0 = arc(R, FRONT, i), b1 = arc(R, FRONT, i + 1)
  const n0: V3 = [Math.cos((i / NT) * Math.PI), 0, Math.sin((i / NT) * Math.PI)], n1: V3 = [Math.cos(((i + 1) / NT) * Math.PI), 0, Math.sin(((i + 1) / NT) * Math.PI)]
  dome.tri(b0, a0, a1, undefined, undefined, undefined, [n0, n0, n1])
  dome.tri(b0, a1, b1, undefined, undefined, undefined, [n0, n1, n1])
}
// the rim: a grey lip, then the pale band, facing the lawn
const annulus = (p: Part, r0: number, r1: number, y: number) => {
  for (let i = 0; i < NT; i++) p.quad(arc(r0, y, i + 1), arc(r0, y, i), arc(r1, y, i), arc(r1, y, i + 1))
}
annulus(roof, R - 0.35, R, FRONT)
annulus(rimW, RI, R - 0.35, FRONT)

// ── Inside: eight telescoping wood arches back to the stage's rear wall ──
const rings: Array<[number, number]> = [[RI, FRONT], [11.6, CY + 0.2], [10.6, CY + 1.6], [9.6, CY + 2.9], [8.5, CY + 4.1], [7.4, CY + 5.2], [6.2, CY + 6.2], [5.0, CY + 7.1]]
const BACK = CY + 8.0
for (let k = 0; k < rings.length; k++) {
  const [r, y0] = rings[k], y1 = k + 1 < rings.length ? rings[k + 1][1] : BACK
  const part = k === 0 ? rimW : wood
  // the arch's soffit, seen from inside (faces the axis)
  for (let i = 0; i < NT; i++) part.quad(arc(r, y0, i + 1), arc(r, y1, i + 1), arc(r, y1, i), arc(r, y0, i))
  // the step down to the next arch, facing the lawn
  const rn = k + 1 < rings.length ? rings[k + 1][0] : 0
  if (rn > 0) {
    annulus(wood2, rn + 0.28, r, y1)
    annulus(wood, rn, rn + 0.28, y1) // the dark joint along each arch's inner edge
  }
  else for (let i = 0; i < NT; i++) wood2.tri([CX, y1, 0], arc(r, y1, i), arc(r, y1, i + 1))
}

// ── The stage and terrace in front ──
box(stone, CX - RI, CX + RI, -13.0, CY + 2, 0, 1.6, stone, 0.15)
box(stone, -19, 19.5, -16.5, -13.0, 0, 0.6, stone, 0.1)

// ── The ring building round the back (the 6.5 m blocks the lidar shows at
// the front corners are the black sound towers seen in the aerial photo,
// not part of the shell, and are left out) ──
const RO = 16.4, NR = 16
for (let i = 0; i < NR; i++) {
  const t0 = (i / NR) * Math.PI, t1 = ((i + 1) / NR) * Math.PI
  const o = (t: number, z: number): V3 => [CX + RO * Math.cos(t), CY + RO * Math.sin(t), z]
  const n = (t: number): V3 => [Math.cos(t), Math.sin(t), 0]
  stone.tri(o(t0, 0), o(t1, 0), o(t1, 3.4), undefined, undefined, undefined, [n(t0), n(t1), n(t1)])
  stone.tri(o(t0, 0), o(t1, 3.4), o(t0, 3.4), undefined, undefined, undefined, [n(t0), n(t1), n(t0)])
  // flat roof from the dome out to the wall
  const ri = Math.sqrt(R * R - 3.4 * 3.4)
  const q = (t: number, r: number): V3 => [CX + r * Math.cos(t), CY + r * Math.sin(t), 3.4]
  stone.quad(q(t0, ri), q(t0, RO), q(t1, RO), q(t1, ri))
}
// its front ends, either side of the hood
for (const s of [1, -1]) {
  const xa = CX + s * R, xb = CX + s * RO
  if (s > 0) stone.quad([xa, CY, 0], [xb, CY, 0], [xb, CY, 3.4], [xa, CY, 3.4])
  else stone.quad([xb, CY, 0], [xa, CY, 0], [xa, CY, 3.4], [xb, CY, 3.4])
}
// skylights on the ring's roof
for (let k = 0; k < 7; k++) {
  const t = ((k + 0.5) / 7) * Math.PI, r = 15.3
  const c: V3 = [CX + r * Math.cos(t), CY + r * Math.sin(t), 3.4]
  box(rimW, c[0] - 0.5, c[0] + 0.5, c[1] - 0.5, c[1] + 0.5, 3.4, 3.8, rimW, 0.05)
}

const flood = (p: V3, n: V3) => (n[1] < -0.3 || p[1] > CY - 2.5 ? 0.85 : 0.4)
await save('bos-hatch-shell', 'Hatch Memorial Shell', [
  { part: dome, material: finish('hatch-dome', 0xa8968f) },
  { part: rimW, material: { ...finish('hatch-rim', 0xe2cfa6), floodlight: flood } },
  { part: wood, material: { ...finish('hatch-wood', 0x9a5c3b), floodlight: flood } },
  { part: wood2, material: { ...finish('hatch-wood-face', 0xc98b58), floodlight: flood } },
  { part: stone, material: PALETTE.stone },
  { part: roof, material: PALETTE.roof },
], { height: 14, anchor: [42.3573289, -71.073677], bearing: 14 })
