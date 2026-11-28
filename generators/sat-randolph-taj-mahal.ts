/**
 * Randolph Field Administration Building ("the Taj Mahal"), Building 100,
 * Randolph Air Force Base: procedural, CC0-1.0.
 * bun generators/sat-randolph-taj-mahal.ts
 *
 * Map frame: x east, y north, z up, metres; bearing 0 (built in true
 * orientation; the building's axes run at bearings 60 and 150, so its
 * parts are turned 30 degrees). The origin is OSM's outline centroid
 * (way/531304130: -98.2826785, 29.5359527). y = 0 is the ground, flat
 * within a metre round the building (2018 lidar ground).
 *
 * Atlee B. and Robert M. Ayres, 1931: Spanish Colonial Revival, white
 * stucco under red tile roofs, two-storey wings round a central block
 * whose tower hides the base's 500,000-gallon water tank. The tower is an
 * octagonal shaft (a square with broad chamfers) and pierced grille
 * panels on each face, pinnacles at its parapet, an octagonal upper stage
 * with twin arched openings, and a dome of blue and gold tile in a
 * chevron pattern under a small finial.
 *
 * Published: 170 ft (OSM height tag; often quoted for the tower).
 * Measured (lidar TX_Hurricane_B4_2018, flown 2018; heights above y = 0;
 * the returns on the tower are sparse):
 * - the finial 45.2 m, the dome's crown 43.5 m, the dome's base and the
 *   upper stage's top 38.7 m (r 5), the shaft's parapet about 34 m with
 *   pinnacles to 36.6 m (r 6-8);
 * - the shaft about 16 m across, centred at (-2.4, 6.0);
 * - the central block round its foot 14.2 m with a step to 16 m;
 * - the wings: eaves about 8 m, tile roofs to about 12 m.
 * The lidar's 45 m and the published 170 ft (52 m) disagree; the lidar is
 * used, and 170 ft may count from a lower datum or to an old antenna.
 * From photos, checked against the lidar (Carol M. Highsmith's front view,
 * scaled on the shaft's 18 m between the block and the parapet): the
 * shaft 15.7 m wide, the upper stage 4.2 m tall, the dome 4 m; the
 * colours.
 * Estimated: the corner buttresses (1.8 m) and pinnacle spikes (to 38 m,
 * from the photos), the plan of the central block (24 m square, a step at 19 m),
 * the wings' roofs drawn as a tile band from every eave to a flat tiled
 * top (hips abstracted),  * the dome's chevrons (drawn as a gold band between blue tiers).
 * Drawn (after review): the tall pierced grille panel on every face of the
 * octagonal shaft (the photos show grilles on the diagonal faces too) as a
 * recess 0.4 m deep, up to 3.8 m wide, from 17.8 to 32.2 m, in a
 * shadow-grey stucco (the pierced pattern itself too fine to draw), framed
 * by the wall and pilasters at the eight corners; the pinnacles bolder,
 * stepped, one on each corner, their spikes to 39 m.
 * Left out: the arcades' detail, the entrance's arches (drawn as
 * window panels).
 *
 * OSM: way/531304130 (outline, no parts), replaced.
 *
 * Night: the tower is floodlit white; windows `window`.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 * - "Randolph Air Force Base - Taj Mahal Building.jpg", Carol M. Highsmith, public domain
 * - "Randolph-air-force-base-taj-mahal.jpg", Rich McFadden, public domain
 * - "Randolph AFB Taj.jpg", Travis K. Witt, CC BY-SA 4.0
 * - "Randolph Field - 1938 - Administration Building.jpg", US Army Air Corps, public domain
 * - "Randolph Field - Taj Mahal building with training aircraft.jpg", USAAF, public domain
 *
 * Doubts: the published height; the central block's plan; the dome's
 * pattern simplified.
 */
import { Part, cross, sub, writeGlb, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ring, walls, offset, outN, capPoly, bayPanels, box, type XY } from './sat-frost-tower'
import { bandTris } from './sf-de-young'

const stucco = new Part()
const tile = new Part()
const win = new Part()
const blue = new Part()
const gold = new Part()
const roofP = new Part()   // flat roofs and the grille panels' recess: one shadow-grey stucco
const shade = roofP

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function tf(p: Part, a: V3, b: V3, c: V3, n: V3) {
  if (dot(cross(sub(b, a), sub(c, a)), n) >= 0) p.tri(a, b, c)
  else p.tri(a, c, b)
}
const qf = (p: Part, a: V3, b: V3, c: V3, d: V3, n: V3) => { tf(p, a, b, c, n); tf(p, a, c, d, n) }

// OSM way/531304130, moved to the centroid
const OSM: XY[] = [[-16.8, 8.1], [-26.0, 2.9], [-26.2, 1.6], [-24.0, -2.3], [-24.4, -4.1], [-22.6, -7.1], [-20.6, -10.5], [-19.3, -10.8], [-16.5, -15.0], [-15.7, -15.3], [-6.2, -10.0], [-3.0, -15.8], [-2.1, -15.9], [3.9, -12.5], [16.8, -35.1], [17.8, -35.4], [21.8, -33.1], [22.1, -33.6], [31.2, -28.4], [30.9, -27.9], [34.7, -25.8], [35.0, -24.6], [22.0, -2.3], [28.0, 1.1], [28.0, 2.3], [24.9, 7.9], [34.4, 13.2], [34.5, 14.1], [32.0, 18.8], [32.3, 19.7], [29.9, 23.9], [28.5, 26.5], [27.5, 26.8], [24.7, 31.2], [23.6, 31.5], [14.1, 26.2], [11.0, 31.9], [10.0, 32.4], [4.4, 29.1], [4.2, 27.7], [-2.4, 23.9], [-6.6, 21.4], [-13.0, 17.7], [-14.5, 18.0], [-19.8, 15.0], [-20.1, 13.9]]
const PLAN = ring(OSM.map(([x, y]): XY => [x - 7.9, y - 1.4]))

// ------------------------------------------------------------- the wings ---
const EAVE = 8.0, TOP = 11.8, IN = 3.6
walls(stucco, PLAN, 0, EAVE)
bayPanels(win, PLAN, [[1.4, 3.6], [4.8, 7.0]], 1.3, 2.4, 3)
{
  const inner = offset(PLAN, -IN)
  for (let i = 0; i < PLAN.length; i++) {
    const j = (i + 1) % PLAN.length, n = outN(PLAN[i], PLAN[j])
    qf(tile, [PLAN[i][0], PLAN[i][1], EAVE], [PLAN[j][0], PLAN[j][1], EAVE], [inner[j][0], inner[j][1], TOP], [inner[i][0], inner[i][1], TOP], [n[0], n[1], 1.2])
  }
  for (const [a, b, c] of bandTris([inner])) tf(tile, [a[0], a[1], TOP], [b[0], b[1], TOP], [c[0], c[1], TOP], [0, 0, 1])
}

// ------------------------------------------------- the central block ---
const TX = -2.4, TY = 6.0, ROT = (30 * Math.PI) / 180
const sq = (h: number, cham = 0): XY[] => {
  const c = Math.cos(ROT), s = Math.sin(ROT), pts: XY[] = []
  const P = cham > 0
    ? [[h - cham, -h], [h, -h + cham], [h, h - cham], [h - cham, h], [-h + cham, h], [-h, h - cham], [-h, -h + cham], [-h + cham, -h]]
    : [[h, -h], [h, h], [-h, h], [-h, -h]]
  for (const [u, v] of P) pts.push([TX + u * c - v * s, TY + u * s + v * c])
  return ring(pts)
}
for (const [h, z0, z1] of [[12, 0, 14.2], [9.5, 14.2, 16.0]] as [number, number, number][]) {
  walls(stucco, sq(h), z0, z1)
  capPoly(roofP, sq(h), z1, true)
}
bayPanels(win, sq(12), [[1.4, 5.6], [7.2, 11.2]], 1.6, 2.2, 4)

// ------------------------------------------------------------ the tower ---
{
  // the shaft: chamfered square, tapering a little, 15.7 m to 14.6 m
  const S0 = sq(7.85, 3.3), S1 = sq(7.3, 3.05)
  // Each of the four main faces carries the tall pierced grille panel,
  // recessed 0.4 m behind the wall in a shadow-grey stucco, framed by the
  // wall either side; the chamfered corners are plain.
  const Z0 = 16.0, Z1 = 34.0, G0 = 17.8, G1 = 32.2, REC = 0.4
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8, n = outN(S0[i], S0[j]), N: V3 = [n[0], n[1], 0.03]
    // a point on face i: u along it (0..1), height z, depth d behind it
    const F = (u: number, z: number, d = 0): V3 => {
      const k = (z - Z0) / (Z1 - Z0)
      const a: XY = [S0[i][0] + (S1[i][0] - S0[i][0]) * k, S0[i][1] + (S1[i][1] - S0[i][1]) * k]
      const b: XY = [S0[j][0] + (S1[j][0] - S0[j][0]) * k, S0[j][1] + (S1[j][1] - S0[j][1]) * k]
      return [a[0] + (b[0] - a[0]) * u - n[0] * d, a[1] + (b[1] - a[1]) * u - n[1] * d, z]
    }
    const L = Math.hypot(S0[j][0] - S0[i][0], S0[j][1] - S0[i][1])
    const GW = Math.min(1.9, L * 0.3)
    const ua = 0.5 - GW / L, ub = 0.5 + GW / L
    qf(stucco, F(0, Z0), F(ua, Z0), F(ua, Z1), F(0, Z1), N)
    qf(stucco, F(ub, Z0), F(1, Z0), F(1, Z1), F(ub, Z1), N)
    qf(stucco, F(ua, Z0), F(ub, Z0), F(ub, G0), F(ua, G0), N)
    qf(stucco, F(ua, G1), F(ub, G1), F(ub, Z1), F(ua, Z1), N)
    // the recess: its back and four reveals
    qf(shade, F(ua, G0, REC), F(ub, G0, REC), F(ub, G1, REC), F(ua, G1, REC), N)
    const t: V3 = [S0[j][0] - S0[i][0], S0[j][1] - S0[i][1], 0]
    qf(stucco, F(ua, G0), F(ua, G0, REC), F(ua, G1, REC), F(ua, G1), t)
    qf(stucco, F(ub, G0, REC), F(ub, G0), F(ub, G1), F(ub, G1, REC), [-t[0], -t[1], 0])
    qf(stucco, F(ua, G0), F(ub, G0), F(ub, G0, REC), F(ua, G0, REC), [0, 0, 1])
    qf(stucco, F(ua, G1, REC), F(ub, G1, REC), F(ub, G1), F(ua, G1), [0, 0, -1])
  }
  // the parapet and its pinnacles at the corners
  walls(stucco, sq(7.5, 3.15), 34.0, 35.2)
  capPoly(roofP, sq(7.5, 3.15), 35.2, true)
  // pilasters up the eight corners of the octagonal shaft, each ending in
  // a stepped pinnacle with a spike (the lidar's 36.6 m returns at r 6-8)
  for (const c of sq(7.55, 3.15)) {
    const a = Math.atan2(c[1] - TY, c[0] - TX)
    box(stucco, c[0], c[1], 0.6, 0.6, 16.0, 34.6, a)
    box(stucco, c[0], c[1], 0.8, 0.8, 34.6, 35.6, a)
    box(stucco, c[0], c[1], 0.6, 0.6, 35.6, 36.8, a)
    const tip: V3 = [c[0], c[1], 39.0]
    const q = [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]].map(([u, v]): V3 => [c[0] + u * Math.cos(a) - v * Math.sin(a), c[1] + u * Math.sin(a) + v * Math.cos(a), 36.8])
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; tf(stucco, q[i], q[j], tip, [q[i][0] + q[j][0] - 2 * c[0], q[i][1] + q[j][1] - 2 * c[1], 0.5]) }
  }
  // the octagonal upper stage with twin arched openings
  const K = 8, R = 5.3, Ru = 4.9
  const oct = (r: number): XY[] => ring(Array.from({ length: K }, (_, k) => { const a = ROT + (2 * Math.PI * (k + 0.5)) / K; return [TX + r * Math.cos(a), TY + r * Math.sin(a)] as XY }))
  walls(stucco, oct(R), 35.2, 38.7)
  bayPanels(win, oct(R), [[36.0, 37.9]], 0.6, 0.3, 1.5)
  // the dome: a blue tile dome with a gold band, a finial
  const prof: [number, number, Part][] = [[Ru, 38.7, blue], [Ru * 1.0, 39.6, gold], [Ru * 0.95, 40.3, blue], [Ru * 0.78, 41.6, blue], [Ru * 0.48, 42.8, blue], [0.4, 43.5, blue]]
  const ringAt = (r: number, z: number): V3[] => Array.from({ length: 16 }, (_, k) => { const a = (2 * Math.PI * k) / 16; return [TX + r * Math.cos(a), TY + r * Math.sin(a), z] })
  for (let s = 0; s < prof.length - 1; s++) {
    const A = ringAt(prof[s][0], prof[s][1]), B = ringAt(prof[s + 1][0], prof[s + 1][1])
    for (let k = 0; k < 16; k++) {
      const k2 = (k + 1) % 16, m: V3 = [A[k][0] - TX, A[k][1] - TY, 1]
      qf(prof[s][2], A[k], A[k2], B[k2], B[k], m)
    }
  }
  capPoly(blue, ring(ringAt(0.4, 43.5).map((p): XY => [p[0], p[1]])), 43.5, true)
  box(gold, TX, TY, 0.18, 0.18, 43.4, 45.2)
}

// Colours from daylight photos, pulled to the palette's lightness.
const towerLit = (p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : p[2] > 15 ? 0.9 : 0.3)
const parts = [
  { part: stucco, material: { ...finish('taj-stucco', 0xf1ede6), floodlight: towerLit } },
  { part: tile, material: PALETTE.terracotta },
  { part: win, material: PALETTE.window },
  { part: blue, material: finish('taj-dome-blue', 0x5f78b8) },
  { part: gold, material: finish('taj-gold', 0xd9bc6c) },
  { part: roofP, material: finish('taj-shade', 0xc3c1bc) },
]
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 5000) throw new Error(`Triangle budget exceeded: ${triangles}`)
const glb = writeGlb('Randolph Field Administration Building', parts, {
  license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at ground anchor',
  bearing: 0, elevation: 0, height: 45.2, anchor: [29.5359527, -98.2826785], replaces: ['way/531304130'],
})
if (glb.length > 250_000) throw new Error(`Size budget exceeded: ${glb.length} bytes`)
const out = new URL('../models/sat-randolph-taj-mahal.glb', import.meta.url).pathname
await Bun.write(out, glb)
console.log(`${out}: ${triangles} triangles, ${glb.length} bytes`)
