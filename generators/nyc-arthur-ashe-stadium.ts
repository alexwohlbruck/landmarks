/**
 * Arthur Ashe Stadium (1997, roof 2016), USTA Billie Jean King National
 * Tennis Center, Queens. The octagonal bowl of blue seats on a red-brick base
 * with its pale raked underside, and the 2016 retractable roof: a white
 * fabric ring on a deep blue steel truss, carried on eight branching columns
 * standing outside the bowl, with its two vaulted panels parked open on
 * either side of the square opening. Original procedural geometry, CC0-1.0.
 * bun generators/nyc-arthur-ashe-stadium.ts
 *
 * Stadium rule (STYLE.md "Ground"): the court and the plazas are the map's;
 * the neighbouring courts and Louis Armstrong Stadium are not touched.
 *
 * Frame: BEARING 0, x east, y north, z up, metres. Origin = area centroid of
 * the OSM outline way/284859611 (-73.8470437, 40.7498907). z = 0 is the
 * ground round the stadium, 3.9 m NAVD88 (lidar ground returns); the court is
 * about 1 m above it, so this is not a sunken bowl and elevation is 0.
 *
 * Evidence
 * - OSM way/284859611 (building=stadium, "Arthur Ashe Stadium", height 17.6,
 *   capacity 23,771, Q609551). The outline is the roof's octagon: about 175 m
 *   across the corners and 160 m across the flats, its sides alternating long
 *   (80 m) and short (54 m), which matches the published 520 by 520 ft plan.
 *   OSM's height (17.6) is wrong; it is not used.
 * - USGS 3DEP lidar NY_NewYorkCity at 0.5 m (/tmp/city/nyc/work/
 *   nyc-arthur-ashe-stadium/lid.json). It shows the bowl but not the roof
 *   (only the old rim light poles), so it was flown before the roof went up.
 *   The bowl: the same octagon at 0.85 scale (rim radius 70-77 m), seats
 *   rising almost evenly from the court edge at radius 22-26 (z 3) to the rim
 *   (z 35), with a level ring at z 20 around radius 50.
 * - Published (Wikipedia; Architect Magazine, AECOM, ENR via web search):
 *   roof by Rossetti, structure WSP, completed 2016; an octagonal roof 520 by
 *   520 ft in plan with a 250 by 250 ft opening; two PTFE fabric panels on
 *   glides; a stand-alone superstructure on eight columns round the stadium,
 *   rising 150 ft (46 m) above the ground.
 * - Photos (Wikimedia Commons, credits in /tmp/city/nyc/work/
 *   nyc-arthur-ashe-stadium/photos/credits.txt): "Arthur Ashe Stadium, July 7,
 *   2018.jpg" (D. Benjamin Miller, CC0: the roof open, the two vaulted panels
 *   parked either side, the blue truss and inclined columns, the brick base);
 *   "Arthur Ashe Stadium with retractible roof.jpg" (Richiekim, CC BY-SA 4.0);
 *   "Flushing Meadows (43370810850).jpg", "Arthur Ashe Stadium with the roof
 *   closed (32938595438).jpg", "Arthur Ashe roof (39934812963).jpg", "Roof
 *   closing (46174774644).jpg" (Carine06, CC BY-SA 2.0: the columns, the
 *   truss from below, the blue seats); "Arthur Ashe Stadium Exterior.jpg"
 *   (Alexisrael, CC BY-SA 3.0, the brick entrance front); "Arthur Ashe
 *   Stadium in 2018.jpg" (Whoisjohngalt, CC BY-SA 4.0). USGS NAIP (roof
 *   closed) for the panels' size and the direction they slide: along the axis
 *   square to the long sides facing north-east and south-west.
 *
 * Estimated from the photos: the truss band's depth (38.5-45 m) and the fabric
 * ring's rise to the opening (51.5 m); the panels' vault (crown 59.6 m); the
 * columns as eight trunks at the octagon's corners branching into two legs;
 * the brick base's height (15 m) and the pale underside above it. Signs and
 * lettering are left out.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { type XY, add2, sub2, nrm2, len2, v3, rayHit, sweep, beam, panel, save } from './nyc-yankee-stadium'

const brick = new Part(), stone = new Part(), seats = new Part(), steel = new Part(), fabric = new Part(), win = new Part()
const D2R = Math.PI / 180

// The roof octagon (OSM way/284859611, its eight corners), counter-clockwise.
const OCT: XY[] = [[87.5, -3.8], [55.6, 67.5], [4.1, 87.4], [-67.7, 55.7], [-87.3, 5.0], [-55.6, -67.8], [-4.6, -87.8], [67.7, -55.7]]
const angOf = (p: XY) => Math.atan2(p[1], p[0]) / D2R
const dir = (d: number): XY => [Math.cos(d * D2R), Math.sin(d * D2R)]
const octR = (d: number) => rayHit([0, 0], dir(d), OCT)!

// The opening: a 76 m square with sides square to the long sides facing
// 24 degrees (north-east) and 114 degrees.
const U: XY = dir(24), V: XY = dir(114), HALF = 38
const SQ: XY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => add2(add2([0, 0], U, a * HALF), V, b * HALF))
const sqR = (d: number) => rayHit([0, 0], dir(d), SQ)!

// Stations round the centre: every corner of the octagon and of the square,
// and enough between to keep the bowl's rings smooth.
const ANG: number[] = [...OCT.map(angOf), ...SQ.map(angOf)]
for (let d = -180; d < 180; d += 15) ANG.push(d)
ANG.sort((a, b) => a - b)
const uniq = ANG.filter((d, i) => i === 0 || d - ANG[i - 1] > 0.5)

// ---------------------------------------------------------------------------
// The bowl: rings of the roof's octagon at a scale, (scale, z) inside out.
{
  const at = (d: number, s: number): XY => { const r = octR(d) * s, u = dir(d); return [u[0] * r, u[1] * r] }
  const P: [number, number][] = [
    [0.28, 0], [0.28, 2], // court wall
    [0.56, 19.2], // lower bowl
    [0.585, 19.2], [0.585, 21.5], // the suites ring and its glass
    [0.6, 21.5], [0.85, 35], // upper bowl
    [0.875, 35.6], // rim
    [0.8, 15], // the raked underside, out over the base
    [0.8, 0], // the brick base
  ]
  const st = [...uniq, uniq[0] + 360].map((d) => P.map(([s, z]) => v3(at(d, s), z)))
  const mats = [seats, seats, stone, win, stone, seats, stone, stone, brick]
  sweep(st, (i) => mats[i])
  // window bands in the brick base, two to a side
  for (let i = 0; i < 8; i++) {
    const a = OCT[i], b = OCT[(i + 1) % 8]
    const A: XY = [a[0] * 0.8, a[1] * 0.8], B: XY = [b[0] * 0.8, b[1] * 0.8]
    const u = nrm2(sub2(B, A)), n: XY = [u[1], -u[0]], L = len2(sub2(B, A))
    for (const f of [0.28, 0.72]) {
      const c = add2(A, u, L * f), w = L * 0.3
      panel(win, add2(c, u, -w / 2), add2(c, u, w / 2), n, 9.5, 12.5)
      panel(win, add2(c, u, -w / 2), add2(c, u, w / 2), n, 3, 6)
    }
  }
}

// ---------------------------------------------------------------------------
// The fixed roof: a white fabric ring rising from the octagon's edge (46) to
// the opening (51.5), on a blue truss band (38.5-45) set in from the edge.
{
  const st = [...uniq, uniq[0] + 360].map((d) => {
    const ro = octR(d), ri = sqR(d), u = dir(d)
    const p = (r: number, z: number): V3 => [u[0] * r, u[1] * r, z]
    return [
      p(ri, 39), p(ri, 51.5), // the opening's edge
      p(ro, 46.4), // fabric
      p(ro, 44.6), // fascia
      p(ro - 3, 44.6), p(ro - 3, 38.5), // the truss band, set in
      p(ri + 6, 38.5), p(ri, 39), // its underside
    ]
  })
  sweep(st, (i) => [steel, fabric, fabric, steel, steel, steel, steel][i])
}

// The panels, parked open over the ring either side of the opening along U:
// each 40 m deep by 80 m wide, a shallow vault across its width.
{
  const SEG = 12, W = 40, RISE = 9, Z0 = 50.6
  for (const side of [-1, 1]) {
    const r0 = HALF + 0.5, r1 = 78
    const pt = (r: number, t: number): V3 => {
      const c = add2([0, 0], U, side * r), x = -W + (2 * W * t) / SEG
      const z = Z0 + RISE * (1 - (x / W) ** 2)
      return v3(add2(c, V, x), z)
    }
    // the vault: rows across the width, from the opening side to the outer side
    const rows = [r0, r1].map((r) => Array.from({ length: SEG + 1 }, (_, t) => pt(r, t)))
    for (let t = 0; t < SEG; t++) {
      const [a0, a1] = [rows[0][t], rows[0][t + 1]], [b0, b1] = [rows[1][t], rows[1][t + 1]]
      // face upward
      const n = (a1[0] - a0[0]) * (b0[1] - a0[1]) - (a1[1] - a0[1]) * (b0[0] - a0[0])
      if (n > 0) fabric.quad(a0, a1, b1, b0)
      else fabric.quad(a0, b0, b1, a1)
    }
    // the arched ends (fabric is double-sided)
    for (const r of [r0, r1]) {
      const c = v3(add2([0, 0], U, side * r), Z0 - 1.2)
      for (let t = 0; t < SEG; t++) fabric.tri(c, pt(r, t), pt(r, t + 1))
    }
  }
}

// ---------------------------------------------------------------------------
// The columns: a trunk outside each corner of the octagon, splitting into two
// legs that reach the truss along the sides either side of the corner.
for (let i = 0; i < 8; i++) {
  const c = OCT[i], d = angOf(c), u = dir(d), rc = len2(c)
  const foot: XY = [u[0] * (rc - 4), u[1] * (rc - 4)]
  const fork: V3 = v3([u[0] * (rc - 4.5), u[1] * (rc - 4.5)], 22)
  beam(steel, v3(foot, 0), fork, 1.8)
  for (const j of [(i + 7) % 8, (i + 1) % 8]) {
    const e = OCT[j], t = nrm2(sub2(e, c))
    const top = add2(c, t, 15), inward = nrm2([-top[0], -top[1]])
    beam(steel, fork, v3(add2(top, inward, 3.5), 38.7), 1.4)
    // a brace from the fork out to the band further along the side
    const far = add2(c, t, 27)
    beam(steel, fork, v3(add2(far, nrm2([-far[0], -far[1]]), 3.5), 38.7), 0.9)
  }
  beam(steel, fork, v3([u[0] * (rc - 6.5), u[1] * (rc - 6.5)], 38.7), 1.4) // the middle leg
}

await save('nyc-arthur-ashe-stadium', 'Arthur Ashe Stadium', [
  { part: brick, material: finish('ashe-brick', 0xb07462) },
  { part: stone, material: PALETTE.stone },
  { part: seats, material: finish('ashe-seat-blue', 0x5c78a3) },
  { part: steel, material: finish('ashe-steel', 0x52688c) },
  { part: fabric, material: { ...PALETTE.trim, doubleSided: true } },
  { part: win, material: PALETTE.window },
], {
  bearing: 0, elevation: 0, anchor: [40.7498907, -73.8470437], height: 60,
  replaces: ['way/284859611'],
})
