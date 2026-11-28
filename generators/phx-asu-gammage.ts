/**
 * ASU Gammage (Grady Gammage Memorial Auditorium), Tempe, Arizona (1964,
 * Frank Lloyd Wright; Taliesin Associated Architects) — original procedural
 * geometry, CC0-1.0.
 * bun generators/phx-asu-gammage.ts
 *
 * Map frame: x east, y north, z up, metres; origin on the ground at the
 * centroid of OSM way/30407398 (-111.9380346, 33.4162592). Bearing 0.
 *
 * What is drawn: the whole OSM outline way/30407398 (the round auditorium
 * and the round brick stage drum behind it to the north-east) plus the two
 * pedestrian bridges ("arms") and the short service bridge to the east,
 * which OSM doesn't map as buildings.
 *
 * Identity (from the photos below):
 *  1. The round drum ringed by slender columns carrying a deep pale fascia
 *     whose underside is a row of semicircular arches, each lined with a
 *     coral fan "shell".                        (m69, v7, w20154, w20186)
 *  2. The low saucer roof rising behind the fascia.        (m69, w20154)
 *  3. The tan stage house rising to the north-east, and the round red
 *     brick stage drum behind it with its small scalloped band.  (bmk, w20154)
 *  4. The two long arms reaching out from the colonnade to the parking,
 *     solid-sided ramps carrying copper hoop lamps with white globes.
 *                                                       (w20154, w20186)
 *  5. Desert-rose stucco, pale fascia, coral shells, red brick.
 *
 * Plan (measured): USGS 3DEP lidar AZ_MaricopaPinal_1_2020 (flown 2020),
 * 1 m grid, and OSM. The main circle's centre is (-3.7, -5.2) here; its
 * fascia edge is at r 36.5 (lidar rim at 36–37 in every direction, OSM
 * the same). The brick stage drum: centre (21.4, 19.5), r 21.5 (lidar rim
 * and OSM agree), drawn r 22 so it closes on the main ring. The stage
 * house: a rectangle with corners (7.6, 32), (30.6, 7), (14.6, -7),
 * (-8.4, 18) read from its parapet in the lidar. The fly tower: an 8 m
 * block in its north-east half (lidar). The arms: centre lines traced on the
 * lidar (raised 5–12 m bands) and NAIP; the east service bridge likewise.
 *
 * Heights (measured, lidar, above the surrounding ground 355.6 m): fascia
 * top 18.1; roof deck behind it 17.2; saucer roof 24.6 flat inside r 22,
 * curving down to the deck at r 27.5; stage house 23.8 with a parapet to
 * 24.8; fly block 26.0; brick drum roof 17.2, coping 18.1; arms' parapets
 * about 8 at the building, 3.5–4.5 at their outer ends; service bridge 7.6.
 *
 * Estimated (from the photos, scaled to the lidar fascia height): the arch
 * rhythm (36 bays to the full circle, so 6.4 m spans, read from the
 * column spacing in m69 against its 18 m height), arch springing 11.9 and
 * crown 15.1 (real semicircles of radius 3.2 m between columns); the lower
 * glass wall to 6.1, the balcony band 6.1–8.8, the recessed upper glazing;
 * the brick drum's base band and scallop band; arm widths (4.6 m), deck
 * thickness, post spacing and the five hoop lamps per arm. Wright's 50
 * columns are not counted one for one: 28 stand under the drawn arches.
 *
 * Photos (evidence, Wikimedia Commons):
 *  m69   "Tempe-Grady Gammage Memorial Auditorium-1950.JPG", Marine 69-71,
 *        CC BY-SA 4.0 — the colonnade from the south-west
 *        https://commons.wikimedia.org/wiki/File:Tempe-Grady_Gammage_Memorial_Auditorium-1950.JPG
 *  v7    "Grady Gammage Memorial Auditorium-1.jpg", Visitor7, CC BY-SA 3.0 —
 *        arches and shells close up
 *        https://commons.wikimedia.org/wiki/File:Grady_Gammage_Memorial_Auditorium-1.jpg
 *  w20154 "FLW Gammage Auditorium ASU Tempe AZ 20154.JPG", Wars, CC BY 2.5 —
 *        the south-east arm, stage house and brick drum
 *        https://commons.wikimedia.org/wiki/File:FLW_Gammage_Auditorium_ASU_Tempe_AZ_20154.JPG
 *  w20186 "FLW Gammage Auditorium ASU PHX AZ 20186.JPG", Wars, CC BY 2.5 —
 *        on an arm, the hoop lamps
 *        https://commons.wikimedia.org/wiki/File:FLW_Gammage_Auditorium_ASU_PHX_AZ_20186.JPG
 *  bmk   "2021 Arizona State University, Tempe Campus, Gammage Auditorium
 *        from northeast.jpg", Beyond My Ken, CC BY-SA 4.0 — the brick drum
 *        https://commons.wikimedia.org/wiki/File:2021_Arizona_State_University,_Tempe_Campus,_Gammage_Auditorium_from_northeast.jpg
 * USGS NAIP orthophoto (public domain) for the plan. No look-only sources.
 * No commercial imagery.
 *
 * Doubts: the exact arch count; the arms' landings (drawn as solid landing
 * blocks to the ground, as w20154 shows for the south-east arm; the
 * north-west arm's end is only seen from above); the service bridge's
 * form (seen only from above). Elevation 0. The ground round the drum is
 * flat (355.7 m) but the north-west arm lands 1.75 m lower (353.95 m), the
 * lowest ground under the model, so everything is drawn 1.7 m up from
 * y = 0 with its feet run down to y = 0 (see the end of the file); the
 * heights above are above the drum's own ground.
 *
 * Night: the glass walls and upper promenade glow (window), the arms' globes
 * are lamps, and the fascia is floodlit, as it is after dark.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import { ccw, prism, save, type XY } from './atl-flatiron-building'

/** A flat polygon (3 or 4 corners) wound to face `want`. */
function face(p: Part, q: V3[], want: V3) {
  const g = [(q[1][1] - q[0][1]) * (q[2][2] - q[0][2]) - (q[1][2] - q[0][2]) * (q[2][1] - q[0][1]), (q[1][2] - q[0][2]) * (q[2][0] - q[0][0]) - (q[1][0] - q[0][0]) * (q[2][2] - q[0][2]), (q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[2][0] - q[0][0])]
  const r = g[0] * want[0] + g[1] * want[1] + g[2] * want[2] < 0 ? [...q].reverse() : q
  if (r.length === 3) p.tri(r[0], r[1], r[2])
  else p.quad(r[0], r[1], r[2], r[3])
}

const stucco = new Part(), shell = new Part(), brick = new Part(), win = new Part(), copper = new Part(), lamp = new Part()

const D2R = Math.PI / 180
const C: XY = [-3.7, -5.2] // the main circle's centre
// a point at compass bearing b (degrees) and distance r from c
const pol = (c: XY, b: number, r: number): XY => [c[0] + r * Math.sin(b * D2R), c[1] + r * Math.cos(b * D2R)]
const nrm = (b: number, k = 1): V3 => [k * Math.sin(b * D2R), k * Math.cos(b * D2R), 0]

/** A curved vertical wall about c at radius r between bearings b0 < b1 (outward unless `inward`). */
function arcWall(p: Part, c: XY, r: number, b0: number, b1: number, z0: number, z1: number, seg: number, inward = false) {
  for (let i = 0; i < seg; i++) {
    const a = b0 + ((b1 - b0) * i) / seg, b = b0 + ((b1 - b0) * (i + 1)) / seg
    const pa = pol(c, a, r), pb = pol(c, b, r)
    const A: V3 = [pa[0], pa[1], z0], B: V3 = [pb[0], pb[1], z0], Cc: V3 = [pb[0], pb[1], z1], Dd: V3 = [pa[0], pa[1], z1]
    const k = inward ? -1 : 1
    p.tri(A, B, Cc, undefined, undefined, undefined, [nrm(a, k), nrm(b, k), nrm(b, k)])
    p.tri(A, Cc, Dd, undefined, undefined, undefined, [nrm(a, k), nrm(b, k), nrm(a, k)])
  }
}
/** A flat annulus about c between radii r0 < r1 at height z, facing up or down. */
function annulus(p: Part, c: XY, r0: number, r1: number, b0: number, b1: number, z: number, seg: number, up = true) {
  for (let i = 0; i < seg; i++) {
    const a = b0 + ((b1 - b0) * i) / seg, b = b0 + ((b1 - b0) * (i + 1)) / seg
    const q = [pol(c, a, r0), pol(c, b, r0), pol(c, b, r1), pol(c, a, r1)].map(([x, y]) => [x, y, z] as V3)
    face(p, r0 < 1e-6 ? [q[0], q[2], q[3]] : q, [0, 0, up ? 1 : -1])
  }
}
/** A smooth revolved profile [r, z] about c, bottom to top, over bearings b0..b1. */
function revolveArc(p: Part, c: XY, prof: [number, number][], b0: number, b1: number, seg: number) {
  for (let k = 0; k < prof.length - 1; k++) {
    const [r0, z0] = prof[k], [r1, z1] = prof[k + 1]
    const nr = z1 - z0, nz = r0 - r1, l = Math.hypot(nr, nz)
    for (let i = 0; i < seg; i++) {
      const a = b0 + ((b1 - b0) * i) / seg, b = b0 + ((b1 - b0) * (i + 1)) / seg
      const P = (r: number, z: number, t: number): V3 => { const q = pol(c, t, r); return [q[0], q[1], z] }
      const N = (t: number): V3 => [(nr / l) * Math.sin(t * D2R), (nr / l) * Math.cos(t * D2R), nz / l]
      const A = P(r0, z0, a), B = P(r0, z0, b), Cc = P(r1, z1, b), Dd = P(r1, z1, a)
      if (r0 > 1e-6) p.tri(A, B, Cc, undefined, undefined, undefined, [N(a), N(b), N(b)])
      if (r1 > 1e-6) p.tri(A, Cc, Dd, undefined, undefined, undefined, [N(a), N(b), N(a)])
    }
  }
}
/** A flat radial end face of an arc band at bearing b, from r0 to r1 and z0 to z1, facing towards decreasing (side -1) or increasing (+1) bearing. */
function radialFace(p: Part, c: XY, b: number, r0: number, r1: number, z0: number, z1: number, side: number) {
  const a = pol(c, b, r0), o = pol(c, b, r1)
  face(p, [[a[0], a[1], z0], [o[0], o[1], z0], [o[0], o[1], z1], [a[0], a[1], z1]], [side * Math.cos(b * D2R), -side * Math.sin(b * D2R), 0])
}

// ── the colonnade, its fascia and the drum behind ──
const R = 36.5, T = 2.6 // fascia's outer radius and depth
const TOP = 18.1, DECK = 17.2, CROWN = 15.1
const BAY = 10 // degrees per bay (36 to the full circle: 6.4 m spans)
const AXIS = 45.5 // the building's axis, main centre to the stage drum
const B0 = AXIS + 45, B1 = AXIS + 315 // the colonnade's ends (bearings), column on each
const SPAN = (R * BAY * D2R) / 2 // arch radius, 3.19 m
const SPRING = CROWN - SPAN
const ARCH = 8 // segments per arch

for (let b = B0; b < B1 - 1e-6; b += BAY) {
  // one arch from bearing b to b + BAY: bottom edge z(s) on a semicircle
  const pts = Array.from({ length: ARCH + 1 }, (_, i) => {
    const s = i / ARCH, u = 2 * s - 1
    return { t: b + BAY * s, z: SPRING + SPAN * Math.sqrt(Math.max(0, 1 - u * u)) }
  })
  for (let i = 0; i < ARCH; i++) {
    const a = pts[i], c = pts[i + 1]
    const oa = pol(C, a.t, R), oc = pol(C, c.t, R), ia = pol(C, a.t, R - T), ic = pol(C, c.t, R - T)
    // outer face (stucco), from the arch edge to the top
    stucco.tri([oa[0], oa[1], a.z], [oc[0], oc[1], c.z], [oc[0], oc[1], TOP - 0.3], undefined, undefined, undefined, [nrm(a.t), nrm(c.t), nrm(c.t)])
    stucco.tri([oa[0], oa[1], a.z], [oc[0], oc[1], TOP - 0.3], [oa[0], oa[1], TOP - 0.3], undefined, undefined, undefined, [nrm(a.t), nrm(c.t), nrm(a.t)])
    // the shell: the arch's soffit running back into the fascia
    // the shell: a fan from the arch's edge back and down into the bay, so it
    // fills the head of each arch as the coral shells do (v7, m69)
    const mt = (a.t + c.t) / 2, back = SPRING + 0.4
    face(shell, [[oa[0], oa[1], a.z], [ia[0], ia[1], back], [ic[0], ic[1], back], [oc[0], oc[1], c.z]], [Math.sin(mt * D2R), Math.cos(mt * D2R), -0.6])
  }
  // the column under the cusp
  const cp = pol(C, b, R - 0.45)
  const ring: XY[] = Array.from({ length: 6 }, (_, k) => [cp[0] + 0.36 * Math.cos((k / 6) * 2 * Math.PI), cp[1] + 0.36 * Math.sin((k / 6) * 2 * Math.PI)])
  for (let k = 0; k < 6; k++) {
    const p0 = ring[k], p1 = ring[(k + 1) % 6], n0: V3 = [p0[0] - cp[0], p0[1] - cp[1], 0], n1: V3 = [p1[0] - cp[0], p1[1] - cp[1], 0]
    stucco.tri([p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], SPRING], undefined, undefined, undefined, [n0, n1, n1])
    stucco.tri([p0[0], p0[1], 0], [p1[0], p1[1], SPRING], [p0[0], p0[1], SPRING], undefined, undefined, undefined, [n0, n1, n0])
  }
}
const cp = pol(C, B1, R - 0.45)
for (let k = 0; k < 6; k++) {
  const ring = (j: number): XY => [cp[0] + 0.36 * Math.cos((j / 6) * 2 * Math.PI), cp[1] + 0.36 * Math.sin((j / 6) * 2 * Math.PI)]
  const p0 = ring(k), p1 = ring(k + 1)
  face(stucco, [[p0[0], p0[1], 0], [p1[0], p1[1], 0], [p1[0], p1[1], SPRING], [p0[0], p0[1], SPRING]], [(p0[0] + p1[0]) / 2 - cp[0], (p0[1] + p1[1]) / 2 - cp[1], 0])
}
const NSEG = 45 // segments over the colonnade's 270 degrees
// the fascia's rounded top edge, its inner parapet face and the roof deck
revolveArc(stucco, C, [[R, TOP - 0.3], [R - 0.3, TOP]], B0, B1, NSEG)
annulus(stucco, C, R - 0.7, R - 0.3, B0, B1, TOP, NSEG)
arcWall(stucco, C, R - 0.7, B0, B1, DECK, TOP, NSEG, true)
annulus(stucco, C, 27.4, R - 0.7, B0, B1, DECK, NSEG)
// behind the stage drum the main drum closes with a plain wall and the deck
annulus(stucco, C, 27.4, R - 0.5, B1, B0 + 360, DECK, 15)
arcWall(stucco, C, R - 0.5, B1, B0 + 360, 0, TOP - 0.2, 15)
annulus(stucco, C, R - 1, R - 0.5, B1, B0 + 360, TOP - 0.2, 15)
// the soffit over the promenade, behind the fascia
annulus(shell, C, 29, R - T, B0, B1, CROWN + 0.6, NSEG, false)
// the drum: lower glass wall, balcony band, recessed upper glazing
arcWall(win, C, 30, B0, B1, 0, 6.1, NSEG)
arcWall(stucco, C, 31.2, B0, B1, 6.1, 8.8, NSEG)
annulus(stucco, C, 30, 31.2, B0, B1, 6.1, NSEG, false)
annulus(stucco, C, 29, 31.2, B0, B1, 8.8, NSEG)
arcWall(win, C, 29, B0, B1, 8.8, CROWN + 0.6, NSEG)
// end faces where the colonnade meets the stage drum
for (const [b, s] of [[B0, -1], [B1, 1]] as const) {
  radialFace(stucco, C, b, 29, R, CROWN + 0.6, TOP, s)
  radialFace(stucco, C, b, 29, 31.2, 0, CROWN + 0.6, s)
}
// the saucer roof
revolveArc(stucco, C, [[27.4, DECK], [26.2, 20.4], [24.5, 22.7], [22, 24.2], [18, 24.6], [0, 24.6]], 0, 360, 32)

// ── the stage house, fly block and brick stage drum ──
const SD: XY = [21.4, 19.5], SR = 22
const stage: XY[] = ccw([[14.6, -7], [30.6, 7], [7.6, 32], [-8.4, 18]])
prism(stucco, stage, 14, 24.8, stucco, 0.4)
const ax = Math.atan2(16, 14) // the stage house's long side direction (east-north-east)
const fc: XY = [20.6, 17.5], u: XY = [Math.cos(ax), Math.sin(ax)], v: XY = [-Math.sin(ax), Math.cos(ax)]
const fly: XY[] = ccw([[-4, -4], [4, -4], [4, 4], [-4, 4]].map(([a, b]) => [fc[0] + a * u[0] + b * v[0], fc[1] + a * u[1] + b * v[1]] as XY))
prism(stucco, fly, 24, 26, stucco, 0.3)
// the drum: a pink base, brick, a scalloped band of small round-headed
// windows, brick, and a pink coping; only the arc outside the main drum
const DB0 = AXIS - 128, DB1 = AXIS + 128, DSEG = 36
arcWall(stucco, SD, SR, DB0, DB1, 0, 3, DSEG)
arcWall(brick, SD, SR, DB0, DB1, 3, 5.0, DSEG)
arcWall(stucco, SD, SR, DB0, DB1, 5.0, 6.3, DSEG)
arcWall(brick, SD, SR, DB0, DB1, 6.3, 17.3, DSEG)
revolveArc(stucco, SD, [[SR, 17.3], [SR + 0.15, 17.4], [SR + 0.15, 17.8], [SR - 0.2, 18.1]], DB0, DB1, DSEG)
annulus(stucco, SD, SR - 0.6, SR - 0.2, DB0, DB1, 18.1, DSEG)
arcWall(stucco, SD, SR - 0.6, DB0, DB1, DECK, 18.1, DSEG, true)
annulus(stucco, SD, 0, SR - 0.6, DB0, DB1, DECK, DSEG)
for (const [b, s] of [[DB0, -1], [DB1, 1]] as const) radialFace(brick, SD, b, 0, SR, 0, 18.1, s)
// the scallop band's windows: small round-headed openings, coral scallops over them
for (let i = 0; i < 40; i++) {
  const b = DB0 + 3 + ((DB1 - DB0 - 6) * (i + 0.5)) / 40
  const w = 0.55, pts: [number, number][] = [[-w, 5.2], [w, 5.2]]
  for (let k = 0; k <= 6; k++) pts.push([w * Math.cos((k / 6) * Math.PI), 5.65 + w * 0.8 * Math.sin((k / 6) * Math.PI)])
  const t = b * D2R, o = pol(SD, b, SR + 0.04), tt: XY = [Math.cos(t), -Math.sin(t)]
  const P = ([s, z]: [number, number]): V3 => [o[0] + tt[0] * s, o[1] + tt[1] * s, z]
  for (let k = 1; k < pts.length - 1; k++) face(win, [P(pts[0]), P(pts[k + 1]), P(pts[k])], nrm(b))
}
// the doors at the foot of the drum, north-east (bmk)
{
  const b = AXIS, o = pol(SD, b, SR + 0.05), t = b * D2R, tt: XY = [Math.cos(t), -Math.sin(t)]
  const P = (s: number, z: number): V3 => [o[0] + tt[0] * s, o[1] + tt[1] * s, z]
  face(win, [P(2.4, 0), P(-2.4, 0), P(-2.4, 2.8), P(2.4, 2.8)], nrm(b))
}

// ── the arms and the service bridge ──
type P3 = [number, number, number] // x, y, deck height
const W = 4.6, PAR = 1.1, UNDER = 1.5
function arm(path: P3[], landing: boolean) {
  // the cross-section, a U: [lateral, vertical above the deck]
  const sec: [number, number][] = [[-W / 2, -UNDER], [W / 2, -UNDER], [W / 2, PAR], [W / 2 - 0.35, PAR], [W / 2 - 0.35, 0], [-W / 2 + 0.35, 0], [-W / 2 + 0.35, PAR], [-W / 2, PAR]]
  const frames = path.map((p, i) => {
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    return { p, side: [dy / l, -dx / l] as XY } // to the right of travel
  })
  const at = (f: (typeof frames)[0], [s, h]: [number, number]): V3 => [f.p[0] + f.side[0] * s, f.p[1] + f.side[1] * s, f.p[2] + h]
  for (let i = 0; i < frames.length - 1; i++) {
    for (let k = 0; k < sec.length; k++) {
      const s0 = sec[k], s1 = sec[(k + 1) % sec.length]
      const nl = s1[1] - s0[1], nv = -(s1[0] - s0[0]), f = frames[i]
      face(stucco, [at(frames[i], s0), at(frames[i], s1), at(frames[i + 1], s1), at(frames[i + 1], s0)], [f.side[0] * nl, f.side[1] * nl, nv])
    }
  }
  // end caps, the U split into three quads
  const capQ: [number, number, number, number][] = [[0, 1, 4, 5], [1, 2, 3, 4], [5, 6, 7, 0]]
  for (const [f, flip] of [[frames[0], true], [frames[frames.length - 1], false]] as const) {
    for (const q of capQ) {
      const dir: XY = [-f.side[1], f.side[0]]
      face(stucco, q.map((k) => at(f, sec[k])), [dir[0] * (flip ? -1 : 1), dir[1] * (flip ? -1 : 1), 0])
    }
  }
  // posts under the deck, and hoop lamps on the walk
  let run = 0
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i], L = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let s = (10 - (run % 10)) % 10; s < L; s += 10) {
      const t = s / L, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t
      if (run + s > 4 && z - UNDER > 1.5) prism(copper, [[x - 0.3, y - 0.3], [x + 0.3, y - 0.3], [x + 0.3, y + 0.3], [x - 0.3, y + 0.3]], 0, z - UNDER, null, 0)
      if (run + s > 4 && run + s < 60) hoop(x, y, z, Math.atan2(b[1] - a[1], b[0] - a[0]))
    }
    run += L
  }
  if (landing) {
    const e = path[path.length - 1], f = frames[frames.length - 1], d: XY = [-f.side[1], f.side[0]]
    const c = (s: number, q: number): XY => [e[0] + f.side[0] * s + d[0] * q, e[1] + f.side[1] * s + d[1] * q]
    prism(stucco, ccw([c(-W / 2 - 0.4, -1), c(W / 2 + 0.4, -1), c(W / 2 + 0.4, 4.5), c(-W / 2 - 0.4, 4.5)]), 0, e[2] + PAR, stucco, 0.25)
  }
}
// a copper hoop on a post with a white globe in it, in the plane of travel
function hoop(x: number, y: number, z: number, dir: number) {
  const d: XY = [Math.cos(dir), Math.sin(dir)], n: XY = [-d[1], d[0]]
  prism(copper, [[x - 0.13, y - 0.13], [x + 0.13, y - 0.13], [x + 0.13, y + 0.13], [x - 0.13, y + 0.13]], z, z + 3.3, null, 0)
  const cz = z + 4.2, r = 0.95, m = 8, h = 0.11
  const P = (a: number, rr: number, o: number): V3 => [x + d[0] * rr * Math.cos(a) + n[0] * o, y + d[1] * rr * Math.cos(a) + n[1] * o, cz + rr * Math.sin(a)]
  for (let i = 0; i < m; i++) {
    const a0 = -Math.PI / 2 + (i / m) * 2 * Math.PI, a1 = -Math.PI / 2 + ((i + 1) / m) * 2 * Math.PI
    // outer, inner and the two flat sides of a square tube
    const am = (a0 + a1) / 2, out: V3 = [d[0] * Math.cos(am), d[1] * Math.cos(am), Math.sin(am)]
    face(copper, [P(a0, r + h, -h), P(a0, r + h, h), P(a1, r + h, h), P(a1, r + h, -h)], out)
    face(copper, [P(a1, r - h, -h), P(a1, r - h, h), P(a0, r - h, h), P(a0, r - h, -h)], [-out[0], -out[1], -out[2]])
    face(copper, [P(a0, r - h, h), P(a1, r - h, h), P(a1, r + h, h), P(a0, r + h, h)], [n[0], n[1], 0])
    face(copper, [P(a1, r - h, -h), P(a0, r - h, -h), P(a0, r + h, -h), P(a1, r + h, -h)], [-n[0], -n[1], 0])
  }
  // the globe: a small faceted ball
  const g = 0.5, rows = 3, cols = 6
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const t0 = -Math.PI / 2 + (i / rows) * Math.PI, t1 = -Math.PI / 2 + ((i + 1) / rows) * Math.PI
    const p0 = (j / cols) * 2 * Math.PI, p1 = ((j + 1) / cols) * 2 * Math.PI
    const Q = (t: number, p: number): V3 => [x + g * Math.cos(t) * Math.cos(p), y + g * Math.cos(t) * Math.sin(p), cz + g * Math.sin(t)]
    const w = Q((t0 + t1) / 2, (p0 + p1) / 2), o: V3 = [w[0] - x, w[1] - y, w[2] - cz]
    if (i > 0) face(lamp, [Q(t0, p0), Q(t0, p1), Q(t1, p1)], o)
    if (i < rows - 1) face(lamp, [Q(t0, p0), Q(t1, p1), Q(t1, p0)], o)
  }
}
const nwStart = pol(C, 331, 30.6), seStart = pol(C, 128, 30.6)
arm([[nwStart[0], nwStart[1], 7.6], [-25.4, 35, 7.1], [-32.4, 45, 6.2], [-37.4, 53, 5.3], [-40.4, 60, 4.4], [-41.6, 66, 3.5], [-43.4, 72, 2.6], [-45.2, 79, 1.8]], true)
arm([[seStart[0], seStart[1], 7.6], [25.6, -28, 7.2], [34.6, -32, 6.5], [44.6, -36, 5.8], [54.6, -39, 5.0], [64.6, -42, 4.0], [74.6, -44, 3.1]], true)
// the east service bridge, a plain stucco block (seen only from above)
{
  const a: XY = [33.5, -1], b: XY = [52.6, -17], L = Math.hypot(b[0] - a[0], b[1] - a[1]), t: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], s: XY = [t[1] * 1.75, -t[0] * 1.75]
  prism(stucco, ccw([[a[0] - s[0], a[1] - s[1]], [b[0] - s[0], b[1] - s[1]], [b[0] + s[0], b[1] + s[1]], [a[0] + s[0], a[1] + s[1]]]), 0, 7.6, stucco, 0.25)
}

// The building stands 1.7 m above the lowest ground under the model (the
// north-west arm's landing, lidar 353.95 m against 355.7 m round the drum):
// everything is drawn above its own ground, then raised by 1.7 m with the
// feet left at y = 0, so the walls run down into the ground.
const G = 1.7
for (const p of [stucco, shell, brick, win, copper, lamp]) for (let i = 1; i < p.pos.length; i += 3) if (p.pos[i] > 1e-6) p.pos[i] += G

await save('phx-asu-gammage', 'ASU Gammage', [
  { part: stucco, material: { ...finish('gammage-stucco', 0xf0c6b2), floodlight: (p, n) => (n[2] < 0.5 && p[2] > 11 ? 0.8 : n[2] < 0.5 ? 0.35 : 0) } },
  { part: shell, material: { ...finish('gammage-shell', 0xdc9a83), floodlight: () => 0.7 } },
  { part: brick, material: finish('gammage-brick', 0xb56a52) },
  { part: win, material: { ...PALETTE.window, color: 0x7d93a5 } },
  { part: copper, material: finish('gammage-copper', 0xb0714a) },
  { part: lamp, material: { name: 'lamp', color: 0xf2eee6, roughness: 0.5 } },
], { height: 27.7, anchor: [33.4162592, -111.9380346], bearing: 0 }, 6500)
