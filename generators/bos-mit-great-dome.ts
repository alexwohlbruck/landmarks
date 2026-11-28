/**
 * MIT Building 10 and the Great Dome (Maclaurin Buildings), Cambridge MA:
 * original procedural geometry, CC0-1.0.
 * bun generators/bos-mit-great-dome.ts
 *
 * William Welles Bosworth, 1913-1916. Building 10 is the domed centre of
 * MIT's main group: a limestone block whose south front on Killian Court
 * carries a giant portico of ten Ionic columns under an entablature
 * inscribed MASSACHVSETTS INSTITVTE OF TECHNOLOGY and a plain attic; behind
 * it a low Pantheon-like dome on a two-stage drum (the date MCMXVI on the
 * lower drum, a dentil cornice, a set-back upper drum, a green copper line,
 * stepped rings and a saucer cap with a flat oculus skylight).
 *
 * Frame: map frame turned to BEARING 335.9, so the portico faces "south"
 * (-y), out over Killian Court toward the Charles; x east-ish, y north-ish,
 * z up, metres. Origin = the anchor, the centroid of OSM way/32517642.
 *
 * Identity (from the photos):
 *  1. the dome's silhouette: wide drum, cornice, set-back upper drum,
 *     stepped rings and a low saucer cap with a small flat top;
 *  2. the ten-column Ionic portico with its deep entablature and attic;
 *  3. the tall dark windows between the columns;
 *  4. one warm limestone colour for all of it, dome included.
 *
 * Evidence
 * - OSM way/32517642 (Building 10, outline, 7 levels, "height 58.03",
 *   limestone, 1913) and its parts: way/1242048060 (main block),
 *   way/1264589540 (the portico strip, y -25.3..-23.2), way/479313188 (the
 *   drum, r 19.3), way/1246917360, 1264282655-58 (the stepped rings),
 *   way/1264282659 (dome), way/1246917361 (glass oculus). OSM heights here
 *   are elevations (the 58.03 is not the building's height): the parts' tops
 *   minus about 3 m match the lidar's elevations.
 * - USGS 3DEP lidar MA_CentralEastern_1_2021 (2021 flight), 0.5 m grid read
 *   in this frame. y = 0 is the lowest ground under the footprint, on the
 *   north side (lidar 0.8 m over the box's ground_min); Killian Court in
 *   front is 2.1 m higher. Measured (above y = 0), radially about the dome
 *   centre (0, 8.9):
 *     drum r 19.2, cornice top 34.7; upper drum r 17.1, top 37.7;
 *     steps 38.2 (r 16), 38.9 (r 15), 39.6 (r 14), 40.3 (r 13);
 *     cap a sphere of R 17.7 centred at z 27.9 (fits r 12, 10, 8, 4.5 to
 *     ±0.3 m); flat top 45.4 for r < 4.2;
 *     main block roof 23.6, front range and attic 23.2-24.7, portico
 *     entablature 21.1.
 * - Map terrain (Mapterhorn): 0.2-0.6 m on the north side, 2.4 m in the
 *   court, as the lidar shows. Elevation 0.
 * - Photos (Wikimedia Commons, all EVIDENCE):
 *   - "Great Dome, MIT - IMG 8390.JPG", Daderot, public domain (front,
 *     straight on: columns, entablature, attic, drum stages, steps):
 *     https://commons.wikimedia.org/wiki/File:Great_Dome,_MIT_-_IMG_8390.JPG
 *   - "2017 Maclaurin Buildings (MIT Building 10) and Great Dome.jpg",
 *     Beyond My Ken, CC BY-SA 4.0 (front; windows between the columns):
 *     https://commons.wikimedia.org/wiki/File:2017_Maclaurin_Buildings_(MIT_Building_10)_and_Great_Dome.jpg
 *   - "MIT Killian Court.jpg", Madcoverboy, CC BY-SA 3.0 (from the far end
 *     of Killian Court):
 *     https://commons.wikimedia.org/wiki/File:MIT_Killian_Court.jpg
 *   - "Great dome of MIT, Feb 2021.jpg", Peacearth, CC BY-SA 4.0 (from
 *     Memorial Drive, the whole front):
 *     https://commons.wikimedia.org/wiki/File:Great_dome_of_MIT,_Feb_2021.jpg
 *   - "MIT Main Campus aerial.jpg", Nick Allen, CC BY-SA 4.0 (from the
 *     south-west, above: roofs, drum, the steps weathered grey):
 *     https://commons.wikimedia.org/wiki/File:MIT_Main_Campus_aerial.jpg
 *   No look-only sources. No commercial imagery.
 *
 * Estimated: the columns (ten, 4.8 m apart, r 0.85 m, 3.1-18.0 m) and the
 * entablature's bottom (18.0) from the Daderot photo scaled to the lidar
 * entablature top; the loggia's depth behind the columns (2 m, the windows
 * sit in shadow); the drum's dentil band; windows on the court-side walls
 * (two bands per face, not photographed closely).
 *
 * Not modelled: Buildings 3 and 4, the wings either side (their own OSM
 * ways), and Building 13 behind; the inscription and MCMXVI panel; the
 * steps' individual treads.
 *
 * Doubts: the side walls facing the small light courts east and west of
 * the drum block are drawn with generic window bands.
 *
 * Night: the dome and drum are floodlit; the windows glow.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { box, onWall, rectShape, save, type XY } from './atl-tech-tower'
import { smoothWall, circle, prism, split } from './atl-flatiron-building'

/** A box on the ground, its walls split every 2 m so the base reads as standing on y = 0 all along. */
const gbox = (p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Part, bev: number) =>
  prism(p, split([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 2), z0, z1, top, bev)

const stone = new Part(), dome = new Part(), roof = new Part(), win = new Part(), green = new Part()

const C: XY = [0, 8.9] // the dome's centre
const N = 32

/** A smooth vertical cylinder about C. */
const cyl = (p: Part, r: number, z0: number, z1: number) => smoothWall(p, circle(C, r, N), z0, z1)
/** A flat annulus about C at height z, facing up (or down). */
function annulus(p: Part, r0: number, r1: number, z: number, up = true) {
  const a = circle(C, r0, N), b = circle(C, r1, N)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const A: V3 = [a[i][0], a[i][1], z], B: V3 = [b[i][0], b[i][1], z], Cc: V3 = [b[j][0], b[j][1], z], D: V3 = [a[j][0], a[j][1], z]
    if (up === r1 > r0) p.quad(A, B, Cc, D)
    else p.quad(A, D, Cc, B)
  }
}
/** A frustum (smooth) about C between two radii and heights. */
function cone(p: Part, r0: number, z0: number, r1: number, z1: number) {
  const a = circle(C, r0, N), b = circle(C, r1, N)
  const nz = (r0 - r1), nr = z1 - z0, l = Math.hypot(nz, nr)
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N
    const ang = (k: number) => (k / N) * Math.PI * 2
    const n = (k: number): V3 => [(nr / l) * Math.cos(ang(k)), (nr / l) * Math.sin(ang(k)), nz / l]
    const A: V3 = [a[i][0], a[i][1], z0], B: V3 = [a[j][0], a[j][1], z0], Cc: V3 = [b[j][0], b[j][1], z1], D: V3 = [b[i][0], b[i][1], z1]
    p.tri(A, B, Cc, undefined, undefined, undefined, [n(i), n(j), n(j)])
    p.tri(A, Cc, D, undefined, undefined, undefined, [n(i), n(j), n(i)])
  }
}

// ── Massing ──
const FRONT_TOP = 24.0, REAR_TOP = 23.6, COURT = 2.1
// The front range, behind the loggia (y -21.2 .. -8.2), full width.
gbox(stone, -25.5, 25.5, -21.2, -8.2, 0, FRONT_TOP, roof, 0.4)
// The block round the drum (y -8.2 .. 28.2).
gbox(stone, -19.4, 19.4, -8.2, 28.2, 0, REAR_TOP, roof, 0.4)
// The end bays either side of the portico, on the front line.
gbox(stone, -25.5, -21.8, -23.2, -21.2, 0, FRONT_TOP, roof, 0.4)
gbox(stone, 21.8, 25.5, -23.2, -21.2, 0, FRONT_TOP, roof, 0.4)
// The attic over the portico.
box(stone, -21.8, 21.8, -23.2, -21.2, 20.6, FRONT_TOP, roof, 0.4)
// The portico: stylobate, entablature, columns.
gbox(stone, -22.6, 22.6, -25.4, -21.2, 0, COURT + 1.5, stone, 0.2)
box(stone, -22.6, 22.6, -25.6, -21.2, 18.0, 21.1, roof, 0.35, true)
// the entablature's cornice lip
box(stone, -22.9, 22.9, -25.9, -21.2, 20.4, 21.1, roof, 0.25, true)
const COL_Y = -24.3
for (let k = 0; k < 10; k++) {
  const x = -21.6 + 4.8 * k
  box(stone, x - 1.0, x + 1.0, COL_Y - 1.0, COL_Y + 1.0, COURT + 1.5, COURT + 2.0, stone, 0.15) // base
  // the shaft, a little tapered
  const ring0 = circle([x, COL_Y], 0.85, 10), ring1 = circle([x, COL_Y], 0.74, 10)
  const nrm = ring0.map(([px, py]) => [(px - x) / 0.85, (py - COL_Y) / 0.85, 0.04] as V3)
  for (let i = 0; i < 10; i++) {
    const j = (i + 1) % 10
    const z0 = COURT + 2.0, z1 = 17.3
    stone.tri([ring0[i][0], ring0[i][1], z0], [ring0[j][0], ring0[j][1], z0], [ring1[j][0], ring1[j][1], z1], undefined, undefined, undefined, [nrm[i], nrm[j], nrm[j]])
    stone.tri([ring0[i][0], ring0[i][1], z0], [ring1[j][0], ring1[j][1], z1], [ring1[i][0], ring1[i][1], z1], undefined, undefined, undefined, [nrm[i], nrm[j], nrm[i]])
  }
  // the Ionic capital: volutes read as a wide, shallow block under the abacus
  box(stone, x - 1.15, x + 1.15, COL_Y - 0.8, COL_Y + 0.8, 17.3, 18.0, null, 0.15)
}

// ── Windows ──
// The loggia wall behind the columns (faces -y at y = -21.2): nine bays.
{
  const a: XY = [-21.8, -21.2], b: XY = [21.8, -21.2]
  for (let k = 0; k < 9; k++) {
    const xc = -21.6 + 4.8 * (k + 0.5), s = xc + 21.8, w = 1.45
    if (k === 0 || k === 8) {
      onWall(win, a, b, rectShape(s - w, s + w, COURT + 2.2, 9.2), 0.05)
      onWall(win, a, b, rectShape(s - w, s + w, 10.4, 16.8), 0.05)
    } else {
      onWall(win, a, b, rectShape(s - w, s + w, COURT + 1.7, 16.8), 0.05)
    }
  }
}
// The end bays' fronts (x 21.8..25.5 each side): one tall window in two parts.
for (const [x0, x1] of [[-25.5, -21.8], [21.8, 25.5]]) {
  const a: XY = [x0, -23.2], b: XY = [x1, -23.2], s = (x1 - x0) / 2
  onWall(win, a, b, rectShape(s - 0.9, s + 0.9, COURT + 2.2, 9.2), 0.05)
  onWall(win, a, b, rectShape(s - 0.9, s + 0.9, 10.4, 16.8), 0.05)
}
// The drum block's side walls, on the light courts (x = ±19.4, y -8.2..28.2).
for (const side of [-1, 1]) {
  const a: XY = side > 0 ? [19.4, -8.2] : [-19.4, 28.2], b: XY = side > 0 ? [19.4, 28.2] : [-19.4, -8.2]
  for (let k = 0; k < 7; k++) {
    const s = 2.4 + k * 5.25
    onWall(win, a, b, rectShape(s - 1.1, s + 1.1, 1.6, 10.6), 0.05)
    onWall(win, a, b, rectShape(s - 1.1, s + 1.1, 12.0, 20.6), 0.05)
  }
}

// ── The drum and dome, about C ──
// lower drum, r 19.2, from the roof to the cornice
cyl(stone, 19.2, REAR_TOP - 0.5, 32.4)
// the dentil frieze, a shallow band, then the cornice
cyl(stone, 19.35, 32.4, 33.6)
annulus(stone, 19.2, 19.35, 32.4, false)
cone(stone, 19.35, 33.6, 19.75, 34.2)
cyl(stone, 19.75, 34.2, 34.7)
annulus(dome, 19.75, 17.1, 34.7)
// upper drum, r 17.1, and its green copper line
cyl(stone, 17.1, 34.7, 37.2)
cyl(green, 17.2, 37.2, 37.7)
annulus(green, 17.1, 17.2, 37.2, false)
// the stepped rings
const steps: Array<[number, number]> = [[17.2, 37.7], [16.2, 38.2], [15.2, 38.9], [14.2, 39.6], [13.2, 40.3]]
for (let i = 0; i < steps.length - 1; i++) {
  const [r0, z0] = steps[i], [r1, z1] = steps[i + 1]
  annulus(roof, r0, r1, z0) // the treads weather grey (aerial)
  cyl(dome, r1, z0, z1)
}
annulus(dome, 13.2, 12.45, 40.3)
// the saucer cap: a sphere of R 17.7 centred at z 27.86, from r 12.45 to the oculus ring
{
  const R = 17.7, Z0 = 27.86
  const prof: Array<[number, number]> = []
  const a0 = Math.acos(12.45 / R), a1 = Math.acos(4.3 / R)
  for (let i = 0; i <= 8; i++) {
    const a = a0 + ((a1 - a0) * i) / 8
    prof.push([R * Math.cos(a), Z0 + R * Math.sin(a)])
  }
  for (let i = 0; i < prof.length - 1; i++) {
    const [r0, z0] = prof[i], [r1, z1] = prof[i + 1]
    // smooth normals along the sphere
    const ca = circle(C, r0, N), cb = circle(C, r1, N)
    const n = (r: number, z: number, k: number): V3 => {
      const ang = (k / N) * Math.PI * 2
      return [(r / R) * Math.cos(ang), (r / R) * Math.sin(ang), (z - Z0) / R]
    }
    for (let k = 0; k < N; k++) {
      const j = (k + 1) % N
      const A: V3 = [ca[k][0], ca[k][1], z0], B: V3 = [ca[j][0], ca[j][1], z0], Cc: V3 = [cb[j][0], cb[j][1], z1], D: V3 = [cb[k][0], cb[k][1], z1]
      dome.tri(A, B, Cc, undefined, undefined, undefined, [n(r0, z0, k), n(r0, z0, j), n(r1, z1, j)])
      dome.tri(A, Cc, D, undefined, undefined, undefined, [n(r0, z0, k), n(r1, z1, j), n(r1, z1, k)])
    }
  }
}
// the oculus ring and its flat glass skylight
cyl(dome, 4.3, 45.0, 45.4)
annulus(dome, 4.3, 3.5, 45.4)
annulus(roof, 3.5, 0.01, 45.4) // the oculus skylight, grey from every view

const lit = (p: V3) => (p[2] > REAR_TOP - 0.5 && Math.hypot(p[0] - C[0], p[1] - C[1]) < 20 ? 0.7 : 0)
await save('bos-mit-great-dome', 'MIT Building 10 and the Great Dome', [
  { part: stone, material: { ...finish('mit-limestone', 0xe3d5be), floodlight: (p) => lit(p) || (p[1] < -21 && p[2] < 21.2 ? 0.5 : 0) } },
  { part: dome, material: { ...finish('mit-dome', 0xdcd4c5), floodlight: lit } },
  { part: green, material: PALETTE.patina },
  { part: roof, material: PALETTE.roof },
  { part: win, material: PALETTE.window },
], { height: 45.4, anchor: [42.359683, -71.092015], bearing: 335.9 })
