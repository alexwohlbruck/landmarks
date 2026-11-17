/**
 * Muiderpoort, Alexanderplein, Amsterdam: original procedural geometry,
 * CC0-1.0.
 * bun generators/amsterdam-muiderpoort.ts
 *
 * The last of the city's seventeenth/eighteenth-century land gates, built
 * 1770-71 to Cornelis Rauws's design: a sandstone gatehouse with a
 * round-arched passage, a portico of paired banded Doric columns under a
 * sculpted pediment on the field side (pilasters on the city side), brick
 * wings, a raised attic with a balustrade, and an octagonal slate dome with
 * lead ribs carrying a clock lantern, a little dome and a vane.
 *
 * Map frame: x east, y north, z up, metres; origin at the anchor on the
 * ground. Anchor = area centroid of the OSM outline way/45038672,
 * 52.363727, 4.919481. Bearing 56.8: the gate's front walls run at 146.8
 * degrees, so here the passage runs along x, the field side (towards the
 * Singelgracht) faces +x (146.8 degrees) and the city side faces -x.
 *
 * Identity, in order: the dome with its white ribs and the clock lantern
 * on top; the pediment over the paired columns and the arch; the pale
 * stone centre between the dark brick wings.
 *
 * Evidence:
 *  - plan: OSM outline way/45038672 read in the turned frame: the stone
 *    centre x -7.7..8.3 over y -7.0..7.0 with the column pedestals standing
 *    out to x 9.3 (field side) and -8.3 (city side) at y 2.5..7.0 each side
 *    of the passage; the wings x -7.4..5.8, y 7.3..12.2 and -12.2..-7.3.
 *  - height: OSM height 28.2 m (3DBAG, from AHN lidar), used as the top of
 *    the vane.
 *  - elevations estimated from Guilhem Vellut's level photo of the field
 *    side (28.9 px/m on the 24.4 m front): pedestals to 1.3 m, columns to
 *    8.1, entablature to 10.4, pediment apex 13.0, wing cornices 9.9,
 *    attic with its balustrade to 14.8, dome 15.0-18.9 (8.1 m across),
 *    lantern 18.9-22.7 (3.3 m across), its little dome to 24.6, spire and
 *    vane to 28.2. Arch 3.3 m wide, springing at 6.4 m. Columns at
 *    +-3.5 and +-6.4 m from the axis.
 *  - colours from the daylight photos: pale grey-buff sandstone, dark
 *    purple-brown brick wings, dark slate dome with pale lead ribs, a lead
 *    lantern dome, gilt dials and vane.
 *  - night: floodlit (the stone centre and the dome).
 *  - elevation 0 (flat, about 0 m NAP). No lidar read directly.
 *
 * Photos (Wikimedia Commons, all evidence):
 *  - Muiderpoort_@_Amsterdam_(17278319481).jpg and (17277017432).jpg
 *    (Guilhem Vellut, CC BY 2.0): the field side, level, 2015.
 *  - Muiderpoort_2019_(2).jpg (Ceescamel, CC BY-SA 4.0): the pediment,
 *    attic, dome and lantern from below.
 *  - Muiderpoort,_veldzijde_-_Amsterdam_-_20292267_-_RCE.jpg (Gerard
 *    Dukker, Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0): the
 *    field-side portico, the arch and the passage.
 *  - De_Muiderpoort,_gezien_vanuirt_het_zuiden_-_Amsterdam_-_20292265_-_RCE.jpg
 *    (Gerard Dukker, RCE, CC BY-SA 4.0): from the south.
 *  - Muiderpoort_from_NW.jpg (Spider, CC BY-SA 3.0): the city side.
 * No commercial imagery. No look-only sources.
 *
 * Left out: the triglyphs, garlands and niches, the balusters (a solid
 * balustrade), the sculpture's detail (drawn as a shield and two lion
 * masses), the clock hands, the lantern's louvres.
 *
 * Doubts: the attic's depth is not seen square-on in any photo; the city
 * side is drawn as the field side's mirror with pilasters for columns.
 */
import { Part, type V3 } from './mesh'
import { PALETTE, finish } from './palette'
import {
  arcade, ball, band, bbox, cap, dialOn, face, floodAll, gabled, lathe, ngonF, openStage, prism, rect, rectOn, save, segs, vane, walls,
  type XY,
} from './amsterdam-munttoren'

/** A banded (rusticated) column: a drum every `step` stands out. */
function bandedColumn(p: Part, x: number, y: number, z0: number, z1: number, r: number, step = 1.1, seg = 8) {
  const prof: XY[] = [[r * 1.25, z0], [r * 1.25, z0 + 0.35], [r, z0 + 0.4]]
  for (let z = z0 + 0.4 + step * 0.6; z < z1 - 0.9; z += step) prof.push([r, z], [r * 1.14, z + 0.04], [r * 1.14, z + step * 0.42], [r, z + step * 0.46])
  prof.push([r, z1 - 0.55], [r * 1.3, z1 - 0.35], [r * 1.3, z1], [0, z1])
  lathe(p, x, y, prof, seg, Math.PI / seg)
}

/** A square tube along a polyline (a rib), half-size r, outward side `out`. */
function rib(p: Part, pts: V3[], r: number) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]
    const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const h = Math.hypot(d[0], d[1]) || 1
    const side: V3 = [-d[1] / h * r, d[0] / h * r, 0]
    const l = Math.hypot(d[0], d[1], d[2])
    const up: V3 = [(-d[2] * d[0]) / (h * l) * r, (-d[2] * d[1]) / (h * l) * r, (h / l) * r]
    const c = (q: V3, s: number, u: number): V3 => [q[0] + side[0] * s + up[0] * u, q[1] + side[1] * s + up[1] * u, q[2] + side[2] * s + up[2] * u]
    const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    for (let k = 0; k < 4; k++) {
      const [s0, u0] = corners[k], [s1, u1] = corners[(k + 1) % 4]
      const n: V3 = [side[0] * (s0 + s1) + up[0] * (u0 + u1), side[1] * (s0 + s1) + up[1] * (u0 + u1), side[2] * (s0 + s1) + up[2] * (u0 + u1)]
      face(p, [c(a, s0, u0), c(a, s1, u1), c(b, s1, u1), c(b, s0, u0)], n)
    }
  }
}

function build() {
  const stone = new Part(), brick = new Part(), slate = new Part(), lead = new Part(), gold = new Part(), win = new Part()

  // ------------------------------------------------------------ wings
  const WE = 9.9
  for (const s of [1, -1]) {
    const y0 = s > 0 ? 7.0 : -12.2, y1 = s > 0 ? 12.2 : -7.0
    prism(brick, rect(-7.4, y0, 5.8, y1), 0, WE, false)
    cap(lead, rect(-7.4, y0, 5.8, y1), WE + 0.4)
    band(stone, rect(-7.4, y0, 5.8, y1), 0, 0.9, 0.06, 0.04, false, false)
    band(stone, rect(-7.4, y0, 5.8, y1), WE - 0.9, WE + 0.45, 0.28, 0.12, false)
    // stone quoins at the outer corners, as broad strips
    for (const [x, y] of [[5.8, s > 0 ? 12.2 : -12.2], [-7.4, s > 0 ? 12.2 : -12.2]] as XY[]) bbox(stone, null, x - 0.45, y - 0.45, x + 0.45, y + 0.45, 0, WE - 0.9, 0.05)
    // round windows in stone frames, on both fronts and the end
    const yc = s * 9.7
    for (const [a, b, c] of [[[5.8, y0], [5.8, y1], yc - y0], [[-7.4, y1], [-7.4, y0], y1 - yc]] as [XY, XY, number][]) {
      oculus(stone, win, a, b, c, 3.0, 0.85)
      oculus(stone, win, a, b, c, 7.0, 0.7)
    }
    {
      const a: XY = s > 0 ? [5.8, 12.2] : [-7.4, -12.2], b: XY = s > 0 ? [-7.4, 12.2] : [5.8, -12.2]
      for (const c of [4.0, 9.2]) oculus(stone, win, a, b, c, 5.0, 0.8)
    }
  }

  // ---------------------------------------- the stone centre and passage
  const XF = 8.3, XB = -7.7, YH = 7.0, ZS = 6.4, HW = 1.65, ZE = 8.1, ZT = 10.4
  arcade(stone, (u, w, z): V3 => [XF - w, u, z], -YH, YH, XF - XB, 0, ZE, [{ c: 0, hw: HW, zs: ZS }], 10, true)
  // the arch's moulded surround on both faces
  for (const [x, nx] of [[XF, 1], [XB, -1]] as [number, number][]) {
    const P = (y: number, z: number): V3 => [x + nx * 0.06, y, z]
    for (let k = 0; k < 10; k++) {
      const t0 = (k / 10) * Math.PI, t1 = ((k + 1) / 10) * Math.PI
      const R0 = HW, R1 = HW + 0.4
      face(stone, [P(R0 * Math.cos(t0), ZS + R0 * Math.sin(t0)), P(R1 * Math.cos(t0), ZS + R1 * Math.sin(t0)), P(R1 * Math.cos(t1), ZS + R1 * Math.sin(t1)), P(R0 * Math.cos(t1), ZS + R0 * Math.sin(t1))], [nx, 0, 0])
    }
    // keystone
    bbox(stone, stone, Math.min(x, x + nx * 0.35), -0.35, Math.max(x, x + nx * 0.35), 0.35, ZS + HW - 0.1, ZE, 0.05)
  }
  // field side: pedestals and four banded Doric columns
  for (const s of [1, -1]) {
    bbox(stone, stone, XF, s > 0 ? 2.5 : -7.0, 9.3, s > 0 ? 7.0 : -2.5, 0, 1.3, 0.1)
    for (const y of [3.5, 6.2]) bandedColumn(stone, 8.85, s * y, 1.3, ZE, 0.5)
    // the niche between the columns
    archNiche(slate, [XF, s > 0 ? 2.5 : -7.0], [XF, s > 0 ? 7.0 : -2.5], s > 0 ? 2.35 : 2.15, 0.6, 2.4, 4.8)
    // city side: pilasters on a banded ground
    bbox(stone, stone, -8.3, s > 0 ? 2.5 : -7.0, XB, s > 0 ? 7.0 : -2.5, 0, 1.0, 0.1)
    for (const y of [3.5, 6.2]) {
      bbox(stone, stone, -8.25, s * y - 0.5, XB, s * y + 0.5, 1.0, ZE - 0.3, 0.06)
      bbox(stone, stone, -8.4, s * y - 0.62, XB, s * y + 0.62, ZE - 0.45, ZE, 0.08)
    }
    for (let z = 1.6; z < ZE - 0.6; z += 0.9) bbox(stone, null, XB - 0.08, s > 0 ? 2.1 : -7.0, XB, s > 0 ? 7.0 : -2.1, z, z + 0.08, 0.02)
  }
  // entablature over the centre, both faces
  bbox(stone, stone, -8.45, -YH - 0.3, 9.45, YH + 0.3, ZE, ZT - 0.45, 0.06)
  bbox(stone, stone, -8.65, -YH - 0.5, 9.65, YH + 0.5, ZT - 0.45, ZT, 0.15)

  // ----------------------------------------------- pediments and attic
  const AX0 = -5.4, AX1 = 5.9, AY = 6.4, AT = 14.0
  for (const [x0, x1, front] of [[AX1 - 0.3, 9.5, 9.5], [-8.5, AX0 + 0.3, -8.5]] as [number, number, number][]) {
    gabled(lead, stone, x0, -YH - 0.3, x1, YH + 0.3, ZT, 13.0, true, 0.15)
    // raking cornice: a thicker stone edge on the gable face
    const nx = Math.sign(front)
    for (const s of [1, -1]) {
      const a: V3 = [front + nx * 0.12, s * (YH + 0.45), ZT - 0.05], b: V3 = [front + nx * 0.12, 0, 13.15]
      face(stone, [a, b, [b[0], b[1], b[2] + 0.35], [a[0], a[1], a[2] + 0.35]], [nx, 0, 0])
      face(stone, [[a[0], a[1], a[2] + 0.35], [b[0], b[1], b[2] + 0.35], [b[0] - nx * 0.5, b[1], b[2] + 0.35], [a[0] - nx * 0.5, a[1], a[2] + 0.35]], [0, s * 2.6, s * 7.3])
    }
    // the arms of the city in the tympanum: a shield between two lions
    const xr = front + nx * 0.05
    const sh: V3[] = [[xr, -0.75, 10.6], [xr, 0.75, 10.6], [xr, 0.75, 11.9], [xr, 0, 12.4], [xr, -0.75, 11.9]]
    shieldSlab(stone, sh, nx * 0.35)
    for (const s of [1, -1]) bbox(stone, stone, Math.min(xr, xr + nx * 0.3), s > 0 ? 1.0 : -2.6, Math.max(xr, xr + nx * 0.3), s > 0 ? 2.6 : -1.0, 10.5, 11.4, 0.15)
  }
  prism(stone, rect(AX0, -AY, AX1, AY), ZT - 0.2, AT - 0.5, false)
  band(stone, rect(AX0, -AY, AX1, AY), AT - 0.5, AT, 0.25, 0.1)
  // window panels in the attic's sides
  for (const [a, b] of segs(rect(AX0, -AY, AX1, AY))) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 12) continue
    for (const c of [L * 0.3, L * 0.7]) rectOn(win, a, b, c, 0.6, 11.4, 12.9, 0.05)
  }
  // the balustrade, with piers at the corners
  const bo = rect(AX0 - 0.1, -AY - 0.1, AX1 + 0.1, AY + 0.1), bi = rect(AX0 + 0.15, -AY + 0.15, AX1 - 0.15, AY - 0.15)
  walls(stone, bo, AT, AT + 0.85)
  walls(stone, [...bi].reverse(), AT, AT + 0.85)
  for (let k = 0; k < 4; k++) {
    const l = (k + 1) % 4
    stone.quad([bo[k][0], bo[k][1], AT + 0.85], [bo[l][0], bo[l][1], AT + 0.85], [bi[l][0], bi[l][1], AT + 0.85], [bi[k][0], bi[k][1], AT + 0.85])
  }
  for (const [a, b] of segs(bo)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.round(L / 1.1)
    for (let i = 1; i < n; i++) rectOn(slate, a, b, (L * i) / n - L / n / 2 + 0.15, L / n / 2 - 0.2, AT + 0.15, AT + 0.6, 0.03)
  }
  for (const c of bo) bbox(stone, stone, c[0] - 0.3, c[1] - 0.3, c[0] + 0.3, c[1] + 0.3, AT, AT + 1.05, 0.06)
  cap(slate, bi, AT + 0.05)

  // ---------------------------------------------------- dome and lantern
  const DX = 0.25, DY = 0, DR = 4.05
  const drum = ngonF(DX, DY, DR + 0.15, 8)
  prism(stone, drum, AT, 15.0, false)
  band(stone, drum, 14.8, 15.1, 0.15, 0.06, false)
  const prof: XY[] = [[DR + 0.05, 15.0]]
  for (let k = 1; k <= 7; k++) { const t = (k / 7) * (Math.PI / 2); prof.push([0.45 * DR + (DR - 0.45 * DR) * Math.cos(t) + 0.05 * Math.cos(t), 15.0 + 3.9 * Math.sin(t)]) }
  prof.push([0, 18.95])
  lathe(slate, DX, DY, prof.map(([r, z]) => [r / Math.cos(Math.PI / 8), z] as XY), 8, Math.PI / 8)
  // pale lead ribs on the dome's eight corners
  for (let k = 0; k < 8; k++) {
    const a = -Math.PI / 2 - Math.PI / 8 + (k * Math.PI) / 4
    const R = 1 / Math.cos(Math.PI / 8)
    rib(lead, prof.slice(0, -1).map(([r, z]) => [DX + r * R * Math.cos(a) * 1.01, DY + r * R * Math.sin(a) * 1.01, z + 0.02] as V3), 0.16)
  }
  // lantern
  const L0 = 18.9, L1 = 22.3
  const lo = ngonF(DX, DY, 1.65, 8)
  prism(stone, ngonF(DX, DY, 1.95, 8), 18.4, L0 + 0.1)
  openStage(stone, lo, L0 + 0.1, L1, 20.5, 0.36, 0.25, 6)
  cap(stone, lo, L0 + 0.12)
  lathe(slate, DX, DY, [[0.5, L0 + 0.1], [0.45, L0 + 0.8], [0, L0 + 1.0]], 6)
  segs(lo).forEach(([a, b], k) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (k % 2 === 0) dialOn(slate, gold, a, b, L / 2, 21.7, 0.5, 0.0, 0.08, 12)
  })
  band(stone, lo, L1, L1 + 0.4, 0.22, 0.1)
  lathe(lead, DX, DY, [[1.75, L1 + 0.4], [1.55, L1 + 0.8], [1.0, L1 + 1.5], [0.45, L1 + 1.95], [0.25, L1 + 2.15], [0, L1 + 2.2]], 8, Math.PI / 8)
  lathe(lead, DX, DY, [[0.22, L1 + 2.1], [0.12, 26.3], [0, 26.35]], 6)
  ball(gold, DX, DY, 25.0, 0.28, 8)
  vane(lead, gold, DX, DY, 26.2, 28.2, 0.45, 0.06)

  const flood = floodAll
  return [
    { part: stone, material: { ...finish('muiderpoort-sandstone', 0xd9d2c3), floodlight: flood } },
    { part: brick, material: { ...finish('muiderpoort-brick', 0x86615a), floodlight: (_p: V3, n: V3) => (n[2] > 0.7 ? 0.1 : 0.5) } },
    { part: slate, material: { ...finish('muiderpoort-slate', 0x5d646c), floodlight: flood } },
    { part: lead, material: { ...finish('muiderpoort-lead', 0xbcc2c6), floodlight: flood } },
    { part: gold, material: { ...finish('muiderpoort-gilt', 0xc9a24a, 0.45), floodlight: flood } },
    { part: win, material: { ...PALETTE.window } },
  ]
}

/** A round window in a stone ring on wall a→b. */
function oculus(stone: Part, win: Part, a: XY, b: XY, c: number, z: number, r: number) {
  ring(stone, a, b, c, z, r, r + 0.3, 0.06)
  disc(win, a, b, c, z, r, 0.04)
}
function ring(p: Part, a: XY, b: XY, c: number, z: number, r0: number, r1: number, out: number, seg = 10) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
  const P = (s: number, zz: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, zz]
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
    face(p, [P(c + r0 * Math.cos(t0), z + r0 * Math.sin(t0)), P(c + r1 * Math.cos(t0), z + r1 * Math.sin(t0)), P(c + r1 * Math.cos(t1), z + r1 * Math.sin(t1)), P(c + r0 * Math.cos(t1), z + r0 * Math.sin(t1))], n)
  }
}
function disc(p: Part, a: XY, b: XY, c: number, z: number, r: number, out: number, seg = 10) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
  const P = (s: number, zz: number): V3 => [a[0] + u[0] * s + n[0] * out, a[1] + u[1] * s + n[1] * out, zz]
  for (let k = 0; k < seg; k++) {
    const t0 = (k / seg) * 2 * Math.PI, t1 = ((k + 1) / seg) * 2 * Math.PI
    face(p, [P(c, z), P(c + r * Math.cos(t0), z + r * Math.sin(t0)), P(c + r * Math.cos(t1), z + r * Math.sin(t1))], n)
  }
}
/** A shallow arched niche on wall a→b: a dark panel. */
function archNiche(p: Part, a: XY, b: XY, c: number, hw: number, z0: number, zs: number) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n: V3 = [u[1], -u[0], 0]
  const P = (s: number, zz: number): V3 => [a[0] + u[0] * s + n[0] * 0.04, a[1] + u[1] * s + n[1] * 0.04, zz]
  face(p, [P(c - hw, z0), P(c + hw, z0), P(c + hw, zs), P(c - hw, zs)], n)
  for (let k = 0; k < 6; k++) {
    const t0 = (k / 6) * Math.PI, t1 = ((k + 1) / 6) * Math.PI
    face(p, [P(c, zs), P(c + hw * Math.cos(t0), zs + hw * Math.sin(t0)), P(c + hw * Math.cos(t1), zs + hw * Math.sin(t1))], n)
  }
}
/** A flat convex slab from a polygon on a wall, `d` thick along x. */
function shieldSlab(p: Part, pts: V3[], d: number) {
  const nx = Math.sign(d)
  const front = pts.map(([x, y, z]) => [x + d, y, z] as V3)
  face(p, front, [nx, 0, 0])
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    const m: V3 = [0, (pts[i][1] + pts[j][1]) / 2, (pts[i][2] + pts[j][2]) / 2 - 11.5]
    face(p, [pts[i], pts[j], front[j], front[i]], m)
  }
}

if (import.meta.main) await save('amsterdam-muiderpoort', 'Muiderpoort', [52.363727, 4.919481], 56.8, build(), 6500)
