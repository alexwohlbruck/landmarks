/**
 * Mihrimah Sultan Mosque, Edirnekapı, Istanbul: procedural, CC0-1.0.
 * bun generators/istanbul-mihrimah-sultan-edirnekapi.ts
 *
 * Mimar Sinan, about 1562-70, for Mihrimah Sultan, on the highest point of
 * the old city by the land walls. Sinan's cube: a single 20 m dome on a
 * window drum over a square whose four great arched tympana are filled with
 * rows of windows (the "lantern" walls), four corner turrets with small
 * domes, stepped buttresses down to the side aisles, each aisle under three
 * domes; one slender, very tall minaret with one şerefe; the double portico
 * (seven domes); the raised courtyard ringed by domed medrese cells, with
 * the şadırvan in the middle.
 *
 * Uses the mosque kit exported by generators/istanbul-new-mosque.ts.
 *
 * Frame: x across the axis (towards world 48.1, the Fevzi Paşa street
 * side), y along it towards the courtyard (world 318.1), z up; placed with
 * bearing 318.1 (OSM's walls). Origin at the centroid of the OSM outline
 * (relation/7318379), 28.935707, 41.029332.
 *
 * Plan: Cornelius Gurlitt's measured plan and section (1912, public
 * domain), scaled by their own bars (plan 7.5 px/m, section 15.3 px/m in
 * the 1280 px file; the dome measures 20.7 and 20.6 m in them against the
 * published 20 m): hall 40.2 m wide, 24.6 m deep, the dome's centre 13.3 m
 * from the qibla wall; side aisles 9.5 m with three domes each; the double
 * portico 11.4 m deep and 50.8 m wide with seven domes; the courtyard 73 m
 * wide with medrese cells down both sides and across the front, the open
 * court 57.4 x 20.7 m. The plan is placed on OSM (ODbL, fetched 2026-11;
 * relation/7318379, source=bing, no parts or heights) by its open court,
 * which OSM's inner ring matches in width (55.7 m) and centre: the dome's
 * centre falls at (0.6, -8.65). OSM's outline runs 30 m further behind the
 * qibla wall than the plan; photo a26 shows lawn and a fence there, not a
 * building, so nothing is modelled behind the qibla wall.
 *
 * Heights from Gurlitt's section, over the hall floor (F = 3 m above the
 * lowest ground, on the Fevzi Paşa street side, where the courtyard's
 * retaining wall shows in b05; estimated): dome crown 37.6 m (published
 * 37 m), alem to 41.2 m; dome springing 30.8 m; drum from 26.6 m; the
 * cube's cornice 26 m; the tympana's arches 20 m across, springing at
 * 13.4 m, crown 24.5 m; the side aisles' roofs 13.4 m; the portico's walls 9.8 m, its
 * domes to 12.2 m. The photo b05 (raised, from the courtyard side) agrees
 * within a metre for the drum and tympanum.
 * Estimated from b05: the minaret's şerefe at 44 m over the floor, cap
 * 51-57.5 m, alem to 59 m (scaled from the dome, allowing for the minaret
 * standing about 30 m nearer the camera); the corner turrets to 28 m; the
 * medrese cells' roofs 6.5 m with small domes.
 * The cube is drawn 23.2 m square so that each face is one great arch
 * spanning pier to pier: inner radius 10 m (the 20 m span), a 1.3 m pale
 * stone frame 0.4 m proud, springing at the aisle roofs (13.4 m over the
 * floor, as in Gurlitt) with its crown at 24.7 m over the floor, just under
 * the cornice and the drum; the corner turrets rise from the aisle
 * roofs at the cube's corners, so the arches spring from them.
 * Invented / simplified: the tympanum's fill as five rows of paired
 * windows following the arch (6, 5, 4, 3 and 2 pairs; the real lantern
 * walls also have roundels), with a pale gallery band at the springing;
 * the stepped
buttresses as three steps; the stairs and the shops under the platform
 * are left out.
 *
 * The minaret is drawn 3.0 m across (real about 2.2 m) with a bold şerefe.
 *
 * Colours from daylight photos, pulled to the palette: grey limestone
 * (#ddd9d0), blue-grey lead (#97a1ac), gilt alems; the medrese's banded
 * stone and brick is kept stone (it reads grey at map distance).
 * Night: the mosque is floodlit; stone and lead carry _FLOODLIGHT; windows
 * glow.
 *
 * Sources (EVIDENCE, Wikimedia Commons):
 * - a30 "Mihrimah Sultan Mosque Edirnekapi Gurlitt 1912.jpg", Cornelius
 *   Gurlitt, public domain (plan and section)
 *   https://commons.wikimedia.org/wiki/File:Mihrimah_Sultan_Mosque_Edirnekapi_Gurlitt_1912.jpg
 * - b05 "Istanbul - Mesquita de Mihrimah.JPG", Josep Renalias, CC BY-SA 3.0
 *   (raised, from the north-west over the courtyard)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_-_Mesquita_de_Mihrimah.JPG
 * - a26 "Istanbul Mihrimah Sultan Mosque (Edirnekapı) view from
 *   surroundings in 2015 0100.jpg", Dosseman, CC BY-SA 4.0 (the qibla
 *   side, square on)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Mihrimah_Sultan_Mosque_(Edirnekap%C4%B1)_view_from_surroundings_in_2015_0100.jpg
 * - a09 "... view from surroundings in 2004 1187.jpg", Dosseman,
 *   CC BY-SA 4.0 (a side aisle with its three domes, the tympanum above)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Mihrimah_Sultan_Mosque_(Edirnekap%C4%B1)_view_from_surroundings_in_2004_1187.jpg
 * - a29 "Istanbul Mihrimah Sultan Mosque (Edirnekapı) courtyard in 2018
 *   9252 Panorama b.jpg", Dosseman, CC BY-SA 4.0 (courtyard, portico,
 *   şadırvan, minaret)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Mihrimah_Sultan_Mosque_(Edirnekap%C4%B1)_courtyard_in_2018_9252_Panorama_b.jpg
 * - a19 "Istanbul Mihrimah Sultan Mosque 2015 0101.jpg", Dosseman,
 *   CC BY-SA 4.0 (a tympanum square on)
 *   https://commons.wikimedia.org/wiki/File:Istanbul_Mihrimah_Sultan_Mosque_2015_0101.jpg
 * Look-only: none.
 *
 * Doubts: the plan's placement on OSM rests on the open court alone; the
 * floor's height over the street is estimated; the minaret's height is
 * photo-scaled from one raised view; the south-west side was not checked.
 */
import { Part, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { MosqueKit, type XY, circle, panel, poly, prism, rect, windowRow, lit } from './istanbul-new-mosque'

const stone = new Part(), lead = new Part(), win = new Part(), gilt = new Part(), trim = new Part()
const K = new MosqueKit(stone, lead, win, gilt)

const F = 3.0 // hall and courtyard floor over the lowest ground; estimated
const D: XY = [0.6, -8.65] // dome centre
const HX = 20.1, Q = D[1] - 13.3, FR = D[1] + 11.3 // hall half width, qibla wall, front wall
const CB = 11.6 // half side of the cube: the 20 m arches plus their frames, pier to pier
const AISLE = F + 13.4, CUBE = F + 26
const AR = 10.0 // the great arches' inner radius (20 m span, Gurlitt); frame 1.3 m, outer 11.3 inside the 11.6 face
const TS = AISLE // springing at the aisle roofs (Gurlitt: 13.4 m over the floor); the frame's crown at 27.7 m, under the cornice and drum

// Side aisles' block and the walls round the hall.
prism(stone, rect(D[0] - HX, D[0] + HX, Q, FR, 0.5), 0, AISLE, false)
prism(stone, rect(D[0] - HX - 0.3, D[0] + HX + 0.3, Q - 0.3, FR + 0.3, 0.6), AISLE - 0.7, AISLE + 0.25, false)
poly(stone, rect(D[0] - HX - 0.3, D[0] + HX + 0.3, Q - 0.3, FR + 0.3, 0.6).map(([x, y]) => [x, y, AISLE + 0.25] as V3), [0, 0, 1])
// lower windows: the qibla wall's three arched groups, the side walls' three recesses
windowRow(win, [D[0] + HX, Q], [D[0] - HX, Q], 3, 5.2, F + 1.6, F + 9.6, [0, -1], true)
windowRow(win, [D[0] + HX, Q], [D[0] - HX, Q], 6, 1.4, F + 10.6, F + 12.4, [0, -1], false)
for (const s of [-1, 1]) {
  const a: XY = s > 0 ? [D[0] + HX, FR] : [D[0] - HX, Q], b: XY = s > 0 ? [D[0] + HX, Q] : [D[0] - HX, FR]
  windowRow(win, a, b, 3, 4.6, F + 1.6, F + 9.0, [s, 0], true)
  windowRow(win, a, b, 6, 1.4, F + 10.2, F + 12.2, [s, 0], false)
}

// The aisles' domes, three a side.
for (const s of [-1, 1]) for (const dy of [-7.3, 0, 6.9]) {
  const c: XY = [D[0] + s * 15.3, D[1] + dy]
  prism(stone, circle(c[0], c[1], 3.1, 8, Math.PI / 8), AISLE + 0.25, AISLE + 0.9)
  K.dome(c[0], c[1], 3.0, AISLE + 0.9, 2.0, 10, 2, 1.0, false)
}

// The cube: on each face ONE great semicircular arch, framed in pale stone,
// its tympanum filled with rows of grouped windows; the arch rises almost
// to the drum (a19, a26, a09).
prism(stone, rect(D[0] - CB, D[0] + CB, D[1] - CB, D[1] + CB, 0.4), AISLE, CUBE)
prism(stone, rect(D[0] - CB - 0.3, D[0] + CB + 0.3, D[1] - CB - 0.3, D[1] + CB + 0.3, 0.5), CUBE - 0.8, CUBE + 0.25)
{
  const R = AR, W = 1.3, OUT = 0.4
  const faces: Array<{ o: XY; u: XY; n: XY }> = [
    { o: [D[0], D[1] - CB], u: [-1, 0], n: [0, -1] },
    { o: [D[0], D[1] + CB], u: [1, 0], n: [0, 1] },
    { o: [D[0] + CB, D[1]], u: [0, -1], n: [1, 0] },
    { o: [D[0] - CB, D[1]], u: [0, 1], n: [-1, 0] },
  ]
  for (const f of faces) {
    const at = (d: number, out: number): XY => [f.o[0] + f.u[0] * d + f.n[0] * out, f.o[1] + f.u[1] * d + f.n[1] * out]
    const P3 = (d: number, out: number, z: number): V3 => { const q = at(d, out); return [q[0], q[1], z] }
    const N3: V3 = [f.n[0], f.n[1], 0]
    // the frame: a ring of 12 segments standing 0.4 m proud, with its
    // intrados and extrados faces, on two pilasters down to the aisle roof
    const segs = 12
    for (let k = 0; k < segs; k++) {
      const t0 = (Math.PI * k) / segs, t1 = (Math.PI * (k + 1)) / segs
      const q = (t: number, r: number, out: number) => P3(r * Math.cos(t), out, TS + r * Math.sin(t))
      poly(trim, [q(t0, R + W, OUT), q(t1, R + W, OUT), q(t1, R, OUT), q(t0, R, OUT)], N3)
      const tm = (t0 + t1) / 2
      const inN: V3 = [-f.u[0] * Math.cos(tm), -f.u[1] * Math.cos(tm), -Math.sin(tm)]
      poly(trim, [q(t0, R, OUT), q(t1, R, OUT), q(t1, R, 0), q(t0, R, 0)], inN)
      poly(trim, [q(t0, R + W, 0), q(t1, R + W, 0), q(t1, R + W, OUT), q(t0, R + W, OUT)], [-inN[0], -inN[1], -inN[2]])
    }
    for (const sd of TS > AISLE + 0.5 ? [-1, 1] : []) {
      const d0 = sd * R, d1 = sd * (R + W)
      const ring = [at(Math.min(d0, d1), 0), at(Math.max(d0, d1), 0), at(Math.max(d0, d1), OUT), at(Math.min(d0, d1), OUT)]
      const area = ring.reduce((acc, p, i) => { const q = ring[(i + 1) % 4]; return acc + p[0] * q[1] - q[0] * p[1] }, 0)
      prism(trim, area > 0 ? ring : ring.slice().reverse(), AISLE + 0.25, TS, false)
    }
    // the gallery band at the springing, across the tympanum
    poly(trim, [P3(R, 0.06, TS + 0.3), P3(-R, 0.06, TS + 0.3), P3(-R, 0.06, TS + 0.8), P3(R, 0.06, TS + 0.8)], N3)
    // grouped windows in rows following the arch
    // five rows, 6-5-4-3-2 groups, each group a pair of lights, smaller
    // towards the crown
    const rows: Array<[number, number, number]> = [[0.9, 2.9, 6], [3.5, 5.3, 5], [5.9, 7.3, 4], [7.8, 8.8, 3], [9.15, 9.75, 2]]
    for (const [a0, a1, n] of rows) {
      const half = Math.sqrt(Math.max(0, R * R - a1 * a1)) - 0.6
      const pier = 0.8, w = (2 * half - pier * (n - 1)) / n, gap = Math.min(0.3, w * 0.15)
      for (let k = 0; k < n; k++) {
        const d = -half + k * (w + pier)
        panel(win, at(d + w, 0), at(d + w / 2 + gap / 2, 0), TS + a0, TS + a1, f.n)
        panel(win, at(d + w / 2 - gap / 2, 0), at(d, 0), TS + a0, TS + a1, f.n)
      }
    }
  }
}
// stepped buttresses in the planes of the qibla and front walls, falling
// from the cube's corners over the aisles (a26)
for (const sx of [-1, 1]) for (const yy of [[Q, Q + 2.0], [FR - 2.0, FR]]) {
  for (let k = 0; k < 3; k++) {
    const x0 = D[0] + sx * CB, x1 = D[0] + sx * (CB + 2.8 * (k + 1))
    prism(stone, rect(Math.min(x0, x1), Math.max(x0, x1), yy[0], yy[1]), AISLE, CUBE + 1.2 - k * 4.0)
  }
}
// four corner turrets over the cube's corner piers, with small domes
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  // the turret rises from the aisle roof at the cube's corner, so each great
  // arch springs from it (a26)
  const c: XY = [D[0] + sx * CB, D[1] + sy * CB]
  prism(stone, circle(c[0], c[1], 1.9, 8, Math.PI / 8), AISLE, F + 29.6)
  prism(stone, circle(c[0], c[1], 2.15, 8, Math.PI / 8), CUBE - 0.8, CUBE + 0.25)
  K.dome(c[0], c[1], 1.8, F + 29.6, 1.9, 8, 2, 1.2, false)
}
// drum and dome
K.drum(D[0], D[1], 10.7, CUBE + 0.25, F + 30.8, 24, { every: 1, frac: 0.66, wz0: CUBE + 0.9, wz1: F + 30.3, arch: true })
K.dome(D[0], D[1], 10.6, F + 30.8, 6.8, 24, 5, 3.6)

// ---------------------------------------------------------------------------
// The double portico: seven domes inside, an arcade under a lean-to outside.
const PX = 25.4, P1 = FR + 6.4, P2 = FR + 11.4
prism(stone, rect(D[0] - PX, D[0] + PX, FR, P1), F + 8.8, F + 9.8, true, true)
for (let k = 0; k < 7; k++) {
  const x = D[0] - PX + ((2 * PX) * (k + 0.5)) / 7
  K.dome(x, (FR + P1) / 2, 2.9, F + 9.8, 2.2, 10, 2, k === 3 ? 1.0 : 0, false)
}
K.arcade([D[0] - PX, P1], [D[0] + PX, P1], 7, F + 5.6, F + 8.8, [0, 1], 0.8, 0.8, 0)
K.arcade([D[0] - PX, P2], [D[0] + PX, P2], 9, F + 3.6, F + 5.8, [0, 1], 0.6, 0.6, 0, 4)
K.lean(D[0] - PX - 0.4, D[0] + PX + 0.4, P1, P2 + 0.5, F + 7.6, F + 6.0, '-y', 0.4)
for (const s of [-1, 1]) prism(stone, rect(s > 0 ? D[0] + PX - 0.8 : D[0] - PX, s > 0 ? D[0] + PX : D[0] - PX + 0.8, FR, P1), 0, F + 8.8, false)
windowRow(win, [D[0] - HX, FR], [D[0] + HX, FR], 4, 1.6, F + 1.4, F + 4.4, [0, 1], true, (k) => k === 1 || k === 2)
panel(win, [D[0] - 1.6, FR], [D[0] + 1.6, FR], F, F + 5.2, [0, 1], 'pointed')

// ---------------------------------------------------------------------------
// Courtyard: medrese cells with an arcade in front, down both sides and
// across the front; the outer walls run down to the lowest ground.
const CX = 36.5, OX = 28.7, CF = D[1] + 52, OF = D[1] + 44 // outer half width, open half width, front wall, open front
const CROOF = F + 6.5
const wing = (x0: number, x1: number, y0: number, y1: number) => prism(stone, rect(x0, x1, y0, y1), CROOF - 0.9, CROOF, true, true)
for (const s of [-1, 1]) {
  const xo = D[0] + s * CX, xi = D[0] + s * OX
  wing(Math.min(xo, xi), Math.max(xo, xi), FR, CF)
  prism(stone, rect(Math.min(xo, xo - s * 1.2), Math.max(xo, xo - s * 1.2), FR, CF), 0, CROOF - 0.9, false)
  // the cells' back wall, 3.6 m in from the arcade
  prism(stone, rect(Math.min(xi + s * 3.6, xi + s * 4.2), Math.max(xi + s * 3.6, xi + s * 4.2), P2, OF), F, CROOF - 0.9, false)
  K.arcade(s > 0 ? [xi, P2] : [xi, OF], s > 0 ? [xi, OF] : [xi, P2], 9, F + 3.0, CROOF - 0.9, [-s, 0], 0.6, 0.6, 0, 4)
  // two rows of small domes: arcade bays and cells
  for (let k = 0; k < 9; k++) {
    const y = P2 + ((OF - P2) * (k + 0.5)) / 9
    K.dome(xi + s * 1.8, y, 1.4, CROOF, 1.1, 8, 2, 0, false)
    K.dome(xi + s * 5.9, y, 1.6, CROOF, 1.3, 8, 2, 0, false)
  }
  // the gaps between portico and wings
  prism(stone, rect(Math.min(D[0] + s * PX, xi), Math.max(D[0] + s * PX, xi), FR, P2), CROOF - 0.9, CROOF, true, true)
}
wing(D[0] - OX, D[0] + OX, OF, CF)
prism(stone, rect(D[0] - CX, D[0] + CX, CF - 1.2, CF), 0, CROOF - 0.9, false)
prism(stone, rect(D[0] - OX, D[0] + OX, OF + 3.6, OF + 4.2), F, CROOF - 0.9, false)
K.arcade([D[0] + OX, OF], [D[0] - OX, OF], 13, F + 3.0, CROOF - 0.9, [0, -1], 0.6, 0.6, 0, 4)
for (let k = 0; k < 13; k++) {
  const x = D[0] - OX + ((2 * OX) * (k + 0.5)) / 13
  K.dome(x, OF + 1.8, 1.4, CROOF, 1.1, 8, 2, 0, false)
  if (k !== 6) K.dome(x, OF + 5.9, 1.6, CROOF, 1.3, 8, 2, 0, false)
}
// the gate in the front wall
prism(stone, rect(D[0] - 3.2, D[0] + 3.2, OF + 3.6, CF + 0.5, 0.3), CROOF - 0.9, CROOF + 2.4)
panel(win, [D[0] + 1.8, CF + 0.5], [D[0] - 1.8, CF + 0.5], 0.4, F + 4.4, [0, 1], 'pointed')
K.dome(D[0], OF + 5.2, 2.6, CROOF + 2.4, 1.8, 10, 2, 0.9, false)
// outer windows of the cells, one per cell
for (const s of [-1, 1]) {
  const a: XY = s > 0 ? [D[0] + CX, FR] : [D[0] - CX, CF], b: XY = s > 0 ? [D[0] + CX, CF] : [D[0] - CX, FR]
  windowRow(win, a, b, 10, 1.1, F + 1.6, F + 3.6, [s, 0])
}

// Şadırvan: twelve columns under a lead cone (a29).
{
  const c: XY = [D[0], (P2 + OF) / 2]
  for (const [x, y] of circle(c[0], c[1], 3.4, 12)) prism(stone, circle(x, y, 0.28, 4, Math.PI / 4), 0, F + 3.0, false)
  prism(stone, circle(c[0], c[1], 4.1, 12), F + 3.0, F + 3.6, true, true)
  K.dome(c[0], c[1], 3.9, F + 3.6, 2.6, 12, 2, 0.9)
}

// The minaret at the hall's south-west front corner, behind the portico.
K.minaret(D[0] - HX - 2.0, FR - 1.6, { R: 1.5, pedHalf: 2.2, ped: AISLE, balconies: [F + 44], capBase: F + 51, capTip: F + 57.5, alem: 1.6, n: 10 })

const parts = [
  { part: stone, material: { ...finish('limestone', 0xddd9d0), floodlight: lit(0.85) } },
  { part: lead, material: { ...finish('lead', 0x97a1ac), floodlight: () => 0.85 } },
  { part: trim, material: { ...finish('pale-stone', 0xf2ece1), floodlight: () => 0.9 } },
  { part: win, material: PALETTE.window },
  { part: gilt, material: { ...finish('gilt', 0xcfa94f), floodlight: () => 0.8 } },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Mihrimah Sultan Mosque', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 318.1, elevation: 0, height: 62.1,
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/istanbul-mihrimah-sultan-edirnekapi.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
