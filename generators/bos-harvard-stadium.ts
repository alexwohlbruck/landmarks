/**
 * Harvard Stadium, Soldiers Field, Allston, Boston (1903, McKim, Mead &
 * White with Lewis J. Johnson and Ira N. Hollis) — original procedural
 * geometry, CC0-1.0.
 * bun generators/bos-harvard-stadium.ts
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * lowest ground. Bearing 36: the horseshoe's axis, the closed curve at -y
 * (south-west), the open end at +y (north-east, towards the Charles); the
 * press box is on the west arm (-x). Anchor = the centroid of OSM
 * way/29680202 (building=stadium), -71.1269368, 42.3665215.
 *
 * Identity (from the photos below):
 *  1. A pale reinforced-concrete horseshoe: two long straight arms and a
 *     semicircular end, open at the north-east.
 *  2. The colonnade (the peristyle) round the whole top: a row of plain
 *     Doric columns along the back of the stands under a flat roof.
 *  3. The outer wall: a continuous arcade of round-arched openings in two
 *     tiers under the colonnade's openings, in warm pale concrete.
 *  4. Grey concrete stands sloping down to a low wall round the field; the
 *     glass press box on the west arm.
 *
 * Plan: OSM way/29680202 as drawn. In the frame its arms run straight
 * along y (outer walls x -64.2 and 63.4, inner edges x -34.9 and 33.2,
 * within 0.5 m of a symmetric U about x -0.7) and the curve is close to two
 * semicircles about (-0.7, -19): the inner edge radius 33.5, the outer wall
 * 64.2. The arms end at y 93. The field and the open end are the map's.
 *
 * Heights: USGS 3DEP lidar MA_CentralEastern_1_2021 (2021), 1 m grid, read
 * in the frame. The field is at grade: 0.4–0.5 m above the grid's lowest
 * ground, the streets outside 0.6–1.0, so elevation 0 (no sunken bowl).
 * Measured: the field wall 3.0; the stands' top row 14.0, 20.5 m back from
 * the field wall; the colonnade's roof 21.2 (its cornice 22.3), 8.5 m deep;
 * the press box's roof 25.5 over x -64..-56, y 12..52. No bleachers stand
 * at the open end (the 2021 lidar and the Brian-R-Phillips photo; the
 * temporary steel stands there were removed in 2007).
 * Estimated from the photos (scaled from the lidar's 21.2 m wall): the
 * arcade's two tiers of arches (1.0–7.4 and 8.8–13.0), the colonnade's
 * openings and columns (about 4.2 m apart, 0.45 m radius).
 *
 * Night: the colonnade's ceiling and the field wall are not lit in a way the
 * model can show; the press box glows (window); the stadium is floodlit by
 * its field lights, so the inside faces carry a light _FLOODLIGHT.
 *
 * Photos (Wikimedia Commons, all EVIDENCE):
 *  - Harvard Stadium aerial axonometric.JPG, Nick Allen, CC BY-SA 4.0 (from
 *    the air, south-east: the arcade, the colonnade, the stands, the press
 *    box) https://commons.wikimedia.org/wiki/File:Harvard_Stadium_aerial_axonometric.JPG
 *  - Harvard Stadium in Allston, Boston.jpg, Kenneth C. Zirkel,
 *    CC BY-SA 4.0 (inside, from the curve towards the open end)
 *    https://commons.wikimedia.org/wiki/File:Harvard_Stadium_in_Allston,_Boston.jpg
 *  - Harvard Stadium, Cambridge, Boston.jpg, Brian-R-Phillips, CC BY-SA 4.0
 *    (from the open end: the curve and the press box)
 *    https://commons.wikimedia.org/wiki/File:Harvard_Stadium,_Cambridge,_Boston.jpg
 * No look-only sources. No commercial imagery.
 *
 * Doubts: the arches are drawn one a bay in each tier; the real arcade's
 * rhythm (and its pilasters and the small windows of the attic) is
 * simplified. The aisles and vomitories in the stands, the scoreboard and
 * the field lights are left out. The arm ends are drawn as plain walls.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { archShape, onWall, rectShape, revolve, type XY } from './atl-tech-tower'
import { box, save } from './atl-flatiron-building'

const conc = new Part(), stands = new Part(), roof = new Part(), shade = new Part(), glass = new Part()

const C: XY = [-0.7, -19], RI = 33.5, RO = 64.2, YEND = 93
const D = RO - RI // 30.7: inner edge to outer wall face
// the cross-section, by distance d from the field wall
const FW = 3.0, ST = 14.0, DS = 20.5, CF = 14.6, CR0 = 20.4, CR1 = 21.2, COL = 22.3, DW = D - 1.2

// stations along the U: from the west arm's end, round the curve, to the east arm's end
type Sta = { p: XY; n: XY } // a point on the inner edge and the outward normal
const sta: Sta[] = []
const ARM = 26
for (let k = 0; k <= ARM; k++) sta.push({ p: [C[0] - RI, YEND - ((YEND - C[1]) * k) / ARM], n: [-1, 0] })
const CURVE = 24
for (let k = 1; k < CURVE; k++) {
  const a = Math.PI + (k / CURVE) * Math.PI, n: XY = [Math.cos(a), Math.sin(a)]
  sta.push({ p: [C[0] + RI * n[0], C[1] + RI * n[1]], n })
}
for (let k = 0; k <= ARM; k++) sta.push({ p: [C[0] + RI, C[1] + ((YEND - C[1]) * k) / ARM], n: [1, 0] })

const at = (s: Sta, d: number, z: number): V3 => [s.p[0] + s.n[0] * d, s.p[1] + s.n[1] * d, z]
// the section's outline, inner to outer, as [d, z] pairs: field wall, stands, colonnade floor, roof
const SECTION: [number, number][] = [[0, 0], [0, FW], [DS, ST], [DS, CF], [DW - 0.6, CF], [DW - 0.6, CR0], [22.0, CR0], [22.0, CR1], [D + 0.3, CR1], [D + 0.3, CR0 + 0.2], [D, CR0 + 0.2], [D, 0]]
const partOf = (i: number) => (i <= 2 ? stands : i === 3 || i === 4 ? conc : i >= 5 && i <= 6 ? roof : i === 7 ? roof : conc)
for (let k = 0; k < sta.length - 1; k++) {
  const a = sta[k], b = sta[k + 1]
  for (let i = 0; i < SECTION.length - 1; i++) {
    const [d0, z0] = SECTION[i], [d1, z1] = SECTION[i + 1]
    // a strip between the two stations; wound to face up/inward per the section's direction
    partOf(i).quad(at(b, d0, z0), at(a, d0, z0), at(a, d1, z1), at(b, d1, z1))
  }
}
// the arm ends: close the section with a flat face
const endFace = (s: Sta, out: boolean) => {
  const pts = SECTION.map(([d, z]) => at(s, d, z))
  const q = out ? pts : [...pts].reverse()
  // fan from the outer foot; the section is simple but not convex, so split it in two convex-ish parts
  const P = (d: number, z: number) => at(s, d, z)
  const polys: V3[][] = [
    [P(0, 0), P(D, 0), P(D, CR0), P(DS, CR0), P(DS, ST), P(0, FW)],
    [P(DS, CR0), P(D, CR0), P(D + 0.3, CR1), P(22.0, CR1)],
  ]
  void q
  for (const poly of polys) {
    const r = out ? poly : [...poly].reverse()
    for (let i = 1; i < r.length - 1; i++) conc.tri(r[0], r[i], r[i + 1])
  }
}
endFace(sta[0], true)
endFace(sta[sta.length - 1], false)

// The outer arcade: one arch a bay in each tier, the colonnade's openings above.
for (let k = 0; k < sta.length - 1; k++) {
  const a = sta[k], b = sta[k + 1]
  const A = at(a, D, 0), B = at(b, D, 0)
  const wa: XY = [A[0], A[1]], wb: XY = [B[0], B[1]]
  // the wall's outside must be on the right of a→b: the stations run clockwise seen from above (west arm south, curve, east arm north)
  const L = Math.hypot(wb[0] - wa[0], wb[1] - wa[1])
  const n = Math.max(1, Math.round(L / 4.6)), w = L / n
  for (let j = 0; j < n; j++) {
    const s = w * (j + 0.5)
    onWall(shade, wa, wb, archShape(s, w * 0.58, 1.0, 7.4 - w * 0.29, 4), 0.06)
    onWall(shade, wa, wb, archShape(s, w * 0.42, 8.8, 13.0 - w * 0.21, 4), 0.06)
    onWall(shade, wa, wb, rectShape(s - w * 0.28, s + w * 0.28, 15.4, 18.6), 0.06)
  }
  onWall(roof, wa, wb, rectShape(0, L, 14.0, 14.5), 0.1) // the string course under the colonnade
  // the columns along the colonnade's inner edge
  const c = at(a, 22.6, CF)
  revolve(roof, [c[0], c[1]], [[0.5, CF], [0.45, CR0]], 6, 0, false, false)
}
{
  const c = at(sta[sta.length - 1], 22.6, CF)
  revolve(roof, [c[0], c[1]], [[0.5, CF], [0.45, CR0]], 6, 0, false, false)
}
// the shadowed back wall of the colonnade, seen between the columns
for (let k = 0; k < sta.length - 1; k++) {
  const a = sta[k], b = sta[k + 1]
  const A = at(a, DW - 0.65, 0), B = at(b, DW - 0.65, 0)
  onWall(shade, [B[0], B[1]], [A[0], A[1]], rectShape(0, Math.hypot(B[0] - A[0], B[1] - A[1]), CF + 0.3, CR0 - 0.3), 0.02)
}

// The vomitories: low concrete boxes in a row half-way up the stands, every other bay.
for (let k = 1; k < sta.length - 1; k += 2) {
  const s = sta[k], t: XY = [-s.n[1], s.n[0]], d = 10.5, z = FW + ((ST - FW) * d) / DS
  const P = (u: number, dd: number, zz: number): V3 => [s.p[0] + s.n[0] * dd + t[0] * u, s.p[1] + s.n[1] * dd + t[1] * u, zz]
  const zf = FW + ((ST - FW) * (d - 1.2)) / DS, zb = FW + ((ST - FW) * (d + 1.8)) / DS
  const top = z + 1.3
  // front (facing the field), sides, top
  conc.quad(P(0.8, d - 1.2, zf), P(-0.8, d - 1.2, zf), P(-0.8, d - 1.2, top), P(0.8, d - 1.2, top))
  shade.quad(P(0.55, d - 1.15, zf), P(-0.55, d - 1.15, zf), P(-0.55, d - 1.15, top - 0.35), P(0.55, d - 1.15, top - 0.35))
  conc.quad(P(-0.8, d - 1.2, top), P(-0.8, d + 1.8, top), P(0.8, d + 1.8, top), P(0.8, d - 1.2, top))
  for (const u of [-0.8, 0.8]) {
    const q = [P(u, d - 1.2, zf), P(u, d + 1.8, zb), P(u, d + 1.8, top), P(u, d - 1.2, top)]
    if (u < 0) conc.quad(q[0], q[3], q[2], q[1]); else conc.quad(q[0], q[1], q[2], q[3])
  }
}

// The press box on the west arm.
box(glass, C[0] - RI - 29.6, C[0] - RI - 22.0, 12, 52, CR1, 25.0, roof, 0.2)
box(roof, C[0] - RI - 29.9, C[0] - RI - 21.7, 11.7, 52.3, 25.0, 25.5, roof, 0.1)

const lit = (p: V3, n: V3) => {
  // the faces turned to the field (inward) catch the field lights
  const r = Math.hypot(p[0] - C[0], Math.max(0, C[1] - p[1]))
  const inward = p[1] > C[1] ? -Math.sign(p[0] - C[0]) * n[0] : -((p[0] - C[0]) * n[0] + (p[1] - C[1]) * n[1]) / (r || 1)
  return inward > 0.2 || n[2] > 0.5 ? 0.35 : 0
}
await save('bos-harvard-stadium', 'Harvard Stadium', [
  { part: conc, material: finish('stadium-concrete', 0xdcd0b6) },
  { part: stands, material: { ...finish('stadium-stands', 0xaaa79f), floodlight: lit } },
  { part: roof, material: finish('stadium-trim', 0xeee8dc) },
  { part: shade, material: finish('stadium-shadow', 0x6a655c) },
  { part: glass, material: PALETTE.window },
], { height: 25.5, anchor: [42.3665215, -71.1269368], bearing: 36 })
